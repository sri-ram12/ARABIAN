import type { Metadata } from 'next';
import { Inter, Cinzel, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import FireIntroWrapper from '@/components/FireIntroWrapper';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Arabian Mandi | Authentic Arabian Food & Royal Mandi in Thagarapuvalasa',
  description:
    'Savor authentic Arabian Mandi, Faham Charcoal Chicken, Juicy Mutton Ribs, Shish Taouk, and artisanal Kunafa delivered piping hot across Thagarapuvalasa, Sangivalasa & Chittivalasa. Real-time GPS tracking & online payment.',
  keywords: [
    'Arabian Mandi Thagarapuvalasa',
    'Mandi near Thagarapuvalasa',
    'Arabian food Thagarapuvalasa',
    'Chicken Mandi Thagarapuvalasa',
    'Mutton Mandi Thagarapuvalasa',
    'Food delivery Thagarapuvalasa',
    'Sangivalasa Mandi delivery',
    'Bheemili Mandi delivery',
  ],
  authors: [{ name: 'S & H Arabian Mandi Restaurant' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'S & H Arabian Mandi | Authentic Royal Yemeni Gastronomy in Thagarapuvalasa',
    description:
      'Smoked fragrant basmati rice, underground charcoal dum roasted meats, signature garlic toum & royal kunafa delivered across Thagarapuvalasa.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Authentic Faham Chicken Mandi Platter',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'S & H Arabian Mandi',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'NH16 National Highway, Opposite Sangivalasa Bus Stop',
      addressLocality: 'Thagarapuvalasa',
      addressRegion: 'Andhra Pradesh',
      postalCode: '531162',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 17.9288,
      longitude: 83.435,
    },
    telephone: '+91 89192 34567',
    servesCuisine: ['Arabian', 'Middle Eastern', 'Mandi', 'Biryani', 'Tandoor'],
    priceRange: '₹₹',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '11:00',
        closes: '23:30',
      },
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable} ${playfair.variable} dark`}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans antialiased selection:bg-[#d4af37] selection:text-black">
        <FireIntroWrapper />
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow pb-16 md:pb-0">{children}</main>
            <Footer />
            <BottomNav />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
