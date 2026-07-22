# 2.2. Dasar Teori

## 2.2.1. Usaha Mikro, Kecil, dan Menengah (UMKM)

Usaha Mikro, Kecil, dan Menengah (UMKM) merupakan usaha produktif yang dimiliki oleh individu atau badan usaha dengan skala usaha kecil hingga menengah yang berperan penting dalam perekonomian nasional. Berdasarkan Undang-Undang Republik Indonesia Nomor 20 Tahun 2008 tentang Usaha Mikro, Kecil, dan Menengah, UMKM didefinisikan sebagai usaha ekonomi produktif yang berdiri sendiri yang dilakukan oleh orang perorangan atau badan usaha yang bukan merupakan anak perusahaan atau cabang perusahaan dari usaha besar [27]. Dalam berbagai penelitian, UMKM juga dipahami sebagai sektor usaha yang beroperasi secara mandiri dan memiliki kontribusi besar terhadap penyerapan tenaga kerja serta pertumbuhan ekonomi nasional [28].

## 2.2.2. Sistem Pencatatan Keuangan

Sistem pencatatan keuangan merupakan rangkaian prosedur dan metode yang digunakan untuk mencatat, mengklasifikasikan, serta melaporkan seluruh transaksi keuangan suatu entitas bisnis secara sistematis dan terstruktur. Laporan keuangan merupakan ringkasan kondisi keuangan pada waktu tertentu yang membantu pemilik usaha, manajemen, investor, dan kreditur dalam menilai kinerja keuangan dan mengambil keputusan, dengan tujuan utama menyajikan informasi mengenai posisi, kinerja, dan arus kas yang relevan bagi penggunanya [29]. Komponen utama dari sistem ini meliputi jurnal sebagai pencatatan transaksi awal, buku besar sebagai pengelompokan transaksi, serta laporan keuangan berupa neraca, laporan laba rugi, dan laporan arus kas.

Dalam praktiknya, terdapat dua pendekatan utama dalam sistem pencatatan keuangan, yaitu pencatatan secara manual dan pencatatan secara digital. Digitalisasi akuntansi pada UMKM memungkinkan penyederhanaan proses keuangan, pengurangan kesalahan, serta peningkatan akurasi dan ketepatan waktu informasi keuangan, dengan hambatan utama berupa keterbatasan sumber daya keuangan dan kurangnya keterampilan teknis [30]. Seiring berkembangnya era digital, UMKM semakin beralih ke sistem pencatatan berbasis teknologi, ditandai dengan pemrosesan transaksi yang lebih cepat dan berkurangnya ketergantungan pada pencatatan manual [30].

## 2.2.3. Dokumen Transaksi (Receipt / Invoice)

Dokumen transaksi merupakan bukti tertulis yang digunakan untuk mencatat semua aktivitas transaksi yang terjadi dalam sebuah bisnis atau perusahaan, sekaligus menjadi dasar dan acuan bagi tim akuntansi dalam menyusun laporan keuangan. Dilihat dari sumbernya, dokumen transaksi dibedakan menjadi dua jenis, yaitu bukti internal dan bukti eksternal. Bukti internal mencakup dokumen yang dibuat untuk keperluan di dalam perusahaan seperti bukti kas masuk, bukti kas keluar, dan memo. Sebaliknya, bukti eksternal mencakup dokumen yang melibatkan pihak luar perusahaan, di antaranya faktur, kuitansi, nota kontan, nota debit, nota kredit, cek, bilyet giro, dan rekening koran [31].

Dalam praktiknya, setiap jenis dokumen transaksi memiliki peran yang berbeda dalam siklus pencatatan keuangan. Sistem akuntansi penerimaan kas dalam pelaksanaannya terdiri atas beberapa dokumen, di antaranya faktur penjualan dan bukti setor bank, sedangkan pada bagian pengeluaran kas dokumen yang diperlukan berupa cek atau kuitansi yang memuat informasi mengenai nominal dan tujuan pembayaran. Keberadaan dokumen-dokumen tersebut sangat penting karena sistem informasi akuntansi penerimaan dan pengeluaran kas hanya dapat berjalan efektif apabila didukung oleh dokumen dan catatan akuntansi yang digunakan untuk mencatat setiap transaksi kas secara tertib [32].

## 2.2.4. Optical Character Recognition (OCR)

