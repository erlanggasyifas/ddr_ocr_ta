# BAB II DASAR TEORI

## 2.2 Dasar Teori

### 2.2.1 Daily Drilling Report (DDR)

Daily Drilling Report (DDR) adalah dokumen operasional yang dihasilkan setiap hari selama proses pengeboran sumur minyak dan gas bumi. Dokumen ini mencatat seluruh aktivitas pengeboran secara kronologis dalam satu periode 24 jam, mencakup informasi teknis seperti kedalaman lubang bor (bit depth), jenis formasi batuan yang ditembus, parameter pengeboran (tekanan, kecepatan rotasi, berat pada mata bor/weight on bit), konsumsi material pengeboran, serta kejadian signifikan yang terjadi selama operasi berlangsung [1].

DDR umumnya disusun oleh insinyur pengeboran (drilling engineer) atau mud engineer di lokasi pengeboran dan dikirimkan kepada manajemen serta pemangku kepentingan terkait sebagai laporan harian resmi [2]. Struktur DDR bervariasi antar perusahaan, namun secara umum memuat beberapa bagian utama: ringkasan operasi harian, tabel parameter pengeboran, laporan penggunaan material dan kimia lumpur, serta grafik kedalaman terhadap waktu (depth vs. time chart) [2].

Kombinasi elemen teks naratif, tabel data numerik, dan elemen grafis dalam satu dokumen menjadikan DDR sebagai salah satu jenis dokumen industri yang kompleks dari segi tata letak. Kompleksitas ini menjadi tantangan tersendiri dalam proses digitalisasi dan ekstraksi informasi secara otomatis. Contoh struktur halaman DDR secara umum dapat dilihat pada Gambar 2.1.

> **Gambar 2.1** Contoh Struktur Halaman Daily Drilling Report

---

### 2.2.2 Optical Character Recognition (OCR)

Optical Character Recognition (OCR) adalah teknologi yang digunakan untuk mengonversi teks yang terdapat pada gambar digital atau dokumen hasil pindaian menjadi teks yang dapat dibaca dan diolah oleh komputer secara otomatis. Teknologi ini mendukung berbagai format citra masukan seperti JPG, PNG, BMP, dan PDF berbasis gambar [5]. Keluaran dari proses OCR berupa data teks yang dapat diedit, dicari, dan disimpan dalam sistem, sehingga mempermudah pengelolaan informasi dari dokumen fisik maupun dokumen digital yang tidak terindeks.

Proses OCR secara umum terdiri dari empat tahap utama [5][12]. Tahap pertama adalah *preprocessing*, yaitu tahap persiapan citra yang mencakup penghilangan derau (*noise*), penyesuaian kontras, konversi ke *grayscale*, dan koreksi kemiringan (*deskewing*) guna meningkatkan kualitas citra sebelum pengenalan. Tahap kedua adalah *segmentation*, yaitu proses pemecahan citra menjadi bagian-bagian lebih kecil secara hierarkis mulai dari segmentasi halaman, baris, kata, hingga karakter individual. Tahap ketiga adalah *feature extraction*, yaitu proses analisis segmen teks untuk mengekstraksi fitur-fitur visual yang unik dari setiap karakter, seperti sudut, lekukan, dan proporsi bentuk. Tahap keempat adalah *classification* atau *recognition*, yaitu proses pengenalan dan klasifikasi karakter berdasarkan fitur yang telah diekstraksi untuk menghasilkan representasi teks akhir yang dapat dibaca oleh komputer maupun manusia.

Model berbasis jaringan saraf tiruan dalam (deep neural network) mampu mempelajari representasi fitur secara otomatis dari data pelatihan berskala besar, sehingga lebih adaptif terhadap variasi kondisi dokumen dibandingkan metode konvensional berbasis aturan [7]. Pemilihan engine OCR yang tepat sangat bergantung pada karakteristik dokumen target, bahasa, dan kondisi kualitas citra [5].

### 2.2.3 EasyOCR

