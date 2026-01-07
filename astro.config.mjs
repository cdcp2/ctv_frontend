// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

// Permite desactivar sharp en entornos sin las dependencias nativas.
const useNoopImageService =
  process.env.ASTRO_IMAGE_SERVICE === 'noop' || process.env.ASTRO_DISABLE_SHARP === '1';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  image: {
    // Usamos sharp por defecto; permitir desactivar con ASTRO_IMAGE_SERVICE=noop o ASTRO_DISABLE_SHARP=1
    service: { entrypoint: useNoopImageService ? 'astro/assets/services/noop' : 'astro/assets/services/sharp' },
  },
  integrations: [
    tailwind(), 
    react()
  ]
});
