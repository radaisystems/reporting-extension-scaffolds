/// <reference types="vitest" />
/** @type {import('vite').UserConfig} */
export default {
  build: {
    minify: false,
    lib: {
      entry: "./src/main.ts",
      name: "Extension",
      fileName: "main",
      formats: ["umd"],
    },
    rollupOptions: {
      external: ["@rad-ai/reporting-extensions"],
      output: {
        globals: {
          "@rad-ai/reporting-extensions": "reporting",
        },
      },
    },
  },
  preview: {
    port: 5174,
  },
  test: {
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["lcov", "text"],
      include: ["src"],
    },
    silent: true,
  },
};
