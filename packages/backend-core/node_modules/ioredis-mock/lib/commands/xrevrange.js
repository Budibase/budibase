"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xrevrange = xrevrange;

function xrevrange(stream, end, start, ...args) {
  if (!stream || !start || !end) {
    throw new Error("ERR wrong number of arguments for 'xrevrange' command");
  }

  const [COUNT, count] = args;

  if (COUNT && !count) {
    throw new Error('ERR syntax error');
  }

  if (!this.data.has(stream)) {
    return [];
  }

  const list = this.data.get(stream).slice().reverse();
  const min = start === '-' ? -Infinity : start;
  const max = end === '+' ? Infinity : end;
  const result = list.filter(([eventId]) => min <= parseInt(eventId, 10) && max >= parseInt(eventId, 10));
  if (count) return result.slice(0, count);
  return result;
}