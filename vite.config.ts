import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: {
        'lit-tip-tap': 'src/index.ts',
        'lit-tip-tap.registered': 'src/index.registered.ts',
      },
      formats: ['es'],
    },
    emptyOutDir: false,
    rollupOptions: {
      external: [/^lit/, /^@tiptap/],
    },
  },
});
