function NoOpenIDError(message, response) {
  this.name = 'NoOpenIDError';
  this.message = message;
  this.stack = (new Error()).stack;
  this.response = response;
}
NoOpenIDError.prototype = new Error;

module.exports = NoOpenIDError;
