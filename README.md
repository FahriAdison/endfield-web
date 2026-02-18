# Endfield Web (Fanmade)

Website sederhana untuk konten **Arknights: Endfield**:
- Perkenalan game
- Tips & trik pemula
- Meta character
- Tier list
- Build rekomendasi awal
- Search + filter (Tips, Tier List, Build)
- Data-driven dari JSON (mudah update patch)

## Nama Repo yang Direkomendasikan

Karena username GitHub kamu **FahriAdison**, ada 2 opsi:

1. `endfield-web` (disarankan untuk project ini)
- URL jadi: `https://fahriadison.github.io/endfield-web/`
- Cocok kalau ini salah satu dari beberapa project kamu.

2. `FahriAdison.github.io`
- URL jadi: `https://fahriadison.github.io/`
- Cocok kalau mau jadikan ini website utama akunmu.

Kalau targetmu sekarang cuma website Endfield, nama `endfield-web` itu sudah bagus.

## Struktur File

```text
.
|- index.html
|- styles.css
|- script.js
|- data/
|  |- content.json
|- assets/
|  |- images/
|     |- hero-share.jpg
|     |- banner-gilberta.jpg
|     |- event-spring.jpg
|     |- gallery-fanart.png
|     |- trailer-cg.jpg
|     |- talos-awakening.jpg
|  |- icons/
|     |- laevatain.webp
|     |- gilberta.webp
|     |- yvonne.webp
|     |- ardelia.webp
|     |- ...
```

## Cara Update Data Patch

Semua data utama ada di file:
- `data/content.json`

Yang biasa kamu update:
1. `meta.updatedAt` -> tanggal update data.
2. `tips` -> tambah/edit tips.
3. `characters` -> update tier, role, summary, build, dan `image`.

Contoh edit cepat:
- Ubah tier karakter: cari objek karakter lalu edit `"tier": "A"` jadi `"tier": "S"`.
- Ganti build: edit field `build.weapon`, `build.skills`, `build.team`, `build.notes`.

Tidak perlu edit `index.html` atau `script.js` kalau cuma update data patch.

## Cara Deploy ke GitHub Pages

1. Buat repo baru di GitHub, misal: `endfield-web`.
2. Upload semua file project ini ke branch `main`.
3. Buka **Settings** repo.
4. Masuk ke **Pages**.
5. Pada **Build and deployment**, pilih:
- Source: `Deploy from a branch`
- Branch: `main` / root
6. Save, tunggu proses deploy (biasanya 1-5 menit).
7. Akses URL:
- `https://fahriadison.github.io/endfield-web/` (kalau repo `endfield-web`)

## Catatan

- Ini website fanmade dan tidak berafiliasi dengan Hypergryph/GRYPHLINE.
- Data meta/tier/build cepat berubah sesuai patch baru.
