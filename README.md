# ekonomi.gussur.com

Frontend portal berita ekonomi & pasar modal Indonesia.
Mengambil konten dari WordPress gussur.com via REST API.

## Stack
- Next.js 14 (App Router)
- Deploy: Vercel
- Konten: WordPress REST API (`/wp-json/wp/v2/posts`)

## Deploy ke Vercel

1. Push repo ini ke GitHub (`gussur/ekonomi-web`)
2. Buka [vercel.com](https://vercel.com) → New Project → import repo ini
3. Tambah **Environment Variable** di Vercel:
   - `WP_URL` = `https://gussur.com` (tanpa trailing slash)
4. Deploy

## Subdomain

Di DNS registrar gussur.com, tambah record:
```
Type : CNAME
Name : ekonomi
Value: cname.vercel-dns.com
```

Lalu di Vercel → Project Settings → Domains → tambah `ekonomi.gussur.com`.

## Alur konten

```
GitHub Actions (scraper) → WordPress draft → Review manual → Publish
                                                                  ↓
                                          ekonomi.gussur.com (auto-fetch setiap 5 menit)
```

## Struktur file

```
app/
  layout.js        → root layout + metadata
  page.js          → homepage (hero + grid artikel)
  globals.css      → semua style
  [slug]/
    page.js        → halaman artikel individual
lib/
  api.js           → WordPress REST API helper
```
