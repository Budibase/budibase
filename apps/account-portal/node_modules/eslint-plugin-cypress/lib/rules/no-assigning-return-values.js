'use strict'

// safely get nested object property
function get (obj, propertyString = '') {
  const properties = propertyString.split('.')

  for (let i = 0; i < properties.length; i++) {
    const value = (obj || {})[properties[i]]

    if (value == null) return value

    obj = value
  }

  return obj
}

module.exports = {
  meta: {
    docs: {
      description: 'Prevent assigning return values of cy calls',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://on.cypress.io/best-practices#Assigning-Return-Values',
    },
    schema: [],
    messages: {
      unexpected: 'Do not assign the return value of a Cypress command',
    },
  },
  create (context) {
    return {
      VariableDeclaration (node) {
        if (node.declarations.some(isCypressCommandDeclaration)) {
          context.report({ node, messageId: 'unexpected' })
        }
      },
    }
  },
}

const allowedCommands = {
  now: true,
  spy: true,
  state: true,
  stub: true,
}

function isCypressCommandDeclaration (declarator) {
  let object = get(declarator, 'init.callee.object')

  if (!object) return

  while (object.callee) {
    object = object.callee.object

    if (!object) return
  }

  const commandName = get(declarator, 'init.callee.property.name')

  const parent = get(object, 'parent.property.name') || get(declarator, 'id.name')

  if (commandName && (allowedCommands[commandName] || allowedCommands[parent])) return

  return object.name === 'cy'
}
