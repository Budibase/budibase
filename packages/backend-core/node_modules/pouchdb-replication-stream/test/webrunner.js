/* global mocha: true */

(function () {
  'use strict';
  var runner = mocha.run();
  window.results = {
    lastPassed: '',
    passed: 0,
    failed: 0,
    failures: []
  };

  runner.on('pass', function (e) {
    window.results.lastPassed = e.title;
    window.results.passed++;
  });

  runner.on('fail', function (e) {
    window.results.failed++;
    window.results.failures.push({
      title: e.title,
      message: e.err.message,
      stack: e.err.stack
    });
  });

  runner.on('end', function () {
    window.results.completed = true;
    window.results.passed++;
  });
})();


