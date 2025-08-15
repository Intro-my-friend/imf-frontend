import { defineConfig } from "orval";

export default defineConfig({
  imf: {
    input: {
      target: "http://15.164.39.230:8000/openapi.json",
    },
    output: {
      mode: "tags",
      target: "./lib/orval/_generated",
      override: {
        mutator: {
          path: "./lib/instance.ts",
          name: "api",
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
});
