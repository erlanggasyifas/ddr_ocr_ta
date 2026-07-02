# BAB III
# METODE PENELITIAN

## 3.1. Alat dan Bahan

Pengembangan sistem SuratTEDI memerlukan serangkaian alat dan bahan yang direncanakan dengan baik. Kelengkapan komponen-komponen ini penting untuk memastikan kelancaran seluruh tahapan pengembangan. Secara garis besar, alat dan bahan yang digunakan dibagi menjadi dua kategori utama, yaitu perangkat keras dan perangkat lunak. Setiap kategori punya peran khusus dalam mendukung perancangan, pelaksanaan, hingga pengujian sistem secara menyeluruh.

### 3.1.1. Perangkat Keras

Perangkat keras yang digunakan dalam penelitian ini berfungsi sebagai lingkungan utama untuk mengembangkan sistem. Spesifikasi perangkat keras, meliputi jenis laptop, sistem operasi, prosesor (CPU), memori (RAM), kartu grafis (GPU), dan kapasitas penyimpanan, menjadi dasar teknis bagi seluruh proses pengembangan. Selain itu, Ngrok dimanfaatkan sebagai server lokal untuk memfasilitasi pengujian dan akses sistem selama tahap pengembangan.

| Spesifikasi | Keterangan |
|---|---|
| Tipe laptop | MacBook Pro Retina |
| Sistem operasi | Monterey 12.7.6 |
| Chip | Intel |
| RAM | 8GB |
| CPU | Dual-Core Intel Core i5 |
| GPU | Intel Iris Graphics 6100 1536 MB |
| Penyimpanan | 256GB SSD Storage |
| Server | Ngrok versi 3.23.2 |

### 3.1.2. Perangkat Lunak

Perangkat lunak yang menjadi komponen penting dalam pembangunan sistem ini akan disajikan pada Tabel 3.1. Tabel tersebut merangkum berbagai library dan framework yang digunakan untuk implementasi OCR dan pengembangan antarmuka web. Tabel berisi versi dan deskripsi singkat mengenai fungsi library dan framework dalam sistem. Penggunaan perangkat lunak ini dipilih berdasarkan kebutuhan fungsional dan teknis sistem SuratTEDI.

**Tabel 3.1. Daftar Library dan Framework**

| No | Library / Framework | Versi | Deskripsi |
|---|---|---|---|
| 1 | Python | 3.13.3 | Bahasa pemrograman untuk pengembangan OCR |
| 2 | PyTesseract | 0.3.13 | Library untuk pengembangan OCR |
| 3 | OpenCV | 4.11.0.86 | Library untuk memproses gambar sebelum OCR dilakukan |
| 4 | Flask | 3.0.3 | Library untuk mengirimkan hasil OCR melalui API |
| 5 | Pdf2images | 1.17.0 | Library untuk mengubah berkas PDF menjadi gambar |
| 6 | Laravel | 11.45.1 | Framework untuk mengembangkan sistem berbasis web |
| 7 | Filament | 3.3.23 | Library pendukung untuk membuat tampilan modul admin |
| 8 | Dompdf | 3.1.1 | Library untuk menghasilkan berkas bertipe PDF |
| 9 | Socialite | 5.21.0 | Library untuk proses login dan pembatasan akses sistem |
| 10 | Laravel-mongoDB | 5.21.0 | Library Laravel yang digunakan untuk memproses data yang dibutuhkan oleh sistem |

### 3.1.3. Bahan

Bahan utama yang digunakan untuk pengembangan sistem SuratTEDI sangat beragam, mencakup hasil wawancara yang mendalam dengan para pemangku kepentingan. Selain itu, dokumen surat dalam berbagai format menjadi bahan krusial yang dianalisis. Ketersediaan template surat juga berfungsi sebagai referensi penting dalam perancangan fitur pembuatan surat. Seluruh bahan ini menjadi fondasi informasi yang membimbing setiap tahap pengembangan sistem.

**a. Hasil Wawancara**

Hasil wawancara dengan staf akademik dan mahasiswa Departemen Teknik Elektro dan Informatika (DTEDI) UGM menunjukkan adanya kesulitan dalam pengelolaan surat. Staf akademik mengalami kesulitan pada saat mencari surat karena lokasi penyimpanan yang menyebar. Sementara itu, beberapa mahasiswa tidak memahami prosedur pengajuan surat yang benar. Mahasiswa tersebut juga khawatir akibat tidak adanya informasi status pengajuan surat. Meskipun demikian, mahasiswa merasa mudah dengan proses pengajuan surat yang dapat dilakukan dari jarak jauh. Hasil wawancara lengkap dapat dilihat pada Lampiran 1 dan 2.

**b. Dokumen Surat**

Dokumen surat adalah berbagai contoh surat-surat resmi yang telah diarsipkan oleh Departemen Teknik Elektro dan Informatika UGM. Surat tersebut dapat berupa surat fisik maupun dokumen digital seperti hasil scan atau file PDF. Surat-surat tersebut dibagi menjadi dua jenis, yaitu surat yang berformat UGM dan surat yang berformat non-UGM. Proses pengelompokan dapat dilihat melalui kop surat yang berada di atas surat. Contoh surat dengan format UGM dapat dilihat pada gambar 3.1 berikut.

> **[Gambar 3.1. Surat Permohonan Praktik Industri]**

**c. Template Surat**

Template surat adalah kumpulan contoh format surat-surat yang diterbitkan oleh Departemen Teknik Elektro dan Informatika UGM. Template format surat tersebut didapatkan dalam bentuk file bertipe .docx sehingga perlu diubah ke dalam format .html agar dapat digunakan untuk generate surat. Gambar 3.2 berikut ini adalah contoh template Surat Keterangan Aktif Kuliah dari DTEDI UGM.

> **[Gambar 3.2. Template Surat Keterangan Aktif Kuliah]**

---

## 3.2. Tahapan Proyek Akhir

