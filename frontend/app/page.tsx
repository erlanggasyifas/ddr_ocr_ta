"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import UploadModal from "@/components/UploadModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface Document {
  id: number;
  filename: string;
  report_date: string | null;
  well_name: string | null;
  operator: string | null;
  created_at: string | null;
}

interface DocumentsResponse {
  total: number;
  documents: Document[];
}

interface Well {
  well_pad_name: string;
  document_count: number;
  earliest_date: string | null;
  latest_date: string | null;
}

interface WellsResponse {
  total: number;
  wells: Well[];
}

function formatDate(raw: string | null) {
  if (!raw) return "—";
  try {
    return new Date(raw).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return raw;
  }
}

/* ── Icons ── */
function IconFile() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  );
}

function IconWell() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3" />
      <line x1="12" y1="8" x2="12" y2="22" />
      <path d="M8 14h8" />
      <path d="M9 18h6" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "1px" }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/* ── Skeleton row ── */
function SkeletonRow() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", background: "var(--color-bg-surface)", border: "0.5px solid var(--color-border-subtle)", borderRadius: "var(--radius-lg)" }}>
      <div className="skeleton" style={{ width: "36px", height: "36px", borderRadius: "var(--radius-md)", flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <div className="skeleton" style={{ width: "45%", height: "12px", borderRadius: "4px" }} />
        <div className="skeleton" style={{ width: "30%", height: "10px", borderRadius: "4px" }} />
      </div>
      <div className="skeleton" style={{ width: "80px", height: "10px", borderRadius: "4px" }} />
    </div>
  );
}

