import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = resolve(__dirname, 'src');

export default defineConfig({
  resolve: {
    alias: [
      { find: /^([\w-]+)\.js$/, replacement: `${src}/$1.ts` },
    ],
  },
  test: {
    include: ['tests/**/*.{test,spec}.ts'],
  },
});