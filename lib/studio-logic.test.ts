import test from 'node:test';
import assert from 'node:assert/strict';
import { EDITORIAL_GALLERY, STUDIO_SERVICES } from './studio-data';
import {
  filterGalleryByCategory,
  filterServicesByCategory,
  formatRouteMetrics,
  generateInquiryReference,
  validateContactInquiry,
} from './studio-logic';

test('filterServicesByCategory returns all services or matching subset', () => {
  const all = filterServicesByCategory(STUDIO_SERVICES, 'all');
  assert.equal(all.length, STUDIO_SERVICES.length);

  const trichology = filterServicesByCategory(STUDIO_SERVICES, 'trichology');
  assert.ok(trichology.length > 0);
  assert.ok(trichology.every((s) => s.category === 'trichology'));
});

test('filterGalleryByCategory filters studio and clinic items cleanly', () => {
  const studioItems = filterGalleryByCategory(EDITORIAL_GALLERY, 'studio');
  assert.ok(studioItems.length >= 2);
  assert.ok(studioItems.every((item) => item.category === 'studio'));

  const allItems = filterGalleryByCategory(EDITORIAL_GALLERY, 'all');
  assert.equal(allItems.length, EDITORIAL_GALLERY.length);
});

test('validateContactInquiry flags missing or malformed fields', () => {
  const emptyResult = validateContactInquiry({
    fullName: '',
    email: 'invalid-email',
    phone: '123',
    serviceSlug: '',
    preferredTime: 'Morning',
    message: 'short',
  });

  assert.equal(emptyResult.isValid, false);
  assert.ok(emptyResult.errors.fullName);
  assert.ok(emptyResult.errors.email);
  assert.ok(emptyResult.errors.phone);
  assert.ok(emptyResult.errors.serviceSlug);
  assert.ok(emptyResult.errors.message);
});

test('validateContactInquiry passes with valid customer details', () => {
  const validResult = validateContactInquiry({
    fullName: 'Claire Bennett',
    email: 'claire.bennett@example.com',
    phone: '+1 (345) 555-0192',
    serviceSlug: 'comprehensive-trichology-evaluation',
    preferredTime: 'Morning (9:00 AM - 12:00 PM)',
    message: 'I have been noticing gradual thinning along my part and would like a scalp evaluation.',
  });

  assert.equal(validResult.isValid, true);
  assert.deepEqual(validResult.errors, {});
});

test('formatRouteMetrics formats kilometers, miles, and durations accurately', () => {
  const shortTrip = formatRouteMetrics(4800, 9 * 60 * 1000);
  assert.equal(shortTrip.distanceLabel, '4.8 km (3.0 mi)');
  assert.equal(shortTrip.durationLabel, '9 min');

  const walkClose = formatRouteMetrics(650, 480000);
  assert.equal(walkClose.distanceLabel, '650 m');
  assert.equal(walkClose.durationLabel, '8 min');
});

test('generateInquiryReference creates deterministic date-stamped reference codes', () => {
  const ref = generateInquiryReference(new Date('2026-11-20T12:00:00Z'), 42);
  assert.equal(ref, 'PRM-20261120-1042');
});
