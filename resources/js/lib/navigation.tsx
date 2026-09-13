import { Link as InertiaLink, router, usePage } from '@inertiajs/react';
import * as React from 'react';

// Read straight from the shared prop rather than importing useLocale from
// ./i18n: that module imports this one, and the cycle is avoidable.
function currentLocale(): string {
    return (usePage().props as { locale?: string }).locale ?? 'id';
}

/**
 * Locale-aware navigation, replacing next-intl's `@/i18n/navigation`.
 *
 * Public routes are always locale-prefixed, so components keep writing
 * locale-relative hrefs ("/news") and the prefix is added here — the same
 * contract next-intl's Link had, so the ported components need no changes.
 */

export type LinkProps = Omit<React.ComponentProps<typeof InertiaLink>, 'href'> & {
    href: string;
    locale?: string;
};

export function Link({ href, locale, ...props }: LinkProps) {
    const current = currentLocale();

    return <InertiaLink href={localePath(href, locale ?? current)} {...props} />;
}

/** Locale-relative path of the current page, with the prefix removed. */
export function usePathname(): string {
    const url = usePage().url;
    const path = url.split('?')[0] ?? '/';
    const stripped = path.replace(/^\/(id|en)(?=\/|$)/, '');

    return stripped === '' ? '/' : stripped;
}

/**
 * Navigation by code, with the same push/replace shape the ported components
 * already call. `locale` swaps the prefix, which is how the language switch
 * moves between /id/... and /en/... without rebuilding the path by hand.
 */
export function useRouter() {
    const current = currentLocale();

    const visit = (href: string, options: { locale?: string; replace?: boolean } = {}) =>
        router.visit(localePath(href, options.locale ?? current), {
            replace: options.replace ?? false,
            preserveScroll: true,
        });

    return {
        push: (href: string, options?: { locale?: string }) => visit(href, options),
        replace: (href: string, options?: { locale?: string }) => visit(href, { ...options, replace: true }),
    };
}

export function localePath(href: string, locale: string): string {
    // Absolute URLs, anchors and mailto/tel links are left alone.
    if (/^([a-z]+:|\/\/|#)/i.test(href)) return href;

    const path = href === '/' ? '' : `/${href.replace(/^\//, '')}`;

    return `/${locale}${path}`;
}
