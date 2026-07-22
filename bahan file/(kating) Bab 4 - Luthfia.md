# BAB IV
## HASIL DAN PEMBAHASAN

#### 4.1. Implementasi OCR Service

Implementasi OCR service adalah tahapan lanjutan untuk pengembangan sistem OCR yang akan digunakan untuk mengolah file Portable Document Format (PDF) yang diunggah dari web. Service ini bertanggung jawab untuk mengkonversi file PDF menjadi teks digital, mengekstraksi informasi penting, dan mengklasifikasikan jenis surat. Service ini diimplementasikan dengan framework Flask dan bahasa pemrograman Python. Service ini berhubungan dengan web melalui Application Programming Interface (API). Kode pengembangan sistem dapat dilihat secara lengkap melalui tautan yang tersedia di Lampiran 13.

##### 4.1.1. Pra-Pemrosesan OCR

Proses pra-pemrosesan dokumen sebelum OCR dilakukan dengan fungsi “download_pdf()”. Fungsi ini dirancang untuk mengunduh file dari URL yang diberikan dan menyimpannya ke lokasi lokal yang ditentukan secara efisien. Pengunduhan ini dilakukan secara bertahap dalam potongan kecil untuk menghemat memori dan dilengkapi penanganan error. Potongan kode dari fungsi ini dapat dilihat pada gambar 4.1 berikut.

![Gambar 4.1. Kode Pra-Pemrosesan OCR](images/gambar-4.1.png)
*Gambar 4.1. Kode Pra-Pemrosesan OCR*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-2 mengombinasikan “output_dir” dengan nama file “downloaded.pdf” untuk membuat jalur penyimpanan lokal (“local_pdf_path”).
ii. Baris ke-4 melakukan permintaan HTTP GET ke “pdf_url” dengan mode streaming (“stream=True”) agar konten diunduh secara bertahap.
iii. Baris ke-5 memeriksa status respons HTTP. Jika ada error maka blok exception akan dijalankan.
iv. Baris ke-6 adalah proses membuka file baru di “local_pdf_path” dengan mode “wb” (write-biner) sehingga PDF dapat terbaca. Kemudian file tersebut diberi nama “f”.
v. Baris ke-7 dan ke-8 adalah perulangan membaca data PDF dari internet dalam potongan kecil dan sedikit demi sedikit (sebesar 1024 kilo byte). Kemudian data tersebut disimpan dalam file “f”.
vi. Baris ke-9 mengembalikan alamat lengkap file PDF yang berhasil diunduh dan disimpan di “local_pdf_path”.
vii. Baris ke-10 adalah bagian penanganan error. Jika selama proses pengunduhan (dari Baris ke-3 hingga ke-9) terjadi error, kode ini akan menangkap kesalahan tersebut dan memberikan pesan error kepada sistem.

##### 4.1.2. Proses OCR

Proses OCR merupakan bagian utama dalam service ini. OCR dilakukan dengan bantuan library PyTesseract. Library ini dapat mengubah PDF menjadi dokumen editable. Potongan kode proses OCR dapat dilihat pada gambar 4.2 berikut.

![Gambar 4.2. Kode Proses OCR](images/gambar-4.2.png)
*Gambar 4.2. Kode Proses OCR*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-4 hingga ke-6 adalah perulangan yang akan memproses setiap file gambar di dalam folder dengan memastikan urutannya benar berdasarkan nomor di nama file. Sistem hanya memproses file gambar seperti .png atau .jpg.
ii. Baris ke-7 dan ke-8 akan memuat gambar ke dalam memori untuk diproses. Jika gambar gagal dibaca, sistem akan mencetak pesan kesalahan dan melompati gambar tersebut untuk melanjutkan ke file berikutnya.
iii. Baris ke-9 menggunakan PyTesseract untuk mengenali dan mengekstraksi semua teks dari gambar. Teks yang ditemukan kemudian dirapikan dari spasi berlebih.
iv. Baris ke-10 menyimpan teks yang sudah diekstraksi ke dalam variabel “ocr_results_per_page”, dan menggunakan nama file gambar sebagai key.
v. Baris ke-11 dan ke-12 akan mencetak pesan bahwa proses OCR selesai dan mengembalikan semua teks yang sudah terekstraksi dari setiap gambar.

##### 4.1.3. Pasca-Pemrosesan OCR

Pasca-pemrosesan OCR adalah tahapan krusial yang dilakukan setelah gambar dokumen berhasil dikonversi menjadi teks. Pada tahapan ini, langkah pertama yang dilakukan adalah pemisahan surat-surat yang ditemukan dalam satu

berkas, jika ada lebih dari satu. Kemudian, setiap surat akan melalui proses pengecekan format untuk validitas dan kesesuaian. Akhirnya, teks tersebut akan diproses hingga menjadi teks surat yang terklasifikasi dengan baik dan siap digunakan.

**a. Deteksi Surat Baru**

Proses ini digunakan untuk memisahkan surat-surat yang ada dalam satu file dokumen. Setelah gambar dokumen berhasil dikonversi menjadi teks, langkah krusial selanjutnya adalah mendeteksi awal atau batas suatu dokumen baru dalam berkas. Proses ini dilakukan dengan mengidentifikasi pola kunci tertentu yang menjadi indikasi sebuah dokumen. Pola kunci tersebut meliputi kata kunci untuk judul surat, salam pembuka, dan regulasi yang biasa ditemukan pada dokumen resmi. Potongan kode proses deteksi surat baru dapat dilihat pada gambar 4.3 berikut.

![Gambar 4.3. Kode Proses Deteksi Surat](images/gambar-4.3.png)
*Gambar 4.3. Kode Proses Deteksi Surat*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-1 hingga ke-6 mendefinisikan tiga kelompok kata kunci penting, yaitu TITLE_KEYWORDS untuk judul surat, SALUTATION_KEYWORDS untuk sapaan, dan REGULATION_KEYWORDS untuk penanda peraturan. Kata kunci ini digunakan sebagai ciri awal dokumen baru.

ii. Baris ke-10 perulangan berdasarkan setiap kata kunci dari ketiga kelompok yang digabungkan.
iii. Baris ke-11 mencari keberadaan kata kunci dalam teks halaman menggunakan library Regex, dengan pencarian yang tidak membedakan huruf kapital atau tidak (“re.IGNORECASE”) dan memastikan kata kuncinya adalah kata utuh (“\b”).
iv. Baris ke-12 akan mengembalikan nilai True jika salah satu kata kunci ditemukan. Berarti halaman tersebut adalah awal dokumen baru.
v. Baris ke-13 akan mengembalikan nilai False jika tidak ada kata kunci yang ditemukan di halaman. Berarti halaman tersebut bukan awal dokumen baru.

**b. Pengelompokan Halaman**

Setelah OCR dilakukan pada setiap halaman, fungsi “group_pages()” ini bertanggung jawab untuk mengelompokkan hasil OCR tersebut menjadi dokumen- dokumen surat yang terpisah. Proses ini dilakukan dengan mengurutkan hasil OCR dari setiap halaman dan kemudian mengulanginya. Dalam setiap iterasi, sistem akan memeriksa apakah suatu halaman menandakan dimulainya dokumen baru menggunakan fungsi “is_new_document(text)”. Jika itu adalah dokumen baru, atau teks halaman merupakan kelanjutan dokumen yang sedang dikelompokkan, teks akan ditambahkan. kemudian akhirnya, fungsi ini mengembalikan daftar dokumen yang telah dikelompokkan. Potongan kode untuk proses tersebut dapat dilihat pada gambar 4.4 berikut.

![Gambar 4.4. Kode Proses Pengelompokan Halaman](images/gambar-4.4.png)
*Gambar 4.4. Kode Proses Pengelompokan Halaman*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-6 hingga ke-9 mengurutkan teks OCR dari setiap halaman berdasarkan nama file-nya, memastikan proses pengelompokan dilakukan sesuai urutan halaman asli.
ii. Baris ke-11 memulai perulangan untuk memproses setiap halaman (teks) yang sudah diurutkan.
iii. Baris ke-12 dan ke-14 memeriksa apakah halaman yang sedang diproses merupakan awal dari dokumen baru dengan memanggil fungsi “is_new_document()”. Jika ya, teks yang sudah terkumpul di “current_doc” (dokumen sebelumnya) akan disimpan ke “grouped_docs”, lalu “current_doc” dikosongkan untuk menampung teks halaman baru.
iv. Baris ke-16 menambahkan teks halaman yang sedang dicek ke “current_doc” jika halaman tersebut bukan awal dokumen baru, melanjutkan pembuatan dokumen yang sama.
v. Baris ke-19 dan ke-21 memastikan dokumen terakhir yang masih ada di “current_doc” juga ditambahkan ke “grouped_docs” setelah semua halaman selesai diproses, dan mengembalikan daftar semua dokumen yang sudah dikelompokkan.

**c. Deteksi Format Surat**

Fungsi deteksi format surat digunakan untuk memeriksa apakah sebuah surat menggunakan format Universitas Gadjah Mada (UGM). Pada baris ke-3, dilakukan pengambilan 500 karakter pertama dari teks hasil OCR dan mengubahnya menjadi huruf kecil, kemudian mengecek apakah frasa "universitas gadjah mada" ada di dalam 500 karakter awal tersebut. Kemudian mengembalikan nilai True jika frasa tersebut ditemukan, yang berarti surat itu menggunakan format UGM. Sebaliknya, jika tidak ditemukan, fungsi akan mengembalikan nilai False, menandakan surat tersebut berformat non-UGM.Potongan kode untuk proses deteksi format surat dapat dilihat pada gambar 4.5 berikut.

![Gambar 4.5. Kode Proses Deteksi Format Surat](images/gambar-4.5.png)
*Gambar 4.5. Kode Proses Deteksi Format Surat*

**d. Klasifikasi Surat**

Setelah dokumen berhasil dipisahkan dan diformat, langkah krusial selanjutnya adalah melakukan klasifikasi jenis surat secara otomatis. Proses ini bertujuan untuk mengidentifikasi kategori spesifik dari setiap surat berdasarkan isi teks hasil OCR. Klasifikasi dilakukan dengan mencocokkan pola-pola kunci yang telah didefinisikan untuk berbagai jenis surat seperti surat tugas, surat keterangan, atau surat permohonan. Detail implementasi fungsi klasifikasi dokumen ini dapat dilihat pada potongan kode berikut. Proses klasifikasi surat bertujuan untuk mengidentifikasi jenis surat secara otomatis. Potongan kode untuk proses klasifikasi surat dapat dilihat pada gambar 4.6 berikut.

![Gambar 4.6. Kode Proses Klasifikasi Surat](images/gambar-4.6.png)
*Gambar 4.6. Kode Proses Klasifikasi Surat*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-2 hingga ke-6 mendefinisikan kumpulan pola Regular Expression (Regex) untuk tiga jenis dokumen utama: Surat Tugas, Surat Keterangan, dan Surat Permohonan.
ii. Baris ke-7 memulai perulangan untuk memeriksa setiap kategori jenis dokumen yang telah didefinisikan.
iii. Baris ke-10 mencari pola Regex yang relevan dalam teks hasil OCR, dengan pencarian yang tidak membedakan huruf kapital atau tidak (“re.IGNORECASE”) dan dapat mencakup beberapa baris (“re.DOTALL”).
iv. Baris ke-9 akan mengembalikan jenis dokumen yang terdeteksi jika pola ditemukan.
v. Baris ke-10 akan mengembalikan pesan "Tidak Diketahui" apabila tidak ada satu pun pola yang cocok setelah semua jenis dokumen diperiksa.

