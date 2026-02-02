import config from '@ffflorian/eslint-config';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import {defineConfig} from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  ...config,
  {
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);
