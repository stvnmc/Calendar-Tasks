import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  base: 'https://stvnmc.github.io/Calendar-Tasks', 
  build: {
    outDir: 'dist', 
    assetsDir: '', 
    manifest: true, 
  },
})
