require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['robomaker'] = {};
AWS.RoboMaker = Service.defineService('robomaker', ['2018-06-29']);
Object.defineProperty(apiLoader.services['robomaker'], '2018-06-29', {
  get: function get() {
    var model = require('../apis/robomaker-2018-06-29.min.json');
    model.paginators = require('../apis/robomaker-2018-06-29.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.RoboMaker;
