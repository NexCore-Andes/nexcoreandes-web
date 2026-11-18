import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'], variable: '--font-inter', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  // Cambiá esta URL (o definí NEXT_PUBLIC_SITE_URL) cuando tengas el dominio definitivo
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nexcoreandes.com'),
  title: 'NexCore Andes · Tecnología que impulsa negocios',
  description:
    'Landing pages, webs empresariales, tiendas online, software a medida, automatizaciones, inteligencia artificial e integraciones para vender más y hacer crecer tu negocio.',
  openGraph: {
    title: 'NexCore Andes · Tecnología que impulsa negocios',
    description: 'Soluciones digitales para vender más: webs, tiendas online, software a medida, automatizaciones e IA.',
    images: ['/social/post-somos.webp'],
    locale: 'es_AR',
    type: 'website',
  },
};

export const viewport: Viewport = { themeColor: '#001134' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
