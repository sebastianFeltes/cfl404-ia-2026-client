import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// En desarrollo Vite necesita 'unsafe-inline' y 'unsafe-eval' para el preamble de React Refresh y HMR,
// además de permitir Google Fonts (styles y gstatic fonts) y conexiones WebSocket.
const devCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
  "img-src 'self' https: data:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' http://localhost:4000 ws: wss: https://accounts.google.com",
  "frame-src https://accounts.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
].join('; ')

const prodCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://accounts.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
  "img-src 'self' https: data:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' http://localhost:4000 https://accounts.google.com",
  "frame-src https://accounts.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
].join('; ')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
    headers: {
      'Content-Security-Policy': devCsp,
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  preview: {
    headers: {
      'Content-Security-Policy': prodCsp,
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
})