EasyOCR adalah pustaka OCR sumber terbuka (open-source) yang dikembangkan oleh JaidedAI dan mendukung lebih dari 80 bahasa. Pustaka ini menyediakan antarmuka Python yang sederhana sehingga dapat digunakan tanpa konfigurasi yang kompleks [5]. EasyOCR mengimplementasikan pipeline dua tahap yang menggabungkan dua arsitektur deep learning: CRAFT (Character Region Awareness for Text Detection) untuk tahap deteksi wilayah teks, dan CRNN (Convolutional Recurrent Neural Network) untuk tahap pengenalan karakter.

Pada tahap deteksi, CRAFT menghasilkan dua peta probabilitas, yaitu region score untuk kemungkinan suatu piksel berada di pusat karakter dan affinity score untuk kemungkinan dua karakter berdekatan termasuk dalam satu kata, menggunakan arsitektur encoder-decoder berbasis VGG-16 [15]. Hasil deteksi berupa wilayah teks kemudian diteruskan ke tahap pengenalan menggunakan CRNN, yang mengintegrasikan CNN untuk ekstraksi fitur visual, BiLSTM (Bidirectional Long Short-Term Memory) untuk pemodelan konteks sekuensial antar karakter, dan lapisan CTC (Connectionist Temporal Classification) untuk dekoding teks akhir tanpa memerlukan segmentasi karakter secara eksplisit [16].

### 2.2.4 PaddleOCR

PaddleOCR adalah kerangka kerja OCR sumber terbuka yang dikembangkan oleh PaddlePaddle Team (Baidu) dan pertama kali dirilis pada tahun 2020. PaddleOCR menyediakan ekosistem lengkap untuk pengenalan teks dan analisis dokumen, mencakup deteksi teks, pengenalan karakter, klasifikasi orientasi teks, hingga analisis tata letak dokumen kompleks [6]. Kerangka kerja ini mendukung lebih dari 80 bahasa dan telah dioptimalkan untuk pemrosesan dokumen multibahasa dengan tata letak yang beragam [6].

Pipeline PaddleOCR terdiri dari tiga komponen utama yang bekerja secara berurutan. Komponen pertama adalah modul deteksi teks berbasis DB (*Differentiable Binarization*) yang bertugas mengidentifikasi dan membatasi wilayah teks pada dokumen. Komponen kedua adalah modul klasifikasi orientasi teks yang mendeteksi dan mengoreksi sudut kemiringan citra masukan. Komponen ketiga adalah modul pengenalan teks berbasis arsitektur SVTR (*Scene Text Recognition with a Single Visual Model*) atau CRNN yang bertugas menerjemahkan fitur visual citra karakter menjadi representasi teks digital sekuensial. Ketiga modul tersebut dapat dijalankan secara independen maupun terintegrasi dalam satu alur pemrosesan sesuai kebutuhan [6].

### 2.2.5 Ekstraksi Struktur Tabel (*img2table*)

`img2table` adalah pustaka Python sumber terbuka yang dirancang secara khusus untuk mendeteksi dan mengekstraksi struktur tabel dari dokumen berbasis citra, termasuk berkas PDF dan citra digital [27]. Berbeda dengan pendekatan pemrosesan teks linier, `img2table` bekerja melalui deteksi morfologi visual garis pembatas tabel (*table border line detection*) pada citra halaman untuk mengidentifikasi koordinat kotak pembatas (*bounding box*) setiap sel secara otomatis, tanpa memerlukan anotasi data latih tambahan yang spesifik untuk format dokumen tertentu.

Dalam penggunaannya, `img2table` mendukung integrasi dengan berbagai *engine* OCR untuk melakukan pengenalan teks di dalam sel-sel yang terdeteksi, termasuk PaddleOCR dan EasyOCR. Keluaran deteksi struktur tabel beserta isi teks setiap selnya dikeluarkan dalam format berkas buku kerja Excel (`.xlsx`) melalui metode `to_xlsx()`. Parameter konfigurasi utama pada pustaka ini antara lain meliputi: (1) `implicit_rows` untuk mengontrol deteksi baris implisit yang hanya dipisahkan oleh jarak spasi antar konten, (2) `borderless_tables` untuk menentukan kewajiban keberadaan garis pembatas tabel secara visual, dan (3) `min_confidence` sebagai ambang batas minimum kepercayaan pembacaan OCR per sel [27].

