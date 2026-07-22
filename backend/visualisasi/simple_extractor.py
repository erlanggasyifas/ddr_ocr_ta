import argparse as _argparse
import json
import os
import re

import pandas as pd

# ==========================================
# KONFIGURASI INPUT
# ==========================================
_parser = _argparse.ArgumentParser()
_parser.add_argument("--input", type=str, default=None)
_parser.add_argument("--output", type=str, default=None)
_parser.add_argument("--engine", type=str, default="paddle", choices=["paddle", "easy"])
_args, _ = _parser.parse_known_args()
INPUT_FILE = _args.input or "outputs/ddr_20220712.xlsx"
_OUTPUT_FILE = _args.output or None
SHEET_NAME = "Data Flat"

# ==========================================
# DATA STRUCTURE CONFIGURATION
# ==========================================
DATA_STRUCTURE = {
    "horizontal": {
        "profile": [
            "OPERATOR",
            "WELL/ PAD NAME",
            "WELL TYPE/ PROFILE",
            "CONTRACTOR",
            "FIELD",
            "LATITUDE/ LONGITUDE",
            "REPORT NO.",
            "ENVIRONTMENT",
            "GL - MSL",
        ],
        "general": [
            "Rig TYPE / NAME",
            "RIG POWER HP",
            "KB ELEVATION Meter",
            "MIDNIGHT DEPTH Meter",
            "PROGRESS Meter",
            "PROPOSED TD Meter",
            "SPUD DATE",
            "RELEASE DATE",
            "PLANNED DAYS",
            "DAYS f/ RIG RELEASE",
        ],
        "drilling_parameters": [
            "AVERAGE WOB (24 HRS) KLBS",
            "AVERAGE ROP (24 HRS) M/HR",
            "AVERAGE SURFACE RPM / DHM",
            "KLBS-FT ON / OFF BOTTOM TORQUE",
            "gpm/PSI FLOWRATE/ SPP",
            "SCFM AIR RATE",
            "GPH CORR. INHIB./ FOAM RATE",
            "KLBS PUW/SOW/ROTW",
            "HRS TOTAL DRILLING TIME",
            "TON MILES",
        ],
        "afe": [
            "AFE NUMBER / AFE COST",
            "DAILY COST",
            "% AFE / CUMULATIVE COST",
            "DAILY MUD COST",
            "CUMULATIVE MUD COST",
            "PERSONNEL IN CHARGE",
            "DAY/ NIGHT DRILLING SUPV.",
            "DRILLING SUPERINTENDENT",
            "RIG SUPERINTENDENT",
            "DRILLING ENGINEER",
            "HSE SUPERVISOR",
        ],
        "24_hours": [
            "24 HOURS SUMMARY",
            "24 HOURS FORECAST",
            "STATUS",
        ],
        "hse": {
            "SAFETY PERFORMANCE": [
                "Nearmiss",
                "Incidents",
                "Last MTI",
                "Last LTI",
                "Days w/out LTI",
            ],
            "HOURS RECORD": [
                "KM Hrs Light Vehicle",
                "KM Hrs Heavy Equipment",
                "Total Daily Personnel",
                "Daily Safe Manhours / Cum Safe Manhours",
                "DWLTI Since",
            ],
            "HAZARD MANAGEMENT": [
                "JSA/HIRA",
                "PTW",
                "Pre Tour Meeting",
                "Observation Card",
                "Safety Inspection/ Training",
            ],
            "EMERGENCY DRILLS": [
                "H2S Drill",
                "BOP Drill/ Kick Drill",
                "Fire Drill",
                "Trip Drill",
                "Medivac Drill",
            ],
        },
        "environmental_record": [
            "Domestic Waste (m3)",
            "Hazardous Waste/B3 (kg)",
            "Spill Incidents (barrels)",
            "Enviro/ Community Issue",
            "Hazardous Waste (kg)",
            "Drill Cutting Vol (jumbo bag)",
            "Other (BB)",
            "Cummulative 24 Hrs",
        ],
        "occupational_health_record": [
            "Fit for duty / MCU (person)",
            "Clinic Visit",
            "Number of Work Related Illnesses",
            "Occupational Health Issue",
        ],
    },
    "vertical": ["ACCIDENT/ INCIDENT SUMMARY", "SAFETY ISSUES"],
    "bit_records": [
        "Bit Number", "Bit Size in", "Bit Run", "Manufacturer/Type",
        "IADC Code", "Jets/32 in", "Serial #", "Depth In m", "Depth Out m",
        "Meterage m", "Bit Hours 24 hrs", "TFA in2", "Tot Krev On Bttm",
        "Tot Krev", "Dull Grade In", "Dull Grade Out",
    ],
}

