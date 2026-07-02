# BAB II DASAR TEORI

## 2.1 Daily Drilling Report (DDR)

Daily Drilling Report (DDR) adalah dokumen operasional yang dihasilkan setiap hari selama proses pengeboran sumur minyak dan gas bumi. Dokumen ini mencatat seluruh aktivitas pengeboran secara kronologis dalam satu periode 24 jam, mencakup informasi teknis seperti kedalaman lubang bor (bit depth), jenis formasi batuan yang ditembus, parameter pengeboran (tekanan, kecepatan rotasi, berat pada mata bor/weight on bit), konsumsi material pengeboran, serta kejadian signifikan yang terjadi selama operasi berlangsung [1].

DDR umumnya disusun oleh insinyur pengeboran (drilling engineer) atau mud engineer di lokasi pengeboran dan dikirimkan kepada manajemen serta pemangku kepentingan terkait sebagai laporan harian resmi [2]. Struktur DDR bervariasi antar perusahaan, namun secara umum memuat beberapa bagian utama: ringkasan operasi harian, tabel parameter pengeboran, laporan penggunaan material dan kimia lumpur, serta grafik kedalaman terhadap waktu (depth vs. time chart) [2].

Kombinasi elemen teks naratif, tabel data numerik, dan elemen grafis dalam satu dokumen menjadikan DDR sebagai salah satu jenis dokumen industri yang kompleks dari segi tata letak. Kompleksitas ini menjadi tantangan tersendiri dalam proses digitalisasi dan ekstraksi informasi secara otomatis. Contoh struktur halaman DDR secara umum dapat dilihat pada Gambar 2.1.

> **Gambar 2.1** Contoh Struktur Halaman Daily Drilling Report

---

## 2.2 Optical Character Recognition (OCR)

Optical Character Recognition (OCR) adalah teknologi yang digunakan untuk mengonversi teks yang terdapat pada gambar digital atau dokumen hasil pindaian menjadi teks yang dapat dibaca dan diolah oleh komputer secara otomatis. Teknologi ini mendukung berbagai format citra masukan seperti JPG, PNG, BMP, dan PDF berbasis gambar [5]. Keluaran dari proses OCR berupa data teks yang dapat diedit, dicari, dan disimpan dalam sistem, sehingga mempermudah pengelolaan informasi dari dokumen fisik maupun dokumen digital yang tidak terindeks.

Proses OCR secara umum terdiri dari empat tahap utama, yaitu [5][12]:

1. **Preprocessing**
   Tahap persiapan citra yang mencakup proses penghilangan noise, penyesuaian kontras, konversi ke grayscale, dan koreksi kemiringan (deskewing). Tahap ini sangat mempengaruhi kualitas hasil pengenalan karakter pada tahap berikutnya.

2. **Segmentation**
   Proses pemecahan citra menjadi bagian-bagian lebih kecil secara hierarkis: segmentasi halaman (memisahkan elemen teks dari elemen grafis), segmentasi baris, segmentasi kata, hingga segmentasi karakter individual.

3. **Feature Extraction**
   Proses analisis segmen teks yang telah diidentifikasi untuk mengekstraksi fitur-fitur visual yang unik dari setiap karakter, seperti sudut, lekukan, dan proporsi bentuk karakter.

4. **Classification/Recognition**
   Proses pengenalan dan klasifikasi karakter berdasarkan fitur yang telah diekstraksi, menghasilkan representasi teks akhir yang dapat dibaca oleh manusia maupun mesin.

Model berbasis jaringan saraf tiruan dalam (deep neural network) mampu mempelajari representasi fitur secara otomatis dari data pelatihan berskala besar, sehingga lebih adaptif terhadap variasi kondisi dokumen dibandingkan metode konvensional berbasis aturan [7]. Pemilihan engine OCR yang tepat sangat bergantung pada karakteristik dokumen target, bahasa, dan kondisi kualitas citra [5].

### 2.2.1 EasyOCR

