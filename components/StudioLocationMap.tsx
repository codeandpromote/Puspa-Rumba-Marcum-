'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  Car,
  ExternalLink,
  Footprints,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  Search,
  Star,
  Clock,
} from 'lucide-react';
import { BRAND_INFO, CAYMAN_LANDMARKS } from '@/lib/studio-data';
import { formatRouteMetrics, type FormattedRouteMetrics } from '@/lib/studio-logic';
import { useMapsConfig } from '@/components/SiteShell';

const GRAND_CAYMAN_OVERVIEW = { lat: 19.342, lng: -81.381 };

interface VerifiedPlaceState {
  displayName: string;
  formattedAddress: string;
  location: google.maps.LatLngLiteral;
  rating?: number | null;
  userRatingCount?: number | null;
  googleMapsURI?: string | null;
  weekdayDescriptions?: string[];
  isFallbackLocation: boolean;
}

interface AutocompleteItem {
  placeId: string;
  label: string;
  originValue: string;
}

function isQuotaError(err: unknown): boolean {
  const msg = String(err ?? '');
  return (
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('OVER_QUERY_LIMIT') ||
    msg.includes('QuotaExceeded') ||
    msg.includes('429')
  );
}

interface MapCanvasControllerProps {
  originQuery: string;
  travelMode: 'DRIVING' | 'WALKING';
  onPlaceResolved: (place: VerifiedPlaceState) => void;
  onPlaceError: (message: string) => void;
  onRouteResolved: (metrics: FormattedRouteMetrics | null, errorMsg: string | null, loading: boolean) => void;
  place: VerifiedPlaceState | null;
  mapTypeId: 'roadmap' | 'satellite';
}

