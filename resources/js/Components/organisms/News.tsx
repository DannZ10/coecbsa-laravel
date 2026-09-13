import { SectionHeading } from '@/Components/molecules/SectionHeading';
import { NewsCard } from '@/Components/molecules/NewsCard';
import { Button } from '@/Components/atoms/Button';
import { useI18n } from '@/lib/i18n';
import { news } from '@/data/content';
import type { Article } from '@/types/api';

export function News({ articles, available }: { articles: Article[]; available: boolean }) {
  const { t, lang } = useI18n();
  return (
    <section className="relative border-b border-border bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading no="05" kicker={t(news.kicker)} title={t(news.title)} />
          <Button to="/berita" variant="outline" from="left" className="shrink-0">{t(news.cta)}</Button>
        </div>
        {articles.length ? (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {articles.map((article, index) => <NewsCard key={article.id} article={article} locale={lang} index={index} />)}
          </div>
        ) : (
          <p role="status" className="mt-12 rounded-2xl border border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
            {available
              ? t({ id: 'Kabar terbaru akan hadir di sini.', en: 'The latest news will appear here.' })
              : t({ id: 'Berita sementara belum tersedia. Silakan coba lagi nanti.', en: 'News is temporarily unavailable. Please try again later.' })}
          </p>
        )}
      </div>
    </section>
  );
}
