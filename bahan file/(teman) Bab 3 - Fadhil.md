# BAB III METODE PENELITIAN

## 3.1. Alat dan bahan

Berikut menjelaskan rincian alat dan bahan yang digunakan untuk implementasi "Rancang Bangun Sistem Pencatatan Keuangan Otomatis Berbasis Website Menggunakan Optical Character Recognition (OCR) dengan Integrasi Telegram Bot".

### 3.1.1. Alat

Penelitian ini menggunakan berbagai macam peralatan, baik perangkat lunak maupun perangkat keras. Berikut adalah penjelasan mengenai peralatan-peralatan yang digunakan dalam penelitian ini.

#### 3.1.1.1. Perangkat Lunak

Dalam pengerjaan proyek akhir ini, digunakan berbagai perangkat lunak untuk mendukung setiap tahapan pengembangan sistem. Proses pengembangan aplikasi, khususnya pada sisi frontend dan backend, dilakukan menggunakan sistem operasi Windows. Sementara itu, untuk tahap pengolahan data seperti preprocessing, training model OCR, serta post-processing, digunakan lingkungan berbasis Linux karena kompatibilitas dan dukungannya terhadap berbagai pustaka machine learning. Adapun semua perangkat lunak yang digunakan dapat dilihat pada tabel 3.1 berikut.

**Tabel 3.1 Perangkat lunak yang digunakan**

| No | Nama | Deskripsi | Versi |
|----|------|-----------|-------|
| **Sistem Operasi** | | | |
| 1 | Windows | Digunakan untuk pengembangan dan implementasi aplikasi berbasis web (frontend dan backend). | 10 |
| 2 | Ubuntu | Digunakan untuk eksperimen dan pengolahan data OCR berbasis Python. | 24.04 LTS |
| 3 | VPS Digital Ocean (Ubuntu) | Digunakan untuk melakukan deployment sistem finansial Duomeco. | 24.04.4 LTS |
| **Bahasa Pemrograman** | | | |
| 4 | Python | Digunakan untuk preprocessing data, training model OCR, evaluasi, dan eksperimen. | 3.12.3 |
| 5 | Typescript | Statically typed programming language yang digunakan untuk pengembangan backend dan frontend dengan base Javascript. | 5.9.3 |
| **Pustaka Python (OCR & Data Processing)** | | | |
| 6 | Tesseract OCR | Digunakan sebagai engine berbasis BiLSTM dalam proses evaluasi dan perbandingan performa ekstraksi teks dari citra. | 4.1.1 |
| 7 | EasyOCR | Digunakan sebagai metode OCR berbasis deep learning serta digunakan dalam proses evaluasi dan perbandingan performa ekstraksi teks dari citra. | 1.7.2 |
| 8 | PaddleOCR | Digunakan sebagai metode OCR berbasis deep learning dan transformer serta digunakan dalam proses evaluasi dan perbandingan performa ekstraksi teks dari citra. | 3.4.0 |
| 9 | OpenCV | Digunakan untuk preprocessing citra seperti grayscale, thresholding, dan denoising. | 4.10.0 |
| 10 | NumPy | Digunakan untuk komputasi numerik dan manipulasi array. | 1.26.4 |
| 11 | Pandas | Digunakan untuk pengolahan dan analisis data. | 2.3.3 |
| 12 | Matplotlib | Digunakan untuk visualisasi hasil evaluasi model. | 3.10.8 |
| 13 | Jiwer | Digunakan untuk menghitung metrik evaluasi Character Error Rate (CER) dan Word Error Rate (WER) pada hasil ekstraksi teks OCR. | 4.0.0 |
| **Teknologi untuk Aplikasi Web** | | | |
| 14 | Node.js | Digunakan sebagai runtime untuk menjalankan aplikasi backend. | 20.20.2 |
| 15 | Express.js | Digunakan untuk membangun REST API. | 5.2.1 |
| 16 | Prisma ORM | Digunakan sebagai ORM untuk mengelola interaksi antara backend dan database MySQL. | 7.2.0 |
| 17 | Next.js | Digunakan sebagai framework frontend pembangun aplikasi web berbasis React. | 15.3.0 |
| 18 | Tailwind CSS | Digunakan untuk styling antarmuka secara efisien. | 4.1.17 |
| 19 | MySQL | Digunakan sebagai sistem manajemen basis data relasional untuk menyimpan data aplikasi Duomeco. | 8.0.45 |
| **Teknologi Lainnya** | | | |
| 20 | Git dan GitHub | Digunakan untuk version control dan penyimpanan kode sumber. | - |
| 21 | Postman | Digunakan untuk pengujian dan dokumentasi endpoint API. | - |
| 22 | Telegram Bot API | Digunakan sebagai alat integrasi antara aplikasi Telegram dengan sistem untuk memudahkan interaksi sistem, seperti mengunggah gambar struk, memproses OCR, dan generate laporan. | - |

#### 3.1.1.2. Perangkat Keras

Pada pelaksanaan proyek akhir ini, digunakan dua jenis perangkat keras yang mendukung proses pengembangan sistem, yaitu perangkat keras milik pribadi dan perangkat keras yang tersedia di lingkungan kampus. Perangkat keras pribadi digunakan sebagai sarana utama dalam pengembangan aplikasi web. Sementara itu, perangkat keras milik kampus dimanfaatkan untuk mendukung proses lain yang membutuhkan sumber daya tambahan, seperti pengolahan data, eksperimen, serta pengujian model.

Penggunaan lebih dari satu perangkat ini bertujuan untuk mengoptimalkan kinerja selama proses penelitian, terutama pada tahap yang memerlukan kapasitas komputasi lebih besar. Dengan pembagian tersebut, proses pengembangan dan eksperimen dapat berjalan secara lebih efisien tanpa bergantung pada satu perangkat saja. Adapun spesifikasi dari seluruh perangkat keras yang digunakan dalam penelitian ini disajikan pada Tabel 3.2 berikut.

**Tabel 3.2 Perangkat keras yang digunakan**

| No | Perangkat | Spesifikasi |
|----|-----------|-------------|
| **Perangkat Keras Mandiri (Laptop Asus A405U)** | | |
| 1 | Prosesor | Intel Core i5 gen 7 (7200u) |
| 2 | RAM | DDR4 / 8GB |
| 3 | SSD | 256GB |
| 4 | HDD | 1TB |
| 5 | GPU | NVIDIA GeForce 940MX (2GB), Intel(R) HD Graphics 620 (218MB) |
| **Perangkat Keras Kampus (PC Lab AIOT: Beta)** | | |
| 6 | Prosesor | Intel i9 |
| 7 | RAM | 32GB |
| 8 | SSD | 1TB |
| 9 | GPU | NVIDIA RTX 5080 |

