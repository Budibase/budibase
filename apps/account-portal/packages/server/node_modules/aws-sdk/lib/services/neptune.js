var AWS = require('../core');
var rdsutil = require('./rdsutil');

/**
* @api private
*/
var crossRegionOperations = ['createDBCluster', 'copyDBClusterSnapshot'];

AWS.util.update(AWS.Neptune.prototype, {
  /**
  * @api private
  */
  setupRequestListeners: function setupRequestListeners(request) {
    if (
      crossRegionOperations.indexOf(request.operation) !== -1 &&
      this.config.params &&
      this.config.params.SourceRegion &&
      request.params &&
      !request.params.SourceRegion
    ) {
      request.params.SourceRegion = this.config.params.SourceRegion;
    }
    rdsutil.setupRequestListeners(this, request, crossRegionOperations);
  },
});
