"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsxAstUtils = require("jsx-ast-utils");

var _schemas = require("../util/schemas");

/**
 * @fileoverview Enforce html element has lang prop.
 * @author Ethan Cohen
 */
// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------
var errorMessage = '<html> elements must have the lang prop.';
var schema = (0, _schemas.generateObjSchema)();
var _default = {
  meta: {
    docs: {
      url: 'https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/html-has-lang.md'
    },
    schema: [schema]
  },
  create: function create(context) {
    return {
      JSXOpeningElement: function JSXOpeningElement(node) {
        var type = (0, _jsxAstUtils.elementType)(node);

        if (type && type !== 'html') {
          return;
        }

        var lang = (0, _jsxAstUtils.getPropValue)((0, _jsxAstUtils.getProp)(node.attributes, 'lang'));

        if (lang) {
          return;
        }

        context.report({
          node,
          message: errorMessage
        });
      }
    };
  }
};
exports["default"] = _default;
module.exports = exports.default;