Penelitian ini diimplementasikan menggunakan metode iterative waterfall. Pendekatan ini merupakan metode pengembangan sistem yang bersifat iterative. Sehingga memungkinkan siklus perbaikan dan penyesuaian berkelanjutan sepanjang proses pembangunan. Metode ini memfasilitasi mekanisme umpan balik yang adaptif terhadap kebutuhan yang berkembang. Proses penelitian diawali dengan fase pengumpulan data, yang kemudian dilanjutkan dengan analisis dan perancangan sistem, implementasi sistem, dan diakhiri dengan pengujian. Apabila dalam pengujian ditemukan adanya bug atau kebutuhan baru, maka proses akan kembali ke fase pengumpulan data. Hal ini bertujuan untuk mengumpulkan data tambahan atau mengklarifikasi kebutuhan yang belum terpenuhi, sehingga dapat memulai siklus perbaikan yang baru. Siklus ini terus berlanjut hingga sistem dinilai stabil, memenuhi seluruh persyaratan, dan siap untuk tahap finalisasi. Tahapan penelitian ini dapat dilihat pada gambar 3.3 berikut.

> **[Gambar 3.3. Alur Penelitian]**

### 3.2.1. Pengumpulan Data

Pada tahap ini, semua data yang dibutuhkan untuk pengembangan sistem dikumpulkan melalui dua metode utama. Pertama, studi literatur dilakukan dengan mencari dan mengumpulkan referensi terkait Sistem Manajemen Persuratan Digital dari penelitian sebelumnya. Kedua, wawancara yang dilaksanakan melalui diskusi dan tanya jawab dengan staf Bidang Akademik dan beberapa mahasiswa Departemen Teknik Elektro dan Informatika (DTEDI) UGM. Wawancara ini bertujuan mengidentifikasi permasalahan, memahami alur surat masuk dan keluar, mengetahui jenis-jenis surat yang dikelola, serta memperoleh perizinan akses terhadap arsip surat.

### 3.2.2. Analisis dan Perancangan Sistem

Sistem SuratTEDI akan dikembangkan dengan fitur-fitur untuk mengelola persuratan. Fitur tersebut mencakup penyimpanan surat, pembuatan surat, dan pengajuan surat. Pada fitur penyimpanan surat, sistem tidak hanya berfungsi sebagai arsip digital, tetapi juga diperkuat dengan teknologi Optical Character Recognition (OCR) sebagai fitur tambahan. Penggunaan OCR ini bertujuan untuk mengekstraksi teks dari dokumen pindaian atau PDF, yang kemudian akan menjadi metadata dan isi yang dapat dicari. Sehingga proses pencarian surat menjadi lebih cepat dan akurat. Proses pengajuan surat merupakan alur terpisah bagi mahasiswa, dan tidak terintegrasi dengan fungsi OCR yang berfokus pada ekstraksi teks untuk kebutuhan penyimpanan dan pencarian data. Proses pengajuan surat disesuaikan dan diadaptasi dari alur pengajuan surat yang saat ini ada, yaitu pada Lampiran 3.

Sistem SuratTEDI akan diakses oleh dua pengguna, yaitu staf akademik dan mahasiswa. Staf akademik, yang berperan sebagai administrator dan memiliki akses penuh ke menu-menu yang berkaitan dengan manajemen persuratan, termasuk fitur penyimpanan surat (dengan kemampuan pencarian OCR), pembuatan surat, serta pengelolaan dan pemrosesan alur pengajuan surat dari mahasiswa. Sementara itu, mahasiswa akan memiliki kewenangan khusus untuk mengajukan surat melalui sistem, dan dapat melacak status pengajuan mereka.

### 3.2.3. Implementasi Sistem

Proses implementasi sistem SuratTEDI dilakukan menggunakan pendekatan Kanban sebagai metode pengembangan perangkat lunak. Setiap tugas dikategorikan dengan kolom To Do, Doing, dan Done sehingga memudahkan pemantauan hambatan dalam proses implementasi. Implementasi Kanban dapat dilihat pada Lampiran 13. Pada tahap ini, proses pengembangan kode (coding) menggunakan bahasa pemrograman dan framework yang sudah ditentukan. Sistem SuratTEDI akan dikembangkan dengan framework Laravel. Pembuatan antarmuka pengguna dari sistem tersebut akan menggunakan library Filament. Selain itu, sistem SuratTEDI juga terintegrasi dengan layanan OCR yang akan dikembangkan dengan bahasa pemrograman Python. Proses integrasi ini menggunakan framework Flask dengan pertukaran data melalui protokol Hypertext Transfer Protocol (HTTP).

Proses OCR akan dijalankan menggunakan mekanisme background task, sehingga proses lainnya dapat berjalan tanpa saling mengganggu. Untuk memastikan data hasil OCR selalu ter-update dan real-time, proses pengiriman data dilakukan melalui mekanisme webhook. Setelah proses OCR selesai, OCR service akan mengirimkan HTTP POST request yang membawa data hasil OCR ke endpoint webhook yang telah disediakan oleh sistem SuratTEDI. Data yang diterima melalui webhook kemudian disimpan ke dalam database NoSQL, yaitu MongoDB. Untuk memantau ketersediaan data terbaru dari proses OCR, sistem SuratTEDI mengimplementasikan mekanisme polling secara berkala. Pada proses ekstraksi bagian-bagian surat, sistem menggunakan pola Regular Expression (Regex) yang dirancang dan disesuaikan dengan struktur dokumen yang ditemukan. Pengaksesan fitur OCR dan pengelolaan hasil ekstraksi ini akan menjadi kewenangan staf akademik.

### 3.2.4. Pengujian Sistem

Setelah proses implementasi sistem selesai dilakukan, tahap selanjutnya adalah pengujian sistem. Pengujian ini krusial untuk memvalidasi fungsionalitas dan kinerja sistem secara menyeluruh. Proses pengujian akan menggunakan berbagai alat, baik berupa perangkat lunak maupun perangkat keras, untuk memastikan hasil yang akurat. Spesifikasi perangkat keras yang digunakan adalah sebagai berikut:

| Spesifikasi | Keterangan |
|---|---|
| Tipe laptop | MacBook Pro Retina |
| Sistem operasi | Monterey 12.7.6 |
| Chip | Intel |
| RAM | 8GB |
| CPU | Dual-Core Intel Core i5 |
| GPU | Intel Iris Graphics 6100 1536 MB |
| Penyimpanan | 256GB SSD Storage |

