'use strict'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow using of \'force: true\' option for click and type calls',
      category: 'Possible Errors',
      recommended: false,
    },
    fixable: null, // or "code" or "whitespace"
    schema: [],
    messages: {
      unexpected: 'Do not use force on click and type calls',
    },
  },

  create (context) {

    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    function isCallingClickOrType (node) {
      const allowedMethods = ['click', 'dblclick', 'type', 'trigger', 'check', 'rightclick', 'focus', 'select']

      return node.property && node.property.type === 'Identifier' &&
             allowedMethods.includes(node.property.name)
    }

    function isCypressCall (node) {
      return node.callee.type === 'MemberExpression' &&
        node.callee.object.type === 'Identifier' &&
        node.callee.object.name === 'cy'
    }

    function hasOptionForce (node) {

      return node.arguments && node.arguments.length &&
      node.arguments.some((arg) => {
        return arg.type === 'ObjectExpression' && arg.properties.some((propNode) => propNode.key && propNode.key.name === 'force')
      })
    }

    function deepCheck (node, checkFunc) {
      let currentNode = node

      while (currentNode.parent) {

        if (checkFunc(currentNode.parent)) {
          return true
        }

        currentNode = currentNode.parent
      }

      return false
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {

      CallExpression (node) {
        if (isCypressCall(node) && deepCheck(node, isCallingClickOrType) && deepCheck(node, hasOptionForce)) {
          context.report({ node, messageId: 'unexpected' })
        }
      },

    }
  },
}
