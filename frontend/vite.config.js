import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El proxy envía /api al backend. Así frontend y API comparten origen
// y la cookie de sesión viaja sin configurar CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
