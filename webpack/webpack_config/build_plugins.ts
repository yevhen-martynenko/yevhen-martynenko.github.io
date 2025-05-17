import webpack from "webpack";
import path from "path";
import type { Configuration } from "webpack";
import type { BuildOptions } from "./types/types";
import { HTML_PATH, MAIN_HTML_PAGE, HTML_PAGES, COPY_PARTIALS } from "./_config_.ts";
import HTMLWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin"; 
import CopyPlugin from "copy-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";


export function build_plugins(options: BuildOptions): Configuration["plugins"] {
    const dev_mode = options.mode === "development";
    const prod_mode = options.mode === "production";

    const has_html_pages = (HTML_PAGES ?? []).length > 0;
    const html_plugins = (HTML_PAGES ?? []).map(page => 
        new HTMLWebpackPlugin({
            title: page.title,
            filename: page.filename,
            template: page.template ?? options.paths.html, 
            favicon: options.paths.favicon,
            inject: false,
            chunks: page.chunks,
            minify: prod_mode
        })
    );
    const copy_patterns = [
        // { from: "source", to: "dest" },
        // { 
        //     from: path.resolve(options.paths.src, "assets/images/"),
        //     to: path.resolve(options.paths.output, "assets/images/"),
        // },
        // {
        //     from: path.resolve(options.paths.src, "assets/fonts/"),
        //     to: path.resolve(options.paths.output, "assets/fonts/"),
        //     globOptions: {
        //         ignore: ["*.ttf", "*.woff", "**/*.ttf", "**/*.woff"],
        //     },
        // },
        // {
        //     from: path.resolve(options.paths.public, "partials/"),
        //     to: path.resolve(options.paths.output, `${HTML_PATH}/partials/`),
        // },
    ];
    if (!has_html_pages) {
        copy_patterns.push({
            from: path.resolve(options.paths.public, MAIN_HTML_PAGE), 
            to: path.resolve(options.paths.output, "[name][ext]"),
            // to: path.resolve(options.paths.output, "index.[contenthash][ext]")
        });
    }

    const plugins: Configuration["plugins"] = [
        ...html_plugins,
        ...(copy_patterns.length > 0 ? [new CopyPlugin({ patterns: copy_patterns })] : []),
        new CleanWebpackPlugin(),
    ]

    if(dev_mode) {
        plugins.push(new ForkTsCheckerWebpackPlugin())  // run TypeScript type checking in a separate process for better performance
        
        if(COPY_PARTIALS) {
            plugins.push(new CopyPlugin({
                patterns: [
                    { 
                        from: path.resolve(options.paths.public, "partials"),
                        to: path.resolve(options.paths.output, `${HTML_PATH}/partials/[name].copy[ext]`),
                        // to: path.resolve(options.paths.output, "partials/[name].[contenthash][ext]"),
                    },
                ]
            }))
        }
    }

    if(prod_mode) {
        plugins.push(new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "css/[id].css",
        }))

        if(options.analyzer) {
            plugins.push(new BundleAnalyzerPlugin())
        }

        plugins.push(new CopyPlugin({
            patterns: [
                { 
                    from: path.resolve(options.paths.public, "i18n"),
                    to: path.resolve(options.paths.output, "i18n")
                },
            ]
        }))
    }

    return plugins;
}
