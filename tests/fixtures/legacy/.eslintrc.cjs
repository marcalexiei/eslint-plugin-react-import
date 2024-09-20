module.exports = {
  root: true,
  plugins: ["react-import"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "react-import/consistent-syntax": ["error", "namespace"],
  },
};
