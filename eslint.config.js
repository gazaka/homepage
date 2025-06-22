// eslint.config.js
const globals = require('globals');
const js = require('@eslint/js');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  {
    ignores: ['proxy/'], // We don't want to lint the proxy's node_modules
  },
  js.configs.recommended,
  prettierConfig, // This correctly disables rules that conflict with Prettier
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // You can add custom rules here later if you wish
      'no-unused-vars': 'warn', // This will warn about unused variables instead of just highlighting
    },
  },
];