import * as React from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  /** Seconds, to stagger siblings. */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
};

/**
 * Scroll-triggered fade-and-rise for a section.
 *
 * Progressive enhancement, deliberately. The element renders visible and the
 * hidden state is only applied after mount, so a visitor whose JavaScript never
 * arrives still reads the whole page. Driving it from Framer Motion's
 * `initial={{opacity: 0}}` instead ships `style="opacity:0"` in the server
 * HTML, which leaves the section invisible whenever the bundle fails — and
 * makes first paint wait for hydration even when it does not. Suppressing that
 * with `initial={false}` keeps the HTML visible but leaves no entrance at all.
 * This does both.
 *
 * The animation itself is CSS, so it costs no JavaScript beyond one
 * IntersectionObserver per element.
 */
export function Reveal({ children, delay = 0, className, as: Tag = "div" }: RevealProps) {
  const ref = React.useRef<HTMLElement>(null);
  const [armed, setArmed] = React.useState(false);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Honour the OS setting: no hidden state, no observer, nothing to undo.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
      // The top margin is deliberately enormous. Without it an element that the
      // viewport jumps *past* — an anchor link, a restored scroll position, a
      // programmatic scrollIntoView further down — goes from "below the
      // viewport" to "above the viewport" without ever intersecting, so the
      // observer never fires and the section stays hidden for good. Treating
      // everything at or above the viewport as intersecting means the entrance
      // is skipped for content already scrolled past, which is the right
      // outcome, instead of losing it.
      { rootMargin: "100000px 0px -80px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn(className, armed && "reveal", shown && "reveal-in")}
      style={armed && delay ? { transitionDelay: `${Math.round(delay * 1000)}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
