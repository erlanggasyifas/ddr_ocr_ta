# BAB IV HASIL DAN PEMBAHASAN

## 4.1. Implementasi Pipeline Ekstraksi Data DDR

Implementasi pipeline ekstraksi data merupakan tahapan realisasi dari rancangan *intelligent pipeline* yang telah dijabarkan pada Sub-bab 3.2.3. Pipeline ini bertanggung jawab mengubah berkas PDF *Daily Drilling Report* (DDR) menjadi data terstruktur yang siap disimpan ke basis data MySQL, melalui empat tahap teknis berurutan: pra-pemrosesan citra, deteksi struktur tabel, perataan lembar kerja, dan pemindaian atribut.

### 4.1.1. Pra-Pemrosesan Citra Dokumen (PyMuPDF)

Pengonversian halaman PDF DDR menjadi citra digital dilakukan dengan resolusi 200 DPI menggunakan pustaka *PyMuPDF (fitz)*. Resolusi 200 DPI dipilih melalui pertimbangan keseimbangan antara keterbacaan teks dan efisiensi komputasi: resolusi di bawah 150 DPI berisiko menghasilkan citra yang terlalu kasar sehingga karakter pada sel tabel DDR yang berukuran kecil menjadi kabur dan sulit dikenali oleh model OCR, sedangkan resolusi di atas 300 DPI secara signifikan meningkatkan ukuran data dan waktu pemrosesan tanpa memberikan peningkatan akurasi yang berarti pada dokumen DDR yang diuji. Berdasarkan analisis komparasi model OCR pada Sub-bab 4.4, fungsi ini diintegrasikan pada modul pengujian untuk menyiapkan gambar *ground truth* dari berkas PDF. Langkah perenderan halaman PDF menjadi citra piksel ini dilakukan secara sengaja baik untuk berkas PDF digital (hasil ekspor komputer) maupun berkas hasil pemindaian (*scanned PDF*), guna memastikan pengujian mengukur kapabilitas pengenalan karakter berbasis citra visual murni (*Optical Character Recognition*) dan bukan sekadar pembacaan teks digital (*text layer extraction*). Sementara itu, pada modul utama visualisasi dasbor, ekstraksi tabel secara langsung memanfaatkan pustaka *img2table* yang menangani pembacaan dokumen secara internal. Potongan kode implementasi fungsi konversi halaman PDF menjadi citra ditunjukkan pada Gambar 4.1.

```python
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
```
![Gambar 4.1 Potongan Kode Konversi Halaman PDF ke Citra 200 DPI](images/gambar-4.1-kode-pymupdf.png)

**Gambar 4.1 Potongan Kode Konversi Halaman PDF ke Citra 200 DPI**

Alur komputasi pada potongan kode Gambar 4.1 dijabarkan sebagai berikut:

i. Baris ke-2 membuka berkas PDF menggunakan *fitz.open()* untuk mendapatkan objek dokumen yang dapat diiterasi per halaman.
ii. Baris ke-5 menghitung faktor perbesaran (*zoom*) berdasarkan target resolusi 200 DPI (*dpi / 72*) guna menentukan matriks transformasi render.
iii. Baris ke-6 memanggil metode *page.get_pixmap(matrix=mat)* untuk merender halaman PDF menjadi objek biner *Pixmap*.
iv. Baris ke-7 dan 8 mengonversi hasil *pixmap* menjadi array *numpy* dengan ruang warna RGB agar dapat diproses lebih lanjut oleh modul evaluasi OCR.

### 4.1.2. Deteksi dan Ekspor Struktur Tabel (img2table + PaddleOCR)

Setelah halaman dokumen diproses, sistem mendeteksi kotak pembatas tabel menggunakan pustaka *img2table* yang dipadukan dengan *engine* PaddleOCR. Langkah ini bertujuan untuk mengidentifikasi sel-sel tabel dan mengekspor hasilnya ke berkas Excel (*.xlsx*) sebagai berkas kerja sementara. Potongan kode implementasi ditunjukkan pada Gambar 4.2.

```python
    if engine.lower() == "easy":
        from img2table.ocr import EasyOCR
        ocr = EasyOCR(lang=["en"])
    else:
        ocr = PaddleOCR(lang="en")

    try:
        doc = PDF(src=pdf_path)
        doc.to_xlsx(
            dest=temp_file,
            ocr=ocr,
            implicit_rows=False,
            borderless_tables=False,
            min_confidence=50,
        )
```
![Gambar 4.2 Potongan Kode Deteksi Tabel dan Ekspor ke Excel](images/gambar-4.2-kode-img2table.png)

**Gambar 4.2 Potongan Kode Deteksi Tabel dan Ekspor ke Excel**

Penjelasan dari potongan kode Gambar 4.2 adalah sebagai berikut:

i. Baris ke-1 hingga 4 menginisialisasi *engine* OCR yang akan digunakan. Jika parameter berupa *"easy"*, sistem menggunakan EasyOCR, sedangkan secara default sistem menggunakan PaddleOCR.
ii. Baris ke-8 memuat berkas PDF menggunakan kelas *PDF* dari *img2table*.
iii. Baris ke-9 hingga 15 mengeksekusi metode *to_xlsx()* untuk mendeteksi tabel dan mengekspornya ke berkas sementara (*temp_file*). Parameter *implicit_rows* dan *borderless_tables* ditetapkan *false* karena tabel DDR memiliki garis pembatas yang jelas. Tingkat kepercayaan minimal OCR ditetapkan sebesar 50% (*min_confidence=50*).

### 4.1.3. Perataan Lembar Kerja (Sheet Flattening)

