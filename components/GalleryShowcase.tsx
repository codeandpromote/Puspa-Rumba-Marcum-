'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { EditorialImage } from '@/components/EditorialImage';
import {
  EDITORIAL_GALLERY,
  type GalleryCategory,
  type GalleryItem,
} from '@/lib/studio-data';
import { filterGalleryByCategory } from '@/lib/studio-logic';

const GALLERY_TABS: Array<{ id: GalleryCategory | 'all'; label: string }> = [
  { id: 'all', label: 'All Photography' },
  { id: 'artistry', label: 'Hair Artistry' },
  { id: 'clinic', label: 'Scalp and Clinic' },
  { id: 'studio', label: 'Studio Space' },
];

export function GalleryShowcase() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'all'>('all');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const visibleItems = filterGalleryByCategory(EDITORIAL_GALLERY, activeCategory);
  const activeItem: GalleryItem | null =
    activeIndex !== null && visibleItems[activeIndex] ? visibleItems[activeIndex] : null;

  useEffect(() => {
    if (activeIndex === null) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null);
      } else if (event.key === 'ArrowRight') {
        setActiveIndex((prev) =>
          prev === null ? null : (prev + 1) % visibleItems.length
        );
      } else if (event.key === 'ArrowLeft') {
        setActiveIndex((prev) =>
          prev === null ? null : (prev - 1 + visibleItems.length) % visibleItems.length
        );
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, visibleItems.length]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E6E4] pb-6">
        <div
          role="tablist"
          aria-label="Filter studio photography"
          className="inline-flex flex-wrap gap-1 p-1 bg-[#F1F3F2]"
        >
          {GALLERY_TABS.map((tab) => {
            const selected = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => {
                  setActiveCategory(tab.id);
                  setActiveIndex(null);
                }}
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
          {visibleItems.length} photographs · Select any frame to inspect full screen
        </p>
      </div>

      {/* Editorial Asymmetric Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {visibleItems.map((item, idx) => {
          const isWide = item.aspect === 'wide' && activeCategory === 'all';
          const spanClass = isWide ? 'md:col-span-7' : 'md:col-span-5';
          const aspectClass =
            item.aspect === 'portrait'
              ? 'aspect-[3/4] md:aspect-[4/4.2]'
              : item.aspect === 'wide'
                ? 'aspect-[16/10]'
                : 'aspect-[4/3]';

          return (
            <figure key={item.id} className={`${spanClass} group`}>
              <button
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View full-size photograph: ${item.title}`}
                className="w-full text-left block focus-visible:outline-2 focus-visible:outline-[#1B4D3E]"
              >
                <div className={`relative ${aspectClass} overflow-hidden bg-[#ECEFED]`}>
                  <EditorialImage
                    src={item.image}
                    alt={item.alt}
                    priority={idx === 0}
                    sizes={isWide ? '(max-width: 768px) 100vw, 58vw' : '(max-width: 768px) 100vw, 42vw'}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <figcaption className="mt-4 space-y-1">
                  <p className="text-sm text-[#4A5552]">{item.categoryLabel}</p>
                  <p className="text-base font-semibold text-[#111816] group-hover:text-[#1B4D3E] transition-colors duration-150">
                    {item.title}
                  </p>
                  <p className="text-sm text-[#4A5552] leading-relaxed">{item.caption}</p>
                </figcaption>
              </button>
            </figure>
          );
        })}
      </div>

      {/* Accessible Fullscreen Lightbox Dialog */}
      {activeItem && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photograph viewer: ${activeItem.title}`}
          className="fixed inset-0 z-50 bg-[#0D1311]/95 text-white flex flex-col justify-between p-6 md:p-10"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-[#C7D0CD] tabular-nums">
              {activeIndex + 1} / {visibleItems.length} · {activeItem.categoryLabel}
            </p>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label="Close photograph viewer"
              className="inline-flex items-center justify-center w-11 h-11 border border-white/20 text-white hover:bg-white hover:text-[#111816] transition-colors duration-150"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div className="relative flex-1 my-6 max-w-5xl w-full mx-auto flex items-center justify-center">
            <div className="relative w-full h-full min-h-[320px] max-h-[68vh]">
              <EditorialImage
                src={activeItem.image}
                alt={activeItem.alt}
                sizes="90vw"
                className="object-contain"
              />
            </div>
          </div>

          <div className="max-w-5xl w-full mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-t border-white/15 pt-5">
            <div className="space-y-1">
              <p className="font-serif text-2xl text-white">{activeItem.title}</p>
              <p className="text-sm text-[#C7D0CD]">{activeItem.caption}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                aria-label="Previous photograph"
                onClick={() =>
                  setActiveIndex(
                    (activeIndex - 1 + visibleItems.length) % visibleItems.length
                  )
                }
                className="inline-flex items-center justify-center w-11 h-11 border border-white/25 text-white hover:bg-white hover:text-[#111816] transition-colors duration-150"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next photograph"
                onClick={() => setActiveIndex((activeIndex + 1) % visibleItems.length)}
                className="inline-flex items-center justify-center w-11 h-11 border border-white/25 text-white hover:bg-white hover:text-[#111816] transition-colors duration-150"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
