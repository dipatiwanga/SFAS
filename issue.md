# Project Name: SFAS (Sales Fronting Activity System)

## Tech Stack
- **Runtime:** Bun
- **Frontend:** SvelteKit + `@sveltejs/adapter-static`
- **Backend:** ElysiaJS
- **Database:** Drizzle ORM + MySQL
- **Mobile:** Capacitor (Android)

## Module Overview
Pengembangan sistem SFAS untuk memonitor aktivitas marketing, membantu pengelolaan leads, dan pipeline bagi tim supervisi dan sales. Proses bisnis ini merupakan simplifikasi dan integrasi antara SFAS, Loan Origination System (LOS), dan Corebanking System.

**Tujuan Utama:**
1. Meminimalisir dokumen pengajuan untuk mengurangi risiko operasional dan mempermudah nasabah.
2. Mempercepat SLA (Service Level Agreement) akuisisi kredit.
3. Menciptakan proses pencairan kredit pensiun yang cepat dan mudah melalui simplifikasi tahapan.

---

## High-Level Implementation Plan

*(Instruksi ini bersifat high-level dan ditujukan sebagai panduan untuk tim developer/AI assistant).*

### 1. Database & ORM Initialization (Drizzle + MySQL)
- Buat skema database yang mendukung entitas utama: Data Pensiunan (Leads), User (Supervisi & Sales), dan Log Kunjungan (Aktivitas).
- Konfigurasikan relasi antar skema (contoh: satu PIC Sales dapat memiliki banyak Leads, satu Lead bisa memiliki banyak Log Kunjungan).
- Setup konfigurasi koneksi antara Drizzle ORM dan database MySQL menggunakan konektor Bun.

### 2. Backend Service (Bun + ElysiaJS)
- Setup project ElysiaJS baru sebagai REST API gateway.
- Buat API Controller / Router untuk fitur **Distribusi Database**:
  - Endpoint list data pensiun dengan multi-parameter filter (Mitra, Dapen, Kantor, Status).
  - Endpoint transaksi untuk assignment/pengalihan lead ke PIC Sales (mendukung bulk-assign).
- Buat API Controller / Router untuk fitur **Aktifitas Kunjungan**:
  - Endpoint list data aktivitas dengan parameter pencarian (Filter by Sales, Periode).
  - Endpoint detail yang memuat riwayat kunjungan dan titik GPS (Geotagging).
  - Endpoint action khusus untuk *menghapus* data kunjungan, dan *mengambil file report*.
- Siapkan utility server untuk support file generator (export Excel dan PDF).

### 3. Frontend Web Application (SvelteKit)
- Inisialisasi SvelteKit dengan SSR dimatikan (`@sveltejs/adapter-static`) untuk mempermudah build ke mobile.
- **Module Supervisi (Distribusi Database):**
  - Kembangkan UI form pencarian/filter data pensiun (Dropdown Mitra, Kantor, Status, dll).
  - Kembangkan Datatable untuk list pencarian, lengkap dengan fungsionalitas memilh (checkbox) pensiunan dan tombol "Alihkan Data Lead" ke nama PIC Sales tujuan lalu submit.
- **Module Monitoring (Aktifitas Kunjungan):**
  - Kembangkan UI monitoring yang memiliki filter spesifik (nama sales, rentang waktu).
  - Buat komponen Modal / Halaman Detail untuk melihat profil pensiunan dan data visit (sertakan visual UI map untuk menampilkan koordinat GPS check-in).
  - Buat komponen Button Group untuk action bar:
    - *Export to Excel*
    - *Print List Kunjungan*
    - *Print Surat Penawaran*
    - *Print Data SFAS (ke format PDF)*
    - *Delete Data Activity*

### 4. Mobile Adaptation (Capacitor Android)
- Integrasikan Capacitor ke codebase Frontend SvelteKit.
- Daftarkan resource plugin native yang dibutuhkan yaitu plugin **Camera** (untuk fitur Photo Reports) dan plugin **Geolocation** (untuk mendapatkan GPS Check-in akurat).
- Pastikan build path sinkron dengan folder static SvelteKit dan test build untuk versi Android app.

### 5. Third-Party / Cross System Integration
- Rancang abstraksi service / handler untuk koneksi SFAS berkomunikasi API dengan LOS dan Corebanking System agar sinkronisasi dan proses SLA dapat berjalan secara asinkronus (menghindari bottleneck request).
