import { describe } from "vitest";
import { RuleTester } from "eslint";
import typescriptEslintParser from "@typescript-eslint/parser";

import syntaxRule from "./consistent-syntax.js";

describe("syntax rule js", () => {
  const ruleTester = new RuleTester();

  describe("`namespace` and without options", () => {
    describe("valid", () => {
      ruleTester.run("syntax", syntaxRule, {
        valid: [
          {
            code: "import * as React from 'react'",
          },
          {
            code: "import * as React from 'react'",
            options: ["namespace"],
          },
          {
            code: "import OtherModule from 'otherModule';",
            options: ["namespace"],
          },
        ],
        invalid: [],
      });
    });

    describe("invalid", () => {
      ruleTester.run("syntax", syntaxRule, {
        valid: [],

        invalid: [
          {
            code: "import React, { useState } from 'react';",
            output: "import * as React from 'react';",
            errors: [
              { messageId: "wrongImport", data: { syntax: "namespace" } },
            ],
          },
          {
            code: "import React from 'react';",
            options: ["namespace"],
            output: "import * as React from 'react';",
            errors: [
              { messageId: "wrongImport", data: { syntax: "namespace" } },
            ],
          },
          {
            code: "import { useState } from 'react';",
            options: ["namespace"],
            output: "import * as React from 'react';",
            errors: [
              { messageId: "wrongImport", data: { syntax: "namespace" } },
            ],
          },
        ],
      });
    });
  });

  describe("`default`", () => {
    describe("valid", () => {
      ruleTester.run("syntax", syntaxRule, {
        valid: [
          {
            code: "import React from 'react'",
            options: ["default"],
          },
          {
            code: "import OtherModule from 'otherModule';",
            options: ["default"],
          },
        ],

        invalid: [],
      });
    });

    describe("invalid", () => {
      ruleTester.run("syntax", syntaxRule, {
        valid: [],

        invalid: [
          {
            code: "import React, { useState } from 'react';",
            options: ["default"],
            output: "import React from 'react';",
            errors: [{ messageId: "wrongImport", data: { syntax: "default" } }],
          },
          {
            code: "import * as React from 'react';",
            options: ["default"],
            output: "import React from 'react';",
            errors: [{ messageId: "wrongImport", data: { syntax: "default" } }],
          },
        ],
      });
    });
  });

  describe("should add prefix", () => {
    ruleTester.run("syntax", syntaxRule, {
      valid: [],
      invalid: [
        {
          code: "import {useState} from 'react';\nuseState()",
          output: "import * as React from 'react';\nReact.useState()",
          errors: [
            { messageId: "wrongImport", data: { syntax: "namespace" } },
            { messageId: "addPrefix" },
          ],
        },
        // with export renamed
        {
          code: [
            "import {useState as useStateOriginal} from 'react';",
            "useStateOriginal()",
          ].join("\n"),
          output: ["import * as React from 'react';", "React.useState()"].join(
            "\n",
          ),
          errors: [
            { messageId: "wrongImport", data: { syntax: "namespace" } },
            { messageId: "addPrefix" },
          ],
        },
        // Multiple imports
        {
          code: [
            "import React from 'react';",
            "import {useState as useStateOriginal} from 'react';",
            "useStateOriginal();",
            "const ctx = React.createContext();",
          ].join("\n"),
          output: [
            "import * as React from 'react';",
            "",
            "React.useState();",
            "const ctx = React.createContext();",
          ].join("\n"),
          errors: [
            { messageId: "wrongImport", data: { syntax: "namespace" } },
            { messageId: "duplicateImport", data: { syntax: "namespace" } },
            { messageId: "addPrefix" },
          ],
        },
      ],
    });
  });
});

