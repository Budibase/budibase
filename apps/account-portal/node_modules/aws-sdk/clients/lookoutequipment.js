require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['lookoutequipment'] = {};
AWS.LookoutEquipment = Service.defineService('lookoutequipment', ['2020-12-15']);
Object.defineProperty(apiLoader.services['lookoutequipment'], '2020-12-15', {
  get: function get() {
    var model = require('../apis/lookoutequipment-2020-12-15.min.json');
    model.paginators = require('../apis/lookoutequipment-2020-12-15.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.LookoutEquipment;
