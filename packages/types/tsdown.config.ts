import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/user/index.ts'
  ],
  outDir: 'dist',
  root: 'src',
  /**
   * Consumers span both ESM (apps/web, Next.js) and CommonJS (apps/user-service,
   * ts-node in CJS mode) - build both so runtime `import`/`require` both resolve.
   */
  format: ['esm', 'cjs'],
  target: ['es2024'],
  /* Removes outDir before building. */
  clean: true,
  /**
   * true -> Keeps the file structure as is, but compiles each file to the outDir.
   * false -> Bundles everything into fewer files.
   */
  unbundle: true,
  /* Generates .d.ts files for TypeScript projects. */
  dts: true,
  /**
   * Prevents bundling of node_modules dependencies, which can reduce bundle size
   * and improve build times.
   */
  deps: {
    skipNodeModulesBundle: true,
  },
  outExtensions({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' };
  },
  outputOptions(options) {
    return {
      ...options,
      sanitizeFileName: false,
    }
  },
});
