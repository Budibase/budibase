require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['connectcampaigns'] = {};
AWS.ConnectCampaigns = Service.defineService('connectcampaigns', ['2021-01-30']);
Object.defineProperty(apiLoader.services['connectcampaigns'], '2021-01-30', {
  get: function get() {
    var model = require('../apis/connectcampaigns-2021-01-30.min.json');
    model.paginators = require('../apis/connectcampaigns-2021-01-30.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ConnectCampaigns;
