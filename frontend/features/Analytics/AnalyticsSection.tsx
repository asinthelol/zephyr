'use client';

import { AnalyticsCard } from '@/shared/components/AnalyticsCard/AnalyticsCard';
import { useAppSelector } from '@/store/hooks';
import { generateAllAnalyticsData } from '@/shared/components/AnalyticsCard/lib/generators';
import { generateAllMetricsData } from '@/shared/components/Graph/lib/dummyData';
import { calculateMetricSummary } from '@/shared/components/Graph/lib/calculateMetricSummary';
import { useState, useEffect, useMemo } from 'react';

export function AnalyticsSection() {
  const selectedCard = useAppSelector((state) => state.overview.selectedCard);
  const calendarDate = useAppSelector((state) => state.calendar.selectedDate);
  const calendarTimeframe = useAppSelector((state) => state.calendar.selectedTimeframe);
  const [isClient, setIsClient] = useState(false);

  // generate dummy data
  const sessionsTotal = useMemo(() => {
    if (!isClient) return 0;
    const metricsData = generateAllMetricsData('hour', calendarTimeframe, new Date(calendarDate));
    return calculateMetricSummary(metricsData['Sessions']).total;
  }, [isClient, calendarDate, calendarTimeframe]);
  
  const analyticsData = useMemo(() => {
    if (!isClient) return null;
    return generateAllAnalyticsData(sessionsTotal);
  }, [isClient, sessionsTotal]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!analyticsData) {
    return <div className="h-64" />; // Placeholder during SSR
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      
      {/* Referrers Card */}
      <AnalyticsCard
        tabs={['Referrers', 'Channels']}
        defaultTab="Referrers"
        measurementLabel="Sessions"
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
        measurementLabel="Sessions"
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
        measurementLabel="Sessions"
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
        measurementLabel="Sessions"
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
