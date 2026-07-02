import json
import os
from datetime import datetime

import mysql.connector

# ==========================================
# KONFIGURASI KONEKSI
# ==========================================
from dotenv import load_dotenv
from mysql.connector import Error

load_dotenv()

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", 3306)),
    "user": os.getenv("DB_USER", "ddr_user"),
    "password": os.getenv("DB_PASSWORD", "ddr_password123"),
    "database": os.getenv("DB_NAME", "ddr_ocr"),
    "charset": "utf8mb4",
}   


# ==========================================
# KONEKSI
# ==========================================
def get_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        if conn.is_connected():
            return conn
    except Error as e:
        print(f"[DB] Gagal koneksi: {e}")
        return None


# ==========================================
# INIT DATABASE — Buat tabel jika belum ada
# ==========================================
def init_db():
    conn = get_connection()
    if not conn:
        return False

    cursor = conn.cursor()

    # Tabel utama dokumen DDR
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ddr_documents (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            filename    VARCHAR(255) NOT NULL,
            report_date VARCHAR(50),
            well_name   VARCHAR(100),
            operator    VARCHAR(100),
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Tabel field hasil ekstraksi (key-value flat)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ddr_fields (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            document_id INT NOT NULL,
            group_name  VARCHAR(100),
            field_key   VARCHAR(255),
            field_value TEXT,
            FOREIGN KEY (document_id) REFERENCES ddr_documents(id) ON DELETE CASCADE
        )
    """)

    # Tabel time breakdown per tanggal
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ddr_time_breakdown (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            document_id INT NOT NULL,
            period_date VARCHAR(50),
            start_time  VARCHAR(50),
            end_time    VARCHAR(50),
            elapsed     VARCHAR(50),
            depth       VARCHAR(50),
            pt_npt      VARCHAR(20),
            code        VARCHAR(50),
            description TEXT,
            operations  LONGTEXT,
            FOREIGN KEY (document_id) REFERENCES ddr_documents(id) ON DELETE CASCADE
        )
    """)

    # Tabel bit records
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ddr_bit_records (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            document_id INT NOT NULL,
            bit_label   VARCHAR(100),
            field_key   VARCHAR(255),
            field_value TEXT,
            FOREIGN KEY (document_id) REFERENCES ddr_documents(id) ON DELETE CASCADE
        )
    """)

    conn.commit()
    cursor.close()
    conn.close()
    print("[DB] Tabel berhasil diinisialisasi.")
    return True


# ==========================================
# INSERT DOKUMEN
# ==========================================
def insert_document(filename, extracted_json: dict) -> int | None:
    """
    Insert satu dokumen DDR beserta semua field-nya.
    Return: document_id jika sukses, None jika gagal.
    """
    conn = get_connection()
    if not conn:
        return None

    cursor = conn.cursor()

    try:
        # Cek duplikasi berdasarkan filename
        cursor.execute("SELECT id FROM ddr_documents WHERE filename = %s", (filename,))
        existing = cursor.fetchone()
        if existing:
            print(
                f"[DB] Duplikat: '{filename}' sudah ada (id={existing[0]}), upload dibatalkan."
            )
            cursor.close()
            conn.close()
            return -1  # Kode khusus: duplikat

        # Ambil metadata utama
        profile = extracted_json.get("profile", {})
        report_date = _get_report_date(filename)
        well_name = profile.get("well_pad_name") or profile.get("well_name")
        operator = profile.get("operator")

        # Insert ke ddr_documents
        cursor.execute(
            """
            INSERT INTO ddr_documents (filename, report_date, well_name, operator)
            VALUES (%s, %s, %s, %s)
        """,
            (filename, report_date, well_name, operator),
        )
        document_id = cursor.lastrowid

        # Insert fields (semua group kecuali time_breakdown & bit_records)
        SKIP_GROUPS = {"time_breakdown", "bit_records", "vertical_data"}
        for group_name, group_data in extracted_json.items():
            if group_name in SKIP_GROUPS:
                continue
            _insert_group_fields(cursor, document_id, group_name, group_data)

        # Insert vertical data
        vert = extracted_json.get("vertical_data", {})
        _insert_group_fields(cursor, document_id, "vertical_data", vert)

        # Insert time breakdown
        time_breakdown = extracted_json.get("time_breakdown", {})
        for period_date, rows in time_breakdown.items():
            for row in rows:
                cursor.execute(
                    """
                    INSERT INTO ddr_time_breakdown
                        (document_id, period_date, start_time, end_time,
                         elapsed, depth, pt_npt, code, description, operations)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                    (
                        document_id,
                        period_date,
                        row.get("start"),
                        row.get("end"),
                        row.get("elapsed"),
                        row.get("depth"),
                        row.get("pt_npt"),
                        row.get("code"),
                        row.get("description"),
                        row.get("operations"),
                    ),
                )

        # Insert bit records
        bit_records = extracted_json.get("bit_records", {})
        if isinstance(bit_records, dict):
            for bit_label, fields in bit_records.items():
                if isinstance(fields, dict):
                    for field_key, field_value in fields.items():
                        cursor.execute(
                            """
                            INSERT INTO ddr_bit_records
                                (document_id, bit_label, field_key, field_value)
                            VALUES (%s, %s, %s, %s)
                        """,
                            (
                                document_id,
                                bit_label,
                                field_key,
                                str(field_value) if field_value else None,
                            ),
                        )

        conn.commit()
        print(f"[DB] Dokumen '{filename}' berhasil disimpan (id={document_id})")
        return document_id

    except Error as e:
        print(f"[DB] Error saat insert: {e}")
        conn.rollback()
        return None
    finally:
        cursor.close()
        conn.close()


