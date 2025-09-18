export interface PathsConfig {
  dist: string;
  src: string;
  public: string;
}
export interface BuildPaths {
  entry: Record<string, string>;
  output: string;
  src: string;
  public: string;
  html: string;
  favicon: string;
}
export type BuildMode = "production" | "development";

export interface BuildOptions {
  port: number;
  paths: BuildPaths;
  mode: BuildMode;
  analyzer?: boolean;
  logging?: boolean;
}
