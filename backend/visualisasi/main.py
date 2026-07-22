import json
import os
import shutil
import subprocess
import sys
from datetime import datetime
from contextlib import asynccontextmanager  # 👈 Added this import

import db
from fastapi import BackgroundTasks, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

# ==========================================
# LIFESPAN DEFINITION (Replaces old startup/shutdown events)
# ==========================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    # This block executes BEFORE the application starts receiving traffic
    db.init_db()
    yield
    # Any cleanup or shutdown logic would go here if needed

# ==========================================
# APP SETUP
# ==========================================
# Passed the lifespan function directly to the FastAPI instance
app = FastAPI(title="DDR OCR API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
OUTPUTS_DIR = "outputs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUTS_DIR, exist_ok=True)

# In-memory status tracker per filename
# Format: { filename: { "status": "processing"|"done"|"duplicate"|"error", "document_id": int|None, "message": str } }
pipeline_status: dict[str, dict] = {}


# ==========================================
# ENDPOINTS
# ==========================================


@app.get("/")
def health_check():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}


@app.get("/documents")
def get_documents():
    """Ambil semua dokumen dari tabel ddr_documents untuk ditampilkan di dashboard."""
    conn = db.get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Gagal koneksi database.")

    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT id, filename, report_date, well_name, operator, created_at
            FROM ddr_documents
            ORDER BY created_at DESC
            """
        )
        rows = cursor.fetchall()
        for row in rows:
            if isinstance(row.get("created_at"), datetime):
                row["created_at"] = row["created_at"].isoformat()
        return {"total": len(rows), "documents": rows}
    finally:
        cursor.close()
        conn.close()


@app.post("/upload")
async def upload_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """Upload PDF → jalankan pipeline (PDF→Excel→JSON→DB) di background."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Hanya file PDF yang diterima.")

    save_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(save_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Set status awal sebelum background task jalan
    pipeline_status[file.filename] = {
        "status": "processing",
        "document_id": None,
        "message": "Pipeline sedang berjalan...",
    }

    background_tasks.add_task(_run_pipeline, save_path, file.filename)

    return {
        "status": "processing",
        "filename": file.filename,
        "message": "File diterima, pipeline sedang berjalan.",
    }


@app.get("/status/{filename:path}")
def get_pipeline_status(filename: str):
    """
    Polling endpoint — cek status pipeline untuk file tertentu.
    Status: processing | done | duplicate | error
    """
    info = pipeline_status.get(filename)
    if not info:
        raise HTTPException(
            status_code=404, detail="Status tidak ditemukan untuk file ini."
        )
    return {"filename": filename, **info}


@app.get("/time_breakdown")
def get_time_breakdown(date: str = None, document_id: int = None):
    """Ambil semua time breakdown. Filter: ?date= atau ?document_id="""
    conn = db.get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Gagal koneksi database.")

    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT
                tb.document_id,
                tb.period_date,
                tb.start_time,
                tb.end_time,
                tb.elapsed,
                tb.depth,
                tb.pt_npt,
                tb.code,
                tb.description,
                tb.operations,
                d.well_name,
                d.report_date
            FROM ddr_time_breakdown tb
            INNER JOIN ddr_documents d ON tb.document_id = d.id
            ORDER BY d.report_date, tb.start_time ASC
            """
        )
        rows = cursor.fetchall()
        if date:
            rows = [r for r in rows if r.get("period_date") == date]
        if document_id:
            rows = [r for r in rows if r.get("document_id") == document_id]
        return {"total": len(rows), "time_breakdown": rows}
    finally:
        cursor.close()
        conn.close()


@app.get("/wells")
def get_wells():
    """Ambil daftar sumur unik beserta ringkasan: jumlah dokumen dan rentang tanggal."""
    conn = db.get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Gagal koneksi database.")

    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT
                well_name AS well_pad_name,
                COUNT(id)  AS document_count,
                MIN(report_date) AS earliest_date,
                MAX(report_date) AS latest_date
            FROM ddr_documents
            WHERE well_name IS NOT NULL AND well_name != ''
            GROUP BY well_name
            ORDER BY well_name ASC
            """
        )
        rows = cursor.fetchall()
        return {"total": len(rows), "wells": rows}
    finally:
        cursor.close()
        conn.close()


