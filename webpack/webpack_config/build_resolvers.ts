import path from "path";
import type { Configuration } from "webpack";
import type { BuildOptions } from "./types/types";
import { ALIASES } from "./_config_.ts";


export function build_resolvers(options: BuildOptions): Configuration["resolve"] {
    const aliases = ALIASES ? Object.entries(ALIASES) : [];


    return {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "@": options.paths.src, // Static alias
            ...Object.fromEntries(
                aliases.map(([key, value]) => [key, path.resolve(options.paths.src, value)])
            ),
        },
    }
}
