import { motion } from "framer-motion";
import { useI18n, type Lang } from "@/lib/i18n";

export function LangToggle({ tone = "forest" }: { tone?: "forest" | "paper" }) {
  const { lang, setLang } = useI18n();
  const opts: Lang[] = ["id", "en"];
  const paper = tone === "paper";

  return (
    <div
      title="Ganti bahasa / Switch language"
      className={`group relative inline-flex cursor-pointer items-center rounded-full border p-0.5 text-[0.7rem] font-semibold transition-colors ${
        paper
          ? "border-paper/25 hover:border-paper/50 hover:bg-paper/10"
          : "border-forest-800/20 hover:border-forest-800/45 hover:bg-forest-800/[0.06]"
      }`}
    >
      {opts.map((o) => {
        const active = lang === o;
        return (
          <button
            key={o}
            onClick={() => setLang(o)}
            aria-pressed={active}
            className="relative z-10 cursor-pointer rounded-full px-2.5 py-1 uppercase tracking-widest"
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                transition={{ type: "spring", stiffness: 480, damping: 40, mass: 0.6 }}
                className={`absolute inset-0 -z-10 rounded-full shadow-sm ${paper ? "bg-paper" : "bg-forest-800"}`}
              />
            )}
            <span
              className={`transition-colors duration-200 ${
                active
                  ? paper
                    ? "text-forest-900"
                    : "text-paper"
                  : paper
                    ? "text-paper/70 group-hover:text-paper"
                    : "text-forest-800/60 group-hover:text-forest-800/90"
              }`}
            >
              {o}
            </span>
          </button>
        );
      })}
    </div>
  );
}
