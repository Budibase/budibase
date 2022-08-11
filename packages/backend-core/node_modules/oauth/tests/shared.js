var events = require('events');

exports.DummyResponse = function( statusCode ) {
    this.statusCode= statusCode;
    this.headers= {};
}
exports.DummyResponse.prototype= events.EventEmitter.prototype;
exports.DummyResponse.prototype.setEncoding= function() {}

exports.DummyRequest =function( response ) {
  this.response=  response;
  this.responseSent= false;
}
exports.DummyRequest.prototype= events.EventEmitter.prototype;
exports.DummyRequest.prototype.write= function(post_body){}
exports.DummyRequest.prototype.write= function(post_body){
  this.responseSent= true;
  this.emit('response',this.response);
}
exports.DummyRequest.prototype.end= function(){
  if(!this.responseSent) {
    this.responseSent= true;
    this.emit('response',this.response);
  }
  this.response.emit('end');
}