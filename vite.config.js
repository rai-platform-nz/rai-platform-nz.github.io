import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    modulePreload: {
      polyfill: false
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        trust: resolve(__dirname, 'trust.html'),
        economics: resolve(__dirname, 'economics.html'),
        maori: resolve(__dirname, 'maori.html'),
        education: resolve(__dirname, 'education.html'),
        team: resolve(__dirname, 'team.html'),
      },
    },
  },
})