EasyOCR adalah pustaka OCR sumber terbuka (open-source) yang dikembangkan oleh JaidedAI dan mendukung lebih dari 80 bahasa. Pustaka ini menyediakan antarmuka Python yang sederhana sehingga dapat digunakan tanpa konfigurasi yang kompleks [5]. EasyOCR mengimplementasikan pipeline dua tahap yang menggabungkan dua arsitektur deep learning: CRAFT (Character Region Awareness for Text Detection) untuk tahap deteksi wilayah teks, dan CRNN (Convolutional Recurrent Neural Network) untuk tahap pengenalan karakter.

Pada tahap deteksi, CRAFT menghasilkan dua peta probabilitas, yaitu region score untuk kemungkinan suatu piksel berada di pusat karakter dan affinity score untuk kemungkinan dua karakter berdekatan termasuk dalam satu kata, menggunakan arsitektur encoder-decoder berbasis VGG-16 [15]. Hasil deteksi berupa wilayah teks kemudian diteruskan ke tahap pengenalan menggunakan CRNN, yang mengintegrasikan CNN untuk ekstraksi fitur visual, BiLSTM (Bidirectional Long Short-Term Memory) untuk pemodelan konteks sekuensial antar karakter, dan lapisan CTC (Connectionist Temporal Classification) untuk dekoding teks akhir tanpa memerlukan segmentasi karakter secara eksplisit [16].

### 2.2.2 PaddleOCR

PaddleOCR adalah kerangka kerja OCR sumber terbuka yang dikembangkan oleh PaddlePaddle Team (Baidu) dan pertama kali dirilis pada tahun 2020. PaddleOCR menyediakan ekosistem lengkap untuk pengenalan teks dan analisis dokumen, mencakup deteksi teks, pengenalan karakter, klasifikasi orientasi teks, hingga analisis tata letak dokumen kompleks [6]. Kerangka kerja ini mendukung lebih dari 80 bahasa dan telah dioptimalkan untuk pemrosesan dokumen multibahasa dengan tata letak yang beragam [6].

Pipeline PaddleOCR terdiri dari tiga komponen utama yang bekerja secara berurutan:

1. Modul deteksi teks berbasis DB (Differentiable Binarization)
2. Modul klasifikasi orientasi teks
3. Modul pengenalan teks berbasis arsitektur SVTR (Scene Text Recognition with a Single Visual Model) atau CRNN

Ketiga modul ini dapat dijalankan secara independen maupun dalam pipeline terintegrasi sesuai kebutuhan [6].

### 2.2.3 PP-Structure, PP-Table, dan Ekstraksi Matriks Tabel

PP-Structure adalah modul analisis tata letak dokumen (document layout analysis) dalam ekosistem PaddleOCR yang dirancang untuk menangani dokumen dengan elemen campuran seperti teks, tabel, gambar, dan diagram. Modul ini menggunakan model deteksi objek untuk mengidentifikasi dan mengklasifikasikan region-region semantik dalam halaman dokumen (seperti paragraf, judul, tabel, dan gambar) sebelum meneruskan setiap region ke modul pemrosesan yang sesuai [26]. PP-StructureV2 merupakan versi pengembangan yang memperkenalkan peningkatan signifikan pada akurasi deteksi region tata letak dan kecepatan pemrosesan [26].

PP-Table adalah submodul dalam PP-Structure yang menangani pengenalan struktur tabel (table structure recognition) secara khusus. PP-Table tidak hanya mengekstraksi teks dari sel-sel tabel, tetapi juga merekonstruksi struktur logis tabel termasuk informasi rowspan, colspan, dan hierarki baris-kolom dalam format HTML [26]. Pendekatan end-to-end yang menggabungkan deteksi region tabel dengan pengenalan struktur internal tabel terbukti memberikan hasil yang lebih baik dibandingkan pendekatan dua tahap tradisional [4][10].

