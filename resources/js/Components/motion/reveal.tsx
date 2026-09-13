import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Scroll-triggered entrance for a page section (FR-P10: microinteraction that
 * supports rather than distracts).
 *
 * Progressive enhancement, deliberately. The section renders visible and the
 * hidden state is only applied after mount, so a visitor whose JavaScript never
 * arrives still reads the whole page. Driving it from `initial={{opacity: 0}}`
 * instead — the obvious Framer Motion spelling the arch document suggests —
 * ships `style="opacity:0"` in the server HTML, which leaves everything below
 * the hero invisible whenever the bundle fails. That trade is not worth an
 * animation.
 *
 * The animation itself is CSS, so it costs no JavaScript beyond one shared
 * IntersectionObserver.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  /** Milliseconds. Used to stagger siblings. */
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article';
}) {
  const ref = React.useRef<HTMLElement>(null);
  const [armed, setArmed] = React.useState(false);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Honour the OS setting: no hidden state, no observer, nothing to undo.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Anything already on screen at mount stays visible — hiding it first would
    // read as a flash rather than an entrance.
    if (node.getBoundingClientRect().top < window.innerHeight - 80) {
      setArmed(true);
      setShown(true);
      return;
    }

    setArmed(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -80px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn(className, armed && 'reveal', shown && 'reveal-in')}
      style={armed && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
