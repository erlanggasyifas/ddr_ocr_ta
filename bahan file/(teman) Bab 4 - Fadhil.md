> **Catatan:** File ini adalah hasil ekstraksi otomatis dari PDF (Bab IV, hlm. 69–131). Teks, tabel, dan gambar sudah dipisahkan agar mudah diedit, tetapi mohon dicek ulang terhadap PDF asli terutama untuk: tabel dengan header bertingkat (kolom bisa sedikit bergeser), rumus/persamaan matematis (mis. rumus persentase UAT), dan urutan gambar pada grafik yang terdiri dari beberapa panel berdampingan. Gambar disimpan di folder `images/` dan dirujuk dengan path relatif.

# BAB IV
## HASIL DAN PEMBAHASAN

### 4.1. Extract, Transform, Load Dataset SROIE

Sebelum dilakukan evaluasi performa library OCR, dataset yang digunakan perlu dipahami dan diproses terlebih dahulu. Dataset yang digunakan dalam penelitian ini adalah ICDAR2019-SROIE (Scanned Receipts OCR and Information Extraction) yang diperoleh dari Hugging Face dengan identifier ‘jsdnrs/ICDAR2019-SROIE’. Dataset ini merupakan benchmark standar untuk domain struk belanja yang berisi gambar struk beserta anotasi teks per baris dalam format bounding box. Dataset SROIE terdiri dari dua split, yaitu train (626 gambar) dan test (361 gambar). Setiap baris pada dataset merepresentasikan satu gambar struk yang memuat enam kolom: image (objek gambar), key (unique identifier), image_size (dimensi gambar), entities (informasi entitas seperti company, address, date, dan total), words (daftar teks per baris), dan bboxes (daftar koordinat bounding box per baris). Contoh gambar struk belanja pada dataset SROIE dapat dilihat pada Gambar 4.1.

![gambar_88_1.png](images/gambar_88_1.png)

Gambar 4.1 Contoh gambar struk belanja dan visualisasi bounding box pada dataset SROIE Proses persiapan data dimulai dengan tahap Extract, yaitu mengunduh dataset dari Hugging Face menggunakan library ‘datasets’. Berikut potongan kode untuk proses load dataset SROIE.

![gambar_88_2.png](images/gambar_88_2.png)

Gambar 4.2 Load dataset SROIE

Selanjutnya pada tahap Transform, ground truth setiap sampel dibentuk dengan menggabungkan seluruh kata pada kolom words menjadi satu string per struk belanja. Selain itu, disiapkan dua kondisi input gambar untuk keperluan evaluasi, yaitu gambar raw (tanpa preprocessing) dan gambar preprocessed yang telah dikonversi ke grayscale serta diterapkan adaptive thresholding menggunakan OpenCV. Kedua kondisi input tersebut digunakan secara identik pada ketiga library OCR sehingga perbandingan performa yang dihasilkan bersifat objektif dan adil. Tahap akhir adalah Load, di mana dataset yang telah disiapkan dimuat ke dalam environment development dan siap digunakan untuk proses evaluasi. Pada penelitian ini, evaluasi performa dilakukan menggunakan split test yang bersifat identik untuk ketiga library OCR, sehingga tidak ada perbedaan input antar library yang dapat mempengaruhi hasil perbandingan. Rincian jumlah data yang digunakan dalam evaluasi dapat dilihat pada Tabel 4.2 berikut. Tabel 4.2 Rincian dataset hasil persiapan

| Split | Jumlah Gambar struk | Jumlah Gambar struk |
| --- | --- | --- |
| Train | Tidak digunakan (tersedia sebagai referensi dataset) | 626 |
| Test | Digunakan untuk evaluasi performa ketiga library OCR | 361 |
| Total |  | 987 |

### 4.2. Performa Library OCR dan Pemilihan Konfigurasi Terbaik

Pada sub bab ini akan dibahas evaluasi performa dari tiga library OCR yang diteliti, yaitu Tesseract OCR, EasyOCR, dan PaddleOCR. Evaluasi dilakukan secara bertahap mulai dari performa base model, pengaruh preprocessing, pengaruh fine-tuning, optimasi dengan hyperparameter tuning, hingga pemilihan konfigurasi terbaik untuk masing-masing library OCR. Setiap tahapan evaluasi menggunakan metrik CER dan WER yang dihitung dengan membandingkan hasil OCR terhadap

ground truth dataset SROIE serta tak lupa pula terdapat metrik sekunder, yakni time computation.

#### 4.2.1. Performa Base Model Library OCR

Tahap pertama evaluasi adalah mengukur performa base model (model bawaan tanpa modifikasi) dari masing-masing library OCR. Pengukuran ini bertujuan untuk mengetahui kemampuan awal setiap library dalam mengenali teks pada gambar struk belanja sebelum dilakukan intervensi apapun seperti preprocessing maupun fine-tuning. Konfigurasi yang digunakan pada tahap ini adalah konfigurasi default dari masing-masing library, yaitu Tesseract dengan OEM 3 (BiLSTM engine) dan PSM 6 (single block of text) menggunakan language pack ‘ind+eng’, EasyOCR dengan parameter ‘paragraph=True’ dan model bahasa Indonesia + Inggris, dan PaddleOCR dengan versi PP-OCRv5 mobile untuk bahasa Inggris. Evaluasi dilakukan terhadap seluruh 361 sampel pada split test dataset SROIE menggunakan gambar asli tanpa preprocessing. Hasil evaluasi base model disajikan pada Tabel 4.3 berikut. Tabel 4.3 Hasil evaluasi base model

| Library OCR | Mean CER |  | Mean WER |  | Mean Time (s/gambar) |  |
| --- | --- | --- | --- | --- | --- | --- |
| Tesseract OCR | 0,3044 |  | 0,5623 |  | 0,652 |  |
| EasyOCR | 0,3121 |  | 0,6328 |  | 0,417 |  |
| PaddleOCR |  | 0,2128 |  | 0,3272 |  | 0,368 |

Berdasarkan Tabel 4.3, PaddleOCR mencatatkan performa terbaik dengan Mean CER terendah sebesar 0,2128 dan Mean WER sebesar 0,3272, diikuti Tesseract OCR dengan Mean CER 0,3044 dan EasyOCR dengan Mean CER 0,3121. Dari sisi waktu komputasi, PaddleOCR juga menjadi yang tercepat dengan rata-rata 0,368 detik per gambar, diikuti EasyOCR sebesar 0,417 detik dan Tesseract OCR sebesar 0,652 detik. Perbandingan visual performa ketiga library dapat dilihat pada Gambar 4.3.

![gambar_91_3.png](images/gambar_91_3.png)

![gambar_91_4.png](images/gambar_91_4.png)

![gambar_91_5.png](images/gambar_91_5.png)

Gambar 4.3 Diagram batang perbandingan base model libraries Gambar 4.3 memperlihatkan bahwa kesenjangan performa antar library lebih mencolok pada metrik WER dibandingkan CER. Hal ini menunjukkan bahwa meskipun sebagian besar karakter berhasil dikenali dengan benar, kesalahan pada

satu atau beberapa karakter dalam sebuah kata sudah cukup untuk menjadikan seluruh kata tersebut salah fenomena yang umum terjadi pada domain struk belanja yang memiliki banyak kata pendek, singkatan, dan kode numerik seperti nomor telepon, nomor registrasi, serta harga. Secara keseluruhan, hasil evaluasi base model menunjukkan bahwa tanpa modifikasi apapun, PaddleOCR memiliki kemampuan pengenalan teks terbaik pada domain struk belanja dengan keunggulan yang cukup signifikan dibandingkan Tesseract OCR maupun EasyOCR, baik dari sisi akurasi maupun efisiensi waktu komputasi.

#### 4.2.2. Pengaruh Preprocessing terhadap Performa OCR

