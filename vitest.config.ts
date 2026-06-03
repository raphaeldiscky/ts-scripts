import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["libraries/*", "apps/*"],
    coverage: {
      provider: "v8",
      include: ["libraries/**/src/**/*.ts"],
      exclude: ["**/*.test.ts"],
      reporter: ["text", "html", "lcov"],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
    },
  },
});
