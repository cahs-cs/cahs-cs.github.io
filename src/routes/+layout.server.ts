import type { LayoutServerLoad } from './$types';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const prerender = true;

interface Page {
    route: string;
    title: string;
    children?: Page[];
}

function toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}

function readDir(dir: string, basePath: string = ''): Page[] {
    const entries = fs.readdirSync(dir);

    if (basePath === '') {
        const results: Page[] = [];

        const rootPageFile = entries.find(
            (file) =>
                file.startsWith('+page') &&
                (file.endsWith('.md') || file.endsWith('.svelte'))
        );
        if (rootPageFile) {
            let homeTitle = 'Home';
            const filePath = path.join(dir, rootPageFile);
            if (rootPageFile.endsWith('.md')) {
                const content = fs.readFileSync(filePath, 'utf-8');
                const fm = matter(content);
                homeTitle = fm.data.title || 'Home';
            }
            results.push({ route: '/', title: homeTitle });
        }

        for (const entry of entries) {
            const entryPath = path.join(dir, entry);
            const stat = fs.statSync(entryPath);
            if (stat.isDirectory() && entry !== 'api') {
                if (entry === 'courses') {
                    const coursePagesUnprefixed = readDir(entryPath, '');
                    const coursePages = coursePagesUnprefixed.map((p) => {
                        function prefix(page: Page): Page {
                            const prefixed: Page = {
                                ...page,
                                route: '/courses' + page.route
                            };
                            if (page.children) {
                                prefixed.children = page.children.map(prefix);
                            }
                            return prefixed;
                        }
                        return prefix(p);
                    });
                    results.push(...coursePages);
                } else {
                    const childPages = readDir(entryPath, entry);
                    results.push(...childPages);
                }
            }
        }
        return results;
    }

    let hasPage = false;
    let pageTitle = '';
    const pageFile = entries.find(
        (file) =>
            file.startsWith('+page') &&
            (file.endsWith('.md') || file.endsWith('.svelte'))
    );
    if (pageFile) {
        hasPage = true;
        const filePath = path.join(dir, pageFile);
        if (pageFile.endsWith('.md')) {
            const content = fs.readFileSync(filePath, 'utf-8');
            const fm = matter(content);
            pageTitle = fm.data.title || toTitleCase(path.basename(basePath));
        } else {
            pageTitle = toTitleCase(path.basename(basePath));
        }
    }

    const children: Page[] = [];
    for (const entry of entries) {
        const entryPath = path.join(dir, entry);
        const stat = fs.statSync(entryPath);
        if (stat.isDirectory() && entry !== 'api') {
            const childPages = readDir(entryPath, path.join(basePath, entry));
            if (childPages.length > 0) {
                children.push(...childPages);
            }
        }
    }

    if (hasPage) {
        const route = '/' + basePath.split(path.sep).filter(Boolean).join('/');
        return [{ route: route || '/', title: pageTitle, children }];
    } else if (children.length > 0) {
        const route = '/' + basePath.split(path.sep).filter(Boolean).join('/');
        return [{ route, title: toTitleCase(path.basename(basePath)), children }];
    }

    return [];
}

export const load: LayoutServerLoad = async () => {
    const routesDir = path.resolve('src/routes');
    const pages = readDir(routesDir, '');
    return { pages };
};