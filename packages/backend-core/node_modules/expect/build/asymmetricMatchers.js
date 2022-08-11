'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.stringNotMatching =
  exports.stringNotContaining =
  exports.stringMatching =
  exports.stringContaining =
  exports.objectNotContaining =
  exports.objectContaining =
  exports.notCloseTo =
  exports.closeTo =
  exports.arrayNotContaining =
  exports.arrayContaining =
  exports.anything =
  exports.any =
  exports.AsymmetricMatcher =
    void 0;

var matcherUtils = _interopRequireWildcard(require('jest-matcher-utils'));

var _jasmineUtils = require('./jasmineUtils');

var _jestMatchersObject = require('./jestMatchersObject');

var _utils = require('./utils');

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return {default: obj};
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

var global = (function () {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  } else if (typeof global !== 'undefined') {
    return global;
  } else if (typeof self !== 'undefined') {
    return self;
  } else if (typeof window !== 'undefined') {
    return window;
  } else {
    return Function('return this')();
  }
})();

var Symbol = global['jest-symbol-do-not-touch'] || global.Symbol;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

const utils = Object.freeze({
  ...matcherUtils,
  iterableEquality: _utils.iterableEquality,
  subsetEquality: _utils.subsetEquality
});

class AsymmetricMatcher {
  constructor(sample, inverse = false) {
    _defineProperty(this, '$$typeof', Symbol.for('jest.asymmetricMatcher'));

    this.sample = sample;
    this.inverse = inverse;
  }

  getMatcherContext() {
    return {
      ...(0, _jestMatchersObject.getState)(),
      equals: _jasmineUtils.equals,
      isNot: this.inverse,
      utils
    };
  }
}

exports.AsymmetricMatcher = AsymmetricMatcher;

class Any extends AsymmetricMatcher {
  constructor(sample) {
    if (typeof sample === 'undefined') {
      throw new TypeError(
        'any() expects to be passed a constructor function. ' +
          'Please pass one or use anything() to match any object.'
      );
    }

    super(sample);
  }

  asymmetricMatch(other) {
    if (this.sample == String) {
      return typeof other == 'string' || other instanceof String;
    }

    if (this.sample == Number) {
      return typeof other == 'number' || other instanceof Number;
    }

    if (this.sample == Function) {
      return typeof other == 'function' || other instanceof Function;
    }

    if (this.sample == Boolean) {
      return typeof other == 'boolean' || other instanceof Boolean;
    }

    if (this.sample == BigInt) {
      return typeof other == 'bigint' || other instanceof BigInt;
    }

    if (this.sample == Symbol) {
      return typeof other == 'symbol' || other instanceof Symbol;
    }

    if (this.sample == Object) {
      return typeof other == 'object';
    }

    return other instanceof this.sample;
  }

  toString() {
    return 'Any';
  }

  getExpectedType() {
    if (this.sample == String) {
      return 'string';
    }

    if (this.sample == Number) {
      return 'number';
    }

    if (this.sample == Function) {
      return 'function';
    }

    if (this.sample == Object) {
      return 'object';
    }

    if (this.sample == Boolean) {
      return 'boolean';
    }

    return (0, _jasmineUtils.fnNameFor)(this.sample);
  }

  toAsymmetricMatcher() {
    return 'Any<' + (0, _jasmineUtils.fnNameFor)(this.sample) + '>';
  }
}

class Anything extends AsymmetricMatcher {
  asymmetricMatch(other) {
    return !(0, _jasmineUtils.isUndefined)(other) && other !== null;
  }

  toString() {
    return 'Anything';
  } // No getExpectedType method, because it matches either null or undefined.

  toAsymmetricMatcher() {
    return 'Anything';
  }
}

class ArrayContaining extends AsymmetricMatcher {
  constructor(sample, inverse = false) {
    super(sample, inverse);
  }

  asymmetricMatch(other) {
    if (!Array.isArray(this.sample)) {
      throw new Error(
        `You must provide an array to ${this.toString()}, not '` +
          typeof this.sample +
          "'."
      );
    }

    const result =
      this.sample.length === 0 ||
      (Array.isArray(other) &&
        this.sample.every(item =>
          other.some(another => (0, _jasmineUtils.equals)(item, another))
        ));
    return this.inverse ? !result : result;
  }

  toString() {
    return `Array${this.inverse ? 'Not' : ''}Containing`;
  }

  getExpectedType() {
    return 'array';
  }
}