Keluaran berkas Excel dari `img2table` yang masih mengandung *merged cells* kemudian diproses lebih lanjut menggunakan pustaka `openpyxl` untuk menjalankan algoritma perataan lembar kerja (*sheet flattening*). Proses ini membongkar seluruh penggabungan sel dan mendistribusikan nilainya ke setiap koordinat sel tunggal yang sebelumnya tergabung, menghasilkan matriks data homogen yang siap dipindai secara terstruktur menggunakan `pandas` *DataFrame* [4][10].

### 2.2.6 Metrik Evaluasi OCR

Evaluasi kuantitatif performa sistem OCR memerlukan metrik yang dapat mengukur tingkat kesesuaian antara teks hasil pengenalan (hypothesis) dengan teks referensi yang benar (ground truth). Dua metrik yang paling umum digunakan adalah Character Error Rate (CER) dan Word Error Rate (WER). Kedua metrik ini didasarkan pada konsep jarak edit (edit distance) yang mengukur jumlah minimum operasi penyuntingan untuk mengubah satu string menjadi string lainnya [24]. Tiga jenis operasi yang diperhitungkan adalah penyisipan (insertion), penghapusan (deletion), dan penggantian (substitution) [24][25].

**a. Character Error Rate (CER)**

CER mengukur tingkat kesalahan OCR pada tingkat karakter individual. CER didefinisikan sebagai rasio antara jumlah operasi penyuntingan tingkat karakter terhadap total jumlah karakter dalam teks referensi [25]. Formulasi matematis CER ditunjukkan pada Persamaan (2.1).

$$CER = \frac{S_c + D_c + I_c}{N_c} \tag{2.1}$$

Pada formulasi tersebut, $S_c$ merepresentasikan jumlah substitusi karakter, $D_c$ menyatakan jumlah penghapusan karakter, $I_c$ adalah jumlah penyisipan karakter, dan $N_c$ merupakan total jumlah karakter dalam teks referensi [24][25].

Nilai CER berkisar antara 0 (tidak ada kesalahan) hingga 1 atau lebih. CER lebih sensitif terhadap kesalahan detail pada tingkat karakter, sehingga cocok untuk mengevaluasi akurasi pengenalan pada teks yang memuat singkatan dan istilah teknis.

**b. Word Error Rate (WER)**

WER mengukur tingkat kesalahan OCR pada tingkat kata dengan prinsip yang serupa dengan CER, namun unit analisis yang digunakan adalah kata, bukan karakter individual [25]. Formulasi matematis WER ditunjukkan pada Persamaan (2.2).

$$WER = \frac{S_w + D_w + I_w}{N_w} \tag{2.2}$$

Pada formulasi tersebut, $S_w$ merepresentasikan jumlah substitusi kata, $D_w$ menyatakan jumlah penghapusan kata, $I_w$ adalah jumlah penyisipan kata, dan $N_w$ merupakan total jumlah kata dalam teks referensi [24][25].

WER memberikan gambaran yang lebih intuitif tentang seberapa banyak kata yang salah dikenali dalam konteks pemahaman konten dokumen. Penggunaan CER dan WER secara komplementer memberikan gambaran evaluasi yang lebih komprehensif dibandingkan penggunaan salah satu metrik secara tunggal [25].

**c. F1-Score (Precision dan Recall)**

Selain CER dan WER yang mengukur tingkat kesalahan (error rate), evaluasi performa OCR pada tingkat kata (word-level token) juga diukur menggunakan metrik F1-score yang merupakan rerata harmonik dari Precision dan Recall [9][24]. Precision mengukur proporsi kata hasil pengenalan yang benar terhadap total kata yang dihasilkan oleh model OCR, sedangkan Recall mengukur proporsi kata referensi yang berhasil dikenali dengan benar oleh model [24]. Formulasi matematis Precision, Recall, dan F1-score ditunjukkan pada Persamaan (2.3), (2.4), dan (2.5).

$$Precision = \frac{TP}{TP + FP} \tag{2.3}$$

$$Recall = \frac{TP}{TP + FN} \tag{2.4}$$

$$F1 = 2 \times \frac{Precision \times Recall}{Precision + Recall} \tag{2.5}$$

