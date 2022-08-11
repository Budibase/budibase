'use strict';
var getArgs = require('../');
var test = require('tape');

test('should work with no args', function (t) {
  var ourFunc = getArgs(function (args) {
    t.deepEquals(args, [], 'should work');
    t.end();
  });
  ourFunc();
});