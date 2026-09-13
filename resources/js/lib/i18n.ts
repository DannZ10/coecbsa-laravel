import { usePage } from '@inertiajs/react';
import { usePathname, useRouter } from '@/lib/navigation';

/**
 * Replacement for next-intl, sized to what this app actually uses: namespaced
 * lookup and `{placeholder}` interpolation.
 *
 * The catalogue arrives as an Inertia shared prop, so it is already in the
 * server-rendered HTML — there is no locale flash and no second request.
 */

type Messages = Record<string, unknown>;

export type SharedProps = {
    locale: string;
    translations: Messages;
    auth: { user: { id: number; name: string; email: string; role: string } | null };
    flash: { success: string | null; error: string | null };
};

function lookup(messages: Messages, path: string): unknown {
    return path
        .split('.')
        .reduce<unknown>(
            (node, key) =>
                node && typeof node === 'object' ? (node as Messages)[key] : undefined,
            messages,
        );
}

function interpolate(template: string, values?: Record<string, string | number>): string {
    if (!values) return template;
    return template.replace(/\{(\w+)\}/g, (match, key: string) =>
        key in values ? String(values[key]) : match,
    );
}

export function useLocale(): string {
    return usePage<SharedProps>().props.locale;
}

/**
 * `const t = useTranslations('admin.nav')` then `t('news')`.
 *
 * A missing key returns the full path rather than an empty string: a visible
 * `admin.nav.news` in the UI is a bug report, a blank label is a mystery.
 */
export function useTranslations(namespace?: string) {
    const messages = usePage<SharedProps>().props.translations;

    return (key: string, values?: Record<string, string | number>): string => {
        const path = namespace ? `${namespace}.${key}` : key;
        const value = lookup(messages, path);

        return typeof value === 'string' ? interpolate(value, values) : path;
    };
}

/** Whole sub-tree, for the places that render a list straight from the catalogue. */
export function useMessages<T = unknown>(path: string): T | undefined {
    return lookup(usePage<SharedProps>().props.translations, path) as T | undefined;
}

/* ------------------------------------------------------------------ *
 * Bilingual literals
 *
 * The landing organisms hold their copy inline as `bi('teks', 'text')`
 * pairs rather than catalogue keys. Keeping that shape means those
 * components port across unchanged; `t()` below is the same function they
 * already call.
 * ------------------------------------------------------------------ */

export type Lang = 'id' | 'en';
export type Bi = { id: string; en: string };

export const bi = (id: string, en: string): Bi => ({ id, en });

export function useI18n() {
    const lang = useLocale() as Lang;
    const { replace } = useRouter();
    const path = usePathname();

    return {
        lang,
        // Switching language is a server visit now, not a client-side locale
        // swap, so the new page arrives already rendered in the other language.
        setLang: (next: Lang) => next !== lang && replace(path, { locale: next }),
        // Indonesian is the source language and always present, so it is also
        // the fallback for an unfinished translation.
        t: (value: Bi) => value[lang] ?? value.id,
    };
}
