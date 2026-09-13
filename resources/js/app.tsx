import { createInertiaApp } from '@inertiajs/react';
import { hydrateRoot } from 'react-dom/client';

const pages = import.meta.glob('./Pages/**/*.tsx');

void createInertiaApp({
    // The server already rendered the title into <title>; letting Inertia
    // rewrite it on boot would flash the untranslated fallback.
    title: (title) => title,
    resolve: (name) => {
        const page = pages[`./Pages/${name}.tsx`];
        if (!page) throw new Error(`Inertia page not found: ${name}`);
        return page();
    },
    setup({ el, App, props }) {
        // hydrateRoot, not createRoot: the markup is already there from SSR.
        // createRoot would throw it away and re-render, which costs the very
        // paint SSR was added to save.
        hydrateRoot(el, <App {...props} />);
    },
    progress: { color: 'var(--color-primary)' },
});
