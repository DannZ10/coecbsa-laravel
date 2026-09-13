import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge conditional class names, de-duplicating conflicting Tailwind classes. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Combining diacritical marks, stripped after NFD decomposition. */
const DIACRITICS = /[̀-ͯ]/g;

/**
 * URL-friendly slug. Deliberately identical to `slugify` in
 * apps/api/src/lib/slug.ts: the editor sends the slug it shows, so the two must
 * agree or the saved URL would differ from the previewed one.
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Format an ISO date string for a given locale (falls back gracefully). */
export function formatDate(
  iso: string,
  locale: string,
  opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', opts).format(date);
}
