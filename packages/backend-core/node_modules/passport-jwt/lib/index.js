'use strict';

var Strategy = require('./strategy'),
    ExtractJwt = require('./extract_jwt.js');


module.exports = {
    Strategy: Strategy,
    ExtractJwt : ExtractJwt
};
