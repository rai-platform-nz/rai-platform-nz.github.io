import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        economics: resolve(__dirname, 'economics.html'),
        trust: resolve(__dirname, 'trust.html'),
        maori: resolve(__dirname, 'maori.html'),
        education: resolve(__dirname, 'education.html'),
        team: resolve(__dirname, 'team.html'),
      },
    },
  },
})
