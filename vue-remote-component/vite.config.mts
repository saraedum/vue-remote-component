import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(import.meta.dirname, 'src/main.ts'),
      name: 'RemoteComponent',
      formats: ['es', 'cjs', 'iife'],
      fileName: (format) => ({
        es: 'vue-remote-component.esm.js',
        cjs: 'vue-remote-component.ssr.js',
        iife: 'vue-remote-component.min.js',
      } as Record<string, string>)[format],
    },
    rolldownOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
  },
});
