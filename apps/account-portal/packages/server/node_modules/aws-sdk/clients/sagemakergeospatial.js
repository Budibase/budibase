require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['sagemakergeospatial'] = {};
AWS.SageMakerGeospatial = Service.defineService('sagemakergeospatial', ['2020-05-27']);
Object.defineProperty(apiLoader.services['sagemakergeospatial'], '2020-05-27', {
  get: function get() {
    var model = require('../apis/sagemaker-geospatial-2020-05-27.min.json');
    model.paginators = require('../apis/sagemaker-geospatial-2020-05-27.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.SageMakerGeospatial;
