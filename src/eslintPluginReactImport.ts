import type { ESLint, Linter } from "eslint";

import styleRule from "./rules/style.js";

import { createRecommendedConfig } from "./configs/recommended.js";
import { PLUGIN_NAME, PLUGIN_VERSION } from "./meta.js";

const eslintPluginReactImport = {
  meta: {
    name: PLUGIN_NAME,
    version: PLUGIN_VERSION,
  },
  configs: {} as { recommended: Linter.Config },
  rules: {
    style: styleRule,
  },
  processors: {},
} satisfies ESLint.Plugin;

eslintPluginReactImport.configs.recommended = createRecommendedConfig({
  plugin: eslintPluginReactImport,
});

export { eslintPluginReactImport };
