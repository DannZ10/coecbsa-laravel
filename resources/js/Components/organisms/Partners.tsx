import { useMemo, useRef, useState } from 'react';
import { useAnimationFrame, useReducedMotion } from 'framer-motion';
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

/* ------------------------------------------------------------------ *
 * Orbit geometry
 *
 * The nodes ride one ellipse and are placed by a shared angle, the way a
 * globe carries points on its surface. `depth` is cos(angle): +1 at the
 * front of the path, -1 at the back. Everything that sells the depth —
 * size, opacity, blur, stacking — is a function of that single number, so
 * they cannot fall out of step with each other.
 * ------------------------------------------------------------------ */

/** Horizontal half-width of the path, as a share of the container. */
const RADIUS_X = 0.4;
/**
 * Vertical half-height. Much smaller than the horizontal one: the ring is
 * seen from slightly above. Large enough that a front node clears the centre
 * lockup — at 0.17 the nearest one sat on the card's bottom edge.
 */
const RADIUS_Y = 0.235;

const FRONT_SCALE = 1.06;
const BACK_SCALE = 0.52;
const BACK_OPACITY = 0.16;
const BACK_BLUR_PX = 3.5;

/** Radians per second. A full turn takes roughly 40 seconds. */
const SPEED_IDLE = 0.157;
/** Not zero: the ring keeps drifting while someone reads a logo. */
const SPEED_HOVER = 0.026;
/** Per-frame easing between the two, so the change in pace is felt, not seen. */
const SPEED_EASING = 0.045;

type Placement = {
  left: string;
  top: string;
  transform: string;
  opacity: number;
  filter: string;
  zIndex: number;
  pointerEvents: 'auto' | 'none';
};

function placeAt(angle: number): Placement {
  const depth = Math.cos(angle);
  // 0 at the far side, 1 at the near side.
  const nearness = (depth + 1) / 2;

  const scale = BACK_SCALE + (FRONT_SCALE - BACK_SCALE) * nearness;
  const opacity = BACK_OPACITY + (1 - BACK_OPACITY) * nearness;
  const blur = (1 - nearness) * BACK_BLUR_PX;

  return {
    left: `${50 + RADIUS_X * 100 * Math.sin(angle)}%`,
    top: `${50 + RADIUS_Y * 100 * depth}%`,
    transform: `translate(-50%, -50%) scale(${scale.toFixed(3)})`,
    opacity: Number(opacity.toFixed(3)),
    filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none',
    // Starts at 1, never 0: the centre watermark holds z-0 and must stay
    // behind every node, including the one at the far side of the path.
    zIndex: Math.round(nearness * 100) + 1,
    // A node at the back is too faint to aim at; letting it swallow clicks
    // meant for the centre lockup would feel broken.
    pointerEvents: opacity > 0.45 ? 'auto' : 'none',
  };
}

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

        <Orbit nodes={nodes} />

        {/*
          The same partners, as a plain list. On phones it is the presentation;
          on desktop it is visually hidden and exists for screen readers and
          keyboard users, because the ring above is decorative — a node at the
          far side of the path is faded to the point of being unreadable, which
          is the effect, and no contrast rule can be satisfied while it holds.
        */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:sr-only">
          {nodes.map((node, index) => (
            <MobilePartnerNode key={`${node.name}-${index}`} node={node} />
          ))}
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          {t({
            id: 'Arahkan kursor ke cincin untuk memperlambat putaran, lalu ke satu logo untuk melihat detailnya',
            en: 'Hover the ring to slow the rotation, then a logo to see its details',
          })}
        </p>
      </div>
    </section>
  );
}

