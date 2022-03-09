/**
 * @fileoverview Utility functions for JSX
 */

'use strict';

const estraverse = require('estraverse');
const elementType = require('jsx-ast-utils/elementType');

const astUtil = require('./ast');
const variableUtil = require('./variable');

// See https://github.com/babel/babel/blob/ce420ba51c68591e057696ef43e028f41c6e04cd/packages/babel-types/src/validators/react/isCompatTag.js
// for why we only test for the first character
const COMPAT_TAG_REGEX = /^[a-z]/;

/**
 * Checks if a node represents a DOM element according to React.
 * @param {object} node - JSXOpeningElement to check.
 * @returns {boolean} Whether or not the node corresponds to a DOM element.
 */
function isDOMComponent(node) {
  const name = elementType(node);
  return COMPAT_TAG_REGEX.test(name);
}

/**
 * Test whether a JSXElement is a fragment
 * @param {JSXElement} node
 * @param {string} reactPragma
 * @param {string} fragmentPragma
 * @returns {boolean}
 */
function isFragment(node, reactPragma, fragmentPragma) {
  const name = node.openingElement.name;

  // <Fragment>
  if (name.type === 'JSXIdentifier' && name.name === fragmentPragma) {
    return true;
  }

  // <React.Fragment>
  if (
    name.type === 'JSXMemberExpression'
    && name.object.type === 'JSXIdentifier'
    && name.object.name === reactPragma
    && name.property.type === 'JSXIdentifier'
    && name.property.name === fragmentPragma
  ) {
    return true;
  }

  return false;
}

/**
 * Checks if a node represents a JSX element or fragment.
 * @param {object} node - node to check.
 * @returns {boolean} Whether or not the node if a JSX element or fragment.
 */
function isJSX(node) {
  return node && ['JSXElement', 'JSXFragment'].indexOf(node.type) >= 0;
}

/**
 * Check if node is like `key={...}` as in `<Foo key={...} />`
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isJSXAttributeKey(node) {
  return node.type === 'JSXAttribute'
    && node.name
    && node.name.type === 'JSXIdentifier'
    && node.name.name === 'key';
}

/**
 * Check if value has only whitespaces
 * @param {string} value
 * @returns {boolean}
 */
function isWhiteSpaces(value) {
  return typeof value === 'string' ? /^\s*$/.test(value) : false;
}

/**
 * Check if the node is returning JSX or null
 *
 * @param {Function} isCreateElement Function to determine if a CallExpresion is
 *   a createElement one
 * @param {ASTNode} ASTnode The AST node being checked
 * @param {Context} context The context of `ASTNode`.
 * @param {Boolean} [strict] If true, in a ternary condition the node must return JSX in both cases
 * @param {Boolean} [ignoreNull] If true, null return values will be ignored
 * @returns {Boolean} True if the node is returning JSX or null, false if not
 */
function isReturningJSX(isCreateElement, ASTnode, context, strict, ignoreNull) {
  let found = false;
  astUtil.traverseReturns(ASTnode, context, (node) => {
    // Traverse return statement
    astUtil.traverse(node, {
      enter(childNode) {
        const setFound = () => {
          found = true;
          this.skip();
        };
        switch (childNode.type) {
          case 'FunctionExpression':
          case 'FunctionDeclaration':
          case 'ArrowFunctionExpression':
            // Do not traverse into inner function definitions
            return this.skip();
          case 'ConditionalExpression':
            if (!strict) break;
            if (isJSX(childNode.consequent) && isJSX(childNode.alternate)) {
              setFound();
            }
            this.skip();
            break;
          case 'LogicalExpression':
            if (!strict) break;
            if (isJSX(childNode.left) && isJSX(childNode.right)) {
              setFound();
            }
            this.skip();
            break;
          case 'JSXElement':
          case 'JSXFragment':
            setFound();
            break;
          case 'CallExpression':
            if (isCreateElement(childNode)) {
              setFound();
            }
            this.skip();
            break;
          case 'Literal':
            if (!ignoreNull && childNode.value === null) {
              setFound();
            }
            break;
          case 'Identifier': {
            const variable = variableUtil.findVariableByName(context, childNode.name);
            if (isJSX(variable)) {
              setFound();
            }
            break;
          }
          default:
        }
      },
    });

    return found && estraverse.VisitorOption.Break;
  });

  return found;
}

/**
 * Check if the node is returning only null values
 *
 * @param {Function} isCreateElement Function to determine if a CallExpresion is
 *   a createElement one
 * @param {ASTNode} ASTnode The AST node being checked
 * @param {Context} context The context of `ASTNode`.
 * @returns {Boolean} True if the node is returning only null values
 */
function isReturningOnlyNull(isCreateElement, ASTnode, context) {
  let found = false;
  let foundSomethingElse = false;
  astUtil.traverseReturns(ASTnode, context, (node) => {
    // Traverse return statement
    astUtil.traverse(node, {
      enter(childNode) {
        const setFound = () => {
          found = true;
          this.skip();
        };
        const setFoundSomethingElse = () => {
          foundSomethingElse = true;
          this.skip();
        };
        switch (childNode.type) {
          case 'ReturnStatement':
            break;
          case 'ConditionalExpression':
            if (childNode.consequent.value === null && childNode.alternate.value === null) {
              setFound();
            }
            break;
          case 'Literal':
            if (childNode.value === null) {
              setFound();
            }
            break;
          default:
            setFoundSomethingElse();
        }
      },
    });
  });

  return found && !foundSomethingElse;
}

module.exports = {
  isDOMComponent,
  isFragment,
  isJSX,
  isJSXAttributeKey,
  isWhiteSpaces,
  isReturningJSX,
  isReturningOnlyNull,
};
