import { describe } from 'vitest';
import { RuleTester } from 'eslint';
import typescriptEslintParser from '@typescript-eslint/parser';
import dedent from 'dedent';

import syntaxRule from './consistent-syntax.js';

describe('syntax rule js - `namespace`', () => {
  const ruleTester = new RuleTester();

  describe('`namespace` and without options', () => {
    describe('valid', () => {
      ruleTester.run('syntax', syntaxRule, {
        valid: [
          {
            code: "import * as React from 'react'",
          },
          {
            code: "import * as React from 'react'",
            options: ['namespace'],
          },
          {
            code: dedent`
              import * as React from 'react';
              const el = React.createElement('div');
            `,
          },
          {
            code: dedent`
              import * as React from 'react';
              const [count, setCount] = React.useState(0);
            `,
            options: ['namespace'],
          },
          {
            code: "import OtherModule from 'otherModule';",
            options: ['namespace'],
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
            output: "import * as React from 'react';",
            errors: [
              { messageId: 'wrongImport', data: { syntax: 'namespace' } },
            ],
          },
          {
            code: "import React from 'react';",
            options: ['namespace'],
            output: "import * as React from 'react';",
            errors: [
              { messageId: 'wrongImport', data: { syntax: 'namespace' } },
            ],
          },
          {
            code: dedent`
              import React from 'react';
              const el = React.createElement('div');
            `,
            options: ['namespace'],
            output: dedent`
              import * as React from 'react';
              const el = React.createElement('div');
            `,
            errors: [
              { messageId: 'wrongImport', data: { syntax: 'namespace' } },
            ],
          },
          {
            code: "import { useState } from 'react';",
            options: ['namespace'],
            output: "import * as React from 'react';",
            errors: [
              { messageId: 'wrongImport', data: { syntax: 'namespace' } },
            ],
          },
        ],
      });
    });
  });

  describe('should add prefix', () => {
    ruleTester.run('syntax', syntaxRule, {
      valid: [],
      invalid: [
        {
          code: dedent`
            import {useState} from 'react';
            useState()
          `,
          output: dedent`
            import * as React from 'react';
            React.useState()
          `,
          errors: [
            { messageId: 'wrongImport', data: { syntax: 'namespace' } },
            { messageId: 'addPrefix' },
          ],
        },
        // with export renamed
        {
          code: dedent`
            import {useState as useStateOriginal} from 'react';
            useStateOriginal()
          `,
          output: dedent`
            import * as React from 'react';
            React.useState()
          `,
          errors: [
            { messageId: 'wrongImport', data: { syntax: 'namespace' } },
            { messageId: 'addPrefix' },
          ],
        },
        // Multiple imports
        {
          code: dedent`
            import React from 'react';
            import {useState as useStateOriginal} from 'react';
            useStateOriginal();
            const ctx = React.createContext();
          `,
          output: dedent`
            import * as React from 'react';

            React.useState();
            const ctx = React.createContext();
          `,
          errors: [
            { messageId: 'wrongImport', data: { syntax: 'namespace' } },
            { messageId: 'duplicateImport', data: { syntax: 'namespace' } },
            { messageId: 'addPrefix' },
          ],
        },
      ],
    });
  });
});

