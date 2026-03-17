import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
   server: {
    host: true, // allows access from network
    port: 5173,
    allowedHosts: [
      "consummatory-sherilyn-unlugubriously.ngrok-free.dev", // ✅ your ngrok host
      "localhost"
    ],
  },
})
