import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/Components/molecules/PageHeader';
import { NewsCard } from '@/Components/molecules/NewsCard';
import { Link } from '@/Components/atoms/RouteLink';
import { useI18n } from '@/lib/i18n';
import { usePathname, useRouter } from '@/lib/navigation';
import { news } from '@/data/content';
import { pickLocale, type Article, type Category } from '@/types/api';

type Props = {
  articles: Article[];
  categories: Category[];
  available: boolean;
  page: number;
  totalPages: number;
  category?: string;
  query?: string;
  sort?: string;
};

const DEFAULT_SORT = 'publishedAt:desc';

export function BeritaPage({
  articles,
  categories,
  available,
  page,
  totalPages,
  category,
  query,
  sort = DEFAULT_SORT,
}: Props) {
  const { t, lang } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState(query ?? '');
  const [sortValue, setSortValue] = useState(sort);

  useEffect(() => setSearch(query ?? ''), [query]);
  useEffect(() => setSortValue(sort), [sort]);

  function href(nextCategory = category, nextPage = 1, nextSort = sort) {
    const params = new URLSearchParams();
    if (nextCategory) params.set('category', nextCategory);
    if (query) params.set('q', query);
    if (nextSort && nextSort !== DEFAULT_SORT) params.set('sort', nextSort);
    if (nextPage > 1) params.set('page', String(nextPage));
    return `/news${params.size ? `?${params}` : ''}`;
  }

  function submitFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    const trimmedSearch = search.trim();
    if (category) params.set('category', category);
    if (trimmedSearch) params.set('q', trimmedSearch);
    if (sortValue !== DEFAULT_SORT) params.set('sort', sortValue);
    router.push(`${pathname}${params.size ? `?${params}` : ''}`);
  }

  // The categories endpoint may contain configured-but-unused categories.
  // Keep the filter on “All” until at least one news item is available.
  const hasCategories = categories.length > 0;

  return (
    <>
      <PageHeader
        no="06"
        kicker={t(news.kicker)}
        title={t({ id: 'Kabar dari lapangan.', en: 'News from the field.' })}
        lead={t({
          id: 'Dokumentasi kegiatan, kolaborasi, dan capaian terbaru CoE CBSA.',
          en: "Documentation of CoE CBSA's latest activities, collaborations, and achievements.",
        })}
        backgroundImage={news.items[0]!.image}
      />
      <section className="bg-paper py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <form
            onSubmit={submitFilters}
            className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:p-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(10rem,.7fr)_minmax(12rem,.8fr)_auto] lg:items-end"
          >
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-forest-700">
                {t({ id: 'Cari berita', en: 'Search news' })}
              </span>
              <span className="flex items-center rounded-xl border border-border bg-paper px-4 transition-colors focus-within:border-forest-500">
                <span aria-hidden className="mr-3 text-lg text-amber">
                  ⌕
                </span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t({
                    id: 'Cari judul atau kata kunci…',
                    en: 'Search a title or keyword…',
                  })}
                  className="min-h-11 w-full bg-transparent text-sm text-forest-900 outline-none placeholder:text-muted-foreground"
                  type="search"
                />
              </span>
            </label>

            <div className="contents">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-forest-700">
                  {t({ id: 'Filter', en: 'Filter' })}
                </span>
                <select
                  value={category ?? ''}
                  onChange={(event) => {
                    const next = event.target.value;
                    const params = new URLSearchParams();
                    if (next) params.set('category', next);
                    if (search.trim()) params.set('q', search.trim());
                    if (sortValue !== DEFAULT_SORT) params.set('sort', sortValue);
                    router.push(`${pathname}${params.size ? `?${params}` : ''}`);
                  }}
                  disabled={!hasCategories}
                  className="min-h-11 w-full rounded-xl border border-border bg-paper px-3 text-sm text-forest-900 outline-none focus:border-forest-500 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label={t({ id: 'Filter kategori', en: 'Category filter' })}
                >
                  <option value="">{t({ id: 'Semua', en: 'All' })}</option>
                  {hasCategories &&
                    categories.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {pickLocale(lang, item.nameId, item.nameEn)}
                      </option>
                    ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-forest-700">
                  {t({ id: 'Urutkan', en: 'Sort' })}
                </span>
                <select
                  value={sortValue}
                  onChange={(event) => setSortValue(event.target.value)}
                  className="min-h-11 w-full rounded-xl border border-border bg-paper px-3 text-sm text-forest-900 outline-none focus:border-forest-500"
                  aria-label={t({ id: 'Urutan berita', en: 'News sorting' })}
                >
                  <option value="publishedAt:desc">{t({ id: 'Terbaru', en: 'Newest' })}</option>
                  <option value="publishedAt:asc">{t({ id: 'Terlama', en: 'Oldest' })}</option>
                  <option value="createdAt:desc">
                    {t({ id: 'Baru ditambahkan', en: 'Recently added' })}
                  </option>
                  <option value="titleId:asc">{t({ id: 'Judul A–Z', en: 'Title A–Z' })}</option>
                  <option value="titleId:desc">{t({ id: 'Judul Z–A', en: 'Title Z–A' })}</option>
                </select>
              </label>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <button
                type="submit"
                className="rounded-full bg-forest-800 px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-forest-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t({ id: 'Terapkan', en: 'Apply' })}
              </button>
              {(query || category || sort !== DEFAULT_SORT) && (
                <Link
                  to="/news"
                  className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-forest-800 transition-colors hover:border-forest-700"
                >
                  {t({ id: 'Atur ulang', en: 'Reset' })}
                </Link>
              )}
            </div>
          </form>

          {!available || articles.length === 0 ? (
            <div
              className="mt-10 rounded-2xl border border-border bg-card px-6 py-16 text-center"
              role="status"
            >
              <h2 className="font-display text-xl font-bold text-forest-900">
                {available
                  ? t({ id: 'Belum ada berita.', en: 'No news yet.' })
                  : t({ id: 'Berita belum dapat dimuat.', en: 'News is temporarily unavailable.' })}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                {available
                  ? t({
                      id: 'Kabar dan dokumentasi terbaru akan ditampilkan di sini.',
                      en: 'The latest updates and documentation will appear here.',
                    })
                  : t({
                      id: 'Silakan coba kembali beberapa saat lagi.',
                      en: 'Please try again in a moment.',
                    })}
              </p>
              {(category || query) && (
                <Link
                  to="/news"
                  className="mt-5 inline-block text-sm font-medium text-forest-700 underline"
                >
                  {t({ id: 'Lihat semua berita', en: 'View all news' })}
                </Link>
              )}
            </div>
          ) : (
            <motion.div layout className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {articles.map((article, index) => (
                <NewsCard key={article.id} article={article} locale={lang} index={index} />
              ))}
            </motion.div>
          )}
          {totalPages > 1 && (
            <nav
              aria-label={t({ id: 'Halaman berita', en: 'News pages' })}
              className="mt-12 flex flex-wrap items-center justify-center gap-3 text-sm"
            >
              {page > 1 && (
                <Link
                  to={href(category, page - 1)}
                  className="rounded-full border border-border px-5 py-2.5 hover:border-forest-700"
                >
                  {t({ id: 'Sebelumnya', en: 'Previous' })}
                </Link>
              )}
              <span className="px-3 text-muted-foreground">
                {page} / {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  to={href(category, page + 1)}
                  className="rounded-full border border-border px-5 py-2.5 hover:border-forest-700"
                >
                  {t({ id: 'Selanjutnya', en: 'Next' })}
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
