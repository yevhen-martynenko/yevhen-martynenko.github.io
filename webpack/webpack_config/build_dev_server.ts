import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import type { BuildOptions } from "./types/types";


export function build_dev_server(options: BuildOptions): DevServerConfiguration {
    return {
        static: {
            directory: options.paths.output,
        },
        port: options.port ?? 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    }
}
