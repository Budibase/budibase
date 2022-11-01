var util = require('util');
var test = require('tap').test;
var expression = require('../lib/expression');

test('expression 31 of month', function(t) {
  try {
    var interval = expression.parse('0 0 31 * *');
    var i;
    var d;
    for (i = 0; i < 20; ++i) {
      d = interval.next();
    }
    t.end();
  } catch (err) {
    t.error(err, 'Interval parse error');
  }
});