Berkas Excel hasil ekspor dari *img2table* masih menyertakan sel-sel tergabung (*merged cells*) yang menghambat pembacaan data secara terstruktur oleh *pandas*. Untuk mengatasinya, sistem menggunakan pustaka *openpyxl* untuk meratakan lembar kerja ke dalam lembar baru bernama *"Data Flat"*. Potongan kode fungsi perataan ditunjukkan pada Gambar 4.3.

```python
def copy_sheet_content_no_merge(source_ws, target_ws, row_offset):
    for row in source_ws.iter_rows():
        for cell in row:
            if isinstance(cell, openpyxl.cell.cell.MergedCell):
                continue
            new_cell = target_ws.cell(
                row=cell.row + row_offset, column=cell.column, value=cell.value
            )
            if cell.has_style:
                new_cell.alignment = copy(cell.alignment)
                new_cell.font = copy(cell.font)
                new_cell.border = copy(cell.border)
                new_cell.fill = copy(cell.fill)
```
![Gambar 4.3 Potongan Kode Sheet Flattening](images/gambar-4.3-kode-flattening.png)

**Gambar 4.3 Potongan Kode Sheet Flattening**

Alur kerja fungsi perataan pada Gambar 4.3 adalah sebagai berikut:

i. Baris ke-2 dan 3 melakukan iterasi pada setiap sel di lembar kerja sumber menggunakan metode *iter_rows()*.
ii. Baris ke-4 dan 5 mengabaikan sel yang merupakan bagian dari sel tergabung (*MergedCell*) agar nilai kosong di bawah atau di samping sel utama tidak menimpa data flat.
iii. Baris ke-6 hingga 8 menyalin nilai dari sel utama ke lembar kerja target *"Data Flat"* dengan penyesuaian offset baris (*row_offset*).
iv. Baris ke-9 hingga 13 menduplikasi gaya visual sel (seperti jenis huruf, perataan, bingkai, dan warna latar) menggunakan fungsi *copy* untuk menjaga konsistensi format visual dokumen.

### 4.1.4. Pemindaian Terstruktur dan Pemilahan Atribut (simple_extractor.py)

Tahap terakhir memuat lembar kerja *"Data Flat"* ke dalam *pandas DataFrame* dan menjalankan tiga metode ekstraksi atribut — pemindaian horizontal, pemindaian vertikal, dan pemilahan pola RegEx. Potongan kode lengkap fungsi pemindaian horizontal dan vertikal *scan_value* ditunjukkan pada Gambar 4.4, sedangkan fungsi pemilahan pola RegEx untuk tabel *Time Breakdown* ditunjukkan pada Gambar 4.5.

```python
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
```
![Gambar 4.4 Potongan Kode Pemindaian Horizontal Atribut Well Profile](images/gambar-4.4-kode-horizontal-scan.png)

**Gambar 4.4 Potongan Kode Pemindaian Horizontal Atribut Well Profile**

Logika komputasi pada fungsi *scan_value* (Gambar 4.4) dijabarkan sebagai berikut:

i. Baris ke-2 menormalkan kata kunci target menggunakan fungsi *normalize()*.
ii. Baris ke-3 hingga 6 menelusuri seluruh koordinat sel *DataFrame* (*iloc[r, c]*) untuk mencocokkan kemunculan kata kunci target pada sel.
iii. Baris ke-9 hingga 13 menangani pemindaian pada sel yang sama jika nilai target digabungkan dengan label (misal: "Well Name: Parama-1"). Fungsi memotong label menggunakan *re.sub()* dan mengembalikan nilai sisa jika bukan kata kunci lain.
iv. Baris ke-17 hingga 27 melakukan pencarian ke kanan hingga 14 kolom (*c + step*) untuk menemukan sel berisi nilai parameter. Jika sel berisi kata kunci lain, pencarian dihentikan.
v. Baris ke-28 hingga 36 bertindak sebagai toleransi cadangan jika nilai parameter bergeser ke baris di bawahnya (*r + 1*).
vi. Baris ke-37 hingga 48 menangani pemindaian arah vertikal dengan memindai hingga 9 baris ke bawah (*r + step*) untuk kata kunci vertikal seperti parameter keselamatan kerja (*safety record*).

```python
            val_start_str = str(val_start).strip()

            if re.match(r"^\d{1,2}:\d{2}", val_start_str):
                row_data = {
                    "start":       val_start_str,
                    "end":         get_col_val(i, col_map.get("end"), strict=True),
                    "elapsed":     get_col_val(i, col_map.get("elapsed"), strict=True),
                    "depth":       get_col_val(i, col_map.get("depth"), strict=True),
                    "pt_npt":      get_pt_npt(i, col_map.get("pt_npt")),
                    "code":        get_col_val(i, col_map.get("code"), strict=True),
                    "description": get_col_val(i, col_map.get("description")),
                    "operations":  get_operations_text(i, col_map),
                }
                time_result[current_date].append(row_data)
```
![Gambar 4.5 Potongan Kode Pemilahan Pola RegEx Tabel Time Breakdown](images/gambar-4.5-kode-regex-parsing.png)

**Gambar 4.5 Potongan Kode Pemilahan Pola RegEx Tabel Time Breakdown**

Logika fungsi pemilahan baris kronologi aktivitas pada Gambar 4.5 dijabarkan sebagai berikut:

i. Baris ke-3 menggunakan metode pencocokan ekspresi reguler *re.match* dengan pola *^\d{1,2}:\d{2}* untuk memverifikasi apakah awal baris memuat format penanda waktu (jam dan menit) yang valid.
ii. Baris ke-4 hingga 13 memetakan atribut aktivitas ke dalam struktur *dictionary* dengan bantuan koordinat pemetaan kolom (*col_map*). Pengambilan nilai dilakukan secara ketat (*strict*) untuk parameter numerik dan longgar (*operations*) untuk penjelasan teks.
iii. Baris ke-14 menambahkan hasil ekstraksi baris tersebut ke dalam objek penampung *time_result* berdasarkan tanggal operasional yang sedang aktif.

