export type ServiceCategory = 'trichology' | 'scalp' | 'artistry';

export interface StudioService {
  id: string;
  slug: string;
  category: ServiceCategory;
  categoryLabel: string;
  title: string;
  duration: string;
  summary: string;
  details: string;
  idealFor: string;
  image: string;
  imageAlt: string;
}

export interface ConsultationStep {
  stepNumber: string;
  title: string;
  description: string;
}

export interface StudioFaq {
  id: string;
  question: string;
  answer: string;
}

export type GalleryCategory = 'artistry' | 'clinic' | 'studio';

export interface GalleryItem {
  id: string;
  category: GalleryCategory;
  categoryLabel: string;
  title: string;
  caption: string;
  image: string;
  alt: string;
  aspect: 'wide' | 'portrait' | 'landscape';
}

export interface LocalLandmark {
  id: string;
  name: string;
  originQuery: string;
  area: string;
}

export const BRAND_INFO = {
  name: 'Puspa Rumba-Marcum',
  credentials: 'WTS Certified Trichologist',
  tagline: 'Hair Loss Specialist, Hairstylist and Certified Trichologist',
  region: 'Grand Cayman, Cayman Islands',
  phoneDisplay: '+1 (345) 546-0918',
  phoneHref: 'tel:+13455460918',
  instagramHandle: '@puspasstyle.ky',
  instagramUrl: 'https://www.instagram.com/puspasstyle.ky/',
  linkedinUrl: 'https://ky.linkedin.com/in/puspa-rumba-marcum-wts-7572194a',
  googleBusinessUrl: 'https://share.google/EJLx8JouNMxNsoo3W',
  placeSearchQuery: 'Puspa Rumba-Marcum Hair Loss Specialist Hairstylist Trichologist Cayman Islands',
  fallbackLocationQuery: '60 Tanager Way, West Bay, Cayman Islands',
};

