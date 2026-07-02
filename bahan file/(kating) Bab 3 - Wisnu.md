# BAB III
# METODE PENELITIAN

## 3.1. Alat dan Bahan

Bagian ini menjelaskan alat dan bahan yang digunakan dalam penelitian ini. Alat-alat yang disertakan mencakup perangkat keras dan perangkat lunak yang mendukung proses pengembangan, sementara bahan-bahan merujuk pada sumber daya, dataset, dan komponen pendukung lainnya yang diperlukan dalam pengujian dan implementasi aplikasi. Penggunaan alat dan bahan yang tepat sangat penting untuk memastikan keberhasilan penelitian dan pencapaian hasil yang sesuai dengan tujuan.

### 3.1.1. Objek dan Lokasi Penelitian

Penelitian ini merupakan lanjutan dari penelitian sebelumnya yang dilakukan oleh Nanang Arifudin dan dilaksanakan di Kota Surakarta, yaitu: SLB Panca Bakti Mulia, SLB YBA Surakarta, dan SLB Autis Agca Center [46]. Penelitian sebelumnya berfokus pada pengembangan media pembelajaran untuk meningkatkan kemampuan membaca pada siswa tunagrahita. Berbeda dengan penelitian tersebut, fokus utama penelitian ini adalah pengembangan media pembelajaran yang ditujukan untuk meningkatkan keterampilan menulis siswa tunagrahita melalui metode tracing the dot.

Saat ini penulis hanya berfokus pada satu Sekolah Luar Biasa (SLB) yang berlokasi di Jalan Baru Sanggrahan, Banaran, Sendangadi, Kec. Mlati, Kabupaten Sleman, Daerah Istimewa Yogyakarta, yaitu SLB Tegar Harapan Yogyakarta. Partisipan penelitian terdiri dari perwakilan guru dari SLB tersebut, yang akan mengisi kuesioner. Dari berberapa guru tersebut, satu diantaranya akan menjalani proses wawancara.

Penting untuk dicatat bahwa penggunaan kedua metode ini dilakukan atas pertimbangan tujuan yang berbeda dalam penelitian ini. Kuesioner diadopsi sebagai salah satu alat pengumpulan data, agar peneliti mendapatkan respons kuantitatif dalam bentuk skala serta jawaban singkat dari para guru. Sementara itu, wawancara digunakan sebagai metode komplementer yang lebih detail, agar peneliti mendapatkan pemahaman yang lebih rinci dan kontekstual mengenai isu yang akan diteliti. Pengujian proyek ini melibatkan guru dan perwakilan murid yang akan menjalani proses pengujian black box testing dan user acceptance testing.

### 3.1.2. Data Penelitian

Data penelitian dibagi menjadi dua kategori utama, yaitu data primer dan data sekunder. Penjelasan mengenai metode pengumpulan data ini penting untuk memberikan gambaran mengenai sumber informasi yang digunakan dalam tahap analisis.

**a. Data Primer**

Pengumpulan data primer dilakukan dengan cara menyebar kuesioner kepada guru atau pengajar SLB. Tujuan dari pengumpulan data ini untuk mengetahui kondisi siswa yang diajar oleh guru atau pengajar meliputi jumlah siswa yang diajar, sejauh mana kemampuan menulis siswa, seberapa familiar siswa dengan perangkat handphone, dan validasi fitur aplikasi media pembelajaran menulis berbasis android pada siswa.

**b. Data Sekunder**

Data sekunder diperoleh dari studi pustaka seperti dataset, buku, jurnal, artikel website, dan penelitian terdahulu lainnya. Pada penelitian ini, data sekunder diperoleh dari referensi yang berkaitan dengan topik penelitian, di antaranya seperti metode pengembangan, fitur-fitur aplikasi, dan cara pengujian dari berbagai jurnal.

Penelitian ini menggunakan dataset EMNIST (Extended Modified National Institute of Standards and Technology) yang merupakan versi extended dari dataset MNIST. Dataset ini dikumpulkan oleh Gregory Cohen bersama timnya di The MARCS Institute for Brain, Behaviour and Development, Western Sydney University. Dataset EMNIST digunakan untuk melatih dan menguji model handwriting recognition karena menyediakan data gambar huruf dan angka tulisan tangan yang cukup beragam sehingga dapat dijadikan sebagai data pelatihan model machine learning [47].

Dalam dataset tersebut, terdapat 6 pembagian struktur dataset yang berbeda-beda berdasarkan jumlahnya. Tabel 3.1 menunjukkan struktur dan organisasi dataset EMNIST. Secara umum, dataset ini terbagi dalam beberapa subset, di antaranya EMNIST By Class (62 kelas), By Merge (47 kelas), Letters (26 kelas), Digits (10 kelas), Balanced (47 kelas), dan MNIST (10 kelas) dengan jumlah data pelatihan dan pengujian bervariasi di tiap subset. Pada subset EMNIST Balanced, terdapat 131.600 gambar yang terbagi pada 47 kelas gabungan huruf kapital, non-kapital dan angka. Gambar dalam dataset ini memiliki resolusi 28×28 piksel dalam skala keabuan 8-bit, serupa dengan MNIST.

**Tabel 3.1 Struktur dataset EMNIST**

> _(Tabel/gambar asli — sisipkan konten tabel di sini)_

Pada penelitian ini, penulis menggunakan subset EMNIST Balanced sebagai dataset pilihan karena jumlah data yang tidak terlalu besar namun tetap cukup dalam pelatihan model. Selain itu, pemilihan dataset ini juga dipengaruhi oleh keterbatasan sumber daya komputasi khususnya kapasitas RAM dan GPU pada platform Kaggle Notebook yang digunakan selama proses pengembangan dan pelatihan model.

## 3.2. Peralatan

Dalam rangka menunjang pengembangan aplikasi, digunakan beberapa peralatan yang mencakup perangkat lunak dan perangkat keras. Perangkat-perangkat ini menjadi komponen penting dalam pelaksanaan pengembangan aplikasi.

### 3.2.1. Perangkat Lunak

Perangkat lunak berperan penting dalam menunjang pengembangan aplikasi media pembelajaran menulis ini. Tabel 3.2 berikut menunjukkan daftar versi perangkat lunak dan library yang digunakan oleh penulis.

**Tabel 3.2 Daftar Perangkat Lunak dan Library yang Digunakan**

| Nama | Versi |
|---|---|
| Windows | Windows 11 Home Single Language, Ver. 24H2 |
| Google Chrome | Version 135.0.7049.96 (Official Build) (64-bit) |
| Android Studio | Meerkat 2024.3.1 Feature Drop |
| Draw.io | v26.2.12 |
| Python | 3.11.12 |
| Kotlin | 2.1.20 |
| Tensorflow | 2.18.0 |
| Numpy | 1.26.4 |
| Pandas | 2.2.3 |
| kagglehub | 0.3.12 |
| nltk | 3.9.1 |
| cv2 | 4.11.0 |
| Github | Web Version |
| Figma | Web Version |
| Kaggle Notebook | Web Version |

### 3.2.2. Perangkat Keras

**a. Laptop Lenovo LOQ-AAID**
Sistem Operasi Windows 11 64 Bit, Processor Intel Core i5 13450HX Up To 4.6GHz 10 Cores (6P + 4E) 16 Threads, IPS 15.6” FHD Slim 144Hz, Nvidia RTX 4050 6GB, RAM 12GB DDR5, SSD Samsung 512GB M.2 NVMeTM PCIe®

**b. Monitor Xiaomi G24i**
Model P24FCA-RGGL, Screen Size 23.8”, Resolution 1920 x 1080, Refresh Rate 180Hz

**c. Handphone POCO M3 Pro 5G**
OS Android 13, MIUI 12, MediaTek Dimensity 700, Ukuran layar 6.5”, Resolusi 2400 x 1080, RAM 6GB, Storage 128GB

## 3.3. Tahapan Proyek Akhir

Gambar 3.1 menggambarkan alur tahapan pengembangan proyek akhir dengan menggunakan metode Iterative Waterfall Model. Proses pengembangan ini mencakup tahap-tahap berurutan, yaitu mulai dari analisis kebutuhan, perancangan sistem, implementasi, hingga pengujian. Setiap tahapan dilakukan secara berurutan, namun tetap dapat dilakukan iterasi atau pengulangan, terutama saat hasil pengujian menunjukkan bahwa aplikasi belum sesuai dengan kriteria yang ditentukan [48]. Hal ini dilakukan untuk memastikan kualitas dan kesesuaian aplikasi sebelum dinyatakan selesai.

