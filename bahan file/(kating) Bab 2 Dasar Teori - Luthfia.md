## 2.2. Dasar Teori

Dasar teori adalah bagian yang digunakan untuk mendukung perancangan dan implementasi sistem. Bagian ini menguraikan dasar-dasar teori yang menjadi acuan penelitian. Dasar acuan tersebut meliputi penjelasan beberapa hal seperti surat, Laravel, Filament, OCR, dan lain lain. Seluruh penjelasan ini berfungsi sebagai landasan ilmiah yang membimbing setiap tahapan pengembangan sistem.

### 2.2.1. Surat

Berdasarkan hasil pencarian melalui KBBI (Kamus Besar Bahasa Indonesia), surat adalah alat komunikasi tertulis yang digunakan untuk menyampaikan informasi dari satu pihak ke pihak lain. Jika dikaitkan dengan suatu organisasi, surat dapat menjadi salah satu sarana penyampaian informasi secara formal dari atasan ke bawahan atau sebaliknya maupun antar organisasi. Surat yang ditulis oleh organisasi atau instansi tertentu dapat disebut sebagai naskah dinas. Dikutip dari [14], naskah dinas adalah informasi tertulis sebagai alat komunikasi kedinasan yang dibuat dan/atau dikeluarkan oleh pejabat yang berwenang di lingkungan Universitas Gadjah Mada. Melalui Peraturan Rektor tersebut, dituliskan jenis naskah dinas di lingkungan UGM diantaranya yaitu, peraturan, keputusan, surat edaran, surat dinas, surat tugas, surat pengantar, surat pengantar, surat pernyataan, dan pengumuman.

### 2.2.2. Laravel

Laravel adalah salah satu framework yang dibangun dengan PHP untuk pengembangan sistem berbasis web. Laravel memiliki sintaks yang elegan dan memiliki fitur lengkap untuk mempermudah pengembangan web [15]. Salah satu keunggulan Laravel adalah kemampuannya untuk membantu pengembangan sistem menjadi lebih cepat dan menyenangkan. Hal ini dikarenakan adanya fitur-fitur built-in seperti [16]:

a. Eloquent ORM (Object-Relational Mapping): membantu interaksi dengan database tanpa perintah SQL mentah sehingga lebih cepat dan mengurangi boilerplate.
b. Application logic melalui controllers dan routing: membantu menangani permintaan pengguna, membantu interaksi antara model dan view, serta membantu kode lebih terorganisasi.
c. Class Auto-Loading: membantu memuat class PHP yang dibutuhkan secara otomatis, dan menghilangkan pernyataan require atau include manual. Hal tersebut membuat proses pengembangan sistem menjadi cepat dan terstruktur.
d. Reverse routing: membantu memberikan nama pada Uniform Resource Locator (URL) yang telah didefinisikan. Sehingga, perubahan pada URL dasar akan mengubah semua tautan yang menggunakan reverse routing secara otomatis.
e. Migration: membantu untuk mengatur skema database sehingga proses pembuatan dan modifikasi tabel database menjadi lebih mudah dan tanpa menggunakan perintah SQL mentah.

Laravel juga mendukung pengembangan RESTful API (Application Programming Interface) dengan fitur routing khusus untuk API yang fleksibel. Selain itu, Laravel menyediakan fitur keamanan bawaan seperti CSRF protection, enkripsi data, dan hashing password untuk melindungi aplikasi dari serangan umum seperti Cross-Site Request Forgery (CSRF) dan SQL Injection [17]. Framework ini juga mendukung caching, queue management, event broadcasting, dan task scheduling untuk meningkatkan performa dan skalabilitas aplikasi [17]. Laravel memiliki pola arsitektur MVC (Model-View-Controller) [15]. Dengan pola arsitektur tersebut maka logika bisnis, antarmuka pengguna, dan pengolahan data disimpan secara lebih terstruktur. Pola ini memungkinkan pengembang untuk mengembangkan aplikasi yang mudah dipelihara dengan struktur yang mudah dipahami.

a. **Model**
Model merupakan komponen penting yang berisi representasi struktur data yang dibutuhkan oleh sistem. Bagian ini memiliki peran krusial dalam berinteraksi langsung dengan database, berfungsi sebagai penghubung utama antara view dan controller. Contoh proses yang ditangani oleh model meliputi pengambilan data pelanggan dari database, manipulasi data pelanggan, hingga pembaruan data pelanggan kembali ke dalam database. Dengan demikian, model memastikan manajemen data yang efisien dan terorganisir di seluruh sistem.

