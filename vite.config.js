import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function contentSecurityPolicy({ hmr }) {
  const scriptSrc = hmr
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://www.gstatic.com"
    : "script-src 'self' 'unsafe-inline' https://accounts.google.com https://www.gstatic.com"
  const connectSrc = hmr
  /* cambie localhost por la IP donde ejecutamos la platform para el live test */
    ? "connect-src 'self' http://192.168.33.104:4000 ws://192.168.33.104:5173 wss://192.168.33.104:5173 http://192.168.33.104:5173 https://accounts.google.com"
    : "connect-src 'self' http://192.168.33.104:4000 https://accounts.google.com"

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' https: data:",
    "font-src 'self' data: https://fonts.gstatic.com",
    connectSrc,
    "frame-src https://accounts.google.com https://maps.google.com https://www.google.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
  ].join('; ')
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    headers: {
      'Content-Security-Policy': contentSecurityPolicy({ hmr: true }),
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  preview: {
    host: true,
    port: 5173,
    headers: {
      'Content-Security-Policy': contentSecurityPolicy({ hmr: false }),
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
})