/* ── Document row card ── */
function DocRow({ doc }: { doc: Document }) {
  return (
    <Link
      href={`/detail/${doc.id}`}
      style={{ display: "flex", alignItems: "center", gap: "16px", padding: "14px 20px", background: "var(--color-bg-surface)", border: "0.5px solid var(--color-border-subtle)", borderRadius: "var(--radius-lg)", textDecoration: "none", transition: "border-color var(--transition-fast), background var(--transition-fast)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-accent-dim)";
        (e.currentTarget as HTMLElement).style.background = "var(--color-bg-elevated)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border-subtle)";
        (e.currentTarget as HTMLElement).style.background = "var(--color-bg-surface)";
      }}
    >
      <div style={{ width: "36px", height: "36px", borderRadius: "var(--radius-md)", background: "var(--color-bg-overlay)", border: "0.5px solid var(--color-border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", flexShrink: 0 }}>
        <IconFile />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: "0.8125rem", fontWeight: 500, color: "var(--color-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {doc.filename}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
          <span style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
            {doc.well_name ?? <span style={{ fontStyle: "italic" }}>—</span>}
          </span>
          {doc.operator && (
            <>
              <span style={{ color: "var(--color-border-default)", fontSize: "0.6875rem" }}>·</span>
              <span style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)" }}>{doc.operator}</span>
            </>
          )}
        </div>
      </div>

      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 500, color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>
          {doc.report_date ?? "—"}
        </p>
        <p style={{ margin: "3px 0 0", fontSize: "0.625rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
          upload {formatDate(doc.created_at)}
        </p>
      </div>

      <div style={{ color: "var(--color-text-muted)", flexShrink: 0 }}>
        <IconChevronRight />
      </div>
    </Link>
  );
}

/* ── Well row card ── */
function WellRow({ well }: { well: Well }) {
  return (
    <Link
      href={`/well/${encodeURIComponent(well.well_pad_name)}`}
      style={{ display: "flex", alignItems: "center", gap: "16px", padding: "14px 20px", background: "var(--color-bg-surface)", border: "0.5px solid var(--color-border-subtle)", borderRadius: "var(--radius-lg)", textDecoration: "none", transition: "border-color var(--transition-fast), background var(--transition-fast)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-accent-dim)";
        (e.currentTarget as HTMLElement).style.background = "var(--color-bg-elevated)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border-subtle)";
        (e.currentTarget as HTMLElement).style.background = "var(--color-bg-surface)";
      }}
    >
      <div style={{ width: "36px", height: "36px", borderRadius: "var(--radius-md)", background: "var(--color-accent-subtle)", border: "0.5px solid var(--color-accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-accent)", flexShrink: 0 }}>
        <IconWell />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: "0.8125rem", fontWeight: 500, color: "var(--color-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "var(--font-mono)" }}>
          {well.well_pad_name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
          <span style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)" }}>
            {well.document_count} dokumen
          </span>
          {well.earliest_date && (
            <>
              <span style={{ color: "var(--color-border-default)", fontSize: "0.6875rem" }}>·</span>
              <span style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                {well.earliest_date}
                {well.latest_date && well.latest_date !== well.earliest_date ? ` — ${well.latest_date}` : ""}
              </span>
            </>
          )}
        </div>
      </div>

      <div style={{ color: "var(--color-text-muted)", flexShrink: 0 }}>
        <IconChevronRight />
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */
export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filtered, setFiltered] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);

  const [wells, setWells] = useState<Well[]>([]);
  const [wellsLoading, setWellsLoading] = useState(false);
  const [wellsError, setWellsError] = useState<string | null>(null);

  // "documents" | "wells"
  const [activeView, setActiveView] = useState<"documents" | "wells">("documents");

  useEffect(() => {
    fetchDocuments();
    fetchWells();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q
        ? documents.filter(
            (d) =>
              d.filename.toLowerCase().includes(q) ||
              (d.well_name ?? "").toLowerCase().includes(q) ||
              (d.operator ?? "").toLowerCase().includes(q) ||
              (d.report_date ?? "").toLowerCase().includes(q),
          )
        : documents,
    );
  }, [search, documents]);

  async function fetchDocuments() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/documents`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json: DocumentsResponse = await res.json();
      setDocuments(json.documents ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchWells() {
    setWellsLoading(true);
    setWellsError(null);
    try {
      const res = await fetch(`${API_URL}/wells`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json: WellsResponse = await res.json();
      setWells(json.wells ?? []);
    } catch (e) {
      setWellsError((e as Error).message);
    } finally {
      setWellsLoading(false);
    }
  }

  function handleRefresh() {
    fetchDocuments();
    fetchWells();
  }

  const isLoading = loading || wellsLoading;

  return (
    <div className="page-enter">
      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={() => { setUploadOpen(false); fetchDocuments(); fetchWells(); }}
      />

      {/* ── Page header ── */}
      <div className="page-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Semua laporan DDR yang sudah diekstrak</p>
        </div>
        <button
          onClick={() => setUploadOpen(true)}
          className="btn btn-primary"
          style={{ marginBottom: "2px" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 16V4M8 8l4-4 4 4" />
            <path d="M4 20h16" />
          </svg>
          Upload PDF
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "10px", marginBottom: "24px" }}>
        <div className="stat-card">
          <div className="stat-label">Total dokumen</div>
          <div className="stat-value">{loading ? "—" : documents.length}</div>
          <div className="stat-change flat">semua waktu</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total sumur</div>
          <div className="stat-value">{wellsLoading ? "—" : wells.length}</div>
          <div className="stat-change flat">well pad</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Ditampilkan</div>
          <div className="stat-value">{loading ? "—" : activeView === "documents" ? filtered.length : wells.length}</div>
          <div className="stat-change flat">{search && activeView === "documents" ? "filter aktif" : "semua"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Model OCR</div>
          <div className="stat-value" style={{ fontSize: "1rem", paddingTop: "6px", letterSpacing: "-0.01em" }}>
            PaddleOCR
          </div>
          <div className="stat-change up">WER 0.77</div>
        </div>
      </div>

      {/* ── View toggle tabs ── */}
      <div style={{ display: "flex", gap: "2px", borderBottom: "0.5px solid var(--color-border-subtle)", marginBottom: "16px" }}>
        {(["documents", "wells"] as const).map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            style={{
              padding: "8px 16px",
              fontSize: "0.8125rem",
              fontWeight: 500,
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${activeView === view ? "var(--color-accent)" : "transparent"}`,
              color: activeView === view ? "var(--color-accent)" : "var(--color-text-muted)",
              cursor: "pointer",
              marginBottom: "-0.5px",
              transition: "color var(--transition-fast), border-color var(--transition-fast)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {view === "documents" ? `Dokumen (${documents.length})` : `Well View (${wells.length})`}
          </button>
        ))}
      </div>

      {/* ── Search + Refresh bar (only for documents view) ── */}
      {activeView === "documents" && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", pointerEvents: "none", display: "flex" }}>
              <IconSearch />
            </span>
            <input
              type="text"
              className="input"
              placeholder="Cari filename, sumur, operator, tanggal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: "34px", paddingRight: search ? "32px" : "12px" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="btn-ghost btn-icon"
                style={{ position: "absolute", right: "4px", top: "50%", transform: "translateY(-50%)", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}
              >
                <IconX />
              </button>
            )}
          </div>
          <button onClick={handleRefresh} className="btn btn-secondary" disabled={isLoading} style={{ flexShrink: 0 }}>
            <IconRefresh />
            Refresh
          </button>
        </div>
      )}

      {/* ── Refresh bar (wells view) ── */}
      {activeView === "wells" && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
          <button onClick={handleRefresh} className="btn btn-secondary" disabled={isLoading} style={{ flexShrink: 0 }}>
            <IconRefresh />
            Refresh
          </button>
        </div>
      )}

      {/* ══════════════════════════════════
          DOCUMENTS VIEW
      ══════════════════════════════════ */}
      {activeView === "documents" && (
        <>
          {/* Loading */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="alert alert-danger">
              <IconAlert />
              <div>
                <p style={{ margin: 0, fontWeight: 500, fontSize: "0.8125rem" }}>Gagal memuat data</p>
                <p style={{ margin: "2px 0 0", fontSize: "0.75rem", opacity: 0.8 }}>{error}</p>
              </div>
            </div>
          )}

          {/* Empty database */}
          {!loading && !error && documents.length === 0 && (
            <div className="empty-state">
              <p className="empty-state-title">Belum ada dokumen</p>
              <p className="empty-state-sub" style={{ marginBottom: "16px" }}>
                Upload PDF DDR untuk mulai mengekstrak data
              </p>
              <button onClick={() => setUploadOpen(true)} className="btn btn-primary">
                Upload sekarang
              </button>
            </div>
          )}

          {/* No search result */}
          {!loading && !error && documents.length > 0 && filtered.length === 0 && (
            <div className="empty-state">
              <p className="empty-state-title">Tidak ada hasil</p>
              <p className="empty-state-sub" style={{ marginBottom: "12px" }}>
                Tidak ada dokumen yang cocok dengan &ldquo;{search}&rdquo;
              </p>
              <button onClick={() => setSearch("")} className="btn btn-ghost" style={{ fontSize: "0.8125rem", color: "var(--color-accent)" }}>
                Hapus filter
              </button>
            </div>
          )}

          {/* Document list */}
          {!loading && !error && filtered.length > 0 && (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {filtered.length} dokumen
                </span>
                <span style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                  Filename · Sumur · Operator · Tanggal laporan
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {filtered.map((doc) => <DocRow key={doc.id} doc={doc} />)}
              </div>
            </>
          )}
        </>
      )}

      {/* ══════════════════════════════════
          WELL VIEW
      ══════════════════════════════════ */}
      {activeView === "wells" && (
        <>
          {/* Loading */}
          {wellsLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
            </div>
          )}

          {/* Error */}
          {!wellsLoading && wellsError && (
            <div className="alert alert-danger">
              <IconAlert />
              <div>
                <p style={{ margin: 0, fontWeight: 500, fontSize: "0.8125rem" }}>Gagal memuat data sumur</p>
                <p style={{ margin: "2px 0 0", fontSize: "0.75rem", opacity: 0.8 }}>{wellsError}</p>
              </div>
            </div>
          )}

          {/* Empty */}
          {!wellsLoading && !wellsError && wells.length === 0 && (
            <div className="empty-state">
              <p className="empty-state-title">Belum ada data sumur</p>
              <p className="empty-state-sub" style={{ marginBottom: "16px" }}>
                Upload PDF DDR untuk mulai melihat data per sumur
              </p>
              <button onClick={() => setUploadOpen(true)} className="btn btn-primary">
                Upload sekarang
              </button>
            </div>
          )}

          {/* Well list */}
          {!wellsLoading && !wellsError && wells.length > 0 && (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {wells.length} sumur
                </span>
                <span style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                  Well Pad Name · Jumlah Dokumen · Rentang Tanggal
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {wells.map((well) => <WellRow key={well.well_pad_name} well={well} />)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
