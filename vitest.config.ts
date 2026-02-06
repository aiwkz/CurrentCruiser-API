import { defineConfig } from 'vitest/config';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true,
    server: {
      deps: {
        inline: ['jsonwebtoken'], // moved under server
      },
    },
    setupFiles: [path.resolve(__dirname, './tests/setup.ts')],
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      }
    },
  },
});