# ==========================================
# BUILD FLAT KEY LIST
# ==========================================
ALL_KEYS_FLAT = []
for content in DATA_STRUCTURE.get("horizontal", {}).values():
    if isinstance(content, list):
        ALL_KEYS_FLAT.extend(content)
    elif isinstance(content, dict):
        for sub_list in content.values():
            ALL_KEYS_FLAT.extend(sub_list)
ALL_KEYS_FLAT.extend(DATA_STRUCTURE.get("vertical", []))
ALL_KEYS_FLAT.extend(DATA_STRUCTURE.get("bit_records", []))


# ==========================================
# HELPER FUNCTIONS
# ==========================================
def normalize(text):
    if pd.isna(text):
        return ""
    return re.sub(r"[^a-zA-Z0-9]", "", str(text)).lower()


SKIP_REMAINDER_KEYS = {
    normalize("% AFE / CUMULATIVE COST"),
    normalize("STATUS"),
}


def is_another_key(text):
    target = normalize(text)
    if len(target) < 3:
        return False
    for key in ALL_KEYS_FLAT:
        clean_key = normalize(key)
        if target == clean_key:
            return True
        if len(clean_key) > 5 and clean_key in target:
            return True
    return False


def make_key_cool(text):
    if not text:
        return "unknown"
    clean = re.sub(r"[^a-zA-Z0-9]", " ", str(text)).strip().lower()
    return re.sub(r"\s+", "_", clean)


def scan_value(df, target_keyword, direction="horizontal", skip_remainder=False):
    target_clean = normalize(target_keyword)
    for r in range(len(df)):
        for c in range(len(df.columns)):
            cell_val = str(df.iloc[r, c])
            cell_clean = normalize(cell_val)
            if target_clean in cell_clean and len(cell_clean) > 0:
                if direction == "horizontal":
                    remainder = cell_clean.replace(target_clean, "")
                    if not skip_remainder and len(remainder) > 2:
                        val = re.sub(
                            re.escape(target_keyword), "", cell_val, flags=re.IGNORECASE
                        )
                        val = val.replace(":", "").replace("-", "").strip()
                        if val and not is_another_key(val):
                            return val
                    for step in range(1, 15):
                        try:
                            next_val = df.iloc[r, c + step]
                            if not pd.isna(next_val):
                                val_str = str(next_val).strip()
                                if val_str and val_str not in [":", "-", ".", "=", "_"]:
                                    if is_another_key(val_str):
                                        return None
                                    return val_str
                        except IndexError:
                            break
                    try:
                        down_val = df.iloc[r + 1, c]
                        if not pd.isna(down_val):
                            val_str = str(down_val).strip()
                            if val_str and val_str not in [":", "-", ".", "=", "_"]:
                                if not is_another_key(val_str):
                                    return val_str
                    except Exception:
                        pass
                elif direction == "vertical":
                    for step in range(1, 10):
                        try:
                            next_val = df.iloc[r + step, c]
                            if not pd.isna(next_val):
                                val_str = str(next_val).strip()
                                if val_str and val_str not in [":", "-", ".", "=", "_"]:
                                    if is_another_key(val_str):
                                        return None
                                    return val_str
                        except IndexError:
                            break
    return None


