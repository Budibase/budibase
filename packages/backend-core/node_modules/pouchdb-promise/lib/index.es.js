import lie from 'lie';

/* istanbul ignore next */
var PouchPromise = typeof Promise === 'function' ? Promise : lie;

export default PouchPromise;
