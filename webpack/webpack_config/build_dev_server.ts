import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import type { BuildOptions } from "./types/types";
import { PAGES } from "./_config_.ts";

export function build_dev_server(options: BuildOptions): DevServerConfiguration {
  const pageRewrites = PAGES.map((page) => ({
    from: page === "index" ? /^\/$/ : new RegExp(`^\\/${page}`),
    to: `/${page}.html`,
  }));

  const rewrites = [
    ...pageRewrites,
    { from: /./, to: "/index.html" },
  ];

  return {
    static: {
      directory: options.paths.output,
      publicPath: "/",
      watch: true,
    },
    port: options.port ?? 3300,
    open: ["/index.html"],
    hot: true,
    compress: true,
    historyApiFallback: {
      rewrites,
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true,
    },
    devMiddleware: {
      writeToDisk: true,
      publicPath: "/",
    },
    watchFiles: {
      paths: [`${options.paths.src}/**/*`, `${options.paths.public}/**/*`],
      options: {
        usePolling: false,
      },
    },
  };
}
