import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Forward /api requests to our Express server (avoids CORS issues in dev).
    proxy: {
      '/api': 'http://localhost:5001',
    },
  },
})
