import { Head, Link, router } from '@inertiajs/react';
import { Newspaper, Pencil, Plus, Search } from 'lucide-react';
import * as React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/admin/button';
import { AdminPageHeader } from '@/Components/admin/page-header';
import { EmptyState } from '@/Components/ui/empty-state';
import { Input } from '@/Components/ui/input';
import { Pagination, type Paginated } from '@/Components/ui/pagination';
import { useLocale, useTranslations } from '@/lib/i18n';
import { cn, formatDate } from '@/lib/utils';

type Row = {
    id: number;
    slug: string;
    title_id: string;
    title_en: string | null;
    status: string;
    published_at: string | null;
    category: string | null;
    author: string | null;
    cover_image: string | null;
};

type Filters = { q?: string; status?: string; category?: string };

const STATUS_TONE: Record<string, string> = {
    published: 'bg-success-bg text-success-fg',
    scheduled: 'bg-warning-bg text-warning-fg',
    draft: 'bg-surface-2 text-foreground-muted',
};

export default function NewsIndex({
    articles,
    filters,
    categories,
    statuses,
}: {
    articles: Paginated<Row>;
    filters: Filters;
    categories: { id: number; slug: string; name: string }[];
    statuses: string[];
}) {
    const t = useTranslations('admin.news');
    const tCommon = useTranslations('admin.common');
    const tStatus = useTranslations('admin.status');
    const locale = useLocale();

    const [q, setQ] = React.useState(filters.q ?? '');

    /** Every filter is a URL parameter, so a filtered list can be shared and survives a refresh. */
    function apply(next: Filters) {
        router.get('/admin/news', { ...filters, q, ...next }, { preserveState: true, replace: true });
    }

    return (
        <AdminLayout>
            <Head title={t('title')} />

            <AdminPageHeader
                index="02"
                title={t('title')}
                description={t('subtitle')}
                actions={
                    <Button asChild>
                        <Link href="/admin/news/create">
                            <Plus className="h-4 w-4" aria-hidden />
                            {t('create')}
                        </Link>
                    </Button>
                }
            />

            <form
                className="flex flex-wrap items-end gap-3 border-y border-line py-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    apply({});
                }}
            >
                <div className="relative min-w-[14rem] flex-1">
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle"
                        aria-hidden
                    />
                    <Input
                        value={q}
                        onChange={(event) => setQ(event.target.value)}
                        placeholder={t('searchPlaceholder')}
                        aria-label={tCommon('search')}
                        className="pl-9"
                    />
                </div>

                <select
                    value={filters.status ?? ''}
                    onChange={(event) => apply({ status: event.target.value || undefined })}
                    aria-label={tCommon('status')}
                    className="h-11 rounded-md border border-line bg-surface px-3 text-sm text-foreground"
                >
                    <option value="">{t('allStatuses')}</option>
                    {statuses.map((status) => (
                        <option key={status} value={status}>
                            {tStatus(status)}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.category ?? ''}
                    onChange={(event) => apply({ category: event.target.value || undefined })}
                    aria-label={tCommon('category')}
                    className="h-11 rounded-md border border-line bg-surface px-3 text-sm text-foreground"
                >
                    <option value="">{t('allCategories')}</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <Button type="submit" variant="secondary">
                    {tCommon('apply')}
                </Button>
            </form>

            {articles.data.length === 0 ? (
                <EmptyState
                    icon={Newspaper}
                    title={t('empty')}
                    description={t('emptyBody')}
                    className="mt-6"
                />
            ) : (
                <ul className="divide-y divide-line">
                    {articles.data.map((article) => (
                        <li key={article.id} className="flex items-center gap-4 py-3">
                            {article.cover_image ? (
                                <img
                                    src={article.cover_image}
                                    alt=""
                                    width={96}
                                    height={64}
                                    loading="lazy"
                                    className="hidden h-16 w-24 shrink-0 rounded-md object-cover sm:block"
                                />
                            ) : (
                                <span className="hidden h-16 w-24 shrink-0 rounded-md bg-surface-2 sm:block" aria-hidden />
                            )}

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-foreground">{article.title_id}</p>
                                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-foreground-subtle">
                                    <span className={cn('rounded px-1.5 py-0.5 font-medium', STATUS_TONE[article.status])}>
                                        {tStatus(article.status)}
                                    </span>
                                    {article.category && <span>· {article.category}</span>}
                                    {article.published_at && <span>· {formatDate(article.published_at, locale)}</span>}
                                    {article.author && <span>· {article.author}</span>}
                                </p>
                            </div>

                            <Button asChild variant="ghost" size="icon">
                                <Link href={`/admin/news/${article.id}/edit`} aria-label={tCommon('editAria', { name: article.title_id })}>
                                    <Pencil className="h-4 w-4" aria-hidden />
                                </Link>
                            </Button>
                        </li>
                    ))}
                </ul>
            )}

            <Pagination links={articles.links} label={tCommon('page')} className="mt-8" />
        </AdminLayout>
    );
}
