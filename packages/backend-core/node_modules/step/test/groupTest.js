require('./helper');

var dirListing = fs.readdirSync(__dirname),
    dirResults = dirListing.map(function (filename) {
      return fs.readFileSync(__dirname + "/" + filename, 'utf8');
    });

expect('one');
expect('two');
expect('three');
Step(
  function readDir() {
    fulfill('one');
    fs.readdir(__dirname, this);
  },
  function readFiles(err, results) {
    fulfill('two');
    if (err) throw err;
    // Create a new group
    assert.deepEqual(dirListing, results);
    var group = this.group();
    results.forEach(function (filename) {
      if (/\.js$/.test(filename)) {
        fs.readFile(__dirname + "/" + filename, 'utf8', group());
      }
    });
  },
  function showAll(err , files) {
    fulfill('three');
    if (err) throw err;
    assert.deepEqual(dirResults, files);
  }
);

expect('four');
expect('five');
// When the group is empty, it should fire with an empty array
Step(
  function start() {
    var group = this.group();
    fulfill('four');
  },
  function readFiles(err, results) {
    if (err) throw err;
    fulfill('five');
    assert.deepEqual(results, []);
  }
);

// Test lock functionality with N sized groups
expect("test3: 1");
expect("test3: 1,2,3");
expect("test3: 2");
Step(
    function() {
        return 1;
    },
    function makeGroup(err, num) {
        if(err) throw err;
        fulfill("test3: " + num);
        var group = this.group();
        
        setTimeout((function(callback) { return function() { callback(null, 1); } })(group()), 100);
        group()(null, 2);
        setTimeout((function(callback) { return function() { callback(null, 3); } })(group()), 0);
    },
    function groupResults(err, results) {
        if(err) throw err;
        fulfill("test3: " + results);
        return 2
    },
    function terminate(err, num) {
        if(err) throw err;
        fulfill("test3: " + num);
    }
);

// Test lock functionality with zero sized groups
expect("test4: 1");
expect("test4: empty array");
expect("test4: group of zero terminated");
expect("test4: 2");
Step(
    function() {
        return 1;
    },
    function makeGroup(err, num) {
        if(err) throw err;
        fulfill("test4: " + num);
        this.group();
    },
    function groupResults(err, results) {
        if(err) throw err;
        if(results.length === 0) { fulfill("test4: empty array"); }
        fulfill('test4: group of zero terminated');
        return 2
    },
    function terminate(err, num) {
        if(err) throw err;
        fulfill("test4: " + num);
    }
);


// Test lock functionality with groups which return immediately
expect("test5: 1,2");
expect("test5 t1: 666");
expect("test5 t2: 333");
setTimeout(function() {
Step(
  function parallelCalls() {
    var group = this.group();
    var p1 = group(), p2 = group();
    p1(null, 1);
    p2(null, 2);
  },
  function parallelResults(err, results) {
    if(err) throw err;
    fulfill("test5: " + results);
    return 666;
  },
  function terminate1(err, num) {
    if(err) throw err;
    fulfill("test5 t1: " + num);
    var next = this;
    setTimeout(function() { next(null, 333); }, 50);
  },
  function terminate2(err, num) {
    if(err) throw err;
    fulfill("test5 t2: " + num);
    this();
  }
);
}, 1000);
