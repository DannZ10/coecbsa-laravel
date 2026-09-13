import { Picture as Image } from '@/Components/atoms/Picture';
import { CalendarDays, ImageOff } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { pickLocale, type Article } from '@/types/api';
import { formatDate } from '@/lib/utils';
import { Badge } from './badge';

/**
 * `headingLevel` follows the surrounding page: on the news index the cards sit
 * directly under the page `h1`, on the home page they sit under a section `h2`.
 * Hardcoding one of them makes the other skip a level.
 *
 * Borderless: the cover image is the card's edge, so a border and shadow around
 * it only add a second frame. Hover lifts the image, not the whole box.
 */
export function NewsCard({
  article,
  locale,
  headingLevel: Heading = 'h3',
}: {
  article: Article;
  locale: string;
  headingLevel?: 'h2' | 'h3';
}) {
  const title = pickLocale(locale, article.titleId, article.titleEn);
  const excerpt = pickLocale(locale, article.excerptId, article.excerptEn);
  const category = article.category
    ? pickLocale(locale, article.category.nameId, article.category.nameEn)
    : null;

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-surface-2">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
            className="object-cover transition-transform duration-slow ease-standard group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-foreground-subtle">
            <ImageOff className="h-8 w-8" aria-hidden />
          </div>
        )}
        {category && (
          <Badge variant="solid" size="sm" className="absolute left-3 top-3">
            {category}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 pt-5">
        {article.publishedAt && (
          <p className="flex items-center gap-1.5 text-xs text-foreground-subtle">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
          </p>
        )}
        <Heading className="font-display text-lg font-bold leading-snug tracking-tight text-foreground">
          <Link
            href={`/news/${article.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:text-primary"
          >
            {title}
          </Link>
        </Heading>
        {excerpt && (
          <p className="line-clamp-3 text-sm leading-relaxed text-foreground-muted">{excerpt}</p>
        )}
      </div>
    </article>
  );
}
