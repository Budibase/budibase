args array [![Build Status](https://travis-ci.org/calvinmetcalf/argsarray.png)](https://travis-ci.org/calvinmetcalf/argsarray)
===

```bash
npm install argsarray
```

simple library to treat function arguments as an array without leaking the arguments object ([which is bad](https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments)), based on something I wrote for [PouchDB](https://github.com/daleharvey/pouchdb).

Simple wrap a function in this and the function will always be called with an array of the arguments it was called with.

```js
var myFunc = argsarray(function myFunc(args) {
  console.log(args);
});

myFunc(a, b, c);
//[a, b, c];
```

#license

wtfpl