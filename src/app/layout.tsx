import type { Metadata } from 'next';
import { DM_Sans, Caveat } from 'next/font/google';
import { AuthProvider } from '@/components/auth';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-scribble',
});

export const metadata: Metadata = {
  title: 'GiftGrug - Gift Ideas for Men Who Need Help',
  description: 'Struggling to find the perfect gift for her? GiftGrug helps clueless men find amazing gifts for wives, girlfriends, mums & more. Simple, funny, actually useful.',
  keywords: [
    'gifts for wife',
    'gifts for girlfriend', 
    'gift ideas for her',
    'presents for women',
    'gift finder',
    'mens gift guide',
    'anniversary gifts',
    'birthday gifts for her',
    'christmas gifts for wife',
    'valentines gifts',
  ],
  authors: [{ name: 'GiftGrug' }],
  creator: 'GiftGrug',
  publisher: 'GiftGrug',
  metadataBase: new URL('https://giftgrug.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://giftgrug.com',
    siteName: 'GiftGrug',
    title: 'GiftGrug - Gift Ideas for Men Who Need Help',
    description: 'Struggling to find the perfect gift for her? GiftGrug helps clueless men find amazing gifts. Simple, funny, actually useful.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GiftGrug - Grug Help Man Find Gift',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GiftGrug - Gift Ideas for Men Who Need Help',
    description: 'Struggling to find the perfect gift for her? GiftGrug helps clueless men find amazing gifts.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${caveat.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Titan+One&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'GiftGrug',
              url: 'https://giftgrug.com',
              description: 'Gift finder for men who need help finding presents for women',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://giftgrug.com/hunt?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="bg-cave-dark text-bone font-body min-h-screen">
        <AuthProvider>
          <div className="relative min-h-screen">
            {/* Grain overlay - subtle noise texture */}
            <div 
              className="fixed inset-0 opacity-[0.03] pointer-events-none z-50"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
            
            {/* Main content */}
            <main className="relative z-10">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
