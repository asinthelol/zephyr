'use client';

import { useState, useMemo, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { MdSchedule } from 'react-icons/md';

import { Selector } from '@/shared/components/Selector/Selector';
import { useAppSelector } from '@/store/hooks';

import './lib/chartSetup';
import { GraphProps } from '@/shared/components/types';
import { generateAllMetricsData } from './lib/dummyData';
import { createChartData } from './lib/chartConfig';
import { lineChartOptions } from './lib/chartOptions';

export function Graph({ data }: GraphProps) {
  const selectedCard = useAppSelector(
    (state) => state.overview.selectedCard
  );
  const calendarDate = useAppSelector((state) => state.calendar.selectedDate);
  const calendarTimeframe = useAppSelector((state) => state.calendar.selectedTimeframe);

  const [internalTimeframe, setInternalTimeframe] = useState('hour');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate dummy data
  // replace with like = {somebackendApiCall}
  const allMetricsData = useMemo(() => {
    if (!isClient) return null;
    return generateAllMetricsData(internalTimeframe, calendarTimeframe, new Date(calendarDate));
  }, [internalTimeframe, isClient, calendarDate, calendarTimeframe]);

  if (!allMetricsData) {
    return <div className="h-120" />; // Placeholder during SSR
  }

  const graphData = data ?? allMetricsData[selectedCard];
  const chartData = createChartData(selectedCard, graphData);

  return (
    <div className="bg-card-bg rounded-lg p-10 mb-6 h-120 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-text-primary text-lg font-medium">
          {selectedCard}
        </h3>

        <Selector
          icon={<MdSchedule className="w-4 h-4 text-text-primary" />}
          label={internalTimeframe}
          options={[
            { value: '5min', label: '5 Min' },
            { value: '15min', label: '15 Min' },
            { value: 'hour', label: 'Hour' },
          ]}
          selectedValue={internalTimeframe}
          onSelect={setInternalTimeframe}
          className="min-w-40"
          useDynamicLabel
        />
      </div>

      <div className="flex-1 relative">
        <Line data={chartData} options={lineChartOptions} />
      </div>
    </div>
  );
}
