# Requirements Document

## Introduction

Fitur **Well Merged View** menambahkan tampilan agregasi pada aplikasi DDR OCR Project. Saat ini dashboard hanya menampilkan daftar dokumen DDR per file. Fitur ini memperkenalkan "Well View" — sebuah tampilan yang mengelompokkan semua dokumen DDR berdasarkan `well_pad_name` yang sama, sehingga pengguna dapat melihat seluruh riwayat aktivitas pengeboran suatu sumur secara terpadu dalam satu halaman, lengkap dengan filter tanggal pada data time breakdown.

## Glossary

- **Well**: Sumur pengeboran yang diidentifikasi oleh `well_pad_name` (contoh: `PTH-G-4C`).
- **Well_Pad_Name**: Nama unik sumur yang diekstrak dari dokumen DDR dan disimpan di kolom `well_name` pada tabel `ddr_documents`.
- **Merged View**: Tampilan yang menggabungkan data dari beberapa dokumen DDR yang memiliki `well_pad_name` sama menjadi satu tampilan terpadu.
- **Dashboard**: Halaman utama aplikasi (`/`) yang menampilkan daftar dokumen DDR.
- **Well View**: Bagian atau halaman yang menampilkan daftar sumur unik beserta ringkasan datanya.
- **Halaman Detail Well**: Halaman (`/well/[well_pad_name]`) yang menampilkan data gabungan dari semua dokumen DDR milik satu sumur.
- **Time Breakdown**: Data aktivitas pengeboran per periode waktu yang tersimpan di tabel `ddr_time_breakdown`, setiap baris memiliki `period_date`.
- **DDR_API**: Backend FastAPI yang menyediakan endpoint data.
- **Dashboard_Page**: Halaman frontend Next.js di route `/`.
- **Well_Detail_Page**: Halaman frontend Next.js di route `/well/[well_pad_name]`.
- **Filter Tanggal**: Kontrol UI yang memungkinkan pengguna memilih rentang atau tanggal spesifik untuk menyaring data time breakdown.

---

## Requirements

### Requirement 1: Tampilan Well View di Dashboard

**User Story:** Sebagai pengguna, saya ingin melihat daftar sumur unik di dashboard, sehingga saya dapat dengan cepat menemukan dan mengakses data gabungan semua laporan DDR untuk sumur tertentu.

#### Acceptance Criteria

1. THE **Dashboard_Page** SHALL menampilkan section "Well View" yang berisi daftar sumur unik berdasarkan `well_pad_name` yang tersedia di database.
2. WHEN pengguna membuka Dashboard_Page, THE **Dashboard_Page** SHALL menampilkan section "Well View" dan section "Daftar Dokumen" secara bersamaan dalam satu halaman.
3. THE **Dashboard_Page** SHALL menampilkan jumlah dokumen DDR yang terkait untuk setiap sumur pada daftar Well View.
4. THE **Dashboard_Page** SHALL menampilkan rentang tanggal laporan (tanggal terlama hingga terbaru) untuk setiap sumur pada daftar Well View.
5. IF tidak ada dokumen DDR yang tersimpan di database, THEN THE **Dashboard_Page** SHALL menampilkan pesan "Belum ada data sumur" pada section Well View.
6. WHEN pengguna mengklik salah satu sumur pada daftar Well View, THE **Dashboard_Page** SHALL mengarahkan pengguna ke Halaman Detail Well untuk sumur tersebut, terlepas dari apakah sumur tersebut memiliki data time breakdown atau tidak.

---

### Requirement 2: Endpoint API untuk Daftar Sumur

**User Story:** Sebagai sistem frontend, saya ingin mengambil daftar sumur unik beserta ringkasannya dari backend, sehingga Dashboard_Page dapat menampilkan Well View dengan data yang akurat.

#### Acceptance Criteria

1. THE **DDR_API** SHALL menyediakan endpoint `GET /wells` yang mengembalikan daftar sumur unik berdasarkan `well_pad_name`.
2. WHEN endpoint `GET /wells` dipanggil, THE **DDR_API** SHALL mengembalikan respons dengan status HTTP 200 dan body JSON yang berisi array objek sumur, masing-masing memuat: `well_pad_name`, `document_count`, `earliest_date`, dan `latest_date`.
3. THE **DDR_API** SHALL mengurutkan hasil `GET /wells` berdasarkan `well_pad_name` secara ascending.
4. IF tidak ada dokumen di database, THEN THE **DDR_API** SHALL mengembalikan array kosong dengan status HTTP 200 pada endpoint `GET /wells`.
5. IF terjadi kegagalan koneksi database, THEN THE **DDR_API** SHALL mengembalikan respons dengan status HTTP 500 dan pesan error yang deskriptif pada endpoint `GET /wells`.

---

### Requirement 3: Endpoint API untuk Data Gabungan Satu Sumur

**User Story:** Sebagai sistem frontend, saya ingin mengambil semua data time breakdown dari seluruh dokumen DDR milik satu sumur, sehingga Well_Detail_Page dapat menampilkan riwayat aktivitas pengeboran secara lengkap.

#### Acceptance Criteria