##### 4.1.4. Ekstraksi Bagian Surat

Proses ini digunakan untuk mengambil bagian-bagian surat. Fungsi ini dirancang untuk mengidentifikasi pola-pola kunci dalam dokumen berdasarkan jenis surat yang telah diklasifikasikan. Proses deteksi dilakukan dengan mencocokkan teks menggunakan Regular Expression (Regex) yang telah didefinisikan sebelumnya. Potongan kode proses ekstraksi bagian surat dapat dilihat pada gambar 4.7 berikut.

![Gambar 4.7. Kode Proses Ekstraksi Bagian Surat](images/gambar-4.7.png)
*Gambar 4.7. Kode Proses Ekstraksi Bagian Surat*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-2 hingga ke-4 mendefinisikan kumpulan pola Regular Expression (Regex) yang berisi pola untuk berbagai bagian surat seperti nomor, isi, penanda tangan, penerima, dan tanggal sesuai jenis surat.
ii. Baris ke-5 dan baris ke-6 menyiapkan variabel (“result”) untuk menyimpan hasil ekstraksi dan memilih set pola yang sesuai berdasarkan “letter_type” atau menggunakan pola default jika jenis surat tidak spesifik.
iii. Baris ke-7 memulai perulangan untuk memproses setiap pola dalam set pola yang dipilih.
iv. Baris ke-8 mencari pola Regex yang relevan dalam teks dokumen.
v. Baris ke-9 hingga ke-26 akan mengekstraksi teks yang cocok dengan pola jika pola ditemukan. Informasi yang diekstraksi seperti teks, posisi awal, dan panjangnya disimpan ke dalam “result”.

vi. Baris ke-27 mengembalikan objek “result” yang berisi semua informasi penting yang berhasil diekstraksi dari dokumen.

##### 4.1.5. Routing API

Endpoint “/submit_pdf” adalah endpoint yang dapat menerima data. Fungsi utamanya adalah melakukan validasi data yang diterima, seperti keberadaan pdf_url dan task_id. Setelah validasi berhasil, proses penanganan PDF akan dimulai di latar belakang untuk memastikan operasi sistem tidak terganggu. Potongan kode untuk fungsi tersebut dapat dilihat pada gambar 4.8 berikut.

![Gambar 4.8. Potongan Kode Background Process](images/gambar-4.8.png)
*Gambar 4.8. Potongan Kode Background Process*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-1 hingga ke-2 mendefinisikan fungsi “submit_pdf()” sebagai titik akses API yang menerima permintaan melalui metode POST.
ii. Baris ke-3 hingga ke-5 adalah proses pengambilan data yang dikirimkan dalam format JavaScript Object Notation (JSON) dari permintaan, yaitu “task_id” (pengidentifikasi unik tugas) dan “pdf_url” (alamat file PDF yang akan diproses).
iii. Baris ke-7 hingga ke-9 melakukan validasi awal. Jika “pdf_url” atau “task_id” tidak ada, sistem akan segera mengembalikan respons error 400 Bad Request kepada pengirim.
iv. Baris ke-10 akan memulai proses utama di fungsi “background_process()”) di thread terpisah.

v. Baris ke-11 dan ke-12 akan segera mengembalikan respons 202 Accepted kepada pengirim. Ini memberitahu pengirim bahwa permintaan telah diterima dan sedang diproses.

Adapun fungsi “background_process()” adalah kumpulan berbagai proses OCR. Fungsi ini mengelola tahapan penting mulai dari mengunduh dan mengonversi file PDF menjadi gambar, melakukan OCR, hingga mengelompokkan dan mengklasifikasikan dokumen yang ditemukan. Setelah semua proses selesai, fungsi ini bertanggung jawab untuk mengirimkan hasil olahan dokumen ke sistem Laravel melalui webhook. Potongan kode fungsi “background_process()” dapat dilihat pada gambar 4.9 berikut.

![Gambar 4.9. Kode Routing API untuk OCR Service](images/gambar-4.9.png)
*Gambar 4.9. Kode Routing API untuk OCR Service*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-5 hingga ke-9 akan mengunduh PDF ke direktori sementara. Kemudian mengonversi setiap halaman PDF menjadi file gambar PNG dan menyimpannya.
ii. Baris ke-11 hingga ke-13 akan melakukan OCR pada setiap gambar halaman untuk mengekstraksi teks, lalu mengelompokkan teks dari berbagai halaman menjadi dokumen-dokumen logis yang utuh.

iii. Baris ke-14 hingga ke-23 akan mengulang untuk setiap dokumen yang sudah dikelompokkan, melakukan klasifikasi jenis dokumen, dan mengekstraksi bidang-bidang informasi penting.
iv. Baris ke-26 hingga ke-37 akan menyiapkan dan mencoba mengirimkan semua hasil pemrosesan ke endpoint “/api/hook”. Jika pengiriman gagal, sistem akan mencatat kesalahan tersebut tetapi proses tidak berhenti total.
v. Baris ke-39 hingga ke-42 adalah penanganan kesalahan umum. Jika ada error yang tidak tertangkap di tahap sebelumnya maka akan dicatat ke console.
vi. Baris ke-43 dan ke-44 adalah blok finally yang akan mengosongkan “temp_dir” beserta semua file di dalamnya.

##### 4.1.6. Hasil OCR Service

Hasil sistem OCR service berupa JSON yang berisi data seperti teks hasil OCR, bagian-bagian surat, URL PDF surat, dan lain-lain. Jika gagal maka data bagian ekstraksi akan kosong. Kegagalan tersebut dapat disebabkan oleh kualitas dokumen yang buruk. Hasil OCR service yang gagal dapat dilihat pada gambar 4.10 berikut.

![Gambar 4.10. Hasil OCR Service yang Gagal](images/gambar-4.10.png)
*Gambar 4.10. Hasil OCR Service yang Gagal*

Jika dokumen memiliki kualitas baik, OCR service dapat memprosesnya. Sehingga data “processed_document” akan terisi. Isi “processed_document” adalah hasil background process seperti jenis surat dan hasil ekstraksi. Contoh hasil OCR service dapat dilihat pada gambar 4.11 berikut.

![Gambar 4.11. Hasil OCR Service yang Berhasil](images/gambar-4.11.png)
*Gambar 4.11. Hasil OCR Service yang Berhasil*

#### 4.2. Implementasi Web SuratTEDI

Sistem web dibangun menggunakan Filament Resource. Setiap data yang digunakan seperti pengajuan, surat masuk, dan surat keluar ditangani dalam sebuah Resource. Setiap resource memiliki fungsi bawaan seperti fungsi “form()” untuk membantu proses create dan update serta fungsi “table()” dan komponen “TextColumn” untuk menampilkan list yang membantu proses read data. Kode pengembangan sistem dapat dilihat secara lengkap melalui tautan yang tersedia di Lampiran 16.

##### 4.2.1. Landing Page

Landing page adalah halaman terdapat dari sistem yang dapat diakses oleh semua pengguna tanpa harus login terlebih dahulu. Melalui halaman ini, pengguna yang ingin mengakses diharuskan untuk menekan tombol login yang berada di sisi kanan atas. Tampilan landing page dapat dilihat pada gambar 4.12 berikut.

![Gambar 4.12. Tampilan Landing Page](images/gambar-4.12.png)
*Gambar 4.12. Tampilan Landing Page*

##### 4.2.2. Halaman Login

Halaman login adalah halaman yang harus diakses oleh semua pengguna untuk dapat melihat isi sistem. Pada halaman ini terdapat satu tombol yang harus ditekan pengguna memulai proses login. Halaman ini dapat diakses oleh mahasiswa dan staf akademik. Tampilan halaman login dapat dilihat pada gambar 4.13 berikut.

![Gambar 4.13. Tampilan Halaman Login](images/gambar-4.13.png)
*Gambar 4.13. Tampilan Halaman Login*

Pada proses implementasinya, setelah Google menyelesaikan prosesnya, maka Google akan mengirimkan data yang dapat disimpan oleh sistem. Proses ini memastikan bahwa informasi yang diperlukan dapat terintegrasi dengan baik. Sehingga data tersebut dapat digunakan untuk mengisi data profil pengguna. Proses penyimpanan data pengguna secara detail dapat dilihat pada gambar 4.14 berikut.

![Gambar 4.14. Potongan Kode untuk Menyimpan Data Pengguna](images/gambar-4.14.png)
*Gambar 4.14. Potongan Kode untuk Menyimpan Data Pengguna*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-3 proses mendapatkan informasi pengguna Google dari driver Socialite setelah callback.
ii. Baris ke-7 dan ke-8 memeriksa apakah alamat email pengguna disediakan oleh Google. Jika tidak, proses akan dihentikan dengan error 403.
iii. Baris ke-10 hingga ke-21 memeriksa apakah pengguna sudah terdaftar di sistem. Jika belum, sistem akan membuat akun pengguna baru dengan data yang diterima dari Google dan mengatur value is_admin sebagai false.
iv. Baris ke-22 melakukan proses login pengguna ke dalam sesi aplikasi Laravel.

v. Baris ke-23 hingga ke-27 mengarahkan pengguna ke dashboard jika “is_admin” bernilai True, atau ke halaman daftar pengajuan jika bernilai False.
vi. Baris ke-28 hingga baris ke-31 menangkap semua jenis error yang terjadi selama proses autentikasi dan mengarahkan pengguna kembali ke halaman utama jika login Google gagal.

##### 4.2.3. Dashboard

Dashboard adalah halaman pertama yang dapat diakses oleh staf akademik setelah proses login berhasil. Pada halaman ini, staf akademik dapat melihat tiga menu yang berada di sidebar untuk menuju ke fitur-fitur yang disediakan, seperti pengajuan, surat masuk, dan surat keluar. Selain itu, pada halaman ini terdapat overview informasi seperti jumlah surat, jumlah pengajuan, dan visualisasi jumlah surat masuk dan surat keluar dalam bentuk chart. Tampilan overview di halaman dashboard dapat dilihat pada gambar 4.15 berikut.

![Gambar 4.15. Tampilan Dashboard (1)](images/gambar-4.15.png)
*Gambar 4.15. Tampilan Dashboard (1)*

Pada halaman dashboard, staf akademik akan menemukan tampilan statistika surat. Tampilan ini disajikan dalam bentuk bar chart yang memvisualisasikan jumlah surat masuk dan surat keluar dalam periode tertentu. Statistika ini bertujuan untuk memberikan gambaran cepat mengenai aktivitas persuratan yang sedang

berlangsung. Tampilan lengkap statistika pada dashboard dapat dilihat pada gambar

#### 4.16. berikut.

![Gambar 4.16. Tampilan Dashboard (2)](images/gambar-4.16.png)
*Gambar 4.16. Tampilan Dashboard (2)*

Proses implementasi tampilan tersebut menggunakan dua jenis komponen widgets yang berbeda. Komponen "Stat" digunakan untuk menampilkan jumlah total surat dan pengajuan yang ada dalam sistem. Sementara itu, komponen "ChartWidget" berfungsi untuk menyajikan visualisasi chart dari data surat masuk dan surat keluar. Implementasi chart ini dilengkapi dengan fitur filter berdasarkan bulan dan tahun, yang potongan kodenya dapat dilihat pada gambar 4.17 berikut.