**Gambar 3.1 Flowchart tahapan pengerjaan PA**

> _(Sisipkan gambar di sini)_

### 3.3.1. Analisis

Analisis adalah tahapan awal yang cukup penting dalam pengembangan aplikasi media pembelajaran. Tahapan ini dilakukan analisis kebutuhan pengguna sehingga dapat ditentukan fitur-fitur yang perlu dikembangkan dalam aplikasi. Proses ini melibatkan beberapa langkah penting:

**a. Kuesioner**

Kuesioner berisi pertanyaan-pertanyaan yang diisi oleh guru/pengajar di SLB Tegar Harapan Yogyakarta untuk mengetahui permasalahan-permasalahan yang nantinya menjadi dasar dalam menentukan fitur dan kebutuhan pengguna. Daftar pertanyaan kuesioner dapat dilihat pada Tabel 3.3.

**Tabel 3.3 Pertanyaan Kuesioner**

| No | Pertanyaan |
|---|---|
| 1 | Berapa lama Anda telah mengajar siswa tunagrahita di Sekolah Luar Biasa (SLB)?<br>a. Kurang dari 1 tahun<br>b. 1-3 tahun<br>c. 4-6 tahun<br>d. Lebih dari 6 tahun |
| 2 | Pada jenjang kelas apa Anda mengajar?<br>a. 1 SD<br>b. 2 SD<br>c. 3 SD<br>d. 4 SD<br>e. 5 SD<br>f. 6 SD<br>g. Lainnya... |
| 3 | Berapa jumlah siswa yang diajar? |
| 4 | Persentase jumlah siswa yang dapat menulis?<br>a. 0%<br>b. 25%<br>c. 50%<br>d. 75%<br>e. 100% |
| 5 | Apakah media handphone/tablet dalam pembelajaran di sekolah pernah digunakan?<br>a. Pernah<br>b. Belum Pernah |
| 6 | Seberapa penting menurut Anda penggunaan teknologi (media handphone/tablet) dalam membantu pembelajaran siswa tunagrahita?<br>a. Sangat Penting<br>b. Penting<br>c. Biasa<br>d. Tidak Penting |
| 7 | Apakah Anda setuju terhadap penggunaan media handphone/tablet dalam pembelajaran menulis?<br>a. Sangat Setuju<br>b. Setuju<br>c. Biasa<br>d. Tidak Setuju |
| 8 | Apakah siswa pernah menggunakan aplikasi atau media digital dalam proses pembelajaran siswa tunagrahita?<br>a. Ya<br>b. Tidak |
| 9 | Jika ya, media pembelajaran apa yang pernah Anda gunakan dan bagaimana efektivitasnya terhadap siswa? |
| 10 | Apakah fitur animasi cara menulis huruf kapital diperlukan dalam aplikasi?<br>a. Sangat Diperlukan<br>b. Diperlukan<br>c. Tidak Diperlukan |
| 11 | Apakah fitur animasi cara menulis huruf non-kapital diperlukan dalam aplikasi?<br>a. Sangat Diperlukan<br>b. Diperlukan<br>c. Tidak Diperlukan |
| 12 | Apakah fitur animasi cara menulis angka diperlukan dalam aplikasi?<br>a. Sangat Diperlukan<br>b. Diperlukan<br>c. Tidak Diperlukan |
| 13 | Apakah fitur belajar menulis huruf kapital diperlukan dalam aplikasi?<br>a. Sangat Diperlukan<br>b. Diperlukan<br>c. Tidak Diperlukan |
| 14 | Apakah fitur belajar menulis huruf non-kapital diperlukan dalam aplikasi?<br>a. Sangat Diperlukan<br>b. Diperlukan<br>c. Tidak Diperlukan |
| 15 | Apakah fitur belajar menulis angka diperlukan dalam aplikasi?<br>a. Sangat Diperlukan<br>b. Diperlukan<br>c. Tidak Diperlukan |
| 16 | Apakah fitur belajar menulis kata diperlukan dalam aplikasi?<br>a. Sangat Diperlukan<br>b. Diperlukan<br>c. Tidak Diperlukan |
| 17 | Apakah fitur kuis menulis diperlukan dalam aplikasi?<br>a. Sangat Diperlukan<br>b. Diperlukan<br>c. Tidak Diperlukan |
| 18 | Apakah fitur mengelola soal dan jawaban pada kuis menulis diperlukan dalam aplikasi?<br>a. Sangat Diperlukan<br>b. Diperlukan<br>c. Tidak Diperlukan |
| 19 | Apakah fitur riwayat belajar menulis diperlukan dalam aplikasi?<br>a. Sangat Diperlukan<br>b. Diperlukan<br>c. Tidak Diperlukan |
| 20 | Apakah fitur pengenalan tulisan tangan (Handwriting Recognition) dapat membantu siswa tunagrahita dalam proses pembelajaran menulis?<br>a. Membantu<br>b. Mungkin (Tidak Tau)<br>c. Tidak Membantu |
| 21 | Apakah fitur feedback langsung pada kuis menulis dapat membantu siswa tunagrahita dalam proses pembelajaran menulis?<br>a. Membantu<br>b. Mungkin (Tidak Tau)<br>c. Tidak Membantu |
| 22 | Apa harapan Anda terkait hasil belajar siswa tunagrahita dengan adanya aplikasi pembelajaran menulis berbasis Android dengan fitur handwriting recognition? |
| 23 | Apakah Anda memiliki saran atau masukan terkait pengembangan aplikasi pembelajaran menulis ini agar lebih efektif dalam membantu siswa tunagrahita? |

**b. Wawancara**

Wawancara dilakukan untuk memperoleh informasi yang lebih mendalam mengenai permasalahan dan kebutuhan yang dihadapi oleh guru atau pengajar di SLB Tegar Harapan Yogyakarta. Daftar pertanyaan wawancara dapat dilihat pada Tabel 3.4.

**Tabel 3.4 Pertanyaan Wawancara**

| No | Pertanyaan |
|---|---|
| 1 | Berapa lama Bapak/Ibu sudah mengajar siswa tunagrahita di SLB ini? |
| 2 | Berapa jumlah siswa tunagrahita di sekolah ini? |
| 3 | Bagaimana rentang usia di setiap tingkat sekolah (SD, SMP, dan SMA)? |
| 4 | Berapa jumlah guru/pengajar dan kelas di SLB ini? |
| 5 | Apa tantangan terbesar yang Bapak/Ibu hadapi saat mengajar siswa tunagrahita, khususnya dalam mengajarkan keterampilan menulis? |
| 6 | Metode atau teknik apa yang biasanya Bapak/Ibu gunakan untuk mengajarkan menulis kepada siswa tunagrahita? |
| 7 | Apa yang menurut Bapak/Ibu paling efektif dalam membantu siswa tunagrahita belajar menulis? |
| 8 | Bagaimana Bapak/Ibu biasanya mengatasi kesulitan siswa dalam menulis, terutama terkait kemampuan motorik atau pemahaman huruf? |
| 9 | Bagaimana cara menilai perkembangan keterampilan menulis siswa tunagrahita? |
| 10 | Seberapa sering siswa tunagrahita dalam menggunakan handphone? |
| 11 | Apakah di SLB ini sudah menggunakan aplikasi digital dalam pembelajaran menulis? |
| 12 | Apakah ada saran atau masukan terkait hal-hal spesifik yang perlu diperhatikan dalam pengembangan aplikasi ini, baik dari segi desain, fitur, atau interaksi dengan siswa? |

### 3.3.2. Perancangan

Tahap perancangan adalah proses pengembangan rincian teknis dari aplikasi berdasarkan kebutuhan pengguna yang telah diidentifikasi pada tahap analisis. Proses perancangan ini mencakup beberapa langkah penting:

**a. Perancangan Use Case Diagram**

Langkah awal dalam tahap perancangan adalah pembuatan diagram use case untuk aplikasi. Diagram use case adalah representasi visual yang menunjukkan hubungan antara pengguna (aktor) dan sistem (aplikasi). Diagram ini digunakan untuk mengilustrasikan fungsionalitas sistem dari sudut pandang pengguna secara general.

**b. Perancangan Activity Diagram**

Activity diagram dibuat untuk memvisualisasikan proses bisnis atau alur kerja dalam aplikasi. Diagram ini menggambarkan rangkaian langkah atau aktivitas yang harus dilakukan oleh sistem untuk menyelesaikan sebuah tugas atau proses tertentu.

**c. Perancangan Data Schema**

