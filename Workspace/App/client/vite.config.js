import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://server:4000",
        changeOrigin: true,
        secure: true,
      },

      '/admin': {
        target: 'http://server:4000',
        changeOrigin: true,
        secure: true,
      },

      '/admin/api': {
        target: 'http://server:4000',
        changeOrigin: true,
        secure: true,
      }
    },
  }
})
