export function fmtMoney(n: number | undefined | null): string {
  const val = Number(n) || 0;
  return val.toLocaleString('en-PK', { maximumFractionDigits: 0 });
}

export function fmtDate(iso: string | undefined | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function fmtDateTime(iso: string | undefined | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return (
    d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  );
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Sanitizes a string for safe use as part of a downloaded file name. */
export function sanitizeFileNamePart(value: string | undefined | null): string {
  return String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'Unknown';
}
