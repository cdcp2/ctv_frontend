// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

const useNoopImageService =
  process.env.ASTRO_IMAGE_SERVICE === 'noop' || process.env.ASTRO_DISABLE_SHARP === '1';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  session: {
    driver: 'memory',
  },
  image: {
    service: {
      entrypoint: useNoopImageService
        ? 'astro/assets/services/noop'
        : 'astro/assets/services/sharp',
    },
  },
  integrations: [tailwind(), react()],
});
