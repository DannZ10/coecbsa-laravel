import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ThreeField } from "@/Components/atoms/ThreeField";
import { Button } from "@/Components/atoms/Button";
import { Kicker } from "@/Components/atoms/Kicker";
import { ImageWithFallback } from "@/Components/atoms/ImageWithFallback";
import { useI18n } from "@/lib/i18n";
import { hero, pillars } from "@/data/content";
import type { MotionValue } from "framer-motion";

const heroPhoto =
  "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=1600&h=2000&fit=crop&auto=format";

const ease = [0.22, 1, 0.36, 1] as const;

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
        <ImageWithFallback
          src={heroPhoto}
          alt="Komunitas dan lahan agroindustri berkelanjutan"
          className="h-full w-full object-cover"
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
      <ThreeField className="pointer-events-none absolute inset-0 opacity-70" />

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 items-center gap-8 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-12 lg:px-12">
        {/* Text column */}
        <motion.div style={{ y: textY, opacity: fade }} className="lg:col-span-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <Kicker tone="paper">{t(hero.eyebrow)}</Kicker>
          </motion.div>

          <h1
            onPointerMove={setTitleLightPosition}
            onPointerLeave={resetTitleLightPosition}
            className="mt-5 max-w-xl font-display text-[2rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 align-top">
                <motion.span
                  data-hero-title-word
                  className="hero-title-light inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.05, ease }}
                >
                  {w}&nbsp;
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease }}
            className="mt-5 max-w-md text-sm leading-relaxed text-forest-300 sm:text-base"
          >
            {t(hero.lead)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.58, ease }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button to="/program" variant="paper" from="left">
              {t(hero.primaryCta)}
            </Button>
            <Button to="/#impact" variant="outlinePaper" from="right">
              {t(hero.secondaryCta)}
            </Button>
          </motion.div>
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
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
    <motion.div
      className="absolute"
      style={{ top: spot.top, left: spot.left, x: tx, y: ty }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.6 + index * 0.12, ease }}
    >
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
  );
}
