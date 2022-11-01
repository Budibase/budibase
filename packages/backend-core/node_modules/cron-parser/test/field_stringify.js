'use strict';

var test = require('tap').test;
var stringifyField = require('../lib/field_stringify');

test('stringify astrix', function (t) {
  try {
    var str = stringifyField([1, 2, 3, 4], 1, 4);
    t.equal(str, '*');
  } catch (err) {
    t.error(err, 'stringify field error');
  }
  t.end();
});

test('stringify astrix step', function (t) {
  try {
    var str = stringifyField([0, 2, 4, 6], 0, 7);
    t.equal(str, '*/2');
  } catch (err) {
    t.error(err, 'stringify field error');
  }
  t.end();
});

test('stringify single value', function (t) {
  try {
    var str = stringifyField([2], 0, 7);
    t.equal(str, '2');
  } catch (err) {
    t.error(err, 'stringify field error');
  }
  t.end();
});

test('stringify multiple single values', function (t) {
  try {
    var str = stringifyField([2, 5, 9], 0, 7);
    t.equal(str, '2,5,9');
  } catch (err) {
    t.error(err, 'stringify field error');
  }
  t.end();
});

test('stringify range', function (t) {
  try {
    var str = stringifyField([2, 3, 4], 0, 7);
    t.equal(str, '2-4');
  } catch (err) {
    t.error(err, 'stringify field error');
  }
  t.end();
});

test('stringify range step', function (t) {
  try {
    var str = stringifyField([2, 4, 6], 0, 8);
    t.equal(str, '2-6/2');
  } catch (err) {
    t.error(err, 'stringify field error');
  }
  t.end();
});

test('stringify semi range step', function (t) {
  try {
    var str = stringifyField([4, 6, 8], 0, 9);
    t.equal(str, '4/2');
  } catch (err) {
    t.error(err, 'stringify field error');
  }
  t.end();
});

test('stringify multi types', function (t) {
  try {
    var str = stringifyField([1, 2, 4, 5, 6, 7, 8, 9, 10, 20, 25, 30, 35, 57], 0, 59);
    t.equal(str, '1,2,4-10,20-35/5,57');
  } catch (err) {
    t.error(err, 'stringify field error');
  }
  t.end();
});
