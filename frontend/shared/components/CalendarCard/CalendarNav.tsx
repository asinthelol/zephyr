'use client';

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

interface CalendarNavProps {
  onPrev: () => void;
  onNext: () => void;
  canNavigateForward: boolean;
}

export function CalendarNav({
  onPrev,
  onNext,
  canNavigateForward,
}: CalendarNavProps) {
  return (
    <>
      <button
        onClick={onPrev}
        className="w-8 h-8 bg-card-bg border border-border-default/50 rounded
                   flex items-center justify-center
                   hover:border-border-hover transition-colors"
      >
        <MdKeyboardArrowLeft className="w-6 h-6 text-text-primary" />
      </button>

      <button
        onClick={onNext}
        disabled={!canNavigateForward}
        className={`w-8 h-8 border border-border-default/50 rounded
                    flex items-center justify-center transition-colors
          ${canNavigateForward
            ? 'bg-card-bg hover:border-border-hover cursor-pointer'
            : 'bg-card-bg-dark cursor-not-allowed'}
        `}
      >
        <MdKeyboardArrowRight
          className={`w-6 h-6 ${
            canNavigateForward ? 'text-text-primary' : 'text-text-muted'
          }`}
        />
      </button>
    </>
  );
}
