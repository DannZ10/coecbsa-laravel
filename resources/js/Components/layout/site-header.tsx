import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { Link, usePathname } from '@/lib/navigation';
import { navItems } from '@/config/site';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { LanguageSwitch } from './language-switch';

export function SiteHeader() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll + subtle elevation on scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        'sticky top-0 z-sticky border-b bg-background/85 backdrop-blur-md transition-shadow duration-base',
        scrolled ? 'border-line shadow-sm' : 'border-transparent',
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        {/* No aria-label: the wordmark inside is the visible text, and an
            aria-label that does not contain it fails WCAG 2.5.3 (Label in Name)
            — a voice-control user saying "click CoE CBSA" would not match. */}
        <Link href="/" className="rounded-md">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav aria-label={t('primaryLabel')} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'inline-flex h-10 items-center rounded-md px-3 text-sm font-medium transition-colors duration-fast',
                    isActive(item.href)
                      ? 'bg-primary-subtle text-primary-subtle-fg'
                      : 'text-foreground-muted hover:bg-surface-2 hover:text-foreground',
                  )}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <LanguageSwitch className="hidden sm:inline-flex" />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground-muted hover:bg-surface-2 hover:text-foreground lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t('closeMenu') : t('openMenu')}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 top-16 z-overlay bg-stone-950/40 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <nav
            id="mobile-nav"
            aria-label={t('primaryLabel')}
            className="fixed inset-x-0 top-16 z-modal max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-surface p-4 shadow-lg lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn(
                      'flex min-h-[3rem] items-center rounded-md px-3 text-base font-medium transition-colors duration-fast',
                      isActive(item.href)
                        ? 'bg-primary-subtle text-primary-subtle-fg'
                        : 'text-foreground hover:bg-surface-2',
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-line pt-4">
              <LanguageSwitch />
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