Selain perangkat keras, proses pengujian sistem juga memerlukan dukungan dari perangkat lunak khusus. Perangkat lunak ini esensial untuk mendukung berbagai perhitungan dan analisis selama fase pengujian. Spesifikasi detail mengenai perangkat lunak yang digunakan dapat dilihat pada tabel 3.2 berikut. Setiap perangkat lunak memiliki peran spesifik untuk memastikan validitas dan keandalan hasil pengujian.

**Tabel 3.2. Spesifikasi Perangkat Lunak untuk Pengujian**

| Nama | Versi | Keterangan |
|---|---|---|
| Python | 3.13.3 | Bahasa pemrograman untuk pengembangan dan pengujian |
| Editdistance | 0.8.1 | Library untuk menghitung CER dan WER |
| Requests | 2.32.3 | Library untuk pencocokan pola teks |
| Re (Regular Expression) | - | Modul untuk proses pencocokan pola dalam string teks |
| Time | - | Library bawaan Python untuk mengukur durasi waktu |
| Psutil | 7.0.0 | Library untuk memantau penggunaan memori |

Terdapat tiga jenis pengujian yang dilakukan, yaitu pengujian User Acceptance Testing (UAT), pengujian performa OCR service, dan pengujian akurasi OCR service. Pengujian UAT dilakukan untuk memvalidasi fungsionalitas dalam sistem, memastikan sistem berjalan dengan lancar tanpa ada error ataupun bug, memiliki tampilan yang sesuai dan mudah digunakan, mampu menyelesaian permasalahan dan sesuai dengan kebutuhan oleh staf Bidang Akademik Departemen Teknik Elektro dan Informatika UGM. Tahapan ini mencakup beberapa skenario untuk memastikan tampilan dan fungsionalitas sistem. Pengguna sistem (responden) baik staf akademik (administrator) maupun mahasiswa (user) mencoba menggunakan sistem. Pengguna mencoba semua fungsionalitas yang ada dalam sistem. Kemudian, pengguna dapat mengisi lembar penilaian dalam bentuk formulir yang berisi pernyataan terkait sistem. Responden dapat menilai sistem SuratTEDI dengan rentang penilaian 1-5. Nilai 1 berarti sangat tidak setuju, nilai 2 berarti tidak setuju, nilai 3 berarti netral, nilai 4 berarti setuju, dan nilai 5 berarti sangat setuju. Contoh pengujian sistem untuk role staf akademik dapat dilihat pada tabel 3.3 berikut.

**Tabel 3.3. Contoh Pengujian untuk Role Staf Akademik**

| Pernyataan | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Alur sistem SuratTEDI mudah dipahami | | | | | |
| Pemilihan kata dalam sistem SuratTEDI mudah dipahami dan sudah sesuai | | | | | |
| Proses login dalam sistem SuratTEDI mudah dilakukan dan berjalan dengan lancar | | | | | |
| Proses perubahan status pengajuan hingga surat selesai (termasuk proses generate dan upload surat final) mudah dilakukan dan berjalan lancar | | | | | |
| Proses generate surat melalui menu Surat Keluar mudah dilakukan dan berjalan lancar | | | | | |
| Proses simpan surat melalui menu Surat Masuk mudah dilakukan dan berjalan lancar | | | | | |
| Proses review OCR melalui tombol Review OCR pada halaman list Surat Masuk mudah dilakukan dan berjalan lancar | | | | | |
| Tata letak sistem SuratTEDI terlihat rapi dan berfungsi dengan baik di device selain desktop (smartphone, tablet, dll) | | | | | |
| Tampilan antarmuka pengguna dari sistem SuratTEDI terlihat menarik | | | | | |
| Sistem SuratTEDI memudahkan manajemen surat (pemrosesan pengajuan surat dari mahasiswa, generate surat, dan menyimpan surat) | | | | | |

> **Catatan:** Pada dokumen sumber, pernyataan "Proses perubahan status pengajuan hingga surat selesai..." muncul dua kali (kemungkinan duplikasi/typo pada dokumen asli) — perlu dicek ulang.

Selain pengujian yang berfokus pada role staf akademik, proses evaluasi sistem juga mencakup pengujian khusus untuk role mahasiswa. Pengujian ini penting untuk memastikan bahwa semua fitur yang diperuntukkan bagi mahasiswa berfungsi dengan baik dan memenuhi kebutuhan mereka. Berbagai skenario penggunaan akan diuji untuk memverifikasi pengalaman pengguna. Contoh pengujian sistem yang dilakukan untuk role mahasiswa dapat dilihat pada tabel 3.4 berikut.

**Tabel 3.4. Contoh Pengujian untuk Role Mahasiswa**

| Pernyataan | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Alur sistem SuratTEDI mudah dipahami | | | | | |
| Pemilihan kata dalam sistem SuratTEDI mudah dipahami dan sudah sesuai | | | | | |
| Proses login dalam sistem SuratTEDI mudah dilakukan dan berjalan dengan lancar | | | | | |
| Proses pengajuan surat dalam sistem SuratTEDI mudah digunakan dan berjalan lancar | | | | | |
| Proses ubah profil dalam sistem SuratTEDI mudah digunakan dan berjalan lancar | | | | | |
| Tampilan antarmuka pengguna dari sistem SuratTEDI terlihat menarik | | | | | |
| Sistem SuratTEDI memudahkan proses pengajuan surat dan pengecekan status pengajuan surat | | | | | |

Selain itu, pengujian juga dilakukan pada OCR service yang membantu sistem mengubah dan mengekstraksi gambar menjadi teks. Pengujian yang dilakukan terdapat dua jenis, yaitu pengujian performa dan pengujian keakurasian. Pengujian performa dilakukan dengan menghitung waktu untuk merespons request per detik dan memori yang digunakan untuk memproses satu dokumen. Proses pengujian dilakukan dengan bantuan modul Time. Perhitungan waktu respons dilakukan dengan mengurangi waktu selesai dengan waktu mulai. Perhitungan tersebut dilakukan pada setiap proses dalam OCR service. Sebagai contoh, waktu dicek sebelum proses OCR dengan PyTesseract dimulai. Kemudian waktu dicek kembali setelah proses tersebut selesai. Kemudian waktu selesainya proses dikurangi dengan waktu mulai. Adapun untuk perhitungan memori dilakukan dengan bantuan library Psutil. Penggunaan memori dapat dilihat dari penggunaan memori puncak. Contoh perhitungan untuk waktu respons sebagai berikut:

