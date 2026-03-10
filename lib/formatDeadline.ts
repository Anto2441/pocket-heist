export function formatDeadline(deadline: Date): {
  label: string;
  urgent: boolean;
} {
  const now = Date.now();
  const diff = deadline.getTime() - now;

  if (diff <= 0) {
    return { label: "Overdue", urgent: true };
  }

  const hoursLeft = Math.floor(diff / (1000 * 60 * 60));

  if (hoursLeft < 24) {
    return { label: `${hoursLeft}h left`, urgent: true };
  }

  const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
  return {
    label: `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`,
    urgent: false,
  };
}