Pada formulasi tersebut, $TP$ (*True Positive*) menyatakan jumlah token kata yang cocok secara tepat antara hasil pengenalan OCR dan teks referensi, $FP$ (*False Positive*) merepresentasikan jumlah token kata yang terdeteksi oleh OCR namun tidak terdapat pada teks referensi, dan $FN$ (*False Negative*) adalah jumlah token kata pada teks referensi yang gagal terdeteksi oleh model OCR [24][25].

Metrik F1-score memberikan keseimbangan evaluasi antara ketepatan model (Precision) dan kelengkapan pembacaan (Recall), dengan nilai berkisar dari 0 hingga 1. F1-score mendekati 1 menunjukkan performa OCR yang sangat tinggi dalam mengenali token kata secara akurat dan lengkap [9].

---

### 2.2.7 Intersection over Union (IoU)

*Intersection over Union* (IoU) atau yang dikenal juga sebagai *Jaccard Index* adalah metrik evaluasi spasial yang digunakan untuk mengukur tingkat kesesuaian atau tumpang tindih (*overlap*) antara dua wilayah kotak pembatas (*bounding box*) [28][29]. Metrik ini secara luas digunakan dalam pengolahan citra digital, deteksi objek, dan pemetaan wilayah teks pada analisis dokumen digital [28][29].

IoU dihitung dengan membagi luas area irisan (*intersection*) antara kotak hasil prediksi dan kotak referensi (*ground truth*) dengan luas area gabungan (*union*) dari kedua kotak tersebut [28][29]. Formulasi matematis IoU ditunjukkan pada Persamaan (2.6).

$$IoU = \frac{\text{Area of Overlap}}{\text{Area of Union}} = \frac{|B_{gt} \cap B_{pred}|}{|B_{gt} \cup B_{pred}|} \tag{2.6}$$

Pada formulasi tersebut, $B_{gt}$ merepresentasikan koordinat kotak pembatas pada data referensi (*ground truth*), sedangkan $B_{pred}$ merepresentasikan koordinat kotak pembatas dari hasil deteksi model. Nilai IoU berkisar antara 0 (tidak ada tumpang tindih sama sekali) hingga 1 (kedua kotak bertumpuk secara sempurna). Dalam evaluasi deteksi objek atau pemetaan teks, suatu wilayah prediksi dinyatakan cocok (*matched* / *True Positive*) apabila nilai IoU memenuhi atau melebihi batas ambang (*threshold*) tertentu, umumnya disetel pada nilai $\ge 0,5$ (50% tumpang tindih) [28][30].

---

### 2.2.8 Analisis Data Tabular (*Pandas*)

*Pandas* adalah pustaka (*library*) sumber terbuka (*open-source*) berkinerja tinggi untuk bahasa pemrograman Python yang dirancang secara khusus untuk melakukan manipulasi, analisis, dan pembersihan data terstruktur [17]. Struktur data utama di dalam *Pandas* adalah *DataFrame*, yaitu representasi data dua dimensi berbentuk matriks berlabel dengan sumbu baris (indeks) dan sumbu kolom. *DataFrame* memiliki kemampuan untuk mengelola berbagai tipe data heterogen dalam kolom yang berbeda secara efisien [17].

Di dalam pemrosesan data berbentuk matriks dua dimensi, pencarian data secara terstruktur menggunakan *DataFrame* secara umum dilakukan melalui dua pendekatan pemindaian, yaitu pemindaian horizontal (*horizontal scanning*) dan pemindaian vertikal (*vertical scanning*) [17]. Pemindaian horizontal dilakukan dengan menelusuri indeks baris secara mendatar untuk menemukan kata kunci atau label pada suatu sel, kemudian mengambil atau mengekstraksi nilai (*value*) yang berada pada kolom di sebelah kanannya. Sementara itu, pemindaian vertikal dilakukan dengan menelusuri baris ke arah bawah di dalam suatu kolom tertentu berdasarkan penanda judul (*header*) untuk mengisolasi atau mengambil blok baris data di bawah judul tersebut secara sekuensial [17].

---

### 2.2.9 Pengenalan Pola Teks (*Regular Expression* / RegEx)