# ==========================================
# LOGIC BIT RECORDS
# ==========================================
def extract_bit_records(df, keys):
    records_map = {}
    column_indices = []
    anchor_row = -1
    for r in range(len(df)):
        for c in range(0, 5):
            val = str(df.iloc[r, c]).strip()
            if normalize(val) == "bitnumber":
                anchor_row = r
                break
        if anchor_row != -1:
            break
    if anchor_row == -1:
        return {}
    header_row = anchor_row - 1
    label_col_idx = 0
    for c in range(len(df.columns)):
        if normalize(str(df.iloc[anchor_row, c])) == "bitnumber":
            label_col_idx = c
            break
    count_found = 0
    for search_c in range(label_col_idx + 1, len(df.columns)):
        val_data = df.iloc[anchor_row, search_c]
        if not pd.isna(val_data) and str(val_data).strip():
            header_name = "Unknown"
            if header_row >= 0:
                val_header = df.iloc[header_row, search_c]
                if not pd.isna(val_header):
                    header_name = str(val_header).strip()
                    if header_name.endswith(".0"):
                        header_name = header_name[:-2]
            column_indices.append((header_name, search_c))
            records_map[header_name] = {}
            count_found += 1
        if count_found >= 2:
            break
    for key in keys:
        norm_key = normalize(key)
        cool_key = make_key_cool(key)
        found_in_row = -1
        for r in range(len(df)):
            for c in range(0, 5):
                val = str(df.iloc[r, c]).strip()
                if normalize(val) == norm_key:
                    found_in_row = r
                    break
            if found_in_row != -1:
                break
        if found_in_row != -1:
            for header_name, col_idx in column_indices:
                value = None
                for offset in range(3):
                    try:
                        v = df.iloc[found_in_row, col_idx + offset]
                        if not pd.isna(v) and str(v).strip():
                            value = str(v).strip()
                            break
                    except Exception:
                        pass
                records_map[header_name][cool_key] = value
    return records_map


# ==========================================
# LOGIC TIME BREAKDOWN
# ==========================================
def _is_pt_npt(val: str) -> bool:
    """
    Cek apakah nilai adalah PT atau NPT.
    Menangani berbagai format: 'PT', 'NPT', 'PT/NPT', 'PT / NPT'.
    """
    v = val.strip().upper()
    # Exact match
    if v in ("PT", "NPT", "PT/NPT", "PT / NPT"):
        return True
    # Normalized: hanya huruf, harus persis "pt" atau "npt"
    norm = re.sub(r"[^a-zA-Z]", "", v).lower()
    return norm in ("pt", "npt", "ptnpt")