Langkah ini mencakup analisis dan perancangan struktur data untuk aplikasi menggunakan pendekatan basis data NoSQL Firebase. Data schema meliputi entitas yang terlibat, dokumen, atribut-atribut beserta tipe data, dan relasi database. Pemilihan schema yang sesuai sangat penting untuk meningkatkan performa aplikasi dan efisiensi dalam pengolahan data.

**d. Perancangan Arsitektur Aplikasi**

Langkah ini melibatkan perancangan arsitektur aplikasi yang meliputi struktur, komponen, dan interaksi antar komponen dalam aplikasi yang akan dibuat. Aplikasi ini dirancang menggunakan pola arsitektur Model-View-ViewModel (MVVM) untuk memastikan manajemen kode yang baik dan terstruktur.

### 3.3.3. Implementasi

Tahap implementasi adalah proses pengembangan kode program berdasarkan rancangan yang telah dibuat pada tahap perancangan. Proses ini melibatkan beberapa langkah yang cukup penting, antara lain:

**a. Implementasi Model Machine Learning**

Pada tahap ini, proses implementasi model machine learning dilakukan menggunakan bahasa pemrograman python yang dilakukan dalam platform Kaggle Notebook. Proses ini mengacu pada metode Cross Industry Standard Process for Data Mining (CRISP-DM). Metode ini merupakan pendekatan yang terstruktur dan sistematis untuk menjalankan proyek data mining, mulai dari memahami kebutuhan bisnis hingga penerapan model di tahap production. Tahapan ini meliputi: Business Understanding, Data Understanding, Data Preparation, Modeling, Evaluation, dan Deployment [49].

**b. Implementasi Design UI/UX**

Pada tahap ini, desain user interface dan user experience (UI/UX) dibuat menggunakan Figma berdasarkan analisis dan kebutuhan pengguna yang telah dilakukan peneliti sebelumnya oleh Taufik Kemal Thaha menggunakan metode Lean UX dengan dua kali proses iterasi [50]. Setelah desain UI/UX selesai, langkah berikutnya adalah mengubah desain yang terdapat di Figma menjadi kode XML. Proses ini disebut dengan slicing, di mana setiap elemen dari desain seperti tombol, form, gambar, dan teks dikonversi ke dalam format XML yang sesuai untuk pengembangan aplikasi Android.

**c. Implementasi Logika dan Arsitektur**

Langkah terakhir adalah menambahkan logika aplikasi ke dalam class Kotlin. Ini mencakup implementasi fungsionalitas aplikasi, seperti pengelolaan data, pengolahan input pengguna, dan interaksi antar komponen aplikasi. Logika ini memastikan bahwa fitur-fitur yang sudah dirancang berfungsi dengan baik sesuai dengan alur dan kebutuhan pengguna.

Setelah itu, arsitektur Model-View-ViewModel (MVVM) diimplementasikan untuk memisahkan logika presentation, pengolahan data, dan interaksi pengguna. Model menangani data dan bisnis logika, View mengelola tampilan antarmuka pengguna, dan ViewModel berfungsi sebagai penghubung antara Model dan View. Pendekatan ini membantu dalam pengelolaan kode yang lebih rapi dan mempermudah maintenance aplikasi kedepannya.

### 3.3.4. Pengujian

Pengujian merupakan tahap terakhir dalam proses pengembangan aplikasi, di mana aplikasi yang telah selesai dikembangkan akan diuji untuk memastikan semua fungsionalitas beroperasi dengan baik dan sesuai dengan harapan. Pengujian aplikasi terdiri dari tiga tahap, yaitu black box testing, responsive testing, dan User Acceptance Testing (UAT). Pengujian responsive testing tidak melibatkan pengguna, sedangkan black box testing dan User Acceptance Testing (UAT) melibatkan pengguna.

**a. Black Box Testing**

Black box testing adalah metode pengujian perangkat lunak yang fokus pada fungsionalitas sistem tanpa memperhatikan struktur kode internal. Black box testing atau behavioral testing menguji perangkat lunak berdasarkan perilaku (input-output) dari suatu aplikasi, bukan melihat ke dalam kode program secara detail [51]. Dengan demikian, penguji dapat membuat skenario pengujian berdasarkan spesifikasi kebutuhan tanpa perlu memahami bahasa pemrograman yang digunakan. Metode ini berperan penting dalam memvalidasi fungsionalitas sistem, karena dapat ditemukan kesalahan (bug) yang terlihat pada keluaran sistem. Kelebihan black box testing adalah tester tidak perlu memiliki pengetahuan pemrograman atau detail implementasi aplikasi sehingga lebih mudah dilakukan oleh pengguna awam.

**b. Responsive Testing**

Responsive testing merupakan pengujian yang memastikan bahwa tampilan dan fungsi suatu aplikasi tampil dengan baik di berbagai perangkat dan ukuran layar. Proses ini sangat penting untuk memastikan bahwa aplikasi dapat digunakan dengan lancar dan tanpa kendala, terlepas dari jenis perangkat yang digunakan oleh pengguna. Responsive testing dilakukan dengan cara menguji aplikasi pada beberapa perangkat berbeda, antara lain: tablet, ponsel, dan emulator untuk memastikan bahwa semua fungsionalitas dan tampilan berjalan dengan baik dan tidak rusak [52].

**c. User Acceptance Testing (UAT)**

User Acceptance Testing (UAT) adalah tahap pengujian terakhir sebelum aplikasi dirilis atau digunakan oleh pengguna secara langsung. Hal ini diperkuat oleh penelitian terbaru, yang menjelaskan bahwa UAT bertujuan memverifikasi keberhasilan sistem terhadap persyaratan pengguna dan kemampuan sistem dalam mengakomodasi skenario bisnis nyata [53]. Pada tahap ini, pengguna akhir, yaitu guru dan perwakilan siswa, memeriksa sistem untuk memastikan bahwa perangkat lunak memenuhi persyaratan dan harapan yang telah ditetapkan. Tujuan utama UAT adalah untuk mendapatkan persetujuan dari pengguna bahwa solusi media pembelajaran yang dikembangkan sudah layak dan sesuai dengan kebutuhan serta ekspektasi mereka.

Tabel 3.5 menunjukkan pertanyaan untuk skenario pengujian yang akan dilakukan.

**Tabel 3.5 Skenario Pengujian User Acceptance Testing**

| No | Skenario Pengujian |
|---|---|
| 1 | Uji coba fitur animasi penulisan huruf dan angka untuk memastikan bahwa setiap huruf dan angka dapat ditampilkan secara baik dan sesuai dengan bentuk aslinya. |
| 2 | Pengujian fitur tracing the dot bagi siswa untuk mengikuti pola penulisan huruf, angka, dan kata agar memastikan bahwa sistem dapat menilai keakuratan tracing siswa dengan tepat. |
| 3 | Pengujian fitur riwayat belajar siswa yang telah melakukan aktivitas belajar, kemudian diperiksa apakah data tersebut tersimpan dan ditampilkan dengan benar dalam histori pembelajaran masing-masing siswa. |
| 4 | Skenario pengujian CRUD untuk fitur penambahan, pengubahan, dan penghapusan materi belajar kata, kuis set, dan soal kuis untuk memastikan bahwa semua operasi berjalan tanpa error. |
| 5 | Pengujian prediksi huruf/angka/kata dan feedback otomatis dengan mengerjakan kuis menulis, lalu memverifikasi apakah sistem dapat memberikan prediksi penulisan yang akurat serta feedback otomatis yang baik berdasarkan hasil tulisan pengguna. |

Tabel 3.6 merupakan kategori penilaian dalam skala likert yang digunakan untuk menginterpretasikan hasil tingkat kepuasan dengan mengelompokkan skala ke dalam beberapa kategori.

**Tabel 3.6 Skala Penilaian Likert**

| No | Skala | Tingkat Kepuasan |
|---|---|---|
| 1 | 1 (Satu) | Sangat Buruk |
| 2 | 2 (Dua) | Buruk |
| 3 | 3 (Tiga) | Cukup |
| 4 | 4 (Empat) | Baik |
| 5 | 5 (Lima) | Sangat Baik |

Dalam pengujian ini, kritik dan saran yang diberikan akan menjadi masukan dalam pengembangan berikutnya. Penilaian yang sudah diberikan oleh penguji selanjutnya dihitung dalam skala persentase. Perhitungan akan dilakukan dengan menggunakan rumus yang terdapat dalam persamaan 3.1 berikut ini.

$$
\text{Persentase UAT} = \frac{\text{Total Skor Pengujian}}{\text{Skor Maksimal Pengujian}} \times 100\% \quad (3.1)
$$