*Regular Expression* atau yang umum disingkat sebagai **RegEx**, adalah metode yang digunakan oleh komputer untuk mengenali, mencari, dan memanipulasi pola karakter tertentu di dalam sekumpulan teks (*string*) secara otomatis [17]. RegEx bekerja dengan mendefinisikan aturan pencarian menggunakan kombinasi karakter literal dan simbol metakarakter khusus. Ketika suatu string dievaluasi, mesin RegEx akan mendeteksi bagian teks mana saja yang memenuhi aturan pola tersebut secara presisi [17].

Aturan pola dalam RegEx dibentuk menggunakan kombinasi simbol-simbol khusus, seperti simbol `\d` yang mewakili karakter angka dari 0 hingga 9, simbol `\s` yang mewakili spasi atau jarak antar-karakter (*whitespace*), kuantor seperti `+` (satu atau lebih) atau `?` (nol atau satu) untuk menentukan jumlah perulangan karakter yang diperbolehkan, serta karakter penanda batas seperti `^` (awal string) atau `$` (akhir string) untuk memastikan pencocokan pola pada posisi yang tepat [17].

Dalam pemrosesan data teks, RegEx dimanfaatkan secara luas untuk mendukung tiga fungsi utama, yaitu pembersihan dan normalisasi teks (*data cleaning*), pencarian dan ekstraksi pola (*pattern extraction*), serta validasi format karakter (*format validation*) [17]. Pembersihan dan normalisasi teks berfungsi untuk menghapus karakter non-alfanumerik atau simbol-simbol derau (*noise*) yang tidak diinginkan dari data mentah agar pencocokan teks dapat berjalan konsisten tanpa kendala spasi atau tanda baca. Pencarian dan ekstraksi pola digunakan untuk mengidentifikasi dan memisahkan substring tertentu yang memiliki struktur penulisan spesifik di dalam teks dokumen, seperti pola tanggal, nomor telepon, alamat email, atau kode unik. Sementara itu, validasi format karakter bertujuan untuk menguji kelayakan data masukan dengan mencocokkannya terhadap pola format standar (seperti format penulisan waktu atau email) guna memastikan keabsahan data sebelum diproses pada tahap berikutnya [17].

---

### 2.2.10 PyMuPDF (FitZ)

PyMuPDF (atau yang dikenal dengan modul FitZ) adalah pustaka Python open-source berkinerja tinggi yang digunakan untuk membaca, menganalisis, merender, dan memanipulasi dokumen digital seperti PDF, XPS, dan EPUB [31][32]. Pustaka ini dibangun sebagai antarmuka Python untuk mesin pemrosesan grafis MuPDF yang ringan dan efisien [31][32].

Dalam pemrosesan dokumen digital, PyMuPDF mampu mengekstraksi elemen-elemen dari *Document Object Model* (DOM) secara langsung, termasuk metadata, gambar, teks, serta koordinat spasial absolut (*bounding box*) dari setiap huruf, kata, dan baris tanpa memerlukan proses pengenalan optik (OCR) [31][32]. Keunggulan utama pustaka ini terletak pada kecepatannya dalam merender halaman dokumen menjadi matriks citra pada berbagai resolusi DPI (*Dots Per Inch*) serta kemampuannya mengekstraksi teks dengan akurasi koordinat yang tinggi sesuai struktur asli dokumen digital [31][32].

---

### 2.2.11 FastAPI

FastAPI adalah web framework Python modern yang dirancang untuk membangun Application Programming Interface (API) dengan performa tinggi [18]. Framework ini dibangun di atas dua library utama: Starlette untuk lapisan web framework asinkron dan Pydantic untuk validasi data berbasis type hint Python. Dukungan penuh terhadap pemrograman asinkron (async/await) memungkinkan server menangani banyak permintaan secara bersamaan tanpa blocking pada operasi I/O, yang menjadikannya pilihan yang tepat untuk layanan backend yang memproses dokumen secara bersamaan [18].

FastAPI secara otomatis menghasilkan dokumentasi API interaktif yang mengikuti standar OpenAPI, dapat diakses melalui endpoint `/docs` (Swagger UI) dan `/redoc` (ReDoc UI) tanpa konfigurasi tambahan. Framework ini juga memanfaatkan type hint Python secara menyeluruh untuk validasi data masukan dan serialisasi respons, sehingga mengurangi kemungkinan kesalahan tipe data pada saat runtime [18]. Dalam arsitektur web modern, FastAPI sering digunakan sebagai penyedia layanan backend untuk memproses data dari antarmuka pengguna, mengalirkan data, dan mengembalikan respons secara cepat.

