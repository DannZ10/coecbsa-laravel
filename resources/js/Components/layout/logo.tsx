import { cn } from '@/lib/utils';

/**
 * Brand mark + wordmark. Placeholder emerald mark evoking the house/leaf motif
 * (design-system §2) until the official `logo-coe-cbsa.png/svg` asset is dropped
 * into /public. Uses currentColor so a mono-white version works on dark hero art.
 */
export function Logo({
  className,
  withWordmark = true,
  labelledBy,
}: {
  className?: string;
  withWordmark?: boolean;
  labelledBy?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg
        viewBox="0 0 40 40"
        className="h-9 w-9 shrink-0 text-primary"
        role="img"
        aria-labelledby={labelledBy}
        aria-hidden={labelledBy ? undefined : true}
        fill="none"
      >
        <rect x="1" y="1" width="38" height="38" rx="11" className="fill-primary" />
        {/* house roof */}
        <path
          d="M20 9.5 9.5 17.5v0.6a1 1 0 0 0 1.6.8L20 13l8.9 5.9a1 1 0 0 0 1.6-.8v-.6L20 9.5Z"
          className="fill-primary-fg"
          opacity="0.95"
        />
        {/* leaf */}
        <path
          d="M20 16.2c-3.4 0-6.2 2.7-6.2 6.1 0 3.4 2.8 8 6.2 8s6.2-4.6 6.2-8c0-3.4-2.8-6.1-6.2-6.1Z"
          className="fill-accent"
        />
        <path
          d="M20 18.5v9.4M20 22.6l2.4-2M20 25.1l-2.4-2"
          className="stroke-primary"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
            CoE&nbsp;CBSA
          </span>
          <span className="text-[0.6875rem] font-medium uppercase tracking-wide text-foreground-subtle">
            Universitas Brawijaya
          </span>
        </span>
      )}
    </span>
  );
}
