import Image from 'next/image';
import { CountryFlagProps } from '@/shared/components/types';

export function CountryFlag({
  countryCode,
  height = 24,
  className = '',
}: CountryFlagProps) {
  // Normalize country code to lowercase
  const normalizedCode = countryCode.toLowerCase().trim();

  // Use for country flags
  const flagUrl = `https://flagcdn.com/${normalizedCode}.svg`;

  return (
    <Image
      src={flagUrl}
      alt={`${countryCode} flag`}
      width={0}
      height={0}
      sizes="auto"
      className={`${className} h-4 w-auto`}
      unoptimized
    />
  );
}
