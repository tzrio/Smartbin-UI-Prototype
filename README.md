# Layar Klasifikasi — UI Prototype (240×320)

Prototype ini dibuat **dengan ngoding** (HTML/CSS/JS) supaya kamu bisa cepat dapet desain layar 240×320 untuk dimasukkan ke esai.

Dokumentasi lebih detail ada di: [ui-prototype-web/README.md](ui-prototype-web/README.md)

## Cara menjalankan

Opsi paling simpel:
- Buka file [ui-prototype-web/index.html](ui-prototype-web/index.html) langsung di browser.

Untuk kebutuhan esai (screenshot cepat per layar):
- Buka storyboard mockup statis: [ui-prototype-web/mockup.html](ui-prototype-web/mockup.html)

Untuk demo interaktif (flow berjalan per langkah):
- Buka: [ui-prototype-web/index.html](ui-prototype-web/index.html)

Kalau mau “serasa device” tapi tanpa `npx`/npm:
- (PowerShell) Buka langsung via command:
  - `Start-Process .\ui-prototype-web\index.html`
- (Kalau ada Python) Jalankan server lokal:
  - `python -m http.server 8000`
  - lalu buka `http://localhost:8000/ui-prototype-web/`

Opsi lebih rapi (kalau kamu punya Node.js):
- Jalankan server statis dari folder `Layar_Klasifikasi`:
  - `npx serve`
  - lalu buka URL yang ditampilkan.

## Jika `npx serve` error `CERT_NOT_YET_VALID`

Itu biasanya karena masalah waktu/sertifikat TLS di Windows (jam belum sinkron, Windows Time service mati, atau ada proxy/SSL inspection).

Yang bisa kamu coba (urut dari yang paling aman):
- Pastikan Date/Time & Time Zone Windows benar, lalu klik **Sync now**.
- Pastikan Windows Time service jalan (PowerShell, kadang perlu Run as Administrator):
  - `Set-Service w32time -StartupType Automatic`
  - `Start-Service w32time`
  - `w32tm /resync`

Kalau ini workspace offline / jaringan kampus/kantor ribet, kamu tidak perlu `npx` sama sekali karena prototype ini tidak butuh API—cukup buka HTML-nya langsung.

## Yang diprototype

- Resolusi layar: **240×320 px** (portrait)
- 3 kategori: **Sharps**, **Infeksius**, **Noninfeksius**
- Flow sederhana: pilih kategori → konfirmasi → sukses

## Struktur folder

- `ui-prototype-web/`
  - `index.html` (interaktif)
  - `mockup.html` (storyboard statis)
  - `app.js` (flow + failsafe + progress bar)
  - `style.css` (tampilan embedded)

## Catatan untuk implementasi ESP

Untuk firmware TFT touch, jalur yang paling nyambung biasanya:
- **LVGL (C/C++)** + driver (mis. ILI9341/ST7789) + touch (XPT2046/FT6236)
- UI ini bisa kamu jadikan referensi layout & state saat kamu porting ke LVGL.

## Catatan (untuk upload ke GitHub)

Kalau kamu mau upload:
- Pastikan file sensitif tidak ikut (mis. `.env`, credential, dsb). Project prototype ini seharusnya aman karena hanya HTML/CSS/JS statis.
- Setelah repo dibuat, kamu tinggal `git init`, `git add .`, `git commit`, lalu `git push`.
