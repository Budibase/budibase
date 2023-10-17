var AWS = require('../core');

AWS.util.update(AWS.EventBridge.prototype, {
  /**
   * @api private
   */
  setupRequestListeners: function setupRequestListeners(request) {
    if (request.operation === 'putEvents') {
      var params = request.params || {};
      if (params.EndpointId !== undefined) {
        throw new AWS.util.error(new Error(), {
          code: 'InvalidParameter',
          message: 'EndpointId is not supported in current SDK.\n' +
            'You should consider switching to V3(https://github.com/aws/aws-sdk-js-v3).'
        });
      }
    }
  },
});
