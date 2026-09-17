import { PageHeader } from '@/Components/molecules/PageHeader';
import { Picture } from '@/Components/atoms/Picture';
import { Kicker } from '@/Components/atoms/Kicker';
import { useI18n } from '@/lib/i18n';
import { about, people, type Person } from '@/data/content';

export function StrukturPage() {
  const { t } = useI18n();

  return (
    <>
      <PageHeader
        no="02"
        kicker={t({ id: 'Struktur', en: 'Structure' })}
        title={t({
          id: 'Orang-orang di balik dampak CoE CBSA.',
          en: "The people behind CoE CBSA's impact.",
        })}
        lead={t({
          id: 'Struktur organisasi yang menggerakkan riset, teknologi, dan kolaborasi kami.',
          en: 'The organisation structure driving our research, technology, and collaborations.',
        })}
        backgroundImage={about.approaches[3]!.image}
      />

      <section className="border-b border-border bg-paper py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Kicker no="02.1">
            {t({ id: 'Struktur Organisasi', en: 'Organisation Structure' })}
          </Kicker>
          <div className="mt-10 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-10">
            <div className="mx-auto max-w-2xl">
              <OrganisationCard person={people[0]!} featured />
            </div>

            <div className="mx-auto h-10 w-px bg-amber" aria-hidden />
            <div className="relative grid gap-8 md:grid-cols-2 md:gap-10 md:before:absolute md:before:left-1/4 md:before:right-1/4 md:before:top-0 md:before:h-px md:before:bg-amber">
              {people.slice(1).map((person) => (
                <div
                  key={person.name}
                  className="relative before:absolute before:left-1/2 before:top-0 before:h-8 before:w-px before:bg-amber before:content-[''] md:pt-8"
                >
                  <OrganisationCard person={person} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function OrganisationCard({ person, featured = false }: { person: Person; featured?: boolean }) {
  const { t } = useI18n();
  return (
    <article
      className={`overflow-hidden rounded-[1.65rem] border shadow-lg ${featured ? 'border-forest-700 bg-forest-800 text-paper' : 'border-forest-700/20 bg-paper-2 text-forest-900'}`}
    >
      <div
        className={`flex items-center justify-between px-4 py-3 ${featured ? 'bg-forest-900/35' : 'bg-forest-800 text-paper'}`}
      >
        <span className="font-display text-xs font-extrabold tracking-[0.2em]">COE CBSA</span>
        <span className="text-[0.56rem] font-semibold uppercase tracking-widest text-amber-soft">
          ID CARD
        </span>
      </div>
      <div className="grid grid-cols-[6.5rem_1fr] gap-4 p-4 sm:grid-cols-[8rem_1fr] sm:gap-5 sm:p-5">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-forest-900">
          <Picture
            src={person.photo ?? about.approaches[0]!.image}
            alt={t({ id: `Foto ${person.name}`, en: `${person.name} portrait` })}
            sizes="128px"
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-2 left-2 rounded-full bg-forest-900/75 px-2 py-1 text-[0.48rem] font-semibold uppercase tracking-widest text-paper backdrop-blur">
            {t({ id: 'Foto', en: 'Portrait' })}
          </span>
        </div>
        <div className="flex min-w-0 flex-col justify-center">
          <span
            className={`text-[0.6rem] font-semibold uppercase tracking-widest ${featured ? 'text-amber-soft' : 'text-amber'}`}
          >
            {t(person.division)}
          </span>
          <h2
            className={`mt-2 font-display text-lg font-extrabold leading-tight sm:text-xl ${featured ? 'text-paper' : 'text-forest-900'}`}
          >
            {person.name}
          </h2>
          <p
            className={`mt-2 text-sm leading-relaxed ${featured ? 'text-paper/70' : 'text-muted-foreground'}`}
          >
            {t(person.role)}
          </p>
        </div>
      </div>
    </article>
  );
}
