require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['medicalimaging'] = {};
AWS.MedicalImaging = Service.defineService('medicalimaging', ['2023-07-19']);
Object.defineProperty(apiLoader.services['medicalimaging'], '2023-07-19', {
  get: function get() {
    var model = require('../apis/medical-imaging-2023-07-19.min.json');
    model.paginators = require('../apis/medical-imaging-2023-07-19.paginators.json').pagination;
    model.waiters = require('../apis/medical-imaging-2023-07-19.waiters2.json').waiters;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.MedicalImaging;
