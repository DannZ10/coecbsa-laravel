import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

/** One entry of Laravel's paginator `links` array. */
export type PaginatorLink = { url: string | null; label: string; active: boolean };

export type Paginated<T> = {
    data: T[];
    links: PaginatorLink[];
    current_page: number;
    last_page: number;
    total: number;
};

const itemBase =
    'inline-flex h-11 min-w-11 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus';

/**
 * Renders Laravel's paginator links.
 *
 * Paging always lives in the URL now, so a page of results can be bookmarked
 * and survives a refresh. That also removes the previous component's second
 * mode, where admin lists paged through component state instead.
 */
export function Pagination({
    links,
    label,
    className,
}: {
    links: PaginatorLink[];
    label: string;
    className?: string;
}) {
    // Two arrows and one page: nothing to choose between.
    if (links.length <= 3) return null;

    return (
        <nav aria-label={label} className={cn('flex flex-wrap items-center justify-center gap-1', className)}>
            {links.map((link, index) => {
                // Laravel puts the arrow glyphs in the label as HTML entities.
                const text = link.label
                    .replace('&laquo;', '‹')
                    .replace('&raquo;', '›')
                    .replace(/&hellip;/g, '…');

                if (link.url === null) {
                    return (
                        <span
                            key={`${link.label}-${index}`}
                            aria-disabled
                            className={cn(itemBase, 'cursor-not-allowed text-foreground-subtle opacity-55')}
                        >
                            {text}
                        </span>
                    );
                }

                if (link.active) {
                    return (
                        <span key={`${link.label}-${index}`} aria-current="page" className={cn(itemBase, 'bg-primary text-primary-fg')}>
                            {text}
                        </span>
                    );
                }

                return (
                    <Link
                        key={`${link.label}-${index}`}
                        href={link.url}
                        preserveScroll
                        className={cn(itemBase, 'text-foreground-muted hover:bg-surface-2 hover:text-foreground')}
                    >
                        {text}
                    </Link>
                );
            })}
        </nav>
    );
}
