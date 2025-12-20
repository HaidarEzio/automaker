import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.d.ts", "src/index.ts"],
      thresholds: {
        // Current overall coverage: ~19% (only error-handler.ts tested)
        // Set modest thresholds until more files are tested
        lines: 15,
        functions: 15,
        branches: 25,
        statements: 15,
      },
    },
  },
});
