import { ChevronRight } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { Link } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export type Crumb = {
  label: string;
  /** Locale-relative href; omit for the current (last) page. */
  href?: string;
};

/**
 * Accessible breadcrumb trail. The leading "Home" crumb is added automatically.
 * JSON-LD BreadcrumbList is emitted separately in the SEO layer (F7).
 */
export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  const t = useTranslations('breadcrumb');
  const trail: Crumb[] = [{ label: t('home'), href: '/' }, ...items];

  return (
    <nav aria-label={t('label')} className={cn('text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-foreground-muted">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
              {crumb.href && !last ? (
                <Link
                  href={crumb.href}
                  className="rounded-sm transition-colors duration-fast hover:text-link-hover"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className="font-medium text-foreground">
                  {crumb.label}
                </span>
              )}
              {!last && (
                <ChevronRight className="h-3.5 w-3.5 text-foreground-subtle" aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
