import { Head, Link, usePage } from '@inertiajs/react';
import { FileText, Images, LibraryBig, Mail, Newspaper, PenLine } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/admin/button';
import { AdminPageHeader } from '@/Components/admin/page-header';
import { useLocale, useTranslations, type SharedProps } from '@/lib/i18n';
import { formatDate } from '@/lib/utils';

type Stats = {
    articles: number;
    published: number;
    drafts: number;
    scheduled: number;
    media: number;
    gallery: number;
    unread: number;
};

type Recent = {
    id: number;
    title_id: string;
    status: string;
    updated_at: string | null;
    category: string | null;
};

export default function Dashboard({ stats, recent }: { stats: Stats; recent: Recent[] }) {
    const t = useTranslations('admin.dashboard');
    const tNav = useTranslations('admin.nav');
    const tStatus = useTranslations('admin.status');
    const locale = useLocale();
    const user = usePage<SharedProps>().props.auth.user;

    const tiles = [
        { key: 'totalNews', value: stats.articles, icon: Newspaper, href: '/admin/news' },
        { key: 'published', value: stats.published, icon: FileText, href: '/admin/news?status=published' },
        { key: 'unpublished', value: stats.drafts + stats.scheduled, icon: PenLine, href: '/admin/news?status=draft' },
        { key: 'media', value: stats.media, icon: LibraryBig, href: '/admin/media' },
        { key: 'gallery', value: stats.gallery, icon: Images, href: '/admin/gallery' },
        { key: 'unread', value: stats.unread, icon: Mail, href: '/admin/contact?unread=1' },
    ] as const;

    return (
        <AdminLayout>
            <Head title={tNav('dashboard')} />

            <AdminPageHeader
                title={t('greeting', { name: user?.name ?? '' })}
                description={t('subtitle')}
                actions={
                    <Button asChild>
                        <Link href="/admin/news/create">
                            <PenLine className="h-4 w-4" aria-hidden />
                            {t('writeNews')}
                        </Link>
                    </Button>
                }
            />

            <h2 className="sr-only">{t('summaryLabel')}</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tiles.map((tile) => (
                    <li key={tile.key}>
                        <Link href={tile.href} className="cms-stat block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                            <span className="cms-stat-icon" aria-hidden>
                                <tile.icon className="h-5 w-5" />
                            </span>
                            <span className="cms-stat-heading">{t(tile.key)}</span>
                            <span className="cms-stat-value">{tile.value}</span>
                            <span className="cms-stat-rule" aria-hidden />
                        </Link>
                    </li>
                ))}
            </ul>

            <section className="mt-10">
                <h2 className="font-display text-base font-bold text-foreground">{t('recent')}</h2>
                {recent.length === 0 ? (
                    <p className="mt-2 text-sm text-foreground-muted">{t('recentEmpty')}</p>
                ) : (
                    <ul className="mt-3 divide-y divide-line">
                        {recent.map((article) => (
                            <li key={article.id}>
                                <Link href={`/admin/news/${article.id}/edit`} className="flex items-center gap-3 py-3">
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-foreground">{article.title_id}</p>
                                        <p className="truncate text-xs text-foreground-subtle">
                                            {tStatus(article.status)}
                                            {article.category ? ` · ${article.category}` : ''}
                                            {article.updated_at ? ` · ${formatDate(article.updated_at, locale)}` : ''}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </AdminLayout>
    );
}
