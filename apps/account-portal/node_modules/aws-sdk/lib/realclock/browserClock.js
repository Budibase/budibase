module.exports = {
  //provide realtime clock for performance measurement
  now: function now() {
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      return performance.now();
    }
    return Date.now();
  }
};
