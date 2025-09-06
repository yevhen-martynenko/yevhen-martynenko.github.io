import type { Configuration } from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import type { BuildOptions } from "./types/types";

export function build_optimization(options: BuildOptions): Configuration["optimization"] {
  const dev_mode = options.mode === "development";
  
  if (dev_mode) {
    return {
      splitChunks: false,
      minimize: false,
      runtimeChunk: false,
    };
  }

  return {
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
      }),
    ],
    splitChunks: false,
    runtimeChunk: false,
  };
}
