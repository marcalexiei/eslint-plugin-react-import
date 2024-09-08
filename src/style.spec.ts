import { it } from "vitest";
import { RuleTester } from "eslint";
import typescriptEslintParser from "@typescript-eslint/parser";

import styleRule from "./style.js";

it("import rule js", () => {
  const ruleTester = new RuleTester();
  ruleTester.run("import", styleRule, {
    valid: [
      {
        code: "import React from 'react'",
      },
      {
        code: "import React from 'otherModule';",
      },
    ],

    invalid: [
      {
        code: "import React, { useState } from 'react';",
        output: "import * as React from 'react';",
        errors: ["You should import React using a namespace import"],
      },
      {
        code: "import React, { useState } from 'react';",
        options: [{ syntax: "default" }],
        output: "import React from 'react';",
        errors: ["You should import React using a default import"],
      },
    ],
  });
});

// it("import rule ts", () => {
//   const ruleTester = new RuleTester({
//     languageOptions: {
//       parser: typescriptEslintParser,
//     },
//   });

//   ruleTester.run("import", styleRule, {
//     valid: [
//       {
//         code: "import React from 'react'",
//       },
//       {
//         code: "import type React from 'react';",
//       },
//       {
//         code: "import { useState } from 'otherModule';",
//       },
//     ],

//     invalid: [
//       {
//         code: "import React, { useState } from 'react';",
//         output: "import * as React from 'react';",
//         errors: ["You should import React using a namespace import"],
//       },
//       {
//         code: "import React, { useState } from 'react';",
//         options: [{ syntax: "default" }],
//         output: "import React from 'react';",
//         errors: ["You should import React using a default import"],
//       },
//     ],
//   });
// });
