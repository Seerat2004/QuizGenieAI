import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// You don't need to redefine __dirname this way with Vite.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // simpler and works reliably
    }
  },
  server: {
    allowedHosts: [
      '7716e5bd-7b4b-4d6b-bd11-c8f091418cc7-00-2aemw8ncuavsb.spock.replit.dev'
    ]
  },
  build: {
    outDir: '../dist/public',
    rollupOptions: {
      input: './index.html'
    }
  }
})

