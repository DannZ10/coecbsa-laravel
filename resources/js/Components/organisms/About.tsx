import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Reveal } from "@/Components/atoms/Reveal";
import { Kicker } from "@/Components/atoms/Kicker";
import { Button } from "@/Components/atoms/Button";
import { Picture } from "@/Components/atoms/Picture";
import { useI18n } from "@/lib/i18n";
import { about } from "@/data/content";

const ease = [0.22, 1, 0.36, 1] as const;

/** Diamond documentation tiles flanking the heading — random size, layer,
 *  opacity, blur; drift at their own pace as the section scrolls by. */
const docs = [
  { src: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=400&fit=crop&auto=format", top: "2%", left: "3%", size: 116, blur: 3, opacity: 0.45, speed: -70 },
  { src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop&auto=format", top: "40%", left: "9%", size: 150, blur: 0.5, opacity: 0.9, speed: -140 },
  { src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300&h=300&fit=crop&auto=format", top: "72%", left: "2%", size: 96, blur: 4, opacity: 0.4, speed: -40 },
  { src: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=400&h=400&fit=crop&auto=format", top: "0%", left: "82%", size: 132, blur: 1, opacity: 0.85, speed: -110 },
  { src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=300&fit=crop&auto=format", top: "44%", left: "88%", size: 104, blur: 3, opacity: 0.5, speed: -60 },
  { src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=300&fit=crop&auto=format", top: "74%", left: "83%", size: 88, blur: 5, opacity: 0.35, speed: -170 },
];

export function About() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-border bg-paper py-24 sm:py-32">
      {/* Scattered diamond documentation, hidden on small screens */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
        <div className="relative mx-auto h-full max-w-6xl">
          {docs.map((d, i) => (
            <DocDiamond key={i} d={d} progress={scrollYProgress} index={i} />
          ))}
        </div>
      </div>

      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5 px-5 text-center sm:px-8">
        <Reveal>
          <Kicker no="01">{t(about.kicker)}</Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-forest-900 sm:text-3xl md:text-4xl">
            {t(about.title)}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t(about.body)}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-1">
            <Button to="/tentang" variant="outline" from="down">
              {t(about.cta)}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

type Doc = (typeof docs)[number];

function DocDiamond({ d, progress, index }: { d: Doc; progress: MotionValue<number>; index: number }) {
  const y = useTransform(progress, [0, 1], [0, d.speed]);
  return (
    <motion.div
      // Opacity is a static style, not an animated value. Animating it from 0
      // would ship `style="opacity:0"` in the server HTML, hiding the tile
      // until hydration finishes — and for good if the bundle never arrives.
      initial={{ scale: 0.85 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: index * 0.08, ease }}
      className="absolute"
      style={{ top: d.top, left: d.left, width: d.size, height: d.size, opacity: d.opacity, y }}
    >
      {/* Diamond frame with counter-rotated image so the photo stays upright */}
      <div
        className="h-full w-full overflow-hidden rounded-[1.75rem] border border-border shadow-lg"
        style={{ transform: "rotate(45deg)", filter: `blur(${d.blur}px)` }}
      >
        <div className="h-full w-full" style={{ transform: "rotate(-45deg) scale(1.5)" }}>
          {/* Non-fill: the diamond crop lives in rotated/scaled wrappers, so the
              image must stay in flow with object-cover, not absolutely filled. */}
          <Picture src={d.src} alt="" className="h-full w-full object-cover" sizes="240px" />
        </div>
      </div>
    </motion.div>
  );
}
