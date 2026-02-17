import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'lit-tip-tap',
    },
    emptyOutDir: false,
    rollupOptions: {
      external: [/^lit/, /^@tiptap/],
    },
  },
});
