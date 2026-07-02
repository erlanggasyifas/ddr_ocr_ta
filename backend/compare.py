# compare.py

import json

from easyocr_module import evaluate_easyocr
from paddleocr_module import evaluate_paddleocr

SAMPLES_DIR = "samples"
GT_DIR = "groundtruth"

# ─── Pilih file yang mau diuji ───────────────────────────────────────────────
# Tambah atau kurangi sesuai kebutuhan
TARGET_FILES = [
    "ddr_20220712.pdf",
    # "ddr_20220713.pdf",  # uncomment kalau mau ikut ditest
]
# ─────────────────────────────────────────────────────────────────────────────

print("Menjalankan EasyOCR...")
easy_results = evaluate_easyocr(SAMPLES_DIR, GT_DIR, target_files=TARGET_FILES)

print("\nMenjalankan PaddleOCR...")
paddle_results = evaluate_paddleocr(SAMPLES_DIR, GT_DIR, target_files=TARGET_FILES)

# Gabungkan dan cetak tabel
all_results = easy_results + paddle_results

print("\n" + "=" * 70)
print(f"{'File':<20} {'Model':<12} {'WER':>8} {'CER':>8} {'Waktu(s)':>10}")
print("=" * 70)
for r in sorted(all_results, key=lambda x: (x["file"], x["model"])):
    print(
        f"{r['file']:<20} {r['model']:<12} {r['wer']:>8.4f} {r['cer']:>8.4f} {r['time_sec']:>10.2f}"
    )

for model_name, results in [("EasyOCR", easy_results), ("PaddleOCR", paddle_results)]:
    if not results:
        continue
    avg_wer = sum(r["wer"] for r in results) / len(results)
    avg_cer = sum(r["cer"] for r in results) / len(results)
    avg_time = sum(r["time_sec"] for r in results) / len(results)
    print(
        f"\nRata-rata {model_name}: WER={avg_wer:.4f} | CER={avg_cer:.4f} | Waktu={avg_time:.2f}s"
    )

# Simpan ke JSON
import os

os.makedirs("outputs", exist_ok=True)
with open("outputs/evaluation_results.json", "w") as f:
    json.dump(all_results, f, indent=2)
print("\nHasil disimpan ke outputs/evaluation_results.json")
