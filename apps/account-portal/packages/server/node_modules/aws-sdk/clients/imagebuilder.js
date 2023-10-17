require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['imagebuilder'] = {};
AWS.Imagebuilder = Service.defineService('imagebuilder', ['2019-12-02']);
Object.defineProperty(apiLoader.services['imagebuilder'], '2019-12-02', {
  get: function get() {
    var model = require('../apis/imagebuilder-2019-12-02.min.json');
    model.paginators = require('../apis/imagebuilder-2019-12-02.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Imagebuilder;
