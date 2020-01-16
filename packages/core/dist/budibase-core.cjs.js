'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fp = require('lodash/fp');
var shortid = require('shortid');
var _ = require('lodash');
var ___default = _interopDefault(_);
var compilerUtil = require('@nx-js/compiler-util');
var lunr = _interopDefault(require('lunr'));
var safeBuffer = require('safe-buffer');

const commonPlus = extra => fp.union(['onBegin', 'onComplete', 'onError'])(extra);

const common = () => commonPlus([]);

const _events = {
  recordApi: {
    save: commonPlus([
      'onInvalid',
      'onRecordUpdated',
      'onRecordCreated']),
    delete: common(),
    getContext: common(),
    getNew: common(),
    load: common(),
    validate: common(),
    uploadFile: common(),
    downloadFile: common(),
  },
  indexApi: {
    buildIndex: common(),
    listItems: common(),
    delete: common(),
    aggregates: common(),
  },
  collectionApi: {
    getAllowedRecordTypes: common(),
    initialise: common(),
    delete: common(),
  },
  authApi: {
    authenticate: common(),
    authenticateTemporaryAccess: common(),
    createTemporaryAccess: common(),
    createUser: common(),
    enableUser: common(),
    disableUser: common(),
    loadAccessLevels: common(),
    getNewAccessLevel: common(),
    getNewUser: common(),
    getNewUserAuth: common(),
    getUsers: common(),
    saveAccessLevels: common(),
    isAuthorized: common(),
    changeMyPassword: common(),
    setPasswordFromTemporaryCode: common(),
    scorePassword: common(),
    isValidPassword: common(),
    validateUser: common(),
    validateAccessLevels: common(),
    setUserAccessLevels: common(),
  },
  templateApi: {
    saveApplicationHierarchy: common(),
    saveActionsAndTriggers: common(),
  },
  actionsApi: {
    execute: common(),
  },
};

const _eventsList = [];

const makeEvent = (area, method, name) => `${area}:${method}:${name}`;

for (const areaKey in _events) {
  for (const methodKey in _events[areaKey]) {
    _events[areaKey][methodKey] = fp.reduce((obj, s) => {
      obj[s] = makeEvent(areaKey, methodKey, s);
      return obj;
    },
    {})(_events[areaKey][methodKey]);
  }
}


for (const areaKey in _events) {
  for (const methodKey in _events[areaKey]) {
    for (const name in _events[areaKey][methodKey]) {
      _eventsList.push(
        _events[areaKey][methodKey][name],
      );
    }
  }
}


const events = _events;

const eventsList = _eventsList;

class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.httpStatusCode = 400;
    }
}

class UnauthorisedError extends Error {
    constructor(message) {
        super(message);
        this.httpStatusCode = 401;
    }
}

class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.httpStatusCode = 403;
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.httpStatusCode = 404;
    }
}

const apiWrapper = async (app, eventNamespace, isAuthorized, eventContext, func, ...params) => {
  pushCallStack(app, eventNamespace);

  if (!isAuthorized(app)) {
    handleNotAuthorized(app, eventContext, eventNamespace);
    return;
  }

  const startDate = Date.now();
  const elapsed = () => (Date.now() - startDate);

  try {
    await app.publish(
      eventNamespace.onBegin,
      eventContext,
    );

    const result = await func(...params);

    await publishComplete(app, eventContext, eventNamespace, elapsed, result);
    return result;
  } catch (error) {
    await publishError(app, eventContext, eventNamespace, elapsed, error);
    throw error;
  }
};

const apiWrapperSync = (app, eventNamespace, isAuthorized, eventContext, func, ...params) => {
  pushCallStack(app, eventNamespace);

  if (!isAuthorized(app)) {
    handleNotAuthorized(app, eventContext, eventNamespace);
    return;
  }

  const startDate = Date.now();
  const elapsed = () => (Date.now() - startDate);

  try {
    app.publish(
      eventNamespace.onBegin,
      eventContext,
    );

    const result = func(...params);

    publishComplete(app, eventContext, eventNamespace, elapsed, result);
    return result;
  } catch (error) {
    publishError(app, eventContext, eventNamespace, elapsed, error);
    throw error;
  }
};

const handleNotAuthorized = (app, eventContext, eventNamespace) => {
  const err = new UnauthorisedError(`Unauthorized: ${eventNamespace}`);
  publishError(app, eventContext, eventNamespace, () => 0, err);
  throw err;
};

const pushCallStack = (app, eventNamespace, seedCallId) => {
  const callId = shortid.generate();

  const createCallStack = () => ({
    seedCallId: !fp.isUndefined(seedCallId)
      ? seedCallId
      : callId,
    threadCallId: callId,
    stack: [],
  });

  if (fp.isUndefined(app.calls)) {
    app.calls = createCallStack();
  }

  app.calls.stack.push({
    namespace: eventNamespace,
    callId,
  });
};

const popCallStack = (app) => {
  app.calls.stack.pop();
  if (app.calls.stack.length === 0) {
    delete app.calls;
  }
};

const publishError = async (app, eventContext, eventNamespace, elapsed, err) => {
  const ctx = fp.cloneDeep(eventContext);
  ctx.error = err;
  ctx.elapsed = elapsed();
  await app.publish(
    eventNamespace.onError,
    ctx,
  );
  popCallStack(app);
};

const publishComplete = async (app, eventContext, eventNamespace, elapsed, result) => {
  const endcontext = fp.cloneDeep(eventContext);
  endcontext.result = result;
  endcontext.elapsed = elapsed();
  await app.publish(
    eventNamespace.onComplete,
    endcontext,
  );
  popCallStack(app);
  return result;
};

const lockOverlapMilliseconds = 10;

const getLock = async (app, lockFile, timeoutMilliseconds, maxLockRetries, retryCount = 0) => {
  try {
    const timeout = (await app.getEpochTime())
            + timeoutMilliseconds;

    const lock = {
      timeout,
      key: lockFile,
      totalTimeout: timeoutMilliseconds,
    };

    await app.datastore.createFile(
      lockFile,
      getLockFileContent(
        lock.totalTimeout,
        lock.timeout,
      ),
    );

    return lock;
  } catch (e) {
    if (retryCount == maxLockRetries) { return NO_LOCK; }

    const lock = parseLockFileContent(
      lockFile,
      await app.datastore.loadFile(lockFile),
    );

    const currentEpochTime = await app.getEpochTime();

    if (currentEpochTime < lock.timeout) {
      return NO_LOCK;
    }

    try {
      await app.datastore.deleteFile(lockFile);
    } catch (_) {
      //empty
    }

    await sleepForRetry();

    return await getLock(
      app, lockFile, timeoutMilliseconds,
      maxLockRetries, retryCount + 1,
    );
  }
};

const getLockFileContent = (totalTimeout, epochTime) => `${totalTimeout}:${epochTime.toString()}`;

const parseLockFileContent = (key, content) => $(content, [
  fp.split(':'),
  parts => ({
    totalTimeout: new Number(parts[0]),
    timeout: new Number(parts[1]),
    key,
  }),
]);

const releaseLock = async (app, lock) => {
  const currentEpochTime = await app.getEpochTime();
  // only release if not timedout
  if (currentEpochTime < (lock.timeout - lockOverlapMilliseconds)) {
    try {
      await app.datastore.deleteFile(lock.key);
    } catch (_) {
      //empty
    }
  }
};

const NO_LOCK = 'no lock';
const isNolock = id => id === NO_LOCK;

const sleepForRetry = () => new Promise(resolve => setTimeout(resolve, lockOverlapMilliseconds));

// this is the combinator function
const $$ = (...funcs) => arg => _.flow(funcs)(arg);

// this is the pipe function
const $ = (arg, funcs) => $$(...funcs)(arg);

const keySep = '/';
const trimKeySep = str => _.trim(str, keySep);
const splitByKeySep = str => fp.split(keySep)(str);
const safeKey = key => _.replace(`${keySep}${trimKeySep(key)}`, `${keySep}${keySep}`, keySep);
const joinKey = (...strs) => {
  const paramsOrArray = strs.length === 1 & fp.isArray(strs[0])
    ? strs[0] : strs;
  return $(paramsOrArray, [
    fp.filter(s => !fp.isUndefined(s) 
                && !fp.isNull(s) 
                && s.toString().length > 0),
    fp.join(keySep),
    safeKey
  ]);
};
const splitKey = $$(trimKeySep, splitByKeySep);
const getDirFomKey = $$(splitKey, _.dropRight, p => joinKey(...p));
const getFileFromKey = $$(splitKey, _.takeRight, _.head);

const configFolder = `${keySep}.config`;
const fieldDefinitions = joinKey(configFolder, 'fields.json');
const templateDefinitions = joinKey(configFolder, 'templates.json');
const appDefinitionFile = joinKey(configFolder, 'appDefinition.json');
const dirIndex = folderPath => joinKey(configFolder, 'dir', ...splitKey(folderPath), 'dir.idx');
const getIndexKeyFromFileKey = $$(getDirFomKey, dirIndex);

const ifExists = (val, exists, notExists) => (fp.isUndefined(val)
  ? fp.isUndefined(notExists) ? (() => { })() : notExists()
  : exists());

const getOrDefault = (val, defaultVal) => ifExists(val, () => val, () => defaultVal);

const not = func => val => !func(val);
const isDefined = not(fp.isUndefined);
const isNonNull = not(fp.isNull);
const isNotNaN = not(fp.isNaN);

const allTrue = (...funcArgs) => val => fp.reduce(
  (result, conditionFunc) => (fp.isNull(result) || result == true) && conditionFunc(val),
  null)(funcArgs);

const anyTrue = (...funcArgs) => val => fp.reduce(
  (result, conditionFunc) => result == true || conditionFunc(val),
  null)(funcArgs);

const insensitiveEquals = (str1, str2) => str1.trim().toLowerCase() === str2.trim().toLowerCase();

const isSomething = allTrue(isDefined, isNonNull, isNotNaN);
const isNothing = not(isSomething);
const isNothingOrEmpty = v => isNothing(v) || fp.isEmpty(v);
const somethingOrGetDefault = getDefaultFunc => val => (isSomething(val) ? val : getDefaultFunc());
const somethingOrDefault = (val, defaultVal) => somethingOrGetDefault(fp.constant(defaultVal))(val);

const mapIfSomethingOrDefault = (mapFunc, defaultVal) => val => (isSomething(val) ? mapFunc(val) : defaultVal);

const mapIfSomethingOrBlank = mapFunc => mapIfSomethingOrDefault(mapFunc, '');

const none = predicate => collection => !fp.some(predicate)(collection);

const all = predicate => collection => none(v => !predicate(v))(collection);

const isNotEmpty = ob => !fp.isEmpty(ob);
const isNonEmptyArray = allTrue(fp.isArray, isNotEmpty);
const isNonEmptyString = allTrue(fp.isString, isNotEmpty);
const tryOr = failFunc => (func, ...args) => {
  try {
    return func.apply(null, ...args);
  } catch (_) {
    return failFunc();
  }
};

const tryAwaitOr = failFunc => async (func, ...args) => {
  try {
    return await func.apply(null, ...args);
  } catch (_) {
    return await failFunc();
  }
};

const defineError = (func, errorPrefix) => {
  try {
    return func();
  } catch (err) {
    err.message = `${errorPrefix} : ${err.message}`;
    throw err;
  }
};

const tryOrIgnore = tryOr(() => { });
const tryAwaitOrIgnore = tryAwaitOr(async () => { });
const causesException = (func) => {
  try {
    func();
    return false;
  } catch (e) {
    return true;
  }
};

const executesWithoutException = func => !causesException(func);

const handleErrorWith = returnValInError => tryOr(fp.constant(returnValInError));

const handleErrorWithUndefined = handleErrorWith(undefined);

const switchCase = (...cases) => (value) => {
  const nextCase = () => _.head(cases)[0](value);
  const nextResult = () => _.head(cases)[1](value);

  if (fp.isEmpty(cases)) return; // undefined
  if (nextCase() === true) return nextResult();
  return switchCase(..._.tail(cases))(value);
};

const isValue = val1 => val2 => (val1 === val2);
const isOneOf = (...vals) => val => fp.includes(val)(vals);
const defaultCase = fp.constant(true);
const memberMatches = (member, match) => obj => match(obj[member]);


const StartsWith = searchFor => searchIn => _.startsWith(searchIn, searchFor);

const contains = val => array => (_.findIndex(array, v => v === val) > -1);

const getHashCode = (s) => {
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
const awEx = async (promise) => {
  try {
    const result = await promise;
    return [undefined, result];
  } catch (error) {
    return [error, undefined];
  }
};

const isSafeInteger = n => fp.isInteger(n)
    && n <= Number.MAX_SAFE_INTEGER
    && n >= 0 - Number.MAX_SAFE_INTEGER;

const toDateOrNull = s => (fp.isNull(s) ? null
  : fp.isDate(s) ? s : new Date(s));
const toBoolOrNull = s => (fp.isNull(s) ? null
  : s === 'true' || s === true);
const toNumberOrNull = s => (fp.isNull(s) ? null
  : fp.toNumber(s));

const isArrayOfString = opts => fp.isArray(opts) && all(fp.isString)(opts);

const pushAll = (target, items) => {
  for(let i of items) target.push(i);
};

const pause = async duration => new Promise(res => setTimeout(res, duration));

const retry = async (fn, retries, delay, ...args) => {
  try {
    return await fn(...args);
  } catch (err) {
    if (retries > 1) {
      return await pause(delay).then(async () => await retry(fn, (retries - 1), delay, ...args));
    }
    throw err;
  }
};

var index = {
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
  toNumber: fp.toNumber,
  toDate: toDateOrNull,
  toBool: toBoolOrNull,
  isArrayOfString,
  getLock,
  NO_LOCK,
  isNolock,
  insensitiveEquals,
  pause,
  retry,
  pushAll
};

const stringNotEmpty = s => isSomething(s) && s.trim().length > 0;

const makerule = (field, error, isValid) => ({ field, error, isValid });

const validationError = (rule, item) => ({ ...rule, item });

const applyRuleSet = ruleSet => itemToValidate => $(ruleSet, [
  fp.map(applyRule(itemToValidate)),
  fp.filter(isSomething),
]);

const applyRule = itemTovalidate => rule => (rule.isValid(itemTovalidate)
  ? null
  : validationError(rule, itemTovalidate));

const filterEval = 'FILTER_EVALUATE';
const filterCompile = 'FILTER_COMPILE';
const mapEval = 'MAP_EVALUATE';
const mapCompile = 'MAP_COMPILE';


const getEvaluateResult = () => ({
  isError: false,
  passedFilter: true,
  result: null,
});

const compileFilter = index => compilerUtil.compileExpression(index.filter);

const compileMap = index => compilerUtil.compileCode(index.map);

const passesFilter = (record, index) => {
  const context = { record };
  if (!index.filter) return true;

  const compiledFilter = defineError(
    () => compileFilter(index),
    filterCompile,
  );

  return defineError(
    () => compiledFilter(context),
    filterEval,
  );
};

const mapRecord = (record, index) => {
  const recordClone = fp.cloneDeep(record);
  const context = { record: recordClone };

  const map = index.map ? index.map : 'return {...record};';

  const compiledMap = defineError(
    () => compilerUtil.compileCode(map),
    mapCompile,
  );

  const mapped = defineError(
    () => compiledMap(context),
    mapEval,
  );

  const mappedKeys = fp.keys(mapped);
  for (let i = 0; i < mappedKeys.length; i++) {
    const key = mappedKeys[i];
    mapped[key] = fp.isUndefined(mapped[key]) ? null : mapped[key];
    if (fp.isFunction(mapped[key])) {
      delete mapped[key];
    }
  }

  mapped.key = record.key;
  mapped.sortKey = index.getSortKey
    ? compilerUtil.compileCode(index.getSortKey)(context)
    : record.id;

  return mapped;
};

const evaluate = record => (index) => {
  const result = getEvaluateResult();

  try {
    result.passedFilter = passesFilter(record, index);
  } catch (err) {
    result.isError = true;
    result.passedFilter = false;
    result.result = err.message;
  }

  if (!result.passedFilter) return result;

  try {
    result.result = mapRecord(record, index);
  } catch (err) {
    result.isError = true;
    result.result = err.message;
  }

  return result;
};

const indexTypes = { reference: 'reference', ancestor: 'ancestor' };

const indexRuleSet = [
  makerule('map', 'index has no map function',
    index => isNonEmptyString(index.map)),
  makerule('map', "index's map function does not compile",
    index => !isNonEmptyString(index.map)
                || executesWithoutException(() => compileMap(index))),
  makerule('filter', "index's filter function does not compile",
    index => !isNonEmptyString(index.filter)
                || executesWithoutException(() => compileFilter(index))),
  makerule('name', 'must declare a name for index',
    index => isNonEmptyString(index.name)),
  makerule('name', 'there is a duplicate named index on this node',
    index => fp.isEmpty(index.name)
                || fp.countBy('name')(index.parent().indexes)[index.name] === 1),
  makerule('indexType', 'reference index may only exist on a record node',
    index => isRecord(index.parent())
                  || index.indexType !== indexTypes.reference),
  makerule('indexType', `index type must be one of: ${fp.join(', ')(fp.keys(indexTypes))}`,
    index => fp.includes(index.indexType)(fp.keys(indexTypes))),
];

const getFlattenedHierarchy = (appHierarchy, useCached = true) => {
  if (isSomething(appHierarchy.getFlattenedHierarchy) && useCached) { return appHierarchy.getFlattenedHierarchy(); }

  const flattenHierarchy = (currentNode, flattened) => {
    flattened.push(currentNode);
    if ((!currentNode.children
            || currentNode.children.length === 0)
            && (!currentNode.indexes
            || currentNode.indexes.length === 0)
            && (!currentNode.aggregateGroups
            || currentNode.aggregateGroups.length === 0)) {
      return flattened;
    }

    const unionIfAny = l2 => l1 => fp.union(l1)(!l2 ? [] : l2);

    const children = $([], [
      unionIfAny(currentNode.children),
      unionIfAny(currentNode.indexes),
      unionIfAny(currentNode.aggregateGroups),
    ]);

    for (const child of children) {
      flattenHierarchy(child, flattened);
    }
    return flattened;
  };

  appHierarchy.getFlattenedHierarchy = () => flattenHierarchy(appHierarchy, []);
  return appHierarchy.getFlattenedHierarchy();
};

const getLastPartInKey = key => fp.last(splitKey(key));

const getNodesInPath = appHierarchy => key => $(appHierarchy, [
  getFlattenedHierarchy,
  fp.filter(n => new RegExp(`${n.pathRegx()}`).test(key)),
]);

const getExactNodeForKey = appHierarchy => key => $(appHierarchy, [
  getFlattenedHierarchy,
  fp.find(n => new RegExp(`${n.pathRegx()}$`).test(key)),
]);

const getNodeForCollectionPath = appHierarchy => collectionKey => $(appHierarchy, [
  getFlattenedHierarchy,
  fp.find(n => (isCollectionRecord(n)
                   && new RegExp(`${n.collectionPathRegx()}$`).test(collectionKey))),
]);

const hasMatchingAncestor = ancestorPredicate => decendantNode => switchCase(

  [node => isNothing(node.parent()),
    fp.constant(false)],

  [node => ancestorPredicate(node.parent()),
    fp.constant(true)],

  [defaultCase,
    node => hasMatchingAncestor(ancestorPredicate)(node.parent())],

)(decendantNode);

const getNode = (appHierarchy, nodeKey) => $(appHierarchy, [
  getFlattenedHierarchy,
  fp.find(n => n.nodeKey() === nodeKey
                  || (isCollectionRecord(n)
                      && n.collectionNodeKey() === nodeKey)),
]);

const getCollectionNode = (appHierarchy, nodeKey) => $(appHierarchy, [
  getFlattenedHierarchy,
  fp.find(n => (isCollectionRecord(n)
                    && n.collectionNodeKey() === nodeKey)),
]);

const getNodeByKeyOrNodeKey = (appHierarchy, keyOrNodeKey) => {
  const nodeByKey = getExactNodeForKey(appHierarchy)(keyOrNodeKey);
  return isNothing(nodeByKey)
    ? getNode(appHierarchy, keyOrNodeKey)
    : nodeByKey;
};

const getCollectionNodeByKeyOrNodeKey = (appHierarchy, keyOrNodeKey) => {
  const nodeByKey = getNodeForCollectionPath(appHierarchy)(keyOrNodeKey);
  return isNothing(nodeByKey)
    ? getCollectionNode(appHierarchy, keyOrNodeKey)
    : nodeByKey;
};

const isNode = (appHierarchy, key) => isSomething(getExactNodeForKey(appHierarchy)(key));

const getActualKeyOfParent = (parentNodeKey, actualChildKey) => 
  $(actualChildKey, [
    splitKey,
    fp.take(splitKey(parentNodeKey).length),
    ks => joinKey(...ks),
  ]);

const getParentKey = (key) => {
  return $(key, [
    splitKey,
    fp.take(splitKey(key).length - 1),
    joinKey,
  ]);
};

const isKeyAncestorOf = ancestorKey => decendantNode => hasMatchingAncestor(p => p.nodeKey() === ancestorKey)(decendantNode);

const hasNoMatchingAncestors = parentPredicate => node => !hasMatchingAncestor(parentPredicate)(node);

const findField = (recordNode, fieldName) => fp.find(f => f.name == fieldName)(recordNode.fields);

const isAncestor = decendant => ancestor => isKeyAncestorOf(ancestor.nodeKey())(decendant);

const isDecendant = ancestor => decendant => isAncestor(decendant)(ancestor);

const getRecordNodeId = recordKey => $(recordKey, [
  splitKey,
  fp.last,
  getRecordNodeIdFromId,
]);

const getRecordNodeIdFromId = recordId => $(recordId, [fp.split('-'), fp.first, parseInt]);

const getRecordNodeById = (hierarchy, recordId) => $(hierarchy, [
  getFlattenedHierarchy,
  fp.find(n => isRecord(n)
                    && n.nodeId === getRecordNodeIdFromId(recordId)),
]);

const recordNodeIdIsAllowed = indexNode => nodeId => indexNode.allowedRecordNodeIds.length === 0
    || fp.includes(nodeId)(indexNode.allowedRecordNodeIds);

const recordNodeIsAllowed = indexNode => recordNode => recordNodeIdIsAllowed(indexNode)(recordNode.nodeId);

const getAllowedRecordNodesForIndex = (appHierarchy, indexNode) => {
  const recordNodes = $(appHierarchy, [
    getFlattenedHierarchy,
    fp.filter(isRecord),
  ]);

  if (isGlobalIndex(indexNode)) {
    return $(recordNodes, [
      fp.filter(recordNodeIsAllowed(indexNode)),
    ]);
  }

  if (isAncestorIndex(indexNode)) {
    return $(recordNodes, [
      fp.filter(isDecendant(indexNode.parent())),
      fp.filter(recordNodeIsAllowed(indexNode)),
    ]);
  }

  if (isReferenceIndex(indexNode)) {
    return $(recordNodes, [
      fp.filter(n => fp.some(fieldReversesReferenceToIndex(indexNode))(n.fields)),
    ]);
  }
};

const getNodeFromNodeKeyHash = hierarchy => hash => $(hierarchy, [
  getFlattenedHierarchy,
  fp.find(n => getHashCode(n.nodeKey()) === hash),
]);

const isRecord = node => isSomething(node) && node.type === 'record';
const isSingleRecord = node => isRecord(node) && node.isSingle;
const isCollectionRecord = node => isRecord(node) && !node.isSingle;
const isIndex = node => isSomething(node) && node.type === 'index';
const isaggregateGroup = node => isSomething(node) && node.type === 'aggregateGroup';
const isShardedIndex = node => isIndex(node) && isNonEmptyString(node.getShardName);
const isRoot = node => isSomething(node) && node.isRoot();
const isDecendantOfARecord = hasMatchingAncestor(isRecord);
const isGlobalIndex = node => isIndex(node) && isRoot(node.parent());
const isReferenceIndex = node => isIndex(node) && node.indexType === indexTypes.reference;
const isAncestorIndex = node => isIndex(node) && node.indexType === indexTypes.ancestor;

const fieldReversesReferenceToNode = node => field => field.type === 'reference'
    && fp.intersection(field.typeOptions.reverseIndexNodeKeys)(fp.map(i => i.nodeKey())(node.indexes))
      .length > 0;

const fieldReversesReferenceToIndex = indexNode => field => field.type === 'reference'
    && fp.intersection(field.typeOptions.reverseIndexNodeKeys)([indexNode.nodeKey()])
      .length > 0;

var hierarchy = {
  getLastPartInKey,
  getNodesInPath,
  getExactNodeForKey,
  hasMatchingAncestor,
  getNode,
  getNodeByKeyOrNodeKey,
  isNode,
  getActualKeyOfParent,
  getParentKey,
  isKeyAncestorOf,
  hasNoMatchingAncestors,
  findField,
  isAncestor,
  isDecendant,
  getRecordNodeId,
  getRecordNodeIdFromId,
  getRecordNodeById,
  recordNodeIdIsAllowed,
  recordNodeIsAllowed,
  getAllowedRecordNodesForIndex,
  getNodeFromNodeKeyHash,
  isRecord,
  isCollectionRecord,
  isIndex,
  isaggregateGroup,
  isShardedIndex,
  isRoot,
  isDecendantOfARecord,
  isGlobalIndex,
  isReferenceIndex,
  isAncestorIndex,
  fieldReversesReferenceToNode,
  fieldReversesReferenceToIndex,
  getFlattenedHierarchy,
};

const getSafeFieldParser = (tryParse, defaultValueFunctions) => (field, record) => {
  if (fp.has(field.name)(record)) {
    return getSafeValueParser(tryParse, defaultValueFunctions)(record[field.name]);
  }
  return defaultValueFunctions[field.getUndefinedValue]();
};

const getSafeValueParser = (tryParse, defaultValueFunctions) => (value) => {
  const parsed = tryParse(value);
  if (parsed.success) {
    return parsed.value;
  }
  return defaultValueFunctions.default();
};

const getNewValue = (tryParse, defaultValueFunctions) => (field) => {
  const getInitialValue = fp.isUndefined(field) || fp.isUndefined(field.getInitialValue)
    ? 'default'
    : field.getInitialValue;

  return fp.has(getInitialValue)(defaultValueFunctions)
    ? defaultValueFunctions[getInitialValue]()
    : getSafeValueParser(tryParse, defaultValueFunctions)(getInitialValue);
};

const typeFunctions = specificFunctions => _.merge({
  value: fp.constant,
  null: fp.constant(null),
}, specificFunctions);

const validateTypeConstraints = validationRules => async (field, record, context) => {
  const fieldValue = record[field.name];
  const validateRule = async r => (!await r.isValid(fieldValue, field.typeOptions, context)
    ? r.getMessage(fieldValue, field.typeOptions)
    : '');

  const errors = [];
  for (const r of validationRules) {
    const err = await validateRule(r);
    if (isNotEmpty(err)) errors.push(err);
  }

  return errors;
};

const getDefaultOptions = fp.mapValues(v => v.defaultValue);

const makerule$1 = (isValid, getMessage) => ({ isValid, getMessage });
const parsedFailed = val => ({ success: false, value: val });
const parsedSuccess = val => ({ success: true, value: val });
const getDefaultExport = (name, tryParse, functions, options, validationRules, sampleValue, stringify) => ({
  getNew: getNewValue(tryParse, functions),
  safeParseField: getSafeFieldParser(tryParse, functions),
  safeParseValue: getSafeValueParser(tryParse, functions),
  tryParse,
  name,
  getDefaultOptions: () => getDefaultOptions(fp.cloneDeep(options)),
  optionDefinitions: options,
  validateTypeConstraints: validateTypeConstraints(validationRules),
  sampleValue,
  stringify: val => (val === null || val === undefined
    ? '' : stringify(val)),
  getDefaultValue: functions.default,
});

const stringFunctions = typeFunctions({
  default: fp.constant(null),
});

const stringTryParse = switchCase(
  [fp.isString, parsedSuccess],
  [fp.isNull, parsedSuccess],
  [defaultCase, v => parsedSuccess(v.toString())],
);

const options = {
  maxLength: {
    defaultValue: null,
    isValid: n => n === null || isSafeInteger(n) && n > 0,
    requirementDescription: 'max length must be null (no limit) or a greater than zero integer',
    parse: toNumberOrNull,
  },
  values: {
    defaultValue: null,
    isValid: v => v === null || (isArrayOfString(v) && v.length > 0 && v.length < 10000),
    requirementDescription: "'values' must be null (no values) or an arry of at least one string",
    parse: s => s,
  },
  allowDeclaredValuesOnly: {
    defaultValue: false,
    isValid: fp.isBoolean,
    requirementDescription: 'allowDeclaredValuesOnly must be true or false',
    parse: toBoolOrNull,
  },
};

const typeConstraints = [
  makerule$1(async (val, opts) => val === null || opts.maxLength === null || val.length <= opts.maxLength,
    (val, opts) => `value exceeds maximum length of ${opts.maxLength}`),
  makerule$1(async (val, opts) => val === null
                           || opts.allowDeclaredValuesOnly === false
                           || fp.includes(val)(opts.values),
  (val) => `"${val}" does not exist in the list of allowed values`),
];

var string = getDefaultExport(
  'string',
  stringTryParse,
  stringFunctions,
  options,
  typeConstraints,
  'abcde',
  str => str,
);

const boolFunctions = typeFunctions({
  default: fp.constant(null),
});

const boolTryParse = switchCase(
  [fp.isBoolean, parsedSuccess],
  [fp.isNull, parsedSuccess],
  [isOneOf('true', '1', 'yes', 'on'), () => parsedSuccess(true)],
  [isOneOf('false', '0', 'no', 'off'), () => parsedSuccess(false)],
  [defaultCase, parsedFailed],
);

const options$1 = {
  allowNulls: {
    defaultValue: true,
    isValid: fp.isBoolean,
    requirementDescription: 'must be a true or false',
    parse: toBoolOrNull,
  },
};

const typeConstraints$1 = [
  makerule$1(async (val, opts) => opts.allowNulls === true || val !== null,
    () => 'field cannot be null'),
];

var bool = getDefaultExport(
  'bool', boolTryParse, boolFunctions,
  options$1, typeConstraints$1, true, JSON.stringify,
);

const numberFunctions = typeFunctions({
  default: fp.constant(null),
});

const parseStringtoNumberOrNull = (s) => {
  const num = Number(s);
  return isNaN(num) ? parsedFailed(s) : parsedSuccess(num);
};

const numberTryParse = switchCase(
  [fp.isNumber, parsedSuccess],
  [fp.isString, parseStringtoNumberOrNull],
  [fp.isNull, parsedSuccess],
  [defaultCase, parsedFailed],
);

const options$2 = {
  maxValue: {
    defaultValue: Number.MAX_SAFE_INTEGER,
    isValid: isSafeInteger,
    requirementDescription: 'must be a valid integer',
    parse: toNumberOrNull,
  },
  minValue: {
    defaultValue: 0 - Number.MAX_SAFE_INTEGER,
    isValid: isSafeInteger,
    requirementDescription: 'must be a valid integer',
    parse: toNumberOrNull,
  },
  decimalPlaces: {
    defaultValue: 0,
    isValid: n => isSafeInteger(n) && n >= 0,
    requirementDescription: 'must be a positive integer',
    parse: toNumberOrNull,
  },
};

const getDecimalPlaces = (val) => {
  const splitDecimal = val.toString().split('.');
  if (splitDecimal.length === 1) return 0;
  return splitDecimal[1].length;
};

const typeConstraints$2 = [
  makerule$1(async (val, opts) => val === null || opts.minValue === null || val >= opts.minValue,
    (val, opts) => `value (${val.toString()}) must be greater than or equal to ${opts.minValue}`),
  makerule$1(async (val, opts) => val === null || opts.maxValue === null || val <= opts.maxValue,
    (val, opts) => `value (${val.toString()}) must be less than or equal to ${opts.minValue} options`),
  makerule$1(async (val, opts) => val === null || opts.decimalPlaces >= getDecimalPlaces(val),
    (val, opts) => `value (${val.toString()}) must have ${opts.decimalPlaces} decimal places or less`),
];

var number = getDefaultExport(
  'number',
  numberTryParse,
  numberFunctions,
  options$2,
  typeConstraints$2,
  1,
  num => num.toString(),
);

const dateFunctions = typeFunctions({
  default: fp.constant(null),
  now: () => new Date(),
});

const isValidDate = d => d instanceof Date && !isNaN(d);

const parseStringToDate = s => switchCase(
  [isValidDate, parsedSuccess],
  [defaultCase, parsedFailed],
)(new Date(s));


const dateTryParse = switchCase(
  [fp.isDate, parsedSuccess],
  [fp.isString, parseStringToDate],
  [fp.isNull, parsedSuccess],
  [defaultCase, parsedFailed],
);

const options$3 = {
  maxValue: {
    defaultValue: new Date(32503680000000),
    isValid: fp.isDate,
    requirementDescription: 'must be a valid date',
    parse: toDateOrNull,
  },
  minValue: {
    defaultValue: new Date(-8520336000000),
    isValid: fp.isDate,
    requirementDescription: 'must be a valid date',
    parse: toDateOrNull,
  },
};

const typeConstraints$3 = [
  makerule$1(async (val, opts) => val === null || opts.minValue === null || val >= opts.minValue,
    (val, opts) => `value (${val.toString()}) must be greater than or equal to ${opts.minValue}`),
  makerule$1(async (val, opts) => val === null || opts.maxValue === null || val <= opts.maxValue,
    (val, opts) => `value (${val.toString()}) must be less than or equal to ${opts.minValue} options`),
];

var datetime = getDefaultExport(
  'datetime',
  dateTryParse,
  dateFunctions,
  options$3,
  typeConstraints$3,
  new Date(1984, 4, 1),
  date => JSON.stringify(date).replace(new RegExp('"', 'g'), ''),
);

const arrayFunctions = () => typeFunctions({
  default: fp.constant([]),
});

const mapToParsedArrary = type => $$(
  fp.map(i => type.safeParseValue(i)),
  parsedSuccess,
);

const arrayTryParse = type => switchCase(
  [fp.isArray, mapToParsedArrary(type)],
  [defaultCase, parsedFailed],
);

const typeName = type => `array<${type}>`;


const options$4 = {
  maxLength: {
    defaultValue: 10000,
    isValid: isSafeInteger,
    requirementDescription: 'must be a positive integer',
    parse: toNumberOrNull,
  },
  minLength: {
    defaultValue: 0,
    isValid: n => isSafeInteger(n) && n >= 0,
    requirementDescription: 'must be a positive integer',
    parse: toNumberOrNull,
  },
};

const typeConstraints$4 = [
  makerule$1(async (val, opts) => val === null || val.length >= opts.minLength,
    (val, opts) => `must choose ${opts.minLength} or more options`),
  makerule$1(async (val, opts) => val === null || val.length <= opts.maxLength,
    (val, opts) => `cannot choose more than ${opts.maxLength} options`),
];

var array = type => getDefaultExport(
  typeName(type.name),
  arrayTryParse(type),
  arrayFunctions(),
  options$4,
  typeConstraints$4,
  [type.sampleValue],
  JSON.stringify,
);

const referenceNothing = () => ({ key: '' });

const referenceFunctions = typeFunctions({
  default: referenceNothing,
});

const hasStringValue = (ob, path) => fp.has(path)(ob)
    && fp.isString(ob[path]);

const isObjectWithKey = v => fp.isObjectLike(v)
    && hasStringValue(v, 'key');

const tryParseFromString = s => {

  try {
    const asObj = JSON.parse(s);
    if(isObjectWithKey) {
      return parsedSuccess(asObj);
    }
  }
  catch(_) {
    // EMPTY
  }

  return parsedFailed(s);
};

const referenceTryParse = v => switchCase(
  [isObjectWithKey, parsedSuccess],
  [fp.isString, tryParseFromString],
  [fp.isNull, () => parsedSuccess(referenceNothing())],
  [defaultCase, parsedFailed],
)(v);

const options$5 = {
  indexNodeKey: {
    defaultValue: null,
    isValid: isNonEmptyString,
    requirementDescription: 'must be a non-empty string',
    parse: s => s,
  },
  displayValue: {
    defaultValue: '',
    isValid: isNonEmptyString,
    requirementDescription: 'must be a non-empty string',
    parse: s => s,
  },
  reverseIndexNodeKeys: {
    defaultValue: null,
    isValid: v => isArrayOfString(v) && v.length > 0,
    requirementDescription: 'must be a non-empty array of strings',
    parse: s => s,
  },
};

const isEmptyString = s => fp.isString(s) && fp.isEmpty(s);

const ensureReferenceExists = async (val, opts, context) => isEmptyString(val.key)
    || await context.referenceExists(opts, val.key);

const typeConstraints$5 = [
  makerule$1(
    ensureReferenceExists,
    (val, opts) => `"${val[opts.displayValue]}" does not exist in options list (key: ${val.key})`,
  ),
];

var reference = getDefaultExport(
  'reference',
  referenceTryParse,
  referenceFunctions,
  options$5,
  typeConstraints$5,
  { key: 'key', value: 'value' },
  JSON.stringify,
);

const illegalCharacters = '*?\\/:<>|\0\b\f\v';

const isLegalFilename = (filePath) => {
  const fn = fileName(filePath);
  return fn.length <= 255
    && fp.intersection(fn.split(''))(illegalCharacters.split('')).length === 0
    && none(f => f === '..')(splitKey(filePath));
};

const fileNothing = () => ({ relativePath: '', size: 0 });

const fileFunctions = typeFunctions({
  default: fileNothing,
});

const fileTryParse = v => switchCase(
  [isValidFile, parsedSuccess],
  [fp.isNull, () => parsedSuccess(fileNothing())],
  [defaultCase, parsedFailed],
)(v);

const fileName = filePath => $(filePath, [
  splitKey,
  fp.last,
]);

const isValidFile = f => !fp.isNull(f)
    && fp.has('relativePath')(f) && fp.has('size')(f)
    && fp.isNumber(f.size)
    && fp.isString(f.relativePath)
    && isLegalFilename(f.relativePath);

const options$6 = {};

const typeConstraints$6 = [];

var file = getDefaultExport(
  'file',
  fileTryParse,
  fileFunctions,
  options$6,
  typeConstraints$6,
  { relativePath: 'some_file.jpg', size: 1000 },
  JSON.stringify,
);

const allTypes = () => {
  const basicTypes = {
    string, number, datetime, bool, reference, file,
  };

  const arrays = $(basicTypes, [
    fp.keys,
    fp.map((k) => {
      const kvType = {};
      const concreteArray = array(basicTypes[k]);
      kvType[concreteArray.name] = concreteArray;
      return kvType;
    }),
    types => _.assign({}, ...types),
  ]);

  return _.merge({}, basicTypes, arrays);
};


const all$1 = allTypes();

const getType = (typeName) => {
  if (!fp.has(typeName)(all$1)) throw new BadRequestError(`Do not recognise type ${typeName}`);
  return all$1[typeName];
};

const getSampleFieldValue = field => getType(field.type).sampleValue;

const getNewFieldValue = field => getType(field.type).getNew(field);

const safeParseField = (field, record) => getType(field.type).safeParseField(field, record);

const validateFieldParse = (field, record) => (fp.has(field.name)(record)
  ? getType(field.type).tryParse(record[field.name])
  : parsedSuccess(undefined)); // fields may be undefined by default

const getDefaultOptions$1 = type => getType(type).getDefaultOptions();

const validateTypeConstraints$1 = async (field, record, context) => await getType(field.type).validateTypeConstraints(field, record, context);

const detectType = (value) => {
  if (fp.isString(value)) return string;
  if (fp.isBoolean(value)) return bool;
  if (fp.isNumber(value)) return number;
  if (fp.isDate(value)) return datetime;
  if (fp.isArray(value)) return array(detectType(value[0]));
  if (fp.isObject(value)
       && fp.has('key')(value)
       && fp.has('value')(value)) return reference;
  if (fp.isObject(value)
        && fp.has('relativePath')(value)
        && fp.has('size')(value)) return file;

  throw new BadRequestError(`cannot determine type: ${JSON.stringify(value)}`);
};

// 5 minutes
const tempCodeExpiryLength = 5 * 60 * 1000;

const AUTH_FOLDER = '/.auth';
const USERS_LIST_FILE = joinKey(AUTH_FOLDER, 'users.json');
const userAuthFile = username => joinKey(AUTH_FOLDER, `auth_${username}.json`);
const USERS_LOCK_FILE = joinKey(AUTH_FOLDER, 'users_lock');
const ACCESS_LEVELS_FILE = joinKey(AUTH_FOLDER, 'access_levels.json');
const ACCESS_LEVELS_LOCK_FILE = joinKey(AUTH_FOLDER, 'access_levels_lock');

const permissionTypes = {
  CREATE_RECORD: 'create record',
  UPDATE_RECORD: 'update record',
  READ_RECORD: 'read record',
  DELETE_RECORD: 'delete record',
  READ_INDEX: 'read index',
  MANAGE_INDEX: 'manage index',
  MANAGE_COLLECTION: 'manage collection',
  WRITE_TEMPLATES: 'write templates',
  CREATE_USER: 'create user',
  SET_PASSWORD: 'set password',
  CREATE_TEMPORARY_ACCESS: 'create temporary access',
  ENABLE_DISABLE_USER: 'enable or disable user',
  WRITE_ACCESS_LEVELS: 'write access levels',
  LIST_USERS: 'list users',
  LIST_ACCESS_LEVELS: 'list access levels',
  EXECUTE_ACTION: 'execute action',
  SET_USER_ACCESS_LEVELS: 'set user access levels',
};

const getUserByName = (users, name) => $(users, [
  fp.find(u => u.name.toLowerCase() === name.toLowerCase()),
]);

const stripUserOfSensitiveStuff = (user) => {
  const stripped = fp.clone(user);
  delete stripped.tempCode;
  return stripped;
};

const parseTemporaryCode = fullCode => $(fullCode, [
  fp.split(':'),
  parts => ({
    id: parts[1],
    code: parts[2],
  }),
]);

const isAuthorized = app => (permissionType, resourceKey) => apiWrapperSync(
  app,
  events.authApi.isAuthorized,
  alwaysAuthorized,
  { resourceKey, permissionType },
  _isAuthorized, app, permissionType, resourceKey,
);

const _isAuthorized = (app, permissionType, resourceKey) => {
  if (!app.user) {
    return false;
  }

  const validType = $(permissionTypes, [
    fp.values,
    fp.includes(permissionType),
  ]);

  if (!validType) {
    return false;
  }

  const permMatchesResource = (userperm) => {
    const nodeKey = isNothing(resourceKey)
      ? null
      : isNode(app.hierarchy, resourceKey)
        ? getNodeByKeyOrNodeKey(
          app.hierarchy, resourceKey,
        ).nodeKey()
        : resourceKey;

    return (userperm.type === permissionType)
        && (
          isNothing(resourceKey)
            || nodeKey === userperm.nodeKey
        );
  };

  return $(app.user.permissions, [
    fp.some(permMatchesResource),
  ]);
};

const nodePermission = type => ({
  add: (nodeKey, accessLevel) => accessLevel.permissions.push({ type, nodeKey }),
  isAuthorized: resourceKey => app => isAuthorized(app)(type, resourceKey),
  isNode: true,
  get: nodeKey => ({ type, nodeKey }),
});

const staticPermission = type => ({
  add: accessLevel => accessLevel.permissions.push({ type }),
  isAuthorized: app => isAuthorized(app)(type),
  isNode: false,
  get: () => ({ type }),
});

const createRecord = nodePermission(permissionTypes.CREATE_RECORD);

const updateRecord = nodePermission(permissionTypes.UPDATE_RECORD);

const deleteRecord = nodePermission(permissionTypes.DELETE_RECORD);

const readRecord = nodePermission(permissionTypes.READ_RECORD);

const writeTemplates = staticPermission(permissionTypes.WRITE_TEMPLATES);

const createUser = staticPermission(permissionTypes.CREATE_USER);

const setPassword = staticPermission(permissionTypes.SET_PASSWORD);

const readIndex = nodePermission(permissionTypes.READ_INDEX);

const manageIndex = staticPermission(permissionTypes.MANAGE_INDEX);

const manageCollection = staticPermission(permissionTypes.MANAGE_COLLECTION);

const createTemporaryAccess = staticPermission(permissionTypes.CREATE_TEMPORARY_ACCESS);

const enableDisableUser = staticPermission(permissionTypes.ENABLE_DISABLE_USER);

const writeAccessLevels = staticPermission(permissionTypes.WRITE_ACCESS_LEVELS);

const listUsers = staticPermission(permissionTypes.LIST_USERS);

const listAccessLevels = staticPermission(permissionTypes.LIST_ACCESS_LEVELS);

const setUserAccessLevels = staticPermission(permissionTypes.SET_USER_ACCESS_LEVELS);

const executeAction = nodePermission(permissionTypes.EXECUTE_ACTION);

const alwaysAuthorized = () => true;

const permission = {
  createRecord,
  updateRecord,
  deleteRecord,
  readRecord,
  writeTemplates,
  createUser,
  setPassword,
  readIndex,
  createTemporaryAccess,
  enableDisableUser,
  writeAccessLevels,
  listUsers,
  listAccessLevels,
  manageIndex,
  manageCollection,
  executeAction,
  setUserAccessLevels,
};

const getNew = app => (collectionKey, recordTypeName) => {
  const recordNode = getRecordNode(app, collectionKey);
  collectionKey=safeKey(collectionKey);
  return apiWrapperSync(
    app,
    events.recordApi.getNew,
    permission.createRecord.isAuthorized(recordNode.nodeKey()),
    { collectionKey, recordTypeName },
    _getNew, recordNode, collectionKey,
  );
};

const _getNew = (recordNode, collectionKey) => constructRecord(recordNode, getNewFieldValue, collectionKey);

const getRecordNode = (app, collectionKey) => {
  collectionKey = safeKey(collectionKey);
  return getNodeForCollectionPath(app.hierarchy)(collectionKey);
};

const getNewChild = app => (recordKey, collectionName, recordTypeName) => 
  getNew(app)(joinKey(recordKey, collectionName), recordTypeName);

const constructRecord = (recordNode, getFieldValue, collectionKey) => {
  const record = $(recordNode.fields, [
    fp.keyBy('name'),
    fp.mapValues(getFieldValue),
  ]);

  record.id = `${recordNode.nodeId}-${shortid.generate()}`;
  record.key = isSingleRecord(recordNode)
               ? joinKey(collectionKey, recordNode.name)
               : joinKey(collectionKey, record.id);
  record.isNew = true;
  record.type = recordNode.name;
  return record;
};

const allIdChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';

// this should never be changed - ever 
// - existing databases depend on the order of chars this string

/**
 * folderStructureArray should return an array like
 * - [1] = all records fit into one folder
 * - [2] = all records fite into 2 folders
 * - [64, 3] = all records fit into 64 * 3 folders
 * - [64, 64, 10] = all records fit into 64 * 64 * 10 folder
 * (there are 64 possible chars in allIsChars) 
*/
const folderStructureArray = (recordNode) => {

  const totalFolders = Math.ceil(recordNode.estimatedRecordCount / 1000);
  const folderArray = [];
  let levelCount = 1;
  while(64**levelCount < totalFolders) {
    levelCount += 1;
    folderArray.push(64);
  }

  const parentFactor = (64**folderArray.length);
  if(parentFactor < totalFolders) {
    folderArray.push(
      Math.ceil(totalFolders / parentFactor)
    );
  }  

  return folderArray;

  /*
  const maxRecords = currentFolderPosition === 0 
                     ? RECORDS_PER_FOLDER
                     : currentFolderPosition * 64 * RECORDS_PER_FOLDER;

  if(maxRecords < recordNode.estimatedRecordCount) {
    return folderStructureArray(
            recordNode,
            [...currentArray, 64], 
            currentFolderPosition + 1);
  } else {
    const childFolderCount = Math.ceil(recordNode.estimatedRecordCount / maxRecords );
    return [...currentArray, childFolderCount]
  }*/
};


const getAllIdsIterator = app => async (collection_Key_or_NodeKey) => {
  collection_Key_or_NodeKey = safeKey(collection_Key_or_NodeKey);
  const recordNode = getCollectionNodeByKeyOrNodeKey(
    app.hierarchy,
    collection_Key_or_NodeKey,
  );

  const getAllIdsIteratorForCollectionKey = async (recordNode, collectionKey) => {
    
    const folderStructure = folderStructureArray(recordNode);

    let currentFolderContents = [];
    let currentPosition = [];

    const collectionDir = getCollectionDir(app.hierarchy, collectionKey);
    const basePath = joinKey(
      collectionDir, recordNode.nodeId.toString());
  

    
    // "folderStructure" determines the top, sharding folders
    // we need to add one, for the collection root folder, which
    // always  exists 
    const levels = folderStructure.length + 1;
    const topLevel = levels -1;

   
    /* populate initial directory structure in form:
    [
      {path: "/a", contents: ["b", "c", "d"]}, 
      {path: "/a/b", contents: ["e","f","g"]},
      {path: "/a/b/e", contents: ["1-abcd","2-cdef","3-efgh"]}, 
    ]
    // stores contents on each parent level
    // top level has ID folders 
    */
    const firstFolder = async () => {

      let folderLevel = 0;

      const lastPathHasContent = () => 
        folderLevel === 0 
        || currentFolderContents[folderLevel - 1].contents.length > 0;


      while (folderLevel <= topLevel && lastPathHasContent()) {

        let thisPath = basePath;
        for(let lev = 0; lev < currentPosition.length; lev++) {
          thisPath = joinKey(
            thisPath, currentFolderContents[lev].contents[0]);
        }

        const contentsThisLevel = 
          await app.datastore.getFolderContents(thisPath);
        currentFolderContents.push({
            contents:contentsThisLevel, 
            path: thisPath
        });   

        // should start as something like [0,0]
        if(folderLevel < topLevel)
          currentPosition.push(0); 

        folderLevel+=1;
      }

      return (currentPosition.length === levels - 1);
    };  

    const isOnLastFolder = level => {
      
      const result =  currentPosition[level] === currentFolderContents[level].contents.length - 1;
      return result;
    };
    
    const getNextFolder = async (lev=undefined) => {
      lev = fp.isUndefined(lev) ? topLevel : lev;
      const parentLev = lev - 1;

      if(parentLev < 0) return false;
      
      if(isOnLastFolder(parentLev)) { 
        return await getNextFolder(parentLev);
      }

      const newPosition = currentPosition[parentLev] + 1;
      currentPosition[parentLev] = newPosition;
      
      const nextFolder = joinKey(
        currentFolderContents[parentLev].path,
        currentFolderContents[parentLev].contents[newPosition]);
      currentFolderContents[lev].contents = await app.datastore.getFolderContents(
        nextFolder
      );
      currentFolderContents[lev].path = nextFolder;

      if(lev !== topLevel) {
      
        // we just advanced a parent folder, so now need to
        // do the same to the next levels
        let loopLevel = lev + 1;
        while(loopLevel <= topLevel) {
          const loopParentLevel = loopLevel-1;
          
          currentPosition[loopParentLevel] = 0;
          const nextLoopFolder = joinKey(
            currentFolderContents[loopParentLevel].path,
            currentFolderContents[loopParentLevel].contents[0]);
          currentFolderContents[loopLevel].contents = await app.datastore.getFolderContents(
            nextLoopFolder
          );
          currentFolderContents[loopLevel].path = nextLoopFolder;
          loopLevel+=1;
        }
      }

      // true ==has more ids... (just loaded more)
      return true;
    };


    const idsCurrentFolder = () => 
      currentFolderContents[currentFolderContents.length - 1].contents;

    const fininshedResult = ({ done: true, result: { ids: [], collectionKey } });

    let hasStarted = false;
    let hasMore = true;
    const getIdsFromCurrentfolder = async () => {

      if(!hasMore) {
        return fininshedResult;
      }

      if(!hasStarted) {
        hasMore = await firstFolder();
        hasStarted = true;
        return ({
          result: {
            ids: idsCurrentFolder(),
            collectionKey
          },
          done: false
        })
      }

      hasMore = await getNextFolder();
      
      return ({
        result: {
          ids: hasMore ? idsCurrentFolder() : [],
          collectionKey
        },
        done: !hasMore
      });
    };

    return getIdsFromCurrentfolder;
    
  };

  const ancestors = $(getFlattenedHierarchy(app.hierarchy), [
    fp.filter(isCollectionRecord),
    fp.filter(n => isAncestor(recordNode)(n)
                    || n.nodeKey() === recordNode.nodeKey()),
    fp.orderBy([n => n.nodeKey().length], ['asc']),
  ]); // parents first

  const traverseForIteraterators = async (parentRecordKey = '', currentNodeIndex = 0) => {
    const currentNode = ancestors[currentNodeIndex];
    const currentCollectionKey = joinKey(
      parentRecordKey,
      currentNode.collectionName,
    );
    if (currentNode.nodeKey() === recordNode.nodeKey()) {
      return [
        await getAllIdsIteratorForCollectionKey(
          currentNode,
          currentCollectionKey,
        )];
    }
    const allIterators = [];
    const currentIterator = await getAllIdsIteratorForCollectionKey(
      currentNode,
      currentCollectionKey,
    );

    let ids = await currentIterator();
    while (ids.done === false) {
      for (const id of ids.result.ids) {
        allIterators.push(
          await traverseForIteraterators(
            joinKey(currentCollectionKey, id),
            currentNodeIndex + 1,
          ),
        );
      }

      ids = await currentIterator();
    }

    return fp.flatten(allIterators);
  };

  const iteratorsArray = await traverseForIteraterators();
  let currentIteratorIndex = 0;
  return async () => {
    if (iteratorsArray.length === 0) { return { done: true, result: [] }; }
    const innerResult = await iteratorsArray[currentIteratorIndex]();
    if (!innerResult.done) { return innerResult; }
    if (currentIteratorIndex == iteratorsArray.length - 1) {
      return { done: true, result: innerResult.result };
    }
    currentIteratorIndex++;
    return { done: false, result: innerResult.result };
  };
};

const getRecordInfo = (hierarchy, key) => {
  const recordNode = getExactNodeForKey(hierarchy)(key);
  const pathInfo = getRecordDirectory(recordNode, key);
  const dir = joinKey(pathInfo.base, ...pathInfo.subdirs);

  return {
    recordJson: recordJson(dir),
    files: files(dir),
    child:(name) => joinKey(dir, name),
    key: safeKey(key),
    recordNode, pathInfo, dir
  };
};

const getCollectionDir = (hierarchy, collectionKey) => {
  const recordNode = getNodeForCollectionPath(hierarchy)(collectionKey);
  const dummyRecordKey = joinKey(collectionKey, "1-abcd");
  const pathInfo = getRecordDirectory(recordNode, dummyRecordKey);
  return pathInfo.base;
};

const recordJson = (dir) => 
  joinKey(dir, "record.json");

const files = (dir) => 
  joinKey(dir, "files");

const getRecordDirectory = (recordNode, key) => {
  const id = getFileFromKey(key);
  
  const traverseParentKeys = (n, parents=[]) => {
    if(isRoot(n)) return parents;
    const k = getActualKeyOfParent(n.nodeKey(), key);
    const thisNodeDir = {
      node:n,
      relativeDir: joinKey(
        recordRelativeDirectory(n, getFileFromKey(k)))
    };
    return traverseParentKeys(
      n.parent(), 
      [thisNodeDir, ...parents]);
  };

  const parentDirs = $(recordNode.parent(), [
    traverseParentKeys,
    fp.reduce((key, item) => {
      return joinKey(key, item.node.collectionName, item.relativeDir)
    }, keySep)
  ]);

  const subdirs = isSingleRecord(recordNode)
                  ? []
                  : recordRelativeDirectory(recordNode, id);
  const base = isSingleRecord(recordNode)
               ? joinKey(parentDirs, recordNode.name)
               : joinKey(parentDirs, recordNode.collectionName);

  return ({
    subdirs, base
  });
};

const recordRelativeDirectory = (recordNode, id) => {
  const folderStructure = folderStructureArray(recordNode);
  const strippedId = id.substring(recordNode.nodeId.toString().length + 1);
  const subfolders = $(folderStructure, [
    fp.reduce((result, currentCount) => {
      result.folders.push(
          folderForChar(strippedId[result.level], currentCount)
      );
      return {level:result.level+1, folders:result.folders};
    }, {level:0, folders:[]}),
    f => f.folders,
    fp.filter(f => !!f)
  ]);

  return [recordNode.nodeId.toString(), ...subfolders, id]
};

const folderForChar = (char, folderCount) => 
  folderCount === 1 ? ""
  : $(folderCount, [
      idFoldersForFolderCount,
      fp.find(f => f.includes(char))
    ]);

const idFoldersForFolderCount = (folderCount) => {
  const charRangePerShard = 64 / folderCount;
  const idFolders = [];
  let index = 0;
  let currentIdsShard = '';
  while (index < 64) {
    currentIdsShard += allIdChars[index];
    if ((index + 1) % charRangePerShard === 0) {
      idFolders.push(currentIdsShard);
      currentIdsShard = '';
    }
    index++;
  }
    
    return idFolders;
};

const load = app => async key => {
  key = safeKey(key);
  return apiWrapper(
    app,
    events.recordApi.load,
    permission.readRecord.isAuthorized(key),
    { key },
    _load, app, key,
  );
};

const _loadFromInfo = async (app, recordInfo, keyStack = []) => {
  const key = recordInfo.key;
  const {recordNode, recordJson} = recordInfo;
  const storedData = await app.datastore.loadJson(recordJson);

  const loadedRecord = $(recordNode.fields, [
    fp.keyBy('name'),
    fp.mapValues(f => safeParseField(f, storedData)),
  ]);

  const newKeyStack = [...keyStack, key];

  const references = $(recordNode.fields, [
    fp.filter(f => f.type === 'reference'
                    && isNonEmptyString(loadedRecord[f.name].key)
                    && !fp.includes(loadedRecord[f.name].key)(newKeyStack)),
    fp.map(f => ({
      promise: _load(app, loadedRecord[f.name].key, newKeyStack),
      index: getNode(app.hierarchy, f.typeOptions.indexNodeKey),
      field: f,
    })),
  ]);

  if (references.length > 0) {
    const refRecords = await Promise.all(
      fp.map(p => p.promise)(references),
    );

    for (const ref of references) {
      loadedRecord[ref.field.name] = mapRecord(
        refRecords[references.indexOf(ref)],
        ref.index,
      );
    }
  }

  loadedRecord.transactionId = storedData.transactionId;
  loadedRecord.isNew = false;
  loadedRecord.key = key;
  loadedRecord.id = $(key, [splitKey, fp.last]);
  loadedRecord.type = recordNode.name;
  return loadedRecord;
};

const _load = async (app, key, keyStack = []) => 
  _loadFromInfo(
    app,
    getRecordInfo(app.hierarchy, key),
    keyStack);

// adapted from https://github.com/dex4er/js-promise-readable
// thanks :)
  
const promiseReadableStream = stream => {
   
    let _errored;

    const _errorHandler = err => {
        _errored = err;
    };

    stream.on("error", _errorHandler);
  
    const read = (size) => {
  
      return new Promise((resolve, reject) => {
        if (_errored) {
          const err = _errored;
          _errored = undefined;
          return reject(err)
        }
  
        if (!stream.readable || stream.closed || stream.destroyed) {
          return resolve();
        }
  
        const readableHandler = () => {
          const chunk = stream.read(size);
  
          if (chunk) {
            removeListeners();
            resolve(chunk);
          }
        };
  
        const closeHandler = () => {
          removeListeners();
          resolve();
        };
  
        const endHandler = () => {
          removeListeners();
          resolve();
        };
  
        const errorHandler = (err) => {
          _errored = undefined;
          removeListeners();
          reject(err);
        };
  
        const removeListeners = () => {
          stream.removeListener("close", closeHandler);
          stream.removeListener("error", errorHandler);
          stream.removeListener("end", endHandler);
          stream.removeListener("readable", readableHandler);
        };
  
        stream.on("close", closeHandler);
        stream.on("end", endHandler);
        stream.on("error", errorHandler);
        stream.on("readable", readableHandler);
  
        readableHandler();
      });
    };
  
  
    const destroy = () => {
      if (stream) {
        if (_errorHandler) {
          stream.removeListener("error", _errorHandler);
        }
        if (typeof stream.destroy === "function") {
          stream.destroy();
        }
      }
    };
  
    return {read, destroy, stream};
  };

const getIndexedDataKey = (indexNode, indexDir, record) => {
  
  const getShardName = (indexNode, record) => {
    const shardNameFunc = compilerUtil.compileCode(indexNode.getShardName);
    try {
      return shardNameFunc({ record });
    } catch(e) {
      const errorDetails = `shardCode: ${indexNode.getShardName} :: record: ${JSON.stringify(record)} :: `;
      e.message = "Error running index shardname func: " + errorDetails + e.message;
      throw e;
    }
  };

  const shardName = isNonEmptyString(indexNode.getShardName)
    ? `${getShardName(indexNode, record)}.csv`
    : 'index.csv';

  return joinKey(indexDir, shardName);
};

const getShardKeysInRange = async (app, indexNode, indexDir, startRecord = null, endRecord = null) => {
  const startShardName = !startRecord
    ? null
    : shardNameFromKey(
      getIndexedDataKey(
        indexNode,
        indexDir,
        startRecord,
      ),
    );

  const endShardName = !endRecord
    ? null
    : shardNameFromKey(
      getIndexedDataKey(
        indexNode,
        indexDir,
        endRecord,
      ),
    );

  return $(await getShardMap(app.datastore, indexDir), [
    fp.filter(k => (startRecord === null || k >= startShardName)
                    && (endRecord === null || k <= endShardName)),
    fp.map(k => joinKey(indexDir, `${k}.csv`)),
  ]);
};

const ensureShardNameIsInShardMap = async (store, indexDir, indexedDataKey) => {
  const map = await getShardMap(store, indexDir);
  const shardName = shardNameFromKey(indexedDataKey);
  if (!fp.includes(shardName)(map)) {
    map.push(shardName);
    await writeShardMap(store, indexDir, map);
  }
};

const getShardMap = async (datastore, indexDir) => {
  const shardMapKey = getShardMapKey(indexDir);
  try {
    return await datastore.loadJson(shardMapKey);
  } catch (_) {
    await datastore.createJson(shardMapKey, []);
    return [];
  }
};

const writeShardMap = async (datastore, indexDir, shardMap) => await datastore.updateJson(
  getShardMapKey(indexDir),
  shardMap,
);

const getShardMapKey = indexDir => joinKey(indexDir, 'shardMap.json');

const getUnshardedIndexDataKey = indexDir => joinKey(indexDir, 'index.csv');

const createIndexFile = async (datastore, indexedDataKey, index) => {
  if (isShardedIndex(index)) {
    const indexDir = getParentKey(indexedDataKey);
    const shardMap = await getShardMap(datastore, indexDir);
    shardMap.push(
      shardNameFromKey(indexedDataKey),
    );
    await writeShardMap(datastore, indexDir, shardMap);
  }
  await datastore.createFile(indexedDataKey, '');
};

const shardNameFromKey = key => $(key, [
  splitKey,
  fp.last,
]).replace('.csv', '');

const getIndexKey_BasedOnDecendant = (decendantKey, indexNode) => {
  if (isGlobalIndex(indexNode)) { return `${indexNode.nodeKey()}`; }

  const indexedDataParentKey = getActualKeyOfParent(
    indexNode.parent().nodeKey(),
    decendantKey,
  );

  return joinKey(
    indexedDataParentKey,
    indexNode.name,
  );
};

const generateSchema = (hierarchy, indexNode) => {
  const recordNodes = getAllowedRecordNodesForIndex(hierarchy, indexNode);
  const mappedRecords = $(recordNodes, [
    fp.map(n => mapRecord(createSampleRecord(n), indexNode)),
  ]);

  // always has record key and sort key
  const schema = {
    sortKey: all$1.string,
    key: all$1.string,
  };

  const fieldsHas = fp.has(schema);
  const setField = (fieldName, value) => {
    if (value === null || value === undefined) { return; }

    const thisType = detectType(value);
    if (fieldsHas(fieldName)) {
      if (schema[fieldName] !== thisType) {
        schema[fieldName] = all$1.string;
      }
    } else {
      schema[fieldName] = thisType;
    }
  };

  for (const mappedRec of mappedRecords) {
    for (const f in mappedRec) {
      setField(f, mappedRec[f]);
    }
  }

  // returing an array of {name, type}
  return $(schema, [
    fp.keys,
    fp.map(k => ({ name: k, type: schema[k].name })),
    fp.filter(s => s.name !== 'sortKey'),
    fp.orderBy('name', ['desc']), // reverse aplha
    fp.concat([{ name: 'sortKey', type: all$1.string.name }]), // sortKey on end
    fp.reverse, // sortKey first, then rest are alphabetical
  ]);
};

const createSampleRecord = recordNode => constructRecord(
  recordNode,
  getSampleFieldValue,
  recordNode.parent().nodeKey(),
);

var global$1 = (typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {});

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;
function init () {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray (b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xFF;
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[(tmp << 4) & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
    output += lookup[tmp >> 10];
    output += lookup[(tmp >> 4) & 0x3F];
    output += lookup[(tmp << 2) & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('')
}

function read (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString = {}.toString;

var isArray = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

var INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
  ? global$1.TYPED_ARRAY_SUPPORT
  : true;

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr
};

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
};

function allocUnsafe (that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
};

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that
}

function fromObject (that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}
Buffer.isBuffer = isBuffer;
function internalIsBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString (encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this
};

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this
};

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this
};

Buffer.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer.prototype.equals = function equals (b) {
  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
};

Buffer.prototype.inspect = function inspect () {
  var str = '';
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>'
};

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf)
  } else {
    return fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4)
};

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4)
};

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8)
};

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}


function base64ToBytes (str) {
  return toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
}

function isFastBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
}

// Copyright Joyent, Inc. and other Node contributors.
var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     };


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
function StringDecoder(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
}

// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

const BUFFER_MAX_BYTES = 524288; // 0.5Mb

const CONTINUE_READING_RECORDS = "CONTINUE_READING";
const READ_REMAINING_TEXT = "READ_REMAINING";
const CANCEL_READ = "CANCEL";

const getIndexWriter = (hierarchy, indexNode, readableStream, writableStream, end) => {
    const schema = generateSchema(hierarchy, indexNode);

    return ({
        read: read$1(readableStream, schema),
        updateIndex: updateIndex(readableStream, writableStream, schema)
    });
};

const getIndexReader = (hierarchy, indexNode, readableStream) => 
    read$1(
        readableStream, 
        generateSchema(hierarchy, indexNode)
    );

const updateIndex = (readableStream, writableStream, schema) => async (itemsToWrite, keysToRemove) => {
    const write = newOutputWriter(BUFFER_MAX_BYTES, writableStream);
    const writtenItems = []; 
    await read$1(readableStream, schema)(
        async indexedItem => {
            const updated = fp.find(i => indexedItem.key === i.key)(itemsToWrite);
            const removed = fp.find(k => indexedItem.key === k)(keysToRemove);
            
            if(isSomething(removed)) 
                return CONTINUE_READING_RECORDS;

            if(isSomething(updated)) {
                const serializedItem =  serializeItem(schema, updated);
                await write(serializedItem);
                writtenItems.push(updated);
            } else {
                await write(
                    serializeItem(schema, indexedItem)
                );
            } 

            return CONTINUE_READING_RECORDS;

        },
        async text => await write(text)
    );

    if(writtenItems.length !== itemsToWrite.length) {
        const toAdd = fp.difference(itemsToWrite, writtenItems);
        for(let added of toAdd) {
            await write(
                serializeItem(schema, added)
            );
        }
    } else if(writtenItems.length === 0) {
        // potentially are no records
        await write("");
    }

    await write();
    await writableStream.end();
};

const read$1 = (readableStream, schema) => async (onGetItem, onGetText) => {
    const readInput = newInputReader(readableStream);
    let text = await readInput();
    let status = CONTINUE_READING_RECORDS;
    while(text.length > 0) {

        if(status === READ_REMAINING_TEXT) {
            await onGetText(text);
            continue;
        }

        if(status === CANCEL_READ) {
            return;
        }

        let rowText = "";
        let currentCharIndex=0;
        for(let currentChar of text) {
            rowText += currentChar;
            if(currentChar === "\r") {
                status = await onGetItem(
                    deserializeRow(schema, rowText)
                );
                rowText = "";
                if(status === READ_REMAINING_TEXT) {
                    break;
                }
            }
            currentCharIndex++;
        }

        if(currentCharIndex < text.length -1) {
            await onGetText(text.substring(currentCharIndex + 1));
        }

        text = await readInput();
    }

    await readableStream.destroy();

};

const newOutputWriter = (flushBoundary, writableStream) => {
    
    let currentBuffer = null;

    return async (text) => {

        if(fp.isString(text) && currentBuffer === null)
            currentBuffer = safeBuffer.Buffer.from(text, "utf8");
        else if(fp.isString(text))
            currentBuffer = safeBuffer.Buffer.concat([
                currentBuffer,
                safeBuffer.Buffer.from(text, "utf8")
            ]);
        
        if(currentBuffer !== null &&
            (currentBuffer.length > flushBoundary
             || !fp.isString(text))) {

            await writableStream.write(currentBuffer);
            currentBuffer = null;
        }
    }
};

const newInputReader = (readableStream) => {

    const decoder = new StringDecoder('utf8');
    let remainingBytes = [];

    return async () => {

        let nextBytesBuffer = await readableStream.read(BUFFER_MAX_BYTES);
        const remainingBuffer = safeBuffer.Buffer.from(remainingBytes);

        if(!nextBytesBuffer) nextBytesBuffer = safeBuffer.Buffer.from([]);

        const moreToRead = nextBytesBuffer.length === BUFFER_MAX_BYTES;

        const buffer = safeBuffer.Buffer.concat(
            [remainingBuffer, nextBytesBuffer],
            remainingBuffer.length + nextBytesBuffer.length);

        const text = decoder.write(buffer);
        remainingBytes = decoder.end(buffer);

        if(!moreToRead && remainingBytes.length > 0) {
            // if for any reason, we have remaining bytes at the end
            // of the stream, just discard - dont see why this should
            // ever happen, but if it does, it could cause a stack overflow
            remainingBytes = [];
        }

        return text;
    };
};

const deserializeRow = (schema, rowText) => {
    let currentPropIndex = 0;
    let currentCharIndex = 0;
    let currentValueText = "";
    let isEscaped = false;
    const item = {};

    const setCurrentProp = () => {
        const currentProp = schema[currentPropIndex];
        const type = getType(currentProp.type);
        const value = currentValueText === ""
                      ? type.getDefaultValue()
                      : type.safeParseValue(
                          currentValueText);
        item[currentProp.name] = value;
    };
    
    while(currentPropIndex < schema.length) {

        if(currentCharIndex < rowText.length) {
            const currentChar = rowText[currentCharIndex];
            if(isEscaped) {
                if(currentChar === "r") {
                    currentValueText += "\r";
                } else {
                    currentValueText += currentChar;
                }
                isEscaped = false;
            } else {
                if(currentChar === ",") {
                    setCurrentProp();
                    currentValueText = "";
                    currentPropIndex++;
                } else if(currentChar === "\\") {
                    isEscaped = true;
                } else {
                    currentValueText += currentChar;
                }
            }
            currentCharIndex++; 
        } else {
            currentValueText = "";
            setCurrentProp();
            currentPropIndex++;
        }
    }

    return item;
};

const serializeItem = (schema, item)  => {

    let rowText = "";

    for(let prop of schema) {
        const type = getType(prop.type);
        const value = fp.has(prop.name)(item)
                      ? item[prop.name]
                      : type.getDefaultValue();
        
        const valStr = type.stringify(value);

        for(let i = 0; i < valStr.length; i++) {
            const currentChar = valStr[i];
            if(currentChar === "," 
               || currentChar === "\r" 
               || currentChar === "\\") {
                rowText += "\\";
            }

            if(currentChar === "\r") {
                rowText += "r";
            } else {
                rowText += currentChar;
            }
        }

        rowText += ",";
    }

    rowText += "\r";
    return rowText;
};

const readIndex$1 = async (hierarchy, datastore, index, indexedDataKey) => {
  const records = [];
  const doRead = iterateIndex(
        async item => {
      records.push(item);
      return CONTINUE_READING_RECORDS;
    },
        async () => records
  );

  return await doRead(hierarchy, datastore, index, indexedDataKey);
};

const searchIndex = async (hierarchy, datastore, index, indexedDataKey, searchPhrase) => {
  const records = [];
  const schema = generateSchema(hierarchy, index);
  const doRead = iterateIndex(
        async item => {
      const idx = lunr(function () {
        this.ref('key');
        for (const field of schema) {
          this.field(field.name);
        }
        this.add(item);
      });
      const searchResults = idx.search(searchPhrase);
      if (searchResults.length === 1) {
        item._searchResult = searchResults[0];
        records.push(item);
      }
      return CONTINUE_READING_RECORDS;
    },
        async () => records
  );

  return await doRead(hierarchy, datastore, index, indexedDataKey);
};

const iterateIndex = (onGetItem, getFinalResult) => async (hierarchy, datastore, index, indexedDataKey) => {
  try {
    const readableStream = promiseReadableStream(
        await datastore.readableFileStream(indexedDataKey)
    );

    const read = getIndexReader(hierarchy, index, readableStream);
    await read(onGetItem);
    return getFinalResult();
  } catch (e) {
    if (await datastore.exists(indexedDataKey)) {
      throw e;
    } else {
      await createIndexFile(
        datastore,
        indexedDataKey,
        index,
      );
    }
    return [];
  }
};

const getIndexDir = (hierarchy, indexKey) => {

    const parentKey = getParentKey(indexKey);

    if(parentKey === "") return indexKey;
    if(parentKey === keySep) return indexKey;

    const recordInfo = getRecordInfo(
        hierarchy, 
        parentKey);
        
    return recordInfo.child(
        getLastPartInKey(indexKey));
};

const listItems = app => async (indexKey, options) => {
  indexKey = safeKey(indexKey);
  return apiWrapper(
    app,
    events.indexApi.listItems,
    permission.readIndex.isAuthorized(indexKey),
    { indexKey, options },
    _listItems, app, indexKey, options,
  );
};

const defaultOptions = { rangeStartParams: null, rangeEndParams: null, searchPhrase: null };

const _listItems = async (app, indexKey, options = defaultOptions) => {
  const { searchPhrase, rangeStartParams, rangeEndParams } = $({}, [
    fp.merge(options),
    fp.merge(defaultOptions),
  ]);

  const getItems = async indexedDataKey => (isNonEmptyString(searchPhrase)
    ? await searchIndex(
      app.hierarchy,
      app.datastore,
      indexNode,
      indexedDataKey,
      searchPhrase,
    )
    : await readIndex$1(
      app.hierarchy,
      app.datastore,
      indexNode,
      indexedDataKey,
    ));

  indexKey = safeKey(indexKey);
  const indexNode = getExactNodeForKey(app.hierarchy)(indexKey);
  const indexDir = getIndexDir(app.hierarchy, indexKey);

  if (!isIndex(indexNode)) { throw new Error('supplied key is not an index'); }

  if (isShardedIndex(indexNode)) {
    const shardKeys = await getShardKeysInRange(
      app, indexNode, indexDir, rangeStartParams, rangeEndParams,
    );
    const items = [];
    for (const k of shardKeys) {
      items.push(await getItems(k));
    }
    return fp.flatten(items);
  }
  return await getItems(
    getUnshardedIndexDataKey(indexDir),
  );
};

const getContext = app => recordKey => {
  recordKey = safeKey(recordKey);
  return  apiWrapperSync(
    app,
    events.recordApi.getContext,
    permission.readRecord.isAuthorized(recordKey),
    { recordKey },
    _getContext, app, recordKey,
  );
};

const _getContext = (app, recordKey) => {
  recordKey = safeKey(recordKey);
  const recordNode = getExactNodeForKey(app.hierarchy)(recordKey);

  const cachedReferenceIndexes = {};

  const lazyLoadReferenceIndex = async (typeOptions) => {
    if (!fp.has(typeOptions.indexNodeKey)(cachedReferenceIndexes)) {
      cachedReferenceIndexes[typeOptions.indexNodeKey] = {
        typeOptions,
        data: await readReferenceIndex(
          app, recordKey, typeOptions,
        ),
      };
    }

    return cachedReferenceIndexes[typeOptions.indexNodeKey];
  };

  const getTypeOptions = typeOptions_or_fieldName => (fp.isString(typeOptions_or_fieldName)
    ? findField(recordNode, typeOptions_or_fieldName)
      .typeOptions
    : typeOptions_or_fieldName);

  return {
    referenceExists: async (typeOptions_or_fieldName, key) => {
      const typeOptions = getTypeOptions(typeOptions_or_fieldName);
      const { data } = await lazyLoadReferenceIndex(typeOptions);
      return fp.some(i => i.key === key)(data);
    },
    referenceOptions: async (typeOptions_or_fieldName) => {
      const typeOptions = getTypeOptions(typeOptions_or_fieldName);
      const { data } = await lazyLoadReferenceIndex(typeOptions);
      return data;
    },
    recordNode,
  };
};

const readReferenceIndex = async (app, recordKey, typeOptions) => {
  const indexNode = getNode(app.hierarchy, typeOptions.indexNodeKey);
  const indexKey = isGlobalIndex(indexNode)
    ? indexNode.nodeKey()
    : getIndexKey_BasedOnDecendant(
      recordKey, indexNode,
    );

  const items = await listItems(app)(indexKey);
  return $(items, [
    fp.map(i => ({
      key: i.key,
      value: i[typeOptions.displayValue],
    })),
  ]);
};

const fieldParseError = (fieldName, value) => ({
  fields: [fieldName],
  message: `Could not parse field ${fieldName}:${value}`,
});

const validateAllFieldParse = (record, recordNode) => $(recordNode.fields, [
  fp.map(f => ({ name: f.name, parseResult: validateFieldParse(f, record) })),
  fp.reduce((errors, f) => {
    if (f.parseResult.success) return errors;
    errors.push(
      fieldParseError(f.name, f.parseResult.value),
    );
    return errors;
  }, []),
]);

const validateAllTypeConstraints = async (record, recordNode, context) => {
  const errors = [];
  for (const field of recordNode.fields) {
    $(await validateTypeConstraints$1(field, record, context), [
      fp.filter(isNonEmptyString),
      fp.map(m => ({ message: m, fields: [field.name] })),
      fp.each(e => errors.push(e)),
    ]);
  }
  return errors;
};

const runRecordValidationRules = (record, recordNode) => {
  const runValidationRule = (rule) => {
    const isValid = compilerUtil.compileExpression(rule.expressionWhenValid);
    const expressionContext = { record, _: ___default };
    return (isValid(expressionContext)
      ? { valid: true }
      : ({
        valid: false,
        fields: rule.invalidFields,
        message: rule.messageWhenInvalid,
      }));
  };

  return $(recordNode.validationRules, [
    fp.map(runValidationRule),
    fp.flatten,
    fp.filter(r => r.valid === false),
    fp.map(r => ({ fields: r.fields, message: r.message })),
  ]);
};

const validate = app => async (record, context) => {
  context = isNothing(context)
    ? _getContext(app, record.key)
    : context;

  const recordNode = getExactNodeForKey(app.hierarchy)(record.key);
  const fieldParseFails = validateAllFieldParse(record, recordNode);

  // non parsing would cause further issues - exit here
  if (!fp.isEmpty(fieldParseFails)) { return ({ isValid: false, errors: fieldParseFails }); }

  const recordValidationRuleFails = runRecordValidationRules(record, recordNode);
  const typeContraintFails = await validateAllTypeConstraints(record, recordNode, context);

  if (fp.isEmpty(fieldParseFails)
       && fp.isEmpty(recordValidationRuleFails)
       && fp.isEmpty(typeContraintFails)) {
    return ({ isValid: true, errors: [] });
  }

  return ({
    isValid: false,
    errors: ___default.union(fieldParseFails, typeContraintFails, recordValidationRuleFails),
  });
};

const ensureCollectionIsInitialised = async (datastore, node, dir) => {
  if (!await datastore.exists(dir)) {
    await datastore.createFolder(dir);
    await datastore.createFolder(joinKey(dir, node.nodeId));
  }
};

const initialiseRootCollections = async (datastore, hierarchy) => {
  const rootCollectionRecord = allTrue(
    n => isRoot(n.parent()),
    isCollectionRecord,
  );

  const flathierarchy = getFlattenedHierarchy(hierarchy);

  const collectionRecords = $(flathierarchy, [
    fp.filter(rootCollectionRecord),
  ]);

  for (const col of collectionRecords) {
    await ensureCollectionIsInitialised(
      datastore,
      col,
      col.collectionPathRegx()
    );
  }
};

const initialiseChildCollections = async (app, recordInfo) => {
  const childCollectionRecords = $(recordInfo.recordNode, [
    n => n.children,
    fp.filter(isCollectionRecord),
  ]);

  for (const child of childCollectionRecords) {
    await ensureCollectionIsInitialised(
      app.datastore,
      child,
      recordInfo.child(child.collectionName),
    );
  }
};

const TRANSACTIONS_FOLDER = `${keySep}.transactions`;
const LOCK_FILENAME = 'lock';
const LOCK_FILE_KEY = joinKey(
  TRANSACTIONS_FOLDER, LOCK_FILENAME,
);
const idSep = '$';

const isOfType = typ => trans => trans.transactionType === typ;

const CREATE_RECORD_TRANSACTION = 'create';
const UPDATE_RECORD_TRANSACTION = 'update';
const DELETE_RECORD_TRANSACTION = 'delete';
const BUILD_INDEX_TRANSACTION = 'build';

const isUpdate = isOfType(UPDATE_RECORD_TRANSACTION);
const isDelete = isOfType(DELETE_RECORD_TRANSACTION);
const isCreate = isOfType(CREATE_RECORD_TRANSACTION);
const isBuildIndex = isOfType(BUILD_INDEX_TRANSACTION);

const keyToFolderName = nodeKey => getHashCode(nodeKey);

const getTransactionId = (recordId, transactionType, uniqueId) => 
  `${recordId}${idSep}${transactionType}${idSep}${uniqueId}`;

const buildIndexFolder = '.BUILD-';
const nodeKeyHashFromBuildFolder = folder => folder.replace(buildIndexFolder, '');

const isBuildIndexFolder = key => getLastPartInKey(key).startsWith(buildIndexFolder);

const IndexNodeKeyFolder = indexNodeKey => joinKey(
  TRANSACTIONS_FOLDER,
  buildIndexFolder + keyToFolderName(indexNodeKey),
);

const IndexNodeKeyBatchFolder = (indexNodeKey, count) => 
  joinKey(IndexNodeKeyFolder(indexNodeKey), Math.floor(count / BUILDINDEX_BATCH_COUNT).toString());

const BUILDINDEX_BATCH_COUNT = 1000;
const timeoutMilliseconds = 30 * 1000; // 30 secs
const maxLockRetries = 1;

const transactionForCreateRecord = async (app, record) => await transaction(
  app.datastore, CREATE_RECORD_TRANSACTION,
  record.key, { record },
  getTransactionKey_Records,
);

const transactionForUpdateRecord = async (app, oldRecord, newRecord) => await transaction(
  app.datastore, UPDATE_RECORD_TRANSACTION,
  newRecord.key, { oldRecord, record: newRecord },
  getTransactionKey_Records,
);

const transactionForDeleteRecord = async (app, record) => await transaction(
  app.datastore, DELETE_RECORD_TRANSACTION,
  record.key, { record },
  getTransactionKey_Records,
);

const transactionForBuildIndex = async (app, indexNodeKey, recordKey, count) => {
  const transactionFolder = IndexNodeKeyBatchFolder(indexNodeKey, count);
  if (count % BUILDINDEX_BATCH_COUNT === 0) {
    await app.datastore.createFolder(transactionFolder);
  }

  return await transaction(
    app.datastore, BUILD_INDEX_TRANSACTION,
    recordKey, { recordKey },
    id => joinKey(transactionFolder, id),
  );
};

const createBuildIndexFolder = async (datastore, indexNodeKey) => await datastore.createFolder(
  IndexNodeKeyFolder(indexNodeKey),
);

const getTransactionKey_Records = id => joinKey(TRANSACTIONS_FOLDER, id);

const transaction = async (datastore, transactionType, recordKey, data, getTransactionKey) => {
  const recordId = getLastPartInKey(recordKey);
  const uniqueId = shortid.generate();
  const id = getTransactionId(
    recordId, transactionType, uniqueId,
  );

  const key = getTransactionKey(id);

  const trans = {
    transactionType,
    recordKey,
    ...data,
    id,
  };

  await datastore.createJson(
    key, trans,
  );

  return trans;
};

const initialiseIndex = async (datastore, dir, index) => {
  const indexDir = joinKey(dir, index.name);

  await datastore.createFolder(indexDir);

  if (isShardedIndex(index)) {
    await datastore.createFile(
      getShardMapKey(indexDir),
      '[]',
    );
  } else {
    await createIndexFile(
      datastore,
      getUnshardedIndexDataKey(indexDir),
      index,
    );
  }
};

const save = app => async (record, context) => apiWrapper(
  app,
  events.recordApi.save,
  record.isNew
    ? permission.createRecord.isAuthorized(record.key)
    : permission.updateRecord.isAuthorized(record.key), { record },
  _save, app, record, context, false,
);


const _save = async (app, record, context, skipValidation = false) => {
  const recordClone = fp.cloneDeep(record);
  if (!skipValidation) {
    const validationResult = await validate(app)(recordClone, context);
    if (!validationResult.isValid) {
      await app.publish(events.recordApi.save.onInvalid, { record, validationResult });
      throw new BadRequestError(`Save : Record Invalid : ${
        JSON.stringify(validationResult.errors)}`);
    }
  }

  const recordInfo = getRecordInfo(app.hierarchy, record.key);
  const {
    recordNode, pathInfo,
    recordJson, files,
  } = recordInfo;

  if (recordClone.isNew) {
    
    if(!recordNode)
      throw new Error("Cannot find node for " + record.key);

    const transaction = await transactionForCreateRecord(
      app, recordClone,
    );
    recordClone.transactionId = transaction.id;
    await createRecordFolderPath(app.datastore, pathInfo);
    await app.datastore.createFolder(files);
    await app.datastore.createJson(recordJson, recordClone);
    await initialiseReverseReferenceIndexes(app, recordInfo);
    await initialiseAncestorIndexes(app, recordInfo);
    await initialiseChildCollections(app, recordInfo);
    await app.publish(events.recordApi.save.onRecordCreated, {
      record: recordClone,
    });
  } else {
    const oldRecord = await _loadFromInfo(app, recordInfo);
    const transaction = await transactionForUpdateRecord(
      app, oldRecord, recordClone,
    );
    recordClone.transactionId = transaction.id;
    await app.datastore.updateJson(
      recordJson,
      recordClone,
    );
    await app.publish(events.recordApi.save.onRecordUpdated, {
      old: oldRecord,
      new: recordClone,
    });
  }

  await app.cleanupTransactions();

  const returnedClone = fp.cloneDeep(recordClone);
  returnedClone.isNew = false;
  return returnedClone;
};

const initialiseAncestorIndexes = async (app, recordInfo) => {
  for (const index of recordInfo.recordNode.indexes) {
    const indexKey = recordInfo.child(index.name);
    if (!await app.datastore.exists(indexKey)) { 
      await initialiseIndex(app.datastore, recordInfo.dir, index); 
    }
  }
};

const initialiseReverseReferenceIndexes = async (app, recordInfo) => {

  const indexNodes = $(fieldsThatReferenceThisRecord(app, recordInfo.recordNode), [
    fp.map(f => $(f.typeOptions.reverseIndexNodeKeys, [
      fp.map(n => getNode(
        app.hierarchy,
        n,
      )),
    ])),
    fp.flatten,
  ]);

  for (const indexNode of indexNodes) {
    await initialiseIndex(
      app.datastore, recordInfo.dir, indexNode,
    );
  }
};

const fieldsThatReferenceThisRecord = (app, recordNode) => $(app.hierarchy, [
  getFlattenedHierarchy,
  fp.filter(isRecord),
  fp.map(n => n.fields),
  fp.flatten,
  fp.filter(fieldReversesReferenceToNode(recordNode)),
]);

const createRecordFolderPath = async (datastore, pathInfo) => {
  
  const recursiveCreateFolder = async (subdirs, dirsThatNeedCreated=undefined) => {

    // iterate backwards through directory hierachy
    // until we get to a folder that exists, then create the rest
    // e.g 
    // - some/folder/here
    // - some/folder
    // - some
    const thisFolder = joinKey(pathInfo.base, ...subdirs);

    if(await datastore.exists(thisFolder)) {

      let creationFolder = thisFolder;
      for(let nextDir of (dirsThatNeedCreated || []) ) {
        creationFolder = joinKey(creationFolder, nextDir);
        await datastore.createFolder(creationFolder);
      }

    } else if(!dirsThatNeedCreated || dirsThatNeedCreated.length > 0) {

      dirsThatNeedCreated = !dirsThatNeedCreated
                          ? []
                          :dirsThatNeedCreated;
      
      await recursiveCreateFolder(
        fp.take(subdirs.length - 1)(subdirs),
        [...fp.takeRight(1)(subdirs), ...dirsThatNeedCreated]
      );
    }
  };

  await recursiveCreateFolder(pathInfo.subdirs);

  return joinKey(pathInfo.base, ...pathInfo.subdirs);

};

const deleteCollection = (app, disableCleanup = false) => async key => apiWrapper(
  app,
  events.collectionApi.delete,
  permission.manageCollection.isAuthorized,
  { key },
  _deleteCollection, app, key, disableCleanup,
);

/*
  const recordNode = getCollectionNode(app.hierarchy, key);

*/

const _deleteCollection = async (app, key, disableCleanup) => {
  key = safeKey(key);
  const collectionDir = getCollectionDir(app.hierarchy, key);
  await deleteRecords(app, key);
  await deleteCollectionFolder(app, collectionDir);
  if (!disableCleanup) { await app.cleanupTransactions(); }
};

const deleteCollectionFolder = async (app, dir) => 
  await app.datastore.deleteFolder(dir);

const deleteRecords = async (app, key) => {
  
  const iterate = await getAllIdsIterator(app)(key);

  let ids = await iterate();
  while (!ids.done) {
    if (ids.result.collectionKey === key) {
      for (const id of ids.result.ids) {
        await _deleteRecord(
          app,
          joinKey(key, id),
          true,
        );
      }
    }

    ids = await iterate();
  }
};

const deleteRecord$1 = (app, disableCleanup = false) => async key => {
  key = safeKey(key);
  return apiWrapper(
    app,
    events.recordApi.delete,
    permission.deleteRecord.isAuthorized(key),
    { key },
    _deleteRecord, app, key, disableCleanup,
  );
};

// called deleteRecord because delete is a keyword
const _deleteRecord = async (app, key, disableCleanup) => {
  const recordInfo = getRecordInfo(app.hierarchy, key);
  key = recordInfo.key;
  const node = getExactNodeForKey(app.hierarchy)(key);

  const record = await _load(app, key);
  await transactionForDeleteRecord(app, record);

  for (const collectionRecord of node.children) {
    const collectionKey = joinKey(
      key, collectionRecord.collectionName,
    );
    await _deleteCollection(app, collectionKey, true);
  }

  await app.datastore.deleteFolder(recordInfo.dir);

  if (!disableCleanup) { await app.cleanupTransactions(); }
};

const uploadFile = app => async (recordKey, readableStream, relativeFilePath) => apiWrapper(
  app,
  events.recordApi.uploadFile,
  permission.updateRecord.isAuthorized(recordKey),
  { recordKey, readableStream, relativeFilePath },
  _uploadFile, app, recordKey, readableStream, relativeFilePath,
);

const _uploadFile = async (app, recordKey, readableStream, relativeFilePath) => {
  if (isNothing(recordKey)) { throw new BadRequestError('Record Key not supplied'); }
  if (isNothing(relativeFilePath)) { throw new BadRequestError('file path not supplied'); }
  if (!isLegalFilename(relativeFilePath)) { throw new BadRequestError('Illegal filename'); }

  const recordInfo = getRecordInfo(app.hierarchy, recordKey);
  const record = await _loadFromInfo(app, recordInfo);

  const fullFilePath = safeGetFullFilePath(
    recordInfo.dir, relativeFilePath,
  );

  const tempFilePath = `${fullFilePath}_${shortid.generate()}.temp`;

  const outputStream = await app.datastore.writableFileStream(
    tempFilePath,
  );

  return new Promise((resolve,reject) => {
    readableStream.pipe(outputStream);
    outputStream.on('error', reject);
    outputStream.on('finish', resolve);
  })
  .then(() => app.datastore.getFileSize(tempFilePath))
  .then(size => {
    const isExpectedFileSize = checkFileSizeAgainstFields(
      app, record, relativeFilePath, size
    );  
    if (!isExpectedFileSize) { throw new BadRequestError(`Fields for ${relativeFilePath} do not have expected size: ${join(',')(incorrectFields)}`); }  

  })
  .then(() => tryAwaitOrIgnore(app.datastore.deleteFile, fullFilePath))
  .then(() => app.datastore.renameFile(tempFilePath, fullFilePath));

};

const checkFileSizeAgainstFields = (app, record, relativeFilePath, expectedSize) => {
  const recordNode = getExactNodeForKey(app.hierarchy)(record.key);

  const incorrectFileFields = $(recordNode.fields, [
    fp.filter(f => f.type === 'file'
      && record[f.name].relativePath === relativeFilePath
      && record[f.name].size !== expectedSize),
    fp.map(f => f.name),
  ]);

  const incorrectFileArrayFields = $(recordNode.fields, [
    fp.filter(a => a.type === 'array<file>'
      && $(record[a.name], [
        fp.some(f => record[f.name].relativePath === relativeFilePath
          && record[f.name].size !== expectedSize),
      ])),
    fp.map(f => f.name),
  ]);

  const incorrectFields = [
    ...incorrectFileFields,
    ...incorrectFileArrayFields,
  ];

  if (incorrectFields.length > 0) {
    return false;
  }

  return true;
};

const safeGetFullFilePath = (recordDir, relativeFilePath) => {
  const naughtyUser = () => { throw new ForbiddenError('naughty naughty'); };

  if (relativeFilePath.startsWith('..')) naughtyUser();

  const pathParts = splitKey(relativeFilePath);

  if (fp.includes('..')(pathParts)) naughtyUser();

  const recordKeyParts = splitKey(recordDir);

  const fullPathParts = [
    ...recordKeyParts,
    'files',
    ...fp.filter(p => p !== '.')(pathParts),
  ];

  return joinKey(fullPathParts);
};

const downloadFile = app => async (recordKey, relativePath) => apiWrapper(
  app,
  events.recordApi.uploadFile,
  permission.readRecord.isAuthorized(recordKey),
  { recordKey, relativePath },//remove dupe key 'recordKey' from object
  _downloadFile, app, recordKey, relativePath,
); 


const _downloadFile = async (app, recordKey, relativePath) => {
  if (isNothing(recordKey)) { throw new BadRequestError('Record Key not supplied'); }
  if (isNothing(relativePath)) { throw new BadRequestError('file path not supplied'); }

  const {dir} = getRecordInfo(app.hierarchy, recordKey);
  return await app.datastore.readableFileStream(
    safeGetFullFilePath(
      dir, relativePath,
    ),
  );
};

const customId = app => (nodeName, id) => {
  const node = $(app.hierarchy, [
    getFlattenedHierarchy,
    fp.find(n => n.name === nodeName),
  ]);

  if (!node) throw new NotFoundError(`Cannot find node ${nodeName}`);

  return `${node.nodeId}-${id}`;
};

const setCustomId = app => (record, id) => {
  record.id = customId(app)(record.type, id);

  const keyParts = splitKey(record.key);

  record.key = $(keyParts, [
    fp.take(keyParts.length - 1),
    fp.union([record.id]),
    joinKey,
  ]);

  return record;
};

const api = app => ({
  getNew: getNew(app),
  getNewChild: getNewChild(app),
  save: save(app),
  load: load(app),
  delete: deleteRecord$1(app, false),
  validate: validate(app),
  getContext: getContext(app),
  uploadFile: uploadFile(app),
  downloadFile: downloadFile(app),
  customId: customId(app),
  setCustomId: setCustomId(app),
});


const getRecordApi = app => api(app);

const getAllowedRecordTypes = app => key => apiWrapperSync(
  app,
  events.collectionApi.getAllowedRecordTypes,
  alwaysAuthorized,
  { key },
  _getAllowedRecordTypes, app, key,
);

const _getAllowedRecordTypes = (app, key) => {
  key = safeKey(key);
  const node = getNodeForCollectionPath(app.hierarchy)(key);
  return isNothing(node) ? [] : [node.name];
};

const getCollectionApi = app => ({
  getAllowedRecordTypes: getAllowedRecordTypes(app),
  getAllIdsIterator: getAllIdsIterator(app),
  delete: deleteCollection(app),
});

/** rebuilds an index
 * @param {object} app - the application container
 * @param {string} indexNodeKey - node key of the index, which the index belongs to
 */
const buildIndex = app => async indexNodeKey => apiWrapper(
  app,
  events.indexApi.buildIndex,
  permission.manageIndex.isAuthorized,
  { indexNodeKey },
  _buildIndex, app, indexNodeKey,
);

const _buildIndex = async (app, indexNodeKey) => {
  const indexNode = getNode(app.hierarchy, indexNodeKey);

  await createBuildIndexFolder(app.datastore, indexNodeKey);

  if (!isIndex(indexNode)) { throw new BadRequestError('BuildIndex: must supply an indexnode'); }

  if (indexNode.indexType === 'reference') {
    await buildReverseReferenceIndex(
      app, indexNode,
    );
  } else {
    await buildHeirarchalIndex(
      app, indexNode,
    );
  }

  await app.cleanupTransactions();
};

const buildReverseReferenceIndex = async (app, indexNode) => {
  // Iterate through all referencING records,
  // and update referenced index for each record
  let recordCount = 0;
  const referencingNodes = $(app.hierarchy, [
    getFlattenedHierarchy,
    fp.filter(n => isRecord(n)
                    && fp.some(fieldReversesReferenceToIndex(indexNode))(n.fields)),
  ]);

  const createTransactionsForReferencingNode = async (referencingNode) => {
    const iterateReferencingNodes = await getAllIdsIterator(app)(referencingNode.collectionNodeKey());

    let referencingIdIterator = await iterateReferencingNodes();
    while (!referencingIdIterator.done) {
      const { result } = referencingIdIterator;
      for (const id of result.ids) {
        const recordKey = joinKey(result.collectionKey, id);
        await transactionForBuildIndex(app, indexNode.nodeKey(), recordKey, recordCount);
        recordCount++;
      }
      referencingIdIterator = await iterateReferencingNodes();
    }
  };

  for (const referencingNode of referencingNodes) {
    await createTransactionsForReferencingNode(referencingNode);
  }
};

/*
const getAllowedParentCollectionNodes = (hierarchy, indexNode) => $(getAllowedRecordNodesForIndex(hierarchy, indexNode), [
  map(n => n.parent()),
]);
*/

const buildHeirarchalIndex = async (app, indexNode) => {
  let recordCount = 0;

  const createTransactionsForIds = async (collectionKey, ids) => {
    for (const recordId of ids) {
      const recordKey = joinKey(collectionKey, recordId);

      const recordNode = getRecordNodeById(
        app.hierarchy,
        recordId,
      );

      if (recordNodeApplies(indexNode)(recordNode)) {
        await transactionForBuildIndex(
          app, indexNode.nodeKey(),
          recordKey, recordCount,
        );
        recordCount++;
      }
    }
  };


  const collectionRecords = getAllowedRecordNodesForIndex(app.hierarchy, indexNode);

  for (const targetCollectionRecordNode of collectionRecords) {
    const allIdsIterator = await getAllIdsIterator(app)(targetCollectionRecordNode.collectionNodeKey());

    let allIds = await allIdsIterator();
    while (allIds.done === false) {
      await createTransactionsForIds(
        allIds.result.collectionKey,
        allIds.result.ids,
      );
      allIds = await allIdsIterator();
    }
  }

  return recordCount;
};

// const chooseChildRecordNodeByKey = (collectionNode, recordId) => find(c => recordId.startsWith(c.nodeId))(collectionNode.children);

const recordNodeApplies = indexNode => recordNode => fp.includes(recordNode.nodeId)(indexNode.allowedRecordNodeIds);

const aggregates = app => async (indexKey, rangeStartParams = null, rangeEndParams = null) => apiWrapper(
  app,
  events.indexApi.aggregates,
  permission.readIndex.isAuthorized(indexKey),
  { indexKey, rangeStartParams, rangeEndParams },
  _aggregates, app, indexKey, rangeStartParams, rangeEndParams,
);

const _aggregates = async (app, indexKey, rangeStartParams, rangeEndParams) => {
  indexKey = safeKey(indexKey);
  const indexNode = getExactNodeForKey(app.hierarchy)(indexKey);
  const indexDir = getIndexDir(app.hierarchy, indexKey);

  if (!isIndex(indexNode)) { throw new BadRequestError('supplied key is not an index'); }

  if (isShardedIndex(indexNode)) {
    const shardKeys = await getShardKeysInRange(
      app, indexNode, indexDir, rangeStartParams, rangeEndParams,
    );
    let aggregateResult = null;
    for (const k of shardKeys) {
      const shardResult = await getAggregates(app.hierarchy, app.datastore, indexNode, k);
      if (aggregateResult === null) {
        aggregateResult = shardResult;
      } else {
        aggregateResult = mergeShardAggregate(
          aggregateResult,
          shardResult,
        );
      }
    }
    return aggregateResult;
  }
  return await getAggregates(
    app.hierarchy,
    app.datastore,
    indexNode,
    getUnshardedIndexDataKey(indexDir),
  );
};

const mergeShardAggregate = (totals, shard) => {
  const mergeGrouping = (tot, shr) => {
    tot.count += shr.count;
    for (const aggName in tot) {
      if (aggName === 'count') continue;
      const totagg = tot[aggName];
      const shragg = shr[aggName];
      totagg.sum += shragg.sum;
      totagg.max = totagg.max > shragg.max
        ? totagg.max
        : shragg.max;
      totagg.min = totagg.min < shragg.min
        ? totagg.min
        : shragg.min;
      totagg.mean = totagg.sum / tot.count;
    }
    return tot;
  };

  for (const aggGroupDef in totals) {
    for (const grouping in shard[aggGroupDef]) {
      const groupingTotal = totals[aggGroupDef][grouping];
      totals[aggGroupDef][grouping] = fp.isUndefined(groupingTotal)
        ? shard[aggGroupDef][grouping]
        : mergeGrouping(
          totals[aggGroupDef][grouping],
          shard[aggGroupDef][grouping],
        );
    }
  }

  return totals;
};

const getAggregates = async (hierarchy, datastore, index, indexedDataKey) => {
  const aggregateResult = {};
  const doRead = iterateIndex(
        async item => {
      applyItemToAggregateResult(
        index, aggregateResult, item,
      );
      return CONTINUE_READING_RECORDS;
    },
        async () => aggregateResult
  );

  return await doRead(hierarchy, datastore, index, indexedDataKey);
};


const applyItemToAggregateResult = (indexNode, result, item) => {
  const getInitialAggregateResult = () => ({
    sum: 0, mean: null, max: null, min: null,
  });

  const applyAggregateResult = (agg, existing, count) => {
    const value = compilerUtil.compileCode(agg.aggregatedValue)({ record: item });

    if (!fp.isNumber(value)) return existing;

    existing.sum += value;
    existing.max = value > existing.max || existing.max === null
      ? value
      : existing.max;
    existing.min = value < existing.min || existing.min === null
      ? value
      : existing.min;
    existing.mean = existing.sum / count;
    return existing;
  };

  for (const aggGroup of indexNode.aggregateGroups) {
    if (!fp.has(aggGroup.name)(result)) {
      result[aggGroup.name] = {};
    }

    const thisGroupResult = result[aggGroup.name];

    if (isNonEmptyString(aggGroup.condition)) {
      if (!compilerUtil.compileExpression(aggGroup.condition)({ record: item })) {
        continue;
      }
    }

    let group = isNonEmptyString(aggGroup.groupBy)
      ? compilerUtil.compileCode(aggGroup.groupBy)({ record: item })
      : 'all';
    if (!isNonEmptyString(group)) {
      group = '(none)';
    }

    if (!fp.has(group)(thisGroupResult)) {
      thisGroupResult[group] = { count: 0 };
      for (const agg of aggGroup.aggregates) {
        thisGroupResult[group][agg.name] = getInitialAggregateResult();
      }
    }

    thisGroupResult[group].count++;

    for (const agg of aggGroup.aggregates) {
      const existingValues = thisGroupResult[group][agg.name];
      thisGroupResult[group][agg.name] = applyAggregateResult(
        agg, existingValues,
        thisGroupResult[group].count,
      );
    }
  }
};

const getIndexApi = app => ({
  listItems: listItems(app),
  buildIndex: buildIndex(app),
  aggregates: aggregates(app),
});

const createNodeErrors = {
  indexCannotBeParent: 'Index template cannot be a parent',
  allNonRootNodesMustHaveParent: 'Only the root node may have no parent',
  indexParentMustBeRecordOrRoot: 'An index may only have a record or root as a parent',
  aggregateParentMustBeAnIndex: 'aggregateGroup parent must be an index',
};

const pathRegxMaker = node => () => node.nodeKey().replace(/{id}/g, '[a-zA-Z0-9_-]+');

const nodeKeyMaker = node => () => switchCase(

  [n => isRecord(n) && !isSingleRecord(n),
    n => joinKey(
      node.parent().nodeKey(),
      node.collectionName,
      `${n.nodeId}-{id}`,
    )],

  [isRoot,
    fp.constant('/')],

  [defaultCase,
    n => joinKey(node.parent().nodeKey(), n.name)],

)(node);


const validate$1 = parent => (node) => {
  if (isIndex(node)
        && isSomething(parent)
        && !isRoot(parent)
        && !isRecord(parent)) {
    throw new BadRequestError(createNodeErrors.indexParentMustBeRecordOrRoot);
  }

  if (isaggregateGroup(node)
        && isSomething(parent)
        && !isIndex(parent)) {
    throw new BadRequestError(createNodeErrors.aggregateParentMustBeAnIndex);
  }

  if (isNothing(parent) && !isRoot(node)) { throw new BadRequestError(createNodeErrors.allNonRootNodesMustHaveParent); }

  return node;
};

const construct = parent => (node) => {
  node.nodeKey = nodeKeyMaker(node);
  node.pathRegx = pathRegxMaker(node);
  node.parent = fp.constant(parent);
  node.isRoot = () => isNothing(parent)
                        && node.name === 'root'
                        && node.type === 'root';
  if (isCollectionRecord(node)) {
    node.collectionNodeKey = () => joinKey(
      parent.nodeKey(), node.collectionName,
    );
    node.collectionPathRegx = () => joinKey(
      parent.pathRegx(), node.collectionName,
    );
  }
  return node;
};

const addToParent = (obj) => {
  const parent = obj.parent();
  if (isSomething(parent)) {
    if (isIndex(obj))
    // Q: why are indexes not children ?
    // A: because they cannot have children of their own.
    { 
      parent.indexes.push(obj); 
    } 
    else if (isaggregateGroup(obj)) 
    { 
      parent.aggregateGroups.push(obj); 
    } else { 
      parent.children.push(obj); 
    }

    if (isRecord(obj)) {
      const defaultIndex = _.find(
        parent.indexes,
        i => i.name === `${parent.name}_index`,
      );
      if (defaultIndex) {
        defaultIndex.allowedRecordNodeIds.push(obj.nodeId);
      }
    }
  }
  return obj;
};

const constructNode = (parent, obj) => $(obj, [
  construct(parent),
  validate$1(parent),
  addToParent,
]);

const getNodeId = (parentNode) => {
  // this case is handled better elsewhere
  if (!parentNode) return null;
  const findRoot = n => (isRoot(n) ? n : findRoot(n.parent()));
  const root = findRoot(parentNode);

  return ($(root, [
    getFlattenedHierarchy,
    fp.map(n => n.nodeId),
    fp.max]) + 1);
};

const constructHierarchy = (node, parent) => {
  construct(parent)(node);
  if (node.indexes) {
    _.each(node.indexes,
      child => constructHierarchy(child, node));
  }
  if (node.aggregateGroups) {
    _.each(node.aggregateGroups,
      child => constructHierarchy(child, node));
  }
  if (node.children && node.children.length > 0) {
    _.each(node.children,
      child => constructHierarchy(child, node));
  }
  if (node.fields) {
    _.each(node.fields,
      f => _.each(f.typeOptions, (val, key) => {
        const def = all$1[f.type].optionDefinitions[key];
        if (!def) {
          // unknown typeOption
          delete f.typeOptions[key];
        } else {
          f.typeOptions[key] = def.parse(val);
        }
      }));
  }
  return node;
};


const getNewRootLevel = () => construct()({
  name: 'root',
  type: 'root',
  children: [],
  pathMaps: [],
  indexes: [],
  nodeId: 0,
});

const _getNewRecordTemplate = (parent, name, createDefaultIndex, isSingle) => {
  const node = constructNode(parent, {
    name,
    type: 'record',
    fields: [],
    children: [],
    validationRules: [],
    nodeId: getNodeId(parent),
    indexes: [],
    estimatedRecordCount: isRecord(parent) ? 500 : 1000000,
    collectionName: '',
    isSingle,
  });

  if (createDefaultIndex) {
    const defaultIndex = getNewIndexTemplate(parent);
    defaultIndex.name = `${name}_index`;
    defaultIndex.allowedRecordNodeIds.push(node.nodeId);
  }

  return node;
};

const getNewRecordTemplate = (parent, name = '', createDefaultIndex = true) => _getNewRecordTemplate(parent, name, createDefaultIndex, false);

const getNewSingleRecordTemplate = parent => _getNewRecordTemplate(parent, '', false, true);

const getNewIndexTemplate = (parent, type = 'ancestor') => constructNode(parent, {
  name: '',
  type: 'index',
  map: 'return {...record};',
  filter: '',
  indexType: type,
  getShardName: '',
  getSortKey: 'record.id',
  aggregateGroups: [],
  allowedRecordNodeIds: [],
  nodeId: getNodeId(parent),
});

const getNewAggregateGroupTemplate = index => constructNode(index, {
  name: '',
  type: 'aggregateGroup',
  groupBy: '',
  aggregates: [],
  condition: '',
  nodeId: getNodeId(index),
});

const getNewAggregateTemplate = (set) => {
  const aggregatedValue = {
    name: '',
    aggregatedValue: '',
  };
  set.aggregates.push(aggregatedValue);
  return aggregatedValue;
};

const fieldErrors = {
  AddFieldValidationFailed: 'Add field validation: ',
};

const allowedTypes = () => fp.keys(all$1);

const getNewField = type => ({
  name: '', // how field is referenced internally
  type,
  typeOptions: getDefaultOptions$1(type),
  label: '', // how field is displayed
  getInitialValue: 'default', // function that gets value when initially created
  getUndefinedValue: 'default', // function that gets value when field undefined on record
});

const fieldRules = allFields => [
  makerule('name', 'field name is not set',
    f => isNonEmptyString(f.name)),
  makerule('type', 'field type is not set',
    f => isNonEmptyString(f.type)),
  makerule('label', 'field label is not set',
    f => isNonEmptyString(f.label)),
  makerule('getInitialValue', 'getInitialValue function is not set',
    f => isNonEmptyString(f.getInitialValue)),
  makerule('getUndefinedValue', 'getUndefinedValue function is not set',
    f => isNonEmptyString(f.getUndefinedValue)),
  makerule('name', 'field name is duplicated',
    f => isNothingOrEmpty(f.name)
             || fp.countBy('name')(allFields)[f.name] === 1),
  makerule('type', 'type is unknown',
    f => isNothingOrEmpty(f.type)
             || fp.some(t => f.type === t)(allowedTypes())),
];

const typeOptionsRules = (field) => {
  const type = all$1[field.type];
  if (isNothing(type)) return [];

  const def = optName => type.optionDefinitions[optName];

  return $(field.typeOptions, [
    fp.keys,
    fp.filter(o => isSomething(def(o))
                    && isSomething(def(o).isValid)),
    fp.map(o => makerule(
      `typeOptions.${o}`,
      `${def(o).requirementDescription}`,
      field => def(o).isValid(field.typeOptions[o]),
    )),
  ]);
};

const validateField = allFields => (field) => {
  const everySingleField = fp.includes(field)(allFields) ? allFields : [...allFields, field];
  return applyRuleSet([...fieldRules(everySingleField), ...typeOptionsRules(field)])(field);
};

const validateAllFields = recordNode => $(recordNode.fields, [
  fp.map(validateField(recordNode.fields)),
  fp.flatten,
]);

const addField = (recordTemplate, field) => {
  if (isNothingOrEmpty(field.label)) {
    field.label = field.name;
  }
  const validationMessages = validateField([...recordTemplate.fields, field])(field);
  if (validationMessages.length > 0) {
    const errors = fp.map(m => m.error)(validationMessages);
    throw new BadRequestError(`${fieldErrors.AddFieldValidationFailed} ${errors.join(', ')}`);
  }
  recordTemplate.fields.push(field);
};

const getNewRecordValidationRule = (invalidFields,
  messageWhenInvalid,
  expressionWhenValid) => ({
  invalidFields, messageWhenInvalid, expressionWhenValid,
});

const getStaticValue = switchCase(
  [fp.isNumber, v => v.toString()],
  [fp.isBoolean, v => v.toString()],
  [fp.defaultCase, v => `'${v}'`],
);

const commonRecordValidationRules = ({

  fieldNotEmpty: fieldName => getNewRecordValidationRule(
    [fieldName],
    `${fieldName} is empty`,
    `!_.isEmpty(record['${fieldName}'])`,
  ),

  fieldBetween: (fieldName, min, max) => getNewRecordValidationRule(
    [fieldName],
    `${fieldName} must be between ${min.toString()} and ${max.toString()}`,
    `record['${fieldName}'] >= ${getStaticValue(min)} &&  record['${fieldName}'] <= ${getStaticValue(max)} `,
  ),

  fieldGreaterThan: (fieldName, min, max) => getNewRecordValidationRule(
    [fieldName],
    `${fieldName} must be greater than ${min.toString()} and ${max.toString()}`,
    `record['${fieldName}'] >= ${getStaticValue(min)}  `,
  ),
});

const addRecordValidationRule = recordNode => rule => recordNode.validationRules.push(rule);

const createTrigger = () => ({
  actionName: '',
  eventName: '',
  // function, has access to event context,
  // returns object that is used as parameter to action
  // only used if triggered by event
  optionsCreator: '',
  // action runs if true,
  // has access to event context
  condition: '',
});

const createAction = () => ({
  name: '',
  behaviourSource: '',
  // name of function in actionSource
  behaviourName: '',
  // parameter passed into behaviour.
  // any other parms passed at runtime e.g.
  // by trigger, or manually, will be merged into this
  initialOptions: {},
});

const aggregateRules = [
  makerule('name', 'choose a name for the aggregate',
    a => isNonEmptyString(a.name)),
  makerule('aggregatedValue', 'aggregatedValue does not compile',
    a => fp.isEmpty(a.aggregatedValue)
            || executesWithoutException(
              () => compilerUtil.compileCode(a.aggregatedValue),
            )),
];

const validateAggregate = aggregate => applyRuleSet(aggregateRules)(aggregate);

const validateAllAggregates = all => $(all, [
  fp.map(validateAggregate),
  fp.flatten,
]);

const ruleSet = (...sets) => fp.constant(fp.flatten([...sets]));

const commonRules = [
  makerule('name', 'node name is not set',
    node => stringNotEmpty(node.name)),
  makerule('type', 'node type not recognised',
    anyTrue(isRecord, isRoot, isIndex, isaggregateGroup)),
];

const recordRules = [
  makerule('fields', 'no fields have been added to the record',
    node => isNonEmptyArray(node.fields)),
  makerule('validationRules', "validation rule is missing a 'messageWhenValid' member",
    node => fp.every(r => fp.has('messageWhenInvalid')(r))(node.validationRules)),
  makerule('validationRules', "validation rule is missing a 'expressionWhenValid' member",
    node => fp.every(r => fp.has('expressionWhenValid')(r))(node.validationRules)),
];


const aggregateGroupRules = [
  makerule('condition', 'condition does not compile',
    a => fp.isEmpty(a.condition)
             || executesWithoutException(
               () => compilerUtil.compileExpression(a.condition),
             )),
];

const getRuleSet = node => switchCase(

  [isRecord, ruleSet(
    commonRules,
    recordRules,
  )],

  [isIndex, ruleSet(
    commonRules,
    indexRuleSet,
  )],

  [isaggregateGroup, ruleSet(
    commonRules,
    aggregateGroupRules,
  )],

  [defaultCase, ruleSet(commonRules, [])],
)(node);

const validateNode = node => applyRuleSet(getRuleSet(node))(node);

const validateAll = (appHierarchy) => {
  const flattened = getFlattenedHierarchy(
    appHierarchy,
  );

  const duplicateNameRule = makerule(
    'name', 'node names must be unique under shared parent',
    n => fp.filter(f => f.parent() === n.parent()
                          && f.name === n.name)(flattened).length === 1,
  );

  const duplicateNodeKeyErrors = $(flattened, [
    fp.map(n => applyRuleSet([duplicateNameRule])(n)),
    fp.filter(isSomething),
    fp.flatten,
  ]);

  const fieldErrors = $(flattened, [
    fp.filter(isRecord),
    fp.map(validateAllFields),
    fp.flatten,
  ]);

  const aggregateErrors = $(flattened, [
    fp.filter(isaggregateGroup),
    fp.map(s => validateAllAggregates(
      s.aggregates,
    )),
    fp.flatten,
  ]);

  return $(flattened, [
    fp.map(validateNode),
    fp.flatten,
    fp.union(duplicateNodeKeyErrors),
    fp.union(fieldErrors),
    fp.union(aggregateErrors),
  ]);
};

const actionRules = [
  makerule('name', 'action must have a name',
    a => isNonEmptyString(a.name)),
  makerule('behaviourName', 'must supply a behaviour name to the action',
    a => isNonEmptyString(a.behaviourName)),
  makerule('behaviourSource', 'must supply a behaviour source for the action',
    a => isNonEmptyString(a.behaviourSource)),
];

const duplicateActionRule = makerule('', 'action name must be unique', () => {});

const validateAction = action => applyRuleSet(actionRules)(action);


const validateActions = (allActions) => {
  const duplicateActions = $(allActions, [
    fp.filter(a => fp.filter(a2 => a2.name === a.name)(allActions).length > 1),
    fp.map(a => validationError(duplicateActionRule, a)),
  ]);

  const errors = $(allActions, [
    fp.map(validateAction),
    fp.flatten,
    fp.union(duplicateActions),
    fp.uniqBy('name'),
  ]);

  return errors;
};

const triggerRules = actions => ([
  makerule('actionName', 'must specify an action',
    t => isNonEmptyString(t.actionName)),
  makerule('eventName', 'must specify and event',
    t => isNonEmptyString(t.eventName)),
  makerule('actionName', 'specified action not supplied',
    t => !t.actionName
             || fp.some(a => a.name === t.actionName)(actions)),
  makerule('eventName', 'invalid Event Name',
    t => !t.eventName
             || fp.includes(t.eventName)(eventsList)),
  makerule('optionsCreator', 'Options Creator does not compile - check your expression',
    (t) => {
      if (!t.optionsCreator) return true;
      try {
        compilerUtil.compileCode(t.optionsCreator);
        return true;
      } catch (_) { return false; }
    }),
  makerule('condition', 'Trigger condition does not compile - check your expression',
    (t) => {
      if (!t.condition) return true;
      try {
        compilerUtil.compileExpression(t.condition);
        return true;
      } catch (_) { return false; }
    }),
]);

const validateTrigger = (trigger, allActions) => {
  const errors = applyRuleSet(triggerRules(allActions))(trigger);

  return errors;
};

const validateTriggers = (triggers, allActions) => $(triggers, [
  fp.map(t => validateTrigger(t, allActions)),
  fp.flatten,
]);

const getApplicationDefinition = datastore => async () => {
  const exists = await datastore.exists(appDefinitionFile);

  if (!exists) throw new Error('Application definition does not exist');

  const appDefinition = await datastore.loadJson(appDefinitionFile);
  appDefinition.hierarchy = constructHierarchy(
    appDefinition.hierarchy,
  );
  return appDefinition;
};

const saveApplicationHierarchy = app => async hierarchy => apiWrapper(
  app,
  events.templateApi.saveApplicationHierarchy,
  permission.writeTemplates.isAuthorized,
  { hierarchy },
  _saveApplicationHierarchy, app.datastore, hierarchy,
);


const _saveApplicationHierarchy = async (datastore, hierarchy) => {
  const validationErrors = await validateAll(hierarchy);
  if (validationErrors.length > 0) {
    throw new Error(`Hierarchy is invalid: ${_.join(
      validationErrors.map(e => `${e.item.nodeKey ? e.item.nodeKey() : ''} : ${e.error}`),
      ',',
    )}`);
  }

  if (await datastore.exists(appDefinitionFile)) {
    const appDefinition = await datastore.loadJson(appDefinitionFile);
    appDefinition.hierarchy = hierarchy;
    await datastore.updateJson(appDefinitionFile, appDefinition);
  } else {
    await datastore.createFolder('/.config');
    const appDefinition = { actions: [], triggers: [], hierarchy };
    await datastore.createJson(appDefinitionFile, appDefinition);
  }
};

const saveActionsAndTriggers = app => async (actions, triggers) => apiWrapper(
  app,
  events.templateApi.saveActionsAndTriggers,
  permission.writeTemplates.isAuthorized,
  { actions, triggers },
  _saveActionsAndTriggers, app.datastore, actions, triggers,
);

const _saveActionsAndTriggers = async (datastore, actions, triggers) => {
  if (await datastore.exists(appDefinitionFile)) {
    const appDefinition = await datastore.loadJson(appDefinitionFile);
    appDefinition.actions = actions;
    appDefinition.triggers = triggers;

    const actionValidErrs = fp.map(e => e.error)(validateActions(actions));

    if (actionValidErrs.length > 0) {
      throw new BadRequestError(`Actions are invalid: ${_.join(actionValidErrs, ', ')}`);
    }

    const triggerValidErrs = fp.map(e => e.error)(validateTriggers(triggers, actions));

    if (triggerValidErrs.length > 0) {
      throw new BadRequestError(`Triggers are invalid: ${_.join(triggerValidErrs, ', ')}`);
    }

    await datastore.updateJson(appDefinitionFile, appDefinition);
  } else {
    throw new BadRequestError('Cannot save actions: Application definition does not exist');
  }
};

const getBehaviourSources = async (datastore) => {
    await datastore.loadFile('/.config/behaviourSources.js');
};

const api$1 = app => ({

  getApplicationDefinition: getApplicationDefinition(app.datastore),
  saveApplicationHierarchy: saveApplicationHierarchy(app),
  saveActionsAndTriggers: saveActionsAndTriggers(app),
  getBehaviourSources: () => getBehaviourSources(app.datastore),
  getNewRootLevel,
  constructNode,
  getNewIndexTemplate,
  getNewRecordTemplate,
  getNewField,
  validateField,
  addField,
  fieldErrors,
  getNewRecordValidationRule,
  commonRecordValidationRules,
  addRecordValidationRule,
  createAction,
  createTrigger,
  validateActions,
  validateTrigger,
  getNewAggregateGroupTemplate,
  getNewAggregateTemplate,
  constructHierarchy,
  getNewSingleRecordTemplate,
  allTypes: all$1,
  validateNode,
  validateAll,
  validateTriggers,
});


const getTemplateApi = app => api$1(app);

const getUsers = app => async () => apiWrapper(
  app,
  events.authApi.getUsers,
  permission.listUsers.isAuthorized,
  {},
  _getUsers, app,
);

const _getUsers = async app => $(await app.datastore.loadJson(USERS_LIST_FILE), [
  fp.map(stripUserOfSensitiveStuff),
]);

const loadAccessLevels = app => async () => apiWrapper(
  app,
  events.authApi.loadAccessLevels,
  permission.listAccessLevels.isAuthorized,
  {},
  _loadAccessLevels, app,
);

const _loadAccessLevels = async app => await app.datastore.loadJson(ACCESS_LEVELS_FILE);

const dummyHash = '$argon2i$v=19$m=4096,t=3,p=1$UZRo409UYBGjHJS3CV6Uxw$rU84qUqPeORFzKYmYY0ceBLDaPO+JWSH4PfNiKXfIKk';

const authenticate = app => async (username, password) => apiWrapper(
  app,
  events.authApi.authenticate,
  alwaysAuthorized,
  { username, password },
  _authenticate, app, username, password,
);

const _authenticate = async (app, username, password) => {
  if (isNothingOrEmpty(username) || isNothingOrEmpty(password)) { return null; }

  const allUsers = await _getUsers(app);
  let user = getUserByName(
    allUsers,
    username,
  );

  const notAUser = 'not-a-user';
  // continue with non-user - so time to verify remains consistent
  // with verification of a valid user
  if (!user || !user.enabled) { user = notAUser; }

  let userAuth;
  try {
    userAuth = await app.datastore.loadJson(
      userAuthFile(username),
    );
  } catch (_) {
    userAuth = { accessLevels: [], passwordHash: dummyHash };
  }

  const permissions = await buildUserPermissions(app, user.accessLevels);

  const verified = await app.crypto.verify(
    userAuth.passwordHash,
    password,
  );

  if (user === notAUser) { return null; }

  return verified
    ? {
      ...user, permissions, temp: false, isUser: true,
    }
    : null;
};

const authenticateTemporaryAccess = app => async (tempAccessCode) => {
  if (isNothingOrEmpty(tempAccessCode)) { return null; }

  const temp = parseTemporaryCode(tempAccessCode);
  let user = $(await _getUsers(app), [
    fp.find(u => u.temporaryAccessId === temp.id),
  ]);

  const notAUser = 'not-a-user';
  if (!user || !user.enabled) { user = notAUser; }

  let userAuth;
  try {
    userAuth = await app.datastore.loadJson(
      userAuthFile(user.name),
    );
  } catch (e) {
    userAuth = {
      temporaryAccessHash: dummyHash,
      temporaryAccessExpiryEpoch: (await app.getEpochTime() + 10000),
    };
  }

  if (userAuth.temporaryAccessExpiryEpoch < await app.getEpochTime()) { user = notAUser; }

  const tempCode = !temp.code ? shortid.generate() : temp.code;
  const verified = await app.crypto.verify(
    userAuth.temporaryAccessHash,
    tempCode,
  );

  if (user === notAUser) { return null; }

  return verified
    ? {
      ...user,
      permissions: [],
      temp: true,
      isUser: true,
    }
    : null;
};

const buildUserPermissions = async (app, userAccessLevels) => {
  const allAccessLevels = await _loadAccessLevels(app);

  return $(allAccessLevels.levels, [
    fp.filter(l => fp.some(ua => l.name === ua)(userAccessLevels)),
    fp.map(l => l.permissions),
    fp.flatten,
  ]);
};

const createTemporaryAccess$1 = app => async userName => apiWrapper(
  app,
  events.authApi.createTemporaryAccess,
  alwaysAuthorized,
  { userName },
  _createTemporaryAccess, app, userName,
);

const _createTemporaryAccess = async (app, userName) => {
  const tempCode = await getTemporaryCode(app);

  const lock = await getLock(
    app, USERS_LOCK_FILE, 1000, 2,
  );

  if (isNolock(lock)) { throw new Error('Unable to create temporary access, could not get lock - try again'); }

  try {
    const users = await app.datastore.loadJson(USERS_LIST_FILE);

    const user = getUserByName(users, userName);
    user.temporaryAccessId = tempCode.temporaryAccessId;

    await app.datastore.updateJson(
      USERS_LIST_FILE,
      users,
    );
  } finally {
    await releaseLock(app, lock);
  }

  const userAuth = await app.datastore.loadJson(
    userAuthFile(userName),
  );
  userAuth.temporaryAccessHash = tempCode.temporaryAccessHash;

  userAuth.temporaryAccessExpiryEpoch = tempCode.temporaryAccessExpiryEpoch;

  await app.datastore.updateJson(
    userAuthFile(userName),
    userAuth,
  );

  return tempCode.tempCode;
};

const getTemporaryCode = async (app) => {
  const tempCode = shortid.generate()
        + shortid.generate()
        + shortid.generate()
        + shortid.generate();

  const tempId = shortid.generate();

  return {
    temporaryAccessHash: await app.crypto.hash(
      tempCode,
    ),
    temporaryAccessExpiryEpoch:
            (await app.getEpochTime()) + tempCodeExpiryLength,
    tempCode: `tmp:${tempId}:${tempCode}`,
    temporaryAccessId: tempId,
  };
};

const userRules = allUsers => [
  makerule('name', 'username must be set',
    u => isNonEmptyString(u.name)),
  makerule('accessLevels', 'user must have at least one access level',
    u => u.accessLevels.length > 0),
  makerule('name', 'username must be unique',
    u => fp.filter(u2 => insensitiveEquals(u2.name, u.name))(allUsers).length === 1),
  makerule('accessLevels', 'access levels must only contain stings',
    u => all(isNonEmptyString)(u.accessLevels)),
];

const validateUser = () => (allusers, user) => applyRuleSet(userRules(allusers))(user);

const getNewUser = app => () => apiWrapperSync(
  app,
  events.authApi.getNewUser,
  permission.createUser.isAuthorized,
  {},
  _getNewUser, app,
);

const _getNewUser = () => ({
  name: '',
  accessLevels: [],
  enabled: true,
  temporaryAccessId: '',
});

const getNewUserAuth = app => () => apiWrapperSync(
  app,
  events.authApi.getNewUserAuth,
  permission.createUser.isAuthorized,
  {},
  _getNewUserAuth, app,
);

const _getNewUserAuth = () => ({
  passwordHash: '',
  temporaryAccessHash: '',
  temporaryAccessExpiryEpoch: 0,
});

const isValidPassword = app => password => apiWrapperSync(
  app,
  events.authApi.isValidPassword,
  alwaysAuthorized,
  { password },
  _isValidPassword, app, password,
);

const _isValidPassword = (app, password) => scorePassword(password).score > 30;

const changeMyPassword = app => async (currentPw, newpassword) => apiWrapper(
  app,
  events.authApi.changeMyPassword,
  alwaysAuthorized,
  { currentPw, newpassword },
  _changeMyPassword, app, currentPw, newpassword,
);

const _changeMyPassword = async (app, currentPw, newpassword) => {
  const existingAuth = await app.datastore.loadJson(
    userAuthFile(app.user.name),
  );

  if (isSomething(existingAuth.passwordHash)) {
    const verified = await app.crypto.verify(
      existingAuth.passwordHash,
      currentPw,
    );

    if (verified) {
      await await doSet(
        app, existingAuth,
        app.user.name, newpassword,
      );
      return true;
    }
  }

  return false;
};

const setPasswordFromTemporaryCode = app => async (tempCode, newpassword) => apiWrapper(
  app,
  events.authApi.setPasswordFromTemporaryCode,
  alwaysAuthorized,
  { tempCode, newpassword },
  _setPasswordFromTemporaryCode, app, tempCode, newpassword,
);


const _setPasswordFromTemporaryCode = async (app, tempCode, newpassword) => {
  const currentTime = await app.getEpochTime();

  const temp = parseTemporaryCode(tempCode);

  const user = $(await _getUsers(app), [
    fp.find(u => u.temporaryAccessId === temp.id),
  ]);

  if (!user) { return false; }

  const existingAuth = await app.datastore.loadJson(
    userAuthFile(user.name),
  );

  if (isSomething(existingAuth.temporaryAccessHash)
       && existingAuth.temporaryAccessExpiryEpoch > currentTime) {
    const verified = await app.crypto.verify(
      existingAuth.temporaryAccessHash,
      temp.code,
    );

    if (verified) {
      await doSet(
        app, existingAuth,
        user.name, newpassword,
      );
      return true;
    }
  }

  return false;
};

const doSet = async (app, auth, username, newpassword) => {
  auth.temporaryAccessHash = '';
  auth.temporaryAccessExpiryEpoch = 0;
  auth.passwordHash = await app.crypto.hash(
    newpassword,
  );
  await app.datastore.updateJson(
    userAuthFile(username),
    auth,
  );
};

const scorePassword = app => password => apiWrapperSync(
  app,
  events.authApi.scorePassword,
  alwaysAuthorized,
  { password },
  _scorePassword, password,
);

const _scorePassword = (password) => {
  // from https://stackoverflow.com/questions/948172/password-strength-meter
  // thank you https://stackoverflow.com/users/46617/tm-lv

  let score = 0;
  if (!password) { return score; }

  // award every unique letter until 5 repetitions
  const letters = new Object();
  for (let i = 0; i < password.length; i++) {
    letters[password[i]] = (letters[password[i]] || 0) + 1;
    score += 5.0 / letters[password[i]];
  }

  // bonus points for mixing it up
  const variations = {
    digits: /\d/.test(password),
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    nonWords: /\W/.test(password),
  };

  let variationCount = 0;
  for (const check in variations) {
    variationCount += (variations[check] == true) ? 1 : 0;
  }
  score += (variationCount - 1) * 10;

  const strengthText = score > 80
    ? 'strong'
    : score > 60
      ? 'good'
      : score >= 30
        ? 'weak'
        : 'very weak';

  return {
    score: parseInt(score),
    strengthText,
  };
};

const createUser$1 = app => async (user, password = null) => apiWrapper(
  app,
  events.authApi.createUser,
  permission.createUser.isAuthorized,
  { user, password },
  _createUser, app, user, password,
);

const _createUser = async (app, user, password = null) => {
  const lock = await getLock(
    app, USERS_LOCK_FILE, 1000, 2,
  );

  if (isNolock(lock)) { throw new Error('Unable to create user, could not get lock - try again'); }

  const users = await app.datastore.loadJson(USERS_LIST_FILE);

  const userErrors = validateUser()([...users, user], user);
  if (userErrors.length > 0) { throw new BadRequestError(`User is invalid. ${fp.join('; ')(userErrors)}`); }

  const { auth, tempCode, temporaryAccessId } = await getAccess(
    app, password,
  );
  user.tempCode = tempCode;
  user.temporaryAccessId = temporaryAccessId;

  if (fp.some(u => insensitiveEquals(u.name, user.name))(users)) { 
    throw new BadRequestError('User already exists'); 
  }

  users.push(
    stripUserOfSensitiveStuff(user),
  );

  await app.datastore.updateJson(
    USERS_LIST_FILE,
    users,
  );

  try {
    await app.datastore.createJson(
      userAuthFile(user.name),
      auth,
    );
  } catch (_) {
    await app.datastore.updateJson(
      userAuthFile(user.name),
      auth,
    );
  }

  await releaseLock(app, lock);

  return user;
};

const getAccess = async (app, password) => {
  const auth = getNewUserAuth(app)();

  if (isNonEmptyString(password)) {
    if (isValidPassword(password)) {
      auth.passwordHash = await app.crypto.hash(password);
      auth.temporaryAccessHash = '';
      auth.temporaryAccessId = '';
      auth.temporaryAccessExpiryEpoch = 0;
      return { auth };
    }
    throw new BadRequestError('Password does not meet requirements');
  } else {
    const tempAccess = await getTemporaryCode(app);
    auth.temporaryAccessHash = tempAccess.temporaryAccessHash;
    auth.temporaryAccessExpiryEpoch = tempAccess.temporaryAccessExpiryEpoch;
    auth.passwordHash = '';
    return ({
      auth,
      tempCode: tempAccess.tempCode,
      temporaryAccessId: tempAccess.temporaryAccessId,
    });
  }
};

const enableUser = app => async username => apiWrapper(
  app,
  events.authApi.enableUser,
  permission.enableDisableUser.isAuthorized,
  { username },
  _enableUser, app, username,
);

const disableUser = app => async username => apiWrapper(
  app,
  events.authApi.disableUser,
  permission.enableDisableUser.isAuthorized,
  { username },
  _disableUser, app, username,
);

const _enableUser = async (app, username) => await toggleUser(app, username, true);

const _disableUser = async (app, username) => await toggleUser(app, username, false);

const toggleUser = async (app, username, enabled) => {
  const lock = await getLock(app, USERS_LOCK_FILE, 1000, 1, 0);

  const actionName = enabled ? 'enable' : 'disable';

  if (isNolock(lock)) { throw new Error(`Could not ${actionName} user - cannot get lock`); }

  try {
    const users = await app.datastore.loadJson(USERS_LIST_FILE);
    const user = getUserByName(users, username);
    if (!user) { throw new NotFoundError(`Could not find user to ${actionName}`); }

    if (user.enabled === !enabled) {
      user.enabled = enabled;
      await app.datastore.updateJson(USERS_LIST_FILE, users);
    }
  } finally {
    releaseLock(app, lock);
  }
};

const getNewAccessLevel = () => () => ({
  name: '',
  permissions: [],
  default:false
});

const isAllowedType = t => $(permissionTypes, [
  fp.values,
  fp.includes(t),
]);

const isRecordOrIndexType = t => fp.some(p => p === t)([
  permissionTypes.CREATE_RECORD,
  permissionTypes.UPDATE_RECORD,
  permissionTypes.DELETE_RECORD,
  permissionTypes.READ_RECORD,
  permissionTypes.READ_INDEX,
  permissionTypes.EXECUTE_ACTION,
]);


const permissionRules = app => ([
  makerule('type', 'type must be one of allowed types',
    p => isAllowedType(p.type)),
  makerule('nodeKey', 'record and index permissions must include a valid nodeKey',
    p => (!isRecordOrIndexType(p.type))
             || isSomething(getNode(app.hierarchy, p.nodeKey))),
]);

const applyPermissionRules = app => applyRuleSet(permissionRules(app));

const accessLevelRules = allLevels => ([
  makerule('name', 'name must be set',
    l => isNonEmptyString(l.name)),
  makerule('name', 'access level names must be unique',
    l => fp.isEmpty(l.name)
             || fp.filter(a => insensitiveEquals(l.name, a.name))(allLevels).length === 1),
]);

const applyLevelRules = allLevels => applyRuleSet(accessLevelRules(allLevels));

const validateAccessLevel = app => (allLevels, level) => {
  const errs = $(level.permissions, [
    fp.map(applyPermissionRules(app)),
    fp.flatten,
    fp.concat(
      applyLevelRules(allLevels)(level),
    ),
  ]);

  return errs;
};

const validateAccessLevels = app => allLevels => apiWrapperSync(
  app,
  events.authApi.validateAccessLevels,
  alwaysAuthorized,
  { allLevels },
  _validateAccessLevels, app, allLevels,
);

const _validateAccessLevels = (app, allLevels) => $(allLevels, [
  fp.map(l => validateAccessLevel(app)(allLevels, l)),
  fp.flatten,
  fp.uniqWith((x, y) => x.field === y.field
                        && x.item === y.item
                        && x.error === y.error),
]);

const saveAccessLevels = app => async accessLevels => apiWrapper(
  app,
  events.authApi.saveAccessLevels,
  permission.writeAccessLevels.isAuthorized,
  { accessLevels },
  _saveAccessLevels, app, accessLevels,
);

const _saveAccessLevels = async (app, accessLevels) => {
  const validationErrors = validateAccessLevels(app)(accessLevels.levels);
  if (validationErrors.length > 0) {
    const errs = $(validationErrors, [
      fp.map(e => e.error),
      fp.join(', '),
    ]);
    throw new Error(
      `Access Levels Invalid: ${errs}`,
    );
  }

  const lock = await getLock(
    app, ACCESS_LEVELS_LOCK_FILE, 2000, 2,
  );

  if (isNolock(lock)) { throw new Error('Could not get lock to save access levels'); }

  try {
    const existing = await app.datastore.loadJson(ACCESS_LEVELS_FILE);
    if (existing.version !== accessLevels.version) { throw new Error('Access levels have already been updated, since you loaded'); }

    accessLevels.version++;

    app.datastore.updateJson(ACCESS_LEVELS_FILE, accessLevels);
  } finally {
    await releaseLock(app, lock);
  }
};

const generateFullPermissions = (app) => {
  const allNodes = getFlattenedHierarchy(app.hierarchy);
  const accessLevel = { permissions: [] };

  const recordNodes = $(allNodes, [
    fp.filter(isRecord),
  ]);

  for (const n of recordNodes) {
    permission.createRecord.add(n.nodeKey(), accessLevel);
    permission.updateRecord.add(n.nodeKey(), accessLevel);
    permission.deleteRecord.add(n.nodeKey(), accessLevel);
    permission.readRecord.add(n.nodeKey(), accessLevel);
  }

  const indexNodes = $(allNodes, [
    fp.filter(isIndex),
  ]);

  for (const n of indexNodes) {
    permission.readIndex.add(n.nodeKey(), accessLevel);
  }

  for (const a of fp.keys(app.actions)) {
    permission.executeAction.add(a, accessLevel);
  }

  $(permission, [
    fp.values,
    fp.filter(p => !p.isNode),
    fp.each(p => p.add(accessLevel)),
  ]);

  return accessLevel.permissions;
};

const setUserAccessLevels$1 = app => async (userName, accessLevels) => apiWrapper(
  app,
  events.authApi.setUserAccessLevels,
  permission.setUserAccessLevels.isAuthorized,
  { userName, accessLevels },
  _setUserAccessLevels, app, userName, accessLevels,
);

const _setUserAccessLevels = async (app, username, accessLevels) => {
  const lock = await getLock(app, USERS_LOCK_FILE, 1000, 1, 0);

  const actualAccessLevels = $(
    await app.datastore.loadJson(ACCESS_LEVELS_FILE),
    [
      l => l.levels,
      fp.map(l => l.name),
    ],
  );

  const missing = fp.difference(accessLevels)(actualAccessLevels);
  if (missing.length > 0) {
    throw new Error(`Invalid access levels supplied: ${fp.join(', ', missing)}`);
  }

  if (isNolock(lock)) { throw new Error('Could set user access levels cannot get lock'); }

  try {
    const users = await app.datastore.loadJson(USERS_LIST_FILE);
    const user = getUserByName(users, username);
    if (!user) { throw new NotFoundError(`Could not find user with ${username}`); }

    user.accessLevels = accessLevels;
    await app.datastore.updateJson(USERS_LIST_FILE, users);
  } finally {
    releaseLock(app, lock);
  }
};

const getAuthApi = app => ({
  authenticate: authenticate(app),
  authenticateTemporaryAccess: authenticateTemporaryAccess(app),
  createTemporaryAccess: createTemporaryAccess$1(app),
  createUser: createUser$1(app),
  loadAccessLevels: loadAccessLevels(app),
  enableUser: enableUser(app),
  disableUser: disableUser(app),
  getNewAccessLevel: getNewAccessLevel(),
  getNewUser: getNewUser(app),
  getNewUserAuth: getNewUserAuth(app),
  getUsers: getUsers(app),
  saveAccessLevels: saveAccessLevels(app),
  isAuthorized: isAuthorized(app),
  changeMyPassword: changeMyPassword(app),
  setPasswordFromTemporaryCode: setPasswordFromTemporaryCode(app),
  scorePassword,
  isValidPassword: isValidPassword(app),
  validateUser: validateUser(),
  validateAccessLevels: validateAccessLevels(app),
  generateFullPermissions: () => generateFullPermissions(app),
  setUserAccessLevels: setUserAccessLevels$1(app),
});

const executeAction$1 = app => (actionName, options) => {
  apiWrapperSync(
    app,
    events.actionsApi.execute,
    permission.executeAction.isAuthorized(actionName),
    { actionName, options },
    app.actions[actionName], options,
  );
};

const _executeAction = (behaviourSources, action, options) => behaviourSources[action.behaviourSource][action.behaviourName](options);

const getActionsApi = app => ({
  execute: executeAction$1(app),
});

const publish = handlers => async (eventName, context = {}) => {
  if (!fp.has(eventName)(handlers)) return;

  for (const handler of handlers[eventName]) {
    await handler(eventName, context);
  }
};

const subscribe = handlers => (eventName, handler) => {
  if (!fp.has(eventName)(handlers)) {
    handlers[eventName] = [];
  }
  handlers[eventName].push(handler);
};

const createEventAggregator = () => {
  const handlers = {};
  const eventAggregator = ({
    publish: publish(handlers),
    subscribe: subscribe(handlers),
  });
  return eventAggregator;
};

const createJson = originalCreateFile => async (key, obj, retries = 2, delay = 100) => await retry(originalCreateFile, retries, delay, key, JSON.stringify(obj));

const createNewFile = originalCreateFile => async (path, content, retries = 2, delay = 100) => await retry(originalCreateFile, retries, delay, path, content);

const loadJson = datastore => async (key, retries = 3, delay = 100) => {
  try {
    return await retry(JSON.parse, retries, delay, await datastore.loadFile(key));
  } catch (err) {
    const newErr = new NotFoundError(err.message);
    newErr.stack = err.stack;
    throw(newErr);
  }
};

const updateJson = datastore => async (key, obj, retries = 3, delay = 100) => {
  try {
    return await retry(datastore.updateFile, retries, delay, key, JSON.stringify(obj));
  } catch (err) {
    const newErr = new NotFoundError(err.message);
    newErr.stack = err.stack;
    throw(newErr);
  }
};

const setupDatastore = (datastore) => {
  const originalCreateFile = datastore.createFile;
  datastore.loadJson = loadJson(datastore);
  datastore.createJson = createJson(originalCreateFile);
  datastore.updateJson = updateJson(datastore);
  datastore.createFile = createNewFile(originalCreateFile);
  if (datastore.createEmptyDb) { delete datastore.createEmptyDb; }
  return datastore;
};

const compileCode = code => {
  let func;  
    
  try {
    func = compilerUtil.compileCode(code);
  } catch(e) {
    e.message = `Error compiling code : ${code} : ${e.message}`;
    throw e;
  }

  return func;
};

const compileExpression = code => {
  let func;  
      
  try {
    func = compilerUtil.compileExpression(code);
  } catch(e) {
    e.message = `Error compiling expression : ${code} : ${e.message}`;
    throw e;
  }
  
  return func;
};

const initialiseActions = (subscribe, behaviourSources, actions, triggers, apis) => {
  validateSources(behaviourSources, actions);
  subscribeTriggers(subscribe, behaviourSources, actions, triggers, apis);
  return createActionsCollection(behaviourSources, actions);
};

const createActionsCollection = (behaviourSources, actions) => $(actions, [
  fp.reduce((all, a) => {
    all[a.name] = opts => _executeAction(behaviourSources, a, opts);
    return all;
  }, {}),
]);

const subscribeTriggers = (subscribe, behaviourSources, actions, triggers, apis) => {
  const createOptions = (optionsCreator, eventContext) => {
    if (!optionsCreator) return {};
    const create = compileCode(optionsCreator);
    return create({ context: eventContext, apis });
  };

  const shouldRunTrigger = (trigger, eventContext) => {
    if (!trigger.condition) return true;
    const shouldRun = compileExpression(trigger.condition);
    return shouldRun({ context: eventContext });
  };

  for (let trig of triggers) {
    subscribe(trig.eventName, async (ev, ctx) => {
      if (shouldRunTrigger(trig, ctx)) {
        await _executeAction(
          behaviourSources,
          fp.find(a => a.name === trig.actionName)(actions),
          createOptions(trig.optionsCreator, ctx),
        );
      }
    });
  }
};

const validateSources = (behaviourSources, actions) => {
  const declaredSources = $(actions, [
    fp.uniqBy(a => a.behaviourSource),
    fp.map(a => a.behaviourSource),
  ]);

  const suppliedSources = fp.keys(behaviourSources);

  const missingSources = fp.difference(
    declaredSources, suppliedSources,
  );

  if (missingSources.length > 0) {
    throw new BadRequestError(`Declared behaviour sources are not supplied: ${fp.join(', ', missingSources)}`);
  }

  const missingBehaviours = $(actions, [
    fp.filter(a => !fp.isFunction(behaviourSources[a.behaviourSource][a.behaviourName])),
    fp.map(a => `Action: ${a.name} : ${a.behaviourSource}.${a.behaviourName}`),
  ]);

  if (missingBehaviours.length > 0) {
    throw new NotFoundError(`Missing behaviours: could not find behaviour functions: ${fp.join(', ', missingBehaviours)}`);
  }
};

const retrieve = async (app) => {
  const transactionFiles = await app.datastore.getFolderContents(
    TRANSACTIONS_FOLDER,
  );

  let transactions = [];

  if (fp.some(isBuildIndexFolder)(transactionFiles)) {
    const buildIndexFolder = fp.find(isBuildIndexFolder)(transactionFiles);

    transactions = await retrieveBuildIndexTransactions(
      app,
      joinKey(TRANSACTIONS_FOLDER, buildIndexFolder),
    );
  }

  if (transactions.length > 0) return transactions;

  return await retrieveStandardTransactions(
    app, transactionFiles,
  );
};

const retrieveBuildIndexTransactions = async (app, buildIndexFolder) => {
  const childFolders = await app.datastore.getFolderContents(buildIndexFolder);
  if (childFolders.length === 0) {
    // cleanup
    await app.datastore.deleteFolder(buildIndexFolder);
    return [];
  }

  const getTransactionFiles = async (childFolderIndex = 0) => {
    if (childFolderIndex >= childFolders.length) return [];

    const childFolderKey = joinKey(buildIndexFolder, childFolders[childFolderIndex]);
    const files = await app.datastore.getFolderContents(
      childFolderKey,
    );

    if (files.length === 0) {
      await app.datastore.deleteFolder(childFolderKey);
      return await getTransactionFiles(childFolderIndex + 1);
    }

    return { childFolderKey, files };
  };

  const transactionFiles = await getTransactionFiles();

  if (transactionFiles.files.length === 0) return [];

  const transactions = $(transactionFiles.files, [
    fp.map(parseTransactionId),
  ]);

  for (const t of transactions) {
    const transactionContent = await app.datastore.loadJson(
      joinKey(
        transactionFiles.childFolderKey,
        t.fullId,
      ),
    );
    t.record = await _load(app, transactionContent.recordKey);
  }

  transactions.indexNode = $(buildIndexFolder, [
    getLastPartInKey,
    nodeKeyHashFromBuildFolder,
    getNodeFromNodeKeyHash(app.hierarchy),
  ]);

  transactions.folderKey = transactionFiles.childFolderKey;

  return transactions;
};

const retrieveStandardTransactions = async (app, transactionFiles) => {
  const transactionIds = $(transactionFiles, [
    fp.filter(f => f !== LOCK_FILENAME
                    && !isBuildIndexFolder(f)),
    fp.map(parseTransactionId),
  ]);

  const transactionIdsByRecord = $(transactionIds, [
    fp.groupBy('recordId'),
  ]);

  const dedupedTransactions = [];

  const verify = async (t) => {
    if (t.verified === true) return t;

    const id = getTransactionId(
      t.recordId,
      t.transactionType,
      t.uniqueId,
    );

    const transaction = await app.datastore.loadJson(
      joinKey(TRANSACTIONS_FOLDER, id),
    );

    if (isDelete(t)) {
      t.record = transaction.record;
      t.verified = true;
      return t;
    }

    const rec = await _load(
      app,
      transaction.recordKey,
    );
    if (rec.transactionId === id) {
      t.record = rec;
      if (transaction.oldRecord) { t.oldRecord = transaction.oldRecord; }
      t.verified = true;
    } else {
      t.verified = false;
    }

    return t;
  };

  const pickOne = async (trans, forType) => {
    const transForType = fp.filter(forType)(trans);
    if (transForType.length === 1) {
      const t = await verify(transForType[0]);
      return (t.verified === true ? t : null);
    }
    for (let t of transForType) {
      t = await verify(t);
      if (t.verified === true) { return t; }
    }

    return null;
  };

  for (const recordId in transactionIdsByRecord) {
    const transIdsForRecord = transactionIdsByRecord[recordId];
    if (transIdsForRecord.length === 1) {
      const t = await verify(transIdsForRecord[0]);
      if (t.verified) { dedupedTransactions.push(t); }
      continue;
    }
    if (fp.some(isDelete)(transIdsForRecord)) {
      const t = await verify(fp.find(isDelete)(transIdsForRecord));
      if (t.verified) { dedupedTransactions.push(t); }
      continue;
    }
    if (fp.some(isUpdate)(transIdsForRecord)) {
      const upd = await pickOne(transIdsForRecord, isUpdate);
      if (isSomething(upd) && upd.verified) { dedupedTransactions.push(upd); }
      continue;
    }
    if (fp.some(isCreate)(transIdsForRecord)) {
      const cre = await pickOne(transIdsForRecord, isCreate);
      if (isSomething(cre)) { dedupedTransactions.push(cre); }
      continue;
    }
  }

  const duplicates = $(transactionIds, [
    fp.filter(t => none(ddt => ddt.uniqueId === t.uniqueId)(dedupedTransactions)),
  ]);


  const deletePromises = fp.map(t => app.datastore.deleteFile(
    joinKey(
      TRANSACTIONS_FOLDER,
      getTransactionId(
        t.recordId,
        t.transactionType,
        t.uniqueId,
      ),
    ),
  ))(duplicates);

  await Promise.all(deletePromises);

  return dedupedTransactions;
};

const parseTransactionId = (id) => {
  const splitId = fp.split(idSep)(id);
  return ({
    recordId: splitId[0],
    transactionType: splitId[1],
    uniqueId: splitId[2],
    fullId: id,
  });
};

const getRelevantAncestorIndexes = (hierarchy, record) => {
  const key = record.key;
  const keyParts = splitKey(key);
  const nodeId = getRecordNodeId(key);

  const flatHierarchy = _.orderBy(getFlattenedHierarchy(hierarchy),
    [node => node.pathRegx().length],
    ['desc']);

  const makeindexNodeAndDir_ForAncestorIndex = (indexNode, parentRecordDir) => makeIndexNodeAndDir(indexNode, joinKey(parentRecordDir, indexNode.name));

  const traverseAncestorIndexesInPath = () => fp.reduce((acc, part) => {
    const currentIndexKey = joinKey(acc.lastIndexKey, part);
    acc.lastIndexKey = currentIndexKey;
    const testPathRegx = p => new RegExp(`${p.pathRegx()}$`).test(currentIndexKey);
    const nodeMatch = fp.find(testPathRegx)(flatHierarchy);

    if (isNothing(nodeMatch)) { return acc; }

    if (!isRecord(nodeMatch)
                || nodeMatch.indexes.length === 0) { return acc; }

    const indexes = $(nodeMatch.indexes, [
      fp.filter(i => i.indexType === indexTypes.ancestor
                        && (i.allowedRecordNodeIds.length === 0
                         || fp.includes(nodeId)(i.allowedRecordNodeIds))),
    ]);

    const currentRecordDir = getRecordInfo(hierarchy, currentIndexKey).dir;

    fp.each(v => acc.nodesAndKeys.push(
      makeindexNodeAndDir_ForAncestorIndex(v, currentRecordDir),
    ))(indexes);

    return acc;
  }, { lastIndexKey: '', nodesAndKeys: [] })(keyParts).nodesAndKeys;

  const rootIndexes = $(flatHierarchy, [
    fp.filter(n => isGlobalIndex(n) && recordNodeIdIsAllowed(n)(nodeId)),
    fp.map(i => makeIndexNodeAndDir(
              i, 
              getIndexDir(hierarchy, i.nodeKey()))),
  ]);

  return fp.union(traverseAncestorIndexesInPath())(rootIndexes);
};

const getRelevantReverseReferenceIndexes = (hierarchy, record) => $(record.key, [
  getExactNodeForKey(hierarchy),
  n => n.fields,
  fp.filter(f => f.type === 'reference'
                    && isSomething(record[f.name])
                    && isNonEmptyString(record[f.name].key)),
  fp.map(f => $(f.typeOptions.reverseIndexNodeKeys, [
    fp.map(n => ({
      recordNode: getNode(hierarchy, n),
      field: f,
    })),
  ])),
  fp.flatten,
  fp.map(n => makeIndexNodeAndDir(
    n.recordNode,
    joinKey(
      getRecordInfo(hierarchy, record[n.field.name].key).dir, 
      n.recordNode.name),
  )),
]);

const makeIndexNodeAndDir = (indexNode, indexDir) => ({ indexNode, indexDir });

// adapted from https://github.com/dex4er/js-promise-writable
  // Thank you :) 
  const promiseWriteableStream = stream => {
  
    let _errored;
  
    const _errorHandler = err => {
        _errored = err;
    };

    stream.on("error", _errorHandler);    
  
    const write = chunk => {  
      let rejected = false;
  
      return new Promise((resolve, reject) => {
        if (_errored) {
          const err = _errored;
          _errored = undefined;
          return reject(err);
        }
  
        if (!stream.writable || stream.closed || stream.destroyed) {
          return reject(new Error("write after end"));
        }
  
        const writeErrorHandler = err => {
          _errored = undefined;
          rejected = true;
          reject(err);
        };
  
        stream.once("error", writeErrorHandler);
  
        const canWrite = stream.write(chunk);
  
        stream.removeListener("error", writeErrorHandler);
  
        if (canWrite) {
          if (!rejected) {
            resolve(chunk.length);
          }
        } else {
          const errorHandler = err => {
            _errored = undefined;
            removeListeners();
            reject(err);
          };
  
          const drainHandler = () => {
            removeListeners();
            resolve(chunk.length);
          };
  
          const closeHandler = () => {
            removeListeners();
            resolve(chunk.length);
          };
  
          const finishHandler = () => {
            removeListeners();
            resolve(chunk.length);
          };
  
          const removeListeners = () => {
            stream.removeListener("close", closeHandler);
            stream.removeListener("drain", drainHandler);
            stream.removeListener("error", errorHandler);
            stream.removeListener("finish", finishHandler);
          };
  
          stream.on("close", closeHandler);
          stream.on("drain", drainHandler);
          stream.on("error", errorHandler);
          stream.on("finish", finishHandler);
        }
      })
    };
  
    const end = () => {
  
      return new Promise((resolve, reject) => {
        if (_errored) {
          const err = _errored;
          _errored = undefined;
          return reject(err);
        }
  
        if (!stream.writable || stream.closed || stream.destroyed) {
          return resolve();
        }
  
        const finishHandler = () => {
          removeListeners();
          resolve();
        };
  
        const errorHandler = (err) => {
          _errored = undefined;
          removeListeners();
          reject(err);
        };
  
        const removeListeners = () => {
          stream.removeListener("error", errorHandler);
          stream.removeListener("finish", finishHandler);
        };
  
        stream.on("finish", finishHandler);
        stream.on("error", errorHandler);
  
        stream.end();
      })
    };

    return {write, end};
  };

const applyToShard = async (hierarchy, store, indexDir,
  indexNode, indexShardKey, recordsToWrite, keysToRemove) => {
  const createIfNotExists = recordsToWrite.length > 0;
  const writer = await getWriter(hierarchy, store, indexDir, indexShardKey, indexNode, createIfNotExists);
  if (writer === SHARD_DELETED) return;

  await writer.updateIndex(recordsToWrite, keysToRemove);
  await swapTempFileIn(store, indexShardKey);
};

const SHARD_DELETED = 'SHARD_DELETED';
const getWriter = async (hierarchy, store, indexDir, indexedDataKey, indexNode, createIfNotExists) => {
  let readableStream = null;

  if (isShardedIndex(indexNode)) {
    await ensureShardNameIsInShardMap(store, indexDir, indexedDataKey);
    if(!await store.exists(indexedDataKey)) {
      if (await store.exists(getParentKey(indexedDataKey))) {
        await store.createFile(indexedDataKey, "");
      } else {
        return SHARD_DELETED;
      }
    }
  }

  try {

    readableStream = promiseReadableStream(
        await store.readableFileStream(indexedDataKey)
    );

  } catch (e) {

    if (await store.exists(indexedDataKey)) {
      throw e;
    } else {
      if (createIfNotExists) { 
        if(await store.exists(getParentKey(indexedDataKey))) {
          await store.createFile(indexedDataKey, '');     
        } else {
          return SHARD_DELETED; 
        }
      } else { 
        return SHARD_DELETED; 
      }

      readableStream = promiseReadableStream(
          await store.readableFileStream(indexedDataKey)
      );

    }
  }

  const writableStream = promiseWriteableStream(
      await store.writableFileStream(indexedDataKey + ".temp")
  );

  return getIndexWriter(
    hierarchy, indexNode,
        readableStream, writableStream
  );
};

const swapTempFileIn = async (store, indexedDataKey, isRetry = false) => {
  const tempFile = `${indexedDataKey}.temp`;
  try {
    await store.deleteFile(indexedDataKey);
  } catch (e) {
    // ignore failure, incase it has not been created yet

    // if parent folder does not exist, assume that this index
    // should not be there
    if(!await store.exists(getParentKey(indexedDataKey))) {
      return;
    }
  }
  try {
    await store.renameFile(tempFile, indexedDataKey);
  } catch (e) {
    // retrying in case delete failure was for some other reason
    if (!isRetry) {
      await swapTempFileIn(store, indexedDataKey, true);
    } else {
      throw new Error("Failed to swap in index filed: " + e.message);
    }
  }
};

const executeTransactions = app => async (transactions) => {
  const recordsByShard = mappedRecordsByIndexShard(app.hierarchy, transactions);

  for (const shard of fp.keys(recordsByShard)) {
    await applyToShard(
      app.hierarchy, app.datastore,
      recordsByShard[shard].indexDir,
      recordsByShard[shard].indexNode,
      shard,
      recordsByShard[shard].writes,
      recordsByShard[shard].removes,
    );
  }
};

const mappedRecordsByIndexShard = (hierarchy, transactions) => {
  const updates = getUpdateTransactionsByShard(
    hierarchy, transactions,
  );

  const created = getCreateTransactionsByShard(
    hierarchy, transactions,
  );
  const deletes = getDeleteTransactionsByShard(
    hierarchy, transactions,
  );

  const indexBuild = getBuildIndexTransactionsByShard(
    hierarchy,
    transactions,
  );

  const toRemove = [
    ...deletes,
    ...updates.toRemove,
  ];

  const toWrite = [
    ...created,
    ...updates.toWrite,
    ...indexBuild,
  ];

  const transByShard = {};

  const initialiseShard = (t) => {
    if (fp.isUndefined(transByShard[t.indexShardKey])) {
      transByShard[t.indexShardKey] = {
        writes: [],
        removes: [],
        indexDir: t.indexDir,
        indexNodeKey: t.indexNode.nodeKey(),
        indexNode: t.indexNode,
      };
    }
  };

  for (const trans of toWrite) {
    initialiseShard(trans);
    transByShard[trans.indexShardKey].writes.push(
      trans.mappedRecord.result,
    );
  }

  for (const trans of toRemove) {
    initialiseShard(trans);
    transByShard[trans.indexShardKey].removes.push(
      trans.mappedRecord.result.key,
    );
  }

  return transByShard;
};

const getUpdateTransactionsByShard = (hierarchy, transactions) => {
  const updateTransactions = $(transactions, [fp.filter(isUpdate)]);

  const evaluateIndex = (record, indexNodeAndPath) => {
    const mappedRecord = evaluate(record)(indexNodeAndPath.indexNode);
    return ({
      mappedRecord,
      indexNode: indexNodeAndPath.indexNode,
      indexDir: indexNodeAndPath.indexDir,
      indexShardKey: getIndexedDataKey(
        indexNodeAndPath.indexNode,
        indexNodeAndPath.indexDir,
        mappedRecord.result,
      ),
    });
  };

  const getIndexNodesToApply = indexFilter => (t, indexes) => $(indexes, [
    fp.map(n => ({
      old: evaluateIndex(t.oldRecord, n),
      new: evaluateIndex(t.record, n),
    })),
    fp.filter(indexFilter),
  ]);

  const toRemoveFilter = (n, isUnreferenced) => n.old.mappedRecord.passedFilter === true
        && (n.new.mappedRecord.passedFilter === false
            || isUnreferenced);

  const toAddFilter = (n, isNewlyReferenced) => (n.old.mappedRecord.passedFilter === false
        || isNewlyReferenced)
        && n.new.mappedRecord.passedFilter === true;

  const toUpdateFilter = n => n.new.mappedRecord.passedFilter === true
        && n.old.mappedRecord.passedFilter === true
        && !fp.isEqual(n.old.mappedRecord.result,
          n.new.mappedRecord.result);

  const toRemove = [];
  const toWrite = [];

  for (const t of updateTransactions) {
    const ancestorIdxs = getRelevantAncestorIndexes(
      hierarchy, t.record,
    );

    const referenceChanges = diffReverseRefForUpdate(
      hierarchy, t.oldRecord, t.record,
    );

    // old records to remove (filtered out)
    const filteredOut_toRemove = _.union(
      getIndexNodesToApply(toRemoveFilter)(t, ancestorIdxs),
      // still referenced - check filter
      getIndexNodesToApply(toRemoveFilter)(t, referenceChanges.notChanged),
      // un referenced - remove if in there already
      getIndexNodesToApply(n => toRemoveFilter(n, true))(t, referenceChanges.unReferenced),
    );

    // new records to add (filtered in)
    const filteredIn_toAdd = _.union(
      getIndexNodesToApply(toAddFilter)(t, ancestorIdxs),
      // newly referenced - check filter
      getIndexNodesToApply(n => toAddFilter(n, true))(t, referenceChanges.newlyReferenced),
      // reference unchanged - rerun filter in case something else changed
      getIndexNodesToApply(toAddFilter)(t, referenceChanges.notChanged),
    );

    const changed = _.union(
      getIndexNodesToApply(toUpdateFilter)(t, ancestorIdxs),
      // still referenced - recheck filter
      getIndexNodesToApply(toUpdateFilter)(t, referenceChanges.notChanged),
    );

    const shardKeyChanged = $(changed, [
      fp.filter(c => c.old.indexShardKey !== c.new.indexShardKey),
    ]);

    const changedInSameShard = $(shardKeyChanged, [
      fp.difference(changed),
    ]);

    for (const res of shardKeyChanged) {
      fp.pull(res)(changed);
      filteredOut_toRemove.push(res);
      filteredIn_toAdd.push(res);
    }

    toRemove.push(
      $(filteredOut_toRemove, [
        fp.map(i => i.old),
      ]),
    );

    toWrite.push(
      $(filteredIn_toAdd, [
        fp.map(i => i.new),
      ]),
    );

    toWrite.push(
      $(changedInSameShard, [
        fp.map(i => i.new),
      ]),
    );
  }

  return ({
    toRemove: fp.flatten(toRemove),
    toWrite: fp.flatten(toWrite),
  });
};

const getBuildIndexTransactionsByShard = (hierarchy, transactions) => {
  const buildTransactions = $(transactions, [fp.filter(isBuildIndex)]);
  if (!isNonEmptyArray(buildTransactions)) return [];
  const indexNode = transactions.indexNode;

  const getIndexDirs = (t) => {
    if (isGlobalIndex(indexNode)) {
      return [indexNode.nodeKey()];
    }

    if (isReferenceIndex(indexNode)) {
      const recordNode = getExactNodeForKey(hierarchy)(t.record.key);
      const refFields = $(recordNode.fields, [
        fp.filter(fieldReversesReferenceToIndex(indexNode)),
      ]);
      const indexDirs = [];
      for (const refField of refFields) {
        const refValue = t.record[refField.name];
        if (isSomething(refValue)
                   && isNonEmptyString(refValue.key)) {
          const indexDir = joinKey(
            getRecordInfo(hierarchy, refValue.key).dir,
            indexNode.name,
          );

          if (!fp.includes(indexDir)(indexDirs)) { indexDirs.push(indexDir); }
        }
      }
      return indexDirs;
    }

    const indexKey = joinKey(
      getActualKeyOfParent(
        indexNode.parent().nodeKey(),
        t.record.key,
      ),
      indexNode.name,
    );

    return [getIndexDir(hierarchy, indexKey)];
  };

  return $(buildTransactions, [
    fp.map((t) => {
      const mappedRecord = evaluate(t.record)(indexNode);
      if (!mappedRecord.passedFilter) return null;
      const indexDirs = getIndexDirs(t);
      return $(indexDirs, [
        fp.map(indexDir => ({
          mappedRecord,
          indexNode,
          indexDir,
          indexShardKey: getIndexedDataKey(
            indexNode,
            indexDir,
            mappedRecord.result,
          ),
        })),
      ]);
    }),
    fp.flatten,
    fp.filter(isSomething),
  ]);
};

const get_Create_Delete_TransactionsByShard = pred => (hierarchy, transactions) => {
  const createTransactions = $(transactions, [fp.filter(pred)]);

  const getIndexNodesToApply = (t, indexes) => $(indexes, [
    fp.map((n) => {
      const mappedRecord = evaluate(t.record)(n.indexNode);
      return ({
        mappedRecord,
        indexNode: n.indexNode,
        indexDir: n.indexDir,
        indexShardKey: getIndexedDataKey(
          n.indexNode,
          n.indexDir,
          mappedRecord.result,
        ),
      });
    }),
    fp.filter(n => n.mappedRecord.passedFilter),
  ]);

  const allToApply = [];

  for (const t of createTransactions) {
    const ancestorIdxs = getRelevantAncestorIndexes(hierarchy, t.record);
    const reverseRef = getRelevantReverseReferenceIndexes(hierarchy, t.record);

    allToApply.push(
      getIndexNodesToApply(t, ancestorIdxs),
    );
    allToApply.push(
      getIndexNodesToApply(t, reverseRef),
    );
  }

  return fp.flatten(allToApply);
};

const getDeleteTransactionsByShard = get_Create_Delete_TransactionsByShard(isDelete);

const getCreateTransactionsByShard = get_Create_Delete_TransactionsByShard(isCreate);

const diffReverseRefForUpdate = (appHierarchy, oldRecord, newRecord) => {
  const oldIndexes = getRelevantReverseReferenceIndexes(
    appHierarchy, oldRecord,
  );
  const newIndexes = getRelevantReverseReferenceIndexes(
    appHierarchy, newRecord,
  );

  const unReferenced = fp.differenceBy(
    i => i.indexDir,
    oldIndexes, newIndexes,
  );

  const newlyReferenced = fp.differenceBy(
    i => i.indexDir,
    newIndexes, oldIndexes,
  );

  const notChanged = fp.intersectionBy(
    i => i.indexDir,
    newIndexes, oldIndexes,
  );

  return {
    unReferenced,
    newlyReferenced,
    notChanged,
  };
};

const cleanup = async (app) => {
  const lock = await getTransactionLock(app);
  if (isNolock(lock)) return;

  try {
    const transactions = await retrieve(app);
    if (transactions.length > 0) {
      await executeTransactions(app)(transactions);

      const folder = transactions.folderKey
        ? transactions.folderKey
        : TRANSACTIONS_FOLDER;

      const deleteFiles = $(transactions, [
        fp.map(t => joinKey(
          folder,
          getTransactionId(
            t.recordId, t.transactionType,
            t.uniqueId,
          ),
        )),
        fp.map(app.datastore.deleteFile),
      ]);

      await Promise.all(deleteFiles);
    }
  } finally {
    await releaseLock(app, lock);
  }
};

const getTransactionLock = async app => await getLock(
  app, LOCK_FILE_KEY,
  timeoutMilliseconds, maxLockRetries,
);

const initialiseData = async (datastore, applicationDefinition, accessLevels) => {
  await datastore.createFolder(configFolder);
  await datastore.createJson(appDefinitionFile, applicationDefinition);

  await initialiseRootCollections(datastore, applicationDefinition.hierarchy);
  await initialiseRootIndexes(datastore, applicationDefinition.hierarchy);

  await datastore.createFolder(TRANSACTIONS_FOLDER);

  await datastore.createFolder(AUTH_FOLDER);

  await datastore.createJson(USERS_LIST_FILE, []);

  await datastore.createJson(
    ACCESS_LEVELS_FILE, 
    accessLevels ? accessLevels : { version: 0, levels: [] });

  await initialiseRootSingleRecords(datastore, applicationDefinition.hierarchy);
};

const initialiseRootIndexes = async (datastore, hierarchy) => {
  const flathierarchy = getFlattenedHierarchy(hierarchy);
  const globalIndexes = $(flathierarchy, [
    fp.filter(isGlobalIndex),
  ]);

  for (const index of globalIndexes) {
    if (!await datastore.exists(index.nodeKey())) { 
      await initialiseIndex(datastore, '', index); 
    }
  }
};

const initialiseRootSingleRecords = async (datastore, hierarchy) => {
  const app = { 
    publish:()=>{},
    cleanupTransactions: () => {},
    datastore, hierarchy 
  };

  const flathierarchy = getFlattenedHierarchy(hierarchy);
  const singleRecords = $(flathierarchy, [
    fp.filter(isSingleRecord),
  ]);

  for (let record of singleRecords) {
    await datastore.createFolder(record.nodeKey());
    const result = _getNew(record, "");
    await _save(app,result);
  }
};

const getDatabaseManager = databaseManager => ({
  createEmptyMasterDb: createEmptyMasterDb(databaseManager),
  createEmptyInstanceDb: createEmptyInstanceDb(databaseManager),
  getInstanceDbRootConfig: databaseManager.getInstanceDbRootConfig,
  masterDatastoreConfig: getMasterDatastoreConfig(databaseManager),
  getInstanceDatastoreConfig: getInstanceDatastoreConfig(databaseManager),
});

const getMasterDatastoreConfig = databaseManager => databaseManager.getDatastoreConfig('master');

const getInstanceDatastoreConfig = databaseManager => (applicationId, instanceId) => databaseManager.getDatastoreConfig(
  applicationId, instanceId,
);

const createEmptyMasterDb = databaseManager => async () => await databaseManager.createEmptyDb('master');

const createEmptyInstanceDb = databaseManager => async (applicationId, instanceId) => {
  if (isNothing(applicationId)) { throw new Error('CreateDb: application id not supplied'); }
  if (isNothing(instanceId)) { throw new Error('CreateDb: instance id not supplied'); }

  return await databaseManager.createEmptyDb(
    applicationId,
    instanceId,
  );
};

const getAppApis = async (store, behaviourSources = null, 
                                cleanupTransactions = null, 
                                getEpochTime = null,
                                crypto = null,
                                appDefinition = null) => {

    store = setupDatastore(store);

    if(!appDefinition)
        appDefinition = await getApplicationDefinition(store)();

    if(!behaviourSources)
        behaviourSources = await getBehaviourSources(store);

    const eventAggregator = createEventAggregator();

    const app = {
        datastore:store,
        crypto,
        publish:eventAggregator.publish,
        hierarchy:appDefinition.hierarchy,
        actions:appDefinition.actions
    };

    const templateApi = getTemplateApi(app);    

    app.cleanupTransactions = isSomething(cleanupTransactions) 
                              ? cleanupTransactions
                              : async () => await cleanup(app);

    app.getEpochTime = isSomething(getEpochTime)
                       ? getEpochTime
                       : async () => (new Date()).getTime();

    const recordApi = getRecordApi(app);
    const collectionApi = getCollectionApi(app);
    const indexApi = getIndexApi(app);
    const authApi = getAuthApi(app);
    const actionsApi = getActionsApi(app);

    const authenticateAs = async (username, password) => {
        app.user = await authApi.authenticate(username, password);
    };

    const withFullAccess = () => 
        userWithFullAccess(app);    

    const asUser = (user) => {
        app.user = user;
    };    

    let apis = {
        recordApi, 
        templateApi,
        collectionApi,
        indexApi,
        authApi,
        actionsApi,
        subscribe: eventAggregator.subscribe,
        authenticateAs,
        withFullAccess,
        asUser
    };

    apis.actions = initialiseActions(
        eventAggregator.subscribe,
        behaviourSources,
        appDefinition.actions,
        appDefinition.triggers,
        apis);


    return apis;
};

const userWithFullAccess = (app) => {
    app.user = {
        name: "app",
        permissions : generateFullPermissions(app),
        isUser:false,
        temp:false
    };
    return app.user;
};

exports.common = index;
exports.default = getAppApis;
exports.events = events;
exports.eventsList = eventsList;
exports.getActionsApi = getActionsApi;
exports.getAppApis = getAppApis;
exports.getAuthApi = getAuthApi;
exports.getCollectionApi = getCollectionApi;
exports.getDatabaseManager = getDatabaseManager;
exports.getIndexApi = getIndexApi;
exports.getRecordApi = getRecordApi;
exports.getTemplateApi = getTemplateApi;
exports.hierarchy = hierarchy;
exports.initialiseData = initialiseData;
exports.setupDatastore = setupDatastore;
exports.userWithFullAccess = userWithFullAccess;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVkaWJhc2UtY29yZS5janMuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21tb24vZXZlbnRzLmpzIiwiLi4vc3JjL2NvbW1vbi9lcnJvcnMuanMiLCIuLi9zcmMvY29tbW9uL2FwaVdyYXBwZXIuanMiLCIuLi9zcmMvY29tbW9uL2xvY2suanMiLCIuLi9zcmMvY29tbW9uL2luZGV4LmpzIiwiLi4vc3JjL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uLmpzIiwiLi4vc3JjL2luZGV4aW5nL2V2YWx1YXRlLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2luZGV4ZXMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvaGllcmFyY2h5LmpzIiwiLi4vc3JjL3R5cGVzL3R5cGVIZWxwZXJzLmpzIiwiLi4vc3JjL3R5cGVzL3N0cmluZy5qcyIsIi4uL3NyYy90eXBlcy9ib29sLmpzIiwiLi4vc3JjL3R5cGVzL251bWJlci5qcyIsIi4uL3NyYy90eXBlcy9kYXRldGltZS5qcyIsIi4uL3NyYy90eXBlcy9hcnJheS5qcyIsIi4uL3NyYy90eXBlcy9yZWZlcmVuY2UuanMiLCIuLi9zcmMvdHlwZXMvZmlsZS5qcyIsIi4uL3NyYy90eXBlcy9pbmRleC5qcyIsIi4uL3NyYy9hdXRoQXBpL2F1dGhDb21tb24uanMiLCIuLi9zcmMvYXV0aEFwaS9pc0F1dGhvcml6ZWQuanMiLCIuLi9zcmMvYXV0aEFwaS9wZXJtaXNzaW9ucy5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZ2V0TmV3LmpzIiwiLi4vc3JjL2luZGV4aW5nL2FsbElkcy5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvcmVjb3JkSW5mby5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvbG9hZC5qcyIsIi4uL3NyYy9pbmRleGluZy9wcm9taXNlUmVhZGFibGVTdHJlYW0uanMiLCIuLi9zcmMvaW5kZXhpbmcvc2hhcmRpbmcuanMiLCIuLi9zcmMvaW5kZXhpbmcvaW5kZXhTY2hlbWFDcmVhdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JvbGx1cC1wbHVnaW4tbm9kZS1nbG9iYWxzL3NyYy9nbG9iYWwuanMiLCIuLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVzNi9iYXNlNjQuanMiLCIuLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVzNi9pZWVlNzU0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2J1ZmZlci1lczYvaXNBcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9idWZmZXItZXM2L2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JvbGx1cC1wbHVnaW4tbm9kZS1idWlsdGlucy9zcmMvZXM2L3N0cmluZy1kZWNvZGVyLmpzIiwiLi4vc3JjL2luZGV4aW5nL3NlcmlhbGl6ZXIuanMiLCIuLi9zcmMvaW5kZXhpbmcvcmVhZC5qcyIsIi4uL3NyYy9pbmRleEFwaS9nZXRJbmRleERpci5qcyIsIi4uL3NyYy9pbmRleEFwaS9saXN0SXRlbXMuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2dldENvbnRleHQuanMiLCIuLi9zcmMvcmVjb3JkQXBpL3ZhbGlkYXRlLmpzIiwiLi4vc3JjL2NvbGxlY3Rpb25BcGkvaW5pdGlhbGlzZS5qcyIsIi4uL3NyYy90cmFuc2FjdGlvbnMvdHJhbnNhY3Rpb25zQ29tbW9uLmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9jcmVhdGUuanMiLCIuLi9zcmMvaW5kZXhpbmcvaW5pdGlhbGlzZUluZGV4LmpzIiwiLi4vc3JjL3JlY29yZEFwaS9zYXZlLmpzIiwiLi4vc3JjL2NvbGxlY3Rpb25BcGkvZGVsZXRlLmpzIiwiLi4vc3JjL3JlY29yZEFwaS9kZWxldGUuanMiLCIuLi9zcmMvcmVjb3JkQXBpL3VwbG9hZEZpbGUuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2Rvd25sb2FkRmlsZS5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvY3VzdG9tSWQuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2luZGV4LmpzIiwiLi4vc3JjL2NvbGxlY3Rpb25BcGkvZ2V0QWxsb3dlZFJlY29yZFR5cGVzLmpzIiwiLi4vc3JjL2NvbGxlY3Rpb25BcGkvaW5kZXguanMiLCIuLi9zcmMvaW5kZXhBcGkvYnVpbGRJbmRleC5qcyIsIi4uL3NyYy9pbmRleEFwaS9hZ2dyZWdhdGVzLmpzIiwiLi4vc3JjL2luZGV4QXBpL2luZGV4LmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2NyZWF0ZU5vZGVzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2ZpZWxkcy5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9yZWNvcmRWYWxpZGF0aW9uUnVsZXMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvY3JlYXRlQWN0aW9ucy5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS92YWxpZGF0ZUFnZ3JlZ2F0ZS5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS92YWxpZGF0ZS5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9nZXRBcHBsaWNhdGlvbkRlZmluaXRpb24uanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5LmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL3NhdmVBY3Rpb25zQW5kVHJpZ2dlcnMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvZ2V0QmVoYXZpb3VyU291cmNlcy5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9pbmRleC5qcyIsIi4uL3NyYy9hdXRoQXBpL2dldFVzZXJzLmpzIiwiLi4vc3JjL2F1dGhBcGkvbG9hZEFjY2Vzc0xldmVscy5qcyIsIi4uL3NyYy9hdXRoQXBpL2F1dGhlbnRpY2F0ZS5qcyIsIi4uL3NyYy9hdXRoQXBpL2NyZWF0ZVRlbXBvcmFyeUFjY2Vzcy5qcyIsIi4uL3NyYy9hdXRoQXBpL3ZhbGlkYXRlVXNlci5qcyIsIi4uL3NyYy9hdXRoQXBpL2dldE5ld1VzZXIuanMiLCIuLi9zcmMvYXV0aEFwaS9zZXRQYXNzd29yZC5qcyIsIi4uL3NyYy9hdXRoQXBpL2NyZWF0ZVVzZXIuanMiLCIuLi9zcmMvYXV0aEFwaS9lbmFibGVVc2VyLmpzIiwiLi4vc3JjL2F1dGhBcGkvZ2V0TmV3QWNjZXNzTGV2ZWwuanMiLCIuLi9zcmMvYXV0aEFwaS92YWxpZGF0ZUFjY2Vzc0xldmVscy5qcyIsIi4uL3NyYy9hdXRoQXBpL3NhdmVBY2Nlc3NMZXZlbHMuanMiLCIuLi9zcmMvYXV0aEFwaS9nZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucy5qcyIsIi4uL3NyYy9hdXRoQXBpL3NldFVzZXJBY2Nlc3NMZXZlbHMuanMiLCIuLi9zcmMvYXV0aEFwaS9pbmRleC5qcyIsIi4uL3NyYy9hY3Rpb25zQXBpL2V4ZWN1dGUuanMiLCIuLi9zcmMvYWN0aW9uc0FwaS9pbmRleC5qcyIsIi4uL3NyYy9hcHBJbml0aWFsaXNlL2V2ZW50QWdncmVnYXRvci5qcyIsIi4uL3NyYy9hcHBJbml0aWFsaXNlL2luZGV4LmpzIiwiLi4vc3JjL2NvbW1vbi9jb21waWxlQ29kZS5qcyIsIi4uL3NyYy9hY3Rpb25zQXBpL2luaXRpYWxpc2UuanMiLCIuLi9zcmMvdHJhbnNhY3Rpb25zL3JldHJpZXZlLmpzIiwiLi4vc3JjL2luZGV4aW5nL3JlbGV2YW50LmpzIiwiLi4vc3JjL2luZGV4aW5nL3Byb21pc2VXcml0YWJsZVN0cmVhbS5qcyIsIi4uL3NyYy9pbmRleGluZy9hcHBseS5qcyIsIi4uL3NyYy90cmFuc2FjdGlvbnMvZXhlY3V0ZS5qcyIsIi4uL3NyYy90cmFuc2FjdGlvbnMvY2xlYW51cC5qcyIsIi4uL3NyYy9hcHBJbml0aWFsaXNlL2luaXRpYWxpc2VEYXRhLmpzIiwiLi4vc3JjL2FwcEluaXRpYWxpc2UvZGF0YWJhc2VNYW5hZ2VyLmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVuaW9uLCByZWR1Y2UgfSBmcm9tICdsb2Rhc2gvZnAnO1xuXG5jb25zdCBjb21tb25QbHVzID0gZXh0cmEgPT4gdW5pb24oWydvbkJlZ2luJywgJ29uQ29tcGxldGUnLCAnb25FcnJvciddKShleHRyYSk7XG5cbmNvbnN0IGNvbW1vbiA9ICgpID0+IGNvbW1vblBsdXMoW10pO1xuXG5jb25zdCBfZXZlbnRzID0ge1xuICByZWNvcmRBcGk6IHtcbiAgICBzYXZlOiBjb21tb25QbHVzKFtcbiAgICAgICdvbkludmFsaWQnLFxuICAgICAgJ29uUmVjb3JkVXBkYXRlZCcsXG4gICAgICAnb25SZWNvcmRDcmVhdGVkJ10pLFxuICAgIGRlbGV0ZTogY29tbW9uKCksXG4gICAgZ2V0Q29udGV4dDogY29tbW9uKCksXG4gICAgZ2V0TmV3OiBjb21tb24oKSxcbiAgICBsb2FkOiBjb21tb24oKSxcbiAgICB2YWxpZGF0ZTogY29tbW9uKCksXG4gICAgdXBsb2FkRmlsZTogY29tbW9uKCksXG4gICAgZG93bmxvYWRGaWxlOiBjb21tb24oKSxcbiAgfSxcbiAgaW5kZXhBcGk6IHtcbiAgICBidWlsZEluZGV4OiBjb21tb24oKSxcbiAgICBsaXN0SXRlbXM6IGNvbW1vbigpLFxuICAgIGRlbGV0ZTogY29tbW9uKCksXG4gICAgYWdncmVnYXRlczogY29tbW9uKCksXG4gIH0sXG4gIGNvbGxlY3Rpb25BcGk6IHtcbiAgICBnZXRBbGxvd2VkUmVjb3JkVHlwZXM6IGNvbW1vbigpLFxuICAgIGluaXRpYWxpc2U6IGNvbW1vbigpLFxuICAgIGRlbGV0ZTogY29tbW9uKCksXG4gIH0sXG4gIGF1dGhBcGk6IHtcbiAgICBhdXRoZW50aWNhdGU6IGNvbW1vbigpLFxuICAgIGF1dGhlbnRpY2F0ZVRlbXBvcmFyeUFjY2VzczogY29tbW9uKCksXG4gICAgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzOiBjb21tb24oKSxcbiAgICBjcmVhdGVVc2VyOiBjb21tb24oKSxcbiAgICBlbmFibGVVc2VyOiBjb21tb24oKSxcbiAgICBkaXNhYmxlVXNlcjogY29tbW9uKCksXG4gICAgbG9hZEFjY2Vzc0xldmVsczogY29tbW9uKCksXG4gICAgZ2V0TmV3QWNjZXNzTGV2ZWw6IGNvbW1vbigpLFxuICAgIGdldE5ld1VzZXI6IGNvbW1vbigpLFxuICAgIGdldE5ld1VzZXJBdXRoOiBjb21tb24oKSxcbiAgICBnZXRVc2VyczogY29tbW9uKCksXG4gICAgc2F2ZUFjY2Vzc0xldmVsczogY29tbW9uKCksXG4gICAgaXNBdXRob3JpemVkOiBjb21tb24oKSxcbiAgICBjaGFuZ2VNeVBhc3N3b3JkOiBjb21tb24oKSxcbiAgICBzZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlOiBjb21tb24oKSxcbiAgICBzY29yZVBhc3N3b3JkOiBjb21tb24oKSxcbiAgICBpc1ZhbGlkUGFzc3dvcmQ6IGNvbW1vbigpLFxuICAgIHZhbGlkYXRlVXNlcjogY29tbW9uKCksXG4gICAgdmFsaWRhdGVBY2Nlc3NMZXZlbHM6IGNvbW1vbigpLFxuICAgIHNldFVzZXJBY2Nlc3NMZXZlbHM6IGNvbW1vbigpLFxuICB9LFxuICB0ZW1wbGF0ZUFwaToge1xuICAgIHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeTogY29tbW9uKCksXG4gICAgc2F2ZUFjdGlvbnNBbmRUcmlnZ2VyczogY29tbW9uKCksXG4gIH0sXG4gIGFjdGlvbnNBcGk6IHtcbiAgICBleGVjdXRlOiBjb21tb24oKSxcbiAgfSxcbn07XG5cbmNvbnN0IF9ldmVudHNMaXN0ID0gW107XG5cbmNvbnN0IG1ha2VFdmVudCA9IChhcmVhLCBtZXRob2QsIG5hbWUpID0+IGAke2FyZWF9OiR7bWV0aG9kfToke25hbWV9YDtcblxuZm9yIChjb25zdCBhcmVhS2V5IGluIF9ldmVudHMpIHtcbiAgZm9yIChjb25zdCBtZXRob2RLZXkgaW4gX2V2ZW50c1thcmVhS2V5XSkge1xuICAgIF9ldmVudHNbYXJlYUtleV1bbWV0aG9kS2V5XSA9IHJlZHVjZSgob2JqLCBzKSA9PiB7XG4gICAgICBvYmpbc10gPSBtYWtlRXZlbnQoYXJlYUtleSwgbWV0aG9kS2V5LCBzKTtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSxcbiAgICB7fSkoX2V2ZW50c1thcmVhS2V5XVttZXRob2RLZXldKTtcbiAgfVxufVxuXG5cbmZvciAoY29uc3QgYXJlYUtleSBpbiBfZXZlbnRzKSB7XG4gIGZvciAoY29uc3QgbWV0aG9kS2V5IGluIF9ldmVudHNbYXJlYUtleV0pIHtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gX2V2ZW50c1thcmVhS2V5XVttZXRob2RLZXldKSB7XG4gICAgICBfZXZlbnRzTGlzdC5wdXNoKFxuICAgICAgICBfZXZlbnRzW2FyZWFLZXldW21ldGhvZEtleV1bbmFtZV0sXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG5cbmV4cG9ydCBjb25zdCBldmVudHMgPSBfZXZlbnRzO1xuXG5leHBvcnQgY29uc3QgZXZlbnRzTGlzdCA9IF9ldmVudHNMaXN0O1xuXG5leHBvcnQgZGVmYXVsdCB7IGV2ZW50czogX2V2ZW50cywgZXZlbnRzTGlzdDogX2V2ZW50c0xpc3QgfTtcbiIsImV4cG9ydCBjbGFzcyBCYWRSZXF1ZXN0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDQwMDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBVbmF1dGhvcmlzZWRFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmh0dHBTdGF0dXNDb2RlID0gNDAxO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEZvcmJpZGRlbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDM7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTm90Rm91bmRFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmh0dHBTdGF0dXNDb2RlID0gNDA0O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbmZsaWN0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDQwOTtcbiAgICB9XG59IiwiaW1wb3J0IHsgY2xvbmVEZWVwLCBpc1VuZGVmaW5lZCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHsgVW5hdXRob3Jpc2VkRXJyb3IgfSBmcm9tICcuL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBhcGlXcmFwcGVyID0gYXN5bmMgKGFwcCwgZXZlbnROYW1lc3BhY2UsIGlzQXV0aG9yaXplZCwgZXZlbnRDb250ZXh0LCBmdW5jLCAuLi5wYXJhbXMpID0+IHtcbiAgcHVzaENhbGxTdGFjayhhcHAsIGV2ZW50TmFtZXNwYWNlKTtcblxuICBpZiAoIWlzQXV0aG9yaXplZChhcHApKSB7XG4gICAgaGFuZGxlTm90QXV0aG9yaXplZChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHN0YXJ0RGF0ZSA9IERhdGUubm93KCk7XG4gIGNvbnN0IGVsYXBzZWQgPSAoKSA9PiAoRGF0ZS5ub3coKSAtIHN0YXJ0RGF0ZSk7XG5cbiAgdHJ5IHtcbiAgICBhd2FpdCBhcHAucHVibGlzaChcbiAgICAgIGV2ZW50TmFtZXNwYWNlLm9uQmVnaW4sXG4gICAgICBldmVudENvbnRleHQsXG4gICAgKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGZ1bmMoLi4ucGFyYW1zKTtcblxuICAgIGF3YWl0IHB1Ymxpc2hDb21wbGV0ZShhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBhd2FpdCBwdWJsaXNoRXJyb3IoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCBlcnJvcik7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBhcGlXcmFwcGVyU3luYyA9IChhcHAsIGV2ZW50TmFtZXNwYWNlLCBpc0F1dGhvcml6ZWQsIGV2ZW50Q29udGV4dCwgZnVuYywgLi4ucGFyYW1zKSA9PiB7XG4gIHB1c2hDYWxsU3RhY2soYXBwLCBldmVudE5hbWVzcGFjZSk7XG5cbiAgaWYgKCFpc0F1dGhvcml6ZWQoYXBwKSkge1xuICAgIGhhbmRsZU5vdEF1dGhvcml6ZWQoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzdGFydERhdGUgPSBEYXRlLm5vdygpO1xuICBjb25zdCBlbGFwc2VkID0gKCkgPT4gKERhdGUubm93KCkgLSBzdGFydERhdGUpO1xuXG4gIHRyeSB7XG4gICAgYXBwLnB1Ymxpc2goXG4gICAgICBldmVudE5hbWVzcGFjZS5vbkJlZ2luLFxuICAgICAgZXZlbnRDb250ZXh0LFxuICAgICk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBmdW5jKC4uLnBhcmFtcyk7XG5cbiAgICBwdWJsaXNoQ29tcGxldGUoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcHVibGlzaEVycm9yKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5jb25zdCBoYW5kbGVOb3RBdXRob3JpemVkID0gKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSkgPT4ge1xuICBjb25zdCBlcnIgPSBuZXcgVW5hdXRob3Jpc2VkRXJyb3IoYFVuYXV0aG9yaXplZDogJHtldmVudE5hbWVzcGFjZX1gKTtcbiAgcHVibGlzaEVycm9yKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgKCkgPT4gMCwgZXJyKTtcbiAgdGhyb3cgZXJyO1xufTtcblxuY29uc3QgcHVzaENhbGxTdGFjayA9IChhcHAsIGV2ZW50TmFtZXNwYWNlLCBzZWVkQ2FsbElkKSA9PiB7XG4gIGNvbnN0IGNhbGxJZCA9IGdlbmVyYXRlKCk7XG5cbiAgY29uc3QgY3JlYXRlQ2FsbFN0YWNrID0gKCkgPT4gKHtcbiAgICBzZWVkQ2FsbElkOiAhaXNVbmRlZmluZWQoc2VlZENhbGxJZClcbiAgICAgID8gc2VlZENhbGxJZFxuICAgICAgOiBjYWxsSWQsXG4gICAgdGhyZWFkQ2FsbElkOiBjYWxsSWQsXG4gICAgc3RhY2s6IFtdLFxuICB9KTtcblxuICBpZiAoaXNVbmRlZmluZWQoYXBwLmNhbGxzKSkge1xuICAgIGFwcC5jYWxscyA9IGNyZWF0ZUNhbGxTdGFjaygpO1xuICB9XG5cbiAgYXBwLmNhbGxzLnN0YWNrLnB1c2goe1xuICAgIG5hbWVzcGFjZTogZXZlbnROYW1lc3BhY2UsXG4gICAgY2FsbElkLFxuICB9KTtcbn07XG5cbmNvbnN0IHBvcENhbGxTdGFjayA9IChhcHApID0+IHtcbiAgYXBwLmNhbGxzLnN0YWNrLnBvcCgpO1xuICBpZiAoYXBwLmNhbGxzLnN0YWNrLmxlbmd0aCA9PT0gMCkge1xuICAgIGRlbGV0ZSBhcHAuY2FsbHM7XG4gIH1cbn07XG5cbmNvbnN0IHB1Ymxpc2hFcnJvciA9IGFzeW5jIChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIGVycikgPT4ge1xuICBjb25zdCBjdHggPSBjbG9uZURlZXAoZXZlbnRDb250ZXh0KTtcbiAgY3R4LmVycm9yID0gZXJyO1xuICBjdHguZWxhcHNlZCA9IGVsYXBzZWQoKTtcbiAgYXdhaXQgYXBwLnB1Ymxpc2goXG4gICAgZXZlbnROYW1lc3BhY2Uub25FcnJvcixcbiAgICBjdHgsXG4gICk7XG4gIHBvcENhbGxTdGFjayhhcHApO1xufTtcblxuY29uc3QgcHVibGlzaENvbXBsZXRlID0gYXN5bmMgKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgcmVzdWx0KSA9PiB7XG4gIGNvbnN0IGVuZGNvbnRleHQgPSBjbG9uZURlZXAoZXZlbnRDb250ZXh0KTtcbiAgZW5kY29udGV4dC5yZXN1bHQgPSByZXN1bHQ7XG4gIGVuZGNvbnRleHQuZWxhcHNlZCA9IGVsYXBzZWQoKTtcbiAgYXdhaXQgYXBwLnB1Ymxpc2goXG4gICAgZXZlbnROYW1lc3BhY2Uub25Db21wbGV0ZSxcbiAgICBlbmRjb250ZXh0LFxuICApO1xuICBwb3BDYWxsU3RhY2soYXBwKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFwaVdyYXBwZXI7XG4iLCJpbXBvcnQgeyBzcGxpdCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnLi9pbmRleCc7XG5cbmNvbnN0IGxvY2tPdmVybGFwTWlsbGlzZWNvbmRzID0gMTA7XG5cbmV4cG9ydCBjb25zdCBnZXRMb2NrID0gYXN5bmMgKGFwcCwgbG9ja0ZpbGUsIHRpbWVvdXRNaWxsaXNlY29uZHMsIG1heExvY2tSZXRyaWVzLCByZXRyeUNvdW50ID0gMCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHRpbWVvdXQgPSAoYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpKVxuICAgICAgICAgICAgKyB0aW1lb3V0TWlsbGlzZWNvbmRzO1xuXG4gICAgY29uc3QgbG9jayA9IHtcbiAgICAgIHRpbWVvdXQsXG4gICAgICBrZXk6IGxvY2tGaWxlLFxuICAgICAgdG90YWxUaW1lb3V0OiB0aW1lb3V0TWlsbGlzZWNvbmRzLFxuICAgIH07XG5cbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmNyZWF0ZUZpbGUoXG4gICAgICBsb2NrRmlsZSxcbiAgICAgIGdldExvY2tGaWxlQ29udGVudChcbiAgICAgICAgbG9jay50b3RhbFRpbWVvdXQsXG4gICAgICAgIGxvY2sudGltZW91dCxcbiAgICAgICksXG4gICAgKTtcblxuICAgIHJldHVybiBsb2NrO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKHJldHJ5Q291bnQgPT0gbWF4TG9ja1JldHJpZXMpIHsgcmV0dXJuIE5PX0xPQ0s7IH1cblxuICAgIGNvbnN0IGxvY2sgPSBwYXJzZUxvY2tGaWxlQ29udGVudChcbiAgICAgIGxvY2tGaWxlLFxuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkRmlsZShsb2NrRmlsZSksXG4gICAgKTtcblxuICAgIGNvbnN0IGN1cnJlbnRFcG9jaFRpbWUgPSBhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCk7XG5cbiAgICBpZiAoY3VycmVudEVwb2NoVGltZSA8IGxvY2sudGltZW91dCkge1xuICAgICAgcmV0dXJuIE5PX0xPQ0s7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShsb2NrRmlsZSk7XG4gICAgfSBjYXRjaCAoXykge1xuICAgICAgLy9lbXB0eVxuICAgIH1cblxuICAgIGF3YWl0IHNsZWVwRm9yUmV0cnkoKTtcblxuICAgIHJldHVybiBhd2FpdCBnZXRMb2NrKFxuICAgICAgYXBwLCBsb2NrRmlsZSwgdGltZW91dE1pbGxpc2Vjb25kcyxcbiAgICAgIG1heExvY2tSZXRyaWVzLCByZXRyeUNvdW50ICsgMSxcbiAgICApO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TG9ja0ZpbGVDb250ZW50ID0gKHRvdGFsVGltZW91dCwgZXBvY2hUaW1lKSA9PiBgJHt0b3RhbFRpbWVvdXR9OiR7ZXBvY2hUaW1lLnRvU3RyaW5nKCl9YDtcblxuY29uc3QgcGFyc2VMb2NrRmlsZUNvbnRlbnQgPSAoa2V5LCBjb250ZW50KSA9PiAkKGNvbnRlbnQsIFtcbiAgc3BsaXQoJzonKSxcbiAgcGFydHMgPT4gKHtcbiAgICB0b3RhbFRpbWVvdXQ6IG5ldyBOdW1iZXIocGFydHNbMF0pLFxuICAgIHRpbWVvdXQ6IG5ldyBOdW1iZXIocGFydHNbMV0pLFxuICAgIGtleSxcbiAgfSksXG5dKTtcblxuZXhwb3J0IGNvbnN0IHJlbGVhc2VMb2NrID0gYXN5bmMgKGFwcCwgbG9jaykgPT4ge1xuICBjb25zdCBjdXJyZW50RXBvY2hUaW1lID0gYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpO1xuICAvLyBvbmx5IHJlbGVhc2UgaWYgbm90IHRpbWVkb3V0XG4gIGlmIChjdXJyZW50RXBvY2hUaW1lIDwgKGxvY2sudGltZW91dCAtIGxvY2tPdmVybGFwTWlsbGlzZWNvbmRzKSkge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUobG9jay5rZXkpO1xuICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgIC8vZW1wdHlcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBleHRlbmRMb2NrID0gYXN5bmMgKGFwcCwgbG9jaykgPT4ge1xuICBjb25zdCBjdXJyZW50RXBvY2hUaW1lID0gYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpO1xuICAvLyBvbmx5IHJlbGVhc2UgaWYgbm90IHRpbWVkb3V0XG4gIGlmIChjdXJyZW50RXBvY2hUaW1lIDwgKGxvY2sudGltZW91dCAtIGxvY2tPdmVybGFwTWlsbGlzZWNvbmRzKSkge1xuICAgIHRyeSB7XG4gICAgICBsb2NrLnRpbWVvdXQgPSBjdXJyZW50RXBvY2hUaW1lICsgbG9jay50aW1lb3V0TWlsbGlzZWNvbmRzO1xuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVGaWxlKFxuICAgICAgICBsb2NrLmtleSxcbiAgICAgICAgZ2V0TG9ja0ZpbGVDb250ZW50KGxvY2sudG90YWxUaW1lb3V0LCBsb2NrLnRpbWVvdXQpLFxuICAgICAgKTtcbiAgICAgIHJldHVybiBsb2NrO1xuICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgIC8vZW1wdHlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIE5PX0xPQ0s7XG59O1xuXG5leHBvcnQgY29uc3QgTk9fTE9DSyA9ICdubyBsb2NrJztcbmV4cG9ydCBjb25zdCBpc05vbG9jayA9IGlkID0+IGlkID09PSBOT19MT0NLO1xuXG5jb25zdCBzbGVlcEZvclJldHJ5ID0gKCkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGxvY2tPdmVybGFwTWlsbGlzZWNvbmRzKSk7XG4iLCJpbXBvcnQge1xyXG4gIFxyXG4gIGhlYWQsIFxyXG4gIHRhaWwsIGZpbmRJbmRleCwgc3RhcnRzV2l0aCwgXHJcbiAgZHJvcFJpZ2h0LCBmbG93LCB0YWtlUmlnaHQsIHRyaW0sXHJcbiAgcmVwbGFjZVxyXG59IGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IFxyXG4gIHNvbWUsIHJlZHVjZSwgaXNFbXB0eSwgaXNBcnJheSwgam9pbixcclxuICBpc1N0cmluZywgaXNJbnRlZ2VyLCBpc0RhdGUsIHRvTnVtYmVyLFxyXG4gIGlzVW5kZWZpbmVkLCBpc05hTiwgaXNOdWxsLCBjb25zdGFudCxcclxuICBzcGxpdCwgaW5jbHVkZXMsIGZpbHRlclxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IGV2ZW50cywgZXZlbnRzTGlzdCB9IGZyb20gJy4vZXZlbnRzJztcclxuaW1wb3J0IHsgYXBpV3JhcHBlciB9IGZyb20gJy4vYXBpV3JhcHBlcic7XHJcbmltcG9ydCB7XHJcbiAgZ2V0TG9jaywgTk9fTE9DSyxcclxuICBpc05vbG9ja1xyXG59IGZyb20gJy4vbG9jayc7XHJcblxyXG4vLyB0aGlzIGlzIHRoZSBjb21iaW5hdG9yIGZ1bmN0aW9uXHJcbmV4cG9ydCBjb25zdCAkJCA9ICguLi5mdW5jcykgPT4gYXJnID0+IGZsb3coZnVuY3MpKGFyZyk7XHJcblxyXG4vLyB0aGlzIGlzIHRoZSBwaXBlIGZ1bmN0aW9uXHJcbmV4cG9ydCBjb25zdCAkID0gKGFyZywgZnVuY3MpID0+ICQkKC4uLmZ1bmNzKShhcmcpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGtleVNlcCA9ICcvJztcclxuY29uc3QgdHJpbUtleVNlcCA9IHN0ciA9PiB0cmltKHN0ciwga2V5U2VwKTtcclxuY29uc3Qgc3BsaXRCeUtleVNlcCA9IHN0ciA9PiBzcGxpdChrZXlTZXApKHN0cik7XHJcbmV4cG9ydCBjb25zdCBzYWZlS2V5ID0ga2V5ID0+IHJlcGxhY2UoYCR7a2V5U2VwfSR7dHJpbUtleVNlcChrZXkpfWAsIGAke2tleVNlcH0ke2tleVNlcH1gLCBrZXlTZXApO1xyXG5leHBvcnQgY29uc3Qgam9pbktleSA9ICguLi5zdHJzKSA9PiB7XHJcbiAgY29uc3QgcGFyYW1zT3JBcnJheSA9IHN0cnMubGVuZ3RoID09PSAxICYgaXNBcnJheShzdHJzWzBdKVxyXG4gICAgPyBzdHJzWzBdIDogc3RycztcclxuICByZXR1cm4gJChwYXJhbXNPckFycmF5LCBbXHJcbiAgICBmaWx0ZXIocyA9PiAhaXNVbmRlZmluZWQocykgXHJcbiAgICAgICAgICAgICAgICAmJiAhaXNOdWxsKHMpIFxyXG4gICAgICAgICAgICAgICAgJiYgcy50b1N0cmluZygpLmxlbmd0aCA+IDApLFxyXG4gICAgam9pbihrZXlTZXApLFxyXG4gICAgc2FmZUtleVxyXG4gIF0pO1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc3BsaXRLZXkgPSAkJCh0cmltS2V5U2VwLCBzcGxpdEJ5S2V5U2VwKTtcclxuZXhwb3J0IGNvbnN0IGdldERpckZvbUtleSA9ICQkKHNwbGl0S2V5LCBkcm9wUmlnaHQsIHAgPT4gam9pbktleSguLi5wKSk7XHJcbmV4cG9ydCBjb25zdCBnZXRGaWxlRnJvbUtleSA9ICQkKHNwbGl0S2V5LCB0YWtlUmlnaHQsIGhlYWQpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbmZpZ0ZvbGRlciA9IGAke2tleVNlcH0uY29uZmlnYDtcclxuZXhwb3J0IGNvbnN0IGZpZWxkRGVmaW5pdGlvbnMgPSBqb2luS2V5KGNvbmZpZ0ZvbGRlciwgJ2ZpZWxkcy5qc29uJyk7XHJcbmV4cG9ydCBjb25zdCB0ZW1wbGF0ZURlZmluaXRpb25zID0gam9pbktleShjb25maWdGb2xkZXIsICd0ZW1wbGF0ZXMuanNvbicpO1xyXG5leHBvcnQgY29uc3QgYXBwRGVmaW5pdGlvbkZpbGUgPSBqb2luS2V5KGNvbmZpZ0ZvbGRlciwgJ2FwcERlZmluaXRpb24uanNvbicpO1xyXG5leHBvcnQgY29uc3QgZGlySW5kZXggPSBmb2xkZXJQYXRoID0+IGpvaW5LZXkoY29uZmlnRm9sZGVyLCAnZGlyJywgLi4uc3BsaXRLZXkoZm9sZGVyUGF0aCksICdkaXIuaWR4Jyk7XHJcbmV4cG9ydCBjb25zdCBnZXRJbmRleEtleUZyb21GaWxlS2V5ID0gJCQoZ2V0RGlyRm9tS2V5LCBkaXJJbmRleCk7XHJcblxyXG5leHBvcnQgY29uc3QgaWZFeGlzdHMgPSAodmFsLCBleGlzdHMsIG5vdEV4aXN0cykgPT4gKGlzVW5kZWZpbmVkKHZhbClcclxuICA/IGlzVW5kZWZpbmVkKG5vdEV4aXN0cykgPyAoKCkgPT4geyB9KSgpIDogbm90RXhpc3RzKClcclxuICA6IGV4aXN0cygpKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRPckRlZmF1bHQgPSAodmFsLCBkZWZhdWx0VmFsKSA9PiBpZkV4aXN0cyh2YWwsICgpID0+IHZhbCwgKCkgPT4gZGVmYXVsdFZhbCk7XHJcblxyXG5leHBvcnQgY29uc3Qgbm90ID0gZnVuYyA9PiB2YWwgPT4gIWZ1bmModmFsKTtcclxuZXhwb3J0IGNvbnN0IGlzRGVmaW5lZCA9IG5vdChpc1VuZGVmaW5lZCk7XHJcbmV4cG9ydCBjb25zdCBpc05vbk51bGwgPSBub3QoaXNOdWxsKTtcclxuZXhwb3J0IGNvbnN0IGlzTm90TmFOID0gbm90KGlzTmFOKTtcclxuXHJcbmV4cG9ydCBjb25zdCBhbGxUcnVlID0gKC4uLmZ1bmNBcmdzKSA9PiB2YWwgPT4gcmVkdWNlKFxyXG4gIChyZXN1bHQsIGNvbmRpdGlvbkZ1bmMpID0+IChpc051bGwocmVzdWx0KSB8fCByZXN1bHQgPT0gdHJ1ZSkgJiYgY29uZGl0aW9uRnVuYyh2YWwpLFxyXG4gIG51bGwpKGZ1bmNBcmdzKTtcclxuXHJcbmV4cG9ydCBjb25zdCBhbnlUcnVlID0gKC4uLmZ1bmNBcmdzKSA9PiB2YWwgPT4gcmVkdWNlKFxyXG4gIChyZXN1bHQsIGNvbmRpdGlvbkZ1bmMpID0+IHJlc3VsdCA9PSB0cnVlIHx8IGNvbmRpdGlvbkZ1bmModmFsKSxcclxuICBudWxsKShmdW5jQXJncyk7XHJcblxyXG5leHBvcnQgY29uc3QgaW5zZW5zaXRpdmVFcXVhbHMgPSAoc3RyMSwgc3RyMikgPT4gc3RyMS50cmltKCkudG9Mb3dlckNhc2UoKSA9PT0gc3RyMi50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuXHJcbmV4cG9ydCBjb25zdCBpc1NvbWV0aGluZyA9IGFsbFRydWUoaXNEZWZpbmVkLCBpc05vbk51bGwsIGlzTm90TmFOKTtcclxuZXhwb3J0IGNvbnN0IGlzTm90aGluZyA9IG5vdChpc1NvbWV0aGluZyk7XHJcbmV4cG9ydCBjb25zdCBpc05vdGhpbmdPckVtcHR5ID0gdiA9PiBpc05vdGhpbmcodikgfHwgaXNFbXB0eSh2KTtcclxuZXhwb3J0IGNvbnN0IHNvbWV0aGluZ09yR2V0RGVmYXVsdCA9IGdldERlZmF1bHRGdW5jID0+IHZhbCA9PiAoaXNTb21ldGhpbmcodmFsKSA/IHZhbCA6IGdldERlZmF1bHRGdW5jKCkpO1xyXG5leHBvcnQgY29uc3Qgc29tZXRoaW5nT3JEZWZhdWx0ID0gKHZhbCwgZGVmYXVsdFZhbCkgPT4gc29tZXRoaW5nT3JHZXREZWZhdWx0KGNvbnN0YW50KGRlZmF1bHRWYWwpKSh2YWwpO1xyXG5cclxuZXhwb3J0IGNvbnN0IG1hcElmU29tZXRoaW5nT3JEZWZhdWx0ID0gKG1hcEZ1bmMsIGRlZmF1bHRWYWwpID0+IHZhbCA9PiAoaXNTb21ldGhpbmcodmFsKSA/IG1hcEZ1bmModmFsKSA6IGRlZmF1bHRWYWwpO1xyXG5cclxuZXhwb3J0IGNvbnN0IG1hcElmU29tZXRoaW5nT3JCbGFuayA9IG1hcEZ1bmMgPT4gbWFwSWZTb21ldGhpbmdPckRlZmF1bHQobWFwRnVuYywgJycpO1xyXG5cclxuZXhwb3J0IGNvbnN0IG5vbmUgPSBwcmVkaWNhdGUgPT4gY29sbGVjdGlvbiA9PiAhc29tZShwcmVkaWNhdGUpKGNvbGxlY3Rpb24pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGFsbCA9IHByZWRpY2F0ZSA9PiBjb2xsZWN0aW9uID0+IG5vbmUodiA9PiAhcHJlZGljYXRlKHYpKShjb2xsZWN0aW9uKTtcclxuXHJcbmV4cG9ydCBjb25zdCBpc05vdEVtcHR5ID0gb2IgPT4gIWlzRW1wdHkob2IpO1xyXG5leHBvcnQgY29uc3QgaXNBc3luYyA9IGZuID0+IGZuLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdBc3luY0Z1bmN0aW9uJztcclxuZXhwb3J0IGNvbnN0IGlzTm9uRW1wdHlBcnJheSA9IGFsbFRydWUoaXNBcnJheSwgaXNOb3RFbXB0eSk7XHJcbmV4cG9ydCBjb25zdCBpc05vbkVtcHR5U3RyaW5nID0gYWxsVHJ1ZShpc1N0cmluZywgaXNOb3RFbXB0eSk7XHJcbmV4cG9ydCBjb25zdCB0cnlPciA9IGZhaWxGdW5jID0+IChmdW5jLCAuLi5hcmdzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBmdW5jLmFwcGx5KG51bGwsIC4uLmFyZ3MpO1xyXG4gIH0gY2F0Y2ggKF8pIHtcclxuICAgIHJldHVybiBmYWlsRnVuYygpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCB0cnlBd2FpdE9yID0gZmFpbEZ1bmMgPT4gYXN5bmMgKGZ1bmMsIC4uLmFyZ3MpID0+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IGZ1bmMuYXBwbHkobnVsbCwgLi4uYXJncyk7XHJcbiAgfSBjYXRjaCAoXykge1xyXG4gICAgcmV0dXJuIGF3YWl0IGZhaWxGdW5jKCk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlZmluZUVycm9yID0gKGZ1bmMsIGVycm9yUHJlZml4KSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBmdW5jKCk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICBlcnIubWVzc2FnZSA9IGAke2Vycm9yUHJlZml4fSA6ICR7ZXJyLm1lc3NhZ2V9YDtcclxuICAgIHRocm93IGVycjtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgdHJ5T3JJZ25vcmUgPSB0cnlPcigoKSA9PiB7IH0pO1xyXG5leHBvcnQgY29uc3QgdHJ5QXdhaXRPcklnbm9yZSA9IHRyeUF3YWl0T3IoYXN5bmMgKCkgPT4geyB9KTtcclxuZXhwb3J0IGNvbnN0IGNhdXNlc0V4Y2VwdGlvbiA9IChmdW5jKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGZ1bmMoKTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uID0gZnVuYyA9PiAhY2F1c2VzRXhjZXB0aW9uKGZ1bmMpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGhhbmRsZUVycm9yV2l0aCA9IHJldHVyblZhbEluRXJyb3IgPT4gdHJ5T3IoY29uc3RhbnQocmV0dXJuVmFsSW5FcnJvcikpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGhhbmRsZUVycm9yV2l0aFVuZGVmaW5lZCA9IGhhbmRsZUVycm9yV2l0aCh1bmRlZmluZWQpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHN3aXRjaENhc2UgPSAoLi4uY2FzZXMpID0+ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IG5leHRDYXNlID0gKCkgPT4gaGVhZChjYXNlcylbMF0odmFsdWUpO1xyXG4gIGNvbnN0IG5leHRSZXN1bHQgPSAoKSA9PiBoZWFkKGNhc2VzKVsxXSh2YWx1ZSk7XHJcblxyXG4gIGlmIChpc0VtcHR5KGNhc2VzKSkgcmV0dXJuOyAvLyB1bmRlZmluZWRcclxuICBpZiAobmV4dENhc2UoKSA9PT0gdHJ1ZSkgcmV0dXJuIG5leHRSZXN1bHQoKTtcclxuICByZXR1cm4gc3dpdGNoQ2FzZSguLi50YWlsKGNhc2VzKSkodmFsdWUpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGlzVmFsdWUgPSB2YWwxID0+IHZhbDIgPT4gKHZhbDEgPT09IHZhbDIpO1xyXG5leHBvcnQgY29uc3QgaXNPbmVPZiA9ICguLi52YWxzKSA9PiB2YWwgPT4gaW5jbHVkZXModmFsKSh2YWxzKTtcclxuZXhwb3J0IGNvbnN0IGRlZmF1bHRDYXNlID0gY29uc3RhbnQodHJ1ZSk7XHJcbmV4cG9ydCBjb25zdCBtZW1iZXJNYXRjaGVzID0gKG1lbWJlciwgbWF0Y2gpID0+IG9iaiA9PiBtYXRjaChvYmpbbWVtYmVyXSk7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IFN0YXJ0c1dpdGggPSBzZWFyY2hGb3IgPT4gc2VhcmNoSW4gPT4gc3RhcnRzV2l0aChzZWFyY2hJbiwgc2VhcmNoRm9yKTtcclxuXHJcbmV4cG9ydCBjb25zdCBjb250YWlucyA9IHZhbCA9PiBhcnJheSA9PiAoZmluZEluZGV4KGFycmF5LCB2ID0+IHYgPT09IHZhbCkgPiAtMSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0SGFzaENvZGUgPSAocykgPT4ge1xyXG4gIGxldCBoYXNoID0gMDsgbGV0IGk7IGxldCBjaGFyOyBsZXRcclxuICAgIGw7XHJcbiAgaWYgKHMubGVuZ3RoID09IDApIHJldHVybiBoYXNoO1xyXG4gIGZvciAoaSA9IDAsIGwgPSBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgY2hhciA9IHMuY2hhckNvZGVBdChpKTtcclxuICAgIGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGNoYXI7XHJcbiAgICBoYXNoIHw9IDA7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxyXG4gIH1cclxuXHJcbiAgLy8gY29udmVydGluZyB0byBzdHJpbmcsIGJ1dCBkb250IHdhbnQgYSBcIi1cIiBwcmVmaXhlZFxyXG4gIGlmIChoYXNoIDwgMCkgeyByZXR1cm4gYG4keyhoYXNoICogLTEpLnRvU3RyaW5nKCl9YDsgfVxyXG4gIHJldHVybiBoYXNoLnRvU3RyaW5nKCk7XHJcbn07XHJcblxyXG4vLyB0aGFua3MgdG8gaHR0cHM6Ly9ibG9nLmdyb3NzbWFuLmlvL2hvdy10by13cml0ZS1hc3luYy1hd2FpdC13aXRob3V0LXRyeS1jYXRjaC1ibG9ja3MtaW4tamF2YXNjcmlwdC9cclxuZXhwb3J0IGNvbnN0IGF3RXggPSBhc3luYyAocHJvbWlzZSkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBwcm9taXNlO1xyXG4gICAgcmV0dXJuIFt1bmRlZmluZWQsIHJlc3VsdF07XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJldHVybiBbZXJyb3IsIHVuZGVmaW5lZF07XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGlzU2FmZUludGVnZXIgPSBuID0+IGlzSW50ZWdlcihuKVxyXG4gICAgJiYgbiA8PSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxyXG4gICAgJiYgbiA+PSAwIC0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XHJcblxyXG5leHBvcnQgY29uc3QgdG9EYXRlT3JOdWxsID0gcyA9PiAoaXNOdWxsKHMpID8gbnVsbFxyXG4gIDogaXNEYXRlKHMpID8gcyA6IG5ldyBEYXRlKHMpKTtcclxuZXhwb3J0IGNvbnN0IHRvQm9vbE9yTnVsbCA9IHMgPT4gKGlzTnVsbChzKSA/IG51bGxcclxuICA6IHMgPT09ICd0cnVlJyB8fCBzID09PSB0cnVlKTtcclxuZXhwb3J0IGNvbnN0IHRvTnVtYmVyT3JOdWxsID0gcyA9PiAoaXNOdWxsKHMpID8gbnVsbFxyXG4gIDogdG9OdW1iZXIocykpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGlzQXJyYXlPZlN0cmluZyA9IG9wdHMgPT4gaXNBcnJheShvcHRzKSAmJiBhbGwoaXNTdHJpbmcpKG9wdHMpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHB1c2hBbGwgPSAodGFyZ2V0LCBpdGVtcykgPT4ge1xyXG4gIGZvcihsZXQgaSBvZiBpdGVtcykgdGFyZ2V0LnB1c2goaSk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBwYXVzZSA9IGFzeW5jIGR1cmF0aW9uID0+IG5ldyBQcm9taXNlKHJlcyA9PiBzZXRUaW1lb3V0KHJlcywgZHVyYXRpb24pKTtcclxuXHJcbmV4cG9ydCBjb25zdCByZXRyeSA9IGFzeW5jIChmbiwgcmV0cmllcywgZGVsYXksIC4uLmFyZ3MpID0+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IGZuKC4uLmFyZ3MpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgaWYgKHJldHJpZXMgPiAxKSB7XHJcbiAgICAgIHJldHVybiBhd2FpdCBwYXVzZShkZWxheSkudGhlbihhc3luYyAoKSA9PiBhd2FpdCByZXRyeShmbiwgKHJldHJpZXMgLSAxKSwgZGVsYXksIC4uLmFyZ3MpKTtcclxuICAgIH1cclxuICAgIHRocm93IGVycjtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgeyBldmVudHMgfSBmcm9tICcuL2V2ZW50cyc7XHJcbmV4cG9ydCB7IGFwaVdyYXBwZXIsIGFwaVdyYXBwZXJTeW5jIH0gZnJvbSAnLi9hcGlXcmFwcGVyJztcclxuZXhwb3J0IHtcclxuICBnZXRMb2NrLCBOT19MT0NLLCByZWxlYXNlTG9jayxcclxuICBleHRlbmRMb2NrLCBpc05vbG9jayxcclxufSBmcm9tICcuL2xvY2snO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGlmRXhpc3RzLFxyXG4gIGdldE9yRGVmYXVsdCxcclxuICBpc0RlZmluZWQsXHJcbiAgaXNOb25OdWxsLFxyXG4gIGlzTm90TmFOLFxyXG4gIGFsbFRydWUsXHJcbiAgaXNTb21ldGhpbmcsXHJcbiAgbWFwSWZTb21ldGhpbmdPckRlZmF1bHQsXHJcbiAgbWFwSWZTb21ldGhpbmdPckJsYW5rLFxyXG4gIGNvbmZpZ0ZvbGRlcixcclxuICBmaWVsZERlZmluaXRpb25zLFxyXG4gIGlzTm90aGluZyxcclxuICBub3QsXHJcbiAgc3dpdGNoQ2FzZSxcclxuICBkZWZhdWx0Q2FzZSxcclxuICBTdGFydHNXaXRoLFxyXG4gIGNvbnRhaW5zLFxyXG4gIHRlbXBsYXRlRGVmaW5pdGlvbnMsXHJcbiAgaGFuZGxlRXJyb3JXaXRoLFxyXG4gIGhhbmRsZUVycm9yV2l0aFVuZGVmaW5lZCxcclxuICB0cnlPcixcclxuICB0cnlPcklnbm9yZSxcclxuICB0cnlBd2FpdE9yLFxyXG4gIHRyeUF3YWl0T3JJZ25vcmUsXHJcbiAgZGlySW5kZXgsXHJcbiAga2V5U2VwLFxyXG4gICQsXHJcbiAgJCQsXHJcbiAgZ2V0RGlyRm9tS2V5LFxyXG4gIGdldEZpbGVGcm9tS2V5LFxyXG4gIHNwbGl0S2V5LFxyXG4gIHNvbWV0aGluZ09yRGVmYXVsdCxcclxuICBnZXRJbmRleEtleUZyb21GaWxlS2V5LFxyXG4gIGpvaW5LZXksXHJcbiAgc29tZXRoaW5nT3JHZXREZWZhdWx0LFxyXG4gIGFwcERlZmluaXRpb25GaWxlLFxyXG4gIGlzVmFsdWUsXHJcbiAgYWxsLFxyXG4gIGlzT25lT2YsXHJcbiAgbWVtYmVyTWF0Y2hlcyxcclxuICBkZWZpbmVFcnJvcixcclxuICBhbnlUcnVlLFxyXG4gIGlzTm9uRW1wdHlBcnJheSxcclxuICBjYXVzZXNFeGNlcHRpb24sXHJcbiAgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uLFxyXG4gIG5vbmUsXHJcbiAgZ2V0SGFzaENvZGUsXHJcbiAgYXdFeCxcclxuICBhcGlXcmFwcGVyLFxyXG4gIGV2ZW50cyxcclxuICBldmVudHNMaXN0LFxyXG4gIGlzTm90aGluZ09yRW1wdHksXHJcbiAgaXNTYWZlSW50ZWdlcixcclxuICB0b051bWJlcixcclxuICB0b0RhdGU6IHRvRGF0ZU9yTnVsbCxcclxuICB0b0Jvb2w6IHRvQm9vbE9yTnVsbCxcclxuICBpc0FycmF5T2ZTdHJpbmcsXHJcbiAgZ2V0TG9jayxcclxuICBOT19MT0NLLFxyXG4gIGlzTm9sb2NrLFxyXG4gIGluc2Vuc2l0aXZlRXF1YWxzLFxyXG4gIHBhdXNlLFxyXG4gIHJldHJ5LFxyXG4gIHB1c2hBbGxcclxufTtcclxuIiwiaW1wb3J0IHsgZmlsdGVyLCBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgJCwgaXNTb21ldGhpbmcgfSBmcm9tICcuL2luZGV4JztcblxuZXhwb3J0IGNvbnN0IHN0cmluZ05vdEVtcHR5ID0gcyA9PiBpc1NvbWV0aGluZyhzKSAmJiBzLnRyaW0oKS5sZW5ndGggPiAwO1xuXG5leHBvcnQgY29uc3QgbWFrZXJ1bGUgPSAoZmllbGQsIGVycm9yLCBpc1ZhbGlkKSA9PiAoeyBmaWVsZCwgZXJyb3IsIGlzVmFsaWQgfSk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0aW9uRXJyb3IgPSAocnVsZSwgaXRlbSkgPT4gKHsgLi4ucnVsZSwgaXRlbSB9KTtcblxuZXhwb3J0IGNvbnN0IGFwcGx5UnVsZVNldCA9IHJ1bGVTZXQgPT4gaXRlbVRvVmFsaWRhdGUgPT4gJChydWxlU2V0LCBbXG4gIG1hcChhcHBseVJ1bGUoaXRlbVRvVmFsaWRhdGUpKSxcbiAgZmlsdGVyKGlzU29tZXRoaW5nKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgYXBwbHlSdWxlID0gaXRlbVRvdmFsaWRhdGUgPT4gcnVsZSA9PiAocnVsZS5pc1ZhbGlkKGl0ZW1Ub3ZhbGlkYXRlKVxuICA/IG51bGxcbiAgOiB2YWxpZGF0aW9uRXJyb3IocnVsZSwgaXRlbVRvdmFsaWRhdGUpKTtcbiIsImltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCB7XG4gIGlzVW5kZWZpbmVkLCBrZXlzLCBcbiAgY2xvbmVEZWVwLCBpc0Z1bmN0aW9uLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZGVmaW5lRXJyb3IgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZmlsdGVyRXZhbCA9ICdGSUxURVJfRVZBTFVBVEUnO1xuZXhwb3J0IGNvbnN0IGZpbHRlckNvbXBpbGUgPSAnRklMVEVSX0NPTVBJTEUnO1xuZXhwb3J0IGNvbnN0IG1hcEV2YWwgPSAnTUFQX0VWQUxVQVRFJztcbmV4cG9ydCBjb25zdCBtYXBDb21waWxlID0gJ01BUF9DT01QSUxFJztcbmV4cG9ydCBjb25zdCByZW1vdmVVbmRlY2xhcmVkRmllbGRzID0gJ1JFTU9WRV9VTkRFQ0xBUkVEX0ZJRUxEUyc7XG5leHBvcnQgY29uc3QgYWRkVW5NYXBwZWRGaWVsZHMgPSAnQUREX1VOTUFQUEVEX0ZJRUxEUyc7XG5leHBvcnQgY29uc3QgYWRkVGhlS2V5ID0gJ0FERF9LRVknO1xuXG5cbmNvbnN0IGdldEV2YWx1YXRlUmVzdWx0ID0gKCkgPT4gKHtcbiAgaXNFcnJvcjogZmFsc2UsXG4gIHBhc3NlZEZpbHRlcjogdHJ1ZSxcbiAgcmVzdWx0OiBudWxsLFxufSk7XG5cbmV4cG9ydCBjb25zdCBjb21waWxlRmlsdGVyID0gaW5kZXggPT4gY29tcGlsZUV4cHJlc3Npb24oaW5kZXguZmlsdGVyKTtcblxuZXhwb3J0IGNvbnN0IGNvbXBpbGVNYXAgPSBpbmRleCA9PiBjb21waWxlQ29kZShpbmRleC5tYXApO1xuXG5leHBvcnQgY29uc3QgcGFzc2VzRmlsdGVyID0gKHJlY29yZCwgaW5kZXgpID0+IHtcbiAgY29uc3QgY29udGV4dCA9IHsgcmVjb3JkIH07XG4gIGlmICghaW5kZXguZmlsdGVyKSByZXR1cm4gdHJ1ZTtcblxuICBjb25zdCBjb21waWxlZEZpbHRlciA9IGRlZmluZUVycm9yKFxuICAgICgpID0+IGNvbXBpbGVGaWx0ZXIoaW5kZXgpLFxuICAgIGZpbHRlckNvbXBpbGUsXG4gICk7XG5cbiAgcmV0dXJuIGRlZmluZUVycm9yKFxuICAgICgpID0+IGNvbXBpbGVkRmlsdGVyKGNvbnRleHQpLFxuICAgIGZpbHRlckV2YWwsXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgbWFwUmVjb3JkID0gKHJlY29yZCwgaW5kZXgpID0+IHtcbiAgY29uc3QgcmVjb3JkQ2xvbmUgPSBjbG9uZURlZXAocmVjb3JkKTtcbiAgY29uc3QgY29udGV4dCA9IHsgcmVjb3JkOiByZWNvcmRDbG9uZSB9O1xuXG4gIGNvbnN0IG1hcCA9IGluZGV4Lm1hcCA/IGluZGV4Lm1hcCA6ICdyZXR1cm4gey4uLnJlY29yZH07JztcblxuICBjb25zdCBjb21waWxlZE1hcCA9IGRlZmluZUVycm9yKFxuICAgICgpID0+IGNvbXBpbGVDb2RlKG1hcCksXG4gICAgbWFwQ29tcGlsZSxcbiAgKTtcblxuICBjb25zdCBtYXBwZWQgPSBkZWZpbmVFcnJvcihcbiAgICAoKSA9PiBjb21waWxlZE1hcChjb250ZXh0KSxcbiAgICBtYXBFdmFsLFxuICApO1xuXG4gIGNvbnN0IG1hcHBlZEtleXMgPSBrZXlzKG1hcHBlZCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWFwcGVkS2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGtleSA9IG1hcHBlZEtleXNbaV07XG4gICAgbWFwcGVkW2tleV0gPSBpc1VuZGVmaW5lZChtYXBwZWRba2V5XSkgPyBudWxsIDogbWFwcGVkW2tleV07XG4gICAgaWYgKGlzRnVuY3Rpb24obWFwcGVkW2tleV0pKSB7XG4gICAgICBkZWxldGUgbWFwcGVkW2tleV07XG4gICAgfVxuICB9XG5cbiAgbWFwcGVkLmtleSA9IHJlY29yZC5rZXk7XG4gIG1hcHBlZC5zb3J0S2V5ID0gaW5kZXguZ2V0U29ydEtleVxuICAgID8gY29tcGlsZUNvZGUoaW5kZXguZ2V0U29ydEtleSkoY29udGV4dClcbiAgICA6IHJlY29yZC5pZDtcblxuICByZXR1cm4gbWFwcGVkO1xufTtcblxuZXhwb3J0IGNvbnN0IGV2YWx1YXRlID0gcmVjb3JkID0+IChpbmRleCkgPT4ge1xuICBjb25zdCByZXN1bHQgPSBnZXRFdmFsdWF0ZVJlc3VsdCgpO1xuXG4gIHRyeSB7XG4gICAgcmVzdWx0LnBhc3NlZEZpbHRlciA9IHBhc3Nlc0ZpbHRlcihyZWNvcmQsIGluZGV4KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmVzdWx0LmlzRXJyb3IgPSB0cnVlO1xuICAgIHJlc3VsdC5wYXNzZWRGaWx0ZXIgPSBmYWxzZTtcbiAgICByZXN1bHQucmVzdWx0ID0gZXJyLm1lc3NhZ2U7XG4gIH1cblxuICBpZiAoIXJlc3VsdC5wYXNzZWRGaWx0ZXIpIHJldHVybiByZXN1bHQ7XG5cbiAgdHJ5IHtcbiAgICByZXN1bHQucmVzdWx0ID0gbWFwUmVjb3JkKHJlY29yZCwgaW5kZXgpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXN1bHQuaXNFcnJvciA9IHRydWU7XG4gICAgcmVzdWx0LnJlc3VsdCA9IGVyci5tZXNzYWdlO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGV2YWx1YXRlO1xuIiwiaW1wb3J0IHtcbiAgbWFwLCBpc0VtcHR5LCBjb3VudEJ5LCBcbiAgZmxhdHRlbiwgaW5jbHVkZXMsIGpvaW4sIGtleXNcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7ICB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHsgY29tcGlsZUZpbHRlciwgY29tcGlsZU1hcCB9IGZyb20gJy4uL2luZGV4aW5nL2V2YWx1YXRlJztcbmltcG9ydCB7IGlzTm9uRW1wdHlTdHJpbmcsIGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbiwgJCB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBpc1JlY29yZCB9IGZyb20gJy4vaGllcmFyY2h5JztcblxuZXhwb3J0IGNvbnN0IGluZGV4VHlwZXMgPSB7IHJlZmVyZW5jZTogJ3JlZmVyZW5jZScsIGFuY2VzdG9yOiAnYW5jZXN0b3InIH07XG5cbmV4cG9ydCBjb25zdCBpbmRleFJ1bGVTZXQgPSBbXG4gIG1ha2VydWxlKCdtYXAnLCAnaW5kZXggaGFzIG5vIG1hcCBmdW5jdGlvbicsXG4gICAgaW5kZXggPT4gaXNOb25FbXB0eVN0cmluZyhpbmRleC5tYXApKSxcbiAgbWFrZXJ1bGUoJ21hcCcsIFwiaW5kZXgncyBtYXAgZnVuY3Rpb24gZG9lcyBub3QgY29tcGlsZVwiLFxuICAgIGluZGV4ID0+ICFpc05vbkVtcHR5U3RyaW5nKGluZGV4Lm1hcClcbiAgICAgICAgICAgICAgICB8fCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24oKCkgPT4gY29tcGlsZU1hcChpbmRleCkpKSxcbiAgbWFrZXJ1bGUoJ2ZpbHRlcicsIFwiaW5kZXgncyBmaWx0ZXIgZnVuY3Rpb24gZG9lcyBub3QgY29tcGlsZVwiLFxuICAgIGluZGV4ID0+ICFpc05vbkVtcHR5U3RyaW5nKGluZGV4LmZpbHRlcilcbiAgICAgICAgICAgICAgICB8fCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24oKCkgPT4gY29tcGlsZUZpbHRlcihpbmRleCkpKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnbXVzdCBkZWNsYXJlIGEgbmFtZSBmb3IgaW5kZXgnLFxuICAgIGluZGV4ID0+IGlzTm9uRW1wdHlTdHJpbmcoaW5kZXgubmFtZSkpLFxuICBtYWtlcnVsZSgnbmFtZScsICd0aGVyZSBpcyBhIGR1cGxpY2F0ZSBuYW1lZCBpbmRleCBvbiB0aGlzIG5vZGUnLFxuICAgIGluZGV4ID0+IGlzRW1wdHkoaW5kZXgubmFtZSlcbiAgICAgICAgICAgICAgICB8fCBjb3VudEJ5KCduYW1lJykoaW5kZXgucGFyZW50KCkuaW5kZXhlcylbaW5kZXgubmFtZV0gPT09IDEpLFxuICBtYWtlcnVsZSgnaW5kZXhUeXBlJywgJ3JlZmVyZW5jZSBpbmRleCBtYXkgb25seSBleGlzdCBvbiBhIHJlY29yZCBub2RlJyxcbiAgICBpbmRleCA9PiBpc1JlY29yZChpbmRleC5wYXJlbnQoKSlcbiAgICAgICAgICAgICAgICAgIHx8IGluZGV4LmluZGV4VHlwZSAhPT0gaW5kZXhUeXBlcy5yZWZlcmVuY2UpLFxuICBtYWtlcnVsZSgnaW5kZXhUeXBlJywgYGluZGV4IHR5cGUgbXVzdCBiZSBvbmUgb2Y6ICR7am9pbignLCAnKShrZXlzKGluZGV4VHlwZXMpKX1gLFxuICAgIGluZGV4ID0+IGluY2x1ZGVzKGluZGV4LmluZGV4VHlwZSkoa2V5cyhpbmRleFR5cGVzKSkpLFxuXTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlSW5kZXggPSAoaW5kZXgsIGFsbFJlZmVyZW5jZUluZGV4ZXNPbk5vZGUpID0+IGFwcGx5UnVsZVNldChpbmRleFJ1bGVTZXQoYWxsUmVmZXJlbmNlSW5kZXhlc09uTm9kZSkpKGluZGV4KTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWxsSW5kZXhlcyA9IG5vZGUgPT4gJChub2RlLmluZGV4ZXMsIFtcbiAgbWFwKGkgPT4gdmFsaWRhdGVJbmRleChpLCBub2RlLmluZGV4ZXMpKSxcbiAgZmxhdHRlbixcbl0pO1xuIiwiaW1wb3J0IHtcclxuICBmaW5kLCBjb25zdGFudCwgbWFwLCBsYXN0LFxyXG4gIGZpcnN0LCBzcGxpdCwgaW50ZXJzZWN0aW9uLCB0YWtlLFxyXG4gIHVuaW9uLCBpbmNsdWRlcywgZmlsdGVyLCBzb21lLFxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7XHJcbiAgJCwgc3dpdGNoQ2FzZSwgaXNOb3RoaW5nLCBpc1NvbWV0aGluZyxcclxuICBkZWZhdWx0Q2FzZSwgc3BsaXRLZXksIGlzTm9uRW1wdHlTdHJpbmcsXHJcbiAgam9pbktleSwgZ2V0SGFzaENvZGUsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgaW5kZXhUeXBlcyB9IGZyb20gJy4vaW5kZXhlcyc7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0RmxhdHRlbmVkSGllcmFyY2h5ID0gKGFwcEhpZXJhcmNoeSwgdXNlQ2FjaGVkID0gdHJ1ZSkgPT4ge1xyXG4gIGlmIChpc1NvbWV0aGluZyhhcHBIaWVyYXJjaHkuZ2V0RmxhdHRlbmVkSGllcmFyY2h5KSAmJiB1c2VDYWNoZWQpIHsgcmV0dXJuIGFwcEhpZXJhcmNoeS5nZXRGbGF0dGVuZWRIaWVyYXJjaHkoKTsgfVxyXG5cclxuICBjb25zdCBmbGF0dGVuSGllcmFyY2h5ID0gKGN1cnJlbnROb2RlLCBmbGF0dGVuZWQpID0+IHtcclxuICAgIGZsYXR0ZW5lZC5wdXNoKGN1cnJlbnROb2RlKTtcclxuICAgIGlmICgoIWN1cnJlbnROb2RlLmNoaWxkcmVuXHJcbiAgICAgICAgICAgIHx8IGN1cnJlbnROb2RlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgJiYgKCFjdXJyZW50Tm9kZS5pbmRleGVzXHJcbiAgICAgICAgICAgIHx8IGN1cnJlbnROb2RlLmluZGV4ZXMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICAmJiAoIWN1cnJlbnROb2RlLmFnZ3JlZ2F0ZUdyb3Vwc1xyXG4gICAgICAgICAgICB8fCBjdXJyZW50Tm9kZS5hZ2dyZWdhdGVHcm91cHMubGVuZ3RoID09PSAwKSkge1xyXG4gICAgICByZXR1cm4gZmxhdHRlbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHVuaW9uSWZBbnkgPSBsMiA9PiBsMSA9PiB1bmlvbihsMSkoIWwyID8gW10gOiBsMik7XHJcblxyXG4gICAgY29uc3QgY2hpbGRyZW4gPSAkKFtdLCBbXHJcbiAgICAgIHVuaW9uSWZBbnkoY3VycmVudE5vZGUuY2hpbGRyZW4pLFxyXG4gICAgICB1bmlvbklmQW55KGN1cnJlbnROb2RlLmluZGV4ZXMpLFxyXG4gICAgICB1bmlvbklmQW55KGN1cnJlbnROb2RlLmFnZ3JlZ2F0ZUdyb3VwcyksXHJcbiAgICBdKTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XHJcbiAgICAgIGZsYXR0ZW5IaWVyYXJjaHkoY2hpbGQsIGZsYXR0ZW5lZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmxhdHRlbmVkO1xyXG4gIH07XHJcblxyXG4gIGFwcEhpZXJhcmNoeS5nZXRGbGF0dGVuZWRIaWVyYXJjaHkgPSAoKSA9PiBmbGF0dGVuSGllcmFyY2h5KGFwcEhpZXJhcmNoeSwgW10pO1xyXG4gIHJldHVybiBhcHBIaWVyYXJjaHkuZ2V0RmxhdHRlbmVkSGllcmFyY2h5KCk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TGFzdFBhcnRJbktleSA9IGtleSA9PiBsYXN0KHNwbGl0S2V5KGtleSkpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldE5vZGVzSW5QYXRoID0gYXBwSGllcmFyY2h5ID0+IGtleSA9PiAkKGFwcEhpZXJhcmNoeSwgW1xyXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcclxuICBmaWx0ZXIobiA9PiBuZXcgUmVnRXhwKGAke24ucGF0aFJlZ3goKX1gKS50ZXN0KGtleSkpLFxyXG5dKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRFeGFjdE5vZGVGb3JLZXkgPSBhcHBIaWVyYXJjaHkgPT4ga2V5ID0+ICQoYXBwSGllcmFyY2h5LCBbXHJcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxyXG4gIGZpbmQobiA9PiBuZXcgUmVnRXhwKGAke24ucGF0aFJlZ3goKX0kYCkudGVzdChrZXkpKSxcclxuXSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoID0gYXBwSGllcmFyY2h5ID0+IGNvbGxlY3Rpb25LZXkgPT4gJChhcHBIaWVyYXJjaHksIFtcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbiAgZmluZChuID0+IChpc0NvbGxlY3Rpb25SZWNvcmQobilcclxuICAgICAgICAgICAgICAgICAgICYmIG5ldyBSZWdFeHAoYCR7bi5jb2xsZWN0aW9uUGF0aFJlZ3goKX0kYCkudGVzdChjb2xsZWN0aW9uS2V5KSkpLFxyXG5dKTtcclxuXHJcbmV4cG9ydCBjb25zdCBoYXNNYXRjaGluZ0FuY2VzdG9yID0gYW5jZXN0b3JQcmVkaWNhdGUgPT4gZGVjZW5kYW50Tm9kZSA9PiBzd2l0Y2hDYXNlKFxyXG5cclxuICBbbm9kZSA9PiBpc05vdGhpbmcobm9kZS5wYXJlbnQoKSksXHJcbiAgICBjb25zdGFudChmYWxzZSldLFxyXG5cclxuICBbbm9kZSA9PiBhbmNlc3RvclByZWRpY2F0ZShub2RlLnBhcmVudCgpKSxcclxuICAgIGNvbnN0YW50KHRydWUpXSxcclxuXHJcbiAgW2RlZmF1bHRDYXNlLFxyXG4gICAgbm9kZSA9PiBoYXNNYXRjaGluZ0FuY2VzdG9yKGFuY2VzdG9yUHJlZGljYXRlKShub2RlLnBhcmVudCgpKV0sXHJcblxyXG4pKGRlY2VuZGFudE5vZGUpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldE5vZGUgPSAoYXBwSGllcmFyY2h5LCBub2RlS2V5KSA9PiAkKGFwcEhpZXJhcmNoeSwgW1xyXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcclxuICBmaW5kKG4gPT4gbi5ub2RlS2V5KCkgPT09IG5vZGVLZXlcclxuICAgICAgICAgICAgICAgICAgfHwgKGlzQ29sbGVjdGlvblJlY29yZChuKVxyXG4gICAgICAgICAgICAgICAgICAgICAgJiYgbi5jb2xsZWN0aW9uTm9kZUtleSgpID09PSBub2RlS2V5KSksXHJcbl0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldENvbGxlY3Rpb25Ob2RlID0gKGFwcEhpZXJhcmNoeSwgbm9kZUtleSkgPT4gJChhcHBIaWVyYXJjaHksIFtcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbiAgZmluZChuID0+IChpc0NvbGxlY3Rpb25SZWNvcmQobilcclxuICAgICAgICAgICAgICAgICAgICAmJiBuLmNvbGxlY3Rpb25Ob2RlS2V5KCkgPT09IG5vZGVLZXkpKSxcclxuXSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0Tm9kZUJ5S2V5T3JOb2RlS2V5ID0gKGFwcEhpZXJhcmNoeSwga2V5T3JOb2RlS2V5KSA9PiB7XHJcbiAgY29uc3Qgbm9kZUJ5S2V5ID0gZ2V0RXhhY3ROb2RlRm9yS2V5KGFwcEhpZXJhcmNoeSkoa2V5T3JOb2RlS2V5KTtcclxuICByZXR1cm4gaXNOb3RoaW5nKG5vZGVCeUtleSlcclxuICAgID8gZ2V0Tm9kZShhcHBIaWVyYXJjaHksIGtleU9yTm9kZUtleSlcclxuICAgIDogbm9kZUJ5S2V5O1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldENvbGxlY3Rpb25Ob2RlQnlLZXlPck5vZGVLZXkgPSAoYXBwSGllcmFyY2h5LCBrZXlPck5vZGVLZXkpID0+IHtcclxuICBjb25zdCBub2RlQnlLZXkgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwSGllcmFyY2h5KShrZXlPck5vZGVLZXkpO1xyXG4gIHJldHVybiBpc05vdGhpbmcobm9kZUJ5S2V5KVxyXG4gICAgPyBnZXRDb2xsZWN0aW9uTm9kZShhcHBIaWVyYXJjaHksIGtleU9yTm9kZUtleSlcclxuICAgIDogbm9kZUJ5S2V5O1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGlzTm9kZSA9IChhcHBIaWVyYXJjaHksIGtleSkgPT4gaXNTb21ldGhpbmcoZ2V0RXhhY3ROb2RlRm9yS2V5KGFwcEhpZXJhcmNoeSkoa2V5KSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQgPSAocGFyZW50Tm9kZUtleSwgYWN0dWFsQ2hpbGRLZXkpID0+IFxyXG4gICQoYWN0dWFsQ2hpbGRLZXksIFtcclxuICAgIHNwbGl0S2V5LFxyXG4gICAgdGFrZShzcGxpdEtleShwYXJlbnROb2RlS2V5KS5sZW5ndGgpLFxyXG4gICAga3MgPT4gam9pbktleSguLi5rcyksXHJcbiAgXSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0UGFyZW50S2V5ID0gKGtleSkgPT4ge1xyXG4gIHJldHVybiAkKGtleSwgW1xyXG4gICAgc3BsaXRLZXksXHJcbiAgICB0YWtlKHNwbGl0S2V5KGtleSkubGVuZ3RoIC0gMSksXHJcbiAgICBqb2luS2V5LFxyXG4gIF0pO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGlzS2V5QW5jZXN0b3JPZiA9IGFuY2VzdG9yS2V5ID0+IGRlY2VuZGFudE5vZGUgPT4gaGFzTWF0Y2hpbmdBbmNlc3RvcihwID0+IHAubm9kZUtleSgpID09PSBhbmNlc3RvcktleSkoZGVjZW5kYW50Tm9kZSk7XHJcblxyXG5leHBvcnQgY29uc3QgaGFzTm9NYXRjaGluZ0FuY2VzdG9ycyA9IHBhcmVudFByZWRpY2F0ZSA9PiBub2RlID0+ICFoYXNNYXRjaGluZ0FuY2VzdG9yKHBhcmVudFByZWRpY2F0ZSkobm9kZSk7XHJcblxyXG5leHBvcnQgY29uc3QgZmluZEZpZWxkID0gKHJlY29yZE5vZGUsIGZpZWxkTmFtZSkgPT4gZmluZChmID0+IGYubmFtZSA9PSBmaWVsZE5hbWUpKHJlY29yZE5vZGUuZmllbGRzKTtcclxuXHJcbmV4cG9ydCBjb25zdCBpc0FuY2VzdG9yID0gZGVjZW5kYW50ID0+IGFuY2VzdG9yID0+IGlzS2V5QW5jZXN0b3JPZihhbmNlc3Rvci5ub2RlS2V5KCkpKGRlY2VuZGFudCk7XHJcblxyXG5leHBvcnQgY29uc3QgaXNEZWNlbmRhbnQgPSBhbmNlc3RvciA9PiBkZWNlbmRhbnQgPT4gaXNBbmNlc3RvcihkZWNlbmRhbnQpKGFuY2VzdG9yKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRSZWNvcmROb2RlSWQgPSByZWNvcmRLZXkgPT4gJChyZWNvcmRLZXksIFtcclxuICBzcGxpdEtleSxcclxuICBsYXN0LFxyXG4gIGdldFJlY29yZE5vZGVJZEZyb21JZCxcclxuXSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkTm9kZUlkRnJvbUlkID0gcmVjb3JkSWQgPT4gJChyZWNvcmRJZCwgW3NwbGl0KCctJyksIGZpcnN0LCBwYXJzZUludF0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFJlY29yZE5vZGVCeUlkID0gKGhpZXJhcmNoeSwgcmVjb3JkSWQpID0+ICQoaGllcmFyY2h5LCBbXHJcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxyXG4gIGZpbmQobiA9PiBpc1JlY29yZChuKVxyXG4gICAgICAgICAgICAgICAgICAgICYmIG4ubm9kZUlkID09PSBnZXRSZWNvcmROb2RlSWRGcm9tSWQocmVjb3JkSWQpKSxcclxuXSk7XHJcblxyXG5leHBvcnQgY29uc3QgcmVjb3JkTm9kZUlkSXNBbGxvd2VkID0gaW5kZXhOb2RlID0+IG5vZGVJZCA9PiBpbmRleE5vZGUuYWxsb3dlZFJlY29yZE5vZGVJZHMubGVuZ3RoID09PSAwXHJcbiAgICB8fCBpbmNsdWRlcyhub2RlSWQpKGluZGV4Tm9kZS5hbGxvd2VkUmVjb3JkTm9kZUlkcyk7XHJcblxyXG5leHBvcnQgY29uc3QgcmVjb3JkTm9kZUlzQWxsb3dlZCA9IGluZGV4Tm9kZSA9PiByZWNvcmROb2RlID0+IHJlY29yZE5vZGVJZElzQWxsb3dlZChpbmRleE5vZGUpKHJlY29yZE5vZGUubm9kZUlkKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleCA9IChhcHBIaWVyYXJjaHksIGluZGV4Tm9kZSkgPT4ge1xyXG4gIGNvbnN0IHJlY29yZE5vZGVzID0gJChhcHBIaWVyYXJjaHksIFtcclxuICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcclxuICAgIGZpbHRlcihpc1JlY29yZCksXHJcbiAgXSk7XHJcblxyXG4gIGlmIChpc0dsb2JhbEluZGV4KGluZGV4Tm9kZSkpIHtcclxuICAgIHJldHVybiAkKHJlY29yZE5vZGVzLCBbXHJcbiAgICAgIGZpbHRlcihyZWNvcmROb2RlSXNBbGxvd2VkKGluZGV4Tm9kZSkpLFxyXG4gICAgXSk7XHJcbiAgfVxyXG5cclxuICBpZiAoaXNBbmNlc3RvckluZGV4KGluZGV4Tm9kZSkpIHtcclxuICAgIHJldHVybiAkKHJlY29yZE5vZGVzLCBbXHJcbiAgICAgIGZpbHRlcihpc0RlY2VuZGFudChpbmRleE5vZGUucGFyZW50KCkpKSxcclxuICAgICAgZmlsdGVyKHJlY29yZE5vZGVJc0FsbG93ZWQoaW5kZXhOb2RlKSksXHJcbiAgICBdKTtcclxuICB9XHJcblxyXG4gIGlmIChpc1JlZmVyZW5jZUluZGV4KGluZGV4Tm9kZSkpIHtcclxuICAgIHJldHVybiAkKHJlY29yZE5vZGVzLCBbXHJcbiAgICAgIGZpbHRlcihuID0+IHNvbWUoZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXgoaW5kZXhOb2RlKSkobi5maWVsZHMpKSxcclxuICAgIF0pO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXROb2RlRnJvbU5vZGVLZXlIYXNoID0gaGllcmFyY2h5ID0+IGhhc2ggPT4gJChoaWVyYXJjaHksIFtcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbiAgZmluZChuID0+IGdldEhhc2hDb2RlKG4ubm9kZUtleSgpKSA9PT0gaGFzaCksXHJcbl0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGlzUmVjb3JkID0gbm9kZSA9PiBpc1NvbWV0aGluZyhub2RlKSAmJiBub2RlLnR5cGUgPT09ICdyZWNvcmQnO1xyXG5leHBvcnQgY29uc3QgaXNTaW5nbGVSZWNvcmQgPSBub2RlID0+IGlzUmVjb3JkKG5vZGUpICYmIG5vZGUuaXNTaW5nbGU7XHJcbmV4cG9ydCBjb25zdCBpc0NvbGxlY3Rpb25SZWNvcmQgPSBub2RlID0+IGlzUmVjb3JkKG5vZGUpICYmICFub2RlLmlzU2luZ2xlO1xyXG5leHBvcnQgY29uc3QgaXNJbmRleCA9IG5vZGUgPT4gaXNTb21ldGhpbmcobm9kZSkgJiYgbm9kZS50eXBlID09PSAnaW5kZXgnO1xyXG5leHBvcnQgY29uc3QgaXNhZ2dyZWdhdGVHcm91cCA9IG5vZGUgPT4gaXNTb21ldGhpbmcobm9kZSkgJiYgbm9kZS50eXBlID09PSAnYWdncmVnYXRlR3JvdXAnO1xyXG5leHBvcnQgY29uc3QgaXNTaGFyZGVkSW5kZXggPSBub2RlID0+IGlzSW5kZXgobm9kZSkgJiYgaXNOb25FbXB0eVN0cmluZyhub2RlLmdldFNoYXJkTmFtZSk7XHJcbmV4cG9ydCBjb25zdCBpc1Jvb3QgPSBub2RlID0+IGlzU29tZXRoaW5nKG5vZGUpICYmIG5vZGUuaXNSb290KCk7XHJcbmV4cG9ydCBjb25zdCBpc0RlY2VuZGFudE9mQVJlY29yZCA9IGhhc01hdGNoaW5nQW5jZXN0b3IoaXNSZWNvcmQpO1xyXG5leHBvcnQgY29uc3QgaXNHbG9iYWxJbmRleCA9IG5vZGUgPT4gaXNJbmRleChub2RlKSAmJiBpc1Jvb3Qobm9kZS5wYXJlbnQoKSk7XHJcbmV4cG9ydCBjb25zdCBpc1JlZmVyZW5jZUluZGV4ID0gbm9kZSA9PiBpc0luZGV4KG5vZGUpICYmIG5vZGUuaW5kZXhUeXBlID09PSBpbmRleFR5cGVzLnJlZmVyZW5jZTtcclxuZXhwb3J0IGNvbnN0IGlzQW5jZXN0b3JJbmRleCA9IG5vZGUgPT4gaXNJbmRleChub2RlKSAmJiBub2RlLmluZGV4VHlwZSA9PT0gaW5kZXhUeXBlcy5hbmNlc3RvcjtcclxuXHJcbmV4cG9ydCBjb25zdCBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlID0gbm9kZSA9PiBmaWVsZCA9PiBmaWVsZC50eXBlID09PSAncmVmZXJlbmNlJ1xyXG4gICAgJiYgaW50ZXJzZWN0aW9uKGZpZWxkLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzKShtYXAoaSA9PiBpLm5vZGVLZXkoKSkobm9kZS5pbmRleGVzKSlcclxuICAgICAgLmxlbmd0aCA+IDA7XHJcblxyXG5leHBvcnQgY29uc3QgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXggPSBpbmRleE5vZGUgPT4gZmllbGQgPT4gZmllbGQudHlwZSA9PT0gJ3JlZmVyZW5jZSdcclxuICAgICYmIGludGVyc2VjdGlvbihmaWVsZC50eXBlT3B0aW9ucy5yZXZlcnNlSW5kZXhOb2RlS2V5cykoW2luZGV4Tm9kZS5ub2RlS2V5KCldKVxyXG4gICAgICAubGVuZ3RoID4gMDtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBnZXRMYXN0UGFydEluS2V5LFxyXG4gIGdldE5vZGVzSW5QYXRoLFxyXG4gIGdldEV4YWN0Tm9kZUZvcktleSxcclxuICBoYXNNYXRjaGluZ0FuY2VzdG9yLFxyXG4gIGdldE5vZGUsXHJcbiAgZ2V0Tm9kZUJ5S2V5T3JOb2RlS2V5LFxyXG4gIGlzTm9kZSxcclxuICBnZXRBY3R1YWxLZXlPZlBhcmVudCxcclxuICBnZXRQYXJlbnRLZXksXHJcbiAgaXNLZXlBbmNlc3Rvck9mLFxyXG4gIGhhc05vTWF0Y2hpbmdBbmNlc3RvcnMsXHJcbiAgZmluZEZpZWxkLFxyXG4gIGlzQW5jZXN0b3IsXHJcbiAgaXNEZWNlbmRhbnQsXHJcbiAgZ2V0UmVjb3JkTm9kZUlkLFxyXG4gIGdldFJlY29yZE5vZGVJZEZyb21JZCxcclxuICBnZXRSZWNvcmROb2RlQnlJZCxcclxuICByZWNvcmROb2RlSWRJc0FsbG93ZWQsXHJcbiAgcmVjb3JkTm9kZUlzQWxsb3dlZCxcclxuICBnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleCxcclxuICBnZXROb2RlRnJvbU5vZGVLZXlIYXNoLFxyXG4gIGlzUmVjb3JkLFxyXG4gIGlzQ29sbGVjdGlvblJlY29yZCxcclxuICBpc0luZGV4LFxyXG4gIGlzYWdncmVnYXRlR3JvdXAsXHJcbiAgaXNTaGFyZGVkSW5kZXgsXHJcbiAgaXNSb290LFxyXG4gIGlzRGVjZW5kYW50T2ZBUmVjb3JkLFxyXG4gIGlzR2xvYmFsSW5kZXgsXHJcbiAgaXNSZWZlcmVuY2VJbmRleCxcclxuICBpc0FuY2VzdG9ySW5kZXgsXHJcbiAgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvTm9kZSxcclxuICBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleCxcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbn07XHJcbiIsImltcG9ydCB7IG1lcmdlIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7XG4gIGNvbnN0YW50LCBpc1VuZGVmaW5lZCwgaGFzLFxuICBtYXBWYWx1ZXMsIGNsb25lRGVlcCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGlzTm90RW1wdHkgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZ2V0U2FmZUZpZWxkUGFyc2VyID0gKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpID0+IChmaWVsZCwgcmVjb3JkKSA9PiB7XG4gIGlmIChoYXMoZmllbGQubmFtZSkocmVjb3JkKSkge1xuICAgIHJldHVybiBnZXRTYWZlVmFsdWVQYXJzZXIodHJ5UGFyc2UsIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucykocmVjb3JkW2ZpZWxkLm5hbWVdKTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZhbHVlRnVuY3Rpb25zW2ZpZWxkLmdldFVuZGVmaW5lZFZhbHVlXSgpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFNhZmVWYWx1ZVBhcnNlciA9ICh0cnlQYXJzZSwgZGVmYXVsdFZhbHVlRnVuY3Rpb25zKSA9PiAodmFsdWUpID0+IHtcbiAgY29uc3QgcGFyc2VkID0gdHJ5UGFyc2UodmFsdWUpO1xuICBpZiAocGFyc2VkLnN1Y2Nlc3MpIHtcbiAgICByZXR1cm4gcGFyc2VkLnZhbHVlO1xuICB9XG4gIHJldHVybiBkZWZhdWx0VmFsdWVGdW5jdGlvbnMuZGVmYXVsdCgpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld1ZhbHVlID0gKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpID0+IChmaWVsZCkgPT4ge1xuICBjb25zdCBnZXRJbml0aWFsVmFsdWUgPSBpc1VuZGVmaW5lZChmaWVsZCkgfHwgaXNVbmRlZmluZWQoZmllbGQuZ2V0SW5pdGlhbFZhbHVlKVxuICAgID8gJ2RlZmF1bHQnXG4gICAgOiBmaWVsZC5nZXRJbml0aWFsVmFsdWU7XG5cbiAgcmV0dXJuIGhhcyhnZXRJbml0aWFsVmFsdWUpKGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucylcbiAgICA/IGRlZmF1bHRWYWx1ZUZ1bmN0aW9uc1tnZXRJbml0aWFsVmFsdWVdKClcbiAgICA6IGdldFNhZmVWYWx1ZVBhcnNlcih0cnlQYXJzZSwgZGVmYXVsdFZhbHVlRnVuY3Rpb25zKShnZXRJbml0aWFsVmFsdWUpO1xufTtcblxuZXhwb3J0IGNvbnN0IHR5cGVGdW5jdGlvbnMgPSBzcGVjaWZpY0Z1bmN0aW9ucyA9PiBtZXJnZSh7XG4gIHZhbHVlOiBjb25zdGFudCxcbiAgbnVsbDogY29uc3RhbnQobnVsbCksXG59LCBzcGVjaWZpY0Z1bmN0aW9ucyk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyA9IHZhbGlkYXRpb25SdWxlcyA9PiBhc3luYyAoZmllbGQsIHJlY29yZCwgY29udGV4dCkgPT4ge1xuICBjb25zdCBmaWVsZFZhbHVlID0gcmVjb3JkW2ZpZWxkLm5hbWVdO1xuICBjb25zdCB2YWxpZGF0ZVJ1bGUgPSBhc3luYyByID0+ICghYXdhaXQgci5pc1ZhbGlkKGZpZWxkVmFsdWUsIGZpZWxkLnR5cGVPcHRpb25zLCBjb250ZXh0KVxuICAgID8gci5nZXRNZXNzYWdlKGZpZWxkVmFsdWUsIGZpZWxkLnR5cGVPcHRpb25zKVxuICAgIDogJycpO1xuXG4gIGNvbnN0IGVycm9ycyA9IFtdO1xuICBmb3IgKGNvbnN0IHIgb2YgdmFsaWRhdGlvblJ1bGVzKSB7XG4gICAgY29uc3QgZXJyID0gYXdhaXQgdmFsaWRhdGVSdWxlKHIpO1xuICAgIGlmIChpc05vdEVtcHR5KGVycikpIGVycm9ycy5wdXNoKGVycik7XG4gIH1cblxuICByZXR1cm4gZXJyb3JzO1xufTtcblxuY29uc3QgZ2V0RGVmYXVsdE9wdGlvbnMgPSBtYXBWYWx1ZXModiA9PiB2LmRlZmF1bHRWYWx1ZSk7XG5cbmV4cG9ydCBjb25zdCBtYWtlcnVsZSA9IChpc1ZhbGlkLCBnZXRNZXNzYWdlKSA9PiAoeyBpc1ZhbGlkLCBnZXRNZXNzYWdlIH0pO1xuZXhwb3J0IGNvbnN0IHBhcnNlZEZhaWxlZCA9IHZhbCA9PiAoeyBzdWNjZXNzOiBmYWxzZSwgdmFsdWU6IHZhbCB9KTtcbmV4cG9ydCBjb25zdCBwYXJzZWRTdWNjZXNzID0gdmFsID0+ICh7IHN1Y2Nlc3M6IHRydWUsIHZhbHVlOiB2YWwgfSk7XG5leHBvcnQgY29uc3QgZ2V0RGVmYXVsdEV4cG9ydCA9IChuYW1lLCB0cnlQYXJzZSwgZnVuY3Rpb25zLCBvcHRpb25zLCB2YWxpZGF0aW9uUnVsZXMsIHNhbXBsZVZhbHVlLCBzdHJpbmdpZnkpID0+ICh7XG4gIGdldE5ldzogZ2V0TmV3VmFsdWUodHJ5UGFyc2UsIGZ1bmN0aW9ucyksXG4gIHNhZmVQYXJzZUZpZWxkOiBnZXRTYWZlRmllbGRQYXJzZXIodHJ5UGFyc2UsIGZ1bmN0aW9ucyksXG4gIHNhZmVQYXJzZVZhbHVlOiBnZXRTYWZlVmFsdWVQYXJzZXIodHJ5UGFyc2UsIGZ1bmN0aW9ucyksXG4gIHRyeVBhcnNlLFxuICBuYW1lLFxuICBnZXREZWZhdWx0T3B0aW9uczogKCkgPT4gZ2V0RGVmYXVsdE9wdGlvbnMoY2xvbmVEZWVwKG9wdGlvbnMpKSxcbiAgb3B0aW9uRGVmaW5pdGlvbnM6IG9wdGlvbnMsXG4gIHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzOiB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyh2YWxpZGF0aW9uUnVsZXMpLFxuICBzYW1wbGVWYWx1ZSxcbiAgc3RyaW5naWZ5OiB2YWwgPT4gKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZFxuICAgID8gJycgOiBzdHJpbmdpZnkodmFsKSksXG4gIGdldERlZmF1bHRWYWx1ZTogZnVuY3Rpb25zLmRlZmF1bHQsXG59KTtcbiIsImltcG9ydCB7XG4gIGNvbnN0YW50LCBpc1N0cmluZyxcbiAgaXNOdWxsLCBpbmNsdWRlcywgaXNCb29sZWFuLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgdHlwZUZ1bmN0aW9ucyxcbiAgbWFrZXJ1bGUsIHBhcnNlZFN1Y2Nlc3MsIGdldERlZmF1bHRFeHBvcnQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIHRvQm9vbE9yTnVsbCwgdG9OdW1iZXJPck51bGwsXG4gIGlzU2FmZUludGVnZXIsIGlzQXJyYXlPZlN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3Qgc3RyaW5nRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XG4gIGRlZmF1bHQ6IGNvbnN0YW50KG51bGwpLFxufSk7XG5cbmNvbnN0IHN0cmluZ1RyeVBhcnNlID0gc3dpdGNoQ2FzZShcbiAgW2lzU3RyaW5nLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXG4gIFtkZWZhdWx0Q2FzZSwgdiA9PiBwYXJzZWRTdWNjZXNzKHYudG9TdHJpbmcoKSldLFxuKTtcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgbWF4TGVuZ3RoOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICAgIGlzVmFsaWQ6IG4gPT4gbiA9PT0gbnVsbCB8fCBpc1NhZmVJbnRlZ2VyKG4pICYmIG4gPiAwLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtYXggbGVuZ3RoIG11c3QgYmUgbnVsbCAobm8gbGltaXQpIG9yIGEgZ3JlYXRlciB0aGFuIHplcm8gaW50ZWdlcicsXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxuICB9LFxuICB2YWx1ZXM6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgaXNWYWxpZDogdiA9PiB2ID09PSBudWxsIHx8IChpc0FycmF5T2ZTdHJpbmcodikgJiYgdi5sZW5ndGggPiAwICYmIHYubGVuZ3RoIDwgMTAwMDApLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246IFwiJ3ZhbHVlcycgbXVzdCBiZSBudWxsIChubyB2YWx1ZXMpIG9yIGFuIGFycnkgb2YgYXQgbGVhc3Qgb25lIHN0cmluZ1wiLFxuICAgIHBhcnNlOiBzID0+IHMsXG4gIH0sXG4gIGFsbG93RGVjbGFyZWRWYWx1ZXNPbmx5OiB7XG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICBpc1ZhbGlkOiBpc0Jvb2xlYW4sXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ2FsbG93RGVjbGFyZWRWYWx1ZXNPbmx5IG11c3QgYmUgdHJ1ZSBvciBmYWxzZScsXG4gICAgcGFyc2U6IHRvQm9vbE9yTnVsbCxcbiAgfSxcbn07XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWF4TGVuZ3RoID09PSBudWxsIHx8IHZhbC5sZW5ndGggPD0gb3B0cy5tYXhMZW5ndGgsXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlIGV4Y2VlZHMgbWF4aW11bSBsZW5ndGggb2YgJHtvcHRzLm1heExlbmd0aH1gKSxcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBvcHRzLmFsbG93RGVjbGFyZWRWYWx1ZXNPbmx5ID09PSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgaW5jbHVkZXModmFsKShvcHRzLnZhbHVlcyksXG4gICh2YWwpID0+IGBcIiR7dmFsfVwiIGRvZXMgbm90IGV4aXN0IGluIHRoZSBsaXN0IG9mIGFsbG93ZWQgdmFsdWVzYCksXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxuICAnc3RyaW5nJyxcbiAgc3RyaW5nVHJ5UGFyc2UsXG4gIHN0cmluZ0Z1bmN0aW9ucyxcbiAgb3B0aW9ucyxcbiAgdHlwZUNvbnN0cmFpbnRzLFxuICAnYWJjZGUnLFxuICBzdHIgPT4gc3RyLFxuKTtcbiIsImltcG9ydCB7IGNvbnN0YW50LCBpc0Jvb2xlYW4sIGlzTnVsbCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICB0eXBlRnVuY3Rpb25zLFxuICBtYWtlcnVsZSwgcGFyc2VkRmFpbGVkLCBwYXJzZWRTdWNjZXNzLFxuICBnZXREZWZhdWx0RXhwb3J0LFxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLCBpc09uZU9mLCB0b0Jvb2xPck51bGwsXG59IGZyb20gJy4uL2NvbW1vbic7XG5cbmNvbnN0IGJvb2xGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogY29uc3RhbnQobnVsbCksXG59KTtcblxuY29uc3QgYm9vbFRyeVBhcnNlID0gc3dpdGNoQ2FzZShcbiAgW2lzQm9vbGVhbiwgcGFyc2VkU3VjY2Vzc10sXG4gIFtpc051bGwsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNPbmVPZigndHJ1ZScsICcxJywgJ3llcycsICdvbicpLCAoKSA9PiBwYXJzZWRTdWNjZXNzKHRydWUpXSxcbiAgW2lzT25lT2YoJ2ZhbHNlJywgJzAnLCAnbm8nLCAnb2ZmJyksICgpID0+IHBhcnNlZFN1Y2Nlc3MoZmFsc2UpXSxcbiAgW2RlZmF1bHRDYXNlLCBwYXJzZWRGYWlsZWRdLFxuKTtcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgYWxsb3dOdWxsczoge1xuICAgIGRlZmF1bHRWYWx1ZTogdHJ1ZSxcbiAgICBpc1ZhbGlkOiBpc0Jvb2xlYW4sXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB0cnVlIG9yIGZhbHNlJyxcbiAgICBwYXJzZTogdG9Cb29sT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiBvcHRzLmFsbG93TnVsbHMgPT09IHRydWUgfHwgdmFsICE9PSBudWxsLFxuICAgICgpID0+ICdmaWVsZCBjYW5ub3QgYmUgbnVsbCcpLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcbiAgJ2Jvb2wnLCBib29sVHJ5UGFyc2UsIGJvb2xGdW5jdGlvbnMsXG4gIG9wdGlvbnMsIHR5cGVDb25zdHJhaW50cywgdHJ1ZSwgSlNPTi5zdHJpbmdpZnksXG4pO1xuIiwiaW1wb3J0IHtcbiAgY29uc3RhbnQsIGlzTnVtYmVyLCBpc1N0cmluZywgaXNOdWxsLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgbWFrZXJ1bGUsIHR5cGVGdW5jdGlvbnMsXG4gIHBhcnNlZEZhaWxlZCwgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9OdW1iZXJPck51bGwsXG4gIGlzU2FmZUludGVnZXIsXG59IGZyb20gJy4uL2NvbW1vbic7XG5cbmNvbnN0IG51bWJlckZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBjb25zdGFudChudWxsKSxcbn0pO1xuXG5jb25zdCBwYXJzZVN0cmluZ3RvTnVtYmVyT3JOdWxsID0gKHMpID0+IHtcbiAgY29uc3QgbnVtID0gTnVtYmVyKHMpO1xuICByZXR1cm4gaXNOYU4obnVtKSA/IHBhcnNlZEZhaWxlZChzKSA6IHBhcnNlZFN1Y2Nlc3MobnVtKTtcbn07XG5cbmNvbnN0IG51bWJlclRyeVBhcnNlID0gc3dpdGNoQ2FzZShcbiAgW2lzTnVtYmVyLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzU3RyaW5nLCBwYXJzZVN0cmluZ3RvTnVtYmVyT3JOdWxsXSxcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbik7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIG1heFZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUixcbiAgICBpc1ZhbGlkOiBpc1NhZmVJbnRlZ2VyLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgdmFsaWQgaW50ZWdlcicsXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxuICB9LFxuICBtaW5WYWx1ZToge1xuICAgIGRlZmF1bHRWYWx1ZTogMCAtIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICAgIGlzVmFsaWQ6IGlzU2FmZUludGVnZXIsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB2YWxpZCBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG4gIGRlY2ltYWxQbGFjZXM6IHtcbiAgICBkZWZhdWx0VmFsdWU6IDAsXG4gICAgaXNWYWxpZDogbiA9PiBpc1NhZmVJbnRlZ2VyKG4pICYmIG4gPj0gMCxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXInLFxuICAgIHBhcnNlOiB0b051bWJlck9yTnVsbCxcbiAgfSxcbn07XG5cbmNvbnN0IGdldERlY2ltYWxQbGFjZXMgPSAodmFsKSA9PiB7XG4gIGNvbnN0IHNwbGl0RGVjaW1hbCA9IHZhbC50b1N0cmluZygpLnNwbGl0KCcuJyk7XG4gIGlmIChzcGxpdERlY2ltYWwubGVuZ3RoID09PSAxKSByZXR1cm4gMDtcbiAgcmV0dXJuIHNwbGl0RGVjaW1hbFsxXS5sZW5ndGg7XG59O1xuXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCBvcHRzLm1pblZhbHVlID09PSBudWxsIHx8IHZhbCA+PSBvcHRzLm1pblZhbHVlLFxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSAoJHt2YWwudG9TdHJpbmcoKX0pIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvICR7b3B0cy5taW5WYWx1ZX1gKSxcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWF4VmFsdWUgPT09IG51bGwgfHwgdmFsIDw9IG9wdHMubWF4VmFsdWUsXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlICgke3ZhbC50b1N0cmluZygpfSkgbXVzdCBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gJHtvcHRzLm1pblZhbHVlfSBvcHRpb25zYCksXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCBvcHRzLmRlY2ltYWxQbGFjZXMgPj0gZ2V0RGVjaW1hbFBsYWNlcyh2YWwpLFxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSAoJHt2YWwudG9TdHJpbmcoKX0pIG11c3QgaGF2ZSAke29wdHMuZGVjaW1hbFBsYWNlc30gZGVjaW1hbCBwbGFjZXMgb3IgbGVzc2ApLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcbiAgJ251bWJlcicsXG4gIG51bWJlclRyeVBhcnNlLFxuICBudW1iZXJGdW5jdGlvbnMsXG4gIG9wdGlvbnMsXG4gIHR5cGVDb25zdHJhaW50cyxcbiAgMSxcbiAgbnVtID0+IG51bS50b1N0cmluZygpLFxuKTtcbiIsImltcG9ydCB7XG4gIGNvbnN0YW50LCBpc0RhdGUsIGlzU3RyaW5nLCBpc051bGxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIG1ha2VydWxlLCB0eXBlRnVuY3Rpb25zLFxuICBwYXJzZWRGYWlsZWQsIHBhcnNlZFN1Y2Nlc3MsIGdldERlZmF1bHRFeHBvcnQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIHRvRGF0ZU9yTnVsbCxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgZGF0ZUZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBjb25zdGFudChudWxsKSxcbiAgbm93OiAoKSA9PiBuZXcgRGF0ZSgpLFxufSk7XG5cbmNvbnN0IGlzVmFsaWREYXRlID0gZCA9PiBkIGluc3RhbmNlb2YgRGF0ZSAmJiAhaXNOYU4oZCk7XG5cbmNvbnN0IHBhcnNlU3RyaW5nVG9EYXRlID0gcyA9PiBzd2l0Y2hDYXNlKFxuICBbaXNWYWxpZERhdGUsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pKG5ldyBEYXRlKHMpKTtcblxuXG5jb25zdCBkYXRlVHJ5UGFyc2UgPSBzd2l0Y2hDYXNlKFxuICBbaXNEYXRlLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzU3RyaW5nLCBwYXJzZVN0cmluZ1RvRGF0ZV0sXG4gIFtpc051bGwsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBtYXhWYWx1ZToge1xuICAgIGRlZmF1bHRWYWx1ZTogbmV3IERhdGUoMzI1MDM2ODAwMDAwMDApLFxuICAgIGlzVmFsaWQ6IGlzRGF0ZSxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHZhbGlkIGRhdGUnLFxuICAgIHBhcnNlOiB0b0RhdGVPck51bGwsXG4gIH0sXG4gIG1pblZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBuZXcgRGF0ZSgtODUyMDMzNjAwMDAwMCksXG4gICAgaXNWYWxpZDogaXNEYXRlLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgdmFsaWQgZGF0ZScsXG4gICAgcGFyc2U6IHRvRGF0ZU9yTnVsbCxcbiAgfSxcbn07XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWluVmFsdWUgPT09IG51bGwgfHwgdmFsID49IG9wdHMubWluVmFsdWUsXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlICgke3ZhbC50b1N0cmluZygpfSkgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtvcHRzLm1pblZhbHVlfWApLFxuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5tYXhWYWx1ZSA9PT0gbnVsbCB8fCB2YWwgPD0gb3B0cy5tYXhWYWx1ZSxcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgKCR7dmFsLnRvU3RyaW5nKCl9KSBtdXN0IGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke29wdHMubWluVmFsdWV9IG9wdGlvbnNgKSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXG4gICdkYXRldGltZScsXG4gIGRhdGVUcnlQYXJzZSxcbiAgZGF0ZUZ1bmN0aW9ucyxcbiAgb3B0aW9ucyxcbiAgdHlwZUNvbnN0cmFpbnRzLFxuICBuZXcgRGF0ZSgxOTg0LCA0LCAxKSxcbiAgZGF0ZSA9PiBKU09OLnN0cmluZ2lmeShkYXRlKS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1wiJywgJ2cnKSwgJycpLFxuKTtcbiIsImltcG9ydCB7IFxuICBtYXAsICBjb25zdGFudCwgaXNBcnJheSBcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIHR5cGVGdW5jdGlvbnMsIG1ha2VydWxlLFxuICBwYXJzZWRGYWlsZWQsIGdldERlZmF1bHRFeHBvcnQsIHBhcnNlZFN1Y2Nlc3MsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIHRvTnVtYmVyT3JOdWxsLFxuICAkJCwgaXNTYWZlSW50ZWdlcixcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgYXJyYXlGdW5jdGlvbnMgPSAoKSA9PiB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogY29uc3RhbnQoW10pLFxufSk7XG5cbmNvbnN0IG1hcFRvUGFyc2VkQXJyYXJ5ID0gdHlwZSA9PiAkJChcbiAgbWFwKGkgPT4gdHlwZS5zYWZlUGFyc2VWYWx1ZShpKSksXG4gIHBhcnNlZFN1Y2Nlc3MsXG4pO1xuXG5jb25zdCBhcnJheVRyeVBhcnNlID0gdHlwZSA9PiBzd2l0Y2hDYXNlKFxuICBbaXNBcnJheSwgbWFwVG9QYXJzZWRBcnJhcnkodHlwZSldLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pO1xuXG5jb25zdCB0eXBlTmFtZSA9IHR5cGUgPT4gYGFycmF5PCR7dHlwZX0+YDtcblxuXG5jb25zdCBvcHRpb25zID0ge1xuICBtYXhMZW5ndGg6IHtcbiAgICBkZWZhdWx0VmFsdWU6IDEwMDAwLFxuICAgIGlzVmFsaWQ6IGlzU2FmZUludGVnZXIsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG4gIG1pbkxlbmd0aDoge1xuICAgIGRlZmF1bHRWYWx1ZTogMCxcbiAgICBpc1ZhbGlkOiBuID0+IGlzU2FmZUludGVnZXIobikgJiYgbiA+PSAwLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlcicsXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgdmFsLmxlbmd0aCA+PSBvcHRzLm1pbkxlbmd0aCxcbiAgICAodmFsLCBvcHRzKSA9PiBgbXVzdCBjaG9vc2UgJHtvcHRzLm1pbkxlbmd0aH0gb3IgbW9yZSBvcHRpb25zYCksXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCB2YWwubGVuZ3RoIDw9IG9wdHMubWF4TGVuZ3RoLFxuICAgICh2YWwsIG9wdHMpID0+IGBjYW5ub3QgY2hvb3NlIG1vcmUgdGhhbiAke29wdHMubWF4TGVuZ3RofSBvcHRpb25zYCksXG5dO1xuXG5leHBvcnQgZGVmYXVsdCB0eXBlID0+IGdldERlZmF1bHRFeHBvcnQoXG4gIHR5cGVOYW1lKHR5cGUubmFtZSksXG4gIGFycmF5VHJ5UGFyc2UodHlwZSksXG4gIGFycmF5RnVuY3Rpb25zKHR5cGUpLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gIFt0eXBlLnNhbXBsZVZhbHVlXSxcbiAgSlNPTi5zdHJpbmdpZnksXG4pO1xuIiwiaW1wb3J0IHtcbiAgaXNTdHJpbmcsIGlzT2JqZWN0TGlrZSxcbiAgaXNOdWxsLCBoYXMsIGlzRW1wdHksXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICB0eXBlRnVuY3Rpb25zLCBtYWtlcnVsZSxcbiAgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcbiAgcGFyc2VkRmFpbGVkLFxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLFxuICBpc05vbkVtcHR5U3RyaW5nLCBpc0FycmF5T2ZTdHJpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5cbmNvbnN0IHJlZmVyZW5jZU5vdGhpbmcgPSAoKSA9PiAoeyBrZXk6ICcnIH0pO1xuXG5jb25zdCByZWZlcmVuY2VGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogcmVmZXJlbmNlTm90aGluZyxcbn0pO1xuXG5jb25zdCBoYXNTdHJpbmdWYWx1ZSA9IChvYiwgcGF0aCkgPT4gaGFzKHBhdGgpKG9iKVxuICAgICYmIGlzU3RyaW5nKG9iW3BhdGhdKTtcblxuY29uc3QgaXNPYmplY3RXaXRoS2V5ID0gdiA9PiBpc09iamVjdExpa2UodilcbiAgICAmJiBoYXNTdHJpbmdWYWx1ZSh2LCAna2V5Jyk7XG5cbmNvbnN0IHRyeVBhcnNlRnJvbVN0cmluZyA9IHMgPT4ge1xuXG4gIHRyeSB7XG4gICAgY29uc3QgYXNPYmogPSBKU09OLnBhcnNlKHMpO1xuICAgIGlmKGlzT2JqZWN0V2l0aEtleSkge1xuICAgICAgcmV0dXJuIHBhcnNlZFN1Y2Nlc3MoYXNPYmopO1xuICAgIH1cbiAgfVxuICBjYXRjaChfKSB7XG4gICAgLy8gRU1QVFlcbiAgfVxuXG4gIHJldHVybiBwYXJzZWRGYWlsZWQocyk7XG59XG5cbmNvbnN0IHJlZmVyZW5jZVRyeVBhcnNlID0gdiA9PiBzd2l0Y2hDYXNlKFxuICBbaXNPYmplY3RXaXRoS2V5LCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzU3RyaW5nLCB0cnlQYXJzZUZyb21TdHJpbmddLFxuICBbaXNOdWxsLCAoKSA9PiBwYXJzZWRTdWNjZXNzKHJlZmVyZW5jZU5vdGhpbmcoKSldLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pKHYpO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBpbmRleE5vZGVLZXk6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgaXNWYWxpZDogaXNOb25FbXB0eVN0cmluZyxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnLFxuICAgIHBhcnNlOiBzID0+IHMsXG4gIH0sXG4gIGRpc3BsYXlWYWx1ZToge1xuICAgIGRlZmF1bHRWYWx1ZTogJycsXG4gICAgaXNWYWxpZDogaXNOb25FbXB0eVN0cmluZyxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnLFxuICAgIHBhcnNlOiBzID0+IHMsXG4gIH0sXG4gIHJldmVyc2VJbmRleE5vZGVLZXlzOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICAgIGlzVmFsaWQ6IHYgPT4gaXNBcnJheU9mU3RyaW5nKHYpICYmIHYubGVuZ3RoID4gMCxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIG5vbi1lbXB0eSBhcnJheSBvZiBzdHJpbmdzJyxcbiAgICBwYXJzZTogcyA9PiBzLFxuICB9LFxufTtcblxuY29uc3QgaXNFbXB0eVN0cmluZyA9IHMgPT4gaXNTdHJpbmcocykgJiYgaXNFbXB0eShzKTtcblxuY29uc3QgZW5zdXJlUmVmZXJlbmNlRXhpc3RzID0gYXN5bmMgKHZhbCwgb3B0cywgY29udGV4dCkgPT4gaXNFbXB0eVN0cmluZyh2YWwua2V5KVxuICAgIHx8IGF3YWl0IGNvbnRleHQucmVmZXJlbmNlRXhpc3RzKG9wdHMsIHZhbC5rZXkpO1xuXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXG4gIG1ha2VydWxlKFxuICAgIGVuc3VyZVJlZmVyZW5jZUV4aXN0cyxcbiAgICAodmFsLCBvcHRzKSA9PiBgXCIke3ZhbFtvcHRzLmRpc3BsYXlWYWx1ZV19XCIgZG9lcyBub3QgZXhpc3QgaW4gb3B0aW9ucyBsaXN0IChrZXk6ICR7dmFsLmtleX0pYCxcbiAgKSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXG4gICdyZWZlcmVuY2UnLFxuICByZWZlcmVuY2VUcnlQYXJzZSxcbiAgcmVmZXJlbmNlRnVuY3Rpb25zLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gIHsga2V5OiAna2V5JywgdmFsdWU6ICd2YWx1ZScgfSxcbiAgSlNPTi5zdHJpbmdpZnksXG4pO1xuIiwiaW1wb3J0IHtcbiAgbGFzdCwgaGFzLCBpc1N0cmluZywgaW50ZXJzZWN0aW9uLFxuICBpc051bGwsIGlzTnVtYmVyLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgdHlwZUZ1bmN0aW9ucywgcGFyc2VkRmFpbGVkLFxuICBwYXJzZWRTdWNjZXNzLCBnZXREZWZhdWx0RXhwb3J0LFxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLCBub25lLFxuICAkLCBzcGxpdEtleSxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgaWxsZWdhbENoYXJhY3RlcnMgPSAnKj9cXFxcLzo8PnxcXDBcXGJcXGZcXHYnO1xuXG5leHBvcnQgY29uc3QgaXNMZWdhbEZpbGVuYW1lID0gKGZpbGVQYXRoKSA9PiB7XG4gIGNvbnN0IGZuID0gZmlsZU5hbWUoZmlsZVBhdGgpO1xuICByZXR1cm4gZm4ubGVuZ3RoIDw9IDI1NVxuICAgICYmIGludGVyc2VjdGlvbihmbi5zcGxpdCgnJykpKGlsbGVnYWxDaGFyYWN0ZXJzLnNwbGl0KCcnKSkubGVuZ3RoID09PSAwXG4gICAgJiYgbm9uZShmID0+IGYgPT09ICcuLicpKHNwbGl0S2V5KGZpbGVQYXRoKSk7XG59O1xuXG5jb25zdCBmaWxlTm90aGluZyA9ICgpID0+ICh7IHJlbGF0aXZlUGF0aDogJycsIHNpemU6IDAgfSk7XG5cbmNvbnN0IGZpbGVGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogZmlsZU5vdGhpbmcsXG59KTtcblxuY29uc3QgZmlsZVRyeVBhcnNlID0gdiA9PiBzd2l0Y2hDYXNlKFxuICBbaXNWYWxpZEZpbGUsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNOdWxsLCAoKSA9PiBwYXJzZWRTdWNjZXNzKGZpbGVOb3RoaW5nKCkpXSxcbiAgW2RlZmF1bHRDYXNlLCBwYXJzZWRGYWlsZWRdLFxuKSh2KTtcblxuY29uc3QgZmlsZU5hbWUgPSBmaWxlUGF0aCA9PiAkKGZpbGVQYXRoLCBbXG4gIHNwbGl0S2V5LFxuICBsYXN0LFxuXSk7XG5cbmNvbnN0IGlzVmFsaWRGaWxlID0gZiA9PiAhaXNOdWxsKGYpXG4gICAgJiYgaGFzKCdyZWxhdGl2ZVBhdGgnKShmKSAmJiBoYXMoJ3NpemUnKShmKVxuICAgICYmIGlzTnVtYmVyKGYuc2l6ZSlcbiAgICAmJiBpc1N0cmluZyhmLnJlbGF0aXZlUGF0aClcbiAgICAmJiBpc0xlZ2FsRmlsZW5hbWUoZi5yZWxhdGl2ZVBhdGgpO1xuXG5jb25zdCBvcHRpb25zID0ge307XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtdO1xuXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxuICAnZmlsZScsXG4gIGZpbGVUcnlQYXJzZSxcbiAgZmlsZUZ1bmN0aW9ucyxcbiAgb3B0aW9ucyxcbiAgdHlwZUNvbnN0cmFpbnRzLFxuICB7IHJlbGF0aXZlUGF0aDogJ3NvbWVfZmlsZS5qcGcnLCBzaXplOiAxMDAwIH0sXG4gIEpTT04uc3RyaW5naWZ5LFxuKTtcbiIsImltcG9ydCB7XG4gIGFzc2lnbiwgbWVyZ2UsIFxufSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgbWFwLCBpc1N0cmluZywgaXNOdW1iZXIsXG4gIGlzQm9vbGVhbiwgaXNEYXRlLCBrZXlzLFxuICBpc09iamVjdCwgaXNBcnJheSwgaGFzXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBhcnNlZFN1Y2Nlc3MgfSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCBzdHJpbmcgZnJvbSAnLi9zdHJpbmcnO1xuaW1wb3J0IGJvb2wgZnJvbSAnLi9ib29sJztcbmltcG9ydCBudW1iZXIgZnJvbSAnLi9udW1iZXInO1xuaW1wb3J0IGRhdGV0aW1lIGZyb20gJy4vZGF0ZXRpbWUnO1xuaW1wb3J0IGFycmF5IGZyb20gJy4vYXJyYXknO1xuaW1wb3J0IHJlZmVyZW5jZSBmcm9tICcuL3JlZmVyZW5jZSc7XG5pbXBvcnQgZmlsZSBmcm9tICcuL2ZpbGUnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmNvbnN0IGFsbFR5cGVzID0gKCkgPT4ge1xuICBjb25zdCBiYXNpY1R5cGVzID0ge1xuICAgIHN0cmluZywgbnVtYmVyLCBkYXRldGltZSwgYm9vbCwgcmVmZXJlbmNlLCBmaWxlLFxuICB9O1xuXG4gIGNvbnN0IGFycmF5cyA9ICQoYmFzaWNUeXBlcywgW1xuICAgIGtleXMsXG4gICAgbWFwKChrKSA9PiB7XG4gICAgICBjb25zdCBrdlR5cGUgPSB7fTtcbiAgICAgIGNvbnN0IGNvbmNyZXRlQXJyYXkgPSBhcnJheShiYXNpY1R5cGVzW2tdKTtcbiAgICAgIGt2VHlwZVtjb25jcmV0ZUFycmF5Lm5hbWVdID0gY29uY3JldGVBcnJheTtcbiAgICAgIHJldHVybiBrdlR5cGU7XG4gICAgfSksXG4gICAgdHlwZXMgPT4gYXNzaWduKHt9LCAuLi50eXBlcyksXG4gIF0pO1xuXG4gIHJldHVybiBtZXJnZSh7fSwgYmFzaWNUeXBlcywgYXJyYXlzKTtcbn07XG5cblxuZXhwb3J0IGNvbnN0IGFsbCA9IGFsbFR5cGVzKCk7XG5cbmV4cG9ydCBjb25zdCBnZXRUeXBlID0gKHR5cGVOYW1lKSA9PiB7XG4gIGlmICghaGFzKHR5cGVOYW1lKShhbGwpKSB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBEbyBub3QgcmVjb2duaXNlIHR5cGUgJHt0eXBlTmFtZX1gKTtcbiAgcmV0dXJuIGFsbFt0eXBlTmFtZV07XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U2FtcGxlRmllbGRWYWx1ZSA9IGZpZWxkID0+IGdldFR5cGUoZmllbGQudHlwZSkuc2FtcGxlVmFsdWU7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdGaWVsZFZhbHVlID0gZmllbGQgPT4gZ2V0VHlwZShmaWVsZC50eXBlKS5nZXROZXcoZmllbGQpO1xuXG5leHBvcnQgY29uc3Qgc2FmZVBhcnNlRmllbGQgPSAoZmllbGQsIHJlY29yZCkgPT4gZ2V0VHlwZShmaWVsZC50eXBlKS5zYWZlUGFyc2VGaWVsZChmaWVsZCwgcmVjb3JkKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlRmllbGRQYXJzZSA9IChmaWVsZCwgcmVjb3JkKSA9PiAoaGFzKGZpZWxkLm5hbWUpKHJlY29yZClcbiAgPyBnZXRUeXBlKGZpZWxkLnR5cGUpLnRyeVBhcnNlKHJlY29yZFtmaWVsZC5uYW1lXSlcbiAgOiBwYXJzZWRTdWNjZXNzKHVuZGVmaW5lZCkpOyAvLyBmaWVsZHMgbWF5IGJlIHVuZGVmaW5lZCBieSBkZWZhdWx0XG5cbmV4cG9ydCBjb25zdCBnZXREZWZhdWx0T3B0aW9ucyA9IHR5cGUgPT4gZ2V0VHlwZSh0eXBlKS5nZXREZWZhdWx0T3B0aW9ucygpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVUeXBlQ29uc3RyYWludHMgPSBhc3luYyAoZmllbGQsIHJlY29yZCwgY29udGV4dCkgPT4gYXdhaXQgZ2V0VHlwZShmaWVsZC50eXBlKS52YWxpZGF0ZVR5cGVDb25zdHJhaW50cyhmaWVsZCwgcmVjb3JkLCBjb250ZXh0KTtcblxuZXhwb3J0IGNvbnN0IGRldGVjdFR5cGUgPSAodmFsdWUpID0+IHtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkgcmV0dXJuIHN0cmluZztcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpIHJldHVybiBib29sO1xuICBpZiAoaXNOdW1iZXIodmFsdWUpKSByZXR1cm4gbnVtYmVyO1xuICBpZiAoaXNEYXRlKHZhbHVlKSkgcmV0dXJuIGRhdGV0aW1lO1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHJldHVybiBhcnJheShkZXRlY3RUeXBlKHZhbHVlWzBdKSk7XG4gIGlmIChpc09iamVjdCh2YWx1ZSlcbiAgICAgICAmJiBoYXMoJ2tleScpKHZhbHVlKVxuICAgICAgICYmIGhhcygndmFsdWUnKSh2YWx1ZSkpIHJldHVybiByZWZlcmVuY2U7XG4gIGlmIChpc09iamVjdCh2YWx1ZSlcbiAgICAgICAgJiYgaGFzKCdyZWxhdGl2ZVBhdGgnKSh2YWx1ZSlcbiAgICAgICAgJiYgaGFzKCdzaXplJykodmFsdWUpKSByZXR1cm4gZmlsZTtcblxuICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBjYW5ub3QgZGV0ZXJtaW5lIHR5cGU6ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWApO1xufTtcbiIsImltcG9ydCB7IGNsb25lLCBmaW5kLCBzcGxpdCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBqb2luS2V5LCAkIH0gZnJvbSAnLi4vY29tbW9uJztcbi8vIDUgbWludXRlc1xuZXhwb3J0IGNvbnN0IHRlbXBDb2RlRXhwaXJ5TGVuZ3RoID0gNSAqIDYwICogMTAwMDtcblxuZXhwb3J0IGNvbnN0IEFVVEhfRk9MREVSID0gJy8uYXV0aCc7XG5leHBvcnQgY29uc3QgVVNFUlNfTElTVF9GSUxFID0gam9pbktleShBVVRIX0ZPTERFUiwgJ3VzZXJzLmpzb24nKTtcbmV4cG9ydCBjb25zdCB1c2VyQXV0aEZpbGUgPSB1c2VybmFtZSA9PiBqb2luS2V5KEFVVEhfRk9MREVSLCBgYXV0aF8ke3VzZXJuYW1lfS5qc29uYCk7XG5leHBvcnQgY29uc3QgVVNFUlNfTE9DS19GSUxFID0gam9pbktleShBVVRIX0ZPTERFUiwgJ3VzZXJzX2xvY2snKTtcbmV4cG9ydCBjb25zdCBBQ0NFU1NfTEVWRUxTX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAnYWNjZXNzX2xldmVscy5qc29uJyk7XG5leHBvcnQgY29uc3QgQUNDRVNTX0xFVkVMU19MT0NLX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAnYWNjZXNzX2xldmVsc19sb2NrJyk7XG5cbmV4cG9ydCBjb25zdCBwZXJtaXNzaW9uVHlwZXMgPSB7XG4gIENSRUFURV9SRUNPUkQ6ICdjcmVhdGUgcmVjb3JkJyxcbiAgVVBEQVRFX1JFQ09SRDogJ3VwZGF0ZSByZWNvcmQnLFxuICBSRUFEX1JFQ09SRDogJ3JlYWQgcmVjb3JkJyxcbiAgREVMRVRFX1JFQ09SRDogJ2RlbGV0ZSByZWNvcmQnLFxuICBSRUFEX0lOREVYOiAncmVhZCBpbmRleCcsXG4gIE1BTkFHRV9JTkRFWDogJ21hbmFnZSBpbmRleCcsXG4gIE1BTkFHRV9DT0xMRUNUSU9OOiAnbWFuYWdlIGNvbGxlY3Rpb24nLFxuICBXUklURV9URU1QTEFURVM6ICd3cml0ZSB0ZW1wbGF0ZXMnLFxuICBDUkVBVEVfVVNFUjogJ2NyZWF0ZSB1c2VyJyxcbiAgU0VUX1BBU1NXT1JEOiAnc2V0IHBhc3N3b3JkJyxcbiAgQ1JFQVRFX1RFTVBPUkFSWV9BQ0NFU1M6ICdjcmVhdGUgdGVtcG9yYXJ5IGFjY2VzcycsXG4gIEVOQUJMRV9ESVNBQkxFX1VTRVI6ICdlbmFibGUgb3IgZGlzYWJsZSB1c2VyJyxcbiAgV1JJVEVfQUNDRVNTX0xFVkVMUzogJ3dyaXRlIGFjY2VzcyBsZXZlbHMnLFxuICBMSVNUX1VTRVJTOiAnbGlzdCB1c2VycycsXG4gIExJU1RfQUNDRVNTX0xFVkVMUzogJ2xpc3QgYWNjZXNzIGxldmVscycsXG4gIEVYRUNVVEVfQUNUSU9OOiAnZXhlY3V0ZSBhY3Rpb24nLFxuICBTRVRfVVNFUl9BQ0NFU1NfTEVWRUxTOiAnc2V0IHVzZXIgYWNjZXNzIGxldmVscycsXG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VXNlckJ5TmFtZSA9ICh1c2VycywgbmFtZSkgPT4gJCh1c2VycywgW1xuICBmaW5kKHUgPT4gdS5uYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUudG9Mb3dlckNhc2UoKSksXG5dKTtcblxuZXhwb3J0IGNvbnN0IHN0cmlwVXNlck9mU2Vuc2l0aXZlU3R1ZmYgPSAodXNlcikgPT4ge1xuICBjb25zdCBzdHJpcHBlZCA9IGNsb25lKHVzZXIpO1xuICBkZWxldGUgc3RyaXBwZWQudGVtcENvZGU7XG4gIHJldHVybiBzdHJpcHBlZDtcbn07XG5cbmV4cG9ydCBjb25zdCBwYXJzZVRlbXBvcmFyeUNvZGUgPSBmdWxsQ29kZSA9PiAkKGZ1bGxDb2RlLCBbXG4gIHNwbGl0KCc6JyksXG4gIHBhcnRzID0+ICh7XG4gICAgaWQ6IHBhcnRzWzFdLFxuICAgIGNvZGU6IHBhcnRzWzJdLFxuICB9KSxcbl0pO1xuIiwiaW1wb3J0IHsgdmFsdWVzLCBpbmNsdWRlcywgc29tZSB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uVHlwZXMgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHtcbiAgJCwgaXNOb3RoaW5nLCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0Tm9kZUJ5S2V5T3JOb2RlS2V5LCBpc05vZGUgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgaXNBdXRob3JpemVkID0gYXBwID0+IChwZXJtaXNzaW9uVHlwZSwgcmVzb3VyY2VLZXkpID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmlzQXV0aG9yaXplZCxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyByZXNvdXJjZUtleSwgcGVybWlzc2lvblR5cGUgfSxcbiAgX2lzQXV0aG9yaXplZCwgYXBwLCBwZXJtaXNzaW9uVHlwZSwgcmVzb3VyY2VLZXksXG4pO1xuXG5leHBvcnQgY29uc3QgX2lzQXV0aG9yaXplZCA9IChhcHAsIHBlcm1pc3Npb25UeXBlLCByZXNvdXJjZUtleSkgPT4ge1xuICBpZiAoIWFwcC51c2VyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgdmFsaWRUeXBlID0gJChwZXJtaXNzaW9uVHlwZXMsIFtcbiAgICB2YWx1ZXMsXG4gICAgaW5jbHVkZXMocGVybWlzc2lvblR5cGUpLFxuICBdKTtcblxuICBpZiAoIXZhbGlkVHlwZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHBlcm1NYXRjaGVzUmVzb3VyY2UgPSAodXNlcnBlcm0pID0+IHtcbiAgICBjb25zdCBub2RlS2V5ID0gaXNOb3RoaW5nKHJlc291cmNlS2V5KVxuICAgICAgPyBudWxsXG4gICAgICA6IGlzTm9kZShhcHAuaGllcmFyY2h5LCByZXNvdXJjZUtleSlcbiAgICAgICAgPyBnZXROb2RlQnlLZXlPck5vZGVLZXkoXG4gICAgICAgICAgYXBwLmhpZXJhcmNoeSwgcmVzb3VyY2VLZXksXG4gICAgICAgICkubm9kZUtleSgpXG4gICAgICAgIDogcmVzb3VyY2VLZXk7XG5cbiAgICByZXR1cm4gKHVzZXJwZXJtLnR5cGUgPT09IHBlcm1pc3Npb25UeXBlKVxuICAgICAgICAmJiAoXG4gICAgICAgICAgaXNOb3RoaW5nKHJlc291cmNlS2V5KVxuICAgICAgICAgICAgfHwgbm9kZUtleSA9PT0gdXNlcnBlcm0ubm9kZUtleVxuICAgICAgICApO1xuICB9O1xuXG4gIHJldHVybiAkKGFwcC51c2VyLnBlcm1pc3Npb25zLCBbXG4gICAgc29tZShwZXJtTWF0Y2hlc1Jlc291cmNlKSxcbiAgXSk7XG59O1xuIiwiaW1wb3J0IHsgcGVybWlzc2lvblR5cGVzIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7IGlzQXV0aG9yaXplZCB9IGZyb20gJy4vaXNBdXRob3JpemVkJztcblxuZXhwb3J0IGNvbnN0IHRlbXBvcmFyeUFjY2Vzc1Blcm1pc3Npb25zID0gKCkgPT4gKFt7IHR5cGU6IHBlcm1pc3Npb25UeXBlcy5TRVRfUEFTU1dPUkQgfV0pO1xuXG5jb25zdCBub2RlUGVybWlzc2lvbiA9IHR5cGUgPT4gKHtcbiAgYWRkOiAobm9kZUtleSwgYWNjZXNzTGV2ZWwpID0+IGFjY2Vzc0xldmVsLnBlcm1pc3Npb25zLnB1c2goeyB0eXBlLCBub2RlS2V5IH0pLFxuICBpc0F1dGhvcml6ZWQ6IHJlc291cmNlS2V5ID0+IGFwcCA9PiBpc0F1dGhvcml6ZWQoYXBwKSh0eXBlLCByZXNvdXJjZUtleSksXG4gIGlzTm9kZTogdHJ1ZSxcbiAgZ2V0OiBub2RlS2V5ID0+ICh7IHR5cGUsIG5vZGVLZXkgfSksXG59KTtcblxuY29uc3Qgc3RhdGljUGVybWlzc2lvbiA9IHR5cGUgPT4gKHtcbiAgYWRkOiBhY2Nlc3NMZXZlbCA9PiBhY2Nlc3NMZXZlbC5wZXJtaXNzaW9ucy5wdXNoKHsgdHlwZSB9KSxcbiAgaXNBdXRob3JpemVkOiBhcHAgPT4gaXNBdXRob3JpemVkKGFwcCkodHlwZSksXG4gIGlzTm9kZTogZmFsc2UsXG4gIGdldDogKCkgPT4gKHsgdHlwZSB9KSxcbn0pO1xuXG5jb25zdCBjcmVhdGVSZWNvcmQgPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuQ1JFQVRFX1JFQ09SRCk7XG5cbmNvbnN0IHVwZGF0ZVJlY29yZCA9IG5vZGVQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5VUERBVEVfUkVDT1JEKTtcblxuY29uc3QgZGVsZXRlUmVjb3JkID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkRFTEVURV9SRUNPUkQpO1xuXG5jb25zdCByZWFkUmVjb3JkID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlJFQURfUkVDT1JEKTtcblxuY29uc3Qgd3JpdGVUZW1wbGF0ZXMgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5XUklURV9URU1QTEFURVMpO1xuXG5jb25zdCBjcmVhdGVVc2VyID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuQ1JFQVRFX1VTRVIpO1xuXG5jb25zdCBzZXRQYXNzd29yZCA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlNFVF9QQVNTV09SRCk7XG5cbmNvbnN0IHJlYWRJbmRleCA9IG5vZGVQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5SRUFEX0lOREVYKTtcblxuY29uc3QgbWFuYWdlSW5kZXggPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5NQU5BR0VfSU5ERVgpO1xuXG5jb25zdCBtYW5hZ2VDb2xsZWN0aW9uID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuTUFOQUdFX0NPTExFQ1RJT04pO1xuXG5jb25zdCBjcmVhdGVUZW1wb3JhcnlBY2Nlc3MgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfVEVNUE9SQVJZX0FDQ0VTUyk7XG5cbmNvbnN0IGVuYWJsZURpc2FibGVVc2VyID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuRU5BQkxFX0RJU0FCTEVfVVNFUik7XG5cbmNvbnN0IHdyaXRlQWNjZXNzTGV2ZWxzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuV1JJVEVfQUNDRVNTX0xFVkVMUyk7XG5cbmNvbnN0IGxpc3RVc2VycyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkxJU1RfVVNFUlMpO1xuXG5jb25zdCBsaXN0QWNjZXNzTGV2ZWxzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuTElTVF9BQ0NFU1NfTEVWRUxTKTtcblxuY29uc3Qgc2V0VXNlckFjY2Vzc0xldmVscyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlNFVF9VU0VSX0FDQ0VTU19MRVZFTFMpO1xuXG5jb25zdCBleGVjdXRlQWN0aW9uID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkVYRUNVVEVfQUNUSU9OKTtcblxuZXhwb3J0IGNvbnN0IGFsd2F5c0F1dGhvcml6ZWQgPSAoKSA9PiB0cnVlO1xuXG5leHBvcnQgY29uc3QgcGVybWlzc2lvbiA9IHtcbiAgY3JlYXRlUmVjb3JkLFxuICB1cGRhdGVSZWNvcmQsXG4gIGRlbGV0ZVJlY29yZCxcbiAgcmVhZFJlY29yZCxcbiAgd3JpdGVUZW1wbGF0ZXMsXG4gIGNyZWF0ZVVzZXIsXG4gIHNldFBhc3N3b3JkLFxuICByZWFkSW5kZXgsXG4gIGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyxcbiAgZW5hYmxlRGlzYWJsZVVzZXIsXG4gIHdyaXRlQWNjZXNzTGV2ZWxzLFxuICBsaXN0VXNlcnMsXG4gIGxpc3RBY2Nlc3NMZXZlbHMsXG4gIG1hbmFnZUluZGV4LFxuICBtYW5hZ2VDb2xsZWN0aW9uLFxuICBleGVjdXRlQWN0aW9uLFxuICBzZXRVc2VyQWNjZXNzTGV2ZWxzLFxufTtcbiIsImltcG9ydCB7XG4gIGtleUJ5LCBtYXBWYWx1ZXMsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHsgXG4gIGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aCwgaXNTaW5nbGVSZWNvcmQgXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBnZXROZXdGaWVsZFZhbHVlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtcbiAgJCwgam9pbktleSwgc2FmZUtleSwgYXBpV3JhcHBlclN5bmMsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGdldE5ldyA9IGFwcCA9PiAoY29sbGVjdGlvbktleSwgcmVjb3JkVHlwZU5hbWUpID0+IHtcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldFJlY29yZE5vZGUoYXBwLCBjb2xsZWN0aW9uS2V5LCByZWNvcmRUeXBlTmFtZSk7XG4gIGNvbGxlY3Rpb25LZXk9c2FmZUtleShjb2xsZWN0aW9uS2V5KTtcbiAgcmV0dXJuIGFwaVdyYXBwZXJTeW5jKFxuICAgIGFwcCxcbiAgICBldmVudHMucmVjb3JkQXBpLmdldE5ldyxcbiAgICBwZXJtaXNzaW9uLmNyZWF0ZVJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkTm9kZS5ub2RlS2V5KCkpLFxuICAgIHsgY29sbGVjdGlvbktleSwgcmVjb3JkVHlwZU5hbWUgfSxcbiAgICBfZ2V0TmV3LCByZWNvcmROb2RlLCBjb2xsZWN0aW9uS2V5LFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IF9nZXROZXcgPSAocmVjb3JkTm9kZSwgY29sbGVjdGlvbktleSkgPT4gY29uc3RydWN0UmVjb3JkKHJlY29yZE5vZGUsIGdldE5ld0ZpZWxkVmFsdWUsIGNvbGxlY3Rpb25LZXkpO1xuXG5jb25zdCBnZXRSZWNvcmROb2RlID0gKGFwcCwgY29sbGVjdGlvbktleSkgPT4ge1xuICBjb2xsZWN0aW9uS2V5ID0gc2FmZUtleShjb2xsZWN0aW9uS2V5KTtcbiAgcmV0dXJuIGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHAuaGllcmFyY2h5KShjb2xsZWN0aW9uS2V5KTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXROZXdDaGlsZCA9IGFwcCA9PiAocmVjb3JkS2V5LCBjb2xsZWN0aW9uTmFtZSwgcmVjb3JkVHlwZU5hbWUpID0+IFxuICBnZXROZXcoYXBwKShqb2luS2V5KHJlY29yZEtleSwgY29sbGVjdGlvbk5hbWUpLCByZWNvcmRUeXBlTmFtZSk7XG5cbmV4cG9ydCBjb25zdCBjb25zdHJ1Y3RSZWNvcmQgPSAocmVjb3JkTm9kZSwgZ2V0RmllbGRWYWx1ZSwgY29sbGVjdGlvbktleSkgPT4ge1xuICBjb25zdCByZWNvcmQgPSAkKHJlY29yZE5vZGUuZmllbGRzLCBbXG4gICAga2V5QnkoJ25hbWUnKSxcbiAgICBtYXBWYWx1ZXMoZ2V0RmllbGRWYWx1ZSksXG4gIF0pO1xuXG4gIHJlY29yZC5pZCA9IGAke3JlY29yZE5vZGUubm9kZUlkfS0ke2dlbmVyYXRlKCl9YDtcbiAgcmVjb3JkLmtleSA9IGlzU2luZ2xlUmVjb3JkKHJlY29yZE5vZGUpXG4gICAgICAgICAgICAgICA/IGpvaW5LZXkoY29sbGVjdGlvbktleSwgcmVjb3JkTm9kZS5uYW1lKVxuICAgICAgICAgICAgICAgOiBqb2luS2V5KGNvbGxlY3Rpb25LZXksIHJlY29yZC5pZCk7XG4gIHJlY29yZC5pc05ldyA9IHRydWU7XG4gIHJlY29yZC50eXBlID0gcmVjb3JkTm9kZS5uYW1lO1xuICByZXR1cm4gcmVjb3JkO1xufTtcbiIsImltcG9ydCB7XHJcbiAgZmxhdHRlbiwgb3JkZXJCeSxcclxuICBmaWx0ZXIsIGlzVW5kZWZpbmVkXHJcbn0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IGhpZXJhcmNoeSwge1xyXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcclxuICBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5LFxyXG4gIGlzQ29sbGVjdGlvblJlY29yZCwgaXNBbmNlc3RvcixcclxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBqb2luS2V5LCBzYWZlS2V5LCAkIH0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgZ2V0Q29sbGVjdGlvbkRpciB9IGZyb20gXCIuLi9yZWNvcmRBcGkvcmVjb3JkSW5mb1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFJFQ09SRFNfUEVSX0ZPTERFUiA9IDEwMDA7XHJcbmV4cG9ydCBjb25zdCBhbGxJZENoYXJzID0gJzAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXy0nO1xyXG5cclxuLy8gdGhpcyBzaG91bGQgbmV2ZXIgYmUgY2hhbmdlZCAtIGV2ZXIgXHJcbi8vIC0gZXhpc3RpbmcgZGF0YWJhc2VzIGRlcGVuZCBvbiB0aGUgb3JkZXIgb2YgY2hhcnMgdGhpcyBzdHJpbmdcclxuXHJcbi8qKlxyXG4gKiBmb2xkZXJTdHJ1Y3R1cmVBcnJheSBzaG91bGQgcmV0dXJuIGFuIGFycmF5IGxpa2VcclxuICogLSBbMV0gPSBhbGwgcmVjb3JkcyBmaXQgaW50byBvbmUgZm9sZGVyXHJcbiAqIC0gWzJdID0gYWxsIHJlY29yZHMgZml0ZSBpbnRvIDIgZm9sZGVyc1xyXG4gKiAtIFs2NCwgM10gPSBhbGwgcmVjb3JkcyBmaXQgaW50byA2NCAqIDMgZm9sZGVyc1xyXG4gKiAtIFs2NCwgNjQsIDEwXSA9IGFsbCByZWNvcmRzIGZpdCBpbnRvIDY0ICogNjQgKiAxMCBmb2xkZXJcclxuICogKHRoZXJlIGFyZSA2NCBwb3NzaWJsZSBjaGFycyBpbiBhbGxJc0NoYXJzKSBcclxuKi9cclxuZXhwb3J0IGNvbnN0IGZvbGRlclN0cnVjdHVyZUFycmF5ID0gKHJlY29yZE5vZGUpID0+IHtcclxuXHJcbiAgY29uc3QgdG90YWxGb2xkZXJzID0gTWF0aC5jZWlsKHJlY29yZE5vZGUuZXN0aW1hdGVkUmVjb3JkQ291bnQgLyAxMDAwKTtcclxuICBjb25zdCBmb2xkZXJBcnJheSA9IFtdO1xyXG4gIGxldCBsZXZlbENvdW50ID0gMTtcclxuICB3aGlsZSg2NCoqbGV2ZWxDb3VudCA8IHRvdGFsRm9sZGVycykge1xyXG4gICAgbGV2ZWxDb3VudCArPSAxO1xyXG4gICAgZm9sZGVyQXJyYXkucHVzaCg2NCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBwYXJlbnRGYWN0b3IgPSAoNjQqKmZvbGRlckFycmF5Lmxlbmd0aCk7XHJcbiAgaWYocGFyZW50RmFjdG9yIDwgdG90YWxGb2xkZXJzKSB7XHJcbiAgICBmb2xkZXJBcnJheS5wdXNoKFxyXG4gICAgICBNYXRoLmNlaWwodG90YWxGb2xkZXJzIC8gcGFyZW50RmFjdG9yKVxyXG4gICAgKTtcclxuICB9ICBcclxuXHJcbiAgcmV0dXJuIGZvbGRlckFycmF5O1xyXG5cclxuICAvKlxyXG4gIGNvbnN0IG1heFJlY29yZHMgPSBjdXJyZW50Rm9sZGVyUG9zaXRpb24gPT09IDAgXHJcbiAgICAgICAgICAgICAgICAgICAgID8gUkVDT1JEU19QRVJfRk9MREVSXHJcbiAgICAgICAgICAgICAgICAgICAgIDogY3VycmVudEZvbGRlclBvc2l0aW9uICogNjQgKiBSRUNPUkRTX1BFUl9GT0xERVI7XHJcblxyXG4gIGlmKG1heFJlY29yZHMgPCByZWNvcmROb2RlLmVzdGltYXRlZFJlY29yZENvdW50KSB7XHJcbiAgICByZXR1cm4gZm9sZGVyU3RydWN0dXJlQXJyYXkoXHJcbiAgICAgICAgICAgIHJlY29yZE5vZGUsXHJcbiAgICAgICAgICAgIFsuLi5jdXJyZW50QXJyYXksIDY0XSwgXHJcbiAgICAgICAgICAgIGN1cnJlbnRGb2xkZXJQb3NpdGlvbiArIDEpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zdCBjaGlsZEZvbGRlckNvdW50ID0gTWF0aC5jZWlsKHJlY29yZE5vZGUuZXN0aW1hdGVkUmVjb3JkQ291bnQgLyBtYXhSZWNvcmRzICk7XHJcbiAgICByZXR1cm4gWy4uLmN1cnJlbnRBcnJheSwgY2hpbGRGb2xkZXJDb3VudF1cclxuICB9Ki9cclxufVxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRBbGxJZHNJdGVyYXRvciA9IGFwcCA9PiBhc3luYyAoY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSkgPT4ge1xyXG4gIGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXkgPSBzYWZlS2V5KGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXkpO1xyXG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5KFxyXG4gICAgYXBwLmhpZXJhcmNoeSxcclxuICAgIGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXksXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgZ2V0QWxsSWRzSXRlcmF0b3JGb3JDb2xsZWN0aW9uS2V5ID0gYXN5bmMgKHJlY29yZE5vZGUsIGNvbGxlY3Rpb25LZXkpID0+IHtcclxuICAgIFxyXG4gICAgY29uc3QgZm9sZGVyU3RydWN0dXJlID0gZm9sZGVyU3RydWN0dXJlQXJyYXkocmVjb3JkTm9kZSlcclxuXHJcbiAgICBsZXQgY3VycmVudEZvbGRlckNvbnRlbnRzID0gW107XHJcbiAgICBsZXQgY3VycmVudFBvc2l0aW9uID0gW107XHJcblxyXG4gICAgY29uc3QgY29sbGVjdGlvbkRpciA9IGdldENvbGxlY3Rpb25EaXIoYXBwLmhpZXJhcmNoeSwgY29sbGVjdGlvbktleSk7XHJcbiAgICBjb25zdCBiYXNlUGF0aCA9IGpvaW5LZXkoXHJcbiAgICAgIGNvbGxlY3Rpb25EaXIsIHJlY29yZE5vZGUubm9kZUlkLnRvU3RyaW5nKCkpO1xyXG4gIFxyXG5cclxuICAgIFxyXG4gICAgLy8gXCJmb2xkZXJTdHJ1Y3R1cmVcIiBkZXRlcm1pbmVzIHRoZSB0b3AsIHNoYXJkaW5nIGZvbGRlcnNcclxuICAgIC8vIHdlIG5lZWQgdG8gYWRkIG9uZSwgZm9yIHRoZSBjb2xsZWN0aW9uIHJvb3QgZm9sZGVyLCB3aGljaFxyXG4gICAgLy8gYWx3YXlzICBleGlzdHMgXHJcbiAgICBjb25zdCBsZXZlbHMgPSBmb2xkZXJTdHJ1Y3R1cmUubGVuZ3RoICsgMTtcclxuICAgIGNvbnN0IHRvcExldmVsID0gbGV2ZWxzIC0xO1xyXG5cclxuICAgXHJcbiAgICAvKiBwb3B1bGF0ZSBpbml0aWFsIGRpcmVjdG9yeSBzdHJ1Y3R1cmUgaW4gZm9ybTpcclxuICAgIFtcclxuICAgICAge3BhdGg6IFwiL2FcIiwgY29udGVudHM6IFtcImJcIiwgXCJjXCIsIFwiZFwiXX0sIFxyXG4gICAgICB7cGF0aDogXCIvYS9iXCIsIGNvbnRlbnRzOiBbXCJlXCIsXCJmXCIsXCJnXCJdfSxcclxuICAgICAge3BhdGg6IFwiL2EvYi9lXCIsIGNvbnRlbnRzOiBbXCIxLWFiY2RcIixcIjItY2RlZlwiLFwiMy1lZmdoXCJdfSwgXHJcbiAgICBdXHJcbiAgICAvLyBzdG9yZXMgY29udGVudHMgb24gZWFjaCBwYXJlbnQgbGV2ZWxcclxuICAgIC8vIHRvcCBsZXZlbCBoYXMgSUQgZm9sZGVycyBcclxuICAgICovXHJcbiAgICBjb25zdCBmaXJzdEZvbGRlciA9IGFzeW5jICgpID0+IHtcclxuXHJcbiAgICAgIGxldCBmb2xkZXJMZXZlbCA9IDA7XHJcblxyXG4gICAgICBjb25zdCBsYXN0UGF0aEhhc0NvbnRlbnQgPSAoKSA9PiBcclxuICAgICAgICBmb2xkZXJMZXZlbCA9PT0gMCBcclxuICAgICAgICB8fCBjdXJyZW50Rm9sZGVyQ29udGVudHNbZm9sZGVyTGV2ZWwgLSAxXS5jb250ZW50cy5sZW5ndGggPiAwO1xyXG5cclxuXHJcbiAgICAgIHdoaWxlIChmb2xkZXJMZXZlbCA8PSB0b3BMZXZlbCAmJiBsYXN0UGF0aEhhc0NvbnRlbnQoKSkge1xyXG5cclxuICAgICAgICBsZXQgdGhpc1BhdGggPSBiYXNlUGF0aDtcclxuICAgICAgICBmb3IobGV0IGxldiA9IDA7IGxldiA8IGN1cnJlbnRQb3NpdGlvbi5sZW5ndGg7IGxldisrKSB7XHJcbiAgICAgICAgICB0aGlzUGF0aCA9IGpvaW5LZXkoXHJcbiAgICAgICAgICAgIHRoaXNQYXRoLCBjdXJyZW50Rm9sZGVyQ29udGVudHNbbGV2XS5jb250ZW50c1swXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjb250ZW50c1RoaXNMZXZlbCA9IFxyXG4gICAgICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5nZXRGb2xkZXJDb250ZW50cyh0aGlzUGF0aCk7XHJcbiAgICAgICAgY3VycmVudEZvbGRlckNvbnRlbnRzLnB1c2goe1xyXG4gICAgICAgICAgICBjb250ZW50czpjb250ZW50c1RoaXNMZXZlbCwgXHJcbiAgICAgICAgICAgIHBhdGg6IHRoaXNQYXRoXHJcbiAgICAgICAgfSk7ICAgXHJcblxyXG4gICAgICAgIC8vIHNob3VsZCBzdGFydCBhcyBzb21ldGhpbmcgbGlrZSBbMCwwXVxyXG4gICAgICAgIGlmKGZvbGRlckxldmVsIDwgdG9wTGV2ZWwpXHJcbiAgICAgICAgICBjdXJyZW50UG9zaXRpb24ucHVzaCgwKTsgXHJcblxyXG4gICAgICAgIGZvbGRlckxldmVsKz0xO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gKGN1cnJlbnRQb3NpdGlvbi5sZW5ndGggPT09IGxldmVscyAtIDEpO1xyXG4gICAgfSAgXHJcblxyXG4gICAgY29uc3QgaXNPbkxhc3RGb2xkZXIgPSBsZXZlbCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICBjb25zdCByZXN1bHQgPSAgY3VycmVudFBvc2l0aW9uW2xldmVsXSA9PT0gY3VycmVudEZvbGRlckNvbnRlbnRzW2xldmVsXS5jb250ZW50cy5sZW5ndGggLSAxO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25zdCBnZXROZXh0Rm9sZGVyID0gYXN5bmMgKGxldj11bmRlZmluZWQpID0+IHtcclxuICAgICAgbGV2ID0gaXNVbmRlZmluZWQobGV2KSA/IHRvcExldmVsIDogbGV2O1xyXG4gICAgICBjb25zdCBwYXJlbnRMZXYgPSBsZXYgLSAxO1xyXG5cclxuICAgICAgaWYocGFyZW50TGV2IDwgMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBcclxuICAgICAgaWYoaXNPbkxhc3RGb2xkZXIocGFyZW50TGV2KSkgeyBcclxuICAgICAgICByZXR1cm4gYXdhaXQgZ2V0TmV4dEZvbGRlcihwYXJlbnRMZXYpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBuZXdQb3NpdGlvbiA9IGN1cnJlbnRQb3NpdGlvbltwYXJlbnRMZXZdICsgMTtcclxuICAgICAgY3VycmVudFBvc2l0aW9uW3BhcmVudExldl0gPSBuZXdQb3NpdGlvbjtcclxuICAgICAgXHJcbiAgICAgIGNvbnN0IG5leHRGb2xkZXIgPSBqb2luS2V5KFxyXG4gICAgICAgIGN1cnJlbnRGb2xkZXJDb250ZW50c1twYXJlbnRMZXZdLnBhdGgsXHJcbiAgICAgICAgY3VycmVudEZvbGRlckNvbnRlbnRzW3BhcmVudExldl0uY29udGVudHNbbmV3UG9zaXRpb25dKTtcclxuICAgICAgY3VycmVudEZvbGRlckNvbnRlbnRzW2xldl0uY29udGVudHMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZvbGRlckNvbnRlbnRzKFxyXG4gICAgICAgIG5leHRGb2xkZXJcclxuICAgICAgKTtcclxuICAgICAgY3VycmVudEZvbGRlckNvbnRlbnRzW2xldl0ucGF0aCA9IG5leHRGb2xkZXI7XHJcblxyXG4gICAgICBpZihsZXYgIT09IHRvcExldmVsKSB7XHJcbiAgICAgIFxyXG4gICAgICAgIC8vIHdlIGp1c3QgYWR2YW5jZWQgYSBwYXJlbnQgZm9sZGVyLCBzbyBub3cgbmVlZCB0b1xyXG4gICAgICAgIC8vIGRvIHRoZSBzYW1lIHRvIHRoZSBuZXh0IGxldmVsc1xyXG4gICAgICAgIGxldCBsb29wTGV2ZWwgPSBsZXYgKyAxO1xyXG4gICAgICAgIHdoaWxlKGxvb3BMZXZlbCA8PSB0b3BMZXZlbCkge1xyXG4gICAgICAgICAgY29uc3QgbG9vcFBhcmVudExldmVsID0gbG9vcExldmVsLTE7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGN1cnJlbnRQb3NpdGlvbltsb29wUGFyZW50TGV2ZWxdID0gMDtcclxuICAgICAgICAgIGNvbnN0IG5leHRMb29wRm9sZGVyID0gam9pbktleShcclxuICAgICAgICAgICAgY3VycmVudEZvbGRlckNvbnRlbnRzW2xvb3BQYXJlbnRMZXZlbF0ucGF0aCxcclxuICAgICAgICAgICAgY3VycmVudEZvbGRlckNvbnRlbnRzW2xvb3BQYXJlbnRMZXZlbF0uY29udGVudHNbMF0pO1xyXG4gICAgICAgICAgY3VycmVudEZvbGRlckNvbnRlbnRzW2xvb3BMZXZlbF0uY29udGVudHMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZvbGRlckNvbnRlbnRzKFxyXG4gICAgICAgICAgICBuZXh0TG9vcEZvbGRlclxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIGN1cnJlbnRGb2xkZXJDb250ZW50c1tsb29wTGV2ZWxdLnBhdGggPSBuZXh0TG9vcEZvbGRlcjtcclxuICAgICAgICAgIGxvb3BMZXZlbCs9MTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHRydWUgPT1oYXMgbW9yZSBpZHMuLi4gKGp1c3QgbG9hZGVkIG1vcmUpXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBjb25zdCBpZHNDdXJyZW50Rm9sZGVyID0gKCkgPT4gXHJcbiAgICAgIGN1cnJlbnRGb2xkZXJDb250ZW50c1tjdXJyZW50Rm9sZGVyQ29udGVudHMubGVuZ3RoIC0gMV0uY29udGVudHM7XHJcblxyXG4gICAgY29uc3QgZmluaW5zaGVkUmVzdWx0ID0gKHsgZG9uZTogdHJ1ZSwgcmVzdWx0OiB7IGlkczogW10sIGNvbGxlY3Rpb25LZXkgfSB9KTtcclxuXHJcbiAgICBsZXQgaGFzU3RhcnRlZCA9IGZhbHNlO1xyXG4gICAgbGV0IGhhc01vcmUgPSB0cnVlO1xyXG4gICAgY29uc3QgZ2V0SWRzRnJvbUN1cnJlbnRmb2xkZXIgPSBhc3luYyAoKSA9PiB7XHJcblxyXG4gICAgICBpZighaGFzTW9yZSkge1xyXG4gICAgICAgIHJldHVybiBmaW5pbnNoZWRSZXN1bHQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmKCFoYXNTdGFydGVkKSB7XHJcbiAgICAgICAgaGFzTW9yZSA9IGF3YWl0IGZpcnN0Rm9sZGVyKCk7XHJcbiAgICAgICAgaGFzU3RhcnRlZCA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuICh7XHJcbiAgICAgICAgICByZXN1bHQ6IHtcclxuICAgICAgICAgICAgaWRzOiBpZHNDdXJyZW50Rm9sZGVyKCksXHJcbiAgICAgICAgICAgIGNvbGxlY3Rpb25LZXlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBkb25lOiBmYWxzZVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhhc01vcmUgPSBhd2FpdCBnZXROZXh0Rm9sZGVyKCk7XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4gKHtcclxuICAgICAgICByZXN1bHQ6IHtcclxuICAgICAgICAgIGlkczogaGFzTW9yZSA/IGlkc0N1cnJlbnRGb2xkZXIoKSA6IFtdLFxyXG4gICAgICAgICAgY29sbGVjdGlvbktleVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZG9uZTogIWhhc01vcmVcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGdldElkc0Zyb21DdXJyZW50Zm9sZGVyO1xyXG4gICAgXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgYW5jZXN0b3JzID0gJChnZXRGbGF0dGVuZWRIaWVyYXJjaHkoYXBwLmhpZXJhcmNoeSksIFtcclxuICAgIGZpbHRlcihpc0NvbGxlY3Rpb25SZWNvcmQpLFxyXG4gICAgZmlsdGVyKG4gPT4gaXNBbmNlc3RvcihyZWNvcmROb2RlKShuKVxyXG4gICAgICAgICAgICAgICAgICAgIHx8IG4ubm9kZUtleSgpID09PSByZWNvcmROb2RlLm5vZGVLZXkoKSksXHJcbiAgICBvcmRlckJ5KFtuID0+IG4ubm9kZUtleSgpLmxlbmd0aF0sIFsnYXNjJ10pLFxyXG4gIF0pOyAvLyBwYXJlbnRzIGZpcnN0XHJcblxyXG4gIGNvbnN0IHRyYXZlcnNlRm9ySXRlcmF0ZXJhdG9ycyA9IGFzeW5jIChwYXJlbnRSZWNvcmRLZXkgPSAnJywgY3VycmVudE5vZGVJbmRleCA9IDApID0+IHtcclxuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gYW5jZXN0b3JzW2N1cnJlbnROb2RlSW5kZXhdO1xyXG4gICAgY29uc3QgY3VycmVudENvbGxlY3Rpb25LZXkgPSBqb2luS2V5KFxyXG4gICAgICBwYXJlbnRSZWNvcmRLZXksXHJcbiAgICAgIGN1cnJlbnROb2RlLmNvbGxlY3Rpb25OYW1lLFxyXG4gICAgKTtcclxuICAgIGlmIChjdXJyZW50Tm9kZS5ub2RlS2V5KCkgPT09IHJlY29yZE5vZGUubm9kZUtleSgpKSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgYXdhaXQgZ2V0QWxsSWRzSXRlcmF0b3JGb3JDb2xsZWN0aW9uS2V5KFxyXG4gICAgICAgICAgY3VycmVudE5vZGUsXHJcbiAgICAgICAgICBjdXJyZW50Q29sbGVjdGlvbktleSxcclxuICAgICAgICApXTtcclxuICAgIH1cclxuICAgIGNvbnN0IGFsbEl0ZXJhdG9ycyA9IFtdO1xyXG4gICAgY29uc3QgY3VycmVudEl0ZXJhdG9yID0gYXdhaXQgZ2V0QWxsSWRzSXRlcmF0b3JGb3JDb2xsZWN0aW9uS2V5KFxyXG4gICAgICBjdXJyZW50Tm9kZSxcclxuICAgICAgY3VycmVudENvbGxlY3Rpb25LZXksXHJcbiAgICApO1xyXG5cclxuICAgIGxldCBpZHMgPSBhd2FpdCBjdXJyZW50SXRlcmF0b3IoKTtcclxuICAgIHdoaWxlIChpZHMuZG9uZSA9PT0gZmFsc2UpIHtcclxuICAgICAgZm9yIChjb25zdCBpZCBvZiBpZHMucmVzdWx0Lmlkcykge1xyXG4gICAgICAgIGFsbEl0ZXJhdG9ycy5wdXNoKFxyXG4gICAgICAgICAgYXdhaXQgdHJhdmVyc2VGb3JJdGVyYXRlcmF0b3JzKFxyXG4gICAgICAgICAgICBqb2luS2V5KGN1cnJlbnRDb2xsZWN0aW9uS2V5LCBpZCksXHJcbiAgICAgICAgICAgIGN1cnJlbnROb2RlSW5kZXggKyAxLFxyXG4gICAgICAgICAgKSxcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZHMgPSBhd2FpdCBjdXJyZW50SXRlcmF0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmxhdHRlbihhbGxJdGVyYXRvcnMpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGl0ZXJhdG9yc0FycmF5ID0gYXdhaXQgdHJhdmVyc2VGb3JJdGVyYXRlcmF0b3JzKCk7XHJcbiAgbGV0IGN1cnJlbnRJdGVyYXRvckluZGV4ID0gMDtcclxuICByZXR1cm4gYXN5bmMgKCkgPT4ge1xyXG4gICAgaWYgKGl0ZXJhdG9yc0FycmF5Lmxlbmd0aCA9PT0gMCkgeyByZXR1cm4geyBkb25lOiB0cnVlLCByZXN1bHQ6IFtdIH07IH1cclxuICAgIGNvbnN0IGlubmVyUmVzdWx0ID0gYXdhaXQgaXRlcmF0b3JzQXJyYXlbY3VycmVudEl0ZXJhdG9ySW5kZXhdKCk7XHJcbiAgICBpZiAoIWlubmVyUmVzdWx0LmRvbmUpIHsgcmV0dXJuIGlubmVyUmVzdWx0OyB9XHJcbiAgICBpZiAoY3VycmVudEl0ZXJhdG9ySW5kZXggPT0gaXRlcmF0b3JzQXJyYXkubGVuZ3RoIC0gMSkge1xyXG4gICAgICByZXR1cm4geyBkb25lOiB0cnVlLCByZXN1bHQ6IGlubmVyUmVzdWx0LnJlc3VsdCB9O1xyXG4gICAgfVxyXG4gICAgY3VycmVudEl0ZXJhdG9ySW5kZXgrKztcclxuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCByZXN1bHQ6IGlubmVyUmVzdWx0LnJlc3VsdCB9O1xyXG4gIH07XHJcbn07XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2V0QWxsSWRzSXRlcmF0b3I7XHJcbiIsImltcG9ydCB7IFxyXG4gIGdldEV4YWN0Tm9kZUZvcktleSwgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQsIFxyXG4gIGlzUm9vdCwgaXNTaW5nbGVSZWNvcmQsIGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aFxyXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7XHJcbnJlZHVjZSwgZmluZCwgZmlsdGVyLCB0YWtlXHJcbn0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHtcclxuJCwgZ2V0RmlsZUZyb21LZXksIGpvaW5LZXksIHNhZmVLZXksIGtleVNlcFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IFxyXG4gICAgZm9sZGVyU3RydWN0dXJlQXJyYXksIGFsbElkQ2hhcnMgXHJcbn0gZnJvbSBcIi4uL2luZGV4aW5nL2FsbElkc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFJlY29yZEluZm8gPSAoaGllcmFyY2h5LCBrZXkpID0+IHtcclxuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yS2V5KGhpZXJhcmNoeSkoa2V5KTtcclxuICBjb25zdCBwYXRoSW5mbyA9IGdldFJlY29yZERpcmVjdG9yeShyZWNvcmROb2RlLCBrZXkpO1xyXG4gIGNvbnN0IGRpciA9IGpvaW5LZXkocGF0aEluZm8uYmFzZSwgLi4ucGF0aEluZm8uc3ViZGlycyk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICByZWNvcmRKc29uOiByZWNvcmRKc29uKGRpciksXHJcbiAgICBmaWxlczogZmlsZXMoZGlyKSxcclxuICAgIGNoaWxkOihuYW1lKSA9PiBqb2luS2V5KGRpciwgbmFtZSksXHJcbiAgICBrZXk6IHNhZmVLZXkoa2V5KSxcclxuICAgIHJlY29yZE5vZGUsIHBhdGhJbmZvLCBkaXJcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0Q29sbGVjdGlvbkRpciA9IChoaWVyYXJjaHksIGNvbGxlY3Rpb25LZXkpID0+IHtcclxuICBjb25zdCByZWNvcmROb2RlID0gZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoKGhpZXJhcmNoeSkoY29sbGVjdGlvbktleSk7XHJcbiAgY29uc3QgZHVtbXlSZWNvcmRLZXkgPSBqb2luS2V5KGNvbGxlY3Rpb25LZXksIFwiMS1hYmNkXCIpO1xyXG4gIGNvbnN0IHBhdGhJbmZvID0gZ2V0UmVjb3JkRGlyZWN0b3J5KHJlY29yZE5vZGUsIGR1bW15UmVjb3JkS2V5KTtcclxuICByZXR1cm4gcGF0aEluZm8uYmFzZTtcclxufVxyXG5cclxuY29uc3QgcmVjb3JkSnNvbiA9IChkaXIpID0+IFxyXG4gIGpvaW5LZXkoZGlyLCBcInJlY29yZC5qc29uXCIpXHJcblxyXG5jb25zdCBmaWxlcyA9IChkaXIpID0+IFxyXG4gIGpvaW5LZXkoZGlyLCBcImZpbGVzXCIpXHJcblxyXG5jb25zdCBnZXRSZWNvcmREaXJlY3RvcnkgPSAocmVjb3JkTm9kZSwga2V5KSA9PiB7XHJcbiAgY29uc3QgaWQgPSBnZXRGaWxlRnJvbUtleShrZXkpO1xyXG4gIFxyXG4gIGNvbnN0IHRyYXZlcnNlUGFyZW50S2V5cyA9IChuLCBwYXJlbnRzPVtdKSA9PiB7XHJcbiAgICBpZihpc1Jvb3QobikpIHJldHVybiBwYXJlbnRzO1xyXG4gICAgY29uc3QgayA9IGdldEFjdHVhbEtleU9mUGFyZW50KG4ubm9kZUtleSgpLCBrZXkpO1xyXG4gICAgY29uc3QgdGhpc05vZGVEaXIgPSB7XHJcbiAgICAgIG5vZGU6bixcclxuICAgICAgcmVsYXRpdmVEaXI6IGpvaW5LZXkoXHJcbiAgICAgICAgcmVjb3JkUmVsYXRpdmVEaXJlY3RvcnkobiwgZ2V0RmlsZUZyb21LZXkoaykpKVxyXG4gICAgfTtcclxuICAgIHJldHVybiB0cmF2ZXJzZVBhcmVudEtleXMoXHJcbiAgICAgIG4ucGFyZW50KCksIFxyXG4gICAgICBbdGhpc05vZGVEaXIsIC4uLnBhcmVudHNdKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHBhcmVudERpcnMgPSAkKHJlY29yZE5vZGUucGFyZW50KCksIFtcclxuICAgIHRyYXZlcnNlUGFyZW50S2V5cyxcclxuICAgIHJlZHVjZSgoa2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgIHJldHVybiBqb2luS2V5KGtleSwgaXRlbS5ub2RlLmNvbGxlY3Rpb25OYW1lLCBpdGVtLnJlbGF0aXZlRGlyKVxyXG4gICAgfSwga2V5U2VwKVxyXG4gIF0pO1xyXG5cclxuICBjb25zdCBzdWJkaXJzID0gaXNTaW5nbGVSZWNvcmQocmVjb3JkTm9kZSlcclxuICAgICAgICAgICAgICAgICAgPyBbXVxyXG4gICAgICAgICAgICAgICAgICA6IHJlY29yZFJlbGF0aXZlRGlyZWN0b3J5KHJlY29yZE5vZGUsIGlkKTtcclxuICBjb25zdCBiYXNlID0gaXNTaW5nbGVSZWNvcmQocmVjb3JkTm9kZSlcclxuICAgICAgICAgICAgICAgPyBqb2luS2V5KHBhcmVudERpcnMsIHJlY29yZE5vZGUubmFtZSlcclxuICAgICAgICAgICAgICAgOiBqb2luS2V5KHBhcmVudERpcnMsIHJlY29yZE5vZGUuY29sbGVjdGlvbk5hbWUpO1xyXG5cclxuICByZXR1cm4gKHtcclxuICAgIHN1YmRpcnMsIGJhc2VcclxuICB9KTtcclxufVxyXG5cclxuY29uc3QgcmVjb3JkUmVsYXRpdmVEaXJlY3RvcnkgPSAocmVjb3JkTm9kZSwgaWQpID0+IHtcclxuICBjb25zdCBmb2xkZXJTdHJ1Y3R1cmUgPSBmb2xkZXJTdHJ1Y3R1cmVBcnJheShyZWNvcmROb2RlKTtcclxuICBjb25zdCBzdHJpcHBlZElkID0gaWQuc3Vic3RyaW5nKHJlY29yZE5vZGUubm9kZUlkLnRvU3RyaW5nKCkubGVuZ3RoICsgMSk7XHJcbiAgY29uc3Qgc3ViZm9sZGVycyA9ICQoZm9sZGVyU3RydWN0dXJlLCBbXHJcbiAgICByZWR1Y2UoKHJlc3VsdCwgY3VycmVudENvdW50KSA9PiB7XHJcbiAgICAgIHJlc3VsdC5mb2xkZXJzLnB1c2goXHJcbiAgICAgICAgICBmb2xkZXJGb3JDaGFyKHN0cmlwcGVkSWRbcmVzdWx0LmxldmVsXSwgY3VycmVudENvdW50KVxyXG4gICAgICApO1xyXG4gICAgICByZXR1cm4ge2xldmVsOnJlc3VsdC5sZXZlbCsxLCBmb2xkZXJzOnJlc3VsdC5mb2xkZXJzfTtcclxuICAgIH0sIHtsZXZlbDowLCBmb2xkZXJzOltdfSksXHJcbiAgICBmID0+IGYuZm9sZGVycyxcclxuICAgIGZpbHRlcihmID0+ICEhZilcclxuICBdKTtcclxuXHJcbiAgcmV0dXJuIFtyZWNvcmROb2RlLm5vZGVJZC50b1N0cmluZygpLCAuLi5zdWJmb2xkZXJzLCBpZF1cclxufVxyXG5cclxuY29uc3QgZm9sZGVyRm9yQ2hhciA9IChjaGFyLCBmb2xkZXJDb3VudCkgPT4gXHJcbiAgZm9sZGVyQ291bnQgPT09IDEgPyBcIlwiXHJcbiAgOiAkKGZvbGRlckNvdW50LCBbXHJcbiAgICAgIGlkRm9sZGVyc0ZvckZvbGRlckNvdW50LFxyXG4gICAgICBmaW5kKGYgPT4gZi5pbmNsdWRlcyhjaGFyKSlcclxuICAgIF0pO1xyXG5cclxuY29uc3QgaWRGb2xkZXJzRm9yRm9sZGVyQ291bnQgPSAoZm9sZGVyQ291bnQpID0+IHtcclxuICBjb25zdCBjaGFyUmFuZ2VQZXJTaGFyZCA9IDY0IC8gZm9sZGVyQ291bnQ7XHJcbiAgY29uc3QgaWRGb2xkZXJzID0gW107XHJcbiAgbGV0IGluZGV4ID0gMDtcclxuICBsZXQgY3VycmVudElkc1NoYXJkID0gJyc7XHJcbiAgd2hpbGUgKGluZGV4IDwgNjQpIHtcclxuICAgIGN1cnJlbnRJZHNTaGFyZCArPSBhbGxJZENoYXJzW2luZGV4XTtcclxuICAgIGlmICgoaW5kZXggKyAxKSAlIGNoYXJSYW5nZVBlclNoYXJkID09PSAwKSB7XHJcbiAgICAgIGlkRm9sZGVycy5wdXNoKGN1cnJlbnRJZHNTaGFyZCk7XHJcbiAgICAgIGN1cnJlbnRJZHNTaGFyZCA9ICcnO1xyXG4gICAgfVxyXG4gICAgaW5kZXgrKztcclxuICB9XHJcbiAgICBcclxuICAgIHJldHVybiBpZEZvbGRlcnM7XHJcbn07XHJcblxyXG4iLCJpbXBvcnQge1xyXG4gIGtleUJ5LCBtYXBWYWx1ZXMsIGZpbHRlciwgXHJcbiAgbWFwLCBpbmNsdWRlcywgbGFzdCxcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBnZXRFeGFjdE5vZGVGb3JLZXksIGdldE5vZGUgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBzYWZlUGFyc2VGaWVsZCB9IGZyb20gJy4uL3R5cGVzJztcclxuaW1wb3J0IHtcclxuICAkLCBzcGxpdEtleSwgc2FmZUtleSwgaXNOb25FbXB0eVN0cmluZyxcclxuICBhcGlXcmFwcGVyLCBldmVudHMsIGpvaW5LZXksXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgbWFwUmVjb3JkIH0gZnJvbSAnLi4vaW5kZXhpbmcvZXZhbHVhdGUnO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XHJcbmltcG9ydCB7IGdldFJlY29yZEluZm8gfSBmcm9tIFwiLi9yZWNvcmRJbmZvXCI7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkRmlsZU5hbWUgPSBrZXkgPT4gam9pbktleShrZXksICdyZWNvcmQuanNvbicpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGxvYWQgPSBhcHAgPT4gYXN5bmMga2V5ID0+IHtcclxuICBrZXkgPSBzYWZlS2V5KGtleSk7XHJcbiAgcmV0dXJuIGFwaVdyYXBwZXIoXHJcbiAgICBhcHAsXHJcbiAgICBldmVudHMucmVjb3JkQXBpLmxvYWQsXHJcbiAgICBwZXJtaXNzaW9uLnJlYWRSZWNvcmQuaXNBdXRob3JpemVkKGtleSksXHJcbiAgICB7IGtleSB9LFxyXG4gICAgX2xvYWQsIGFwcCwga2V5LFxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBfbG9hZEZyb21JbmZvID0gYXN5bmMgKGFwcCwgcmVjb3JkSW5mbywga2V5U3RhY2sgPSBbXSkgPT4ge1xyXG4gIGNvbnN0IGtleSA9IHJlY29yZEluZm8ua2V5O1xyXG4gIGNvbnN0IHtyZWNvcmROb2RlLCByZWNvcmRKc29ufSA9IHJlY29yZEluZm87XHJcbiAgY29uc3Qgc3RvcmVkRGF0YSA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24ocmVjb3JkSnNvbik7XHJcblxyXG4gIGNvbnN0IGxvYWRlZFJlY29yZCA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcclxuICAgIGtleUJ5KCduYW1lJyksXHJcbiAgICBtYXBWYWx1ZXMoZiA9PiBzYWZlUGFyc2VGaWVsZChmLCBzdG9yZWREYXRhKSksXHJcbiAgXSk7XHJcblxyXG4gIGNvbnN0IG5ld0tleVN0YWNrID0gWy4uLmtleVN0YWNrLCBrZXldO1xyXG5cclxuICBjb25zdCByZWZlcmVuY2VzID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xyXG4gICAgZmlsdGVyKGYgPT4gZi50eXBlID09PSAncmVmZXJlbmNlJ1xyXG4gICAgICAgICAgICAgICAgICAgICYmIGlzTm9uRW1wdHlTdHJpbmcobG9hZGVkUmVjb3JkW2YubmFtZV0ua2V5KVxyXG4gICAgICAgICAgICAgICAgICAgICYmICFpbmNsdWRlcyhsb2FkZWRSZWNvcmRbZi5uYW1lXS5rZXkpKG5ld0tleVN0YWNrKSksXHJcbiAgICBtYXAoZiA9PiAoe1xyXG4gICAgICBwcm9taXNlOiBfbG9hZChhcHAsIGxvYWRlZFJlY29yZFtmLm5hbWVdLmtleSwgbmV3S2V5U3RhY2spLFxyXG4gICAgICBpbmRleDogZ2V0Tm9kZShhcHAuaGllcmFyY2h5LCBmLnR5cGVPcHRpb25zLmluZGV4Tm9kZUtleSksXHJcbiAgICAgIGZpZWxkOiBmLFxyXG4gICAgfSkpLFxyXG4gIF0pO1xyXG5cclxuICBpZiAocmVmZXJlbmNlcy5sZW5ndGggPiAwKSB7XHJcbiAgICBjb25zdCByZWZSZWNvcmRzID0gYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgIG1hcChwID0+IHAucHJvbWlzZSkocmVmZXJlbmNlcyksXHJcbiAgICApO1xyXG5cclxuICAgIGZvciAoY29uc3QgcmVmIG9mIHJlZmVyZW5jZXMpIHtcclxuICAgICAgbG9hZGVkUmVjb3JkW3JlZi5maWVsZC5uYW1lXSA9IG1hcFJlY29yZChcclxuICAgICAgICByZWZSZWNvcmRzW3JlZmVyZW5jZXMuaW5kZXhPZihyZWYpXSxcclxuICAgICAgICByZWYuaW5kZXgsXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsb2FkZWRSZWNvcmQudHJhbnNhY3Rpb25JZCA9IHN0b3JlZERhdGEudHJhbnNhY3Rpb25JZDtcclxuICBsb2FkZWRSZWNvcmQuaXNOZXcgPSBmYWxzZTtcclxuICBsb2FkZWRSZWNvcmQua2V5ID0ga2V5O1xyXG4gIGxvYWRlZFJlY29yZC5pZCA9ICQoa2V5LCBbc3BsaXRLZXksIGxhc3RdKTtcclxuICBsb2FkZWRSZWNvcmQudHlwZSA9IHJlY29yZE5vZGUubmFtZTtcclxuICByZXR1cm4gbG9hZGVkUmVjb3JkO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IF9sb2FkID0gYXN5bmMgKGFwcCwga2V5LCBrZXlTdGFjayA9IFtdKSA9PiBcclxuICBfbG9hZEZyb21JbmZvKFxyXG4gICAgYXBwLFxyXG4gICAgZ2V0UmVjb3JkSW5mbyhhcHAuaGllcmFyY2h5LCBrZXkpLFxyXG4gICAga2V5U3RhY2spO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGxvYWQ7XHJcbiIsIi8vIGFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZGV4NGVyL2pzLXByb21pc2UtcmVhZGFibGVcbi8vIHRoYW5rcyA6KVxuICBcbmV4cG9ydCBjb25zdCBwcm9taXNlUmVhZGFibGVTdHJlYW0gPSBzdHJlYW0gPT4ge1xuICAgXG4gICAgbGV0IF9lcnJvcmVkO1xuXG4gICAgY29uc3QgX2Vycm9ySGFuZGxlciA9IGVyciA9PiB7XG4gICAgICAgIF9lcnJvcmVkID0gZXJyO1xuICAgIH07XG5cbiAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBfZXJyb3JIYW5kbGVyKTtcbiAgXG4gICAgY29uc3QgcmVhZCA9IChzaXplKSA9PiB7XG4gIFxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKF9lcnJvcmVkKSB7XG4gICAgICAgICAgY29uc3QgZXJyID0gX2Vycm9yZWQ7XG4gICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICAgIH1cbiAgXG4gICAgICAgIGlmICghc3RyZWFtLnJlYWRhYmxlIHx8IHN0cmVhbS5jbG9zZWQgfHwgc3RyZWFtLmRlc3Ryb3llZCkge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IHJlYWRhYmxlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICBjb25zdCBjaHVuayA9IHN0cmVhbS5yZWFkKHNpemUpO1xuICBcbiAgICAgICAgICBpZiAoY2h1bmspIHtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVzb2x2ZShjaHVuayk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCBjbG9zZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCBlbmRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgZXJyb3JIYW5kbGVyID0gKGVycikgPT4ge1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCByZW1vdmVMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiY2xvc2VcIiwgY2xvc2VIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVuZFwiLCBlbmRIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJyZWFkYWJsZVwiLCByZWFkYWJsZUhhbmRsZXIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBzdHJlYW0ub24oXCJjbG9zZVwiLCBjbG9zZUhhbmRsZXIpO1xuICAgICAgICBzdHJlYW0ub24oXCJlbmRcIiwgZW5kSGFuZGxlcik7XG4gICAgICAgIHN0cmVhbS5vbihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gICAgICAgIHN0cmVhbS5vbihcInJlYWRhYmxlXCIsIHJlYWRhYmxlSGFuZGxlcik7XG4gIFxuICAgICAgICByZWFkYWJsZUhhbmRsZXIoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgXG4gIFxuICAgIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XG4gICAgICBpZiAoc3RyZWFtKSB7XG4gICAgICAgIGlmIChfZXJyb3JIYW5kbGVyKSB7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgX2Vycm9ySGFuZGxlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBzdHJlYW0uZGVzdHJveSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgc3RyZWFtLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIFxuICAgIHJldHVybiB7cmVhZCwgZGVzdHJveSwgc3RyZWFtfTtcbiAgfVxuICBcbiAgZXhwb3J0IGRlZmF1bHQgcHJvbWlzZVJlYWRhYmxlU3RyZWFtXG4gICIsImltcG9ydCB7IGNvbXBpbGVDb2RlIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xyXG5pbXBvcnQge1xyXG4gIGZpbHRlciwgaW5jbHVkZXMsIG1hcCwgbGFzdCxcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQge1xyXG4gIGdldEFjdHVhbEtleU9mUGFyZW50LCBpc0dsb2JhbEluZGV4LFxyXG4gIGdldFBhcmVudEtleSwgaXNTaGFyZGVkSW5kZXgsXHJcbiAgZ2V0RXhhY3ROb2RlRm9yS2V5LFxyXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7XHJcbiAgam9pbktleSwgaXNOb25FbXB0eVN0cmluZywgc3BsaXRLZXksICQsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRJbmRleGVkRGF0YUtleSA9IChpbmRleE5vZGUsIGluZGV4RGlyLCByZWNvcmQpID0+IHtcclxuICBcclxuICBjb25zdCBnZXRTaGFyZE5hbWUgPSAoaW5kZXhOb2RlLCByZWNvcmQpID0+IHtcclxuICAgIGNvbnN0IHNoYXJkTmFtZUZ1bmMgPSBjb21waWxlQ29kZShpbmRleE5vZGUuZ2V0U2hhcmROYW1lKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIHJldHVybiBzaGFyZE5hbWVGdW5jKHsgcmVjb3JkIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIGNvbnN0IGVycm9yRGV0YWlscyA9IGBzaGFyZENvZGU6ICR7aW5kZXhOb2RlLmdldFNoYXJkTmFtZX0gOjogcmVjb3JkOiAke0pTT04uc3RyaW5naWZ5KHJlY29yZCl9IDo6IGBcclxuICAgICAgZS5tZXNzYWdlID0gXCJFcnJvciBydW5uaW5nIGluZGV4IHNoYXJkbmFtZSBmdW5jOiBcIiArIGVycm9yRGV0YWlscyArIGUubWVzc2FnZTtcclxuICAgICAgdGhyb3cgZTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBzaGFyZE5hbWUgPSBpc05vbkVtcHR5U3RyaW5nKGluZGV4Tm9kZS5nZXRTaGFyZE5hbWUpXHJcbiAgICA/IGAke2dldFNoYXJkTmFtZShpbmRleE5vZGUsIHJlY29yZCl9LmNzdmBcclxuICAgIDogJ2luZGV4LmNzdic7XHJcblxyXG4gIHJldHVybiBqb2luS2V5KGluZGV4RGlyLCBzaGFyZE5hbWUpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNoYXJkS2V5c0luUmFuZ2UgPSBhc3luYyAoYXBwLCBpbmRleE5vZGUsIGluZGV4RGlyLCBzdGFydFJlY29yZCA9IG51bGwsIGVuZFJlY29yZCA9IG51bGwpID0+IHtcclxuICBjb25zdCBzdGFydFNoYXJkTmFtZSA9ICFzdGFydFJlY29yZFxyXG4gICAgPyBudWxsXHJcbiAgICA6IHNoYXJkTmFtZUZyb21LZXkoXHJcbiAgICAgIGdldEluZGV4ZWREYXRhS2V5KFxyXG4gICAgICAgIGluZGV4Tm9kZSxcclxuICAgICAgICBpbmRleERpcixcclxuICAgICAgICBzdGFydFJlY29yZCxcclxuICAgICAgKSxcclxuICAgICk7XHJcblxyXG4gIGNvbnN0IGVuZFNoYXJkTmFtZSA9ICFlbmRSZWNvcmRcclxuICAgID8gbnVsbFxyXG4gICAgOiBzaGFyZE5hbWVGcm9tS2V5KFxyXG4gICAgICBnZXRJbmRleGVkRGF0YUtleShcclxuICAgICAgICBpbmRleE5vZGUsXHJcbiAgICAgICAgaW5kZXhEaXIsXHJcbiAgICAgICAgZW5kUmVjb3JkLFxyXG4gICAgICApLFxyXG4gICAgKTtcclxuXHJcbiAgcmV0dXJuICQoYXdhaXQgZ2V0U2hhcmRNYXAoYXBwLmRhdGFzdG9yZSwgaW5kZXhEaXIpLCBbXHJcbiAgICBmaWx0ZXIoayA9PiAoc3RhcnRSZWNvcmQgPT09IG51bGwgfHwgayA+PSBzdGFydFNoYXJkTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAmJiAoZW5kUmVjb3JkID09PSBudWxsIHx8IGsgPD0gZW5kU2hhcmROYW1lKSksXHJcbiAgICBtYXAoayA9PiBqb2luS2V5KGluZGV4RGlyLCBgJHtrfS5jc3ZgKSksXHJcbiAgXSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZW5zdXJlU2hhcmROYW1lSXNJblNoYXJkTWFwID0gYXN5bmMgKHN0b3JlLCBpbmRleERpciwgaW5kZXhlZERhdGFLZXkpID0+IHtcclxuICBjb25zdCBtYXAgPSBhd2FpdCBnZXRTaGFyZE1hcChzdG9yZSwgaW5kZXhEaXIpO1xyXG4gIGNvbnN0IHNoYXJkTmFtZSA9IHNoYXJkTmFtZUZyb21LZXkoaW5kZXhlZERhdGFLZXkpO1xyXG4gIGlmICghaW5jbHVkZXMoc2hhcmROYW1lKShtYXApKSB7XHJcbiAgICBtYXAucHVzaChzaGFyZE5hbWUpO1xyXG4gICAgYXdhaXQgd3JpdGVTaGFyZE1hcChzdG9yZSwgaW5kZXhEaXIsIG1hcCk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNoYXJkTWFwID0gYXN5bmMgKGRhdGFzdG9yZSwgaW5kZXhEaXIpID0+IHtcclxuICBjb25zdCBzaGFyZE1hcEtleSA9IGdldFNoYXJkTWFwS2V5KGluZGV4RGlyKTtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IGRhdGFzdG9yZS5sb2FkSnNvbihzaGFyZE1hcEtleSk7XHJcbiAgfSBjYXRjaCAoXykge1xyXG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oc2hhcmRNYXBLZXksIFtdKTtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3Qgd3JpdGVTaGFyZE1hcCA9IGFzeW5jIChkYXRhc3RvcmUsIGluZGV4RGlyLCBzaGFyZE1hcCkgPT4gYXdhaXQgZGF0YXN0b3JlLnVwZGF0ZUpzb24oXHJcbiAgZ2V0U2hhcmRNYXBLZXkoaW5kZXhEaXIpLFxyXG4gIHNoYXJkTWFwLFxyXG4pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEFsbFNoYXJkS2V5cyA9IGFzeW5jIChhcHAsIGluZGV4Tm9kZSwgaW5kZXhEaXIpID0+XHJcbiAgYXdhaXQgZ2V0U2hhcmRLZXlzSW5SYW5nZShhcHAsIGluZGV4Tm9kZSwgaW5kZXhEaXIpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNoYXJkTWFwS2V5ID0gaW5kZXhEaXIgPT4gam9pbktleShpbmRleERpciwgJ3NoYXJkTWFwLmpzb24nKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXkgPSBpbmRleERpciA9PiBqb2luS2V5KGluZGV4RGlyLCAnaW5kZXguY3N2Jyk7XHJcblxyXG5leHBvcnQgY29uc3QgY3JlYXRlSW5kZXhGaWxlID0gYXN5bmMgKGRhdGFzdG9yZSwgaW5kZXhlZERhdGFLZXksIGluZGV4KSA9PiB7XHJcbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4KSkge1xyXG4gICAgY29uc3QgaW5kZXhEaXIgPSBnZXRQYXJlbnRLZXkoaW5kZXhlZERhdGFLZXkpO1xyXG4gICAgY29uc3Qgc2hhcmRNYXAgPSBhd2FpdCBnZXRTaGFyZE1hcChkYXRhc3RvcmUsIGluZGV4RGlyKTtcclxuICAgIHNoYXJkTWFwLnB1c2goXHJcbiAgICAgIHNoYXJkTmFtZUZyb21LZXkoaW5kZXhlZERhdGFLZXkpLFxyXG4gICAgKTtcclxuICAgIGF3YWl0IHdyaXRlU2hhcmRNYXAoZGF0YXN0b3JlLCBpbmRleERpciwgc2hhcmRNYXApO1xyXG4gIH1cclxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRmlsZShpbmRleGVkRGF0YUtleSwgJycpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHNoYXJkTmFtZUZyb21LZXkgPSBrZXkgPT4gJChrZXksIFtcclxuICBzcGxpdEtleSxcclxuICBsYXN0LFxyXG5dKS5yZXBsYWNlKCcuY3N2JywgJycpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEluZGV4S2V5X0Jhc2VkT25EZWNlbmRhbnQgPSAoZGVjZW5kYW50S2V5LCBpbmRleE5vZGUpID0+IHtcclxuICBpZiAoaXNHbG9iYWxJbmRleChpbmRleE5vZGUpKSB7IHJldHVybiBgJHtpbmRleE5vZGUubm9kZUtleSgpfWA7IH1cclxuXHJcbiAgY29uc3QgaW5kZXhlZERhdGFQYXJlbnRLZXkgPSBnZXRBY3R1YWxLZXlPZlBhcmVudChcclxuICAgIGluZGV4Tm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksXHJcbiAgICBkZWNlbmRhbnRLZXksXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIGpvaW5LZXkoXHJcbiAgICBpbmRleGVkRGF0YVBhcmVudEtleSxcclxuICAgIGluZGV4Tm9kZS5uYW1lLFxyXG4gICk7XHJcbn07XHJcbiIsImltcG9ydCB7XG4gIGhhcywga2V5cywgbWFwLCBvcmRlckJ5LFxuICBmaWx0ZXIsIGNvbmNhdCwgcmV2ZXJzZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IG1hcFJlY29yZCB9IGZyb20gJy4vZXZhbHVhdGUnO1xuaW1wb3J0IHsgY29uc3RydWN0UmVjb3JkIH0gZnJvbSAnLi4vcmVjb3JkQXBpL2dldE5ldyc7XG5pbXBvcnQgeyBnZXRTYW1wbGVGaWVsZFZhbHVlLCBkZXRlY3RUeXBlLCBhbGwgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlU2NoZW1hID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlKSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGVzID0gZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgoaGllcmFyY2h5LCBpbmRleE5vZGUpO1xuICBjb25zdCBtYXBwZWRSZWNvcmRzID0gJChyZWNvcmROb2RlcywgW1xuICAgIG1hcChuID0+IG1hcFJlY29yZChjcmVhdGVTYW1wbGVSZWNvcmQobiksIGluZGV4Tm9kZSkpLFxuICBdKTtcblxuICAvLyBhbHdheXMgaGFzIHJlY29yZCBrZXkgYW5kIHNvcnQga2V5XG4gIGNvbnN0IHNjaGVtYSA9IHtcbiAgICBzb3J0S2V5OiBhbGwuc3RyaW5nLFxuICAgIGtleTogYWxsLnN0cmluZyxcbiAgfTtcblxuICBjb25zdCBmaWVsZHNIYXMgPSBoYXMoc2NoZW1hKTtcbiAgY29uc3Qgc2V0RmllbGQgPSAoZmllbGROYW1lLCB2YWx1ZSkgPT4ge1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgdGhpc1R5cGUgPSBkZXRlY3RUeXBlKHZhbHVlKTtcbiAgICBpZiAoZmllbGRzSGFzKGZpZWxkTmFtZSkpIHtcbiAgICAgIGlmIChzY2hlbWFbZmllbGROYW1lXSAhPT0gdGhpc1R5cGUpIHtcbiAgICAgICAgc2NoZW1hW2ZpZWxkTmFtZV0gPSBhbGwuc3RyaW5nO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzY2hlbWFbZmllbGROYW1lXSA9IHRoaXNUeXBlO1xuICAgIH1cbiAgfTtcblxuICBmb3IgKGNvbnN0IG1hcHBlZFJlYyBvZiBtYXBwZWRSZWNvcmRzKSB7XG4gICAgZm9yIChjb25zdCBmIGluIG1hcHBlZFJlYykge1xuICAgICAgc2V0RmllbGQoZiwgbWFwcGVkUmVjW2ZdKTtcbiAgICB9XG4gIH1cblxuICAvLyByZXR1cmluZyBhbiBhcnJheSBvZiB7bmFtZSwgdHlwZX1cbiAgcmV0dXJuICQoc2NoZW1hLCBbXG4gICAga2V5cyxcbiAgICBtYXAoayA9PiAoeyBuYW1lOiBrLCB0eXBlOiBzY2hlbWFba10ubmFtZSB9KSksXG4gICAgZmlsdGVyKHMgPT4gcy5uYW1lICE9PSAnc29ydEtleScpLFxuICAgIG9yZGVyQnkoJ25hbWUnLCBbJ2Rlc2MnXSksIC8vIHJldmVyc2UgYXBsaGFcbiAgICBjb25jYXQoW3sgbmFtZTogJ3NvcnRLZXknLCB0eXBlOiBhbGwuc3RyaW5nLm5hbWUgfV0pLCAvLyBzb3J0S2V5IG9uIGVuZFxuICAgIHJldmVyc2UsIC8vIHNvcnRLZXkgZmlyc3QsIHRoZW4gcmVzdCBhcmUgYWxwaGFiZXRpY2FsXG4gIF0pO1xufTtcblxuY29uc3QgY3JlYXRlU2FtcGxlUmVjb3JkID0gcmVjb3JkTm9kZSA9PiBjb25zdHJ1Y3RSZWNvcmQoXG4gIHJlY29yZE5vZGUsXG4gIGdldFNhbXBsZUZpZWxkVmFsdWUsXG4gIHJlY29yZE5vZGUucGFyZW50KCkubm9kZUtleSgpLFxuKTtcbiIsImV4cG9ydCBkZWZhdWx0ICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDpcbiAgICAgICAgICAgIHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6XG4gICAgICAgICAgICB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pO1xuIiwiXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxudmFyIGluaXRlZCA9IGZhbHNlO1xuZnVuY3Rpb24gaW5pdCAoKSB7XG4gIGluaXRlZCA9IHRydWU7XG4gIHZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2RlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgbG9va3VwW2ldID0gY29kZVtpXVxuICAgIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxuICB9XG5cbiAgcmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG4gIHJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICBpZiAoIWluaXRlZCkge1xuICAgIGluaXQoKTtcbiAgfVxuICB2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXG4gIGlmIChsZW4gJSA0ID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG4gIH1cblxuICAvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuICAvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG4gIC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuICAvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcbiAgLy8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuICBwbGFjZUhvbGRlcnMgPSBiNjRbbGVuIC0gMl0gPT09ICc9JyA/IDIgOiBiNjRbbGVuIC0gMV0gPT09ICc9JyA/IDEgOiAwXG5cbiAgLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG4gIGFyciA9IG5ldyBBcnIobGVuICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cbiAgLy8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuICBsID0gcGxhY2VIb2xkZXJzID4gMCA/IGxlbiAtIDQgOiBsZW5cblxuICB2YXIgTCA9IDBcblxuICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTgpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDEyKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8IHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMyldXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDE2KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxMCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgNCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDYgJiAweDNGXSArIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG4gICAgb3V0cHV0LnB1c2godHJpcGxldFRvQmFzZTY0KHRtcCkpXG4gIH1cbiAgcmV0dXJuIG91dHB1dC5qb2luKCcnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgaWYgKCFpbml0ZWQpIHtcbiAgICBpbml0KCk7XG4gIH1cbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgb3V0cHV0ID0gJydcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayh1aW50OCwgaSwgKGkgKyBtYXhDaHVua0xlbmd0aCkgPiBsZW4yID8gbGVuMiA6IChpICsgbWF4Q2h1bmtMZW5ndGgpKSlcbiAgfVxuXG4gIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcbiAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcbiAgICB0bXAgPSB1aW50OFtsZW4gLSAxXVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDJdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz09J1xuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyAodWludDhbbGVuIC0gMV0pXG4gICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMTBdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXVxuICAgIG91dHB1dCArPSAnPSdcbiAgfVxuXG4gIHBhcnRzLnB1c2gob3V0cHV0KVxuXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gcmVhZCAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cml0ZSAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5leHBvcnQgZGVmYXVsdCBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cblxuaW1wb3J0ICogYXMgYmFzZTY0IGZyb20gJy4vYmFzZTY0J1xuaW1wb3J0ICogYXMgaWVlZTc1NCBmcm9tICcuL2llZWU3NTQnXG5pbXBvcnQgaXNBcnJheSBmcm9tICcuL2lzQXJyYXknXG5cbmV4cG9ydCB2YXIgSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBEdWUgdG8gdmFyaW91cyBicm93c2VyIGJ1Z3MsIHNvbWV0aW1lcyB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uIHdpbGwgYmUgdXNlZCBldmVuXG4gKiB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHR5cGVkIGFycmF5cy5cbiAqXG4gKiBOb3RlOlxuICpcbiAqICAgLSBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsXG4gKiAgICAgU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzguXG4gKlxuICogICAtIENocm9tZSA5LTEwIGlzIG1pc3NpbmcgdGhlIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24uXG4gKlxuICogICAtIElFMTAgaGFzIGEgYnJva2VuIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhcnJheXMgb2ZcbiAqICAgICBpbmNvcnJlY3QgbGVuZ3RoIGluIHNvbWUgc2l0dWF0aW9ucy5cblxuICogV2UgZGV0ZWN0IHRoZXNlIGJ1Z2d5IGJyb3dzZXJzIGFuZCBzZXQgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYCB0byBgZmFsc2VgIHNvIHRoZXlcbiAqIGdldCB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uLCB3aGljaCBpcyBzbG93ZXIgYnV0IGJlaGF2ZXMgY29ycmVjdGx5LlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUICE9PSB1bmRlZmluZWRcbiAgPyBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVFxuICA6IHRydWVcblxuLypcbiAqIEV4cG9ydCBrTWF4TGVuZ3RoIGFmdGVyIHR5cGVkIGFycmF5IHN1cHBvcnQgaXMgZGV0ZXJtaW5lZC5cbiAqL1xudmFyIF9rTWF4TGVuZ3RoID0ga01heExlbmd0aCgpXG5leHBvcnQge19rTWF4TGVuZ3RoIGFzIGtNYXhMZW5ndGh9O1xuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICByZXR1cm4gdHJ1ZTtcbiAgLy8gcm9sbHVwIGlzc3Vlc1xuICAvLyB0cnkge1xuICAvLyAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAvLyAgIGFyci5fX3Byb3RvX18gPSB7XG4gIC8vICAgICBfX3Byb3RvX186IFVpbnQ4QXJyYXkucHJvdG90eXBlLFxuICAvLyAgICAgZm9vOiBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gIC8vICAgfVxuICAvLyAgIHJldHVybiBhcnIuZm9vKCkgPT09IDQyICYmIC8vIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkXG4gIC8vICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgJiYgLy8gY2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIC8vICAgICAgIGFyci5zdWJhcnJheSgxLCAxKS5ieXRlTGVuZ3RoID09PSAwIC8vIGllMTAgaGFzIGJyb2tlbiBgc3ViYXJyYXlgXG4gIC8vIH0gY2F0Y2ggKGUpIHtcbiAgLy8gICByZXR1cm4gZmFsc2VcbiAgLy8gfVxufVxuXG5mdW5jdGlvbiBrTWF4TGVuZ3RoICgpIHtcbiAgcmV0dXJuIEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gICAgPyAweDdmZmZmZmZmXG4gICAgOiAweDNmZmZmZmZmXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAodGhhdCwgbGVuZ3RoKSB7XG4gIGlmIChrTWF4TGVuZ3RoKCkgPCBsZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCB0eXBlZCBhcnJheSBsZW5ndGgnKVxuICB9XG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoYXQgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIGlmICh0aGF0ID09PSBudWxsKSB7XG4gICAgICB0aGF0ID0gbmV3IEJ1ZmZlcihsZW5ndGgpXG4gICAgfVxuICAgIHRoYXQubGVuZ3RoID0gbGVuZ3RoXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgaGF2ZSB0aGVpclxuICogcHJvdG90eXBlIGNoYW5nZWQgdG8gYEJ1ZmZlci5wcm90b3R5cGVgLiBGdXJ0aGVybW9yZSwgYEJ1ZmZlcmAgaXMgYSBzdWJjbGFzcyBvZlxuICogYFVpbnQ4QXJyYXlgLCBzbyB0aGUgcmV0dXJuZWQgaW5zdGFuY2VzIHdpbGwgaGF2ZSBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgbWV0aG9kc1xuICogYW5kIHRoZSBgVWludDhBcnJheWAgbWV0aG9kcy4gU3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXRcbiAqIHJldHVybnMgYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogVGhlIGBVaW50OEFycmF5YCBwcm90b3R5cGUgcmVtYWlucyB1bm1vZGlmaWVkLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiYgISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIGlmICh0eXBlb2YgZW5jb2RpbmdPck9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0lmIGVuY29kaW5nIGlzIHNwZWNpZmllZCB0aGVuIHRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJ1xuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gYWxsb2NVbnNhZmUodGhpcywgYXJnKVxuICB9XG4gIHJldHVybiBmcm9tKHRoaXMsIGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxuLy8gVE9ETzogTGVnYWN5LCBub3QgbmVlZGVkIGFueW1vcmUuIFJlbW92ZSBpbiBuZXh0IG1ham9yIHZlcnNpb24uXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gZnJvbSAodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBhIG51bWJlcicpXG4gIH1cblxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnJvbVN0cmluZyh0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldClcbiAgfVxuXG4gIHJldHVybiBmcm9tT2JqZWN0KHRoYXQsIHZhbHVlKVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIEJ1ZmZlcihhcmcsIGVuY29kaW5nKSBidXQgdGhyb3dzIGEgVHlwZUVycm9yXG4gKiBpZiB2YWx1ZSBpcyBhIG51bWJlci5cbiAqIEJ1ZmZlci5mcm9tKHN0clssIGVuY29kaW5nXSlcbiAqIEJ1ZmZlci5mcm9tKGFycmF5KVxuICogQnVmZmVyLmZyb20oYnVmZmVyKVxuICogQnVmZmVyLmZyb20oYXJyYXlCdWZmZXJbLCBieXRlT2Zmc2V0WywgbGVuZ3RoXV0pXG4gKiovXG5CdWZmZXIuZnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBmcm9tKG51bGwsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbmlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICBCdWZmZXIucHJvdG90eXBlLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXkucHJvdG90eXBlXG4gIEJ1ZmZlci5fX3Byb3RvX18gPSBVaW50OEFycmF5XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wuc3BlY2llcyAmJlxuICAgICAgQnVmZmVyW1N5bWJvbC5zcGVjaWVzXSA9PT0gQnVmZmVyKSB7XG4gICAgLy8gRml4IHN1YmFycmF5KCkgaW4gRVMyMDE2LiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvOTdcbiAgICAvLyBPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLCBTeW1ib2wuc3BlY2llcywge1xuICAgIC8vICAgdmFsdWU6IG51bGwsXG4gICAgLy8gICBjb25maWd1cmFibGU6IHRydWVcbiAgICAvLyB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydFNpemUgKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9IGVsc2UgaWYgKHNpemUgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG5lZ2F0aXZlJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAodGhhdCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXR0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2MobnVsbCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlICh0aGF0LCBzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgKytpKSB7XG4gICAgICB0aGF0W2ldID0gMFxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gQnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gU2xvd0J1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICovXG5CdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHRoYXQsIHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGlmICghQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJlbmNvZGluZ1wiIG11c3QgYmUgYSB2YWxpZCBzdHJpbmcgZW5jb2RpbmcnKVxuICB9XG5cbiAgdmFyIGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuXG4gIHZhciBhY3R1YWwgPSB0aGF0LndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG5cbiAgaWYgKGFjdHVhbCAhPT0gbGVuZ3RoKSB7XG4gICAgLy8gV3JpdGluZyBhIGhleCBzdHJpbmcsIGZvciBleGFtcGxlLCB0aGF0IGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycyB3aWxsXG4gICAgLy8gY2F1c2UgZXZlcnl0aGluZyBhZnRlciB0aGUgZmlyc3QgaW52YWxpZCBjaGFyYWN0ZXIgdG8gYmUgaWdub3JlZC4gKGUuZy5cbiAgICAvLyAnYWJ4eGNkJyB3aWxsIGJlIHRyZWF0ZWQgYXMgJ2FiJylcbiAgICB0aGF0ID0gdGhhdC5zbGljZSgwLCBhY3R1YWwpXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlMaWtlICh0aGF0LCBhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyICh0aGF0LCBhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gIGFycmF5LmJ5dGVMZW5ndGggLy8gdGhpcyB0aHJvd3MgaWYgYGFycmF5YCBpcyBub3QgYSB2YWxpZCBBcnJheUJ1ZmZlclxuXG4gIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdvZmZzZXRcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgKyAobGVuZ3RoIHx8IDApKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ2xlbmd0aFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChieXRlT2Zmc2V0ID09PSB1bmRlZmluZWQgJiYgbGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5KVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldClcbiAgfSBlbHNlIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gYXJyYXlcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgdGhhdCA9IGZyb21BcnJheUxpa2UodGhhdCwgYXJyYXkpXG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAodGhhdCwgb2JqKSB7XG4gIGlmIChpbnRlcm5hbElzQnVmZmVyKG9iaikpIHtcbiAgICB2YXIgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbilcblxuICAgIGlmICh0aGF0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoYXRcbiAgICB9XG5cbiAgICBvYmouY29weSh0aGF0LCAwLCAwLCBsZW4pXG4gICAgcmV0dXJuIHRoYXRcbiAgfVxuXG4gIGlmIChvYmopIHtcbiAgICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgb2JqLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB8fCAnbGVuZ3RoJyBpbiBvYmopIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ251bWJlcicgfHwgaXNuYW4ob2JqLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCAwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqKVxuICAgIH1cblxuICAgIGlmIChvYmoudHlwZSA9PT0gJ0J1ZmZlcicgJiYgaXNBcnJheShvYmouZGF0YSkpIHtcbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iai5kYXRhKVxuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCBvciBhcnJheS1saWtlIG9iamVjdC4nKVxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwga01heExlbmd0aCgpYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IGtNYXhMZW5ndGgoKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBrTWF4TGVuZ3RoKCkudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNsb3dCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAoK2xlbmd0aCAhPSBsZW5ndGgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbiAgICBsZW5ndGggPSAwXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5hbGxvYygrbGVuZ3RoKVxufVxuQnVmZmVyLmlzQnVmZmVyID0gaXNCdWZmZXI7XG5mdW5jdGlvbiBpbnRlcm5hbElzQnVmZmVyIChiKSB7XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIWludGVybmFsSXNCdWZmZXIoYSkgfHwgIWludGVybmFsSXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgbXVzdCBiZSBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuXG4gIHZhciB4ID0gYS5sZW5ndGhcbiAgdmFyIHkgPSBiLmxlbmd0aFxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldXG4gICAgICB5ID0gYltpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnbGF0aW4xJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIWlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5hbGxvYygwKVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICBsZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYnVmID0gbGlzdFtpXVxuICAgIGlmICghaW50ZXJuYWxJc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoaW50ZXJuYWxJc0J1ZmZlcihzdHJpbmcpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5sZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQXJyYXlCdWZmZXIuaXNWaWV3ID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAoQXJyYXlCdWZmZXIuaXNWaWV3KHN0cmluZykgfHwgc3RyaW5nIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5ieXRlTGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgc3RyaW5nID0gJycgKyBzdHJpbmdcbiAgfVxuXG4gIHZhciBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gbGVuICogMlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGxlbiA+Pj4gMVxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoIC8vIGFzc3VtZSB1dGY4XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIC8vIE5vIG5lZWQgdG8gdmVyaWZ5IHRoYXQgXCJ0aGlzLmxlbmd0aCA8PSBNQVhfVUlOVDMyXCIgc2luY2UgaXQncyBhIHJlYWQtb25seVxuICAvLyBwcm9wZXJ0eSBvZiBhIHR5cGVkIGFycmF5LlxuXG4gIC8vIFRoaXMgYmVoYXZlcyBuZWl0aGVyIGxpa2UgU3RyaW5nIG5vciBVaW50OEFycmF5IGluIHRoYXQgd2Ugc2V0IHN0YXJ0L2VuZFxuICAvLyB0byB0aGVpciB1cHBlci9sb3dlciBib3VuZHMgaWYgdGhlIHZhbHVlIHBhc3NlZCBpcyBvdXQgb2YgcmFuZ2UuXG4gIC8vIHVuZGVmaW5lZCBpcyBoYW5kbGVkIHNwZWNpYWxseSBhcyBwZXIgRUNNQS0yNjIgNnRoIEVkaXRpb24sXG4gIC8vIFNlY3Rpb24gMTMuMy4zLjcgUnVudGltZSBTZW1hbnRpY3M6IEtleWVkQmluZGluZ0luaXRpYWxpemF0aW9uLlxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCB8fCBzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICAvLyBSZXR1cm4gZWFybHkgaWYgc3RhcnQgPiB0aGlzLmxlbmd0aC4gRG9uZSBoZXJlIHRvIHByZXZlbnQgcG90ZW50aWFsIHVpbnQzMlxuICAvLyBjb2VyY2lvbiBmYWlsIGJlbG93LlxuICBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbmQgPD0gMCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgLy8gRm9yY2UgY29lcnNpb24gdG8gdWludDMyLiBUaGlzIHdpbGwgYWxzbyBjb2VyY2UgZmFsc2V5L05hTiB2YWx1ZXMgdG8gMC5cbiAgZW5kID4+Pj0gMFxuICBzdGFydCA+Pj49IDBcblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gVGhlIHByb3BlcnR5IGlzIHVzZWQgYnkgYEJ1ZmZlci5pc0J1ZmZlcmAgYW5kIGBpcy1idWZmZXJgIChpbiBTYWZhcmkgNS03KSB0byBkZXRlY3Rcbi8vIEJ1ZmZlciBpbnN0YW5jZXMuXG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuZnVuY3Rpb24gc3dhcCAoYiwgbiwgbSkge1xuICB2YXIgaSA9IGJbbl1cbiAgYltuXSA9IGJbbV1cbiAgYlttXSA9IGlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMTYgPSBmdW5jdGlvbiBzd2FwMTYgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDIgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDE2LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAxKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDMyID0gZnVuY3Rpb24gc3dhcDMyICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAzMi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgMilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXA2NCA9IGZ1bmN0aW9uIHN3YXA2NCAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgOCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNjQtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gOCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDcpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDYpXG4gICAgc3dhcCh0aGlzLCBpICsgMiwgaSArIDUpXG4gICAgc3dhcCh0aGlzLCBpICsgMywgaSArIDQpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoIHwgMFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgaWYgKHRoaXMgPT09IGIpIHJldHVybiB0cnVlXG4gIHJldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLCBiKSA9PT0gMFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgdmFyIHN0ciA9ICcnXG4gIHZhciBtYXggPSBJTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgfVxuXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5kID0gdGFyZ2V0ID8gdGFyZ2V0Lmxlbmd0aCA6IDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzU3RhcnQgPSAwXG4gIH1cbiAgaWYgKHRoaXNFbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNFbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBlbmQgPiB0YXJnZXQubGVuZ3RoIHx8IHRoaXNTdGFydCA8IDAgfHwgdGhpc0VuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ291dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQgJiYgc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIHN0YXJ0ID4+Pj0gMFxuICBlbmQgPj4+PSAwXG4gIHRoaXNTdGFydCA+Pj49IDBcbiAgdGhpc0VuZCA+Pj49IDBcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0KSByZXR1cm4gMFxuXG4gIHZhciB4ID0gdGhpc0VuZCAtIHRoaXNTdGFydFxuICB2YXIgeSA9IGVuZCAtIHN0YXJ0XG4gIHZhciBsZW4gPSBNYXRoLm1pbih4LCB5KVxuXG4gIHZhciB0aGlzQ29weSA9IHRoaXMuc2xpY2UodGhpc1N0YXJ0LCB0aGlzRW5kKVxuICB2YXIgdGFyZ2V0Q29weSA9IHRhcmdldC5zbGljZShzdGFydCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAodGhpc0NvcHlbaV0gIT09IHRhcmdldENvcHlbaV0pIHtcbiAgICAgIHggPSB0aGlzQ29weVtpXVxuICAgICAgeSA9IHRhcmdldENvcHlbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG4vLyBGaW5kcyBlaXRoZXIgdGhlIGZpcnN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA+PSBgYnl0ZU9mZnNldGAsXG4vLyBPUiB0aGUgbGFzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPD0gYGJ5dGVPZmZzZXRgLlxuLy9cbi8vIEFyZ3VtZW50czpcbi8vIC0gYnVmZmVyIC0gYSBCdWZmZXIgdG8gc2VhcmNoXG4vLyAtIHZhbCAtIGEgc3RyaW5nLCBCdWZmZXIsIG9yIG51bWJlclxuLy8gLSBieXRlT2Zmc2V0IC0gYW4gaW5kZXggaW50byBgYnVmZmVyYDsgd2lsbCBiZSBjbGFtcGVkIHRvIGFuIGludDMyXG4vLyAtIGVuY29kaW5nIC0gYW4gb3B0aW9uYWwgZW5jb2RpbmcsIHJlbGV2YW50IGlzIHZhbCBpcyBhIHN0cmluZ1xuLy8gLSBkaXIgLSB0cnVlIGZvciBpbmRleE9mLCBmYWxzZSBmb3IgbGFzdEluZGV4T2ZcbmZ1bmN0aW9uIGJpZGlyZWN0aW9uYWxJbmRleE9mIChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICAvLyBFbXB0eSBidWZmZXIgbWVhbnMgbm8gbWF0Y2hcbiAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHJldHVybiAtMVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0XG4gIGlmICh0eXBlb2YgYnl0ZU9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IGJ5dGVPZmZzZXRcbiAgICBieXRlT2Zmc2V0ID0gMFxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPiAweDdmZmZmZmZmKSB7XG4gICAgYnl0ZU9mZnNldCA9IDB4N2ZmZmZmZmZcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgLTB4ODAwMDAwMDApIHtcbiAgICBieXRlT2Zmc2V0ID0gLTB4ODAwMDAwMDBcbiAgfVxuICBieXRlT2Zmc2V0ID0gK2J5dGVPZmZzZXQgIC8vIENvZXJjZSB0byBOdW1iZXIuXG4gIGlmIChpc05hTihieXRlT2Zmc2V0KSkge1xuICAgIC8vIGJ5dGVPZmZzZXQ6IGl0IGl0J3MgdW5kZWZpbmVkLCBudWxsLCBOYU4sIFwiZm9vXCIsIGV0Yywgc2VhcmNoIHdob2xlIGJ1ZmZlclxuICAgIGJ5dGVPZmZzZXQgPSBkaXIgPyAwIDogKGJ1ZmZlci5sZW5ndGggLSAxKVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXQ6IG5lZ2F0aXZlIG9mZnNldHMgc3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBidWZmZXJcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwKSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCArIGJ5dGVPZmZzZXRcbiAgaWYgKGJ5dGVPZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkge1xuICAgIGlmIChkaXIpIHJldHVybiAtMVxuICAgIGVsc2UgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggLSAxXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IDApIHtcbiAgICBpZiAoZGlyKSBieXRlT2Zmc2V0ID0gMFxuICAgIGVsc2UgcmV0dXJuIC0xXG4gIH1cblxuICAvLyBOb3JtYWxpemUgdmFsXG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIHZhbCA9IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gIH1cblxuICAvLyBGaW5hbGx5LCBzZWFyY2ggZWl0aGVyIGluZGV4T2YgKGlmIGRpciBpcyB0cnVlKSBvciBsYXN0SW5kZXhPZlxuICBpZiAoaW50ZXJuYWxJc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDB4RkYgLy8gU2VhcmNoIGZvciBhIGJ5dGUgdmFsdWUgWzAtMjU1XVxuICAgIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJlxuICAgICAgICB0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGRpcikge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCBbIHZhbCBdLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyJylcbn1cblxuZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICB2YXIgaW5kZXhTaXplID0gMVxuICB2YXIgYXJyTGVuZ3RoID0gYXJyLmxlbmd0aFxuICB2YXIgdmFsTGVuZ3RoID0gdmFsLmxlbmd0aFxuXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZW5jb2RpbmcgPT09ICd1Y3MyJyB8fCBlbmNvZGluZyA9PT0gJ3Vjcy0yJyB8fFxuICAgICAgICBlbmNvZGluZyA9PT0gJ3V0ZjE2bGUnIHx8IGVuY29kaW5nID09PSAndXRmLTE2bGUnKSB7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA8IDIgfHwgdmFsLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpbmRleFNpemUgPSAyXG4gICAgICBhcnJMZW5ndGggLz0gMlxuICAgICAgdmFsTGVuZ3RoIC89IDJcbiAgICAgIGJ5dGVPZmZzZXQgLz0gMlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGJ1ZiwgaSkge1xuICAgIGlmIChpbmRleFNpemUgPT09IDEpIHtcbiAgICAgIHJldHVybiBidWZbaV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ1Zi5yZWFkVUludDE2QkUoaSAqIGluZGV4U2l6ZSlcbiAgICB9XG4gIH1cblxuICB2YXIgaVxuICBpZiAoZGlyKSB7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPCBhcnJMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlYWQoYXJyLCBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIGZvdW5kSW5kZXggPSBpXG4gICAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbExlbmd0aCkgcmV0dXJuIGZvdW5kSW5kZXggKiBpbmRleFNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ICE9PSAtMSkgaSAtPSBpIC0gZm91bmRJbmRleFxuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGJ5dGVPZmZzZXQgKyB2YWxMZW5ndGggPiBhcnJMZW5ndGgpIGJ5dGVPZmZzZXQgPSBhcnJMZW5ndGggLSB2YWxMZW5ndGhcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGZvdW5kID0gdHJ1ZVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWxMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAocmVhZChhcnIsIGkgKyBqKSAhPT0gcmVhZCh2YWwsIGopKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuIGlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiB0aGlzLmluZGV4T2YodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykgIT09IC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIHRydWUpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZmFsc2UpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKHN0ckxlbiAlIDIgIT09IDApIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKGlzTmFOKHBhcnNlZCkpIHJldHVybiBpXG4gICAgYnVmW29mZnNldCArIGldID0gcGFyc2VkXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBsYXRpbjFXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBhc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHVjczJXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZylcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBvZmZzZXRbLCBsZW5ndGhdWywgZW5jb2RpbmddKVxuICB9IGVsc2UgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCB8IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICAvLyBsZWdhY3kgd3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpIC0gcmVtb3ZlIGluIHYwLjEzXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1ZmZlci53cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXRbLCBsZW5ndGhdKSBpcyBubyBsb25nZXIgc3VwcG9ydGVkJ1xuICAgIClcbiAgfVxuXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbGVuZ3RoID4gcmVtYWluaW5nKSBsZW5ndGggPSByZW1haW5pbmdcblxuICBpZiAoKHN0cmluZy5sZW5ndGggPiAwICYmIChsZW5ndGggPCAwIHx8IG9mZnNldCA8IDApKSB8fCBvZmZzZXQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIHdyaXRlIG91dHNpZGUgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIC8vIFdhcm5pbmc6IG1heExlbmd0aCBub3QgdGFrZW4gaW50byBhY2NvdW50IGluIGJhc2U2NFdyaXRlXG4gICAgICAgIHJldHVybiBiYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdWNzMldyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHV0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcbiAgdmFyIHJlcyA9IFtdXG5cbiAgdmFyIGkgPSBzdGFydFxuICB3aGlsZSAoaSA8IGVuZCkge1xuICAgIHZhciBmaXJzdEJ5dGUgPSBidWZbaV1cbiAgICB2YXIgY29kZVBvaW50ID0gbnVsbFxuICAgIHZhciBieXRlc1BlclNlcXVlbmNlID0gKGZpcnN0Qnl0ZSA+IDB4RUYpID8gNFxuICAgICAgOiAoZmlyc3RCeXRlID4gMHhERikgPyAzXG4gICAgICA6IChmaXJzdEJ5dGUgPiAweEJGKSA/IDJcbiAgICAgIDogMVxuXG4gICAgaWYgKGkgKyBieXRlc1BlclNlcXVlbmNlIDw9IGVuZCkge1xuICAgICAgdmFyIHNlY29uZEJ5dGUsIHRoaXJkQnl0ZSwgZm91cnRoQnl0ZSwgdGVtcENvZGVQb2ludFxuXG4gICAgICBzd2l0Y2ggKGJ5dGVzUGVyU2VxdWVuY2UpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmIChmaXJzdEJ5dGUgPCAweDgwKSB7XG4gICAgICAgICAgICBjb2RlUG9pbnQgPSBmaXJzdEJ5dGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHgxRikgPDwgMHg2IHwgKHNlY29uZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4QyB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKHRoaXJkQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0ZGICYmICh0ZW1wQ29kZVBvaW50IDwgMHhEODAwIHx8IHRlbXBDb2RlUG9pbnQgPiAweERGRkYpKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGZvdXJ0aEJ5dGUgPSBidWZbaSArIDNdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwICYmIChmb3VydGhCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweDEyIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweEMgfCAodGhpcmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKGZvdXJ0aEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweEZGRkYgJiYgdGVtcENvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGVQb2ludCA9PT0gbnVsbCkge1xuICAgICAgLy8gd2UgZGlkIG5vdCBnZW5lcmF0ZSBhIHZhbGlkIGNvZGVQb2ludCBzbyBpbnNlcnQgYVxuICAgICAgLy8gcmVwbGFjZW1lbnQgY2hhciAoVStGRkZEKSBhbmQgYWR2YW5jZSBvbmx5IDEgYnl0ZVxuICAgICAgY29kZVBvaW50ID0gMHhGRkZEXG4gICAgICBieXRlc1BlclNlcXVlbmNlID0gMVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50ID4gMHhGRkZGKSB7XG4gICAgICAvLyBlbmNvZGUgdG8gdXRmMTYgKHN1cnJvZ2F0ZSBwYWlyIGRhbmNlKVxuICAgICAgY29kZVBvaW50IC09IDB4MTAwMDBcbiAgICAgIHJlcy5wdXNoKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMClcbiAgICAgIGNvZGVQb2ludCA9IDB4REMwMCB8IGNvZGVQb2ludCAmIDB4M0ZGXG4gICAgfVxuXG4gICAgcmVzLnB1c2goY29kZVBvaW50KVxuICAgIGkgKz0gYnl0ZXNQZXJTZXF1ZW5jZVxuICB9XG5cbiAgcmV0dXJuIGRlY29kZUNvZGVQb2ludHNBcnJheShyZXMpXG59XG5cbi8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIyNzQ3MjcyLzY4MDc0MiwgdGhlIGJyb3dzZXIgd2l0aFxuLy8gdGhlIGxvd2VzdCBsaW1pdCBpcyBDaHJvbWUsIHdpdGggMHgxMDAwMCBhcmdzLlxuLy8gV2UgZ28gMSBtYWduaXR1ZGUgbGVzcywgZm9yIHNhZmV0eVxudmFyIE1BWF9BUkdVTUVOVFNfTEVOR1RIID0gMHgxMDAwXG5cbmZ1bmN0aW9uIGRlY29kZUNvZGVQb2ludHNBcnJheSAoY29kZVBvaW50cykge1xuICB2YXIgbGVuID0gY29kZVBvaW50cy5sZW5ndGhcbiAgaWYgKGxlbiA8PSBNQVhfQVJHVU1FTlRTX0xFTkdUSCkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY29kZVBvaW50cykgLy8gYXZvaWQgZXh0cmEgc2xpY2UoKVxuICB9XG5cbiAgLy8gRGVjb2RlIGluIGNodW5rcyB0byBhdm9pZCBcImNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZFwiLlxuICB2YXIgcmVzID0gJydcbiAgdmFyIGkgPSAwXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXG4gICAgICBTdHJpbmcsXG4gICAgICBjb2RlUG9pbnRzLnNsaWNlKGksIGkgKz0gTUFYX0FSR1VNRU5UU19MRU5HVEgpXG4gICAgKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0gJiAweDdGKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gbGF0aW4xU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiB1dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2kgKyAxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICB2YXIgbmV3QnVmXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIG5ld0J1ZiA9IHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZClcbiAgICBuZXdCdWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47ICsraSkge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ld0J1ZlxufVxuXG4vKlxuICogTmVlZCB0byBtYWtlIHN1cmUgdGhhdCBidWZmZXIgaXNuJ3QgdHJ5aW5nIHRvIHdyaXRlIG91dCBvZiBib3VuZHMuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT2Zmc2V0IChvZmZzZXQsIGV4dCwgbGVuZ3RoKSB7XG4gIGlmICgob2Zmc2V0ICUgMSkgIT09IDAgfHwgb2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ29mZnNldCBpcyBub3QgdWludCcpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBsZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdUcnlpbmcgdG8gYWNjZXNzIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludExFID0gZnVuY3Rpb24gcmVhZFVJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcbiAgfVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF1cbiAgdmFyIG11bCA9IDFcbiAgd2hpbGUgKGJ5dGVMZW5ndGggPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIHJlYWRVSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCA4KSB8IHRoaXNbb2Zmc2V0ICsgMV1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiByZWFkVUludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKCh0aGlzW29mZnNldF0pIHxcbiAgICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSkgK1xuICAgICAgKHRoaXNbb2Zmc2V0ICsgM10gKiAweDEwMDAwMDApXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50QkUgPSBmdW5jdGlvbiByZWFkSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGhcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1pXVxuICB3aGlsZSAoaSA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIHJlYWRJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gcmVhZEludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgMV0gfCAodGhpc1tvZmZzZXRdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgMjQpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdExFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdEJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiByZWFkRG91YmxlQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCA1MiwgOClcbn1cblxuZnVuY3Rpb24gY2hlY2tJbnQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAoIWludGVybmFsSXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZmZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHhmZiwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCAyKTsgaSA8IGo7ICsraSkge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgNCk7IGkgPCBqOyArK2kpIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gMFxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgLSAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgKyAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgOCwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICh0YXJnZXQsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXRTdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB0YXJnZXRTdGFydCA9IHRhcmdldC5sZW5ndGhcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwXG4gIGlmIChlbmQgPiAwICYmIGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDBcbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgdGhpcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAodGFyZ2V0U3RhcnQgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgaWYgKGVuZCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgKyBzdGFydFxuICB9XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG4gIHZhciBpXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yIChpID0gbGVuIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2UgaWYgKGxlbiA8IDEwMDAgfHwgIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gYXNjZW5kaW5nIGNvcHkgZnJvbSBzdGFydFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoY29kZSA8IDI1Nikge1xuICAgICAgICB2YWwgPSBjb2RlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMjU1XG4gIH1cblxuICAvLyBJbnZhbGlkIHJhbmdlcyBhcmUgbm90IHNldCB0byBhIGRlZmF1bHQsIHNvIGNhbiByYW5nZSBjaGVjayBlYXJseS5cbiAgaWYgKHN0YXJ0IDwgMCB8fCB0aGlzLmxlbmd0aCA8IHN0YXJ0IHx8IHRoaXMubGVuZ3RoIDwgZW5kKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ091dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgPj4+IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyB0aGlzLmxlbmd0aCA6IGVuZCA+Pj4gMFxuXG4gIGlmICghdmFsKSB2YWwgPSAwXG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgdGhpc1tpXSA9IHZhbFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYnl0ZXMgPSBpbnRlcm5hbElzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IHV0ZjhUb0J5dGVzKG5ldyBCdWZmZXIodmFsLCBlbmNvZGluZykudG9TdHJpbmcoKSlcbiAgICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rXFwvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyaW5ndHJpbShzdHIpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICB2YXIgY29kZVBvaW50XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICB2YXIgYnl0ZXMgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuXG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBpc25hbiAodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IHZhbCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuXG5cbi8vIHRoZSBmb2xsb3dpbmcgaXMgZnJvbSBpcy1idWZmZXIsIGFsc28gYnkgRmVyb3NzIEFib3VraGFkaWplaCBhbmQgd2l0aCBzYW1lIGxpc2VuY2Vcbi8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcbi8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcbmV4cG9ydCBmdW5jdGlvbiBpc0J1ZmZlcihvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmICghIW9iai5faXNCdWZmZXIgfHwgaXNGYXN0QnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikpXG59XG5cbmZ1bmN0aW9uIGlzRmFzdEJ1ZmZlciAob2JqKSB7XG4gIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG5cbi8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5mdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzRmFzdEJ1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtCdWZmZXJ9IGZyb20gJ2J1ZmZlcic7XG52YXIgaXNCdWZmZXJFbmNvZGluZyA9IEJ1ZmZlci5pc0VuY29kaW5nXG4gIHx8IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gICAgICAgc3dpdGNoIChlbmNvZGluZyAmJiBlbmNvZGluZy50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICBjYXNlICdoZXgnOiBjYXNlICd1dGY4JzogY2FzZSAndXRmLTgnOiBjYXNlICdhc2NpaSc6IGNhc2UgJ2JpbmFyeSc6IGNhc2UgJ2Jhc2U2NCc6IGNhc2UgJ3VjczInOiBjYXNlICd1Y3MtMic6IGNhc2UgJ3V0ZjE2bGUnOiBjYXNlICd1dGYtMTZsZSc6IGNhc2UgJ3Jhdyc6IHJldHVybiB0cnVlO1xuICAgICAgICAgZGVmYXVsdDogcmV0dXJuIGZhbHNlO1xuICAgICAgIH1cbiAgICAgfVxuXG5cbmZ1bmN0aW9uIGFzc2VydEVuY29kaW5nKGVuY29kaW5nKSB7XG4gIGlmIChlbmNvZGluZyAmJiAhaXNCdWZmZXJFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZyk7XG4gIH1cbn1cblxuLy8gU3RyaW5nRGVjb2RlciBwcm92aWRlcyBhbiBpbnRlcmZhY2UgZm9yIGVmZmljaWVudGx5IHNwbGl0dGluZyBhIHNlcmllcyBvZlxuLy8gYnVmZmVycyBpbnRvIGEgc2VyaWVzIG9mIEpTIHN0cmluZ3Mgd2l0aG91dCBicmVha2luZyBhcGFydCBtdWx0aS1ieXRlXG4vLyBjaGFyYWN0ZXJzLiBDRVNVLTggaXMgaGFuZGxlZCBhcyBwYXJ0IG9mIHRoZSBVVEYtOCBlbmNvZGluZy5cbi8vXG4vLyBAVE9ETyBIYW5kbGluZyBhbGwgZW5jb2RpbmdzIGluc2lkZSBhIHNpbmdsZSBvYmplY3QgbWFrZXMgaXQgdmVyeSBkaWZmaWN1bHRcbi8vIHRvIHJlYXNvbiBhYm91dCB0aGlzIGNvZGUsIHNvIGl0IHNob3VsZCBiZSBzcGxpdCB1cCBpbiB0aGUgZnV0dXJlLlxuLy8gQFRPRE8gVGhlcmUgc2hvdWxkIGJlIGEgdXRmOC1zdHJpY3QgZW5jb2RpbmcgdGhhdCByZWplY3RzIGludmFsaWQgVVRGLTggY29kZVxuLy8gcG9pbnRzIGFzIHVzZWQgYnkgQ0VTVS04LlxuZXhwb3J0IGZ1bmN0aW9uIFN0cmluZ0RlY29kZXIoZW5jb2RpbmcpIHtcbiAgdGhpcy5lbmNvZGluZyA9IChlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvWy1fXS8sICcnKTtcbiAgYXNzZXJ0RW5jb2RpbmcoZW5jb2RpbmcpO1xuICBzd2l0Y2ggKHRoaXMuZW5jb2RpbmcpIHtcbiAgICBjYXNlICd1dGY4JzpcbiAgICAgIC8vIENFU1UtOCByZXByZXNlbnRzIGVhY2ggb2YgU3Vycm9nYXRlIFBhaXIgYnkgMy1ieXRlc1xuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgLy8gVVRGLTE2IHJlcHJlc2VudHMgZWFjaCBvZiBTdXJyb2dhdGUgUGFpciBieSAyLWJ5dGVzXG4gICAgICB0aGlzLnN1cnJvZ2F0ZVNpemUgPSAyO1xuICAgICAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhciA9IHV0ZjE2RGV0ZWN0SW5jb21wbGV0ZUNoYXI7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgLy8gQmFzZS02NCBzdG9yZXMgMyBieXRlcyBpbiA0IGNoYXJzLCBhbmQgcGFkcyB0aGUgcmVtYWluZGVyLlxuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMztcbiAgICAgIHRoaXMuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSBiYXNlNjREZXRlY3RJbmNvbXBsZXRlQ2hhcjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aGlzLndyaXRlID0gcGFzc1Rocm91Z2hXcml0ZTtcbiAgICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEVub3VnaCBzcGFjZSB0byBzdG9yZSBhbGwgYnl0ZXMgb2YgYSBzaW5nbGUgY2hhcmFjdGVyLiBVVEYtOCBuZWVkcyA0XG4gIC8vIGJ5dGVzLCBidXQgQ0VTVS04IG1heSByZXF1aXJlIHVwIHRvIDYgKDMgYnl0ZXMgcGVyIHN1cnJvZ2F0ZSkuXG4gIHRoaXMuY2hhckJ1ZmZlciA9IG5ldyBCdWZmZXIoNik7XG4gIC8vIE51bWJlciBvZiBieXRlcyByZWNlaXZlZCBmb3IgdGhlIGN1cnJlbnQgaW5jb21wbGV0ZSBtdWx0aS1ieXRlIGNoYXJhY3Rlci5cbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSAwO1xuICAvLyBOdW1iZXIgb2YgYnl0ZXMgZXhwZWN0ZWQgZm9yIHRoZSBjdXJyZW50IGluY29tcGxldGUgbXVsdGktYnl0ZSBjaGFyYWN0ZXIuXG4gIHRoaXMuY2hhckxlbmd0aCA9IDA7XG59O1xuXG5cbi8vIHdyaXRlIGRlY29kZXMgdGhlIGdpdmVuIGJ1ZmZlciBhbmQgcmV0dXJucyBpdCBhcyBKUyBzdHJpbmcgdGhhdCBpc1xuLy8gZ3VhcmFudGVlZCB0byBub3QgY29udGFpbiBhbnkgcGFydGlhbCBtdWx0aS1ieXRlIGNoYXJhY3RlcnMuIEFueSBwYXJ0aWFsXG4vLyBjaGFyYWN0ZXIgZm91bmQgYXQgdGhlIGVuZCBvZiB0aGUgYnVmZmVyIGlzIGJ1ZmZlcmVkIHVwLCBhbmQgd2lsbCBiZVxuLy8gcmV0dXJuZWQgd2hlbiBjYWxsaW5nIHdyaXRlIGFnYWluIHdpdGggdGhlIHJlbWFpbmluZyBieXRlcy5cbi8vXG4vLyBOb3RlOiBDb252ZXJ0aW5nIGEgQnVmZmVyIGNvbnRhaW5pbmcgYW4gb3JwaGFuIHN1cnJvZ2F0ZSB0byBhIFN0cmluZ1xuLy8gY3VycmVudGx5IHdvcmtzLCBidXQgY29udmVydGluZyBhIFN0cmluZyB0byBhIEJ1ZmZlciAodmlhIGBuZXcgQnVmZmVyYCwgb3Jcbi8vIEJ1ZmZlciN3cml0ZSkgd2lsbCByZXBsYWNlIGluY29tcGxldGUgc3Vycm9nYXRlcyB3aXRoIHRoZSB1bmljb2RlXG4vLyByZXBsYWNlbWVudCBjaGFyYWN0ZXIuIFNlZSBodHRwczovL2NvZGVyZXZpZXcuY2hyb21pdW0ub3JnLzEyMTE3MzAwOS8gLlxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgdmFyIGNoYXJTdHIgPSAnJztcbiAgLy8gaWYgb3VyIGxhc3Qgd3JpdGUgZW5kZWQgd2l0aCBhbiBpbmNvbXBsZXRlIG11bHRpYnl0ZSBjaGFyYWN0ZXJcbiAgd2hpbGUgKHRoaXMuY2hhckxlbmd0aCkge1xuICAgIC8vIGRldGVybWluZSBob3cgbWFueSByZW1haW5pbmcgYnl0ZXMgdGhpcyBidWZmZXIgaGFzIHRvIG9mZmVyIGZvciB0aGlzIGNoYXJcbiAgICB2YXIgYXZhaWxhYmxlID0gKGJ1ZmZlci5sZW5ndGggPj0gdGhpcy5jaGFyTGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQpID9cbiAgICAgICAgdGhpcy5jaGFyTGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQgOlxuICAgICAgICBidWZmZXIubGVuZ3RoO1xuXG4gICAgLy8gYWRkIHRoZSBuZXcgYnl0ZXMgdG8gdGhlIGNoYXIgYnVmZmVyXG4gICAgYnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCB0aGlzLmNoYXJSZWNlaXZlZCwgMCwgYXZhaWxhYmxlKTtcbiAgICB0aGlzLmNoYXJSZWNlaXZlZCArPSBhdmFpbGFibGU7XG5cbiAgICBpZiAodGhpcy5jaGFyUmVjZWl2ZWQgPCB0aGlzLmNoYXJMZW5ndGgpIHtcbiAgICAgIC8vIHN0aWxsIG5vdCBlbm91Z2ggY2hhcnMgaW4gdGhpcyBidWZmZXI/IHdhaXQgZm9yIG1vcmUgLi4uXG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIGJ5dGVzIGJlbG9uZ2luZyB0byB0aGUgY3VycmVudCBjaGFyYWN0ZXIgZnJvbSB0aGUgYnVmZmVyXG4gICAgYnVmZmVyID0gYnVmZmVyLnNsaWNlKGF2YWlsYWJsZSwgYnVmZmVyLmxlbmd0aCk7XG5cbiAgICAvLyBnZXQgdGhlIGNoYXJhY3RlciB0aGF0IHdhcyBzcGxpdFxuICAgIGNoYXJTdHIgPSB0aGlzLmNoYXJCdWZmZXIuc2xpY2UoMCwgdGhpcy5jaGFyTGVuZ3RoKS50b1N0cmluZyh0aGlzLmVuY29kaW5nKTtcblxuICAgIC8vIENFU1UtODogbGVhZCBzdXJyb2dhdGUgKEQ4MDAtREJGRikgaXMgYWxzbyB0aGUgaW5jb21wbGV0ZSBjaGFyYWN0ZXJcbiAgICB2YXIgY2hhckNvZGUgPSBjaGFyU3RyLmNoYXJDb2RlQXQoY2hhclN0ci5sZW5ndGggLSAxKTtcbiAgICBpZiAoY2hhckNvZGUgPj0gMHhEODAwICYmIGNoYXJDb2RlIDw9IDB4REJGRikge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoICs9IHRoaXMuc3Vycm9nYXRlU2l6ZTtcbiAgICAgIGNoYXJTdHIgPSAnJztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICB0aGlzLmNoYXJSZWNlaXZlZCA9IHRoaXMuY2hhckxlbmd0aCA9IDA7XG5cbiAgICAvLyBpZiB0aGVyZSBhcmUgbm8gbW9yZSBieXRlcyBpbiB0aGlzIGJ1ZmZlciwganVzdCBlbWl0IG91ciBjaGFyXG4gICAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjaGFyU3RyO1xuICAgIH1cbiAgICBicmVhaztcbiAgfVxuXG4gIC8vIGRldGVybWluZSBhbmQgc2V0IGNoYXJMZW5ndGggLyBjaGFyUmVjZWl2ZWRcbiAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpO1xuXG4gIHZhciBlbmQgPSBidWZmZXIubGVuZ3RoO1xuICBpZiAodGhpcy5jaGFyTGVuZ3RoKSB7XG4gICAgLy8gYnVmZmVyIHRoZSBpbmNvbXBsZXRlIGNoYXJhY3RlciBieXRlcyB3ZSBnb3RcbiAgICBidWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIDAsIGJ1ZmZlci5sZW5ndGggLSB0aGlzLmNoYXJSZWNlaXZlZCwgZW5kKTtcbiAgICBlbmQgLT0gdGhpcy5jaGFyUmVjZWl2ZWQ7XG4gIH1cblxuICBjaGFyU3RyICs9IGJ1ZmZlci50b1N0cmluZyh0aGlzLmVuY29kaW5nLCAwLCBlbmQpO1xuXG4gIHZhciBlbmQgPSBjaGFyU3RyLmxlbmd0aCAtIDE7XG4gIHZhciBjaGFyQ29kZSA9IGNoYXJTdHIuY2hhckNvZGVBdChlbmQpO1xuICAvLyBDRVNVLTg6IGxlYWQgc3Vycm9nYXRlIChEODAwLURCRkYpIGlzIGFsc28gdGhlIGluY29tcGxldGUgY2hhcmFjdGVyXG4gIGlmIChjaGFyQ29kZSA+PSAweEQ4MDAgJiYgY2hhckNvZGUgPD0gMHhEQkZGKSB7XG4gICAgdmFyIHNpemUgPSB0aGlzLnN1cnJvZ2F0ZVNpemU7XG4gICAgdGhpcy5jaGFyTGVuZ3RoICs9IHNpemU7XG4gICAgdGhpcy5jaGFyUmVjZWl2ZWQgKz0gc2l6ZTtcbiAgICB0aGlzLmNoYXJCdWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIHNpemUsIDAsIHNpemUpO1xuICAgIGJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgMCwgMCwgc2l6ZSk7XG4gICAgcmV0dXJuIGNoYXJTdHIuc3Vic3RyaW5nKDAsIGVuZCk7XG4gIH1cblxuICAvLyBvciBqdXN0IGVtaXQgdGhlIGNoYXJTdHJcbiAgcmV0dXJuIGNoYXJTdHI7XG59O1xuXG4vLyBkZXRlY3RJbmNvbXBsZXRlQ2hhciBkZXRlcm1pbmVzIGlmIHRoZXJlIGlzIGFuIGluY29tcGxldGUgVVRGLTggY2hhcmFjdGVyIGF0XG4vLyB0aGUgZW5kIG9mIHRoZSBnaXZlbiBidWZmZXIuIElmIHNvLCBpdCBzZXRzIHRoaXMuY2hhckxlbmd0aCB0byB0aGUgYnl0ZVxuLy8gbGVuZ3RoIHRoYXQgY2hhcmFjdGVyLCBhbmQgc2V0cyB0aGlzLmNoYXJSZWNlaXZlZCB0byB0aGUgbnVtYmVyIG9mIGJ5dGVzXG4vLyB0aGF0IGFyZSBhdmFpbGFibGUgZm9yIHRoaXMgY2hhcmFjdGVyLlxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgLy8gZGV0ZXJtaW5lIGhvdyBtYW55IGJ5dGVzIHdlIGhhdmUgdG8gY2hlY2sgYXQgdGhlIGVuZCBvZiB0aGlzIGJ1ZmZlclxuICB2YXIgaSA9IChidWZmZXIubGVuZ3RoID49IDMpID8gMyA6IGJ1ZmZlci5sZW5ndGg7XG5cbiAgLy8gRmlndXJlIG91dCBpZiBvbmUgb2YgdGhlIGxhc3QgaSBieXRlcyBvZiBvdXIgYnVmZmVyIGFubm91bmNlcyBhblxuICAvLyBpbmNvbXBsZXRlIGNoYXIuXG4gIGZvciAoOyBpID4gMDsgaS0tKSB7XG4gICAgdmFyIGMgPSBidWZmZXJbYnVmZmVyLmxlbmd0aCAtIGldO1xuXG4gICAgLy8gU2VlIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVVRGLTgjRGVzY3JpcHRpb25cblxuICAgIC8vIDExMFhYWFhYXG4gICAgaWYgKGkgPT0gMSAmJiBjID4+IDUgPT0gMHgwNikge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gMjtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIDExMTBYWFhYXG4gICAgaWYgKGkgPD0gMiAmJiBjID4+IDQgPT0gMHgwRSkge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gMztcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIDExMTEwWFhYXG4gICAgaWYgKGkgPD0gMyAmJiBjID4+IDMgPT0gMHgxRSkge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gNDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGk7XG59O1xuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgdmFyIHJlcyA9ICcnO1xuICBpZiAoYnVmZmVyICYmIGJ1ZmZlci5sZW5ndGgpXG4gICAgcmVzID0gdGhpcy53cml0ZShidWZmZXIpO1xuXG4gIGlmICh0aGlzLmNoYXJSZWNlaXZlZCkge1xuICAgIHZhciBjciA9IHRoaXMuY2hhclJlY2VpdmVkO1xuICAgIHZhciBidWYgPSB0aGlzLmNoYXJCdWZmZXI7XG4gICAgdmFyIGVuYyA9IHRoaXMuZW5jb2Rpbmc7XG4gICAgcmVzICs9IGJ1Zi5zbGljZSgwLCBjcikudG9TdHJpbmcoZW5jKTtcbiAgfVxuXG4gIHJldHVybiByZXM7XG59O1xuXG5mdW5jdGlvbiBwYXNzVGhyb3VnaFdyaXRlKGJ1ZmZlcikge1xuICByZXR1cm4gYnVmZmVyLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcpO1xufVxuXG5mdW5jdGlvbiB1dGYxNkRldGVjdEluY29tcGxldGVDaGFyKGJ1ZmZlcikge1xuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGJ1ZmZlci5sZW5ndGggJSAyO1xuICB0aGlzLmNoYXJMZW5ndGggPSB0aGlzLmNoYXJSZWNlaXZlZCA/IDIgOiAwO1xufVxuXG5mdW5jdGlvbiBiYXNlNjREZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpIHtcbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSBidWZmZXIubGVuZ3RoICUgMztcbiAgdGhpcy5jaGFyTGVuZ3RoID0gdGhpcy5jaGFyUmVjZWl2ZWQgPyAzIDogMDtcbn1cbiIsImltcG9ydCB7Z2VuZXJhdGVTY2hlbWF9IGZyb20gXCIuL2luZGV4U2NoZW1hQ3JlYXRvclwiO1xuaW1wb3J0IHsgaGFzLCBpc1N0cmluZywgZGlmZmVyZW5jZSwgZmluZCB9IGZyb20gXCJsb2Rhc2gvZnBcIjtcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJzYWZlLWJ1ZmZlclwiO1xuaW1wb3J0IHtTdHJpbmdEZWNvZGVyfSBmcm9tIFwic3RyaW5nX2RlY29kZXJcIjtcbmltcG9ydCB7Z2V0VHlwZX0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgeyBpc1NvbWV0aGluZyB9IGZyb20gXCIuLi9jb21tb25cIjtcblxuZXhwb3J0IGNvbnN0IEJVRkZFUl9NQVhfQllURVMgPSA1MjQyODg7IC8vIDAuNU1iXG5cbmV4cG9ydCBjb25zdCBDT05USU5VRV9SRUFESU5HX1JFQ09SRFMgPSBcIkNPTlRJTlVFX1JFQURJTkdcIjtcbmV4cG9ydCBjb25zdCBSRUFEX1JFTUFJTklOR19URVhUID0gXCJSRUFEX1JFTUFJTklOR1wiO1xuZXhwb3J0IGNvbnN0IENBTkNFTF9SRUFEID0gXCJDQU5DRUxcIjtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4V3JpdGVyID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlLCByZWFkYWJsZVN0cmVhbSwgd3JpdGFibGVTdHJlYW0sIGVuZCkgPT4ge1xuICAgIGNvbnN0IHNjaGVtYSA9IGdlbmVyYXRlU2NoZW1hKGhpZXJhcmNoeSwgaW5kZXhOb2RlKTtcblxuICAgIHJldHVybiAoe1xuICAgICAgICByZWFkOiByZWFkKHJlYWRhYmxlU3RyZWFtLCBzY2hlbWEpLFxuICAgICAgICB1cGRhdGVJbmRleDogdXBkYXRlSW5kZXgocmVhZGFibGVTdHJlYW0sIHdyaXRhYmxlU3RyZWFtLCBzY2hlbWEsIGVuZClcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleFJlYWRlciA9IChoaWVyYXJjaHksIGluZGV4Tm9kZSwgcmVhZGFibGVTdHJlYW0pID0+IFxuICAgIHJlYWQoXG4gICAgICAgIHJlYWRhYmxlU3RyZWFtLCBcbiAgICAgICAgZ2VuZXJhdGVTY2hlbWEoaGllcmFyY2h5LCBpbmRleE5vZGUpXG4gICAgKTtcblxuY29uc3QgdXBkYXRlSW5kZXggPSAocmVhZGFibGVTdHJlYW0sIHdyaXRhYmxlU3RyZWFtLCBzY2hlbWEpID0+IGFzeW5jIChpdGVtc1RvV3JpdGUsIGtleXNUb1JlbW92ZSkgPT4ge1xuICAgIGNvbnN0IHdyaXRlID0gbmV3T3V0cHV0V3JpdGVyKEJVRkZFUl9NQVhfQllURVMsIHdyaXRhYmxlU3RyZWFtKTtcbiAgICBjb25zdCB3cml0dGVuSXRlbXMgPSBbXTsgXG4gICAgYXdhaXQgcmVhZChyZWFkYWJsZVN0cmVhbSwgc2NoZW1hKShcbiAgICAgICAgYXN5bmMgaW5kZXhlZEl0ZW0gPT4ge1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlZCA9IGZpbmQoaSA9PiBpbmRleGVkSXRlbS5rZXkgPT09IGkua2V5KShpdGVtc1RvV3JpdGUpO1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlZCA9IGZpbmQoayA9PiBpbmRleGVkSXRlbS5rZXkgPT09IGspKGtleXNUb1JlbW92ZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKGlzU29tZXRoaW5nKHJlbW92ZWQpKSBcbiAgICAgICAgICAgICAgICByZXR1cm4gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xuXG4gICAgICAgICAgICBpZihpc1NvbWV0aGluZyh1cGRhdGVkKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlcmlhbGl6ZWRJdGVtID0gIHNlcmlhbGl6ZUl0ZW0oc2NoZW1hLCB1cGRhdGVkKTtcbiAgICAgICAgICAgICAgICBhd2FpdCB3cml0ZShzZXJpYWxpemVkSXRlbSk7XG4gICAgICAgICAgICAgICAgd3JpdHRlbkl0ZW1zLnB1c2godXBkYXRlZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRlKFxuICAgICAgICAgICAgICAgICAgICBzZXJpYWxpemVJdGVtKHNjaGVtYSwgaW5kZXhlZEl0ZW0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gXG5cbiAgICAgICAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XG5cbiAgICAgICAgfSxcbiAgICAgICAgYXN5bmMgdGV4dCA9PiBhd2FpdCB3cml0ZSh0ZXh0KVxuICAgICk7XG5cbiAgICBpZih3cml0dGVuSXRlbXMubGVuZ3RoICE9PSBpdGVtc1RvV3JpdGUubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHRvQWRkID0gZGlmZmVyZW5jZShpdGVtc1RvV3JpdGUsIHdyaXR0ZW5JdGVtcyk7XG4gICAgICAgIGZvcihsZXQgYWRkZWQgb2YgdG9BZGQpIHtcbiAgICAgICAgICAgIGF3YWl0IHdyaXRlKFxuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZUl0ZW0oc2NoZW1hLCBhZGRlZClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYod3JpdHRlbkl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBwb3RlbnRpYWxseSBhcmUgbm8gcmVjb3Jkc1xuICAgICAgICBhd2FpdCB3cml0ZShcIlwiKTtcbiAgICB9XG5cbiAgICBhd2FpdCB3cml0ZSgpO1xuICAgIGF3YWl0IHdyaXRhYmxlU3RyZWFtLmVuZCgpO1xufTtcblxuY29uc3QgcmVhZCA9IChyZWFkYWJsZVN0cmVhbSwgc2NoZW1hKSA9PiBhc3luYyAob25HZXRJdGVtLCBvbkdldFRleHQpID0+IHtcbiAgICBjb25zdCByZWFkSW5wdXQgPSBuZXdJbnB1dFJlYWRlcihyZWFkYWJsZVN0cmVhbSk7XG4gICAgbGV0IHRleHQgPSBhd2FpdCByZWFkSW5wdXQoKTtcbiAgICBsZXQgc3RhdHVzID0gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xuICAgIHdoaWxlKHRleHQubGVuZ3RoID4gMCkge1xuXG4gICAgICAgIGlmKHN0YXR1cyA9PT0gUkVBRF9SRU1BSU5JTkdfVEVYVCkge1xuICAgICAgICAgICAgYXdhaXQgb25HZXRUZXh0KHRleHQpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZihzdGF0dXMgPT09IENBTkNFTF9SRUFEKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcm93VGV4dCA9IFwiXCI7XG4gICAgICAgIGxldCBjdXJyZW50Q2hhckluZGV4PTA7XG4gICAgICAgIGZvcihsZXQgY3VycmVudENoYXIgb2YgdGV4dCkge1xuICAgICAgICAgICAgcm93VGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcIlxcclwiKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzID0gYXdhaXQgb25HZXRJdGVtKFxuICAgICAgICAgICAgICAgICAgICBkZXNlcmlhbGl6ZVJvdyhzY2hlbWEsIHJvd1RleHQpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByb3dUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBpZihzdGF0dXMgPT09IFJFQURfUkVNQUlOSU5HX1RFWFQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudENoYXJJbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoY3VycmVudENoYXJJbmRleCA8IHRleHQubGVuZ3RoIC0xKSB7XG4gICAgICAgICAgICBhd2FpdCBvbkdldFRleHQodGV4dC5zdWJzdHJpbmcoY3VycmVudENoYXJJbmRleCArIDEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHQgPSBhd2FpdCByZWFkSW5wdXQoKTtcbiAgICB9XG5cbiAgICBhd2FpdCByZWFkYWJsZVN0cmVhbS5kZXN0cm95KCk7XG5cbn07XG5cbmNvbnN0IG5ld091dHB1dFdyaXRlciA9IChmbHVzaEJvdW5kYXJ5LCB3cml0YWJsZVN0cmVhbSkgPT4ge1xuICAgIFxuICAgIGxldCBjdXJyZW50QnVmZmVyID0gbnVsbDtcblxuICAgIHJldHVybiBhc3luYyAodGV4dCkgPT4ge1xuXG4gICAgICAgIGlmKGlzU3RyaW5nKHRleHQpICYmIGN1cnJlbnRCdWZmZXIgPT09IG51bGwpXG4gICAgICAgICAgICBjdXJyZW50QnVmZmVyID0gQnVmZmVyLmZyb20odGV4dCwgXCJ1dGY4XCIpO1xuICAgICAgICBlbHNlIGlmKGlzU3RyaW5nKHRleHQpKVxuICAgICAgICAgICAgY3VycmVudEJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoW1xuICAgICAgICAgICAgICAgIGN1cnJlbnRCdWZmZXIsXG4gICAgICAgICAgICAgICAgQnVmZmVyLmZyb20odGV4dCwgXCJ1dGY4XCIpXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgXG4gICAgICAgIGlmKGN1cnJlbnRCdWZmZXIgIT09IG51bGwgJiZcbiAgICAgICAgICAgIChjdXJyZW50QnVmZmVyLmxlbmd0aCA+IGZsdXNoQm91bmRhcnlcbiAgICAgICAgICAgICB8fCAhaXNTdHJpbmcodGV4dCkpKSB7XG5cbiAgICAgICAgICAgIGF3YWl0IHdyaXRhYmxlU3RyZWFtLndyaXRlKGN1cnJlbnRCdWZmZXIpO1xuICAgICAgICAgICAgY3VycmVudEJ1ZmZlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5jb25zdCBuZXdJbnB1dFJlYWRlciA9IChyZWFkYWJsZVN0cmVhbSkgPT4ge1xuXG4gICAgY29uc3QgZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKCd1dGY4Jyk7XG4gICAgbGV0IHJlbWFpbmluZ0J5dGVzID0gW107XG5cbiAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgIGxldCBuZXh0Qnl0ZXNCdWZmZXIgPSBhd2FpdCByZWFkYWJsZVN0cmVhbS5yZWFkKEJVRkZFUl9NQVhfQllURVMpO1xuICAgICAgICBjb25zdCByZW1haW5pbmdCdWZmZXIgPSBCdWZmZXIuZnJvbShyZW1haW5pbmdCeXRlcyk7XG5cbiAgICAgICAgaWYoIW5leHRCeXRlc0J1ZmZlcikgbmV4dEJ5dGVzQnVmZmVyID0gQnVmZmVyLmZyb20oW10pO1xuXG4gICAgICAgIGNvbnN0IG1vcmVUb1JlYWQgPSBuZXh0Qnl0ZXNCdWZmZXIubGVuZ3RoID09PSBCVUZGRVJfTUFYX0JZVEVTO1xuXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoXG4gICAgICAgICAgICBbcmVtYWluaW5nQnVmZmVyLCBuZXh0Qnl0ZXNCdWZmZXJdLFxuICAgICAgICAgICAgcmVtYWluaW5nQnVmZmVyLmxlbmd0aCArIG5leHRCeXRlc0J1ZmZlci5sZW5ndGgpO1xuXG4gICAgICAgIGNvbnN0IHRleHQgPSBkZWNvZGVyLndyaXRlKGJ1ZmZlcik7XG4gICAgICAgIHJlbWFpbmluZ0J5dGVzID0gZGVjb2Rlci5lbmQoYnVmZmVyKTtcblxuICAgICAgICBpZighbW9yZVRvUmVhZCAmJiByZW1haW5pbmdCeXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBpZiBmb3IgYW55IHJlYXNvbiwgd2UgaGF2ZSByZW1haW5pbmcgYnl0ZXMgYXQgdGhlIGVuZFxuICAgICAgICAgICAgLy8gb2YgdGhlIHN0cmVhbSwganVzdCBkaXNjYXJkIC0gZG9udCBzZWUgd2h5IHRoaXMgc2hvdWxkXG4gICAgICAgICAgICAvLyBldmVyIGhhcHBlbiwgYnV0IGlmIGl0IGRvZXMsIGl0IGNvdWxkIGNhdXNlIGEgc3RhY2sgb3ZlcmZsb3dcbiAgICAgICAgICAgIHJlbWFpbmluZ0J5dGVzID0gW107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9O1xufTtcblxuY29uc3QgZGVzZXJpYWxpemVSb3cgPSAoc2NoZW1hLCByb3dUZXh0KSA9PiB7XG4gICAgbGV0IGN1cnJlbnRQcm9wSW5kZXggPSAwO1xuICAgIGxldCBjdXJyZW50Q2hhckluZGV4ID0gMDtcbiAgICBsZXQgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XG4gICAgbGV0IGlzRXNjYXBlZCA9IGZhbHNlO1xuICAgIGNvbnN0IGl0ZW0gPSB7fTtcblxuICAgIGNvbnN0IHNldEN1cnJlbnRQcm9wID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJyZW50UHJvcCA9IHNjaGVtYVtjdXJyZW50UHJvcEluZGV4XTtcbiAgICAgICAgY29uc3QgdHlwZSA9IGdldFR5cGUoY3VycmVudFByb3AudHlwZSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY3VycmVudFZhbHVlVGV4dCA9PT0gXCJcIlxuICAgICAgICAgICAgICAgICAgICAgID8gdHlwZS5nZXREZWZhdWx0VmFsdWUoKVxuICAgICAgICAgICAgICAgICAgICAgIDogdHlwZS5zYWZlUGFyc2VWYWx1ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCk7XG4gICAgICAgIGl0ZW1bY3VycmVudFByb3AubmFtZV0gPSB2YWx1ZTtcbiAgICB9O1xuICAgIFxuICAgIHdoaWxlKGN1cnJlbnRQcm9wSW5kZXggPCBzY2hlbWEubGVuZ3RoKSB7XG5cbiAgICAgICAgaWYoY3VycmVudENoYXJJbmRleCA8IHJvd1RleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2hhciA9IHJvd1RleHRbY3VycmVudENoYXJJbmRleF07XG4gICAgICAgICAgICBpZihpc0VzY2FwZWQpIHtcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCJyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCArPSBcIlxcclwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZVRleHQgKz0gY3VycmVudENoYXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlzRXNjYXBlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCIsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0Q3VycmVudFByb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQcm9wSW5kZXgrKztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoY3VycmVudENoYXIgPT09IFwiXFxcXFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzRXNjYXBlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyZW50Q2hhckluZGV4Kys7IFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICBzZXRDdXJyZW50UHJvcCgpO1xuICAgICAgICAgICAgY3VycmVudFByb3BJbmRleCsrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZW07XG59O1xuXG5leHBvcnQgY29uc3Qgc2VyaWFsaXplSXRlbSA9IChzY2hlbWEsIGl0ZW0pICA9PiB7XG5cbiAgICBsZXQgcm93VGV4dCA9IFwiXCJcblxuICAgIGZvcihsZXQgcHJvcCBvZiBzY2hlbWEpIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IGdldFR5cGUocHJvcC50eXBlKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBoYXMocHJvcC5uYW1lKShpdGVtKVxuICAgICAgICAgICAgICAgICAgICAgID8gaXRlbVtwcm9wLm5hbWVdXG4gICAgICAgICAgICAgICAgICAgICAgOiB0eXBlLmdldERlZmF1bHRWYWx1ZSgpXG4gICAgICAgIFxuICAgICAgICBjb25zdCB2YWxTdHIgPSB0eXBlLnN0cmluZ2lmeSh2YWx1ZSk7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHZhbFN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudENoYXIgPSB2YWxTdHJbaV07XG4gICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCIsXCIgXG4gICAgICAgICAgICAgICB8fCBjdXJyZW50Q2hhciA9PT0gXCJcXHJcIiBcbiAgICAgICAgICAgICAgIHx8IGN1cnJlbnRDaGFyID09PSBcIlxcXFxcIikge1xuICAgICAgICAgICAgICAgIHJvd1RleHQgKz0gXCJcXFxcXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcIlxcclwiKSB7XG4gICAgICAgICAgICAgICAgcm93VGV4dCArPSBcInJcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcm93VGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJvd1RleHQgKz0gXCIsXCI7XG4gICAgfVxuXG4gICAgcm93VGV4dCArPSBcIlxcclwiO1xuICAgIHJldHVybiByb3dUZXh0O1xufTsiLCJpbXBvcnQgbHVuciBmcm9tICdsdW5yJztcclxuaW1wb3J0IHtwcm9taXNlUmVhZGFibGVTdHJlYW19IGZyb20gXCIuL3Byb21pc2VSZWFkYWJsZVN0cmVhbVwiO1xyXG5pbXBvcnQgeyBjcmVhdGVJbmRleEZpbGUgfSBmcm9tICcuL3NoYXJkaW5nJztcclxuaW1wb3J0IHsgZ2VuZXJhdGVTY2hlbWEgfSBmcm9tICcuL2luZGV4U2NoZW1hQ3JlYXRvcic7XHJcbmltcG9ydCB7IGdldEluZGV4UmVhZGVyLCBDT05USU5VRV9SRUFESU5HX1JFQ09SRFMgfSBmcm9tICcuL3NlcmlhbGl6ZXInO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlYWRJbmRleCA9IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkcyA9IFtdO1xyXG4gIGNvbnN0IGRvUmVhZCA9IGl0ZXJhdGVJbmRleChcclxuICAgICAgICBhc3luYyBpdGVtID0+IHtcclxuICAgICAgcmVjb3Jkcy5wdXNoKGl0ZW0pO1xyXG4gICAgICByZXR1cm4gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xyXG4gICAgfSxcclxuICAgICAgICBhc3luYyAoKSA9PiByZWNvcmRzXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIGF3YWl0IGRvUmVhZChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBzZWFyY2hJbmRleCA9IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5LCBzZWFyY2hQaHJhc2UpID0+IHtcclxuICBjb25zdCByZWNvcmRzID0gW107XHJcbiAgY29uc3Qgc2NoZW1hID0gZ2VuZXJhdGVTY2hlbWEoaGllcmFyY2h5LCBpbmRleCk7XHJcbiAgY29uc3QgZG9SZWFkID0gaXRlcmF0ZUluZGV4KFxyXG4gICAgICAgIGFzeW5jIGl0ZW0gPT4ge1xyXG4gICAgICBjb25zdCBpZHggPSBsdW5yKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnJlZigna2V5Jyk7XHJcbiAgICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBzY2hlbWEpIHtcclxuICAgICAgICAgIHRoaXMuZmllbGQoZmllbGQubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYWRkKGl0ZW0pO1xyXG4gICAgICB9KTtcclxuICAgICAgY29uc3Qgc2VhcmNoUmVzdWx0cyA9IGlkeC5zZWFyY2goc2VhcmNoUGhyYXNlKTtcclxuICAgICAgaWYgKHNlYXJjaFJlc3VsdHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgaXRlbS5fc2VhcmNoUmVzdWx0ID0gc2VhcmNoUmVzdWx0c1swXTtcclxuICAgICAgICByZWNvcmRzLnB1c2goaXRlbSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcclxuICAgIH0sXHJcbiAgICAgICAgYXN5bmMgKCkgPT4gcmVjb3Jkc1xyXG4gICk7XHJcblxyXG4gIHJldHVybiBhd2FpdCBkb1JlYWQoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgaXRlcmF0ZUluZGV4ID0gKG9uR2V0SXRlbSwgZ2V0RmluYWxSZXN1bHQpID0+IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlYWRhYmxlU3RyZWFtID0gcHJvbWlzZVJlYWRhYmxlU3RyZWFtKFxyXG4gICAgICAgIGF3YWl0IGRhdGFzdG9yZS5yZWFkYWJsZUZpbGVTdHJlYW0oaW5kZXhlZERhdGFLZXkpXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IHJlYWQgPSBnZXRJbmRleFJlYWRlcihoaWVyYXJjaHksIGluZGV4LCByZWFkYWJsZVN0cmVhbSk7XHJcbiAgICBhd2FpdCByZWFkKG9uR2V0SXRlbSk7XHJcbiAgICByZXR1cm4gZ2V0RmluYWxSZXN1bHQoKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBpZiAoYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhpbmRleGVkRGF0YUtleSkpIHtcclxuICAgICAgdGhyb3cgZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGF3YWl0IGNyZWF0ZUluZGV4RmlsZShcclxuICAgICAgICBkYXRhc3RvcmUsXHJcbiAgICAgICAgaW5kZXhlZERhdGFLZXksXHJcbiAgICAgICAgaW5kZXgsXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG59O1xyXG4iLCJpbXBvcnQgeyBnZXRSZWNvcmRJbmZvIH0gZnJvbSBcIi4uL3JlY29yZEFwaS9yZWNvcmRJbmZvXCI7XHJcbmltcG9ydCB7IFxyXG4gICAgZ2V0UGFyZW50S2V5LCBnZXRMYXN0UGFydEluS2V5XHJcbn0gZnJvbSBcIi4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeVwiO1xyXG5pbXBvcnQgeyBrZXlTZXAgfSBmcm9tIFwiLi4vY29tbW9uXCI7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhEaXIgPSAoaGllcmFyY2h5LCBpbmRleEtleSkgPT4ge1xyXG5cclxuICAgIGNvbnN0IHBhcmVudEtleSA9IGdldFBhcmVudEtleShpbmRleEtleSk7XHJcblxyXG4gICAgaWYocGFyZW50S2V5ID09PSBcIlwiKSByZXR1cm4gaW5kZXhLZXk7XHJcbiAgICBpZihwYXJlbnRLZXkgPT09IGtleVNlcCkgcmV0dXJuIGluZGV4S2V5O1xyXG5cclxuICAgIGNvbnN0IHJlY29yZEluZm8gPSBnZXRSZWNvcmRJbmZvKFxyXG4gICAgICAgIGhpZXJhcmNoeSwgXHJcbiAgICAgICAgcGFyZW50S2V5KTtcclxuICAgICAgICBcclxuICAgIHJldHVybiByZWNvcmRJbmZvLmNoaWxkKFxyXG4gICAgICAgIGdldExhc3RQYXJ0SW5LZXkoaW5kZXhLZXkpKTtcclxufSIsImltcG9ydCB7IGZsYXR0ZW4sIG1lcmdlIH0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHtcclxuICBzYWZlS2V5LCBhcGlXcmFwcGVyLCAkLFxyXG4gIGV2ZW50cywgaXNOb25FbXB0eVN0cmluZyxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyByZWFkSW5kZXgsIHNlYXJjaEluZGV4IH0gZnJvbSAnLi4vaW5kZXhpbmcvcmVhZCc7XHJcbmltcG9ydCB7XHJcbiAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5LFxyXG4gIGdldFNoYXJkS2V5c0luUmFuZ2UsXHJcbn0gZnJvbSAnLi4vaW5kZXhpbmcvc2hhcmRpbmcnO1xyXG5pbXBvcnQge1xyXG4gIGdldEV4YWN0Tm9kZUZvcktleSwgaXNJbmRleCxcclxuICBpc1NoYXJkZWRJbmRleCxcclxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XHJcbmltcG9ydCB7IGdldEluZGV4RGlyIH0gZnJvbSBcIi4vZ2V0SW5kZXhEaXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBsaXN0SXRlbXMgPSBhcHAgPT4gYXN5bmMgKGluZGV4S2V5LCBvcHRpb25zKSA9PiB7XHJcbiAgaW5kZXhLZXkgPSBzYWZlS2V5KGluZGV4S2V5KTtcclxuICByZXR1cm4gYXBpV3JhcHBlcihcclxuICAgIGFwcCxcclxuICAgIGV2ZW50cy5pbmRleEFwaS5saXN0SXRlbXMsXHJcbiAgICBwZXJtaXNzaW9uLnJlYWRJbmRleC5pc0F1dGhvcml6ZWQoaW5kZXhLZXkpLFxyXG4gICAgeyBpbmRleEtleSwgb3B0aW9ucyB9LFxyXG4gICAgX2xpc3RJdGVtcywgYXBwLCBpbmRleEtleSwgb3B0aW9ucyxcclxuICApO1xyXG59XHJcblxyXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHsgcmFuZ2VTdGFydFBhcmFtczogbnVsbCwgcmFuZ2VFbmRQYXJhbXM6IG51bGwsIHNlYXJjaFBocmFzZTogbnVsbCB9O1xyXG5cclxuY29uc3QgX2xpc3RJdGVtcyA9IGFzeW5jIChhcHAsIGluZGV4S2V5LCBvcHRpb25zID0gZGVmYXVsdE9wdGlvbnMpID0+IHtcclxuICBjb25zdCB7IHNlYXJjaFBocmFzZSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMgfSA9ICQoe30sIFtcclxuICAgIG1lcmdlKG9wdGlvbnMpLFxyXG4gICAgbWVyZ2UoZGVmYXVsdE9wdGlvbnMpLFxyXG4gIF0pO1xyXG5cclxuICBjb25zdCBnZXRJdGVtcyA9IGFzeW5jIGluZGV4ZWREYXRhS2V5ID0+IChpc05vbkVtcHR5U3RyaW5nKHNlYXJjaFBocmFzZSlcclxuICAgID8gYXdhaXQgc2VhcmNoSW5kZXgoXHJcbiAgICAgIGFwcC5oaWVyYXJjaHksXHJcbiAgICAgIGFwcC5kYXRhc3RvcmUsXHJcbiAgICAgIGluZGV4Tm9kZSxcclxuICAgICAgaW5kZXhlZERhdGFLZXksXHJcbiAgICAgIHNlYXJjaFBocmFzZSxcclxuICAgIClcclxuICAgIDogYXdhaXQgcmVhZEluZGV4KFxyXG4gICAgICBhcHAuaGllcmFyY2h5LFxyXG4gICAgICBhcHAuZGF0YXN0b3JlLFxyXG4gICAgICBpbmRleE5vZGUsXHJcbiAgICAgIGluZGV4ZWREYXRhS2V5LFxyXG4gICAgKSk7XHJcblxyXG4gIGluZGV4S2V5ID0gc2FmZUtleShpbmRleEtleSk7XHJcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0RXhhY3ROb2RlRm9yS2V5KGFwcC5oaWVyYXJjaHkpKGluZGV4S2V5KTtcclxuICBjb25zdCBpbmRleERpciA9IGdldEluZGV4RGlyKGFwcC5oaWVyYXJjaHksIGluZGV4S2V5KTtcclxuXHJcbiAgaWYgKCFpc0luZGV4KGluZGV4Tm9kZSkpIHsgdGhyb3cgbmV3IEVycm9yKCdzdXBwbGllZCBrZXkgaXMgbm90IGFuIGluZGV4Jyk7IH1cclxuXHJcbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4Tm9kZSkpIHtcclxuICAgIGNvbnN0IHNoYXJkS2V5cyA9IGF3YWl0IGdldFNoYXJkS2V5c0luUmFuZ2UoXHJcbiAgICAgIGFwcCwgaW5kZXhOb2RlLCBpbmRleERpciwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMsXHJcbiAgICApO1xyXG4gICAgY29uc3QgaXRlbXMgPSBbXTtcclxuICAgIGZvciAoY29uc3QgayBvZiBzaGFyZEtleXMpIHtcclxuICAgICAgaXRlbXMucHVzaChhd2FpdCBnZXRJdGVtcyhrKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmxhdHRlbihpdGVtcyk7XHJcbiAgfVxyXG4gIHJldHVybiBhd2FpdCBnZXRJdGVtcyhcclxuICAgIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleShpbmRleERpciksXHJcbiAgKTtcclxufTtcclxuIiwiaW1wb3J0IHsgbWFwLCBpc1N0cmluZywgaGFzLCBzb21lIH0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHtcclxuICBnZXRFeGFjdE5vZGVGb3JLZXksXHJcbiAgZmluZEZpZWxkLCBnZXROb2RlLCBpc0dsb2JhbEluZGV4LFxyXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7IGxpc3RJdGVtcyB9IGZyb20gJy4uL2luZGV4QXBpL2xpc3RJdGVtcyc7XHJcbmltcG9ydCB7XHJcbiAgJCwgYXBpV3JhcHBlclN5bmMsIGV2ZW50cywgc2FmZUtleVxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IGdldEluZGV4S2V5X0Jhc2VkT25EZWNlbmRhbnQgfSBmcm9tICcuLi9pbmRleGluZy9zaGFyZGluZyc7XHJcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRDb250ZXh0ID0gYXBwID0+IHJlY29yZEtleSA9PiB7XHJcbiAgcmVjb3JkS2V5ID0gc2FmZUtleShyZWNvcmRLZXkpO1xyXG4gIHJldHVybiAgYXBpV3JhcHBlclN5bmMoXHJcbiAgICBhcHAsXHJcbiAgICBldmVudHMucmVjb3JkQXBpLmdldENvbnRleHQsXHJcbiAgICBwZXJtaXNzaW9uLnJlYWRSZWNvcmQuaXNBdXRob3JpemVkKHJlY29yZEtleSksXHJcbiAgICB7IHJlY29yZEtleSB9LFxyXG4gICAgX2dldENvbnRleHQsIGFwcCwgcmVjb3JkS2V5LFxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBfZ2V0Q29udGV4dCA9IChhcHAsIHJlY29yZEtleSkgPT4ge1xyXG4gIHJlY29yZEtleSA9IHNhZmVLZXkocmVjb3JkS2V5KTtcclxuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yS2V5KGFwcC5oaWVyYXJjaHkpKHJlY29yZEtleSk7XHJcblxyXG4gIGNvbnN0IGNhY2hlZFJlZmVyZW5jZUluZGV4ZXMgPSB7fTtcclxuXHJcbiAgY29uc3QgbGF6eUxvYWRSZWZlcmVuY2VJbmRleCA9IGFzeW5jICh0eXBlT3B0aW9ucykgPT4ge1xyXG4gICAgaWYgKCFoYXModHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5KShjYWNoZWRSZWZlcmVuY2VJbmRleGVzKSkge1xyXG4gICAgICBjYWNoZWRSZWZlcmVuY2VJbmRleGVzW3R5cGVPcHRpb25zLmluZGV4Tm9kZUtleV0gPSB7XHJcbiAgICAgICAgdHlwZU9wdGlvbnMsXHJcbiAgICAgICAgZGF0YTogYXdhaXQgcmVhZFJlZmVyZW5jZUluZGV4KFxyXG4gICAgICAgICAgYXBwLCByZWNvcmRLZXksIHR5cGVPcHRpb25zLFxyXG4gICAgICAgICksXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNhY2hlZFJlZmVyZW5jZUluZGV4ZXNbdHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5XTtcclxuICB9O1xyXG5cclxuICBjb25zdCBnZXRUeXBlT3B0aW9ucyA9IHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSA9PiAoaXNTdHJpbmcodHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKVxyXG4gICAgPyBmaW5kRmllbGQocmVjb3JkTm9kZSwgdHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKVxyXG4gICAgICAudHlwZU9wdGlvbnNcclxuICAgIDogdHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHJlZmVyZW5jZUV4aXN0czogYXN5bmMgKHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSwga2V5KSA9PiB7XHJcbiAgICAgIGNvbnN0IHR5cGVPcHRpb25zID0gZ2V0VHlwZU9wdGlvbnModHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKTtcclxuICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBsYXp5TG9hZFJlZmVyZW5jZUluZGV4KHR5cGVPcHRpb25zKTtcclxuICAgICAgcmV0dXJuIHNvbWUoaSA9PiBpLmtleSA9PT0ga2V5KShkYXRhKTtcclxuICAgIH0sXHJcbiAgICByZWZlcmVuY2VPcHRpb25zOiBhc3luYyAodHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKSA9PiB7XHJcbiAgICAgIGNvbnN0IHR5cGVPcHRpb25zID0gZ2V0VHlwZU9wdGlvbnModHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKTtcclxuICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBsYXp5TG9hZFJlZmVyZW5jZUluZGV4KHR5cGVPcHRpb25zKTtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9LFxyXG4gICAgcmVjb3JkTm9kZSxcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3QgcmVhZFJlZmVyZW5jZUluZGV4ID0gYXN5bmMgKGFwcCwgcmVjb3JkS2V5LCB0eXBlT3B0aW9ucykgPT4ge1xyXG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldE5vZGUoYXBwLmhpZXJhcmNoeSwgdHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5KTtcclxuICBjb25zdCBpbmRleEtleSA9IGlzR2xvYmFsSW5kZXgoaW5kZXhOb2RlKVxyXG4gICAgPyBpbmRleE5vZGUubm9kZUtleSgpXHJcbiAgICA6IGdldEluZGV4S2V5X0Jhc2VkT25EZWNlbmRhbnQoXHJcbiAgICAgIHJlY29yZEtleSwgaW5kZXhOb2RlLFxyXG4gICAgKTtcclxuXHJcbiAgY29uc3QgaXRlbXMgPSBhd2FpdCBsaXN0SXRlbXMoYXBwKShpbmRleEtleSk7XHJcbiAgcmV0dXJuICQoaXRlbXMsIFtcclxuICAgIG1hcChpID0+ICh7XHJcbiAgICAgIGtleTogaS5rZXksXHJcbiAgICAgIHZhbHVlOiBpW3R5cGVPcHRpb25zLmRpc3BsYXlWYWx1ZV0sXHJcbiAgICB9KSksXHJcbiAgXSk7XHJcbn07XHJcbiIsImltcG9ydCB7XHJcbiAgbWFwLCByZWR1Y2UsIGZpbHRlcixcclxuICBpc0VtcHR5LCBmbGF0dGVuLCBlYWNoLFxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBnZXRFeGFjdE5vZGVGb3JLZXkgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyB2YWxpZGF0ZUZpZWxkUGFyc2UsIHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzIH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5pbXBvcnQgeyAkLCBpc05vdGhpbmcsIGlzTm9uRW1wdHlTdHJpbmcgfSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBfZ2V0Q29udGV4dCB9IGZyb20gJy4vZ2V0Q29udGV4dCc7XHJcblxyXG5jb25zdCBmaWVsZFBhcnNlRXJyb3IgPSAoZmllbGROYW1lLCB2YWx1ZSkgPT4gKHtcclxuICBmaWVsZHM6IFtmaWVsZE5hbWVdLFxyXG4gIG1lc3NhZ2U6IGBDb3VsZCBub3QgcGFyc2UgZmllbGQgJHtmaWVsZE5hbWV9OiR7dmFsdWV9YCxcclxufSk7XHJcblxyXG5jb25zdCB2YWxpZGF0ZUFsbEZpZWxkUGFyc2UgPSAocmVjb3JkLCByZWNvcmROb2RlKSA9PiAkKHJlY29yZE5vZGUuZmllbGRzLCBbXHJcbiAgbWFwKGYgPT4gKHsgbmFtZTogZi5uYW1lLCBwYXJzZVJlc3VsdDogdmFsaWRhdGVGaWVsZFBhcnNlKGYsIHJlY29yZCkgfSkpLFxyXG4gIHJlZHVjZSgoZXJyb3JzLCBmKSA9PiB7XHJcbiAgICBpZiAoZi5wYXJzZVJlc3VsdC5zdWNjZXNzKSByZXR1cm4gZXJyb3JzO1xyXG4gICAgZXJyb3JzLnB1c2goXHJcbiAgICAgIGZpZWxkUGFyc2VFcnJvcihmLm5hbWUsIGYucGFyc2VSZXN1bHQudmFsdWUpLFxyXG4gICAgKTtcclxuICAgIHJldHVybiBlcnJvcnM7XHJcbiAgfSwgW10pLFxyXG5dKTtcclxuXHJcbmNvbnN0IHZhbGlkYXRlQWxsVHlwZUNvbnN0cmFpbnRzID0gYXN5bmMgKHJlY29yZCwgcmVjb3JkTm9kZSwgY29udGV4dCkgPT4ge1xyXG4gIGNvbnN0IGVycm9ycyA9IFtdO1xyXG4gIGZvciAoY29uc3QgZmllbGQgb2YgcmVjb3JkTm9kZS5maWVsZHMpIHtcclxuICAgICQoYXdhaXQgdmFsaWRhdGVUeXBlQ29uc3RyYWludHMoZmllbGQsIHJlY29yZCwgY29udGV4dCksIFtcclxuICAgICAgZmlsdGVyKGlzTm9uRW1wdHlTdHJpbmcpLFxyXG4gICAgICBtYXAobSA9PiAoeyBtZXNzYWdlOiBtLCBmaWVsZHM6IFtmaWVsZC5uYW1lXSB9KSksXHJcbiAgICAgIGVhY2goZSA9PiBlcnJvcnMucHVzaChlKSksXHJcbiAgICBdKTtcclxuICB9XHJcbiAgcmV0dXJuIGVycm9ycztcclxufTtcclxuXHJcbmNvbnN0IHJ1blJlY29yZFZhbGlkYXRpb25SdWxlcyA9IChyZWNvcmQsIHJlY29yZE5vZGUpID0+IHtcclxuICBjb25zdCBydW5WYWxpZGF0aW9uUnVsZSA9IChydWxlKSA9PiB7XHJcbiAgICBjb25zdCBpc1ZhbGlkID0gY29tcGlsZUV4cHJlc3Npb24ocnVsZS5leHByZXNzaW9uV2hlblZhbGlkKTtcclxuICAgIGNvbnN0IGV4cHJlc3Npb25Db250ZXh0ID0geyByZWNvcmQsIF8gfTtcclxuICAgIHJldHVybiAoaXNWYWxpZChleHByZXNzaW9uQ29udGV4dClcclxuICAgICAgPyB7IHZhbGlkOiB0cnVlIH1cclxuICAgICAgOiAoe1xyXG4gICAgICAgIHZhbGlkOiBmYWxzZSxcclxuICAgICAgICBmaWVsZHM6IHJ1bGUuaW52YWxpZEZpZWxkcyxcclxuICAgICAgICBtZXNzYWdlOiBydWxlLm1lc3NhZ2VXaGVuSW52YWxpZCxcclxuICAgICAgfSkpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAkKHJlY29yZE5vZGUudmFsaWRhdGlvblJ1bGVzLCBbXHJcbiAgICBtYXAocnVuVmFsaWRhdGlvblJ1bGUpLFxyXG4gICAgZmxhdHRlbixcclxuICAgIGZpbHRlcihyID0+IHIudmFsaWQgPT09IGZhbHNlKSxcclxuICAgIG1hcChyID0+ICh7IGZpZWxkczogci5maWVsZHMsIG1lc3NhZ2U6IHIubWVzc2FnZSB9KSksXHJcbiAgXSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgdmFsaWRhdGUgPSBhcHAgPT4gYXN5bmMgKHJlY29yZCwgY29udGV4dCkgPT4ge1xyXG4gIGNvbnRleHQgPSBpc05vdGhpbmcoY29udGV4dClcclxuICAgID8gX2dldENvbnRleHQoYXBwLCByZWNvcmQua2V5KVxyXG4gICAgOiBjb250ZXh0O1xyXG5cclxuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yS2V5KGFwcC5oaWVyYXJjaHkpKHJlY29yZC5rZXkpO1xyXG4gIGNvbnN0IGZpZWxkUGFyc2VGYWlscyA9IHZhbGlkYXRlQWxsRmllbGRQYXJzZShyZWNvcmQsIHJlY29yZE5vZGUpO1xyXG5cclxuICAvLyBub24gcGFyc2luZyB3b3VsZCBjYXVzZSBmdXJ0aGVyIGlzc3VlcyAtIGV4aXQgaGVyZVxyXG4gIGlmICghaXNFbXB0eShmaWVsZFBhcnNlRmFpbHMpKSB7IHJldHVybiAoeyBpc1ZhbGlkOiBmYWxzZSwgZXJyb3JzOiBmaWVsZFBhcnNlRmFpbHMgfSk7IH1cclxuXHJcbiAgY29uc3QgcmVjb3JkVmFsaWRhdGlvblJ1bGVGYWlscyA9IHJ1blJlY29yZFZhbGlkYXRpb25SdWxlcyhyZWNvcmQsIHJlY29yZE5vZGUpO1xyXG4gIGNvbnN0IHR5cGVDb250cmFpbnRGYWlscyA9IGF3YWl0IHZhbGlkYXRlQWxsVHlwZUNvbnN0cmFpbnRzKHJlY29yZCwgcmVjb3JkTm9kZSwgY29udGV4dCk7XHJcblxyXG4gIGlmIChpc0VtcHR5KGZpZWxkUGFyc2VGYWlscylcclxuICAgICAgICYmIGlzRW1wdHkocmVjb3JkVmFsaWRhdGlvblJ1bGVGYWlscylcclxuICAgICAgICYmIGlzRW1wdHkodHlwZUNvbnRyYWludEZhaWxzKSkge1xyXG4gICAgcmV0dXJuICh7IGlzVmFsaWQ6IHRydWUsIGVycm9yczogW10gfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKHtcclxuICAgIGlzVmFsaWQ6IGZhbHNlLFxyXG4gICAgZXJyb3JzOiBfLnVuaW9uKGZpZWxkUGFyc2VGYWlscywgdHlwZUNvbnRyYWludEZhaWxzLCByZWNvcmRWYWxpZGF0aW9uUnVsZUZhaWxzKSxcclxuICB9KTtcclxufTtcclxuIiwiaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHtcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbiAgaXNDb2xsZWN0aW9uUmVjb3JkLFxyXG4gIGlzUm9vdCxcclxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyAkLCBhbGxUcnVlLCBqb2luS2V5IH0gZnJvbSAnLi4vY29tbW9uJztcclxuXHJcbmNvbnN0IGVuc3VyZUNvbGxlY3Rpb25Jc0luaXRpYWxpc2VkID0gYXN5bmMgKGRhdGFzdG9yZSwgbm9kZSwgZGlyKSA9PiB7XHJcbiAgaWYgKCFhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGRpcikpIHtcclxuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoZGlyKTtcclxuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoam9pbktleShkaXIsIG5vZGUubm9kZUlkKSk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRpYWxpc2VSb290Q29sbGVjdGlvbnMgPSBhc3luYyAoZGF0YXN0b3JlLCBoaWVyYXJjaHkpID0+IHtcclxuICBjb25zdCByb290Q29sbGVjdGlvblJlY29yZCA9IGFsbFRydWUoXHJcbiAgICBuID0+IGlzUm9vdChuLnBhcmVudCgpKSxcclxuICAgIGlzQ29sbGVjdGlvblJlY29yZCxcclxuICApO1xyXG5cclxuICBjb25zdCBmbGF0aGllcmFyY2h5ID0gZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGhpZXJhcmNoeSk7XHJcblxyXG4gIGNvbnN0IGNvbGxlY3Rpb25SZWNvcmRzID0gJChmbGF0aGllcmFyY2h5LCBbXHJcbiAgICBmaWx0ZXIocm9vdENvbGxlY3Rpb25SZWNvcmQpLFxyXG4gIF0pO1xyXG5cclxuICBmb3IgKGNvbnN0IGNvbCBvZiBjb2xsZWN0aW9uUmVjb3Jkcykge1xyXG4gICAgYXdhaXQgZW5zdXJlQ29sbGVjdGlvbklzSW5pdGlhbGlzZWQoXHJcbiAgICAgIGRhdGFzdG9yZSxcclxuICAgICAgY29sLFxyXG4gICAgICBjb2wuY29sbGVjdGlvblBhdGhSZWd4KClcclxuICAgICk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRpYWxpc2VDaGlsZENvbGxlY3Rpb25zID0gYXN5bmMgKGFwcCwgcmVjb3JkSW5mbykgPT4ge1xyXG4gIGNvbnN0IGNoaWxkQ29sbGVjdGlvblJlY29yZHMgPSAkKHJlY29yZEluZm8ucmVjb3JkTm9kZSwgW1xyXG4gICAgbiA9PiBuLmNoaWxkcmVuLFxyXG4gICAgZmlsdGVyKGlzQ29sbGVjdGlvblJlY29yZCksXHJcbiAgXSk7XHJcblxyXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRDb2xsZWN0aW9uUmVjb3Jkcykge1xyXG4gICAgYXdhaXQgZW5zdXJlQ29sbGVjdGlvbklzSW5pdGlhbGlzZWQoXHJcbiAgICAgIGFwcC5kYXRhc3RvcmUsXHJcbiAgICAgIGNoaWxkLFxyXG4gICAgICByZWNvcmRJbmZvLmNoaWxkKGNoaWxkLmNvbGxlY3Rpb25OYW1lKSxcclxuICAgICk7XHJcbiAgfVxyXG59O1xyXG4iLCJpbXBvcnQge1xuICBqb2luS2V5LCBrZXlTZXAsIGdldEhhc2hDb2RlLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0TGFzdFBhcnRJbktleSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5cbmV4cG9ydCBjb25zdCBUUkFOU0FDVElPTlNfRk9MREVSID0gYCR7a2V5U2VwfS50cmFuc2FjdGlvbnNgO1xuZXhwb3J0IGNvbnN0IExPQ0tfRklMRU5BTUUgPSAnbG9jayc7XG5leHBvcnQgY29uc3QgTE9DS19GSUxFX0tFWSA9IGpvaW5LZXkoXG4gIFRSQU5TQUNUSU9OU19GT0xERVIsIExPQ0tfRklMRU5BTUUsXG4pO1xuZXhwb3J0IGNvbnN0IGlkU2VwID0gJyQnO1xuXG5jb25zdCBpc09mVHlwZSA9IHR5cCA9PiB0cmFucyA9PiB0cmFucy50cmFuc2FjdGlvblR5cGUgPT09IHR5cDtcblxuZXhwb3J0IGNvbnN0IENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04gPSAnY3JlYXRlJztcbmV4cG9ydCBjb25zdCBVUERBVEVfUkVDT1JEX1RSQU5TQUNUSU9OID0gJ3VwZGF0ZSc7XG5leHBvcnQgY29uc3QgREVMRVRFX1JFQ09SRF9UUkFOU0FDVElPTiA9ICdkZWxldGUnO1xuZXhwb3J0IGNvbnN0IEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OID0gJ2J1aWxkJztcblxuZXhwb3J0IGNvbnN0IGlzVXBkYXRlID0gaXNPZlR5cGUoVVBEQVRFX1JFQ09SRF9UUkFOU0FDVElPTik7XG5leHBvcnQgY29uc3QgaXNEZWxldGUgPSBpc09mVHlwZShERUxFVEVfUkVDT1JEX1RSQU5TQUNUSU9OKTtcbmV4cG9ydCBjb25zdCBpc0NyZWF0ZSA9IGlzT2ZUeXBlKENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04pO1xuZXhwb3J0IGNvbnN0IGlzQnVpbGRJbmRleCA9IGlzT2ZUeXBlKEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OKTtcblxuZXhwb3J0IGNvbnN0IGtleVRvRm9sZGVyTmFtZSA9IG5vZGVLZXkgPT4gZ2V0SGFzaENvZGUobm9kZUtleSk7XG5cbmV4cG9ydCBjb25zdCBnZXRUcmFuc2FjdGlvbklkID0gKHJlY29yZElkLCB0cmFuc2FjdGlvblR5cGUsIHVuaXF1ZUlkKSA9PiBcbiAgYCR7cmVjb3JkSWR9JHtpZFNlcH0ke3RyYW5zYWN0aW9uVHlwZX0ke2lkU2VwfSR7dW5pcXVlSWR9YDtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkSW5kZXhGb2xkZXIgPSAnLkJVSUxELSc7XG5leHBvcnQgY29uc3Qgbm9kZUtleUhhc2hGcm9tQnVpbGRGb2xkZXIgPSBmb2xkZXIgPT4gZm9sZGVyLnJlcGxhY2UoYnVpbGRJbmRleEZvbGRlciwgJycpO1xuXG5leHBvcnQgY29uc3QgaXNCdWlsZEluZGV4Rm9sZGVyID0ga2V5ID0+IGdldExhc3RQYXJ0SW5LZXkoa2V5KS5zdGFydHNXaXRoKGJ1aWxkSW5kZXhGb2xkZXIpO1xuXG5leHBvcnQgY29uc3QgSW5kZXhOb2RlS2V5Rm9sZGVyID0gaW5kZXhOb2RlS2V5ID0+IGpvaW5LZXkoXG4gIFRSQU5TQUNUSU9OU19GT0xERVIsXG4gIGJ1aWxkSW5kZXhGb2xkZXIgKyBrZXlUb0ZvbGRlck5hbWUoaW5kZXhOb2RlS2V5KSxcbik7XG5cbmV4cG9ydCBjb25zdCBJbmRleE5vZGVLZXlCYXRjaEZvbGRlciA9IChpbmRleE5vZGVLZXksIGNvdW50KSA9PiBcbiAgam9pbktleShJbmRleE5vZGVLZXlGb2xkZXIoaW5kZXhOb2RlS2V5KSwgTWF0aC5mbG9vcihjb3VudCAvIEJVSUxESU5ERVhfQkFUQ0hfQ09VTlQpLnRvU3RyaW5nKCkpO1xuXG5leHBvcnQgY29uc3QgSW5kZXhTaGFyZEtleUZvbGRlciA9IChpbmRleE5vZGVLZXksIGluZGV4U2hhcmRLZXkpID0+IFxuICBqb2luS2V5KEluZGV4Tm9kZUtleUZvbGRlcihpbmRleE5vZGVLZXkpLCBpbmRleFNoYXJkS2V5KTtcblxuZXhwb3J0IGNvbnN0IEJVSUxESU5ERVhfQkFUQ0hfQ09VTlQgPSAxMDAwO1xuZXhwb3J0IGNvbnN0IHRpbWVvdXRNaWxsaXNlY29uZHMgPSAzMCAqIDEwMDA7IC8vIDMwIHNlY3NcbmV4cG9ydCBjb25zdCBtYXhMb2NrUmV0cmllcyA9IDE7XG4iLCJpbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHsgam9pbktleSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXRMYXN0UGFydEluS2V5IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7XG4gIEluZGV4Tm9kZUtleUZvbGRlciwgQlVJTERJTkRFWF9CQVRDSF9DT1VOVCxcbiAgSW5kZXhOb2RlS2V5QmF0Y2hGb2xkZXIsIFRSQU5TQUNUSU9OU19GT0xERVIsIGdldFRyYW5zYWN0aW9uSWQsIENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04sIFVQREFURV9SRUNPUkRfVFJBTlNBQ1RJT04sXG4gIERFTEVURV9SRUNPUkRfVFJBTlNBQ1RJT04sIEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OLFxufSBmcm9tICcuL3RyYW5zYWN0aW9uc0NvbW1vbic7XG5cblxuZXhwb3J0IGNvbnN0IHRyYW5zYWN0aW9uRm9yQ3JlYXRlUmVjb3JkID0gYXN5bmMgKGFwcCwgcmVjb3JkKSA9PiBhd2FpdCB0cmFuc2FjdGlvbihcbiAgYXBwLmRhdGFzdG9yZSwgQ1JFQVRFX1JFQ09SRF9UUkFOU0FDVElPTixcbiAgcmVjb3JkLmtleSwgeyByZWNvcmQgfSxcbiAgZ2V0VHJhbnNhY3Rpb25LZXlfUmVjb3Jkcyxcbik7XG5cbmV4cG9ydCBjb25zdCB0cmFuc2FjdGlvbkZvclVwZGF0ZVJlY29yZCA9IGFzeW5jIChhcHAsIG9sZFJlY29yZCwgbmV3UmVjb3JkKSA9PiBhd2FpdCB0cmFuc2FjdGlvbihcbiAgYXBwLmRhdGFzdG9yZSwgVVBEQVRFX1JFQ09SRF9UUkFOU0FDVElPTixcbiAgbmV3UmVjb3JkLmtleSwgeyBvbGRSZWNvcmQsIHJlY29yZDogbmV3UmVjb3JkIH0sXG4gIGdldFRyYW5zYWN0aW9uS2V5X1JlY29yZHMsXG4pO1xuXG5leHBvcnQgY29uc3QgdHJhbnNhY3Rpb25Gb3JEZWxldGVSZWNvcmQgPSBhc3luYyAoYXBwLCByZWNvcmQpID0+IGF3YWl0IHRyYW5zYWN0aW9uKFxuICBhcHAuZGF0YXN0b3JlLCBERUxFVEVfUkVDT1JEX1RSQU5TQUNUSU9OLFxuICByZWNvcmQua2V5LCB7IHJlY29yZCB9LFxuICBnZXRUcmFuc2FjdGlvbktleV9SZWNvcmRzLFxuKTtcblxuZXhwb3J0IGNvbnN0IHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleCA9IGFzeW5jIChhcHAsIGluZGV4Tm9kZUtleSwgcmVjb3JkS2V5LCBjb3VudCkgPT4ge1xuICBjb25zdCB0cmFuc2FjdGlvbkZvbGRlciA9IEluZGV4Tm9kZUtleUJhdGNoRm9sZGVyKGluZGV4Tm9kZUtleSwgY291bnQpO1xuICBpZiAoY291bnQgJSBCVUlMRElOREVYX0JBVENIX0NPVU5UID09PSAwKSB7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVGb2xkZXIodHJhbnNhY3Rpb25Gb2xkZXIpO1xuICB9XG5cbiAgcmV0dXJuIGF3YWl0IHRyYW5zYWN0aW9uKFxuICAgIGFwcC5kYXRhc3RvcmUsIEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OLFxuICAgIHJlY29yZEtleSwgeyByZWNvcmRLZXkgfSxcbiAgICBpZCA9PiBqb2luS2V5KHRyYW5zYWN0aW9uRm9sZGVyLCBpZCksXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlQnVpbGRJbmRleEZvbGRlciA9IGFzeW5jIChkYXRhc3RvcmUsIGluZGV4Tm9kZUtleSkgPT4gYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihcbiAgSW5kZXhOb2RlS2V5Rm9sZGVyKGluZGV4Tm9kZUtleSksXG4pO1xuXG5jb25zdCBnZXRUcmFuc2FjdGlvbktleV9SZWNvcmRzID0gaWQgPT4gam9pbktleShUUkFOU0FDVElPTlNfRk9MREVSLCBpZCk7XG5cbmNvbnN0IHRyYW5zYWN0aW9uID0gYXN5bmMgKGRhdGFzdG9yZSwgdHJhbnNhY3Rpb25UeXBlLCByZWNvcmRLZXksIGRhdGEsIGdldFRyYW5zYWN0aW9uS2V5KSA9PiB7XG4gIGNvbnN0IHJlY29yZElkID0gZ2V0TGFzdFBhcnRJbktleShyZWNvcmRLZXkpO1xuICBjb25zdCB1bmlxdWVJZCA9IGdlbmVyYXRlKCk7XG4gIGNvbnN0IGlkID0gZ2V0VHJhbnNhY3Rpb25JZChcbiAgICByZWNvcmRJZCwgdHJhbnNhY3Rpb25UeXBlLCB1bmlxdWVJZCxcbiAgKTtcblxuICBjb25zdCBrZXkgPSBnZXRUcmFuc2FjdGlvbktleShpZCk7XG5cbiAgY29uc3QgdHJhbnMgPSB7XG4gICAgdHJhbnNhY3Rpb25UeXBlLFxuICAgIHJlY29yZEtleSxcbiAgICAuLi5kYXRhLFxuICAgIGlkLFxuICB9O1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKFxuICAgIGtleSwgdHJhbnMsXG4gICk7XG5cbiAgcmV0dXJuIHRyYW5zO1xufTtcbiIsImltcG9ydCB7IGlzU2hhcmRlZEluZGV4IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHsgam9pbktleSB9IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IGdldFNoYXJkTWFwS2V5LCBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXksIGNyZWF0ZUluZGV4RmlsZSB9IGZyb20gJy4vc2hhcmRpbmcnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRpYWxpc2VJbmRleCA9IGFzeW5jIChkYXRhc3RvcmUsIGRpciwgaW5kZXgpID0+IHtcclxuICBjb25zdCBpbmRleERpciA9IGpvaW5LZXkoZGlyLCBpbmRleC5uYW1lKTtcclxuXHJcbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihpbmRleERpcik7XHJcblxyXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleCkpIHtcclxuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGaWxlKFxyXG4gICAgICBnZXRTaGFyZE1hcEtleShpbmRleERpciksXHJcbiAgICAgICdbXScsXHJcbiAgICApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBhd2FpdCBjcmVhdGVJbmRleEZpbGUoXHJcbiAgICAgIGRhdGFzdG9yZSxcclxuICAgICAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5KGluZGV4RGlyKSxcclxuICAgICAgaW5kZXgsXHJcbiAgICApO1xyXG4gIH1cclxufTtcclxuIiwiaW1wb3J0IHtcclxuICBjbG9uZURlZXAsIHRha2UsIHRha2VSaWdodCxcclxuICBmbGF0dGVuLCBtYXAsIGZpbHRlclxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IGluaXRpYWxpc2VDaGlsZENvbGxlY3Rpb25zIH0gZnJvbSAnLi4vY29sbGVjdGlvbkFwaS9pbml0aWFsaXNlJztcclxuaW1wb3J0IHsgdmFsaWRhdGUgfSBmcm9tICcuL3ZhbGlkYXRlJztcclxuaW1wb3J0IHsgX2xvYWRGcm9tSW5mbyB9IGZyb20gJy4vbG9hZCc7XHJcbmltcG9ydCB7XHJcbiAgYXBpV3JhcHBlciwgZXZlbnRzLCAkLCBqb2luS2V5LFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7XHJcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LCBpc1JlY29yZCwgZ2V0Tm9kZSwgXHJcbiAgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvTm9kZSxcclxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQge1xyXG4gIHRyYW5zYWN0aW9uRm9yQ3JlYXRlUmVjb3JkLFxyXG4gIHRyYW5zYWN0aW9uRm9yVXBkYXRlUmVjb3JkLFxyXG59IGZyb20gJy4uL3RyYW5zYWN0aW9ucy9jcmVhdGUnO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XHJcbmltcG9ydCB7IGluaXRpYWxpc2VJbmRleCB9IGZyb20gJy4uL2luZGV4aW5nL2luaXRpYWxpc2VJbmRleCc7XHJcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xyXG5pbXBvcnQgeyBnZXRSZWNvcmRJbmZvIH0gZnJvbSBcIi4vcmVjb3JkSW5mb1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNhdmUgPSBhcHAgPT4gYXN5bmMgKHJlY29yZCwgY29udGV4dCkgPT4gYXBpV3JhcHBlcihcclxuICBhcHAsXHJcbiAgZXZlbnRzLnJlY29yZEFwaS5zYXZlLFxyXG4gIHJlY29yZC5pc05ld1xyXG4gICAgPyBwZXJtaXNzaW9uLmNyZWF0ZVJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkLmtleSlcclxuICAgIDogcGVybWlzc2lvbi51cGRhdGVSZWNvcmQuaXNBdXRob3JpemVkKHJlY29yZC5rZXkpLCB7IHJlY29yZCB9LFxyXG4gIF9zYXZlLCBhcHAsIHJlY29yZCwgY29udGV4dCwgZmFsc2UsXHJcbik7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IF9zYXZlID0gYXN5bmMgKGFwcCwgcmVjb3JkLCBjb250ZXh0LCBza2lwVmFsaWRhdGlvbiA9IGZhbHNlKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkQ2xvbmUgPSBjbG9uZURlZXAocmVjb3JkKTtcclxuICBpZiAoIXNraXBWYWxpZGF0aW9uKSB7XHJcbiAgICBjb25zdCB2YWxpZGF0aW9uUmVzdWx0ID0gYXdhaXQgdmFsaWRhdGUoYXBwKShyZWNvcmRDbG9uZSwgY29udGV4dCk7XHJcbiAgICBpZiAoIXZhbGlkYXRpb25SZXN1bHQuaXNWYWxpZCkge1xyXG4gICAgICBhd2FpdCBhcHAucHVibGlzaChldmVudHMucmVjb3JkQXBpLnNhdmUub25JbnZhbGlkLCB7IHJlY29yZCwgdmFsaWRhdGlvblJlc3VsdCB9KTtcclxuICAgICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgU2F2ZSA6IFJlY29yZCBJbnZhbGlkIDogJHtcclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh2YWxpZGF0aW9uUmVzdWx0LmVycm9ycyl9YCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdCByZWNvcmRJbmZvID0gZ2V0UmVjb3JkSW5mbyhhcHAuaGllcmFyY2h5LCByZWNvcmQua2V5KTtcclxuICBjb25zdCB7XHJcbiAgICByZWNvcmROb2RlLCBwYXRoSW5mbyxcclxuICAgIHJlY29yZEpzb24sIGZpbGVzLFxyXG4gIH0gPSByZWNvcmRJbmZvO1xyXG5cclxuICBpZiAocmVjb3JkQ2xvbmUuaXNOZXcpIHtcclxuICAgIFxyXG4gICAgaWYoIXJlY29yZE5vZGUpXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG5vZGUgZm9yIFwiICsgcmVjb3JkLmtleSk7XHJcblxyXG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSBhd2FpdCB0cmFuc2FjdGlvbkZvckNyZWF0ZVJlY29yZChcclxuICAgICAgYXBwLCByZWNvcmRDbG9uZSxcclxuICAgICk7XHJcbiAgICByZWNvcmRDbG9uZS50cmFuc2FjdGlvbklkID0gdHJhbnNhY3Rpb24uaWQ7XHJcbiAgICBhd2FpdCBjcmVhdGVSZWNvcmRGb2xkZXJQYXRoKGFwcC5kYXRhc3RvcmUsIHBhdGhJbmZvKTtcclxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlRm9sZGVyKGZpbGVzKTtcclxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlSnNvbihyZWNvcmRKc29uLCByZWNvcmRDbG9uZSk7XHJcbiAgICBhd2FpdCBpbml0aWFsaXNlUmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMoYXBwLCByZWNvcmRJbmZvKTtcclxuICAgIGF3YWl0IGluaXRpYWxpc2VBbmNlc3RvckluZGV4ZXMoYXBwLCByZWNvcmRJbmZvKTtcclxuICAgIGF3YWl0IGluaXRpYWxpc2VDaGlsZENvbGxlY3Rpb25zKGFwcCwgcmVjb3JkSW5mbyk7XHJcbiAgICBhd2FpdCBhcHAucHVibGlzaChldmVudHMucmVjb3JkQXBpLnNhdmUub25SZWNvcmRDcmVhdGVkLCB7XHJcbiAgICAgIHJlY29yZDogcmVjb3JkQ2xvbmUsXHJcbiAgICB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgY29uc3Qgb2xkUmVjb3JkID0gYXdhaXQgX2xvYWRGcm9tSW5mbyhhcHAsIHJlY29yZEluZm8pO1xyXG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSBhd2FpdCB0cmFuc2FjdGlvbkZvclVwZGF0ZVJlY29yZChcclxuICAgICAgYXBwLCBvbGRSZWNvcmQsIHJlY29yZENsb25lLFxyXG4gICAgKTtcclxuICAgIHJlY29yZENsb25lLnRyYW5zYWN0aW9uSWQgPSB0cmFuc2FjdGlvbi5pZDtcclxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcclxuICAgICAgcmVjb3JkSnNvbixcclxuICAgICAgcmVjb3JkQ2xvbmUsXHJcbiAgICApO1xyXG4gICAgYXdhaXQgYXBwLnB1Ymxpc2goZXZlbnRzLnJlY29yZEFwaS5zYXZlLm9uUmVjb3JkVXBkYXRlZCwge1xyXG4gICAgICBvbGQ6IG9sZFJlY29yZCxcclxuICAgICAgbmV3OiByZWNvcmRDbG9uZSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYXdhaXQgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMoKTtcclxuXHJcbiAgY29uc3QgcmV0dXJuZWRDbG9uZSA9IGNsb25lRGVlcChyZWNvcmRDbG9uZSk7XHJcbiAgcmV0dXJuZWRDbG9uZS5pc05ldyA9IGZhbHNlO1xyXG4gIHJldHVybiByZXR1cm5lZENsb25lO1xyXG59O1xyXG5cclxuY29uc3QgaW5pdGlhbGlzZUFuY2VzdG9ySW5kZXhlcyA9IGFzeW5jIChhcHAsIHJlY29yZEluZm8pID0+IHtcclxuICBmb3IgKGNvbnN0IGluZGV4IG9mIHJlY29yZEluZm8ucmVjb3JkTm9kZS5pbmRleGVzKSB7XHJcbiAgICBjb25zdCBpbmRleEtleSA9IHJlY29yZEluZm8uY2hpbGQoaW5kZXgubmFtZSk7XHJcbiAgICBpZiAoIWF3YWl0IGFwcC5kYXRhc3RvcmUuZXhpc3RzKGluZGV4S2V5KSkgeyBcclxuICAgICAgYXdhaXQgaW5pdGlhbGlzZUluZGV4KGFwcC5kYXRhc3RvcmUsIHJlY29yZEluZm8uZGlyLCBpbmRleCk7IFxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGluaXRpYWxpc2VSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyA9IGFzeW5jIChhcHAsIHJlY29yZEluZm8pID0+IHtcclxuXHJcbiAgY29uc3QgaW5kZXhOb2RlcyA9ICQoZmllbGRzVGhhdFJlZmVyZW5jZVRoaXNSZWNvcmQoYXBwLCByZWNvcmRJbmZvLnJlY29yZE5vZGUpLCBbXHJcbiAgICBtYXAoZiA9PiAkKGYudHlwZU9wdGlvbnMucmV2ZXJzZUluZGV4Tm9kZUtleXMsIFtcclxuICAgICAgbWFwKG4gPT4gZ2V0Tm9kZShcclxuICAgICAgICBhcHAuaGllcmFyY2h5LFxyXG4gICAgICAgIG4sXHJcbiAgICAgICkpLFxyXG4gICAgXSkpLFxyXG4gICAgZmxhdHRlbixcclxuICBdKTtcclxuXHJcbiAgZm9yIChjb25zdCBpbmRleE5vZGUgb2YgaW5kZXhOb2Rlcykge1xyXG4gICAgYXdhaXQgaW5pdGlhbGlzZUluZGV4KFxyXG4gICAgICBhcHAuZGF0YXN0b3JlLCByZWNvcmRJbmZvLmRpciwgaW5kZXhOb2RlLFxyXG4gICAgKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBmaWVsZHNUaGF0UmVmZXJlbmNlVGhpc1JlY29yZCA9IChhcHAsIHJlY29yZE5vZGUpID0+ICQoYXBwLmhpZXJhcmNoeSwgW1xyXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcclxuICBmaWx0ZXIoaXNSZWNvcmQpLFxyXG4gIG1hcChuID0+IG4uZmllbGRzKSxcclxuICBmbGF0dGVuLFxyXG4gIGZpbHRlcihmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlKHJlY29yZE5vZGUpKSxcclxuXSk7XHJcblxyXG5jb25zdCBjcmVhdGVSZWNvcmRGb2xkZXJQYXRoID0gYXN5bmMgKGRhdGFzdG9yZSwgcGF0aEluZm8pID0+IHtcclxuICBcclxuICBjb25zdCByZWN1cnNpdmVDcmVhdGVGb2xkZXIgPSBhc3luYyAoc3ViZGlycywgZGlyc1RoYXROZWVkQ3JlYXRlZD11bmRlZmluZWQpID0+IHtcclxuXHJcbiAgICAvLyBpdGVyYXRlIGJhY2t3YXJkcyB0aHJvdWdoIGRpcmVjdG9yeSBoaWVyYWNoeVxyXG4gICAgLy8gdW50aWwgd2UgZ2V0IHRvIGEgZm9sZGVyIHRoYXQgZXhpc3RzLCB0aGVuIGNyZWF0ZSB0aGUgcmVzdFxyXG4gICAgLy8gZS5nIFxyXG4gICAgLy8gLSBzb21lL2ZvbGRlci9oZXJlXHJcbiAgICAvLyAtIHNvbWUvZm9sZGVyXHJcbiAgICAvLyAtIHNvbWVcclxuICAgIGNvbnN0IHRoaXNGb2xkZXIgPSBqb2luS2V5KHBhdGhJbmZvLmJhc2UsIC4uLnN1YmRpcnMpO1xyXG5cclxuICAgIGlmKGF3YWl0IGRhdGFzdG9yZS5leGlzdHModGhpc0ZvbGRlcikpIHtcclxuXHJcbiAgICAgIGxldCBjcmVhdGlvbkZvbGRlciA9IHRoaXNGb2xkZXI7XHJcbiAgICAgIGZvcihsZXQgbmV4dERpciBvZiAoZGlyc1RoYXROZWVkQ3JlYXRlZCB8fCBbXSkgKSB7XHJcbiAgICAgICAgY3JlYXRpb25Gb2xkZXIgPSBqb2luS2V5KGNyZWF0aW9uRm9sZGVyLCBuZXh0RGlyKTtcclxuICAgICAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKGNyZWF0aW9uRm9sZGVyKTtcclxuICAgICAgfVxyXG5cclxuICAgIH0gZWxzZSBpZighZGlyc1RoYXROZWVkQ3JlYXRlZCB8fCBkaXJzVGhhdE5lZWRDcmVhdGVkLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgIGRpcnNUaGF0TmVlZENyZWF0ZWQgPSAhZGlyc1RoYXROZWVkQ3JlYXRlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgID8gW11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA6ZGlyc1RoYXROZWVkQ3JlYXRlZDtcclxuICAgICAgXHJcbiAgICAgIGF3YWl0IHJlY3Vyc2l2ZUNyZWF0ZUZvbGRlcihcclxuICAgICAgICB0YWtlKHN1YmRpcnMubGVuZ3RoIC0gMSkoc3ViZGlycyksXHJcbiAgICAgICAgWy4uLnRha2VSaWdodCgxKShzdWJkaXJzKSwgLi4uZGlyc1RoYXROZWVkQ3JlYXRlZF1cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGF3YWl0IHJlY3Vyc2l2ZUNyZWF0ZUZvbGRlcihwYXRoSW5mby5zdWJkaXJzKTtcclxuXHJcbiAgcmV0dXJuIGpvaW5LZXkocGF0aEluZm8uYmFzZSwgLi4ucGF0aEluZm8uc3ViZGlycyk7XHJcblxyXG59IiwiaW1wb3J0IHtcclxuICBzYWZlS2V5LCBhcGlXcmFwcGVyLFxyXG4gIGV2ZW50cywgam9pbktleSxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBfZGVsZXRlUmVjb3JkIH0gZnJvbSAnLi4vcmVjb3JkQXBpL2RlbGV0ZSc7XHJcbmltcG9ydCB7IGdldEFsbElkc0l0ZXJhdG9yIH0gZnJvbSAnLi4vaW5kZXhpbmcvYWxsSWRzJztcclxuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xyXG5pbXBvcnQgeyBnZXRDb2xsZWN0aW9uRGlyIH0gZnJvbSBcIi4uL3JlY29yZEFwaS9yZWNvcmRJbmZvXCI7XHJcblxyXG5leHBvcnQgY29uc3QgZGVsZXRlQ29sbGVjdGlvbiA9IChhcHAsIGRpc2FibGVDbGVhbnVwID0gZmFsc2UpID0+IGFzeW5jIGtleSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMuY29sbGVjdGlvbkFwaS5kZWxldGUsXHJcbiAgcGVybWlzc2lvbi5tYW5hZ2VDb2xsZWN0aW9uLmlzQXV0aG9yaXplZCxcclxuICB7IGtleSB9LFxyXG4gIF9kZWxldGVDb2xsZWN0aW9uLCBhcHAsIGtleSwgZGlzYWJsZUNsZWFudXAsXHJcbik7XHJcblxyXG4vKlxyXG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRDb2xsZWN0aW9uTm9kZShhcHAuaGllcmFyY2h5LCBrZXkpO1xyXG5cclxuKi9cclxuXHJcbmV4cG9ydCBjb25zdCBfZGVsZXRlQ29sbGVjdGlvbiA9IGFzeW5jIChhcHAsIGtleSwgZGlzYWJsZUNsZWFudXApID0+IHtcclxuICBrZXkgPSBzYWZlS2V5KGtleSk7XHJcbiAgY29uc3QgY29sbGVjdGlvbkRpciA9IGdldENvbGxlY3Rpb25EaXIoYXBwLmhpZXJhcmNoeSwga2V5KTtcclxuICBhd2FpdCBkZWxldGVSZWNvcmRzKGFwcCwga2V5KTtcclxuICBhd2FpdCBkZWxldGVDb2xsZWN0aW9uRm9sZGVyKGFwcCwgY29sbGVjdGlvbkRpcik7XHJcbiAgaWYgKCFkaXNhYmxlQ2xlYW51cCkgeyBhd2FpdCBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucygpOyB9XHJcbn07XHJcblxyXG5jb25zdCBkZWxldGVDb2xsZWN0aW9uRm9sZGVyID0gYXN5bmMgKGFwcCwgZGlyKSA9PiBcclxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihkaXIpO1xyXG5cclxuY29uc3QgZGVsZXRlUmVjb3JkcyA9IGFzeW5jIChhcHAsIGtleSkgPT4ge1xyXG4gIFxyXG4gIGNvbnN0IGl0ZXJhdGUgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvcihhcHApKGtleSk7XHJcblxyXG4gIGxldCBpZHMgPSBhd2FpdCBpdGVyYXRlKCk7XHJcbiAgd2hpbGUgKCFpZHMuZG9uZSkge1xyXG4gICAgaWYgKGlkcy5yZXN1bHQuY29sbGVjdGlvbktleSA9PT0ga2V5KSB7XHJcbiAgICAgIGZvciAoY29uc3QgaWQgb2YgaWRzLnJlc3VsdC5pZHMpIHtcclxuICAgICAgICBhd2FpdCBfZGVsZXRlUmVjb3JkKFxyXG4gICAgICAgICAgYXBwLFxyXG4gICAgICAgICAgam9pbktleShrZXksIGlkKSxcclxuICAgICAgICAgIHRydWUsXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlkcyA9IGF3YWl0IGl0ZXJhdGUoKTtcclxuICB9XHJcbn07XHJcbiIsImltcG9ydCB7XHJcbiAgc2FmZUtleSwgYXBpV3JhcHBlcixcclxuICBldmVudHMsIGpvaW5LZXksXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgX2xvYWQgfSBmcm9tICcuL2xvYWQnO1xyXG5pbXBvcnQgeyBfZGVsZXRlQ29sbGVjdGlvbiB9IGZyb20gJy4uL2NvbGxlY3Rpb25BcGkvZGVsZXRlJztcclxuaW1wb3J0IHtcclxuICBnZXRFeGFjdE5vZGVGb3JLZXlcclxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyB0cmFuc2FjdGlvbkZvckRlbGV0ZVJlY29yZCB9IGZyb20gJy4uL3RyYW5zYWN0aW9ucy9jcmVhdGUnO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XHJcbmltcG9ydCB7IGdldFJlY29yZEluZm8gfSBmcm9tICcuL3JlY29yZEluZm8nO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlbGV0ZVJlY29yZCA9IChhcHAsIGRpc2FibGVDbGVhbnVwID0gZmFsc2UpID0+IGFzeW5jIGtleSA9PiB7XHJcbiAga2V5ID0gc2FmZUtleShrZXkpO1xyXG4gIHJldHVybiBhcGlXcmFwcGVyKFxyXG4gICAgYXBwLFxyXG4gICAgZXZlbnRzLnJlY29yZEFwaS5kZWxldGUsXHJcbiAgICBwZXJtaXNzaW9uLmRlbGV0ZVJlY29yZC5pc0F1dGhvcml6ZWQoa2V5KSxcclxuICAgIHsga2V5IH0sXHJcbiAgICBfZGVsZXRlUmVjb3JkLCBhcHAsIGtleSwgZGlzYWJsZUNsZWFudXAsXHJcbiAgKTtcclxufVxyXG5cclxuLy8gY2FsbGVkIGRlbGV0ZVJlY29yZCBiZWNhdXNlIGRlbGV0ZSBpcyBhIGtleXdvcmRcclxuZXhwb3J0IGNvbnN0IF9kZWxldGVSZWNvcmQgPSBhc3luYyAoYXBwLCBrZXksIGRpc2FibGVDbGVhbnVwKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkSW5mbyA9IGdldFJlY29yZEluZm8oYXBwLmhpZXJhcmNoeSwga2V5KTtcclxuICBrZXkgPSByZWNvcmRJbmZvLmtleTtcclxuICBjb25zdCBub2RlID0gZ2V0RXhhY3ROb2RlRm9yS2V5KGFwcC5oaWVyYXJjaHkpKGtleSk7XHJcblxyXG4gIGNvbnN0IHJlY29yZCA9IGF3YWl0IF9sb2FkKGFwcCwga2V5KTtcclxuICBhd2FpdCB0cmFuc2FjdGlvbkZvckRlbGV0ZVJlY29yZChhcHAsIHJlY29yZCk7XHJcblxyXG4gIGZvciAoY29uc3QgY29sbGVjdGlvblJlY29yZCBvZiBub2RlLmNoaWxkcmVuKSB7XHJcbiAgICBjb25zdCBjb2xsZWN0aW9uS2V5ID0gam9pbktleShcclxuICAgICAga2V5LCBjb2xsZWN0aW9uUmVjb3JkLmNvbGxlY3Rpb25OYW1lLFxyXG4gICAgKTtcclxuICAgIGF3YWl0IF9kZWxldGVDb2xsZWN0aW9uKGFwcCwgY29sbGVjdGlvbktleSwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihyZWNvcmRJbmZvLmRpcik7XHJcblxyXG4gIGlmICghZGlzYWJsZUNsZWFudXApIHsgYXdhaXQgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMoKTsgfVxyXG59O1xyXG5cclxuIiwiaW1wb3J0IHtcclxuICBpbmNsdWRlcywgZmlsdGVyLFxyXG4gIG1hcCwgc29tZSxcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xyXG5pbXBvcnQgeyBfbG9hZEZyb21JbmZvIH0gZnJvbSAnLi9sb2FkJztcclxuaW1wb3J0IHtcclxuICBhcGlXcmFwcGVyLCBldmVudHMsIHNwbGl0S2V5LFxyXG4gICQsIGpvaW5LZXksIGlzTm90aGluZywgdHJ5QXdhaXRPcklnbm9yZSxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBnZXRFeGFjdE5vZGVGb3JLZXkgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XHJcbmltcG9ydCB7IGlzTGVnYWxGaWxlbmFtZSB9IGZyb20gJy4uL3R5cGVzL2ZpbGUnO1xyXG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IsIEZvcmJpZGRlbkVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XHJcbmltcG9ydCB7IGdldFJlY29yZEluZm8gfSBmcm9tIFwiLi9yZWNvcmRJbmZvXCI7XHJcblxyXG5leHBvcnQgY29uc3QgdXBsb2FkRmlsZSA9IGFwcCA9PiBhc3luYyAocmVjb3JkS2V5LCByZWFkYWJsZVN0cmVhbSwgcmVsYXRpdmVGaWxlUGF0aCkgPT4gYXBpV3JhcHBlcihcclxuICBhcHAsXHJcbiAgZXZlbnRzLnJlY29yZEFwaS51cGxvYWRGaWxlLFxyXG4gIHBlcm1pc3Npb24udXBkYXRlUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmRLZXkpLFxyXG4gIHsgcmVjb3JkS2V5LCByZWFkYWJsZVN0cmVhbSwgcmVsYXRpdmVGaWxlUGF0aCB9LFxyXG4gIF91cGxvYWRGaWxlLCBhcHAsIHJlY29yZEtleSwgcmVhZGFibGVTdHJlYW0sIHJlbGF0aXZlRmlsZVBhdGgsXHJcbik7XHJcblxyXG5jb25zdCBfdXBsb2FkRmlsZSA9IGFzeW5jIChhcHAsIHJlY29yZEtleSwgcmVhZGFibGVTdHJlYW0sIHJlbGF0aXZlRmlsZVBhdGgpID0+IHtcclxuICBpZiAoaXNOb3RoaW5nKHJlY29yZEtleSkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignUmVjb3JkIEtleSBub3Qgc3VwcGxpZWQnKTsgfVxyXG4gIGlmIChpc05vdGhpbmcocmVsYXRpdmVGaWxlUGF0aCkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignZmlsZSBwYXRoIG5vdCBzdXBwbGllZCcpOyB9XHJcbiAgaWYgKCFpc0xlZ2FsRmlsZW5hbWUocmVsYXRpdmVGaWxlUGF0aCkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignSWxsZWdhbCBmaWxlbmFtZScpOyB9XHJcblxyXG4gIGNvbnN0IHJlY29yZEluZm8gPSBnZXRSZWNvcmRJbmZvKGFwcC5oaWVyYXJjaHksIHJlY29yZEtleSk7XHJcbiAgY29uc3QgcmVjb3JkID0gYXdhaXQgX2xvYWRGcm9tSW5mbyhhcHAsIHJlY29yZEluZm8pO1xyXG5cclxuICBjb25zdCBmdWxsRmlsZVBhdGggPSBzYWZlR2V0RnVsbEZpbGVQYXRoKFxyXG4gICAgcmVjb3JkSW5mby5kaXIsIHJlbGF0aXZlRmlsZVBhdGgsXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgdGVtcEZpbGVQYXRoID0gYCR7ZnVsbEZpbGVQYXRofV8ke2dlbmVyYXRlKCl9LnRlbXBgO1xyXG5cclxuICBjb25zdCBvdXRwdXRTdHJlYW0gPSBhd2FpdCBhcHAuZGF0YXN0b3JlLndyaXRhYmxlRmlsZVN0cmVhbShcclxuICAgIHRlbXBGaWxlUGF0aCxcclxuICApO1xyXG5cclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUscmVqZWN0KSA9PiB7XHJcbiAgICByZWFkYWJsZVN0cmVhbS5waXBlKG91dHB1dFN0cmVhbSk7XHJcbiAgICBvdXRwdXRTdHJlYW0ub24oJ2Vycm9yJywgcmVqZWN0KTtcclxuICAgIG91dHB1dFN0cmVhbS5vbignZmluaXNoJywgcmVzb2x2ZSk7XHJcbiAgfSlcclxuICAudGhlbigoKSA9PiBhcHAuZGF0YXN0b3JlLmdldEZpbGVTaXplKHRlbXBGaWxlUGF0aCkpXHJcbiAgLnRoZW4oc2l6ZSA9PiB7XHJcbiAgICBjb25zdCBpc0V4cGVjdGVkRmlsZVNpemUgPSBjaGVja0ZpbGVTaXplQWdhaW5zdEZpZWxkcyhcclxuICAgICAgYXBwLCByZWNvcmQsIHJlbGF0aXZlRmlsZVBhdGgsIHNpemVcclxuICAgICk7ICBcclxuICAgIGlmICghaXNFeHBlY3RlZEZpbGVTaXplKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYEZpZWxkcyBmb3IgJHtyZWxhdGl2ZUZpbGVQYXRofSBkbyBub3QgaGF2ZSBleHBlY3RlZCBzaXplOiAke2pvaW4oJywnKShpbmNvcnJlY3RGaWVsZHMpfWApOyB9ICBcclxuXHJcbiAgfSlcclxuICAudGhlbigoKSA9PiB0cnlBd2FpdE9ySWdub3JlKGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZSwgZnVsbEZpbGVQYXRoKSlcclxuICAudGhlbigoKSA9PiBhcHAuZGF0YXN0b3JlLnJlbmFtZUZpbGUodGVtcEZpbGVQYXRoLCBmdWxsRmlsZVBhdGgpKTtcclxuXHJcbn07XHJcblxyXG5jb25zdCBjaGVja0ZpbGVTaXplQWdhaW5zdEZpZWxkcyA9IChhcHAsIHJlY29yZCwgcmVsYXRpdmVGaWxlUGF0aCwgZXhwZWN0ZWRTaXplKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvcktleShhcHAuaGllcmFyY2h5KShyZWNvcmQua2V5KTtcclxuXHJcbiAgY29uc3QgaW5jb3JyZWN0RmlsZUZpZWxkcyA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcclxuICAgIGZpbHRlcihmID0+IGYudHlwZSA9PT0gJ2ZpbGUnXHJcbiAgICAgICYmIHJlY29yZFtmLm5hbWVdLnJlbGF0aXZlUGF0aCA9PT0gcmVsYXRpdmVGaWxlUGF0aFxyXG4gICAgICAmJiByZWNvcmRbZi5uYW1lXS5zaXplICE9PSBleHBlY3RlZFNpemUpLFxyXG4gICAgbWFwKGYgPT4gZi5uYW1lKSxcclxuICBdKTtcclxuXHJcbiAgY29uc3QgaW5jb3JyZWN0RmlsZUFycmF5RmllbGRzID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xyXG4gICAgZmlsdGVyKGEgPT4gYS50eXBlID09PSAnYXJyYXk8ZmlsZT4nXHJcbiAgICAgICYmICQocmVjb3JkW2EubmFtZV0sIFtcclxuICAgICAgICBzb21lKGYgPT4gcmVjb3JkW2YubmFtZV0ucmVsYXRpdmVQYXRoID09PSByZWxhdGl2ZUZpbGVQYXRoXHJcbiAgICAgICAgICAmJiByZWNvcmRbZi5uYW1lXS5zaXplICE9PSBleHBlY3RlZFNpemUpLFxyXG4gICAgICBdKSksXHJcbiAgICBtYXAoZiA9PiBmLm5hbWUpLFxyXG4gIF0pO1xyXG5cclxuICBjb25zdCBpbmNvcnJlY3RGaWVsZHMgPSBbXHJcbiAgICAuLi5pbmNvcnJlY3RGaWxlRmllbGRzLFxyXG4gICAgLi4uaW5jb3JyZWN0RmlsZUFycmF5RmllbGRzLFxyXG4gIF07XHJcblxyXG4gIGlmIChpbmNvcnJlY3RGaWVsZHMubGVuZ3RoID4gMCkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3Qgc2FmZUdldEZ1bGxGaWxlUGF0aCA9IChyZWNvcmREaXIsIHJlbGF0aXZlRmlsZVBhdGgpID0+IHtcclxuICBjb25zdCBuYXVnaHR5VXNlciA9ICgpID0+IHsgdGhyb3cgbmV3IEZvcmJpZGRlbkVycm9yKCduYXVnaHR5IG5hdWdodHknKTsgfTtcclxuXHJcbiAgaWYgKHJlbGF0aXZlRmlsZVBhdGguc3RhcnRzV2l0aCgnLi4nKSkgbmF1Z2h0eVVzZXIoKTtcclxuXHJcbiAgY29uc3QgcGF0aFBhcnRzID0gc3BsaXRLZXkocmVsYXRpdmVGaWxlUGF0aCk7XHJcblxyXG4gIGlmIChpbmNsdWRlcygnLi4nKShwYXRoUGFydHMpKSBuYXVnaHR5VXNlcigpO1xyXG5cclxuICBjb25zdCByZWNvcmRLZXlQYXJ0cyA9IHNwbGl0S2V5KHJlY29yZERpcik7XHJcblxyXG4gIGNvbnN0IGZ1bGxQYXRoUGFydHMgPSBbXHJcbiAgICAuLi5yZWNvcmRLZXlQYXJ0cyxcclxuICAgICdmaWxlcycsXHJcbiAgICAuLi5maWx0ZXIocCA9PiBwICE9PSAnLicpKHBhdGhQYXJ0cyksXHJcbiAgXTtcclxuXHJcbiAgcmV0dXJuIGpvaW5LZXkoZnVsbFBhdGhQYXJ0cyk7XHJcbn07XHJcbiIsImltcG9ydCB7IGFwaVdyYXBwZXIsIGV2ZW50cywgaXNOb3RoaW5nIH0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xyXG5pbXBvcnQgeyBzYWZlR2V0RnVsbEZpbGVQYXRoIH0gZnJvbSAnLi91cGxvYWRGaWxlJztcclxuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XHJcbmltcG9ydCB7IGdldFJlY29yZEluZm8gfSBmcm9tIFwiLi9yZWNvcmRJbmZvXCI7XHJcblxyXG5leHBvcnQgY29uc3QgZG93bmxvYWRGaWxlID0gYXBwID0+IGFzeW5jIChyZWNvcmRLZXksIHJlbGF0aXZlUGF0aCkgPT4gYXBpV3JhcHBlcihcclxuICBhcHAsXHJcbiAgZXZlbnRzLnJlY29yZEFwaS51cGxvYWRGaWxlLFxyXG4gIHBlcm1pc3Npb24ucmVhZFJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkS2V5KSxcclxuICB7IHJlY29yZEtleSwgcmVsYXRpdmVQYXRoIH0sLy9yZW1vdmUgZHVwZSBrZXkgJ3JlY29yZEtleScgZnJvbSBvYmplY3RcclxuICBfZG93bmxvYWRGaWxlLCBhcHAsIHJlY29yZEtleSwgcmVsYXRpdmVQYXRoLFxyXG4pOyBcclxuXHJcblxyXG5jb25zdCBfZG93bmxvYWRGaWxlID0gYXN5bmMgKGFwcCwgcmVjb3JkS2V5LCByZWxhdGl2ZVBhdGgpID0+IHtcclxuICBpZiAoaXNOb3RoaW5nKHJlY29yZEtleSkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignUmVjb3JkIEtleSBub3Qgc3VwcGxpZWQnKTsgfVxyXG4gIGlmIChpc05vdGhpbmcocmVsYXRpdmVQYXRoKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdmaWxlIHBhdGggbm90IHN1cHBsaWVkJyk7IH1cclxuXHJcbiAgY29uc3Qge2Rpcn0gPSBnZXRSZWNvcmRJbmZvKGFwcC5oaWVyYXJjaHksIHJlY29yZEtleSk7XHJcbiAgcmV0dXJuIGF3YWl0IGFwcC5kYXRhc3RvcmUucmVhZGFibGVGaWxlU3RyZWFtKFxyXG4gICAgc2FmZUdldEZ1bGxGaWxlUGF0aChcclxuICAgICAgZGlyLCByZWxhdGl2ZVBhdGgsXHJcbiAgICApLFxyXG4gICk7XHJcbn07XHJcbiIsImltcG9ydCB7IGZpbmQsIHRha2UsIHVuaW9uIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdldEZsYXR0ZW5lZEhpZXJhcmNoeSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyAkLCBzcGxpdEtleSwgam9pbktleSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBjdXN0b21JZCA9IGFwcCA9PiAobm9kZU5hbWUsIGlkKSA9PiB7XG4gIGNvbnN0IG5vZGUgPSAkKGFwcC5oaWVyYXJjaHksIFtcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gICAgZmluZChuID0+IG4ubmFtZSA9PT0gbm9kZU5hbWUpLFxuICBdKTtcblxuICBpZiAoIW5vZGUpIHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGBDYW5ub3QgZmluZCBub2RlICR7bm9kZU5hbWV9YCk7XG5cbiAgcmV0dXJuIGAke25vZGUubm9kZUlkfS0ke2lkfWA7XG59O1xuXG5leHBvcnQgY29uc3Qgc2V0Q3VzdG9tSWQgPSBhcHAgPT4gKHJlY29yZCwgaWQpID0+IHtcbiAgcmVjb3JkLmlkID0gY3VzdG9tSWQoYXBwKShyZWNvcmQudHlwZSwgaWQpO1xuXG4gIGNvbnN0IGtleVBhcnRzID0gc3BsaXRLZXkocmVjb3JkLmtleSk7XG5cbiAgcmVjb3JkLmtleSA9ICQoa2V5UGFydHMsIFtcbiAgICB0YWtlKGtleVBhcnRzLmxlbmd0aCAtIDEpLFxuICAgIHVuaW9uKFtyZWNvcmQuaWRdKSxcbiAgICBqb2luS2V5LFxuICBdKTtcblxuICByZXR1cm4gcmVjb3JkO1xufTtcbiIsImltcG9ydCB7IGdldE5ldywgZ2V0TmV3Q2hpbGQgfSBmcm9tICcuL2dldE5ldyc7XG5pbXBvcnQgeyBsb2FkIH0gZnJvbSAnLi9sb2FkJztcbmltcG9ydCB7IHZhbGlkYXRlIH0gZnJvbSAnLi92YWxpZGF0ZSc7XG5pbXBvcnQgeyBnZXRDb250ZXh0IH0gZnJvbSAnLi9nZXRDb250ZXh0JztcbmltcG9ydCB7IHNhdmUgfSBmcm9tICcuL3NhdmUnO1xuaW1wb3J0IHsgZGVsZXRlUmVjb3JkIH0gZnJvbSAnLi9kZWxldGUnO1xuaW1wb3J0IHsgdXBsb2FkRmlsZSB9IGZyb20gJy4vdXBsb2FkRmlsZSc7XG5pbXBvcnQgeyBkb3dubG9hZEZpbGUgfSBmcm9tICcuL2Rvd25sb2FkRmlsZSc7XG5pbXBvcnQgeyBjdXN0b21JZCwgc2V0Q3VzdG9tSWQgfSBmcm9tICcuL2N1c3RvbUlkJztcblxuY29uc3QgYXBpID0gYXBwID0+ICh7XG4gIGdldE5ldzogZ2V0TmV3KGFwcCksXG4gIGdldE5ld0NoaWxkOiBnZXROZXdDaGlsZChhcHApLFxuICBzYXZlOiBzYXZlKGFwcCksXG4gIGxvYWQ6IGxvYWQoYXBwKSxcbiAgZGVsZXRlOiBkZWxldGVSZWNvcmQoYXBwLCBmYWxzZSksXG4gIHZhbGlkYXRlOiB2YWxpZGF0ZShhcHApLFxuICBnZXRDb250ZXh0OiBnZXRDb250ZXh0KGFwcCksXG4gIHVwbG9hZEZpbGU6IHVwbG9hZEZpbGUoYXBwKSxcbiAgZG93bmxvYWRGaWxlOiBkb3dubG9hZEZpbGUoYXBwKSxcbiAgY3VzdG9tSWQ6IGN1c3RvbUlkKGFwcCksXG4gIHNldEN1c3RvbUlkOiBzZXRDdXN0b21JZChhcHApLFxufSk7XG5cblxuZXhwb3J0IGNvbnN0IGdldFJlY29yZEFwaSA9IGFwcCA9PiBhcGkoYXBwKTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmVjb3JkQXBpO1xuIiwiaW1wb3J0IHsgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7XG4gIGlzTm90aGluZywgc2FmZUtleSwgYXBpV3JhcHBlclN5bmMsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGFsd2F5c0F1dGhvcml6ZWQgfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGdldEFsbG93ZWRSZWNvcmRUeXBlcyA9IGFwcCA9PiBrZXkgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmNvbGxlY3Rpb25BcGkuZ2V0QWxsb3dlZFJlY29yZFR5cGVzLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IGtleSB9LFxuICBfZ2V0QWxsb3dlZFJlY29yZFR5cGVzLCBhcHAsIGtleSxcbik7XG5cbmNvbnN0IF9nZXRBbGxvd2VkUmVjb3JkVHlwZXMgPSAoYXBwLCBrZXkpID0+IHtcbiAga2V5ID0gc2FmZUtleShrZXkpO1xuICBjb25zdCBub2RlID0gZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoKGFwcC5oaWVyYXJjaHkpKGtleSk7XG4gIHJldHVybiBpc05vdGhpbmcobm9kZSkgPyBbXSA6IFtub2RlLm5hbWVdO1xufTtcbiIsImltcG9ydCB7IGdldEFsbElkc0l0ZXJhdG9yIH0gZnJvbSAnLi4vaW5kZXhpbmcvYWxsSWRzJztcbmltcG9ydCB7IGdldEFsbG93ZWRSZWNvcmRUeXBlcyB9IGZyb20gJy4vZ2V0QWxsb3dlZFJlY29yZFR5cGVzJztcbmltcG9ydCB7IGRlbGV0ZUNvbGxlY3Rpb24gfSBmcm9tICcuL2RlbGV0ZSc7XG5cbmV4cG9ydCBjb25zdCBnZXRDb2xsZWN0aW9uQXBpID0gYXBwID0+ICh7XG4gIGdldEFsbG93ZWRSZWNvcmRUeXBlczogZ2V0QWxsb3dlZFJlY29yZFR5cGVzKGFwcCksXG4gIGdldEFsbElkc0l0ZXJhdG9yOiBnZXRBbGxJZHNJdGVyYXRvcihhcHApLFxuICBkZWxldGU6IGRlbGV0ZUNvbGxlY3Rpb24oYXBwKSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRDb2xsZWN0aW9uQXBpO1xuIiwiaW1wb3J0IHtcclxuICBmaWx0ZXIsIFxyXG4gIGluY2x1ZGVzLCBzb21lLFxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IGdldEFsbElkc0l0ZXJhdG9yIH0gZnJvbSAnLi4vaW5kZXhpbmcvYWxsSWRzJztcclxuaW1wb3J0IHtcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksIGdldFJlY29yZE5vZGVCeUlkLFxyXG4gIGdldE5vZGUsIGlzSW5kZXgsXHJcbiAgaXNSZWNvcmQsIGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4LFxyXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4LFxyXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7XHJcbiAgam9pbktleSwgYXBpV3JhcHBlciwgZXZlbnRzLCAkXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHtcclxuICBjcmVhdGVCdWlsZEluZGV4Rm9sZGVyLFxyXG4gIHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleCxcclxufSBmcm9tICcuLi90cmFuc2FjdGlvbnMvY3JlYXRlJztcclxuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xyXG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcclxuXHJcblxyXG4vKiogcmVidWlsZHMgYW4gaW5kZXhcclxuICogQHBhcmFtIHtvYmplY3R9IGFwcCAtIHRoZSBhcHBsaWNhdGlvbiBjb250YWluZXJcclxuICogQHBhcmFtIHtzdHJpbmd9IGluZGV4Tm9kZUtleSAtIG5vZGUga2V5IG9mIHRoZSBpbmRleCwgd2hpY2ggdGhlIGluZGV4IGJlbG9uZ3MgdG9cclxuICovXHJcbmV4cG9ydCBjb25zdCBidWlsZEluZGV4ID0gYXBwID0+IGFzeW5jIGluZGV4Tm9kZUtleSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMuaW5kZXhBcGkuYnVpbGRJbmRleCxcclxuICBwZXJtaXNzaW9uLm1hbmFnZUluZGV4LmlzQXV0aG9yaXplZCxcclxuICB7IGluZGV4Tm9kZUtleSB9LFxyXG4gIF9idWlsZEluZGV4LCBhcHAsIGluZGV4Tm9kZUtleSxcclxuKTtcclxuXHJcbmNvbnN0IF9idWlsZEluZGV4ID0gYXN5bmMgKGFwcCwgaW5kZXhOb2RlS2V5KSA9PiB7XHJcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0Tm9kZShhcHAuaGllcmFyY2h5LCBpbmRleE5vZGVLZXkpO1xyXG5cclxuICBhd2FpdCBjcmVhdGVCdWlsZEluZGV4Rm9sZGVyKGFwcC5kYXRhc3RvcmUsIGluZGV4Tm9kZUtleSk7XHJcblxyXG4gIGlmICghaXNJbmRleChpbmRleE5vZGUpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ0J1aWxkSW5kZXg6IG11c3Qgc3VwcGx5IGFuIGluZGV4bm9kZScpOyB9XHJcblxyXG4gIGlmIChpbmRleE5vZGUuaW5kZXhUeXBlID09PSAncmVmZXJlbmNlJykge1xyXG4gICAgYXdhaXQgYnVpbGRSZXZlcnNlUmVmZXJlbmNlSW5kZXgoXHJcbiAgICAgIGFwcCwgaW5kZXhOb2RlLFxyXG4gICAgKTtcclxuICB9IGVsc2Uge1xyXG4gICAgYXdhaXQgYnVpbGRIZWlyYXJjaGFsSW5kZXgoXHJcbiAgICAgIGFwcCwgaW5kZXhOb2RlLFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGF3YWl0IGFwcC5jbGVhbnVwVHJhbnNhY3Rpb25zKCk7XHJcbn07XHJcblxyXG5jb25zdCBidWlsZFJldmVyc2VSZWZlcmVuY2VJbmRleCA9IGFzeW5jIChhcHAsIGluZGV4Tm9kZSkgPT4ge1xyXG4gIC8vIEl0ZXJhdGUgdGhyb3VnaCBhbGwgcmVmZXJlbmNJTkcgcmVjb3JkcyxcclxuICAvLyBhbmQgdXBkYXRlIHJlZmVyZW5jZWQgaW5kZXggZm9yIGVhY2ggcmVjb3JkXHJcbiAgbGV0IHJlY29yZENvdW50ID0gMDtcclxuICBjb25zdCByZWZlcmVuY2luZ05vZGVzID0gJChhcHAuaGllcmFyY2h5LCBbXHJcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbiAgICBmaWx0ZXIobiA9PiBpc1JlY29yZChuKVxyXG4gICAgICAgICAgICAgICAgICAgICYmIHNvbWUoZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXgoaW5kZXhOb2RlKSkobi5maWVsZHMpKSxcclxuICBdKTtcclxuXHJcbiAgY29uc3QgY3JlYXRlVHJhbnNhY3Rpb25zRm9yUmVmZXJlbmNpbmdOb2RlID0gYXN5bmMgKHJlZmVyZW5jaW5nTm9kZSkgPT4ge1xyXG4gICAgY29uc3QgaXRlcmF0ZVJlZmVyZW5jaW5nTm9kZXMgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvcihhcHApKHJlZmVyZW5jaW5nTm9kZS5jb2xsZWN0aW9uTm9kZUtleSgpKTtcclxuXHJcbiAgICBsZXQgcmVmZXJlbmNpbmdJZEl0ZXJhdG9yID0gYXdhaXQgaXRlcmF0ZVJlZmVyZW5jaW5nTm9kZXMoKTtcclxuICAgIHdoaWxlICghcmVmZXJlbmNpbmdJZEl0ZXJhdG9yLmRvbmUpIHtcclxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlZmVyZW5jaW5nSWRJdGVyYXRvcjtcclxuICAgICAgZm9yIChjb25zdCBpZCBvZiByZXN1bHQuaWRzKSB7XHJcbiAgICAgICAgY29uc3QgcmVjb3JkS2V5ID0gam9pbktleShyZXN1bHQuY29sbGVjdGlvbktleSwgaWQpO1xyXG4gICAgICAgIGF3YWl0IHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleChhcHAsIGluZGV4Tm9kZS5ub2RlS2V5KCksIHJlY29yZEtleSwgcmVjb3JkQ291bnQpO1xyXG4gICAgICAgIHJlY29yZENvdW50Kys7XHJcbiAgICAgIH1cclxuICAgICAgcmVmZXJlbmNpbmdJZEl0ZXJhdG9yID0gYXdhaXQgaXRlcmF0ZVJlZmVyZW5jaW5nTm9kZXMoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBmb3IgKGNvbnN0IHJlZmVyZW5jaW5nTm9kZSBvZiByZWZlcmVuY2luZ05vZGVzKSB7XHJcbiAgICBhd2FpdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JSZWZlcmVuY2luZ05vZGUocmVmZXJlbmNpbmdOb2RlKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG5jb25zdCBnZXRBbGxvd2VkUGFyZW50Q29sbGVjdGlvbk5vZGVzID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlKSA9PiAkKGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4KGhpZXJhcmNoeSwgaW5kZXhOb2RlKSwgW1xyXG4gIG1hcChuID0+IG4ucGFyZW50KCkpLFxyXG5dKTtcclxuKi9cclxuXHJcbmNvbnN0IGJ1aWxkSGVpcmFyY2hhbEluZGV4ID0gYXN5bmMgKGFwcCwgaW5kZXhOb2RlKSA9PiB7XHJcbiAgbGV0IHJlY29yZENvdW50ID0gMDtcclxuXHJcbiAgY29uc3QgY3JlYXRlVHJhbnNhY3Rpb25zRm9ySWRzID0gYXN5bmMgKGNvbGxlY3Rpb25LZXksIGlkcykgPT4ge1xyXG4gICAgZm9yIChjb25zdCByZWNvcmRJZCBvZiBpZHMpIHtcclxuICAgICAgY29uc3QgcmVjb3JkS2V5ID0gam9pbktleShjb2xsZWN0aW9uS2V5LCByZWNvcmRJZCk7XHJcblxyXG4gICAgICBjb25zdCByZWNvcmROb2RlID0gZ2V0UmVjb3JkTm9kZUJ5SWQoXHJcbiAgICAgICAgYXBwLmhpZXJhcmNoeSxcclxuICAgICAgICByZWNvcmRJZCxcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGlmIChyZWNvcmROb2RlQXBwbGllcyhpbmRleE5vZGUpKHJlY29yZE5vZGUpKSB7XHJcbiAgICAgICAgYXdhaXQgdHJhbnNhY3Rpb25Gb3JCdWlsZEluZGV4KFxyXG4gICAgICAgICAgYXBwLCBpbmRleE5vZGUubm9kZUtleSgpLFxyXG4gICAgICAgICAgcmVjb3JkS2V5LCByZWNvcmRDb3VudCxcclxuICAgICAgICApO1xyXG4gICAgICAgIHJlY29yZENvdW50Kys7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuXHJcbiAgY29uc3QgY29sbGVjdGlvblJlY29yZHMgPSBnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleChhcHAuaGllcmFyY2h5LCBpbmRleE5vZGUpO1xyXG5cclxuICBmb3IgKGNvbnN0IHRhcmdldENvbGxlY3Rpb25SZWNvcmROb2RlIG9mIGNvbGxlY3Rpb25SZWNvcmRzKSB7XHJcbiAgICBjb25zdCBhbGxJZHNJdGVyYXRvciA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yKGFwcCkodGFyZ2V0Q29sbGVjdGlvblJlY29yZE5vZGUuY29sbGVjdGlvbk5vZGVLZXkoKSk7XHJcblxyXG4gICAgbGV0IGFsbElkcyA9IGF3YWl0IGFsbElkc0l0ZXJhdG9yKCk7XHJcbiAgICB3aGlsZSAoYWxsSWRzLmRvbmUgPT09IGZhbHNlKSB7XHJcbiAgICAgIGF3YWl0IGNyZWF0ZVRyYW5zYWN0aW9uc0ZvcklkcyhcclxuICAgICAgICBhbGxJZHMucmVzdWx0LmNvbGxlY3Rpb25LZXksXHJcbiAgICAgICAgYWxsSWRzLnJlc3VsdC5pZHMsXHJcbiAgICAgICk7XHJcbiAgICAgIGFsbElkcyA9IGF3YWl0IGFsbElkc0l0ZXJhdG9yKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVjb3JkQ291bnQ7XHJcbn07XHJcblxyXG4vLyBjb25zdCBjaG9vc2VDaGlsZFJlY29yZE5vZGVCeUtleSA9IChjb2xsZWN0aW9uTm9kZSwgcmVjb3JkSWQpID0+IGZpbmQoYyA9PiByZWNvcmRJZC5zdGFydHNXaXRoKGMubm9kZUlkKSkoY29sbGVjdGlvbk5vZGUuY2hpbGRyZW4pO1xyXG5cclxuY29uc3QgcmVjb3JkTm9kZUFwcGxpZXMgPSBpbmRleE5vZGUgPT4gcmVjb3JkTm9kZSA9PiBpbmNsdWRlcyhyZWNvcmROb2RlLm5vZGVJZCkoaW5kZXhOb2RlLmFsbG93ZWRSZWNvcmROb2RlSWRzKTtcclxuXHJcbi8qXHJcbmNvbnN0IGhhc0FwcGxpY2FibGVEZWNlbmRhbnQgPSAoaGllcmFyY2h5LCBhbmNlc3Rvck5vZGUsIGluZGV4Tm9kZSkgPT4gJChoaWVyYXJjaHksIFtcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbiAgZmlsdGVyKFxyXG4gICAgYWxsVHJ1ZShcclxuICAgICAgaXNSZWNvcmQsXHJcbiAgICAgIGlzRGVjZW5kYW50KGFuY2VzdG9yTm9kZSksXHJcbiAgICAgIHJlY29yZE5vZGVBcHBsaWVzKGluZGV4Tm9kZSksXHJcbiAgICApLFxyXG4gICksXHJcbl0pO1xyXG4qL1xyXG5cclxuIC8qXHJcbmNvbnN0IGFwcGx5QWxsRGVjZW5kYW50UmVjb3JkcyA9IGFzeW5jIChhcHAsIGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXksXHJcbiAgaW5kZXhOb2RlLCBpbmRleEtleSwgY3VycmVudEluZGV4ZWREYXRhLFxyXG4gIGN1cnJlbnRJbmRleGVkRGF0YUtleSwgcmVjb3JkQ291bnQgPSAwKSA9PiB7XHJcbiAgY29uc3QgY29sbGVjdGlvbk5vZGUgPSBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5KFxyXG4gICAgYXBwLmhpZXJhcmNoeSxcclxuICAgIGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXksXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgYWxsSWRzSXRlcmF0b3IgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvcihhcHApKGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXkpO1xyXG5cclxuXHJcbiAgY29uc3QgY3JlYXRlVHJhbnNhY3Rpb25zRm9ySWRzID0gYXN5bmMgKGNvbGxlY3Rpb25LZXksIGFsbElkcykgPT4ge1xyXG4gICAgZm9yIChjb25zdCByZWNvcmRJZCBvZiBhbGxJZHMpIHtcclxuICAgICAgY29uc3QgcmVjb3JkS2V5ID0gam9pbktleShjb2xsZWN0aW9uS2V5LCByZWNvcmRJZCk7XHJcblxyXG4gICAgICBjb25zdCByZWNvcmROb2RlID0gY2hvb3NlQ2hpbGRSZWNvcmROb2RlQnlLZXkoXHJcbiAgICAgICAgY29sbGVjdGlvbk5vZGUsXHJcbiAgICAgICAgcmVjb3JkSWQsXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBpZiAocmVjb3JkTm9kZUFwcGxpZXMoaW5kZXhOb2RlKShyZWNvcmROb2RlKSkge1xyXG4gICAgICAgIGF3YWl0IHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleChcclxuICAgICAgICAgIGFwcCwgaW5kZXhOb2RlLm5vZGVLZXkoKSxcclxuICAgICAgICAgIHJlY29yZEtleSwgcmVjb3JkQ291bnQsXHJcbiAgICAgICAgKTtcclxuICAgICAgICByZWNvcmRDb3VudCsrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaGFzQXBwbGljYWJsZURlY2VuZGFudChhcHAuaGllcmFyY2h5LCByZWNvcmROb2RlLCBpbmRleE5vZGUpKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZENvbGxlY3Rpb25Ob2RlIG9mIHJlY29yZE5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICAgIHJlY29yZENvdW50ID0gYXdhaXQgYXBwbHlBbGxEZWNlbmRhbnRSZWNvcmRzKFxyXG4gICAgICAgICAgICBhcHAsXHJcbiAgICAgICAgICAgIGpvaW5LZXkocmVjb3JkS2V5LCBjaGlsZENvbGxlY3Rpb25Ob2RlLmNvbGxlY3Rpb25OYW1lKSxcclxuICAgICAgICAgICAgaW5kZXhOb2RlLCBpbmRleEtleSwgY3VycmVudEluZGV4ZWREYXRhLFxyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXhlZERhdGFLZXksIHJlY29yZENvdW50LFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBsZXQgYWxsSWRzID0gYXdhaXQgYWxsSWRzSXRlcmF0b3IoKTtcclxuICB3aGlsZSAoYWxsSWRzLmRvbmUgPT09IGZhbHNlKSB7XHJcbiAgICBhd2FpdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JJZHMoXHJcbiAgICAgIGFsbElkcy5yZXN1bHQuY29sbGVjdGlvbktleSxcclxuICAgICAgYWxsSWRzLnJlc3VsdC5pZHMsXHJcbiAgICApO1xyXG4gICAgYWxsSWRzID0gYXdhaXQgYWxsSWRzSXRlcmF0b3IoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiByZWNvcmRDb3VudDtcclxufTtcclxuKi9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGJ1aWxkSW5kZXg7XHJcbiIsImltcG9ydCB7IGhhcywgaXNOdW1iZXIsIGlzVW5kZWZpbmVkIH0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgY29tcGlsZUV4cHJlc3Npb24sIGNvbXBpbGVDb2RlIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xyXG5pbXBvcnQge1xyXG4gIHNhZmVLZXksIGFwaVdyYXBwZXIsXHJcbiAgZXZlbnRzLCBpc05vbkVtcHR5U3RyaW5nLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IGl0ZXJhdGVJbmRleCB9IGZyb20gJy4uL2luZGV4aW5nL3JlYWQnO1xyXG5pbXBvcnQge1xyXG4gIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSxcclxuICBnZXRTaGFyZEtleXNJblJhbmdlLFxyXG59IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcclxuaW1wb3J0IHtcclxuICBnZXRFeGFjdE5vZGVGb3JLZXksIGlzSW5kZXgsXHJcbiAgaXNTaGFyZGVkSW5kZXgsXHJcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHsgQ09OVElOVUVfUkVBRElOR19SRUNPUkRTIH0gZnJvbSAnLi4vaW5kZXhpbmcvc2VyaWFsaXplcic7XHJcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcclxuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XHJcbmltcG9ydCB7IGdldEluZGV4RGlyIH0gZnJvbSBcIi4vZ2V0SW5kZXhEaXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBhZ2dyZWdhdGVzID0gYXBwID0+IGFzeW5jIChpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcyA9IG51bGwsIHJhbmdlRW5kUGFyYW1zID0gbnVsbCkgPT4gYXBpV3JhcHBlcihcclxuICBhcHAsXHJcbiAgZXZlbnRzLmluZGV4QXBpLmFnZ3JlZ2F0ZXMsXHJcbiAgcGVybWlzc2lvbi5yZWFkSW5kZXguaXNBdXRob3JpemVkKGluZGV4S2V5KSxcclxuICB7IGluZGV4S2V5LCByYW5nZVN0YXJ0UGFyYW1zLCByYW5nZUVuZFBhcmFtcyB9LFxyXG4gIF9hZ2dyZWdhdGVzLCBhcHAsIGluZGV4S2V5LCByYW5nZVN0YXJ0UGFyYW1zLCByYW5nZUVuZFBhcmFtcyxcclxuKTtcclxuXHJcbmNvbnN0IF9hZ2dyZWdhdGVzID0gYXN5bmMgKGFwcCwgaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zKSA9PiB7XHJcbiAgaW5kZXhLZXkgPSBzYWZlS2V5KGluZGV4S2V5KTtcclxuICBjb25zdCBpbmRleE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JLZXkoYXBwLmhpZXJhcmNoeSkoaW5kZXhLZXkpO1xyXG4gIGNvbnN0IGluZGV4RGlyID0gZ2V0SW5kZXhEaXIoYXBwLmhpZXJhcmNoeSwgaW5kZXhLZXkpO1xyXG5cclxuICBpZiAoIWlzSW5kZXgoaW5kZXhOb2RlKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdzdXBwbGllZCBrZXkgaXMgbm90IGFuIGluZGV4Jyk7IH1cclxuXHJcbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4Tm9kZSkpIHtcclxuICAgIGNvbnN0IHNoYXJkS2V5cyA9IGF3YWl0IGdldFNoYXJkS2V5c0luUmFuZ2UoXHJcbiAgICAgIGFwcCwgaW5kZXhOb2RlLCBpbmRleERpciwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMsXHJcbiAgICApO1xyXG4gICAgbGV0IGFnZ3JlZ2F0ZVJlc3VsdCA9IG51bGw7XHJcbiAgICBmb3IgKGNvbnN0IGsgb2Ygc2hhcmRLZXlzKSB7XHJcbiAgICAgIGNvbnN0IHNoYXJkUmVzdWx0ID0gYXdhaXQgZ2V0QWdncmVnYXRlcyhhcHAuaGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlLCBpbmRleE5vZGUsIGspO1xyXG4gICAgICBpZiAoYWdncmVnYXRlUmVzdWx0ID09PSBudWxsKSB7XHJcbiAgICAgICAgYWdncmVnYXRlUmVzdWx0ID0gc2hhcmRSZXN1bHQ7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWdncmVnYXRlUmVzdWx0ID0gbWVyZ2VTaGFyZEFnZ3JlZ2F0ZShcclxuICAgICAgICAgIGFnZ3JlZ2F0ZVJlc3VsdCxcclxuICAgICAgICAgIHNoYXJkUmVzdWx0LFxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBhZ2dyZWdhdGVSZXN1bHQ7XHJcbiAgfVxyXG4gIHJldHVybiBhd2FpdCBnZXRBZ2dyZWdhdGVzKFxyXG4gICAgYXBwLmhpZXJhcmNoeSxcclxuICAgIGFwcC5kYXRhc3RvcmUsXHJcbiAgICBpbmRleE5vZGUsXHJcbiAgICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXkoaW5kZXhEaXIpLFxyXG4gICk7XHJcbn07XHJcblxyXG5jb25zdCBtZXJnZVNoYXJkQWdncmVnYXRlID0gKHRvdGFscywgc2hhcmQpID0+IHtcclxuICBjb25zdCBtZXJnZUdyb3VwaW5nID0gKHRvdCwgc2hyKSA9PiB7XHJcbiAgICB0b3QuY291bnQgKz0gc2hyLmNvdW50O1xyXG4gICAgZm9yIChjb25zdCBhZ2dOYW1lIGluIHRvdCkge1xyXG4gICAgICBpZiAoYWdnTmFtZSA9PT0gJ2NvdW50JykgY29udGludWU7XHJcbiAgICAgIGNvbnN0IHRvdGFnZyA9IHRvdFthZ2dOYW1lXTtcclxuICAgICAgY29uc3Qgc2hyYWdnID0gc2hyW2FnZ05hbWVdO1xyXG4gICAgICB0b3RhZ2cuc3VtICs9IHNocmFnZy5zdW07XHJcbiAgICAgIHRvdGFnZy5tYXggPSB0b3RhZ2cubWF4ID4gc2hyYWdnLm1heFxyXG4gICAgICAgID8gdG90YWdnLm1heFxyXG4gICAgICAgIDogc2hyYWdnLm1heDtcclxuICAgICAgdG90YWdnLm1pbiA9IHRvdGFnZy5taW4gPCBzaHJhZ2cubWluXHJcbiAgICAgICAgPyB0b3RhZ2cubWluXHJcbiAgICAgICAgOiBzaHJhZ2cubWluO1xyXG4gICAgICB0b3RhZ2cubWVhbiA9IHRvdGFnZy5zdW0gLyB0b3QuY291bnQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG90O1xyXG4gIH07XHJcblxyXG4gIGZvciAoY29uc3QgYWdnR3JvdXBEZWYgaW4gdG90YWxzKSB7XHJcbiAgICBmb3IgKGNvbnN0IGdyb3VwaW5nIGluIHNoYXJkW2FnZ0dyb3VwRGVmXSkge1xyXG4gICAgICBjb25zdCBncm91cGluZ1RvdGFsID0gdG90YWxzW2FnZ0dyb3VwRGVmXVtncm91cGluZ107XHJcbiAgICAgIHRvdGFsc1thZ2dHcm91cERlZl1bZ3JvdXBpbmddID0gaXNVbmRlZmluZWQoZ3JvdXBpbmdUb3RhbClcclxuICAgICAgICA/IHNoYXJkW2FnZ0dyb3VwRGVmXVtncm91cGluZ11cclxuICAgICAgICA6IG1lcmdlR3JvdXBpbmcoXHJcbiAgICAgICAgICB0b3RhbHNbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXSxcclxuICAgICAgICAgIHNoYXJkW2FnZ0dyb3VwRGVmXVtncm91cGluZ10sXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB0b3RhbHM7XHJcbn07XHJcblxyXG5jb25zdCBnZXRBZ2dyZWdhdGVzID0gYXN5bmMgKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXkpID0+IHtcclxuICBjb25zdCBhZ2dyZWdhdGVSZXN1bHQgPSB7fTtcclxuICBjb25zdCBkb1JlYWQgPSBpdGVyYXRlSW5kZXgoXHJcbiAgICAgICAgYXN5bmMgaXRlbSA9PiB7XHJcbiAgICAgIGFwcGx5SXRlbVRvQWdncmVnYXRlUmVzdWx0KFxyXG4gICAgICAgIGluZGV4LCBhZ2dyZWdhdGVSZXN1bHQsIGl0ZW0sXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XHJcbiAgICB9LFxyXG4gICAgICAgIGFzeW5jICgpID0+IGFnZ3JlZ2F0ZVJlc3VsdFxyXG4gICk7XHJcblxyXG4gIHJldHVybiBhd2FpdCBkb1JlYWQoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSk7XHJcbn07XHJcblxyXG5cclxuY29uc3QgYXBwbHlJdGVtVG9BZ2dyZWdhdGVSZXN1bHQgPSAoaW5kZXhOb2RlLCByZXN1bHQsIGl0ZW0pID0+IHtcclxuICBjb25zdCBnZXRJbml0aWFsQWdncmVnYXRlUmVzdWx0ID0gKCkgPT4gKHtcclxuICAgIHN1bTogMCwgbWVhbjogbnVsbCwgbWF4OiBudWxsLCBtaW46IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IGFwcGx5QWdncmVnYXRlUmVzdWx0ID0gKGFnZywgZXhpc3RpbmcsIGNvdW50KSA9PiB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IGNvbXBpbGVDb2RlKGFnZy5hZ2dyZWdhdGVkVmFsdWUpKHsgcmVjb3JkOiBpdGVtIH0pO1xyXG5cclxuICAgIGlmICghaXNOdW1iZXIodmFsdWUpKSByZXR1cm4gZXhpc3Rpbmc7XHJcblxyXG4gICAgZXhpc3Rpbmcuc3VtICs9IHZhbHVlO1xyXG4gICAgZXhpc3RpbmcubWF4ID0gdmFsdWUgPiBleGlzdGluZy5tYXggfHwgZXhpc3RpbmcubWF4ID09PSBudWxsXHJcbiAgICAgID8gdmFsdWVcclxuICAgICAgOiBleGlzdGluZy5tYXg7XHJcbiAgICBleGlzdGluZy5taW4gPSB2YWx1ZSA8IGV4aXN0aW5nLm1pbiB8fCBleGlzdGluZy5taW4gPT09IG51bGxcclxuICAgICAgPyB2YWx1ZVxyXG4gICAgICA6IGV4aXN0aW5nLm1pbjtcclxuICAgIGV4aXN0aW5nLm1lYW4gPSBleGlzdGluZy5zdW0gLyBjb3VudDtcclxuICAgIHJldHVybiBleGlzdGluZztcclxuICB9O1xyXG5cclxuICBmb3IgKGNvbnN0IGFnZ0dyb3VwIG9mIGluZGV4Tm9kZS5hZ2dyZWdhdGVHcm91cHMpIHtcclxuICAgIGlmICghaGFzKGFnZ0dyb3VwLm5hbWUpKHJlc3VsdCkpIHtcclxuICAgICAgcmVzdWx0W2FnZ0dyb3VwLm5hbWVdID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGhpc0dyb3VwUmVzdWx0ID0gcmVzdWx0W2FnZ0dyb3VwLm5hbWVdO1xyXG5cclxuICAgIGlmIChpc05vbkVtcHR5U3RyaW5nKGFnZ0dyb3VwLmNvbmRpdGlvbikpIHtcclxuICAgICAgaWYgKCFjb21waWxlRXhwcmVzc2lvbihhZ2dHcm91cC5jb25kaXRpb24pKHsgcmVjb3JkOiBpdGVtIH0pKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgZ3JvdXAgPSBpc05vbkVtcHR5U3RyaW5nKGFnZ0dyb3VwLmdyb3VwQnkpXHJcbiAgICAgID8gY29tcGlsZUNvZGUoYWdnR3JvdXAuZ3JvdXBCeSkoeyByZWNvcmQ6IGl0ZW0gfSlcclxuICAgICAgOiAnYWxsJztcclxuICAgIGlmICghaXNOb25FbXB0eVN0cmluZyhncm91cCkpIHtcclxuICAgICAgZ3JvdXAgPSAnKG5vbmUpJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWhhcyhncm91cCkodGhpc0dyb3VwUmVzdWx0KSkge1xyXG4gICAgICB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdID0geyBjb3VudDogMCB9O1xyXG4gICAgICBmb3IgKGNvbnN0IGFnZyBvZiBhZ2dHcm91cC5hZ2dyZWdhdGVzKSB7XHJcbiAgICAgICAgdGhpc0dyb3VwUmVzdWx0W2dyb3VwXVthZ2cubmFtZV0gPSBnZXRJbml0aWFsQWdncmVnYXRlUmVzdWx0KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdLmNvdW50Kys7XHJcblxyXG4gICAgZm9yIChjb25zdCBhZ2cgb2YgYWdnR3JvdXAuYWdncmVnYXRlcykge1xyXG4gICAgICBjb25zdCBleGlzdGluZ1ZhbHVlcyA9IHRoaXNHcm91cFJlc3VsdFtncm91cF1bYWdnLm5hbWVdO1xyXG4gICAgICB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdW2FnZy5uYW1lXSA9IGFwcGx5QWdncmVnYXRlUmVzdWx0KFxyXG4gICAgICAgIGFnZywgZXhpc3RpbmdWYWx1ZXMsXHJcbiAgICAgICAgdGhpc0dyb3VwUmVzdWx0W2dyb3VwXS5jb3VudCxcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcbiIsImltcG9ydCB7IGJ1aWxkSW5kZXggfSBmcm9tICcuL2J1aWxkSW5kZXgnO1xuaW1wb3J0IHsgbGlzdEl0ZW1zIH0gZnJvbSAnLi9saXN0SXRlbXMnO1xuaW1wb3J0IHsgYWdncmVnYXRlcyB9IGZyb20gJy4vYWdncmVnYXRlcyc7XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleEFwaSA9IGFwcCA9PiAoe1xuICBsaXN0SXRlbXM6IGxpc3RJdGVtcyhhcHApLFxuICBidWlsZEluZGV4OiBidWlsZEluZGV4KGFwcCksXG4gIGFnZ3JlZ2F0ZXM6IGFnZ3JlZ2F0ZXMoYXBwKSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRJbmRleEFwaTtcbiIsImltcG9ydCB7IGVhY2gsIGZpbmQgfSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBtYXAsIG1heCwgY29uc3RhbnQgfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQge1xyXG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLCBqb2luS2V5LFxyXG4gICQsIGlzTm90aGluZywgaXNTb21ldGhpbmcsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHtcclxuICBpc0luZGV4LCBpc1Jvb3QsIGlzU2luZ2xlUmVjb3JkLCBpc0NvbGxlY3Rpb25SZWNvcmQsXHJcbiAgaXNSZWNvcmQsIGlzYWdncmVnYXRlR3JvdXAsXHJcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxyXG59IGZyb20gJy4vaGllcmFyY2h5JztcclxuaW1wb3J0IHsgYWxsIH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVOb2RlRXJyb3JzID0ge1xyXG4gIGluZGV4Q2Fubm90QmVQYXJlbnQ6ICdJbmRleCB0ZW1wbGF0ZSBjYW5ub3QgYmUgYSBwYXJlbnQnLFxyXG4gIGFsbE5vblJvb3ROb2Rlc011c3RIYXZlUGFyZW50OiAnT25seSB0aGUgcm9vdCBub2RlIG1heSBoYXZlIG5vIHBhcmVudCcsXHJcbiAgaW5kZXhQYXJlbnRNdXN0QmVSZWNvcmRPclJvb3Q6ICdBbiBpbmRleCBtYXkgb25seSBoYXZlIGEgcmVjb3JkIG9yIHJvb3QgYXMgYSBwYXJlbnQnLFxyXG4gIGFnZ3JlZ2F0ZVBhcmVudE11c3RCZUFuSW5kZXg6ICdhZ2dyZWdhdGVHcm91cCBwYXJlbnQgbXVzdCBiZSBhbiBpbmRleCcsXHJcbn07XHJcblxyXG5jb25zdCBwYXRoUmVneE1ha2VyID0gbm9kZSA9PiAoKSA9PiBub2RlLm5vZGVLZXkoKS5yZXBsYWNlKC97aWR9L2csICdbYS16QS1aMC05Xy1dKycpO1xyXG5cclxuY29uc3Qgbm9kZUtleU1ha2VyID0gbm9kZSA9PiAoKSA9PiBzd2l0Y2hDYXNlKFxyXG5cclxuICBbbiA9PiBpc1JlY29yZChuKSAmJiAhaXNTaW5nbGVSZWNvcmQobiksXHJcbiAgICBuID0+IGpvaW5LZXkoXHJcbiAgICAgIG5vZGUucGFyZW50KCkubm9kZUtleSgpLFxyXG4gICAgICBub2RlLmNvbGxlY3Rpb25OYW1lLFxyXG4gICAgICBgJHtuLm5vZGVJZH0te2lkfWAsXHJcbiAgICApXSxcclxuXHJcbiAgW2lzUm9vdCxcclxuICAgIGNvbnN0YW50KCcvJyldLFxyXG5cclxuICBbZGVmYXVsdENhc2UsXHJcbiAgICBuID0+IGpvaW5LZXkobm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksIG4ubmFtZSldLFxyXG5cclxuKShub2RlKTtcclxuXHJcblxyXG5jb25zdCB2YWxpZGF0ZSA9IHBhcmVudCA9PiAobm9kZSkgPT4ge1xyXG4gIGlmIChpc0luZGV4KG5vZGUpXHJcbiAgICAgICAgJiYgaXNTb21ldGhpbmcocGFyZW50KVxyXG4gICAgICAgICYmICFpc1Jvb3QocGFyZW50KVxyXG4gICAgICAgICYmICFpc1JlY29yZChwYXJlbnQpKSB7XHJcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGNyZWF0ZU5vZGVFcnJvcnMuaW5kZXhQYXJlbnRNdXN0QmVSZWNvcmRPclJvb3QpO1xyXG4gIH1cclxuXHJcbiAgaWYgKGlzYWdncmVnYXRlR3JvdXAobm9kZSlcclxuICAgICAgICAmJiBpc1NvbWV0aGluZyhwYXJlbnQpXHJcbiAgICAgICAgJiYgIWlzSW5kZXgocGFyZW50KSkge1xyXG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihjcmVhdGVOb2RlRXJyb3JzLmFnZ3JlZ2F0ZVBhcmVudE11c3RCZUFuSW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgaWYgKGlzTm90aGluZyhwYXJlbnQpICYmICFpc1Jvb3Qobm9kZSkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihjcmVhdGVOb2RlRXJyb3JzLmFsbE5vblJvb3ROb2Rlc011c3RIYXZlUGFyZW50KTsgfVxyXG5cclxuICByZXR1cm4gbm9kZTtcclxufTtcclxuXHJcbmNvbnN0IGNvbnN0cnVjdCA9IHBhcmVudCA9PiAobm9kZSkgPT4ge1xyXG4gIG5vZGUubm9kZUtleSA9IG5vZGVLZXlNYWtlcihub2RlKTtcclxuICBub2RlLnBhdGhSZWd4ID0gcGF0aFJlZ3hNYWtlcihub2RlKTtcclxuICBub2RlLnBhcmVudCA9IGNvbnN0YW50KHBhcmVudCk7XHJcbiAgbm9kZS5pc1Jvb3QgPSAoKSA9PiBpc05vdGhpbmcocGFyZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBub2RlLm5hbWUgPT09ICdyb290J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBub2RlLnR5cGUgPT09ICdyb290JztcclxuICBpZiAoaXNDb2xsZWN0aW9uUmVjb3JkKG5vZGUpKSB7XHJcbiAgICBub2RlLmNvbGxlY3Rpb25Ob2RlS2V5ID0gKCkgPT4gam9pbktleShcclxuICAgICAgcGFyZW50Lm5vZGVLZXkoKSwgbm9kZS5jb2xsZWN0aW9uTmFtZSxcclxuICAgICk7XHJcbiAgICBub2RlLmNvbGxlY3Rpb25QYXRoUmVneCA9ICgpID0+IGpvaW5LZXkoXHJcbiAgICAgIHBhcmVudC5wYXRoUmVneCgpLCBub2RlLmNvbGxlY3Rpb25OYW1lLFxyXG4gICAgKTtcclxuICB9XHJcbiAgcmV0dXJuIG5vZGU7XHJcbn07XHJcblxyXG5jb25zdCBhZGRUb1BhcmVudCA9IChvYmopID0+IHtcclxuICBjb25zdCBwYXJlbnQgPSBvYmoucGFyZW50KCk7XHJcbiAgaWYgKGlzU29tZXRoaW5nKHBhcmVudCkpIHtcclxuICAgIGlmIChpc0luZGV4KG9iaikpXHJcbiAgICAvLyBROiB3aHkgYXJlIGluZGV4ZXMgbm90IGNoaWxkcmVuID9cclxuICAgIC8vIEE6IGJlY2F1c2UgdGhleSBjYW5ub3QgaGF2ZSBjaGlsZHJlbiBvZiB0aGVpciBvd24uXHJcbiAgICB7IFxyXG4gICAgICBwYXJlbnQuaW5kZXhlcy5wdXNoKG9iaik7IFxyXG4gICAgfSBcclxuICAgIGVsc2UgaWYgKGlzYWdncmVnYXRlR3JvdXAob2JqKSkgXHJcbiAgICB7IFxyXG4gICAgICBwYXJlbnQuYWdncmVnYXRlR3JvdXBzLnB1c2gob2JqKTsgXHJcbiAgICB9IGVsc2UgeyBcclxuICAgICAgcGFyZW50LmNoaWxkcmVuLnB1c2gob2JqKTsgXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzUmVjb3JkKG9iaikpIHtcclxuICAgICAgY29uc3QgZGVmYXVsdEluZGV4ID0gZmluZChcclxuICAgICAgICBwYXJlbnQuaW5kZXhlcyxcclxuICAgICAgICBpID0+IGkubmFtZSA9PT0gYCR7cGFyZW50Lm5hbWV9X2luZGV4YCxcclxuICAgICAgKTtcclxuICAgICAgaWYgKGRlZmF1bHRJbmRleCkge1xyXG4gICAgICAgIGRlZmF1bHRJbmRleC5hbGxvd2VkUmVjb3JkTm9kZUlkcy5wdXNoKG9iai5ub2RlSWQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBvYmo7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgY29uc3RydWN0Tm9kZSA9IChwYXJlbnQsIG9iaikgPT4gJChvYmosIFtcclxuICBjb25zdHJ1Y3QocGFyZW50KSxcclxuICB2YWxpZGF0ZShwYXJlbnQpLFxyXG4gIGFkZFRvUGFyZW50LFxyXG5dKTtcclxuXHJcbmNvbnN0IGdldE5vZGVJZCA9IChwYXJlbnROb2RlKSA9PiB7XHJcbiAgLy8gdGhpcyBjYXNlIGlzIGhhbmRsZWQgYmV0dGVyIGVsc2V3aGVyZVxyXG4gIGlmICghcGFyZW50Tm9kZSkgcmV0dXJuIG51bGw7XHJcbiAgY29uc3QgZmluZFJvb3QgPSBuID0+IChpc1Jvb3QobikgPyBuIDogZmluZFJvb3Qobi5wYXJlbnQoKSkpO1xyXG4gIGNvbnN0IHJvb3QgPSBmaW5kUm9vdChwYXJlbnROb2RlKTtcclxuXHJcbiAgcmV0dXJuICgkKHJvb3QsIFtcclxuICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcclxuICAgIG1hcChuID0+IG4ubm9kZUlkKSxcclxuICAgIG1heF0pICsgMSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgY29uc3RydWN0SGllcmFyY2h5ID0gKG5vZGUsIHBhcmVudCkgPT4ge1xyXG4gIGNvbnN0cnVjdChwYXJlbnQpKG5vZGUpO1xyXG4gIGlmIChub2RlLmluZGV4ZXMpIHtcclxuICAgIGVhY2gobm9kZS5pbmRleGVzLFxyXG4gICAgICBjaGlsZCA9PiBjb25zdHJ1Y3RIaWVyYXJjaHkoY2hpbGQsIG5vZGUpKTtcclxuICB9XHJcbiAgaWYgKG5vZGUuYWdncmVnYXRlR3JvdXBzKSB7XHJcbiAgICBlYWNoKG5vZGUuYWdncmVnYXRlR3JvdXBzLFxyXG4gICAgICBjaGlsZCA9PiBjb25zdHJ1Y3RIaWVyYXJjaHkoY2hpbGQsIG5vZGUpKTtcclxuICB9XHJcbiAgaWYgKG5vZGUuY2hpbGRyZW4gJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICBlYWNoKG5vZGUuY2hpbGRyZW4sXHJcbiAgICAgIGNoaWxkID0+IGNvbnN0cnVjdEhpZXJhcmNoeShjaGlsZCwgbm9kZSkpO1xyXG4gIH1cclxuICBpZiAobm9kZS5maWVsZHMpIHtcclxuICAgIGVhY2gobm9kZS5maWVsZHMsXHJcbiAgICAgIGYgPT4gZWFjaChmLnR5cGVPcHRpb25zLCAodmFsLCBrZXkpID0+IHtcclxuICAgICAgICBjb25zdCBkZWYgPSBhbGxbZi50eXBlXS5vcHRpb25EZWZpbml0aW9uc1trZXldO1xyXG4gICAgICAgIGlmICghZGVmKSB7XHJcbiAgICAgICAgICAvLyB1bmtub3duIHR5cGVPcHRpb25cclxuICAgICAgICAgIGRlbGV0ZSBmLnR5cGVPcHRpb25zW2tleV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGYudHlwZU9wdGlvbnNba2V5XSA9IGRlZi5wYXJzZSh2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSkpO1xyXG4gIH1cclxuICByZXR1cm4gbm9kZTtcclxufTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TmV3Um9vdExldmVsID0gKCkgPT4gY29uc3RydWN0KCkoe1xyXG4gIG5hbWU6ICdyb290JyxcclxuICB0eXBlOiAncm9vdCcsXHJcbiAgY2hpbGRyZW46IFtdLFxyXG4gIHBhdGhNYXBzOiBbXSxcclxuICBpbmRleGVzOiBbXSxcclxuICBub2RlSWQ6IDAsXHJcbn0pO1xyXG5cclxuY29uc3QgX2dldE5ld1JlY29yZFRlbXBsYXRlID0gKHBhcmVudCwgbmFtZSwgY3JlYXRlRGVmYXVsdEluZGV4LCBpc1NpbmdsZSkgPT4ge1xyXG4gIGNvbnN0IG5vZGUgPSBjb25zdHJ1Y3ROb2RlKHBhcmVudCwge1xyXG4gICAgbmFtZSxcclxuICAgIHR5cGU6ICdyZWNvcmQnLFxyXG4gICAgZmllbGRzOiBbXSxcclxuICAgIGNoaWxkcmVuOiBbXSxcclxuICAgIHZhbGlkYXRpb25SdWxlczogW10sXHJcbiAgICBub2RlSWQ6IGdldE5vZGVJZChwYXJlbnQpLFxyXG4gICAgaW5kZXhlczogW10sXHJcbiAgICBlc3RpbWF0ZWRSZWNvcmRDb3VudDogaXNSZWNvcmQocGFyZW50KSA/IDUwMCA6IDEwMDAwMDAsXHJcbiAgICBjb2xsZWN0aW9uTmFtZTogJycsXHJcbiAgICBpc1NpbmdsZSxcclxuICB9KTtcclxuXHJcbiAgaWYgKGNyZWF0ZURlZmF1bHRJbmRleCkge1xyXG4gICAgY29uc3QgZGVmYXVsdEluZGV4ID0gZ2V0TmV3SW5kZXhUZW1wbGF0ZShwYXJlbnQpO1xyXG4gICAgZGVmYXVsdEluZGV4Lm5hbWUgPSBgJHtuYW1lfV9pbmRleGA7XHJcbiAgICBkZWZhdWx0SW5kZXguYWxsb3dlZFJlY29yZE5vZGVJZHMucHVzaChub2RlLm5vZGVJZCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbm9kZTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXROZXdSZWNvcmRUZW1wbGF0ZSA9IChwYXJlbnQsIG5hbWUgPSAnJywgY3JlYXRlRGVmYXVsdEluZGV4ID0gdHJ1ZSkgPT4gX2dldE5ld1JlY29yZFRlbXBsYXRlKHBhcmVudCwgbmFtZSwgY3JlYXRlRGVmYXVsdEluZGV4LCBmYWxzZSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TmV3U2luZ2xlUmVjb3JkVGVtcGxhdGUgPSBwYXJlbnQgPT4gX2dldE5ld1JlY29yZFRlbXBsYXRlKHBhcmVudCwgJycsIGZhbHNlLCB0cnVlKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXROZXdJbmRleFRlbXBsYXRlID0gKHBhcmVudCwgdHlwZSA9ICdhbmNlc3RvcicpID0+IGNvbnN0cnVjdE5vZGUocGFyZW50LCB7XHJcbiAgbmFtZTogJycsXHJcbiAgdHlwZTogJ2luZGV4JyxcclxuICBtYXA6ICdyZXR1cm4gey4uLnJlY29yZH07JyxcclxuICBmaWx0ZXI6ICcnLFxyXG4gIGluZGV4VHlwZTogdHlwZSxcclxuICBnZXRTaGFyZE5hbWU6ICcnLFxyXG4gIGdldFNvcnRLZXk6ICdyZWNvcmQuaWQnLFxyXG4gIGFnZ3JlZ2F0ZUdyb3VwczogW10sXHJcbiAgYWxsb3dlZFJlY29yZE5vZGVJZHM6IFtdLFxyXG4gIG5vZGVJZDogZ2V0Tm9kZUlkKHBhcmVudCksXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldE5ld0FnZ3JlZ2F0ZUdyb3VwVGVtcGxhdGUgPSBpbmRleCA9PiBjb25zdHJ1Y3ROb2RlKGluZGV4LCB7XHJcbiAgbmFtZTogJycsXHJcbiAgdHlwZTogJ2FnZ3JlZ2F0ZUdyb3VwJyxcclxuICBncm91cEJ5OiAnJyxcclxuICBhZ2dyZWdhdGVzOiBbXSxcclxuICBjb25kaXRpb246ICcnLFxyXG4gIG5vZGVJZDogZ2V0Tm9kZUlkKGluZGV4KSxcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TmV3QWdncmVnYXRlVGVtcGxhdGUgPSAoc2V0KSA9PiB7XHJcbiAgY29uc3QgYWdncmVnYXRlZFZhbHVlID0ge1xyXG4gICAgbmFtZTogJycsXHJcbiAgICBhZ2dyZWdhdGVkVmFsdWU6ICcnLFxyXG4gIH07XHJcbiAgc2V0LmFnZ3JlZ2F0ZXMucHVzaChhZ2dyZWdhdGVkVmFsdWUpO1xyXG4gIHJldHVybiBhZ2dyZWdhdGVkVmFsdWU7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZ2V0TmV3Um9vdExldmVsLFxyXG4gIGdldE5ld1JlY29yZFRlbXBsYXRlLFxyXG4gIGdldE5ld0luZGV4VGVtcGxhdGUsXHJcbiAgY3JlYXRlTm9kZUVycm9ycyxcclxuICBjb25zdHJ1Y3RIaWVyYXJjaHksXHJcbiAgZ2V0TmV3QWdncmVnYXRlR3JvdXBUZW1wbGF0ZSxcclxuICBnZXROZXdBZ2dyZWdhdGVUZW1wbGF0ZSxcclxufTtcclxuIiwiaW1wb3J0IHtcbiAgc29tZSwgbWFwLCBmaWx0ZXIsIGtleXMsIGluY2x1ZGVzLFxuICBjb3VudEJ5LCBmbGF0dGVuLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgaXNTb21ldGhpbmcsICQsXG4gIGlzTm9uRW1wdHlTdHJpbmcsXG4gIGlzTm90aGluZ09yRW1wdHksXG4gIGlzTm90aGluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGFsbCwgZ2V0RGVmYXVsdE9wdGlvbnMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBmaWVsZEVycm9ycyA9IHtcbiAgQWRkRmllbGRWYWxpZGF0aW9uRmFpbGVkOiAnQWRkIGZpZWxkIHZhbGlkYXRpb246ICcsXG59O1xuXG5leHBvcnQgY29uc3QgYWxsb3dlZFR5cGVzID0gKCkgPT4ga2V5cyhhbGwpO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3RmllbGQgPSB0eXBlID0+ICh7XG4gIG5hbWU6ICcnLCAvLyBob3cgZmllbGQgaXMgcmVmZXJlbmNlZCBpbnRlcm5hbGx5XG4gIHR5cGUsXG4gIHR5cGVPcHRpb25zOiBnZXREZWZhdWx0T3B0aW9ucyh0eXBlKSxcbiAgbGFiZWw6ICcnLCAvLyBob3cgZmllbGQgaXMgZGlzcGxheWVkXG4gIGdldEluaXRpYWxWYWx1ZTogJ2RlZmF1bHQnLCAvLyBmdW5jdGlvbiB0aGF0IGdldHMgdmFsdWUgd2hlbiBpbml0aWFsbHkgY3JlYXRlZFxuICBnZXRVbmRlZmluZWRWYWx1ZTogJ2RlZmF1bHQnLCAvLyBmdW5jdGlvbiB0aGF0IGdldHMgdmFsdWUgd2hlbiBmaWVsZCB1bmRlZmluZWQgb24gcmVjb3JkXG59KTtcblxuY29uc3QgZmllbGRSdWxlcyA9IGFsbEZpZWxkcyA9PiBbXG4gIG1ha2VydWxlKCduYW1lJywgJ2ZpZWxkIG5hbWUgaXMgbm90IHNldCcsXG4gICAgZiA9PiBpc05vbkVtcHR5U3RyaW5nKGYubmFtZSkpLFxuICBtYWtlcnVsZSgndHlwZScsICdmaWVsZCB0eXBlIGlzIG5vdCBzZXQnLFxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLnR5cGUpKSxcbiAgbWFrZXJ1bGUoJ2xhYmVsJywgJ2ZpZWxkIGxhYmVsIGlzIG5vdCBzZXQnLFxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLmxhYmVsKSksXG4gIG1ha2VydWxlKCdnZXRJbml0aWFsVmFsdWUnLCAnZ2V0SW5pdGlhbFZhbHVlIGZ1bmN0aW9uIGlzIG5vdCBzZXQnLFxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLmdldEluaXRpYWxWYWx1ZSkpLFxuICBtYWtlcnVsZSgnZ2V0VW5kZWZpbmVkVmFsdWUnLCAnZ2V0VW5kZWZpbmVkVmFsdWUgZnVuY3Rpb24gaXMgbm90IHNldCcsXG4gICAgZiA9PiBpc05vbkVtcHR5U3RyaW5nKGYuZ2V0VW5kZWZpbmVkVmFsdWUpKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnZmllbGQgbmFtZSBpcyBkdXBsaWNhdGVkJyxcbiAgICBmID0+IGlzTm90aGluZ09yRW1wdHkoZi5uYW1lKVxuICAgICAgICAgICAgIHx8IGNvdW50QnkoJ25hbWUnKShhbGxGaWVsZHMpW2YubmFtZV0gPT09IDEpLFxuICBtYWtlcnVsZSgndHlwZScsICd0eXBlIGlzIHVua25vd24nLFxuICAgIGYgPT4gaXNOb3RoaW5nT3JFbXB0eShmLnR5cGUpXG4gICAgICAgICAgICAgfHwgc29tZSh0ID0+IGYudHlwZSA9PT0gdCkoYWxsb3dlZFR5cGVzKCkpKSxcbl07XG5cbmNvbnN0IHR5cGVPcHRpb25zUnVsZXMgPSAoZmllbGQpID0+IHtcbiAgY29uc3QgdHlwZSA9IGFsbFtmaWVsZC50eXBlXTtcbiAgaWYgKGlzTm90aGluZyh0eXBlKSkgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IGRlZiA9IG9wdE5hbWUgPT4gdHlwZS5vcHRpb25EZWZpbml0aW9uc1tvcHROYW1lXTtcblxuICByZXR1cm4gJChmaWVsZC50eXBlT3B0aW9ucywgW1xuICAgIGtleXMsXG4gICAgZmlsdGVyKG8gPT4gaXNTb21ldGhpbmcoZGVmKG8pKVxuICAgICAgICAgICAgICAgICAgICAmJiBpc1NvbWV0aGluZyhkZWYobykuaXNWYWxpZCkpLFxuICAgIG1hcChvID0+IG1ha2VydWxlKFxuICAgICAgYHR5cGVPcHRpb25zLiR7b31gLFxuICAgICAgYCR7ZGVmKG8pLnJlcXVpcmVtZW50RGVzY3JpcHRpb259YCxcbiAgICAgIGZpZWxkID0+IGRlZihvKS5pc1ZhbGlkKGZpZWxkLnR5cGVPcHRpb25zW29dKSxcbiAgICApKSxcbiAgXSk7XG59O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVGaWVsZCA9IGFsbEZpZWxkcyA9PiAoZmllbGQpID0+IHtcbiAgY29uc3QgZXZlcnlTaW5nbGVGaWVsZCA9IGluY2x1ZGVzKGZpZWxkKShhbGxGaWVsZHMpID8gYWxsRmllbGRzIDogWy4uLmFsbEZpZWxkcywgZmllbGRdO1xuICByZXR1cm4gYXBwbHlSdWxlU2V0KFsuLi5maWVsZFJ1bGVzKGV2ZXJ5U2luZ2xlRmllbGQpLCAuLi50eXBlT3B0aW9uc1J1bGVzKGZpZWxkKV0pKGZpZWxkKTtcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFsbEZpZWxkcyA9IHJlY29yZE5vZGUgPT4gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICBtYXAodmFsaWRhdGVGaWVsZChyZWNvcmROb2RlLmZpZWxkcykpLFxuICBmbGF0dGVuLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBhZGRGaWVsZCA9IChyZWNvcmRUZW1wbGF0ZSwgZmllbGQpID0+IHtcbiAgaWYgKGlzTm90aGluZ09yRW1wdHkoZmllbGQubGFiZWwpKSB7XG4gICAgZmllbGQubGFiZWwgPSBmaWVsZC5uYW1lO1xuICB9XG4gIGNvbnN0IHZhbGlkYXRpb25NZXNzYWdlcyA9IHZhbGlkYXRlRmllbGQoWy4uLnJlY29yZFRlbXBsYXRlLmZpZWxkcywgZmllbGRdKShmaWVsZCk7XG4gIGlmICh2YWxpZGF0aW9uTWVzc2FnZXMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGVycm9ycyA9IG1hcChtID0+IG0uZXJyb3IpKHZhbGlkYXRpb25NZXNzYWdlcyk7XG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgJHtmaWVsZEVycm9ycy5BZGRGaWVsZFZhbGlkYXRpb25GYWlsZWR9ICR7ZXJyb3JzLmpvaW4oJywgJyl9YCk7XG4gIH1cbiAgcmVjb3JkVGVtcGxhdGUuZmllbGRzLnB1c2goZmllbGQpO1xufTtcbiIsImltcG9ydCB7IGlzTnVtYmVyLCBpc0Jvb2xlYW4sIGRlZmF1bHRDYXNlIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHN3aXRjaENhc2UgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUgPSAoaW52YWxpZEZpZWxkcyxcbiAgbWVzc2FnZVdoZW5JbnZhbGlkLFxuICBleHByZXNzaW9uV2hlblZhbGlkKSA9PiAoe1xuICBpbnZhbGlkRmllbGRzLCBtZXNzYWdlV2hlbkludmFsaWQsIGV4cHJlc3Npb25XaGVuVmFsaWQsXG59KTtcblxuY29uc3QgZ2V0U3RhdGljVmFsdWUgPSBzd2l0Y2hDYXNlKFxuICBbaXNOdW1iZXIsIHYgPT4gdi50b1N0cmluZygpXSxcbiAgW2lzQm9vbGVhbiwgdiA9PiB2LnRvU3RyaW5nKCldLFxuICBbZGVmYXVsdENhc2UsIHYgPT4gYCcke3Z9J2BdLFxuKTtcblxuZXhwb3J0IGNvbnN0IGNvbW1vblJlY29yZFZhbGlkYXRpb25SdWxlcyA9ICh7XG5cbiAgZmllbGROb3RFbXB0eTogZmllbGROYW1lID0+IGdldE5ld1JlY29yZFZhbGlkYXRpb25SdWxlKFxuICAgIFtmaWVsZE5hbWVdLFxuICAgIGAke2ZpZWxkTmFtZX0gaXMgZW1wdHlgLFxuICAgIGAhXy5pc0VtcHR5KHJlY29yZFsnJHtmaWVsZE5hbWV9J10pYCxcbiAgKSxcblxuICBmaWVsZEJldHdlZW46IChmaWVsZE5hbWUsIG1pbiwgbWF4KSA9PiBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZShcbiAgICBbZmllbGROYW1lXSxcbiAgICBgJHtmaWVsZE5hbWV9IG11c3QgYmUgYmV0d2VlbiAke21pbi50b1N0cmluZygpfSBhbmQgJHttYXgudG9TdHJpbmcoKX1gLFxuICAgIGByZWNvcmRbJyR7ZmllbGROYW1lfSddID49ICR7Z2V0U3RhdGljVmFsdWUobWluKX0gJiYgIHJlY29yZFsnJHtmaWVsZE5hbWV9J10gPD0gJHtnZXRTdGF0aWNWYWx1ZShtYXgpfSBgLFxuICApLFxuXG4gIGZpZWxkR3JlYXRlclRoYW46IChmaWVsZE5hbWUsIG1pbiwgbWF4KSA9PiBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZShcbiAgICBbZmllbGROYW1lXSxcbiAgICBgJHtmaWVsZE5hbWV9IG11c3QgYmUgZ3JlYXRlciB0aGFuICR7bWluLnRvU3RyaW5nKCl9IGFuZCAke21heC50b1N0cmluZygpfWAsXG4gICAgYHJlY29yZFsnJHtmaWVsZE5hbWV9J10gPj0gJHtnZXRTdGF0aWNWYWx1ZShtaW4pfSAgYCxcbiAgKSxcbn0pO1xuXG5leHBvcnQgY29uc3QgYWRkUmVjb3JkVmFsaWRhdGlvblJ1bGUgPSByZWNvcmROb2RlID0+IHJ1bGUgPT4gcmVjb3JkTm9kZS52YWxpZGF0aW9uUnVsZXMucHVzaChydWxlKTtcbiIsIlxuZXhwb3J0IGNvbnN0IGNyZWF0ZVRyaWdnZXIgPSAoKSA9PiAoe1xuICBhY3Rpb25OYW1lOiAnJyxcbiAgZXZlbnROYW1lOiAnJyxcbiAgLy8gZnVuY3Rpb24sIGhhcyBhY2Nlc3MgdG8gZXZlbnQgY29udGV4dCxcbiAgLy8gcmV0dXJucyBvYmplY3QgdGhhdCBpcyB1c2VkIGFzIHBhcmFtZXRlciB0byBhY3Rpb25cbiAgLy8gb25seSB1c2VkIGlmIHRyaWdnZXJlZCBieSBldmVudFxuICBvcHRpb25zQ3JlYXRvcjogJycsXG4gIC8vIGFjdGlvbiBydW5zIGlmIHRydWUsXG4gIC8vIGhhcyBhY2Nlc3MgdG8gZXZlbnQgY29udGV4dFxuICBjb25kaXRpb246ICcnLFxufSk7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVBY3Rpb24gPSAoKSA9PiAoe1xuICBuYW1lOiAnJyxcbiAgYmVoYXZpb3VyU291cmNlOiAnJyxcbiAgLy8gbmFtZSBvZiBmdW5jdGlvbiBpbiBhY3Rpb25Tb3VyY2VcbiAgYmVoYXZpb3VyTmFtZTogJycsXG4gIC8vIHBhcmFtZXRlciBwYXNzZWQgaW50byBiZWhhdmlvdXIuXG4gIC8vIGFueSBvdGhlciBwYXJtcyBwYXNzZWQgYXQgcnVudGltZSBlLmcuXG4gIC8vIGJ5IHRyaWdnZXIsIG9yIG1hbnVhbGx5LCB3aWxsIGJlIG1lcmdlZCBpbnRvIHRoaXNcbiAgaW5pdGlhbE9wdGlvbnM6IHt9LFxufSk7XG4iLCJpbXBvcnQgeyBmbGF0dGVuLCBtYXAsIGlzRW1wdHkgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgY29tcGlsZUNvZGUgfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XG5pbXBvcnQge1xuICBpc05vbkVtcHR5U3RyaW5nLCBcbiAgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uLCAkLCBcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGFwcGx5UnVsZVNldCwgbWFrZXJ1bGUgfSBmcm9tICcuLi9jb21tb24vdmFsaWRhdGlvbkNvbW1vbic7XG5cbmNvbnN0IGFnZ3JlZ2F0ZVJ1bGVzID0gW1xuICBtYWtlcnVsZSgnbmFtZScsICdjaG9vc2UgYSBuYW1lIGZvciB0aGUgYWdncmVnYXRlJyxcbiAgICBhID0+IGlzTm9uRW1wdHlTdHJpbmcoYS5uYW1lKSksXG4gIG1ha2VydWxlKCdhZ2dyZWdhdGVkVmFsdWUnLCAnYWdncmVnYXRlZFZhbHVlIGRvZXMgbm90IGNvbXBpbGUnLFxuICAgIGEgPT4gaXNFbXB0eShhLmFnZ3JlZ2F0ZWRWYWx1ZSlcbiAgICAgICAgICAgIHx8IGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbihcbiAgICAgICAgICAgICAgKCkgPT4gY29tcGlsZUNvZGUoYS5hZ2dyZWdhdGVkVmFsdWUpLFxuICAgICAgICAgICAgKSksXG5dO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBZ2dyZWdhdGUgPSBhZ2dyZWdhdGUgPT4gYXBwbHlSdWxlU2V0KGFnZ3JlZ2F0ZVJ1bGVzKShhZ2dyZWdhdGUpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBbGxBZ2dyZWdhdGVzID0gYWxsID0+ICQoYWxsLCBbXG4gIG1hcCh2YWxpZGF0ZUFnZ3JlZ2F0ZSksXG4gIGZsYXR0ZW4sXG5dKTtcbiIsImltcG9ydCB7XG4gIGZpbHRlciwgdW5pb24sIGNvbnN0YW50LFxuICBtYXAsIGZsYXR0ZW4sIGV2ZXJ5LCB1bmlxQnksXG4gIHNvbWUsIGluY2x1ZGVzLCBpc0VtcHR5LCBoYXNcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCB7XG4gICQsIGlzU29tZXRoaW5nLCBzd2l0Y2hDYXNlLFxuICBhbnlUcnVlLCBpc05vbkVtcHR5QXJyYXksIGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbixcbiAgaXNOb25FbXB0eVN0cmluZywgZGVmYXVsdENhc2UsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBpc1JlY29yZCwgaXNSb290LCBpc2FnZ3JlZ2F0ZUdyb3VwLFxuICBpc0luZGV4LCBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG59IGZyb20gJy4vaGllcmFyY2h5JztcbmltcG9ydCB7IGV2ZW50c0xpc3QgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcbmltcG9ydCB7IHZhbGlkYXRlQWxsRmllbGRzIH0gZnJvbSAnLi9maWVsZHMnO1xuaW1wb3J0IHtcbiAgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSwgc3RyaW5nTm90RW1wdHksXG4gIHZhbGlkYXRpb25FcnJvcixcbn0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHsgaW5kZXhSdWxlU2V0IH0gZnJvbSAnLi9pbmRleGVzJztcbmltcG9ydCB7IHZhbGlkYXRlQWxsQWdncmVnYXRlcyB9IGZyb20gJy4vdmFsaWRhdGVBZ2dyZWdhdGUnO1xuXG5leHBvcnQgY29uc3QgcnVsZVNldCA9ICguLi5zZXRzKSA9PiBjb25zdGFudChmbGF0dGVuKFsuLi5zZXRzXSkpO1xuXG5jb25zdCBjb21tb25SdWxlcyA9IFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnbm9kZSBuYW1lIGlzIG5vdCBzZXQnLFxuICAgIG5vZGUgPT4gc3RyaW5nTm90RW1wdHkobm9kZS5uYW1lKSksXG4gIG1ha2VydWxlKCd0eXBlJywgJ25vZGUgdHlwZSBub3QgcmVjb2duaXNlZCcsXG4gICAgYW55VHJ1ZShpc1JlY29yZCwgaXNSb290LCBpc0luZGV4LCBpc2FnZ3JlZ2F0ZUdyb3VwKSksXG5dO1xuXG5jb25zdCByZWNvcmRSdWxlcyA9IFtcbiAgbWFrZXJ1bGUoJ2ZpZWxkcycsICdubyBmaWVsZHMgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSByZWNvcmQnLFxuICAgIG5vZGUgPT4gaXNOb25FbXB0eUFycmF5KG5vZGUuZmllbGRzKSksXG4gIG1ha2VydWxlKCd2YWxpZGF0aW9uUnVsZXMnLCBcInZhbGlkYXRpb24gcnVsZSBpcyBtaXNzaW5nIGEgJ21lc3NhZ2VXaGVuVmFsaWQnIG1lbWJlclwiLFxuICAgIG5vZGUgPT4gZXZlcnkociA9PiBoYXMoJ21lc3NhZ2VXaGVuSW52YWxpZCcpKHIpKShub2RlLnZhbGlkYXRpb25SdWxlcykpLFxuICBtYWtlcnVsZSgndmFsaWRhdGlvblJ1bGVzJywgXCJ2YWxpZGF0aW9uIHJ1bGUgaXMgbWlzc2luZyBhICdleHByZXNzaW9uV2hlblZhbGlkJyBtZW1iZXJcIixcbiAgICBub2RlID0+IGV2ZXJ5KHIgPT4gaGFzKCdleHByZXNzaW9uV2hlblZhbGlkJykocikpKG5vZGUudmFsaWRhdGlvblJ1bGVzKSksXG5dO1xuXG5cbmNvbnN0IGFnZ3JlZ2F0ZUdyb3VwUnVsZXMgPSBbXG4gIG1ha2VydWxlKCdjb25kaXRpb24nLCAnY29uZGl0aW9uIGRvZXMgbm90IGNvbXBpbGUnLFxuICAgIGEgPT4gaXNFbXB0eShhLmNvbmRpdGlvbilcbiAgICAgICAgICAgICB8fCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24oXG4gICAgICAgICAgICAgICAoKSA9PiBjb21waWxlRXhwcmVzc2lvbihhLmNvbmRpdGlvbiksXG4gICAgICAgICAgICAgKSksXG5dO1xuXG5jb25zdCBnZXRSdWxlU2V0ID0gbm9kZSA9PiBzd2l0Y2hDYXNlKFxuXG4gIFtpc1JlY29yZCwgcnVsZVNldChcbiAgICBjb21tb25SdWxlcyxcbiAgICByZWNvcmRSdWxlcyxcbiAgKV0sXG5cbiAgW2lzSW5kZXgsIHJ1bGVTZXQoXG4gICAgY29tbW9uUnVsZXMsXG4gICAgaW5kZXhSdWxlU2V0LFxuICApXSxcblxuICBbaXNhZ2dyZWdhdGVHcm91cCwgcnVsZVNldChcbiAgICBjb21tb25SdWxlcyxcbiAgICBhZ2dyZWdhdGVHcm91cFJ1bGVzLFxuICApXSxcblxuICBbZGVmYXVsdENhc2UsIHJ1bGVTZXQoY29tbW9uUnVsZXMsIFtdKV0sXG4pKG5vZGUpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVOb2RlID0gbm9kZSA9PiBhcHBseVJ1bGVTZXQoZ2V0UnVsZVNldChub2RlKSkobm9kZSk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFsbCA9IChhcHBIaWVyYXJjaHkpID0+IHtcbiAgY29uc3QgZmxhdHRlbmVkID0gZ2V0RmxhdHRlbmVkSGllcmFyY2h5KFxuICAgIGFwcEhpZXJhcmNoeSxcbiAgKTtcblxuICBjb25zdCBkdXBsaWNhdGVOYW1lUnVsZSA9IG1ha2VydWxlKFxuICAgICduYW1lJywgJ25vZGUgbmFtZXMgbXVzdCBiZSB1bmlxdWUgdW5kZXIgc2hhcmVkIHBhcmVudCcsXG4gICAgbiA9PiBmaWx0ZXIoZiA9PiBmLnBhcmVudCgpID09PSBuLnBhcmVudCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICYmIGYubmFtZSA9PT0gbi5uYW1lKShmbGF0dGVuZWQpLmxlbmd0aCA9PT0gMSxcbiAgKTtcblxuICBjb25zdCBkdXBsaWNhdGVOb2RlS2V5RXJyb3JzID0gJChmbGF0dGVuZWQsIFtcbiAgICBtYXAobiA9PiBhcHBseVJ1bGVTZXQoW2R1cGxpY2F0ZU5hbWVSdWxlXSkobikpLFxuICAgIGZpbHRlcihpc1NvbWV0aGluZyksXG4gICAgZmxhdHRlbixcbiAgXSk7XG5cbiAgY29uc3QgZmllbGRFcnJvcnMgPSAkKGZsYXR0ZW5lZCwgW1xuICAgIGZpbHRlcihpc1JlY29yZCksXG4gICAgbWFwKHZhbGlkYXRlQWxsRmllbGRzKSxcbiAgICBmbGF0dGVuLFxuICBdKTtcblxuICBjb25zdCBhZ2dyZWdhdGVFcnJvcnMgPSAkKGZsYXR0ZW5lZCwgW1xuICAgIGZpbHRlcihpc2FnZ3JlZ2F0ZUdyb3VwKSxcbiAgICBtYXAocyA9PiB2YWxpZGF0ZUFsbEFnZ3JlZ2F0ZXMoXG4gICAgICBzLmFnZ3JlZ2F0ZXMsXG4gICAgKSksXG4gICAgZmxhdHRlbixcbiAgXSk7XG5cbiAgcmV0dXJuICQoZmxhdHRlbmVkLCBbXG4gICAgbWFwKHZhbGlkYXRlTm9kZSksXG4gICAgZmxhdHRlbixcbiAgICB1bmlvbihkdXBsaWNhdGVOb2RlS2V5RXJyb3JzKSxcbiAgICB1bmlvbihmaWVsZEVycm9ycyksXG4gICAgdW5pb24oYWdncmVnYXRlRXJyb3JzKSxcbiAgXSk7XG59O1xuXG5jb25zdCBhY3Rpb25SdWxlcyA9IFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnYWN0aW9uIG11c3QgaGF2ZSBhIG5hbWUnLFxuICAgIGEgPT4gaXNOb25FbXB0eVN0cmluZyhhLm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2JlaGF2aW91ck5hbWUnLCAnbXVzdCBzdXBwbHkgYSBiZWhhdmlvdXIgbmFtZSB0byB0aGUgYWN0aW9uJyxcbiAgICBhID0+IGlzTm9uRW1wdHlTdHJpbmcoYS5iZWhhdmlvdXJOYW1lKSksXG4gIG1ha2VydWxlKCdiZWhhdmlvdXJTb3VyY2UnLCAnbXVzdCBzdXBwbHkgYSBiZWhhdmlvdXIgc291cmNlIGZvciB0aGUgYWN0aW9uJyxcbiAgICBhID0+IGlzTm9uRW1wdHlTdHJpbmcoYS5iZWhhdmlvdXJTb3VyY2UpKSxcbl07XG5cbmNvbnN0IGR1cGxpY2F0ZUFjdGlvblJ1bGUgPSBtYWtlcnVsZSgnJywgJ2FjdGlvbiBuYW1lIG11c3QgYmUgdW5pcXVlJywgKCkgPT4ge30pO1xuXG5jb25zdCB2YWxpZGF0ZUFjdGlvbiA9IGFjdGlvbiA9PiBhcHBseVJ1bGVTZXQoYWN0aW9uUnVsZXMpKGFjdGlvbik7XG5cblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWN0aW9ucyA9IChhbGxBY3Rpb25zKSA9PiB7XG4gIGNvbnN0IGR1cGxpY2F0ZUFjdGlvbnMgPSAkKGFsbEFjdGlvbnMsIFtcbiAgICBmaWx0ZXIoYSA9PiBmaWx0ZXIoYTIgPT4gYTIubmFtZSA9PT0gYS5uYW1lKShhbGxBY3Rpb25zKS5sZW5ndGggPiAxKSxcbiAgICBtYXAoYSA9PiB2YWxpZGF0aW9uRXJyb3IoZHVwbGljYXRlQWN0aW9uUnVsZSwgYSkpLFxuICBdKTtcblxuICBjb25zdCBlcnJvcnMgPSAkKGFsbEFjdGlvbnMsIFtcbiAgICBtYXAodmFsaWRhdGVBY3Rpb24pLFxuICAgIGZsYXR0ZW4sXG4gICAgdW5pb24oZHVwbGljYXRlQWN0aW9ucyksXG4gICAgdW5pcUJ5KCduYW1lJyksXG4gIF0pO1xuXG4gIHJldHVybiBlcnJvcnM7XG59O1xuXG5jb25zdCB0cmlnZ2VyUnVsZXMgPSBhY3Rpb25zID0+IChbXG4gIG1ha2VydWxlKCdhY3Rpb25OYW1lJywgJ211c3Qgc3BlY2lmeSBhbiBhY3Rpb24nLFxuICAgIHQgPT4gaXNOb25FbXB0eVN0cmluZyh0LmFjdGlvbk5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2V2ZW50TmFtZScsICdtdXN0IHNwZWNpZnkgYW5kIGV2ZW50JyxcbiAgICB0ID0+IGlzTm9uRW1wdHlTdHJpbmcodC5ldmVudE5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2FjdGlvbk5hbWUnLCAnc3BlY2lmaWVkIGFjdGlvbiBub3Qgc3VwcGxpZWQnLFxuICAgIHQgPT4gIXQuYWN0aW9uTmFtZVxuICAgICAgICAgICAgIHx8IHNvbWUoYSA9PiBhLm5hbWUgPT09IHQuYWN0aW9uTmFtZSkoYWN0aW9ucykpLFxuICBtYWtlcnVsZSgnZXZlbnROYW1lJywgJ2ludmFsaWQgRXZlbnQgTmFtZScsXG4gICAgdCA9PiAhdC5ldmVudE5hbWVcbiAgICAgICAgICAgICB8fCBpbmNsdWRlcyh0LmV2ZW50TmFtZSkoZXZlbnRzTGlzdCkpLFxuICBtYWtlcnVsZSgnb3B0aW9uc0NyZWF0b3InLCAnT3B0aW9ucyBDcmVhdG9yIGRvZXMgbm90IGNvbXBpbGUgLSBjaGVjayB5b3VyIGV4cHJlc3Npb24nLFxuICAgICh0KSA9PiB7XG4gICAgICBpZiAoIXQub3B0aW9uc0NyZWF0b3IpIHJldHVybiB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29tcGlsZUNvZGUodC5vcHRpb25zQ3JlYXRvcik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoXykgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9KSxcbiAgbWFrZXJ1bGUoJ2NvbmRpdGlvbicsICdUcmlnZ2VyIGNvbmRpdGlvbiBkb2VzIG5vdCBjb21waWxlIC0gY2hlY2sgeW91ciBleHByZXNzaW9uJyxcbiAgICAodCkgPT4ge1xuICAgICAgaWYgKCF0LmNvbmRpdGlvbikgcmV0dXJuIHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICBjb21waWxlRXhwcmVzc2lvbih0LmNvbmRpdGlvbik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoXykgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9KSxcbl0pO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVUcmlnZ2VyID0gKHRyaWdnZXIsIGFsbEFjdGlvbnMpID0+IHtcbiAgY29uc3QgZXJyb3JzID0gYXBwbHlSdWxlU2V0KHRyaWdnZXJSdWxlcyhhbGxBY3Rpb25zKSkodHJpZ2dlcik7XG5cbiAgcmV0dXJuIGVycm9ycztcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVRyaWdnZXJzID0gKHRyaWdnZXJzLCBhbGxBY3Rpb25zKSA9PiAkKHRyaWdnZXJzLCBbXG4gIG1hcCh0ID0+IHZhbGlkYXRlVHJpZ2dlcih0LCBhbGxBY3Rpb25zKSksXG4gIGZsYXR0ZW4sXG5dKTtcbiIsImltcG9ydCB7IGFwcERlZmluaXRpb25GaWxlIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGNvbnN0cnVjdEhpZXJhcmNoeSB9IGZyb20gJy4vY3JlYXRlTm9kZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uID0gZGF0YXN0b3JlID0+IGFzeW5jICgpID0+IHtcbiAgY29uc3QgZXhpc3RzID0gYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhhcHBEZWZpbml0aW9uRmlsZSk7XG5cbiAgaWYgKCFleGlzdHMpIHRocm93IG5ldyBFcnJvcignQXBwbGljYXRpb24gZGVmaW5pdGlvbiBkb2VzIG5vdCBleGlzdCcpO1xuXG4gIGNvbnN0IGFwcERlZmluaXRpb24gPSBhd2FpdCBkYXRhc3RvcmUubG9hZEpzb24oYXBwRGVmaW5pdGlvbkZpbGUpO1xuICBhcHBEZWZpbml0aW9uLmhpZXJhcmNoeSA9IGNvbnN0cnVjdEhpZXJhcmNoeShcbiAgICBhcHBEZWZpbml0aW9uLmhpZXJhcmNoeSxcbiAgKTtcbiAgcmV0dXJuIGFwcERlZmluaXRpb247XG59O1xuIiwiaW1wb3J0IHsgam9pbiB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBhcHBEZWZpbml0aW9uRmlsZSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyB2YWxpZGF0ZUFsbCB9IGZyb20gJy4vdmFsaWRhdGUnO1xuaW1wb3J0IHsgYXBpV3JhcHBlciB9IGZyb20gJy4uL2NvbW1vbi9hcGlXcmFwcGVyJztcbmltcG9ydCB7IGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xuXG5leHBvcnQgY29uc3Qgc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5ID0gYXBwID0+IGFzeW5jIGhpZXJhcmNoeSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy50ZW1wbGF0ZUFwaS5zYXZlQXBwbGljYXRpb25IaWVyYXJjaHksXG4gIHBlcm1pc3Npb24ud3JpdGVUZW1wbGF0ZXMuaXNBdXRob3JpemVkLFxuICB7IGhpZXJhcmNoeSB9LFxuICBfc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlLCBoaWVyYXJjaHksXG4pO1xuXG5cbmV4cG9ydCBjb25zdCBfc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5ID0gYXN5bmMgKGRhdGFzdG9yZSwgaGllcmFyY2h5KSA9PiB7XG4gIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSBhd2FpdCB2YWxpZGF0ZUFsbChoaWVyYXJjaHkpO1xuICBpZiAodmFsaWRhdGlvbkVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBIaWVyYXJjaHkgaXMgaW52YWxpZDogJHtqb2luKFxuICAgICAgdmFsaWRhdGlvbkVycm9ycy5tYXAoZSA9PiBgJHtlLml0ZW0ubm9kZUtleSA/IGUuaXRlbS5ub2RlS2V5KCkgOiAnJ30gOiAke2UuZXJyb3J9YCksXG4gICAgICAnLCcsXG4gICAgKX1gKTtcbiAgfVxuXG4gIGlmIChhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGFwcERlZmluaXRpb25GaWxlKSkge1xuICAgIGNvbnN0IGFwcERlZmluaXRpb24gPSBhd2FpdCBkYXRhc3RvcmUubG9hZEpzb24oYXBwRGVmaW5pdGlvbkZpbGUpO1xuICAgIGFwcERlZmluaXRpb24uaGllcmFyY2h5ID0gaGllcmFyY2h5O1xuICAgIGF3YWl0IGRhdGFzdG9yZS51cGRhdGVKc29uKGFwcERlZmluaXRpb25GaWxlLCBhcHBEZWZpbml0aW9uKTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKCcvLmNvbmZpZycpO1xuICAgIGNvbnN0IGFwcERlZmluaXRpb24gPSB7IGFjdGlvbnM6IFtdLCB0cmlnZ2VyczogW10sIGhpZXJhcmNoeSB9O1xuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKGFwcERlZmluaXRpb25GaWxlLCBhcHBEZWZpbml0aW9uKTtcbiAgfVxufTtcbiIsImltcG9ydCB7IGpvaW4gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGFwcERlZmluaXRpb25GaWxlIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHZhbGlkYXRlVHJpZ2dlcnMsIHZhbGlkYXRlQWN0aW9ucyB9IGZyb20gJy4vdmFsaWRhdGUnO1xuaW1wb3J0IHsgYXBpV3JhcHBlciB9IGZyb20gJy4uL2NvbW1vbi9hcGlXcmFwcGVyJztcbmltcG9ydCB7IGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBzYXZlQWN0aW9uc0FuZFRyaWdnZXJzID0gYXBwID0+IGFzeW5jIChhY3Rpb25zLCB0cmlnZ2VycykgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMudGVtcGxhdGVBcGkuc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycyxcbiAgcGVybWlzc2lvbi53cml0ZVRlbXBsYXRlcy5pc0F1dGhvcml6ZWQsXG4gIHsgYWN0aW9ucywgdHJpZ2dlcnMgfSxcbiAgX3NhdmVBY3Rpb25zQW5kVHJpZ2dlcnMsIGFwcC5kYXRhc3RvcmUsIGFjdGlvbnMsIHRyaWdnZXJzLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9zYXZlQWN0aW9uc0FuZFRyaWdnZXJzID0gYXN5bmMgKGRhdGFzdG9yZSwgYWN0aW9ucywgdHJpZ2dlcnMpID0+IHtcbiAgaWYgKGF3YWl0IGRhdGFzdG9yZS5leGlzdHMoYXBwRGVmaW5pdGlvbkZpbGUpKSB7XG4gICAgY29uc3QgYXBwRGVmaW5pdGlvbiA9IGF3YWl0IGRhdGFzdG9yZS5sb2FkSnNvbihhcHBEZWZpbml0aW9uRmlsZSk7XG4gICAgYXBwRGVmaW5pdGlvbi5hY3Rpb25zID0gYWN0aW9ucztcbiAgICBhcHBEZWZpbml0aW9uLnRyaWdnZXJzID0gdHJpZ2dlcnM7XG5cbiAgICBjb25zdCBhY3Rpb25WYWxpZEVycnMgPSBtYXAoZSA9PiBlLmVycm9yKSh2YWxpZGF0ZUFjdGlvbnMoYWN0aW9ucykpO1xuXG4gICAgaWYgKGFjdGlvblZhbGlkRXJycy5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBBY3Rpb25zIGFyZSBpbnZhbGlkOiAke2pvaW4oYWN0aW9uVmFsaWRFcnJzLCAnLCAnKX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCB0cmlnZ2VyVmFsaWRFcnJzID0gbWFwKGUgPT4gZS5lcnJvcikodmFsaWRhdGVUcmlnZ2Vycyh0cmlnZ2VycywgYWN0aW9ucykpO1xuXG4gICAgaWYgKHRyaWdnZXJWYWxpZEVycnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgVHJpZ2dlcnMgYXJlIGludmFsaWQ6ICR7am9pbih0cmlnZ2VyVmFsaWRFcnJzLCAnLCAnKX1gKTtcbiAgICB9XG5cbiAgICBhd2FpdCBkYXRhc3RvcmUudXBkYXRlSnNvbihhcHBEZWZpbml0aW9uRmlsZSwgYXBwRGVmaW5pdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignQ2Fubm90IHNhdmUgYWN0aW9uczogQXBwbGljYXRpb24gZGVmaW5pdGlvbiBkb2VzIG5vdCBleGlzdCcpO1xuICB9XG59O1xuIiwiXG5leHBvcnQgY29uc3QgZ2V0QmVoYXZpb3VyU291cmNlcyA9IGFzeW5jIChkYXRhc3RvcmUpID0+IHtcbiAgICBhd2FpdCBkYXRhc3RvcmUubG9hZEZpbGUoJy8uY29uZmlnL2JlaGF2aW91clNvdXJjZXMuanMnKTtcbn07XG4iLCJpbXBvcnQge1xuICBnZXROZXdSb290TGV2ZWwsXG4gIGdldE5ld1JlY29yZFRlbXBsYXRlLCBnZXROZXdJbmRleFRlbXBsYXRlLFxuICBjcmVhdGVOb2RlRXJyb3JzLCBjb25zdHJ1Y3RIaWVyYXJjaHksXG4gIGdldE5ld0FnZ3JlZ2F0ZUdyb3VwVGVtcGxhdGUsIGdldE5ld1NpbmdsZVJlY29yZFRlbXBsYXRlLFxuICBnZXROZXdBZ2dyZWdhdGVUZW1wbGF0ZSwgY29uc3RydWN0Tm9kZSxcbn1cbiAgZnJvbSAnLi9jcmVhdGVOb2Rlcyc7XG5pbXBvcnQge1xuICBnZXROZXdGaWVsZCwgdmFsaWRhdGVGaWVsZCxcbiAgYWRkRmllbGQsIGZpZWxkRXJyb3JzLFxufSBmcm9tICcuL2ZpZWxkcyc7XG5pbXBvcnQge1xuICBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZSwgY29tbW9uUmVjb3JkVmFsaWRhdGlvblJ1bGVzLFxuICBhZGRSZWNvcmRWYWxpZGF0aW9uUnVsZSxcbn0gZnJvbSAnLi9yZWNvcmRWYWxpZGF0aW9uUnVsZXMnO1xuaW1wb3J0IHsgY3JlYXRlQWN0aW9uLCBjcmVhdGVUcmlnZ2VyIH0gZnJvbSAnLi9jcmVhdGVBY3Rpb25zJztcbmltcG9ydCB7XG4gIHZhbGlkYXRlVHJpZ2dlcnMsIHZhbGlkYXRlVHJpZ2dlciwgdmFsaWRhdGVOb2RlLFxuICB2YWxpZGF0ZUFjdGlvbnMsIHZhbGlkYXRlQWxsLFxufSBmcm9tICcuL3ZhbGlkYXRlJztcbmltcG9ydCB7IGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbiB9IGZyb20gJy4vZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uJztcbmltcG9ydCB7IHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSB9IGZyb20gJy4vc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5JztcbmltcG9ydCB7IHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnMgfSBmcm9tICcuL3NhdmVBY3Rpb25zQW5kVHJpZ2dlcnMnO1xuaW1wb3J0IHsgYWxsIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZ2V0QmVoYXZpb3VyU291cmNlcyB9IGZyb20gXCIuL2dldEJlaGF2aW91clNvdXJjZXNcIjtcblxuY29uc3QgYXBpID0gYXBwID0+ICh7XG5cbiAgZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uOiBnZXRBcHBsaWNhdGlvbkRlZmluaXRpb24oYXBwLmRhdGFzdG9yZSksXG4gIHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeTogc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5KGFwcCksXG4gIHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnM6IHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnMoYXBwKSxcbiAgZ2V0QmVoYXZpb3VyU291cmNlczogKCkgPT4gZ2V0QmVoYXZpb3VyU291cmNlcyhhcHAuZGF0YXN0b3JlKSxcbiAgZ2V0TmV3Um9vdExldmVsLFxuICBjb25zdHJ1Y3ROb2RlLFxuICBnZXROZXdJbmRleFRlbXBsYXRlLFxuICBnZXROZXdSZWNvcmRUZW1wbGF0ZSxcbiAgZ2V0TmV3RmllbGQsXG4gIHZhbGlkYXRlRmllbGQsXG4gIGFkZEZpZWxkLFxuICBmaWVsZEVycm9ycyxcbiAgZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUsXG4gIGNvbW1vblJlY29yZFZhbGlkYXRpb25SdWxlcyxcbiAgYWRkUmVjb3JkVmFsaWRhdGlvblJ1bGUsXG4gIGNyZWF0ZUFjdGlvbixcbiAgY3JlYXRlVHJpZ2dlcixcbiAgdmFsaWRhdGVBY3Rpb25zLFxuICB2YWxpZGF0ZVRyaWdnZXIsXG4gIGdldE5ld0FnZ3JlZ2F0ZUdyb3VwVGVtcGxhdGUsXG4gIGdldE5ld0FnZ3JlZ2F0ZVRlbXBsYXRlLFxuICBjb25zdHJ1Y3RIaWVyYXJjaHksXG4gIGdldE5ld1NpbmdsZVJlY29yZFRlbXBsYXRlLFxuICBhbGxUeXBlczogYWxsLFxuICB2YWxpZGF0ZU5vZGUsXG4gIHZhbGlkYXRlQWxsLFxuICB2YWxpZGF0ZVRyaWdnZXJzLFxufSk7XG5cblxuZXhwb3J0IGNvbnN0IGdldFRlbXBsYXRlQXBpID0gYXBwID0+IGFwaShhcHApO1xuXG5leHBvcnQgY29uc3QgZXJyb3JzID0gY3JlYXRlTm9kZUVycm9ycztcblxuZXhwb3J0IGRlZmF1bHQgZ2V0VGVtcGxhdGVBcGk7XG4iLCJpbXBvcnQgeyBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgVVNFUlNfTElTVF9GSUxFLFxuICBzdHJpcFVzZXJPZlNlbnNpdGl2ZVN0dWZmLFxufSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgJCwgYXBpV3JhcHBlciwgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGdldFVzZXJzID0gYXBwID0+IGFzeW5jICgpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuZ2V0VXNlcnMsXG4gIHBlcm1pc3Npb24ubGlzdFVzZXJzLmlzQXV0aG9yaXplZCxcbiAge30sXG4gIF9nZXRVc2VycywgYXBwLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9nZXRVc2VycyA9IGFzeW5jIGFwcCA9PiAkKGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oVVNFUlNfTElTVF9GSUxFKSwgW1xuICBtYXAoc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZiksXG5dKTtcbiIsImltcG9ydCB7IEFDQ0VTU19MRVZFTFNfRklMRSB9IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyBhcGlXcmFwcGVyLCBldmVudHMgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgbG9hZEFjY2Vzc0xldmVscyA9IGFwcCA9PiBhc3luYyAoKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmxvYWRBY2Nlc3NMZXZlbHMsXG4gIHBlcm1pc3Npb24ubGlzdEFjY2Vzc0xldmVscy5pc0F1dGhvcml6ZWQsXG4gIHt9LFxuICBfbG9hZEFjY2Vzc0xldmVscywgYXBwLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9sb2FkQWNjZXNzTGV2ZWxzID0gYXN5bmMgYXBwID0+IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oQUNDRVNTX0xFVkVMU19GSUxFKTtcbiIsImltcG9ydCB7XG4gIGZpbmQsIGZpbHRlciwgc29tZSxcbiAgbWFwLCBmbGF0dGVuLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcbmltcG9ydCB7IF9nZXRVc2VycyB9IGZyb20gJy4vZ2V0VXNlcnMnO1xuaW1wb3J0IHtcbiAgZ2V0VXNlckJ5TmFtZSwgdXNlckF1dGhGaWxlLFxuICBwYXJzZVRlbXBvcmFyeUNvZGUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyBfbG9hZEFjY2Vzc0xldmVscyB9IGZyb20gJy4vbG9hZEFjY2Vzc0xldmVscyc7XG5pbXBvcnQge1xuICBpc05vdGhpbmdPckVtcHR5LCAkLCBhcGlXcmFwcGVyLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmNvbnN0IGR1bW15SGFzaCA9ICckYXJnb24yaSR2PTE5JG09NDA5Nix0PTMscD0xJFVaUm80MDlVWUJHakhKUzNDVjZVeHckclU4NHFVcVBlT1JGektZbVlZMGNlQkxEYVBPK0pXU0g0UGZOaUtYZklLayc7XG5cbmV4cG9ydCBjb25zdCBhdXRoZW50aWNhdGUgPSBhcHAgPT4gYXN5bmMgKHVzZXJuYW1lLCBwYXNzd29yZCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5hdXRoZW50aWNhdGUsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0sXG4gIF9hdXRoZW50aWNhdGUsIGFwcCwgdXNlcm5hbWUsIHBhc3N3b3JkLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9hdXRoZW50aWNhdGUgPSBhc3luYyAoYXBwLCB1c2VybmFtZSwgcGFzc3dvcmQpID0+IHtcbiAgaWYgKGlzTm90aGluZ09yRW1wdHkodXNlcm5hbWUpIHx8IGlzTm90aGluZ09yRW1wdHkocGFzc3dvcmQpKSB7IHJldHVybiBudWxsOyB9XG5cbiAgY29uc3QgYWxsVXNlcnMgPSBhd2FpdCBfZ2V0VXNlcnMoYXBwKTtcbiAgbGV0IHVzZXIgPSBnZXRVc2VyQnlOYW1lKFxuICAgIGFsbFVzZXJzLFxuICAgIHVzZXJuYW1lLFxuICApO1xuXG4gIGNvbnN0IG5vdEFVc2VyID0gJ25vdC1hLXVzZXInO1xuICAvLyBjb250aW51ZSB3aXRoIG5vbi11c2VyIC0gc28gdGltZSB0byB2ZXJpZnkgcmVtYWlucyBjb25zaXN0ZW50XG4gIC8vIHdpdGggdmVyaWZpY2F0aW9uIG9mIGEgdmFsaWQgdXNlclxuICBpZiAoIXVzZXIgfHwgIXVzZXIuZW5hYmxlZCkgeyB1c2VyID0gbm90QVVzZXI7IH1cblxuICBsZXQgdXNlckF1dGg7XG4gIHRyeSB7XG4gICAgdXNlckF1dGggPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgICAgdXNlckF1dGhGaWxlKHVzZXJuYW1lKSxcbiAgICApO1xuICB9IGNhdGNoIChfKSB7XG4gICAgdXNlckF1dGggPSB7IGFjY2Vzc0xldmVsczogW10sIHBhc3N3b3JkSGFzaDogZHVtbXlIYXNoIH07XG4gIH1cblxuICBjb25zdCBwZXJtaXNzaW9ucyA9IGF3YWl0IGJ1aWxkVXNlclBlcm1pc3Npb25zKGFwcCwgdXNlci5hY2Nlc3NMZXZlbHMpO1xuXG4gIGNvbnN0IHZlcmlmaWVkID0gYXdhaXQgYXBwLmNyeXB0by52ZXJpZnkoXG4gICAgdXNlckF1dGgucGFzc3dvcmRIYXNoLFxuICAgIHBhc3N3b3JkLFxuICApO1xuXG4gIGlmICh1c2VyID09PSBub3RBVXNlcikgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHJldHVybiB2ZXJpZmllZFxuICAgID8ge1xuICAgICAgLi4udXNlciwgcGVybWlzc2lvbnMsIHRlbXA6IGZhbHNlLCBpc1VzZXI6IHRydWUsXG4gICAgfVxuICAgIDogbnVsbDtcbn07XG5cbmV4cG9ydCBjb25zdCBhdXRoZW50aWNhdGVUZW1wb3JhcnlBY2Nlc3MgPSBhcHAgPT4gYXN5bmMgKHRlbXBBY2Nlc3NDb2RlKSA9PiB7XG4gIGlmIChpc05vdGhpbmdPckVtcHR5KHRlbXBBY2Nlc3NDb2RlKSkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIGNvbnN0IHRlbXAgPSBwYXJzZVRlbXBvcmFyeUNvZGUodGVtcEFjY2Vzc0NvZGUpO1xuICBsZXQgdXNlciA9ICQoYXdhaXQgX2dldFVzZXJzKGFwcCksIFtcbiAgICBmaW5kKHUgPT4gdS50ZW1wb3JhcnlBY2Nlc3NJZCA9PT0gdGVtcC5pZCksXG4gIF0pO1xuXG4gIGNvbnN0IG5vdEFVc2VyID0gJ25vdC1hLXVzZXInO1xuICBpZiAoIXVzZXIgfHwgIXVzZXIuZW5hYmxlZCkgeyB1c2VyID0gbm90QVVzZXI7IH1cblxuICBsZXQgdXNlckF1dGg7XG4gIHRyeSB7XG4gICAgdXNlckF1dGggPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgICAgdXNlckF1dGhGaWxlKHVzZXIubmFtZSksXG4gICAgKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHVzZXJBdXRoID0ge1xuICAgICAgdGVtcG9yYXJ5QWNjZXNzSGFzaDogZHVtbXlIYXNoLFxuICAgICAgdGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2g6IChhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCkgKyAxMDAwMCksXG4gICAgfTtcbiAgfVxuXG4gIGlmICh1c2VyQXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA8IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKSkgeyB1c2VyID0gbm90QVVzZXI7IH1cblxuICBjb25zdCB0ZW1wQ29kZSA9ICF0ZW1wLmNvZGUgPyBnZW5lcmF0ZSgpIDogdGVtcC5jb2RlO1xuICBjb25zdCB2ZXJpZmllZCA9IGF3YWl0IGFwcC5jcnlwdG8udmVyaWZ5KFxuICAgIHVzZXJBdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2gsXG4gICAgdGVtcENvZGUsXG4gICk7XG5cbiAgaWYgKHVzZXIgPT09IG5vdEFVc2VyKSB7IHJldHVybiBudWxsOyB9XG5cbiAgcmV0dXJuIHZlcmlmaWVkXG4gICAgPyB7XG4gICAgICAuLi51c2VyLFxuICAgICAgcGVybWlzc2lvbnM6IFtdLFxuICAgICAgdGVtcDogdHJ1ZSxcbiAgICAgIGlzVXNlcjogdHJ1ZSxcbiAgICB9XG4gICAgOiBudWxsO1xufTtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkVXNlclBlcm1pc3Npb25zID0gYXN5bmMgKGFwcCwgdXNlckFjY2Vzc0xldmVscykgPT4ge1xuICBjb25zdCBhbGxBY2Nlc3NMZXZlbHMgPSBhd2FpdCBfbG9hZEFjY2Vzc0xldmVscyhhcHApO1xuXG4gIHJldHVybiAkKGFsbEFjY2Vzc0xldmVscy5sZXZlbHMsIFtcbiAgICBmaWx0ZXIobCA9PiBzb21lKHVhID0+IGwubmFtZSA9PT0gdWEpKHVzZXJBY2Nlc3NMZXZlbHMpKSxcbiAgICBtYXAobCA9PiBsLnBlcm1pc3Npb25zKSxcbiAgICBmbGF0dGVuLFxuICBdKTtcbn07XG4iLCJpbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHtcbiAgdGVtcENvZGVFeHBpcnlMZW5ndGgsIFVTRVJTX0xPQ0tfRklMRSxcbiAgVVNFUlNfTElTVF9GSUxFLCB1c2VyQXV0aEZpbGUsXG4gIGdldFVzZXJCeU5hbWUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQge1xuICBnZXRMb2NrLCBpc05vbG9jayxcbiAgcmVsZWFzZUxvY2ssXG59IGZyb20gJy4uL2NvbW1vbi9sb2NrJztcbmltcG9ydCB7IGFwaVdyYXBwZXIsIGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVUZW1wb3JhcnlBY2Nlc3MgPSBhcHAgPT4gYXN5bmMgdXNlck5hbWUgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5jcmVhdGVUZW1wb3JhcnlBY2Nlc3MsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgdXNlck5hbWUgfSxcbiAgX2NyZWF0ZVRlbXBvcmFyeUFjY2VzcywgYXBwLCB1c2VyTmFtZSxcbik7XG5cbmV4cG9ydCBjb25zdCBfY3JlYXRlVGVtcG9yYXJ5QWNjZXNzID0gYXN5bmMgKGFwcCwgdXNlck5hbWUpID0+IHtcbiAgY29uc3QgdGVtcENvZGUgPSBhd2FpdCBnZXRUZW1wb3JhcnlDb2RlKGFwcCk7XG5cbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldExvY2soXG4gICAgYXBwLCBVU0VSU19MT0NLX0ZJTEUsIDEwMDAsIDIsXG4gICk7XG5cbiAgaWYgKGlzTm9sb2NrKGxvY2spKSB7IHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGNyZWF0ZSB0ZW1wb3JhcnkgYWNjZXNzLCBjb3VsZCBub3QgZ2V0IGxvY2sgLSB0cnkgYWdhaW4nKTsgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSk7XG5cbiAgICBjb25zdCB1c2VyID0gZ2V0VXNlckJ5TmFtZSh1c2VycywgdXNlck5hbWUpO1xuICAgIHVzZXIudGVtcG9yYXJ5QWNjZXNzSWQgPSB0ZW1wQ29kZS50ZW1wb3JhcnlBY2Nlc3NJZDtcblxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgICAgIFVTRVJTX0xJU1RfRklMRSxcbiAgICAgIHVzZXJzLFxuICAgICk7XG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcbiAgfVxuXG4gIGNvbnN0IHVzZXJBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICB1c2VyQXV0aEZpbGUodXNlck5hbWUpLFxuICApO1xuICB1c2VyQXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoID0gdGVtcENvZGUudGVtcG9yYXJ5QWNjZXNzSGFzaDtcblxuICB1c2VyQXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA9IHRlbXBDb2RlLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoO1xuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgICB1c2VyQXV0aEZpbGUodXNlck5hbWUpLFxuICAgIHVzZXJBdXRoLFxuICApO1xuXG4gIHJldHVybiB0ZW1wQ29kZS50ZW1wQ29kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRUZW1wb3JhcnlDb2RlID0gYXN5bmMgKGFwcCkgPT4ge1xuICBjb25zdCB0ZW1wQ29kZSA9IGdlbmVyYXRlKClcbiAgICAgICAgKyBnZW5lcmF0ZSgpXG4gICAgICAgICsgZ2VuZXJhdGUoKVxuICAgICAgICArIGdlbmVyYXRlKCk7XG5cbiAgY29uc3QgdGVtcElkID0gZ2VuZXJhdGUoKTtcblxuICByZXR1cm4ge1xuICAgIHRlbXBvcmFyeUFjY2Vzc0hhc2g6IGF3YWl0IGFwcC5jcnlwdG8uaGFzaChcbiAgICAgIHRlbXBDb2RlLFxuICAgICksXG4gICAgdGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2g6XG4gICAgICAgICAgICAoYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpKSArIHRlbXBDb2RlRXhwaXJ5TGVuZ3RoLFxuICAgIHRlbXBDb2RlOiBgdG1wOiR7dGVtcElkfToke3RlbXBDb2RlfWAsXG4gICAgdGVtcG9yYXJ5QWNjZXNzSWQ6IHRlbXBJZCxcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBsb29rc0xpa2VUZW1wb3JhcnlDb2RlID0gY29kZSA9PiBjb2RlLnN0YXJ0c1dpdGgoJ3RtcDonKTtcbiIsImltcG9ydCB7XG4gIG1hcCwgdW5pcVdpdGgsXG4gIGZsYXR0ZW4sIGZpbHRlcixcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGFwcGx5UnVsZVNldCwgbWFrZXJ1bGUgfSBmcm9tICcuLi9jb21tb24vdmFsaWRhdGlvbkNvbW1vbic7XG5pbXBvcnQge1xuICAkLCBpbnNlbnNpdGl2ZUVxdWFscywgYXBpV3JhcHBlciwgZXZlbnRzLFxuICBpc05vbkVtcHR5U3RyaW5nLCBhbGwsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmNvbnN0IHVzZXJSdWxlcyA9IGFsbFVzZXJzID0+IFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAndXNlcm5hbWUgbXVzdCBiZSBzZXQnLFxuICAgIHUgPT4gaXNOb25FbXB0eVN0cmluZyh1Lm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2FjY2Vzc0xldmVscycsICd1c2VyIG11c3QgaGF2ZSBhdCBsZWFzdCBvbmUgYWNjZXNzIGxldmVsJyxcbiAgICB1ID0+IHUuYWNjZXNzTGV2ZWxzLmxlbmd0aCA+IDApLFxuICBtYWtlcnVsZSgnbmFtZScsICd1c2VybmFtZSBtdXN0IGJlIHVuaXF1ZScsXG4gICAgdSA9PiBmaWx0ZXIodTIgPT4gaW5zZW5zaXRpdmVFcXVhbHModTIubmFtZSwgdS5uYW1lKSkoYWxsVXNlcnMpLmxlbmd0aCA9PT0gMSksXG4gIG1ha2VydWxlKCdhY2Nlc3NMZXZlbHMnLCAnYWNjZXNzIGxldmVscyBtdXN0IG9ubHkgY29udGFpbiBzdGluZ3MnLFxuICAgIHUgPT4gYWxsKGlzTm9uRW1wdHlTdHJpbmcpKHUuYWNjZXNzTGV2ZWxzKSksXG5dO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVVc2VyID0gKCkgPT4gKGFsbHVzZXJzLCB1c2VyKSA9PiBhcHBseVJ1bGVTZXQodXNlclJ1bGVzKGFsbHVzZXJzKSkodXNlcik7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVVzZXJzID0gYXBwID0+IGFsbFVzZXJzID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkudmFsaWRhdGVVc2VycyxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyBhbGxVc2VycyB9LFxuICBfdmFsaWRhdGVVc2VycywgYXBwLCBhbGxVc2Vycyxcbik7XG5cbmV4cG9ydCBjb25zdCBfdmFsaWRhdGVVc2VycyA9IChhcHAsIGFsbFVzZXJzKSA9PiAkKGFsbFVzZXJzLCBbXG4gIG1hcChsID0+IHZhbGlkYXRlVXNlcihhcHApKGFsbFVzZXJzLCBsKSksXG4gIGZsYXR0ZW4sXG4gIHVuaXFXaXRoKCh4LCB5KSA9PiB4LmZpZWxkID09PSB5LmZpZWxkXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB4Lml0ZW0gPT09IHkuaXRlbVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgeC5lcnJvciA9PT0geS5lcnJvciksXG5dKTtcbiIsImltcG9ydCB7IGFwaVdyYXBwZXJTeW5jLCBldmVudHMgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3VXNlciA9IGFwcCA9PiAoKSA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5nZXROZXdVc2VyLFxuICBwZXJtaXNzaW9uLmNyZWF0ZVVzZXIuaXNBdXRob3JpemVkLFxuICB7fSxcbiAgX2dldE5ld1VzZXIsIGFwcCxcbik7XG5cbmV4cG9ydCBjb25zdCBfZ2V0TmV3VXNlciA9ICgpID0+ICh7XG4gIG5hbWU6ICcnLFxuICBhY2Nlc3NMZXZlbHM6IFtdLFxuICBlbmFibGVkOiB0cnVlLFxuICB0ZW1wb3JhcnlBY2Nlc3NJZDogJycsXG59KTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld1VzZXJBdXRoID0gYXBwID0+ICgpID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmdldE5ld1VzZXJBdXRoLFxuICBwZXJtaXNzaW9uLmNyZWF0ZVVzZXIuaXNBdXRob3JpemVkLFxuICB7fSxcbiAgX2dldE5ld1VzZXJBdXRoLCBhcHAsXG4pO1xuXG5leHBvcnQgY29uc3QgX2dldE5ld1VzZXJBdXRoID0gKCkgPT4gKHtcbiAgcGFzc3dvcmRIYXNoOiAnJyxcbiAgdGVtcG9yYXJ5QWNjZXNzSGFzaDogJycsXG4gIHRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoOiAwLFxufSk7XG4iLCJpbXBvcnQgeyBmaW5kIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHVzZXJBdXRoRmlsZSwgcGFyc2VUZW1wb3JhcnlDb2RlIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7XG4gIGlzU29tZXRoaW5nLCAkLCBhcGlXcmFwcGVyLCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgX2dldFVzZXJzIH0gZnJvbSAnLi9nZXRVc2Vycyc7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBpc1ZhbGlkUGFzc3dvcmQgPSBhcHAgPT4gcGFzc3dvcmQgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuaXNWYWxpZFBhc3N3b3JkLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHBhc3N3b3JkIH0sXG4gIF9pc1ZhbGlkUGFzc3dvcmQsIGFwcCwgcGFzc3dvcmQsXG4pO1xuXG5leHBvcnQgY29uc3QgX2lzVmFsaWRQYXNzd29yZCA9IChhcHAsIHBhc3N3b3JkKSA9PiBzY29yZVBhc3N3b3JkKHBhc3N3b3JkKS5zY29yZSA+IDMwO1xuXG5leHBvcnQgY29uc3QgY2hhbmdlTXlQYXNzd29yZCA9IGFwcCA9PiBhc3luYyAoY3VycmVudFB3LCBuZXdwYXNzd29yZCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5jaGFuZ2VNeVBhc3N3b3JkLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IGN1cnJlbnRQdywgbmV3cGFzc3dvcmQgfSxcbiAgX2NoYW5nZU15UGFzc3dvcmQsIGFwcCwgY3VycmVudFB3LCBuZXdwYXNzd29yZCxcbik7XG5cbmV4cG9ydCBjb25zdCBfY2hhbmdlTXlQYXNzd29yZCA9IGFzeW5jIChhcHAsIGN1cnJlbnRQdywgbmV3cGFzc3dvcmQpID0+IHtcbiAgY29uc3QgZXhpc3RpbmdBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICB1c2VyQXV0aEZpbGUoYXBwLnVzZXIubmFtZSksXG4gICk7XG5cbiAgaWYgKGlzU29tZXRoaW5nKGV4aXN0aW5nQXV0aC5wYXNzd29yZEhhc2gpKSB7XG4gICAgY29uc3QgdmVyaWZpZWQgPSBhd2FpdCBhcHAuY3J5cHRvLnZlcmlmeShcbiAgICAgIGV4aXN0aW5nQXV0aC5wYXNzd29yZEhhc2gsXG4gICAgICBjdXJyZW50UHcsXG4gICAgKTtcblxuICAgIGlmICh2ZXJpZmllZCkge1xuICAgICAgYXdhaXQgYXdhaXQgZG9TZXQoXG4gICAgICAgIGFwcCwgZXhpc3RpbmdBdXRoLFxuICAgICAgICBhcHAudXNlci5uYW1lLCBuZXdwYXNzd29yZCxcbiAgICAgICk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3Qgc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZSA9IGFwcCA9PiBhc3luYyAodGVtcENvZGUsIG5ld3Bhc3N3b3JkKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLnNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgdGVtcENvZGUsIG5ld3Bhc3N3b3JkIH0sXG4gIF9zZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlLCBhcHAsIHRlbXBDb2RlLCBuZXdwYXNzd29yZCxcbik7XG5cblxuZXhwb3J0IGNvbnN0IF9zZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlID0gYXN5bmMgKGFwcCwgdGVtcENvZGUsIG5ld3Bhc3N3b3JkKSA9PiB7XG4gIGNvbnN0IGN1cnJlbnRUaW1lID0gYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpO1xuXG4gIGNvbnN0IHRlbXAgPSBwYXJzZVRlbXBvcmFyeUNvZGUodGVtcENvZGUpO1xuXG4gIGNvbnN0IHVzZXIgPSAkKGF3YWl0IF9nZXRVc2VycyhhcHApLCBbXG4gICAgZmluZCh1ID0+IHUudGVtcG9yYXJ5QWNjZXNzSWQgPT09IHRlbXAuaWQpLFxuICBdKTtcblxuICBpZiAoIXVzZXIpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgY29uc3QgZXhpc3RpbmdBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICB1c2VyQXV0aEZpbGUodXNlci5uYW1lKSxcbiAgKTtcblxuICBpZiAoaXNTb21ldGhpbmcoZXhpc3RpbmdBdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2gpXG4gICAgICAgJiYgZXhpc3RpbmdBdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID4gY3VycmVudFRpbWUpIHtcbiAgICBjb25zdCB2ZXJpZmllZCA9IGF3YWl0IGFwcC5jcnlwdG8udmVyaWZ5KFxuICAgICAgZXhpc3RpbmdBdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2gsXG4gICAgICB0ZW1wLmNvZGUsXG4gICAgKTtcblxuICAgIGlmICh2ZXJpZmllZCkge1xuICAgICAgYXdhaXQgZG9TZXQoXG4gICAgICAgIGFwcCwgZXhpc3RpbmdBdXRoLFxuICAgICAgICB1c2VyLm5hbWUsIG5ld3Bhc3N3b3JkLFxuICAgICAgKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IGRvU2V0ID0gYXN5bmMgKGFwcCwgYXV0aCwgdXNlcm5hbWUsIG5ld3Bhc3N3b3JkKSA9PiB7XG4gIGF1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaCA9ICcnO1xuICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID0gMDtcbiAgYXV0aC5wYXNzd29yZEhhc2ggPSBhd2FpdCBhcHAuY3J5cHRvLmhhc2goXG4gICAgbmV3cGFzc3dvcmQsXG4gICk7XG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgICB1c2VyQXV0aEZpbGUodXNlcm5hbWUpLFxuICAgIGF1dGgsXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2NvcmVQYXNzd29yZCA9IGFwcCA9PiBwYXNzd29yZCA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5zY29yZVBhc3N3b3JkLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHBhc3N3b3JkIH0sXG4gIF9zY29yZVBhc3N3b3JkLCBwYXNzd29yZCxcbik7XG5cbmV4cG9ydCBjb25zdCBfc2NvcmVQYXNzd29yZCA9IChwYXNzd29yZCkgPT4ge1xuICAvLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzk0ODE3Mi9wYXNzd29yZC1zdHJlbmd0aC1tZXRlclxuICAvLyB0aGFuayB5b3UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS91c2Vycy80NjYxNy90bS1sdlxuXG4gIGxldCBzY29yZSA9IDA7XG4gIGlmICghcGFzc3dvcmQpIHsgcmV0dXJuIHNjb3JlOyB9XG5cbiAgLy8gYXdhcmQgZXZlcnkgdW5pcXVlIGxldHRlciB1bnRpbCA1IHJlcGV0aXRpb25zXG4gIGNvbnN0IGxldHRlcnMgPSBuZXcgT2JqZWN0KCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGFzc3dvcmQubGVuZ3RoOyBpKyspIHtcbiAgICBsZXR0ZXJzW3Bhc3N3b3JkW2ldXSA9IChsZXR0ZXJzW3Bhc3N3b3JkW2ldXSB8fCAwKSArIDE7XG4gICAgc2NvcmUgKz0gNS4wIC8gbGV0dGVyc1twYXNzd29yZFtpXV07XG4gIH1cblxuICAvLyBib251cyBwb2ludHMgZm9yIG1peGluZyBpdCB1cFxuICBjb25zdCB2YXJpYXRpb25zID0ge1xuICAgIGRpZ2l0czogL1xcZC8udGVzdChwYXNzd29yZCksXG4gICAgbG93ZXI6IC9bYS16XS8udGVzdChwYXNzd29yZCksXG4gICAgdXBwZXI6IC9bQS1aXS8udGVzdChwYXNzd29yZCksXG4gICAgbm9uV29yZHM6IC9cXFcvLnRlc3QocGFzc3dvcmQpLFxuICB9O1xuXG4gIGxldCB2YXJpYXRpb25Db3VudCA9IDA7XG4gIGZvciAoY29uc3QgY2hlY2sgaW4gdmFyaWF0aW9ucykge1xuICAgIHZhcmlhdGlvbkNvdW50ICs9ICh2YXJpYXRpb25zW2NoZWNrXSA9PSB0cnVlKSA/IDEgOiAwO1xuICB9XG4gIHNjb3JlICs9ICh2YXJpYXRpb25Db3VudCAtIDEpICogMTA7XG5cbiAgY29uc3Qgc3RyZW5ndGhUZXh0ID0gc2NvcmUgPiA4MFxuICAgID8gJ3N0cm9uZydcbiAgICA6IHNjb3JlID4gNjBcbiAgICAgID8gJ2dvb2QnXG4gICAgICA6IHNjb3JlID49IDMwXG4gICAgICAgID8gJ3dlYWsnXG4gICAgICAgIDogJ3Zlcnkgd2Vhayc7XG5cbiAgcmV0dXJuIHtcbiAgICBzY29yZTogcGFyc2VJbnQoc2NvcmUpLFxuICAgIHN0cmVuZ3RoVGV4dCxcbiAgfTtcbn07XG4iLCJpbXBvcnQgeyBqb2luLCBzb21lIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHZhbGlkYXRlVXNlciB9IGZyb20gJy4vdmFsaWRhdGVVc2VyJztcbmltcG9ydCB7IGdldE5ld1VzZXJBdXRoIH0gZnJvbSAnLi9nZXROZXdVc2VyJztcbmltcG9ydCB7XG4gIGdldExvY2ssIGlzTm9sb2NrLCByZWxlYXNlTG9jaywgYXBpV3JhcHBlciwgZXZlbnRzLFxuICBpbnNlbnNpdGl2ZUVxdWFscywgaXNOb25FbXB0eVN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIFVTRVJTX0xPQ0tfRklMRSwgc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZixcbiAgVVNFUlNfTElTVF9GSUxFLCB1c2VyQXV0aEZpbGUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyBnZXRUZW1wb3JhcnlDb2RlIH0gZnJvbSAnLi9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MnO1xuaW1wb3J0IHsgaXNWYWxpZFBhc3N3b3JkIH0gZnJvbSAnLi9zZXRQYXNzd29yZCc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVVzZXIgPSBhcHAgPT4gYXN5bmMgKHVzZXIsIHBhc3N3b3JkID0gbnVsbCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5jcmVhdGVVc2VyLFxuICBwZXJtaXNzaW9uLmNyZWF0ZVVzZXIuaXNBdXRob3JpemVkLFxuICB7IHVzZXIsIHBhc3N3b3JkIH0sXG4gIF9jcmVhdGVVc2VyLCBhcHAsIHVzZXIsIHBhc3N3b3JkLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9jcmVhdGVVc2VyID0gYXN5bmMgKGFwcCwgdXNlciwgcGFzc3dvcmQgPSBudWxsKSA9PiB7XG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRMb2NrKFxuICAgIGFwcCwgVVNFUlNfTE9DS19GSUxFLCAxMDAwLCAyLFxuICApO1xuXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBjcmVhdGUgdXNlciwgY291bGQgbm90IGdldCBsb2NrIC0gdHJ5IGFnYWluJyk7IH1cblxuICBjb25zdCB1c2VycyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oVVNFUlNfTElTVF9GSUxFKTtcblxuICBjb25zdCB1c2VyRXJyb3JzID0gdmFsaWRhdGVVc2VyKGFwcCkoWy4uLnVzZXJzLCB1c2VyXSwgdXNlcik7XG4gIGlmICh1c2VyRXJyb3JzLmxlbmd0aCA+IDApIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgVXNlciBpcyBpbnZhbGlkLiAke2pvaW4oJzsgJykodXNlckVycm9ycyl9YCk7IH1cblxuICBjb25zdCB7IGF1dGgsIHRlbXBDb2RlLCB0ZW1wb3JhcnlBY2Nlc3NJZCB9ID0gYXdhaXQgZ2V0QWNjZXNzKFxuICAgIGFwcCwgcGFzc3dvcmQsXG4gICk7XG4gIHVzZXIudGVtcENvZGUgPSB0ZW1wQ29kZTtcbiAgdXNlci50ZW1wb3JhcnlBY2Nlc3NJZCA9IHRlbXBvcmFyeUFjY2Vzc0lkO1xuXG4gIGlmIChzb21lKHUgPT4gaW5zZW5zaXRpdmVFcXVhbHModS5uYW1lLCB1c2VyLm5hbWUpKSh1c2VycykpIHsgXG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignVXNlciBhbHJlYWR5IGV4aXN0cycpOyBcbiAgfVxuXG4gIHVzZXJzLnB1c2goXG4gICAgc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZih1c2VyKSxcbiAgKTtcblxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgVVNFUlNfTElTVF9GSUxFLFxuICAgIHVzZXJzLFxuICApO1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVKc29uKFxuICAgICAgdXNlckF1dGhGaWxlKHVzZXIubmFtZSksXG4gICAgICBhdXRoLFxuICAgICk7XG4gIH0gY2F0Y2ggKF8pIHtcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgICB1c2VyQXV0aEZpbGUodXNlci5uYW1lKSxcbiAgICAgIGF1dGgsXG4gICAgKTtcbiAgfVxuXG4gIGF3YWl0IHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XG5cbiAgcmV0dXJuIHVzZXI7XG59O1xuXG5jb25zdCBnZXRBY2Nlc3MgPSBhc3luYyAoYXBwLCBwYXNzd29yZCkgPT4ge1xuICBjb25zdCBhdXRoID0gZ2V0TmV3VXNlckF1dGgoYXBwKSgpO1xuXG4gIGlmIChpc05vbkVtcHR5U3RyaW5nKHBhc3N3b3JkKSkge1xuICAgIGlmIChpc1ZhbGlkUGFzc3dvcmQocGFzc3dvcmQpKSB7XG4gICAgICBhdXRoLnBhc3N3b3JkSGFzaCA9IGF3YWl0IGFwcC5jcnlwdG8uaGFzaChwYXNzd29yZCk7XG4gICAgICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2ggPSAnJztcbiAgICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzSWQgPSAnJztcbiAgICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPSAwO1xuICAgICAgcmV0dXJuIHsgYXV0aCB9O1xuICAgIH1cbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdQYXNzd29yZCBkb2VzIG5vdCBtZWV0IHJlcXVpcmVtZW50cycpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHRlbXBBY2Nlc3MgPSBhd2FpdCBnZXRUZW1wb3JhcnlDb2RlKGFwcCk7XG4gICAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoID0gdGVtcEFjY2Vzcy50ZW1wb3JhcnlBY2Nlc3NIYXNoO1xuICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPSB0ZW1wQWNjZXNzLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoO1xuICAgIGF1dGgucGFzc3dvcmRIYXNoID0gJyc7XG4gICAgcmV0dXJuICh7XG4gICAgICBhdXRoLFxuICAgICAgdGVtcENvZGU6IHRlbXBBY2Nlc3MudGVtcENvZGUsXG4gICAgICB0ZW1wb3JhcnlBY2Nlc3NJZDogdGVtcEFjY2Vzcy50ZW1wb3JhcnlBY2Nlc3NJZCxcbiAgICB9KTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIGdldExvY2ssXG4gIGlzTm9sb2NrLCByZWxlYXNlTG9jayxcbn0gZnJvbSAnLi4vY29tbW9uL2xvY2snO1xuaW1wb3J0IHsgVVNFUlNfTE9DS19GSUxFLCBVU0VSU19MSVNUX0ZJTEUsIGdldFVzZXJCeU5hbWUgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgYXBpV3JhcHBlciwgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGVuYWJsZVVzZXIgPSBhcHAgPT4gYXN5bmMgdXNlcm5hbWUgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5lbmFibGVVc2VyLFxuICBwZXJtaXNzaW9uLmVuYWJsZURpc2FibGVVc2VyLmlzQXV0aG9yaXplZCxcbiAgeyB1c2VybmFtZSB9LFxuICBfZW5hYmxlVXNlciwgYXBwLCB1c2VybmFtZSxcbik7XG5cbmV4cG9ydCBjb25zdCBkaXNhYmxlVXNlciA9IGFwcCA9PiBhc3luYyB1c2VybmFtZSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmRpc2FibGVVc2VyLFxuICBwZXJtaXNzaW9uLmVuYWJsZURpc2FibGVVc2VyLmlzQXV0aG9yaXplZCxcbiAgeyB1c2VybmFtZSB9LFxuICBfZGlzYWJsZVVzZXIsIGFwcCwgdXNlcm5hbWUsXG4pO1xuXG5leHBvcnQgY29uc3QgX2VuYWJsZVVzZXIgPSBhc3luYyAoYXBwLCB1c2VybmFtZSkgPT4gYXdhaXQgdG9nZ2xlVXNlcihhcHAsIHVzZXJuYW1lLCB0cnVlKTtcblxuZXhwb3J0IGNvbnN0IF9kaXNhYmxlVXNlciA9IGFzeW5jIChhcHAsIHVzZXJuYW1lKSA9PiBhd2FpdCB0b2dnbGVVc2VyKGFwcCwgdXNlcm5hbWUsIGZhbHNlKTtcblxuY29uc3QgdG9nZ2xlVXNlciA9IGFzeW5jIChhcHAsIHVzZXJuYW1lLCBlbmFibGVkKSA9PiB7XG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRMb2NrKGFwcCwgVVNFUlNfTE9DS19GSUxFLCAxMDAwLCAxLCAwKTtcblxuICBjb25zdCBhY3Rpb25OYW1lID0gZW5hYmxlZCA/ICdlbmFibGUnIDogJ2Rpc2FibGUnO1xuXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCAke2FjdGlvbk5hbWV9IHVzZXIgLSBjYW5ub3QgZ2V0IGxvY2tgKTsgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSk7XG4gICAgY29uc3QgdXNlciA9IGdldFVzZXJCeU5hbWUodXNlcnMsIHVzZXJuYW1lKTtcbiAgICBpZiAoIXVzZXIpIHsgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoYENvdWxkIG5vdCBmaW5kIHVzZXIgdG8gJHthY3Rpb25OYW1lfWApOyB9XG5cbiAgICBpZiAodXNlci5lbmFibGVkID09PSAhZW5hYmxlZCkge1xuICAgICAgdXNlci5lbmFibGVkID0gZW5hYmxlZDtcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihVU0VSU19MSVNUX0ZJTEUsIHVzZXJzKTtcbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcbiAgfVxufTtcbiIsImV4cG9ydCBjb25zdCBnZXROZXdBY2Nlc3NMZXZlbCA9ICgpID0+ICgpID0+ICh7XG4gIG5hbWU6ICcnLFxuICBwZXJtaXNzaW9uczogW10sXG4gIGRlZmF1bHQ6ZmFsc2Vcbn0pO1xuIiwiaW1wb3J0IHtcbiAgdmFsdWVzLCBpbmNsdWRlcywgbWFwLCBjb25jYXQsIGlzRW1wdHksIHVuaXFXaXRoLCBzb21lLFxuICBmbGF0dGVuLCBmaWx0ZXIsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvblR5cGVzIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7XG4gICQsIGlzU29tZXRoaW5nLCBpbnNlbnNpdGl2ZUVxdWFscyxcbiAgaXNOb25FbXB0eVN0cmluZywgYXBpV3JhcHBlclN5bmMsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldE5vZGUgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5jb25zdCBpc0FsbG93ZWRUeXBlID0gdCA9PiAkKHBlcm1pc3Npb25UeXBlcywgW1xuICB2YWx1ZXMsXG4gIGluY2x1ZGVzKHQpLFxuXSk7XG5cbmNvbnN0IGlzUmVjb3JkT3JJbmRleFR5cGUgPSB0ID0+IHNvbWUocCA9PiBwID09PSB0KShbXG4gIHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfUkVDT1JELFxuICBwZXJtaXNzaW9uVHlwZXMuVVBEQVRFX1JFQ09SRCxcbiAgcGVybWlzc2lvblR5cGVzLkRFTEVURV9SRUNPUkQsXG4gIHBlcm1pc3Npb25UeXBlcy5SRUFEX1JFQ09SRCxcbiAgcGVybWlzc2lvblR5cGVzLlJFQURfSU5ERVgsXG4gIHBlcm1pc3Npb25UeXBlcy5FWEVDVVRFX0FDVElPTixcbl0pO1xuXG5cbmNvbnN0IHBlcm1pc3Npb25SdWxlcyA9IGFwcCA9PiAoW1xuICBtYWtlcnVsZSgndHlwZScsICd0eXBlIG11c3QgYmUgb25lIG9mIGFsbG93ZWQgdHlwZXMnLFxuICAgIHAgPT4gaXNBbGxvd2VkVHlwZShwLnR5cGUpKSxcbiAgbWFrZXJ1bGUoJ25vZGVLZXknLCAncmVjb3JkIGFuZCBpbmRleCBwZXJtaXNzaW9ucyBtdXN0IGluY2x1ZGUgYSB2YWxpZCBub2RlS2V5JyxcbiAgICBwID0+ICghaXNSZWNvcmRPckluZGV4VHlwZShwLnR5cGUpKVxuICAgICAgICAgICAgIHx8IGlzU29tZXRoaW5nKGdldE5vZGUoYXBwLmhpZXJhcmNoeSwgcC5ub2RlS2V5KSkpLFxuXSk7XG5cbmNvbnN0IGFwcGx5UGVybWlzc2lvblJ1bGVzID0gYXBwID0+IGFwcGx5UnVsZVNldChwZXJtaXNzaW9uUnVsZXMoYXBwKSk7XG5cbmNvbnN0IGFjY2Vzc0xldmVsUnVsZXMgPSBhbGxMZXZlbHMgPT4gKFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnbmFtZSBtdXN0IGJlIHNldCcsXG4gICAgbCA9PiBpc05vbkVtcHR5U3RyaW5nKGwubmFtZSkpLFxuICBtYWtlcnVsZSgnbmFtZScsICdhY2Nlc3MgbGV2ZWwgbmFtZXMgbXVzdCBiZSB1bmlxdWUnLFxuICAgIGwgPT4gaXNFbXB0eShsLm5hbWUpXG4gICAgICAgICAgICAgfHwgZmlsdGVyKGEgPT4gaW5zZW5zaXRpdmVFcXVhbHMobC5uYW1lLCBhLm5hbWUpKShhbGxMZXZlbHMpLmxlbmd0aCA9PT0gMSksXG5dKTtcblxuY29uc3QgYXBwbHlMZXZlbFJ1bGVzID0gYWxsTGV2ZWxzID0+IGFwcGx5UnVsZVNldChhY2Nlc3NMZXZlbFJ1bGVzKGFsbExldmVscykpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBY2Nlc3NMZXZlbCA9IGFwcCA9PiAoYWxsTGV2ZWxzLCBsZXZlbCkgPT4ge1xuICBjb25zdCBlcnJzID0gJChsZXZlbC5wZXJtaXNzaW9ucywgW1xuICAgIG1hcChhcHBseVBlcm1pc3Npb25SdWxlcyhhcHApKSxcbiAgICBmbGF0dGVuLFxuICAgIGNvbmNhdChcbiAgICAgIGFwcGx5TGV2ZWxSdWxlcyhhbGxMZXZlbHMpKGxldmVsKSxcbiAgICApLFxuICBdKTtcblxuICByZXR1cm4gZXJycztcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFjY2Vzc0xldmVscyA9IGFwcCA9PiBhbGxMZXZlbHMgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkudmFsaWRhdGVBY2Nlc3NMZXZlbHMsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgYWxsTGV2ZWxzIH0sXG4gIF92YWxpZGF0ZUFjY2Vzc0xldmVscywgYXBwLCBhbGxMZXZlbHMsXG4pO1xuXG5leHBvcnQgY29uc3QgX3ZhbGlkYXRlQWNjZXNzTGV2ZWxzID0gKGFwcCwgYWxsTGV2ZWxzKSA9PiAkKGFsbExldmVscywgW1xuICBtYXAobCA9PiB2YWxpZGF0ZUFjY2Vzc0xldmVsKGFwcCkoYWxsTGV2ZWxzLCBsKSksXG4gIGZsYXR0ZW4sXG4gIHVuaXFXaXRoKCh4LCB5KSA9PiB4LmZpZWxkID09PSB5LmZpZWxkXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB4Lml0ZW0gPT09IHkuaXRlbVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgeC5lcnJvciA9PT0geS5lcnJvciksXG5dKTtcbiIsImltcG9ydCB7IGpvaW4sIG1hcCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRMb2NrLCByZWxlYXNlTG9jaywgJCxcbiAgaXNOb2xvY2ssIGFwaVdyYXBwZXIsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIEFDQ0VTU19MRVZFTFNfTE9DS19GSUxFLFxuICBBQ0NFU1NfTEVWRUxTX0ZJTEUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyB2YWxpZGF0ZUFjY2Vzc0xldmVscyB9IGZyb20gJy4vdmFsaWRhdGVBY2Nlc3NMZXZlbHMnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3Qgc2F2ZUFjY2Vzc0xldmVscyA9IGFwcCA9PiBhc3luYyBhY2Nlc3NMZXZlbHMgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5zYXZlQWNjZXNzTGV2ZWxzLFxuICBwZXJtaXNzaW9uLndyaXRlQWNjZXNzTGV2ZWxzLmlzQXV0aG9yaXplZCxcbiAgeyBhY2Nlc3NMZXZlbHMgfSxcbiAgX3NhdmVBY2Nlc3NMZXZlbHMsIGFwcCwgYWNjZXNzTGV2ZWxzLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9zYXZlQWNjZXNzTGV2ZWxzID0gYXN5bmMgKGFwcCwgYWNjZXNzTGV2ZWxzKSA9PiB7XG4gIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0ZUFjY2Vzc0xldmVscyhhcHApKGFjY2Vzc0xldmVscy5sZXZlbHMpO1xuICBpZiAodmFsaWRhdGlvbkVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgZXJycyA9ICQodmFsaWRhdGlvbkVycm9ycywgW1xuICAgICAgbWFwKGUgPT4gZS5lcnJvciksXG4gICAgICBqb2luKCcsICcpLFxuICAgIF0pO1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBBY2Nlc3MgTGV2ZWxzIEludmFsaWQ6ICR7ZXJyc31gLFxuICAgICk7XG4gIH1cblxuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhcbiAgICBhcHAsIEFDQ0VTU19MRVZFTFNfTE9DS19GSUxFLCAyMDAwLCAyLFxuICApO1xuXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBnZXQgbG9jayB0byBzYXZlIGFjY2VzcyBsZXZlbHMnKTsgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKEFDQ0VTU19MRVZFTFNfRklMRSk7XG4gICAgaWYgKGV4aXN0aW5nLnZlcnNpb24gIT09IGFjY2Vzc0xldmVscy52ZXJzaW9uKSB7IHRocm93IG5ldyBFcnJvcignQWNjZXNzIGxldmVscyBoYXZlIGFscmVhZHkgYmVlbiB1cGRhdGVkLCBzaW5jZSB5b3UgbG9hZGVkJyk7IH1cblxuICAgIGFjY2Vzc0xldmVscy52ZXJzaW9uKys7XG5cbiAgICBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oQUNDRVNTX0xFVkVMU19GSUxFLCBhY2Nlc3NMZXZlbHMpO1xuICB9IGZpbmFsbHkge1xuICAgIGF3YWl0IHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBmaWx0ZXIsIHZhbHVlcywgZWFjaCwga2V5cyxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcbmltcG9ydCB7XG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgaXNJbmRleCwgaXNSZWNvcmQsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zID0gKGFwcCkgPT4ge1xuICBjb25zdCBhbGxOb2RlcyA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShhcHAuaGllcmFyY2h5KTtcbiAgY29uc3QgYWNjZXNzTGV2ZWwgPSB7IHBlcm1pc3Npb25zOiBbXSB9O1xuXG4gIGNvbnN0IHJlY29yZE5vZGVzID0gJChhbGxOb2RlcywgW1xuICAgIGZpbHRlcihpc1JlY29yZCksXG4gIF0pO1xuXG4gIGZvciAoY29uc3QgbiBvZiByZWNvcmROb2Rlcykge1xuICAgIHBlcm1pc3Npb24uY3JlYXRlUmVjb3JkLmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xuICAgIHBlcm1pc3Npb24udXBkYXRlUmVjb3JkLmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xuICAgIHBlcm1pc3Npb24uZGVsZXRlUmVjb3JkLmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xuICAgIHBlcm1pc3Npb24ucmVhZFJlY29yZC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcbiAgfVxuXG4gIGNvbnN0IGluZGV4Tm9kZXMgPSAkKGFsbE5vZGVzLCBbXG4gICAgZmlsdGVyKGlzSW5kZXgpLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IG4gb2YgaW5kZXhOb2Rlcykge1xuICAgIHBlcm1pc3Npb24ucmVhZEluZGV4LmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xuICB9XG5cbiAgZm9yIChjb25zdCBhIG9mIGtleXMoYXBwLmFjdGlvbnMpKSB7XG4gICAgcGVybWlzc2lvbi5leGVjdXRlQWN0aW9uLmFkZChhLCBhY2Nlc3NMZXZlbCk7XG4gIH1cblxuICAkKHBlcm1pc3Npb24sIFtcbiAgICB2YWx1ZXMsXG4gICAgZmlsdGVyKHAgPT4gIXAuaXNOb2RlKSxcbiAgICBlYWNoKHAgPT4gcC5hZGQoYWNjZXNzTGV2ZWwpKSxcbiAgXSk7XG5cbiAgcmV0dXJuIGFjY2Vzc0xldmVsLnBlcm1pc3Npb25zO1xufTtcbiIsImltcG9ydCB7IGRpZmZlcmVuY2UsIG1hcCwgam9pbiB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRMb2NrLCBpc05vbG9jaywgcmVsZWFzZUxvY2ssICQsXG4gIGFwaVdyYXBwZXIsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIFVTRVJTX0xPQ0tfRklMRSwgQUNDRVNTX0xFVkVMU19GSUxFLFxuICBnZXRVc2VyQnlOYW1lLCBVU0VSU19MSVNUX0ZJTEUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBzZXRVc2VyQWNjZXNzTGV2ZWxzID0gYXBwID0+IGFzeW5jICh1c2VyTmFtZSwgYWNjZXNzTGV2ZWxzKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLnNldFVzZXJBY2Nlc3NMZXZlbHMsXG4gIHBlcm1pc3Npb24uc2V0VXNlckFjY2Vzc0xldmVscy5pc0F1dGhvcml6ZWQsXG4gIHsgdXNlck5hbWUsIGFjY2Vzc0xldmVscyB9LFxuICBfc2V0VXNlckFjY2Vzc0xldmVscywgYXBwLCB1c2VyTmFtZSwgYWNjZXNzTGV2ZWxzLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9zZXRVc2VyQWNjZXNzTGV2ZWxzID0gYXN5bmMgKGFwcCwgdXNlcm5hbWUsIGFjY2Vzc0xldmVscykgPT4ge1xuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhhcHAsIFVTRVJTX0xPQ0tfRklMRSwgMTAwMCwgMSwgMCk7XG5cbiAgY29uc3QgYWN0dWFsQWNjZXNzTGV2ZWxzID0gJChcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKEFDQ0VTU19MRVZFTFNfRklMRSksXG4gICAgW1xuICAgICAgbCA9PiBsLmxldmVscyxcbiAgICAgIG1hcChsID0+IGwubmFtZSksXG4gICAgXSxcbiAgKTtcblxuICBjb25zdCBtaXNzaW5nID0gZGlmZmVyZW5jZShhY2Nlc3NMZXZlbHMpKGFjdHVhbEFjY2Vzc0xldmVscyk7XG4gIGlmIChtaXNzaW5nLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgYWNjZXNzIGxldmVscyBzdXBwbGllZDogJHtqb2luKCcsICcsIG1pc3NpbmcpfWApO1xuICB9XG5cbiAgaWYgKGlzTm9sb2NrKGxvY2spKSB7IHRocm93IG5ldyBFcnJvcignQ291bGQgc2V0IHVzZXIgYWNjZXNzIGxldmVscyBjYW5ub3QgZ2V0IGxvY2snKTsgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSk7XG4gICAgY29uc3QgdXNlciA9IGdldFVzZXJCeU5hbWUodXNlcnMsIHVzZXJuYW1lKTtcbiAgICBpZiAoIXVzZXIpIHsgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoYENvdWxkIG5vdCBmaW5kIHVzZXIgd2l0aCAke3VzZXJuYW1lfWApOyB9XG5cbiAgICB1c2VyLmFjY2Vzc0xldmVscyA9IGFjY2Vzc0xldmVscztcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oVVNFUlNfTElTVF9GSUxFLCB1c2Vycyk7XG4gIH0gZmluYWxseSB7XG4gICAgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIGF1dGhlbnRpY2F0ZSxcbiAgYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzLFxufSBmcm9tICcuL2F1dGhlbnRpY2F0ZSc7XG5pbXBvcnQgeyBjcmVhdGVUZW1wb3JhcnlBY2Nlc3MgfSBmcm9tICcuL2NyZWF0ZVRlbXBvcmFyeUFjY2Vzcyc7XG5pbXBvcnQgeyBjcmVhdGVVc2VyIH0gZnJvbSAnLi9jcmVhdGVVc2VyJztcbmltcG9ydCB7IGVuYWJsZVVzZXIsIGRpc2FibGVVc2VyIH0gZnJvbSAnLi9lbmFibGVVc2VyJztcbmltcG9ydCB7IGxvYWRBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL2xvYWRBY2Nlc3NMZXZlbHMnO1xuaW1wb3J0IHsgZ2V0TmV3QWNjZXNzTGV2ZWwgfSBmcm9tICcuL2dldE5ld0FjY2Vzc0xldmVsJztcbmltcG9ydCB7IGdldE5ld1VzZXIsIGdldE5ld1VzZXJBdXRoIH0gZnJvbSAnLi9nZXROZXdVc2VyJztcbmltcG9ydCB7IGdldFVzZXJzIH0gZnJvbSAnLi9nZXRVc2Vycyc7XG5pbXBvcnQgeyBpc0F1dGhvcml6ZWQgfSBmcm9tICcuL2lzQXV0aG9yaXplZCc7XG5pbXBvcnQgeyBzYXZlQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi9zYXZlQWNjZXNzTGV2ZWxzJztcbmltcG9ydCB7XG4gIGNoYW5nZU15UGFzc3dvcmQsXG4gIHNjb3JlUGFzc3dvcmQsIHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUsXG4gIGlzVmFsaWRQYXNzd29yZCxcbn0gZnJvbSAnLi9zZXRQYXNzd29yZCc7XG5pbXBvcnQgeyB2YWxpZGF0ZVVzZXIgfSBmcm9tICcuL3ZhbGlkYXRlVXNlcic7XG5pbXBvcnQgeyB2YWxpZGF0ZUFjY2Vzc0xldmVscyB9IGZyb20gJy4vdmFsaWRhdGVBY2Nlc3NMZXZlbHMnO1xuaW1wb3J0IHsgZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMgfSBmcm9tICcuL2dlbmVyYXRlRnVsbFBlcm1pc3Npb25zJztcbmltcG9ydCB7IHNldFVzZXJBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL3NldFVzZXJBY2Nlc3NMZXZlbHMnO1xuXG5leHBvcnQgY29uc3QgZ2V0QXV0aEFwaSA9IGFwcCA9PiAoe1xuICBhdXRoZW50aWNhdGU6IGF1dGhlbnRpY2F0ZShhcHApLFxuICBhdXRoZW50aWNhdGVUZW1wb3JhcnlBY2Nlc3M6IGF1dGhlbnRpY2F0ZVRlbXBvcmFyeUFjY2VzcyhhcHApLFxuICBjcmVhdGVUZW1wb3JhcnlBY2Nlc3M6IGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyhhcHApLFxuICBjcmVhdGVVc2VyOiBjcmVhdGVVc2VyKGFwcCksXG4gIGxvYWRBY2Nlc3NMZXZlbHM6IGxvYWRBY2Nlc3NMZXZlbHMoYXBwKSxcbiAgZW5hYmxlVXNlcjogZW5hYmxlVXNlcihhcHApLFxuICBkaXNhYmxlVXNlcjogZGlzYWJsZVVzZXIoYXBwKSxcbiAgZ2V0TmV3QWNjZXNzTGV2ZWw6IGdldE5ld0FjY2Vzc0xldmVsKGFwcCksXG4gIGdldE5ld1VzZXI6IGdldE5ld1VzZXIoYXBwKSxcbiAgZ2V0TmV3VXNlckF1dGg6IGdldE5ld1VzZXJBdXRoKGFwcCksXG4gIGdldFVzZXJzOiBnZXRVc2VycyhhcHApLFxuICBzYXZlQWNjZXNzTGV2ZWxzOiBzYXZlQWNjZXNzTGV2ZWxzKGFwcCksXG4gIGlzQXV0aG9yaXplZDogaXNBdXRob3JpemVkKGFwcCksXG4gIGNoYW5nZU15UGFzc3dvcmQ6IGNoYW5nZU15UGFzc3dvcmQoYXBwKSxcbiAgc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZTogc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZShhcHApLFxuICBzY29yZVBhc3N3b3JkLFxuICBpc1ZhbGlkUGFzc3dvcmQ6IGlzVmFsaWRQYXNzd29yZChhcHApLFxuICB2YWxpZGF0ZVVzZXI6IHZhbGlkYXRlVXNlcihhcHApLFxuICB2YWxpZGF0ZUFjY2Vzc0xldmVsczogdmFsaWRhdGVBY2Nlc3NMZXZlbHMoYXBwKSxcbiAgZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnM6ICgpID0+IGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zKGFwcCksXG4gIHNldFVzZXJBY2Nlc3NMZXZlbHM6IHNldFVzZXJBY2Nlc3NMZXZlbHMoYXBwKSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRBdXRoQXBpO1xuIiwiaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgYXBpV3JhcHBlclN5bmMgfSBmcm9tICcuLi9jb21tb24vYXBpV3JhcHBlcic7XG5pbXBvcnQgeyBldmVudHMgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcblxuZXhwb3J0IGNvbnN0IGV4ZWN1dGVBY3Rpb24gPSBhcHAgPT4gKGFjdGlvbk5hbWUsIG9wdGlvbnMpID0+IHtcbiAgYXBpV3JhcHBlclN5bmMoXG4gICAgYXBwLFxuICAgIGV2ZW50cy5hY3Rpb25zQXBpLmV4ZWN1dGUsXG4gICAgcGVybWlzc2lvbi5leGVjdXRlQWN0aW9uLmlzQXV0aG9yaXplZChhY3Rpb25OYW1lKSxcbiAgICB7IGFjdGlvbk5hbWUsIG9wdGlvbnMgfSxcbiAgICBhcHAuYWN0aW9uc1thY3Rpb25OYW1lXSwgb3B0aW9ucyxcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBfZXhlY3V0ZUFjdGlvbiA9IChiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb24sIG9wdGlvbnMpID0+IGJlaGF2aW91clNvdXJjZXNbYWN0aW9uLmJlaGF2aW91clNvdXJjZV1bYWN0aW9uLmJlaGF2aW91ck5hbWVdKG9wdGlvbnMpO1xuIiwiaW1wb3J0IHsgZXhlY3V0ZUFjdGlvbiB9IGZyb20gJy4vZXhlY3V0ZSc7XG5cbmV4cG9ydCBjb25zdCBnZXRBY3Rpb25zQXBpID0gYXBwID0+ICh7XG4gIGV4ZWN1dGU6IGV4ZWN1dGVBY3Rpb24oYXBwKSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRBY3Rpb25zQXBpO1xuIiwiaW1wb3J0IHsgaGFzIH0gZnJvbSAnbG9kYXNoL2ZwJztcblxuY29uc3QgcHVibGlzaCA9IGhhbmRsZXJzID0+IGFzeW5jIChldmVudE5hbWUsIGNvbnRleHQgPSB7fSkgPT4ge1xuICBpZiAoIWhhcyhldmVudE5hbWUpKGhhbmRsZXJzKSkgcmV0dXJuO1xuXG4gIGZvciAoY29uc3QgaGFuZGxlciBvZiBoYW5kbGVyc1tldmVudE5hbWVdKSB7XG4gICAgYXdhaXQgaGFuZGxlcihldmVudE5hbWUsIGNvbnRleHQpO1xuICB9XG59O1xuXG5jb25zdCBzdWJzY3JpYmUgPSBoYW5kbGVycyA9PiAoZXZlbnROYW1lLCBoYW5kbGVyKSA9PiB7XG4gIGlmICghaGFzKGV2ZW50TmFtZSkoaGFuZGxlcnMpKSB7XG4gICAgaGFuZGxlcnNbZXZlbnROYW1lXSA9IFtdO1xuICB9XG4gIGhhbmRsZXJzW2V2ZW50TmFtZV0ucHVzaChoYW5kbGVyKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVFdmVudEFnZ3JlZ2F0b3IgPSAoKSA9PiB7XG4gIGNvbnN0IGhhbmRsZXJzID0ge307XG4gIGNvbnN0IGV2ZW50QWdncmVnYXRvciA9ICh7XG4gICAgcHVibGlzaDogcHVibGlzaChoYW5kbGVycyksXG4gICAgc3Vic2NyaWJlOiBzdWJzY3JpYmUoaGFuZGxlcnMpLFxuICB9KTtcbiAgcmV0dXJuIGV2ZW50QWdncmVnYXRvcjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUV2ZW50QWdncmVnYXRvcjtcbiIsImltcG9ydCB7IHJldHJ5IH0gZnJvbSAnLi4vY29tbW9uL2luZGV4JztcclxuaW1wb3J0IHsgTm90Rm91bmRFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xyXG5cclxuY29uc3QgY3JlYXRlSnNvbiA9IG9yaWdpbmFsQ3JlYXRlRmlsZSA9PiBhc3luYyAoa2V5LCBvYmosIHJldHJpZXMgPSAyLCBkZWxheSA9IDEwMCkgPT4gYXdhaXQgcmV0cnkob3JpZ2luYWxDcmVhdGVGaWxlLCByZXRyaWVzLCBkZWxheSwga2V5LCBKU09OLnN0cmluZ2lmeShvYmopKTtcclxuXHJcbmNvbnN0IGNyZWF0ZU5ld0ZpbGUgPSBvcmlnaW5hbENyZWF0ZUZpbGUgPT4gYXN5bmMgKHBhdGgsIGNvbnRlbnQsIHJldHJpZXMgPSAyLCBkZWxheSA9IDEwMCkgPT4gYXdhaXQgcmV0cnkob3JpZ2luYWxDcmVhdGVGaWxlLCByZXRyaWVzLCBkZWxheSwgcGF0aCwgY29udGVudCk7XHJcblxyXG5jb25zdCBsb2FkSnNvbiA9IGRhdGFzdG9yZSA9PiBhc3luYyAoa2V5LCByZXRyaWVzID0gMywgZGVsYXkgPSAxMDApID0+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IHJldHJ5KEpTT04ucGFyc2UsIHJldHJpZXMsIGRlbGF5LCBhd2FpdCBkYXRhc3RvcmUubG9hZEZpbGUoa2V5KSk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICBjb25zdCBuZXdFcnIgPSBuZXcgTm90Rm91bmRFcnJvcihlcnIubWVzc2FnZSk7XHJcbiAgICBuZXdFcnIuc3RhY2sgPSBlcnIuc3RhY2s7XHJcbiAgICB0aHJvdyhuZXdFcnIpO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgdXBkYXRlSnNvbiA9IGRhdGFzdG9yZSA9PiBhc3luYyAoa2V5LCBvYmosIHJldHJpZXMgPSAzLCBkZWxheSA9IDEwMCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgcmV0cnkoZGF0YXN0b3JlLnVwZGF0ZUZpbGUsIHJldHJpZXMsIGRlbGF5LCBrZXksIEpTT04uc3RyaW5naWZ5KG9iaikpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgY29uc3QgbmV3RXJyID0gbmV3IE5vdEZvdW5kRXJyb3IoZXJyLm1lc3NhZ2UpO1xyXG4gICAgbmV3RXJyLnN0YWNrID0gZXJyLnN0YWNrO1xyXG4gICAgdGhyb3cobmV3RXJyKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXR1cERhdGFzdG9yZSA9IChkYXRhc3RvcmUpID0+IHtcclxuICBjb25zdCBvcmlnaW5hbENyZWF0ZUZpbGUgPSBkYXRhc3RvcmUuY3JlYXRlRmlsZTtcclxuICBkYXRhc3RvcmUubG9hZEpzb24gPSBsb2FkSnNvbihkYXRhc3RvcmUpO1xyXG4gIGRhdGFzdG9yZS5jcmVhdGVKc29uID0gY3JlYXRlSnNvbihvcmlnaW5hbENyZWF0ZUZpbGUpO1xyXG4gIGRhdGFzdG9yZS51cGRhdGVKc29uID0gdXBkYXRlSnNvbihkYXRhc3RvcmUpO1xyXG4gIGRhdGFzdG9yZS5jcmVhdGVGaWxlID0gY3JlYXRlTmV3RmlsZShvcmlnaW5hbENyZWF0ZUZpbGUpO1xyXG4gIGlmIChkYXRhc3RvcmUuY3JlYXRlRW1wdHlEYikgeyBkZWxldGUgZGF0YXN0b3JlLmNyZWF0ZUVtcHR5RGI7IH1cclxuICByZXR1cm4gZGF0YXN0b3JlO1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlRXZlbnRBZ2dyZWdhdG9yIH0gZnJvbSAnLi9ldmVudEFnZ3JlZ2F0b3InO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc2V0dXBEYXRhc3RvcmU7XHJcbiIsImltcG9ydCB7IFxuICBjb21waWxlRXhwcmVzc2lvbiBhcyBjRXhwLCBcbiAgY29tcGlsZUNvZGUgYXMgY0NvZGUgXG59IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcblxuZXhwb3J0IGNvbnN0IGNvbXBpbGVDb2RlID0gY29kZSA9PiB7XG4gIGxldCBmdW5jOyAgXG4gICAgXG4gIHRyeSB7XG4gICAgZnVuYyA9IGNDb2RlKGNvZGUpO1xuICB9IGNhdGNoKGUpIHtcbiAgICBlLm1lc3NhZ2UgPSBgRXJyb3IgY29tcGlsaW5nIGNvZGUgOiAke2NvZGV9IDogJHtlLm1lc3NhZ2V9YDtcbiAgICB0aHJvdyBlO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmM7XG59XG5cbmV4cG9ydCBjb25zdCBjb21waWxlRXhwcmVzc2lvbiA9IGNvZGUgPT4ge1xuICBsZXQgZnVuYzsgIFxuICAgICAgXG4gIHRyeSB7XG4gICAgZnVuYyA9IGNFeHAoY29kZSk7XG4gIH0gY2F0Y2goZSkge1xuICAgIGUubWVzc2FnZSA9IGBFcnJvciBjb21waWxpbmcgZXhwcmVzc2lvbiA6ICR7Y29kZX0gOiAke2UubWVzc2FnZX1gO1xuICAgIHRocm93IGU7XG4gIH1cbiAgXG4gIHJldHVybiBmdW5jO1xufVxuIiwiaW1wb3J0IHtcbiAgaXNGdW5jdGlvbiwgZmlsdGVyLCBtYXAsXG4gIHVuaXFCeSwga2V5cywgZGlmZmVyZW5jZSxcbiAgam9pbiwgcmVkdWNlLCBmaW5kLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgY29tcGlsZUV4cHJlc3Npb24sIGNvbXBpbGVDb2RlIH0gZnJvbSAnLi4vY29tbW9uL2NvbXBpbGVDb2RlJztcbmltcG9ydCB7ICQgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgX2V4ZWN1dGVBY3Rpb24gfSBmcm9tICcuL2V4ZWN1dGUnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yLCBOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlQWN0aW9ucyA9IChzdWJzY3JpYmUsIGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMsIHRyaWdnZXJzLCBhcGlzKSA9PiB7XG4gIHZhbGlkYXRlU291cmNlcyhiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zKTtcbiAgc3Vic2NyaWJlVHJpZ2dlcnMoc3Vic2NyaWJlLCBiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zLCB0cmlnZ2VycywgYXBpcyk7XG4gIHJldHVybiBjcmVhdGVBY3Rpb25zQ29sbGVjdGlvbihiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zKTtcbn07XG5cbmNvbnN0IGNyZWF0ZUFjdGlvbnNDb2xsZWN0aW9uID0gKGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMpID0+ICQoYWN0aW9ucywgW1xuICByZWR1Y2UoKGFsbCwgYSkgPT4ge1xuICAgIGFsbFthLm5hbWVdID0gb3B0cyA9PiBfZXhlY3V0ZUFjdGlvbihiZWhhdmlvdXJTb3VyY2VzLCBhLCBvcHRzKTtcbiAgICByZXR1cm4gYWxsO1xuICB9LCB7fSksXG5dKTtcblxuY29uc3Qgc3Vic2NyaWJlVHJpZ2dlcnMgPSAoc3Vic2NyaWJlLCBiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zLCB0cmlnZ2VycywgYXBpcykgPT4ge1xuICBjb25zdCBjcmVhdGVPcHRpb25zID0gKG9wdGlvbnNDcmVhdG9yLCBldmVudENvbnRleHQpID0+IHtcbiAgICBpZiAoIW9wdGlvbnNDcmVhdG9yKSByZXR1cm4ge307XG4gICAgY29uc3QgY3JlYXRlID0gY29tcGlsZUNvZGUob3B0aW9uc0NyZWF0b3IpO1xuICAgIHJldHVybiBjcmVhdGUoeyBjb250ZXh0OiBldmVudENvbnRleHQsIGFwaXMgfSk7XG4gIH07XG5cbiAgY29uc3Qgc2hvdWxkUnVuVHJpZ2dlciA9ICh0cmlnZ2VyLCBldmVudENvbnRleHQpID0+IHtcbiAgICBpZiAoIXRyaWdnZXIuY29uZGl0aW9uKSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCBzaG91bGRSdW4gPSBjb21waWxlRXhwcmVzc2lvbih0cmlnZ2VyLmNvbmRpdGlvbik7XG4gICAgcmV0dXJuIHNob3VsZFJ1bih7IGNvbnRleHQ6IGV2ZW50Q29udGV4dCB9KTtcbiAgfTtcblxuICBmb3IgKGxldCB0cmlnIG9mIHRyaWdnZXJzKSB7XG4gICAgc3Vic2NyaWJlKHRyaWcuZXZlbnROYW1lLCBhc3luYyAoZXYsIGN0eCkgPT4ge1xuICAgICAgaWYgKHNob3VsZFJ1blRyaWdnZXIodHJpZywgY3R4KSkge1xuICAgICAgICBhd2FpdCBfZXhlY3V0ZUFjdGlvbihcbiAgICAgICAgICBiZWhhdmlvdXJTb3VyY2VzLFxuICAgICAgICAgIGZpbmQoYSA9PiBhLm5hbWUgPT09IHRyaWcuYWN0aW9uTmFtZSkoYWN0aW9ucyksXG4gICAgICAgICAgY3JlYXRlT3B0aW9ucyh0cmlnLm9wdGlvbnNDcmVhdG9yLCBjdHgpLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59O1xuXG5jb25zdCB2YWxpZGF0ZVNvdXJjZXMgPSAoYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucykgPT4ge1xuICBjb25zdCBkZWNsYXJlZFNvdXJjZXMgPSAkKGFjdGlvbnMsIFtcbiAgICB1bmlxQnkoYSA9PiBhLmJlaGF2aW91clNvdXJjZSksXG4gICAgbWFwKGEgPT4gYS5iZWhhdmlvdXJTb3VyY2UpLFxuICBdKTtcblxuICBjb25zdCBzdXBwbGllZFNvdXJjZXMgPSBrZXlzKGJlaGF2aW91clNvdXJjZXMpO1xuXG4gIGNvbnN0IG1pc3NpbmdTb3VyY2VzID0gZGlmZmVyZW5jZShcbiAgICBkZWNsYXJlZFNvdXJjZXMsIHN1cHBsaWVkU291cmNlcyxcbiAgKTtcblxuICBpZiAobWlzc2luZ1NvdXJjZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYERlY2xhcmVkIGJlaGF2aW91ciBzb3VyY2VzIGFyZSBub3Qgc3VwcGxpZWQ6ICR7am9pbignLCAnLCBtaXNzaW5nU291cmNlcyl9YCk7XG4gIH1cblxuICBjb25zdCBtaXNzaW5nQmVoYXZpb3VycyA9ICQoYWN0aW9ucywgW1xuICAgIGZpbHRlcihhID0+ICFpc0Z1bmN0aW9uKGJlaGF2aW91clNvdXJjZXNbYS5iZWhhdmlvdXJTb3VyY2VdW2EuYmVoYXZpb3VyTmFtZV0pKSxcbiAgICBtYXAoYSA9PiBgQWN0aW9uOiAke2EubmFtZX0gOiAke2EuYmVoYXZpb3VyU291cmNlfS4ke2EuYmVoYXZpb3VyTmFtZX1gKSxcbiAgXSk7XG5cbiAgaWYgKG1pc3NpbmdCZWhhdmlvdXJzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgTm90Rm91bmRFcnJvcihgTWlzc2luZyBiZWhhdmlvdXJzOiBjb3VsZCBub3QgZmluZCBiZWhhdmlvdXIgZnVuY3Rpb25zOiAke2pvaW4oJywgJywgbWlzc2luZ0JlaGF2aW91cnMpfWApO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgbWFwLCBmaWx0ZXIsIGdyb3VwQnksIHNwbGl0LFxuICBzb21lLCBmaW5kLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgTE9DS19GSUxFTkFNRSwgVFJBTlNBQ1RJT05TX0ZPTERFUiwgaWRTZXAsIGlzVXBkYXRlLFxuICBub2RlS2V5SGFzaEZyb21CdWlsZEZvbGRlciwgaXNCdWlsZEluZGV4Rm9sZGVyLCBnZXRUcmFuc2FjdGlvbklkLFxuICBpc0RlbGV0ZSwgaXNDcmVhdGUsXG59IGZyb20gJy4vdHJhbnNhY3Rpb25zQ29tbW9uJztcbmltcG9ydCB7XG4gIGpvaW5LZXksICQsIG5vbmUsIGlzU29tZXRoaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0TGFzdFBhcnRJbktleSwgZ2V0Tm9kZUZyb21Ob2RlS2V5SGFzaCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBfbG9hZCB9IGZyb20gJy4uL3JlY29yZEFwaS9sb2FkJztcblxuZXhwb3J0IGNvbnN0IHJldHJpZXZlID0gYXN5bmMgKGFwcCkgPT4ge1xuICBjb25zdCB0cmFuc2FjdGlvbkZpbGVzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5nZXRGb2xkZXJDb250ZW50cyhcbiAgICBUUkFOU0FDVElPTlNfRk9MREVSLFxuICApO1xuXG4gIGxldCB0cmFuc2FjdGlvbnMgPSBbXTtcblxuICBpZiAoc29tZShpc0J1aWxkSW5kZXhGb2xkZXIpKHRyYW5zYWN0aW9uRmlsZXMpKSB7XG4gICAgY29uc3QgYnVpbGRJbmRleEZvbGRlciA9IGZpbmQoaXNCdWlsZEluZGV4Rm9sZGVyKSh0cmFuc2FjdGlvbkZpbGVzKTtcblxuICAgIHRyYW5zYWN0aW9ucyA9IGF3YWl0IHJldHJpZXZlQnVpbGRJbmRleFRyYW5zYWN0aW9ucyhcbiAgICAgIGFwcCxcbiAgICAgIGpvaW5LZXkoVFJBTlNBQ1RJT05TX0ZPTERFUiwgYnVpbGRJbmRleEZvbGRlciksXG4gICAgKTtcbiAgfVxuXG4gIGlmICh0cmFuc2FjdGlvbnMubGVuZ3RoID4gMCkgcmV0dXJuIHRyYW5zYWN0aW9ucztcblxuICByZXR1cm4gYXdhaXQgcmV0cmlldmVTdGFuZGFyZFRyYW5zYWN0aW9ucyhcbiAgICBhcHAsIHRyYW5zYWN0aW9uRmlsZXMsXG4gICk7XG59O1xuXG5jb25zdCByZXRyaWV2ZUJ1aWxkSW5kZXhUcmFuc2FjdGlvbnMgPSBhc3luYyAoYXBwLCBidWlsZEluZGV4Rm9sZGVyKSA9PiB7XG4gIGNvbnN0IGNoaWxkRm9sZGVycyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0Rm9sZGVyQ29udGVudHMoYnVpbGRJbmRleEZvbGRlcik7XG4gIGlmIChjaGlsZEZvbGRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gY2xlYW51cFxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKGJ1aWxkSW5kZXhGb2xkZXIpO1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IGdldFRyYW5zYWN0aW9uRmlsZXMgPSBhc3luYyAoY2hpbGRGb2xkZXJJbmRleCA9IDApID0+IHtcbiAgICBpZiAoY2hpbGRGb2xkZXJJbmRleCA+PSBjaGlsZEZvbGRlcnMubGVuZ3RoKSByZXR1cm4gW107XG5cbiAgICBjb25zdCBjaGlsZEZvbGRlcktleSA9IGpvaW5LZXkoYnVpbGRJbmRleEZvbGRlciwgY2hpbGRGb2xkZXJzW2NoaWxkRm9sZGVySW5kZXhdKTtcbiAgICBjb25zdCBmaWxlcyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0Rm9sZGVyQ29udGVudHMoXG4gICAgICBjaGlsZEZvbGRlcktleSxcbiAgICApO1xuXG4gICAgaWYgKGZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoY2hpbGRGb2xkZXJLZXkpO1xuICAgICAgcmV0dXJuIGF3YWl0IGdldFRyYW5zYWN0aW9uRmlsZXMoY2hpbGRGb2xkZXJJbmRleCArIDEpO1xuICAgIH1cblxuICAgIHJldHVybiB7IGNoaWxkRm9sZGVyS2V5LCBmaWxlcyB9O1xuICB9O1xuXG4gIGNvbnN0IHRyYW5zYWN0aW9uRmlsZXMgPSBhd2FpdCBnZXRUcmFuc2FjdGlvbkZpbGVzKCk7XG5cbiAgaWYgKHRyYW5zYWN0aW9uRmlsZXMuZmlsZXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgdHJhbnNhY3Rpb25zID0gJCh0cmFuc2FjdGlvbkZpbGVzLmZpbGVzLCBbXG4gICAgbWFwKHBhcnNlVHJhbnNhY3Rpb25JZCksXG4gIF0pO1xuXG4gIGZvciAoY29uc3QgdCBvZiB0cmFuc2FjdGlvbnMpIHtcbiAgICBjb25zdCB0cmFuc2FjdGlvbkNvbnRlbnQgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgICAgam9pbktleShcbiAgICAgICAgdHJhbnNhY3Rpb25GaWxlcy5jaGlsZEZvbGRlcktleSxcbiAgICAgICAgdC5mdWxsSWQsXG4gICAgICApLFxuICAgICk7XG4gICAgdC5yZWNvcmQgPSBhd2FpdCBfbG9hZChhcHAsIHRyYW5zYWN0aW9uQ29udGVudC5yZWNvcmRLZXkpO1xuICB9XG5cbiAgdHJhbnNhY3Rpb25zLmluZGV4Tm9kZSA9ICQoYnVpbGRJbmRleEZvbGRlciwgW1xuICAgIGdldExhc3RQYXJ0SW5LZXksXG4gICAgbm9kZUtleUhhc2hGcm9tQnVpbGRGb2xkZXIsXG4gICAgZ2V0Tm9kZUZyb21Ob2RlS2V5SGFzaChhcHAuaGllcmFyY2h5KSxcbiAgXSk7XG5cbiAgdHJhbnNhY3Rpb25zLmZvbGRlcktleSA9IHRyYW5zYWN0aW9uRmlsZXMuY2hpbGRGb2xkZXJLZXk7XG5cbiAgcmV0dXJuIHRyYW5zYWN0aW9ucztcbn07XG5cbmNvbnN0IHJldHJpZXZlU3RhbmRhcmRUcmFuc2FjdGlvbnMgPSBhc3luYyAoYXBwLCB0cmFuc2FjdGlvbkZpbGVzKSA9PiB7XG4gIGNvbnN0IHRyYW5zYWN0aW9uSWRzID0gJCh0cmFuc2FjdGlvbkZpbGVzLCBbXG4gICAgZmlsdGVyKGYgPT4gZiAhPT0gTE9DS19GSUxFTkFNRVxuICAgICAgICAgICAgICAgICAgICAmJiAhaXNCdWlsZEluZGV4Rm9sZGVyKGYpKSxcbiAgICBtYXAocGFyc2VUcmFuc2FjdGlvbklkKSxcbiAgXSk7XG5cbiAgY29uc3QgdHJhbnNhY3Rpb25JZHNCeVJlY29yZCA9ICQodHJhbnNhY3Rpb25JZHMsIFtcbiAgICBncm91cEJ5KCdyZWNvcmRJZCcpLFxuICBdKTtcblxuICBjb25zdCBkZWR1cGVkVHJhbnNhY3Rpb25zID0gW107XG5cbiAgY29uc3QgdmVyaWZ5ID0gYXN5bmMgKHQpID0+IHtcbiAgICBpZiAodC52ZXJpZmllZCA9PT0gdHJ1ZSkgcmV0dXJuIHQ7XG5cbiAgICBjb25zdCBpZCA9IGdldFRyYW5zYWN0aW9uSWQoXG4gICAgICB0LnJlY29yZElkLFxuICAgICAgdC50cmFuc2FjdGlvblR5cGUsXG4gICAgICB0LnVuaXF1ZUlkLFxuICAgICk7XG5cbiAgICBjb25zdCB0cmFuc2FjdGlvbiA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgICBqb2luS2V5KFRSQU5TQUNUSU9OU19GT0xERVIsIGlkKSxcbiAgICApO1xuXG4gICAgaWYgKGlzRGVsZXRlKHQpKSB7XG4gICAgICB0LnJlY29yZCA9IHRyYW5zYWN0aW9uLnJlY29yZDtcbiAgICAgIHQudmVyaWZpZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHQ7XG4gICAgfVxuXG4gICAgY29uc3QgcmVjID0gYXdhaXQgX2xvYWQoXG4gICAgICBhcHAsXG4gICAgICB0cmFuc2FjdGlvbi5yZWNvcmRLZXksXG4gICAgKTtcbiAgICBpZiAocmVjLnRyYW5zYWN0aW9uSWQgPT09IGlkKSB7XG4gICAgICB0LnJlY29yZCA9IHJlYztcbiAgICAgIGlmICh0cmFuc2FjdGlvbi5vbGRSZWNvcmQpIHsgdC5vbGRSZWNvcmQgPSB0cmFuc2FjdGlvbi5vbGRSZWNvcmQ7IH1cbiAgICAgIHQudmVyaWZpZWQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0LnZlcmlmaWVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHQ7XG4gIH07XG5cbiAgY29uc3QgcGlja09uZSA9IGFzeW5jICh0cmFucywgZm9yVHlwZSkgPT4ge1xuICAgIGNvbnN0IHRyYW5zRm9yVHlwZSA9IGZpbHRlcihmb3JUeXBlKSh0cmFucyk7XG4gICAgaWYgKHRyYW5zRm9yVHlwZS5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNvbnN0IHQgPSBhd2FpdCB2ZXJpZnkodHJhbnNGb3JUeXBlWzBdKTtcbiAgICAgIHJldHVybiAodC52ZXJpZmllZCA9PT0gdHJ1ZSA/IHQgOiBudWxsKTtcbiAgICB9XG4gICAgZm9yIChsZXQgdCBvZiB0cmFuc0ZvclR5cGUpIHtcbiAgICAgIHQgPSBhd2FpdCB2ZXJpZnkodCk7XG4gICAgICBpZiAodC52ZXJpZmllZCA9PT0gdHJ1ZSkgeyByZXR1cm4gdDsgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIGZvciAoY29uc3QgcmVjb3JkSWQgaW4gdHJhbnNhY3Rpb25JZHNCeVJlY29yZCkge1xuICAgIGNvbnN0IHRyYW5zSWRzRm9yUmVjb3JkID0gdHJhbnNhY3Rpb25JZHNCeVJlY29yZFtyZWNvcmRJZF07XG4gICAgaWYgKHRyYW5zSWRzRm9yUmVjb3JkLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY29uc3QgdCA9IGF3YWl0IHZlcmlmeSh0cmFuc0lkc0ZvclJlY29yZFswXSk7XG4gICAgICBpZiAodC52ZXJpZmllZCkgeyBkZWR1cGVkVHJhbnNhY3Rpb25zLnB1c2godCk7IH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoc29tZShpc0RlbGV0ZSkodHJhbnNJZHNGb3JSZWNvcmQpKSB7XG4gICAgICBjb25zdCB0ID0gYXdhaXQgdmVyaWZ5KGZpbmQoaXNEZWxldGUpKHRyYW5zSWRzRm9yUmVjb3JkKSk7XG4gICAgICBpZiAodC52ZXJpZmllZCkgeyBkZWR1cGVkVHJhbnNhY3Rpb25zLnB1c2godCk7IH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoc29tZShpc1VwZGF0ZSkodHJhbnNJZHNGb3JSZWNvcmQpKSB7XG4gICAgICBjb25zdCB1cGQgPSBhd2FpdCBwaWNrT25lKHRyYW5zSWRzRm9yUmVjb3JkLCBpc1VwZGF0ZSk7XG4gICAgICBpZiAoaXNTb21ldGhpbmcodXBkKSAmJiB1cGQudmVyaWZpZWQpIHsgZGVkdXBlZFRyYW5zYWN0aW9ucy5wdXNoKHVwZCk7IH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoc29tZShpc0NyZWF0ZSkodHJhbnNJZHNGb3JSZWNvcmQpKSB7XG4gICAgICBjb25zdCBjcmUgPSBhd2FpdCBwaWNrT25lKHRyYW5zSWRzRm9yUmVjb3JkLCBpc0NyZWF0ZSk7XG4gICAgICBpZiAoaXNTb21ldGhpbmcoY3JlKSkgeyBkZWR1cGVkVHJhbnNhY3Rpb25zLnB1c2goY3JlKTsgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZHVwbGljYXRlcyA9ICQodHJhbnNhY3Rpb25JZHMsIFtcbiAgICBmaWx0ZXIodCA9PiBub25lKGRkdCA9PiBkZHQudW5pcXVlSWQgPT09IHQudW5pcXVlSWQpKGRlZHVwZWRUcmFuc2FjdGlvbnMpKSxcbiAgXSk7XG5cblxuICBjb25zdCBkZWxldGVQcm9taXNlcyA9IG1hcCh0ID0+IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShcbiAgICBqb2luS2V5KFxuICAgICAgVFJBTlNBQ1RJT05TX0ZPTERFUixcbiAgICAgIGdldFRyYW5zYWN0aW9uSWQoXG4gICAgICAgIHQucmVjb3JkSWQsXG4gICAgICAgIHQudHJhbnNhY3Rpb25UeXBlLFxuICAgICAgICB0LnVuaXF1ZUlkLFxuICAgICAgKSxcbiAgICApLFxuICApKShkdXBsaWNhdGVzKTtcblxuICBhd2FpdCBQcm9taXNlLmFsbChkZWxldGVQcm9taXNlcyk7XG5cbiAgcmV0dXJuIGRlZHVwZWRUcmFuc2FjdGlvbnM7XG59O1xuXG5jb25zdCBwYXJzZVRyYW5zYWN0aW9uSWQgPSAoaWQpID0+IHtcbiAgY29uc3Qgc3BsaXRJZCA9IHNwbGl0KGlkU2VwKShpZCk7XG4gIHJldHVybiAoe1xuICAgIHJlY29yZElkOiBzcGxpdElkWzBdLFxuICAgIHRyYW5zYWN0aW9uVHlwZTogc3BsaXRJZFsxXSxcbiAgICB1bmlxdWVJZDogc3BsaXRJZFsyXSxcbiAgICBmdWxsSWQ6IGlkLFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBvcmRlckJ5IH0gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHtcclxuICByZWR1Y2UsIGZpbmQsIGluY2x1ZGVzLCBmbGF0dGVuLCB1bmlvbixcclxuICBmaWx0ZXIsIGVhY2gsIG1hcCxcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQge1xyXG4gIGpvaW5LZXksIHNwbGl0S2V5LCBpc05vbkVtcHR5U3RyaW5nLFxyXG4gIGlzTm90aGluZywgJCwgaXNTb21ldGhpbmcsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHtcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksIGdldE5vZGUsIGdldFJlY29yZE5vZGVJZCxcclxuICBnZXRFeGFjdE5vZGVGb3JLZXksIHJlY29yZE5vZGVJZElzQWxsb3dlZCxcclxuICBpc1JlY29yZCwgaXNHbG9iYWxJbmRleCxcclxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBpbmRleFR5cGVzIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaW5kZXhlcyc7XHJcbmltcG9ydCB7IGdldEluZGV4RGlyIH0gZnJvbSBcIi4uL2luZGV4QXBpL2dldEluZGV4RGlyXCI7XHJcbmltcG9ydCB7IGdldFJlY29yZEluZm99IGZyb20gXCIuLi9yZWNvcmRBcGkvcmVjb3JkSW5mb1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFJlbGV2YW50QW5jZXN0b3JJbmRleGVzID0gKGhpZXJhcmNoeSwgcmVjb3JkKSA9PiB7XHJcbiAgY29uc3Qga2V5ID0gcmVjb3JkLmtleTtcclxuICBjb25zdCBrZXlQYXJ0cyA9IHNwbGl0S2V5KGtleSk7XHJcbiAgY29uc3Qgbm9kZUlkID0gZ2V0UmVjb3JkTm9kZUlkKGtleSk7XHJcblxyXG4gIGNvbnN0IGZsYXRIaWVyYXJjaHkgPSBvcmRlckJ5KGdldEZsYXR0ZW5lZEhpZXJhcmNoeShoaWVyYXJjaHkpLFxyXG4gICAgW25vZGUgPT4gbm9kZS5wYXRoUmVneCgpLmxlbmd0aF0sXHJcbiAgICBbJ2Rlc2MnXSk7XHJcblxyXG4gIGNvbnN0IG1ha2VpbmRleE5vZGVBbmREaXJfRm9yQW5jZXN0b3JJbmRleCA9IChpbmRleE5vZGUsIHBhcmVudFJlY29yZERpcikgPT4gbWFrZUluZGV4Tm9kZUFuZERpcihpbmRleE5vZGUsIGpvaW5LZXkocGFyZW50UmVjb3JkRGlyLCBpbmRleE5vZGUubmFtZSkpO1xyXG5cclxuICBjb25zdCB0cmF2ZXJzZUFuY2VzdG9ySW5kZXhlc0luUGF0aCA9ICgpID0+IHJlZHVjZSgoYWNjLCBwYXJ0KSA9PiB7XHJcbiAgICBjb25zdCBjdXJyZW50SW5kZXhLZXkgPSBqb2luS2V5KGFjYy5sYXN0SW5kZXhLZXksIHBhcnQpO1xyXG4gICAgYWNjLmxhc3RJbmRleEtleSA9IGN1cnJlbnRJbmRleEtleTtcclxuICAgIGNvbnN0IHRlc3RQYXRoUmVneCA9IHAgPT4gbmV3IFJlZ0V4cChgJHtwLnBhdGhSZWd4KCl9JGApLnRlc3QoY3VycmVudEluZGV4S2V5KTtcclxuICAgIGNvbnN0IG5vZGVNYXRjaCA9IGZpbmQodGVzdFBhdGhSZWd4KShmbGF0SGllcmFyY2h5KTtcclxuXHJcbiAgICBpZiAoaXNOb3RoaW5nKG5vZGVNYXRjaCkpIHsgcmV0dXJuIGFjYzsgfVxyXG5cclxuICAgIGlmICghaXNSZWNvcmQobm9kZU1hdGNoKVxyXG4gICAgICAgICAgICAgICAgfHwgbm9kZU1hdGNoLmluZGV4ZXMubGVuZ3RoID09PSAwKSB7IHJldHVybiBhY2M7IH1cclxuXHJcbiAgICBjb25zdCBpbmRleGVzID0gJChub2RlTWF0Y2guaW5kZXhlcywgW1xyXG4gICAgICBmaWx0ZXIoaSA9PiBpLmluZGV4VHlwZSA9PT0gaW5kZXhUeXBlcy5hbmNlc3RvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAoaS5hbGxvd2VkUmVjb3JkTm9kZUlkcy5sZW5ndGggPT09IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGluY2x1ZGVzKG5vZGVJZCkoaS5hbGxvd2VkUmVjb3JkTm9kZUlkcykpKSxcclxuICAgIF0pO1xyXG5cclxuICAgIGNvbnN0IGN1cnJlbnRSZWNvcmREaXIgPSBnZXRSZWNvcmRJbmZvKGhpZXJhcmNoeSwgY3VycmVudEluZGV4S2V5KS5kaXI7XHJcblxyXG4gICAgZWFjaCh2ID0+IGFjYy5ub2Rlc0FuZEtleXMucHVzaChcclxuICAgICAgbWFrZWluZGV4Tm9kZUFuZERpcl9Gb3JBbmNlc3RvckluZGV4KHYsIGN1cnJlbnRSZWNvcmREaXIpLFxyXG4gICAgKSkoaW5kZXhlcyk7XHJcblxyXG4gICAgcmV0dXJuIGFjYztcclxuICB9LCB7IGxhc3RJbmRleEtleTogJycsIG5vZGVzQW5kS2V5czogW10gfSkoa2V5UGFydHMpLm5vZGVzQW5kS2V5cztcclxuXHJcbiAgY29uc3Qgcm9vdEluZGV4ZXMgPSAkKGZsYXRIaWVyYXJjaHksIFtcclxuICAgIGZpbHRlcihuID0+IGlzR2xvYmFsSW5kZXgobikgJiYgcmVjb3JkTm9kZUlkSXNBbGxvd2VkKG4pKG5vZGVJZCkpLFxyXG4gICAgbWFwKGkgPT4gbWFrZUluZGV4Tm9kZUFuZERpcihcclxuICAgICAgICAgICAgICBpLCBcclxuICAgICAgICAgICAgICBnZXRJbmRleERpcihoaWVyYXJjaHksIGkubm9kZUtleSgpKSkpLFxyXG4gIF0pO1xyXG5cclxuICByZXR1cm4gdW5pb24odHJhdmVyc2VBbmNlc3RvckluZGV4ZXNJblBhdGgoKSkocm9vdEluZGV4ZXMpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFJlbGV2YW50UmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMgPSAoaGllcmFyY2h5LCByZWNvcmQpID0+ICQocmVjb3JkLmtleSwgW1xyXG4gIGdldEV4YWN0Tm9kZUZvcktleShoaWVyYXJjaHkpLFxyXG4gIG4gPT4gbi5maWVsZHMsXHJcbiAgZmlsdGVyKGYgPT4gZi50eXBlID09PSAncmVmZXJlbmNlJ1xyXG4gICAgICAgICAgICAgICAgICAgICYmIGlzU29tZXRoaW5nKHJlY29yZFtmLm5hbWVdKVxyXG4gICAgICAgICAgICAgICAgICAgICYmIGlzTm9uRW1wdHlTdHJpbmcocmVjb3JkW2YubmFtZV0ua2V5KSksXHJcbiAgbWFwKGYgPT4gJChmLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzLCBbXHJcbiAgICBtYXAobiA9PiAoe1xyXG4gICAgICByZWNvcmROb2RlOiBnZXROb2RlKGhpZXJhcmNoeSwgbiksXHJcbiAgICAgIGZpZWxkOiBmLFxyXG4gICAgfSkpLFxyXG4gIF0pKSxcclxuICBmbGF0dGVuLFxyXG4gIG1hcChuID0+IG1ha2VJbmRleE5vZGVBbmREaXIoXHJcbiAgICBuLnJlY29yZE5vZGUsXHJcbiAgICBqb2luS2V5KFxyXG4gICAgICBnZXRSZWNvcmRJbmZvKGhpZXJhcmNoeSwgcmVjb3JkW24uZmllbGQubmFtZV0ua2V5KS5kaXIsIFxyXG4gICAgICBuLnJlY29yZE5vZGUubmFtZSksXHJcbiAgKSksXHJcbl0pO1xyXG5cclxuY29uc3QgbWFrZUluZGV4Tm9kZUFuZERpciA9IChpbmRleE5vZGUsIGluZGV4RGlyKSA9PiAoeyBpbmRleE5vZGUsIGluZGV4RGlyIH0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2V0UmVsZXZhbnRBbmNlc3RvckluZGV4ZXM7XHJcbiIsIiAgLy8gYWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXg0ZXIvanMtcHJvbWlzZS13cml0YWJsZVxuICAvLyBUaGFuayB5b3UgOikgXG4gIGV4cG9ydCBjb25zdCBwcm9taXNlV3JpdGVhYmxlU3RyZWFtID0gc3RyZWFtID0+IHtcbiAgXG4gICAgbGV0IF9lcnJvcmVkO1xuICBcbiAgICBjb25zdCBfZXJyb3JIYW5kbGVyID0gZXJyID0+IHtcbiAgICAgICAgX2Vycm9yZWQgPSBlcnI7XG4gICAgfTtcblxuICAgIHN0cmVhbS5vbihcImVycm9yXCIsIF9lcnJvckhhbmRsZXIpOyAgICBcbiAgXG4gICAgY29uc3Qgd3JpdGUgPSBjaHVuayA9PiB7ICBcbiAgICAgIGxldCByZWplY3RlZCA9IGZhbHNlO1xuICBcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGlmIChfZXJyb3JlZCkge1xuICAgICAgICAgIGNvbnN0IGVyciA9IF9lcnJvcmVkO1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgaWYgKCFzdHJlYW0ud3JpdGFibGUgfHwgc3RyZWFtLmNsb3NlZCB8fCBzdHJlYW0uZGVzdHJveWVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJ3cml0ZSBhZnRlciBlbmRcIikpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCB3cml0ZUVycm9ySGFuZGxlciA9IGVyciA9PiB7XG4gICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmVqZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBzdHJlYW0ub25jZShcImVycm9yXCIsIHdyaXRlRXJyb3JIYW5kbGVyKTtcbiAgXG4gICAgICAgIGNvbnN0IGNhbldyaXRlID0gc3RyZWFtLndyaXRlKGNodW5rKTtcbiAgXG4gICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIHdyaXRlRXJyb3JIYW5kbGVyKTtcbiAgXG4gICAgICAgIGlmIChjYW5Xcml0ZSkge1xuICAgICAgICAgIGlmICghcmVqZWN0ZWQpIHtcbiAgICAgICAgICAgIHJlc29sdmUoY2h1bmsubGVuZ3RoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgZXJyb3JIYW5kbGVyID0gZXJyID0+IHtcbiAgICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIGNvbnN0IGRyYWluSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVzb2x2ZShjaHVuay5sZW5ndGgpO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgY29uc3QgY2xvc2VIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICByZXNvbHZlKGNodW5rLmxlbmd0aCk7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICBjb25zdCBmaW5pc2hIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICByZXNvbHZlKGNodW5rLmxlbmd0aCk7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICBjb25zdCByZW1vdmVMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJjbG9zZVwiLCBjbG9zZUhhbmRsZXIpO1xuICAgICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZHJhaW5cIiwgZHJhaW5IYW5kbGVyKTtcbiAgICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gICAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJmaW5pc2hcIiwgZmluaXNoSGFuZGxlcik7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICBzdHJlYW0ub24oXCJjbG9zZVwiLCBjbG9zZUhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5vbihcImRyYWluXCIsIGRyYWluSGFuZGxlcik7XG4gICAgICAgICAgc3RyZWFtLm9uKFwiZXJyb3JcIiwgZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ub24oXCJmaW5pc2hcIiwgZmluaXNoSGFuZGxlcik7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICBcbiAgICBjb25zdCBlbmQgPSAoKSA9PiB7XG4gIFxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKF9lcnJvcmVkKSB7XG4gICAgICAgICAgY29uc3QgZXJyID0gX2Vycm9yZWQ7XG4gICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBpZiAoIXN0cmVhbS53cml0YWJsZSB8fCBzdHJlYW0uY2xvc2VkIHx8IHN0cmVhbS5kZXN0cm95ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCBmaW5pc2hIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgZXJyb3JIYW5kbGVyID0gKGVycikgPT4ge1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCByZW1vdmVMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJmaW5pc2hcIiwgZmluaXNoSGFuZGxlcik7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIHN0cmVhbS5vbihcImZpbmlzaFwiLCBmaW5pc2hIYW5kbGVyKTtcbiAgICAgICAgc3RyZWFtLm9uKFwiZXJyb3JcIiwgZXJyb3JIYW5kbGVyKTtcbiAgXG4gICAgICAgIHN0cmVhbS5lbmQoKTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHt3cml0ZSwgZW5kfTtcbiAgfVxuICBcbiAgZXhwb3J0IGRlZmF1bHQgcHJvbWlzZVdyaXRlYWJsZVN0cmVhbVxuICAiLCJpbXBvcnQgeyBlbnN1cmVTaGFyZE5hbWVJc0luU2hhcmRNYXAgfSBmcm9tICcuL3NoYXJkaW5nJztcclxuaW1wb3J0IHsgZ2V0SW5kZXhXcml0ZXIgfSBmcm9tICcuL3NlcmlhbGl6ZXInO1xyXG5pbXBvcnQgeyBpc1NoYXJkZWRJbmRleCwgZ2V0UGFyZW50S2V5IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHtwcm9taXNlV3JpdGVhYmxlU3RyZWFtfSBmcm9tIFwiLi9wcm9taXNlV3JpdGFibGVTdHJlYW1cIjtcclxuaW1wb3J0IHtwcm9taXNlUmVhZGFibGVTdHJlYW19IGZyb20gXCIuL3Byb21pc2VSZWFkYWJsZVN0cmVhbVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGFwcGx5VG9TaGFyZCA9IGFzeW5jIChoaWVyYXJjaHksIHN0b3JlLCBpbmRleERpcixcclxuICBpbmRleE5vZGUsIGluZGV4U2hhcmRLZXksIHJlY29yZHNUb1dyaXRlLCBrZXlzVG9SZW1vdmUpID0+IHtcclxuICBjb25zdCBjcmVhdGVJZk5vdEV4aXN0cyA9IHJlY29yZHNUb1dyaXRlLmxlbmd0aCA+IDA7XHJcbiAgY29uc3Qgd3JpdGVyID0gYXdhaXQgZ2V0V3JpdGVyKGhpZXJhcmNoeSwgc3RvcmUsIGluZGV4RGlyLCBpbmRleFNoYXJkS2V5LCBpbmRleE5vZGUsIGNyZWF0ZUlmTm90RXhpc3RzKTtcclxuICBpZiAod3JpdGVyID09PSBTSEFSRF9ERUxFVEVEKSByZXR1cm47XHJcblxyXG4gIGF3YWl0IHdyaXRlci51cGRhdGVJbmRleChyZWNvcmRzVG9Xcml0ZSwga2V5c1RvUmVtb3ZlKTtcclxuICBhd2FpdCBzd2FwVGVtcEZpbGVJbihzdG9yZSwgaW5kZXhTaGFyZEtleSk7XHJcbn07XHJcblxyXG5jb25zdCBTSEFSRF9ERUxFVEVEID0gJ1NIQVJEX0RFTEVURUQnO1xyXG5jb25zdCBnZXRXcml0ZXIgPSBhc3luYyAoaGllcmFyY2h5LCBzdG9yZSwgaW5kZXhEaXIsIGluZGV4ZWREYXRhS2V5LCBpbmRleE5vZGUsIGNyZWF0ZUlmTm90RXhpc3RzKSA9PiB7XHJcbiAgbGV0IHJlYWRhYmxlU3RyZWFtID0gbnVsbDtcclxuXHJcbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4Tm9kZSkpIHtcclxuICAgIGF3YWl0IGVuc3VyZVNoYXJkTmFtZUlzSW5TaGFyZE1hcChzdG9yZSwgaW5kZXhEaXIsIGluZGV4ZWREYXRhS2V5KTtcclxuICAgIGlmKCFhd2FpdCBzdG9yZS5leGlzdHMoaW5kZXhlZERhdGFLZXkpKSB7XHJcbiAgICAgIGlmIChhd2FpdCBzdG9yZS5leGlzdHMoZ2V0UGFyZW50S2V5KGluZGV4ZWREYXRhS2V5KSkpIHtcclxuICAgICAgICBhd2FpdCBzdG9yZS5jcmVhdGVGaWxlKGluZGV4ZWREYXRhS2V5LCBcIlwiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gU0hBUkRfREVMRVRFRDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuXHJcbiAgICByZWFkYWJsZVN0cmVhbSA9IHByb21pc2VSZWFkYWJsZVN0cmVhbShcclxuICAgICAgICBhd2FpdCBzdG9yZS5yZWFkYWJsZUZpbGVTdHJlYW0oaW5kZXhlZERhdGFLZXkpXHJcbiAgICApO1xyXG5cclxuICB9IGNhdGNoIChlKSB7XHJcblxyXG4gICAgaWYgKGF3YWl0IHN0b3JlLmV4aXN0cyhpbmRleGVkRGF0YUtleSkpIHtcclxuICAgICAgdGhyb3cgZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChjcmVhdGVJZk5vdEV4aXN0cykgeyBcclxuICAgICAgICBpZihhd2FpdCBzdG9yZS5leGlzdHMoZ2V0UGFyZW50S2V5KGluZGV4ZWREYXRhS2V5KSkpIHtcclxuICAgICAgICAgIGF3YWl0IHN0b3JlLmNyZWF0ZUZpbGUoaW5kZXhlZERhdGFLZXksICcnKTsgICAgIFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gU0hBUkRfREVMRVRFRDsgXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgeyBcclxuICAgICAgICByZXR1cm4gU0hBUkRfREVMRVRFRDsgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlYWRhYmxlU3RyZWFtID0gcHJvbWlzZVJlYWRhYmxlU3RyZWFtKFxyXG4gICAgICAgICAgYXdhaXQgc3RvcmUucmVhZGFibGVGaWxlU3RyZWFtKGluZGV4ZWREYXRhS2V5KVxyXG4gICAgICApO1xyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IHdyaXRhYmxlU3RyZWFtID0gcHJvbWlzZVdyaXRlYWJsZVN0cmVhbShcclxuICAgICAgYXdhaXQgc3RvcmUud3JpdGFibGVGaWxlU3RyZWFtKGluZGV4ZWREYXRhS2V5ICsgXCIudGVtcFwiKVxyXG4gICk7XHJcblxyXG4gIHJldHVybiBnZXRJbmRleFdyaXRlcihcclxuICAgIGhpZXJhcmNoeSwgaW5kZXhOb2RlLFxyXG4gICAgICAgIHJlYWRhYmxlU3RyZWFtLCB3cml0YWJsZVN0cmVhbVxyXG4gICk7XHJcbn07XHJcblxyXG5jb25zdCBzd2FwVGVtcEZpbGVJbiA9IGFzeW5jIChzdG9yZSwgaW5kZXhlZERhdGFLZXksIGlzUmV0cnkgPSBmYWxzZSkgPT4ge1xyXG4gIGNvbnN0IHRlbXBGaWxlID0gYCR7aW5kZXhlZERhdGFLZXl9LnRlbXBgO1xyXG4gIHRyeSB7XHJcbiAgICBhd2FpdCBzdG9yZS5kZWxldGVGaWxlKGluZGV4ZWREYXRhS2V5KTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICAvLyBpZ25vcmUgZmFpbHVyZSwgaW5jYXNlIGl0IGhhcyBub3QgYmVlbiBjcmVhdGVkIHlldFxyXG5cclxuICAgIC8vIGlmIHBhcmVudCBmb2xkZXIgZG9lcyBub3QgZXhpc3QsIGFzc3VtZSB0aGF0IHRoaXMgaW5kZXhcclxuICAgIC8vIHNob3VsZCBub3QgYmUgdGhlcmVcclxuICAgIGlmKCFhd2FpdCBzdG9yZS5leGlzdHMoZ2V0UGFyZW50S2V5KGluZGV4ZWREYXRhS2V5KSkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gIH1cclxuICB0cnkge1xyXG4gICAgYXdhaXQgc3RvcmUucmVuYW1lRmlsZSh0ZW1wRmlsZSwgaW5kZXhlZERhdGFLZXkpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIC8vIHJldHJ5aW5nIGluIGNhc2UgZGVsZXRlIGZhaWx1cmUgd2FzIGZvciBzb21lIG90aGVyIHJlYXNvblxyXG4gICAgaWYgKCFpc1JldHJ5KSB7XHJcbiAgICAgIGF3YWl0IHN3YXBUZW1wRmlsZUluKHN0b3JlLCBpbmRleGVkRGF0YUtleSwgdHJ1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gc3dhcCBpbiBpbmRleCBmaWxlZDogXCIgKyBlLm1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuIiwiaW1wb3J0IHtcclxuICBmaWx0ZXIsIG1hcCwgaXNVbmRlZmluZWQsIGluY2x1ZGVzLFxyXG4gIGZsYXR0ZW4sIGludGVyc2VjdGlvbkJ5LFxyXG4gIGlzRXF1YWwsIHB1bGwsIGtleXMsXHJcbiAgZGlmZmVyZW5jZUJ5LCBkaWZmZXJlbmNlLFxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IHVuaW9uIH0gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHtcclxuICBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcyxcclxuICBnZXRSZWxldmFudFJldmVyc2VSZWZlcmVuY2VJbmRleGVzLFxyXG59IGZyb20gJy4uL2luZGV4aW5nL3JlbGV2YW50JztcclxuaW1wb3J0IHsgZXZhbHVhdGUgfSBmcm9tICcuLi9pbmRleGluZy9ldmFsdWF0ZSc7XHJcbmltcG9ydCB7XHJcbiAgJCwgaXNTb21ldGhpbmcsXHJcbiAgaXNOb25FbXB0eUFycmF5LCBqb2luS2V5LFxyXG4gIGlzTm9uRW1wdHlTdHJpbmcsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgZ2V0SW5kZXhlZERhdGFLZXkgfSBmcm9tICcuLi9pbmRleGluZy9zaGFyZGluZyc7XHJcbmltcG9ydCB7XHJcbiAgaXNVcGRhdGUsIGlzQ3JlYXRlLFxyXG4gIGlzRGVsZXRlLCBpc0J1aWxkSW5kZXgsXHJcbn0gZnJvbSAnLi90cmFuc2FjdGlvbnNDb21tb24nO1xyXG5pbXBvcnQgeyBhcHBseVRvU2hhcmQgfSBmcm9tICcuLi9pbmRleGluZy9hcHBseSc7XHJcbmltcG9ydCB7XHJcbiAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQsXHJcbiAgaXNHbG9iYWxJbmRleCwgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXgsIGlzUmVmZXJlbmNlSW5kZXgsXHJcbiAgZ2V0RXhhY3ROb2RlRm9yS2V5LFxyXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7IGdldFJlY29yZEluZm8gfSBmcm9tIFwiLi4vcmVjb3JkQXBpL3JlY29yZEluZm9cIjtcclxuaW1wb3J0IHsgZ2V0SW5kZXhEaXIgfSBmcm9tICcuLi9pbmRleEFwaS9nZXRJbmRleERpcic7XHJcblxyXG5leHBvcnQgY29uc3QgZXhlY3V0ZVRyYW5zYWN0aW9ucyA9IGFwcCA9PiBhc3luYyAodHJhbnNhY3Rpb25zKSA9PiB7XHJcbiAgY29uc3QgcmVjb3Jkc0J5U2hhcmQgPSBtYXBwZWRSZWNvcmRzQnlJbmRleFNoYXJkKGFwcC5oaWVyYXJjaHksIHRyYW5zYWN0aW9ucyk7XHJcblxyXG4gIGZvciAoY29uc3Qgc2hhcmQgb2Yga2V5cyhyZWNvcmRzQnlTaGFyZCkpIHtcclxuICAgIGF3YWl0IGFwcGx5VG9TaGFyZChcclxuICAgICAgYXBwLmhpZXJhcmNoeSwgYXBwLmRhdGFzdG9yZSxcclxuICAgICAgcmVjb3Jkc0J5U2hhcmRbc2hhcmRdLmluZGV4RGlyLFxyXG4gICAgICByZWNvcmRzQnlTaGFyZFtzaGFyZF0uaW5kZXhOb2RlLFxyXG4gICAgICBzaGFyZCxcclxuICAgICAgcmVjb3Jkc0J5U2hhcmRbc2hhcmRdLndyaXRlcyxcclxuICAgICAgcmVjb3Jkc0J5U2hhcmRbc2hhcmRdLnJlbW92ZXMsXHJcbiAgICApO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IG1hcHBlZFJlY29yZHNCeUluZGV4U2hhcmQgPSAoaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMpID0+IHtcclxuICBjb25zdCB1cGRhdGVzID0gZ2V0VXBkYXRlVHJhbnNhY3Rpb25zQnlTaGFyZChcclxuICAgIGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zLFxyXG4gICk7XHJcblxyXG4gIGNvbnN0IGNyZWF0ZWQgPSBnZXRDcmVhdGVUcmFuc2FjdGlvbnNCeVNoYXJkKFxyXG4gICAgaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMsXHJcbiAgKTtcclxuICBjb25zdCBkZWxldGVzID0gZ2V0RGVsZXRlVHJhbnNhY3Rpb25zQnlTaGFyZChcclxuICAgIGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zLFxyXG4gICk7XHJcblxyXG4gIGNvbnN0IGluZGV4QnVpbGQgPSBnZXRCdWlsZEluZGV4VHJhbnNhY3Rpb25zQnlTaGFyZChcclxuICAgIGhpZXJhcmNoeSxcclxuICAgIHRyYW5zYWN0aW9ucyxcclxuICApO1xyXG5cclxuICBjb25zdCB0b1JlbW92ZSA9IFtcclxuICAgIC4uLmRlbGV0ZXMsXHJcbiAgICAuLi51cGRhdGVzLnRvUmVtb3ZlLFxyXG4gIF07XHJcblxyXG4gIGNvbnN0IHRvV3JpdGUgPSBbXHJcbiAgICAuLi5jcmVhdGVkLFxyXG4gICAgLi4udXBkYXRlcy50b1dyaXRlLFxyXG4gICAgLi4uaW5kZXhCdWlsZCxcclxuICBdO1xyXG5cclxuICBjb25zdCB0cmFuc0J5U2hhcmQgPSB7fTtcclxuXHJcbiAgY29uc3QgaW5pdGlhbGlzZVNoYXJkID0gKHQpID0+IHtcclxuICAgIGlmIChpc1VuZGVmaW5lZCh0cmFuc0J5U2hhcmRbdC5pbmRleFNoYXJkS2V5XSkpIHtcclxuICAgICAgdHJhbnNCeVNoYXJkW3QuaW5kZXhTaGFyZEtleV0gPSB7XHJcbiAgICAgICAgd3JpdGVzOiBbXSxcclxuICAgICAgICByZW1vdmVzOiBbXSxcclxuICAgICAgICBpbmRleERpcjogdC5pbmRleERpcixcclxuICAgICAgICBpbmRleE5vZGVLZXk6IHQuaW5kZXhOb2RlLm5vZGVLZXkoKSxcclxuICAgICAgICBpbmRleE5vZGU6IHQuaW5kZXhOb2RlLFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGZvciAoY29uc3QgdHJhbnMgb2YgdG9Xcml0ZSkge1xyXG4gICAgaW5pdGlhbGlzZVNoYXJkKHRyYW5zKTtcclxuICAgIHRyYW5zQnlTaGFyZFt0cmFucy5pbmRleFNoYXJkS2V5XS53cml0ZXMucHVzaChcclxuICAgICAgdHJhbnMubWFwcGVkUmVjb3JkLnJlc3VsdCxcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBmb3IgKGNvbnN0IHRyYW5zIG9mIHRvUmVtb3ZlKSB7XHJcbiAgICBpbml0aWFsaXNlU2hhcmQodHJhbnMpO1xyXG4gICAgdHJhbnNCeVNoYXJkW3RyYW5zLmluZGV4U2hhcmRLZXldLnJlbW92ZXMucHVzaChcclxuICAgICAgdHJhbnMubWFwcGVkUmVjb3JkLnJlc3VsdC5rZXksXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRyYW5zQnlTaGFyZDtcclxufTtcclxuXHJcbmNvbnN0IGdldFVwZGF0ZVRyYW5zYWN0aW9uc0J5U2hhcmQgPSAoaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMpID0+IHtcclxuICBjb25zdCB1cGRhdGVUcmFuc2FjdGlvbnMgPSAkKHRyYW5zYWN0aW9ucywgW2ZpbHRlcihpc1VwZGF0ZSldKTtcclxuXHJcbiAgY29uc3QgZXZhbHVhdGVJbmRleCA9IChyZWNvcmQsIGluZGV4Tm9kZUFuZFBhdGgpID0+IHtcclxuICAgIGNvbnN0IG1hcHBlZFJlY29yZCA9IGV2YWx1YXRlKHJlY29yZCkoaW5kZXhOb2RlQW5kUGF0aC5pbmRleE5vZGUpO1xyXG4gICAgcmV0dXJuICh7XHJcbiAgICAgIG1hcHBlZFJlY29yZCxcclxuICAgICAgaW5kZXhOb2RlOiBpbmRleE5vZGVBbmRQYXRoLmluZGV4Tm9kZSxcclxuICAgICAgaW5kZXhEaXI6IGluZGV4Tm9kZUFuZFBhdGguaW5kZXhEaXIsXHJcbiAgICAgIGluZGV4U2hhcmRLZXk6IGdldEluZGV4ZWREYXRhS2V5KFxyXG4gICAgICAgIGluZGV4Tm9kZUFuZFBhdGguaW5kZXhOb2RlLFxyXG4gICAgICAgIGluZGV4Tm9kZUFuZFBhdGguaW5kZXhEaXIsXHJcbiAgICAgICAgbWFwcGVkUmVjb3JkLnJlc3VsdCxcclxuICAgICAgKSxcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdldEluZGV4Tm9kZXNUb0FwcGx5ID0gaW5kZXhGaWx0ZXIgPT4gKHQsIGluZGV4ZXMpID0+ICQoaW5kZXhlcywgW1xyXG4gICAgbWFwKG4gPT4gKHtcclxuICAgICAgb2xkOiBldmFsdWF0ZUluZGV4KHQub2xkUmVjb3JkLCBuKSxcclxuICAgICAgbmV3OiBldmFsdWF0ZUluZGV4KHQucmVjb3JkLCBuKSxcclxuICAgIH0pKSxcclxuICAgIGZpbHRlcihpbmRleEZpbHRlciksXHJcbiAgXSk7XHJcblxyXG4gIGNvbnN0IHRvUmVtb3ZlRmlsdGVyID0gKG4sIGlzVW5yZWZlcmVuY2VkKSA9PiBuLm9sZC5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSB0cnVlXHJcbiAgICAgICAgJiYgKG4ubmV3Lm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IGZhbHNlXHJcbiAgICAgICAgICAgIHx8IGlzVW5yZWZlcmVuY2VkKTtcclxuXHJcbiAgY29uc3QgdG9BZGRGaWx0ZXIgPSAobiwgaXNOZXdseVJlZmVyZW5jZWQpID0+IChuLm9sZC5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSBmYWxzZVxyXG4gICAgICAgIHx8IGlzTmV3bHlSZWZlcmVuY2VkKVxyXG4gICAgICAgICYmIG4ubmV3Lm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IHRydWU7XHJcblxyXG4gIGNvbnN0IHRvVXBkYXRlRmlsdGVyID0gbiA9PiBuLm5ldy5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSB0cnVlXHJcbiAgICAgICAgJiYgbi5vbGQubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gdHJ1ZVxyXG4gICAgICAgICYmICFpc0VxdWFsKG4ub2xkLm1hcHBlZFJlY29yZC5yZXN1bHQsXHJcbiAgICAgICAgICBuLm5ldy5tYXBwZWRSZWNvcmQucmVzdWx0KTtcclxuXHJcbiAgY29uc3QgdG9SZW1vdmUgPSBbXTtcclxuICBjb25zdCB0b1dyaXRlID0gW107XHJcblxyXG4gIGZvciAoY29uc3QgdCBvZiB1cGRhdGVUcmFuc2FjdGlvbnMpIHtcclxuICAgIGNvbnN0IGFuY2VzdG9ySWR4cyA9IGdldFJlbGV2YW50QW5jZXN0b3JJbmRleGVzKFxyXG4gICAgICBoaWVyYXJjaHksIHQucmVjb3JkLFxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCByZWZlcmVuY2VDaGFuZ2VzID0gZGlmZlJldmVyc2VSZWZGb3JVcGRhdGUoXHJcbiAgICAgIGhpZXJhcmNoeSwgdC5vbGRSZWNvcmQsIHQucmVjb3JkLFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBvbGQgcmVjb3JkcyB0byByZW1vdmUgKGZpbHRlcmVkIG91dClcclxuICAgIGNvbnN0IGZpbHRlcmVkT3V0X3RvUmVtb3ZlID0gdW5pb24oXHJcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvUmVtb3ZlRmlsdGVyKSh0LCBhbmNlc3RvcklkeHMpLFxyXG4gICAgICAvLyBzdGlsbCByZWZlcmVuY2VkIC0gY2hlY2sgZmlsdGVyXHJcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvUmVtb3ZlRmlsdGVyKSh0LCByZWZlcmVuY2VDaGFuZ2VzLm5vdENoYW5nZWQpLFxyXG4gICAgICAvLyB1biByZWZlcmVuY2VkIC0gcmVtb3ZlIGlmIGluIHRoZXJlIGFscmVhZHlcclxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkobiA9PiB0b1JlbW92ZUZpbHRlcihuLCB0cnVlKSkodCwgcmVmZXJlbmNlQ2hhbmdlcy51blJlZmVyZW5jZWQpLFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBuZXcgcmVjb3JkcyB0byBhZGQgKGZpbHRlcmVkIGluKVxyXG4gICAgY29uc3QgZmlsdGVyZWRJbl90b0FkZCA9IHVuaW9uKFxyXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b0FkZEZpbHRlcikodCwgYW5jZXN0b3JJZHhzKSxcclxuICAgICAgLy8gbmV3bHkgcmVmZXJlbmNlZCAtIGNoZWNrIGZpbHRlclxyXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseShuID0+IHRvQWRkRmlsdGVyKG4sIHRydWUpKSh0LCByZWZlcmVuY2VDaGFuZ2VzLm5ld2x5UmVmZXJlbmNlZCksXHJcbiAgICAgIC8vIHJlZmVyZW5jZSB1bmNoYW5nZWQgLSByZXJ1biBmaWx0ZXIgaW4gY2FzZSBzb21ldGhpbmcgZWxzZSBjaGFuZ2VkXHJcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvQWRkRmlsdGVyKSh0LCByZWZlcmVuY2VDaGFuZ2VzLm5vdENoYW5nZWQpLFxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBjaGFuZ2VkID0gdW5pb24oXHJcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvVXBkYXRlRmlsdGVyKSh0LCBhbmNlc3RvcklkeHMpLFxyXG4gICAgICAvLyBzdGlsbCByZWZlcmVuY2VkIC0gcmVjaGVjayBmaWx0ZXJcclxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodG9VcGRhdGVGaWx0ZXIpKHQsIHJlZmVyZW5jZUNoYW5nZXMubm90Q2hhbmdlZCksXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IHNoYXJkS2V5Q2hhbmdlZCA9ICQoY2hhbmdlZCwgW1xyXG4gICAgICBmaWx0ZXIoYyA9PiBjLm9sZC5pbmRleFNoYXJkS2V5ICE9PSBjLm5ldy5pbmRleFNoYXJkS2V5KSxcclxuICAgIF0pO1xyXG5cclxuICAgIGNvbnN0IGNoYW5nZWRJblNhbWVTaGFyZCA9ICQoc2hhcmRLZXlDaGFuZ2VkLCBbXHJcbiAgICAgIGRpZmZlcmVuY2UoY2hhbmdlZCksXHJcbiAgICBdKTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHJlcyBvZiBzaGFyZEtleUNoYW5nZWQpIHtcclxuICAgICAgcHVsbChyZXMpKGNoYW5nZWQpO1xyXG4gICAgICBmaWx0ZXJlZE91dF90b1JlbW92ZS5wdXNoKHJlcyk7XHJcbiAgICAgIGZpbHRlcmVkSW5fdG9BZGQucHVzaChyZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvUmVtb3ZlLnB1c2goXHJcbiAgICAgICQoZmlsdGVyZWRPdXRfdG9SZW1vdmUsIFtcclxuICAgICAgICBtYXAoaSA9PiBpLm9sZCksXHJcbiAgICAgIF0pLFxyXG4gICAgKTtcclxuXHJcbiAgICB0b1dyaXRlLnB1c2goXHJcbiAgICAgICQoZmlsdGVyZWRJbl90b0FkZCwgW1xyXG4gICAgICAgIG1hcChpID0+IGkubmV3KSxcclxuICAgICAgXSksXHJcbiAgICApO1xyXG5cclxuICAgIHRvV3JpdGUucHVzaChcclxuICAgICAgJChjaGFuZ2VkSW5TYW1lU2hhcmQsIFtcclxuICAgICAgICBtYXAoaSA9PiBpLm5ldyksXHJcbiAgICAgIF0pLFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoe1xyXG4gICAgdG9SZW1vdmU6IGZsYXR0ZW4odG9SZW1vdmUpLFxyXG4gICAgdG9Xcml0ZTogZmxhdHRlbih0b1dyaXRlKSxcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IGdldEJ1aWxkSW5kZXhUcmFuc2FjdGlvbnNCeVNoYXJkID0gKGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKSA9PiB7XHJcbiAgY29uc3QgYnVpbGRUcmFuc2FjdGlvbnMgPSAkKHRyYW5zYWN0aW9ucywgW2ZpbHRlcihpc0J1aWxkSW5kZXgpXSk7XHJcbiAgaWYgKCFpc05vbkVtcHR5QXJyYXkoYnVpbGRUcmFuc2FjdGlvbnMpKSByZXR1cm4gW107XHJcbiAgY29uc3QgaW5kZXhOb2RlID0gdHJhbnNhY3Rpb25zLmluZGV4Tm9kZTtcclxuXHJcbiAgY29uc3QgZ2V0SW5kZXhEaXJzID0gKHQpID0+IHtcclxuICAgIGlmIChpc0dsb2JhbEluZGV4KGluZGV4Tm9kZSkpIHtcclxuICAgICAgcmV0dXJuIFtpbmRleE5vZGUubm9kZUtleSgpXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNSZWZlcmVuY2VJbmRleChpbmRleE5vZGUpKSB7XHJcbiAgICAgIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JLZXkoaGllcmFyY2h5KSh0LnJlY29yZC5rZXkpO1xyXG4gICAgICBjb25zdCByZWZGaWVsZHMgPSAkKHJlY29yZE5vZGUuZmllbGRzLCBbXHJcbiAgICAgICAgZmlsdGVyKGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4KGluZGV4Tm9kZSkpLFxyXG4gICAgICBdKTtcclxuICAgICAgY29uc3QgaW5kZXhEaXJzID0gW107XHJcbiAgICAgIGZvciAoY29uc3QgcmVmRmllbGQgb2YgcmVmRmllbGRzKSB7XHJcbiAgICAgICAgY29uc3QgcmVmVmFsdWUgPSB0LnJlY29yZFtyZWZGaWVsZC5uYW1lXTtcclxuICAgICAgICBpZiAoaXNTb21ldGhpbmcocmVmVmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAmJiBpc05vbkVtcHR5U3RyaW5nKHJlZlZhbHVlLmtleSkpIHtcclxuICAgICAgICAgIGNvbnN0IGluZGV4RGlyID0gam9pbktleShcclxuICAgICAgICAgICAgZ2V0UmVjb3JkSW5mbyhoaWVyYXJjaHksIHJlZlZhbHVlLmtleSkuZGlyLFxyXG4gICAgICAgICAgICBpbmRleE5vZGUubmFtZSxcclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgaWYgKCFpbmNsdWRlcyhpbmRleERpcikoaW5kZXhEaXJzKSkgeyBpbmRleERpcnMucHVzaChpbmRleERpcik7IH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGluZGV4RGlycztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpbmRleEtleSA9IGpvaW5LZXkoXHJcbiAgICAgIGdldEFjdHVhbEtleU9mUGFyZW50KFxyXG4gICAgICAgIGluZGV4Tm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksXHJcbiAgICAgICAgdC5yZWNvcmQua2V5LFxyXG4gICAgICApLFxyXG4gICAgICBpbmRleE5vZGUubmFtZSxcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIFtnZXRJbmRleERpcihoaWVyYXJjaHksIGluZGV4S2V5KV07XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuICQoYnVpbGRUcmFuc2FjdGlvbnMsIFtcclxuICAgIG1hcCgodCkgPT4ge1xyXG4gICAgICBjb25zdCBtYXBwZWRSZWNvcmQgPSBldmFsdWF0ZSh0LnJlY29yZCkoaW5kZXhOb2RlKTtcclxuICAgICAgaWYgKCFtYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyKSByZXR1cm4gbnVsbDtcclxuICAgICAgY29uc3QgaW5kZXhEaXJzID0gZ2V0SW5kZXhEaXJzKHQpO1xyXG4gICAgICByZXR1cm4gJChpbmRleERpcnMsIFtcclxuICAgICAgICBtYXAoaW5kZXhEaXIgPT4gKHtcclxuICAgICAgICAgIG1hcHBlZFJlY29yZCxcclxuICAgICAgICAgIGluZGV4Tm9kZSxcclxuICAgICAgICAgIGluZGV4RGlyLFxyXG4gICAgICAgICAgaW5kZXhTaGFyZEtleTogZ2V0SW5kZXhlZERhdGFLZXkoXHJcbiAgICAgICAgICAgIGluZGV4Tm9kZSxcclxuICAgICAgICAgICAgaW5kZXhEaXIsXHJcbiAgICAgICAgICAgIG1hcHBlZFJlY29yZC5yZXN1bHQsXHJcbiAgICAgICAgICApLFxyXG4gICAgICAgIH0pKSxcclxuICAgICAgXSk7XHJcbiAgICB9KSxcclxuICAgIGZsYXR0ZW4sXHJcbiAgICBmaWx0ZXIoaXNTb21ldGhpbmcpLFxyXG4gIF0pO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0X0NyZWF0ZV9EZWxldGVfVHJhbnNhY3Rpb25zQnlTaGFyZCA9IHByZWQgPT4gKGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKSA9PiB7XHJcbiAgY29uc3QgY3JlYXRlVHJhbnNhY3Rpb25zID0gJCh0cmFuc2FjdGlvbnMsIFtmaWx0ZXIocHJlZCldKTtcclxuXHJcbiAgY29uc3QgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkgPSAodCwgaW5kZXhlcykgPT4gJChpbmRleGVzLCBbXHJcbiAgICBtYXAoKG4pID0+IHtcclxuICAgICAgY29uc3QgbWFwcGVkUmVjb3JkID0gZXZhbHVhdGUodC5yZWNvcmQpKG4uaW5kZXhOb2RlKTtcclxuICAgICAgcmV0dXJuICh7XHJcbiAgICAgICAgbWFwcGVkUmVjb3JkLFxyXG4gICAgICAgIGluZGV4Tm9kZTogbi5pbmRleE5vZGUsXHJcbiAgICAgICAgaW5kZXhEaXI6IG4uaW5kZXhEaXIsXHJcbiAgICAgICAgaW5kZXhTaGFyZEtleTogZ2V0SW5kZXhlZERhdGFLZXkoXHJcbiAgICAgICAgICBuLmluZGV4Tm9kZSxcclxuICAgICAgICAgIG4uaW5kZXhEaXIsXHJcbiAgICAgICAgICBtYXBwZWRSZWNvcmQucmVzdWx0LFxyXG4gICAgICAgICksXHJcbiAgICAgIH0pO1xyXG4gICAgfSksXHJcbiAgICBmaWx0ZXIobiA9PiBuLm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIpLFxyXG4gIF0pO1xyXG5cclxuICBjb25zdCBhbGxUb0FwcGx5ID0gW107XHJcblxyXG4gIGZvciAoY29uc3QgdCBvZiBjcmVhdGVUcmFuc2FjdGlvbnMpIHtcclxuICAgIGNvbnN0IGFuY2VzdG9ySWR4cyA9IGdldFJlbGV2YW50QW5jZXN0b3JJbmRleGVzKGhpZXJhcmNoeSwgdC5yZWNvcmQpO1xyXG4gICAgY29uc3QgcmV2ZXJzZVJlZiA9IGdldFJlbGV2YW50UmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMoaGllcmFyY2h5LCB0LnJlY29yZCk7XHJcblxyXG4gICAgYWxsVG9BcHBseS5wdXNoKFxyXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0LCBhbmNlc3RvcklkeHMpLFxyXG4gICAgKTtcclxuICAgIGFsbFRvQXBwbHkucHVzaChcclxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodCwgcmV2ZXJzZVJlZiksXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZsYXR0ZW4oYWxsVG9BcHBseSk7XHJcbn07XHJcblxyXG5jb25zdCBnZXREZWxldGVUcmFuc2FjdGlvbnNCeVNoYXJkID0gZ2V0X0NyZWF0ZV9EZWxldGVfVHJhbnNhY3Rpb25zQnlTaGFyZChpc0RlbGV0ZSk7XHJcblxyXG5jb25zdCBnZXRDcmVhdGVUcmFuc2FjdGlvbnNCeVNoYXJkID0gZ2V0X0NyZWF0ZV9EZWxldGVfVHJhbnNhY3Rpb25zQnlTaGFyZChpc0NyZWF0ZSk7XHJcblxyXG5jb25zdCBkaWZmUmV2ZXJzZVJlZkZvclVwZGF0ZSA9IChhcHBIaWVyYXJjaHksIG9sZFJlY29yZCwgbmV3UmVjb3JkKSA9PiB7XHJcbiAgY29uc3Qgb2xkSW5kZXhlcyA9IGdldFJlbGV2YW50UmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMoXHJcbiAgICBhcHBIaWVyYXJjaHksIG9sZFJlY29yZCxcclxuICApO1xyXG4gIGNvbnN0IG5ld0luZGV4ZXMgPSBnZXRSZWxldmFudFJldmVyc2VSZWZlcmVuY2VJbmRleGVzKFxyXG4gICAgYXBwSGllcmFyY2h5LCBuZXdSZWNvcmQsXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgdW5SZWZlcmVuY2VkID0gZGlmZmVyZW5jZUJ5KFxyXG4gICAgaSA9PiBpLmluZGV4RGlyLFxyXG4gICAgb2xkSW5kZXhlcywgbmV3SW5kZXhlcyxcclxuICApO1xyXG5cclxuICBjb25zdCBuZXdseVJlZmVyZW5jZWQgPSBkaWZmZXJlbmNlQnkoXHJcbiAgICBpID0+IGkuaW5kZXhEaXIsXHJcbiAgICBuZXdJbmRleGVzLCBvbGRJbmRleGVzLFxyXG4gICk7XHJcblxyXG4gIGNvbnN0IG5vdENoYW5nZWQgPSBpbnRlcnNlY3Rpb25CeShcclxuICAgIGkgPT4gaS5pbmRleERpcixcclxuICAgIG5ld0luZGV4ZXMsIG9sZEluZGV4ZXMsXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHVuUmVmZXJlbmNlZCxcclxuICAgIG5ld2x5UmVmZXJlbmNlZCxcclxuICAgIG5vdENoYW5nZWQsXHJcbiAgfTtcclxufTtcclxuIiwiaW1wb3J0IHsgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHJldHJpZXZlIH0gZnJvbSAnLi9yZXRyaWV2ZSc7XG5pbXBvcnQgeyBleGVjdXRlVHJhbnNhY3Rpb25zIH0gZnJvbSAnLi9leGVjdXRlJztcbmltcG9ydCB7XG4gICQsIGpvaW5LZXksIGdldExvY2ssIGlzTm9sb2NrLCByZWxlYXNlTG9jayxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIExPQ0tfRklMRV9LRVksIFRSQU5TQUNUSU9OU19GT0xERVIsXG4gIHRpbWVvdXRNaWxsaXNlY29uZHMsIGdldFRyYW5zYWN0aW9uSWQsXG4gIG1heExvY2tSZXRyaWVzLFxufSBmcm9tICcuL3RyYW5zYWN0aW9uc0NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBjbGVhbnVwID0gYXN5bmMgKGFwcCkgPT4ge1xuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0VHJhbnNhY3Rpb25Mb2NrKGFwcCk7XG4gIGlmIChpc05vbG9jayhsb2NrKSkgcmV0dXJuO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgdHJhbnNhY3Rpb25zID0gYXdhaXQgcmV0cmlldmUoYXBwKTtcbiAgICBpZiAodHJhbnNhY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IGV4ZWN1dGVUcmFuc2FjdGlvbnMoYXBwKSh0cmFuc2FjdGlvbnMpO1xuXG4gICAgICBjb25zdCBmb2xkZXIgPSB0cmFuc2FjdGlvbnMuZm9sZGVyS2V5XG4gICAgICAgID8gdHJhbnNhY3Rpb25zLmZvbGRlcktleVxuICAgICAgICA6IFRSQU5TQUNUSU9OU19GT0xERVI7XG5cbiAgICAgIGNvbnN0IGRlbGV0ZUZpbGVzID0gJCh0cmFuc2FjdGlvbnMsIFtcbiAgICAgICAgbWFwKHQgPT4gam9pbktleShcbiAgICAgICAgICBmb2xkZXIsXG4gICAgICAgICAgZ2V0VHJhbnNhY3Rpb25JZChcbiAgICAgICAgICAgIHQucmVjb3JkSWQsIHQudHJhbnNhY3Rpb25UeXBlLFxuICAgICAgICAgICAgdC51bmlxdWVJZCxcbiAgICAgICAgICApLFxuICAgICAgICApKSxcbiAgICAgICAgbWFwKGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZSksXG4gICAgICBdKTtcblxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoZGVsZXRlRmlsZXMpO1xuICAgIH1cbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xuICB9XG59O1xuXG5jb25zdCBnZXRUcmFuc2FjdGlvbkxvY2sgPSBhc3luYyBhcHAgPT4gYXdhaXQgZ2V0TG9jayhcbiAgYXBwLCBMT0NLX0ZJTEVfS0VZLFxuICB0aW1lb3V0TWlsbGlzZWNvbmRzLCBtYXhMb2NrUmV0cmllcyxcbik7XG4iLCJpbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBjb25maWdGb2xkZXIsIGFwcERlZmluaXRpb25GaWxlLCAkIH0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgVFJBTlNBQ1RJT05TX0ZPTERFUiB9IGZyb20gJy4uL3RyYW5zYWN0aW9ucy90cmFuc2FjdGlvbnNDb21tb24nO1xyXG5pbXBvcnQgeyBBVVRIX0ZPTERFUiwgVVNFUlNfTElTVF9GSUxFLCBBQ0NFU1NfTEVWRUxTX0ZJTEUgfSBmcm9tICcuLi9hdXRoQXBpL2F1dGhDb21tb24nO1xyXG5pbXBvcnQgeyBpbml0aWFsaXNlUm9vdENvbGxlY3Rpb25zIH0gZnJvbSAnLi4vY29sbGVjdGlvbkFwaS9pbml0aWFsaXNlJztcclxuaW1wb3J0IHsgaW5pdGlhbGlzZUluZGV4IH0gZnJvbSAnLi4vaW5kZXhpbmcvaW5pdGlhbGlzZUluZGV4JztcclxuaW1wb3J0IHsgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LCBpc0dsb2JhbEluZGV4LCBpc1NpbmdsZVJlY29yZCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7IF9nZXROZXcgfSBmcm9tIFwiLi4vcmVjb3JkQXBpL2dldE5ld1wiO1xyXG5pbXBvcnQgeyBfc2F2ZSB9IGZyb20gXCIuLi9yZWNvcmRBcGkvc2F2ZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRpYWxpc2VEYXRhID0gYXN5bmMgKGRhdGFzdG9yZSwgYXBwbGljYXRpb25EZWZpbml0aW9uLCBhY2Nlc3NMZXZlbHMpID0+IHtcclxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKGNvbmZpZ0ZvbGRlcik7XHJcbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oYXBwRGVmaW5pdGlvbkZpbGUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbik7XHJcblxyXG4gIGF3YWl0IGluaXRpYWxpc2VSb290Q29sbGVjdGlvbnMoZGF0YXN0b3JlLCBhcHBsaWNhdGlvbkRlZmluaXRpb24uaGllcmFyY2h5KTtcclxuICBhd2FpdCBpbml0aWFsaXNlUm9vdEluZGV4ZXMoZGF0YXN0b3JlLCBhcHBsaWNhdGlvbkRlZmluaXRpb24uaGllcmFyY2h5KTtcclxuXHJcbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihUUkFOU0FDVElPTlNfRk9MREVSKTtcclxuXHJcbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihBVVRIX0ZPTERFUik7XHJcblxyXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKFVTRVJTX0xJU1RfRklMRSwgW10pO1xyXG5cclxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlSnNvbihcclxuICAgIEFDQ0VTU19MRVZFTFNfRklMRSwgXHJcbiAgICBhY2Nlc3NMZXZlbHMgPyBhY2Nlc3NMZXZlbHMgOiB7IHZlcnNpb246IDAsIGxldmVsczogW10gfSk7XHJcblxyXG4gIGF3YWl0IGluaXRpYWxpc2VSb290U2luZ2xlUmVjb3JkcyhkYXRhc3RvcmUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbi5oaWVyYXJjaHkpO1xyXG59O1xyXG5cclxuY29uc3QgaW5pdGlhbGlzZVJvb3RJbmRleGVzID0gYXN5bmMgKGRhdGFzdG9yZSwgaGllcmFyY2h5KSA9PiB7XHJcbiAgY29uc3QgZmxhdGhpZXJhcmNoeSA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShoaWVyYXJjaHkpO1xyXG4gIGNvbnN0IGdsb2JhbEluZGV4ZXMgPSAkKGZsYXRoaWVyYXJjaHksIFtcclxuICAgIGZpbHRlcihpc0dsb2JhbEluZGV4KSxcclxuICBdKTtcclxuXHJcbiAgZm9yIChjb25zdCBpbmRleCBvZiBnbG9iYWxJbmRleGVzKSB7XHJcbiAgICBpZiAoIWF3YWl0IGRhdGFzdG9yZS5leGlzdHMoaW5kZXgubm9kZUtleSgpKSkgeyBcclxuICAgICAgYXdhaXQgaW5pdGlhbGlzZUluZGV4KGRhdGFzdG9yZSwgJycsIGluZGV4KTsgXHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgaW5pdGlhbGlzZVJvb3RTaW5nbGVSZWNvcmRzID0gYXN5bmMgKGRhdGFzdG9yZSwgaGllcmFyY2h5KSA9PiB7XHJcbiAgY29uc3QgYXBwID0geyBcclxuICAgIHB1Ymxpc2g6KCk9Pnt9LFxyXG4gICAgY2xlYW51cFRyYW5zYWN0aW9uczogKCkgPT4ge30sXHJcbiAgICBkYXRhc3RvcmUsIGhpZXJhcmNoeSBcclxuICB9O1xyXG5cclxuICBjb25zdCBmbGF0aGllcmFyY2h5ID0gZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGhpZXJhcmNoeSk7XHJcbiAgY29uc3Qgc2luZ2xlUmVjb3JkcyA9ICQoZmxhdGhpZXJhcmNoeSwgW1xyXG4gICAgZmlsdGVyKGlzU2luZ2xlUmVjb3JkKSxcclxuICBdKTtcclxuXHJcbiAgZm9yIChsZXQgcmVjb3JkIG9mIHNpbmdsZVJlY29yZHMpIHtcclxuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIocmVjb3JkLm5vZGVLZXkoKSk7XHJcbiAgICBjb25zdCByZXN1bHQgPSBfZ2V0TmV3KHJlY29yZCwgXCJcIik7XHJcbiAgICBhd2FpdCBfc2F2ZShhcHAscmVzdWx0KTtcclxuICB9XHJcbn07XHJcbiIsImltcG9ydCB7IGlzTm90aGluZyB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBnZXREYXRhYmFzZU1hbmFnZXIgPSBkYXRhYmFzZU1hbmFnZXIgPT4gKHtcbiAgY3JlYXRlRW1wdHlNYXN0ZXJEYjogY3JlYXRlRW1wdHlNYXN0ZXJEYihkYXRhYmFzZU1hbmFnZXIpLFxuICBjcmVhdGVFbXB0eUluc3RhbmNlRGI6IGNyZWF0ZUVtcHR5SW5zdGFuY2VEYihkYXRhYmFzZU1hbmFnZXIpLFxuICBnZXRJbnN0YW5jZURiUm9vdENvbmZpZzogZGF0YWJhc2VNYW5hZ2VyLmdldEluc3RhbmNlRGJSb290Q29uZmlnLFxuICBtYXN0ZXJEYXRhc3RvcmVDb25maWc6IGdldE1hc3RlckRhdGFzdG9yZUNvbmZpZyhkYXRhYmFzZU1hbmFnZXIpLFxuICBnZXRJbnN0YW5jZURhdGFzdG9yZUNvbmZpZzogZ2V0SW5zdGFuY2VEYXRhc3RvcmVDb25maWcoZGF0YWJhc2VNYW5hZ2VyKSxcbn0pO1xuXG5jb25zdCBnZXRNYXN0ZXJEYXRhc3RvcmVDb25maWcgPSBkYXRhYmFzZU1hbmFnZXIgPT4gZGF0YWJhc2VNYW5hZ2VyLmdldERhdGFzdG9yZUNvbmZpZygnbWFzdGVyJyk7XG5cbmNvbnN0IGdldEluc3RhbmNlRGF0YXN0b3JlQ29uZmlnID0gZGF0YWJhc2VNYW5hZ2VyID0+IChhcHBsaWNhdGlvbklkLCBpbnN0YW5jZUlkKSA9PiBkYXRhYmFzZU1hbmFnZXIuZ2V0RGF0YXN0b3JlQ29uZmlnKFxuICBhcHBsaWNhdGlvbklkLCBpbnN0YW5jZUlkLFxuKTtcblxuY29uc3QgY3JlYXRlRW1wdHlNYXN0ZXJEYiA9IGRhdGFiYXNlTWFuYWdlciA9PiBhc3luYyAoKSA9PiBhd2FpdCBkYXRhYmFzZU1hbmFnZXIuY3JlYXRlRW1wdHlEYignbWFzdGVyJyk7XG5cbmNvbnN0IGNyZWF0ZUVtcHR5SW5zdGFuY2VEYiA9IGRhdGFiYXNlTWFuYWdlciA9PiBhc3luYyAoYXBwbGljYXRpb25JZCwgaW5zdGFuY2VJZCkgPT4ge1xuICBpZiAoaXNOb3RoaW5nKGFwcGxpY2F0aW9uSWQpKSB7IHRocm93IG5ldyBFcnJvcignQ3JlYXRlRGI6IGFwcGxpY2F0aW9uIGlkIG5vdCBzdXBwbGllZCcpOyB9XG4gIGlmIChpc05vdGhpbmcoaW5zdGFuY2VJZCkpIHsgdGhyb3cgbmV3IEVycm9yKCdDcmVhdGVEYjogaW5zdGFuY2UgaWQgbm90IHN1cHBsaWVkJyk7IH1cblxuICByZXR1cm4gYXdhaXQgZGF0YWJhc2VNYW5hZ2VyLmNyZWF0ZUVtcHR5RGIoXG4gICAgYXBwbGljYXRpb25JZCxcbiAgICBpbnN0YW5jZUlkLFxuICApO1xufTtcbiIsImltcG9ydCBnZXRSZWNvcmRBcGkgZnJvbSBcIi4vcmVjb3JkQXBpXCI7XG5pbXBvcnQgZ2V0Q29sbGVjdGlvbkFwaSBmcm9tIFwiLi9jb2xsZWN0aW9uQXBpXCI7XG5pbXBvcnQgZ2V0SW5kZXhBcGkgZnJvbSBcIi4vaW5kZXhBcGlcIjtcbmltcG9ydCBnZXRUZW1wbGF0ZUFwaSBmcm9tIFwiLi90ZW1wbGF0ZUFwaVwiO1xuaW1wb3J0IGdldEF1dGhBcGkgZnJvbSBcIi4vYXV0aEFwaVwiO1xuaW1wb3J0IGdldEFjdGlvbnNBcGkgZnJvbSBcIi4vYWN0aW9uc0FwaVwiO1xuaW1wb3J0IHtzZXR1cERhdGFzdG9yZSwgY3JlYXRlRXZlbnRBZ2dyZWdhdG9yfSBmcm9tIFwiLi9hcHBJbml0aWFsaXNlXCI7XG5pbXBvcnQge2luaXRpYWxpc2VBY3Rpb25zfSBmcm9tIFwiLi9hY3Rpb25zQXBpL2luaXRpYWxpc2VcIlxuaW1wb3J0IHtpc1NvbWV0aGluZ30gZnJvbSBcIi4vY29tbW9uXCI7XG5pbXBvcnQge2NsZWFudXB9IGZyb20gXCIuL3RyYW5zYWN0aW9ucy9jbGVhbnVwXCI7XG5pbXBvcnQge2dlbmVyYXRlRnVsbFBlcm1pc3Npb25zfSBmcm9tIFwiLi9hdXRoQXBpL2dlbmVyYXRlRnVsbFBlcm1pc3Npb25zXCI7XG5pbXBvcnQge2dldEFwcGxpY2F0aW9uRGVmaW5pdGlvbn0gZnJvbSBcIi4vdGVtcGxhdGVBcGkvZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uXCI7XG5pbXBvcnQgY29tbW9uIGZyb20gXCIuL2NvbW1vblwiO1xuaW1wb3J0IHtnZXRCZWhhdmlvdXJTb3VyY2VzfSBmcm9tIFwiLi90ZW1wbGF0ZUFwaS9nZXRCZWhhdmlvdXJTb3VyY2VzXCI7XG5pbXBvcnQgaGllcmFyY2h5IGZyb20gXCIuL3RlbXBsYXRlQXBpL2hpZXJhcmNoeVwiO1xuXG5leHBvcnQgY29uc3QgZ2V0QXBwQXBpcyA9IGFzeW5jIChzdG9yZSwgYmVoYXZpb3VyU291cmNlcyA9IG51bGwsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhbnVwVHJhbnNhY3Rpb25zID0gbnVsbCwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEVwb2NoVGltZSA9IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyeXB0byA9IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcERlZmluaXRpb24gPSBudWxsKSA9PiB7XG5cbiAgICBzdG9yZSA9IHNldHVwRGF0YXN0b3JlKHN0b3JlKTtcblxuICAgIGlmKCFhcHBEZWZpbml0aW9uKVxuICAgICAgICBhcHBEZWZpbml0aW9uID0gYXdhaXQgZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uKHN0b3JlKSgpO1xuXG4gICAgaWYoIWJlaGF2aW91clNvdXJjZXMpXG4gICAgICAgIGJlaGF2aW91clNvdXJjZXMgPSBhd2FpdCBnZXRCZWhhdmlvdXJTb3VyY2VzKHN0b3JlKTtcblxuICAgIGNvbnN0IGV2ZW50QWdncmVnYXRvciA9IGNyZWF0ZUV2ZW50QWdncmVnYXRvcigpO1xuXG4gICAgY29uc3QgYXBwID0ge1xuICAgICAgICBkYXRhc3RvcmU6c3RvcmUsXG4gICAgICAgIGNyeXB0byxcbiAgICAgICAgcHVibGlzaDpldmVudEFnZ3JlZ2F0b3IucHVibGlzaCxcbiAgICAgICAgaGllcmFyY2h5OmFwcERlZmluaXRpb24uaGllcmFyY2h5LFxuICAgICAgICBhY3Rpb25zOmFwcERlZmluaXRpb24uYWN0aW9uc1xuICAgIH07XG5cbiAgICBjb25zdCB0ZW1wbGF0ZUFwaSA9IGdldFRlbXBsYXRlQXBpKGFwcCk7ICAgIFxuXG4gICAgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMgPSBpc1NvbWV0aGluZyhjbGVhbnVwVHJhbnNhY3Rpb25zKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gY2xlYW51cFRyYW5zYWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBhc3luYyAoKSA9PiBhd2FpdCBjbGVhbnVwKGFwcCk7XG5cbiAgICBhcHAuZ2V0RXBvY2hUaW1lID0gaXNTb21ldGhpbmcoZ2V0RXBvY2hUaW1lKVxuICAgICAgICAgICAgICAgICAgICAgICA/IGdldEVwb2NoVGltZVxuICAgICAgICAgICAgICAgICAgICAgICA6IGFzeW5jICgpID0+IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG5cbiAgICBjb25zdCByZWNvcmRBcGkgPSBnZXRSZWNvcmRBcGkoYXBwKTtcbiAgICBjb25zdCBjb2xsZWN0aW9uQXBpID0gZ2V0Q29sbGVjdGlvbkFwaShhcHApO1xuICAgIGNvbnN0IGluZGV4QXBpID0gZ2V0SW5kZXhBcGkoYXBwKTtcbiAgICBjb25zdCBhdXRoQXBpID0gZ2V0QXV0aEFwaShhcHApO1xuICAgIGNvbnN0IGFjdGlvbnNBcGkgPSBnZXRBY3Rpb25zQXBpKGFwcCk7XG5cbiAgICBjb25zdCBhdXRoZW50aWNhdGVBcyA9IGFzeW5jICh1c2VybmFtZSwgcGFzc3dvcmQpID0+IHtcbiAgICAgICAgYXBwLnVzZXIgPSBhd2FpdCBhdXRoQXBpLmF1dGhlbnRpY2F0ZSh1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgIH07XG5cbiAgICBjb25zdCB3aXRoRnVsbEFjY2VzcyA9ICgpID0+IFxuICAgICAgICB1c2VyV2l0aEZ1bGxBY2Nlc3MoYXBwKTsgICAgXG5cbiAgICBjb25zdCBhc1VzZXIgPSAodXNlcikgPT4ge1xuICAgICAgICBhcHAudXNlciA9IHVzZXJcbiAgICB9OyAgICBcblxuICAgIGxldCBhcGlzID0ge1xuICAgICAgICByZWNvcmRBcGksIFxuICAgICAgICB0ZW1wbGF0ZUFwaSxcbiAgICAgICAgY29sbGVjdGlvbkFwaSxcbiAgICAgICAgaW5kZXhBcGksXG4gICAgICAgIGF1dGhBcGksXG4gICAgICAgIGFjdGlvbnNBcGksXG4gICAgICAgIHN1YnNjcmliZTogZXZlbnRBZ2dyZWdhdG9yLnN1YnNjcmliZSxcbiAgICAgICAgYXV0aGVudGljYXRlQXMsXG4gICAgICAgIHdpdGhGdWxsQWNjZXNzLFxuICAgICAgICBhc1VzZXJcbiAgICB9O1xuXG4gICAgYXBpcy5hY3Rpb25zID0gaW5pdGlhbGlzZUFjdGlvbnMoXG4gICAgICAgIGV2ZW50QWdncmVnYXRvci5zdWJzY3JpYmUsXG4gICAgICAgIGJlaGF2aW91clNvdXJjZXMsXG4gICAgICAgIGFwcERlZmluaXRpb24uYWN0aW9ucyxcbiAgICAgICAgYXBwRGVmaW5pdGlvbi50cmlnZ2VycyxcbiAgICAgICAgYXBpcyk7XG5cblxuICAgIHJldHVybiBhcGlzO1xufTtcblxuZXhwb3J0IGNvbnN0IHVzZXJXaXRoRnVsbEFjY2VzcyA9IChhcHApID0+IHtcbiAgICBhcHAudXNlciA9IHtcbiAgICAgICAgbmFtZTogXCJhcHBcIixcbiAgICAgICAgcGVybWlzc2lvbnMgOiBnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucyhhcHApLFxuICAgICAgICBpc1VzZXI6ZmFsc2UsXG4gICAgICAgIHRlbXA6ZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIGFwcC51c2VyO1xufTtcblxuZXhwb3J0IHtldmVudHMsIGV2ZW50c0xpc3R9IGZyb20gXCIuL2NvbW1vbi9ldmVudHNcIjtcbmV4cG9ydCB7Z2V0VGVtcGxhdGVBcGl9IGZyb20gXCIuL3RlbXBsYXRlQXBpXCI7XG5leHBvcnQge2dldFJlY29yZEFwaX0gZnJvbSBcIi4vcmVjb3JkQXBpXCI7XG5leHBvcnQge2dldENvbGxlY3Rpb25BcGl9IGZyb20gXCIuL2NvbGxlY3Rpb25BcGlcIjtcbmV4cG9ydCB7Z2V0QXV0aEFwaX0gZnJvbSBcIi4vYXV0aEFwaVwiO1xuZXhwb3J0IHtnZXRJbmRleEFwaX0gZnJvbSBcIi4vaW5kZXhBcGlcIjtcbmV4cG9ydCB7c2V0dXBEYXRhc3RvcmV9IGZyb20gXCIuL2FwcEluaXRpYWxpc2VcIjtcbmV4cG9ydCB7Z2V0QWN0aW9uc0FwaX0gZnJvbSBcIi4vYWN0aW9uc0FwaVwiO1xuZXhwb3J0IHtpbml0aWFsaXNlRGF0YX0gZnJvbSBcIi4vYXBwSW5pdGlhbGlzZS9pbml0aWFsaXNlRGF0YVwiO1xuZXhwb3J0IHtnZXREYXRhYmFzZU1hbmFnZXJ9IGZyb20gXCIuL2FwcEluaXRpYWxpc2UvZGF0YWJhc2VNYW5hZ2VyXCI7XG5leHBvcnQge2hpZXJhcmNoeX07XG5leHBvcnQge2NvbW1vbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldEFwcEFwaXM7Il0sIm5hbWVzIjpbInVuaW9uIiwicmVkdWNlIiwiZ2VuZXJhdGUiLCJpc1VuZGVmaW5lZCIsImNsb25lRGVlcCIsInNwbGl0IiwiZmxvdyIsInRyaW0iLCJyZXBsYWNlIiwiaXNBcnJheSIsImZpbHRlciIsImlzTnVsbCIsImpvaW4iLCJkcm9wUmlnaHQiLCJ0YWtlUmlnaHQiLCJoZWFkIiwiaXNOYU4iLCJpc0VtcHR5IiwiY29uc3RhbnQiLCJzb21lIiwiaXNTdHJpbmciLCJ0YWlsIiwiaW5jbHVkZXMiLCJzdGFydHNXaXRoIiwiZmluZEluZGV4IiwiaXNJbnRlZ2VyIiwiaXNEYXRlIiwidG9OdW1iZXIiLCJtYXAiLCJjb21waWxlRXhwcmVzc2lvbiIsImNvbXBpbGVDb2RlIiwia2V5cyIsImlzRnVuY3Rpb24iLCJjb3VudEJ5IiwibGFzdCIsImZpbmQiLCJ0YWtlIiwiZmlyc3QiLCJpbnRlcnNlY3Rpb24iLCJoYXMiLCJtZXJnZSIsIm1hcFZhbHVlcyIsIm1ha2VydWxlIiwiaXNCb29sZWFuIiwib3B0aW9ucyIsInR5cGVDb25zdHJhaW50cyIsImlzTnVtYmVyIiwiaXNPYmplY3RMaWtlIiwiYXNzaWduIiwiYWxsIiwiZ2V0RGVmYXVsdE9wdGlvbnMiLCJ2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyIsImlzT2JqZWN0IiwiY2xvbmUiLCJ2YWx1ZXMiLCJrZXlCeSIsIm9yZGVyQnkiLCJmbGF0dGVuIiwiY29uY2F0IiwicmV2ZXJzZSIsImdsb2JhbCIsImJhc2U2NC5mcm9tQnl0ZUFycmF5IiwiaWVlZTc1NC5yZWFkIiwiaWVlZTc1NC53cml0ZSIsImJhc2U2NC50b0J5dGVBcnJheSIsInJlYWQiLCJkaWZmZXJlbmNlIiwiQnVmZmVyIiwicmVhZEluZGV4IiwiZWFjaCIsIl8iLCJkZWxldGVSZWNvcmQiLCJ2YWxpZGF0ZSIsIm1heCIsImRlZmF1bHRDYXNlIiwiZXZlcnkiLCJ1bmlxQnkiLCJhcGkiLCJjcmVhdGVUZW1wb3JhcnlBY2Nlc3MiLCJjcmVhdGVVc2VyIiwidW5pcVdpdGgiLCJzZXRVc2VyQWNjZXNzTGV2ZWxzIiwiZXhlY3V0ZUFjdGlvbiIsImNDb2RlIiwiY0V4cCIsImdyb3VwQnkiLCJpc0VxdWFsIiwicHVsbCIsImRpZmZlcmVuY2VCeSIsImludGVyc2VjdGlvbkJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUVBLE1BQU0sVUFBVSxHQUFHLEtBQUssSUFBSUEsUUFBSyxDQUFDLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUvRSxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFcEMsTUFBTSxPQUFPLEdBQUc7RUFDZCxTQUFTLEVBQUU7SUFDVCxJQUFJLEVBQUUsVUFBVSxDQUFDO01BQ2YsV0FBVztNQUNYLGlCQUFpQjtNQUNqQixpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JCLE1BQU0sRUFBRSxNQUFNLEVBQUU7SUFDaEIsVUFBVSxFQUFFLE1BQU0sRUFBRTtJQUNwQixNQUFNLEVBQUUsTUFBTSxFQUFFO0lBQ2hCLElBQUksRUFBRSxNQUFNLEVBQUU7SUFDZCxRQUFRLEVBQUUsTUFBTSxFQUFFO0lBQ2xCLFVBQVUsRUFBRSxNQUFNLEVBQUU7SUFDcEIsWUFBWSxFQUFFLE1BQU0sRUFBRTtHQUN2QjtFQUNELFFBQVEsRUFBRTtJQUNSLFVBQVUsRUFBRSxNQUFNLEVBQUU7SUFDcEIsU0FBUyxFQUFFLE1BQU0sRUFBRTtJQUNuQixNQUFNLEVBQUUsTUFBTSxFQUFFO0lBQ2hCLFVBQVUsRUFBRSxNQUFNLEVBQUU7R0FDckI7RUFDRCxhQUFhLEVBQUU7SUFDYixxQkFBcUIsRUFBRSxNQUFNLEVBQUU7SUFD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RyxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFDOzs7RUFHdEUsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksRUFBQzs7O0VBR3pDLENBQUMsR0FBRyxZQUFZLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBRzs7RUFFcEMsSUFBSSxDQUFDLEdBQUcsRUFBQzs7RUFFVCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUN4QyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUM7SUFDbEssR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLEtBQUk7SUFDN0IsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEtBQUk7SUFDNUIsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUk7R0FDdEI7O0VBRUQsSUFBSSxZQUFZLEtBQUssQ0FBQyxFQUFFO0lBQ3RCLEdBQUcsR0FBRyxDQUFDLFNB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TSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUM7SUFDMUIsTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFDO0lBQ25DLE1BQU0sSUFBSSxLQUFJO0dBQ2YsTUFBTSxJQUFJLFVBQVUsS0FBSyxDQUFDLEVBQUU7SUFDM0IsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBQztJQUM5QyxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUM7SUFDM0IsTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFDO0lBQ25DLE1BQU0sSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksRUFBQztJQUNuQyxNQUFNLElBQUksSUFBRztHQUNkOztFQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFDOztFQUVsQixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0NBQ3RCOztBQzVHTSxTQUFTLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0VBQ3hELElBQUksQ0FBQyxFQUFFLEVBQUM7RUFDUixJQUFJLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxFQUFDO0VBQ2hDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFDO0VBQzFCLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxFQUFDO0VBQ3JCLElBQUksS0FBSyxHQUFHLENBQUMsRUFBQztFQUNkLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUM7RUFDL0IsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUM7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QUFNLENBQUM7RUFDcEI7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7RUFDbEQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDOUM7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7RUFDbEQsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7RUFDOUM7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7O0VBRWxELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7T0FDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7RUFDbkM7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFB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QU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFNBQVMsV0FBVyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7RUFDckUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDOztFQUVsRCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7S0FDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztFQUNyQjs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxTQUFTLFdBQVcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQ3JFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztFQUNsRCxPQUFPQyxJQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztFQUMvQzs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxTQUFTLFdBQVcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQ3JFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztFQUNsRCxPQUFPQSxJQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztFQUNoRDs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxTQUFTLFlBQVksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQ3ZFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFB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QUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ25FLENBQUMsWUFBWSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUM7R0FDakM7Q0FDRjs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxTQUFTLGFBQWEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUNoRixLQUFLLEdBQUcsQ0FBQyxNQUFLO0VBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0VBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO0VBQzFELElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO0lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxFQUFDO0lBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBQztHQUNqQyxNQUFNO0lBQ0wsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO0dBQzdDO0VBQ0QsT0FBTyxNQUFNLEdBQUcsQ0FBQztFQUNsQjs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxTQUFTLGFBQWEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUNoRixLQUFLLEdBQUcsQ0FBQyxNQUFLO0VBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0VBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO0VBQzFELElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO0lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLEtBQUss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
