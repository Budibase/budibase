'use strict';
var getArgs = require('../');
var test = require('tape');

test('should work', function (t) {
  var ourFunc = getArgs(function (args) {
    t.deepEquals(args, [1, 2, 3, 4], 'should work');
    t.end();
  });
  ourFunc(1, 2, 3, 4);
});