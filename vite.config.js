import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Remove or comment out the base path for Vercel
  // base: '/resume-critiquer/',
})