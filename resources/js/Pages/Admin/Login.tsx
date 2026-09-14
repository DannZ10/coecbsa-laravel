import { Head, useForm, usePage } from '@inertiajs/react';
import { LogIn, ShieldCheck } from 'lucide-react';
import { useTranslations, type SharedProps } from '@/lib/i18n';

import '../../../css/admin.css';

export default function Login({ googleEnabled }: { googleEnabled: boolean }) {
    const t = useTranslations('admin.login');
    const flash = usePage<SharedProps>().props.flash;

    // Inertia's form helper holds the field state and receives the server's
    // validation errors. No zod schema on this side: the rules live in
    // LoginRequest, and duplicating them here would let the two drift.
    const form = useForm({ email: '', password: '', remember: false });

    return (
        <main className="cms-login">
            <Head title={t('title')} />

            <div className="cms-login-art" aria-hidden>
                <div className="cms-login-mark">CBSA</div>
                <p>
                    Community-Based
                    <br />
                    Sustainable Agroindustry
                </p>
            </div>

            <div className="cms-login-main">
                <div className="cms-login-panel">
                    <img src="/brand/coe-cbsa.webp" alt="CoE CBSA" className="cms-brand" width={144} height={44} />

                    <div className="cms-login-icon">
                        <ShieldCheck className="h-5 w-5" aria-hidden />
                    </div>

                    <p className="cms-page-kicker">{t('kicker')}</p>
                    <h1>{t('title')}</h1>
                    <p className="cms-login-copy">{t('subtitle')}</p>

                    {flash.error && (
                        <p role="alert" className="mt-4 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger-fg">
                            {flash.error}
                        </p>
                    )}

                    <form
                        className="mt-6 space-y-4 text-left"
                        onSubmit={(event) => {
                            event.preventDefault();
                            form.post('/admin/login', { onFinish: () => form.reset('password') });
                        }}
                    >
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-xs font-semibold text-forest-800">
                                {t('email')}
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="username"
                                required
                                placeholder={t('emailPlaceholder')}
                                value={form.data.email}
                                onChange={(event) => form.setData('email', event.target.value)}
                                aria-invalid={Boolean(form.errors.email)}
                                aria-describedby={form.errors.email ? 'email-error' : undefined}
                                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus"
                            />
                            {form.errors.email && (
                                <p id="email-error" role="alert" className="text-xs text-danger-fg">
                                    {form.errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-xs font-semibold text-forest-800">
                                {t('password')}
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                required
                                value={form.data.password}
                                onChange={(event) => form.setData('password', event.target.value)}
                                aria-invalid={Boolean(form.errors.password)}
                                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus"
                            />
                            {form.errors.password && (
                                <p role="alert" className="text-xs text-danger-fg">
                                    {form.errors.password}
                                </p>
                            )}
                        </div>

                        <label className="flex items-center gap-2 text-xs text-forest-800">
                            <input
                                type="checkbox"
                                checked={form.data.remember}
                                onChange={(event) => form.setData('remember', event.target.checked)}
                                className="h-4 w-4 rounded border-border text-forest-700 focus-visible:ring-2 focus-visible:ring-focus"
                            />
                            {t('remember')}
                        </label>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="cms-button mt-2 flex w-full items-center justify-center gap-2 rounded-full disabled:opacity-60"
                        >
                            <LogIn className="h-4 w-4" aria-hidden />
                            {t('submit')}
                        </button>
                    </form>

                    {googleEnabled && (
                        <>
                            <p className="my-4 text-center text-xs uppercase tracking-widest text-stone-500">
                                {t('or')}
                            </p>
                            {/* A plain link, not an Inertia visit: the next stop is
                                accounts.google.com, outside this application. */}
                            <a
                                href="/admin/auth/google"
                                className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-forest-800 transition-colors hover:bg-paper-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                            >
                                {t('google')}
                            </a>
                        </>
                    )}

                    <p className="cms-login-note">{t('registeredOnly')}</p>
                    <p className="mt-2 text-center text-xs text-stone-500">{t('forgot')}</p>
                </div>
            </div>
        </main>
    );
}
