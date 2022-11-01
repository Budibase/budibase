// empty around comma

var test = require('tap').test;
var CronExpression = require('../lib/expression');

const options = {
  utc: true
};

test('both empty around comma', function (t) {
  t.throws(function () {
    CronExpression.parse('*/10 * * * * ,', options);
  }, new Error('Invalid list value format'));
  t.end();
});

test('one side empty around comma', function (t) {
  t.throws(function () {
    CronExpression.parse('*/10 * * * * ,2', options);
  }, new Error('Invalid list value format'));
  t.end();
});
