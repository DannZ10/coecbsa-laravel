import { motion } from "framer-motion";
import { NavLink } from "@/Components/atoms/RouteLink";
import { Kicker } from "@/Components/atoms/Kicker";
import { ImageWithFallback } from "@/Components/atoms/ImageWithFallback";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  no: string;
  kicker: string;
  title: string;
  lead: string;
  backgroundImage?: string;
};

/** Shared hero band for inner pages. */
export function PageHeader({ no, kicker, title, lead, backgroundImage }: Props) {
  const { t } = useI18n();
  return (
    <header className="relative isolate overflow-hidden bg-forest-900 pb-16 pt-32 text-paper sm:pb-20 sm:pt-40">
      {backgroundImage && (
        <ImageWithFallback
          src={backgroundImage}
          alt=""
          loading="eager"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55"
        />
      )}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "linear-gradient(105deg, rgba(12,38,27,0.98) 0%, rgba(12,38,27,0.9) 42%, rgba(12,38,27,0.64) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 grain opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{ background: "radial-gradient(80% 70% at 90% 0%, rgba(44,125,91,0.3), transparent 55%)" }}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-paper/50">
          <NavLink to="/" className="transition-colors hover:text-paper">
            {t({ id: "Beranda", en: "Home" })}
          </NavLink>
          <span>/</span>
          <span className="text-amber-soft">{kicker}</span>
        </nav>
        <Kicker no={no} tone="paper">
          {kicker}
        </Kicker>
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mt-4 max-w-3xl font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base"
        >
          {lead}
        </motion.p>
      </div>
    </header>
  );
}
