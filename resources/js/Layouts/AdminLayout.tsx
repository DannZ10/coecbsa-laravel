import { Link, router, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    ChevronRight,
    Images,
    LayoutDashboard,
    LibraryBig,
    LogOut,
    Languages,
    Mail,
    Menu,
    Moon,
    Newspaper,
    SlidersHorizontal,
    Sun,
    Tags,
    Users,
    X,
} from 'lucide-react';
import * as React from 'react';
import { useLocale, useTranslations, type SharedProps } from '@/lib/i18n';
import { cn } from '@/lib/utils';

// Loaded here rather than from the global stylesheet, so Vite emits the CMS
// styles as their own chunk and a public visitor never downloads them.
import '../../css/admin.css';

export const ADMIN_NAV = [
    { href: '/admin', key: 'dashboard', icon: LayoutDashboard },
    { href: '/admin/news', key: 'news', icon: Newspaper },
    { href: '/admin/categories', key: 'categories', icon: Tags },
    { href: '/admin/content', key: 'content', icon: SlidersHorizontal },
    { href: '/admin/gallery', key: 'gallery', icon: Images },
    { href: '/admin/media', key: 'media', icon: LibraryBig },
    { href: '/admin/contact', key: 'inbox', icon: Mail },
    { href: '/admin/users', key: 'users', icon: Users, role: 'super_admin' },
    { href: '/admin/settings', key: 'settings', icon: SlidersHorizontal },
] as const;

export function isAdminRouteActive(pathname: string, href: string): boolean {
    return href === '/admin'
        ? pathname === href
        : pathname === href || pathname.startsWith(`${href}/`);
}

function ThemeToggle() {
    const [dark, setDark] = React.useState(false);

    React.useEffect(() => {
        const stored = localStorage.getItem('cms-theme');
        const initial =
            stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setDark(initial === 'dark');
        document.documentElement.dataset.theme = initial;
    }, []);

    const toggle = () => {
        const next = dark ? 'light' : 'dark';
        setDark(!dark);
        document.documentElement.dataset.theme = next;
        try {
            localStorage.setItem('cms-theme', next);
        } catch {
            // Private browsing: the theme simply does not persist.
        }
    };

    return (
        <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground-muted transition-colors duration-fast hover:bg-surface-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" onClick={toggle} aria-label="Theme">
            {dark ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
        </button>
    );
}

function LanguageSwitch() {
    const locale = useLocale();

    return (
        <div
            role="group"
            className="inline-flex items-center rounded-md border border-line bg-surface p-0.5 text-xs"
        >
            <Languages className="mx-1 h-3.5 w-3.5 text-foreground-subtle" aria-hidden />
            {(['id', 'en'] as const).map((code) => (
                <button
                    key={code}
                    type="button"
                    className={cn(
                        'min-w-[1.9rem] rounded-[6px] px-1.5 py-1 font-semibold transition-colors duration-fast',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                        locale === code
                            ? 'bg-primary text-primary-fg'
                            : 'text-foreground-muted hover:bg-surface-2 hover:text-foreground',
                    )}
                    aria-pressed={locale === code}
                    onClick={() =>
                        router.post(
                            '/admin/locale',
                            { locale: code },
                            { preserveScroll: true, preserveState: false },
                        )
                    }
                >
                    {code.toUpperCase()}
                </button>
            ))}
        </div>
    );
}

export default function AdminLayout({
    title,
    children,
}: {
    title?: string;
    children: React.ReactNode;
}) {
    const page = usePage<SharedProps>();
    const user = page.props.auth.user;
    const pathname = new URL(page.url, 'http://localhost').pathname;
    const locale = useLocale();
    const t = useTranslations('admin.nav');
    const tRole = useTranslations('admin.role');
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => setOpen(false), [pathname]);

    // The server never renders this layout for an anonymous visitor, so there
    // is no loading or redirecting state to hold — that whole branch of the
    // previous client-side shell is gone.
    if (!user) return null;

    const current = ADMIN_NAV.find((item) => isAdminRouteActive(pathname, item.href));
    const visible = ADMIN_NAV.filter((item) => !('role' in item) || item.role === user.role);

    return (
        <div className="cms-workspace">
            <aside className="cms-sidebar">
                <div className="cms-sidebar-brand">
                    <Link href="/admin" aria-label={t('home')}>
                        <img src="/brand/coe-cbsa.png" alt="CoE CBSA" className="cms-brand cms-brand-light" width={144} height={44} />
                    </Link>
                    <button
                        type="button"
                        className="cms-menu-toggle"
                        aria-label={t('label')}
                        aria-expanded={open}
                        aria-controls="cms-navigation"
                        onClick={() => setOpen((value) => !value)}
                    >
                        {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
                    </button>
                </div>

                <div id="cms-navigation" className={cn('cms-sidebar-panel', open && 'cms-sidebar-panel-open')}>
                    <p className="cms-sidebar-kicker">{t('cms')}</p>
                    <nav aria-label={t('label')}>
                        <ul className="cms-nav-list">
                            {visible.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="cms-nav-link"
                                        aria-current={isAdminRouteActive(pathname, item.href) ? 'page' : undefined}
                                    >
                                        <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
                                        {t(item.key)}
                                        <span className="cms-nav-dot" aria-hidden />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="cms-sidebar-footer">
                        <a href={`/${locale}`} className="cms-site-link" target="_blank" rel="noopener noreferrer">
                            {locale === 'id' ? 'Lihat website' : 'View website'}
                            <ArrowUpRight className="h-4 w-4" aria-hidden />
                        </a>
                        <p>
                            Center of Excellence
                            <br />
                            <span>Universitas Brawijaya</span>
                        </p>
                    </div>
                </div>
            </aside>

            <div className="cms-workspace-body">
                <header className="cms-topbar">
                    <div className="cms-breadcrumb">
                        <span>CMS</span>
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                        <span>{title ?? t(current?.key ?? 'dashboard')}</span>
                    </div>
                    <div className="cms-topbar-actions">
                        <LanguageSwitch />
                        <ThemeToggle />
                        <div className="cms-user">
                            <span className="cms-avatar" aria-hidden>
                                {user.name.trim().charAt(0).toUpperCase()}
                            </span>
                            <div className="cms-user-details">
                                <p>{user.name}</p>
                                <span>{tRole(user.role)}</span>
                            </div>
                        </div>
                        <Link
                            href="/admin/logout"
                            method="post"
                            as="button"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground-muted transition-colors duration-fast hover:bg-surface-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                            aria-label={t('signOut')}
                            title={t('signOut')}
                        >
                            <LogOut className="h-4 w-4" aria-hidden />
                        </Link>
                    </div>
                </header>

                <main id="main-content" className="cms-content" tabIndex={-1}>
                    {children}
                </main>
            </div>
        </div>
    );
}