### 3.1.2. Bahan

Bahan utama yang digunakan dalam tugas akhir ini adalah dataset ICDAR2019-SROIE [23] (Scanned Receipts OCR and Information Extraction) yang diperoleh melalui salah satu platform dataset, yakni Hugging Face dengan link https://huggingface.co/datasets/jsdnrs/ICDAR2019-SROIE. Dataset ini merupakan dataset benchmark standar yang secara luas digunakan dalam penelitian OCR pada kasus struk belanja. Dataset SROIE berisi kumpulan gambar struk belanja hasil pemindaian dari dunia nyata yang telah dianotasi secara manual untuk keperluan evaluasi sistem rekognisi teks dan ekstraksi informasi.

Dataset SROIE terdiri dari dua split, yaitu train yang memuat 626 gambar dan test yang memuat 361 gambar, sehingga total keseluruhan dataset adalah 987 gambar struk belanja. Setiap baris pada dataset merepresentasikan satu gambar struk yang memuat enam kolom. Penjelasan struktur kolom dataset SROIE dapat dilihat pada Tabel 3.3 berikut.

**Tabel 3.3 Struktur kolom dataset SROIE**

| No | Kolom | Tipe Data | Keterangan |
|----|-------|-----------|------------|
| 1 | image | image object | Gambar struk belanja |
| 2 | key | string | Unique identifier untuk setiap sampel gambar. |
| 3 | image_size | dict | Dimensi gambar dalam format lebar x tinggi dalam satuan piksel. |
| 4 | entities | dict | Informasi entitas struk yang memuat company, address, date, dan total. |
| 5 | words | list | Daftar teks per baris yang terdapat pada gambar struk (ground truth per baris). |
| 6 | bboxes | list | Daftar koordinat bounding box dalam piksel aktual yang bersesuaian dengan setiap elemen pada kolom words. |

Pemilihan dataset SROIE sebagai bahan penelitian didasarkan pada beberapa pertimbangan. Pertama, dataset ini dihasilkan dari kompetisi internasional ICDAR (International Conference on Document Analysis and Recognition) 2019 [23] yang merupakan salah satu forum utama di bidang document analysis and recognition, serta telah digunakan sebagai benchmark evaluasi pada berbagai penelitian sejenis, contohnya seperti yang dilakukan oleh Hongkuan Zhang dkk [24]. Kedua, dataset ini menyediakan ground truth yang lengkap pada level baris teks beserta koordinat bounding box, yang memungkinkan evaluasi performa OCR secara akurat menggunakan metrik Character Error Rate (CER) dan Word Error Rate (WER). Ketiga, kasus struk belanja pada dataset SROIE sesuai dengan konteks aplikasi nyata dalam penelitian ini, yaitu sistem pencatatan keuangan otomatis Duomeco yang memerlukan kemampuan ekstraksi teks dari gambar struk belanja. Contoh gambar dan fitur pada dataset ini dapat dilihat pada gambar 3.1.

![Gambar 3.1 Contoh gambar dan fitur pada dataset SROIE](images/gambar-3.1.png)

**Gambar 3.1 Contoh gambar dan fitur pada dataset SROIE**

## 3.2. Tahapan Proyek Akhir

Proyek akhir ini disusun dengan mengacu pada metodologi CRISP-DM (Cross-Industry Standard Process for Data Mining). CRISP-DM dipilih karena metodologi ini menyediakan kerangka kerja yang terstruktur dan iteratif untuk penelitian berbasis data sehingga sesuai dengan karakteristik penelitian ini yang melibatkan eksplorasi dataset, eksperimen evaluasi model OCR, serta pengembangan sistem secara bersamaan. Tahapan CRISP-DM yang digunakan meliputi: Data Acquisition and Exploration, Data Preparation, Evaluasi Base Model, Optimasi Hyperparameter, Evaluasi dan Perbandingan Model, Pengembangan Sistem, serta Pengujian Sistem. Dalam membangun "Sistem Pencatatan Keuangan Otomatis Berbasis Website Menggunakan Optical Character Recognition (OCR) dengan Integrasi Telegram Bot".

Tahap pertama yang dilakukan adalah data acquisition and exploration pada dataset SROIE sebagai data utama penelitian. Selanjutnya dilakukan proses data preparation untuk menyesuaikan format dataset dengan kebutuhan masing-masing library OCR. Selanjutnya, dilakukan evaluasi performa awal (base model) ketiga library OCR sebagai baseline perbandingan. Kemudian, dilakukan optimasi hyperparameter pada masing-masing library OCR untuk memperoleh konfigurasi terbaik. Setelah itu, dilakukan evaluasi dan perbandingan performa ketiga library OCR menggunakan metrik CER, WER, dan time computation. Setelah model OCR terbaik diperoleh, dikembangkan sistem website pencatatan keuangan otomatis yang terintegrasi dengan Telegram Bot. Terakhir, dilakukan pengujian sistem menggunakan User Acceptance Testing (UAT) bersama pengguna UMKM Duomeco. Terkait alur seluruh tahapan penelitian dapat dilihat pada Gambar 3.2.

![Gambar 3.2 Diagram alur tahapan penelitian](images/gambar-3.2.png)

**Gambar 3.2 Diagram alur tahapan penelitian**

### 3.2.1. Data Acquisition and Exploration

Tahap pertama dalam penelitian ini adalah akuisisi dataset dengan memperoleh dataset SROIE yang telah tersedia secara publik melalui platform Hugging Face pada link yang telah disebutkan di sub bab sebelumnya. Proses akuisisi dilakukan menggunakan library 'datasets', yang memungkinkan integrasi dataset langsung ke dalam environment tanpa proses unduh manual dari platform Hugging Face.

Setelah dataset berhasil diperoleh, dilakukan eksplorasi awal untuk memahami karakteristik data sebelum masuk ke tahap persiapan. Eksplorasi meliputi analisis distribusi jumlah sampel per split dataset, distribusi dimensi gambar (lebar dan tinggi dalam piksel), distribusi jumlah kata pada ground truth, serta ketersediaan field total pada setiap sampel. Selain itu, dilakukan visualisasi preview lima sampel gambar struk belanja untuk memberikan gambaran visual awal terhadap data. Hasil eksplorasi menunjukkan bahwa dataset SROIE memiliki variasi dimensi gambar yang cukup beragam serta label ground truth yang lengkap, sehingga layak digunakan sebagai data utama dalam proses evaluasi ketiga library OCR.

