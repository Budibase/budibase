const path = require("path")

const makeBarrelPath = finalPath => {
  return path.resolve(__dirname, "..", finalPath)
}
const backendCoreBarrelPaths = [
  makeBarrelPath(path.join("packages", "backend-core", "src", "index.ts")),
  makeBarrelPath(path.join("packages", "backend-core", "src")),
  makeBarrelPath(path.join("packages", "backend-core")),
]

module.exports = {
  "no-console-error": {
    create: function (context) {
      return {
        CallExpression(node) {
          if (
            node.callee.type === "MemberExpression" &&
            node.callee.object.name === "console" &&
            node.callee.property.name === "error" &&
            node.arguments.length === 1 &&
            node.arguments[0].name &&
            node.arguments[0].name.startsWith("err")
          ) {
            context.report({
              node,
              message:
                "Using console.error(err) on its own is not allowed. Either provide context to the error (console.error(msg, err)) or throw it.",
            })
          }
        },
      }
    },
  },
  "no-budibase-imports": {
    create: function (context) {
      return {
        ImportDeclaration(node) {
          const importPath = node.source.value

          if (
            /^@budibase\/[^/]+\/.*$/.test(importPath) &&
            importPath !== "@budibase/backend-core/tests" &&
            importPath !== "@budibase/string-templates/test/utils"
          ) {
            context.report({
              node,
              message: `Importing from @budibase is not allowed, except for @budibase/backend-core/tests and @budibase/string-templates/test/utils.`,
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
      },
      schema: [],
      fixable: "code",
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
  "email-domain-example-com": {
    meta: {
      type: "problem",
      docs: {
        description:
          "enforce using the example.com domain for generator.email calls",
      },
      fixable: "code",
      schema: [],
    },
    create: function (context) {
      return {
        CallExpression(node) {
          if (
            node.callee.type === "MemberExpression" &&
            node.callee.object.name === "generator" &&
            node.callee.property.name === "email" &&
            node.arguments.length === 0
          ) {
            context.report({
              node,
              message:
                "Prefer using generator.email with the domain \"{ domain: 'example.com' }\".",
              fix: function (fixer) {
                return fixer.replaceText(
                  node,
                  'generator.email({ domain: "example.com" })'
                )
              },
            })
          }
        },
      }
    },
  },
  "no-barrel-imports": {
    meta: {
      type: "problem",
      docs: {
        description:
          "Disallow imports from the top-level backend-core barrel file",
        category: "Best Practices",
        recommended: false,
      },
      schema: [], // no options
      messages: {
        noBarrelImport:
          "Avoid importing from the top-level barrel file 'backend-core/src/index.ts'. Import directly from the specific module instead.",
      },
    },
    create(context) {
      return {
        ImportDeclaration(node) {
          const importPath = node.source.value
          const importFullPath = path.resolve(
            context.getFilename(),
            "..",
            importPath
          )

          if (backendCoreBarrelPaths.includes(importFullPath)) {
            context.report({
              node,
              messageId: "noBarrelImport",
              data: {
                importFullPath,
              },
            })
          }
        },
      }
    },
  },
}
