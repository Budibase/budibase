const fs = require("fs")
const path = require("path")
const postcss = require("postcss")

const extractStyleBlocks = text => {
  const blocks = []
  const styleTagRe = /<style\b[^>]*>/gi
  let match
  while ((match = styleTagRe.exec(text))) {
    const startTagEnd = match.index + match[0].length
    const endTag = text.indexOf("</style>", startTagEnd)
    if (endTag === -1) {
      break
    }
    blocks.push({
      css: text.slice(startTagEnd, endTag),
      startIndex: startTagEnd,
    })
    styleTagRe.lastIndex = endTag + "</style>".length
  }
  return blocks
}

const buildLineOffsets = text => {
  const offsets = [0]
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === "\\n") {
      offsets.push(i + 1)
    }
  }
  return offsets
}

const lineColToIndex = (offsets, line, column) => {
  if (!line || !column) {
    return 0
  }
  const lineIndex = offsets[line - 1] ?? 0
  return lineIndex + Math.max(column - 1, 0)
}

const splitSelectorList = selector => {
  const parts = []
  let current = ""
  let parenDepth = 0
  let bracketDepth = 0
  let inString = null

  for (let i = 0; i < selector.length; i += 1) {
    const char = selector[i]

    if (inString) {
      current += char
      if (char === inString && selector[i - 1] !== "\\") {
        inString = null
      }
      continue
    }

    if (char === "\"" || char === "'") {
      inString = char
      current += char
      continue
    }

    if (char === "(") {
      parenDepth += 1
      current += char
      continue
    }

    if (char === ")") {
      parenDepth = Math.max(parenDepth - 1, 0)
      current += char
      continue
    }

    if (char === "[") {
      bracketDepth += 1
      current += char
      continue
    }

    if (char === "]") {
      bracketDepth = Math.max(bracketDepth - 1, 0)
      current += char
      continue
    }

    if (char === "," && parenDepth === 0 && bracketDepth === 0) {
      if (current.trim()) {
        parts.push(current.trim())
      }
      current = ""
      continue
    }

    current += char
  }

  if (current.trim()) {
    parts.push(current.trim())
  }

  return parts
}

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
  "no-context-getglobaldb": {
    meta: {
      type: "problem",
      docs: {
        description: "Disallow context.getGlobalDB() usage in workspace SDK",
        category: "Best Practices",
        recommended: false,
      },
      fixable: "code",
      schema: [],
      messages: {
        noGetGlobalDB:
          "Use context.getWorkspaceDB() instead of context.getGlobalDB() in workspace SDK code.",
      },
    },
    create(context) {
      return {
        CallExpression(node) {
          const callee =
            node.callee.type === "ChainExpression"
              ? node.callee.expression
              : node.callee

          if (
            callee.type === "MemberExpression" &&
            callee.object.type === "Identifier" &&
            callee.object.name === "context" &&
            callee.property.type === "Identifier" &&
            callee.property.name === "getGlobalDB"
          ) {
            context.report({
              node,
              messageId: "noGetGlobalDB",
              fix: fixer => {
                return fixer.replaceText(callee.property, "getWorkspaceDB")
              },
            })
          }
        },
      }
    },
  },
  "no-display-contents-custom-props": {
    meta: {
      type: "problem",
      docs: {
        description:
          "Warn when display: contents is combined with CSS custom properties in the same selector",
      },
      schema: [],
      messages: {
        splitRule:
          "Selector \"{{selector}}\" sets display: contents alongside CSS custom properties. Split into separate selectors to avoid CSS tree-shaking.",
      },
    },
    create(context) {
      const filename = context.getFilename()
      const svelteIndex = filename.lastIndexOf(".svelte")
      if (svelteIndex === -1) {
        return {}
      }

      const sourceCode = context.getSourceCode()
      const resolvedFilename = filename.slice(0, svelteIndex + ".svelte".length)
      const text =
        resolvedFilename !== "<input>" && fs.existsSync(resolvedFilename)
          ? fs.readFileSync(resolvedFilename, "utf8")
          : sourceCode.getText()
      const styleBlocks = extractStyleBlocks(text)

      return {
        Program() {
          for (const block of styleBlocks) {
            let root
            try {
              root = postcss.parse(block.css)
            } catch (error) {
              continue
            }

            const offsets = buildLineOffsets(block.css)

            root.walkRules(rule => {
              let hasDisplayContents = false
              let hasCustomProps = false

              rule.walkDecls(decl => {
                const prop = decl.prop ? decl.prop.trim() : ""
                if (!prop) {
                  return
                }
                if (prop.startsWith("--")) {
                  hasCustomProps = true
                }
                if (
                  prop === "display" &&
                  decl.value &&
                  decl.value.trim() === "contents"
                ) {
                  hasDisplayContents = true
                }
              })

              if (!hasDisplayContents || !hasCustomProps) {
                return
              }

              const start = rule.source?.start
              const end = rule.source?.end || start

              if (start && end) {
                const startIndex =
                  block.startIndex +
                  lineColToIndex(offsets, start.line, start.column)
                const endIndex =
                  block.startIndex +
                  lineColToIndex(offsets, end.line, end.column)

                context.report({
                  node: sourceCode.ast,
                  loc: {
                    start: sourceCode.getLocFromIndex(startIndex),
                    end: sourceCode.getLocFromIndex(endIndex),
                  },
                  messageId: "splitRule",
                  data: { selector: rule.selector || "selector" },
                })
                return
              }

              context.report({
                node: sourceCode.ast,
                messageId: "splitRule",
                data: { selector: rule.selector || "selector" },
              })
            })
          }
        },
      }
    },
  },
  "no-multiple-child-global-selectors": {
    meta: {
      type: "problem",
      docs: {
        description:
          "Disallow multiple child combinator :global selectors in a comma-separated selector list",
      },
      schema: [],
      messages: {
        splitRule:
          "Selector list contains multiple child combinator :global selectors. Split into separate rules to avoid minification issues.",
      },
    },
    create(context) {
      const filename = context.getFilename()
      const svelteIndex = filename.lastIndexOf(".svelte")
      if (svelteIndex === -1) {
        return {}
      }

      const sourceCode = context.getSourceCode()
      const resolvedFilename = filename.slice(0, svelteIndex + ".svelte".length)
      const text =
        resolvedFilename !== "<input>" && fs.existsSync(resolvedFilename)
          ? fs.readFileSync(resolvedFilename, "utf8")
          : sourceCode.getText()
      const styleBlocks = extractStyleBlocks(text)

      return {
        Program() {
          for (const block of styleBlocks) {
            let root
            try {
              root = postcss.parse(block.css)
            } catch (error) {
              continue
            }

            const offsets = buildLineOffsets(block.css)

            root.walkRules(rule => {
              if (!rule.selector || !rule.selector.includes(",")) {
                return
              }

              const selectors = splitSelectorList(rule.selector)
              let childGlobalCount = 0

              for (const selector of selectors) {
                if (/>\s*:global\(/.test(selector)) {
                  childGlobalCount += 1
                  if (childGlobalCount > 1) {
                    break
                  }
                }
              }

              if (childGlobalCount <= 1) {
                return
              }

              const start = rule.source?.start
              const end = rule.source?.end || start

              if (start && end) {
                const startIndex =
                  block.startIndex +
                  lineColToIndex(offsets, start.line, start.column)
                const endIndex =
                  block.startIndex +
                  lineColToIndex(offsets, end.line, end.column)

                context.report({
                  node: sourceCode.ast,
                  loc: {
                    start: sourceCode.getLocFromIndex(startIndex),
                    end: sourceCode.getLocFromIndex(endIndex),
                  },
                  messageId: "splitRule",
                })
                return
              }

              context.report({
                node: sourceCode.ast,
                messageId: "splitRule",
              })
            })
          }
        },
      }
    },
  },
}