```
Waktu respons = waktu selesai − waktu mulai
Waktu respons = 4235,3709 − 1234,6789
Waktu respons = 3000,6920 detik
```

### 3.2.5. Penulisan Laporan

Tahapan ini adalah proses krusial untuk mendokumentasikan seluruh tahapan penelitian dan pengembangan sistem secara komprehensif. Proses dokumentasi ini mencakup setiap langkah yang telah dilalui, mulai dari fase awal pengumpulan data hingga hasil akhir. Secara spesifik, tahapan yang didokumentasikan meliputi pengumpulan data, analisis dan preprocessing data, perancangan, implementasi, serta seluruh hasil pengujian sistem. Dokumentasi ini penting untuk memastikan transparansi, reproduktifitas, dan referensi di masa mendatang.

---

## 3.3. Perancangan Alat/Purwarupa

Proses selanjutnya dalam pengembangan sistem adalah perancangan alat atau purwarupa. Melalui tahapan ini, seluruh hasil analisis kebutuhan dan informasi yang telah terkumpul dari wawancara diolah untuk menghasilkan rancangan sistem yang komprehensif. Rancangan tersebut terdiri dari spesifikasi kebutuhan fungsional dan non-fungsional sistem. Selain itu, juga mencakup perancangan arsitektur sistem, perancangan basis data, serta perancangan desain antarmuka pengguna yang intuitif.

### 3.3.1. Kebutuhan Fungsional dan Non-Fungsional Sistem

Pada pengembangan sistem SuratTEDI yang efektif, proses identifikasi kebutuhan menjadi sangat krusial dan harus dilakukan secara mendalam. Hasil identifikasi kebutuhan tersebut kemudian akan menjadi dasar utama untuk seluruh tahapan selanjutnya. Ini meliputi proses implementasi hingga pengujian sistem secara menyeluruh. Secara umum, kebutuhan sistem SuratTEDI dapat dibagi menjadi dua bagian penting, yaitu kebutuhan fungsional dan kebutuhan non-fungsional.

**a. Kebutuhan Fungsional**

Kebutuhan fungsional merupakan fitur-fitur esensial yang harus dimiliki oleh sistem agar dapat beroperasi dengan baik. Bagian ini secara umum menguraikan kapabilitas dan aksi yang dapat dilakukan pengguna saat berinteraksi dengan sistem SuratTEDI. Ini menjelaskan fungsi spesifik yang akan disediakan sistem bagi penggunanya. Oleh karena itu, kebutuhan fungsional menjadi panduan utama dalam pengembangan setiap modul sistem.

**1. Role Staf Akademik**

Kebutuhan fungsional role staf akademik pada sistem SuratTEDI berdasarkan permasalahan yang telah dipaparkan adalah sebagai berikut:

- Staf akademik dapat melakukan login.
- Staf akademik dapat melihat ringkasan (overview) data surat masuk maupun keluar, serta daftar pengajuan surat melalui halaman dashboard.
- Staf akademik memiliki kewenangan untuk melihat daftar pengajuan surat dari mahasiswa dan mengubah status pengajuan mahasiswa.
- Staf akademik dapat men-generate surat berdasarkan pengajuan mahasiswa, serta melihat daftar surat yang telah di-generate melalui sistem.
- Pada fitur penyimpanan surat, staf akademik dapat melihat daftar surat yang tersimpan dalam sistem dan mengunggah surat bertipe PDF.
- Sebagai fitur tambahan pada penyimpanan surat, staf akademik dapat melihat hasil OCR melalui halaman detail surat, serta mengoreksi dan meng-highlight bagian surat jika hasil OCR belum sesuai melalui halaman review OCR.
- Staf akademik dapat melakukan logout dari sistem.

**2. Role Mahasiswa**

Kebutuhan fungsional role mahasiswa pada sistem SuratTEDI berdasarkan permasalahan yang telah dipaparkan adalah sebagai berikut:

- Mahasiswa dapat melakukan login.
- Mahasiswa memiliki kewenangan untuk melihat daftar pengajuan surat miliknya.
- Mahasiswa dapat mengajukan surat berdasarkan template (jenis) surat yang tersedia di sistem.
- Mahasiswa dapat melihat status terkini pengajuan suratnya (misalnya, menunggu, diproses, selesai).
- Mahasiswa dapat mengunduh surat apabila proses pengajuan surat telah selesai dan disetujui.
- Mahasiswa dapat melihat profilnya.
- Mahasiswa dapat mengubah data diri pada halaman profil.
- Mahasiswa dapat melakukan logout.

**b. Kebutuhan Non-Fungsional**

Selain kebutuhan fungsional, sistem SuratTEDI juga dirancang untuk memenuhi berbagai kebutuhan non-fungsional yang krusial. Kebutuhan non-fungsional ini merupakan kriteria kualitas yang harus dipenuhi oleh sistem, memastikan kinerja dan pengalaman pengguna yang optimal. Aspek-aspek ini tidak berkaitan langsung dengan apa yang dapat dilakukan sistem, melainkan bagaimana sistem bekerja. Kebutuhan non-fungsional pada sistem SuratTEDI adalah sebagai berikut:

- Sistem berbasis web yang dapat diakses melalui berbagai macam browser.
- Sistem mengharuskan pengguna untuk melakukan login menggunakan akun email UGM.

### 3.3.2. Perancangan Arsitektur Sistem

Pada pengembangan sistem SuratTEDI, arsitektur yang digunakan adalah client-server. Hal ini dapat dilihat dari interaksi antara browser dengan Laravel. Browser mengirimkan data seperti unggahan PDF ke Laravel kemudian Laravel mengirimkan data tersebut untuk diproses OCR dan menghasilkan teks yang ditampilkan kembali ke browser. Selain itu, dapat dilihat juga pada interaksi antara web dengan Python OCR service. Web bertindak sebagai client dan mengirimkan permintaan melalui API ke Python OCR service. Kemudian Python OCR service yang bertindak sebagai server memproses permintaan dan mengembalikan hasil OCR ke web untuk diakses oleh pengguna. Alur dan diagram arsitektur dari sistem SuratTEDI dapat dilihat pada gambar 3.4 berikut.

