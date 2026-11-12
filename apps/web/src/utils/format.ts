/** "Sat, Nov 14 · 7:30 PM" in the venue's own timezone, wherever the viewer is. */
export function formatEventDate(isoDate: string, timezone: string): string {
  const date = new Date(isoDate);
  const day = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: timezone
  }).format(date);
  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone
  }).format(date);
  return `${day} · ${time}`;
}

export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    /* Whole amounts read cleaner as "$45" than "$45.00". */
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2
  }).format(amount);
}

/** "Floor · Row A · Seat 4" */
export function formatSeat(seat: { section: string; row: string; number: number }): string {
  return `${seat.section} · Row ${seat.row} · Seat ${seat.number}`;
}