![Gambar 4.17. Potongan Kode Filter Data Surat dalam Bar Chart](images/gambar-4.17.png)
*Gambar 4.17. Potongan Kode Filter Data Surat dalam Bar Chart*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-3 mengambil tahun saat ini.

ii. Baris ke-4 membuat rentang tahun, dimulai dari 5 tahun sebelum tahun saat ini hingga 1 tahun setelah tahun saat ini.
iii. Baris ke-5 hingga ke-7 membuat dan mengembalikan array options di mana setiap tahun dalam rangeTahun akan menjadi kunci dan nilai,

Adapun untuk proses pengambilan dan perhitungan data surat berdasarkan bulan dalam satu tahun. Potongan kode untuk mengambil data surat dapat dilihat pada gambar 4.18 berikut.

![Gambar 4.18. Potongan Kode untuk Mengambil Data Surat](images/gambar-4.18.png)
*Gambar 4.18. Potongan Kode untuk Mengambil Data Surat*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-1 hingga ke-2 mendefinisikan array “$bulan” yang berisi singkatan nama bulan, dan variabel “$tahun” yang mendapatkan nilai filter tahun.
ii. Baris ke-4 hingga ke-5 menginisialisasi array kosong “$suratMasukData” dan “$suratKeluarData”.
iii. Baris ke-7 hingga ke-12 melakukan perulangan untuk setiap bulan dan menghitung jumlah surat masuk dan surat keluar pada “$tahun” dan “$month” yang sedang berjalan.

iv. Baris ke-18 dan ke-19 menambahkan “$masuk” dan “$keluar” yang baru dihitung ke dalam array “$suratMasukData” dan “$suratKeluarData” secara berurutan.

##### 4.2.4. Halaman Profil Pengguna

Halaman profil adalah halaman yang hanya dapat diakses oleh mahasiswa. Melalui halaman ini mahasiswa dapat melihat data diri dan mengubahnya jika ada bagian yang tidak tepat. Data diri tersebut terdiri dari nama lengkap, email, program studi, dan NIM (Nomor Induk Mahasiswa). Dengan mengisi profil secara lengkap, maka proses pengisian data untuk pengajuan surat menjadi lebih cepat karena data diri sudah diisikan sesuai dengan data profil. Tampilan halaman profil dapat dilihat pada gambar 4.19 berikut.

![Gambar 4.19. Tampilan Halaman Profil](images/gambar-4.19.png)
*Gambar 4.19. Tampilan Halaman Profil*

Pada halaman ini, mahasiswa memiliki fitur untuk mengubah informasi pribadi. Mahasiswa dapat mengubah data dirinya dengan menekan tombol “Ubah Profil”. Setelah tombol tersebut ditekan, tampilan halaman akan menjadi formulir Tombol tersebut akan mengubah tampilan menjadi seperti gambar 4.20 berikut.

![Gambar 4.20. Tampilan Halaman Profil Ketika Ubah Data](images/gambar-4.20.png)
*Gambar 4.20. Tampilan Halaman Profil Ketika Ubah Data*

Proses implementasi tampilan tersebut menggunakan halaman kustom yang menggunakan fungsi “form()” beserta dengan komponen “TextInput” dan “Select”. Formulir tersebut dapat berubah menjadi read-only ketika mahasiswa tidak menekan tombol ubah profil. Potongan kode untuk memuat data diri dapat dilihat pada gambar 4.21 berikut.

![Gambar 4.21. Fungsi untuk Mengisi Formulir](images/gambar-4.21.png)
*Gambar 4.21. Fungsi untuk Mengisi Formulir*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-3 mengambil data pengguna yang sedang login dan menyimpannya ke variabel “$this->initialFormData”.
ii. Baris ke-4 menyalin data pengguna yang sedang login ke variabel “$this- >formData” untuk ditampilkan dan dimanipulasi dalam formulir.
iii. Baris ke-5 mengisi formulir “$this->form” dengan data dari “$this- >formData”, sehingga data profil pengguna muncul di formulir.

Pada saat mahasiswa mengubah data dirinya, maka sistem akan menyimpan data tersebut. Data yang dimasukkan melalui form profil divalidasi untuk memastikan semua informasi telah sesuai. Jika validasi berhasil, data profil pengguna akan disimpan ke basis data. Namun, apabila terdapat kesalahan validasi, sistem akan menampilkan pesan peringatan yang relevan kepada pengguna. Potongan kode untuk proses tersebut dapat dilihat pada gambar 4.22 berikut.

![Gambar 4.22. Proses penyimpanan data profil](images/gambar-4.22.png)
*Gambar 4.22. Proses penyimpanan data profil*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-3 melakukan validasi data yang dimasukkan pada formulir.
ii. Baris ke-4 mengatur status isEditing menjadi false.

iii. Baris ke-6 hingga ke-9 memperbarui atribut nama, NIM, dan program studi berdasarkan data dari formulir lalu menyimpannya ke database.
iv. Baris ke-11 hingga ke-14 menampilkan notifikasi sukses setelah data berhasil disimpan.
v. Baris ke-16 melakukan dispatch event reload-page untuk memicu pembaruan tampilan halaman.
vi. ke-18 hingga ke-28 memproses pesan-pesan kesalahan validasi yang diterima dan memformatnya menjadi daftar HTML yang mudah dibaca.
vii. Baris ke-31 hingga ke-36 menampilkan notifikasi error kepada pengguna.

##### 4.2.5. Implementasi Pengajuan Resource

Pengajuan Resource menangani proses CRUD data pengajuan surat. Proses create dilakukan oleh mahasiswa. Sementara itu, staf akademik melakukan update status pengajuan dan mengecek data pengajuan. Adapun halaman daftar pengajuan dapat diakses oleh kedua jenis pengguna.

**a. Halaman Daftar Pengajuan**
Melalui halaman ini, staf akademik dapat melihat daftar pengajuan dari mahasiswa. Staf akademik dapat memilih salah satu pengajuan kemudian memproses dengan menekan tombol “Buat Surat Keluar”. Namun, kode tersebut hanya tersedia hanya ketika status pengajuannya bukan selesai atau ditolak. Selain itu, para pengguna juga dapat memfilter untuk menampilkan daftar pengajuan berdasarkan data tertentu seperti jenis surat dan program studi. Tampilan halaman daftar pengajuan untuk staf akademik dapat dilihat pada gambar 4.23 berikut.

![Gambar 4.23. Tampilan Halaman Daftar Pengajuan untuk Staf Akademik](images/gambar-4.23.png)
*Gambar 4.23. Tampilan Halaman Daftar Pengajuan untuk Staf Akademik*

Sementara itu bagi mahasiswa, halaman ini digunakan sebagai dashboard yang menampilkan daftar pengajuan surat yang sudah pernah diajukan. Berbeda dari staf akademik, mahasiswa memiliki tombol untuk menambah pengajuan. Yaitu tombol “Tambah Pengajuan” yang berada di sisi kanan atas. Tampilan halaman daftar pengajuan untuk mahasiswa dapat dilihat pada gambar 4.24 berikut.

![Gambar 4.24. Tampilan Halaman Daftar Pengajuan untuk Mahasiswa](images/gambar-4.24.png)
*Gambar 4.24. Tampilan Halaman Daftar Pengajuan untuk Mahasiswa*

Proses implementasi untuk tampilan tabel menggunakan fungsi khusus bernama "table()". Fungsi ini memanfaatkan komponen "TextColumn" untuk menampilkan berbagai kolom data secara terstruktur. Selain itu, digunakan juga

"SelectFilter" yang berfungsi untuk menampilkan pilihan filter bagi pengguna. Potongan kode untuk filter data dapat dilihat pada gambar 4.25 berikut.

![Gambar 4.25. Potongan Kode untuk Filter Data](images/gambar-4.25.png)
*Gambar 4.25. Potongan Kode untuk Filter Data*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-1 hingga ke-8 mendefinisikan filter untuk kolom status. Filter ini berupa dropdown pilihan dengan opsi "Pending", "Diproses", "Selesai", dan "Ditolak".
ii. Baris ke-9 hingga ke-20 mendefinisikan filter untuk kolom template_name (Jenis Surat). Opsi filter ini diambil dari semua nama template yang tersedia

di database. Logika query pada Baris ke-13 hingga ke-19 akan menyaring data berdasarkan template_id yang dipilih.
iii. Baris ke-21 hingga ke-39 mendefinisikan filter untuk kolom prodi (Program Studi). Opsi filter ini dari “Major::toArray()”.
iv. Baris ke-31 hingga ke-38 berisi logika query untuk filter Program Studi. Jika nilai filter dipilih, query akan menggunakan Regular Expression (Regex) untuk mencocokkan data program studi.

**b. Halaman Tambah Pengajuan Surat**
Halaman ini digunakan oleh mahasiswa untuk mengisikan data pengajuan surat. Mahasiswa memilih jenis surat terlebih dahulu. Kemudian mengisi data pengajuan secara lengkap termasuk berkas pendukungnya. Tampilan halaman tambah pengajuan sebelum memilih jenis surat dapat dilihat pada gambar 4.26 berikut.

![Gambar 4.26. Tampilan Halaman Tambah Pengajuan](images/gambar-4.26.png)
*Gambar 4.26. Tampilan Halaman Tambah Pengajuan*

Tampilan pada gambar 4.26 adalah tampilan ketika mahasiswa belum memilih jenis surat yang akan diajukan. Sehingga bagian Data Surat masih kosong. Bagian Upload Berkas pendukung juga masih kosong. Jika mahasiswa telah memilih salah satu jenis surat, maka tampilan akan menjadi seperti gambar 4.27 berikut.

![Gambar 4.27. Tampilan Pengajuan Pengantar Praktik Industri (1)](images/gambar-4.27.png)
*Gambar 4.27. Tampilan Pengajuan Pengantar Praktik Industri (1)*

Tampilan formulir tersebut memiliki jumlah masukan yang cukup banyak dan terdapat pengulangan pada bagian kelompok yang berisi data mahasiswa praktik industri. Bagian Data Surat terisi dengan formulir data surat. Bagian Upload Berkas Pendukung terisi dengan kotak untuk upload proposal praktik industri. Tampilan lanjutan formulir Surat Pengantar Praktik Industri dapat dilihat pada gambar 4.28 berikut.

![Gambar 4.28. Tampilan Pengajuan Pengantar Praktik Industri (2)](images/gambar-4.28.png)
*Gambar 4.28. Tampilan Pengajuan Pengantar Praktik Industri (2)*

Implementasi tampilan formulir pengajuan surat menggunakan fungsi “form()”. Formulir ini terbagi menjadi beberapa bagian utama, yaitu: bagian informasi pengajuan untuk mengisi data pemohon beserta jenis surat, bagian data

surat yang disesuaikan dengan pilihan, dan bagian unggah berkas pendukung yang diperlukan.

Pada bagian informasi pengajuan, nama pemohon otomatis terisi dari data mahasiswa yang sedang login dan bersifat read-only. Mahasiswa memilih jenis surat. Setelah mahasiswa memilih jenis surat, formulir di bagian data surat akan muncul secara dinamis sesuai jenis surat yang dipilih. Kotak masukan seperti nama, NIM, dan program studi juga telah terisi otomatis dengan data mahasiswa yang sedang login. Potongan kode untuk menampilkan formulir di bagian data surat berdasarkan jenis surat yang dipilih dapat dilihat pada gambar 4.29 berikut.