Tahap kedua evaluasi bertujuan untuk mengukur pengaruh preprocessing citra terhadap performa pengenalan teks pada masing-masing library OCR. Preprocessing yang diterapkan terdiri dari dua tahap, yaitu konversi gambar ke grayscale dan adaptive thresholding menggunakan metode Gaussian (penghitungan ambang batas lokal berdasarkan rata-rata tertimbang piksel di sekitarnya). Penerapan preprocessing ini didasarkan pada pertimbangan bahwa gambar struk belanja pada dataset SROIE merupakan hasil pemotretan dengan kondisi pencahayaan yang tidak seragam, di mana variasi pencahayaan lokal antarbagian gambar seperti bagian tengah struk yang cenderung lebih terang dibandingkan bagian tepi dapat menurunkan keterbacaan teks oleh model OCR. Preprocessing yang diterapkan terdiri dari dua tahap, yaitu konversi gambar ke grayscale dan adaptive thresholding menggunakan metode Gaussian. Konversi ke grayscale dilakukan sebagai langkah awal untuk menyederhanakan dimensi data citra sehingga mengurangi variasi yang tidak relevan dan mempermudah proses analisis pada tahap berikutnya tanpa menghilangkan informasi penting [56]. Selanjutnya, adaptive thresholding dipilih berdasarkan bukti penelitian bahwa metode global thresholding tidak mampu menangani variasi pencahayaan lokal pada gambar dokumen hasil pemotretan, sementara adaptive thresholding terbukti menghasilkan akurasi OCR yang lebih tinggi pada kondisi pencahayaan tidak merata [57]. Hal ini relevan dengan karakteristik gambar struk belanja pada dataset SROIE yang merupakan hasil pemotretan di berbagai kondisi pencahayaan, di mana

bagian tengah struk cenderung lebih terang dibandingkan bagian tepi akibat proses pemotretan, sehingga adaptive thresholding dipilih sebagai teknik yang paling sesuai. Hasil perbandingan performa base model tanpa preprocessing dan dengan preprocessing disajikan pada Tabel 4.4 berikut. Tabel 4.4 Performa base model OCR: raw vs preprocessed dataset

| Library OCR | Mode | Mean CER |  | Mean WER |  | Mean Time (s/gambar) |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Tesseract OCR | Raw | 0,3044 |  | 0,5623 |  | 0,652 |  |
| Tesseract OCR | Preprocesse d | 0,3654 |  | 0 , 7502 |  | 0,617 |  |
| EasyOCR | Raw | 0,3121 |  | 0,6328 |  | 0,417 |  |
| EasyOCR | Preprocesse d | 0,3299 |  | 0 , 6501 |  | 0,412 |  |
| PaddleOCR | Raw |  | 0,2128 |  | 0,3272 |  | 0,368 |
| PaddleOCR | Preprocesse d | 0,2321 |  | 0 ,3780 |  | 0,353 |  |

Berdasarkan Tabel 4.4, hasil eksperimen menunjukkan temuan yang berlawanan dengan hipotesis awal: preprocessing justru menurunkan performa pada ketiga library OCR tanpa terkecuali. Tesseract OCR mengalami degradasi paling besar, dengan Mean WER meningkat dari 0,5623 menjadi 0,7502. EasyOCR mengalami degradasi paling kecil namun tetap konsisten, dengan Mean CER naik dari 0,3121 menjadi 0,3299. PaddleOCR mengalami degradasi yang relatif kecil pada CER, dengan peningkatan dari 0,2128 menjadi 0,2321. Perbandingan visual dampak preprocessing terhadap CER, WER, dan time computation ketiga library dapat dilihat pada Gambar 4.4 berikut.

![gambar_94_6.png](images/gambar_94_6.png)

![gambar_94_7.png](images/gambar_94_7.png)

![gambar_94_8.png](images/gambar_94_8.png)

Gambar 4.4 Diagram batang perbandingan mode dataset raw dan preprocessed tiga library OCR

Berdasarkan Gambar 4.4, terlihat bahwa batang preprocessed secara konsisten lebih tinggi dibandingkan batang raw pada semua library, yang mengonfirmasi bahwa preprocessing tidak memberikan dampak positif. Degradasi ini dapat dijelaskan oleh beberapa faktor. Pertama, gambar-gambar struk dalam dataset SROIE umumnya sudah memiliki kontras yang cukup tinggi antara teks dan latar belakang, sehingga adaptive thresholding tidak memberikan manfaat tambahan. Kedua, proses binarization menghilangkan informasi gradasi abu-abu pada tepi karakter yang justru penting bagi model deep learning seperti EasyOCR dan PaddleOCR untuk ekstraksi fitur visual. Ketiga, adaptive thresholding pada area dengan variasi pencahayaan rendah dapat menghasilkan noise yang mengganggu proses deteksi teks. Dari perspektif arsitektur, Tesseract OCR telah memiliki adaptive thresholding internal bawaan Leptonica, sehingga penambahan preprocessing eksternal menghasilkan double binarization yang merusak kualitas citra. PaddleOCR dan EasyOCR yang berbasis CNN dirancang untuk menerima gambar dengan informasi visual lengkap, sehingga binarization manual justru mengurangi kekayaan fitur yang tersedia. Berdasarkan hasil evaluasi ini, dapat disimpulkan bahwa preprocessing berupa grayscale dan adaptive thresholding tidak efektif untuk meningkatkan performa OCR pada dataset SROIE, meskipun sedikit mempercepat waktu komputasi akibat berkurangnya kompleksitas gambar setelah binarization.

#### 4.2.3. Pengaruh Hyperparameter Tuning

Tahap selanjutnya adalah melakukan optimasi performa melalui hyperparameter tuning pada masing-masing library OCR. Tahap ini berfokus pada penyesuaian ambang batas (threshold) yang menentukan sejauh mana suatu area pada gambar dianggap mengandung teks. Meskipun penamaan hyperparameter pada masing-masing library berbeda-beda, ketiganya mengontrol sensitivitas yang sama. Hal ini penting karena, nilai yang terlalu tinggi berisiko melewatkan wilayah teks, sementara nilai yang terlalu rendah memunculkan deteksi yang keliru [62]. Dengan menyamakan fokus tuning pada parameter berperan serupa, perbandingan antara ketiga library tetap bersifat adil dan setara.

Hyperparameter tuning dilakukan menggunakan metode grid search, yaitu pencarian sistematis terhadap seluruh kombinasi nilai parameter yang telah ditentukan, kemudian memilih kombinasi yang menghasilkan CER, WER, dan time computation terendah. Perlu dicatat bahwa optimasi ini bukan merupakan proses pelatihan ulang model (fine-tuning), melainkan pencarian konfigurasi terbaik pada base model yang ada. Seluruh eksperimen tuning dilakukan menggunakan gambar asli tanpa preprocessing berdasarkan hasil evaluasi pada subbab 4.2.2.

##### 4.2.3.1. Tesseract OCR

Hyperparameter yang di-tuning pada Tesseract adalah Page Segmentation Mode (PSM), yaitu parameter yang menentukan cara Tesseract melakukan segmentasi layout halaman sebelum proses pengenalan teks. Parameter ini sangat berpengaruh pada bagaimana engine menginterpretasikan struktur dokumen, apakah sebagai satu blok teks utuh, beberapa kolom terpisah, atau teks yang tersebar. Parameter lainnya, yaitu OEM (OCR Engine Mode) ditetapkan pada nilai 3 (BiLSTM engine) dan language pack ‘ind+eng’ sebagai konfigurasi tetap. Percobaan dilakukan terhadap lima nilai PSM yang relevan untuk domain struk belanja. Hasil tuning Tesseract disajikan pada Tabel 4.5 berikut. Tabel 4.5 Hasil grid search Tesseract

| Hyperparameter | Mean CER |  | Mean WER |  | Mean Time (s/gambar) |  |
| --- | --- | --- | --- | --- | --- | --- |
| PSM 3 = Auto (default) | 0,3319 |  |  | 0,5497 | 0,638 |  |
| PSM 4 = Single column | 0,3372 |  | 0,5529 |  |  | 0,636 |
| PSM 6 = Single block |  | 0,3044 | 0,5623 |  | 0,647 |  |
| PSM 11 = Sparse text | 0,4388 |  | 0,7593 |  | 0,704 |  |
| PSM 12 = Sparse text + OSD | 0,4428 |  | 0,7722 |  | 0,839 |  |

Berdasarkan Tabel 4.5, PSM 6 (single block of text) menghasilkan Mean CER terendah sebesar 0,3044, mengungguli konfigurasi default PSM 3 (auto) yang memiliki CER 0,3319. Perbedaan ini menunjukkan bahwa perlakuan struk belanja sebagai satu blok teks tunggal lebih efektif dibandingkan membiarkan Tesseract