> **[Gambar 3.4. Diagram Arsitektur Sistem]**

### 3.3.3. Perancangan Basis Data

Sistem SuratTEDI akan menggunakan MongoDB sebagai tempat penyimpanan data. MongoDB sangat cocok untuk menyimpan data dinamis, terutama data yang bertipe array atau memiliki struktur yang bervariasi. Selain itu, MongoDB juga mengakomodasi data masukan yang berbeda antarjenis surat dalam proses pengajuan. Perbandingan skema dan struktur data yang disimpan dapat dilihat pada tabel 3.5 berikut.

**Tabel 3.5. Perbandingan Skema Data**

**Contoh skema 1:**
```json
{
  "data_surat": "{\"nomor_surat\":\"1\",\"tujuan\":\"Yth. Kepala\\nDinas Komunikasi dan Informatika Kabupaten Sleman,\\nJl. Parasamya No. 1, Beran, Tridadi, Kec. Sleman,\\nKabupaten Sleman, Daerah Istimewa Yogyakarta 55511\",\"tgl_mulai\":\"2025-07-23\",\"tgl_selesai\":\"2025-07-24\",\"prodi\":\"TRI\",\"tempat\":\"dinas\",\"kelompok\":[{\"data_surat\":{\"kelompok\":{\"nama\":\"nana\",\"nim\":\"22\\/364645\\/SV\\/37746\"}}}],\"link_tiles\":{\"proposal_pi\":\"pengajuan_tiles\\/LoA - Danica Fika Mauliddya.pdf\"}}"
}
```

**Contoh skema 2:**
```json
{
  "data_surat": "{\"nomor_surat\":\"1\",\"nama\":\"Luthtia Nisa Azzahra\",\"nim\":\"21\\/474456\\/SV\\/18930\",\"ipk\":\"4.00\",\"sks\":\"100\",\"prodi\":\"TRI\",\"alamat\":\"Boyolali, Jawa Tengah\",\"beasiswa\":\"PT. Djarum Foundation\",\"link_tiles\":{\"berkas_penting\":null}}"
}
```

Contoh pertama menunjukkan struktur data yang lebih kompleks dengan adanya array pada bagian "kelompok" yang berisi informasi detail anggota, serta objek "link_files" untuk berkas pendukung. Sementara itu, contoh kedua menampilkan skema detail individual seperti nama, NIM, IPK, dan SKS. Pada basis data yang akan digunakan dalam pengembangan sistem SuratTEDI, terdapat beberapa collection yang akan dibuat. Daftar collections tersebut dapat dilihat melalui tabel 3.6 berikut.

**Tabel 3.6. Daftar Collection yang Digunakan**

| No. | Nama Collection | Deskripsi |
|---|---|---|
| 1 | users | Menyimpan data diri mahasiswa |
| 2 | surat_masuks | Menyimpan data surat yang dimasukkan beserta dengan hasil OCR-nya |
| 3 | majors | Menyimpan data program studi yang ada di DTEDI UGM |
| 4 | templates | Menyimpan data template surat |
| 5 | pengajuans | Menyimpan data pengajuan dari mahasiswa beserta masukannya |
| 6 | surat_keluars | Menyimpan data surat yang berhasil dibuat oleh staf akademik |

Daftar collection yang akan digunakan dalam basis data dapat divisualisasikan secara jelas menggunakan class diagram. Representasi visual ini sangat membantu dalam memahami hubungan dan struktur antar data yang akan disimpan. Rancangan class diagram untuk basis data tersebut dirancang secara detail. Rancangan diagram untuk basis data tersebut dapat dilihat pada gambar 3.5 berikut.

> **[Gambar 3.5. Diagram Struktur Basis Data]**

### 3.3.4. Perancangan Sistem

**a. Use Case Diagram**

Use case diagram yang dirancang untuk sistem SuratTEDI meliputi dua jenis pengguna, yaitu role mahasiswa dan role staf akademik sebagai administrator. Mahasiswa memiliki kewenangan untuk mengakses menu login sebagai user, melihat dan mengelola profil mahasiswa, serta melakukan pengajuan surat melalui sistem. Sebaliknya, staf akademik yang berfungsi sebagai administrator memiliki kewenangan meliputi akses ke menu login sebagai administrator, serta kemampuan untuk mengelola berbagai aspek persuratan. Contohnya yaitu menu surat masuk untuk mengelola surat-surat yang akan diarsipkan, menu surat keluar untuk mengelola surat-surat yang diterbitkan, dan menu pengajuan untuk memproses serta menindaklanjuti pengajuan surat dari mahasiswa. Detail lebih lanjut mengenai kewenangan akses ini dapat dilihat pada gambar 3.6 berikut.

> **[Gambar 3.6. Use Case Diagram]**

**b. Business Process Model and Notation Diagram**

Business Process Model and Notation (BPMN) adalah sebuah standar diagram yang digunakan untuk memvisualisasikan alur kerja bisnis. Diagram ini secara khusus menggambarkan interaksi kompleks antar pihak dalam suatu sistem yang sedang dikembangkan. Dalam konteks sistem SuratTEDI, terdapat tiga proses utama yang divisualisasikan menggunakan BPMN diagram. Ketiga proses tersebut meliputi proses pengajuan, proses penyimpanan surat, dan proses pembuatan surat.

**1. Proses Pengajuan Surat**

Pada proses ini, mahasiswa melakukan pengajuan surat melalui sistem dan data pengajuan akan otomatis disimpan oleh sistem. Pengajuan akan dicek dan diverifikasi oleh staf akademik. Jika data yang dimasukkan oleh mahasiswa telah sesuai, staf akademik dapat mengubah status pengajuan tersebut. Selanjutnya, staf akademik dapat men-generate surat. Setelah itu, staf akademik bertanggung jawab untuk memproses penandatanganan surat. Apabila surat tersebut diambil secara offline, staf akademik cukup mengubah status pengajuan dan mengisi keterangan pengambilan. Namun, jika surat dapat diakses secara online, staf akademik dapat mengunggah surat bertanda tangan tersebut ke sistem agar dapat diakses oleh mahasiswa. Diagram BPMN untuk proses pengajuan ini dapat dilihat pada gambar 3.7 berikut.

