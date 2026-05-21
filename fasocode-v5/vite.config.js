import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const b = id.match(/series\/sB(\d+)\.js/); if (b) return `seriesB-${b[1]}`
          const c = id.match(/series\/sC(\d+)\.js/); if (c) return `seriesC-${c[1]}`
        }
      }
    },
    chunkSizeWarningLimit: 3000
  }
})
