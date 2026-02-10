'use client';

import { useState } from 'react';
import { FilterButton } from './FilterButton';
import { FilterDropdown } from './FilterDropdown';
import { FilterCardProps } from '@/shared/components/types';

export function FilterCard({
  icon,
  selectedValue,
  options,
  onSelect,
}: FilterCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(
    (opt) => opt.value === selectedValue
  );

  return (
    <div className="relative w-56 h-8">
      <FilterButton
        icon={icon}
        label={selectedOption?.label || selectedValue}
        isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      />

      <FilterDropdown
        isOpen={isOpen}
        options={options}
        selectedValue={selectedValue}
        onSelect={(value) => onSelect?.(value)}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}