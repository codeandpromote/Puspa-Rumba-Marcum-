import type {
  GalleryCategory,
  GalleryItem,
  ServiceCategory,
  StudioService,
} from './studio-data';

export interface ContactInquiryInput {
  fullName: string;
  email: string;
  phone: string;
  serviceSlug: string;
  preferredTime: string;
  message: string;
}

export interface ContactValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof ContactInquiryInput, string>>;
}

export interface FormattedRouteMetrics {
  distanceLabel: string;
  durationLabel: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_DIGIT_MIN = 7;

export function filterServicesByCategory(
  services: StudioService[],
  category: ServiceCategory | 'all'
): StudioService[] {
  if (category === 'all') {
    return services;
  }
  return services.filter((service) => service.category === category);
}

export function filterGalleryByCategory(
  items: GalleryItem[],
  category: GalleryCategory | 'all'
): GalleryItem[] {
  if (category === 'all') {
    return items;
  }
  return items.filter((item) => item.category === category);
}

export function validateContactInquiry(
  input: ContactInquiryInput
): ContactValidationResult {
  const errors: Partial<Record<keyof ContactInquiryInput, string>> = {};

  const fullName = input.fullName.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  const message = input.message.trim();

  if (fullName.length < 2) {
    errors.fullName = 'Please enter your full name.';
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (phone.length > 0) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < PHONE_DIGIT_MIN) {
      errors.phone = 'Please enter a complete phone number with area code.';
    }
  }

  if (!input.serviceSlug || input.serviceSlug.trim().length === 0) {
    errors.serviceSlug = 'Please choose the service you are inquiring about.';
  }

  if (message.length < 10) {
    errors.message = 'Please share a brief note about your hair or scalp goals (at least 10 characters).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatRouteMetrics(
  distanceMeters: number,
  durationMillis: number
): FormattedRouteMetrics {
  const safeMeters = Number.isFinite(distanceMeters) && distanceMeters >= 0 ? distanceMeters : 0;
  const safeMillis = Number.isFinite(durationMillis) && durationMillis >= 0 ? durationMillis : 0;

  const km = safeMeters / 1000;
  const miles = km * 0.621371;
  const distanceLabel =
    km < 1
      ? `${Math.round(safeMeters)} m`
      : `${km.toFixed(1)} km (${miles.toFixed(1)} mi)`;

  const totalMinutes = Math.max(1, Math.round(safeMillis / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  const durationLabel =
    hours > 0
      ? `${hours} hr ${remainingMinutes} min`
      : `${totalMinutes} min`;

  return {
    distanceLabel,
    durationLabel,
  };
}

export function generateInquiryReference(date: Date = new Date(), seed?: number): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const codeNum =
    typeof seed === 'number'
      ? Math.abs(Math.floor(seed)) % 9000 + 1000
      : Math.floor(1000 + Math.random() * 9000);
  return `PRM-${yyyy}${mm}${dd}-${codeNum}`;
}
