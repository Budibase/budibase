var AWS = require('../core');

AWS.util.update(AWS.RDSDataService.prototype, {
  /**
   * @return [Boolean] whether the error can be retried
   * @api private
   */
  retryableError: function retryableError(error) {
    if (error.code === 'BadRequestException' &&
      error.message &&
      error.message.match(/^Communications link failure/) &&
      error.statusCode === 400) {
      return true;
    } else {
      var _super = AWS.Service.prototype.retryableError;
      return _super.call(this, error);
    }
  }
});
