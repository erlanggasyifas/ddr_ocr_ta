"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

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
   1. MULTICOLOR LINE CHART (Depth Progress by Description)
   Full Width Expansive Chart
══════════════════════════════════════════ */
const PALETTE = [
  "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6",
  "#06b6d4", "#f97316", "#14b8a6", "#6366f1", "#ef4444"
];

function MultiColorLineChart({ rows }: { rows: TimeBreakdown[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const parsed = useMemo(() => {
    return rows
      .map((r, i) => ({
        i,
        depth: parseFloat(r.depth ?? ""),
        time: r.start_time ?? `#${i + 1}`,
        desc: (r.description ?? "Other Operations").trim(),
        code: r.code ?? "—",
        elapsed: r.elapsed ?? "0",
      }))
      .filter((r) => !isNaN(r.depth) && r.depth > 0);
  }, [rows]);

  // Assign color per unique description
  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    let colorIdx = 0;
    parsed.forEach((p) => {
      if (!map[p.desc]) {
        map[p.desc] = PALETTE[colorIdx % PALETTE.length];
        colorIdx++;
      }
    });
    return map;
  }, [parsed]);

  if (parsed.length < 2) {
    return (
      <div style={{ padding: "32px", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
          Data kedalaman (depth) tidak cukup untuk menggambar grafik garis.
        </p>
      </div>
    );
  }

  const maxD = Math.max(...parsed.map((r) => r.depth));
  const minD = Math.max(0, Math.min(...parsed.map((r) => r.depth)) - 50);
  const rangeD = maxD - minD || 100;

  // Expanded dimensions for full-width presentation
  const W = 860;
  const H = 220;
  const padL = 55;
  const padR = 20;
  const padT = 20;
  const padB = 30;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const points = parsed.map((p, idx) => {
    const x = padL + (idx / (parsed.length - 1)) * chartW;
    const y = padT + (1 - (p.depth - minD) / rangeD) * chartH;
    return { ...p, x, y, color: colorMap[p.desc] };
  });

  const hoveredPoint = hoverIdx !== null ? points[hoverIdx] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ position: "relative" }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
          {/* Y-axis grid & labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const val = Math.round(minD + rangeD * t);
            const y = padT + (1 - t) * chartH;
            return (
              <g key={t}>
                <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="var(--color-border-subtle)" strokeWidth="0.5" strokeDasharray="3 3" />
                <text x={padL - 8} y={y + 3} textAnchor="end" fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)">
                  {val}m
                </text>
              </g>
            );
          })}

          {/* Multicolored Line Segments */}
          {points.map((p, idx) => {
            if (idx === 0) return null;
            const prev = points[idx - 1];
            return (
              <line
                key={`line-${idx}`}
                x1={prev.x}
                y1={prev.y}
                x2={p.x}
                y2={p.y}
                stroke={p.color}
                strokeWidth="3"
                strokeLinecap="round"
                style={{ transition: "all 300ms ease" }}
              />
            );
          })}

          {/* Scatter Points */}
          {points.map((p, idx) => {
            const isHovered = hoverIdx === idx;
            return (
              <g key={`point-${idx}`} style={{ cursor: "pointer" }}>
                {/* Hit box for easy hover */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={14}
                  fill="transparent"
                  onMouseEnter={() => setHoverIdx(idx)}
                  onMouseLeave={() => setHoverIdx(null)}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6.5 : 4}
                  fill={p.color}
                  stroke="var(--color-bg-surface)"
                  strokeWidth="1.5"
                  style={{ transition: "all 150ms ease" }}
                  pointerEvents="none"
                />
              </g>
            );
          })}

          {/* X Baseline */}
          <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--color-border-default)" strokeWidth="1" />
        </svg>

        {/* Tooltip Overlay */}
        {hoveredPoint && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "16px",
              background: "var(--color-bg-elevated)",
              border: `1.5px solid ${hoveredPoint.color}`,
              padding: "8px 12px",
              borderRadius: "var(--radius-md)",
              boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
              fontSize: "0.75rem",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: hoveredPoint.color }} />
              <strong style={{ color: "var(--color-text-primary)", fontSize: "0.8125rem" }}>{hoveredPoint.desc}</strong>
            </div>
            <div style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
              Jam {hoveredPoint.time} · Depth: <strong style={{ color: "var(--color-text-primary)" }}>{hoveredPoint.depth} mMD</strong> ({hoveredPoint.elapsed} hrs)
            </div>
          </div>
        )}
      </div>

      {/* Legend below chart */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 18px", padding: "10px 16px", background: "var(--color-bg-surface)", borderRadius: "var(--radius-md)", border: "0.5px solid var(--color-border-subtle)" }}>
        {Object.entries(colorMap).map(([desc, color]) => (
          <div key={desc} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: color, flexShrink: 0 }} />
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "220px" }}>{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   2. DESCRIPTION BREAKDOWN BAR CHART (PT / NPT)
══════════════════════════════════════════ */
function DescriptionBreakdownCard({
  title,
  rows,
  badgeType,
  emptyMessage,
}: {
  title: string;
  rows: TimeBreakdown[];
  badgeType: "PT" | "NPT";
  emptyMessage: string;
}) {
  const aggregated = useMemo(() => {
    const map: Record<string, { hours: number; count: number; code: string }> = {};
    let totalHrs = 0;

    rows.forEach((r) => {
      const desc = (r.description ?? "Lainnya").trim() || "Lainnya";
      const hrs = parseFloat(r.elapsed ?? "0") || 0;
      totalHrs += hrs;
      if (!map[desc]) map[desc] = { hours: 0, count: 0, code: r.code ?? "—" };
      map[desc].hours += hrs;
      map[desc].count += 1;
    });

    const list = Object.entries(map).map(([desc, data]) => ({
      desc,
      ...data,
      pct: totalHrs > 0 ? (data.hours / totalHrs) * 100 : 0,
    }));

    list.sort((a, b) => b.hours - a.hours);
    return { list, totalHrs };
  }, [rows]);

  const barColor = badgeType === "PT" ? "var(--color-chart-pt)" : "var(--color-chart-npt)";
  const badgeClass = badgeType === "PT" ? "badge-accent" : "badge-warning";

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <p className="card-title" style={{ margin: 0 }}>{title}</p>
        <span className={`badge ${badgeClass}`} style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem" }}>
          {aggregated.totalHrs.toFixed(1)} Jam
        </span>
      </div>

      {aggregated.list.length === 0 ? (
        <div style={{ padding: "24px 12px", textAlign: "center", margin: "auto 0" }}>
          <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--color-text-muted)", fontStyle: "italic" }}>
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {aggregated.list.map((item, idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "8px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--color-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  <span style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", marginRight: "6px" }}>[{item.code}]</span>
                  {item.desc}
                </span>
                <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--color-text-secondary)", flexShrink: 0 }}>
                  {item.hours.toFixed(1)}h <span style={{ color: "var(--color-text-muted)", fontSize: "0.625rem" }}>({item.pct.toFixed(0)}%)</span>
                </span>
              </div>
              {/* Progress bar */}
              <div style={{ width: "100%", height: "6px", background: "var(--color-bg-overlay)", borderRadius: "3px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${item.pct}%`,
                    height: "100%",
                    background: barColor,
                    borderRadius: "3px",
                    transition: "width 500ms ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   PAGE OVERHAUL
══════════════════════════════════════════ */
export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const [docInfo, setDocInfo] = useState<DocumentInfo | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [timeBreakdown, setTimeBreakdown] = useState<TimeBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  /* ── Extract 24 Hours Summary & Forecast ── */
  const summary24h = useMemo(() => {
    const summaryField = fields.find((f) => f.field_key === "24_hours_summary" || f.field_key.includes("summary"));
    const forecastField = fields.find((f) => f.field_key === "24_hours_forecast" || f.field_key.includes("forecast"));
    const statusField = fields.find((f) => f.field_key === "status");
    return {
      summary: summaryField?.field_value ?? "Tidak ada ringkasan 24 jam.",
      forecast: forecastField?.field_value,
      status: statusField?.field_value,
    };
  }, [fields]);

  /* ── Extract AFE & Report Details Table ── */
  const afeFields = useMemo(() => {
    return fields.filter((f) => f.group_name === "afe" || (f.group_name && f.group_name.toLowerCase().includes("afe")));
  }, [fields]);

  /* ── PT / NPT & Elapsed Time Calculations ── */
  const stats = useMemo(() => {
    let ptCount = 0;
    let nptCount = 0;
    let otherCount = 0;
    let ptHours = 0;
    let nptHours = 0;
    let otherHours = 0;

    timeBreakdown.forEach((r) => {
      const hrs = parseFloat(r.elapsed ?? "0") || 0;
      if (r.pt_npt === "PT") {
        ptCount++;
        ptHours += hrs;
      } else if (r.pt_npt === "NPT") {
        nptCount++;
        nptHours += hrs;
      } else {
        otherCount++;
        otherHours += hrs;
      }
    });

    const totalHours = ptHours + nptHours + otherHours;
    return {
      ptCount,
      nptCount,
      otherCount,
      ptHours,
      nptHours,
      otherHours,
      totalHours,
    };
  }, [timeBreakdown]);

  const ptRows = useMemo(() => timeBreakdown.filter((r) => r.pt_npt === "PT"), [timeBreakdown]);
  const nptRows = useMemo(() => timeBreakdown.filter((r) => r.pt_npt === "NPT"), [timeBreakdown]);

  return (
    <div className="page-enter">
      {/* ── Back + Title ── */}
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
            <Sk w="40%" h="24px" />
            <Sk w="25%" h="14px" />
          </div>
        ) : (
          <>
            <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", borderRadius: "var(--radius-md)", background: "var(--color-accent-subtle)", border: "0.5px solid var(--color-accent-dim)", color: "var(--color-accent)", flexShrink: 0 }}>
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

      {/* ── Error Banner ── */}
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: "24px" }}>
          <IconAlert />
          <div>
            <p style={{ margin: 0, fontWeight: 500, fontSize: "0.8125rem" }}>Gagal memuat data laporan</p>
            <p style={{ margin: "2px 0 0", fontSize: "0.75rem", opacity: 0.8 }}>{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ══════════════════════════════════
              1. OVERVIEW STAT CARDS (4 Cards)
          ══════════════════════════════════ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "10px", marginBottom: "20px" }}>
            <div className="stat-card">
              <div className="stat-label">Total Aktivitas</div>
              <div className="stat-value">{timeBreakdown.length}</div>
              <div className="stat-change flat">baris operasi</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Jam Kerja</div>
              <div className="stat-value">{stats.totalHours.toFixed(1)} <span style={{ fontSize: "1rem", fontWeight: 400 }}>Jam</span></div>
              <div className="stat-change flat">elapsed time</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Productive Time (PT)</div>
              <div className="stat-value" style={{ color: "var(--color-chart-pt)" }}>{stats.ptHours.toFixed(1)} <span style={{ fontSize: "1rem", fontWeight: 400 }}>Jam</span></div>
              <div className="stat-change flat">{stats.ptCount} aktivitas</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Non-Productive (NPT)</div>
              <div className="stat-value" style={{ color: "var(--color-chart-npt)" }}>{stats.nptHours.toFixed(1)} <span style={{ fontSize: "1rem", fontWeight: 400 }}>Jam</span></div>
              <div className="stat-change flat">{stats.nptCount} aktivitas</div>
            </div>
          </div>

          {/* ══════════════════════════════════
              2. MULTICOLOR LINE CHART (Full Width)
          ══════════════════════════════════ */}
          {timeBreakdown.length > 0 && (
            <div className="card" style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <p className="card-title" style={{ margin: 0 }}>Depth Progress by Description</p>
                <span style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                  Warna garis & titik menyesuaikan jenis aktivitas
                </span>
              </div>
              <MultiColorLineChart rows={timeBreakdown} />
            </div>
          )}

          {/* ══════════════════════════════════
              3. PT & NPT BREAKDOWN BY DESCRIPTION (2 Cards)
          ══════════════════════════════════ */}
          {timeBreakdown.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              <DescriptionBreakdownCard
                title="Productive Time (PT) by Description"
                rows={ptRows}
                badgeType="PT"
                emptyMessage="Tidak ada catatan Productive Time pada laporan ini."
              />
              <DescriptionBreakdownCard
                title="Non-Productive Time (NPT) by Description"
                rows={nptRows}
                badgeType="NPT"
                emptyMessage="Tidak ada catatan Non-Productive Time (NPT) pada laporan ini."
              />
            </div>
          )}

          {/* ══════════════════════════════════
              4. 24 HOURS SUMMARY CARD (Full Width, Above Time Breakdown)
          ══════════════════════════════════ */}
          <div className="card" style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <p className="card-title" style={{ margin: 0 }}>24 Hours Summary</p>
              {summary24h.status && (
                <span className="badge badge-accent" style={{ fontSize: "0.6875rem" }}>
                  {summary24h.status}
                </span>
              )}
            </div>
            <div style={{ padding: "16px", background: "var(--color-bg-elevated)", borderRadius: "var(--radius-md)", border: "0.5px solid var(--color-border-subtle)", marginBottom: summary24h.forecast ? "14px" : "0" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-primary)", lineHeight: 1.6 }}>
                {summary24h.summary}
              </p>
            </div>
            {summary24h.forecast && (
              <div>
                <p style={{ margin: "0 0 6px", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  24 Hours Forecast
                </p>
                <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--color-text-muted)", fontStyle: "italic", lineHeight: 1.5 }}>
                  {summary24h.forecast}
                </p>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════
              5. REPORT DETAIL & AFE CARD (Full Width, Above Time Breakdown)
          ══════════════════════════════════ */}
          <div className="card" style={{ marginBottom: "20px" }}>
            <p className="card-title" style={{ marginBottom: "12px" }}>Report Detail & AFE</p>
            {afeFields.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.8125rem", fontStyle: "italic" }}>
                Data AFE tidak ditemukan pada laporan ini.
              </div>
            ) : (
              <div className="table-wrap" style={{ border: "0.5px solid var(--color-border-subtle)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                <table style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ width: "35%", padding: "10px 16px", background: "var(--color-bg-elevated)" }}>Parameter AFE / Personel</th>
                      <th style={{ width: "65%", padding: "10px 16px", background: "var(--color-bg-elevated)" }}>Nilai / Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {afeFields.map((f, i) => (
                      <tr key={i}>
                        <td style={{ padding: "10px 16px", fontSize: "0.75rem", color: "var(--color-text-muted)", borderBottom: i < afeFields.length - 1 ? "0.5px solid var(--color-border-subtle)" : "none" }}>
                          {f.field_key.replace(/_/g, " ").toUpperCase()}
                        </td>
                        <td style={{ padding: "10px 16px", fontSize: "0.8125rem", fontWeight: 500, color: "var(--color-text-primary)", fontFamily: f.field_value && f.field_value.includes("USD") ? "var(--font-mono)" : "var(--font-sans)", borderBottom: i < afeFields.length - 1 ? "0.5px solid var(--color-border-subtle)" : "none" }}>
                          {f.field_value || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════
              6. PURE TIME BREAKDOWN TABLE
          ══════════════════════════════════ */}
          <div className="card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "var(--color-text-primary)" }}>
                  Kronologi Aktivitas 24 Jam (Time Breakdown)
                </h2>
                <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                  Rincian operasi pengeboran lengkap dari jam ke jam
                </p>
              </div>
              <span className="badge badge-muted" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
                {timeBreakdown.length} Aktivitas
              </span>
            </div>

            {timeBreakdown.length === 0 ? (
              <div className="empty-state" style={{ padding: "32px 0" }}>
                <p className="empty-state-title">Belum ada data time breakdown</p>
                <p className="empty-state-sub">Tidak ada kronologi aktivitas yang berhasil diekstrak pada laporan ini.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      {["Mulai", "Selesai", "Elapsed", "Depth (mMD)", "PT/NPT", "Kode", "Deskripsi", "Rincian Operasi"].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeBreakdown.map((row, i) => (
                      <tr key={i}>
                        <td className="mono" style={{ whiteSpace: "nowrap" }}>{row.start_time ?? "—"}</td>
                        <td className="mono" style={{ whiteSpace: "nowrap" }}>{row.end_time ?? "—"}</td>
                        <td className="mono" style={{ fontWeight: 600 }}>{row.elapsed ? `${row.elapsed}h` : "—"}</td>
                        <td className="mono" style={{ color: "var(--color-accent)" }}>{row.depth ?? "—"}</td>
                        <td>
                          {row.pt_npt ? (
                            <span className={`badge ${row.pt_npt === "NPT" ? "badge-warning" : row.pt_npt === "PT" ? "badge-accent" : "badge-muted"}`}>
                              {row.pt_npt}
                            </span>
                          ) : (
                            <span style={{ color: "var(--color-text-muted)" }}>—</span>
                          )}
                        </td>
                        <td className="mono" style={{ textAlign: "center" }}>{row.code ?? "—"}</td>
                        <td style={{ maxWidth: "220px", fontWeight: 500, color: "var(--color-text-primary)" }}>{row.description ?? "—"}</td>
                        <td style={{ maxWidth: "340px", lineHeight: 1.5, color: "var(--color-text-secondary)" }}>{row.operations ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Loading Skeleton ── */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="stat-card">
                <Sk w="50%" h="12px" />
                <div style={{ marginTop: "12px" }}><Sk w="40%" h="26px" /></div>
              </div>
            ))}
          </div>
          <div className="card" style={{ height: "240px" }}><Sk w="100%" h="100%" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="card" style={{ height: "220px" }}><Sk w="100%" h="100%" /></div>
            <div className="card" style={{ height: "220px" }}><Sk w="100%" h="100%" /></div>
          </div>
        </div>
      )}
    </div>
  );
}
