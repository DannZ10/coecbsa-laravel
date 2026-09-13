import { Languages } from 'lucide-react';
import { useLocale, useTranslations } from '@/lib/i18n';
import { usePathname, useRouter } from '@/lib/navigation';
import { routing } from '@/lib/routing';
import { cn } from '@/lib/utils';

/**
 * Toggles between ID and EN, keeping the current path.
 *
 * The locale is a plain URL prefix, so swapping it is the whole operation —
 * no params-aware router needed. The visit is a normal server request, so the
 * new page arrives already rendered in the other language.
 */
export function LanguageSwitch({ className }: { className?: string }) {
  const t = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const other = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  function switchTo(next: string) {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  return (
    <div
      role="group"
      aria-label={t('switch')}
      className={cn(
        'inline-flex items-center rounded-md border border-line bg-surface p-0.5 text-sm',
        className,
      )}
    >
      <Languages className="mx-1.5 h-4 w-4 text-foreground-subtle" aria-hidden />
      {routing.locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            aria-pressed={active}
            className={cn(
              'min-w-[2.25rem] rounded-[8px] px-2 py-1.5 font-semibold transition-colors duration-fast',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
              active
                ? 'bg-primary text-primary-fg'
                : 'text-foreground-muted hover:bg-surface-2 hover:text-foreground',
            )}
          >
            {t(l === 'en' ? 'enShort' : 'idShort')}
            <span className="sr-only">
              {' '}
              {t(l)} {active ? '' : `— ${t('switch')} → ${t(other)}`}
            </span>
          </button>
        );
      })}
    </div>
  );
}
