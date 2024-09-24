# eslint-plugin-react-import

[![CI](https://github.com/marcalexiei/eslint-plugin-react-import/actions/workflows/CI.yml/badge.svg)](https://github.com/marcalexiei/eslint-plugin-react-import/actions/workflows/CI.yml)
[![Code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io)
[![npm version](https://img.shields.io/npm/v/eslint-plugin-react-import.svg?style=flat-square)](https://www.npmjs.com/package/eslint-plugin-react-import)
[![issues](https://img.shields.io/github/issues/marcalexiei/eslint-plugin-react-import.svg)](https://github.com/marcalexiei/eslint-plugin-react-import/issues)

ESLint plugin to ensure consistent react imports

> [!WARNING]
> This plugin supports `eslint 8` but do not expose legacy configs.
> See the [guide below](#configuration-legacy-eslintrc) use this plugin with legacy config

## Rules

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                 | Description                                                                                         | 💼  | 🔧  |
| :--------------------------------------------------- | :-------------------------------------------------------------------------------------------------- | :-- | :-- |
| [consistent-syntax](docs/rules/consistent-syntax.md) | Enforces React import style across your code. Can be customized to use default or namespace import. | ✅  | 🔧  |

<!-- end auto-generated rules list -->

## Installation

```shell
npm i --save-dev eslint eslint-plugin-react-import
```

```shell
yarn add --dev eslint eslint-plugin-react-import
```

```shell
pnpm add --save-dev eslint eslint-plugin-react-import
```

## Configuration

> [!TIP]
> For a working example check `tests/fixtures` folders

### Javascript

```js
// eslint.config.js
import eslintPluginReactImport from "eslint-plugin-react-import";
export default [
  // other configs
  // ...
  eslintPluginReactImport.configs.recommended,
];
```

### Typescript

> [!NOTE]
> In order to replace all type occurrences typescript parser should be used

```js
// eslint.config.js
import eslintPluginReactImport from "eslint-plugin-react-import";
import typescriptEslintParser from "@typescript-eslint/parser";

export default [
  // other configs
  // ...
  {
    ...eslintPluginReactImport.configs.recommended,
    languageOptions: {
      ...eslintPluginReactImport.configs.recommended.languageOptions,
      parser: typescriptEslintParser,
    },
  },
];
```

## Configuration (legacy eslintrc)

For legacy config there is no exported config. Since this plugin include one rule
you just need to add the plugin name to plugins list and configure the rules:

```js
module.exports = {
  root: true,
  plugins: [
    // Other plugins...
    "react-import",
  ],
  // Remember to change parser if you are using ts
  parser: "@typescript-eslint/parser",
  parserOptions: {
    // ...
  },
  rules: {
    // Configure the rule
    "react-import/consistent-syntax": ["error", "namespace"],
  },
};
```
