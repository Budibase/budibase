"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getbit = getbit;
const MAX_OFFSET = 2 ** 32 - 1;

function getbit(key, offset) {
  if (offset > MAX_OFFSET) throw new Error('ERR bit offset is not an integer or out of range');
  if (!this.data.has(key)) return 0;
  const current = this.data.get(key);
  if (offset > current.length * 8) return 0;
  const byteOffset = parseInt(offset / 8, 10);
  const shift = 7 - offset % 8; // redis store bit in reverse order (left to right)
  // eslint-disable-next-line no-bitwise

  return current.charCodeAt(byteOffset) >> shift & 1;
}