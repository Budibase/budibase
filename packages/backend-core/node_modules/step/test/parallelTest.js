require('./helper');

var selfText = fs.readFileSync(__filename, 'utf8'),
    etcText = fs.readFileSync('/etc/passwd', 'utf8');

expect('one');
expect('two');
Step(
  // Loads two files in parallel
  function loadStuff() {
    fulfill('one');
    fs.readFile(__filename, this.parallel());
    fs.readFile("/etc/passwd", this.parallel());
  },
  // Show the result when done
  function showStuff(err, code, users) {
    fulfill('two');
    if (err) throw err;
    assert.equal(selfText, code, "Code should come first");
    assert.equal(etcText, users, "Users should come second");
  }
);

// Test lock functionality with N parallel calls
expect("test2: 1");
expect("test2: 1,2,3");
expect("test2: 2");
Step(
    function() {
        return 1;
    },
    function makeParallelCalls(err, num) {
        if(err) throw err;
        fulfill("test2: " + num);
        
        setTimeout((function(callback) { return function() { callback(null, 1); } })(this.parallel()), 100);
        this.parallel()(null, 2);
        setTimeout((function(callback) { return function() { callback(null, 3); } })(this.parallel()), 0);
    },
    function parallelResults(err, one, two, three) {
        if(err) throw err;
        fulfill("test2: " + [one, two, three]);
        return 2
    },
    function terminate(err, num) {
        if(err) throw err;
        fulfill("test2: " + num);
    }
)


// Test lock functionality with parallel calls with delay
expect("test3: 1,2");
expect("test3 t1: 666");
expect("test3 t2: 333");
Step(
  function parallelCalls() {
    var p1 = this.parallel(), p2 = this.parallel();
    process.nextTick(function() { p1(null, 1); });
    process.nextTick(function() { p2(null, 2); });
  },
  function parallelResults(err, one, two) {
    if(err) throw err;
    fulfill("test3: " + [one, two]);
    return 666;
  },
  function terminate1(err, num) {
    if(err) throw err;
    fulfill("test3 t1: " + num);
    var next = this;
    setTimeout(function() { next(null, 333); }, 50);
  },
  function terminate2(err, num) {
    if(err) throw err;
    fulfill("test3 t2: " + num);
    this();
  }
);


// Test lock functionality with parallel calls which return immediately
expect("test4: 1,2");
expect("test4 t1: 666");
expect("test4 t2: 333");
Step(
  function parallelCalls() {
    var p1 = this.parallel(), p2 = this.parallel();
    p1(null, 1);
    p2(null, 2);
  },
  function parallelResults(err, one, two) {
    if(err) throw err;
    fulfill("test4: " + [one, two]);
    return 666;
  },
  function terminate1(err, num) {
    if(err) throw err;
    fulfill("test4 t1: " + num);
    var next = this;
    setTimeout(function() { next(null, 333); }, 50);
  },
  function terminate2(err, num) {
    if(err) throw err;
    fulfill("test4 t2: " + num);
    this();
  }
);
