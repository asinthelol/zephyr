'use client';

import { MdKeyboardArrowDown } from 'react-icons/md';
import { ReactNode } from 'react';

interface FilterButtonProps {
  icon: ReactNode;
  label: string;
  isOpen: boolean;
  onClick: () => void;
}

export function FilterButton({
  icon,
  label,
  isOpen,
  onClick,
}: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full h-8 bg-card-bg border border-border-default rounded
                 flex items-center justify-between px-4
                 hover:border-border-hover transition-colors"
    >
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 text-text-primary">
          {icon}
        </div>
        <span className="text-primary font-medium text-base leading-[19px]">
          {label}
        </span>
      </div>

      <MdKeyboardArrowDown
        className={`w-6 h-6 text-text-primary transition-transform duration-200 ease-out
          ${isOpen ? 'rotate-180' : 'rotate-0'}
        `}
      />
    </button>
  );
}
