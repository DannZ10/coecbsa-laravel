import { motion } from 'framer-motion';
import { Button } from '@/Components/atoms/Button';
import { Link } from '@/Components/atoms/RouteLink';
import { Picture } from '@/Components/atoms/Picture';
import { formatDate } from '@/lib/utils';
import { pickLocale, type Article } from '@/types/api';

type Props = { article: Article; locale: string; index?: number };

/** The reference news card, populated from a published CMS article. */
export function NewsCard({ article, locale, index = 0 }: Props) {
  const title = pickLocale(locale, article.titleId, article.titleEn);
  const category = article.category
    ? pickLocale(locale, article.category.nameId, article.category.nameEn)
    : locale === 'id' ? 'Berita' : 'News';
  const to = `/news/${article.slug}`;

  return (
    <motion.article
      layout
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col"
    >
      <Link to={to} aria-label={title} className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
        <Picture
          src={article.coverImage || ''}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-[0.66rem] font-medium uppercase tracking-wider">
        <span className="rounded-full bg-forest-800/8 px-2.5 py-1 text-forest-700">{category}</span>
        {article.publishedAt && (
          <time dateTime={article.publishedAt} className="text-muted-foreground">
            {formatDate(article.publishedAt, locale)}
          </time>
        )}
      </div>
      <h3 className="mt-3 font-display text-base font-bold leading-snug text-forest-900 sm:text-lg">
        <Link to={to}>{title}</Link>
      </h3>
      <div className="mt-4">
        <Button to={to} variant="outline" from="left" className="px-4 py-2 text-xs">
          {locale === 'id' ? 'Baca selengkapnya' : 'Read more'}
        </Button>
      </div>
    </motion.article>
  );
}
