export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions
) {
  return date.toLocaleDateString('en-US', options);
}