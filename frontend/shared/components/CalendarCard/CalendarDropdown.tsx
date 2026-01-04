'use client';

import { MdCheck } from 'react-icons/md';
import { TimeframeOption } from './types';

interface CalendarDropdownProps {
  isOpen: boolean;
  options: TimeframeOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export function CalendarDropdown({
  isOpen,
  options,
  selectedValue,
  onSelect,
  onClose,
}: CalendarDropdownProps) {
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
          absolute top-full left-0 mt-1 w-64
          bg-card-bg border border-border-default rounded shadow-lg
          z-20 max-h-96 overflow-y-auto py-1
          transform origin-top
          transition-all duration-200 ease-out
          ${isOpen
            ? 'scale-y-100 opacity-100'
            : 'scale-y-0 opacity-0 pointer-events-none'}
        `}
      >
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => {
              onSelect(option.value);
              onClose();
            }}
            className="w-full px-4 py-2 text-left
                       hover:bg-analytics-item-bg transition-colors
                       flex items-center justify-between"
          >
            <span className="text-primary font-normal text-sm">
              {option.label}
            </span>
            {selectedValue === option.value && (
              <MdCheck className="w-4 h-4 text-text-primary" />
            )}
          </button>
        ))}
      </div>
    </>
  );
}
