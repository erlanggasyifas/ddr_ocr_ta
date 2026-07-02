"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

type UploadStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "done"
  | "duplicate"
  | "error";

interface UploadResponse {
  status: string;
  filename: string;
  message?: string;
}

interface PipelineStatus {
  status: "processing" | "done" | "duplicate" | "error";
  document_id: number | null;
  message: string;
}

const PIPELINE_STEPS = [
  { label: "Konversi PDF → Excel", desc: "PaddleOCR + img2table" },
  { label: "Parsing Excel → JSON", desc: "scan horizontal & vertikal" },
  { label: "Simpan ke MariaDB", desc: "4 tabel, duplicate check" },
];

/* ── Icons ── */
function IconUploadCloud() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 15V3M8 7l4-4 4 4" />
      <path d="M20 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" />
    </svg>
  );
}

function IconFilePdf() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconWarn() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, marginTop: "1px" }}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ── Spinner ── */
function Spinner({ size = 44 }: { size?: number }) {
  return (
    <>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "1.5px solid var(--color-border-default)",
          borderTop: "1.5px solid var(--color-accent)",
          animation: "modal-spin 0.9s linear infinite",
          margin: "0 auto 20px",
          flexShrink: 0,
        }}
      />
      <style>{`@keyframes modal-spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

/* ── Icon circle ── */
function IconCircle({
  children,
  bg,
  border,
  color,
}: {
  children: React.ReactNode;
  bg: string;
  border: string;
  color: string;
}) {
  return (
    <div
      style={{
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        background: bg,
        border: `0.5px solid ${border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 16px",
        color,
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════
   PROPS
══════════════════════════════════════════ */
interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // called when upload finishes → dashboard refreshes
}

/* ══════════════════════════════════════════
   MODAL
══════════════════════════════════════════ */
export default function UploadModal({
  open,
  onClose,
  onSuccess,
}: UploadModalProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [documentId, setDocumentId] = useState<number | null>(null);
  const [pollSeconds, setPollSeconds] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollStartRef = useRef<number>(0);

  /* close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status !== "uploading" && status !== "processing") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, status]);

  /* lock body scroll while open */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* cleanup on unmount */
  useEffect(() => () => stopPolling(), []);

  function stopPolling() {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    pollRef.current = null;
    timeoutRef.current = null;
  }

  function startPolling(filename: string) {
    pollStartRef.current = Date.now();
    setPollSeconds(0);
    pollRef.current = setInterval(async () => {
      const elapsed = Date.now() - pollStartRef.current;
      setPollSeconds(Math.floor(elapsed / 1000));
      if (elapsed > POLL_TIMEOUT_MS) {
        stopPolling();
        setStatus("error");
        setMessage("Pipeline timeout setelah 5 menit. Cek log backend.");
        return;
      }
      try {
        const res = await fetch(
          `${API_URL}/status/${encodeURIComponent(filename)}`
        );
        if (!res.ok) return;
        const data: PipelineStatus = await res.json();
        if (data.status === "processing") return;
        stopPolling();
        setMessage(data.message ?? "");
        setDocumentId(data.document_id ?? null);
        setStatus(data.status);
        if (data.status === "done") onSuccess();
      } catch {
        /* lanjut polling */
      }
    }, POLL_INTERVAL_MS);
    timeoutRef.current = setTimeout(() => {
      stopPolling();
      setStatus("error");
      setMessage("Pipeline timeout setelah 5 menit. Cek log backend.");
    }, POLL_TIMEOUT_MS);
  }

  const handleFile = useCallback((f: File | null | undefined) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setMessage("Hanya file PDF yang diterima.");
      setStatus("error");
      return;
    }
    setFile(f);
    setStatus("idle");
    setMessage("");
    setDocumentId(null);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  async function handleUpload() {
    if (!file) return;
    setStatus("uploading");
    setMessage("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data: UploadResponse = await res.json();
      if (!res.ok) throw new Error((data as any).detail ?? "Upload gagal");
      setStatus("processing");
      startPolling(data.filename);
    } catch (e) {
      setStatus("error");
      setMessage((e as Error).message ?? "Terjadi kesalahan saat upload.");
    }
  }

  function reset() {
    stopPolling();
    setStatus("idle");
    setFile(null);
    setMessage("");
    setDocumentId(null);
    setPollSeconds(0);
  }

  function handleClose() {
    reset();
    onClose();
  }

  if (!open) return null;

  const isBusy = status === "uploading" || status === "processing";
  const isIdle = status === "idle" || status === "error";

  return createPortal(
    /* ── Backdrop ── */
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isBusy) handleClose();
      }}
    >
      {/* ── Panel ── */}
      <div className="modal-panel" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="modal-header">
          <div>
            <p className="modal-title">Upload PDF</p>
            <p className="modal-subtitle">
              Ekstraksi otomatis via PaddleOCR pipeline
            </p>
          </div>
          {!isBusy && (
            <button
              onClick={handleClose}
              className="btn btn-ghost btn-icon"
              aria-label="Tutup"
              style={{ color: "var(--color-text-muted)", flexShrink: 0 }}
            >
              <IconClose />
            </button>
          )}
        </div>

        <hr className="divider" />

        {/* Body */}
        <div className="modal-body">

          {/* ══ IDLE / ERROR ══ */}
          {isIdle && (
            <>
              {/* Dropzone */}
              <div
                onDrop={onDrop}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onClick={() => inputRef.current?.click()}
                style={{
                  border: `1px dashed ${dragging ? "var(--color-accent-dim)" : file ? "var(--color-accent-dim)" : "var(--color-border-default)"}`,
                  borderRadius: "var(--radius-xl)",
                  background: dragging
                    ? "var(--color-accent-subtle)"
                    : file
                    ? "var(--color-bg-elevated)"
                    : "var(--color-bg-surface)",
                  padding: "32px 24px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "border-color var(--transition-normal), background var(--transition-normal)",
                }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />

                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--radius-lg)",
                    background: file ? "var(--color-accent-subtle)" : "var(--color-bg-overlay)",
                    border: `0.5px solid ${file ? "var(--color-accent-dim)" : "var(--color-border-default)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                    color: file ? "var(--color-accent)" : "var(--color-text-muted)",
                    transition: "all var(--transition-normal)",
                  }}
                >
                  {file ? <IconFilePdf /> : <IconUploadCloud />}
                </div>

                {!file ? (
                  <>
                    <p style={{ margin: "0 0 3px", fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-primary)" }}>
                      {dragging ? "Lepaskan file di sini" : "Drag & drop PDF di sini"}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                      atau klik untuk memilih file
                    </p>
                    <p style={{ margin: "10px 0 0", fontSize: "0.6875rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
                      FORMAT: .PDF
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ margin: "0 0 3px", fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {file.name}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                      {(file.size / 1024).toFixed(1)} KB · klik untuk ganti
                    </p>
                  </>
                )}
              </div>

              {/* Error banner */}
              {status === "error" && message && (
                <div className="alert alert-danger" style={{ marginTop: "10px" }}>
                  <IconAlert />
                  <span>{message}</span>
                </div>
              )}

            </>
          )}

          {/* ══ UPLOADING ══ */}
          {status === "uploading" && (
            <div style={{ textAlign: "center", padding: "24px 0 8px" }}>
              <Spinner />
              <p style={{ margin: "0 0 4px", fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-primary)" }}>
                Mengupload file...
              </p>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                {file?.name}
              </p>
            </div>
          )}

          {/* ══ PROCESSING ══ */}
          {status === "processing" && (
            <div style={{ textAlign: "center", padding: "24px 0 8px" }}>
              <Spinner />
              <p style={{ margin: "0 0 4px", fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-primary)" }}>
                Pipeline sedang berjalan
              </p>
              <p style={{ margin: "0 0 20px", fontSize: "0.75rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                {file?.name}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left", maxWidth: "260px", margin: "0 auto 16px" }}>
                {PIPELINE_STEPS.map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "var(--color-accent)",
                        flexShrink: 0,
                        marginTop: "6px",
                        animation: "pulse-dot 1.5s ease-in-out infinite",
                        animationDelay: `${i * 400}ms`,
                      }}
                    />
                    <div>
                      <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--color-text-primary)" }}>{step.label}</p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p style={{ margin: 0, fontSize: "0.6875rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                menunggu hasil... {pollSeconds}s
              </p>
            </div>
          )}

          {/* ══ DONE ══ */}
          {status === "done" && (
            <div style={{ textAlign: "center", padding: "24px 0 8px" }}>
              <IconCircle bg="var(--color-accent-subtle)" border="var(--color-accent-dim)" color="var(--color-accent)">
                <IconCheck />
              </IconCircle>
              <p style={{ margin: "0 0 6px", fontSize: "1rem", fontWeight: 500, color: "var(--color-text-primary)" }}>
                Ekstraksi berhasil
              </p>
              <p style={{ margin: "0 0 20px", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                {message}
              </p>
              <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                {documentId !== null && (
                  <Link href={`/detail/${documentId}`} className="btn btn-primary" onClick={handleClose}>
                    Lihat detail
                  </Link>
                )}
                <button onClick={handleClose} className="btn btn-secondary">
                  Ke dashboard
                </button>
                <button onClick={reset} className="btn btn-ghost">
                  Upload lagi
                </button>
              </div>
            </div>
          )}

          {/* ══ DUPLICATE ══ */}
          {status === "duplicate" && (
            <div style={{ textAlign: "center", padding: "24px 0 8px" }}>
              <IconCircle bg="var(--color-warning-subtle)" border="rgba(251,191,36,0.3)" color="var(--color-warning)">
                <IconWarn />
              </IconCircle>
              <p style={{ margin: "0 0 6px", fontSize: "1rem", fontWeight: 500, color: "var(--color-warning)" }}>
                File sudah ada
              </p>
              <p style={{ margin: "0 0 20px", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                {message}
              </p>
              <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={handleClose} className="btn btn-secondary">
                  Ke dashboard
                </button>
                <button onClick={reset} className="btn btn-ghost">
                  Upload file lain
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer — only shown on idle/error with file ready */}
        {isIdle && file && (
          <>
            <hr className="divider" />
            <div className="modal-footer">
              <button onClick={handleClose} className="btn btn-ghost">
                Batal
              </button>
              <button onClick={handleUpload} className="btn btn-primary">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15V3M8 7l4-4 4 4" />
                  <path d="M20 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" />
                </svg>
                Upload & Proses PDF
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
