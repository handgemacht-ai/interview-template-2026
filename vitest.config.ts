import { defineConfig } from 'vitest/config';
import path from 'node:path';
import swc from 'unplugin-swc';

export default defineConfig({
  plugins: [
    // Vitest transpiles TypeScript with esbuild, which does not emit the
    // `design:paramtypes` decorator metadata that NestJS relies on for
    // constructor-based DI. Transpile with swc (mirroring tsconfig.app.json's
    // `experimentalDecorators` + `emitDecoratorMetadata`) so the DI graph
    // resolves correctly under the test runtime.
    swc.vite({
      tsconfigFile: path.resolve(__dirname, 'apps/api/tsconfig.app.json'),
    }),
  ],
  resolve: {
    alias: {
      '@interview/common': path.resolve(__dirname, 'libs/common/src/index.ts'),
    },
  },
  test: {
    include: ['apps/api/**/*.test.ts', 'apps/api/e2e/**/*.e2e-spec.ts'],
  },
});
