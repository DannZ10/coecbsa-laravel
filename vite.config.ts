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
    build: {
        // Public visitors must never download the CMS bundle. Inertia resolves
        // pages lazily, so Rollup already splits per page; this only keeps the
        // shared vendor chunk from pulling the editor in with it.
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('@tiptap')) return 'editor';
                    if (id.includes('three')) return 'three';
                },
            },
        },
    },
});
