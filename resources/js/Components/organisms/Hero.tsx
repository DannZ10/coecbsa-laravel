import { Suspense, lazy, useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion";
// three.js is ~150 kB of JavaScript for a decorative particle drift. Loading
// it lazily keeps it out of the initial chunk and off the path to first paint;
// it is fetched only once the hero has mounted, and never when the visitor has
// asked for reduced motion.
const ThreeField = lazy(() =>
  import("@/Components/atoms/ThreeField").then((module) => ({ default: module.ThreeField })),
);
import { Button } from "@/Components/atoms/Button";
import { Kicker } from "@/Components/atoms/Kicker";
import { Picture } from "@/Components/atoms/Picture";
import { useI18n } from "@/lib/i18n";
import { hero, pillars } from "@/data/content";
import type { MotionValue } from "framer-motion";

const heroPhoto =
  "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=1600&h=2000&fit=crop&auto=format";


// Resting positions (percentages) for the floating pillar tags over the image.
const tagSpots = [
  { top: "16%", left: "8%", depth: 1.4, float: 10 },
  { top: "34%", left: "52%", depth: 0.8, float: -14 },
  { top: "58%", left: "18%", depth: 1.1, float: 12 },
  { top: "72%", left: "58%", depth: 0.6, float: -9 },
];

export function Hero() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Gated on mount, so the particle field is never part of the server render
  // or the first paint — the heading and the photograph are.
  const [showParticles, setShowParticles] = useState(false);
  useEffect(() => {
    if (reduce) return;
    // `in window` would narrow the else branch to never, so the callbacks are
    // read off the object instead.
    const requestIdle = window.requestIdleCallback;
    const cancelIdle = window.cancelIdleCallback;
    const start = () => setShowParticles(true);

    const handle = requestIdle ? requestIdle(start) : window.setTimeout(start, 400);

    return () => {
      if (cancelIdle) cancelIdle(handle);
      else window.clearTimeout(handle);
    };
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // Pointer parallax
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const imgX = useTransform(sx, [-0.5, 0.5], [24, -24]);
  const imgPY = useTransform(sy, [-0.5, 0.5], [16, -16]);
  const bgOffsetY = useTransform(
    [bgY, imgPY],
    ([scrollOffset, pointerOffset]) => Number(scrollOffset) + Number(pointerOffset),
  );

  const words = t(hero.title).split(" ");

  const setTitleLightPosition = (event: React.PointerEvent<HTMLHeadingElement>) => {
    const title = event.currentTarget;
    const words = title.querySelectorAll<HTMLElement>("[data-hero-title-word]");

    words.forEach((word) => {
      const rect = word.getBoundingClientRect();
      word.style.setProperty("--title-light-x", `${event.clientX - rect.left}px`);
      word.style.setProperty("--title-light-y", `${event.clientY - rect.top}px`);
    });
  };

  const resetTitleLightPosition = (event: React.PointerEvent<HTMLHeadingElement>) => {
    event.currentTarget
      .querySelectorAll<HTMLElement>("[data-hero-title-word]")
      .forEach((word) => {
        word.style.removeProperty("--title-light-x");
        word.style.removeProperty("--title-light-y");
      });
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative isolate min-h-[100svh] overflow-hidden bg-forest-900 text-paper"
    >
      {/* Background image + parallax */}
      <motion.div
        style={{ y: bgOffsetY, x: imgX }}
        className="absolute -inset-[18%] scale-110 will-change-transform"
      >
        {/* LCP: eager + high priority, and a ladder capped at the source width
            so mobile fetches ~viewport-sized art, not the full 1600×2000. The
            wrapper is scaled ~150% of the viewport, hence sizes. */}
        <Picture
          src={heroPhoto}
          alt="Komunitas dan lahan agroindustri berkelanjutan"
          fill
          priority
          sizes="150vw"
        />
      </motion.div>

      {/* Left-to-right green gradient: solid at left, revealing image at right */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(100deg, var(--forest-900) 6%, rgba(12,38,27,0.92) 30%, rgba(12,38,27,0.55) 55%, rgba(12,38,27,0.15) 80%, rgba(12,38,27,0.05) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 grain opacity-50" aria-hidden />
      {showParticles && (
        <Suspense fallback={null}>
          <ThreeField className="pointer-events-none absolute inset-0 opacity-70" />
        </Suspense>
      )}

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 items-center gap-8 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-12 lg:px-12">
        {/* Text column */}
        <motion.div style={{ y: textY, opacity: fade }} className="lg:col-span-6">
          <div className="hero-enter">
            <Kicker tone="paper">{t(hero.eyebrow)}</Kicker>
          </div>

          <h1
            onPointerMove={setTitleLightPosition}
            onPointerLeave={resetTitleLightPosition}
            className="mt-5 max-w-xl font-display text-[2rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 align-top">
                <span
                  data-hero-title-word
                  className="hero-title-light hero-word inline-block"
                  style={{ animationDelay: `${(0.04 + i * 0.02).toFixed(2)}s` }}
                >
                  {w}&nbsp;
                </span>
              </span>
            ))}
          </h1>

          <p
            className="hero-enter mt-5 max-w-md text-sm leading-relaxed text-forest-300 sm:text-base"
            style={{ animationDelay: '0.25s' }}
          >
            {t(hero.lead)}
          </p>

          <div
            className="hero-enter mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '0.35s' }}
          >
            <Button to="/program" variant="paper" from="left">
              {t(hero.primaryCta)}
            </Button>
            <Button to="/#impact" variant="outlinePaper" from="right">
              {t(hero.secondaryCta)}
            </Button>
          </div>
        </motion.div>

        {/* Interactive floating pillar tags */}
        <div className="relative hidden h-[440px] lg:col-span-6 lg:block">
          {pillars.map((p, i) => (
            <FloatingTag
              key={i}
              index={i}
              label={t(p.label)}
              note={t(p.note)}
              spot={tagSpots[i]!}
              sx={sx}
              sy={sy}
              reduce={!!reduce}
            />
          ))}
        </div>

        {/* Mobile: static pillar chips */}
        <div className="flex flex-wrap gap-2 lg:hidden">
          {pillars.map((p, i) => (
            <span
              key={i}
              className="rounded-full border border-paper/25 bg-forest-900/40 px-3 py-1.5 text-xs font-medium text-paper backdrop-blur-sm"
            >
              {t(p.label)}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      {/* No entrance animation on opacity: `fade` already owns this element's
          opacity, and an `initial` of 0 only served to hide it in the HTML. */}
      <motion.div
        style={{ opacity: fade }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[0.62rem] uppercase tracking-[0.3em] text-paper/60">Scroll</span>
        <span className="h-9 w-px overflow-hidden bg-paper/20">
          <motion.span
            className="block h-3 w-px bg-amber"
            animate={{ y: [-12, 36] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}

type Spot = { top: string; left: string; depth: number; float: number };

function FloatingTag({
  index,
  label,
  note,
  spot,
  sx,
  sy,
  reduce,
}: {
  index: number;
  label: string;
  note: string;
  spot: Spot;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  reduce: boolean;
}) {
  const [hover, setHover] = useState(false);
  const tx = useTransform(sx, [-0.5, 0.5], [spot.depth * 22, spot.depth * -22]);
  const ty = useTransform(sy, [-0.5, 0.5], [spot.depth * 16, spot.depth * -16]);

  return (
    // The entrance is CSS on a plain wrapper so nothing is hidden in the server
    // HTML; the inner element keeps the pointer parallax, and the two never
    // fight over `transform` because they are different elements.
    <div
      className="hero-enter absolute"
      style={{
        top: spot.top,
        left: spot.left,
        animationDelay: `${(0.6 + index * 0.12).toFixed(2)}s`,
      }}
    >
      <motion.div style={{ x: tx, y: ty }}>
      <motion.button
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        animate={reduce ? {} : { y: [0, spot.float, 0] }}
        transition={{ duration: 5 + Math.abs(spot.float) * 0.2, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.05 }}
        className="group flex flex-col items-start rounded-2xl border border-paper/20 bg-forest-900/45 px-4 py-2.5 text-left shadow-lg backdrop-blur-md"
      >
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber" />
          <span className="font-display text-base font-bold text-paper">{label}</span>
        </span>
        <motion.span
          initial={false}
          animate={{ height: hover ? "auto" : 0, opacity: hover ? 1 : 0, marginTop: hover ? 4 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden text-xs text-forest-300"
        >
          {note}
        </motion.span>
        </motion.button>
      </motion.div>
    </div>
  );
}
