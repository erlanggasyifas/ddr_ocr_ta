# BAB I
# PENDAHULUAN

## 1.1 Latar Belakang

Industri minyak dan gas bumi (oil and gas) merupakan salah satu sektor energi paling vital di dunia yang melibatkan proses eksplorasi dan eksploitasi sumber daya alam yang kompleks. Dalam setiap operasi pengeboran, data memegang peranan kunci untuk memastikan keselamatan dan efisiensi kerja. Salah satu dokumen terpenting dalam aktivitas ini adalah Daily Drilling Reports atau laporan pengeboran harian. Dokumen ini berfungsi sebagai rekam jejak utama yang mencatat berbagai parameter teknis seperti kedalaman pengeboran, jenis batuan, tekanan lumpur, hingga penggunaan material operasional selama 24 jam penuh. Seiring berjalannya waktu, volume data Drilling Reports terus bertambah dan menjadi aset berharga bagi perusahaan untuk mengevaluasi kinerja sumur dan merencanakan strategi pengeboran selanjutnya [1].

Data Drilling Reports tersebut memiliki nilai strategis yang besar, namun metode pengelolaan yang selama ini diterapkan di industri masih bersifat konvensional, yaitu pemindahan data secara manual (manual data entry). Operator harus menyalin angka-angka dari laporan Portable Document Format (PDF) ke dalam format Excel atau sistem basis data, sebuah cara yang tidak lagi efisien di tengah tuntutan industri modern yang serba cepat. Selain memakan waktu lama, proses manual memiliki risiko kesalahan manusia (human error) yang signifikan. Riset menunjukkan bahwa rata-rata tingkat kesalahan pada input data manual cukup tinggi. Garza dkk. [3] dalam tinjauan sistematis terhadap metode pemrosesan data menunjukkan bahwa tingkat kesalahan metode manual re-abstraction (MRA) mencapai 6,57%, jauh lebih tinggi dibandingkan metode entri data tunggal sebesar 0,29%. Risiko ini berpotensi fatal ketika berhadapan dengan tabel-tabel padat yang memuat ratusan parameter presisi. Oleh karena itu, dibutuhkan teknologi otomatisasi yang mampu membaca dokumen tersebut layaknya manusia, namun dengan kecepatan dan konsistensi mesin.

Tantangan dalam pengelolaan dokumen teknis tersebut juga dihadapi secara nyata oleh PT Parama Data Unit. Sebagian besar Drilling Reports di perusahaan ini masih tersimpan dalam format PDF yang bersifat tidak terstruktur (unstructured data), sehingga data tersebut tidak dapat langsung diolah oleh sistem komputer atau basis data [2]. Kondisi ini menyulitkan proses analisis dan pengambilan keputusan operasional. Oleh karena itu, pemilihan model otomatisasi yang tepat menjadi aspek krusial untuk mengatasi permasalahan tersebut.

Menjawab kebutuhan tersebut, perkembangan teknologi kecerdasan buatan (Artificial Intelligence) di bidang visi komputer (Computer Vision) telah menghadirkan solusi melalui teknologi Optical Character Recognition (OCR). OCR memungkinkan konversi citra teks atau dokumen PDF menjadi data teks yang dapat disunting dan dicari. Seiring dengan kemajuan riset Deep Learning, bermunculan berbagai kerangka kerja (framework) OCR modern yang menawarkan performa tinggi. Dua framework yang dipilih dalam penelitian ini adalah EasyOCR dan PaddleOCR, karena keduanya mewakili teknologi open-source terkini yang banyak digunakan dalam industri [5][6].

Beberapa penelitian terdahulu telah mengeksplorasi perbandingan performa kedua framework tersebut. Sujatmiko dkk. [7] serta Konstantinov [8] menemukan bahwa PaddleOCR secara konsisten unggul dalam hal akurasi (confidence score) dan kecepatan pada dokumen dengan tata letak beragam dibandingkan EasyOCR. Sejalan dengan itu, Wang dan Shen [9] menambahkan bahwa integrasi PaddleOCR menghasilkan F1-score yang tinggi dengan latensi rendah, sementara EasyOCR menunjukkan penurunan performa yang signifikan khususnya pada ekstraksi berbasis tabel.

Secara lebih spesifik pada aspek rekonstruksi tabel kompleks, Yang dkk. [10] menunjukkan bahwa fitur PP-Structure dari PaddleOCR mampu mengonversi tabel PDF menjadi format terstruktur dengan akurasi tinggi. Di sisi lain, penerapan OCR pada domain industri minyak dan gas oleh Lefeuvre dkk. [11], Sinha dkk. [12], serta Witter dkk. [13] mencatat bahwa penggunaan OCR konvensional atau kombinasi dengan Large Language Models (LLM) masih menemui hambatan besar berupa penurunan akurasi hingga 70% ketika dihadapkan pada dokumen berbasis citra tidak terstruktur dan tabel kompleks.

Dari tinjauan literatur tersebut, dapat diidentifikasi sebuah celah penelitian (research gap) yang signifikan. Hingga saat ini, belum ada studi yang secara spesifik mengevaluasi dan membandingkan model OCR berbasis Deep Learning, khususnya EasyOCR dan PaddleOCR, dalam konteks ekstraksi dan rekonstruksi struktur tabel dari dokumen Drilling Reports. Dokumen ini memiliki tantangan tersendiri berupa karakteristik tabel padat, terminologi teknis, serta format yang bervariasi. Celah ini penting untuk diatasi, mengingat keputusan pemilihan model yang tidak tepat dapat berdampak langsung pada keandalan data operasional yang menjadi dasar pengambilan keputusan pengeboran.

