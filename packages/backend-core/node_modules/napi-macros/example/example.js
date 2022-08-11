var bindings = require('node-gyp-build')(__dirname)

console.log(bindings.times_two(42))
