import { Head } from '@inertiajs/react';

/**
 * Scaffold smoke page. Exists only to prove SSR, hydration, Tailwind and the
 * design tokens are wired; it is replaced by the real Home page in phase 4.
 */
export default function Welcome({ laravel, php }: { laravel: string; php: string }) {
    return (
        <>
            <Head title="CoE CBSA" />
            <main className="mx-auto flex min-h-dvh max-w-container flex-col justify-center gap-6 px-6">
                <p className="font-display text-sm uppercase tracking-[0.2em] text-forest-600">
                    Scaffold
                </p>
                <h1 className="font-display text-display text-forest-900">CoE CBSA</h1>
                <p className="max-w-prose text-muted-foreground">
                    Laravel {laravel} · PHP {php} · Inertia · React · TypeScript
                </p>
                <div className="flex flex-wrap gap-3">
                    <span className="rounded-lg bg-forest-700 px-4 py-2 text-paper">forest-700</span>
                    <span className="rounded-lg bg-amber px-4 py-2 text-ink">amber</span>
                    <span className="rounded-lg border border-border bg-card px-4 py-2 text-card-foreground">
                        card
                    </span>
                </div>
            </main>
        </>
    );
}