def extract_time_breakdown(df):
    time_result = {}
    current_date = None
    col_map = {}
    in_data_section = False

    date_pattern = re.compile(
        r"([A-Za-z]{3,},?\s*\d{1,2}[-\s][A-Za-z]{3}[-\s]\d{2,4})", re.IGNORECASE
    )

    def parse_col_map_from_row(row_idx, next_row_idx):
        cmap = {
            "start": None, "end": None, "elapsed": None,
            "depth": None, "pt_npt": None, "code": None,
            "description": None, "operations": None,
        }

        # Scan baris pertama header (TIME HH:MM, DEPTH, PT/NPT, CODE, DESCRIPTION, OPERATIONS)
        for c in range(len(df.columns)):
            val = str(df.iloc[row_idx, c]).upper().strip()
            if not val or val == "NAN":
                continue
            if "TIME" in val and "HH" in val:
                pass
            elif "DEPTH" in val:
                cmap["depth"] = c
            elif "PT" in val and "NPT" in val:
                cmap["pt_npt"] = c
            elif "CODE" in val:
                cmap["code"] = c
            elif "DESCRIPTION" in val or "DESCR" in val:
                cmap["description"] = c
            elif "OPERATIONS" in val:
                cmap["operations"] = c

        # Scan baris kedua header (START, END, ELAPSED — dan fallback PT/NPT, CODE, dll)
        for c in range(len(df.columns)):
            val = str(df.iloc[next_row_idx, c]).upper().strip()
            if not val or val == "NAN":
                continue
            if val == "START":
                cmap["start"] = c
            elif val == "END":
                cmap["end"] = c
            elif "ELAPSED" in val:
                cmap["elapsed"] = c
            elif "DEPTH" in val and cmap["depth"] is None:
                cmap["depth"] = c
            elif "PT" in val and "NPT" in val and cmap["pt_npt"] is None:
                cmap["pt_npt"] = c
            elif "CODE" in val and cmap["code"] is None:
                cmap["code"] = c
            elif ("DESCRIPTION" in val or "DESCR" in val) and cmap["description"] is None:
                cmap["description"] = c
            elif "OPERATIONS" in val and cmap["operations"] is None:
                cmap["operations"] = c

        # Fallback operations
        if cmap["operations"] is None and cmap["description"] is not None:
            cmap["operations"] = cmap["description"] + 1

        # DEBUG — uncomment jika perlu diagnosa
        # print(f"[COL_MAP] row={row_idx}/{next_row_idx} → {cmap}")
        return cmap

    def get_col_val(row_idx, col_idx, strict=False):
        """
        strict=True  → ambil tepat di kolom itu, tidak geser.
        strict=False → toleransi geser hingga 2 kolom ke kanan.
        """
        if col_idx is None:
            return None
        offsets = range(1) if strict else range(3)
        for offset in offsets:
            try:
                v = df.iloc[row_idx, col_idx + offset]
                if not pd.isna(v):
                    s = str(v).strip()
                    if s and s.upper() not in ["NAN"]:
                        return s
            except Exception:
                pass
        return None

    def get_pt_npt(row_idx, col_idx):
        """
        Ambil nilai PT/NPT — hanya accept 'PT' atau 'NPT', strict di kolom itu.
        Kalau kolom itu kosong/NaN, return None (jangan ambil kolom sebelah).
        """
        if col_idx is None:
            return None
        try:
            v = df.iloc[row_idx, col_idx]
            if pd.isna(v):
                return None
            s = str(v).strip()
            if not s or s.upper() == "NAN":
                return None
            # Validasi: hanya terima PT atau NPT
            norm = re.sub(r"[^a-zA-Z]", "", s).upper()
            if norm in ("PT", "NPT"):
                return norm
            # Kalau isinya bukan PT/NPT (misal code "2a"), return None
            return None
        except Exception:
            return None

    def get_operations_text(row_idx, cmap):
        ops_col = cmap.get("operations")
        if ops_col is None:
            return None
        parts = []
        for c in range(ops_col, len(df.columns)):
            v = df.iloc[row_idx, c]
            if not pd.isna(v):
                s = str(v).strip()
                if len(s) > 1:
                    parts.append(s)
        return " ".join(parts) if parts else None

    i = 0
    while i < len(df):
        row_vals = [str(df.iloc[i, c]) for c in range(min(5, len(df.columns)))]
        row_str = " ".join(row_vals)
        row_upper = row_str.upper()

        # Deteksi batas akhir
        if "TOTAL HRS" in row_upper or "GENERAL COMMENTS" in row_upper:
            in_data_section = False
            col_map = {}
            i += 1
            continue

        # Deteksi baris tanggal
        cell0 = str(df.iloc[i, 0])
        date_match = date_pattern.search(cell0)
        operations_in_cell = "OPERATIONS FOR PERIOD" in cell0.upper()

        if date_match and operations_in_cell:
            raw_date = date_match.group(1).strip()
            clean_date = re.sub(r"^[A-Za-z]{3,},?\s*", "", raw_date).strip()
            # Normalize tahun 2-digit → 4-digit
            clean_date = re.sub(
                r"(\d{1,2}[-\s][A-Za-z]{3}[-\s])(\d{2})$",
                lambda m: m.group(1) + "20" + m.group(2),
                clean_date,
            )
            current_date = clean_date
            time_result[current_date] = []
            in_data_section = False
            col_map = {}

            for offset in range(1, 4):
                if i + offset >= len(df):
                    break
                next_row_str = " ".join(
                    str(df.iloc[i + offset, c]).upper()
                    for c in range(min(10, len(df.columns)))
                )
                if "START" in next_row_str and "END" in next_row_str:
                    header_main_row = i + offset - 1
                    header_sub_row = i + offset
                    col_map = parse_col_map_from_row(header_main_row, header_sub_row)
                    in_data_section = True
                    i += offset + 1
                    break
            else:
                i += 1
            continue

        # Baca baris data time breakdown
        if in_data_section and current_date and col_map.get("start") is not None:
            start_col = col_map["start"]
            try:
                val_start = df.iloc[i, start_col]
            except Exception:
                i += 1
                continue

            if pd.isna(val_start):
                i += 1
                continue

            val_start_str = str(val_start).strip()

            if re.match(r"^\d{1,2}:\d{2}", val_start_str):
                row_data = {
                    "start":       val_start_str,
                    "end":         get_col_val(i, col_map.get("end"), strict=True),
                    "elapsed":     get_col_val(i, col_map.get("elapsed"), strict=True),
                    "depth":       get_col_val(i, col_map.get("depth"), strict=True),
                    "pt_npt":      get_pt_npt(i, col_map.get("pt_npt")),  # fungsi khusus
                    "code":        get_col_val(i, col_map.get("code"), strict=True),
                    "description": get_col_val(i, col_map.get("description")),
                    "operations":  get_operations_text(i, col_map),
                }
                time_result[current_date].append(row_data)

        i += 1

    return time_result