### 3.2.2. Data Preparation

Setelah data diakuisisi dan dieksplorasi, dilakukan proses persiapan data. Dataset SROIE yang telah diunduh dimuat langsung dari Hugging Face ke dalam environment pengembangan menggunakan split test. Ground truth setiap sampel dibentuk dengan menggabungkan seluruh kata pada kolom words menjadi satu string per struk belanja. Selanjutnya, disiapkan dua kondisi input gambar untuk keperluan evaluasi, yaitu gambar raw (tanpa preprocessing) dan gambar preprocessed yang telah dikonversi ke grayscale serta diterapkan adaptive thresholding menggunakan OpenCV. Kedua kondisi input tersebut digunakan secara identik pada ketiga library OCR sehingga perbandingan performa yang dihasilkan bersifat objektif dan adil.

### 3.2.3. Evaluasi Base Model

Sebelum melakukan optimasi, terlebih dahulu dilakukan evaluasi performa awal (baseline) ketiga library OCR menggunakan model bawaan (pretrained model) tanpa modifikasi apapun. Evaluasi base model ini penting untuk mengetahui kemampuan awal masing-masing library pada domain struk belanja, sekaligus menjadi acuan perbandingan setelah dilakukan optimasi hyperparameter. Evaluasi dilakukan pada split test dataset SROIE yang bersifat identik untuk ketiga library guna menjamin perbandingan yang adil.

Pada tahap ini diuji pula pengaruh image preprocessing terhadap performa OCR. Preprocessing yang diterapkan terdiri dari dua tahap, yaitu konversi gambar ke grayscale dan adaptive thresholding menggunakan metode Gaussian dengan OpenCV. Konversi ke grayscale dilakukan sebagai langkah awal untuk menyederhanakan dimensi data citra sehingga mengurangi variasi yang tidak relevan dan mempermudah proses analisis pada tahap berikutnya tanpa menghilangkan informasi penting [56]. Selanjutnya, adaptive thresholding dipilih berdasarkan bukti penelitian bahwa metode global thresholding tidak mampu menangani variasi pencahayaan lokal pada gambar dokumen hasil pemotretan, sementara adaptive thresholding terbukti menghasilkan akurasi OCR yang lebih tinggi pada kondisi pencahayaan tidak merata [57]. Hal ini relevan dengan karakteristik gambar struk belanja pada dataset SROIE yang merupakan hasil pemotretan di berbagai kondisi pencahayaan, di mana bagian tengah struk cenderung lebih terang dibandingkan bagian tepi, sehingga adaptive thresholding dipilih sebagai teknik yang paling sesuai. Preprocessing yang sama diterapkan secara identik pada ketiga library untuk menjaga konsistensi dan keadilan perbandingan.

### 3.2.4. Optimasi Hyperparameter

Tahap ini merupakan proses optimasi konfigurasi pada ketiga library OCR menggunakan pendekatan grid search. Perlu dicatat bahwa optimasi yang dilakukan bukan merupakan proses pelatihan ulang model (fine-tuning), melainkan pencarian kombinasi hyperparameter terbaik pada base model. Tahap ini berfokus pada penyesuaian ambang batas (threshold) yang menentukan sejauh mana suatu area pada gambar dianggap mengandung teks. Meskipun penamaan hyperparameter pada masing-masing library berbeda-beda, ketiganya mengontrol sensitivitas yang sama. Hal ini penting karena, nilai yang terlalu tinggi berisiko melewatkan wilayah teks, sementara nilai yang terlalu rendah memunculkan deteksi yang keliru [62]. Dengan menyamakan fokus tuning pada parameter yang berperan serupa, perbandingan antara ketiga library tetap bersifat adil dan setara. Seluruh kombinasi dievaluasi menggunakan metrik CER, WER, dan computation time sebagai dasar pemilihan konfigurasi terbaik. Hyperparameter beserta jumlah kombinasi yang dihasilkan untuk setiap library dapat dilihat pada Tabel 3.4.

**Tabel 3.4 Hyperparameter yang diuji pada setiap library OCR**

| Library | Hyperparameter | Jumlah Kombinasi |
|---------|-----------------|-------------------|
| Tesseract OCR | PSM (Page Segmentation Mode) | 5 |
| EasyOCR | paragraph, contrast_ths, text_threshold, low_text | 16 |
| PaddleOCR | text_det_thresh, text_det_box_thresh, text_rec_score_thresh | 8 |

### 3.2.5. Evaluasi dan Perbandingan Akhir Model

Setelah proses optimasi hyperparameter selesai, dilakukan evaluasi menyeluruh untuk mengukur dan membandingkan performa ketiga library OCR. Evaluasi dilakukan menggunakan dua metrik utama, yaitu Character Error Rate (CER) dan Word Error Rate (WER), dengan waktu komputasi (time computation) sebagai metrik sekunder. Evaluasi dilakukan pada split test dataset SROIE yang identik untuk ketiga library.

Perbandingan dilakukan pada beberapa skenario, meliputi pengaruh preprocessing terhadap performa masing-masing library, pengaruh optimasi hyperparameter terhadap performa dibandingkan base model, serta perbandingan antar library OCR secara keseluruhan untuk menentukan library terbaik pada domain struk belanja. Hasil evaluasi disajikan dalam bentuk tabel perbandingan dan grafik visualisasi untuk memudahkan analisis.

### 3.2.6. Pengembangan dan Pemasangan Sistem

Setelah model OCR terbaik diperoleh dari tahapan evaluasi, dilakukan pengembangan sistem pencatatan keuangan otomatis Duomeco. Sistem ini dikembangkan sebagai aplikasi website berbasis fullstack TypeScript menggunakan Next.js untuk sisi frontend dan Express.js untuk sisi backend. Selain melalui website, pengguna juga dapat mengunggah gambar struk melalui Telegram Bot yang terintegrasi dengan sistem.

Proses OCR dilakukan di sisi server menggunakan Python, di mana gambar struk yang diunggah pengguna diproses oleh library OCR terbaik untuk mengekstrak informasi penting, yakni nama toko, tanggal transaksi, dan total harga. Hasil ekstraksi kemudian disimpan ke dalam basis data MySQL untuk keperluan pencatatan keuangan. Rincian arsitektur dan perancangan sistem dijelaskan lebih lanjut pada sub bab 3.3.

### 3.2.7. Pengujian Sistem

