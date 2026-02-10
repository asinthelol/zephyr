'use client';

import { useState } from 'react';
import { MdCalendarToday } from 'react-icons/md';
import {
  CalendarCardProps,
  defaultTimeframes,
} from '../types';
import { Selector } from '../Selector/Selector';
import { CalendarNav } from './CalendarNav';
import { navTimeframe } from './lib/index';
import { getDisplayLabel } from './lib/index';

export function CalendarCard({
  selectedTimeframe,
  timeframes = defaultTimeframes,
  onTimeframeChange,
  currentDate,
  onDateChange,
}: CalendarCardProps) {
  const [internalTimeframe, setInternalTimeframe] = useState('today');
  const [internalDate, setInternalDate] = useState(new Date());

  const timeframe = selectedTimeframe ?? internalTimeframe;
  const date = currentDate ?? internalDate;

  const displayLabel = getDisplayLabel(timeframe, date, timeframes);

  const setTimeframe = (value: string) => {
    const today = new Date();

    if (selectedTimeframe === undefined) {
      setInternalTimeframe(value);
    }

    if (currentDate === undefined) {
      setInternalDate(today);
    }

    onTimeframeChange?.(value);
    onDateChange?.(today);
  };

  const setDate = (newDate: Date) => {
    if (currentDate === undefined) {
      setInternalDate(newDate);
    }

    onDateChange?.(newDate);
  };

  const {
    canNavigateForward,
    canNavigateBackward,
    navigatePrevious,
    navigateNext,
  } = navTimeframe(timeframe, date, setDate);

  return (
    <div className="flex items-center gap-2">
      <Selector
        icon={<MdCalendarToday className="w-4 h-4 text-text-primary" />}
        label={displayLabel}
        options={timeframes}
        selectedValue={timeframe}
        onSelect={setTimeframe}
        className="min-w-40"
      />

      <CalendarNav
        onPrev={navigatePrevious}
        onNext={navigateNext}
        canNavigateForward={canNavigateForward}
        canNavigateBackward={canNavigateBackward}
      />
    </div>
  );
}
