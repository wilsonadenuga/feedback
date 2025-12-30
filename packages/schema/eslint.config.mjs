import { config as baseConfig } from "@feedback/eslint-config/base";

export default [
  ...baseConfig,
  {
    ignores: ["eslint.config.mjs", "dist/**", "node_modules/**"],
  },
];
