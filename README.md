# 🧺 LaundryMagic - AI Background Remover

**LaundryMagic** adalah aplikasi web modern berbasis AI yang dirancang untuk menghapus latar belakang gambar secara instan, gratis, dan aman. Mengusung konsep unik "Mesin Cuci Digital", aplikasi ini memproses gambar sepenuhnya di sisi klien (browser) tanpa mengunggah data ke server eksternal, menjamin privasi pengguna 100%.

![LaundryMagic Preview](/public/images/screencapture-192-168-18-32-3000-2025-12-03-16_14_40.png)

---

## 🚀 Fitur Unggulan

### 1. 🤖 AI Canggih & Privasi Terjamin

- Menggunakan model AI `@imgly/background-removal` yang berjalan langsung di browser (Edge Computing).
- **Zero Server Upload:** Gambar Anda tidak pernah meninggalkan perangkat Anda. Aman untuk dokumen sensitif.

### 2. 🎨 Magic Backgrounds & Editor

- **Ganti Background:** Ubah latar belakang transparan menjadi warna solid (Putih, Hitam, dll), gradasi, atau warna kustom pilihan Anda.
- **Color Picker:** Dukungan pemilihan warna bebas (Hex/RGB) untuk kebutuhan desain spesifik.
- **Smart Output:** Otomatis menyesuaikan format (JPG = Background Putih, PNG = Transparan).

### 3. 📦 Batch Processing & ZIP Download

- **Multi-Upload:** Proses hingga 20 gambar sekaligus dalam satu antrian.
- **Download ZIP:** Unduh semua hasil pemrosesan dalam satu file ZIP praktis.
- **Format Fleksibel:** Dukungan output PNG, JPG, dan WebP.

### 4. 💾 Persistensi Data (Auto-Save)

- **Anti-Hilang:** Menggunakan teknologi **IndexedDB** untuk menyimpan gambar secara otomatis.
- Jika browser tertutup atau di-refresh, gambar Anda tetap aman dan bisa dilanjutkan kapan saja.

### 5. 📱 PWA (Progressive Web App)

- **Installable:** Dapat diinstal di Android, iOS, dan Desktop layaknya aplikasi native.
- **Offline Capable:** Dapat berjalan dengan koneksi internet minim setelah aset ter-cache.
- **Responsive Design:** Tampilan antarmuka yang adaptif untuk HP, Tablet, dan Laptop.

---

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun dengan stack teknologi modern untuk performa tinggi dan pengalaman pengembang yang baik:

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/) (Animasi)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **AI Engine:** [@imgly/background-removal](https://github.com/imgly/background-removal-js)
- **Database:** IndexedDB (via `idb` library)
- **PWA:** `@ducanh2911/next-pwa`

---

## 📂 Struktur Proyek

```bash
src/
├── app/                 # Halaman & Layout Utama (Next.js App Router)
├── components/          # Komponen UI Modular
│   ├── washing-machine/ # Komponen Spesifik Tema (Mesin Cuci, List Hasil)
│   ├── ui/              # Komponen Dasar (Button, Dialog, dll)
│   └── ...
├── hooks/               # Custom Hooks (Logika Pemrosesan Gambar)
├── lib/                 # Utilitas (Database, Sound Manager, Image Optimizer)
└── ...
```

---

## 🏃‍♂️ Cara Menjalankan (Local Development)

Ikuti langkah ini untuk menjalankan proyek di komputer Anda:

1.  **Clone Repository:**

    ```bash
    git clone https://github.com/username/laundry-magic.git
    cd laundry-magic
    ```

2.  **Install Dependensi:**

    ```bash
    npm install
    ```

3.  **Jalankan Server Development:**

    ```bash
    npm run dev
    ```

4.  **Buka Aplikasi:**
    Buka browser dan akses `http://localhost:3000`.

---

## 📝 Catatan Pengembang

- **Optimasi Gambar:** Sistem otomatis mengubah format gambar non-standar (HEIC/AVIF) dan melakukan resize cerdas untuk menjaga performa memori browser.
- **Error Handling:** Dilengkapi dengan sistem deteksi error jaringan dan memori yang memberikan solusi solutif kepada pengguna.

---

Dibuat dengan ❤️ untuk Tugas Pemrograman Web Lanjut.
