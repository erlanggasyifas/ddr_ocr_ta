# bootstrap_gt.py
"""
Skrip Auto-Bootstrap Ground Truth Tier 1 (Spatial Region BBox).
Mendukung 2 metode:
1. --method dom    (DEFAULT - 100% NETRAL): Mengambil BBox & teks langsung dari struktur DOM PDF via PyMuPDF.
2. --method paddle (AI Assisted): Mendeteksi BBox menggunakan DBNet PaddleOCR pada 200 DPI.

Hasil disimpan ke groundtruth/bbox/<nama>_gt.json.
"""

import argparse
import json
import os
import sys

import fitz  # PyMuPDF
import numpy as np
from PIL import Image


def pdf_to_images(pdf_path: str, dpi: int = 200) -> list[np.ndarray]:
    doc = fitz.open(pdf_path)
    images = []
    for page in doc:
        mat = fitz.Matrix(dpi / 72, dpi / 72)
        pix = page.get_pixmap(matrix=mat)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        images.append(np.array(img))
    doc.close()
    return images


def polygon_to_bbox(polygon) -> list[float]:
    xs = [float(p[0]) for p in polygon]
    ys = [float(p[1]) for p in polygon]
    return [round(min(xs), 1), round(min(ys), 1), round(max(xs), 1), round(max(ys), 1)]


def bootstrap_dom(pdf_path: str, output_dir: str = "groundtruth/bbox", dpi: int = 200):
    print(f"[bootstrap-dom] Mengambil region langsung dari DOM PDF (100% Netral tanpa AI): {pdf_path} (@ {dpi} DPI)...")
    doc = fitz.open(pdf_path)
    scale = dpi / 72.0
    regions = []
    idx = 1
    
    for page_num, page in enumerate(doc):
        # get_text("words") mengembalikan tuple: (x0, y0, x1, y1, word, block_no, line_no, word_no)
        words = page.get_text("words")
        
        # Kelompokkan kata berdasarkan toleransi baris vertikal & gap horizontal (100% netral secara struktur geometri)
        words_sorted = sorted(words, key=lambda w: (w[1], w[0]))
        lines = []
        for w in words_sorted:
            ymid = (w[1] + w[3]) / 2
            placed = False
            for line in lines:
                ly0 = min(item[1] for item in line)
                ly1 = max(item[3] for item in line)
                if ly0 - 3 <= ymid <= ly1 + 3:
                    line.append(w)
                    placed = True
                    break
            if not placed:
                lines.append([w])
                
        for line_words in lines:
            line_words.sort(key=lambda w: w[0])
            current_box = [line_words[0]]
            for w in line_words[1:]:
                if w[0] - current_box[-1][2] <= 15:
                    current_box.append(w)
                else:
                    x0 = min(item[0] for item in current_box) * scale
                    y0 = min(item[1] for item in current_box) * scale
                    x1 = max(item[2] for item in current_box) * scale
                    y1 = max(item[3] for item in current_box) * scale
                    text = " ".join(str(item[4]) for item in current_box).strip()
                    if text:
                        regions.append({
                            "id": f"r{idx:04d}",
                            "page": int(page_num),
                            "bbox": [round(x0, 1), round(y0, 1), round(x1, 1), round(y1, 1)],
                            "text": text
                        })
                        idx += 1
                    current_box = [w]
            x0 = min(item[0] for item in current_box) * scale
            y0 = min(item[1] for item in current_box) * scale
            x1 = max(item[2] for item in current_box) * scale
            y1 = max(item[3] for item in current_box) * scale
            text = " ".join(str(item[4]) for item in current_box).strip()
            if text:
                regions.append({
                    "id": f"r{idx:04d}",
                    "page": int(page_num),
                    "bbox": [round(x0, 1), round(y0, 1), round(x1, 1), round(y1, 1)],
                    "text": text
                })
                idx += 1
            
    doc.close()
    regions.sort(key=lambda r: (r["page"], r["bbox"][1], r["bbox"][0]))
    
    os.makedirs(output_dir, exist_ok=True)
    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    out_path = os.path.join(output_dir, f"{base_name}_gt.json")
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({
            "source_pdf": os.path.basename(pdf_path),
            "dpi": dpi,
            "method": "dom_extraction (100% netral tanpa AI)",
            "total_regions": len(regions),
            "regions": regions
        }, f, indent=2, ensure_ascii=False)
        
    print(f"✅ Bootstrap DOM berhasil! {len(regions)} region disimpan ke: {out_path}")
    print("👉 True Ground Truth (100% netral tanpa bias model AI).")


def bootstrap_paddle(pdf_path: str, output_dir: str = "groundtruth/bbox", dpi: int = 200):
    print(f"[bootstrap-paddle] Mendeteksi region menggunakan PaddleOCR DBNet: {pdf_path} (@ {dpi} DPI)...")
    from paddleocr import PaddleOCR
    ocr = PaddleOCR(lang="en", show_log=False)
    images = pdf_to_images(pdf_path, dpi=dpi)
    
    regions = []
    idx = 1
    
    for page_num, img in enumerate(images):
        res = ocr.ocr(img)
        if not res or not res[0]:
            continue
        for line in res[0]:
            poly = line[0]
            text = str(line[1][0])
            bbox = polygon_to_bbox(poly)
            regions.append({
                "id": f"r{idx:04d}",
                "page": int(page_num),
                "bbox": bbox,
                "text": text
            })
            idx += 1
            
    regions.sort(key=lambda r: (r["page"], r["bbox"][1], r["bbox"][0]))
    os.makedirs(output_dir, exist_ok=True)
    
    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    out_path = os.path.join(output_dir, f"{base_name}_gt.json")
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({
            "source_pdf": os.path.basename(pdf_path),
            "dpi": dpi,
            "method": "paddle_dbnet (AI assisted)",
            "total_regions": len(regions),
            "regions": regions
        }, f, indent=2, ensure_ascii=False)
        
    print(f"✅ Bootstrap Paddle berhasil! {len(regions)} region disimpan ke: {out_path}")
    print("👉 Selanjutnya: Periksa dengan PDF asli dan koreksi field 'text' jika ada salah baca.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Bootstrap Ground Truth Tier 1 dari file PDF")
    parser.add_argument("input", nargs="?", default="samples", help="Path file PDF atau folder samples (default: folder samples)")
    parser.add_argument("--output-dir", "-o", default="groundtruth/bbox", help="Folder output JSON")
    parser.add_argument("--dpi", type=int, default=200, help="DPI rendering (default: 200)")
    parser.add_argument("--method", "-m", choices=["dom", "paddle"], default="dom", help="Metode ekstraksi: 'dom' (100% netral, default) atau 'paddle' (AI assisted)")
    args = parser.parse_args()
    
    runner = bootstrap_dom if args.method == "dom" else bootstrap_paddle
    
    if os.path.isdir(args.input):
        for f in sorted(os.listdir(args.input)):
            if f.endswith(".pdf"):
                runner(os.path.join(args.input, f), args.output_dir, args.dpi)
    else:
        runner(args.input, args.output_dir, args.dpi)
