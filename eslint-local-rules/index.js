module.exports = {
  "no-budibase-imports": {
    create: function (context) {
      return {
        ImportDeclaration(node) {
          const importPath = node.source.value

          if (
            /^@budibase\/[^/]+\/.*$/.test(importPath) &&
             !["@budibase/backend-core/tests","@budibase/string-templates/js-helpers"].includes(importPath)
          ) {
            context.report({
              node,
              message: `Importing from @budibase is not allowed, except for @budibase/backend-core/tests and @budibase/string-templates/js-helpers.`,
            })
          }
        },
      }
    },
  },
}
