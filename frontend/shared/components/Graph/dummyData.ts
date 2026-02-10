import { GraphDataPoint } from '@/shared/components/types';

export const generateDummyData = (): GraphDataPoint[] =>
  Array.from({ length: 24 }, (_, i) => ({
    timestamp: `${i}:00`,
    value: Math.floor(Math.random() * 5000) + 1000,
  }));