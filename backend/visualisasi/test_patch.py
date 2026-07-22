# test_patch.py
import sys
import os

from img2table.document import PDF
from img2table.ocr import PaddleOCR
from img2table.ocr._types import OCRData

def paddle_of(self, document) -> OCRData | None:
    print("[PATCH] Running custom of() method for PaddleOCR...")
    records = {}
    for page_num, img in enumerate(document.images):
        cls = getattr(self.ocr, "use_angle_cls", True)
        res = self.ocr.ocr(img, cls=cls)
        if not res or not res[0]:
            continue
        page_records = []
        for idx, line in enumerate(res[0]):
            poly, (word, conf) = line[0], line[1]
            xs = [p[0] for p in poly]
            ys = [p[1] for p in poly]
            x1, y1, x2, y2 = min(xs), min(ys), max(xs), max(ys)
            dict_word = {
                "id": f"word_{page_num + 1}_{idx + 1}",
                "parent": f"word_{page_num + 1}_{idx + 1}",
                "value": word,
                "confidence": int(100 * conf),
                "x1": int(x1),
                "y1": int(y1),
                "x2": int(x2),
                "y2": int(y2),
            }
            page_records.append(dict_word)
        if page_records:
            records[page_num] = page_records
    return OCRData(records=records) if records else None

PaddleOCR.of = paddle_of

print("[PATCH] Monkeypatch applied.")

# Try to initialize and run pdf_to_excel
from pdf_to_excel import pdf_to_excel
res = pdf_to_excel("uploads/Group 1.pdf", engine="paddle")
print(f"[PATCH] Result path: {res}")