Optical Character Recognition (OCR) merupakan teknologi yang memungkinkan mesin mengenali dan menginterpretasikan teks yang dapat dibaca manusia dari sebuah gambar atau dokumen, sehingga teks tersebut dapat diolah secara elektronik. Teknologi ini digunakan secara luas sebagai metode digitalisasi dokumen tercetak agar dapat disunting, dicari, dan diproses lebih lanjut oleh sistem komputer, dengan cakupan aplikasi mulai dari pemindaian dokumen hingga ekstraksi data dari struk belanja, faktur, dan kartu identitas. Secara teknis, proses kerja OCR melibatkan beberapa tahap utama, yaitu *preprocessing* citra, segmentasi teks, ekstraksi fitur karakter, hingga klasifikasi menggunakan metode berbasis aturan tradisional maupun pendekatan modern berbasis *deep learning* seperti CNN dan RNN [33].

Berbagai model dan library OCR telah dikembangkan, mulai dari yang bersifat *open source* hingga yang berbayar. Pada kategori *open source*, Tesseract OCR merupakan mesin OCR yang paling mapan dan banyak digunakan, dikembangkan pertama kali oleh Hewlett-Packard dan kini dipelihara oleh Google dengan dukungan lebih dari 100 bahasa menggunakan arsitektur LSTM. EasyOCR merupakan library berbasis Python yang menekankan kemudahan penggunaan dengan dukungan lebih dari 80 bahasa, sedangkan PaddleOCR dari ekosistem Baidu unggul dalam pengenalan tata letak dokumen kompleks dan multibahasa [34]. Tahapan OCR secara umum meliputi *preprocessing* citra, segmentasi teks, ekstraksi fitur, serta proses klasifikasi karakter. Namun, pada penelitian ini, tahapan seperti segmentasi dan ekstraksi fitur tidak dibahas secara mendalam karena telah diintegrasikan secara otomatis dalam library OCR modern berbasis *deep learning* seperti Tesseract, EasyOCR, dan PaddleOCR. Tahapan OCR yang diterapkan secara umum dapat dilihat pada gambar 2.1 berikut.

> **[GAMBAR 2.1 — Tahapan umum OCR pada model open source]**
> *(Gambar tidak dapat ditampilkan/dibaca dari dokumen sumber — mohon sisipkan gambar secara manual pada bagian ini.)*

## 2.2.5. Image Preprocessing

*Image preprocessing* merupakan tahap awal dalam pengolahan citra yang berfungsi untuk meningkatkan kualitas visual citra agar lebih siap digunakan pada proses analisis selanjutnya, meskipun dalam banyak penelitian tahap ini hanya bersifat pendukung dan bukan fokus utama. Teknik *preprocessing* sederhana seperti penyesuaian pencahayaan (*brightness adjustment*), konversi citra berwarna menjadi *grayscale* (hitam dan putih), serta normalisasi intensitas digunakan untuk mengurangi variasi yang tidak relevan dalam citra dan mempermudah proses ekstraksi fitur pada tahap berikutnya [35]. Penyesuaian pencahayaan bertujuan untuk memperjelas objek pada citra dengan kondisi pencahayaan yang tidak merata, sedangkan konversi *grayscale* membantu menyederhanakan dimensi data tanpa menghilangkan informasi struktur penting [36]. Dengan demikian, *preprocessing* sederhana tetap memiliki peran penting dalam meningkatkan kualitas input meskipun tidak menjadi inti dari penelitian.

Dalam praktiknya, penggunaan teknik *preprocessing* sederhana sering dipilih karena efisiensi komputasi dan kemudahan implementasi, terutama pada penelitian yang berfokus pada tahap analisis utama seperti klasifikasi atau deteksi objek. Metode seperti peningkatan kontras dan pengurangan *noise* ringan digunakan secukupnya untuk memastikan gambar berada dalam kondisi optimal tanpa mengubah karakteristik asli data secara signifikan [35]. Selain itu, pendekatan ini juga menghindari kompleksitas berlebih yang dapat mempengaruhi interpretasi hasil penelitian, sehingga *preprocessing* difungsikan hanya sebagai tahap pendukung untuk meningkatkan kestabilan dan konsistensi data masukan. Oleh karena itu, pemilihan teknik *preprocessing* sederhana seperti pengaturan cahaya dan konversi *grayscale* dianggap cukup relevan untuk mendukung performa sistem tanpa menambah kompleksitas yang tidak diperlukan [36].

## 2.2.6. Tesseract OCR