![Gambar 4.29. Potongan kode untuk menampilkan formulir data surat](images/gambar-4.29.png)
*Gambar 4.29. Potongan kode untuk menampilkan formulir data surat*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-5 hingga ke-8 mencari template berdasarkan templateId, dan memeriksa apakah template tersebut ditemukan.
ii. Baris ke-9 mendapatkan data surat saat ini, jika ada.
iii. Baris ke-11 memulai perulangan untuk setiap kotak masukan yang didefinisikan dalam skema formulir template terpilih, dan Baris ke-12 membentuk jalur “$fieldPath” untuk setiap kotak masukan data surat.
iv. Baris ke-16 hingga ke-26 melakukan pengecekan berdasarkan nama kotak masukan “$fieldName”. Jika namanya adalah "nama", "nim", atau "prodi", nilai default-nya akan diisi otomatis dari data pengguna yang sedang login.
v. Baris ke-29 hingga ke-32 akan mengisi bidang formulir dengan nilai default yang sudah ditentukan jika nilai default tidak kosong dan bidang tersebut belum terisi atau kosong.

Ketika mahasiswa menekan tombol “Buat Pengajuan” yang ada di sisi kiri bawah formulir, maka data pengajuan akan tersimpan dengan status pengajuan pending dan keterangan kosong. Proses penyimpanan data ditangani oleh Filament. Potongan kode untuk mengatur status pengajuan tersebut dapat dilihat pada gambar

#### 4.30. berikut.

![Gambar 4.30. Potongan Kode untuk Mengatur Status Pengajuan](images/gambar-4.30.png)
*Gambar 4.30. Potongan Kode untuk Mengatur Status Pengajuan*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-3 memeriksa apakah pengguna yang sedang login bukan admin.
ii. Baris ke-4 hingga ke-6 memeriksa apakah user_id belum ada dalam data formulir. Jika belum, user_id diisi secara otomatis dengan ID pengguna yang sedang login.
iii. Baris ke-7 hingga ke-9 memeriksa apakah status belum ada dalam data formulir. Jika belum, status diisi secara otomatis dengan nilai pending.
iv. Baris ke-10 hingga ke-12 memeriksa apakah keterangan belum ada dalam data formulir. Jika belum, keterangan diisi secara otomatis dengan nilai null.
v. Baris ke-15 mengembalikan data formulir ($data) yang sudah dimodifikasi untuk diproses lebih lanjut.

**c. Halaman Ubah Pengajuan Surat**
Halaman ini hanya dapat diakses oleh staf akademik. Melalui halaman ini, staf akademik dapat mengecek data yang telah dimasukkan oleh mahasiswa dan mengubah status pengajuannya. Apabila data yang dimasukkan tidak sesuai, staf akademik dapat mengubah status pengajuan menjadi “ditolak”. Tampilan halaman tersebut dapat dilihat pada gambar-gambar berikut.

![Gambar 4.31. Tampilan Halaman Ubah Pengajuan (1)](images/gambar-4.31.png)
*Gambar 4.31. Tampilan Halaman Ubah Pengajuan (1)*

Pada gambar 4.31 adalah bagian awal dari formulir pengajuan. Tampilan tersebut berisi informasi pengajuan. Jika surat yang akan diajukan sudah dipilih,

maka bagian Data Surat akan menampilkan formulir. Formulir lanjutan dari pengajuan tersebut dapat dilihat pada gambar 4.32 berikut.

![Gambar 4.32. Tampilan Halaman Ubah Pengajuan (2)](images/gambar-4.32.png)
*Gambar 4.32. Tampilan Halaman Ubah Pengajuan (2)*

Pada gambar 4.32 adalah bagian lanjutan dari formulir pengajuan di gambar

#### 4.31. Formulir di bagian Data Surat memiliki jumlah kotak masukan yang dinamis.
Hal ini disesuaikan dengan jumlah data yang dibutuhkan oleh surat tersebut. Bagian terakhir dari formulir pengajuan tersebut dapat dilihat pada gambar 4.33 berikut.

![Gambar 4.33. Tampilan Halaman Ubah Pengajuan (3)](images/gambar-4.33.png)
*Gambar 4.33. Tampilan Halaman Ubah Pengajuan (3)*

Implementasi tampilan formulir pengajuan surat menggunakan kode formulir tambah pengajuan. Namun ditambah dengan bagian status dan keterangan, serta

bagian berkas surat keluar final. Bagian status dan keterangan berfungsi untuk mengubah status pengajuan dan mengisi keterangan tambahan.

Bagian berkas surat keluar final dirancang untuk mengunggah surat hasil generate yang telah ditandatangani oleh pihak terkait. Bagian ini terdiri dari komponen “Placeholder” untuk menampilkan informasi, “FileUpload” untuk mengunggah surat (hanya terlihat di halaman edit), dan “Action” untuk tombol unduh (hanya terlihat di halaman detail ketika status pengajuan selesai). Apabila staf akademik mengunggah file surat bertanda tangan disini, maka surat hasil generate sebelumnya akan terhapus dan terganti oleh surat tersebut.

Setelah proses perubahan dilakukan, maka staf akademik dapat menekan tombol “Simpan” yang ada di sisi kiri bawah. Apabila proses penyimpanan data terbaru tersebut berhasil dilakukan akan muncul notifikasi. Selain itu, muncul tombol “Generate Surat Keluar” di sisi kanan atas. Ketika tombol tersebut ditekan, maka proses pembuatan surat akan dimulai. Potongan kode untuk membuat surat keluar dapat dilihat pada gambar 4.34 berikut.

![Gambar 4.34. Potongan Kode untuk Pembuatan PDF Surat](images/gambar-4.34.png)
*Gambar 4.34. Potongan Kode untuk Pembuatan PDF Surat*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-1 hingga ke-5 menyiapkan detail seperti nomor surat dan nama file PDF yang akan dibuat.
ii. Baris ke-7 hingga ke-25 adalah proses utama yang menyiapkan data dari pengajuan dan pengguna. Kemudian mengisi template surat dengan data tersebut dan memproses file PDF. Kemudian menyimpan file tersebut ke folder “surat_keluar”.
iii. Baris ke-27 hingga ke-35 adalah mekanisme penanganan kesalahan yang akan menangkap dan menampilkan notifikasi jika terjadi masalah selama pembuatan atau penyimpanan PDF.

Selain itu, pada proses generate surat terdapat proses penyimpanan data ke database. Potongan kode proses tersebut dapat dilihat pada gambar 4.35 berikut.

![Gambar 4.35. Potongan Kode untuk Menyimpan Surat Hasil Pengajuan](images/gambar-4.35.png)
*Gambar 4.35. Potongan Kode untuk Menyimpan Surat Hasil Pengajuan*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-1 hingga ke-3 mencoba mencari record surat keluar yang sudah ada berdasarkan “pengajuan_id”, atau membuat record baru jika tidak ditemukan.
ii. Baris ke-5 hingga ke-8 memeriksa apakah surat keluar sudah ada dan memiliki URL PDF, kemudian menghapus file PDF lama dari penyimpanan.
iii. Baris ke-10 hingga ke-17 mengisi atribut-atribut record surat keluar (seperti nomor surat, prodi, URL PDF, ID template, metadata, dan status tampilan) dengan data yang baru.
iv. Baris ke-19 menyimpan record surat keluar yang sudah diisi ke database.
v. Baris ke-21 hingga ke-28 pembaruan status dan menerapkan pembaruan tersebut pada record pengajuan. Kemudian mengubah status menjadi “menunggu_ttd” jika status saat ini bukan “selesai” atau “ditolak”.

**d. Modal Detail Pengajuan Surat**
Modal ini menampilkan detail dari pengajuan surat. Modal ini dapat diakses oleh mahasiswa maupun staf akademik. Melalui modal ini, mahasiswa dapat melihat tombol download untuk mengunduh surat yang telah selesai diproses. Namun, jika surat harus diambil secara offline, maka tombol tersebut tidak akan terlihat, hanya terdapat kolom keterangan. Tampilan modal detail dapat dilihat pada gambar-gambar berikut.

![Gambar 4.36. Tampilan Detail Pengajuan (1)](images/gambar-4.36.png)
*Gambar 4.36. Tampilan Detail Pengajuan (1)*

Tampilan pada gambar 4.36 merupakan formulir bagian awal. Implementasi tampilan ini menggunakan kode formulir pengajuan. Formulir tersebut secara otomatis ditampilkan dalam bentuk modal. Lanjutan dari formulir tersebut dapat dilihat pada gambar 4.37 berikut.

![Gambar 4.37 (bagian atas)](images/extra-114-37.png)

![Gambar 4.37. Tampilan Detail Pengajuan (2)](images/gambar-4.37.png)
*Gambar 4.37. Tampilan Detail Pengajuan (2)*

Pada gambar 4.37 adalah bagian lanjutan dari modal detail pengajuan. Modal tersebut yang bersifat read-only. Hal ini dikeranakan modal detail merupakan komponen bawaan Filament. Bagian terakhir dari formulir pengajuan tersebut dapat dilihat pada gambar 4.37 berikut.

![Gambar 4.38. Tampilan Halaman Ubah Pengajuan (3)](images/gambar-4.38.png)
*Gambar 4.38. Tampilan Halaman Ubah Pengajuan (3)*

##### 4.2.6. Implementasi Template Resource

Resource Template digunakan untuk menampilkan daftar template (jenis) surat. Halaman daftar jenis surat tersebut dapat diakses oleh staf akademik ketika akan membuat surat keluar. Melalui resource ini, staf akademik dapat melihat jenis-

jenis surat yang dapat dipilih dalam proses pengajuan surat. Tampilan halaman daftar jenis surat dapat dilihat pada gambar 4.39 berikut.

![Gambar 4.39 (bagian atas)](images/extra-115-40.png)

![Gambar 4.39. Tampilan Halaman Daftar Template Surat](images/gambar-4.39.png)
*Gambar 4.39. Tampilan Halaman Daftar Template Surat*

Implementasi tampilan tersebut mayoritas menggunakan fungsi dan komponen bawaan Filament, yaitu : fungsi “table()” untuk menampilkan tabel. Selain itu, terdapat komponen “Stack” untuk mengatur dan menampilkan beberapa elemen atau informasi secara vertikal dalam satu kolom. Tampilan juga menggunakan komponen “TextColumn”. Dan untuk mempermudah pencarian jenis surat, tampilan tersebut dilengkapi dengan fitur search.

##### 4.2.7. Implementasi Surat Keluar Resource

Resource Surat Keluar digunakan untuk menampilkan daftar surat keluar. Resource ini juga mengelola proses pembuatan surat keluar baru. Arti dari surat keluar adalah surat yang akan dikeluarkan oleh sistem. Resource ini hanya dapat diakses oleh staf akademik.

**a. Halaman Daftar Surat Keluar**
Pada halaman daftar surat keluar, staf akademik dapat melihat daftar surat yang sudah pernah dibuat. Selain itu, jika surat keluar di-generate berdasarkan pengajuan mahasiswa, maka staf akademik dapat menyelesaikan proses pengajuan tersebut melalui halaman ini. Staf akademik juga dapat membuat surat keluar baru dengan

menekan tombol “Tambah Surat Keluar” yang berada di sisi kanan atas. Tampilan halaman ini dapat dilihat pada gambar 4.40 berikut.

![Gambar 4.40. Tampilan Daftar Surat Keluar](images/gambar-4.40.png)
*Gambar 4.40. Tampilan Daftar Surat Keluar*

