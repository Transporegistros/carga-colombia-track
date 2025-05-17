// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),          // añade soporte React/JSX
    tsconfigPaths()   // resuelve los paths definidos en tsconfig.json
  ],
  server: {
    port: 3000
  },
  define: {
    'process.env': {} // para librerías que lo esperen
  }
})