Tahap terakhir dalam penelitian ini adalah pengujian sistem yang dilakukan dalam dua jenis, yaitu pengujian fungsionalitas menggunakan User Acceptance Testing (UAT) dan pengujian performa sistem berupa pengukuran response time yang terfokus pada penerapan Telegram Bot. Kedua jenis pengujian ini dilakukan bersama pengguna UMKM Duomeco untuk memastikan sistem bekerja sesuai kebutuhan pengguna nyata.

#### 3.2.7.1. User Acceptance Testing (UAT)

Pengujian UAT dilakukan untuk memvalidasi bahwa sistem yang dikembangkan telah berfungsi sesuai dengan kebutuhan dan ekspektasi pengguna UMKM Duomeco. Pengujian ini mencakup seluruh alur fungsionalitas sistem, termasuk alur input transaksi melalui sistem pada web maupun pada Telegram Bot, proses ekstraksi OCR, pencatatan transaksi, hingga pengunduhan laporan keuangan melalui Telegram Bot. Pengguna UMKM Duomeco diberikan waktu untuk mencoba sistem secara langsung, kemudian diminta mengisi kuesioner penilaian yang mencakup aspek kemudahan penggunaan, kecepatan respons, ketepatan hasil OCR, serta kepuasan pengguna secara keseluruhan. Penilaian menggunakan rentang skor 1-5, di mana nilai 1 berarti sangat tidak setuju dan nilai 5 berarti sangat setuju.

#### 3.2.7.2. Pengujian Performa Telegram Bot (Uji Beban)

Pengujian beban dilakukan untuk mengukur kemampuan sistem dalam merespons permintaan pengguna melalui Telegram Bot di bawah kondisi penggunaan nyata. Metrik yang digunakan dalam pengujian ini adalah response time secara end-to-end, yaitu jeda waktu yang diukur mulai dari pengguna mengirimkan pesan atau gambar struk melalui Telegram Bot hingga sistem mengembalikan hasil balasan.

## 3.3. Perancangan Alat/Purwarupa

Bagian ini menjelaskan perancangan sistem yang mencakup arsitektur sistem, desain basis data, serta desain antarmuka pengguna. Perancangan dilakukan berdasarkan hasil analisis kebutuhan yang diperoleh pada tahapan sebelumnya.

### 3.3.1. Arsitektur Sistem

Arsitektur sistem Duomeco dirancang menggunakan pendekatan client-server dengan pemisahan yang jelas antara sisi frontend, backend, dan modul OCR. Sisi frontend dibangun menggunakan Next.js yang berkomunikasi dengan backend Express.js melalui RESTful API. Modul OCR berjalan di sisi server menggunakan Python dan memproses gambar struk yang diunggah pengguna baik melalui website maupun melalui Telegram Bot. Hasil ekstraksi teks kemudian disimpan ke dalam basis data MySQL. Gambaran arsitektur sistem secara keseluruhan dapat dilihat pada Gambar 3.3 berikut.

![Gambar 3.3 Arsitektur sistem finansial Duomeco](images/gambar-3.3.png)

**Gambar 3.3 Arsitektur sistem finansial Duomeco**

Gambar 3.3 mengilustrasikan arsitektur sistem perangkat lunak yang terstruktur ke dalam empat komponen utama: Client Layer, Backend Server, External, dan Data Layer. Pada bagian Client Layer, sistem menerima interaksi dari dua jalur utama. Jalur pertama adalah melalui antarmuka Web Browser (yang dibangun menggunakan Next JS, TypeScript, dan Tailwind CSS) yang berkomunikasi langsung dengan Handler Layer di Backend Server menggunakan REST API dan Cookie, serta menerima response berupa data JSON. Jalur kedua berasal dari pengguna aplikasi Telegram, di mana pesan atau foto yang dikirim akan diproses terlebih dahulu oleh External Layer (Telegram Bot API). API dari Telegram ini kemudian meneruskan data ke Gateway Layer di Backend Server menggunakan mekanisme Webhook.

Di dalam Backend Server, baik Handler Layer (dari web) maupun Gateway Layer (dari Telegram) berfungsi sebagai penerima yang meneruskan permintaan ke Service Layer. Layer ini merupakan pusat pengolahan logika bisnis yang memanfaatkan teknologi TypeScript dan Python. Setelah diproses, data diteruskan ke Repository Layer (berbasis TypeScript), yang bertugas mengelola komunikasi dengan basis data. Terakhir, pada Data Layer, Repository Layer akan melakukan operasi Query atau Mutation (pembacaan atau penulisan data) ke basis data MySQL menggunakan Prisma ORM, untuk kemudian mengembalikan hasil atau data tersebut kembali kepada client.

### 3.3.2. Use Case Diagram

Use case diagram digunakan untuk menggambarkan interaksi antara pengguna dan sistem dalam menjalankan fungsionalitasnya. Sistem Duomeco memiliki dua aktor utama, yaitu Owner dan Staff, yang masing-masing memiliki hak akses berbeda terhadap fitur sistem. Diagram ini dirancang untuk menunjukkan alur penggunaan sistem mulai dari proses autentikasi pengguna hingga pengelolaan data keuangan secara digital.

Kedua aktor dapat melakukan login sebagai langkah awal untuk mengakses sistem, di mana proses ini memiliki relasi include terhadap use case autentikasi. Setelah berhasil masuk, pengguna dapat mengakses fitur-fitur operasional seperti melihat dashboard, mengelola transaksi, bisnis, mitra, dan aset, serta melihat dan mengedit profil. Fitur input transaksi via OCR dan via Telegram Bot memiliki relasi include terhadap use case ekstraksi OCR, menandakan bahwa proses pengenalan teks pada struk dijalankan secara otomatis setiap kali fitur tersebut digunakan.

Perbedaan hak akses antara kedua aktor tercermin dari fitur eksklusif yang hanya dapat diakses oleh Owner, yaitu pengelolaan data pengguna (user management) serta pengelolaan data bisnis. Fitur pengunduhan laporan juga dapat dilakukan melalui Telegram Bot sebagai alternatif antarmuka selain aplikasi web. Proses logout menandai akhir dari sesi interaksi pengguna dengan sistem. Use case diagram sistem Duomeco dapat dilihat pada Gambar 3.4.

![Gambar 3.4 Use Case Diagram sistem finansial Duomeco](images/gambar-3.4.png)

**Gambar 3.4 Use Case Diagram sistem finansial Duomeco**

### 3.3.3. Activity Diagram

Activity diagram menggambarkan tahapan-tahapan yang dilalui pengguna saat menggunakan fitur-fitur dalam sistem. Diagram ini menampilkan alur tindakan pengguna serta reaksi yang diberikan oleh sistem sebagai respons terhadap setiap tindakan tersebut. Proses yang digambarkan mencakup login, pengelolaan transaksi, bisnis, mitra, aset, pengelolaan via Telegram, hingga logout.