Selain pendekatan rekonstruksi berbasis HTML, pemrosesan dokumen industri bertabel padat seperti DDR sering kali memanfaatkan arsitektur ekstraksi matriks tabel (table bounding detection) untuk mengonversi halaman dokumen secara langsung ke dalam format lembar kerja (spreadsheet) seperti Excel (.xlsx). Pada pendekatan ini, hasil identifikasi kotak pembatas tabel dipetakan ke dalam koordinat baris dan kolom. Untuk mengatasi tantangan tata letak berantakan dan penggabungan sel (merged cells), dilakukan teknik perataan lembar kerja (sheet flattening) guna mendistribusikan nilai sel secara normal ke dalam satu matriks datar. Matriks yang telah diratakan ini memungkinkan algoritma pemindaian terstruktur (horizontal dan vertical scanning) bekerja secara akurat dan tahan banting terhadap variasi format laporan pengeboran [10].

### 2.2.4 Metrik Evaluasi OCR

Evaluasi kuantitatif performa sistem OCR memerlukan metrik yang dapat mengukur tingkat kesesuaian antara teks hasil pengenalan (hypothesis) dengan teks referensi yang benar (ground truth). Dua metrik yang paling umum digunakan adalah Character Error Rate (CER) dan Word Error Rate (WER). Kedua metrik ini didasarkan pada konsep jarak edit (edit distance) yang mengukur jumlah minimum operasi penyuntingan untuk mengubah satu string menjadi string lainnya [24]. Tiga jenis operasi yang diperhitungkan adalah penyisipan (insertion), penghapusan (deletion), dan penggantian (substitution) [24][25].

#### 2.2.4.1 Character Error Rate (CER)

CER mengukur tingkat kesalahan OCR pada tingkat karakter individual. CER didefinisikan sebagai rasio antara jumlah operasi penyuntingan tingkat karakter terhadap total jumlah karakter dalam teks referensi [25]. Formulasi matematis CER ditunjukkan pada Persamaan (2.1).

$$CER = \frac{S_c + D_c + I_c}{N_c} \tag{2.1}$$

Keterangan:
- $S_c$ = jumlah substitusi karakter
- $D_c$ = jumlah penghapusan karakter
- $I_c$ = jumlah penyisipan karakter
- $N_c$ = total jumlah karakter dalam teks referensi [24][25]

Nilai CER berkisar antara 0 (tidak ada kesalahan) hingga 1 atau lebih. CER lebih sensitif terhadap kesalahan detail pada tingkat karakter, sehingga cocok untuk mengevaluasi akurasi pengenalan pada teks yang memuat singkatan dan istilah teknis.

#### 2.2.4.2 Word Error Rate (WER)

WER mengukur tingkat kesalahan OCR pada tingkat kata dengan prinsip yang serupa dengan CER, namun unit analisis yang digunakan adalah kata, bukan karakter individual [25]. Formulasi matematis WER ditunjukkan pada Persamaan (2.2).

$$WER = \frac{S_w + D_w + I_w}{N_w} \tag{2.2}$$

Keterangan:
- $S_w$ = jumlah substitusi kata
- $D_w$ = jumlah penghapusan kata
- $I_w$ = jumlah penyisipan kata
- $N_w$ = total jumlah kata dalam teks referensi [24][25]

WER memberikan gambaran yang lebih intuitif tentang seberapa banyak kata yang salah dikenali dalam konteks pemahaman konten dokumen. Penggunaan CER dan WER secara komplementer memberikan gambaran evaluasi yang lebih komprehensif dibandingkan penggunaan salah satu metrik secara tunggal [25].

#### 2.2.4.3 F1-Score (Precision dan Recall)

Selain CER dan WER yang mengukur tingkat kesalahan (error rate), evaluasi performa OCR pada tingkat kata (word-level token) juga diukur menggunakan metrik F1-score yang merupakan rerata harmonik dari Precision dan Recall [9][24]. Precision mengukur proporsi kata hasil pengenalan yang benar terhadap total kata yang dihasilkan oleh model OCR, sedangkan Recall mengukur proporsi kata referensi yang berhasil dikenali dengan benar oleh model [24]. Formulasi matematis Precision, Recall, dan F1-score ditunjukkan pada Persamaan (2.3), (2.4), dan (2.5).