Hasil perhitungan persentase tingkat kepuasan pengguna kemudian dapat digunakan untuk mengetahui apakah kebutuhan pengguna pada aplikasi sudah terpenuhi. Kategori kelayakan dapat digunakan sebagai acuan kelayakan aplikasi. Kategori kelayakan dapat dilihat pada Tabel 3.7 berikut.

**Tabel 3.7 Presentase Kategori Kelayakan Skala Likert**

| No | Skor | Kategori Kelayakan |
|---|---|---|
| 1 | ≤ 20% | Sangat Tidak Layak |
| 2 | 21 - 40% | Tidak Layak |
| 3 | 41 - 60% | Biasa Saja |
| 4 | 61 - 80% | Layak |
| 5 | ≥ 81% | Sangat Layak |

## 3.4. Analisis Data

Analisis data dalam pengembangan aplikasi media pembelajaran membaca untuk anak tunagrahita adalah langkah awal penting yang bertujuan untuk memahami permasalahan serta kebutuhan pengguna. Melalui tahap ini, penulis dapat merancang solusi yang lebih tepat guna dan efektif, sesuai dengan kebutuhan spesifik dari target pengguna.

**a. Identifikasi Permasalahan**

Langkah ini melibatkan identifikasi permasalahan yang dialami oleh pengajar dan siswa tunagrahita dalam proses pembelajaran menulis. Data permasalahan ini didapatkan dari hasil kuesioner dan wawancara yang telah dilakukan. Data ini digunakan sebagai acuan untuk menentukan fitur-fitur aplikasi. Tabel 3.8 merupakan daftar responden yang telah mengisi kuesioner yang telah diberikan oleh penulis.

**Tabel 3.8 Responden Kuesioner**

| No | Nama | Jenis Kelamin | Umur | Guru Kelas |
|---|---|---|---|---|
| 1 | Nur Arismanto | Laki-Laki | 40 | Kepala Sekolah |
| 2 | Sayekti Ningsih | Perempuan | 46 | XI |
| 3 | Mumtaz Dzaky | Laki-Laki | 27 | I-VI |
| 4 | Suparmi | Perempuan | 47 | III |
| 5 | Adnan Prasetya | Laki-Laki | 37 | XII |

Dari hasil kuesioner yang diisi oleh 5 perwakilan guru yang terlihat pada Gambar 3.2, terdapat variasi jumlah siswa yang diajar oleh tiap-tiap guru. Berdasarkan lima tanggapan yang diterima, jumlah siswa yang diajar berada dalam rentang antara 4 hingga 10 siswa. Jawaban yang diberikan mencakup angka 4, 6, 7, 9, dan 10 yang menunjukkan bahwa jumlah siswa yang dilibatkan dalam kegiatan pembelajaran berbeda-beda tergantung pada kondisi siswa dan rombongan belajar kelas.

**Gambar 3.2 Jumlah Siswa yang Diajar Guru**

> _(Sisipkan gambar di sini)_

Persentase jumlah siswa yang dapat menulis untuk rata-rata tiap rombongan belajar terlihat pada Gambar 3.3. Grafik menunjukkan bahwa presentase 50% mendominasi jawaban responden, artinya masih terdapat setengah dari jumlah siswa dalam setiap rombongan belajar yang mengalami kendala dalam menulis. Hal ini mengindikasikan bahwa kemampuan menulis siswa belum merata dan masih memerlukan pembelajaran menulis, khususnya dalam keterampilan motorik halus dan pemahaman bentuk huruf. Selain itu, adanya respon dengan persentase 25% dan 75% juga menunjukkan adanya ketimpangan capaian belajar antar rombongan belajar.

**Gambar 3.3 Kemampuan Menulis Siswa**

> _(Sisipkan gambar di sini)_

Tabel 3.9 menunjukkan hasil responden kuesioner siswa yang masih mengalami kendala secara spesifik dalam kemampuan menulis.

**Tabel 3.9 Tabel Kendala Kemampuan Menulis Siswa**

| Jenis Kemampuan | Adanya Kendala |
|---|---|
| Mengenal cara menulis huruf | Ya |
| Menulis huruf kapital | Ya |
| Menulis huruf non-kapital | Ya |
| Menulis kata | Ya |
| Menulis angka | Ya |

Hasil wawancara yang dilakukan oleh penulis dengan bapak Nur Arismanto S.Pd selaku kepala sekolah SLB Tegar Harapan Yogyakarta dapat dilihat pada Tabel 3.10.

**Tabel 3.10 Hasil Wawancara**

| No | Pertanyaan | Jawaban |
|---|---|---|
| 1 | Berapa lama Bapak/Ibu sudah mengajar siswa tunagrahita di SLB ini? | Saya sudah menjadi guru selama 24 tahun. Selama masa penugasan, saya pernah mengajar berbagai jenis kebutuhan khusus, termasuk anak tunarungu, tunadaksa, dan tunagrahita. |
| 2 | Berapa jumlah siswa tunagrahita di sekolah ini? | Tunarungu 2, tunadaksa 3, tunanetra 1, dan tunagrahita 47 |
| 3 | Bagaimana rentang usia di setiap tingkat sekolah (SD, SMP, dan SMA)? | Dalam sistem penerimaan murid baru (SPMB), batas usia maksimal untuk menjadi siswa SLB adalah 25 tahun. Jika calon siswa belum pernah mengikuti jenjang pendidikan sebelumnya, maka harus dimulai dari jenjang SD terlebih dahulu, tidak boleh langsung loncat ke jenjang yang lebih tinggi. |
| 4 | Berapa jumlah guru/pengajar dan kelas di SLB ini? | 9 guru untuk setiap rombongan belajar. Pengelompokan kelas tidak selalu mengikuti jenjang secara ketat misalnya, kelas 1 dan 2 SD dapat digabung menjadi satu rombongan belajar. |
| 5 | Apa tantangan terbesar yang Bapak/Ibu hadapi saat mengajar siswa tunagrahita, khususnya dalam mengajarkan keterampilan menulis? | Hambatan dalam intelegensi, yang berdampak pada seluruh aspek perkembangan siswa, termasuk sosial, psikis, motorik halus maupun kasar. Dalam keterampilan menulis, mereka mengalami kesulitan dalam hal konsentrasi antara gerakan dan pikiran. Pemahaman mereka yang terbatas juga menghambat proses belajar menulis. Kemampuan motorik halus juga harus dilatih dari tahap pra-menulis hingga mereka benar-benar bisa menulis dengan baik. Semua itu memerlukan proses yang bertahap dan berkelanjutan. |
| 6 | Metode atau teknik apa yang biasanya Bapak/Ibu gunakan untuk mengajarkan menulis kepada siswa tunagrahita? | Harus konkret dan nyata. Materi pembelajaran perlu diwujudkan secara visual, misalnya melalui media gambar seperti gambar baju. Setelah siswa mengenali dan menghafal gambar tersebut, baru media visual secara bertahap boleh dihilangkan agar siswa bisa menulis tanpa bantuan gambar. |
| 7 | Apa yang menurut Bapak/Ibu paling efektif dalam membantu siswa tunagrahita belajar menulis? | Latihan berulang (drill) dalam mengenal vokal dan konsonan, yang kemudian digabungkan menjadi suku kata atau kata. Materi abstrak harus disesuaikan agar menjadi lebih konkret dan mudah dipahami. Tidak ada unsur paksaan yang penting adalah mereka bisa memahami dan menggunakan keterampilan menulis secara baik dalam kehidupan mereka. |
| 8 | Bagaimana Bapak/Ibu biasanya mengatasi kesulitan siswa dalam menulis, terutama terkait kemampuan motorik atau pemahaman huruf? | Harus dikonkretkan agar siswa tidak hanya berpersepsi tanpa memahami makna sebenarnya. Penting untuk memastikan bahwa mereka memahami dasar-dasar menulis, seperti bentuk dan makna huruf, sebelum melangkah lebih jauh. Dan juga, karakter sosial dan emosi siswa juga harus diperhatikan, karena hal tersebut sangat mempengaruhi kemampuan mereka dalam belajar dan menerima materi. |
| 9 | Bagaimana cara menilai perkembangan keterampilan menulis siswa tunagrahita? | Menulis di udara untuk melatih koordinasi gerak dan mengenal bentuk huruf. Setelah itu dilanjutkan dengan menulis di atas kertas, dan terakhir menghubungkan titik-titik pada huruf. |
| 10 | Seberapa sering siswa tunagrahita dalam menggunakan handphone? | Penggunaan handphone diperbolehkan, terutama untuk keperluan pembelajaran. Sekolah juga menyediakan fasilitas notebook untuk mendukung proses belajar siswa. |
| 11 | Apakah di SLB ini sudah menggunakan aplikasi digital dalam pembelajaran menulis? | Saat ini belum pernah. |
| 12 | Apakah ada saran atau masukan terkait hal-hal spesifik yang perlu diperhatikan dalam pengembangan aplikasi ini, baik dari segi desain, fitur, atau interaksi dengan siswa? | Fitur yang menarik, sederhana tapi mudah digunakan, karena anak tunagrahita susah berpikir kompleks. |

