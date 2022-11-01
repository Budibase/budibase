var test = require('tap').test;
var CronExpression = require('../lib/expression');
var CronDate = require('../lib/date');

test('empty expression test', function(t) {
  try {
    var interval = CronExpression.parse('');
    t.ok(interval, 'Interval parsed');

    var date = new CronDate();
    date.addMinute();

    var next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.equal(next.getMinutes(), date.getMinutes(), 'Schedule matches');

    t.end();
  } catch (err) {
    t.error(err, 'Interval parse error');
  }
});

test('default expression test', function(t) {
  try {
    var interval = CronExpression.parse('* * * * *');
    t.ok(interval, 'Interval parsed');

    var date = new CronDate();
    date.addMinute();

    var next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.equal(next.getMinutes(), date.getMinutes(), 'Schedule matches');

  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('default expression (tab separate) test', function(t) {
  try {
    var interval = CronExpression.parse('*	*	*	*	*');
    t.ok(interval, 'Interval parsed');

    var date = new CronDate();
    date.addMinute();

    var next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.equal(next.getMinutes(), date.getMinutes(), 'Schedule matches');

  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('default expression (multi-space separated) test 1', function(t) {
  try {
    var interval = CronExpression.parse('* \t*\t\t  *\t   *  \t\t*');
    t.ok(interval, 'Interval parsed');

    var date = new CronDate();
    date.addMinute();

    var next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.equal(next.getMinutes(), date.getMinutes(), 'Schedule matches');

  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});


test('default expression (multi-space separated) test 1', function(t) {
  try {
    var interval = CronExpression.parse('* \t    *\t \t  *   *  \t \t  *');
    t.ok(interval, 'Interval parsed');

    var date = new CronDate();
    date.addMinute();

    var next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.equal(next.getMinutes(), date.getMinutes(), 'Schedule matches');

  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('value out of the range', function(t) {
  t.throws(function() {
    CronExpression.parse('61 * * * * *');
  }, new Error('Constraint error, got value 61 expected range 0-59'));

  t.end();
});

test('second value out of the range', function(t) {
  t.throws(function() {
    CronExpression.parse('-1 * * * * *');
  }, new Error('Constraint error, got value -1 expected range 0-59'));

  t.end();
});

test('invalid range', function(t) {
  t.throws(function() {
    CronExpression.parse('- * * * * *');
  }, new Error('Invalid range: -'));

  t.end();
});

test('minute value out of the range', function(t) {
  t.throws(function() {
    CronExpression.parse('* 32,72 * * * *');
  }, new Error('Constraint error, got value 72 expected range 0-59'));

  t.end();
});

test('hour value out of the range', function(t) {
  t.throws(function() {
    CronExpression.parse('* * 12-36 * * *');
  }, new Error('Constraint error, got range 12-36 expected range 0-23'));

  t.end();
});


test('day of the month value out of the range', function(t) {
  t.throws(function() {
    CronExpression.parse('* * * 10-15,40 * *');
  }, ('Constraint error, got value 40 expected range 1-31'));

  t.end();
});

test('month value out of the range', function(t) {
  t.throws(function() {
    CronExpression.parse('* * * * */10,12-13 *');
  }, new Error('Constraint error, got range 12-13 expected range 1-12'));

  t.end();
});

test('day of the week value out of the range', function(t) {
  t.throws(function() {
    CronExpression.parse('* * * * * 9');
  }, new Error('Constraint error, got value 9 expected range 0-7'));

  t.end();
});

test('invalid expression that contains too many fields', function (t) {
  t.throws(function() {
    CronExpression.parse('* * * * * * * *ASD');
  }, new Error('Invalid cron expression'));

  t.end();
});

test('invalid explicit day of month definition', function(t) {
  t.throws(function() {
    const iter = CronExpression.parse('0 0 31 4 *');
    iter.next();
  }, new Error('Invalid explicit day of month definition'));

  t.end();
});

test('incremental minutes expression test', function(t) {
  try {
    var interval = CronExpression.parse('*/3 * * * *');
    t.ok(interval, 'Interval parsed');

    var next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.equal(next.getMinutes() % 3, 0, 'Schedule matches');
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('fixed expression test', function(t) {
  try {
    var interval = CronExpression.parse('10 2 12 8 0');
    t.ok(interval, 'Interval parsed');

    var next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDay() === 0 || next.getDate() === 12, 'Day or day of Month matches');
    t.equal(next.getMonth(), 7, 'Month matches');
    t.equal(next.getHours(), 2, 'Hour matches');
    t.equal(next.getMinutes(), 10, 'Minute matches');
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('invalid characters test - symbol', function(t) {
  t.throws(function() {
    CronExpression.parse('10 ! 12 8 0');
  }, new Error('Invalid characters, got value: !'));

  t.end();
});

test('invalid characters test - letter', function(t) {
  t.throws(function() {
    CronExpression.parse('10 x 12 8 0');
  }, new Error('Invalid characters, got value: x'));

  t.end();
});

test('invalid characters test - parentheses', function(t) {
  t.throws(function() {
    CronExpression.parse('10 ) 12 8 0');
  }, new Error('Invalid characters, got value: )'));

  t.end();
});

test('interval with invalid characters test', function(t) {
  t.throws(function() {
    CronExpression.parse('10 */A 12 8 0');
  }, new Error('Invalid characters, got value: */A'));

  t.end();
});

test('range with invalid characters test', function(t) {
  t.throws(function() {
    CronExpression.parse('10 0-z 12 8 0');
  }, new Error('Invalid characters, got value: 0-z'));

  t.end();
});

test('group with invalid characters test', function(t) {
  t.throws(function() {
    CronExpression.parse('10 0,1,z 12 8 0');
  }, new Error('Invalid characters, got value: 0,1,z'));

  t.end();
});

test('invalid expression which has repeat 0 times', function(t) {
  t.throws(function() {
    CronExpression.parse('0 */0 * * *');
  }, new Error('Constraint error, cannot repeat at every 0 time.'));

  t.end();
});

test('invalid expression which has repeat negative number times', function(t) {
  t.throws(function() {
    CronExpression.parse('0 */-5 * * *');
  }, new Error('Constraint error, cannot repeat at every -5 time.'));

  t.end();
});

test('range test with value and repeat (second)', function(t) {
  var options = {
    currentDate: new CronDate('Wed, 26 Dec 2012 14:38:53')
  };
  var interval = CronExpression.parse('0/30 * * * * ?', options);
  t.ok(interval, 'Interval parsed');

  var next = interval.next();
  t.equal(next.getSeconds(), 0);

  next = interval.next();
  t.equal(next.getSeconds(), 30);

  next = interval.next();
  t.equal(next.getSeconds(), 0);

  t.end();
});

test('range test with value and repeat (minute)', function(t) {
  var options = {
    currentDate: new CronDate('Wed, 26 Dec 2012 14:38:53')
  };
  var interval = CronExpression.parse('6/23 * * * *', options);
  t.ok(interval, 'Interval parsed');

  var next = interval.next();
  t.equal(next.getMinutes(), 52);

  next = interval.next();
  t.equal(next.getMinutes(), 6);

  next = interval.next();
  t.equal(next.getMinutes(), 29);

  next = interval.next();
  t.equal(next.getMinutes(), 52);

  t.end();
});

test('range test with iterator', function(t) {
  try {
    var interval = CronExpression.parse('10-30 2 12 8 0');
    t.ok(interval, 'Interval parsed');

    var intervals = interval.iterate(20);
    t.ok(intervals, 'Found intervals');

    for (var i = 0, c = intervals.length; i < c; i++) {
      var next = intervals[i];

      t.ok(next, 'Found next scheduled interval');
      t.ok(next.getDay() === 0 || next.getDate() === 12, 'Day or day of month matches');
      t.equal(next.getMonth(), 7, 'Month matches');
      t.equal(next.getHours(), 2, 'Hour matches');
      t.equal(next.getMinutes(), 10 + i, 'Minute matches');
    }
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('incremental range test with iterator', function(t) {
  try {
    var interval = CronExpression.parse('10-30/2 2 12 8 0');
    t.ok(interval, 'Interval parsed');

    var intervals = interval.iterate(10);
    t.ok(intervals, 'Found intervals');

    for (var i = 0, c = intervals.length; i < c; i++) {
      var next = intervals[i];

      t.ok(next, 'Found next scheduled interval');
      t.ok(next.getDay() === 0 || next.getDate() === 12, 'Day or day of month matches');
      t.equal(next.getMonth(), 7, 'Month matches');
      t.equal(next.getHours(), 2, 'Hour matches');
      t.equal(next.getMinutes(), 10 + (i * 2), 'Minute matches');
    }
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('predefined expression', function(t) {
  try {
    var interval = CronExpression.parse('@yearly');
    t.ok(interval, 'Interval parsed');

    var date = new CronDate();
    date.addYear();

    var next = interval.next();
    t.ok(next, 'Found next scheduled interval');

    t.equal(next.getFullYear(), date.getFullYear(), 'Year matches');
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('expression limited with start and end date', function(t) {
  try {
    var options = {
      currentDate: new CronDate('Wed, 26 Dec 2012 14:38:53'),
      startDate: new CronDate('Wed, 26 Dec 2012 12:40:00'),
      endDate: new CronDate('Wed, 26 Dec 2012 16:40:00')
    };

    var interval = CronExpression.parse('*/20 * * * *', options);
    t.ok(interval, 'Interval parsed');

    var dates = interval.iterate(10);
    t.equal(dates.length, 7, 'Dates count matches for positive iteration');

    interval.reset();

    var dates = interval.iterate(-10);
    t.equal(dates.length, 6, 'Dates count matches for negative iteration');

    interval.reset();

    // Forward iteration
    var next = interval.next();
    t.equal(next.getHours(), 14, 'Hour matches');
    t.equal(next.getMinutes(), 40, 'Minute matches');

    next = interval.next();
    t.equal(next.getHours(), 15, 'Hour matches');
    t.equal(next.getMinutes(), 0, 'Minute matches');

    next = interval.next();
    t.equal(next.getHours(), 15, 'Hour matches');
    t.equal(next.getMinutes(), 20, 'Minute matches');

    next = interval.next();
    t.equal(next.getHours(), 15, 'Hour matches');
    t.equal(next.getMinutes(), 40, 'Minute matches');

    next = interval.next();
    t.equal(next.getHours(), 16, 'Hour matches');
    t.equal(next.getMinutes(), 0, 'Minute matches');

    next = interval.next();
    t.equal(next.getHours(), 16, 'Hour matches');
    t.equal(next.getMinutes(), 20, 'Minute matches');

    next = interval.next();
    t.equal(next.getHours(), 16, 'Hour matches');
    t.equal(next.getMinutes(), 40, 'Minute matches');

    try {
      interval.next();
      t.ok(false, 'Should fail');
    } catch (e) {
      t.ok(true, 'Failed as expected');
    }

    next = interval.prev();
    t.equal(next.getHours(), 16, 'Hour matches');
    t.equal(next.getMinutes(), 20, 'Minute matches');

    interval.reset();

    // Backward iteration
    var prev = interval.prev();
    t.equal(prev.getHours(), 14, 'Hour matches');
    t.equal(prev.getMinutes(), 20, 'Minute matches');

    prev = interval.prev();
    t.equal(prev.getHours(), 14, 'Hour matches');
    t.equal(prev.getMinutes(), 0, 'Minute matches');

    prev = interval.prev();
    t.equal(prev.getHours(), 13, 'Hour matches');
    t.equal(prev.getMinutes(), 40, 'Minute matches');

    prev = interval.prev();
    t.equal(prev.getHours(), 13, 'Hour matches');
    t.equal(prev.getMinutes(), 20, 'Minute matches');

    prev = interval.prev();
    t.equal(prev.getHours(), 13, 'Hour matches');
    t.equal(prev.getMinutes(), 0, 'Minute matches');

    prev = interval.prev();
    t.equal(prev.getHours(), 12, 'Hour matches');
    t.equal(prev.getMinutes(), 40, 'Minute matches');

    try {
      interval.prev();
      t.ok(false, 'Should fail');
    } catch (e) {
      t.ok(true, 'Failed as expected');
    }
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('reset to given date', function(t){
  try {
    var options = {
      currentDate: new CronDate('Wed, 26 Dec 2012 14:38:53')
    };

    var interval = CronExpression.parse('*/20 * * * *', options);
    t.ok(interval, 'Interval parsed');

    // Forward iteration
    var next = interval.next();
    t.equal(next.getHours(), 14, 'Hour matches');
    t.equal(next.getMinutes(), 40, 'Minute matches');

    interval.reset(); // defaults to initial currentDate

    next = interval.next();
    t.equal(next.getHours(), 14, 'Hour matches');
    t.equal(next.getMinutes(), 40, 'Minute matches');

    interval.reset(new CronDate('Wed, 26 Dec 2012 17:23:53'));

    next = interval.next();
    t.equal(next.getHours(), 17, 'Hour matches');
    t.equal(next.getMinutes(), 40, 'Minute matches');

    next = interval.next();
    t.equal(next.getHours(), 18, 'Hour matches');
    t.equal(next.getMinutes(), 0, 'Minute matches');

    interval.reset(new Date('2019-06-18T08:18:36.000'));

    next = interval.prev();
    t.equal(next.getDate(), 18, 'Date matches');
    t.equal(next.getHours(), 8, 'Hour matches');
    t.equal(next.getMinutes(), 0, 'Minute matches');

    next = interval.prev();
    t.equal(next.getDate(), 18, 'Date matches');
    t.equal(next.getHours(), 7, 'Hour matches');
    t.equal(next.getMinutes(), 40, 'Minute matches');

    t.end();
  } catch (err) {
    t.error(err, 'Reset error');
  }
});

test('parse expression as UTC', function(t) {
  try {
    var options = {
      utc: true
    };

    var interval = CronExpression.parse('0 0 10 * * *', options);

    var date = interval.next();
    t.equal(date.getUTCHours(), 10, 'Correct UTC hour value');
    t.equal(date.getHours(), 10, 'Correct UTC hour value');

    interval = CronExpression.parse('0 */5 * * * *', options);

    var date = interval.next(), now = new Date();
    now.setMinutes(now.getMinutes() + 5 - (now.getMinutes() % 5));

    t.equal(date.getHours(), now.getUTCHours(), 'Correct local time for 5 minute interval');

  } catch (err) {
    t.error(err, 'UTC parse error');
  }

  t.end();
});

test('expression using days of week strings', function(t) {
  try {
    var interval = CronExpression.parse('15 10 * * MON-TUE');
    t.ok(interval, 'Interval parsed');

    var intervals = interval.iterate(8);
    t.ok(intervals, 'Found intervals');

    for (var i = 0, c = intervals.length; i < c; i++) {
      var next = intervals[i];
      var day = next.getDay();


      t.ok(next, 'Found next scheduled interval');
      t.ok(day == 1 || day == 2, 'Day matches');
      t.equal(next.getHours(), 10, 'Hour matches');
      t.equal(next.getMinutes(), 15, 'Minute matches');
    }
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('expression using days of week strings - wrong alias', function(t) {
  t.throws(function () {
    CronExpression.parse('15 10 * * MON-TUR');
  }, new Error('Validation error, cannot resolve alias "tur"'));

  t.end();
});

test('expression using mixed days of week strings', function(t) {
  try {
    var options = {
      currentDate: new CronDate('Wed, 26 Dec 2012 14:38:53')
    };

    var interval = CronExpression.parse('15 10 * jAn-FeB mOn-tUE', options);
    t.ok(interval, 'Interval parsed');

    var intervals = interval.iterate(8);
    t.ok(intervals, 'Found intervals');

    for (var i = 0, c = intervals.length; i < c; i++) {
      var next = intervals[i];
      var day = next.getDay();
      var month = next.getMonth();

      t.ok(next, 'Found next scheduled interval');
      t.ok(month == 0 || month == 2, 'Month Matches');
      t.ok(day == 1 || day == 2, 'Day matches');
      t.equal(next.getHours(), 10, 'Hour matches');
      t.equal(next.getMinutes(), 15, 'Minute matches');
    }
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('expression using non-standard second field (wildcard)', function(t) {
  try {
    var options = {
      currentDate: new CronDate('Wed, 26 Dec 2012 14:38:00'),
      endDate: new CronDate('Wed, 26 Dec 2012 15:40:00')
    };

    var interval = CronExpression.parse('* * * * * *', options);
    t.ok(interval, 'Interval parsed');

    var intervals = interval.iterate(10);
    t.ok(intervals, 'Found intervals');

    for (var i = 0, c = intervals.length; i < c; i++) {
      var next = intervals[i];
      t.ok(next, 'Found next scheduled interval');
      t.equal(next.getSeconds(), i + 1, 'Second matches');
    }
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('expression using non-standard second field (step)', function(t) {
  try {
    var options = {
      currentDate: new CronDate('Wed, 26 Dec 2012 14:38:00'),
      endDate: new CronDate('Wed, 26 Dec 2012 15:40:00')
    };

    var interval = CronExpression.parse('*/20 * * * * *', options);
    t.ok(interval, 'Interval parsed');

    var intervals = interval.iterate(3);
    t.ok(intervals, 'Found intervals');

    t.equal(intervals[0].getSeconds(), 20, 'Second matches');
    t.equal(intervals[1].getSeconds(), 40, 'Second matches');
    t.equal(intervals[2].getSeconds(), 0, 'Second matches');
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('expression using non-standard second field (range)', function(t) {
  try {
    var options = {
      currentDate: new CronDate('Wed, 26 Dec 2012 14:38:00'),
      endDate: new CronDate('Wed, 26 Dec 2012 15:40:00')
    };

    var interval = CronExpression.parse('20-40/10 * * * * *', options);
    t.ok(interval, 'Interval parsed');

    var intervals = interval.iterate(3);
    t.ok(intervals, 'Found intervals');

    for (var i = 0, c = intervals.length; i < c; i++) {
      var next = intervals[i];

      t.ok(next, 'Found next scheduled interval');
      t.equal(next.getSeconds(), 20 + (i * 10), 'Second matches');
    }
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('expression using explicit month definition and */5 day of month step', function(t) {
  var firstIterator = CronExpression.parse('0 12 */5 6 *', {
    currentDate: '2019-06-01T11:00:00.000'
  });

  var firstExpectedDates = [
    new CronDate('2019-06-01T12:00:00.000'),
    new CronDate('2019-06-06T12:00:00.000'),
    new CronDate('2019-06-11T12:00:00.000'),
    new CronDate('2019-06-16T12:00:00.000'),
    new CronDate('2019-06-21T12:00:00.000'),
    new CronDate('2019-06-26T12:00:00.000'),
    new CronDate('2020-06-01T12:00:00.000')
  ];

  firstExpectedDates.forEach(function(expectedDate) {
    t.equal(expectedDate.toISOString(), firstIterator.next().toISOString());
  });

  var secondIterator = CronExpression.parse('0 15 */5 5 *', {
    currentDate: '2019-05-01T11:00:00.000'
  });

  var secondExpectedDates = [
    new CronDate('2019-05-01T15:00:00.000'),
    new CronDate('2019-05-06T15:00:00.000'),
    new CronDate('2019-05-11T15:00:00.000'),
    new CronDate('2019-05-16T15:00:00.000'),
    new CronDate('2019-05-21T15:00:00.000'),
    new CronDate('2019-05-26T15:00:00.000'),
    new CronDate('2019-05-31T15:00:00.000'),
    new CronDate('2020-05-01T15:00:00.000')
  ];

  secondExpectedDates.forEach(function(expectedDate) {
    t.equal(expectedDate.toISOString(), secondIterator.next().toISOString());
  });

  t.end();
});

test('day of month and week are both set', function(t) {
  try {
    var interval = CronExpression.parse('10 2 12 8 0');
    t.ok(interval, 'Interval parsed');

    var next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDay() === 0 || next.getDate() === 12, 'Day or day of month matches');
    t.equal(next.getMonth(), 7, 'Month matches');

    next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDay() === 0 || next.getDate() === 12, 'Day or day of month matches');
    t.equal(next.getMonth(), 7, 'Month matches');

    next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDay() === 0 || next.getDate() === 12, 'Day or day of month matches');
    t.equal(next.getMonth(), 7, 'Month matches');

    next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDay() === 0 || next.getDate() === 12, 'Day or day of month matches');
    t.equal(next.getMonth(), 7, 'Month matches');
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('day of month is unspecified', function(t) {
  try {
    var interval = CronExpression.parse('10 2 ? * 3');

    t.ok(interval, 'Interval parsed');

    var next = interval.next();
    t.ok(next, 'Found next scheduled interal');
    t.ok(next.getDay() === 3, 'day of week matches');

    next = interval.next();
    t.ok(next, 'Found next scheduled interal');
    t.ok(next.getDay() === 3, 'day of week matches');

    next = interval.next();
    t.ok(next, 'Found next scheduled interal');
    t.ok(next.getDay() === 3, 'day of week matches');

    next = interval.next();
    t.ok(next, 'Found next scheduled interal');
    t.ok(next.getDay() === 3, 'day of week matches');

  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('day of week is unspecified', function(t) {
  try {
    var interval = CronExpression.parse('10 2 3,6 * ?');

    t.ok(interval, 'Interval parsed');

    var next = interval.next();
    t.ok(next, 'Found next scheduled interal');
    t.ok(next.getDate() === 3 || next.getDate() === 6, 'date matches');
    var prevDate = next.getDate();

    next = interval.next();
    t.ok(next, 'Found next scheduled interal');
    t.ok((next.getDate() === 3 || next.getDate() === 6) &&
      next.getDate() !== prevDate, 'date matches and is not previous date');
    prevDate = next.getDate();

    next = interval.next();
    t.ok(next, 'Found next scheduled interal');
    t.ok((next.getDate() === 3 || next.getDate() === 6) &&
      next.getDate() !== prevDate, 'date matches and is not previous date');
    prevDate = next.getDate();

    next = interval.next();
    t.ok(next, 'Found next scheduled interal');
    t.ok((next.getDate() === 3 || next.getDate() === 6) &&
      next.getDate() !== prevDate, 'date matches and is not previous date');
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('Summertime bug test', function(t) {
  try {
    var month = new CronDate().getMonth() + 1;
    var interval = CronExpression.parse('0 0 0 1 '+month+' *');
    t.ok(interval, 'Interval parsed');

    var next = interval.next();

    // Before fix the bug it was getting a timeout error if you are
    // in a timezone that changes the DST to ST in the hour 00:00h.
    t.ok(next, 'Found next scheduled interval');
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});


test('day of month and week are both set and dow is 7', function(t) {
  try {
    var interval = CronExpression.parse('10 2 12 8 7');
    t.ok(interval, 'Interval parsed');

    var next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDay() === 0 || next.getDate() === 12, 'Day or day of month matches');
    t.equal(next.getMonth(), 7, 'Month matches');

    next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDay() === 0 || next.getDate() === 12, 'Day or day of month matches');
    t.equal(next.getMonth(), 7, 'Month matches');

    next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDay() === 0 || next.getDate() === 12, 'Day or day of month matches');
    t.equal(next.getMonth(), 7, 'Month matches');

    next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDay() === 0 || next.getDate() === 12, 'Day or day of month matches');
    t.equal(next.getMonth(), 7, 'Month matches');
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('day of month is wildcard, month and day of week are both set', function(t) {
  try {
    var options = {
      currentDate: new CronDate('Mon, 31 May 2021 12:00:00')
    };
    var interval = CronExpression.parse('0 0 * 6 2', options);
    t.ok(interval, 'Interval parsed');

    var expectedDayMatches = [1, 8, 15, 22, 29];
    expectedDayMatches.forEach(function(dayOfMonth) {
      var next = interval.next();
      t.ok(next, 'Found next scheduled interval');
      t.equal(next.getDay(), 2, 'Day of week matches');
      t.equal(next.getDate(), dayOfMonth, 'Day of month matches');
      t.equal(next.getMonth(), 5, 'Month matches');
    });
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('day of month contains multiple ranges and day of week is wildcard', function(t) {
  try {
    var options = {
      currentDate: new CronDate('Sat, 1 Dec 2012 14:38:53')
    };
    var interval = CronExpression.parse('0 0 0 2-4,7-31 * *', options);
    t.ok(interval, 'Interval parsed');

    var next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDate() === 2, 'Day of month matches');
    t.equal(next.getMonth(), 11, 'Month matches');

    next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDate() === 3, 'Day of month matches');
    t.equal(next.getMonth(), 11, 'Month matches');

    next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDate() === 4, 'Day of month matches');
    t.equal(next.getMonth(), 11, 'Month matches');

    next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDate() === 7, 'Day of month matches');
    t.equal(next.getMonth(), 11, 'Month matches');

    next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDate() === 8, 'Day of month matches');
    t.equal(next.getMonth(), 11, 'Month matches');

    next = interval.next();
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('day of month and week are both set and dow is 6,0', function(t) {
  try {
    var options = {
      currentDate: new CronDate('Wed, 26 Dec 2012 14:38:53')
    };
    var interval = CronExpression.parse('10 2 12 8 6,0', options);
    t.ok(interval, 'Interval parsed');

    var next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDay() === 6 || next.getDate() === 12, 'Day or day of month matches');
    t.equal(next.getMonth(), 7, 'Month matches');

    next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDay() === 0 || next.getDate() === 12, 'Day or day of month matches');
    t.equal(next.getMonth(), 7, 'Month matches');

    next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDay() === 6 || next.getDate() === 12, 'Day or day of month matches');
    t.equal(next.getMonth(), 7, 'Month matches');

    next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDay() === 0 || next.getDate() === 12, 'Day or day of month matches');
    t.equal(next.getMonth(), 7, 'Month matches');
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});


test('day of month and week are both set and dow is a range with value 6-7', function(t) {
  try {
    var options = {
      currentDate: new CronDate('Wed, 26 Dec 2012 14:38:53')
    };
    var interval = CronExpression.parse('10 2 12 8 6-7', options);
    t.ok(interval, 'Interval parsed');

    var next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDay() === 6 || next.getDate() === 12, 'Day or day of month matches');
    t.equal(next.getMonth(), 7, 'Month matches');

    next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDay() === 6 || next.getDate() === 12, 'Day or day of month matches');
    t.equal(next.getMonth(), 7, 'Month matches');

    next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDay() === 6 || next.getDate() === 12, 'Day or day of month matches');
    t.equal(next.getMonth(), 7, 'Month matches');

    // next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.ok(next.getDay() === 6 || next.getDate() === 12, 'Day or day of month matches');
    t.equal(next.getMonth(), 7, 'Month matches');
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('day of month validation should be ignored when day of month is wildcard and month is set', function (t) {
  try {
    var options = {
      currentDate: new CronDate('2020-05-01T15:00:00.000')
    };
    var interval = CronExpression.parse('* * * * 2 *', options);
    t.ok(interval, 'Interval parsed');

    var next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.equal(next.getHours(), 0, 'Hours matches');
    t.equal(next.getDate(), 1, 'Day of month matches');
    t.equal(next.getMonth() + 1, 2, 'Month matches');

    t.ok(next, 'Found next scheduled interval');
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('day and date in week should matches', function(t){
  try {
    var interval = CronExpression.parse('0 1 1 1 * 1');
    t.ok(interval, 'Interval parsed');

    var next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.equal(next.getHours(), 1, 'Hours matches');
    t.ok(next.getDay() === 1 || next.getDate() === 1, 'Day or day of month matches');

    next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.equal(next.getHours(), 1, 'Hours matches');
    t.ok(next.getDay() === 1 || next.getDate() === 1, 'Day or day of month matches');

    next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.equal(next.getHours(), 1, 'Hours matches');
    t.ok(next.getDay() === 1 || next.getDate() === 1, 'Day or day of month matches');

  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('should sort ranges and values in ascending order', function(t) {
  var options = {
    currentDate: new CronDate('Wed, 26 Dec 2012 14:38:53')
  };
  var interval = CronExpression.parse('0 12,13,10,1-3 * * *', options);
  t.ok(interval, 'Interval parsed');

  var hours = [ 1, 2, 3, 10, 12, 13 ];
  for (var i in hours) {
    next = interval.next();

    t.ok(next, 'Found next scheduled interval');
    t.equal(next.getHours(), hours[i], 'Hours matches');
  }

  t.end();
});

test('valid ES6 iterator should be returned if iterator options is set to true', function(t) {
  try {
    var options = {
      currentDate: new CronDate('Wed, 26 Dec 2012 14:38:53'),
      endDate: new CronDate('Wed, 26 Dec 2012 15:40:00'),
      iterator: true
    };

    var val = null;
    var interval = CronExpression.parse('*/25 * * * *', options);
    t.ok(interval, 'Interval parsed');

    val = interval.next();
    t.ok(val, 'Next iteration resolved');
    t.ok(val.value, 'Iterator value is set');
    t.notOk(val.done, 'Iterator is not finished');

    val = interval.next();
    t.ok(val, 'Next iteration resolved');
    t.ok(val.value, 'Iterator value is set');
    t.notOk(val.done, 'Iterator is not finished');

    val = interval.next();
    t.ok(val, 'Next iteration resolved');
    t.ok(val.value, 'Iterator value is set');
    t.ok(val.done, 'Iterator is finished');
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('dow 6,7 6,0 0,6 7,6 should be equivalent', function(t) {
  try {
    var options = {
      currentDate: new CronDate('Wed, 26 Dec 2012 14:38:53'),
    };

    var expressions = [
      '30 16 * * 6,7',
      '30 16 * * 6,0',
      '30 16 * * 0,6',
      '30 16 * * 7,6'
    ];

    expressions.forEach(function(expression) {
      var interval = CronExpression.parse(expression, options);
      t.ok(interval, 'Interval parsed');

      var val = interval.next();
      t.equal(val.getDay(), 6, 'Day matches');

      val = interval.next();
      t.equal(val.getDay(), 0, 'Day matches');

      val = interval.next();
      t.equal(val.getDay(), 6, 'Day matches');
    });
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('hour 0 9,11,1 * * * and 0 1,9,11 * * * should be equivalent', function(t) {
  try {
    var options = {
      currentDate: new CronDate('Wed, 26 Dec 2012 00:00:00'),
    };

    var expressions = [
      '0 9,11,1 * * *',
      '0 1,9,11 * * *'
    ];

    expressions.forEach(function(expression) {
      var interval = CronExpression.parse(expression, options);
      t.ok(interval, 'Interval parsed');

      var val = interval.next();
      t.equal(val.getHours(), 1, 'Hour matches');

      val = interval.next();
      t.equal(val.getHours(), 9, 'Hour matches');

      val = interval.next();
      t.equal(val.getHours(), 11, 'Hour matches');

      val = interval.next();
      t.equal(val.getHours(), 1, 'Hour matches');

      val = interval.next();
      t.equal(val.getHours(), 9, 'Hour matches');

      val = interval.next();
      t.equal(val.getHours(), 11, 'Hour matches');
    });
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('it will work with #139 issue case', function(t) {
  var options = {
    currentDate : new Date('2018-11-15T16:15:33.522Z'),
    tz: 'Europe/Madrid'
  };

  var interval = CronExpression.parse('0 0 0 1,2 * *', options);
  var date = interval.next();

  t.equal(date.getFullYear(), 2018);
  t.equal(date.getDate(), 1);
  t.equal(date.getMonth(), 11);

  t.end();
});

test('should work for valid first/second/third/fourth/fifth occurence dayOfWeek (# char)', function(t) {
  try {
    var options = {
      currentDate: new CronDate('2019-04-30')
    };

    var expectedFirstDates = [
      new CronDate('2019-05-05'),
      new CronDate('2019-06-02'),
      new CronDate('2019-07-07'),
      new CronDate('2019-08-04')
    ];
    var expectedSecondDates = [
      new CronDate('2019-05-12'),
      new CronDate('2019-06-09'),
      new CronDate('2019-07-14'),
      new CronDate('2019-08-11')
    ];
    var expectedThirdDates = [
      new CronDate('2019-05-19'),
      new CronDate('2019-06-16'),
      new CronDate('2019-07-21'),
      new CronDate('2019-08-18')
    ];
    var expectedFourthDates = [
      new CronDate('2019-05-26'),
      new CronDate('2019-06-23'),
      new CronDate('2019-07-28'),
      new CronDate('2019-08-25')
    ];
    var expectedFifthDates = [
      new CronDate('2019-06-30'),
      new CronDate('2019-09-29'),
      new CronDate('2019-12-29'),
      new CronDate('2020-03-29')
    ];

    var allExpectedDates = [
      expectedFirstDates,
      expectedSecondDates,
      expectedThirdDates,
      expectedFourthDates,
      expectedFifthDates
    ];
    var expressions = [
      '0 0 0 ? * 0#1',
      '0 0 0 ? * 0#2',
      '0 0 0 ? * 0#3',
      '0 0 0 ? * 0#4',
      '0 0 0 ? * 0#5'
    ];
    expressions.forEach(function(expression, index) {
      var interval = CronExpression.parse(expression, options);
      var expectedDates = allExpectedDates[index];

      expectedDates.forEach(function(expected) {
        var date = interval.next();
        t.equal(
          date.toISOString(),
          expected.toISOString(),
          'Expression "' + expression + '" has next() that matches expected: ' + expected.toISOString()
        );
      });
      expectedDates
        .slice(0, expectedDates.length - 1)
        .reverse()
        .forEach(function(expected) {
          var date = interval.prev();
          t.equal(
            date.toISOString(),
            expected.toISOString(),
            'Expression "' + expression + '" has prev() that matches expected: ' + expected.toISOString()
          );
        });
    });
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('should work for valid second sunday in may', function(t) {
  try {
    var options = {
      currentDate: new CronDate('2019-01-30')
    };
    var expectedDates = [
      new CronDate('2019-05-12'),
      new CronDate('2020-05-10'),
      new CronDate('2021-05-09'),
      new CronDate('2022-05-08')
    ];

    var interval = CronExpression.parse('0 0 0 ? MAY 0#2', options);
    expectedDates.forEach(function(expected) {
      var date = interval.next();
      t.equal(
        date.toISOString(),
        expected.toISOString(),
        'Expression "0 0 0 ? MAY 0#2" has next() that matches expected: ' + expected.toISOString()
      );
    });
    expectedDates
      .slice(0, expectedDates.length - 1)
      .reverse()
      .forEach(function(expected) {
        var date = interval.prev();
        t.equal(
          date.toISOString(),
          expected.toISOString(),
          'Expression "0 0 0 ? MAY 0#2" has prev() that matches expected: ' + expected.toISOString()
        );
      });
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('should work for valid second sunday at noon in may', function(t) {
  try {
    var options = {
      currentDate: new CronDate('2019-05-12T11:59:00.000')
    };
    var expected = new CronDate('2019-05-12T12:00:00.000');

    var interval = CronExpression.parse('0 0 12 ? MAY 0#2', options);
    var date = interval.next();

    t.equal(
      date.toISOString(),
      expected.toISOString(),
      'Expression "0 0 12 ? MAY 0#2" has next() that matches expected: ' + expected.toISOString()
    );
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('should work for valid second sunday at noon in may (UTC+3)', function(t) {
  try {
    var options = {
      currentDate: new CronDate('2019-05-12T11:59:00.000', 'Europe/Sofia')
    };
    var expected = new CronDate('2019-05-12T12:00:00.000', 'Europe/Sofia');

    var interval = CronExpression.parse('0 0 12 ? MAY 0#2', options);
    var date = interval.next();

    t.equal(
      date.toISOString(),
      expected.toISOString(),
      'Expression "0 0 12 ? MAY 0#2" has next() that matches expected: ' + expected.toISOString()
    );
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('should work with both dayOfMonth and nth occurence of dayOfWeek', function(t) {
  try {
    var options = {
      currentDate: new CronDate('2019-04-01')
    };

    var expectedDates = [
      new CronDate('2019-04-16'),
      new CronDate('2019-04-17'),
      new CronDate('2019-04-18'),
      new CronDate('2019-05-15'),
      new CronDate('2019-05-16'),
      new CronDate('2019-05-18'),
    ];

    var interval = CronExpression.parse('0 0 0 16,18 * 3#3', options);

    expectedDates.forEach(function(expected) {
      var date = interval.next();
      t.equal(
        date.toISOString(),
        expected.toISOString(),
        'Expression "0 0 0 16,18 * 3#3" has next() that matches expected: ' + expected.toISOString()
      );
    });
    expectedDates
      .slice(0, expectedDates.length - 1)
      .reverse()
      .forEach(function(expected) {
        var date = interval.prev();
        t.equal(
          date.toISOString(),
          expected.toISOString(),
          'Expression "0 0 0 16,18 * 3#3" has prev() that matches expected: ' + expected.toISOString()
        );
      });
  } catch (err) {
    t.error(err, 'Interval parse error');
  }

  t.end();
});

test('should error when passed invalid occurence value', function(t) {
  var expressions = [
    '0 0 0 ? * 1#',
    '0 0 0 ? * 1#0',
    '0 0 0 ? * 4#6',
    '0 0 0 ? * 0##4',
  ];
  expressions.forEach(function(expression) {
    t.throws(function() {
      CronExpression.parse(expression);
    }, new Error('Constraint error, invalid dayOfWeek occurrence number (#)'), expression);
  });

  t.end();
});

// The Quartz documentation says that if the # character is used then no other expression can be used in the dayOfWeek term: http://www.quartz-scheduler.org/api/2.3.0/index.html
test('cannot combine `-` range and # occurrence special characters', function(t) {
  var expression = '0 0 0 ? * 2-4#2';
  t.throws(function() {
    CronExpression.parse(expression);
  }, new Error('Constraint error, invalid dayOfWeek `#` and `-` special characters are incompatible'));

  t.end();
});

test('cannot combine `/` repeat interval and # occurrence special characters', function(t) {
  var expression = '0 0 0 ? * 1/2#3';
  t.throws(function() {
    CronExpression.parse(expression);
  }, new Error('Constraint error, invalid dayOfWeek `#` and `/` special characters are incompatible'));

  t.end();
});

test('cannot combine `,` list and # occurrence special characters', function(t) {
  var expression = '0 0 0 ? * 0,6#4';
  t.throws(function() {
    CronExpression.parse(expression);
  }, new Error('Constraint error, invalid dayOfWeek `#` and `,` special characters are incompatible'));

  t.end();
});

