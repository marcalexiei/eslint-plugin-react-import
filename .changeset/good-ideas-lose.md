---
'eslint-plugin-react-import': minor
---

feat(consistent-syntax): add new `named` option

The rule automatically allows namespace imports (`import * as React`) when they are used to access dev-only React APIs such as `captureOwnerStack`, which [cannot be safely imported by name](https://react.dev/reference/react/captureOwnerStack#captureownerstack-is-not-available) in files bundled for both production and development.
