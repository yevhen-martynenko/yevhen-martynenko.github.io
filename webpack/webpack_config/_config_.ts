import path from "path";
import type { PathsConfig } from "./types/types";


export const PAGES: string[] = ["index", "coming_soon", "portfolio", "blog", "site_map"];
export const HTML_PATH: string = "../dist";

export const COPY_PARTIALS: boolean = false;

export const DEFAULT_PATHS: PathsConfig = {
    dist: "../dist/",
    src: "../src/",
    public: "../public/",
};

export const ENTRY_PATHS: Record<string, string> = {
    main: "app.ts",
    ...PAGES.reduce<Record<string, string>>((acc, page) => {
        acc[page] = `pages/${page}.ts`;
        return acc;
    }, {}),
};

export const MAIN_HTML_PAGE: string = `base.html`;
export const HTML_PAGES: Array<{ title?: string; filename: string; template?: string; chunks?: string[] }> = [
    ...PAGES.map((page) => ({
        title: `${page} page`,
        filename: path.resolve(DEFAULT_PATHS.dist, "pages", `${page}.html`),
        template: path.resolve(DEFAULT_PATHS.public, "pages", `${page}.njk`),
        chunks: [page],
    })),
];

export const ALIASES: Record<string, string> = {
    "@utils": "utils",
    "@styles": "styles",
    "@images": "assets/images",
    "@icons": "assets/images/icons",
    "@fonts": "assets/fonts",
};
