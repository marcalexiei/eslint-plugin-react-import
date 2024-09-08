import type { Rule } from "eslint";

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
      StyleRuleOptions
    ];

    const invalidImportType = [
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
     * Counter the total react imports (might be more than one when in typescript due to type imports)
     * @todo find a more intelligent way to do this
     */
    const reactImports = context.sourceCode.ast.body.filter(
      (it) => it.type === "ImportDeclaration" && it.source.value === "react"
    );

    let reactImportsNavigated = 0;

    return {
      ImportDeclaration: (node) => {
        /**
         * @todo might change selector to something like ImportDeclaration[source.value="react"]
         */
        if (node.source.value !== "react") return;

        reactImportsNavigated += 1;

        const hasImportDeclarations = node.specifiers.some((it) =>
          invalidImportType.includes(it.type)
        );

        if (!hasImportDeclarations) return;

        /** The first import will become the import following the {@link StyleRuleOptions.syntax}   */
        if (reactImportsNavigated === 1) {
          return context.report({
            messageId: "wrongImport",
            data: { syntax },
            loc: node.loc,
            fix: (fixer) => {
              /** Cycle all imports to understand if it should become a import type */
              const importType = reactImports.every(
                (importNode) =>
                  "importKind" in importNode && importNode.importKind === "type"
              )
                ? "type"
                : "";

              const correctImportSyntax =
                syntax === "default" ? "React" : "* as React";

              const newImport = `import ${importType} ${correctImportSyntax} from 'react';`;

              return fixer.replaceText(node, newImport.replace(/\s+/g, " "));
            },
          });
        }

        /** Additional imports should be removed */
        return context.report({
          messageId: "multipleImport",
          data: { syntax },
          loc: node.loc,
          fix: (fixer) => {
            return fixer.remove(node);
          },
        });
      },
    };
  },
};

export default styleRule;
