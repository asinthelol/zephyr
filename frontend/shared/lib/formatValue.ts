
// Formats numbers into a more readable format (e.g., 1500 becomes 1.5K)
// If bounce rate, it formats as percentage (e.g., 0.45 becomes 45%)
export function formatValue(value: number, isPercentage = false) {
    if (isPercentage) {
        return `${(value).toFixed(2)}%`;
    } else {
        if (value >= 1000) {
            return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
        }
        return value.toString();
    }
}

// For session duration (min, sec)
export function formatDisplayValue(value: number, title: string, isPercentage = false) {
  if (title === 'Session Duration') {
      const minutes = Math.floor(value / 60);
      const seconds = Math.round(value % 60);
      
      if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
      }
      return `${seconds}s`;
    }
    
    // Use the formatValue function from lib
    return formatValue(value, isPercentage);
}