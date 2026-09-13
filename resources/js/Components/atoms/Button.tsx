import { useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@/Components/atoms/RouteLink";

type Variant = "primary" | "paper" | "outline" | "outlinePaper";
type Dir = "left" | "right" | "up" | "down";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  to?: string;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  arrow?: boolean;
  /** Fallback fill direction used before the cursor is tracked / reduced motion. */
  from?: Dir;
  external?: boolean;
};

/**
 * Base and hover fills both carry a subtle gradient. The hover fill slides in
 * from the exact edge/corner the cursor crosses, and slides back out toward the
 * edge it leaves — a directional "fill-in" that tracks the pointer.
 */
const styles: Record<Variant, { base: string; fill: string; text: string; hoverText: string }> = {
  primary: {
    base: "bg-gradient-to-br from-forest-700 to-forest-900 text-primary-foreground",
    fill: "bg-gradient-to-br from-amber-soft to-amber",
    text: "text-primary-foreground",
    hoverText: "group-hover:text-accent-foreground",
  },
  paper: {
    base: "bg-gradient-to-br from-paper to-paper-2 text-forest-900",
    fill: "bg-gradient-to-br from-forest-700 to-forest-900",
    text: "text-forest-900",
    hoverText: "group-hover:text-paper",
  },
  outline: {
    base: "border border-forest-800/25 bg-gradient-to-br from-transparent to-forest-800/[0.04] text-forest-800",
    fill: "bg-gradient-to-br from-forest-700 to-forest-900",
    text: "text-forest-800",
    hoverText: "group-hover:text-paper",
  },
  outlinePaper: {
    base: "border border-paper/30 bg-gradient-to-br from-transparent to-paper/[0.06] text-paper",
    fill: "bg-gradient-to-br from-paper to-paper-2",
    text: "text-paper",
    hoverText: "group-hover:text-forest-900",
  },
};

const fallbackOffset: Record<Dir, { x: string; y: string }> = {
  left: { x: "-101%", y: "0%" },
  right: { x: "101%", y: "0%" },
  up: { x: "0%", y: "-101%" },
  down: { x: "0%", y: "101%" },
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Button({
  children,
  href,
  to,
  variant = "primary",
  className = "",
  onClick,
  arrow = true,
  from = "left",
  external = false,
}: ButtonProps) {
  const s = styles[variant];
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [hover, setHover] = useState(false);
  const [offset, setOffset] = useState(fallbackOffset[from]);

  /** Snap the entry/exit point to the nearest edge or corner of the button. */
  const edgeOffset = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return fallbackOffset[from];
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const fx = px < 0.34 ? -1 : px > 0.66 ? 1 : 0;
    const fy = py < 0.34 ? -1 : py > 0.66 ? 1 : 0;
    if (fx === 0 && fy === 0) {
      // Pointer in the core — pick the nearest single edge.
      const d = { left: px, right: 1 - px, top: py, bottom: 1 - py };
      const min = Math.min(d.left, d.right, d.top, d.bottom);
      if (min === d.left) return { x: "-101%", y: "0%" };
      if (min === d.right) return { x: "101%", y: "0%" };
      if (min === d.top) return { x: "0%", y: "-101%" };
      return { x: "0%", y: "101%" };
    }
    return { x: `${fx * 101}%`, y: `${fy * 101}%` };
  };

  const onEnter = (e: React.MouseEvent) => {
    if (reduce) return setHover(true);
    setOffset(edgeOffset(e));
    // Let the entry offset paint before revealing, so it slides from that side.
    requestAnimationFrame(() => setHover(true));
  };
  const onLeave = (e: React.MouseEvent) => {
    if (reduce) return setHover(false);
    setOffset(edgeOffset(e));
    setHover(false);
  };

  const cls = `group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${s.base} ${className}`;

  const inner = (
    <>
      <motion.span
        aria-hidden
        className={`absolute inset-0 z-0 ${s.fill}`}
        initial={false}
        animate={hover ? { x: "0%", y: "0%" } : offset}
        transition={{ duration: 0.55, ease }}
      />
      <span className={`relative z-10 inline-flex items-center gap-2 transition-colors duration-300 ${s.text} ${s.hoverText}`}>
        {children}
        {arrow && (
          <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
            →
          </span>
        )}
      </span>
    </>
  );

  const shared = { className: cls, onMouseEnter: onEnter, onMouseLeave: onLeave, onClick };

  if (to) {
    return (
      <Link to={to} ref={ref as React.Ref<HTMLAnchorElement>} {...shared}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...shared}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} {...shared}>
      {inner}
    </button>
  );
}
