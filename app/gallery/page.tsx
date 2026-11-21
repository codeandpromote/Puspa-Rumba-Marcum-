import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { GalleryShowcase } from '@/components/GalleryShowcase';
import { GoogleProfilePhotos } from '@/components/GoogleProfilePhotos';

export const metadata: Metadata = {
  title: 'Photography & Studio Gallery | Puspa Rumba-Marcum',
  description:
    'Browse studio photography, clinical scalp therapy vignettes, hair artistry, and original images from Puspa Rumba-Marcum’s Google Business Profile.',
};

export default function GalleryPage() {
  return (
    <div className="bg-[#FAFAFA] text-[#111816]">
      <section className="max-w-[1320px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-12">
        <div className="max-w-3xl space-y-5">
          <h1 className="font-serif text-[2.75rem] md:text-[4rem] leading-[1.02] tracking-[-0.03em] text-[#111816]">
            Craft, scalp health, and studio atmosphere
          </h1>
          <p className="text-base text-[#4A5552] leading-[1.65] max-w-[60ch]">
            A visual look inside our clinical scalp rituals, healthy hair finishes, and the quiet
            daylight studio space along Seven Mile Beach.
          </p>
        </div>
      </section>

      <section
        aria-label="Curated studio photography"
        className="max-w-[1320px] mx-auto px-6 md:px-10 pb-24"
      >
        <GalleryShowcase />
      </section>

      {/* Live Original Photos & Verified Reviews from Google Business Profile */}
      <section
        aria-labelledby="google-profile-heading"
        className="bg-white border-t border-[#E2E6E4] py-20 md:py-28"
      >
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 space-y-10">
          <div className="max-w-2xl space-y-3">
            <h2
              id="google-profile-heading"
              className="font-serif text-[2rem] md:text-[2.65rem] leading-[1.1] tracking-[-0.025em] text-[#111816]"
            >
              From our Google Business Profile
            </h2>
            <p className="text-base text-[#4A5552] leading-[1.65]">
              Original photos and verified client reviews loaded live via Google Maps Platform.
            </p>
          </div>

          <GoogleProfilePhotos />
        </div>
      </section>

      <section className="bg-[#F1F3F2] border-t border-[#E2E6E4] py-16 md:py-20">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="font-serif text-[2rem] md:text-[2.5rem] leading-[1.1] tracking-[-0.02em] text-[#111816]">
              Ready to visit the studio in person?
            </h2>
            <p className="text-base text-[#4A5552] leading-[1.65]">
              Schedule a private trichology consultation or scalp therapy appointment in Grand
              Cayman.
            </p>
          </div>
          <Link
            href="/contact#booking"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium bg-[#1B4D3E] text-white hover:bg-[#143B2F] transition-colors duration-200 whitespace-nowrap shrink-0 self-start md:self-auto"
          >
            <span>Request an Appointment</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
