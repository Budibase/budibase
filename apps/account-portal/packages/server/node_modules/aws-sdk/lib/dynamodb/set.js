var util = require('../core').util;
var typeOf = require('./types').typeOf;

/**
 * @api private
 */
var memberTypeToSetType = {
  'String': 'String',
  'Number': 'Number',
  'NumberValue': 'Number',
  'Binary': 'Binary'
};

/**
 * @api private
 */
var DynamoDBSet = util.inherit({

  constructor: function Set(list, options) {
    options = options || {};
    this.wrapperName = 'Set';
    this.initialize(list, options.validate);
  },

  initialize: function(list, validate) {
    var self = this;
    self.values = [].concat(list);
    self.detectType();
    if (validate) {
      self.validate();
    }
  },

  detectType: function() {
    this.type = memberTypeToSetType[typeOf(this.values[0])];
    if (!this.type) {
      throw util.error(new Error(), {
        code: 'InvalidSetType',
        message: 'Sets can contain string, number, or binary values'
      });
    }
  },

  validate: function() {
    var self = this;
    var length = self.values.length;
    var values = self.values;
    for (var i = 0; i < length; i++) {
      if (memberTypeToSetType[typeOf(values[i])] !== self.type) {
        throw util.error(new Error(), {
          code: 'InvalidType',
          message: self.type + ' Set contains ' + typeOf(values[i]) + ' value'
        });
      }
    }
  },

  /**
   * Render the underlying values only when converting to JSON.
   */
  toJSON: function() {
    var self = this;
    return self.values;
  }

});

/**
 * @api private
 */
module.exports = DynamoDBSet;
