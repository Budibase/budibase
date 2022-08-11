require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['signer'] = {};
AWS.Signer = Service.defineService('signer', ['2017-08-25']);
Object.defineProperty(apiLoader.services['signer'], '2017-08-25', {
  get: function get() {
    var model = require('../apis/signer-2017-08-25.min.json');
    model.paginators = require('../apis/signer-2017-08-25.paginators.json').pagination;
    model.waiters = require('../apis/signer-2017-08-25.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Signer;
