# Contributing

## Setup instructions

[https://marcalexiei.github.io/contribute/setup-pnpm-nvm.html](https://marcalexiei.github.io/contribute/setup-pnpm-nvm.html)

To check that every thing works correctly run:

```shell
pnpm run build && pnpm run test
```

## Test

There are two types of test:

1. **rules code** - tests executed directly on rule code using `ESLint#RuleTester`
2. **configuration tests** - they create an `ESLint` instance and they run it on files available in fixtures under `tests/fixtures` folders. These files contains errors so they should not be fixed manually.

> [!TIP]
> Fixtures configuration can also be used as playground to tryout if the rule are working as expected via editor.
> After changing plugin source code be sure to run the build and restart ESLint server (or VSCode)before test the changes

## Documentation changes

```shell
pnpm run update:eslint-docs
```

Be sure to check documentation lint via

```shell
pnpm run lint:docs
```

## Commit rules

[https://marcalexiei.github.io/contribute/commit-rules.html](https://marcalexiei.github.io/contribute/commit-rules.html)
