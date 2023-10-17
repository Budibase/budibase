require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['alexaforbusiness'] = {};
AWS.AlexaForBusiness = Service.defineService('alexaforbusiness', ['2017-11-09']);
Object.defineProperty(apiLoader.services['alexaforbusiness'], '2017-11-09', {
  get: function get() {
    var model = require('../apis/alexaforbusiness-2017-11-09.min.json');
    model.paginators = require('../apis/alexaforbusiness-2017-11-09.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.AlexaForBusiness;
