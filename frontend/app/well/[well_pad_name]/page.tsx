"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/* ── helpers ── */
function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}
function fmtDisplay(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

/** Konversi "13-Jul-2022" atau "13 Jul 2022" → "2022-07-13" */
function periodDateToISO(raw: string): string | null {
  if (!raw) return null;
  const MONTH_MAP: Record<string, string> = {
    jan:"01", feb:"02", mar:"03", apr:"04", mei:"05", may:"05",
    jun:"06", jul:"07", agu:"08", aug:"08", sep:"09", okt:"10", oct:"10",
    nov:"11", des:"12", dec:"12",
  };
  const m = raw.trim().match(/^(\d{1,2})[-\s]([A-Za-z]{3,})[-\s](\d{4})$/);
  if (!m) return null;
  const month = MONTH_MAP[m[2].toLowerCase().slice(0, 3)];
  if (!month) return null;
  return `${m[3]}-${month}-${m[1].padStart(2, "0")}`;
}

/* ══════════════════════════════════════════
   RANGE DATE PICKER (pure, no deps)
══════════════════════════════════════════ */
const DAYS = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

interface RangePickerProps {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
  availableDates?: Set<string>;
}

function RangePicker({ from, to, onChange, availableDates }: RangePickerProps) {
  const today = new Date();

  // Default view ke bulan pertama yang ada data, bukan bulan ini
  const firstAvailable = availableDates && availableDates.size > 0
    ? [...availableDates].sort()[0]
    : null;
  const defaultYear  = firstAvailable ? parseInt(firstAvailable.slice(0, 4)) : today.getFullYear();
  const defaultMonth = firstAvailable ? parseInt(firstAvailable.slice(5, 7)) - 1 : today.getMonth();

  const [viewYear, setViewYear]   = useState(defaultYear);
  const [viewMonth, setViewMonth] = useState(defaultMonth);

  // Sync ke bulan pertama yang ada data kalau availableDates baru tersedia
  useEffect(() => {
    if (!availableDates || availableDates.size === 0) return;
    const first = [...availableDates].sort()[0];
    setViewYear(parseInt(first.slice(0, 4)));
    setViewMonth(parseInt(first.slice(5, 7)) - 1);
  }, [availableDates?.size]);
  const [hovered, setHovered] = useState<string>("");

  function getDaysInMonth(y: number, m: number) {
    return new Date(y, m + 1, 0).getDate();
  }
  function getFirstDayOfWeek(y: number, m: number) {
    return new Date(y, m, 1).getDay();
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function handleDayClick(iso: string) {
    if (availableDates && !availableDates.has(iso)) return;
    if (!from || (from && to)) {
      onChange(iso, "");
    } else {
      if (iso < from) onChange(iso, from);
      else onChange(from, iso);
    }
  }

  function isInRange(iso: string) {
    const start = from;
    const end = to || hovered;
    if (!start || !end) return false;
    const [a, b] = start <= end ? [start, end] : [end, start];
    return iso > a && iso < b;
  }
  function isStart(iso: string) { return iso === from; }
  function isEnd(iso: string) { return iso === to; }
  function isToday(iso: string) { return iso === toISO(today); }
  function isDisabled(iso: string) { return !!availableDates && !availableDates.has(iso); }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
  const cells: (string | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push(iso);
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const CELL = 30;
  const GAP = 2;

  return (
    <div style={{ padding: "12px", userSelect: "none" }}>
      {/* nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <button onClick={prevMonth} className="btn btn-ghost btn-icon" style={{ width: "26px", height: "26px" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--color-text-primary)" }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="btn btn-ghost btn-icon" style={{ width: "26px", height: "26px" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      {/* weekday headers */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${CELL}px)`, gap: `${GAP}px`, marginBottom: "4px" }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "0.625rem", fontWeight: 500, color: "var(--color-text-muted)", letterSpacing: "0.04em", height: `${CELL}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {d}
          </div>
        ))}
      </div>
      {/* day cells */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${CELL}px)`, gap: `${GAP}px` }}>
        {cells.map((iso, i) => {
          if (!iso) return <div key={i} style={{ width: CELL, height: CELL }} />;
          const start = isStart(iso);
          const end = isEnd(iso);
          const inRange = isInRange(iso);
          const todayCell = isToday(iso);
          const selected = start || end;
          const disabled = isDisabled(iso);
          return (
            <button
              key={iso}
              onClick={() => handleDayClick(iso)}
              onMouseEnter={() => !disabled && setHovered(iso)}
              onMouseLeave={() => setHovered("")}
              disabled={disabled}
              style={{
                width: CELL, height: CELL,
                border: "none",
                borderRadius: selected ? "6px" : inRange ? "0" : "6px",
                background: selected
                  ? "var(--color-accent)"
                  : inRange
                  ? "var(--color-accent-subtle)"
                  : todayCell && !disabled
                  ? "var(--color-bg-overlay)"
                  : "transparent",
                color: disabled
                  ? "var(--color-border-default)"
                  : selected
                  ? "var(--color-text-inverse)"
                  : inRange
                  ? "var(--color-accent)"
                  : todayCell
                  ? "var(--color-accent)"
                  : "var(--color-text-secondary)",
                fontSize: "0.75rem",
                fontFamily: "var(--font-sans)",
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "background var(--transition-fast), color var(--transition-fast)",
                outline: "none",
                fontWeight: selected ? 500 : 400,
                opacity: disabled ? 0.25 : 1,
                position: "relative",
              }}
            >
              {parseInt(iso.slice(8))}
              {!disabled && availableDates && (
                <span style={{
                  position: "absolute", bottom: "3px", left: "50%",
                  transform: "translateX(-50%)",
                  width: "3px", height: "3px", borderRadius: "50%",
                  background: selected ? "rgba(255,255,255,0.6)" : "var(--color-accent)",
                  display: "block",
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   DATE RANGE BUTTON + DROPDOWN
══════════════════════════════════════════ */
interface DateRangeInputProps {
  from: string;
  to: string;
  onApply: (from: string, to: string) => void;
  onClear: () => void;
  disabled?: boolean;
  availableDates?: Set<string>;
}

function DateRangeInput({ from, to, onApply, onClear, disabled, availableDates }: DateRangeInputProps) {
  const [open, setOpen] = useState(false);
  const [pendingFrom, setPendingFrom] = useState(from);
  const [pendingTo, setPendingTo] = useState(to);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleOpen() {
    setPendingFrom(from);
    setPendingTo(to);
    setOpen(o => !o);
  }

  function handleApply() {
    onApply(pendingFrom, pendingTo);
    setOpen(false);
  }

  function handleReset() {
    setPendingFrom("");
    setPendingTo("");
  }

  const hasActive = from || to;
  const label = hasActive
    ? from && to
      ? `${fmtDisplay(from)} — ${fmtDisplay(to)}`
      : fmtDisplay(from) || fmtDisplay(to)
    : "Pilih rentang tanggal";

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      {/* trigger button */}
      <button
        onClick={handleOpen}
        disabled={disabled}
        className="btn btn-secondary"
        style={{
          fontSize: "0.8125rem",
          gap: "6px",
          color: hasActive ? "var(--color-accent)" : undefined,
          borderColor: hasActive ? "var(--color-accent-dim)" : undefined,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        {label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "2px", opacity: 0.5 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* dropdown */}
      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          zIndex: 200,
          background: "var(--color-bg-elevated)",
          border: "0.5px solid var(--color-border-default)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
          minWidth: "260px",
          overflow: "hidden",
        }}>
          {/* hint */}
          {(!pendingFrom || !pendingTo) && (
            <div style={{ padding: "8px 12px 0", fontSize: "0.6875rem", color: "var(--color-text-muted)" }}>
              {!pendingFrom ? "Pilih tanggal mulai" : "Pilih tanggal akhir"}
            </div>
          )}
          {/* selected range display */}
          {(pendingFrom || pendingTo) && (
            <div style={{ padding: "8px 12px 0", display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "0.6875rem", fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}>
                {fmtDisplay(pendingFrom) || "—"}
              </span>
              <span style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)" }}>→</span>
              <span style={{ fontSize: "0.6875rem", fontFamily: "var(--font-mono)", color: pendingTo ? "var(--color-accent)" : "var(--color-text-muted)" }}>
                {fmtDisplay(pendingTo) || "—"}
              </span>
            </div>
          )}
          <RangePicker from={pendingFrom} to={pendingTo} onChange={(f, t) => { setPendingFrom(f); setPendingTo(t); }} availableDates={availableDates} />
          {/* footer */}
          <div style={{
            display: "flex", justifyContent: "flex-end", gap: "6px",
            padding: "8px 12px",
            borderTop: "0.5px solid var(--color-border-subtle)",
            background: "var(--color-bg-surface)",
          }}>
            <button onClick={handleReset} className="btn btn-ghost btn-sm">Reset</button>
            <button onClick={handleApply} className="btn btn-primary btn-sm" disabled={!pendingFrom}>Terapkan</button>
          </div>
        </div>
      )}

      {/* clear badge */}
      {hasActive && (
        <button
          onClick={onClear}
          className="btn btn-ghost"
          style={{ fontSize: "0.8125rem", display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--color-text-muted)", marginLeft: "6px" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Hapus filter
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   INTERFACES
══════════════════════════════════════════ */
interface TimeBreakdown {
  id?: number;
  document_id?: number;
  period_date?: string;
  start_time?: string;
  end_time?: string;
  elapsed?: string;
  depth?: string;
  pt_npt?: string;
  code?: string;
  description?: string;
  operations?: string;
  filename?: string;
  report_date?: string;
  well_name?: string;
}

interface WellDocument {
  id: number;
  filename: string;
  report_date: string | null;
  well_name: string | null;
  operator: string | null;
  created_at: string | null;
}

interface TbApiResponse {
  total: number;
  well_pad_name: string;
  time_breakdown: TimeBreakdown[];
}

interface DocsApiResponse {
  total: number;
  well_pad_name: string;
  documents: WellDocument[];
}

/* ── Icons ── */
function IconChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function IconWell() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3" />
      <line x1="12" y1="8" x2="12" y2="22" />
      <path d="M8 14h8" /><path d="M9 18h6" />
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
function Sk({ w, h }: { w: string; h: string }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: "4px" }} />;
}

/* ══════════════════════════════════════════
   CHARTS
══════════════════════════════════════════ */
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  const R = 52, cx = 64, cy = 64, strokeW = 18;
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
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--color-bg-overlay)" strokeWidth={strokeW} />
        {slices.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={R} fill="none" stroke={s.color} strokeWidth={strokeW}
            strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={-s.offset + circumference / 4}
            strokeLinecap="butt" style={{ transition: "stroke-dasharray 600ms ease" }} />
        ))}
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

function DepthChart({ rows }: { rows: TimeBreakdown[] }) {
  const parsed = rows
    .map((r, i) => ({ i, depth: parseFloat(r.depth ?? ""), label: r.start_time ?? `#${i}` }))
    .filter((r) => !isNaN(r.depth) && r.depth > 0).slice(0, 48);
  if (parsed.length < 2) return (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Data depth tidak tersedia</p>
    </div>
  );
  const maxD = Math.max(...parsed.map((r) => r.depth));
  const W = 480, H = 100, padL = 36, padB = 20;
  const chartW = W - padL - 8, chartH = H - padB;
  const barW = Math.max(2, Math.floor(chartW / parsed.length) - 1);
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
      {[0, 0.5, 1].map((t) => {
        const val = Math.round(maxD * t);
        return (
          <g key={t}>
            <line x1={padL} y1={H - padB - chartH * t} x2={W - 8} y2={H - padB - chartH * t} stroke="var(--color-border-subtle)" strokeWidth="0.5" />
            <text x={padL - 4} y={H - padB - chartH * t + 3} textAnchor="end" fill="var(--color-text-muted)" fontSize="7" fontFamily="var(--font-mono)">{val}</text>
          </g>
        );
      })}
      {parsed.map((r, i) => {
        const x = padL + (i / parsed.length) * chartW;
        const bh = (r.depth / maxD) * chartH;
        const y = H - padB - bh;
        return <rect key={i} x={x} y={y} width={barW} height={bh} fill="var(--color-accent)" opacity="0.7" rx="1" />;
      })}
      <line x1={padL} y1={H - padB} x2={W - 8} y2={H - padB} stroke="var(--color-border-default)" strokeWidth="0.5" />
    </svg>
  );
}

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */
export default function WellDetailPage() {
  const params = useParams<{ well_pad_name: string }>();
  const wellName = decodeURIComponent(params.well_pad_name ?? "");

  const [timeBreakdown, setTimeBreakdown] = useState<TimeBreakdown[]>([]);
  const [documents, setDocuments] = useState<WellDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");

  const fetchData = useCallback(async (from: string, to: string) => {
    if (!wellName) return;
    setLoading(true);
    setError(null);
    try {
      const p = new URLSearchParams();
      if (from) p.set("date_from", from);
      if (to) p.set("date_to", to);
      const query = p.toString() ? `?${p.toString()}` : "";
      const [tbRes, docsRes] = await Promise.all([
        fetch(`${API_URL}/wells/${encodeURIComponent(wellName)}/time_breakdown${query}`),
        fetch(`${API_URL}/wells/${encodeURIComponent(wellName)}/documents`),
      ]);
      if (!tbRes.ok) throw new Error(`Gagal mengambil time breakdown (${tbRes.status})`);
      if (!docsRes.ok) throw new Error(`Gagal mengambil dokumen (${docsRes.status})`);
      const tbJson: TbApiResponse = await tbRes.json();
      const docsJson: DocsApiResponse = await docsRes.json();
      setTimeBreakdown(tbJson.time_breakdown ?? []);
      setDocuments(docsJson.documents ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [wellName]);

  useEffect(() => { fetchData("", ""); }, [fetchData]);

  function handleApply(from: string, to: string) {
    setAppliedFrom(from);
    setAppliedTo(to);
    fetchData(from, to);
  }

  function handleClear() {
    setAppliedFrom("");
    setAppliedTo("");
    fetchData("", "");
  }

  const isFiltered = !!(appliedFrom || appliedTo);

  // Set tanggal yang tersedia dari period_date time breakdown (paling akurat)
  const availableDates = new Set<string>(
    timeBreakdown
      .map((r) => periodDateToISO(r.period_date ?? ""))
      .filter((iso): iso is string => iso !== null)
  );

  const ptCount = timeBreakdown.filter((r) => r.pt_npt === "PT").length;  const nptCount = timeBreakdown.filter((r) => r.pt_npt === "NPT").length;
  const otherCount = timeBreakdown.length - ptCount - nptCount;
  const donutData = [
    { label: "PT", value: ptCount, color: "var(--color-chart-pt)" },
    { label: "NPT", value: nptCount, color: "var(--color-chart-npt)" },
    { label: "Lainnya", value: otherCount, color: "var(--color-chart-other)" },
  ].filter((d) => d.value > 0);

  return (
    <div className="page-enter">
      {/* back */}
      <div className="page-header">
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--color-text-muted)", textDecoration: "none", marginBottom: "14px", transition: "color var(--transition-fast)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}>
          <IconChevronLeft /> Dashboard
        </Link>
        {loading && !timeBreakdown.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Sk w="40%" h="22px" /><Sk w="24%" h="12px" />
          </div>
        ) : (
          <>
            <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "var(--radius-md)", background: "var(--color-accent-subtle)", border: "0.5px solid var(--color-accent-dim)", color: "var(--color-accent)", flexShrink: 0 }}>
                <IconWell />
              </span>
              {wellName}
            </h1>
            <p className="page-subtitle">
              {documents.length > 0 ? `${documents.length} dokumen · ${documents[0]?.operator ?? "—"}` : "Well Merged View"}
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: "24px" }}>
          <IconAlert />
          <div>
            <p style={{ margin: 0, fontWeight: 500, fontSize: "0.8125rem" }}>Gagal memuat data</p>
            <p style={{ margin: "2px 0 0", fontSize: "0.75rem", opacity: 0.8 }}>{error}</p>
          </div>
        </div>
      )}

      {/* stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "10px", marginBottom: "20px" }}>
        {[
          { label: "Dokumen", value: documents.length, sub: "terkait" },
          { label: "Aktivitas", value: timeBreakdown.length, sub: isFiltered ? "terfilter" : "time breakdown" },
          { label: "PT", value: ptCount, sub: "productive time", color: "var(--color-chart-pt)" },
          { label: "NPT", value: nptCount, sub: "non-productive", color: "var(--color-chart-npt)" },
        ].map((c) => (
          <div key={c.label} className="stat-card">
            <div className="stat-label">{c.label}</div>
            <div className="stat-value" style={c.color ? { color: c.color } : {}}>{loading ? "—" : c.value}</div>
            <div className="stat-change flat">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* charts */}
      {!loading && timeBreakdown.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginBottom: "20px" }}>
          <div className="card"><p className="card-title">Distribusi PT / NPT</p><DonutChart data={donutData} /></div>
          <div className="card"><p className="card-title">Depth per Aktivitas</p><DepthChart rows={timeBreakdown} /></div>
        </div>
      )}

      {/* filter */}
      <div style={{ background: "var(--color-bg-surface)", border: "0.5px solid var(--color-border-subtle)", borderRadius: "var(--radius-lg)", padding: "12px 16px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", flexShrink: 0 }}>Filter tanggal</span>
          <DateRangeInput from={appliedFrom} to={appliedTo} onApply={handleApply} onClear={handleClear} disabled={loading} availableDates={availableDates.size > 0 ? availableDates : undefined} />
        </div>
      </div>

      {/* table */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[1,2,3,4,5].map((i) => (
            <div key={i} style={{ background: "var(--color-bg-surface)", border: "0.5px solid var(--color-border-subtle)", borderRadius: "var(--radius-lg)", padding: "14px 16px", display: "flex", gap: "16px" }}>
              <Sk w="80px" h="12px" /><Sk w="60px" h="12px" /><Sk w="60px" h="12px" /><Sk w="40%" h="12px" />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && timeBreakdown.length === 0 && (
        <div className="empty-state">
          <p className="empty-state-title">{isFiltered ? "Tidak ada data untuk rentang tanggal ini" : "Belum ada data time breakdown"}</p>
          <p className="empty-state-sub">{isFiltered ? "Coba ubah atau hapus filter tanggal" : "Belum ada aktivitas pengeboran yang diekstrak untuk sumur ini"}</p>
          {isFiltered && <button onClick={handleClear} className="btn btn-ghost" style={{ marginTop: "12px", fontSize: "0.8125rem", color: "var(--color-accent)" }}>Hapus filter</button>}
        </div>
      )}

      {!loading && !error && timeBreakdown.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {timeBreakdown.length} aktivitas
            </span>
            {documents.length > 0 && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                {documents.map((doc) => (
                  <Link key={doc.id} href={`/detail/${doc.id}`}
                    style={{ fontSize: "0.625rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", textDecoration: "none", background: "var(--color-bg-elevated)", border: "0.5px solid var(--color-border-subtle)", borderRadius: "4px", padding: "2px 6px", transition: "color var(--transition-fast)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}>
                    {doc.report_date ?? doc.filename}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>{["Tanggal","Mulai","Selesai","Elapsed","Depth","PT/NPT","Kode","Deskripsi","Operasi","Sumber"].map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {timeBreakdown.map((row, i) => (
                  <tr key={i}>
                    <td className="mono" style={{ whiteSpace: "nowrap" }}>{row.period_date ?? "—"}</td>
                    <td className="mono">{row.start_time ?? "—"}</td>
                    <td className="mono">{row.end_time ?? "—"}</td>
                    <td className="mono">{row.elapsed ?? "—"}</td>
                    <td className="mono">{row.depth ?? "—"}</td>
                    <td>
                      {row.pt_npt
                        ? <span className={`badge ${row.pt_npt === "NPT" ? "badge-warning" : row.pt_npt === "PT" ? "badge-accent" : "badge-muted"}`}>{row.pt_npt}</span>
                        : <span style={{ color: "var(--color-text-muted)" }}>—</span>}
                    </td>
                    <td className="mono">{row.code ?? "—"}</td>
                    <td style={{ maxWidth: "240px" }}>{row.description ?? "—"}</td>
                    <td style={{ maxWidth: "200px" }}>{row.operations ?? "—"}</td>
                    <td>
                      {row.document_id
                        ? <Link href={`/detail/${row.document_id}`} style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", textDecoration: "none", whiteSpace: "nowrap" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}>
                            {row.report_date ?? row.filename ?? `#${row.document_id}`}
                          </Link>
                        : <span style={{ color: "var(--color-text-muted)" }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
