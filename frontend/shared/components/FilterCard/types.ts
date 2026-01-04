import { ReactNode } from 'react';

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