Proses implementasi untuk tampilan tersebut sama dengan halaman daftar pengajuan. Tampilan dibuat dengan fungsi “table()” dan komponen “TextColumn”. Halaman ini juga memiliki fitur filter dan search. Kode filter tersebut sama dengan kode filter pada Resource Pengajuan. Selain itu, pada setiap surat keluar terdapat dua aksi yang dapat dilakukan, yaitu melihat detail surat dan menyelesaikan proses pengajuan jika surat tersebut hasil generate dari pengajuan mahasiswa. Pada aksi penyelesaian pengajuan tersebut, ketika tombol ditekan, maka muncul modal yang berisi tiga kotak masukan, yaitu keterangan, metode penyelesaian, dan kotak upload surat final bertanda tangan. Apabila metode penyelesaian yang dipilih adalah Unggah Surat Final (Online) maka kotak upload surat keluar final menjadi wajib diisi. Akan tetapi, jika metode penyelesaian yang dipilih adalah Ambil Surat di Ruang Akademik (Offline), maka kotak upload tidak akan muncul. Proses penyimpanan data memiliki alur yang sama dengan penyelesaian pengajuan pada fitur edit pengajuan. Potongan kode untuk menyimpan perubahan tersebut dapat dilihat pada gambar 4.41 berikut.

![Gambar 4.41. Potongan kode untuk menyelesaikan pengajuan](images/gambar-4.41.png)
*Gambar 4.41. Potongan kode untuk menyelesaikan pengajuan*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-3 memeriksa apakah metode penyelesaian (completion_method) adalah offline_pickup dan Baris ke-4 mendapatkan jalur file surat yang diunggah.
ii. Baris ke-6 hingga ke-8 menangani kasus jika surat diambil secara offline, di mana keterangan final (keterangan_final) disimpan dan status tampilan (is_show) diubah ke false.

iii. Baris ke-10 hingga ke-19 menangani kasus pengunggahan file surat yang sudah ditandatangani. File PDF lama akan dihapus, file yang diunggah dipindahkan ke penyimpanan publik, dan URL PDF record diperbarui.
iv. Baris ke-17 mengatur status “is_show” menjadi true setelah file baru diunggah.
v. Baris ke-20 menyimpan perubahan pada record surat keluar ke database.
vi. Baris ke-21 hingga ke-29 adalah blok kondisional yang memeriksa apakah ada record pengajuan terkait. Jika ada, status pengajuan diubah menjadi selesai, keterangan final disimpan, dan notifikasi sukses ditampilkan. Jika tidak ada record terkait, notifikasi peringatan ditampilkan.
vii. Baris ke-35 hingga ke-41 adalah blok catch yang menangkap error yang terjadi selama proses. Sistem akan menampilkan notifikasi error kepada pengguna.

**b. Halaman Tambah Surat Keluar**
Halaman ini dapat diakses apabila staf akademik menekan tombol “Buat Surat Keluar” yang berada di sisi atas halaman daftar surat keluar. Staf akademik harus memilih salah satu jenis surat terlebih dahulu untuk dapat melihat halaman ini. Daftar jenis surat yang dipilih adalah halaman daftar template yang dibuat melalui Template Resource. Pada halaman ini, staf akademik dapat mengisikan data surat yang dibutuhkan oleh jenis surat yang telah dipilih sebelumnya. Berbeda dengan pengajuan surat, pada pembuatan surat tanpa pengajuan ini, kotak masukan tidak diisi dengan data mahasiswa. Dengan demikian, staf akademik harus mengisikan semua kotak masukan yang harus diisi. Proses implementasi halaman ini menggunakan fungsi “form()” dengan kode yang sama dengan kode untuk menampilkan formulir data surat pada halaman tambah pengajuan. Dan proses serta kode untuk membuat surat sama dengan kode untuk men-generate surat pada halaman edit pengajuan. Tampilan halaman tambah surat keluar untuk jenis surat tugas dapat dilihat pada gambar 4.42 berikut.

![Gambar 4.42. Tampilan Halaman Tambah Surat Tugas](images/gambar-4.42.png)
*Gambar 4.42. Tampilan Halaman Tambah Surat Tugas*

**c. Halaman Detail Surat Keluar**
Halaman ini berisi detail dari surat keluar. Halaman ini dapat diakses dengan menekan ikon mata pada salah satu surat keluar. Melalui halaman ini staf akademik dapat melihat detail surat beserta tombol download untuk mengunduh file surat keluar. Tampilan dari halaman ini dapat dilihat pada gambar 4.43 berikut.

![Gambar 4.43. Halaman Detail Surat Keluar](images/gambar-4.43.png)
*Gambar 4.43. Halaman Detail Surat Keluar*

Proses implementasi halaman tersebut menggunakan halaman kustom. Pembuatan tampilan tersebut menggunakan komponen “TextEntry” untuk menampilkan data surat keluar. Namun, fungsi yang digunakan bukan fungsi

“table()” tetapi fungsi “infolist()”. Potongan kode untuk menampilkan data surat dapat dilihat pada gambar 4.44 berikut.

![Gambar 4.44. Potongan Kode untuk Menampilkan Detail Surat Keluar](images/gambar-4.44.png)
*Gambar 4.44. Potongan Kode untuk Menampilkan Detail Surat Keluar*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-3 hingga ke-5 membuat entri teks untuk "Nomor Surat", mengambil nilainya dari “record->nomor_surat” dan menampilkan ikon hashtag.
ii. Baris ke-6 hingga ke-9 membuat entri teks untuk "Pengaju Surat", mengambil nama pengaju dari “record->metadata['nama']” dan menampilkan ikon user circle.
iii. Baris ke-10 hingga ke-14 membuat entri teks untuk "Jenis Surat", mengambil nama template dari “record->template->name”, menampilkannya sebagai badge, dan memberikan warna 'success'.
iv. Baris ke-15 hingga ke-25 membuat entri teks untuk "Prodi" (Program Studi).
v. Baris ke-17 hingga ke-19 mendapatkan kode prodi dari “record- >metadata['prodi']”.

vi. Baris ke-21 hingga ke-24 jika kode prodi ditemukan, kode tersebut akan mencari nama prodi berdasarkan kode dan mengembalikannya, jika tidak ditemukan akan mengembalikan kode prodi.

##### 4.2.8. Implementasi Surat Masuk Resource

Surat Masuk Resource digunakan untuk menampilkan daftar surat masuk yang telah diunggah oleh staf akademik. Resource ini hanya dapat diakses oleh staf akademik. Melalui resource ini, staf akademik dapat menyimpan surat-surat milik DTEDI dengan aman. Pada resource ini, proses penyimpanan data akan melalui proses OCR untuk mengekstraksi bagian-bagian surat.

**a. Halaman Daftar Surat Masuk**
Pada halaman daftar surat masuk, staf akademik dapat melihat daftar surat yang sudah diunggah ke dalam sistem. Surat-surat tersebut tidak dapat dihapus. Staf akademik hanya dapat melihat detail dari masing-masing surat. Melalui halaman ini, staf akademik dapat menekan tombol “Review OCR” untuk menuju ke halaman review OCR. Tombol tersebut akan berubah menjadi “Lihat Hasil OCR” jika status review OCR adalah reviewed. Tampilan halaman ini dapat dilihat melalui gambar 4.45 berikut.

![Gambar 4.45. Tampilan Halaman Daftar Surat Masuk](images/gambar-4.45.png)
*Gambar 4.45. Tampilan Halaman Daftar Surat Masuk*

**b. Halaman Tambah Surat Masuk**
Pada halaman tambah surat masuk, staf akademik dapat mengunggah surat untuk menyimpannya ke dalam sistem. Kotak masukan pada halaman ini, hanya menerima masukan berupa file PDF dengan jumlah satu file. Proses penyimpanan akan dimulai setelah staf akademik menekan tombol “Simpan Surat”. Tampilan halaman ini dapat dilihat pada gambar 4.46 berikut.

![Gambar 4.46. Tampilan Halaman Tambah Surat Masuk](images/gambar-4.46.png)
*Gambar 4.46. Tampilan Halaman Tambah Surat Masuk*

Proses implementasi halaman ini menggunakan fungsi “form()” dengan komponen “FileUpload”. Formulir diatur hanya menerima satu masukan file bertipe PDF. File surat keluar tersebut disimpan ke dalam folder penyimpanan lokal bernama “suratKeluar”. Kemudian, untuk mempermudah proses OCR dan pengambilan data dari database, setiap berkas yang diunggah akan memiliki “task_id”. Id tersebut juga digunakan untuk memudahkan proses OCR. Data-data tersebut kemudian dikirim ke OCR service melalui endpoint API yang telah dibuat oleh OCR service. Data yang dikirim berupa URL surat dan task_id. Potongan kode untuk mengirimkan data ke OCR service dapat dilihat pada gambar 4.47 berikut.

![Gambar 4.47. Potongan Kode untuk Memproses Surat Masuk](images/gambar-4.47.png)
*Gambar 4.47. Potongan Kode untuk Memproses Surat Masuk*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-5 dan ke-6 menyimpan file yang diunggah ke penyimpanan Laravel (storage/suratMasuk) dan mendapatkan kontennya.
ii. Baris ke-8 hingga ke-10 membuat “task_id” unik untuk proses ini dan menyimpannya ke storage dengan kunci “current_task_id”, serta mendapatkan URL publik dari file yang disimpan.
iii. Baris ke-12 hingga ke-15 mengirimkan permintaan POST ke layanan OCR (submit_pdf) dengan menyertakan “task_id” dan “pdfUrl” dalam format JSON.

iv. Baris ke-17 hingga ke-22 memeriksa apakah respons dari layanan OCR berhasil. Jika berhasil, status polling diatur ke true dan notifikasi sukses ditampilkan kepada pengguna.
v. Baris ke-23 hingga ke-29 menangani kasus jika respons dari layanan OCR gagal. Indikator loading disembunyikan dan menampilkan notifikasi error.
vi. Baris ke-31 hingga ke-39 adalah blok catch yang menangkap semua error tak terduga yang terjadi selama proses. Jika terdapat error, indikator loading disembunyikan dan menampilkan notifikasi error.

Setelah proses OCR dimulai, maka sistem akan mendapatkan kiriman informasi melalui payload yag menyatakan bahwa proses OCR dimulai. Apabila proses OCR telah selesai dilakukan, web SuratTEDI akan mendapatkan payload hasil proses OCR service yang dikirim melalui webhook. Kemudian sistem SuratTEDI akan menyimpan data tersebut ke database. Potongan kode untuk proses tersebut dapat dilihat pada gambar 4.48 berikut.

![Gambar 4.48. Potongan kode URL webhook dan simpan hasil OCR](images/gambar-4.48.png)
*Gambar 4.48. Potongan kode URL webhook dan simpan hasil OCR*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-1 hingga ke-3 adalah awal dari blok try yang menangkap payload atau kiriman informasi lengkap dari webhook.

ii. Baris ke-5 hingga ke-6 mengakses “task_id” dan “pdf_url” dan menyimpan ke variabel masing-masing.
iii. Baris ke-9 hingga ke-11 melakukan validasi terhadap payload yang diterima. Jika valid, perulangan akan dimulai.
iv. Baris ke-13 hingga ke-24 merupakan proses penyimpanan data.
v. Baris ke-26 hingga ke-31 adalah blok penanganan kesalahan bagian “processed_documents” tidak ditemukan atau formatnya tidak sesuai yang diharapkan. Sistem akan mengembalikan respons 400 Bad Request kepada pengirim webhook.
vi. Baris ke-32 hingga ke-37 merupakan blok catch yang menangani semua exception selama seluruh proses penerimaan dan penyimpanan data. Sistem akan mengembalikan error kepada pengirim webhook.

