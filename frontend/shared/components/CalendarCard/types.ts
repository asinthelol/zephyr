export interface TimeframeOption {
  value: string;
  label: string;
  group?: 'days' | 'time' | 'period' | 'custom' | 'system';
}

export interface CalendarCardProps {
  selectedTimeframe?: string;
  timeframes?: TimeframeOption[];
  onTimeframeChange?: (value: string) => void;
  currentDate?: Date;
  onDateChange?: (date: Date) => void;
}

export const defaultTimeframes: TimeframeOption[] = [
  { value: 'today', label: 'Today', group: 'days' },
  { value: 'last3days', label: 'Last 3 Days', group: 'days' },
  { value: 'last7days', label: 'Last 7 Days', group: 'days' },
  { value: 'last14days', label: 'Last 14 Days', group: 'days' },
  { value: 'last30days', label: 'Last 30 Days', group: 'days' },
  { value: 'last60days', label: 'Last 60 Days', group: 'days' },
  { value: 'last30min', label: 'Last 30 Minutes', group: 'time' },
  { value: 'last1hour', label: 'Last 1 Hour', group: 'time' },
  { value: 'last6hours', label: 'Last 6 Hours', group: 'time' },
  { value: 'last24hours', label: 'Last 24 Hours', group: 'time' },
  { value: 'thisweek', label: 'This Week', group: 'period' },
  { value: 'thismonth', label: 'This Month', group: 'period' },
  { value: 'thisyear', label: 'This Year', group: 'period' },
  { value: 'alltime', label: 'All Time', group: 'custom' },
  { value: 'customrange', label: 'Custom Range', group: 'custom' },
];
