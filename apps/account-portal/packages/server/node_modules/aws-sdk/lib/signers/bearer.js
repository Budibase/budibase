var AWS = require('../core');

/**
 * @api private
 */
AWS.Signers.Bearer = AWS.util.inherit(AWS.Signers.RequestSigner, {
  constructor: function Bearer(request) {
    AWS.Signers.RequestSigner.call(this, request);
  },

  addAuthorization: function addAuthorization(token) {
    this.request.headers['Authorization'] = 'Bearer ' + token.token;
  }
});
