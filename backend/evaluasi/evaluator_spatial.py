# evaluator_tier1.py
"""
Evaluator Tier 1 (Spatial Region BBox).
Mencocokkan bounding box Ground Truth dan Prediksi menggunakan IoU >= threshold (0.5),
lalu menghitung Levenshtein distance (CER & WER) di dalam kotak yang cocok.

Menghilangkan 100% bias reading order dari evaluasi!
"""

import json
import os
from jiwer import cer, wer


def iou(box_a: list[float], box_b: list[float]) -> float:
    ax1, ay1, ax2, ay2 = box_a
    bx1, by1, bx2, by2 = box_b
    
    iw = max(0.0, min(ax2, bx2) - max(ax1, bx1))
    ih = max(0.0, min(ay2, by2) - max(ay1, by1))
    iarea = iw * ih
    
    area_a = max(0.0, ax2 - ax1) * max(0.0, ay2 - ay1)
    area_b = max(0.0, bx2 - bx1) * max(0.0, by2 - by1)
    uarea = area_a + area_b - iarea
    
    return iarea / uarea if uarea > 0 else 0.0


def iog(box_gt: list[float], box_pred: list[float]) -> float:
    ax1, ay1, ax2, ay2 = box_gt
    bx1, by1, bx2, by2 = box_pred
    
    iw = max(0.0, min(ax2, bx2) - max(ax1, bx1))
    ih = max(0.0, min(ay2, by2) - max(ay1, by1))
    iarea = iw * ih
    
    gt_area = max(0.0, ax2 - ax1) * max(0.0, ay2 - ay1)
    return iarea / gt_area if gt_area > 0 else 0.0


def evaluate_spatial(gt_path: str, pred_path: str, iou_thresh: float = 0.5) -> dict:
    if not os.path.exists(gt_path) or not os.path.exists(pred_path):
        return None
        
    with open(gt_path, "r", encoding="utf-8") as f:
        gt_data = json.load(f)
        gt_regions = gt_data.get("regions", [])
        
    with open(pred_path, "r", encoding="utf-8") as f:
        pred_data = json.load(f)
        pred_regions = pred_data.get("regions", [])
        
    # Kelompokkan berdasarkan halaman
    gt_by_page = {}
    for g in gt_regions:
        gt_by_page.setdefault(g.get("page", 0), []).append(g)
        
    pred_by_page = {}
    for p in pred_regions:
        pred_by_page.setdefault(p.get("page", 0), []).append(p)
        
    matched_gt_ids = set()
    matched = []
    missed = []
    matched_pred_count = 0
    
    tot_char_dist = 0
    tot_char_len = 0
    tot_word_dist = 0
    tot_word_len = 0
    
    macro_cers = []
    macro_wers = []
    
    for page, preds in pred_by_page.items():
        gts = gt_by_page.get(page, [])
        for p in preds:
            # Cari semua GT yang berada di dalam prediksi ini (overlap/IoG >= thresh)
            overlapping_gts = []
            for g in gts:
                if g["id"] not in matched_gt_ids and (iog(g["bbox"], p["bbox"]) >= iou_thresh or iou(g["bbox"], p["bbox"]) >= iou_thresh):
                    overlapping_gts.append(g)
                    
            if overlapping_gts:
                matched_pred_count += 1
                for g in overlapping_gts:
                    matched_gt_ids.add(g["id"])
                # Urutkan secara spasial (atas ke bawah, lalu kiri ke kanan)
                overlapping_gts.sort(key=lambda x: (x["bbox"][1], x["bbox"][0]))
                g_text = " ".join(g["text"] for g in overlapping_gts).strip()
                p_text = p["text"]
                
                matched.append((g_text, p_text, 1.0))
                
                g_len = max(len(g_text), 1)
                g_words = max(len(g_text.split()), 1)
                c_dist = int(cer(g_text, p_text) * len(g_text))
                w_dist = int(wer(g_text, p_text) * len(g_text.split()))
                
                tot_char_dist += c_dist
                tot_char_len += g_len
                tot_word_dist += w_dist
                tot_word_len += g_words
                
                macro_cers.append(cer(g_text, p_text))
                macro_wers.append(wer(g_text, p_text))
                
    # Hitung GT yang missed
    for g in gt_regions:
        if g["id"] not in matched_gt_ids:
            m_text = g["text"]
            missed.append(m_text)
            g_len = max(len(m_text), 1)
            g_words = max(len(m_text.split()), 1)
            
            tot_char_dist += g_len
            tot_char_len += g_len
            tot_word_dist += g_words
            tot_word_len += g_words
            
            macro_cers.append(1.0)
            macro_wers.append(1.0)
            
    micro_cer = tot_char_dist / tot_char_len if tot_char_len else 0.0
    micro_wer = tot_word_dist / tot_word_len if tot_word_len else 0.0
    
    macro_cer = sum(macro_cers) / len(macro_cers) if macro_cers else 0.0
    macro_wer = sum(macro_wers) / len(macro_wers) if macro_wers else 0.0
    
    total_gt = len(gt_regions)
    recall = len(matched_gt_ids) / total_gt if total_gt else 0.0
    
    total_pred = len(pred_regions)
    precision = matched_pred_count / total_pred if total_pred else 0.0
    
    if precision + recall > 0:
        f1_score = 2 * (precision * recall) / (precision + recall)
    else:
        f1_score = 0.0
        
    extra_count = max(0, total_pred - matched_pred_count)
    
    return {
        "total_gt": total_gt,
        "total_pred": total_pred,
        "matched": len(matched_gt_ids),
        "missed": len(missed),
        "hallucinations": extra_count,
        "recall": round(recall, 4),
        "precision": round(precision, 4),
        "f1_score": round(f1_score, 4),
        "micro_cer": round(micro_cer, 4),
        "micro_wer": round(micro_wer, 4),
        "macro_cer": round(macro_cer, 4),
        "macro_wer": round(macro_wer, 4)
    }


if __name__ == "__main__":
    import sys
    gt_file = sys.argv[1] if len(sys.argv) > 1 else "groundtruth/bbox/ddr_20220712_gt.json"
    pred_file = sys.argv[2] if len(sys.argv) > 2 else "predictions/paddle/ddr_20220712_pred.json"
    
    res = evaluate_spatial(gt_file, pred_file)
    print(json.dumps(res, indent=2))
