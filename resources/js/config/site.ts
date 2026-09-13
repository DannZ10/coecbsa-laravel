/** Static site-wide configuration (non-localized primitives). */
export const siteConfig = {
  /** Canonical public URL; overridden by NEXT_PUBLIC_SITE_URL at build time. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  phone: '+62 857-0197-7439',
  phoneHref: 'tel:+6285701977439',
  social: [
    { key: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/' },
    { key: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/' },
    { key: 'twitter', label: 'Twitter / X', href: 'https://twitter.com/' },
    { key: 'researchgate', label: 'ResearchGate', href: 'https://www.researchgate.net/' },
  ],
} as const;

/**
 * Primary navigation. `href` is the locale-relative path (the locale prefix is
 * added by next-intl's <Link>); `key` maps into the `nav` message namespace.
 */
export const navItems = [
  { key: 'about', href: '/about' },
  { key: 'structure', href: '/structure' },
  { key: 'focusAreas', href: '/focus-areas' },
  { key: 'programs', href: '/programs' },
  { key: 'news', href: '/news' },
  { key: 'gallery', href: '/gallery' },
  { key: 'contact', href: '/contact' },
] as const;

/** Subset used in the footer "Explore" column. */
export const footerNav = navItems;