function Orbit({ nodes }: { nodes: PartnerNode[] }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  const container = useRef<HTMLDivElement>(null);
  const cells = useRef<(HTMLDivElement | null)[]>([]);
  const angle = useRef(0);
  const speed = useRef(SPEED_IDLE);
  const target = useRef(SPEED_IDLE);
  // Last written values, so the two expensive properties are only assigned
  // when they change rather than on every frame.
  const lastBlur = useRef<number[]>([]);
  const lastLayer = useRef<number[]>([]);
  const marks = useRef<(HTMLElement | null)[]>([]);
  const lastLegible = useRef<boolean[]>([]);

  const [focused, setFocused] = useState<number | null>(null);

  const step = (Math.PI * 2) / Math.max(nodes.length, 1);

  useAnimationFrame((_time, delta) => {
    const box = container.current;
    if (reduce || !box) return;

    // Ease the pace rather than switching it, so slowing on hover reads as
    // the ring settling instead of a jump cut.
    speed.current += (target.current - speed.current) * SPEED_EASING;
    angle.current += speed.current * (delta / 1000);

    const halfWidth = box.clientWidth * RADIUS_X;
    const halfHeight = box.clientHeight * RADIUS_Y;

    cells.current.forEach((cell, index) => {
      if (!cell) return;

      // The server-rendered placement uses left/top percentages so the ring is
      // laid out in the HTML. Animating those would run layout for every node
      // on every frame, so they are pinned to the centre once and all movement
      // after that happens in `transform`, which the compositor handles.
      if (cell.style.left !== '50%') {
        cell.style.left = '50%';
        cell.style.top = '50%';
      }

      const a = angle.current + index * step;
      const depth = Math.cos(a);
      const nearness = (depth + 1) / 2;
      const scale = BACK_SCALE + (FRONT_SCALE - BACK_SCALE) * nearness;

      cell.style.transform =
        `translate(-50%, -50%) translate(${(halfWidth * Math.sin(a)).toFixed(1)}px, ` +
        `${(halfHeight * depth).toFixed(1)}px) scale(${scale.toFixed(3)})`;
      cell.style.opacity = (BACK_OPACITY + (1 - BACK_OPACITY) * nearness).toFixed(2);

      // blur() is a repaint, not a composite, so it is only written when the
      // quantised value actually changes — roughly a handful of times per
      // revolution instead of sixty times a second.
      // Readable only while the node is near enough for its text to clear the
      // contrast threshold against the paper ground.
      const legible = nearness > 0.62;
      if (legible !== lastLegible.current[index]) {
        lastLegible.current[index] = legible;
        marks.current[index] ??= cell.querySelector<HTMLElement>('[data-mark]');
        const mark = marks.current[index];
        if (mark) mark.style.visibility = legible ? 'visible' : 'hidden';
      }

      const blurStep = Math.round((1 - nearness) * BACK_BLUR_PX * 2) / 2;
      if (blurStep !== lastBlur.current[index]) {
        lastBlur.current[index] = blurStep;
        cell.style.filter = blurStep > 0 ? `blur(${blurStep}px)` : 'none';
        // A node at the back is too faint to aim at; letting it swallow clicks
        // meant for the centre of the ring would feel broken.
        cell.style.pointerEvents = nearness > 0.35 ? 'auto' : 'none';
      }

      const layer = Math.round(nearness * 100) + 1;
      if (layer !== lastLayer.current[index]) {
        lastLayer.current[index] = layer;
        cell.style.zIndex = String(layer);
      }
    });
  });

  return (
    <div
      ref={container}
      // Decorative: everything it conveys is in the list below, which is what
      // assistive technology reads.
      aria-hidden
      className="relative mx-auto mt-10 hidden h-[34rem] max-w-5xl lg:block"
      onMouseEnter={() => {
        target.current = SPEED_HOVER;
      }}
      onMouseLeave={() => {
        target.current = SPEED_IDLE;
        setFocused(null);
      }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[25rem] w-[min(88vw,52rem)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-dashed border-forest-900/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[18rem] w-[min(64vw,38rem)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-forest-900/[0.06]"
        aria-hidden
      />

      {/*
        The lockup sits at the very back at 40% opacity: a watermark the ring
        turns in front of, not a card the nodes collide with. Every node gets
        a z-index of at least 1 (see placeAt), so none can fall behind it.
      */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center opacity-40">
        <Logo className="h-20" />
      </div>

      {nodes.map((node, index) => {
        // Computed during render as well as in the frame loop, so the ring is
        // already laid out in the server HTML instead of stacked at one point.
        const initial = placeAt(index * step);

        return (
          <div
            key={`${node.name}-${index}`}
            ref={(element) => {
              cells.current[index] = element;
            }}
            className="absolute will-change-transform"
            style={{
              left: initial.left,
              top: initial.top,
              transform: initial.transform,
              opacity: initial.opacity,
              filter: initial.filter,
              zIndex: initial.zIndex,
              pointerEvents: initial.pointerEvents,
            }}
          >
            <OrbitNode
              node={node}
              expanded={focused === index}
              onEnter={() => setFocused(index)}
              onLeave={() => setFocused((current) => (current === index ? null : current))}
              label={t({ id: 'Buka situs mitra', en: 'Open partner website' })}
            />
          </div>
        );
      })}
    </div>
  );
}

function OrbitNode({
  node,
  expanded,
  onEnter,
  onLeave,
  label,
}: {
  node: PartnerNode;
  expanded: boolean;
  onEnter: () => void;
  onLeave: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      title={node.name}
      onClick={() => {
        if (node.href) window.open(node.href, '_blank', 'noopener,noreferrer');
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group flex w-28 flex-col items-center rounded-2xl border border-transparent p-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-border bg-card font-display text-xs font-bold text-forest-800 shadow-md transition-[border-color,transform] duration-300 group-hover:scale-110 group-hover:border-amber">
        {node.logoUrl ? (
          <img src={node.logoUrl} alt="" className="h-full w-full object-contain p-2" loading="lazy" />
        ) : (
          // Hidden by the frame loop once this node is at the far side. At 16%
          // opacity the letters are unreadable anyway, and text nobody can read
          // is a contrast failure no amount of styling fixes.
          <span data-mark>{monogram(node.name)}</span>
        )}
      </span>

      {/*
        The detail sits under the mark and is only laid out when expanded, so
        the resting ring reads as logos rather than a wall of captions.
      */}
      <span
        className={`mt-2 grid transition-[grid-template-rows,opacity] duration-300 ${
          expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <span className="overflow-hidden">
          <span className="block rounded-xl border border-border bg-card px-2.5 py-2 shadow-lg">
            <span className="block text-[0.66rem] font-semibold leading-tight text-forest-900">
              {node.name}
            </span>
            <span className="mt-1 block text-[0.55rem] font-medium uppercase tracking-widest text-forest-600">
              {node.group}
            </span>
            {node.href && (
              <span className="mt-1 block text-[0.55rem] font-medium text-forest-700 underline">
                {label}
              </span>
            )}
          </span>
        </span>
      </span>
    </button>
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
