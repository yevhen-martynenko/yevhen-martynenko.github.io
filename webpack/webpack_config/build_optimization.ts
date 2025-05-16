import type { Configuration } from "webpack";
import type { BuildOptions } from "./types/types";
import TerserPlugin from "terser-webpack-plugin";


export function build_optimization(options: BuildOptions): Configuration["optimization"] {
    const dev_mode = options.mode === "development";
    const prod_mode = options.mode === "production";

    return {
        usedExports: true,  // remove unused code
        sideEffects: true,
        // minimize: prod_mode,
        minimizer: prod_mode ? [new TerserPlugin({ parallel: true })] : [],
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                defaultVendors: {
                    reuseExistingChunk: true,
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                },
                common: {
                    test: /[\\/]src[\\/](components|utils|hooks)[\\/]/,
                    name: "common",
                    chunks: "all",
                },
            },
        },
        runtimeChunk: "single",
    }
}