Setelah sistem menerima pemberitahuan dari OCR service bahwa proses OCR dimulai, maka polling juga akan dimulai. Polling tersebut digunakan untuk mengecek apakah hasil OCR tersebut telah tersimpan di database. Proses ini dilakukan berulang hingga data yang diinginkan telah diterima. Potongan kode untuk proses polling dapat dilihat pada gambar 4.49 berikut.

![Gambar 4.49. Potongan Kode Proses Polling](images/gambar-4.49.png)
*Gambar 4.49. Potongan Kode Proses Polling*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-3 hingga ke-7 memastikan polling hanya berlanjut jika diperlukan dan mengambil record surat terkait dari database.
ii. Baris ke-9 hingga ke-15 memeriksa apakah semua data OCR telah ditemukan dan lengkap. Jika ya, polling dihentikan dan indikator loading disembunyikan.
iii. Baris ke-16 hingga ke-21 mendeteksi format UGM pada setiap surat dan menghapus surat yang tidak berformat UGM.
iv. Baris ke-23 hingga ke-29 memperbarui status review surat menjadi “pending_review” jika format UGM tidak terdeteksi.
v. Baris ke-30 hingga ke-34 menampilkan notifikasi sukses dan mengarahkan pengguna ke halaman review surat masuk.
vi. Baris ke-35 hingga ke-52 menangani berbagai skenario kegagalan atau status tidak lengkap, menampilkan modal peringatan.

**c. Halaman Review OCR**
Pada halaman review OCR, staf akademik dapat melihat teks hasil OCR, file PDF dari surat tersebut, dan mengubah hasil OCR. Apabila staf akademik menemukan kesalahan dalam hasil konversi maupun hasil ekstraksi, staf akademik dapat mengubahnya. Sebagai contoh, apabila terdapat huruf yang hilang dari teks hasil OCR, maka staf akademik dapat menambahkan huruf tersebut. Tampilan halaman review OCR dapat dilihat pada gambar 4.50 berikut.

![Gambar 4.50. Gambar Tampilan Halaman Review OCR (1)](images/gambar-4.50.png)
*Gambar 4.50. Gambar Tampilan Halaman Review OCR (1)*

Tampilan pada gambar 4.50 merupakan tampilan hasil OCR. Tampilan tersebut berisi jenis surat yang sedang di-review. Selain itu, terdapat keterangan warna untuk highlight bagian-bagian surat. Lanjutan dari tampilan tersebut dapat dilihat pada gambar 4.51 berikut.

![Gambar 4.51. Gambar Tampilan Halaman Review OCR (2)](images/gambar-4.51.png)
*Gambar 4.51. Gambar Tampilan Halaman Review OCR (2)*

Tampilan pada gambar 4.51 merupakan lanjutan tampilan halaman review OCR. Tampilan tersebut adalah contoh jika proses ekstraksi bagian-bagian surat berhasil dilakukan. Di sisi kanan terdapat preview surat yang sedang di-review. Lanjutan dari halaman tersebut dapat dilihat pada gambar 4.52 berikut.

![Gambar 4.52. Gambar Tampilan Halaman Review OCR (2)](images/gambar-4.52.png)
*Gambar 4.52. Gambar Tampilan Halaman Review OCR (2)*

Selain itu, apabila hasil ekstraksi tidak sesuai atau ada bagian yang belum terekstraksi, maka staf akademik dapat menyorot teks yang akan dipilih menggunakan mouse. Setelah itu, staf akademik dapat memilih jenis dari teks yang disoroti. Terdapat lima bagian surat yang dapat dipilih oleh staf akademik, yaitu nomor surat, isi surat, penanda tangan, tanggal pembuatan surat, dan tujuan surat. Kemudian, sistem akan menampilkan sorotan pada setiap bagian dengan warna yang berbeda-beda. Tampilan modal pilihan bagian-bagian surat dapat dilihat pada gambar 4.53 berikut.

![Gambar 4.53. Tampilan Modal Pilihan](images/gambar-4.53.png)
*Gambar 4.53. Tampilan Modal Pilihan*

Proses implementasi halaman tersebut menggunakan beberapa kodingan tambahan untuk menampilkan modal. Data hasil OCR berupa teks OCR dan hasil ekstraksi dikirim ke file blade yang merupakan file untuk mengatur tampilan antarmuka halaman review OCR. Pada file blade, tersebut data tersebut ditampilkan dengan bantuan fungsi-fungsi Javascript. Fungsi tersebut terdiri dari:

a. fungsi untuk menampilkan sorotan dari hasil ekstraksi bagian-bagian surat,
b. fungsi untuk menyimpan perubahan teks OCR,
c. dan fungsi untuk mengirimkan data perubahan tersebut ke komponen Filament untuk disimpan di database.

Proses menampilkan sorotan terdiri dari beberapa fungsi, yaitu fungsi untuk mencari letak teks hasil ekstraksi pada teks hasil OCR dan fungsi untuk menampilkan sorotan. Potongan kode untuk fungsi pencarian teks hasil ekstraksi dapat dilihat pada gambar 4.54 berikut.

![Gambar 4.54. Potongan Kode Proses Menyoroti Hasil Ekstraksi](images/gambar-4.54.png)
*Gambar 4.54. Potongan Kode Proses Menyoroti Hasil Ekstraksi*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-1 hingga ke-6 mendefinisikan fungsi “renderHighlights()” yang bertugas menampilkan penyorotan pada teks hasil OCR, memastikan elemen penampil teks tersedia.
ii. Baris ke-8 hingga ke-15 menginisialisasi ulang konten teks dan node-node teks dari data OCR asli dan anotasi.
iii. Baris ke-17 hingga ke-24 memproses data anotasi, menyaring yang tidak valid, dan mengurutkannya untuk persiapan penyorotan.
iv. Baris ke-26 hingga ke-34 mengulang setiap anotasi yang sudah diurutkan dan menerapkan penyorotan pada teks yang sesuai dengan tag “<mark>” berwarna.
v. Baris ke-35 dan ke-36 mencetak pesan konfirmasi selesainya proses penyorotan.

Setelah proses persiapan teks hasil OCR selesai, proses selanjutnya adalah menampilkan sorotan berdasarkan hasil ekstraksi bagian-bagian surat. Proses ini menggunakan fungsi “wrapTextByPosition()”. Potongan kode untuk menampilkan proses penyorotan tersebut dapat dilihat pada gambar 4.55 berikut.

![Gambar 4.55. Potongan kode Proses Penyorotan Hasil Ekstraksi](images/gambar-4.55.png)
*Gambar 4.55. Potongan kode Proses Penyorotan Hasil Ekstraksi*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-1 hingga ke-11 mendefinisikan fungsi “wrapTextByPosition()” yang bertujuan untuk membungkus teks tertentu dengan tag “<mark>” untuk penyorotan, serta melakukan validasi awal masukan.
ii. Baris ke-13 hingga ke-21 menginisialisasi variabel untuk menjelajahi struktur HTML dan menemukan posisi teks yang tepat.
iii. Baris ke-23 hingga ke-42 menelusuri setiap bagian teks di halaman untuk menentukan secara presisi rentang awal dan akhir teks yang akan disorot.
iv. Baris ke-43 hingga ke-48 memastikan rentang teks telah berhasil ditemukan; jika tidak, proses penyorotan dihentikan dengan peringatan.
v. Baris ke-49 hingga ke-59 membuat tag “<mark>” dengan warna yang ditentukan dan membungkus teks yang sudah dipilih ke dalamnya.
vi. Baris ke-60 hingga ke-70 menangkap dan mencatat setiap kesalahan yang terjadi selama proses pembungkusan teks, memberikan detail diagnostik.

Adapun proses penyorotan manual yang dapat dilakukan oleh staf akademik. Proses penyorotan/highlight teks tersebut menggunakan mouse. Jika penyorotan dengan mouse berhenti, modal untuk menentukan bagian surat akan muncul. Melalui modal tersebut, staf akademik dapat memilih bagian surat yang dipilih tersebut. Potongan kode untuk proses penyorotan dengan mouse tersebut dapat dilihat pada gambar 4.56 berikut.

![Gambar 4.56. Potongan Kode Proses Seleksi Bagian Surat](images/gambar-4.56.png)
*Gambar 4.56. Potongan Kode Proses Seleksi Bagian Surat*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-1 hingga ke-3 mengaktifkan fungsi ini setiap kali pengguna selesai menyeleksi teks dengan mouse, lalu memeriksa apakah ada teks yang benar- benar dipilih.
ii. Baris ke-4 hingga ke-12 mendapatkan detail rentang seleksi, memeriksa elemen terkait, dan menyimpannya.
iii. Baris ke-14 memanggil modal anotasi untuk ditampilkan sesuai posisi seleksi.

Apabila staf akademik sudah memilih bagian surat tersebut, maka sistem akan menyoroti bagian tersebut. Data terbaru tersebut akan dikirim ke Filament. Proses pengiriman menggunakan fungsi “dispatchUpdate”. Potongan fungsi tersebut ada pada gambar 4.57 berikut.

![Gambar 4.57. Potongan Kode Pengiriman Data](images/gambar-4.57.png)
*Gambar 4.57. Potongan Kode Pengiriman Data*

Pada Filament, fungsi dengan nama yang sama, yaitu “updateData()” akan menerima data yang dikirimkan tersebut. Data divalidasi kemudian disimpan ke variabel public yang ada di Filament. Proses ini dilakukan sebelum data disimpan ke database. Potongan kode untuk proses tersebut dapat dilihat pada gambar 4.58 berikut.

![Gambar 4.58. Potongan Kode Hasil Review OCR Di Filament](images/gambar-4.58.png)
*Gambar 4.58. Potongan Kode Hasil Review OCR Di Filament*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-4 hingga ke-8 memperbarui teks OCR dan data anotasi pada record serta properti di frontend.
ii. Baris ke-9 hingga ke-15 adalah blok try yang menyimpan perubahan ke database. Jika berhasil, sistem akan mencatat dan menampilkan notifikasi sukses kepada pengguna.
iii. Baris ke-16 hingga ke-19 menangkap dan mencatat exception jika penyimpanan gagal, lalu menampilkan notifikasi error kepada pengguna.

Apabila staf akademik menekan tombol “Simpan”, maka data disimpan ke database berdasarkan data terbaru yang ada pada variabel di Filament. Selain itu, status review dari surat tersebut berubah menjadi reviewed. Jika itu adalah dokumen baru, atau teks halaman merupakan kelanjutan dokumen yang sedang dikelompokkan, teks akan ditambahkan, dan akhirnya, fungsi ini mengembalikan daftar dokumen yang telah dikelompokkan. Potongan kode untuk menyimpan data ke database dapat dilihat pada gambar 4.59 berikut.

![Gambar 4.59. Potongan Kode Penyimpanan Hasil Review OCR](images/gambar-4.59.png)
*Gambar 4.59. Potongan Kode Penyimpanan Hasil Review OCR*

Potongan kode di atas dapat dijelaskan sebagai berikut:

