import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    include: [
      'tests/unit/**/*.test.ts',
      'tests/unit/**/*.test.tsx',
      'tests/integration/**/*.test.ts',
      'tests/integration/**/*.test.tsx',
    ],
    coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
    include: ['src/lib/**/*.ts'],  
    exclude: [
        'src/lib/auth.ts',           
        'src/types/**',
        'src/app/**',
        'src/components/**',
        'src/lib/auth.ts',
        'src/lib/constants.ts',
        'src/lib/utils.ts',
        'src/lib/storage.ts',
    ],
    thresholds: {
        lines: 80,
    },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});