> **[Gambar 3.7. Diagram BPMN untuk Pengajuan Surat]**

**2. Proses Unggah Surat**

Pada proses unggah surat, staf akademik mengunggah berkas PDF yang kemudian akan diproses oleh sistem menggunakan teknologi OCR. Hasil ekstraksi teks dari OCR tersebut selanjutnya disimpan secara otomatis oleh sistem. Apabila staf akademik ingin meninjau ulang hasil OCR yang diperoleh, tersedia fitur untuk melakukan editing serta menyimpan kembali hasil OCR yang telah dikoreksi. Diagram BPMN untuk alur proses unggah surat ini dapat dilihat pada gambar 3.8 berikut.

> **[Gambar 3.8. Diagram BPMN untuk Unggah Surat]**

**3. Proses Generate Surat**

Pada proses generate surat, staf akademik memulai dengan memilih template surat yang sesuai. Selanjutnya, staf akademik akan mengisi data yang dibutuhkan dan memproses data tersebut menjadi sebuah file PDF. Apabila proses generate PDF berhasil, ini menandakan bahwa data telah berhasil tersimpan dalam sistem. Diagram BPMN untuk alur proses generate surat ini dapat dilihat pada gambar 3.9 berikut.

> **[Gambar 3.9. Diagram BPMN untuk Generate Surat]**

### 3.3.5. Perancangan Desain Antarmuka Pengguna

Perancangan desain antarmuka pengguna merupakan tahapan terakhir dalam keseluruhan proses perencanaan sistem. Pada proses ini, fokus utama adalah menentukan desain visual dan interaksi dari setiap tampilan sistem. Ini mencakup perancangan tampilan untuk landing page, halaman login, dan halaman dashboard. Selain itu, juga dirancang tampilan form unggah surat masuk, halaman review OCR, form generate surat keluar, form pengajuan, serta tampilan halaman profil.

**a. Landing Page**

Landing Page adalah halaman terdepan dan paling awal dari sistem dan dapat diakses oleh pengguna tanpa login terlebih dahulu. Halaman ini berisi judul utama, sub-judul, dan informasi menarik lainnya yang dapat mempersuasi pengguna untuk mengakses sistem. Pada halaman ini, terdapat tombol login untuk mengakses sistem yang terletak di sisi kanan atas. Desain antarmuka untuk halaman ini dapat dilihat pada gambar 3.10 berikut.

> **[Gambar 3.10. Wireframe Landing Page]**

**b. Halaman Login**

Halaman Login adalah halaman yang harus diakses oleh role mahasiswa maupun role staf akademik. Melalui halaman ini, para pengguna dapat menekan tombol "Login dengan Google" agar dapat mengakses sistem. Apabila berhasil login, maka pengguna akan diarahkan ke halaman dashboard masing-masing. Desain antarmuka untuk halaman login dapat dilihat pada gambar 3.11 berikut.

> **[Gambar 3.11. Wireframe Halaman Login]**

**c. Halaman Dashboard**

Halaman dashboard dapat diakses ketika staf akademik yang memiliki kewenangan sebagai administrator berhasil login. Pada halaman ini, terdapat beberapa info overview di bagian atas terkait jumlah surat dan pengajuan. Di bawah overview terdapat chart yang menunjukkan perbandingan jumlah surat berdasarkan tahun dan program studi. Desain antarmuka untuk halaman Dashboard dapat dilihat pada gambar 3.12 berikut.

> **[Gambar 3.12. Wireframe Dashboard]**

**d. Form Unggah Surat**

Pada tampilan form unggah surat, terdapat satu kolom khusus yang diperuntukkan bagi staf akademik saja untuk mengunggah berkas surat. Tepat di bawah kolom unggah tersebut, tersedia sebuah tombol "Simpan" yang berfungsi untuk memulai proses OCR. Desain antarmuka yang intuitif ini dirancang untuk memudahkan pengguna dalam mengoperasikan fitur unggah surat. Tampilan lengkap untuk halaman form unggah surat dapat dilihat pada gambar 3.13 berikut.

> **[Gambar 3.13. Wireframe Form Unggah Surat]**

**e. Halaman Review OCR**

Apabila staf akademik ingin melakukan review hasil OCR, maka staf akademik dapat menekan tombol Review OCR pada halaman daftar surat masuk. Pada halaman ini, terdapat satu masukan bertipe dropdown untuk mengisi tipe surat. Kemudian dibawahnya terdapat dua kolom, yaitu kolom untuk menampilkan hasil OCR pada sisi kiri dan kolom untuk menampilkan file surat pada sisi kanan. Desain antarmuka untuk halaman review OCR dapat dilihat melalui gambar 3.14 berikut.

> **[Gambar 3.14. Wireframe Halaman Review OCR]**

Apabila staf akademik melakukan seleksi pada teks hasil OCR tersebut, akan muncul sebuah modal (pop-up) baru di layar. Modal ini berisi berbagai pilihan bagian surat yang ingin ditandai oleh staf. Desain antarmuka untuk modal pilihan tersebut dirancang agar mudah dipahami dan digunakan. Tampilan detail modal pilihan tersebut dapat dilihat pada gambar 3.15 berikut.

> **[Gambar 3.15. Wireframe Modal Pilihan Bagian Surat]**

**f. Daftar Template Surat Keluar**

Pada halaman daftar template surat keluar ini, terdapat list template yang dapat dipilih oleh staf akademik untuk diisi dan di-generate menjadi surat keluar. List template tersebut dapat dipilih. Selanjutnya, akan diarahkan menuju halaman form pengisian data dari surat yang dipilih tersebut. Desain antarmuka untuk halaman daftar template surat keluar dapat dilihat pada gambar 3.16 berikut.

> **[Gambar 3.16. Wireframe Halaman Daftar Template Surat]**

**g. Form Generate Surat Keluar**

Form untuk generate surat memiliki masukan yang cukup banyak dan dinamis sesuai template surat yang dipilih. Di sudut kiri bawah terdapat tombol simpan untuk men-generate surat. Di samping tombol tersebut, terdapat tombol batal untuk membatalkan pengisian form tersebut. Salah satu desain antarmuka untuk halaman form generate surat yaitu Surat Keterangan Aktif Kuliah dapat dilihat pada gambar 3.17 berikut.

