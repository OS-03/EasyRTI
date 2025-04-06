// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     exclude: ['chunk-SPGMRGGV.js'], // Add the problematic dependency here
//   },
// });

declare module '*.png' {
    const value: string;
    export default value;
  }