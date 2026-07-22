# generate_tier1_pred.py
"""
Generator Prediksi Tier 1 (Spatial Region BBox).
Menjalankan PaddleOCR dan EasyOCR pada file PDF di resolusi 200 DPI,
lalu menyimpan koordinat kotak & teks terdeteksi ke dalam format JSON.

Output:
  - predictions/paddle_tier1/<nama>_pred.json
  - predictions/easy_tier1/<nama>_pred.json
"""

import argparse
import json
import os
import sys
import time

import easyocr
import fitz  # PyMuPDF
import numpy as np
from paddleocr import PaddleOCR
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


def run_paddle(pdf_path: str, ocr: PaddleOCR, dpi: int = 200) -> list[dict]:
    images = pdf_to_images(pdf_path, dpi=dpi)
    regions = []
    idx = 1
    
    for page_num, img in enumerate(images):
        res = ocr.ocr(img)
        if not res or not res[0]:
            continue
        for line in res[0]:
            poly, text = line[0], str(line[1][0])
            bbox = polygon_to_bbox(poly)
            regions.append({
                "id": f"r{idx:04d}",
                "page": int(page_num),
                "bbox": bbox,
                "text": text
            })
            idx += 1
            
    regions.sort(key=lambda r: (r["page"], r["bbox"][1], r["bbox"][0]))
    return regions


def run_easy(pdf_path: str, reader: easyocr.Reader, dpi: int = 200) -> list[dict]:
    images = pdf_to_images(pdf_path, dpi=dpi)
    regions = []
    idx = 1
    
    for page_num, img in enumerate(images):
        results = reader.readtext(img, detail=1, paragraph=False)
        for poly, text, conf in results:
            bbox = polygon_to_bbox(poly)
            regions.append({
                "id": f"r{idx:04d}",
                "page": int(page_num),
                "bbox": bbox,
                "text": str(text),
                "confidence": round(float(conf), 4)
            })
            idx += 1
            
    regions.sort(key=lambda r: (r["page"], r["bbox"][1], r["bbox"][0]))
    return regions


def save_prediction(regions: list[dict], pdf_path: str, output_dir: str, dpi: int, model_name: str, time_sec: float):
    os.makedirs(output_dir, exist_ok=True)
    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    out_path = os.path.join(output_dir, f"{base_name}_pred.json")
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({
            "source_pdf": os.path.basename(pdf_path),
            "model": model_name,
            "dpi": dpi,
            "time_sec": round(time_sec, 2),
            "total_regions": len(regions),
            "regions": regions
        }, f, indent=2, ensure_ascii=False)
    print(f"  [{model_name}] -> {out_path} ({len(regions)} regions in {time_sec:.2f}s)")


def main():
    parser = argparse.ArgumentParser(description="Generate Prediksi BBox (PaddleOCR & EasyOCR)")
    parser.add_argument("--samples-dir", default="samples", help="Folder berisi PDF sampel")
    parser.add_argument("--input", "-i", default=None, help="Proses 1 file PDF tertentu")
    parser.add_argument("--paddle-out", default="predictions/paddle", help="Folder output PaddleOCR")
    parser.add_argument("--easy-out", default="predictions/easy", help="Folder output EasyOCR")
    parser.add_argument("--dpi", type=int, default=200, help="DPI rendering (default: 200)")
    args = parser.parse_args()
    
    if args.input:
        pdf_files = [os.path.basename(args.input)]
        samples_dir = os.path.dirname(args.input) or args.samples_dir
    else:
        samples_dir = args.samples_dir
        pdf_files = sorted([f for f in os.listdir(samples_dir) if f.endswith(".pdf")])
        
    print("[init] Memuat PaddleOCR...")
    paddle_ocr = PaddleOCR(lang="en", show_log=False)
    print("[init] Memuat EasyOCR...")
    easy_reader = easyocr.Reader(["en"], gpu=True)
    
    for pdf_file in pdf_files:
        pdf_path = os.path.join(samples_dir, pdf_file)
        if not os.path.exists(pdf_path):
            print(f"[SKIP] File tidak ditemukan: {pdf_path}")
            continue
            
        print(f"\n[{pdf_file}] (@ {args.dpi} DPI)")
        
        print("  Menjalankan PaddleOCR...")
        t0 = time.time()
        paddle_res = run_paddle(pdf_path, paddle_ocr, dpi=args.dpi)
        t_paddle = time.time() - t0
        save_prediction(paddle_res, pdf_path, args.paddle_out, args.dpi, "PaddleOCR", t_paddle)
        
        print("  Menjalankan EasyOCR...")
        t0 = time.time()
        easy_res = run_easy(pdf_path, easy_reader, dpi=args.dpi)
        t_easy = time.time() - t0
        save_prediction(easy_res, pdf_path, args.easy_out, args.dpi, "EasyOCR", t_easy)
        

if __name__ == "__main__":
    main()
