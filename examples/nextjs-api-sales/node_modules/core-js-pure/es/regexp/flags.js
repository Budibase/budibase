require('../../modules/es.regexp.flags');
var uncurryThis = require('../../internals/function-uncurry-this');
var regExpFlags = require('../../internals/regexp-flags');

module.exports = uncurryThis(regExpFlags);