Tesseract OCR merupakan *open-source* OCR *engine* yang digunakan untuk mengonversi teks dari dokumen maupun gambar menjadi data digital yang dapat diproses oleh komputer. Proses kerja Tesseract OCR terdiri dari beberapa tahapan utama yang berlangsung secara berurutan. Tahap awal adalah *image preprocessing*, seperti konversi ke *grayscale* dan *binarization* untuk memisahkan teks dari latar belakang. Selanjutnya dilakukan *page segmentation*, yaitu proses pembagian citra menjadi blok teks, baris, dan kata. Setelah segmentasi, Tesseract melakukan *feature extraction* dan pengenalan karakter menggunakan model berbasis *Long Short-Term Memory* (LSTM) yang mampu membaca urutan karakter dalam satu baris teks secara kontekstual. Tahap berikutnya adalah *decoding*, di mana hasil prediksi karakter dikombinasikan menjadi kata atau kalimat, sering kali dibantu dengan kamus (*dictionary-based correction*) untuk meningkatkan akurasi. Proses terakhir adalah *text output generation*, yaitu menghasilkan teks digital yang siap digunakan oleh sistem lain [37].

Dalam implementasinya, keberhasilan setiap tahapan tersebut sangat dipengaruhi oleh kualitas citra input, terutama pada proses segmentasi dan pengenalan karakter. Oleh karena itu, sering dilakukan *preprocessing* tambahan di luar Tesseract, seperti penghilangan *noise*, peningkatan kontras, dan koreksi kemiringan (*deskew*), guna memastikan teks dapat terdeteksi dengan baik [38]. Setelah teks berhasil dikenali, hasil OCR umumnya masih memerlukan tahap *post processing* untuk mengekstraksi informasi yang relevan sesuai kebutuhan aplikasi, misalnya menggunakan *regular expression* (regex) untuk mengambil pola tertentu dari teks. Dengan alur tersebut, Tesseract tidak hanya berfungsi sebagai alat pengenalan karakter, tetapi juga menjadi bagian dari *pipeline* ekstraksi informasi yang lebih besar [37]. Alur atau *pipeline* yang diterapkan oleh Tesseract dapat dilihat pada gambar 2.2.

> **[GAMBAR 2.2 — Pipeline yang diterapkan pada Tesseract OCR]**
> *(Gambar tidak dapat ditampilkan/dibaca dari dokumen sumber — mohon sisipkan gambar secara manual pada bagian ini.)*

## 2.2.7. EasyOCR

EasyOCR merupakan *open-source* OCR *engine* berbasis *deep learning* yang dikembangkan oleh Jaided AI, dirancang untuk mengenali teks dari gambar secara akurat dengan dukungan lebih dari 80 bahasa sekaligus. Proses kerja EasyOCR terdiri dari beberapa tahapan utama yang berlangsung secara berurutan. Tahap awal adalah *image preprocessing*, di mana citra input dinormalisasi ukuran dan warnanya untuk mempersiapkan masukan yang konsisten bagi model. Selanjutnya dilakukan *text detection* menggunakan model CRAFT (*Character Region Awareness for Text detection*), yaitu proses pendeteksian lokasi teks dalam gambar dengan mengidentifikasi area karakter dan hubungan antar karakter secara spasial. Setelah area teks terdeteksi, EasyOCR melakukan *feature extraction* dan pengenalan karakter menggunakan arsitektur gabungan ResNet untuk ekstraksi fitur visual dan LSTM untuk membaca urutan karakter secara kontekstual. Hasil dari model *recognition* kemudian diolah dalam tahap *decoding* menggunakan metode CTC (*Connectionist Temporal Classification*) dan *Greedy Decoder* untuk mengonversi prediksi urutan karakter menjadi teks dengan probabilitas tertinggi. Setelah semua proses dilalui, maka akan menghasilkan teks digital beserta *confidence score* yang siap digunakan oleh sistem lain [39]. Alur kerja EasyOCR secara lengkap dapat dilihat pada gambar 2.3.

> **[GAMBAR 2.3 — Pipeline yang diterapkan pada EasyOCR]**
> *(Gambar tidak dapat ditampilkan/dibaca dari dokumen sumber — mohon sisipkan gambar secara manual pada bagian ini.)*

## 2.2.8. PaddleOCR

