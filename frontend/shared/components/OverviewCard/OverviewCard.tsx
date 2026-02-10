import { MdArrowDownward, MdArrowUpward } from 'react-icons/md';
import { OverviewCardProps } from '@/shared/components/types';
import { formatValue } from '@/shared/lib';


export function OverviewCard({ title, value, change }: OverviewCardProps) {

  const isPositive = change ? change.value > 0 : false;

  const formattedChange = change
    ? `${isPositive ? '+' : ''}${formatValue(change.value)}`
    : null;

  return (
    <div className="flex flex-col justify-between w-full h-24 bg-card-bg rounded-lg p-3">
      
      {/* Title */}
      <div className="text-text-muted text-xs font-normal leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
        {title}
      </div>

      {/* Value and Change indicator */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-text-primary text-2xl font-medium leading-tight">
          {formatValue(value)}
        </div>
        {change && (
          <div className="flex items-center gap-1">
            {isPositive ? (
              <MdArrowUpward className="w-4 h-4 text-green-500" />
            ) : (
              <MdArrowDownward className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-normal ${
              isPositive ? 'text-green-500' : 'text-red-500'
            }`}>
              {formattedChange}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}