var util = require('util');
var sinon = require('sinon');
var test = require('tap').test;
var CronExpression = require('../lib/expression');

test('increment_on_first_itereation', function(t) {
  try {
    var clock = sinon.useFakeTimers();
    var fake_now = new Date('Tue Feb 21 2017 16:45:00');
    clock.tick(fake_now.getTime());
    var interval = CronExpression.parse('* * * * *');
    t.ok(interval, 'Interval parsed');
    var next = interval.next();
    t.ok(next, 'Found next scheduled interval');
    // Make sure next has incremented in 1 minute
    t.equal(fake_now.getTime() + 60000, next.getTime());
    clock.restore();
    t.end();
  } catch (err) {
    t.error(err, 'Interval parse error');
  }
});
