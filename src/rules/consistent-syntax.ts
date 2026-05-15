import type { Rule } from 'eslint';
import type * as ESTree from 'estree';

import { getRuleURL } from '../meta.js';
import { createRuleListener } from '../utils/consistent-syntax-shared.js';
import type { SyntaxVariant } from '../utils/consistent-syntax-shared.js';

const StyleRuleOptionsSyntaxes = ['default', 'namespace', 'named'] as const;
type StyleRuleOptionsSyntax = (typeof StyleRuleOptionsSyntaxes)[number];

// React members that are only exported in development builds and cannot be
// safely used as named imports in files bundled for both environments.
// See https://react.dev/reference/react/captureOwnerStack#captureownerstack-is-not-available
const NAMED_ALLOWED_NAMESPACE_MEMBERS = new Set(['captureOwnerStack']);

const variants: Record<StyleRuleOptionsSyntax, SyntaxVariant> = {
  namespace: {
    isSatisfying: (specifiers) =>
      specifiers.length === 1 &&
      specifiers[0].type === 'ImportNamespaceSpecifier',
    invalidSpecifierTypes: ['ImportSpecifier', 'ImportDefaultSpecifier'],
    trackNamedForPrefix: true,
    buildFix(fixer, node, allInvalidImports) {
      const importType = allInvalidImports.every(
        (n) => 'importKind' in n && n.importKind === 'type',
      )
        ? 'type'
        : '';
      return fixer.replaceText(
        node,
        `import ${importType} * as React from 'react';`.replace(/\s+/g, ' '),
      );
    },
  },
  default: {
    isSatisfying: (specifiers) =>
      specifiers.length === 1 &&
      specifiers[0].type === 'ImportDefaultSpecifier',
    invalidSpecifierTypes: ['ImportSpecifier', 'ImportNamespaceSpecifier'],
    trackNamedForPrefix: true,
    buildFix(fixer, node, allInvalidImports) {
      const importType = allInvalidImports.every(
        (n) => 'importKind' in n && n.importKind === 'type',
      )
        ? 'type'
        : '';
      return fixer.replaceText(
        node,
        `import ${importType} React from 'react';`.replace(/\s+/g, ' '),
      );
    },
  },
  named: {
    isSatisfying: (specifiers) =>
      specifiers.length > 0 &&
      specifiers.every((s) => s.type === 'ImportSpecifier'),
    invalidSpecifierTypes: [
      'ImportDefaultSpecifier',
      'ImportNamespaceSpecifier',
    ],
    trackNamedForPrefix: false,
    buildFix(fixer, node) {
      const namedSpecifiers = node.specifiers.filter(
        (s): s is ESTree.ImportSpecifier => s.type === 'ImportSpecifier',
      );

      if (namedSpecifiers.length === 0) {
        return fixer.remove(node);
      }

      const importKind =
        'importKind' in node && node.importKind === 'type' ? 'type ' : '';

      const specifiersText = namedSpecifiers
        .map((s) => {
          const importedName = (s.imported as ESTree.Identifier).name;
          const localName = s.local.name;
          return importedName === localName
            ? importedName
            : `${importedName} as ${localName}`;
        })
        .join(', ');

      return fixer.replaceText(
        node,
        `import ${importKind}{ ${specifiersText} } from 'react';`,
      );
    },
  },
};

const syntaxRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: [
        'Enforces React import style across your code.',
        'Can be customized to use default, namespace, or named import.',
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
        description: 'syntax to use',
        enum: [...StyleRuleOptionsSyntaxes],
      },
    ],
    defaultOptions: ['namespace'],
  },
  create(context) {
    const [syntax = 'namespace'] = context.options as [StyleRuleOptionsSyntax];
    const allowedNamespaceMembers =
      syntax === 'named' ? NAMED_ALLOWED_NAMESPACE_MEMBERS : undefined;
    return createRuleListener(
      context,
      syntax,
      variants[syntax],
      allowedNamespaceMembers,
    );
  },
};

export default syntaxRule;
