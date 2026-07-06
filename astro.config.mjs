// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  vite: {
    css: {
      postcss: {
        plugins: [
          (await import('@tailwindcss/postcss')).default,
        ],
      },
    },
  },
});
