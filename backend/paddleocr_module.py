# paddleocr_module.py

import os
import sys
import time

import fitz  # PyMuPDF
import numpy as np
from jiwer import cer, wer
from paddleocr import PaddleOCR
from PIL import Image


def compute_f1(reference: str, hypothesis: str) -> float:
    """
    Hitung F1 score berbasis token (word-level).
    F1 = 2 * precision * recall / (precision + recall)
    """
    ref_tokens = reference.split()
    hyp_tokens = hypothesis.split()
    ref_set = set(ref_tokens)
    hyp_set = set(hyp_tokens)
    common = ref_set & hyp_set
    if not common:
        return 0.0
    precision = len(common) / len(hyp_set) if hyp_set else 0.0
    recall = len(common) / len(ref_set) if ref_set else 0.0
    if precision + recall == 0:
        return 0.0
    return round(2 * precision * recall / (precision + recall), 4)


def pdf_to_images(pdf_path: str, dpi: int = 200) -> list[np.ndarray]:
    """
    Konversi setiap halaman PDF ke numpy array.
    Fungsi ini identik dengan easyocr_module agar preprocessing fair.
    """
    doc = fitz.open(pdf_path)
    images = []
    for page in doc:
        mat = fitz.Matrix(dpi / 72, dpi / 72)
        pix = page.get_pixmap(matrix=mat)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        images.append(np.array(img))
    doc.close()
    return images


def run_paddleocr(pdf_path: str, ocr: PaddleOCR) -> tuple[str, float]:
    """
    Jalankan PaddleOCR pada satu file PDF.
    Return: (teks_hasil_ocr, waktu_dalam_detik)
    """
    images = pdf_to_images(pdf_path)
    start = time.time()

    all_text = []
    for img in images:
        result = ocr.ocr(img)
        if result and result[0]:
            for line in result[0]:
                # line[1] = (teks, confidence)
                all_text.append(line[1][0])

    elapsed = time.time() - start
    return "\n".join(all_text), elapsed


def evaluate_paddleocr(
    samples_dir: str, gt_dir: str, target_files: list = None
) -> list[dict]:
    """
    Evaluasi PaddleOCR pada semua sampel DDR.
    Return: list of dict berisi metrik per dokumen.
    """
    ocr = PaddleOCR(lang="en")

    results = []
    if target_files:
        pdf_files = target_files
    else:
        pdf_files = sorted([f for f in os.listdir(samples_dir) if f.endswith(".pdf")])

    for pdf_file in pdf_files:
        base_name = pdf_file.replace(".pdf", "")
        pdf_path = os.path.join(samples_dir, pdf_file)
        gt_path = os.path.join(gt_dir, f"{base_name}_gt.txt")

        if not os.path.exists(gt_path):
            print(f"[SKIP] Ground truth tidak ditemukan: {gt_path}")
            continue

        with open(gt_path, "r", encoding="utf-8") as f:
            ground_truth = f.read().strip()

        print(f"[PaddleOCR] Memproses: {pdf_file}")
        ocr_text, elapsed = run_paddleocr(pdf_path, ocr)

        word_error_rate = wer(ground_truth, ocr_text)
        char_error_rate = cer(ground_truth, ocr_text)

        f1_score = compute_f1(ground_truth, ocr_text)

        results.append(
            {
                "file": pdf_file,
                "model": "PaddleOCR",
                "cer": round(char_error_rate, 4),
                "wer": round(word_error_rate, 4),
                "f1": f1_score,
                "time_sec": round(elapsed, 2),
            }
        )

        print(
            f"  CER: {char_error_rate:.4f} | WER: {word_error_rate:.4f} | F1: {f1_score:.4f} | Waktu: {elapsed:.2f}s"
        )

    return results


if __name__ == "__main__":
    import json

    SAMPLES_DIR = "samples"
    GT_DIR = "groundtruth"

    # Jika ada argumen CLI, proses 1 file saja
    # Contoh: python paddleocr_module.py nama_file.pdf
    if len(sys.argv) > 1:
        single_file = sys.argv[1]
        # Pastikan nama file saja (bukan path penuh)
        single_file = os.path.basename(single_file)
        print(f"[PaddleOCR] Mode 1 file: {single_file}")
        hasil = evaluate_paddleocr(SAMPLES_DIR, GT_DIR, target_files=[single_file])
    else:
        hasil = evaluate_paddleocr(SAMPLES_DIR, GT_DIR)

    print("\n=== Hasil PaddleOCR ===")
    print(json.dumps(hasil, indent=2))