b. **View**
View adalah komponen yang berisi semua logika untuk menampilkan antarmuka pengguna. Pada komponen ini, pengguna dapat berinteraksi langsung dengan sistem. Contohnya, ini meliputi tampilan halaman profil yang berisi elemen seperti kotak teks (text boxes), daftar tarik-turun (dropdown), dan form. Komponen ini memastikan presentasi data yang jelas dan interaksi yang intuitif bagi pengguna.

c. **Controller**
Controller adalah bagian yang menjadi penghubung antara model dengan view. Bagian ini menangani logika bisnis, kontrol terhadap data melalui objek model, dan berkomunikasi dengan view untuk menampilkan hasil kepada pengguna. Sebagai contoh, ketika pengguna memasukkan data diri melalui view, maka controller akan mengolah data tersebut. Selain itu, controller juga akan memperbarui data di database menggunakan objek model user.

### 2.2.3. Filament

Filament adalah salah satu library yang dapat diintegrasikan dengan Laravel untuk mengembangkan modul administrator. Arsitektur dan komponen utama Filament terdiri dari panel builder, form builder, table builder, notifications, dan widgets [18]. Panel builder adalah bagian utama yang digunakan untuk mengonfigurasikan keseluruhan halaman dan bagian yang digunakan dalam pembuatan panel administrator, seperti dashboard, navigasi, otentikasi, dan keresponsifan antarmuka pengguna.

Form builder adalah komponen yang digunakan untuk membuat formulir dengan jenis masukan yang beragam. Melalui formulir ini, proses CRUD dapat lebih singkat dalam pengembangannya. Form builder juga mengintegrasikan model-model beserta relasinya secara efisien. Komponen ini juga memiliki validasi data bawaan yang dapat mempermudah proses pembuatan formulir. Table builder adalah komponen yang digunakan untuk membuat tabel data yang dinamis dan interaktif. Secara bawaan, tabel memiliki fitur seperti paginasi, pengurutan, pencarian, dan filterisasi data. Selain itu, terdapat komponen Notifications yang digunakan untuk menampilkan notifikasi atau pesan instan kepada pengguna seperti pesan sukses setelah menyimpan data. Selain itu, terdapat juga komponen Widgets yang digunakan untuk menampilkan informasi tambahan ke dalam dashboard, seperti grafik statistika dan ringkasan data.

### 2.2.4. Webhook

Webhook adalah mekanisme komunikasi antar-aplikasi dengan Hypertext Transfer Protocol (HTTP) yang memungkinkan proses pengiriman data secara real-time dari satu sistem ke sistem yang lain berdasarkan event yang sedang terjadi [19]. Mekanisme ini disebut juga dengan API (Application Programming Interface) callback, yaitu server akan mengirimkan (mendorong atau push) data ke URL yang telah ditentukan oleh klien untuk menerima data [19]. Dengan mekanisme ini, klien tidak perlu meminta update secara berkala kepada server, tetapi server yang akan segera memberi tahu klien jika ada event yang relevan [19]. Mekanisme kerja webhook adalah sebagai berikut [20]:

1. **Registrasi Endpoint**: klien yang menjadi pelanggan menentukan URL (Uniform Resource Locator) publik yang dapat diakses kepada server. Melalui URL ini, klien akan menerima data dari server.
2. **Pemrosesan Event**: apabila klien telah mengirimkan permintaan ke server, server akan segera menindaklanjuti dengan menjalankan sebuah event sekaligus memicu webhook terjadi. Contoh event yang dapat dijalankan oleh server adalah proses perubahan status pesanan, proses OCR, dan pendaftaran pengguna baru.
3. **Pengiriman Payload**: setelah event terjadi, server mengumpulkan data yang akan dikirimkan kembali ke klien dalam bentuk payload. Payload umumnya menggunakan format JSON (JavaScript Object Notation). Setelah payload selesai dikumpulkan, proses pengiriman ke klien dilakukan dengan HTTP POST request yang membawa payload tersebut ke endpoint yang telah diregistrasikan.
4. **Penerimaan Payload**: klien sebagai pelanggan menerima HTTP POST request tersebut. Klien dapat memproses payload seperti dengan mengekstraksi dan memvalidasi data yang dibawa.
5. **Respons HTTP**: best practice dari penggunaan webhook, klien sebagai penerima payload, sebaiknya mengembalikan respons berupa HTTP status code seperti 200 OK untuk memberitahukan kepada server bahwa payload telah diterima dan diproses.

