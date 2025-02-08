import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [
        vitePreprocess(),
        mdsvex({ extensions: ['.md'] })
    ],
    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: null,
            precompress: false,
            strict: true,
            paths: process.argv.includes('dev') ? '' : process.env.BASE_PATH || ''
        }),
        prerender: {
            entries: ['*']
        }
    },
    extensions: ['.svelte', '.svx', '.md']
};

export default config;
