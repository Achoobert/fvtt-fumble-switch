import { defineConfig } from 'vite';
import fs from 'fs-extra';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.ts',
      fileName: 'fumble-switch',
      formats: [ 'es' ],
    },
    minify: false,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    {
      name: 'copy-static-files',
      closeBundle: async () => {
        await fs.copy('src/module.json', 'dist/module.json');
        await fs.copy('src/lang', 'dist/lang');
        await fs.copy('src/templates', 'dist/templates');
      },
    },
  ],
});
