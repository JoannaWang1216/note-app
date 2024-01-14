/* eslint-env node */
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended', 'plugin:jsx-a11y/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'jsx-a11y'],
    root: true,
  };