Diagram pada Gambar 3.5 menjelaskan alur aktivitas login. Saat pengguna mengakses halaman web sistem Duomeco, sistem akan menampilkan form login sebagai halaman awal. Pengguna memasukkan username dan password yang telah terdaftar, kemudian sistem melakukan verifikasi kredensial. Apabila data yang dimasukkan sesuai, pengguna akan diarahkan ke halaman dashboard utama.

![Gambar 3.5 Activity Diagram Proses Login](images/gambar-3.5.png)

**Gambar 3.5 Activity Diagram Proses Login**

Gambar 3.6 menunjukkan activity diagram untuk proses tambah transaksi menggunakan OCR. Alur dimulai ketika Owner/Staff memilih menu transaksi via gambar, kemudian sistem menampilkan halaman beserta form upload foto. Selanjutnya, Owner/Staff mengunggah gambar struk belanja, lalu sistem memproses gambar tersebut menggunakan OCR dan menampilkan form konfirmasi berisi data hasil generate OCR. Owner/Staff kemudian dihadapkan pada keputusan, yaitu apakah ingin membatalkan proses atau tidak. Apabila Owner/Staff memilih batal, alur berakhir. Apabila tidak, Owner/Staff mengisi atau memastikan isi form hasil OCR, kemudian menekan tombol simpan. Sistem selanjutnya menyimpan data ke database dan memperbarui data di tabel transaksi.

![Gambar 3.6 Activity Diagram untuk proses transaksi menggunakan OCR via sistem website](images/gambar-3.6.png)

**Gambar 3.6 Activity Diagram untuk proses transaksi menggunakan OCR via sistem website**

Selanjutnya adalah alur activity diagram tambah transaksi via Telegram Bot yang dapat dilihat pada Gambar 3.7. Alur dimulai ketika Owner/Staff mengirim perintah /start melalui Telegram Bot, kemudian Telegram Bot meneruskan pesan tersebut ke server untuk dilakukan validasi akun. Server memeriksa apakah akun Telegram Owner/Staff sudah terdaftar di sistem atau belum. Apabila belum terdaftar, Telegram Bot menampilkan informasi Telegram ID pengguna beserta instruksi untuk mendaftarkan diri melalui sistem web, dan alur berakhir.

Apabila akun sudah terdaftar, server mengubah state pengguna dan meminta data yang dibutuhkan, kemudian Telegram Bot menampilkan pilihan metode tambah transaksi, yaitu secara manual atau via gambar struk belanja. Owner/Staff kemudian dihadapkan pada keputusan metode input. Apabila memilih manual, Owner/Staff mengirimkan data transaksi melalui chat dan Telegram Bot meneruskannya ke server. Apabila memilih via gambar, Owner/Staff mengunggah foto struk belanja, kemudian server mendeteksi bahwa data yang diterima berupa gambar dan secara otomatis melakukan ekstraksi teks menggunakan OCR sekaligus melakukan split message sesuai format yang dibutuhkan.

Setelah data berhasil diekstrak, Telegram Bot menampilkan menu konfirmasi hasil ekstraksi untuk diperiksa dan diedit oleh Owner/Staff. Setelah Owner/Staff mengkonfirmasi data, Telegram Bot meneruskan konfirmasi ke server dan transaksi disimpan ke database.

![Gambar 3.7 Activity Diagram proses transaksi manual dan OCR via Telegram](images/gambar-3.7.png)

**Gambar 3.7 Activity Diagram proses transaksi manual dan OCR via Telegram**

Gambar 3.8 menunjukkan activity diagram proses mengelola (Create, Read, Update, Delete) bisnis, mitra, aset, transaksi, dan karyawan secara manual.

![Gambar 3.8 Activity Diagram proses kelola data pada sistem](images/gambar-3.8.png)

**Gambar 3.8 Activity Diagram proses kelola data pada sistem**

Gambar 3.9 menunjukkan activity diagram proses generate laporan pada sistem Duomeco. Setelah login, Admin memilih filter yang sesuai dan menentukan format file yang diinginkan, yaitu Excel atau PDF. Admin kemudian menekan tombol generate laporan, lalu sistem secara otomatis membuat laporan sesuai filter dan format yang dipilih serta mengunduhnya langsung ke perangkat Owner/staff.

![Gambar 3.9 Activity Diagram proses generate laporan](images/gambar-3.9.png)

**Gambar 3.9 Activity Diagram proses generate laporan**

### 3.3.4. Entity Relationship Diagram (ERD)

ERD digunakan untuk merepresentasikan model penyimpanan data dari sistem Duomeco. ERD ini menggambarkan entitas-entitas utama, atribut, serta relasi antar entitas yang menjadi dasar perancangan basis data MySQL. ERD sistem Duomeco dapat dilihat pada Gambar 3.10 berikut.

![Gambar 3.10 Entity Relationship Diagram (ERD) sistem Duomeco](images/gambar-3.10.png)

**Gambar 3.10 Entity Relationship Diagram (ERD) sistem Duomeco**

Dapat dilihat pada gambar 3.10, sistem finansial Duomeco terdiri dari enam tabel, yaitu users, business, parties, assets, transactions, dan payments. Satu pengguna dapat memiliki banyak bisnis dan setiap bisnis dapat memiliki banyak transaksi maupun aset yang terdaftar. Terkait tabel parties, satu mitra dapat dipakai dalam semua bisnis yang ada. Relasi antara tabel transactions dan payments dirancang untuk mendukung mekanisme pembayaran yang fleksibel, di mana satu transaksi dapat memiliki banyak data pembayaran hal ini memungkinkan sebuah transaksi dibayar secara bertahap atau dicicil dalam beberapa kali pembayaran. Setiap pembayaran pada tabel payments mencatat informasi detail seperti jumlah yang dibayarkan, metode pembayaran (tunai atau transfer), serta tanggal pembayaran, sehingga riwayat cicilan setiap transaksi dapat terpantau secara lengkap. Selain itu, tabel transactions juga menyimpan kolom 'payment_status' dengan nilai paid, unpaid, atau partial untuk menunjukkan apakah transaksi tersebut sudah lunas, belum dibayar sama sekali, atau baru dibayar sebagian.

### 3.3.5. Desain Antarmuka

Perancangan desain antarmuka merupakan tahap akhir dari proses perencanaan sistem Duomeco. Pada tahap ini dirancang tampilan visual dari halaman-halaman utama yang akan digunakan oleh pengguna, meliputi halaman dashboard, halaman transaksi, dan halaman scan transaksi berbasis OCR.

