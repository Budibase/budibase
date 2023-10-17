require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['iot1clickprojects'] = {};
AWS.IoT1ClickProjects = Service.defineService('iot1clickprojects', ['2018-05-14']);
Object.defineProperty(apiLoader.services['iot1clickprojects'], '2018-05-14', {
  get: function get() {
    var model = require('../apis/iot1click-projects-2018-05-14.min.json');
    model.paginators = require('../apis/iot1click-projects-2018-05-14.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.IoT1ClickProjects;
