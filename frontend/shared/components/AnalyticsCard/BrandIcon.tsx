import Image from 'next/image';
import { BrandIconProps } from './types';

export function BrandIcon({ domain, size = 24, className = '' }: BrandIconProps) {
  
  // Normalize domain (remove www, protocols, paths)
  const normalizedDomain = domain
    .toLowerCase()
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .split('/')[0];

  // Use DuckDuckGo's icon service
  const iconUrl = `https://icons.duckduckgo.com/ip3/${normalizedDomain}.ico`;

  return (
    <Image
      src={iconUrl}
      alt={`${normalizedDomain} icon`}
      width={size}
      height={size}
      className={`${className} rounded`}
      unoptimized
    />
  );
}
