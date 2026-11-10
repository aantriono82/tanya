# Tanya Jawab Islam — tanya.aantriono.com

Situs tanya jawab Islam (model redaksi terkurasi) dibangun dengan **Hugo**, sesuai *Cetak Biru Tanya Jawab Islam* yang disetujui Mas Aan pada 10 November 2026 (berkas `../CETAK-BIRU-TANYA-JAWAB-ISLAM.md`).

## Status Fase 1

Rangka situs selesai: beranda (pencarian besar, kategori, terbaru, terpopuler), halaman kategori, arsip, halaman jawaban (template Jawaban Singkat → Penjelasan → Dalil → Kesimpulan Praktis → Catatan Rujukan), formulir Bertanya dan Laporkan Koreksi, halaman Tentang & Metodologi, Kebijakan Privasi, dan pencarian statis.

Dua tanya jawab di `content/tanya-jawab/` berstatus `draft: true` + `contoh: true` — **hanya contoh uji tampilan**, bukan konten rilis. Konten awal resmi (30 topik) disiapkan pada Fase 2 dalam 3 gelombang, draft-first untuk persetujuan Mas Aan.

## Yang masih dibutuhkan untuk mengaktifkan

1. **Repo GitHub** `aantriono82/tanya` (dibuat Mas Aan, kosong) — lalu isi folder ini didorong (push) ke sana.
2. **Proyek Cloudflare Pages** yang menghubungkan repo itu, dengan domain khusus `tanya.aantriono.com` (dari dasbor Cloudflare Mas Aan).
3. **Access key Web3Forms** untuk email tujuan Mas Aan — buat di web3forms.com dengan email tujuan (kunci dikirim ke email itu), lalu isi `web3formsKey` di `hugo.toml`. Selama kosong, formulir tampil dengan pemberitahuan "belum aktif" dan tombol kirim nonaktif.

## Menjalankan secara lokal

```bash
hugo server --buildDrafts   # pratinjau termasuk contoh draf
hugo --gc --minify           # build produksi (contoh draf tidak ikut)
```

Build produksi ditulis ke `public/` (itulah yang di-deploy Cloudflare Pages; preset Hugo, perintah build `hugo --gc --minify`, direktori keluaran `public`).

## Menambah tanya jawab baru

```bash
hugo new tanya-jawab/<slug-pertanyaan>
```

Isi mengikuti archetype: front matter (kategori dari 8 kategori di `data/kategori.yaml`, tag, nama samaran penanya, ringkasan 1–2 kalimat, `sensitif: true` untuk topik yang wajib menampilkan Catatan Rujukan) dan isi dengan heading tetap. Biarkan `draft: true` sampai Mas Aan menyetujui; terbitkan dengan mengubahnya menjadi `false` lalu push.
