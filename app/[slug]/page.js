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
    title: post.meta?.rank_math_focus_keyword
      ? `${post.title.rendered} — ekonomi.gussur.com`
      : post.title.rendered,
    description: post.meta?.rank_math_description || post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
  };
}
 
function getCategory(post) {
  const terms = post?._embedded?.['wp:term']?.[0];
  return terms?.[0]?.name || '';
}
 
export default async function ArticlePage({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();
 
  const category = getCategory(post);
  const sourceName = getSourceName(post);
 
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
        {category && <span className="tag">{category}</span>}
 
        <h1
          className="article-title"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
 
        <div className="meta">
          {sourceName && <>{sourceName} &bull; </>}
          {formatDate(post.date)}
        </div>
 
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
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
