import type { Rule } from 'eslint';
import type * as ESTree from 'estree';

export interface SyntaxVariant {
  isSatisfying: (specifiers: ESTree.ImportDeclaration['specifiers']) => boolean;
  invalidSpecifierTypes: ReadonlyArray<string>;
  trackNamedForPrefix: boolean;
  buildFix: (
    fixer: Rule.RuleFixer,
    node: ESTree.ImportDeclaration,
    allInvalidImports: ReadonlyArray<ESTree.ImportDeclaration>,
  ) => Rule.Fix | null;
}

// eslint-disable-next-line @typescript-eslint/max-params
export function createRuleListener(
  context: Rule.RuleContext,
  syntax: string,
  variant: SyntaxVariant,
  allowedNamespaceMembers: ReadonlySet<string> = new Set(),
): Rule.RuleListener {
  let hasAlreadyAnImportSatisfyingSyntax = false;
  const reactInvalidImports: Array<ESTree.ImportDeclaration> = [];
  const reactNamedImports = new Map<string, string>();

  // Maps namespace local identifier name → import node, used for allow-list exemptions.
  const namespaceImportNodes = new Map<string, ESTree.ImportDeclaration>();
  // Invalid namespace imports that are exempt because an allowed member is accessed via them.
  const exemptImports = new Set<ESTree.ImportDeclaration>();

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ImportDeclaration(node): void {
      if (node.source.value !== 'react') {
        return;
      }

      const { specifiers } = node;

      if (variant.isSatisfying(specifiers)) {
        hasAlreadyAnImportSatisfyingSyntax = true;
        return;
      }

      let hasAtLeastOneInvalidSpecifier = false;
      for (const specifier of specifiers) {
        if (variant.invalidSpecifierTypes.includes(specifier.type)) {
          hasAtLeastOneInvalidSpecifier = true;
          if (
            variant.trackNamedForPrefix &&
            specifier.type === 'ImportSpecifier'
          ) {
            const { local, imported } = specifier;
            const exportedName = (imported as ESTree.Identifier).name;
            reactNamedImports.set(local.name, exportedName);
          }
          if (
            allowedNamespaceMembers.size > 0 &&
            specifier.type === 'ImportNamespaceSpecifier'
          ) {
            namespaceImportNodes.set(specifier.local.name, node);
          }
        }
      }

      if (hasAtLeastOneInvalidSpecifier) {
        reactInvalidImports.push(node);
      }
    },

    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Identifier[parent.type!="ImportDefaultSpecifier"][parent.type!="ImportSpecifier"][parent.type!="ImportNamespaceSpecifier"]':
      (node: ESTree.Identifier): void => {
        if (!variant.trackNamedForPrefix) {
          return;
        }
        if (!reactNamedImports.has(node.name)) {
          return;
        }

        const originalImportName = reactNamedImports.get(node.name)!;
        context.report({
          messageId: 'addPrefix',
          loc: node.loc!,
          fix(fixer) {
            return fixer.replaceText(node, `React.${originalImportName}`);
          },
        });
      },

    // eslint-disable-next-line @typescript-eslint/naming-convention
    MemberExpression(node: ESTree.MemberExpression): void {
      if (
        allowedNamespaceMembers.size === 0 ||
        namespaceImportNodes.size === 0
      ) {
        return;
      }
      if (node.computed || node.object.type !== 'Identifier') {
        return;
      }
      const objectName = node.object.name;
      const propertyName = (node.property as ESTree.Identifier).name;
      const importNode = namespaceImportNodes.get(objectName);
      if (
        importNode !== undefined &&
        allowedNamespaceMembers.has(propertyName)
      ) {
        exemptImports.add(importNode);
      }
    },

    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Program:exit': (): void => {
      const importsToReport = reactInvalidImports.filter(
        (node) => !exemptImports.has(node),
      );

      if (!importsToReport.length) {
        return;
      }

      for (const [index, reactImportNode] of importsToReport.entries()) {
        if (!hasAlreadyAnImportSatisfyingSyntax && index === 0) {
          context.report({
            messageId: 'wrongImport',
            data: { syntax },
            loc: reactImportNode.loc!,
            fix(fixer) {
              return variant.buildFix(
                fixer,
                reactImportNode,
                reactInvalidImports,
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
}