### 2.2.5. Polling

Polling adalah mekanisme pengiriman data menggunakan HTTP yang berkebalikan dengan webhook. Jika webhook menerapkan konsep push-based, maka polling menerapkan konsep pull-based. Pada proses pengiriman data atau payload, penerima atau klien akan secara berulang memeriksa server yang memproses data untuk mengetahui apakah ada pembaharuan atau perubahan data [21]. Terdapat beberapa mekanisme polling yang sering digunakan, yaitu [21]:

a. **Regular Polling**: polling yang dilakukan secara berkala dengan interval yang tetap. Interval tersebut dapat berupa waktu yang telah ditentukan.
b. **Adaptive Polling**: polling yang dilakukan dengan interval yang dinamis berdasarkan beberapa faktor seperti perubahan data, dan beban sistem. Mekanisme ini membantu pengoptimalan penggunaan sumber daya sistem.
c. **Priority-Based Polling**: polling yang memprioritaskan sumber daya tertentu. Prioritisasi ini digunakan untuk memastikan alokasi sumber daya yang sesuai dengan kepentingan data.
d. **Grouped Polling**: polling untuk sumber daya yang telah dikelompokkan. Proses polling dilakukan secara kolektif sehingga mengurangi jumlah request polling yang dikirim.
e. **Asynchronous Polling**: polling dilakukan secara asinkron sehingga proses lain dapat tetap berjalan sambal menunggu respons.

### 2.2.6. Optical Character Recognition (OCR)

Optical Character Recognition (OCR) adalah teknologi yang digunakan untuk proses konversi teks dari gambar secara otomatis. Metode ini mendukung proses berbagai jenis gambar seperti JPG, PNG, BMP, GIF, dan TIFF. Output yang dihasilkan dari proses ini berdasarkan masukan yang diproses. Proses OCR umumnya diawali dengan analisis gambar yang diunggah, kemudian menerjemahkan karakter dalam gambar menjadi kode karakter. Sehingga mudah untuk diedit, dicari, disimpan bahkan dapat ditampilkan dalam sebuah sistem [22]. Ada berbagai macam tools OCR yang dapat digunakan mulai dari tools berbasis online web hingga tools yang open-source dan gratis. Beberapa contoh tools yang open-source dan dapat dikonfigurasikan kembali, yaitu EasyOCR, Tesseract OCR, dan Keras OCR. Dari berbagai macam tools tersebut, mayoritas memiliki tahapan yang sama, yaitu [22]:

a. **Preprocessing**
Tahap ini adalah tahap penting dalam proses OCR karena tahap ini akan mempengaruhi hasil OCR. Pada tahap ini, dilakukan proses remove noises, penyesuaian contrast, dan background removal. Proses-proses tersebut digunakan untuk meningkatkan kualitas gambar. Hal ini dikarenakan kualitas gambar sangat mempengaruhi hasil OCR.

b. **Segmentation**
Keakuratan hasil OCR dipengaruhi oleh algoritma segmentasi yang digunakan. Segmentasi adalah proses pemecahan gambar menjadi bagian-bagian yang lebih kecil seperti page, garis, kata, hingga karakter. Segmentasi halaman, yaitu memisahkan elemen grafis dari satu halaman. Sedangkan segmentasi baris adalah memisahkan setiap baris teks dimana antar baris akan dipisahkan oleh dua titik yang berbeda. Sementara itu, segmentasi kata adalah memisahkan baris teks menjadi kata-kata sendiri. Dan segmentasi karakter adalah memisahkan karakter dari karakter lainnya.

c. **Feature Extraction**
Tahap ini merupakan proses krusial untuk menganalisis segmen teks yang telah diidentifikasi. Selanjutnya, serangkaian kriteria spesifik akan dipilih guna mengidentifikasi segmen teks tersebut secara unik. Tahap ini secara keseluruhan bertujuan untuk mengambil informasi yang paling relevan dari gambar teks. Hal ini dilakukan demi membantu proses pengenalan karakter secara lebih akurat dalam teks.

