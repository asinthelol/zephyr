'use client';

import { FilterOption } from '@/shared/components/types';

interface FilterDropdownProps {
  isOpen: boolean;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export function FilterDropdown({
  isOpen,
  options,
  selectedValue,
  onSelect,
  onClose,
}: FilterDropdownProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={onClose}
        />
      )}

      <div
        className={`
          absolute top-full left-0 mt-1 w-full
          bg-card-bg border border-border-default rounded shadow-lg
          z-20 max-h-96 overflow-y-auto
          transform origin-top
          transition-all duration-200 ease-out
          ${isOpen
            ? 'scale-y-100 opacity-100'
            : 'scale-y-0 opacity-0 pointer-events-none'}
        `}
      >
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              onSelect(option.value);
              onClose();
            }}
            className="w-full px-4 py-2 text-left
                       hover:bg-analytics-item-bg transition-colors
                       flex items-center gap-2"
          >
            {option.icon && (
              <div className="w-4 h-4 text-text-primary">
                {option.icon}
              </div>
            )}

            <span className="text-white font-medium text-sm">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