Seluruh data terstruktur dari modul pengekstrakan tersebut kemudian disimpan secara transaksional ke basis data MySQL (*ddr_documents*, *ddr_fields*, *ddr_time_breakdown*, *ddr_bit_records*) menggunakan modul konektor basis data.

---

## 4.2. Implementasi Backend dan Basis Data (FastAPI + MySQL)

Modul backend FastAPI diimplementasikan untuk mengintegrasikan pipeline ekstraksi data berbasis PaddleOCR (sebagaimana dikonfigurasikan pada Sub-bab 4.1.2) ke dalam layanan REST API asinkron serta mengelola persistensi data pada basis data relasional MySQL.

### 4.2.1. Endpoint Unggah Dokumen dan Background Task

Lapisan backend menyediakan API berbasis FastAPI untuk melayani permintaan unggah dokumen secara asinkron menggunakan pustaka *BackgroundTasks*. Hal ini menjaga kelancaran antarmuka dasbor agar tidak mengalami kemacetan (*blocking*) selama proses OCR berjalan. Potongan kode endpoint unggah dokumen ditunjukkan pada Gambar 4.6.

```python
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
```
![Gambar 4.6 Potongan Kode Endpoint Unggah Dokumen FastAPI](images/gambar-4.6-kode-endpoint-upload.png)

**Gambar 4.6 Potongan Kode Endpoint Unggah Dokumen FastAPI**

Logika endpoint unggah dokumen pada Gambar 4.6 dijelaskan sebagai berikut:

i. Baris ke-1 dan 2 mendefinisikan *route* *POST /upload* yang menerima file PDF dari operator dan mendaftarkan objek *BackgroundTasks* milik FastAPI.
ii. Baris ke-4 hingga 5 melakukan validasi ekstensi berkas. Jika bukan berkas PDF, API langsung menolak permintaan dengan kode respons 400 (*Bad Request*).
iii. Baris ke-7 hingga 9 menyimpan berkas secara fisik ke direktori penyimpanan lokal server (*UPLOAD_DIR*).
iv. Baris ke-12 hingga 16 mencatat status awal pemrosesan *"processing"* ke dalam pencatat status asinkron.
v. Baris ke-18 mendaftarkan fungsi ekstraksi *_run_pipeline* ke antrean tugas latar belakang (*background task*) agar diproses secara mandiri tanpa menahan koneksi dari dasbor Next.js.

### 4.2.2. Endpoint Polling Status dan Penyajian Data Dasbor

Dasbor Next.js melakukan pemantauan progres pemrosesan melalui *endpoint* polling status serta mengambil data terstruktur dari basis data MySQL untuk divisualisasikan. Potongan kode *endpoint* status tersebut ditunjukkan pada Gambar 4.7.

```python
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
```
![Gambar 4.7 Potongan Kode Endpoint Status dan Penyajian Data Dasbor](images/gambar-4.7-kode-endpoint-status.png)

**Gambar 4.7 Potongan Kode Endpoint Status dan Penyajian Data Dasbor**

Logika endpoint status pada Gambar 4.7 dijelaskan sebagai berikut:

i. Baris ke-1 mendefinisikan *route* *GET /status/{filename}* untuk melayani permintaan polling periodik dari dasbor.
ii. Baris ke-7 memanggil status dari objek status *in-memory* (*pipeline_status*). Jika berkas tidak terdaftar, API mengembalikan kode respons 404 (*Not Found*).
iii. Baris ke-12 mengembalikan nilai JSON yang memuat nama berkas beserta status pemrosesan (*processing*, *done*, *duplicate*, atau *error*).

Selain kedua endpoint di atas, backend FastAPI yang sama juga menyediakan endpoint-endpoint penyajian data dasbor yang dikonsumsi langsung oleh Next.js untuk merender visualisasi analitik, meliputi *GET /documents*, *GET /wells*, *GET /wells/{well_pad_name}/documents*, *GET /wells/{well_pad_name}/time_breakdown*, dan *GET /detail*. Pemisahan antara endpoint polling status dan endpoint penyajian data ini dirancang agar proses pemantauan progres OCR asinkron tidak mengganggu operasi pengambilan data dasbor yang berjalan secara independen.

---

## 4.3. Implementasi Antarmuka Dashboard (Next.js)

Antarmuka dasbor web dikembangkan menggunakan kerangka kerja Next.js *App Router* dengan integrasi komponen visualisasi interaktif dari pustaka Recharts untuk menyajikan analisis performa pengeboran sumur.

### 4.3.1. Halaman Dashboard Utama (Well Pad Overview)

Halaman dasbor utama menampilkan metrik ringkasan eksekutif (seperti total dokumen dan sumur terarsip) serta daftar baris laporan yang dilengkapi filter pencarian. Tampilan hasil implementasi ditunjukkan pada Gambar 4.8.

![Gambar 4.8 Tampilan Implementasi Halaman Dashboard Utama](images/gambar-4.8-dashboard-utama.png)

**Gambar 4.8 Tampilan Implementasi Halaman Dashboard Utama**

Berdasarkan Gambar 4.8, antarmuka dasbor utama telah diimplementasikan sesuai dengan rancangan wireframe pada Gambar 3.9. Penyesuaian dilakukan pada tata letak kartu metrik di bagian atas yang dibuat lebih responsif agar dapat menyesuaikan dengan ukuran layar monitor tanpa mengurangi kejelasan informasi berkas.

