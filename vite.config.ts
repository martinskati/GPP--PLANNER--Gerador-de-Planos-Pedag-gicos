
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    // Mapeia tanto API_KEY quanto VITE_GEMINI_API_KEY para process.env.API_KEY usado no código
importar { defineConfig} de 'vite'; importar reagir de '@vitejs/plugin-react'; padrão de exportação defineConfig({ Plugins: [react()], base: '. /', definir: { // Mapeia tanto API_KEY quanto VITE_GEMINI_API_KEY para process.env.API_KEY usado no código processo.env.VITE_GEMINI_API_KEY
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    target: 'esnext'
  },
  server: {
    port: 3000
  }
});
define: {
  'process.env.API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY)
}
 definir: { 'process.env.API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY) }