PaddleOCR merupakan *open-source* OCR *engine* berbasis *deep learning* yang dikembangkan oleh Baidu PaddlePaddle, dirancang sebagai sistem OCR ringan namun berperforma tinggi dengan dukungan lebih dari 80 bahasa. Proses kerja PaddleOCR terdiri dari tiga tahapan utama yang berlangsung secara berurutan. Tahap pertama adalah *text detection* menggunakan algoritma DB (*Differentiable Binarization*), yaitu proses pendeteksian lokasi teks dalam gambar dengan menghasilkan koordinat kotak pembatas (*bounding box*) di sekitar setiap area teks secara akurat, bahkan pada teks yang miring atau melengkung. Selanjutnya dilakukan *text direction classification* untuk mendeteksi dan mengoreksi orientasi teks sebelum masuk ke tahap pengenalan. Setelah itu, PaddleOCR melakukan *text recognition* menggunakan arsitektur SVTR-LCNet (*Spatial Visual Transformer* dengan *backbone* PP-LCNet) yang menggabungkan kemampuan *transformer* dalam menangkap konteks jangka panjang dengan efisiensi model CNN yang ringan. Tahap pengenalan ini menggunakan CTC (*Connectionist Temporal Classification*) sebagai mekanisme *decoding* untuk mengonversi prediksi urutan karakter menjadi teks yang memiliki makna. Proses terakhir adalah *text output generation*, yaitu menghasilkan teks digital beserta koordinat posisi dan *confidence score* yang siap digunakan oleh sistem lain [40]. Alur kerja internal PaddleOCR secara lengkap dapat dilihat pada gambar 2.4.

> **[GAMBAR 2.4 — Pipeline yang diterapkan pada PaddleOCR]**
> *(Gambar tidak dapat ditampilkan/dibaca dari dokumen sumber — mohon sisipkan gambar secara manual pada bagian ini.)*

## 2.2.9. Metrik Evaluasi Model

Metrik evaluasi model adalah standar perhitungan yang digunakan untuk mengukur performa sistem yang telah dikembangkan. Dalam konteks sistem OCR, metrik evaluasi yang digunakan berbeda dari metrik klasifikasi pada umumnya, karena permasalahan yang diselesaikan adalah pengenalan urutan karakter dan kata dari citra, bukan klasifikasi kelas. Metrik yang umum digunakan dalam evaluasi sistem OCR mencakup *Character Error Rate* (CER), *Word Error Rate* (WER), dan waktu komputasi (*computation time*), yang masing-masing mengukur aspek akurasi dan efisiensi sistem secara berbeda [41]. Semakin rendah nilai CER dan WER, serta semakin singkat waktu komputasi, maka semakin baik performa sistem OCR yang dikembangkan. Berikut adalah penjelasan masing-masing metrik tersebut.

### 1. Character Error Rate (CER)

CER merupakan metrik yang digunakan untuk mengukur tingkat kesalahan pengenalan karakter pada sistem OCR dengan membandingkan teks hasil keluaran sistem terhadap teks referensi (*ground truth*) pada tingkat karakter. CER dihitung berdasarkan konsep *edit distance* (jarak Levenshtein), yaitu jumlah minimum operasi penyuntingan karakter yang diperlukan untuk mengubah teks hasil OCR menjadi teks referensi yang benar [41]. Operasi penyuntingan tersebut meliputi tiga jenis, yaitu *substitution* (karakter yang salah dikenali), *deletion* (karakter yang terlewat), dan *insertion* (karakter tambahan yang tidak seharusnya ada). Nilai CER berkisar antara 0 hingga 1, di mana nilai 0 menunjukkan hasil pengenalan yang sempurna. Rumus perhitungan CER adalah sebagai berikut:

$$CER = \frac{S + D + I}{N} \tag{2.1}$$

dengan:

- **S** = *Substitution* (karakter yang salah terbaca)
- **D** = *Deletion* (karakter yang tidak terbaca/hilang)
- **I** = *Insertion* (karakter tambahan yang tidak seharusnya ada)
- **N** = Jumlah total karakter pada teks referensi (*ground truth*)

### 2. Word Error Rate (WER)

WER merupakan metrik yang serupa dengan CER, namun perhitungannya dilakukan pada tingkat kata, bukan karakter. WER mengukur ketidaksesuaian antara teks hasil sistem dengan teks referensi dengan menghitung rasio jumlah penyisipan, substitusi, dan penghapusan kata terhadap total kata pada teks referensi [41]. Nilai WER umumnya lebih tinggi dibandingkan CER karena satu karakter yang salah sudah cukup untuk menjadikan seluruh kata dianggap salah. Rumus perhitungan WER adalah sebagai berikut:

