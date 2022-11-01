'use strict';

var test = require('tap').test;
var CronParser = require('../lib/parser');

test('stringify cron expression all stars no seconds', function (t) {

  try {
    var expected = '0 * * * * *';
    var interval = CronParser.parseExpression('* * * * *', {});
    var str = interval.stringify(true);
    t.equal(str, expected);
    str = CronParser.fieldsToExpression(interval.fields).stringify(true);
    t.equal(str, expected);

  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});

test('stringify cron expression all stars no seconds (discard seconds)', function (t) {

  try {
    var expected = '* * * * *';
    var interval = CronParser.parseExpression('* * * * *', {});
    var str = interval.stringify();
    t.equal(str, expected);
    str = CronParser.fieldsToExpression(interval.fields).stringify();
    t.equal(str, expected);

  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});

test('stringify cron expression all stars with seconds', function (t) {

  try {
    var expected = '* * * * * *';
    var interval = CronParser.parseExpression('* * * * * *', {});
    var str = interval.stringify(true);
    t.equal(str, expected);
    str = CronParser.fieldsToExpression(interval.fields).stringify(true);
    t.equal(str, expected);

  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});

test('stringify cron expression all stars with seconds (discard seconds)', function (t) {

  try {
    var expected = '* * * * *';
    var interval = CronParser.parseExpression('* * * * * *', {});
    var str = interval.stringify();
    t.equal(str, expected);
    str = CronParser.fieldsToExpression(interval.fields).stringify();
    t.equal(str, expected);

  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});

test('stringify cron expression', function (t) {

  try {
    var expected = '0 1,2,4-10,20-35/5,57 * * * *';
    var interval = CronParser.parseExpression('1,2,4-10,20-35/5,57 * * * *', {});
    var str = interval.stringify(true);
    t.equal(str, expected);
    str = CronParser.fieldsToExpression(interval.fields).stringify(true);
    t.equal(str, expected);

  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});

test('stringify cron expression (discard seconds)', function (t) {

  try {
    var expected = '1,2,4-10,20-35/5,57 * * * *';
    var interval = CronParser.parseExpression('1,2,4-10,20-35/5,57 * * * *', {});
    var str = interval.stringify();
    t.equal(str, expected);
    str = CronParser.fieldsToExpression(interval.fields).stringify();
    t.equal(str, expected);

  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});

test('stringify cron expression with star range step', function (t) {

  try {
    var expected = '0 */5 */2 * * *';
    var interval = CronParser.parseExpression('*/5 */2 */1 * *', {});
    var str = interval.stringify(true);
    t.equal(str, expected);
    str = CronParser.fieldsToExpression(interval.fields).stringify(true);
    t.equal(str, expected);

  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});

test('stringify cron expression with star range step (discard seconds)', function (t) {

  try {
    var expected = '*/5 */2 * * *';
    var interval = CronParser.parseExpression('*/5 */2 */1 * *', {});
    var str = interval.stringify();
    t.equal(str, expected);
    str = CronParser.fieldsToExpression(interval.fields).stringify();
    t.equal(str, expected);

  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});

test('stringify cron expression with semi range step', function (t) {

  try {
    var expected = '0 5/5 * * * *';
    var interval = CronParser.parseExpression('5/5 * * * *', {});
    var str = interval.stringify(true);
    t.equal(str, expected);
    str = CronParser.fieldsToExpression(interval.fields).stringify(true);
    t.equal(str, expected);

  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});

test('stringify cron expression with semi range step (discard seconds)', function (t) {

  try {
    var expected = '5/5 * * * *';
    var interval = CronParser.parseExpression('5/5 * * * *', {});
    var str = interval.stringify();
    t.equal(str, expected);
    str = CronParser.fieldsToExpression(interval.fields).stringify();
    t.equal(str, expected);

  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});

test('stringify cron expression with L', function (t) {

  try {
    var expected = '0 * * 1,4-10,L * *';
    var interval = CronParser.parseExpression('* * 1,4-10,L * *', {});
    var str = interval.stringify(true);
    t.equal(str, expected);
    str = CronParser.fieldsToExpression(interval.fields).stringify(true);
    t.equal(str, expected);

  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});

test('stringify cron expression with L (discard seconds)', function (t) {

  try {
    var expected = '* * 1,4-10,L * *';
    var interval = CronParser.parseExpression('* * 1,4-10,L * *', {});
    var str = interval.stringify();
    t.equal(str, expected);
    str = CronParser.fieldsToExpression(interval.fields).stringify();
    t.equal(str, expected);

  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});

test('stringify cron expression with weekday L', function (t) {

  try {
    var expected = '0 0 0 * * 1L';
    var interval = CronParser.parseExpression(expected, {});
    var str = interval.stringify(true);
    t.equal(str, expected);
    str = CronParser.fieldsToExpression(interval.fields).stringify(true);
    t.equal(str, expected);

  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});

test('stringify cron expression with multiple weekday, one of them with an L', function (t) {

  try {
    var expected = '0 0 0 * * 4,6L';
    var interval = CronParser.parseExpression(expected, {});
    var str = interval.stringify(true);
    t.equal(str, expected);
    str = CronParser.fieldsToExpression(interval.fields).stringify(true);
    t.equal(str, expected);

  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});

test('stringify cron expression with multiple weekday, two of them with an L', function (t) {

  try {
    var expected = '0 0 0 * * 1L,5L';
    var interval = CronParser.parseExpression(expected, {});
    var str = interval.stringify(true);
    t.equal(str, expected);
    str = CronParser.fieldsToExpression(interval.fields).stringify(true);
    t.equal(str, expected);

  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});

test('stringify cron expression with wildcard day of month and single month value', function (t) {

  try {
    var expected = '* * * 4 *';
    var interval = CronParser.parseExpression(expected, {});
    var str = interval.stringify();
    t.equal(str, expected);
  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});

test('stringify cron expression with wildcard day of month and month rangee', function (t) {

  try {
    var expected = '* * * 4-6 *';
    var interval = CronParser.parseExpression(expected, {});
    var str = interval.stringify();
    t.equal(str, expected);
  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});


test('stringify cron expression with day of month range and single month value', function (t) {

  try {
    var expected = '* * 1-25 4 *';
    var interval = CronParser.parseExpression(expected, {});
    var str = interval.stringify();
    t.equal(str, expected);
  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});

test('stringify from fields out of order', function (t) {

  try {
    var expected = '1-5 1 1 1 1 1';
    var str = CronParser.fieldsToExpression({
      second: [5,2,1,4,3],
      minute: [1],
      hour: [1],
      month: [1],
      dayOfMonth: [1],
      dayOfWeek: [1],
    }).stringify(true);
    t.equal(str, expected);
  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});

test('stringify from fields out of order (discard seconds)', function (t) {

  try {
    var expected = '1 1 1 1 1';
    var str = CronParser.fieldsToExpression({
      second: [5,2,1,4,3],
      minute: [1],
      hour: [1],
      month: [1],
      dayOfMonth: [1],
      dayOfWeek: [1],
    }).stringify();
    t.equal(str, expected);
  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});

test('validation error - missing seconds', function (t) {
  t.throws(function () {
    CronParser.fieldsToExpression({
      minute: [1],
      hour: [1],
      dayOfMonth: [1],
      month: [1],
      dayOfWeek: [1],
    });
  }, new Error('Validation error, Field second is missing'));

  t.end();
});

test('validation error - empty seconds', function (t) {
  t.throws(function () {
    CronParser.fieldsToExpression({
      second: [],
      minute: [1],
      hour: [1],
      dayOfMonth: [1],
      month: [1],
      dayOfWeek: [1],
    });
  }, new Error('Validation error, Field second contains no values'));

  t.end();
});

test('validation error - missing values - empty array', function (t) {
  t.throws(function () {
    CronParser.fieldsToExpression({
      second: [1],
      minute: [],
      hour: [1],
      dayOfMonth: [1],
      month: [1],
      dayOfWeek: [1],
    });
  }, new Error('Validation error, Field minute contains no values'));

  t.end();
});

test('validation error - missing values', function (t) {
  t.throws(function () {
    CronParser.fieldsToExpression({
      second: [1],
      hour: [1],
      dayOfMonth: [1],
      month: [1],
      dayOfWeek: [1],
    });
  }, new Error('Validation error, Field minute is missing'));

  t.end();
});

test('validation error - range error', function (t) {
  t.throws(function () {
    CronParser.fieldsToExpression({
      second: [-1, 1, 0],
      minute: [1],
      hour: [1],
      dayOfMonth: [1],
      month: [1],
      dayOfWeek: [1],
    });
  }, new Error('Constraint error, got value -1 expected range 0-59'));

  t.end();
});

test('validation error - bad chars error', function (t) {
  t.throws(function () {
    CronParser.fieldsToExpression({
      second: [0, 'R'],
      minute: [1],
      hour: [1],
      dayOfMonth: [1],
      month: [1],
      dayOfWeek: [1],
    });
  }, new Error('Constraint error, got value R expected range 0-59'));

  t.end();
});

test('validation error - duplicates', function (t) {
  t.throws(function () {
    CronParser.fieldsToExpression({
      second: [1, 1],
      minute: [1],
      hour: [1],
      dayOfMonth: [1],
      month: [1],
      dayOfWeek: [1],
    });
  }, new Error('Validation error, Field second contains duplicate values'));

  t.end();
});
