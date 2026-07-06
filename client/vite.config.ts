import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const basePath = process.env.VITE_BASE_PATH?.trim() || '/';
const proxyTarget = process.env.VITE_API_PROXY_TARGET?.trim() || 'http://localhost:8080';

export default defineConfig({
  base: basePath,
  plugins: [react()],
  cacheDir: '../node_modules/.vite/aegis-client',
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': proxyTarget,
      '/health': proxyTarget,
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ['recharts'],
          maps: ['leaflet', 'react-leaflet'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
