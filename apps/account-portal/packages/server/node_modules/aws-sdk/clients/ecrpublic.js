require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['ecrpublic'] = {};
AWS.ECRPUBLIC = Service.defineService('ecrpublic', ['2020-10-30']);
Object.defineProperty(apiLoader.services['ecrpublic'], '2020-10-30', {
  get: function get() {
    var model = require('../apis/ecr-public-2020-10-30.min.json');
    model.paginators = require('../apis/ecr-public-2020-10-30.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ECRPUBLIC;
