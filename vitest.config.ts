import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    // Keep transforms in-process: persisted temp paths are unreliable in Windows sandboxes.
    pool: 'threads',
    fsModuleCache: false,
    maxWorkers: 1,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
