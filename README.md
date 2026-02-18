# Endfield Web (Fanmade)

Website fanmade **Arknights: Endfield** berbasis static files + JSON.

## Fitur

- Multi-halaman:
- `/` Home
- `/characters/`
- `/tierlist/`
- `/builds/`
- `/helps/`
- `/character/?id=...`
- Search + filter + sort A-Z/Z-A
- Data-driven dari `data/content.json`
- Profil karakter detail (kisah ringkas, role/rarity/element/weapon, skill + icon + cara pakai)
- Gear list per karakter (nama gear, icon, stats, efek set, deskripsi)

## Struktur

```text
.
|- index.html
|- styles.css
|- script.js
|- characters/
|  |- index.html
|- tierlist/
|  |- index.html
|- builds/
|  |- index.html
|- helps/
|  |- index.html
|- character/
|  |- index.html
|- data/
|  |- content.json
|- assets/
|  |- icons/
|  |- images/
|  |- skill-icons/
```

## Cara Update Data Patch

Edit file:
- `data/content.json`

Field penting:
- `meta.updatedAt`
- `tips[]`
- `characters[].tier`
- `characters[].build`
- `characters[].profile`
- `characters[].profile.gearRecommendations`

## Deploy ke GitHub Pages

1. Buat repo (misal `endfield-web`)
2. Upload project ke branch `main`
3. Buka **Settings -> Pages**
4. Source: `Deploy from a branch`
5. Branch: `main` + `/root`
6. Simpan, tunggu deploy

URL repo project:
- `https://fahriadison.github.io/endfield-web/`

## Update ke GitHub via Command

Jalankan dari folder project:

```powershell
git add .
git commit -m "update endfield web"
git push origin main
```

Kalau baru pertama kali set remote:

```powershell
git remote add origin https://github.com/FahriAdison/endfield-web.git
git branch -M main
git push -u origin main
```

## Catatan

- Ini project fanmade, tidak berafiliasi dengan Hypergryph/GRYPHLINE.
- Data meta/build cepat berubah tiap patch, jadi update JSON secara berkala.
