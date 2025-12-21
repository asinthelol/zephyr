interface OverviewCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
}

export function OverviewCard({ title, value, change }: OverviewCardProps) {
  return (
    <div className="flex flex-col justify-between w-[248px] h-36 bg-card-bg rounded-lg p-4">
      
      {/* Title */}
      <div className="text-text-muted text-[20px] font-medium leading-6">
        {title}
      </div>

      {/* Value */}
      <div className="text-text-primary text-[48px] font-medium leading-[58px]">
        {value}
      </div>

      {/* Change indicator */}
      {change && (
        <div
          className={`text-[20px] font-medium leading-6 ${
            change.isPositive ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {change.value} {change.label || 'vs yesterday'}
        </div>
      )}
    </div>
  );
}
