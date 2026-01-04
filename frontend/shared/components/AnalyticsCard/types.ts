import { ReactNode } from "react";

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
  label: string;
  value: string;
  url?: string;
}

export interface AnalyticsHeaderProps {
  label: string;
  measurementLabel: string;
}

export interface AnalyticsItemData {
  icon?: ReactNode;
  label: string;
  value: string;
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