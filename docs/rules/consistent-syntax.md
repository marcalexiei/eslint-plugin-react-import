# react-import/consistent-syntax

📝 Enforces React import style across your code. Can be customized to use default, namespace, or named import.

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Options

```text
"react-import/consistent-syntax": ["error", <"namespace" | "default" | "named">]
```

This rule accepts one string option that selects the preferred import syntax. Defaults to `"namespace"` when omitted.

## `namespace`

Requires React to be imported as a namespace (`import * as React from 'react'`). Named identifiers used directly must be accessed via the `React.` prefix; the rule reports and auto-fixes any bare usage.

Examples of **incorrect** code with this option:

```js
import React from 'react';

import React, { useState } from 'react';

import { useState } from 'react';
useState();
```

Examples of **correct** code with this option:

```js
import * as React from 'react';

import * as React from 'react';
const [count, setCount] = React.useState(0);
```

## `default`

Requires React to be imported as a default import (`import React from 'react'`). Named identifiers used directly must be accessed via the `React.` prefix.

Examples of **incorrect** code with this option:

```js
import * as React from 'react';

import React, { useState } from 'react';
```

Examples of **correct** code with this option:

```js
import React from 'react';

import React from 'react';
const [count, setCount] = React.useState(0);
```

## `named`

Requires React to be imported using named imports only (`import { useState } from 'react'`). Default and namespace imports are invalid and will be removed by the fixer. If a default or namespace import is mixed with named imports, only the named imports are preserved.

> [!NOTE]
> When switching from `namespace` or `default` to `named`, bare default/namespace imports (with no named specifiers) are removed entirely since there is nothing to preserve.

Examples of **incorrect** code with this option:

```js
// default import — removed by fixer
import React from 'react';
function App() {
  return null;
}

// namespace import — removed by fixer
import * as React from 'react';
function App() {
  return null;
}

// mixed import — default specifier stripped, named specifiers kept
import React, { useState } from 'react';
const [count, setCount] = useState(0);
```

Examples of **correct** code with this option:

```js
import { useState } from 'react';
const [count, setCount] = useState(0);

import { useState, useEffect } from 'react';
```

### `captureOwnerStack` and other dev-only exports

Some React APIs are [only exported in development builds](https://react.dev/reference/react/captureOwnerStack#captureownerstack-is-not-available) and will be `undefined` in production (e.g. `captureOwnerStack`). The React documentation explicitly recommends accessing these via a namespace import rather than a named import.

The rule automatically recognises these APIs. A namespace import is treated as valid when the namespace is used to access a dev-only member, even without any extra configuration.

Examples of **correct** code:

```js
import * as React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const stack = React.captureOwnerStack();
  console.log(stack);
}
```

```js
import * as React from 'react';
import { useState } from 'react';

const [count, setCount] = useState(0);
if (process.env.NODE_ENV !== 'production') {
  const stack = React.captureOwnerStack();
}
```

A namespace import with no access to any dev-only member is still reported as invalid:

```js
// captureOwnerStack is never accessed — namespace import is flagged
import * as React from 'react';
function App() {
  return null;
}
```

## When Not To Use It

If you do not care about React import consistency.
