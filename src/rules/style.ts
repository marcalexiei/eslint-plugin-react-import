import type { Rule } from "eslint";
import type * as ESTree from "estree";

interface StyleRuleOptions {
  syntax: "default" | "namespace";
}

const styleRule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      description: [
        "Enforces React import style across your code.",
        "Can be customized to use default or namespace import.",
        "By default converts exports using namespace import",
      ].join(" "),
    },
    messages: {
      wrongImport: "You should import React using {{syntax}} import syntax",
      multipleImport:
        "React was already imported. This import should be removed when using {{syntax}} import",
      addPrefix: "This React import should have a 'React.' prefix",
    },
    schema: [
      {
        type: "object",
        properties: {
          syntax: { enum: ["default", "namespace"] },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const [{ syntax = "namespace" } = {}] = context.options as [
      StyleRuleOptions?
    ];

    const invalidImportTypes: Array<string> = [
      "ImportSpecifier",
      /**
       * Based on {@link StyleRuleOptions.syntax} we integrate the array with the unwanted import syntax:
       * If syntax is `default` we should exclude `namespace` imports and vice-versa.
       */
      syntax === "default"
        ? "ImportNamespaceSpecifier"
        : "ImportDefaultSpecifier",
    ];

    /**
     * Variable used to store all react imports not following the required syntax
     */
    const reactInvalidImports: Array<ESTree.ImportDeclaration> = [];

    const reactNamedImports: Array<string> = [];

    return {
      ImportDeclaration: (node) => {
        const { source, specifiers } = node;

        /** @todo might change selector to something like ImportDeclaration[source.value="react"] */
        if (source.value !== "react") return;

        let hasAtLeastOneNamedImport = false;
        for (const specifier of specifiers) {
          if (invalidImportTypes.includes(specifier.type)) {
            hasAtLeastOneNamedImport = true;
            if (specifier.type === "ImportSpecifier") {
              /** Store named imports to use them to fix prefixes */
              reactNamedImports.push(specifier.local.name);
            }
          }
        }

        if (hasAtLeastOneNamedImport) {
          reactInvalidImports.push(node);
        }
      },

      CallExpression: (node) => {
        if (
          node.callee.type === "Identifier" &&
          reactNamedImports.includes(node.callee.name)
        ) {
          return context.report({
            messageId: "addPrefix",
            loc: { ...node.loc! },
            fix(fixer) {
              return fixer.insertTextBefore(node, "React.");
            },
          });
        }
      },

      "Program:exit": (node) => {
        /** Check if there is at least one invalid import */
        if (!reactInvalidImports.length) return;

        const [firstImport, ...otherReactImports] = reactInvalidImports;

        /** Replace the first import with the right import based on options */
        context.report({
          messageId: "wrongImport",
          data: { syntax },
          loc: { ...firstImport.loc! },
          fix(fixer) {
            /** Cycle all imports to understand if it should become a import type */
            const importType = reactInvalidImports.every(
              (importNode) =>
                "importKind" in importNode && importNode.importKind === "type"
            )
              ? "type"
              : "";

            const correctImportSyntax =
              syntax === "default" ? "React" : "* as React";

            /** @todo maybe there is a more smart method working directly on AST node to do this */
            const newImport = `import ${importType} ${correctImportSyntax} from 'react';`;

            return fixer.replaceText(
              firstImport,
              newImport.replace(/\s+/g, " ")
            );
          },
        });

        /** All additional imports can be removed */
        for (const reactImportNode of otherReactImports) {
          context.report({
            messageId: "multipleImport",
            data: { syntax },
            loc: { ...reactImportNode.loc! },
            fix(fixer) {
              return fixer.remove(reactImportNode);
            },
          });
        }
      },
    };
  },
};

export default styleRule;
