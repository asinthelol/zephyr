import { GraphDataPoint, MetricSummary } from '@/shared/components/types';

export function calculateMetricSummary(data: GraphDataPoint[]): MetricSummary {
  if (!data || data.length === 0) {
    return {
      total: 0,
      average: 0,
      change: 0,
    };
  }

  // calculate total
  const total = data.reduce((sum, point) => sum + point.value, 0);

  // calculate average
  const average = data.reduce((sum, d) => sum + d.value, 0) / data.length;

  // calculate percentage change from first to last data point
  const firstValue = data[0].value;
  const lastValue = data[data.length - 1].value;
  const change = firstValue === 0 ? 0 : ((lastValue - firstValue) / firstValue) * 100;

  return {
    total: Math.round(total),
    average: Math.round(average),
    change: parseFloat(change.toFixed(2)),
  };
}