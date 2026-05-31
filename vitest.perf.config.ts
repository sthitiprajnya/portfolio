import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.perf.test.tsx', 'src/**/*.perf.test.ts'],
  },
});
