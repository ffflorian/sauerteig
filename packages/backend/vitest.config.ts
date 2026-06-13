import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        'src/main.ts',
        'src/app.module.ts',
        'src/config/config.ts',
        'src/push/push.module.ts',
        'src/push/subscription.schema.ts',
        'src/__tests__/**',
      ],
      include: ['src/**/*.ts'],
      provider: 'v8',
      // branches threshold is 70 because NestJS decorator transpilation generates
      // an uncoverable Reflect.metadata conditional in every @Controller/@Injectable
      thresholds: {branches: 70, functions: 80, lines: 80, statements: 80},
    },
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    setupFiles: ['./src/__tests__/setup.ts'],
  },
});