**b. Fitur dan Kebutuhan Pengguna**

Langkah ini merupakan identifikasi serta menentukan fitur prioritas yang akan diintegrasikan ke dalam aplikasi media pembelajaran menulis. Fitur-fitur ini ditentukan berdasarkan permasalahan spesifik yang telah diidentifikasi pada tahap sebelumnya. Oleh karena itu, langkah ini bertujuan untuk memastikan bahwa fitur-fitur yang akan dikembangkan benar-benar sesuai dan relevan dengan kebutuhan dan kondisi nyata yang dihadapi oleh pengguna sehingga aplikasi yang akan dikembangkan dapat memenuhi tujuan utamanya dengan lebih efektif. Prioritas fitur berdasarkan hasil analisis permasalahan dan kebutuhan pengguna dapat dilihat pada tabel 3.11.

**Tabel 3.11 Tabel Prioritas Fitur**

| Fitur | Prioritas |
|---|---|
| Animasi Menulis Angka | Diperlukan |
| Animasi Menulis Huruf Kapital | Diperlukan |
| Animasi Menulis Huruf Non-Kapital | Diperlukan |
| Latihan Tracing Angka | Diperlukan |
| Latihan Tracing Huruf Kapital | Diperlukan |
| Latihan Tracing Huruf Non-Kapital | Diperlukan |
| Latihan Tracing Kata | Diperlukan |
| CRUD Soal Latihan Menulis | Diperlukan |
| Riwayat Belajar Menulis | Diperlukan |
| Kuis Menulis Dengan Fitur Handwriting Recognition | Mungkin Akan Membantu |
| Feedback Otomatis Pada Kuis Menulis | Akan Membantu |

## 3.5. Perancangan

Tahap perencanaan adalah proses pembuatan rancangan sistem berdasarkan analisis kebutuhan pengguna yang telah dilakukan pada tahap sebelumnya. Proses ini melibatkan beberapa langkah penting:

**a. Perancangan Bisnis Aplikasi**

Pada Gambar 3.4, penulis merancang diagram bisnis aplikasi yang berfungsi untuk menggambarkan alur interaksi utama antara guru dan murid dalam proses pembelajaran menulis melalui aplikasi. Guru memiliki peran dalam pengelolaan akun murid, serta guru dapat menyusun materi pembelajaran dan kuis menulis yang akan diakses oleh murid. Di sisi lain, murid dapat mempelajari empat jenis materi yaitu menulis huruf kapital & non-kapital, angka, serta berlatih menulis kata sesuai dengan tingkat kesulitannya. Murid juga dapat mengerjakan kuis, melihat rekap hasil, dan mendapatkan feedback atas hasil latihannya.

**Gambar 3.4 Diagram Bisnis Aplikasi**

> _(Sisipkan gambar di sini)_

**b. Perancangan Use Case Diagram**

Pada tahap ini, Use Case Diagram dirancang berdasarkan analisis kebutuhan yang telah dibuat sebelumnya. Use Case Diagram digunakan untuk menggambarkan interaksi antara pengguna dan sistem, serta memberikan gambaran mengenai alur kerja sistem secara general. Dalam use case yang dirancang, guru dan siswa berperan sebagai aktor atau pengguna aplikasi. Pengguna ini memiliki akses ke fitur-fitur yang terdapat pada aplikasi. Untuk Use Case Diagram yang telah dirancang dapat dilihat pada Gambar 3.5.

**Gambar 3.5 Use Case Diagram Aplikasi**

> _(Sisipkan gambar di sini)_

Tabel 3.12 menjelaskan skenario akses fitur "Menulis Huruf" pada aplikasi, di mana aktor yang berperan sebagai "Siswa" berinteraksi dengan user interface aplikasi yang mencakup halaman menu utama, menu tulis huruf, halaman materi tulis huruf, dan halaman latihan tulis huruf. Sebagai prasyarat, pengguna harus telah melakukan login sebelumnya. Alur utama dalam tabel ini menguraikan langkah-langkah yang dimulai dengan Siswa membuka aplikasi, memilih menu tulis huruf, memilih salah satu huruf dari daftar pilihan A-Z yang ditampilkan oleh sistem, dan akhirnya, sistem menampilkan materi serta latihan soal huruf abjad yang dipilih. Tabel ini memberikan gambaran terperinci mengenai proses yang harus dilalui Siswa untuk mengakses fitur "Menulis Huruf" dalam aplikasi.

**Tabel 3.12 Use Case Scenario Melakukan Akses Fitur Menulis Huruf**

| Field | Deskripsi |
|---|---|
| Judul Skenario | Melakukan Akses Fitur Menulis Huruf |
| Deskripsi | Aktor melakukan akses fitur menulis huruf |
| Aktor & Interface | Aktor: Siswa<br>Interface: halaman menu utama, menu tulis huruf, halaman materi tulis huruf, halaman latihan tulis huruf |
| Pre-Condition | Pengguna sudah melakukan login |
| Basic Flow | - Aktor membuka aplikasi<br>- Sistem menampilkan menu utama<br>- Aktor memilih tulis huruf<br>- Sistem menampilkan pilihan huruf A-Z<br>- Aktor memilih salah satu huruf<br>- Sistem menampilkan materi dan latihan soal huruf abjad |
| Post-Condition | Siswa berhasil membuka halaman materi dan soal tulis huruf |
| Alternative(s) Flow | - |

Tabel 3.13 menjelaskan skenario akses fitur "Menulis Kata" pada aplikasi, di mana aktor yang berperan sebagai "Siswa" berinteraksi dengan user interface aplikasi yang meliputi halaman menu utama, menu tulis kata, dan halaman latihan tulis kata. Prasyarat untuk mengakses fitur ini adalah pengguna harus terlebih dahulu melakukan login. Alur utama dalam tabel ini mengilustrasikan langkah-langkah yang dimulai dengan Siswa membuka aplikasi, memilih menu tulis kata, lalu sistem menampilkan menu tulis kata, dan Siswa memilih pilihan kata yang ingin dipelajari. Selanjutnya, sistem akan menampilkan soal latihan tulis kata. Tabel ini memberikan gambaran rinci tentang proses yang harus dilakukan Siswa untuk mengakses fitur "Menulis Kata" dalam aplikasi.

**Tabel 3.13 Use Case Scenario Melakukan Akses Fitur Menulis Kata**

| Field | Deskripsi |
|---|---|
| Judul Skenario | Melakukan Akses Fitur Menulis Kata |
| Deskripsi | Aktor melakukan akses fitur menulis kata |
| Aktor & Interface | Aktor: Siswa<br>Interface: halaman menu utama, menu tulis kata, halaman latihan tulis kata |
| Pre-Condition | Pengguna sudah melakukan login |
| Basic Flow | - Aktor membuka aplikasi<br>- Sistem menampilkan menu utama<br>- Aktor memilih tulis kata<br>- Sistem menampilkan menu tulis kata<br>- Aktor memilih pilihan kata<br>- Sistem menampilkan latihan soal tulis kata |
| Post-Condition | Guru berhasil membuka halaman materi dan soal tulis kata |
| Alternative(s) Flow | - |

Tabel 3.14 menggambarkan skenario akses fitur "Menulis Angka" pada aplikasi, di mana aktor yang berperan sebagai "Siswa" berinteraksi dengan user interface aplikasi, termasuk halaman menu utama, menu tulis angka, halaman materi tulis angka, dan halaman latihan tulis angka. Sebagai prasyarat, pengguna harus telah melakukan login sebelumnya. Alur utama dalam tabel ini mengilustrasikan langkah-langkah dimulai dari Siswa membuka aplikasi, sistem menampilkan menu utama, Siswa memilih menu tulis angka, sistem menampilkan menu tulis angka, dan Siswa memilih menu materi dan latihan tulis angka. Sistem kemudian menampilkan materi dan latihan soal angka dari 0-9. Tabel ini memberikan pemahaman yang lebih mengenai bagaimana Siswa dapat mengakses fitur "Menulis Angka" dalam aplikasi setelah proses login berhasil dilakukan.