> **[Gambar 3.17. Wireframe Form Surat Keterangan Aktif Kuliah]**

**h. Halaman Daftar Pengajuan**

Halaman daftar pengajuan dapat diakses pengguna yang berhasil login. Halaman ini, dirancang untuk menampilkan daftar pengajuan yang telah dibuat oleh mahasiswa. Pada role mahasiswa, di sudut kanan atas terdapat tombol untuk menambah pengajuan surat. Desain antarmuka untuk halaman ini dapat dilihat pada gambar 3.18 berikut.

> **[Gambar 3.18. Wireframe Halaman Daftar Pengajuan]**

**i. Form Pengajuan Surat**

Form pengajuan surat adalah halaman yang diakses mahasiswa ketika akan mengajukan surat. Pada form ini, terdapat beberapa masukan yang harus diisi seperti nama pengaju, jenis surat yang akan diajukan, dan data surat. Kolom untuk pengisian data surat bersifat dinamis sesuai jenis surat yang akan diajukan. Bagian ini sama dengan kotak masukan pada form generate surat keluar yang memiliki kotak masukan cukup banyak dan dinamis berdasarkan jenis surat yang dipilih. Desain antarmuka tampilan form pengajuan surat dapat dilihat pada gambar 3.19 berikut.

> **[Gambar 3.19. Wireframe Form Pengajuan Surat]**

**j. Halaman Profil**

Halaman ini digunakan untuk menampilkan data diri pengguna. Data yang tersaji di halaman ini bersifat read-only secara default. Namun pengguna memiliki opsi untuk mengubahnya. Tampilan halaman akan berubah menjadi sebuah form yang dapat diedit ketika mahasiswa menekan tombol "Ubah" yang terletak di sisi kanan bawah. Desain antarmuka lengkap untuk halaman ini dapat dilihat pada gambar 3.20 berikut.

> **[Gambar 3.20. Wireframe Halaman Profil]**

---

## 3.4. Tahapan Analisis Data

Tahapan analisis data surat merupakan proses fundamental untuk mengolah dokumen-dokumen surat menjadi format data yang siap pakai. Fokus utama dari tahapan ini adalah mempersiapkan berkas surat secara cermat sebelum proses Optical Character Recognition (OCR) dapat dijalankan. Persiapan awal ini meliputi proses mengunduh dokumen jika belum tersedia secara lokal, lalu mengonversinya menjadi format gambar yang sesuai, dan lain-lain. Seluruh tahapan analisis data ini dapat divisualisasikan lebih lanjut pada gambar 3.21 berikut.

> **[Gambar 3.21. Diagram Tahapan dalam Mengolah Surat]**

### 3.4.1. Pra-Pemrosesan OCR

Tahap awal sebelum Optical Character Recognition (OCR) dilakukan adalah proses krusial untuk mempersiapkan file surat. Persiapan ini sangat penting agar dokumen dapat dikenali dan diekstraksi teksnya dengan optimal. Proses tersebut secara spesifik terdiri dari dua langkah utama, yaitu: mengunduh dokumen ke penyimpanan lokal, dan kemudian mengonversinya menjadi format gambar. Kedua langkah ini memastikan file siap untuk pemrosesan OCR selanjutnya. Setelah file PDF tersimpan ke dalam penyimpanan lokal sistem, langkah selanjutnya adalah melakukan konversi file PDF menjadi gambar. Proses ini dilakukan karena salah satu jenis masukan dari OCR adalah file bertipe Portable Network Graphics (PNG). Proses ini dilakukan dengan bantuan library Pdf2images. Gambar yang dihasilkan disimpan dalam folder penyimpanan lokal.

### 3.4.2. Proses OCR

Setelah proses konversi dokumen surat ke dalam bentuk gambar selesai dilakukan, proses selanjutnya adalah menjalankan OCR untuk mengubah gambar tersebut menjadi teks. Proses ini hanya dapat dilakukan jika file yang berada dalam folder bertipe PNG, JPG, JPEG, BMP, dan TIFF. Proses ini dilakukan dengan bantuan library PyTesseract. Proses OCR dilakukan secara berulang pada setiap gambar yang ada di dalam folder hasil konversi PDF ke gambar.

Proses OCR yang dilakukan oleh Tesseract melalui PyTesseract sebagai antarmuka Python memiliki beberapa tahapan, yaitu proses segmentasi pada gambar, proses Long Short-Term Memory (LSTM) mengenali huruf, dan mengurutkan menjadi teks. Proses segmentasi adalah proses Tesseract untuk menganalisis letak halaman. Tesseract mengidentifikasi blok-blok teks, gambar, tabel, atau kolom yang ada dalam gambar. Proses segmentasi dimulai dari segmentasi halaman. Pada proses ini Tesseract mengidentifikasi area-area yang berisi teks (blok teks) dan memisahkan dari area kosong atau gambar. Hasil segmentasi halaman tersebut kemudian menjadi bahan untuk proses segmentasi baris. Proses segmentasi ini, Tesseract akan masuk ke dalam blok teks yang telah ditemukan sebelumnya untuk memisahkan menjadi baris perbaris.

Hasil segmentasi baris menjadi bahan untuk proses segmentasi karakter. Proses ini memisahkan setiap karakter yang ada dalam satu baris atau kata. Proses ini dimulai dengan mengambil setiap kata yang telah tersegmentasi kemudian mencari batas atau celah antar karakter. Proses ini menjadi krusial dan penting karena terdapat kemungkinan karakter yang bersambung dan spasi yang inkonsisten. Jika dalam proses pengambilan setiap karakter tersebut, Tesseract menemukan piksel yang sangat kecil atau bentuk yang aneh, maka kemungkinan besar akan diabaikan dan dianggap sebagai noise.

Setelah proses segmentasi karakter selesai dilakukan, langkah selanjutnya adalah melakukan pengambilan karakter yang terdeteksi ketika proses segmentasi karakter. LSTM akan mengecek dan melihat apakah karakter tersebut dapat dikatakan sebagai huruf. LSTM juga akan mengingat letak dan karakter sebelum dan sesudahnya sehingga terbentuk satu kata atau kalimat utuh. Melalui proses tersebut, LSTM akan mengembalikan teks sesuai segmentasi. Oleh sebab itu, indentasi dan tata letak teks dapat berubah. Proses tersebut dapat diilustrasikan melalui gambar 3.22 berikut.

