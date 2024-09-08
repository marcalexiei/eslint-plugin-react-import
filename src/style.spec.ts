import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import typescriptEslintParser from "@typescript-eslint/parser";

import styleRule from "./style.js";

describe("style rule js", () => {
  const ruleTester = new RuleTester();

  it("syntax: `namespace` and without options", () => {
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

  it("syntax: `default`", () => {
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

describe("style rule ts", () => {
  const ruleTester = new RuleTester({
    languageOptions: {
      parser: typescriptEslintParser,
    },
  });

  it("syntax: `namespace` and without options", () => {
    ruleTester.run(" import syntax", styleRule, {
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
      ],
    });
  });

  it("syntax: `default`", () => {
    ruleTester.run(" import syntax", styleRule, {
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
