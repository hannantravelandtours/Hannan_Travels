/**
 * Time utility functions to convert 24-hour time strings to 12-hour format with AM/PM labels.
 */

export function formatTime12(timeStr?: string | null): string {
  if (!timeStr) return "";
  const trimmed = timeStr.trim();
  if (trimmed.toUpperCase().includes("AM") || trimmed.toUpperCase().includes("PM")) {
    return trimmed;
  }

  const isUtc = trimmed.toUpperCase().includes("UTC");
  const cleanTime = trimmed.replace(/\(UTC\)/gi, "").replace(/UTC/gi, "").trim();

  const parts = cleanTime.split(":");
  if (parts.length < 2) return trimmed;

  const rawHour = parseInt(parts[0], 10);
  const min = parts[1].slice(0, 2);
  if (isNaN(rawHour)) return trimmed;

  const ampm = rawHour >= 12 ? "PM" : "AM";
  const hour12 = rawHour % 12 || 12;
  const hourStr = hour12 < 10 ? `0${hour12}` : `${hour12}`;

  const res = `${hourStr}:${min} ${ampm}`;
  return isUtc ? `${res} (UTC)` : res;
}

export function formatSlotRange(startTime?: string | null, endTime?: string | null): string {
  if (!startTime && !endTime) return "";
  if (!endTime) return formatTime12(startTime);
  if (!startTime) return formatTime12(endTime);
  return `${formatTime12(startTime)} - ${formatTime12(endTime)}`;
}
