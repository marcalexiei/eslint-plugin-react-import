# eslint-plugin-react-import

## 3.0.0

### Major Changes

- [#126](https://github.com/marcalexiei/eslint-plugin-react-import/pull/126) [`6b9369d`](https://github.com/marcalexiei/eslint-plugin-react-import/commit/6b9369dddc7f51b58fab1e3f837ab2b4b145e8e4) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat!: `eslint` 8 and legacy `.eslintrc` config support have been removed
  - The plugin now requires ESLint 9 or 10.
  - Legacy `.eslintrc` configuration is no longer supported — use `eslint.config.js` (flat config) instead

- [#126](https://github.com/marcalexiei/eslint-plugin-react-import/pull/126) [`6b9369d`](https://github.com/marcalexiei/eslint-plugin-react-import/commit/6b9369dddc7f51b58fab1e3f837ab2b4b145e8e4) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat: support `eslint` v10

## 2.1.0

### Minor Changes

- [#122](https://github.com/marcalexiei/eslint-plugin-react-import/pull/122) [`72f16be`](https://github.com/marcalexiei/eslint-plugin-react-import/commit/72f16beb420e8686a9a0e9a9c26a27f1faf936fd) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(consistent-syntax): add new `named` option

  The rule automatically allows namespace imports (`import * as React`) when they are used to access dev-only React APIs such as `captureOwnerStack`, which [cannot be safely imported by name](https://react.dev/reference/react/captureOwnerStack#captureownerstack-is-not-available) in files bundled for both production and development.

## 2.0.1

### Patch Changes

- [`326b353`](https://github.com/marcalexiei/eslint-plugin-react-import/commit/326b353845939c2ba0db4f4904d5f1670c146598) Thanks [@marcalexiei](https://github.com/marcalexiei)! - chore: enable trusted publising

## 2.0.0

### Major Changes

- [`3828056`](https://github.com/marcalexiei/eslint-plugin-react-import/commit/3828056bbd2f1305362aabe7320fe8d2e415e08f) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat: remove node 18 support

### Minor Changes

- [`0e99e9e`](https://github.com/marcalexiei/eslint-plugin-react-import/commit/0e99e9e6721a209ca73550ecbcdde135fc43357d) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat: add support for Node 24

- [`364826f`](https://github.com/marcalexiei/eslint-plugin-react-import/commit/364826f2b44d58a4b4dd9b9adaf4fb320f4c9416) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(consistent-syntax): update rule meta to match new recommendations

## 1.1.1

### Patch Changes

- [`3508675`](https://github.com/marcalexiei/eslint-plugin-react-import/commit/35086756b20d11b1faced0480dc036d601fd78f8) Thanks [@marcalexiei](https://github.com/marcalexiei)! - add provenance to published releases

## 1.1.0

### Minor Changes

- [#16](https://github.com/marcalexiei/eslint-plugin-react-import/pull/16) [`db7df62`](https://github.com/marcalexiei/eslint-plugin-react-import/commit/db7df622305fdf638515b69938c1fa591fcf6ede) Thanks [@marcalexiei](https://github.com/marcalexiei)! - Add support for ESLint 8

## 1.0.0

### Major Changes

- [`d7bc0ef`](https://github.com/marcalexiei/eslint-plugin-react-import/commit/d7bc0ef142c3b35984defdb20bc0e43faf64cf0e) Thanks [@marcalexiei](https://github.com/marcalexiei)! - Initial release
