import { defineConfig } from 'vite'
import { resolve as resolvePath } from 'path'
import vue from '@vitejs/plugin-vue'
import Terminal from 'vite-plugin-terminal'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext'
  },
  resolve: {
    alias: {
      '@': resolvePath(__dirname, './src')
    }
  },
  plugins: [vue(), Terminal()]
})
