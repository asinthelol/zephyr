export function navTimeframe(
  selectedTimeframe: string,
  currentDate: Date,
  onDateChange?: (date: Date) => void
) {
  // Disable navigation for time-based timeframes and all time
  const isTimeBasedTimeframe = [
    'last30min',
    'last1hour',
    'last6hours',
    'last24hours',
    'alltime',
  ].includes(selectedTimeframe);

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

  const canNavigateForward = !isAtCurrent() && !isTimeBasedTimeframe;
  const canNavigateBackward = !isTimeBasedTimeframe;

  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const factor = direction === 'prev' ? -1 : 1;

    switch (selectedTimeframe) {
      case 'last3days':
        newDate.setDate(newDate.getDate() + factor * 2);
        break;
      case 'last7days':
      case 'thisweek':
        newDate.setDate(newDate.getDate() + factor * 7);
        break;
      case 'last14days':
        newDate.setDate(newDate.getDate() + factor * 14);
        break;
      case 'last30days':
        newDate.setDate(newDate.getDate() + factor * 30);
        break;
      case 'last60days':
        newDate.setDate(newDate.getDate() + factor * 60);
        break;
      case 'thismonth':
        newDate.setMonth(newDate.getMonth() + factor);
        break;
      case 'thisyear':
        newDate.setFullYear(newDate.getFullYear() + factor);
        break;
      default:
        // For 'today' and time-based, navigate by single days
        newDate.setDate(newDate.getDate() + factor);
    }

    onDateChange?.(newDate);
  };

  return {
    canNavigateForward,
    canNavigateBackward,
    navigatePrevious: () => navigate('prev'),
    navigateNext: () => navigate('next'),
  };
}
