import { GraphDataPoint } from '@/shared/components/types';
import { OverviewCardType } from '@/store/slices/overviewSlice';

export function generateDummyData(metric?: OverviewCardType): GraphDataPoint[] {
  const baseValue = getBaseValueForMetric(metric);
  const variance = baseValue * 0.3; // 30% variance

  return Array.from({ length: 24 }, (_, i) => ({
    timestamp: `${i}:00`,
    value: Math.floor(Math.random() * variance + baseValue - variance / 2), // Random value around the base with some variance
  }));
}

function getBaseValueForMetric(metric?: OverviewCardType): number {
  switch (metric) {
    case 'Unique Users':
      return 500;
    case 'Pageviews':
      return 3000;
    case 'Sessions':
      return 800;
    case 'Pages per Session':
      return 4;
    case 'Bounce Rate':
      return 45; // bounce is in percentage
    case 'Session Duration':
      return 180; // in seconds
    default:
      return 1000; // default base value incase i missed any metric
  }
}

export function generateAllMetricsData(): Record<OverviewCardType, GraphDataPoint[]> {
  const metrics: OverviewCardType[] = [
    'Unique Users',
    'Pageviews',
    'Sessions',
    'Pages per Session',
    'Bounce Rate',
    'Session Duration',
  ];

  return metrics.reduce((acc, metric) => {
    acc[metric] = generateDummyData(metric);
    return acc;
  }, {} as Record<OverviewCardType, GraphDataPoint[]>);
}