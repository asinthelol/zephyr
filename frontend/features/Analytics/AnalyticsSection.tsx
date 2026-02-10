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
                value: '100K',
                url: 'https://google.com'
              },
              { 
                icon: <BrandIcon domain="github.com" />,
                label: 'github.com', 
                value: '15K',
                url: 'https://github.com'
              },
              { 
                icon: <BrandIcon domain="gitlab.com" />,
                label: 'gitlab.com', 
                value: '2K',
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
                value: '50K'
              },
              {
                icon: <MdSearch className="w-4 h-4 text-text-primary" />,
                label: 'Organic Search',
                value: '30K'
              },
              {
                icon: <MdOpenInNew className="w-4 h-4 text-text-primary" />,
                label: 'Referral',
                value: '30K'
              },
              {
                icon: <MdPeople className="w-4 h-4 text-text-primary" />,
                label: 'Social',
                value: '20K'
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
                value: '100K',
                url: '/'
              },
            ],
            headerLabel: 'Pages',
          },
          Titles: {
            items: [
              { label: 'Home Page', value: '100K' },
            ],
            headerLabel: 'Titles',
          },
          Entries: {
            items: [
              { label: '/', value: '80K' },
            ],
            headerLabel: 'Entries',
          },
          Exits: {
            items: [
              { label: '/', value: '20K' },
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
                value: '100K'
              },
            ],
            headerLabel: 'Browsers',
          },
          Devices: {
            items: [
              {
                icon: <MdLaptop className="w-4 h-4 text-text-primary" />,
                label: 'Desktop',
                value: '80K'
              },
              {
                icon: <MdPhoneIphone className="w-4 h-4 text-text-primary rotate-90" />,
                label: 'Mobile',
                value: '20K'
              },
            ],
            headerLabel: 'Devices',
          },
          'Operating Systems': {
            items: [
              {
                label: 'Windows',
                value: '50K'
              },
              {
                label: 'macOS',
                value: '30K'
              },
            ],
            headerLabel: 'Operating Systems',
          },
          'Screen Dimensions': {
            items: [
              { label: '1920x1080', value: '40K' },
              { label: '1366x768', value: '30K' },
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
                value: '100K'
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
                value: '30K'
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
                value: '25K'
              },
            ],
            headerLabel: 'Cities',
          },
          Timezones: {
            items: [
              { label: 'America/New_York', value: '40K' },
              { label: 'America/Los_Angeles', value: '35K' },
            ],
            headerLabel: 'Timezones',
          },
        }}
      />
    </div>
  );
}
