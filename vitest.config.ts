import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@interview/common': path.resolve(__dirname, 'libs/common/src/index.ts'),
    },
  },
});
