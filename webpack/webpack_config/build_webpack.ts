import webpack from "webpack";
import path from "path";
import type { BuildOptions } from "./types/types";
import { build_dev_server } from "./build_dev_server.ts";
import { build_plugins } from "./build_plugins.ts";
import { build_loaders } from "./build_loaders.ts";
import { build_resolvers } from "./build_resolvers.ts";
import { build_optimization } from "./build_optimization.ts";
import { PAGES } from "./_config_.ts";
import { __filename } from "../webpack.config.ts";


export function build_webpack(options: BuildOptions): webpack.Configuration {
    const {mode, port, paths} = options;
    const dev_mode = mode === "development";

    const entry = Object.fromEntries(
        Object.entries(paths.entry).map(([key, value]) => [
            key,
            {
                import: value,
                filename: key === "main" 
                    ? "main.js" 
                    : (PAGES.includes(key) ? `js/${key}.js` : `js/${key}.js`)
            },
        ])
    );

    const rootDir = path.resolve(paths.src, '..');

    return {
        mode: mode ?? "development",
        entry,
        output: {
            filename: "[name].js",
            path: paths.output,
            clean: true,
            chunkFilename: "[name].js",
            assetModuleFilename: "assets/[name][ext]",
        },
        cache: dev_mode ? {
            type: 'memory'
        } : false,
        optimization: build_optimization(options),
        devtool: mode === "development" ? "eval-cheap-module-source-map" : false,
        devServer: mode === "development" ? build_dev_server(options) : undefined,
        plugins: build_plugins(options),
        module: {
            rules: build_loaders(options),
        },
        resolve: build_resolvers(options),
        stats: {
            modules: false,
            children: false,
            chunks: false,
            assets: dev_mode,
        }
    }
}
