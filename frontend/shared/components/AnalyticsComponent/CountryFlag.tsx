import Image from 'next/image';

interface CountryFlagProps {
  countryCode: string; // e.g., "us", "gb", "ca"
  height?: number;
  className?: string;
}

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
