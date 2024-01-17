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
}