mendeteksi layout secara otomatis, karena struk belanja umumnya memiliki format kolom tunggal dengan teks berurutan dari atas ke bawah. Mode PSM 11 dan 12 (sparse text) justru menghasilkan performa terburuk dengan CER di atas 0,43, karena mode ini dirancang untuk teks yang tersebar acak pada dokumen, bukan teks yang terstruktur secara berurutan seperti pada struk belanja. Perbedaan waktu komputasi antar PSM relatif kecil (0,636-0,839 detik), kecuali PSM 12 yang sedikit lebih lambat karena melakukan orientation and script detection (OSD) tambahan.

##### 4.2.3.2. EasyOCR

Hyperparameter tuning pada EasyOCR dilakukan terhadap empat parameter sekaligus menggunakan grid search dengan total 16 kombinasi. Parameter yang di-tuning meliputi ‘paragraph’ yang mengontrol apakah hasil deteksi digabungkan menjadi paragraf, ‘contrast_ths’ yang menentukan ambang batas kontras untuk memisahkan teks dari latar belakang, ‘text_threshold’ yang mengatur tingkat confidence minimum agar suatu area dianggap mengandung teks, dan ‘low_text’ yang mengontrol ambang batas untuk mendeteksi area teks dengan confidence rendah. Rentang nilai yang diujikan untuk masing-masing parameter adalah ‘paragraph=[True, False]’, ‘contrast_ths=[0,1, 0,3]’, ‘text_threshold=[0,5, 0,7]’, dan ‘low_text=[0,3, 0,5]’. Lima konfigurasi terbaik dari hasil grid search disajikan pada Tabel 4.6 berikut. Tabel 4.6 Lima konfigurasi terbaik hasil grid search EasyOCR

| No | Hyperparameter paragraph | contrast_ ths | text_ threshold | low_ text | Mean CER |  | Mean WER |  | Mean Time (s/ gambar) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | False | 0,3 | 0,7 | 0,3 |  | 0,2779 |  | 0,5908 | 0,407 |  |
| 2 | False | 0,1 | 0,7 | 0,3 | 0,2789 |  | 0,5939 |  |  | 0,387 |
| 3 | False | 0,3 | 0,5 | 0,3 | 0,2820 |  | 0,6000 |  | 0,419 |  |
| 4 | False | 0,1 | 0,5 | 0,3 | 0,2830 |  | 0,6034 |  | 0,397 |  |
| 5 | False | 0,3 | 0,7 | 0,5 | 0,2933 |  | 0,6449 |  | 0,469 |  |

Berdasarkan Tabel 4.6, konfigurasi terbaik EasyOCR adalah ‘paragraph=False’, ‘contrast_ths=0,3', ‘text_threshold=0,7', dan ‘low_text=0,3' dengan Mean CER sebesar 0,2779. Dari 16 kombinasi yang diujikan, terdapat dua pola yang konsisten. Pertama, seluruh lima konfigurasi terbaik menggunakan ‘paragraph=False’, yang menunjukkan bahwa mengembalikan hasil deteksi per baris individual lebih akurat dibandingkan menggabungkannya menjadi paragraf. Penggabungan paragraf cenderung mencampurkan baris-baris teks yang berdekatan secara spasial namun secara semantik terpisah, seperti baris nama item dan baris harga yang berada bersebelahan pada struk belanja. Kedua, nilai ‘low_text=0,3' secara konsisten mengungguli ‘low_text=0,5’, yang berarti ambang batas deteksi teks yang lebih rendah membantu menangkap lebih banyak area teks yang mungkin memiliki confidence rendah, seperti teks kecil pada bagian bawah struk atau angka dengan kontras rendah.

##### 4.2.3.3. PaddleOCR

Hyperparameter tuning pada PaddleOCR dilakukan terhadap tiga parameter melalui grid search dengan total 8 kombinasi. Parameter yang di-tuning mencakup ‘text_det_thresh’ yang mengatur ambang batas confidence pada tahap deteksi teks, ‘text_det_box_thresh’ yang menentukan ambang batas score untuk memfilter bounding box hasil deteksi, dan ‘text_rec_score_thresh’ yang mengontrol ambang batas confidence minimum pada tahap pengenalan teks. Rentang nilai yang diujikan adalah ‘text_det_thresh=[0,3, 0.5]’, ‘text_det_box_thresh=[0.4, 0.6]’, dan ‘text_rec_score_thresh=[0,3, 0.5]’. Hasil seluruh 8 kombinasi grid search disajikan pada Tabel 4.7 berikut.

Tabel 4.7 Hasil grid search PaddleOCR

| No | 1 | Hyperparameter text_det_ thresh | 0,3 | text_det_ box_thresh | 0,6 | text_rec_ score_thresh | 0,5 | Mean CER | 0,2150 | Mean WER | 0,3299 | Mean Time (s/ gambar) | 0,314 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2 |  | 0,3 |  | 0,4 |  | 0,5 |  | 0,2151 |  | 0,3307 |  | 0,316 |  |
| 3 |  | 0,5 |  | 0,4 |  | 0,5 |  | 0,2151 |  | 0,3308 |  | 0,316 |  |
| 4 |  | 0,3 |  | 0,6 |  | 0,3 |  | 0,2152 |  | 0,3323 |  | 0,316 |  |
| 5 |  | 0,5 |  | 0,6 |  | 0,5 |  | 0,2152 |  | 0,3308 |  | 0,317 |  |
| 6 |  | 0,5 |  | 0,6 |  | 0,3 |  | 0,2155 |  | 0,3333 |  | 0,315 |  |
| 7 |  | 0,5 |  | 0,4 |  | 0,3 |  | 0,2157 |  | 0,3342 |  | 0,318 |  |
| 8 |  | 0,3 |  | 0,4 |  | 0,3 |  | 0,2158 |  | 0,3341 |  | 0,319 |  |

Berdasarkan Tabel 4.7, konfigurasi terbaik PaddleOCR adalah ‘text_det_thresh=0,3’, ‘text_det_box_thresh=0,6’, serta nilai ‘text_rec_score_thresh=0,5’ dengan Mean CER sebesar 0,2150. Temuan yang paling mencolok dari hasil grid search ini adalah sangat kecilnya variasi performa antar kombinasi. Selisih CER antara konfigurasi terbaik (0,2150) dan terburuk (0,2158) hanya sebesar 0,0008, yang menunjukkan bahwa PaddleOCR relatif tahan terhadap perubahan hyperparameter pada rentang yang diujikan. Meskipun demikian, terdapat pola bahwa ‘text_rec_score_thresh=0,5’ secara konsisten menghasilkan WER yang lebih rendah dibandingkan nilai 0,3. Hal ini mengindikasikan bahwa penetapan ambang batas confidence minimum sebesar 0,5 pada parameter ‘text_rec_score_thresh’ membantu mengeliminasi hasil pengenalan yang tidak diyakini model, sehingga mengurangi jumlah kata yang keliru pada output akhir.

#### 4.2.4. Hasil Akhir Model dan Pemilihan Konfigurasi Terbaik

Setelah melalui seluruh tahapan evaluasi yang meliputi pengujian base model, analisis pengaruh preprocessing, serta pengaruh hyperparameter melalui grid search, diperoleh konfigurasi terbaik dari masing-masing library OCR yang selanjutnya dibandingkan secara langsung. 1. Pada Tesseract, konfigurasi terbaik yang diperoleh dari grid search PSM adalah PSM 6 (single block) dengan OEM 3 dan language pack ‘ind+eng’, menghasilkan Mean CER sebesar 0,3044. 2. Pada EasyOCR, konfigurasi terbaik hasil grid search adalah ‘paragraph=False’, ‘contrast_ths=0,3', ‘text_threshold=0,7', dan ‘low_text=0,3' dengan Mean CER sebesar 0,2779. 3. Pada PaddleOCR tidak menunjukkan peningkatan performa melalui grid search, di mana konfigurasi default pada kondisi raw justru menghasilkan Mean CER terbaik sebesar 0,2128, lebih rendah dari seluruh 8 kombinasi grid search yang menghasilkan CER terendah 0,2150. Hal ini mengonfirmasi bahwa PaddleOCR sangat tahan terhadap variasi hyperparameter pada rentang yang diujikan, sehingga konfigurasi default-nya sudah optimal untuk domain struk belanja. Perlu dicatat bahwa pada seluruh tahapan evaluasi, kondisi raw (tanpa preprocessing) secara konsisten menghasilkan performa yang lebih baik dibandingkan kondisi preprocessed untuk ketiga library. Oleh karena itu, seluruh konfigurasi terbaik yang dipilih menggunakan gambar asli tanpa preprocessing sebagai masukan. Rekap hasil akhir dan konfigurasi terbaik masing-masing library disajikan pada Tabel 4.8 berikut. Tabel 4.8 Rekap hasil akhir dan konfigurasi terbaik setiap model OCR

