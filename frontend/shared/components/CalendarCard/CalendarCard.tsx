'use client';

import { useState } from 'react';
import {
  CalendarCardProps,
  defaultTimeframes,
} from './types';
import { CalendarButton } from './CalendarButton';
import { CalendarDropdown } from './CalendarDropdown';
import { CalendarNav } from './CalendarNav';
import { calendarNavHook } from './calendarNavHook';

export function CalendarCard({
  selectedTimeframe = 'today',
  timeframes = defaultTimeframes,
  onTimeframeChange,
  currentDate = new Date(),
  onDateChange,
}: CalendarCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = timeframes.find(
    tf => tf.value === selectedTimeframe
  );

  const {
    canNavigateForward,
    navigatePrevious,
    navigateNext,
  } = calendarNavHook(
    selectedTimeframe,
    currentDate,
    onDateChange
  );

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <CalendarButton
          label={selectedOption?.label || 'Today'}
          isOpen={isOpen}
          onClick={() => setIsOpen(v => !v)}
        />

        <CalendarDropdown
          isOpen={isOpen}
          options={timeframes}
          selectedValue={selectedTimeframe}
          onSelect={value => onTimeframeChange?.(value)}
          onClose={() => setIsOpen(false)}
        />
      </div>

      <CalendarNav
        onPrev={navigatePrevious}
        onNext={navigateNext}
        canNavigateForward={canNavigateForward}
      />
    </div>
  );
}