**Tabel 3.14 Use Case Scenario Melakukan Akses Fitur Menulis Angka**

| Field | Deskripsi |
|---|---|
| Judul Skenario | Melakukan Akses Fitur Menulis Angka |
| Deskripsi | Aktor melakukan akses fitur menulis angka |
| Aktor & Interface | Aktor: Siswa<br>Interface: halaman menu utama, menu tulis angka, halaman materi menulis angka, halaman latihan menulis angka |
| Pre-Condition | Pengguna sudah melakukan login |
| Basic Flow | - Aktor membuka aplikasi<br>- Sistem menampilkan menu utama<br>- Aktor memilih tulis angka<br>- Sistem menampilkan menu tulis angka<br>- Aktor memilih menu materi dan latihan menulis kalimat<br>- Sistem menampilkan materi dan latihan soal angka dari 0-9 |
| Post-Condition | Siswa berhasil membuka halaman materi dan soal tulis angka |
| Alternative(s) Flow | - |

Tabel 3.15 menggambarkan skenario akses fitur "Kuis Menulis" pada aplikasi, di mana aktor yang berperan sebagai "Siswa" berinteraksi dengan user interface aplikasi, termasuk halaman menu utama, menu kuis menulis, halaman pengerjaan kuis menulis, dan halaman hasil pengerjaan soal. Sebagai prasyarat, pengguna harus telah melakukan login sebelumnya. Alur utama dalam tabel ini mengilustrasikan langkah-langkah dimulai dari Siswa membuka aplikasi, sistem menampilkan menu utama, Siswa memilih menu ujian, sistem menampilkan menu ujian tulis, Siswa memilih menu ujian tulis, dan sistem menampilkan soal dan ujian tulis. Setelah Siswa menyelesaikan ujian tulis, sistem akan memproses hasil tulisan tangan menggunakan fitur Handwriting Recognition. Fitur ini akan mengklasifikasikan tulisan tangan siswa untuk mencocokkan jawaban dan soal. Serta terdapat fitur feedback otomatis mengenai penulisan siswa menggunakan API Google Gemini. Tabel ini memberikan pemahaman yang lebih tentang bagaimana Siswa dapat mengakses fitur "Kuis Menulis" dalam aplikasi setelah proses login berhasil dilakukan, termasuk penggunaan teknologi Handwriting Recognition dan pemberian feedback otomatis.

**Tabel 3.15 Use Case Scenario Melakukan Akses Fitur Kuis Menulis**

| Field | Deskripsi |
|---|---|
| Judul Skenario | Melakukan Akses Fitur Kuis Menulis |
| Deskripsi | Aktor melakukan akses fitur kuis menulis |
| Aktor & Interface | Aktor: Siswa<br>Interface: halaman menu utama, menu kuis menulis, halaman pengerjaan kuis menulis |
| Pre-Condition | Pengguna sudah melakukan login |
| Basic Flow | - Aktor membuka aplikasi<br>- Sistem menampilkan menu utama<br>- Aktor memilih menu kuis menulis<br>- Sistem menampilkan menu kuis menulis<br>- Aktor memilih kuis menulis<br>- Sistem menampilkan soal kuis menulis<br>- Aktor mengerjakan soal kuis menulis<br>- Sistem menampilkan hasil tulisan tangan dan memberikan feedback otomatis |
| Post-Condition | Siswa berhasil menyelesaikan kuis menulis hingga mendapatkan hasil prediksi dan feedback dari sistem |
| Alternative(s) Flow | - |

Tabel 3.16 memberikan gambaran skenario akses fitur "Riwayat Belajar" pada aplikasi, di mana aktor yang berperan sebagai "Guru & Siswa" berinteraksi dengan user interface aplikasi, termasuk halaman menu utama, menu riwayat belajar, tiap-tiap halaman riwayat belajar. Sebagai prasyarat, pengguna harus telah melakukan login sebelumnya. Alur utama dalam tabel ini mengilustrasikan langkah-langkah dimulai dari Guru/Siswa membuka aplikasi, sistem menampilkan menu utama, memilih menu riwayat belajar, sistem menampilkan pilihan riwayat belajar dari tiap sub-belajar, dan memilih salah satu riwayat belajar. Sistem kemudian menampilkan riwayat belajar dari sub-belajar yang dipilih.

**Tabel 3.16 Use Case Scenario Melakukan Akses Fitur Riwayat Belajar**

| Field | Deskripsi |
|---|---|
| Judul Skenario | Melakukan Akses Fitur Riwayat Belajar |
| Deskripsi | Aktor melakukan akses fitur riwayat belajar |
| Aktor & Interface | Aktor: Guru & Siswa<br>Interface: halaman menu utama, halaman menu riwayat belajar, halaman riwayat belajar |
| Pre-Condition | Pengguna sudah melakukan login |
| Basic Flow | - Aktor membuka aplikasi<br>- Sistem menampilkan menu utama<br>- Aktor memilih riwayat belajar<br>- Sistem menampilkan menu riwayat belajar<br>- Aktor memilih salah satu menu riwayat belajar (tulis kata, tulis angka, tulis huruf)<br>- Sistem menampilkan riwayat belajar |
| Post-Condition | Guru & Siswa berhasil membuka halaman riwayat belajar |
| Alternative(s) Flow | - |

Tabel 3.17 menggambarkan skenario akses fitur "CRUD Kuis Set" pada aplikasi, di mana aktor yang berperan sebagai "Guru" berinteraksi dengan user interface aplikasi, termasuk halaman menu utama, halaman kuis menulis, halaman list soal kuis, dan halaman tambah/ubah soal kuis. Sebagai prasyarat, pengguna harus telah melakukan login sebelumnya. Alur utama dalam tabel ini mengilustrasikan langkah-langkah dimulai dari Guru membuka aplikasi, sistem menampilkan menu utama, Guru memilih menu kuis menulis, sistem menampilkan halaman kuis menulis dan Guru mengakses tombol icon "pensil" untuk menuju halaman list soal kuis. Kemudian terdapat tombol icon "+" atau floating action button di pojok kanan bawah halaman yang berfungsi untuk menuju halaman tambah/ubah soal kuis. Guru harus mengisi pertanyaan, jawaban, dan tipe soal yang akan ditambahkan.

**Tabel 3.17 Use Case Scenario Melakukan Akses CRUD Kuis Set**

| Field | Deskripsi |
|---|---|
| Judul Skenario | Melakukan Akses CRUD Kuis Set |
| Deskripsi | Aktor melakukan akses fitur CRUD Kuis Set |
| Aktor & Interface | Aktor: Guru<br>Interface: halaman menu utama, halaman menu kuis menulis, pop up dialog tambah kuis set |
| Pre-Condition | Pengguna sudah melakukan login |
| Basic Flow | - Aktor membuka aplikasi<br>- Sistem menampilkan menu utama<br>- Aktor memilih menu kuis menulis<br>- Sistem menampilkan halaman kuis menulis<br>- Aktor memilih tombol icon "+"<br>- Sistem menampilkan pop up dialog penambahan kuis set<br>- Aktor mengisi nama dan deskripsi kuis set<br>- Sistem otomatis menutup pop up dialog dan menampilkan kuis set berbentuk card dalam list |
| Post-Condition | Guru berhasil berhasil menambahkan kuis set |
| Alternative(s) Flow | - |

Tabel 3.18 menggambarkan skenario akses fitur "CRUD Soal Kuis" pada aplikasi, di mana aktor yang berperan sebagai "Guru" berinteraksi dengan user interface aplikasi, termasuk halaman menu utama, halaman kuis menulis, halaman list soal kuis, dan halaman tambah/ubah soal kuis. Sebagai prasyarat, pengguna harus telah melakukan login sebelumnya. Alur utama dalam tabel ini mengilustrasikan langkah-langkah dimulai dari Guru membuka aplikasi, sistem menampilkan menu utama, Guru memilih menu kuis menulis, sistem menampilkan halaman kuis menulis dan Guru mengakses tombol icon "pensil" untuk menuju halaman list soal kuis. Kemudian terdapat tombol icon "+" atau floating action button di pojok kanan bawah halaman yang berfungsi untuk menuju halaman tambah/ubah soal kuis. Guru harus mengisi pertanyaan, jawaban, dan tipe soal yang akan ditambahkan.

**Tabel 3.18 Use Case Scenario Melakukan Akses Fitur CRUD Soal Kuis**

