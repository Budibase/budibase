"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setbit = setbit;
const MAX_OFFSET = 2 ** 32 - 1;
const STR_BIT_0 = String.fromCharCode(0);

const constantLengthOf = len => str => str + Array(Math.max(0, len - str.length)).fill(STR_BIT_0).join('');
/* eslint-disable no-bitwise */


const getBitAt = position => byte => byte >> position & 1;

const setBitAt = position => byte => byte | 1 << position;

const resetBitAt = position => byte => byte & ~(1 << position);
/* eslint-enable no-bitwise */


const setOrResetBitAt = bit => bit === 1 ? setBitAt : resetBitAt;

const getByteAt = position => str => str.charCodeAt(position);

const setByteAt = byte => position => str => str.substr(0, position) + String.fromCharCode(byte) + str.substr(position + 1);

function setbit(key, offset, value) {
  if (offset > MAX_OFFSET) throw new Error('ERR bit offset is not an integer or out of range');
  const bit = parseInt(value, 10);
  if (bit !== 0 && bit !== 1) throw new Error('ERR bit is not an integer or out of range');
  const byteOffset = parseInt(offset / 8, 10);
  const bitOffset = 7 - offset % 8; // redis store bit in reverse order (left to right)

  const prev = this.data.has(key) ? this.data.get(key) : '';
  const prevByte = getByteAt(byteOffset)(prev);
  const padded = constantLengthOf(byteOffset + 1)(prev);
  const newByte = setOrResetBitAt(bit)(bitOffset)(prevByte);
  const newValue = setByteAt(newByte)(byteOffset)(padded);
  this.data.set(key, newValue);
  return getBitAt(bitOffset)(prevByte);
}