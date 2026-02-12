import { GraphDataPoint } from '@/shared/components/types';
import { OverviewCardType } from '@/store/slices/overviewSlice';


export function generateDummyData(
  metric?: OverviewCardType,
  timeframe: string = 'hour',
  calendarTimeframe: string = 'today',
  anchorDate: Date = new Date()
): GraphDataPoint[] {
  const baseValue = getBaseValueForMetric(metric);
  const variance = getVarianceForMetric(metric, baseValue);

  // Figure out the date range from the calendar timeframe + anchor
  const { start, end } = getDateRange(calendarTimeframe, anchorDate);

  // Calculate interval in ms and total data points
  let intervalMs: number;
  switch (timeframe) {
    case '5min':
      intervalMs = 5 * 60 * 1000;
      break;
    case '15min':
      intervalMs = 15 * 60 * 1000;
      break;
    case 'hour':
    default:
      intervalMs = 60 * 60 * 1000;
      break;
  }

  const totalMs = end.getTime() - start.getTime();
  const dataPoints = Math.max(1, Math.ceil(totalMs / intervalMs));

  // Determine if we should show dates in labels (multi-day range)
  const spanDays = totalMs / (1000 * 60 * 60 * 24);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const formatTimestamp = (date: Date, index: number, prevDate: Date | null): string => {
    const hour = date.getHours();
    const min = date.getMinutes().toString().padStart(2, '0');

    if (spanDays <= 1) {
      // show hours like 0:00, 1:00, ...
      return `${hour}:${min}`;
    }

    // show date label when the day changes
    const isNewDay = !prevDate || date.getDate() !== prevDate.getDate();
    if (isNewDay) {
      return `${monthNames[date.getMonth()]} ${date.getDate()}`;
    }
    return '';
  };

  // the same date always produces the same data
  const seed = simpleHash(`${metric}-${start.toISOString()}`);

  return Array.from({ length: dataPoints }, (_, i) => {
    const pointDate = new Date(start.getTime() + i * intervalMs);
    const prevDate = i > 0 ? new Date(start.getTime() + (i - 1) * intervalMs) : null;

    // somewhat random value per datapoint
    const pointSeed = seed + i * 2654435761;
    const rand = ((Math.sin(pointSeed) * 10000) % 1 + 1) % 1; // 0..1
    let value = Math.floor(rand * variance + baseValue - variance / 2);

    if (metric === 'Bounce Rate') {
      value = Math.max(0, Math.min(10, value));
    }
    if (metric === 'Session Duration') {
      value = Math.max(30, value); // minimum 30 seconds
    }

    return {
      timestamp: formatTimestamp(pointDate, i, prevDate),
      value,
    };
  });
}

// compute start/end dates for a given calendar timeframe anchored to a date
function getDateRange(calendarTimeframe: string, anchor: Date): { start: Date; end: Date } {
  const d = new Date(anchor);
  d.setHours(0, 0, 0, 0);

  switch (calendarTimeframe) {
    case 'today': {
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      return { start: d, end };
    }
    case 'last3days': {
      const start = new Date(d);
      start.setDate(start.getDate() - 2);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    case 'last7days':
    case 'thisweek': {
      const start = new Date(d);
      start.setDate(start.getDate() - 6);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    case 'last14days': {
      const start = new Date(d);
      start.setDate(start.getDate() - 13);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    case 'last30days': {
      const start = new Date(d);
      start.setDate(start.getDate() - 29);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    case 'last60days': {
      const start = new Date(d);
      start.setDate(start.getDate() - 59);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    case 'thismonth': {
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      return { start, end };
    }
    case 'thisyear': {
      const start = new Date(d.getFullYear(), 0, 1);
      const end = new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);
      return { start, end };
    }
    case 'last30min':
    case 'last1hour':
    case 'last6hours':
    case 'last24hours': {
      const now = new Date();
      const hoursMap: Record<string, number> = {
        last30min: 0.5,
        last1hour: 1,
        last6hours: 6,
        last24hours: 24,
      };
      const hours = hoursMap[calendarTimeframe] ?? 24;
      const start = new Date(now.getTime() - hours * 60 * 60 * 1000);
      return { start, end: now };
    }
    default: {
      
      // default to last 30 days
      const start = new Date(d);
      start.setDate(start.getDate() - 29);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  }
}

// for deterministic pseudo-random data
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
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

export function generateAllMetricsData(
  timeframe: string = 'hour',
  calendarTimeframe: string = 'today',
  anchorDate: Date = new Date()
): Record<OverviewCardType, GraphDataPoint[]> {
  const metrics: OverviewCardType[] = [
    'Unique Users',
    'Pageviews',
    'Sessions',
    'Pages per Session',
    'Bounce Rate',
    'Session Duration',
  ];

  return metrics.reduce((acc, metric) => {
    acc[metric] = generateDummyData(metric, timeframe, calendarTimeframe, anchorDate);
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