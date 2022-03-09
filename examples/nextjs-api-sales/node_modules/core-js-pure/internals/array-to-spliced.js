var lengthOfArrayLike = require('../internals/length-of-array-like');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');

var max = Math.max;
var min = Math.min;

// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toSpliced
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toSpliced
module.exports = function (O, C, args) {
  var start = args[0];
  var deleteCount = args[1];
  var len = lengthOfArrayLike(O);
  var actualStart = toAbsoluteIndex(start, len);
  var argumentsLength = args.length;
  var k = 0;
  var insertCount, actualDeleteCount, newLen, A;
  if (argumentsLength === 0) {
    insertCount = actualDeleteCount = 0;
  } else if (argumentsLength === 1) {
    insertCount = 0;
    actualDeleteCount = len - actualStart;
  } else {
    insertCount = argumentsLength - 2;
    actualDeleteCount = min(max(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
  }
  newLen = len + insertCount - actualDeleteCount;
  A = new C(newLen);

  for (; k < actualStart; k++) A[k] = O[k];
  for (; k < actualStart + insertCount; k++) A[k] = args[k - actualStart + 2];
  for (; k < newLen; k++) A[k] = O[k + actualDeleteCount - insertCount];

  return A;
};
