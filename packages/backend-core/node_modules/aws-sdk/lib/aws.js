require('./node_loader');

var AWS = require('./core');

// Load all service classes
require('../clients/all');

/**
 * @api private
 */
module.exports = AWS;
