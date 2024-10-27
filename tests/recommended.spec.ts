import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { loadESLint } from 'eslint';

describe('config recommended', async () => {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const ESLint = await loadESLint({ useFlatConfig: true });
  const eslint = new ESLint({
    cwd: path.join(dirname, './fixtures/recommended'),
  });

  it('should have no error for valid file', async () => {
    const res = await eslint.lintFiles('./src/valid.jsx');

    expect(res).toHaveLength(1);

    const [validFileResult] = res;
    expect(validFileResult).toHaveProperty('errorCount', 0);
    expect(validFileResult.messages).toHaveLength(0);
  });

  it('should have errors for invalid', async () => {
    const res = await eslint.lintFiles('./src/invalid.jsx');

    expect(res).toHaveLength(1);

    const [invalidResult] = res;
    expect(invalidResult).toHaveProperty('errorCount', 2);
    expect(invalidResult).toHaveProperty('fixableErrorCount', 2);
    expect(invalidResult.messages).toMatchSnapshot(
      'should have 2 errors: 1 for import and 1 for prefix',
    );
  });

  it('should raise error when renaming a named import of `react`', async () => {
    const res = await eslint.lintFiles('./src/invalid-renamed-import.jsx');

    expect(res).toHaveLength(1);

    const [invalidResult] = res;
    expect(invalidResult).toHaveProperty('errorCount', 2);
    expect(invalidResult).toHaveProperty('fixableErrorCount', 2);
    expect(invalidResult.messages).toMatchSnapshot(
      '1 error for the import and 1 error for the useState',
    );
  });
});
