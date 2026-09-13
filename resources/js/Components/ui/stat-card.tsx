import { cn } from '@/lib/utils';

/**
 * StatCard (design-system §7): a large figure over its label.
 *
 * No border or shadow — the figures sit in a hairline-ruled row, so boxing each
 * one as well would be a frame inside a frame. The amber rule above the numeral
 * carries the accent instead of the numeral itself, which stays in the
 * foreground colour so it holds its own against the display type around it.
 *
 * When `value` is null the figure is not yet confirmed (content-gap / X1) and a
 * neutral dash is shown instead of an invented number.
 */
export function StatCard({
  value,
  label,
  suffix,
  className,
}: {
  value: number | null;
  label: string;
  suffix?: string;
  className?: string;
}) {
  const display = value === null ? '—' : new Intl.NumberFormat('id-ID').format(value);

  return (
    <div className={cn('pt-6', className)}>
      <span aria-hidden className="block h-px w-8 bg-accent-strong" />
      <div className="mt-5 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        {display}
        {value !== null && suffix ? <span className="align-top text-2xl">{suffix}</span> : null}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{label}</p>
    </div>
  );
}