| Library | Konfigurasi Terbaik | Mean CER | Mean WER | Rata-rata Waktu (s/gambar) |
| --- | --- | --- | --- | --- |
| Tesseract OCR | PSM 6 (single block), OEM 3, ind+eng | 0,3044 | 0,5623 | 0,652 |

| EasyOCR | PaddleOCR | paragraph=False, contrast_ths=0,3, text_threshold=0.7, low_text=0.3 | Konfigurasi default | 0,2779 | 0,2128 | 0,5907 | 0,3272 | 0,406 | 0,368 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

### 4.3. Pengembangan Sistem Pencatatan Keuangan Otomatis

Pada sub bab ini akan dibahas hasil pengembangan sistem pencatatan keuangan otomatis Duomeco yang terdiri dari tiga komponen utama, yaitu Application Programming Interface (API) sebagai backend server, Telegram Bot sebagai antarmuka pencatatan secara cepat, dan aplikasi web sebagai dashboard manajemen keuangan. Sistem ini dikembangkan menggunakan arsitektur client- server dengan pemisahan yang jelas antara backend dan frontend. Sistem finansial Duomeco bertujuan untuk membantu pelaku usaha kecil dalam mencatat transaksi keuangan secara otomatis melalui teknologi OCR. Dengan memanfaatkan OCR, pengguna cukup mengirimkan foto struk belanja melalui Telegram Bot, dan sistem akan secara otomatis mengekstrak informasi penting seperti nama toko, total pembayaran, tanggal transaksi, dan metode pembayaran. Data yang berhasil diekstrak kemudian disimpan ke dalam basis data dan dapat diakses melalui dashboard web. Pengembangan sistem ini menggunakan teknologi TypeScript secara end-to- end. Backend dikembangkan menggunakan Express.js dengan Prisma ORM untuk manajemen basis data MySQL, sedangkan frontend menggunakan Next.js dengan Tailwind CSS. Sementara fungsi OCR menggunakan library PaddleOCR yang telah dilaksanakan pemrosesan dan export model pada sub bab sebelumnya.

#### 4.3.1. Pengembangan API

API merupakan komponen backend dari sistem Duomeco yang dikembangkan menggunakan framework Express.js versi 5 dengan bahasa pemrograman TypeScript. Struktur proyek mengikuti pola layered architecture yang memisahkan tanggung jawab ke dalam lima lapisan utama, yaitu Handler

sebagai lapisan HTTP yang menerima request dan mengembalikan response, Service sebagai lapisan logika bisnis yang memuat aturan-aturan domain, Repository sebagai lapisan akses data yang berkomunikasi langsung dengan basis data melalui Prisma ORM, Gateway sebagai lapisan komunikasi dengan layanan eksternal (dalam hal ini Telegram Bot API), dan Entity sebagai definisi model domain yang menjadi kontrak data antar lapisan. Alur pemanggilan berjalan satu arah dari atas ke bawah: Handler memanggil Service, Service memanggil Repository atau Gateway, dan tidak sebaliknya. Titik masuk aplikasi didefinisikan pada berkas app.ts yang mengonfigurasi tiga middleware dasar: express.json() untuk mem-parsing body request dalam format JSON, CORS dengan konfigurasi credentials: true agar cookie dapat dikirim lintas domain antara frontend dan backend, serta cookie-parser untuk membaca cookie pada setiap request. Seluruh rute API dikelompokkan di bawah prefix ‘/api’ dan didistribusikan ke 10 modul router, yaitu auth, users, businesses, parties, assets, ocr, telegram, transactions, payments, dan dashboard. Potongan kode konfigurasi endpoint dapat dilihat pada gambar 4.1 dan 4.2.

![gambar_102_9.png](images/gambar_102_9.png)

Gambar 4.1 Potongan kode konfigurasi aplikasi Express.js pada file app.ts

![gambar_103_10.png](images/gambar_103_10.png)

Gambar 4.2 Potongan kode pendaftaran API route pada berkas routes.ts

##### 4.4.1.1. Modul Autentikasi dan Pengguna

Modul autentikasi menangani proses login dan logout pengguna. Pada saat login, Auth Service memverifikasi kredensial pengguna dengan mencocokkan username terhadap basis data dan memvalidasi password menggunakan bcrypt. Jika valid, sistem men-generate JSON Web Token (JWT) yang memuat payload berisi id, username, dan role pengguna dengan masa berlaku 1 hari. Token ini tidak hanya dikembalikan dalam body response, melainkan juga di-set sebagai HTTP-only cookie dengan nama ‘auth_token’. Penggunaan HTTP-only cookie dipilih agar token tidak dapat diakses oleh JavaScript di sisi klien. Potongan kode pada Auth Handler untuk endpoint login dapat dilihat pada gambar 4.3.

![gambar_103_11.png](images/gambar_103_11.png)

Gambar 4.3 Potongan kode Auth Handler proses login dan pengaturan HTTP-only cookie

##### 4.4.1.2. Modul Transaksi dan Pembayaran

Modul transaksi dan pembayaran merupakan inti dari sistem pencatatan keuangan. Kedua modul ini saling berkaitan erat setiap transaksi dapat memiliki satu atau lebih record pembayaran (relasi one-to-many), yang memungkinkan pencatatan pembayaran bertahap (cicilan) untuk transaksi berstatus partial. Kedua modul pula lah yang akan disediakan otomatisasinya melalui modul OCR yang akan dijelaskan pada poin selanjutnya. Setiap transaksi memiliki tipe income atau expense, nominal, dan status pembayaran: paid, unpaid, atau partial. TransactionService mengimplementasikan logika berbeda berdasarkan status: untuk paid, sistem otomatis membuat record payment yang bersesuaian dan meniadakan due_date; untuk unpaid/partial, due_date wajib disertakan dan divalidasi agar tidak mendahului tanggal transaksi. Metode pembayaran dibatasi pada dua kategori, yaitu cash dan bank. Khusus pencatatan melalui Telegram Bot yang hanya memiliki nama toko tanpa party_id, ‘TransactionRepo’ menyediakan metode ‘createWithoutParty()’ dengan mekanisme find-or-create: mencari party atau mitra berdasarkan nama, jika sudah ada dilakukan koneksi, jika belum dibuat record baru. Mekanisme ini memastikan konsistensi data mitra bisnis meskipun pencatatan dilakukan dari antarmuka yang berbeda (web maupun Telegram). Potongan kode inti dari alur transaksi dapat dilihat pada gambar 4.4.

![gambar_105_12.png](images/gambar_105_12.png)

Gambar 4.4 Potongan kode Transaction Service: logika pembuatan transaksi dan auto-generate payment berdasarkan status pembayaran

##### 4.4.1.3. Modul OCR

Modul OCR merupakan modul yang bertugas memproses gambar struk dan mengekstraksi informasi transaksi secara otomatis. Modul ini diimplementasikan sebagai sebuah handler dalam arsitektur Express.js dan dapat diakses melalui dua endpoint utama, yaitu POST ‘/api/ocr’ dan POST ‘/api/ocr/new-mapping’. Kedua endpoint tersebut menerima data gambar dalam format ‘multipart/form-data’ dengan nama field image, dan batasan ukuran berkas yang diterima adalah 10 MB. Potongan kode utama dari handler modul OCR dapat dilihat pada Gambar 4.5 berikut.

![gambar_106_13.png](images/gambar_106_13.png)

Gambar 4.5 Potongan kode handler Modul OCR Salah satu keputusan arsitektur penting pada modul ini adalah cara integrasi PaddleOCR ke dalam backend Express.js yang berbasis Node.js. Karena PaddleOCR hanya tersedia sebagai library Python, dibutuhkan jembatan antara dua runtime yang berbeda. Pendekatan yang dipilih adalah persistent child process, yaitu sebuah proses Python (ocr_worker.py) yang dijalankan satu kali saat server pertama kali dinyalakan melalui fungsi ‘warmupOcr()’, kemudian tetap berjalan selama server aktif. Pendekatan ini dipilih karena menghindari overhead inisialisasi model PaddleOCR yang membutuhkan waktu cukup lama apabila dilakukan setiap permintaan masuk. Komunikasi antara Node.js dan proses Python dilakukan melalui stdin dan stdout menggunakan format JSON per baris. Potongan kode OcrGateway yang mengimplementasikan mekanisme ini dapat dilihat pada Gambar

