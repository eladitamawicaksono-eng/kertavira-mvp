# Kertavira MVP

Web app pencatatan kas harian untuk usaha mikro — login sederhana, satu layar dashboard,
input pemasukan/pengeluaran dengan kategori, grafik arus kas 7 hari, breakdown pengeluaran
per kategori, dan ekspor rekap ke CSV.

Kategori default (Penjualan, Modal, Stok Barang, Operasional, Gaji, dll) otomatis dibuat
saat pertama kali user login — tidak perlu setup manual. User juga bisa tambah kategori
sendiri langsung dari form input.

## Stack
- **Next.js** (App Router) — tampilan web, hosting gratis di Vercel
- **Supabase** — database Postgres + autentikasi, gratis untuk skala MVP

## Cara menjalankan

1. Buat project baru di [supabase.com](https://supabase.com) (gratis).
2. Buka **SQL Editor** di dashboard Supabase, tempel isi `supabase/schema.sql`, lalu jalankan (Run).
   Ini otomatis membuat 3 tabel (`merchants`, `categories`, `transactions`) beserta aturan keamanan
   (Row Level Security) supaya tiap merchant hanya bisa melihat datanya sendiri.
3. Di dashboard Supabase, buka **Settings > API**, salin `Project URL` dan `anon public key`.
4. Salin file `.env.local.example` menjadi `.env.local`, lalu isi dua nilai tadi.
5. Install dependency dan jalankan secara lokal:
   ```bash
   npm install
   npm run dev
   ```
6. Buka `http://localhost:3000` — akan diarahkan ke halaman login.
7. Masukkan email, klik "Kirim link login". Supabase akan mengirim magic link ke email
   tersebut (di awal, cek folder Spam). Klik link itu untuk masuk ke dashboard.

## Deploy ke Vercel

1. Push folder ini ke repository GitHub.
2. Buka [vercel.com](https://vercel.com), import repo tersebut.
3. Saat proses import, masukkan dua environment variable yang sama seperti di `.env.local`
   (`NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Deploy — Vercel akan memberi link gratis (`namakamu.vercel.app`), yang nanti bisa
   dihubungkan ke domain `.my.id` yang kamu beli.

## Struktur folder
```
app/
  login/page.js       -> halaman login (magic link email)
  dashboard/page.js   -> dashboard utama, satu layar
  layout.js           -> layout & metadata PWA
components/
  TransactionForm.jsx -> form input pemasukan/pengeluaran
  TransactionList.jsx -> daftar transaksi terbaru
  SummaryCard.jsx      -> ringkasan pemasukan/pengeluaran/saldo
lib/
  supabaseClient.js    -> koneksi ke Supabase
  exportCsv.js          -> logika ekspor rekap ke CSV
supabase/
  schema.sql            -> skema database + keamanan (RLS)
```
