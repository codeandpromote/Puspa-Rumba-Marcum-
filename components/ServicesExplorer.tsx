'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { EditorialImage } from '@/components/EditorialImage';
import {
  STUDIO_FAQS,
  STUDIO_SERVICES,
  type ServiceCategory,
} from '@/lib/studio-data';
import { filterServicesByCategory } from '@/lib/studio-logic';

const CATEGORY_TABS: Array<{ id: ServiceCategory | 'all'; label: string }> = [
  { id: 'all', label: 'All Offerings' },
  { id: 'trichology', label: 'Clinical Trichology' },
  { id: 'scalp', label: 'Scalp Therapy' },
  { id: 'artistry', label: 'Hair Artistry' },
];

export function ServicesExplorer() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>(STUDIO_FAQS[0]?.id ?? null);

  const visibleServices = filterServicesByCategory(STUDIO_SERVICES, activeCategory);

  return (
    <div className="space-y-24 md:space-y-28">
      {/* Interactive Category Segmented Tabs + Treatment List */}
      <section aria-label="Treatment menu">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E6E4] pb-6 mb-12">
          <div
            role="tablist"
            aria-label="Filter offerings by discipline"
            className="inline-flex flex-wrap gap-1 p-1 bg-[#F1F3F2]"
          >
            {CATEGORY_TABS.map((tab) => {
              const selected = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                    selected
                      ? 'bg-white text-[#111816]'
                      : 'text-[#4A5552] hover:text-[#111816]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <p className="text-sm text-[#4A5552] tabular-nums">
            Showing {visibleServices.length} of {STUDIO_SERVICES.length} offerings
          </p>
        </div>

        <div className="divide-y divide-[#E2E6E4]">
          {visibleServices.map((service, index) => (
            <article
              key={service.id}
              className="py-10 first:pt-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
            >
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#ECEFED]">
                  <EditorialImage
                    src={service.image}
                    alt={service.imageAlt}
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <p className="text-sm text-[#4A5552] tabular-nums">
                    <span>{service.categoryLabel}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{service.duration}</span>
                  </p>
                  <h2 className="font-serif text-[2rem] md:text-[2.35rem] leading-[1.12] tracking-[-0.02em] text-[#111816]">
                    {service.title}
                  </h2>
                  <p className="text-base text-[#111816] leading-[1.65] max-w-[62ch]">
                    {service.summary}
                  </p>
                  <p className="text-base text-[#4A5552] leading-[1.65] max-w-[62ch]">
                    {service.details}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#ECEFED] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-sm text-[#4A5552] max-w-[46ch]">
                    <span className="font-semibold text-[#111816]">Recommended for: </span>
                    {service.idealFor}
                  </p>
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.slug)}#booking`}
                    aria-label={`Inquire about ${service.title}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#1B4D3E] hover:text-[#143B2F] underline underline-offset-4 whitespace-nowrap shrink-0 transition-colors duration-150"
                  >
                    <span>Inquire about this treatment</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Accessible FAQ Accordion */}
      <section aria-labelledby="faq-heading" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pt-16 border-t border-[#E2E6E4]">
        <div className="lg:col-span-4 space-y-4">
          <h2
            id="faq-heading"
            className="font-serif text-[2rem] md:text-[2.65rem] leading-[1.1] tracking-[-0.025em] text-[#111816]"
          >
            Questions before your visit
          </h2>
          <p className="text-base text-[#4A5552] leading-[1.65]">
            Clear guidance on preparing for your diagnostic consultation and what to expect during
            restoration care in Grand Cayman.
          </p>
        </div>

        <div className="lg:col-span-8 divide-y divide-[#E2E6E4] border-t border-b border-[#E2E6E4]">
          {STUDIO_FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;
            const panelId = `panel-${faq.id}`;
            return (
              <div key={faq.id}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full py-6 text-left flex items-center justify-between gap-6 text-base font-semibold text-[#111816] hover:text-[#1B4D3E] transition-colors duration-150"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`w-5 h-5 text-[#4A5552] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#1B4D3E]' : ''
                      }`}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  hidden={!isOpen}
                  className="pb-6 pr-8 text-base text-[#4A5552] leading-[1.65] max-w-[64ch]"
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
