import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.ELECTRON === 'true' ? './' : '/',
  server: {
    proxy: {
      '/products': 'http://localhost:5000/api',
      '/sales': 'http://localhost:5000/api',
      '/auth': 'http://localhost:5000/api',
    }
  }
})
