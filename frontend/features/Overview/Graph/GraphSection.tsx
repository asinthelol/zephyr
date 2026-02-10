'use client';

import { Selector } from '@/shared/components/Selector/Selector';
import { useState } from 'react';
import { MdSchedule } from "react-icons/md";
import { useAppSelector } from '@/store/hooks';


export function GraphSection() {
  const selectedCard = useAppSelector((state) => state.overview.selectedCard);

  // Sample data
  const maxValue = 7000;
  const yAxisSteps = 7;
  const xAxisSteps = 24;

  //  y-axis
  const yAxisLabels = Array.from({ length: yAxisSteps + 1 }, (_, i) => {
    const value = Math.round((maxValue / yAxisSteps) * i);
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  }).reverse();

  //  x-axis
  const xAxisLabels = Array.from({ length: xAxisSteps + 1 }, (_, i) => {
    const hour = i;
    if (hour % 2 === 0) {
      return `${hour}:00`;
    }
    return '';
  });

  const [internalTimeframe, setInternalTimeframe] = useState('Hour');

  return (
    <div className="bg-card-bg rounded-lg p-10 mb-6 h-120 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-text-primary text-lg font-medium">{selectedCard}</h3>
        <Selector
          icon={
            <MdSchedule className="w-4 h-4 text-text-primary" />
          }
          label={internalTimeframe}
          options={[
            { value: '5min', label: '5 Min' },
            { value: '15min', label: '15 Min' },
            { value: 'hour', label: 'Hour' },
          ]}
          selectedValue={internalTimeframe}
          onSelect={(value) => setInternalTimeframe(value)}
          className="min-w-40"
        />
      </div>
      
      <div className="flex-1 flex gap-4">
        
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between text-xs text-text-muted py-2">
          {yAxisLabels.map((label, i) => (
            <div key={i} className="h-0 flex items-center">
              {label}
            </div>
          ))}
        </div>

        {/* Graph area */}
        <div className="flex-1 relative">

          {/* Horizontal grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {yAxisLabels.map((_, i) => (
              <div key={i} className="border-t border-border-default/30" />
            ))}
          </div>

          {/* Vertical grid lines */}
          <div className="absolute inset-0 flex justify-between">
            {xAxisLabels.map((_, i) => (
              <div key={i} className="border-l border-border-default/30 h-full" />
            ))}
          </div>

          {/* X-axis labels */}
          <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-text-muted">
            {xAxisLabels.map((label, i) => (
              <div key={i} className="w-0 flex justify-center">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
