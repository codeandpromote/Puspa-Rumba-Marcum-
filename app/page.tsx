import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { EditorialImage } from '@/components/EditorialImage';
import { BRAND_INFO, CONSULTATION_STEPS } from '@/lib/studio-data';

export default function HomePage() {
  return (
    <div className="bg-[#FAFAFA] text-[#111816]">
      {/* Opening Full-Bleed Photographic Hero bleeding to y = 0 */}
      <section
        aria-labelledby="hero-heading"
        className="relative w-full min-h-[100dvh] flex items-end overflow-hidden bg-[#131917]"
      >
        <div className="absolute inset-0">
          <EditorialImage
            src="/images/hero-hair-editorial.jpg"
            alt="Editorial portrait showcasing luminous, healthy dark hair in soft coastal daylight"
            priority
            sizes="100vw"
            className="object-cover object-[72%_center] md:object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#0C1210]/85 via-[#0C1210]/45 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#0C1210]/70 via-transparent to-[#0C1210]/35"
          />
        </div>

        <div className="relative z-10 max-w-[1320px] w-full mx-auto px-6 md:px-10 pt-36 pb-16 md:pb-24">
          <div className="max-w-2xl space-y-6">
            <h1
              id="hero-heading"
              className="font-serif text-[3.1rem] sm:text-[4.25rem] lg:text-[5.25rem] font-normal leading-[0.96] tracking-[-0.03em] text-white"
            >
              Restoring hair health with clinical precision
            </h1>
            <p className="text-base md:text-[1.0625rem] leading-[1.6] text-[#E4EAE7] max-w-[46ch]">
              Certified trichology, restorative scalp therapy, and tailored hair artistry by Puspa
              Rumba-Marcum, WTS in Grand Cayman.
            </p>
            <div className="pt-2">
              <Link
                href="/contact#booking"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-medium bg-white text-[#111816] hover:bg-[#E8ECEA] transition-colors duration-200 whitespace-nowrap"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Two Core Disciplines: Asymmetric Editorial Showcase */}
      <section
        aria-labelledby="disciplines-heading"
        className="max-w-[1320px] mx-auto px-6 md:px-10 py-24 md:py-32"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-14 border-b border-[#E2E6E4]">
          <div className="lg:col-span-7">
            <h2
              id="disciplines-heading"
              className="font-serif text-[2.15rem] md:text-[2.85rem] leading-[1.08] tracking-[-0.025em] text-[#111816]"
            >
              Where scalp science meets calm hair artistry
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pl-6">
            <p className="text-base text-[#4A5552] leading-[1.65]">
              Healthy, lasting volume starts beneath the surface. Every visit pairs diagnostic
              trichology insight with refined styling tailored to Grand Cayman&apos;s coastal
              climate.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pt-14">
          <article className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#ECEFED]">
              <EditorialImage
                src="/images/service-trichology-clinic.jpg"
                alt="Optical trichoscopy instrument and botanical scalp serums arranged on cool limestone"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
            <div className="space-y-3 max-w-[54ch]">
              <p className="text-sm text-[#4A5552]">Clinical Trichology · Scalp Therapy</p>
              <h3 className="text-base font-semibold text-[#111816]">
                Evidence-based answers for thinning, shedding, and scalp sensitivity
              </h3>
              <p className="text-base text-[#4A5552] leading-[1.65]">
                Using magnified optical imaging and individualized care protocols, Puspa identifies
                underlying causes of hair loss and guides clients through realistic, sustainable
                follicle recovery.
              </p>
              <div className="pt-1">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#1B4D3E] hover:text-[#143B2F] underline underline-offset-4 transition-colors duration-150"
                >
                  <span>Explore all treatments</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>

          <article className="lg:col-span-5 lg:mt-16 space-y-6">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#ECEFED]">
              <EditorialImage
                src="/images/service-hair-artistry.jpg"
                alt="Precision-cut glossy brunette hair styled with natural fullness against pale plaster"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-[#4A5552]">Hair Artistry · Scalp-Safe Color</p>
              <h3 className="text-base font-semibold text-[#111816]">
                Precision cutting and gentle color built for delicate hair
              </h3>
              <p className="text-base text-[#4A5552] leading-[1.65]">
                Architectural shapes and low-irritation glosses create effortless fullness and shine
                without putting mechanical or chemical strain on recovering follicles.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Architectural Studio Environment + Sequential Consultation Process */}
      <section aria-labelledby="process-heading" className="bg-[#F1F3F2] py-24 md:py-32">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 space-y-16">
          <div className="relative aspect-[16/9] max-h-[580px] w-full overflow-hidden bg-[#E2E6E4]">
            <EditorialImage
              src="/images/studio-seafire-interior.jpg"
              alt="Sunlit minimalist private hair studio with pale limestone counter, oak chair, and sheer white curtains"
              sizes="(max-width: 1320px) 100vw, 1320px"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-6">
              <h2
                id="process-heading"
                className="font-serif text-[2.15rem] md:text-[2.85rem] leading-[1.08] tracking-[-0.025em] text-[#111816]"
              >
                A calm, methodical path back to fuller hair
              </h2>
            </div>
            <div className="lg:col-span-6">
              <p className="text-base text-[#4A5552] leading-[1.65] max-w-[56ch]">
                Appointments take place one-on-one in a quiet, private suite along Seven Mile Beach,
                giving you unhurried time to understand your scalp and build a plan you can follow.
              </p>
            </div>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-8 border-t border-[#D8DFDC]">
            {CONSULTATION_STEPS.map((step) => (
              <li key={step.stepNumber} className="space-y-3">
                <p className="text-sm font-medium text-[#1B4D3E] tabular-nums">
                  Step {step.stepNumber}
                </p>
                <h3 className="text-base font-semibold text-[#111816]">{step.title}</h3>
                <p className="text-base text-[#4A5552] leading-[1.65]">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* About Puspa Rumba-Marcum Preview */}
      <section
        aria-labelledby="about-preview-heading"
        className="max-w-[1320px] mx-auto px-6 md:px-10 py-24 md:py-32"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#ECEFED]">
              <EditorialImage
                src="/images/about-puspa-portrait.jpg"
                alt="Portrait of Puspa Rumba-Marcum, WTS in a dark eucalyptus linen jacket inside her studio"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <p className="text-sm text-[#4A5552]">
              {BRAND_INFO.credentials} · {BRAND_INFO.region}
            </p>
            <h2
              id="about-preview-heading"
              className="font-serif text-[2.15rem] md:text-[2.85rem] leading-[1.08] tracking-[-0.025em] text-[#111816]"
            >
              More than fifteen years caring for Cayman&apos;s hair and scalp health
            </h2>
            <p className="text-base text-[#4A5552] leading-[1.65] max-w-[60ch]">
              Originally from Nuwakot, Nepal and a Grand Cayman resident since 2009, Puspa
              Rumba-Marcum earned certification through the World Trichology Society after noticing
              how many salon clients quietly struggled with thinning hair and scalp irritation
              without clear guidance.
            </p>
            <p className="text-base text-[#4A5552] leading-[1.65] max-w-[60ch]">
              Drawing on years of hands-on artistry at leading Cayman spas and her dedicated clinical
              training, she bridges compassionate listening with measurable follicle care.
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#1B4D3E] hover:text-[#143B2F] underline underline-offset-4 transition-colors duration-150"
              >
                <span>Read Puspa&apos;s story and credentials</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Visit & Consultation Band */}
      <section
        aria-labelledby="closing-cta-heading"
        className="border-t border-[#E2E6E4] bg-white py-20 md:py-24"
      >
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <h2
              id="closing-cta-heading"
              className="font-serif text-[2.15rem] md:text-[2.85rem] leading-[1.08] tracking-[-0.025em] text-[#111816]"
            >
              Begin with a private scalp and hair consultation
            </h2>
            <p className="text-base text-[#4A5552] leading-[1.65]">
              Request your appointment online, call directly at{' '}
              <a
                href={BRAND_INFO.phoneHref}
                className="text-[#111816] font-medium underline underline-offset-4 tabular-nums"
              >
                {BRAND_INFO.phoneDisplay}
              </a>
              , or plan your drive to the Seven Mile Beach studio with our interactive map.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-medium bg-[#1B4D3E] text-white hover:bg-[#143B2F] transition-colors duration-200 whitespace-nowrap"
            >
              <span>Schedule and Get Directions</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
