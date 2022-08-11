var bcrypt = require('../bcrypt');

var start = Date.now();
bcrypt.genSalt(10, function(err, salt) {
  console.log('salt: ' + salt);
  console.log('salt cb end: ' + (Date.now() - start) + 'ms');
  bcrypt.hash('test', salt, function(err, crypted) {
    console.log('crypted: ' + crypted);
    console.log('crypted cb end: ' + (Date.now() - start) + 'ms');
    console.log('rounds used from hash:', bcrypt.getRounds(crypted));
    bcrypt.compare('test', crypted, function(err, res) {
      console.log('compared true: ' + res);
      console.log('compared true cb end: ' + (Date.now() - start) + 'ms');
    });
    bcrypt.compare('bacon', crypted, function(err, res) {
      console.log('compared false: ' + res);
      console.log('compared false cb end: ' + (Date.now() - start) + 'ms');
    });
  });
})
console.log('end: ' + (Date.now() - start) + 'ms');