---

### 2.2.12 Next.js

Next.js adalah framework React sumber terbuka untuk pengembangan aplikasi web yang dikembangkan oleh Vercel [19]. Next.js memperluas kapabilitas React dengan menyediakan fitur-fitur tingkat produksi yang tidak tersedia secara built-in di React murni, antara lain Server-Side Rendering (SSR), Static Site Generation (SSG), Incremental Static Regeneration (ISR), routing berbasis sistem berkas (file-system based routing), dan optimasi aset otomatis [19].

Pada versi Next.js 13 ke atas, diperkenalkan paradigma App Router yang berbasis React Server Components (RSC). RSC memungkinkan komponen React dirender sepenuhnya di sisi server, mengurangi jumlah JavaScript yang dikirimkan ke klien dan mempercepat waktu pemuatan halaman awal (First Contentful Paint). Arsitektur hybrid rendering ini memungkinkan pengembang memilih strategi rendering yang paling sesuai per halaman, sehingga mengoptimalkan keseimbangan antara performa, SEO, dan pengalaman pengguna [19]. Dalam ekosistem pengembangan web, Next.js sering digunakan sebagai lapisan antarmuka pengguna (frontend) interaktif yang efisien dan responsif.

---

### 2.2.13 Sistem Manajemen Basis Data Relasional (MySQL / MariaDB)

MySQL adalah sistem manajemen basis data relasional (Relational Database Management System / RDBMS) sumber terbuka yang menggunakan Structured Query Language (SQL) sebagai bahasa untuk mendefinisikan, memanipulasi, dan mengakses data [20]. Sistem ini dikenal karena keandalannya, performa tinggi pada operasi baca, dan ekosistem tooling yang matang sehingga banyak digunakan pada aplikasi web berskala besar maupun kecil [20].

MariaDB merupakan cabang (fork) komunitas dari MySQL yang dikembangkan sebagai alternatif drop-in replacement dengan kompatibilitas penuh terhadap sintaks SQL dan skema MySQL [20]. Sistem manajemen basis data relasional (RDBMS) seperti MySQL atau MariaDB berfungsi sebagai media penyimpanan data terstruktur yang menjamin keamanan dan konsistensi data melalui relasi tabel.

---

### 2.2.14 Use Case Diagram

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

### 2.2.15 Activity Diagram

*Activity Diagram* adalah jenis diagram UML yang menggambarkan alur kerja (*workflow*) atau logika proses secara grafis. Diagram ini merepresentasikan urutan aktivitas, percabangan alur (*decision points*), pemrosesan paralel (*fork/join*), dan kondisi akhir dari suatu proses [21]. *Activity Diagram* memiliki kemiripan konseptual dengan *flowchart*, namun lebih ekspresif dalam merepresentasikan perilaku paralel dan mekanisme sinkronisasi antar alur aktivitas.

*Activity Diagram* menggambarkan elemen-elemen penting seperti aksi, alur proses, serta hubungan antar aktivitas sehingga memudahkan pemahaman terhadap sistem. Komponen-komponen pembangun *Activity Diagram* beserta representasi visual dan fungsinya disajikan pada Tabel 2.3 berikut.

**Tabel 2.3 Simbol-simbol pada *Activity Diagram***

| Nama Simbol | Representasi Visual | Fungsi |
|---|---|---|
| *Initial Node* | Lingkaran padat penuh (●) | Sebagai penanda titik awal dimulainya suatu aktivitas |
| *Action Node* | Persegi panjang berujung tumpul (▭) | Sebagai simbol aktivitas atau langkah yang tengah dikerjakan oleh suatu entitas (pengguna/sistem) |
| *Control Flow* | Garis berpanah (→) | Sebagai penanda arah alur transisi dari satu aktivitas ke aktivitas berikutnya |
| *Decision Node* | Belah ketupat (◇) | Sebagai simbol titik percabangan bersyarat dengan lebih dari satu kemungkinan alur |
| *Fork / Join Node* | Garis tebal horizontal atau vertikal (━━) | Sebagai penanda pemisahan (*fork*) atau penggabungan (*join*) dua atau lebih alur aktivitas yang berjalan secara paralel |
| *Swimlane (Partition)* | Kolom atau baris terbagi dengan garis pembatas | Sebagai penanda pembagian area atau pengelompokan aktivitas berdasarkan entitas, aktor, atau sistem yang bertanggung jawab menjalankannya |
| *Activity Final Node* | Lingkaran padat bersarang (⊙) | Sebagai penanda titik akhir dari keseluruhan alur aktivitas |

