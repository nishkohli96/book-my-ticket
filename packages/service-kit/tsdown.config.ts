import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  /* Services run as CommonJS (ts-node / tsc), ESM is built alongside for parity with common. */
  format: ['esm', 'cjs'],
  target: ['es2024'],
  clean: true,
  dts: true,
  deps: {
    neverBundle: true,
  },
  outExtensions({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' };
  },
});
