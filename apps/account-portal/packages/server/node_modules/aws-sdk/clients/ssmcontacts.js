require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['ssmcontacts'] = {};
AWS.SSMContacts = Service.defineService('ssmcontacts', ['2021-05-03']);
Object.defineProperty(apiLoader.services['ssmcontacts'], '2021-05-03', {
  get: function get() {
    var model = require('../apis/ssm-contacts-2021-05-03.min.json');
    model.paginators = require('../apis/ssm-contacts-2021-05-03.paginators.json').pagination;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.SSMContacts;
