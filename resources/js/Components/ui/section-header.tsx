import { cn } from '@/lib/utils';

/**
 * SectionHeader (design-system §7).
 *
 * `index` prints a numeral above a hairline rule, giving the page a report-like
 * reading order. It is decorative — `aria-hidden`, because "01" read aloud
 * before every heading is noise, and the heading itself already carries the
 * section's name.
 */
export function SectionHeader({
  eyebrow,
  index,
  title,
  description,
  align = 'left',
  as: Heading = 'h2',
  className,
  id,
}: {
  eyebrow?: string;
  index?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  id?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {(index || eyebrow) && (
        <div
          className={cn(
            'flex w-full items-baseline gap-3 border-b border-line pb-3',
            align === 'center' && 'justify-center',
          )}
        >
          {index && (
            <span
              aria-hidden
              className="font-mono text-xs tabular-nums text-accent-strong"
            >
              {index}
            </span>
          )}
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        </div>
      )}
      <Heading
        id={id}
        className={cn(
          'text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl',
          (index || eyebrow) && 'mt-6',
        )}
      >
        {title}
      </Heading>
      {description && (
        <p
          className={cn(
            'mt-4 max-w-2xl text-pretty text-base leading-relaxed text-foreground-muted sm:text-lg',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