### 4.3.2. Modal Unggah Dokumen

Modal unggah dokumen menyediakan antarmuka interaktif berbasis area *drag-and-drop* serta indikator status pengerjaan latar belakang secara *real-time*. Tampilan hasil implementasi ditunjukkan pada Gambar 4.9.

![Gambar 4.9 Tampilan Implementasi Modal Unggah Dokumen](images/gambar-4.9-modal-upload.png)

**Gambar 4.9 Tampilan Implementasi Modal Unggah Dokumen**

Implementasi modal unggah dokumen pada Gambar 4.9 mempertahankan kebersihan antarmuka dari rancangan Gambar 3.10. Indikator animasi memuat halaman (*loading spinner*) dan pesan status pemrosesan asinkron berhasil disajikan secara dinamis berdasarkan respons status polling dari server backend.

### 4.3.3. Halaman Detail Laporan Sumur

Halaman detail sumur menyajikan kartu metrik durasi operasi, grafik perkembangan kedalaman (*Depth Progress Chart*), dan bagan komparasi efisiensi waktu kerja. Tampilan hasil implementasi ditunjukkan pada Gambar 4.10.

![Gambar 4.10 Tampilan Implementasi Halaman Detail Laporan Sumur](images/gambar-4.10-detail-sumur.png)

**Gambar 4.10 Tampilan Implementasi Halaman Detail Laporan Sumur**

Visualisasi grafik kurva kedalaman (*Depth Progress*) pada Gambar 4.10 menggunakan pustaka Recharts untuk merender grafik garis dari koordinat kedalaman sumur. Komponen grafik ini diperkaya dengan fitur tooltip interaktif yang dapat memaparkan deskripsi detail operasi ketika operator mengarahkan kursor pada titik koordinat tertentu.

### 4.3.4. Tabel Rincian Kronologi Aktivitas (Time Breakdown)

Tabel *Time Breakdown* menampilkan rincian kronologi aktivitas sumur per jam yang dilengkapi filter rentang tanggal operasional. Tampilan hasil implementasi ditunjukkan pada Gambar 4.11.

![Gambar 4.11 Tampilan Implementasi Tabel Time Breakdown](images/gambar-4.11-time-breakdown.png)

**Gambar 4.11 Tampilan Implementasi Tabel Time Breakdown**

Tabel kronologi aktivitas pada Gambar 4.11 diintegrasikan pada bagian bawah halaman detail laporan sumur sesuai rancangan Gambar 3.12. Filter tanggal diimplementasikan menggunakan input tanggal standar HTML5 yang memicu pemuatan ulang data asinkron (*fetching*) ke endpoint */time_breakdown* backend.

---

## 4.4. Hasil Pengujian Akurasi dan Komparasi Model OCR

Pengujian akurasi dilakukan terhadap 13 sampel dokumen DDR operasional PT. Parama Data Unit yang sebelumnya telah melalui tahap anonimisasi atribut sensitif isi dokumen. Penyiapan berkas referensi *Ground Truth* dilakukan menggunakan skrip *bootstrap_gt.py* dengan metode ekstraksi DOM (*Document Object Model*) yang sepenuhnya netral tanpa keterlibatan model AI. Pendekatan ini memanfaatkan fungsi *page.get_text("words")* dari pustaka *PyMuPDF* untuk mengambil koordinat batas dan teks tiap kata secara langsung dari lapisan teks digital (*text layer*) berkas PDF, kemudian mengelompokkan kata-kata yang berdekatan secara geometris ke dalam satuan *region* berbasis kotak pembatas (*bounding box*). Metode ini dipilih sebagai standar *Ground Truth* karena bersifat deterministik dan terbebas dari bias prediksi model apapun, sehingga menghasilkan acuan pengukuran yang objektif.

Proses evaluasi akurasi selanjutnya dilakukan menggunakan pendekatan *Spatial Bounding Box Evaluation* yang diimplementasikan pada modul *evaluator_spatial.py*. Berbeda dengan evaluasi string biasa yang membandingkan keseluruhan teks secara linear dan rentan terhadap bias urutan pembacaan (*reading order bias*), pendekatan spasial ini mencocokkan setiap kotak prediksi OCR terhadap kotak *Ground Truth* menggunakan dua ukuran tumpang tindih, yaitu *Intersection over Union* (IoU) dan *Intersection over Ground Truth Area* (IoG). Sepasang kotak dinyatakan cocok (*matched*) apabila nilai IoU atau IoG-nya mencapai atau melampaui ambang batas 0,5. Metrik CER dan WER kemudian dihitung secara akumulatif (*micro-averaging*) hanya pada pasangan kotak yang berhasil dicocokkan, sementara kotak *Ground Truth* yang tidak memiliki pasangan prediksi dihitung sebagai *missed token* dengan nilai kesalahan penuh. Pendekatan ini secara efektif menghilangkan bias yang muncul akibat perbedaan urutan pembacaan sel-sel tabel oleh kedua *engine* OCR. Konfigurasi model yang digunakan pada tahap pengujian adalah *PaddleOCR(lang="en", show_log=False)* dan *easyocr.Reader(["en"], gpu=True)*, keduanya dijalankan pada citra beresolusi 200 DPI tanpa modifikasi preprocessing tambahan. Hasil pengujian akurasi per dokumen disajikan pada Tabel 4.1 berikut.

**Tabel 4.1 Hasil Pengujian Akurasi CER, WER, dan F1-Score per Dokumen**

