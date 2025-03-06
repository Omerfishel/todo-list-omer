
/**
 * Helper functions for working with dates
 */

/**
 * Converts a string to a Date object
 * @param dateString - The date string to convert
 * @returns A Date object
 */
export function stringToDate(dateString: string | null | undefined): Date {
  if (!dateString) {
    return new Date();
  }
  return new Date(dateString);
}

/**
 * Converts a Date object to an ISO string (YYYY-MM-DD)
 * @param date - The Date object to convert
 * @returns A date string in ISO format
 */
export function dateToString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Formats a date for display
 * @param date - The date to format, either as a string or Date
 * @param options - Intl.DateTimeFormatOptions
 * @returns A formatted date string
 */
export function formatDate(
  date: Date | string | null | undefined, 
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}
