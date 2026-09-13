import SiteLayout from '@/Layouts/SiteLayout';
import { BeritaPage } from '@/Components/pages/BeritaPage';
import { useTranslations } from '@/lib/i18n';
import type { Article, Category } from '@/types/api';

export default function NewsIndex({
    articles,
    categories,
    page,
    totalPages,
    filters,
}: {
    articles: Article[];
    categories: Category[];
    page: number;
    totalPages: number;
    filters: { q?: string; category?: string };
}) {
    const nav = useTranslations('nav');

    return (
        <SiteLayout title={nav('news')}>
            <BeritaPage
                articles={articles}
                categories={categories}
                // Server-rendered: the list is either full or genuinely empty,
                // never "the API is down".
                available
                page={page}
                totalPages={totalPages}
                category={filters.category}
                query={filters.q}
            />
        </SiteLayout>
    );
}
