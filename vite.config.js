import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import legacy from '@vitejs/plugin-legacy'
import sveltePreprocess from 'svelte-preprocess'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    drop: [],
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess()
    }),
    legacy({
      targets: ['defaults', 'iOS >= 6']
    })
  ]
})
