module.exports = {
  "no-budibase-imports": {
    create: function (context) {
      return {
        ImportDeclaration(node) {
          const importPath = node.source.value

          if (
            /^@budibase\/[^/]+\/.*$/.test(importPath) &&
            importPath !== "@budibase/backend-core/tests"
          ) {
            context.report({
              node,
              message: `Importing from @budibase is not allowed, except for @budibase/backend-core/tests.`,
            })
          }
        },
      }
    },
  },
  "no-test-com": {
    meta: {
      type: "problem",
      docs: {
        description:
          "disallow the use of 'test.com' in strings and replace it with 'example.com'",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [], // no options
      fixable: "code", // Indicates that this rule supports automatic fixing
    },
    create: function (context) {
      return {
        Literal(node) {
          if (
            typeof node.value === "string" &&
            node.value.includes("test.com")
          ) {
            context.report({
              node,
              message:
                "test.com is a privately owned domain and could point anywhere, use example.com instead.",
              fix: function (fixer) {
                const newText = node.raw.replace(/test\.com/g, "example.com")
                return fixer.replaceText(node, newText)
              },
            })
          }
        },
      }
    },
  },
}