#### 3.3.5.1. Halaman Dashboard

Halaman dashboard merupakan halaman utama yang pertama kali ditampilkan setelah pengguna berhasil masuk ke dalam sistem. Halaman ini menyajikan ringkasan kondisi keuangan bisnis secara menyeluruh dalam satu tampilan. Pada bagian atas terdapat empat kartu metrik yang menampilkan total pemasukan, total pengeluaran, laba bersih, dan jumlah transaksi pada periode yang dipilih. Di bawah metrik tersebut terdapat dua visualisasi grafik, yaitu bar chart perbandingan pemasukan dan pengeluaran, serta donut chart yang menggambarkan distribusi status pembayaran transaksi. Bagian terbawah menampilkan daftar transaksi terbaru. Pengguna juga dapat memfilter data berdasarkan rentang tanggal tertentu serta mengunduh laporan keuangan dalam format Excel atau PDF melalui tombol Generate Laporan. Desain antarmuka halaman dashboard dapat dilihat pada gambar 3.11.

![Gambar 3.11 Desain antarmuka Dashboard Page](images/gambar-3.11.png)

**Gambar 3.11 Desain antarmuka Dashboard Page**

#### 3.3.5.2. Halaman Transaksi

Halaman transaksi menampilkan seluruh data transaksi keuangan yang telah dicatat dalam sistem secara terstruktur dalam bentuk tabel. Setiap baris pada tabel memuat informasi tanggal transaksi, deskripsi, tipe transaksi (pemasukan atau pengeluaran), jumlah nominal dalam format rupiah, serta status pembayaran. Pengguna dapat memfilter data berdasarkan rentang tanggal, serta melakukan operasi tambah, ubah, dan hapus data transaksi melalui antarmuka yang tersedia. Desain antarmuka halaman transaksi dapat dilihat pada gambar 3.12.

![Gambar 3.12 Desain antarmuka Transaction Page](images/gambar-3.12.png)

**Gambar 3.12 Desain antarmuka Transaction Page**

#### 3.3.5.3. Halaman Pindai Transaksi (OCR)

Halaman scan transaksi merupakan fitur utama yang membedakan Duomeco dari aplikasi pencatatan keuangan konvensional. Pada halaman ini, pengguna dapat mengunggah foto struk belanja melalui area drag-and-drop yang tersedia. Setelah gambar diunggah, pengguna menekan tombol Generate dari Gambar untuk memulai proses OCR menggunakan PaddleOCR. Sistem kemudian mengekstrak teks dari gambar secara otomatis dan memetakan hasilnya ke dalam form transaksi. Hasil pemetaan ditampilkan dalam sebuah modal yang memungkinkan pengguna untuk meninjau dan menyesuaikan data sebelum disimpan. Di bagian bawah halaman terdapat tabel riwayat transaksi yang memuat daftar seluruh transaksi yang telah tersimpan sebelumnya. Desain antarmuka halaman pindai transaksi dapat dilihat pada gambar 3.13.

![Gambar 3.13 Desain antarmuka Scan Transaction Page](images/gambar-3.13.png)

**Gambar 3.13 Desain antarmuka Scan Transaction Page**

## 3.4. Tahapan Analisis Data

Analisis data pada penelitian ini dilakukan untuk mengevaluasi performa ketiga library OCR secara kuantitatif sekaligus menguji kelayakan sistem yang dikembangkan. Analisis data mencakup empat hal, yaitu pemahaman cara kerja algoritma OCR dalam mengonversikan gambar menjadi teks (termasuk pengajuan model OCR yang akan dipakai), cara metrik CER dan WER menghitung tingkat kesalahan, skenario pengujian UAT, serta pengujian uji beban untuk mengukur response time sistem.

### 3.4.1. Ekstraksi dari Gambar Menggunakan OCR

Gambar 3.14 menunjukkan diagram alur tahapan analisis data yang menggambarkan proses evaluasi ketiga library OCR dari input gambar struk belanja hingga diperoleh hasil perbandingan performa sebagai dasar pemilihan library terbaik untuk sistem Duomeco.

![Gambar 3.14 Diagram analisis pemilihan library](images/gambar-3.14.png)

**Gambar 3.14 Diagram analisis pemilihan library**

Berdasarkan gambar diagram 3.14, setelah masing-masing library menyelesaikan proses internalnya, ketiga alur menyatu kembali pada tahap evaluasi. Output teks prediksi yang dihasilkan oleh Tesseract OCR, EasyOCR, dan PaddleOCR dibandingkan terhadap ground truth dataset SROIE untuk mengukur tingkat kesalahan yang dihasilkan. Proses evaluasi ini dilakukan pada dua kondisi input sekaligus, yaitu kondisi raw dan preprocessed, serta dengan dua konfigurasi berbeda yaitu sebelum dan sesudah optimasi hyperparameter, sehingga perbandingan yang dihasilkan mencakup berbagai skenario secara menyeluruh. Hasil evaluasi dari seluruh skenario tersebut kemudian digunakan sebagai dasar perbandingan antar library OCR secara komprehensif. Library yang menghasilkan nilai CER dan WER terendah serta time computation yang efisien akan dipilih sebagai library terbaik untuk diimplementasikan pada sistem pencatatan keuangan otomatis Duomeco.

#### 3.4.1.1. Library yang Diusulkan (PaddleOCR)

Library OCR yang diusulkan untuk diintegrasikan ke dalam sistem Duomeco adalah PaddleOCR dengan versi PP-OCRv5 mobile, yaitu varian ringan terbaru dari PaddleOCR yang dikembangkan oleh Baidu PaddlePaddle. Model ini dirancang untuk menghasilkan performa tinggi dalam pengenalan teks pada berbagai kondisi gambar dengan tetap mempertahankan efisiensi komputasi yang cocok untuk perangkat dengan sumber daya terbatas. PaddleOCR diusulkan dalam kondisi base model, artinya bobot model yang dipakai adalah bobot pretrained bawaan tanpa modifikasi tambahan. Pemilihan PaddleOCR didasarkan pada hasil evaluasi komparatif yang menunjukkan bahwa PaddleOCR menghasilkan nilai CER dan WER terendah dibandingkan Tesseract OCR dan EasyOCR pada dataset SROIE.

Secara internal, PaddleOCR akan memproses gambar struk melalui beberapa tahapan pipeline yang berlangsung secara berurutan hingga menghasilkan teks prediksi akhir. Alur pipeline tersebut dapat dilihat pada Gambar 3.15 berikut.

