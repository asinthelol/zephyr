'use client';

import { AnalyticsCard } from '@/shared/components/AnalyticsCard/AnalyticsCard';
import { BrandIcon } from '@/shared/components/AnalyticsCard/BrandIcon';
import { CountryFlag } from '@/shared/components/AnalyticsCard/CountryFlag';
import { MdOpenInNew, MdSearch, MdLink, MdPeople, MdKeyboardArrowRight, MdLaptop, MdPhoneIphone } from 'react-icons/md';

export function AnalyticsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      
      {/* Referrers Card */}
      <AnalyticsCard
        tabs={['Referrers', 'Channels']}
        defaultTab="Referrers"
        measurementLabel="Unique Users"
        tabData={{
          Referrers: {
            items: [
              { 
                icon: <BrandIcon domain="google.com" />,
                label: 'google.com', 
                value: 83000,
                url: 'https://google.com'
              },
              { 
                icon: <BrandIcon domain="github.com" />,
                label: 'github.com', 
                value: 15000,
                url: 'https://github.com'
              },
              { 
                icon: <BrandIcon domain="gitlab.com" />,
                label: 'gitlab.com', 
                value: 2000,
                url: 'https://gitlab.com'
              },
            ],
            headerLabel: 'Referrers',
          },
          Channels: {
            items: [
              {
                icon: <MdLink className="w-4 h-4 text-text-primary" /> ,
                label: 'Direct',
                value: 50000
              },
              {
                icon: <MdSearch className="w-4 h-4 text-text-primary" />,
                label: 'Organic Search',
                value: 30000
              },
              {
                icon: <MdOpenInNew className="w-4 h-4 text-text-primary" />,
                label: 'Referral',
                value: 30000
              },
              {
                icon: <MdPeople className="w-4 h-4 text-text-primary" />,
                label: 'Social',
                value: 20000
              },
            ],
            headerLabel: 'Channels',
          },
        }}
      />

      {/* Pages Card */}
      <AnalyticsCard
        tabs={['Pages', 'Titles', 'Entries', 'Exits']}
        defaultTab="Pages"
        measurementLabel="Unique Users"
        tabData={{
          Pages: {
            items: [
              { 
                label: '/', 
                value: 100000,
                url: '/'
              },
            ],
            headerLabel: 'Pages',
          },
          Titles: {
            items: [
              { label: 'Home Page', value: 100000 },
            ],
            headerLabel: 'Titles',
          },
          Entries: {
            items: [
              { label: '/', value: 80000 },
            ],
            headerLabel: 'Entries',
          },
          Exits: {
            items: [
              { label: '/', value: 20000 },
            ],
            headerLabel: 'Exits',
          },
        }}
      />

      {/* Browsers Card */}
      <AnalyticsCard
        tabs={['Browsers', 'Devices', 'Operating Systems', 'Screen Dimensions']}
        defaultTab="Browsers"
        measurementLabel="Unique Users"
        tabData={{
          Browsers: {
            items: [
              { 
                icon: <BrandIcon domain="chrome" />,
                label: 'Chrome', 
                value: 100000
              },
            ],
            headerLabel: 'Browsers',
          },
          Devices: {
            items: [
              {
                icon: <MdLaptop className="w-4 h-4 text-text-primary" />,
                label: 'Desktop',
                value: 80000
              },
              {
                icon: <MdPhoneIphone className="w-4 h-4 text-text-primary rotate-90" />,
                label: 'Mobile',
                value: 20000
              },
            ],
            headerLabel: 'Devices',
          },
          'Operating Systems': {
            items: [
              {
                label: 'Windows',
                value: 50000
              },
              {
                label: 'macOS',
                value: 30000
              },
            ],
            headerLabel: 'Operating Systems',
          },
          'Screen Dimensions': {
            items: [
              { label: '1920x1080', value: 40000 },
              { label: '1366x768', value: 30000 },
            ],
            headerLabel: 'Screen Dimensions',
          },
        }}
      />

      {/* Countries Card */}
      <AnalyticsCard
        tabs={['Countries', 'Cities', 'Timezones']}
        defaultTab="Countries"
        measurementLabel="Unique Users"
        tabData={{
          Countries: {
            items: [
              { 
                icon: <CountryFlag countryCode="us" />,
                label: 'United States', 
                value: 100000
              },
            ],
            headerLabel: 'Countries',
          },
          Cities: {
            items: [
              {
                icon: <CountryFlag countryCode="us" />,
                label: (
                  <span className="flex items-center gap-1">
                    <span>US</span>
                    <MdKeyboardArrowRight />
                    <span>New York</span>
                  </span>
                ),
                value: 30000
              },
              {
                icon: <CountryFlag countryCode="us" />,
                label: (
                  <span className="flex items-center gap-1">
                    <span>US</span>
                    <MdKeyboardArrowRight />
                    <span>Los Angeles</span>
                  </span>
                ),
                value: 25000
              },
            ],
            headerLabel: 'Cities',
          },
          Timezones: {
            items: [
              { label: 'America/New_York', value: 40000 },
              { label: 'America/Los_Angeles', value: 35000 },
            ],
            headerLabel: 'Timezones',
          },
        }}
      />
    </div>
  );
}
