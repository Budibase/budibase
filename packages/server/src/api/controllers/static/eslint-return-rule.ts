export const globalReturn = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce js snippet return",
    },
    fixable: "code",
    schema: [],
    messages: {
      noReturn: "Something something something",
    },
  },
  create(context: any) {
    let returnStatementFound = false

    return {
      ReturnStatement: function (node: any) {
        // this doesn't have awareness of the main config
        // https://github.com/eslint/eslint/blob/ba1c1bbc6ba9d57a83d04f450566337d3c3b0448/lib/rules/no-eval.js#L229
        // https://developers.mews.com/how-to-write-custom-eslint-rules/
        let features = context.parserOptions.ecmaFeatures || {}
        let scope = context.getScope()
        if (scope.block.type === "Program") {
          //if (scope.type === "global") {
          //|| scope.type === "module") {
          returnStatementFound = true
        }
      },
      "Program:exit": function (node: any) {
        if (!returnStatementFound) {
          context.report({
            node,
            message: "The snippet must contain at least one return statement.",
          })
        }
      },
    }
  },
}