function MapCanvasController({
  originQuery,
  travelMode,
  onPlaceResolved,
  onPlaceError,
  onRouteResolved,
  place,
  mapTypeId,
}: MapCanvasControllerProps) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const routesLib = useMapsLibrary('routes');

  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const fetchedPlaceRef = useRef(false);

  // Update mapTypeId declaratively
  useEffect(() => {
    if (!map) return;
    map.setMapTypeId(mapTypeId);
  }, [map, mapTypeId]);

  // Fetch verified studio place details via Places API (New) Place.searchByText
  useEffect(() => {
    if (!placesLib || fetchedPlaceRef.current) return;
    fetchedPlaceRef.current = true;

    let cancelled = false;

    async function lookupStudioPlace() {
      try {
        const PlaceClass = placesLib!.Place as unknown as {
          searchByText: (req: Record<string, unknown>) => Promise<{ places: google.maps.places.Place[] }>;
        };

        const fields = [
          'displayName',
          'formattedAddress',
          'location',
          'rating',
          'userRatingCount',
          'googleMapsURI',
          'regularOpeningHours',
        ];

        const primaryResponse = await PlaceClass.searchByText({
          textQuery: BRAND_INFO.placeSearchQuery,
          fields,
          maxResultCount: 1,
          language: 'en',
          region: 'KY',
          internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'],
        });

        let found = primaryResponse.places?.[0];
        let isFallback = false;

        if (!found || !found.location) {
          const fallbackResponse = await PlaceClass.searchByText({
            textQuery: BRAND_INFO.fallbackLocationQuery,
            fields,
            maxResultCount: 1,
            language: 'en',
            region: 'KY',
            internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'],
          });
          found = fallbackResponse.places?.[0];
          isFallback = true;
        }

        if (cancelled) return;

        if (found && found.location) {
          const coords: google.maps.LatLngLiteral = {
            lat: found.location.lat(),
            lng: found.location.lng(),
          };
          const resolved: VerifiedPlaceState = {
            displayName: isFallback
              ? `${BRAND_INFO.name} Studio`
              : found.displayName || BRAND_INFO.name,
            formattedAddress: found.formattedAddress || 'Seven Mile Beach, West Bay, Grand Cayman',
            location: coords,
            rating: found.rating ?? null,
            userRatingCount: found.userRatingCount ?? null,
            googleMapsURI: found.googleMapsURI ?? BRAND_INFO.googleBusinessUrl,
            weekdayDescriptions: found.regularOpeningHours?.weekdayDescriptions ?? undefined,
            isFallbackLocation: isFallback,
          };
          onPlaceResolved(resolved);
          if (map) {
            map.panTo(coords);
            map.setZoom(15);
          }
        } else {
          onPlaceError(
            'Unable to retrieve live map pin details right now. Use the Google Business Profile link below for directions.'
          );
        }
      } catch (err) {
        if (cancelled) return;
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        onPlaceError(
          'Live studio location lookup is temporarily unavailable. You can still open turn-by-turn directions directly in Google Maps.'
        );
      }
    }

    void lookupStudioPlace();

    return () => {
      cancelled = true;
    };
  }, [placesLib, map, onPlaceResolved, onPlaceError]);

  // Compute route using modern Routes API SDK wrapper (Route.computeRoutes)
  useEffect(() => {
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    if (!routesLib || !map || !originQuery || !place?.location) {
      onRouteResolved(null, null, false);
      return;
    }

    let cancelled = false;
    onRouteResolved(null, null, true);

    const request = {
      origin: originQuery,
      destination: place.location,
      travelMode,
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
    };

    const RouteClass = (routesLib as unknown as {
      Route: {
        computeRoutes: (req: Record<string, unknown>) => Promise<{
          routes: Array<{
            distanceMeters?: number;
            durationMillis?: number;
            viewport?: google.maps.LatLngBounds;
            createPolylines: () => google.maps.Polyline[];
          }>;
        }>;
      };
    }).Route;

    RouteClass.computeRoutes(request)
      .then(({ routes }) => {
        if (cancelled) return;
        const primaryRoute = routes?.[0];
        if (!primaryRoute) {
          onRouteResolved(null, 'No route was found from that starting point. Try a nearby Grand Cayman landmark.', false);
          return;
        }

        const newPolylines = primaryRoute.createPolylines();
        newPolylines.forEach((polyline) => {
          polyline.setOptions({
            strokeColor: '#1B4D3E',
            strokeOpacity: 0.92,
            strokeWeight: 5,
          });
          polyline.setMap(map);
        });
        polylinesRef.current = newPolylines;

        if (primaryRoute.viewport) {
          map.fitBounds(primaryRoute.viewport, 60);
        }

        const formatted = formatRouteMetrics(
          primaryRoute.distanceMeters ?? 0,
          primaryRoute.durationMillis ?? 0
        );
        onRouteResolved(formatted, null, false);
      })
      .catch((err) => {
        if (cancelled) return;
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        onRouteResolved(
          null,
          'Route preview could not be calculated right now. You can open full directions directly in Google Maps.',
          false
        );
      });

    return () => {
      cancelled = true;
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [routesLib, map, originQuery, place, travelMode, onRouteResolved]);

  if (!place) return null;

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={place.location}
        title={place.displayName}
        onClick={() => setInfoOpen((prev) => !prev)}
      >
        <Pin background="#1B4D3E" borderColor="#111816" glyphColor="#FFFFFF" scale={1.15} />
      </AdvancedMarker>

      {infoOpen && marker && (
        <InfoWindow
          anchor={marker}
          maxWidth={280}
          onCloseClick={() => setInfoOpen(false)}
        >
          <div className="p-1 text-[#111816] font-sans">
            <p className="font-semibold text-sm leading-snug">{place.displayName}</p>
            <p className="text-xs text-[#4A5552] mt-1 leading-relaxed">{place.formattedAddress}</p>
            {typeof place.rating === 'number' && (
              <p className="text-xs text-[#1B4D3E] font-medium mt-1.5 tabular-nums">
                Rated {place.rating.toFixed(1)}
                {typeof place.userRatingCount === 'number' ? ` (${place.userRatingCount} reviews)` : ''}
              </p>
            )}
            <a
              href={place.googleMapsURI || BRAND_INFO.googleBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#1B4D3E] underline mt-2"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function CustomOriginAutocomplete({
  onSelectOrigin,
}: {
  onSelectOrigin: (origin: string) => void;
}) {
  const placesLib = useMapsLibrary('places');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([]);
  const [open, setOpen] = useState(false);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  useEffect(() => {
    if (!placesLib || query.trim().length < 3) {
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new placesLib.AutocompleteSessionToken();
        }
        const { suggestions: raw } =
          await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: query.trim(),
            sessionToken: sessionTokenRef.current,
            includedRegionCodes: ['ky'],
            language: 'en',
          });
        if (cancelled) return;
        const mapped: AutocompleteItem[] = (raw || [])
          .map((item) => item.placePrediction)
          .filter((pred): pred is google.maps.places.PlacePrediction => Boolean(pred))
          .slice(0, 4)
          .map((pred) => ({
            placeId: pred.placeId,
            label: pred.text.text,
            originValue: pred.text.text,
          }));
        setSuggestions(mapped);
        setOpen(mapped.length > 0);
      } catch (err) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setSuggestions([]);
      }
    }, 260);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [placesLib, query]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSelectOrigin(`${query.trim()}, Grand Cayman`);
    setOpen(false);
    sessionTokenRef.current = null;
  };

  return (
    <form onSubmit={handleManualSubmit} className="relative">
      <label htmlFor="custom-origin-input" className="block text-sm font-medium text-[#111816] mb-2">
        Or enter a starting address in Grand Cayman
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            id="custom-origin-input"
            type="text"
            value={query}
            onChange={(e) => {
              const nextVal = e.target.value;
              setQuery(nextVal);
              if (nextVal.trim().length < 3) {
                setSuggestions([]);
                setOpen(false);
              }
            }}
            onFocus={() => setOpen(suggestions.length > 0)}
            placeholder="Hotel, road, or neighborhood"
            className="w-full bg-white border border-[#D4DAD7] px-3.5 py-2.5 text-sm text-[#111816] placeholder:text-[#6B7672] focus:border-[#1B4D3E] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          aria-label="Calculate route from entered address"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium bg-[#111816] text-white hover:bg-[#1B4D3E] transition-colors duration-200 whitespace-nowrap shrink-0"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          <span>Route</span>
        </button>
      </div>

      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          aria-label="Grand Cayman address suggestions"
          className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#D4DAD7] shadow-md z-20 divide-y divide-[#F1F3F2]"
        >
          {suggestions.map((item) => (
            <li key={item.placeId}>
              <button
                type="button"
                onClick={() => {
                  setQuery(item.label);
                  setOpen(false);
                  sessionTokenRef.current = null;
                  onSelectOrigin(item.originValue);
                }}
                className="w-full text-left px-3.5 py-2.5 text-sm text-[#111816] hover:bg-[#F1F3F2] transition-colors duration-150"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

export function StudioLocationMap() {
  const { mapsApiKey } = useMapsConfig();
  const [place, setPlace] = useState<VerifiedPlaceState | null>(null);
  const [placeError, setPlaceError] = useState<string | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string>('');
  const [selectedOriginLabel, setSelectedOriginLabel] = useState<string>('');
  const [travelMode, setTravelMode] = useState<'DRIVING' | 'WALKING'>('DRIVING');
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'satellite'>('roadmap');
  const [routeMetrics, setRouteMetrics] = useState<FormattedRouteMetrics | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);

  const handlePlaceResolved = useCallback((resolved: VerifiedPlaceState) => {
    setPlace(resolved);
    setPlaceError(null);
  }, []);

  const handlePlaceError = useCallback((msg: string) => {
    setPlaceError(msg);
  }, []);

  const handleRouteResolved = useCallback(
    (metrics: FormattedRouteMetrics | null, err: string | null, loading: boolean) => {
      setRouteMetrics(metrics);
      setRouteError(err);
      setRouteLoading(loading);
    },
    []
  );

  if (!mapsApiKey) {
    return (
      <div className="bg-[#F1F3F2] border border-[#E2E6E4] p-8 md:p-10">
        <div className="max-w-xl">
          <h3 className="font-serif text-2xl text-[#111816] mb-3">
            Studio Location in Grand Cayman
          </h3>
          <p className="text-base text-[#4A5552] leading-relaxed mb-6">
            The interactive navigation map loads once a Google Maps Platform API key is active in
            this environment. You can open the studio directly in Google Maps below.
          </p>
          <a
            href={BRAND_INFO.googleBusinessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium bg-[#1B4D3E] text-white hover:bg-[#143B2F] transition-colors duration-200"
          >
            <span>Open Studio in Google Maps</span>
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={mapsApiKey} language="en" region="KY">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Navigation Controls & Verified Studio Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#F1F3F2] p-6 md:p-8 space-y-5">
            <div>
              <h3 className="font-sans text-base font-semibold text-[#111816]">
                {place ? place.displayName : `${BRAND_INFO.name} Studio`}
              </h3>
              <p className="text-sm text-[#4A5552] mt-1 leading-relaxed flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#1B4D3E] mt-0.5 shrink-0" aria-hidden="true" />
                <span>
                  {place
                    ? place.formattedAddress
                    : 'Retrieving verified studio address from Google Maps...'}
                </span>
              </p>
            </div>

            {place && typeof place.rating === 'number' && (
              <div className="flex items-center gap-2 text-sm text-[#111816] tabular-nums">
                <Star className="w-4 h-4 text-[#1B4D3E] fill-[#1B4D3E]" aria-hidden="true" />
                <span className="font-medium">{place.rating.toFixed(1)} on Google</span>
                {typeof place.userRatingCount === 'number' && (
                  <span className="text-[#4A5552]">· {place.userRatingCount} client reviews</span>
                )}
              </div>
            )}

            {place?.weekdayDescriptions && place.weekdayDescriptions.length > 0 && (
              <div className="pt-4 border-t border-[#D8DFDC]">
                <p className="text-sm font-medium text-[#111816] flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#1B4D3E]" aria-hidden="true" />
                  <span>Studio Hours</span>
                </p>
                <ul className="space-y-1 text-sm text-[#4A5552] tabular-nums">
                  {place.weekdayDescriptions.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-[#D8DFDC] flex flex-wrap items-center gap-5 text-sm">
              <a
                href={BRAND_INFO.phoneHref}
                className="inline-flex items-center gap-2 font-medium text-[#111816] hover:text-[#1B4D3E] transition-colors duration-200 tabular-nums"
              >
                <Phone className="w-4 h-4 text-[#1B4D3E]" aria-hidden="true" />
                <span>{BRAND_INFO.phoneDisplay}</span>
              </a>
              <a
                href={place?.googleMapsURI || BRAND_INFO.googleBusinessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-[#1B4D3E] underline underline-offset-4 hover:text-[#143B2F] transition-colors duration-200"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Local Navigation Route Calculator */}
          <div className="border border-[#E2E6E4] bg-white p-6 md:p-7 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-sans text-base font-semibold text-[#111816] flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#1B4D3E]" aria-hidden="true" />
                <span>Local Route Planner</span>
              </h3>

              {/* Travel Mode Segmented Control */}
              <div
                role="group"
                aria-label="Travel mode"
                className="inline-flex p-0.5 bg-[#F1F3F2] border border-[#E2E6E4]"
              >
                <button
                  type="button"
                  aria-pressed={travelMode === 'DRIVING'}
                  onClick={() => setTravelMode('DRIVING')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                    travelMode === 'DRIVING'
                      ? 'bg-white text-[#111816]'
                      : 'text-[#4A5552] hover:text-[#111816]'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Drive</span>
                </button>
                <button
                  type="button"
                  aria-pressed={travelMode === 'WALKING'}
                  onClick={() => setTravelMode('WALKING')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                    travelMode === 'WALKING'
                      ? 'bg-white text-[#111816]'
                      : 'text-[#4A5552] hover:text-[#111816]'
                  }`}
                >
                  <Footprints className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Walk</span>
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="landmark-select"
                className="block text-sm font-medium text-[#111816] mb-2"
              >
                Quick route from a Grand Cayman landmark
              </label>
              <select
                id="landmark-select"
                value={selectedOrigin}
                onChange={(e) => {
                  const val = e.target.value;
                  const match = CAYMAN_LANDMARKS.find((lm) => lm.originQuery === val);
                  setSelectedOrigin(val);
                  setSelectedOriginLabel(match ? match.name : val);
                }}
                className="w-full bg-white border border-[#D4DAD7] px-3.5 py-2.5 text-sm text-[#111816] focus:border-[#1B4D3E] focus:outline-none"
              >
                <option value="">Select a starting landmark</option>
                {CAYMAN_LANDMARKS.map((landmark) => (
                  <option key={landmark.id} value={landmark.originQuery}>
                    {landmark.name} ({landmark.area})
                  </option>
                ))}
              </select>
            </div>

            <CustomOriginAutocomplete
              onSelectOrigin={(origin) => {
                setSelectedOrigin(origin);
                setSelectedOriginLabel(origin);
              }}
            />

            {routeLoading && (
              <div role="status" className="flex items-center gap-2 text-sm text-[#4A5552] pt-1">
                <Loader2 className="w-4 h-4 animate-spin text-[#1B4D3E]" aria-hidden="true" />
                <span>Calculating route along Grand Cayman...</span>
              </div>
            )}

            {routeError && (
              <p role="alert" className="text-sm text-[#8C2F2B] pt-1">
                {routeError}
              </p>
            )}

            {routeMetrics && !routeLoading && (
              <div
                aria-live="polite"
                className="bg-[#F1F3F2] p-4 border-t-2 border-[#1B4D3E] flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-medium text-[#111816]">
                    From {selectedOriginLabel}
                  </p>
                  <p className="text-sm text-[#4A5552] tabular-nums mt-0.5">
                    {routeMetrics.distanceLabel} · Estimated {routeMetrics.durationLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOrigin('');
                    setSelectedOriginLabel('');
                    setRouteMetrics(null);
                  }}
                  className="text-sm font-medium text-[#1B4D3E] underline underline-offset-4 hover:text-[#143B2F] whitespace-nowrap shrink-0"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Interactive Google Map with explicit height (CF2) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-[#4A5552]">
              Interactive studio map · Drag to explore West Bay and Seven Mile Beach
            </p>
            <div
              role="group"
              aria-label="Map view style"
              className="inline-flex p-0.5 bg-[#F1F3F2] border border-[#E2E6E4]"
            >
              <button
                type="button"
                aria-pressed={mapTypeId === 'roadmap'}
                onClick={() => setMapTypeId('roadmap')}
                className={`px-3 py-1 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  mapTypeId === 'roadmap'
                    ? 'bg-white text-[#111816]'
                    : 'text-[#4A5552] hover:text-[#111816]'
                }`}
              >
                Map
              </button>
              <button
                type="button"
                aria-pressed={mapTypeId === 'satellite'}
                onClick={() => setMapTypeId('satellite')}
                className={`px-3 py-1 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  mapTypeId === 'satellite'
                    ? 'bg-white text-[#111816]'
                    : 'text-[#4A5552] hover:text-[#111816]'
                }`}
              >
                Satellite
              </button>
            </div>
          </div>

          {placeError && (
            <p role="status" className="text-sm text-[#4A5552] bg-[#F1F3F2] px-4 py-3">
              {placeError}
            </p>
          )}

          <div
            data-testid="studio-google-map"
            className="w-full h-[440px] lg:h-[540px] border border-[#E2E6E4] bg-[#ECEFED] overflow-hidden"
          >
            <GoogleMap
              mapId="DEMO_MAP_ID"
              defaultCenter={GRAND_CAYMAN_OVERVIEW}
              defaultZoom={12}
              gestureHandling="greedy"
              streetViewControl={false}
              mapTypeControl={false}
              fullscreenControl={true}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
            >
              <MapCanvasController
                originQuery={selectedOrigin}
                travelMode={travelMode}
                onPlaceResolved={handlePlaceResolved}
                onPlaceError={handlePlaceError}
                onRouteResolved={handleRouteResolved}
                place={place}
                mapTypeId={mapTypeId}
              />
            </GoogleMap>
          </div>
        </div>
      </div>
    </APIProvider>
  );
}
