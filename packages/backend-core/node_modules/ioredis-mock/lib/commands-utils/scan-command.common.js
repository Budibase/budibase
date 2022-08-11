"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scanHelper = scanHelper;

function pattern(str) {
  let string = str.replace(/([+{($^|.\\])/g, '\\$1');
  string = string.replace(/(^|[^\\])([*?])/g, '$1.$2');
  string = `^${string}$`;
  const p = new RegExp(string);
  return p.test.bind(p);
}

function getCountAndMatch(args) {
  if (args.length > 4) {
    throw new Error('Too many arguments');
  }

  if (args.length % 2 !== 0) {
    throw new Error('Args should be provided by pair (name & value)');
  }

  let count = 10;
  let matchPattern = null;
  const test = `${args[0]}${args[2]}`.toUpperCase();

  if (test === 'UNDEFINEDUNDEFINED') {
    return [count, matchPattern];
  }

  if (test === 'MATCHUNDEFINED') {
    matchPattern = pattern(args[1]);
  } else if (test === 'COUNTUNDEFINED') {
    count = parseInt(args[1], 10);
  } else if (test === 'MATCHCOUNT') {
    matchPattern = pattern(args[1]);
    count = parseInt(args[3], 10);
  } else if (test.startsWith('MATCH') || test.startsWith('COUNT')) {
    throw new Error('BAD Syntax');
  } else {
    throw new Error(`Uknown option ${args[0]}`);
  }

  if (Number.isNaN(count)) {
    throw new Error('count must be integer');
  }

  return [count, matchPattern];
}

function scanHelper(allKeys, size, cursorStart, ...args) {
  const cursor = parseInt(cursorStart, 10);

  if (Number.isNaN(cursor)) {
    throw new Error('Cursor must be integer');
  }

  const [count, matchPattern] = getCountAndMatch(args);
  let nextCursor = cursor + count;
  const keys = allKeys.slice(cursor, nextCursor); // Apply MATCH filtering _after_ getting number of keys

  if (matchPattern) {
    let i = 0;

    while (i < keys.length) if (!matchPattern(keys[i])) {
      keys.splice(i, size);
    } else {
      i += size;
    }
  } // Return 0 when iteration is complete.


  if (nextCursor >= allKeys.length) {
    nextCursor = 0;
  }

  return [String(nextCursor), keys];
}