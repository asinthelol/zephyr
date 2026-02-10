'use client';

import { ReactNode, useState } from 'react';
import { MdKeyboardArrowDown, MdCheck } from "react-icons/md";
import { SelectorProps } from '../types';

export function Selector({ 
  icon, 
  label: labelProp, 
  options,
  selectedValue,
  onSelect,
  onClick, 
  className = '',
  dropdownAlign = 'right'
}: SelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (options && onSelect) {
      setIsOpen(v => !v);
    } else {
      onClick?.();
    }
  };

  const handleSelect = (value: string) => {
    onSelect?.(value);
    setIsOpen(false);
  };

  // Get display label - use selected option's label if available, otherwise use prop label
  const getDisplayLabel = (): string => {
    if (options && selectedValue) {
      const selectedOption = options.find(opt => opt.value === selectedValue);
      return selectedOption?.label || labelProp || '';
    }
    return labelProp || '';
  };

  const displayLabel = getDisplayLabel();

  // Determine alignment classes
  const alignmentClasses = dropdownAlign === 'left' 
    ? 'left-0 origin-top-left' 
    : 'right-0 origin-top-right';

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 bg-card-bg border border-border-default hover:border-border-hover rounded-lg px-4 py-2 h-8 transition-colors ${className}`}
      >
        {icon}
        <span className="text-text-primary text-sm">{displayLabel}</span>
        <MdKeyboardArrowDown className="w-4 h-4 text-text-muted ml-auto" />
      </button>

      {options && (
        <>
          {isOpen && (
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
          )}

          <div
            className={`
              absolute top-full mt-1 w-64
              bg-card-bg border border-border-default rounded shadow-lg
              z-20 max-h-96 overflow-y-auto py-1
              transform
              transition-all duration-200 ease-out
              ${alignmentClasses}
              ${isOpen
                ? 'scale-y-100 opacity-100'
                : 'scale-y-0 opacity-0 pointer-events-none'}
            `}
          >
            {options.map((option, index) => {
              const prevOption = index > 0 ? options[index - 1] : null;
              const showSeparator = prevOption && prevOption.group !== option.group;

              return (
                <div key={option.value}>
                  {showSeparator && (
                    <div className="border-t border-border-default/30 my-1" />
                  )}
                  <button
                    onClick={() => handleSelect(option.value)}
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
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}