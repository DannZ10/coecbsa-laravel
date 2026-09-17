import { ArrowLeft } from 'lucide-react';
import SiteLayout from '@/Layouts/SiteLayout';
import { Link } from '@/Components/atoms/RouteLink';
import { Kicker } from '@/Components/atoms/Kicker';
import { Picture } from '@/Components/atoms/Picture';
import { Reveal } from '@/Components/atoms/Reveal';
import { useLocale, useTranslations } from '@/lib/i18n';
import { formatDate } from '@/lib/utils';

type Article = {
    slug: string;
    title: string;
    excerpt: string | null;
    content: string;
    cover_image: string | null;
    published_at: string | null;
    updated_at: string | null;
    category: string | null;
    category_slug: string | null;
    author: string | null;
    tags: string[];
};

type Related = {
    slug: string;
    title: string;
    cover_image: string | null;
    published_at: string | null;
};

export default function NewsShow({ article, related }: { article: Article; related: Related[] }) {
    const locale = useLocale();
    const nav = useTranslations('nav');
    const t = useTranslations('news');

    return (
        <SiteLayout title={article.title} description={article.excerpt ?? undefined}>
            <article className="border-b border-border bg-paper">
                {article.cover_image && (
                    <div className="relative h-[38vh] min-h-[16rem] w-full overflow-hidden sm:h-[52vh]">
                        <Picture
                            src={article.cover_image}
                            alt=""
                            fill
                            priority
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/70 via-forest-900/10 to-transparent" aria-hidden />
                    </div>
                )}

                <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
                    <Link
                        to="/berita"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-forest-700 transition-colors hover:text-forest-900"
                    >
                        <ArrowLeft className="h-4 w-4" aria-hidden />
                        {t('backToList')}
                    </Link>

                    <header className="mt-6">
                        {article.category && <Kicker>{article.category}</Kicker>}
                        <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-forest-900 sm:text-4xl">
                            {article.title}
                        </h1>
                        <p className="mt-3 text-sm text-forest-800/70">
                            {article.published_at && formatDate(article.published_at, locale)}
                            {article.author && ` · ${article.author}`}
                        </p>
                        {article.excerpt && (
                            <p className="mt-5 text-lg leading-relaxed text-forest-800/85">{article.excerpt}</p>
                        )}
                    </header>

                    {/*
                     * The body is sanitised on save by App\Services\HtmlSanitizer,
                     * so what is stored is already the safe subset. Sanitising
                     * again here would be a second allowlist to keep in step
                     * with the first.
                     */}
                    <div
                        className="prose-article mt-8"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {article.tags.length > 0 && (
                        <ul className="mt-10 flex flex-wrap gap-2">
                            {article.tags.map((tag) => (
                                <li
                                    key={tag}
                                    className="rounded-full border border-forest-800/15 px-3 py-1 text-xs font-medium text-forest-800/80"
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </article>

            {related.length > 0 && (
                <section className="bg-paper-2 py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                        <Reveal>
                            <h2 className="font-display text-2xl font-extrabold tracking-tight text-forest-900">
                                {t('related')}
                            </h2>
                        </Reveal>

                        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((item, index) => (
                                <Reveal key={item.slug} delay={index * 0.08}>
                                    <li className="group overflow-hidden rounded-2xl border border-border bg-paper">
                                        <Link to={`/berita/${item.slug}`} className="block">
                                            <div className="aspect-[3/2] overflow-hidden bg-paper-2">
                                                {item.cover_image && (
                                                    <Picture
                                                        src={item.cover_image}
                                                        alt=""
                                                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                                        className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-[1.03]"
                                                    />
                                                )}
                                            </div>
                                            <div className="p-5">
                                                <p className="font-display text-base font-bold leading-snug text-forest-900">
                                                    {item.title}
                                                </p>
                                                {item.published_at && (
                                                    <p className="mt-2 text-xs text-forest-800/70">
                                                        {formatDate(item.published_at, locale)}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    </li>
                                </Reveal>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            <nav className="sr-only" aria-label={nav('label')}>
                <Link to="/berita">{nav('news')}</Link>
            </nav>
        </SiteLayout>
    );
}
