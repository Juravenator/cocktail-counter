import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    drop: [],
  },
  plugins: [
    svelte(),
    legacy({
      targets: ['defaults', 'iOS >= 6']
    })
  ]
})
