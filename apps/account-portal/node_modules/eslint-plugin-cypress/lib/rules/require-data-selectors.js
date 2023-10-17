'use strict'

module.exports = {
  meta: {
    docs: {
      description: 'Use data-* attributes to provide context to your selectors and insulate them from CSS or JS changes https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements',
      category: 'Possible Errors',
      recommended: false,
      url: 'https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements',
    },
    schema: [],
    messages: {
      unexpected: 'use data-* attribute selectors instead of classes or tag names',
    },
  },

  create (context) {
    return {
      CallExpression (node) {
        if (isCallingCyGet(node) && !isDataArgument(node)) {
          context.report({ node, messageId: 'unexpected' })
        }
      },
    }
  },
}

function isCallingCyGet (node) {
  return node.callee.type === 'MemberExpression' &&
         node.callee.object.type === 'Identifier' &&
         node.callee.object.name === 'cy' &&
         node.callee.property.type === 'Identifier' &&
         node.callee.property.name === 'get'
}

function isDataArgument (node) {
  return node.arguments.length > 0 &&
    (
      (node.arguments[0].type === 'Literal' && isAliasOrDataSelector(String(node.arguments[0].value))) ||
      (node.arguments[0].type === 'TemplateLiteral' && isAliasOrDataSelector(String(node.arguments[0].quasis[0].value.cooked)))
    )
}

function isAliasOrDataSelector (selector) {
  return ['[data-', '@'].some(function (validValue) {
    return selector.startsWith(validValue)
  })
}
