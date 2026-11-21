import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { EditorialImage } from '@/components/EditorialImage';
import { BRAND_INFO } from '@/lib/studio-data';

export const metadata: Metadata = {
  title: 'About Puspa Rumba-Marcum, WTS | Hair Loss Specialist & Trichologist',
  description:
    'Meet Puspa Rumba-Marcum, WTS Certified Trichologist and master hairstylist serving Grand Cayman since 2009.',
};

const PRACTICE_PILLARS = [
  {
    title: 'Root-cause diagnostics first',
    description:
      'Thinning hair rarely has a single superficial fix. Puspa looks closely at follicular health, nutrition, stress cycles, and styling tension before recommending any treatment.',
  },
  {
    title: 'Kindness to fragile hair',
    description:
      'Cutting, coloring, and finishing techniques are adapted specifically to protect delicate hair shafts and preserve scalp comfort in humid Caribbean weather.',
  },
  {
    title: 'Discreet one-on-one care',
    description:
      'Hair loss is deeply personal. Private appointments ensure you can ask honest questions and track measurable progress in complete confidentiality.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#FAFAFA] text-[#111816]">
      {/* Opening Biographical Editorial Split */}
      <section className="max-w-[1320px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#ECEFED]">
              <EditorialImage
                src="/images/about-puspa-portrait.jpg"
                alt="Puspa Rumba-Marcum, WTS Certified Trichologist in her Grand Cayman studio"
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
            <p className="text-sm text-[#4A5552] mt-4">
              {BRAND_INFO.name} · {BRAND_INFO.credentials} · {BRAND_INFO.region}
            </p>
          </div>

          <div className="lg:col-span-7 space-y-7">
            <h1 className="font-serif text-[2.75rem] md:text-[4rem] leading-[1.02] tracking-[-0.03em] text-[#111816]">
              Dedicated to healthy scalps and confident hair in Grand Cayman
            </h1>

            <div className="space-y-5 text-base text-[#4A5552] leading-[1.7] max-w-[62ch]">
              <p className="text-[#111816]">
                Puspa Rumba-Marcum is a Certified Trichologist affiliated with the World Trichology
                Society (WTS), a hair loss specialist, and a seasoned hairstylist who has called the
                Cayman Islands home since 2009.
              </p>
              <p>
                Originally from the Nuwakot district of Nepal, Puspa built her reputation in Grand
                Cayman through years of meticulous salon craftsmanship, including senior styling
                work at leading island destinations such as Eclipze Hair Design and Day Spa. Along
                the way, she noticed a recurring gap: clients experiencing shedding, postpartum
                thinning, or chronic scalp irritation were often given temporary cosmetic products
                rather than thorough answers.
              </p>
              <p>
                Determined to offer deeper clinical care, she pursued specialized certification
                through the World Trichology Society. Today, her private practice along Seven Mile
                Beach brings together diagnostic scalp microscopy, soothing therapeutic treatments,
                and refined everyday styling under one calm roof.
              </p>
              <p>
                Beyond the studio, Puspa remains deeply connected to the Cayman Islands community,
                having helped organize local Nepali community relief efforts and island events over
                more than a decade in Grand Cayman.
              </p>
            </div>

            <div className="pt-4 border-t border-[#E2E6E4] flex flex-wrap items-center gap-6 text-sm">
              <a
                href={BRAND_INFO.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-[#1B4D3E] underline underline-offset-4 hover:text-[#143B2F] transition-colors duration-150"
              >
                <span>View LinkedIn Credentials</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <a
                href={BRAND_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-[#111816] underline underline-offset-4 hover:text-[#1B4D3E] transition-colors duration-150"
              >
                <span>Follow {BRAND_INFO.instagramHandle}</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy of Care */}
      <section aria-labelledby="philosophy-heading" className="bg-[#F1F3F2] py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 space-y-14">
          <div className="max-w-2xl space-y-4">
            <h2
              id="philosophy-heading"
              className="font-serif text-[2.15rem] md:text-[2.85rem] leading-[1.08] tracking-[-0.025em] text-[#111816]"
            >
              How every client is cared for
            </h2>
            <p className="text-base text-[#4A5552] leading-[1.65]">
              A thoughtful balance of scientific rigor, natural botanicals, and unhurried personal
              attention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-8 border-t border-[#D8DFDC]">
            {PRACTICE_PILLARS.map((pillar) => (
              <div key={pillar.title} className="space-y-3">
                <h3 className="text-base font-semibold text-[#111816]">{pillar.title}</h3>
                <p className="text-base text-[#4A5552] leading-[1.65]">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Interior Feature & Closing Action */}
      <section className="max-w-[1320px] mx-auto px-6 md:px-10 py-20 md:py-28 space-y-12">
        <div className="relative aspect-[16/9] max-h-[520px] overflow-hidden bg-[#ECEFED]">
          <EditorialImage
            src="/images/studio-seafire-interior.jpg"
            alt="Private coastal trichology and hair studio interior in Grand Cayman"
            sizes="(max-width: 1320px) 100vw, 1320px"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <h2 className="font-serif text-[2rem] md:text-[2.65rem] leading-[1.1] tracking-[-0.02em] text-[#111816]">
              Experience private care along Seven Mile Beach
            </h2>
            <p className="text-base text-[#4A5552] leading-[1.65]">
              Whether you are noticing new hair thinning or seeking a stylist who understands
              delicate scalps, your first step is a calm conversation.
            </p>
          </div>
          <Link
            href="/contact#booking"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium bg-[#1B4D3E] text-white hover:bg-[#143B2F] transition-colors duration-200 whitespace-nowrap shrink-0 self-start md:self-auto"
          >
            <span>Book a Consultation</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
