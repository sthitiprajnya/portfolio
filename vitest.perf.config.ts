import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.perf.test.tsx', 'src/**/*.perf.test.ts'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
});
