require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['ebs'] = {};
AWS.EBS = Service.defineService('ebs', ['2019-11-02']);
Object.defineProperty(apiLoader.services['ebs'], '2019-11-02', {
  get: function get() {
    var model = require('../apis/ebs-2019-11-02.min.json');
    model.paginators = require('../apis/ebs-2019-11-02.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.EBS;