> **[Gambar 3.22. Ilustrasi Proses OCR [36]]**

### 3.4.3. Pasca-Pemrosesan OCR

Setelah proses OCR selesai dilakukan, teks hasil OCR akan langsung digunakan untuk tahap pasca-pemrosesan OCR. Tahap ini sangat penting untuk memastikan data yang diekstrak akurat dan terstruktur. Proses pasca-pemrosesan tersebut terdiri dari dua langkah utama. Langkah-langkah ini meliputi proses pengecekan format surat dan klasifikasi jenis surat.

**a. Deteksi Format Surat**

Hasil OCR yang berupa teks per gambar tersebut kemudian dicek apakah gambar satu dengan gambar lainnya masih satu kesatuan membentuk sebuah surat atau surat yang berbeda. Apabila satu surat memiliki lebih dari satu lembar, maka teks-teks hasil OCR dari sebuah surat disatukan. Teks-teks hasil OCR tersebut kemudian dicek terkait format yang digunakan. Proses selanjutnya akan dilakukan hanya jika surat tersebut merupakan surat berformat UGM. Proses pengecekan tersebut dilakukan dengan mengecek kop surat yang diproses.

**b. Klasifikasi Surat**

Apabila surat terdeteksi berformat non-UGM, maka surat tersebut tidak akan diproses. Namun, jika surat terdeteksi berformat UGM, akan dilanjutkan dengan mengklasifikasikan surat tersebut. Ada tiga jenis surat yang dapat terdeteksi oleh sistem, yaitu Surat Permohonan, Surat Tugas, dan Surat Keterangan. Proses pengecekan dilakukan dengan menggunakan Regular Expression (Regex) untuk mendeteksi pola-pola atau teks tertentu.

### 3.4.4. Ekstraksi Bagian Surat

Setelah format surat dan jenis surat terdeteksi, maka proses selanjutnya adalah ekstraksi bagian surat. Proses ini dilakukan untuk mengambil bagian-bagian surat seperti nomor surat, isi surat, tanggal pembuatan surat, penanda tangan surat, dan pengirim surat. Proses pengambilan bagian-bagian surat dilakukan menggunakan Regular Expression (Regex) yang disesuaikan dengan Peraturan Rektor Nomor 13 Tahun 2018 tentang Tata Naskah Dinas di Lingkungan Universitas Gadjah Mada. Pattern yang digunakan untuk mendeteksi bagian-bagian surat tersebut memiliki pola yang berbeda antar jenis surat. Sebagai contoh, pola isi Surat Tugas berbeda dengan pola isi Surat Permohonan. Isi Surat Tugas dimulai dengan kalimat "Saya yang bertanda tangan di bawah ini ...". Sementara itu, isi Surat Permohonan memiliki awalan yang lebih dinamis seperti "Sehubungan dengan ...".

### 3.4.5. Pengujian

Proses pengujian dilakukan dengan metode Levenshtein Distance. Metode ini membandingkan kata dan karakter dari ground truth dengan teks hasil OCR. Alur pengujian dimulai dengan mempersiapkan ground truth, kemudian melakukan OCR, membandingkan hasil OCR dengan ground truth, menghitung perbedaan yang ada. Dalam pengujian ini, dokumen uji dipilih secara acak, sehingga memungkinkan sistem diuji dengan dokumen dengan kondisi beragam dalam hal aspek seperti resolusi, pencahayaan, atau noise. Pendekatan ini bertujuan untuk memberikan gambaran kinerja sistem pada data yang tidak terstandardisasi dan mencerminkan tantangan potensial di lingkungan operasional nyata. Sebelum proses pengujian dilakukan, ground truth dari dokumen uji harus dipersiapkan terlebih dahulu. Proses pembuatan ground truth adalah dengan mendata isi surat secara keseluruhan dengan format penulisan yang sesuai dengan hasil OCR. Isi surat harus sesuai karena perbedaan huruf maupun spasi dapat mempengaruhi hasil pengujian. Kemudian proses selanjutnya adalah menentukan bagian-bagian surat yang menjadi pembanding hasil ekstraksi bagian-bagian surat. Ground truth tersebut disimpan dalam format JSON.

Selanjutnya ground truth tersebut dimuat setelah proses OCR dilakukan. Selanjutnya proses membandingkan dilakukan dengan bantuan library Editdistance. Perbandingan meliputi perbandingan karakter yang menghasilkan nilai CER dan perbandingan kata yang menghasilkan nilai WER. Proses perhitungan nilai CER dilakukan dengan membandingkan karakter yang ada di ground truth dengan hasil OCR. Setiap karakter yang ada dalam kedua teks tersebut dibandingkan dan dihitung perbedaannya. Sebagai contoh, terdapat sebuah surat yang memiliki ground truth dengan panjang 57. Hasil OCR menunjukkan terdapat beberapa perubahan dan penambahan karakter. Terdapat 5 karakter yang tersubstitusi dan 6 karakter yang bertambah. Namun, tidak ada karakter yang terhapus. Dari data tersebut dilakukan perhitungan nilai CER dengan proses seperti berikut:

```
CER = (S + D + I) / N x 100%
CER = (5 + 0 + 6) / 57 x 100%
CER = 11 / 57
CER = 19,29%
```

Sementara itu, proses perhitungan nilai WER dilakukan dengan membandingkan kata yang ada di ground truth dengan hasil OCR. Setiap kata yang ada dalam kedua teks tersebut dibandingkan dan dihitung perbedaannya. Sebagai contoh, terdapat sebuah surat yang memiliki ground truth dengan panjang 57. Hasil OCR menunjukkan terdapat beberapa perubahan dan penghapusan kata. Terdapat 1 kata yang tersubstitusi dan 2 kata yang terhapus. Dari data tersebut dilakukan perhitungan nilai WER dengan proses seperti berikut:

> *[Perhitungan WER terpotong pada dokumen sumber — belum lengkap]*
