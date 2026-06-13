import react from '@vitejs/plugin-react';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      exclude: ['src/index.tsx', 'src/App.tsx', 'src/references.d.ts', 'src/__tests__/**'],
      include: ['src/**/*.{ts,tsx}'],
      provider: 'v8',
      thresholds: {branches: 80, functions: 80, lines: 80, statements: 80},
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
});