d. **Classification/Recognition**
Proses ini umumnya digunakan untuk mengenali dan mengklasifikasikan karakter berdasarkan fitur yang telah diekstraksi sebelumnya. Klasifikasi tersebut memungkinkan sistem untuk mengidentifikasi setiap karakter dengan tepat. Dengan proses ini, informasi hasil OCR akan menjadi lebih mudah dibaca oleh manusia. Selain itu, data yang telah diklasifikasikan juga akan lebih mudah dipahami dan diproses oleh mesin.

### 2.2.7. Tesseract

Tesseract adalah salah satu OCR tool terbaik yang muncul di akhir tahun 90an [10]. Alat ini mengekstraksi teks dari keseluruhan area gambar yang dimasukkan. Untuk memudahkan integrasi Tesseract dengan dengan bahasa pemrograman lain, muncul beberapa wrapper atau library yang memudahkan proses integrasi tersebut. Wrapper tersebut memungkinkan pengembang untuk menggunakan fungsionalitas Tesseract pada bahasa pemrograman yang sedang digunakan. Beberapa contoh wrapper dari Tesseract, yaitu PyTesseract (wrapper Python untuk Tesseract OCR Engine), Tesseract.js (wrapper untuk menjalankan Tesseract OCR Engine langsung di browser atau di Node.js), Tess4J (wrapper Java untuk Tesseract OCR API), Tesseract-OCR for Go (binding Go untuk Tesseract OCR), dan Php-tesseract-ocr (wrapper PHP untuk mengeksekusi perintah Tesseract) [9].

### 2.2.8. Python

Python adalah sebuah bahasa pemrograman yang digambarkan sebagai bahasa yang populer dan ampuh [23]. Bahasa ini dikenal memiliki ekosistem library yang luas dan mudah diakses. Berdasarkan karakteristik tersebut, Python banyak digunakan untuk berbagai keperluan pengembangan perangkat lunak [4]. Dalam konteks tertentu, Python juga berfungsi sebagai wrapper atau penghubung, misalnya modul PyTesseract yang memungkinkan engine Tesseract OCR dapat diakses dan digunakan dalam lingkungan Python.

### 2.2.9. PyTesseract

PyTesseract adalah sebuah wrapper Python yang berfungsi sebagai antarmuka untuk engine OCR Tesseract. Wrapper tersebut membantu engine Tesseract OCR dapat diakses dan digunakan dalam lingkungan Python [4]. Wrapper ini digunakan untuk mengekstraksi teks dari gambar. Dengan demikian, PyTesseract merupakan komponen inti dalam sistem OCR yang tujuan utamanya adalah mengekstraksi teks dari gambar yang diunggah. PyTesseract adalah alat yang ampuh dan fleksibel untuk memproses OCR di Python.

### 2.2.10. MongoDB

MongoDB adalah database NoSQL yang open-source dan cocok untuk menyimpan data dengan volume yang besar. MongoDB menjadi salah satu database NoSQL yang cukup populer. Database ini merupakan database yang memiliki arsitektur document-oriented [24]. Arsitektur ini cocok untuk data tidak terstruktur dan data semi-struktur. Sistem database ini menyimpan data dalam bentuk collections, yang bisa dikatakan sebagai tabel dalam basis data relational biasa. Collections tersebut tidak memiliki peraturan ketat dan khusus untuk skema penyimpanan datanya. Oleh karena itu, dalam satu document dapat memiliki skema yang beragam dan struktur yang berbeda dengan document lainnya dalam sebuah collections. Pada sebuah document, terdapat pasangan key-value [25]. Berikut adalah contoh document yang berisi data pengguna.

```json
{
  "_id": ObjectId("6815f97e8153c98406059e52"),
  "name": "Admin",
  "email": "admin@gmail.com"
}
```

Pada MongoDB, collections mirip dengan tabel di Relational Database Management System (RDBMS). Sedangkan document mirip dengan row dalam tabel. Jika dalam RDBMS, pengenal unik yang digunakan umumnya disebut dengan id dan dapat memiliki nama khusus, maka dalam MongoDB pengenal uniknya menggunakan _id yang bertipe Object. _id tersebut dibuat secara otomatis oleh MongoDB ketika proses penambahan document [25].

### 2.2.11. Github

