'use client';

import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { MdSchedule } from 'react-icons/md';

import { Selector } from '@/shared/components/Selector/Selector';
import { useAppSelector } from '@/store/hooks';

import './chartSetup';
import { GraphProps } from '@/shared/components/types';
import { generateDummyData } from './dummyData';
import { createChartData } from './chartConfig';
import { lineChartOptions } from './chartOptions';

export function Graph({ data }: GraphProps) {
  const selectedCard = useAppSelector(
    (state) => state.overview.selectedCard
  );

  const [internalTimeframe, setInternalTimeframe] = useState('hour');

  const graphData = data ?? generateDummyData();
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