---

### 2.2.16 Entity Relationship Diagram (ERD)

*Entity Relationship Diagram* (ERD) adalah model konseptual yang digunakan untuk mendeskripsikan struktur data dari suatu sistem informasi secara grafis, pertama kali diperkenalkan oleh Peter Chen pada tahun 1976 [22]. ERD menggambarkan tiga komponen utama pembentuk basis data. Komponen pertama adalah entitas (*entity*), yang merepresentasikan objek atau konsep dunia nyata dengan eksistensi independen. Komponen kedua adalah atribut (*attribute*), yang merepresentasikan karakteristik atau properti rincian dari setiap entitas. Komponen ketiga adalah relasi (*relationship*), yang menggambarkan hubungan logis antar entitas beserta aturan kardinalitasnya [22].

Pada implementasi ke model relasional, entitas direpresentasikan sebagai tabel, atribut sebagai kolom, dan relasi *many-to-many* diimplementasikan melalui tabel penghubung (*junction table*) dengan *foreign key*. Notasi ERD dalam pemodelan basis data relasional modern umumnya menggunakan gaya diagram berbasis kolom tabel dengan penanda *Primary Key* (PK) dan *Foreign Key* (FK), sebagaimana disajikan pada Tabel 2.4 berikut.

**Tabel 2.4 Notasi pada *Entity Relationship Diagram***

| Notasi | Nama | Keterangan |
|---|---|---|
| **PK** (huruf tebal pada nama kolom) | *Primary Key* | Kolom unik yang digunakan untuk mengidentifikasi setiap baris dalam sebuah tabel secara unik [22] |
| **FK** (dengan garis referensi ke tabel lain) | *Foreign Key* | Kolom dalam suatu tabel yang mereferensikan *Primary Key* dari tabel lain untuk membangun relasi antar tabel [22] |
| **Kotak berlabel nama tabel** | Entitas (*Entity*) | Merepresentasikan objek atau konsep yang memiliki data tersimpan dalam sistem basis data, diimplementasikan sebagai tabel relasional [22] |
| **Nama kolom di dalam kotak tabel** | Atribut (*Attribute*) | Menunjukkan informasi atau properti yang dimiliki oleh sebuah entitas, diimplementasikan sebagai kolom dalam tabel [22] |
| **Garis dengan simbol kardinalitas (`\|\|--o{`)** | Relasi (*Relationship*) | Menggambarkan keterkaitan yang terbentuk antar entitas beserta aturan kardinalitasnya [22] |

Aturan kardinalitas relasi antar entitas terbagi menjadi tiga jenis yang disajikan pada Tabel 2.5 berikut.

**Tabel 2.5 Notasi Kardinalitas Relasi pada *Entity Relationship Diagram***

| Notasi | Jenis Relasi | Keterangan |
|---|---|---|
| `\|\|--\|\|` | *One-to-One* (1:1) | Satu entitas hanya dapat berelasi dengan tepat satu entitas lainnya |
| `\|\|--o{` | *One-to-Many* (1:N) | Satu entitas dapat berelasi dengan lebih dari satu entitas lainnya |
| `}o--o{` | *Many-to-Many* (M:N) | Banyak entitas dapat berelasi dengan banyak entitas lainnya |

---

### 2.2.17 User Acceptance Testing (UAT)

