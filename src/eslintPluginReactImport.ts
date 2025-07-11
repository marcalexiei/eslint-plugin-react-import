import type { ESLint, Linter } from 'eslint';

import consistentSyntaxRule from './rules/consistent-syntax.js';
import { createRecommendedConfig } from './configs/recommended.js';
import { PLUGIN_NAME, PLUGIN_VERSION } from './meta.js';

const eslintPluginReactImport = {
  meta: {
    name: PLUGIN_NAME,
    version: PLUGIN_VERSION,
  },
  configs: {} as { recommended: Linter.Config },
  rules: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'consistent-syntax': consistentSyntaxRule,
  },
  processors: {},
} satisfies ESLint.Plugin;

eslintPluginReactImport.configs.recommended = createRecommendedConfig({
  plugin: eslintPluginReactImport,
});

export { eslintPluginReactImport };
