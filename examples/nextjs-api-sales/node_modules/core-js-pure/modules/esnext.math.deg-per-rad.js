var $ = require('../internals/export');

// `Math.DEG_PER_RAD` constant
// https://rwaldron.github.io/proposal-math-extensions/
$({ target: 'Math', stat: true, forced: true }, {
  DEG_PER_RAD: Math.PI / 180
});
