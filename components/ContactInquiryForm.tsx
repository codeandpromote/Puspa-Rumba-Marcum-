'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { STUDIO_SERVICES } from '@/lib/studio-data';
import {
  validateContactInquiry,
  type ContactInquiryInput,
} from '@/lib/studio-logic';

interface SubmissionConfirmation {
  reference: string;
  summary: {
    fullName: string;
    email: string;
    phone: string;
    serviceTitle: string;
    preferredTime: string;
  };
}

const PREFERRED_WINDOWS = [
  'Morning (9:00 AM - 12:00 PM)',
  'Midday (12:00 PM - 3:00 PM)',
  'Late Afternoon (3:00 PM - 6:00 PM)',
  'Flexible',
];

export function ContactInquiryForm() {
  const searchParams = useSearchParams();
  const initialServiceParam = searchParams.get('service') || '';

  const [formState, setFormState] = useState<ContactInquiryInput>({
    fullName: '',
    email: '',
    phone: '',
    serviceSlug:
      STUDIO_SERVICES.some((s) => s.slug === initialServiceParam)
        ? initialServiceParam
        : STUDIO_SERVICES[0].slug,
    preferredTime: PREFERRED_WINDOWS[0],
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactInquiryInput, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<SubmissionConfirmation | null>(null);

  const updateField = <K extends keyof ContactInquiryInput>(
    field: K,
    value: ContactInquiryInput[K]
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);

    const validation = validateContactInquiry(formState);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setServerError(
            data.error || 'We could not send your request. Please try again or call the studio.'
          );
        }
        return;
      }

      setConfirmation({
        reference: data.reference,
        summary: data.summary,
      });
    } catch {
      setServerError(
        'A network issue interrupted your request. Please try again or call +1 (345) 546-0918.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-[#F1F3F2] border border-[#D4DAD7] p-8 md:p-10 space-y-6"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-[#1B4D3E] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <h3 className="font-serif text-[1.75rem] leading-tight text-[#111816]">
              Consultation request received
            </h3>
            <p className="text-sm text-[#4A5552] tabular-nums">
              Reference {confirmation.reference}
            </p>
          </div>
        </div>

        <p className="text-base text-[#111816] leading-relaxed">
          Thank you, {confirmation.summary.fullName}. Puspa&apos;s studio has received your inquiry
          and will respond within one business day to confirm your appointment window.
        </p>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#D4DAD7] text-sm">
          <div>
            <dt className="text-[#4A5552]">Selected offering</dt>
            <dd className="font-medium text-[#111816] mt-0.5">
              {confirmation.summary.serviceTitle}
            </dd>
          </div>
          <div>
            <dt className="text-[#4A5552]">Preferred window</dt>
            <dd className="font-medium text-[#111816] mt-0.5">
              {confirmation.summary.preferredTime}
            </dd>
          </div>
          <div>
            <dt className="text-[#4A5552]">Email</dt>
            <dd className="font-medium text-[#111816] mt-0.5">{confirmation.summary.email}</dd>
          </div>
          <div>
            <dt className="text-[#4A5552]">Phone</dt>
            <dd className="font-medium text-[#111816] mt-0.5 tabular-nums">
              {confirmation.summary.phone}
            </dd>
          </div>
        </dl>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setConfirmation(null);
              setFormState((prev) => ({ ...prev, message: '' }));
            }}
            className="text-sm font-medium text-[#1B4D3E] underline underline-offset-4 hover:text-[#143B2F] transition-colors duration-150"
          >
            Send another inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact-full-name" className="block text-sm font-medium text-[#111816] mb-2">
            Full name
          </label>
          <input
            id="contact-full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={formState.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'error-full-name' : undefined}
            placeholder="Your full name"
            className={`w-full bg-white border px-4 py-3 text-base text-[#111816] placeholder:text-[#727E7A] focus:outline-none focus:border-[#1B4D3E] ${
              errors.fullName ? 'border-[#A6332E]' : 'border-[#D4DAD7]'
            }`}
          />
          {errors.fullName && (
            <p id="error-full-name" role="alert" className="mt-1.5 text-sm text-[#8C2F2B]">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-[#111816] mb-2">
            Email address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formState.email}
            onChange={(e) => updateField('email', e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'error-email' : undefined}
            placeholder="you@example.com"
            className={`w-full bg-white border px-4 py-3 text-base text-[#111816] placeholder:text-[#727E7A] focus:outline-none focus:border-[#1B4D3E] ${
              errors.email ? 'border-[#A6332E]' : 'border-[#D4DAD7]'
            }`}
          />
          {errors.email && (
            <p id="error-email" role="alert" className="mt-1.5 text-sm text-[#8C2F2B]">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium text-[#111816] mb-2">
            Phone number (optional)
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={formState.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'error-phone' : undefined}
            placeholder="+1 (345) 000-0000"
            className={`w-full bg-white border px-4 py-3 text-base text-[#111816] placeholder:text-[#727E7A] focus:outline-none focus:border-[#1B4D3E] tabular-nums ${
              errors.phone ? 'border-[#A6332E]' : 'border-[#D4DAD7]'
            }`}
          />
          {errors.phone && (
            <p id="error-phone" role="alert" className="mt-1.5 text-sm text-[#8C2F2B]">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-preferred-time" className="block text-sm font-medium text-[#111816] mb-2">
            Preferred appointment time
          </label>
          <select
            id="contact-preferred-time"
            name="preferredTime"
            value={formState.preferredTime}
            onChange={(e) => updateField('preferredTime', e.target.value)}
            className="w-full bg-white border border-[#D4DAD7] px-4 py-3 text-base text-[#111816] focus:outline-none focus:border-[#1B4D3E]"
          >
            {PREFERRED_WINDOWS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contact-service" className="block text-sm font-medium text-[#111816] mb-2">
          Service or consultation focus
        </label>
        <select
          id="contact-service"
          name="serviceSlug"
          value={formState.serviceSlug}
          onChange={(e) => updateField('serviceSlug', e.target.value)}
          aria-invalid={Boolean(errors.serviceSlug)}
          aria-describedby={errors.serviceSlug ? 'error-service' : undefined}
          className={`w-full bg-white border px-4 py-3 text-base text-[#111816] focus:outline-none focus:border-[#1B4D3E] ${
            errors.serviceSlug ? 'border-[#A6332E]' : 'border-[#D4DAD7]'
          }`}
        >
          {STUDIO_SERVICES.map((service) => (
            <option key={service.id} value={service.slug}>
              {service.title} ({service.duration})
            </option>
          ))}
        </select>
        {errors.serviceSlug && (
          <p id="error-service" role="alert" className="mt-1.5 text-sm text-[#8C2F2B]">
            {errors.serviceSlug}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-[#111816] mb-2">
          Tell Puspa about your hair or scalp concerns
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          value={formState.message}
          onChange={(e) => updateField('message', e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'error-message' : undefined}
          placeholder="Share any thinning patterns, scalp sensitivity, styling goals, or preferred dates."
          className={`w-full bg-white border px-4 py-3 text-base text-[#111816] placeholder:text-[#727E7A] focus:outline-none focus:border-[#1B4D3E] resize-y ${
            errors.message ? 'border-[#A6332E]' : 'border-[#D4DAD7]'
          }`}
        />
        {errors.message && (
          <p id="error-message" role="alert" className="mt-1.5 text-sm text-[#8C2F2B]">
            {errors.message}
          </p>
        )}
      </div>

      {serverError && (
        <p role="alert" className="text-sm text-[#8C2F2B] bg-[#FDF2F2] border border-[#EBCACA] px-4 py-3">
          {serverError}
        </p>
      )}

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-[#4A5552]">
          All inquiries remain strictly confidential.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium bg-[#1B4D3E] text-white hover:bg-[#143B2F] disabled:opacity-60 transition-colors duration-200 whitespace-nowrap shrink-0"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
          <span>{submitting ? 'Sending request...' : 'Request Consultation'}</span>
        </button>
      </div>
    </form>
  );
}
