# eslint-plugin-react-import

[![CI](https://github.com/marcalexiei/eslint-plugin-react-import/actions/workflows/CI.yml/badge.svg)](https://github.com/marcalexiei/eslint-plugin-react-import/actions/workflows/CI.yml)
[![CI](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io)

> [!WARNING]
> 🚧 Work in progress 🚧
>
> Check [#1](https://github.com/marcalexiei/eslint-plugin-react-import/issues/1)

ESLint plugin to ensure consistent react imports

> [!WARNING]
> This plugin supports `eslint >= 9` and only exposes flat configs

## Rules

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                           | Description                                                                                                                                            | 💼 | 🔧 |
| :----------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- | :- | :- |
| [syntax](docs/rules/syntax.md) | Enforces React import style across your code. Can be customized to use default or namespace import. By default converts exports using namespace import | ✅  | 🔧 |

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
