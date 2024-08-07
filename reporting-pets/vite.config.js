/// <reference types="vitest" />
/** @type {import('vite').UserConfig} */
export default {
  base: "http://localhost:5174/",
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
        assetFileNames: (assetInfo) => {
          console.log(assetInfo);
          return `TEST-[name][extname]`;
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
