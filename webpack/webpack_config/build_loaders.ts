import path from "path";
import type { ModuleOptions } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type { BuildOptions } from "./types/types";
import { DEFAULT_PATHS } from "./_config_.ts";

export function build_loaders(options: BuildOptions): ModuleOptions["rules"] {
  const dev_mode = options.mode === "development";
  const prod_mode = options.mode === "production";

  const css_loader_with_modules = {
    loader: "css-loader",
    options: {
      modules: {
        auto: /\.module\.\w+$/,
      },
      sourceMap: true,
      importLoaders: 2,
    },
  };

  const scss_module_loader = {
    test: /\.module\.(sa|sc|c)ss$/,
    use: [dev_mode ? "style-loader" : MiniCssExtractPlugin.loader, css_loader_with_modules, "sass-loader"],
  };

  const scss_loader = {
    test: /\.(sa|sc|c)ss$/,
    exclude: /\.module\.(sa|sc|c)ss$/,
    use: [dev_mode ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
  };

  const presets = [["@babel/preset-env", { targets: "defaults", modules: false }], "@babel/preset-typescript"];
  const babel_loader = {
    test: /\.(js|jsx|tsx?)$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        presets,
        cacheDirectory: true,
        cacheCompression: false,
      },
    },
  };

  const assets_loader = {
    test: /\.(png|jpg|jpeg|gif|svg)$/i,
    type: "asset/resource",
  };

  const svg_loader = {
    test: /\.svg$/,
  };

  const fonts_loader = {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: "asset/resource",
    generator: {
      filename: "assets/fonts/[name][ext]",
    },
  };

  const publicPath = path.resolve(process.cwd(), DEFAULT_PATHS.public.replace(/\/$/, ""));
  const searchPaths = [publicPath, path.join(publicPath, "pages"), path.join(publicPath, "partials")];
  const nunjucks_loader = {
    test: /\.njk$/,
    use: [
      {
        loader: "html-loader",
        options: { sources: false },
      },
      {
        loader: "nunjucks-webpack-loader",
        options: {
          searchPaths: searchPaths,
          extensions: [".njk", ".html"],
        },
      },
    ],
  };

  return [
    scss_module_loader,
    scss_loader,
    babel_loader,
    // assets_loader,
    // svg_loader,
    fonts_loader,
    nunjucks_loader,
  ];
}