| No | Nama Berkas | CER PaddleOCR | WER PaddleOCR | F1 PaddleOCR | CER EasyOCR | WER EasyOCR | F1 EasyOCR |
|---|---|---|---|---|---|---|---|
| 1 | ddr_20220712.pdf | 0,4657 | 0,5162 | 0,6331 | 0,4765 | 0,5892 | 0,6251 |
| 2 | ddr_20220713.pdf | 0,4346 | 0,4868 | 0,6555 | 0,4806 | 0,5869 | 0,6139 |
| 3 | ddr_20220714.pdf | 0,4426 | 0,4895 | 0,6486 | 0,5215 | 0,6059 | 0,5723 |
| 4 | ddr_20220715.pdf | 0,4781 | 0,5315 | 0,5867 | 0,4640 | 0,5728 | 0,6280 |
| 5 | ddr_20220716.pdf | 0,4367 | 0,4842 | 0,6176 | 0,4765 | 0,5903 | 0,6167 |
| 6 | ddr_20220717.pdf | 0,4958 | 0,5532 | 0,6132 | 0,4920 | 0,5988 | 0,5955 |
| 7 | ddr_20220718.pdf | 0,5197 | 0,5736 | 0,6061 | 0,5144 | 0,6061 | 0,5795 |
| 8 | ddr_20220719.pdf | 0,4853 | 0,5348 | 0,6083 | 0,5132 | 0,6130 | 0,5930 |
| 9 | ddr_20220720.pdf | 0,3708 | 0,4405 | 0,7377 | 0,4810 | 0,5864 | 0,6555 |
| 10 | ddr_20220721.pdf | 0,4465 | 0,5089 | 0,7019 | 0,5208 | 0,6217 | 0,6044 |
| 11 | ddr_20220722.pdf | 0,5356 | 0,5801 | 0,6062 | 0,5488 | 0,6463 | 0,6008 |
| 12 | ddr_20220727.pdf | 0,4269 | 0,4756 | 0,7026 | 0,5211 | 0,5979 | 0,6280 |
| 13 | ddr_20220728.pdf | 0,4914 | 0,5314 | 0,6964 | 0,5174 | 0,5915 | 0,6249 |

Rekapitulasi rata-rata dari 13 sampel dokumen tersebut disajikan pada Tabel 4.2 berikut.

**Tabel 4.2 Rekapitulasi Rata-rata Hasil Pengujian Akurasi Model OCR**

| Engine OCR | Mean CER | Mean WER | Mean F1-Score |
|---|---|---|---|
| PaddleOCR | 0,4638 | 0,5159 | 0,6472 |
| EasyOCR | 0,5021 | 0,6005 | 0,6106 |

Perbandingan visual rata-rata ketiga metrik antara kedua *engine* disajikan pada Gambar 4.12.

![Gambar 4.12 Diagram Batang Perbandingan Rata-rata CER, WER, dan F1-Score PaddleOCR vs EasyOCR](images/gambar-4.12-perbandingan-cer-wer-f1.png)

**Gambar 4.12 Diagram Batang Perbandingan Rata-rata CER, WER, dan F1-Score PaddleOCR vs EasyOCR**

Berdasarkan Tabel 4.2 dan Gambar 4.12, PaddleOCR secara agregat mengungguli EasyOCR pada rata-rata keseluruhan 13 sampel yang diuji dengan Mean CER sebesar 0,4638 dan Mean WER sebesar 0,5159, lebih rendah dibandingkan EasyOCR yang mencatatkan Mean CER 0,5021 dan Mean WER 0,6005. Nilai F1-Score PaddleOCR juga lebih tinggi secara rata-rata (0,6472) dibandingkan EasyOCR (0,6106), yang berarti PaddleOCR mampu menyeimbangkan ketepatan (*precision*) dan kelengkapan (*recall*) pencocokan kotak teks dengan lebih baik pada karakteristik dokumen DDR yang padat tabel dan angka teknis. Perlu dicatat bahwa pada beberapa dokumen individual (seperti *ddr_20220715.pdf* dan *ddr_20220717.pdf*), EasyOCR sempat mencatatkan CER yang lebih rendah, namun keunggulan tersebut tidak konsisten dan tidak menggeser posisi PaddleOCR sebagai model dengan performa rata-rata lebih baik secara keseluruhan.

Selisih performa ini sejalan dengan karakteristik arsitektur kedua *engine* yang telah dijelaskan pada Sub-bab 2.2.3 dan 2.2.4. PaddleOCR menerapkan modul deteksi berbasis *Differentiable Binarization* (DB) yang dirancang lebih adaptif terhadap tata letak tabel dengan garis pembatas tidak konsisten, sedangkan CRAFT pada EasyOCR lebih dioptimalkan untuk teks pada citra bebas (*scene text*) sehingga cenderung menghasilkan lebih banyak kesalahan segmentasi pada sel-sel tabel DDR yang rapat. Dokumen *ddr_20220720.pdf* mencatatkan hasil terbaik untuk PaddleOCR (CER 0,3708; F1 0,7377), sedangkan dokumen *ddr_20220722.pdf* menjadi sampel dengan tingkat kesalahan tertinggi bagi kedua *engine* (CER PaddleOCR 0,5356; CER EasyOCR 0,5488), yang mengindikasikan bahwa kualitas hasil pindaian pada dokumen ini kemungkinan lebih rendah dibandingkan sampel lainnya.

### 4.4.1. Analisis Precision, Recall, dan Kesalahan Deteksi (Hallucination)

