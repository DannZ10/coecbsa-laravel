import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "@/Components/atoms/RouteLink";
import { Logo } from "@/Components/atoms/Logo";
import { LangToggle } from "@/Components/molecules/LangToggle";
import { useI18n } from "@/lib/i18n";
import { nav, contact } from "@/data/content";

export function Navbar() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Transparent over the dark hero on the home page until scrolled.
  const transparent = isHome && !scrolled;
  const solid = !transparent;

  return (
    <motion.header
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "border-b border-border bg-paper/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <NavLink to="/" className="shrink-0" aria-label="CoE CBSA home">
          <Logo className="h-8 sm:h-9" light={transparent} />
        </NavLink>

        <ul className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `group relative text-sm font-medium transition-colors ${
                    transparent
                      ? "text-paper/85 hover:text-paper"
                      : isActive
                        ? "text-forest-800"
                        : "text-forest-900/70 hover:text-forest-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {t(item.label)}
                    <span
                      className={`absolute -bottom-1 left-1/2 h-px -translate-x-1/2 bg-amber transition-all duration-300 group-hover:w-full ${isActive ? "w-full" : "w-0"}`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <LangToggle tone={transparent ? "paper" : "forest"} />
          <a
            href={contact.details[1]!.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden rounded-full px-4 py-2 text-sm font-medium transition-colors sm:inline-flex ${
              transparent
                ? "bg-paper text-forest-900 hover:bg-white"
                : "bg-forest-800 text-paper hover:bg-forest-700"
            }`}
          >
            {t(contact.cta)}
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border lg:hidden ${
              transparent ? "border-paper/30" : "border-forest-800/20"
            }`}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className="relative block h-3 w-4">
              {["top-0", "top-1.5", "top-3"].map((pos, idx) => (
                <span
                  key={pos}
                  className={`absolute left-0 h-0.5 w-4 transition-all ${transparent ? "bg-paper" : "bg-forest-900"} ${
                    open
                      ? idx === 0
                        ? "top-1.5 rotate-45"
                        : idx === 1
                          ? "opacity-0"
                          : "top-1.5 -rotate-45"
                      : pos
                  }`}
                />
              ))}
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-border bg-paper lg:hidden"
          >
            <ul className="flex flex-col px-5 py-3">
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className="block py-3 text-sm font-medium text-forest-900/80"
                  >
                    {t(item.label)}
                  </NavLink>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href={contact.details[1]!.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-forest-800 px-4 py-2 text-sm font-medium text-paper"
                >
                  {t(contact.cta)}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
