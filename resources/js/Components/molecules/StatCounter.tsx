import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Counts up numeric values on scroll into view. Non-numeric prefixes/suffixes
 * (e.g. "~", "70") are preserved.
 */
export function StatCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState("0");

  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
  const prefix = match?.[1] ?? "";
  const numeric = match ? parseFloat(match[2]!) : NaN;
  const suffix = match?.[3] ?? "";

  useEffect(() => {
    if (!inView) return;
    if (isNaN(numeric)) {
      setDisplay(value);
      return;
    }
    if (reduce) {
      setDisplay(`${prefix}${numeric}${suffix}`);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1100;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = numeric % 1 === 0 ? Math.round(numeric * eased) : (numeric * eased).toFixed(1);
      setDisplay(`${prefix}${current}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, numeric, prefix, suffix, reduce, value]);

  return <span ref={ref}>{display}</span>;
}
