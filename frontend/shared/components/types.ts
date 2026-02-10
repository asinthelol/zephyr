import { ReactNode } from "react";

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
];

interface SelectorOption {
  value: string;
  label: string;
  group?: string;
}

export interface SelectorProps {
  icon: ReactNode;
  label?: string;
  options?: SelectorOption[];
  selectedValue?: string;
  onSelect?: (value: string) => void;
  onClick?: () => void;
  className?: string;
  dropdownAlign?: 'left' | 'right';
  useDynamicLabel?: boolean;
}

export interface OverviewCardProps {
  title: string;
  value: number;
  change?: {
    value: number;
    timeframe: string;
  };
  isSelected?: boolean;
  onClick?: () => void;
}

export interface CountryFlagProps {
  countryCode: string; // e.g., "us", "gb", "ca"
  height?: number;
  className?: string;
}

export interface BrandIconProps {
  domain: string;
  size?: number;
  className?: string;
}

export interface AnalyticsTabsProps {
  tabs: string[];
  onTabChange?: (tab: string) => void;
  defaultTab?: string;
}

export interface AnalyticsItemProps {
  icon?: ReactNode;
  label: ReactNode;
  value: number;
  url?: string;
  percentage?: number; // For background fill, value between 0 and 100
}

export interface AnalyticsHeaderProps {
  label: string;
  measurementLabel: string;
}

export interface AnalyticsItemData {
  icon?: ReactNode;
  label: ReactNode;
  value: number;
  url?: string;
}

export interface TabData {
  items: AnalyticsItemData[];
  headerLabel?: string;
}

export interface AnalyticsCardProps {
  tabs: string[];
  defaultTab?: string;
  measurementLabel: string;
  tabData: Record<string, TabData>;
  onTabChange?: (tab: string) => void;
}

export interface FilterOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface FilterCardProps {
  icon: ReactNode;
  selectedValue: string;
  options: FilterOption[];
  onSelect?: (value: string) => void;
}

export interface GraphDataPoint {
  timestamp: string; // e.g., "00:00", "Jan 1", "2024-01-01"
  value: number;
}

export interface GraphProps {
  data?: GraphDataPoint[]; // Optional data from backend (im using dummy data for now)
}