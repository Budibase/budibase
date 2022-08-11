"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lrange = lrange;

/**
 * Returns the specified elements of the list stored at key. The offsets start and stop are zero-based indexes, with 0 being the first element of the list (the head of the list), 1 being the next element and so on.
 * These offsets can also be negative numbers indicating offsets starting at the end of the list. For example, -1 is the last element of the list, -2 the penultimate, and so on.
 *
 * @param {string} key
 * @param {string} start Start index
 * @param {string} end End index (included in returned range)
 * @return {Array} An array in the defined range
 */
function lrange(key, s, e) {
  if (this.data.has(key) && !(this.data.get(key) instanceof Array)) {
    throw new Error(`Key ${key} does not contain a list`);
  }

  let start = parseInt(s, 10);
  let end = parseInt(e, 10);
  const list = this.data.get(key) || [];

  if (start < 0) {
    start = list.length + start;
  }

  if (end < 0) {
    end = list.length + end;
  }

  return list.slice(start, end + 1);
}