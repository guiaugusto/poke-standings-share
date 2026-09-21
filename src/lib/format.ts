export function formatPercent(count: number, total: number): string {
  if (total <= 0) return '0.0%';
  return `${((count / total) * 100).toFixed(1)}%`;
}
