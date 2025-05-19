export function formatDate(ms: number | string): string {
  const d = new Date(ms);
  return d.toLocaleDateString("en-GB"); // "16/05/2025"  – (dd/mm/yyyy)
}
