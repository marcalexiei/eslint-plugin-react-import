import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';
import { loadESLint } from 'eslint';

describe('config recommended', async () => {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const ESLint = await loadESLint({ useFlatConfig: true });
  const eslint = new ESLint({
    cwd: path.join(dirname, './fixtures/recommended-ts'),
  });

  it('should have no error for valid file', async () => {
    const res = await eslint.lintFiles('./src/valid.tsx');

    expect(res).toHaveLength(1);

    const [validFileResult] = res;
    expect(validFileResult).toHaveProperty('errorCount', 0);
    expect(validFileResult.messages).toHaveLength(0);
  });

  it('should have errors for invalid', async () => {
    const res = await eslint.lintFiles('./src/invalid.tsx');

    expect(res).toHaveLength(1);

    const [invalidResult] = res;
    expect(invalidResult).toHaveProperty('errorCount', 3);
    expect(invalidResult).toHaveProperty('fixableErrorCount', 3);
    expect(invalidResult.messages).toMatchSnapshot(
      'should have 3 errors: 1 for import and 1 for prefixes (useState, JSX)',
    );
  });

  it('should raise error when having two imports (1 value and 1 type)', async () => {
    const res = await eslint.lintFiles('./src/invalid-multiple-imports.tsx');

    expect(res).toHaveLength(1);

    const [invalidResult] = res;
    expect(invalidResult).toHaveProperty('errorCount', 4);
    expect(invalidResult).toHaveProperty('fixableErrorCount', 4);
    expect(invalidResult.messages).toMatchSnapshot(
      'should have 4 errors: 2 for imports and 1 for prefixes (useState, JSX)',
    );
  });

  it('should raise error when renaming a named import of `react`', async () => {
    const res = await eslint.lintFiles('./src/invalid-renamed-import.tsx');

    expect(res).toHaveLength(1);

    const [invalidResult] = res;
    expect(invalidResult).toHaveProperty('errorCount', 2);
    expect(invalidResult).toHaveProperty('fixableErrorCount', 2);
    expect(invalidResult.messages).toMatchSnapshot(
      '1 error for the import and 1 error for the useState',
    );
  });
});