### 4.6. berikut.

![gambar_107_14.png](images/gambar_107_14.png)

Gambar 4.6 Potongan kode OcrGateway dengan mekanisme Persistent Child Process Setelah proses OCR selesai dijalankan oleh ocr_worker.py, hasilnya dikembalikan dalam bentuk objek JSON yang memuat ‘raw_text’ berisi seluruh teks yang berhasil dikenali, serta fields yang berisi informasi terstruktur meliputi ‘store_name’, total, dan date. OcrService kemudian menerima hasil tersebut dan memetakannya ke dalam tipe ‘OcrMappingResult’ termasuk proses parsing tanggal dari berbagai format dan mapping metode pembayaran berdasarkan kata kunci pada teks sebelum dikembalikan sebagai respons JSON kepada klien.

##### 4.4.1.4. Modul Telegram

Modul Telegram menyediakan endpoint webhook (POST /api/telegram/webhook) yang dilindungi secret token untuk menerima update dari Telegram Bot API, serta endpoint konfigurasi (GET /api/telegram/set-webhook). Detail implementasi integrasi Telegram dibahas pada sub bab 4.4.2.

##### 4.4.1.5. Modul Bisnis dan Aset

Modul bisnis mengelola data bisnis yang dimiliki pengguna, mencakup nama, alamat, telepon, dan jenis industri. Sistem yang dibangun mendukung kepemilikan multi-bisnis dengan flag ‘is_default’ yang menandai bisnis utama. Perpindahan bisnis default dilakukan secara transaksional melalui Prisma

$transaction untuk memastikan hanya satu bisnis yang menjadi default pada satu waktu. Modul aset mencatat harta yang dimiliki bisnis dengan dua kategori: current (aset lancar) dan fix (aset tetap), masing-masing memiliki atribut nama, tanggal perolehan, nilai awal, nilai saat ini, dan deskripsi. Relasi aset ke bisnis dijaga melalui foreign key business_id. Kedua modul ini dapat diakses oleh pengguna dengan role owner maupun staff, dan masing-masing menyediakan operasi CRUD lengkap. Contoh response dapat dilihat pada gambar 4.7 dan 4.8.

![gambar_108_15.png](images/gambar_108_15.png)

Gambar 4.7 Contoh response dari endpoint GET /api/businesses

![gambar_108_16.png](images/gambar_108_16.png)

Gambar 4.8 Contoh response dari endpoint GET /api/assets

##### 4.4.1.6. Modul Mitra

Modul mitra bisnis merupakan fitur yang digunakan untuk menyimpan dan mengelola data pelanggan atau merchant yang terlibat dalam transaksi, baik transaksi masuk maupun transaksi keluar. Data mitra bisnis dapat diakses melalui endpoint GET ‘/api/parties’ yang mengembalikan data dalam format JSON. Response tersebut memuat informasi setiap mitra seperti identitas unik, nama, kategori, serta keterangan tambahan yang relevan. Pengguna dapat menambahkan, mengubah, maupun menghapus data mitra melalui antarmuka yang tersedia, sehingga setiap transaksi yang dicatat dapat dikaitkan langsung dengan mitra yang bersangkutan. Contoh response dari endpoint ambil semua mitra dapat di lihat pada gambar 4.9.

![gambar_109_17.png](images/gambar_109_17.png)

Gambar 4.9 Contoh response dari endpoint GET /api/parties

##### 4.4.1.7. Modul Dashboard dan Laporan

Modul dashboard mengembalikan ringkasan keuangan per bisnis: total pemasukan, pengeluaran, pendapatan bersih, distribusi status pembayaran, dan 5 transaksi terbaru. Dashboard Service menjalankan ketiga query secara paralel menggunakan Promise.all(). Endpoint laporan (GET /api/dashboard/laporan/:id) menghasilkan file Excel atau PDF berdasarkan parameter format, start date, dan end date. Potongan implementasi kode generasi data dashboard pada dashboard service dapat dilihat pada gambar 4.10.

![gambar_110_18.png](images/gambar_110_18.png)

Gambar 4.10 Potongan kode Dashboard Service untuk eksekusi query paralel

#### 4.3.2. Integrasi dengan Telegram Bot

Telegram Bot merupakan antarmuka utama bagi pengguna untuk melakukan pencatatan transaksi secara cepat melalui perangkat mobile. Integrasi dilakukan melalui mekanisme webhook yang dilindungi secret token. Setiap interaksi pengguna melalui pesan atau callback query diarahkan ke Telegram Service yang mengelola seluruh logika percakapan. Potongan implementasi kode webhook dapat dilihat pada gambar 4.11.

![gambar_110_19.png](images/gambar_110_19.png)

Gambar 4.11 Endpoint webhook Telegram Bot mengimplementasikan sistem manajemen sesi berbasis state machine dengan enam state yang dapat dilihat pada tabel 4.9.

Tabel 4.9 Daftar State bot yang digunakan penulis

| No | State | Fungsi |
| --- | --- | --- |
| 1 | IDLE | Kondisi awal saat bot menunggu perintah dari pengguna. State ini aktif setelah bot pertama kali dijalankan dengan perintah /start, setelah transaksi berhasil disimpan, atau setelah transaksi dibatalkan. |
| 2 | WAITING_PHOTO | Bot menunggu pengguna mengirimkan foto struk atau mengetikkan detail transaksi sebagai teks. State ini aktif setelah pengguna memilih menu "Tambah Pengeluaran" atau "Tambah Pemasukan". |
| 3 | WAITING_DESCRIPTION | Bot menunggu pengguna memasukkan deskripsi untuk transaksi yang sedang dicatat. State ini aktif setelah data berhasil diekstrak dari foto (via OCR) atau dari teks (via parser). |
| 4 | WAITING_ CONFIRMATION | Bot menampilkan ringkasan detail transaksi dan menunggu pengguna memilih aksi: Simpan, Edit, atau Batal. State ini aktif setelah deskripsi dimasukkan atau setelah field selesai diedit. |
| 5 | WAITING_EDIT_FIELD | Bot menunggu pengguna memasukkan nilai baru untuk field yang dipilih (party, total, tanggal, metode pembayaran, atau deskripsi). State ini aktif setelah pengguna memilih field tertentu dari menu edit. |

| 6 | WAITING_REPORT_ DATE_RANGE | Bot menunggu pengguna memasukkan rentang tanggal kustom dalam format YYYY/MM/DD - YYYY/MM/DD untuk keperluan generate laporan. State ini aktif setelah pengguna memilih opsi "Pilih Periode Lain" pada menu laporan. |
| --- | --- | --- |

Setiap pengguna memiliki sesi independen yang disimpan dalam Map di memori. Otorisasi dilakukan dengan memverifikasi Telegram ID pengguna terhadap tabel users di basis data. Alur pencatatan transaksi mendukung dua metode input: (1) foto struk belanja yang diproses melalui pipeline OCR (download foto dari Telegram, recognize via modul OCR, mapping ke ‘OcrMappingResult’), dan (2) teks manual dengan format sederhana seperti "20k - Pertamina - 2025/12/22" yang di-parsing menjadi komponen amount, party, dan tanggal. Setelah data berhasil diekstrak, bot menampilkan ringkasan dengan opsi Simpan, Edit, dan Batal melalui inline keyboard. Bot juga menyediakan fitur laporan keuangan yang dapat dipilih berdasarkan periode 1 bulan, 1 tahun, atau periode custom. Laporan dihasilkan dalam format Excel dan PDF secara paralel kemudian dikirim sebagai dokumen Telegram.

#### 4.3.3. Pengembangan Aplikasi Web