export const STUDIO_SERVICES: StudioService[] = [
  {
    id: 'srv-trichology-eval',
    slug: 'comprehensive-trichology-evaluation',
    category: 'trichology',
    categoryLabel: 'Clinical Trichology',
    title: 'Comprehensive Hair Loss Evaluation',
    duration: '75 min',
    summary:
      'A private diagnostic session examining follicle density, hair shaft integrity, and scalp micro-circulation to identify the root cause of shedding or thinning.',
    details:
      'Using high-magnification optical trichoscopy alongside a detailed health, nutrition, and styling history, Puspa evaluates patterns of androgenetic alopecia, telogen effluvium, traction stress, and scalp inflammation. You leave with a written care protocol tailored to your biology and island climate.',
    idealFor: 'Noticeable thinning, sudden shedding, widening parts, or persistent scalp discomfort.',
    image: '/images/service-trichology-clinic.jpg',
    imageAlt: 'Optical trichoscopy instrument and botanical scalp serums arranged on pale limestone',
  },
  {
    id: 'srv-follicle-restoration',
    slug: 'follicle-restoration-program',
    category: 'trichology',
    categoryLabel: 'Clinical Trichology',
    title: 'Targeted Follicle Restoration Plan',
    duration: '60 min',
    summary:
      'Structured multi-visit restoration therapy designed to calm follicular inflammation, clear Sebum buildup, and support healthier density cycles.',
    details:
      'Follow-up clinical sessions track follicle progress with comparative scalp imaging, customized topical formulations, and gentle circulation techniques. Progress is reviewed every six to eight weeks so adjustments remain evidence-based.',
    idealFor: 'Clients working through postpartum shedding, stress-related thinning, or long-term density recovery.',
    image: '/images/gallery-scalp-ritual.jpg',
    imageAlt: 'Botanical scalp oil vial, wooden comb, and ceramic bowl in natural morning light',
  },
  {
    id: 'srv-scalp-detox',
    slug: 'therapeutic-scalp-renewal',
    category: 'scalp',
    categoryLabel: 'Scalp Therapy',
    title: 'Therapeutic Scalp Renewal Treatment',
    duration: '60 min',
    summary:
      'Deep follicular cleansing and soothing botanical infusion formulated for sensitive, flaky, sun-exposed, or humidity-stressed scalps.',
    details:
      'Tropical humidity, salt water, and product residue can quietly congest follicles. This calming session combines gentle enzymatic exfoliation, warm steam hydration, targeted lymphatic scalp massage, and barrier-restoring serums.',
    idealFor: 'Dryness, itchiness, buildup, post-travel recovery, or preventative scalp maintenance.',
    image: '/images/gallery-scalp-ritual.jpg',
    imageAlt: 'Restorative scalp treatment tools and botanical oil on cool grey stone',
  },
  {
    id: 'srv-scalp-barrier',
    slug: 'soothing-barrier-therapy',
    category: 'scalp',
    categoryLabel: 'Scalp Therapy',
    title: 'Sensitive Scalp Barrier Care',
    duration: '50 min',
    summary:
      'Restorative hydration therapy that calms redness, tightness, and reactivity without heavy oils or synthetic fragrance.',
    details:
      'Designed specifically for delicate or chemically fatigued scalps, this treatment restores pH balance and moisture retention while leaving hair weightless, soft, and easy to style.',
    idealFor: 'Scalp sensitivity after color services, dry flaking, or environmental irritation.',
    image: '/images/service-trichology-clinic.jpg',
    imageAlt: 'Clinical botanical scalp serums and folded cotton linen in morning daylight',
  },
  {
    id: 'srv-precision-cut',
    slug: 'precision-haircut-and-finish',
    category: 'artistry',
    categoryLabel: 'Hair Artistry',
    title: 'Tailored Haircut and Natural Finish',
    duration: '60 min',
    summary:
      'Architectural cutting shaped around your hair density, growth patterns, and daily routine so styles fall cleanly even in coastal humidity.',
    details:
      'Every haircut begins with an assessment of natural texture and crown density. Puspa cuts to create balanced movement and natural fullness without over-thinning fragile strands, finishing with low-tension styling.',
    idealFor: 'Fine or thinning hair seeking natural volume, effortless daily manageability, and healthy ends.',
    image: '/images/service-hair-artistry.jpg',
    imageAlt: 'Precision-cut glossy brunette hair styled with natural movement in soft daylight',
  },
  {
    id: 'srv-conscious-color',
    slug: 'scalp-safe-color-and-gloss',
    category: 'artistry',
    categoryLabel: 'Hair Artistry',
    title: 'Scalp-Conscious Color and Gloss',
    duration: '120 min',
    summary:
      'Dimensional color and shine treatments formulated with gentle application techniques that protect the scalp barrier and hair shaft.',
    details:
      'Many clients experiencing thinning worry that coloring their hair is no longer possible. Puspa selects low-irritation pigments and off-scalp placement methods paired with bond-supporting masks to preserve luster and strength.',
    idealFor: 'Grey blending, luminous dimension, and shine renewal with minimal scalp stress.',
    image: '/images/hero-hair-editorial.jpg',
    imageAlt: 'Luminous healthy dark hair catching soft natural daylight in editorial profile',
  },
];

export const CONSULTATION_STEPS: ConsultationStep[] = [
  {
    stepNumber: '01',
    title: 'Microscopic Scalp Assessment',
    description:
      'Every restoration journey begins with unhurried listening, a thorough review of lifestyle and medical factors, and magnified scalp imaging to see clearly what is happening at the follicle.',
  },
  {
    stepNumber: '02',
    title: 'Tailored Restoration Protocol',
    description:
      'Rather than offering generic routines, Puspa builds a practical plan combining in-studio scalp therapy, targeted home care, and gentle styling habits suited to Grand Cayman weather.',
  },
  {
    stepNumber: '03',
    title: 'Measured Progress and Artistry',
    description:
      'Follow-up evaluations track density and scalp comfort over time while precision haircuts and low-stress finishing help you feel confident at every stage of recovery.',
  },
];

