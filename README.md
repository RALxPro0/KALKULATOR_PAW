<<<<<<< HEAD
# 🖨️ Kalkulator Struk Kasir (Casio HR-8RC Style) — jQuery

Aplikasi kalkulator web interaktif berbasis **jQuery 3.7.1** yang mengadaptasi desain kalkulator cetak fisik **Casio HR-8RC (Top-Feed Printing Calculator)** untuk tugas mata kuliah **Pemrograman Aplikasi Web (PAW)**.

---

## 👤 Identitas Mahasiswa

| Keterangan | Data |
| :--- | :--- |
| **Nama** | **Reza Abdul Latif** |
| **NIM** | **255150719111001** |
| **Mata Kuliah** | Pemrograman Aplikasi Web (PAW) |

---

## ✨ Fitur Utama

1. **Operasi Aritmatika Dasar (`+`, `-`, `*`, `/`)**
   - Mendukung penjumlahan (`+`), pengurangan (`−`), perkalian (`×`), dan pembagian (`÷`).
   - Mendukung perhitungan berantai (*chained operations*), angka desimal (`.`), tombol dua nol (`00`), ubah tanda positif/negatif (`±`), *Clear Entry* (`C`), *All Clear* (`AC`), dan *Backspace* (`⌫`).
   - Penanganan pembagian dengan nol (`Error`) disertai animasi getar (*shake*) pada layar LCD.

2. **Kertas Struk Keluar dari Atas (*Top-Feed Paper Roll*)**
   - Setiap perhitungan otomatis dicetak ke gulungan kertas di bagian atas kalkulator dengan animasi jQuery `.slideDown()`.
   - **Pita Tinta 2 Warna**: Angka positif dicetak hitam, sedangkan pengurangan (`−`) atau angka negatif otomatis dicetak dengan **tinta merah**.
   - **Reuse History**: Klik baris angka mana pun pada kertas struk untuk memuat kembali angkanya ke layar LCD.

3. **Tombol Kontrol Printer Khas Casio HR-8RC**
   - **`FEED`**: Mendorong kertas struk naik satu baris kosong.
   - **`REPRINT`**: Mencetak ulang blok perhitungan terakhir ke kertas struk.
   - **`✂ ROBEK`**: Merobek kertas struk lama dengan animasi terbang dan menggantinya dengan kertas baru.
   - **`🔊 SFX`**: Menyalakan/mematikan efek suara mekanik printer (*Web Audio API* murni tanpa file `.mp3`).
   - **`◐ GLASS / MATTE`**: Mengganti tema bodi antara **Hitam Matte Casio** dan **Glassmorphism Transparan**.

4. **Dukungan Penuh Keyboard**
   - Ketik langsung menggunakan tombol `0–9`, `.`, `+`, `-`, `*`, `/`, `Enter` (`=`), `Backspace` (`⌫`), `Delete` (`C`), dan `Escape` (`AC`).

---

## 📂 Struktur & Penjelasan File

```text
KALKULATOR_PAW/
├── index.html   # Struktur HTML (kertas struk, bodi kalkulator, layar LCD, tombol)
├── style.css    # Styling 3D Casio HR-8RC, tema Matte/Glass, dan animasi kertas
├── script.js    # Logika perhitungan matematika & manipulasi DOM berbasis jQuery
└── README.md    # Dokumentasi proyek
```

### 1. `index.html`
Menyusun kerangka tampilan kalkulator menjadi dua bagian utama di dalam `.scene`:
- **`.paper-assembly`**: Gulungan kertas struk di atas yang memuat kop identitas **Nama & NIM** serta daftar riwayat cetakan (`#receipt`).
- **`.calc-body`**: Bodi kalkulator yang memuat celah keluarnya kertas (`.printer-slot`), layar LCD hijau (`#display`), baris tombol kontrol printer (`.printer-keys`), dan matriks tombol 5 kolom khas Casio HR-8RC (`.keys`).
- Memuat library **jQuery 3.7.1** melalui CDN Cloudflare sebelum `script.js`.

### 2. `style.css`
Mengatur estetika visual dan animasi:
- **Tema Ganda (`:root` & `:root[data-theme="glass"]`)**: Mengatur warna bodi Hitam Matte bertekstur dan mode Glassmorphism transparan (`backdrop-filter: blur`).
- **Desain Kertas & Tinta Dua Warna**: Class `.entry.ink-red` memberi warna merah otomatis pada pengurangan/angka negatif, dan `.entry.is-total` memberi highlight pada hasil akhir (`TOT`).
- **Animasi CSS (`@keyframes`)**: `paperBump` (kertas terdorong naik), `tearOff` (kertas robek), `rip` (gelombang klik tombol), dan `shake` (getar saat error).

### 3. `script.js`
Mengatur seluruh logika interaktif menggunakan **jQuery**:
- **`$(function () { ... })`**: Menjalankan script setelah seluruh elemen DOM siap (*Document Ready*).
- **`render()`**: Memperbarui teks layar LCD (`#result`, `#expr`, `#stepCounter`) menggunakan `.text()` dan menandai operator aktif dengan `.addClass("active")`.
- **`printLine()`**: Membuat elemen `<div class="entry">` secara dinamis menggunakan jQuery `$('<div>')`, menyisipkannya ke `#receipt`, dan menganimasikannya keluar dengan `.slideDown(140)`.
- **`compute()`**: Menghitung operasi `+`, `-`, `*`, `/` secara presisi serta mendeteksi pembagian dengan nol.
- **Event Listener (`.on("click")`, `.on("keydown")`)**: Menangani klik tombol kalkulator, klik riwayat pada struk, kontrol printer, serta input dari keyboard.

---

## 🚀 Cara Menjalankan Proyek

1. Clone atau unduh repositori ini:
   ```bash
   git clone https://github.com/USERNAME_ANDA/NAMA_REPO_ANDA.git
   ```
2. Buka file **`index.html`** langsung di browser (Chrome, Edge, Firefox, atau Safari).
3. Pastikan perangkat terhubung ke internet saat pertama kali membuka agar CDN **jQuery 3.7.1** dapat dimuat.
=======
# KALKULATOR_PAW
>>>>>>> e0874dfdbce5e96f178f893c457084c453f2bf07