Untuk memahami lebih dalam sumber selisih F1-Score antara kedua *engine*, dilakukan analisis lanjutan terhadap komponen pembentuknya, yaitu *precision* dan *recall* pada level kotak teks (*bounding box*), serta dua kategori kesalahan deteksi: kotak *Ground Truth* yang tidak berhasil dicocokkan dengan prediksi manapun (*missed*) dan kotak prediksi OCR yang tidak memiliki padanan di *Ground Truth* (*hallucination*). Perlu dicatat bahwa dalam konteks evaluasi spasial ini, satuan *hallucination* dan *missed* merujuk pada jumlah kotak pembatas (*bounding box region*) yang tidak ter-*match*, bukan jumlah token kata individual. Rekapitulasi rata-rata kedua metrik pada 13 sampel dokumen disajikan pada Tabel 4.2a berikut.

**Tabel 4.2a Rekapitulasi Rata-rata Precision dan Recall Deteksi Kotak Teks**

| Engine OCR | Mean Precision | Mean Recall | Mean Region Ground Truth | Mean Region Hasil OCR |
|---|---|---|---|---|
| PaddleOCR | 0,7332 | 0,5823 | 732,5 | 561,8 |
| EasyOCR | 0,5706 | 0,6575 | 732,5 | 840,1 |

Perbandingan visual rata-rata *precision* dan *recall* disajikan pada Gambar 4.13.

![Gambar 4.13 Diagram Batang Perbandingan Rata-rata Precision dan Recall PaddleOCR vs EasyOCR](images/gambar-4.13-precision-recall.png)

**Gambar 4.13 Diagram Batang Perbandingan Rata-rata Precision dan Recall PaddleOCR vs EasyOCR**

Berdasarkan Tabel 4.2a dan Gambar 4.13, terlihat pola yang berlawanan antara kedua *engine*. PaddleOCR mencatatkan *precision* yang jauh lebih tinggi (0,7332) dibandingkan EasyOCR (0,5706), namun dengan *recall* yang justru lebih rendah (0,5823 berbanding 0,6575). Pola ini konsisten dengan rata-rata jumlah region kotak teks yang dihasilkan oleh masing-masing *engine*: dari rata-rata 732,5 region pada *Ground Truth*, PaddleOCR hanya menghasilkan rata-rata 561,8 region (cenderung konservatif dan lebih sedikit memunculkan region yang tidak seharusnya ada), sedangkan EasyOCR menghasilkan rata-rata 840,1 region (lebih agresif dalam mendeteksi kandidat area teks, termasuk area yang sebenarnya bukan teks valid).

Untuk mengonfirmasi pola tersebut, dilakukan penghitungan akumulasi jumlah region *hallucination* dan region *missed* dari seluruh 13 sampel dokumen, disajikan pada Tabel 4.2b dan divisualisasikan pada Gambar 4.14.

**Tabel 4.2b Akumulasi Jumlah Region Hallucination dan Missed (13 Dokumen)**

| Engine OCR | Total Hallucination | Total Missed |
|---|---|---|
| PaddleOCR | 1.943 | 3.997 |
| EasyOCR | 4.697 | 3.265 |

![Gambar 4.14 Diagram Batang Perbandingan Total Hallucination dan Missed Region PaddleOCR vs EasyOCR](images/gambar-4.14-hallucination-missed.png)

**Gambar 4.14 Diagram Batang Perbandingan Total Hallucination dan Missed Region PaddleOCR vs EasyOCR**

Berdasarkan Tabel 4.2b, jumlah region *hallucination* pada EasyOCR (4.697 region) lebih dari dua kali lipat dibandingkan PaddleOCR (1.943 region). Pola ini konsisten terjadi pada seluruh 13 dokumen yang diuji, di mana EasyOCR selalu menghasilkan jumlah *hallucination* yang lebih tinggi dibandingkan PaddleOCR pada setiap sampel. Sebaliknya, jumlah region *missed* pada PaddleOCR (3.997 region) sedikit lebih tinggi dibandingkan EasyOCR (3.265 region). Hal ini membuktikan bahwa PaddleOCR bersifat lebih selektif sehingga terkadang melewatkan area teks yang buram, namun kotak teks yang berhasil dideteksinya memiliki tingkat ketepatan lokasi yang jauh lebih tinggi.

Karakteristik *precision* tinggi pada PaddleOCR dinilai lebih sesuai untuk digitalisasi dokumen DDR. Kesalahan berupa data numerik yang kosong (*missed*) jauh lebih mudah diidentifikasi dan dikoreksi ulang oleh operator dasbor dibandingkan kesalahan berupa angka palsu (*hallucination*) yang dapat merusak validitas analisis teknik pengeboran. Oleh karena itu, PaddleOCR ditetapkan sebagai *engine* utama dalam pipeline ekstraksi sistem digitalisasi DDR, selaras dengan rancangan keputusan arsitektur pada Sub-bab 3.2.3.

---

## 4.5. Hasil Pengujian Performa Waktu Pemrosesan

Selain akurasi pembacaan teks, performa waktu pemrosesan turut dievaluasi untuk membandingkan efisiensi komputasi kedua *engine* OCR pada 13 sampel dokumen yang sama. Waktu pemrosesan diukur mulai dari citra dimuat hingga seluruh teks pada halaman berhasil diekstraksi menggunakan modul *time* bawaan Python, dengan menghitung selisih antara waktu selesai eksekusi (*time.time()* setelah fungsi OCR selesai) dan waktu mulai eksekusi (*time.time()* sebelum fungsi OCR dipanggil), kemudian hasilnya disimpan sebagai atribut *time_sec* di dalam berkas JSON prediksi masing-masing sampel. Hasil pengukuran per dokumen disajikan pada Tabel 4.3 berikut.

**Tabel 4.3 Hasil Pengujian Waktu Pemrosesan OCR per Dokumen**

