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
    title:       `${post.title} — ekonomi.gussur.com`,
    description: post.meta_description || post.excerpt || '',
  };
}

export default async function ArticlePage({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <main className="container">
      {/* ── Topbar ── */}
      <header className="topbar">
        <div className="brand">
          <Link href="/">ekonomi</Link>
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
          {getSourceName(post) && <>{getSourceName(post)} &bull; </>}
          {formatDate(post.date)}
        </div>

        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.source_url && (
          <div className="meta" style={{ marginTop: '2rem' }}>
            <a href={post.source_url} target="_blank" rel="noopener noreferrer">
              Baca sumber asli →
            </a>
          </div>
        )}
      </article>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-copy">ekonomi.gussur.com &mdash; bagian dari gussur.com</div>
        <div className="footer-link">
          <Link href="/">&larr; Kembali ke beranda</Link>
        </div>
      </footer>
    </main>
  );
}
