'use strict';
var getArgs = require('../');
var test = require('tape');
test('scope should be the same', function (t) {
  t.test('with call', function (t) {
    var foo = {};
    var ourFunc = getArgs(function (args) {
      t.deepEquals(args, [1, 2, 3, 4], 'args should be right');
      t.strictEquals(this, foo, 'scope should be the same');
      t.end();
    });
    ourFunc.call(foo, 1, 2, 3, 4);
  });
  test('with apply', function (t) {
    var foo = {};
    var ourFunc = getArgs(function (args) {
      t.deepEquals(args, [1, 2, 3, 4], 'args should be right');
      t.strictEquals(this, foo, 'scope should be the same');
      t.end();
    });
    ourFunc.apply(foo, [1, 2, 3, 4]);
  });
  test('with bind', function (t) {
    var foo = {};
    var ourFunc = getArgs(function (args) {
      t.deepEquals(args, [1, 2, 3, 4], 'args should be right');
      t.strictEquals(this, foo, 'scope should be the same');
      t.end();
    }).bind(foo, 1);
    ourFunc(2, 3, 4);
  });
});