Github adalah social coding platform berbasis web [26]. Melalui platform ini, para pengembang dapat berkolaborasi, menyampaikan issue yang dialami, meminta pull request, dan menyimpan kode dengan terstruktur [26]. Selain menyimpan kode milik sendiri, Github juga menyediakan fitur pencarian yang membantu pengembang menemukan pengembang lainnya, repositori milik orang lain yang dibutuhkan [27]. Repositori yang merupakan tempat menyimpan kode, memiliki dua fitur yang dapat dipilih oleh pengembang, yaitu fitur public atau private repository. Dengan fitur tersebut pengembang dapat mempublikasi kodenya dan dapat dilihat oleh pengembang lain. Selain itu, pengembang juga bisa memilih mode privat sehingga kode tersebut hanya dapat diakses oleh pengembang tertentu.

### 2.2.12. Ngrok

Ngrok adalah layanan cloud yang bersifat gratis dan open-source. Fungsi utamanya adalah membangun web tunnels yang memungkinkan proses komunikasi dengan server web lokal melalui alamat IP publik. Seperti sistem server-client pada umumnya, Ngrok bekerja berdasarkan model serupa. Salah satu alasan utama Ngrok cocok digunakan adalah dapat menyederhanakan proses dalam mengekspos localhost ke internet [28].

### 2.2.13. Metode Kanban

Kanban adalah strategi manajemen alur kerja yang mengedepankan visualisasi proses untuk efisiensi. Metode ini menggunakan papan visual yang membagi pekerjaan ke dalam tahapan-tahapan spesifik. Salah satu prinsip utamanya adalah pembatasan jumlah pekerjaan yang berlangsung bersamaan (Work In Progress), guna mencegah kemacetan dan mempercepat penyelesaian tugas. Kanban berfokus pada kelancaran pergerakan pekerjaan serta mendorong perbaikan berkelanjutan. Hasilnya, tim dapat memantau status proyek, mengidentifikasi kendala, dan meningkatkan produktivitas secara signifikan [29].

### 2.2.14. Use Case Diagram

Use case adalah salah satu jenis diagram yang digunakan untuk memvisualisasikan hal-hal yang dapat dilakukan pengguna dengan sistem [29]. Diagram ini merepresentasikan cerita pengguna (user stories) yang telah dikumpulkan dan dianalisis. Melalui representasi dalam bentuk diagram tersebut, maka proses memahami keinginan pengguna dapat lebih cepat. Use case diagram memiliki simbol-simbol tertentu yang dapat digunakan. Daftar simbol-simbol tersebut dapat dilihat pada tabel 2.2 berikut.

**Tabel 2.2. Simbol Use Case Diagram**

| Simbol | Keterangan |
|---|---|
| Aktor | merupakan simbol yang digunakan untuk memvisualisasikan pengguna yang berinteraksi dengan sistem. |
| Use case | merupakan simbol yang digunakan untuk memvisualisasikan fungsional dari sistem. |
| Association | merupakan garis yang menghubungkan aktor dengan use case. |
| Include | merupakan garis hubung yang merepresentasikan bahwa suatu use case merupakan fungsionalitas dari use case lainnya. |
| Extend | merupakan garis hubung yang merepresentasikan bahwa suatu use case merupakan tambahan fungsionalitas dari use case lainnya jika suatu kondisi terpenuhi. |

### 2.2.15. Business Process Model and Notation (BPMN) Diagram

Diagram BPMN adalah diagram yang digunakan untuk memvisualisasikan proses bisnis yang terjadi dalam suatu sistem. Diagram tersebut akan menampilkan urutan langkah-langkah suatu kegiatan dilakukan dalam satu sistem [30]. Diagram ini dirancang untuk dapat dipahami oleh semua pihak yang terlibat dalam suatu proses sehingga proses tersebut dapat dengan mudah dijalankan dan diawasi. Komponen diagram BPMN dapat dilihat pada gambar 2.3 berikut.

**Tabel 2.3. Komponen Diagram BPMN**

| Komponen | Nama | Keterangan |
|---|---|---|
| Event | | Memvisualisasikan kegiatan yang terjadi dalam satu diagram BPMN. |
| Aktivitas | | Memvisualisasikan suatu kegiatan yang dilakukan. |
| Gateway | | Memvisualisasikan percabangan dalam suatu proses. |
| Sequence flow | | Menunjukkan urutan kegiatan yang akan dilakukan dalam sebuah proses. |
| Message flow | | Menunjukkan aliran pesan antar pihak dalam sebuah proses. |
| Pool | | Visualisasi dari pelaku yang ada dalam sebuah proses. Umumnya digunakan untuk wadah aktivitas yang dilakukan pelaku. |

### 2.2.16. Class Diagram

