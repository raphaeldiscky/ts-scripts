import path from "node:path";
import { describe, expect, it } from "vitest";
import { createDataPaths } from "./paths.js";

describe("createDataPaths", () => {
  it("derives sourcesDir/resultsDir from baseDir with default subdirs", () => {
    const dp = createDataPaths({ baseDir: "/tmp/data" });
    expect(dp.sourcesDir).toBe(path.join("/tmp/data", "sources"));
    expect(dp.resultsDir).toBe(path.join("/tmp/data", "results"));
  });

  it("sourceDir/resultDir append the script name", () => {
    const dp = createDataPaths({ baseDir: "/tmp/data" });
    expect(dp.sourceDir("foo")).toBe(path.join("/tmp/data", "sources", "foo"));
    expect(dp.resultDir("foo")).toBe(path.join("/tmp/data", "results", "foo"));
  });

  it("supports custom subdir names", () => {
    const dp = createDataPaths({
      baseDir: "/d",
      sourcesSubdir: "in",
      resultsSubdir: "out",
    });
    expect(dp.sourceDir("x")).toBe(path.join("/d", "in", "x"));
    expect(dp.resultDir("x")).toBe(path.join("/d", "out", "x"));
  });
});
