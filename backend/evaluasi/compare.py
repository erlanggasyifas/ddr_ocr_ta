# compare.py
"""
Skrip Komparasi Utama (Model Selection - Spatial BBox Evaluation).
Mengevaluasi akurasi PaddleOCR dan EasyOCR menggunakan metode Bounding Box (IoU >= 0.5)
yang bebas dari bias reading order.

Menghitung:
  - WER (Word Error Rate - Micro)
  - CER (Character Error Rate - Micro)
  - F1-Score (Spatial Detection F1)
  - Waktu Eksekusi (Time in seconds)
"""

import json
import os
from evaluator_spatial import evaluate_spatial


def main():
    gt_dir = "evaluasi/groundtruth/bbox"
    pred_dirs = {
        "PaddleOCR": "evaluasi/predictions/paddle",
        "EasyOCR": "evaluasi/predictions/easy"
    }
    
    if not os.path.exists(gt_dir):
        print(f"❌ Folder Ground Truth tidak ditemukan: {gt_dir}")
        print("👉 Jalankan terlebih dahulu: python bootstrap_gt.py samples/<file>.pdf")
        return

    gt_files = sorted([f for f in os.listdir(gt_dir) if f.endswith("_gt.json")])
    if not gt_files:
        print(f"❌ Belum ada file Ground Truth di {gt_dir}")
        return

    all_results = []

    print("\n" + "=" * 80)
    print("       KOMPARASI AKURASI OCR (SPATIAL BOUNDING BOX EVALUATION)")
    print("=" * 80)
    print(f"{'Sample File':<18} {'Model':<12} {'WER':>8} {'CER':>8} {'F1-Score':>10} {'Waktu(s)':>10}")
    print("-" * 80)

    for gt_file in gt_files:
        base_name = gt_file.replace("_gt.json", "")
        gt_path = os.path.join(gt_dir, gt_file)

        for model_name, pred_dir in pred_dirs.items():
            pred_path = os.path.join(pred_dir, f"{base_name}_pred.json")
            
            if not os.path.exists(pred_path):
                print(f"{base_name:<18} {model_name:<12} {'N/A':>8} {'N/A':>8} {'N/A':>10} {'N/A':>10}")
                continue

            # Baca waktu eksekusi dari file prediksi jika ada
            time_sec = 0.0
            with open(pred_path, "r", encoding="utf-8") as f:
                pred_data = json.load(f)
                time_sec = pred_data.get("time_sec", 0.0)

            # Evaluasi akurasi spasial
            res = evaluate_spatial(gt_path, pred_path)
            if not res:
                continue

            wer_val = res["micro_wer"]
            cer_val = res["micro_cer"]
            f1_val = res["f1_score"]

            print(f"{base_name:<18} {model_name:<12} {wer_val:>8.4f} {cer_val:>8.4f} {f1_val:>10.4f} {time_sec:>10.2f}")

            all_results.append({
                "file": f"{base_name}.pdf",
                "model": model_name,
                "wer": wer_val,
                "cer": cer_val,
                "f1_score": f1_val,
                "time_sec": time_sec,
                "details": res
            })

    print("-" * 80)

    # Hitung rata-rata per model
    for model_name in pred_dirs.keys():
        model_res = [r for r in all_results if r["model"] == model_name]
        if not model_res:
            continue
        avg_wer = sum(r["wer"] for r in model_res) / len(model_res)
        avg_cer = sum(r["cer"] for r in model_res) / len(model_res)
        avg_f1 = sum(r["f1_score"] for r in model_res) / len(model_res)
        avg_time = sum(r["time_sec"] for r in model_res) / len(model_res)
        print(f"Rata-rata {model_name:<10}: WER={avg_wer:.4f} | CER={avg_cer:.4f} | F1-Score={avg_f1:.4f} | Waktu={avg_time:.2f}s")

    print("=" * 80)

    # Simpan ke JSON
    os.makedirs("outputs", exist_ok=True)
    out_file = "outputs/evaluation_results.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    print(f"\n✅ Hasil lengkap disimpan ke {out_file}\n")


if __name__ == "__main__":
    main()
