"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xread = xread;

var _promiseContainer = _interopRequireDefault(require("../promise-container"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function xread(option, ...args) {
  const Promise = _promiseContainer.default.get();

  const {
    op,
    opVal,
    rest
  } = option === 'STREAMS' ? {
    op: 'COUNT',
    opVal: Infinity,
    rest: args
  } : {
    op: option,
    opVal: parseInt(args[0], 10),
    rest: args.slice(2)
  };

  if (['COUNT', 'BLOCK'].indexOf(op) < 0) {
    throw new Error('ERR syntax error');
  }

  if (rest.length % 2 !== 0) {
    throw new Error("ERR Unbalanced XREAD list of streams: for each stream key an ID or '$' must be specified.");
  } // Turn ["stream1", "stream2", "id1", "id2"] into tuples of
  //      [["stream1", "id1"], ["stream2", "id2"]]


  const toPoll = rest.reduce((memo, arg, i) => {
    const chunk = Math.floor(i / 2);
    const tuple = memo[chunk] || []; // eslint-disable-next-line no-param-reassign

    memo[chunk] = tuple.concat(arg);
    return memo;
  }, []);

  const pollStream = (stream, id, count = 1) => {
    const data = this.data.get(stream);
    if (!data) return [];
    return data.reduce((memo, [eventId, ...row]) => {
      const {
        polled
      } = this.data.get(`stream:${stream}:${eventId}`);

      if (!polled && (id === '$' || eventId >= id) && memo.length < count) {
        this.data.set(`stream:${stream}:${eventId}`, {
          polled: true
        });
        return memo.concat([[eventId, ...row]]);
      }

      return memo;
    }, []);
  };

  const pollEvents = (streams, countVal) => streams.reduce((memo, [stream, id]) => [[stream, pollStream(stream, id, countVal)]].concat(memo), []);

  return op === 'BLOCK' ? new Promise(resolve => {
    let timeElapsed = 0;

    const f = () => setTimeout(() => {
      if (opVal > 0 && timeElapsed < opVal) return resolve(null);
      const events = pollEvents(toPoll, 1);
      if (events.length > 0) return resolve(events);
      timeElapsed += 100;
      return f();
    }, 100);

    f();
  }) : new Promise(resolve => {
    const events = pollEvents(toPoll, opVal);
    if (events.length === 0) return resolve(null);
    return resolve(events.slice().reverse());
  });
}