def _insert_group_fields(cursor, document_id, group_name, group_data):
    """Helper: flatten dict/nested dict dan insert ke ddr_fields."""
    if not isinstance(group_data, dict):
        return
    for key, value in group_data.items():
        if isinstance(value, dict):
            # Nested (contoh: hse → safety_performance → {...})
            for sub_key, sub_value in value.items():
                if isinstance(sub_value, dict):
                    for k, v in sub_value.items():
                        cursor.execute(
                            """
                            INSERT INTO ddr_fields (document_id, group_name, field_key, field_value)
                            VALUES (%s, %s, %s, %s)
                        """,
                            (
                                document_id,
                                f"{group_name}.{key}",
                                f"{sub_key}.{k}",
                                str(v) if v else None,
                            ),
                        )
                else:
                    cursor.execute(
                        """
                        INSERT INTO ddr_fields (document_id, group_name, field_key, field_value)
                        VALUES (%s, %s, %s, %s)
                    """,
                        (
                            document_id,
                            f"{group_name}.{key}",
                            sub_key,
                            str(sub_value) if sub_value else None,
                        ),
                    )
        else:
            cursor.execute(
                """
                INSERT INTO ddr_fields (document_id, group_name, field_key, field_value)
                VALUES (%s, %s, %s, %s)
            """,
                (document_id, group_name, key, str(value) if value else None),
            )


def _get_report_date(filename: str) -> str | None:
    """
    Ekstrak tanggal dari nama file.
    Mendukung beberapa format:
      - ddr_20220712.xlsx          → 2022-07-12  (8 digit berurutan)
      - Daily Drilling Report 13 July 2022.pdf → 2022-07-13
      - Daily Drilling Report 13 Jul 2022.pdf  → 2022-07-13
    """
    import re

    # Format 1: 8 digit berurutan (paling umum, cek duluan)
    match = re.search(r"(\d{8})", filename)
    if match:
        raw = match.group(1)
        try:
            return datetime.strptime(raw, "%Y%m%d").strftime("%Y-%m-%d")
        except ValueError:
            pass

    # Format 2: "13 July 2022" atau "13 Jul 2022"
    match = re.search(
        r"(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})", filename
    )
    if match:
        day, month_str, year = match.group(1), match.group(2), match.group(3)
        for fmt in ("%d %B %Y", "%d %b %Y"):
            try:
                return datetime.strptime(
                    f"{day} {month_str} {year}", fmt
                ).strftime("%Y-%m-%d")
            except ValueError:
                continue

    return None


# ==========================================
# QUERY HELPERS
# ==========================================
def get_all_documents():
    conn = get_connection()
    if not conn:
        return []
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM ddr_documents ORDER BY created_at DESC")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows


def get_fields_by_document(document_id: int):
    conn = get_connection()
    if not conn:
        return []
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT group_name, field_key, field_value
        FROM ddr_fields
        WHERE document_id = %s
        ORDER BY group_name, field_key
    """,
        (document_id,),
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows


def get_time_breakdown_by_document(document_id: int):
    conn = get_connection()
    if not conn:
        return []
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT * FROM ddr_time_breakdown
        WHERE document_id = %s
        ORDER BY period_date, start_time
    """,
        (document_id,),
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows


# ==========================================
# TEST — jalankan langsung untuk verifikasi
# ==========================================
if __name__ == "__main__":
    print("=== Test db.py ===")

    print("\n1. Init database...")
    ok = init_db()
    if not ok:
        print("Gagal init DB. Pastikan MySQL running dan kredensial benar.")
        exit(1)

    print("\n2. Load JSON dari simple_extractor output...")
    # Jalankan simple_extractor dulu dan simpan ke file sementara,
    # atau ganti path ini dengan file JSON yang sudah ada
    json_path = "outputs/ddr_20220712_extracted.json"

    if not os.path.exists(json_path):
        print(f"File JSON tidak ditemukan: {json_path}")
        print(
            "Tip: jalankan simple_extractor.py dan simpan outputnya ke file tersebut dulu."
        )
        print(
            "Contoh: python simple_extractor.py > outputs/ddr_20220712_extracted.json"
        )
        exit(1)

    with open(json_path, "r") as f:
        extracted = json.load(f)

    print("\n3. Insert dokumen test...")
    doc_id = insert_document("ddr_20220712.xlsx", extracted)

    if doc_id:
        print(f"\n4. Verifikasi — ambil dokumen id={doc_id}...")
        docs = get_all_documents()
        for d in docs:
            print(f"   → {d}")

        fields = get_fields_by_document(doc_id)
        print(f"\n   Total fields tersimpan: {len(fields)}")

        tb = get_time_breakdown_by_document(doc_id)
        print(f"   Total time breakdown rows: {len(tb)}")
    else:
        print("Insert gagal.")
