import { config as baseConfig } from "@feedback/eslint-config/base";

export default [
  ...baseConfig,
  {
    files: ["**/*.spec.ts", "**/*.e2e-spec.ts"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
      },
    },
  },
  {
    ignores: ["eslint.config.mjs", "dist/**", "generated/**"],
  },
];
