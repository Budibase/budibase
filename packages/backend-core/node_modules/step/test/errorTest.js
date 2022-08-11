require('./helper');

var exception = new Error('Catch me!');

expect('one');
expect('timeout');
expect('two');
expect('three');
Step(
  function () {
    fulfill('one');
    var callback = this;
    setTimeout(function () {
      fulfill('timeout');
      callback(exception);
    }, 0);
  },
  function (err) {
    fulfill('two');
    assert.equal(exception, err, "error should passed through");
    throw exception;
  },
  function (err) {
    fulfill('three');
    assert.equal(exception, err, "error should be caught");
  }
);