$$WER = \frac{S_w + D_w + I_w}{N_w} \tag{2.2}$$

dengan:

- **S_w** = *Substitution word* (kata yang salah terbaca)
- **D_w** = *Deletion word* (kata yang tidak terbaca/hilang)
- **I_w** = *Insertion word* (kata tambahan yang tidak seharusnya ada)
- **N_w** = Jumlah total kata pada teks referensi (*ground truth*)

### 3. Waktu Komputasi (Computation Time)

Waktu komputasi adalah metrik yang digunakan untuk mengukur efisiensi sistem OCR dalam memproses sebuah *image* hingga menghasilkan teks keluaran. Metrik ini diukur dalam satuan detik dan mencerminkan kecepatan keseluruhan *pipeline* OCR, mulai dari tahap *preprocessing*, *text detection*, hingga *text recognition* [42]. Semakin singkat waktu komputasi yang dibutuhkan, semakin efisien sistem tersebut untuk digunakan dalam aplikasi.

## 2.2.10. Telegram Bot

Telegram Bot merupakan akun otomatis berbasis perangkat lunak yang beroperasi di dalam aplikasi Telegram dan mampu berinteraksi dengan pengguna melalui perintah maupun pesan teks secara *real-time*. Telegram menyediakan Bot API yang memungkinkan pengembang untuk membangun *chatbot* di dalam aplikasi Telegram guna memproses data sesuai kebutuhan pengguna [43].

Dalam implementasinya, terdapat dua mekanisme yang dapat digunakan oleh Telegram Bot untuk menerima pembaruan dari *server* Telegram, yaitu *long polling* dan *webhook*, di mana keduanya bersifat eksklusif satu sama lain. Pada mekanisme *long polling*, bot secara aktif meminta pembaruan ke *server* Telegram secara berkala. Sedangkan pada mekanisme *webhook*, Telegram akan mengirimkan HTTPS POST *request* secara otomatis ke URL *server* yang telah ditentukan setiap kali terdapat pembaruan, sehingga proses penerimaan pesan menjadi lebih efisien [44]. Alur kerja mekanisme *webhook* secara lengkap, mulai dari pengguna mengirim pesan hingga bot memberikan respons balasan, dapat dilihat pada gambar 2.5 berikut.

> **[GAMBAR 2.5 — Alur mekanisme webhook untuk Telegram Bot]**
> *(Gambar tidak dapat ditampilkan/dibaca dari dokumen sumber — mohon sisipkan gambar secara manual pada bagian ini.)*

## 2.2.11. MySQL

MySQL merupakan sebuah sistem manajemen basis data relasional (*Relational Database Management System*/RDBMS) berbasis SQL yang bersifat *open source* dan dikembangkan serta didukung oleh Oracle Corporation [45]. MySQL digunakan untuk menyimpan, mengelola, dan memproses data dalam bentuk tabel-tabel yang saling berelasi, sehingga memungkinkan pengelolaan data secara terstruktur dan efisien. Dalam implementasinya, MySQL menyediakan berbagai fitur seperti kecepatan, skalabilitas, dan keandalan tinggi, serta mendukung arsitektur client-server yang memungkinkan integrasi dengan berbagai aplikasi. Selain itu, MySQL menggunakan bahasa SQL (*Structured Query Language*) sebagai standar dalam melakukan manipulasi dan pengambilan data, sehingga banyak digunakan dalam pengembangan sistem berbasis web maupun aplikasi skala besar. Hubungan antara pengguna, DBMS MySQL, dan basis data secara keseluruhan dapat dilihat pada gambar 2.6 berikut.

> **[GAMBAR 2.6 — Diagram koneksi antara aplikasi dengan database]**
> *(Gambar tidak dapat ditampilkan/dibaca dari dokumen sumber — mohon sisipkan gambar secara manual pada bagian ini.)*

## 2.2.12. TypeScript

