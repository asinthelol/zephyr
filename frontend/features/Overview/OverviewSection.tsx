'use client';

import { calculateMetricSummary } from '@/shared/components/Graph/lib/calculateMetricSummary';
import { generateAllMetricsData } from '@/shared/components/Graph/lib/dummyData';
import { OverviewCard } from '@/shared/components/OverviewCard/OverviewCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSelectedCard, OverviewCardType } from '@/store/slices/overviewSlice';
import { useState, useEffect, useMemo } from 'react';

export function OverviewSection() {
  const dispatch = useAppDispatch();
  const selectedCard = useAppSelector((state) => state.overview.selectedCard);
  const calendarDate = useAppSelector((state) => state.calendar.selectedDate);
  const calendarTimeframe = useAppSelector((state) => state.calendar.selectedTimeframe);
  const [isClient, setIsClient] = useState(false);

  // generate dummy data
  const allMetricsData = useMemo(() => {
    if (!isClient) return null;
    return generateAllMetricsData('hour', calendarTimeframe, new Date(calendarDate));
  }, [isClient, calendarDate, calendarTimeframe]);

  // generate previous period data for comparison
  const prevMetricsData = useMemo(() => {
    if (!isClient) return null;
    const prevDate = getPreviousPeriodDate(calendarTimeframe, new Date(calendarDate));
    return generateAllMetricsData('hour', calendarTimeframe, prevDate);
  }, [isClient, calendarDate, calendarTimeframe]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // calculate summaries for current and previous periods
  const metricSummaries = useMemo(() => {
    if (!allMetricsData || !prevMetricsData) return null;
    
    const metrics: OverviewCardType[] = [
      'Unique Users',
      'Pageviews',
      'Sessions',
      'Pages per Session',
      'Bounce Rate',
      'Session Duration',
    ];

    return metrics.reduce((acc, metric) => {
      const current = calculateMetricSummary(allMetricsData[metric]);
      const previous = calculateMetricSummary(prevMetricsData[metric]);
      acc[metric] = { current, previous };
      return acc;
    }, {} as Record<OverviewCardType, { current: { total: number; change: number; average: number }; previous: { total: number; change: number; average: number } }>);
  }, [allMetricsData, prevMetricsData]);

  if (!metricSummaries) {
    return <div className="h-24" />; // Placeholder during SSR
  }

  const handleCardClick = (cardTitle: OverviewCardType) => {
    dispatch(setSelectedCard(cardTitle));
  };

  const comparisonLabel = getComparisonLabel(calendarTimeframe);

  // helper to calculate % change between current and previous period
  const getChange = (metric: OverviewCardType, useAverage: boolean = false) => {
    const currentVal = useAverage ? metricSummaries[metric].current.average : metricSummaries[metric].current.total;
    const previousVal = useAverage ? metricSummaries[metric].previous.average : metricSummaries[metric].previous.total;
    if (previousVal === 0) return 0;
    return parseFloat((((currentVal - previousVal) / previousVal) * 100).toFixed(1));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      <OverviewCard
        title="Unique Users"
        value={metricSummaries['Unique Users'].current.total}
        change={{ value: getChange('Unique Users'), timeframe: comparisonLabel }}
        isSelected={selectedCard === 'Unique Users'}
        onClick={() => handleCardClick('Unique Users')}
      />
      <OverviewCard
        title="Pageviews"
        value={metricSummaries['Pageviews'].current.total}
        change={{ value: getChange('Pageviews'), timeframe: comparisonLabel }}
        isSelected={selectedCard === 'Pageviews'}
        onClick={() => handleCardClick('Pageviews')}
      />
      <OverviewCard
        title="Sessions"
        value={metricSummaries['Sessions'].current.total}
        change={{ value: getChange('Sessions'), timeframe: comparisonLabel }}
        isSelected={selectedCard === 'Sessions'}
        onClick={() => handleCardClick('Sessions')}
      />
      <OverviewCard
        title="Pages per Session"
        value={metricSummaries['Pages per Session'].current.average}
        change={{ value: getChange('Pages per Session', true), timeframe: comparisonLabel }}
        isSelected={selectedCard === 'Pages per Session'}
        onClick={() => handleCardClick('Pages per Session')}
      />
      <OverviewCard
        title="Bounce Rate"
        value={metricSummaries['Bounce Rate'].current.average}
        change={{ value: getChange('Bounce Rate', true), timeframe: comparisonLabel }}
        isSelected={selectedCard === 'Bounce Rate'}
        isPercentage={true}
        onClick={() => handleCardClick('Bounce Rate')}
      />
      <OverviewCard
        title="Session Duration"
        value={metricSummaries['Session Duration'].current.average}
        change={{ value: getChange('Session Duration', true), timeframe: comparisonLabel }}
        isSelected={selectedCard === 'Session Duration'}
        onClick={() => handleCardClick('Session Duration')}
      />
    </div>
  );
}

// Get the anchor date for the previous equivalent period
function getPreviousPeriodDate(timeframe: string, currentDate: Date): Date {
  const prev = new Date(currentDate);
  switch (timeframe) {
    case 'today':
      prev.setDate(prev.getDate() - 1);
      break;
    case 'last3days':
      prev.setDate(prev.getDate() - 3);
      break;
    case 'last7days':
      prev.setDate(prev.getDate() - 7);
      break;
    case 'thisweek':
      prev.setDate(prev.getDate() - 7);
      break;
    case 'last14days':
      prev.setDate(prev.getDate() - 14);
      break;
    case 'last30days':
      prev.setDate(prev.getDate() - 30);
      break;
    case 'last60days':
      prev.setDate(prev.getDate() - 60);
      break;
    case 'thismonth':
      prev.setMonth(prev.getMonth() - 1);
      break;
    case 'thisyear':
      prev.setFullYear(prev.getFullYear() - 1);
      break;
    case 'last30min':
    case 'last1hour':
    case 'last6hours':
    case 'last24hours':

      // for time-based, shift back by same duration
      const hoursMap: Record<string, number> = {
        last30min: 0.5,
        last1hour: 1,
        last6hours: 6,
        last24hours: 24,
      };
      const hours = hoursMap[timeframe] ?? 24;
      prev.setTime(prev.getTime() - hours * 60 * 60 * 1000);
      break;
    default:
      prev.setDate(prev.getDate() - 30);
  }
  return prev;
}

function getComparisonLabel(timeframe: string): string {
  switch (timeframe) {
    case 'today': return 'vs yesterday';
    case 'last3days': return 'vs prev 3 days';
    case 'last7days': return 'vs prev 7 days';
    case 'thisweek': return 'vs prev week';
    case 'last14days': return 'vs prev 14 days';
    case 'last30days': return 'vs prev 30 days';
    case 'last60days': return 'vs prev 60 days';
    case 'thismonth': return 'vs prev month';
    case 'thisyear': return 'vs prev year';
    case 'last30min': return 'vs prev 30 min';
    case 'last1hour': return 'vs prev hour';
    case 'last6hours': return 'vs prev 6 hours';
    case 'last24hours': return 'vs prev 24 hours';
    default: return 'vs prev period';
  }
}
