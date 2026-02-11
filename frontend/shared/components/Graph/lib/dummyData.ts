import { GraphDataPoint } from '@/shared/components/types';
import { OverviewCardType } from '@/store/slices/overviewSlice';

export function generateDummyData(metric?: OverviewCardType, timeframe: string = 'hour'): GraphDataPoint[] {
  const baseValue = getBaseValueForMetric(metric);
  const variance = baseValue * 0.3; // 30% variance

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

  return Array.from({ length: dataPoints }, (_, i) => ({
    timestamp: labelFormat(i),
    value: Math.floor(Math.random() * variance + baseValue - variance / 2),
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