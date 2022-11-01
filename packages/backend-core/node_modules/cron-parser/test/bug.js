var util = require('util');
var test = require('tap').test;
var CronExpression = require('../lib/expression');
var CronDate = require('../lib/date');


test('parse expression as UTC', function(t) {
  try {
    var options = {
      utc: true
    };

    var interval = CronExpression.parse('0 0 10 * * *', options);

    var date = interval.next();
    t.equal(date.getUTCHours(), 10, 'Correct UTC hour value');

    interval = CronExpression.parse('0 */5 * * * *', options);

    var date = interval.next(), now = new Date();
    now.setMinutes(now.getMinutes() + 5 - (now.getMinutes() % 5));
    t.equal(date.getHours(), now.getUTCHours(), 'Correct local time for 5 minute interval');

  } catch (err) {
    t.error(err, 'UTC parse error');
  }

  t.end();
});
