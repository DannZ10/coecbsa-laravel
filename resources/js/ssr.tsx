import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import ReactDOMServer from 'react-dom/server';

const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => title,
        resolve: (name) => {
            const module = pages[`./Pages/${name}.tsx`];
            if (!module) throw new Error(`Inertia page not found: ${name}`);
            return module;
        },
        setup: ({ App, props }) => <App {...props} />,
    }),
);
