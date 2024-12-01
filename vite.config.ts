import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
    copyPublicDir: true,
  },
  server: {
    open: true, // Obre automàticament el navegador en iniciar
    port: 3000, // Defineix el port
    strictPort: true, // Evita canviar de port si ja està ocupat
  },
  preview: {
    port: 5000, // Port per a previsualització del build
  },
});