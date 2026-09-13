import { Inbox, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-surface-2 px-6 py-14 text-center',
        className,
      )}
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface text-foreground-subtle shadow-xs">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="mt-4 font-display text-lg font-bold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-foreground-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