TypeScript adalah bahasa pemrograman yang dikembangkan oleh Microsoft dan merupakan superset dari JavaScript, yang berarti semua kode JavaScript yang valid juga dapat digunakan dalam TypeScript [46]. Bahasa ini dirancang untuk menambahkan fitur *static typing* (pengetikan statis) ke dalam JavaScript, sehingga memungkinkan pengembang untuk mendeteksi kesalahan sejak tahap penulisan kode sebelum dijalankan. TypeScript juga mendukung konsep pemrograman modern seperti *interface*, *generics*, dan *modularisasi*, yang membantu dalam membangun aplikasi yang lebih terstruktur dan mudah dipelihara. Selain itu, TypeScript dikompilasi menjadi JavaScript biasa sehingga dapat dijalankan di berbagai lingkungan seperti browser maupun server (misalnya dengan Node.js). Berdasarkan penjelasan tersebut, dapat disimpulkan bahwa TypeScript dapat membantu meningkatkan kualitas kode, keterbacaan, serta produktivitas *developer* dalam mengembangkan aplikasi berskala besar dan kompleks.

## 2.2.13. Express.js

Express.js adalah framework aplikasi web untuk Node.js yang bersifat minimalis dan fleksibel, digunakan untuk membangun aplikasi web maupun API dengan cepat dan efisien. Express menyediakan berbagai fitur dasar seperti pengelolaan *routing*, *middleware*, serta penanganan *request* dan *response* HTTP, sehingga memudahkan pengembang dalam mengatur alur komunikasi antara server dan klien [47]. Dengan pendekatan yang sederhana namun kuat, Express memungkinkan pembuatan aplikasi yang ringan sekaligus mudah dikembangkan sesuai kebutuhan.

Selain menggunakan JavaScript, Express.js juga dapat digunakan bersama TypeScript. Dengan TypeScript, *developer* dapat memanfaatkan *static typing* dan fitur tambahan lainnya untuk mengurangi kesalahan dalam kode serta meningkatkan keterbacaan dan *maintainability*. Oleh karena itu, Express cocok untuk digunakan dalam pengembangan sistem modern yang *scalable* dan terstruktur.

## 2.2.14. Next.js

Next.js adalah framework React.js berbasis JavaScript yang digunakan untuk membangun aplikasi web modern dengan performa tinggi dan SEO-*friendly*. Framework ini menyediakan berbagai fitur bawaan seperti *server-side rendering* (SSR), *static site generation* (SSG), API *routes*, dan *image optimization* [48] sehingga memudahkan pengembang dalam membuat aplikasi yang cepat, dinamis, dan mudah diakses oleh pengguna maupun mesin pencari. Dengan Next.js, pengembang dapat mengelola *routing*, halaman, dan data *fetching* dengan cara yang lebih efisien dibandingkan menggunakan React murni.

Selain JavaScript, Next.js juga mendukung penggunaan TypeScript, yang memungkinkan pengembang memanfaatkan *static typing* untuk meningkatkan kualitas kode, mendeteksi kesalahan sejak tahap pengembangan, dan membuat sistem lebih mudah dipelihara. Integrasi TypeScript di Next.js memungkinkan pembangunan aplikasi skala besar dengan lebih terstruktur, aman, dan produktif, sambil tetap memanfaatkan semua fitur modern yang ditawarkan framework ini.

## 2.2.15. RESTful API

RESTful API (*Representational State Transfer Application Programming Interface*) merupakan antarmuka pemrograman aplikasi yang dirancang berdasarkan prinsip arsitektur REST untuk memungkinkan komunikasi antar sistem melalui protokol HTTP. REST telah berkembang menjadi protokol standar dalam implementasi layanan berbasis web yang memungkinkan integrasi antar aplikasi dan platform secara luas. RESTful API mengutamakan kesederhanaan, interoperabilitas, fleksibilitas, dan skalabilitas dengan memisahkan sisi klien dan server secara tegas, serta menggunakan format data standar seperti JSON dalam komunikasinya [49]. Contoh alur komunikasi *client server* menggunakan RESTful API dapat dilihat pada gambar 2.7 berikut.

> **[GAMBAR 2.7 — Diagram alur komunikasi client dan server menggunakan RESTful API]**
> *(Gambar tidak dapat ditampilkan/dibaca dari dokumen sumber — mohon sisipkan gambar secara manual pada bagian ini.)*

## 2.2.16. Use Case Diagram

*Use case diagram* merupakan salah satu jenis diagram yang berfungsi untuk menggambarkan interaksi antara pengguna dan sistem secara visual. Diagram ini menjadi representasi dari *user stories* yang telah berhasil dikumpulkan dan dianalisis sebelumnya. Dalam penggunaannya, *use case diagram* memanfaatkan simbol-simbol UML (*Unified Modeling Language*) yang merupakan bahasa standar untuk memodelkan sistem perangkat lunak secara visual tertentu untuk merepresentasikan aktor, *use case*, serta hubungan antar keduanya, sehingga proses pemahaman terhadap kebutuhan pengguna dapat dilakukan secara lebih efisien [50]. Daftar lengkap simbol-simbol tersebut disajikan pada tabel 2.2 berikut.

