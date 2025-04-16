import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.js'],
  },
  coverage: {
    provider: 'v8', // or 'c8'
    reporter: ['text', 'html'],
  },
});
