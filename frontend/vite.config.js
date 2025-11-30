import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite-friendly polyfills
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    port: 3000,
  },

  resolve: {
    alias: {
      util: 'util/',
      events: 'events/',
      buffer: 'buffer/',
      process: 'process/browser',
      stream: 'stream-browserify',
      path: 'path-browserify',
    },
  },

  optimizeDeps: {
    esbuildOptions: {
      // Polyfill Node.js globals like `process` and `Buffer` for browser
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin()
      ],
    },
  },

  define: {
    global: 'window', // Polyfill `global` in browser
  },
})
