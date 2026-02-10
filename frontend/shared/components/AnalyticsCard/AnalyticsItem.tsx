import { MdOpenInNew } from 'react-icons/md';
import { AnalyticsItemProps } from '@/shared/components/types';
import { formatValue } from '@/shared/lib';

export function AnalyticsItem({ icon, label, value, url, percentage }: AnalyticsItemProps) {
  return (
    <div className="relative w-full h-8 rounded overflow-hidden">
      
      {/* Background bar that fills based on percentage */}
      <div 
        className="absolute inset-0 bg-analytics-item-bg transition-all duration-300"
        style={{ width: `${percentage || 0}%` }}
      />

      {/* Content layer */}
      <div className="relative flex items-center justify-between w-full h-full px-2 gap-y-2">

        {/* Left side: Icon + Label */}
        <div className="flex items-center gap-x-2 flex-1 min-w-0">

          {/* Icon */}
          {icon && (
            <div className="shrink-0">
              {icon}
            </div>
          )}

          {/* Label */}
          <span className="text-text-primary text-base font-normal leading-[19px] truncate">
            {label}
          </span>

          {/* Open in new tab icon */}
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 w-6 h-6 flex items-center justify-center hover:opacity-80 transition-opacity text-text-muted"
              aria-label="Open in new tab"
            >
              <MdOpenInNew size={20} />
            </a>
          )}
        </div>

        {/* Right side: Value */}
        <span className="text-text-primary text-base font-medium leading-[19px] text-right shrink-0">
          {formatValue(value)}
        </span>
      </div>
    </div>
  );
}