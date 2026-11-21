'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Instagram, Linkedin, MapPin, ArrowUpRight } from 'lucide-react';
import { MotionConfig, motion, AnimatePresence } from 'motion/react';
import { BRAND_INFO } from '@/lib/studio-data';

const MapsConfigContext = createContext<{ mapsApiKey: string }>({ mapsApiKey: '' });

export function useMapsConfig() {
  return useContext(MapsConfigContext);
}

// Tier 1 Google Maps Platform quota defense installed once at client module root
let quotaHooksInstalled = false;
function installMapsQuotaDefense() {
  if (typeof window === 'undefined' || quotaHooksInstalled) return;
  quotaHooksInstalled = true;

  (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = () => {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  };

  const origError = console.error;
  console.error = (...args: unknown[]) => {
    origError.apply(console, args);
    const msg = args.map((a) => String(a)).join(' ');
    if (msg.includes('OverQuotaMapError') || msg.includes('QuotaExceededError')) {
      window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
    }
  };
}

const NAV_ITEMS = [
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export function SiteShell({
  mapsApiKey,
  children,
}: {
  mapsApiKey: string;
  children: React.ReactNode;
}) {
  const effectiveMapsApiKey =
    mapsApiKey ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    (typeof globalThis !== 'undefined'
      ? (globalThis as unknown as { GOOGLE_MAPS_API_KEY?: string }).GOOGLE_MAPS_API_KEY || ''
      : '');
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [openForPath, setOpenForPath] = useState<string | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const mobileMenuOpen = openForPath === pathname;

  useEffect(() => {
    installMapsQuotaDefense();

    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenForPath(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const transparentHeader = isHome && !scrolled && !mobileMenuOpen;

  return (
    <MapsConfigContext.Provider value={{ mapsApiKey: effectiveMapsApiKey }}>
      <MotionConfig reducedMotion="user">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-[#1B4D3E] focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>

        {quotaExceeded && (
          <div
            role="status"
            className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm"
          >
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        <header
          className={`fixed left-0 right-0 z-40 transition-colors duration-200 ${
            quotaExceeded ? 'top-10' : 'top-0'
          } ${
            transparentHeader
              ? 'bg-transparent text-white border-b border-transparent'
              : 'bg-white/95 backdrop-blur-md text-[#111816] border-b border-[#E2E6E4]'
          }`}
        >
          <div className="max-w-[1320px] mx-auto px-6 md:px-10 h-[68px] flex items-center justify-between gap-8">
            {/* Zone 1: Single-line Brand Wordmark */}
            <Link
              href="/"
              className={`font-serif text-2xl md:text-[1.65rem] font-medium tracking-[-0.02em] whitespace-nowrap shrink-0 transition-colors duration-200 ${
                transparentHeader ? 'text-white' : 'text-[#111816]'
              }`}
            >
              {BRAND_INFO.name}
            </Link>

            {/* Zone 2: 4 concise single-line navigation links */}
            <nav
              aria-label="Primary navigation"
              className="hidden md:flex items-center gap-8 text-sm font-medium"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-200 ${
                      transparentHeader
                        ? isActive
                          ? 'text-white'
                          : 'text-white/85 hover:text-white'
                        : isActive
                          ? 'text-[#1B4D3E]'
                          : 'text-[#4A5552] hover:text-[#111816]'
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 right-0 -bottom-0.5 h-[1.5px] transition-opacity duration-200 ${
                        transparentHeader ? 'bg-white' : 'bg-[#1B4D3E]'
                      } ${isActive ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Zone 3: Single Primary Action + Mobile Drawer Toggle */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/contact#booking"
                className={`hidden md:inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-200 ${
                  transparentHeader
                    ? 'bg-white text-[#111816] hover:bg-[#F1F3F2]'
                    : 'bg-[#1B4D3E] text-white hover:bg-[#143B2F]'
                }`}
              >
                Book Consultation
              </Link>

              <button
                type="button"
                onClick={() =>
                  setOpenForPath((prev) => (prev === pathname ? null : pathname))
                }
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-drawer"
                className={`md:hidden inline-flex items-center justify-center w-11 h-11 transition-colors duration-200 ${
                  transparentHeader ? 'text-white' : 'text-[#111816]'
                }`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                id="mobile-navigation-drawer"
                aria-label="Mobile navigation"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="md:hidden bg-white text-[#111816] border-b border-[#E2E6E4] px-6 py-6"
              >
                <ul className="flex flex-col gap-1">
                  <li>
                    <Link
                      href="/"
                      aria-current={pathname === '/' ? 'page' : undefined}
                      className={`block py-3 text-base font-medium border-b border-[#F1F3F2] ${
                        pathname === '/' ? 'text-[#1B4D3E]' : 'text-[#111816]'
                      }`}
                    >
                      Home
                    </Link>
                  </li>
                  {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={isActive ? 'page' : undefined}
                          className={`block py-3 text-base font-medium border-b border-[#F1F3F2] ${
                            isActive ? 'text-[#1B4D3E]' : 'text-[#111816]'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-5">
                  <Link
                    href="/contact#booking"
                    className="w-full inline-flex items-center justify-center px-5 py-3 text-sm font-medium bg-[#1B4D3E] text-white hover:bg-[#143B2F] transition-colors duration-200"
                  >
                    Book Consultation
                  </Link>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </header>

        <main id="main-content" className={isHome ? '' : 'pt-[68px]'}>
          {children}
        </main>

        <footer className="bg-[#111816] text-[#F1F3F2] border-t border-[#232D2A]">
          <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-16 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-white/10">
              <div className="md:col-span-5">
                <div className="flex items-center gap-4 mb-5">
                  <span
                    aria-hidden="true"
                    className="w-11 h-11 border border-white/25 flex items-center justify-center font-serif text-lg tracking-wider text-white shrink-0"
                  >
                    PR
                  </span>
                  <span className="font-serif text-2xl text-white tracking-[-0.015em]">
                    {BRAND_INFO.name}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[#C7D0CD] max-w-[44ch]">
                  Certified trichology, hair loss restoration, therapeutic scalp care, and tailored
                  hair artistry in Grand Cayman. Affiliated with the World Trichology Society.
                </p>
              </div>

              <div className="md:col-span-3">
                <h2 className="font-sans text-sm font-semibold text-white mb-4">Navigation</h2>
                <ul className="space-y-3 text-sm text-[#C7D0CD]">
                  <li>
                    <Link href="/" className="hover:text-white transition-colors duration-200">
                      Home
                    </Link>
                  </li>
                  {NAV_ITEMS.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="hover:text-white transition-colors duration-200"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-4">
                <h2 className="font-sans text-sm font-semibold text-white mb-4">
                  Direct Contact and Profiles
                </h2>
                <ul className="space-y-3 text-sm text-[#C7D0CD]">
                  <li>
                    <a
                      href={BRAND_INFO.phoneHref}
                      className="inline-flex items-center gap-2.5 hover:text-white transition-colors duration-200 tabular-nums"
                    >
                      <Phone className="w-4 h-4 text-[#8AB8A8] shrink-0" aria-hidden="true" />
                      <span>{BRAND_INFO.phoneDisplay}</span>
                    </a>
                  </li>
                  <li>
                    <Link
                      href="/contact#studio-map"
                      className="inline-flex items-center gap-2.5 hover:text-white transition-colors duration-200"
                    >
                      <MapPin className="w-4 h-4 text-[#8AB8A8] shrink-0" aria-hidden="true" />
                      <span>Seven Mile Beach, Grand Cayman</span>
                    </Link>
                  </li>
                  <li className="pt-2 flex flex-wrap items-center gap-5">
                    <a
                      href={BRAND_INFO.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-white hover:text-[#8AB8A8] transition-colors duration-200"
                    >
                      <Instagram className="w-4 h-4" aria-hidden="true" />
                      <span>Instagram</span>
                    </a>
                    <a
                      href={BRAND_INFO.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-white hover:text-[#8AB8A8] transition-colors duration-200"
                    >
                      <Linkedin className="w-4 h-4" aria-hidden="true" />
                      <span>LinkedIn</span>
                    </a>
                    <a
                      href={BRAND_INFO.googleBusinessUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-white hover:text-[#8AB8A8] transition-colors duration-200"
                    >
                      <span>Google Profile</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-[#A5B1AD]">
              <p>
                &copy; {new Date().getFullYear()} {BRAND_INFO.name}, WTS. Grand Cayman, Cayman
                Islands.
              </p>
              <p>
                Interactive maps and local routing powered by Google Maps Platform.{' '}
                <a
                  href="https://maps.google.com/help/terms_maps/?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white transition-colors duration-200"
                >
                  Google Maps Terms
                </a>
                .
              </p>
            </div>
          </div>
        </footer>
      </MotionConfig>
    </MapsConfigContext.Provider>
  );
}
