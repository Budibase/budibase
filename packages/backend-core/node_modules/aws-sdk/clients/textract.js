require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['textract'] = {};
AWS.Textract = Service.defineService('textract', ['2018-06-27']);
Object.defineProperty(apiLoader.services['textract'], '2018-06-27', {
  get: function get() {
    var model = require('../apis/textract-2018-06-27.min.json');
    model.paginators = require('../apis/textract-2018-06-27.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.Textract;
