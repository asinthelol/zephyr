'use client';

import { MdCalendarToday } from 'react-icons/md';

interface CalendarButtonProps {
  label: string;
  isOpen: boolean;
  onClick: () => void;
}

export function CalendarButton({ label, onClick }: CalendarButtonProps) {
  return (
    <button
      onClick={onClick}
      className="h-8 bg-card-bg border border-border-default/50 rounded
                 flex items-center gap-2 px-2
                 hover:border-border-hover transition-colors"
    >
      <MdCalendarToday className="w-4 h-4 text-text-primary" />
      <span className="text-primary font-medium text-base leading-[19px]">
        {label}
      </span>
    </button>
  );
}