User Acceptance Testing (UAT) adalah tahap pengujian perangkat lunak yang dilakukan oleh pengguna akhir (end-user) atau perwakilan pengguna untuk memverifikasi bahwa sistem yang dikembangkan telah memenuhi kebutuhan bisnis dan persyaratan fungsional yang telah disepakati [23]. Berbeda dengan pengujian unit (unit testing) atau pengujian integrasi (integration testing) yang dilakukan oleh tim pengembang untuk memverifikasi kebenaran teknis kode, UAT berfokus pada validasi sistem dalam skenario penggunaan nyata dari perspektif pengguna [23].

Dalam praktiknya, UAT dapat diklasifikasikan ke dalam tiga jenis pengujian utama. Jenis pertama adalah *Business Acceptance Testing* (BAT) yang bertujuan memverifikasi kesesuaian perilaku sistem dengan spesifikasi dan alur proses bisnis organisasi. Jenis kedua adalah *Contractual Acceptance Testing* (CAT) yang dilakukan untuk memvalidasi pemenuhan syarat atau kriteria yang telah ditetapkan dalam kontrak kesepakatan awal. Jenis ketiga adalah *Alpha/Beta Testing*, yaitu pengujian operasional yang melibatkan calon pengguna nyata sebelum perangkat lunak dirilis secara resmi ke publik [23].

Tingkat penerimaan pengguna terhadap sistem dapat diukur secara kuantitatif menggunakan instrumen kuesioner terstruktur. Perhitungan nilai rata-rata penerimaan dilakukan menggunakan Persamaan (2.7), sedangkan nilai persentase penerimaan dihitung menggunakan Persamaan (2.8).

$$\text{Rata-rata} = \frac{\text{Bobot Penilaian}}{\text{Total Responden}} \tag{2.7}$$

$$\text{Persentase} = \frac{\text{Rata-rata}}{\text{Bobot Maksimum}} \times 100\% \tag{2.8}$$

Skala interpretasi hasil pengujian penerimaan pengguna dapat diklasifikasikan ke dalam kategori kelayakan berdasarkan rentang persentase sebagaimana disajikan pada Tabel 2.6 berikut [23].

**Tabel 2.6 Klasifikasi Persentase Penerimaan Pengguna**

| Rentang | Kategori |
|---|---|
| 0–20% | Sangat tidak layak |
| 21–40% | Tidak layak |
| 41–60% | Cukup layak |
| 61–80% | Layak |
| 81–100% | Sangat layak |

Sistem dinyatakan diterima apabila hasil persentase berada pada kategori layak atau sangat layak [23].

---

### 2.2.18 Metodologi Pengembangan Perangkat Lunak (*Iterative Waterfall*)

*Iterative Waterfall* adalah model siklus hidup pengembangan perangkat lunak (*Software Development Life Cycle* / SDLC) yang merupakan evolusi dari model *Waterfall* klasik. Model *Waterfall* klasik mendefinisikan proses pengembangan sebagai rangkaian fase berurutan yang harus diselesaikan secara tuntas sebelum fase berikutnya dimulai, meliputi fase analisis kebutuhan, perancangan sistem, implementasi, pengujian, dan pemeliharaan [21]. Keterbatasan utama model klasik ini terletak pada sifatnya yang kaku (*rigid*): perubahan atau temuan baru yang ditemukan pada fase pengujian tidak dapat direspons tanpa merombak seluruh alur pengembangan dari awal.

*Iterative Waterfall* mengatasi keterbatasan tersebut dengan menambahkan mekanisme umpan balik (*feedback loop*) antar fase yang berdampingan. Pada setiap tahapan pengembangan, dimungkinkan adanya iterasi mundur (*backward iteration*) ke fase sebelumnya apabila ditemukan deviasi, kesalahan logika, atau kebutuhan baru yang belum terakomodasi dalam spesifikasi awal [21]. Dengan pendekatan ini, tim pengembang dapat melakukan evaluasi dan penyesuaian algoritma secara berkelanjutan tanpa harus merombak total arsitektur sistem yang telah dibangun.

Model Iterative Waterfall sangat sesuai diterapkan pada proyek pengembangan perangkat lunak yang memerlukan penyesuaian atau eksperimen berkelanjutan pada algoritmanya, di mana hasil evaluasi pada tahap pengujian dapat langsung ditindaklanjuti dengan perbaikan desain tanpa menghentikan alur siklus hidup sistem secara keseluruhan [21].
