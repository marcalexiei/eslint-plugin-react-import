import prettier from "prettier";

/** @type {import('eslint-doc-generator').GenerateOptions} */
export default {
  postprocess: (content) => prettier.format(content, { parser: "markdown" }),
};