Class diagram adalah diagram yang paling sering digunakan dalam merancang suatu sistem [31]. Diagram ini memvisualisasikan struktur sebuah kelas yang berisi nama kelas, atribut dan fungsi yang ada dalam kelas tersebut. Setiap kelas-kelas dalam diagram tersebut dihubungkan dengan garis untuk saling terhubung dan menentukan jenis hubungannya. Class diagram memiliki simbol-simbol tertentu yang dapat menjadi acuan dalam pembuatan diagram. Simbol-simbol tersebut dapat dilihat pada tabel 2.4 berikut.

**Tabel 2.4. Simbol-Simbol Class Diagram**

| Simbol | Nama | Keterangan |
|---|---|---|
| | Association | Penghubung antara objek turunan dengan objek induk |
| | Directed Association | Penghubung antara suatu kelas yang digunakan oleh kelas lain |
| | Dependency | Relasi antar kelas yang saling bergantungan |
| | Class | Himpunan objek yang saling berbagi atribut serta operasi yang sama. |

### 2.2.17. User Acceptance Testing (UAT)

User Acceptance Testing (UAT) adalah salah satu jenis pengujian sistem yang digunakan untuk menilai keefektifan dan tingkat kepuasan pengguna dalam menggunakan sistem. UAT berfungsi memastikan bahwa sistem yang telah dibuat dapat bekerja dengan baik dan sesuai dengan harapan pengguna [32]. Pengujian ini berperan krusial dalam memvalidasi fungsionalitas sistem dari perspektif pengguna akhir. Pengukuran tingkat penerimaan dan kelayakan sistem oleh pengguna dapat dilihat pada persamaan 2.1 dan 2.2 berikut.

$$rata-rata = \frac{bobot\ penilaian}{total\ responden} \tag{2.1}$$

$$persentase = \frac{rata-rata}{bobot\ maksimum} \times 100\% \tag{2.2}$$

### 2.2.18. Pengujian Performa

Pengujian performa adalah cara untuk menilai seberapa efektif sebuah sistem perangkat lunak. Tujuan utamanya adalah memastikan sistem bisa bekerja dengan baik di bawah beban tertentu. Selain itu, pengujian performa juga penting untuk mencegah terjadinya performance regression [33]. Mengutip dari [33], performance regression adalah keadaan di mana sistem bekerja dengan benar, tetapi memberikan pengalaman pengguna yang buruk. Contohnya adalah waktu respons menjadi lebih tinggi atau penggunaan sumber daya secara berlebihan dibandingkan versi sebelumnya. Keadaan ini dapat menyebabkan pengguna kurang puas, meningkatkan biaya operasional, dan bahkan menyebabkan kegagalan sistem.

Dalam pengujian performa, waktu respons adalah metrik yang sangat penting. Hal ini dikarenakan, waktu respons menunjukkan seberapa cepat sistem menanggapi permintaan pengguna. Ini merupakan aspek krusial yang langsung memengaruhi kepuasan dan pengalaman pengguna [34]. Selain waktu respons, penggunaan memori (atau memory utilization) juga merupakan metrik penting untuk mengevaluasi sistem. Metrik ini membantu mengetahui seberapa efisien sistem dalam mengelola dan menggunakan sumber daya memorinya. Penggunaan memori yang tidak efisien atau peningkatan konsumsi memori yang tidak semestinya pada versi sistem yang baru dapat menyebabkan peningkatan biaya operasional dan masalah kestabilan sistem [34].

### 2.2.19. Pengujian Akurasi

Dalam mengukur akurasi Optical Character Recognition (OCR), digunakan dua metrik utama: Word Error Rate (WER) dan Character Error Rate (CER) [24]. Pengukuran ini dilakukan dengan mengidentifikasi kata-kata yang salah eja dan karakter yang tidak dikenali dalam teks hasil OCR dibandingkan dengan teks asli (ground truth) [23]. Rumus perhitungan CER dan WER dijelaskan pada persamaan 2.3 dan 2.4, di mana CER berfokus pada kesalahan tingkat karakter (substitusi, penghapusan, penambahan), sedangkan WER menghitung kesalahan pada tingkat kata dengan definisi yang sama [35]. Metrik-metrik ini memberikan gambaran kuantitatif mengenai performa pengenalan teks oleh sistem OCR.

$$CER = \frac{S + D + I}{N} \times 100\% \tag{2.3}$$

$$WER = \frac{S + D + I}{N} \times 100\% \tag{2.4}$$
