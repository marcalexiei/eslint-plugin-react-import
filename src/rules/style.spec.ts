import { describe, it, test } from "vitest";
import { RuleTester } from "eslint";
import typescriptEslintParser from "@typescript-eslint/parser";

import styleRule from "./style.js";

describe("style rule js", () => {
  const ruleTester = new RuleTester();

  describe("syntax: `namespace` and without options", () => {
    test("valid", () => {
      ruleTester.run("style", styleRule, {
        valid: [
          {
            code: "import * as React from 'react'",
          },
          {
            code: "import * as React from 'react'",
            options: [{ syntax: "namespace" }],
          },
          {
            code: "import OtherModule from 'otherModule';",
            options: [{ syntax: "namespace" }],
          },
        ],
        invalid: [],
      });
    });

    test("invalid", () => {
      ruleTester.run("style", styleRule, {
        valid: [],

        invalid: [
          {
            code: "import React, { useState } from 'react';",
            output: "import * as React from 'react';",
            errors: ["You should import React using namespace import syntax"],
          },
          {
            code: "import React from 'react';",
            options: [{ syntax: "namespace" }],
            output: "import * as React from 'react';",
            errors: ["You should import React using namespace import syntax"],
          },
          {
            code: "import { useState } from 'react';",
            options: [{ syntax: "namespace" }],
            output: "import * as React from 'react';",
            errors: ["You should import React using namespace import syntax"],
          },
        ],
      });
    });
  });

  describe("syntax: `default`", () => {
    test("valid", () => {
      ruleTester.run("style", styleRule, {
        valid: [
          {
            code: "import React from 'react'",
            options: [{ syntax: "default" }],
          },
          {
            code: "import OtherModule from 'otherModule';",
            options: [{ syntax: "default" }],
          },
        ],

        invalid: [],
      });
    });

    test("invalid", () => {
      ruleTester.run("style", styleRule, {
        valid: [],

        invalid: [
          {
            code: "import React, { useState } from 'react';",
            options: [{ syntax: "default" }],
            output: "import React from 'react';",
            errors: ["You should import React using default import syntax"],
          },
          {
            code: "import * as React from 'react';",
            options: [{ syntax: "default" }],
            output: "import React from 'react';",
            errors: ["You should import React using default import syntax"],
          },
        ],
      });
    });
  });

  it("should add prefix", () => {
    ruleTester.run("style", styleRule, {
      valid: [],
      invalid: [
        {
          code: "import {useState} from 'react';\nuseState()",
          output: "import * as React from 'react';\nReact.useState()",
          errors: [
            "You should import React using namespace import syntax",
            "This React import should have a 'React.' prefix",
          ],
        },
        // with export renamed
        {
          code: [
            "import {useState as useStateOriginal} from 'react';",
            "useStateOriginal()",
          ].join("\n"),
          output: ["import * as React from 'react';", "React.useState()"].join(
            "\n"
          ),
          errors: [
            "You should import React using namespace import syntax",
            "This React import should have a 'React.' prefix",
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
            "You should import React using namespace import syntax",
            "React was already imported. This import should be removed when using namespace import",
            "This React import should have a 'React.' prefix",
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

  describe("syntax: `namespace` and without options", () => {
    test("valid", () => {
      ruleTester.run("style", styleRule, {
        valid: [
          {
            code: "import * as React from 'react'",
          },
          {
            code: "import type * as React from 'react'",
          },
          {
            code: "import * as React from 'react'",
            options: [{ syntax: "namespace" }],
          },
          {
            code: "import type * as React from 'react'",
            options: [{ syntax: "namespace" }],
          },
          {
            code: "import OtherModule from 'otherModule';",
            options: [{ syntax: "namespace" }],
          },
        ],

        invalid: [],
      });
    });

    test("invalid", () => {
      ruleTester.run("style", styleRule, {
        valid: [],

        invalid: [
          {
            code: "import React, { useState } from 'react';",
            output: "import * as React from 'react';",
            errors: ["You should import React using namespace import syntax"],
          },
          {
            code: "import React from 'react';",
            options: [{ syntax: "namespace" }],
            output: "import * as React from 'react';",
            errors: ["You should import React using namespace import syntax"],
          },
          {
            code: "import type React from 'react';",
            options: [{ syntax: "namespace" }],
            output: "import type * as React from 'react';",
            errors: ["You should import React using namespace import syntax"],
          },
          {
            code: "import { useState } from 'react';",
            options: [{ syntax: "namespace" }],
            output: "import * as React from 'react';",
            errors: ["You should import React using namespace import syntax"],
          },
          // both import value and import type
          {
            code: "import React, { useState } from 'react';\nimport type { ComponentProps } from 'react';",
            options: [{ syntax: "namespace" }],
            output: "import * as React from 'react';\n",
            errors: [
              "You should import React using namespace import syntax",
              "React was already imported. This import should be removed when using namespace import",
            ],
          },
          {
            code: "import type { ComponentProps } from 'react';\nimport React, { useState } from 'react';",
            output: "import * as React from 'react';\n",
            options: [{ syntax: "namespace" }],
            errors: [
              "You should import React using namespace import syntax",
              "React was already imported. This import should be removed when using namespace import",
            ],
          },
          // duplicate import types
          {
            code: "import type { ComponentProps } from 'react';\nimport type { HTMLProps } from 'react';",
            output: "import type * as React from 'react';\n",
            options: [{ syntax: "namespace" }],
            errors: [
              "You should import React using namespace import syntax",
              "React was already imported. This import should be removed when using namespace import",
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
              "React was already imported. This import should be removed when using namespace import",
              "This React import should have a 'React.' prefix",
            ],
          },
        ],
      });
    });
  });

  describe("syntax: `default`", () => {
    test("valid", () => {
      ruleTester.run("style", styleRule, {
        valid: [
          {
            code: "import React from 'react'",
            options: [{ syntax: "default" }],
          },
          {
            code: "import type React from 'react'",
            options: [{ syntax: "default" }],
          },
          {
            code: "import OtherModule from 'otherModule';",
            options: [{ syntax: "default" }],
          },
        ],

        invalid: [],
      });
    });
    test("invalid", () => {
      ruleTester.run("style", styleRule, {
        valid: [],

        invalid: [
          {
            code: "import React, { useState } from 'react';",
            options: [{ syntax: "default" }],
            output: "import React from 'react';",
            errors: ["You should import React using default import syntax"],
          },
          {
            code: "import * as React from 'react';",
            options: [{ syntax: "default" }],
            output: "import React from 'react';",
            errors: ["You should import React using default import syntax"],
          },
          // both import value and import type
          {
            code: "import React, { useState } from 'react';\nimport type { ComponentProps } from 'react';",
            options: [{ syntax: "default" }],
            output: "import React from 'react';\n",
            errors: [
              "You should import React using default import syntax",
              "React was already imported. This import should be removed when using default import",
            ],
          },
          {
            code: "import type { ComponentProps } from 'react';\nimport React, { useState } from 'react';",
            output: "import React from 'react';\n",
            options: [{ syntax: "default" }],
            errors: [
              "You should import React using default import syntax",
              "React was already imported. This import should be removed when using default import",
            ],
          },
          // duplicate import types
          {
            code: "import type { ComponentProps } from 'react';\nimport type { HTMLProps } from 'react';",
            output: "import type React from 'react';\n",
            options: [{ syntax: "default" }],
            errors: [
              "You should import React using default import syntax",
              "React was already imported. This import should be removed when using default import",
            ],
          },
        ],
      });
    });
  });

  it("should add prefix", () => {
    ruleTester.run("style", styleRule, {
      valid: [],
      invalid: [
        {
          code: "import type { HTMLProps } from 'react';\ntype Props = HTMLProps<HTMLElement>;",
          output:
            "import type * as React from 'react';\ntype Props = React.HTMLProps<HTMLElement>;",
          errors: [
            "You should import React using namespace import syntax",
            "This React import should have a 'React.' prefix",
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
            "You should import React using namespace import syntax",
            "React was already imported. This import should be removed when using namespace import",
            "This React import should have a 'React.' prefix",
            "This React import should have a 'React.' prefix",
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
            "You should import React using namespace import syntax",
            "This React import should have a 'React.' prefix",
          ],
        },
      ],
    });
  });
});