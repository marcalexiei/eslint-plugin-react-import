import { describe } from 'vitest';
import { RuleTester } from 'eslint';
import typescriptEslintParser from '@typescript-eslint/parser';
import dedent from 'dedent';

import syntaxRule from './consistent-syntax.js';

describe('syntax rule js - `named`', () => {
  const ruleTester = new RuleTester();

  describe('valid', () => {
    ruleTester.run('syntax', syntaxRule, {
      valid: [
        {
          code: "import { useState } from 'react'",
          options: ['named'],
        },
        // captureOwnerStack is a dev-only export and must be accessed via namespace
        {
          code: dedent`
            import * as React from 'react';
            if (process.env.NODE_ENV !== 'production') {
              const stack = React.captureOwnerStack();
            }
          `,
          options: ['named'],
        },
        // captureOwnerStack with named imports alongside
        {
          code: dedent`
            import * as React from 'react';
            import { useState } from 'react';
            const [count, setCount] = useState(0);
            if (process.env.NODE_ENV !== 'production') {
              const stack = React.captureOwnerStack();
            }
          `,
          options: ['named'],
        },
        {
          code: dedent`
            import { useState } from 'react';
            const [count, setCount] = useState(0);
          `,
          options: ['named'],
        },
        {
          code: "import { useState, useEffect } from 'react'",
          options: ['named'],
        },
        {
          code: "import OtherModule from 'otherModule';",
          options: ['named'],
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
          code: "import React from 'react';",
          options: ['named'],
          output: '',
          errors: [{ messageId: 'wrongImport', data: { syntax: 'named' } }],
        },
        {
          code: dedent`
            import React from 'react';
            function App() { return null; }
          `,
          options: ['named'],
          output: '\nfunction App() { return null; }',
          errors: [{ messageId: 'wrongImport', data: { syntax: 'named' } }],
        },
        {
          code: "import * as React from 'react';",
          options: ['named'],
          output: '',
          errors: [{ messageId: 'wrongImport', data: { syntax: 'named' } }],
        },
        {
          code: dedent`
            import * as React from 'react';
            function App() { return null; }
          `,
          options: ['named'],
          output: '\nfunction App() { return null; }',
          errors: [{ messageId: 'wrongImport', data: { syntax: 'named' } }],
        },
        {
          code: "import React, { useState } from 'react';",
          options: ['named'],
          output: "import { useState } from 'react';",
          errors: [{ messageId: 'wrongImport', data: { syntax: 'named' } }],
        },
        {
          code: dedent`
            import React, { useState } from 'react';
            const [count, setCount] = useState(0);
          `,
          options: ['named'],
          output: dedent`
            import { useState } from 'react';
            const [count, setCount] = useState(0);
          `,
          errors: [{ messageId: 'wrongImport', data: { syntax: 'named' } }],
        },
        {
          code: "import React, { useState as useStateReact } from 'react';",
          options: ['named'],
          output: "import { useState as useStateReact } from 'react';",
          errors: [{ messageId: 'wrongImport', data: { syntax: 'named' } }],
        },
      ],
    });
  });
});

describe('syntax rule ts - `named`', () => {
  const ruleTester = new RuleTester({
    languageOptions: {
      parser: typescriptEslintParser,
    },
  });

  describe('valid', () => {
    ruleTester.run('syntax', syntaxRule, {
      valid: [
        {
          code: "import { useState } from 'react'",
          options: ['named'],
        },
        // captureOwnerStack is a dev-only export and must be accessed via namespace
        {
          code: dedent`
            import * as React from 'react';
            if (process.env.NODE_ENV !== 'production') {
              const stack = React.captureOwnerStack();
            }
          `,
          options: ['named'],
        },
        // captureOwnerStack with named imports alongside
        {
          code: dedent`
            import * as React from 'react';
            import { useState } from 'react';
            const [count, setCount] = useState<number>(0);
            if (process.env.NODE_ENV !== 'production') {
              const stack = React.captureOwnerStack();
            }
          `,
          options: ['named'],
        },
        {
          code: dedent`
            import { useState } from 'react';
            const [count, setCount] = useState<number>(0);
          `,
          options: ['named'],
        },
        {
          code: "import type { FC } from 'react'",
          options: ['named'],
        },
        {
          code: dedent`
            import { useState } from 'react';
            import type { FC } from 'react';
            const [count] = useState<number>(0);
          `,
          options: ['named'],
        },
        {
          code: "import OtherModule from 'otherModule';",
          options: ['named'],
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
          code: "import React from 'react';",
          options: ['named'],
          output: '',
          errors: [{ messageId: 'wrongImport', data: { syntax: 'named' } }],
        },
        {
          code: dedent`
            import React from 'react';
            function App(): null { return null; }
          `,
          options: ['named'],
          output: '\nfunction App(): null { return null; }',
          errors: [{ messageId: 'wrongImport', data: { syntax: 'named' } }],
        },
        {
          code: "import type React from 'react';",
          options: ['named'],
          output: '',
          errors: [{ messageId: 'wrongImport', data: { syntax: 'named' } }],
        },
        {
          code: dedent`
            import type React from 'react';
            function App(): null { return null; }
          `,
          options: ['named'],
          output: '\nfunction App(): null { return null; }',
          errors: [{ messageId: 'wrongImport', data: { syntax: 'named' } }],
        },
        {
          code: "import * as React from 'react';",
          options: ['named'],
          output: '',
          errors: [{ messageId: 'wrongImport', data: { syntax: 'named' } }],
        },
        {
          code: dedent`
            import * as React from 'react';
            function App(): null { return null; }
          `,
          options: ['named'],
          output: '\nfunction App(): null { return null; }',
          errors: [{ messageId: 'wrongImport', data: { syntax: 'named' } }],
        },
        {
          code: "import type * as React from 'react';",
          options: ['named'],
          output: '',
          errors: [{ messageId: 'wrongImport', data: { syntax: 'named' } }],
        },
        {
          code: dedent`
            import type * as React from 'react';
            function App(): null { return null; }
          `,
          options: ['named'],
          output: '\nfunction App(): null { return null; }',
          errors: [{ messageId: 'wrongImport', data: { syntax: 'named' } }],
        },
        {
          code: "import React, { useState } from 'react';",
          options: ['named'],
          output: "import { useState } from 'react';",
          errors: [{ messageId: 'wrongImport', data: { syntax: 'named' } }],
        },
        {
          code: dedent`
            import React, { useState } from 'react';
            const [count, setCount] = useState<number>(0);
          `,
          options: ['named'],
          output: dedent`
            import { useState } from 'react';
            const [count, setCount] = useState<number>(0);
          `,
          errors: [{ messageId: 'wrongImport', data: { syntax: 'named' } }],
        },
        // already has a valid named import, additional default/namespace is duplicate
        {
          code: dedent`
            import { useState } from 'react';
            import * as React from 'react';
          `,
          options: ['named'],
          output: "import { useState } from 'react';\n",
          errors: [{ messageId: 'duplicateImport', data: { syntax: 'named' } }],
        },
      ],
    });
  });
});
