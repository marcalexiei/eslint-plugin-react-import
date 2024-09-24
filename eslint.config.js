import pluginJs from "@eslint/js";
import pluginEslintPlugin from "eslint-plugin-eslint-plugin";
import pluginEslintNode from "eslint-plugin-n";
import tseslint from "typescript-eslint";

/** @type {Array<import('eslint').Linter.Config>} */
export default [
  {
    ignores: ["dist", "coverage", "tests/fixtures/**/*"],
  },
  pluginJs.configs.recommended,
  pluginEslintPlugin.configs["flat/recommended"],
  {
    ...pluginEslintNode.configs["flat/recommended-module"],
    rules: {
      ...pluginEslintNode.configs["flat/recommended-module"].rules,
      "n/no-missing-import": ["error", { allowModules: ["estree"] }],
    },
  },
  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
  },
  // typechecking related rule should run only inside src
  ...tseslint.configs.strictTypeChecked.map((it) => ({
    ...it,
    files: ["src/**/*.{js,mjs,cjs,ts}"],
  })),
];
