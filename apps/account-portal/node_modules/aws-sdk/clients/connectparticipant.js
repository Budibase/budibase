require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['connectparticipant'] = {};
AWS.ConnectParticipant = Service.defineService('connectparticipant', ['2018-09-07']);
Object.defineProperty(apiLoader.services['connectparticipant'], '2018-09-07', {
  get: function get() {
    var model = require('../apis/connectparticipant-2018-09-07.min.json');
    model.paginators = require('../apis/connectparticipant-2018-09-07.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ConnectParticipant;
