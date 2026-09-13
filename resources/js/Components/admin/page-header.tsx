import { cn } from '@/lib/utils';

export function AdminPageHeader({ index, title, description, actions, className }: {
  index?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn('cms-page-header', className)}>
      <div className="cms-page-kicker" aria-hidden>
        <span className="cms-kicker-line" />
        <span>CoE CBSA {index && <span className="cms-page-index">/ {index}</span>}</span>
      </div>
      <div className="cms-page-heading">
        <div className="min-w-0">
          <h1>{title}</h1>
          {description && <p className="cms-page-description">{description}</p>}
        </div>
        {actions && <div className="cms-page-actions">{actions}</div>}
      </div>
    </header>
  );
}
