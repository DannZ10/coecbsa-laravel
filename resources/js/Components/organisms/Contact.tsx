import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Reveal } from "@/Components/atoms/Reveal";
import { Kicker } from "@/Components/atoms/Kicker";
import { Icon } from "@/Components/atoms/Icon";
import { Logo } from "@/Components/atoms/Logo";
import { Button } from "@/Components/atoms/Button";
import { useI18n } from "@/lib/i18n";
import { contact } from "@/data/content";

export function Contact({ showMap = true }: { showMap?: boolean }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });
  const rotateX = useTransform(srx, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(sry, [-0.5, 0.5], [-10, 10]);

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    rx.set((e.clientY - r.top) / r.height - 0.5);
    ry.set((e.clientX - r.left) / r.width - 0.5);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <section className="relative isolate overflow-hidden bg-forest-800 py-20 text-paper sm:py-28">
      <div className="pointer-events-none absolute inset-0 grain opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{ background: "radial-gradient(80% 80% at 20% 100%, rgba(202,160,61,0.18), transparent 55%)" }}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div>
            <Reveal>
              <Kicker no="07" tone="amber">
                {t(contact.kicker)}
              </Kicker>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-paper sm:text-4xl md:text-5xl">
                {t(contact.title)}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-forest-300 sm:text-base">
                {t(contact.body)}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              {showMap ? (
                <div className="mt-8 max-w-md overflow-hidden rounded-2xl border border-paper/15 shadow-xl">
                  <iframe
                    title={t({ id: "Lokasi kantor CoE CBSA", en: "CoE CBSA office location" })}
                    src="https://www.google.com/maps?q=Universitas+Brawijaya+FTAB+Jl.+Veteran+Malang&output=embed"
                    className="h-56 w-full grayscale-[0.2]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <div className="mt-8 max-w-md rounded-2xl border border-paper/15 bg-forest-900/25 p-5">
                  <p className="text-sm leading-relaxed text-paper/75">
                    {t({
                      id: "Hubungi tim CoE CBSA secara langsung untuk memulai percakapan kolaborasi.",
                      en: "Reach the CoE CBSA team directly to start a collaboration conversation.",
                    })}
                  </p>
                  <Button href={contact.details[1]!.href} external variant="outlinePaper" from="right" className="mt-5">
                    {t(contact.cta)}
                  </Button>
                </div>
              )}
            </Reveal>
          </div>

          {/* Animated ID card */}
          <div className="flex justify-center lg:justify-end" style={{ perspective: 1200 }}>
            <motion.div
              ref={cardRef}
              onMouseMove={onMove}
              onMouseLeave={reset}
              initial={false}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-paper/15 bg-gradient-to-br from-forest-700 to-forest-900 p-6 shadow-2xl"
            >
              {/* lanyard notch */}
              <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-paper/25" />

              <div className="flex items-center justify-between">
                <Logo className="h-9" light />
                <span className="rounded-full border border-amber/40 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-widest text-amber-soft">
                  {t({ id: "Kartu Kontak", en: "Contact Card" })}
                </span>
              </div>

              <div className="mt-6" style={{ transform: "translateZ(30px)" }}>
                <p className="font-display text-xl font-extrabold text-paper">CoE CBSA</p>
                <p className="mt-1 text-xs text-forest-300">
                  {t({
                    id: "Community-Based Sustainable Agroindustry, UB",
                    en: "Community-Based Sustainable Agroindustry, UB",
                  })}
                </p>
              </div>

              <ul className="mt-6 flex flex-col gap-2.5" style={{ transform: "translateZ(20px)" }}>
                {contact.details.map((d, i) => (
                  <li key={i}>
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-xl border border-paper/10 bg-forest-900/30 px-3 py-2.5 transition-colors hover:border-amber/50 hover:bg-forest-900/60"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber/15 text-amber-soft transition-colors group-hover:bg-amber group-hover:text-accent-foreground">
                        <Icon name={d.icon as "map" | "phone" | "mail" | "instagram"} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.58rem] font-semibold uppercase tracking-widest text-amber-soft/80">
                          {t(d.label)}
                        </span>
                        <span className="block truncate text-xs font-medium text-paper">{t(d.value)}</span>
                      </span>
                      <span className="text-paper/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-paper" aria-hidden>
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
