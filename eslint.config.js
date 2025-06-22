// eslint.config.js
import globals from 'globals';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';

export default [
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
