import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from '@/Components/molecules/SectionHeading';
import { Button } from '@/Components/atoms/Button';
import { ImageWithFallback } from '@/Components/atoms/ImageWithFallback';
import { useI18n } from '@/lib/i18n';
import { programs } from '@/data/content';
import type { ProgramContent } from '@/types/api';
import { programFromApi } from '@/lib/content-adapters';

const ease = [0.22, 1, 0.36, 1] as const;

const statusCopy = {
  ongoing: { id: 'Sedang berjalan', en: 'Ongoing' },
  planned: { id: 'Dalam perencanaan', en: 'Planned' },
  completed: { id: 'Selesai', en: 'Completed' },
} as const;

export function Programs({ items: apiItems }: { items?: ProgramContent[] }) {
  const { t } = useI18n();
  const items = apiItems?.length ? apiItems.map(programFromApi) : programs.items;
  const [active, setActive] = useState(0);
  const item = items[active] ?? items[0]!;

  return (
    <section className="relative overflow-hidden bg-paper-2 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading
          no="03"
          kicker={t(programs.kicker)}
          title={t(programs.title)}
          align="center"
          className="mx-auto"
          titleClassName="md:whitespace-nowrap"
        />

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Selectable list — LEFT */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <ul className="flex flex-col">
              {items.map((p, i) => {
                const on = i === active;
                return (
                  <li key={i}>
                    <button
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className="group w-full py-5 text-left"
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className={`text-sm font-semibold transition-colors ${on ? 'text-amber-800' : 'text-muted-foreground'}`}
                        >
                          0{i + 1}
                        </span>
                        <div className="flex-1">
                          {/* h3, not h4: the section heading is an h2 and the
                              detail panel beside this list is also an h3, so an
                              h4 here skipped a level. */}
                          <h3
                            className={`font-display text-lg font-bold leading-snug transition-colors sm:text-xl ${
                              on
                                ? 'text-forest-800'
                                : 'text-forest-900/55 group-hover:text-forest-900/85'
                            }`}
                          >
                            {t(p.title)}
                          </h3>
                          <p
                            className={`mt-1 text-xs font-medium transition-colors ${on ? 'text-forest-700' : 'text-muted-foreground'}`}
                          >
                            {t(p.funder)}
                          </p>
                          {/* Collapsible description, like Focus Areas */}
                          <AnimatePresence initial={false}>
                            {on && (
                              <motion.p
                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                animate={{ height: 'auto', opacity: 1, marginTop: 10 }}
                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                transition={{ duration: 0.35, ease }}
                                className="overflow-hidden text-sm leading-relaxed text-muted-foreground"
                              >
                                {t(p.desc)}
                              </motion.p>
                            )}
                          </AnimatePresence>
                          {on && (
                            <motion.div
                              layoutId="prog-bar"
                              className="mt-3 h-0.5 w-full origin-left rounded-full bg-amber"
                            />
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6">
              <Button to="/program" variant="outline" from="left">
                {t({ id: 'Semua program & layanan', en: 'All programs & services' })}
              </Button>
            </div>
          </div>

          {/* Media panel — RIGHT */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-muted shadow-xl">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease }}
                  className="absolute inset-0"
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={t(item.title)}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/25 to-transparent" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-forest-900/50 px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-wider text-paper backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
                  </span>
                  {t(statusCopy[item.status])}
                </span>
                <span className="rounded-full bg-paper/90 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-wider text-forest-800 backdrop-blur">
                  ◍ {t(item.place)}
                </span>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.1 }}
                  className="absolute inset-x-0 bottom-0 p-6"
                >
                  <span className="text-[0.7rem] font-medium uppercase tracking-widest text-amber-soft">
                    {t(item.tag)}
                  </span>
                  <h3 className="mt-2 max-w-lg font-display text-xl font-bold leading-snug text-paper sm:text-2xl">
                    {t(item.title)}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
