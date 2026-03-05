import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "./shared/api/schema.yaml",
    output: {
      mode: "tags-split",
      target: "./shared/api/endpoints",
      schemas: "./shared/api/model",
      client: "react-query",
      httpClient: "axios",
      prettier: true,
      override: {
        mutator: {
          path: "./shared/api/instance.ts",
          name: "createInstance",
        },
      },
    },
  },
});
