import type { ESLint, Linter } from 'eslint';

import { PLUGIN_NAME } from '../meta.js';

export const createRecommendedConfig = (options: {
  plugin: ESLint.Plugin;
}): Linter.Config => {
  const { plugin } = options;

  // Disabled to due clash with eslint convention
  /* eslint-disable @typescript-eslint/naming-convention */
  return {
    name: `${PLUGIN_NAME}/recommended`,
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    plugins: {
      'react-import': plugin,
    },
    rules: {
      'react-import/consistent-syntax': ['error', 'namespace'],
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  };
  /* eslint-enable @typescript-eslint/naming-convention */
};
