# Tanya Jawab Islam — tanya.aantriono.com

Situs tanya jawab Islam (model redaksi terkurasi) dibangun dengan **Hugo**, sesuai *Cetak Biru Tanya Jawab Islam* yang disetujui Mas Aan pada 10 November 2026.

Pertanyaan pembaca masuk lewat formulir, **tidak tampil ke publik**, lalu diseleksi, disunting, dianonimkan, dan dijawab sebelum diterbitkan.

## Status

- **Fase 1 — rangka situs:** selesai. Beranda (pencarian, kategori, terbaru, terpopuler), halaman kategori, arsip, halaman jawaban, formulir Bertanya dan Laporkan Koreksi, Tentang & Metodologi, Kebijakan Privasi, pencarian statis.
- **Fase 2 — arsip awal:** selesai. 30 tanya jawab susunan redaksi terbit dalam 3 gelombang.
- **Gelombang 4:** 10 tanya jawab berbasis Himpunan Putusan Tarjih (HPT) dan Fatwa Tarjih Muhammadiyah.
- **Formulir aktif:** access key Web3Forms sudah terpasang di `hugo.toml`.
- **Hosting:** Cloudflare Pages, terhubung ke repo ini, domain `tanya.aantriono.com`. Setiap push ke `main` memicu build otomatis.

## Teknologi

| Bagian | Keterangan |
|---|---|
| Generator | Hugo (extended), tanpa tema eksternal dan tanpa npm |
| Hosting | Cloudflare Pages — preset Hugo, perintah build `hugo --gc --minify`, direktori keluaran `public`, variabel lingkungan **`HUGO_VERSION=0.169.0`** (Production & Preview; wajib, versi bawaan Pages jauh lebih tua — samakan dengan versi Hugo lokal) |
| Formulir | [Web3Forms](https://web3forms.com) — kiriman diteruskan ke email pengelola |
| Pencarian | Statis: Hugo membuat `/index.json` (`layouts/index.json`), dicari di peramban oleh `assets/js/main.js`. Indeks diunduh sekali, ejaan diseragamkan (salat/sholat/shalat, wudu/wudhu, Ramadan/Ramadhan, dst. — daftar `EJAAN`), hasil diurutkan menurut kecocokan (judul > tag > ringkasan > kategori > isi) |
| Font | Disajikan dari `static/fonts/` (bukan Google Fonts): Plus Jakarta Sans (font variabel, subset latin & latin-ext) dan Amiri (subset Arab). Lisensi OFL ikut di folder yang sama. Bila berkas font diganti, **ganti juga namanya** karena di-cache setahun. |
| Header HTTP | `static/_headers`: CSP, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy, dan cache panjang untuk `/css/`, `/js/`, `/fonts/`. Bila menambah layanan pihak ketiga (analitik, captcha, embed), domainnya harus ditambahkan ke CSP. `script-src` mengizinkan `'unsafe-inline'` hanya agar skrip deteksi bot yang disisipkan Cloudflare tetap jalan; situs sendiri tidak memakai script maupun style inline. |
| SEO | Meta description dari `ringkasan`, canonical, Open Graph + Twitter Card dengan gambar `static/og-bawaan.png`, schema.org `Article` + `BreadcrumbList` (halaman jawaban) dan `WebSite` + `SearchAction` (beranda), RSS, `robots.txt` (menunjuk ke sitemap), halaman 404 (`noindex`) |

## Struktur

```
hugo.toml                   konfigurasi situs, menu, parameter, aturan "Tanya Terkait"
data/kategori.yaml          8 kategori (nama, slug, deskripsi)
archetypes/tanya-jawab.md   cetakan jawaban baru
content/tanya-jawab/        tanya jawab, satu folder per pertanyaan (<slug>/index.md)
content/kategori/           halaman pengantar tiap kategori
content/*.md                bertanya, koreksi, cari, tentang, privasi
layouts/                    template Hugo
assets/css/main.css         gaya tampilan
assets/js/main.js           salin tautan, formulir, tombol "membantu", pencarian
static/                     favicon
```

## Parameter penting (`hugo.toml` → `[params]`)

| Parameter | Fungsi |
|---|---|
| `web3formsKey` | Access key Web3Forms (kunci publik, aman tampil di HTML; dipasang sebagai `<body data-kunci-form>`). Bila kosong, formulir menampilkan "belum aktif". |
| `tombolMembantu` | `true` untuk menampilkan tombol "Jawaban ini membantu". Bawaan `false`, karena setiap klik mengirim satu email dan memakai kuota Web3Forms yang sama dengan formulir Bertanya/Koreksi. |
| `pengelola` | Nama yang tampil sebagai penjawab. |
| `blogUtama` | Tautan ke blog utama aantriono.com. |

## Menjalankan secara lokal

```bash
hugo server --buildDrafts   # pratinjau, termasuk draf
hugo --gc --minify          # build produksi ke public/ (draf tidak ikut)
```

## Menambah tanya jawab baru

```bash
hugo new tanya-jawab/<slug-pertanyaan>
```

Front matter:

| Kolom | Isi |
|---|---|
| `kategori` | Satu slug dari `data/kategori.yaml`, mis. `["ibadah"]` |
| `tags` | Kata kunci untuk "Tanya Terkait" dan pencarian. Tidak dibuatkan halaman `/tags/…` sendiri. |
| `penanya` | Nama samaran penanya (bukan nama asli) |
| `lastmod` | Opsional. Isi tanggal revisi (mis. `2026-12-01`) bila jawaban diperbaiki sesudah terbit; halaman lalu menampilkan "Diperbarui …" dan `dateModified` ikut berubah. |
| `ringkasan` | 1–2 kalimat; tampil di kartu, meta description, dan data terstruktur |
| `sensitif` | `true` untuk menampilkan kotak Catatan Rujukan (anjuran konsultasi langsung) |
| `populer` | `true` untuk masuk bagian "Paling Sering Dibaca" di beranda |
| `contoh` | `true` hanya untuk halaman uji tampilan (menampilkan banner peringatan) |
| `draft` | Biarkan `true` sampai disetujui; ubah ke `false` lalu push untuk terbit |

Isi mengikuti heading tetap: **Jawaban Singkat → Penjelasan → Dalil → Kesimpulan Praktis**. Teks Arab ditulis dalam `<blockquote dir="rtl" lang="ar">…</blockquote>`, diikuti terjemahan dan sumber (QS./HR. beserta nomornya). Kutipan yang sumbernya belum terverifikasi tidak diterbitkan.

## "Tanya Terkait"

Di kaki setiap jawaban tampil 3 tanya jawab terkait. Hugo memilihnya berdasarkan kemiripan `tags` (bobot 100) dan `kategori` (bobot 60); lihat `[related]` di `hugo.toml`. Bila yang mirip kurang dari tiga, sisanya diisi jawaban terbaru dari kategori yang sama.
