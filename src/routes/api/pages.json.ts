import fs from 'fs';
import path from 'path';
import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

export const get: RequestHandler = async () => {
    const routesDir = path.resolve('src/routes');
    const pages: string[] = [];

    function readDir(dir: string, basePath: string = ''): void {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                readDir(filePath, path.join(basePath, file));
            } else if (file.endsWith('.svelte') || file.endsWith('.md')) {
                const fileNameWithoutExt = file.replace(/\.(svelte|md)$/, '');
                let route = '';
                // If file name is "+page", use the current basePath as route
                if (fileNameWithoutExt === '+page') {
                    route = basePath;
                } else {
                    route = path.join(basePath, fileNameWithoutExt);
                }
                // Ensure a leading slash and convert Windows separators if needed
                route = '/' + route.split(path.sep).filter(Boolean).join('/');
                pages.push(route);
            }
        });
    }

    readDir(routesDir);

    return new Response(JSON.stringify({ pages }), {
        headers: { 'Content-Type': 'application/json' }
    });
};