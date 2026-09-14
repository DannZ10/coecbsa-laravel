import { NavLink } from "@/Components/atoms/RouteLink";
import { Logo } from "@/Components/atoms/Logo";
import { useI18n } from "@/lib/i18n";
import { nav, contact } from "@/data/content";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/coe_cbsa" },
  { label: "ResearchGate", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "Facebook", href: "#" },
];

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-paper/25 bg-forest-800 text-paper">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo className="h-10" light />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/60">
              {t({
                id: "Pusat Unggulan Agroindustri Berkelanjutan Berbasis Masyarakat, Fakultas Teknologi Pertanian dan Biosistem, Universitas Brawijaya.",
                en: "Center of Excellence in Community-Based and Sustainable Agroindustry, Faculty of Agro-industrial and Biosystems Technology, Universitas Brawijaya.",
              })}
            </p>
            <a
              href={contact.details[1]!.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-sm font-medium text-amber-soft transition-colors hover:text-amber"
            >
              {t(contact.details[1]!.value)}
            </a>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h3 className="text-[0.66rem] font-semibold uppercase tracking-widest text-amber-soft">
              {t({ id: "Navigasi", en: "Navigate" })}
            </h3>
            <ul className="mt-5 grid grid-cols-2 gap-y-3">
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className="text-sm text-paper/60 transition-colors hover:text-paper">
                    {t(item.label)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-[0.66rem] font-semibold uppercase tracking-widest text-amber-soft">
              {t({ id: "Terhubung", en: "Connect" })}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-paper/60 transition-colors hover:text-paper"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-paper/10 pt-6 text-[0.66rem] font-medium uppercase tracking-wider text-paper/60 sm:flex-row sm:items-center">
          <span>© {year} CoE CBSA, Universitas Brawijaya</span>
          <span>Malang, Jawa Timur, Indonesia</span>
        </div>
      </div>
    </footer>
  );
}