$$Precision = \frac{TP}{TP + FP} \tag{2.3}$$

$$Recall = \frac{TP}{TP + FN} \tag{2.4}$$

$$F1 = 2 \times \frac{Precision \times Recall}{Precision + Recall} \tag{2.5}$$

Keterangan:
- $TP$ (True Positive) = jumlah token kata yang cocok secara tepat antara hasil pengenalan OCR dan teks referensi
- $FP$ (False Positive) = jumlah token kata yang terdeteksi oleh OCR namun tidak terdapat pada teks referensi (kata salah/sisipan)
- $FN$ (False Negative) = jumlah token kata pada teks referensi yang gagal terdeteksi oleh model OCR [24][25]

Metrik F1-score memberikan keseimbangan evaluasi antara ketepatan model (Precision) dan kelengkapan pembacaan (Recall), dengan nilai berkisar dari 0 hingga 1. F1-score mendekati 1 menunjukkan performa OCR yang sangat tinggi dalam mengenali token kata secara akurat dan lengkap [9].

---

## 2.3 FastAPI

FastAPI adalah web framework Python modern yang dirancang untuk membangun Application Programming Interface (API) dengan performa tinggi [18]. Framework ini dibangun di atas dua library utama: Starlette untuk lapisan web framework asinkron dan Pydantic untuk validasi data berbasis type hint Python. Dukungan penuh terhadap pemrograman asinkron (async/await) memungkinkan server menangani banyak permintaan secara bersamaan tanpa blocking pada operasi I/O, yang menjadikannya pilihan yang tepat untuk layanan backend yang memproses dokumen secara bersamaan [18].

FastAPI secara otomatis menghasilkan dokumentasi API interaktif yang mengikuti standar OpenAPI, dapat diakses melalui endpoint `/docs` (Swagger UI) dan `/redoc` (ReDoc UI) tanpa konfigurasi tambahan. Framework ini juga memanfaatkan type hint Python secara menyeluruh untuk validasi data masukan dan serialisasi respons, sehingga mengurangi kemungkinan kesalahan tipe data pada saat runtime [18]. Dalam konteks sistem ini, FastAPI digunakan sebagai backend utama yang menerima unggahan dokumen DDR, menjalankan proses OCR, dan mengembalikan hasil ekstraksi ke antarmuka pengguna.

---

## 2.4 Next.js

Next.js adalah framework React sumber terbuka untuk pengembangan aplikasi web yang dikembangkan oleh Vercel [19]. Next.js memperluas kapabilitas React dengan menyediakan fitur-fitur tingkat produksi yang tidak tersedia secara built-in di React murni, antara lain Server-Side Rendering (SSR), Static Site Generation (SSG), Incremental Static Regeneration (ISR), routing berbasis sistem berkas (file-system based routing), dan optimasi aset otomatis [19].

Pada versi Next.js 13 ke atas, diperkenalkan paradigma App Router yang berbasis React Server Components (RSC). RSC memungkinkan komponen React dirender sepenuhnya di sisi server, mengurangi jumlah JavaScript yang dikirimkan ke klien dan mempercepat waktu pemuatan halaman awal (First Contentful Paint). Arsitektur hybrid rendering ini memungkinkan pengembang memilih strategi rendering yang paling sesuai per halaman, sehingga mengoptimalkan keseimbangan antara performa, SEO, dan pengalaman pengguna [19]. Dalam sistem ini, Next.js digunakan sebagai lapisan frontend yang menyediakan antarmuka untuk pengunggahan dokumen DDR, visualisasi hasil ekstraksi, serta pengelolaan data yang telah diproses.

---

## 2.5 Sistem Manajemen Basis Data Relasional (MySQL / MariaDB)

