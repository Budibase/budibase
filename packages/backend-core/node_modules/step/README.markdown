# Step

A simple control-flow library for node.JS that makes parallel execution, serial execution, and error handling painless.

## How to install

Simply copy or link the lib/step.js file into your `$HOME/.node_libraries` folder.

## How to use

The step library exports a single function I call `Step`.  It accepts any number of functions as arguments and runs them in serial order using the passed in `this` context as the callback to the next step.

    Step(
      function readSelf() {
        fs.readFile(__filename, this);
      },
      function capitalize(err, text) {
        if (err) throw err;
        return text.toUpperCase();
      },
      function showIt(err, newText) {
        if (err) throw err;
        console.log(newText);
      }
    );

Notice that we pass in `this` as the callback to `fs.readFile`.  When the file read completes, step will send the result as the arguments to the next function in the chain.  Then in the `capitalize` function we're doing synchronous work so we can simple return the new value and Step will route it as if we called the callback.

The first parameter is reserved for errors since this is the node standard.  Also any exceptions thrown are caught and passed as the first argument to the next function.  As long as you don't nest callback functions inline your main functions this prevents there from ever being any uncaught exceptions.  This is very important for long running node.JS servers since a single uncaught exception can bring the whole server down.

Also there is support for parallel actions:

    Step(
      // Loads two files in parallel
      function loadStuff() {
        fs.readFile(__filename, this.parallel());
        fs.readFile("/etc/passwd", this.parallel());
      },
      // Show the result when done
      function showStuff(err, code, users) {
        if (err) throw err;
        console.log(code);
        console.log(users);
      }
    )

Here we pass `this.parallel()` instead of `this` as the callback.  It internally keeps track of the number of callbacks issued and preserves their order then giving the result to the next step after all have finished.  If there is an error in any of the parallel actions, it will be passed as the first argument to the next step.

Also you can use group with a dynamic number of common tasks.

    Step(
      function readDir() {
        fs.readdir(__dirname, this);
      },
      function readFiles(err, results) {
        if (err) throw err;
        // Create a new group
        var group = this.group();
        results.forEach(function (filename) {
          if (/\.js$/.test(filename)) {
            fs.readFile(__dirname + "/" + filename, 'utf8', group());
          }
        });
      },
      function showAll(err , files) {
        if (err) throw err;
        console.dir(files);
      }
    );

*Note* that we both call `this.group()` and `group()`.  The first reserves a slot in the parameters of the next step, then calling `group()` generates the individual callbacks and increments the internal counter.
