import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/Components/molecules/SectionHeading";
import { ImageWithFallback } from "@/Components/atoms/ImageWithFallback";
import { useI18n } from "@/lib/i18n";
import { focus } from "@/data/content";

const images = [
  "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1000&h=1200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1000&h=1200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&h=1200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1000&h=1200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1000&h=1200&fit=crop&auto=format",
];

export function FocusAreas() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const activeItem = focus.items[active]!;

  return (
    <section className="relative border-b border-border bg-paper-2 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading no="02" kicker={t(focus.kicker)} title={t(focus.title)} />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Sticky image */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border bg-muted">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <ImageWithFallback
                      src={images[active]!}
                      alt={t(activeItem.title)}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-900/50 to-transparent" />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute bottom-5 left-5">
                  <span className="font-mono text-6xl font-medium text-paper/90">
                    {activeItem.no}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* List */}
          <ul className="order-1 flex flex-col lg:order-2 lg:col-span-7">
            {focus.items.map((item, i) => {
              const isActive = i === active;
              return (
                <li key={item.no}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="group w-full border-t border-border py-7 text-left last:border-b"
                  >
                    <div className="flex items-baseline gap-5">
                      <span
                        className={`font-mono text-sm transition-colors ${isActive ? "text-amber-800" : "text-muted-foreground"}`}
                      >
                        {item.no}
                      </span>
                      <div className="flex-1">
                        <h3
                          className={`font-display text-2xl tracking-tight transition-colors sm:text-3xl ${
                            isActive ? "text-forest-800" : "text-forest-900/50 group-hover:text-forest-900/80"
                          }`}
                        >
                          {t(item.title)}
                        </h3>
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.p
                              initial={{ height: 0, opacity: 0, marginTop: 0 }}
                              animate={{ height: "auto", opacity: 1, marginTop: 10 }}
                              exit={{ height: 0, opacity: 0, marginTop: 0 }}
                              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden text-base leading-relaxed text-muted-foreground"
                            >
                              {t(item.desc)}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                      <span
                        className={`mt-1 text-forest-800 transition-all duration-300 ${isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}
                        aria-hidden
                      >
                        →
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