MySQL adalah sistem manajemen basis data relasional (Relational Database Management System / RDBMS) sumber terbuka yang menggunakan Structured Query Language (SQL) sebagai bahasa untuk mendefinisikan, memanipulasi, dan mengakses data [20]. Sistem ini dikenal karena keandalannya, performa tinggi pada operasi baca, dan ekosistem tooling yang matang sehingga banyak digunakan pada aplikasi web berskala besar maupun kecil [20].

MariaDB merupakan cabang (fork) komunitas dari MySQL yang dikembangkan sebagai alternatif drop-in replacement dengan kompatibilitas penuh terhadap sintaks SQL dan skema MySQL [20]. Dalam pengembangan sistem ini, sistem manajemen basis data relasional (MySQL/MariaDB) digunakan untuk menyimpan seluruh metadata dokumen DDR, field hasil ekstraksi key-value, catatan mata bor (bit records), serta rincian aktivitas per jam (time breakdown) secara terstruktur.

---

## 2.6 Use Case Diagram

Use Case Diagram adalah salah satu jenis diagram dalam Unified Modeling Language (UML) yang digunakan untuk memvisualisasikan fungsionalitas sistem dari perspektif pengguna. Diagram ini menggambarkan interaksi antara aktor (actor), yang merepresentasikan entitas eksternal seperti pengguna manusia atau sistem lain, dengan use case yang merepresentasikan fungsionalitas yang disediakan oleh sistem [21]. Use case didefinisikan sebagai skenario yang mendeskripsikan satu interaksi lengkap antara pengguna dengan sistem untuk mencapai tujuan tertentu [21].

Use Case Diagram memiliki simbol-simbol tertentu yang menjadi standar notasi UML. Simbol-simbol tersebut beserta keterangannya disajikan pada Tabel 2.2 berikut.

**Tabel 2.2 Simbol Use Case Diagram**

| Simbol | Nama | Keterangan |
|---|---|---|
| **Simbol Orang (*Stick Figure*)** | Aktor | Merepresentasikan pengguna atau sistem eksternal yang berinteraksi dengan sistem |
| **Elips / Oval Horizontal** | *Use Case* | Merepresentasikan satu fungsionalitas atau layanan yang disediakan oleh sistem |
| **Garis Lurus Tanpa Panah** | *Association* | Menghubungkan aktor dengan *use case* yang berinteraksi dengannya |
| **Garis Putus-putus berpanah (`<<include>>`)** | *Include* | Menunjukkan bahwa suatu *use case* selalu memanggil *use case* lain sebagai bagian dari eksekusinya |
| **Garis Putus-putus berpanah (`<<extend>>`)** | *Extend* | Menunjukkan bahwa suatu *use case* menambahkan perilaku opsional pada *use case* lain jika kondisi tertentu terpenuhi |

---

## 2.7 Activity Diagram

Activity Diagram adalah jenis diagram UML yang menggambarkan alur kerja (workflow) atau logika proses secara grafis. Diagram ini merepresentasikan urutan aktivitas, percabangan alur (decision points), pemrosesan paralel (fork/join), dan kondisi akhir dari suatu proses [21]. Activity Diagram memiliki kemiripan konseptual dengan flowchart, namun lebih ekspresif dalam merepresentasikan perilaku paralel dan mekanisme sinkronisasi antar alur aktivitas.

Notasi utama dalam Activity Diagram meliputi:

- **Simpul awal** (initial node) berupa lingkaran padat
- **Simpul akhir** (activity final node) berupa lingkaran padat bersarang
- **Simpul aksi** (action node) berupa persegi panjang berujung tumpul
- **Simpul keputusan** (decision node) berupa belah ketupat
- **Fork/join node** berupa garis tebal untuk merepresentasikan aktivitas paralel
- **Control flow** berupa garis panah yang menghubungkan antar simpul [21]

---

## 2.8 Entity Relationship Diagram (ERD)

Entity Relationship Diagram (ERD) adalah model konseptual yang digunakan untuk mendeskripsikan struktur data dari suatu sistem informasi secara grafis, pertama kali diperkenalkan oleh Peter Chen pada tahun 1976 [22]. ERD menggambarkan tiga komponen utama:

