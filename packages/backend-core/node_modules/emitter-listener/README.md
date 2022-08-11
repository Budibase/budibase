## Add dynamic instrumentation to emitters

`shimmer` does a bunch of the work necessary to wrap other methods in
a wrapper you provide:

```javascript
var EventEmitter = require('events').EventEmitter;
var wrapEmitter = require('emitter-listener');

var ee = new EventEmitter();

var id = 0;

wrapEmitter(
  ee,
  function mark(listener) {
    listener.id = id++;
  },
  function prepare(listener) {
    console.log('listener id is %d', listener.id);
  }
);
```

### Mandatory disclaimer

There are times when it's necessary to monkeypatch default behavior in
JavaScript and Node. However, changing the behavior of the runtime on the fly
is rarely a good idea, and you should be using this module because you need to,
not because it seems like fun.

#### wrapEmitter(emitter, mark, prepare)

Wrap an EventEmitter's event listeners. Each listener will be passed to
`mark` when it is registered with `.addListener()` or `.on()`, and then
each listener is passed to `prepare` to be wrapped before it's called
by the `.emit()` call. `wrapListener` deals with the single listener
vs array of listeners logic, and also ensures that edge cases like
`.removeListener()` being called from within an `.emit()` for the same
event type is handled properly.

The wrapped EE can be restored to its pristine state by using
emitter.__unwrap(), but this should only be used if you *really* know
what you're doing.