| Field | Deskripsi |
|---|---|
| Judul Skenario | Melakukan Akses Fitur CRUD Soal Kuis |
| Deskripsi | Aktor melakukan akses fitur CRUD Soal Kuis |
| Aktor & Interface | Aktor: Guru<br>Interface: halaman menu utama, halaman menu kuis menulis, halaman list soal kuis, halaman tambah/edit soal kuis |
| Pre-Condition | Pengguna sudah melakukan login |
| Basic Flow | - Aktor membuka aplikasi<br>- Sistem menampilkan menu utama<br>- Aktor memilih menu kuis menulis<br>- Sistem menampilkan menu kuis menulis<br>- Aktor memilih salah satu kuis set yang telah dibuat<br>- Sistem menampilkan halaman list soal<br>- Aktor mengakses tombol icon "+"<br>- Sistem menuju ke halaman tambah/edit soal kuis<br>- Aktor mengisi pertanyaan, jawaban, dan tipe soal |
| Post-Condition | Guru berhasil menambahkan soal kuis dalam kuis set |
| Alternative(s) Flow | - |

**c. Perancangan Activity Diagram**

Langkah ini mencakup pembuatan activity diagram untuk memvisualisasikan alur aktivitas yang terjadi dalam sistem. Diagram tersebut dirancang untuk menunjukkan alur interaksi antara pengguna dengan sistem aplikasi. Melalui activity diagram, aktivitas yang dilakukan pengguna dalam aplikasi dapat terlihat secara jelas. Aktivitas-aktivitas tersebut dirancang berdasarkan Use Case yang telah disusun sebelumnya.

**1) Diagram Menulis Huruf**

Pada gambar 3.6 menunjukkan bahwa diagram ini menggambarkan alur aktivitas pengguna dalam proses belajar menulis huruf menggunakan aplikasi. Aktivitas dimulai dengan pengguna membuka aplikasi, dilanjutkan dengan memilih menu menulis pada halaman utama. Setelah itu, pengguna dapat memilih menu menulis huruf, di mana sistem menampilkan pilihan huruf dari A hingga Z. Pengguna kemudian memilih salah satu huruf, dan sistem menampilkan materi serta latihan soal terkait huruf abjad yang dipilih.

**Gambar 3.6 Activity Diagram Menulis Huruf**

> _(Sisipkan gambar di sini)_

**2) Diagram Menulis Kata**

Gambar 3.7 adalah Activity Diagram yang menggambarkan langkah-langkah menulis kata dalam aplikasi. Aktivitas dimulai dengan pengguna membuka aplikasi, yang kemudian diarahkan ke halaman menu utama. Selanjutnya, pengguna memilih menu menulis yang membawa mereka ke halaman belajar menulis. Pengguna kemudian memilih menu menulis kata, dan sistem menampilkan daftar pilihan kata. Setelah pengguna memilih salah satu kata, sistem akan menampilkan materi dan latihan soal yang terkait dengan kata tersebut.

**Gambar 3.7 Activity Diagram Menulis Kata**

> _(Sisipkan gambar di sini)_

**3) Diagram Menulis Angka**

Gambar 3.8 adalah Activity Diagram yang menggambarkan langkah-langkah menulis angka dalam aplikasi. Aktivitas dimulai dengan pengguna membuka aplikasi, yang kemudian diarahkan ke halaman menu utama. Selanjutnya, pengguna memilih menu menulis yang membawa mereka ke halaman belajar menulis. Pengguna kemudian memilih menu menulis angka, dan sistem menampilkan daftar pilihan angka 0-9. Setelah pengguna memilih salah satu angka, sistem akan menampilkan materi dan latihan soal yang terkait dengan angka tersebut.

**Gambar 3.8 Activity Diagram Menulis Angka**

> _(Sisipkan gambar di sini)_

**4) Diagram Kuis Menulis**

Gambar 3.9 adalah Activity Diagram yang menggambarkan langkah-langkah ujian menulis dalam aplikasi. Aktivitas dimulai dengan pengguna membuka aplikasi, yang kemudian diarahkan ke halaman menu utama. Selanjutnya, pengguna memilih menu menulis yang membawa mereka ke halaman belajar menulis. Pengguna kemudian memilih menu ujian menulis, dan sistem menampilkan soal ujian menulis. Dalam ujian ini, pengguna dapat memilih untuk menulis secara langsung di layar atau menggunakan kamera untuk menangkap tulisan mereka. Sistem akan memproses input menggunakan fitur Handwriting Recognition. Setelah pengguna menyelesaikan ujian dan menekan tombol selesai, sistem akan menampilkan hasil ujian beserta feedback yang sesuai.

**Gambar 3.9 Activity Diagram Kuis Menulis**

> _(Sisipkan gambar di sini)_

**5) Diagram Riwayat Belajar**

Gambar 3.10 adalah Activity Diagram yang menggambarkan langkah-langkah membuka riwayat belajar siswa dalam aplikasi. Aktivitas dimulai dengan pengguna membuka aplikasi, yang kemudian diarahkan ke halaman menu utama. Selanjutnya, pengguna memilih menu riwayat belajar yang membawa mereka ke halaman riwayat belajar. Pengguna kemudian memilih salah satu sub-bab riwayat belajar dan sistem menampilkan list riwayat belajar siswa yang sudah dipelajari dan belum dipelajari ditandai dengan icon checklist.

**Gambar 3.10 Activity Diagram Riwayat Belajar**

> _(Sisipkan gambar di sini)_

**6) Diagram CRUD Kuis Set**

Gambar 3.11 adalah Activity Diagram yang menggambarkan langkah-langkah melakukan CRUD (Create, Read, Update, and Delete) Kuis Set dalam aplikasi. Aktivitas dimulai dengan pengguna membuka aplikasi, yang kemudian diarahkan ke halaman menu utama. Selanjutnya, pengguna memilih menu kuis menulis yang membawa mereka ke halaman kuis menulis. Pengguna kemudian memilih tombol floating action button dan sistem menampilkan pop up dialog penambahan kuis set. Pengguna mengisi nama dan deskripsi kuis set lalu dapat menambahkan kuis set ke dalam list kuis menulis. Apabila pengguna ingin mengubah nama dan deskripsi kuis set, pengguna dapat menahan kuis set hingga muncul pop up dialog pengubahan kuis set. Jika pengguna ingin menghapus kuis set, maka pengguna dapat mengakses tombol dengan icon "trash", lalu sistem menampilkan pop up alert yang memperingati pengguna apakah yakin ingin menghapus kuis set.

**Gambar 3.11 Activity Diagram CRUD Kuis Set**

> _(Sisipkan gambar di sini)_

**7) Diagram CRUD Soal Kuis**

Gambar 3.12 adalah Activity Diagram yang menggambarkan langkah-langkah melakukan CRUD (Create, Read, Update, and Delete) Kuis Set dalam aplikasi. Aktivitas dimulai dengan pengguna membuka aplikasi, yang kemudian diarahkan ke halaman menu utama. Selanjutnya, pengguna memilih menu kuis menulis yang membawa mereka ke halaman kuis menulis. Setelah itu, pengguna memilih icon "pensil" pada salah satu kuis set untuk mengisi kumpulan soal pada kuis set. Pengguna kemudian memilih tombol floating action button dan sistem menampilkan halaman penambahan soal kuis. Pengguna mengisi pertanyaan, jawaban, dan tipe soal kemudian sistem menambahkan soal kuis ke dalam list kuis set. Apabila pengguna ingin merubah soal kuis, pengguna dapat mengakses icon "pensil" pada salah satu kuis soal. Lalu mengubah isian yang sama dengan penambahan soal kuis. Jika pengguna ingin menghapus soal kuis, maka pengguna dapat mengakses tombol dengan icon "trash", lalu sistem menampilkan pop up alert yang memperingati pengguna apakah yakin ingin menghapus soal kuis.

**Gambar 3.12 Activity Diagram CRUD Soal Kuis**

> _(Sisipkan gambar di sini)_

**d. Perancangan Data Schema**

Pada tahap ini, struktur data yang sesuai dengan sistem berbasis Firebase NoSQL dirancang. Struktur ini mencakup definisi entitas, atribut, serta hubungan antara entitas yang dibutuhkan dalam sistem. Desain tersebut dibuat untuk memastikan bahwa sistem dapat beroperasi dengan efisien dan terstruktur dengan baik. Rincian lebih lanjut dari rancangan ini dapat dilihat pada Gambar 3.13.

**Gambar 3.13 Data Schema Aplikasi**

