import './globals.css';

export const metadata = {
  title: 'ekonomi.gussur.com — Pasar Modal & Ekonomi Indonesia',
  description: 'Ringkasan harian berita ekonomi dan pasar modal Indonesia dari gussur.com',
  openGraph: {
    title: 'ekonomi.gussur.com',
    description: 'Ringkasan harian berita ekonomi dan pasar modal Indonesia',
    url: 'https://ekonomi.gussur.com',
    siteName: 'ekonomi.gussur.com',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
