import { cn } from '@/lib/utils';

export function AdminSection({ index, title, description, actions, children, className }: {
  index?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('cms-section', className)}>
      <div className="cms-section-heading">
        <div className="flex items-start gap-3">
          {index && <span className="cms-section-index" aria-hidden>{index}</span>}
          <div>
            <h2>{title}</h2>
            {description && <p className="mt-1 text-sm leading-relaxed text-foreground-muted">{description}</p>}
          </div>
        </div>
        {actions && <div className="cms-page-actions">{actions}</div>}
      </div>
      {children}
    </section>
  );
}
