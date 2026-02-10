import { formatDate } from './formatDate';

export function getDisplayLabel(
  timeframe: string,
  date: Date,
  timeframes: { value: string; label: string }[]
) {
  const selected = timeframes.find(tf => tf.value === timeframe);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const current = new Date(date);
  current.setHours(0, 0, 0, 0);

  const isToday = current.getTime() === today.getTime();

  if (isToday && selected) {
    return selected.label;
  }

  switch (timeframe) {
    case 'today': {
      const diff =
        (today.getTime() - current.getTime()) /
        (1000 * 60 * 60 * 24);

      if (diff === 1) return 'Yesterday';
      if (diff === -1) return 'Tomorrow';

      return formatDate(current, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
    }

    case 'last3days':
    case 'last7days':
    case 'last14days':
    case 'last30days':
    case 'last60days': {
      const days =
        parseInt(timeframe.replace('last', '').replace('days', ''), 10) - 1;

      const start = new Date(current);
      start.setDate(start.getDate() - days);

      return `${formatDate(start, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      })} - ${formatDate(current, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      })}`;
    }

    case 'thisweek': {
      const start = new Date(current);
      start.setDate(start.getDate() - start.getDay());

      const end = new Date(start);
      end.setDate(end.getDate() + 6);

      return `${formatDate(start, {
        month: 'short',
        day: 'numeric',
      })} - ${formatDate(end, {
        month: 'short',
        day: 'numeric',
      })}`;
    }

    case 'thismonth': {
      const start = new Date(current.getFullYear(), current.getMonth(), 1);
      const end = new Date(current.getFullYear(), current.getMonth() + 1, 0);

      return `${formatDate(start, {
        month: 'short',
        day: 'numeric',
      })} - ${formatDate(end, {
        month: 'short',
        day: 'numeric',
      })}`;
    }

    case 'thisyear':
      return (current.getFullYear() - 1).toString();

    default:
      return selected?.label ?? 'Today';
  }
}