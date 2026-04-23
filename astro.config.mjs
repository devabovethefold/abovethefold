import {defineConfig, fontProviders} from 'astro/config'

import alpinejs from '@astrojs/alpinejs'
import cloudflare from '@astrojs/cloudflare'
import icon from 'astro-icon'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  adapter: cloudflare({
    prerenderEnvironment: 'node',
  }),
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Gelasio',
      cssVariable: '--font-display',
    },
    {
      provider: fontProviders.google(),
      name: 'Poppins',
      cssVariable: '--font-body',
    },
  ],
  integrations: [
    alpinejs({entrypoint: './src/utilities/alpine/index.ts'}),
    icon({
      include: {
        mdi: [
          'arrow-right-circle-outline',
          'asterisk',
          'chevron-down',
          'menu',
          'moon-waning-crescent',
          'star',
          'white-balance-sunny',
          'window-close',
        ],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})

// provider: fontProviders.adobe({ id: 'your-id' })
// provider: fontProviders.bunny()
// provider: fontProviders.fontshare()
// provider: fontProviders.google()
