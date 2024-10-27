import { promises as fs } from 'node:fs';

import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
  input: 'src/index.ts',

  output: [
    {
      dir: 'dist',
      entryFileNames: '[name].js',
      format: 'esm',
      sourcemap: true,
    },
    {
      dir: 'dist',
      entryFileNames: '[name].cjs',
      format: 'cjs',
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({ tsconfig: 'tsconfig.build.json' }),
    {
      name: 'clean-dist',
      async buildStart() {
        await fs.rm('./dist', { recursive: true, force: true });
      },
    },
  ],
  external: ['eslint', 'node:fs'],
});
