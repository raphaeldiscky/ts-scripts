import { defineConfig } from "tsdown";

export default defineConfig({
  workspace: "libraries/*",
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  deps: {
    neverBundle: [/^@local\//, /^node:/],
  },
});
