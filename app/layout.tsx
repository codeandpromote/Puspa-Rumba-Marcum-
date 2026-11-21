import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { SiteShell } from '@/components/SiteShell';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Puspa Rumba-Marcum | Hair Loss Specialist & Trichologist',
  description:
    'Certified trichology, clinical hair loss restoration, scalp therapy, and tailored hair artistry by Puspa Rumba-Marcum, WTS in Grand Cayman.',
  openGraph: {
    title: 'Puspa Rumba-Marcum | Hair Loss Specialist & Trichologist',
    description:
      'Certified trichology, clinical hair loss restoration, scalp therapy, and tailored hair artistry by Puspa Rumba-Marcum, WTS in Grand Cayman.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Puspa Rumba-Marcum | Hair Loss Specialist & Trichologist',
    description:
      'Certified trichology, clinical hair loss restoration, scalp therapy, and tailored hair artistry by Puspa Rumba-Marcum, WTS in Grand Cayman.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const mapsApiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.VITE_GOOGLE_MAPS_API_KEY ||
    process.env.MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_MAPS_API_KEY ||
    process.env.GOOGLE_MAPS_PLATFORM_API_KEY ||
    '';

  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body suppressHydrationWarning className="min-h-screen bg-[#FAFAFA] text-[#111816] font-sans">
        <SiteShell mapsApiKey={mapsApiKey}>{children}</SiteShell>
      </body>
    </html>
  );
}
