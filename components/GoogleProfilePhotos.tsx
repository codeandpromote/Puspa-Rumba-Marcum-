'use client';

import React, { useEffect, useState } from 'react';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import { ExternalLink, Star } from 'lucide-react';
import { BRAND_INFO } from '@/lib/studio-data';
import { useMapsConfig } from '@/components/SiteShell';

interface PlacePhotoCard {
  uri: string;
  authorName: string;
  authorUri: string | null;
}

interface PlaceReviewCard {
  authorName: string;
  rating: number | null;
  relativeTime: string;
  text: string;
}

interface LiveGoogleProfileState {
  status: 'loading' | 'loaded' | 'empty' | 'error';
  displayName: string;
  rating: number | null;
  userRatingCount: number | null;
  googleMapsURI: string;
  photos: PlacePhotoCard[];
  reviews: PlaceReviewCard[];
}

function GoogleProfileLoader() {
  const placesLib = useMapsLibrary('places');
  const [profile, setProfile] = useState<LiveGoogleProfileState>({
    status: 'loading',
    displayName: BRAND_INFO.name,
    rating: null,
    userRatingCount: null,
    googleMapsURI: BRAND_INFO.googleBusinessUrl,
    photos: [],
    reviews: [],
  });

  useEffect(() => {
    if (!placesLib) return;
    let cancelled = false;

    async function fetchGoogleBusinessMedia() {
      try {
        const PlaceClass = placesLib!.Place as unknown as {
          searchByText: (req: Record<string, unknown>) => Promise<{
            places: google.maps.places.Place[];
          }>;
        };

        const { places } = await PlaceClass.searchByText({
          textQuery: BRAND_INFO.placeSearchQuery,
          fields: [
            'displayName',
            'rating',
            'userRatingCount',
            'photos',
            'reviews',
            'googleMapsURI',
          ],
          maxResultCount: 1,
          language: 'en',
          region: 'KY',
          internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'],
        });

        if (cancelled) return;
        const found = places?.[0];

        if (!found) {
          setProfile((prev) => ({ ...prev, status: 'empty' }));
          return;
        }

        // Dynamically generate fresh photo URIs without caching (ToS Section 3.2.3(b))
        const rawPhotos = (found.photos || []).slice(0, 6);
        const mappedPhotos: PlacePhotoCard[] = rawPhotos.map((photo) => {
          const primaryAttr = photo.authorAttributions?.[0];
          return {
            uri: photo.getURI({ maxWidth: 900 }),
            authorName: primaryAttr?.displayName || 'Google Business Profile Contributor',
            authorUri: primaryAttr?.uri || null,
          };
        });

        const rawReviews = (found.reviews || []).slice(0, 3);
        const mappedReviews: PlaceReviewCard[] = rawReviews
          .filter((rev) => Boolean(rev.text))
          .map((rev) => ({
            authorName: rev.authorAttribution?.displayName || 'Verified Client',
            rating: typeof rev.rating === 'number' ? rev.rating : null,
            relativeTime: rev.relativePublishTimeDescription || '',
            text: rev.text || '',
          }));

        setProfile({
          status: mappedPhotos.length > 0 || mappedReviews.length > 0 ? 'loaded' : 'empty',
          displayName: found.displayName || BRAND_INFO.name,
          rating: typeof found.rating === 'number' ? found.rating : null,
          userRatingCount: typeof found.userRatingCount === 'number' ? found.userRatingCount : null,
          googleMapsURI: found.googleMapsURI || BRAND_INFO.googleBusinessUrl,
          photos: mappedPhotos,
          reviews: mappedReviews,
        });
      } catch (err) {
        if (cancelled) return;
        const msg = String(err ?? '');
        if (
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('OVER_QUERY_LIMIT') ||
          msg.includes('QuotaExceeded') ||
          msg.includes('429')
        ) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setProfile((prev) => ({ ...prev, status: 'error' }));
      }
    }

    void fetchGoogleBusinessMedia();

    return () => {
      cancelled = true;
    };
  }, [placesLib]);

  if (profile.status === 'loading') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-busy="true">
        {[1, 2, 3].map((slot) => (
          <div key={slot} className="aspect-[4/3] bg-[#ECEFED] animate-pulse" />
        ))}
      </div>
    );
  }

  if (profile.status === 'empty' || profile.status === 'error') {
    return (
      <div className="bg-[#F1F3F2] p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <h3 className="font-sans text-base font-semibold text-[#111816]">
            View Original Photos and Client Reviews on Google
          </h3>
          <p className="text-base text-[#4A5552] mt-2 leading-relaxed">
            Explore recent client transformations, studio photographs, and verified reviews published
            directly on Puspa Rumba-Marcum&apos;s Google Business Profile and Instagram.
          </p>
        </div>
        <a
          href={BRAND_INFO.googleBusinessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium bg-[#1B4D3E] text-white hover:bg-[#143B2F] transition-colors duration-200 whitespace-nowrap shrink-0 self-start md:self-auto"
        >
          <span>Open Google Business Profile</span>
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2E6E4] pb-6">
        <div>
          <h3 className="font-sans text-base font-semibold text-[#111816]">
            {profile.displayName}
          </h3>
          {typeof profile.rating === 'number' && (
            <p className="text-sm text-[#4A5552] mt-1 flex items-center gap-2 tabular-nums">
              <Star className="w-4 h-4 text-[#1B4D3E] fill-[#1B4D3E]" aria-hidden="true" />
              <span>
                {profile.rating.toFixed(1)} rating on Google
                {typeof profile.userRatingCount === 'number'
                  ? ` · ${profile.userRatingCount} verified reviews`
                  : ''}
              </span>
            </p>
          )}
        </div>
        <a
          href={profile.googleMapsURI}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1B4D3E] underline underline-offset-4 hover:text-[#143B2F] transition-colors duration-200"
        >
          <span>View full Google listing</span>
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>

      {profile.photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.photos.map((photo, index) => (
            <figure key={`${photo.uri}-${index}`} className="group">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#ECEFED]">
                <img
                  src={photo.uri}
                  alt={`Original photograph from ${profile.displayName} Google Business Profile (${index + 1})`}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <figcaption className="mt-2.5 text-sm text-[#4A5552]">
                Photo by{' '}
                {photo.authorUri ? (
                  <a
                    href={photo.authorUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#111816] transition-colors duration-150"
                  >
                    {photo.authorName}
                  </a>
                ) : (
                  <span>{photo.authorName}</span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {profile.reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-[#E2E6E4]">
          {profile.reviews.map((review, idx) => (
            <blockquote key={`${review.authorName}-${idx}`} className="space-y-3">
              {typeof review.rating === 'number' && (
                <p className="text-sm font-medium text-[#1B4D3E] tabular-nums">
                  {review.rating.toFixed(1)} / 5.0
                </p>
              )}
              <p className="text-base text-[#111816] leading-relaxed line-clamp-5">
                &ldquo;{review.text}&rdquo;
              </p>
              <footer className="text-sm text-[#4A5552]">
                <span>{review.authorName}</span>
                {review.relativeTime && (
                  <>
                    <span aria-hidden="true"> · </span>
                    <span>{review.relativeTime}</span>
                  </>
                )}
              </footer>
            </blockquote>
          ))}
        </div>
      )}
    </div>
  );
}

export function GoogleProfilePhotos() {
  const { mapsApiKey } = useMapsConfig();

  if (!mapsApiKey) {
    return (
      <div className="bg-[#F1F3F2] p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-base text-[#4A5552]">
          Original studio images and reviews are published on Puspa Rumba-Marcum&apos;s Google
          Business Profile.
        </p>
        <a
          href={BRAND_INFO.googleBusinessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1B4D3E] underline underline-offset-4 whitespace-nowrap shrink-0"
        >
          <span>Open Google Business Profile</span>
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <APIProvider apiKey={mapsApiKey} language="en" region="KY">
      <GoogleProfileLoader />
    </APIProvider>
  );
}