**Tabel 2.2 Simbol-simbol pada Use Case Diagram**

| Simbol | Keterangan |
|---|---|
| *(gambar simbol Aktor — belum terbaca)* | Aktor adalah simbol yang merepresentasikan pengguna/pihak yang terlibat dalam interaksi dengan sistem. |
| *(gambar simbol Use Case — belum terbaca)* | *Use case* adalah simbol yang menggambarkan fitur atau kemampuan fungsional yang dimiliki sistem. |
| *(gambar simbol Association — belum terbaca)* | *Association* adalah garis penghubung yang menunjukkan keterkaitan antara aktor dengan use case tertentu. |
| *(gambar simbol Include — belum terbaca)* | *Include* adalah relasi yang menandakan bahwa sebuah use case bergantung pada atau memanfaatkan fungsionalitas dari use case lain. |
| *(gambar simbol Extend — belum terbaca)* | *Extend* adalah relasi yang menandakan bahwa suatu *use case* merupakan fungsionalitas tambahan dari use case lain yang hanya aktif jika kondisi tertentu terpenuhi. |

*Catatan: kolom "Simbol" berisi gambar/ikon UML yang tidak dapat diekstrak dari dokumen sumber. Mohon sisipkan gambar simbol secara manual pada masing-masing baris.*

## 2.2.17. Activity Diagram

*Activity diagram* merupakan bagian dari UML (*Unified Modeling Language*), yaitu standar yang digunakan dalam pemodelan perangkat lunak untuk memvisualisasikan proses dan alur kerja sistem. Diagram ini dibuat berdasarkan kebutuhan sistem yang telah dikumpulkan, kemudian dianalisis untuk menghasilkan representasi visual aktivitas. *Activity diagram* menggambarkan elemen-elemen penting seperti aksi, alur proses, serta hubungan antar aktivitas sehingga memudahkan pemahaman terhadap sistem. Dengan adanya pembentukan diagram, kualitas dan ketepatan dalam pengembangan sistem nantinya dapat mengalami peningkatan [51]. Penjelasan mengenai komponen *activity diagram* dapat dilihat pada Tabel 2.3.

**Tabel 2.3 Simbol-simbol pada Activity Diagram**

| Gambar Simbol | Nama | Fungsi |
|---|---|---|
| *(gambar simbol — belum terbaca)* | Initial Node | Sebagai simbol titik awal suatu aktivitas. |
| *(gambar simbol — belum terbaca)* | Action | Sebagai simbol aktivitas yang tengah dikerjakan oleh suatu entitas (pengguna/sistem) |
| *(gambar simbol — belum terbaca)* | Control Flow | Sebagai simbol arah *flow* dari suatu aktivitas |
| *(gambar simbol — belum terbaca)* | Decision | Sebagai simbol kondisi jika suatu *flow* terdapat lebih dari satu aktivitas yang bisa dilaksanakan |
| *(gambar simbol — belum terbaca)* | Join | Sebagai simbol penggabungan dua atau lebih aktivitas menjadi satu alur proses |
| *(gambar simbol — belum terbaca)* | Activity Final Node | Sebagai simbol titik akhir suatu aktivitas |

*Catatan: kolom "Gambar Simbol" berisi ikon UML yang tidak dapat diekstrak dari dokumen sumber. Mohon sisipkan gambar simbol secara manual pada masing-masing baris.*

## 2.2.18. Entity Relationship Diagram (ERD)

Entity Relationship Diagram (ERD) merupakan salah satu diagram utama yang merepresentasikan model data konseptual dan menggambarkan kebutuhan data pengguna dalam suatu sistem basis data [52]. ERD menyajikan informasi secara rinci melalui tiga elemen utama, yaitu entitas, atribut, dan relasi. Penjelasan terkait komponen utama dalam ERD dapat dilihat pada tabel 2.4 berikut.

**Tabel 2.4 Notasi-notasi pada ERD**

