import { Head } from '@inertiajs/react';
import * as React from 'react';
import { PublicTemplate } from '@/Components/templates/PublicTemplate';
import { useTranslations } from '@/lib/i18n';

/**
 * Shell for every public page.
 *
 * Canonical, hreflang and JSON-LD are NOT rendered here — the server writes
 * them into the root Blade view from the `seo` prop, so they are in the HTML
 * even if the bundle never loads. This only sets the document title and
 * description, which Inertia's Head manages across client-side visits.
 */
export default function SiteLayout({
    title,
    description,
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    const meta = useTranslations('meta');
    const actions = useTranslations('actions');
    const siteName = meta('siteName');

    return (
        <>
            <Head>
                <title>{title ? `${title} · ${siteName}` : `${siteName} — ${meta('siteTagline')}`}</title>
                <meta name="description" content={description ?? meta('defaultDescription')} />
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={title ?? siteName} />
                <meta property="og:description" content={description ?? meta('defaultDescription')} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>

            <a href="#main-content" className="skip-link">
                {actions('skipToContent')}
            </a>

            <PublicTemplate>{children}</PublicTemplate>
        </>
    );
}
