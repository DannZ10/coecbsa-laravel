import { ArrowRight } from 'lucide-react';
import { Link } from '@/lib/navigation';
import type { IconName } from '@/types/content';
import { ContentIcon } from './icon';

/**
 * ProgramCard / FocusArea card (design-system §7): icon, title, description, and
 * an optional link.
 *
 * Borderless by design. These sit inside a hairline-divided grid, so the cell
 * boundary is already drawn by the grid itself — giving each card its own border
 * and shadow on top of that is the frame-inside-a-frame that made the page read
 * as a template. When `href` is set the whole cell is the link target.
 */
export function ProgramCard({
  icon,
  title,
  description,
  href,
  linkLabel,
  headingLevel: Heading = 'h3',
}: {
  icon: IconName;
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
  /**
   * Follows the surrounding page: the focus-areas grid sits directly under the
   * page `h1`, the home-page preview under a section `h2`. Hardcoding one of
   * them makes the other skip a level.
   */
  headingLevel?: 'h2' | 'h3';
}) {
  return (
    <article className="group relative flex h-full flex-col gap-4 p-6 transition-colors duration-base ease-standard hover:bg-surface sm:p-8">
      <span className="text-primary">
        <ContentIcon name={icon} className="h-6 w-6" />
      </span>
      <Heading className="font-display text-lg font-bold leading-snug tracking-tight text-foreground">
        {href ? (
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:text-primary"
          >
            {title}
          </Link>
        ) : (
          title
        )}
      </Heading>
      <p className="flex-1 text-sm leading-relaxed text-foreground-muted">{description}</p>
      {href && linkLabel && (
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-link transition-transform duration-base ease-standard group-hover:translate-x-0.5">
          {linkLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </span>
      )}
    </article>
  );
}
