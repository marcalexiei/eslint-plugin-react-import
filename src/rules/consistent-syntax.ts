import type { Rule } from 'eslint';
import type * as ESTree from 'estree';

import { getRuleURL } from '../meta.js';

export type StyleRuleOptionsSyntax = 'default' | 'namespace';

const syntaxRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: [
        'Enforces React import style across your code.',
        'Can be customized to use default or namespace import.',
      ].join(' '),
      url: getRuleURL('consistent-syntax'),
    },
    messages: {
      wrongImport: 'You should import React using {{syntax}} syntax',
      duplicateImport:
        'React was already imported. This import should be removed when using {{syntax}} import',
      addPrefix: "This React import should have a 'React.' prefix",
    },
    schema: [
      {
        enum: ['default', 'namespace'],
      },
    ],
  },
  create(context) {
    const [syntax = 'namespace'] = context.options as [StyleRuleOptionsSyntax?];

    const acceptedImportSpecifier =
      syntax === 'default'
        ? 'ImportDefaultSpecifier'
        : 'ImportNamespaceSpecifier';
    let hasAlreadyAnImportSatisfyingSyntax = false;

    const invalidImportTypes: Array<string> = [
      'ImportSpecifier',
      /**
       * Based on {@link StyleRuleOptions.syntax} we integrate the array with the unwanted import syntax:
       * If syntax is `default` we should exclude `namespace` imports and vice-versa.
       */
      syntax === 'default'
        ? 'ImportNamespaceSpecifier'
        : 'ImportDefaultSpecifier',
    ];

    /**
     * @description Variable used to store all react import nodes
     * not following the required syntax.
     * Using an Array instead of a Set because I assume that there aren't many imports
     */
    const reactInvalidImports: Array<ESTree.ImportDeclaration> = [];

    /**
     * @description Map all react named imports:
     * The key is the local file name, the value is the original name
     * useState as useStateReact
     * ^ value     ^ key
     */
    const reactNamedImports = new Map<string, string>();

    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ImportDeclaration: (node): void => {
        /** @todo might change selector to something like ImportDeclaration[source.value="react"] */
        if (node.source.value !== 'react') {
          return;
        }

        const { specifiers } = node;

        // if an import satisfies the preferred syntax it should not be added
        // to invalid imports and its presence should be remembered to avoid useless replace
        if (
          specifiers.length === 1 &&
          specifiers[0].type === acceptedImportSpecifier
        ) {
          hasAlreadyAnImportSatisfyingSyntax = true;
          return;
        }

        let hasAtLeastOneNamedImport = false;
        for (const specifier of specifiers) {
          if (invalidImportTypes.includes(specifier.type)) {
            hasAtLeastOneNamedImport = true;
            if (specifier.type === 'ImportSpecifier') {
              /** Store named imports to use them to add prefixes */

              const { local, imported } = specifier;

              /**
               * Assuming React won't export items using literals
               * @see https://github.com/tc39/ecma262/pull/2154
               */
              const exportedName = (imported as ESTree.Identifier).name;

              reactNamedImports.set(local.name, exportedName);
            }
          }
        }

        if (hasAtLeastOneNamedImport) {
          reactInvalidImports.push(node);
        }
      },

      /** Check all identifiers and if they match the one imported from React add the prefix */
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Identifier[parent.type!="ImportDefaultSpecifier"][parent.type!="ImportSpecifier"][parent.type!="ImportNamespaceSpecifier"]':
        (node: ESTree.Identifier): void => {
          if (reactNamedImports.has(node.name)) {
            const originalImportName = reactNamedImports.get(node.name)!;

            context.report({
              messageId: 'addPrefix',
              loc: node.loc!,
              fix(fixer) {
                return fixer.replaceText(node, `React.${originalImportName}`);
              },
            });
          }
        },

      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Program:exit': (): void => {
        /** Check if there is at least one invalid import */
        if (!reactInvalidImports.length) {
          return;
        }

        /** All additional imports can be removed */
        for (const [index, reactImportNode] of reactInvalidImports.entries()) {
          if (!hasAlreadyAnImportSatisfyingSyntax && index === 0) {
            /** Replace the first import with the right import based on options */
            context.report({
              messageId: 'wrongImport',
              data: { syntax },
              loc: reactImportNode.loc!,
              fix(fixer) {
                /** Cycle all imports to understand if it should become a import type */
                const importType = reactInvalidImports.every(
                  (importNode) =>
                    'importKind' in importNode &&
                    importNode.importKind === 'type',
                )
                  ? 'type'
                  : '';

                const correctImportSyntax =
                  syntax === 'default' ? 'React' : '* as React';

                /** @todo maybe there is a more smart method working directly on AST node to do this */
                const newImport = `import ${importType} ${correctImportSyntax} from 'react';`;

                return fixer.replaceText(
                  reactImportNode,
                  newImport.replace(/\s+/g, ' '),
                );
              },
            });
          } else {
            context.report({
              messageId: 'duplicateImport',
              data: { syntax },
              loc: reactImportNode.loc!,
              fix(fixer) {
                return fixer.remove(reactImportNode);
              },
            });
          }
        }
      },
    };
  },
};

export default syntaxRule;