# ==========================================
# MAIN
# ==========================================
def main():
    global INPUT_FILE
    print(f"--- Memproses File: {INPUT_FILE} ---")
    if not os.path.exists(INPUT_FILE):
        print("Error: File tidak ditemukan!")
        return

    if INPUT_FILE.lower().endswith(".pdf"):
        print(f"[INFO] Input adalah file PDF. Menjalankan konversi PDF -> Excel otomatis (Engine: {_args.engine})...")
        try:
            from pdf_to_excel import pdf_to_excel
            excel_path = pdf_to_excel(INPUT_FILE, engine=_args.engine)
            if not excel_path or not os.path.exists(excel_path):
                print("Error: Konversi PDF ke Excel gagal!")
                return
            INPUT_FILE = excel_path
            print(f"[INFO] Lanjut mengekstrak data dari Excel: {INPUT_FILE}")
        except Exception as e:
            print(f"Error saat konversi PDF ke Excel: {e}")
            return

    try:
        xl = pd.ExcelFile(INPUT_FILE)
        print(f"Sheet tersedia: {xl.sheet_names}")
        if SHEET_NAME in xl.sheet_names:
            df = pd.read_excel(INPUT_FILE, sheet_name=SHEET_NAME, header=None)
        else:
            df = pd.read_excel(INPUT_FILE, sheet_name=0, header=None)
            print(f"[WARN] Sheet '{SHEET_NAME}' tidak ditemukan, pakai sheet pertama.")
    except Exception as e:
        print(f"Gagal membaca file: {e}")
        return

    print(f"Ukuran DataFrame: {df.shape}")
    final_json = {}

    # 1. HORIZONTAL
    print("\nMengekstrak data umum (horizontal)...")
    horz_config = DATA_STRUCTURE.get("horizontal", {})
    for group_name, content in horz_config.items():
        if isinstance(content, list):
            group_data = {}
            for raw_key in content:
                skip = normalize(raw_key) in SKIP_REMAINDER_KEYS
                value = scan_value(df, raw_key, direction="horizontal", skip_remainder=skip)
                group_data[make_key_cool(raw_key)] = value
            safe_group = "24_hours" if group_name == "24_hours" else make_key_cool(group_name)
            final_json[safe_group] = group_data
        elif isinstance(content, dict):
            group_data = {}
            for sub_cat, sub_keys in content.items():
                sub_group = {}
                for raw_key in sub_keys:
                    skip = normalize(raw_key) in SKIP_REMAINDER_KEYS
                    value = scan_value(df, raw_key, direction="horizontal", skip_remainder=skip)
                    sub_group[make_key_cool(raw_key)] = value
                group_data[make_key_cool(sub_cat)] = sub_group
            final_json[make_key_cool(group_name)] = group_data

    # 2. VERTICAL
    print("Mengekstrak data vertikal...")
    vert_keys = DATA_STRUCTURE.get("vertical", [])
    if vert_keys:
        vert_data = {}
        for raw_key in vert_keys:
            value = scan_value(df, raw_key, direction="vertical")
            vert_data[make_key_cool(raw_key)] = value
        final_json["vertical_data"] = vert_data

    # 3. BIT RECORDS
    print("Mengekstrak Bit Records...")
    bit_keys = DATA_STRUCTURE.get("bit_records", [])
    if bit_keys:
        bit_data = extract_bit_records(df, bit_keys)
        final_json["bit_records"] = bit_data if bit_data else "Tidak ditemukan di dokumen ini"

    # 4. TIME BREAKDOWN
    print("Mengekstrak Time Breakdown...")
    time_data = extract_time_breakdown(df)
    final_json["time_breakdown"] = time_data

    # Simpan JSON
    print("\n" + "=" * 40)
    os.makedirs("outputs", exist_ok=True)
    base_name = os.path.splitext(os.path.basename(INPUT_FILE))[0]
    out_path = _OUTPUT_FILE or f"outputs/{base_name}_extracted.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(final_json, f, indent=4, ensure_ascii=False)
    print(f"[✅] JSON disimpan ke: {out_path}")


if __name__ == "__main__":
    main()