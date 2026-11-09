import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  // Relative URLs, so the demo also works when served from a subpath like GitHub Pages.
  base: './',
  plugins: [vue()],
});
