import { NextRequest, NextResponse } from 'next/server';
import {
  generateInquiryReference,
  validateContactInquiry,
  type ContactInquiryInput,
} from '@/lib/studio-logic';
import { STUDIO_SERVICES } from '@/lib/studio-data';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<ContactInquiryInput>;
    const payload: ContactInquiryInput = {
      fullName: typeof body.fullName === 'string' ? body.fullName : '',
      email: typeof body.email === 'string' ? body.email : '',
      phone: typeof body.phone === 'string' ? body.phone : '',
      serviceSlug: typeof body.serviceSlug === 'string' ? body.serviceSlug : '',
      preferredTime: typeof body.preferredTime === 'string' ? body.preferredTime : 'Flexible',
      message: typeof body.message === 'string' ? body.message : '',
    };

    const validation = validateContactInquiry(payload);
    if (!validation.isValid) {
      return NextResponse.json(
        { ok: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const matchedService = STUDIO_SERVICES.find((s) => s.slug === payload.serviceSlug);
    const reference = generateInquiryReference();

    return NextResponse.json({
      ok: true,
      reference,
      receivedAt: new Date().toISOString(),
      summary: {
        fullName: payload.fullName.trim(),
        email: payload.email.trim(),
        phone: payload.phone.trim() || 'Not provided',
        serviceTitle: matchedService ? matchedService.title : payload.serviceSlug,
        preferredTime: payload.preferredTime.trim() || 'Flexible',
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Unable to process your inquiry right now. Please try again or call the studio directly.' },
      { status: 500 }
    );
  }
}
