'use strict';

var test = require('tap').test;
var compactField = require('../lib/field_compactor');

test('compact field - empty array', function(t) {
  try {
    var result = compactField([]);
    t.same(result, []);
  } catch (err) {
    t.error(err, 'compact field error');
  }
  t.end();
});

test('compact field - single element array', function(t) {
  try {
    var result = compactField([1]);
    t.same(result, [{
      start: 1,
      count: 1
    }]);
  } catch (err) {
    t.error(err, 'compact field error');
  }
  t.end();
});

test('compact field - 2 elements array', function(t) {
  try {
    var result = compactField([1, 2]);
    t.same(result, [
      {
        start: 1,
        count: 1
      },
      {
        start: 2,
        count: 1
      }
    ]);
  } catch (err) {
    t.error(err, 'compact field error');
  }
  t.end();
});

test('compact field - 2 elements array big step', function(t) {
  try {
    var result = compactField([1, 5]);
    t.same(result, [
      {
        start: 1,
        count: 1
      },
      {
        start: 5,
        count: 1
      }
    ]);
  } catch (err) {
    t.error(err, 'compact field error');
  }
  t.end();
});

test('compact field - 3 elements array 1 step', function(t) {
  try {
    var result = compactField([1, 2, 3]);
    t.same(result, [
      {
        start: 1,
        end: 3,
        count: 3,
        step: 1
      }
    ]);
  } catch (err) {
    t.error(err, 'compact field error');
  }
  t.end();
});

test('compact field - 3 elements array 1 step, dangling extra at end', function(t) {
  try {
    var result = compactField([1, 2, 3, 5]);
    t.same(result, [
      {
        start: 1,
        end: 3,
        count: 3,
        step: 1
      },
      {
        start: 5,
        count: 1
      }
    ]);
  } catch (err) {
    t.error(err, 'compact field error');
  }
  t.end();
});

test('compact field - 3 elements array 1 step, dangling extra at end and beginning', function(t) {
  try {
    var result = compactField([1, 4, 5, 6, 9]);
    t.same(result, [
      {
        start: 1,
        count: 1
      },
      {
        start: 4,
        end: 6,
        count: 3,
        step: 1
      },
      {
        start: 9,
        count: 1
      }
    ]);
  } catch (err) {
    t.error(err, 'compact field error');
  }
  t.end();
});

test('compact field - 2 ranges with dangling in the middle', function(t) {
  try {
    var result = compactField([1, 2, 3, 6, 9, 11, 13]);
    t.same(result, [
      {
        start: 1,
        end: 3,
        count: 3,
        step: 1
      },
      {
        start: 6,
        count: 1
      },
      {
        start: 9,
        end: 13,
        count: 3,
        step: 2
      }
    ]);
  } catch (err) {
    t.error(err, 'compact field error');
  }
  t.end();
});

test('compact field - with chars', function(t) {
  try {
    var result = compactField(['L', 'W']);
    t.same(result, [
      {
        start: 'L',
        count: 1
      },
      {
        start: 'W',
        count: 1
      }
    ]);
  } catch (err) {
    t.error(err, 'compact field error');
  }
  t.end();
});

test('compact field - with chars and range', function(t) {
  try {
    var result = compactField([1, 'L', 'W']);
    t.same(result, [
      {
        start: 1,
        count: 1,
      },
      {
        start: 'L',
        count: 1
      },
      {
        start: 'W',
        count: 1
      }
    ]);
  } catch (err) {
    t.error(err, 'compact field error');
  }
  t.end();
});

test('compact field - with chars and range (v2)', function(t) {
  try {
    var result = compactField([1, 2, 'L', 'W']);
    t.same(result, [
      {
        start: 1,
        count: 1,
      },
      {
        start: 2,
        count: 1,
      },
      {
        start: 'L',
        count: 1
      },
      {
        start: 'W',
        count: 1
      }
    ]);
  } catch (err) {
    t.error(err, 'compact field error');
  }
  t.end();
});


test('compact field - with chars and range (v3)', function(t) {
  try {
    var result = compactField([1, 2, 3, 'L', 'W']);
    t.same(result, [
      {
        start: 1,
        end: 3,
        count: 3,
        step: 1
      },
      {
        start: 'L',
        count: 1
      },
      {
        start: 'W',
        count: 1
      }
    ]);
  } catch (err) {
    t.error(err, 'compact field error');
  }
  t.end();
});