Aplikasi web dikembangkan menggunakan Next.js dengan App Router dan Tailwind CSS. Aplikasi menggunakan pendekatan hybrid rendering: Server Components untuk pengambilan data awal melalui ‘serverFetch’ (dengan cookie HTTP-only), dan Client Components untuk interaktivitas melalui ‘apiFetch’. Aplikasi frontend yang dibangun juga memiliki mekanisme pembatasan hak akses sesuai dengan role yang dimiliki oleh pengguna. Sebagai contoh, pada berkas middleware.ts, setiap request ke halaman yang dilindungi (/finance-app) akan dicek keberadaan cookie auth_token. Jika tidak ditemukan, pengguna diarahkan ke halaman login. Contoh mekanisme yang diterapkan dapat dilihat pada gambar 4.12.

![gambar_113_20.png](images/gambar_113_20.png)

Gambar 4.12 Potongan kode middleware.ts untuk pembatasan hak akses Aplikasi web terdiri dari beberapa modul utama yang dapat diakses melalui sidebar. Setiap modul menyediakan fungsionalitas yang disesuaikan dengan kebutuhan pencatatan keuangan usaha kecil. Rincian modul-modul tersebut dapat dilihat pada tabel 4.10. Tabel 4.10 Daftar modul pada sidebar yang bisa diakses pengguna

| No | Modul | Fungsi |
| --- | --- | --- |
| 1 | Dashboard | Dashboard Ringkasan keuangan: total pemasukan/pengeluaran, pendapatan bersih, grafik batang perbandingan (ApexCharts), donut chart status pembayaran, daftar transaksi terbaru, serta berbagai macam filter. |
| 2 | Transaksi | Transaksi CRUD transaksi pemasukan/pengeluaran, termasuk input transaksi otomatis berdasarkan foto menggunakan OCR. |
| 3 | Bisnis | Manajemen data bisnis termasuk pengaturan bisnis default. |

| 4 | Mitra | Manajemen data pelanggan dan merchant. |
| --- | --- | --- |
| 5 | Aset | Manajemen aset bisnis dengan kategori lancar (current) dan tetap (fix) |
| 6 | Laporan | Generate dan unduh laporan keuangan format Excel/PDF |

#### 4.3.4. Pemasangan Aplikasi Web

Sistem Duomeco yang telah selesai dikembangkan kemudian dipasang pada server cloud DigitalOcean dengan spesifikasi 2 vCPU, 8GB RAM (terpakai 40%), dan 160GB SSD yang berlokasi di region Singapura. Proses pemasangan dilakukan secara langsung pada server tanpa menggunakan kontainerisasi (agar tetap ringan), di mana backend Express.js dan frontend Next.js dijalankan menggunakan process manager PM2 yang menjaga kedua aplikasi tetap berjalan di background serta melakukan restart otomatis apabila terjadi kegagalan. Modul OCR yang menggunakan library PaddleOCR dipasang dalam virtual environment Python terpisah dan dipanggil oleh backend melalui mekanisme child process saat pengguna mengirimkan foto struk belanja. Basis data MySQL dipasang pada server yang sama untuk meminimalkan latency komunikasi antara aplikasi dan basis data. Konfigurasi reverse proxy menggunakan Nginx untuk mengarahkan request dari domain publik ke masing-masing aplikasi, serta sertifikat SSL dari Let's Encrypt dipasang untuk mengamankan komunikasi melalui protokol HTTPS yang juga merupakan persyaratan wajib untuk mekanisme webhook Telegram. Selain pemasangan manual, penulis juga mengimplementasikan mekanisme CI/CD (Continuous Integration/Continuous Deployment) menggunakan GitHub Actions untuk mengotomatisasi proses pembaruan sistem. Setiap kali terdapat perubahan kode yang di-push ke branch utama (main) pada repository GitHub, GitHub Actions secara otomatis menjalankan workflow yang telah didefinisikan pada berkas konfigurasi deploy.yml. Konfigurasi workflow CI/CD yang diimplementasikan dapat dilihat pada Gambar 4.13 berikut.

![gambar_115_21.png](images/gambar_115_21.png)

Gambar 4.13 Potongan kode deploy.yml untuk proses CI/CD

#### 4.3.5. Tampilan Hasil Pengembangan Sistem

Pada sub bab ini ditampilkan hasil akhir pengembangan sistem Duomeco yang mencakup tampilan antarmuka aplikasi web dan interaksi Telegram Bot.

##### 4.4.5.1. Tampilan Telegram Bot

Antarmuka utama Telegram bot merupakan titik masuk pengguna dalam menggunakan fitur pencatatan keuangan melalui platform Telegram, yang dapat diakses dengan mengetikkan perintah ‘/start’ pada chat bot. Setelah perintah tersebut dijalankan, sistem menampilkan pesan sambutan beserta tiga pilihan menu utama yang disajikan dalam bentuk tombol inline, yaitu Tambah Pengeluaran, Tambah Pemasukan, dan Laporan Keuangan sehingga pengguna dapat menavigasi fitur yang tersedia dengan mudah tanpa perlu mengetik perintah secara manual. Apabila pengguna memilih menu Tambah Pengeluaran atau Tambah Pemasukan, sistem akan menampilkan instruksi lebih lanjut yang memandu pengguna untuk memilih metode pencatatan, yaitu dengan mengirimkan foto struk belanja untuk diproses secara otomatis menggunakan OCR, atau memasukkan data transaksi secara manual. Tampilan menu utama bot beserta contoh pengiriman foto struk belanja oleh pengguna dapat dilihat pada Gambar 4.14.

![gambar_116_22.png](images/gambar_116_22.png)

Gambar 4.14 Menu utama Telegram Bot Duomeco Setelah pengguna mengirimkan foto struk belanja, sistem memproses gambar tersebut menggunakan OCR sambil menampilkan pesan "Memproses OCR..." sebagai indikator proses yang sedang berjalan. Sistem kemudian meminta pengguna untuk memasukkan deskripsi transaksi secara manual. Setelah deskripsi dimasukkan, bot menampilkan ringkasan Detail Transaksi yang mencakup nama toko, total transaksi, tanggal, metode pembayaran, dan deskripsi hasil ekstraksi OCR. Pada tahap ini, pengguna diberikan tiga pilihan aksi, yaitu ‘Simpan’ untuk menyimpan transaksi, Edit, dan Batal. Apabila pengguna memilih Simpan, bot

menampilkan konfirmasi "Transaksi berhasil disimpan.". Tampilan proses tersebut dapat dilihat pada Gambar 4.15.

![gambar_117_23.png](images/gambar_117_23.png)

Gambar 4.15 Tampilan proses OCR dan konfirmasi detail transaksi Apabila pengguna memilih opsi Edit pada tahap konfirmasi transaksi, bot akan menampilkan menu pemilihan field yang ingin diubah. Terdapat lima field yang dapat diedit secara individual, yaitu Party (nama mitra/toko), Total, Transaction Date, Payment Method, dan Deskripsi, serta tombol ‘Kembali’ untuk

membatalkan proses edit. Tampilan menu edit transaksi dapat dilihat pada Gambar 4.16.

![gambar_118_24.png](images/gambar_118_24.png)

Gambar 4.16 Tampilan menu edit transaksi Fitur Laporan Keuangan menyediakan tiga opsi rentang periode laporan yang dapat dipilih pengguna, yaitu 1 Bulan Terakhir, 1 Tahun Terakhir, dan Pilih Periode Lain untuk menentukan rentang waktu secara custom. Tersedia pula tombol ‘Kembali’ untuk kembali ke menu utama. Tampilan pemilihan periode laporan keuangan dapat dilihat pada Gambar 4.17.

![gambar_119_25.png](images/gambar_119_25.png)

Gambar 4.17 Tampilan pemilihan periode laporan keuangan

##### 4.4.5.2. Halaman Sign In

Halaman sign in merupakan titik masuk pengguna ke dalam sistem yang berfungsi untuk memverifikasi identitas sebelum mengakses fitur-fitur aplikasi. Pengguna diwajibkan memasukkan kredensial yang valid berupa email dan kata sandi yang telah terdaftar di dalam sistem. Setelah proses autentikasi berhasil divalidasi oleh backend, server secara otomatis menyetel HTTP-only cookie yang berisi token autentikasi pada peramban pengguna, sehingga sesi pengguna tetap

terjaga dengan aman tanpa token tersebut dapat diakses melalui JavaScript. Pengguna kemudian diarahkan secara otomatis ke halaman dashboard sebagai halaman utama, dan tampilan antarmuka halaman sign in dapat dilihat pada Gambar 4.18.

![gambar_120_26.png](images/gambar_120_26.png)