1. THE **DDR_API** SHALL menyediakan endpoint `GET /wells/{well_pad_name}/time_breakdown` yang mengembalikan semua baris time breakdown dari seluruh dokumen DDR yang memiliki `well_pad_name` tersebut.
2. WHEN endpoint `GET /wells/{well_pad_name}/time_breakdown` dipanggil tanpa parameter filter, THE **DDR_API** SHALL mengembalikan seluruh baris time breakdown dari semua dokumen terkait tanpa filter apapun, diurutkan berdasarkan `period_date` dan `start_time` secara ascending.
3. WHEN endpoint `GET /wells/{well_pad_name}/time_breakdown` dipanggil dengan parameter `date_from` dan/atau `date_to`, THE **DDR_API** SHALL mengembalikan hanya baris time breakdown yang `period_date`-nya berada dalam rentang tanggal tersebut (inklusif).
4. THE **DDR_API** SHALL menyertakan kolom `document_id`, `filename`, dan `report_date` dari dokumen sumber pada setiap baris time breakdown yang dikembalikan.
5. IF `well_pad_name` tidak ditemukan di database, THEN THE **DDR_API** SHALL mengembalikan respons dengan status HTTP 404 dan pesan error yang deskriptif.
6. IF terjadi kegagalan koneksi database, THEN THE **DDR_API** SHALL mengembalikan respons dengan status HTTP 500 dan pesan error yang deskriptif.

---

### Requirement 4: Halaman Detail Well

**User Story:** Sebagai pengguna, saya ingin melihat halaman detail yang menggabungkan semua data time breakdown dari seluruh laporan DDR milik satu sumur, sehingga saya dapat menganalisis riwayat aktivitas pengeboran sumur tersebut secara menyeluruh.

#### Acceptance Criteria

1. THE **Well_Detail_Page** SHALL dapat diakses melalui route `/well/[well_pad_name]`.
2. WHEN pengguna membuka Well_Detail_Page, THE **Well_Detail_Page** SHALL menampilkan nama sumur (`well_pad_name`) sebagai judul halaman.
3. WHEN pengguna membuka Well_Detail_Page, THE **Well_Detail_Page** SHALL menampilkan ringkasan statistik yang mencakup: total dokumen terkait, total baris time breakdown, jumlah aktivitas PT, dan jumlah aktivitas NPT; dengan nilai nol (0) untuk setiap metrik apabila tidak ada data yang tersedia.
4. THE **Well_Detail_Page** SHALL menampilkan seluruh baris time breakdown dari semua dokumen DDR terkait dalam satu tabel, dengan kolom: Tanggal, Mulai, Selesai, Elapsed, Depth, PT/NPT, Kode, Deskripsi, dan Sumber Dokumen.
5. THE **Well_Detail_Page** SHALL menampilkan kolom "Sumber Dokumen" yang berisi nama file dokumen asal setiap baris time breakdown.
6. WHEN pengguna mengklik tautan "Kembali ke Dashboard" pada Well_Detail_Page, THE **Well_Detail_Page** SHALL mengarahkan pengguna ke Dashboard_Page.

---

### Requirement 5: Filter Tanggal pada Halaman Detail Well

**User Story:** Sebagai pengguna, saya ingin memfilter data time breakdown berdasarkan rentang tanggal tertentu di halaman detail well, sehingga saya dapat fokus menganalisis aktivitas pengeboran pada periode yang relevan.

#### Acceptance Criteria

1. THE **Well_Detail_Page** SHALL menampilkan kontrol filter tanggal berupa dua input bertipe `date`: "Dari Tanggal" dan "Sampai Tanggal".
2. WHEN pengguna mengisi salah satu atau kedua input filter tanggal dan mengkonfirmasi, THE **Well_Detail_Page** SHALL memperbarui tabel time breakdown untuk hanya menampilkan baris yang `period_date`-nya sesuai dengan rentang yang dipilih.
3. WHEN pengguna mengosongkan semua input filter tanggal dan mengkonfirmasi, THE **Well_Detail_Page** SHALL menampilkan kembali seluruh baris time breakdown tanpa filter.
4. THE **Well_Detail_Page** SHALL memperbarui ringkasan statistik (total aktivitas, PT, NPT) secara sinkron setiap kali filter tanggal berubah, sehingga statistik selalu mencerminkan data yang sedang ditampilkan.
5. IF tidak ada baris time breakdown yang cocok dengan filter tanggal yang dipilih, THEN THE **Well_Detail_Page** SHALL menampilkan pesan "Tidak ada data untuk rentang tanggal ini" pada area tabel.

---

### Requirement 6: Pembaruan Otomatis Merged View saat Upload Dokumen Baru

**User Story:** Sebagai pengguna, saya ingin data merged view sumur diperbarui secara otomatis ketika saya mengupload dokumen DDR baru dengan `well_pad_name` yang sama, sehingga saya tidak perlu melakukan tindakan tambahan untuk melihat data terbaru.

#### Acceptance Criteria

1. WHEN dokumen DDR baru berhasil diproses dan disimpan ke database dengan `well_pad_name` yang sudah ada, THE **DDR_API** SHALL menyertakan data dokumen baru tersebut dalam respons endpoint `GET /wells/{well_pad_name}/time_breakdown` pada pemanggilan berikutnya.
2. WHEN dokumen DDR baru berhasil diproses dan disimpan ke database dengan `well_pad_name` yang belum ada sebelumnya, THE **DDR_API** SHALL menyertakan sumur baru tersebut dalam respons endpoint `GET /wells` pada pemanggilan berikutnya; endpoint `GET /wells/{well_pad_name}/time_breakdown` untuk sumur baru tersebut dapat mengembalikan data yang berbeda secara sementara hingga siklus pemrosesan selesai.
3. THE **DDR_API** SHALL menentukan `well_pad_name` suatu dokumen berdasarkan nilai kolom `well_name` pada tabel `ddr_documents`, yang diisi saat proses ekstraksi PDF.
