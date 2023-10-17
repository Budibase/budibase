require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['codeguruprofiler'] = {};
AWS.CodeGuruProfiler = Service.defineService('codeguruprofiler', ['2019-07-18']);
Object.defineProperty(apiLoader.services['codeguruprofiler'], '2019-07-18', {
  get: function get() {
    var model = require('../apis/codeguruprofiler-2019-07-18.min.json');
    model.paginators = require('../apis/codeguruprofiler-2019-07-18.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.CodeGuruProfiler;