> _(Sisipkan gambar di sini)_

**e. Perancangan Arsitektur Aplikasi**

Pada langkah ini, arsitektur aplikasi dirancang menggunakan pendekatan Model-View-ViewModel (MVVM), yang dikenal efektif dalam pengembangan aplikasi Android. Pendekatan MVVM memisahkan logika bisnis dari antarmuka pengguna sehingga memudahkan pengelolaan, skalabilitas, dan pemeliharaan aplikasi. Gambaran umum penerapan arsitektur MVVM ini dapat dilihat pada Gambar 3.14.

**Gambar 3.14 Desain Arsitektur Aplikasi**

> _(Sisipkan gambar di sini)_

Gambar 3.15 menunjukkan pengelompokan file kotlin pada proyek aplikasi ini. Pengelompokan file ini bertujuan untuk mempermudah dalam proses pengembangan aplikasi, agar file mudah dicari dan tertata rapi.

**Gambar 3.15 Pengelompokan File pada Proyek Aplikasi**

> _(Sisipkan gambar di sini)_

## 3.6. Mekanisme Fungsional Sistem

### 3.6.1. Perhitungan dan Logika Tracing pada Aplikasi

Pada Rumus 3.2, panjang diagonal dari area tampilan dihitung menggunakan teorema Pythagoras, yaitu dengan menjumlahkan kuadrat dari Width dan Height layar, kemudian diakarkan. Dalam simulasi ini, nilai Width adalah 1080 piksel dan Height adalah 1920 piksel, maka:

$$
\text{Diagonal} = \sqrt{Width^2 + Height^2} \quad (3.2)
$$

$$
\text{Diagonal} = \sqrt{1080^2 + 1920^2} = \sqrt{4.852.800}
$$

$$
\text{Diagonal} = 2202,91 \text{ Piksel}
$$

Selanjutnya, pada Rumus 3.3 nilai toleransi ditentukan sebagai 4% dari panjang diagonal. Hal ini bertujuan agar sistem tetap adaptif terhadap berbagai ukuran layar, baik kecil maupun besar. Dengan menggunakan nilai diagonal sebesar 2202,91 piksel, diperoleh:

$$
\text{Toleransi} = 0,04 \times \text{panjang diagonal} \quad (3.3)
$$

$$
\text{Toleransi} = 0,04 \times 2202,91
$$

$$
\text{Toleransi} = 88,12 \text{ Piksel}
$$

Sebagai contoh perhitungan dapat dilihat pada Tabel 3.19. Berdasarkan tabel 3.19 dilakukan analisis jarak antara titik ideal dan titik terdekat yang digambar oleh pengguna untuk huruf "W". Evaluasi ini menggunakan Rumus 3.4 jarak Euclidean, yaitu:

$$
d(U,T) = \sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2} \quad (3.4)
$$

**Tabel 3.19 Perhitungan Rumus Euclidean**

| Stroke ke- | Titik Template (x,y) | Titik User Terdekat (x,y) | Jarak Euclidean | Tercapai (< toleransi)? |
|---|---|---|---|---|
| 1 | (100,200) | (102,199) | 1,73 | Ya |
| 2 | (130,260) | (125,255) | 3,16 | Ya |
| 3 | (160,220) | (162,218) | 2 | Ya |
| 4 | (190,280) | (300,400) | 162,78 | Tidak |

Hasil menunjukkan untuk Stroke ke-1 hingga ke-3 berhasil ditelusuri dengan baik karena jarak titik pengguna dari titik ideal berada di bawah ambang toleransi. Sedangkan Stroke ke-4 gagal karena jarak mencapai toleransi diatas 88,12 px dengan nilai 162,78 px, yang berarti terlalu jauh dari posisi jalur yang ditentukan. Dengan demikian, 3 dari 4 stroke berhasil ditelusuri, sehingga:

$$
\text{Progress Tracing} = \frac{3}{4} = 0,75 = 75\%
$$

Karena nilai ini lebih besar dari ambang keberhasilan tracing sistem (70%), maka sistem akan menganggap pengguna telah berhasil men-trace huruf "W" dengan benar.

### 3.6.2. Proses Kerja CNN

Pada Gambar 3.16 ditampilkan arsitektur Convolutional Neural Network (CNN) yang digunakan dalam proses klasifikasi tulisan tangan siswa. Arsitektur ini menerima input berupa gambar berukuran 28x28 piksel yang merepresentasikan huruf atau angka hasil tulisan tangan. Lapisan pertama adalah dua buah lapisan convolutional berurutan dengan 32 filter ukuran 28x28, masing-masing diikuti oleh proses batch normalization untuk menstabilkan distribusi data dan mempercepat pelatihan. Setelah itu, diterapkan max pooling 2D berukuran 14x14 untuk mereduksi dimensi spasial, diikuti oleh dropout untuk mencegah overfitting.

Kemudian, terdapat tiga lapisan convolutional tambahan dengan jumlah filter meningkat menjadi 64, masih diiringi oleh batch normalization, sebelum memasuki max pooling berikutnya. Lalu arsitektur menunjukkan peningkatan kompleksitas dengan lapisan convolutional sebanyak tiga buah berturut-turut menggunakan 128 filter, diikuti oleh batch normalization, dropout, dan pooling kembali. Setelah seluruh fitur diekstraksi, hasilnya diratakan menggunakan lapisan flatten, lalu diproses melalui lapisan fully connected layer (dense) sebanyak dua kali, dan dropout untuk regularisasi.

**Gambar 3.16 Arsitektur CNN pada Aplikasi**

> _(Sisipkan gambar di sini)_

Output akhir berupa 47 neuron yang masing-masing merepresentasikan class karakter dari 0-9, A-Z, dan beberapa huruf kecil tertentu, yang dipetakan ke dalam prediksi akhir tulisan tangan siswa. Arsitektur ini dirancang untuk mampu mengenali variasi tulisan tangan dengan akurasi tinggi melalui ekstraksi fitur bertahap yang dalam dan kompleks.

### 3.6.3. Proses Kerja Generative AI

Pada Gambar 3.17 menunjukkan alur proses kerja sistem aplikasi dalam memberikan feedback terhadap tulisan tangan siswa menggunakan Generative AI dari Google Gemini API. Sistem ini dirancang untuk menangkap input tracing tulisan dari siswa, lalu sistem memproses gambar tersebut, dan kemudian menghasilkan evaluasi dalam bentuk teks. Seluruh proses ini terdiri dari beberapa tahapan utama yang saling terintegrasi yang dapat dilihat pada Gambar 3.17.

**Gambar 3.17 Flowchart Proses Kerja Generative AI dalam Aplikasi**

> _(Sisipkan gambar di sini)_

Berikut adalah penjelasan tiap tahapan proses secara detail:

1. **Start**: Langkah awal ketika siswa memulai aktivitas menulis pada canvas digital yang disediakan oleh aplikasi.
2. **Tracing Input**: Pengguna menuliskan huruf, angka, atau kata di atas canvas menggunakan jari atau stylus. Input ini ditangkap sebagai data visual oleh sistem.
3. **Save as Bitmap**: Gambar hasil tulisan siswa disimpan dalam format Bitmap, yang merupakan representasi gambar digital dalam sistem Android.
4. **Preprocessing**: Hal ini dilakukan untuk mengolah data dan memastikan format input sesuai dengan kebutuhan model, yang meliputi:
   - Konversi ke grayscale
   - Binarisasi
   - Normalisasi ukuran
5. **Base64 Convert**: Setelah proses preprocessing selesai, gambar dikonversi ke dalam format teks berbasis Base64 agar dapat disisipkan ke dalam prompt sebagai bagian dari input untuk model Generative AI.
6. **Prompt**: Sistem menyusun prompt dalam bentuk teks yang berisi instruksi dan gambar dalam format Base64. Prompt ini menjelaskan kepada model Generative AI bahwa ia harus memberikan evaluasi terhadap tulisan yang diberikan.
7. **Send Gemini API**: Prompt yang telah disiapkan dikirim ke model Generative AI menggunakan request HTTP (Hypertext Transfer Protocol). Lalu, sistem akan menunggu respons dari model.
8. **Response Text Feedback**: Model Generative AI memberikan output berupa teks yang berisi feedback terhadap tulisan tangan siswa, misalnya menilai apakah tulisan sudah benar, bentuk huruf jelas, atau perlu perbaikan tertentu.
9. **End**: Proses selesai dan pengguna mendapatkan evaluasi yang bisa mereka baca dan pelajari langsung di aplikasi.