Gambar 4.18 Halaman Sign In

##### 4.4.5.3. Halaman Dashboard

Halaman dashboard merupakan halaman utama yang ditampilkan kepada pengguna setelah berhasil melakukan sign in, dan berfungsi sebagai pusat informasi keuangan secara menyeluruh. Halaman ini menampilkan empat metrik utama, yaitu Total Pemasukan, Total Pengeluaran, Pendapatan Bersih, dan Total Transaksi, yang memberikan gambaran ringkas kondisi keuangan di setiap bisnis yang dimiliki. Selain metrik tersebut, tersedia pula visualisasi data berupa grafik batang perbandingan pemasukan dan pengeluaran serta diagram donat yang menggambarkan distribusi status pembayaran transaksi, sehingga pengguna dapat memahami pola keuangan dengan lebih mudah. Terdapat pula daftar transaksi terbaru yang memudahkan pengguna memantau aktivitas keuangan terkini, serta fitur unduh laporan yang memungkinkan pengguna mengunduh rekapitulasi keuangan sesuai kebutuhan. Tampilan antarmuka halaman dashboard secara keseluruhan dapat dilihat pada Gambar 4.19.

![gambar_121_27.png](images/gambar_121_27.png)

Gambar 4.19 Halaman Dashboard

##### 4.4.5.4. Halaman Manajemen Transaksi

Halaman manajemen transaksi merupakan halaman yang digunakan pengguna untuk mengelola seluruh data transaksi, baik pemasukan maupun pengeluaran. Data transaksi ditampilkan dalam format tabel yang memuat informasi seperti tanggal, kategori, nominal, status pembayaran, dan mitra bisnis yang terlibat, sebagaimana dapat dilihat pada Gambar 4.20. Halaman ini mendukung seluruh operasi CRUD (Create, Read, Update, Delete) yang dapat dilakukan melalui modal form tanpa perlu berpindah halaman, sehingga proses

pengelolaan data transaksi menjadi lebih efisien. Selain input manual, halaman ini juga menyediakan fitur otomatisasi pencatatan transaksi menggunakan teknologi OCR, di mana pengguna dapat mengunggah foto struk belanja untuk diekstraksi datanya secara otomatis. Tampilan antarmuka fitur pindai transaksi tersebut dapat dilihat pada Gambar 4.21.

![gambar_122_28.png](images/gambar_122_28.png)

Gambar 4.20 Halaman Manajemen Transaksi

![gambar_122_29.png](images/gambar_122_29.png)

Gambar 4.21 Halaman Pindai Transaksi

##### 4.4.5.5. Halaman Manajemen Bisnis

Halaman manajemen bisnis merupakan halaman yang digunakan pengguna untuk mengelola data bisnis yang terdaftar dalam sistem, ditampilkan dalam format tabel yang memuat informasi nama, alamat, nomor telepon, jenis industri, dan status default masing-masing bisnis. Pengguna dapat menambahkan bisnis baru, mengedit data bisnis yang sudah ada, serta menghapus bisnis yang tidak lagi digunakan melalui antarmuka yang tersedia. Selain itu, pengguna juga dapat menentukan bisnis mana yang dijadikan sebagai bisnis default, di mana bisnis yang ditandai sebagai default akan digunakan secara otomatis pada fitur pencatatan transaksi melalui Telegram bot tanpa perlu memilih bisnis secara manual setiap kali melakukan pencatatan. Tampilan antarmuka halaman manajemen bisnis secara keseluruhan dapat dilihat pada Gambar 4.22.

![gambar_123_30.png](images/gambar_123_30.png)

Gambar 4.22 Halaman Manajemen Bisnis

##### 4.4.5.6. Halaman Manajemen Aset

Halaman manajemen aset merupakan halaman yang digunakan pengguna untuk mencatat dan mengelola harta atau sumber daya yang dimiliki bisnis secara terstruktur dalam satu antarmuka yang terpusat. Setiap aset ditampilkan dalam format tabel yang memuat informasi lengkap meliputi nama, kategori, tanggal perolehan, nilai awal, nilai saat ini, dan deskripsi aset, sehingga pengguna dapat memantau kondisi dan perkembangan nilai aset bisnis dengan mudah. Pengguna dapat melakukan operasi tambah, edit, dan hapus data aset melalui modal form yang tersedia tanpa perlu berpindah halaman, sehingga proses pengelolaan data aset

menjadi lebih efisien dan praktis. Tampilan antarmuka halaman manajemen aset secara keseluruhan dapat dilihat pada Gambar 4.23.

![gambar_124_31.png](images/gambar_124_31.png)

Gambar 4.23 Halaman Manajemen Aset

##### 4.4.5.7. Halaman Manajemen Mitra

Halaman mitra bisnis menampilkan daftar pelanggan dan merchant yang terlibat dalam transaksi. Data mitra meliputi nama, alamat, dan nomor telepon. Pengguna dapat menambah, mengedit, dan menghapus data mitra. Perlu dicatat bahwa mitra yang masih terasosiasi dengan transaksi yang ada tidak dapat dihapus sistem akan menampilkan pesan peringatan untuk menjaga integritas data. Hasil tampilan dari halaman manajemen mitra dapat dilihat pada gambar 4.24.

![gambar_124_32.png](images/gambar_124_32.png)

Gambar 4.24 Halaman Manajemen Mitra

##### 4.4.5.8. Halaman Manajemen Karyawan

Halaman manajemen karyawan menampilkan daftar akun pengguna yang terdaftar dalam sistem Duomeco selain akun owner yang sedang aktif. Data

karyawan yang ditampilkan meliputi nama lengkap, username, role, dan Telegram ID yang digunakan untuk integrasi bot Telegram. Kolom role menandai apakah pengguna merupakan owner atau staff menggunakan badge berwarna berbeda untuk memudahkan pembacaan secara visual. Pengguna dengan role owner dapat menambah karyawan baru melalui tombol Tambah Karyawan yang berada di sisi kanan atas, serta melakukan edit dan hapus data melalui tombol aksi pada setiap baris tabel. Hasil tampilan dari halaman manajemen karyawan dapat dilihat pada gambar 4.25.

![gambar_125_33.png](images/gambar_125_33.png)

Gambar 4.25 Halaman Manajemen Karyawan

### 4.4. Tantangan Pengembangan Sistem

Dalam pengembangan proyek akhir ini, terdapat beberapa tantangan yang penulis hadapi selama proses implementasi sistem Duomeco. Tantangan pertama berkaitan dengan integrasi PaddleOCR ke dalam ekosistem backend berbasis Node.js. PaddleOCR merupakan library yang dikembangkan dalam ekosistem Python, sehingga tidak dapat dipanggil secara langsung dari Express.js. Untuk mengatasinya, penulis mengintegrasikan PaddleOCR melalui mekanisme child process yang menjalankan skrip Python secara terpisah dari proses utama Node.js. Pendekatan ini menghindari kebutuhan deployment server tambahan, namun menuntut penanganan error dan parsing output secara cermat agar data hasil OCR dapat dikembalikan ke lapisan service dengan benar. Tantangan kedua adalah pemetaan teks mentah hasil OCR ke dalam field transaksi yang terstruktur. Sistem menggunakan pendekatan berbasis regex dan

pencocokan pola untuk mengekstraksi informasi seperti nama merchant, total pembayaran, tanggal, dan metode pembayaran dari baris-baris teks hasil deteksi. Kesulitan muncul karena struk belanja yang digunakan oleh UMKM memiliki format yang sangat beragam dan tidak seragam antara satu merchant dengan yang lain, sehingga pola regex yang dirancang tidak selalu dapat mengekstraksi informasi secara akurat pada setiap kondisi. Untuk mengatasi hal ini, sistem menerapkan mekanisme konfirmasi sebelum data disimpan ke basis data, di mana pengguna dapat meninjau dan memperbaiki hasil pemetaan OCR secara manual melalui form yang telah terisi otomatis. Dengan demikian, ketidakakuratan hasil ekstraksi tetap dapat dikoreksi oleh pengguna sebelum data benar-benar tersimpan, sehingga integritas data transaksi tetap terjaga.

### 4.5. Pengujian Sistem

#### 4.5.1. User Acceptance Testing (UAT)

