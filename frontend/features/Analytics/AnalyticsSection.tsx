'use client';

import { AnalyticsCard } from '@/shared/components/AnalyticsCard/AnalyticsCard';
import { useAppSelector } from '@/store/hooks';
import { generateAllAnalyticsData } from '@/shared/components/AnalyticsCard/lib/generators';
import { useMemo } from 'react';

export function AnalyticsSection() {
  const selectedCard = useAppSelector((state) => state.overview.selectedCard);

  // generate dummy data
  // replace with like = {somebackendApiCall}
  const analyticsData = useMemo(() => generateAllAnalyticsData(), []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      
      {/* Referrers Card */}
      <AnalyticsCard
        tabs={['Referrers', 'Channels']}
        defaultTab="Referrers"
        measurementLabel={selectedCard}
        tabData={{
          Referrers: {
           items: analyticsData.Referrers,
            headerLabel: 'Referrers',
          },
          Channels: {
            items: analyticsData.Channels,
            headerLabel: 'Channels',
          },
        }}
      />

      {/* Pages Card */}
      <AnalyticsCard
        tabs={['Pages', 'Titles', 'Entries', 'Exits']}
        defaultTab="Pages"
        measurementLabel={selectedCard}
        tabData={{
          Pages: {
            items: analyticsData.Pages,
            headerLabel: 'Pages',
          },
          Titles: {
            items: analyticsData.Titles,
            headerLabel: 'Titles',
          },
          Entries: {
            items: analyticsData.Entries,
            headerLabel: 'Entries',
          },
          Exits: {
            items: analyticsData.Exits,
            headerLabel: 'Exits',
          },
        }}
      />

      {/* Browsers Card */}
      <AnalyticsCard
        tabs={['Browsers', 'Devices', 'Operating Systems', 'Screen Dimensions']}
        defaultTab="Browsers"
        measurementLabel={selectedCard}
        tabData={{
          Browsers: {
            items: analyticsData.Browsers,
            headerLabel: 'Browsers',
          },
          Devices: {
            items: analyticsData.Devices,
            headerLabel: 'Devices',
          },
          'Operating Systems': {
            items: analyticsData.OperatingSystems,
            headerLabel: 'Operating Systems',
          },
          'Screen Dimensions': {
            items: analyticsData.ScreenDimensions,
            headerLabel: 'Screen Dimensions',
          },
        }}
      />

      {/* Countries Card */}
      <AnalyticsCard
        tabs={['Countries', 'Cities', 'Timezones']}
        defaultTab="Countries"
        measurementLabel={selectedCard}
        tabData={{
          Countries: {
            items: analyticsData.Countries,
            headerLabel: 'Countries',
          },
          Cities: {
            items: analyticsData.Cities,
            headerLabel: 'Cities',
          },
          Timezones: {
            items: analyticsData.Timezones,
            headerLabel: 'Timezones',
          },
        }}
      />
    </div>
  );
}