Berdasarkan permasalahan tersebut, penelitian ini berfokus pada evaluasi komparatif antara EasyOCR dan PaddleOCR dalam konteks ekstraksi data Drilling Reports di PT Parama Data Unit. Pengujian dilakukan untuk menilai tingkat akurasi pembacaan karakter dan kemampuan rekonstruksi struktur tabel dari masing-masing model guna menentukan model yang paling optimal. Hasil ekstraksi dari model terbaik kemudian diintegrasikan ke dalam sebuah sistem aplikasi berbasis web menggunakan Next.js. Pada aplikasi tersebut, fitur PP-Table dari PaddleOCR dimanfaatkan secara khusus untuk menangani rekonstruksi tabel kompleks. Antarmuka web ini memvisualisasikan data hasil ekstraksi ke dalam bentuk grafik (dashboard) yang informatif, sehingga memudahkan pengguna di PT Parama Data Unit dalam memantau parameter pengeboran secara efisien. Dengan demikian, penelitian ini diharapkan dapat memberikan solusi end-to-end, mulai dari pembacaan data mentah hingga penyajian informasi yang siap guna.

## 1.2 Rumusan Masalah

Berdasarkan latar belakang yang telah diuraikan, rumusan masalah dalam penelitian ini adalah:

1. Bagaimana perbandingan tingkat akurasi model EasyOCR dan PaddleOCR dalam mengenali teks dan merekonstruksi struktur tabel pada dokumen Drilling Reports berdasarkan metrik evaluasi Character Error Rate (CER), Word Error Rate (WER), dan F1-score?
2. Bagaimana implementasi model PaddleOCR dengan modul PP-Structure untuk mengekstraksi data secara otomatis yang diintegrasikan ke dalam visualisasi dashboard berbasis web menggunakan Next.js di PT Parama Data Unit?

## 1.3 Tujuan dan Manfaat Proyek Akhir

### 1.3.1 Tujuan

Tujuan yang ingin dicapai dari penelitian ini adalah:

1. Menganalisis perbandingan tingkat akurasi dan kinerja antara model EasyOCR dan PaddleOCR dalam mengenali teks serta merekonstruksi struktur tabel pada dokumen Drilling Reports.
2. Mengimplementasikan model PaddleOCR dengan modul PP-Structure untuk mengekstraksi data secara otomatis serta membangun sistem visualisasi dashboard berbasis web menggunakan Next.js di PT Parama Data Unit.

### 1.3.2 Manfaat

Penelitian ini diharapkan dapat memberikan manfaat sebagai berikut:

1. Meningkatkan efisiensi operasional dalam pengelolaan data di PT. Parama Data Unit dan meminimalkan kesalahan input data manual melalui otomatisasi ekstraksi Drilling Reports.
2. Menghasilkan sistem aplikasi berbasis web yang dapat digunakan secara langsung oleh operator untuk memantau parameter pengeboran melalui dashboard yang informatif.
3. Memberikan bukti empiris mengenai perbandingan performa model EasyOCR dan PaddleOCR pada kasus spesifik dokumen industri yang memiliki struktur tabel kompleks, sehingga dapat menjadi referensi bagi penelitian sejenis di masa mendatang.
4. Memperkaya kajian penerapan teknologi OCR berbasis Deep Learning dalam domain industri minyak dan gas, yang hingga saat ini masih terbatas dalam literatur akademik.

## 1.4 Batasan Penelitian

Agar penelitian ini lebih terarah dan fokus, ditetapkan batasan masalah sebagai berikut:

1. Objek penelitian terbatas pada dokumen Drilling Reports milik PT. Parama Data Unit dalam format PDF.
2. Perbandingan model OCR dibatasi pada dua arsitektur, yaitu EasyOCR (dengan backbone CRAFT-CRNN) dan PaddleOCR (dengan modul PP-OCR/PP-Structure).
3. Dataset yang digunakan dalam pengujian terbatas pada 13 sampel dokumen Drilling Reports dikarenakan sifat kerahasiaan data (confidentiality) perusahaan.
4. Fokus utama penelitian adalah pada akurasi pemrosesan data (data processing), sedangkan fitur antarmuka web dibatasi pada visualisasi data (dashboard) hasil ekstraksi.
5. Sistem yang dibangun hanya mengakomodasi satu jenis hak akses pengguna (single role), yaitu admin atau operator yang bertugas melakukan unggah dan validasi data.
6. Ruang lingkup pembacaan dan ekstraksi data oleh model OCR dibatasi pada empat kelompok parameter utama sesuai dengan struktur laporan dan kebutuhan operasional PT. Parama Data Unit, yaitu: Metadata Sumur (*Well Profile*), Parameter Pengeboran (*Drilling Parameters*), Catatan Penggunaan Mata Bor (*Bit Records*), serta Rincian Aktivitas Operasi per Jam (*Time Breakdown*).
7. Implementasi dan pengujian sistem aplikasi web dilakukan pada lingkungan server lokal (development environment) dan tidak mencakup tahap deployment ke infrastruktur cloud publik.
