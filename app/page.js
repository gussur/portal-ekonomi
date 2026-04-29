import Link from 'next/link';
import { getPosts, formatDate, getSourceName } from '../lib/api';

export const revalidate = 300;

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').replace(/&hellip;/g, '…').trim();
}

export default async function HomePage() {
  const { posts } = await getPosts({ perPage: 10 });

  const hero    = posts[0] || null;
  const sidebar = posts.slice(1, 3);
  const grid    = posts.slice(3, 9);

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  });

  return (
    <main className="container">
      {/* ── Topbar ── */}
      <header className="topbar">
        <div className="brand">
          ekonomi
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

      {/* ── Dateline ── */}
      <div className="dateline">
        {today} &mdash; Ringkasan pasar modal &amp; ekonomi Indonesia
      </div>

      {/* ── Hero ── */}
      {hero && (
        <section className="hero">
          <div>
            <span className="tag">{hero.category || 'Utama'}</span>
            <Link href={`/${hero.slug}`}>
              <h1 className="hero-title">{hero.title}</h1>
            </Link>
            <p className="hero-excerpt">
              {stripHtml(hero.excerpt).substring(0, 200)}…
            </p>
            <div className="meta">
              {getSourceName(hero) && <>{getSourceName(hero)} &bull; </>}
              {formatDate(hero.date)}
            </div>
          </div>

          <div>
            <div className="sidebar">
              {sidebar.map((post) => (
                <div key={post.id} className="sidebar-item">
                  <span className="tag">{post.category || 'Berita'}</span>
                  <Link href={`/${post.slug}`}>
                    <div className="sidebar-title">{post.title}</div>
                  </Link>
                  <div className="meta">
                    {getSourceName(post) && <>{getSourceName(post)} &bull; </>}
                    {formatDate(post.date)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Grid berita terbaru ── */}
      {grid.length > 0 && (
        <>
          <div className="section-label">Berita terbaru</div>
          <div className="article-grid">
            {grid.map((post) => (
              <div key={post.id}>
                <span className="tag">{post.category || 'Berita'}</span>
                <Link href={`/${post.slug}`}>
                  <div className="card-title">{post.title}</div>
                </Link>
                <p className="card-excerpt">
                  {stripHtml(post.excerpt).substring(0, 120)}…
                </p>
                <div className="meta">{formatDate(post.date)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Empty state ── */}
      {posts.length === 0 && (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--color-hint)' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px' }}>
            Belum ada artikel yang dipublikasikan.
          </p>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-copy">ekonomi.gussur.com &mdash; bagian dari gussur.com</div>
        <div className="footer-link">Otomatis dari scraper &rarr; review manual &rarr; publish</div>
      </footer>
    </main>
  );
}
