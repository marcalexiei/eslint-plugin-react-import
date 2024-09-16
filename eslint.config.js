import pluginJs from "@eslint/js";
import pluginEslintPlugin from "eslint-plugin-eslint-plugin";
import pluginEslintNode from "eslint-plugin-n";
import tseslint from "typescript-eslint";

/** @type {Array<import('eslint').Linter.Config>} */
export default [
  { ignores: ["dist", "tests"] },
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  pluginJs.configs.recommended,
  pluginEslintPlugin.configs["flat/recommended"],
  {
    ...pluginEslintNode.configs["flat/recommended-module"],
    rules: {
      ...pluginEslintNode.configs["flat/recommended-module"].rules,
      "n/no-missing-import": ["error", { allowModules: ["estree"] }],
    },
  },
  ...tseslint.configs.recommended,
];