describe("style rule ts", () => {
  const ruleTester = new RuleTester({
    languageOptions: {
      parser: typescriptEslintParser,
    },
  });

  describe("`namespace` and without options", () => {
    describe("valid", () => {
      ruleTester.run("syntax", syntaxRule, {
        valid: [
          {
            code: "import * as React from 'react'",
          },
          {
            code: "import type * as React from 'react'",
          },
          {
            code: "import * as React from 'react'",
            options: ["namespace"],
          },
          {
            code: "import type * as React from 'react'",
            options: ["namespace"],
          },
          {
            code: "import OtherModule from 'otherModule';",
            options: ["namespace"],
          },
        ],

        invalid: [],
      });
    });

    describe("invalid", () => {
      ruleTester.run("syntax", syntaxRule, {
        valid: [],

        invalid: [
          {
            code: "import React, { useState } from 'react';",
            output: "import * as React from 'react';",
            errors: [
              { messageId: "wrongImport", data: { syntax: "namespace" } },
            ],
          },
          {
            code: "import React from 'react';",
            options: ["namespace"],
            output: "import * as React from 'react';",
            errors: [
              { messageId: "wrongImport", data: { syntax: "namespace" } },
            ],
          },
          {
            code: "import type React from 'react';",
            options: ["namespace"],
            output: "import type * as React from 'react';",
            errors: [
              { messageId: "wrongImport", data: { syntax: "namespace" } },
            ],
          },
          {
            code: "import { useState } from 'react';",
            options: ["namespace"],
            output: "import * as React from 'react';",
            errors: [
              { messageId: "wrongImport", data: { syntax: "namespace" } },
            ],
          },
          // both import value and import type
          {
            code: "import React, { useState } from 'react';\nimport type { ComponentProps } from 'react';",
            options: ["namespace"],
            output: "import * as React from 'react';\n",
            errors: [
              { messageId: "wrongImport", data: { syntax: "namespace" } },
              { messageId: "duplicateImport", data: { syntax: "namespace" } },
            ],
          },
          {
            code: "import type { ComponentProps } from 'react';\nimport React, { useState } from 'react';",
            output: "import * as React from 'react';\n",
            options: ["namespace"],
            errors: [
              { messageId: "wrongImport", data: { syntax: "namespace" } },
              { messageId: "duplicateImport", data: { syntax: "namespace" } },
            ],
          },
          // duplicate import types
          {
            code: "import type { ComponentProps } from 'react';\nimport type { HTMLProps } from 'react';",
            output: "import type * as React from 'react';\n",
            options: ["namespace"],
            errors: [
              { messageId: "wrongImport", data: { syntax: "namespace" } },
              { messageId: "duplicateImport", data: { syntax: "namespace" } },
            ],
          },
          // valid import and invalid type import
          {
            code: [
              "import * as React from 'react';",
              "import type { HTMLProps } from 'react'",
              "const [test, setTest] = React.useState<HTMLProps<HTMLElement>>()",
            ].join("\n"),
            output: [
              "import * as React from 'react';",
              "",
              "const [test, setTest] = React.useState<React.HTMLProps<HTMLElement>>()",
            ].join("\n"),
            errors: [
              { messageId: "duplicateImport", data: { syntax: "namespace" } },
              { messageId: "addPrefix" },
            ],
          },
        ],
      });
    });
  });

  describe("`default`", () => {
    describe("valid", () => {
      ruleTester.run("syntax", syntaxRule, {
        valid: [
          {
            code: "import React from 'react'",
            options: ["default"],
          },
          {
            code: "import type React from 'react'",
            options: ["default"],
          },
          {
            code: "import OtherModule from 'otherModule';",
            options: ["default"],
          },
        ],

        invalid: [],
      });
    });

    describe("invalid", () => {
      ruleTester.run("syntax", syntaxRule, {
        valid: [],

        invalid: [
          {
            code: "import React, { useState } from 'react';",
            options: ["default"],
            output: "import React from 'react';",
            errors: [{ messageId: "wrongImport", data: { syntax: "default" } }],
          },
          {
            code: "import * as React from 'react';",
            options: ["default"],
            output: "import React from 'react';",
            errors: [{ messageId: "wrongImport", data: { syntax: "default" } }],
          },
          // both import value and import type
          {
            code: "import React, { useState } from 'react';\nimport type { ComponentProps } from 'react';",
            options: ["default"],
            output: "import React from 'react';\n",
            errors: [
              { messageId: "wrongImport", data: { syntax: "default" } },
              { messageId: "duplicateImport", data: { syntax: "default" } },
            ],
          },
          {
            code: "import type { ComponentProps } from 'react';\nimport React, { useState } from 'react';",
            output: "import React from 'react';\n",
            options: ["default"],
            errors: [
              { messageId: "wrongImport", data: { syntax: "default" } },
              { messageId: "duplicateImport", data: { syntax: "default" } },
            ],
          },
          // duplicate import types
          {
            code: "import type { ComponentProps } from 'react';\nimport type { HTMLProps } from 'react';",
            output: "import type React from 'react';\n",
            options: ["default"],
            errors: [
              { messageId: "wrongImport", data: { syntax: "default" } },
              { messageId: "duplicateImport", data: { syntax: "default" } },
            ],
          },
        ],
      });
    });
  });

  describe("should add prefix", () => {
    ruleTester.run("syntax", syntaxRule, {
      valid: [],
      invalid: [
        {
          code: "import type { HTMLProps } from 'react';\ntype Props = HTMLProps<HTMLElement>;",
          output:
            "import type * as React from 'react';\ntype Props = React.HTMLProps<HTMLElement>;",
          errors: [
            { messageId: "wrongImport", data: { syntax: "namespace" } },
            { messageId: "addPrefix" },
          ],
        },
        {
          code: [
            "import { useState } from 'react'",
            "import type { HTMLProps } from 'react'",
            "const [test, setTest] = useState<HTMLProps<HTMLElement>>()",
          ].join("\n"),
          output: [
            "import * as React from 'react';",
            "",
            "const [test, setTest] = React.useState<React.HTMLProps<HTMLElement>>()",
          ].join("\n"),
          errors: [
            { messageId: "wrongImport", data: { syntax: "namespace" } },
            { messageId: "duplicateImport", data: { syntax: "namespace" } },
            { messageId: "addPrefix" },
            { messageId: "addPrefix" },
          ],
        },
        {
          code: [
            "import type { HTMLProps } from 'react'",
            "interface Test extends HTMLProps<HTMLElement> {}",
          ].join("\n"),
          output: [
            "import type * as React from 'react';",
            "interface Test extends React.HTMLProps<HTMLElement> {}",
          ].join("\n"),
          errors: [
            { messageId: "wrongImport", data: { syntax: "namespace" } },
            { messageId: "addPrefix" },
          ],
        },
      ],
    });
  });
});
