module.exports = {
  root: true,
  plugins: ['react-import'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react-import/consistent-syntax': ['error', 'namespace'],
  },
};
