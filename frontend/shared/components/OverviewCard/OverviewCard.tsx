interface OverviewCardProps {
  title: string;
  value: number;
  change?: {
    value: number;
    label?: string;
  };
}

export function OverviewCard({ title, value, change }: OverviewCardProps) {
  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
    }
    return value.toString();
  };

  const isPositive = change ? change.value > 0 : false;

  const formattedChange = change
    ? `${isPositive ? '+' : ''}${change.value}`
    : null;

  return (
    <div className="flex flex-col justify-between w-[248px] h-36 bg-card-bg rounded-lg p-4">
      
      {/* Title */}
      <div className="text-text-muted text-[20px] font-medium leading-6">
        {title}
      </div>

      {/* Value */}
      <div className="text-text-primary text-[48px] font-medium leading-[58px]">
        {formatValue(value)}
      </div>

      {/* Change indicator */}
      {change && (
        <div
          className={`text-[20px] font-medium leading-6 ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {formattedChange}{' '}
          <span className="text-text-muted">
            {change.label || 'vs yesterday'}
          </span>
        </div>
      )}
    </div>
  );
}
