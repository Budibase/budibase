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
const splitByKeySep = str => _.split(str, keySep);
const safeKey = key => _.replace(`${keySep}${trimKeySep(key)}`, `${keySep}${keySep}`, keySep);
const joinKey = (...strs) => {
  const paramsOrArray = strs.length === 1 & _.isArray(strs[0])
    ? strs[0] : strs;
  return safeKey(_.join(paramsOrArray, keySep));
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

const ifExists = (val, exists, notExists) => (_.isUndefined(val)
  ? _.isUndefined(notExists) ? (() => { })() : notExists()
  : exists());

const getOrDefault = (val, defaultVal) => ifExists(val, () => val, () => defaultVal);

const not = func => val => !func(val);
const isDefined = not(_.isUndefined);
const isNonNull = not(_.isNull);
const isNotNaN = not(_.isNaN);

const allTrue = (...funcArgs) => val => _.reduce(funcArgs,
  (result, conditionFunc) => (_.isNull(result) || result == true) && conditionFunc(val),
  null);

const anyTrue = (...funcArgs) => val => _.reduce(funcArgs,
  (result, conditionFunc) => result == true || conditionFunc(val),
  null);

const insensitiveEquals = (str1, str2) => str1.trim().toLowerCase() === str2.trim().toLowerCase();

const isSomething = allTrue(isDefined, isNonNull, isNotNaN);
const isNothing = not(isSomething);
const isNothingOrEmpty = v => isNothing(v) || _.isEmpty(v);
const somethingOrGetDefault = getDefaultFunc => val => (isSomething(val) ? val : getDefaultFunc());
const somethingOrDefault = (val, defaultVal) => somethingOrGetDefault(_.constant(defaultVal))(val);

const mapIfSomethingOrDefault = (mapFunc, defaultVal) => val => (isSomething(val) ? mapFunc(val) : defaultVal);

const mapIfSomethingOrBlank = mapFunc => mapIfSomethingOrDefault(mapFunc, '');

const none = predicate => collection => !fp.some(predicate)(collection);

const all = predicate => collection => none(v => !predicate(v))(collection);

const isNotEmpty = ob => !_.isEmpty(ob);
const isNonEmptyArray = allTrue(_.isArray, isNotEmpty);
const isNonEmptyString = allTrue(_.isString, isNotEmpty);
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

const handleErrorWith = returnValInError => tryOr(_.constant(returnValInError));

const handleErrorWithUndefined = handleErrorWith(undefined);

const switchCase = (...cases) => (value) => {
  const nextCase = () => _.head(cases)[0](value);
  const nextResult = () => _.head(cases)[1](value);

  if (_.isEmpty(cases)) return; // undefined
  if (nextCase() === true) return nextResult();
  return switchCase(..._.tail(cases))(value);
};

const isValue = val1 => val2 => (val1 === val2);
const isOneOf = (...vals) => val => _.includes(vals, val);
const defaultCase = _.constant(true);
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

const isSafeInteger = n => _.isInteger(n)
    && n <= Number.MAX_SAFE_INTEGER
    && n >= 0 - Number.MAX_SAFE_INTEGER;

const toDateOrNull = s => (_.isNull(s) ? null
  : _.isDate(s) ? s : new Date(s));
const toBoolOrNull = s => (_.isNull(s) ? null
  : s === 'true' || s === true);
const toNumberOrNull = s => (_.isNull(s) ? null
  : _.toNumber(s));

const isArrayOfString = opts => _.isArray(opts) && all(_.isString)(opts);

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
  toNumber: _.toNumber,
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
  const recordClone = _.cloneDeep(record);
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

  const mappedKeys = _.keys(mapped);
  for (let i = 0; i < mappedKeys.length; i++) {
    const key = mappedKeys[i];
    mapped[key] = _.isUndefined(mapped[key]) ? null : mapped[key];
    if (_.isFunction(mapped[key])) {
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
  makerule('indexType', `index type must be one of: ${_.join(', ', _.keys(indexTypes))}`,
    index => fp.includes(index.indexType)(_.keys(indexTypes))),
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

const getExactNodeForPath = appHierarchy => key => $(appHierarchy, [
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
  const nodeByKey = getExactNodeForPath(appHierarchy)(keyOrNodeKey);
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

const isNode = (appHierarchy, key) => isSomething(getExactNodeForPath(appHierarchy)(key));

const getActualKeyOfParent = (parentNodeKey, actualChildKey) => $(actualChildKey, [
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
  getExactNodeForPath,
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
  if (_.has(record, field.name)) {
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

  return _.has(defaultValueFunctions, getInitialValue)
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
  default: _.constant(null),
});

const stringTryParse = switchCase(
  [_.isString, parsedSuccess],
  [_.isNull, parsedSuccess],
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
    isValid: _.isBoolean,
    requirementDescription: 'allowDeclaredValuesOnly must be true or false',
    parse: toBoolOrNull,
  },
};

const typeConstraints = [
  makerule$1(async (val, opts) => val === null || opts.maxLength === null || val.length <= opts.maxLength,
    (val, opts) => `value exceeds maximum length of ${opts.maxLength}`),
  makerule$1(async (val, opts) => val === null
                           || opts.allowDeclaredValuesOnly === false
                           || _.includes(opts.values, val),
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
  default: _.constant(null),
});

const boolTryParse = switchCase(
  [_.isBoolean, parsedSuccess],
  [_.isNull, parsedSuccess],
  [isOneOf('true', '1', 'yes', 'on'), () => parsedSuccess(true)],
  [isOneOf('false', '0', 'no', 'off'), () => parsedSuccess(false)],
  [defaultCase, parsedFailed],
);

const options$1 = {
  allowNulls: {
    defaultValue: true,
    isValid: _.isBoolean,
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
  default: _.constant(null),
});

const parseStringtoNumberOrNull = (s) => {
  const num = Number(s);
  return isNaN(num) ? parsedFailed(s) : parsedSuccess(num);
};

const numberTryParse = switchCase(
  [_.isNumber, parsedSuccess],
  [_.isString, parseStringtoNumberOrNull],
  [_.isNull, parsedSuccess],
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
  default: _.constant(null),
  now: () => new Date(),
});

const isValidDate = d => d instanceof Date && !isNaN(d);

const parseStringToDate = s => switchCase(
  [isValidDate, parsedSuccess],
  [defaultCase, parsedFailed],
)(new Date(s));


const dateTryParse = switchCase(
  [_.isDate, parsedSuccess],
  [_.isString, parseStringToDate],
  [_.isNull, parsedSuccess],
  [defaultCase, parsedFailed],
);

const options$3 = {
  maxValue: {
    defaultValue: new Date(32503680000000),
    isValid: _.isDate,
    requirementDescription: 'must be a valid date',
    parse: toDateOrNull,
  },
  minValue: {
    defaultValue: new Date(-8520336000000),
    isValid: _.isDate,
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
  default: _.constant([]),
});

const mapToParsedArrary = type => $$(
  fp.map(i => type.safeParseValue(i)),
  parsedSuccess,
);

const arrayTryParse = type => switchCase(
  [_.isArray, mapToParsedArrary(type)],
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

const hasStringValue = (ob, path) => _.has(ob, path)
    && _.isString(ob[path]);

const isObjectWithKey = v => _.isObjectLike(v)
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
  [_.isString, tryParseFromString],
  [_.isNull, () => parsedSuccess(referenceNothing())],
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

const isEmptyString = s => _.isString(s) && _.isEmpty(s);

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
    _.keys,
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
  if (!_.has(all$1, typeName)) throw new BadRequestError(`Do not recognise type ${typeName}`);
  return all$1[typeName];
};

const getSampleFieldValue = field => getType(field.type).sampleValue;

const getNewFieldValue = field => getType(field.type).getNew(field);

const safeParseField = (field, record) => getType(field.type).safeParseField(field, record);

const validateFieldParse = (field, record) => (_.has(record, field.name)
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
       && _.has(value, 'key')
       && _.has(value, 'value')) return reference;
  if (fp.isObject(value)
        && _.has(value, 'relativePath')
        && _.has(value, 'size')) return file;

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
  record.key = joinKey(collectionKey, record.id);
  record.isNew = true;
  record.type = recordNode.name;
  return record;
};

const getRecordFileName = key => joinKey(key, 'record.json');

const load = app => async key => apiWrapper(
  app,
  events.recordApi.load,
  permission.readRecord.isAuthorized(key),
  { key },
  _load, app, key,
);

const _load = async (app, key, keyStack = []) => {
  key = safeKey(key);
  const recordNode = getExactNodeForPath(app.hierarchy)(key);
  const storedData = await app.datastore.loadJson(
    getRecordFileName(key),
  );

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

const getIndexedDataKey = (indexNode, indexKey, record) => {
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

  return joinKey(indexKey, shardName);
};

const getShardKeysInRange = async (app, indexKey, startRecord = null, endRecord = null) => {
  const indexNode = getExactNodeForPath(app.hierarchy)(indexKey);

  const startShardName = !startRecord
    ? null
    : shardNameFromKey(
      getIndexedDataKey(
        indexNode,
        indexKey,
        startRecord,
      ),
    );

  const endShardName = !endRecord
    ? null
    : shardNameFromKey(
      getIndexedDataKey(
        indexNode,
        indexKey,
        endRecord,
      ),
    );

  return $(await getShardMap(app.datastore, indexKey), [
    fp.filter(k => (startRecord === null || k >= startShardName)
                    && (endRecord === null || k <= endShardName)),
    fp.map(k => joinKey(indexKey, `${k}.csv`)),
  ]);
};

const ensureShardNameIsInShardMap = async (store, indexKey, indexedDataKey) => {
  const map = await getShardMap(store, indexKey);
  const shardName = shardNameFromKey(indexedDataKey);
  if (!fp.includes(shardName)(map)) {
    map.push(shardName);
    await writeShardMap(store, indexKey, map);
  }
};

const getShardMap = async (datastore, indexKey) => {
  const shardMapKey = getShardMapKey(indexKey);
  try {
    return await datastore.loadJson(shardMapKey);
  } catch (_) {
    await datastore.createJson(shardMapKey, []);
    return [];
  }
};

const writeShardMap = async (datastore, indexKey, shardMap) => await datastore.updateJson(
  getShardMapKey(indexKey),
  shardMap,
);

const getAllShardKeys = async (app, indexKey) => await getShardKeysInRange(app, indexKey);

const getShardMapKey = indexKey => joinKey(indexKey, 'shardMap.json');

const getUnshardedIndexDataKey = indexKey => joinKey(indexKey, 'index.csv');

const createIndexFile = async (datastore, indexedDataKey, index) => {
  if (isShardedIndex(index)) {
    const indexKey = getParentKey(indexedDataKey);
    const shardMap = await getShardMap(datastore, indexKey);
    shardMap.push(
      shardNameFromKey(indexedDataKey),
    );
    await writeShardMap(datastore, indexKey, shardMap);
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

const listItems = app => async (indexKey, options) => apiWrapper(
  app,
  events.indexApi.listItems,
  permission.readIndex.isAuthorized(indexKey),
  { indexKey, options },
  _listItems, app, indexKey, options,
);

const defaultOptions = { rangeStartParams: null, rangeEndParams: null, searchPhrase: null };

const _listItems = async (app, indexKey, options = defaultOptions) => {
  const { searchPhrase, rangeStartParams, rangeEndParams } = $({}, [
    fp.merge(options),
    fp.merge(defaultOptions),
  ]);

  const getItems = async key => (isNonEmptyString(searchPhrase)
    ? await searchIndex(
      app.hierarchy,
      app.datastore,
      indexNode,
      key,
      searchPhrase,
    )
    : await readIndex$1(
      app.hierarchy,
      app.datastore,
      indexNode,
      key,
    ));

  indexKey = safeKey(indexKey);
  const indexNode = getExactNodeForPath(app.hierarchy)(indexKey);

  if (!isIndex(indexNode)) { throw new Error('supplied key is not an index'); }

  if (isShardedIndex(indexNode)) {
    const shardKeys = await getShardKeysInRange(
      app, indexKey, rangeStartParams, rangeEndParams,
    );
    const items = [];
    for (const k of shardKeys) {
      items.push(await getItems(k));
    }
    return fp.flatten(items);
  }
  return await getItems(
    getUnshardedIndexDataKey(indexKey),
  );
};

const getContext = app => recordKey => apiWrapperSync(
  app,
  events.recordApi.getContext,
  permission.readRecord.isAuthorized(recordKey),
  { recordKey },
  _getContext, app, recordKey,
);

const _getContext = (app, recordKey) => {
  const recordNode = getExactNodeForPath(app.hierarchy)(recordKey);

  const cachedReferenceIndexes = {};

  const lazyLoadReferenceIndex = async (typeOptions) => {
    if (!_.has(cachedReferenceIndexes, typeOptions.indexNodeKey)) {
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
      return _.some(data, i => i.key === key);
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

  const recordNode = getExactNodeForPath(app.hierarchy)(record.key);
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

const ensureCollectionIsInitialised = async (datastore, node, parentKey) => {
  if (!await datastore.exists(parentKey)) {
    await datastore.createFolder(parentKey);
    await datastore.createFolder(
      joinKey(parentKey, 'allids'),
    );
    await datastore.createFolder(
      joinKey(
        parentKey,
        'allids',
        node.nodeId.toString(),
      ),
    );
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
      col.collectionPathRegx(),
    );
  }
};

const initialiseChildCollections = async (app, recordKey) => {
  const childCollectionRecords = $(recordKey, [
    getExactNodeForPath(app.hierarchy),
    n => n.children,
    fp.filter(isCollectionRecord),
  ]);

  for (const child of childCollectionRecords) {
    await ensureCollectionIsInitialised(
      app.datastore,
      child,
      joinKey(recordKey, child.collectionName),
    );
  }
};

const allIdChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';

const allIdsStringsForFactor = (collectionNode) => {
  const factor = collectionNode.allidsShardFactor;
  const charRangePerShard = 64 / factor;
  const allIdStrings = [];
  let index = 0;
  let currentIdsShard = '';
  while (index < 64) {
    currentIdsShard += allIdChars[index];
    if ((index + 1) % charRangePerShard === 0) {
      allIdStrings.push(currentIdsShard);
      currentIdsShard = '';
    }
    index++;
  }

  return allIdStrings;
};

const getAllIdsShardNames = (appHierarchy, collectionKey) => {
  const collectionRecordNode = getNodeForCollectionPath(appHierarchy)(collectionKey);
  return $(collectionRecordNode, [
    c => [c.nodeId],
    fp.map(i => fp.map(c => _allIdsShardKey(collectionKey, i, c))(allIdsStringsForFactor(collectionRecordNode))),
    fp.flatten,
  ]);
};

const _allIdsShardKey = (collectionKey, childNo, shardKey) => joinKey(
  collectionKey,
  'allids',
  childNo,
  shardKey,
);

const getAllIdsShardKey = (appHierarchy, collectionKey, recordId) => {
  const indexOfFirstDash = recordId.indexOf('-');

  const collectionNode = getNodeForCollectionPath(appHierarchy)(collectionKey);

  const idFirstChar = recordId[indexOfFirstDash + 1];
  const allIdsShardId = $(collectionNode, [
    allIdsStringsForFactor,
    fp.find(i => i.includes(idFirstChar)),
  ]);

  return _allIdsShardKey(
    collectionKey,
    recordId.slice(0, indexOfFirstDash),
    allIdsShardId,
  );
};

const getOrCreateShardFile = async (datastore, allIdsKey) => {
  try {
    return await datastore.loadFile(allIdsKey);
  } catch (eLoad) {
    try {
      await datastore.createFile(allIdsKey, '');
      return '';
    } catch (eCreate) {
      throw new Error(
        `Error loading, then creating allIds ${allIdsKey
        } : LOAD : ${eLoad.message
        } : CREATE : ${eCreate}`,
      );
    }
  }
};

const getShardFile = async (datastore, allIdsKey) => {
  try {
    return await datastore.loadFile(allIdsKey);
  } catch (eLoad) {
    return '';
  }
};

const addToAllIds = (appHierarchy, datastore) => async (record) => {
  const allIdsKey = getAllIdsShardKey(
    appHierarchy,
    getParentKey(record.key),
    record.id,
  );

  let allIds = await getOrCreateShardFile(datastore, allIdsKey);

  allIds += `${allIds.length > 0 ? ',' : ''}${record.id}`;

  await datastore.updateFile(allIdsKey, allIds);
};

const getAllIdsIterator = app => async (collection_Key_or_NodeKey) => {
  collection_Key_or_NodeKey = safeKey(collection_Key_or_NodeKey);
  const targetNode = getCollectionNodeByKeyOrNodeKey(
    app.hierarchy,
    collection_Key_or_NodeKey,
  );

  const getAllIdsIteratorForCollectionKey = async (collectionKey) => {
    const all_allIdsKeys = getAllIdsShardNames(app.hierarchy, collectionKey);
    let shardIndex = 0;

    const allIdsFromShardIterator = async () => {
      if (shardIndex === all_allIdsKeys.length) { return ({ done: true, result: { ids: [], collectionKey } }); }

      const shardKey = all_allIdsKeys[shardIndex];

      const allIds = await getAllIdsFromShard(app.datastore, shardKey);

      shardIndex++;

      return ({
        result: {
          ids: allIds,
          collectionKey,
        },
        done: false,
      });
    };

    return allIdsFromShardIterator;
  };

  const ancestors = $(getFlattenedHierarchy(app.hierarchy), [
    fp.filter(isCollectionRecord),
    fp.filter(n => isAncestor(targetNode)(n)
                    || n.nodeKey() === targetNode.nodeKey()),
    fp.orderBy([n => n.nodeKey().length], ['asc']),
  ]); // parents first

  const traverseForIteraterators = async (parentRecordKey = '', currentNodeIndex = 0) => {
    const currentNode = ancestors[currentNodeIndex];
    const currentCollectionKey = joinKey(
      parentRecordKey,
      currentNode.collectionName,
    );
    if (currentNode.nodeKey() === targetNode.nodeKey()) {
      return [
        await getAllIdsIteratorForCollectionKey(
          currentCollectionKey,
        )];
    }
    const allIterators = [];
    const currentIterator = await getAllIdsIteratorForCollectionKey(
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

const getAllIdsFromShard = async (datastore, shardKey) => {
  const allIdsStr = await getShardFile(datastore, shardKey);

  const allIds = [];
  let currentId = '';
  for (let i = 0; i < allIdsStr.length; i++) {
    const currentChar = allIdsStr.charAt(i);
    const isLast = (i === allIdsStr.length - 1);
    if (currentChar === ',' || isLast) {
      if (isLast) currentId += currentChar;
      allIds.push(currentId);
      currentId = '';
    } else {
      currentId += currentChar;
    }
  }
  return allIds;
};

const removeFromAllIds = (appHierarchy, datastore) => async (record) => {
  const shardKey = getAllIdsShardKey(
    appHierarchy,
    getParentKey(record.key),
    record.id,
  );
  const allIds = await getAllIdsFromShard(datastore, shardKey);

  const newIds = $(allIds, [
    fp.pull(record.id),
    fp.join(','),
  ]);

  await datastore.updateFile(shardKey, newIds);
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

const initialiseIndex = async (datastore, parentKey, index) => {
  const indexKey = joinKey(parentKey, index.name);

  await datastore.createFolder(indexKey);

  if (isShardedIndex(index)) {
    await datastore.createFile(
      getShardMapKey(indexKey),
      '[]',
    );
  } else {
    await createIndexFile(
      datastore,
      getUnshardedIndexDataKey(indexKey),
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

  if (recordClone.isNew) {
    await addToAllIds(app.hierarchy, app.datastore)(recordClone);
    const transaction = await transactionForCreateRecord(
      app, recordClone,
    );
    recordClone.transactionId = transaction.id;
    await app.datastore.createFolder(recordClone.key);
    await app.datastore.createFolder(
      joinKey(recordClone.key, 'files'),
    );
    await app.datastore.createJson(
      getRecordFileName(recordClone.key),
      recordClone,
    );
    await initialiseReverseReferenceIndexes(app, record);
    await initialiseAncestorIndexes(app, record);
    await initialiseChildCollections(app, recordClone.key);
    await app.publish(events.recordApi.save.onRecordCreated, {
      record: recordClone,
    });
  } else {
    const oldRecord = await _load(app, recordClone.key);
    const transaction = await transactionForUpdateRecord(
      app, oldRecord, recordClone,
    );
    recordClone.transactionId = transaction.id;
    await app.datastore.updateJson(
      getRecordFileName(recordClone.key),
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

const initialiseAncestorIndexes = async (app, record) => {
  const recordNode = getExactNodeForPath(app.hierarchy)(record.key);

  for (const index of recordNode.indexes) {
    const indexKey = joinKey(record.key, index.name);
    if (!await app.datastore.exists(indexKey)) { await initialiseIndex(app.datastore, record.key, index); }
  }
};

const initialiseReverseReferenceIndexes = async (app, record) => {
  const recordNode = getExactNodeForPath(app.hierarchy)(record.key);

  const indexNodes = $(fieldsThatReferenceThisRecord(app, recordNode), [
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
      app.datastore, record.key, indexNode,
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

const deleteCollection = (app, disableCleanup = false) => async key => apiWrapper(
  app,
  events.collectionApi.delete,
  permission.manageCollection.isAuthorized,
  { key },
  _deleteCollection, app, key, disableCleanup,
);


const _deleteCollection = async (app, key, disableCleanup) => {
  key = safeKey(key);
  const node = getNodeForCollectionPath(app.hierarchy)(key);

  await deleteRecords(app, key);
  await deleteAllIdsFolders(app, node, key);
  await deleteCollectionFolder(app, key);
  if (!disableCleanup) { await app.cleanupTransactions(); }
};

const deleteCollectionFolder = async (app, key) => await app.datastore.deleteFolder(key);


const deleteAllIdsFolders = async (app, node, key) => {
  await app.datastore.deleteFolder(
    joinKey(
      key, 'allids',
      node.nodeId,
    ),
  );

  await app.datastore.deleteFolder(
    joinKey(key, 'allids'),
  );
};

const deleteRecords = async (app, key) => {
  const deletedAllIdsShards = [];
  const deleteAllIdsShard = async (recordId) => {
    const shardKey = getAllIdsShardKey(
      app.hierarchy, key, recordId,
    );

    if (fp.includes(shardKey)(deletedAllIdsShards)) {
      return;
    }

    deletedAllIdsShards.push(shardKey);

    await app.datastore.deleteFile(shardKey);
  };

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
        await deleteAllIdsShard(id);
      }
    }

    ids = await iterate();
  }
};

const _deleteIndex = async (app, indexKey, includeFolder) => {
  const indexNode = getExactNodeForPath(app.hierarchy)(indexKey);

  if (!isIndex(indexNode)) { throw new Error('Supplied key is not an index'); }

  if (isShardedIndex(indexNode)) {
    const shardKeys = await getAllShardKeys(app, indexKey);
    for (const k of shardKeys) {
      await tryAwaitOrIgnore(
        app.datastore.deleteFile(k),
      );
    }
    tryAwaitOrIgnore(
      await app.datastore.deleteFile(
        getShardMapKey(indexKey),
      ),
    );
  } else {
    await tryAwaitOrIgnore(
      app.datastore.deleteFile(
        getUnshardedIndexDataKey(indexKey),
      ),
    );
  }

  if (includeFolder) {
    tryAwaitOrIgnore(
      await app.datastore.deleteFolder(indexKey),
    );
  }
};

const deleteRecord$1 = (app, disableCleanup = false) => async key => apiWrapper(
  app,
  events.recordApi.delete,
  permission.deleteRecord.isAuthorized(key),
  { key },
  _deleteRecord, app, key, disableCleanup,
);

// called deleteRecord because delete is a keyword
const _deleteRecord = async (app, key, disableCleanup) => {
  key = safeKey(key);
  const node = getExactNodeForPath(app.hierarchy)(key);

  const record = await _load(app, key);
  await transactionForDeleteRecord(app, record);

  for (const collectionRecord of node.children) {
    const collectionKey = joinKey(
      key, collectionRecord.collectionName,
    );
    await _deleteCollection(app, collectionKey, true);
  }

  await app.datastore.deleteFile(
    getRecordFileName(key),
  );

  await deleteFiles(app, key);

  await removeFromAllIds(app.hierarchy, app.datastore)(record);

  if (!disableCleanup) { await app.cleanupTransactions(); }

  await app.datastore.deleteFolder(key);
  await deleteIndexes(app, key);
};

const deleteIndexes = async (app, key) => {
  const node = getExactNodeForPath(app.hierarchy)(key);
  /* const reverseIndexKeys = $(app.hierarchy, [
        getFlattenedHierarchy,
        map(n => n.fields),
        flatten,
        filter(isSomething),
        filter(fieldReversesReferenceToNode(node)),
        map(f => $(f.typeOptions.reverseIndexNodeKeys, [
                    map(n => getNode(
                                app.hierarchy,
                                n))
                ])
        ),
        flatten,
        map(n => joinKey(key, n.name))
    ]);

    for(let i of reverseIndexKeys) {
        await _deleteIndex(app, i, true);
    } */


  for (const index of node.indexes) {
    const indexKey = joinKey(key, index.name);
    await _deleteIndex(app, indexKey, true);
  }
};

const deleteFiles = async (app, key) => {
  const filesFolder = joinKey(key, 'files');
  const allFiles = await app.datastore.getFolderContents(
    filesFolder,
  );

  for (const file of allFiles) {
    await app.datastore.deleteFile(file);
  }

  await app.datastore.deleteFolder(
    joinKey(key, 'files'),
  );
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

  const record = await _load(app, recordKey);

  const fullFilePath = safeGetFullFilePath(
    recordKey, relativeFilePath,
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

  /*
  readableStream.pipe(outputStream);

  await new Promise(fulfill => outputStream.on('finish', fulfill));

  const isExpectedFileSize = checkFileSizeAgainstFields(
    app,
    record, relativeFilePath,
    await app.datastore.getFileSize(tempFilePath),
  );

  if (!isExpectedFileSize) {
    throw new Error(
      `Fields for ${relativeFilePath} do not have expected size`);
  }

  await tryAwaitOrIgnore(app.datastore.deleteFile, fullFilePath);

  await app.datastore.renameFile(tempFilePath, fullFilePath);
  */
};

const checkFileSizeAgainstFields = (app, record, relativeFilePath, expectedSize) => {
  const recordNode = getExactNodeForPath(app.hierarchy)(record.key);

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

const safeGetFullFilePath = (recordKey, relativeFilePath) => {
  const naughtyUser = () => { throw new ForbiddenError('naughty naughty'); };

  if (relativeFilePath.startsWith('..')) naughtyUser();

  const pathParts = splitKey(relativeFilePath);

  if (fp.includes('..')(pathParts)) naughtyUser();

  const recordKeyParts = splitKey(recordKey);

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

  return await app.datastore.readableFileStream(
    safeGetFullFilePath(
      recordKey, relativePath,
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
  const indexNode = getExactNodeForPath(app.hierarchy)(indexKey);

  if (!isIndex(indexNode)) { throw new BadRequestError('supplied key is not an index'); }

  if (isShardedIndex(indexNode)) {
    const shardKeys = await getShardKeysInRange(
      app, indexKey, rangeStartParams, rangeEndParams,
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
    getUnshardedIndexDataKey(indexKey),
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
    _.constant('/')],

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
  node.parent = _.constant(parent);
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
    { parent.indexes.push(obj); } else if (isaggregateGroup(obj)) { parent.aggregateGroups.push(obj); } else { parent.children.push(obj); }

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
    allidsShardFactor: isRecord(parent) ? 1 : 64,
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
    a => _.isEmpty(a.aggregatedValue)
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
    node => fp.every(r => _.has(r, 'messageWhenInvalid'))(node.validationRules)),
  makerule('validationRules', "validation rule is missing a 'expressionWhenValid' member",
    node => fp.every(r => _.has(r, 'expressionWhenValid'))(node.validationRules)),
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
  if (!_.has(handlers, eventName)) return;

  for (const handler of handlers[eventName]) {
    await handler(eventName, context);
  }
};

const subscribe = handlers => (eventName, handler) => {
  if (!_.has(handlers, eventName)) {
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

const createJson = originalCreateFile => async (key, obj, retries = 5, delay = 500) => await retry(originalCreateFile, retries, delay, key, JSON.stringify(obj));

const createNewFile = originalCreateFile => async (path, content, retries = 5, delay = 500) => await retry(originalCreateFile, retries, delay, path, content);

const loadJson = datastore => async (key, retries = 5, delay = 500) => {
  try {
    return await retry(JSON.parse, retries, delay, await datastore.loadFile(key));
  } catch (err) {
    throw new NotFoundError(err.message);
  }
};

const updateJson = datastore => async (key, obj, retries = 5, delay = 500) => {
  try {
    return await retry(datastore.updateFile, retries, delay, key, JSON.stringify(obj));
  } catch (err) {
    throw new NotFoundError(err.message);
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

const getRelevantAncestorIndexes = (appHierarchy, record) => {
  const key = record.key;
  const keyParts = splitKey(key);
  const nodeId = getRecordNodeId(key);

  const flatHierarchy = _.orderBy(getFlattenedHierarchy(appHierarchy),
    [node => node.pathRegx().length],
    ['desc']);

  const makeindexNodeAndKey_ForAncestorIndex = (indexNode, indexKey) => makeIndexNodeAndKey(indexNode, joinKey(indexKey, indexNode.name));

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

    fp.each(v => acc.nodesAndKeys.push(
      makeindexNodeAndKey_ForAncestorIndex(v, currentIndexKey),
    ))(indexes);

    return acc;
  }, { lastIndexKey: '', nodesAndKeys: [] })(keyParts).nodesAndKeys;

  const rootIndexes = $(flatHierarchy, [
    fp.filter(n => isGlobalIndex(n) && recordNodeIdIsAllowed(n)(nodeId)),
    fp.map(i => makeIndexNodeAndKey(i, i.nodeKey())),
  ]);

  return fp.union(traverseAncestorIndexesInPath())(rootIndexes);
};

const getRelevantReverseReferenceIndexes = (appHierarchy, record) => $(record.key, [
  getExactNodeForPath(appHierarchy),
  n => n.fields,
  fp.filter(f => f.type === 'reference'
                    && isSomething(record[f.name])
                    && isNonEmptyString(record[f.name].key)),
  fp.map(f => $(f.typeOptions.reverseIndexNodeKeys, [
    fp.map(n => ({
      recordNode: getNode(appHierarchy, n),
      field: f,
    })),
  ])),
  fp.flatten,
  fp.map(n => makeIndexNodeAndKey(
    n.recordNode,
    joinKey(record[n.field.name].key, n.recordNode.name),
  )),
]);

const makeIndexNodeAndKey = (indexNode, indexKey) => ({ indexNode, indexKey });

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

const applyToShard = async (hierarchy, store, indexKey,
  indexNode, indexShardKey, recordsToWrite, keysToRemove) => {
  const createIfNotExists = recordsToWrite.length > 0;
  const writer = await getWriter(hierarchy, store, indexKey, indexShardKey, indexNode, createIfNotExists);
  if (writer === SHARD_DELETED) return;

  await writer.updateIndex(recordsToWrite, keysToRemove);
  await swapTempFileIn(store, indexShardKey);
};

const SHARD_DELETED = 'SHARD_DELETED';
const getWriter = async (hierarchy, store, indexKey, indexedDataKey, indexNode, createIfNotExists) => {
  let readableStream = null;

  if (isShardedIndex(indexNode)) {
    await ensureShardNameIsInShardMap(store, indexKey, indexedDataKey);
    if(!await store.exists(indexedDataKey)) {
      await store.createFile(indexedDataKey, "");
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
        await store.createFile(indexedDataKey, ''); 
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
      recordsByShard[shard].indexKey,
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
        indexKey: t.indexKey,
        indexNodeKey: t.indexNodeKey,
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
      indexKey: indexNodeAndPath.indexKey,
      indexShardKey: getIndexedDataKey(
        indexNodeAndPath.indexNode,
        indexNodeAndPath.indexKey,
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

  const getIndexKeys = (t) => {
    if (isGlobalIndex(indexNode)) {
      return [indexNode.nodeKey()];
    }

    if (isReferenceIndex(indexNode)) {
      const recordNode = getExactNodeForPath(hierarchy)(t.record.key);
      const refFields = $(recordNode.fields, [
        fp.filter(fieldReversesReferenceToIndex(indexNode)),
      ]);
      const indexKeys = [];
      for (const refField of refFields) {
        const refValue = t.record[refField.name];
        if (isSomething(refValue)
                   && isNonEmptyString(refValue.key)) {
          const indexKey = joinKey(
            refValue.key,
            indexNode.name,
          );

          if (!fp.includes(indexKey)(indexKeys)) { indexKeys.push(indexKey); }
        }
      }
      return indexKeys;
    }

    return [joinKey(
      getActualKeyOfParent(
        indexNode.parent().nodeKey(),
        t.record.key,
      ),
      indexNode.name,
    )];
  };

  return $(buildTransactions, [
    fp.map((t) => {
      const mappedRecord = evaluate(t.record)(indexNode);
      if (!mappedRecord.passedFilter) return null;
      const indexKeys = getIndexKeys(t);
      return $(indexKeys, [
        fp.map(indexKey => ({
          mappedRecord,
          indexNode,
          indexKey,
          indexShardKey: getIndexedDataKey(
            indexNode,
            indexKey,
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
        indexKey: n.indexKey,
        indexShardKey: getIndexedDataKey(
          n.indexNode,
          n.indexKey,
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
    i => i.indexKey,
    oldIndexes, newIndexes,
  );

  const newlyReferenced = fp.differenceBy(
    i => i.indexKey,
    newIndexes, oldIndexes,
  );

  const notChanged = fp.intersectionBy(
    i => i.indexKey,
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

  await initialiseRootSingleRecords(datastore, applicationDefinition.hierarchy);

  await datastore.createFolder(TRANSACTIONS_FOLDER);

  await datastore.createFolder(AUTH_FOLDER);

  await datastore.createJson(USERS_LIST_FILE, []);

  await datastore.createJson(
    ACCESS_LEVELS_FILE, 
    accessLevels ? accessLevels : { version: 0, levels: [] });
};

const initialiseRootIndexes = async (datastore, hierarchy) => {
  const flathierarchy = getFlattenedHierarchy(hierarchy);
  const globalIndexes = $(flathierarchy, [
    fp.filter(isGlobalIndex),
  ]);

  for (const index of globalIndexes) {
    if (!await datastore.exists(index.nodeKey())) { await initialiseIndex(datastore, '', index); }
  }
};

const initialiseRootSingleRecords = async (datastore, hierachy) => {
  const flathierarchy = getFlattenedHierarchy(hierachy);
  const singleRecords = $(flathierarchy, [
    fp.filter(isSingleRecord),
  ]);

  /* for (let record of singleRecords) {
        const result = getNew({ datastore: datastore, hierarchy: appDefinition.hierarchy })
            (record.nodeKey(),
                record.name
            );

        _save({ datastore: datastore, hierarchy: appDefinition.hierarchy },
            result
        );
    } */
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

    const withFullAccess = () => {
        app.user = {
            name: "app",
            permissions : generateFullPermissions(app),
            isUser:false,
            temp:false
        };
    };

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVkaWJhc2UtY29yZS5janMuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21tb24vZXZlbnRzLmpzIiwiLi4vc3JjL2NvbW1vbi9lcnJvcnMuanMiLCIuLi9zcmMvY29tbW9uL2FwaVdyYXBwZXIuanMiLCIuLi9zcmMvY29tbW9uL2xvY2suanMiLCIuLi9zcmMvY29tbW9uL2luZGV4LmpzIiwiLi4vc3JjL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uLmpzIiwiLi4vc3JjL2luZGV4aW5nL2V2YWx1YXRlLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2luZGV4ZXMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvaGllcmFyY2h5LmpzIiwiLi4vc3JjL3R5cGVzL3R5cGVIZWxwZXJzLmpzIiwiLi4vc3JjL3R5cGVzL3N0cmluZy5qcyIsIi4uL3NyYy90eXBlcy9ib29sLmpzIiwiLi4vc3JjL3R5cGVzL251bWJlci5qcyIsIi4uL3NyYy90eXBlcy9kYXRldGltZS5qcyIsIi4uL3NyYy90eXBlcy9hcnJheS5qcyIsIi4uL3NyYy90eXBlcy9yZWZlcmVuY2UuanMiLCIuLi9zcmMvdHlwZXMvZmlsZS5qcyIsIi4uL3NyYy90eXBlcy9pbmRleC5qcyIsIi4uL3NyYy9hdXRoQXBpL2F1dGhDb21tb24uanMiLCIuLi9zcmMvYXV0aEFwaS9pc0F1dGhvcml6ZWQuanMiLCIuLi9zcmMvYXV0aEFwaS9wZXJtaXNzaW9ucy5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZ2V0TmV3LmpzIiwiLi4vc3JjL3JlY29yZEFwaS9sb2FkLmpzIiwiLi4vc3JjL2luZGV4aW5nL3Byb21pc2VSZWFkYWJsZVN0cmVhbS5qcyIsIi4uL3NyYy9pbmRleGluZy9zaGFyZGluZy5qcyIsIi4uL3NyYy9pbmRleGluZy9pbmRleFNjaGVtYUNyZWF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvcm9sbHVwLXBsdWdpbi1ub2RlLWdsb2JhbHMvc3JjL2dsb2JhbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9idWZmZXItZXM2L2Jhc2U2NC5qcyIsIi4uL25vZGVfbW9kdWxlcy9idWZmZXItZXM2L2llZWU3NTQuanMiLCIuLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVzNi9pc0FycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2J1ZmZlci1lczYvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvcm9sbHVwLXBsdWdpbi1ub2RlLWJ1aWx0aW5zL3NyYy9lczYvc3RyaW5nLWRlY29kZXIuanMiLCIuLi9zcmMvaW5kZXhpbmcvc2VyaWFsaXplci5qcyIsIi4uL3NyYy9pbmRleGluZy9yZWFkLmpzIiwiLi4vc3JjL2luZGV4QXBpL2xpc3RJdGVtcy5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZ2V0Q29udGV4dC5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvdmFsaWRhdGUuanMiLCIuLi9zcmMvY29sbGVjdGlvbkFwaS9pbml0aWFsaXNlLmpzIiwiLi4vc3JjL2luZGV4aW5nL2FsbElkcy5qcyIsIi4uL3NyYy90cmFuc2FjdGlvbnMvdHJhbnNhY3Rpb25zQ29tbW9uLmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9jcmVhdGUuanMiLCIuLi9zcmMvaW5kZXhpbmcvaW5pdGlhbGlzZUluZGV4LmpzIiwiLi4vc3JjL3JlY29yZEFwaS9zYXZlLmpzIiwiLi4vc3JjL2NvbGxlY3Rpb25BcGkvZGVsZXRlLmpzIiwiLi4vc3JjL2luZGV4QXBpL2RlbGV0ZS5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZGVsZXRlLmpzIiwiLi4vc3JjL3JlY29yZEFwaS91cGxvYWRGaWxlLmpzIiwiLi4vc3JjL3JlY29yZEFwaS9kb3dubG9hZEZpbGUuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2N1c3RvbUlkLmpzIiwiLi4vc3JjL3JlY29yZEFwaS9pbmRleC5qcyIsIi4uL3NyYy9jb2xsZWN0aW9uQXBpL2dldEFsbG93ZWRSZWNvcmRUeXBlcy5qcyIsIi4uL3NyYy9jb2xsZWN0aW9uQXBpL2luZGV4LmpzIiwiLi4vc3JjL2luZGV4QXBpL2J1aWxkSW5kZXguanMiLCIuLi9zcmMvaW5kZXhBcGkvYWdncmVnYXRlcy5qcyIsIi4uL3NyYy9pbmRleEFwaS9pbmRleC5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9jcmVhdGVOb2Rlcy5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9maWVsZHMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvcmVjb3JkVmFsaWRhdGlvblJ1bGVzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2NyZWF0ZUFjdGlvbnMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvdmFsaWRhdGVBZ2dyZWdhdGUuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvdmFsaWRhdGUuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL3NhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeS5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9zYXZlQWN0aW9uc0FuZFRyaWdnZXJzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2dldEJlaGF2aW91clNvdXJjZXMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvaW5kZXguanMiLCIuLi9zcmMvYXV0aEFwaS9nZXRVc2Vycy5qcyIsIi4uL3NyYy9hdXRoQXBpL2xvYWRBY2Nlc3NMZXZlbHMuanMiLCIuLi9zcmMvYXV0aEFwaS9hdXRoZW50aWNhdGUuanMiLCIuLi9zcmMvYXV0aEFwaS9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MuanMiLCIuLi9zcmMvYXV0aEFwaS92YWxpZGF0ZVVzZXIuanMiLCIuLi9zcmMvYXV0aEFwaS9nZXROZXdVc2VyLmpzIiwiLi4vc3JjL2F1dGhBcGkvc2V0UGFzc3dvcmQuanMiLCIuLi9zcmMvYXV0aEFwaS9jcmVhdGVVc2VyLmpzIiwiLi4vc3JjL2F1dGhBcGkvZW5hYmxlVXNlci5qcyIsIi4uL3NyYy9hdXRoQXBpL2dldE5ld0FjY2Vzc0xldmVsLmpzIiwiLi4vc3JjL2F1dGhBcGkvdmFsaWRhdGVBY2Nlc3NMZXZlbHMuanMiLCIuLi9zcmMvYXV0aEFwaS9zYXZlQWNjZXNzTGV2ZWxzLmpzIiwiLi4vc3JjL2F1dGhBcGkvZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMuanMiLCIuLi9zcmMvYXV0aEFwaS9zZXRVc2VyQWNjZXNzTGV2ZWxzLmpzIiwiLi4vc3JjL2F1dGhBcGkvaW5kZXguanMiLCIuLi9zcmMvYWN0aW9uc0FwaS9leGVjdXRlLmpzIiwiLi4vc3JjL2FjdGlvbnNBcGkvaW5kZXguanMiLCIuLi9zcmMvYXBwSW5pdGlhbGlzZS9ldmVudEFnZ3JlZ2F0b3IuanMiLCIuLi9zcmMvYXBwSW5pdGlhbGlzZS9pbmRleC5qcyIsIi4uL3NyYy9jb21tb24vY29tcGlsZUNvZGUuanMiLCIuLi9zcmMvYWN0aW9uc0FwaS9pbml0aWFsaXNlLmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9yZXRyaWV2ZS5qcyIsIi4uL3NyYy9pbmRleGluZy9yZWxldmFudC5qcyIsIi4uL3NyYy9pbmRleGluZy9wcm9taXNlV3JpdGFibGVTdHJlYW0uanMiLCIuLi9zcmMvaW5kZXhpbmcvYXBwbHkuanMiLCIuLi9zcmMvdHJhbnNhY3Rpb25zL2V4ZWN1dGUuanMiLCIuLi9zcmMvdHJhbnNhY3Rpb25zL2NsZWFudXAuanMiLCIuLi9zcmMvYXBwSW5pdGlhbGlzZS9pbml0aWFsaXNlRGF0YS5qcyIsIi4uL3NyYy9hcHBJbml0aWFsaXNlL2RhdGFiYXNlTWFuYWdlci5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1bmlvbiwgcmVkdWNlIH0gZnJvbSAnbG9kYXNoL2ZwJztcclxuXHJcbmNvbnN0IGNvbW1vblBsdXMgPSBleHRyYSA9PiB1bmlvbihbJ29uQmVnaW4nLCAnb25Db21wbGV0ZScsICdvbkVycm9yJ10pKGV4dHJhKTtcclxuXHJcbmNvbnN0IGNvbW1vbiA9ICgpID0+IGNvbW1vblBsdXMoW10pO1xyXG5cclxuY29uc3QgX2V2ZW50cyA9IHtcclxuICByZWNvcmRBcGk6IHtcclxuICAgIHNhdmU6IGNvbW1vblBsdXMoW1xyXG4gICAgICAnb25JbnZhbGlkJyxcclxuICAgICAgJ29uUmVjb3JkVXBkYXRlZCcsXHJcbiAgICAgICdvblJlY29yZENyZWF0ZWQnXSksXHJcbiAgICBkZWxldGU6IGNvbW1vbigpLFxyXG4gICAgZ2V0Q29udGV4dDogY29tbW9uKCksXHJcbiAgICBnZXROZXc6IGNvbW1vbigpLFxyXG4gICAgbG9hZDogY29tbW9uKCksXHJcbiAgICB2YWxpZGF0ZTogY29tbW9uKCksXHJcbiAgICB1cGxvYWRGaWxlOiBjb21tb24oKSxcclxuICAgIGRvd25sb2FkRmlsZTogY29tbW9uKCksXHJcbiAgfSxcclxuICBpbmRleEFwaToge1xyXG4gICAgYnVpbGRJbmRleDogY29tbW9uKCksXHJcbiAgICBsaXN0SXRlbXM6IGNvbW1vbigpLFxyXG4gICAgZGVsZXRlOiBjb21tb24oKSxcclxuICAgIGFnZ3JlZ2F0ZXM6IGNvbW1vbigpLFxyXG4gIH0sXHJcbiAgY29sbGVjdGlvbkFwaToge1xyXG4gICAgZ2V0QWxsb3dlZFJlY29yZFR5cGVzOiBjb21tb24oKSxcclxuICAgIGluaXRpYWxpc2U6IGNvbW1vbigpLFxyXG4gICAgZGVsZXRlOiBjb21tb24oKSxcclxuICB9LFxyXG4gIGF1dGhBcGk6IHtcclxuICAgIGF1dGhlbnRpY2F0ZTogY29tbW9uKCksXHJcbiAgICBhdXRoZW50aWNhdGVUZW1wb3JhcnlBY2Nlc3M6IGNvbW1vbigpLFxyXG4gICAgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzOiBjb21tb24oKSxcclxuICAgIGNyZWF0ZVVzZXI6IGNvbW1vbigpLFxyXG4gICAgZW5hYmxlVXNlcjogY29tbW9uKCksXHJcbiAgICBkaXNhYmxlVXNlcjogY29tbW9uKCksXHJcbiAgICBsb2FkQWNjZXNzTGV2ZWxzOiBjb21tb24oKSxcclxuICAgIGdldE5ld0FjY2Vzc0xldmVsOiBjb21tb24oKSxcclxuICAgIGdldE5ld1VzZXI6IGNvbW1vbigpLFxyXG4gICAgZ2V0TmV3VXNlckF1dGg6IGNvbW1vbigpLFxyXG4gICAgZ2V0VXNlcnM6IGNvbW1vbigpLFxyXG4gICAgc2F2ZUFjY2Vzc0xldmVsczogY29tbW9uKCksXHJcbiAgICBpc0F1dGhvcml6ZWQ6IGNvbW1vbigpLFxyXG4gICAgY2hhbmdlTXlQYXNzd29yZDogY29tbW9uKCksXHJcbiAgICBzZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlOiBjb21tb24oKSxcclxuICAgIHNjb3JlUGFzc3dvcmQ6IGNvbW1vbigpLFxyXG4gICAgaXNWYWxpZFBhc3N3b3JkOiBjb21tb24oKSxcclxuICAgIHZhbGlkYXRlVXNlcjogY29tbW9uKCksXHJcbiAgICB2YWxpZGF0ZUFjY2Vzc0xldmVsczogY29tbW9uKCksXHJcbiAgICBzZXRVc2VyQWNjZXNzTGV2ZWxzOiBjb21tb24oKSxcclxuICB9LFxyXG4gIHRlbXBsYXRlQXBpOiB7XHJcbiAgICBzYXZlQXBwbGljYXRpb25IaWVyYXJjaHk6IGNvbW1vbigpLFxyXG4gICAgc2F2ZUFjdGlvbnNBbmRUcmlnZ2VyczogY29tbW9uKCksXHJcbiAgfSxcclxuICBhY3Rpb25zQXBpOiB7XHJcbiAgICBleGVjdXRlOiBjb21tb24oKSxcclxuICB9LFxyXG59O1xyXG5cclxuY29uc3QgX2V2ZW50c0xpc3QgPSBbXTtcclxuXHJcbmNvbnN0IG1ha2VFdmVudCA9IChhcmVhLCBtZXRob2QsIG5hbWUpID0+IGAke2FyZWF9OiR7bWV0aG9kfToke25hbWV9YDtcclxuXHJcbmZvciAoY29uc3QgYXJlYUtleSBpbiBfZXZlbnRzKSB7XHJcbiAgZm9yIChjb25zdCBtZXRob2RLZXkgaW4gX2V2ZW50c1thcmVhS2V5XSkge1xyXG4gICAgX2V2ZW50c1thcmVhS2V5XVttZXRob2RLZXldID0gcmVkdWNlKChvYmosIHMpID0+IHtcclxuICAgICAgb2JqW3NdID0gbWFrZUV2ZW50KGFyZWFLZXksIG1ldGhvZEtleSwgcyk7XHJcbiAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9LFxyXG4gICAge30pKF9ldmVudHNbYXJlYUtleV1bbWV0aG9kS2V5XSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuZm9yIChjb25zdCBhcmVhS2V5IGluIF9ldmVudHMpIHtcclxuICBmb3IgKGNvbnN0IG1ldGhvZEtleSBpbiBfZXZlbnRzW2FyZWFLZXldKSB7XHJcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gX2V2ZW50c1thcmVhS2V5XVttZXRob2RLZXldKSB7XHJcbiAgICAgIF9ldmVudHNMaXN0LnB1c2goXHJcbiAgICAgICAgX2V2ZW50c1thcmVhS2V5XVttZXRob2RLZXldW25hbWVdLFxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBldmVudHMgPSBfZXZlbnRzO1xyXG5cclxuZXhwb3J0IGNvbnN0IGV2ZW50c0xpc3QgPSBfZXZlbnRzTGlzdDtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHsgZXZlbnRzOiBfZXZlbnRzLCBldmVudHNMaXN0OiBfZXZlbnRzTGlzdCB9O1xyXG4iLCJleHBvcnQgY2xhc3MgQmFkUmVxdWVzdEVycm9yIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xyXG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xyXG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVbmF1dGhvcmlzZWRFcnJvciBleHRlbmRzIEVycm9yIHtcclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcclxuICAgICAgICBzdXBlcihtZXNzYWdlKTtcclxuICAgICAgICB0aGlzLmh0dHBTdGF0dXNDb2RlID0gNDAxO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRm9yYmlkZGVuRXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XHJcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDQwMztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE5vdEZvdW5kRXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XHJcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDQwNDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvbmZsaWN0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XHJcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDQwOTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IGNsb25lRGVlcCwgaXNVbmRlZmluZWQgfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xyXG5pbXBvcnQgeyBVbmF1dGhvcmlzZWRFcnJvciB9IGZyb20gJy4vZXJyb3JzJztcclxuXHJcbmV4cG9ydCBjb25zdCBhcGlXcmFwcGVyID0gYXN5bmMgKGFwcCwgZXZlbnROYW1lc3BhY2UsIGlzQXV0aG9yaXplZCwgZXZlbnRDb250ZXh0LCBmdW5jLCAuLi5wYXJhbXMpID0+IHtcclxuICBwdXNoQ2FsbFN0YWNrKGFwcCwgZXZlbnROYW1lc3BhY2UpO1xyXG5cclxuICBpZiAoIWlzQXV0aG9yaXplZChhcHApKSB7XHJcbiAgICBoYW5kbGVOb3RBdXRob3JpemVkKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBjb25zdCBzdGFydERhdGUgPSBEYXRlLm5vdygpO1xyXG4gIGNvbnN0IGVsYXBzZWQgPSAoKSA9PiAoRGF0ZS5ub3coKSAtIHN0YXJ0RGF0ZSk7XHJcblxyXG4gIHRyeSB7XHJcbiAgICBhd2FpdCBhcHAucHVibGlzaChcclxuICAgICAgZXZlbnROYW1lc3BhY2Uub25CZWdpbixcclxuICAgICAgZXZlbnRDb250ZXh0LFxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBmdW5jKC4uLnBhcmFtcyk7XHJcblxyXG4gICAgYXdhaXQgcHVibGlzaENvbXBsZXRlKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgcmVzdWx0KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGF3YWl0IHB1Ymxpc2hFcnJvcihhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIGVycm9yKTtcclxuICAgIHRocm93IGVycm9yO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBhcGlXcmFwcGVyU3luYyA9IChhcHAsIGV2ZW50TmFtZXNwYWNlLCBpc0F1dGhvcml6ZWQsIGV2ZW50Q29udGV4dCwgZnVuYywgLi4ucGFyYW1zKSA9PiB7XHJcbiAgcHVzaENhbGxTdGFjayhhcHAsIGV2ZW50TmFtZXNwYWNlKTtcclxuXHJcbiAgaWYgKCFpc0F1dGhvcml6ZWQoYXBwKSkge1xyXG4gICAgaGFuZGxlTm90QXV0aG9yaXplZChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgY29uc3Qgc3RhcnREYXRlID0gRGF0ZS5ub3coKTtcclxuICBjb25zdCBlbGFwc2VkID0gKCkgPT4gKERhdGUubm93KCkgLSBzdGFydERhdGUpO1xyXG5cclxuICB0cnkge1xyXG4gICAgYXBwLnB1Ymxpc2goXHJcbiAgICAgIGV2ZW50TmFtZXNwYWNlLm9uQmVnaW4sXHJcbiAgICAgIGV2ZW50Q29udGV4dCxcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgcmVzdWx0ID0gZnVuYyguLi5wYXJhbXMpO1xyXG5cclxuICAgIHB1Ymxpc2hDb21wbGV0ZShhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIHJlc3VsdCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBwdWJsaXNoRXJyb3IoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCBlcnJvcik7XHJcbiAgICB0aHJvdyBlcnJvcjtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBoYW5kbGVOb3RBdXRob3JpemVkID0gKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSkgPT4ge1xyXG4gIGNvbnN0IGVyciA9IG5ldyBVbmF1dGhvcmlzZWRFcnJvcihgVW5hdXRob3JpemVkOiAke2V2ZW50TmFtZXNwYWNlfWApO1xyXG4gIHB1Ymxpc2hFcnJvcihhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsICgpID0+IDAsIGVycik7XHJcbiAgdGhyb3cgZXJyO1xyXG59O1xyXG5cclxuY29uc3QgcHVzaENhbGxTdGFjayA9IChhcHAsIGV2ZW50TmFtZXNwYWNlLCBzZWVkQ2FsbElkKSA9PiB7XHJcbiAgY29uc3QgY2FsbElkID0gZ2VuZXJhdGUoKTtcclxuXHJcbiAgY29uc3QgY3JlYXRlQ2FsbFN0YWNrID0gKCkgPT4gKHtcclxuICAgIHNlZWRDYWxsSWQ6ICFpc1VuZGVmaW5lZChzZWVkQ2FsbElkKVxyXG4gICAgICA/IHNlZWRDYWxsSWRcclxuICAgICAgOiBjYWxsSWQsXHJcbiAgICB0aHJlYWRDYWxsSWQ6IGNhbGxJZCxcclxuICAgIHN0YWNrOiBbXSxcclxuICB9KTtcclxuXHJcbiAgaWYgKGlzVW5kZWZpbmVkKGFwcC5jYWxscykpIHtcclxuICAgIGFwcC5jYWxscyA9IGNyZWF0ZUNhbGxTdGFjaygpO1xyXG4gIH1cclxuXHJcbiAgYXBwLmNhbGxzLnN0YWNrLnB1c2goe1xyXG4gICAgbmFtZXNwYWNlOiBldmVudE5hbWVzcGFjZSxcclxuICAgIGNhbGxJZCxcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IHBvcENhbGxTdGFjayA9IChhcHApID0+IHtcclxuICBhcHAuY2FsbHMuc3RhY2sucG9wKCk7XHJcbiAgaWYgKGFwcC5jYWxscy5zdGFjay5sZW5ndGggPT09IDApIHtcclxuICAgIGRlbGV0ZSBhcHAuY2FsbHM7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgcHVibGlzaEVycm9yID0gYXN5bmMgKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgZXJyKSA9PiB7XHJcbiAgY29uc3QgY3R4ID0gY2xvbmVEZWVwKGV2ZW50Q29udGV4dCk7XHJcbiAgY3R4LmVycm9yID0gZXJyO1xyXG4gIGN0eC5lbGFwc2VkID0gZWxhcHNlZCgpO1xyXG4gIGF3YWl0IGFwcC5wdWJsaXNoKFxyXG4gICAgZXZlbnROYW1lc3BhY2Uub25FcnJvcixcclxuICAgIGN0eCxcclxuICApO1xyXG4gIHBvcENhbGxTdGFjayhhcHApO1xyXG59O1xyXG5cclxuY29uc3QgcHVibGlzaENvbXBsZXRlID0gYXN5bmMgKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgcmVzdWx0KSA9PiB7XHJcbiAgY29uc3QgZW5kY29udGV4dCA9IGNsb25lRGVlcChldmVudENvbnRleHQpO1xyXG4gIGVuZGNvbnRleHQucmVzdWx0ID0gcmVzdWx0O1xyXG4gIGVuZGNvbnRleHQuZWxhcHNlZCA9IGVsYXBzZWQoKTtcclxuICBhd2FpdCBhcHAucHVibGlzaChcclxuICAgIGV2ZW50TmFtZXNwYWNlLm9uQ29tcGxldGUsXHJcbiAgICBlbmRjb250ZXh0LFxyXG4gICk7XHJcbiAgcG9wQ2FsbFN0YWNrKGFwcCk7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFwaVdyYXBwZXI7XHJcbiIsImltcG9ydCB7IHNwbGl0IH0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgJCB9IGZyb20gJy4vaW5kZXgnO1xyXG5cclxuY29uc3QgbG9ja092ZXJsYXBNaWxsaXNlY29uZHMgPSAxMDtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRMb2NrID0gYXN5bmMgKGFwcCwgbG9ja0ZpbGUsIHRpbWVvdXRNaWxsaXNlY29uZHMsIG1heExvY2tSZXRyaWVzLCByZXRyeUNvdW50ID0gMCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB0aW1lb3V0ID0gKGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKSlcclxuICAgICAgICAgICAgKyB0aW1lb3V0TWlsbGlzZWNvbmRzO1xyXG5cclxuICAgIGNvbnN0IGxvY2sgPSB7XHJcbiAgICAgIHRpbWVvdXQsXHJcbiAgICAgIGtleTogbG9ja0ZpbGUsXHJcbiAgICAgIHRvdGFsVGltZW91dDogdGltZW91dE1pbGxpc2Vjb25kcyxcclxuICAgIH07XHJcblxyXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVGaWxlKFxyXG4gICAgICBsb2NrRmlsZSxcclxuICAgICAgZ2V0TG9ja0ZpbGVDb250ZW50KFxyXG4gICAgICAgIGxvY2sudG90YWxUaW1lb3V0LFxyXG4gICAgICAgIGxvY2sudGltZW91dCxcclxuICAgICAgKSxcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIGxvY2s7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgaWYgKHJldHJ5Q291bnQgPT0gbWF4TG9ja1JldHJpZXMpIHsgcmV0dXJuIE5PX0xPQ0s7IH1cclxuXHJcbiAgICBjb25zdCBsb2NrID0gcGFyc2VMb2NrRmlsZUNvbnRlbnQoXHJcbiAgICAgIGxvY2tGaWxlLFxyXG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRGaWxlKGxvY2tGaWxlKSxcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgY3VycmVudEVwb2NoVGltZSA9IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKTtcclxuXHJcbiAgICBpZiAoY3VycmVudEVwb2NoVGltZSA8IGxvY2sudGltZW91dCkge1xyXG4gICAgICByZXR1cm4gTk9fTE9DSztcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUobG9ja0ZpbGUpO1xyXG4gICAgfSBjYXRjaCAoXykge1xyXG4gICAgICAvL2VtcHR5XHJcbiAgICB9XHJcblxyXG4gICAgYXdhaXQgc2xlZXBGb3JSZXRyeSgpO1xyXG5cclxuICAgIHJldHVybiBhd2FpdCBnZXRMb2NrKFxyXG4gICAgICBhcHAsIGxvY2tGaWxlLCB0aW1lb3V0TWlsbGlzZWNvbmRzLFxyXG4gICAgICBtYXhMb2NrUmV0cmllcywgcmV0cnlDb3VudCArIDEsXHJcbiAgICApO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRMb2NrRmlsZUNvbnRlbnQgPSAodG90YWxUaW1lb3V0LCBlcG9jaFRpbWUpID0+IGAke3RvdGFsVGltZW91dH06JHtlcG9jaFRpbWUudG9TdHJpbmcoKX1gO1xyXG5cclxuY29uc3QgcGFyc2VMb2NrRmlsZUNvbnRlbnQgPSAoa2V5LCBjb250ZW50KSA9PiAkKGNvbnRlbnQsIFtcclxuICBzcGxpdCgnOicpLFxyXG4gIHBhcnRzID0+ICh7XHJcbiAgICB0b3RhbFRpbWVvdXQ6IG5ldyBOdW1iZXIocGFydHNbMF0pLFxyXG4gICAgdGltZW91dDogbmV3IE51bWJlcihwYXJ0c1sxXSksXHJcbiAgICBrZXksXHJcbiAgfSksXHJcbl0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlbGVhc2VMb2NrID0gYXN5bmMgKGFwcCwgbG9jaykgPT4ge1xyXG4gIGNvbnN0IGN1cnJlbnRFcG9jaFRpbWUgPSBhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCk7XHJcbiAgLy8gb25seSByZWxlYXNlIGlmIG5vdCB0aW1lZG91dFxyXG4gIGlmIChjdXJyZW50RXBvY2hUaW1lIDwgKGxvY2sudGltZW91dCAtIGxvY2tPdmVybGFwTWlsbGlzZWNvbmRzKSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKGxvY2sua2V5KTtcclxuICAgIH0gY2F0Y2ggKF8pIHtcclxuICAgICAgLy9lbXB0eVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBleHRlbmRMb2NrID0gYXN5bmMgKGFwcCwgbG9jaykgPT4ge1xyXG4gIGNvbnN0IGN1cnJlbnRFcG9jaFRpbWUgPSBhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCk7XHJcbiAgLy8gb25seSByZWxlYXNlIGlmIG5vdCB0aW1lZG91dFxyXG4gIGlmIChjdXJyZW50RXBvY2hUaW1lIDwgKGxvY2sudGltZW91dCAtIGxvY2tPdmVybGFwTWlsbGlzZWNvbmRzKSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9jay50aW1lb3V0ID0gY3VycmVudEVwb2NoVGltZSArIGxvY2sudGltZW91dE1pbGxpc2Vjb25kcztcclxuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVGaWxlKFxyXG4gICAgICAgIGxvY2sua2V5LFxyXG4gICAgICAgIGdldExvY2tGaWxlQ29udGVudChsb2NrLnRvdGFsVGltZW91dCwgbG9jay50aW1lb3V0KSxcclxuICAgICAgKTtcclxuICAgICAgcmV0dXJuIGxvY2s7XHJcbiAgICB9IGNhdGNoIChfKSB7XHJcbiAgICAgIC8vZW1wdHlcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIE5PX0xPQ0s7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgTk9fTE9DSyA9ICdubyBsb2NrJztcclxuZXhwb3J0IGNvbnN0IGlzTm9sb2NrID0gaWQgPT4gaWQgPT09IE5PX0xPQ0s7XHJcblxyXG5jb25zdCBzbGVlcEZvclJldHJ5ID0gKCkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGxvY2tPdmVybGFwTWlsbGlzZWNvbmRzKSk7XHJcbiIsImltcG9ydCB7XHJcbiAgaXNVbmRlZmluZWQsIGlzTmFOLCBpc051bGwsXHJcbiAgcmVkdWNlLCBjb25zdGFudCwgaGVhZCwgaXNFbXB0eSxcclxuICB0YWlsLCBmaW5kSW5kZXgsIHN0YXJ0c1dpdGgsIGpvaW4sXHJcbiAgZHJvcFJpZ2h0LCBmbG93LCB0YWtlUmlnaHQsIHRyaW0sXHJcbiAgc3BsaXQsIGluY2x1ZGVzLCByZXBsYWNlLCBpc0FycmF5LFxyXG4gIGlzU3RyaW5nLCBpc0ludGVnZXIsIGlzRGF0ZSwgdG9OdW1iZXIsXHJcbn0gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgc29tZSB9IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IGV2ZW50cywgZXZlbnRzTGlzdCB9IGZyb20gJy4vZXZlbnRzJztcclxuaW1wb3J0IHsgYXBpV3JhcHBlciB9IGZyb20gJy4vYXBpV3JhcHBlcic7XHJcbmltcG9ydCB7XHJcbiAgZ2V0TG9jaywgTk9fTE9DSyxcclxuICBpc05vbG9ja1xyXG59IGZyb20gJy4vbG9jayc7XHJcblxyXG4vLyB0aGlzIGlzIHRoZSBjb21iaW5hdG9yIGZ1bmN0aW9uXHJcbmV4cG9ydCBjb25zdCAkJCA9ICguLi5mdW5jcykgPT4gYXJnID0+IGZsb3coZnVuY3MpKGFyZyk7XHJcblxyXG4vLyB0aGlzIGlzIHRoZSBwaXBlIGZ1bmN0aW9uXHJcbmV4cG9ydCBjb25zdCAkID0gKGFyZywgZnVuY3MpID0+ICQkKC4uLmZ1bmNzKShhcmcpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGtleVNlcCA9ICcvJztcclxuY29uc3QgdHJpbUtleVNlcCA9IHN0ciA9PiB0cmltKHN0ciwga2V5U2VwKTtcclxuY29uc3Qgc3BsaXRCeUtleVNlcCA9IHN0ciA9PiBzcGxpdChzdHIsIGtleVNlcCk7XHJcbmV4cG9ydCBjb25zdCBzYWZlS2V5ID0ga2V5ID0+IHJlcGxhY2UoYCR7a2V5U2VwfSR7dHJpbUtleVNlcChrZXkpfWAsIGAke2tleVNlcH0ke2tleVNlcH1gLCBrZXlTZXApO1xyXG5leHBvcnQgY29uc3Qgam9pbktleSA9ICguLi5zdHJzKSA9PiB7XHJcbiAgY29uc3QgcGFyYW1zT3JBcnJheSA9IHN0cnMubGVuZ3RoID09PSAxICYgaXNBcnJheShzdHJzWzBdKVxyXG4gICAgPyBzdHJzWzBdIDogc3RycztcclxuICByZXR1cm4gc2FmZUtleShqb2luKHBhcmFtc09yQXJyYXksIGtleVNlcCkpO1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc3BsaXRLZXkgPSAkJCh0cmltS2V5U2VwLCBzcGxpdEJ5S2V5U2VwKTtcclxuZXhwb3J0IGNvbnN0IGdldERpckZvbUtleSA9ICQkKHNwbGl0S2V5LCBkcm9wUmlnaHQsIHAgPT4gam9pbktleSguLi5wKSk7XHJcbmV4cG9ydCBjb25zdCBnZXRGaWxlRnJvbUtleSA9ICQkKHNwbGl0S2V5LCB0YWtlUmlnaHQsIGhlYWQpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbmZpZ0ZvbGRlciA9IGAke2tleVNlcH0uY29uZmlnYDtcclxuZXhwb3J0IGNvbnN0IGZpZWxkRGVmaW5pdGlvbnMgPSBqb2luS2V5KGNvbmZpZ0ZvbGRlciwgJ2ZpZWxkcy5qc29uJyk7XHJcbmV4cG9ydCBjb25zdCB0ZW1wbGF0ZURlZmluaXRpb25zID0gam9pbktleShjb25maWdGb2xkZXIsICd0ZW1wbGF0ZXMuanNvbicpO1xyXG5leHBvcnQgY29uc3QgYXBwRGVmaW5pdGlvbkZpbGUgPSBqb2luS2V5KGNvbmZpZ0ZvbGRlciwgJ2FwcERlZmluaXRpb24uanNvbicpO1xyXG5leHBvcnQgY29uc3QgZGlySW5kZXggPSBmb2xkZXJQYXRoID0+IGpvaW5LZXkoY29uZmlnRm9sZGVyLCAnZGlyJywgLi4uc3BsaXRLZXkoZm9sZGVyUGF0aCksICdkaXIuaWR4Jyk7XHJcbmV4cG9ydCBjb25zdCBnZXRJbmRleEtleUZyb21GaWxlS2V5ID0gJCQoZ2V0RGlyRm9tS2V5LCBkaXJJbmRleCk7XHJcblxyXG5leHBvcnQgY29uc3QgaWZFeGlzdHMgPSAodmFsLCBleGlzdHMsIG5vdEV4aXN0cykgPT4gKGlzVW5kZWZpbmVkKHZhbClcclxuICA/IGlzVW5kZWZpbmVkKG5vdEV4aXN0cykgPyAoKCkgPT4geyB9KSgpIDogbm90RXhpc3RzKClcclxuICA6IGV4aXN0cygpKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRPckRlZmF1bHQgPSAodmFsLCBkZWZhdWx0VmFsKSA9PiBpZkV4aXN0cyh2YWwsICgpID0+IHZhbCwgKCkgPT4gZGVmYXVsdFZhbCk7XHJcblxyXG5leHBvcnQgY29uc3Qgbm90ID0gZnVuYyA9PiB2YWwgPT4gIWZ1bmModmFsKTtcclxuZXhwb3J0IGNvbnN0IGlzRGVmaW5lZCA9IG5vdChpc1VuZGVmaW5lZCk7XHJcbmV4cG9ydCBjb25zdCBpc05vbk51bGwgPSBub3QoaXNOdWxsKTtcclxuZXhwb3J0IGNvbnN0IGlzTm90TmFOID0gbm90KGlzTmFOKTtcclxuXHJcbmV4cG9ydCBjb25zdCBhbGxUcnVlID0gKC4uLmZ1bmNBcmdzKSA9PiB2YWwgPT4gcmVkdWNlKGZ1bmNBcmdzLFxyXG4gIChyZXN1bHQsIGNvbmRpdGlvbkZ1bmMpID0+IChpc051bGwocmVzdWx0KSB8fCByZXN1bHQgPT0gdHJ1ZSkgJiYgY29uZGl0aW9uRnVuYyh2YWwpLFxyXG4gIG51bGwpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGFueVRydWUgPSAoLi4uZnVuY0FyZ3MpID0+IHZhbCA9PiByZWR1Y2UoZnVuY0FyZ3MsXHJcbiAgKHJlc3VsdCwgY29uZGl0aW9uRnVuYykgPT4gcmVzdWx0ID09IHRydWUgfHwgY29uZGl0aW9uRnVuYyh2YWwpLFxyXG4gIG51bGwpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluc2Vuc2l0aXZlRXF1YWxzID0gKHN0cjEsIHN0cjIpID0+IHN0cjEudHJpbSgpLnRvTG93ZXJDYXNlKCkgPT09IHN0cjIudHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcblxyXG5leHBvcnQgY29uc3QgaXNTb21ldGhpbmcgPSBhbGxUcnVlKGlzRGVmaW5lZCwgaXNOb25OdWxsLCBpc05vdE5hTik7XHJcbmV4cG9ydCBjb25zdCBpc05vdGhpbmcgPSBub3QoaXNTb21ldGhpbmcpO1xyXG5leHBvcnQgY29uc3QgaXNOb3RoaW5nT3JFbXB0eSA9IHYgPT4gaXNOb3RoaW5nKHYpIHx8IGlzRW1wdHkodik7XHJcbmV4cG9ydCBjb25zdCBzb21ldGhpbmdPckdldERlZmF1bHQgPSBnZXREZWZhdWx0RnVuYyA9PiB2YWwgPT4gKGlzU29tZXRoaW5nKHZhbCkgPyB2YWwgOiBnZXREZWZhdWx0RnVuYygpKTtcclxuZXhwb3J0IGNvbnN0IHNvbWV0aGluZ09yRGVmYXVsdCA9ICh2YWwsIGRlZmF1bHRWYWwpID0+IHNvbWV0aGluZ09yR2V0RGVmYXVsdChjb25zdGFudChkZWZhdWx0VmFsKSkodmFsKTtcclxuXHJcbmV4cG9ydCBjb25zdCBtYXBJZlNvbWV0aGluZ09yRGVmYXVsdCA9IChtYXBGdW5jLCBkZWZhdWx0VmFsKSA9PiB2YWwgPT4gKGlzU29tZXRoaW5nKHZhbCkgPyBtYXBGdW5jKHZhbCkgOiBkZWZhdWx0VmFsKTtcclxuXHJcbmV4cG9ydCBjb25zdCBtYXBJZlNvbWV0aGluZ09yQmxhbmsgPSBtYXBGdW5jID0+IG1hcElmU29tZXRoaW5nT3JEZWZhdWx0KG1hcEZ1bmMsICcnKTtcclxuXHJcbmV4cG9ydCBjb25zdCBub25lID0gcHJlZGljYXRlID0+IGNvbGxlY3Rpb24gPT4gIXNvbWUocHJlZGljYXRlKShjb2xsZWN0aW9uKTtcclxuXHJcbmV4cG9ydCBjb25zdCBhbGwgPSBwcmVkaWNhdGUgPT4gY29sbGVjdGlvbiA9PiBub25lKHYgPT4gIXByZWRpY2F0ZSh2KSkoY29sbGVjdGlvbik7XHJcblxyXG5leHBvcnQgY29uc3QgaXNOb3RFbXB0eSA9IG9iID0+ICFpc0VtcHR5KG9iKTtcclxuZXhwb3J0IGNvbnN0IGlzQXN5bmMgPSBmbiA9PiBmbi5jb25zdHJ1Y3Rvci5uYW1lID09PSAnQXN5bmNGdW5jdGlvbic7XHJcbmV4cG9ydCBjb25zdCBpc05vbkVtcHR5QXJyYXkgPSBhbGxUcnVlKGlzQXJyYXksIGlzTm90RW1wdHkpO1xyXG5leHBvcnQgY29uc3QgaXNOb25FbXB0eVN0cmluZyA9IGFsbFRydWUoaXNTdHJpbmcsIGlzTm90RW1wdHkpO1xyXG5leHBvcnQgY29uc3QgdHJ5T3IgPSBmYWlsRnVuYyA9PiAoZnVuYywgLi4uYXJncykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gZnVuYy5hcHBseShudWxsLCAuLi5hcmdzKTtcclxuICB9IGNhdGNoIChfKSB7XHJcbiAgICByZXR1cm4gZmFpbEZ1bmMoKTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgdHJ5QXdhaXRPciA9IGZhaWxGdW5jID0+IGFzeW5jIChmdW5jLCAuLi5hcmdzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBhd2FpdCBmdW5jLmFwcGx5KG51bGwsIC4uLmFyZ3MpO1xyXG4gIH0gY2F0Y2ggKF8pIHtcclxuICAgIHJldHVybiBhd2FpdCBmYWlsRnVuYygpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBkZWZpbmVFcnJvciA9IChmdW5jLCBlcnJvclByZWZpeCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gZnVuYygpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgZXJyLm1lc3NhZ2UgPSBgJHtlcnJvclByZWZpeH0gOiAke2Vyci5tZXNzYWdlfWA7XHJcbiAgICB0aHJvdyBlcnI7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHRyeU9ySWdub3JlID0gdHJ5T3IoKCkgPT4geyB9KTtcclxuZXhwb3J0IGNvbnN0IHRyeUF3YWl0T3JJZ25vcmUgPSB0cnlBd2FpdE9yKGFzeW5jICgpID0+IHsgfSk7XHJcbmV4cG9ydCBjb25zdCBjYXVzZXNFeGNlcHRpb24gPSAoZnVuYykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBmdW5jKCk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbiA9IGZ1bmMgPT4gIWNhdXNlc0V4Y2VwdGlvbihmdW5jKTtcclxuXHJcbmV4cG9ydCBjb25zdCBoYW5kbGVFcnJvcldpdGggPSByZXR1cm5WYWxJbkVycm9yID0+IHRyeU9yKGNvbnN0YW50KHJldHVyblZhbEluRXJyb3IpKTtcclxuXHJcbmV4cG9ydCBjb25zdCBoYW5kbGVFcnJvcldpdGhVbmRlZmluZWQgPSBoYW5kbGVFcnJvcldpdGgodW5kZWZpbmVkKTtcclxuXHJcbmV4cG9ydCBjb25zdCBzd2l0Y2hDYXNlID0gKC4uLmNhc2VzKSA9PiAodmFsdWUpID0+IHtcclxuICBjb25zdCBuZXh0Q2FzZSA9ICgpID0+IGhlYWQoY2FzZXMpWzBdKHZhbHVlKTtcclxuICBjb25zdCBuZXh0UmVzdWx0ID0gKCkgPT4gaGVhZChjYXNlcylbMV0odmFsdWUpO1xyXG5cclxuICBpZiAoaXNFbXB0eShjYXNlcykpIHJldHVybjsgLy8gdW5kZWZpbmVkXHJcbiAgaWYgKG5leHRDYXNlKCkgPT09IHRydWUpIHJldHVybiBuZXh0UmVzdWx0KCk7XHJcbiAgcmV0dXJuIHN3aXRjaENhc2UoLi4udGFpbChjYXNlcykpKHZhbHVlKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBpc1ZhbHVlID0gdmFsMSA9PiB2YWwyID0+ICh2YWwxID09PSB2YWwyKTtcclxuZXhwb3J0IGNvbnN0IGlzT25lT2YgPSAoLi4udmFscykgPT4gdmFsID0+IGluY2x1ZGVzKHZhbHMsIHZhbCk7XHJcbmV4cG9ydCBjb25zdCBkZWZhdWx0Q2FzZSA9IGNvbnN0YW50KHRydWUpO1xyXG5leHBvcnQgY29uc3QgbWVtYmVyTWF0Y2hlcyA9IChtZW1iZXIsIG1hdGNoKSA9PiBvYmogPT4gbWF0Y2gob2JqW21lbWJlcl0pO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBTdGFydHNXaXRoID0gc2VhcmNoRm9yID0+IHNlYXJjaEluID0+IHN0YXJ0c1dpdGgoc2VhcmNoSW4sIHNlYXJjaEZvcik7XHJcblxyXG5leHBvcnQgY29uc3QgY29udGFpbnMgPSB2YWwgPT4gYXJyYXkgPT4gKGZpbmRJbmRleChhcnJheSwgdiA9PiB2ID09PSB2YWwpID4gLTEpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEhhc2hDb2RlID0gKHMpID0+IHtcclxuICBsZXQgaGFzaCA9IDA7IGxldCBpOyBsZXQgY2hhcjsgbGV0XHJcbiAgICBsO1xyXG4gIGlmIChzLmxlbmd0aCA9PSAwKSByZXR1cm4gaGFzaDtcclxuICBmb3IgKGkgPSAwLCBsID0gcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgIGNoYXIgPSBzLmNoYXJDb2RlQXQoaSk7XHJcbiAgICBoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjaGFyO1xyXG4gICAgaGFzaCB8PSAwOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcclxuICB9XHJcblxyXG4gIC8vIGNvbnZlcnRpbmcgdG8gc3RyaW5nLCBidXQgZG9udCB3YW50IGEgXCItXCIgcHJlZml4ZWRcclxuICBpZiAoaGFzaCA8IDApIHsgcmV0dXJuIGBuJHsoaGFzaCAqIC0xKS50b1N0cmluZygpfWA7IH1cclxuICByZXR1cm4gaGFzaC50b1N0cmluZygpO1xyXG59O1xyXG5cclxuLy8gdGhhbmtzIHRvIGh0dHBzOi8vYmxvZy5ncm9zc21hbi5pby9ob3ctdG8td3JpdGUtYXN5bmMtYXdhaXQtd2l0aG91dC10cnktY2F0Y2gtYmxvY2tzLWluLWphdmFzY3JpcHQvXHJcbmV4cG9ydCBjb25zdCBhd0V4ID0gYXN5bmMgKHByb21pc2UpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcHJvbWlzZTtcclxuICAgIHJldHVybiBbdW5kZWZpbmVkLCByZXN1bHRdO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXR1cm4gW2Vycm9yLCB1bmRlZmluZWRdO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBpc1NhZmVJbnRlZ2VyID0gbiA9PiBpc0ludGVnZXIobilcclxuICAgICYmIG4gPD0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcclxuICAgICYmIG4gPj0gMCAtIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG5cclxuZXhwb3J0IGNvbnN0IHRvRGF0ZU9yTnVsbCA9IHMgPT4gKGlzTnVsbChzKSA/IG51bGxcclxuICA6IGlzRGF0ZShzKSA/IHMgOiBuZXcgRGF0ZShzKSk7XHJcbmV4cG9ydCBjb25zdCB0b0Jvb2xPck51bGwgPSBzID0+IChpc051bGwocykgPyBudWxsXHJcbiAgOiBzID09PSAndHJ1ZScgfHwgcyA9PT0gdHJ1ZSk7XHJcbmV4cG9ydCBjb25zdCB0b051bWJlck9yTnVsbCA9IHMgPT4gKGlzTnVsbChzKSA/IG51bGxcclxuICA6IHRvTnVtYmVyKHMpKTtcclxuXHJcbmV4cG9ydCBjb25zdCBpc0FycmF5T2ZTdHJpbmcgPSBvcHRzID0+IGlzQXJyYXkob3B0cykgJiYgYWxsKGlzU3RyaW5nKShvcHRzKTtcclxuXHJcbmV4cG9ydCBjb25zdCBwYXVzZSA9IGFzeW5jIGR1cmF0aW9uID0+IG5ldyBQcm9taXNlKHJlcyA9PiBzZXRUaW1lb3V0KHJlcywgZHVyYXRpb24pKTtcclxuXHJcbmV4cG9ydCBjb25zdCByZXRyeSA9IGFzeW5jIChmbiwgcmV0cmllcywgZGVsYXksIC4uLmFyZ3MpID0+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IGZuKC4uLmFyZ3MpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgaWYgKHJldHJpZXMgPiAxKSB7XHJcbiAgICAgIHJldHVybiBhd2FpdCBwYXVzZShkZWxheSkudGhlbihhc3luYyAoKSA9PiBhd2FpdCByZXRyeShmbiwgKHJldHJpZXMgLSAxKSwgZGVsYXksIC4uLmFyZ3MpKTtcclxuICAgIH1cclxuICAgIHRocm93IGVycjtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgeyBldmVudHMgfSBmcm9tICcuL2V2ZW50cyc7XHJcbmV4cG9ydCB7IGFwaVdyYXBwZXIsIGFwaVdyYXBwZXJTeW5jIH0gZnJvbSAnLi9hcGlXcmFwcGVyJztcclxuZXhwb3J0IHtcclxuICBnZXRMb2NrLCBOT19MT0NLLCByZWxlYXNlTG9jayxcclxuICBleHRlbmRMb2NrLCBpc05vbG9jayxcclxufSBmcm9tICcuL2xvY2snO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGlmRXhpc3RzLFxyXG4gIGdldE9yRGVmYXVsdCxcclxuICBpc0RlZmluZWQsXHJcbiAgaXNOb25OdWxsLFxyXG4gIGlzTm90TmFOLFxyXG4gIGFsbFRydWUsXHJcbiAgaXNTb21ldGhpbmcsXHJcbiAgbWFwSWZTb21ldGhpbmdPckRlZmF1bHQsXHJcbiAgbWFwSWZTb21ldGhpbmdPckJsYW5rLFxyXG4gIGNvbmZpZ0ZvbGRlcixcclxuICBmaWVsZERlZmluaXRpb25zLFxyXG4gIGlzTm90aGluZyxcclxuICBub3QsXHJcbiAgc3dpdGNoQ2FzZSxcclxuICBkZWZhdWx0Q2FzZSxcclxuICBTdGFydHNXaXRoLFxyXG4gIGNvbnRhaW5zLFxyXG4gIHRlbXBsYXRlRGVmaW5pdGlvbnMsXHJcbiAgaGFuZGxlRXJyb3JXaXRoLFxyXG4gIGhhbmRsZUVycm9yV2l0aFVuZGVmaW5lZCxcclxuICB0cnlPcixcclxuICB0cnlPcklnbm9yZSxcclxuICB0cnlBd2FpdE9yLFxyXG4gIHRyeUF3YWl0T3JJZ25vcmUsXHJcbiAgZGlySW5kZXgsXHJcbiAga2V5U2VwLFxyXG4gICQsXHJcbiAgJCQsXHJcbiAgZ2V0RGlyRm9tS2V5LFxyXG4gIGdldEZpbGVGcm9tS2V5LFxyXG4gIHNwbGl0S2V5LFxyXG4gIHNvbWV0aGluZ09yRGVmYXVsdCxcclxuICBnZXRJbmRleEtleUZyb21GaWxlS2V5LFxyXG4gIGpvaW5LZXksXHJcbiAgc29tZXRoaW5nT3JHZXREZWZhdWx0LFxyXG4gIGFwcERlZmluaXRpb25GaWxlLFxyXG4gIGlzVmFsdWUsXHJcbiAgYWxsLFxyXG4gIGlzT25lT2YsXHJcbiAgbWVtYmVyTWF0Y2hlcyxcclxuICBkZWZpbmVFcnJvcixcclxuICBhbnlUcnVlLFxyXG4gIGlzTm9uRW1wdHlBcnJheSxcclxuICBjYXVzZXNFeGNlcHRpb24sXHJcbiAgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uLFxyXG4gIG5vbmUsXHJcbiAgZ2V0SGFzaENvZGUsXHJcbiAgYXdFeCxcclxuICBhcGlXcmFwcGVyLFxyXG4gIGV2ZW50cyxcclxuICBldmVudHNMaXN0LFxyXG4gIGlzTm90aGluZ09yRW1wdHksXHJcbiAgaXNTYWZlSW50ZWdlcixcclxuICB0b051bWJlcixcclxuICB0b0RhdGU6IHRvRGF0ZU9yTnVsbCxcclxuICB0b0Jvb2w6IHRvQm9vbE9yTnVsbCxcclxuICBpc0FycmF5T2ZTdHJpbmcsXHJcbiAgZ2V0TG9jayxcclxuICBOT19MT0NLLFxyXG4gIGlzTm9sb2NrLFxyXG4gIGluc2Vuc2l0aXZlRXF1YWxzLFxyXG4gIHBhdXNlLFxyXG4gIHJldHJ5LFxyXG59O1xyXG4iLCJpbXBvcnQgeyBmaWx0ZXIsIG1hcCB9IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7ICQsIGlzU29tZXRoaW5nIH0gZnJvbSAnLi9pbmRleCc7XHJcblxyXG5leHBvcnQgY29uc3Qgc3RyaW5nTm90RW1wdHkgPSBzID0+IGlzU29tZXRoaW5nKHMpICYmIHMudHJpbSgpLmxlbmd0aCA+IDA7XHJcblxyXG5leHBvcnQgY29uc3QgbWFrZXJ1bGUgPSAoZmllbGQsIGVycm9yLCBpc1ZhbGlkKSA9PiAoeyBmaWVsZCwgZXJyb3IsIGlzVmFsaWQgfSk7XHJcblxyXG5leHBvcnQgY29uc3QgdmFsaWRhdGlvbkVycm9yID0gKHJ1bGUsIGl0ZW0pID0+ICh7IC4uLnJ1bGUsIGl0ZW0gfSk7XHJcblxyXG5leHBvcnQgY29uc3QgYXBwbHlSdWxlU2V0ID0gcnVsZVNldCA9PiBpdGVtVG9WYWxpZGF0ZSA9PiAkKHJ1bGVTZXQsIFtcclxuICBtYXAoYXBwbHlSdWxlKGl0ZW1Ub1ZhbGlkYXRlKSksXHJcbiAgZmlsdGVyKGlzU29tZXRoaW5nKSxcclxuXSk7XHJcblxyXG5leHBvcnQgY29uc3QgYXBwbHlSdWxlID0gaXRlbVRvdmFsaWRhdGUgPT4gcnVsZSA9PiAocnVsZS5pc1ZhbGlkKGl0ZW1Ub3ZhbGlkYXRlKVxyXG4gID8gbnVsbFxyXG4gIDogdmFsaWRhdGlvbkVycm9yKHJ1bGUsIGl0ZW1Ub3ZhbGlkYXRlKSk7XHJcbiIsImltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcclxuaW1wb3J0IHtcclxuICBpc1VuZGVmaW5lZCwga2V5cywgXHJcbiAgY2xvbmVEZWVwLCBpc0Z1bmN0aW9uLFxyXG59IGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IGRlZmluZUVycm9yIH0gZnJvbSAnLi4vY29tbW9uJztcclxuXHJcbmV4cG9ydCBjb25zdCBmaWx0ZXJFdmFsID0gJ0ZJTFRFUl9FVkFMVUFURSc7XHJcbmV4cG9ydCBjb25zdCBmaWx0ZXJDb21waWxlID0gJ0ZJTFRFUl9DT01QSUxFJztcclxuZXhwb3J0IGNvbnN0IG1hcEV2YWwgPSAnTUFQX0VWQUxVQVRFJztcclxuZXhwb3J0IGNvbnN0IG1hcENvbXBpbGUgPSAnTUFQX0NPTVBJTEUnO1xyXG5leHBvcnQgY29uc3QgcmVtb3ZlVW5kZWNsYXJlZEZpZWxkcyA9ICdSRU1PVkVfVU5ERUNMQVJFRF9GSUVMRFMnO1xyXG5leHBvcnQgY29uc3QgYWRkVW5NYXBwZWRGaWVsZHMgPSAnQUREX1VOTUFQUEVEX0ZJRUxEUyc7XHJcbmV4cG9ydCBjb25zdCBhZGRUaGVLZXkgPSAnQUREX0tFWSc7XHJcblxyXG5cclxuY29uc3QgZ2V0RXZhbHVhdGVSZXN1bHQgPSAoKSA9PiAoe1xyXG4gIGlzRXJyb3I6IGZhbHNlLFxyXG4gIHBhc3NlZEZpbHRlcjogdHJ1ZSxcclxuICByZXN1bHQ6IG51bGwsXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbXBpbGVGaWx0ZXIgPSBpbmRleCA9PiBjb21waWxlRXhwcmVzc2lvbihpbmRleC5maWx0ZXIpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbXBpbGVNYXAgPSBpbmRleCA9PiBjb21waWxlQ29kZShpbmRleC5tYXApO1xyXG5cclxuZXhwb3J0IGNvbnN0IHBhc3Nlc0ZpbHRlciA9IChyZWNvcmQsIGluZGV4KSA9PiB7XHJcbiAgY29uc3QgY29udGV4dCA9IHsgcmVjb3JkIH07XHJcbiAgaWYgKCFpbmRleC5maWx0ZXIpIHJldHVybiB0cnVlO1xyXG5cclxuICBjb25zdCBjb21waWxlZEZpbHRlciA9IGRlZmluZUVycm9yKFxyXG4gICAgKCkgPT4gY29tcGlsZUZpbHRlcihpbmRleCksXHJcbiAgICBmaWx0ZXJDb21waWxlLFxyXG4gICk7XHJcblxyXG4gIHJldHVybiBkZWZpbmVFcnJvcihcclxuICAgICgpID0+IGNvbXBpbGVkRmlsdGVyKGNvbnRleHQpLFxyXG4gICAgZmlsdGVyRXZhbCxcclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IG1hcFJlY29yZCA9IChyZWNvcmQsIGluZGV4KSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkQ2xvbmUgPSBjbG9uZURlZXAocmVjb3JkKTtcclxuICBjb25zdCBjb250ZXh0ID0geyByZWNvcmQ6IHJlY29yZENsb25lIH07XHJcblxyXG4gIGNvbnN0IG1hcCA9IGluZGV4Lm1hcCA/IGluZGV4Lm1hcCA6ICdyZXR1cm4gey4uLnJlY29yZH07JztcclxuXHJcbiAgY29uc3QgY29tcGlsZWRNYXAgPSBkZWZpbmVFcnJvcihcclxuICAgICgpID0+IGNvbXBpbGVDb2RlKG1hcCksXHJcbiAgICBtYXBDb21waWxlLFxyXG4gICk7XHJcblxyXG4gIGNvbnN0IG1hcHBlZCA9IGRlZmluZUVycm9yKFxyXG4gICAgKCkgPT4gY29tcGlsZWRNYXAoY29udGV4dCksXHJcbiAgICBtYXBFdmFsLFxyXG4gICk7XHJcblxyXG4gIGNvbnN0IG1hcHBlZEtleXMgPSBrZXlzKG1hcHBlZCk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXBwZWRLZXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBrZXkgPSBtYXBwZWRLZXlzW2ldO1xyXG4gICAgbWFwcGVkW2tleV0gPSBpc1VuZGVmaW5lZChtYXBwZWRba2V5XSkgPyBudWxsIDogbWFwcGVkW2tleV07XHJcbiAgICBpZiAoaXNGdW5jdGlvbihtYXBwZWRba2V5XSkpIHtcclxuICAgICAgZGVsZXRlIG1hcHBlZFtrZXldO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbWFwcGVkLmtleSA9IHJlY29yZC5rZXk7XHJcbiAgbWFwcGVkLnNvcnRLZXkgPSBpbmRleC5nZXRTb3J0S2V5XHJcbiAgICA/IGNvbXBpbGVDb2RlKGluZGV4LmdldFNvcnRLZXkpKGNvbnRleHQpXHJcbiAgICA6IHJlY29yZC5pZDtcclxuXHJcbiAgcmV0dXJuIG1hcHBlZDtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBldmFsdWF0ZSA9IHJlY29yZCA9PiAoaW5kZXgpID0+IHtcclxuICBjb25zdCByZXN1bHQgPSBnZXRFdmFsdWF0ZVJlc3VsdCgpO1xyXG5cclxuICB0cnkge1xyXG4gICAgcmVzdWx0LnBhc3NlZEZpbHRlciA9IHBhc3Nlc0ZpbHRlcihyZWNvcmQsIGluZGV4KTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJlc3VsdC5pc0Vycm9yID0gdHJ1ZTtcclxuICAgIHJlc3VsdC5wYXNzZWRGaWx0ZXIgPSBmYWxzZTtcclxuICAgIHJlc3VsdC5yZXN1bHQgPSBlcnIubWVzc2FnZTtcclxuICB9XHJcblxyXG4gIGlmICghcmVzdWx0LnBhc3NlZEZpbHRlcikgcmV0dXJuIHJlc3VsdDtcclxuXHJcbiAgdHJ5IHtcclxuICAgIHJlc3VsdC5yZXN1bHQgPSBtYXBSZWNvcmQocmVjb3JkLCBpbmRleCk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICByZXN1bHQuaXNFcnJvciA9IHRydWU7XHJcbiAgICByZXN1bHQucmVzdWx0ID0gZXJyLm1lc3NhZ2U7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZXZhbHVhdGU7XHJcbiIsImltcG9ydCB7XHJcbiAgbWFwLCBpc0VtcHR5LCBjb3VudEJ5LCBmbGF0dGVuLCBpbmNsdWRlcyxcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBqb2luLCBrZXlzIH0gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSB9IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcclxuaW1wb3J0IHsgY29tcGlsZUZpbHRlciwgY29tcGlsZU1hcCB9IGZyb20gJy4uL2luZGV4aW5nL2V2YWx1YXRlJztcclxuaW1wb3J0IHsgaXNOb25FbXB0eVN0cmluZywgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uLCAkIH0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgaXNSZWNvcmQgfSBmcm9tICcuL2hpZXJhcmNoeSc7XHJcblxyXG5leHBvcnQgY29uc3QgaW5kZXhUeXBlcyA9IHsgcmVmZXJlbmNlOiAncmVmZXJlbmNlJywgYW5jZXN0b3I6ICdhbmNlc3RvcicgfTtcclxuXHJcbmV4cG9ydCBjb25zdCBpbmRleFJ1bGVTZXQgPSBbXHJcbiAgbWFrZXJ1bGUoJ21hcCcsICdpbmRleCBoYXMgbm8gbWFwIGZ1bmN0aW9uJyxcclxuICAgIGluZGV4ID0+IGlzTm9uRW1wdHlTdHJpbmcoaW5kZXgubWFwKSksXHJcbiAgbWFrZXJ1bGUoJ21hcCcsIFwiaW5kZXgncyBtYXAgZnVuY3Rpb24gZG9lcyBub3QgY29tcGlsZVwiLFxyXG4gICAgaW5kZXggPT4gIWlzTm9uRW1wdHlTdHJpbmcoaW5kZXgubWFwKVxyXG4gICAgICAgICAgICAgICAgfHwgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uKCgpID0+IGNvbXBpbGVNYXAoaW5kZXgpKSksXHJcbiAgbWFrZXJ1bGUoJ2ZpbHRlcicsIFwiaW5kZXgncyBmaWx0ZXIgZnVuY3Rpb24gZG9lcyBub3QgY29tcGlsZVwiLFxyXG4gICAgaW5kZXggPT4gIWlzTm9uRW1wdHlTdHJpbmcoaW5kZXguZmlsdGVyKVxyXG4gICAgICAgICAgICAgICAgfHwgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uKCgpID0+IGNvbXBpbGVGaWx0ZXIoaW5kZXgpKSksXHJcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnbXVzdCBkZWNsYXJlIGEgbmFtZSBmb3IgaW5kZXgnLFxyXG4gICAgaW5kZXggPT4gaXNOb25FbXB0eVN0cmluZyhpbmRleC5uYW1lKSksXHJcbiAgbWFrZXJ1bGUoJ25hbWUnLCAndGhlcmUgaXMgYSBkdXBsaWNhdGUgbmFtZWQgaW5kZXggb24gdGhpcyBub2RlJyxcclxuICAgIGluZGV4ID0+IGlzRW1wdHkoaW5kZXgubmFtZSlcclxuICAgICAgICAgICAgICAgIHx8IGNvdW50QnkoJ25hbWUnKShpbmRleC5wYXJlbnQoKS5pbmRleGVzKVtpbmRleC5uYW1lXSA9PT0gMSksXHJcbiAgbWFrZXJ1bGUoJ2luZGV4VHlwZScsICdyZWZlcmVuY2UgaW5kZXggbWF5IG9ubHkgZXhpc3Qgb24gYSByZWNvcmQgbm9kZScsXHJcbiAgICBpbmRleCA9PiBpc1JlY29yZChpbmRleC5wYXJlbnQoKSlcclxuICAgICAgICAgICAgICAgICAgfHwgaW5kZXguaW5kZXhUeXBlICE9PSBpbmRleFR5cGVzLnJlZmVyZW5jZSksXHJcbiAgbWFrZXJ1bGUoJ2luZGV4VHlwZScsIGBpbmRleCB0eXBlIG11c3QgYmUgb25lIG9mOiAke2pvaW4oJywgJywga2V5cyhpbmRleFR5cGVzKSl9YCxcclxuICAgIGluZGV4ID0+IGluY2x1ZGVzKGluZGV4LmluZGV4VHlwZSkoa2V5cyhpbmRleFR5cGVzKSkpLFxyXG5dO1xyXG5cclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlSW5kZXggPSAoaW5kZXgsIGFsbFJlZmVyZW5jZUluZGV4ZXNPbk5vZGUpID0+IGFwcGx5UnVsZVNldChpbmRleFJ1bGVTZXQoYWxsUmVmZXJlbmNlSW5kZXhlc09uTm9kZSkpKGluZGV4KTtcclxuXHJcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFsbEluZGV4ZXMgPSBub2RlID0+ICQobm9kZS5pbmRleGVzLCBbXHJcbiAgbWFwKGkgPT4gdmFsaWRhdGVJbmRleChpLCBub2RlLmluZGV4ZXMpKSxcclxuICBmbGF0dGVuLFxyXG5dKTtcclxuIiwiaW1wb3J0IHtcclxuICBmaW5kLCBjb25zdGFudCwgbWFwLCBsYXN0LFxyXG4gIGZpcnN0LCBzcGxpdCwgaW50ZXJzZWN0aW9uLCB0YWtlLFxyXG4gIHVuaW9uLCBpbmNsdWRlcywgZmlsdGVyLCBzb21lLFxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7XHJcbiAgJCwgc3dpdGNoQ2FzZSwgaXNOb3RoaW5nLCBpc1NvbWV0aGluZyxcclxuICBkZWZhdWx0Q2FzZSwgc3BsaXRLZXksIGlzTm9uRW1wdHlTdHJpbmcsXHJcbiAgam9pbktleSwgZ2V0SGFzaENvZGUsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgaW5kZXhUeXBlcyB9IGZyb20gJy4vaW5kZXhlcyc7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0RmxhdHRlbmVkSGllcmFyY2h5ID0gKGFwcEhpZXJhcmNoeSwgdXNlQ2FjaGVkID0gdHJ1ZSkgPT4ge1xyXG4gIGlmIChpc1NvbWV0aGluZyhhcHBIaWVyYXJjaHkuZ2V0RmxhdHRlbmVkSGllcmFyY2h5KSAmJiB1c2VDYWNoZWQpIHsgcmV0dXJuIGFwcEhpZXJhcmNoeS5nZXRGbGF0dGVuZWRIaWVyYXJjaHkoKTsgfVxyXG5cclxuICBjb25zdCBmbGF0dGVuSGllcmFyY2h5ID0gKGN1cnJlbnROb2RlLCBmbGF0dGVuZWQpID0+IHtcclxuICAgIGZsYXR0ZW5lZC5wdXNoKGN1cnJlbnROb2RlKTtcclxuICAgIGlmICgoIWN1cnJlbnROb2RlLmNoaWxkcmVuXHJcbiAgICAgICAgICAgIHx8IGN1cnJlbnROb2RlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgJiYgKCFjdXJyZW50Tm9kZS5pbmRleGVzXHJcbiAgICAgICAgICAgIHx8IGN1cnJlbnROb2RlLmluZGV4ZXMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICAmJiAoIWN1cnJlbnROb2RlLmFnZ3JlZ2F0ZUdyb3Vwc1xyXG4gICAgICAgICAgICB8fCBjdXJyZW50Tm9kZS5hZ2dyZWdhdGVHcm91cHMubGVuZ3RoID09PSAwKSkge1xyXG4gICAgICByZXR1cm4gZmxhdHRlbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHVuaW9uSWZBbnkgPSBsMiA9PiBsMSA9PiB1bmlvbihsMSkoIWwyID8gW10gOiBsMik7XHJcblxyXG4gICAgY29uc3QgY2hpbGRyZW4gPSAkKFtdLCBbXHJcbiAgICAgIHVuaW9uSWZBbnkoY3VycmVudE5vZGUuY2hpbGRyZW4pLFxyXG4gICAgICB1bmlvbklmQW55KGN1cnJlbnROb2RlLmluZGV4ZXMpLFxyXG4gICAgICB1bmlvbklmQW55KGN1cnJlbnROb2RlLmFnZ3JlZ2F0ZUdyb3VwcyksXHJcbiAgICBdKTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XHJcbiAgICAgIGZsYXR0ZW5IaWVyYXJjaHkoY2hpbGQsIGZsYXR0ZW5lZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmxhdHRlbmVkO1xyXG4gIH07XHJcblxyXG4gIGFwcEhpZXJhcmNoeS5nZXRGbGF0dGVuZWRIaWVyYXJjaHkgPSAoKSA9PiBmbGF0dGVuSGllcmFyY2h5KGFwcEhpZXJhcmNoeSwgW10pO1xyXG4gIHJldHVybiBhcHBIaWVyYXJjaHkuZ2V0RmxhdHRlbmVkSGllcmFyY2h5KCk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TGFzdFBhcnRJbktleSA9IGtleSA9PiBsYXN0KHNwbGl0S2V5KGtleSkpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldE5vZGVzSW5QYXRoID0gYXBwSGllcmFyY2h5ID0+IGtleSA9PiAkKGFwcEhpZXJhcmNoeSwgW1xyXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcclxuICBmaWx0ZXIobiA9PiBuZXcgUmVnRXhwKGAke24ucGF0aFJlZ3goKX1gKS50ZXN0KGtleSkpLFxyXG5dKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRFeGFjdE5vZGVGb3JQYXRoID0gYXBwSGllcmFyY2h5ID0+IGtleSA9PiAkKGFwcEhpZXJhcmNoeSwgW1xyXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcclxuICBmaW5kKG4gPT4gbmV3IFJlZ0V4cChgJHtuLnBhdGhSZWd4KCl9JGApLnRlc3Qoa2V5KSksXHJcbl0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aCA9IGFwcEhpZXJhcmNoeSA9PiBjb2xsZWN0aW9uS2V5ID0+ICQoYXBwSGllcmFyY2h5LCBbXHJcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxyXG4gIGZpbmQobiA9PiAoaXNDb2xsZWN0aW9uUmVjb3JkKG4pXHJcbiAgICAgICAgICAgICAgICAgICAmJiBuZXcgUmVnRXhwKGAke24uY29sbGVjdGlvblBhdGhSZWd4KCl9JGApLnRlc3QoY29sbGVjdGlvbktleSkpKSxcclxuXSk7XHJcblxyXG5leHBvcnQgY29uc3QgaGFzTWF0Y2hpbmdBbmNlc3RvciA9IGFuY2VzdG9yUHJlZGljYXRlID0+IGRlY2VuZGFudE5vZGUgPT4gc3dpdGNoQ2FzZShcclxuXHJcbiAgW25vZGUgPT4gaXNOb3RoaW5nKG5vZGUucGFyZW50KCkpLFxyXG4gICAgY29uc3RhbnQoZmFsc2UpXSxcclxuXHJcbiAgW25vZGUgPT4gYW5jZXN0b3JQcmVkaWNhdGUobm9kZS5wYXJlbnQoKSksXHJcbiAgICBjb25zdGFudCh0cnVlKV0sXHJcblxyXG4gIFtkZWZhdWx0Q2FzZSxcclxuICAgIG5vZGUgPT4gaGFzTWF0Y2hpbmdBbmNlc3RvcihhbmNlc3RvclByZWRpY2F0ZSkobm9kZS5wYXJlbnQoKSldLFxyXG5cclxuKShkZWNlbmRhbnROb2RlKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXROb2RlID0gKGFwcEhpZXJhcmNoeSwgbm9kZUtleSkgPT4gJChhcHBIaWVyYXJjaHksIFtcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbiAgZmluZChuID0+IG4ubm9kZUtleSgpID09PSBub2RlS2V5XHJcbiAgICAgICAgICAgICAgICAgIHx8IChpc0NvbGxlY3Rpb25SZWNvcmQobilcclxuICAgICAgICAgICAgICAgICAgICAgICYmIG4uY29sbGVjdGlvbk5vZGVLZXkoKSA9PT0gbm9kZUtleSkpLFxyXG5dKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRDb2xsZWN0aW9uTm9kZSA9IChhcHBIaWVyYXJjaHksIG5vZGVLZXkpID0+ICQoYXBwSGllcmFyY2h5LCBbXHJcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxyXG4gIGZpbmQobiA9PiAoaXNDb2xsZWN0aW9uUmVjb3JkKG4pXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgbi5jb2xsZWN0aW9uTm9kZUtleSgpID09PSBub2RlS2V5KSksXHJcbl0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldE5vZGVCeUtleU9yTm9kZUtleSA9IChhcHBIaWVyYXJjaHksIGtleU9yTm9kZUtleSkgPT4ge1xyXG4gIGNvbnN0IG5vZGVCeUtleSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwSGllcmFyY2h5KShrZXlPck5vZGVLZXkpO1xyXG4gIHJldHVybiBpc05vdGhpbmcobm9kZUJ5S2V5KVxyXG4gICAgPyBnZXROb2RlKGFwcEhpZXJhcmNoeSwga2V5T3JOb2RlS2V5KVxyXG4gICAgOiBub2RlQnlLZXk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0Q29sbGVjdGlvbk5vZGVCeUtleU9yTm9kZUtleSA9IChhcHBIaWVyYXJjaHksIGtleU9yTm9kZUtleSkgPT4ge1xyXG4gIGNvbnN0IG5vZGVCeUtleSA9IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHBIaWVyYXJjaHkpKGtleU9yTm9kZUtleSk7XHJcbiAgcmV0dXJuIGlzTm90aGluZyhub2RlQnlLZXkpXHJcbiAgICA/IGdldENvbGxlY3Rpb25Ob2RlKGFwcEhpZXJhcmNoeSwga2V5T3JOb2RlS2V5KVxyXG4gICAgOiBub2RlQnlLZXk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgaXNOb2RlID0gKGFwcEhpZXJhcmNoeSwga2V5KSA9PiBpc1NvbWV0aGluZyhnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcEhpZXJhcmNoeSkoa2V5KSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQgPSAocGFyZW50Tm9kZUtleSwgYWN0dWFsQ2hpbGRLZXkpID0+ICQoYWN0dWFsQ2hpbGRLZXksIFtcclxuICBzcGxpdEtleSxcclxuICB0YWtlKHNwbGl0S2V5KHBhcmVudE5vZGVLZXkpLmxlbmd0aCksXHJcbiAga3MgPT4gam9pbktleSguLi5rcyksXHJcbl0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFBhcmVudEtleSA9IChrZXkpID0+IHtcclxuICByZXR1cm4gJChrZXksIFtcclxuICAgIHNwbGl0S2V5LFxyXG4gICAgdGFrZShzcGxpdEtleShrZXkpLmxlbmd0aCAtIDEpLFxyXG4gICAgam9pbktleSxcclxuICBdKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBpc0tleUFuY2VzdG9yT2YgPSBhbmNlc3RvcktleSA9PiBkZWNlbmRhbnROb2RlID0+IGhhc01hdGNoaW5nQW5jZXN0b3IocCA9PiBwLm5vZGVLZXkoKSA9PT0gYW5jZXN0b3JLZXkpKGRlY2VuZGFudE5vZGUpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGhhc05vTWF0Y2hpbmdBbmNlc3RvcnMgPSBwYXJlbnRQcmVkaWNhdGUgPT4gbm9kZSA9PiAhaGFzTWF0Y2hpbmdBbmNlc3RvcihwYXJlbnRQcmVkaWNhdGUpKG5vZGUpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGZpbmRGaWVsZCA9IChyZWNvcmROb2RlLCBmaWVsZE5hbWUpID0+IGZpbmQoZiA9PiBmLm5hbWUgPT0gZmllbGROYW1lKShyZWNvcmROb2RlLmZpZWxkcyk7XHJcblxyXG5leHBvcnQgY29uc3QgaXNBbmNlc3RvciA9IGRlY2VuZGFudCA9PiBhbmNlc3RvciA9PiBpc0tleUFuY2VzdG9yT2YoYW5jZXN0b3Iubm9kZUtleSgpKShkZWNlbmRhbnQpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGlzRGVjZW5kYW50ID0gYW5jZXN0b3IgPT4gZGVjZW5kYW50ID0+IGlzQW5jZXN0b3IoZGVjZW5kYW50KShhbmNlc3Rvcik7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkTm9kZUlkID0gcmVjb3JkS2V5ID0+ICQocmVjb3JkS2V5LCBbXHJcbiAgc3BsaXRLZXksXHJcbiAgbGFzdCxcclxuICBnZXRSZWNvcmROb2RlSWRGcm9tSWQsXHJcbl0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFJlY29yZE5vZGVJZEZyb21JZCA9IHJlY29yZElkID0+ICQocmVjb3JkSWQsIFtzcGxpdCgnLScpLCBmaXJzdCwgcGFyc2VJbnRdKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRSZWNvcmROb2RlQnlJZCA9IChoaWVyYXJjaHksIHJlY29yZElkKSA9PiAkKGhpZXJhcmNoeSwgW1xyXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcclxuICBmaW5kKG4gPT4gaXNSZWNvcmQobilcclxuICAgICAgICAgICAgICAgICAgICAmJiBuLm5vZGVJZCA9PT0gZ2V0UmVjb3JkTm9kZUlkRnJvbUlkKHJlY29yZElkKSksXHJcbl0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlY29yZE5vZGVJZElzQWxsb3dlZCA9IGluZGV4Tm9kZSA9PiBub2RlSWQgPT4gaW5kZXhOb2RlLmFsbG93ZWRSZWNvcmROb2RlSWRzLmxlbmd0aCA9PT0gMFxyXG4gICAgfHwgaW5jbHVkZXMobm9kZUlkKShpbmRleE5vZGUuYWxsb3dlZFJlY29yZE5vZGVJZHMpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlY29yZE5vZGVJc0FsbG93ZWQgPSBpbmRleE5vZGUgPT4gcmVjb3JkTm9kZSA9PiByZWNvcmROb2RlSWRJc0FsbG93ZWQoaW5kZXhOb2RlKShyZWNvcmROb2RlLm5vZGVJZCk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXggPSAoYXBwSGllcmFyY2h5LCBpbmRleE5vZGUpID0+IHtcclxuICBjb25zdCByZWNvcmROb2RlcyA9ICQoYXBwSGllcmFyY2h5LCBbXHJcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbiAgICBmaWx0ZXIoaXNSZWNvcmQpLFxyXG4gIF0pO1xyXG5cclxuICBpZiAoaXNHbG9iYWxJbmRleChpbmRleE5vZGUpKSB7XHJcbiAgICByZXR1cm4gJChyZWNvcmROb2RlcywgW1xyXG4gICAgICBmaWx0ZXIocmVjb3JkTm9kZUlzQWxsb3dlZChpbmRleE5vZGUpKSxcclxuICAgIF0pO1xyXG4gIH1cclxuXHJcbiAgaWYgKGlzQW5jZXN0b3JJbmRleChpbmRleE5vZGUpKSB7XHJcbiAgICByZXR1cm4gJChyZWNvcmROb2RlcywgW1xyXG4gICAgICBmaWx0ZXIoaXNEZWNlbmRhbnQoaW5kZXhOb2RlLnBhcmVudCgpKSksXHJcbiAgICAgIGZpbHRlcihyZWNvcmROb2RlSXNBbGxvd2VkKGluZGV4Tm9kZSkpLFxyXG4gICAgXSk7XHJcbiAgfVxyXG5cclxuICBpZiAoaXNSZWZlcmVuY2VJbmRleChpbmRleE5vZGUpKSB7XHJcbiAgICByZXR1cm4gJChyZWNvcmROb2RlcywgW1xyXG4gICAgICBmaWx0ZXIobiA9PiBzb21lKGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4KGluZGV4Tm9kZSkpKG4uZmllbGRzKSksXHJcbiAgICBdKTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0Tm9kZUZyb21Ob2RlS2V5SGFzaCA9IGhpZXJhcmNoeSA9PiBoYXNoID0+ICQoaGllcmFyY2h5LCBbXHJcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxyXG4gIGZpbmQobiA9PiBnZXRIYXNoQ29kZShuLm5vZGVLZXkoKSkgPT09IGhhc2gpLFxyXG5dKTtcclxuXHJcbmV4cG9ydCBjb25zdCBpc1JlY29yZCA9IG5vZGUgPT4gaXNTb21ldGhpbmcobm9kZSkgJiYgbm9kZS50eXBlID09PSAncmVjb3JkJztcclxuZXhwb3J0IGNvbnN0IGlzU2luZ2xlUmVjb3JkID0gbm9kZSA9PiBpc1JlY29yZChub2RlKSAmJiBub2RlLmlzU2luZ2xlO1xyXG5leHBvcnQgY29uc3QgaXNDb2xsZWN0aW9uUmVjb3JkID0gbm9kZSA9PiBpc1JlY29yZChub2RlKSAmJiAhbm9kZS5pc1NpbmdsZTtcclxuZXhwb3J0IGNvbnN0IGlzSW5kZXggPSBub2RlID0+IGlzU29tZXRoaW5nKG5vZGUpICYmIG5vZGUudHlwZSA9PT0gJ2luZGV4JztcclxuZXhwb3J0IGNvbnN0IGlzYWdncmVnYXRlR3JvdXAgPSBub2RlID0+IGlzU29tZXRoaW5nKG5vZGUpICYmIG5vZGUudHlwZSA9PT0gJ2FnZ3JlZ2F0ZUdyb3VwJztcclxuZXhwb3J0IGNvbnN0IGlzU2hhcmRlZEluZGV4ID0gbm9kZSA9PiBpc0luZGV4KG5vZGUpICYmIGlzTm9uRW1wdHlTdHJpbmcobm9kZS5nZXRTaGFyZE5hbWUpO1xyXG5leHBvcnQgY29uc3QgaXNSb290ID0gbm9kZSA9PiBpc1NvbWV0aGluZyhub2RlKSAmJiBub2RlLmlzUm9vdCgpO1xyXG5leHBvcnQgY29uc3QgaXNEZWNlbmRhbnRPZkFSZWNvcmQgPSBoYXNNYXRjaGluZ0FuY2VzdG9yKGlzUmVjb3JkKTtcclxuZXhwb3J0IGNvbnN0IGlzR2xvYmFsSW5kZXggPSBub2RlID0+IGlzSW5kZXgobm9kZSkgJiYgaXNSb290KG5vZGUucGFyZW50KCkpO1xyXG5leHBvcnQgY29uc3QgaXNSZWZlcmVuY2VJbmRleCA9IG5vZGUgPT4gaXNJbmRleChub2RlKSAmJiBub2RlLmluZGV4VHlwZSA9PT0gaW5kZXhUeXBlcy5yZWZlcmVuY2U7XHJcbmV4cG9ydCBjb25zdCBpc0FuY2VzdG9ySW5kZXggPSBub2RlID0+IGlzSW5kZXgobm9kZSkgJiYgbm9kZS5pbmRleFR5cGUgPT09IGluZGV4VHlwZXMuYW5jZXN0b3I7XHJcblxyXG5leHBvcnQgY29uc3QgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvTm9kZSA9IG5vZGUgPT4gZmllbGQgPT4gZmllbGQudHlwZSA9PT0gJ3JlZmVyZW5jZSdcclxuICAgICYmIGludGVyc2VjdGlvbihmaWVsZC50eXBlT3B0aW9ucy5yZXZlcnNlSW5kZXhOb2RlS2V5cykobWFwKGkgPT4gaS5ub2RlS2V5KCkpKG5vZGUuaW5kZXhlcykpXHJcbiAgICAgIC5sZW5ndGggPiAwO1xyXG5cclxuZXhwb3J0IGNvbnN0IGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4ID0gaW5kZXhOb2RlID0+IGZpZWxkID0+IGZpZWxkLnR5cGUgPT09ICdyZWZlcmVuY2UnXHJcbiAgICAmJiBpbnRlcnNlY3Rpb24oZmllbGQudHlwZU9wdGlvbnMucmV2ZXJzZUluZGV4Tm9kZUtleXMpKFtpbmRleE5vZGUubm9kZUtleSgpXSlcclxuICAgICAgLmxlbmd0aCA+IDA7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZ2V0TGFzdFBhcnRJbktleSxcclxuICBnZXROb2Rlc0luUGF0aCxcclxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxyXG4gIGhhc01hdGNoaW5nQW5jZXN0b3IsXHJcbiAgZ2V0Tm9kZSxcclxuICBnZXROb2RlQnlLZXlPck5vZGVLZXksXHJcbiAgaXNOb2RlLFxyXG4gIGdldEFjdHVhbEtleU9mUGFyZW50LFxyXG4gIGdldFBhcmVudEtleSxcclxuICBpc0tleUFuY2VzdG9yT2YsXHJcbiAgaGFzTm9NYXRjaGluZ0FuY2VzdG9ycyxcclxuICBmaW5kRmllbGQsXHJcbiAgaXNBbmNlc3RvcixcclxuICBpc0RlY2VuZGFudCxcclxuICBnZXRSZWNvcmROb2RlSWQsXHJcbiAgZ2V0UmVjb3JkTm9kZUlkRnJvbUlkLFxyXG4gIGdldFJlY29yZE5vZGVCeUlkLFxyXG4gIHJlY29yZE5vZGVJZElzQWxsb3dlZCxcclxuICByZWNvcmROb2RlSXNBbGxvd2VkLFxyXG4gIGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4LFxyXG4gIGdldE5vZGVGcm9tTm9kZUtleUhhc2gsXHJcbiAgaXNSZWNvcmQsXHJcbiAgaXNDb2xsZWN0aW9uUmVjb3JkLFxyXG4gIGlzSW5kZXgsXHJcbiAgaXNhZ2dyZWdhdGVHcm91cCxcclxuICBpc1NoYXJkZWRJbmRleCxcclxuICBpc1Jvb3QsXHJcbiAgaXNEZWNlbmRhbnRPZkFSZWNvcmQsXHJcbiAgaXNHbG9iYWxJbmRleCxcclxuICBpc1JlZmVyZW5jZUluZGV4LFxyXG4gIGlzQW5jZXN0b3JJbmRleCxcclxuICBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlLFxyXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4LFxyXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcclxufTtcclxuIiwiaW1wb3J0IHsgbWVyZ2UsIGhhcyB9IGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7XHJcbiAgY29uc3RhbnQsIGlzVW5kZWZpbmVkLCBcclxuICBtYXBWYWx1ZXMsIGNsb25lRGVlcCxcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBpc05vdEVtcHR5IH0gZnJvbSAnLi4vY29tbW9uJztcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRTYWZlRmllbGRQYXJzZXIgPSAodHJ5UGFyc2UsIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucykgPT4gKGZpZWxkLCByZWNvcmQpID0+IHtcclxuICBpZiAoaGFzKHJlY29yZCwgZmllbGQubmFtZSkpIHtcclxuICAgIHJldHVybiBnZXRTYWZlVmFsdWVQYXJzZXIodHJ5UGFyc2UsIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucykocmVjb3JkW2ZpZWxkLm5hbWVdKTtcclxuICB9XHJcbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZUZ1bmN0aW9uc1tmaWVsZC5nZXRVbmRlZmluZWRWYWx1ZV0oKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRTYWZlVmFsdWVQYXJzZXIgPSAodHJ5UGFyc2UsIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucykgPT4gKHZhbHVlKSA9PiB7XHJcbiAgY29uc3QgcGFyc2VkID0gdHJ5UGFyc2UodmFsdWUpO1xyXG4gIGlmIChwYXJzZWQuc3VjY2Vzcykge1xyXG4gICAgcmV0dXJuIHBhcnNlZC52YWx1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucy5kZWZhdWx0KCk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TmV3VmFsdWUgPSAodHJ5UGFyc2UsIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucykgPT4gKGZpZWxkKSA9PiB7XHJcbiAgY29uc3QgZ2V0SW5pdGlhbFZhbHVlID0gaXNVbmRlZmluZWQoZmllbGQpIHx8IGlzVW5kZWZpbmVkKGZpZWxkLmdldEluaXRpYWxWYWx1ZSlcclxuICAgID8gJ2RlZmF1bHQnXHJcbiAgICA6IGZpZWxkLmdldEluaXRpYWxWYWx1ZTtcclxuXHJcbiAgcmV0dXJuIGhhcyhkZWZhdWx0VmFsdWVGdW5jdGlvbnMsIGdldEluaXRpYWxWYWx1ZSlcclxuICAgID8gZGVmYXVsdFZhbHVlRnVuY3Rpb25zW2dldEluaXRpYWxWYWx1ZV0oKVxyXG4gICAgOiBnZXRTYWZlVmFsdWVQYXJzZXIodHJ5UGFyc2UsIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucykoZ2V0SW5pdGlhbFZhbHVlKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCB0eXBlRnVuY3Rpb25zID0gc3BlY2lmaWNGdW5jdGlvbnMgPT4gbWVyZ2Uoe1xyXG4gIHZhbHVlOiBjb25zdGFudCxcclxuICBudWxsOiBjb25zdGFudChudWxsKSxcclxufSwgc3BlY2lmaWNGdW5jdGlvbnMpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzID0gdmFsaWRhdGlvblJ1bGVzID0+IGFzeW5jIChmaWVsZCwgcmVjb3JkLCBjb250ZXh0KSA9PiB7XHJcbiAgY29uc3QgZmllbGRWYWx1ZSA9IHJlY29yZFtmaWVsZC5uYW1lXTtcclxuICBjb25zdCB2YWxpZGF0ZVJ1bGUgPSBhc3luYyByID0+ICghYXdhaXQgci5pc1ZhbGlkKGZpZWxkVmFsdWUsIGZpZWxkLnR5cGVPcHRpb25zLCBjb250ZXh0KVxyXG4gICAgPyByLmdldE1lc3NhZ2UoZmllbGRWYWx1ZSwgZmllbGQudHlwZU9wdGlvbnMpXHJcbiAgICA6ICcnKTtcclxuXHJcbiAgY29uc3QgZXJyb3JzID0gW107XHJcbiAgZm9yIChjb25zdCByIG9mIHZhbGlkYXRpb25SdWxlcykge1xyXG4gICAgY29uc3QgZXJyID0gYXdhaXQgdmFsaWRhdGVSdWxlKHIpO1xyXG4gICAgaWYgKGlzTm90RW1wdHkoZXJyKSkgZXJyb3JzLnB1c2goZXJyKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBlcnJvcnM7XHJcbn07XHJcblxyXG5jb25zdCBnZXREZWZhdWx0T3B0aW9ucyA9IG1hcFZhbHVlcyh2ID0+IHYuZGVmYXVsdFZhbHVlKTtcclxuXHJcbmV4cG9ydCBjb25zdCBtYWtlcnVsZSA9IChpc1ZhbGlkLCBnZXRNZXNzYWdlKSA9PiAoeyBpc1ZhbGlkLCBnZXRNZXNzYWdlIH0pO1xyXG5leHBvcnQgY29uc3QgcGFyc2VkRmFpbGVkID0gdmFsID0+ICh7IHN1Y2Nlc3M6IGZhbHNlLCB2YWx1ZTogdmFsIH0pO1xyXG5leHBvcnQgY29uc3QgcGFyc2VkU3VjY2VzcyA9IHZhbCA9PiAoeyBzdWNjZXNzOiB0cnVlLCB2YWx1ZTogdmFsIH0pO1xyXG5leHBvcnQgY29uc3QgZ2V0RGVmYXVsdEV4cG9ydCA9IChuYW1lLCB0cnlQYXJzZSwgZnVuY3Rpb25zLCBvcHRpb25zLCB2YWxpZGF0aW9uUnVsZXMsIHNhbXBsZVZhbHVlLCBzdHJpbmdpZnkpID0+ICh7XHJcbiAgZ2V0TmV3OiBnZXROZXdWYWx1ZSh0cnlQYXJzZSwgZnVuY3Rpb25zKSxcclxuICBzYWZlUGFyc2VGaWVsZDogZ2V0U2FmZUZpZWxkUGFyc2VyKHRyeVBhcnNlLCBmdW5jdGlvbnMpLFxyXG4gIHNhZmVQYXJzZVZhbHVlOiBnZXRTYWZlVmFsdWVQYXJzZXIodHJ5UGFyc2UsIGZ1bmN0aW9ucyksXHJcbiAgdHJ5UGFyc2UsXHJcbiAgbmFtZSxcclxuICBnZXREZWZhdWx0T3B0aW9uczogKCkgPT4gZ2V0RGVmYXVsdE9wdGlvbnMoY2xvbmVEZWVwKG9wdGlvbnMpKSxcclxuICBvcHRpb25EZWZpbml0aW9uczogb3B0aW9ucyxcclxuICB2YWxpZGF0ZVR5cGVDb25zdHJhaW50czogdmFsaWRhdGVUeXBlQ29uc3RyYWludHModmFsaWRhdGlvblJ1bGVzKSxcclxuICBzYW1wbGVWYWx1ZSxcclxuICBzdHJpbmdpZnk6IHZhbCA9PiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkXHJcbiAgICA/ICcnIDogc3RyaW5naWZ5KHZhbCkpLFxyXG4gIGdldERlZmF1bHRWYWx1ZTogZnVuY3Rpb25zLmRlZmF1bHQsXHJcbn0pO1xyXG4iLCJpbXBvcnQge1xyXG4gIGNvbnN0YW50LCBpc1N0cmluZyxcclxuICBpc051bGwsIGluY2x1ZGVzLCBpc0Jvb2xlYW4sXHJcbn0gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHtcclxuICB0eXBlRnVuY3Rpb25zLFxyXG4gIG1ha2VydWxlLCBwYXJzZWRTdWNjZXNzLCBnZXREZWZhdWx0RXhwb3J0LFxyXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xyXG5pbXBvcnQge1xyXG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLCB0b0Jvb2xPck51bGwsIHRvTnVtYmVyT3JOdWxsLFxyXG4gIGlzU2FmZUludGVnZXIsIGlzQXJyYXlPZlN0cmluZyxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5cclxuY29uc3Qgc3RyaW5nRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XHJcbiAgZGVmYXVsdDogY29uc3RhbnQobnVsbCksXHJcbn0pO1xyXG5cclxuY29uc3Qgc3RyaW5nVHJ5UGFyc2UgPSBzd2l0Y2hDYXNlKFxyXG4gIFtpc1N0cmluZywgcGFyc2VkU3VjY2Vzc10sXHJcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXHJcbiAgW2RlZmF1bHRDYXNlLCB2ID0+IHBhcnNlZFN1Y2Nlc3Modi50b1N0cmluZygpKV0sXHJcbik7XHJcblxyXG5jb25zdCBvcHRpb25zID0ge1xyXG4gIG1heExlbmd0aDoge1xyXG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxyXG4gICAgaXNWYWxpZDogbiA9PiBuID09PSBudWxsIHx8IGlzU2FmZUludGVnZXIobikgJiYgbiA+IDAsXHJcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbWF4IGxlbmd0aCBtdXN0IGJlIG51bGwgKG5vIGxpbWl0KSBvciBhIGdyZWF0ZXIgdGhhbiB6ZXJvIGludGVnZXInLFxyXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxyXG4gIH0sXHJcbiAgdmFsdWVzOiB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXHJcbiAgICBpc1ZhbGlkOiB2ID0+IHYgPT09IG51bGwgfHwgKGlzQXJyYXlPZlN0cmluZyh2KSAmJiB2Lmxlbmd0aCA+IDAgJiYgdi5sZW5ndGggPCAxMDAwMCksXHJcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiBcIid2YWx1ZXMnIG11c3QgYmUgbnVsbCAobm8gdmFsdWVzKSBvciBhbiBhcnJ5IG9mIGF0IGxlYXN0IG9uZSBzdHJpbmdcIixcclxuICAgIHBhcnNlOiBzID0+IHMsXHJcbiAgfSxcclxuICBhbGxvd0RlY2xhcmVkVmFsdWVzT25seToge1xyXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcclxuICAgIGlzVmFsaWQ6IGlzQm9vbGVhbixcclxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdhbGxvd0RlY2xhcmVkVmFsdWVzT25seSBtdXN0IGJlIHRydWUgb3IgZmFsc2UnLFxyXG4gICAgcGFyc2U6IHRvQm9vbE9yTnVsbCxcclxuICB9LFxyXG59O1xyXG5cclxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xyXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCBvcHRzLm1heExlbmd0aCA9PT0gbnVsbCB8fCB2YWwubGVuZ3RoIDw9IG9wdHMubWF4TGVuZ3RoLFxyXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlIGV4Y2VlZHMgbWF4aW11bSBsZW5ndGggb2YgJHtvcHRzLm1heExlbmd0aH1gKSxcclxuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgb3B0cy5hbGxvd0RlY2xhcmVkVmFsdWVzT25seSA9PT0gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgaW5jbHVkZXMob3B0cy52YWx1ZXMsIHZhbCksXHJcbiAgKHZhbCkgPT4gYFwiJHt2YWx9XCIgZG9lcyBub3QgZXhpc3QgaW4gdGhlIGxpc3Qgb2YgYWxsb3dlZCB2YWx1ZXNgKSxcclxuXTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXHJcbiAgJ3N0cmluZycsXHJcbiAgc3RyaW5nVHJ5UGFyc2UsXHJcbiAgc3RyaW5nRnVuY3Rpb25zLFxyXG4gIG9wdGlvbnMsXHJcbiAgdHlwZUNvbnN0cmFpbnRzLFxyXG4gICdhYmNkZScsXHJcbiAgc3RyID0+IHN0cixcclxuKTtcclxuIiwiaW1wb3J0IHsgY29uc3RhbnQsIGlzQm9vbGVhbiwgaXNOdWxsIH0gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHtcclxuICB0eXBlRnVuY3Rpb25zLFxyXG4gIG1ha2VydWxlLCBwYXJzZWRGYWlsZWQsIHBhcnNlZFN1Y2Nlc3MsXHJcbiAgZ2V0RGVmYXVsdEV4cG9ydCxcclxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcclxuaW1wb3J0IHtcclxuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgaXNPbmVPZiwgdG9Cb29sT3JOdWxsLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcblxyXG5jb25zdCBib29sRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XHJcbiAgZGVmYXVsdDogY29uc3RhbnQobnVsbCksXHJcbn0pO1xyXG5cclxuY29uc3QgYm9vbFRyeVBhcnNlID0gc3dpdGNoQ2FzZShcclxuICBbaXNCb29sZWFuLCBwYXJzZWRTdWNjZXNzXSxcclxuICBbaXNOdWxsLCBwYXJzZWRTdWNjZXNzXSxcclxuICBbaXNPbmVPZigndHJ1ZScsICcxJywgJ3llcycsICdvbicpLCAoKSA9PiBwYXJzZWRTdWNjZXNzKHRydWUpXSxcclxuICBbaXNPbmVPZignZmFsc2UnLCAnMCcsICdubycsICdvZmYnKSwgKCkgPT4gcGFyc2VkU3VjY2VzcyhmYWxzZSldLFxyXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcclxuKTtcclxuXHJcbmNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgYWxsb3dOdWxsczoge1xyXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxyXG4gICAgaXNWYWxpZDogaXNCb29sZWFuLFxyXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB0cnVlIG9yIGZhbHNlJyxcclxuICAgIHBhcnNlOiB0b0Jvb2xPck51bGwsXHJcbiAgfSxcclxufTtcclxuXHJcbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcclxuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiBvcHRzLmFsbG93TnVsbHMgPT09IHRydWUgfHwgdmFsICE9PSBudWxsLFxyXG4gICAgKCkgPT4gJ2ZpZWxkIGNhbm5vdCBiZSBudWxsJyksXHJcbl07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxyXG4gICdib29sJywgYm9vbFRyeVBhcnNlLCBib29sRnVuY3Rpb25zLFxyXG4gIG9wdGlvbnMsIHR5cGVDb25zdHJhaW50cywgdHJ1ZSwgSlNPTi5zdHJpbmdpZnksXHJcbik7XHJcbiIsImltcG9ydCB7XHJcbiAgY29uc3RhbnQsIGlzTnVtYmVyLCBpc1N0cmluZywgaXNOdWxsLFxyXG59IGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7XHJcbiAgbWFrZXJ1bGUsIHR5cGVGdW5jdGlvbnMsXHJcbiAgcGFyc2VkRmFpbGVkLCBwYXJzZWRTdWNjZXNzLCBnZXREZWZhdWx0RXhwb3J0LFxyXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xyXG5pbXBvcnQge1xyXG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLCB0b051bWJlck9yTnVsbCxcclxuICBpc1NhZmVJbnRlZ2VyLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcblxyXG5jb25zdCBudW1iZXJGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcclxuICBkZWZhdWx0OiBjb25zdGFudChudWxsKSxcclxufSk7XHJcblxyXG5jb25zdCBwYXJzZVN0cmluZ3RvTnVtYmVyT3JOdWxsID0gKHMpID0+IHtcclxuICBjb25zdCBudW0gPSBOdW1iZXIocyk7XHJcbiAgcmV0dXJuIGlzTmFOKG51bSkgPyBwYXJzZWRGYWlsZWQocykgOiBwYXJzZWRTdWNjZXNzKG51bSk7XHJcbn07XHJcblxyXG5jb25zdCBudW1iZXJUcnlQYXJzZSA9IHN3aXRjaENhc2UoXHJcbiAgW2lzTnVtYmVyLCBwYXJzZWRTdWNjZXNzXSxcclxuICBbaXNTdHJpbmcsIHBhcnNlU3RyaW5ndG9OdW1iZXJPck51bGxdLFxyXG4gIFtpc051bGwsIHBhcnNlZFN1Y2Nlc3NdLFxyXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcclxuKTtcclxuXHJcbmNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgbWF4VmFsdWU6IHtcclxuICAgIGRlZmF1bHRWYWx1ZTogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIsXHJcbiAgICBpc1ZhbGlkOiBpc1NhZmVJbnRlZ2VyLFxyXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB2YWxpZCBpbnRlZ2VyJyxcclxuICAgIHBhcnNlOiB0b051bWJlck9yTnVsbCxcclxuICB9LFxyXG4gIG1pblZhbHVlOiB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IDAgLSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUixcclxuICAgIGlzVmFsaWQ6IGlzU2FmZUludGVnZXIsXHJcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHZhbGlkIGludGVnZXInLFxyXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxyXG4gIH0sXHJcbiAgZGVjaW1hbFBsYWNlczoge1xyXG4gICAgZGVmYXVsdFZhbHVlOiAwLFxyXG4gICAgaXNWYWxpZDogbiA9PiBpc1NhZmVJbnRlZ2VyKG4pICYmIG4gPj0gMCxcclxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlcicsXHJcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXHJcbiAgfSxcclxufTtcclxuXHJcbmNvbnN0IGdldERlY2ltYWxQbGFjZXMgPSAodmFsKSA9PiB7XHJcbiAgY29uc3Qgc3BsaXREZWNpbWFsID0gdmFsLnRvU3RyaW5nKCkuc3BsaXQoJy4nKTtcclxuICBpZiAoc3BsaXREZWNpbWFsLmxlbmd0aCA9PT0gMSkgcmV0dXJuIDA7XHJcbiAgcmV0dXJuIHNwbGl0RGVjaW1hbFsxXS5sZW5ndGg7XHJcbn07XHJcblxyXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXHJcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWluVmFsdWUgPT09IG51bGwgfHwgdmFsID49IG9wdHMubWluVmFsdWUsXHJcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgKCR7dmFsLnRvU3RyaW5nKCl9KSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAke29wdHMubWluVmFsdWV9YCksXHJcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWF4VmFsdWUgPT09IG51bGwgfHwgdmFsIDw9IG9wdHMubWF4VmFsdWUsXHJcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgKCR7dmFsLnRvU3RyaW5nKCl9KSBtdXN0IGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke29wdHMubWluVmFsdWV9IG9wdGlvbnNgKSxcclxuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5kZWNpbWFsUGxhY2VzID49IGdldERlY2ltYWxQbGFjZXModmFsKSxcclxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSAoJHt2YWwudG9TdHJpbmcoKX0pIG11c3QgaGF2ZSAke29wdHMuZGVjaW1hbFBsYWNlc30gZGVjaW1hbCBwbGFjZXMgb3IgbGVzc2ApLFxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcclxuICAnbnVtYmVyJyxcclxuICBudW1iZXJUcnlQYXJzZSxcclxuICBudW1iZXJGdW5jdGlvbnMsXHJcbiAgb3B0aW9ucyxcclxuICB0eXBlQ29uc3RyYWludHMsXHJcbiAgMSxcclxuICBudW0gPT4gbnVtLnRvU3RyaW5nKCksXHJcbik7XHJcbiIsImltcG9ydCB7XHJcbiAgY29uc3RhbnQsIGlzRGF0ZSwgaXNTdHJpbmcsIGlzTnVsbCxcclxufSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQge1xyXG4gIG1ha2VydWxlLCB0eXBlRnVuY3Rpb25zLFxyXG4gIHBhcnNlZEZhaWxlZCwgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcclxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcclxuaW1wb3J0IHtcclxuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9EYXRlT3JOdWxsLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcblxyXG5jb25zdCBkYXRlRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XHJcbiAgZGVmYXVsdDogY29uc3RhbnQobnVsbCksXHJcbiAgbm93OiAoKSA9PiBuZXcgRGF0ZSgpLFxyXG59KTtcclxuXHJcbmNvbnN0IGlzVmFsaWREYXRlID0gZCA9PiBkIGluc3RhbmNlb2YgRGF0ZSAmJiAhaXNOYU4oZCk7XHJcblxyXG5jb25zdCBwYXJzZVN0cmluZ1RvRGF0ZSA9IHMgPT4gc3dpdGNoQ2FzZShcclxuICBbaXNWYWxpZERhdGUsIHBhcnNlZFN1Y2Nlc3NdLFxyXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcclxuKShuZXcgRGF0ZShzKSk7XHJcblxyXG5cclxuY29uc3QgZGF0ZVRyeVBhcnNlID0gc3dpdGNoQ2FzZShcclxuICBbaXNEYXRlLCBwYXJzZWRTdWNjZXNzXSxcclxuICBbaXNTdHJpbmcsIHBhcnNlU3RyaW5nVG9EYXRlXSxcclxuICBbaXNOdWxsLCBwYXJzZWRTdWNjZXNzXSxcclxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXHJcbik7XHJcblxyXG5jb25zdCBvcHRpb25zID0ge1xyXG4gIG1heFZhbHVlOiB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IG5ldyBEYXRlKDMyNTAzNjgwMDAwMDAwKSxcclxuICAgIGlzVmFsaWQ6IGlzRGF0ZSxcclxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgdmFsaWQgZGF0ZScsXHJcbiAgICBwYXJzZTogdG9EYXRlT3JOdWxsLFxyXG4gIH0sXHJcbiAgbWluVmFsdWU6IHtcclxuICAgIGRlZmF1bHRWYWx1ZTogbmV3IERhdGUoLTg1MjAzMzYwMDAwMDApLFxyXG4gICAgaXNWYWxpZDogaXNEYXRlLFxyXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB2YWxpZCBkYXRlJyxcclxuICAgIHBhcnNlOiB0b0RhdGVPck51bGwsXHJcbiAgfSxcclxufTtcclxuXHJcbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcclxuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5taW5WYWx1ZSA9PT0gbnVsbCB8fCB2YWwgPj0gb3B0cy5taW5WYWx1ZSxcclxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSAoJHt2YWwudG9TdHJpbmcoKX0pIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvICR7b3B0cy5taW5WYWx1ZX1gKSxcclxuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5tYXhWYWx1ZSA9PT0gbnVsbCB8fCB2YWwgPD0gb3B0cy5tYXhWYWx1ZSxcclxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSAoJHt2YWwudG9TdHJpbmcoKX0pIG11c3QgYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvICR7b3B0cy5taW5WYWx1ZX0gb3B0aW9uc2ApLFxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcclxuICAnZGF0ZXRpbWUnLFxyXG4gIGRhdGVUcnlQYXJzZSxcclxuICBkYXRlRnVuY3Rpb25zLFxyXG4gIG9wdGlvbnMsXHJcbiAgdHlwZUNvbnN0cmFpbnRzLFxyXG4gIG5ldyBEYXRlKDE5ODQsIDQsIDEpLFxyXG4gIGRhdGUgPT4gSlNPTi5zdHJpbmdpZnkoZGF0ZSkucmVwbGFjZShuZXcgUmVnRXhwKCdcIicsICdnJyksICcnKSxcclxuKTtcclxuIiwiaW1wb3J0IHsgY29uc3RhbnQsIGlzQXJyYXkgfSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQge1xyXG4gIHR5cGVGdW5jdGlvbnMsIG1ha2VydWxlLFxyXG4gIHBhcnNlZEZhaWxlZCwgZ2V0RGVmYXVsdEV4cG9ydCwgcGFyc2VkU3VjY2VzcyxcclxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcclxuaW1wb3J0IHtcclxuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9OdW1iZXJPck51bGwsXHJcbiAgJCQsIGlzU2FmZUludGVnZXIsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuXHJcbmNvbnN0IGFycmF5RnVuY3Rpb25zID0gKCkgPT4gdHlwZUZ1bmN0aW9ucyh7XHJcbiAgZGVmYXVsdDogY29uc3RhbnQoW10pLFxyXG59KTtcclxuXHJcbmNvbnN0IG1hcFRvUGFyc2VkQXJyYXJ5ID0gdHlwZSA9PiAkJChcclxuICBtYXAoaSA9PiB0eXBlLnNhZmVQYXJzZVZhbHVlKGkpKSxcclxuICBwYXJzZWRTdWNjZXNzLFxyXG4pO1xyXG5cclxuY29uc3QgYXJyYXlUcnlQYXJzZSA9IHR5cGUgPT4gc3dpdGNoQ2FzZShcclxuICBbaXNBcnJheSwgbWFwVG9QYXJzZWRBcnJhcnkodHlwZSldLFxyXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcclxuKTtcclxuXHJcbmNvbnN0IHR5cGVOYW1lID0gdHlwZSA9PiBgYXJyYXk8JHt0eXBlfT5gO1xyXG5cclxuXHJcbmNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgbWF4TGVuZ3RoOiB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IDEwMDAwLFxyXG4gICAgaXNWYWxpZDogaXNTYWZlSW50ZWdlcixcclxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlcicsXHJcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXHJcbiAgfSxcclxuICBtaW5MZW5ndGg6IHtcclxuICAgIGRlZmF1bHRWYWx1ZTogMCxcclxuICAgIGlzVmFsaWQ6IG4gPT4gaXNTYWZlSW50ZWdlcihuKSAmJiBuID49IDAsXHJcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXInLFxyXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxyXG4gIH0sXHJcbn07XHJcblxyXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXHJcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IHZhbC5sZW5ndGggPj0gb3B0cy5taW5MZW5ndGgsXHJcbiAgICAodmFsLCBvcHRzKSA9PiBgbXVzdCBjaG9vc2UgJHtvcHRzLm1pbkxlbmd0aH0gb3IgbW9yZSBvcHRpb25zYCksXHJcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IHZhbC5sZW5ndGggPD0gb3B0cy5tYXhMZW5ndGgsXHJcbiAgICAodmFsLCBvcHRzKSA9PiBgY2Fubm90IGNob29zZSBtb3JlIHRoYW4gJHtvcHRzLm1heExlbmd0aH0gb3B0aW9uc2ApLFxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgdHlwZSA9PiBnZXREZWZhdWx0RXhwb3J0KFxyXG4gIHR5cGVOYW1lKHR5cGUubmFtZSksXHJcbiAgYXJyYXlUcnlQYXJzZSh0eXBlKSxcclxuICBhcnJheUZ1bmN0aW9ucyh0eXBlKSxcclxuICBvcHRpb25zLFxyXG4gIHR5cGVDb25zdHJhaW50cyxcclxuICBbdHlwZS5zYW1wbGVWYWx1ZV0sXHJcbiAgSlNPTi5zdHJpbmdpZnksXHJcbik7XHJcbiIsImltcG9ydCB7XHJcbiAgaXNTdHJpbmcsIGlzT2JqZWN0TGlrZSxcclxuICBpc051bGwsIGhhcywgaXNFbXB0eSxcclxufSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQge1xyXG4gIHR5cGVGdW5jdGlvbnMsIG1ha2VydWxlLFxyXG4gIHBhcnNlZFN1Y2Nlc3MsIGdldERlZmF1bHRFeHBvcnQsXHJcbiAgcGFyc2VkRmFpbGVkLFxyXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xyXG5pbXBvcnQge1xyXG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLFxyXG4gIGlzTm9uRW1wdHlTdHJpbmcsIGlzQXJyYXlPZlN0cmluZyxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5cclxuY29uc3QgcmVmZXJlbmNlTm90aGluZyA9ICgpID0+ICh7IGtleTogJycgfSk7XHJcblxyXG5jb25zdCByZWZlcmVuY2VGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcclxuICBkZWZhdWx0OiByZWZlcmVuY2VOb3RoaW5nLFxyXG59KTtcclxuXHJcbmNvbnN0IGhhc1N0cmluZ1ZhbHVlID0gKG9iLCBwYXRoKSA9PiBoYXMob2IsIHBhdGgpXHJcbiAgICAmJiBpc1N0cmluZyhvYltwYXRoXSk7XHJcblxyXG5jb25zdCBpc09iamVjdFdpdGhLZXkgPSB2ID0+IGlzT2JqZWN0TGlrZSh2KVxyXG4gICAgJiYgaGFzU3RyaW5nVmFsdWUodiwgJ2tleScpO1xyXG5cclxuY29uc3QgdHJ5UGFyc2VGcm9tU3RyaW5nID0gcyA9PiB7XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBhc09iaiA9IEpTT04ucGFyc2Uocyk7XHJcbiAgICBpZihpc09iamVjdFdpdGhLZXkpIHtcclxuICAgICAgcmV0dXJuIHBhcnNlZFN1Y2Nlc3MoYXNPYmopO1xyXG4gICAgfVxyXG4gIH1cclxuICBjYXRjaChfKSB7XHJcbiAgICAvLyBFTVBUWVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHBhcnNlZEZhaWxlZChzKTtcclxufVxyXG5cclxuY29uc3QgcmVmZXJlbmNlVHJ5UGFyc2UgPSB2ID0+IHN3aXRjaENhc2UoXHJcbiAgW2lzT2JqZWN0V2l0aEtleSwgcGFyc2VkU3VjY2Vzc10sXHJcbiAgW2lzU3RyaW5nLCB0cnlQYXJzZUZyb21TdHJpbmddLFxyXG4gIFtpc051bGwsICgpID0+IHBhcnNlZFN1Y2Nlc3MocmVmZXJlbmNlTm90aGluZygpKV0sXHJcbiAgW2RlZmF1bHRDYXNlLCBwYXJzZWRGYWlsZWRdLFxyXG4pKHYpO1xyXG5cclxuY29uc3Qgb3B0aW9ucyA9IHtcclxuICBpbmRleE5vZGVLZXk6IHtcclxuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcclxuICAgIGlzVmFsaWQ6IGlzTm9uRW1wdHlTdHJpbmcsXHJcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnLFxyXG4gICAgcGFyc2U6IHMgPT4gcyxcclxuICB9LFxyXG4gIGRpc3BsYXlWYWx1ZToge1xyXG4gICAgZGVmYXVsdFZhbHVlOiAnJyxcclxuICAgIGlzVmFsaWQ6IGlzTm9uRW1wdHlTdHJpbmcsXHJcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnLFxyXG4gICAgcGFyc2U6IHMgPT4gcyxcclxuICB9LFxyXG4gIHJldmVyc2VJbmRleE5vZGVLZXlzOiB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXHJcbiAgICBpc1ZhbGlkOiB2ID0+IGlzQXJyYXlPZlN0cmluZyh2KSAmJiB2Lmxlbmd0aCA+IDAsXHJcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIG5vbi1lbXB0eSBhcnJheSBvZiBzdHJpbmdzJyxcclxuICAgIHBhcnNlOiBzID0+IHMsXHJcbiAgfSxcclxufTtcclxuXHJcbmNvbnN0IGlzRW1wdHlTdHJpbmcgPSBzID0+IGlzU3RyaW5nKHMpICYmIGlzRW1wdHkocyk7XHJcblxyXG5jb25zdCBlbnN1cmVSZWZlcmVuY2VFeGlzdHMgPSBhc3luYyAodmFsLCBvcHRzLCBjb250ZXh0KSA9PiBpc0VtcHR5U3RyaW5nKHZhbC5rZXkpXHJcbiAgICB8fCBhd2FpdCBjb250ZXh0LnJlZmVyZW5jZUV4aXN0cyhvcHRzLCB2YWwua2V5KTtcclxuXHJcbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcclxuICBtYWtlcnVsZShcclxuICAgIGVuc3VyZVJlZmVyZW5jZUV4aXN0cyxcclxuICAgICh2YWwsIG9wdHMpID0+IGBcIiR7dmFsW29wdHMuZGlzcGxheVZhbHVlXX1cIiBkb2VzIG5vdCBleGlzdCBpbiBvcHRpb25zIGxpc3QgKGtleTogJHt2YWwua2V5fSlgLFxyXG4gICksXHJcbl07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxyXG4gICdyZWZlcmVuY2UnLFxyXG4gIHJlZmVyZW5jZVRyeVBhcnNlLFxyXG4gIHJlZmVyZW5jZUZ1bmN0aW9ucyxcclxuICBvcHRpb25zLFxyXG4gIHR5cGVDb25zdHJhaW50cyxcclxuICB7IGtleTogJ2tleScsIHZhbHVlOiAndmFsdWUnIH0sXHJcbiAgSlNPTi5zdHJpbmdpZnksXHJcbik7XHJcbiIsImltcG9ydCB7XHJcbiAgbGFzdCwgaGFzLCBpc1N0cmluZywgaW50ZXJzZWN0aW9uLFxyXG4gIGlzTnVsbCwgaXNOdW1iZXIsXHJcbn0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHtcclxuICB0eXBlRnVuY3Rpb25zLCBwYXJzZWRGYWlsZWQsXHJcbiAgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcclxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcclxuaW1wb3J0IHtcclxuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgbm9uZSxcclxuICAkLCBzcGxpdEtleSxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5cclxuY29uc3QgaWxsZWdhbENoYXJhY3RlcnMgPSAnKj9cXFxcLzo8PnxcXDBcXGJcXGZcXHYnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGlzTGVnYWxGaWxlbmFtZSA9IChmaWxlUGF0aCkgPT4ge1xyXG4gIGNvbnN0IGZuID0gZmlsZU5hbWUoZmlsZVBhdGgpO1xyXG4gIHJldHVybiBmbi5sZW5ndGggPD0gMjU1XHJcbiAgICAmJiBpbnRlcnNlY3Rpb24oZm4uc3BsaXQoJycpKShpbGxlZ2FsQ2hhcmFjdGVycy5zcGxpdCgnJykpLmxlbmd0aCA9PT0gMFxyXG4gICAgJiYgbm9uZShmID0+IGYgPT09ICcuLicpKHNwbGl0S2V5KGZpbGVQYXRoKSk7XHJcbn07XHJcblxyXG5jb25zdCBmaWxlTm90aGluZyA9ICgpID0+ICh7IHJlbGF0aXZlUGF0aDogJycsIHNpemU6IDAgfSk7XHJcblxyXG5jb25zdCBmaWxlRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XHJcbiAgZGVmYXVsdDogZmlsZU5vdGhpbmcsXHJcbn0pO1xyXG5cclxuY29uc3QgZmlsZVRyeVBhcnNlID0gdiA9PiBzd2l0Y2hDYXNlKFxyXG4gIFtpc1ZhbGlkRmlsZSwgcGFyc2VkU3VjY2Vzc10sXHJcbiAgW2lzTnVsbCwgKCkgPT4gcGFyc2VkU3VjY2VzcyhmaWxlTm90aGluZygpKV0sXHJcbiAgW2RlZmF1bHRDYXNlLCBwYXJzZWRGYWlsZWRdLFxyXG4pKHYpO1xyXG5cclxuY29uc3QgZmlsZU5hbWUgPSBmaWxlUGF0aCA9PiAkKGZpbGVQYXRoLCBbXHJcbiAgc3BsaXRLZXksXHJcbiAgbGFzdCxcclxuXSk7XHJcblxyXG5jb25zdCBpc1ZhbGlkRmlsZSA9IGYgPT4gIWlzTnVsbChmKVxyXG4gICAgJiYgaGFzKCdyZWxhdGl2ZVBhdGgnKShmKSAmJiBoYXMoJ3NpemUnKShmKVxyXG4gICAgJiYgaXNOdW1iZXIoZi5zaXplKVxyXG4gICAgJiYgaXNTdHJpbmcoZi5yZWxhdGl2ZVBhdGgpXHJcbiAgICAmJiBpc0xlZ2FsRmlsZW5hbWUoZi5yZWxhdGl2ZVBhdGgpO1xyXG5cclxuY29uc3Qgb3B0aW9ucyA9IHt9O1xyXG5cclxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW107XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxyXG4gICdmaWxlJyxcclxuICBmaWxlVHJ5UGFyc2UsXHJcbiAgZmlsZUZ1bmN0aW9ucyxcclxuICBvcHRpb25zLFxyXG4gIHR5cGVDb25zdHJhaW50cyxcclxuICB7IHJlbGF0aXZlUGF0aDogJ3NvbWVfZmlsZS5qcGcnLCBzaXplOiAxMDAwIH0sXHJcbiAgSlNPTi5zdHJpbmdpZnksXHJcbik7XHJcbiIsImltcG9ydCB7XHJcbiAgYXNzaWduLCBrZXlzLCBtZXJnZSwgaGFzLFxyXG59IGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7XHJcbiAgbWFwLCBpc1N0cmluZywgaXNOdW1iZXIsXHJcbiAgaXNCb29sZWFuLCBpc0RhdGUsXHJcbiAgaXNPYmplY3QsIGlzQXJyYXksXHJcbn0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgJCB9IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IHBhcnNlZFN1Y2Nlc3MgfSBmcm9tICcuL3R5cGVIZWxwZXJzJztcclxuaW1wb3J0IHN0cmluZyBmcm9tICcuL3N0cmluZyc7XHJcbmltcG9ydCBib29sIGZyb20gJy4vYm9vbCc7XHJcbmltcG9ydCBudW1iZXIgZnJvbSAnLi9udW1iZXInO1xyXG5pbXBvcnQgZGF0ZXRpbWUgZnJvbSAnLi9kYXRldGltZSc7XHJcbmltcG9ydCBhcnJheSBmcm9tICcuL2FycmF5JztcclxuaW1wb3J0IHJlZmVyZW5jZSBmcm9tICcuL3JlZmVyZW5jZSc7XHJcbmltcG9ydCBmaWxlIGZyb20gJy4vZmlsZSc7XHJcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xyXG5cclxuY29uc3QgYWxsVHlwZXMgPSAoKSA9PiB7XHJcbiAgY29uc3QgYmFzaWNUeXBlcyA9IHtcclxuICAgIHN0cmluZywgbnVtYmVyLCBkYXRldGltZSwgYm9vbCwgcmVmZXJlbmNlLCBmaWxlLFxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGFycmF5cyA9ICQoYmFzaWNUeXBlcywgW1xyXG4gICAga2V5cyxcclxuICAgIG1hcCgoaykgPT4ge1xyXG4gICAgICBjb25zdCBrdlR5cGUgPSB7fTtcclxuICAgICAgY29uc3QgY29uY3JldGVBcnJheSA9IGFycmF5KGJhc2ljVHlwZXNba10pO1xyXG4gICAgICBrdlR5cGVbY29uY3JldGVBcnJheS5uYW1lXSA9IGNvbmNyZXRlQXJyYXk7XHJcbiAgICAgIHJldHVybiBrdlR5cGU7XHJcbiAgICB9KSxcclxuICAgIHR5cGVzID0+IGFzc2lnbih7fSwgLi4udHlwZXMpLFxyXG4gIF0pO1xyXG5cclxuICByZXR1cm4gbWVyZ2Uoe30sIGJhc2ljVHlwZXMsIGFycmF5cyk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGFsbCA9IGFsbFR5cGVzKCk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0VHlwZSA9ICh0eXBlTmFtZSkgPT4ge1xyXG4gIGlmICghaGFzKGFsbCwgdHlwZU5hbWUpKSB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBEbyBub3QgcmVjb2duaXNlIHR5cGUgJHt0eXBlTmFtZX1gKTtcclxuICByZXR1cm4gYWxsW3R5cGVOYW1lXTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRTYW1wbGVGaWVsZFZhbHVlID0gZmllbGQgPT4gZ2V0VHlwZShmaWVsZC50eXBlKS5zYW1wbGVWYWx1ZTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXROZXdGaWVsZFZhbHVlID0gZmllbGQgPT4gZ2V0VHlwZShmaWVsZC50eXBlKS5nZXROZXcoZmllbGQpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNhZmVQYXJzZUZpZWxkID0gKGZpZWxkLCByZWNvcmQpID0+IGdldFR5cGUoZmllbGQudHlwZSkuc2FmZVBhcnNlRmllbGQoZmllbGQsIHJlY29yZCk7XHJcblxyXG5leHBvcnQgY29uc3QgdmFsaWRhdGVGaWVsZFBhcnNlID0gKGZpZWxkLCByZWNvcmQpID0+IChoYXMocmVjb3JkLCBmaWVsZC5uYW1lKVxyXG4gID8gZ2V0VHlwZShmaWVsZC50eXBlKS50cnlQYXJzZShyZWNvcmRbZmllbGQubmFtZV0pXHJcbiAgOiBwYXJzZWRTdWNjZXNzKHVuZGVmaW5lZCkpOyAvLyBmaWVsZHMgbWF5IGJlIHVuZGVmaW5lZCBieSBkZWZhdWx0XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0RGVmYXVsdE9wdGlvbnMgPSB0eXBlID0+IGdldFR5cGUodHlwZSkuZ2V0RGVmYXVsdE9wdGlvbnMoKTtcclxuXHJcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyA9IGFzeW5jIChmaWVsZCwgcmVjb3JkLCBjb250ZXh0KSA9PiBhd2FpdCBnZXRUeXBlKGZpZWxkLnR5cGUpLnZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzKGZpZWxkLCByZWNvcmQsIGNvbnRleHQpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRldGVjdFR5cGUgPSAodmFsdWUpID0+IHtcclxuICBpZiAoaXNTdHJpbmcodmFsdWUpKSByZXR1cm4gc3RyaW5nO1xyXG4gIGlmIChpc0Jvb2xlYW4odmFsdWUpKSByZXR1cm4gYm9vbDtcclxuICBpZiAoaXNOdW1iZXIodmFsdWUpKSByZXR1cm4gbnVtYmVyO1xyXG4gIGlmIChpc0RhdGUodmFsdWUpKSByZXR1cm4gZGF0ZXRpbWU7XHJcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSByZXR1cm4gYXJyYXkoZGV0ZWN0VHlwZSh2YWx1ZVswXSkpO1xyXG4gIGlmIChpc09iamVjdCh2YWx1ZSlcclxuICAgICAgICYmIGhhcyh2YWx1ZSwgJ2tleScpXHJcbiAgICAgICAmJiBoYXModmFsdWUsICd2YWx1ZScpKSByZXR1cm4gcmVmZXJlbmNlO1xyXG4gIGlmIChpc09iamVjdCh2YWx1ZSlcclxuICAgICAgICAmJiBoYXModmFsdWUsICdyZWxhdGl2ZVBhdGgnKVxyXG4gICAgICAgICYmIGhhcyh2YWx1ZSwgJ3NpemUnKSkgcmV0dXJuIGZpbGU7XHJcblxyXG4gIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYGNhbm5vdCBkZXRlcm1pbmUgdHlwZTogJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSl9YCk7XHJcbn07XHJcbiIsImltcG9ydCB7IGNsb25lLCBmaW5kLCBzcGxpdCB9IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IGpvaW5LZXksICQgfSBmcm9tICcuLi9jb21tb24nO1xyXG4vLyA1IG1pbnV0ZXNcclxuZXhwb3J0IGNvbnN0IHRlbXBDb2RlRXhwaXJ5TGVuZ3RoID0gNSAqIDYwICogMTAwMDtcclxuXHJcbmV4cG9ydCBjb25zdCBBVVRIX0ZPTERFUiA9ICcvLmF1dGgnO1xyXG5leHBvcnQgY29uc3QgVVNFUlNfTElTVF9GSUxFID0gam9pbktleShBVVRIX0ZPTERFUiwgJ3VzZXJzLmpzb24nKTtcclxuZXhwb3J0IGNvbnN0IHVzZXJBdXRoRmlsZSA9IHVzZXJuYW1lID0+IGpvaW5LZXkoQVVUSF9GT0xERVIsIGBhdXRoXyR7dXNlcm5hbWV9Lmpzb25gKTtcclxuZXhwb3J0IGNvbnN0IFVTRVJTX0xPQ0tfRklMRSA9IGpvaW5LZXkoQVVUSF9GT0xERVIsICd1c2Vyc19sb2NrJyk7XHJcbmV4cG9ydCBjb25zdCBBQ0NFU1NfTEVWRUxTX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAnYWNjZXNzX2xldmVscy5qc29uJyk7XHJcbmV4cG9ydCBjb25zdCBBQ0NFU1NfTEVWRUxTX0xPQ0tfRklMRSA9IGpvaW5LZXkoQVVUSF9GT0xERVIsICdhY2Nlc3NfbGV2ZWxzX2xvY2snKTtcclxuXHJcbmV4cG9ydCBjb25zdCBwZXJtaXNzaW9uVHlwZXMgPSB7XHJcbiAgQ1JFQVRFX1JFQ09SRDogJ2NyZWF0ZSByZWNvcmQnLFxyXG4gIFVQREFURV9SRUNPUkQ6ICd1cGRhdGUgcmVjb3JkJyxcclxuICBSRUFEX1JFQ09SRDogJ3JlYWQgcmVjb3JkJyxcclxuICBERUxFVEVfUkVDT1JEOiAnZGVsZXRlIHJlY29yZCcsXHJcbiAgUkVBRF9JTkRFWDogJ3JlYWQgaW5kZXgnLFxyXG4gIE1BTkFHRV9JTkRFWDogJ21hbmFnZSBpbmRleCcsXHJcbiAgTUFOQUdFX0NPTExFQ1RJT046ICdtYW5hZ2UgY29sbGVjdGlvbicsXHJcbiAgV1JJVEVfVEVNUExBVEVTOiAnd3JpdGUgdGVtcGxhdGVzJyxcclxuICBDUkVBVEVfVVNFUjogJ2NyZWF0ZSB1c2VyJyxcclxuICBTRVRfUEFTU1dPUkQ6ICdzZXQgcGFzc3dvcmQnLFxyXG4gIENSRUFURV9URU1QT1JBUllfQUNDRVNTOiAnY3JlYXRlIHRlbXBvcmFyeSBhY2Nlc3MnLFxyXG4gIEVOQUJMRV9ESVNBQkxFX1VTRVI6ICdlbmFibGUgb3IgZGlzYWJsZSB1c2VyJyxcclxuICBXUklURV9BQ0NFU1NfTEVWRUxTOiAnd3JpdGUgYWNjZXNzIGxldmVscycsXHJcbiAgTElTVF9VU0VSUzogJ2xpc3QgdXNlcnMnLFxyXG4gIExJU1RfQUNDRVNTX0xFVkVMUzogJ2xpc3QgYWNjZXNzIGxldmVscycsXHJcbiAgRVhFQ1VURV9BQ1RJT046ICdleGVjdXRlIGFjdGlvbicsXHJcbiAgU0VUX1VTRVJfQUNDRVNTX0xFVkVMUzogJ3NldCB1c2VyIGFjY2VzcyBsZXZlbHMnLFxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFVzZXJCeU5hbWUgPSAodXNlcnMsIG5hbWUpID0+ICQodXNlcnMsIFtcclxuICBmaW5kKHUgPT4gdS5uYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUudG9Mb3dlckNhc2UoKSksXHJcbl0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IHN0cmlwVXNlck9mU2Vuc2l0aXZlU3R1ZmYgPSAodXNlcikgPT4ge1xyXG4gIGNvbnN0IHN0cmlwcGVkID0gY2xvbmUodXNlcik7XHJcbiAgZGVsZXRlIHN0cmlwcGVkLnRlbXBDb2RlO1xyXG4gIHJldHVybiBzdHJpcHBlZDtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBwYXJzZVRlbXBvcmFyeUNvZGUgPSBmdWxsQ29kZSA9PiAkKGZ1bGxDb2RlLCBbXHJcbiAgc3BsaXQoJzonKSxcclxuICBwYXJ0cyA9PiAoe1xyXG4gICAgaWQ6IHBhcnRzWzFdLFxyXG4gICAgY29kZTogcGFydHNbMl0sXHJcbiAgfSksXHJcbl0pO1xyXG4iLCJpbXBvcnQgeyB2YWx1ZXMsIGluY2x1ZGVzLCBzb21lIH0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgcGVybWlzc2lvblR5cGVzIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcclxuaW1wb3J0IHtcclxuICAkLCBpc05vdGhpbmcsIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgZ2V0Tm9kZUJ5S2V5T3JOb2RlS2V5LCBpc05vZGUgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XHJcblxyXG5leHBvcnQgY29uc3QgaXNBdXRob3JpemVkID0gYXBwID0+IChwZXJtaXNzaW9uVHlwZSwgcmVzb3VyY2VLZXkpID0+IGFwaVdyYXBwZXJTeW5jKFxyXG4gIGFwcCxcclxuICBldmVudHMuYXV0aEFwaS5pc0F1dGhvcml6ZWQsXHJcbiAgYWx3YXlzQXV0aG9yaXplZCxcclxuICB7IHJlc291cmNlS2V5LCBwZXJtaXNzaW9uVHlwZSB9LFxyXG4gIF9pc0F1dGhvcml6ZWQsIGFwcCwgcGVybWlzc2lvblR5cGUsIHJlc291cmNlS2V5LFxyXG4pO1xyXG5cclxuZXhwb3J0IGNvbnN0IF9pc0F1dGhvcml6ZWQgPSAoYXBwLCBwZXJtaXNzaW9uVHlwZSwgcmVzb3VyY2VLZXkpID0+IHtcclxuICBpZiAoIWFwcC51c2VyKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBjb25zdCB2YWxpZFR5cGUgPSAkKHBlcm1pc3Npb25UeXBlcywgW1xyXG4gICAgdmFsdWVzLFxyXG4gICAgaW5jbHVkZXMocGVybWlzc2lvblR5cGUpLFxyXG4gIF0pO1xyXG5cclxuICBpZiAoIXZhbGlkVHlwZSkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgcGVybU1hdGNoZXNSZXNvdXJjZSA9ICh1c2VycGVybSkgPT4ge1xyXG4gICAgY29uc3Qgbm9kZUtleSA9IGlzTm90aGluZyhyZXNvdXJjZUtleSlcclxuICAgICAgPyBudWxsXHJcbiAgICAgIDogaXNOb2RlKGFwcC5oaWVyYXJjaHksIHJlc291cmNlS2V5KVxyXG4gICAgICAgID8gZ2V0Tm9kZUJ5S2V5T3JOb2RlS2V5KFxyXG4gICAgICAgICAgYXBwLmhpZXJhcmNoeSwgcmVzb3VyY2VLZXksXHJcbiAgICAgICAgKS5ub2RlS2V5KClcclxuICAgICAgICA6IHJlc291cmNlS2V5O1xyXG5cclxuICAgIHJldHVybiAodXNlcnBlcm0udHlwZSA9PT0gcGVybWlzc2lvblR5cGUpXHJcbiAgICAgICAgJiYgKFxyXG4gICAgICAgICAgaXNOb3RoaW5nKHJlc291cmNlS2V5KVxyXG4gICAgICAgICAgICB8fCBub2RlS2V5ID09PSB1c2VycGVybS5ub2RlS2V5XHJcbiAgICAgICAgKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gJChhcHAudXNlci5wZXJtaXNzaW9ucywgW1xyXG4gICAgc29tZShwZXJtTWF0Y2hlc1Jlc291cmNlKSxcclxuICBdKTtcclxufTtcclxuIiwiaW1wb3J0IHsgcGVybWlzc2lvblR5cGVzIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcclxuaW1wb3J0IHsgaXNBdXRob3JpemVkIH0gZnJvbSAnLi9pc0F1dGhvcml6ZWQnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHRlbXBvcmFyeUFjY2Vzc1Blcm1pc3Npb25zID0gKCkgPT4gKFt7IHR5cGU6IHBlcm1pc3Npb25UeXBlcy5TRVRfUEFTU1dPUkQgfV0pO1xyXG5cclxuY29uc3Qgbm9kZVBlcm1pc3Npb24gPSB0eXBlID0+ICh7XHJcbiAgYWRkOiAobm9kZUtleSwgYWNjZXNzTGV2ZWwpID0+IGFjY2Vzc0xldmVsLnBlcm1pc3Npb25zLnB1c2goeyB0eXBlLCBub2RlS2V5IH0pLFxyXG4gIGlzQXV0aG9yaXplZDogcmVzb3VyY2VLZXkgPT4gYXBwID0+IGlzQXV0aG9yaXplZChhcHApKHR5cGUsIHJlc291cmNlS2V5KSxcclxuICBpc05vZGU6IHRydWUsXHJcbiAgZ2V0OiBub2RlS2V5ID0+ICh7IHR5cGUsIG5vZGVLZXkgfSksXHJcbn0pO1xyXG5cclxuY29uc3Qgc3RhdGljUGVybWlzc2lvbiA9IHR5cGUgPT4gKHtcclxuICBhZGQ6IGFjY2Vzc0xldmVsID0+IGFjY2Vzc0xldmVsLnBlcm1pc3Npb25zLnB1c2goeyB0eXBlIH0pLFxyXG4gIGlzQXV0aG9yaXplZDogYXBwID0+IGlzQXV0aG9yaXplZChhcHApKHR5cGUpLFxyXG4gIGlzTm9kZTogZmFsc2UsXHJcbiAgZ2V0OiAoKSA9PiAoeyB0eXBlIH0pLFxyXG59KTtcclxuXHJcbmNvbnN0IGNyZWF0ZVJlY29yZCA9IG5vZGVQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfUkVDT1JEKTtcclxuXHJcbmNvbnN0IHVwZGF0ZVJlY29yZCA9IG5vZGVQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5VUERBVEVfUkVDT1JEKTtcclxuXHJcbmNvbnN0IGRlbGV0ZVJlY29yZCA9IG5vZGVQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5ERUxFVEVfUkVDT1JEKTtcclxuXHJcbmNvbnN0IHJlYWRSZWNvcmQgPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuUkVBRF9SRUNPUkQpO1xyXG5cclxuY29uc3Qgd3JpdGVUZW1wbGF0ZXMgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5XUklURV9URU1QTEFURVMpO1xyXG5cclxuY29uc3QgY3JlYXRlVXNlciA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkNSRUFURV9VU0VSKTtcclxuXHJcbmNvbnN0IHNldFBhc3N3b3JkID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuU0VUX1BBU1NXT1JEKTtcclxuXHJcbmNvbnN0IHJlYWRJbmRleCA9IG5vZGVQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5SRUFEX0lOREVYKTtcclxuXHJcbmNvbnN0IG1hbmFnZUluZGV4ID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuTUFOQUdFX0lOREVYKTtcclxuXHJcbmNvbnN0IG1hbmFnZUNvbGxlY3Rpb24gPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5NQU5BR0VfQ09MTEVDVElPTik7XHJcblxyXG5jb25zdCBjcmVhdGVUZW1wb3JhcnlBY2Nlc3MgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfVEVNUE9SQVJZX0FDQ0VTUyk7XHJcblxyXG5jb25zdCBlbmFibGVEaXNhYmxlVXNlciA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkVOQUJMRV9ESVNBQkxFX1VTRVIpO1xyXG5cclxuY29uc3Qgd3JpdGVBY2Nlc3NMZXZlbHMgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5XUklURV9BQ0NFU1NfTEVWRUxTKTtcclxuXHJcbmNvbnN0IGxpc3RVc2VycyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkxJU1RfVVNFUlMpO1xyXG5cclxuY29uc3QgbGlzdEFjY2Vzc0xldmVscyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkxJU1RfQUNDRVNTX0xFVkVMUyk7XHJcblxyXG5jb25zdCBzZXRVc2VyQWNjZXNzTGV2ZWxzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuU0VUX1VTRVJfQUNDRVNTX0xFVkVMUyk7XHJcblxyXG5jb25zdCBleGVjdXRlQWN0aW9uID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkVYRUNVVEVfQUNUSU9OKTtcclxuXHJcbmV4cG9ydCBjb25zdCBhbHdheXNBdXRob3JpemVkID0gKCkgPT4gdHJ1ZTtcclxuXHJcbmV4cG9ydCBjb25zdCBwZXJtaXNzaW9uID0ge1xyXG4gIGNyZWF0ZVJlY29yZCxcclxuICB1cGRhdGVSZWNvcmQsXHJcbiAgZGVsZXRlUmVjb3JkLFxyXG4gIHJlYWRSZWNvcmQsXHJcbiAgd3JpdGVUZW1wbGF0ZXMsXHJcbiAgY3JlYXRlVXNlcixcclxuICBzZXRQYXNzd29yZCxcclxuICByZWFkSW5kZXgsXHJcbiAgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzLFxyXG4gIGVuYWJsZURpc2FibGVVc2VyLFxyXG4gIHdyaXRlQWNjZXNzTGV2ZWxzLFxyXG4gIGxpc3RVc2VycyxcclxuICBsaXN0QWNjZXNzTGV2ZWxzLFxyXG4gIG1hbmFnZUluZGV4LFxyXG4gIG1hbmFnZUNvbGxlY3Rpb24sXHJcbiAgZXhlY3V0ZUFjdGlvbixcclxuICBzZXRVc2VyQWNjZXNzTGV2ZWxzLFxyXG59O1xyXG4iLCJpbXBvcnQge1xyXG4gIGtleUJ5LCBtYXBWYWx1ZXMsXHJcbn0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcclxuaW1wb3J0IHsgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHsgZ2V0TmV3RmllbGRWYWx1ZSB9IGZyb20gJy4uL3R5cGVzJztcclxuaW1wb3J0IHtcclxuICAkLCBqb2luS2V5LCBzYWZlS2V5LCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcclxuXHJcbmV4cG9ydCBjb25zdCBnZXROZXcgPSBhcHAgPT4gKGNvbGxlY3Rpb25LZXksIHJlY29yZFR5cGVOYW1lKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldFJlY29yZE5vZGUoYXBwLCBjb2xsZWN0aW9uS2V5LCByZWNvcmRUeXBlTmFtZSk7XHJcbiAgcmV0dXJuIGFwaVdyYXBwZXJTeW5jKFxyXG4gICAgYXBwLFxyXG4gICAgZXZlbnRzLnJlY29yZEFwaS5nZXROZXcsXHJcbiAgICBwZXJtaXNzaW9uLmNyZWF0ZVJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkTm9kZS5ub2RlS2V5KCkpLFxyXG4gICAgeyBjb2xsZWN0aW9uS2V5LCByZWNvcmRUeXBlTmFtZSB9LFxyXG4gICAgX2dldE5ldywgcmVjb3JkTm9kZSwgY29sbGVjdGlvbktleSxcclxuICApO1xyXG59O1xyXG5cclxuY29uc3QgX2dldE5ldyA9IChyZWNvcmROb2RlLCBjb2xsZWN0aW9uS2V5KSA9PiBjb25zdHJ1Y3RSZWNvcmQocmVjb3JkTm9kZSwgZ2V0TmV3RmllbGRWYWx1ZSwgY29sbGVjdGlvbktleSk7XHJcblxyXG5jb25zdCBnZXRSZWNvcmROb2RlID0gKGFwcCwgY29sbGVjdGlvbktleSkgPT4ge1xyXG4gIGNvbGxlY3Rpb25LZXkgPSBzYWZlS2V5KGNvbGxlY3Rpb25LZXkpO1xyXG4gIHJldHVybiBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwLmhpZXJhcmNoeSkoY29sbGVjdGlvbktleSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TmV3Q2hpbGQgPSBhcHAgPT4gKHJlY29yZEtleSwgY29sbGVjdGlvbk5hbWUsIHJlY29yZFR5cGVOYW1lKSA9PiBcclxuICBnZXROZXcoYXBwKShqb2luS2V5KHJlY29yZEtleSwgY29sbGVjdGlvbk5hbWUpLCByZWNvcmRUeXBlTmFtZSk7XHJcblxyXG5leHBvcnQgY29uc3QgY29uc3RydWN0UmVjb3JkID0gKHJlY29yZE5vZGUsIGdldEZpZWxkVmFsdWUsIGNvbGxlY3Rpb25LZXkpID0+IHtcclxuICBjb25zdCByZWNvcmQgPSAkKHJlY29yZE5vZGUuZmllbGRzLCBbXHJcbiAgICBrZXlCeSgnbmFtZScpLFxyXG4gICAgbWFwVmFsdWVzKGdldEZpZWxkVmFsdWUpLFxyXG4gIF0pO1xyXG5cclxuICByZWNvcmQuaWQgPSBgJHtyZWNvcmROb2RlLm5vZGVJZH0tJHtnZW5lcmF0ZSgpfWA7XHJcbiAgcmVjb3JkLmtleSA9IGpvaW5LZXkoY29sbGVjdGlvbktleSwgcmVjb3JkLmlkKTtcclxuICByZWNvcmQuaXNOZXcgPSB0cnVlO1xyXG4gIHJlY29yZC50eXBlID0gcmVjb3JkTm9kZS5uYW1lO1xyXG4gIHJldHVybiByZWNvcmQ7XHJcbn07XHJcbiIsImltcG9ydCB7XHJcbiAga2V5QnksIG1hcFZhbHVlcywgZmlsdGVyLCBcclxuICBtYXAsIGluY2x1ZGVzLCBsYXN0LFxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IGdldEV4YWN0Tm9kZUZvclBhdGgsIGdldE5vZGUgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBzYWZlUGFyc2VGaWVsZCB9IGZyb20gJy4uL3R5cGVzJztcclxuaW1wb3J0IHtcclxuICAkLCBzcGxpdEtleSwgc2FmZUtleSwgaXNOb25FbXB0eVN0cmluZyxcclxuICBhcGlXcmFwcGVyLCBldmVudHMsIGpvaW5LZXksXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgbWFwUmVjb3JkIH0gZnJvbSAnLi4vaW5kZXhpbmcvZXZhbHVhdGUnO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkRmlsZU5hbWUgPSBrZXkgPT4gam9pbktleShrZXksICdyZWNvcmQuanNvbicpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGxvYWQgPSBhcHAgPT4gYXN5bmMga2V5ID0+IGFwaVdyYXBwZXIoXHJcbiAgYXBwLFxyXG4gIGV2ZW50cy5yZWNvcmRBcGkubG9hZCxcclxuICBwZXJtaXNzaW9uLnJlYWRSZWNvcmQuaXNBdXRob3JpemVkKGtleSksXHJcbiAgeyBrZXkgfSxcclxuICBfbG9hZCwgYXBwLCBrZXksXHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgX2xvYWQgPSBhc3luYyAoYXBwLCBrZXksIGtleVN0YWNrID0gW10pID0+IHtcclxuICBrZXkgPSBzYWZlS2V5KGtleSk7XHJcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoa2V5KTtcclxuICBjb25zdCBzdG9yZWREYXRhID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcclxuICAgIGdldFJlY29yZEZpbGVOYW1lKGtleSksXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgbG9hZGVkUmVjb3JkID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xyXG4gICAga2V5QnkoJ25hbWUnKSxcclxuICAgIG1hcFZhbHVlcyhmID0+IHNhZmVQYXJzZUZpZWxkKGYsIHN0b3JlZERhdGEpKSxcclxuICBdKTtcclxuXHJcbiAgY29uc3QgbmV3S2V5U3RhY2sgPSBbLi4ua2V5U3RhY2ssIGtleV07XHJcblxyXG4gIGNvbnN0IHJlZmVyZW5jZXMgPSAkKHJlY29yZE5vZGUuZmllbGRzLCBbXHJcbiAgICBmaWx0ZXIoZiA9PiBmLnR5cGUgPT09ICdyZWZlcmVuY2UnXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgaXNOb25FbXB0eVN0cmluZyhsb2FkZWRSZWNvcmRbZi5uYW1lXS5rZXkpXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgIWluY2x1ZGVzKGxvYWRlZFJlY29yZFtmLm5hbWVdLmtleSkobmV3S2V5U3RhY2spKSxcclxuICAgIG1hcChmID0+ICh7XHJcbiAgICAgIHByb21pc2U6IF9sb2FkKGFwcCwgbG9hZGVkUmVjb3JkW2YubmFtZV0ua2V5LCBuZXdLZXlTdGFjayksXHJcbiAgICAgIGluZGV4OiBnZXROb2RlKGFwcC5oaWVyYXJjaHksIGYudHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5KSxcclxuICAgICAgZmllbGQ6IGYsXHJcbiAgICB9KSksXHJcbiAgXSk7XHJcblxyXG4gIGlmIChyZWZlcmVuY2VzLmxlbmd0aCA+IDApIHtcclxuICAgIGNvbnN0IHJlZlJlY29yZHMgPSBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgbWFwKHAgPT4gcC5wcm9taXNlKShyZWZlcmVuY2VzKSxcclxuICAgICk7XHJcblxyXG4gICAgZm9yIChjb25zdCByZWYgb2YgcmVmZXJlbmNlcykge1xyXG4gICAgICBsb2FkZWRSZWNvcmRbcmVmLmZpZWxkLm5hbWVdID0gbWFwUmVjb3JkKFxyXG4gICAgICAgIHJlZlJlY29yZHNbcmVmZXJlbmNlcy5pbmRleE9mKHJlZildLFxyXG4gICAgICAgIHJlZi5pbmRleCxcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvYWRlZFJlY29yZC50cmFuc2FjdGlvbklkID0gc3RvcmVkRGF0YS50cmFuc2FjdGlvbklkO1xyXG4gIGxvYWRlZFJlY29yZC5pc05ldyA9IGZhbHNlO1xyXG4gIGxvYWRlZFJlY29yZC5rZXkgPSBrZXk7XHJcbiAgbG9hZGVkUmVjb3JkLmlkID0gJChrZXksIFtzcGxpdEtleSwgbGFzdF0pO1xyXG4gIGxvYWRlZFJlY29yZC50eXBlID0gcmVjb3JkTm9kZS5uYW1lO1xyXG4gIHJldHVybiBsb2FkZWRSZWNvcmQ7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBsb2FkO1xyXG4iLCIvLyBhZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2RleDRlci9qcy1wcm9taXNlLXJlYWRhYmxlXHJcbi8vIHRoYW5rcyA6KVxyXG4gIFxyXG5leHBvcnQgY29uc3QgcHJvbWlzZVJlYWRhYmxlU3RyZWFtID0gc3RyZWFtID0+IHtcclxuICAgXHJcbiAgICBsZXQgX2Vycm9yZWQ7XHJcblxyXG4gICAgY29uc3QgX2Vycm9ySGFuZGxlciA9IGVyciA9PiB7XHJcbiAgICAgICAgX2Vycm9yZWQgPSBlcnI7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0cmVhbS5vbihcImVycm9yXCIsIF9lcnJvckhhbmRsZXIpO1xyXG4gIFxyXG4gICAgY29uc3QgcmVhZCA9IChzaXplKSA9PiB7XHJcbiAgXHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgaWYgKF9lcnJvcmVkKSB7XHJcbiAgICAgICAgICBjb25zdCBlcnIgPSBfZXJyb3JlZDtcclxuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpXHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGlmICghc3RyZWFtLnJlYWRhYmxlIHx8IHN0cmVhbS5jbG9zZWQgfHwgc3RyZWFtLmRlc3Ryb3llZCkge1xyXG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgY29uc3QgcmVhZGFibGVIYW5kbGVyID0gKCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgY2h1bmsgPSBzdHJlYW0ucmVhZChzaXplKTtcclxuICBcclxuICAgICAgICAgIGlmIChjaHVuaykge1xyXG4gICAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcclxuICAgICAgICAgICAgcmVzb2x2ZShjaHVuayk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGNvbnN0IGNsb3NlSGFuZGxlciA9ICgpID0+IHtcclxuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBjb25zdCBlbmRIYW5kbGVyID0gKCkgPT4ge1xyXG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IChlcnIpID0+IHtcclxuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgY29uc3QgcmVtb3ZlTGlzdGVuZXJzID0gKCkgPT4ge1xyXG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiY2xvc2VcIiwgY2xvc2VIYW5kbGVyKTtcclxuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XHJcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlbmRcIiwgZW5kSGFuZGxlcik7XHJcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJyZWFkYWJsZVwiLCByZWFkYWJsZUhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBzdHJlYW0ub24oXCJjbG9zZVwiLCBjbG9zZUhhbmRsZXIpO1xyXG4gICAgICAgIHN0cmVhbS5vbihcImVuZFwiLCBlbmRIYW5kbGVyKTtcclxuICAgICAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xyXG4gICAgICAgIHN0cmVhbS5vbihcInJlYWRhYmxlXCIsIHJlYWRhYmxlSGFuZGxlcik7XHJcbiAgXHJcbiAgICAgICAgcmVhZGFibGVIYW5kbGVyKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIFxyXG4gIFxyXG4gICAgY29uc3QgZGVzdHJveSA9ICgpID0+IHtcclxuICAgICAgaWYgKHN0cmVhbSkge1xyXG4gICAgICAgIGlmIChfZXJyb3JIYW5kbGVyKSB7XHJcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBfZXJyb3JIYW5kbGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzdHJlYW0uZGVzdHJveSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICBzdHJlYW0uZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuICBcclxuICAgIHJldHVybiB7cmVhZCwgZGVzdHJveSwgc3RyZWFtfTtcclxuICB9XHJcbiAgXHJcbiAgZXhwb3J0IGRlZmF1bHQgcHJvbWlzZVJlYWRhYmxlU3RyZWFtXHJcbiAgIiwiaW1wb3J0IHsgY29tcGlsZUNvZGUgfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XHJcbmltcG9ydCB7XHJcbiAgZmlsdGVyLCBpbmNsdWRlcywgbWFwLCBsYXN0LFxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7XHJcbiAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQsIGlzR2xvYmFsSW5kZXgsXHJcbiAgZ2V0UGFyZW50S2V5LCBpc1NoYXJkZWRJbmRleCxcclxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxyXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7XHJcbiAgam9pbktleSwgaXNOb25FbXB0eVN0cmluZywgc3BsaXRLZXksICQsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRJbmRleGVkRGF0YUtleSA9IChpbmRleE5vZGUsIGluZGV4S2V5LCByZWNvcmQpID0+IHtcclxuICBjb25zdCBnZXRTaGFyZE5hbWUgPSAoaW5kZXhOb2RlLCByZWNvcmQpID0+IHtcclxuICAgIGNvbnN0IHNoYXJkTmFtZUZ1bmMgPSBjb21waWxlQ29kZShpbmRleE5vZGUuZ2V0U2hhcmROYW1lKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIHJldHVybiBzaGFyZE5hbWVGdW5jKHsgcmVjb3JkIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIGNvbnN0IGVycm9yRGV0YWlscyA9IGBzaGFyZENvZGU6ICR7aW5kZXhOb2RlLmdldFNoYXJkTmFtZX0gOjogcmVjb3JkOiAke0pTT04uc3RyaW5naWZ5KHJlY29yZCl9IDo6IGBcclxuICAgICAgZS5tZXNzYWdlID0gXCJFcnJvciBydW5uaW5nIGluZGV4IHNoYXJkbmFtZSBmdW5jOiBcIiArIGVycm9yRGV0YWlscyArIGUubWVzc2FnZTtcclxuICAgICAgdGhyb3cgZTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBzaGFyZE5hbWUgPSBpc05vbkVtcHR5U3RyaW5nKGluZGV4Tm9kZS5nZXRTaGFyZE5hbWUpXHJcbiAgICA/IGAke2dldFNoYXJkTmFtZShpbmRleE5vZGUsIHJlY29yZCl9LmNzdmBcclxuICAgIDogJ2luZGV4LmNzdic7XHJcblxyXG4gIHJldHVybiBqb2luS2V5KGluZGV4S2V5LCBzaGFyZE5hbWUpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNoYXJkS2V5c0luUmFuZ2UgPSBhc3luYyAoYXBwLCBpbmRleEtleSwgc3RhcnRSZWNvcmQgPSBudWxsLCBlbmRSZWNvcmQgPSBudWxsKSA9PiB7XHJcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShpbmRleEtleSk7XHJcblxyXG4gIGNvbnN0IHN0YXJ0U2hhcmROYW1lID0gIXN0YXJ0UmVjb3JkXHJcbiAgICA/IG51bGxcclxuICAgIDogc2hhcmROYW1lRnJvbUtleShcclxuICAgICAgZ2V0SW5kZXhlZERhdGFLZXkoXHJcbiAgICAgICAgaW5kZXhOb2RlLFxyXG4gICAgICAgIGluZGV4S2V5LFxyXG4gICAgICAgIHN0YXJ0UmVjb3JkLFxyXG4gICAgICApLFxyXG4gICAgKTtcclxuXHJcbiAgY29uc3QgZW5kU2hhcmROYW1lID0gIWVuZFJlY29yZFxyXG4gICAgPyBudWxsXHJcbiAgICA6IHNoYXJkTmFtZUZyb21LZXkoXHJcbiAgICAgIGdldEluZGV4ZWREYXRhS2V5KFxyXG4gICAgICAgIGluZGV4Tm9kZSxcclxuICAgICAgICBpbmRleEtleSxcclxuICAgICAgICBlbmRSZWNvcmQsXHJcbiAgICAgICksXHJcbiAgICApO1xyXG5cclxuICByZXR1cm4gJChhd2FpdCBnZXRTaGFyZE1hcChhcHAuZGF0YXN0b3JlLCBpbmRleEtleSksIFtcclxuICAgIGZpbHRlcihrID0+IChzdGFydFJlY29yZCA9PT0gbnVsbCB8fCBrID49IHN0YXJ0U2hhcmROYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICYmIChlbmRSZWNvcmQgPT09IG51bGwgfHwgayA8PSBlbmRTaGFyZE5hbWUpKSxcclxuICAgIG1hcChrID0+IGpvaW5LZXkoaW5kZXhLZXksIGAke2t9LmNzdmApKSxcclxuICBdKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBlbnN1cmVTaGFyZE5hbWVJc0luU2hhcmRNYXAgPSBhc3luYyAoc3RvcmUsIGluZGV4S2V5LCBpbmRleGVkRGF0YUtleSkgPT4ge1xyXG4gIGNvbnN0IG1hcCA9IGF3YWl0IGdldFNoYXJkTWFwKHN0b3JlLCBpbmRleEtleSk7XHJcbiAgY29uc3Qgc2hhcmROYW1lID0gc2hhcmROYW1lRnJvbUtleShpbmRleGVkRGF0YUtleSk7XHJcbiAgaWYgKCFpbmNsdWRlcyhzaGFyZE5hbWUpKG1hcCkpIHtcclxuICAgIG1hcC5wdXNoKHNoYXJkTmFtZSk7XHJcbiAgICBhd2FpdCB3cml0ZVNoYXJkTWFwKHN0b3JlLCBpbmRleEtleSwgbWFwKTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0U2hhcmRNYXAgPSBhc3luYyAoZGF0YXN0b3JlLCBpbmRleEtleSkgPT4ge1xyXG4gIGNvbnN0IHNoYXJkTWFwS2V5ID0gZ2V0U2hhcmRNYXBLZXkoaW5kZXhLZXkpO1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgZGF0YXN0b3JlLmxvYWRKc29uKHNoYXJkTWFwS2V5KTtcclxuICB9IGNhdGNoIChfKSB7XHJcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlSnNvbihzaGFyZE1hcEtleSwgW10pO1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCB3cml0ZVNoYXJkTWFwID0gYXN5bmMgKGRhdGFzdG9yZSwgaW5kZXhLZXksIHNoYXJkTWFwKSA9PiBhd2FpdCBkYXRhc3RvcmUudXBkYXRlSnNvbihcclxuICBnZXRTaGFyZE1hcEtleShpbmRleEtleSksXHJcbiAgc2hhcmRNYXAsXHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0QWxsU2hhcmRLZXlzID0gYXN5bmMgKGFwcCwgaW5kZXhLZXkpID0+IGF3YWl0IGdldFNoYXJkS2V5c0luUmFuZ2UoYXBwLCBpbmRleEtleSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0U2hhcmRNYXBLZXkgPSBpbmRleEtleSA9PiBqb2luS2V5KGluZGV4S2V5LCAnc2hhcmRNYXAuanNvbicpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSA9IGluZGV4S2V5ID0+IGpvaW5LZXkoaW5kZXhLZXksICdpbmRleC5jc3YnKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRJbmRleEZvbGRlcktleSA9IGluZGV4S2V5ID0+IGluZGV4S2V5O1xyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZUluZGV4RmlsZSA9IGFzeW5jIChkYXRhc3RvcmUsIGluZGV4ZWREYXRhS2V5LCBpbmRleCkgPT4ge1xyXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleCkpIHtcclxuICAgIGNvbnN0IGluZGV4S2V5ID0gZ2V0UGFyZW50S2V5KGluZGV4ZWREYXRhS2V5KTtcclxuICAgIGNvbnN0IHNoYXJkTWFwID0gYXdhaXQgZ2V0U2hhcmRNYXAoZGF0YXN0b3JlLCBpbmRleEtleSk7XHJcbiAgICBzaGFyZE1hcC5wdXNoKFxyXG4gICAgICBzaGFyZE5hbWVGcm9tS2V5KGluZGV4ZWREYXRhS2V5KSxcclxuICAgICk7XHJcbiAgICBhd2FpdCB3cml0ZVNoYXJkTWFwKGRhdGFzdG9yZSwgaW5kZXhLZXksIHNoYXJkTWFwKTtcclxuICB9XHJcbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZpbGUoaW5kZXhlZERhdGFLZXksICcnKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBzaGFyZE5hbWVGcm9tS2V5ID0ga2V5ID0+ICQoa2V5LCBbXHJcbiAgc3BsaXRLZXksXHJcbiAgbGFzdCxcclxuXSkucmVwbGFjZSgnLmNzdicsICcnKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRJbmRleEtleV9CYXNlZE9uRGVjZW5kYW50ID0gKGRlY2VuZGFudEtleSwgaW5kZXhOb2RlKSA9PiB7XHJcbiAgaWYgKGlzR2xvYmFsSW5kZXgoaW5kZXhOb2RlKSkgeyByZXR1cm4gYCR7aW5kZXhOb2RlLm5vZGVLZXkoKX1gOyB9XHJcblxyXG4gIGNvbnN0IGluZGV4ZWREYXRhUGFyZW50S2V5ID0gZ2V0QWN0dWFsS2V5T2ZQYXJlbnQoXHJcbiAgICBpbmRleE5vZGUucGFyZW50KCkubm9kZUtleSgpLFxyXG4gICAgZGVjZW5kYW50S2V5LFxyXG4gICk7XHJcblxyXG4gIHJldHVybiBqb2luS2V5KFxyXG4gICAgaW5kZXhlZERhdGFQYXJlbnRLZXksXHJcbiAgICBpbmRleE5vZGUubmFtZSxcclxuICApO1xyXG59O1xyXG4iLCJpbXBvcnQge1xyXG4gIGhhcywga2V5cywgbWFwLCBvcmRlckJ5LFxyXG4gIGZpbHRlciwgY29uY2F0LCByZXZlcnNlLFxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHsgbWFwUmVjb3JkIH0gZnJvbSAnLi9ldmFsdWF0ZSc7XHJcbmltcG9ydCB7IGNvbnN0cnVjdFJlY29yZCB9IGZyb20gJy4uL3JlY29yZEFwaS9nZXROZXcnO1xyXG5pbXBvcnQgeyBnZXRTYW1wbGVGaWVsZFZhbHVlLCBkZXRlY3RUeXBlLCBhbGwgfSBmcm9tICcuLi90eXBlcyc7XHJcbmltcG9ydCB7ICQgfSBmcm9tICcuLi9jb21tb24nO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlU2NoZW1hID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkTm9kZXMgPSBnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleChoaWVyYXJjaHksIGluZGV4Tm9kZSk7XHJcbiAgY29uc3QgbWFwcGVkUmVjb3JkcyA9ICQocmVjb3JkTm9kZXMsIFtcclxuICAgIG1hcChuID0+IG1hcFJlY29yZChjcmVhdGVTYW1wbGVSZWNvcmQobiksIGluZGV4Tm9kZSkpLFxyXG4gIF0pO1xyXG5cclxuICAvLyBhbHdheXMgaGFzIHJlY29yZCBrZXkgYW5kIHNvcnQga2V5XHJcbiAgY29uc3Qgc2NoZW1hID0ge1xyXG4gICAgc29ydEtleTogYWxsLnN0cmluZyxcclxuICAgIGtleTogYWxsLnN0cmluZyxcclxuICB9O1xyXG5cclxuICBjb25zdCBmaWVsZHNIYXMgPSBoYXMoc2NoZW1hKTtcclxuICBjb25zdCBzZXRGaWVsZCA9IChmaWVsZE5hbWUsIHZhbHVlKSA9PiB7XHJcbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkgeyByZXR1cm47IH1cclxuXHJcbiAgICBjb25zdCB0aGlzVHlwZSA9IGRldGVjdFR5cGUodmFsdWUpO1xyXG4gICAgaWYgKGZpZWxkc0hhcyhmaWVsZE5hbWUpKSB7XHJcbiAgICAgIGlmIChzY2hlbWFbZmllbGROYW1lXSAhPT0gdGhpc1R5cGUpIHtcclxuICAgICAgICBzY2hlbWFbZmllbGROYW1lXSA9IGFsbC5zdHJpbmc7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNjaGVtYVtmaWVsZE5hbWVdID0gdGhpc1R5cGU7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZm9yIChjb25zdCBtYXBwZWRSZWMgb2YgbWFwcGVkUmVjb3Jkcykge1xyXG4gICAgZm9yIChjb25zdCBmIGluIG1hcHBlZFJlYykge1xyXG4gICAgICBzZXRGaWVsZChmLCBtYXBwZWRSZWNbZl0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gcmV0dXJpbmcgYW4gYXJyYXkgb2Yge25hbWUsIHR5cGV9XHJcbiAgcmV0dXJuICQoc2NoZW1hLCBbXHJcbiAgICBrZXlzLFxyXG4gICAgbWFwKGsgPT4gKHsgbmFtZTogaywgdHlwZTogc2NoZW1hW2tdLm5hbWUgfSkpLFxyXG4gICAgZmlsdGVyKHMgPT4gcy5uYW1lICE9PSAnc29ydEtleScpLFxyXG4gICAgb3JkZXJCeSgnbmFtZScsIFsnZGVzYyddKSwgLy8gcmV2ZXJzZSBhcGxoYVxyXG4gICAgY29uY2F0KFt7IG5hbWU6ICdzb3J0S2V5JywgdHlwZTogYWxsLnN0cmluZy5uYW1lIH1dKSwgLy8gc29ydEtleSBvbiBlbmRcclxuICAgIHJldmVyc2UsIC8vIHNvcnRLZXkgZmlyc3QsIHRoZW4gcmVzdCBhcmUgYWxwaGFiZXRpY2FsXHJcbiAgXSk7XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVTYW1wbGVSZWNvcmQgPSByZWNvcmROb2RlID0+IGNvbnN0cnVjdFJlY29yZChcclxuICByZWNvcmROb2RlLFxyXG4gIGdldFNhbXBsZUZpZWxkVmFsdWUsXHJcbiAgcmVjb3JkTm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksXHJcbik7XHJcbiIsImV4cG9ydCBkZWZhdWx0ICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDpcbiAgICAgICAgICAgIHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6XG4gICAgICAgICAgICB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pO1xuIiwiXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxudmFyIGluaXRlZCA9IGZhbHNlO1xuZnVuY3Rpb24gaW5pdCAoKSB7XG4gIGluaXRlZCA9IHRydWU7XG4gIHZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2RlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgbG9va3VwW2ldID0gY29kZVtpXVxuICAgIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxuICB9XG5cbiAgcmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG4gIHJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICBpZiAoIWluaXRlZCkge1xuICAgIGluaXQoKTtcbiAgfVxuICB2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXG4gIGlmIChsZW4gJSA0ID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG4gIH1cblxuICAvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuICAvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG4gIC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuICAvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcbiAgLy8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuICBwbGFjZUhvbGRlcnMgPSBiNjRbbGVuIC0gMl0gPT09ICc9JyA/IDIgOiBiNjRbbGVuIC0gMV0gPT09ICc9JyA/IDEgOiAwXG5cbiAgLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG4gIGFyciA9IG5ldyBBcnIobGVuICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cbiAgLy8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuICBsID0gcGxhY2VIb2xkZXJzID4gMCA/IGxlbiAtIDQgOiBsZW5cblxuICB2YXIgTCA9IDBcblxuICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTgpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDEyKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8IHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMyldXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDE2KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxMCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgNCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDYgJiAweDNGXSArIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG4gICAgb3V0cHV0LnB1c2godHJpcGxldFRvQmFzZTY0KHRtcCkpXG4gIH1cbiAgcmV0dXJuIG91dHB1dC5qb2luKCcnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgaWYgKCFpbml0ZWQpIHtcbiAgICBpbml0KCk7XG4gIH1cbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgb3V0cHV0ID0gJydcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayh1aW50OCwgaSwgKGkgKyBtYXhDaHVua0xlbmd0aCkgPiBsZW4yID8gbGVuMiA6IChpICsgbWF4Q2h1bmtMZW5ndGgpKSlcbiAgfVxuXG4gIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcbiAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcbiAgICB0bXAgPSB1aW50OFtsZW4gLSAxXVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDJdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz09J1xuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyAodWludDhbbGVuIC0gMV0pXG4gICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMTBdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXVxuICAgIG91dHB1dCArPSAnPSdcbiAgfVxuXG4gIHBhcnRzLnB1c2gob3V0cHV0KVxuXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gcmVhZCAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cml0ZSAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5leHBvcnQgZGVmYXVsdCBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cblxuaW1wb3J0ICogYXMgYmFzZTY0IGZyb20gJy4vYmFzZTY0J1xuaW1wb3J0ICogYXMgaWVlZTc1NCBmcm9tICcuL2llZWU3NTQnXG5pbXBvcnQgaXNBcnJheSBmcm9tICcuL2lzQXJyYXknXG5cbmV4cG9ydCB2YXIgSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBEdWUgdG8gdmFyaW91cyBicm93c2VyIGJ1Z3MsIHNvbWV0aW1lcyB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uIHdpbGwgYmUgdXNlZCBldmVuXG4gKiB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHR5cGVkIGFycmF5cy5cbiAqXG4gKiBOb3RlOlxuICpcbiAqICAgLSBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsXG4gKiAgICAgU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzguXG4gKlxuICogICAtIENocm9tZSA5LTEwIGlzIG1pc3NpbmcgdGhlIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24uXG4gKlxuICogICAtIElFMTAgaGFzIGEgYnJva2VuIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhcnJheXMgb2ZcbiAqICAgICBpbmNvcnJlY3QgbGVuZ3RoIGluIHNvbWUgc2l0dWF0aW9ucy5cblxuICogV2UgZGV0ZWN0IHRoZXNlIGJ1Z2d5IGJyb3dzZXJzIGFuZCBzZXQgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYCB0byBgZmFsc2VgIHNvIHRoZXlcbiAqIGdldCB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uLCB3aGljaCBpcyBzbG93ZXIgYnV0IGJlaGF2ZXMgY29ycmVjdGx5LlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUICE9PSB1bmRlZmluZWRcbiAgPyBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVFxuICA6IHRydWVcblxuLypcbiAqIEV4cG9ydCBrTWF4TGVuZ3RoIGFmdGVyIHR5cGVkIGFycmF5IHN1cHBvcnQgaXMgZGV0ZXJtaW5lZC5cbiAqL1xudmFyIF9rTWF4TGVuZ3RoID0ga01heExlbmd0aCgpXG5leHBvcnQge19rTWF4TGVuZ3RoIGFzIGtNYXhMZW5ndGh9O1xuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICByZXR1cm4gdHJ1ZTtcbiAgLy8gcm9sbHVwIGlzc3Vlc1xuICAvLyB0cnkge1xuICAvLyAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAvLyAgIGFyci5fX3Byb3RvX18gPSB7XG4gIC8vICAgICBfX3Byb3RvX186IFVpbnQ4QXJyYXkucHJvdG90eXBlLFxuICAvLyAgICAgZm9vOiBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gIC8vICAgfVxuICAvLyAgIHJldHVybiBhcnIuZm9vKCkgPT09IDQyICYmIC8vIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkXG4gIC8vICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgJiYgLy8gY2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIC8vICAgICAgIGFyci5zdWJhcnJheSgxLCAxKS5ieXRlTGVuZ3RoID09PSAwIC8vIGllMTAgaGFzIGJyb2tlbiBgc3ViYXJyYXlgXG4gIC8vIH0gY2F0Y2ggKGUpIHtcbiAgLy8gICByZXR1cm4gZmFsc2VcbiAgLy8gfVxufVxuXG5mdW5jdGlvbiBrTWF4TGVuZ3RoICgpIHtcbiAgcmV0dXJuIEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gICAgPyAweDdmZmZmZmZmXG4gICAgOiAweDNmZmZmZmZmXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAodGhhdCwgbGVuZ3RoKSB7XG4gIGlmIChrTWF4TGVuZ3RoKCkgPCBsZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCB0eXBlZCBhcnJheSBsZW5ndGgnKVxuICB9XG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoYXQgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIGlmICh0aGF0ID09PSBudWxsKSB7XG4gICAgICB0aGF0ID0gbmV3IEJ1ZmZlcihsZW5ndGgpXG4gICAgfVxuICAgIHRoYXQubGVuZ3RoID0gbGVuZ3RoXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgaGF2ZSB0aGVpclxuICogcHJvdG90eXBlIGNoYW5nZWQgdG8gYEJ1ZmZlci5wcm90b3R5cGVgLiBGdXJ0aGVybW9yZSwgYEJ1ZmZlcmAgaXMgYSBzdWJjbGFzcyBvZlxuICogYFVpbnQ4QXJyYXlgLCBzbyB0aGUgcmV0dXJuZWQgaW5zdGFuY2VzIHdpbGwgaGF2ZSBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgbWV0aG9kc1xuICogYW5kIHRoZSBgVWludDhBcnJheWAgbWV0aG9kcy4gU3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXRcbiAqIHJldHVybnMgYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogVGhlIGBVaW50OEFycmF5YCBwcm90b3R5cGUgcmVtYWlucyB1bm1vZGlmaWVkLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiYgISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIGlmICh0eXBlb2YgZW5jb2RpbmdPck9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0lmIGVuY29kaW5nIGlzIHNwZWNpZmllZCB0aGVuIHRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJ1xuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gYWxsb2NVbnNhZmUodGhpcywgYXJnKVxuICB9XG4gIHJldHVybiBmcm9tKHRoaXMsIGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxuLy8gVE9ETzogTGVnYWN5LCBub3QgbmVlZGVkIGFueW1vcmUuIFJlbW92ZSBpbiBuZXh0IG1ham9yIHZlcnNpb24uXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gZnJvbSAodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBhIG51bWJlcicpXG4gIH1cblxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnJvbVN0cmluZyh0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldClcbiAgfVxuXG4gIHJldHVybiBmcm9tT2JqZWN0KHRoYXQsIHZhbHVlKVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIEJ1ZmZlcihhcmcsIGVuY29kaW5nKSBidXQgdGhyb3dzIGEgVHlwZUVycm9yXG4gKiBpZiB2YWx1ZSBpcyBhIG51bWJlci5cbiAqIEJ1ZmZlci5mcm9tKHN0clssIGVuY29kaW5nXSlcbiAqIEJ1ZmZlci5mcm9tKGFycmF5KVxuICogQnVmZmVyLmZyb20oYnVmZmVyKVxuICogQnVmZmVyLmZyb20oYXJyYXlCdWZmZXJbLCBieXRlT2Zmc2V0WywgbGVuZ3RoXV0pXG4gKiovXG5CdWZmZXIuZnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBmcm9tKG51bGwsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbmlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICBCdWZmZXIucHJvdG90eXBlLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXkucHJvdG90eXBlXG4gIEJ1ZmZlci5fX3Byb3RvX18gPSBVaW50OEFycmF5XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wuc3BlY2llcyAmJlxuICAgICAgQnVmZmVyW1N5bWJvbC5zcGVjaWVzXSA9PT0gQnVmZmVyKSB7XG4gICAgLy8gRml4IHN1YmFycmF5KCkgaW4gRVMyMDE2LiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvOTdcbiAgICAvLyBPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLCBTeW1ib2wuc3BlY2llcywge1xuICAgIC8vICAgdmFsdWU6IG51bGwsXG4gICAgLy8gICBjb25maWd1cmFibGU6IHRydWVcbiAgICAvLyB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydFNpemUgKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9IGVsc2UgaWYgKHNpemUgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG5lZ2F0aXZlJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAodGhhdCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXR0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2MobnVsbCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlICh0aGF0LCBzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgKytpKSB7XG4gICAgICB0aGF0W2ldID0gMFxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gQnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gU2xvd0J1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICovXG5CdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHRoYXQsIHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGlmICghQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJlbmNvZGluZ1wiIG11c3QgYmUgYSB2YWxpZCBzdHJpbmcgZW5jb2RpbmcnKVxuICB9XG5cbiAgdmFyIGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuXG4gIHZhciBhY3R1YWwgPSB0aGF0LndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG5cbiAgaWYgKGFjdHVhbCAhPT0gbGVuZ3RoKSB7XG4gICAgLy8gV3JpdGluZyBhIGhleCBzdHJpbmcsIGZvciBleGFtcGxlLCB0aGF0IGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycyB3aWxsXG4gICAgLy8gY2F1c2UgZXZlcnl0aGluZyBhZnRlciB0aGUgZmlyc3QgaW52YWxpZCBjaGFyYWN0ZXIgdG8gYmUgaWdub3JlZC4gKGUuZy5cbiAgICAvLyAnYWJ4eGNkJyB3aWxsIGJlIHRyZWF0ZWQgYXMgJ2FiJylcbiAgICB0aGF0ID0gdGhhdC5zbGljZSgwLCBhY3R1YWwpXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlMaWtlICh0aGF0LCBhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyICh0aGF0LCBhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gIGFycmF5LmJ5dGVMZW5ndGggLy8gdGhpcyB0aHJvd3MgaWYgYGFycmF5YCBpcyBub3QgYSB2YWxpZCBBcnJheUJ1ZmZlclxuXG4gIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdvZmZzZXRcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgKyAobGVuZ3RoIHx8IDApKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ2xlbmd0aFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChieXRlT2Zmc2V0ID09PSB1bmRlZmluZWQgJiYgbGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5KVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldClcbiAgfSBlbHNlIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gYXJyYXlcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgdGhhdCA9IGZyb21BcnJheUxpa2UodGhhdCwgYXJyYXkpXG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAodGhhdCwgb2JqKSB7XG4gIGlmIChpbnRlcm5hbElzQnVmZmVyKG9iaikpIHtcbiAgICB2YXIgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbilcblxuICAgIGlmICh0aGF0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoYXRcbiAgICB9XG5cbiAgICBvYmouY29weSh0aGF0LCAwLCAwLCBsZW4pXG4gICAgcmV0dXJuIHRoYXRcbiAgfVxuXG4gIGlmIChvYmopIHtcbiAgICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgb2JqLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB8fCAnbGVuZ3RoJyBpbiBvYmopIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ251bWJlcicgfHwgaXNuYW4ob2JqLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCAwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqKVxuICAgIH1cblxuICAgIGlmIChvYmoudHlwZSA9PT0gJ0J1ZmZlcicgJiYgaXNBcnJheShvYmouZGF0YSkpIHtcbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iai5kYXRhKVxuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCBvciBhcnJheS1saWtlIG9iamVjdC4nKVxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwga01heExlbmd0aCgpYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IGtNYXhMZW5ndGgoKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBrTWF4TGVuZ3RoKCkudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNsb3dCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAoK2xlbmd0aCAhPSBsZW5ndGgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbiAgICBsZW5ndGggPSAwXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5hbGxvYygrbGVuZ3RoKVxufVxuQnVmZmVyLmlzQnVmZmVyID0gaXNCdWZmZXI7XG5mdW5jdGlvbiBpbnRlcm5hbElzQnVmZmVyIChiKSB7XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIWludGVybmFsSXNCdWZmZXIoYSkgfHwgIWludGVybmFsSXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgbXVzdCBiZSBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuXG4gIHZhciB4ID0gYS5sZW5ndGhcbiAgdmFyIHkgPSBiLmxlbmd0aFxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldXG4gICAgICB5ID0gYltpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnbGF0aW4xJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIWlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5hbGxvYygwKVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICBsZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYnVmID0gbGlzdFtpXVxuICAgIGlmICghaW50ZXJuYWxJc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoaW50ZXJuYWxJc0J1ZmZlcihzdHJpbmcpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5sZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQXJyYXlCdWZmZXIuaXNWaWV3ID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAoQXJyYXlCdWZmZXIuaXNWaWV3KHN0cmluZykgfHwgc3RyaW5nIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5ieXRlTGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgc3RyaW5nID0gJycgKyBzdHJpbmdcbiAgfVxuXG4gIHZhciBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gbGVuICogMlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGxlbiA+Pj4gMVxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoIC8vIGFzc3VtZSB1dGY4XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIC8vIE5vIG5lZWQgdG8gdmVyaWZ5IHRoYXQgXCJ0aGlzLmxlbmd0aCA8PSBNQVhfVUlOVDMyXCIgc2luY2UgaXQncyBhIHJlYWQtb25seVxuICAvLyBwcm9wZXJ0eSBvZiBhIHR5cGVkIGFycmF5LlxuXG4gIC8vIFRoaXMgYmVoYXZlcyBuZWl0aGVyIGxpa2UgU3RyaW5nIG5vciBVaW50OEFycmF5IGluIHRoYXQgd2Ugc2V0IHN0YXJ0L2VuZFxuICAvLyB0byB0aGVpciB1cHBlci9sb3dlciBib3VuZHMgaWYgdGhlIHZhbHVlIHBhc3NlZCBpcyBvdXQgb2YgcmFuZ2UuXG4gIC8vIHVuZGVmaW5lZCBpcyBoYW5kbGVkIHNwZWNpYWxseSBhcyBwZXIgRUNNQS0yNjIgNnRoIEVkaXRpb24sXG4gIC8vIFNlY3Rpb24gMTMuMy4zLjcgUnVudGltZSBTZW1hbnRpY3M6IEtleWVkQmluZGluZ0luaXRpYWxpemF0aW9uLlxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCB8fCBzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICAvLyBSZXR1cm4gZWFybHkgaWYgc3RhcnQgPiB0aGlzLmxlbmd0aC4gRG9uZSBoZXJlIHRvIHByZXZlbnQgcG90ZW50aWFsIHVpbnQzMlxuICAvLyBjb2VyY2lvbiBmYWlsIGJlbG93LlxuICBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbmQgPD0gMCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgLy8gRm9yY2UgY29lcnNpb24gdG8gdWludDMyLiBUaGlzIHdpbGwgYWxzbyBjb2VyY2UgZmFsc2V5L05hTiB2YWx1ZXMgdG8gMC5cbiAgZW5kID4+Pj0gMFxuICBzdGFydCA+Pj49IDBcblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gVGhlIHByb3BlcnR5IGlzIHVzZWQgYnkgYEJ1ZmZlci5pc0J1ZmZlcmAgYW5kIGBpcy1idWZmZXJgIChpbiBTYWZhcmkgNS03KSB0byBkZXRlY3Rcbi8vIEJ1ZmZlciBpbnN0YW5jZXMuXG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuZnVuY3Rpb24gc3dhcCAoYiwgbiwgbSkge1xuICB2YXIgaSA9IGJbbl1cbiAgYltuXSA9IGJbbV1cbiAgYlttXSA9IGlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMTYgPSBmdW5jdGlvbiBzd2FwMTYgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDIgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDE2LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAxKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDMyID0gZnVuY3Rpb24gc3dhcDMyICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAzMi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgMilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXA2NCA9IGZ1bmN0aW9uIHN3YXA2NCAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgOCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNjQtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gOCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDcpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDYpXG4gICAgc3dhcCh0aGlzLCBpICsgMiwgaSArIDUpXG4gICAgc3dhcCh0aGlzLCBpICsgMywgaSArIDQpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoIHwgMFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgaWYgKHRoaXMgPT09IGIpIHJldHVybiB0cnVlXG4gIHJldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLCBiKSA9PT0gMFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgdmFyIHN0ciA9ICcnXG4gIHZhciBtYXggPSBJTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgfVxuXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5kID0gdGFyZ2V0ID8gdGFyZ2V0Lmxlbmd0aCA6IDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzU3RhcnQgPSAwXG4gIH1cbiAgaWYgKHRoaXNFbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNFbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBlbmQgPiB0YXJnZXQubGVuZ3RoIHx8IHRoaXNTdGFydCA8IDAgfHwgdGhpc0VuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ291dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQgJiYgc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIHN0YXJ0ID4+Pj0gMFxuICBlbmQgPj4+PSAwXG4gIHRoaXNTdGFydCA+Pj49IDBcbiAgdGhpc0VuZCA+Pj49IDBcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0KSByZXR1cm4gMFxuXG4gIHZhciB4ID0gdGhpc0VuZCAtIHRoaXNTdGFydFxuICB2YXIgeSA9IGVuZCAtIHN0YXJ0XG4gIHZhciBsZW4gPSBNYXRoLm1pbih4LCB5KVxuXG4gIHZhciB0aGlzQ29weSA9IHRoaXMuc2xpY2UodGhpc1N0YXJ0LCB0aGlzRW5kKVxuICB2YXIgdGFyZ2V0Q29weSA9IHRhcmdldC5zbGljZShzdGFydCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAodGhpc0NvcHlbaV0gIT09IHRhcmdldENvcHlbaV0pIHtcbiAgICAgIHggPSB0aGlzQ29weVtpXVxuICAgICAgeSA9IHRhcmdldENvcHlbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG4vLyBGaW5kcyBlaXRoZXIgdGhlIGZpcnN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA+PSBgYnl0ZU9mZnNldGAsXG4vLyBPUiB0aGUgbGFzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPD0gYGJ5dGVPZmZzZXRgLlxuLy9cbi8vIEFyZ3VtZW50czpcbi8vIC0gYnVmZmVyIC0gYSBCdWZmZXIgdG8gc2VhcmNoXG4vLyAtIHZhbCAtIGEgc3RyaW5nLCBCdWZmZXIsIG9yIG51bWJlclxuLy8gLSBieXRlT2Zmc2V0IC0gYW4gaW5kZXggaW50byBgYnVmZmVyYDsgd2lsbCBiZSBjbGFtcGVkIHRvIGFuIGludDMyXG4vLyAtIGVuY29kaW5nIC0gYW4gb3B0aW9uYWwgZW5jb2RpbmcsIHJlbGV2YW50IGlzIHZhbCBpcyBhIHN0cmluZ1xuLy8gLSBkaXIgLSB0cnVlIGZvciBpbmRleE9mLCBmYWxzZSBmb3IgbGFzdEluZGV4T2ZcbmZ1bmN0aW9uIGJpZGlyZWN0aW9uYWxJbmRleE9mIChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICAvLyBFbXB0eSBidWZmZXIgbWVhbnMgbm8gbWF0Y2hcbiAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHJldHVybiAtMVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0XG4gIGlmICh0eXBlb2YgYnl0ZU9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IGJ5dGVPZmZzZXRcbiAgICBieXRlT2Zmc2V0ID0gMFxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPiAweDdmZmZmZmZmKSB7XG4gICAgYnl0ZU9mZnNldCA9IDB4N2ZmZmZmZmZcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgLTB4ODAwMDAwMDApIHtcbiAgICBieXRlT2Zmc2V0ID0gLTB4ODAwMDAwMDBcbiAgfVxuICBieXRlT2Zmc2V0ID0gK2J5dGVPZmZzZXQgIC8vIENvZXJjZSB0byBOdW1iZXIuXG4gIGlmIChpc05hTihieXRlT2Zmc2V0KSkge1xuICAgIC8vIGJ5dGVPZmZzZXQ6IGl0IGl0J3MgdW5kZWZpbmVkLCBudWxsLCBOYU4sIFwiZm9vXCIsIGV0Yywgc2VhcmNoIHdob2xlIGJ1ZmZlclxuICAgIGJ5dGVPZmZzZXQgPSBkaXIgPyAwIDogKGJ1ZmZlci5sZW5ndGggLSAxKVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXQ6IG5lZ2F0aXZlIG9mZnNldHMgc3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBidWZmZXJcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwKSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCArIGJ5dGVPZmZzZXRcbiAgaWYgKGJ5dGVPZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkge1xuICAgIGlmIChkaXIpIHJldHVybiAtMVxuICAgIGVsc2UgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggLSAxXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IDApIHtcbiAgICBpZiAoZGlyKSBieXRlT2Zmc2V0ID0gMFxuICAgIGVsc2UgcmV0dXJuIC0xXG4gIH1cblxuICAvLyBOb3JtYWxpemUgdmFsXG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIHZhbCA9IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gIH1cblxuICAvLyBGaW5hbGx5LCBzZWFyY2ggZWl0aGVyIGluZGV4T2YgKGlmIGRpciBpcyB0cnVlKSBvciBsYXN0SW5kZXhPZlxuICBpZiAoaW50ZXJuYWxJc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDB4RkYgLy8gU2VhcmNoIGZvciBhIGJ5dGUgdmFsdWUgWzAtMjU1XVxuICAgIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJlxuICAgICAgICB0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGRpcikge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCBbIHZhbCBdLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyJylcbn1cblxuZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICB2YXIgaW5kZXhTaXplID0gMVxuICB2YXIgYXJyTGVuZ3RoID0gYXJyLmxlbmd0aFxuICB2YXIgdmFsTGVuZ3RoID0gdmFsLmxlbmd0aFxuXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZW5jb2RpbmcgPT09ICd1Y3MyJyB8fCBlbmNvZGluZyA9PT0gJ3Vjcy0yJyB8fFxuICAgICAgICBlbmNvZGluZyA9PT0gJ3V0ZjE2bGUnIHx8IGVuY29kaW5nID09PSAndXRmLTE2bGUnKSB7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA8IDIgfHwgdmFsLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpbmRleFNpemUgPSAyXG4gICAgICBhcnJMZW5ndGggLz0gMlxuICAgICAgdmFsTGVuZ3RoIC89IDJcbiAgICAgIGJ5dGVPZmZzZXQgLz0gMlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGJ1ZiwgaSkge1xuICAgIGlmIChpbmRleFNpemUgPT09IDEpIHtcbiAgICAgIHJldHVybiBidWZbaV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ1Zi5yZWFkVUludDE2QkUoaSAqIGluZGV4U2l6ZSlcbiAgICB9XG4gIH1cblxuICB2YXIgaVxuICBpZiAoZGlyKSB7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPCBhcnJMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlYWQoYXJyLCBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIGZvdW5kSW5kZXggPSBpXG4gICAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbExlbmd0aCkgcmV0dXJuIGZvdW5kSW5kZXggKiBpbmRleFNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ICE9PSAtMSkgaSAtPSBpIC0gZm91bmRJbmRleFxuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGJ5dGVPZmZzZXQgKyB2YWxMZW5ndGggPiBhcnJMZW5ndGgpIGJ5dGVPZmZzZXQgPSBhcnJMZW5ndGggLSB2YWxMZW5ndGhcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGZvdW5kID0gdHJ1ZVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWxMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAocmVhZChhcnIsIGkgKyBqKSAhPT0gcmVhZCh2YWwsIGopKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuIGlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiB0aGlzLmluZGV4T2YodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykgIT09IC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIHRydWUpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZmFsc2UpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKHN0ckxlbiAlIDIgIT09IDApIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKGlzTmFOKHBhcnNlZCkpIHJldHVybiBpXG4gICAgYnVmW29mZnNldCArIGldID0gcGFyc2VkXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBsYXRpbjFXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBhc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHVjczJXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZylcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBvZmZzZXRbLCBsZW5ndGhdWywgZW5jb2RpbmddKVxuICB9IGVsc2UgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCB8IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICAvLyBsZWdhY3kgd3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpIC0gcmVtb3ZlIGluIHYwLjEzXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1ZmZlci53cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXRbLCBsZW5ndGhdKSBpcyBubyBsb25nZXIgc3VwcG9ydGVkJ1xuICAgIClcbiAgfVxuXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbGVuZ3RoID4gcmVtYWluaW5nKSBsZW5ndGggPSByZW1haW5pbmdcblxuICBpZiAoKHN0cmluZy5sZW5ndGggPiAwICYmIChsZW5ndGggPCAwIHx8IG9mZnNldCA8IDApKSB8fCBvZmZzZXQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIHdyaXRlIG91dHNpZGUgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIC8vIFdhcm5pbmc6IG1heExlbmd0aCBub3QgdGFrZW4gaW50byBhY2NvdW50IGluIGJhc2U2NFdyaXRlXG4gICAgICAgIHJldHVybiBiYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdWNzMldyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHV0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcbiAgdmFyIHJlcyA9IFtdXG5cbiAgdmFyIGkgPSBzdGFydFxuICB3aGlsZSAoaSA8IGVuZCkge1xuICAgIHZhciBmaXJzdEJ5dGUgPSBidWZbaV1cbiAgICB2YXIgY29kZVBvaW50ID0gbnVsbFxuICAgIHZhciBieXRlc1BlclNlcXVlbmNlID0gKGZpcnN0Qnl0ZSA+IDB4RUYpID8gNFxuICAgICAgOiAoZmlyc3RCeXRlID4gMHhERikgPyAzXG4gICAgICA6IChmaXJzdEJ5dGUgPiAweEJGKSA/IDJcbiAgICAgIDogMVxuXG4gICAgaWYgKGkgKyBieXRlc1BlclNlcXVlbmNlIDw9IGVuZCkge1xuICAgICAgdmFyIHNlY29uZEJ5dGUsIHRoaXJkQnl0ZSwgZm91cnRoQnl0ZSwgdGVtcENvZGVQb2ludFxuXG4gICAgICBzd2l0Y2ggKGJ5dGVzUGVyU2VxdWVuY2UpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmIChmaXJzdEJ5dGUgPCAweDgwKSB7XG4gICAgICAgICAgICBjb2RlUG9pbnQgPSBmaXJzdEJ5dGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHgxRikgPDwgMHg2IHwgKHNlY29uZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4QyB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKHRoaXJkQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0ZGICYmICh0ZW1wQ29kZVBvaW50IDwgMHhEODAwIHx8IHRlbXBDb2RlUG9pbnQgPiAweERGRkYpKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGZvdXJ0aEJ5dGUgPSBidWZbaSArIDNdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwICYmIChmb3VydGhCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweDEyIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweEMgfCAodGhpcmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKGZvdXJ0aEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweEZGRkYgJiYgdGVtcENvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGVQb2ludCA9PT0gbnVsbCkge1xuICAgICAgLy8gd2UgZGlkIG5vdCBnZW5lcmF0ZSBhIHZhbGlkIGNvZGVQb2ludCBzbyBpbnNlcnQgYVxuICAgICAgLy8gcmVwbGFjZW1lbnQgY2hhciAoVStGRkZEKSBhbmQgYWR2YW5jZSBvbmx5IDEgYnl0ZVxuICAgICAgY29kZVBvaW50ID0gMHhGRkZEXG4gICAgICBieXRlc1BlclNlcXVlbmNlID0gMVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50ID4gMHhGRkZGKSB7XG4gICAgICAvLyBlbmNvZGUgdG8gdXRmMTYgKHN1cnJvZ2F0ZSBwYWlyIGRhbmNlKVxuICAgICAgY29kZVBvaW50IC09IDB4MTAwMDBcbiAgICAgIHJlcy5wdXNoKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMClcbiAgICAgIGNvZGVQb2ludCA9IDB4REMwMCB8IGNvZGVQb2ludCAmIDB4M0ZGXG4gICAgfVxuXG4gICAgcmVzLnB1c2goY29kZVBvaW50KVxuICAgIGkgKz0gYnl0ZXNQZXJTZXF1ZW5jZVxuICB9XG5cbiAgcmV0dXJuIGRlY29kZUNvZGVQb2ludHNBcnJheShyZXMpXG59XG5cbi8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIyNzQ3MjcyLzY4MDc0MiwgdGhlIGJyb3dzZXIgd2l0aFxuLy8gdGhlIGxvd2VzdCBsaW1pdCBpcyBDaHJvbWUsIHdpdGggMHgxMDAwMCBhcmdzLlxuLy8gV2UgZ28gMSBtYWduaXR1ZGUgbGVzcywgZm9yIHNhZmV0eVxudmFyIE1BWF9BUkdVTUVOVFNfTEVOR1RIID0gMHgxMDAwXG5cbmZ1bmN0aW9uIGRlY29kZUNvZGVQb2ludHNBcnJheSAoY29kZVBvaW50cykge1xuICB2YXIgbGVuID0gY29kZVBvaW50cy5sZW5ndGhcbiAgaWYgKGxlbiA8PSBNQVhfQVJHVU1FTlRTX0xFTkdUSCkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY29kZVBvaW50cykgLy8gYXZvaWQgZXh0cmEgc2xpY2UoKVxuICB9XG5cbiAgLy8gRGVjb2RlIGluIGNodW5rcyB0byBhdm9pZCBcImNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZFwiLlxuICB2YXIgcmVzID0gJydcbiAgdmFyIGkgPSAwXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXG4gICAgICBTdHJpbmcsXG4gICAgICBjb2RlUG9pbnRzLnNsaWNlKGksIGkgKz0gTUFYX0FSR1VNRU5UU19MRU5HVEgpXG4gICAgKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0gJiAweDdGKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gbGF0aW4xU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiB1dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2kgKyAxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICB2YXIgbmV3QnVmXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIG5ld0J1ZiA9IHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZClcbiAgICBuZXdCdWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47ICsraSkge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ld0J1ZlxufVxuXG4vKlxuICogTmVlZCB0byBtYWtlIHN1cmUgdGhhdCBidWZmZXIgaXNuJ3QgdHJ5aW5nIHRvIHdyaXRlIG91dCBvZiBib3VuZHMuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT2Zmc2V0IChvZmZzZXQsIGV4dCwgbGVuZ3RoKSB7XG4gIGlmICgob2Zmc2V0ICUgMSkgIT09IDAgfHwgb2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ29mZnNldCBpcyBub3QgdWludCcpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBsZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdUcnlpbmcgdG8gYWNjZXNzIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludExFID0gZnVuY3Rpb24gcmVhZFVJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcbiAgfVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF1cbiAgdmFyIG11bCA9IDFcbiAgd2hpbGUgKGJ5dGVMZW5ndGggPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIHJlYWRVSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCA4KSB8IHRoaXNbb2Zmc2V0ICsgMV1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiByZWFkVUludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKCh0aGlzW29mZnNldF0pIHxcbiAgICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSkgK1xuICAgICAgKHRoaXNbb2Zmc2V0ICsgM10gKiAweDEwMDAwMDApXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50QkUgPSBmdW5jdGlvbiByZWFkSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGhcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1pXVxuICB3aGlsZSAoaSA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIHJlYWRJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gcmVhZEludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgMV0gfCAodGhpc1tvZmZzZXRdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgMjQpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdExFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdEJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiByZWFkRG91YmxlQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCA1MiwgOClcbn1cblxuZnVuY3Rpb24gY2hlY2tJbnQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAoIWludGVybmFsSXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZmZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHhmZiwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCAyKTsgaSA8IGo7ICsraSkge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgNCk7IGkgPCBqOyArK2kpIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gMFxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgLSAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgKyAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgOCwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICh0YXJnZXQsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXRTdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB0YXJnZXRTdGFydCA9IHRhcmdldC5sZW5ndGhcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwXG4gIGlmIChlbmQgPiAwICYmIGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDBcbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgdGhpcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAodGFyZ2V0U3RhcnQgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgaWYgKGVuZCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgKyBzdGFydFxuICB9XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG4gIHZhciBpXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yIChpID0gbGVuIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2UgaWYgKGxlbiA8IDEwMDAgfHwgIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gYXNjZW5kaW5nIGNvcHkgZnJvbSBzdGFydFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoY29kZSA8IDI1Nikge1xuICAgICAgICB2YWwgPSBjb2RlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMjU1XG4gIH1cblxuICAvLyBJbnZhbGlkIHJhbmdlcyBhcmUgbm90IHNldCB0byBhIGRlZmF1bHQsIHNvIGNhbiByYW5nZSBjaGVjayBlYXJseS5cbiAgaWYgKHN0YXJ0IDwgMCB8fCB0aGlzLmxlbmd0aCA8IHN0YXJ0IHx8IHRoaXMubGVuZ3RoIDwgZW5kKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ091dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgPj4+IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyB0aGlzLmxlbmd0aCA6IGVuZCA+Pj4gMFxuXG4gIGlmICghdmFsKSB2YWwgPSAwXG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgdGhpc1tpXSA9IHZhbFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYnl0ZXMgPSBpbnRlcm5hbElzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IHV0ZjhUb0J5dGVzKG5ldyBCdWZmZXIodmFsLCBlbmNvZGluZykudG9TdHJpbmcoKSlcbiAgICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rXFwvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyaW5ndHJpbShzdHIpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICB2YXIgY29kZVBvaW50XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICB2YXIgYnl0ZXMgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuXG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBpc25hbiAodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IHZhbCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuXG5cbi8vIHRoZSBmb2xsb3dpbmcgaXMgZnJvbSBpcy1idWZmZXIsIGFsc28gYnkgRmVyb3NzIEFib3VraGFkaWplaCBhbmQgd2l0aCBzYW1lIGxpc2VuY2Vcbi8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcbi8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcbmV4cG9ydCBmdW5jdGlvbiBpc0J1ZmZlcihvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmICghIW9iai5faXNCdWZmZXIgfHwgaXNGYXN0QnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikpXG59XG5cbmZ1bmN0aW9uIGlzRmFzdEJ1ZmZlciAob2JqKSB7XG4gIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG5cbi8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5mdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzRmFzdEJ1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtCdWZmZXJ9IGZyb20gJ2J1ZmZlcic7XG52YXIgaXNCdWZmZXJFbmNvZGluZyA9IEJ1ZmZlci5pc0VuY29kaW5nXG4gIHx8IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gICAgICAgc3dpdGNoIChlbmNvZGluZyAmJiBlbmNvZGluZy50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICBjYXNlICdoZXgnOiBjYXNlICd1dGY4JzogY2FzZSAndXRmLTgnOiBjYXNlICdhc2NpaSc6IGNhc2UgJ2JpbmFyeSc6IGNhc2UgJ2Jhc2U2NCc6IGNhc2UgJ3VjczInOiBjYXNlICd1Y3MtMic6IGNhc2UgJ3V0ZjE2bGUnOiBjYXNlICd1dGYtMTZsZSc6IGNhc2UgJ3Jhdyc6IHJldHVybiB0cnVlO1xuICAgICAgICAgZGVmYXVsdDogcmV0dXJuIGZhbHNlO1xuICAgICAgIH1cbiAgICAgfVxuXG5cbmZ1bmN0aW9uIGFzc2VydEVuY29kaW5nKGVuY29kaW5nKSB7XG4gIGlmIChlbmNvZGluZyAmJiAhaXNCdWZmZXJFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZyk7XG4gIH1cbn1cblxuLy8gU3RyaW5nRGVjb2RlciBwcm92aWRlcyBhbiBpbnRlcmZhY2UgZm9yIGVmZmljaWVudGx5IHNwbGl0dGluZyBhIHNlcmllcyBvZlxuLy8gYnVmZmVycyBpbnRvIGEgc2VyaWVzIG9mIEpTIHN0cmluZ3Mgd2l0aG91dCBicmVha2luZyBhcGFydCBtdWx0aS1ieXRlXG4vLyBjaGFyYWN0ZXJzLiBDRVNVLTggaXMgaGFuZGxlZCBhcyBwYXJ0IG9mIHRoZSBVVEYtOCBlbmNvZGluZy5cbi8vXG4vLyBAVE9ETyBIYW5kbGluZyBhbGwgZW5jb2RpbmdzIGluc2lkZSBhIHNpbmdsZSBvYmplY3QgbWFrZXMgaXQgdmVyeSBkaWZmaWN1bHRcbi8vIHRvIHJlYXNvbiBhYm91dCB0aGlzIGNvZGUsIHNvIGl0IHNob3VsZCBiZSBzcGxpdCB1cCBpbiB0aGUgZnV0dXJlLlxuLy8gQFRPRE8gVGhlcmUgc2hvdWxkIGJlIGEgdXRmOC1zdHJpY3QgZW5jb2RpbmcgdGhhdCByZWplY3RzIGludmFsaWQgVVRGLTggY29kZVxuLy8gcG9pbnRzIGFzIHVzZWQgYnkgQ0VTVS04LlxuZXhwb3J0IGZ1bmN0aW9uIFN0cmluZ0RlY29kZXIoZW5jb2RpbmcpIHtcbiAgdGhpcy5lbmNvZGluZyA9IChlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvWy1fXS8sICcnKTtcbiAgYXNzZXJ0RW5jb2RpbmcoZW5jb2RpbmcpO1xuICBzd2l0Y2ggKHRoaXMuZW5jb2RpbmcpIHtcbiAgICBjYXNlICd1dGY4JzpcbiAgICAgIC8vIENFU1UtOCByZXByZXNlbnRzIGVhY2ggb2YgU3Vycm9nYXRlIFBhaXIgYnkgMy1ieXRlc1xuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgLy8gVVRGLTE2IHJlcHJlc2VudHMgZWFjaCBvZiBTdXJyb2dhdGUgUGFpciBieSAyLWJ5dGVzXG4gICAgICB0aGlzLnN1cnJvZ2F0ZVNpemUgPSAyO1xuICAgICAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhciA9IHV0ZjE2RGV0ZWN0SW5jb21wbGV0ZUNoYXI7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgLy8gQmFzZS02NCBzdG9yZXMgMyBieXRlcyBpbiA0IGNoYXJzLCBhbmQgcGFkcyB0aGUgcmVtYWluZGVyLlxuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMztcbiAgICAgIHRoaXMuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSBiYXNlNjREZXRlY3RJbmNvbXBsZXRlQ2hhcjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aGlzLndyaXRlID0gcGFzc1Rocm91Z2hXcml0ZTtcbiAgICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEVub3VnaCBzcGFjZSB0byBzdG9yZSBhbGwgYnl0ZXMgb2YgYSBzaW5nbGUgY2hhcmFjdGVyLiBVVEYtOCBuZWVkcyA0XG4gIC8vIGJ5dGVzLCBidXQgQ0VTVS04IG1heSByZXF1aXJlIHVwIHRvIDYgKDMgYnl0ZXMgcGVyIHN1cnJvZ2F0ZSkuXG4gIHRoaXMuY2hhckJ1ZmZlciA9IG5ldyBCdWZmZXIoNik7XG4gIC8vIE51bWJlciBvZiBieXRlcyByZWNlaXZlZCBmb3IgdGhlIGN1cnJlbnQgaW5jb21wbGV0ZSBtdWx0aS1ieXRlIGNoYXJhY3Rlci5cbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSAwO1xuICAvLyBOdW1iZXIgb2YgYnl0ZXMgZXhwZWN0ZWQgZm9yIHRoZSBjdXJyZW50IGluY29tcGxldGUgbXVsdGktYnl0ZSBjaGFyYWN0ZXIuXG4gIHRoaXMuY2hhckxlbmd0aCA9IDA7XG59O1xuXG5cbi8vIHdyaXRlIGRlY29kZXMgdGhlIGdpdmVuIGJ1ZmZlciBhbmQgcmV0dXJucyBpdCBhcyBKUyBzdHJpbmcgdGhhdCBpc1xuLy8gZ3VhcmFudGVlZCB0byBub3QgY29udGFpbiBhbnkgcGFydGlhbCBtdWx0aS1ieXRlIGNoYXJhY3RlcnMuIEFueSBwYXJ0aWFsXG4vLyBjaGFyYWN0ZXIgZm91bmQgYXQgdGhlIGVuZCBvZiB0aGUgYnVmZmVyIGlzIGJ1ZmZlcmVkIHVwLCBhbmQgd2lsbCBiZVxuLy8gcmV0dXJuZWQgd2hlbiBjYWxsaW5nIHdyaXRlIGFnYWluIHdpdGggdGhlIHJlbWFpbmluZyBieXRlcy5cbi8vXG4vLyBOb3RlOiBDb252ZXJ0aW5nIGEgQnVmZmVyIGNvbnRhaW5pbmcgYW4gb3JwaGFuIHN1cnJvZ2F0ZSB0byBhIFN0cmluZ1xuLy8gY3VycmVudGx5IHdvcmtzLCBidXQgY29udmVydGluZyBhIFN0cmluZyB0byBhIEJ1ZmZlciAodmlhIGBuZXcgQnVmZmVyYCwgb3Jcbi8vIEJ1ZmZlciN3cml0ZSkgd2lsbCByZXBsYWNlIGluY29tcGxldGUgc3Vycm9nYXRlcyB3aXRoIHRoZSB1bmljb2RlXG4vLyByZXBsYWNlbWVudCBjaGFyYWN0ZXIuIFNlZSBodHRwczovL2NvZGVyZXZpZXcuY2hyb21pdW0ub3JnLzEyMTE3MzAwOS8gLlxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgdmFyIGNoYXJTdHIgPSAnJztcbiAgLy8gaWYgb3VyIGxhc3Qgd3JpdGUgZW5kZWQgd2l0aCBhbiBpbmNvbXBsZXRlIG11bHRpYnl0ZSBjaGFyYWN0ZXJcbiAgd2hpbGUgKHRoaXMuY2hhckxlbmd0aCkge1xuICAgIC8vIGRldGVybWluZSBob3cgbWFueSByZW1haW5pbmcgYnl0ZXMgdGhpcyBidWZmZXIgaGFzIHRvIG9mZmVyIGZvciB0aGlzIGNoYXJcbiAgICB2YXIgYXZhaWxhYmxlID0gKGJ1ZmZlci5sZW5ndGggPj0gdGhpcy5jaGFyTGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQpID9cbiAgICAgICAgdGhpcy5jaGFyTGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQgOlxuICAgICAgICBidWZmZXIubGVuZ3RoO1xuXG4gICAgLy8gYWRkIHRoZSBuZXcgYnl0ZXMgdG8gdGhlIGNoYXIgYnVmZmVyXG4gICAgYnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCB0aGlzLmNoYXJSZWNlaXZlZCwgMCwgYXZhaWxhYmxlKTtcbiAgICB0aGlzLmNoYXJSZWNlaXZlZCArPSBhdmFpbGFibGU7XG5cbiAgICBpZiAodGhpcy5jaGFyUmVjZWl2ZWQgPCB0aGlzLmNoYXJMZW5ndGgpIHtcbiAgICAgIC8vIHN0aWxsIG5vdCBlbm91Z2ggY2hhcnMgaW4gdGhpcyBidWZmZXI/IHdhaXQgZm9yIG1vcmUgLi4uXG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIGJ5dGVzIGJlbG9uZ2luZyB0byB0aGUgY3VycmVudCBjaGFyYWN0ZXIgZnJvbSB0aGUgYnVmZmVyXG4gICAgYnVmZmVyID0gYnVmZmVyLnNsaWNlKGF2YWlsYWJsZSwgYnVmZmVyLmxlbmd0aCk7XG5cbiAgICAvLyBnZXQgdGhlIGNoYXJhY3RlciB0aGF0IHdhcyBzcGxpdFxuICAgIGNoYXJTdHIgPSB0aGlzLmNoYXJCdWZmZXIuc2xpY2UoMCwgdGhpcy5jaGFyTGVuZ3RoKS50b1N0cmluZyh0aGlzLmVuY29kaW5nKTtcblxuICAgIC8vIENFU1UtODogbGVhZCBzdXJyb2dhdGUgKEQ4MDAtREJGRikgaXMgYWxzbyB0aGUgaW5jb21wbGV0ZSBjaGFyYWN0ZXJcbiAgICB2YXIgY2hhckNvZGUgPSBjaGFyU3RyLmNoYXJDb2RlQXQoY2hhclN0ci5sZW5ndGggLSAxKTtcbiAgICBpZiAoY2hhckNvZGUgPj0gMHhEODAwICYmIGNoYXJDb2RlIDw9IDB4REJGRikge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoICs9IHRoaXMuc3Vycm9nYXRlU2l6ZTtcbiAgICAgIGNoYXJTdHIgPSAnJztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICB0aGlzLmNoYXJSZWNlaXZlZCA9IHRoaXMuY2hhckxlbmd0aCA9IDA7XG5cbiAgICAvLyBpZiB0aGVyZSBhcmUgbm8gbW9yZSBieXRlcyBpbiB0aGlzIGJ1ZmZlciwganVzdCBlbWl0IG91ciBjaGFyXG4gICAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjaGFyU3RyO1xuICAgIH1cbiAgICBicmVhaztcbiAgfVxuXG4gIC8vIGRldGVybWluZSBhbmQgc2V0IGNoYXJMZW5ndGggLyBjaGFyUmVjZWl2ZWRcbiAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpO1xuXG4gIHZhciBlbmQgPSBidWZmZXIubGVuZ3RoO1xuICBpZiAodGhpcy5jaGFyTGVuZ3RoKSB7XG4gICAgLy8gYnVmZmVyIHRoZSBpbmNvbXBsZXRlIGNoYXJhY3RlciBieXRlcyB3ZSBnb3RcbiAgICBidWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIDAsIGJ1ZmZlci5sZW5ndGggLSB0aGlzLmNoYXJSZWNlaXZlZCwgZW5kKTtcbiAgICBlbmQgLT0gdGhpcy5jaGFyUmVjZWl2ZWQ7XG4gIH1cblxuICBjaGFyU3RyICs9IGJ1ZmZlci50b1N0cmluZyh0aGlzLmVuY29kaW5nLCAwLCBlbmQpO1xuXG4gIHZhciBlbmQgPSBjaGFyU3RyLmxlbmd0aCAtIDE7XG4gIHZhciBjaGFyQ29kZSA9IGNoYXJTdHIuY2hhckNvZGVBdChlbmQpO1xuICAvLyBDRVNVLTg6IGxlYWQgc3Vycm9nYXRlIChEODAwLURCRkYpIGlzIGFsc28gdGhlIGluY29tcGxldGUgY2hhcmFjdGVyXG4gIGlmIChjaGFyQ29kZSA+PSAweEQ4MDAgJiYgY2hhckNvZGUgPD0gMHhEQkZGKSB7XG4gICAgdmFyIHNpemUgPSB0aGlzLnN1cnJvZ2F0ZVNpemU7XG4gICAgdGhpcy5jaGFyTGVuZ3RoICs9IHNpemU7XG4gICAgdGhpcy5jaGFyUmVjZWl2ZWQgKz0gc2l6ZTtcbiAgICB0aGlzLmNoYXJCdWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIHNpemUsIDAsIHNpemUpO1xuICAgIGJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgMCwgMCwgc2l6ZSk7XG4gICAgcmV0dXJuIGNoYXJTdHIuc3Vic3RyaW5nKDAsIGVuZCk7XG4gIH1cblxuICAvLyBvciBqdXN0IGVtaXQgdGhlIGNoYXJTdHJcbiAgcmV0dXJuIGNoYXJTdHI7XG59O1xuXG4vLyBkZXRlY3RJbmNvbXBsZXRlQ2hhciBkZXRlcm1pbmVzIGlmIHRoZXJlIGlzIGFuIGluY29tcGxldGUgVVRGLTggY2hhcmFjdGVyIGF0XG4vLyB0aGUgZW5kIG9mIHRoZSBnaXZlbiBidWZmZXIuIElmIHNvLCBpdCBzZXRzIHRoaXMuY2hhckxlbmd0aCB0byB0aGUgYnl0ZVxuLy8gbGVuZ3RoIHRoYXQgY2hhcmFjdGVyLCBhbmQgc2V0cyB0aGlzLmNoYXJSZWNlaXZlZCB0byB0aGUgbnVtYmVyIG9mIGJ5dGVzXG4vLyB0aGF0IGFyZSBhdmFpbGFibGUgZm9yIHRoaXMgY2hhcmFjdGVyLlxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgLy8gZGV0ZXJtaW5lIGhvdyBtYW55IGJ5dGVzIHdlIGhhdmUgdG8gY2hlY2sgYXQgdGhlIGVuZCBvZiB0aGlzIGJ1ZmZlclxuICB2YXIgaSA9IChidWZmZXIubGVuZ3RoID49IDMpID8gMyA6IGJ1ZmZlci5sZW5ndGg7XG5cbiAgLy8gRmlndXJlIG91dCBpZiBvbmUgb2YgdGhlIGxhc3QgaSBieXRlcyBvZiBvdXIgYnVmZmVyIGFubm91bmNlcyBhblxuICAvLyBpbmNvbXBsZXRlIGNoYXIuXG4gIGZvciAoOyBpID4gMDsgaS0tKSB7XG4gICAgdmFyIGMgPSBidWZmZXJbYnVmZmVyLmxlbmd0aCAtIGldO1xuXG4gICAgLy8gU2VlIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVVRGLTgjRGVzY3JpcHRpb25cblxuICAgIC8vIDExMFhYWFhYXG4gICAgaWYgKGkgPT0gMSAmJiBjID4+IDUgPT0gMHgwNikge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gMjtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIDExMTBYWFhYXG4gICAgaWYgKGkgPD0gMiAmJiBjID4+IDQgPT0gMHgwRSkge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gMztcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIDExMTEwWFhYXG4gICAgaWYgKGkgPD0gMyAmJiBjID4+IDMgPT0gMHgxRSkge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gNDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGk7XG59O1xuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgdmFyIHJlcyA9ICcnO1xuICBpZiAoYnVmZmVyICYmIGJ1ZmZlci5sZW5ndGgpXG4gICAgcmVzID0gdGhpcy53cml0ZShidWZmZXIpO1xuXG4gIGlmICh0aGlzLmNoYXJSZWNlaXZlZCkge1xuICAgIHZhciBjciA9IHRoaXMuY2hhclJlY2VpdmVkO1xuICAgIHZhciBidWYgPSB0aGlzLmNoYXJCdWZmZXI7XG4gICAgdmFyIGVuYyA9IHRoaXMuZW5jb2Rpbmc7XG4gICAgcmVzICs9IGJ1Zi5zbGljZSgwLCBjcikudG9TdHJpbmcoZW5jKTtcbiAgfVxuXG4gIHJldHVybiByZXM7XG59O1xuXG5mdW5jdGlvbiBwYXNzVGhyb3VnaFdyaXRlKGJ1ZmZlcikge1xuICByZXR1cm4gYnVmZmVyLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcpO1xufVxuXG5mdW5jdGlvbiB1dGYxNkRldGVjdEluY29tcGxldGVDaGFyKGJ1ZmZlcikge1xuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGJ1ZmZlci5sZW5ndGggJSAyO1xuICB0aGlzLmNoYXJMZW5ndGggPSB0aGlzLmNoYXJSZWNlaXZlZCA/IDIgOiAwO1xufVxuXG5mdW5jdGlvbiBiYXNlNjREZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpIHtcbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSBidWZmZXIubGVuZ3RoICUgMztcbiAgdGhpcy5jaGFyTGVuZ3RoID0gdGhpcy5jaGFyUmVjZWl2ZWQgPyAzIDogMDtcbn1cbiIsImltcG9ydCB7Z2VuZXJhdGVTY2hlbWF9IGZyb20gXCIuL2luZGV4U2NoZW1hQ3JlYXRvclwiO1xyXG5pbXBvcnQgeyBoYXMsIGlzU3RyaW5nLCBkaWZmZXJlbmNlLCBmaW5kIH0gZnJvbSBcImxvZGFzaC9mcFwiO1xyXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwic2FmZS1idWZmZXJcIjtcclxuaW1wb3J0IHtTdHJpbmdEZWNvZGVyfSBmcm9tIFwic3RyaW5nX2RlY29kZXJcIjtcclxuaW1wb3J0IHtnZXRUeXBlfSBmcm9tIFwiLi4vdHlwZXNcIjtcclxuaW1wb3J0IHsgaXNTb21ldGhpbmcgfSBmcm9tIFwiLi4vY29tbW9uXCI7XHJcblxyXG5leHBvcnQgY29uc3QgQlVGRkVSX01BWF9CWVRFUyA9IDUyNDI4ODsgLy8gMC41TWJcclxuXHJcbmV4cG9ydCBjb25zdCBDT05USU5VRV9SRUFESU5HX1JFQ09SRFMgPSBcIkNPTlRJTlVFX1JFQURJTkdcIjtcclxuZXhwb3J0IGNvbnN0IFJFQURfUkVNQUlOSU5HX1RFWFQgPSBcIlJFQURfUkVNQUlOSU5HXCI7XHJcbmV4cG9ydCBjb25zdCBDQU5DRUxfUkVBRCA9IFwiQ0FOQ0VMXCI7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhXcml0ZXIgPSAoaGllcmFyY2h5LCBpbmRleE5vZGUsIHJlYWRhYmxlU3RyZWFtLCB3cml0YWJsZVN0cmVhbSwgZW5kKSA9PiB7XHJcbiAgICBjb25zdCBzY2hlbWEgPSBnZW5lcmF0ZVNjaGVtYShoaWVyYXJjaHksIGluZGV4Tm9kZSk7XHJcblxyXG4gICAgcmV0dXJuICh7XHJcbiAgICAgICAgcmVhZDogcmVhZChyZWFkYWJsZVN0cmVhbSwgc2NoZW1hKSxcclxuICAgICAgICB1cGRhdGVJbmRleDogdXBkYXRlSW5kZXgocmVhZGFibGVTdHJlYW0sIHdyaXRhYmxlU3RyZWFtLCBzY2hlbWEsIGVuZClcclxuICAgIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEluZGV4UmVhZGVyID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlLCByZWFkYWJsZVN0cmVhbSkgPT4gXHJcbiAgICByZWFkKFxyXG4gICAgICAgIHJlYWRhYmxlU3RyZWFtLCBcclxuICAgICAgICBnZW5lcmF0ZVNjaGVtYShoaWVyYXJjaHksIGluZGV4Tm9kZSlcclxuICAgICk7XHJcblxyXG5jb25zdCB1cGRhdGVJbmRleCA9IChyZWFkYWJsZVN0cmVhbSwgd3JpdGFibGVTdHJlYW0sIHNjaGVtYSkgPT4gYXN5bmMgKGl0ZW1zVG9Xcml0ZSwga2V5c1RvUmVtb3ZlKSA9PiB7XHJcbiAgICBjb25zdCB3cml0ZSA9IG5ld091dHB1dFdyaXRlcihCVUZGRVJfTUFYX0JZVEVTLCB3cml0YWJsZVN0cmVhbSk7XHJcbiAgICBjb25zdCB3cml0dGVuSXRlbXMgPSBbXTsgXHJcbiAgICBhd2FpdCByZWFkKHJlYWRhYmxlU3RyZWFtLCBzY2hlbWEpKFxyXG4gICAgICAgIGFzeW5jIGluZGV4ZWRJdGVtID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXBkYXRlZCA9IGZpbmQoaSA9PiBpbmRleGVkSXRlbS5rZXkgPT09IGkua2V5KShpdGVtc1RvV3JpdGUpO1xyXG4gICAgICAgICAgICBjb25zdCByZW1vdmVkID0gZmluZChrID0+IGluZGV4ZWRJdGVtLmtleSA9PT0gaykoa2V5c1RvUmVtb3ZlKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKGlzU29tZXRoaW5nKHJlbW92ZWQpKSBcclxuICAgICAgICAgICAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XHJcblxyXG4gICAgICAgICAgICBpZihpc1NvbWV0aGluZyh1cGRhdGVkKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VyaWFsaXplZEl0ZW0gPSAgc2VyaWFsaXplSXRlbShzY2hlbWEsIHVwZGF0ZWQpO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgd3JpdGUoc2VyaWFsaXplZEl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgd3JpdHRlbkl0ZW1zLnB1c2godXBkYXRlZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB3cml0ZShcclxuICAgICAgICAgICAgICAgICAgICBzZXJpYWxpemVJdGVtKHNjaGVtYSwgaW5kZXhlZEl0ZW0pXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9IFxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBhc3luYyB0ZXh0ID0+IGF3YWl0IHdyaXRlKHRleHQpXHJcbiAgICApO1xyXG5cclxuICAgIGlmKHdyaXR0ZW5JdGVtcy5sZW5ndGggIT09IGl0ZW1zVG9Xcml0ZS5sZW5ndGgpIHtcclxuICAgICAgICBjb25zdCB0b0FkZCA9IGRpZmZlcmVuY2UoaXRlbXNUb1dyaXRlLCB3cml0dGVuSXRlbXMpO1xyXG4gICAgICAgIGZvcihsZXQgYWRkZWQgb2YgdG9BZGQpIHtcclxuICAgICAgICAgICAgYXdhaXQgd3JpdGUoXHJcbiAgICAgICAgICAgICAgICBzZXJpYWxpemVJdGVtKHNjaGVtYSwgYWRkZWQpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmKHdyaXR0ZW5JdGVtcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAvLyBwb3RlbnRpYWxseSBhcmUgbm8gcmVjb3Jkc1xyXG4gICAgICAgIGF3YWl0IHdyaXRlKFwiXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGF3YWl0IHdyaXRlKCk7XHJcbiAgICBhd2FpdCB3cml0YWJsZVN0cmVhbS5lbmQoKTtcclxufTtcclxuXHJcbmNvbnN0IHJlYWQgPSAocmVhZGFibGVTdHJlYW0sIHNjaGVtYSkgPT4gYXN5bmMgKG9uR2V0SXRlbSwgb25HZXRUZXh0KSA9PiB7XHJcbiAgICBjb25zdCByZWFkSW5wdXQgPSBuZXdJbnB1dFJlYWRlcihyZWFkYWJsZVN0cmVhbSk7XHJcbiAgICBsZXQgdGV4dCA9IGF3YWl0IHJlYWRJbnB1dCgpO1xyXG4gICAgbGV0IHN0YXR1cyA9IENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcclxuICAgIHdoaWxlKHRleHQubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICBpZihzdGF0dXMgPT09IFJFQURfUkVNQUlOSU5HX1RFWFQpIHtcclxuICAgICAgICAgICAgYXdhaXQgb25HZXRUZXh0KHRleHQpO1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHN0YXR1cyA9PT0gQ0FOQ0VMX1JFQUQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJvd1RleHQgPSBcIlwiO1xyXG4gICAgICAgIGxldCBjdXJyZW50Q2hhckluZGV4PTA7XHJcbiAgICAgICAgZm9yKGxldCBjdXJyZW50Q2hhciBvZiB0ZXh0KSB7XHJcbiAgICAgICAgICAgIHJvd1RleHQgKz0gY3VycmVudENoYXI7XHJcbiAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcIlxcclwiKSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXMgPSBhd2FpdCBvbkdldEl0ZW0oXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzZXJpYWxpemVSb3coc2NoZW1hLCByb3dUZXh0KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIHJvd1RleHQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaWYoc3RhdHVzID09PSBSRUFEX1JFTUFJTklOR19URVhUKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3VycmVudENoYXJJbmRleCsrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoY3VycmVudENoYXJJbmRleCA8IHRleHQubGVuZ3RoIC0xKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IG9uR2V0VGV4dCh0ZXh0LnN1YnN0cmluZyhjdXJyZW50Q2hhckluZGV4ICsgMSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGV4dCA9IGF3YWl0IHJlYWRJbnB1dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGF3YWl0IHJlYWRhYmxlU3RyZWFtLmRlc3Ryb3koKTtcclxuXHJcbn07XHJcblxyXG5jb25zdCBuZXdPdXRwdXRXcml0ZXIgPSAoZmx1c2hCb3VuZGFyeSwgd3JpdGFibGVTdHJlYW0pID0+IHtcclxuICAgIFxyXG4gICAgbGV0IGN1cnJlbnRCdWZmZXIgPSBudWxsO1xyXG5cclxuICAgIHJldHVybiBhc3luYyAodGV4dCkgPT4ge1xyXG5cclxuICAgICAgICBpZihpc1N0cmluZyh0ZXh0KSAmJiBjdXJyZW50QnVmZmVyID09PSBudWxsKVxyXG4gICAgICAgICAgICBjdXJyZW50QnVmZmVyID0gQnVmZmVyLmZyb20odGV4dCwgXCJ1dGY4XCIpO1xyXG4gICAgICAgIGVsc2UgaWYoaXNTdHJpbmcodGV4dCkpXHJcbiAgICAgICAgICAgIGN1cnJlbnRCdWZmZXIgPSBCdWZmZXIuY29uY2F0KFtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRCdWZmZXIsXHJcbiAgICAgICAgICAgICAgICBCdWZmZXIuZnJvbSh0ZXh0LCBcInV0ZjhcIilcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoY3VycmVudEJ1ZmZlciAhPT0gbnVsbCAmJlxyXG4gICAgICAgICAgICAoY3VycmVudEJ1ZmZlci5sZW5ndGggPiBmbHVzaEJvdW5kYXJ5XHJcbiAgICAgICAgICAgICB8fCAhaXNTdHJpbmcodGV4dCkpKSB7XHJcblxyXG4gICAgICAgICAgICBhd2FpdCB3cml0YWJsZVN0cmVhbS53cml0ZShjdXJyZW50QnVmZmVyKTtcclxuICAgICAgICAgICAgY3VycmVudEJ1ZmZlciA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgbmV3SW5wdXRSZWFkZXIgPSAocmVhZGFibGVTdHJlYW0pID0+IHtcclxuXHJcbiAgICBjb25zdCBkZWNvZGVyID0gbmV3IFN0cmluZ0RlY29kZXIoJ3V0ZjgnKTtcclxuICAgIGxldCByZW1haW5pbmdCeXRlcyA9IFtdO1xyXG5cclxuICAgIHJldHVybiBhc3luYyAoKSA9PiB7XHJcblxyXG4gICAgICAgIGxldCBuZXh0Qnl0ZXNCdWZmZXIgPSBhd2FpdCByZWFkYWJsZVN0cmVhbS5yZWFkKEJVRkZFUl9NQVhfQllURVMpO1xyXG4gICAgICAgIGNvbnN0IHJlbWFpbmluZ0J1ZmZlciA9IEJ1ZmZlci5mcm9tKHJlbWFpbmluZ0J5dGVzKTtcclxuXHJcbiAgICAgICAgaWYoIW5leHRCeXRlc0J1ZmZlcikgbmV4dEJ5dGVzQnVmZmVyID0gQnVmZmVyLmZyb20oW10pO1xyXG5cclxuICAgICAgICBjb25zdCBtb3JlVG9SZWFkID0gbmV4dEJ5dGVzQnVmZmVyLmxlbmd0aCA9PT0gQlVGRkVSX01BWF9CWVRFUztcclxuXHJcbiAgICAgICAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmNvbmNhdChcclxuICAgICAgICAgICAgW3JlbWFpbmluZ0J1ZmZlciwgbmV4dEJ5dGVzQnVmZmVyXSxcclxuICAgICAgICAgICAgcmVtYWluaW5nQnVmZmVyLmxlbmd0aCArIG5leHRCeXRlc0J1ZmZlci5sZW5ndGgpO1xyXG5cclxuICAgICAgICBjb25zdCB0ZXh0ID0gZGVjb2Rlci53cml0ZShidWZmZXIpO1xyXG4gICAgICAgIHJlbWFpbmluZ0J5dGVzID0gZGVjb2Rlci5lbmQoYnVmZmVyKTtcclxuXHJcbiAgICAgICAgaWYoIW1vcmVUb1JlYWQgJiYgcmVtYWluaW5nQnl0ZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAvLyBpZiBmb3IgYW55IHJlYXNvbiwgd2UgaGF2ZSByZW1haW5pbmcgYnl0ZXMgYXQgdGhlIGVuZFxyXG4gICAgICAgICAgICAvLyBvZiB0aGUgc3RyZWFtLCBqdXN0IGRpc2NhcmQgLSBkb250IHNlZSB3aHkgdGhpcyBzaG91bGRcclxuICAgICAgICAgICAgLy8gZXZlciBoYXBwZW4sIGJ1dCBpZiBpdCBkb2VzLCBpdCBjb3VsZCBjYXVzZSBhIHN0YWNrIG92ZXJmbG93XHJcbiAgICAgICAgICAgIHJlbWFpbmluZ0J5dGVzID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgIH07XHJcbn07XHJcblxyXG5jb25zdCBkZXNlcmlhbGl6ZVJvdyA9IChzY2hlbWEsIHJvd1RleHQpID0+IHtcclxuICAgIGxldCBjdXJyZW50UHJvcEluZGV4ID0gMDtcclxuICAgIGxldCBjdXJyZW50Q2hhckluZGV4ID0gMDtcclxuICAgIGxldCBjdXJyZW50VmFsdWVUZXh0ID0gXCJcIjtcclxuICAgIGxldCBpc0VzY2FwZWQgPSBmYWxzZTtcclxuICAgIGNvbnN0IGl0ZW0gPSB7fTtcclxuXHJcbiAgICBjb25zdCBzZXRDdXJyZW50UHJvcCA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBjdXJyZW50UHJvcCA9IHNjaGVtYVtjdXJyZW50UHJvcEluZGV4XTtcclxuICAgICAgICBjb25zdCB0eXBlID0gZ2V0VHlwZShjdXJyZW50UHJvcC50eXBlKTtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGN1cnJlbnRWYWx1ZVRleHQgPT09IFwiXCJcclxuICAgICAgICAgICAgICAgICAgICAgID8gdHlwZS5nZXREZWZhdWx0VmFsdWUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiB0eXBlLnNhZmVQYXJzZVZhbHVlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZVRleHQpO1xyXG4gICAgICAgIGl0ZW1bY3VycmVudFByb3AubmFtZV0gPSB2YWx1ZTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIHdoaWxlKGN1cnJlbnRQcm9wSW5kZXggPCBzY2hlbWEubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgIGlmKGN1cnJlbnRDaGFySW5kZXggPCByb3dUZXh0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2hhciA9IHJvd1RleHRbY3VycmVudENoYXJJbmRleF07XHJcbiAgICAgICAgICAgIGlmKGlzRXNjYXBlZCkge1xyXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudENoYXIgPT09IFwiclwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCArPSBcIlxcclwiO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWVUZXh0ICs9IGN1cnJlbnRDaGFyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaXNFc2NhcGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCIsXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRDdXJyZW50UHJvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZVRleHQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQcm9wSW5kZXgrKztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihjdXJyZW50Q2hhciA9PT0gXCJcXFxcXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpc0VzY2FwZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWVUZXh0ICs9IGN1cnJlbnRDaGFyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN1cnJlbnRDaGFySW5kZXgrKzsgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHNldEN1cnJlbnRQcm9wKCk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRQcm9wSW5kZXgrKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGl0ZW07XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3Qgc2VyaWFsaXplSXRlbSA9IChzY2hlbWEsIGl0ZW0pICA9PiB7XHJcblxyXG4gICAgbGV0IHJvd1RleHQgPSBcIlwiXHJcblxyXG4gICAgZm9yKGxldCBwcm9wIG9mIHNjaGVtYSkge1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBnZXRUeXBlKHByb3AudHlwZSk7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBoYXMocHJvcC5uYW1lKShpdGVtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgPyBpdGVtW3Byb3AubmFtZV1cclxuICAgICAgICAgICAgICAgICAgICAgIDogdHlwZS5nZXREZWZhdWx0VmFsdWUoKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHZhbFN0ciA9IHR5cGUuc3RyaW5naWZ5KHZhbHVlKTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHZhbFN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2hhciA9IHZhbFN0cltpXTtcclxuICAgICAgICAgICAgaWYoY3VycmVudENoYXIgPT09IFwiLFwiIFxyXG4gICAgICAgICAgICAgICB8fCBjdXJyZW50Q2hhciA9PT0gXCJcXHJcIiBcclxuICAgICAgICAgICAgICAgfHwgY3VycmVudENoYXIgPT09IFwiXFxcXFwiKSB7XHJcbiAgICAgICAgICAgICAgICByb3dUZXh0ICs9IFwiXFxcXFwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCJcXHJcIikge1xyXG4gICAgICAgICAgICAgICAgcm93VGV4dCArPSBcInJcIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJvd1RleHQgKz0gY3VycmVudENoYXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvd1RleHQgKz0gXCIsXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcm93VGV4dCArPSBcIlxcclwiO1xyXG4gICAgcmV0dXJuIHJvd1RleHQ7XHJcbn07IiwiaW1wb3J0IGx1bnIgZnJvbSAnbHVucic7XHJcbmltcG9ydCB7XHJcbiAgZ2V0SGFzaENvZGUsXHJcbiAgam9pbktleVxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7XHJcbiAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQsXHJcbiAgaXNHbG9iYWxJbmRleCxcclxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQge3Byb21pc2VSZWFkYWJsZVN0cmVhbX0gZnJvbSBcIi4vcHJvbWlzZVJlYWRhYmxlU3RyZWFtXCI7XHJcbmltcG9ydCB7IGNyZWF0ZUluZGV4RmlsZSB9IGZyb20gJy4vc2hhcmRpbmcnO1xyXG5pbXBvcnQgeyBnZW5lcmF0ZVNjaGVtYSB9IGZyb20gJy4vaW5kZXhTY2hlbWFDcmVhdG9yJztcclxuaW1wb3J0IHsgZ2V0SW5kZXhSZWFkZXIsIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUyB9IGZyb20gJy4vc2VyaWFsaXplcic7XHJcblxyXG5leHBvcnQgY29uc3QgcmVhZEluZGV4ID0gYXN5bmMgKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXkpID0+IHtcclxuICBjb25zdCByZWNvcmRzID0gW107XHJcbiAgY29uc3QgZG9SZWFkID0gaXRlcmF0ZUluZGV4KFxyXG4gICAgICAgIGFzeW5jIGl0ZW0gPT4ge1xyXG4gICAgICByZWNvcmRzLnB1c2goaXRlbSk7XHJcbiAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XHJcbiAgICB9LFxyXG4gICAgICAgIGFzeW5jICgpID0+IHJlY29yZHNcclxuICApO1xyXG5cclxuICByZXR1cm4gYXdhaXQgZG9SZWFkKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXkpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHNlYXJjaEluZGV4ID0gYXN5bmMgKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXksIHNlYXJjaFBocmFzZSkgPT4ge1xyXG4gIGNvbnN0IHJlY29yZHMgPSBbXTtcclxuICBjb25zdCBzY2hlbWEgPSBnZW5lcmF0ZVNjaGVtYShoaWVyYXJjaHksIGluZGV4KTtcclxuICBjb25zdCBkb1JlYWQgPSBpdGVyYXRlSW5kZXgoXHJcbiAgICAgICAgYXN5bmMgaXRlbSA9PiB7XHJcbiAgICAgIGNvbnN0IGlkeCA9IGx1bnIoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucmVmKCdrZXknKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIHNjaGVtYSkge1xyXG4gICAgICAgICAgdGhpcy5maWVsZChmaWVsZC5uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hZGQoaXRlbSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBjb25zdCBzZWFyY2hSZXN1bHRzID0gaWR4LnNlYXJjaChzZWFyY2hQaHJhc2UpO1xyXG4gICAgICBpZiAoc2VhcmNoUmVzdWx0cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICBpdGVtLl9zZWFyY2hSZXN1bHQgPSBzZWFyY2hSZXN1bHRzWzBdO1xyXG4gICAgICAgIHJlY29yZHMucHVzaChpdGVtKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xyXG4gICAgfSxcclxuICAgICAgICBhc3luYyAoKSA9PiByZWNvcmRzXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIGF3YWl0IGRvUmVhZChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRJbmRleGVkRGF0YUtleV9mcm9tSW5kZXhLZXkgPSAoaW5kZXhLZXkpID0+IFxyXG4gIGAke2luZGV4S2V5fSR7aW5kZXhLZXkuZW5kc1dpdGgoJy5jc3YnKSA/ICcnIDogJy5jc3YnfWA7XHJcblxyXG5leHBvcnQgY29uc3QgdW5pcXVlSW5kZXhOYW1lID0gaW5kZXggPT4gYGlkeF8ke1xyXG4gIGdldEhhc2hDb2RlKGAke2luZGV4LmZpbHRlcn0ke2luZGV4Lm1hcH1gKVxyXG59LmNzdmA7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhlZERhdGFLZXkgPSAoZGVjZW5kYW50S2V5LCBpbmRleE5vZGUpID0+IHtcclxuICBpZiAoaXNHbG9iYWxJbmRleChpbmRleE5vZGUpKSB7IHJldHVybiBgJHtpbmRleE5vZGUubm9kZUtleSgpfS5jc3ZgOyB9XHJcblxyXG4gIGNvbnN0IGluZGV4ZWREYXRhUGFyZW50S2V5ID0gZ2V0QWN0dWFsS2V5T2ZQYXJlbnQoXHJcbiAgICBpbmRleE5vZGUucGFyZW50KCkubm9kZUtleSgpLFxyXG4gICAgZGVjZW5kYW50S2V5LFxyXG4gICk7XHJcblxyXG4gIGNvbnN0IGluZGV4TmFtZSA9IGluZGV4Tm9kZS5uYW1lXHJcbiAgICA/IGAke2luZGV4Tm9kZS5uYW1lfS5jc3ZgXHJcbiAgICA6IHVuaXF1ZUluZGV4TmFtZShpbmRleE5vZGUpO1xyXG5cclxuICByZXR1cm4gam9pbktleShcclxuICAgIGluZGV4ZWREYXRhUGFyZW50S2V5LFxyXG4gICAgaW5kZXhOYW1lLFxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgaXRlcmF0ZUluZGV4ID0gKG9uR2V0SXRlbSwgZ2V0RmluYWxSZXN1bHQpID0+IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlYWRhYmxlU3RyZWFtID0gcHJvbWlzZVJlYWRhYmxlU3RyZWFtKFxyXG4gICAgICAgIGF3YWl0IGRhdGFzdG9yZS5yZWFkYWJsZUZpbGVTdHJlYW0oaW5kZXhlZERhdGFLZXkpXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IHJlYWQgPSBnZXRJbmRleFJlYWRlcihoaWVyYXJjaHksIGluZGV4LCByZWFkYWJsZVN0cmVhbSk7XHJcbiAgICBhd2FpdCByZWFkKG9uR2V0SXRlbSk7XHJcbiAgICByZXR1cm4gZ2V0RmluYWxSZXN1bHQoKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBpZiAoYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhpbmRleGVkRGF0YUtleSkpIHtcclxuICAgICAgdGhyb3cgZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGF3YWl0IGNyZWF0ZUluZGV4RmlsZShcclxuICAgICAgICBkYXRhc3RvcmUsXHJcbiAgICAgICAgaW5kZXhlZERhdGFLZXksXHJcbiAgICAgICAgaW5kZXgsXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG59O1xyXG4iLCJpbXBvcnQgeyBmbGF0dGVuLCBtZXJnZSB9IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7XHJcbiAgc2FmZUtleSwgYXBpV3JhcHBlciwgJCxcclxuICBldmVudHMsIGlzTm9uRW1wdHlTdHJpbmcsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgcmVhZEluZGV4LCBzZWFyY2hJbmRleCB9IGZyb20gJy4uL2luZGV4aW5nL3JlYWQnO1xyXG5pbXBvcnQge1xyXG4gIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSxcclxuICBnZXRTaGFyZEtleXNJblJhbmdlLFxyXG59IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcclxuaW1wb3J0IHtcclxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLCBpc0luZGV4LFxyXG4gIGlzU2hhcmRlZEluZGV4LFxyXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcclxuXHJcbmV4cG9ydCBjb25zdCBsaXN0SXRlbXMgPSBhcHAgPT4gYXN5bmMgKGluZGV4S2V5LCBvcHRpb25zKSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMuaW5kZXhBcGkubGlzdEl0ZW1zLFxyXG4gIHBlcm1pc3Npb24ucmVhZEluZGV4LmlzQXV0aG9yaXplZChpbmRleEtleSksXHJcbiAgeyBpbmRleEtleSwgb3B0aW9ucyB9LFxyXG4gIF9saXN0SXRlbXMsIGFwcCwgaW5kZXhLZXksIG9wdGlvbnMsXHJcbik7XHJcblxyXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHsgcmFuZ2VTdGFydFBhcmFtczogbnVsbCwgcmFuZ2VFbmRQYXJhbXM6IG51bGwsIHNlYXJjaFBocmFzZTogbnVsbCB9O1xyXG5cclxuY29uc3QgX2xpc3RJdGVtcyA9IGFzeW5jIChhcHAsIGluZGV4S2V5LCBvcHRpb25zID0gZGVmYXVsdE9wdGlvbnMpID0+IHtcclxuICBjb25zdCB7IHNlYXJjaFBocmFzZSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMgfSA9ICQoe30sIFtcclxuICAgIG1lcmdlKG9wdGlvbnMpLFxyXG4gICAgbWVyZ2UoZGVmYXVsdE9wdGlvbnMpLFxyXG4gIF0pO1xyXG5cclxuICBjb25zdCBnZXRJdGVtcyA9IGFzeW5jIGtleSA9PiAoaXNOb25FbXB0eVN0cmluZyhzZWFyY2hQaHJhc2UpXHJcbiAgICA/IGF3YWl0IHNlYXJjaEluZGV4KFxyXG4gICAgICBhcHAuaGllcmFyY2h5LFxyXG4gICAgICBhcHAuZGF0YXN0b3JlLFxyXG4gICAgICBpbmRleE5vZGUsXHJcbiAgICAgIGtleSxcclxuICAgICAgc2VhcmNoUGhyYXNlLFxyXG4gICAgKVxyXG4gICAgOiBhd2FpdCByZWFkSW5kZXgoXHJcbiAgICAgIGFwcC5oaWVyYXJjaHksXHJcbiAgICAgIGFwcC5kYXRhc3RvcmUsXHJcbiAgICAgIGluZGV4Tm9kZSxcclxuICAgICAga2V5LFxyXG4gICAgKSk7XHJcblxyXG4gIGluZGV4S2V5ID0gc2FmZUtleShpbmRleEtleSk7XHJcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShpbmRleEtleSk7XHJcblxyXG4gIGlmICghaXNJbmRleChpbmRleE5vZGUpKSB7IHRocm93IG5ldyBFcnJvcignc3VwcGxpZWQga2V5IGlzIG5vdCBhbiBpbmRleCcpOyB9XHJcblxyXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleE5vZGUpKSB7XHJcbiAgICBjb25zdCBzaGFyZEtleXMgPSBhd2FpdCBnZXRTaGFyZEtleXNJblJhbmdlKFxyXG4gICAgICBhcHAsIGluZGV4S2V5LCByYW5nZVN0YXJ0UGFyYW1zLCByYW5nZUVuZFBhcmFtcyxcclxuICAgICk7XHJcbiAgICBjb25zdCBpdGVtcyA9IFtdO1xyXG4gICAgZm9yIChjb25zdCBrIG9mIHNoYXJkS2V5cykge1xyXG4gICAgICBpdGVtcy5wdXNoKGF3YWl0IGdldEl0ZW1zKGspKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmbGF0dGVuKGl0ZW1zKTtcclxuICB9XHJcbiAgcmV0dXJuIGF3YWl0IGdldEl0ZW1zKFxyXG4gICAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5KGluZGV4S2V5KSxcclxuICApO1xyXG59O1xyXG4iLCJpbXBvcnQgeyBoYXMsIHNvbWUgfSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBtYXAsIGlzU3RyaW5nIH0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHtcclxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxyXG4gIGZpbmRGaWVsZCwgZ2V0Tm9kZSwgaXNHbG9iYWxJbmRleCxcclxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBsaXN0SXRlbXMgfSBmcm9tICcuLi9pbmRleEFwaS9saXN0SXRlbXMnO1xyXG5pbXBvcnQge1xyXG4gICQsIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgZ2V0SW5kZXhLZXlfQmFzZWRPbkRlY2VuZGFudCB9IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcclxuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldENvbnRleHQgPSBhcHAgPT4gcmVjb3JkS2V5ID0+IGFwaVdyYXBwZXJTeW5jKFxyXG4gIGFwcCxcclxuICBldmVudHMucmVjb3JkQXBpLmdldENvbnRleHQsXHJcbiAgcGVybWlzc2lvbi5yZWFkUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmRLZXkpLFxyXG4gIHsgcmVjb3JkS2V5IH0sXHJcbiAgX2dldENvbnRleHQsIGFwcCwgcmVjb3JkS2V5LFxyXG4pO1xyXG5cclxuZXhwb3J0IGNvbnN0IF9nZXRDb250ZXh0ID0gKGFwcCwgcmVjb3JkS2V5KSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkocmVjb3JkS2V5KTtcclxuXHJcbiAgY29uc3QgY2FjaGVkUmVmZXJlbmNlSW5kZXhlcyA9IHt9O1xyXG5cclxuICBjb25zdCBsYXp5TG9hZFJlZmVyZW5jZUluZGV4ID0gYXN5bmMgKHR5cGVPcHRpb25zKSA9PiB7XHJcbiAgICBpZiAoIWhhcyhjYWNoZWRSZWZlcmVuY2VJbmRleGVzLCB0eXBlT3B0aW9ucy5pbmRleE5vZGVLZXkpKSB7XHJcbiAgICAgIGNhY2hlZFJlZmVyZW5jZUluZGV4ZXNbdHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5XSA9IHtcclxuICAgICAgICB0eXBlT3B0aW9ucyxcclxuICAgICAgICBkYXRhOiBhd2FpdCByZWFkUmVmZXJlbmNlSW5kZXgoXHJcbiAgICAgICAgICBhcHAsIHJlY29yZEtleSwgdHlwZU9wdGlvbnMsXHJcbiAgICAgICAgKSxcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2FjaGVkUmVmZXJlbmNlSW5kZXhlc1t0eXBlT3B0aW9ucy5pbmRleE5vZGVLZXldO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdldFR5cGVPcHRpb25zID0gdHlwZU9wdGlvbnNfb3JfZmllbGROYW1lID0+IChpc1N0cmluZyh0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUpXHJcbiAgICA/IGZpbmRGaWVsZChyZWNvcmROb2RlLCB0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUpXHJcbiAgICAgIC50eXBlT3B0aW9uc1xyXG4gICAgOiB0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgcmVmZXJlbmNlRXhpc3RzOiBhc3luYyAodHlwZU9wdGlvbnNfb3JfZmllbGROYW1lLCBrZXkpID0+IHtcclxuICAgICAgY29uc3QgdHlwZU9wdGlvbnMgPSBnZXRUeXBlT3B0aW9ucyh0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUpO1xyXG4gICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGxhenlMb2FkUmVmZXJlbmNlSW5kZXgodHlwZU9wdGlvbnMpO1xyXG4gICAgICByZXR1cm4gc29tZShkYXRhLCBpID0+IGkua2V5ID09PSBrZXkpO1xyXG4gICAgfSxcclxuICAgIHJlZmVyZW5jZU9wdGlvbnM6IGFzeW5jICh0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUpID0+IHtcclxuICAgICAgY29uc3QgdHlwZU9wdGlvbnMgPSBnZXRUeXBlT3B0aW9ucyh0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUpO1xyXG4gICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGxhenlMb2FkUmVmZXJlbmNlSW5kZXgodHlwZU9wdGlvbnMpO1xyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH0sXHJcbiAgICByZWNvcmROb2RlLFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCByZWFkUmVmZXJlbmNlSW5kZXggPSBhc3luYyAoYXBwLCByZWNvcmRLZXksIHR5cGVPcHRpb25zKSA9PiB7XHJcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0Tm9kZShhcHAuaGllcmFyY2h5LCB0eXBlT3B0aW9ucy5pbmRleE5vZGVLZXkpO1xyXG4gIGNvbnN0IGluZGV4S2V5ID0gaXNHbG9iYWxJbmRleChpbmRleE5vZGUpXHJcbiAgICA/IGluZGV4Tm9kZS5ub2RlS2V5KClcclxuICAgIDogZ2V0SW5kZXhLZXlfQmFzZWRPbkRlY2VuZGFudChcclxuICAgICAgcmVjb3JkS2V5LCBpbmRleE5vZGUsXHJcbiAgICApO1xyXG5cclxuICBjb25zdCBpdGVtcyA9IGF3YWl0IGxpc3RJdGVtcyhhcHApKGluZGV4S2V5KTtcclxuICByZXR1cm4gJChpdGVtcywgW1xyXG4gICAgbWFwKGkgPT4gKHtcclxuICAgICAga2V5OiBpLmtleSxcclxuICAgICAgdmFsdWU6IGlbdHlwZU9wdGlvbnMuZGlzcGxheVZhbHVlXSxcclxuICAgIH0pKSxcclxuICBdKTtcclxufTtcclxuIiwiaW1wb3J0IHtcclxuICBtYXAsIHJlZHVjZSwgZmlsdGVyLFxyXG4gIGlzRW1wdHksIGZsYXR0ZW4sIGVhY2gsXHJcbn0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgY29tcGlsZUV4cHJlc3Npb24gfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IGdldEV4YWN0Tm9kZUZvclBhdGggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyB2YWxpZGF0ZUZpZWxkUGFyc2UsIHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzIH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5pbXBvcnQgeyAkLCBpc05vdGhpbmcsIGlzTm9uRW1wdHlTdHJpbmcgfSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBfZ2V0Q29udGV4dCB9IGZyb20gJy4vZ2V0Q29udGV4dCc7XHJcblxyXG5jb25zdCBmaWVsZFBhcnNlRXJyb3IgPSAoZmllbGROYW1lLCB2YWx1ZSkgPT4gKHtcclxuICBmaWVsZHM6IFtmaWVsZE5hbWVdLFxyXG4gIG1lc3NhZ2U6IGBDb3VsZCBub3QgcGFyc2UgZmllbGQgJHtmaWVsZE5hbWV9OiR7dmFsdWV9YCxcclxufSk7XHJcblxyXG5jb25zdCB2YWxpZGF0ZUFsbEZpZWxkUGFyc2UgPSAocmVjb3JkLCByZWNvcmROb2RlKSA9PiAkKHJlY29yZE5vZGUuZmllbGRzLCBbXHJcbiAgbWFwKGYgPT4gKHsgbmFtZTogZi5uYW1lLCBwYXJzZVJlc3VsdDogdmFsaWRhdGVGaWVsZFBhcnNlKGYsIHJlY29yZCkgfSkpLFxyXG4gIHJlZHVjZSgoZXJyb3JzLCBmKSA9PiB7XHJcbiAgICBpZiAoZi5wYXJzZVJlc3VsdC5zdWNjZXNzKSByZXR1cm4gZXJyb3JzO1xyXG4gICAgZXJyb3JzLnB1c2goXHJcbiAgICAgIGZpZWxkUGFyc2VFcnJvcihmLm5hbWUsIGYucGFyc2VSZXN1bHQudmFsdWUpLFxyXG4gICAgKTtcclxuICAgIHJldHVybiBlcnJvcnM7XHJcbiAgfSwgW10pLFxyXG5dKTtcclxuXHJcbmNvbnN0IHZhbGlkYXRlQWxsVHlwZUNvbnN0cmFpbnRzID0gYXN5bmMgKHJlY29yZCwgcmVjb3JkTm9kZSwgY29udGV4dCkgPT4ge1xyXG4gIGNvbnN0IGVycm9ycyA9IFtdO1xyXG4gIGZvciAoY29uc3QgZmllbGQgb2YgcmVjb3JkTm9kZS5maWVsZHMpIHtcclxuICAgICQoYXdhaXQgdmFsaWRhdGVUeXBlQ29uc3RyYWludHMoZmllbGQsIHJlY29yZCwgY29udGV4dCksIFtcclxuICAgICAgZmlsdGVyKGlzTm9uRW1wdHlTdHJpbmcpLFxyXG4gICAgICBtYXAobSA9PiAoeyBtZXNzYWdlOiBtLCBmaWVsZHM6IFtmaWVsZC5uYW1lXSB9KSksXHJcbiAgICAgIGVhY2goZSA9PiBlcnJvcnMucHVzaChlKSksXHJcbiAgICBdKTtcclxuICB9XHJcbiAgcmV0dXJuIGVycm9ycztcclxufTtcclxuXHJcbmNvbnN0IHJ1blJlY29yZFZhbGlkYXRpb25SdWxlcyA9IChyZWNvcmQsIHJlY29yZE5vZGUpID0+IHtcclxuICBjb25zdCBydW5WYWxpZGF0aW9uUnVsZSA9IChydWxlKSA9PiB7XHJcbiAgICBjb25zdCBpc1ZhbGlkID0gY29tcGlsZUV4cHJlc3Npb24ocnVsZS5leHByZXNzaW9uV2hlblZhbGlkKTtcclxuICAgIGNvbnN0IGV4cHJlc3Npb25Db250ZXh0ID0geyByZWNvcmQsIF8gfTtcclxuICAgIHJldHVybiAoaXNWYWxpZChleHByZXNzaW9uQ29udGV4dClcclxuICAgICAgPyB7IHZhbGlkOiB0cnVlIH1cclxuICAgICAgOiAoe1xyXG4gICAgICAgIHZhbGlkOiBmYWxzZSxcclxuICAgICAgICBmaWVsZHM6IHJ1bGUuaW52YWxpZEZpZWxkcyxcclxuICAgICAgICBtZXNzYWdlOiBydWxlLm1lc3NhZ2VXaGVuSW52YWxpZCxcclxuICAgICAgfSkpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAkKHJlY29yZE5vZGUudmFsaWRhdGlvblJ1bGVzLCBbXHJcbiAgICBtYXAocnVuVmFsaWRhdGlvblJ1bGUpLFxyXG4gICAgZmxhdHRlbixcclxuICAgIGZpbHRlcihyID0+IHIudmFsaWQgPT09IGZhbHNlKSxcclxuICAgIG1hcChyID0+ICh7IGZpZWxkczogci5maWVsZHMsIG1lc3NhZ2U6IHIubWVzc2FnZSB9KSksXHJcbiAgXSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgdmFsaWRhdGUgPSBhcHAgPT4gYXN5bmMgKHJlY29yZCwgY29udGV4dCkgPT4ge1xyXG4gIGNvbnRleHQgPSBpc05vdGhpbmcoY29udGV4dClcclxuICAgID8gX2dldENvbnRleHQoYXBwLCByZWNvcmQua2V5KVxyXG4gICAgOiBjb250ZXh0O1xyXG5cclxuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShyZWNvcmQua2V5KTtcclxuICBjb25zdCBmaWVsZFBhcnNlRmFpbHMgPSB2YWxpZGF0ZUFsbEZpZWxkUGFyc2UocmVjb3JkLCByZWNvcmROb2RlKTtcclxuXHJcbiAgLy8gbm9uIHBhcnNpbmcgd291bGQgY2F1c2UgZnVydGhlciBpc3N1ZXMgLSBleGl0IGhlcmVcclxuICBpZiAoIWlzRW1wdHkoZmllbGRQYXJzZUZhaWxzKSkgeyByZXR1cm4gKHsgaXNWYWxpZDogZmFsc2UsIGVycm9yczogZmllbGRQYXJzZUZhaWxzIH0pOyB9XHJcblxyXG4gIGNvbnN0IHJlY29yZFZhbGlkYXRpb25SdWxlRmFpbHMgPSBydW5SZWNvcmRWYWxpZGF0aW9uUnVsZXMocmVjb3JkLCByZWNvcmROb2RlKTtcclxuICBjb25zdCB0eXBlQ29udHJhaW50RmFpbHMgPSBhd2FpdCB2YWxpZGF0ZUFsbFR5cGVDb25zdHJhaW50cyhyZWNvcmQsIHJlY29yZE5vZGUsIGNvbnRleHQpO1xyXG5cclxuICBpZiAoaXNFbXB0eShmaWVsZFBhcnNlRmFpbHMpXHJcbiAgICAgICAmJiBpc0VtcHR5KHJlY29yZFZhbGlkYXRpb25SdWxlRmFpbHMpXHJcbiAgICAgICAmJiBpc0VtcHR5KHR5cGVDb250cmFpbnRGYWlscykpIHtcclxuICAgIHJldHVybiAoeyBpc1ZhbGlkOiB0cnVlLCBlcnJvcnM6IFtdIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuICh7XHJcbiAgICBpc1ZhbGlkOiBmYWxzZSxcclxuICAgIGVycm9yczogXy51bmlvbihmaWVsZFBhcnNlRmFpbHMsIHR5cGVDb250cmFpbnRGYWlscywgcmVjb3JkVmFsaWRhdGlvblJ1bGVGYWlscyksXHJcbiAgfSk7XHJcbn07XHJcbiIsImltcG9ydCB7IGZpbHRlciB9IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7XHJcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxyXG4gIGlzQ29sbGVjdGlvblJlY29yZCxcclxuICBpc1Jvb3QsXHJcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcclxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyAkLCBhbGxUcnVlLCBqb2luS2V5IH0gZnJvbSAnLi4vY29tbW9uJztcclxuXHJcbmNvbnN0IGVuc3VyZUNvbGxlY3Rpb25Jc0luaXRpYWxpc2VkID0gYXN5bmMgKGRhdGFzdG9yZSwgbm9kZSwgcGFyZW50S2V5KSA9PiB7XHJcbiAgaWYgKCFhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKHBhcmVudEtleSkpIHtcclxuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIocGFyZW50S2V5KTtcclxuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoXHJcbiAgICAgIGpvaW5LZXkocGFyZW50S2V5LCAnYWxsaWRzJyksXHJcbiAgICApO1xyXG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihcclxuICAgICAgam9pbktleShcclxuICAgICAgICBwYXJlbnRLZXksXHJcbiAgICAgICAgJ2FsbGlkcycsXHJcbiAgICAgICAgbm9kZS5ub2RlSWQudG9TdHJpbmcoKSxcclxuICAgICAgKSxcclxuICAgICk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRpYWxpc2VSb290Q29sbGVjdGlvbnMgPSBhc3luYyAoZGF0YXN0b3JlLCBoaWVyYXJjaHkpID0+IHtcclxuICBjb25zdCByb290Q29sbGVjdGlvblJlY29yZCA9IGFsbFRydWUoXHJcbiAgICBuID0+IGlzUm9vdChuLnBhcmVudCgpKSxcclxuICAgIGlzQ29sbGVjdGlvblJlY29yZCxcclxuICApO1xyXG5cclxuICBjb25zdCBmbGF0aGllcmFyY2h5ID0gZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGhpZXJhcmNoeSk7XHJcblxyXG4gIGNvbnN0IGNvbGxlY3Rpb25SZWNvcmRzID0gJChmbGF0aGllcmFyY2h5LCBbXHJcbiAgICBmaWx0ZXIocm9vdENvbGxlY3Rpb25SZWNvcmQpLFxyXG4gIF0pO1xyXG5cclxuICBmb3IgKGNvbnN0IGNvbCBvZiBjb2xsZWN0aW9uUmVjb3Jkcykge1xyXG4gICAgYXdhaXQgZW5zdXJlQ29sbGVjdGlvbklzSW5pdGlhbGlzZWQoXHJcbiAgICAgIGRhdGFzdG9yZSxcclxuICAgICAgY29sLFxyXG4gICAgICBjb2wuY29sbGVjdGlvblBhdGhSZWd4KCksXHJcbiAgICApO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlQ2hpbGRDb2xsZWN0aW9ucyA9IGFzeW5jIChhcHAsIHJlY29yZEtleSkgPT4ge1xyXG4gIGNvbnN0IGNoaWxkQ29sbGVjdGlvblJlY29yZHMgPSAkKHJlY29yZEtleSwgW1xyXG4gICAgZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KSxcclxuICAgIG4gPT4gbi5jaGlsZHJlbixcclxuICAgIGZpbHRlcihpc0NvbGxlY3Rpb25SZWNvcmQpLFxyXG4gIF0pO1xyXG5cclxuICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkQ29sbGVjdGlvblJlY29yZHMpIHtcclxuICAgIGF3YWl0IGVuc3VyZUNvbGxlY3Rpb25Jc0luaXRpYWxpc2VkKFxyXG4gICAgICBhcHAuZGF0YXN0b3JlLFxyXG4gICAgICBjaGlsZCxcclxuICAgICAgam9pbktleShyZWNvcmRLZXksIGNoaWxkLmNvbGxlY3Rpb25OYW1lKSxcclxuICAgICk7XHJcbiAgfVxyXG59O1xyXG4iLCJpbXBvcnQge1xyXG4gIGpvaW4sIHB1bGwsXHJcbiAgbWFwLCBmbGF0dGVuLCBvcmRlckJ5LFxyXG4gIGZpbHRlciwgZmluZCxcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQge1xyXG4gIGdldFBhcmVudEtleSxcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbiAgZ2V0Q29sbGVjdGlvbk5vZGVCeUtleU9yTm9kZUtleSwgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoLFxyXG4gIGlzQ29sbGVjdGlvblJlY29yZCwgaXNBbmNlc3RvcixcclxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBqb2luS2V5LCBzYWZlS2V5LCAkIH0gZnJvbSAnLi4vY29tbW9uJztcclxuXHJcbmNvbnN0IGFsbElkQ2hhcnMgPSAnMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpfLSc7XHJcblxyXG5jb25zdCBhbGxJZHNTdHJpbmdzRm9yRmFjdG9yID0gKGNvbGxlY3Rpb25Ob2RlKSA9PiB7XHJcbiAgY29uc3QgZmFjdG9yID0gY29sbGVjdGlvbk5vZGUuYWxsaWRzU2hhcmRGYWN0b3I7XHJcbiAgY29uc3QgY2hhclJhbmdlUGVyU2hhcmQgPSA2NCAvIGZhY3RvcjtcclxuICBjb25zdCBhbGxJZFN0cmluZ3MgPSBbXTtcclxuICBsZXQgaW5kZXggPSAwO1xyXG4gIGxldCBjdXJyZW50SWRzU2hhcmQgPSAnJztcclxuICB3aGlsZSAoaW5kZXggPCA2NCkge1xyXG4gICAgY3VycmVudElkc1NoYXJkICs9IGFsbElkQ2hhcnNbaW5kZXhdO1xyXG4gICAgaWYgKChpbmRleCArIDEpICUgY2hhclJhbmdlUGVyU2hhcmQgPT09IDApIHtcclxuICAgICAgYWxsSWRTdHJpbmdzLnB1c2goY3VycmVudElkc1NoYXJkKTtcclxuICAgICAgY3VycmVudElkc1NoYXJkID0gJyc7XHJcbiAgICB9XHJcbiAgICBpbmRleCsrO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGFsbElkU3RyaW5ncztcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRBbGxJZHNTaGFyZE5hbWVzID0gKGFwcEhpZXJhcmNoeSwgY29sbGVjdGlvbktleSkgPT4ge1xyXG4gIGNvbnN0IGNvbGxlY3Rpb25SZWNvcmROb2RlID0gZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoKGFwcEhpZXJhcmNoeSkoY29sbGVjdGlvbktleSk7XHJcbiAgcmV0dXJuICQoY29sbGVjdGlvblJlY29yZE5vZGUsIFtcclxuICAgIGMgPT4gW2Mubm9kZUlkXSxcclxuICAgIG1hcChpID0+IG1hcChjID0+IF9hbGxJZHNTaGFyZEtleShjb2xsZWN0aW9uS2V5LCBpLCBjKSkoYWxsSWRzU3RyaW5nc0ZvckZhY3Rvcihjb2xsZWN0aW9uUmVjb3JkTm9kZSkpKSxcclxuICAgIGZsYXR0ZW4sXHJcbiAgXSk7XHJcbn07XHJcblxyXG5jb25zdCBfYWxsSWRzU2hhcmRLZXkgPSAoY29sbGVjdGlvbktleSwgY2hpbGRObywgc2hhcmRLZXkpID0+IGpvaW5LZXkoXHJcbiAgY29sbGVjdGlvbktleSxcclxuICAnYWxsaWRzJyxcclxuICBjaGlsZE5vLFxyXG4gIHNoYXJkS2V5LFxyXG4pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEFsbElkc1NoYXJkS2V5ID0gKGFwcEhpZXJhcmNoeSwgY29sbGVjdGlvbktleSwgcmVjb3JkSWQpID0+IHtcclxuICBjb25zdCBpbmRleE9mRmlyc3REYXNoID0gcmVjb3JkSWQuaW5kZXhPZignLScpO1xyXG5cclxuICBjb25zdCBjb2xsZWN0aW9uTm9kZSA9IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHBIaWVyYXJjaHkpKGNvbGxlY3Rpb25LZXkpO1xyXG5cclxuICBjb25zdCBpZEZpcnN0Q2hhciA9IHJlY29yZElkW2luZGV4T2ZGaXJzdERhc2ggKyAxXTtcclxuICBjb25zdCBhbGxJZHNTaGFyZElkID0gJChjb2xsZWN0aW9uTm9kZSwgW1xyXG4gICAgYWxsSWRzU3RyaW5nc0ZvckZhY3RvcixcclxuICAgIGZpbmQoaSA9PiBpLmluY2x1ZGVzKGlkRmlyc3RDaGFyKSksXHJcbiAgXSk7XHJcblxyXG4gIHJldHVybiBfYWxsSWRzU2hhcmRLZXkoXHJcbiAgICBjb2xsZWN0aW9uS2V5LFxyXG4gICAgcmVjb3JkSWQuc2xpY2UoMCwgaW5kZXhPZkZpcnN0RGFzaCksXHJcbiAgICBhbGxJZHNTaGFyZElkLFxyXG4gICk7XHJcbn07XHJcblxyXG5jb25zdCBnZXRPckNyZWF0ZVNoYXJkRmlsZSA9IGFzeW5jIChkYXRhc3RvcmUsIGFsbElkc0tleSkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgZGF0YXN0b3JlLmxvYWRGaWxlKGFsbElkc0tleSk7XHJcbiAgfSBjYXRjaCAoZUxvYWQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGaWxlKGFsbElkc0tleSwgJycpO1xyXG4gICAgICByZXR1cm4gJyc7XHJcbiAgICB9IGNhdGNoIChlQ3JlYXRlKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICBgRXJyb3IgbG9hZGluZywgdGhlbiBjcmVhdGluZyBhbGxJZHMgJHthbGxJZHNLZXlcclxuICAgICAgICB9IDogTE9BRCA6ICR7ZUxvYWQubWVzc2FnZVxyXG4gICAgICAgIH0gOiBDUkVBVEUgOiAke2VDcmVhdGV9YCxcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBnZXRTaGFyZEZpbGUgPSBhc3luYyAoZGF0YXN0b3JlLCBhbGxJZHNLZXkpID0+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IGRhdGFzdG9yZS5sb2FkRmlsZShhbGxJZHNLZXkpO1xyXG4gIH0gY2F0Y2ggKGVMb2FkKSB7XHJcbiAgICByZXR1cm4gJyc7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGFkZFRvQWxsSWRzID0gKGFwcEhpZXJhcmNoeSwgZGF0YXN0b3JlKSA9PiBhc3luYyAocmVjb3JkKSA9PiB7XHJcbiAgY29uc3QgYWxsSWRzS2V5ID0gZ2V0QWxsSWRzU2hhcmRLZXkoXHJcbiAgICBhcHBIaWVyYXJjaHksXHJcbiAgICBnZXRQYXJlbnRLZXkocmVjb3JkLmtleSksXHJcbiAgICByZWNvcmQuaWQsXHJcbiAgKTtcclxuXHJcbiAgbGV0IGFsbElkcyA9IGF3YWl0IGdldE9yQ3JlYXRlU2hhcmRGaWxlKGRhdGFzdG9yZSwgYWxsSWRzS2V5KTtcclxuXHJcbiAgYWxsSWRzICs9IGAke2FsbElkcy5sZW5ndGggPiAwID8gJywnIDogJyd9JHtyZWNvcmQuaWR9YDtcclxuXHJcbiAgYXdhaXQgZGF0YXN0b3JlLnVwZGF0ZUZpbGUoYWxsSWRzS2V5LCBhbGxJZHMpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEFsbElkc0l0ZXJhdG9yID0gYXBwID0+IGFzeW5jIChjb2xsZWN0aW9uX0tleV9vcl9Ob2RlS2V5KSA9PiB7XHJcbiAgY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSA9IHNhZmVLZXkoY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSk7XHJcbiAgY29uc3QgdGFyZ2V0Tm9kZSA9IGdldENvbGxlY3Rpb25Ob2RlQnlLZXlPck5vZGVLZXkoXHJcbiAgICBhcHAuaGllcmFyY2h5LFxyXG4gICAgY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSxcclxuICApO1xyXG5cclxuICBjb25zdCBnZXRBbGxJZHNJdGVyYXRvckZvckNvbGxlY3Rpb25LZXkgPSBhc3luYyAoY29sbGVjdGlvbktleSkgPT4ge1xyXG4gICAgY29uc3QgYWxsX2FsbElkc0tleXMgPSBnZXRBbGxJZHNTaGFyZE5hbWVzKGFwcC5oaWVyYXJjaHksIGNvbGxlY3Rpb25LZXkpO1xyXG4gICAgbGV0IHNoYXJkSW5kZXggPSAwO1xyXG5cclxuICAgIGNvbnN0IGFsbElkc0Zyb21TaGFyZEl0ZXJhdG9yID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICBpZiAoc2hhcmRJbmRleCA9PT0gYWxsX2FsbElkc0tleXMubGVuZ3RoKSB7IHJldHVybiAoeyBkb25lOiB0cnVlLCByZXN1bHQ6IHsgaWRzOiBbXSwgY29sbGVjdGlvbktleSB9IH0pOyB9XHJcblxyXG4gICAgICBjb25zdCBzaGFyZEtleSA9IGFsbF9hbGxJZHNLZXlzW3NoYXJkSW5kZXhdO1xyXG5cclxuICAgICAgY29uc3QgYWxsSWRzID0gYXdhaXQgZ2V0QWxsSWRzRnJvbVNoYXJkKGFwcC5kYXRhc3RvcmUsIHNoYXJkS2V5KTtcclxuXHJcbiAgICAgIHNoYXJkSW5kZXgrKztcclxuXHJcbiAgICAgIHJldHVybiAoe1xyXG4gICAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgICAgaWRzOiBhbGxJZHMsXHJcbiAgICAgICAgICBjb2xsZWN0aW9uS2V5LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZG9uZTogZmFsc2UsXHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gYWxsSWRzRnJvbVNoYXJkSXRlcmF0b3I7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgYW5jZXN0b3JzID0gJChnZXRGbGF0dGVuZWRIaWVyYXJjaHkoYXBwLmhpZXJhcmNoeSksIFtcclxuICAgIGZpbHRlcihpc0NvbGxlY3Rpb25SZWNvcmQpLFxyXG4gICAgZmlsdGVyKG4gPT4gaXNBbmNlc3Rvcih0YXJnZXROb2RlKShuKVxyXG4gICAgICAgICAgICAgICAgICAgIHx8IG4ubm9kZUtleSgpID09PSB0YXJnZXROb2RlLm5vZGVLZXkoKSksXHJcbiAgICBvcmRlckJ5KFtuID0+IG4ubm9kZUtleSgpLmxlbmd0aF0sIFsnYXNjJ10pLFxyXG4gIF0pOyAvLyBwYXJlbnRzIGZpcnN0XHJcblxyXG4gIGNvbnN0IHRyYXZlcnNlRm9ySXRlcmF0ZXJhdG9ycyA9IGFzeW5jIChwYXJlbnRSZWNvcmRLZXkgPSAnJywgY3VycmVudE5vZGVJbmRleCA9IDApID0+IHtcclxuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gYW5jZXN0b3JzW2N1cnJlbnROb2RlSW5kZXhdO1xyXG4gICAgY29uc3QgY3VycmVudENvbGxlY3Rpb25LZXkgPSBqb2luS2V5KFxyXG4gICAgICBwYXJlbnRSZWNvcmRLZXksXHJcbiAgICAgIGN1cnJlbnROb2RlLmNvbGxlY3Rpb25OYW1lLFxyXG4gICAgKTtcclxuICAgIGlmIChjdXJyZW50Tm9kZS5ub2RlS2V5KCkgPT09IHRhcmdldE5vZGUubm9kZUtleSgpKSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgYXdhaXQgZ2V0QWxsSWRzSXRlcmF0b3JGb3JDb2xsZWN0aW9uS2V5KFxyXG4gICAgICAgICAgY3VycmVudENvbGxlY3Rpb25LZXksXHJcbiAgICAgICAgKV07XHJcbiAgICB9XHJcbiAgICBjb25zdCBhbGxJdGVyYXRvcnMgPSBbXTtcclxuICAgIGNvbnN0IGN1cnJlbnRJdGVyYXRvciA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yRm9yQ29sbGVjdGlvbktleShcclxuICAgICAgY3VycmVudENvbGxlY3Rpb25LZXksXHJcbiAgICApO1xyXG5cclxuICAgIGxldCBpZHMgPSBhd2FpdCBjdXJyZW50SXRlcmF0b3IoKTtcclxuICAgIHdoaWxlIChpZHMuZG9uZSA9PT0gZmFsc2UpIHtcclxuICAgICAgZm9yIChjb25zdCBpZCBvZiBpZHMucmVzdWx0Lmlkcykge1xyXG4gICAgICAgIGFsbEl0ZXJhdG9ycy5wdXNoKFxyXG4gICAgICAgICAgYXdhaXQgdHJhdmVyc2VGb3JJdGVyYXRlcmF0b3JzKFxyXG4gICAgICAgICAgICBqb2luS2V5KGN1cnJlbnRDb2xsZWN0aW9uS2V5LCBpZCksXHJcbiAgICAgICAgICAgIGN1cnJlbnROb2RlSW5kZXggKyAxLFxyXG4gICAgICAgICAgKSxcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZHMgPSBhd2FpdCBjdXJyZW50SXRlcmF0b3IoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmxhdHRlbihhbGxJdGVyYXRvcnMpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGl0ZXJhdG9yc0FycmF5ID0gYXdhaXQgdHJhdmVyc2VGb3JJdGVyYXRlcmF0b3JzKCk7XHJcbiAgbGV0IGN1cnJlbnRJdGVyYXRvckluZGV4ID0gMDtcclxuICByZXR1cm4gYXN5bmMgKCkgPT4ge1xyXG4gICAgaWYgKGl0ZXJhdG9yc0FycmF5Lmxlbmd0aCA9PT0gMCkgeyByZXR1cm4geyBkb25lOiB0cnVlLCByZXN1bHQ6IFtdIH07IH1cclxuICAgIGNvbnN0IGlubmVyUmVzdWx0ID0gYXdhaXQgaXRlcmF0b3JzQXJyYXlbY3VycmVudEl0ZXJhdG9ySW5kZXhdKCk7XHJcbiAgICBpZiAoIWlubmVyUmVzdWx0LmRvbmUpIHsgcmV0dXJuIGlubmVyUmVzdWx0OyB9XHJcbiAgICBpZiAoY3VycmVudEl0ZXJhdG9ySW5kZXggPT0gaXRlcmF0b3JzQXJyYXkubGVuZ3RoIC0gMSkge1xyXG4gICAgICByZXR1cm4geyBkb25lOiB0cnVlLCByZXN1bHQ6IGlubmVyUmVzdWx0LnJlc3VsdCB9O1xyXG4gICAgfVxyXG4gICAgY3VycmVudEl0ZXJhdG9ySW5kZXgrKztcclxuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCByZXN1bHQ6IGlubmVyUmVzdWx0LnJlc3VsdCB9O1xyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBnZXRBbGxJZHNGcm9tU2hhcmQgPSBhc3luYyAoZGF0YXN0b3JlLCBzaGFyZEtleSkgPT4ge1xyXG4gIGNvbnN0IGFsbElkc1N0ciA9IGF3YWl0IGdldFNoYXJkRmlsZShkYXRhc3RvcmUsIHNoYXJkS2V5KTtcclxuXHJcbiAgY29uc3QgYWxsSWRzID0gW107XHJcbiAgbGV0IGN1cnJlbnRJZCA9ICcnO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsSWRzU3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBjdXJyZW50Q2hhciA9IGFsbElkc1N0ci5jaGFyQXQoaSk7XHJcbiAgICBjb25zdCBpc0xhc3QgPSAoaSA9PT0gYWxsSWRzU3RyLmxlbmd0aCAtIDEpO1xyXG4gICAgaWYgKGN1cnJlbnRDaGFyID09PSAnLCcgfHwgaXNMYXN0KSB7XHJcbiAgICAgIGlmIChpc0xhc3QpIGN1cnJlbnRJZCArPSBjdXJyZW50Q2hhcjtcclxuICAgICAgYWxsSWRzLnB1c2goY3VycmVudElkKTtcclxuICAgICAgY3VycmVudElkID0gJyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjdXJyZW50SWQgKz0gY3VycmVudENoYXI7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBhbGxJZHM7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgcmVtb3ZlRnJvbUFsbElkcyA9IChhcHBIaWVyYXJjaHksIGRhdGFzdG9yZSkgPT4gYXN5bmMgKHJlY29yZCkgPT4ge1xyXG4gIGNvbnN0IHNoYXJkS2V5ID0gZ2V0QWxsSWRzU2hhcmRLZXkoXHJcbiAgICBhcHBIaWVyYXJjaHksXHJcbiAgICBnZXRQYXJlbnRLZXkocmVjb3JkLmtleSksXHJcbiAgICByZWNvcmQuaWQsXHJcbiAgKTtcclxuICBjb25zdCBhbGxJZHMgPSBhd2FpdCBnZXRBbGxJZHNGcm9tU2hhcmQoZGF0YXN0b3JlLCBzaGFyZEtleSk7XHJcblxyXG4gIGNvbnN0IG5ld0lkcyA9ICQoYWxsSWRzLCBbXHJcbiAgICBwdWxsKHJlY29yZC5pZCksXHJcbiAgICBqb2luKCcsJyksXHJcbiAgXSk7XHJcblxyXG4gIGF3YWl0IGRhdGFzdG9yZS51cGRhdGVGaWxlKHNoYXJkS2V5LCBuZXdJZHMpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2V0QWxsSWRzSXRlcmF0b3I7XHJcbiIsImltcG9ydCB7XHJcbiAgam9pbktleSwga2V5U2VwLCBnZXRIYXNoQ29kZSxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBnZXRMYXN0UGFydEluS2V5IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuXHJcbmV4cG9ydCBjb25zdCBUUkFOU0FDVElPTlNfRk9MREVSID0gYCR7a2V5U2VwfS50cmFuc2FjdGlvbnNgO1xyXG5leHBvcnQgY29uc3QgTE9DS19GSUxFTkFNRSA9ICdsb2NrJztcclxuZXhwb3J0IGNvbnN0IExPQ0tfRklMRV9LRVkgPSBqb2luS2V5KFxyXG4gIFRSQU5TQUNUSU9OU19GT0xERVIsIExPQ0tfRklMRU5BTUUsXHJcbik7XHJcbmV4cG9ydCBjb25zdCBpZFNlcCA9ICckJztcclxuXHJcbmNvbnN0IGlzT2ZUeXBlID0gdHlwID0+IHRyYW5zID0+IHRyYW5zLnRyYW5zYWN0aW9uVHlwZSA9PT0gdHlwO1xyXG5cclxuZXhwb3J0IGNvbnN0IENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04gPSAnY3JlYXRlJztcclxuZXhwb3J0IGNvbnN0IFVQREFURV9SRUNPUkRfVFJBTlNBQ1RJT04gPSAndXBkYXRlJztcclxuZXhwb3J0IGNvbnN0IERFTEVURV9SRUNPUkRfVFJBTlNBQ1RJT04gPSAnZGVsZXRlJztcclxuZXhwb3J0IGNvbnN0IEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OID0gJ2J1aWxkJztcclxuXHJcbmV4cG9ydCBjb25zdCBpc1VwZGF0ZSA9IGlzT2ZUeXBlKFVQREFURV9SRUNPUkRfVFJBTlNBQ1RJT04pO1xyXG5leHBvcnQgY29uc3QgaXNEZWxldGUgPSBpc09mVHlwZShERUxFVEVfUkVDT1JEX1RSQU5TQUNUSU9OKTtcclxuZXhwb3J0IGNvbnN0IGlzQ3JlYXRlID0gaXNPZlR5cGUoQ1JFQVRFX1JFQ09SRF9UUkFOU0FDVElPTik7XHJcbmV4cG9ydCBjb25zdCBpc0J1aWxkSW5kZXggPSBpc09mVHlwZShCVUlMRF9JTkRFWF9UUkFOU0FDVElPTik7XHJcblxyXG5leHBvcnQgY29uc3Qga2V5VG9Gb2xkZXJOYW1lID0gbm9kZUtleSA9PiBnZXRIYXNoQ29kZShub2RlS2V5KTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRUcmFuc2FjdGlvbklkID0gKHJlY29yZElkLCB0cmFuc2FjdGlvblR5cGUsIHVuaXF1ZUlkKSA9PiBcclxuICBgJHtyZWNvcmRJZH0ke2lkU2VwfSR7dHJhbnNhY3Rpb25UeXBlfSR7aWRTZXB9JHt1bmlxdWVJZH1gO1xyXG5cclxuZXhwb3J0IGNvbnN0IGJ1aWxkSW5kZXhGb2xkZXIgPSAnLkJVSUxELSc7XHJcbmV4cG9ydCBjb25zdCBub2RlS2V5SGFzaEZyb21CdWlsZEZvbGRlciA9IGZvbGRlciA9PiBmb2xkZXIucmVwbGFjZShidWlsZEluZGV4Rm9sZGVyLCAnJyk7XHJcblxyXG5leHBvcnQgY29uc3QgaXNCdWlsZEluZGV4Rm9sZGVyID0ga2V5ID0+IGdldExhc3RQYXJ0SW5LZXkoa2V5KS5zdGFydHNXaXRoKGJ1aWxkSW5kZXhGb2xkZXIpO1xyXG5cclxuZXhwb3J0IGNvbnN0IEluZGV4Tm9kZUtleUZvbGRlciA9IGluZGV4Tm9kZUtleSA9PiBqb2luS2V5KFxyXG4gIFRSQU5TQUNUSU9OU19GT0xERVIsXHJcbiAgYnVpbGRJbmRleEZvbGRlciArIGtleVRvRm9sZGVyTmFtZShpbmRleE5vZGVLZXkpLFxyXG4pO1xyXG5cclxuZXhwb3J0IGNvbnN0IEluZGV4Tm9kZUtleUJhdGNoRm9sZGVyID0gKGluZGV4Tm9kZUtleSwgY291bnQpID0+IFxyXG4gIGpvaW5LZXkoSW5kZXhOb2RlS2V5Rm9sZGVyKGluZGV4Tm9kZUtleSksIE1hdGguZmxvb3IoY291bnQgLyBCVUlMRElOREVYX0JBVENIX0NPVU5UKS50b1N0cmluZygpKTtcclxuXHJcbmV4cG9ydCBjb25zdCBJbmRleFNoYXJkS2V5Rm9sZGVyID0gKGluZGV4Tm9kZUtleSwgaW5kZXhTaGFyZEtleSkgPT4gXHJcbiAgam9pbktleShJbmRleE5vZGVLZXlGb2xkZXIoaW5kZXhOb2RlS2V5KSwgaW5kZXhTaGFyZEtleSk7XHJcblxyXG5leHBvcnQgY29uc3QgQlVJTERJTkRFWF9CQVRDSF9DT1VOVCA9IDEwMDA7XHJcbmV4cG9ydCBjb25zdCB0aW1lb3V0TWlsbGlzZWNvbmRzID0gMzAgKiAxMDAwOyAvLyAzMCBzZWNzXHJcbmV4cG9ydCBjb25zdCBtYXhMb2NrUmV0cmllcyA9IDE7XHJcbiIsImltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnc2hvcnRpZCc7XHJcbmltcG9ydCB7IGpvaW5LZXkgfSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBnZXRMYXN0UGFydEluS2V5IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHtcclxuICBJbmRleE5vZGVLZXlGb2xkZXIsIEJVSUxESU5ERVhfQkFUQ0hfQ09VTlQsXHJcbiAgSW5kZXhOb2RlS2V5QmF0Y2hGb2xkZXIsIFRSQU5TQUNUSU9OU19GT0xERVIsIGdldFRyYW5zYWN0aW9uSWQsIENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04sIFVQREFURV9SRUNPUkRfVFJBTlNBQ1RJT04sXHJcbiAgREVMRVRFX1JFQ09SRF9UUkFOU0FDVElPTiwgQlVJTERfSU5ERVhfVFJBTlNBQ1RJT04sXHJcbn0gZnJvbSAnLi90cmFuc2FjdGlvbnNDb21tb24nO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCB0cmFuc2FjdGlvbkZvckNyZWF0ZVJlY29yZCA9IGFzeW5jIChhcHAsIHJlY29yZCkgPT4gYXdhaXQgdHJhbnNhY3Rpb24oXHJcbiAgYXBwLmRhdGFzdG9yZSwgQ1JFQVRFX1JFQ09SRF9UUkFOU0FDVElPTixcclxuICByZWNvcmQua2V5LCB7IHJlY29yZCB9LFxyXG4gIGdldFRyYW5zYWN0aW9uS2V5X1JlY29yZHMsXHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgdHJhbnNhY3Rpb25Gb3JVcGRhdGVSZWNvcmQgPSBhc3luYyAoYXBwLCBvbGRSZWNvcmQsIG5ld1JlY29yZCkgPT4gYXdhaXQgdHJhbnNhY3Rpb24oXHJcbiAgYXBwLmRhdGFzdG9yZSwgVVBEQVRFX1JFQ09SRF9UUkFOU0FDVElPTixcclxuICBuZXdSZWNvcmQua2V5LCB7IG9sZFJlY29yZCwgcmVjb3JkOiBuZXdSZWNvcmQgfSxcclxuICBnZXRUcmFuc2FjdGlvbktleV9SZWNvcmRzLFxyXG4pO1xyXG5cclxuZXhwb3J0IGNvbnN0IHRyYW5zYWN0aW9uRm9yRGVsZXRlUmVjb3JkID0gYXN5bmMgKGFwcCwgcmVjb3JkKSA9PiBhd2FpdCB0cmFuc2FjdGlvbihcclxuICBhcHAuZGF0YXN0b3JlLCBERUxFVEVfUkVDT1JEX1RSQU5TQUNUSU9OLFxyXG4gIHJlY29yZC5rZXksIHsgcmVjb3JkIH0sXHJcbiAgZ2V0VHJhbnNhY3Rpb25LZXlfUmVjb3JkcyxcclxuKTtcclxuXHJcbmV4cG9ydCBjb25zdCB0cmFuc2FjdGlvbkZvckJ1aWxkSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleE5vZGVLZXksIHJlY29yZEtleSwgY291bnQpID0+IHtcclxuICBjb25zdCB0cmFuc2FjdGlvbkZvbGRlciA9IEluZGV4Tm9kZUtleUJhdGNoRm9sZGVyKGluZGV4Tm9kZUtleSwgY291bnQpO1xyXG4gIGlmIChjb3VudCAlIEJVSUxESU5ERVhfQkFUQ0hfQ09VTlQgPT09IDApIHtcclxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlRm9sZGVyKHRyYW5zYWN0aW9uRm9sZGVyKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBhd2FpdCB0cmFuc2FjdGlvbihcclxuICAgIGFwcC5kYXRhc3RvcmUsIEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OLFxyXG4gICAgcmVjb3JkS2V5LCB7IHJlY29yZEtleSB9LFxyXG4gICAgaWQgPT4gam9pbktleSh0cmFuc2FjdGlvbkZvbGRlciwgaWQpLFxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgY3JlYXRlQnVpbGRJbmRleEZvbGRlciA9IGFzeW5jIChkYXRhc3RvcmUsIGluZGV4Tm9kZUtleSkgPT4gYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihcclxuICBJbmRleE5vZGVLZXlGb2xkZXIoaW5kZXhOb2RlS2V5KSxcclxuKTtcclxuXHJcbmNvbnN0IGdldFRyYW5zYWN0aW9uS2V5X1JlY29yZHMgPSBpZCA9PiBqb2luS2V5KFRSQU5TQUNUSU9OU19GT0xERVIsIGlkKTtcclxuXHJcbmNvbnN0IHRyYW5zYWN0aW9uID0gYXN5bmMgKGRhdGFzdG9yZSwgdHJhbnNhY3Rpb25UeXBlLCByZWNvcmRLZXksIGRhdGEsIGdldFRyYW5zYWN0aW9uS2V5KSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkSWQgPSBnZXRMYXN0UGFydEluS2V5KHJlY29yZEtleSk7XHJcbiAgY29uc3QgdW5pcXVlSWQgPSBnZW5lcmF0ZSgpO1xyXG4gIGNvbnN0IGlkID0gZ2V0VHJhbnNhY3Rpb25JZChcclxuICAgIHJlY29yZElkLCB0cmFuc2FjdGlvblR5cGUsIHVuaXF1ZUlkLFxyXG4gICk7XHJcblxyXG4gIGNvbnN0IGtleSA9IGdldFRyYW5zYWN0aW9uS2V5KGlkKTtcclxuXHJcbiAgY29uc3QgdHJhbnMgPSB7XHJcbiAgICB0cmFuc2FjdGlvblR5cGUsXHJcbiAgICByZWNvcmRLZXksXHJcbiAgICAuLi5kYXRhLFxyXG4gICAgaWQsXHJcbiAgfTtcclxuXHJcbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oXHJcbiAgICBrZXksIHRyYW5zLFxyXG4gICk7XHJcblxyXG4gIHJldHVybiB0cmFucztcclxufTtcclxuIiwiaW1wb3J0IHsgaXNTaGFyZGVkSW5kZXggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBqb2luS2V5IH0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgZ2V0U2hhcmRNYXBLZXksIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSwgY3JlYXRlSW5kZXhGaWxlIH0gZnJvbSAnLi9zaGFyZGluZyc7XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdGlhbGlzZUluZGV4ID0gYXN5bmMgKGRhdGFzdG9yZSwgcGFyZW50S2V5LCBpbmRleCkgPT4ge1xyXG4gIGNvbnN0IGluZGV4S2V5ID0gam9pbktleShwYXJlbnRLZXksIGluZGV4Lm5hbWUpO1xyXG5cclxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKGluZGV4S2V5KTtcclxuXHJcbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4KSkge1xyXG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZpbGUoXHJcbiAgICAgIGdldFNoYXJkTWFwS2V5KGluZGV4S2V5KSxcclxuICAgICAgJ1tdJyxcclxuICAgICk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGF3YWl0IGNyZWF0ZUluZGV4RmlsZShcclxuICAgICAgZGF0YXN0b3JlLFxyXG4gICAgICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXkoaW5kZXhLZXkpLFxyXG4gICAgICBpbmRleCxcclxuICAgICk7XHJcbiAgfVxyXG59O1xyXG4iLCJpbXBvcnQge1xyXG4gIGNsb25lRGVlcCxcclxuICBmbGF0dGVuLFxyXG4gIG1hcCxcclxuICBmaWx0ZXIsXHJcbiAgaXNFcXVhbFxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IGluaXRpYWxpc2VDaGlsZENvbGxlY3Rpb25zIH0gZnJvbSAnLi4vY29sbGVjdGlvbkFwaS9pbml0aWFsaXNlJztcclxuaW1wb3J0IHsgdmFsaWRhdGUgfSBmcm9tICcuL3ZhbGlkYXRlJztcclxuaW1wb3J0IHsgX2xvYWQsIGdldFJlY29yZEZpbGVOYW1lIH0gZnJvbSAnLi9sb2FkJztcclxuaW1wb3J0IHtcclxuICBhcGlXcmFwcGVyLCBldmVudHMsICQsIGpvaW5LZXksXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHtcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcclxuICBpc1JlY29yZCxcclxuICBnZXROb2RlLFxyXG4gIGdldExhc3RQYXJ0SW5LZXksXHJcbiAgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvTm9kZSxcclxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBtYXBSZWNvcmQgfSBmcm9tICcuLi9pbmRleGluZy9ldmFsdWF0ZSc7XHJcbmltcG9ydCB7IGxpc3RJdGVtcyB9IGZyb20gJy4uL2luZGV4QXBpL2xpc3RJdGVtcyc7XHJcbmltcG9ydCB7IGFkZFRvQWxsSWRzIH0gZnJvbSAnLi4vaW5kZXhpbmcvYWxsSWRzJztcclxuaW1wb3J0IHtcclxuICB0cmFuc2FjdGlvbkZvckNyZWF0ZVJlY29yZCxcclxuICB0cmFuc2FjdGlvbkZvclVwZGF0ZVJlY29yZCxcclxufSBmcm9tICcuLi90cmFuc2FjdGlvbnMvY3JlYXRlJztcclxuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xyXG5pbXBvcnQgeyBpbml0aWFsaXNlSW5kZXggfSBmcm9tICcuLi9pbmRleGluZy9pbml0aWFsaXNlSW5kZXgnO1xyXG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcclxuXHJcbmV4cG9ydCBjb25zdCBzYXZlID0gYXBwID0+IGFzeW5jIChyZWNvcmQsIGNvbnRleHQpID0+IGFwaVdyYXBwZXIoXHJcbiAgYXBwLFxyXG4gIGV2ZW50cy5yZWNvcmRBcGkuc2F2ZSxcclxuICByZWNvcmQuaXNOZXdcclxuICAgID8gcGVybWlzc2lvbi5jcmVhdGVSZWNvcmQuaXNBdXRob3JpemVkKHJlY29yZC5rZXkpXHJcbiAgICA6IHBlcm1pc3Npb24udXBkYXRlUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmQua2V5KSwgeyByZWNvcmQgfSxcclxuICBfc2F2ZSwgYXBwLCByZWNvcmQsIGNvbnRleHQsIGZhbHNlLFxyXG4pO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBfc2F2ZSA9IGFzeW5jIChhcHAsIHJlY29yZCwgY29udGV4dCwgc2tpcFZhbGlkYXRpb24gPSBmYWxzZSkgPT4ge1xyXG4gIGNvbnN0IHJlY29yZENsb25lID0gY2xvbmVEZWVwKHJlY29yZCk7XHJcbiAgaWYgKCFza2lwVmFsaWRhdGlvbikge1xyXG4gICAgY29uc3QgdmFsaWRhdGlvblJlc3VsdCA9IGF3YWl0IHZhbGlkYXRlKGFwcCkocmVjb3JkQ2xvbmUsIGNvbnRleHQpO1xyXG4gICAgaWYgKCF2YWxpZGF0aW9uUmVzdWx0LmlzVmFsaWQpIHtcclxuICAgICAgYXdhaXQgYXBwLnB1Ymxpc2goZXZlbnRzLnJlY29yZEFwaS5zYXZlLm9uSW52YWxpZCwgeyByZWNvcmQsIHZhbGlkYXRpb25SZXN1bHQgfSk7XHJcbiAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYFNhdmUgOiBSZWNvcmQgSW52YWxpZCA6ICR7XHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkodmFsaWRhdGlvblJlc3VsdC5lcnJvcnMpfWApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKHJlY29yZENsb25lLmlzTmV3KSB7XHJcbiAgICBhd2FpdCBhZGRUb0FsbElkcyhhcHAuaGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlKShyZWNvcmRDbG9uZSk7XHJcbiAgICBjb25zdCB0cmFuc2FjdGlvbiA9IGF3YWl0IHRyYW5zYWN0aW9uRm9yQ3JlYXRlUmVjb3JkKFxyXG4gICAgICBhcHAsIHJlY29yZENsb25lLFxyXG4gICAgKTtcclxuICAgIHJlY29yZENsb25lLnRyYW5zYWN0aW9uSWQgPSB0cmFuc2FjdGlvbi5pZDtcclxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlRm9sZGVyKHJlY29yZENsb25lLmtleSk7XHJcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihcclxuICAgICAgam9pbktleShyZWNvcmRDbG9uZS5rZXksICdmaWxlcycpLFxyXG4gICAgKTtcclxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlSnNvbihcclxuICAgICAgZ2V0UmVjb3JkRmlsZU5hbWUocmVjb3JkQ2xvbmUua2V5KSxcclxuICAgICAgcmVjb3JkQ2xvbmUsXHJcbiAgICApO1xyXG4gICAgYXdhaXQgaW5pdGlhbGlzZVJldmVyc2VSZWZlcmVuY2VJbmRleGVzKGFwcCwgcmVjb3JkKTtcclxuICAgIGF3YWl0IGluaXRpYWxpc2VBbmNlc3RvckluZGV4ZXMoYXBwLCByZWNvcmQpO1xyXG4gICAgYXdhaXQgaW5pdGlhbGlzZUNoaWxkQ29sbGVjdGlvbnMoYXBwLCByZWNvcmRDbG9uZS5rZXkpO1xyXG4gICAgYXdhaXQgYXBwLnB1Ymxpc2goZXZlbnRzLnJlY29yZEFwaS5zYXZlLm9uUmVjb3JkQ3JlYXRlZCwge1xyXG4gICAgICByZWNvcmQ6IHJlY29yZENsb25lLFxyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnN0IG9sZFJlY29yZCA9IGF3YWl0IF9sb2FkKGFwcCwgcmVjb3JkQ2xvbmUua2V5KTtcclxuICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gYXdhaXQgdHJhbnNhY3Rpb25Gb3JVcGRhdGVSZWNvcmQoXHJcbiAgICAgIGFwcCwgb2xkUmVjb3JkLCByZWNvcmRDbG9uZSxcclxuICAgICk7XHJcbiAgICByZWNvcmRDbG9uZS50cmFuc2FjdGlvbklkID0gdHJhbnNhY3Rpb24uaWQ7XHJcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXHJcbiAgICAgIGdldFJlY29yZEZpbGVOYW1lKHJlY29yZENsb25lLmtleSksXHJcbiAgICAgIHJlY29yZENsb25lLFxyXG4gICAgKTtcclxuICAgIGF3YWl0IGFwcC5wdWJsaXNoKGV2ZW50cy5yZWNvcmRBcGkuc2F2ZS5vblJlY29yZFVwZGF0ZWQsIHtcclxuICAgICAgb2xkOiBvbGRSZWNvcmQsXHJcbiAgICAgIG5ldzogcmVjb3JkQ2xvbmUsXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGF3YWl0IGFwcC5jbGVhbnVwVHJhbnNhY3Rpb25zKCk7XHJcblxyXG4gIGNvbnN0IHJldHVybmVkQ2xvbmUgPSBjbG9uZURlZXAocmVjb3JkQ2xvbmUpO1xyXG4gIHJldHVybmVkQ2xvbmUuaXNOZXcgPSBmYWxzZTtcclxuICByZXR1cm4gcmV0dXJuZWRDbG9uZTtcclxufTtcclxuXHJcbmNvbnN0IGluaXRpYWxpc2VBbmNlc3RvckluZGV4ZXMgPSBhc3luYyAoYXBwLCByZWNvcmQpID0+IHtcclxuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShyZWNvcmQua2V5KTtcclxuXHJcbiAgZm9yIChjb25zdCBpbmRleCBvZiByZWNvcmROb2RlLmluZGV4ZXMpIHtcclxuICAgIGNvbnN0IGluZGV4S2V5ID0gam9pbktleShyZWNvcmQua2V5LCBpbmRleC5uYW1lKTtcclxuICAgIGlmICghYXdhaXQgYXBwLmRhdGFzdG9yZS5leGlzdHMoaW5kZXhLZXkpKSB7IGF3YWl0IGluaXRpYWxpc2VJbmRleChhcHAuZGF0YXN0b3JlLCByZWNvcmQua2V5LCBpbmRleCk7IH1cclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBpbml0aWFsaXNlUmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMgPSBhc3luYyAoYXBwLCByZWNvcmQpID0+IHtcclxuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShyZWNvcmQua2V5KTtcclxuXHJcbiAgY29uc3QgaW5kZXhOb2RlcyA9ICQoZmllbGRzVGhhdFJlZmVyZW5jZVRoaXNSZWNvcmQoYXBwLCByZWNvcmROb2RlKSwgW1xyXG4gICAgbWFwKGYgPT4gJChmLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzLCBbXHJcbiAgICAgIG1hcChuID0+IGdldE5vZGUoXHJcbiAgICAgICAgYXBwLmhpZXJhcmNoeSxcclxuICAgICAgICBuLFxyXG4gICAgICApKSxcclxuICAgIF0pKSxcclxuICAgIGZsYXR0ZW4sXHJcbiAgXSk7XHJcblxyXG4gIGZvciAoY29uc3QgaW5kZXhOb2RlIG9mIGluZGV4Tm9kZXMpIHtcclxuICAgIGF3YWl0IGluaXRpYWxpc2VJbmRleChcclxuICAgICAgYXBwLmRhdGFzdG9yZSwgcmVjb3JkLmtleSwgaW5kZXhOb2RlLFxyXG4gICAgKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBmaWVsZHNUaGF0UmVmZXJlbmNlVGhpc1JlY29yZCA9IChhcHAsIHJlY29yZE5vZGUpID0+ICQoYXBwLmhpZXJhcmNoeSwgW1xyXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcclxuICBmaWx0ZXIoaXNSZWNvcmQpLFxyXG4gIG1hcChuID0+IG4uZmllbGRzKSxcclxuICBmbGF0dGVuLFxyXG4gIGZpbHRlcihmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlKHJlY29yZE5vZGUpKSxcclxuXSk7XHJcbiIsImltcG9ydCB7IGluY2x1ZGVzIH0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHtcclxuICBzYWZlS2V5LCBhcGlXcmFwcGVyLFxyXG4gIGV2ZW50cywgam9pbktleSxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBfZGVsZXRlUmVjb3JkIH0gZnJvbSAnLi4vcmVjb3JkQXBpL2RlbGV0ZSc7XHJcbmltcG9ydCB7IGdldEFsbElkc0l0ZXJhdG9yLCBnZXRBbGxJZHNTaGFyZEtleSB9IGZyb20gJy4uL2luZGV4aW5nL2FsbElkcyc7XHJcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcclxuXHJcbmV4cG9ydCBjb25zdCBkZWxldGVDb2xsZWN0aW9uID0gKGFwcCwgZGlzYWJsZUNsZWFudXAgPSBmYWxzZSkgPT4gYXN5bmMga2V5ID0+IGFwaVdyYXBwZXIoXHJcbiAgYXBwLFxyXG4gIGV2ZW50cy5jb2xsZWN0aW9uQXBpLmRlbGV0ZSxcclxuICBwZXJtaXNzaW9uLm1hbmFnZUNvbGxlY3Rpb24uaXNBdXRob3JpemVkLFxyXG4gIHsga2V5IH0sXHJcbiAgX2RlbGV0ZUNvbGxlY3Rpb24sIGFwcCwga2V5LCBkaXNhYmxlQ2xlYW51cCxcclxuKTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgX2RlbGV0ZUNvbGxlY3Rpb24gPSBhc3luYyAoYXBwLCBrZXksIGRpc2FibGVDbGVhbnVwKSA9PiB7XHJcbiAga2V5ID0gc2FmZUtleShrZXkpO1xyXG4gIGNvbnN0IG5vZGUgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwLmhpZXJhcmNoeSkoa2V5KTtcclxuXHJcbiAgYXdhaXQgZGVsZXRlUmVjb3JkcyhhcHAsIGtleSk7XHJcbiAgYXdhaXQgZGVsZXRlQWxsSWRzRm9sZGVycyhhcHAsIG5vZGUsIGtleSk7XHJcbiAgYXdhaXQgZGVsZXRlQ29sbGVjdGlvbkZvbGRlcihhcHAsIGtleSk7XHJcbiAgaWYgKCFkaXNhYmxlQ2xlYW51cCkgeyBhd2FpdCBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucygpOyB9XHJcbn07XHJcblxyXG5jb25zdCBkZWxldGVDb2xsZWN0aW9uRm9sZGVyID0gYXN5bmMgKGFwcCwga2V5KSA9PiBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihrZXkpO1xyXG5cclxuXHJcbmNvbnN0IGRlbGV0ZUFsbElkc0ZvbGRlcnMgPSBhc3luYyAoYXBwLCBub2RlLCBrZXkpID0+IHtcclxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihcclxuICAgIGpvaW5LZXkoXHJcbiAgICAgIGtleSwgJ2FsbGlkcycsXHJcbiAgICAgIG5vZGUubm9kZUlkLFxyXG4gICAgKSxcclxuICApO1xyXG5cclxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihcclxuICAgIGpvaW5LZXkoa2V5LCAnYWxsaWRzJyksXHJcbiAgKTtcclxufTtcclxuXHJcbmNvbnN0IGRlbGV0ZVJlY29yZHMgPSBhc3luYyAoYXBwLCBrZXkpID0+IHtcclxuICBjb25zdCBkZWxldGVkQWxsSWRzU2hhcmRzID0gW107XHJcbiAgY29uc3QgZGVsZXRlQWxsSWRzU2hhcmQgPSBhc3luYyAocmVjb3JkSWQpID0+IHtcclxuICAgIGNvbnN0IHNoYXJkS2V5ID0gZ2V0QWxsSWRzU2hhcmRLZXkoXHJcbiAgICAgIGFwcC5oaWVyYXJjaHksIGtleSwgcmVjb3JkSWQsXHJcbiAgICApO1xyXG5cclxuICAgIGlmIChpbmNsdWRlcyhzaGFyZEtleSkoZGVsZXRlZEFsbElkc1NoYXJkcykpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZWRBbGxJZHNTaGFyZHMucHVzaChzaGFyZEtleSk7XHJcblxyXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKHNoYXJkS2V5KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBpdGVyYXRlID0gYXdhaXQgZ2V0QWxsSWRzSXRlcmF0b3IoYXBwKShrZXkpO1xyXG5cclxuICBsZXQgaWRzID0gYXdhaXQgaXRlcmF0ZSgpO1xyXG4gIHdoaWxlICghaWRzLmRvbmUpIHtcclxuICAgIGlmIChpZHMucmVzdWx0LmNvbGxlY3Rpb25LZXkgPT09IGtleSkge1xyXG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIGlkcy5yZXN1bHQuaWRzKSB7XHJcbiAgICAgICAgYXdhaXQgX2RlbGV0ZVJlY29yZChcclxuICAgICAgICAgIGFwcCxcclxuICAgICAgICAgIGpvaW5LZXkoa2V5LCBpZCksXHJcbiAgICAgICAgICB0cnVlLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgYXdhaXQgZGVsZXRlQWxsSWRzU2hhcmQoaWQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWRzID0gYXdhaXQgaXRlcmF0ZSgpO1xyXG4gIH1cclxufTtcclxuIiwiaW1wb3J0IHtcclxuICB0cnlBd2FpdE9ySWdub3JlLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7XHJcbiAgaXNJbmRleCwgaXNTaGFyZGVkSW5kZXgsXHJcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcclxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQge1xyXG4gIGdldEFsbFNoYXJkS2V5cywgZ2V0U2hhcmRNYXBLZXksXHJcbiAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5LFxyXG59IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcclxuXHJcbmV4cG9ydCBjb25zdCBfZGVsZXRlSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleEtleSwgaW5jbHVkZUZvbGRlcikgPT4ge1xyXG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoaW5kZXhLZXkpO1xyXG5cclxuICBpZiAoIWlzSW5kZXgoaW5kZXhOb2RlKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ1N1cHBsaWVkIGtleSBpcyBub3QgYW4gaW5kZXgnKTsgfVxyXG5cclxuICBpZiAoaXNTaGFyZGVkSW5kZXgoaW5kZXhOb2RlKSkge1xyXG4gICAgY29uc3Qgc2hhcmRLZXlzID0gYXdhaXQgZ2V0QWxsU2hhcmRLZXlzKGFwcCwgaW5kZXhLZXkpO1xyXG4gICAgZm9yIChjb25zdCBrIG9mIHNoYXJkS2V5cykge1xyXG4gICAgICBhd2FpdCB0cnlBd2FpdE9ySWdub3JlKFxyXG4gICAgICAgIGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShrKSxcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIHRyeUF3YWl0T3JJZ25vcmUoXHJcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShcclxuICAgICAgICBnZXRTaGFyZE1hcEtleShpbmRleEtleSksXHJcbiAgICAgICksXHJcbiAgICApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBhd2FpdCB0cnlBd2FpdE9ySWdub3JlKFxyXG4gICAgICBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoXHJcbiAgICAgICAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5KGluZGV4S2V5KSxcclxuICAgICAgKSxcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBpZiAoaW5jbHVkZUZvbGRlcikge1xyXG4gICAgdHJ5QXdhaXRPcklnbm9yZShcclxuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoaW5kZXhLZXkpLFxyXG4gICAgKTtcclxuICB9XHJcbn07XHJcbiIsImltcG9ydCB7XHJcbiAgc2FmZUtleSwgYXBpV3JhcHBlcixcclxuICBldmVudHMsIGpvaW5LZXksXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgX2xvYWQsIGdldFJlY29yZEZpbGVOYW1lIH0gZnJvbSAnLi9sb2FkJztcclxuaW1wb3J0IHsgX2RlbGV0ZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9jb2xsZWN0aW9uQXBpL2RlbGV0ZSc7XHJcbmltcG9ydCB7XHJcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksIGdldE5vZGUsXHJcbiAgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvTm9kZSxcclxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBfZGVsZXRlSW5kZXggfSBmcm9tICcuLi9pbmRleEFwaS9kZWxldGUnO1xyXG5pbXBvcnQgeyB0cmFuc2FjdGlvbkZvckRlbGV0ZVJlY29yZCB9IGZyb20gJy4uL3RyYW5zYWN0aW9ucy9jcmVhdGUnO1xyXG5pbXBvcnQgeyByZW1vdmVGcm9tQWxsSWRzIH0gZnJvbSAnLi4vaW5kZXhpbmcvYWxsSWRzJztcclxuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlbGV0ZVJlY29yZCA9IChhcHAsIGRpc2FibGVDbGVhbnVwID0gZmFsc2UpID0+IGFzeW5jIGtleSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMucmVjb3JkQXBpLmRlbGV0ZSxcclxuICBwZXJtaXNzaW9uLmRlbGV0ZVJlY29yZC5pc0F1dGhvcml6ZWQoa2V5KSxcclxuICB7IGtleSB9LFxyXG4gIF9kZWxldGVSZWNvcmQsIGFwcCwga2V5LCBkaXNhYmxlQ2xlYW51cCxcclxuKTtcclxuXHJcbi8vIGNhbGxlZCBkZWxldGVSZWNvcmQgYmVjYXVzZSBkZWxldGUgaXMgYSBrZXl3b3JkXHJcbmV4cG9ydCBjb25zdCBfZGVsZXRlUmVjb3JkID0gYXN5bmMgKGFwcCwga2V5LCBkaXNhYmxlQ2xlYW51cCkgPT4ge1xyXG4gIGtleSA9IHNhZmVLZXkoa2V5KTtcclxuICBjb25zdCBub2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShrZXkpO1xyXG5cclxuICBjb25zdCByZWNvcmQgPSBhd2FpdCBfbG9hZChhcHAsIGtleSk7XHJcbiAgYXdhaXQgdHJhbnNhY3Rpb25Gb3JEZWxldGVSZWNvcmQoYXBwLCByZWNvcmQpO1xyXG5cclxuICBmb3IgKGNvbnN0IGNvbGxlY3Rpb25SZWNvcmQgb2Ygbm9kZS5jaGlsZHJlbikge1xyXG4gICAgY29uc3QgY29sbGVjdGlvbktleSA9IGpvaW5LZXkoXHJcbiAgICAgIGtleSwgY29sbGVjdGlvblJlY29yZC5jb2xsZWN0aW9uTmFtZSxcclxuICAgICk7XHJcbiAgICBhd2FpdCBfZGVsZXRlQ29sbGVjdGlvbihhcHAsIGNvbGxlY3Rpb25LZXksIHRydWUpO1xyXG4gIH1cclxuXHJcbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKFxyXG4gICAgZ2V0UmVjb3JkRmlsZU5hbWUoa2V5KSxcclxuICApO1xyXG5cclxuICBhd2FpdCBkZWxldGVGaWxlcyhhcHAsIGtleSk7XHJcblxyXG4gIGF3YWl0IHJlbW92ZUZyb21BbGxJZHMoYXBwLmhpZXJhcmNoeSwgYXBwLmRhdGFzdG9yZSkocmVjb3JkKTtcclxuXHJcbiAgaWYgKCFkaXNhYmxlQ2xlYW51cCkgeyBhd2FpdCBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucygpOyB9XHJcblxyXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKGtleSk7XHJcbiAgYXdhaXQgZGVsZXRlSW5kZXhlcyhhcHAsIGtleSk7XHJcbn07XHJcblxyXG5jb25zdCBkZWxldGVJbmRleGVzID0gYXN5bmMgKGFwcCwga2V5KSA9PiB7XHJcbiAgY29uc3Qgbm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoa2V5KTtcclxuICAvKiBjb25zdCByZXZlcnNlSW5kZXhLZXlzID0gJChhcHAuaGllcmFyY2h5LCBbXHJcbiAgICAgICAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxyXG4gICAgICAgIG1hcChuID0+IG4uZmllbGRzKSxcclxuICAgICAgICBmbGF0dGVuLFxyXG4gICAgICAgIGZpbHRlcihpc1NvbWV0aGluZyksXHJcbiAgICAgICAgZmlsdGVyKGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUobm9kZSkpLFxyXG4gICAgICAgIG1hcChmID0+ICQoZi50eXBlT3B0aW9ucy5yZXZlcnNlSW5kZXhOb2RlS2V5cywgW1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcChuID0+IGdldE5vZGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwLmhpZXJhcmNoeSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuKSlcclxuICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgKSxcclxuICAgICAgICBmbGF0dGVuLFxyXG4gICAgICAgIG1hcChuID0+IGpvaW5LZXkoa2V5LCBuLm5hbWUpKVxyXG4gICAgXSk7XHJcblxyXG4gICAgZm9yKGxldCBpIG9mIHJldmVyc2VJbmRleEtleXMpIHtcclxuICAgICAgICBhd2FpdCBfZGVsZXRlSW5kZXgoYXBwLCBpLCB0cnVlKTtcclxuICAgIH0gKi9cclxuXHJcblxyXG4gIGZvciAoY29uc3QgaW5kZXggb2Ygbm9kZS5pbmRleGVzKSB7XHJcbiAgICBjb25zdCBpbmRleEtleSA9IGpvaW5LZXkoa2V5LCBpbmRleC5uYW1lKTtcclxuICAgIGF3YWl0IF9kZWxldGVJbmRleChhcHAsIGluZGV4S2V5LCB0cnVlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBkZWxldGVGaWxlcyA9IGFzeW5jIChhcHAsIGtleSkgPT4ge1xyXG4gIGNvbnN0IGZpbGVzRm9sZGVyID0gam9pbktleShrZXksICdmaWxlcycpO1xyXG4gIGNvbnN0IGFsbEZpbGVzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5nZXRGb2xkZXJDb250ZW50cyhcclxuICAgIGZpbGVzRm9sZGVyLFxyXG4gICk7XHJcblxyXG4gIGZvciAoY29uc3QgZmlsZSBvZiBhbGxGaWxlcykge1xyXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKGZpbGUpO1xyXG4gIH1cclxuXHJcbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoXHJcbiAgICBqb2luS2V5KGtleSwgJ2ZpbGVzJyksXHJcbiAgKTtcclxufTtcclxuIiwiaW1wb3J0IHtcclxuICBpbmNsdWRlcywgZmlsdGVyLFxyXG4gIG1hcCwgc29tZSxcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xyXG5pbXBvcnQgeyBfbG9hZCB9IGZyb20gJy4vbG9hZCc7XHJcbmltcG9ydCB7XHJcbiAgYXBpV3JhcHBlciwgZXZlbnRzLCBzcGxpdEtleSxcclxuICAkLCBqb2luS2V5LCBpc05vdGhpbmcsIHRyeUF3YWl0T3JJZ25vcmUsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgZ2V0RXhhY3ROb2RlRm9yUGF0aCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcclxuaW1wb3J0IHsgaXNMZWdhbEZpbGVuYW1lIH0gZnJvbSAnLi4vdHlwZXMvZmlsZSc7XHJcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciwgRm9yYmlkZGVuRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcclxuXHJcbmV4cG9ydCBjb25zdCB1cGxvYWRGaWxlID0gYXBwID0+IGFzeW5jIChyZWNvcmRLZXksIHJlYWRhYmxlU3RyZWFtLCByZWxhdGl2ZUZpbGVQYXRoKSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMucmVjb3JkQXBpLnVwbG9hZEZpbGUsXHJcbiAgcGVybWlzc2lvbi51cGRhdGVSZWNvcmQuaXNBdXRob3JpemVkKHJlY29yZEtleSksXHJcbiAgeyByZWNvcmRLZXksIHJlYWRhYmxlU3RyZWFtLCByZWxhdGl2ZUZpbGVQYXRoIH0sXHJcbiAgX3VwbG9hZEZpbGUsIGFwcCwgcmVjb3JkS2V5LCByZWFkYWJsZVN0cmVhbSwgcmVsYXRpdmVGaWxlUGF0aCxcclxuKTtcclxuXHJcbmNvbnN0IF91cGxvYWRGaWxlID0gYXN5bmMgKGFwcCwgcmVjb3JkS2V5LCByZWFkYWJsZVN0cmVhbSwgcmVsYXRpdmVGaWxlUGF0aCkgPT4ge1xyXG4gIGlmIChpc05vdGhpbmcocmVjb3JkS2V5KSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdSZWNvcmQgS2V5IG5vdCBzdXBwbGllZCcpOyB9XHJcbiAgaWYgKGlzTm90aGluZyhyZWxhdGl2ZUZpbGVQYXRoKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdmaWxlIHBhdGggbm90IHN1cHBsaWVkJyk7IH1cclxuICBpZiAoIWlzTGVnYWxGaWxlbmFtZShyZWxhdGl2ZUZpbGVQYXRoKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdJbGxlZ2FsIGZpbGVuYW1lJyk7IH1cclxuXHJcbiAgY29uc3QgcmVjb3JkID0gYXdhaXQgX2xvYWQoYXBwLCByZWNvcmRLZXkpO1xyXG5cclxuICBjb25zdCBmdWxsRmlsZVBhdGggPSBzYWZlR2V0RnVsbEZpbGVQYXRoKFxyXG4gICAgcmVjb3JkS2V5LCByZWxhdGl2ZUZpbGVQYXRoLFxyXG4gICk7XHJcblxyXG4gIGNvbnN0IHRlbXBGaWxlUGF0aCA9IGAke2Z1bGxGaWxlUGF0aH1fJHtnZW5lcmF0ZSgpfS50ZW1wYDtcclxuXHJcbiAgY29uc3Qgb3V0cHV0U3RyZWFtID0gYXdhaXQgYXBwLmRhdGFzdG9yZS53cml0YWJsZUZpbGVTdHJlYW0oXHJcbiAgICB0ZW1wRmlsZVBhdGgsXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCkgPT4ge1xyXG4gICAgcmVhZGFibGVTdHJlYW0ucGlwZShvdXRwdXRTdHJlYW0pO1xyXG4gICAgb3V0cHV0U3RyZWFtLm9uKCdlcnJvcicsIHJlamVjdCk7XHJcbiAgICBvdXRwdXRTdHJlYW0ub24oJ2ZpbmlzaCcsIHJlc29sdmUpO1xyXG4gIH0pXHJcbiAgLnRoZW4oKCkgPT4gYXBwLmRhdGFzdG9yZS5nZXRGaWxlU2l6ZSh0ZW1wRmlsZVBhdGgpKVxyXG4gIC50aGVuKHNpemUgPT4ge1xyXG4gICAgY29uc3QgaXNFeHBlY3RlZEZpbGVTaXplID0gY2hlY2tGaWxlU2l6ZUFnYWluc3RGaWVsZHMoXHJcbiAgICAgIGFwcCwgcmVjb3JkLCByZWxhdGl2ZUZpbGVQYXRoLCBzaXplXHJcbiAgICApOyAgXHJcbiAgICBpZiAoIWlzRXhwZWN0ZWRGaWxlU2l6ZSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBGaWVsZHMgZm9yICR7cmVsYXRpdmVGaWxlUGF0aH0gZG8gbm90IGhhdmUgZXhwZWN0ZWQgc2l6ZTogJHtqb2luKCcsJykoaW5jb3JyZWN0RmllbGRzKX1gKTsgfSAgXHJcblxyXG4gIH0pXHJcbiAgLnRoZW4oKCkgPT4gdHJ5QXdhaXRPcklnbm9yZShhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUsIGZ1bGxGaWxlUGF0aCkpXHJcbiAgLnRoZW4oKCkgPT4gYXBwLmRhdGFzdG9yZS5yZW5hbWVGaWxlKHRlbXBGaWxlUGF0aCwgZnVsbEZpbGVQYXRoKSk7XHJcblxyXG4gIC8qXHJcbiAgcmVhZGFibGVTdHJlYW0ucGlwZShvdXRwdXRTdHJlYW0pO1xyXG5cclxuICBhd2FpdCBuZXcgUHJvbWlzZShmdWxmaWxsID0+IG91dHB1dFN0cmVhbS5vbignZmluaXNoJywgZnVsZmlsbCkpO1xyXG5cclxuICBjb25zdCBpc0V4cGVjdGVkRmlsZVNpemUgPSBjaGVja0ZpbGVTaXplQWdhaW5zdEZpZWxkcyhcclxuICAgIGFwcCxcclxuICAgIHJlY29yZCwgcmVsYXRpdmVGaWxlUGF0aCxcclxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0RmlsZVNpemUodGVtcEZpbGVQYXRoKSxcclxuICApO1xyXG5cclxuICBpZiAoIWlzRXhwZWN0ZWRGaWxlU2l6ZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICBgRmllbGRzIGZvciAke3JlbGF0aXZlRmlsZVBhdGh9IGRvIG5vdCBoYXZlIGV4cGVjdGVkIHNpemVgKTtcclxuICB9XHJcblxyXG4gIGF3YWl0IHRyeUF3YWl0T3JJZ25vcmUoYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlLCBmdWxsRmlsZVBhdGgpO1xyXG5cclxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLnJlbmFtZUZpbGUodGVtcEZpbGVQYXRoLCBmdWxsRmlsZVBhdGgpO1xyXG4gICovXHJcbn07XHJcblxyXG5jb25zdCBjaGVja0ZpbGVTaXplQWdhaW5zdEZpZWxkcyA9IChhcHAsIHJlY29yZCwgcmVsYXRpdmVGaWxlUGF0aCwgZXhwZWN0ZWRTaXplKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkocmVjb3JkLmtleSk7XHJcblxyXG4gIGNvbnN0IGluY29ycmVjdEZpbGVGaWVsZHMgPSAkKHJlY29yZE5vZGUuZmllbGRzLCBbXHJcbiAgICBmaWx0ZXIoZiA9PiBmLnR5cGUgPT09ICdmaWxlJ1xyXG4gICAgICAmJiByZWNvcmRbZi5uYW1lXS5yZWxhdGl2ZVBhdGggPT09IHJlbGF0aXZlRmlsZVBhdGhcclxuICAgICAgJiYgcmVjb3JkW2YubmFtZV0uc2l6ZSAhPT0gZXhwZWN0ZWRTaXplKSxcclxuICAgIG1hcChmID0+IGYubmFtZSksXHJcbiAgXSk7XHJcblxyXG4gIGNvbnN0IGluY29ycmVjdEZpbGVBcnJheUZpZWxkcyA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcclxuICAgIGZpbHRlcihhID0+IGEudHlwZSA9PT0gJ2FycmF5PGZpbGU+J1xyXG4gICAgICAmJiAkKHJlY29yZFthLm5hbWVdLCBbXHJcbiAgICAgICAgc29tZShmID0+IHJlY29yZFtmLm5hbWVdLnJlbGF0aXZlUGF0aCA9PT0gcmVsYXRpdmVGaWxlUGF0aFxyXG4gICAgICAgICAgJiYgcmVjb3JkW2YubmFtZV0uc2l6ZSAhPT0gZXhwZWN0ZWRTaXplKSxcclxuICAgICAgXSkpLFxyXG4gICAgbWFwKGYgPT4gZi5uYW1lKSxcclxuICBdKTtcclxuXHJcbiAgY29uc3QgaW5jb3JyZWN0RmllbGRzID0gW1xyXG4gICAgLi4uaW5jb3JyZWN0RmlsZUZpZWxkcyxcclxuICAgIC4uLmluY29ycmVjdEZpbGVBcnJheUZpZWxkcyxcclxuICBdO1xyXG5cclxuICBpZiAoaW5jb3JyZWN0RmllbGRzLmxlbmd0aCA+IDApIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHNhZmVHZXRGdWxsRmlsZVBhdGggPSAocmVjb3JkS2V5LCByZWxhdGl2ZUZpbGVQYXRoKSA9PiB7XHJcbiAgY29uc3QgbmF1Z2h0eVVzZXIgPSAoKSA9PiB7IHRocm93IG5ldyBGb3JiaWRkZW5FcnJvcignbmF1Z2h0eSBuYXVnaHR5Jyk7IH07XHJcblxyXG4gIGlmIChyZWxhdGl2ZUZpbGVQYXRoLnN0YXJ0c1dpdGgoJy4uJykpIG5hdWdodHlVc2VyKCk7XHJcblxyXG4gIGNvbnN0IHBhdGhQYXJ0cyA9IHNwbGl0S2V5KHJlbGF0aXZlRmlsZVBhdGgpO1xyXG5cclxuICBpZiAoaW5jbHVkZXMoJy4uJykocGF0aFBhcnRzKSkgbmF1Z2h0eVVzZXIoKTtcclxuXHJcbiAgY29uc3QgcmVjb3JkS2V5UGFydHMgPSBzcGxpdEtleShyZWNvcmRLZXkpO1xyXG5cclxuICBjb25zdCBmdWxsUGF0aFBhcnRzID0gW1xyXG4gICAgLi4ucmVjb3JkS2V5UGFydHMsXHJcbiAgICAnZmlsZXMnLFxyXG4gICAgLi4uZmlsdGVyKHAgPT4gcCAhPT0gJy4nKShwYXRoUGFydHMpLFxyXG4gIF07XHJcblxyXG4gIHJldHVybiBqb2luS2V5KGZ1bGxQYXRoUGFydHMpO1xyXG59O1xyXG4iLCJpbXBvcnQgeyBhcGlXcmFwcGVyLCBldmVudHMsIGlzTm90aGluZyB9IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcclxuaW1wb3J0IHsgc2FmZUdldEZ1bGxGaWxlUGF0aCB9IGZyb20gJy4vdXBsb2FkRmlsZSc7XHJcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRvd25sb2FkRmlsZSA9IGFwcCA9PiBhc3luYyAocmVjb3JkS2V5LCByZWxhdGl2ZVBhdGgpID0+IGFwaVdyYXBwZXIoXHJcbiAgYXBwLFxyXG4gIGV2ZW50cy5yZWNvcmRBcGkudXBsb2FkRmlsZSxcclxuICBwZXJtaXNzaW9uLnJlYWRSZWNvcmQuaXNBdXRob3JpemVkKHJlY29yZEtleSksXHJcbiAgeyByZWNvcmRLZXksIHJlbGF0aXZlUGF0aCB9LC8vcmVtb3ZlIGR1cGUga2V5ICdyZWNvcmRLZXknIGZyb20gb2JqZWN0XHJcbiAgX2Rvd25sb2FkRmlsZSwgYXBwLCByZWNvcmRLZXksIHJlbGF0aXZlUGF0aCxcclxuKTsgXHJcblxyXG5cclxuY29uc3QgX2Rvd25sb2FkRmlsZSA9IGFzeW5jIChhcHAsIHJlY29yZEtleSwgcmVsYXRpdmVQYXRoKSA9PiB7XHJcbiAgaWYgKGlzTm90aGluZyhyZWNvcmRLZXkpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ1JlY29yZCBLZXkgbm90IHN1cHBsaWVkJyk7IH1cclxuICBpZiAoaXNOb3RoaW5nKHJlbGF0aXZlUGF0aCkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignZmlsZSBwYXRoIG5vdCBzdXBwbGllZCcpOyB9XHJcblxyXG4gIHJldHVybiBhd2FpdCBhcHAuZGF0YXN0b3JlLnJlYWRhYmxlRmlsZVN0cmVhbShcclxuICAgIHNhZmVHZXRGdWxsRmlsZVBhdGgoXHJcbiAgICAgIHJlY29yZEtleSwgcmVsYXRpdmVQYXRoLFxyXG4gICAgKSxcclxuICApO1xyXG59O1xyXG4iLCJpbXBvcnQgeyBmaW5kLCB0YWtlLCB1bmlvbiB9IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IGdldEZsYXR0ZW5lZEhpZXJhcmNoeSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7ICQsIHNwbGl0S2V5LCBqb2luS2V5IH0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgTm90Rm91bmRFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGN1c3RvbUlkID0gYXBwID0+IChub2RlTmFtZSwgaWQpID0+IHtcclxuICBjb25zdCBub2RlID0gJChhcHAuaGllcmFyY2h5LCBbXHJcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbiAgICBmaW5kKG4gPT4gbi5uYW1lID09PSBub2RlTmFtZSksXHJcbiAgXSk7XHJcblxyXG4gIGlmICghbm9kZSkgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoYENhbm5vdCBmaW5kIG5vZGUgJHtub2RlTmFtZX1gKTtcclxuXHJcbiAgcmV0dXJuIGAke25vZGUubm9kZUlkfS0ke2lkfWA7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0Q3VzdG9tSWQgPSBhcHAgPT4gKHJlY29yZCwgaWQpID0+IHtcclxuICByZWNvcmQuaWQgPSBjdXN0b21JZChhcHApKHJlY29yZC50eXBlLCBpZCk7XHJcblxyXG4gIGNvbnN0IGtleVBhcnRzID0gc3BsaXRLZXkocmVjb3JkLmtleSk7XHJcblxyXG4gIHJlY29yZC5rZXkgPSAkKGtleVBhcnRzLCBbXHJcbiAgICB0YWtlKGtleVBhcnRzLmxlbmd0aCAtIDEpLFxyXG4gICAgdW5pb24oW3JlY29yZC5pZF0pLFxyXG4gICAgam9pbktleSxcclxuICBdKTtcclxuXHJcbiAgcmV0dXJuIHJlY29yZDtcclxufTtcclxuIiwiaW1wb3J0IHsgZ2V0TmV3LCBnZXROZXdDaGlsZCB9IGZyb20gJy4vZ2V0TmV3JztcclxuaW1wb3J0IHsgbG9hZCB9IGZyb20gJy4vbG9hZCc7XHJcbmltcG9ydCB7IHZhbGlkYXRlIH0gZnJvbSAnLi92YWxpZGF0ZSc7XHJcbmltcG9ydCB7IGdldENvbnRleHQgfSBmcm9tICcuL2dldENvbnRleHQnO1xyXG5pbXBvcnQgeyBzYXZlIH0gZnJvbSAnLi9zYXZlJztcclxuaW1wb3J0IHsgZGVsZXRlUmVjb3JkIH0gZnJvbSAnLi9kZWxldGUnO1xyXG5pbXBvcnQgeyB1cGxvYWRGaWxlIH0gZnJvbSAnLi91cGxvYWRGaWxlJztcclxuaW1wb3J0IHsgZG93bmxvYWRGaWxlIH0gZnJvbSAnLi9kb3dubG9hZEZpbGUnO1xyXG5pbXBvcnQgeyBjdXN0b21JZCwgc2V0Q3VzdG9tSWQgfSBmcm9tICcuL2N1c3RvbUlkJztcclxuXHJcbmNvbnN0IGFwaSA9IGFwcCA9PiAoe1xyXG4gIGdldE5ldzogZ2V0TmV3KGFwcCksXHJcbiAgZ2V0TmV3Q2hpbGQ6IGdldE5ld0NoaWxkKGFwcCksXHJcbiAgc2F2ZTogc2F2ZShhcHApLFxyXG4gIGxvYWQ6IGxvYWQoYXBwKSxcclxuICBkZWxldGU6IGRlbGV0ZVJlY29yZChhcHAsIGZhbHNlKSxcclxuICB2YWxpZGF0ZTogdmFsaWRhdGUoYXBwKSxcclxuICBnZXRDb250ZXh0OiBnZXRDb250ZXh0KGFwcCksXHJcbiAgdXBsb2FkRmlsZTogdXBsb2FkRmlsZShhcHApLFxyXG4gIGRvd25sb2FkRmlsZTogZG93bmxvYWRGaWxlKGFwcCksXHJcbiAgY3VzdG9tSWQ6IGN1c3RvbUlkKGFwcCksXHJcbiAgc2V0Q3VzdG9tSWQ6IHNldEN1c3RvbUlkKGFwcCksXHJcbn0pO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRSZWNvcmRBcGkgPSBhcHAgPT4gYXBpKGFwcCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXRSZWNvcmRBcGk7XHJcbiIsImltcG9ydCB7IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7XHJcbiAgaXNOb3RoaW5nLCBzYWZlS2V5LCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IGFsd2F5c0F1dGhvcml6ZWQgfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRBbGxvd2VkUmVjb3JkVHlwZXMgPSBhcHAgPT4ga2V5ID0+IGFwaVdyYXBwZXJTeW5jKFxyXG4gIGFwcCxcclxuICBldmVudHMuY29sbGVjdGlvbkFwaS5nZXRBbGxvd2VkUmVjb3JkVHlwZXMsXHJcbiAgYWx3YXlzQXV0aG9yaXplZCxcclxuICB7IGtleSB9LFxyXG4gIF9nZXRBbGxvd2VkUmVjb3JkVHlwZXMsIGFwcCwga2V5LFxyXG4pO1xyXG5cclxuY29uc3QgX2dldEFsbG93ZWRSZWNvcmRUeXBlcyA9IChhcHAsIGtleSkgPT4ge1xyXG4gIGtleSA9IHNhZmVLZXkoa2V5KTtcclxuICBjb25zdCBub2RlID0gZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoKGFwcC5oaWVyYXJjaHkpKGtleSk7XHJcbiAgcmV0dXJuIGlzTm90aGluZyhub2RlKSA/IFtdIDogW25vZGUubmFtZV07XHJcbn07XHJcbiIsImltcG9ydCB7IGdldEFsbElkc0l0ZXJhdG9yIH0gZnJvbSAnLi4vaW5kZXhpbmcvYWxsSWRzJztcclxuaW1wb3J0IHsgZ2V0QWxsb3dlZFJlY29yZFR5cGVzIH0gZnJvbSAnLi9nZXRBbGxvd2VkUmVjb3JkVHlwZXMnO1xyXG5pbXBvcnQgeyBkZWxldGVDb2xsZWN0aW9uIH0gZnJvbSAnLi9kZWxldGUnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldENvbGxlY3Rpb25BcGkgPSBhcHAgPT4gKHtcclxuICBnZXRBbGxvd2VkUmVjb3JkVHlwZXM6IGdldEFsbG93ZWRSZWNvcmRUeXBlcyhhcHApLFxyXG4gIGdldEFsbElkc0l0ZXJhdG9yOiBnZXRBbGxJZHNJdGVyYXRvcihhcHApLFxyXG4gIGRlbGV0ZTogZGVsZXRlQ29sbGVjdGlvbihhcHApLFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldENvbGxlY3Rpb25BcGk7XHJcbiIsImltcG9ydCB7XHJcbiAgZmluZCwgZmlsdGVyLCBcclxuICBpbmNsdWRlcywgc29tZSxcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBnZXRBbGxJZHNJdGVyYXRvciB9IGZyb20gJy4uL2luZGV4aW5nL2FsbElkcyc7XHJcbmltcG9ydCB7XHJcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LCBnZXRSZWNvcmROb2RlQnlJZCxcclxuICBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5LCBnZXROb2RlLCBpc0luZGV4LFxyXG4gIGlzUmVjb3JkLCBpc0RlY2VuZGFudCwgZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgsXHJcbiAgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXgsXHJcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHtcclxuICBqb2luS2V5LCBhcGlXcmFwcGVyLCBldmVudHMsICQsIGFsbFRydWUsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHtcclxuICBjcmVhdGVCdWlsZEluZGV4Rm9sZGVyLFxyXG4gIHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleCxcclxufSBmcm9tICcuLi90cmFuc2FjdGlvbnMvY3JlYXRlJztcclxuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xyXG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcclxuXHJcblxyXG4vKiogcmVidWlsZHMgYW4gaW5kZXhcclxuICogQHBhcmFtIHtvYmplY3R9IGFwcCAtIHRoZSBhcHBsaWNhdGlvbiBjb250YWluZXJcclxuICogQHBhcmFtIHtzdHJpbmd9IGluZGV4Tm9kZUtleSAtIG5vZGUga2V5IG9mIHRoZSBpbmRleCwgd2hpY2ggdGhlIGluZGV4IGJlbG9uZ3MgdG9cclxuICovXHJcbmV4cG9ydCBjb25zdCBidWlsZEluZGV4ID0gYXBwID0+IGFzeW5jIGluZGV4Tm9kZUtleSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMuaW5kZXhBcGkuYnVpbGRJbmRleCxcclxuICBwZXJtaXNzaW9uLm1hbmFnZUluZGV4LmlzQXV0aG9yaXplZCxcclxuICB7IGluZGV4Tm9kZUtleSB9LFxyXG4gIF9idWlsZEluZGV4LCBhcHAsIGluZGV4Tm9kZUtleSxcclxuKTtcclxuXHJcbmNvbnN0IF9idWlsZEluZGV4ID0gYXN5bmMgKGFwcCwgaW5kZXhOb2RlS2V5KSA9PiB7XHJcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0Tm9kZShhcHAuaGllcmFyY2h5LCBpbmRleE5vZGVLZXkpO1xyXG5cclxuICBhd2FpdCBjcmVhdGVCdWlsZEluZGV4Rm9sZGVyKGFwcC5kYXRhc3RvcmUsIGluZGV4Tm9kZUtleSk7XHJcblxyXG4gIGlmICghaXNJbmRleChpbmRleE5vZGUpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ0J1aWxkSW5kZXg6IG11c3Qgc3VwcGx5IGFuIGluZGV4bm9kZScpOyB9XHJcblxyXG4gIGlmIChpbmRleE5vZGUuaW5kZXhUeXBlID09PSAncmVmZXJlbmNlJykge1xyXG4gICAgYXdhaXQgYnVpbGRSZXZlcnNlUmVmZXJlbmNlSW5kZXgoXHJcbiAgICAgIGFwcCwgaW5kZXhOb2RlLFxyXG4gICAgKTtcclxuICB9IGVsc2Uge1xyXG4gICAgYXdhaXQgYnVpbGRIZWlyYXJjaGFsSW5kZXgoXHJcbiAgICAgIGFwcCwgaW5kZXhOb2RlLFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGF3YWl0IGFwcC5jbGVhbnVwVHJhbnNhY3Rpb25zKCk7XHJcbn07XHJcblxyXG5jb25zdCBidWlsZFJldmVyc2VSZWZlcmVuY2VJbmRleCA9IGFzeW5jIChhcHAsIGluZGV4Tm9kZSkgPT4ge1xyXG4gIC8vIEl0ZXJhdGUgdGhyb3VnaCBhbGwgcmVmZXJlbmNJTkcgcmVjb3JkcyxcclxuICAvLyBhbmQgdXBkYXRlIHJlZmVyZW5jZWQgaW5kZXggZm9yIGVhY2ggcmVjb3JkXHJcbiAgbGV0IHJlY29yZENvdW50ID0gMDtcclxuICBjb25zdCByZWZlcmVuY2luZ05vZGVzID0gJChhcHAuaGllcmFyY2h5LCBbXHJcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbiAgICBmaWx0ZXIobiA9PiBpc1JlY29yZChuKVxyXG4gICAgICAgICAgICAgICAgICAgICYmIHNvbWUoZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXgoaW5kZXhOb2RlKSkobi5maWVsZHMpKSxcclxuICBdKTtcclxuXHJcbiAgY29uc3QgY3JlYXRlVHJhbnNhY3Rpb25zRm9yUmVmZXJlbmNpbmdOb2RlID0gYXN5bmMgKHJlZmVyZW5jaW5nTm9kZSkgPT4ge1xyXG4gICAgY29uc3QgaXRlcmF0ZVJlZmVyZW5jaW5nTm9kZXMgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvcihhcHApKHJlZmVyZW5jaW5nTm9kZS5jb2xsZWN0aW9uTm9kZUtleSgpKTtcclxuXHJcbiAgICBsZXQgcmVmZXJlbmNpbmdJZEl0ZXJhdG9yID0gYXdhaXQgaXRlcmF0ZVJlZmVyZW5jaW5nTm9kZXMoKTtcclxuICAgIHdoaWxlICghcmVmZXJlbmNpbmdJZEl0ZXJhdG9yLmRvbmUpIHtcclxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlZmVyZW5jaW5nSWRJdGVyYXRvcjtcclxuICAgICAgZm9yIChjb25zdCBpZCBvZiByZXN1bHQuaWRzKSB7XHJcbiAgICAgICAgY29uc3QgcmVjb3JkS2V5ID0gam9pbktleShyZXN1bHQuY29sbGVjdGlvbktleSwgaWQpO1xyXG4gICAgICAgIGF3YWl0IHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleChhcHAsIGluZGV4Tm9kZS5ub2RlS2V5KCksIHJlY29yZEtleSwgcmVjb3JkQ291bnQpO1xyXG4gICAgICAgIHJlY29yZENvdW50Kys7XHJcbiAgICAgIH1cclxuICAgICAgcmVmZXJlbmNpbmdJZEl0ZXJhdG9yID0gYXdhaXQgaXRlcmF0ZVJlZmVyZW5jaW5nTm9kZXMoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBmb3IgKGNvbnN0IHJlZmVyZW5jaW5nTm9kZSBvZiByZWZlcmVuY2luZ05vZGVzKSB7XHJcbiAgICBhd2FpdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JSZWZlcmVuY2luZ05vZGUocmVmZXJlbmNpbmdOb2RlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBnZXRBbGxvd2VkUGFyZW50Q29sbGVjdGlvbk5vZGVzID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlKSA9PiAkKGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4KGhpZXJhcmNoeSwgaW5kZXhOb2RlKSwgW1xyXG4gIG1hcChuID0+IG4ucGFyZW50KCkpLFxyXG5dKTtcclxuXHJcbmNvbnN0IGJ1aWxkSGVpcmFyY2hhbEluZGV4ID0gYXN5bmMgKGFwcCwgaW5kZXhOb2RlKSA9PiB7XHJcbiAgbGV0IHJlY29yZENvdW50ID0gMDtcclxuXHJcbiAgY29uc3QgY3JlYXRlVHJhbnNhY3Rpb25zRm9ySWRzID0gYXN5bmMgKGNvbGxlY3Rpb25LZXksIGlkcykgPT4ge1xyXG4gICAgZm9yIChjb25zdCByZWNvcmRJZCBvZiBpZHMpIHtcclxuICAgICAgY29uc3QgcmVjb3JkS2V5ID0gam9pbktleShjb2xsZWN0aW9uS2V5LCByZWNvcmRJZCk7XHJcblxyXG4gICAgICBjb25zdCByZWNvcmROb2RlID0gZ2V0UmVjb3JkTm9kZUJ5SWQoXHJcbiAgICAgICAgYXBwLmhpZXJhcmNoeSxcclxuICAgICAgICByZWNvcmRJZCxcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGlmIChyZWNvcmROb2RlQXBwbGllcyhpbmRleE5vZGUpKHJlY29yZE5vZGUpKSB7XHJcbiAgICAgICAgYXdhaXQgdHJhbnNhY3Rpb25Gb3JCdWlsZEluZGV4KFxyXG4gICAgICAgICAgYXBwLCBpbmRleE5vZGUubm9kZUtleSgpLFxyXG4gICAgICAgICAgcmVjb3JkS2V5LCByZWNvcmRDb3VudCxcclxuICAgICAgICApO1xyXG4gICAgICAgIHJlY29yZENvdW50Kys7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuXHJcbiAgY29uc3QgY29sbGVjdGlvblJlY29yZHMgPSBnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleChhcHAuaGllcmFyY2h5LCBpbmRleE5vZGUpO1xyXG5cclxuICBmb3IgKGNvbnN0IHRhcmdldENvbGxlY3Rpb25SZWNvcmROb2RlIG9mIGNvbGxlY3Rpb25SZWNvcmRzKSB7XHJcbiAgICBjb25zdCBhbGxJZHNJdGVyYXRvciA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yKGFwcCkodGFyZ2V0Q29sbGVjdGlvblJlY29yZE5vZGUuY29sbGVjdGlvbk5vZGVLZXkoKSk7XHJcblxyXG4gICAgbGV0IGFsbElkcyA9IGF3YWl0IGFsbElkc0l0ZXJhdG9yKCk7XHJcbiAgICB3aGlsZSAoYWxsSWRzLmRvbmUgPT09IGZhbHNlKSB7XHJcbiAgICAgIGF3YWl0IGNyZWF0ZVRyYW5zYWN0aW9uc0ZvcklkcyhcclxuICAgICAgICBhbGxJZHMucmVzdWx0LmNvbGxlY3Rpb25LZXksXHJcbiAgICAgICAgYWxsSWRzLnJlc3VsdC5pZHMsXHJcbiAgICAgICk7XHJcbiAgICAgIGFsbElkcyA9IGF3YWl0IGFsbElkc0l0ZXJhdG9yKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVjb3JkQ291bnQ7XHJcbn07XHJcblxyXG5jb25zdCBjaG9vc2VDaGlsZFJlY29yZE5vZGVCeUtleSA9IChjb2xsZWN0aW9uTm9kZSwgcmVjb3JkSWQpID0+IGZpbmQoYyA9PiByZWNvcmRJZC5zdGFydHNXaXRoKGMubm9kZUlkKSkoY29sbGVjdGlvbk5vZGUuY2hpbGRyZW4pO1xyXG5cclxuY29uc3QgcmVjb3JkTm9kZUFwcGxpZXMgPSBpbmRleE5vZGUgPT4gcmVjb3JkTm9kZSA9PiBpbmNsdWRlcyhyZWNvcmROb2RlLm5vZGVJZCkoaW5kZXhOb2RlLmFsbG93ZWRSZWNvcmROb2RlSWRzKTtcclxuXHJcbmNvbnN0IGhhc0FwcGxpY2FibGVEZWNlbmRhbnQgPSAoaGllcmFyY2h5LCBhbmNlc3Rvck5vZGUsIGluZGV4Tm9kZSkgPT4gJChoaWVyYXJjaHksIFtcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbiAgZmlsdGVyKFxyXG4gICAgYWxsVHJ1ZShcclxuICAgICAgaXNSZWNvcmQsXHJcbiAgICAgIGlzRGVjZW5kYW50KGFuY2VzdG9yTm9kZSksXHJcbiAgICAgIHJlY29yZE5vZGVBcHBsaWVzKGluZGV4Tm9kZSksXHJcbiAgICApLFxyXG4gICksXHJcbl0pO1xyXG5cclxuY29uc3QgYXBwbHlBbGxEZWNlbmRhbnRSZWNvcmRzID0gYXN5bmMgKGFwcCwgY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSxcclxuICBpbmRleE5vZGUsIGluZGV4S2V5LCBjdXJyZW50SW5kZXhlZERhdGEsXHJcbiAgY3VycmVudEluZGV4ZWREYXRhS2V5LCByZWNvcmRDb3VudCA9IDApID0+IHtcclxuICBjb25zdCBjb2xsZWN0aW9uTm9kZSA9IGdldENvbGxlY3Rpb25Ob2RlQnlLZXlPck5vZGVLZXkoXHJcbiAgICBhcHAuaGllcmFyY2h5LFxyXG4gICAgY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSxcclxuICApO1xyXG5cclxuICBjb25zdCBhbGxJZHNJdGVyYXRvciA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yKGFwcCkoY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSk7XHJcblxyXG5cclxuICBjb25zdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JJZHMgPSBhc3luYyAoY29sbGVjdGlvbktleSwgYWxsSWRzKSA9PiB7XHJcbiAgICBmb3IgKGNvbnN0IHJlY29yZElkIG9mIGFsbElkcykge1xyXG4gICAgICBjb25zdCByZWNvcmRLZXkgPSBqb2luS2V5KGNvbGxlY3Rpb25LZXksIHJlY29yZElkKTtcclxuXHJcbiAgICAgIGNvbnN0IHJlY29yZE5vZGUgPSBjaG9vc2VDaGlsZFJlY29yZE5vZGVCeUtleShcclxuICAgICAgICBjb2xsZWN0aW9uTm9kZSxcclxuICAgICAgICByZWNvcmRJZCxcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGlmIChyZWNvcmROb2RlQXBwbGllcyhpbmRleE5vZGUpKHJlY29yZE5vZGUpKSB7XHJcbiAgICAgICAgYXdhaXQgdHJhbnNhY3Rpb25Gb3JCdWlsZEluZGV4KFxyXG4gICAgICAgICAgYXBwLCBpbmRleE5vZGUubm9kZUtleSgpLFxyXG4gICAgICAgICAgcmVjb3JkS2V5LCByZWNvcmRDb3VudCxcclxuICAgICAgICApO1xyXG4gICAgICAgIHJlY29yZENvdW50Kys7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChoYXNBcHBsaWNhYmxlRGVjZW5kYW50KGFwcC5oaWVyYXJjaHksIHJlY29yZE5vZGUsIGluZGV4Tm9kZSkpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkQ29sbGVjdGlvbk5vZGUgb2YgcmVjb3JkTm9kZS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgcmVjb3JkQ291bnQgPSBhd2FpdCBhcHBseUFsbERlY2VuZGFudFJlY29yZHMoXHJcbiAgICAgICAgICAgIGFwcCxcclxuICAgICAgICAgICAgam9pbktleShyZWNvcmRLZXksIGNoaWxkQ29sbGVjdGlvbk5vZGUuY29sbGVjdGlvbk5hbWUpLFxyXG4gICAgICAgICAgICBpbmRleE5vZGUsIGluZGV4S2V5LCBjdXJyZW50SW5kZXhlZERhdGEsXHJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleGVkRGF0YUtleSwgcmVjb3JkQ291bnQsXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGxldCBhbGxJZHMgPSBhd2FpdCBhbGxJZHNJdGVyYXRvcigpO1xyXG4gIHdoaWxlIChhbGxJZHMuZG9uZSA9PT0gZmFsc2UpIHtcclxuICAgIGF3YWl0IGNyZWF0ZVRyYW5zYWN0aW9uc0ZvcklkcyhcclxuICAgICAgYWxsSWRzLnJlc3VsdC5jb2xsZWN0aW9uS2V5LFxyXG4gICAgICBhbGxJZHMucmVzdWx0LmlkcyxcclxuICAgICk7XHJcbiAgICBhbGxJZHMgPSBhd2FpdCBhbGxJZHNJdGVyYXRvcigpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlY29yZENvdW50O1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYnVpbGRJbmRleDtcclxuIiwiaW1wb3J0IHsgaGFzLCBpc051bWJlciwgaXNVbmRlZmluZWQgfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBjb21waWxlRXhwcmVzc2lvbiwgY29tcGlsZUNvZGUgfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XHJcbmltcG9ydCB7XHJcbiAgc2FmZUtleSwgYXBpV3JhcHBlcixcclxuICBldmVudHMsIGlzTm9uRW1wdHlTdHJpbmcsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgaXRlcmF0ZUluZGV4IH0gZnJvbSAnLi4vaW5kZXhpbmcvcmVhZCc7XHJcbmltcG9ydCB7XHJcbiAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5LFxyXG4gIGdldFNoYXJkS2V5c0luUmFuZ2UsXHJcbn0gZnJvbSAnLi4vaW5kZXhpbmcvc2hhcmRpbmcnO1xyXG5pbXBvcnQge1xyXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsIGlzSW5kZXgsXHJcbiAgaXNTaGFyZGVkSW5kZXgsXHJcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHsgQ09OVElOVUVfUkVBRElOR19SRUNPUkRTIH0gZnJvbSAnLi4vaW5kZXhpbmcvc2VyaWFsaXplcic7XHJcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcclxuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XHJcblxyXG5leHBvcnQgY29uc3QgYWdncmVnYXRlcyA9IGFwcCA9PiBhc3luYyAoaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMgPSBudWxsLCByYW5nZUVuZFBhcmFtcyA9IG51bGwpID0+IGFwaVdyYXBwZXIoXHJcbiAgYXBwLFxyXG4gIGV2ZW50cy5pbmRleEFwaS5hZ2dyZWdhdGVzLFxyXG4gIHBlcm1pc3Npb24ucmVhZEluZGV4LmlzQXV0aG9yaXplZChpbmRleEtleSksXHJcbiAgeyBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMgfSxcclxuICBfYWdncmVnYXRlcywgYXBwLCBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMsXHJcbik7XHJcblxyXG5jb25zdCBfYWdncmVnYXRlcyA9IGFzeW5jIChhcHAsIGluZGV4S2V5LCByYW5nZVN0YXJ0UGFyYW1zLCByYW5nZUVuZFBhcmFtcykgPT4ge1xyXG4gIGluZGV4S2V5ID0gc2FmZUtleShpbmRleEtleSk7XHJcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShpbmRleEtleSk7XHJcblxyXG4gIGlmICghaXNJbmRleChpbmRleE5vZGUpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ3N1cHBsaWVkIGtleSBpcyBub3QgYW4gaW5kZXgnKTsgfVxyXG5cclxuICBpZiAoaXNTaGFyZGVkSW5kZXgoaW5kZXhOb2RlKSkge1xyXG4gICAgY29uc3Qgc2hhcmRLZXlzID0gYXdhaXQgZ2V0U2hhcmRLZXlzSW5SYW5nZShcclxuICAgICAgYXBwLCBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMsXHJcbiAgICApO1xyXG4gICAgbGV0IGFnZ3JlZ2F0ZVJlc3VsdCA9IG51bGw7XHJcbiAgICBmb3IgKGNvbnN0IGsgb2Ygc2hhcmRLZXlzKSB7XHJcbiAgICAgIGNvbnN0IHNoYXJkUmVzdWx0ID0gYXdhaXQgZ2V0QWdncmVnYXRlcyhhcHAuaGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlLCBpbmRleE5vZGUsIGspO1xyXG4gICAgICBpZiAoYWdncmVnYXRlUmVzdWx0ID09PSBudWxsKSB7XHJcbiAgICAgICAgYWdncmVnYXRlUmVzdWx0ID0gc2hhcmRSZXN1bHQ7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWdncmVnYXRlUmVzdWx0ID0gbWVyZ2VTaGFyZEFnZ3JlZ2F0ZShcclxuICAgICAgICAgIGFnZ3JlZ2F0ZVJlc3VsdCxcclxuICAgICAgICAgIHNoYXJkUmVzdWx0LFxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBhZ2dyZWdhdGVSZXN1bHQ7XHJcbiAgfVxyXG4gIHJldHVybiBhd2FpdCBnZXRBZ2dyZWdhdGVzKFxyXG4gICAgYXBwLmhpZXJhcmNoeSxcclxuICAgIGFwcC5kYXRhc3RvcmUsXHJcbiAgICBpbmRleE5vZGUsXHJcbiAgICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXkoaW5kZXhLZXkpLFxyXG4gICk7XHJcbn07XHJcblxyXG5jb25zdCBtZXJnZVNoYXJkQWdncmVnYXRlID0gKHRvdGFscywgc2hhcmQpID0+IHtcclxuICBjb25zdCBtZXJnZUdyb3VwaW5nID0gKHRvdCwgc2hyKSA9PiB7XHJcbiAgICB0b3QuY291bnQgKz0gc2hyLmNvdW50O1xyXG4gICAgZm9yIChjb25zdCBhZ2dOYW1lIGluIHRvdCkge1xyXG4gICAgICBpZiAoYWdnTmFtZSA9PT0gJ2NvdW50JykgY29udGludWU7XHJcbiAgICAgIGNvbnN0IHRvdGFnZyA9IHRvdFthZ2dOYW1lXTtcclxuICAgICAgY29uc3Qgc2hyYWdnID0gc2hyW2FnZ05hbWVdO1xyXG4gICAgICB0b3RhZ2cuc3VtICs9IHNocmFnZy5zdW07XHJcbiAgICAgIHRvdGFnZy5tYXggPSB0b3RhZ2cubWF4ID4gc2hyYWdnLm1heFxyXG4gICAgICAgID8gdG90YWdnLm1heFxyXG4gICAgICAgIDogc2hyYWdnLm1heDtcclxuICAgICAgdG90YWdnLm1pbiA9IHRvdGFnZy5taW4gPCBzaHJhZ2cubWluXHJcbiAgICAgICAgPyB0b3RhZ2cubWluXHJcbiAgICAgICAgOiBzaHJhZ2cubWluO1xyXG4gICAgICB0b3RhZ2cubWVhbiA9IHRvdGFnZy5zdW0gLyB0b3QuY291bnQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG90O1xyXG4gIH07XHJcblxyXG4gIGZvciAoY29uc3QgYWdnR3JvdXBEZWYgaW4gdG90YWxzKSB7XHJcbiAgICBmb3IgKGNvbnN0IGdyb3VwaW5nIGluIHNoYXJkW2FnZ0dyb3VwRGVmXSkge1xyXG4gICAgICBjb25zdCBncm91cGluZ1RvdGFsID0gdG90YWxzW2FnZ0dyb3VwRGVmXVtncm91cGluZ107XHJcbiAgICAgIHRvdGFsc1thZ2dHcm91cERlZl1bZ3JvdXBpbmddID0gaXNVbmRlZmluZWQoZ3JvdXBpbmdUb3RhbClcclxuICAgICAgICA/IHNoYXJkW2FnZ0dyb3VwRGVmXVtncm91cGluZ11cclxuICAgICAgICA6IG1lcmdlR3JvdXBpbmcoXHJcbiAgICAgICAgICB0b3RhbHNbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXSxcclxuICAgICAgICAgIHNoYXJkW2FnZ0dyb3VwRGVmXVtncm91cGluZ10sXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB0b3RhbHM7XHJcbn07XHJcblxyXG5jb25zdCBnZXRBZ2dyZWdhdGVzID0gYXN5bmMgKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXkpID0+IHtcclxuICBjb25zdCBhZ2dyZWdhdGVSZXN1bHQgPSB7fTtcclxuICBjb25zdCBkb1JlYWQgPSBpdGVyYXRlSW5kZXgoXHJcbiAgICAgICAgYXN5bmMgaXRlbSA9PiB7XHJcbiAgICAgIGFwcGx5SXRlbVRvQWdncmVnYXRlUmVzdWx0KFxyXG4gICAgICAgIGluZGV4LCBhZ2dyZWdhdGVSZXN1bHQsIGl0ZW0sXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XHJcbiAgICB9LFxyXG4gICAgICAgIGFzeW5jICgpID0+IGFnZ3JlZ2F0ZVJlc3VsdFxyXG4gICk7XHJcblxyXG4gIHJldHVybiBhd2FpdCBkb1JlYWQoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSk7XHJcbn07XHJcblxyXG5cclxuY29uc3QgYXBwbHlJdGVtVG9BZ2dyZWdhdGVSZXN1bHQgPSAoaW5kZXhOb2RlLCByZXN1bHQsIGl0ZW0pID0+IHtcclxuICBjb25zdCBnZXRJbml0aWFsQWdncmVnYXRlUmVzdWx0ID0gKCkgPT4gKHtcclxuICAgIHN1bTogMCwgbWVhbjogbnVsbCwgbWF4OiBudWxsLCBtaW46IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IGFwcGx5QWdncmVnYXRlUmVzdWx0ID0gKGFnZywgZXhpc3RpbmcsIGNvdW50KSA9PiB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IGNvbXBpbGVDb2RlKGFnZy5hZ2dyZWdhdGVkVmFsdWUpKHsgcmVjb3JkOiBpdGVtIH0pO1xyXG5cclxuICAgIGlmICghaXNOdW1iZXIodmFsdWUpKSByZXR1cm4gZXhpc3Rpbmc7XHJcblxyXG4gICAgZXhpc3Rpbmcuc3VtICs9IHZhbHVlO1xyXG4gICAgZXhpc3RpbmcubWF4ID0gdmFsdWUgPiBleGlzdGluZy5tYXggfHwgZXhpc3RpbmcubWF4ID09PSBudWxsXHJcbiAgICAgID8gdmFsdWVcclxuICAgICAgOiBleGlzdGluZy5tYXg7XHJcbiAgICBleGlzdGluZy5taW4gPSB2YWx1ZSA8IGV4aXN0aW5nLm1pbiB8fCBleGlzdGluZy5taW4gPT09IG51bGxcclxuICAgICAgPyB2YWx1ZVxyXG4gICAgICA6IGV4aXN0aW5nLm1pbjtcclxuICAgIGV4aXN0aW5nLm1lYW4gPSBleGlzdGluZy5zdW0gLyBjb3VudDtcclxuICAgIHJldHVybiBleGlzdGluZztcclxuICB9O1xyXG5cclxuICBmb3IgKGNvbnN0IGFnZ0dyb3VwIG9mIGluZGV4Tm9kZS5hZ2dyZWdhdGVHcm91cHMpIHtcclxuICAgIGlmICghaGFzKGFnZ0dyb3VwLm5hbWUpKHJlc3VsdCkpIHtcclxuICAgICAgcmVzdWx0W2FnZ0dyb3VwLm5hbWVdID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGhpc0dyb3VwUmVzdWx0ID0gcmVzdWx0W2FnZ0dyb3VwLm5hbWVdO1xyXG5cclxuICAgIGlmIChpc05vbkVtcHR5U3RyaW5nKGFnZ0dyb3VwLmNvbmRpdGlvbikpIHtcclxuICAgICAgaWYgKCFjb21waWxlRXhwcmVzc2lvbihhZ2dHcm91cC5jb25kaXRpb24pKHsgcmVjb3JkOiBpdGVtIH0pKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgZ3JvdXAgPSBpc05vbkVtcHR5U3RyaW5nKGFnZ0dyb3VwLmdyb3VwQnkpXHJcbiAgICAgID8gY29tcGlsZUNvZGUoYWdnR3JvdXAuZ3JvdXBCeSkoeyByZWNvcmQ6IGl0ZW0gfSlcclxuICAgICAgOiAnYWxsJztcclxuICAgIGlmICghaXNOb25FbXB0eVN0cmluZyhncm91cCkpIHtcclxuICAgICAgZ3JvdXAgPSAnKG5vbmUpJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWhhcyhncm91cCkodGhpc0dyb3VwUmVzdWx0KSkge1xyXG4gICAgICB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdID0geyBjb3VudDogMCB9O1xyXG4gICAgICBmb3IgKGNvbnN0IGFnZyBvZiBhZ2dHcm91cC5hZ2dyZWdhdGVzKSB7XHJcbiAgICAgICAgdGhpc0dyb3VwUmVzdWx0W2dyb3VwXVthZ2cubmFtZV0gPSBnZXRJbml0aWFsQWdncmVnYXRlUmVzdWx0KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdLmNvdW50Kys7XHJcblxyXG4gICAgZm9yIChjb25zdCBhZ2cgb2YgYWdnR3JvdXAuYWdncmVnYXRlcykge1xyXG4gICAgICBjb25zdCBleGlzdGluZ1ZhbHVlcyA9IHRoaXNHcm91cFJlc3VsdFtncm91cF1bYWdnLm5hbWVdO1xyXG4gICAgICB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdW2FnZy5uYW1lXSA9IGFwcGx5QWdncmVnYXRlUmVzdWx0KFxyXG4gICAgICAgIGFnZywgZXhpc3RpbmdWYWx1ZXMsXHJcbiAgICAgICAgdGhpc0dyb3VwUmVzdWx0W2dyb3VwXS5jb3VudCxcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcbiIsImltcG9ydCB7IGJ1aWxkSW5kZXggfSBmcm9tICcuL2J1aWxkSW5kZXgnO1xyXG5pbXBvcnQgeyBsaXN0SXRlbXMgfSBmcm9tICcuL2xpc3RJdGVtcyc7XHJcbmltcG9ydCB7IGFnZ3JlZ2F0ZXMgfSBmcm9tICcuL2FnZ3JlZ2F0ZXMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEluZGV4QXBpID0gYXBwID0+ICh7XHJcbiAgbGlzdEl0ZW1zOiBsaXN0SXRlbXMoYXBwKSxcclxuICBidWlsZEluZGV4OiBidWlsZEluZGV4KGFwcCksXHJcbiAgYWdncmVnYXRlczogYWdncmVnYXRlcyhhcHApLFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldEluZGV4QXBpO1xyXG4iLCJpbXBvcnQgeyBlYWNoLCBjb25zdGFudCwgZmluZCB9IGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IG1hcCwgbWF4IH0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHtcclxuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgam9pbktleSxcclxuICAkLCBpc05vdGhpbmcsIGlzU29tZXRoaW5nLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7XHJcbiAgaXNJbmRleCwgaXNSb290LCBpc1NpbmdsZVJlY29yZCwgaXNDb2xsZWN0aW9uUmVjb3JkLFxyXG4gIGlzUmVjb3JkLCBpc2FnZ3JlZ2F0ZUdyb3VwLFxyXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcclxufSBmcm9tICcuL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7IGFsbCB9IGZyb20gJy4uL3R5cGVzJztcclxuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XHJcblxyXG5leHBvcnQgY29uc3QgY3JlYXRlTm9kZUVycm9ycyA9IHtcclxuICBpbmRleENhbm5vdEJlUGFyZW50OiAnSW5kZXggdGVtcGxhdGUgY2Fubm90IGJlIGEgcGFyZW50JyxcclxuICBhbGxOb25Sb290Tm9kZXNNdXN0SGF2ZVBhcmVudDogJ09ubHkgdGhlIHJvb3Qgbm9kZSBtYXkgaGF2ZSBubyBwYXJlbnQnLFxyXG4gIGluZGV4UGFyZW50TXVzdEJlUmVjb3JkT3JSb290OiAnQW4gaW5kZXggbWF5IG9ubHkgaGF2ZSBhIHJlY29yZCBvciByb290IGFzIGEgcGFyZW50JyxcclxuICBhZ2dyZWdhdGVQYXJlbnRNdXN0QmVBbkluZGV4OiAnYWdncmVnYXRlR3JvdXAgcGFyZW50IG11c3QgYmUgYW4gaW5kZXgnLFxyXG59O1xyXG5cclxuY29uc3QgcGF0aFJlZ3hNYWtlciA9IG5vZGUgPT4gKCkgPT4gbm9kZS5ub2RlS2V5KCkucmVwbGFjZSgve2lkfS9nLCAnW2EtekEtWjAtOV8tXSsnKTtcclxuXHJcbmNvbnN0IG5vZGVLZXlNYWtlciA9IG5vZGUgPT4gKCkgPT4gc3dpdGNoQ2FzZShcclxuXHJcbiAgW24gPT4gaXNSZWNvcmQobikgJiYgIWlzU2luZ2xlUmVjb3JkKG4pLFxyXG4gICAgbiA9PiBqb2luS2V5KFxyXG4gICAgICBub2RlLnBhcmVudCgpLm5vZGVLZXkoKSxcclxuICAgICAgbm9kZS5jb2xsZWN0aW9uTmFtZSxcclxuICAgICAgYCR7bi5ub2RlSWR9LXtpZH1gLFxyXG4gICAgKV0sXHJcblxyXG4gIFtpc1Jvb3QsXHJcbiAgICBjb25zdGFudCgnLycpXSxcclxuXHJcbiAgW2RlZmF1bHRDYXNlLFxyXG4gICAgbiA9PiBqb2luS2V5KG5vZGUucGFyZW50KCkubm9kZUtleSgpLCBuLm5hbWUpXSxcclxuXHJcbikobm9kZSk7XHJcblxyXG5cclxuY29uc3QgdmFsaWRhdGUgPSBwYXJlbnQgPT4gKG5vZGUpID0+IHtcclxuICBpZiAoaXNJbmRleChub2RlKVxyXG4gICAgICAgICYmIGlzU29tZXRoaW5nKHBhcmVudClcclxuICAgICAgICAmJiAhaXNSb290KHBhcmVudClcclxuICAgICAgICAmJiAhaXNSZWNvcmQocGFyZW50KSkge1xyXG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihjcmVhdGVOb2RlRXJyb3JzLmluZGV4UGFyZW50TXVzdEJlUmVjb3JkT3JSb290KTtcclxuICB9XHJcblxyXG4gIGlmIChpc2FnZ3JlZ2F0ZUdyb3VwKG5vZGUpXHJcbiAgICAgICAgJiYgaXNTb21ldGhpbmcocGFyZW50KVxyXG4gICAgICAgICYmICFpc0luZGV4KHBhcmVudCkpIHtcclxuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoY3JlYXRlTm9kZUVycm9ycy5hZ2dyZWdhdGVQYXJlbnRNdXN0QmVBbkluZGV4KTtcclxuICB9XHJcblxyXG4gIGlmIChpc05vdGhpbmcocGFyZW50KSAmJiAhaXNSb290KG5vZGUpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoY3JlYXRlTm9kZUVycm9ycy5hbGxOb25Sb290Tm9kZXNNdXN0SGF2ZVBhcmVudCk7IH1cclxuXHJcbiAgcmV0dXJuIG5vZGU7XHJcbn07XHJcblxyXG5jb25zdCBjb25zdHJ1Y3QgPSBwYXJlbnQgPT4gKG5vZGUpID0+IHtcclxuICBub2RlLm5vZGVLZXkgPSBub2RlS2V5TWFrZXIobm9kZSk7XHJcbiAgbm9kZS5wYXRoUmVneCA9IHBhdGhSZWd4TWFrZXIobm9kZSk7XHJcbiAgbm9kZS5wYXJlbnQgPSBjb25zdGFudChwYXJlbnQpO1xyXG4gIG5vZGUuaXNSb290ID0gKCkgPT4gaXNOb3RoaW5nKHBhcmVudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgbm9kZS5uYW1lID09PSAncm9vdCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgbm9kZS50eXBlID09PSAncm9vdCc7XHJcbiAgaWYgKGlzQ29sbGVjdGlvblJlY29yZChub2RlKSkge1xyXG4gICAgbm9kZS5jb2xsZWN0aW9uTm9kZUtleSA9ICgpID0+IGpvaW5LZXkoXHJcbiAgICAgIHBhcmVudC5ub2RlS2V5KCksIG5vZGUuY29sbGVjdGlvbk5hbWUsXHJcbiAgICApO1xyXG4gICAgbm9kZS5jb2xsZWN0aW9uUGF0aFJlZ3ggPSAoKSA9PiBqb2luS2V5KFxyXG4gICAgICBwYXJlbnQucGF0aFJlZ3goKSwgbm9kZS5jb2xsZWN0aW9uTmFtZSxcclxuICAgICk7XHJcbiAgfVxyXG4gIHJldHVybiBub2RlO1xyXG59O1xyXG5cclxuY29uc3QgYWRkVG9QYXJlbnQgPSAob2JqKSA9PiB7XHJcbiAgY29uc3QgcGFyZW50ID0gb2JqLnBhcmVudCgpO1xyXG4gIGlmIChpc1NvbWV0aGluZyhwYXJlbnQpKSB7XHJcbiAgICBpZiAoaXNJbmRleChvYmopKVxyXG4gICAgLy8gUTogd2h5IGFyZSBpbmRleGVzIG5vdCBjaGlsZHJlbiA/XHJcbiAgICAvLyBBOiBiZWNhdXNlIHRoZXkgY2Fubm90IGhhdmUgY2hpbGRyZW4gb2YgdGhlaXIgb3duLlxyXG4gICAgeyBwYXJlbnQuaW5kZXhlcy5wdXNoKG9iaik7IH0gZWxzZSBpZiAoaXNhZ2dyZWdhdGVHcm91cChvYmopKSB7IHBhcmVudC5hZ2dyZWdhdGVHcm91cHMucHVzaChvYmopOyB9IGVsc2UgeyBwYXJlbnQuY2hpbGRyZW4ucHVzaChvYmopOyB9XHJcblxyXG4gICAgaWYgKGlzUmVjb3JkKG9iaikpIHtcclxuICAgICAgY29uc3QgZGVmYXVsdEluZGV4ID0gZmluZChcclxuICAgICAgICBwYXJlbnQuaW5kZXhlcyxcclxuICAgICAgICBpID0+IGkubmFtZSA9PT0gYCR7cGFyZW50Lm5hbWV9X2luZGV4YCxcclxuICAgICAgKTtcclxuICAgICAgaWYgKGRlZmF1bHRJbmRleCkge1xyXG4gICAgICAgIGRlZmF1bHRJbmRleC5hbGxvd2VkUmVjb3JkTm9kZUlkcy5wdXNoKG9iai5ub2RlSWQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBvYmo7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgY29uc3RydWN0Tm9kZSA9IChwYXJlbnQsIG9iaikgPT4gJChvYmosIFtcclxuICBjb25zdHJ1Y3QocGFyZW50KSxcclxuICB2YWxpZGF0ZShwYXJlbnQpLFxyXG4gIGFkZFRvUGFyZW50LFxyXG5dKTtcclxuXHJcbmNvbnN0IGdldE5vZGVJZCA9IChwYXJlbnROb2RlKSA9PiB7XHJcbiAgLy8gdGhpcyBjYXNlIGlzIGhhbmRsZWQgYmV0dGVyIGVsc2V3aGVyZVxyXG4gIGlmICghcGFyZW50Tm9kZSkgcmV0dXJuIG51bGw7XHJcbiAgY29uc3QgZmluZFJvb3QgPSBuID0+IChpc1Jvb3QobikgPyBuIDogZmluZFJvb3Qobi5wYXJlbnQoKSkpO1xyXG4gIGNvbnN0IHJvb3QgPSBmaW5kUm9vdChwYXJlbnROb2RlKTtcclxuXHJcbiAgcmV0dXJuICgkKHJvb3QsIFtcclxuICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcclxuICAgIG1hcChuID0+IG4ubm9kZUlkKSxcclxuICAgIG1heF0pICsgMSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgY29uc3RydWN0SGllcmFyY2h5ID0gKG5vZGUsIHBhcmVudCkgPT4ge1xyXG4gIGNvbnN0cnVjdChwYXJlbnQpKG5vZGUpO1xyXG4gIGlmIChub2RlLmluZGV4ZXMpIHtcclxuICAgIGVhY2gobm9kZS5pbmRleGVzLFxyXG4gICAgICBjaGlsZCA9PiBjb25zdHJ1Y3RIaWVyYXJjaHkoY2hpbGQsIG5vZGUpKTtcclxuICB9XHJcbiAgaWYgKG5vZGUuYWdncmVnYXRlR3JvdXBzKSB7XHJcbiAgICBlYWNoKG5vZGUuYWdncmVnYXRlR3JvdXBzLFxyXG4gICAgICBjaGlsZCA9PiBjb25zdHJ1Y3RIaWVyYXJjaHkoY2hpbGQsIG5vZGUpKTtcclxuICB9XHJcbiAgaWYgKG5vZGUuY2hpbGRyZW4gJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICBlYWNoKG5vZGUuY2hpbGRyZW4sXHJcbiAgICAgIGNoaWxkID0+IGNvbnN0cnVjdEhpZXJhcmNoeShjaGlsZCwgbm9kZSkpO1xyXG4gIH1cclxuICBpZiAobm9kZS5maWVsZHMpIHtcclxuICAgIGVhY2gobm9kZS5maWVsZHMsXHJcbiAgICAgIGYgPT4gZWFjaChmLnR5cGVPcHRpb25zLCAodmFsLCBrZXkpID0+IHtcclxuICAgICAgICBjb25zdCBkZWYgPSBhbGxbZi50eXBlXS5vcHRpb25EZWZpbml0aW9uc1trZXldO1xyXG4gICAgICAgIGlmICghZGVmKSB7XHJcbiAgICAgICAgICAvLyB1bmtub3duIHR5cGVPcHRpb25cclxuICAgICAgICAgIGRlbGV0ZSBmLnR5cGVPcHRpb25zW2tleV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGYudHlwZU9wdGlvbnNba2V5XSA9IGRlZi5wYXJzZSh2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSkpO1xyXG4gIH1cclxuICByZXR1cm4gbm9kZTtcclxufTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TmV3Um9vdExldmVsID0gKCkgPT4gY29uc3RydWN0KCkoe1xyXG4gIG5hbWU6ICdyb290JyxcclxuICB0eXBlOiAncm9vdCcsXHJcbiAgY2hpbGRyZW46IFtdLFxyXG4gIHBhdGhNYXBzOiBbXSxcclxuICBpbmRleGVzOiBbXSxcclxuICBub2RlSWQ6IDAsXHJcbn0pO1xyXG5cclxuY29uc3QgX2dldE5ld1JlY29yZFRlbXBsYXRlID0gKHBhcmVudCwgbmFtZSwgY3JlYXRlRGVmYXVsdEluZGV4LCBpc1NpbmdsZSkgPT4ge1xyXG4gIGNvbnN0IG5vZGUgPSBjb25zdHJ1Y3ROb2RlKHBhcmVudCwge1xyXG4gICAgbmFtZSxcclxuICAgIHR5cGU6ICdyZWNvcmQnLFxyXG4gICAgZmllbGRzOiBbXSxcclxuICAgIGNoaWxkcmVuOiBbXSxcclxuICAgIHZhbGlkYXRpb25SdWxlczogW10sXHJcbiAgICBub2RlSWQ6IGdldE5vZGVJZChwYXJlbnQpLFxyXG4gICAgaW5kZXhlczogW10sXHJcbiAgICBhbGxpZHNTaGFyZEZhY3RvcjogaXNSZWNvcmQocGFyZW50KSA/IDEgOiA2NCxcclxuICAgIGNvbGxlY3Rpb25OYW1lOiAnJyxcclxuICAgIGlzU2luZ2xlLFxyXG4gIH0pO1xyXG5cclxuICBpZiAoY3JlYXRlRGVmYXVsdEluZGV4KSB7XHJcbiAgICBjb25zdCBkZWZhdWx0SW5kZXggPSBnZXROZXdJbmRleFRlbXBsYXRlKHBhcmVudCk7XHJcbiAgICBkZWZhdWx0SW5kZXgubmFtZSA9IGAke25hbWV9X2luZGV4YDtcclxuICAgIGRlZmF1bHRJbmRleC5hbGxvd2VkUmVjb3JkTm9kZUlkcy5wdXNoKG5vZGUubm9kZUlkKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBub2RlO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldE5ld1JlY29yZFRlbXBsYXRlID0gKHBhcmVudCwgbmFtZSA9ICcnLCBjcmVhdGVEZWZhdWx0SW5kZXggPSB0cnVlKSA9PiBfZ2V0TmV3UmVjb3JkVGVtcGxhdGUocGFyZW50LCBuYW1lLCBjcmVhdGVEZWZhdWx0SW5kZXgsIGZhbHNlKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXROZXdTaW5nbGVSZWNvcmRUZW1wbGF0ZSA9IHBhcmVudCA9PiBfZ2V0TmV3UmVjb3JkVGVtcGxhdGUocGFyZW50LCAnJywgZmFsc2UsIHRydWUpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldE5ld0luZGV4VGVtcGxhdGUgPSAocGFyZW50LCB0eXBlID0gJ2FuY2VzdG9yJykgPT4gY29uc3RydWN0Tm9kZShwYXJlbnQsIHtcclxuICBuYW1lOiAnJyxcclxuICB0eXBlOiAnaW5kZXgnLFxyXG4gIG1hcDogJ3JldHVybiB7Li4ucmVjb3JkfTsnLFxyXG4gIGZpbHRlcjogJycsXHJcbiAgaW5kZXhUeXBlOiB0eXBlLFxyXG4gIGdldFNoYXJkTmFtZTogJycsXHJcbiAgZ2V0U29ydEtleTogJ3JlY29yZC5pZCcsXHJcbiAgYWdncmVnYXRlR3JvdXBzOiBbXSxcclxuICBhbGxvd2VkUmVjb3JkTm9kZUlkczogW10sXHJcbiAgbm9kZUlkOiBnZXROb2RlSWQocGFyZW50KSxcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TmV3QWdncmVnYXRlR3JvdXBUZW1wbGF0ZSA9IGluZGV4ID0+IGNvbnN0cnVjdE5vZGUoaW5kZXgsIHtcclxuICBuYW1lOiAnJyxcclxuICB0eXBlOiAnYWdncmVnYXRlR3JvdXAnLFxyXG4gIGdyb3VwQnk6ICcnLFxyXG4gIGFnZ3JlZ2F0ZXM6IFtdLFxyXG4gIGNvbmRpdGlvbjogJycsXHJcbiAgbm9kZUlkOiBnZXROb2RlSWQoaW5kZXgpLFxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXROZXdBZ2dyZWdhdGVUZW1wbGF0ZSA9IChzZXQpID0+IHtcclxuICBjb25zdCBhZ2dyZWdhdGVkVmFsdWUgPSB7XHJcbiAgICBuYW1lOiAnJyxcclxuICAgIGFnZ3JlZ2F0ZWRWYWx1ZTogJycsXHJcbiAgfTtcclxuICBzZXQuYWdncmVnYXRlcy5wdXNoKGFnZ3JlZ2F0ZWRWYWx1ZSk7XHJcbiAgcmV0dXJuIGFnZ3JlZ2F0ZWRWYWx1ZTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBnZXROZXdSb290TGV2ZWwsXHJcbiAgZ2V0TmV3UmVjb3JkVGVtcGxhdGUsXHJcbiAgZ2V0TmV3SW5kZXhUZW1wbGF0ZSxcclxuICBjcmVhdGVOb2RlRXJyb3JzLFxyXG4gIGNvbnN0cnVjdEhpZXJhcmNoeSxcclxuICBnZXROZXdBZ2dyZWdhdGVHcm91cFRlbXBsYXRlLFxyXG4gIGdldE5ld0FnZ3JlZ2F0ZVRlbXBsYXRlLFxyXG59O1xyXG4iLCJpbXBvcnQge1xyXG4gIHNvbWUsIG1hcCwgZmlsdGVyLCBrZXlzLCBpbmNsdWRlcyxcclxuICBjb3VudEJ5LCBmbGF0dGVuLFxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7XHJcbiAgaXNTb21ldGhpbmcsICQsXHJcbiAgaXNOb25FbXB0eVN0cmluZyxcclxuICBpc05vdGhpbmdPckVtcHR5LFxyXG4gIGlzTm90aGluZyxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBhbGwsIGdldERlZmF1bHRPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xyXG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcclxuXHJcbmV4cG9ydCBjb25zdCBmaWVsZEVycm9ycyA9IHtcclxuICBBZGRGaWVsZFZhbGlkYXRpb25GYWlsZWQ6ICdBZGQgZmllbGQgdmFsaWRhdGlvbjogJyxcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBhbGxvd2VkVHlwZXMgPSAoKSA9PiBrZXlzKGFsbCk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TmV3RmllbGQgPSB0eXBlID0+ICh7XHJcbiAgbmFtZTogJycsIC8vIGhvdyBmaWVsZCBpcyByZWZlcmVuY2VkIGludGVybmFsbHlcclxuICB0eXBlLFxyXG4gIHR5cGVPcHRpb25zOiBnZXREZWZhdWx0T3B0aW9ucyh0eXBlKSxcclxuICBsYWJlbDogJycsIC8vIGhvdyBmaWVsZCBpcyBkaXNwbGF5ZWRcclxuICBnZXRJbml0aWFsVmFsdWU6ICdkZWZhdWx0JywgLy8gZnVuY3Rpb24gdGhhdCBnZXRzIHZhbHVlIHdoZW4gaW5pdGlhbGx5IGNyZWF0ZWRcclxuICBnZXRVbmRlZmluZWRWYWx1ZTogJ2RlZmF1bHQnLCAvLyBmdW5jdGlvbiB0aGF0IGdldHMgdmFsdWUgd2hlbiBmaWVsZCB1bmRlZmluZWQgb24gcmVjb3JkXHJcbn0pO1xyXG5cclxuY29uc3QgZmllbGRSdWxlcyA9IGFsbEZpZWxkcyA9PiBbXHJcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnZmllbGQgbmFtZSBpcyBub3Qgc2V0JyxcclxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLm5hbWUpKSxcclxuICBtYWtlcnVsZSgndHlwZScsICdmaWVsZCB0eXBlIGlzIG5vdCBzZXQnLFxyXG4gICAgZiA9PiBpc05vbkVtcHR5U3RyaW5nKGYudHlwZSkpLFxyXG4gIG1ha2VydWxlKCdsYWJlbCcsICdmaWVsZCBsYWJlbCBpcyBub3Qgc2V0JyxcclxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLmxhYmVsKSksXHJcbiAgbWFrZXJ1bGUoJ2dldEluaXRpYWxWYWx1ZScsICdnZXRJbml0aWFsVmFsdWUgZnVuY3Rpb24gaXMgbm90IHNldCcsXHJcbiAgICBmID0+IGlzTm9uRW1wdHlTdHJpbmcoZi5nZXRJbml0aWFsVmFsdWUpKSxcclxuICBtYWtlcnVsZSgnZ2V0VW5kZWZpbmVkVmFsdWUnLCAnZ2V0VW5kZWZpbmVkVmFsdWUgZnVuY3Rpb24gaXMgbm90IHNldCcsXHJcbiAgICBmID0+IGlzTm9uRW1wdHlTdHJpbmcoZi5nZXRVbmRlZmluZWRWYWx1ZSkpLFxyXG4gIG1ha2VydWxlKCduYW1lJywgJ2ZpZWxkIG5hbWUgaXMgZHVwbGljYXRlZCcsXHJcbiAgICBmID0+IGlzTm90aGluZ09yRW1wdHkoZi5uYW1lKVxyXG4gICAgICAgICAgICAgfHwgY291bnRCeSgnbmFtZScpKGFsbEZpZWxkcylbZi5uYW1lXSA9PT0gMSksXHJcbiAgbWFrZXJ1bGUoJ3R5cGUnLCAndHlwZSBpcyB1bmtub3duJyxcclxuICAgIGYgPT4gaXNOb3RoaW5nT3JFbXB0eShmLnR5cGUpXHJcbiAgICAgICAgICAgICB8fCBzb21lKHQgPT4gZi50eXBlID09PSB0KShhbGxvd2VkVHlwZXMoKSkpLFxyXG5dO1xyXG5cclxuY29uc3QgdHlwZU9wdGlvbnNSdWxlcyA9IChmaWVsZCkgPT4ge1xyXG4gIGNvbnN0IHR5cGUgPSBhbGxbZmllbGQudHlwZV07XHJcbiAgaWYgKGlzTm90aGluZyh0eXBlKSkgcmV0dXJuIFtdO1xyXG5cclxuICBjb25zdCBkZWYgPSBvcHROYW1lID0+IHR5cGUub3B0aW9uRGVmaW5pdGlvbnNbb3B0TmFtZV07XHJcblxyXG4gIHJldHVybiAkKGZpZWxkLnR5cGVPcHRpb25zLCBbXHJcbiAgICBrZXlzLFxyXG4gICAgZmlsdGVyKG8gPT4gaXNTb21ldGhpbmcoZGVmKG8pKVxyXG4gICAgICAgICAgICAgICAgICAgICYmIGlzU29tZXRoaW5nKGRlZihvKS5pc1ZhbGlkKSksXHJcbiAgICBtYXAobyA9PiBtYWtlcnVsZShcclxuICAgICAgYHR5cGVPcHRpb25zLiR7b31gLFxyXG4gICAgICBgJHtkZWYobykucmVxdWlyZW1lbnREZXNjcmlwdGlvbn1gLFxyXG4gICAgICBmaWVsZCA9PiBkZWYobykuaXNWYWxpZChmaWVsZC50eXBlT3B0aW9uc1tvXSksXHJcbiAgICApKSxcclxuICBdKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUZpZWxkID0gYWxsRmllbGRzID0+IChmaWVsZCkgPT4ge1xyXG4gIGNvbnN0IGV2ZXJ5U2luZ2xlRmllbGQgPSBpbmNsdWRlcyhmaWVsZCkoYWxsRmllbGRzKSA/IGFsbEZpZWxkcyA6IFsuLi5hbGxGaWVsZHMsIGZpZWxkXTtcclxuICByZXR1cm4gYXBwbHlSdWxlU2V0KFsuLi5maWVsZFJ1bGVzKGV2ZXJ5U2luZ2xlRmllbGQpLCAuLi50eXBlT3B0aW9uc1J1bGVzKGZpZWxkKV0pKGZpZWxkKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFsbEZpZWxkcyA9IHJlY29yZE5vZGUgPT4gJChyZWNvcmROb2RlLmZpZWxkcywgW1xyXG4gIG1hcCh2YWxpZGF0ZUZpZWxkKHJlY29yZE5vZGUuZmllbGRzKSksXHJcbiAgZmxhdHRlbixcclxuXSk7XHJcblxyXG5leHBvcnQgY29uc3QgYWRkRmllbGQgPSAocmVjb3JkVGVtcGxhdGUsIGZpZWxkKSA9PiB7XHJcbiAgaWYgKGlzTm90aGluZ09yRW1wdHkoZmllbGQubGFiZWwpKSB7XHJcbiAgICBmaWVsZC5sYWJlbCA9IGZpZWxkLm5hbWU7XHJcbiAgfVxyXG4gIGNvbnN0IHZhbGlkYXRpb25NZXNzYWdlcyA9IHZhbGlkYXRlRmllbGQoWy4uLnJlY29yZFRlbXBsYXRlLmZpZWxkcywgZmllbGRdKShmaWVsZCk7XHJcbiAgaWYgKHZhbGlkYXRpb25NZXNzYWdlcy5sZW5ndGggPiAwKSB7XHJcbiAgICBjb25zdCBlcnJvcnMgPSBtYXAobSA9PiBtLmVycm9yKSh2YWxpZGF0aW9uTWVzc2FnZXMpO1xyXG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgJHtmaWVsZEVycm9ycy5BZGRGaWVsZFZhbGlkYXRpb25GYWlsZWR9ICR7ZXJyb3JzLmpvaW4oJywgJyl9YCk7XHJcbiAgfVxyXG4gIHJlY29yZFRlbXBsYXRlLmZpZWxkcy5wdXNoKGZpZWxkKTtcclxufTtcclxuIiwiaW1wb3J0IHsgaXNOdW1iZXIsIGlzQm9vbGVhbiwgZGVmYXVsdENhc2UgfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBzd2l0Y2hDYXNlIH0gZnJvbSAnLi4vY29tbW9uJztcclxuXHJcbmV4cG9ydCBjb25zdCBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZSA9IChpbnZhbGlkRmllbGRzLFxyXG4gIG1lc3NhZ2VXaGVuSW52YWxpZCxcclxuICBleHByZXNzaW9uV2hlblZhbGlkKSA9PiAoe1xyXG4gIGludmFsaWRGaWVsZHMsIG1lc3NhZ2VXaGVuSW52YWxpZCwgZXhwcmVzc2lvbldoZW5WYWxpZCxcclxufSk7XHJcblxyXG5jb25zdCBnZXRTdGF0aWNWYWx1ZSA9IHN3aXRjaENhc2UoXHJcbiAgW2lzTnVtYmVyLCB2ID0+IHYudG9TdHJpbmcoKV0sXHJcbiAgW2lzQm9vbGVhbiwgdiA9PiB2LnRvU3RyaW5nKCldLFxyXG4gIFtkZWZhdWx0Q2FzZSwgdiA9PiBgJyR7dn0nYF0sXHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgY29tbW9uUmVjb3JkVmFsaWRhdGlvblJ1bGVzID0gKHtcclxuXHJcbiAgZmllbGROb3RFbXB0eTogZmllbGROYW1lID0+IGdldE5ld1JlY29yZFZhbGlkYXRpb25SdWxlKFxyXG4gICAgW2ZpZWxkTmFtZV0sXHJcbiAgICBgJHtmaWVsZE5hbWV9IGlzIGVtcHR5YCxcclxuICAgIGAhXy5pc0VtcHR5KHJlY29yZFsnJHtmaWVsZE5hbWV9J10pYCxcclxuICApLFxyXG5cclxuICBmaWVsZEJldHdlZW46IChmaWVsZE5hbWUsIG1pbiwgbWF4KSA9PiBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZShcclxuICAgIFtmaWVsZE5hbWVdLFxyXG4gICAgYCR7ZmllbGROYW1lfSBtdXN0IGJlIGJldHdlZW4gJHttaW4udG9TdHJpbmcoKX0gYW5kICR7bWF4LnRvU3RyaW5nKCl9YCxcclxuICAgIGByZWNvcmRbJyR7ZmllbGROYW1lfSddID49ICR7Z2V0U3RhdGljVmFsdWUobWluKX0gJiYgIHJlY29yZFsnJHtmaWVsZE5hbWV9J10gPD0gJHtnZXRTdGF0aWNWYWx1ZShtYXgpfSBgLFxyXG4gICksXHJcblxyXG4gIGZpZWxkR3JlYXRlclRoYW46IChmaWVsZE5hbWUsIG1pbiwgbWF4KSA9PiBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZShcclxuICAgIFtmaWVsZE5hbWVdLFxyXG4gICAgYCR7ZmllbGROYW1lfSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAke21pbi50b1N0cmluZygpfSBhbmQgJHttYXgudG9TdHJpbmcoKX1gLFxyXG4gICAgYHJlY29yZFsnJHtmaWVsZE5hbWV9J10gPj0gJHtnZXRTdGF0aWNWYWx1ZShtaW4pfSAgYCxcclxuICApLFxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBhZGRSZWNvcmRWYWxpZGF0aW9uUnVsZSA9IHJlY29yZE5vZGUgPT4gcnVsZSA9PiByZWNvcmROb2RlLnZhbGlkYXRpb25SdWxlcy5wdXNoKHJ1bGUpO1xyXG4iLCJcclxuZXhwb3J0IGNvbnN0IGNyZWF0ZVRyaWdnZXIgPSAoKSA9PiAoe1xyXG4gIGFjdGlvbk5hbWU6ICcnLFxyXG4gIGV2ZW50TmFtZTogJycsXHJcbiAgLy8gZnVuY3Rpb24sIGhhcyBhY2Nlc3MgdG8gZXZlbnQgY29udGV4dCxcclxuICAvLyByZXR1cm5zIG9iamVjdCB0aGF0IGlzIHVzZWQgYXMgcGFyYW1ldGVyIHRvIGFjdGlvblxyXG4gIC8vIG9ubHkgdXNlZCBpZiB0cmlnZ2VyZWQgYnkgZXZlbnRcclxuICBvcHRpb25zQ3JlYXRvcjogJycsXHJcbiAgLy8gYWN0aW9uIHJ1bnMgaWYgdHJ1ZSxcclxuICAvLyBoYXMgYWNjZXNzIHRvIGV2ZW50IGNvbnRleHRcclxuICBjb25kaXRpb246ICcnLFxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVBY3Rpb24gPSAoKSA9PiAoe1xyXG4gIG5hbWU6ICcnLFxyXG4gIGJlaGF2aW91clNvdXJjZTogJycsXHJcbiAgLy8gbmFtZSBvZiBmdW5jdGlvbiBpbiBhY3Rpb25Tb3VyY2VcclxuICBiZWhhdmlvdXJOYW1lOiAnJyxcclxuICAvLyBwYXJhbWV0ZXIgcGFzc2VkIGludG8gYmVoYXZpb3VyLlxyXG4gIC8vIGFueSBvdGhlciBwYXJtcyBwYXNzZWQgYXQgcnVudGltZSBlLmcuXHJcbiAgLy8gYnkgdHJpZ2dlciwgb3IgbWFudWFsbHksIHdpbGwgYmUgbWVyZ2VkIGludG8gdGhpc1xyXG4gIGluaXRpYWxPcHRpb25zOiB7fSxcclxufSk7XHJcbiIsImltcG9ydCB7IGZsYXR0ZW4sIG1hcCB9IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IGlzRW1wdHkgfSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcclxuaW1wb3J0IHtcclxuICBpc05vbkVtcHR5U3RyaW5nLCBcclxuICBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24sICQsIFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IGFwcGx5UnVsZVNldCwgbWFrZXJ1bGUgfSBmcm9tICcuLi9jb21tb24vdmFsaWRhdGlvbkNvbW1vbic7XHJcblxyXG5jb25zdCBhZ2dyZWdhdGVSdWxlcyA9IFtcclxuICBtYWtlcnVsZSgnbmFtZScsICdjaG9vc2UgYSBuYW1lIGZvciB0aGUgYWdncmVnYXRlJyxcclxuICAgIGEgPT4gaXNOb25FbXB0eVN0cmluZyhhLm5hbWUpKSxcclxuICBtYWtlcnVsZSgnYWdncmVnYXRlZFZhbHVlJywgJ2FnZ3JlZ2F0ZWRWYWx1ZSBkb2VzIG5vdCBjb21waWxlJyxcclxuICAgIGEgPT4gaXNFbXB0eShhLmFnZ3JlZ2F0ZWRWYWx1ZSlcclxuICAgICAgICAgICAgfHwgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uKFxyXG4gICAgICAgICAgICAgICgpID0+IGNvbXBpbGVDb2RlKGEuYWdncmVnYXRlZFZhbHVlKSxcclxuICAgICAgICAgICAgKSksXHJcbl07XHJcblxyXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBZ2dyZWdhdGUgPSBhZ2dyZWdhdGUgPT4gYXBwbHlSdWxlU2V0KGFnZ3JlZ2F0ZVJ1bGVzKShhZ2dyZWdhdGUpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWxsQWdncmVnYXRlcyA9IGFsbCA9PiAkKGFsbCwgW1xyXG4gIG1hcCh2YWxpZGF0ZUFnZ3JlZ2F0ZSksXHJcbiAgZmxhdHRlbixcclxuXSk7XHJcbiIsImltcG9ydCB7XHJcbiAgZmlsdGVyLCB1bmlvbiwgY29uc3RhbnQsXHJcbiAgbWFwLCBmbGF0dGVuLCBldmVyeSwgdW5pcUJ5LFxyXG4gIHNvbWUsIGluY2x1ZGVzLCBpc0VtcHR5LFxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IGhhcyB9IGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcclxuaW1wb3J0IHtcclxuICAkLCBpc1NvbWV0aGluZywgc3dpdGNoQ2FzZSxcclxuICBhbnlUcnVlLCBpc05vbkVtcHR5QXJyYXksIGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbixcclxuICBpc05vbkVtcHR5U3RyaW5nLCBkZWZhdWx0Q2FzZSxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQge1xyXG4gIGlzUmVjb3JkLCBpc1Jvb3QsIGlzYWdncmVnYXRlR3JvdXAsXHJcbiAgaXNJbmRleCwgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxyXG59IGZyb20gJy4vaGllcmFyY2h5JztcclxuaW1wb3J0IHsgZXZlbnRzTGlzdCB9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xyXG5pbXBvcnQgeyB2YWxpZGF0ZUFsbEZpZWxkcyB9IGZyb20gJy4vZmllbGRzJztcclxuaW1wb3J0IHtcclxuICBhcHBseVJ1bGVTZXQsIG1ha2VydWxlLCBzdHJpbmdOb3RFbXB0eSxcclxuICB2YWxpZGF0aW9uRXJyb3IsXHJcbn0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xyXG5pbXBvcnQgeyBpbmRleFJ1bGVTZXQgfSBmcm9tICcuL2luZGV4ZXMnO1xyXG5pbXBvcnQgeyB2YWxpZGF0ZUFsbEFnZ3JlZ2F0ZXMgfSBmcm9tICcuL3ZhbGlkYXRlQWdncmVnYXRlJztcclxuXHJcbmV4cG9ydCBjb25zdCBydWxlU2V0ID0gKC4uLnNldHMpID0+IGNvbnN0YW50KGZsYXR0ZW4oWy4uLnNldHNdKSk7XHJcblxyXG5jb25zdCBjb21tb25SdWxlcyA9IFtcclxuICBtYWtlcnVsZSgnbmFtZScsICdub2RlIG5hbWUgaXMgbm90IHNldCcsXHJcbiAgICBub2RlID0+IHN0cmluZ05vdEVtcHR5KG5vZGUubmFtZSkpLFxyXG4gIG1ha2VydWxlKCd0eXBlJywgJ25vZGUgdHlwZSBub3QgcmVjb2duaXNlZCcsXHJcbiAgICBhbnlUcnVlKGlzUmVjb3JkLCBpc1Jvb3QsIGlzSW5kZXgsIGlzYWdncmVnYXRlR3JvdXApKSxcclxuXTtcclxuXHJcbmNvbnN0IHJlY29yZFJ1bGVzID0gW1xyXG4gIG1ha2VydWxlKCdmaWVsZHMnLCAnbm8gZmllbGRzIGhhdmUgYmVlbiBhZGRlZCB0byB0aGUgcmVjb3JkJyxcclxuICAgIG5vZGUgPT4gaXNOb25FbXB0eUFycmF5KG5vZGUuZmllbGRzKSksXHJcbiAgbWFrZXJ1bGUoJ3ZhbGlkYXRpb25SdWxlcycsIFwidmFsaWRhdGlvbiBydWxlIGlzIG1pc3NpbmcgYSAnbWVzc2FnZVdoZW5WYWxpZCcgbWVtYmVyXCIsXHJcbiAgICBub2RlID0+IGV2ZXJ5KHIgPT4gaGFzKHIsICdtZXNzYWdlV2hlbkludmFsaWQnKSkobm9kZS52YWxpZGF0aW9uUnVsZXMpKSxcclxuICBtYWtlcnVsZSgndmFsaWRhdGlvblJ1bGVzJywgXCJ2YWxpZGF0aW9uIHJ1bGUgaXMgbWlzc2luZyBhICdleHByZXNzaW9uV2hlblZhbGlkJyBtZW1iZXJcIixcclxuICAgIG5vZGUgPT4gZXZlcnkociA9PiBoYXMociwgJ2V4cHJlc3Npb25XaGVuVmFsaWQnKSkobm9kZS52YWxpZGF0aW9uUnVsZXMpKSxcclxuXTtcclxuXHJcblxyXG5jb25zdCBhZ2dyZWdhdGVHcm91cFJ1bGVzID0gW1xyXG4gIG1ha2VydWxlKCdjb25kaXRpb24nLCAnY29uZGl0aW9uIGRvZXMgbm90IGNvbXBpbGUnLFxyXG4gICAgYSA9PiBpc0VtcHR5KGEuY29uZGl0aW9uKVxyXG4gICAgICAgICAgICAgfHwgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uKFxyXG4gICAgICAgICAgICAgICAoKSA9PiBjb21waWxlRXhwcmVzc2lvbihhLmNvbmRpdGlvbiksXHJcbiAgICAgICAgICAgICApKSxcclxuXTtcclxuXHJcbmNvbnN0IGdldFJ1bGVTZXQgPSBub2RlID0+IHN3aXRjaENhc2UoXHJcblxyXG4gIFtpc1JlY29yZCwgcnVsZVNldChcclxuICAgIGNvbW1vblJ1bGVzLFxyXG4gICAgcmVjb3JkUnVsZXMsXHJcbiAgKV0sXHJcblxyXG4gIFtpc0luZGV4LCBydWxlU2V0KFxyXG4gICAgY29tbW9uUnVsZXMsXHJcbiAgICBpbmRleFJ1bGVTZXQsXHJcbiAgKV0sXHJcblxyXG4gIFtpc2FnZ3JlZ2F0ZUdyb3VwLCBydWxlU2V0KFxyXG4gICAgY29tbW9uUnVsZXMsXHJcbiAgICBhZ2dyZWdhdGVHcm91cFJ1bGVzLFxyXG4gICldLFxyXG5cclxuICBbZGVmYXVsdENhc2UsIHJ1bGVTZXQoY29tbW9uUnVsZXMsIFtdKV0sXHJcbikobm9kZSk7XHJcblxyXG5leHBvcnQgY29uc3QgdmFsaWRhdGVOb2RlID0gbm9kZSA9PiBhcHBseVJ1bGVTZXQoZ2V0UnVsZVNldChub2RlKSkobm9kZSk7XHJcblxyXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBbGwgPSAoYXBwSGllcmFyY2h5KSA9PiB7XHJcbiAgY29uc3QgZmxhdHRlbmVkID0gZ2V0RmxhdHRlbmVkSGllcmFyY2h5KFxyXG4gICAgYXBwSGllcmFyY2h5LFxyXG4gICk7XHJcblxyXG4gIGNvbnN0IGR1cGxpY2F0ZU5hbWVSdWxlID0gbWFrZXJ1bGUoXHJcbiAgICAnbmFtZScsICdub2RlIG5hbWVzIG11c3QgYmUgdW5pcXVlIHVuZGVyIHNoYXJlZCBwYXJlbnQnLFxyXG4gICAgbiA9PiBmaWx0ZXIoZiA9PiBmLnBhcmVudCgpID09PSBuLnBhcmVudCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgZi5uYW1lID09PSBuLm5hbWUpKGZsYXR0ZW5lZCkubGVuZ3RoID09PSAxLFxyXG4gICk7XHJcblxyXG4gIGNvbnN0IGR1cGxpY2F0ZU5vZGVLZXlFcnJvcnMgPSAkKGZsYXR0ZW5lZCwgW1xyXG4gICAgbWFwKG4gPT4gYXBwbHlSdWxlU2V0KFtkdXBsaWNhdGVOYW1lUnVsZV0pKG4pKSxcclxuICAgIGZpbHRlcihpc1NvbWV0aGluZyksXHJcbiAgICBmbGF0dGVuLFxyXG4gIF0pO1xyXG5cclxuICBjb25zdCBmaWVsZEVycm9ycyA9ICQoZmxhdHRlbmVkLCBbXHJcbiAgICBmaWx0ZXIoaXNSZWNvcmQpLFxyXG4gICAgbWFwKHZhbGlkYXRlQWxsRmllbGRzKSxcclxuICAgIGZsYXR0ZW4sXHJcbiAgXSk7XHJcblxyXG4gIGNvbnN0IGFnZ3JlZ2F0ZUVycm9ycyA9ICQoZmxhdHRlbmVkLCBbXHJcbiAgICBmaWx0ZXIoaXNhZ2dyZWdhdGVHcm91cCksXHJcbiAgICBtYXAocyA9PiB2YWxpZGF0ZUFsbEFnZ3JlZ2F0ZXMoXHJcbiAgICAgIHMuYWdncmVnYXRlcyxcclxuICAgICkpLFxyXG4gICAgZmxhdHRlbixcclxuICBdKTtcclxuXHJcbiAgcmV0dXJuICQoZmxhdHRlbmVkLCBbXHJcbiAgICBtYXAodmFsaWRhdGVOb2RlKSxcclxuICAgIGZsYXR0ZW4sXHJcbiAgICB1bmlvbihkdXBsaWNhdGVOb2RlS2V5RXJyb3JzKSxcclxuICAgIHVuaW9uKGZpZWxkRXJyb3JzKSxcclxuICAgIHVuaW9uKGFnZ3JlZ2F0ZUVycm9ycyksXHJcbiAgXSk7XHJcbn07XHJcblxyXG5jb25zdCBhY3Rpb25SdWxlcyA9IFtcclxuICBtYWtlcnVsZSgnbmFtZScsICdhY3Rpb24gbXVzdCBoYXZlIGEgbmFtZScsXHJcbiAgICBhID0+IGlzTm9uRW1wdHlTdHJpbmcoYS5uYW1lKSksXHJcbiAgbWFrZXJ1bGUoJ2JlaGF2aW91ck5hbWUnLCAnbXVzdCBzdXBwbHkgYSBiZWhhdmlvdXIgbmFtZSB0byB0aGUgYWN0aW9uJyxcclxuICAgIGEgPT4gaXNOb25FbXB0eVN0cmluZyhhLmJlaGF2aW91ck5hbWUpKSxcclxuICBtYWtlcnVsZSgnYmVoYXZpb3VyU291cmNlJywgJ211c3Qgc3VwcGx5IGEgYmVoYXZpb3VyIHNvdXJjZSBmb3IgdGhlIGFjdGlvbicsXHJcbiAgICBhID0+IGlzTm9uRW1wdHlTdHJpbmcoYS5iZWhhdmlvdXJTb3VyY2UpKSxcclxuXTtcclxuXHJcbmNvbnN0IGR1cGxpY2F0ZUFjdGlvblJ1bGUgPSBtYWtlcnVsZSgnJywgJ2FjdGlvbiBuYW1lIG11c3QgYmUgdW5pcXVlJywgKCkgPT4ge30pO1xyXG5cclxuY29uc3QgdmFsaWRhdGVBY3Rpb24gPSBhY3Rpb24gPT4gYXBwbHlSdWxlU2V0KGFjdGlvblJ1bGVzKShhY3Rpb24pO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFjdGlvbnMgPSAoYWxsQWN0aW9ucykgPT4ge1xyXG4gIGNvbnN0IGR1cGxpY2F0ZUFjdGlvbnMgPSAkKGFsbEFjdGlvbnMsIFtcclxuICAgIGZpbHRlcihhID0+IGZpbHRlcihhMiA9PiBhMi5uYW1lID09PSBhLm5hbWUpKGFsbEFjdGlvbnMpLmxlbmd0aCA+IDEpLFxyXG4gICAgbWFwKGEgPT4gdmFsaWRhdGlvbkVycm9yKGR1cGxpY2F0ZUFjdGlvblJ1bGUsIGEpKSxcclxuICBdKTtcclxuXHJcbiAgY29uc3QgZXJyb3JzID0gJChhbGxBY3Rpb25zLCBbXHJcbiAgICBtYXAodmFsaWRhdGVBY3Rpb24pLFxyXG4gICAgZmxhdHRlbixcclxuICAgIHVuaW9uKGR1cGxpY2F0ZUFjdGlvbnMpLFxyXG4gICAgdW5pcUJ5KCduYW1lJyksXHJcbiAgXSk7XHJcblxyXG4gIHJldHVybiBlcnJvcnM7XHJcbn07XHJcblxyXG5jb25zdCB0cmlnZ2VyUnVsZXMgPSBhY3Rpb25zID0+IChbXHJcbiAgbWFrZXJ1bGUoJ2FjdGlvbk5hbWUnLCAnbXVzdCBzcGVjaWZ5IGFuIGFjdGlvbicsXHJcbiAgICB0ID0+IGlzTm9uRW1wdHlTdHJpbmcodC5hY3Rpb25OYW1lKSksXHJcbiAgbWFrZXJ1bGUoJ2V2ZW50TmFtZScsICdtdXN0IHNwZWNpZnkgYW5kIGV2ZW50JyxcclxuICAgIHQgPT4gaXNOb25FbXB0eVN0cmluZyh0LmV2ZW50TmFtZSkpLFxyXG4gIG1ha2VydWxlKCdhY3Rpb25OYW1lJywgJ3NwZWNpZmllZCBhY3Rpb24gbm90IHN1cHBsaWVkJyxcclxuICAgIHQgPT4gIXQuYWN0aW9uTmFtZVxyXG4gICAgICAgICAgICAgfHwgc29tZShhID0+IGEubmFtZSA9PT0gdC5hY3Rpb25OYW1lKShhY3Rpb25zKSksXHJcbiAgbWFrZXJ1bGUoJ2V2ZW50TmFtZScsICdpbnZhbGlkIEV2ZW50IE5hbWUnLFxyXG4gICAgdCA9PiAhdC5ldmVudE5hbWVcclxuICAgICAgICAgICAgIHx8IGluY2x1ZGVzKHQuZXZlbnROYW1lKShldmVudHNMaXN0KSksXHJcbiAgbWFrZXJ1bGUoJ29wdGlvbnNDcmVhdG9yJywgJ09wdGlvbnMgQ3JlYXRvciBkb2VzIG5vdCBjb21waWxlIC0gY2hlY2sgeW91ciBleHByZXNzaW9uJyxcclxuICAgICh0KSA9PiB7XHJcbiAgICAgIGlmICghdC5vcHRpb25zQ3JlYXRvcikgcmV0dXJuIHRydWU7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29tcGlsZUNvZGUodC5vcHRpb25zQ3JlYXRvcik7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH0gY2F0Y2ggKF8pIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICB9KSxcclxuICBtYWtlcnVsZSgnY29uZGl0aW9uJywgJ1RyaWdnZXIgY29uZGl0aW9uIGRvZXMgbm90IGNvbXBpbGUgLSBjaGVjayB5b3VyIGV4cHJlc3Npb24nLFxyXG4gICAgKHQpID0+IHtcclxuICAgICAgaWYgKCF0LmNvbmRpdGlvbikgcmV0dXJuIHRydWU7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29tcGlsZUV4cHJlc3Npb24odC5jb25kaXRpb24pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9IGNhdGNoIChfKSB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgfSksXHJcbl0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVHJpZ2dlciA9ICh0cmlnZ2VyLCBhbGxBY3Rpb25zKSA9PiB7XHJcbiAgY29uc3QgZXJyb3JzID0gYXBwbHlSdWxlU2V0KHRyaWdnZXJSdWxlcyhhbGxBY3Rpb25zKSkodHJpZ2dlcik7XHJcblxyXG4gIHJldHVybiBlcnJvcnM7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgdmFsaWRhdGVUcmlnZ2VycyA9ICh0cmlnZ2VycywgYWxsQWN0aW9ucykgPT4gJCh0cmlnZ2VycywgW1xyXG4gIG1hcCh0ID0+IHZhbGlkYXRlVHJpZ2dlcih0LCBhbGxBY3Rpb25zKSksXHJcbiAgZmxhdHRlbixcclxuXSk7XHJcbiIsImltcG9ydCB7IGFwcERlZmluaXRpb25GaWxlIH0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgY29uc3RydWN0SGllcmFyY2h5IH0gZnJvbSAnLi9jcmVhdGVOb2Rlcyc7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uID0gZGF0YXN0b3JlID0+IGFzeW5jICgpID0+IHtcclxuICBjb25zdCBleGlzdHMgPSBhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGFwcERlZmluaXRpb25GaWxlKTtcclxuXHJcbiAgaWYgKCFleGlzdHMpIHRocm93IG5ldyBFcnJvcignQXBwbGljYXRpb24gZGVmaW5pdGlvbiBkb2VzIG5vdCBleGlzdCcpO1xyXG5cclxuICBjb25zdCBhcHBEZWZpbml0aW9uID0gYXdhaXQgZGF0YXN0b3JlLmxvYWRKc29uKGFwcERlZmluaXRpb25GaWxlKTtcclxuICBhcHBEZWZpbml0aW9uLmhpZXJhcmNoeSA9IGNvbnN0cnVjdEhpZXJhcmNoeShcclxuICAgIGFwcERlZmluaXRpb24uaGllcmFyY2h5LFxyXG4gICk7XHJcbiAgcmV0dXJuIGFwcERlZmluaXRpb247XHJcbn07XHJcbiIsImltcG9ydCB7IGpvaW4gfSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XHJcbmltcG9ydCB7IGFwcERlZmluaXRpb25GaWxlIH0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgdmFsaWRhdGVBbGwgfSBmcm9tICcuL3ZhbGlkYXRlJztcclxuaW1wb3J0IHsgYXBpV3JhcHBlciB9IGZyb20gJy4uL2NvbW1vbi9hcGlXcmFwcGVyJztcclxuaW1wb3J0IHsgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uL2V2ZW50cyc7XHJcblxyXG5leHBvcnQgY29uc3Qgc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5ID0gYXBwID0+IGFzeW5jIGhpZXJhcmNoeSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMudGVtcGxhdGVBcGkuc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5LFxyXG4gIHBlcm1pc3Npb24ud3JpdGVUZW1wbGF0ZXMuaXNBdXRob3JpemVkLFxyXG4gIHsgaGllcmFyY2h5IH0sXHJcbiAgX3NhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSwgYXBwLmRhdGFzdG9yZSwgaGllcmFyY2h5LFxyXG4pO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBfc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5ID0gYXN5bmMgKGRhdGFzdG9yZSwgaGllcmFyY2h5KSA9PiB7XHJcbiAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IGF3YWl0IHZhbGlkYXRlQWxsKGhpZXJhcmNoeSk7XHJcbiAgaWYgKHZhbGlkYXRpb25FcnJvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBIaWVyYXJjaHkgaXMgaW52YWxpZDogJHtqb2luKFxyXG4gICAgICB2YWxpZGF0aW9uRXJyb3JzLm1hcChlID0+IGAke2UuaXRlbS5ub2RlS2V5ID8gZS5pdGVtLm5vZGVLZXkoKSA6ICcnfSA6ICR7ZS5lcnJvcn1gKSxcclxuICAgICAgJywnLFxyXG4gICAgKX1gKTtcclxuICB9XHJcblxyXG4gIGlmIChhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGFwcERlZmluaXRpb25GaWxlKSkge1xyXG4gICAgY29uc3QgYXBwRGVmaW5pdGlvbiA9IGF3YWl0IGRhdGFzdG9yZS5sb2FkSnNvbihhcHBEZWZpbml0aW9uRmlsZSk7XHJcbiAgICBhcHBEZWZpbml0aW9uLmhpZXJhcmNoeSA9IGhpZXJhcmNoeTtcclxuICAgIGF3YWl0IGRhdGFzdG9yZS51cGRhdGVKc29uKGFwcERlZmluaXRpb25GaWxlLCBhcHBEZWZpbml0aW9uKTtcclxuICB9IGVsc2Uge1xyXG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcignLy5jb25maWcnKTtcclxuICAgIGNvbnN0IGFwcERlZmluaXRpb24gPSB7IGFjdGlvbnM6IFtdLCB0cmlnZ2VyczogW10sIGhpZXJhcmNoeSB9O1xyXG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oYXBwRGVmaW5pdGlvbkZpbGUsIGFwcERlZmluaXRpb24pO1xyXG4gIH1cclxufTtcclxuIiwiaW1wb3J0IHsgam9pbiB9IGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IG1hcCB9IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IGFwcERlZmluaXRpb25GaWxlIH0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgdmFsaWRhdGVUcmlnZ2VycywgdmFsaWRhdGVBY3Rpb25zIH0gZnJvbSAnLi92YWxpZGF0ZSc7XHJcbmltcG9ydCB7IGFwaVdyYXBwZXIgfSBmcm9tICcuLi9jb21tb24vYXBpV3JhcHBlcic7XHJcbmltcG9ydCB7IGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XHJcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnMgPSBhcHAgPT4gYXN5bmMgKGFjdGlvbnMsIHRyaWdnZXJzKSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMudGVtcGxhdGVBcGkuc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycyxcclxuICBwZXJtaXNzaW9uLndyaXRlVGVtcGxhdGVzLmlzQXV0aG9yaXplZCxcclxuICB7IGFjdGlvbnMsIHRyaWdnZXJzIH0sXHJcbiAgX3NhdmVBY3Rpb25zQW5kVHJpZ2dlcnMsIGFwcC5kYXRhc3RvcmUsIGFjdGlvbnMsIHRyaWdnZXJzLFxyXG4pO1xyXG5cclxuZXhwb3J0IGNvbnN0IF9zYXZlQWN0aW9uc0FuZFRyaWdnZXJzID0gYXN5bmMgKGRhdGFzdG9yZSwgYWN0aW9ucywgdHJpZ2dlcnMpID0+IHtcclxuICBpZiAoYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhhcHBEZWZpbml0aW9uRmlsZSkpIHtcclxuICAgIGNvbnN0IGFwcERlZmluaXRpb24gPSBhd2FpdCBkYXRhc3RvcmUubG9hZEpzb24oYXBwRGVmaW5pdGlvbkZpbGUpO1xyXG4gICAgYXBwRGVmaW5pdGlvbi5hY3Rpb25zID0gYWN0aW9ucztcclxuICAgIGFwcERlZmluaXRpb24udHJpZ2dlcnMgPSB0cmlnZ2VycztcclxuXHJcbiAgICBjb25zdCBhY3Rpb25WYWxpZEVycnMgPSBtYXAoZSA9PiBlLmVycm9yKSh2YWxpZGF0ZUFjdGlvbnMoYWN0aW9ucykpO1xyXG5cclxuICAgIGlmIChhY3Rpb25WYWxpZEVycnMubGVuZ3RoID4gMCkge1xyXG4gICAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBBY3Rpb25zIGFyZSBpbnZhbGlkOiAke2pvaW4oYWN0aW9uVmFsaWRFcnJzLCAnLCAnKX1gKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0cmlnZ2VyVmFsaWRFcnJzID0gbWFwKGUgPT4gZS5lcnJvcikodmFsaWRhdGVUcmlnZ2Vycyh0cmlnZ2VycywgYWN0aW9ucykpO1xyXG5cclxuICAgIGlmICh0cmlnZ2VyVmFsaWRFcnJzLmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgVHJpZ2dlcnMgYXJlIGludmFsaWQ6ICR7am9pbih0cmlnZ2VyVmFsaWRFcnJzLCAnLCAnKX1gKTtcclxuICAgIH1cclxuXHJcbiAgICBhd2FpdCBkYXRhc3RvcmUudXBkYXRlSnNvbihhcHBEZWZpbml0aW9uRmlsZSwgYXBwRGVmaW5pdGlvbik7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ0Nhbm5vdCBzYXZlIGFjdGlvbnM6IEFwcGxpY2F0aW9uIGRlZmluaXRpb24gZG9lcyBub3QgZXhpc3QnKTtcclxuICB9XHJcbn07XHJcbiIsIlxyXG5leHBvcnQgY29uc3QgZ2V0QmVoYXZpb3VyU291cmNlcyA9IGFzeW5jIChkYXRhc3RvcmUpID0+IHtcclxuICAgIGF3YWl0IGRhdGFzdG9yZS5sb2FkRmlsZSgnLy5jb25maWcvYmVoYXZpb3VyU291cmNlcy5qcycpO1xyXG59O1xyXG4iLCJpbXBvcnQge1xyXG4gIGdldE5ld1Jvb3RMZXZlbCxcclxuICBnZXROZXdSZWNvcmRUZW1wbGF0ZSwgZ2V0TmV3SW5kZXhUZW1wbGF0ZSxcclxuICBjcmVhdGVOb2RlRXJyb3JzLCBjb25zdHJ1Y3RIaWVyYXJjaHksXHJcbiAgZ2V0TmV3QWdncmVnYXRlR3JvdXBUZW1wbGF0ZSwgZ2V0TmV3U2luZ2xlUmVjb3JkVGVtcGxhdGUsXHJcbiAgZ2V0TmV3QWdncmVnYXRlVGVtcGxhdGUsIGNvbnN0cnVjdE5vZGUsXHJcbn1cclxuICBmcm9tICcuL2NyZWF0ZU5vZGVzJztcclxuaW1wb3J0IHtcclxuICBnZXROZXdGaWVsZCwgdmFsaWRhdGVGaWVsZCxcclxuICBhZGRGaWVsZCwgZmllbGRFcnJvcnMsXHJcbn0gZnJvbSAnLi9maWVsZHMnO1xyXG5pbXBvcnQge1xyXG4gIGdldE5ld1JlY29yZFZhbGlkYXRpb25SdWxlLCBjb21tb25SZWNvcmRWYWxpZGF0aW9uUnVsZXMsXHJcbiAgYWRkUmVjb3JkVmFsaWRhdGlvblJ1bGUsXHJcbn0gZnJvbSAnLi9yZWNvcmRWYWxpZGF0aW9uUnVsZXMnO1xyXG5pbXBvcnQgeyBjcmVhdGVBY3Rpb24sIGNyZWF0ZVRyaWdnZXIgfSBmcm9tICcuL2NyZWF0ZUFjdGlvbnMnO1xyXG5pbXBvcnQge1xyXG4gIHZhbGlkYXRlVHJpZ2dlcnMsIHZhbGlkYXRlVHJpZ2dlciwgdmFsaWRhdGVOb2RlLFxyXG4gIHZhbGlkYXRlQWN0aW9ucywgdmFsaWRhdGVBbGwsXHJcbn0gZnJvbSAnLi92YWxpZGF0ZSc7XHJcbmltcG9ydCB7IGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbiB9IGZyb20gJy4vZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uJztcclxuaW1wb3J0IHsgc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5IH0gZnJvbSAnLi9zYXZlQXBwbGljYXRpb25IaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBzYXZlQWN0aW9uc0FuZFRyaWdnZXJzIH0gZnJvbSAnLi9zYXZlQWN0aW9uc0FuZFRyaWdnZXJzJztcclxuaW1wb3J0IHsgYWxsIH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5pbXBvcnQgeyBnZXRCZWhhdmlvdXJTb3VyY2VzIH0gZnJvbSBcIi4vZ2V0QmVoYXZpb3VyU291cmNlc1wiO1xyXG5cclxuY29uc3QgYXBpID0gYXBwID0+ICh7XHJcblxyXG4gIGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbjogZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uKGFwcC5kYXRhc3RvcmUpLFxyXG4gIHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeTogc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5KGFwcCksXHJcbiAgc2F2ZUFjdGlvbnNBbmRUcmlnZ2Vyczogc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycyhhcHApLFxyXG4gIGdldEJlaGF2aW91clNvdXJjZXM6ICgpID0+IGdldEJlaGF2aW91clNvdXJjZXMoYXBwLmRhdGFzdG9yZSksXHJcbiAgZ2V0TmV3Um9vdExldmVsLFxyXG4gIGNvbnN0cnVjdE5vZGUsXHJcbiAgZ2V0TmV3SW5kZXhUZW1wbGF0ZSxcclxuICBnZXROZXdSZWNvcmRUZW1wbGF0ZSxcclxuICBnZXROZXdGaWVsZCxcclxuICB2YWxpZGF0ZUZpZWxkLFxyXG4gIGFkZEZpZWxkLFxyXG4gIGZpZWxkRXJyb3JzLFxyXG4gIGdldE5ld1JlY29yZFZhbGlkYXRpb25SdWxlLFxyXG4gIGNvbW1vblJlY29yZFZhbGlkYXRpb25SdWxlcyxcclxuICBhZGRSZWNvcmRWYWxpZGF0aW9uUnVsZSxcclxuICBjcmVhdGVBY3Rpb24sXHJcbiAgY3JlYXRlVHJpZ2dlcixcclxuICB2YWxpZGF0ZUFjdGlvbnMsXHJcbiAgdmFsaWRhdGVUcmlnZ2VyLFxyXG4gIGdldE5ld0FnZ3JlZ2F0ZUdyb3VwVGVtcGxhdGUsXHJcbiAgZ2V0TmV3QWdncmVnYXRlVGVtcGxhdGUsXHJcbiAgY29uc3RydWN0SGllcmFyY2h5LFxyXG4gIGdldE5ld1NpbmdsZVJlY29yZFRlbXBsYXRlLFxyXG4gIGFsbFR5cGVzOiBhbGwsXHJcbiAgdmFsaWRhdGVOb2RlLFxyXG4gIHZhbGlkYXRlQWxsLFxyXG4gIHZhbGlkYXRlVHJpZ2dlcnMsXHJcbn0pO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRUZW1wbGF0ZUFwaSA9IGFwcCA9PiBhcGkoYXBwKTtcclxuXHJcbmV4cG9ydCBjb25zdCBlcnJvcnMgPSBjcmVhdGVOb2RlRXJyb3JzO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2V0VGVtcGxhdGVBcGk7XHJcbiIsImltcG9ydCB7IG1hcCB9IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7XHJcbiAgVVNFUlNfTElTVF9GSUxFLFxyXG4gIHN0cmlwVXNlck9mU2Vuc2l0aXZlU3R1ZmYsXHJcbn0gZnJvbSAnLi9hdXRoQ29tbW9uJztcclxuaW1wb3J0IHsgJCwgYXBpV3JhcHBlciwgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFVzZXJzID0gYXBwID0+IGFzeW5jICgpID0+IGFwaVdyYXBwZXIoXHJcbiAgYXBwLFxyXG4gIGV2ZW50cy5hdXRoQXBpLmdldFVzZXJzLFxyXG4gIHBlcm1pc3Npb24ubGlzdFVzZXJzLmlzQXV0aG9yaXplZCxcclxuICB7fSxcclxuICBfZ2V0VXNlcnMsIGFwcCxcclxuKTtcclxuXHJcbmV4cG9ydCBjb25zdCBfZ2V0VXNlcnMgPSBhc3luYyBhcHAgPT4gJChhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSksIFtcclxuICBtYXAoc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZiksXHJcbl0pO1xyXG4iLCJpbXBvcnQgeyBBQ0NFU1NfTEVWRUxTX0ZJTEUgfSBmcm9tICcuL2F1dGhDb21tb24nO1xyXG5pbXBvcnQgeyBhcGlXcmFwcGVyLCBldmVudHMgfSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XHJcblxyXG5leHBvcnQgY29uc3QgbG9hZEFjY2Vzc0xldmVscyA9IGFwcCA9PiBhc3luYyAoKSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMuYXV0aEFwaS5sb2FkQWNjZXNzTGV2ZWxzLFxyXG4gIHBlcm1pc3Npb24ubGlzdEFjY2Vzc0xldmVscy5pc0F1dGhvcml6ZWQsXHJcbiAge30sXHJcbiAgX2xvYWRBY2Nlc3NMZXZlbHMsIGFwcCxcclxuKTtcclxuXHJcbmV4cG9ydCBjb25zdCBfbG9hZEFjY2Vzc0xldmVscyA9IGFzeW5jIGFwcCA9PiBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKEFDQ0VTU19MRVZFTFNfRklMRSk7XHJcbiIsImltcG9ydCB7XHJcbiAgZmluZCwgZmlsdGVyLCBzb21lLFxyXG4gIG1hcCwgZmxhdHRlbixcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xyXG5pbXBvcnQgeyBfZ2V0VXNlcnMgfSBmcm9tICcuL2dldFVzZXJzJztcclxuaW1wb3J0IHtcclxuICBnZXRVc2VyQnlOYW1lLCB1c2VyQXV0aEZpbGUsXHJcbiAgcGFyc2VUZW1wb3JhcnlDb2RlLFxyXG59IGZyb20gJy4vYXV0aENvbW1vbic7XHJcbmltcG9ydCB7IF9sb2FkQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi9sb2FkQWNjZXNzTGV2ZWxzJztcclxuaW1wb3J0IHtcclxuICBpc05vdGhpbmdPckVtcHR5LCAkLCBhcGlXcmFwcGVyLCBldmVudHMsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xyXG5cclxuY29uc3QgZHVtbXlIYXNoID0gJyRhcmdvbjJpJHY9MTkkbT00MDk2LHQ9MyxwPTEkVVpSbzQwOVVZQkdqSEpTM0NWNlV4dyRyVTg0cVVxUGVPUkZ6S1ltWVkwY2VCTERhUE8rSldTSDRQZk5pS1hmSUtrJztcclxuXHJcbmV4cG9ydCBjb25zdCBhdXRoZW50aWNhdGUgPSBhcHAgPT4gYXN5bmMgKHVzZXJuYW1lLCBwYXNzd29yZCkgPT4gYXBpV3JhcHBlcihcclxuICBhcHAsXHJcbiAgZXZlbnRzLmF1dGhBcGkuYXV0aGVudGljYXRlLFxyXG4gIGFsd2F5c0F1dGhvcml6ZWQsXHJcbiAgeyB1c2VybmFtZSwgcGFzc3dvcmQgfSxcclxuICBfYXV0aGVudGljYXRlLCBhcHAsIHVzZXJuYW1lLCBwYXNzd29yZCxcclxuKTtcclxuXHJcbmV4cG9ydCBjb25zdCBfYXV0aGVudGljYXRlID0gYXN5bmMgKGFwcCwgdXNlcm5hbWUsIHBhc3N3b3JkKSA9PiB7XHJcbiAgaWYgKGlzTm90aGluZ09yRW1wdHkodXNlcm5hbWUpIHx8IGlzTm90aGluZ09yRW1wdHkocGFzc3dvcmQpKSB7IHJldHVybiBudWxsOyB9XHJcblxyXG4gIGNvbnN0IGFsbFVzZXJzID0gYXdhaXQgX2dldFVzZXJzKGFwcCk7XHJcbiAgbGV0IHVzZXIgPSBnZXRVc2VyQnlOYW1lKFxyXG4gICAgYWxsVXNlcnMsXHJcbiAgICB1c2VybmFtZSxcclxuICApO1xyXG5cclxuICBjb25zdCBub3RBVXNlciA9ICdub3QtYS11c2VyJztcclxuICAvLyBjb250aW51ZSB3aXRoIG5vbi11c2VyIC0gc28gdGltZSB0byB2ZXJpZnkgcmVtYWlucyBjb25zaXN0ZW50XHJcbiAgLy8gd2l0aCB2ZXJpZmljYXRpb24gb2YgYSB2YWxpZCB1c2VyXHJcbiAgaWYgKCF1c2VyIHx8ICF1c2VyLmVuYWJsZWQpIHsgdXNlciA9IG5vdEFVc2VyOyB9XHJcblxyXG4gIGxldCB1c2VyQXV0aDtcclxuICB0cnkge1xyXG4gICAgdXNlckF1dGggPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxyXG4gICAgICB1c2VyQXV0aEZpbGUodXNlcm5hbWUpLFxyXG4gICAgKTtcclxuICB9IGNhdGNoIChfKSB7XHJcbiAgICB1c2VyQXV0aCA9IHsgYWNjZXNzTGV2ZWxzOiBbXSwgcGFzc3dvcmRIYXNoOiBkdW1teUhhc2ggfTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHBlcm1pc3Npb25zID0gYXdhaXQgYnVpbGRVc2VyUGVybWlzc2lvbnMoYXBwLCB1c2VyLmFjY2Vzc0xldmVscyk7XHJcblxyXG4gIGNvbnN0IHZlcmlmaWVkID0gYXdhaXQgYXBwLmNyeXB0by52ZXJpZnkoXHJcbiAgICB1c2VyQXV0aC5wYXNzd29yZEhhc2gsXHJcbiAgICBwYXNzd29yZCxcclxuICApO1xyXG5cclxuICBpZiAodXNlciA9PT0gbm90QVVzZXIpIHsgcmV0dXJuIG51bGw7IH1cclxuXHJcbiAgcmV0dXJuIHZlcmlmaWVkXHJcbiAgICA/IHtcclxuICAgICAgLi4udXNlciwgcGVybWlzc2lvbnMsIHRlbXA6IGZhbHNlLCBpc1VzZXI6IHRydWUsXHJcbiAgICB9XHJcbiAgICA6IG51bGw7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzID0gYXBwID0+IGFzeW5jICh0ZW1wQWNjZXNzQ29kZSkgPT4ge1xyXG4gIGlmIChpc05vdGhpbmdPckVtcHR5KHRlbXBBY2Nlc3NDb2RlKSkgeyByZXR1cm4gbnVsbDsgfVxyXG5cclxuICBjb25zdCB0ZW1wID0gcGFyc2VUZW1wb3JhcnlDb2RlKHRlbXBBY2Nlc3NDb2RlKTtcclxuICBsZXQgdXNlciA9ICQoYXdhaXQgX2dldFVzZXJzKGFwcCksIFtcclxuICAgIGZpbmQodSA9PiB1LnRlbXBvcmFyeUFjY2Vzc0lkID09PSB0ZW1wLmlkKSxcclxuICBdKTtcclxuXHJcbiAgY29uc3Qgbm90QVVzZXIgPSAnbm90LWEtdXNlcic7XHJcbiAgaWYgKCF1c2VyIHx8ICF1c2VyLmVuYWJsZWQpIHsgdXNlciA9IG5vdEFVc2VyOyB9XHJcblxyXG4gIGxldCB1c2VyQXV0aDtcclxuICB0cnkge1xyXG4gICAgdXNlckF1dGggPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxyXG4gICAgICB1c2VyQXV0aEZpbGUodXNlci5uYW1lKSxcclxuICAgICk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgdXNlckF1dGggPSB7XHJcbiAgICAgIHRlbXBvcmFyeUFjY2Vzc0hhc2g6IGR1bW15SGFzaCxcclxuICAgICAgdGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2g6IChhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCkgKyAxMDAwMCksXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgaWYgKHVzZXJBdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoIDwgYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpKSB7IHVzZXIgPSBub3RBVXNlcjsgfVxyXG5cclxuICBjb25zdCB0ZW1wQ29kZSA9ICF0ZW1wLmNvZGUgPyBnZW5lcmF0ZSgpIDogdGVtcC5jb2RlO1xyXG4gIGNvbnN0IHZlcmlmaWVkID0gYXdhaXQgYXBwLmNyeXB0by52ZXJpZnkoXHJcbiAgICB1c2VyQXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoLFxyXG4gICAgdGVtcENvZGUsXHJcbiAgKTtcclxuXHJcbiAgaWYgKHVzZXIgPT09IG5vdEFVc2VyKSB7IHJldHVybiBudWxsOyB9XHJcblxyXG4gIHJldHVybiB2ZXJpZmllZFxyXG4gICAgPyB7XHJcbiAgICAgIC4uLnVzZXIsXHJcbiAgICAgIHBlcm1pc3Npb25zOiBbXSxcclxuICAgICAgdGVtcDogdHJ1ZSxcclxuICAgICAgaXNVc2VyOiB0cnVlLFxyXG4gICAgfVxyXG4gICAgOiBudWxsO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGJ1aWxkVXNlclBlcm1pc3Npb25zID0gYXN5bmMgKGFwcCwgdXNlckFjY2Vzc0xldmVscykgPT4ge1xyXG4gIGNvbnN0IGFsbEFjY2Vzc0xldmVscyA9IGF3YWl0IF9sb2FkQWNjZXNzTGV2ZWxzKGFwcCk7XHJcblxyXG4gIHJldHVybiAkKGFsbEFjY2Vzc0xldmVscy5sZXZlbHMsIFtcclxuICAgIGZpbHRlcihsID0+IHNvbWUodWEgPT4gbC5uYW1lID09PSB1YSkodXNlckFjY2Vzc0xldmVscykpLFxyXG4gICAgbWFwKGwgPT4gbC5wZXJtaXNzaW9ucyksXHJcbiAgICBmbGF0dGVuLFxyXG4gIF0pO1xyXG59O1xyXG4iLCJpbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xyXG5pbXBvcnQge1xyXG4gIHRlbXBDb2RlRXhwaXJ5TGVuZ3RoLCBVU0VSU19MT0NLX0ZJTEUsXHJcbiAgVVNFUlNfTElTVF9GSUxFLCB1c2VyQXV0aEZpbGUsXHJcbiAgZ2V0VXNlckJ5TmFtZSxcclxufSBmcm9tICcuL2F1dGhDb21tb24nO1xyXG5pbXBvcnQge1xyXG4gIGdldExvY2ssIGlzTm9sb2NrLFxyXG4gIHJlbGVhc2VMb2NrLFxyXG59IGZyb20gJy4uL2NvbW1vbi9sb2NrJztcclxuaW1wb3J0IHsgYXBpV3JhcHBlciwgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyA9IGFwcCA9PiBhc3luYyB1c2VyTmFtZSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMuYXV0aEFwaS5jcmVhdGVUZW1wb3JhcnlBY2Nlc3MsXHJcbiAgYWx3YXlzQXV0aG9yaXplZCxcclxuICB7IHVzZXJOYW1lIH0sXHJcbiAgX2NyZWF0ZVRlbXBvcmFyeUFjY2VzcywgYXBwLCB1c2VyTmFtZSxcclxuKTtcclxuXHJcbmV4cG9ydCBjb25zdCBfY3JlYXRlVGVtcG9yYXJ5QWNjZXNzID0gYXN5bmMgKGFwcCwgdXNlck5hbWUpID0+IHtcclxuICBjb25zdCB0ZW1wQ29kZSA9IGF3YWl0IGdldFRlbXBvcmFyeUNvZGUoYXBwKTtcclxuXHJcbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldExvY2soXHJcbiAgICBhcHAsIFVTRVJTX0xPQ0tfRklMRSwgMTAwMCwgMixcclxuICApO1xyXG5cclxuICBpZiAoaXNOb2xvY2sobG9jaykpIHsgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gY3JlYXRlIHRlbXBvcmFyeSBhY2Nlc3MsIGNvdWxkIG5vdCBnZXQgbG9jayAtIHRyeSBhZ2FpbicpOyB9XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB1c2VycyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oVVNFUlNfTElTVF9GSUxFKTtcclxuXHJcbiAgICBjb25zdCB1c2VyID0gZ2V0VXNlckJ5TmFtZSh1c2VycywgdXNlck5hbWUpO1xyXG4gICAgdXNlci50ZW1wb3JhcnlBY2Nlc3NJZCA9IHRlbXBDb2RlLnRlbXBvcmFyeUFjY2Vzc0lkO1xyXG5cclxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcclxuICAgICAgVVNFUlNfTElTVF9GSUxFLFxyXG4gICAgICB1c2VycyxcclxuICAgICk7XHJcbiAgfSBmaW5hbGx5IHtcclxuICAgIGF3YWl0IHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XHJcbiAgfVxyXG5cclxuICBjb25zdCB1c2VyQXV0aCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXHJcbiAgICB1c2VyQXV0aEZpbGUodXNlck5hbWUpLFxyXG4gICk7XHJcbiAgdXNlckF1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaCA9IHRlbXBDb2RlLnRlbXBvcmFyeUFjY2Vzc0hhc2g7XHJcblxyXG4gIHVzZXJBdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID0gdGVtcENvZGUudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2g7XHJcblxyXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcclxuICAgIHVzZXJBdXRoRmlsZSh1c2VyTmFtZSksXHJcbiAgICB1c2VyQXV0aCxcclxuICApO1xyXG5cclxuICByZXR1cm4gdGVtcENvZGUudGVtcENvZGU7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0VGVtcG9yYXJ5Q29kZSA9IGFzeW5jIChhcHApID0+IHtcclxuICBjb25zdCB0ZW1wQ29kZSA9IGdlbmVyYXRlKClcclxuICAgICAgICArIGdlbmVyYXRlKClcclxuICAgICAgICArIGdlbmVyYXRlKClcclxuICAgICAgICArIGdlbmVyYXRlKCk7XHJcblxyXG4gIGNvbnN0IHRlbXBJZCA9IGdlbmVyYXRlKCk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB0ZW1wb3JhcnlBY2Nlc3NIYXNoOiBhd2FpdCBhcHAuY3J5cHRvLmhhc2goXHJcbiAgICAgIHRlbXBDb2RlLFxyXG4gICAgKSxcclxuICAgIHRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoOlxyXG4gICAgICAgICAgICAoYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpKSArIHRlbXBDb2RlRXhwaXJ5TGVuZ3RoLFxyXG4gICAgdGVtcENvZGU6IGB0bXA6JHt0ZW1wSWR9OiR7dGVtcENvZGV9YCxcclxuICAgIHRlbXBvcmFyeUFjY2Vzc0lkOiB0ZW1wSWQsXHJcbiAgfTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBsb29rc0xpa2VUZW1wb3JhcnlDb2RlID0gY29kZSA9PiBjb2RlLnN0YXJ0c1dpdGgoJ3RtcDonKTtcclxuIiwiaW1wb3J0IHtcclxuICBtYXAsIHVuaXFXaXRoLFxyXG4gIGZsYXR0ZW4sIGZpbHRlcixcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xyXG5pbXBvcnQge1xyXG4gICQsIGluc2Vuc2l0aXZlRXF1YWxzLCBhcGlXcmFwcGVyLCBldmVudHMsXHJcbiAgaXNOb25FbXB0eVN0cmluZywgYWxsLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IGFsd2F5c0F1dGhvcml6ZWQgfSBmcm9tICcuL3Blcm1pc3Npb25zJztcclxuXHJcbmNvbnN0IHVzZXJSdWxlcyA9IGFsbFVzZXJzID0+IFtcclxuICBtYWtlcnVsZSgnbmFtZScsICd1c2VybmFtZSBtdXN0IGJlIHNldCcsXHJcbiAgICB1ID0+IGlzTm9uRW1wdHlTdHJpbmcodS5uYW1lKSksXHJcbiAgbWFrZXJ1bGUoJ2FjY2Vzc0xldmVscycsICd1c2VyIG11c3QgaGF2ZSBhdCBsZWFzdCBvbmUgYWNjZXNzIGxldmVsJyxcclxuICAgIHUgPT4gdS5hY2Nlc3NMZXZlbHMubGVuZ3RoID4gMCksXHJcbiAgbWFrZXJ1bGUoJ25hbWUnLCAndXNlcm5hbWUgbXVzdCBiZSB1bmlxdWUnLFxyXG4gICAgdSA9PiBmaWx0ZXIodTIgPT4gaW5zZW5zaXRpdmVFcXVhbHModTIubmFtZSwgdS5uYW1lKSkoYWxsVXNlcnMpLmxlbmd0aCA9PT0gMSksXHJcbiAgbWFrZXJ1bGUoJ2FjY2Vzc0xldmVscycsICdhY2Nlc3MgbGV2ZWxzIG11c3Qgb25seSBjb250YWluIHN0aW5ncycsXHJcbiAgICB1ID0+IGFsbChpc05vbkVtcHR5U3RyaW5nKSh1LmFjY2Vzc0xldmVscykpLFxyXG5dO1xyXG5cclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVXNlciA9ICgpID0+IChhbGx1c2VycywgdXNlcikgPT4gYXBwbHlSdWxlU2V0KHVzZXJSdWxlcyhhbGx1c2VycykpKHVzZXIpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVXNlcnMgPSBhcHAgPT4gYWxsVXNlcnMgPT4gYXBpV3JhcHBlcihcclxuICBhcHAsXHJcbiAgZXZlbnRzLmF1dGhBcGkudmFsaWRhdGVVc2VycyxcclxuICBhbHdheXNBdXRob3JpemVkLFxyXG4gIHsgYWxsVXNlcnMgfSxcclxuICBfdmFsaWRhdGVVc2VycywgYXBwLCBhbGxVc2VycyxcclxuKTtcclxuXHJcbmV4cG9ydCBjb25zdCBfdmFsaWRhdGVVc2VycyA9IChhcHAsIGFsbFVzZXJzKSA9PiAkKGFsbFVzZXJzLCBbXHJcbiAgbWFwKGwgPT4gdmFsaWRhdGVVc2VyKGFwcCkoYWxsVXNlcnMsIGwpKSxcclxuICBmbGF0dGVuLFxyXG4gIHVuaXFXaXRoKCh4LCB5KSA9PiB4LmZpZWxkID09PSB5LmZpZWxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHguaXRlbSA9PT0geS5pdGVtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHguZXJyb3IgPT09IHkuZXJyb3IpLFxyXG5dKTtcclxuIiwiaW1wb3J0IHsgYXBpV3JhcHBlclN5bmMsIGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcclxuXHJcbmV4cG9ydCBjb25zdCBnZXROZXdVc2VyID0gYXBwID0+ICgpID0+IGFwaVdyYXBwZXJTeW5jKFxyXG4gIGFwcCxcclxuICBldmVudHMuYXV0aEFwaS5nZXROZXdVc2VyLFxyXG4gIHBlcm1pc3Npb24uY3JlYXRlVXNlci5pc0F1dGhvcml6ZWQsXHJcbiAge30sXHJcbiAgX2dldE5ld1VzZXIsIGFwcCxcclxuKTtcclxuXHJcbmV4cG9ydCBjb25zdCBfZ2V0TmV3VXNlciA9ICgpID0+ICh7XHJcbiAgbmFtZTogJycsXHJcbiAgYWNjZXNzTGV2ZWxzOiBbXSxcclxuICBlbmFibGVkOiB0cnVlLFxyXG4gIHRlbXBvcmFyeUFjY2Vzc0lkOiAnJyxcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TmV3VXNlckF1dGggPSBhcHAgPT4gKCkgPT4gYXBpV3JhcHBlclN5bmMoXHJcbiAgYXBwLFxyXG4gIGV2ZW50cy5hdXRoQXBpLmdldE5ld1VzZXJBdXRoLFxyXG4gIHBlcm1pc3Npb24uY3JlYXRlVXNlci5pc0F1dGhvcml6ZWQsXHJcbiAge30sXHJcbiAgX2dldE5ld1VzZXJBdXRoLCBhcHAsXHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgX2dldE5ld1VzZXJBdXRoID0gKCkgPT4gKHtcclxuICBwYXNzd29yZEhhc2g6ICcnLFxyXG4gIHRlbXBvcmFyeUFjY2Vzc0hhc2g6ICcnLFxyXG4gIHRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoOiAwLFxyXG59KTtcclxuIiwiaW1wb3J0IHsgZmluZCB9IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IHVzZXJBdXRoRmlsZSwgcGFyc2VUZW1wb3JhcnlDb2RlIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcclxuaW1wb3J0IHtcclxuICBpc1NvbWV0aGluZywgJCwgYXBpV3JhcHBlciwgYXBpV3JhcHBlclN5bmMsIGV2ZW50cyxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBfZ2V0VXNlcnMgfSBmcm9tICcuL2dldFVzZXJzJztcclxuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGlzVmFsaWRQYXNzd29yZCA9IGFwcCA9PiBwYXNzd29yZCA9PiBhcGlXcmFwcGVyU3luYyhcclxuICBhcHAsXHJcbiAgZXZlbnRzLmF1dGhBcGkuaXNWYWxpZFBhc3N3b3JkLFxyXG4gIGFsd2F5c0F1dGhvcml6ZWQsXHJcbiAgeyBwYXNzd29yZCB9LFxyXG4gIF9pc1ZhbGlkUGFzc3dvcmQsIGFwcCwgcGFzc3dvcmQsXHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgX2lzVmFsaWRQYXNzd29yZCA9IChhcHAsIHBhc3N3b3JkKSA9PiBzY29yZVBhc3N3b3JkKHBhc3N3b3JkKS5zY29yZSA+IDMwO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNoYW5nZU15UGFzc3dvcmQgPSBhcHAgPT4gYXN5bmMgKGN1cnJlbnRQdywgbmV3cGFzc3dvcmQpID0+IGFwaVdyYXBwZXIoXHJcbiAgYXBwLFxyXG4gIGV2ZW50cy5hdXRoQXBpLmNoYW5nZU15UGFzc3dvcmQsXHJcbiAgYWx3YXlzQXV0aG9yaXplZCxcclxuICB7IGN1cnJlbnRQdywgbmV3cGFzc3dvcmQgfSxcclxuICBfY2hhbmdlTXlQYXNzd29yZCwgYXBwLCBjdXJyZW50UHcsIG5ld3Bhc3N3b3JkLFxyXG4pO1xyXG5cclxuZXhwb3J0IGNvbnN0IF9jaGFuZ2VNeVBhc3N3b3JkID0gYXN5bmMgKGFwcCwgY3VycmVudFB3LCBuZXdwYXNzd29yZCkgPT4ge1xyXG4gIGNvbnN0IGV4aXN0aW5nQXV0aCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXHJcbiAgICB1c2VyQXV0aEZpbGUoYXBwLnVzZXIubmFtZSksXHJcbiAgKTtcclxuXHJcbiAgaWYgKGlzU29tZXRoaW5nKGV4aXN0aW5nQXV0aC5wYXNzd29yZEhhc2gpKSB7XHJcbiAgICBjb25zdCB2ZXJpZmllZCA9IGF3YWl0IGFwcC5jcnlwdG8udmVyaWZ5KFxyXG4gICAgICBleGlzdGluZ0F1dGgucGFzc3dvcmRIYXNoLFxyXG4gICAgICBjdXJyZW50UHcsXHJcbiAgICApO1xyXG5cclxuICAgIGlmICh2ZXJpZmllZCkge1xyXG4gICAgICBhd2FpdCBhd2FpdCBkb1NldChcclxuICAgICAgICBhcHAsIGV4aXN0aW5nQXV0aCxcclxuICAgICAgICBhcHAudXNlci5uYW1lLCBuZXdwYXNzd29yZCxcclxuICAgICAgKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZSA9IGFwcCA9PiBhc3luYyAodGVtcENvZGUsIG5ld3Bhc3N3b3JkKSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMuYXV0aEFwaS5zZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlLFxyXG4gIGFsd2F5c0F1dGhvcml6ZWQsXHJcbiAgeyB0ZW1wQ29kZSwgbmV3cGFzc3dvcmQgfSxcclxuICBfc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZSwgYXBwLCB0ZW1wQ29kZSwgbmV3cGFzc3dvcmQsXHJcbik7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IF9zZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlID0gYXN5bmMgKGFwcCwgdGVtcENvZGUsIG5ld3Bhc3N3b3JkKSA9PiB7XHJcbiAgY29uc3QgY3VycmVudFRpbWUgPSBhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCk7XHJcblxyXG4gIGNvbnN0IHRlbXAgPSBwYXJzZVRlbXBvcmFyeUNvZGUodGVtcENvZGUpO1xyXG5cclxuICBjb25zdCB1c2VyID0gJChhd2FpdCBfZ2V0VXNlcnMoYXBwKSwgW1xyXG4gICAgZmluZCh1ID0+IHUudGVtcG9yYXJ5QWNjZXNzSWQgPT09IHRlbXAuaWQpLFxyXG4gIF0pO1xyXG5cclxuICBpZiAoIXVzZXIpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblxyXG4gIGNvbnN0IGV4aXN0aW5nQXV0aCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXHJcbiAgICB1c2VyQXV0aEZpbGUodXNlci5uYW1lKSxcclxuICApO1xyXG5cclxuICBpZiAoaXNTb21ldGhpbmcoZXhpc3RpbmdBdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2gpXHJcbiAgICAgICAmJiBleGlzdGluZ0F1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPiBjdXJyZW50VGltZSkge1xyXG4gICAgY29uc3QgdmVyaWZpZWQgPSBhd2FpdCBhcHAuY3J5cHRvLnZlcmlmeShcclxuICAgICAgZXhpc3RpbmdBdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2gsXHJcbiAgICAgIHRlbXAuY29kZSxcclxuICAgICk7XHJcblxyXG4gICAgaWYgKHZlcmlmaWVkKSB7XHJcbiAgICAgIGF3YWl0IGRvU2V0KFxyXG4gICAgICAgIGFwcCwgZXhpc3RpbmdBdXRoLFxyXG4gICAgICAgIHVzZXIubmFtZSwgbmV3cGFzc3dvcmQsXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuY29uc3QgZG9TZXQgPSBhc3luYyAoYXBwLCBhdXRoLCB1c2VybmFtZSwgbmV3cGFzc3dvcmQpID0+IHtcclxuICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2ggPSAnJztcclxuICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID0gMDtcclxuICBhdXRoLnBhc3N3b3JkSGFzaCA9IGF3YWl0IGFwcC5jcnlwdG8uaGFzaChcclxuICAgIG5ld3Bhc3N3b3JkLFxyXG4gICk7XHJcbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFxyXG4gICAgdXNlckF1dGhGaWxlKHVzZXJuYW1lKSxcclxuICAgIGF1dGgsXHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBzY29yZVBhc3N3b3JkID0gYXBwID0+IHBhc3N3b3JkID0+IGFwaVdyYXBwZXJTeW5jKFxyXG4gIGFwcCxcclxuICBldmVudHMuYXV0aEFwaS5zY29yZVBhc3N3b3JkLFxyXG4gIGFsd2F5c0F1dGhvcml6ZWQsXHJcbiAgeyBwYXNzd29yZCB9LFxyXG4gIF9zY29yZVBhc3N3b3JkLCBwYXNzd29yZCxcclxuKTtcclxuXHJcbmV4cG9ydCBjb25zdCBfc2NvcmVQYXNzd29yZCA9IChwYXNzd29yZCkgPT4ge1xyXG4gIC8vIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTQ4MTcyL3Bhc3N3b3JkLXN0cmVuZ3RoLW1ldGVyXHJcbiAgLy8gdGhhbmsgeW91IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vdXNlcnMvNDY2MTcvdG0tbHZcclxuXHJcbiAgbGV0IHNjb3JlID0gMDtcclxuICBpZiAoIXBhc3N3b3JkKSB7IHJldHVybiBzY29yZTsgfVxyXG5cclxuICAvLyBhd2FyZCBldmVyeSB1bmlxdWUgbGV0dGVyIHVudGlsIDUgcmVwZXRpdGlvbnNcclxuICBjb25zdCBsZXR0ZXJzID0gbmV3IE9iamVjdCgpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGFzc3dvcmQubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldHRlcnNbcGFzc3dvcmRbaV1dID0gKGxldHRlcnNbcGFzc3dvcmRbaV1dIHx8IDApICsgMTtcclxuICAgIHNjb3JlICs9IDUuMCAvIGxldHRlcnNbcGFzc3dvcmRbaV1dO1xyXG4gIH1cclxuXHJcbiAgLy8gYm9udXMgcG9pbnRzIGZvciBtaXhpbmcgaXQgdXBcclxuICBjb25zdCB2YXJpYXRpb25zID0ge1xyXG4gICAgZGlnaXRzOiAvXFxkLy50ZXN0KHBhc3N3b3JkKSxcclxuICAgIGxvd2VyOiAvW2Etel0vLnRlc3QocGFzc3dvcmQpLFxyXG4gICAgdXBwZXI6IC9bQS1aXS8udGVzdChwYXNzd29yZCksXHJcbiAgICBub25Xb3JkczogL1xcVy8udGVzdChwYXNzd29yZCksXHJcbiAgfTtcclxuXHJcbiAgbGV0IHZhcmlhdGlvbkNvdW50ID0gMDtcclxuICBmb3IgKGNvbnN0IGNoZWNrIGluIHZhcmlhdGlvbnMpIHtcclxuICAgIHZhcmlhdGlvbkNvdW50ICs9ICh2YXJpYXRpb25zW2NoZWNrXSA9PSB0cnVlKSA/IDEgOiAwO1xyXG4gIH1cclxuICBzY29yZSArPSAodmFyaWF0aW9uQ291bnQgLSAxKSAqIDEwO1xyXG5cclxuICBjb25zdCBzdHJlbmd0aFRleHQgPSBzY29yZSA+IDgwXHJcbiAgICA/ICdzdHJvbmcnXHJcbiAgICA6IHNjb3JlID4gNjBcclxuICAgICAgPyAnZ29vZCdcclxuICAgICAgOiBzY29yZSA+PSAzMFxyXG4gICAgICAgID8gJ3dlYWsnXHJcbiAgICAgICAgOiAndmVyeSB3ZWFrJztcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHNjb3JlOiBwYXJzZUludChzY29yZSksXHJcbiAgICBzdHJlbmd0aFRleHQsXHJcbiAgfTtcclxufTtcclxuIiwiaW1wb3J0IHsgam9pbiwgc29tZSB9IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IHZhbGlkYXRlVXNlciB9IGZyb20gJy4vdmFsaWRhdGVVc2VyJztcclxuaW1wb3J0IHsgZ2V0TmV3VXNlckF1dGggfSBmcm9tICcuL2dldE5ld1VzZXInO1xyXG5pbXBvcnQge1xyXG4gIGdldExvY2ssIGlzTm9sb2NrLCByZWxlYXNlTG9jaywgYXBpV3JhcHBlciwgZXZlbnRzLFxyXG4gIGluc2Vuc2l0aXZlRXF1YWxzLCBpc05vbkVtcHR5U3RyaW5nLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7XHJcbiAgVVNFUlNfTE9DS19GSUxFLCBzdHJpcFVzZXJPZlNlbnNpdGl2ZVN0dWZmLFxyXG4gIFVTRVJTX0xJU1RfRklMRSwgdXNlckF1dGhGaWxlLFxyXG59IGZyb20gJy4vYXV0aENvbW1vbic7XHJcbmltcG9ydCB7IGdldFRlbXBvcmFyeUNvZGUgfSBmcm9tICcuL2NyZWF0ZVRlbXBvcmFyeUFjY2Vzcyc7XHJcbmltcG9ydCB7IGlzVmFsaWRQYXNzd29yZCB9IGZyb20gJy4vc2V0UGFzc3dvcmQnO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XHJcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZVVzZXIgPSBhcHAgPT4gYXN5bmMgKHVzZXIsIHBhc3N3b3JkID0gbnVsbCkgPT4gYXBpV3JhcHBlcihcclxuICBhcHAsXHJcbiAgZXZlbnRzLmF1dGhBcGkuY3JlYXRlVXNlcixcclxuICBwZXJtaXNzaW9uLmNyZWF0ZVVzZXIuaXNBdXRob3JpemVkLFxyXG4gIHsgdXNlciwgcGFzc3dvcmQgfSxcclxuICBfY3JlYXRlVXNlciwgYXBwLCB1c2VyLCBwYXNzd29yZCxcclxuKTtcclxuXHJcbmV4cG9ydCBjb25zdCBfY3JlYXRlVXNlciA9IGFzeW5jIChhcHAsIHVzZXIsIHBhc3N3b3JkID0gbnVsbCkgPT4ge1xyXG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRMb2NrKFxyXG4gICAgYXBwLCBVU0VSU19MT0NLX0ZJTEUsIDEwMDAsIDIsXHJcbiAgKTtcclxuXHJcbiAgaWYgKGlzTm9sb2NrKGxvY2spKSB7IHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGNyZWF0ZSB1c2VyLCBjb3VsZCBub3QgZ2V0IGxvY2sgLSB0cnkgYWdhaW4nKTsgfVxyXG5cclxuICBjb25zdCB1c2VycyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oVVNFUlNfTElTVF9GSUxFKTtcclxuXHJcbiAgY29uc3QgdXNlckVycm9ycyA9IHZhbGlkYXRlVXNlcihhcHApKFsuLi51c2VycywgdXNlcl0sIHVzZXIpO1xyXG4gIGlmICh1c2VyRXJyb3JzLmxlbmd0aCA+IDApIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgVXNlciBpcyBpbnZhbGlkLiAke2pvaW4oJzsgJykodXNlckVycm9ycyl9YCk7IH1cclxuXHJcbiAgY29uc3QgeyBhdXRoLCB0ZW1wQ29kZSwgdGVtcG9yYXJ5QWNjZXNzSWQgfSA9IGF3YWl0IGdldEFjY2VzcyhcclxuICAgIGFwcCwgcGFzc3dvcmQsXHJcbiAgKTtcclxuICB1c2VyLnRlbXBDb2RlID0gdGVtcENvZGU7XHJcbiAgdXNlci50ZW1wb3JhcnlBY2Nlc3NJZCA9IHRlbXBvcmFyeUFjY2Vzc0lkO1xyXG5cclxuICBpZiAoc29tZSh1ID0+IGluc2Vuc2l0aXZlRXF1YWxzKHUubmFtZSwgdXNlci5uYW1lKSkodXNlcnMpKSB7IFxyXG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignVXNlciBhbHJlYWR5IGV4aXN0cycpOyBcclxuICB9XHJcblxyXG4gIHVzZXJzLnB1c2goXHJcbiAgICBzdHJpcFVzZXJPZlNlbnNpdGl2ZVN0dWZmKHVzZXIpLFxyXG4gICk7XHJcblxyXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcclxuICAgIFVTRVJTX0xJU1RfRklMRSxcclxuICAgIHVzZXJzLFxyXG4gICk7XHJcblxyXG4gIHRyeSB7XHJcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmNyZWF0ZUpzb24oXHJcbiAgICAgIHVzZXJBdXRoRmlsZSh1c2VyLm5hbWUpLFxyXG4gICAgICBhdXRoLFxyXG4gICAgKTtcclxuICB9IGNhdGNoIChfKSB7XHJcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXHJcbiAgICAgIHVzZXJBdXRoRmlsZSh1c2VyLm5hbWUpLFxyXG4gICAgICBhdXRoLFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGF3YWl0IHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XHJcblxyXG4gIHJldHVybiB1c2VyO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0QWNjZXNzID0gYXN5bmMgKGFwcCwgcGFzc3dvcmQpID0+IHtcclxuICBjb25zdCBhdXRoID0gZ2V0TmV3VXNlckF1dGgoYXBwKSgpO1xyXG5cclxuICBpZiAoaXNOb25FbXB0eVN0cmluZyhwYXNzd29yZCkpIHtcclxuICAgIGlmIChpc1ZhbGlkUGFzc3dvcmQocGFzc3dvcmQpKSB7XHJcbiAgICAgIGF1dGgucGFzc3dvcmRIYXNoID0gYXdhaXQgYXBwLmNyeXB0by5oYXNoKHBhc3N3b3JkKTtcclxuICAgICAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoID0gJyc7XHJcbiAgICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzSWQgPSAnJztcclxuICAgICAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA9IDA7XHJcbiAgICAgIHJldHVybiB7IGF1dGggfTtcclxuICAgIH1cclxuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ1Bhc3N3b3JkIGRvZXMgbm90IG1lZXQgcmVxdWlyZW1lbnRzJyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnN0IHRlbXBBY2Nlc3MgPSBhd2FpdCBnZXRUZW1wb3JhcnlDb2RlKGFwcCk7XHJcbiAgICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2ggPSB0ZW1wQWNjZXNzLnRlbXBvcmFyeUFjY2Vzc0hhc2g7XHJcbiAgICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID0gdGVtcEFjY2Vzcy50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaDtcclxuICAgIGF1dGgucGFzc3dvcmRIYXNoID0gJyc7XHJcbiAgICByZXR1cm4gKHtcclxuICAgICAgYXV0aCxcclxuICAgICAgdGVtcENvZGU6IHRlbXBBY2Nlc3MudGVtcENvZGUsXHJcbiAgICAgIHRlbXBvcmFyeUFjY2Vzc0lkOiB0ZW1wQWNjZXNzLnRlbXBvcmFyeUFjY2Vzc0lkLFxyXG4gICAgfSk7XHJcbiAgfVxyXG59O1xyXG4iLCJpbXBvcnQge1xyXG4gIGdldExvY2ssXHJcbiAgaXNOb2xvY2ssIHJlbGVhc2VMb2NrLFxyXG59IGZyb20gJy4uL2NvbW1vbi9sb2NrJztcclxuaW1wb3J0IHsgVVNFUlNfTE9DS19GSUxFLCBVU0VSU19MSVNUX0ZJTEUsIGdldFVzZXJCeU5hbWUgfSBmcm9tICcuL2F1dGhDb21tb24nO1xyXG5pbXBvcnQgeyBhcGlXcmFwcGVyLCBldmVudHMgfSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XHJcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcclxuXHJcbmV4cG9ydCBjb25zdCBlbmFibGVVc2VyID0gYXBwID0+IGFzeW5jIHVzZXJuYW1lID0+IGFwaVdyYXBwZXIoXHJcbiAgYXBwLFxyXG4gIGV2ZW50cy5hdXRoQXBpLmVuYWJsZVVzZXIsXHJcbiAgcGVybWlzc2lvbi5lbmFibGVEaXNhYmxlVXNlci5pc0F1dGhvcml6ZWQsXHJcbiAgeyB1c2VybmFtZSB9LFxyXG4gIF9lbmFibGVVc2VyLCBhcHAsIHVzZXJuYW1lLFxyXG4pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRpc2FibGVVc2VyID0gYXBwID0+IGFzeW5jIHVzZXJuYW1lID0+IGFwaVdyYXBwZXIoXHJcbiAgYXBwLFxyXG4gIGV2ZW50cy5hdXRoQXBpLmRpc2FibGVVc2VyLFxyXG4gIHBlcm1pc3Npb24uZW5hYmxlRGlzYWJsZVVzZXIuaXNBdXRob3JpemVkLFxyXG4gIHsgdXNlcm5hbWUgfSxcclxuICBfZGlzYWJsZVVzZXIsIGFwcCwgdXNlcm5hbWUsXHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgX2VuYWJsZVVzZXIgPSBhc3luYyAoYXBwLCB1c2VybmFtZSkgPT4gYXdhaXQgdG9nZ2xlVXNlcihhcHAsIHVzZXJuYW1lLCB0cnVlKTtcclxuXHJcbmV4cG9ydCBjb25zdCBfZGlzYWJsZVVzZXIgPSBhc3luYyAoYXBwLCB1c2VybmFtZSkgPT4gYXdhaXQgdG9nZ2xlVXNlcihhcHAsIHVzZXJuYW1lLCBmYWxzZSk7XHJcblxyXG5jb25zdCB0b2dnbGVVc2VyID0gYXN5bmMgKGFwcCwgdXNlcm5hbWUsIGVuYWJsZWQpID0+IHtcclxuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhhcHAsIFVTRVJTX0xPQ0tfRklMRSwgMTAwMCwgMSwgMCk7XHJcblxyXG4gIGNvbnN0IGFjdGlvbk5hbWUgPSBlbmFibGVkID8gJ2VuYWJsZScgOiAnZGlzYWJsZSc7XHJcblxyXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCAke2FjdGlvbk5hbWV9IHVzZXIgLSBjYW5ub3QgZ2V0IGxvY2tgKTsgfVxyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSk7XHJcbiAgICBjb25zdCB1c2VyID0gZ2V0VXNlckJ5TmFtZSh1c2VycywgdXNlcm5hbWUpO1xyXG4gICAgaWYgKCF1c2VyKSB7IHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGBDb3VsZCBub3QgZmluZCB1c2VyIHRvICR7YWN0aW9uTmFtZX1gKTsgfVxyXG5cclxuICAgIGlmICh1c2VyLmVuYWJsZWQgPT09ICFlbmFibGVkKSB7XHJcbiAgICAgIHVzZXIuZW5hYmxlZCA9IGVuYWJsZWQ7XHJcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihVU0VSU19MSVNUX0ZJTEUsIHVzZXJzKTtcclxuICAgIH1cclxuICB9IGZpbmFsbHkge1xyXG4gICAgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcclxuICB9XHJcbn07XHJcbiIsImV4cG9ydCBjb25zdCBnZXROZXdBY2Nlc3NMZXZlbCA9ICgpID0+ICgpID0+ICh7XHJcbiAgbmFtZTogJycsXHJcbiAgcGVybWlzc2lvbnM6IFtdLFxyXG4gIGRlZmF1bHQ6ZmFsc2VcclxufSk7XHJcbiIsImltcG9ydCB7XHJcbiAgdmFsdWVzLCBpbmNsdWRlcywgbWFwLCBjb25jYXQsIGlzRW1wdHksIHVuaXFXaXRoLCBzb21lLFxyXG4gIGZsYXR0ZW4sIGZpbHRlcixcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uVHlwZXMgfSBmcm9tICcuL2F1dGhDb21tb24nO1xyXG5pbXBvcnQge1xyXG4gICQsIGlzU29tZXRoaW5nLCBpbnNlbnNpdGl2ZUVxdWFscyxcclxuICBpc05vbkVtcHR5U3RyaW5nLCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IGdldE5vZGUgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XHJcblxyXG5jb25zdCBpc0FsbG93ZWRUeXBlID0gdCA9PiAkKHBlcm1pc3Npb25UeXBlcywgW1xyXG4gIHZhbHVlcyxcclxuICBpbmNsdWRlcyh0KSxcclxuXSk7XHJcblxyXG5jb25zdCBpc1JlY29yZE9ySW5kZXhUeXBlID0gdCA9PiBzb21lKHAgPT4gcCA9PT0gdCkoW1xyXG4gIHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfUkVDT1JELFxyXG4gIHBlcm1pc3Npb25UeXBlcy5VUERBVEVfUkVDT1JELFxyXG4gIHBlcm1pc3Npb25UeXBlcy5ERUxFVEVfUkVDT1JELFxyXG4gIHBlcm1pc3Npb25UeXBlcy5SRUFEX1JFQ09SRCxcclxuICBwZXJtaXNzaW9uVHlwZXMuUkVBRF9JTkRFWCxcclxuICBwZXJtaXNzaW9uVHlwZXMuRVhFQ1VURV9BQ1RJT04sXHJcbl0pO1xyXG5cclxuXHJcbmNvbnN0IHBlcm1pc3Npb25SdWxlcyA9IGFwcCA9PiAoW1xyXG4gIG1ha2VydWxlKCd0eXBlJywgJ3R5cGUgbXVzdCBiZSBvbmUgb2YgYWxsb3dlZCB0eXBlcycsXHJcbiAgICBwID0+IGlzQWxsb3dlZFR5cGUocC50eXBlKSksXHJcbiAgbWFrZXJ1bGUoJ25vZGVLZXknLCAncmVjb3JkIGFuZCBpbmRleCBwZXJtaXNzaW9ucyBtdXN0IGluY2x1ZGUgYSB2YWxpZCBub2RlS2V5JyxcclxuICAgIHAgPT4gKCFpc1JlY29yZE9ySW5kZXhUeXBlKHAudHlwZSkpXHJcbiAgICAgICAgICAgICB8fCBpc1NvbWV0aGluZyhnZXROb2RlKGFwcC5oaWVyYXJjaHksIHAubm9kZUtleSkpKSxcclxuXSk7XHJcblxyXG5jb25zdCBhcHBseVBlcm1pc3Npb25SdWxlcyA9IGFwcCA9PiBhcHBseVJ1bGVTZXQocGVybWlzc2lvblJ1bGVzKGFwcCkpO1xyXG5cclxuY29uc3QgYWNjZXNzTGV2ZWxSdWxlcyA9IGFsbExldmVscyA9PiAoW1xyXG4gIG1ha2VydWxlKCduYW1lJywgJ25hbWUgbXVzdCBiZSBzZXQnLFxyXG4gICAgbCA9PiBpc05vbkVtcHR5U3RyaW5nKGwubmFtZSkpLFxyXG4gIG1ha2VydWxlKCduYW1lJywgJ2FjY2VzcyBsZXZlbCBuYW1lcyBtdXN0IGJlIHVuaXF1ZScsXHJcbiAgICBsID0+IGlzRW1wdHkobC5uYW1lKVxyXG4gICAgICAgICAgICAgfHwgZmlsdGVyKGEgPT4gaW5zZW5zaXRpdmVFcXVhbHMobC5uYW1lLCBhLm5hbWUpKShhbGxMZXZlbHMpLmxlbmd0aCA9PT0gMSksXHJcbl0pO1xyXG5cclxuY29uc3QgYXBwbHlMZXZlbFJ1bGVzID0gYWxsTGV2ZWxzID0+IGFwcGx5UnVsZVNldChhY2Nlc3NMZXZlbFJ1bGVzKGFsbExldmVscykpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWNjZXNzTGV2ZWwgPSBhcHAgPT4gKGFsbExldmVscywgbGV2ZWwpID0+IHtcclxuICBjb25zdCBlcnJzID0gJChsZXZlbC5wZXJtaXNzaW9ucywgW1xyXG4gICAgbWFwKGFwcGx5UGVybWlzc2lvblJ1bGVzKGFwcCkpLFxyXG4gICAgZmxhdHRlbixcclxuICAgIGNvbmNhdChcclxuICAgICAgYXBwbHlMZXZlbFJ1bGVzKGFsbExldmVscykobGV2ZWwpLFxyXG4gICAgKSxcclxuICBdKTtcclxuXHJcbiAgcmV0dXJuIGVycnM7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBY2Nlc3NMZXZlbHMgPSBhcHAgPT4gYWxsTGV2ZWxzID0+IGFwaVdyYXBwZXJTeW5jKFxyXG4gIGFwcCxcclxuICBldmVudHMuYXV0aEFwaS52YWxpZGF0ZUFjY2Vzc0xldmVscyxcclxuICBhbHdheXNBdXRob3JpemVkLFxyXG4gIHsgYWxsTGV2ZWxzIH0sXHJcbiAgX3ZhbGlkYXRlQWNjZXNzTGV2ZWxzLCBhcHAsIGFsbExldmVscyxcclxuKTtcclxuXHJcbmV4cG9ydCBjb25zdCBfdmFsaWRhdGVBY2Nlc3NMZXZlbHMgPSAoYXBwLCBhbGxMZXZlbHMpID0+ICQoYWxsTGV2ZWxzLCBbXHJcbiAgbWFwKGwgPT4gdmFsaWRhdGVBY2Nlc3NMZXZlbChhcHApKGFsbExldmVscywgbCkpLFxyXG4gIGZsYXR0ZW4sXHJcbiAgdW5pcVdpdGgoKHgsIHkpID0+IHguZmllbGQgPT09IHkuZmllbGRcclxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgeC5pdGVtID09PSB5Lml0ZW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgeC5lcnJvciA9PT0geS5lcnJvciksXHJcbl0pO1xyXG4iLCJpbXBvcnQgeyBqb2luLCBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQge1xyXG4gIGdldExvY2ssIHJlbGVhc2VMb2NrLCAkLFxyXG4gIGlzTm9sb2NrLCBhcGlXcmFwcGVyLCBldmVudHMsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHtcclxuICBBQ0NFU1NfTEVWRUxTX0xPQ0tfRklMRSxcclxuICBBQ0NFU1NfTEVWRUxTX0ZJTEUsXHJcbn0gZnJvbSAnLi9hdXRoQ29tbW9uJztcclxuaW1wb3J0IHsgdmFsaWRhdGVBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL3ZhbGlkYXRlQWNjZXNzTGV2ZWxzJztcclxuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNhdmVBY2Nlc3NMZXZlbHMgPSBhcHAgPT4gYXN5bmMgYWNjZXNzTGV2ZWxzID0+IGFwaVdyYXBwZXIoXHJcbiAgYXBwLFxyXG4gIGV2ZW50cy5hdXRoQXBpLnNhdmVBY2Nlc3NMZXZlbHMsXHJcbiAgcGVybWlzc2lvbi53cml0ZUFjY2Vzc0xldmVscy5pc0F1dGhvcml6ZWQsXHJcbiAgeyBhY2Nlc3NMZXZlbHMgfSxcclxuICBfc2F2ZUFjY2Vzc0xldmVscywgYXBwLCBhY2Nlc3NMZXZlbHMsXHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgX3NhdmVBY2Nlc3NMZXZlbHMgPSBhc3luYyAoYXBwLCBhY2Nlc3NMZXZlbHMpID0+IHtcclxuICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGVBY2Nlc3NMZXZlbHMoYXBwKShhY2Nlc3NMZXZlbHMubGV2ZWxzKTtcclxuICBpZiAodmFsaWRhdGlvbkVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICBjb25zdCBlcnJzID0gJCh2YWxpZGF0aW9uRXJyb3JzLCBbXHJcbiAgICAgIG1hcChlID0+IGUuZXJyb3IpLFxyXG4gICAgICBqb2luKCcsICcpLFxyXG4gICAgXSk7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgIGBBY2Nlc3MgTGV2ZWxzIEludmFsaWQ6ICR7ZXJyc31gLFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRMb2NrKFxyXG4gICAgYXBwLCBBQ0NFU1NfTEVWRUxTX0xPQ0tfRklMRSwgMjAwMCwgMixcclxuICApO1xyXG5cclxuICBpZiAoaXNOb2xvY2sobG9jaykpIHsgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZ2V0IGxvY2sgdG8gc2F2ZSBhY2Nlc3MgbGV2ZWxzJyk7IH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihBQ0NFU1NfTEVWRUxTX0ZJTEUpO1xyXG4gICAgaWYgKGV4aXN0aW5nLnZlcnNpb24gIT09IGFjY2Vzc0xldmVscy52ZXJzaW9uKSB7IHRocm93IG5ldyBFcnJvcignQWNjZXNzIGxldmVscyBoYXZlIGFscmVhZHkgYmVlbiB1cGRhdGVkLCBzaW5jZSB5b3UgbG9hZGVkJyk7IH1cclxuXHJcbiAgICBhY2Nlc3NMZXZlbHMudmVyc2lvbisrO1xyXG5cclxuICAgIGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihBQ0NFU1NfTEVWRUxTX0ZJTEUsIGFjY2Vzc0xldmVscyk7XHJcbiAgfSBmaW5hbGx5IHtcclxuICAgIGF3YWl0IHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XHJcbiAgfVxyXG59O1xyXG4iLCJpbXBvcnQge1xyXG4gIGZpbHRlciwgdmFsdWVzLCBlYWNoLCBrZXlzLFxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcclxuaW1wb3J0IHtcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbiAgaXNJbmRleCwgaXNSZWNvcmQsXHJcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHsgJCB9IGZyb20gJy4uL2NvbW1vbic7XHJcblxyXG5leHBvcnQgY29uc3QgZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMgPSAoYXBwKSA9PiB7XHJcbiAgY29uc3QgYWxsTm9kZXMgPSBnZXRGbGF0dGVuZWRIaWVyYXJjaHkoYXBwLmhpZXJhcmNoeSk7XHJcbiAgY29uc3QgYWNjZXNzTGV2ZWwgPSB7IHBlcm1pc3Npb25zOiBbXSB9O1xyXG5cclxuICBjb25zdCByZWNvcmROb2RlcyA9ICQoYWxsTm9kZXMsIFtcclxuICAgIGZpbHRlcihpc1JlY29yZCksXHJcbiAgXSk7XHJcblxyXG4gIGZvciAoY29uc3QgbiBvZiByZWNvcmROb2Rlcykge1xyXG4gICAgcGVybWlzc2lvbi5jcmVhdGVSZWNvcmQuYWRkKG4ubm9kZUtleSgpLCBhY2Nlc3NMZXZlbCk7XHJcbiAgICBwZXJtaXNzaW9uLnVwZGF0ZVJlY29yZC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcclxuICAgIHBlcm1pc3Npb24uZGVsZXRlUmVjb3JkLmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xyXG4gICAgcGVybWlzc2lvbi5yZWFkUmVjb3JkLmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgaW5kZXhOb2RlcyA9ICQoYWxsTm9kZXMsIFtcclxuICAgIGZpbHRlcihpc0luZGV4KSxcclxuICBdKTtcclxuXHJcbiAgZm9yIChjb25zdCBuIG9mIGluZGV4Tm9kZXMpIHtcclxuICAgIHBlcm1pc3Npb24ucmVhZEluZGV4LmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xyXG4gIH1cclxuXHJcbiAgZm9yIChjb25zdCBhIG9mIGtleXMoYXBwLmFjdGlvbnMpKSB7XHJcbiAgICBwZXJtaXNzaW9uLmV4ZWN1dGVBY3Rpb24uYWRkKGEsIGFjY2Vzc0xldmVsKTtcclxuICB9XHJcblxyXG4gICQocGVybWlzc2lvbiwgW1xyXG4gICAgdmFsdWVzLFxyXG4gICAgZmlsdGVyKHAgPT4gIXAuaXNOb2RlKSxcclxuICAgIGVhY2gocCA9PiBwLmFkZChhY2Nlc3NMZXZlbCkpLFxyXG4gIF0pO1xyXG5cclxuICByZXR1cm4gYWNjZXNzTGV2ZWwucGVybWlzc2lvbnM7XHJcbn07XHJcbiIsImltcG9ydCB7IGRpZmZlcmVuY2UsIG1hcCwgam9pbiB9IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7XHJcbiAgZ2V0TG9jaywgaXNOb2xvY2ssIHJlbGVhc2VMb2NrLCAkLFxyXG4gIGFwaVdyYXBwZXIsIGV2ZW50cyxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQge1xyXG4gIFVTRVJTX0xPQ0tfRklMRSwgQUNDRVNTX0xFVkVMU19GSUxFLFxyXG4gIGdldFVzZXJCeU5hbWUsIFVTRVJTX0xJU1RfRklMRSxcclxufSBmcm9tICcuL2F1dGhDb21tb24nO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XHJcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcclxuXHJcbmV4cG9ydCBjb25zdCBzZXRVc2VyQWNjZXNzTGV2ZWxzID0gYXBwID0+IGFzeW5jICh1c2VyTmFtZSwgYWNjZXNzTGV2ZWxzKSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMuYXV0aEFwaS5zZXRVc2VyQWNjZXNzTGV2ZWxzLFxyXG4gIHBlcm1pc3Npb24uc2V0VXNlckFjY2Vzc0xldmVscy5pc0F1dGhvcml6ZWQsXHJcbiAgeyB1c2VyTmFtZSwgYWNjZXNzTGV2ZWxzIH0sXHJcbiAgX3NldFVzZXJBY2Nlc3NMZXZlbHMsIGFwcCwgdXNlck5hbWUsIGFjY2Vzc0xldmVscyxcclxuKTtcclxuXHJcbmV4cG9ydCBjb25zdCBfc2V0VXNlckFjY2Vzc0xldmVscyA9IGFzeW5jIChhcHAsIHVzZXJuYW1lLCBhY2Nlc3NMZXZlbHMpID0+IHtcclxuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhhcHAsIFVTRVJTX0xPQ0tfRklMRSwgMTAwMCwgMSwgMCk7XHJcblxyXG4gIGNvbnN0IGFjdHVhbEFjY2Vzc0xldmVscyA9ICQoXHJcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKEFDQ0VTU19MRVZFTFNfRklMRSksXHJcbiAgICBbXHJcbiAgICAgIGwgPT4gbC5sZXZlbHMsXHJcbiAgICAgIG1hcChsID0+IGwubmFtZSksXHJcbiAgICBdLFxyXG4gICk7XHJcblxyXG4gIGNvbnN0IG1pc3NpbmcgPSBkaWZmZXJlbmNlKGFjY2Vzc0xldmVscykoYWN0dWFsQWNjZXNzTGV2ZWxzKTtcclxuICBpZiAobWlzc2luZy5sZW5ndGggPiAwKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgYWNjZXNzIGxldmVscyBzdXBwbGllZDogJHtqb2luKCcsICcsIG1pc3NpbmcpfWApO1xyXG4gIH1cclxuXHJcbiAgaWYgKGlzTm9sb2NrKGxvY2spKSB7IHRocm93IG5ldyBFcnJvcignQ291bGQgc2V0IHVzZXIgYWNjZXNzIGxldmVscyBjYW5ub3QgZ2V0IGxvY2snKTsgfVxyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSk7XHJcbiAgICBjb25zdCB1c2VyID0gZ2V0VXNlckJ5TmFtZSh1c2VycywgdXNlcm5hbWUpO1xyXG4gICAgaWYgKCF1c2VyKSB7IHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGBDb3VsZCBub3QgZmluZCB1c2VyIHdpdGggJHt1c2VybmFtZX1gKTsgfVxyXG5cclxuICAgIHVzZXIuYWNjZXNzTGV2ZWxzID0gYWNjZXNzTGV2ZWxzO1xyXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFVTRVJTX0xJU1RfRklMRSwgdXNlcnMpO1xyXG4gIH0gZmluYWxseSB7XHJcbiAgICByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xyXG4gIH1cclxufTtcclxuIiwiaW1wb3J0IHtcclxuICBhdXRoZW50aWNhdGUsXHJcbiAgYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzLFxyXG59IGZyb20gJy4vYXV0aGVudGljYXRlJztcclxuaW1wb3J0IHsgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzIH0gZnJvbSAnLi9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MnO1xyXG5pbXBvcnQgeyBjcmVhdGVVc2VyIH0gZnJvbSAnLi9jcmVhdGVVc2VyJztcclxuaW1wb3J0IHsgZW5hYmxlVXNlciwgZGlzYWJsZVVzZXIgfSBmcm9tICcuL2VuYWJsZVVzZXInO1xyXG5pbXBvcnQgeyBsb2FkQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi9sb2FkQWNjZXNzTGV2ZWxzJztcclxuaW1wb3J0IHsgZ2V0TmV3QWNjZXNzTGV2ZWwgfSBmcm9tICcuL2dldE5ld0FjY2Vzc0xldmVsJztcclxuaW1wb3J0IHsgZ2V0TmV3VXNlciwgZ2V0TmV3VXNlckF1dGggfSBmcm9tICcuL2dldE5ld1VzZXInO1xyXG5pbXBvcnQgeyBnZXRVc2VycyB9IGZyb20gJy4vZ2V0VXNlcnMnO1xyXG5pbXBvcnQgeyBpc0F1dGhvcml6ZWQgfSBmcm9tICcuL2lzQXV0aG9yaXplZCc7XHJcbmltcG9ydCB7IHNhdmVBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL3NhdmVBY2Nlc3NMZXZlbHMnO1xyXG5pbXBvcnQge1xyXG4gIGNoYW5nZU15UGFzc3dvcmQsXHJcbiAgc2NvcmVQYXNzd29yZCwgc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZSxcclxuICBpc1ZhbGlkUGFzc3dvcmQsXHJcbn0gZnJvbSAnLi9zZXRQYXNzd29yZCc7XHJcbmltcG9ydCB7IHZhbGlkYXRlVXNlciB9IGZyb20gJy4vdmFsaWRhdGVVc2VyJztcclxuaW1wb3J0IHsgdmFsaWRhdGVBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL3ZhbGlkYXRlQWNjZXNzTGV2ZWxzJztcclxuaW1wb3J0IHsgZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMgfSBmcm9tICcuL2dlbmVyYXRlRnVsbFBlcm1pc3Npb25zJztcclxuaW1wb3J0IHsgc2V0VXNlckFjY2Vzc0xldmVscyB9IGZyb20gJy4vc2V0VXNlckFjY2Vzc0xldmVscyc7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0QXV0aEFwaSA9IGFwcCA9PiAoe1xyXG4gIGF1dGhlbnRpY2F0ZTogYXV0aGVudGljYXRlKGFwcCksXHJcbiAgYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzOiBhdXRoZW50aWNhdGVUZW1wb3JhcnlBY2Nlc3MoYXBwKSxcclxuICBjcmVhdGVUZW1wb3JhcnlBY2Nlc3M6IGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyhhcHApLFxyXG4gIGNyZWF0ZVVzZXI6IGNyZWF0ZVVzZXIoYXBwKSxcclxuICBsb2FkQWNjZXNzTGV2ZWxzOiBsb2FkQWNjZXNzTGV2ZWxzKGFwcCksXHJcbiAgZW5hYmxlVXNlcjogZW5hYmxlVXNlcihhcHApLFxyXG4gIGRpc2FibGVVc2VyOiBkaXNhYmxlVXNlcihhcHApLFxyXG4gIGdldE5ld0FjY2Vzc0xldmVsOiBnZXROZXdBY2Nlc3NMZXZlbChhcHApLFxyXG4gIGdldE5ld1VzZXI6IGdldE5ld1VzZXIoYXBwKSxcclxuICBnZXROZXdVc2VyQXV0aDogZ2V0TmV3VXNlckF1dGgoYXBwKSxcclxuICBnZXRVc2VyczogZ2V0VXNlcnMoYXBwKSxcclxuICBzYXZlQWNjZXNzTGV2ZWxzOiBzYXZlQWNjZXNzTGV2ZWxzKGFwcCksXHJcbiAgaXNBdXRob3JpemVkOiBpc0F1dGhvcml6ZWQoYXBwKSxcclxuICBjaGFuZ2VNeVBhc3N3b3JkOiBjaGFuZ2VNeVBhc3N3b3JkKGFwcCksXHJcbiAgc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZTogc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZShhcHApLFxyXG4gIHNjb3JlUGFzc3dvcmQsXHJcbiAgaXNWYWxpZFBhc3N3b3JkOiBpc1ZhbGlkUGFzc3dvcmQoYXBwKSxcclxuICB2YWxpZGF0ZVVzZXI6IHZhbGlkYXRlVXNlcihhcHApLFxyXG4gIHZhbGlkYXRlQWNjZXNzTGV2ZWxzOiB2YWxpZGF0ZUFjY2Vzc0xldmVscyhhcHApLFxyXG4gIGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zOiAoKSA9PiBnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucyhhcHApLFxyXG4gIHNldFVzZXJBY2Nlc3NMZXZlbHM6IHNldFVzZXJBY2Nlc3NMZXZlbHMoYXBwKSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXRBdXRoQXBpO1xyXG4iLCJpbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XHJcbmltcG9ydCB7IGFwaVdyYXBwZXJTeW5jIH0gZnJvbSAnLi4vY29tbW9uL2FwaVdyYXBwZXInO1xyXG5pbXBvcnQgeyBldmVudHMgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcclxuXHJcbmV4cG9ydCBjb25zdCBleGVjdXRlQWN0aW9uID0gYXBwID0+IChhY3Rpb25OYW1lLCBvcHRpb25zKSA9PiB7XHJcbiAgYXBpV3JhcHBlclN5bmMoXHJcbiAgICBhcHAsXHJcbiAgICBldmVudHMuYWN0aW9uc0FwaS5leGVjdXRlLFxyXG4gICAgcGVybWlzc2lvbi5leGVjdXRlQWN0aW9uLmlzQXV0aG9yaXplZChhY3Rpb25OYW1lKSxcclxuICAgIHsgYWN0aW9uTmFtZSwgb3B0aW9ucyB9LFxyXG4gICAgYXBwLmFjdGlvbnNbYWN0aW9uTmFtZV0sIG9wdGlvbnMsXHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBfZXhlY3V0ZUFjdGlvbiA9IChiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb24sIG9wdGlvbnMpID0+IGJlaGF2aW91clNvdXJjZXNbYWN0aW9uLmJlaGF2aW91clNvdXJjZV1bYWN0aW9uLmJlaGF2aW91ck5hbWVdKG9wdGlvbnMpO1xyXG4iLCJpbXBvcnQgeyBleGVjdXRlQWN0aW9uIH0gZnJvbSAnLi9leGVjdXRlJztcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRBY3Rpb25zQXBpID0gYXBwID0+ICh7XHJcbiAgZXhlY3V0ZTogZXhlY3V0ZUFjdGlvbihhcHApLFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldEFjdGlvbnNBcGk7XHJcbiIsImltcG9ydCB7IGhhcyB9IGZyb20gJ2xvZGFzaCc7XHJcblxyXG5jb25zdCBwdWJsaXNoID0gaGFuZGxlcnMgPT4gYXN5bmMgKGV2ZW50TmFtZSwgY29udGV4dCA9IHt9KSA9PiB7XHJcbiAgaWYgKCFoYXMoaGFuZGxlcnMsIGV2ZW50TmFtZSkpIHJldHVybjtcclxuXHJcbiAgZm9yIChjb25zdCBoYW5kbGVyIG9mIGhhbmRsZXJzW2V2ZW50TmFtZV0pIHtcclxuICAgIGF3YWl0IGhhbmRsZXIoZXZlbnROYW1lLCBjb250ZXh0KTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBzdWJzY3JpYmUgPSBoYW5kbGVycyA9PiAoZXZlbnROYW1lLCBoYW5kbGVyKSA9PiB7XHJcbiAgaWYgKCFoYXMoaGFuZGxlcnMsIGV2ZW50TmFtZSkpIHtcclxuICAgIGhhbmRsZXJzW2V2ZW50TmFtZV0gPSBbXTtcclxuICB9XHJcbiAgaGFuZGxlcnNbZXZlbnROYW1lXS5wdXNoKGhhbmRsZXIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZUV2ZW50QWdncmVnYXRvciA9ICgpID0+IHtcclxuICBjb25zdCBoYW5kbGVycyA9IHt9O1xyXG4gIGNvbnN0IGV2ZW50QWdncmVnYXRvciA9ICh7XHJcbiAgICBwdWJsaXNoOiBwdWJsaXNoKGhhbmRsZXJzKSxcclxuICAgIHN1YnNjcmliZTogc3Vic2NyaWJlKGhhbmRsZXJzKSxcclxuICB9KTtcclxuICByZXR1cm4gZXZlbnRBZ2dyZWdhdG9yO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRXZlbnRBZ2dyZWdhdG9yO1xyXG4iLCJpbXBvcnQgeyByZXRyeSB9IGZyb20gJy4uL2NvbW1vbi9pbmRleCc7XHJcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcclxuXHJcbmNvbnN0IGNyZWF0ZUpzb24gPSBvcmlnaW5hbENyZWF0ZUZpbGUgPT4gYXN5bmMgKGtleSwgb2JqLCByZXRyaWVzID0gNSwgZGVsYXkgPSA1MDApID0+IGF3YWl0IHJldHJ5KG9yaWdpbmFsQ3JlYXRlRmlsZSwgcmV0cmllcywgZGVsYXksIGtleSwgSlNPTi5zdHJpbmdpZnkob2JqKSk7XHJcblxyXG5jb25zdCBjcmVhdGVOZXdGaWxlID0gb3JpZ2luYWxDcmVhdGVGaWxlID0+IGFzeW5jIChwYXRoLCBjb250ZW50LCByZXRyaWVzID0gNSwgZGVsYXkgPSA1MDApID0+IGF3YWl0IHJldHJ5KG9yaWdpbmFsQ3JlYXRlRmlsZSwgcmV0cmllcywgZGVsYXksIHBhdGgsIGNvbnRlbnQpO1xyXG5cclxuY29uc3QgbG9hZEpzb24gPSBkYXRhc3RvcmUgPT4gYXN5bmMgKGtleSwgcmV0cmllcyA9IDUsIGRlbGF5ID0gNTAwKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBhd2FpdCByZXRyeShKU09OLnBhcnNlLCByZXRyaWVzLCBkZWxheSwgYXdhaXQgZGF0YXN0b3JlLmxvYWRGaWxlKGtleSkpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoZXJyLm1lc3NhZ2UpO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgdXBkYXRlSnNvbiA9IGRhdGFzdG9yZSA9PiBhc3luYyAoa2V5LCBvYmosIHJldHJpZXMgPSA1LCBkZWxheSA9IDUwMCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgcmV0cnkoZGF0YXN0b3JlLnVwZGF0ZUZpbGUsIHJldHJpZXMsIGRlbGF5LCBrZXksIEpTT04uc3RyaW5naWZ5KG9iaikpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoZXJyLm1lc3NhZ2UpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldHVwRGF0YXN0b3JlID0gKGRhdGFzdG9yZSkgPT4ge1xyXG4gIGNvbnN0IG9yaWdpbmFsQ3JlYXRlRmlsZSA9IGRhdGFzdG9yZS5jcmVhdGVGaWxlO1xyXG4gIGRhdGFzdG9yZS5sb2FkSnNvbiA9IGxvYWRKc29uKGRhdGFzdG9yZSk7XHJcbiAgZGF0YXN0b3JlLmNyZWF0ZUpzb24gPSBjcmVhdGVKc29uKG9yaWdpbmFsQ3JlYXRlRmlsZSk7XHJcbiAgZGF0YXN0b3JlLnVwZGF0ZUpzb24gPSB1cGRhdGVKc29uKGRhdGFzdG9yZSk7XHJcbiAgZGF0YXN0b3JlLmNyZWF0ZUZpbGUgPSBjcmVhdGVOZXdGaWxlKG9yaWdpbmFsQ3JlYXRlRmlsZSk7XHJcbiAgaWYgKGRhdGFzdG9yZS5jcmVhdGVFbXB0eURiKSB7IGRlbGV0ZSBkYXRhc3RvcmUuY3JlYXRlRW1wdHlEYjsgfVxyXG4gIHJldHVybiBkYXRhc3RvcmU7XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVFdmVudEFnZ3JlZ2F0b3IgfSBmcm9tICcuL2V2ZW50QWdncmVnYXRvcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBzZXR1cERhdGFzdG9yZTtcclxuIiwiaW1wb3J0IHsgXHJcbiAgY29tcGlsZUV4cHJlc3Npb24gYXMgY0V4cCwgXHJcbiAgY29tcGlsZUNvZGUgYXMgY0NvZGUgXHJcbn0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbXBpbGVDb2RlID0gY29kZSA9PiB7XHJcbiAgbGV0IGZ1bmM7ICBcclxuICAgIFxyXG4gIHRyeSB7XHJcbiAgICBmdW5jID0gY0NvZGUoY29kZSk7XHJcbiAgfSBjYXRjaChlKSB7XHJcbiAgICBlLm1lc3NhZ2UgPSBgRXJyb3IgY29tcGlsaW5nIGNvZGUgOiAke2NvZGV9IDogJHtlLm1lc3NhZ2V9YDtcclxuICAgIHRocm93IGU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZnVuYztcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNvbXBpbGVFeHByZXNzaW9uID0gY29kZSA9PiB7XHJcbiAgbGV0IGZ1bmM7ICBcclxuICAgICAgXHJcbiAgdHJ5IHtcclxuICAgIGZ1bmMgPSBjRXhwKGNvZGUpO1xyXG4gIH0gY2F0Y2goZSkge1xyXG4gICAgZS5tZXNzYWdlID0gYEVycm9yIGNvbXBpbGluZyBleHByZXNzaW9uIDogJHtjb2RlfSA6ICR7ZS5tZXNzYWdlfWA7XHJcbiAgICB0aHJvdyBlO1xyXG4gIH1cclxuICBcclxuICByZXR1cm4gZnVuYztcclxufVxyXG4iLCJpbXBvcnQge1xyXG4gIGlzRnVuY3Rpb24sIGZpbHRlciwgbWFwLFxyXG4gIHVuaXFCeSwga2V5cywgZGlmZmVyZW5jZSxcclxuICBqb2luLCByZWR1Y2UsIGZpbmQsXHJcbn0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgY29tcGlsZUV4cHJlc3Npb24sIGNvbXBpbGVDb2RlIH0gZnJvbSAnLi4vY29tbW9uL2NvbXBpbGVDb2RlJztcclxuaW1wb3J0IHsgJCB9IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IF9leGVjdXRlQWN0aW9uIH0gZnJvbSAnLi9leGVjdXRlJztcclxuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yLCBOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdGlhbGlzZUFjdGlvbnMgPSAoc3Vic2NyaWJlLCBiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zLCB0cmlnZ2VycywgYXBpcykgPT4ge1xyXG4gIHZhbGlkYXRlU291cmNlcyhiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zKTtcclxuICBzdWJzY3JpYmVUcmlnZ2VycyhzdWJzY3JpYmUsIGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMsIHRyaWdnZXJzLCBhcGlzKTtcclxuICByZXR1cm4gY3JlYXRlQWN0aW9uc0NvbGxlY3Rpb24oYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucyk7XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVBY3Rpb25zQ29sbGVjdGlvbiA9IChiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zKSA9PiAkKGFjdGlvbnMsIFtcclxuICByZWR1Y2UoKGFsbCwgYSkgPT4ge1xyXG4gICAgYWxsW2EubmFtZV0gPSBvcHRzID0+IF9leGVjdXRlQWN0aW9uKGJlaGF2aW91clNvdXJjZXMsIGEsIG9wdHMpO1xyXG4gICAgcmV0dXJuIGFsbDtcclxuICB9LCB7fSksXHJcbl0pO1xyXG5cclxuY29uc3Qgc3Vic2NyaWJlVHJpZ2dlcnMgPSAoc3Vic2NyaWJlLCBiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zLCB0cmlnZ2VycywgYXBpcykgPT4ge1xyXG4gIGNvbnN0IGNyZWF0ZU9wdGlvbnMgPSAob3B0aW9uc0NyZWF0b3IsIGV2ZW50Q29udGV4dCkgPT4ge1xyXG4gICAgaWYgKCFvcHRpb25zQ3JlYXRvcikgcmV0dXJuIHt9O1xyXG4gICAgY29uc3QgY3JlYXRlID0gY29tcGlsZUNvZGUob3B0aW9uc0NyZWF0b3IpO1xyXG4gICAgcmV0dXJuIGNyZWF0ZSh7IGNvbnRleHQ6IGV2ZW50Q29udGV4dCwgYXBpcyB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBzaG91bGRSdW5UcmlnZ2VyID0gKHRyaWdnZXIsIGV2ZW50Q29udGV4dCkgPT4ge1xyXG4gICAgaWYgKCF0cmlnZ2VyLmNvbmRpdGlvbikgcmV0dXJuIHRydWU7XHJcbiAgICBjb25zdCBzaG91bGRSdW4gPSBjb21waWxlRXhwcmVzc2lvbih0cmlnZ2VyLmNvbmRpdGlvbik7XHJcbiAgICByZXR1cm4gc2hvdWxkUnVuKHsgY29udGV4dDogZXZlbnRDb250ZXh0IH0pO1xyXG4gIH07XHJcblxyXG4gIGZvciAobGV0IHRyaWcgb2YgdHJpZ2dlcnMpIHtcclxuICAgIHN1YnNjcmliZSh0cmlnLmV2ZW50TmFtZSwgYXN5bmMgKGV2LCBjdHgpID0+IHtcclxuICAgICAgaWYgKHNob3VsZFJ1blRyaWdnZXIodHJpZywgY3R4KSkge1xyXG4gICAgICAgIGF3YWl0IF9leGVjdXRlQWN0aW9uKFxyXG4gICAgICAgICAgYmVoYXZpb3VyU291cmNlcyxcclxuICAgICAgICAgIGZpbmQoYSA9PiBhLm5hbWUgPT09IHRyaWcuYWN0aW9uTmFtZSkoYWN0aW9ucyksXHJcbiAgICAgICAgICBjcmVhdGVPcHRpb25zKHRyaWcub3B0aW9uc0NyZWF0b3IsIGN0eCksXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgdmFsaWRhdGVTb3VyY2VzID0gKGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMpID0+IHtcclxuICBjb25zdCBkZWNsYXJlZFNvdXJjZXMgPSAkKGFjdGlvbnMsIFtcclxuICAgIHVuaXFCeShhID0+IGEuYmVoYXZpb3VyU291cmNlKSxcclxuICAgIG1hcChhID0+IGEuYmVoYXZpb3VyU291cmNlKSxcclxuICBdKTtcclxuXHJcbiAgY29uc3Qgc3VwcGxpZWRTb3VyY2VzID0ga2V5cyhiZWhhdmlvdXJTb3VyY2VzKTtcclxuXHJcbiAgY29uc3QgbWlzc2luZ1NvdXJjZXMgPSBkaWZmZXJlbmNlKFxyXG4gICAgZGVjbGFyZWRTb3VyY2VzLCBzdXBwbGllZFNvdXJjZXMsXHJcbiAgKTtcclxuXHJcbiAgaWYgKG1pc3NpbmdTb3VyY2VzLmxlbmd0aCA+IDApIHtcclxuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYERlY2xhcmVkIGJlaGF2aW91ciBzb3VyY2VzIGFyZSBub3Qgc3VwcGxpZWQ6ICR7am9pbignLCAnLCBtaXNzaW5nU291cmNlcyl9YCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBtaXNzaW5nQmVoYXZpb3VycyA9ICQoYWN0aW9ucywgW1xyXG4gICAgZmlsdGVyKGEgPT4gIWlzRnVuY3Rpb24oYmVoYXZpb3VyU291cmNlc1thLmJlaGF2aW91clNvdXJjZV1bYS5iZWhhdmlvdXJOYW1lXSkpLFxyXG4gICAgbWFwKGEgPT4gYEFjdGlvbjogJHthLm5hbWV9IDogJHthLmJlaGF2aW91clNvdXJjZX0uJHthLmJlaGF2aW91ck5hbWV9YCksXHJcbiAgXSk7XHJcblxyXG4gIGlmIChtaXNzaW5nQmVoYXZpb3Vycy5sZW5ndGggPiAwKSB7XHJcbiAgICB0aHJvdyBuZXcgTm90Rm91bmRFcnJvcihgTWlzc2luZyBiZWhhdmlvdXJzOiBjb3VsZCBub3QgZmluZCBiZWhhdmlvdXIgZnVuY3Rpb25zOiAke2pvaW4oJywgJywgbWlzc2luZ0JlaGF2aW91cnMpfWApO1xyXG4gIH1cclxufTtcclxuIiwiaW1wb3J0IHtcclxuICBtYXAsIGZpbHRlciwgZ3JvdXBCeSwgc3BsaXQsXHJcbiAgc29tZSwgZmluZCxcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQge1xyXG4gIExPQ0tfRklMRU5BTUUsIFRSQU5TQUNUSU9OU19GT0xERVIsIGlkU2VwLCBpc1VwZGF0ZSxcclxuICBub2RlS2V5SGFzaEZyb21CdWlsZEZvbGRlciwgaXNCdWlsZEluZGV4Rm9sZGVyLCBnZXRUcmFuc2FjdGlvbklkLFxyXG4gIGlzRGVsZXRlLCBpc0NyZWF0ZSxcclxufSBmcm9tICcuL3RyYW5zYWN0aW9uc0NvbW1vbic7XHJcbmltcG9ydCB7XHJcbiAgam9pbktleSwgJCwgbm9uZSwgaXNTb21ldGhpbmcsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgZ2V0TGFzdFBhcnRJbktleSwgZ2V0Tm9kZUZyb21Ob2RlS2V5SGFzaCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7IF9sb2FkIH0gZnJvbSAnLi4vcmVjb3JkQXBpL2xvYWQnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJldHJpZXZlID0gYXN5bmMgKGFwcCkgPT4ge1xyXG4gIGNvbnN0IHRyYW5zYWN0aW9uRmlsZXMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZvbGRlckNvbnRlbnRzKFxyXG4gICAgVFJBTlNBQ1RJT05TX0ZPTERFUixcclxuICApO1xyXG5cclxuICBsZXQgdHJhbnNhY3Rpb25zID0gW107XHJcblxyXG4gIGlmIChzb21lKGlzQnVpbGRJbmRleEZvbGRlcikodHJhbnNhY3Rpb25GaWxlcykpIHtcclxuICAgIGNvbnN0IGJ1aWxkSW5kZXhGb2xkZXIgPSBmaW5kKGlzQnVpbGRJbmRleEZvbGRlcikodHJhbnNhY3Rpb25GaWxlcyk7XHJcblxyXG4gICAgdHJhbnNhY3Rpb25zID0gYXdhaXQgcmV0cmlldmVCdWlsZEluZGV4VHJhbnNhY3Rpb25zKFxyXG4gICAgICBhcHAsXHJcbiAgICAgIGpvaW5LZXkoVFJBTlNBQ1RJT05TX0ZPTERFUiwgYnVpbGRJbmRleEZvbGRlciksXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgaWYgKHRyYW5zYWN0aW9ucy5sZW5ndGggPiAwKSByZXR1cm4gdHJhbnNhY3Rpb25zO1xyXG5cclxuICByZXR1cm4gYXdhaXQgcmV0cmlldmVTdGFuZGFyZFRyYW5zYWN0aW9ucyhcclxuICAgIGFwcCwgdHJhbnNhY3Rpb25GaWxlcyxcclxuICApO1xyXG59O1xyXG5cclxuY29uc3QgcmV0cmlldmVCdWlsZEluZGV4VHJhbnNhY3Rpb25zID0gYXN5bmMgKGFwcCwgYnVpbGRJbmRleEZvbGRlcikgPT4ge1xyXG4gIGNvbnN0IGNoaWxkRm9sZGVycyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0Rm9sZGVyQ29udGVudHMoYnVpbGRJbmRleEZvbGRlcik7XHJcbiAgaWYgKGNoaWxkRm9sZGVycy5sZW5ndGggPT09IDApIHtcclxuICAgIC8vIGNsZWFudXBcclxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKGJ1aWxkSW5kZXhGb2xkZXIpO1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZ2V0VHJhbnNhY3Rpb25GaWxlcyA9IGFzeW5jIChjaGlsZEZvbGRlckluZGV4ID0gMCkgPT4ge1xyXG4gICAgaWYgKGNoaWxkRm9sZGVySW5kZXggPj0gY2hpbGRGb2xkZXJzLmxlbmd0aCkgcmV0dXJuIFtdO1xyXG5cclxuICAgIGNvbnN0IGNoaWxkRm9sZGVyS2V5ID0gam9pbktleShidWlsZEluZGV4Rm9sZGVyLCBjaGlsZEZvbGRlcnNbY2hpbGRGb2xkZXJJbmRleF0pO1xyXG4gICAgY29uc3QgZmlsZXMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZvbGRlckNvbnRlbnRzKFxyXG4gICAgICBjaGlsZEZvbGRlcktleSxcclxuICAgICk7XHJcblxyXG4gICAgaWYgKGZpbGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihjaGlsZEZvbGRlcktleSk7XHJcbiAgICAgIHJldHVybiBhd2FpdCBnZXRUcmFuc2FjdGlvbkZpbGVzKGNoaWxkRm9sZGVySW5kZXggKyAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geyBjaGlsZEZvbGRlcktleSwgZmlsZXMgfTtcclxuICB9O1xyXG5cclxuICBjb25zdCB0cmFuc2FjdGlvbkZpbGVzID0gYXdhaXQgZ2V0VHJhbnNhY3Rpb25GaWxlcygpO1xyXG5cclxuICBpZiAodHJhbnNhY3Rpb25GaWxlcy5maWxlcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcclxuXHJcbiAgY29uc3QgdHJhbnNhY3Rpb25zID0gJCh0cmFuc2FjdGlvbkZpbGVzLmZpbGVzLCBbXHJcbiAgICBtYXAocGFyc2VUcmFuc2FjdGlvbklkKSxcclxuICBdKTtcclxuXHJcbiAgZm9yIChjb25zdCB0IG9mIHRyYW5zYWN0aW9ucykge1xyXG4gICAgY29uc3QgdHJhbnNhY3Rpb25Db250ZW50ID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcclxuICAgICAgam9pbktleShcclxuICAgICAgICB0cmFuc2FjdGlvbkZpbGVzLmNoaWxkRm9sZGVyS2V5LFxyXG4gICAgICAgIHQuZnVsbElkLFxyXG4gICAgICApLFxyXG4gICAgKTtcclxuICAgIHQucmVjb3JkID0gYXdhaXQgX2xvYWQoYXBwLCB0cmFuc2FjdGlvbkNvbnRlbnQucmVjb3JkS2V5KTtcclxuICB9XHJcblxyXG4gIHRyYW5zYWN0aW9ucy5pbmRleE5vZGUgPSAkKGJ1aWxkSW5kZXhGb2xkZXIsIFtcclxuICAgIGdldExhc3RQYXJ0SW5LZXksXHJcbiAgICBub2RlS2V5SGFzaEZyb21CdWlsZEZvbGRlcixcclxuICAgIGdldE5vZGVGcm9tTm9kZUtleUhhc2goYXBwLmhpZXJhcmNoeSksXHJcbiAgXSk7XHJcblxyXG4gIHRyYW5zYWN0aW9ucy5mb2xkZXJLZXkgPSB0cmFuc2FjdGlvbkZpbGVzLmNoaWxkRm9sZGVyS2V5O1xyXG5cclxuICByZXR1cm4gdHJhbnNhY3Rpb25zO1xyXG59O1xyXG5cclxuY29uc3QgcmV0cmlldmVTdGFuZGFyZFRyYW5zYWN0aW9ucyA9IGFzeW5jIChhcHAsIHRyYW5zYWN0aW9uRmlsZXMpID0+IHtcclxuICBjb25zdCB0cmFuc2FjdGlvbklkcyA9ICQodHJhbnNhY3Rpb25GaWxlcywgW1xyXG4gICAgZmlsdGVyKGYgPT4gZiAhPT0gTE9DS19GSUxFTkFNRVxyXG4gICAgICAgICAgICAgICAgICAgICYmICFpc0J1aWxkSW5kZXhGb2xkZXIoZikpLFxyXG4gICAgbWFwKHBhcnNlVHJhbnNhY3Rpb25JZCksXHJcbiAgXSk7XHJcblxyXG4gIGNvbnN0IHRyYW5zYWN0aW9uSWRzQnlSZWNvcmQgPSAkKHRyYW5zYWN0aW9uSWRzLCBbXHJcbiAgICBncm91cEJ5KCdyZWNvcmRJZCcpLFxyXG4gIF0pO1xyXG5cclxuICBjb25zdCBkZWR1cGVkVHJhbnNhY3Rpb25zID0gW107XHJcblxyXG4gIGNvbnN0IHZlcmlmeSA9IGFzeW5jICh0KSA9PiB7XHJcbiAgICBpZiAodC52ZXJpZmllZCA9PT0gdHJ1ZSkgcmV0dXJuIHQ7XHJcblxyXG4gICAgY29uc3QgaWQgPSBnZXRUcmFuc2FjdGlvbklkKFxyXG4gICAgICB0LnJlY29yZElkLFxyXG4gICAgICB0LnRyYW5zYWN0aW9uVHlwZSxcclxuICAgICAgdC51bmlxdWVJZCxcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxyXG4gICAgICBqb2luS2V5KFRSQU5TQUNUSU9OU19GT0xERVIsIGlkKSxcclxuICAgICk7XHJcblxyXG4gICAgaWYgKGlzRGVsZXRlKHQpKSB7XHJcbiAgICAgIHQucmVjb3JkID0gdHJhbnNhY3Rpb24ucmVjb3JkO1xyXG4gICAgICB0LnZlcmlmaWVkID0gdHJ1ZTtcclxuICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVjID0gYXdhaXQgX2xvYWQoXHJcbiAgICAgIGFwcCxcclxuICAgICAgdHJhbnNhY3Rpb24ucmVjb3JkS2V5LFxyXG4gICAgKTtcclxuICAgIGlmIChyZWMudHJhbnNhY3Rpb25JZCA9PT0gaWQpIHtcclxuICAgICAgdC5yZWNvcmQgPSByZWM7XHJcbiAgICAgIGlmICh0cmFuc2FjdGlvbi5vbGRSZWNvcmQpIHsgdC5vbGRSZWNvcmQgPSB0cmFuc2FjdGlvbi5vbGRSZWNvcmQ7IH1cclxuICAgICAgdC52ZXJpZmllZCA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0LnZlcmlmaWVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHQ7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcGlja09uZSA9IGFzeW5jICh0cmFucywgZm9yVHlwZSkgPT4ge1xyXG4gICAgY29uc3QgdHJhbnNGb3JUeXBlID0gZmlsdGVyKGZvclR5cGUpKHRyYW5zKTtcclxuICAgIGlmICh0cmFuc0ZvclR5cGUubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIGNvbnN0IHQgPSBhd2FpdCB2ZXJpZnkodHJhbnNGb3JUeXBlWzBdKTtcclxuICAgICAgcmV0dXJuICh0LnZlcmlmaWVkID09PSB0cnVlID8gdCA6IG51bGwpO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgdCBvZiB0cmFuc0ZvclR5cGUpIHtcclxuICAgICAgdCA9IGF3YWl0IHZlcmlmeSh0KTtcclxuICAgICAgaWYgKHQudmVyaWZpZWQgPT09IHRydWUpIHsgcmV0dXJuIHQ7IH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9O1xyXG5cclxuICBmb3IgKGNvbnN0IHJlY29yZElkIGluIHRyYW5zYWN0aW9uSWRzQnlSZWNvcmQpIHtcclxuICAgIGNvbnN0IHRyYW5zSWRzRm9yUmVjb3JkID0gdHJhbnNhY3Rpb25JZHNCeVJlY29yZFtyZWNvcmRJZF07XHJcbiAgICBpZiAodHJhbnNJZHNGb3JSZWNvcmQubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIGNvbnN0IHQgPSBhd2FpdCB2ZXJpZnkodHJhbnNJZHNGb3JSZWNvcmRbMF0pO1xyXG4gICAgICBpZiAodC52ZXJpZmllZCkgeyBkZWR1cGVkVHJhbnNhY3Rpb25zLnB1c2godCk7IH1cclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcbiAgICBpZiAoc29tZShpc0RlbGV0ZSkodHJhbnNJZHNGb3JSZWNvcmQpKSB7XHJcbiAgICAgIGNvbnN0IHQgPSBhd2FpdCB2ZXJpZnkoZmluZChpc0RlbGV0ZSkodHJhbnNJZHNGb3JSZWNvcmQpKTtcclxuICAgICAgaWYgKHQudmVyaWZpZWQpIHsgZGVkdXBlZFRyYW5zYWN0aW9ucy5wdXNoKHQpOyB9XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG4gICAgaWYgKHNvbWUoaXNVcGRhdGUpKHRyYW5zSWRzRm9yUmVjb3JkKSkge1xyXG4gICAgICBjb25zdCB1cGQgPSBhd2FpdCBwaWNrT25lKHRyYW5zSWRzRm9yUmVjb3JkLCBpc1VwZGF0ZSk7XHJcbiAgICAgIGlmIChpc1NvbWV0aGluZyh1cGQpICYmIHVwZC52ZXJpZmllZCkgeyBkZWR1cGVkVHJhbnNhY3Rpb25zLnB1c2godXBkKTsgfVxyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuICAgIGlmIChzb21lKGlzQ3JlYXRlKSh0cmFuc0lkc0ZvclJlY29yZCkpIHtcclxuICAgICAgY29uc3QgY3JlID0gYXdhaXQgcGlja09uZSh0cmFuc0lkc0ZvclJlY29yZCwgaXNDcmVhdGUpO1xyXG4gICAgICBpZiAoaXNTb21ldGhpbmcoY3JlKSkgeyBkZWR1cGVkVHJhbnNhY3Rpb25zLnB1c2goY3JlKTsgfVxyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IGR1cGxpY2F0ZXMgPSAkKHRyYW5zYWN0aW9uSWRzLCBbXHJcbiAgICBmaWx0ZXIodCA9PiBub25lKGRkdCA9PiBkZHQudW5pcXVlSWQgPT09IHQudW5pcXVlSWQpKGRlZHVwZWRUcmFuc2FjdGlvbnMpKSxcclxuICBdKTtcclxuXHJcblxyXG4gIGNvbnN0IGRlbGV0ZVByb21pc2VzID0gbWFwKHQgPT4gYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKFxyXG4gICAgam9pbktleShcclxuICAgICAgVFJBTlNBQ1RJT05TX0ZPTERFUixcclxuICAgICAgZ2V0VHJhbnNhY3Rpb25JZChcclxuICAgICAgICB0LnJlY29yZElkLFxyXG4gICAgICAgIHQudHJhbnNhY3Rpb25UeXBlLFxyXG4gICAgICAgIHQudW5pcXVlSWQsXHJcbiAgICAgICksXHJcbiAgICApLFxyXG4gICkpKGR1cGxpY2F0ZXMpO1xyXG5cclxuICBhd2FpdCBQcm9taXNlLmFsbChkZWxldGVQcm9taXNlcyk7XHJcblxyXG4gIHJldHVybiBkZWR1cGVkVHJhbnNhY3Rpb25zO1xyXG59O1xyXG5cclxuY29uc3QgcGFyc2VUcmFuc2FjdGlvbklkID0gKGlkKSA9PiB7XHJcbiAgY29uc3Qgc3BsaXRJZCA9IHNwbGl0KGlkU2VwKShpZCk7XHJcbiAgcmV0dXJuICh7XHJcbiAgICByZWNvcmRJZDogc3BsaXRJZFswXSxcclxuICAgIHRyYW5zYWN0aW9uVHlwZTogc3BsaXRJZFsxXSxcclxuICAgIHVuaXF1ZUlkOiBzcGxpdElkWzJdLFxyXG4gICAgZnVsbElkOiBpZCxcclxuICB9KTtcclxufTtcclxuIiwiaW1wb3J0IHsgb3JkZXJCeSB9IGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7XHJcbiAgcmVkdWNlLCBmaW5kLCBpbmNsdWRlcywgZmxhdHRlbiwgdW5pb24sXHJcbiAgZmlsdGVyLCBlYWNoLCBtYXAsXHJcbn0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHtcclxuICBqb2luS2V5LCBzcGxpdEtleSwgaXNOb25FbXB0eVN0cmluZyxcclxuICBpc05vdGhpbmcsICQsIGlzU29tZXRoaW5nLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7XHJcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LCBnZXROb2RlLCBnZXRSZWNvcmROb2RlSWQsXHJcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCwgcmVjb3JkTm9kZUlkSXNBbGxvd2VkLFxyXG4gIGlzUmVjb3JkLCBpc0dsb2JhbEluZGV4LFxyXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7IGluZGV4VHlwZXMgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9pbmRleGVzJztcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcyA9IChhcHBIaWVyYXJjaHksIHJlY29yZCkgPT4ge1xyXG4gIGNvbnN0IGtleSA9IHJlY29yZC5rZXk7XHJcbiAgY29uc3Qga2V5UGFydHMgPSBzcGxpdEtleShrZXkpO1xyXG4gIGNvbnN0IG5vZGVJZCA9IGdldFJlY29yZE5vZGVJZChrZXkpO1xyXG5cclxuICBjb25zdCBmbGF0SGllcmFyY2h5ID0gb3JkZXJCeShnZXRGbGF0dGVuZWRIaWVyYXJjaHkoYXBwSGllcmFyY2h5KSxcclxuICAgIFtub2RlID0+IG5vZGUucGF0aFJlZ3goKS5sZW5ndGhdLFxyXG4gICAgWydkZXNjJ10pO1xyXG5cclxuICBjb25zdCBtYWtlaW5kZXhOb2RlQW5kS2V5X0ZvckFuY2VzdG9ySW5kZXggPSAoaW5kZXhOb2RlLCBpbmRleEtleSkgPT4gbWFrZUluZGV4Tm9kZUFuZEtleShpbmRleE5vZGUsIGpvaW5LZXkoaW5kZXhLZXksIGluZGV4Tm9kZS5uYW1lKSk7XHJcblxyXG4gIGNvbnN0IHRyYXZlcnNlQW5jZXN0b3JJbmRleGVzSW5QYXRoID0gKCkgPT4gcmVkdWNlKChhY2MsIHBhcnQpID0+IHtcclxuICAgIGNvbnN0IGN1cnJlbnRJbmRleEtleSA9IGpvaW5LZXkoYWNjLmxhc3RJbmRleEtleSwgcGFydCk7XHJcbiAgICBhY2MubGFzdEluZGV4S2V5ID0gY3VycmVudEluZGV4S2V5O1xyXG4gICAgY29uc3QgdGVzdFBhdGhSZWd4ID0gcCA9PiBuZXcgUmVnRXhwKGAke3AucGF0aFJlZ3goKX0kYCkudGVzdChjdXJyZW50SW5kZXhLZXkpO1xyXG4gICAgY29uc3Qgbm9kZU1hdGNoID0gZmluZCh0ZXN0UGF0aFJlZ3gpKGZsYXRIaWVyYXJjaHkpO1xyXG5cclxuICAgIGlmIChpc05vdGhpbmcobm9kZU1hdGNoKSkgeyByZXR1cm4gYWNjOyB9XHJcblxyXG4gICAgaWYgKCFpc1JlY29yZChub2RlTWF0Y2gpXHJcbiAgICAgICAgICAgICAgICB8fCBub2RlTWF0Y2guaW5kZXhlcy5sZW5ndGggPT09IDApIHsgcmV0dXJuIGFjYzsgfVxyXG5cclxuICAgIGNvbnN0IGluZGV4ZXMgPSAkKG5vZGVNYXRjaC5pbmRleGVzLCBbXHJcbiAgICAgIGZpbHRlcihpID0+IGkuaW5kZXhUeXBlID09PSBpbmRleFR5cGVzLmFuY2VzdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIChpLmFsbG93ZWRSZWNvcmROb2RlSWRzLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgfHwgaW5jbHVkZXMobm9kZUlkKShpLmFsbG93ZWRSZWNvcmROb2RlSWRzKSkpLFxyXG4gICAgXSk7XHJcblxyXG4gICAgZWFjaCh2ID0+IGFjYy5ub2Rlc0FuZEtleXMucHVzaChcclxuICAgICAgbWFrZWluZGV4Tm9kZUFuZEtleV9Gb3JBbmNlc3RvckluZGV4KHYsIGN1cnJlbnRJbmRleEtleSksXHJcbiAgICApKShpbmRleGVzKTtcclxuXHJcbiAgICByZXR1cm4gYWNjO1xyXG4gIH0sIHsgbGFzdEluZGV4S2V5OiAnJywgbm9kZXNBbmRLZXlzOiBbXSB9KShrZXlQYXJ0cykubm9kZXNBbmRLZXlzO1xyXG5cclxuICBjb25zdCByb290SW5kZXhlcyA9ICQoZmxhdEhpZXJhcmNoeSwgW1xyXG4gICAgZmlsdGVyKG4gPT4gaXNHbG9iYWxJbmRleChuKSAmJiByZWNvcmROb2RlSWRJc0FsbG93ZWQobikobm9kZUlkKSksXHJcbiAgICBtYXAoaSA9PiBtYWtlSW5kZXhOb2RlQW5kS2V5KGksIGkubm9kZUtleSgpKSksXHJcbiAgXSk7XHJcblxyXG4gIHJldHVybiB1bmlvbih0cmF2ZXJzZUFuY2VzdG9ySW5kZXhlc0luUGF0aCgpKShyb290SW5kZXhlcyk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0UmVsZXZhbnRSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyA9IChhcHBIaWVyYXJjaHksIHJlY29yZCkgPT4gJChyZWNvcmQua2V5LCBbXHJcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHBIaWVyYXJjaHkpLFxyXG4gIG4gPT4gbi5maWVsZHMsXHJcbiAgZmlsdGVyKGYgPT4gZi50eXBlID09PSAncmVmZXJlbmNlJ1xyXG4gICAgICAgICAgICAgICAgICAgICYmIGlzU29tZXRoaW5nKHJlY29yZFtmLm5hbWVdKVxyXG4gICAgICAgICAgICAgICAgICAgICYmIGlzTm9uRW1wdHlTdHJpbmcocmVjb3JkW2YubmFtZV0ua2V5KSksXHJcbiAgbWFwKGYgPT4gJChmLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzLCBbXHJcbiAgICBtYXAobiA9PiAoe1xyXG4gICAgICByZWNvcmROb2RlOiBnZXROb2RlKGFwcEhpZXJhcmNoeSwgbiksXHJcbiAgICAgIGZpZWxkOiBmLFxyXG4gICAgfSkpLFxyXG4gIF0pKSxcclxuICBmbGF0dGVuLFxyXG4gIG1hcChuID0+IG1ha2VJbmRleE5vZGVBbmRLZXkoXHJcbiAgICBuLnJlY29yZE5vZGUsXHJcbiAgICBqb2luS2V5KHJlY29yZFtuLmZpZWxkLm5hbWVdLmtleSwgbi5yZWNvcmROb2RlLm5hbWUpLFxyXG4gICkpLFxyXG5dKTtcclxuXHJcbmNvbnN0IG1ha2VJbmRleE5vZGVBbmRLZXkgPSAoaW5kZXhOb2RlLCBpbmRleEtleSkgPT4gKHsgaW5kZXhOb2RlLCBpbmRleEtleSB9KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldFJlbGV2YW50QW5jZXN0b3JJbmRleGVzO1xyXG4iLCIgIC8vIGFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZGV4NGVyL2pzLXByb21pc2Utd3JpdGFibGVcclxuICAvLyBUaGFuayB5b3UgOikgXHJcbiAgZXhwb3J0IGNvbnN0IHByb21pc2VXcml0ZWFibGVTdHJlYW0gPSBzdHJlYW0gPT4ge1xyXG4gIFxyXG4gICAgbGV0IF9lcnJvcmVkO1xyXG4gIFxyXG4gICAgY29uc3QgX2Vycm9ySGFuZGxlciA9IGVyciA9PiB7XHJcbiAgICAgICAgX2Vycm9yZWQgPSBlcnI7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0cmVhbS5vbihcImVycm9yXCIsIF9lcnJvckhhbmRsZXIpOyAgICBcclxuICBcclxuICAgIGNvbnN0IHdyaXRlID0gY2h1bmsgPT4geyAgXHJcbiAgICAgIGxldCByZWplY3RlZCA9IGZhbHNlO1xyXG4gIFxyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGlmIChfZXJyb3JlZCkge1xyXG4gICAgICAgICAgY29uc3QgZXJyID0gX2Vycm9yZWQ7XHJcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgaWYgKCFzdHJlYW0ud3JpdGFibGUgfHwgc3RyZWFtLmNsb3NlZCB8fCBzdHJlYW0uZGVzdHJveWVkKSB7XHJcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihcIndyaXRlIGFmdGVyIGVuZFwiKSk7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGNvbnN0IHdyaXRlRXJyb3JIYW5kbGVyID0gZXJyID0+IHtcclxuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgcmVqZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIHN0cmVhbS5vbmNlKFwiZXJyb3JcIiwgd3JpdGVFcnJvckhhbmRsZXIpO1xyXG4gIFxyXG4gICAgICAgIGNvbnN0IGNhbldyaXRlID0gc3RyZWFtLndyaXRlKGNodW5rKTtcclxuICBcclxuICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCB3cml0ZUVycm9ySGFuZGxlcik7XHJcbiAgXHJcbiAgICAgICAgaWYgKGNhbldyaXRlKSB7XHJcbiAgICAgICAgICBpZiAoIXJlamVjdGVkKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoY2h1bmsubGVuZ3RoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgZXJyb3JIYW5kbGVyID0gZXJyID0+IHtcclxuICAgICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xyXG4gICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgIGNvbnN0IGRyYWluSGFuZGxlciA9ICgpID0+IHtcclxuICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgICAgIHJlc29sdmUoY2h1bmsubGVuZ3RoKTtcclxuICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgIGNvbnN0IGNsb3NlSGFuZGxlciA9ICgpID0+IHtcclxuICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgICAgIHJlc29sdmUoY2h1bmsubGVuZ3RoKTtcclxuICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgIGNvbnN0IGZpbmlzaEhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xyXG4gICAgICAgICAgICByZXNvbHZlKGNodW5rLmxlbmd0aCk7XHJcbiAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgICBjb25zdCByZW1vdmVMaXN0ZW5lcnMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImNsb3NlXCIsIGNsb3NlSGFuZGxlcik7XHJcbiAgICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImRyYWluXCIsIGRyYWluSGFuZGxlcik7XHJcbiAgICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XHJcbiAgICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImZpbmlzaFwiLCBmaW5pc2hIYW5kbGVyKTtcclxuICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgIHN0cmVhbS5vbihcImNsb3NlXCIsIGNsb3NlSGFuZGxlcik7XHJcbiAgICAgICAgICBzdHJlYW0ub24oXCJkcmFpblwiLCBkcmFpbkhhbmRsZXIpO1xyXG4gICAgICAgICAgc3RyZWFtLm9uKFwiZXJyb3JcIiwgZXJyb3JIYW5kbGVyKTtcclxuICAgICAgICAgIHN0cmVhbS5vbihcImZpbmlzaFwiLCBmaW5pc2hIYW5kbGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgXHJcbiAgICBjb25zdCBlbmQgPSAoKSA9PiB7XHJcbiAgXHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgaWYgKF9lcnJvcmVkKSB7XHJcbiAgICAgICAgICBjb25zdCBlcnIgPSBfZXJyb3JlZDtcclxuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBpZiAoIXN0cmVhbS53cml0YWJsZSB8fCBzdHJlYW0uY2xvc2VkIHx8IHN0cmVhbS5kZXN0cm95ZWQpIHtcclxuICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGNvbnN0IGZpbmlzaEhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgY29uc3QgZXJyb3JIYW5kbGVyID0gKGVycikgPT4ge1xyXG4gICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcclxuICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBjb25zdCByZW1vdmVMaXN0ZW5lcnMgPSAoKSA9PiB7XHJcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xyXG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZmluaXNoXCIsIGZpbmlzaEhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBzdHJlYW0ub24oXCJmaW5pc2hcIiwgZmluaXNoSGFuZGxlcik7XHJcbiAgICAgICAgc3RyZWFtLm9uKFwiZXJyb3JcIiwgZXJyb3JIYW5kbGVyKTtcclxuICBcclxuICAgICAgICBzdHJlYW0uZW5kKCk7XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHt3cml0ZSwgZW5kfTtcclxuICB9XHJcbiAgXHJcbiAgZXhwb3J0IGRlZmF1bHQgcHJvbWlzZVdyaXRlYWJsZVN0cmVhbVxyXG4gICIsImltcG9ydCB7IGVuc3VyZVNoYXJkTmFtZUlzSW5TaGFyZE1hcCB9IGZyb20gJy4vc2hhcmRpbmcnO1xyXG5pbXBvcnQgeyBnZXRJbmRleFdyaXRlciB9IGZyb20gJy4vc2VyaWFsaXplcic7XHJcbmltcG9ydCB7IGlzU2hhcmRlZEluZGV4IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHtwcm9taXNlV3JpdGVhYmxlU3RyZWFtfSBmcm9tIFwiLi9wcm9taXNlV3JpdGFibGVTdHJlYW1cIjtcclxuaW1wb3J0IHtwcm9taXNlUmVhZGFibGVTdHJlYW19IGZyb20gXCIuL3Byb21pc2VSZWFkYWJsZVN0cmVhbVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGFwcGx5VG9TaGFyZCA9IGFzeW5jIChoaWVyYXJjaHksIHN0b3JlLCBpbmRleEtleSxcclxuICBpbmRleE5vZGUsIGluZGV4U2hhcmRLZXksIHJlY29yZHNUb1dyaXRlLCBrZXlzVG9SZW1vdmUpID0+IHtcclxuICBjb25zdCBjcmVhdGVJZk5vdEV4aXN0cyA9IHJlY29yZHNUb1dyaXRlLmxlbmd0aCA+IDA7XHJcbiAgY29uc3Qgd3JpdGVyID0gYXdhaXQgZ2V0V3JpdGVyKGhpZXJhcmNoeSwgc3RvcmUsIGluZGV4S2V5LCBpbmRleFNoYXJkS2V5LCBpbmRleE5vZGUsIGNyZWF0ZUlmTm90RXhpc3RzKTtcclxuICBpZiAod3JpdGVyID09PSBTSEFSRF9ERUxFVEVEKSByZXR1cm47XHJcblxyXG4gIGF3YWl0IHdyaXRlci51cGRhdGVJbmRleChyZWNvcmRzVG9Xcml0ZSwga2V5c1RvUmVtb3ZlKTtcclxuICBhd2FpdCBzd2FwVGVtcEZpbGVJbihzdG9yZSwgaW5kZXhTaGFyZEtleSk7XHJcbn07XHJcblxyXG5jb25zdCBTSEFSRF9ERUxFVEVEID0gJ1NIQVJEX0RFTEVURUQnO1xyXG5jb25zdCBnZXRXcml0ZXIgPSBhc3luYyAoaGllcmFyY2h5LCBzdG9yZSwgaW5kZXhLZXksIGluZGV4ZWREYXRhS2V5LCBpbmRleE5vZGUsIGNyZWF0ZUlmTm90RXhpc3RzKSA9PiB7XHJcbiAgbGV0IHJlYWRhYmxlU3RyZWFtID0gbnVsbDtcclxuXHJcbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4Tm9kZSkpIHtcclxuICAgIGF3YWl0IGVuc3VyZVNoYXJkTmFtZUlzSW5TaGFyZE1hcChzdG9yZSwgaW5kZXhLZXksIGluZGV4ZWREYXRhS2V5KTtcclxuICAgIGlmKCFhd2FpdCBzdG9yZS5leGlzdHMoaW5kZXhlZERhdGFLZXkpKSB7XHJcbiAgICAgIGF3YWl0IHN0b3JlLmNyZWF0ZUZpbGUoaW5kZXhlZERhdGFLZXksIFwiXCIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuXHJcbiAgICByZWFkYWJsZVN0cmVhbSA9IHByb21pc2VSZWFkYWJsZVN0cmVhbShcclxuICAgICAgICBhd2FpdCBzdG9yZS5yZWFkYWJsZUZpbGVTdHJlYW0oaW5kZXhlZERhdGFLZXkpXHJcbiAgICApO1xyXG5cclxuICB9IGNhdGNoIChlKSB7XHJcblxyXG4gICAgaWYgKGF3YWl0IHN0b3JlLmV4aXN0cyhpbmRleGVkRGF0YUtleSkpIHtcclxuICAgICAgdGhyb3cgZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChjcmVhdGVJZk5vdEV4aXN0cykgeyBcclxuICAgICAgICBhd2FpdCBzdG9yZS5jcmVhdGVGaWxlKGluZGV4ZWREYXRhS2V5LCAnJyk7IFxyXG4gICAgICB9IGVsc2UgeyBcclxuICAgICAgICByZXR1cm4gU0hBUkRfREVMRVRFRDsgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlYWRhYmxlU3RyZWFtID0gcHJvbWlzZVJlYWRhYmxlU3RyZWFtKFxyXG4gICAgICAgICAgYXdhaXQgc3RvcmUucmVhZGFibGVGaWxlU3RyZWFtKGluZGV4ZWREYXRhS2V5KVxyXG4gICAgICApO1xyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IHdyaXRhYmxlU3RyZWFtID0gcHJvbWlzZVdyaXRlYWJsZVN0cmVhbShcclxuICAgICAgYXdhaXQgc3RvcmUud3JpdGFibGVGaWxlU3RyZWFtKGluZGV4ZWREYXRhS2V5ICsgXCIudGVtcFwiKVxyXG4gICk7XHJcblxyXG4gIHJldHVybiBnZXRJbmRleFdyaXRlcihcclxuICAgIGhpZXJhcmNoeSwgaW5kZXhOb2RlLFxyXG4gICAgICAgIHJlYWRhYmxlU3RyZWFtLCB3cml0YWJsZVN0cmVhbVxyXG4gICk7XHJcbn07XHJcblxyXG5jb25zdCBzd2FwVGVtcEZpbGVJbiA9IGFzeW5jIChzdG9yZSwgaW5kZXhlZERhdGFLZXksIGlzUmV0cnkgPSBmYWxzZSkgPT4ge1xyXG4gIGNvbnN0IHRlbXBGaWxlID0gYCR7aW5kZXhlZERhdGFLZXl9LnRlbXBgO1xyXG4gIHRyeSB7XHJcbiAgICBhd2FpdCBzdG9yZS5kZWxldGVGaWxlKGluZGV4ZWREYXRhS2V5KTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICAvLyBpZ25vcmUgZmFpbHVyZSwgaW5jYXNlIGl0IGhhcyBub3QgYmVlbiBjcmVhdGVkIHlldFxyXG4gIH1cclxuICB0cnkge1xyXG4gICAgYXdhaXQgc3RvcmUucmVuYW1lRmlsZSh0ZW1wRmlsZSwgaW5kZXhlZERhdGFLZXkpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIC8vIHJldHJ5aW5nIGluIGNhc2UgZGVsZXRlIGZhaWx1cmUgd2FzIGZvciBzb21lIG90aGVyIHJlYXNvblxyXG4gICAgaWYgKCFpc1JldHJ5KSB7XHJcbiAgICAgIGF3YWl0IHN3YXBUZW1wRmlsZUluKHN0b3JlLCBpbmRleGVkRGF0YUtleSwgdHJ1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gc3dhcCBpbiBpbmRleCBmaWxlZDogXCIgKyBlLm1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuIiwiaW1wb3J0IHtcclxuICBmaWx0ZXIsIG1hcCwgaXNVbmRlZmluZWQsIGluY2x1ZGVzLFxyXG4gIGZsYXR0ZW4sIGludGVyc2VjdGlvbkJ5LFxyXG4gIGlzRXF1YWwsIHB1bGwsIGtleXMsXHJcbiAgZGlmZmVyZW5jZUJ5LCBkaWZmZXJlbmNlLFxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IHVuaW9uIH0gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHtcclxuICBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcyxcclxuICBnZXRSZWxldmFudFJldmVyc2VSZWZlcmVuY2VJbmRleGVzLFxyXG59IGZyb20gJy4uL2luZGV4aW5nL3JlbGV2YW50JztcclxuaW1wb3J0IHsgZXZhbHVhdGUgfSBmcm9tICcuLi9pbmRleGluZy9ldmFsdWF0ZSc7XHJcbmltcG9ydCB7XHJcbiAgJCwgaXNTb21ldGhpbmcsXHJcbiAgaXNOb25FbXB0eUFycmF5LCBqb2luS2V5LFxyXG4gIGlzTm9uRW1wdHlTdHJpbmcsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgZ2V0SW5kZXhlZERhdGFLZXkgfSBmcm9tICcuLi9pbmRleGluZy9zaGFyZGluZyc7XHJcbmltcG9ydCB7XHJcbiAgaXNVcGRhdGUsIGlzQ3JlYXRlLFxyXG4gIGlzRGVsZXRlLCBpc0J1aWxkSW5kZXgsXHJcbn0gZnJvbSAnLi90cmFuc2FjdGlvbnNDb21tb24nO1xyXG5pbXBvcnQgeyBhcHBseVRvU2hhcmQgfSBmcm9tICcuLi9pbmRleGluZy9hcHBseSc7XHJcbmltcG9ydCB7XHJcbiAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQsXHJcbiAgaXNHbG9iYWxJbmRleCwgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXgsIGlzUmVmZXJlbmNlSW5kZXgsXHJcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcclxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5cclxuZXhwb3J0IGNvbnN0IGV4ZWN1dGVUcmFuc2FjdGlvbnMgPSBhcHAgPT4gYXN5bmMgKHRyYW5zYWN0aW9ucykgPT4ge1xyXG4gIGNvbnN0IHJlY29yZHNCeVNoYXJkID0gbWFwcGVkUmVjb3Jkc0J5SW5kZXhTaGFyZChhcHAuaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMpO1xyXG5cclxuICBmb3IgKGNvbnN0IHNoYXJkIG9mIGtleXMocmVjb3Jkc0J5U2hhcmQpKSB7XHJcbiAgICBhd2FpdCBhcHBseVRvU2hhcmQoXHJcbiAgICAgIGFwcC5oaWVyYXJjaHksIGFwcC5kYXRhc3RvcmUsXHJcbiAgICAgIHJlY29yZHNCeVNoYXJkW3NoYXJkXS5pbmRleEtleSxcclxuICAgICAgcmVjb3Jkc0J5U2hhcmRbc2hhcmRdLmluZGV4Tm9kZSxcclxuICAgICAgc2hhcmQsXHJcbiAgICAgIHJlY29yZHNCeVNoYXJkW3NoYXJkXS53cml0ZXMsXHJcbiAgICAgIHJlY29yZHNCeVNoYXJkW3NoYXJkXS5yZW1vdmVzLFxyXG4gICAgKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBtYXBwZWRSZWNvcmRzQnlJbmRleFNoYXJkID0gKGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKSA9PiB7XHJcbiAgY29uc3QgdXBkYXRlcyA9IGdldFVwZGF0ZVRyYW5zYWN0aW9uc0J5U2hhcmQoXHJcbiAgICBoaWVyYXJjaHksIHRyYW5zYWN0aW9ucyxcclxuICApO1xyXG5cclxuICBjb25zdCBjcmVhdGVkID0gZ2V0Q3JlYXRlVHJhbnNhY3Rpb25zQnlTaGFyZChcclxuICAgIGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zLFxyXG4gICk7XHJcbiAgY29uc3QgZGVsZXRlcyA9IGdldERlbGV0ZVRyYW5zYWN0aW9uc0J5U2hhcmQoXHJcbiAgICBoaWVyYXJjaHksIHRyYW5zYWN0aW9ucyxcclxuICApO1xyXG5cclxuICBjb25zdCBpbmRleEJ1aWxkID0gZ2V0QnVpbGRJbmRleFRyYW5zYWN0aW9uc0J5U2hhcmQoXHJcbiAgICBoaWVyYXJjaHksXHJcbiAgICB0cmFuc2FjdGlvbnMsXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgdG9SZW1vdmUgPSBbXHJcbiAgICAuLi5kZWxldGVzLFxyXG4gICAgLi4udXBkYXRlcy50b1JlbW92ZSxcclxuICBdO1xyXG5cclxuICBjb25zdCB0b1dyaXRlID0gW1xyXG4gICAgLi4uY3JlYXRlZCxcclxuICAgIC4uLnVwZGF0ZXMudG9Xcml0ZSxcclxuICAgIC4uLmluZGV4QnVpbGQsXHJcbiAgXTtcclxuXHJcbiAgY29uc3QgdHJhbnNCeVNoYXJkID0ge307XHJcblxyXG4gIGNvbnN0IGluaXRpYWxpc2VTaGFyZCA9ICh0KSA9PiB7XHJcbiAgICBpZiAoaXNVbmRlZmluZWQodHJhbnNCeVNoYXJkW3QuaW5kZXhTaGFyZEtleV0pKSB7XHJcbiAgICAgIHRyYW5zQnlTaGFyZFt0LmluZGV4U2hhcmRLZXldID0ge1xyXG4gICAgICAgIHdyaXRlczogW10sXHJcbiAgICAgICAgcmVtb3ZlczogW10sXHJcbiAgICAgICAgaW5kZXhLZXk6IHQuaW5kZXhLZXksXHJcbiAgICAgICAgaW5kZXhOb2RlS2V5OiB0LmluZGV4Tm9kZUtleSxcclxuICAgICAgICBpbmRleE5vZGU6IHQuaW5kZXhOb2RlLFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGZvciAoY29uc3QgdHJhbnMgb2YgdG9Xcml0ZSkge1xyXG4gICAgaW5pdGlhbGlzZVNoYXJkKHRyYW5zKTtcclxuICAgIHRyYW5zQnlTaGFyZFt0cmFucy5pbmRleFNoYXJkS2V5XS53cml0ZXMucHVzaChcclxuICAgICAgdHJhbnMubWFwcGVkUmVjb3JkLnJlc3VsdCxcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBmb3IgKGNvbnN0IHRyYW5zIG9mIHRvUmVtb3ZlKSB7XHJcbiAgICBpbml0aWFsaXNlU2hhcmQodHJhbnMpO1xyXG4gICAgdHJhbnNCeVNoYXJkW3RyYW5zLmluZGV4U2hhcmRLZXldLnJlbW92ZXMucHVzaChcclxuICAgICAgdHJhbnMubWFwcGVkUmVjb3JkLnJlc3VsdC5rZXksXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRyYW5zQnlTaGFyZDtcclxufTtcclxuXHJcbmNvbnN0IGdldFVwZGF0ZVRyYW5zYWN0aW9uc0J5U2hhcmQgPSAoaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMpID0+IHtcclxuICBjb25zdCB1cGRhdGVUcmFuc2FjdGlvbnMgPSAkKHRyYW5zYWN0aW9ucywgW2ZpbHRlcihpc1VwZGF0ZSldKTtcclxuXHJcbiAgY29uc3QgZXZhbHVhdGVJbmRleCA9IChyZWNvcmQsIGluZGV4Tm9kZUFuZFBhdGgpID0+IHtcclxuICAgIGNvbnN0IG1hcHBlZFJlY29yZCA9IGV2YWx1YXRlKHJlY29yZCkoaW5kZXhOb2RlQW5kUGF0aC5pbmRleE5vZGUpO1xyXG4gICAgcmV0dXJuICh7XHJcbiAgICAgIG1hcHBlZFJlY29yZCxcclxuICAgICAgaW5kZXhOb2RlOiBpbmRleE5vZGVBbmRQYXRoLmluZGV4Tm9kZSxcclxuICAgICAgaW5kZXhLZXk6IGluZGV4Tm9kZUFuZFBhdGguaW5kZXhLZXksXHJcbiAgICAgIGluZGV4U2hhcmRLZXk6IGdldEluZGV4ZWREYXRhS2V5KFxyXG4gICAgICAgIGluZGV4Tm9kZUFuZFBhdGguaW5kZXhOb2RlLFxyXG4gICAgICAgIGluZGV4Tm9kZUFuZFBhdGguaW5kZXhLZXksXHJcbiAgICAgICAgbWFwcGVkUmVjb3JkLnJlc3VsdCxcclxuICAgICAgKSxcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdldEluZGV4Tm9kZXNUb0FwcGx5ID0gaW5kZXhGaWx0ZXIgPT4gKHQsIGluZGV4ZXMpID0+ICQoaW5kZXhlcywgW1xyXG4gICAgbWFwKG4gPT4gKHtcclxuICAgICAgb2xkOiBldmFsdWF0ZUluZGV4KHQub2xkUmVjb3JkLCBuKSxcclxuICAgICAgbmV3OiBldmFsdWF0ZUluZGV4KHQucmVjb3JkLCBuKSxcclxuICAgIH0pKSxcclxuICAgIGZpbHRlcihpbmRleEZpbHRlciksXHJcbiAgXSk7XHJcblxyXG4gIGNvbnN0IHRvUmVtb3ZlRmlsdGVyID0gKG4sIGlzVW5yZWZlcmVuY2VkKSA9PiBuLm9sZC5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSB0cnVlXHJcbiAgICAgICAgJiYgKG4ubmV3Lm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IGZhbHNlXHJcbiAgICAgICAgICAgIHx8IGlzVW5yZWZlcmVuY2VkKTtcclxuXHJcbiAgY29uc3QgdG9BZGRGaWx0ZXIgPSAobiwgaXNOZXdseVJlZmVyZW5jZWQpID0+IChuLm9sZC5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSBmYWxzZVxyXG4gICAgICAgIHx8IGlzTmV3bHlSZWZlcmVuY2VkKVxyXG4gICAgICAgICYmIG4ubmV3Lm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IHRydWU7XHJcblxyXG4gIGNvbnN0IHRvVXBkYXRlRmlsdGVyID0gbiA9PiBuLm5ldy5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSB0cnVlXHJcbiAgICAgICAgJiYgbi5vbGQubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gdHJ1ZVxyXG4gICAgICAgICYmICFpc0VxdWFsKG4ub2xkLm1hcHBlZFJlY29yZC5yZXN1bHQsXHJcbiAgICAgICAgICBuLm5ldy5tYXBwZWRSZWNvcmQucmVzdWx0KTtcclxuXHJcbiAgY29uc3QgdG9SZW1vdmUgPSBbXTtcclxuICBjb25zdCB0b1dyaXRlID0gW107XHJcblxyXG4gIGZvciAoY29uc3QgdCBvZiB1cGRhdGVUcmFuc2FjdGlvbnMpIHtcclxuICAgIGNvbnN0IGFuY2VzdG9ySWR4cyA9IGdldFJlbGV2YW50QW5jZXN0b3JJbmRleGVzKFxyXG4gICAgICBoaWVyYXJjaHksIHQucmVjb3JkLFxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCByZWZlcmVuY2VDaGFuZ2VzID0gZGlmZlJldmVyc2VSZWZGb3JVcGRhdGUoXHJcbiAgICAgIGhpZXJhcmNoeSwgdC5vbGRSZWNvcmQsIHQucmVjb3JkLFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBvbGQgcmVjb3JkcyB0byByZW1vdmUgKGZpbHRlcmVkIG91dClcclxuICAgIGNvbnN0IGZpbHRlcmVkT3V0X3RvUmVtb3ZlID0gdW5pb24oXHJcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvUmVtb3ZlRmlsdGVyKSh0LCBhbmNlc3RvcklkeHMpLFxyXG4gICAgICAvLyBzdGlsbCByZWZlcmVuY2VkIC0gY2hlY2sgZmlsdGVyXHJcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvUmVtb3ZlRmlsdGVyKSh0LCByZWZlcmVuY2VDaGFuZ2VzLm5vdENoYW5nZWQpLFxyXG4gICAgICAvLyB1biByZWZlcmVuY2VkIC0gcmVtb3ZlIGlmIGluIHRoZXJlIGFscmVhZHlcclxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkobiA9PiB0b1JlbW92ZUZpbHRlcihuLCB0cnVlKSkodCwgcmVmZXJlbmNlQ2hhbmdlcy51blJlZmVyZW5jZWQpLFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBuZXcgcmVjb3JkcyB0byBhZGQgKGZpbHRlcmVkIGluKVxyXG4gICAgY29uc3QgZmlsdGVyZWRJbl90b0FkZCA9IHVuaW9uKFxyXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b0FkZEZpbHRlcikodCwgYW5jZXN0b3JJZHhzKSxcclxuICAgICAgLy8gbmV3bHkgcmVmZXJlbmNlZCAtIGNoZWNrIGZpbHRlclxyXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseShuID0+IHRvQWRkRmlsdGVyKG4sIHRydWUpKSh0LCByZWZlcmVuY2VDaGFuZ2VzLm5ld2x5UmVmZXJlbmNlZCksXHJcbiAgICAgIC8vIHJlZmVyZW5jZSB1bmNoYW5nZWQgLSByZXJ1biBmaWx0ZXIgaW4gY2FzZSBzb21ldGhpbmcgZWxzZSBjaGFuZ2VkXHJcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvQWRkRmlsdGVyKSh0LCByZWZlcmVuY2VDaGFuZ2VzLm5vdENoYW5nZWQpLFxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBjaGFuZ2VkID0gdW5pb24oXHJcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvVXBkYXRlRmlsdGVyKSh0LCBhbmNlc3RvcklkeHMpLFxyXG4gICAgICAvLyBzdGlsbCByZWZlcmVuY2VkIC0gcmVjaGVjayBmaWx0ZXJcclxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodG9VcGRhdGVGaWx0ZXIpKHQsIHJlZmVyZW5jZUNoYW5nZXMubm90Q2hhbmdlZCksXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IHNoYXJkS2V5Q2hhbmdlZCA9ICQoY2hhbmdlZCwgW1xyXG4gICAgICBmaWx0ZXIoYyA9PiBjLm9sZC5pbmRleFNoYXJkS2V5ICE9PSBjLm5ldy5pbmRleFNoYXJkS2V5KSxcclxuICAgIF0pO1xyXG5cclxuICAgIGNvbnN0IGNoYW5nZWRJblNhbWVTaGFyZCA9ICQoc2hhcmRLZXlDaGFuZ2VkLCBbXHJcbiAgICAgIGRpZmZlcmVuY2UoY2hhbmdlZCksXHJcbiAgICBdKTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHJlcyBvZiBzaGFyZEtleUNoYW5nZWQpIHtcclxuICAgICAgcHVsbChyZXMpKGNoYW5nZWQpO1xyXG4gICAgICBmaWx0ZXJlZE91dF90b1JlbW92ZS5wdXNoKHJlcyk7XHJcbiAgICAgIGZpbHRlcmVkSW5fdG9BZGQucHVzaChyZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvUmVtb3ZlLnB1c2goXHJcbiAgICAgICQoZmlsdGVyZWRPdXRfdG9SZW1vdmUsIFtcclxuICAgICAgICBtYXAoaSA9PiBpLm9sZCksXHJcbiAgICAgIF0pLFxyXG4gICAgKTtcclxuXHJcbiAgICB0b1dyaXRlLnB1c2goXHJcbiAgICAgICQoZmlsdGVyZWRJbl90b0FkZCwgW1xyXG4gICAgICAgIG1hcChpID0+IGkubmV3KSxcclxuICAgICAgXSksXHJcbiAgICApO1xyXG5cclxuICAgIHRvV3JpdGUucHVzaChcclxuICAgICAgJChjaGFuZ2VkSW5TYW1lU2hhcmQsIFtcclxuICAgICAgICBtYXAoaSA9PiBpLm5ldyksXHJcbiAgICAgIF0pLFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoe1xyXG4gICAgdG9SZW1vdmU6IGZsYXR0ZW4odG9SZW1vdmUpLFxyXG4gICAgdG9Xcml0ZTogZmxhdHRlbih0b1dyaXRlKSxcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IGdldEJ1aWxkSW5kZXhUcmFuc2FjdGlvbnNCeVNoYXJkID0gKGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKSA9PiB7XHJcbiAgY29uc3QgYnVpbGRUcmFuc2FjdGlvbnMgPSAkKHRyYW5zYWN0aW9ucywgW2ZpbHRlcihpc0J1aWxkSW5kZXgpXSk7XHJcbiAgaWYgKCFpc05vbkVtcHR5QXJyYXkoYnVpbGRUcmFuc2FjdGlvbnMpKSByZXR1cm4gW107XHJcbiAgY29uc3QgaW5kZXhOb2RlID0gdHJhbnNhY3Rpb25zLmluZGV4Tm9kZTtcclxuXHJcbiAgY29uc3QgZ2V0SW5kZXhLZXlzID0gKHQpID0+IHtcclxuICAgIGlmIChpc0dsb2JhbEluZGV4KGluZGV4Tm9kZSkpIHtcclxuICAgICAgcmV0dXJuIFtpbmRleE5vZGUubm9kZUtleSgpXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNSZWZlcmVuY2VJbmRleChpbmRleE5vZGUpKSB7XHJcbiAgICAgIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGhpZXJhcmNoeSkodC5yZWNvcmQua2V5KTtcclxuICAgICAgY29uc3QgcmVmRmllbGRzID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xyXG4gICAgICAgIGZpbHRlcihmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleChpbmRleE5vZGUpKSxcclxuICAgICAgXSk7XHJcbiAgICAgIGNvbnN0IGluZGV4S2V5cyA9IFtdO1xyXG4gICAgICBmb3IgKGNvbnN0IHJlZkZpZWxkIG9mIHJlZkZpZWxkcykge1xyXG4gICAgICAgIGNvbnN0IHJlZlZhbHVlID0gdC5yZWNvcmRbcmVmRmllbGQubmFtZV07XHJcbiAgICAgICAgaWYgKGlzU29tZXRoaW5nKHJlZlZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgJiYgaXNOb25FbXB0eVN0cmluZyhyZWZWYWx1ZS5rZXkpKSB7XHJcbiAgICAgICAgICBjb25zdCBpbmRleEtleSA9IGpvaW5LZXkoXHJcbiAgICAgICAgICAgIHJlZlZhbHVlLmtleSxcclxuICAgICAgICAgICAgaW5kZXhOb2RlLm5hbWUsXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgIGlmICghaW5jbHVkZXMoaW5kZXhLZXkpKGluZGV4S2V5cykpIHsgaW5kZXhLZXlzLnB1c2goaW5kZXhLZXkpOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBpbmRleEtleXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFtqb2luS2V5KFxyXG4gICAgICBnZXRBY3R1YWxLZXlPZlBhcmVudChcclxuICAgICAgICBpbmRleE5vZGUucGFyZW50KCkubm9kZUtleSgpLFxyXG4gICAgICAgIHQucmVjb3JkLmtleSxcclxuICAgICAgKSxcclxuICAgICAgaW5kZXhOb2RlLm5hbWUsXHJcbiAgICApXTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gJChidWlsZFRyYW5zYWN0aW9ucywgW1xyXG4gICAgbWFwKCh0KSA9PiB7XHJcbiAgICAgIGNvbnN0IG1hcHBlZFJlY29yZCA9IGV2YWx1YXRlKHQucmVjb3JkKShpbmRleE5vZGUpO1xyXG4gICAgICBpZiAoIW1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIpIHJldHVybiBudWxsO1xyXG4gICAgICBjb25zdCBpbmRleEtleXMgPSBnZXRJbmRleEtleXModCk7XHJcbiAgICAgIHJldHVybiAkKGluZGV4S2V5cywgW1xyXG4gICAgICAgIG1hcChpbmRleEtleSA9PiAoe1xyXG4gICAgICAgICAgbWFwcGVkUmVjb3JkLFxyXG4gICAgICAgICAgaW5kZXhOb2RlLFxyXG4gICAgICAgICAgaW5kZXhLZXksXHJcbiAgICAgICAgICBpbmRleFNoYXJkS2V5OiBnZXRJbmRleGVkRGF0YUtleShcclxuICAgICAgICAgICAgaW5kZXhOb2RlLFxyXG4gICAgICAgICAgICBpbmRleEtleSxcclxuICAgICAgICAgICAgbWFwcGVkUmVjb3JkLnJlc3VsdCxcclxuICAgICAgICAgICksXHJcbiAgICAgICAgfSkpLFxyXG4gICAgICBdKTtcclxuICAgIH0pLFxyXG4gICAgZmxhdHRlbixcclxuICAgIGZpbHRlcihpc1NvbWV0aGluZyksXHJcbiAgXSk7XHJcbn07XHJcblxyXG5jb25zdCBnZXRfQ3JlYXRlX0RlbGV0ZV9UcmFuc2FjdGlvbnNCeVNoYXJkID0gcHJlZCA9PiAoaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMpID0+IHtcclxuICBjb25zdCBjcmVhdGVUcmFuc2FjdGlvbnMgPSAkKHRyYW5zYWN0aW9ucywgW2ZpbHRlcihwcmVkKV0pO1xyXG5cclxuICBjb25zdCBnZXRJbmRleE5vZGVzVG9BcHBseSA9ICh0LCBpbmRleGVzKSA9PiAkKGluZGV4ZXMsIFtcclxuICAgIG1hcCgobikgPT4ge1xyXG4gICAgICBjb25zdCBtYXBwZWRSZWNvcmQgPSBldmFsdWF0ZSh0LnJlY29yZCkobi5pbmRleE5vZGUpO1xyXG4gICAgICByZXR1cm4gKHtcclxuICAgICAgICBtYXBwZWRSZWNvcmQsXHJcbiAgICAgICAgaW5kZXhOb2RlOiBuLmluZGV4Tm9kZSxcclxuICAgICAgICBpbmRleEtleTogbi5pbmRleEtleSxcclxuICAgICAgICBpbmRleFNoYXJkS2V5OiBnZXRJbmRleGVkRGF0YUtleShcclxuICAgICAgICAgIG4uaW5kZXhOb2RlLFxyXG4gICAgICAgICAgbi5pbmRleEtleSxcclxuICAgICAgICAgIG1hcHBlZFJlY29yZC5yZXN1bHQsXHJcbiAgICAgICAgKSxcclxuICAgICAgfSk7XHJcbiAgICB9KSxcclxuICAgIGZpbHRlcihuID0+IG4ubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciksXHJcbiAgXSk7XHJcblxyXG4gIGNvbnN0IGFsbFRvQXBwbHkgPSBbXTtcclxuXHJcbiAgZm9yIChjb25zdCB0IG9mIGNyZWF0ZVRyYW5zYWN0aW9ucykge1xyXG4gICAgY29uc3QgYW5jZXN0b3JJZHhzID0gZ2V0UmVsZXZhbnRBbmNlc3RvckluZGV4ZXMoaGllcmFyY2h5LCB0LnJlY29yZCk7XHJcbiAgICBjb25zdCByZXZlcnNlUmVmID0gZ2V0UmVsZXZhbnRSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyhoaWVyYXJjaHksIHQucmVjb3JkKTtcclxuXHJcbiAgICBhbGxUb0FwcGx5LnB1c2goXHJcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHQsIGFuY2VzdG9ySWR4cyksXHJcbiAgICApO1xyXG4gICAgYWxsVG9BcHBseS5wdXNoKFxyXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0LCByZXZlcnNlUmVmKSxcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZmxhdHRlbihhbGxUb0FwcGx5KTtcclxufTtcclxuXHJcbmNvbnN0IGdldERlbGV0ZVRyYW5zYWN0aW9uc0J5U2hhcmQgPSBnZXRfQ3JlYXRlX0RlbGV0ZV9UcmFuc2FjdGlvbnNCeVNoYXJkKGlzRGVsZXRlKTtcclxuXHJcbmNvbnN0IGdldENyZWF0ZVRyYW5zYWN0aW9uc0J5U2hhcmQgPSBnZXRfQ3JlYXRlX0RlbGV0ZV9UcmFuc2FjdGlvbnNCeVNoYXJkKGlzQ3JlYXRlKTtcclxuXHJcbmNvbnN0IGRpZmZSZXZlcnNlUmVmRm9yVXBkYXRlID0gKGFwcEhpZXJhcmNoeSwgb2xkUmVjb3JkLCBuZXdSZWNvcmQpID0+IHtcclxuICBjb25zdCBvbGRJbmRleGVzID0gZ2V0UmVsZXZhbnRSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyhcclxuICAgIGFwcEhpZXJhcmNoeSwgb2xkUmVjb3JkLFxyXG4gICk7XHJcbiAgY29uc3QgbmV3SW5kZXhlcyA9IGdldFJlbGV2YW50UmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMoXHJcbiAgICBhcHBIaWVyYXJjaHksIG5ld1JlY29yZCxcclxuICApO1xyXG5cclxuICBjb25zdCB1blJlZmVyZW5jZWQgPSBkaWZmZXJlbmNlQnkoXHJcbiAgICBpID0+IGkuaW5kZXhLZXksXHJcbiAgICBvbGRJbmRleGVzLCBuZXdJbmRleGVzLFxyXG4gICk7XHJcblxyXG4gIGNvbnN0IG5ld2x5UmVmZXJlbmNlZCA9IGRpZmZlcmVuY2VCeShcclxuICAgIGkgPT4gaS5pbmRleEtleSxcclxuICAgIG5ld0luZGV4ZXMsIG9sZEluZGV4ZXMsXHJcbiAgKTtcclxuXHJcbiAgY29uc3Qgbm90Q2hhbmdlZCA9IGludGVyc2VjdGlvbkJ5KFxyXG4gICAgaSA9PiBpLmluZGV4S2V5LFxyXG4gICAgbmV3SW5kZXhlcywgb2xkSW5kZXhlcyxcclxuICApO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdW5SZWZlcmVuY2VkLFxyXG4gICAgbmV3bHlSZWZlcmVuY2VkLFxyXG4gICAgbm90Q2hhbmdlZCxcclxuICB9O1xyXG59O1xyXG4iLCJpbXBvcnQgeyBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyByZXRyaWV2ZSB9IGZyb20gJy4vcmV0cmlldmUnO1xyXG5pbXBvcnQgeyBleGVjdXRlVHJhbnNhY3Rpb25zIH0gZnJvbSAnLi9leGVjdXRlJztcclxuaW1wb3J0IHtcclxuICAkLCBqb2luS2V5LCBnZXRMb2NrLCBpc05vbG9jaywgcmVsZWFzZUxvY2ssXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHtcclxuICBMT0NLX0ZJTEVfS0VZLCBUUkFOU0FDVElPTlNfRk9MREVSLFxyXG4gIHRpbWVvdXRNaWxsaXNlY29uZHMsIGdldFRyYW5zYWN0aW9uSWQsXHJcbiAgbWF4TG9ja1JldHJpZXMsXHJcbn0gZnJvbSAnLi90cmFuc2FjdGlvbnNDb21tb24nO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNsZWFudXAgPSBhc3luYyAoYXBwKSA9PiB7XHJcbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldFRyYW5zYWN0aW9uTG9jayhhcHApO1xyXG4gIGlmIChpc05vbG9jayhsb2NrKSkgcmV0dXJuO1xyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgdHJhbnNhY3Rpb25zID0gYXdhaXQgcmV0cmlldmUoYXBwKTtcclxuICAgIGlmICh0cmFuc2FjdGlvbnMubGVuZ3RoID4gMCkge1xyXG4gICAgICBhd2FpdCBleGVjdXRlVHJhbnNhY3Rpb25zKGFwcCkodHJhbnNhY3Rpb25zKTtcclxuXHJcbiAgICAgIGNvbnN0IGZvbGRlciA9IHRyYW5zYWN0aW9ucy5mb2xkZXJLZXlcclxuICAgICAgICA/IHRyYW5zYWN0aW9ucy5mb2xkZXJLZXlcclxuICAgICAgICA6IFRSQU5TQUNUSU9OU19GT0xERVI7XHJcblxyXG4gICAgICBjb25zdCBkZWxldGVGaWxlcyA9ICQodHJhbnNhY3Rpb25zLCBbXHJcbiAgICAgICAgbWFwKHQgPT4gam9pbktleShcclxuICAgICAgICAgIGZvbGRlcixcclxuICAgICAgICAgIGdldFRyYW5zYWN0aW9uSWQoXHJcbiAgICAgICAgICAgIHQucmVjb3JkSWQsIHQudHJhbnNhY3Rpb25UeXBlLFxyXG4gICAgICAgICAgICB0LnVuaXF1ZUlkLFxyXG4gICAgICAgICAgKSxcclxuICAgICAgICApKSxcclxuICAgICAgICBtYXAoYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKSxcclxuICAgICAgXSk7XHJcblxyXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChkZWxldGVGaWxlcyk7XHJcbiAgICB9XHJcbiAgfSBmaW5hbGx5IHtcclxuICAgIGF3YWl0IHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgZ2V0VHJhbnNhY3Rpb25Mb2NrID0gYXN5bmMgYXBwID0+IGF3YWl0IGdldExvY2soXHJcbiAgYXBwLCBMT0NLX0ZJTEVfS0VZLFxyXG4gIHRpbWVvdXRNaWxsaXNlY29uZHMsIG1heExvY2tSZXRyaWVzLFxyXG4pO1xyXG4iLCJpbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBjb25maWdGb2xkZXIsIGFwcERlZmluaXRpb25GaWxlLCAkIH0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgVFJBTlNBQ1RJT05TX0ZPTERFUiB9IGZyb20gJy4uL3RyYW5zYWN0aW9ucy90cmFuc2FjdGlvbnNDb21tb24nO1xyXG5pbXBvcnQgeyBBVVRIX0ZPTERFUiwgVVNFUlNfTElTVF9GSUxFLCBBQ0NFU1NfTEVWRUxTX0ZJTEUgfSBmcm9tICcuLi9hdXRoQXBpL2F1dGhDb21tb24nO1xyXG5pbXBvcnQgeyBpbml0aWFsaXNlUm9vdENvbGxlY3Rpb25zIH0gZnJvbSAnLi4vY29sbGVjdGlvbkFwaS9pbml0aWFsaXNlJztcclxuaW1wb3J0IHsgaW5pdGlhbGlzZUluZGV4IH0gZnJvbSAnLi4vaW5kZXhpbmcvaW5pdGlhbGlzZUluZGV4JztcclxuaW1wb3J0IHsgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LCBpc0dsb2JhbEluZGV4LCBpc1NpbmdsZVJlY29yZCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7IF9zYXZlIH0gZnJvbSAnLi4vcmVjb3JkQXBpL3NhdmUnO1xyXG5pbXBvcnQgeyBnZXROZXcgfSBmcm9tICcuLi9yZWNvcmRBcGkvZ2V0TmV3JztcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlRGF0YSA9IGFzeW5jIChkYXRhc3RvcmUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbiwgYWNjZXNzTGV2ZWxzKSA9PiB7XHJcbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihjb25maWdGb2xkZXIpO1xyXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKGFwcERlZmluaXRpb25GaWxlLCBhcHBsaWNhdGlvbkRlZmluaXRpb24pO1xyXG5cclxuICBhd2FpdCBpbml0aWFsaXNlUm9vdENvbGxlY3Rpb25zKGRhdGFzdG9yZSwgYXBwbGljYXRpb25EZWZpbml0aW9uLmhpZXJhcmNoeSk7XHJcbiAgYXdhaXQgaW5pdGlhbGlzZVJvb3RJbmRleGVzKGRhdGFzdG9yZSwgYXBwbGljYXRpb25EZWZpbml0aW9uLmhpZXJhcmNoeSk7XHJcblxyXG4gIGF3YWl0IGluaXRpYWxpc2VSb290U2luZ2xlUmVjb3JkcyhkYXRhc3RvcmUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbi5oaWVyYXJjaHkpO1xyXG5cclxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKFRSQU5TQUNUSU9OU19GT0xERVIpO1xyXG5cclxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKEFVVEhfRk9MREVSKTtcclxuXHJcbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oVVNFUlNfTElTVF9GSUxFLCBbXSk7XHJcblxyXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKFxyXG4gICAgQUNDRVNTX0xFVkVMU19GSUxFLCBcclxuICAgIGFjY2Vzc0xldmVscyA/IGFjY2Vzc0xldmVscyA6IHsgdmVyc2lvbjogMCwgbGV2ZWxzOiBbXSB9KTtcclxufTtcclxuXHJcbmNvbnN0IGluaXRpYWxpc2VSb290SW5kZXhlcyA9IGFzeW5jIChkYXRhc3RvcmUsIGhpZXJhcmNoeSkgPT4ge1xyXG4gIGNvbnN0IGZsYXRoaWVyYXJjaHkgPSBnZXRGbGF0dGVuZWRIaWVyYXJjaHkoaGllcmFyY2h5KTtcclxuICBjb25zdCBnbG9iYWxJbmRleGVzID0gJChmbGF0aGllcmFyY2h5LCBbXHJcbiAgICBmaWx0ZXIoaXNHbG9iYWxJbmRleCksXHJcbiAgXSk7XHJcblxyXG4gIGZvciAoY29uc3QgaW5kZXggb2YgZ2xvYmFsSW5kZXhlcykge1xyXG4gICAgaWYgKCFhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGluZGV4Lm5vZGVLZXkoKSkpIHsgYXdhaXQgaW5pdGlhbGlzZUluZGV4KGRhdGFzdG9yZSwgJycsIGluZGV4KTsgfVxyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGluaXRpYWxpc2VSb290U2luZ2xlUmVjb3JkcyA9IGFzeW5jIChkYXRhc3RvcmUsIGhpZXJhY2h5KSA9PiB7XHJcbiAgY29uc3QgZmxhdGhpZXJhcmNoeSA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShoaWVyYWNoeSk7XHJcbiAgY29uc3Qgc2luZ2xlUmVjb3JkcyA9ICQoZmxhdGhpZXJhcmNoeSwgW1xyXG4gICAgZmlsdGVyKGlzU2luZ2xlUmVjb3JkKSxcclxuICBdKTtcclxuXHJcbiAgLyogZm9yIChsZXQgcmVjb3JkIG9mIHNpbmdsZVJlY29yZHMpIHtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBnZXROZXcoeyBkYXRhc3RvcmU6IGRhdGFzdG9yZSwgaGllcmFyY2h5OiBhcHBEZWZpbml0aW9uLmhpZXJhcmNoeSB9KVxyXG4gICAgICAgICAgICAocmVjb3JkLm5vZGVLZXkoKSxcclxuICAgICAgICAgICAgICAgIHJlY29yZC5uYW1lXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIF9zYXZlKHsgZGF0YXN0b3JlOiBkYXRhc3RvcmUsIGhpZXJhcmNoeTogYXBwRGVmaW5pdGlvbi5oaWVyYXJjaHkgfSxcclxuICAgICAgICAgICAgcmVzdWx0XHJcbiAgICAgICAgKTtcclxuICAgIH0gKi9cclxufTtcclxuIiwiaW1wb3J0IHsgaXNOb3RoaW5nIH0gZnJvbSAnLi4vY29tbW9uJztcclxuXHJcbmV4cG9ydCBjb25zdCBnZXREYXRhYmFzZU1hbmFnZXIgPSBkYXRhYmFzZU1hbmFnZXIgPT4gKHtcclxuICBjcmVhdGVFbXB0eU1hc3RlckRiOiBjcmVhdGVFbXB0eU1hc3RlckRiKGRhdGFiYXNlTWFuYWdlciksXHJcbiAgY3JlYXRlRW1wdHlJbnN0YW5jZURiOiBjcmVhdGVFbXB0eUluc3RhbmNlRGIoZGF0YWJhc2VNYW5hZ2VyKSxcclxuICBnZXRJbnN0YW5jZURiUm9vdENvbmZpZzogZGF0YWJhc2VNYW5hZ2VyLmdldEluc3RhbmNlRGJSb290Q29uZmlnLFxyXG4gIG1hc3RlckRhdGFzdG9yZUNvbmZpZzogZ2V0TWFzdGVyRGF0YXN0b3JlQ29uZmlnKGRhdGFiYXNlTWFuYWdlciksXHJcbiAgZ2V0SW5zdGFuY2VEYXRhc3RvcmVDb25maWc6IGdldEluc3RhbmNlRGF0YXN0b3JlQ29uZmlnKGRhdGFiYXNlTWFuYWdlciksXHJcbn0pO1xyXG5cclxuY29uc3QgZ2V0TWFzdGVyRGF0YXN0b3JlQ29uZmlnID0gZGF0YWJhc2VNYW5hZ2VyID0+IGRhdGFiYXNlTWFuYWdlci5nZXREYXRhc3RvcmVDb25maWcoJ21hc3RlcicpO1xyXG5cclxuY29uc3QgZ2V0SW5zdGFuY2VEYXRhc3RvcmVDb25maWcgPSBkYXRhYmFzZU1hbmFnZXIgPT4gKGFwcGxpY2F0aW9uSWQsIGluc3RhbmNlSWQpID0+IGRhdGFiYXNlTWFuYWdlci5nZXREYXRhc3RvcmVDb25maWcoXHJcbiAgYXBwbGljYXRpb25JZCwgaW5zdGFuY2VJZCxcclxuKTtcclxuXHJcbmNvbnN0IGNyZWF0ZUVtcHR5TWFzdGVyRGIgPSBkYXRhYmFzZU1hbmFnZXIgPT4gYXN5bmMgKCkgPT4gYXdhaXQgZGF0YWJhc2VNYW5hZ2VyLmNyZWF0ZUVtcHR5RGIoJ21hc3RlcicpO1xyXG5cclxuY29uc3QgY3JlYXRlRW1wdHlJbnN0YW5jZURiID0gZGF0YWJhc2VNYW5hZ2VyID0+IGFzeW5jIChhcHBsaWNhdGlvbklkLCBpbnN0YW5jZUlkKSA9PiB7XHJcbiAgaWYgKGlzTm90aGluZyhhcHBsaWNhdGlvbklkKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0ZURiOiBhcHBsaWNhdGlvbiBpZCBub3Qgc3VwcGxpZWQnKTsgfVxyXG4gIGlmIChpc05vdGhpbmcoaW5zdGFuY2VJZCkpIHsgdGhyb3cgbmV3IEVycm9yKCdDcmVhdGVEYjogaW5zdGFuY2UgaWQgbm90IHN1cHBsaWVkJyk7IH1cclxuXHJcbiAgcmV0dXJuIGF3YWl0IGRhdGFiYXNlTWFuYWdlci5jcmVhdGVFbXB0eURiKFxyXG4gICAgYXBwbGljYXRpb25JZCxcclxuICAgIGluc3RhbmNlSWQsXHJcbiAgKTtcclxufTtcclxuIiwiaW1wb3J0IGdldFJlY29yZEFwaSBmcm9tIFwiLi9yZWNvcmRBcGlcIjtcclxuaW1wb3J0IGdldENvbGxlY3Rpb25BcGkgZnJvbSBcIi4vY29sbGVjdGlvbkFwaVwiO1xyXG5pbXBvcnQgZ2V0SW5kZXhBcGkgZnJvbSBcIi4vaW5kZXhBcGlcIjtcclxuaW1wb3J0IGdldFRlbXBsYXRlQXBpIGZyb20gXCIuL3RlbXBsYXRlQXBpXCI7XHJcbmltcG9ydCBnZXRBdXRoQXBpIGZyb20gXCIuL2F1dGhBcGlcIjtcclxuaW1wb3J0IGdldEFjdGlvbnNBcGkgZnJvbSBcIi4vYWN0aW9uc0FwaVwiO1xyXG5pbXBvcnQge3NldHVwRGF0YXN0b3JlLCBjcmVhdGVFdmVudEFnZ3JlZ2F0b3J9IGZyb20gXCIuL2FwcEluaXRpYWxpc2VcIjtcclxuaW1wb3J0IHtpbml0aWFsaXNlQWN0aW9uc30gZnJvbSBcIi4vYWN0aW9uc0FwaS9pbml0aWFsaXNlXCJcclxuaW1wb3J0IHtpc1NvbWV0aGluZ30gZnJvbSBcIi4vY29tbW9uXCI7XHJcbmltcG9ydCB7Y2xlYW51cH0gZnJvbSBcIi4vdHJhbnNhY3Rpb25zL2NsZWFudXBcIjtcclxuaW1wb3J0IHtnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9uc30gZnJvbSBcIi4vYXV0aEFwaS9nZW5lcmF0ZUZ1bGxQZXJtaXNzaW9uc1wiO1xyXG5pbXBvcnQge2dldEFwcGxpY2F0aW9uRGVmaW5pdGlvbn0gZnJvbSBcIi4vdGVtcGxhdGVBcGkvZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uXCI7XHJcbmltcG9ydCBjb21tb24gZnJvbSBcIi4vY29tbW9uXCI7XHJcbmltcG9ydCB7Z2V0QmVoYXZpb3VyU291cmNlc30gZnJvbSBcIi4vdGVtcGxhdGVBcGkvZ2V0QmVoYXZpb3VyU291cmNlc1wiO1xyXG5pbXBvcnQgaGllcmFyY2h5IGZyb20gXCIuL3RlbXBsYXRlQXBpL2hpZXJhcmNoeVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEFwcEFwaXMgPSBhc3luYyAoc3RvcmUsIGJlaGF2aW91clNvdXJjZXMgPSBudWxsLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhbnVwVHJhbnNhY3Rpb25zID0gbnVsbCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXBvY2hUaW1lID0gbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcnlwdG8gPSBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcERlZmluaXRpb24gPSBudWxsKSA9PiB7XHJcblxyXG4gICAgc3RvcmUgPSBzZXR1cERhdGFzdG9yZShzdG9yZSk7XHJcblxyXG4gICAgaWYoIWFwcERlZmluaXRpb24pXHJcbiAgICAgICAgYXBwRGVmaW5pdGlvbiA9IGF3YWl0IGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbihzdG9yZSkoKTtcclxuXHJcbiAgICBpZighYmVoYXZpb3VyU291cmNlcylcclxuICAgICAgICBiZWhhdmlvdXJTb3VyY2VzID0gYXdhaXQgZ2V0QmVoYXZpb3VyU291cmNlcyhzdG9yZSk7XHJcblxyXG4gICAgY29uc3QgZXZlbnRBZ2dyZWdhdG9yID0gY3JlYXRlRXZlbnRBZ2dyZWdhdG9yKCk7XHJcblxyXG4gICAgY29uc3QgYXBwID0ge1xyXG4gICAgICAgIGRhdGFzdG9yZTpzdG9yZSxcclxuICAgICAgICBjcnlwdG8sXHJcbiAgICAgICAgcHVibGlzaDpldmVudEFnZ3JlZ2F0b3IucHVibGlzaCxcclxuICAgICAgICBoaWVyYXJjaHk6YXBwRGVmaW5pdGlvbi5oaWVyYXJjaHksXHJcbiAgICAgICAgYWN0aW9uczphcHBEZWZpbml0aW9uLmFjdGlvbnNcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgdGVtcGxhdGVBcGkgPSBnZXRUZW1wbGF0ZUFwaShhcHApOyAgICBcclxuXHJcbiAgICBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucyA9IGlzU29tZXRoaW5nKGNsZWFudXBUcmFuc2FjdGlvbnMpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGNsZWFudXBUcmFuc2FjdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBhc3luYyAoKSA9PiBhd2FpdCBjbGVhbnVwKGFwcCk7XHJcblxyXG4gICAgYXBwLmdldEVwb2NoVGltZSA9IGlzU29tZXRoaW5nKGdldEVwb2NoVGltZSlcclxuICAgICAgICAgICAgICAgICAgICAgICA/IGdldEVwb2NoVGltZVxyXG4gICAgICAgICAgICAgICAgICAgICAgIDogYXN5bmMgKCkgPT4gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcclxuXHJcbiAgICBjb25zdCByZWNvcmRBcGkgPSBnZXRSZWNvcmRBcGkoYXBwKTtcclxuICAgIGNvbnN0IGNvbGxlY3Rpb25BcGkgPSBnZXRDb2xsZWN0aW9uQXBpKGFwcCk7XHJcbiAgICBjb25zdCBpbmRleEFwaSA9IGdldEluZGV4QXBpKGFwcCk7XHJcbiAgICBjb25zdCBhdXRoQXBpID0gZ2V0QXV0aEFwaShhcHApO1xyXG4gICAgY29uc3QgYWN0aW9uc0FwaSA9IGdldEFjdGlvbnNBcGkoYXBwKTtcclxuXHJcbiAgICBjb25zdCBhdXRoZW50aWNhdGVBcyA9IGFzeW5jICh1c2VybmFtZSwgcGFzc3dvcmQpID0+IHtcclxuICAgICAgICBhcHAudXNlciA9IGF3YWl0IGF1dGhBcGkuYXV0aGVudGljYXRlKHVzZXJuYW1lLCBwYXNzd29yZCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHdpdGhGdWxsQWNjZXNzID0gKCkgPT4ge1xyXG4gICAgICAgIGFwcC51c2VyID0ge1xyXG4gICAgICAgICAgICBuYW1lOiBcImFwcFwiLFxyXG4gICAgICAgICAgICBwZXJtaXNzaW9ucyA6IGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zKGFwcCksXHJcbiAgICAgICAgICAgIGlzVXNlcjpmYWxzZSxcclxuICAgICAgICAgICAgdGVtcDpmYWxzZVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgYXNVc2VyID0gKHVzZXIpID0+IHtcclxuICAgICAgICBhcHAudXNlciA9IHVzZXJcclxuICAgIH07XHJcblxyXG4gICAgXHJcblxyXG4gICAgbGV0IGFwaXMgPSB7XHJcbiAgICAgICAgcmVjb3JkQXBpLCBcclxuICAgICAgICB0ZW1wbGF0ZUFwaSxcclxuICAgICAgICBjb2xsZWN0aW9uQXBpLFxyXG4gICAgICAgIGluZGV4QXBpLFxyXG4gICAgICAgIGF1dGhBcGksXHJcbiAgICAgICAgYWN0aW9uc0FwaSxcclxuICAgICAgICBzdWJzY3JpYmU6IGV2ZW50QWdncmVnYXRvci5zdWJzY3JpYmUsXHJcbiAgICAgICAgYXV0aGVudGljYXRlQXMsXHJcbiAgICAgICAgd2l0aEZ1bGxBY2Nlc3MsXHJcbiAgICAgICAgYXNVc2VyXHJcbiAgICB9O1xyXG5cclxuICAgIGFwaXMuYWN0aW9ucyA9IGluaXRpYWxpc2VBY3Rpb25zKFxyXG4gICAgICAgIGV2ZW50QWdncmVnYXRvci5zdWJzY3JpYmUsXHJcbiAgICAgICAgYmVoYXZpb3VyU291cmNlcyxcclxuICAgICAgICBhcHBEZWZpbml0aW9uLmFjdGlvbnMsXHJcbiAgICAgICAgYXBwRGVmaW5pdGlvbi50cmlnZ2VycyxcclxuICAgICAgICBhcGlzKTtcclxuXHJcblxyXG4gICAgcmV0dXJuIGFwaXM7XHJcbn07XHJcblxyXG5leHBvcnQge2V2ZW50cywgZXZlbnRzTGlzdH0gZnJvbSBcIi4vY29tbW9uL2V2ZW50c1wiO1xyXG5leHBvcnQge2dldFRlbXBsYXRlQXBpfSBmcm9tIFwiLi90ZW1wbGF0ZUFwaVwiO1xyXG5leHBvcnQge2dldFJlY29yZEFwaX0gZnJvbSBcIi4vcmVjb3JkQXBpXCI7XHJcbmV4cG9ydCB7Z2V0Q29sbGVjdGlvbkFwaX0gZnJvbSBcIi4vY29sbGVjdGlvbkFwaVwiO1xyXG5leHBvcnQge2dldEF1dGhBcGl9IGZyb20gXCIuL2F1dGhBcGlcIjtcclxuZXhwb3J0IHtnZXRJbmRleEFwaX0gZnJvbSBcIi4vaW5kZXhBcGlcIjtcclxuZXhwb3J0IHtzZXR1cERhdGFzdG9yZX0gZnJvbSBcIi4vYXBwSW5pdGlhbGlzZVwiO1xyXG5leHBvcnQge2dldEFjdGlvbnNBcGl9IGZyb20gXCIuL2FjdGlvbnNBcGlcIjtcclxuZXhwb3J0IHtpbml0aWFsaXNlRGF0YX0gZnJvbSBcIi4vYXBwSW5pdGlhbGlzZS9pbml0aWFsaXNlRGF0YVwiO1xyXG5leHBvcnQge2dldERhdGFiYXNlTWFuYWdlcn0gZnJvbSBcIi4vYXBwSW5pdGlhbGlzZS9kYXRhYmFzZU1hbmFnZXJcIjtcclxuZXhwb3J0IHtoaWVyYXJjaHl9O1xyXG5leHBvcnQge2NvbW1vbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXRBcHBBcGlzOyJdLCJuYW1lcyI6WyJ1bmlvbiIsInJlZHVjZSIsImdlbmVyYXRlIiwiaXNVbmRlZmluZWQiLCJjbG9uZURlZXAiLCJzcGxpdCIsImZsb3ciLCJ0cmltIiwicmVwbGFjZSIsImlzQXJyYXkiLCJqb2luIiwiZHJvcFJpZ2h0IiwidGFrZVJpZ2h0IiwiaGVhZCIsImlzTnVsbCIsImlzTmFOIiwiaXNFbXB0eSIsImNvbnN0YW50Iiwic29tZSIsImlzU3RyaW5nIiwidGFpbCIsImluY2x1ZGVzIiwic3RhcnRzV2l0aCIsImZpbmRJbmRleCIsImlzSW50ZWdlciIsImlzRGF0ZSIsInRvTnVtYmVyIiwibWFwIiwiZmlsdGVyIiwiY29tcGlsZUV4cHJlc3Npb24iLCJjb21waWxlQ29kZSIsImtleXMiLCJpc0Z1bmN0aW9uIiwiY291bnRCeSIsImxhc3QiLCJmaW5kIiwidGFrZSIsImZpcnN0IiwiaW50ZXJzZWN0aW9uIiwiaGFzIiwibWVyZ2UiLCJtYXBWYWx1ZXMiLCJtYWtlcnVsZSIsImlzQm9vbGVhbiIsIm9wdGlvbnMiLCJ0eXBlQ29uc3RyYWludHMiLCJpc051bWJlciIsImlzT2JqZWN0TGlrZSIsImFzc2lnbiIsImFsbCIsImdldERlZmF1bHRPcHRpb25zIiwidmFsaWRhdGVUeXBlQ29uc3RyYWludHMiLCJpc09iamVjdCIsImNsb25lIiwidmFsdWVzIiwia2V5QnkiLCJvcmRlckJ5IiwiY29uY2F0IiwicmV2ZXJzZSIsImdsb2JhbCIsImJhc2U2NC5mcm9tQnl0ZUFycmF5IiwiaWVlZTc1NC5yZWFkIiwiaWVlZTc1NC53cml0ZSIsImJhc2U2NC50b0J5dGVBcnJheSIsInJlYWQiLCJkaWZmZXJlbmNlIiwiQnVmZmVyIiwicmVhZEluZGV4IiwiZmxhdHRlbiIsImVhY2giLCJfIiwicHVsbCIsImRlbGV0ZVJlY29yZCIsInZhbGlkYXRlIiwibWF4IiwiZGVmYXVsdENhc2UiLCJldmVyeSIsInVuaXFCeSIsImFwaSIsImNyZWF0ZVRlbXBvcmFyeUFjY2VzcyIsImNyZWF0ZVVzZXIiLCJ1bmlxV2l0aCIsInNldFVzZXJBY2Nlc3NMZXZlbHMiLCJleGVjdXRlQWN0aW9uIiwiY0NvZGUiLCJjRXhwIiwiZ3JvdXBCeSIsImlzRXF1YWwiLCJkaWZmZXJlbmNlQnkiLCJpbnRlcnNlY3Rpb25CeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFFQSxNQUFNLFVBQVUsR0FBRyxLQUFLLElBQUlBLFFBQUssQ0FBQyxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFL0UsTUFBTSxNQUFNLEdBQUcsTUFBTSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRXBDLE1BQU0sT0FBTyxHQUFHO0VBQ2QsU0FBUyxFQUFFO0lBQ1QsSUFB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O0VBRXBCLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDZixNQUFNLElBQUksS0FBSyxDQUFDLGdEQUFnRCxDQUFDO0dBQ2xFOzs7Ozs7O0VBT0QsWUFBWSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBQzs7O0VBR3RFLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxZQUFZLEVBQUM7OztFQUd6QyxDQUFDLEdBQUcsWUFBWSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUc7O0VBRXBDLElBQUksQ0FBQyxHQUFHLEVBQUM7O0VBRVQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDeEMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDO0lBQ2xLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEVBQUUsSUFBSSxLQUFJO0lBQzdCLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFJO0lBQzVCLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxLQUFJO0dBQ3RCOztFQUVELElBQUksWUFBWSxLQUFLLENBQUMsRUFBRTtJQUN0QixHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUM7SUFDbkYsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUk7R0FDdEIsTUFBTSxJQUFJLFlBQVksS0FBSyxDQUFDLEVBQUU7SUFDN0IsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDO0lBQzlILEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFJO0lBQzVCLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxLQUFJO0dBQ3RCOztFQUVELE9BQU8sR0FBRztDQUNYOztBQUVELFNBQVMsZUFBZSxFQUFFLEdBQUcsRUFBRTtFQUM3QixPQUFPLE1BQU0sQ0FBQyxHQUFHLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFH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QUssR0FBRyxDQUFDLEVBQUM7RUFDZCxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFDO0VBQy9CLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDO0VBQ3JCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFDOztFQUUxQixDQUFDLElBQUksRUFBQzs7RUFFTixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFDO0VBQzdCLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBQztFQUNkLEtBQUssSUFBSSxLQUFJO0VBQ2IsT0FBTyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLEVBQUU7O0VBRTFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUM7RUFDN0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFDO0VBQ2QsS0FBSyxJQUFJLEtBQUk7RUFDYixPQUFPLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUUsRUFBRTs7RUFFMUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO0lBQ1gsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFLO0dBQ2QsTUFBTSxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDckIsT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxRQUFRLENBQUM7R0FDM0MsTUFBTTtJQUNMLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFDO0lBQ3pCLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBSztHQUNkO0VBQ0QsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7Q0FDaEQ7O0FBRUQsQUFBTyxTQUFTLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtFQUNoRSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBQztFQUNYLElBQUksSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLEVBQUM7RUFDaEMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUM7RUFDMUIsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUM7RUFDckIsSUFBSSxFQUFFLElBQUksSUFBSSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDO0VBQ2hFLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksTUFBTSxHQUFHLENBQUMsRUFBQztFQUMvQixJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBQztFQUNyQixJQUFJLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBQzs7RUFFM0QsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFDOztFQUV2QixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssUUFBUSxFQUFFO0lBQ3RDLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUM7SUFDeEIsQ0FBQyxHQUFHLEtBQUk7R0FDVCxNQUFNO0lBQ0wsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFDO0lBQzFDLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO01BQ3JDLENBQUMsR0FBRTtNQUNILENBQUMsSUFBSSxFQUFDO0tBQ1A7SUFDRCxJQUFJLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxFQUFFO01BQ2xCLEtBQUssSUFBSSxFQUFFLEdBQUcsRUFBQztLQUNoQixNQUFNO01BQ0wsS0FBSyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFDO0tBQ3JDO0lBQ0QsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUNsQixDQUFDLEdBQUU7TUFDSCxDQUFDLElBQUksRUFBQztLQUNQOztJQUVELElBQUksQ0FBQyxHQUFHLEtBQUssSUFBSSxJQUFJLEVBQUU7TUFDckIsQ0FBQyxHQUFHLEVBQUM7TUFDTCxDQUFDLEdBQUcsS0FBSTtLQUNULE1BQU0sSUFBSSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsRUFBRTtNQUN6QixDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUM7TUFDdkMsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFLO0tBQ2QsTUFBTTtNQUNMLENBQUMsR0FB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LEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUNqRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7RUFDbEQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0VBQ3BCOztBQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsWUFBWSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7RUFDdkUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0VBQ2xELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzlDOztBQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsWUFBWSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7RUFDdkUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0VBQ2xELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0VBQzlDOztBQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsWUFBWSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7RUFDdkUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDOztFQUVsRCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO09BQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO09B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QUMsQ0FBQztLQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztFQUMzQjs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxTQUFTLFdBQVcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQ3JFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQzs7RUFFbEQsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO0tBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDckI7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxXQUFXLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUNyRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7RUFDbEQsT0FBT0MsSUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7RUFDL0M7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxXQUFXLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUNyRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7RUFDbEQsT0FBT0EsSUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7RUFDaEQ7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7RUFDbEQsT0FBT0EsSUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7RUFDL0M7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7RUFDbEQsT0FBT0EsSUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7RUFDaEQ7O0FBRUQsU0FBUyxRQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUU7RUFDcEQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsNkNBQTZDLENBQUM7RUFDOUYsSUFBSSxLQUFLLEdBQUcsR0FBRyxJQUFJLEtBQUssR0FBRyxHQUFHLEVBQUUsTUFBTSxJQUFJLFVBQVUsQ0FBQyxtQ0FBbUMsQ0FBQztFQUN6RixJQUFJLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLElBQUksVUFBVSxDQUFDLG9CQUFvQixDQUFDO0NBQzFFOztBQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFNBQVMsV0FBVyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRTtFQUN4RixLQUFLLEdBQUcsQ0FBQyxNQUFLO0VBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0VBQ25CLFVBQVUsR0FBRyxVQUFVLEdBQUcsRUFBQztFQUMzQixJQUFJLENBQUMsUUFBUSxFQUFFO0lBQ2IsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUM7SUFDOUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFDO0dBQ3ZEOztFQUVELElBQUksR0FBRyxHQUFHLEVBQUM7RUFDWCxJQUFJLENBQUMsR0FBRyxFQUFDO0VBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssR0FBRyxLQUFJO0VBQzNCLE9BQU8sRUFBRSxDQUFDLEdBQUcsVUFBVSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRTtJQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsSUFBSSxLQUFJO0dBQ3hDOztFQUVELE9BQU8sTUFBTSxHQUFHLFVBQVU7RUFDM0I7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFO0VBQ3hGLEtBQUssR0FBRyxDQUFDLE1BQUs7RUFDZCxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUM7RUFDbkIsVUFBVSxHQUFHLFVBQVUsR0FBRyxFQUFDO0VBQzNCLElBQUksQ0FBQyxRQUFRLEVBQUU7SUFDYixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBQztJQUM5QyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUM7R0FDdkQ7O0VBRUQsSUFBSSxDQUFDLEdBQUcsVUFBVSxHQUFHLEVBQUM7RUFDdEIsSUFBSSxHQUFHLEdBQUcsRUFBQztFQUNYLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLEtBQUk7RUFDL0IsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxFQUFFO0lBQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxJQUFJLEtBQUk7R0FDeEM7O0VBRUQsT0FBTyxNQUFNLEdBQUcsVUFBVTtFQUMzQjs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxTQUFTLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUMxRSxLQUFLLEdBQUcsQ0FBQyxNQUFLO0VBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0VBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFDO0VBQ3hELElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFDO0VBQzFELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxFQUFDO0VBQzdCLE9BQU8sTUFBTSxHQUFHLENBQUM7RUFDbEI7O0FBRUQsU0FBUyxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUU7RUFDNUQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxNQUFNLEdBQUcsS0FBSyxHQUFHLEVBQUM7RUFDekMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNoRSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLElBQUksS0FBSyxDQUFDLElBQUksWUFBWSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNuRSxDQUFDLFlBQVksR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFDO0dBQ2pDO0NBQ0Y7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsU0FBUyxhQUFhLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7RUFDaEYsS0FBSyxHQUFHLENBQUMsTUFBSztFQUNkLE1BQU0sR0FBRyxNQUFNLEdBQUcsRUFBQztFQUNuQixJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztFQUMxRCxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRTtJQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksRUFBQztJQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUM7R0FDakMsTUFBTTtJQUNMLGlCQUFpQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQztHQUM3QztFQUNELE9BQU8sTUFBTSxHQUFHLENBQUM7RUFDbEI7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsU0FBUyxhQUFhLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7RUFDaEYsS0FBSyxHQUFHLENBQUMsTUFBSztFQUNkLE1BQU0sR0FBRyxNQUFNLEdBQUcsRUFBQztFQUNuQixJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztFQUMxRCxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRTtJQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBQztJQUM1QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLEVBQUM7R0FDbEMsTUFBTTtJQUNMLGlCQUFpQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQztHQUM5QztFQUNELE9BQU8sTUFBTSxHQUFHLENBQUM7RUFDbEI7O0FBRUQsU0FBUyxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUU7RUFDNUQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxVQUFVLEdBQUcsS0FBSyxHQUFHLEVBQUM7RUFDN0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNoRSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUMsWUFBWSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFJO0dBQ3BFO0NBQ0Y7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsU0FBUyxhQUFhLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7RUFDaEYsS0FBSyxHQUFHLENBQUMsTUFBSztFQUNkLE1BQU0sR0FBRyxNQUFNLEdBQUcsRUFBQztFQUNuQixJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBQztFQUM5RCxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRTtJQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUM7SUFDakMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFDO0lBQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBQztJQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksRUFBQztHQUM5QixNQUFNO0lBQ0wsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO0dBQzdDO0VBQ0QsT0FBTyxNQUFNLEdBQUcsQ0FBQztFQUNsQjs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxTQUFTLGFBQWEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUNoRixLQUFLLEdBQUcsQ0FBQyxNQUFLO0VBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0VBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFDO0VBQzlELElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO0lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFDO0lBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUUsRUFBQztJQUNqQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUM7SUFDaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxFQUFDO0dBQ2xDLE1BQU07SUFDTCxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUM7R0FDOUM7RUFDRCxPQUFPLE1BQU0sR0FBRyxDQUFDO0VBQ2xCOztBQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFNBQVMsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRTtFQUN0RixLQUFLLEdBQUcsQ0FBQyxNQUFLO0VBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0VBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUU7SUFDYixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBQzs7SUFFM0MsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFDO0dBQzdEOztFQUVELElBQUksQ0FBQyxHQUFHLEVBQUM7RUFDVCxJQUFJLEdBQUcsR0FBRyxFQUFDO0VBQ1gsSUFBSSxHQUFHLEdBQUcsRUFBQztFQUNYLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSTtFQUMzQixPQUFPLEVBQUUsQ0FBQyxHQUFHLFVBQVUsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUU7SUFDekMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQ3hELEdBQUcsR0FBRyxFQUFDO0tBQ1I7SUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsS0FBSTtHQUNyRDs7RUFFRCxPQUFPLE1BQU0sR0FBRyxVQUFVO0VBQzNCOztBQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFNBQVMsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRTtFQUN0RixLQUFLLEdBQUcsQ0FBQyxNQUFLO0VBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0VBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUU7SUFDYixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBQzs7SUFFM0MsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFDO0dBQzdEOztFQUVELElBQUksQ0FBQyxHQUFHLFVBQVUsR0FBRyxFQUFDO0VBQ3RCLElBQUksR0FBRyxHQUFHLEVBQUM7RUFDWCxJQUFJLEdBQUcsR0FBRyxFQUFDO0VBQ1gsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSTtFQUMvQixPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUU7SUFDakMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQ3hELEdBQUcsR0FBRyxFQUFDO0tBQ1I7SUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsS0FBSTtHQUNyRDs7RUFFRCxPQUFPLE1BQU0sR0FBRyxVQUFVO0VBQzNCOztBQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQ3hFLEtBQUssR0FBRyxDQUFDLE1BQUs7RUFDZCxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUM7RUFDbkIsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksRUFBQztFQUM1RCxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBQztFQUMxRCxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksR0FBRyxLQUFLLEdBQUcsRUFBQztFQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksRUFBQztFQUM3QixPQUFPLE1BQU0sR0FBRyxDQUFDO0VBQ2xCOztBQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQzlFLEtBQUssR0FBRyxDQUFDLE1BQUs7RUFDZCxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUM7RUFDbkIsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBQztFQUNoRSxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRTtJQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksRUFBQztJQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUM7R0FDakMsTUFBTTtJQUNMLGlCQUFpQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQztHQUM3QztFQUNELE9BQU8sTUFBTSxHQUFHLENBQUM7RUFDbEI7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7RUFDOUUsS0FBSyxHQUFHLENBQUMsTUFBSztFQUNkLE1BQU0sR0FBRyxNQUFNLEdBQUcsRUFBQztFQUNuQixJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFDO0VBQ2hFLElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO0lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFDO0lBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksRUFBQztHQUNsQyxNQUFNO0lBQ0wsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDO0dBQzlDO0VBQ0QsT0FBTyxNQUFNLEdBQUcsQ0FBQztFQUNsQjs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxTQUFTLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUM5RSxLQUFLLEdBQUcsQ0FBQyxNQUFLO0VBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0VBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxVQUFVLEVBQUM7RUFDeEUsSUFBSSxNQUFNLENBQUMsbUJBQW1CLEVBQUU7SUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLEVBQUM7SUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFDO0lBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUUsRUFBQztJQUNqQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUM7R0FDbEMsTUFBTTtJQUNMLGlCQUFpQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQztHQUM3QztFQUNELE9BQU8sTUFBTSxHQUFHLENBQUM7RUFDbEI7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7RUFDOUUsS0FBSyxHQUFHLENBQUMsTUFBSztFQUNkLE1BQU0sR0FBRyxNQUFNLEdBQUcsRUFBQztFQUNuQixJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsVUFBVSxFQUFDO0VBQ3hFLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsVUFBVSxHQUFHLEtBQUssR0FBRyxFQUFDO0VBQzdDLElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO0lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFDO0lBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUUsRUFBQztJQUNqQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUM7SUFDaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxFQUFDO0dBQ2xDLE1BQU07SUFDTCxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUM7R0FDOUM7RUFDRCxPQUFPLE1BQU0sR0FBRyxDQUFDO0VBQ2xCOztBQUVELFNBQVMsWUFBWSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO0VBQ3hELElBQUksTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sSUFBSSxVQUFVLENBQUMsb0JBQW9CLENBQUM7RUFDekUsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sSUFBSSxVQUFVLENBQUMsb0JBQW9CLENBQUM7Q0FDM0Q7O0FBRUQsU0FBUyxVQUFVLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRTtFQUMvRCxJQUFJLENBQUMsUUFBUSxFQUFFO0lBQ2IsWUFBWSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsQUFBaUQsRUFBQztHQUNyRjtFQUNEQyxLQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUM7RUFDdEQsT0FBTyxNQUFNLEdBQUcsQ0FBQztDQUNsQjs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxTQUFTLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUM5RSxPQUFPLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDO0VBQ3ZEOztBQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQzlFLE9BQU8sVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUM7RUFDeEQ7O0FBRUQsU0FBUyxXQUFXLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRTtFQUNoRSxJQUFJLENBQUMsUUFBUSxFQUFFO0lBQ2IsWUFBWSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsQUFBbUQsRUFBQztHQUN2RjtFQUNEQSxLQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUM7RUFDdEQsT0FBTyxNQUFNLEdBQUcsQ0FBQztDQUNsQjs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxTQUFTLGFBQWEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUNoRixPQUFPLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDO0VBQ3hEOztBQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxHQUFHLFNBQVMsYUFBYSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQ2hGLE9BQU8sV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUM7RUFDekQ7OztBQUdELE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFNBQVMsSUFBSSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTtFQUN0RSxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssR0FBRyxFQUFDO0VBQ3JCLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU07RUFDeEMsSUFBSSxXQUFXLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxXQUFXLEdBQUcsTUFBTSxDQUFDLE9BQU07RUFDN0QsSUFBSSxDQUFDLFdBQVcsRUFBRSxXQUFXLEdBQUcsRUFBQztFQUNqQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFHLEdBQUcsTUFBSzs7O0VBR3ZDLElBQUksR0FBRyxLQUFLLEtBQUssRUFBRSxPQUFPLENBQUM7RUFDM0IsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUM7OztFQUd0RCxJQUFJLFdBQVcsR0FBRyxDQUFDLEVBQUU7SUFDbkIsTUFBTSxJQUFJLFVBQVUsQ0FBQywyQkFBMkIsQ0FBQztHQUNsRDtFQUNELElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLElBQUksVUFBVSxDQUFDLDJCQUEyQixDQUFDO0VBQ3hGLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxNQUFNLElBQUksVUFBVSxDQUFDLHlCQUF5QixDQUFDOzs7RUFHNUQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU07RUFDeEMsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLFdBQVcsR0FBRyxHQUFHLEdBQUcsS0FBSyxFQUFFO0lBQzdDLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLFdBQVcsR0FBRyxNQUFLO0dBQzFDOztFQUVELElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxNQUFLO0VBQ3JCLElBQUksRUFBQzs7RUFFTCxJQUFJLElBQUksS0FBSyxNQUFNLElBQUksS0FBSyxHQUFHLFdBQVcsSUFBSSxXQUFXLEdBQUcsR0FBRyxFQUFFOztJQUUvRCxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7TUFDN0IsTUFBTSxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBQztLQUMxQztHQUNGLE1BQU0sSUFBSSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFOztJQUVwRCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtNQUN4QixNQUFNLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFDO0tBQzFDO0dBQ0YsTUFBTTtJQUNMLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUk7TUFDM0IsTUFBTTtNQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssR0FBRyxHQUFHLENBQUM7TUFDakMsV0FBVztNQUNaO0dBQ0Y7O0VBRUQsT0FBTyxHQUFHO0VBQ1g7Ozs7OztBQU1ELE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFNBQVMsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRTs7RUFFaEUsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7SUFDM0IsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7TUFDN0IsUUFBUSxHQUFHLE1BQUs7TUFDaEIsS0FBSyxHQUFHLEVBQUM7TUFDVCxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU07S0FDbEIsTUFBTSxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtNQUNsQyxRQUFRLEdBQUcsSUFBRztNQUNkLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTTtLQUNsQjtJQUNELElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFDcEIsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUM7TUFDNUIsSUFBSSxJQUFJLEdBQUcsR0FBRyxFQUFFO1FBQ2QsR0FBRyxHQUFHLEtBQUk7T0FDWDtLQUNGO0lBQ0QsSUFBSSxRQUFRLEtBQUssU0FBUyxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsRUFBRTtNQUMxRCxNQUFNLElBQUksU0FBUyxDQUFDLDJCQUEyQixDQUFDO0tBQ2pEO0lBQ0QsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO01BQ2hFLE1BQU0sSUFBSSxTQUFTLENBQUMsb0JBQW9CLEdBQUcsUUFBUSxDQUFDO0tBQ3JEO0dBQ0YsTUFBTSxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtJQUNsQyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUc7R0FDaEI7OztFQUdELElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtJQUN6RCxNQUFNLElBQUksVUFBVSxDQUFDLG9CQUFvQixDQUFDO0dBQzNDOztFQUVELElBQUksR0FBRyxJQUFJLEtBQUssRUFBRTtJQUNoQixPQUFPLElBQUk7R0FDWjs7RUFFRCxLQUFLLEdBQUcsS0FBSyxLQUFLLEVBQUM7RUFDbkIsR0FBRyxHQUFHLEdBQUcsS0FBSyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLEtBQUssRUFBQzs7RUFFakQsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsRUFBQzs7RUFFakIsSUFBSSxFQUFDO0VBQ0wsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7SUFDM0IsS0FBSyxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUU7TUFDNUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUc7S0FDZDtHQUNGLE1BQU07SUFDTCxJQUFJLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUM7UUFDN0IsR0FBRztRQUNILFdBQVcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUM7SUFDckQsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU07SUFDdEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFO01BQ2hDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUM7S0FDakM7R0FDRjs7RUFFRCxPQUFPLElBQUk7RUFDWjs7Ozs7QUFLRCxJQUFJLGlCQUFpQixHQUFHLHFCQUFvQjs7QUFFNUMsU0FBUyxXQUFXLEVBQUUsR0FBRyxFQUFFOztFQUV6QixHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLEVBQUM7O0VBRXBELElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFOztFQUU3QixPQUFPLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtJQUMzQixHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUc7R0FDaEI7RUFDRCxPQUFPLEdBQUc7Q0FDWDs7QUFFRCxTQUFTLFVBQVUsRUFBRSxHQUFHLEVBQUU7RUFDeEIsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRTtFQUMvQixPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQztDQUNyQzs7QUFFRCxTQUFTLEtBQUssRUFBRSxDQUFDLEVBQUU7RUFDakIsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO0VBQ3ZDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7Q0FDdEI7O0FBRUQsU0FBUyxXQUFXLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtFQUNuQyxLQUFLLEdBQUcsS0FBSyxJQUFJLFNBQVE7RUFDekIsSUFBSSxVQUFTO0VBQ2IsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU07RUFDMUIsSUFBSSxhQUFhLEdBQUcsS0FBSTtFQUN4QixJQUFJLEtBQUssR0FBRyxHQUFFOztFQUVkLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7SUFDL0IsU0FBUyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFDOzs7SUFHaEMsSUFBSSxTQUFTLEdBQUcsTUFBTSxJQUFJLFNBQVMsR0FBRyxNQUFNLEVBQUU7O01BRTVDLElBQUksQ0FBQyxhQUFhLEVBQUU7O1FBRWxCLElBQUksU0FBUyxHQUFHLE1BQU0sRUFBRTs7VUFFdEIsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQztVQUNuRCxRQUFRO1NBQ1QsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssTUFBTSxFQUFFOztVQUUzQixJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDO1VBQ25ELFFBQVE7U0FDVDs7O1FBR0QsYUFBYSxHQUFHLFVBQVM7O1FBRXpCLFFBQVE7T0FDVDs7O01BR0QsSUFBSSxTQUFTLEdBQUcsTUFBTSxFQUFFO1FBQ3RCLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUM7UUFDbkQsYUFBYSxHQUFHLFVBQVM7UUFDekIsUUFBUTtPQUNUOzs7TUFHRCxTQUFTLEdBQUcsQ0FBQyxhQUFhLEdBQUcsTUFBTSxJQUFJLEVBQUUsR0FBRyxTQUFTLEdBQUcsTUFBTSxJQUFJLFFBQU87S0FDMUUsTUFBTSxJQUFJLGFBQWEsRUFBRTs7TUFFeEIsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQztLQUNwRDs7SUFFRCxhQUFhLEdBQUcsS0FBSTs7O0lBR3BCLElBQUksU0FBUyxHQUFHLElBQUksRUFBRTtNQUNwQixJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSztNQUMzQixLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQztLQUN0QixNQUFNLElBQUksU0FBUyxHQUFHLEtBQUssRUFBRTtNQUM1QixJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSztNQUMzQixLQUFLLENBQUMsSUFBSTtRQUNSLFNBQVMsSUFBSSxHQUFHLEdBQUcsSUFBSTtRQUN2QixTQUFTLEdBQUcsSUFBSSxHQUFHLElBQUk7UUFDeEI7S0FDRixNQUFNLElBQUksU0FBUyxHQUFHLE9BQU8sRUFBRTtNQUM5QixJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSztNQUMzQixLQUFLLENBQUMsSUFBSTtRQUNSLFNBQVMsSUFBSSxHQUFHLEdBQUcsSUFBSTtRQUN2QixTQUFTLElBQUksR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJO1FBQzlCLFNBQVMsR0FBRyxJQUFJLEdBQUcsSUFBSTtRQUN4QjtLQUNGLE1BQU0sSUFBSSxTQUFTLEdBQUcsUUFBUSxFQUFFO01BQy9CLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLO01BQzNCLEtBQUssQ0FBQyxJQUFJO1FBQ1IsU0FBUyxJQUFJLElBQUksR0FBRyxJQUFJO1FBQ3hCLFNBQVMsSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUk7UUFDOUIsU0FBUyxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsSUFBSTtRQUM5QixTQUFTLEdBQUcsSUFBSSxHQUFHLElBQUk7UUFDeEI7S0FDRixNQUFNO01BQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQztLQUN0QztHQUNGOztFQUVELE9BQU8sS0FBSztDQUNiOztBQUVELFNBQVMsWUFBWSxFQUFFLEdBQUcsRUFBRTtFQUMxQixJQUFJLFNBQVMsR0FBRyxHQUFFO0VBQ2xCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFOztJQUVuQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFDO0dBQ3pDO0VBQ0QsT0FBTyxTQUFTO0NBQ2pCOztBQUVELFNBQVMsY0FBYyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7RUFDbkMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUU7RUFDYixJQUFJLFNBQVMsR0FBRyxHQUFFO0VBQ2xCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0lBQ25DLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLOztJQUUzQixDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUM7SUFDckIsRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFDO0lBQ1gsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFHO0lBQ1osU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUM7SUFDbEIsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUM7R0FDbkI7O0VBRUQsT0FBTyxTQUFTO0NBQ2pCOzs7QUFHRCxTQUFTLGFBQWEsRUFBRSxHQUFHLEVBQUU7RUFDM0IsT0FBT0MsV0FBa0IsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDNUM7O0FBRUQsU0FBUyxVQUFVLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO0VBQzdDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7SUFDL0IsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUs7SUFDMUQsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFDO0dBQ3pCO0VBQ0QsT0FBTyxDQUFDO0NBQ1Q7O0FBRUQsU0FBUyxLQUFLLEVBQUUsR0FBRyxFQUFFO0VBQ25CLE9BQU8sR0FBRyxLQUFLLEdBQUc7Q0FDbkI7Ozs7OztBQU1ELEFBQU8sU0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFO0VBQzVCLE9BQU8sR0FBRyxJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ2xGOztBQUVELFNBQVMsWUFBWSxFQUFFLEdBQUcsRUFBRTtFQUMxQixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUFJLE9BQU8sR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEtBQUssVUFBVSxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztDQUM1Rzs7O0FBR0QsU0FBUyxZQUFZLEVBQUUsR0FBRyxFQUFFO0VBQzFCLE9BQU8sT0FBTyxHQUFHLENBQUMsV0FBVyxLQUFLLFVBQVUsSUFBSSxPQUFPLEdBQUcsQ0FBQyxLQUFLLEtBQUssVUFBVSxJQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztDQUNqSDs7QUNoeEREO0FBQ0EsQUFxQkEsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsVUFBVTtLQUNuQyxTQUFTLFFBQVEsRUFBRTtPQUNqQixRQUFRLFFBQVEsSUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFO1NBQ3hDLEtBQUssS0FBSyxDQUFDLENBQUMsS0FBSyxNQUFNLENBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLEtBQUssVUFBVSxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUUsT0FBTyxJQUFJLENBQUM7U0FDdkssU0FBUyxPQUFPLEtBQUssQ0FBQztRQUN2QjtPQUNGOzs7QUFHTixTQUFTLGNBQWMsQ0FBQyxRQUFRLEVBQUU7RUFDaEMsSUFBSSxRQUFRLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsRUFBRTtJQUMzQyxNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixHQUFHLFFBQVEsQ0FBQyxDQUFDO0dBQ2xEO0NBQ0Y7Ozs7Ozs7Ozs7QUFVRCxBQUFPLFNBQVMsYUFBYSxDQUFDLFFBQVEsRUFBRTtFQUN0QyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsUUFBUSxJQUFJLE1BQU0sRUFBRSxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQ3ZFLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUN6QixRQUFRLElBQUksQ0FBQyxRQUFRO0lBQ25CLEtBQUssTUFBTTs7TUFFVCxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztNQUN2QixNQUFNO0lBQ1IsS0FBSyxNQUFNLENBQUM7SUFDWixLQUFLLFNBQVM7O01BRVosSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7TUFDdkIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLHlCQUF5QixDQUFDO01BQ3RELE1BQU07SUFDUixLQUFLLFFBQVE7O01BRVgsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7TUFDdkIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLDBCQUEwQixDQUFDO01BQ3ZELE1BQU07SUFDUjtNQUNFLElBQUksQ0FBQyxLQUFLLEdBQUcsZ0JBQWdCLENBQUM7TUFDOUIsT0FBTztHQUNWOzs7O0VBSUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7RUFFaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7O0VBRXRCLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0NBQ3JCLEFBQ0Q7Ozs7Ozs7Ozs7O0FBV0EsYUFBYSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxNQUFNLEVBQUU7RUFDL0MsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDOztFQUVqQixPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUU7O0lBRXRCLElBQUksU0FBUyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZO1FBQ2pFLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVk7UUFDbkMsTUFBTSxDQUFDLE1BQU0sQ0FBQzs7O0lBR2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM5RCxJQUFJLENBQUMsWUFBWSxJQUFJLFNBQVMsQ0FBQzs7SUFFL0IsSUFBSSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUU7O01BRXZDLE9BQU8sRUFBRSxDQUFDO0tBQ1g7OztJQUdELE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7OztJQUdoRCxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7SUFHNUUsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3RELElBQUksUUFBUSxJQUFJLE1BQU0sSUFBSSxRQUFRLElBQUksTUFBTSxFQUFFO01BQzVDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQztNQUN0QyxPQUFPLEdBQUcsRUFBRSxDQUFDO01BQ2IsU0FBUztLQUNWO0lBQ0QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQzs7O0lBR3hDLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFDdkIsT0FBTyxPQUFPLENBQUM7S0FDaEI7SUFDRCxNQUFNO0dBQ1A7OztFQUdELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7RUFFbEMsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztFQUN4QixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7O0lBRW5CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3hFLEdBQUcsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDO0dBQzFCOztFQUVELE9BQU8sSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDOztFQUVsRCxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztFQUM3QixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztFQUV2QyxJQUFJLFFBQVEsSUFBSSxNQUFNLElBQUksUUFBUSxJQUFJLE1BQU0sRUFBRTtJQUM1QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzlCLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDO0lBQ3hCLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDO0lBQzFCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNyRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6QyxPQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0dBQ2xDOzs7RUFHRCxPQUFPLE9BQU8sQ0FBQztDQUNoQixDQUFDOzs7Ozs7QUFNRixhQUFhLENBQUMsU0FBUyxDQUFDLG9CQUFvQixHQUFHLFNBQVMsTUFBTSxFQUFFOztFQUU5RCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDOzs7O0VBSWpELE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNqQixJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFLbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO01BQzVCLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO01BQ3BCLE1BQU07S0FDUDs7O0lBR0QsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO01BQzVCLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO01BQ3BCLE1BQU07S0FDUDs7O0lBR0QsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO01BQzVCLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO01BQ3BCLE1BQU07S0FDUDtHQUNGO0VBQ0QsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7Q0FDdkIsQ0FBQzs7QUFFRixhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxTQUFTLE1BQU0sRUFBRTtFQUM3QyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7RUFDYixJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTTtJQUN6QixHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzs7RUFFM0IsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO0lBQ3JCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMxQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3hCLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDdkM7O0VBRUQsT0FBTyxHQUFHLENBQUM7Q0FDWixDQUFDOztBQUVGLFNBQVMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFO0VBQ2hDLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Q0FDdkM7O0FBRUQsU0FBUyx5QkFBeUIsQ0FBQyxNQUFNLEVBQUU7RUFDekMsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztFQUN0QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUM3Qzs7QUFFRCxTQUFTLDBCQUEwQixDQUFDLE1BQU0sRUFBRTtFQUMxQyxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0VBQ3RDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQzdDOztBQ3BOTSxNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQzs7QUFFdkMsQUFBTyxNQUFNLHdCQUF3QixHQUFHLGtCQUFrQixDQUFDO0FBQzNELEFBQU8sTUFBTSxtQkFBbUIsR0FBRyxnQkFBZ0IsQ0FBQztBQUNwRCxBQUFPLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQzs7QUFFcEMsQUFBTyxNQUFNLGNBQWMsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxHQUFHLEtBQUs7SUFDekYsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzs7SUFFcEQsUUFBUTtRQUNKLElBQUksRUFBRUMsTUFBSSxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUM7UUFDbEMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxjQUFjLEVBQUUsY0FBYyxFQUFFLE1BQU0sQUFBSyxDQUFDO0tBQ3hFLEVBQUU7Q0FDTixDQUFDOztBQUVGLEFBQU8sTUFBTSxjQUFjLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLGNBQWM7SUFDL0RBLE1BQUk7UUFDQSxjQUFjO1FBQ2QsY0FBYyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUM7S0FDdkMsQ0FBQzs7QUFFTixNQUFNLFdBQVcsR0FBRyxDQUFDLGNBQWMsRUFBRSxjQUFjLEVBQUUsTUFBTSxLQUFLLE9BQU8sWUFBWSxFQUFFLFlBQVksS0FBSztJQUNsRyxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDaEUsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQ3hCLE1BQU1BLE1BQUksQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDO1FBQzlCLE1BQU0sV0FBVyxJQUFJO1lBQ2pCLE1BQU0sT0FBTyxHQUFHN0IsT0FBSSxDQUFDLENBQUMsSUFBSSxXQUFXLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNuRSxNQUFNLE9BQU8sR0FBR0EsT0FBSSxDQUFDLENBQUMsSUFBSSxXQUFXLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDOztZQUUvRCxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUM7Z0JBQ25CLE9BQU8sd0JBQXdCLENBQUM7O1lBRXBDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNyQixNQUFNLGNBQWMsSUFBSSxhQUFhLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN2RCxNQUFNLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDNUIsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUM5QixNQUFNO2dCQUNILE1BQU0sS0FBSztvQkFDUCxhQUFhLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQztpQkFDckMsQ0FBQzthQUNMOztZQUVELE9BQU8sd0JBQXdCLENBQUM7O1NBRW5DO1FBQ0QsTUFBTSxJQUFJLElBQUksTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDO0tBQ2xDLENBQUM7O0lBRUYsR0FBRyxZQUFZLENBQUMsTUFBTSxLQUFLLFlBQVksQ0FBQyxNQUFNLEVBQUU7UUFDNUMsTUFBTSxLQUFLLEdBQUc4QixhQUFVLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3JELElBQUksSUFBSSxLQUFLLElBQUksS0FBSyxFQUFFO1lBQ3BCLE1BQU0sS0FBSztnQkFDUCxhQUFhLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQzthQUMvQixDQUFDO1NBQ0w7S0FDSixNQUFNLEdBQUcsWUFBWSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7O1FBRWpDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ25COztJQUVELE1BQU0sS0FBSyxFQUFFLENBQUM7SUFDZCxNQUFNLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztDQUM5QixDQUFDOztBQUVGLE1BQU1ELE1BQUksR0FBRyxDQUFDLGNBQWMsRUFBRSxNQUFNLEtBQUssT0FBTyxTQUFTLEVBQUUsU0FBUyxLQUFLO0lBQ3JFLE1BQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNqRCxJQUFJLElBQUksR0FBRyxNQUFNLFNBQVMsRUFBRSxDQUFDO0lBQzdCLElBQUksTUFBTSxHQUFHLHdCQUF3QixDQUFDO0lBQ3RDLE1BQU0sSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7O1FBRW5CLEdBQUcsTUFBTSxLQUFLLG1CQUFtQixFQUFFO1lBQy9CLE1BQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RCLFNBQVM7U0FDWjs7UUFFRCxHQUFHLE1BQU0sS0FBSyxXQUFXLEVBQUU7WUFDdkIsT0FBTztTQUNWOztRQUVELElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUN2QixJQUFJLElBQUksV0FBVyxJQUFJLElBQUksRUFBRTtZQUN6QixPQUFPLElBQUksV0FBVyxDQUFDO1lBQ3ZCLEdBQUcsV0FBVyxLQUFLLElBQUksRUFBRTtnQkFDckIsTUFBTSxHQUFHLE1BQU0sU0FBUztvQkFDcEIsY0FBYyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUM7aUJBQ2xDLENBQUM7Z0JBQ0YsT0FBTyxHQUFHLEVBQUUsQ0FBQztnQkFDYixHQUFHLE1BQU0sS0FBSyxtQkFBbUIsRUFBRTtvQkFDL0IsTUFBTTtpQkFDVDthQUNKO1lBQ0QsZ0JBQWdCLEVBQUUsQ0FBQztTQUN0Qjs7UUFFRCxHQUFHLGdCQUFnQixHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO1lBQ2xDLE1BQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN6RDs7UUFFRCxJQUFJLEdBQUcsTUFBTSxTQUFTLEVBQUUsQ0FBQztLQUM1Qjs7SUFFRCxNQUFNLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7Q0FFbEMsQ0FBQzs7QUFFRixNQUFNLGVBQWUsR0FBRyxDQUFDLGFBQWEsRUFBRSxjQUFjLEtBQUs7O0lBRXZELElBQUksYUFBYSxHQUFHLElBQUksQ0FBQzs7SUFFekIsT0FBTyxPQUFPLElBQUksS0FBSzs7UUFFbkIsR0FBRzdDLFdBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxhQUFhLEtBQUssSUFBSTtZQUN2QyxhQUFhLEdBQUcrQyxpQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDekMsR0FBRy9DLFdBQVEsQ0FBQyxJQUFJLENBQUM7WUFDbEIsYUFBYSxHQUFHK0MsaUJBQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQzFCLGFBQWE7Z0JBQ2JBLGlCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7YUFDNUIsQ0FBQyxDQUFDOztRQUVQLEdBQUcsYUFBYSxLQUFLLElBQUk7YUFDcEIsYUFBYSxDQUFDLE1BQU0sR0FBRyxhQUFhO2dCQUNqQyxDQUFDL0MsV0FBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7O1lBRXRCLE1BQU0sY0FBYyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMxQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1NBQ3hCO0tBQ0o7Q0FDSixDQUFDOztBQUVGLE1BQU0sY0FBYyxHQUFHLENBQUMsY0FBYyxLQUFLOztJQUV2QyxNQUFNLE9BQU8sR0FBRyxJQUFJLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxQyxJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7O0lBRXhCLE9BQU8sWUFBWTs7UUFFZixJQUFJLGVBQWUsR0FBRyxNQUFNLGNBQWMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNsRSxNQUFNLGVBQWUsR0FBRytDLGlCQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDOztRQUVwRCxHQUFHLENBQUMsZUFBZSxFQUFFLGVBQWUsR0FBR0EsaUJBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7O1FBRXZELE1BQU0sVUFBVSxHQUFHLGVBQWUsQ0FBQyxNQUFNLEtBQUssZ0JBQWdCLENBQUM7O1FBRS9ELE1BQU0sTUFBTSxHQUFHQSxpQkFBTSxDQUFDLE1BQU07WUFDeEIsQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDO1lBQ2xDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztRQUVyRCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztRQUVyQyxHQUFHLENBQUMsVUFBVSxJQUFJLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOzs7O1lBSXpDLGNBQWMsR0FBRyxFQUFFLENBQUM7U0FDdkI7O1FBRUQsT0FBTyxJQUFJLENBQUM7S0FDZixDQUFDO0NBQ0wsQ0FBQzs7QUFFRixNQUFNLGNBQWMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLEtBQUs7SUFDeEMsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7SUFDekIsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7SUFDekIsSUFBSSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7SUFDMUIsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQzs7SUFFaEIsTUFBTSxjQUFjLEdBQUcsTUFBTTtRQUN6QixNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUM3QyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sS0FBSyxHQUFHLGdCQUFnQixLQUFLLEVBQUU7d0JBQ3JCLElBQUksQ0FBQyxlQUFlLEVBQUU7d0JBQ3RCLElBQUksQ0FBQyxjQUFjOzBCQUNqQixnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQ2xDLENBQUM7O0lBRUYsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFOztRQUVwQyxHQUFHLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDbEMsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDOUMsR0FBRyxTQUFTLEVBQUU7Z0JBQ1YsR0FBRyxXQUFXLEtBQUssR0FBRyxFQUFFO29CQUNwQixnQkFBZ0IsSUFBSSxJQUFJLENBQUM7aUJBQzVCLE1BQU07b0JBQ0gsZ0JBQWdCLElBQUksV0FBVyxDQUFDO2lCQUNuQztnQkFDRCxTQUFTLEdBQUcsS0FBSyxDQUFDO2FBQ3JCLE1BQU07Z0JBQ0gsR0FBRyxXQUFXLEtBQUssR0FBRyxFQUFFO29CQUNwQixjQUFjLEVBQUUsQ0FBQztvQkFDakIsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO29CQUN0QixnQkFBZ0IsRUFBRSxDQUFDO2lCQUN0QixNQUFNLEdBQUcsV0FBVyxLQUFLLElBQUksRUFBRTtvQkFDNUIsU0FBUyxHQUFHLElBQUksQ0FBQztpQkFDcEIsTUFBTTtvQkFDSCxnQkFBZ0IsSUFBSSxXQUFXLENBQUM7aUJBQ25DO2FBQ0o7WUFDRCxnQkFBZ0IsRUFBRSxDQUFDO1NBQ3RCLE1BQU07WUFDSCxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7WUFDdEIsY0FBYyxFQUFFLENBQUM7WUFDakIsZ0JBQWdCLEVBQUUsQ0FBQztTQUN0QjtLQUNKOztJQUVELE9BQU8sSUFBSSxDQUFDO0NBQ2YsQ0FBQzs7QUFFRixBQUFPLE1BQU0sYUFBYSxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksTUFBTTs7SUFFNUMsSUFBSSxPQUFPLEdBQUcsR0FBRTs7SUFFaEIsSUFBSSxJQUFJLElBQUksSUFBSSxNQUFNLEVBQUU7UUFDcEIsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxNQUFNLEtBQUssR0FBRzNCLE1BQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDO3dCQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzt3QkFDZixJQUFJLENBQUMsZUFBZSxHQUFFOztRQUV0QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDOztRQUVyQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNuQyxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsR0FBRyxXQUFXLEtBQUssR0FBRztrQkFDaEIsV0FBVyxLQUFLLElBQUk7a0JBQ3BCLFdBQVcsS0FBSyxJQUFJLEVBQUU7Z0JBQ3hCLE9BQU8sSUFBSSxJQUFJLENBQUM7YUFDbkI7O1lBRUQsR0FBRyxXQUFXLEtBQUssSUFBSSxFQUFFO2dCQUNyQixPQUFPLElBQUksR0FBRyxDQUFDO2FBQ2xCLE1BQU07Z0JBQ0gsT0FBTyxJQUFJLFdBQVcsQ0FBQzthQUMxQjtTQUNKOztRQUVELE9BQU8sSUFBSSxHQUFHLENBQUM7S0FDbEI7O0lBRUQsT0FBTyxJQUFJLElBQUksQ0FBQztJQUNoQixPQUFPLE9BQU8sQ0FBQztDQUNsQjs7RUFBQyxGQzdPSyxNQUFNNEIsV0FBUyxHQUFHLE9BQU8sU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsY0FBYyxLQUFLO0VBQzlFLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztFQUNuQixNQUFNLE1BQU0sR0FBRyxZQUFZO1FBQ3JCLE1BQU0sSUFBSSxJQUFJO01BQ2hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDbkIsT0FBTyx3QkFBd0IsQ0FBQztLQUNqQztRQUNHLFlBQVksT0FBTztHQUN4QixDQUFDOztFQUVGLE9BQU8sTUFBTSxNQUFNLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUM7Q0FDbEUsQ0FBQzs7QUFFRixBQUFPLE1BQU0sV0FBVyxHQUFHLE9BQU8sU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLFlBQVksS0FBSztFQUM5RixNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7RUFDbkIsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztFQUNoRCxNQUFNLE1BQU0sR0FBRyxZQUFZO1FBQ3JCLE1BQU0sSUFBSSxJQUFJO01BQ2hCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZO1FBQzNCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEIsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUU7VUFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDeEI7UUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ2hCLENBQUMsQ0FBQztNQUNILE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7TUFDL0MsSUFBSSxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUM5QixJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ3BCO01BQ0QsT0FBTyx3QkFBd0IsQ0FBQztLQUNqQztRQUNHLFlBQVksT0FBTztHQUN4QixDQUFDOztFQUVGLE9BQU8sTUFBTSxNQUFNLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUM7Q0FDbEUsQ0FBQztBQUNGLEFBeUJBO0FBQ0EsQUFBTyxNQUFNLFlBQVksR0FBRyxDQUFDLFNBQVMsRUFBRSxjQUFjLEtBQUssT0FBTyxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxjQUFjLEtBQUs7RUFDaEgsSUFBSTtJQUNGLE1BQU0sY0FBYyxHQUFHLHFCQUFxQjtRQUN4QyxNQUFNLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUM7S0FDckQsQ0FBQzs7SUFFRixNQUFNLElBQUksR0FBRyxjQUFjLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQztJQUM5RCxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN0QixPQUFPLGNBQWMsRUFBRSxDQUFDO0dBQ3pCLENBQUMsT0FBTyxDQUFDLEVBQUU7SUFDVixJQUFJLE1BQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRTtNQUMxQyxNQUFNLENBQUMsQ0FBQztLQUNULE1BQU07TUFDTCxNQUFNLGVBQWU7UUFDbkIsU0FBUztRQUNULGNBQWM7UUFDZCxLQUFLO09BQ04sQ0FBQztLQUNIO0lBQ0QsT0FBTyxFQUFFLENBQUM7R0FDWDtDQUNGLENBQUM7O0FDbEZLLE1BQU0sU0FBUyxHQUFHLEdBQUcsSUFBSSxPQUFPLFFBQVEsRUFBRSxPQUFPLEtBQUssVUFBVTtFQUNyRSxHQUFHO0VBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTO0VBQ3pCLFVBQVUsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztFQUMzQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUU7RUFDckIsVUFBVSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsT0FBTztDQUNuQyxDQUFDOztBQUVGLE1BQU0sY0FBYyxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDOztBQUU1RixNQUFNLFVBQVUsR0FBRyxPQUFPLEdBQUcsRUFBRSxRQUFRLEVBQUUsT0FBTyxHQUFHLGNBQWMsS0FBSztFQUNwRSxNQUFNLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDL0QzQixRQUFLLENBQUMsT0FBTyxDQUFDO0lBQ2RBLFFBQUssQ0FBQyxjQUFjLENBQUM7R0FDdEIsQ0FBQyxDQUFDOztFQUVILE1BQU0sUUFBUSxHQUFHLE1BQU0sR0FBRyxLQUFLLGdCQUFnQixDQUFDLFlBQVksQ0FBQztNQUN6RCxNQUFNLFdBQVc7TUFDakIsR0FBRyxDQUFDLFNBQVM7TUFDYixHQUFHLENBQUMsU0FBUztNQUNiLFNBQVM7TUFDVCxHQUFHO01BQ0gsWUFBWTtLQUNiO01BQ0MsTUFBTTJCLFdBQVM7TUFDZixHQUFHLENBQUMsU0FBUztNQUNiLEdBQUcsQ0FBQyxTQUFTO01BQ2IsU0FBUztNQUNULEdBQUc7S0FDSixDQUFDLENBQUM7O0VBRUwsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUM3QixNQUFNLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7O0VBRS9ELElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUMsRUFBRTs7RUFFN0UsSUFBSSxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUU7SUFDN0IsTUFBTSxTQUFTLEdBQUcsTUFBTSxtQkFBbUI7TUFDekMsR0FBRyxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxjQUFjO0tBQ2hELENBQUM7SUFDRixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDakIsS0FBSyxNQUFNLENBQUMsSUFBSSxTQUFTLEVBQUU7TUFDekIsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9CO0lBQ0QsT0FBT0MsVUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ3ZCO0VBQ0QsT0FBTyxNQUFNLFFBQVE7SUFDbkIsd0JBQXdCLENBQUMsUUFBUSxDQUFDO0dBQ25DLENBQUM7Q0FDSCxDQUFDOztBQ3BESyxNQUFNLFVBQVUsR0FBRyxHQUFHLElBQUksU0FBUyxJQUFJLGNBQWM7RUFDMUQsR0FBRztFQUNILE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVTtFQUMzQixVQUFVLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUM7RUFDN0MsRUFBRSxTQUFTLEVBQUU7RUFDYixXQUFXLEVBQUUsR0FBRyxFQUFFLFNBQVM7Q0FDNUIsQ0FBQzs7QUFFRixBQUFPLE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBRyxFQUFFLFNBQVMsS0FBSztFQUM3QyxNQUFNLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7O0VBRWpFLE1BQU0sc0JBQXNCLEdBQUcsRUFBRSxDQUFDOztFQUVsQyxNQUFNLHNCQUFzQixHQUFHLE9BQU8sV0FBVyxLQUFLO0lBQ3BELElBQUksQ0FBQzdCLEtBQUcsQ0FBQyxzQkFBc0IsRUFBRSxXQUFXLENBQUMsWUFBWSxDQUFDLEVBQUU7TUFDMUQsc0JBQXNCLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxHQUFHO1FBQ2pELFdBQVc7UUFDWCxJQUFJLEVBQUUsTUFBTSxrQkFBa0I7VUFDNUIsR0FBRyxFQUFFLFNBQVMsRUFBRSxXQUFXO1NBQzVCO09BQ0YsQ0FBQztLQUNIOztJQUVELE9BQU8sc0JBQXNCLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO0dBQ3pELENBQUM7O0VBRUYsTUFBTSxjQUFjLEdBQUcsd0JBQXdCLEtBQUtwQixXQUFRLENBQUMsd0JBQXdCLENBQUM7TUFDbEYsU0FBUyxDQUFDLFVBQVUsRUFBRSx3QkFBd0IsQ0FBQztPQUM5QyxXQUFXO01BQ1osd0JBQXdCLENBQUMsQ0FBQzs7RUFFOUIsT0FBTztJQUNMLGVBQWUsRUFBRSxPQUFPLHdCQUF3QixFQUFFLEdBQUcsS0FBSztNQUN4RCxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsd0JBQXdCLENBQUMsQ0FBQztNQUM3RCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztNQUMzRCxPQUFPRCxNQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0tBQ3ZDO0lBQ0QsZ0JBQWdCLEVBQUUsT0FBTyx3QkFBd0IsS0FBSztNQUNwRCxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsd0JBQXdCLENBQUMsQ0FBQztNQUM3RCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztNQUMzRCxPQUFPLElBQUksQ0FBQztLQUNiO0lBQ0QsVUFBVTtHQUNYLENBQUM7Q0FDSCxDQUFDOztBQUVGLE1BQU0sa0JBQWtCLEdBQUcsT0FBTyxHQUFHLEVBQUUsU0FBUyxFQUFFLFdBQVcsS0FBSztFQUNoRSxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7RUFDbkUsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQztNQUNyQyxTQUFTLENBQUMsT0FBTyxFQUFFO01BQ25CLDRCQUE0QjtNQUM1QixTQUFTLEVBQUUsU0FBUztLQUNyQixDQUFDOztFQUVKLE1BQU0sS0FBSyxHQUFHLE1BQU0sU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQzdDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtJQUNkUyxNQUFHLENBQUMsQ0FBQyxLQUFLO01BQ1IsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHO01BQ1YsS0FBSyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDO0tBQ25DLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUM7O0FDL0RGLE1BQU0sZUFBZSxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssTUFBTTtFQUM3QyxNQUFNLEVBQUUsQ0FBQyxTQUFTLENBQUM7RUFDbkIsT0FBTyxFQUFFLENBQUMsc0JBQXNCLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztDQUN2RCxDQUFDLENBQUM7O0FBRUgsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7RUFDekVBLE1BQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN4RTFCLFNBQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUs7SUFDcEIsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxPQUFPLE1BQU0sQ0FBQztJQUN6QyxNQUFNLENBQUMsSUFBSTtNQUNULGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO0tBQzdDLENBQUM7SUFDRixPQUFPLE1BQU0sQ0FBQztHQUNmLEVBQUUsRUFBRSxDQUFDO0NBQ1AsQ0FBQyxDQUFDOztBQUVILE1BQU0sMEJBQTBCLEdBQUcsT0FBTyxNQUFNLEVBQUUsVUFBVSxFQUFFLE9BQU8sS0FBSztFQUN4RSxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7RUFDbEIsS0FBSyxNQUFNLEtBQUssSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFO0lBQ3JDLENBQUMsQ0FBQyxNQUFNa0QseUJBQXVCLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsRUFBRTtNQUN2RHZCLFNBQU0sQ0FBQyxnQkFBZ0IsQ0FBQztNQUN4QkQsTUFBRyxDQUFDLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUNoRDBDLE9BQUksQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMxQixDQUFDLENBQUM7R0FDSjtFQUNELE9BQU8sTUFBTSxDQUFDO0NBQ2YsQ0FBQzs7QUFFRixNQUFNLHdCQUF3QixHQUFHLENBQUMsTUFBTSxFQUFFLFVBQVUsS0FBSztFQUN2RCxNQUFNLGlCQUFpQixHQUFHLENBQUMsSUFBSSxLQUFLO0lBQ2xDLE1BQU0sT0FBTyxHQUFHeEMsOEJBQWlCLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDNUQsTUFBTSxpQkFBaUIsR0FBRyxFQUFFLE1BQU0sS0FBRXlDLFVBQUMsRUFBRSxDQUFDO0lBQ3hDLFFBQVEsT0FBTyxDQUFDLGlCQUFpQixDQUFDO1FBQzlCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtTQUNkO1FBQ0QsS0FBSyxFQUFFLEtBQUs7UUFDWixNQUFNLEVBQUUsSUFBSSxDQUFDLGFBQWE7UUFDMUIsT0FBTyxFQUFFLElBQUksQ0FBQyxrQkFBa0I7T0FDakMsQ0FBQyxFQUFFO0dBQ1AsQ0FBQzs7RUFFRixPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFO0lBQ25DM0MsTUFBRyxDQUFDLGlCQUFpQixDQUFDO0lBQ3RCeUMsVUFBTztJQUNQeEMsU0FBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQztJQUM5QkQsTUFBRyxDQUFDLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztHQUNyRCxDQUFDLENBQUM7Q0FDSixDQUFDOztBQUVGLEFBQU8sTUFBTSxRQUFRLEdBQUcsR0FBRyxJQUFJLE9BQU8sTUFBTSxFQUFFLE9BQU8sS0FBSztFQUN4RCxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQztNQUN4QixXQUFXLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUM7TUFDNUIsT0FBTyxDQUFDOztFQUVaLE1BQU0sVUFBVSxHQUFHLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDbEUsTUFBTSxlQUFlLEdBQUcscUJBQXFCLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDOzs7RUFHbEUsSUFBSSxDQUFDWCxVQUFPLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLEVBQUUsRUFBRTs7RUFFeEYsTUFBTSx5QkFBeUIsR0FBRyx3QkFBd0IsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7RUFDL0UsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLDBCQUEwQixDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7O0VBRXpGLElBQUlBLFVBQU8sQ0FBQyxlQUFlLENBQUM7VUFDcEJBLFVBQU8sQ0FBQyx5QkFBeUIsQ0FBQztVQUNsQ0EsVUFBTyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7SUFDbkMsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFO0dBQ3hDOztFQUVELFFBQVE7SUFDTixPQUFPLEVBQUUsS0FBSztJQUNkLE1BQU0sRUFBRXNELFVBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLGtCQUFrQixFQUFFLHlCQUF5QixDQUFDO0dBQ2hGLEVBQUU7Q0FDSixDQUFDOztBQzNFRixNQUFNLDZCQUE2QixHQUFHLE9BQU8sU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEtBQUs7RUFDMUUsSUFBSSxDQUFDLE1BQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRTtJQUN0QyxNQUFNLFNBQVMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDeEMsTUFBTSxTQUFTLENBQUMsWUFBWTtNQUMxQixPQUFPLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQztLQUM3QixDQUFDO0lBQ0YsTUFBTSxTQUFTLENBQUMsWUFBWTtNQUMxQixPQUFPO1FBQ0wsU0FBUztRQUNULFFBQVE7UUFDUixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtPQUN2QjtLQUNGLENBQUM7R0FDSDtDQUNGLENBQUM7O0FBRUYsQUFBTyxNQUFNLHlCQUF5QixHQUFHLE9BQU8sU0FBUyxFQUFFLFNBQVMsS0FBSztFQUN2RSxNQUFNLG9CQUFvQixHQUFHLE9BQU87SUFDbEMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDdkIsa0JBQWtCO0dBQ25CLENBQUM7O0VBRUYsTUFBTSxhQUFhLEdBQUcscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7O0VBRXZELE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxDQUFDLGFBQWEsRUFBRTtJQUN6QzFDLFNBQU0sQ0FBQyxvQkFBb0IsQ0FBQztHQUM3QixDQUFDLENBQUM7O0VBRUgsS0FBSyxNQUFNLEdBQUcsSUFBSSxpQkFBaUIsRUFBRTtJQUNuQyxNQUFNLDZCQUE2QjtNQUNqQyxTQUFTO01BQ1QsR0FBRztNQUNILEdBQUcsQ0FBQyxrQkFBa0IsRUFBRTtLQUN6QixDQUFDO0dBQ0g7Q0FDRixDQUFDOztBQUVGLEFBQU8sTUFBTSwwQkFBMEIsR0FBRyxPQUFPLEdBQUcsRUFBRSxTQUFTLEtBQUs7RUFDbEUsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFO0lBQzFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUM7SUFDbEMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRO0lBQ2ZBLFNBQU0sQ0FBQyxrQkFBa0IsQ0FBQztHQUMzQixDQUFDLENBQUM7O0VBRUgsS0FBSyxNQUFNLEtBQUssSUFBSSxzQkFBc0IsRUFBRTtJQUMxQyxNQUFNLDZCQUE2QjtNQUNqQyxHQUFHLENBQUMsU0FBUztNQUNiLEtBQUs7TUFDTCxPQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUM7S0FDekMsQ0FBQztHQUNIO0NBQ0YsQ0FBQzs7QUMvQ0YsTUFBTSxVQUFVLEdBQUcsa0VBQWtFLENBQUM7O0FBRXRGLE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxjQUFjLEtBQUs7RUFDakQsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLGlCQUFpQixDQUFDO0VBQ2hELE1BQU0saUJBQWlCLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQztFQUN0QyxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7RUFDeEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0VBQ2QsSUFBSSxlQUFlLEdBQUcsRUFBRSxDQUFDO0VBQ3pCLE9BQU8sS0FBSyxHQUFHLEVBQUUsRUFBRTtJQUNqQixlQUFlLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLGlCQUFpQixLQUFLLENBQUMsRUFBRTtNQUN6QyxZQUFZLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO01BQ25DLGVBQWUsR0FBRyxFQUFFLENBQUM7S0FDdEI7SUFDRCxLQUFLLEVBQUUsQ0FBQztHQUNUOztFQUVELE9BQU8sWUFBWSxDQUFDO0NBQ3JCLENBQUM7O0FBRUYsQUFBTyxNQUFNLG1CQUFtQixHQUFHLENBQUMsWUFBWSxFQUFFLGFBQWEsS0FBSztFQUNsRSxNQUFNLG9CQUFvQixHQUFHLHdCQUF3QixDQUFDLFlBQVksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0VBQ25GLE9BQU8sQ0FBQyxDQUFDLG9CQUFvQixFQUFFO0lBQzdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDZkQsTUFBRyxDQUFDLENBQUMsSUFBSUEsTUFBRyxDQUFDLENBQUMsSUFBSSxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztJQUN0R3lDLFVBQU87R0FDUixDQUFDLENBQUM7Q0FDSixDQUFDOztBQUVGLE1BQU0sZUFBZSxHQUFHLENBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxRQUFRLEtBQUssT0FBTztFQUNuRSxhQUFhO0VBQ2IsUUFBUTtFQUNSLE9BQU87RUFDUCxRQUFRO0NBQ1QsQ0FBQzs7QUFFRixBQUFPLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxZQUFZLEVBQUUsYUFBYSxFQUFFLFFBQVEsS0FBSztFQUMxRSxNQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7O0VBRS9DLE1BQU0sY0FBYyxHQUFHLHdCQUF3QixDQUFDLFlBQVksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDOztFQUU3RSxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDbkQsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRTtJQUN0QyxzQkFBc0I7SUFDdEJqQyxPQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7R0FDbkMsQ0FBQyxDQUFDOztFQUVILE9BQU8sZUFBZTtJQUNwQixhQUFhO0lBQ2IsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsZ0JBQWdCLENBQUM7SUFDbkMsYUFBYTtHQUNkLENBQUM7Q0FDSCxDQUFDOztBQUVGLE1BQU0sb0JBQW9CLEdBQUcsT0FBTyxTQUFTLEVBQUUsU0FBUyxLQUFLO0VBQzNELElBQUk7SUFDRixPQUFPLE1BQU0sU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztHQUM1QyxDQUFDLE9BQU8sS0FBSyxFQUFFO0lBQ2QsSUFBSTtNQUNGLE1BQU0sU0FBUyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7TUFDMUMsT0FBTyxFQUFFLENBQUM7S0FDWCxDQUFDLE9BQU8sT0FBTyxFQUFFO01BQ2hCLE1BQU0sSUFBSSxLQUFLO1FBQ2IsQ0FBQyxvQ0FBb0MsRUFBRSxTQUFTO1NBQy9DLFVBQVUsRUFBRSxLQUFLLENBQUMsT0FBTztTQUN6QixZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7T0FDekIsQ0FBQztLQUNIO0dBQ0Y7Q0FDRixDQUFDOztBQUVGLE1BQU0sWUFBWSxHQUFHLE9BQU8sU0FBUyxFQUFFLFNBQVMsS0FBSztFQUNuRCxJQUFJO0lBQ0YsT0FBTyxNQUFNLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDNUMsQ0FBQyxPQUFPLEtBQUssRUFBRTtJQUNkLE9BQU8sRUFBRSxDQUFDO0dBQ1g7Q0FDRixDQUFDOztBQUVGLEFBQU8sTUFBTSxXQUFXLEdBQUcsQ0FBQyxZQUFZLEVBQUUsU0FBUyxLQUFLLE9BQU8sTUFBTSxLQUFLO0VBQ3hFLE1BQU0sU0FBUyxHQUFHLGlCQUFpQjtJQUNqQyxZQUFZO0lBQ1osWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDeEIsTUFBTSxDQUFDLEVBQUU7R0FDVixDQUFDOztFQUVGLElBQUksTUFBTSxHQUFHLE1BQU0sb0JBQW9CLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDOztFQUU5RCxNQUFNLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7RUFFeEQsTUFBTSxTQUFTLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztDQUMvQyxDQUFDOztBQUVGLEFBQU8sTUFBTSxpQkFBaUIsR0FBRyxHQUFHLElBQUksT0FBTyx5QkFBeUIsS0FBSztFQUMzRSx5QkFBeUIsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztFQUMvRCxNQUFNLFVBQVUsR0FBRywrQkFBK0I7SUFDaEQsR0FBRyxDQUFDLFNBQVM7SUFDYix5QkFBeUI7R0FDMUIsQ0FBQzs7RUFFRixNQUFNLGlDQUFpQyxHQUFHLE9BQU8sYUFBYSxLQUFLO0lBQ2pFLE1BQU0sY0FBYyxHQUFHLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDekUsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDOztJQUVuQixNQUFNLHVCQUF1QixHQUFHLFlBQVk7TUFDMUMsSUFBSSxVQUFVLEtBQUssY0FBYyxDQUFDLE1BQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsYUFBYSxFQUFFLEVBQUUsRUFBRSxFQUFFOztNQUUxRyxNQUFNLFFBQVEsR0FBRyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7O01BRTVDLE1BQU0sTUFBTSxHQUFHLE1BQU0sa0JBQWtCLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQzs7TUFFakUsVUFBVSxFQUFFLENBQUM7O01BRWIsUUFBUTtRQUNOLE1BQU0sRUFBRTtVQUNOLEdBQUcsRUFBRSxNQUFNO1VBQ1gsYUFBYTtTQUNkO1FBQ0QsSUFBSSxFQUFFLEtBQUs7T0FDWixFQUFFO0tBQ0osQ0FBQzs7SUFFRixPQUFPLHVCQUF1QixDQUFDO0dBQ2hDLENBQUM7O0VBRUYsTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRTtJQUN4RFAsU0FBTSxDQUFDLGtCQUFrQixDQUFDO0lBQzFCQSxTQUFNLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7dUJBQ2xCLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDeEQ0QixVQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDNUMsQ0FBQyxDQUFDOztFQUVILE1BQU0sd0JBQXdCLEdBQUcsT0FBTyxlQUFlLEdBQUcsRUFBRSxFQUFFLGdCQUFnQixHQUFHLENBQUMsS0FBSztJQUNyRixNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUNoRCxNQUFNLG9CQUFvQixHQUFHLE9BQU87TUFDbEMsZUFBZTtNQUNmLFdBQVcsQ0FBQyxjQUFjO0tBQzNCLENBQUM7SUFDRixJQUFJLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUU7TUFDbEQsT0FBTztRQUNMLE1BQU0saUNBQWlDO1VBQ3JDLG9CQUFvQjtTQUNyQixDQUFDLENBQUM7S0FDTjtJQUNELE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztJQUN4QixNQUFNLGVBQWUsR0FBRyxNQUFNLGlDQUFpQztNQUM3RCxvQkFBb0I7S0FDckIsQ0FBQzs7SUFFRixJQUFJLEdBQUcsR0FBRyxNQUFNLGVBQWUsRUFBRSxDQUFDO0lBQ2xDLE9BQU8sR0FBRyxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUU7TUFDekIsS0FBSyxNQUFNLEVBQUUsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtRQUMvQixZQUFZLENBQUMsSUFBSTtVQUNmLE1BQU0sd0JBQXdCO1lBQzVCLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLENBQUM7WUFDakMsZ0JBQWdCLEdBQUcsQ0FBQztXQUNyQjtTQUNGLENBQUM7T0FDSDs7TUFFRCxHQUFHLEdBQUcsTUFBTSxlQUFlLEVBQUUsQ0FBQztLQUMvQjs7SUFFRCxPQUFPWSxVQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7R0FDOUIsQ0FBQzs7RUFFRixNQUFNLGNBQWMsR0FBRyxNQUFNLHdCQUF3QixFQUFFLENBQUM7RUFDeEQsSUFBSSxvQkFBb0IsR0FBRyxDQUFDLENBQUM7RUFDN0IsT0FBTyxZQUFZO0lBQ2pCLElBQUksY0FBYyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtJQUN2RSxNQUFNLFdBQVcsR0FBRyxNQUFNLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7SUFDakUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxPQUFPLFdBQVcsQ0FBQyxFQUFFO0lBQzlDLElBQUksb0JBQW9CLElBQUksY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7TUFDckQsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNuRDtJQUNELG9CQUFvQixFQUFFLENBQUM7SUFDdkIsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztHQUNwRCxDQUFDO0NBQ0gsQ0FBQzs7QUFFRixNQUFNLGtCQUFrQixHQUFHLE9BQU8sU0FBUyxFQUFFLFFBQVEsS0FBSztFQUN4RCxNQUFNLFNBQVMsR0FBRyxNQUFNLFlBQVksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7O0VBRTFELE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztFQUNsQixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7RUFDbkIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDekMsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4QyxNQUFNLE1BQU0sSUFBSSxDQUFDLEtBQUssU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM1QyxJQUFJLFdBQVcsS0FBSyxHQUFHLElBQUksTUFBTSxFQUFFO01BQ2pDLElBQUksTUFBTSxFQUFFLFNBQVMsSUFBSSxXQUFXLENBQUM7TUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztNQUN2QixTQUFTLEdBQUcsRUFBRSxDQUFDO0tBQ2hCLE1BQU07TUFDTCxTQUFTLElBQUksV0FBVyxDQUFDO0tBQzFCO0dBQ0Y7RUFDRCxPQUFPLE1BQU0sQ0FBQztDQUNmLENBQUM7O0FBRUYsQUFBTyxNQUFNLGdCQUFnQixHQUFHLENBQUMsWUFBWSxFQUFFLFNBQVMsS0FBSyxPQUFPLE1BQU0sS0FBSztFQUM3RSxNQUFNLFFBQVEsR0FBRyxpQkFBaUI7SUFDaEMsWUFBWTtJQUNaLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ3hCLE1BQU0sQ0FBQyxFQUFFO0dBQ1YsQ0FBQztFQUNGLE1BQU0sTUFBTSxHQUFHLE1BQU0sa0JBQWtCLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDOztFQUU3RCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFO0lBQ3ZCRyxPQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNmN0QsT0FBSSxDQUFDLEdBQUcsQ0FBQztHQUNWLENBQUMsQ0FBQzs7RUFFSCxNQUFNLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0NBQzlDLENBQUM7O0FDN05LLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUM1RCxBQUFPLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUNwQyxBQUFPLE1BQU0sYUFBYSxHQUFHLE9BQU87RUFDbEMsbUJBQW1CLEVBQUUsYUFBYTtDQUNuQyxDQUFDO0FBQ0YsQUFBTyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUM7O0FBRXpCLE1BQU0sUUFBUSxHQUFHLEdBQUcsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLGVBQWUsS0FBSyxHQUFHLENBQUM7O0FBRS9ELEFBQU8sTUFBTSx5QkFBeUIsR0FBRyxRQUFRLENBQUM7QUFDbEQsQUFBTyxNQUFNLHlCQUF5QixHQUFHLFFBQVEsQ0FBQztBQUNsRCxBQUFPLE1BQU0seUJBQXlCLEdBQUcsUUFBUSxDQUFDO0FBQ2xELEFBQU8sTUFBTSx1QkFBdUIsR0FBRyxPQUFPLENBQUM7O0FBRS9DLEFBQU8sTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDNUQsQUFBTyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUM1RCxBQUFPLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQzVELEFBQU8sTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLHVCQUF1QixDQUFDLENBQUM7O0FBRTlELEFBQU8sTUFBTSxlQUFlLEdBQUcsT0FBTyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFL0QsQUFBTyxNQUFNLGdCQUFnQixHQUFHLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxRQUFRO0VBQ2xFLENBQUMsRUFBRSxRQUFRLENBQUMsRUFBRSxLQUFLLENBQUMsRUFBRSxlQUFlLENBQUMsRUFBRSxLQUFLLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDOztBQUU3RCxBQUFPLE1BQU0sZ0JBQWdCLEdBQUcsU0FBUyxDQUFDO0FBQzFDLEFBQU8sTUFBTSwwQkFBMEIsR0FBRyxNQUFNLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFekYsQUFBTyxNQUFNLGtCQUFrQixHQUFHLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFNUYsQUFBTyxNQUFNLGtCQUFrQixHQUFHLFlBQVksSUFBSSxPQUFPO0VBQ3ZELG1CQUFtQjtFQUNuQixnQkFBZ0IsR0FBRyxlQUFlLENBQUMsWUFBWSxDQUFDO0NBQ2pELENBQUM7O0FBRUYsQUFBTyxNQUFNLHVCQUF1QixHQUFHLENBQUMsWUFBWSxFQUFFLEtBQUs7RUFDekQsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLHNCQUFzQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUNuRyxBQUdBO0FBQ0EsQUFBTyxNQUFNLHNCQUFzQixHQUFHLElBQUksQ0FBQztBQUMzQyxBQUFPLE1BQU0sbUJBQW1CLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztBQUM3QyxBQUFPLE1BQU0sY0FBYyxHQUFHLENBQUMsQ0FBQzs7QUNyQ3pCLE1BQU0sMEJBQTBCLEdBQUcsT0FBTyxHQUFHLEVBQUUsTUFBTSxLQUFLLE1BQU0sV0FBVztFQUNoRixHQUFHLENBQUMsU0FBUyxFQUFFLHlCQUF5QjtFQUN4QyxNQUFNLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFO0VBQ3RCLHlCQUF5QjtDQUMxQixDQUFDOztBQUVGLEFBQU8sTUFBTSwwQkFBMEIsR0FBRyxPQUFPLEdBQUcsRUFBRSxTQUFTLEVBQUUsU0FBUyxLQUFLLE1BQU0sV0FBVztFQUM5RixHQUFHLENBQUMsU0FBUyxFQUFFLHlCQUF5QjtFQUN4QyxTQUFTLENBQUMsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUU7RUFDL0MseUJBQXlCO0NBQzFCLENBQUM7O0FBRUYsQUFBTyxNQUFNLDBCQUEwQixHQUFHLE9BQU8sR0FBRyxFQUFFLE1BQU0sS0FBSyxNQUFNLFdBQVc7RUFDaEYsR0FBRyxDQUFDLFNBQVMsRUFBRSx5QkFBeUI7RUFDeEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRTtFQUN0Qix5QkFBeUI7Q0FDMUIsQ0FBQzs7QUFFRixBQUFPLE1BQU0sd0JBQXdCLEdBQUcsT0FBTyxHQUFHLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxLQUFLLEtBQUs7RUFDckYsTUFBTSxpQkFBaUIsR0FBRyx1QkFBdUIsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7RUFDdkUsSUFBSSxLQUFLLEdBQUcsc0JBQXNCLEtBQUssQ0FBQyxFQUFFO0lBQ3hDLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQztHQUNyRDs7RUFFRCxPQUFPLE1BQU0sV0FBVztJQUN0QixHQUFHLENBQUMsU0FBUyxFQUFFLHVCQUF1QjtJQUN0QyxTQUFTLEVBQUUsRUFBRSxTQUFTLEVBQUU7SUFDeEIsRUFBRSxJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUM7R0FDckMsQ0FBQztDQUNILENBQUM7O0FBRUYsQUFBTyxNQUFNLHNCQUFzQixHQUFHLE9BQU8sU0FBUyxFQUFFLFlBQVksS0FBSyxNQUFNLFNBQVMsQ0FBQyxZQUFZO0VBQ25HLGtCQUFrQixDQUFDLFlBQVksQ0FBQztDQUNqQyxDQUFDOztBQUVGLE1BQU0seUJBQXlCLEdBQUcsRUFBRSxJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFekUsTUFBTSxXQUFXLEdBQUcsT0FBTyxTQUFTLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEtBQUs7RUFDNUYsTUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDN0MsTUFBTSxRQUFRLEdBQUdSLGdCQUFRLEVBQUUsQ0FBQztFQUM1QixNQUFNLEVBQUUsR0FBRyxnQkFBZ0I7SUFDekIsUUFBUSxFQUFFLGVBQWUsRUFBRSxRQUFRO0dBQ3BDLENBQUM7O0VBRUYsTUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUM7O0VBRWxDLE1BQU0sS0FBSyxHQUFHO0lBQ1osZUFBZTtJQUNmLFNBQVM7SUFDVCxHQUFHLElBQUk7SUFDUCxFQUFFO0dBQ0gsQ0FBQzs7RUFFRixNQUFNLFNBQVMsQ0FBQyxVQUFVO0lBQ3hCLEdBQUcsRUFBRSxLQUFLO0dBQ1gsQ0FBQzs7RUFFRixPQUFPLEtBQUssQ0FBQztDQUNkLENBQUM7O0FDaEVLLE1BQU0sZUFBZSxHQUFHLE9BQU8sU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLEtBQUs7RUFDcEUsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7O0VBRWhELE1BQU0sU0FBUyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQzs7RUFFdkMsSUFBSSxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7SUFDekIsTUFBTSxTQUFTLENBQUMsVUFBVTtNQUN4QixjQUFjLENBQUMsUUFBUSxDQUFDO01BQ3hCLElBQUk7S0FDTCxDQUFDO0dBQ0gsTUFBTTtJQUNMLE1BQU0sZUFBZTtNQUNuQixTQUFTO01BQ1Qsd0JBQXdCLENBQUMsUUFBUSxDQUFDO01BQ2xDLEtBQUs7S0FDTixDQUFDO0dBQ0g7Q0FDRixDQUFDOztBQ1dLLE1BQU0sSUFBSSxHQUFHLEdBQUcsSUFBSSxPQUFPLE1BQU0sRUFBRSxPQUFPLEtBQUssVUFBVTtFQUM5RCxHQUFHO0VBQ0gsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJO0VBQ3JCLE1BQU0sQ0FBQyxLQUFLO01BQ1IsVUFBVSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztNQUNoRCxVQUFVLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUU7RUFDaEUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUs7Q0FDbkMsQ0FBQzs7O0FBR0YsQUFBTyxNQUFNLEtBQUssR0FBRyxPQUFPLEdBQUcsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsR0FBRyxLQUFLLEtBQUs7RUFDM0UsTUFBTSxXQUFXLEdBQUdFLFlBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUN0QyxJQUFJLENBQUMsY0FBYyxFQUFFO0lBQ25CLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25FLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUU7TUFDN0IsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7TUFDakYsTUFBTSxJQUFJLGVBQWUsQ0FBQyxDQUFDLHdCQUF3QjtRQUNqRCxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzlDO0dBQ0Y7O0VBRUQsSUFBSSxXQUFXLENBQUMsS0FBSyxFQUFFO0lBQ3JCLE1BQU0sV0FBVyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzdELE1BQU0sV0FBVyxHQUFHLE1BQU0sMEJBQTBCO01BQ2xELEdBQUcsRUFBRSxXQUFXO0tBQ2pCLENBQUM7SUFDRixXQUFXLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQyxFQUFFLENBQUM7SUFDM0MsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEQsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFlBQVk7TUFDOUIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDO0tBQ2xDLENBQUM7SUFDRixNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVTtNQUM1QixpQkFBaUIsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDO01BQ2xDLFdBQVc7S0FDWixDQUFDO0lBQ0YsTUFBTSxpQ0FBaUMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckQsTUFBTSx5QkFBeUIsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDN0MsTUFBTSwwQkFBMEIsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7TUFDdkQsTUFBTSxFQUFFLFdBQVc7S0FDcEIsQ0FBQyxDQUFDO0dBQ0osTUFBTTtJQUNMLE1BQU0sU0FBUyxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDcEQsTUFBTSxXQUFXLEdBQUcsTUFBTSwwQkFBMEI7TUFDbEQsR0FBRyxFQUFFLFNBQVMsRUFBRSxXQUFXO0tBQzVCLENBQUM7SUFDRixXQUFXLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQyxFQUFFLENBQUM7SUFDM0MsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVU7TUFDNUIsaUJBQWlCLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQztNQUNsQyxXQUFXO0tBQ1osQ0FBQztJQUNGLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7TUFDdkQsR0FBRyxFQUFFLFNBQVM7TUFDZCxHQUFHLEVBQUUsV0FBVztLQUNqQixDQUFDLENBQUM7R0FDSjs7RUFFRCxNQUFNLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDOztFQUVoQyxNQUFNLGFBQWEsR0FBR0EsWUFBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0VBQzdDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0VBQzVCLE9BQU8sYUFBYSxDQUFDO0NBQ3RCLENBQUM7O0FBRUYsTUFBTSx5QkFBeUIsR0FBRyxPQUFPLEdBQUcsRUFBRSxNQUFNLEtBQUs7RUFDdkQsTUFBTSxVQUFVLEdBQUcsbUJBQW1CLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7RUFFbEUsS0FBSyxNQUFNLEtBQUssSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFO0lBQ3RDLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLE1BQU0sZUFBZSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFO0dBQ3hHO0NBQ0YsQ0FBQzs7QUFFRixNQUFNLGlDQUFpQyxHQUFHLE9BQU8sR0FBRyxFQUFFLE1BQU0sS0FBSztFQUMvRCxNQUFNLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztFQUVsRSxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsNkJBQTZCLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxFQUFFO0lBQ25FdUIsTUFBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRTtNQUM3Q0EsTUFBRyxDQUFDLENBQUMsSUFBSSxPQUFPO1FBQ2QsR0FBRyxDQUFDLFNBQVM7UUFDYixDQUFDO09BQ0YsQ0FBQztLQUNILENBQUMsQ0FBQztJQUNIeUMsVUFBTztHQUNSLENBQUMsQ0FBQzs7RUFFSCxLQUFLLE1BQU0sU0FBUyxJQUFJLFVBQVUsRUFBRTtJQUNsQyxNQUFNLGVBQWU7TUFDbkIsR0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLFNBQVM7S0FDckMsQ0FBQztHQUNIO0NBQ0YsQ0FBQzs7QUFFRixNQUFNLDZCQUE2QixHQUFHLENBQUMsR0FBRyxFQUFFLFVBQVUsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRTtFQUMxRSxxQkFBcUI7RUFDckJ4QyxTQUFNLENBQUMsUUFBUSxDQUFDO0VBQ2hCRCxNQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUM7RUFDbEJ5QyxVQUFPO0VBQ1B4QyxTQUFNLENBQUMsNEJBQTRCLENBQUMsVUFBVSxDQUFDLENBQUM7Q0FDakQsQ0FBQyxDQUFDOztBQ3pISSxNQUFNLGdCQUFnQixHQUFHLENBQUMsR0FBRyxFQUFFLGNBQWMsR0FBRyxLQUFLLEtBQUssTUFBTSxHQUFHLElBQUksVUFBVTtFQUN0RixHQUFHO0VBQ0gsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNO0VBQzNCLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZO0VBQ3hDLEVBQUUsR0FBRyxFQUFFO0VBQ1AsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxjQUFjO0NBQzVDLENBQUM7OztBQUdGLEFBQU8sTUFBTSxpQkFBaUIsR0FBRyxPQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsY0FBYyxLQUFLO0VBQ25FLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDbkIsTUFBTSxJQUFJLEdBQUcsd0JBQXdCLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztFQUUxRCxNQUFNLGFBQWEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7RUFDOUIsTUFBTSxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQzFDLE1BQU0sc0JBQXNCLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQ3ZDLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRSxNQUFNLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEVBQUU7Q0FDMUQsQ0FBQzs7QUFFRixNQUFNLHNCQUFzQixHQUFHLE9BQU8sR0FBRyxFQUFFLEdBQUcsS0FBSyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7QUFHekYsTUFBTSxtQkFBbUIsR0FBRyxPQUFPLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxLQUFLO0VBQ3BELE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZO0lBQzlCLE9BQU87TUFDTCxHQUFHLEVBQUUsUUFBUTtNQUNiLElBQUksQ0FBQyxNQUFNO0tBQ1o7R0FDRixDQUFDOztFQUVGLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZO0lBQzlCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDO0dBQ3ZCLENBQUM7Q0FDSCxDQUFDOztBQUVGLE1BQU0sYUFBYSxHQUFHLE9BQU8sR0FBRyxFQUFFLEdBQUcsS0FBSztFQUN4QyxNQUFNLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztFQUMvQixNQUFNLGlCQUFpQixHQUFHLE9BQU8sUUFBUSxLQUFLO0lBQzVDLE1BQU0sUUFBUSxHQUFHLGlCQUFpQjtNQUNoQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxRQUFRO0tBQzdCLENBQUM7O0lBRUYsSUFBSVAsV0FBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLEVBQUU7TUFDM0MsT0FBTztLQUNSOztJQUVELG1CQUFtQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzs7SUFFbkMsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztHQUMxQyxDQUFDOztFQUVGLE1BQU0sT0FBTyxHQUFHLE1BQU0saUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7O0VBRWxELElBQUksR0FBRyxHQUFHLE1BQU0sT0FBTyxFQUFFLENBQUM7RUFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7SUFDaEIsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLGFBQWEsS0FBSyxHQUFHLEVBQUU7TUFDcEMsS0FBSyxNQUFNLEVBQUUsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtRQUMvQixNQUFNLGFBQWE7VUFDakIsR0FBRztVQUNILE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO1VBQ2hCLElBQUk7U0FDTCxDQUFDO1FBQ0YsTUFBTSxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztPQUM3QjtLQUNGOztJQUVELEdBQUcsR0FBRyxNQUFNLE9BQU8sRUFBRSxDQUFDO0dBQ3ZCO0NBQ0YsQ0FBQzs7QUNsRUssTUFBTSxZQUFZLEdBQUcsT0FBTyxHQUFHLEVBQUUsUUFBUSxFQUFFLGFBQWEsS0FBSztFQUNsRSxNQUFNLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7O0VBRS9ELElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUMsRUFBRTs7RUFFN0UsSUFBSSxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUU7SUFDN0IsTUFBTSxTQUFTLEdBQUcsTUFBTSxlQUFlLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZELEtBQUssTUFBTSxDQUFDLElBQUksU0FBUyxFQUFFO01BQ3pCLE1BQU0sZ0JBQWdCO1FBQ3BCLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztPQUM1QixDQUFDO0tBQ0g7SUFDRCxnQkFBZ0I7TUFDZCxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVTtRQUM1QixjQUFjLENBQUMsUUFBUSxDQUFDO09BQ3pCO0tBQ0YsQ0FBQztHQUNILE1BQU07SUFDTCxNQUFNLGdCQUFnQjtNQUNwQixHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVU7UUFDdEIsd0JBQXdCLENBQUMsUUFBUSxDQUFDO09BQ25DO0tBQ0YsQ0FBQztHQUNIOztFQUVELElBQUksYUFBYSxFQUFFO0lBQ2pCLGdCQUFnQjtNQUNkLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDO0tBQzNDLENBQUM7R0FDSDtDQUNGLENBQUM7O0FDMUJLLE1BQU1tRCxjQUFZLEdBQUcsQ0FBQyxHQUFHLEVBQUUsY0FBYyxHQUFHLEtBQUssS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVO0VBQ2xGLEdBQUc7RUFDSCxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU07RUFDdkIsVUFBVSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDO0VBQ3pDLEVBQUUsR0FBRyxFQUFFO0VBQ1AsYUFBYSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsY0FBYztDQUN4QyxDQUFDOzs7QUFHRixBQUFPLE1BQU0sYUFBYSxHQUFHLE9BQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxjQUFjLEtBQUs7RUFDL0QsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNuQixNQUFNLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7O0VBRXJELE1BQU0sTUFBTSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztFQUNyQyxNQUFNLDBCQUEwQixDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQzs7RUFFOUMsS0FBSyxNQUFNLGdCQUFnQixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7SUFDNUMsTUFBTSxhQUFhLEdBQUcsT0FBTztNQUMzQixHQUFHLEVBQUUsZ0JBQWdCLENBQUMsY0FBYztLQUNyQyxDQUFDO0lBQ0YsTUFBTSxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0dBQ25EOztFQUVELE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVO0lBQzVCLGlCQUFpQixDQUFDLEdBQUcsQ0FBQztHQUN2QixDQUFDOztFQUVGLE1BQU0sV0FBVyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzs7RUFFNUIsTUFBTSxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7RUFFN0QsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLE1BQU0sR0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUMsRUFBRTs7RUFFekQsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUN0QyxNQUFNLGFBQWEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7Q0FDL0IsQ0FBQzs7QUFFRixNQUFNLGFBQWEsR0FBRyxPQUFPLEdBQUcsRUFBRSxHQUFHLEtBQUs7RUFDeEMsTUFBTSxJQUFJLEdBQUcsbUJBQW1CLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBc0JyRCxLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7SUFDaEMsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUMsTUFBTSxZQUFZLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztHQUN6QztDQUNGLENBQUM7O0FBRUYsTUFBTSxXQUFXLEdBQUcsT0FBTyxHQUFHLEVBQUUsR0FBRyxLQUFLO0VBQ3RDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7RUFDMUMsTUFBTSxRQUFRLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLGlCQUFpQjtJQUNwRCxXQUFXO0dBQ1osQ0FBQzs7RUFFRixLQUFLLE1BQU0sSUFBSSxJQUFJLFFBQVEsRUFBRTtJQUMzQixNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3RDOztFQUVELE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZO0lBQzlCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDO0dBQ3RCLENBQUM7Q0FDSCxDQUFDOztBQ2hGSyxNQUFNLFVBQVUsR0FBRyxHQUFHLElBQUksT0FBTyxTQUFTLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixLQUFLLFVBQVU7RUFDaEcsR0FBRztFQUNILE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVTtFQUMzQixVQUFVLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUM7RUFDL0MsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixFQUFFO0VBQy9DLFdBQVcsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxnQkFBZ0I7Q0FDOUQsQ0FBQzs7QUFFRixNQUFNLFdBQVcsR0FBRyxPQUFPLEdBQUcsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixLQUFLO0VBQzlFLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsTUFBTSxJQUFJLGVBQWUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLEVBQUU7RUFDbkYsSUFBSSxTQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLE1BQU0sSUFBSSxlQUFlLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxFQUFFO0VBQ3pGLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLE1BQU0sSUFBSSxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxFQUFFOztFQUUxRixNQUFNLE1BQU0sR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7O0VBRTNDLE1BQU0sWUFBWSxHQUFHLG1CQUFtQjtJQUN0QyxTQUFTLEVBQUUsZ0JBQWdCO0dBQzVCLENBQUM7O0VBRUYsTUFBTSxZQUFZLEdBQUcsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLEVBQUV0RSxnQkFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7O0VBRTFELE1BQU0sWUFBWSxHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0I7SUFDekQsWUFBWTtHQUNiLENBQUM7O0VBRUYsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUs7SUFDckMsY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNsQyxZQUFZLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNqQyxZQUFZLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztHQUNwQyxDQUFDO0dBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7R0FDbkQsSUFBSSxDQUFDLElBQUksSUFBSTtJQUNaLE1BQU0sa0JBQWtCLEdBQUcsMEJBQTBCO01BQ25ELEdBQUcsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSTtLQUNwQyxDQUFDO0lBQ0YsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEVBQUUsTUFBTSxJQUFJLGVBQWUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyw0QkFBNEIsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTs7R0FFbkosQ0FBQztHQUNELElBQUksQ0FBQyxNQUFNLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO0dBQ3BFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBc0JuRSxDQUFDOztBQUVGLE1BQU0sMEJBQTBCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLFlBQVksS0FBSztFQUNsRixNQUFNLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztFQUVsRSxNQUFNLG1CQUFtQixHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO0lBQy9DMEIsU0FBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU07U0FDeEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLEtBQUssZ0JBQWdCO1NBQ2hELE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFlBQVksQ0FBQztJQUMxQ0QsTUFBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDO0dBQ2pCLENBQUMsQ0FBQzs7RUFFSCxNQUFNLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO0lBQ3BEQyxTQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssYUFBYTtTQUMvQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNuQlYsT0FBSSxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksS0FBSyxnQkFBZ0I7YUFDckQsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssWUFBWSxDQUFDO09BQzNDLENBQUMsQ0FBQztJQUNMUyxNQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUM7R0FDakIsQ0FBQyxDQUFDOztFQUVILE1BQU0sZUFBZSxHQUFHO0lBQ3RCLEdBQUcsbUJBQW1CO0lBQ3RCLEdBQUcsd0JBQXdCO0dBQzVCLENBQUM7O0VBRUYsSUFBSSxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtJQUM5QixPQUFPLEtBQUssQ0FBQztHQUNkOztFQUVELE9BQU8sSUFBSSxDQUFDO0NBQ2IsQ0FBQzs7QUFFRixBQUFPLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLEtBQUs7RUFDbEUsTUFBTSxXQUFXLEdBQUcsTUFBTSxFQUFFLE1BQU0sSUFBSSxjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLENBQUM7O0VBRTNFLElBQUksZ0JBQWdCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDOztFQUVyRCxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7RUFFN0MsSUFBSU4sV0FBUSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDOztFQUU3QyxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7O0VBRTNDLE1BQU0sYUFBYSxHQUFHO0lBQ3BCLEdBQUcsY0FBYztJQUNqQixPQUFPO0lBQ1AsR0FBR08sU0FBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDO0dBQ3JDLENBQUM7O0VBRUYsT0FBTyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7Q0FDL0IsQ0FBQzs7QUMxSEssTUFBTSxZQUFZLEdBQUcsR0FBRyxJQUFJLE9BQU8sU0FBUyxFQUFFLFlBQVksS0FBSyxVQUFVO0VBQzlFLEdBQUc7RUFDSCxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVU7RUFDM0IsVUFBVSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO0VBQzdDLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRTtFQUMzQixhQUFhLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxZQUFZO0NBQzVDLENBQUM7OztBQUdGLE1BQU0sYUFBYSxHQUFHLE9BQU8sR0FBRyxFQUFFLFNBQVMsRUFBRSxZQUFZLEtBQUs7RUFDNUQsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxNQUFNLElBQUksZUFBZSxDQUFDLHlCQUF5QixDQUFDLENBQUMsRUFBRTtFQUNuRixJQUFJLFNBQVMsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLE1BQU0sSUFBSSxlQUFlLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxFQUFFOztFQUVyRixPQUFPLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0I7SUFDM0MsbUJBQW1CO01BQ2pCLFNBQVMsRUFBRSxZQUFZO0tBQ3hCO0dBQ0YsQ0FBQztDQUNILENBQUM7O0FDbEJLLE1BQU0sUUFBUSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLEtBQUs7RUFDL0MsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUU7SUFDNUIscUJBQXFCO0lBQ3JCTyxPQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDO0dBQy9CLENBQUMsQ0FBQzs7RUFFSCxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sSUFBSSxhQUFhLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7O0VBRW5FLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Q0FDL0IsQ0FBQzs7QUFFRixBQUFPLE1BQU0sV0FBVyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUs7RUFDaEQsTUFBTSxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQzs7RUFFM0MsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7RUFFdEMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFO0lBQ3ZCQyxPQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDekJwQyxRQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbEIsT0FBTztHQUNSLENBQUMsQ0FBQzs7RUFFSCxPQUFPLE1BQU0sQ0FBQztDQUNmLENBQUM7O0FDbEJGLE1BQU0sR0FBRyxHQUFHLEdBQUcsS0FBSztFQUNsQixNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQztFQUNuQixXQUFXLEVBQUUsV0FBVyxDQUFDLEdBQUcsQ0FBQztFQUM3QixJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQztFQUNmLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDO0VBQ2YsTUFBTSxFQUFFd0UsY0FBWSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUM7RUFDaEMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUM7RUFDdkIsVUFBVSxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUM7RUFDM0IsVUFBVSxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUM7RUFDM0IsWUFBWSxFQUFFLFlBQVksQ0FBQyxHQUFHLENBQUM7RUFDL0IsUUFBUSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUM7RUFDdkIsV0FBVyxFQUFFLFdBQVcsQ0FBQyxHQUFHLENBQUM7Q0FDOUIsQ0FBQyxDQUFDOzs7QUFHSCxBQUFZLE1BQUMsWUFBWSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDOztBQ25CcEMsTUFBTSxxQkFBcUIsR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLGNBQWM7RUFDL0QsR0FBRztFQUNILE1BQU0sQ0FBQyxhQUFhLENBQUMscUJBQXFCO0VBQzFDLGdCQUFnQjtFQUNoQixFQUFFLEdBQUcsRUFBRTtFQUNQLHNCQUFzQixFQUFFLEdBQUcsRUFBRSxHQUFHO0NBQ2pDLENBQUM7O0FBRUYsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUs7RUFDM0MsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNuQixNQUFNLElBQUksR0FBRyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDMUQsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQzNDLENBQUM7O0FDZFUsTUFBQyxnQkFBZ0IsR0FBRyxHQUFHLEtBQUs7RUFDdEMscUJBQXFCLEVBQUUscUJBQXFCLENBQUMsR0FBRyxDQUFDO0VBQ2pELGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLEdBQUcsQ0FBQztFQUN6QyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxDQUFDO0NBQzlCLENBQUM7O0FDY0Y7Ozs7QUFJQSxBQUFPLE1BQU0sVUFBVSxHQUFHLEdBQUcsSUFBSSxNQUFNLFlBQVksSUFBSSxVQUFVO0VBQy9ELEdBQUc7RUFDSCxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVU7RUFDMUIsVUFBVSxDQUFDLFdBQVcsQ0FBQyxZQUFZO0VBQ25DLEVBQUUsWUFBWSxFQUFFO0VBQ2hCLFdBQVcsRUFBRSxHQUFHLEVBQUUsWUFBWTtDQUMvQixDQUFDOztBQUVGLE1BQU0sV0FBVyxHQUFHLE9BQU8sR0FBRyxFQUFFLFlBQVksS0FBSztFQUMvQyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQzs7RUFFdkQsTUFBTSxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDOztFQUUxRCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsTUFBTSxJQUFJLGVBQWUsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLEVBQUU7O0VBRS9GLElBQUksU0FBUyxDQUFDLFNBQVMsS0FBSyxXQUFXLEVBQUU7SUFDdkMsTUFBTSwwQkFBMEI7TUFDOUIsR0FBRyxFQUFFLFNBQVM7S0FDZixDQUFDO0dBQ0gsTUFBTTtJQUNMLE1BQU0sb0JBQW9CO01BQ3hCLEdBQUcsRUFBRSxTQUFTO0tBQ2YsQ0FBQztHQUNIOztFQUVELE1BQU0sR0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUM7Q0FDakMsQ0FBQzs7QUFFRixNQUFNLDBCQUEwQixHQUFHLE9BQU8sR0FBRyxFQUFFLFNBQVMsS0FBSzs7O0VBRzNELElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztFQUNwQixNQUFNLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFO0lBQ3hDLHFCQUFxQjtJQUNyQjVDLFNBQU0sQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQzt1QkFDSlYsT0FBSSxDQUFDLDZCQUE2QixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQzdFLENBQUMsQ0FBQzs7RUFFSCxNQUFNLG9DQUFvQyxHQUFHLE9BQU8sZUFBZSxLQUFLO0lBQ3RFLE1BQU0sdUJBQXVCLEdBQUcsTUFBTSxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDOztJQUVsRyxJQUFJLHFCQUFxQixHQUFHLE1BQU0sdUJBQXVCLEVBQUUsQ0FBQztJQUM1RCxPQUFPLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFO01BQ2xDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxxQkFBcUIsQ0FBQztNQUN6QyxLQUFLLE1BQU0sRUFBRSxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUU7UUFDM0IsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDcEQsTUFBTSx3QkFBd0IsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNqRixXQUFXLEVBQUUsQ0FBQztPQUNmO01BQ0QscUJBQXFCLEdBQUcsTUFBTSx1QkFBdUIsRUFBRSxDQUFDO0tBQ3pEO0dBQ0YsQ0FBQzs7RUFFRixLQUFLLE1BQU0sZUFBZSxJQUFJLGdCQUFnQixFQUFFO0lBQzlDLE1BQU0sb0NBQW9DLENBQUMsZUFBZSxDQUFDLENBQUM7R0FDN0Q7Q0FDRixDQUFDO0FBQ0YsQUFJQTtBQUNBLE1BQU0sb0JBQW9CLEdBQUcsT0FBTyxHQUFHLEVBQUUsU0FBUyxLQUFLO0VBQ3JELElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQzs7RUFFcEIsTUFBTSx3QkFBd0IsR0FBRyxPQUFPLGFBQWEsRUFBRSxHQUFHLEtBQUs7SUFDN0QsS0FBSyxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7TUFDMUIsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQzs7TUFFbkQsTUFBTSxVQUFVLEdBQUcsaUJBQWlCO1FBQ2xDLEdBQUcsQ0FBQyxTQUFTO1FBQ2IsUUFBUTtPQUNULENBQUM7O01BRUYsSUFBSSxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUM1QyxNQUFNLHdCQUF3QjtVQUM1QixHQUFHLEVBQUUsU0FBUyxDQUFDLE9BQU8sRUFBRTtVQUN4QixTQUFTLEVBQUUsV0FBVztTQUN2QixDQUFDO1FBQ0YsV0FBVyxFQUFFLENBQUM7T0FDZjtLQUNGO0dBQ0YsQ0FBQzs7O0VBR0YsTUFBTSxpQkFBaUIsR0FBRyw2QkFBNkIsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDOztFQUVsRixLQUFLLE1BQU0sMEJBQTBCLElBQUksaUJBQWlCLEVBQUU7SUFDMUQsTUFBTSxjQUFjLEdBQUcsTUFBTSxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7O0lBRXBHLElBQUksTUFBTSxHQUFHLE1BQU0sY0FBYyxFQUFFLENBQUM7SUFDcEMsT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBRTtNQUM1QixNQUFNLHdCQUF3QjtRQUM1QixNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWE7UUFDM0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHO09BQ2xCLENBQUM7TUFDRixNQUFNLEdBQUcsTUFBTSxjQUFjLEVBQUUsQ0FBQztLQUNqQztHQUNGOztFQUVELE9BQU8sV0FBVyxDQUFDO0NBQ3BCLENBQUM7QUFDRixBQUVBO0FBQ0EsTUFBTSxpQkFBaUIsR0FBRyxTQUFTLElBQUksVUFBVSxJQUFJRyxXQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOztBQ2hIMUcsTUFBTSxVQUFVLEdBQUcsR0FBRyxJQUFJLE9BQU8sUUFBUSxFQUFFLGdCQUFnQixHQUFHLElBQUksRUFBRSxjQUFjLEdBQUcsSUFBSSxLQUFLLFVBQVU7RUFDN0csR0FBRztFQUNILE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVTtFQUMxQixVQUFVLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7RUFDM0MsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFO0VBQzlDLFdBQVcsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFFLGNBQWM7Q0FDN0QsQ0FBQzs7QUFFRixNQUFNLFdBQVcsR0FBRyxPQUFPLEdBQUcsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxLQUFLO0VBQzdFLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDN0IsTUFBTSxTQUFTLEdBQUcsbUJBQW1CLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztFQUUvRCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsTUFBTSxJQUFJLGVBQWUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLEVBQUU7O0VBRXZGLElBQUksY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFO0lBQzdCLE1BQU0sU0FBUyxHQUFHLE1BQU0sbUJBQW1CO01BQ3pDLEdBQUcsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYztLQUNoRCxDQUFDO0lBQ0YsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDO0lBQzNCLEtBQUssTUFBTSxDQUFDLElBQUksU0FBUyxFQUFFO01BQ3pCLE1BQU0sV0FBVyxHQUFHLE1BQU0sYUFBYSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7TUFDcEYsSUFBSSxlQUFlLEtBQUssSUFBSSxFQUFFO1FBQzVCLGVBQWUsR0FBRyxXQUFXLENBQUM7T0FDL0IsTUFBTTtRQUNMLGVBQWUsR0FBRyxtQkFBbUI7VUFDbkMsZUFBZTtVQUNmLFdBQVc7U0FDWixDQUFDO09BQ0g7S0FDRjtJQUNELE9BQU8sZUFBZSxDQUFDO0dBQ3hCO0VBQ0QsT0FBTyxNQUFNLGFBQWE7SUFDeEIsR0FBRyxDQUFDLFNBQVM7SUFDYixHQUFHLENBQUMsU0FBUztJQUNiLFNBQVM7SUFDVCx3QkFBd0IsQ0FBQyxRQUFRLENBQUM7R0FDbkMsQ0FBQztDQUNILENBQUM7O0FBRUYsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLEtBQUs7RUFDN0MsTUFBTSxhQUFhLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLO0lBQ2xDLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQztJQUN2QixLQUFLLE1BQU0sT0FBTyxJQUFJLEdBQUcsRUFBRTtNQUN6QixJQUFJLE9BQU8sS0FBSyxPQUFPLEVBQUUsU0FBUztNQUNsQyxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7TUFDNUIsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO01BQzVCLE1BQU0sQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQztNQUN6QixNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUc7VUFDaEMsTUFBTSxDQUFDLEdBQUc7VUFDVixNQUFNLENBQUMsR0FBRyxDQUFDO01BQ2YsTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHO1VBQ2hDLE1BQU0sQ0FBQyxHQUFHO1VBQ1YsTUFBTSxDQUFDLEdBQUcsQ0FBQztNQUNmLE1BQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO0tBQ3RDO0lBQ0QsT0FBTyxHQUFHLENBQUM7R0FDWixDQUFDOztFQUVGLEtBQUssTUFBTSxXQUFXLElBQUksTUFBTSxFQUFFO0lBQ2hDLEtBQUssTUFBTSxRQUFRLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFO01BQ3pDLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztNQUNwRCxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUdsQixjQUFXLENBQUMsYUFBYSxDQUFDO1VBQ3RELEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLENBQUM7VUFDNUIsYUFBYTtVQUNiLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLENBQUM7VUFDN0IsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztTQUM3QixDQUFDO0tBQ0w7R0FDRjs7RUFFRCxPQUFPLE1BQU0sQ0FBQztDQUNmLENBQUM7O0FBRUYsTUFBTSxhQUFhLEdBQUcsT0FBTyxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxjQUFjLEtBQUs7RUFDM0UsTUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDO0VBQzNCLE1BQU0sTUFBTSxHQUFHLFlBQVk7UUFDckIsTUFBTSxJQUFJLElBQUk7TUFDaEIsMEJBQTBCO1FBQ3hCLEtBQUssRUFBRSxlQUFlLEVBQUUsSUFBSTtPQUM3QixDQUFDO01BQ0YsT0FBTyx3QkFBd0IsQ0FBQztLQUNqQztRQUNHLFlBQVksZUFBZTtHQUNoQyxDQUFDOztFQUVGLE9BQU8sTUFBTSxNQUFNLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUM7Q0FDbEUsQ0FBQzs7O0FBR0YsTUFBTSwwQkFBMEIsR0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLO0VBQzlELE1BQU0seUJBQXlCLEdBQUcsT0FBTztJQUN2QyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSTtHQUN6QyxDQUFDLENBQUM7O0VBRUgsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxLQUFLO0lBQ3JELE1BQU0sS0FBSyxHQUFHMkIsd0JBQVcsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQzs7SUFFakUsSUFBSSxDQUFDZ0IsV0FBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU8sUUFBUSxDQUFDOztJQUV0QyxRQUFRLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQztJQUN0QixRQUFRLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxRQUFRLENBQUMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEtBQUssSUFBSTtRQUN4RCxLQUFLO1FBQ0wsUUFBUSxDQUFDLEdBQUcsQ0FBQztJQUNqQixRQUFRLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxRQUFRLENBQUMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEtBQUssSUFBSTtRQUN4RCxLQUFLO1FBQ0wsUUFBUSxDQUFDLEdBQUcsQ0FBQztJQUNqQixRQUFRLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO0lBQ3JDLE9BQU8sUUFBUSxDQUFDO0dBQ2pCLENBQUM7O0VBRUYsS0FBSyxNQUFNLFFBQVEsSUFBSSxTQUFTLENBQUMsZUFBZSxFQUFFO0lBQ2hELElBQUksQ0FBQ1AsTUFBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRTtNQUMvQixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUM1Qjs7SUFFRCxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDOztJQUU5QyxJQUFJLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtNQUN4QyxJQUFJLENBQUNWLDhCQUFpQixDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFO1FBQzVELFNBQVM7T0FDVjtLQUNGOztJQUVELElBQUksS0FBSyxHQUFHLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFDMUNDLHdCQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO1FBQy9DLEtBQUssQ0FBQztJQUNWLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsRUFBRTtNQUM1QixLQUFLLEdBQUcsUUFBUSxDQUFDO0tBQ2xCOztJQUVELElBQUksQ0FBQ1MsTUFBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQyxFQUFFO01BQ2hDLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztNQUN0QyxLQUFLLE1BQU0sR0FBRyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDckMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyx5QkFBeUIsRUFBRSxDQUFDO09BQ2hFO0tBQ0Y7O0lBRUQsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDOztJQUUvQixLQUFLLE1BQU0sR0FBRyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEVBQUU7TUFDckMsTUFBTSxjQUFjLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUN4RCxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLG9CQUFvQjtRQUNyRCxHQUFHLEVBQUUsY0FBYztRQUNuQixlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSztPQUM3QixDQUFDO0tBQ0g7R0FDRjtDQUNGLENBQUM7O0FDbktVLE1BQUMsV0FBVyxHQUFHLEdBQUcsS0FBSztFQUNqQyxTQUFTLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQztFQUN6QixVQUFVLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQztFQUMzQixVQUFVLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQztDQUM1QixDQUFDOztBQ01LLE1BQU0sZ0JBQWdCLEdBQUc7RUFDOUIsbUJBQW1CLEVBQUUsbUNBQW1DO0VBQ3hELDZCQUE2QixFQUFFLHVDQUF1QztFQUN0RSw2QkFBNkIsRUFBRSxxREFBcUQ7RUFDcEYsNEJBQTRCLEVBQUUsd0NBQXdDO0NBQ3ZFLENBQUM7O0FBRUYsTUFBTSxhQUFhLEdBQUcsSUFBSSxJQUFJLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFdEYsTUFBTSxZQUFZLEdBQUcsSUFBSSxJQUFJLE1BQU0sVUFBVTs7RUFFM0MsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDLElBQUksT0FBTztNQUNWLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLEVBQUU7TUFDdkIsSUFBSSxDQUFDLGNBQWM7TUFDbkIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0tBQ25CLENBQUM7O0VBRUosQ0FBQyxNQUFNO0lBQ0x0QixVQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7O0VBRWhCLENBQUMsV0FBVztJQUNWLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7Q0FFakQsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7O0FBR1IsTUFBTXdELFVBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEtBQUs7RUFDbkMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDO1dBQ1IsV0FBVyxDQUFDLE1BQU0sQ0FBQztXQUNuQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7V0FDZixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtJQUMxQixNQUFNLElBQUksZUFBZSxDQUFDLGdCQUFnQixDQUFDLDZCQUE2QixDQUFDLENBQUM7R0FDM0U7O0VBRUQsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7V0FDakIsV0FBVyxDQUFDLE1BQU0sQ0FBQztXQUNuQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtJQUN6QixNQUFNLElBQUksZUFBZSxDQUFDLGdCQUFnQixDQUFDLDRCQUE0QixDQUFDLENBQUM7R0FDMUU7O0VBRUQsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLElBQUksZUFBZSxDQUFDLGdCQUFnQixDQUFDLDZCQUE2QixDQUFDLENBQUMsRUFBRTs7RUFFdEgsT0FBTyxJQUFJLENBQUM7Q0FDYixDQUFDOztBQUVGLE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksS0FBSztFQUNwQyxJQUFJLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNsQyxJQUFJLENBQUMsUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHeEQsVUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDOzJCQUNaLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTTsyQkFDcEIsSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLENBQUM7RUFDOUMsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUM1QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsTUFBTSxPQUFPO01BQ3BDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYztLQUN0QyxDQUFDO0lBQ0YsSUFBSSxDQUFDLGtCQUFrQixHQUFHLE1BQU0sT0FBTztNQUNyQyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLGNBQWM7S0FDdkMsQ0FBQztHQUNIO0VBQ0QsT0FBTyxJQUFJLENBQUM7Q0FDYixDQUFDOztBQUVGLE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBRyxLQUFLO0VBQzNCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztFQUM1QixJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRTtJQUN2QixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUM7OztJQUdoQixFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxJQUFJLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTs7SUFFdkksSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7TUFDakIsTUFBTSxZQUFZLEdBQUdrQixNQUFJO1FBQ3ZCLE1BQU0sQ0FBQyxPQUFPO1FBQ2QsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO09BQ3ZDLENBQUM7TUFDRixJQUFJLFlBQVksRUFBRTtRQUNoQixZQUFZLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUNwRDtLQUNGO0dBQ0Y7RUFDRCxPQUFPLEdBQUcsQ0FBQztDQUNaLENBQUM7O0FBRUYsQUFBTyxNQUFNLGFBQWEsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRTtFQUNuRCxTQUFTLENBQUMsTUFBTSxDQUFDO0VBQ2pCc0MsVUFBUSxDQUFDLE1BQU0sQ0FBQztFQUNoQixXQUFXO0NBQ1osQ0FBQyxDQUFDOztBQUVILE1BQU0sU0FBUyxHQUFHLENBQUMsVUFBVSxLQUFLOztFQUVoQyxJQUFJLENBQUMsVUFBVSxFQUFFLE9BQU8sSUFBSSxDQUFDO0VBQzdCLE1BQU0sUUFBUSxHQUFHLENBQUMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQzdELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7RUFFbEMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFO0lBQ2QscUJBQXFCO0lBQ3JCOUMsTUFBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ2xCK0MsTUFBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7Q0FDZCxDQUFDOztBQUVGLEFBQU8sTUFBTSxrQkFBa0IsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLEtBQUs7RUFDbEQsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3hCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtJQUNoQkwsTUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPO01BQ2YsS0FBSyxJQUFJLGtCQUFrQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQzdDO0VBQ0QsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO0lBQ3hCQSxNQUFJLENBQUMsSUFBSSxDQUFDLGVBQWU7TUFDdkIsS0FBSyxJQUFJLGtCQUFrQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQzdDO0VBQ0QsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtJQUM3Q0EsTUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO01BQ2hCLEtBQUssSUFBSSxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUM3QztFQUNELElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtJQUNmQSxNQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07TUFDZCxDQUFDLElBQUlBLE1BQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSztRQUNyQyxNQUFNLEdBQUcsR0FBR3BCLEtBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLEdBQUcsRUFBRTs7VUFFUixPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDM0IsTUFBTTtVQUNMLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNyQztPQUNGLENBQUMsQ0FBQyxDQUFDO0dBQ1A7RUFDRCxPQUFPLElBQUksQ0FBQztDQUNiLENBQUM7OztBQUdGLEFBQU8sTUFBTSxlQUFlLEdBQUcsTUFBTSxTQUFTLEVBQUUsQ0FBQztFQUMvQyxJQUFJLEVBQUUsTUFBTTtFQUNaLElBQUksRUFBRSxNQUFNO0VBQ1osUUFBUSxFQUFFLEVBQUU7RUFDWixRQUFRLEVBQUUsRUFBRTtFQUNaLE9BQU8sRUFBRSxFQUFFO0VBQ1gsTUFBTSxFQUFFLENBQUM7Q0FDVixDQUFDLENBQUM7O0FBRUgsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxLQUFLO0VBQzVFLE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUU7SUFDakMsSUFBSTtJQUNKLElBQUksRUFBRSxRQUFRO0lBQ2QsTUFBTSxFQUFFLEVBQUU7SUFDVixRQUFRLEVBQUUsRUFBRTtJQUNaLGVBQWUsRUFBRSxFQUFFO0lBQ25CLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDO0lBQ3pCLE9BQU8sRUFBRSxFQUFFO0lBQ1gsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO0lBQzVDLGNBQWMsRUFBRSxFQUFFO0lBQ2xCLFFBQVE7R0FDVCxDQUFDLENBQUM7O0VBRUgsSUFBSSxrQkFBa0IsRUFBRTtJQUN0QixNQUFNLFlBQVksR0FBRyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRCxZQUFZLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDckQ7O0VBRUQsT0FBTyxJQUFJLENBQUM7Q0FDYixDQUFDOztBQUVGLEFBQU8sTUFBTSxvQkFBb0IsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLGtCQUFrQixHQUFHLElBQUksS0FBSyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUVySixBQUFPLE1BQU0sMEJBQTBCLEdBQUcsTUFBTSxJQUFJLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDOztBQUVuRyxBQUFPLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxHQUFHLFVBQVUsS0FBSyxhQUFhLENBQUMsTUFBTSxFQUFFO0VBQ3RGLElBQUksRUFBRSxFQUFFO0VBQ1IsSUFBSSxFQUFFLE9BQU87RUFDYixHQUFHLEVBQUUscUJBQXFCO0VBQzFCLE1BQU0sRUFBRSxFQUFFO0VBQ1YsU0FBUyxFQUFFLElBQUk7RUFDZixZQUFZLEVBQUUsRUFBRTtFQUNoQixVQUFVLEVBQUUsV0FBVztFQUN2QixlQUFlLEVBQUUsRUFBRTtFQUNuQixvQkFBb0IsRUFBRSxFQUFFO0VBQ3hCLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDO0NBQzFCLENBQUMsQ0FBQzs7QUFFSCxBQUFPLE1BQU0sNEJBQTRCLEdBQUcsS0FBSyxJQUFJLGFBQWEsQ0FBQyxLQUFLLEVBQUU7RUFDeEUsSUFBSSxFQUFFLEVBQUU7RUFDUixJQUFJLEVBQUUsZ0JBQWdCO0VBQ3RCLE9BQU8sRUFBRSxFQUFFO0VBQ1gsVUFBVSxFQUFFLEVBQUU7RUFDZCxTQUFTLEVBQUUsRUFBRTtFQUNiLE1BQU0sRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDO0NBQ3pCLENBQUMsQ0FBQzs7QUFFSCxBQUFPLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxHQUFHLEtBQUs7RUFDOUMsTUFBTSxlQUFlLEdBQUc7SUFDdEIsSUFBSSxFQUFFLEVBQUU7SUFDUixlQUFlLEVBQUUsRUFBRTtHQUNwQixDQUFDO0VBQ0YsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7RUFDckMsT0FBTyxlQUFlLENBQUM7Q0FDeEIsQ0FBQzs7QUN0TUssTUFBTSxXQUFXLEdBQUc7RUFDekIsd0JBQXdCLEVBQUUsd0JBQXdCO0NBQ25ELENBQUM7O0FBRUYsQUFBTyxNQUFNLFlBQVksR0FBRyxNQUFNbEIsT0FBSSxDQUFDa0IsS0FBRyxDQUFDLENBQUM7O0FBRTVDLEFBQU8sTUFBTSxXQUFXLEdBQUcsSUFBSSxLQUFLO0VBQ2xDLElBQUksRUFBRSxFQUFFO0VBQ1IsSUFBSTtFQUNKLFdBQVcsRUFBRUMsbUJBQWlCLENBQUMsSUFBSSxDQUFDO0VBQ3BDLEtBQUssRUFBRSxFQUFFO0VBQ1QsZUFBZSxFQUFFLFNBQVM7RUFDMUIsaUJBQWlCLEVBQUUsU0FBUztDQUM3QixDQUFDLENBQUM7O0FBRUgsTUFBTSxVQUFVLEdBQUcsU0FBUyxJQUFJO0VBQzlCLFFBQVEsQ0FBQyxNQUFNLEVBQUUsdUJBQXVCO0lBQ3RDLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDaEMsUUFBUSxDQUFDLE1BQU0sRUFBRSx1QkFBdUI7SUFDdEMsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNoQyxRQUFRLENBQUMsT0FBTyxFQUFFLHdCQUF3QjtJQUN4QyxDQUFDLElBQUksZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQ2pDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxxQ0FBcUM7SUFDL0QsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztFQUMzQyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsdUNBQXVDO0lBQ25FLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQztFQUM3QyxRQUFRLENBQUMsTUFBTSxFQUFFLDBCQUEwQjtJQUN6QyxDQUFDLElBQUksZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDakJqQixVQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUN2RCxRQUFRLENBQUMsTUFBTSxFQUFFLGlCQUFpQjtJQUNoQyxDQUFDLElBQUksZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDakJmLE9BQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0NBQ3ZELENBQUM7O0FBRUYsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLEtBQUssS0FBSztFQUNsQyxNQUFNLElBQUksR0FBRytCLEtBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0IsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUM7O0VBRS9CLE1BQU0sR0FBRyxHQUFHLE9BQU8sSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7O0VBRXZELE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7SUFDMUJsQixPQUFJO0lBQ0pILFNBQU0sQ0FBQyxDQUFDLElBQUksV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt1QkFDWixXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9DRCxNQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVE7TUFDZixDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztNQUNsQixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUM7TUFDbEMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM5QyxDQUFDO0dBQ0gsQ0FBQyxDQUFDO0NBQ0osQ0FBQzs7QUFFRixBQUFPLE1BQU0sYUFBYSxHQUFHLFNBQVMsSUFBSSxDQUFDLEtBQUssS0FBSztFQUNuRCxNQUFNLGdCQUFnQixHQUFHTixXQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsR0FBRyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7RUFDeEYsT0FBTyxZQUFZLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0NBQzNGLENBQUM7O0FBRUYsQUFBTyxNQUFNLGlCQUFpQixHQUFHLFVBQVUsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtFQUNsRU0sTUFBRyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDckN5QyxVQUFPO0NBQ1IsQ0FBQyxDQUFDOztBQUVILEFBQU8sTUFBTSxRQUFRLEdBQUcsQ0FBQyxjQUFjLEVBQUUsS0FBSyxLQUFLO0VBQ2pELElBQUksZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO0lBQ2pDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztHQUMxQjtFQUNELE1BQU0sa0JBQWtCLEdBQUcsYUFBYSxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDbkYsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0lBQ2pDLE1BQU0sTUFBTSxHQUFHekMsTUFBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNyRCxNQUFNLElBQUksZUFBZSxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDM0Y7RUFDRCxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztDQUNuQyxDQUFDOztBQ25GSyxNQUFNLDBCQUEwQixHQUFHLENBQUMsYUFBYTtFQUN0RCxrQkFBa0I7RUFDbEIsbUJBQW1CLE1BQU07RUFDekIsYUFBYSxFQUFFLGtCQUFrQixFQUFFLG1CQUFtQjtDQUN2RCxDQUFDLENBQUM7O0FBRUgsTUFBTSxjQUFjLEdBQUcsVUFBVTtFQUMvQixDQUFDbUIsV0FBUSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7RUFDN0IsQ0FBQ0gsWUFBUyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7RUFDOUIsQ0FBQ2dDLGNBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQzdCLENBQUM7O0FBRUYsQUFBTyxNQUFNLDJCQUEyQixJQUFJOztFQUUxQyxhQUFhLEVBQUUsU0FBUyxJQUFJLDBCQUEwQjtJQUNwRCxDQUFDLFNBQVMsQ0FBQztJQUNYLENBQUMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDO0lBQ3ZCLENBQUMsbUJBQW1CLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQztHQUNyQzs7RUFFRCxZQUFZLEVBQUUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSywwQkFBMEI7SUFDL0QsQ0FBQyxTQUFTLENBQUM7SUFDWCxDQUFDLEVBQUUsU0FBUyxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDdEUsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUN6Rzs7RUFFRCxnQkFBZ0IsRUFBRSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxLQUFLLDBCQUEwQjtJQUNuRSxDQUFDLFNBQVMsQ0FBQztJQUNYLENBQUMsRUFBRSxTQUFTLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUMzRSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7R0FDckQ7Q0FDRixDQUFDLENBQUM7O0FBRUgsQUFBTyxNQUFNLHVCQUF1QixHQUFHLFVBQVUsSUFBSSxJQUFJLElBQUksVUFBVSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FDbkM1RixNQUFNLGFBQWEsR0FBRyxPQUFPO0VBQ2xDLFVBQVUsRUFBRSxFQUFFO0VBQ2QsU0FBUyxFQUFFLEVBQUU7Ozs7RUFJYixjQUFjLEVBQUUsRUFBRTs7O0VBR2xCLFNBQVMsRUFBRSxFQUFFO0NBQ2QsQ0FBQyxDQUFDOztBQUVILEFBQU8sTUFBTSxZQUFZLEdBQUcsT0FBTztFQUNqQyxJQUFJLEVBQUUsRUFBRTtFQUNSLGVBQWUsRUFBRSxFQUFFOztFQUVuQixhQUFhLEVBQUUsRUFBRTs7OztFQUlqQixjQUFjLEVBQUUsRUFBRTtDQUNuQixDQUFDLENBQUM7O0FDYkgsTUFBTSxjQUFjLEdBQUc7RUFDckIsUUFBUSxDQUFDLE1BQU0sRUFBRSxpQ0FBaUM7SUFDaEQsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNoQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsa0NBQWtDO0lBQzVELENBQUMsSUFBSTNELFNBQU8sQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDO2VBQ3BCLHdCQUF3QjtjQUN6QixNQUFNYyx3QkFBVyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUM7YUFDckMsQ0FBQztDQUNiLENBQUM7O0FBRUYsQUFBTyxNQUFNLGlCQUFpQixHQUFHLFNBQVMsSUFBSSxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRXRGLEFBQU8sTUFBTSxxQkFBcUIsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRTtFQUNqREgsTUFBRyxDQUFDLGlCQUFpQixDQUFDO0VBQ3RCeUMsVUFBTztDQUNSLENBQUMsQ0FBQzs7QUNDSSxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxLQUFLbkQsV0FBUSxDQUFDbUQsVUFBTyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRWpFLE1BQU0sV0FBVyxHQUFHO0VBQ2xCLFFBQVEsQ0FBQyxNQUFNLEVBQUUsc0JBQXNCO0lBQ3JDLElBQUksSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3BDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsMEJBQTBCO0lBQ3pDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0NBQ3hELENBQUM7O0FBRUYsTUFBTSxXQUFXLEdBQUc7RUFDbEIsUUFBUSxDQUFDLFFBQVEsRUFBRSx5Q0FBeUM7SUFDMUQsSUFBSSxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDdkMsUUFBUSxDQUFDLGlCQUFpQixFQUFFLHdEQUF3RDtJQUNsRixJQUFJLElBQUlRLFFBQUssQ0FBQyxDQUFDLElBQUlyQyxLQUFHLENBQUMsQ0FBQyxFQUFFLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7RUFDekUsUUFBUSxDQUFDLGlCQUFpQixFQUFFLDJEQUEyRDtJQUNyRixJQUFJLElBQUlxQyxRQUFLLENBQUMsQ0FBQyxJQUFJckMsS0FBRyxDQUFDLENBQUMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0NBQzNFLENBQUM7OztBQUdGLE1BQU0sbUJBQW1CLEdBQUc7RUFDMUIsUUFBUSxDQUFDLFdBQVcsRUFBRSw0QkFBNEI7SUFDaEQsQ0FBQyxJQUFJdkIsVUFBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7Z0JBQ2Isd0JBQXdCO2VBQ3pCLE1BQU1hLDhCQUFpQixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7Y0FDckMsQ0FBQztDQUNkLENBQUM7O0FBRUYsTUFBTSxVQUFVLEdBQUcsSUFBSSxJQUFJLFVBQVU7O0VBRW5DLENBQUMsUUFBUSxFQUFFLE9BQU87SUFDaEIsV0FBVztJQUNYLFdBQVc7R0FDWixDQUFDOztFQUVGLENBQUMsT0FBTyxFQUFFLE9BQU87SUFDZixXQUFXO0lBQ1gsWUFBWTtHQUNiLENBQUM7O0VBRUYsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPO0lBQ3hCLFdBQVc7SUFDWCxtQkFBbUI7R0FDcEIsQ0FBQzs7RUFFRixDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0NBQ3hDLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRVIsQUFBTyxNQUFNLFlBQVksR0FBRyxJQUFJLElBQUksWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV6RSxBQUFPLE1BQU0sV0FBVyxHQUFHLENBQUMsWUFBWSxLQUFLO0VBQzNDLE1BQU0sU0FBUyxHQUFHLHFCQUFxQjtJQUNyQyxZQUFZO0dBQ2IsQ0FBQzs7RUFFRixNQUFNLGlCQUFpQixHQUFHLFFBQVE7SUFDaEMsTUFBTSxFQUFFLCtDQUErQztJQUN2RCxDQUFDLElBQUlELFNBQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUU7NkJBQ2pCLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDO0dBQ3BFLENBQUM7O0VBRUYsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFO0lBQzFDRCxNQUFHLENBQUMsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5Q0MsU0FBTSxDQUFDLFdBQVcsQ0FBQztJQUNuQndDLFVBQU87R0FDUixDQUFDLENBQUM7O0VBRUgsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRTtJQUMvQnhDLFNBQU0sQ0FBQyxRQUFRLENBQUM7SUFDaEJELE1BQUcsQ0FBQyxpQkFBaUIsQ0FBQztJQUN0QnlDLFVBQU87R0FDUixDQUFDLENBQUM7O0VBRUgsTUFBTSxlQUFlLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRTtJQUNuQ3hDLFNBQU0sQ0FBQyxnQkFBZ0IsQ0FBQztJQUN4QkQsTUFBRyxDQUFDLENBQUMsSUFBSSxxQkFBcUI7TUFDNUIsQ0FBQyxDQUFDLFVBQVU7S0FDYixDQUFDO0lBQ0Z5QyxVQUFPO0dBQ1IsQ0FBQyxDQUFDOztFQUVILE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRTtJQUNsQnpDLE1BQUcsQ0FBQyxZQUFZLENBQUM7SUFDakJ5QyxVQUFPO0lBQ1BwRSxRQUFLLENBQUMsc0JBQXNCLENBQUM7SUFDN0JBLFFBQUssQ0FBQyxXQUFXLENBQUM7SUFDbEJBLFFBQUssQ0FBQyxlQUFlLENBQUM7R0FDdkIsQ0FBQyxDQUFDO0NBQ0osQ0FBQzs7QUFFRixNQUFNLFdBQVcsR0FBRztFQUNsQixRQUFRLENBQUMsTUFBTSxFQUFFLHlCQUF5QjtJQUN4QyxDQUFDLElBQUksZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ2hDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsNENBQTRDO0lBQ3BFLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7RUFDekMsUUFBUSxDQUFDLGlCQUFpQixFQUFFLCtDQUErQztJQUN6RSxDQUFDLElBQUksZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0NBQzVDLENBQUM7O0FBRUYsTUFBTSxtQkFBbUIsR0FBRyxRQUFRLENBQUMsRUFBRSxFQUFFLDRCQUE0QixFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7O0FBRWpGLE1BQU0sY0FBYyxHQUFHLE1BQU0sSUFBSSxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7OztBQUduRSxBQUFPLE1BQU0sZUFBZSxHQUFHLENBQUMsVUFBVSxLQUFLO0VBQzdDLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLFVBQVUsRUFBRTtJQUNyQzRCLFNBQU0sQ0FBQyxDQUFDLElBQUlBLFNBQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNwRUQsTUFBRyxDQUFDLENBQUMsSUFBSSxlQUFlLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUM7R0FDbEQsQ0FBQyxDQUFDOztFQUVILE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxVQUFVLEVBQUU7SUFDM0JBLE1BQUcsQ0FBQyxjQUFjLENBQUM7SUFDbkJ5QyxVQUFPO0lBQ1BwRSxRQUFLLENBQUMsZ0JBQWdCLENBQUM7SUFDdkI2RSxTQUFNLENBQUMsTUFBTSxDQUFDO0dBQ2YsQ0FBQyxDQUFDOztFQUVILE9BQU8sTUFBTSxDQUFDO0NBQ2YsQ0FBQzs7QUFFRixNQUFNLFlBQVksR0FBRyxPQUFPLEtBQUs7RUFDL0IsUUFBUSxDQUFDLFlBQVksRUFBRSx3QkFBd0I7SUFDN0MsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztFQUN0QyxRQUFRLENBQUMsV0FBVyxFQUFFLHdCQUF3QjtJQUM1QyxDQUFDLElBQUksZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ3JDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsK0JBQStCO0lBQ3BELENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVO2dCQUNOM0QsT0FBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUMxRCxRQUFRLENBQUMsV0FBVyxFQUFFLG9CQUFvQjtJQUN4QyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUztnQkFDTEcsV0FBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztFQUNoRCxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsMERBQTBEO0lBQ25GLENBQUMsQ0FBQyxLQUFLO01BQ0wsSUFBSSxDQUFDLENBQUMsQ0FBQyxjQUFjLEVBQUUsT0FBTyxJQUFJLENBQUM7TUFDbkMsSUFBSTtRQUNGUyx3QkFBVyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM5QixPQUFPLElBQUksQ0FBQztPQUNiLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLEtBQUssQ0FBQyxFQUFFO0tBQzlCLENBQUM7RUFDSixRQUFRLENBQUMsV0FBVyxFQUFFLDREQUE0RDtJQUNoRixDQUFDLENBQUMsS0FBSztNQUNMLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLE9BQU8sSUFBSSxDQUFDO01BQzlCLElBQUk7UUFDRkQsOEJBQWlCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQy9CLE9BQU8sSUFBSSxDQUFDO09BQ2IsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sS0FBSyxDQUFDLEVBQUU7S0FDOUIsQ0FBQztDQUNMLENBQUMsQ0FBQzs7QUFFSCxBQUFPLE1BQU0sZUFBZSxHQUFHLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSztFQUN0RCxNQUFNLE1BQU0sR0FBRyxZQUFZLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7O0VBRS9ELE9BQU8sTUFBTSxDQUFDO0NBQ2YsQ0FBQzs7QUFFRixBQUFPLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxRQUFRLEVBQUUsVUFBVSxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUU7RUFDcEVGLE1BQUcsQ0FBQyxDQUFDLElBQUksZUFBZSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztFQUN4Q3lDLFVBQU87Q0FDUixDQUFDLENBQUM7O0FDbkxJLE1BQU0sd0JBQXdCLEdBQUcsU0FBUyxJQUFJLFlBQVk7RUFDL0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0VBRXpELElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDOztFQUV0RSxNQUFNLGFBQWEsR0FBRyxNQUFNLFNBQVMsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQztFQUNsRSxhQUFhLENBQUMsU0FBUyxHQUFHLGtCQUFrQjtJQUMxQyxhQUFhLENBQUMsU0FBUztHQUN4QixDQUFDO0VBQ0YsT0FBTyxhQUFhLENBQUM7Q0FDdEIsQ0FBQzs7QUNOSyxNQUFNLHdCQUF3QixHQUFHLEdBQUcsSUFBSSxNQUFNLFNBQVMsSUFBSSxVQUFVO0VBQzFFLEdBQUc7RUFDSCxNQUFNLENBQUMsV0FBVyxDQUFDLHdCQUF3QjtFQUMzQyxVQUFVLENBQUMsY0FBYyxDQUFDLFlBQVk7RUFDdEMsRUFBRSxTQUFTLEVBQUU7RUFDYix5QkFBeUIsRUFBRSxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVM7Q0FDcEQsQ0FBQzs7O0FBR0YsQUFBTyxNQUFNLHlCQUF5QixHQUFHLE9BQU8sU0FBUyxFQUFFLFNBQVMsS0FBSztFQUN2RSxNQUFNLGdCQUFnQixHQUFHLE1BQU0sV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ3RELElBQUksZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtJQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsc0JBQXNCLEVBQUUxRCxNQUFJO01BQzNDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztNQUNuRixHQUFHO0tBQ0osQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNOOztFQUVELElBQUksTUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7SUFDN0MsTUFBTSxhQUFhLEdBQUcsTUFBTSxTQUFTLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDbEUsYUFBYSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDcEMsTUFBTSxTQUFTLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0dBQzlELE1BQU07SUFDTCxNQUFNLFNBQVMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDekMsTUFBTSxhQUFhLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUM7SUFDL0QsTUFBTSxTQUFTLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0dBQzlEO0NBQ0YsQ0FBQzs7QUN6QkssTUFBTSxzQkFBc0IsR0FBRyxHQUFHLElBQUksT0FBTyxPQUFPLEVBQUUsUUFBUSxLQUFLLFVBQVU7RUFDbEYsR0FBRztFQUNILE1BQU0sQ0FBQyxXQUFXLENBQUMsc0JBQXNCO0VBQ3pDLFVBQVUsQ0FBQyxjQUFjLENBQUMsWUFBWTtFQUN0QyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7RUFDckIsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsUUFBUTtDQUMxRCxDQUFDOztBQUVGLEFBQU8sTUFBTSx1QkFBdUIsR0FBRyxPQUFPLFNBQVMsRUFBRSxPQUFPLEVBQUUsUUFBUSxLQUFLO0VBQzdFLElBQUksTUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7SUFDN0MsTUFBTSxhQUFhLEdBQUcsTUFBTSxTQUFTLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDbEUsYUFBYSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDaEMsYUFBYSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7O0lBRWxDLE1BQU0sZUFBZSxHQUFHaUIsTUFBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7O0lBRXBFLElBQUksZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7TUFDOUIsTUFBTSxJQUFJLGVBQWUsQ0FBQyxDQUFDLHFCQUFxQixFQUFFakIsTUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsRjs7SUFFRCxNQUFNLGdCQUFnQixHQUFHaUIsTUFBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7O0lBRWhGLElBQUksZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtNQUMvQixNQUFNLElBQUksZUFBZSxDQUFDLENBQUMsc0JBQXNCLEVBQUVqQixNQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDcEY7O0lBRUQsTUFBTSxTQUFTLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0dBQzlELE1BQU07SUFDTCxNQUFNLElBQUksZUFBZSxDQUFDLDREQUE0RCxDQUFDLENBQUM7R0FDekY7Q0FDRixDQUFDOztBQ3RDSyxNQUFNLG1CQUFtQixHQUFHLE9BQU8sU0FBUyxLQUFLO0lBQ3BELE1BQU0sU0FBUyxDQUFDLFFBQVEsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0NBQzVELENBQUM7O0FDd0JGLE1BQU1vRSxLQUFHLEdBQUcsR0FBRyxLQUFLOztFQUVsQix3QkFBd0IsRUFBRSx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO0VBQ2pFLHdCQUF3QixFQUFFLHdCQUF3QixDQUFDLEdBQUcsQ0FBQztFQUN2RCxzQkFBc0IsRUFBRSxzQkFBc0IsQ0FBQyxHQUFHLENBQUM7RUFDbkQsbUJBQW1CLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO0VBQzdELGVBQWU7RUFDZixhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLG9CQUFvQjtFQUNwQixXQUFXO0VBQ1gsYUFBYTtFQUNiLFFBQVE7RUFDUixXQUFXO0VBQ1gsMEJBQTBCO0VBQzFCLDJCQUEyQjtFQUMzQix1QkFBdUI7RUFDdkIsWUFBWTtFQUNaLGFBQWE7RUFDYixlQUFlO0VBQ2YsZUFBZTtFQUNmLDRCQUE0QjtFQUM1Qix1QkFBdUI7RUFDdkIsa0JBQWtCO0VBQ2xCLDBCQUEwQjtFQUMxQixRQUFRLEVBQUU3QixLQUFHO0VBQ2IsWUFBWTtFQUNaLFdBQVc7RUFDWCxnQkFBZ0I7Q0FDakIsQ0FBQyxDQUFDOzs7QUFHSCxBQUFZLE1BQUMsY0FBYyxHQUFHLEdBQUcsSUFBSTZCLEtBQUcsQ0FBQyxHQUFHLENBQUM7O0FDbkR0QyxNQUFNLFFBQVEsR0FBRyxHQUFHLElBQUksWUFBWSxVQUFVO0VBQ25ELEdBQUc7RUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVE7RUFDdkIsVUFBVSxDQUFDLFNBQVMsQ0FBQyxZQUFZO0VBQ2pDLEVBQUU7RUFDRixTQUFTLEVBQUUsR0FBRztDQUNmLENBQUM7O0FBRUYsQUFBTyxNQUFNLFNBQVMsR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRTtFQUNyRm5ELE1BQUcsQ0FBQyx5QkFBeUIsQ0FBQztDQUMvQixDQUFDLENBQUM7O0FDZEksTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLElBQUksWUFBWSxVQUFVO0VBQzNELEdBQUc7RUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQjtFQUMvQixVQUFVLENBQUMsZ0JBQWdCLENBQUMsWUFBWTtFQUN4QyxFQUFFO0VBQ0YsaUJBQWlCLEVBQUUsR0FBRztDQUN2QixDQUFDOztBQUVGLEFBQU8sTUFBTSxpQkFBaUIsR0FBRyxNQUFNLEdBQUcsSUFBSSxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7O0FDSS9GLE1BQU0sU0FBUyxHQUFHLGlHQUFpRyxDQUFDOztBQUVwSCxBQUFPLE1BQU0sWUFBWSxHQUFHLEdBQUcsSUFBSSxPQUFPLFFBQVEsRUFBRSxRQUFRLEtBQUssVUFBVTtFQUN6RSxHQUFHO0VBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZO0VBQzNCLGdCQUFnQjtFQUNoQixFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUU7RUFDdEIsYUFBYSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUTtDQUN2QyxDQUFDOztBQUVGLEFBQU8sTUFBTSxhQUFhLEdBQUcsT0FBTyxHQUFHLEVBQUUsUUFBUSxFQUFFLFFBQVEsS0FBSztFQUM5RCxJQUFJLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRTs7RUFFOUUsTUFBTSxRQUFRLEdBQUcsTUFBTSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDdEMsSUFBSSxJQUFJLEdBQUcsYUFBYTtJQUN0QixRQUFRO0lBQ1IsUUFBUTtHQUNULENBQUM7O0VBRUYsTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDOzs7RUFHOUIsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEdBQUcsUUFBUSxDQUFDLEVBQUU7O0VBRWhELElBQUksUUFBUSxDQUFDO0VBQ2IsSUFBSTtJQUNGLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUTtNQUNyQyxZQUFZLENBQUMsUUFBUSxDQUFDO0tBQ3ZCLENBQUM7R0FDSCxDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQ1YsUUFBUSxHQUFHLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLENBQUM7R0FDMUQ7O0VBRUQsTUFBTSxXQUFXLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDOztFQUV2RSxNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTTtJQUN0QyxRQUFRLENBQUMsWUFBWTtJQUNyQixRQUFRO0dBQ1QsQ0FBQzs7RUFFRixJQUFJLElBQUksS0FBSyxRQUFRLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxFQUFFOztFQUV2QyxPQUFPLFFBQVE7TUFDWDtNQUNBLEdBQUcsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJO0tBQ2hEO01BQ0MsSUFBSSxDQUFDO0NBQ1YsQ0FBQzs7QUFFRixBQUFPLE1BQU0sMkJBQTJCLEdBQUcsR0FBRyxJQUFJLE9BQU8sY0FBYyxLQUFLO0VBQzFFLElBQUksZ0JBQWdCLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxFQUFFOztFQUV0RCxNQUFNLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUNoRCxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDakNRLE9BQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLGlCQUFpQixLQUFLLElBQUksQ0FBQyxFQUFFLENBQUM7R0FDM0MsQ0FBQyxDQUFDOztFQUVILE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQztFQUM5QixJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksR0FBRyxRQUFRLENBQUMsRUFBRTs7RUFFaEQsSUFBSSxRQUFRLENBQUM7RUFDYixJQUFJO0lBQ0YsUUFBUSxHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRO01BQ3JDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQ3hCLENBQUM7R0FDSCxDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQ1YsUUFBUSxHQUFHO01BQ1QsbUJBQW1CLEVBQUUsU0FBUztNQUM5QiwwQkFBMEIsR0FBRyxNQUFNLEdBQUcsQ0FBQyxZQUFZLEVBQUUsR0FBRyxLQUFLLENBQUM7S0FDL0QsQ0FBQztHQUNIOztFQUVELElBQUksUUFBUSxDQUFDLDBCQUEwQixHQUFHLE1BQU0sR0FBRyxDQUFDLFlBQVksRUFBRSxFQUFFLEVBQUUsSUFBSSxHQUFHLFFBQVEsQ0FBQyxFQUFFOztFQUV4RixNQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUdqQyxnQkFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztFQUNyRCxNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTTtJQUN0QyxRQUFRLENBQUMsbUJBQW1CO0lBQzVCLFFBQVE7R0FDVCxDQUFDOztFQUVGLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLEVBQUU7O0VBRXZDLE9BQU8sUUFBUTtNQUNYO01BQ0EsR0FBRyxJQUFJO01BQ1AsV0FBVyxFQUFFLEVBQUU7TUFDZixJQUFJLEVBQUUsSUFBSTtNQUNWLE1BQU0sRUFBRSxJQUFJO0tBQ2I7TUFDQyxJQUFJLENBQUM7Q0FDVixDQUFDOztBQUVGLEFBQU8sTUFBTSxvQkFBb0IsR0FBRyxPQUFPLEdBQUcsRUFBRSxnQkFBZ0IsS0FBSztFQUNuRSxNQUFNLGVBQWUsR0FBRyxNQUFNLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDOztFQUVyRCxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFO0lBQy9CMEIsU0FBTSxDQUFDLENBQUMsSUFBSVYsT0FBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDeERTLE1BQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQztJQUN2QnlDLFVBQU87R0FDUixDQUFDLENBQUM7Q0FDSixDQUFDOztBQ3ZHSyxNQUFNVyx1QkFBcUIsR0FBRyxHQUFHLElBQUksTUFBTSxRQUFRLElBQUksVUFBVTtFQUN0RSxHQUFHO0VBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUI7RUFDcEMsZ0JBQWdCO0VBQ2hCLEVBQUUsUUFBUSxFQUFFO0VBQ1osc0JBQXNCLEVBQUUsR0FBRyxFQUFFLFFBQVE7Q0FDdEMsQ0FBQzs7QUFFRixBQUFPLE1BQU0sc0JBQXNCLEdBQUcsT0FBTyxHQUFHLEVBQUUsUUFBUSxLQUFLO0VBQzdELE1BQU0sUUFBUSxHQUFHLE1BQU0sZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7O0VBRTdDLE1BQU0sSUFBSSxHQUFHLE1BQU0sT0FBTztJQUN4QixHQUFHLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxDQUFDO0dBQzlCLENBQUM7O0VBRUYsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLG1FQUFtRSxDQUFDLENBQUMsRUFBRTs7RUFFN0csSUFBSTtJQUNGLE1BQU0sS0FBSyxHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7O0lBRTVELE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDNUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQzs7SUFFcEQsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVU7TUFDNUIsZUFBZTtNQUNmLEtBQUs7S0FDTixDQUFDO0dBQ0gsU0FBUztJQUNSLE1BQU0sV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztHQUM5Qjs7RUFFRCxNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUTtJQUMzQyxZQUFZLENBQUMsUUFBUSxDQUFDO0dBQ3ZCLENBQUM7RUFDRixRQUFRLENBQUMsbUJBQW1CLEdBQUcsUUFBUSxDQUFDLG1CQUFtQixDQUFDOztFQUU1RCxRQUFRLENBQUMsMEJBQTBCLEdBQUcsUUFBUSxDQUFDLDBCQUEwQixDQUFDOztFQUUxRSxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVTtJQUM1QixZQUFZLENBQUMsUUFBUSxDQUFDO0lBQ3RCLFFBQVE7R0FDVCxDQUFDOztFQUVGLE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQztDQUMxQixDQUFDOztBQUVGLEFBQU8sTUFBTSxnQkFBZ0IsR0FBRyxPQUFPLEdBQUcsS0FBSztFQUM3QyxNQUFNLFFBQVEsR0FBRzdFLGdCQUFRLEVBQUU7VUFDbkJBLGdCQUFRLEVBQUU7VUFDVkEsZ0JBQVEsRUFBRTtVQUNWQSxnQkFBUSxFQUFFLENBQUM7O0VBRW5CLE1BQU0sTUFBTSxHQUFHQSxnQkFBUSxFQUFFLENBQUM7O0VBRTFCLE9BQU87SUFDTCxtQkFBbUIsRUFBRSxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSTtNQUN4QyxRQUFRO0tBQ1Q7SUFDRCwwQkFBMEI7WUFDbEIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxvQkFBb0I7SUFDekQsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDckMsaUJBQWlCLEVBQUUsTUFBTTtHQUMxQixDQUFDO0NBQ0gsQ0FBQzs7QUNqRUYsTUFBTSxTQUFTLEdBQUcsUUFBUSxJQUFJO0VBQzVCLFFBQVEsQ0FBQyxNQUFNLEVBQUUsc0JBQXNCO0lBQ3JDLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDaEMsUUFBUSxDQUFDLGNBQWMsRUFBRSwwQ0FBMEM7SUFDakUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztFQUNqQyxRQUFRLENBQUMsTUFBTSxFQUFFLHlCQUF5QjtJQUN4QyxDQUFDLElBQUkwQixTQUFNLENBQUMsRUFBRSxJQUFJLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztFQUMvRSxRQUFRLENBQUMsY0FBYyxFQUFFLHdDQUF3QztJQUMvRCxDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO0NBQzlDLENBQUM7O0FBRUYsQUFBTyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksS0FBSyxZQUFZLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7O0FDbkJ2RixNQUFNLFVBQVUsR0FBRyxHQUFHLElBQUksTUFBTSxjQUFjO0VBQ25ELEdBQUc7RUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7RUFDekIsVUFBVSxDQUFDLFVBQVUsQ0FBQyxZQUFZO0VBQ2xDLEVBQUU7RUFDRixXQUFXLEVBQUUsR0FBRztDQUNqQixDQUFDOztBQUVGLEFBQU8sTUFBTSxXQUFXLEdBQUcsT0FBTztFQUNoQyxJQUFJLEVBQUUsRUFBRTtFQUNSLFlBQVksRUFBRSxFQUFFO0VBQ2hCLE9BQU8sRUFBRSxJQUFJO0VBQ2IsaUJBQWlCLEVBQUUsRUFBRTtDQUN0QixDQUFDLENBQUM7O0FBRUgsQUFBTyxNQUFNLGNBQWMsR0FBRyxHQUFHLElBQUksTUFBTSxjQUFjO0VBQ3ZELEdBQUc7RUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWM7RUFDN0IsVUFBVSxDQUFDLFVBQVUsQ0FBQyxZQUFZO0VBQ2xDLEVBQUU7RUFDRixlQUFlLEVBQUUsR0FBRztDQUNyQixDQUFDOztBQUVGLEFBQU8sTUFBTSxlQUFlLEdBQUcsT0FBTztFQUNwQyxZQUFZLEVBQUUsRUFBRTtFQUNoQixtQkFBbUIsRUFBRSxFQUFFO0VBQ3ZCLDBCQUEwQixFQUFFLENBQUM7Q0FDOUIsQ0FBQyxDQUFDOztBQ3RCSSxNQUFNLGVBQWUsR0FBRyxHQUFHLElBQUksUUFBUSxJQUFJLGNBQWM7RUFDOUQsR0FBRztFQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBZTtFQUM5QixnQkFBZ0I7RUFDaEIsRUFBRSxRQUFRLEVBQUU7RUFDWixnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsUUFBUTtDQUNoQyxDQUFDOztBQUVGLEFBQU8sTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLEdBQUcsRUFBRSxRQUFRLEtBQUssYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7O0FBRXRGLEFBQU8sTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLElBQUksT0FBTyxTQUFTLEVBQUUsV0FBVyxLQUFLLFVBQVU7RUFDakYsR0FBRztFQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCO0VBQy9CLGdCQUFnQjtFQUNoQixFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUU7RUFDMUIsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxXQUFXO0NBQy9DLENBQUM7O0FBRUYsQUFBTyxNQUFNLGlCQUFpQixHQUFHLE9BQU8sR0FBRyxFQUFFLFNBQVMsRUFBRSxXQUFXLEtBQUs7RUFDdEUsTUFBTSxZQUFZLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVE7SUFDL0MsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0dBQzVCLENBQUM7O0VBRUYsSUFBSSxXQUFXLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxFQUFFO0lBQzFDLE1BQU0sUUFBUSxHQUFHLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNO01BQ3RDLFlBQVksQ0FBQyxZQUFZO01BQ3pCLFNBQVM7S0FDVixDQUFDOztJQUVGLElBQUksUUFBUSxFQUFFO01BQ1osTUFBTSxNQUFNLEtBQUs7UUFDZixHQUFHLEVBQUUsWUFBWTtRQUNqQixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXO09BQzNCLENBQUM7TUFDRixPQUFPLElBQUksQ0FBQztLQUNiO0dBQ0Y7O0VBRUQsT0FBTyxLQUFLLENBQUM7Q0FDZCxDQUFDOztBQUVGLEFBQU8sTUFBTSw0QkFBNEIsR0FBRyxHQUFHLElBQUksT0FBTyxRQUFRLEVBQUUsV0FBVyxLQUFLLFVBQVU7RUFDNUYsR0FBRztFQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsNEJBQTRCO0VBQzNDLGdCQUFnQjtFQUNoQixFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUU7RUFDekIsNkJBQTZCLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxXQUFXO0NBQzFELENBQUM7OztBQUdGLEFBQU8sTUFBTSw2QkFBNkIsR0FBRyxPQUFPLEdBQUcsRUFBRSxRQUFRLEVBQUUsV0FBVyxLQUFLO0VBQ2pGLE1BQU0sV0FBVyxHQUFHLE1BQU0sR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDOztFQUU3QyxNQUFNLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7RUFFMUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQ25DTyxPQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxpQkFBaUIsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDO0dBQzNDLENBQUMsQ0FBQzs7RUFFSCxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxLQUFLLENBQUMsRUFBRTs7RUFFNUIsTUFBTSxZQUFZLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVE7SUFDL0MsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7R0FDeEIsQ0FBQzs7RUFFRixJQUFJLFdBQVcsQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUM7VUFDekMsWUFBWSxDQUFDLDBCQUEwQixHQUFHLFdBQVcsRUFBRTtJQUM3RCxNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTTtNQUN0QyxZQUFZLENBQUMsbUJBQW1CO01BQ2hDLElBQUksQ0FBQyxJQUFJO0tBQ1YsQ0FBQzs7SUFFRixJQUFJLFFBQVEsRUFBRTtNQUNaLE1BQU0sS0FBSztRQUNULEdBQUcsRUFBRSxZQUFZO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVztPQUN2QixDQUFDO01BQ0YsT0FBTyxJQUFJLENBQUM7S0FDYjtHQUNGOztFQUVELE9BQU8sS0FBSyxDQUFDO0NBQ2QsQ0FBQzs7QUFFRixNQUFNLEtBQUssR0FBRyxPQUFPLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFdBQVcsS0FBSztFQUN4RCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsRUFBRSxDQUFDO0VBQzlCLElBQUksQ0FBQywwQkFBMEIsR0FBRyxDQUFDLENBQUM7RUFDcEMsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSTtJQUN2QyxXQUFXO0dBQ1osQ0FBQztFQUNGLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVO0lBQzVCLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFDdEIsSUFBSTtHQUNMLENBQUM7Q0FDSCxDQUFDOztBQUVGLEFBQU8sTUFBTSxhQUFhLEdBQUcsR0FBRyxJQUFJLFFBQVEsSUFBSSxjQUFjO0VBQzVELEdBQUc7RUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWE7RUFDNUIsZ0JBQWdCO0VBQ2hCLEVBQUUsUUFBUSxFQUFFO0VBQ1osY0FBYyxFQUFFLFFBQVE7Q0FDekIsQ0FBQzs7QUFFRixBQUFPLE1BQU0sY0FBYyxHQUFHLENBQUMsUUFBUSxLQUFLOzs7O0VBSTFDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztFQUNkLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxPQUFPLEtBQUssQ0FBQyxFQUFFOzs7RUFHaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztFQUM3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN4QyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2RCxLQUFLLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNyQzs7O0VBR0QsTUFBTSxVQUFVLEdBQUc7SUFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQzNCLEtBQUssRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUM3QixLQUFLLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDN0IsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0dBQzlCLENBQUM7O0VBRUYsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDO0VBQ3ZCLEtBQUssTUFBTSxLQUFLLElBQUksVUFBVSxFQUFFO0lBQzlCLGNBQWMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUN2RDtFQUNELEtBQUssSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDOztFQUVuQyxNQUFNLFlBQVksR0FBRyxLQUFLLEdBQUcsRUFBRTtNQUMzQixRQUFRO01BQ1IsS0FBSyxHQUFHLEVBQUU7UUFDUixNQUFNO1FBQ04sS0FBSyxJQUFJLEVBQUU7VUFDVCxNQUFNO1VBQ04sV0FBVyxDQUFDOztFQUVwQixPQUFPO0lBQ0wsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUM7SUFDdEIsWUFBWTtHQUNiLENBQUM7Q0FDSCxDQUFDOztBQ3hJSyxNQUFNNkMsWUFBVSxHQUFHLEdBQUcsSUFBSSxPQUFPLElBQUksRUFBRSxRQUFRLEdBQUcsSUFBSSxLQUFLLFVBQVU7RUFDMUUsR0FBRztFQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtFQUN6QixVQUFVLENBQUMsVUFBVSxDQUFDLFlBQVk7RUFDbEMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO0VBQ2xCLFdBQVcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVE7Q0FDakMsQ0FBQzs7QUFFRixBQUFPLE1BQU0sV0FBVyxHQUFHLE9BQU8sR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLEdBQUcsSUFBSSxLQUFLO0VBQy9ELE1BQU0sSUFBSSxHQUFHLE1BQU0sT0FBTztJQUN4QixHQUFHLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxDQUFDO0dBQzlCLENBQUM7O0VBRUYsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHVEQUF1RCxDQUFDLENBQUMsRUFBRTs7RUFFakcsTUFBTSxLQUFLLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQzs7RUFFNUQsTUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDLEFBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7RUFDN0QsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxFQUFFLE1BQU0sSUFBSSxlQUFlLENBQUMsQ0FBQyxpQkFBaUIsRUFBRXRFLE9BQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFOztFQUV2RyxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxHQUFHLE1BQU0sU0FBUztJQUMzRCxHQUFHLEVBQUUsUUFBUTtHQUNkLENBQUM7RUFDRixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztFQUN6QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7O0VBRTNDLElBQUlRLE9BQUksQ0FBQyxDQUFDLElBQUksaUJBQWlCLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtJQUMxRCxNQUFNLElBQUksZUFBZSxDQUFDLHFCQUFxQixDQUFDLENBQUM7R0FDbEQ7O0VBRUQsS0FBSyxDQUFDLElBQUk7SUFDUix5QkFBeUIsQ0FBQyxJQUFJLENBQUM7R0FDaEMsQ0FBQzs7RUFFRixNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVTtJQUM1QixlQUFlO0lBQ2YsS0FBSztHQUNOLENBQUM7O0VBRUYsSUFBSTtJQUNGLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVO01BQzVCLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO01BQ3ZCLElBQUk7S0FDTCxDQUFDO0dBQ0gsQ0FBQyxPQUFPLENBQUMsRUFBRTtJQUNWLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVO01BQzVCLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO01BQ3ZCLElBQUk7S0FDTCxDQUFDO0dBQ0g7O0VBRUQsTUFBTSxXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDOztFQUU3QixPQUFPLElBQUksQ0FBQztDQUNiLENBQUM7O0FBRUYsTUFBTSxTQUFTLEdBQUcsT0FBTyxHQUFHLEVBQUUsUUFBUSxLQUFLO0VBQ3pDLE1BQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDOztFQUVuQyxJQUFJLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxFQUFFO0lBQzlCLElBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFO01BQzdCLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztNQUNwRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsRUFBRSxDQUFDO01BQzlCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7TUFDNUIsSUFBSSxDQUFDLDBCQUEwQixHQUFHLENBQUMsQ0FBQztNQUNwQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUM7S0FDakI7SUFDRCxNQUFNLElBQUksZUFBZSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7R0FDbEUsTUFBTTtJQUNMLE1BQU0sVUFBVSxHQUFHLE1BQU0sZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0MsSUFBSSxDQUFDLG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQztJQUMxRCxJQUFJLENBQUMsMEJBQTBCLEdBQUcsVUFBVSxDQUFDLDBCQUEwQixDQUFDO0lBQ3hFLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLFFBQVE7TUFDTixJQUFJO01BQ0osUUFBUSxFQUFFLFVBQVUsQ0FBQyxRQUFRO01BQzdCLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxpQkFBaUI7S0FDaEQsRUFBRTtHQUNKO0NBQ0YsQ0FBQzs7QUN0RkssTUFBTSxVQUFVLEdBQUcsR0FBRyxJQUFJLE1BQU0sUUFBUSxJQUFJLFVBQVU7RUFDM0QsR0FBRztFQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtFQUN6QixVQUFVLENBQUMsaUJBQWlCLENBQUMsWUFBWTtFQUN6QyxFQUFFLFFBQVEsRUFBRTtFQUNaLFdBQVcsRUFBRSxHQUFHLEVBQUUsUUFBUTtDQUMzQixDQUFDOztBQUVGLEFBQU8sTUFBTSxXQUFXLEdBQUcsR0FBRyxJQUFJLE1BQU0sUUFBUSxJQUFJLFVBQVU7RUFDNUQsR0FBRztFQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztFQUMxQixVQUFVLENBQUMsaUJBQWlCLENBQUMsWUFBWTtFQUN6QyxFQUFFLFFBQVEsRUFBRTtFQUNaLFlBQVksRUFBRSxHQUFHLEVBQUUsUUFBUTtDQUM1QixDQUFDOztBQUVGLEFBQU8sTUFBTSxXQUFXLEdBQUcsT0FBTyxHQUFHLEVBQUUsUUFBUSxLQUFLLE1BQU0sVUFBVSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRTFGLEFBQU8sTUFBTSxZQUFZLEdBQUcsT0FBTyxHQUFHLEVBQUUsUUFBUSxLQUFLLE1BQU0sVUFBVSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRTVGLE1BQU0sVUFBVSxHQUFHLE9BQU8sR0FBRyxFQUFFLFFBQVEsRUFBRSxPQUFPLEtBQUs7RUFDbkQsTUFBTSxJQUFJLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztFQUU3RCxNQUFNLFVBQVUsR0FBRyxPQUFPLEdBQUcsUUFBUSxHQUFHLFNBQVMsQ0FBQzs7RUFFbEQsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsRUFBRTs7RUFFMUYsSUFBSTtJQUNGLE1BQU0sS0FBSyxHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDNUQsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM1QyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsTUFBTSxJQUFJLGFBQWEsQ0FBQyxDQUFDLHVCQUF1QixFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFOztJQUUvRSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssQ0FBQyxPQUFPLEVBQUU7TUFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7TUFDdkIsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDeEQ7R0FDRixTQUFTO0lBQ1IsV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztHQUN4QjtDQUNGLENBQUM7O0FDaERLLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxPQUFPO0VBQzVDLElBQUksRUFBRSxFQUFFO0VBQ1IsV0FBVyxFQUFFLEVBQUU7RUFDZixPQUFPLENBQUMsS0FBSztDQUNkLENBQUMsQ0FBQzs7QUNTSCxNQUFNLGFBQWEsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLGVBQWUsRUFBRTtFQUM1Q29DLFNBQU07RUFDTmpDLFdBQVEsQ0FBQyxDQUFDLENBQUM7Q0FDWixDQUFDLENBQUM7O0FBRUgsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLElBQUlILE9BQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0VBQ2xELGVBQWUsQ0FBQyxhQUFhO0VBQzdCLGVBQWUsQ0FBQyxhQUFhO0VBQzdCLGVBQWUsQ0FBQyxhQUFhO0VBQzdCLGVBQWUsQ0FBQyxXQUFXO0VBQzNCLGVBQWUsQ0FBQyxVQUFVO0VBQzFCLGVBQWUsQ0FBQyxjQUFjO0NBQy9CLENBQUMsQ0FBQzs7O0FBR0gsTUFBTSxlQUFlLEdBQUcsR0FBRyxLQUFLO0VBQzlCLFFBQVEsQ0FBQyxNQUFNLEVBQUUsbUNBQW1DO0lBQ2xELENBQUMsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLFFBQVEsQ0FBQyxTQUFTLEVBQUUsMkRBQTJEO0lBQzdFLENBQUMsSUFBSSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDdEIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0NBQzlELENBQUMsQ0FBQzs7QUFFSCxNQUFNLG9CQUFvQixHQUFHLEdBQUcsSUFBSSxZQUFZLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0FBRXZFLE1BQU0sZ0JBQWdCLEdBQUcsU0FBUyxLQUFLO0VBQ3JDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsa0JBQWtCO0lBQ2pDLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDaEMsUUFBUSxDQUFDLE1BQU0sRUFBRSxtQ0FBbUM7SUFDbEQsQ0FBQyxJQUFJRixVQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDUlksU0FBTSxDQUFDLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7Q0FDdEYsQ0FBQyxDQUFDOztBQUVILE1BQU0sZUFBZSxHQUFHLFNBQVMsSUFBSSxZQUFZLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7QUFFL0UsQUFBTyxNQUFNLG1CQUFtQixHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLEtBQUs7RUFDOUQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7SUFDaENELE1BQUcsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QnlDLFVBQU87SUFDUFgsU0FBTTtNQUNKLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUM7S0FDbEM7R0FDRixDQUFDLENBQUM7O0VBRUgsT0FBTyxJQUFJLENBQUM7Q0FDYixDQUFDOztBQUVGLEFBQU8sTUFBTSxvQkFBb0IsR0FBRyxHQUFHLElBQUksU0FBUyxJQUFJLGNBQWM7RUFDcEUsR0FBRztFQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsb0JBQW9CO0VBQ25DLGdCQUFnQjtFQUNoQixFQUFFLFNBQVMsRUFBRTtFQUNiLHFCQUFxQixFQUFFLEdBQUcsRUFBRSxTQUFTO0NBQ3RDLENBQUM7O0FBRUYsQUFBTyxNQUFNLHFCQUFxQixHQUFHLENBQUMsR0FBRyxFQUFFLFNBQVMsS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFO0VBQ3BFOUIsTUFBRyxDQUFDLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDaER5QyxVQUFPO0VBQ1BhLFdBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsS0FBSzsyQkFDYixDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJOzJCQUNqQixDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUM7Q0FDOUMsQ0FBQyxDQUFDOztBQzlESSxNQUFNLGdCQUFnQixHQUFHLEdBQUcsSUFBSSxNQUFNLFlBQVksSUFBSSxVQUFVO0VBQ3JFLEdBQUc7RUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQjtFQUMvQixVQUFVLENBQUMsaUJBQWlCLENBQUMsWUFBWTtFQUN6QyxFQUFFLFlBQVksRUFBRTtFQUNoQixpQkFBaUIsRUFBRSxHQUFHLEVBQUUsWUFBWTtDQUNyQyxDQUFDOztBQUVGLEFBQU8sTUFBTSxpQkFBaUIsR0FBRyxPQUFPLEdBQUcsRUFBRSxZQUFZLEtBQUs7RUFDNUQsTUFBTSxnQkFBZ0IsR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDeEUsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0lBQy9CLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRTtNQUMvQnRELE1BQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztNQUNqQmpCLE9BQUksQ0FBQyxJQUFJLENBQUM7S0FDWCxDQUFDLENBQUM7SUFDSCxNQUFNLElBQUksS0FBSztNQUNiLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDakMsQ0FBQztHQUNIOztFQUVELE1BQU0sSUFBSSxHQUFHLE1BQU0sT0FBTztJQUN4QixHQUFHLEVBQUUsdUJBQXVCLEVBQUUsSUFBSSxFQUFFLENBQUM7R0FDdEMsQ0FBQzs7RUFFRixJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQyxFQUFFOztFQUVwRixJQUFJO0lBQ0YsTUFBTSxRQUFRLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ2xFLElBQUksUUFBUSxDQUFDLE9BQU8sS0FBSyxZQUFZLENBQUMsT0FBTyxFQUFFLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQywyREFBMkQsQ0FBQyxDQUFDLEVBQUU7O0lBRWhJLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7SUFFdkIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUUsWUFBWSxDQUFDLENBQUM7R0FDNUQsU0FBUztJQUNSLE1BQU0sV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztHQUM5QjtDQUNGLENBQUM7O0FDdENLLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxHQUFHLEtBQUs7RUFDOUMsTUFBTSxRQUFRLEdBQUcscUJBQXFCLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ3RELE1BQU0sV0FBVyxHQUFHLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxDQUFDOztFQUV4QyxNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFO0lBQzlCa0IsU0FBTSxDQUFDLFFBQVEsQ0FBQztHQUNqQixDQUFDLENBQUM7O0VBRUgsS0FBSyxNQUFNLENBQUMsSUFBSSxXQUFXLEVBQUU7SUFDM0IsVUFBVSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3RELFVBQVUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN0RCxVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDdEQsVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0dBQ3JEOztFQUVELE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUU7SUFDN0JBLFNBQU0sQ0FBQyxPQUFPLENBQUM7R0FDaEIsQ0FBQyxDQUFDOztFQUVILEtBQUssTUFBTSxDQUFDLElBQUksVUFBVSxFQUFFO0lBQzFCLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztHQUNwRDs7RUFFRCxLQUFLLE1BQU0sQ0FBQyxJQUFJRyxPQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQ2pDLFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztHQUM5Qzs7RUFFRCxDQUFDLENBQUMsVUFBVSxFQUFFO0lBQ1p1QixTQUFNO0lBQ04xQixTQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUN0QnlDLE9BQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztHQUM5QixDQUFDLENBQUM7O0VBRUgsT0FBTyxXQUFXLENBQUMsV0FBVyxDQUFDO0NBQ2hDLENBQUM7O0FDaENLLE1BQU1hLHFCQUFtQixHQUFHLEdBQUcsSUFBSSxPQUFPLFFBQVEsRUFBRSxZQUFZLEtBQUssVUFBVTtFQUNwRixHQUFHO0VBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUI7RUFDbEMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLFlBQVk7RUFDM0MsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFO0VBQzFCLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsWUFBWTtDQUNsRCxDQUFDOztBQUVGLEFBQU8sTUFBTSxvQkFBb0IsR0FBRyxPQUFPLEdBQUcsRUFBRSxRQUFRLEVBQUUsWUFBWSxLQUFLO0VBQ3pFLE1BQU0sSUFBSSxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7RUFFN0QsTUFBTSxrQkFBa0IsR0FBRyxDQUFDO0lBQzFCLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUM7SUFDaEQ7TUFDRSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU07TUFDYnZELE1BQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQztLQUNqQjtHQUNGLENBQUM7O0VBRUYsTUFBTSxPQUFPLEdBQUdzQyxhQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQztFQUM3RCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0lBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxnQ0FBZ0MsRUFBRXZELE9BQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDM0U7O0VBRUQsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUMsRUFBRTs7RUFFeEYsSUFBSTtJQUNGLE1BQU0sS0FBSyxHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDNUQsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM1QyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsTUFBTSxJQUFJLGFBQWEsQ0FBQyxDQUFDLHlCQUF5QixFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFOztJQUUvRSxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztJQUNqQyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQztHQUN4RCxTQUFTO0lBQ1IsV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztHQUN4QjtDQUNGLENBQUM7O0FDekJVLE1BQUMsVUFBVSxHQUFHLEdBQUcsS0FBSztFQUNoQyxZQUFZLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQztFQUMvQiwyQkFBMkIsRUFBRSwyQkFBMkIsQ0FBQyxHQUFHLENBQUM7RUFDN0QscUJBQXFCLEVBQUVxRSx1QkFBcUIsQ0FBQyxHQUFHLENBQUM7RUFDakQsVUFBVSxFQUFFQyxZQUFVLENBQUMsR0FBRyxDQUFDO0VBQzNCLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLEdBQUcsQ0FBQztFQUN2QyxVQUFVLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQztFQUMzQixXQUFXLEVBQUUsV0FBVyxDQUFDLEdBQUcsQ0FBQztFQUM3QixpQkFBaUIsRUFBRSxpQkFBaUIsQ0FBQyxBQUFHLENBQUM7RUFDekMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUM7RUFDM0IsY0FBYyxFQUFFLGNBQWMsQ0FBQyxHQUFHLENBQUM7RUFDbkMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUM7RUFDdkIsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxDQUFDO0VBQ3ZDLFlBQVksRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDO0VBQy9CLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLEdBQUcsQ0FBQztFQUN2Qyw0QkFBNEIsRUFBRSw0QkFBNEIsQ0FBQyxHQUFHLENBQUM7RUFDL0QsYUFBYTtFQUNiLGVBQWUsRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDO0VBQ3JDLFlBQVksRUFBRSxZQUFZLENBQUMsQUFBRyxDQUFDO0VBQy9CLG9CQUFvQixFQUFFLG9CQUFvQixDQUFDLEdBQUcsQ0FBQztFQUMvQyx1QkFBdUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDLEdBQUcsQ0FBQztFQUMzRCxtQkFBbUIsRUFBRUUscUJBQW1CLENBQUMsR0FBRyxDQUFDO0NBQzlDLENBQUM7O0FDekNLLE1BQU1DLGVBQWEsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsT0FBTyxLQUFLO0VBQzNELGNBQWM7SUFDWixHQUFHO0lBQ0gsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPO0lBQ3pCLFVBQVUsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztJQUNqRCxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUU7SUFDdkIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxPQUFPO0dBQ2pDLENBQUM7Q0FDSCxDQUFDOztBQUVGLEFBQU8sTUFBTSxjQUFjLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsT0FBTyxLQUFLLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7O0FDWmpJLE1BQUMsYUFBYSxHQUFHLEdBQUcsS0FBSztFQUNuQyxPQUFPLEVBQUVBLGVBQWEsQ0FBQyxHQUFHLENBQUM7Q0FDNUIsQ0FBQzs7QUNGRixNQUFNLE9BQU8sR0FBRyxRQUFRLElBQUksT0FBTyxTQUFTLEVBQUUsT0FBTyxHQUFHLEVBQUUsS0FBSztFQUM3RCxJQUFJLENBQUM1QyxLQUFHLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxFQUFFLE9BQU87O0VBRXRDLEtBQUssTUFBTSxPQUFPLElBQUksUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO0lBQ3pDLE1BQU0sT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztHQUNuQztDQUNGLENBQUM7O0FBRUYsTUFBTSxTQUFTLEdBQUcsUUFBUSxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sS0FBSztFQUNwRCxJQUFJLENBQUNBLEtBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLEVBQUU7SUFDN0IsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztHQUMxQjtFQUNELFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FDbkMsQ0FBQzs7QUFFRixBQUFPLE1BQU0scUJBQXFCLEdBQUcsTUFBTTtFQUN6QyxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7RUFDcEIsTUFBTSxlQUFlLElBQUk7SUFDdkIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUM7SUFDMUIsU0FBUyxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUM7R0FDL0IsQ0FBQyxDQUFDO0VBQ0gsT0FBTyxlQUFlLENBQUM7Q0FDeEIsQ0FBQzs7QUNyQkYsTUFBTSxVQUFVLEdBQUcsa0JBQWtCLElBQUksT0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLEdBQUcsS0FBSyxNQUFNLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0FBRWpLLE1BQU0sYUFBYSxHQUFHLGtCQUFrQixJQUFJLE9BQU8sSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxHQUFHLEtBQUssTUFBTSxLQUFLLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRTlKLE1BQU0sUUFBUSxHQUFHLFNBQVMsSUFBSSxPQUFPLEdBQUcsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxHQUFHLEtBQUs7RUFDckUsSUFBSTtJQUNGLE9BQU8sTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0dBQy9FLENBQUMsT0FBTyxHQUFHLEVBQUU7SUFDWixNQUFNLElBQUksYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUN0QztFQUNGOztBQUVELE1BQU0sVUFBVSxHQUFHLFNBQVMsSUFBSSxPQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsR0FBRyxLQUFLO0VBQzVFLElBQUk7SUFDRixPQUFPLE1BQU0sS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0dBQ3BGLENBQUMsT0FBTyxHQUFHLEVBQUU7SUFDWixNQUFNLElBQUksYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUN0QztFQUNGOztBQUVELEFBQVksTUFBQyxjQUFjLEdBQUcsQ0FBQyxTQUFTLEtBQUs7RUFDM0MsTUFBTSxrQkFBa0IsR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDO0VBQ2hELFNBQVMsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ3pDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7RUFDdEQsU0FBUyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDN0MsU0FBUyxDQUFDLFVBQVUsR0FBRyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQztFQUN6RCxJQUFJLFNBQVMsQ0FBQyxhQUFhLEVBQUUsRUFBRSxPQUFPLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRTtFQUNoRSxPQUFPLFNBQVMsQ0FBQztDQUNsQjs7QUMxQk0sTUFBTSxXQUFXLEdBQUcsSUFBSSxJQUFJO0VBQ2pDLElBQUksSUFBSSxDQUFDOztFQUVULElBQUk7SUFDRixJQUFJLEdBQUc2Qyx3QkFBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3BCLENBQUMsTUFBTSxDQUFDLEVBQUU7SUFDVCxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUM1RCxNQUFNLENBQUMsQ0FBQztHQUNUOztFQUVELE9BQU8sSUFBSSxDQUFDO0VBQ2I7O0FBRUQsQUFBTyxNQUFNLGlCQUFpQixHQUFHLElBQUksSUFBSTtFQUN2QyxJQUFJLElBQUksQ0FBQzs7RUFFVCxJQUFJO0lBQ0YsSUFBSSxHQUFHQyw4QkFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ25CLENBQUMsTUFBTSxDQUFDLEVBQUU7SUFDVCxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNsRSxNQUFNLENBQUMsQ0FBQztHQUNUOztFQUVELE9BQU8sSUFBSSxDQUFDO0NBQ2I7O0FDbkJNLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEtBQUs7RUFDekYsZUFBZSxDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0VBQzNDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0VBQ3hFLE9BQU8sdUJBQXVCLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7Q0FDM0QsQ0FBQzs7QUFFRixNQUFNLHVCQUF1QixHQUFHLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxLQUFLLENBQUMsQ0FBQyxPQUFPLEVBQUU7RUFDeEVwRixTQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLO0lBQ2pCLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDaEUsT0FBTyxHQUFHLENBQUM7R0FDWixFQUFFLEVBQUUsQ0FBQztDQUNQLENBQUMsQ0FBQzs7QUFFSCxNQUFNLGlCQUFpQixHQUFHLENBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxLQUFLO0VBQ2xGLE1BQU0sYUFBYSxHQUFHLENBQUMsY0FBYyxFQUFFLFlBQVksS0FBSztJQUN0RCxJQUFJLENBQUMsY0FBYyxFQUFFLE9BQU8sRUFBRSxDQUFDO0lBQy9CLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUMzQyxPQUFPLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztHQUNoRCxDQUFDOztFQUVGLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsWUFBWSxLQUFLO0lBQ2xELElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sSUFBSSxDQUFDO0lBQ3BDLE1BQU0sU0FBUyxHQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN2RCxPQUFPLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO0dBQzdDLENBQUM7O0VBRUYsS0FBSyxJQUFJLElBQUksSUFBSSxRQUFRLEVBQUU7SUFDekIsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRyxLQUFLO01BQzNDLElBQUksZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1FBQy9CLE1BQU0sY0FBYztVQUNsQixnQkFBZ0I7VUFDaEJrQyxPQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztVQUM5QyxhQUFhLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUM7U0FDeEMsQ0FBQztPQUNIO0tBQ0YsQ0FBQyxDQUFDO0dBQ0o7Q0FDRixDQUFDOztBQUVGLE1BQU0sZUFBZSxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxLQUFLO0VBQ3JELE1BQU0sZUFBZSxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUU7SUFDakMwQyxTQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxlQUFlLENBQUM7SUFDOUJsRCxNQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxlQUFlLENBQUM7R0FDNUIsQ0FBQyxDQUFDOztFQUVILE1BQU0sZUFBZSxHQUFHSSxPQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7RUFFL0MsTUFBTSxjQUFjLEdBQUdrQyxhQUFVO0lBQy9CLGVBQWUsRUFBRSxlQUFlO0dBQ2pDLENBQUM7O0VBRUYsSUFBSSxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtJQUM3QixNQUFNLElBQUksZUFBZSxDQUFDLENBQUMsNkNBQTZDLEVBQUV2RCxPQUFJLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ3pHOztFQUVELE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRTtJQUNuQ2tCLFNBQU0sQ0FBQyxDQUFDLElBQUksQ0FBQ0ksYUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUM5RUwsTUFBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztHQUN4RSxDQUFDLENBQUM7O0VBRUgsSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0lBQ2hDLE1BQU0sSUFBSSxhQUFhLENBQUMsQ0FBQyx3REFBd0QsRUFBRWpCLE9BQUksQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNySDtDQUNGLENBQUM7O0FDMURLLE1BQU0sUUFBUSxHQUFHLE9BQU8sR0FBRyxLQUFLO0VBQ3JDLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLGlCQUFpQjtJQUM1RCxtQkFBbUI7R0FDcEIsQ0FBQzs7RUFFRixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7O0VBRXRCLElBQUlRLE9BQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEVBQUU7SUFDOUMsTUFBTSxnQkFBZ0IsR0FBR2lCLE9BQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0lBRXBFLFlBQVksR0FBRyxNQUFNLDhCQUE4QjtNQUNqRCxHQUFHO01BQ0gsT0FBTyxDQUFDLG1CQUFtQixFQUFFLGdCQUFnQixDQUFDO0tBQy9DLENBQUM7R0FDSDs7RUFFRCxJQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLE9BQU8sWUFBWSxDQUFDOztFQUVqRCxPQUFPLE1BQU0sNEJBQTRCO0lBQ3ZDLEdBQUcsRUFBRSxnQkFBZ0I7R0FDdEIsQ0FBQztDQUNILENBQUM7O0FBRUYsTUFBTSw4QkFBOEIsR0FBRyxPQUFPLEdBQUcsRUFBRSxnQkFBZ0IsS0FBSztFQUN0RSxNQUFNLFlBQVksR0FBRyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUM3RSxJQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFOztJQUU3QixNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDbkQsT0FBTyxFQUFFLENBQUM7R0FDWDs7RUFFRCxNQUFNLG1CQUFtQixHQUFHLE9BQU8sZ0JBQWdCLEdBQUcsQ0FBQyxLQUFLO0lBQzFELElBQUksZ0JBQWdCLElBQUksWUFBWSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQzs7SUFFdkQsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixFQUFFLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDakYsTUFBTSxLQUFLLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLGlCQUFpQjtNQUNqRCxjQUFjO0tBQ2YsQ0FBQzs7SUFFRixJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO01BQ3RCLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7TUFDakQsT0FBTyxNQUFNLG1CQUFtQixDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ3hEOztJQUVELE9BQU8sRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLENBQUM7R0FDbEMsQ0FBQzs7RUFFRixNQUFNLGdCQUFnQixHQUFHLE1BQU0sbUJBQW1CLEVBQUUsQ0FBQzs7RUFFckQsSUFBSSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQzs7RUFFbkQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRTtJQUM3Q1IsTUFBRyxDQUFDLGtCQUFrQixDQUFDO0dBQ3hCLENBQUMsQ0FBQzs7RUFFSCxLQUFLLE1BQU0sQ0FBQyxJQUFJLFlBQVksRUFBRTtJQUM1QixNQUFNLGtCQUFrQixHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRO01BQ3JELE9BQU87UUFDTCxnQkFBZ0IsQ0FBQyxjQUFjO1FBQy9CLENBQUMsQ0FBQyxNQUFNO09BQ1Q7S0FDRixDQUFDO0lBQ0YsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLEVBQUUsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDM0Q7O0VBRUQsWUFBWSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsZ0JBQWdCLEVBQUU7SUFDM0MsZ0JBQWdCO0lBQ2hCLDBCQUEwQjtJQUMxQixzQkFBc0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO0dBQ3RDLENBQUMsQ0FBQzs7RUFFSCxZQUFZLENBQUMsU0FBUyxHQUFHLGdCQUFnQixDQUFDLGNBQWMsQ0FBQzs7RUFFekQsT0FBTyxZQUFZLENBQUM7Q0FDckIsQ0FBQzs7QUFFRixNQUFNLDRCQUE0QixHQUFHLE9BQU8sR0FBRyxFQUFFLGdCQUFnQixLQUFLO0VBQ3BFLE1BQU0sY0FBYyxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6Q0MsU0FBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssYUFBYTt1QkFDWixDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDRCxNQUFHLENBQUMsa0JBQWtCLENBQUM7R0FDeEIsQ0FBQyxDQUFDOztFQUVILE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRTtJQUMvQzJELFVBQU8sQ0FBQyxVQUFVLENBQUM7R0FDcEIsQ0FBQyxDQUFDOztFQUVILE1BQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDOztFQUUvQixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsS0FBSztJQUMxQixJQUFJLENBQUMsQ0FBQyxRQUFRLEtBQUssSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztJQUVsQyxNQUFNLEVBQUUsR0FBRyxnQkFBZ0I7TUFDekIsQ0FBQyxDQUFDLFFBQVE7TUFDVixDQUFDLENBQUMsZUFBZTtNQUNqQixDQUFDLENBQUMsUUFBUTtLQUNYLENBQUM7O0lBRUYsTUFBTSxXQUFXLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVE7TUFDOUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLEVBQUUsQ0FBQztLQUNqQyxDQUFDOztJQUVGLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFO01BQ2YsQ0FBQyxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO01BQzlCLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO01BQ2xCLE9BQU8sQ0FBQyxDQUFDO0tBQ1Y7O0lBRUQsTUFBTSxHQUFHLEdBQUcsTUFBTSxLQUFLO01BQ3JCLEdBQUc7TUFDSCxXQUFXLENBQUMsU0FBUztLQUN0QixDQUFDO0lBQ0YsSUFBSSxHQUFHLENBQUMsYUFBYSxLQUFLLEVBQUUsRUFBRTtNQUM1QixDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztNQUNmLElBQUksV0FBVyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFFO01BQ25FLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0tBQ25CLE1BQU07TUFDTCxDQUFDLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztLQUNwQjs7SUFFRCxPQUFPLENBQUMsQ0FBQztHQUNWLENBQUM7O0VBRUYsTUFBTSxPQUFPLEdBQUcsT0FBTyxLQUFLLEVBQUUsT0FBTyxLQUFLO0lBQ3hDLE1BQU0sWUFBWSxHQUFHMUQsU0FBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVDLElBQUksWUFBWSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFDN0IsTUFBTSxDQUFDLEdBQUcsTUFBTSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDeEMsUUFBUSxDQUFDLENBQUMsUUFBUSxLQUFLLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUFFO0tBQ3pDO0lBQ0QsS0FBSyxJQUFJLENBQUMsSUFBSSxZQUFZLEVBQUU7TUFDMUIsQ0FBQyxHQUFHLE1BQU0sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3BCLElBQUksQ0FBQyxDQUFDLFFBQVEsS0FBSyxJQUFJLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFO0tBQ3ZDOztJQUVELE9BQU8sSUFBSSxDQUFDO0dBQ2IsQ0FBQzs7RUFFRixLQUFLLE1BQU0sUUFBUSxJQUFJLHNCQUFzQixFQUFFO0lBQzdDLE1BQU0saUJBQWlCLEdBQUcsc0JBQXNCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0QsSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO01BQ2xDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDN0MsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7TUFDaEQsU0FBUztLQUNWO0lBQ0QsSUFBSVYsT0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7TUFDckMsTUFBTSxDQUFDLEdBQUcsTUFBTSxNQUFNLENBQUNpQixPQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO01BQzFELElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO01BQ2hELFNBQVM7S0FDVjtJQUNELElBQUlqQixPQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsaUJBQWlCLENBQUMsRUFBRTtNQUNyQyxNQUFNLEdBQUcsR0FBRyxNQUFNLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FBQztNQUN2RCxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7TUFDeEUsU0FBUztLQUNWO0lBQ0QsSUFBSUEsT0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7TUFDckMsTUFBTSxHQUFHLEdBQUcsTUFBTSxPQUFPLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUM7TUFDdkQsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtNQUN4RCxTQUFTO0tBQ1Y7R0FDRjs7RUFFRCxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFO0lBQ25DVSxTQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQztHQUMzRSxDQUFDLENBQUM7OztFQUdILE1BQU0sY0FBYyxHQUFHRCxNQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVTtJQUN0RCxPQUFPO01BQ0wsbUJBQW1CO01BQ25CLGdCQUFnQjtRQUNkLENBQUMsQ0FBQyxRQUFRO1FBQ1YsQ0FBQyxDQUFDLGVBQWU7UUFDakIsQ0FBQyxDQUFDLFFBQVE7T0FDWDtLQUNGO0dBQ0YsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztFQUVmLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7RUFFbEMsT0FBTyxtQkFBbUIsQ0FBQztDQUM1QixDQUFDOztBQUVGLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxFQUFFLEtBQUs7RUFDakMsTUFBTSxPQUFPLEdBQUd0QixRQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDakMsUUFBUTtJQUNOLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3BCLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzNCLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3BCLE1BQU0sRUFBRSxFQUFFO0dBQ1gsRUFBRTtDQUNKLENBQUM7O0FDN0xLLE1BQU0sMEJBQTBCLEdBQUcsQ0FBQyxZQUFZLEVBQUUsTUFBTSxLQUFLO0VBQ2xFLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7RUFDdkIsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQy9CLE1BQU0sTUFBTSxHQUFHLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7RUFFcEMsTUFBTSxhQUFhLEdBQUdtRCxTQUFPLENBQUMscUJBQXFCLENBQUMsWUFBWSxDQUFDO0lBQy9ELENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDaEMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOztFQUVaLE1BQU0sb0NBQW9DLEdBQUcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxLQUFLLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztFQUV4SSxNQUFNLDZCQUE2QixHQUFHLE1BQU12RCxTQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxLQUFLO0lBQ2hFLE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hELEdBQUcsQ0FBQyxZQUFZLEdBQUcsZUFBZSxDQUFDO0lBQ25DLE1BQU0sWUFBWSxHQUFHLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQy9FLE1BQU0sU0FBUyxHQUFHa0MsT0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDOztJQUVwRCxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUU7O0lBRXpDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO21CQUNULFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUU7O0lBRTlELE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFO01BQ25DUCxTQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEtBQUssVUFBVSxDQUFDLFFBQVE7NEJBQ3pCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEtBQUssQ0FBQzs0QkFDbkNQLFdBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO0tBQ2pFLENBQUMsQ0FBQzs7SUFFSGdELE9BQUksQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJO01BQzdCLG9DQUFvQyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUM7S0FDekQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztJQUVaLE9BQU8sR0FBRyxDQUFDO0dBQ1osRUFBRSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDOztFQUVsRSxNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUMsYUFBYSxFQUFFO0lBQ25DekMsU0FBTSxDQUFDLENBQUMsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUkscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakVELE1BQUcsQ0FBQyxDQUFDLElBQUksbUJBQW1CLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0dBQzlDLENBQUMsQ0FBQzs7RUFFSCxPQUFPM0IsUUFBSyxDQUFDLDZCQUE2QixFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztDQUM1RCxDQUFDOztBQUVGLEFBQU8sTUFBTSxrQ0FBa0MsR0FBRyxDQUFDLFlBQVksRUFBRSxNQUFNLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7RUFDeEYsbUJBQW1CLENBQUMsWUFBWSxDQUFDO0VBQ2pDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTTtFQUNiNEIsU0FBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFdBQVc7dUJBQ2IsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7dUJBQzNCLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDMURELE1BQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsb0JBQW9CLEVBQUU7SUFDN0NBLE1BQUcsQ0FBQyxDQUFDLEtBQUs7TUFDUixVQUFVLEVBQUUsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7TUFDcEMsS0FBSyxFQUFFLENBQUM7S0FDVCxDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7RUFDSHlDLFVBQU87RUFDUHpDLE1BQUcsQ0FBQyxDQUFDLElBQUksbUJBQW1CO0lBQzFCLENBQUMsQ0FBQyxVQUFVO0lBQ1osT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztHQUNyRCxDQUFDO0NBQ0gsQ0FBQyxDQUFDOztBQUVILE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxNQUFNLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7O0FDOUU3RTs7RUFFQSxBQUFPLE1BQU0sc0JBQXNCLEdBQUcsTUFBTSxJQUFJOztJQUU5QyxJQUFJLFFBQVEsQ0FBQzs7SUFFYixNQUFNLGFBQWEsR0FBRyxHQUFHLElBQUk7UUFDekIsUUFBUSxHQUFHLEdBQUcsQ0FBQztLQUNsQixDQUFDOztJQUVGLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDOztJQUVsQyxNQUFNLEtBQUssR0FBRyxLQUFLLElBQUk7TUFDckIsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDOztNQUVyQixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sS0FBSztRQUN0QyxJQUFJLFFBQVEsRUFBRTtVQUNaLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQztVQUNyQixRQUFRLEdBQUcsU0FBUyxDQUFDO1VBQ3JCLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3BCOztRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtVQUN6RCxPQUFPLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7U0FDN0M7O1FBRUQsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLElBQUk7VUFDL0IsUUFBUSxHQUFHLFNBQVMsQ0FBQztVQUNyQixRQUFRLEdBQUcsSUFBSSxDQUFDO1VBQ2hCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztVQUNiOztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGlCQUFpQixDQUFDLENBQUM7O1FBRXhDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7O1FBRXJDLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLGlCQUFpQixDQUFDLENBQUM7O1FBRWxELElBQUksUUFBUSxFQUFFO1VBQ1osSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7V0FDdkI7U0FDRixNQUFNO1VBQ0wsTUFBTSxZQUFZLEdBQUcsR0FBRyxJQUFJO1lBQzFCLFFBQVEsR0FBRyxTQUFTLENBQUM7WUFDckIsZUFBZSxFQUFFLENBQUM7WUFDbEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2I7O1VBRUQsTUFBTSxZQUFZLEdBQUcsTUFBTTtZQUN6QixlQUFlLEVBQUUsQ0FBQztZQUNsQixPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZCOztVQUVELE1BQU0sWUFBWSxHQUFHLE1BQU07WUFDekIsZUFBZSxFQUFFLENBQUM7WUFDbEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2Qjs7VUFFRCxNQUFNLGFBQWEsR0FBRyxNQUFNO1lBQzFCLGVBQWUsRUFBRSxDQUFDO1lBQ2xCLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkI7O1VBRUQsTUFBTSxlQUFlLEdBQUcsTUFBTTtZQUM1QixNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUNoRDs7VUFFRCxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztVQUNqQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztVQUNqQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztVQUNqQyxNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztTQUNwQztPQUNGLENBQUM7TUFDSDs7SUFFRCxNQUFNLEdBQUcsR0FBRyxNQUFNOztNQUVoQixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sS0FBSztRQUN0QyxJQUFJLFFBQVEsRUFBRTtVQUNaLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQztVQUNyQixRQUFRLEdBQUcsU0FBUyxDQUFDO1VBQ3JCLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3BCOztRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtVQUN6RCxPQUFPLE9BQU8sRUFBRSxDQUFDO1NBQ2xCOztRQUVELE1BQU0sYUFBYSxHQUFHLE1BQU07VUFDMUIsZUFBZSxFQUFFLENBQUM7VUFDbEIsT0FBTyxFQUFFLENBQUM7VUFDWDs7UUFFRCxNQUFNLFlBQVksR0FBRyxDQUFDLEdBQUcsS0FBSztVQUM1QixRQUFRLEdBQUcsU0FBUyxDQUFDO1VBQ3JCLGVBQWUsRUFBRSxDQUFDO1VBQ2xCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztVQUNiOztRQUVELE1BQU0sZUFBZSxHQUFHLE1BQU07VUFDNUIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7VUFDN0MsTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7VUFDaEQ7O1FBRUQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7O1FBRWpDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztPQUNkLENBQUM7TUFDSDs7SUFFRCxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0dBQ3JCOztBQzlHSSxNQUFNLFlBQVksR0FBRyxPQUFPLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUTtFQUMzRCxTQUFTLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxZQUFZLEtBQUs7RUFDM0QsTUFBTSxpQkFBaUIsR0FBRyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztFQUNwRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFNBQVMsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixDQUFDLENBQUM7RUFDeEcsSUFBSSxNQUFNLEtBQUssYUFBYSxFQUFFLE9BQU87O0VBRXJDLE1BQU0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUM7RUFDdkQsTUFBTSxjQUFjLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0NBQzVDLENBQUM7O0FBRUYsTUFBTSxhQUFhLEdBQUcsZUFBZSxDQUFDO0FBQ3RDLE1BQU0sU0FBUyxHQUFHLE9BQU8sU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsS0FBSztFQUNwRyxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUM7O0VBRTFCLElBQUksY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFO0lBQzdCLE1BQU0sMkJBQTJCLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUNuRSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFO01BQ3RDLE1BQU0sS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDNUM7R0FDRjs7RUFFRCxJQUFJOztJQUVGLGNBQWMsR0FBRyxxQkFBcUI7UUFDbEMsTUFBTSxLQUFLLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDO0tBQ2pELENBQUM7O0dBRUgsQ0FBQyxPQUFPLENBQUMsRUFBRTs7SUFFVixJQUFJLE1BQU0sS0FBSyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRTtNQUN0QyxNQUFNLENBQUMsQ0FBQztLQUNULE1BQU07TUFDTCxJQUFJLGlCQUFpQixFQUFFO1FBQ3JCLE1BQU0sS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLENBQUM7T0FDNUMsTUFBTTtRQUNMLE9BQU8sYUFBYSxDQUFDO09BQ3RCOztNQUVELGNBQWMsR0FBRyxxQkFBcUI7VUFDbEMsTUFBTSxLQUFLLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDO09BQ2pELENBQUM7O0tBRUg7R0FDRjs7RUFFRCxNQUFNLGNBQWMsR0FBRyxzQkFBc0I7TUFDekMsTUFBTSxLQUFLLENBQUMsa0JBQWtCLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQztHQUMzRCxDQUFDOztFQUVGLE9BQU8sY0FBYztJQUNuQixTQUFTLEVBQUUsU0FBUztRQUNoQixjQUFjLEVBQUUsY0FBYztHQUNuQyxDQUFDO0NBQ0gsQ0FBQzs7QUFFRixNQUFNLGNBQWMsR0FBRyxPQUFPLEtBQUssRUFBRSxjQUFjLEVBQUUsT0FBTyxHQUFHLEtBQUssS0FBSztFQUN2RSxNQUFNLFFBQVEsR0FBRyxDQUFDLEVBQUUsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQzFDLElBQUk7SUFDRixNQUFNLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7R0FDeEMsQ0FBQyxPQUFPLENBQUMsRUFBRTs7R0FFWDtFQUNELElBQUk7SUFDRixNQUFNLEtBQUssQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0dBQ2xELENBQUMsT0FBTyxDQUFDLEVBQUU7O0lBRVYsSUFBSSxDQUFDLE9BQU8sRUFBRTtNQUNaLE1BQU0sY0FBYyxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDbkQsTUFBTTtNQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2hFO0dBQ0Y7Q0FDRixDQUFDOztBQ2pESyxNQUFNLG1CQUFtQixHQUFHLEdBQUcsSUFBSSxPQUFPLFlBQVksS0FBSztFQUNoRSxNQUFNLGNBQWMsR0FBRyx5QkFBeUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDOztFQUU5RSxLQUFLLE1BQU0sS0FBSyxJQUFJSSxPQUFJLENBQUMsY0FBYyxDQUFDLEVBQUU7SUFDeEMsTUFBTSxZQUFZO01BQ2hCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVM7TUFDNUIsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVE7TUFDOUIsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVM7TUFDL0IsS0FBSztNQUNMLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNO01BQzVCLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPO0tBQzlCLENBQUM7R0FDSDtDQUNGLENBQUM7O0FBRUYsTUFBTSx5QkFBeUIsR0FBRyxDQUFDLFNBQVMsRUFBRSxZQUFZLEtBQUs7RUFDN0QsTUFBTSxPQUFPLEdBQUcsNEJBQTRCO0lBQzFDLFNBQVMsRUFBRSxZQUFZO0dBQ3hCLENBQUM7O0VBRUYsTUFBTSxPQUFPLEdBQUcsNEJBQTRCO0lBQzFDLFNBQVMsRUFBRSxZQUFZO0dBQ3hCLENBQUM7RUFDRixNQUFNLE9BQU8sR0FBRyw0QkFBNEI7SUFDMUMsU0FBUyxFQUFFLFlBQVk7R0FDeEIsQ0FBQzs7RUFFRixNQUFNLFVBQVUsR0FBRyxnQ0FBZ0M7SUFDakQsU0FBUztJQUNULFlBQVk7R0FDYixDQUFDOztFQUVGLE1BQU0sUUFBUSxHQUFHO0lBQ2YsR0FBRyxPQUFPO0lBQ1YsR0FBRyxPQUFPLENBQUMsUUFBUTtHQUNwQixDQUFDOztFQUVGLE1BQU0sT0FBTyxHQUFHO0lBQ2QsR0FBRyxPQUFPO0lBQ1YsR0FBRyxPQUFPLENBQUMsT0FBTztJQUNsQixHQUFHLFVBQVU7R0FDZCxDQUFDOztFQUVGLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQzs7RUFFeEIsTUFBTSxlQUFlLEdBQUcsQ0FBQyxDQUFDLEtBQUs7SUFDN0IsSUFBSTVCLGNBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUU7TUFDOUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsR0FBRztRQUM5QixNQUFNLEVBQUUsRUFBRTtRQUNWLE9BQU8sRUFBRSxFQUFFO1FBQ1gsUUFBUSxFQUFFLENBQUMsQ0FBQyxRQUFRO1FBQ3BCLFlBQVksRUFBRSxDQUFDLENBQUMsWUFBWTtRQUM1QixTQUFTLEVBQUUsQ0FBQyxDQUFDLFNBQVM7T0FDdkIsQ0FBQztLQUNIO0dBQ0YsQ0FBQzs7RUFFRixLQUFLLE1BQU0sS0FBSyxJQUFJLE9BQU8sRUFBRTtJQUMzQixlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkIsWUFBWSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSTtNQUMzQyxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU07S0FDMUIsQ0FBQztHQUNIOztFQUVELEtBQUssTUFBTSxLQUFLLElBQUksUUFBUSxFQUFFO0lBQzVCLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QixZQUFZLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJO01BQzVDLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUc7S0FDOUIsQ0FBQztHQUNIOztFQUVELE9BQU8sWUFBWSxDQUFDO0NBQ3JCLENBQUM7O0FBRUYsTUFBTSw0QkFBNEIsR0FBRyxDQUFDLFNBQVMsRUFBRSxZQUFZLEtBQUs7RUFDaEUsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUN5QixTQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDOztFQUUvRCxNQUFNLGFBQWEsR0FBRyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsS0FBSztJQUNsRCxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbEUsUUFBUTtNQUNOLFlBQVk7TUFDWixTQUFTLEVBQUUsZ0JBQWdCLENBQUMsU0FBUztNQUNyQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsUUFBUTtNQUNuQyxhQUFhLEVBQUUsaUJBQWlCO1FBQzlCLGdCQUFnQixDQUFDLFNBQVM7UUFDMUIsZ0JBQWdCLENBQUMsUUFBUTtRQUN6QixZQUFZLENBQUMsTUFBTTtPQUNwQjtLQUNGLEVBQUU7R0FDSixDQUFDOztFQUVGLE1BQU0sb0JBQW9CLEdBQUcsV0FBVyxJQUFJLENBQUMsQ0FBQyxFQUFFLE9BQU8sS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFO0lBQ3JFRCxNQUFHLENBQUMsQ0FBQyxLQUFLO01BQ1IsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztNQUNsQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0tBQ2hDLENBQUMsQ0FBQztJQUNIQyxTQUFNLENBQUMsV0FBVyxDQUFDO0dBQ3BCLENBQUMsQ0FBQzs7RUFFSCxNQUFNLGNBQWMsR0FBRyxDQUFDLENBQUMsRUFBRSxjQUFjLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsWUFBWSxLQUFLLElBQUk7WUFDNUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsWUFBWSxLQUFLLEtBQUs7ZUFDdEMsY0FBYyxDQUFDLENBQUM7O0VBRTdCLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFLGlCQUFpQixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsWUFBWSxLQUFLLEtBQUs7V0FDL0UsaUJBQWlCO1dBQ2pCLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUM7O0VBRWxELE1BQU0sY0FBYyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxZQUFZLEtBQUssSUFBSTtXQUMzRCxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxZQUFZLEtBQUssSUFBSTtXQUN4QyxDQUFDMkQsVUFBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU07VUFDbkMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7O0VBRW5DLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztFQUNwQixNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7O0VBRW5CLEtBQUssTUFBTSxDQUFDLElBQUksa0JBQWtCLEVBQUU7SUFDbEMsTUFBTSxZQUFZLEdBQUcsMEJBQTBCO01BQzdDLFNBQVMsRUFBRSxDQUFDLENBQUMsTUFBTTtLQUNwQixDQUFDOztJQUVGLE1BQU0sZ0JBQWdCLEdBQUcsdUJBQXVCO01BQzlDLFNBQVMsRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxNQUFNO0tBQ2pDLENBQUM7OztJQUdGLE1BQU0sb0JBQW9CLEdBQUd2RixPQUFLO01BQ2hDLG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUM7O01BRXJELG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7O01BRXBFLG9CQUFvQixDQUFDLENBQUMsSUFBSSxjQUFjLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLFlBQVksQ0FBQztLQUNyRixDQUFDOzs7SUFHRixNQUFNLGdCQUFnQixHQUFHQSxPQUFLO01BQzVCLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUM7O01BRWxELG9CQUFvQixDQUFDLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLGVBQWUsQ0FBQzs7TUFFcEYsb0JBQW9CLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLFVBQVUsQ0FBQztLQUNsRSxDQUFDOztJQUVGLE1BQU0sT0FBTyxHQUFHQSxPQUFLO01BQ25CLG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUM7O01BRXJELG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7S0FDckUsQ0FBQzs7SUFFRixNQUFNLGVBQWUsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFO01BQ2pDNEIsU0FBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztLQUN6RCxDQUFDLENBQUM7O0lBRUgsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLENBQUMsZUFBZSxFQUFFO01BQzVDcUMsYUFBVSxDQUFDLE9BQU8sQ0FBQztLQUNwQixDQUFDLENBQUM7O0lBRUgsS0FBSyxNQUFNLEdBQUcsSUFBSSxlQUFlLEVBQUU7TUFDakNNLE9BQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztNQUNuQixvQkFBb0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDL0IsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzVCOztJQUVELFFBQVEsQ0FBQyxJQUFJO01BQ1gsQ0FBQyxDQUFDLG9CQUFvQixFQUFFO1FBQ3RCNUMsTUFBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO09BQ2hCLENBQUM7S0FDSCxDQUFDOztJQUVGLE9BQU8sQ0FBQyxJQUFJO01BQ1YsQ0FBQyxDQUFDLGdCQUFnQixFQUFFO1FBQ2xCQSxNQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUM7T0FDaEIsQ0FBQztLQUNILENBQUM7O0lBRUYsT0FBTyxDQUFDLElBQUk7TUFDVixDQUFDLENBQUMsa0JBQWtCLEVBQUU7UUFDcEJBLE1BQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQztPQUNoQixDQUFDO0tBQ0gsQ0FBQztHQUNIOztFQUVELFFBQVE7SUFDTixRQUFRLEVBQUV5QyxVQUFPLENBQUMsUUFBUSxDQUFDO0lBQzNCLE9BQU8sRUFBRUEsVUFBTyxDQUFDLE9BQU8sQ0FBQztHQUMxQixFQUFFO0NBQ0osQ0FBQzs7QUFFRixNQUFNLGdDQUFnQyxHQUFHLENBQUMsU0FBUyxFQUFFLFlBQVksS0FBSztFQUNwRSxNQUFNLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQ3hDLFNBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDbEUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDO0VBQ25ELE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUM7O0VBRXpDLE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxLQUFLO0lBQzFCLElBQUksYUFBYSxDQUFDLFNBQVMsQ0FBQyxFQUFFO01BQzVCLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUM5Qjs7SUFFRCxJQUFJLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxFQUFFO01BQy9CLE1BQU0sVUFBVSxHQUFHLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDaEUsTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7UUFDckNBLFNBQU0sQ0FBQyw2QkFBNkIsQ0FBQyxTQUFTLENBQUMsQ0FBQztPQUNqRCxDQUFDLENBQUM7TUFDSCxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7TUFDckIsS0FBSyxNQUFNLFFBQVEsSUFBSSxTQUFTLEVBQUU7UUFDaEMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDO3NCQUNYLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtVQUM1QyxNQUFNLFFBQVEsR0FBRyxPQUFPO1lBQ3RCLFFBQVEsQ0FBQyxHQUFHO1lBQ1osU0FBUyxDQUFDLElBQUk7V0FDZixDQUFDOztVQUVGLElBQUksQ0FBQ1AsV0FBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFO1NBQ2xFO09BQ0Y7TUFDRCxPQUFPLFNBQVMsQ0FBQztLQUNsQjs7SUFFRCxPQUFPLENBQUMsT0FBTztNQUNiLG9CQUFvQjtRQUNsQixTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQzVCLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRztPQUNiO01BQ0QsU0FBUyxDQUFDLElBQUk7S0FDZixDQUFDLENBQUM7R0FDSixDQUFDOztFQUVGLE9BQU8sQ0FBQyxDQUFDLGlCQUFpQixFQUFFO0lBQzFCTSxNQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUs7TUFDVCxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO01BQ25ELElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLE9BQU8sSUFBSSxDQUFDO01BQzVDLE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNsQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUU7UUFDbEJBLE1BQUcsQ0FBQyxRQUFRLEtBQUs7VUFDZixZQUFZO1VBQ1osU0FBUztVQUNULFFBQVE7VUFDUixhQUFhLEVBQUUsaUJBQWlCO1lBQzlCLFNBQVM7WUFDVCxRQUFRO1lBQ1IsWUFBWSxDQUFDLE1BQU07V0FDcEI7U0FDRixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSixDQUFDO0lBQ0Z5QyxVQUFPO0lBQ1B4QyxTQUFNLENBQUMsV0FBVyxDQUFDO0dBQ3BCLENBQUMsQ0FBQztDQUNKLENBQUM7O0FBRUYsTUFBTSxxQ0FBcUMsR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxLQUFLO0VBQ2pGLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDQSxTQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOztFQUUzRCxNQUFNLG9CQUFvQixHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFO0lBQ3RERCxNQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUs7TUFDVCxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztNQUNyRCxRQUFRO1FBQ04sWUFBWTtRQUNaLFNBQVMsRUFBRSxDQUFDLENBQUMsU0FBUztRQUN0QixRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVE7UUFDcEIsYUFBYSxFQUFFLGlCQUFpQjtVQUM5QixDQUFDLENBQUMsU0FBUztVQUNYLENBQUMsQ0FBQyxRQUFRO1VBQ1YsWUFBWSxDQUFDLE1BQU07U0FDcEI7T0FDRixFQUFFO0tBQ0osQ0FBQztJQUNGQyxTQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDO0dBQ3pDLENBQUMsQ0FBQzs7RUFFSCxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7O0VBRXRCLEtBQUssTUFBTSxDQUFDLElBQUksa0JBQWtCLEVBQUU7SUFDbEMsTUFBTSxZQUFZLEdBQUcsMEJBQTBCLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyRSxNQUFNLFVBQVUsR0FBRyxrQ0FBa0MsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztJQUUzRSxVQUFVLENBQUMsSUFBSTtNQUNiLG9CQUFvQixDQUFDLENBQUMsRUFBRSxZQUFZLENBQUM7S0FDdEMsQ0FBQztJQUNGLFVBQVUsQ0FBQyxJQUFJO01BQ2Isb0JBQW9CLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQztLQUNwQyxDQUFDO0dBQ0g7O0VBRUQsT0FBT3dDLFVBQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztDQUM1QixDQUFDOztBQUVGLE1BQU0sNEJBQTRCLEdBQUcscUNBQXFDLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXJGLE1BQU0sNEJBQTRCLEdBQUcscUNBQXFDLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXJGLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxZQUFZLEVBQUUsU0FBUyxFQUFFLFNBQVMsS0FBSztFQUN0RSxNQUFNLFVBQVUsR0FBRyxrQ0FBa0M7SUFDbkQsWUFBWSxFQUFFLFNBQVM7R0FDeEIsQ0FBQztFQUNGLE1BQU0sVUFBVSxHQUFHLGtDQUFrQztJQUNuRCxZQUFZLEVBQUUsU0FBUztHQUN4QixDQUFDOztFQUVGLE1BQU0sWUFBWSxHQUFHb0IsZUFBWTtJQUMvQixDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVE7SUFDZixVQUFVLEVBQUUsVUFBVTtHQUN2QixDQUFDOztFQUVGLE1BQU0sZUFBZSxHQUFHQSxlQUFZO0lBQ2xDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUTtJQUNmLFVBQVUsRUFBRSxVQUFVO0dBQ3ZCLENBQUM7O0VBRUYsTUFBTSxVQUFVLEdBQUdDLGlCQUFjO0lBQy9CLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUTtJQUNmLFVBQVUsRUFBRSxVQUFVO0dBQ3ZCLENBQUM7O0VBRUYsT0FBTztJQUNMLFlBQVk7SUFDWixlQUFlO0lBQ2YsVUFBVTtHQUNYLENBQUM7Q0FDSCxDQUFDOztBQ2hWSyxNQUFNLE9BQU8sR0FBRyxPQUFPLEdBQUcsS0FBSztFQUNwQyxNQUFNLElBQUksR0FBRyxNQUFNLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzNDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU87O0VBRTNCLElBQUk7SUFDRixNQUFNLFlBQVksR0FBRyxNQUFNLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QyxJQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO01BQzNCLE1BQU0sbUJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7O01BRTdDLE1BQU0sTUFBTSxHQUFHLFlBQVksQ0FBQyxTQUFTO1VBQ2pDLFlBQVksQ0FBQyxTQUFTO1VBQ3RCLG1CQUFtQixDQUFDOztNQUV4QixNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUMsWUFBWSxFQUFFO1FBQ2xDOUQsTUFBRyxDQUFDLENBQUMsSUFBSSxPQUFPO1VBQ2QsTUFBTTtVQUNOLGdCQUFnQjtZQUNkLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLGVBQWU7WUFDN0IsQ0FBQyxDQUFDLFFBQVE7V0FDWDtTQUNGLENBQUM7UUFDRkEsTUFBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO09BQzlCLENBQUMsQ0FBQzs7TUFFSCxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDaEM7R0FDRixTQUFTO0lBQ1IsTUFBTSxXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0dBQzlCO0NBQ0YsQ0FBQzs7QUFFRixNQUFNLGtCQUFrQixHQUFHLE1BQU0sR0FBRyxJQUFJLE1BQU0sT0FBTztFQUNuRCxHQUFHLEVBQUUsYUFBYTtFQUNsQixtQkFBbUIsRUFBRSxjQUFjO0NBQ3BDLENBQUM7O0FDcENVLE1BQUMsY0FBYyxHQUFHLE9BQU8sU0FBUyxFQUFFLHFCQUFxQixFQUFFLFlBQVksS0FBSztFQUN0RixNQUFNLFNBQVMsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7RUFDM0MsTUFBTSxTQUFTLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFLHFCQUFxQixDQUFDLENBQUM7O0VBRXJFLE1BQU0seUJBQXlCLENBQUMsU0FBUyxFQUFFLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQzVFLE1BQU0scUJBQXFCLENBQUMsU0FBUyxFQUFFLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDOztFQUV4RSxNQUFNLDJCQUEyQixDQUFDLFNBQVMsRUFBRSxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7RUFFOUUsTUFBTSxTQUFTLENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUM7O0VBRWxELE1BQU0sU0FBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQzs7RUFFMUMsTUFBTSxTQUFTLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQzs7RUFFaEQsTUFBTSxTQUFTLENBQUMsVUFBVTtJQUN4QixrQkFBa0I7SUFDbEIsWUFBWSxHQUFHLFlBQVksR0FBRyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7Q0FDN0QsQ0FBQzs7QUFFRixNQUFNLHFCQUFxQixHQUFHLE9BQU8sU0FBUyxFQUFFLFNBQVMsS0FBSztFQUM1RCxNQUFNLGFBQWEsR0FBRyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUN2RCxNQUFNLGFBQWEsR0FBRyxDQUFDLENBQUMsYUFBYSxFQUFFO0lBQ3JDQyxTQUFNLENBQUMsYUFBYSxDQUFDO0dBQ3RCLENBQUMsQ0FBQzs7RUFFSCxLQUFLLE1BQU0sS0FBSyxJQUFJLGFBQWEsRUFBRTtJQUNqQyxJQUFJLENBQUMsTUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxlQUFlLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFO0dBQy9GO0NBQ0YsQ0FBQzs7QUFFRixNQUFNLDJCQUEyQixHQUFHLE9BQU8sU0FBUyxFQUFFLFFBQVEsS0FBSztFQUNqRSxNQUFNLGFBQWEsR0FBRyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUN0RCxNQUFNLGFBQWEsR0FBRyxDQUFDLENBQUMsYUFBYSxFQUFFO0lBQ3JDQSxTQUFNLENBQUMsY0FBYyxDQUFDO0dBQ3ZCLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7O0NBWUosQ0FBQzs7QUN2RFUsTUFBQyxrQkFBa0IsR0FBRyxlQUFlLEtBQUs7RUFDcEQsbUJBQW1CLEVBQUUsbUJBQW1CLENBQUMsZUFBZSxDQUFDO0VBQ3pELHFCQUFxQixFQUFFLHFCQUFxQixDQUFDLGVBQWUsQ0FBQztFQUM3RCx1QkFBdUIsRUFBRSxlQUFlLENBQUMsdUJBQXVCO0VBQ2hFLHFCQUFxQixFQUFFLHdCQUF3QixDQUFDLGVBQWUsQ0FBQztFQUNoRSwwQkFBMEIsRUFBRSwwQkFBMEIsQ0FBQyxlQUFlLENBQUM7Q0FDeEUsQ0FBQyxDQUFDOztBQUVILE1BQU0sd0JBQXdCLEdBQUcsZUFBZSxJQUFJLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFakcsTUFBTSwwQkFBMEIsR0FBRyxlQUFlLElBQUksQ0FBQyxhQUFhLEVBQUUsVUFBVSxLQUFLLGVBQWUsQ0FBQyxrQkFBa0I7RUFDckgsYUFBYSxFQUFFLFVBQVU7Q0FDMUIsQ0FBQzs7QUFFRixNQUFNLG1CQUFtQixHQUFHLGVBQWUsSUFBSSxZQUFZLE1BQU0sZUFBZSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFekcsTUFBTSxxQkFBcUIsR0FBRyxlQUFlLElBQUksT0FBTyxhQUFhLEVBQUUsVUFBVSxLQUFLO0VBQ3BGLElBQUksU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDLEVBQUU7RUFDM0YsSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUMsRUFBRTs7RUFFckYsT0FBTyxNQUFNLGVBQWUsQ0FBQyxhQUFhO0lBQ3hDLGFBQWE7SUFDYixVQUFVO0dBQ1gsQ0FBQztDQUNILENBQUM7O0FDVlUsTUFBQyxVQUFVLEdBQUcsT0FBTyxLQUFLLEVBQUUsZ0JBQWdCLEdBQUcsSUFBSTtnQ0FDL0IsbUJBQW1CLEdBQUcsSUFBSTtnQ0FDMUIsWUFBWSxHQUFHLElBQUk7Z0NBQ25CLE1BQU0sR0FBRyxJQUFJO2dDQUNiLGFBQWEsR0FBRyxJQUFJLEtBQUs7O0lBRXJELEtBQUssR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7O0lBRTlCLEdBQUcsQ0FBQyxhQUFhO1FBQ2IsYUFBYSxHQUFHLE1BQU0sd0JBQXdCLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQzs7SUFFNUQsR0FBRyxDQUFDLGdCQUFnQjtRQUNoQixnQkFBZ0IsR0FBRyxNQUFNLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDOztJQUV4RCxNQUFNLGVBQWUsR0FBRyxxQkFBcUIsRUFBRSxDQUFDOztJQUVoRCxNQUFNLEdBQUcsR0FBRztRQUNSLFNBQVMsQ0FBQyxLQUFLO1FBQ2YsTUFBTTtRQUNOLE9BQU8sQ0FBQyxlQUFlLENBQUMsT0FBTztRQUMvQixTQUFTLENBQUMsYUFBYSxDQUFDLFNBQVM7UUFDakMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPO0tBQ2hDLENBQUM7O0lBRUYsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztJQUV4QyxHQUFHLENBQUMsbUJBQW1CLEdBQUcsV0FBVyxDQUFDLG1CQUFtQixDQUFDO2dDQUM5QixtQkFBbUI7Z0NBQ25CLFlBQVksTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7O0lBRTNELEdBQUcsQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQzt5QkFDdkIsWUFBWTt5QkFDWixZQUFZLENBQUMsSUFBSSxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQzs7SUFFeEQsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLE1BQU0sYUFBYSxHQUFHLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsQyxNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEMsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztJQUV0QyxNQUFNLGNBQWMsR0FBRyxPQUFPLFFBQVEsRUFBRSxRQUFRLEtBQUs7UUFDakQsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLE9BQU8sQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzdELENBQUM7O0lBRUYsTUFBTSxjQUFjLEdBQUcsTUFBTTtRQUN6QixHQUFHLENBQUMsSUFBSSxHQUFHO1lBQ1AsSUFBSSxFQUFFLEtBQUs7WUFDWCxXQUFXLEdBQUcsdUJBQXVCLENBQUMsR0FBRyxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxLQUFLO1lBQ1osSUFBSSxDQUFDLEtBQUs7VUFDYjtLQUNKLENBQUM7O0lBRUYsTUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFJLEtBQUs7UUFDckIsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFJO0tBQ2xCLENBQUM7Ozs7SUFJRixJQUFJLElBQUksR0FBRztRQUNQLFNBQVM7UUFDVCxXQUFXO1FBQ1gsYUFBYTtRQUNiLFFBQVE7UUFDUixPQUFPO1FBQ1AsVUFBVTtRQUNWLFNBQVMsRUFBRSxlQUFlLENBQUMsU0FBUztRQUNwQyxjQUFjO1FBQ2QsY0FBYztRQUNkLE1BQU07S0FDVCxDQUFDOztJQUVGLElBQUksQ0FBQyxPQUFPLEdBQUcsaUJBQWlCO1FBQzVCLGVBQWUsQ0FBQyxTQUFTO1FBQ3pCLGdCQUFnQjtRQUNoQixhQUFhLENBQUMsT0FBTztRQUNyQixhQUFhLENBQUMsUUFBUTtRQUN0QixJQUFJLENBQUMsQ0FBQzs7O0lBR1YsT0FBTyxJQUFJLENBQUM7Q0FDZjs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
