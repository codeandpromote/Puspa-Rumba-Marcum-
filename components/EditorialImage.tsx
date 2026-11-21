'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallbackLabel?: string;
}

export function EditorialImage({
  src,
  alt,
  className = 'object-cover',
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  fallbackLabel,
}: EditorialImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full bg-[#E8ECEA] text-[#4A5552] flex flex-col items-center justify-center p-6 text-center"
      >
        <ImageOff className="w-6 h-6 mb-2 text-[#1B4D3E]" aria-hidden="true" />
        <span className="text-sm font-medium">{fallbackLabel || alt}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