describe('syntax rule ts - `namespace`', () => {
  const ruleTester = new RuleTester({
    languageOptions: {
      parser: typescriptEslintParser,
    },
  });

  describe('`namespace` and without options', () => {
    describe('valid', () => {
      ruleTester.run('syntax', syntaxRule, {
        valid: [
          {
            code: "import * as React from 'react'",
          },
          {
            code: "import type * as React from 'react'",
          },
          {
            code: "import * as React from 'react'",
            options: ['namespace'],
          },
          {
            code: dedent`
              import * as React from 'react';
              const [state, setState] = React.useState<string>('');
            `,
            options: ['namespace'],
          },
          {
            code: "import type * as React from 'react'",
            options: ['namespace'],
          },
          {
            code: "import OtherModule from 'otherModule';",
            options: ['namespace'],
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
            output: "import * as React from 'react';",
            errors: [
              { messageId: 'wrongImport', data: { syntax: 'namespace' } },
            ],
          },
          {
            code: "import React from 'react';",
            options: ['namespace'],
            output: "import * as React from 'react';",
            errors: [
              { messageId: 'wrongImport', data: { syntax: 'namespace' } },
            ],
          },
          {
            code: "import type React from 'react';",
            options: ['namespace'],
            output: "import type * as React from 'react';",
            errors: [
              { messageId: 'wrongImport', data: { syntax: 'namespace' } },
            ],
          },
          {
            code: "import { useState } from 'react';",
            options: ['namespace'],
            output: "import * as React from 'react';",
            errors: [
              { messageId: 'wrongImport', data: { syntax: 'namespace' } },
            ],
          },
          {
            code: dedent`
              import React from 'react';
              const [state, setState] = React.useState<string>('');
            `,
            options: ['namespace'],
            output: dedent`
              import * as React from 'react';
              const [state, setState] = React.useState<string>('');
            `,
            errors: [
              { messageId: 'wrongImport', data: { syntax: 'namespace' } },
            ],
          },
          // both import value and import type
          {
            code: dedent`
              import React, { useState } from 'react';
              import type { ComponentProps } from 'react';
            `,
            options: ['namespace'],
            output: "import * as React from 'react';\n",
            errors: [
              { messageId: 'wrongImport', data: { syntax: 'namespace' } },
              { messageId: 'duplicateImport', data: { syntax: 'namespace' } },
            ],
          },
          {
            code: dedent`
              import type { ComponentProps } from 'react';
              import React, { useState } from 'react';
            `,
            output: "import * as React from 'react';\n",
            options: ['namespace'],
            errors: [
              { messageId: 'wrongImport', data: { syntax: 'namespace' } },
              { messageId: 'duplicateImport', data: { syntax: 'namespace' } },
            ],
          },
          // duplicate import types
          {
            code: dedent`
              import type { ComponentProps } from 'react';
              import type { HTMLProps } from 'react';
            `,
            output: "import type * as React from 'react';\n",
            options: ['namespace'],
            errors: [
              { messageId: 'wrongImport', data: { syntax: 'namespace' } },
              { messageId: 'duplicateImport', data: { syntax: 'namespace' } },
            ],
          },
          // valid import and invalid type import
          {
            code: dedent`
              import * as React from 'react';
              import type { HTMLProps } from 'react'
              const [test, setTest] = React.useState<HTMLProps<HTMLElement>>()
            `,
            output: dedent`
              import * as React from 'react';

              const [test, setTest] = React.useState<React.HTMLProps<HTMLElement>>()
            `,
            errors: [
              { messageId: 'duplicateImport', data: { syntax: 'namespace' } },
              { messageId: 'addPrefix' },
            ],
          },
        ],
      });
    });
  });

  describe('should add prefix', () => {
    ruleTester.run('syntax', syntaxRule, {
      valid: [],
      invalid: [
        {
          code: dedent`
            import type { HTMLProps } from 'react';
            type Props = HTMLProps<HTMLElement>;
          `,
          output: dedent`
            import type * as React from 'react';
            type Props = React.HTMLProps<HTMLElement>;
          `,
          errors: [
            { messageId: 'wrongImport', data: { syntax: 'namespace' } },
            { messageId: 'addPrefix' },
          ],
        },
        {
          code: dedent`
            import { useState } from 'react'
            import type { HTMLProps } from 'react'
            const [test, setTest] = useState<HTMLProps<HTMLElement>>()
          `,
          output: dedent`
            import * as React from 'react';

            const [test, setTest] = React.useState<React.HTMLProps<HTMLElement>>()
          `,
          errors: [
            { messageId: 'wrongImport', data: { syntax: 'namespace' } },
            { messageId: 'duplicateImport', data: { syntax: 'namespace' } },
            { messageId: 'addPrefix' },
            { messageId: 'addPrefix' },
          ],
        },
        {
          code: dedent`
            import type { HTMLProps } from 'react'
            interface Test extends HTMLProps<HTMLElement> {}
          `,
          output: dedent`
            import type * as React from 'react';
            interface Test extends React.HTMLProps<HTMLElement> {}
          `,
          errors: [
            { messageId: 'wrongImport', data: { syntax: 'namespace' } },
            { messageId: 'addPrefix' },
          ],
        },
      ],
    });
  });
});
