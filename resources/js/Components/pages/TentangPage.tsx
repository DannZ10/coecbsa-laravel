import { PageHeader } from "@/Components/molecules/PageHeader";
import { Reveal } from "@/Components/atoms/Reveal";
import { Kicker } from "@/Components/atoms/Kicker";
import { Picture } from "@/Components/atoms/Picture";
import { useI18n } from "@/lib/i18n";
import { mission, pillars, about } from "@/data/content";

export function TentangPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader
        no="01"
        kicker={t({ id: "Tentang Kami", en: "About Us" })}
        title={t({ id: "Menjembatani laboratorium dan lapangan.", en: "Bridging the lab and the field." })}
        lead={t(about.body)}
        backgroundImage={about.approaches[0]!.image}
      />

      {/* Vision & Mission */}
      <section className="border-b border-border bg-paper py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
          {[
            { k: t({ id: "Visi", en: "Vision" }), v: t(mission.vision) },
            { k: t({ id: "Misi", en: "Mission" }), v: t(mission.statement) },
          ].map((c, i) => (
            <Reveal key={i} delay={i * 0.1} className="rounded-2xl border border-border bg-card p-8">
              <Kicker tone="forest">{c.k}</Kicker>
              <p className="mt-4 text-lg leading-relaxed text-forest-900/85">{c.v}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="border-b border-border bg-paper-2 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Kicker no="01.1">{t({ id: "Empat Pilar Nilai", en: "Four Value Pillars" })}</Kicker>
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <Reveal key={i} delay={i * 0.08} className="bg-card p-6">
                <span className="font-display text-3xl font-extrabold text-amber">0{i + 1}</span>
                <h3 className="mt-3 font-display text-xl font-bold text-forest-900">{t(p.label)}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{t(p.note)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Approaches */}
      <section className="border-b border-border bg-paper py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Kicker no="01.2">{t({ id: "Empat Pendekatan", en: "Four Approaches" })}</Kicker>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.approaches.map((a, i) => (
              <Reveal key={i} delay={i * 0.08} className="group overflow-hidden rounded-2xl border border-border bg-card">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <Picture
                    src={a.image}
                    alt={t(a.label)}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-forest-900">{t(a.label)}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t(a.desc)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
