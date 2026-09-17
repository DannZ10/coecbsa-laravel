import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageHeader } from '@/Components/molecules/PageHeader';
import { Picture } from '@/Components/atoms/Picture';
import { useI18n } from '@/lib/i18n';
import { programs, bsfDetail, type Program } from '@/data/content';
import type { ProgramContent } from '@/types/api';
import { programFromApi } from '@/lib/content-adapters';

const statusCopy = {
  ongoing: { id: 'Sedang berjalan', en: 'Ongoing' },
  planned: { id: 'Dalam perencanaan', en: 'Planned' },
  completed: { id: 'Selesai', en: 'Completed' },
} as const;

const statusStyles = {
  ongoing: 'bg-emerald-500/90 text-white',
  planned: 'bg-amber/90 text-accent-foreground',
  completed: 'bg-forest-900/80 text-paper',
} as const;

export function ProgramPage({ items: apiItems }: { items?: ProgramContent[] }) {
  const { t } = useI18n();
  const isCmsContent = Boolean(apiItems?.length);
  const items = isCmsContent ? apiItems!.map(programFromApi) : programs.items;

  return (
    <>
      <PageHeader
        no="04"
        kicker={t(programs.kicker)}
        title={t({
          id: 'Program yang berjalan di lapangan.',
          en: 'Programs running in the field.',
        })}
        lead={t({
          id: 'Riset yang dihilirkan menjadi program berdampak bersama pemerintah, perbankan, dan komunitas.',
          en: 'Research downstreamed into impactful programs with government, banking, and communities.',
        })}
        backgroundImage={items[0]?.image ?? programs.items[0]!.image}
      />

      <section className="bg-paper py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          {items.map((program, index) => (
            <ProgramRow
              key={isCmsContent ? apiItems![index]!.id : program.title.id}
              program={program}
              index={index}
              showStructuredDetails={!isCmsContent && index === 0}
            />
          ))}
        </div>
      </section>
    </>
  );
}

function ProgramRow({
  program,
  index,
  showStructuredDetails,
}: {
  program: Program;
  index: number;
  showStructuredDetails: boolean;
}) {
  const { t } = useI18n();
  return (
    <motion.article
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 items-stretch gap-8 border-b border-border py-12 lg:grid-cols-2 lg:gap-16"
    >
      <div
        className={`relative min-h-[18rem] overflow-hidden rounded-2xl bg-muted lg:min-h-[32rem] ${index % 2 === 1 ? 'lg:order-2' : ''}`}
      >
        <Picture
          src={program.image}
          alt={t(program.title)}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
        <span
          className={`absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-wider backdrop-blur ${statusStyles[program.status]}`}
        >
          <span className="h-2 w-2 rounded-full bg-current" />
          {t(statusCopy[program.status])}
        </span>
      </div>

      <div className={`flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
        <span className="text-[0.7rem] font-semibold uppercase tracking-widest text-amber">
          {t(program.tag)}
        </span>
        <h2 className="mt-2 font-display text-2xl font-bold text-forest-900 sm:text-3xl">
          {t(program.title)}
        </h2>
        <p className="mt-2 text-sm font-medium text-forest-700">◍ {t(program.place)}</p>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          {t(program.desc)}
        </p>
        <p className="mt-4 inline-block w-fit rounded-full bg-forest-800/8 px-3 py-1.5 text-xs font-medium text-forest-700">
          {t(program.funder)}
        </p>
        <ProgramDetails program={program} showStructuredDetails={showStructuredDetails} />
      </div>
    </motion.article>
  );
}

function ProgramDetails({
  program,
  showStructuredDetails,
}: {
  program: Program;
  showStructuredDetails: boolean;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className="program-detail mt-6 max-w-xl overflow-hidden rounded-2xl border border-border bg-card">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-sm font-bold text-forest-900 transition-colors hover:bg-paper-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span>{t({ id: 'Lihat rincian program', en: 'View program details' })}</span>
        <span
          aria-hidden
          className={`text-xl font-normal text-amber transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border"
          >
            <div className="px-5 pb-5 pt-4">
              {showStructuredDetails ? (
                <StructuredDetails />
              ) : (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(
                    program.details ?? {
                      id: 'Program ini berada dalam ekosistem riset, kolaborasi, dan pemberdayaan masyarakat CoE CBSA.',
                      en: 'This program sits within the CoE CBSA ecosystem of research, collaboration, and community empowerment.',
                    },
                  )}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StructuredDetails() {
  const { t } = useI18n();
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-widest text-amber">
        {t(bsfDetail.clustersLabel)}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {bsfDetail.clusters.map((cluster) => (
          <div key={cluster.title.id} className="rounded-xl bg-paper-2 p-4">
            <p className="text-xs font-semibold text-forest-900">{t(cluster.title)}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t(cluster.desc)}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-amber">
        {t(bsfDetail.seriesLabel)}
      </p>
      <ol className="mt-3 flex flex-wrap gap-2">
        {bsfDetail.series.map((activity, index) => (
          <li
            key={activity.id}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-forest-800"
          >
            {index + 1}. {t(activity)}
          </li>
        ))}
      </ol>
    </>
  );
}
