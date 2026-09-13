import { MapPin, Phone } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { Link } from '@/lib/navigation';
import { footerNav, siteConfig } from '@/config/site';
import { Logo } from './logo';

export function SiteFooter() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-surface-2">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.3fr]">
        {/* Brand + blurb */}
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground-muted">
            {t('footer.about')}
          </p>
          <p className="mt-4 text-xs text-foreground-subtle">{t('footer.parentOrg')}</p>
        </div>

        {/* Explore */}
        <nav aria-label={t('footer.explore')}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
            {t('footer.explore')}
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-1">
            {footerNav.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="text-sm text-foreground-muted transition-colors duration-fast hover:text-link-hover"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact + social */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
            {t('footer.contactHeading')}
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-foreground-muted">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span>{t('footer.address')}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <a href={siteConfig.phoneHref} className="hover:text-link-hover">
                {t('footer.phone')}
              </a>
            </li>
          </ul>

          <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-foreground">
            {t('footer.followHeading')}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {siteConfig.social.map((s) => (
              <li key={s.key}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[2.25rem] items-center rounded-md border border-line bg-surface px-3 text-xs font-medium text-foreground-muted transition-colors duration-fast hover:border-line-strong hover:text-foreground"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-foreground-subtle sm:flex-row">
          <p>
            © {year} {t('meta.orgFullName')}. {t('footer.rights')}
          </p>
          <p>{t('footer.builtWith')}</p>
        </div>
      </div>
    </footer>
  );
}
