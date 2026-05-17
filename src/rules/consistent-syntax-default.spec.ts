import typescriptEslintParser from '@typescript-eslint/parser';
import dedent from 'dedent';
import { RuleTester } from 'eslint';
import { describe } from 'vitest';

import syntaxRule from './consistent-syntax.js';

describe('syntax rule js - `default`', () => {
  const ruleTester = new RuleTester();

  describe('valid', () => {
    ruleTester.run('syntax', syntaxRule, {
      valid: [
        {
          code: "import React from 'react'",
          options: ['default'],
        },
        {
          code: dedent`
            import React from 'react';
            const [count, setCount] = React.useState(0);
          `,
          options: ['default'],
        },
        {
          code: "import OtherModule from 'otherModule';",
          options: ['default'],
        },
      ],

      invalid: [],
    });
  });

  describe('invalid', () => {
    ruleTester.run('syntax', syntaxRule, {
      valid: [],

      invalid: [
        {
          code: "import React, { useState } from 'react';",
          options: ['default'],
          output: "import React from 'react';",
          errors: [{ messageId: 'wrongImport', data: { syntax: 'default' } }],
        },
        {
          code: "import * as React from 'react';",
          options: ['default'],
          output: "import React from 'react';",
          errors: [{ messageId: 'wrongImport', data: { syntax: 'default' } }],
        },
        {
          code: dedent`
            import * as React from 'react';
            const el = React.createElement('div');
          `,
          options: ['default'],
          output: dedent`
            import React from 'react';
            const el = React.createElement('div');
          `,
          errors: [{ messageId: 'wrongImport', data: { syntax: 'default' } }],
        },
      ],
    });
  });
});

describe('syntax rule ts - `default`', () => {
  const ruleTester = new RuleTester({
    languageOptions: {
      parser: typescriptEslintParser,
    },
  });

  describe('valid', () => {
    ruleTester.run('syntax', syntaxRule, {
      valid: [
        {
          code: "import React from 'react'",
          options: ['default'],
        },
        {
          code: dedent`
            import React from 'react';
            const [state, setState] = React.useState<string>('');
          `,
          options: ['default'],
        },
        {
          code: "import type React from 'react'",
          options: ['default'],
        },
        {
          code: "import OtherModule from 'otherModule';",
          options: ['default'],
        },
      ],

      invalid: [],
    });
  });

  describe('invalid', () => {
    ruleTester.run('syntax', syntaxRule, {
      valid: [],

      invalid: [
        {
          code: "import React, { useState } from 'react';",
          options: ['default'],
          output: "import React from 'react';",
          errors: [{ messageId: 'wrongImport', data: { syntax: 'default' } }],
        },
        {
          code: "import * as React from 'react';",
          options: ['default'],
          output: "import React from 'react';",
          errors: [{ messageId: 'wrongImport', data: { syntax: 'default' } }],
        },
        {
          code: dedent`
            import * as React from 'react';
            const [state, setState] = React.useState<string>('');
          `,
          options: ['default'],
          output: dedent`
            import React from 'react';
            const [state, setState] = React.useState<string>('');
          `,
          errors: [{ messageId: 'wrongImport', data: { syntax: 'default' } }],
        },
        // both import value and import type
        {
          code: dedent`
            import React, { useState } from 'react';
            import type { ComponentProps } from 'react';
          `,
          options: ['default'],
          output: "import React from 'react';\n",
          errors: [
            { messageId: 'wrongImport', data: { syntax: 'default' } },
            { messageId: 'duplicateImport', data: { syntax: 'default' } },
          ],
        },
        {
          code: dedent`
            import type { ComponentProps } from 'react';
            import React, { useState } from 'react';
          `,
          output: "import React from 'react';\n",
          options: ['default'],
          errors: [
            { messageId: 'wrongImport', data: { syntax: 'default' } },
            { messageId: 'duplicateImport', data: { syntax: 'default' } },
          ],
        },
        // duplicate import types
        {
          code: dedent`
            import type { ComponentProps } from 'react';
            import type { HTMLProps } from 'react';
          `,
          output: "import type React from 'react';\n",
          options: ['default'],
          errors: [
            { messageId: 'wrongImport', data: { syntax: 'default' } },
            { messageId: 'duplicateImport', data: { syntax: 'default' } },
          ],
        },
      ],
    });
  });
});
