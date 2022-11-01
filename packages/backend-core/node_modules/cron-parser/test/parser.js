var test = require('tap').test;
var CronParser = require('../lib/parser');

// Globals

test('load crontab file', function(t) {
  CronParser.parseFile(__dirname + '/crontab.example', function(err, result) {
    t.error(err, 'File read error');
    t.ok(result, 'Crontab parsed parsed');

    t.equal(Object.keys(result.variables).length, 2, 'variables length matches');
    t.equal(Object.keys(result.errors).length, 0, 'errors length matches');
    t.equal(result.expressions.length, 3, 'expressions length matches');

    // Parse expressions
    var next = null;

    t.equal(result.expressions[0].hasNext(), true);
    next = result.expressions[0].next();
    t.ok(next, 'first date');

    next = result.expressions[1].next();
    t.ok(next, 'second date');

    next = result.expressions[2].next();
    t.ok(next, 'third date');

    t.end();
  });
});

test('no next date', function(t) {
  var options = {
    currentDate: new Date(2014, 0, 1),
    endDate: new Date(2014, 0, 1)
  };

  try {
    var interval = CronParser.parseExpression('* * 2 * *', options);
    t.equal(interval.hasNext(), false);
  } catch (err) {
    t.error(err, 'Parse read error');
  }

  t.end();
});