![Gambar 3.15 Flow diagram pipeline PaddleOCR](images/gambar-3.15.png)

**Gambar 3.15 Flow diagram pipeline PaddleOCR**

Berdasarkan Gambar 3.15, pipeline PaddleOCR terdiri dari lima tahapan utama yang dijalankan secara berurutan, yaitu text detection, text direction classification, feature extraction, text recognition, dan output teks prediksi. Berikut adalah penjelasan masing-masing tahapan tersebut.

1. **Preprocessing**

   Sebelum gambar memasuki tahap deteksi teks, PaddleOCR secara otomatis melakukan serangkaian preprocessing internal terhadap gambar masukan. Pertama, gambar di-resize ke dimensi yang sesuai dengan kebutuhan model deteksi agar ukuran gambar konsisten dan tidak melebihi batas maksimum yang dapat diproses. Kedua, nilai piksel gambar dinormalisasi ke rentang tertentu untuk menstabilkan distribusi nilai masukan sehingga proses pada model nantinya menjadi lebih stabil. Ketiga, color space gambar dikonversi dari BGR ke RGB karena model PaddleOCR dirancang untuk menerima gambar dalam format RGB, sementara OpenCV yang digunakan secara internal oleh PaddleOCR (untuk membaca gambar) menghasilkan format BGR sebagai konvensi bawaannya. Ketiga langkah ini terjadi secara otomatis di dalam engine PaddleOCR tanpa memerlukan intervensi dari sisi pengguna.

2. **Text Detection (Differentiable Binarization)**

   Tahap kedua adalah pendeteksian lokasi teks dalam gambar menggunakan algoritma DB (Differentiable Binarization). Model deteksi akan menghasilkan probability map, yaitu representasi pixel-level yang menunjukkan seberapa besar kemungkinan setiap piksel merupakan bagian dari area teks. Berbeda dengan metode binerisasi konvensional yang menggunakan nilai ambang batas statis, algoritma DB melakukan proses binerisasi menggunakan ambang batas adaptif yang dapat dipelajari secara otomatis bersama jaringan saraf tiruan secara end-to-end [58]. Pendekatan ini memungkinkan model menghasilkan bounding box yang lebih presisi bahkan pada kondisi teks yang miring, melengkung, atau memiliki kontras rendah seperti yang umum ditemukan pada struk belanja. Keluaran dari tahap ini adalah sekumpulan koordinat bounding box yang melingkupi setiap area teks yang terdeteksi pada gambar struk belanja.

3. **Text Direction Classification**

   Setelah koordinat bounding box diperoleh, setiap area teks di-crop dari gambar asli berdasarkan koordinat tersebut. Masing-masing crop kemudian dianalisis orientasinya oleh model klasifikasi arah teks (text direction classifier). Model ini bertugas mendeteksi apakah teks berada dalam posisi tegak normal (0°) atau terbalik (180°), lalu melakukan koreksi rotasi secara otomatis sebelum crop diteruskan ke tahap berikutnya. Tahap ini penting untuk memastikan model pengenalan karakter menerima masukan dalam orientasi yang konsisten sehingga akurasi pengenalan tidak terdegradasi akibat variasi orientasi teks pada gambar struk belanja.

4. **Feature Extraction**

   Setiap crop teks yang telah dikoreksi orientasinya selanjutnya akan diekstraksi fitur visualnya menggunakan backbone CNN berbasis PP-LCNet (PaddlePaddle Light CNN). PP-LCNet merupakan arsitektur CNN ringan yang dirancang untuk menghasilkan representasi fitur visual yang kaya dengan biaya komputasi yang rendah. Pada tahap ini, gambar crop diubah menjadi representasi fitur berdimensi tinggi yang menangkap informasi bentuk, tekstur, dan pola karakter secara hierarkis dari piksel mentah sebagai bekal bagi model pengenalan pada tahap berikutnya.

5. **Text Recognition**

   Fitur visual yang dihasilkan PP-LCNet kemudian akan diproses oleh model pengenalan karakter menggunakan arsitektur SVTR-LCNet, yaitu gabungan antara Spatial Visual Transformer (SVTR) dan PP-LCNet. SVTR berperan dalam menangkap hubungan kontekstual antar karakter secara global melalui mekanisme self-attention, sehingga model dapat memahami urutan karakter secara keseluruhan dan tidak hanya mengenali setiap karakter secara terisolasi. Keluaran SVTR-LCNet berupa matriks probabilitas karakter untuk setiap langkah waktu yang kemudian akan di-decode menggunakan metode CTC (Connectionist Temporal Classification). CTC dirancang khusus untuk permasalahan pengenalan sekuensial di mana penyelarasan antara masukan dan label target tidak diketahui secara eksplisit, dengan cara memetakan seluruh kemungkinan jalur karakter menjadi teks prediksi yang paling mungkin tanpa memerlukan segmentasi karakter secara eksplisit [59]. Dalam praktiknya, decoding dilakukan menggunakan greedy decoder yang memilih karakter dengan probabilitas tertinggi pada setiap langkah waktu, kemudian menghapus karakter duplikat berurutan dan simbol blank untuk menghasilkan teks prediksi akhir.

6. **Output Teks Prediksi**

   Setelah seluruh crop teks selesai diproses, PaddleOCR akan menghasilkan output akhir berupa kumpulan pasangan koordinat bounding box, teks prediksi, dan confidence score untuk setiap baris teks yang terdeteksi. Confidence score mencerminkan tingkat keyakinan model terhadap hasil pengenalan karakter yang dihasilkan. Dalam konteks sistem informasi Duomeco, output teks inilah yang selanjutnya akan diteruskan ke tahap pemetaan menggunakan regex untuk mengekstrak informasi spesifik dari struk belanja, yaitu nama toko, tanggal transaksi, dan total harga, sebelum disimpan ke dalam basis data.

### 3.4.2. Ilustrasi Perhitungan Metrik CER dan WER

Untuk memahami cara CER menghitung error, perhatikan ilustrasi berikut menggunakan contoh data tanggal yang umum ditemukan pada struk belanja. Ground truth yang diharapkan adalah "25/03/2026", sedangkan teks yang dihasilkan OCR adalah "25/0820265".

![Gambar 3.16 Ilustrasi perhitungan CER pada data tanggal struk](images/gambar-3.16.png)

**Gambar 3.16 Ilustrasi perhitungan CER pada data tanggal struk**

