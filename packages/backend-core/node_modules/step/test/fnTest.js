require('./helper');


var myfn = Step.fn(
  function (name) {
    fs.readFile(name, 'utf8', this);
  },
  function capitalize(err, text) {
    if (err) throw err;
    return text.toUpperCase();
  }
);

var selfText = fs.readFileSync(__filename, 'utf8');

expect('result');
myfn(__filename, function (err, result) {
  fulfill('result');
  if (err) throw err;
  assert.equal(selfText.toUpperCase(), result, "It should work");
});
