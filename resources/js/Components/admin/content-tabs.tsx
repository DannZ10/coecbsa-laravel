import { Link } from '@inertiajs/react';
import { useTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const TABS = [
    { key: 'programs', href: '/admin/content/programs' },
    { key: 'partners', href: '/admin/content/partners' },
    { key: 'impact', href: '/admin/content/impact' },
] as const;

/**
 * Splits what used to be one 910-line page into three routes.
 *
 * Each section is a separate URL, so an editor can link a colleague straight to
 * the partner list and a validation failure on one section cannot discard
 * unsaved edits in the other two.
 */
export function ContentTabs({ current }: { current: (typeof TABS)[number]['key'] }) {
    const t = useTranslations('admin.content');

    return (
        <nav aria-label={t('sections')} className="flex gap-1 border-b border-line">
            {TABS.map((tab) => (
                <Link
                    key={tab.key}
                    href={tab.href}
                    aria-current={tab.key === current ? 'page' : undefined}
                    className={cn(
                        '-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition-colors',
                        tab.key === current
                            ? 'border-primary text-primary'
                            : 'border-transparent text-foreground-muted hover:text-foreground',
                    )}
                >
                    {t(tab.key)}
                </Link>
            ))}
        </nav>
    );
}
