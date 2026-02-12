// Referrers data

import { MdOpenInNew, MdSearch, MdLink, MdPeople, MdKeyboardArrowRight, MdLaptop, MdPhoneIphone } from 'react-icons/md';
import { BrandIcon } from '@/shared/components/AnalyticsCard/BrandIcon';
import { CountryFlag } from '@/shared/components/AnalyticsCard/CountryFlag';
import { AnalyticsItemData } from '@/shared/components/types';
import { ReactNode } from 'react';



// Helper to generate random values
function randomValue(base: number, variance: number = 0.3): number {
  const min = base * (1 - variance);
  const max = base * (1 + variance);
  return Math.floor(Math.random() * (max - min) + min);
}

export function generateReferrersData(): AnalyticsItemData[] {
  const referrers = [
    { domain: 'google.com', base: 83000, url: 'https://google.com' },
    { domain: 'github.com', base: 15000, url: 'https://github.com' },
    { domain: 'gitlab.com', base: 2000, url: 'https://gitlab.com' },
    { domain: 'youtube.com', base: 8000, url: 'https://youtube.com' },
    { domain: 'reddit.com', base: 5000, url: 'https://reddit.com' },
    { domain: 'twitter.com', base: 4500, url: 'https://twitter.com' },
    { domain: 'instagram.com', base: 3000, url: 'https://instagram.com' },
  ];

  return referrers
    .map(ref => ({
      icon: <BrandIcon domain={ref.domain} />,
      label: ref.domain,
      value: randomValue(ref.base),
      url: ref.url,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

// Channels data
export function generateChannelsData(): AnalyticsItemData[] {
  return [
    {
      icon: <MdLink className="w-4 h-4 text-text-primary" />,
      label: 'Direct',
      value: randomValue(50000),
    },
    {
      icon: <MdSearch className="w-4 h-4 text-text-primary" />,
      label: 'Organic Search',
      value: randomValue(30000),
    },
    {
      icon: <MdOpenInNew className="w-4 h-4 text-text-primary" />,
      label: 'Referral',
      value: randomValue(30000),
    },
    {
      icon: <MdPeople className="w-4 h-4 text-text-primary" />,
      label: 'Social',
      value: randomValue(20000),
    },
  ].sort((a, b) => b.value - a.value);
}

// Pages data
export function generatePagesData(): AnalyticsItemData[] {
  const pages = [
    { path: '/', base: 100000 },
    { path: '/about', base: 15000 },
    { path: '/products', base: 25000 },
    { path: '/contact', base: 8000 },
    { path: '/blog', base: 12000 },
    { path: '/pricing', base: 18000 },
    { path: '/features', base: 9000 },
  ];

  return pages
    .map(page => ({
      label: page.path,
      value: randomValue(page.base),
      url: page.path,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

// Titles data
export function generateTitlesData(): AnalyticsItemData[] {
  const titles = [
    { title: 'Home Page', base: 100000 },
    { title: 'About Us', base: 15000 },
    { title: 'Products & Services', base: 25000 },
    { title: 'Contact Us', base: 8000 },
    { title: 'Blog - Latest News', base: 12000 },
    { title: 'Pricing Plans', base: 18000 },
    { title: 'Features Overview', base: 9000 },
  ];

  return titles
    .map(item => ({
      label: item.title,
      value: randomValue(item.base),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

// Entries data
export function generateEntriesData(): AnalyticsItemData[] {
  const entries = [
    { path: '/', base: 80000 },
    { path: '/products', base: 20000 },
    { path: '/blog', base: 10000 },
    { path: '/pricing', base: 15000 },
  ];

  return entries
    .map(entry => ({
      label: entry.path,
      value: randomValue(entry.base),
    }))
    .sort((a, b) => b.value - a.value);
}

// Exits data
export function generateExitsData(): AnalyticsItemData[] {
  const exits = [
    { path: '/', base: 20000 },
    { path: '/contact', base: 8000 },
    { path: '/pricing', base: 12000 },
    { path: '/checkout', base: 5000 },
  ];

  return exits
    .map(exit => ({
      label: exit.path,
      value: randomValue(exit.base),
    }))
    .sort((a, b) => b.value - a.value);
}

// Browsers data
export function generateBrowsersData(): AnalyticsItemData[] {
  const browsers = [
    { name: 'chrome', label: 'Chrome', base: 100000 },
    { name: 'safari', label: 'Safari', base: 40000 },
    { name: 'firefox', label: 'Firefox', base: 25000 },
    { name: 'edge', label: 'Edge', base: 20000 },
    { name: 'opera', label: 'Opera', base: 5000 },
  ];

  return browsers
    .map(browser => ({
      icon: <BrandIcon domain={browser.name} />,
      label: browser.label,
      value: randomValue(browser.base),
    }))
    .sort((a, b) => b.value - a.value);
}

// Devices data
export function generateDevicesData(): AnalyticsItemData[] {
  return [
    {
      icon: <MdLaptop className="w-4 h-4 text-text-primary" />,
      label: 'Desktop',
      value: randomValue(80000),
    },
    {
      icon: <MdPhoneIphone className="w-4 h-4 text-text-primary rotate-90" />,
      label: 'Mobile',
      value: randomValue(20000),
    },
  ].sort((a, b) => b.value - a.value);
}

// Operating Systems data
export function generateOSData(): AnalyticsItemData[] {
  const systems = [
    { name: 'Windows', base: 50000 },
    { name: 'macOS', base: 30000 },
    { name: 'Linux', base: 8000 },
    { name: 'iOS', base: 15000 },
    { name: 'Android', base: 12000 },
  ];

  return systems
    .map(os => ({
      label: os.name,
      value: randomValue(os.base),
    }))
    .sort((a, b) => b.value - a.value);
}

// Screen Dimensions data
export function generateScreenDimensionsData(): AnalyticsItemData[] {
  const screens = [
    { dimension: '1920x1080', base: 40000 },
    { dimension: '1366x768', base: 30000 },
    { dimension: '1536x864', base: 15000 },
    { dimension: '1440x900', base: 12000 },
    { dimension: '2560x1440', base: 10000 },
  ];

  return screens
    .map(screen => ({
      label: screen.dimension,
      value: randomValue(screen.base),
    }))
    .sort((a, b) => b.value - a.value);
}

// Countries data
export function generateCountriesData(): AnalyticsItemData[] {
  const countries = [
    { code: 'us', name: 'United States', base: 100000 },
    { code: 'gb', name: 'United Kingdom', base: 45000 },
    { code: 'ca', name: 'Canada', base: 30000 },
    { code: 'de', name: 'Germany', base: 25000 },
    { code: 'fr', name: 'France', base: 20000 },
    { code: 'au', name: 'Australia', base: 18000 },
    { code: 'jp', name: 'Japan', base: 15000 },
  ];

  return countries
    .map(country => ({
      icon: <CountryFlag countryCode={country.code} />,
      label: country.name,
      value: randomValue(country.base),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

// Cities data
export function generateCitiesData(): AnalyticsItemData[] {
  const cities = [
    { country: 'us', countryName: 'US', city: 'New York', base: 30000 },
    { country: 'gb', countryName: 'UK', city: 'London', base: 25000 },
    { country: 'au', countryName: 'AU', city: 'Sydney', base: 18000 },
    { country: 'ca', countryName: 'CA', city: 'Toronto', base: 35000 },
    { country: 'de', countryName: 'DE', city: 'Berlin', base: 20000 },
    { country: 'jp', countryName: 'JP', city: 'Tokyo', base: 15000 },
  ];

  return cities
    .map(city => ({
      icon: <CountryFlag countryCode={city.country} />,
      label: (
        <span className="flex items-center gap-1">
          <span>{city.countryName}</span>
          <MdKeyboardArrowRight />
          <span>{city.city}</span>
        </span>
      ) as ReactNode,
      value: randomValue(city.base),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

// Timezones data
export function generateTimezonesData(): AnalyticsItemData[] {
  const timezones = [
    { name: 'America/New_York', base: 40000 },
    { name: 'America/Los_Angeles', base: 35000 },
    { name: 'Europe/London', base: 30000 },
    { name: 'America/Chicago', base: 25000 },
    { name: 'Europe/Paris', base: 20000 },
  ];

  return timezones
    .map(tz => ({
      label: tz.name,
      value: randomValue(tz.base),
    }))
    .sort((a, b) => b.value - a.value);
}

export function generateAllAnalyticsData(totalSessions: number = 800) {
  const raw = {
    Referrers: generateReferrersData(),
    Channels: generateChannelsData(),
    Pages: generatePagesData(),
    Titles: generateTitlesData(),
    Entries: generateEntriesData(),
    Exits: generateExitsData(),
    Browsers: generateBrowsersData(),
    Devices: generateDevicesData(),
    OperatingSystems: generateOSData(),
    ScreenDimensions: generateScreenDimensionsData(),
    Countries: generateCountriesData(),
    Cities: generateCitiesData(),
    Timezones: generateTimezonesData(),
  };

  // scale each category so its items sum to totalSessions
  const scaleItems = (items: AnalyticsItemData[]): AnalyticsItemData[] => {
    const rawTotal = items.reduce((sum, item) => sum + item.value, 0);
    if (rawTotal === 0) return items;
    return items.map(item => ({
      ...item,
      value: Math.round((item.value / rawTotal) * totalSessions),
    }));
  };

  return Object.fromEntries(
    Object.entries(raw).map(([key, items]) => [key, scaleItems(items)])
  ) as typeof raw;
}