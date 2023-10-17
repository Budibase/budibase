require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['s3outposts'] = {};
AWS.S3Outposts = Service.defineService('s3outposts', ['2017-07-25']);
Object.defineProperty(apiLoader.services['s3outposts'], '2017-07-25', {
  get: function get() {
    var model = require('../apis/s3outposts-2017-07-25.min.json');
    model.paginators = require('../apis/s3outposts-2017-07-25.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.S3Outposts;
