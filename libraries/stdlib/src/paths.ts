import path from "node:path";

export interface DataPathsConfig {
  baseDir: string;
  sourcesSubdir?: string;
  resultsSubdir?: string;
}

export interface DataPaths {
  baseDir: string;
  sourcesDir: string;
  resultsDir: string;
  sourceDir: (name: string) => string;
  resultDir: (name: string) => string;
}

export function createDataPaths(config: DataPathsConfig): DataPaths {
  const sourcesDir = path.join(config.baseDir, config.sourcesSubdir ?? "sources");
  const resultsDir = path.join(config.baseDir, config.resultsSubdir ?? "results");

  return {
    baseDir: config.baseDir,
    sourcesDir,
    resultsDir,
    sourceDir: (name) => path.join(sourcesDir, name),
    resultDir: (name) => path.join(resultsDir, name),
  };
}
