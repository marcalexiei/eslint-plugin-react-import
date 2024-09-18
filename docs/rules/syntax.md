# Enforces React import style across your code. Can be customized to use default or namespace import. (`react-import/syntax`)

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Examples of **incorrect** code for this rule:

```js
import React, { useState } from "react";
```

Examples of **correct** code for this rule:

```js
import * as React from "react";
```

## Options

```text
"react-import/syntax": [<enabled>, <'namespace' | 'default'>]
```

This rule has one string options that allows to choose the preferred syntax for React imports:

### `namespace` (default)

```js
import React, { useState } from "react";
```

Examples of **correct** code for this rule:

```js
import * as React from "react";
```

### `default`

```js
import * as React from "react";
```

Examples of **correct** code for this rule:

```js
import React from "react";
```

## When Not To Use It

If you do not care about React import consistencies
