import type { BuildOptions } from "../types/types";


export function build_babel_loader(options: BuildOptions) {
    const presets = [
        ["@babel/preset-env", { targets: "defaults", modules: false }],
        "@babel/preset-typescript",
    ];


    return {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader",
            options: {
                presets,
            },
        },
    };
}
