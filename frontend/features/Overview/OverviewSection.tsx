'use client';

import { calculateMetricSummary } from '@/shared/components/Graph/lib/calculateMetricSummary';
import { generateAllMetricsData } from '@/shared/components/Graph/lib/dummyData';
import { OverviewCard } from '@/shared/components/OverviewCard/OverviewCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSelectedCard, OverviewCardType } from '@/store/slices/overviewSlice';
import { useMemo } from 'react';

export function OverviewSection() {
  const dispatch = useAppDispatch();
  const selectedCard = useAppSelector((state) => state.overview.selectedCard);

  // Generate dummy data
  // replace with like = {somebackendApiCall}
  const allMetricsData = useMemo(() => generateAllMetricsData(), []);

  // Calculate summaries for each metric
  const metricSummaries = useMemo(() => {
    const metrics: OverviewCardType[] = [
      'Unique Users',
      'Pageviews',
      'Sessions',
      'Pages per Session',
      'Bounce Rate',
      'Session Duration',
    ];

    return metrics.reduce((acc, metric) => {
      const data = allMetricsData[metric];
      acc[metric] = calculateMetricSummary(data);
      return acc;
    }, {} as Record<OverviewCardType, { total: number; change: number; average: number }>);
  }, [allMetricsData]);

  const handleCardClick = (cardTitle: OverviewCardType) => {
    dispatch(setSelectedCard(cardTitle));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      <OverviewCard
        title="Unique Users"
        value={metricSummaries['Unique Users'].total}
        change={{ value: 5.3, timeframe: 'vs yesterday' }}
        isSelected={selectedCard === 'Unique Users'}
        onClick={() => handleCardClick('Unique Users')}
      />
      <OverviewCard
        title="Pageviews"
        value={metricSummaries['Pageviews'].total}
        change={{ value: 5.3, timeframe: 'vs yesterday' }}
        isSelected={selectedCard === 'Pageviews'}
        onClick={() => handleCardClick('Pageviews')}
      />
      <OverviewCard
        title="Sessions"
        value={metricSummaries['Sessions'].total}
        change={{ value: 5.3, timeframe: 'vs yesterday' }}
        isSelected={selectedCard === 'Sessions'}
        onClick={() => handleCardClick('Sessions')}
      />
      <OverviewCard
        title="Pages per Session"
        value={metricSummaries['Pages per Session'].total}
        change={{ value: 5.3, timeframe: 'vs yesterday' }}
        isSelected={selectedCard === 'Pages per Session'}
        onClick={() => handleCardClick('Pages per Session')}
      />
      <OverviewCard
        title="Bounce Rate"
        value={metricSummaries['Bounce Rate'].total}
        change={{ value: 5.3, timeframe: 'vs yesterday' }}
        isSelected={selectedCard === 'Bounce Rate'}
        onClick={() => handleCardClick('Bounce Rate')}
      />
      <OverviewCard
        title="Session Duration"
        value={metricSummaries['Session Duration'].total}
        change={{ value: 5.3, timeframe: 'vs yesterday' }}
        isSelected={selectedCard === 'Session Duration'}
        onClick={() => handleCardClick('Session Duration')}
      />
    </div>
  );
}
