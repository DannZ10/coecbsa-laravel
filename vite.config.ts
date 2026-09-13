import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/globals.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: { '@': path.resolve(import.meta.dirname, 'resources/js') },
    },
    // No manualChunks. Forcing @tiptap into a named chunk made that chunk a
    // dependency of the entry, so the CMS editor was modulepreloaded on the
    // public home page — the opposite of the intent. Inertia imports pages
    // lazily and the hero imports three.js lazily, so Rollup's own splitting
    // already keeps both off the initial path.
});
