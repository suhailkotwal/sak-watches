import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sak Watches',
        short_name: 'SakWatches',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3b82f6',
        icons: [
          { src: 'icons/default.svg', sizes: 'any', type: 'image/svg+xml' }
        ]
      }
    })
  ]
})
