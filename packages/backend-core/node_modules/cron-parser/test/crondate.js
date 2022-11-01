// empty around comma

var test = require('tap').test;
var CronDate = require('../lib/date');

test('is the last weekday of the month', function (t) {
  // Last monday of septhember
  var date = new CronDate(new Date(2021, 8, 27));
  t.equal(date.isLastWeekdayOfMonth(), true);

  // Second-to-last monday of septhember
  var date = new CronDate(new Date(2021, 8, 20));
  t.equal(date.isLastWeekdayOfMonth(), false);

  t.end();
});