i. Baris ke-3 mengambil data dari formulir yang sedang aktif.
ii. Baris ke-5 hingga ke-7 mengisi atribut “letter_type” pada record saat ini dengan data dari formulir.
iii. Baris ke-9 memperbarui “review_status” menjadi 'reviewed'.
iv. Baris ke-10 menyimpan perubahan pada record ke database.
v. Baris ke-11 hingga ke-12 menampilkan notifikasi sukses kepada pengguna bahwa review OCR dokumen berhasil disimpan.
vi. Baris ke-13 mengarahkan pengguna kembali ke halaman indeks SuratMasukResource.

**d. Halaman Detail Surat Masuk**
Pada halaman detail surat masuk, staf akademik dapat melihat detail surat masuk dari hasil ekstraksi OCR service maupun hasil penyorotan manual. Selain itu, staf akademik juga dapat mengunduh file surat masuk tersebut. Proses implementasi halaman tersebut sama dengan proses implementasi halaman detail surat keluar. Kode yang digunakan pun sama, hanya berbeda pada lokasi surat yang diunduh dan kode tersebut dituliskan dalam Surat Masuk Resource. Tampilan halaman tersebut dapat dilihat pada gambar 4.60 berikut.

![Gambar 4.60. Tampilan Halaman Detail Surat Masuk](images/gambar-4.60.png)
*Gambar 4.60. Tampilan Halaman Detail Surat Masuk*

#### 4.3. Pengujian OCR Service

Proses pengujian OCR service melibatkan dua jenis pengujian utama yang berbeda. Pertama adalah pengujian performa, yang menilai kecepatan dan efisiensi layanan. Kedua, terdapat pengujian akurasi, untuk mengukur ketepatan hasil pengenalan teks. Untuk pengujian akurasi ini, sistem menggunakan library Editdistance dalam proses perhitungannya.

##### 4.3.1. Pengujian Performa

Proses pengujian performa OCR service dilakukan untuk mengukur waktu pemrosesan dan penggunaan memori saat memproses satu dokumen. Pengujian ini dilaksanakan pada beberapa jenis surat dan dokumen uji yang bervariasi. Dokumen uji tersebut meliputi surat dengan jumlah lembar lebih dari satu (contoh: Surat Tugas MTQMN 2023), surat dengan background (contoh: Surat Rekomendasi dari BEM KM SV UGM), surat dengan kualitas buruk (contoh: Surat Permohonan Pembukaan Portal Pembayaran UKT), serta surat dengan kualitas baik (contoh: Surat Permohonan Penelitian Proyek Akhir). Hasil pengujian yang terdokumentasi secara rinci dapat dilihat pada Lampiran 4. Ringkasan hasil pengujian performa pada beberapa dokumen uji tersebut disajikan pada tabel 4.1 berikut.

**Tabel 4.1. Hasil Pengujian Performa OCR Service**

| Metrik | Surat Tugas MTQMN 2023 (Multi-lembar) | Surat Rekomendasi dari BEM KM SV UGM (Memiliki Background) | Surat Permohonan Pembukaan Portal Pembayaran UKT (Kualitas Buruk) | Surat Permohonan Penelitian Proyek Akhir (Kualitas Baik) |
|---|---|---|---|---|
| *Waktu Pemrosesan (detik)* | | | | |
| Pengunduhan/Penyalinan | 0,0119 | 0,0024 | 0,003 | 0,002 |
| Konversi PDF ke Gambar | 1,6446 | 0,8842 | 2,7577 | 1,3947 |
| Proses OCR | 4,2046 | 1,9471 | 4,5381 | 2,524 |
| Pengelompokan Dokumen | 0,0022 | 0,0001 | 0,0001 | 0 |
| Deteksi Pola (per dokumen) | 0,0104 | 0,0035 | 0,0139 | 0,0036 |
| **Total Pemrosesan** | **5,9362** | **2,8517** | **7,3274** | **3,9463** |
| *Penggunaan Memori (MB)* | | | | |
| Awal | 105,32 | 52,18 | 52,21 | 52,09 |
| Puncak | 136,43 | 105,33 | 107,54 | 105,25 |
| Akhir | 136,45 | 105,36 | 107,56 | 105,29 |

Dari tabel hasil pengujian performa tersebut, dapat diketahui bahwa kualitas gambar atau dokumen memiliki dampak signifikan terhadap waktu proses OCR dan total waktu pemrosesan. Dokumen dengan kualitas buruk membutuhkan waktu yang jauh lebih lama. Selain itu, dokumen multi-lembar meningkatkan total waktu pemrosesan dan penggunaan memori puncak. Hal ini menegaskan bahwa penanganan volume data yang lebih besar memerlukan sumber daya yang lebih banyak. Pada semua skenario, waktu yang dihabiskan untuk memproses OCR secara konsisten menjadi komponen waktu pemrosesan terlama. Ini mengidentifikasi tahap OCR sebagai bottleneck utama dalam alur kerja sistem.

Adapun penggunaan memori puncak menunjukkan variasi yang signifikan. Meskipun konsisten untuk dokumen satu lembar, ada lonjakan yang jelas ketika memproses dokumen multi-lembar. Hal ini menunjukkan bahwa sistem

mengonsumsi lebih banyak RAM saat menangani beberapa halaman atau data gambar yang lebih besar. Berdasarkan analisis hasil pengujian performa, sistem ini secara umum menunjukkan performa yang cukup baik. Performa ini terutama terlihat dalam pemrosesan dokumen satu lembar dengan kualitas baik.

##### 4.3.2. Pengujian Akurasi

