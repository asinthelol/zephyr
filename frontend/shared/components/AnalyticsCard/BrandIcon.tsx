import Image from 'next/image';
import { BrandIconProps } from './types';

export function BrandIcon({ domain, size = 24, className = '' }: BrandIconProps) {
  
  // List of known browsers
  const browsers = [
    'chrome',
    'firefox',
    'safari',
    'edge',
    'opera',
    'brave',
    'vivaldi',
    'arc',
    'ie',
    'internet-explorer',
  ];

  // Normalize domain (remove www, protocols, paths)
  const normalizedDomain = domain
    .toLowerCase()
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .split('/')[0];

  // Check if this is a browser
  const isBrowser = browsers.some(browser => 
    normalizedDomain.includes(browser) || normalizedDomain === browser
  );

  let iconUrl: string;

  if (isBrowser) {

    // Use browser logos CDN for browsers
    const browserName = browsers.find(b => 
      normalizedDomain.includes(b) || normalizedDomain === b
    ) || normalizedDomain;
    iconUrl = `https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/${browserName}/${browserName}.svg`;
  } else {
    
    // Use DuckDuckGo's icon service for websites
    iconUrl = `https://icons.duckduckgo.com/ip3/${normalizedDomain}.ico`;
  }

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
