# Medisafe Bin — UI Prototype (280×380, ~3.2" TFT)

Prototype ini dibuat **dengan ngoding** (HTML/CSS/JS) untuk simulasi tampilan layar TFT 280×380 pada sistem **Medisafe Bin** — sistem pemilahan limbah medis padat semi-otomatis untuk puskesmas.

Dokumentasi lebih detail ada di: [ui-prototype-web/README.md](Layar_Klasifikasi/ui-prototype-web/README.md)

## Cara menjalankan

Opsi paling simpel:
- Buka file [index.html](Layar_Klasifikasi/ui-prototype-web/index.html) langsung di browser.

Untuk kebutuhan esai (screenshot semua layar sekaligus):
- Buka storyboard mockup statis: [mockup.html](Layar_Klasifikasi/ui-prototype-web/mockup.html)

Untuk demo interaktif (flow berjalan per langkah):
- Buka: [index.html](Layar_Klasifikasi/ui-prototype-web/index.html)

## Yang diprototype

- Resolusi layar: **280×380 px** (portrait, ~3.2" TFT)
- **Non-touch** — interaksi via tombol fisik (disimulasikan dengan klik)
- 2 kategori limbah: **Benda Tajam** (safety box) dan **Infeksius** (kantong biohazard)
- Dual RFID access: **Level 1** (Tenaga Medis) dan **Level 2** (Petugas Kebersihan)
- Fail-safe: timeout → otomatis ke **Benda Tajam** (safety box rigid)
- Disinfeksi otomatis setelah pembuangan
- LED indikator kapasitas (hijau/kuning/merah) per kompartemen

## Flow

**Level 1 (Tenaga Medis):**
RFID → Buka Penutup → Masukkan Limbah → Tutup Penutup → Pilih Kategori → Konfirmasi → Routing Motor → Sterilisasi → Selesai/Lanjut

**Level 2 (Petugas Kebersihan):**
RFID → Panel Pengambilan (status + ambil kompartemen) → Selesai

## Struktur folder

- `Layar_Klasifikasi/ui-prototype-web/`
  - `index.html` — demo interaktif (flow per langkah)
  - `mockup.html` — storyboard statis (10 layar, untuk screenshot esai)
  - `app.js` — logic: flow, failsafe, capacity, dual RFID
  - `style.css` — dark-mode embedded UI

## Catatan untuk implementasi ESP32

- Layar: TFT ~3.2" ILI9341/ST7789 (280×380, non-touch)
- Input: 2 tombol fisik besar (A/B) + RFID reader
- UI firmware: **LVGL (C/C++)** + driver TFT
- Prototype ini bisa dijadikan referensi layout & state saat porting ke LVGL

## Catatan upload GitHub

- Pastikan file sensitif tidak ikut (`.env`, credential, dsb)
- Project ini hanya HTML/CSS/JS statis, aman untuk di-push
