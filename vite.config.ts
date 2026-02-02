import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig(({mode}) => {
  return {
    base: mode === 'production' ? '/sauerteig' : '',
    plugins: [
      react(),
      {
        // default settings on build (i.e. fail on error)
        ...eslint(),
        apply: 'build',
      },
      {
        // do not fail on serve (i.e. local development)
        ...eslint({
          failOnError: false,
          failOnWarning: false,
          ignorePath: './.prettierignore',
        }),
        apply: 'serve',
        enforce: 'post',
      },
    ],
    server: {
      hmr: {
        overlay: false,
      },
    },
  };
});