| No | Nama Berkas | Waktu PaddleOCR (detik) | Waktu EasyOCR (detik) |
|---|---|---|---|
| 1 | ddr_20220712.pdf | 16,41 | 163,95 |
| 2 | ddr_20220713.pdf | 13,69 | 131,72 |
| 3 | ddr_20220714.pdf | 19,58 | 200,66 |
| 4 | ddr_20220715.pdf | 15,51 | 173,49 |
| 5 | ddr_20220716.pdf | 17,29 | 138,15 |
| 6 | ddr_20220717.pdf | 18,59 | 179,26 |
| 7 | ddr_20220718.pdf | 18,29 | 183,84 |
| 8 | ddr_20220719.pdf | 16,65 | 152,69 |
| 9 | ddr_20220720.pdf | 27,16 | 208,94 |
| 10 | ddr_20220721.pdf | 27,65 | 206,95 |
| 11 | ddr_20220722.pdf | 22,70 | 205,41 |
| 12 | ddr_20220727.pdf | 22,91 | 189,82 |
| 13 | ddr_20220728.pdf | 19,54 | 205,27 |

Ringkasan statistik waktu pemrosesan disajikan pada Tabel 4.4 berikut.

**Tabel 4.4 Ringkasan Statistik Waktu Pemrosesan OCR**

| Engine OCR | Rata-rata (detik) | Minimum (detik) | Maksimum (detik) | Standar Deviasi (detik) |
|---|---|---|---|---|
| PaddleOCR | 19,69 | 13,69 | 27,65 | 4,29 |
| EasyOCR | 180,01 | 131,72 | 208,94 | 26,64 |

Perbandingan visual rata-rata waktu pemrosesan kedua *engine* disajikan pada Gambar 4.15.

![Gambar 4.15 Diagram Batang Perbandingan Rata-rata Waktu Pemrosesan PaddleOCR vs EasyOCR](images/gambar-4.15-perbandingan-waktu-proses.png)

**Gambar 4.15 Diagram Batang Perbandingan Rata-rata Waktu Pemrosesan PaddleOCR vs EasyOCR**

Berdasarkan Tabel 4.4 dan Gambar 4.15, PaddleOCR mencatatkan rata-rata waktu pemrosesan sebesar 19,69 detik per dokumen, jauh lebih cepat dibandingkan EasyOCR yang membutuhkan rata-rata 180,01 detik per dokumen (sekitar 9 kali lebih lambat). Standar deviasi waktu proses PaddleOCR (4,29 detik) juga jauh lebih kecil dibandingkan EasyOCR (26,64 detik), yang menunjukkan tingkat stabilitas kecepatan pemrosesan yang tinggi. Performa komputasi yang unggul ini dipengaruhi oleh arsitektur PP-LCNet pada PaddleOCR yang dirancang ringan dan optimal untuk lingkungan eksekusi berbasis CPU, berbeda dengan arsitektur CRAFT+CRNN pada EasyOCR yang memiliki beban komputasi besar pada pencarian wilayah karakter.

Pemantauan konsumsi memori puncak (*peak memory usage*) selama eksekusi tugas latar belakang dipantau menggunakan bantuan modul *psutil*. Hasil pengukuran menunjukkan PaddleOCR mengonsumsi rata-rata memori puncak sebesar 512,4 MB per dokumen, sedangkan EasyOCR mengonsumsi rata-rata 784,8 MB per dokumen. Kedua nilai tersebut masih berada jauh di bawah kapasitas RAM kerja server sistem sebesar 16 GB (Tabel 3.2), sehingga tidak menimbulkan risiko kehabisan memori (*out-of-memory*) pada pemrosesan dokumen.

---

## 4.6. Hasil Pengujian Penerimaan Pengguna (User Acceptance Testing)

Pengujian penerimaan pengguna (*User Acceptance Testing* / UAT) dilakukan untuk memvalidasi bahwa sistem digitalisasi DDR yang dikembangkan telah memenuhi kebutuhan dan ekspektasi fungsional pengguna pada PT. Parama Data Unit, sesuai dengan instrumen kuesioner yang telah disusun pada Tabel 3.4. Pengujian ini melibatkan 3 orang responden staf internal PT. Parama Data Unit yang bertindak sebagai praktisi operasional pengelolaan data pengeboran. Rincian data responden UAT disajikan pada Tabel 4.5.

**Tabel 4.5 Rincian Responden Pengujian UAT**

| No | Nama (Inisial) | Jabatan / Peran | Masa Kerja |
|---|---|---|---|
| 1 | AH | Operator Field | 5 tahun |
| 2 | RD | Staf IT / Digitalisasi | 3 tahun |
| 3 | BP | Pengawas Operasi | 8 tahun |

Setiap responden melakukan uji coba langsung terhadap seluruh alur kerja sistem, mulai dari mengunggah berkas PDF DDR, memantau proses status pada modal antarmuka, hingga memverifikasi visualisasi analitik pada dasbor laporan sumur. Setelah proses uji coba selesai, responden memberikan penilaian terhadap 9 butir pernyataan kuesioner menggunakan skala Likert (1 hingga 5). Hasil penilaian kuesioner UAT disajikan pada Tabel 4.6.

**Tabel 4.6 Hasil Penilaian Kuesioner UAT**

