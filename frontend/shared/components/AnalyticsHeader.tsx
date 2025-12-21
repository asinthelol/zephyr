interface AnalyticsHeaderProps {
  label: string;
  measurementLabel: string;
}

export function AnalyticsHeader({ label, measurementLabel }: AnalyticsHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full h-[15px]">
      {/* Left label */}
      <span className="text-text-muted text-xs font-medium leading-[15px]">
        {label}
      </span>

      {/* Right measurement label */}
      <span className="text-text-muted text-xs font-medium leading-[15px]">
        {measurementLabel}
      </span>
    </div>
  );
}
