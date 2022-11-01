var test = require('tap').test;
var CronExpression = require('../lib/expression');

test('prev should match correctly (issue #98) when milliseconds are greater than 0', function(t) {
  var options = {
    currentDate: new Date('2017-06-13T18:21:25.002Z')
  };

  var interval = CronExpression.parse('*/5 * * * * *', options);
  var prev = interval.prev();
  t.equal(prev.getSeconds(), 25);

  t.end();
});

test('prev should match correctly (issue #98) when milliseconds are equal to 0', function(t) {
  var interval = CronExpression.parse('59 59 23 * * *',{
    currentDate : new Date('2012-12-26 14:38:53')
  });

  [25, 24, 23, 22].forEach(function(date) {
    var prev = interval.prev();
    t.equal(prev.getFullYear(), 2012);
    t.equal(prev.getMonth(), 11);
    t.equal(prev.getDate(), date);
    t.equal(prev.getHours(), 23);
    t.equal(prev.getMinutes(), 59);
    t.equal(prev.getSeconds(), 59);
  });

  t.end();
});
