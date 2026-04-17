// lib/api.js — WordPress REST API fetcher

const WP_URL = process.env.WP_URL || 'https://gussur.com';
const API_BASE = `${WP_URL}/wp-json/wp/v2`;

// Ambil daftar artikel (hanya status publish)
export async function getPosts({ perPage = 10, page = 1, categorySlug = '' } = {}) {
  let url = `${API_BASE}/posts?per_page=${perPage}&page=${page}&status=publish&_embed=1`;

  if (categorySlug) {
    const catId = await getCategoryId(categorySlug);
    if (catId) url += `&categories=${catId}`;
  }

  const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 menit
  if (!res.ok) return { posts: [], total: 0 };

  const posts = await res.json();
  const total = parseInt(res.headers.get('X-WP-Total') || '0');
  return { posts, total };
}

// Ambil satu artikel by slug
export async function getPostBySlug(slug) {
  const res = await fetch(`${API_BASE}/posts?slug=${slug}&status=publish&_embed=1`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const posts = await res.json();
  return posts[0] || null;
}

// Ambil semua slug untuk static generation
export async function getAllSlugs() {
  const res = await fetch(`${API_BASE}/posts?per_page=100&status=publish&fields=slug`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const posts = await res.json();
  return posts.map((p) => p.slug);
}

// Cari ID kategori by slug
async function getCategoryId(slug) {
  const res = await fetch(`${API_BASE}/categories?slug=${slug}`);
  if (!res.ok) return null;
  const cats = await res.json();
  return cats[0]?.id || null;
}

// Format tanggal → "17 April 2026"
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Ambil nama sumber dari meta (disimpan scraper di post excerpt atau meta)
export function getSourceName(post) {
  return post?.meta?._source_name || '';
}
