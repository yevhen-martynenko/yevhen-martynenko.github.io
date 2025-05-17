import type { Configuration } from "webpack";
import type { BuildOptions } from "./types/types";
import TerserPlugin from "terser-webpack-plugin";


export function build_optimization(options: BuildOptions): Configuration["optimization"] {
    const dev_mode = options.mode === "development";
    
    const common_config = {
        usedExports: true,  // remove unused code
        sideEffects: true,
        moduleIds: "deterministic" as const,
        chunkIds: "deterministic" as const,
    }

    if (dev_mode) {
        return {
            ...common_config,
            removeAvailableModules: false,
            removeEmptyChunks: false,
            splitChunks: false,
            minimize: false,
            runtimeChunk: 'single',
        };
    }

    return {
        ...common_config,
        minimize: true,
        minimizer: [
            new TerserPlugin({ 
                parallel: true,
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            })
        ],
        splitChunks: {
            chunks: "all",
            maxInitialRequests: 25, // Increase parallel requests
            minSize: 20000, // Only create chunks larger than 20kb
            maxSize: 60000, // Split chunks larger than 60kb
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                    priority: -20,
                },
                common: {
                    test: /[\\/]src[\\/](components|utils|hooks)[\\/]/,
                    name: "common",
                    chunks: "all",
                    minChunks: 2,
                    priority: -30,
                    reuseExistingChunk: true,
                },
            },
        },
        runtimeChunk: "single",
    };
}
