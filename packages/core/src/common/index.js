import {
  isUndefined, isNaN, isNull,
  reduce, constant, head, isEmpty,
  tail, findIndex, startsWith, join,
  dropRight, flow, takeRight, trim,
  split, includes, replace, isArray,
  isString, isInteger, isDate, toNumber,
} from 'lodash';
import { some } from 'lodash/fp';
import { events, eventsList } from './events';
import { apiWrapper } from './apiWrapper';
import {
  getLock, NO_LOCK,
  isNolock
} from './lock';

// this is the combinator function
export const $$ = (...funcs) => arg => flow(funcs)(arg);

// this is the pipe function
export const $ = (arg, funcs) => $$(...funcs)(arg);

export const keySep = '/';
const trimKeySep = str => trim(str, keySep);
const splitByKeySep = str => split(str, keySep);
export const safeKey = key => replace(`${keySep}${trimKeySep(key)}`, `${keySep}${keySep}`, keySep);
export const joinKey = (...strs) => {
  const paramsOrArray = strs.length === 1 & isArray(strs[0])
    ? strs[0] : strs;
  return safeKey(join(paramsOrArray, keySep));
};
export const splitKey = $$(trimKeySep, splitByKeySep);
export const getDirFomKey = $$(splitKey, dropRight, p => joinKey(...p));
export const getFileFromKey = $$(splitKey, takeRight, head);

export const configFolder = `${keySep}.config`;
export const fieldDefinitions = joinKey(configFolder, 'fields.json');
export const templateDefinitions = joinKey(configFolder, 'templates.json');
export const appDefinitionFile = joinKey(configFolder, 'appDefinition.json');
export const dirIndex = folderPath => joinKey(configFolder, 'dir', ...splitKey(folderPath), 'dir.idx');
export const getIndexKeyFromFileKey = $$(getDirFomKey, dirIndex);

export const ifExists = (val, exists, notExists) => (isUndefined(val)
  ? isUndefined(notExists) ? (() => { })() : notExists()
  : exists());

export const getOrDefault = (val, defaultVal) => ifExists(val, () => val, () => defaultVal);

export const not = func => val => !func(val);
export const isDefined = not(isUndefined);
export const isNonNull = not(isNull);
export const isNotNaN = not(isNaN);

export const allTrue = (...funcArgs) => val => reduce(funcArgs,
  (result, conditionFunc) => (isNull(result) || result == true) && conditionFunc(val),
  null);

export const anyTrue = (...funcArgs) => val => reduce(funcArgs,
  (result, conditionFunc) => result == true || conditionFunc(val),
  null);

export const insensitiveEquals = (str1, str2) => str1.trim().toLowerCase() === str2.trim().toLowerCase();

export const isSomething = allTrue(isDefined, isNonNull, isNotNaN);
export const isNothing = not(isSomething);
export const isNothingOrEmpty = v => isNothing(v) || isEmpty(v);
export const somethingOrGetDefault = getDefaultFunc => val => (isSomething(val) ? val : getDefaultFunc());
export const somethingOrDefault = (val, defaultVal) => somethingOrGetDefault(constant(defaultVal))(val);

export const mapIfSomethingOrDefault = (mapFunc, defaultVal) => val => (isSomething(val) ? mapFunc(val) : defaultVal);

export const mapIfSomethingOrBlank = mapFunc => mapIfSomethingOrDefault(mapFunc, '');

export const none = predicate => collection => !some(predicate)(collection);

export const all = predicate => collection => none(v => !predicate(v))(collection);

export const isNotEmpty = ob => !isEmpty(ob);
export const isAsync = fn => fn.constructor.name === 'AsyncFunction';
export const isNonEmptyArray = allTrue(isArray, isNotEmpty);
export const isNonEmptyString = allTrue(isString, isNotEmpty);
export const tryOr = failFunc => (func, ...args) => {
  try {
    return func.apply(null, ...args);
  } catch (_) {
    return failFunc();
  }
};

export const tryAwaitOr = failFunc => async (func, ...args) => {
  try {
    return await func.apply(null, ...args);
  } catch (_) {
    return await failFunc();
  }
};