| Notasi | Nama | Keterangan |
|---|---|---|
| *(notasi — belum terbaca)* | PK (Primary Key) | Kolom unik yang digunakan untuk mengidentifikasi setiap baris dalam sebuah tabel secara unik |
| *(notasi — belum terbaca)* | FK (Foreign Key) | Kolom dalam suatu tabel yang mereferensikan primary key dari tabel lain |
| *(notasi — belum terbaca)* | Entity | Merepresentasikan objek atau konsep yang memiliki data yang disimpan dalam sistem |
| *(notasi — belum terbaca)* | Attribute | Menunjukkan informasi atau properti yang dimiliki oleh sebuah entitas atau hubungan |
| *(notasi — belum terbaca)* | Relasi | Menggambarkan keterkaitan atau hubungan yang terbentuk antar entitas |

*Catatan: kolom "Notasi" berisi simbol/ikon ERD yang tidak dapat diekstrak dari dokumen sumber. Mohon sisipkan gambar notasi secara manual pada masing-masing baris.*

Komponen-komponen dalam ERD yang membentuk satu kesatuan utuh dapat saling berinteraksi satu sama lain. Secara garis besar, relasi antar entitas dibagi menjadi tiga jenis yang dapat dilihat penjelasannya pada tabel 2.5.

**Tabel 2.5 Notasi relasi pada ERD**

| Notasi Relasi | Keterangan |
|---|---|
| One-to-One (1:1) | Relasi di mana satu entitas hanya dapat berelasi dengan tepat satu entitas lainnya |
| One-to-Many (1:M) | Relasi di mana satu entitas dapat berelasi dengan lebih dari satu entitas lainnya |
| Many-to-Many (M:N) | Relasi di mana banyak entitas dapat berelasi dengan banyak entitas lainnya |

## 2.2.19. User Interface Design

User Interface (UI) Design adalah proses perancangan antarmuka digital yang bertujuan untuk mempermudah interaksi antara pengguna dengan sistem atau aplikasi [53]. UI Design mencakup pengaturan elemen-elemen visual seperti tombol, ikon, menu, navigasi, serta kontrol berbasis suara atau gerakan, sehingga pengguna dapat memahami dan menggunakan aplikasi secara intuitif tanpa memerlukan panduan yang kompleks. Desain yang efektif memperhatikan aspek *usability* dan *accessibility*, memastikan antarmuka dapat diakses dan digunakan oleh semua pengguna, termasuk mereka dengan keterbatasan tertentu.

## 2.2.20. User Acceptance Testing (UAT)

User Acceptance Testing (UAT) merupakan salah satu metode pengujian sistem yang bertujuan untuk memastikan bahwa sistem yang dikembangkan telah berfungsi sesuai dengan kebutuhan dan ekspektasi pengguna akhir. UAT memberikan kesempatan kepada *developer* untuk mengevaluasi performa sistem secara nyata dan memverifikasi bahwa kebutuhan yang telah ditetapkan telah diterjemahkan secara akurat ke dalam desain sistem [54]. Jenis pengujian ini memegang peranan yang sangat penting dalam memvalidasi fungsionalitas sistem dari sudut pandang pengguna akhir. Adapun cara pengukuran tingkat penerimaan dan kelayakan sistem oleh pengguna dapat merujuk pada persamaan 2.3 berikut.

$$P = \frac{\sum_{i=1}^{N} S_i}{\sum_{i=1}^{N} S_{maks_i}} \times 100\% \tag{2.3}$$

dengan:

- **P** = Persentase penerimaan sistem (*acceptance rate*)
- **N** = Jumlah total responden
- **S_i** = Skor yang diberikan oleh responden ke-i
- **S_maks_i** = Skor maksimal untuk responden ke-i

## 2.2.21. Response Time

*Response time* merupakan salah satu metrik performa sistem yang penting dalam interaksi manusia dengan komputer. *Response time* atau yang sering disebut *System Response Time* (SRT) didefinisikan sebagai jeda waktu antara inisiasi perintah oleh pengguna pada suatu perangkat digital hingga sistem menyelesaikan tugasnya, termasuk menampilkan hasilnya di layar [55]. Rentang waktu ini dapat berkisar dari milidetik hingga beberapa menit, bergantung pada berbagai faktor seperti kemampuan pemrosesan sistem.

Nilai *response time* yang rendah mencerminkan sistem yang responsif dan efisien, sehingga menjadi salah satu indikator utama dalam evaluasi performa suatu aplikasi. Dalam konteks pengembangan perangkat lunak modern, pengukuran *response time* digunakan untuk mengidentifikasi *bottleneck* pada sistem, memastikan pengalaman pengguna yang optimal, serta menjadi acuan dalam pengujian performa (*performance testing*).
