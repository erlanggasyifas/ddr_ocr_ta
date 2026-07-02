"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Tab = "fields" | "time";

interface Field {
  group_name?: string;
  field_key: string;
  field_value?: string;
}

interface TimeBreakdown {
  period_date?: string;
  start_time?: string;
  end_time?: string;
  elapsed?: string;
  depth?: string;
  pt_npt?: string;
  code?: string;
  description?: string;
  operations?: string;
}

interface DocumentInfo {
  id: number;
  filename: string;
  report_date?: string;
  well_name?: string;
  operator?: string;
  created_at?: string;
}

interface DetailItem {
  document: DocumentInfo;
  fields: Field[];
  time_breakdown: TimeBreakdown[];
}

interface DetailApiResponse {
  total: number;
  detail: DetailItem[];
}

interface TbApiResponse {
  total: number;
  time_breakdown: TimeBreakdown[];
}

/* ── Icons ── */
function IconChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconFile() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
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

/* ── Skeleton helpers ── */
function Sk({ w, h }: { w: string; h: string }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: "4px" }} />;
}

/* ══════════════════════════════════════════
   PT/NPT DONUT CHART (pure SVG)
══════════════════════════════════════════ */
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  const R = 52;
  const cx = 64;
  const cy = 64;
  const strokeW = 18;
  const circumference = 2 * Math.PI * R;

  let offset = 0;
  const slices = data.map((d) => {
    const pct = d.value / total;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const slice = { ...d, dash, gap, offset, pct };
    offset += dash;
    return slice;
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      <svg width="128" height="128" viewBox="0 0 128 128" style={{ flexShrink: 0 }}>
        {/* track */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--color-bg-overlay)" strokeWidth={strokeW} />
        {slices.map((s, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke={s.color}
            strokeWidth={strokeW}
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset + circumference / 4}
            strokeLinecap="butt"
            style={{ transition: "stroke-dasharray 600ms ease" }}
          />
        ))}
        {/* center label */}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--color-text-primary)" fontSize="18" fontWeight="300" fontFamily="var(--font-mono)">{total}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="var(--color-text-muted)" fontSize="8" fontFamily="var(--font-sans)" letterSpacing="1">AKTIVITAS</text>
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: s.color, flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, fontSize: "0.6875rem", color: "var(--color-text-secondary)", fontWeight: 500 }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: "0.625rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                {s.value} · {(s.pct * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   DEPTH TIMELINE (pure SVG bar chart)
══════════════════════════════════════════ */
function DepthChart({ rows }: { rows: TimeBreakdown[] }) {
  const parsed = rows
    .map((r, i) => ({ i, depth: parseFloat(r.depth ?? ""), label: r.start_time ?? `#${i}` }))
    .filter((r) => !isNaN(r.depth) && r.depth > 0)
    .slice(0, 24);

  if (parsed.length < 2) return (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Data depth tidak tersedia</p>
    </div>
  );

  const maxD = Math.max(...parsed.map((r) => r.depth));
  const W = 480;
  const H = 100;
  const padL = 36;
  const padB = 20;
  const chartW = W - padL - 8;
  const chartH = H - padB;
  const barW = Math.max(4, Math.floor(chartW / parsed.length) - 2);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
      {/* y-axis labels */}
      {[0, 0.5, 1].map((t) => {
        const val = Math.round(maxD * t);
        return (
          <g key={t}>
            <line x1={padL} y1={H - padB - chartH * t} x2={W - 8} y2={H - padB - chartH * t} stroke="var(--color-border-subtle)" strokeWidth="0.5" />
            <text x={padL - 4} y={H - padB - chartH * t + 3} textAnchor="end" fill="var(--color-text-muted)" fontSize="7" fontFamily="var(--font-mono)">{val}</text>
          </g>
        );
      })}

      {/* bars */}
      {parsed.map((r, i) => {
        const x = padL + (i / parsed.length) * chartW;
        const bh = (r.depth / maxD) * chartH;
        const y = H - padB - bh;
        return (
          <rect key={i} x={x} y={y} width={barW} height={bh} fill="var(--color-accent)" opacity="0.7" rx="1" />
        );
      })}

      {/* x baseline */}
      <line x1={padL} y1={H - padB} x2={W - 8} y2={H - padB} stroke="var(--color-border-default)" strokeWidth="0.5" />
    </svg>
  );
}

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */
export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const [docInfo, setDocInfo] = useState<DocumentInfo | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [timeBreakdown, setTimeBreakdown] = useState<TimeBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("fields");

  useEffect(() => {
    if (!id) return;
    fetchDetail();
  }, [id]);

  async function fetchDetail() {
    setLoading(true);
    setError(null);
    try {
      const [detailRes, tbRes] = await Promise.all([
        fetch(`${API_URL}/detail?document_id=${id}`),
        fetch(`${API_URL}/time_breakdown?document_id=${id}`),
      ]);
      if (!detailRes.ok) throw new Error(`Gagal mengambil detail (${detailRes.status})`);
      if (!tbRes.ok) throw new Error(`Gagal mengambil time breakdown (${tbRes.status})`);

      const detailJson: DetailApiResponse = await detailRes.json();
      const tbJson: TbApiResponse = await tbRes.json();

      const item = detailJson.detail?.[0] ?? null;
      if (item) {
        setDocInfo(item.document);
        setFields(item.fields ?? []);
      }
      setTimeBreakdown(tbJson.time_breakdown ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  /* group fields */
  const groupedFields: Record<string, Field[]> = {};
  fields.forEach((f) => {
    const g = f.group_name ?? "Lainnya";
    if (!groupedFields[g]) groupedFields[g] = [];
    groupedFields[g].push(f);
  });

  /* PT/NPT counts */
  const ptCount = timeBreakdown.filter((r) => r.pt_npt === "PT").length;
  const nptCount = timeBreakdown.filter((r) => r.pt_npt === "NPT").length;
  const otherCount = timeBreakdown.length - ptCount - nptCount;

  const donutData = [
    { label: "PT", value: ptCount, color: "var(--color-chart-pt)" },
    { label: "NPT", value: nptCount, color: "var(--color-chart-npt)" },
    { label: "Lainnya", value: otherCount, color: "var(--color-chart-other)" },
  ].filter((d) => d.value > 0);

  const TABS: { key: Tab; label: string }[] = [
    { key: "fields", label: `Fields (${fields.length})` },
    { key: "time", label: `Time Breakdown (${timeBreakdown.length})` },
  ];

  return (
    <div className="page-enter">

      {/* ── Back + title ── */}
      <div className="page-header">
        <Link
          href="/"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--color-text-muted)", textDecoration: "none", marginBottom: "14px", transition: "color var(--transition-fast)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          <IconChevronLeft />
          Dashboard
        </Link>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Sk w="40%" h="22px" />
            <Sk w="24%" h="12px" />
          </div>
        ) : (
          <>
            <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "var(--radius-md)", background: "var(--color-accent-subtle)", border: "0.5px solid var(--color-accent-dim)", color: "var(--color-accent)", flexShrink: 0 }}>
                <IconFile />
              </span>
              {docInfo?.filename ?? `DDR Report #${id}`}
            </h1>
            <p className="page-subtitle">
              {[docInfo?.well_name, docInfo?.operator, docInfo?.report_date].filter(Boolean).join(" · ") || `Dokumen #${id}`}
            </p>
          </>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: "24px" }}>
          <IconAlert />
          <div>
            <p style={{ margin: 0, fontWeight: 500, fontSize: "0.8125rem" }}>Gagal memuat data</p>
            <p style={{ margin: "2px 0 0", fontSize: "0.75rem", opacity: 0.8 }}>{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ── Stat row ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "10px", marginBottom: "20px" }}>
            <div className="stat-card">
              <div className="stat-label">Fields</div>
              <div className="stat-value">{fields.length}</div>
              <div className="stat-change flat">diekstrak</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Aktivitas</div>
              <div className="stat-value">{timeBreakdown.length}</div>
              <div className="stat-change flat">time breakdown</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">PT</div>
              <div className="stat-value" style={{ color: "var(--color-chart-pt)" }}>{ptCount}</div>
              <div className="stat-change flat">productive time</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">NPT</div>
              <div className="stat-value" style={{ color: "var(--color-chart-npt)" }}>{nptCount}</div>
              <div className="stat-change flat">non-productive</div>
            </div>
          </div>

          {/* ── Charts row ── */}
          {timeBreakdown.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginBottom: "20px" }}>
              {/* Donut */}
              <div className="card">
                <p className="card-title">Distribusi PT / NPT</p>
                <DonutChart data={donutData} />
              </div>

              {/* Depth timeline */}
              <div className="card">
                <p className="card-title">Depth per Aktivitas</p>
                <DepthChart rows={timeBreakdown} />
              </div>
            </div>
          )}

          {/* ── Tabs ── */}
          <div style={{ display: "flex", gap: "2px", borderBottom: "0.5px solid var(--color-border-subtle)", marginBottom: "16px" }}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "8px 16px",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  background: "transparent",
                  border: "none",
                  borderBottom: `2px solid ${activeTab === tab.key ? "var(--color-accent)" : "transparent"}`,
                  color: activeTab === tab.key ? "var(--color-accent)" : "var(--color-text-muted)",
                  cursor: "pointer",
                  marginBottom: "-0.5px",
                  transition: "color var(--transition-fast), border-color var(--transition-fast)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ══ FIELDS TAB ══ */}
          {activeTab === "fields" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {Object.keys(groupedFields).length === 0 && (
                <div className="empty-state">
                  <p className="empty-state-title">Belum ada field</p>
                  <p className="empty-state-sub">Tidak ada data yang berhasil diekstrak</p>
                </div>
              )}
              {Object.entries(groupedFields).map(([group, groupFields]) => (
                <div key={group} style={{ background: "var(--color-bg-surface)", border: "0.5px solid var(--color-border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
                  {/* group header */}
                  <div style={{ padding: "8px 16px", background: "var(--color-bg-elevated)", borderBottom: "0.5px solid var(--color-border-subtle)" }}>
                    <span style={{ fontSize: "0.625rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
                      {group}
                    </span>
                  </div>
                  {/* rows */}
                  {groupFields.map((f, i) => (
                    <div
                      key={i}
                      style={{ display: "flex", alignItems: "baseline", gap: "16px", padding: "10px 16px", borderBottom: i < groupFields.length - 1 ? "0.5px solid var(--color-border-subtle)" : "none" }}
                    >
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", minWidth: "200px", flexShrink: 0 }}>
                        {f.field_key}
                      </span>
                      <span style={{ fontSize: "0.8125rem", color: f.field_value ? "var(--color-text-primary)" : "var(--color-text-muted)", fontWeight: f.field_value ? 500 : 400, fontStyle: f.field_value ? "normal" : "italic" }}>
                        {f.field_value || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* ══ TIME BREAKDOWN TAB ══ */}
          {activeTab === "time" && (
            <div>
              {timeBreakdown.length === 0 && (
                <div className="empty-state">
                  <p className="empty-state-title">Belum ada data</p>
                  <p className="empty-state-sub">Tidak ada time breakdown yang diekstrak</p>
                </div>
              )}
              {timeBreakdown.length > 0 && (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        {["Mulai", "Selesai", "Elapsed", "Depth", "PT/NPT", "Kode", "Deskripsi", "Operasi"].map((h) => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeBreakdown.map((row, i) => (
                        <tr key={i}>
                          <td className="mono">{row.start_time ?? "—"}</td>
                          <td className="mono">{row.end_time ?? "—"}</td>
                          <td className="mono">{row.elapsed ?? "—"}</td>
                          <td className="mono">{row.depth ?? "—"}</td>
                          <td>
                            {row.pt_npt ? (
                              <span className={`badge ${row.pt_npt === "NPT" ? "badge-warning" : row.pt_npt === "PT" ? "badge-accent" : "badge-muted"}`}>
                                {row.pt_npt}
                              </span>
                            ) : (
                              <span style={{ color: "var(--color-text-muted)" }}>—</span>
                            )}
                          </td>
                          <td className="mono">{row.code ?? "—"}</td>
                          <td style={{ maxWidth: "280px" }}>{row.description ?? "—"}</td>
                          <td style={{ maxWidth: "200px" }}>{row.operations ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── Loading skeleton ── */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="stat-card">
                <Sk w="50%" h="10px" />
                <div style={{ marginTop: "10px" }}><Sk w="40%" h="24px" /></div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px" }}>
            <div className="card" style={{ height: "160px" }}><Sk w="100%" h="100%" /></div>
            <div className="card" style={{ height: "160px" }}><Sk w="100%" h="100%" /></div>
          </div>
          {[1,2,3].map(i => (
            <div key={i} style={{ background: "var(--color-bg-surface)", border: "0.5px solid var(--color-border-subtle)", borderRadius: "var(--radius-lg)", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <Sk w="30%" h="10px" />
              <Sk w="60%" h="12px" />
              <Sk w="45%" h="12px" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
