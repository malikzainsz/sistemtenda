# SewaPro - Sistem Informasi Manajemen Sewa Tenda, Dekorasi Plafon & Sound System

Aplikasi web modern dan terpadu untuk penyedia jasa rental perlengkapan acara, pernikahan, dan konser. Sistem ini mencakup **Portal Publik Pelanggan** untuk pemesanan & pelacakan status, serta **Portal Dashboard Admin** untuk operasional, kalender anti-bentrok jadwal, verifikasi bukti pembayaran, dan laporan bisnis.

---

## 🚀 Fitur Utama

### 1. Portal Pelanggan (Customer Facing)
- **Katalog Layanan Interaktif**: Pilihan sewa Tenda Kanopi/Roder, Dekorasi Plafon Draping VIP, Sound System Audio Konser, dan Paket Komplit Pernikahan.
- **Kalkulator Sewa & Formulir Cepat**: Perhitungan estimasi total sewa harian otomatis dengan diskon *bundling* 10% dan kalkulasi DP 50%.
- **Sistem Anti-Bentrok Jadwal**: Pengecekan ketersediaan armada unit secara *real-time* saat tanggal acara dipilih.
- **Pelacakan Status Pesanan & Upload Struk**: Pelanggan dapat memantau alur pesanan (`Menunggu` → `Dikonfirmasi` → `Berlangsung` → `Selesai`), mengunggah bukti transfer (m-Banking/QRIS), serta mencetak nota reservasi.
- **Galeri Acara & Lightbox**: Dokumentasi foto hasil pemasangan dengan filter kategori.
- **Evaluasi Pelanggan**: Sistem ulasan transparan dengan pemberian rating 1–5 bintang yang langsung memperbarui reputasi rata-rata layanan.

### 2. Portal Admin (Management Dashboard)
- **Dashboard Ringkasan KPI**: 4 metrik utama (Pesanan Bulan Ini, Total Omzet Kas, Acara Minggu Ini, Rata-rata Rating), tabel pesanan terbaru, dan bar ketersediaan unit armada.
- **Data Pelanggan**: Direktori kontak klien dengan tautan langsung ke WhatsApp dan riwayat total transaksi.
- **Katalog & Tarif**: Manajemen harga sewa harian, kapasitas armada unit, serta penambahan paket baru.
- **Manajemen Pemesanan**: Filter status sewa, pencarian nomor pesanan (`ORD-xxx`), serta cetak faktur invoice.
- **Jadwal & Ketersediaan**: Kalender visual per tanggal untuk memantau penggunaan unit dan mencegah *overbooking*.
- **Verifikasi Pembayaran Kas**: Peninjauan foto bukti transfer bank, persetujuan DP 1-klik, dan tanda pelunasan.
- **Kelola Galeri**: Tambah dan hapus foto portofolio dokumentasi acara.
- **Moderasi Evaluasi**: Tinjau dan kelola tayangan ulasan pelanggan.
- **Laporan Keuangan**: Rekapitulasi omzet per kategori layanan dan tombol cetak/ekspor PDF.
- **Peta Modul & Alur Sistem**: Diagram interaktif 8 modul utama dan simulasi alur operasional.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Animasi & Transisi**: Motion
- **State Management**: React Context API + LocalStorage Synchronization
- **Hosting / Deployment Target**: Vercel & GitHub

---

## 💻 Cara Menjalankan di Komputer Lokal

1. **Clone repository dari GitHub**:
   ```bash
   git clone https://github.com/USERNAME/sewapro-event-management.git
   cd sewapro-event-management
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan (Dev Server)**:
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:3000`.

4. **Build untuk produksi**:
   ```bash
   npm run build
   ```
   File hasil kompilasi siap saji akan berada di dalam folder `dist/`.

---

## 🌐 Panduan Publikasi ke Vercel

Aplikasi ini telah dilengkapi konfigurasi `vercel.json` bawaan untuk mendukung *Single Page Application (SPA) routing*.

### Langkah Mudah Publish di Vercel:

1. **Push kode proyek ke GitHub** (pastikan file `vercel.json`, `package.json`, dan folder `public/` terunggah).
2. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan klik **"Add New"** > **"Project"**.
3. Hubungkan akun GitHub Anda dan pilih repository **`sewapro-event-management`**.
4. Di bagian konfigurasi proyek:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Klik **"Deploy"**. Vercel akan otomatis melakukan proses build dan memberikan URL domain live (misal: `sewapro.vercel.app`).

---

## 🐙 Panduan Publikasi ke GitHub

1. **Inisialisasi Git (jika belum)**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit sistem manajemen sewapro"
   ```

2. **Hubungkan ke remote repository GitHub**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/USERNAME/sewapro-event-management.git
   git push -u origin main
   ```

---

## 📁 Struktur Direktori

```
├── public/                 # Static assets & foto layanan (Tenda, Plafon, Sound)
│   └── images/
├── src/
│   ├── assets/             # Raw assets
│   ├── components/
│   │   ├── admin/          # Komponen portal admin (Dashboard, Jadwal, Kas, dll)
│   │   ├── customer/       # Komponen portal publik (Katalog, Hero, Galeri, Review)
│   │   ├── Footer.tsx      # Footer lengkap dengan tautan aktif
│   │   ├── Navbar.tsx      # Navigasi responsif desktop & mobile
│   │   └── SystemWorkflowModal.tsx # Modal interaktif Peta Modul & Alur Sistem
│   ├── context/
│   │   └── AppContext.tsx  # Central state management & LocalStorage persistence
│   ├── data/
│   │   └── mockData.ts     # Data awal (Layanan, Pesanan, Galeri, Ulasan)
│   ├── types/
│   │   └── index.ts        # Definisi TypeScript interface
│   ├── utils/
│   │   └── formatters.ts   # Helper mata uang IDR & format tanggal Indonesia
│   ├── App.tsx             # Entry point utama aplikasi
│   ├── index.css           # Konfigurasi Tailwind CSS v4 & styling cetak
│   └── main.tsx            # React root DOM renderer
├── vercel.json             # Konfigurasi rewrite SPA Vercel
├── vite.config.ts          # Konfigurasi Vite & Tailwind plugin
└── package.json            # Daftar pustaka & script build
```

---

## 📄 Lisensi

Hak Cipta © 2026 SewaPro Event Management. Dilindungi oleh lisensi Apache-2.0.
