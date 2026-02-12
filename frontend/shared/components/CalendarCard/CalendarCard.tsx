'use client';

import { MdCalendarToday } from 'react-icons/md';
import {
  CalendarCardProps,
  defaultTimeframes,
} from '../types';
import { Selector } from '../Selector/Selector';
import { CalendarNav } from './CalendarNav';
import { navTimeframe } from './lib/index';
import { getDisplayLabel } from './lib/index';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSelectedDate, setSelectedTimeframe } from '@/store/slices/calendarSlice';

export function CalendarCard({
  selectedTimeframe,
  timeframes = defaultTimeframes,
  onTimeframeChange,
  currentDate,
  onDateChange,
}: CalendarCardProps) {
  const dispatch = useAppDispatch();
  const calendarDate = useAppSelector((state) => state.calendar.selectedDate);
  const calendarTimeframe = useAppSelector((state) => state.calendar.selectedTimeframe);

  const timeframe = selectedTimeframe ?? calendarTimeframe;
  const date = currentDate ?? new Date(calendarDate);

  const displayLabel = getDisplayLabel(timeframe, date, timeframes);

  const setTimeframe = (value: string) => {
    const today = new Date();

    dispatch(setSelectedTimeframe(value));
    dispatch(setSelectedDate(today.toISOString()));

    onTimeframeChange?.(value);
    onDateChange?.(today);
  };

  const setDate = (newDate: Date) => {
    dispatch(setSelectedDate(newDate.toISOString()));
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