UAT dilakukan untuk memvalidasi bahwa sistem yang telah dikembangkan berfungsi sesuai dengan kebutuhan dan ekspektasi pengguna UMKM. Pengujian melibatkan lima responden yang terdiri dari dua owner dan tiga staff. Rincian data responden disajikan pada Tabel 4.11. Tabel 4.11 Rincian responden UAT sistem Duomeco

| No | Nama Responden | Peran |
| --- | --- | --- |
| 1 | Reni Irawati | Owner |
| 2 | Purwanti | Owner |
| 3 | Muhammad Gufti Alfarizqi | Staff |
| 4 | Meisya | Staff |
| 5 | Wastinah | Staff |

Setiap responden diberikan kesempatan untuk mencoba sistem secara langsung, mencakup seluruh alur fungsionalitas utama meliputi pencatatan

transaksi manual melalui website, unggah foto struk belanja untuk ekstraksi OCR, pencatatan transaksi melalui Telegram Bot, hingga pengunduhan laporan keuangan. Setelah mencoba sistem, responden diminta mengisi kuesioner yang terdiri dari 10 pernyataan berdasarkan empat karakteristik kualitas perangkat lunak ISO/IEC 25010:2023 [60], dengan skala Likert 1-5. Hasil pengisian kuesioner dari seluruh responden disajikan pada Tabel 4.12. R1-R5 = Responden 1-5; Skala 1-5 (1 = Sangat tidak setuju, 5 = Sangat setuju) Tabel 4.12 Hasil penilaian kuesioner UAT

| No | Pernyataan | Karakteristik ISO/IEC | R1 | R2 | R3 | R4 | R5 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Fitur-fitur yang tersedia pada sistem sudah lengkap dan sesuai dengan kebutuhan pencatatan keuangan usaha saya | Functional suitability (functional completeness) | 5 | 4 | 5 | 5 | 4 |
| 2 | Proses pencatatan transaksi secara manual melalui website dapat dilakukan dengan mudah dan menghasilkan data yang benar | Functional suitability (functional correctness) | 5 | 5 | 4 | 5 | 5 |
| 3 | Fitur unggah foto struk belanja untuk mengekstrak data transaksi secara otomatis berfungsi sesuai tujuannya | Functional suitability (functional appropriateness) | 5 | 5 | 5 | 5 | 5 |
| 4 | Pencatatan transaksi melalui Telegram Bot dapat dilakukan dengan mudah dan hasilnya sesuai | Functional suitability (functional correctness) | 5 | 4 | 5 | 4 | 3 |
| 5 | Hasil ekstraksi dari foto struk belanja | Reliability | 5 | 5 | 3 | 5 | 4 |

|  | sudah cukup akurat dan sesuai dengan data pada struk belanja |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 6 | Sistem berjalan stabil dan tidak mengalami gangguan selama digunakan | Reliability | 5 | 4 | 5 | 4 | 5 |
| 7 | Tampilan antarmuka sistem mudah dipahami dan saya dapat mengenali fungsi-fungsinya dengan cepat | Interaction capability (appropriateness recognizability) | 5 | 3 | 5 | 3 | 5 |
| 8 | Saya dapat mempelajari cara menggunakan sistem ini dengan cepat tanpa panduan yang rumit | Interaction capability (learnability) | 5 | 4 | 5 | 3 | 5 |
| 9 | Sistem merespons setiap tindakan yang saya lakukan dengan cepat | Performance efficiency (time behaviour) | 5 | 5 | 5 | 5 | 5 |
| 10 | Secara keseluruhan, saya puas dengan sistem Duomeco dan bersedia menggunakannya untuk kebutuhan usaha saya | Interaction capability (user engagement) | 5 | 4 | 5 | 4 | 5 |

Tingkat penerimaan sistem dihitung menggunakan rumus persentase UAT sebagaimana yang telah dijelaskan pada sub bab 2.20, dengan skor maksimal per responden adalah 50 (10 pernyataan x nilai maksimal 5). Hasil perhitungan persentase penerimaan sistem disajikan pada Tabel 4.13.

Tabel 4.13 Rekapitulasi skor UAT per responden

| No | Responden | Total Skor (Si) | Skor Maksimal (Smaks) |
| --- | --- | --- | --- |
| 1 | Reni Irawati (Owner) | 50 | 50 |
| 2 | Purwanti (Owner) | 43 | 50 |
| 3 | Muhammad Gufti Alfarizqi (Staff) | 47 | 50 |
| 4 | Meisya (Staff) | 43 | 50 |
| 5 | Wastinah (Staff) | 46 | 50 |
| Total (Σ) |  | 229 | 250 |

Berdasarkan rekapitulasi skor pada Tabel 4.13, diperoleh total skor keseluruhan (ΣSi) sebesar 229 dari total skor maksimal (ΣSmaks) sebesar 250 (5 responden × 50). Dengan menggunakan rumus persentase penerimaan UAT pada persamaan 2.3, diperoleh nilai P sebagai berikut. ∑ 𝑆 237 𝑖 𝑖=1 𝑃 = 𝑥 100% = 𝑥 100% = 91,6% ∑5 𝑆𝑚𝑎𝑘𝑠 250 𝑖 𝑖=1 Nilai persentase penerimaan sistem (acceptance rate) sebesar 91,6%, yang menunjukkan bahwa sistem yang dikembangkan mendapatkan respons baik dari seluruh responden pengguna UMKM.

#### 4.5.2. Pengujian Performa Telegram Bot (Uji Beban)

Pengujian performa dilakukan untuk mengukur kemampuan sistem dalam merespons permintaan pengguna melalui Telegram Bot secara end-to-end. Pengukuran response time dihitung mulai dari saat pengguna mengirimkan foto struk belanja melalui Telegram hingga sistem mengembalikan hasil ekstraksi OCR berupa informasi nama toko, tanggal transaksi, dan total harga. Pengujian dilakukan sebanyak 30 kali percobaan menggunakan gambar struk belanja yang berbeda- beda. Jumlah pengulangan ini mengacu pada syarat minimum sampel berdasarkan Central Limit Theorem yang menyatakan bahwa distribusi rata-rata sampel akan mendekati distribusi normal apabila ukuran sampel n ≥ 30 [61]. Hasil pengukuran

response time dari seluruh percobaan divisualisasikan dalam bentuk line chart pada Gambar 4.25.

![gambar_130_34.png](images/gambar_130_34.png)

Gambar 4.25 Line chart response time per percobaan Berdasarkan Gambar 4.25, terlihat bahwa response time Telegram sistem Duomeco selama 30 percobaan berada pada rentang 2,586 hingga 5,071 detik. Secara umum, grafik menunjukkan pola yang relatif stabil di sepanjang percobaan dengan sebagian besar nilai terpusat di kisaran 3-4 detik. Terdapat beberapa percobaan yang mencatatkan waktu lebih tinggi, yakni pada percobaan ke-10, ke- 12, ke-13, ke-14, dan ke-24 dengan nilai masing-masing 4,818 detik, 4,561 detik, 4,273 detik, 4,666 detik, dan 5,071 detik, yang kemungkinan disebabkan oleh variasi ukuran dan kompleksitas gambar struk belanja yang diproses sehingga membutuhkan waktu prediksi yang lebih lama. Meskipun demikian, lonjakan tersebut tidak bersifat ekstrem dan masih berada dalam batas yang wajar. Ringkasan statistik deskriptif dari hasil pengujian disajikan pada Tabel 4.14. Tabel 4.14 Ringkasan statistik response time

| Metrik | Nilai (detik) |
| --- | --- |
| Rata-rata | 3,636 detik |
| Nilai Minimum | 2,586 detik |
| Nilai Maksimum | 5,071 detik |

| Standar Deviasi | 0,608 detik |
| --- | --- |

Berdasarkan Tabel 4.14, sistem Duomeco mencatatkan rata-rata response time sebesar 3,636 detik dengan nilai minimum 2,586 detik dan nilai maksimum 5,071 detik. Nilai standar deviasi sebesar 0,608 detik menunjukkan bahwa distribusi response time antar percobaan relatif stabil, dengan sebagian besar nilai terpusat di kisaran 3-4 detik. Waktu respons yang tercatat dipengaruhi oleh beberapa faktor, di antaranya proses OCR yang berjalan pada VPS berbasis CPU tanpa akselerasi GPU, latensi komunikasi antara webhook backend dengan Telegram Bot API, serta variasi ukuran dan kompleksitas gambar struk belanja yang diproses.