class ObjectContaining extends AsymmetricMatcher {
  constructor(sample, inverse = false) {
    super(sample, inverse);
  }

  asymmetricMatch(other) {
    if (typeof this.sample !== 'object') {
      throw new Error(
        `You must provide an object to ${this.toString()}, not '` +
          typeof this.sample +
          "'."
      );
    }

    let result = true;

    for (const property in this.sample) {
      if (
        !(0, _jasmineUtils.hasProperty)(other, property) ||
        !(0, _jasmineUtils.equals)(this.sample[property], other[property])
      ) {
        result = false;
        break;
      }
    }

    return this.inverse ? !result : result;
  }

  toString() {
    return `Object${this.inverse ? 'Not' : ''}Containing`;
  }

  getExpectedType() {
    return 'object';
  }
}

class StringContaining extends AsymmetricMatcher {
  constructor(sample, inverse = false) {
    if (!(0, _jasmineUtils.isA)('String', sample)) {
      throw new Error('Expected is not a string');
    }

    super(sample, inverse);
  }

  asymmetricMatch(other) {
    const result =
      (0, _jasmineUtils.isA)('String', other) && other.includes(this.sample);
    return this.inverse ? !result : result;
  }

  toString() {
    return `String${this.inverse ? 'Not' : ''}Containing`;
  }

  getExpectedType() {
    return 'string';
  }
}

class StringMatching extends AsymmetricMatcher {
  constructor(sample, inverse = false) {
    if (
      !(0, _jasmineUtils.isA)('String', sample) &&
      !(0, _jasmineUtils.isA)('RegExp', sample)
    ) {
      throw new Error('Expected is not a String or a RegExp');
    }

    super(new RegExp(sample), inverse);
  }

  asymmetricMatch(other) {
    const result =
      (0, _jasmineUtils.isA)('String', other) && this.sample.test(other);
    return this.inverse ? !result : result;
  }

  toString() {
    return `String${this.inverse ? 'Not' : ''}Matching`;
  }

  getExpectedType() {
    return 'string';
  }
}

class CloseTo extends AsymmetricMatcher {
  constructor(sample, precision = 2, inverse = false) {
    if (!(0, _jasmineUtils.isA)('Number', sample)) {
      throw new Error('Expected is not a Number');
    }

    if (!(0, _jasmineUtils.isA)('Number', precision)) {
      throw new Error('Precision is not a Number');
    }

    super(sample);

    _defineProperty(this, 'precision', void 0);

    this.inverse = inverse;
    this.precision = precision;
  }

  asymmetricMatch(other) {
    if (!(0, _jasmineUtils.isA)('Number', other)) {
      return false;
    }

    let result = false;

    if (other === Infinity && this.sample === Infinity) {
      result = true; // Infinity - Infinity is NaN
    } else if (other === -Infinity && this.sample === -Infinity) {
      result = true; // -Infinity - -Infinity is NaN
    } else {
      result =
        Math.abs(this.sample - other) < Math.pow(10, -this.precision) / 2;
    }

    return this.inverse ? !result : result;
  }

  toString() {
    return `Number${this.inverse ? 'Not' : ''}CloseTo`;
  }

  getExpectedType() {
    return 'number';
  }
}

const any = expectedObject => new Any(expectedObject);

exports.any = any;

const anything = () => new Anything();

exports.anything = anything;

const arrayContaining = sample => new ArrayContaining(sample);

exports.arrayContaining = arrayContaining;

const arrayNotContaining = sample => new ArrayContaining(sample, true);

exports.arrayNotContaining = arrayNotContaining;

const objectContaining = sample => new ObjectContaining(sample);

exports.objectContaining = objectContaining;

const objectNotContaining = sample => new ObjectContaining(sample, true);

exports.objectNotContaining = objectNotContaining;

const stringContaining = expected => new StringContaining(expected);

exports.stringContaining = stringContaining;

const stringNotContaining = expected => new StringContaining(expected, true);

exports.stringNotContaining = stringNotContaining;

const stringMatching = expected => new StringMatching(expected);

exports.stringMatching = stringMatching;

const stringNotMatching = expected => new StringMatching(expected, true);

exports.stringNotMatching = stringNotMatching;

const closeTo = (expected, precision) => new CloseTo(expected, precision);

exports.closeTo = closeTo;

const notCloseTo = (expected, precision) =>
  new CloseTo(expected, precision, true);

exports.notCloseTo = notCloseTo;
