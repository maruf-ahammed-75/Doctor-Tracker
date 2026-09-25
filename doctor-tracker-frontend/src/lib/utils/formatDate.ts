/**
 * Formats an ISO date string into a user-friendly format (e.g. Sep 24, 2026)
 */
export function formatDate(dateString?: string | Date): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/**
 * Formats a date string into YYYY-MM-DD input format
 */
export function formatInputDate(dateString?: string | Date): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  return date.toISOString().split("T")[0];
}

/**
 * Formats an ISO date string into date + time (e.g. Sep 24, 2026, 4:15 PM)
 */
export function formatDateTime(dateString?: string | Date): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export default {
  formatDate,
  formatInputDate,
  formatDateTime,
};
