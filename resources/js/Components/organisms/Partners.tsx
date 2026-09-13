import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionHeading } from '@/Components/molecules/SectionHeading';
import { Logo } from '@/Components/atoms/Logo';
import { useI18n } from '@/lib/i18n';
import { partners as staticPartners } from '@/data/content';
import type { PartnerContent } from '@/types/api';

type PartnerNode = {
  name: string;
  group: string;
  logoUrl?: string | null;
  href?: string | null;
};

const orbitSpots = [
  { top: '5%', left: '50%', float: -8 },
  { top: '13%', left: '72%', float: 7 },
  { top: '29%', left: '88%', float: -6 },
  { top: '54%', left: '91%', float: 8 },
  { top: '76%', left: '77%', float: -7 },
  { top: '88%', left: '54%', float: 6 },
  { top: '76%', left: '28%', float: -6 },
  { top: '54%', left: '9%', float: 7 },
  { top: '29%', left: '12%', float: -8 },
  { top: '13%', left: '28%', float: 6 },
];

/** Animated orbital partner field used on the home page. CMS records replace the fallback nodes. */
export function Partners({ items }: { items?: PartnerContent[] }) {
  const { t, lang } = useI18n();
  const nodes = useMemo<PartnerNode[]>(() => {
    if (items?.length) {
      return items.map((item) => ({
        name: lang === 'en' && item.nameEn ? item.nameEn : item.nameId,
        group: lang === 'en' && item.groupEn ? item.groupEn : item.groupId,
        logoUrl: item.logoUrl,
        href: item.href,
      }));
    }
    return staticPartners.groups.flatMap((group) =>
      group.names.map((name) => ({ name, group: t(group.group) })),
    );
  }, [items, lang, t]);

  return (
    <section className="border-b border-border bg-paper-2 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading
          no="06"
          kicker={t(staticPartners.kicker)}
          title={t(staticPartners.title)}
          align="center"
          className="mx-auto"
        />

        <div className="relative mx-auto mt-10 hidden h-[34rem] max-w-5xl lg:block">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[25rem] w-[min(88vw,52rem)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-dashed border-forest-900/10"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[18rem] w-[min(64vw,38rem)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-forest-900/[0.06]"
            aria-hidden
          />
          <div className="absolute left-1/2 top-1/2 flex h-36 w-56 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl border border-border bg-card p-8 shadow-sm">
            <Logo className="h-20" />
          </div>

          {nodes.slice(0, orbitSpots.length).map((node, index) => (
            <OrbitNode
              key={`${node.name}-${index}`}
              node={node}
              spot={orbitSpots[index]!}
              index={index}
            />
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
          {nodes.map((node, index) => (
            <MobilePartnerNode key={`${node.name}-${index}`} node={node} />
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-muted-foreground">
          {t({
            id: 'Arahkan atau pilih logo untuk melihat kategori mitra',
            en: 'Hover or select a logo to see its partner category',
          })}
        </p>
      </div>
    </section>
  );
}

function OrbitNode({
  node,
  spot,
  index,
}: {
  node: PartnerNode;
  spot: { top: string; left: string; float: number };
  index: number;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);
  const content = (
    <>
      <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border bg-card font-display text-xs font-bold text-forest-800 shadow-md transition-colors group-hover:border-amber group-hover:bg-forest-800 group-hover:text-paper">
        {node.logoUrl ? (
          // CMS-supplied URLs may not be covered by next.config remotePatterns.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={node.logoUrl}
            alt=""
            className="h-full w-full object-contain p-2"
            loading="lazy"
          />
        ) : (
          monogram(node.name)
        )}
      </span>
      <span className="mt-2 max-w-28 text-center text-[0.62rem] font-semibold leading-tight text-forest-900 transition-colors group-hover:text-paper">
        {node.name}
      </span>
      <span className="mt-1 text-[0.54rem] font-medium uppercase tracking-widest text-forest-600 transition-colors group-hover:text-amber-soft">
        {node.group}
      </span>
    </>
  );

  const button = (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => {
        if (node.href) window.open(node.href, '_blank', 'noopener,noreferrer');
      }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="group flex w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl border border-transparent bg-paper-2/70 p-2.5 text-center transition-colors hover:border-amber/50 hover:bg-forest-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {content}
    </button>
  );

  return (
    <motion.div
      className="absolute"
      style={{ top: spot.top, left: spot.left }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1, y: reduce ? 0 : [0, spot.float, 0] }}
      transition={{
        opacity: { duration: 0.5, delay: index * 0.05 },
        scale: { duration: 0.5, delay: index * 0.05 },
        y: { duration: 4.5 + index * 0.2, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      {button}
    </motion.div>
  );
}

function MobilePartnerNode({ node }: { node: PartnerNode }) {
  const [active, setActive] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => setActive((value) => !value)}
      className={`flex min-h-36 flex-col items-center justify-center rounded-2xl border p-4 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? 'border-amber bg-forest-800 text-paper' : 'border-border bg-card text-forest-900'}`}
    >
      <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-forest-800 font-display text-xs font-bold text-paper">
        {node.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={node.logoUrl}
            alt=""
            className="h-full w-full bg-paper object-contain p-1.5"
            loading="lazy"
          />
        ) : (
          monogram(node.name)
        )}
      </span>
      <span className="mt-3 text-xs font-semibold leading-snug">{node.name}</span>
      {active && (
        <span className="mt-1 text-[0.55rem] uppercase tracking-widest text-amber-soft">
          {node.group}
        </span>
      )}
    </button>
  );
}

function monogram(name: string) {
  const words = name
    .replace(/[—·].*$/, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();
  return `${words[0]![0]!}${words[1]![0]!}`.toUpperCase();
}
