# Medisafe Bin — UI Prototype Web

Prototype web untuk layar TFT 240×320 (2.8", portrait, non-touch) pada sistem **Medisafe Bin**.

## File

| File | Keterangan |
|------|-----------|
| `index.html` | Demo interaktif — flow berjalan per langkah |
| `mockup.html` | Storyboard statis — 10 layar untuk screenshot esai |
| `app.js` | Logic: flow, failsafe, LED capacity, dual RFID |
| `style.css` | Dark-mode embedded UI, responsive |

## Cara pakai

1. Buka `index.html` di browser untuk demo interaktif
2. Buka `mockup.html` untuk screenshot semua state sekaligus

## 10 Layar (Views)

1. **Autentikasi RFID** — scan kartu, pilih level akses
2. **Buka Penutup** — servo membuka lubang pembuangan
3. **Masukkan Limbah** — instruksi masukkan limbah
4. **Menutup Penutup** — servo menutup lubang
5. **Pilih Kategori** — 2 tombol: Benda Tajam (A) / Infeksius (B)
6. **Konfirmasi** — verifikasi pilihan sebelum routing
7. **Mengarahkan** — servo motor mengarahkan ke kompartemen
8. **Sterilisasi** — solenoid valve menyemprotkan disinfektan
9. **Selesai** — lanjut buang atau logout
10. **Pengambilan Limbah** — panel khusus petugas kebersihan (Level 2)
