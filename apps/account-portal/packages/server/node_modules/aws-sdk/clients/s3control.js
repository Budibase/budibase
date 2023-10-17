require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['s3control'] = {};
AWS.S3Control = Service.defineService('s3control', ['2018-08-20']);
require('../lib/services/s3control');
Object.defineProperty(apiLoader.services['s3control'], '2018-08-20', {
  get: function get() {
    var model = require('../apis/s3control-2018-08-20.min.json');
    model.paginators = require('../apis/s3control-2018-08-20.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.S3Control;