| No | Pernyataan | R1 | R2 | R3 | Total | Persentase (%) |
|---|---|---|---|---|---|---|
| 1 | Alur pengoperasian sistem dari unggah hingga visualisasi dasbor mudah dipahami | 4 | 5 | 4 | 13 | 86,67 |
| 2 | Proses pengunggahan dokumen DDR berjalan lancar tanpa kendala teknis | 5 | 4 | 5 | 14 | 93,33 |
| 3 | Pemrosesan latar belakang OCR memberikan respons waktu yang wajar dan informatif | 4 | 4 | 4 | 12 | 80,00 |
| 4 | Hasil ekstraksi parameter (Well Profile, Drilling Parameters, Bit Records) terurai rapi dan akurat | 4 | 5 | 4 | 13 | 86,67 |
| 5 | Pemilahan Time Breakdown ditampilkan terstruktur dan memudahkan verifikasi data | 5 | 4 | 4 | 13 | 86,67 |
| 6 | Visualisasi kartu PT vs NPT membantu pemantauan efisiensi operasi | 5 | 5 | 5 | 15 | 100,00 |
| 7 | Grafik Depth Progress Chart menyajikan informasi kronologis pengeboran dengan jelas | 5 | 5 | 4 | 14 | 93,33 |
| 8 | Tata letak antarmuka dasbor terlihat rapi, modern, dan nyaman digunakan | 4 | 5 | 5 | 14 | 93,33 |
| 9 | Sistem ini mempercepat proses digitalisasi dan efisiensi pengarsipan data laporan | 5 | 4 | 5 | 14 | 93,33 |
| | **Rata-rata Persentase Total** | | | | | **90,37** |

Perhitungan persentase tingkat penerimaan pengguna akhir didasarkan pada Persamaan (2.7) dan (2.8) yang dijabarkan pada Sub-bab 2.2.17. Berdasarkan rekapitulasi penilaian pada Tabel 4.6, diperoleh akumulasi skor keseluruhan ($\sum_{i=1}^{n} S_i$) sebesar 122 dari total skor maksimum ($\sum_{i=1}^{n} S_{\text{maks}}$) sebesar 135 (3 responden $\times$ 9 pernyataan $\times$ skor maksimal 5). Persentase penerimaan pengguna dihitung sebagai berikut:

$$P = \frac{\sum_{i=1}^{n} S_i}{\sum_{i=1}^{n} S_{\text{maks}}} \times 100\% = \frac{122}{135} \times 100\% = 90,37\%$$

Merujuk pada klasifikasi kelayakan sistem yang disajikan pada Tabel 2.6 di Bab II, rata-rata persentase penerimaan sebesar 90,37% menempatkan aplikasi digitalisasi DDR ini ke dalam kategori **Sangat Layak**.

Analisis data kuesioner menunjukkan bahwa sistem ini dinilai sangat membantu dalam aspek pemantauan efisiensi operasi, di mana butir pernyataan ke-6 mengenai visualisasi kartu *PT vs NPT* mendapatkan persetujuan mutlak (100,00%) dari seluruh responden. Responden juga memberikan penilaian tinggi (93,33%) pada kemudahan proses unggah, penyajian grafik kedalaman, estetika tata letak dasbor, serta efisiensi pengarsipan data. Di sisi lain, nilai terendah (80,00%) tercatat pada butir pernyataan ke-3 mengenai kewajaran waktu pemrosesan latar belakang. Hal ini disebabkan oleh latensi komputasi dari proses OCR asinkron yang memakan waktu rata-rata 19,69 detik per dokumen pada server CPU tunggal, sehingga responden menyarankan adanya optimalisasi performa komputasi atau penyediaan indikator progres persentase pemrosesan yang lebih terperinci pada modal pengunggahan.

---

## 4.7. Tantangan Pengembangan Sistem

Selama proses pengembangan sistem digitalisasi dokumen DDR berbasis web ini, terdapat beberapa tantangan teknis utama yang berhasil diidentifikasi dan diselesaikan:

1. **Penanganan Garis Tabel Faint atau Terputus pada PDF Pindaian (*Scanned PDF*):** Dokumen DDR operasional sering kali dipindai dengan resolusi rendah atau memiliki garis tabel yang tipis dan terputus-putus. Hal ini menyebabkan modul deteksi struktur tabel *img2table* gagal mengidentifikasi kotak pembatas sel secara utuh. Tantangan ini diselesaikan dengan menetapkan resolusi rendering halaman PDF sebesar 200 DPI pada modul penyiapan data, serta memadukan deteksi garis *img2table* dengan *engine* OCR PaddleOCR yang tangguh dalam mendeteksi dan melokalisasi koordinat *bounding box* teks di dalam tabel yang padat angka.
2. **Kesesuaian Koordinat Data Akibat Sel Tergabung (*Merged Cells*):** Format tabel dokumen DDR mengandung banyak sel tergabung (*merged cells*) horizontal maupun vertikal. Ketika diekspor ke format Excel, sel tergabung ini dibaca sebagai sel kosong oleh pustaka *pandas*, menyebabkan pergeseran koordinat pembacaan atribut pada kolom-kolom berikutnya. Tantangan ini diselesaikan dengan mengembangkan modul perataan lembar kerja (*sheet flattening*) kustom menggunakan pustaka *openpyxl*. Modul ini mendeteksi keberadaan *MergedCell*, lalu menyalin nilai data dari sel utama ke seluruh sel turunannya sebelum DataFrame dimuat ke dalam *pandas*.
3. **Penggabungan Deskripsi Operasi yang Bersifat Multiline:** Pada tabel kronologi aktivitas *Time Breakdown*, penjelasan deskripsi aktivitas operasional sering kali ditulis dalam beberapa baris berturut-turut pada kolom yang sama tanpa penanda waktu awal di setiap barisnya. Tantangan ini diselesaikan dengan menyusun algoritma iterasi baris yang didukung pencocokan pola ekspresi reguler *re.match* dengan pola format jam (*^\d{1,2}:\d{2}*). Jika baris berikutnya tidak memuat pola waktu awal namun memiliki teks deskripsi, sistem secara otomatis menggabungkannya sebagai kelanjutan penjelasan dari baris aktivitas sebelumnya sebelum disimpan ke basis data MySQL.
