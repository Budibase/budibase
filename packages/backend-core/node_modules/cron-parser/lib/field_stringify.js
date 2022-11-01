'use strict';

var compactField = require('./field_compactor');

function stringifyField(arr, min, max) {
  var ranges = compactField(arr);
  if (ranges.length === 1) {
    var singleRange = ranges[0];
    var step = singleRange.step;
    if (step === 1 && singleRange.start === min && singleRange.end === max) {
      return '*';
    }
    if (step !== 1 && singleRange.start === min && singleRange.end === max - step + 1) {
      return '*/' + step;
    }
  }
  var resultArr = [];
  for (var i = 0, l = ranges.length; i < l; ++i) {
    var range = ranges[i];
    if (range.count === 1) {
      resultArr.push(range.start);
    } else {
      var step = range.step;
      if (step === 1) {
        resultArr.push(range.start + '-' + range.end);
      } else {
        if (range.end === max - step + 1) {
          resultArr.push(range.start + '/' + step);
        } else {
          resultArr.push(range.start + '-' + range.end + '/' + step);
        }
      }
    }
  }
  return resultArr.join(',');
}

module.exports = stringifyField;
