import { GraphDataPoint } from '@/shared/components/types';
import { OverviewCardType } from '@/store/slices/overviewSlice';

export function generateDummyData(metric?: OverviewCardType, timeframe: string = 'hour'): GraphDataPoint[] {
  const baseValue = getBaseValueForMetric(metric);
  const variance = getVarianceForMetric(metric, baseValue);

  // Determine number of data points and label format based on timeframe
  let dataPoints: number;
  let labelFormat: (index: number) => string;

  switch (timeframe) {
    case '5min':
      dataPoints = 12 * 24; // 12 * 5 * 24 = 1440 minutes (24 hours)
      labelFormat = (i) => {
        const minutes = i * 5;
        const hour = Math.floor(minutes / 60);
        const min = minutes % 60;
        return `${hour}:${min.toString().padStart(2, '0')}`;
      };
      break;

    case '15min':
      dataPoints = 4 * 24; // 4 * 15 * 24 = 1440 minutes
      labelFormat = (i) => {
        const minutes = i * 15;
        const hour = Math.floor(minutes / 60);
        const min = minutes % 60;
        return `${hour}:${min.toString().padStart(2, '0')}`;
      };
      break;

    case 'hour':
    default:
      dataPoints = 24; // 24 hours
      labelFormat = (i) => `${i}:00`;
      break;
  }

  return Array.from({ length: dataPoints }, (_, i) => {
    let value = Math.floor(Math.random() * variance + baseValue - variance / 2);
    
    // Ensure bounce rate stays between 0-100
    if (metric === 'Bounce Rate') {
      value = Math.max(0, Math.min(100, value));
    }
    
    // Ensure session duration stays positive
    if (metric === 'Session Duration') {
      value = Math.max(30, value); // minimum 30 seconds
    }
    
    return {
      timestamp: labelFormat(i),
      value,
    };
  });
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

export function generateAllMetricsData(timeframe: string = 'hour'): Record<OverviewCardType, GraphDataPoint[]> {
  const metrics: OverviewCardType[] = [
    'Unique Users',
    'Pageviews',
    'Sessions',
    'Pages per Session',
    'Bounce Rate',
    'Session Duration',
  ];

  return metrics.reduce((acc, metric) => {
    acc[metric] = generateDummyData(metric, timeframe);
    return acc;
  }, {} as Record<OverviewCardType, GraphDataPoint[]>);
}

function getVarianceForMetric(metric?: OverviewCardType, baseValue?: number): number {
  switch (metric) {
    case 'Bounce Rate':
      return 20; // variance of ±20% for bounce rate (so range is ~25-65%)
    case 'Session Duration':
      return 60; // variance of ±60 seconds
    default:
      return (baseValue || 1000) * 0.3; // 30% variance for others
  }
}