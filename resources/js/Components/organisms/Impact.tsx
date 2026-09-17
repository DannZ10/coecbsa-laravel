import { Reveal } from '@/Components/atoms/Reveal';
import { Kicker } from '@/Components/atoms/Kicker';
import { StatCounter } from '@/Components/molecules/StatCounter';
import { Button } from '@/Components/atoms/Button';
import { Picture } from '@/Components/atoms/Picture';
import { useI18n } from '@/lib/i18n';
import { impact } from '@/data/content';
import type { ImpactContent } from '@/types/api';
import { impactFromApi, localized } from '@/lib/content-adapters';


/** Summary section — background photo overlaid with a dark→light green wash. */
export function Impact({ content }: { content?: ImpactContent }) {
  const { t } = useI18n();
  const view = content
    ? {
        ...impact,
        ...impactFromApi(content),
        sdgs: content.sdgs.map((sdg) => ({
          code: sdg.code,
          label: localized(sdg.labelId, sdg.labelEn),
          description: localized(sdg.descriptionId, sdg.descriptionEn),
        })),
      }
    : impact;
  return (
    <section id="impact" className="relative isolate overflow-hidden py-24 text-paper sm:py-32">
      {/* Background image */}
      <Picture
        src={view.feature.image}
        alt=""
        fill
        sizes="100vw"
        className="-z-20"
      />
      {/* Dark green → lighter green gradient overlay */}
      <div
        className="absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            'linear-gradient(120deg, #0c261b 0%, rgba(18,59,43,0.96) 42%, rgba(44,125,91,0.82) 100%)',
        }}
      />
      <div className="grain pointer-events-none absolute inset-0 -z-10 opacity-40" aria-hidden />

      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
        <Reveal>
          <Kicker no="04" tone="paper">
            {t(view.kicker)}
          </Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-5 font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-paper sm:text-4xl md:whitespace-nowrap md:text-5xl">
            {t(view.title)}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-paper/75 sm:text-base">
            {t(view.lead)}
          </p>
        </Reveal>

        {/* Compact stat row */}
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
          {view.stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="font-display text-4xl font-extrabold tracking-tight text-paper sm:text-5xl">
                <StatCounter value={s.value} />
              </div>
              <p className="mx-auto mt-2 max-w-[9rem] text-xs leading-snug text-paper/70">
                {t(s.label)}
              </p>
            </Reveal>
          ))}
        </div>

        {/* SDG chips + CTA */}
        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-[0.66rem] font-semibold uppercase tracking-widest text-amber-soft">
                SDGs
              </span>
              {view.sdgs.map((s) => (
                <span
                  key={s.code}
                  title={t(s.label)}
                  className="rounded-full border border-paper/25 bg-forest-900/30 px-3 py-1 text-xs font-medium text-paper/85 backdrop-blur-sm"
                >
                  {s.code} · {t(s.label)}
                </span>
              ))}
            </div>
            <Button to="/#impact" variant="outlinePaper" from="down">
              {t({ id: 'Semua proyek & dampak', en: 'All projects & impact' })}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
