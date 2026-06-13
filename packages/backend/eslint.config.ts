import config from '@ffflorian/eslint-config';
import {Config, defineConfig} from 'eslint/config';

export default defineConfig([
  config as Config,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {'no-magic-numbers': 'off'},
  },
]);
