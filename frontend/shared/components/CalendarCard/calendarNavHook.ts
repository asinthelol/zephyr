export function calendarNavHook(
  selectedTimeframe: string,
  currentDate: Date,
  onDateChange?: (date: Date) => void
) {
  const isAtCurrent = () => {
    const now = new Date();
    const current = new Date(currentDate);

    now.setHours(0, 0, 0, 0);
    current.setHours(0, 0, 0, 0);

    switch (selectedTimeframe) {
      case 'thismonth':
        return (
          current.getMonth() === now.getMonth() &&
          current.getFullYear() === now.getFullYear()
        );
      case 'thisyear':
        return current.getFullYear() === now.getFullYear();
      default:
        return current >= now;
    }
  };

  const canNavigateForward = !isAtCurrent();

  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const factor = direction === 'prev' ? -1 : 1;

    switch (selectedTimeframe) {
      case 'last7days':
      case 'thisweek':
        newDate.setDate(newDate.getDate() + factor * 7);
        break;
      case 'last30days':
        newDate.setDate(newDate.getDate() + factor * 30);
        break;
      case 'thismonth':
        newDate.setMonth(newDate.getMonth() + factor);
        break;
      case 'thisyear':
        newDate.setFullYear(newDate.getFullYear() + factor);
        break;
      default:
        newDate.setDate(newDate.getDate() + factor);
    }

    onDateChange?.(newDate);
  };

  return {
    canNavigateForward,
    navigatePrevious: () => navigate('prev'),
    navigateNext: () => navigate('next'),
  };
}
