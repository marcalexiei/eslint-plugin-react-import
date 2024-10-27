import eslintPluginReactImport from 'eslint-plugin-react-import';
import typescriptEslintParser from '@typescript-eslint/parser';

export default [
  {
    ...eslintPluginReactImport.configs.recommended,
    languageOptions: {
      ...eslintPluginReactImport.configs.recommended.languageOptions,
      parser: typescriptEslintParser,
    },
  },
];
