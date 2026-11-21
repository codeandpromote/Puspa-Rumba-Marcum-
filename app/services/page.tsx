import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ServicesExplorer } from '@/components/ServicesExplorer';

export const metadata: Metadata = {
  title: 'Services & Trichology Treatments | Puspa Rumba-Marcum',
  description:
    'Explore clinical hair loss evaluations, therapeutic scalp renewal treatments, and precision scalp-safe hair artistry in Grand Cayman.',
};

export default function ServicesPage() {
  return (
    <div className="bg-[#FAFAFA] text-[#111816]">
      <section className="max-w-[1320px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-12 md:pb-16">
        <div className="max-w-3xl space-y-5">
          <h1 className="font-serif text-[2.75rem] md:text-[4rem] leading-[1.02] tracking-[-0.03em] text-[#111816]">
            Clinical trichology and bespoke hair services
          </h1>
          <p className="text-base text-[#4A5552] leading-[1.65] max-w-[60ch]">
            Each session is conducted one-on-one in Grand Cayman and tailored to your follicle
            health, hair texture, and lifestyle. Filter by discipline below to explore individual
            offerings.
          </p>
        </div>
      </section>

      <section className="max-w-[1320px] mx-auto px-6 md:px-10 pb-24 md:pb-32">
        <ServicesExplorer />
      </section>

      <section className="bg-[#F1F3F2] border-t border-[#E2E6E4] py-16 md:py-20">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="font-serif text-[2rem] md:text-[2.5rem] leading-[1.1] tracking-[-0.02em] text-[#111816]">
              Unsure which session fits your goals?
            </h2>
            <p className="text-base text-[#4A5552] leading-[1.65]">
              Start with a Comprehensive Hair Loss Evaluation so Puspa can assess your scalp under
              magnification and recommend the right plan.
            </p>
          </div>
          <Link
            href="/contact?service=comprehensive-trichology-evaluation#booking"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium bg-[#1B4D3E] text-white hover:bg-[#143B2F] transition-colors duration-200 whitespace-nowrap shrink-0 self-start md:self-auto"
          >
            <span>Book an Evaluation</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