- **Entitas** (entity) — merepresentasikan objek atau konsep dunia nyata yang memiliki eksistensi independen
- **Atribut** (attribute) — merepresentasikan properti dari setiap entitas
- **Relasi** (relationship) — menggambarkan hubungan logis antar entitas beserta kardinalitasnya [22]

Kardinalitas relasi antar entitas terbagi menjadi tiga jenis, yaitu:

1. **One-to-one** — satu entitas hanya berelasi dengan satu entitas lain
2. **One-to-many** — satu entitas berelasi dengan banyak entitas lain
3. **Many-to-many** — banyak entitas berelasi dengan banyak entitas lain [22]

Pada implementasi ke model relasional, entitas direpresentasikan sebagai tabel, atribut sebagai kolom, dan relasi many-to-many diimplementasikan melalui tabel penghubung (junction table) dengan foreign key. Simbol-simbol standar ERD beserta keterangannya disajikan pada Tabel 2.3 berikut.

**Tabel 2.3 Simbol Entity Relationship Diagram**

| Simbol | Nama | Keterangan |
|---|---|---|
| **Persegi Panjang** | Entitas (*Entity*) | Merepresentasikan objek atau konsep dunia nyata yang memiliki eksistensi independen dan data yang disimpan |
| **Elips / Oval** | Atribut (*Attribute*) | Merepresentasikan karakteristik, properti, atau rincian data dari suatu entitas (misal: *Primary Key*, atribut biasa) |
| **Belah Ketupat** | Relasi (*Relationship*) | Menggambarkan hubungan logis atau asosiasi yang terjadi antar entitas beserta aturan kardinalitasnya |
| **Garis Lurus** | Penghubung (*Link*) | Menghubungkan atribut dengan entitasnya, serta menghubungkan entitas dengan relasinya |

---

## 2.9 User Acceptance Testing (UAT)

User Acceptance Testing (UAT) adalah tahap pengujian perangkat lunak yang dilakukan oleh pengguna akhir (end-user) atau perwakilan pengguna untuk memverifikasi bahwa sistem yang dikembangkan telah memenuhi kebutuhan bisnis dan persyaratan fungsional yang telah disepakati [23]. Berbeda dengan pengujian unit (unit testing) atau pengujian integrasi (integration testing) yang dilakukan oleh tim pengembang untuk memverifikasi kebenaran teknis kode, UAT berfokus pada validasi sistem dalam skenario penggunaan nyata dari perspektif pengguna [23].

UAT dapat diklasifikasikan ke dalam beberapa jenis, antara lain:

- **Business Acceptance Testing (BAT)** — untuk memverifikasi kesesuaian dengan proses bisnis
- **Contractual Acceptance Testing (CAT)** — untuk memverifikasi pemenuhan syarat kontrak
- **Alpha/Beta Testing** — untuk pengujian dengan pengguna nyata sebelum rilis publik [23]

Tingkat penerimaan pengguna terhadap sistem dapat diukur secara kuantitatif menggunakan instrumen kuesioner terstruktur. Perhitungan nilai rata-rata penerimaan dilakukan menggunakan Persamaan (2.6), sedangkan nilai persentase penerimaan dihitung menggunakan Persamaan (2.7).

$$\text{Rata-rata} = \frac{\text{Bobot Penilaian}}{\text{Total Responden}} \tag{2.6}$$

$$\text{Persentase} = \frac{\text{Rata-rata}}{\text{Bobot Maksimum}} \times 100\% \tag{2.7}$$

Hasil persentase penerimaan kemudian diinterpretasikan menggunakan skala kategori kelayakan. Skala yang digunakan dalam penelitian ini mengacu pada rentang persentase dengan kategori:

| Rentang | Kategori |
|---|---|
| 0–20% | Sangat tidak layak |
| 21–40% | Tidak layak |
| 41–60% | Cukup layak |
| 61–80% | Layak |
| 81–100% | Sangat layak |

Sistem dinyatakan diterima apabila hasil persentase berada pada kategori layak atau sangat layak [23].
