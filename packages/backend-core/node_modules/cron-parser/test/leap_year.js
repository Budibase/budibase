var util = require('util');
var test = require('tap').test;
var expression = require('../lib/expression');

test('leap year', function(t) {
  try {
    var interval = expression.parse('0 0 29 2 *');
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