Proses pengujian OCR service telah dilakukan pada sejumlah dokumen. Pengujian ini menggunakan berbagai jenis sample dokumen dengan hasil yang diukur menggunakan tiga metrik utama, yaitu Character Error Rate (CER) dan Word Error Rate (WER. CER mengukur persentase kesalahan karakter pada hasil OCR, sedangkan WER mengukur persentase kesalahan kata pada hasil OCR. Semakin rendah nilai CER dan WER, maka hasil OCR semakin akurat.

Secara umum, hasil pengujian menunjukkan bahwa sistem OCR memiliki akurasi yang baik untuk dokumen yang uji. Sebagian besar hasil pengujian menunjukkan CER memiliki nilai rata-rata 5,71% dan WER sebesar 9,59%. Hal ini menandakan bahwa OCR service tersebut memiliki kemampuan yang baik dalam mengonversi teks. Namun, terdapat beberapa hasil pengujian yang menunjukkan penurunan akurasi OCR. Hal ini dikarenakan oleh beberapa hal berikut.

**a. Logo universitas dan tanda tangan basah**

Hal ini dapat dilihat pada dokumen uji “Surat Aktif a.n Adiyatma” yang memiliki hasil pengujian CER sebesar 3,94% dan nilai WER sebesar 7,14%. Penambahan karakter maupun penyisipan dalam teks tersebut mempengaruhi hasil perhitungan CER dan WER. Namun, tidak mempengaruhi hasil ekstraksi bagian surat karena berada di luar bagian-bagian penting surat. Teks tersebut kemudian dibandingkan dengan ground truth dari surat tersebut.

**b. Adanya latar belakang dalam surat**

Dokumen “Surat Rekomendasi dari BEM KM SV UGM” memiliki nilai CER sebesar 37,19% dan nilai WER sebesar 42,75%. Nilai CER dan WER tersebut tergolong paling ekstrem bahkan mendekati setengah hasil OCR-nya tidak sesuai.

Hal ini disebabkan oleh latar belakang surat yang sangat besar. Latar belakang tersebut mengganggung proses segmentasi dan pengenalan karakter oleh OCR. Oleh karena itu, mayoritas kata dalam surat tersebut hilang. Tampilan surat tersebut dapat dilihat pada Lampiran 6 berikut.

**c. Kualitas scan dan noise dalam dokumen**

Hal ini dapat dilihat pada dokumen “Surat Permohonan Pembukaan Portal Pembayaran UKT” yang memiliki nilai CER sebesar 33,80% dan nilai WER sebesar 45,41% dengan akurasi ekstraksi 0%. Nilai CER dan WER tersebut tergolong sangat tinggi. Hal ini diakibatkan oleh kualitas hasil scan yang kurang bagus dan banyaknya noise pada bagian kop surat. Oleh karena itu, OCR tidak dapat mendeteksi teks yang terletak di kop surat dan tujuan surat. OCR hanya mampu mendeteksi teks mulai dari frasa “Dengan hormat” ke bawah. Tampilan dokumen “Surat Permohonan Pembukaan Portal Pembayaran UKT” dapat dilihat pada Lampiran 7 berikut.

Dari hasil pengujian yang telah dilakukan, dapat diketahui bahwa OCR menunjukkan efektivitas tinggi. Teknologi ini mampu mengidentifikasi teks dengan baik pada sebagian besar dokumen yang diujikan. Hasil ini memberikan gambaran jelas mengenai kapabilitas OCR dalam sistem. Data lengkap dari pengujian tersebut dapat dilihat pada tabel 4.2 berikut.

**Tabel 4.2. Hasil Pengujian Akurasi OCR Service**

| Jenis Surat | Perihal Surat | CER (%) | WER (%) |
|---|---|---|---|
| Surat Tugas | Surat Tugas a.n Rosus | 1,51 | 5,77 |
| | Surat Tugas a.n Ilham | 0,53 | 2,56 |
| | Surat Tugas MTQMN 2023 | 0,30 | 1,60 |
| | Surat Tugas a.n Sigit | 0,56 | 2,00 |
| | Surat Tugas a.n Nadya | 2,67 | 5,44 |
| | **Rata-Rata Surat Tugas** | **1,11** | **3,47** |
| Surat Permohonan | Surat Permohonan Magang a.n Restu | 2,38 | 6,84 |
| | Surat Permohonan Praktik Industri a.n Melani | 0,26 | 1,00 |
| | Surat Permohonan Penelitian Proyek Akhir | 0,35 | 1,74 |
| | Surat Permohonan Praktik Industri a.n Reynaldi | 0,39 | 2,29 |
| | Surat Permohonan Pembukaan Portal Pembayaran UKT | 33,80 | 45,41 |
| | **Rata-Rata Surat Permohonan** | **7,44** | **11,46** |
| Surat Keterangan | Surat Keterangan Aktif Kuliah a.n Alya | 7,34 | 11,24 |
| | Surat Aktif a.n Adiyatma | 3,94 | 7,14 |
| | Surat Aktif a.n Ridha | 7,28 | 7,14 |
| | Surat Keterangan Lulus | 3,45 | 16,03 |
| | Surat Keterangan Aktif Kuliah a.n Devina | 6,22 | 12,94 |
| | **Rata-Rata Surat Keterangan** | **5,65** | **10,90** |
| Tidak Terklasifikasi | Berita Acara Sidang | 0,93 | 2,58 |
| | Surat Edaran Tentang Peringatan Penipuan | 0,16 | 2,18 |
| | Surat Rekomendasi dari BEM KM SV UGM | 37,19 | 42,75 |
| | Surat Rekomendasi MBKM | 1,41 | 6,20 |
| | Surat Pengantar a.n Dzaki | 3,48 | 8,92 |
| | **Rata-Rata Surat Tidak Terklasifikasi** | **8,63** | **12,53** |
| | **Rata-Rata Keseluruhan** | **5,71** | **9,59** |

#### 4.4. Pengujian Kompatibilitas Browser

Salah satu aspek penting yang akan dievaluasi adalah kompatibilitas lintas browser untuk memastikan aksesibilitas yang luas. Oleh karena itu, sistem diuji secara menyeluruh pada berbagai browser populer. Pengujian ini mencakup Google Chrome, Apple Safari, dan Microsoft Edge. Dari hasil pengujian tersebut diketahui

bahwa sistem dapat diakses dan berjalan lancar di berbagai browser dan beberapa device. Hasil pengujian dapat dilihat pada tabel 4.3 berikut.

**Tabel 4.3. Hasil Pengujian Kompabilitas Browser**

| Nama Browser | Versi | Device | Hasil |
|---|---|---|---|
| Google Chrome | 138.0.7204.169 | Desktop | Dapat diakses dengan baik |
| | 138.0.7204.168 | Phone | Dapat diakses dengan baik |
| Safari | 17.6 | Macbook | Dapat diakses dengan baik |
| | 15.8.3 | iOS | Dapat diakses dengan baik |
| Microsoft Edge | 138.0.3351.95 | Desktop | Dapat diakses dengan baik |
| | 138.0.3351.98 | Phone | Dapat diakses dengan baik |

#### 4.5. Pengujian Sistem dengan UAT

Proses pengujian UAT sistem SuratTEDI dibagi menjadi dua role, yaitu role staf akademik dan role mahasiswa. Proses pengujian mengumpulkan penilaian dari 10 responden dengan rincian 3 orang staf akademik sebagai responden untuk role staf akademik dan 7 orang mahasiswa sebagai responden untuk role mahasiswa. Responden mencoba sistem SuratTEDI kemudian mengisi formulir yang telah disiapkan. Sistem tersebut dalam sementara waktu dipublikasikan menggunakan Ngrok, sehingga dapat diakses secara publik oleh responden untuk keperluan User Acceptance Test (UAT).

Di dalam formulir terdapat beberapa pernyataan yang dapat dinilai oleh responden sesuai dengan hasil percobaan terhadap sistem SuratTEDI. Responden dapat menilai sistem SuratTEDI dengan rentang penilaian 1-5. Nilai 1 berarti sangat tidak setuju, nilai 2 berarti tidak setuju, nilai 3 berarti netral, nilai 4 berarti setuju, dan nilai 5 berarti sangat setuju. Adapun data responden dan hasil pengujian role staf akademik dapat dilihat pada tabel 4.4 dan 4.5 berikut.

**Tabel 4.4. Rincian Responden Pengujian Role Staf Akademik**

| No | Nama | Umur | Jenis Kelamin | Tugas Akademik | Masa Kerja di Akademik |
|---|---|---|---|---|---|
| 1 | Anang Susilo | 35 tahun | Laki-laki | Pengelola administrasi akademik | 10 tahun |
| 2 | Mohamad Fajri | 51 tahun | Laki-laki | Pengelola administrasi akademik | 3 tahun |
| 3 | Teguh Fajar Riyadi | 50 tahun | Laki-laki | Pengelola administrasi kemahasiswaan | 4 tahun |

Para responden tersebut mencoba sistem SuratTEDI. Responden tersebut memiliki kewenangan untuk mencoba modul administrator. Hasil uji coba tersebut menjadi dasar untuk pengisian formulir yang berisi pernyataan-pernyataan yang berkaitan dengan sistem. Tabel hasil pengujian untuk role staf akademik dapat dilihat pada tabel 4.5 berikut.

**Tabel 4.5. Hasil Pengujian untuk Role Staf Akademik**

| Pernyataan | 1 | 2 | 3 | 4 | 5 | Total Responden | Persentase (%) |
|---|---|---|---|---|---|---|---|
| Alur sistem SuratTEDI mudah dipahami | 0 | 0 | 0 | 0 | 3 | 3 | 100 |
| Pemilihan kata dalam sistem SuratTEDI mudah dipahami dan sudah sesuai | 0 | 0 | 0 | 0 | 3 | 3 | 100 |
| Proses login dalam sistem SuratTEDI mudah dilakukan dan berjalan dengan lancar | 0 | 0 | 0 | 0 | 3 | 3 | 100 |
| Proses perubahan status pengajuan hingga surat selesai (termasuk proses generate dan upload surat final) mudah dilakukan dan berjalan lancar | 0 | 0 | 0 | 0 | 3 | 3 | 100 |
| Proses perubahan status pengajuan hingga surat selesai (termasuk proses generate dan upload surat final) mudah dilakukan dan berjalan lancar | 0 | 0 | 0 | 0 | 3 | 3 | 100 |
| Proses generate surat melalui menu Surat Keluar mudah dilakukan dan berjalan lancar | 0 | 0 | 0 | 0 | 3 | 3 | 100 |
| Proses simpan surat melalui menu Surat Masuk mudah dilakukan dan berjalan lancar | 0 | 0 | 0 | 0 | 3 | 3 | 100 |
| Proses review OCR melalui tombol Review OCR pada halaman list Surat Masuk mudah dilakukan dan berjalan lancar | 0 | 0 | 0 | 0 | 3 | 3 | 100 |
| Tata letak sistem SuratTEDI terlihat rapi dan berfungsi dengan baik di device selain desktop (smartphone, tablet, dll) | 0 | 0 | 0 | 0 | 3 | 3 | 100 |
| Tampilan antarmuka pengguna dari sistem SuratTEDI terlihat menarik | 0 | 0 | 0 | 0 | 3 | 3 | 100 |
| Sistem SuratTEDI memudahkan manajemen surat (pemrosesan pengajuan surat dari mahasiswa, generate surat, dan menyimpan surat) | 0 | 0 | 0 | 0 | 3 | 3 | 100 |
| **Rata-rata Persentase Total** | | | | | | | **100** |

> Catatan: baris pernyataan "Proses perubahan status pengajuan..." tercatat dua kali pada tabel sumber (kemungkinan duplikasi pada dokumen asli) — silakan verifikasi ke data mentah UAT sebelum finalisasi.

Berdasarkan hasil pengujian yang disajikan, semua pernyataan penilaian untuk role staf akademik disetujui oleh responden. Hal ini mengindikasikan bahwa ketiga responden secara konsisten merasa bahwa sistem mudah digunakan, alur sistem mudah dipahami, pemilihan katanya sudah sesuai, dan aspek fungsionalnya berjalan lancar. Selain itu, tampilan dinilai sudah rapi, menarik, dan responsif terhadap perangkat yang digunakan. Ketiga responden menilai sistem tersebut memudahkan proses manajemen surat yang mencakup pemrosesan pengajuan dari mahasiswa, generate surat, hingga proses penyimpanan surat. Adapun rincian data responden dan hasil pengujian untuk role mahasiswa dapat dilihat pada tabel 4.6 dan 4.7 berikut.

**Tabel 4.6. Rincian Responden Pengujian Role Mahasiswa**

| No | Nama | Umur | Jenis Kelamin | Program Studi | Semester |
|---|---|---|---|---|---|
| 1 | Kamila Anisa | 18 | Perempuan | Teknologi Rekayasa Perangkat Lunak | 2 |
| 2 | Siti Nur Azizah | 18 | Perempuan | Teknologi Rekayasa Perangkat Lunak | 2 |
| 3 | Nafillah Izzah Syahfitri Wardani | 18 | Perempuan | Teknologi Rekayasa Perangkat Lunak | 2 |
| 4 | Rizky Laksmitha | 18 | Perempuan | Teknologi Rekayasa Perangkat Lunak | 2 |
| 5 | Devia Artika Maharani | 18 | Perempuan | Teknologi Rekayasa Perangkat Lunak | 2 |
| 6 | Alya Anjani | 22 | Perempuan | Teknologi Rekayasa Perangkat Lunak | 8 |
| 7 | Sri Ningsih | 22 | Perempuan | Teknologi Rekayasa Instrumentasi dan Kontrol | 6 |

Para responden tersebut mencoba sistem SuratTEDI. Responden tersebut memiliki kewenangan untuk mencoba modul mahasiswa. Hasil uji coba tersebut menjadi dasar untuk pengisian formulir yang berisi pernyataan-pernyataan yang berkaitan dengan sistem. Tabel hasil pengujian untuk role mahasiswa dapat dilihat pada tabel 4.7 berikut.

**Tabel 4.7. Hasil Pengujian untuk Role Mahasiswa**

| Pernyataan | 1 | 2 | 3 | 4 | 5 | Total Responden | Persentase (%) |
|---|---|---|---|---|---|---|---|
| Alur sistem SuratTEDI mudah dipahami | 0 | 0 | 0 | 3 | 4 | 7 | 91,43 |
| Pemilihan kata dalam sistem SuratTEDI mudah dipahami dan sudah sesuai | 0 | 0 | 0 | 5 | 2 | 7 | 85,71 |
| Proses login dalam sistem SuratTEDI mudah dilakukan dan berjalan dengan lancar | 0 | 0 | 0 | 2 | 5 | 7 | 94,29 |
| Proses pengajuan surat dalam sistem SuratTEDI mudah digunakan dan berjalan lancar | 0 | 0 | 0 | 3 | 4 | 7 | 91,43 |
| Proses ubah profil dalam sistem SuratTEDI mudah digunakan dan berjalan lancar | 1 | 0 | 1 | 2 | 3 | 7 | 77,14 |
| Tampilan antarmuka pengguna dari sistem SuratTEDI terlihat menarik | 0 | 0 | 1 | 3 | 3 | 7 | 85,71 |
| Sistem SuratTEDI memudahkan proses pengajuan surat dan pengecekan status pengajuan surat | 0 | 0 | 0 | 2 | 5 | 7 | 94,29 |
| **Rata-rata Persentase Total** | | | | | | | **88,57** |

Berdasarkan hasil pengujian yang disajikan, responden merasa alur sistem mudah dipahami dan pemilihan katanya sudah sesuai. Selain itu, proses login dan proses pengajuan juga berjalan lancar. Responden juga merasa bahwa tampilan menarik dan proses pengajuan surat serta pengecekan status pengajuan menjadi lebih mudah dan efisien. Namun, terdapat satu bagian yang memiliki variasi penilaian, yaitu pada proses ubah profil. Terdapat satu responden yang menilai 1 yaitu sangat tidak setuju.

Hasil perhitungan rata-rata persentase dari role staf akademik dan role mahasiswa kemudian dapat digunakan. Ini bertujuan untuk menghitung persentase tingkat penerimaan pengguna secara keseluruhan terhadap sistem SuratTEDI. Proses ini penting untuk memberikan gambaran komprehensif tentang kepuasan pengguna. Perhitungan persentase tingkat penerimaan pengguna tersebut adalah sebagai berikut:

Rumus perhitungan tingkat penerimaan pengguna:

```
Tingkat Penerimaan Pengguna = (Role Staf Akademik + Role Mahasiswa) / 2
Tingkat Penerimaan Pengguna = (100,00% + 88,57%) / 2
Tingkat Penerimaan Pengguna = 94,29%
```

Dari persentase penerimaan pengguna terhadap sistem SuratTEDI tersebut dapat disimpulkan bahwa sistem SuratTEDI berhasil memenuhi ekspektasi pengguna (staf Akademik DTEDI dan mahasiswa DTEDI). Hasil UAT mengonfirmasi bahwa sistem SuratTEDI efektif menjadi solusi dari permasalahan terkait proses pengajuan surat dan proses manajemen surat di Bagian Akademik DTEDI UGM. Hal ini didukung dengan mayoritas fungsionalitas dan alur yang dapat berjalan lancar dan efisien. Melalui perbaikan sesuai hasil pengujian seperti pada proses ubah profil, diharapkan sistem SuratTEDI dapat meningkatkan kepuasan pengguna dan lebih optimal dalam mendukung proses manajemen surat.

