module.exports = {
  //provide realtime clock for performance measurement
  now: function now() {
    var second = process.hrtime();
    return second[0] * 1000 + (second[1] / 1000000);
  }
};