Berdasarkan gambar ilustrasi 3.16, terdapat tiga jenis kesalahan yang teridentifikasi. Pertama, karakter "3" terbaca sebagai "8" oleh OCR sehingga dikategorikan sebagai substitution (S=1). Kedua, karakter "/" setelah angka "0" tidak terbaca sama sekali sehingga dikategorikan sebagai deletion (D=1). Ketiga, karakter "5" muncul di akhir teks hasil prediksi padahal tidak ada pada ground truth, sehingga dikategorikan sebagai insertion (I=1). Dengan demikian, nilai CER dihitung menggunakan rumus berikut.

$$CER = \frac{S + I + D}{N} = \frac{1 + 1 + 1}{10} = 0,3$$

N adalah total karakter pada ground truth yaitu 10 karakter. Nilai CER sebesar 0,3 karakter yang mengalami kesalahan dari keseluruhan karakter referensi. Semakin rendah nilai CER, semakin baik performa library OCR dalam mengenali teks pada gambar struk belanja.

Berbeda dengan CER yang menghitung kesalahan pada level karakter, WER menghitung kesalahan pada level kata. Perhatikan ilustrasi berikut menggunakan contoh data yang umum ditemukan pada struk belanja, yaitu nama toko, label total, dan nominal harga.

![Gambar 3.17 Ilustrasi perhitungan WER pada data struk](images/gambar-3.17.png)

**Gambar 3.17 Ilustrasi perhitungan WER pada data struk**

Berdasarkan gambar ilustrasi 3.17, ground truth terdiri dari empat kata yaitu "Indomaret", "Total", "Rp15.000", dan "Tunai", sedangkan hasil prediksi OCR menghasilkan empat kata yaitu "Indom4ret", "Rp15.000", "Tunai", dan "Terima". Terdapat tiga jenis kesalahan yang teridentifikasi. Pertama, kata "Indomaret" terbaca sebagai "Indom4ret" sehingga dikategorikan sebagai substitution (S=1). Kedua, kata "Total" tidak terbaca sama sekali oleh OCR sehingga dikategorikan sebagai deletion (D=1). Ketiga, kata "Terima" muncul di posisi akhir sebagai kata tambahan yang tidak ada pada ground truth sehingga dikategorikan sebagai insertion (I=1). Dengan demikian, nilai WER dihitung menggunakan rumus berikut.

$$WER = \frac{S + I + D}{N} = \frac{1 + 1 + 1}{4} = 0,75$$

N adalah total kata pada ground truth yaitu 4 kata. Nilai WER sebesar 0,75 menunjukkan bahwa tiga dari empat kata mengalami kesalahan, meskipun secara karakter sebagian besar teks sudah terbaca dengan benar. Hal ini menunjukkan bahwa WER cenderung lebih sensitif dibandingkan CER karena satu karakter yang salah pada sebuah kata sudah cukup untuk menjadikan seluruh kata tersebut dihitung sebagai kesalahan. Semakin rendah nilai WER, semakin baik performa library OCR dalam mengenali teks pada gambar struk belanja.

### 3.4.3. User Acceptance Testing (UAT)

Pengujian UAT dilakukan untuk memvalidasi bahwa sistem Duomeco telah memenuhi kebutuhan dan ekspektasi pengguna UMKM secara fungsional. Kuesioner UAT disusun berdasarkan empat karakteristik kualitas perangkat lunak yang mengacu pada standar ISO/IEC 25010:2023 [60], yaitu functional suitability, reliability, interaction capability, dan performance efficiency. Pemilihan keempat karakteristik tersebut didasarkan pada relevansinya dengan konteks sistem pencatatan keuangan berbasis web yang diuji oleh pengguna akhir UMKM. Penilaian menggunakan skala Likert 1-5, di mana nilai 1 berarti sangat tidak setuju dan nilai 5 berarti sangat setuju. Daftar pertanyaan kuesioner UAT yang digunakan disajikan pada Tabel 3.5.

**Tabel 3.5 Daftar Pertanyaan kuesioner UAT sistem Duomeco**

| No | Pernyataan | Karakteristik ISO/IEC |
|----|-----------|------------------------|
| 1 | Fitur-fitur yang tersedia pada sistem sudah lengkap dan sesuai dengan kebutuhan pencatatan keuangan usaha saya | Functional suitability (functional completeness) |
| 2 | Proses pencatatan transaksi secara manual melalui website dapat dilakukan dengan mudah dan menghasilkan data yang benar | Functional suitability (functional correctness) |
| 3 | Fitur unggah foto struk belanja untuk mengekstrak data transaksi secara otomatis berfungsi sesuai tujuannya | Functional suitability (functional appropriateness) |
| 4 | Pencatatan transaksi melalui Telegram Bot dapat dilakukan dengan mudah dan hasilnya sesuai | Functional suitability (functional correctness) |
| 5 | Hasil ekstraksi dari foto struk belanja sudah cukup akurat dan sesuai dengan data pada struk belanja | Reliability |
| 6 | Sistem berjalan dengan stabil dan tidak mengalami gangguan selama digunakan | Reliability |
| 7 | Tampilan antarmuka sistem mudah dipahami dan saya dapat mengenali fungsi-fungsinya dengan cepat | Interaction capability (appropriateness recognizability) |
| 8 | Saya dapat mempelajari cara menggunakan sistem ini dengan cepat tanpa panduan yang rumit | Interaction capability (learnability) |
| 9 | Sistem merespons setiap tindakan yang saya lakukan dengan cepat | Performance efficiency (time behaviour) |
| 10 | Secara keseluruhan, saya puas dengan sistem Duomeco dan bersedia menggunakannya untuk kebutuhan usaha saya | Interaction capability (user engagement) |

### 3.4.4. Pengujian Performa Telegram Bot (Uji Beban)

Pengujian beban dilakukan untuk mengukur kemampuan sistem dalam merespons permintaan pengguna melalui Telegram Bot di bawah kondisi penggunaan nyata. Metrik yang digunakan dalam pengujian ini adalah response time secara end-to-end, yaitu jeda waktu yang diukur mulai dari pengguna mengirimkan pesan atau gambar struk melalui Telegram Bot hingga sistem mengembalikan hasil balasan.

Pengukuran dilakukan sebanyak 30 kali percobaan menggunakan gambar struk belanja yang berbeda-beda. Jumlah pengulangan ini mengacu pada syarat minimum sampel berdasarkan Central Limit Theorem yang menyatakan bahwa distribusi rata-rata sampel akan mendekati distribusi normal apabila ukuran sampel n ≥ 30 [61]. Dari hasil pengukuran tersebut dihitung nilai rata-rata (mean), nilai minimum, dan nilai maksimum response time dalam satuan detik sebagai hasil akhir pengujian.
