import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Instagram, Linkedin, Phone, ExternalLink } from 'lucide-react';
import { ContactInquiryForm } from '@/components/ContactInquiryForm';
import { StudioLocationMap } from '@/components/StudioLocationMap';
import { BRAND_INFO } from '@/lib/studio-data';

export const metadata: Metadata = {
  title: 'Contact & Local Directions | Puspa Rumba-Marcum',
  description:
    'Request a private hair loss consultation or scalp therapy visit with Puspa Rumba-Marcum in Grand Cayman, and plan your route using our interactive local map.',
};

export default function ContactPage() {
  return (
    <div className="bg-[#FAFAFA] text-[#111816]">
      <section className="max-w-[1320px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-12">
        <div className="max-w-3xl space-y-5">
          <h1 className="font-serif text-[2.75rem] md:text-[4rem] leading-[1.02] tracking-[-0.03em] text-[#111816]">
            Book a consultation or plan your visit
          </h1>
          <p className="text-base text-[#4A5552] leading-[1.65] max-w-[60ch]">
            Send a confidential inquiry below and Puspa&apos;s studio will confirm your preferred
            time window, or use the interactive map to navigate from anywhere in Grand Cayman.
          </p>
        </div>
      </section>

      {/* Contact & Consultation Request Section */}
      <section
        id="booking"
        aria-labelledby="booking-heading"
        className="max-w-[1320px] mx-auto px-6 md:px-10 pb-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7 bg-white border border-[#E2E6E4] p-7 md:p-10">
            <div className="mb-8 space-y-2">
              <h2
                id="booking-heading"
                className="font-serif text-[2rem] md:text-[2.35rem] leading-[1.12] tracking-[-0.02em] text-[#111816]"
              >
                Consultation request form
              </h2>
              <p className="text-sm text-[#4A5552]">
                Share your goals and preferred time. No payment is required to inquire.
              </p>
            </div>

            <Suspense
              fallback={
                <div className="h-96 bg-[#F1F3F2] animate-pulse" aria-label="Loading form" />
              }
            >
              <ContactInquiryForm />
            </Suspense>
          </div>

          <aside className="lg:col-span-5 space-y-8">
            <div className="bg-[#F1F3F2] p-7 md:p-8 space-y-5">
              <h2 className="font-serif text-[1.85rem] leading-[1.15] text-[#111816]">
                Direct studio contact
              </h2>
              <p className="text-base text-[#4A5552] leading-[1.65]">
                Prefer to speak directly before scheduling? Call or message the studio for quick
                questions on hair loss consultations, travel timing, or scalp therapy preparation.
              </p>
              <div className="space-y-3 pt-2 text-sm">
                <p>
                  <a
                    href={BRAND_INFO.phoneHref}
                    className="inline-flex items-center gap-2.5 text-base font-semibold text-[#111816] hover:text-[#1B4D3E] transition-colors duration-150 tabular-nums"
                  >
                    <Phone className="w-4 h-4 text-[#1B4D3E]" aria-hidden="true" />
                    <span>{BRAND_INFO.phoneDisplay}</span>
                  </a>
                </p>
                <div className="flex flex-wrap items-center gap-5 pt-2">
                  <a
                    href={BRAND_INFO.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#111816] hover:text-[#1B4D3E] underline underline-offset-4 transition-colors duration-150"
                  >
                    <Instagram className="w-4 h-4" aria-hidden="true" />
                    <span>{BRAND_INFO.instagramHandle}</span>
                  </a>
                  <a
                    href={BRAND_INFO.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#111816] hover:text-[#1B4D3E] underline underline-offset-4 transition-colors duration-150"
                  >
                    <Linkedin className="w-4 h-4" aria-hidden="true" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={BRAND_INFO.googleBusinessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#1B4D3E] underline underline-offset-4 hover:text-[#143B2F] transition-colors duration-150"
                  >
                    <span>Google Listing</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E2E6E4] pt-7 space-y-3">
              <h3 className="text-base font-semibold text-[#111816]">
                Preparing for a trichology evaluation
              </h3>
              <p className="text-base text-[#4A5552] leading-[1.65]">
                For the clearest microscopic scalp reading, please arrive with unwashed hair from
                the previous 24 to 48 hours and avoid dry shampoo, root concealer, or heavy oils on
                the morning of your visit.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Dynamic Local Navigation Map Section */}
      <section
        id="studio-map"
        aria-labelledby="map-heading"
        className="bg-white border-t border-[#E2E6E4] py-20 md:py-28"
      >
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 space-y-10">
          <div className="max-w-2xl space-y-3">
            <h2
              id="map-heading"
              className="font-serif text-[2.15rem] md:text-[2.85rem] leading-[1.08] tracking-[-0.025em] text-[#111816]"
            >
              Navigate to the studio in Grand Cayman
            </h2>
            <p className="text-base text-[#4A5552] leading-[1.65]">
              Explore the studio location along Seven Mile Beach and calculate driving or walking
              routes from Grand Cayman landmarks or your hotel address.
            </p>
          </div>

          <StudioLocationMap />
        </div>
      </section>
    </div>
  );
}
