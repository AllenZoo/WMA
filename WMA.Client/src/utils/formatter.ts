// Utility function to parse ISO duration
export const parseDuration = (isoDuration: string): number => {
  // Remove 'PT' prefix and 'S' suffix
  const durationString = isoDuration.replace(/^PT|S$/g, "");

  // Convert to minutes, rounding to nearest whole minute
  const durationMinutes = Math.round(parseFloat(durationString) / 60);

  return durationMinutes;
};

// Utility function to format date
export const formatWorkoutDate = (isoDateString: Date | string): string => {
  // Ensure we're working with a Date object
  const date =
    isoDateString instanceof Date ? isoDateString : new Date(isoDateString);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

// Utility function to format duration
export const formatDuration = (duration: number | string): string => {
  // If it's an ISO duration string, parse it first
  const durationInMinutes =
    typeof duration === "string" ? parseDuration(duration) : duration;

  if (durationInMinutes < 1) {
    return "< 1 min";
  }

  if (durationInMinutes < 60) {
    return `${durationInMinutes} min`;
  }

  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
};
