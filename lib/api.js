// lib/api.js — GitHub Raw JSON fetcher
// Sumber data: portal-berita/data/berita.json (public repo)

const BERITA_URL =
  'https://raw.githubusercontent.com/gussur/portal-berita/main/data/berita.json';

// ─────────────────────────────────────────
// INTERNAL: ambil semua artikel dari JSON
// ─────────────────────────────────────────

async function fetchAllBerita() {
  const res = await fetch(BERITA_URL, {
    next: { revalidate: 300 }, // cache 5 menit, sama seperti sebelumnya
  });
  if (!res.ok) return [];
  return res.json();
}

// Buat slug dari title — misal "IHSG Melemah 1,2 Persen" → "ihsg-melemah-1-2-persen"
function makeSlug(article) {
  return (
    article.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 80) +
    '-' +
    article.id.slice(-5) // suffix dari id supaya unik
  );
}

// ─────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────

// Ambil daftar artikel dengan paginasi dan filter kategori
export async function getPosts({ perPage = 10, page = 1, categorySlug = '' } = {}) {
  const all = await fetchAllBerita();

  const filtered = categorySlug
    ? all.filter((a) => a.category?.toLowerCase() === categorySlug.toLowerCase())
    : all;

  const total = filtered.length;
  const start = (page - 1) * perPage;
  const posts = filtered.slice(start, start + perPage).map(normalize);

  return { posts, total };
}

// Ambil satu artikel by slug
export async function getPostBySlug(slug) {
  const all = await fetchAllBerita();
  const article = all.find((a) => makeSlug(a) === slug);
  return article ? normalize(article) : null;
}

// Ambil semua slug untuk static generation
export async function getAllSlugs() {
  const all = await fetchAllBerita();
  return all.map((a) => makeSlug(a));
}

// Format tanggal → "17 April 2026"
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Ambil nama sumber
export function getSourceName(post) {
  return post?.source_name || '';
}

// ─────────────────────────────────────────
// INTERNAL: normalisasi struktur artikel
// Supaya page.js dan [slug]/page.js tidak perlu diubah
// ─────────────────────────────────────────

function normalize(article) {
  return {
    ...article,
    slug:     makeSlug(article),
    excerpt:  article.meta_description || '',
    date:     article.scraped_at || article.pub_date,
    // Konten artikel dibungkus paragraf HTML kalau belum
    content:  article.content
      .split('\n\n')
      .filter((p) => p.trim())
      .map((p) => (p.startsWith('<') ? p : `<p>${p.trim()}</p>`))
      .join('\n'),
  };
}