export const STUDIO_FAQS: StudioFaq[] = [
  {
    id: 'faq-trichologist',
    question: 'What does a Certified Trichologist do differently from a standard salon visit?',
    answer:
      'A Certified Trichologist trained through the World Trichology Society studies the biology and disorders of the hair and scalp. While a traditional salon focuses primarily on outward appearance, Puspa combines diagnostic scalp analysis with seasoned hairstyling expertise so both follicle health and visual confidence are cared for together.',
  },
  {
    id: 'faq-prepare',
    question: 'How should I prepare for my first hair loss consultation?',
    answer:
      'Please avoid washing your hair for 24 to 48 hours before your evaluation and skip dry shampoos, root powders, or heavy styling oils on the day of your visit. This allows the optical scope to observe your natural scalp condition accurately. Bringing a list of current supplements or recent bloodwork notes can also be helpful.',
  },
  {
    id: 'faq-timeline',
    question: 'How soon do clients typically notice improvements in scalp comfort and density?',
    answer:
      'Scalp comfort, reduced tightness, and cleaner follicular balance are often noticeable after the first therapeutic treatment. Because hair grows in biological cycles, visible changes in shedding stability and new hair density typically develop over three to six months of consistent care.',
  },
  {
    id: 'faq-booking',
    question: 'Are appointments private and available to both residents and visitors in Grand Cayman?',
    answer:
      'Yes. All trichology consultations and studio appointments are conducted one-on-one in a calm, discreet setting along Seven Mile Beach. Both Grand Cayman residents and international visitors staying on the island are welcome to book.',
  },
];

export const EDITORIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    category: 'artistry',
    categoryLabel: 'Hair Artistry',
    title: 'Luminous Density and Natural Movement',
    caption: 'Low-tension styling and cuticle care that preserve natural shine in coastal air.',
    image: '/images/hero-hair-editorial.jpg',
    alt: 'Editorial profile of glossy healthy dark hair in soft coastal light',
    aspect: 'wide',
  },
  {
    id: 'gal-2',
    category: 'clinic',
    categoryLabel: 'Scalp and Clinic',
    title: 'Diagnostic Trichoscopy Suite',
    caption: 'Magnified scalp imaging paired with clean botanical formulations.',
    image: '/images/service-trichology-clinic.jpg',
    alt: 'Optical scalp scope and numbered glass serum droppers on pale limestone counter',
    aspect: 'landscape',
  },
  {
    id: 'gal-3',
    category: 'artistry',
    categoryLabel: 'Hair Artistry',
    title: 'Architectural Shoulder-Length Cut',
    caption: 'Soft internal layering tailored to enhance fullness without thinning fragile ends.',
    image: '/images/service-hair-artistry.jpg',
    alt: 'Woman with precision-cut healthy brunette lob against pale plaster wall',
    aspect: 'landscape',
  },
  {
    id: 'gal-4',
    category: 'studio',
    categoryLabel: 'Studio Space',
    title: 'Quiet Daylight Along Seven Mile Beach',
    caption: 'A private, uncluttered studio designed for calm one-on-one consultations.',
    image: '/images/studio-seafire-interior.jpg',
    alt: 'Minimalist sunlit hair studio with limestone counter, oak styling chair, and sheer white curtains',
    aspect: 'wide',
  },
  {
    id: 'gal-5',
    category: 'clinic',
    categoryLabel: 'Scalp and Clinic',
    title: 'Botanical Scalp Renewal Ritual',
    caption: 'Natural wooden detangling tools and soothing plant oils prepared fresh for each session.',
    image: '/images/gallery-scalp-ritual.jpg',
    alt: 'Ceramic bowl, amber botanical scalp oil, wooden comb, and folded linen towel on travertine',
    aspect: 'landscape',
  },
  {
    id: 'gal-6',
    category: 'studio',
    categoryLabel: 'Studio Space',
    title: 'Puspa Rumba-Marcum, WTS',
    caption: 'Over fifteen years caring for hair and scalp health in the Cayman Islands.',
    image: '/images/about-puspa-portrait.jpg',
    alt: 'Portrait of Puspa Rumba-Marcum in a tailored dark green linen blazer inside her sunlit studio',
    aspect: 'portrait',
  },
];

export const CAYMAN_LANDMARKS: LocalLandmark[] = [
  {
    id: 'lm-camana-bay',
    name: 'Camana Bay',
    originQuery: 'Camana Bay, Grand Cayman, Cayman Islands',
    area: 'Seven Mile Beach Corridor',
  },
  {
    id: 'lm-airport',
    name: 'Owen Roberts Airport (GCM)',
    originQuery: 'Owen Roberts International Airport, Grand Cayman, Cayman Islands',
    area: 'George Town',
  },
  {
    id: 'lm-george-town',
    name: 'George Town Harbour',
    originQuery: 'George Town, Grand Cayman, Cayman Islands',
    area: 'Central District',
  },
  {
    id: 'lm-west-bay',
    name: 'West Bay Public Beach',
    originQuery: 'West Bay Public Beach, Grand Cayman, Cayman Islands',
    area: 'West Bay',
  },
];
