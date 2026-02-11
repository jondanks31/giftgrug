import type { Metadata } from 'next';
import { DM_Sans, Caveat, Comic_Neue } from 'next/font/google';
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

const comicNeue = Comic_Neue({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-grug-speech',
});

export const metadata: Metadata = {
  title: 'Grug - Modern Life Too Complicated. Grug Help Make Simple.',
  description: 'Modern life too complicated. Grug help make simple. Advice, cool things, and wisdom from a simple caveman. Talk to Grug, read scribbles, join the tribe.',
  keywords: [
    'grug',
    'justgrug',
    'lifestyle advice',
    'product recommendations',
    'gift ideas',
    'mens lifestyle',
    'ai chatbot',
    'funny advice',
    'simple living',
    'caveman wisdom',
  ],
  authors: [{ name: 'Grug' }],
  creator: 'Grug',
  publisher: 'Grug',
  metadataBase: new URL('https://giftgrug.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://giftgrug.com',
    siteName: 'Grug',
    title: 'Grug - Modern Life Too Complicated. Grug Help Make Simple.',
    description: 'Modern life too complicated. Grug help make simple. Advice, cool things, and wisdom from a simple caveman.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Grug - Modern Life Too Complicated. Grug Help Make Simple.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grug - Modern Life Too Complicated. Grug Help Make Simple.',
    description: 'Modern life too complicated. Grug help make simple. Advice, cool things, and wisdom.',
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
    <html lang="en" className={`${dmSans.variable} ${caveat.variable} ${comicNeue.variable}`}>
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3395679465044318"
          crossOrigin="anonymous"
        />
        
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
              name: 'Grug',
              url: 'https://giftgrug.com',
              description: 'Modern life too complicated. Grug help make simple.',
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
          <div className="relative min-h-screen vignette">
            {/* Grain overlay - subtle noise texture */}
            <div 
              className="fixed inset-0 opacity-[0.06] pointer-events-none z-50"
              style={{
                backgroundImage: 'url("/grain.png")',
                backgroundRepeat: 'repeat',
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