@app.get("/wells/{well_pad_name}/time_breakdown")
def get_well_time_breakdown(well_pad_name: str, date_from: str = None, date_to: str = None):
    """
    Ambil semua time breakdown dari seluruh dokumen milik satu sumur.
    Filter opsional: ?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD
    """
    conn = db.get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Gagal koneksi database.")

    cursor = conn.cursor(dictionary=True)

    # Cek apakah well_pad_name ada
    cursor.execute(
        "SELECT COUNT(*) AS cnt FROM ddr_documents WHERE well_name = %s",
        (well_pad_name,),
    )
    result = cursor.fetchone()
    if not result or result["cnt"] == 0:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail=f"Sumur '{well_pad_name}' tidak ditemukan.")

    cursor.execute(
        """
        SELECT
            tb.id,
            tb.document_id,
            tb.period_date,
            tb.start_time,
            tb.end_time,
            tb.elapsed,
            tb.depth,
            tb.pt_npt,
            tb.code,
            tb.description,
            tb.operations,
            d.filename,
            d.report_date,
            d.well_name
        FROM ddr_time_breakdown tb
        INNER JOIN ddr_documents d ON tb.document_id = d.id
        WHERE d.well_name = %s
        ORDER BY tb.period_date ASC, tb.start_time ASC
        """,
        (well_pad_name,),
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    # Filter tanggal berdasarkan period_date aktivitas (format "13-Jul-2022")
    # Input date_from/date_to dari frontend format YYYY-MM-DD
    # Konversi period_date ke YYYY-MM-DD untuk perbandingan yang akurat
    def parse_period_date(pd_str: str) -> str | None:
        """Konversi '13-Jul-2022' atau '13 Jul 2022' → '2022-07-13'"""
        if not pd_str:
            return None
        from datetime import datetime as dt
        for fmt in ("%d-%b-%Y", "%d %b %Y", "%d-%B-%Y", "%d %B %Y"):
            try:
                return dt.strptime(pd_str.strip(), fmt).strftime("%Y-%m-%d")
            except ValueError:
                continue
        return None

    if date_from or date_to:
        filtered = []
        for r in rows:
            pd_iso = parse_period_date(r.get("period_date") or "")
            if pd_iso is None:
                # period_date tidak bisa diparse, fallback ke report_date
                pd_iso = r.get("report_date") or ""
            if date_from and pd_iso < date_from:
                continue
            if date_to and pd_iso > date_to:
                continue
            filtered.append(r)
        rows = filtered

    return {"total": len(rows), "well_pad_name": well_pad_name, "time_breakdown": rows}


@app.get("/wells/{well_pad_name}/documents")
def get_well_documents(well_pad_name: str):
    """Ambil semua dokumen milik satu sumur."""
    conn = db.get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Gagal koneksi database.")

    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT id, filename, report_date, well_name, operator, created_at
        FROM ddr_documents
        WHERE well_name = %s
        ORDER BY report_date ASC
        """,
        (well_pad_name,),
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail=f"Sumur '{well_pad_name}' tidak ditemukan.")

    for row in rows:
        if isinstance(row.get("created_at"), datetime):
            row["created_at"] = row["created_at"].isoformat()

    return {"total": len(rows), "well_pad_name": well_pad_name, "documents": rows}


@app.get("/detail")
def get_detail(document_id: int = None):
    """Ambil detail lengkap: info dokumen + fields + time breakdown. Filter: ?document_id="""
    conn = db.get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Gagal koneksi database.")

    cursor = conn.cursor(dictionary=True)

    if document_id:
        cursor.execute("SELECT * FROM ddr_documents WHERE id = %s", (document_id,))
    else:
        cursor.execute("SELECT * FROM ddr_documents ORDER BY created_at DESC")
    documents = cursor.fetchall()

    for d in documents:
        if isinstance(d.get("created_at"), datetime):
            d["created_at"] = d["created_at"].isoformat()

    result = []
    for doc in documents:
        doc_id = doc["id"]

        cursor.execute(
            """SELECT group_name, field_key, field_value
               FROM ddr_fields WHERE document_id = %s
               ORDER BY group_name, field_key""",
            (doc_id,),
        )
        fields = cursor.fetchall()

        cursor.execute(
            """SELECT period_date, start_time, end_time, elapsed,
                      depth, pt_npt, code, description, operations
               FROM ddr_time_breakdown WHERE document_id = %s
               ORDER BY period_date, start_time""",
            (doc_id,),
        )
        time_breakdown = cursor.fetchall()

        result.append(
            {
                "document": doc,
                "fields": fields,
                "time_breakdown": time_breakdown,
            }
        )

    cursor.close()
    conn.close()

    return {"total": len(result), "detail": result}


# ==========================================
# PIPELINE BACKGROUND TASK
# ==========================================
def _run_pipeline(pdf_path: str, filename: str):
    print(f"\n[PIPELINE] Memproses: {filename}")
    base_name = os.path.splitext(filename)[0]
    json_path = os.path.join(OUTPUTS_DIR, f"{base_name}_extracted.json")
    excel_path = os.path.join(OUTPUTS_DIR, f"{base_name}.xlsx")

    def set_status(status: str, message: str, document_id: int | None = None):
        pipeline_status[filename] = {
            "status": status,
            "document_id": document_id,
            "message": message,
        }

    try:
        # Step 1: PDF → Excel
        r = subprocess.run(
            [sys.executable, "pdf_to_excel.py", "--input", pdf_path],
            capture_output=True,
            text=True,
        )
        if r.returncode != 0:
            print(f"[PIPELINE] ERROR Step 1:\n{r.stderr}")
            set_status("error", f"Gagal konversi PDF ke Excel: {r.stderr[:200]}")
            return

        # Step 2: Excel → JSON
        r = subprocess.run(
            [
                sys.executable,
                "simple_extractor.py",
                "--input",
                excel_path,
                "--output",
                json_path,
            ],
            capture_output=True,
            text=True,
        )
        if r.returncode != 0:
            print(f"[PIPELINE] ERROR Step 2:\n{r.stderr}")
            set_status("error", f"Gagal parsing Excel ke JSON: {r.stderr[:200]}")
            return

        # Step 3: JSON → DB
        if not os.path.exists(json_path):
            print(f"[PIPELINE] ERROR: JSON tidak ditemukan: {json_path}")
            set_status("error", "File JSON hasil ekstraksi tidak ditemukan.")
            return

        with open(json_path, "r", encoding="utf-8") as f:
            extracted = json.load(f)

        doc_id = db.insert_document(filename, extracted)

        if doc_id == -1:
            print(f"[PIPELINE] SKIP: '{filename}' sudah ada di database.")
            set_status(
                "duplicate",
                f"File '{filename}' sudah ada di database, upload dibatalkan.",
            )
        elif doc_id:
            print(f"[PIPELINE] Selesai! document_id={doc_id}")
            set_status(
                "done",
                "Ekstraksi selesai dan data berhasil disimpan.",
                document_id=doc_id,
            )
        else:
            print(f"[PIPELINE] ERROR Step 3: Gagal insert DB.")
            set_status("error", "Gagal menyimpan data ke database.")

    except Exception as e:
        print(f"[PIPELINE] EXCEPTION: {e}")
        set_status("error", f"Terjadi kesalahan: {str(e)[:300]}")