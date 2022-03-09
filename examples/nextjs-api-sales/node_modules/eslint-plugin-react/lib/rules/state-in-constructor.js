/**
 * @fileoverview Enforce the state initialization style to be either in a constructor or with a class property
 * @author Kanitkorn Sujautra
 */

'use strict';

const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  stateInitConstructor: 'State initialization should be in a constructor',
  stateInitClassProp: 'State initialization should be in a class property',
};

module.exports = {
  meta: {
    docs: {
      description: 'State initialization in an ES6 class component should be in a constructor',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('state-in-constructor'),
    },

    messages,

    schema: [{
      enum: ['always', 'never'],
    }],
  },

  create: Components.detect((context, components, utils) => {
    const option = context.options[0] || 'always';
    return {
      'ClassProperty, PropertyDefinition'(node) {
        if (
          option === 'always'
          && !node.static
          && node.key.name === 'state'
          && utils.getParentES6Component()
        ) {
          report(context, messages.stateInitConstructor, 'stateInitConstructor', {
            node,
          });
        }
      },
      AssignmentExpression(node) {
        if (
          option === 'never'
          && utils.isStateMemberExpression(node.left)
          && utils.inConstructor()
          && utils.getParentES6Component()
        ) {
          report(context, messages.stateInitClassProp, 'stateInitClassProp', {
            node,
          });
        }
      },
    };
  }),
};
