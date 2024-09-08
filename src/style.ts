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
      syntax === "default"
        ? "ImportNamespaceSpecifier"
        : "ImportDefaultSpecifier",
    ];

    return {
      ImportDeclaration: (node) => {
        if (node.source.value !== "react") return;

        const hasImportDeclarations = node.specifiers.some((it) =>
          invalidImportType.includes(it.type)
        );

        if (!hasImportDeclarations) return;

        context.report({
          messageId: "wrongImport",
          data: { syntax },
          loc: node.loc,
          fix: (fixer) => {
            const correctImport = syntax === "default" ? "React" : "* as React";
            const importType =
              "importKind" in node && node.importKind === "type" ? "type" : "";

            const newImport = `import ${importType} ${correctImport} from 'react';`;

            return fixer.replaceText(node, newImport.replace(/\s+/g, " "));
          },
        });
      },
    };
  },
};

export default styleRule;
