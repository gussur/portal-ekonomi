import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllSlugs, formatDate, getSourceName } from '../../lib/api';

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title:       `${post.title} — Portal Ekonomi`,
    description: post.meta_description || post.excerpt || '',
  };
}

// Hapus baris "Sumber: X." dari akhir konten — ditampilkan terpisah di bawah
function stripSourceLine(html = '') {
  // Kalau "Sumber: X." jadi paragraf sendiri
  html = html.replace(/<p>Sumber:[^<]*<\/p>\s*$/i, '').trim();
  // Kalau "Sumber: X." jadi kalimat terakhir dalam paragraf
  html = html.replace(/\s*Sumber:[^<.]*\.\s*(<\/p>)$/i, '$1').trim();
  return html;
}

export default async function ArticlePage({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const sourceName = getSourceName(post);

  return (
    <main className="container">
      {/* ── Topbar ── */}
      <header className="topbar">
        <div className="brand">
          <a href="https://portal-ekonomi-bice.vercel.app/">ekonomi</a>
          <span className="brand-sub">gussur.com / ekonomi</span>
        </div>
        <nav>
          <ul className="nav">
            <li><Link href="/?cat=ihsg">IHSG</Link></li>
            <li><Link href="/?cat=emiten">Emiten</Link></li>
            <li><Link href="/?cat=makro">Makro</Link></li>
            <li><Link href="/?cat=komoditas">Komoditas</Link></li>
          </ul>
        </nav>
      </header>

      {/* ── Artikel ── */}
      <article className="article">
        {post.category && <span className="tag">{post.category}</span>}

        <h1 className="article-title">{post.title}</h1>

        <div className="meta">
          {sourceName && <>{sourceName} &bull; </>}
          {formatDate(post.date)}
        </div>

        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: stripSourceLine(post.content) }}
        />

        {/* ── Atribusi sumber ── */}
        {(sourceName || post.source_url) && (
          <div className="meta" style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
            Sumber:{' '}
            {post.source_url
              ? <a href={post.source_url} target="_blank" rel="noopener noreferrer">{sourceName || post.source_url}</a>
              : sourceName
            }
          </div>
        )}
      </article>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-copy">Ringkasan pasar modal Indonesia &mdash; Diperbarui setiap pagi pukul 05.00 WIB</div>
        <div className="footer-link">
          <Link href="/">&larr; Kembali ke beranda</Link>
        </div>
      </footer>
    </main>
  );
}
