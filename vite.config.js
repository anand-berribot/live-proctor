import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env,
  },
  resolve: {
    alias: {
      'src': '/src',
    },
  },
  server: {
    port: 5174,
  },
  build: {
    rollupOptions: {
      external: ['retell-sdk'], // Exclude the SDK from being bundled in the browser
    },
  },
});
