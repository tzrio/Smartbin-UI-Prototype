# UI Prototype Web (Safety Bin / SmartBin)

Folder ini berisi prototype UI berbasis web (HTML/CSS/JS) untuk mensimulasikan layar kecil **240×320** (portrait) seperti modul TFT pada perangkat SmartBin.

## Cara menjalankan

Tanpa install apa pun:
- Buka [index.html](index.html) langsung di browser.

Mode storyboard (untuk screenshot per layar):
- Buka [mockup.html](mockup.html) — semua layar ditampilkan sekaligus (tanpa JavaScript).

Opsional (kalau mau URL `http://localhost`):
- Dari folder `Layar_Klasifikasi`, jalankan server statis apa saja.
  - Python: `python -m http.server 8000`
  - Lalu buka: `http://localhost:8000/ui-prototype-web/`

## Struktur file

- [index.html](index.html)
  - Versi interaktif: hanya 1 layar aktif sekaligus (di-toggle dengan class `view--active`).
  - Elemen penting punya `id` untuk di-update JS (mis. `rfidStatus`, `idleCountdown`).
- [app.js](app.js)
  - Logika flow (state machine sederhana) + animasi progress bar (mock).
  - Failsafe: kalau user tidak memilih kategori dalam 60 detik, auto pilih **infeksius**.
- [style.css](style.css)
  - Styling “embedded-like”: font besar, kontras jelas, layout tidak gampang overflow.
- [mockup.html](mockup.html)
  - Storyboard statis: semua layar tampil untuk kebutuhan dokumentasi/esai.

## Alur layar (flow)

1. RFID (simulasi) →
2. Buka penutup (progress) →
3. Masukkan sampah →
4. Menutup penutup (progress) →
5. Pilih klasifikasi (failsafe countdown) →
6. Konfirmasi →
7. Routing (progress) →
8. Pilih aksi (lanjut / selesai)

## Catatan implementasi firmware (opsional)

Prototype ini tidak terhubung ke sensor/motor. Saat dipindahkan ke firmware:
- `showView(...)` di JS setara dengan “ganti screen/state” di LVGL/firmware.
- Progress bar setara dengan animasi/indikator proses motor.
- Failsafe timer bisa jadi watchdog untuk mencegah device “menggantung” di layar klasifikasi.
