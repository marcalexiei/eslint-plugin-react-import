import type { Rule } from "eslint";

interface StyleRuleOptions {
  syntax: "default" | "namespace";
}

const styleRule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforces React import style across your code. Can be customized to use both default or namespace import",
    },
    fixable: "code",
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
    return {
      ImportDeclaration: (node) => {
        if (node.source.value !== "react") return;

        const hasImportDeclarations = node.specifiers.some(
          (it) => it.type === "ImportSpecifier"
        );

        if (!hasImportDeclarations) return;

        const [{ syntax = "namespace" } = {}] = context.options as [
          StyleRuleOptions
        ];

        debugger;

        context.report({
          message: `You should import React using a ${syntax} import`,
          loc: node.loc,
          fix: (fixer) => {
            const correctImport = syntax === "default" ? "React" : "* as React";
            return fixer.replaceText(
              node,
              `import ${correctImport} from 'react';`
            );
          },
        });
      },
    };
  },
};

export default styleRule;