export const defineError = (func, errorPrefix) => {
  try {
    return func();
  } catch (err) {
    err.message = `${errorPrefix} : ${err.message}`;
    throw err;
  }
};

export const tryOrIgnore = tryOr(() => { });
export const tryAwaitOrIgnore = tryAwaitOr(async () => { });
export const causesException = (func) => {
  try {
    func();
    return false;
  } catch (e) {
    return true;
  }
};

export const executesWithoutException = func => !causesException(func);

export const handleErrorWith = returnValInError => tryOr(constant(returnValInError));

export const handleErrorWithUndefined = handleErrorWith(undefined);

export const switchCase = (...cases) => (value) => {
  const nextCase = () => head(cases)[0](value);
  const nextResult = () => head(cases)[1](value);

  if (isEmpty(cases)) return; // undefined
  if (nextCase() === true) return nextResult();
  return switchCase(...tail(cases))(value);
};

export const isValue = val1 => val2 => (val1 === val2);
export const isOneOf = (...vals) => val => includes(vals, val);
export const defaultCase = constant(true);
export const memberMatches = (member, match) => obj => match(obj[member]);


export const StartsWith = searchFor => searchIn => startsWith(searchIn, searchFor);

export const contains = val => array => (findIndex(array, v => v === val) > -1);

export const getHashCode = (s) => {
  let hash = 0; let i; let char; let
    l;
  if (s.length == 0) return hash;
  for (i = 0, l = s.length; i < l; i++) {
    char = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }

  // converting to string, but dont want a "-" prefixed
  if (hash < 0) { return `n${(hash * -1).toString()}`; }
  return hash.toString();
};

// thanks to https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
export const awEx = async (promise) => {
  try {
    const result = await promise;
    return [undefined, result];
  } catch (error) {
    return [error, undefined];
  }
};

export const isSafeInteger = n => isInteger(n)
    && n <= Number.MAX_SAFE_INTEGER
    && n >= 0 - Number.MAX_SAFE_INTEGER;

export const toDateOrNull = s => (isNull(s) ? null
  : isDate(s) ? s : new Date(s));
export const toBoolOrNull = s => (isNull(s) ? null
  : s === 'true' || s === true);
export const toNumberOrNull = s => (isNull(s) ? null
  : toNumber(s));

export const isArrayOfString = opts => isArray(opts) && all(isString)(opts);

export const pause = async duration => new Promise(res => setTimeout(res, duration));

export const retry = async (fn, retries, delay, ...args) => {
  try {
    return await fn(...args);
  } catch (err) {
    if (retries > 1) {
      return await pause(delay).then(async () => await retry(fn, (retries - 1), delay, ...args));
    }
    throw err;
  }
};

export { events } from './events';
export { apiWrapper, apiWrapperSync } from './apiWrapper';
export {
  getLock, NO_LOCK, releaseLock,
  extendLock, isNolock,
} from './lock';

export default {
  ifExists,
  getOrDefault,
  isDefined,
  isNonNull,
  isNotNaN,
  allTrue,
  isSomething,
  mapIfSomethingOrDefault,
  mapIfSomethingOrBlank,
  configFolder,
  fieldDefinitions,
  isNothing,
  not,
  switchCase,
  defaultCase,
  StartsWith,
  contains,
  templateDefinitions,
  handleErrorWith,
  handleErrorWithUndefined,
  tryOr,
  tryOrIgnore,
  tryAwaitOr,
  tryAwaitOrIgnore,
  dirIndex,
  keySep,
  $,
  $$,
  getDirFomKey,
  getFileFromKey,
  splitKey,
  somethingOrDefault,
  getIndexKeyFromFileKey,
  joinKey,
  somethingOrGetDefault,
  appDefinitionFile,
  isValue,
  all,
  isOneOf,
  memberMatches,
  defineError,
  anyTrue,
  isNonEmptyArray,
  causesException,
  executesWithoutException,
  none,
  getHashCode,
  awEx,
  apiWrapper,
  events,
  eventsList,
  isNothingOrEmpty,
  isSafeInteger,
  toNumber,
  toDate: toDateOrNull,
  toBool: toBoolOrNull,
  isArrayOfString,
  getLock,
  NO_LOCK,
  isNolock,
  insensitiveEquals,
  pause,
  retry,
};
