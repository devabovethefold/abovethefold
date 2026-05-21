// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
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
