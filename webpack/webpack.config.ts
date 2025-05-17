import webpack from "webpack";
import path from "path";
import { fileURLToPath } from "url";
import type { BuildPaths, BuildMode, BuildPlatform } from "./webpack_config/types/types";
import { build_webpack } from "./webpack_config/build_webpack.ts";
import { MAIN_HTML_PAGE, DEFAULT_PATHS, ENTRY_PATHS } from "./webpack_config/_config_.ts";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

interface EnvVariables {
    mode?: BuildMode,
    port?: number,
    analyzer?: boolean,
    platform?: BuildPlatform,
    logging?: boolean,
};

const ENTRY_VALUES: Record<string, string> = Object.fromEntries(
    Object.entries(ENTRY_PATHS).map(([key, value]) => [
        key,
        path.resolve(__dirname, DEFAULT_PATHS.src, value)
    ])
);


export default (env: EnvVariables) => {
    const paths: BuildPaths = {
        entry: ENTRY_VALUES,
        output: path.resolve(__dirname, DEFAULT_PATHS.dist),
        src: path.resolve(__dirname, DEFAULT_PATHS.src),
        public: path.resolve(__dirname, DEFAULT_PATHS.public),
        html: path.resolve(__dirname, DEFAULT_PATHS.public, MAIN_HTML_PAGE),
        favicon: path.resolve(__dirname, DEFAULT_PATHS.src, "assets/images/icons/favicon.ico"),
    };

    const config: webpack.Configuration = build_webpack({
        port: env.port ?? 3300,
        mode: env.mode ?? "development",
        paths,
        analyzer: env.analyzer ?? false,
        platform: env.platform ?? "desktop",
        logging: env.logging ?? false,
    });

    if (env.mode === "development" && env.logging) {
        logging(env, paths);
    }

    return config;
}

function logging(env: EnvVariables, paths: BuildPaths) {
    console.log("\n\n───────────────────────────────────────────");
    console.log("-----  Webpack Build Info  -----");
    console.log("Mode:", env.mode);
    console.log("Port:", env.port);
    console.log("Analyzer Enabled:", env.analyzer);
    console.log("Platform:", env.platform);
    console.log("\n-----  Paths Configuration  -----");
    console.log("Entry Paths:", paths.entry);
    console.log("Output Directory:", paths.output);
    console.log("Source Directory:", paths.src);
    console.log("Public Directory:", paths.public);
    console.log("HTML Template:", paths.html);
    console.log("Favicon Path:", paths.favicon);
    console.log("───────────────────────────────────────────\n\n");
}
