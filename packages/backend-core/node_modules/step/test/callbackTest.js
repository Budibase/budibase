require('./helper');

var selfText = fs.readFileSync(__filename, 'utf8');

// This example tests passing async results and sync results to the next layer

expect('one');
expect('two');
expect('three');
Step(
  function readSelf() {
    fulfill("one");
    fs.readFile(__filename, 'utf8', this);
  },
  function capitalize(err, text) {
    fulfill("two");
    if (err) throw err;
    assert.equal(selfText, text, "Text Loaded");
    return text.toUpperCase();
  },
  function showIt(err, newText) {
    fulfill("three");
    if (err) throw err;
    assert.equal(selfText.toUpperCase(), newText, "Text Uppercased");
  }
);
