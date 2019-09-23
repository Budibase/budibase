import { union, reduce, isUndefined, cloneDeep, split, some, map, filter, isEmpty as isEmpty$1, countBy, includes as includes$1, last, find, constant as constant$1, take, first, intersection, mapValues, isNull as isNull$1, has as has$1, isNumber as isNumber$1, isString as isString$1, isBoolean as isBoolean$1, isDate as isDate$1, isArray as isArray$2, isObject, clone, values, keyBy, keys as keys$1, orderBy, concat, reverse, difference, merge as merge$1, flatten, each, pull, join as join$2, max, defaultCase as defaultCase$1, uniqBy, every, uniqWith, isFunction as isFunction$1, groupBy, differenceBy, intersectionBy, isEqual } from 'lodash/fp';
import { generate } from 'shortid';
import _, { toNumber, flow, isArray as isArray$1, join as join$1, replace, trim, dropRight, head, takeRight, isUndefined as isUndefined$1, isNull, isNaN as isNaN$1, reduce as reduce$1, isEmpty, constant, tail, includes, startsWith, findIndex, isInteger, isDate, isString, split as split$1, cloneDeep as cloneDeep$1, keys, isFunction, merge, has, isBoolean, isNumber, isObjectLike, assign, some as some$1, each as each$1, find as find$1, orderBy as orderBy$1, union as union$1 } from 'lodash';
import { compileCode as compileCode$1, compileExpression as compileExpression$1 } from '@nx-js/compiler-util';
import lunr from 'lunr';
import { Buffer as Buffer$1 } from 'safe-buffer';

const commonPlus = extra => union(['onBegin', 'onComplete', 'onError'])(extra);

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
    _events[areaKey][methodKey] = reduce((obj, s) => {
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
  const callId = generate();

  const createCallStack = () => ({
    seedCallId: !isUndefined(seedCallId)
      ? seedCallId
      : callId,
    threadCallId: callId,
    stack: [],
  });

  if (isUndefined(app.calls)) {
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
  const ctx = cloneDeep(eventContext);
  ctx.error = err;
  ctx.elapsed = elapsed();
  await app.publish(
    eventNamespace.onError,
    ctx,
  );
  popCallStack(app);
};

const publishComplete = async (app, eventContext, eventNamespace, elapsed, result) => {
  const endcontext = cloneDeep(eventContext);
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
  split(':'),
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
const $$ = (...funcs) => arg => flow(funcs)(arg);

// this is the pipe function
const $ = (arg, funcs) => $$(...funcs)(arg);

const keySep = '/';
const trimKeySep = str => trim(str, keySep);
const splitByKeySep = str => split$1(str, keySep);
const safeKey = key => replace(`${keySep}${trimKeySep(key)}`, `${keySep}${keySep}`, keySep);
const joinKey = (...strs) => {
  const paramsOrArray = strs.length === 1 & isArray$1(strs[0])
    ? strs[0] : strs;
  return safeKey(join$1(paramsOrArray, keySep));
};
const splitKey = $$(trimKeySep, splitByKeySep);
const getDirFomKey = $$(splitKey, dropRight, p => joinKey(...p));
const getFileFromKey = $$(splitKey, takeRight, head);

const configFolder = `${keySep}.config`;
const fieldDefinitions = joinKey(configFolder, 'fields.json');
const templateDefinitions = joinKey(configFolder, 'templates.json');
const appDefinitionFile = joinKey(configFolder, 'appDefinition.json');
const dirIndex = folderPath => joinKey(configFolder, 'dir', ...splitKey(folderPath), 'dir.idx');
const getIndexKeyFromFileKey = $$(getDirFomKey, dirIndex);

const ifExists = (val, exists, notExists) => (isUndefined$1(val)
  ? isUndefined$1(notExists) ? (() => { })() : notExists()
  : exists());

const getOrDefault = (val, defaultVal) => ifExists(val, () => val, () => defaultVal);

const not = func => val => !func(val);
const isDefined = not(isUndefined$1);
const isNonNull = not(isNull);
const isNotNaN = not(isNaN$1);

const allTrue = (...funcArgs) => val => reduce$1(funcArgs,
  (result, conditionFunc) => (isNull(result) || result == true) && conditionFunc(val),
  null);

const anyTrue = (...funcArgs) => val => reduce$1(funcArgs,
  (result, conditionFunc) => result == true || conditionFunc(val),
  null);

const insensitiveEquals = (str1, str2) => str1.trim().toLowerCase() === str2.trim().toLowerCase();

const isSomething = allTrue(isDefined, isNonNull, isNotNaN);
const isNothing = not(isSomething);
const isNothingOrEmpty = v => isNothing(v) || isEmpty(v);
const somethingOrGetDefault = getDefaultFunc => val => (isSomething(val) ? val : getDefaultFunc());
const somethingOrDefault = (val, defaultVal) => somethingOrGetDefault(constant(defaultVal))(val);

const mapIfSomethingOrDefault = (mapFunc, defaultVal) => val => (isSomething(val) ? mapFunc(val) : defaultVal);

const mapIfSomethingOrBlank = mapFunc => mapIfSomethingOrDefault(mapFunc, '');

const none = predicate => collection => !some(predicate)(collection);

const all = predicate => collection => none(v => !predicate(v))(collection);

const isNotEmpty = ob => !isEmpty(ob);
const isNonEmptyArray = allTrue(isArray$1, isNotEmpty);
const isNonEmptyString = allTrue(isString, isNotEmpty);
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

const handleErrorWith = returnValInError => tryOr(constant(returnValInError));

const handleErrorWithUndefined = handleErrorWith(undefined);

const switchCase = (...cases) => (value) => {
  const nextCase = () => head(cases)[0](value);
  const nextResult = () => head(cases)[1](value);

  if (isEmpty(cases)) return; // undefined
  if (nextCase() === true) return nextResult();
  return switchCase(...tail(cases))(value);
};

const isValue = val1 => val2 => (val1 === val2);
const isOneOf = (...vals) => val => includes(vals, val);
const defaultCase = constant(true);
const memberMatches = (member, match) => obj => match(obj[member]);


const StartsWith = searchFor => searchIn => startsWith(searchIn, searchFor);

const contains = val => array => (findIndex(array, v => v === val) > -1);

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

const isSafeInteger = n => isInteger(n)
    && n <= Number.MAX_SAFE_INTEGER
    && n >= 0 - Number.MAX_SAFE_INTEGER;

const toDateOrNull = s => (isNull(s) ? null
  : isDate(s) ? s : new Date(s));
const toBoolOrNull = s => (isNull(s) ? null
  : s === 'true' || s === true);
const toNumberOrNull = s => (isNull(s) ? null
  : toNumber(s));

const isArrayOfString = opts => isArray$1(opts) && all(isString)(opts);

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

const stringNotEmpty = s => isSomething(s) && s.trim().length > 0;

const makerule = (field, error, isValid) => ({ field, error, isValid });

const validationError = (rule, item) => ({ ...rule, item });

const applyRuleSet = ruleSet => itemToValidate => $(ruleSet, [
  map(applyRule(itemToValidate)),
  filter(isSomething),
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

const compileFilter = index => compileExpression$1(index.filter);

const compileMap = index => compileCode$1(index.map);

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
  const recordClone = cloneDeep$1(record);
  const context = { record: recordClone };

  const map = index.map ? index.map : 'return {...record};';

  const compiledMap = defineError(
    () => compileCode$1(map),
    mapCompile,
  );

  const mapped = defineError(
    () => compiledMap(context),
    mapEval,
  );

  const mappedKeys = keys(mapped);
  for (let i = 0; i < mappedKeys.length; i++) {
    const key = mappedKeys[i];
    mapped[key] = isUndefined$1(mapped[key]) ? null : mapped[key];
    if (isFunction(mapped[key])) {
      delete mapped[key];
    }
  }

  mapped.key = record.key;
  mapped.sortKey = index.getSortKey
    ? compileCode$1(index.getSortKey)(context)
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
    index => isEmpty$1(index.name)
                || countBy('name')(index.parent().indexes)[index.name] === 1),
  makerule('indexType', 'reference index may only exist on a record node',
    index => isRecord(index.parent())
                  || index.indexType !== indexTypes.reference),
  makerule('indexType', `index type must be one of: ${join$1(', ', keys(indexTypes))}`,
    index => includes$1(index.indexType)(keys(indexTypes))),
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

    const unionIfAny = l2 => l1 => union(l1)(!l2 ? [] : l2);

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

const getLastPartInKey = key => last(splitKey(key));

const getNodesInPath = appHierarchy => key => $(appHierarchy, [
  getFlattenedHierarchy,
  filter(n => new RegExp(`${n.pathRegx()}`).test(key)),
]);

const getExactNodeForPath = appHierarchy => key => $(appHierarchy, [
  getFlattenedHierarchy,
  find(n => new RegExp(`${n.pathRegx()}$`).test(key)),
]);

const getNodeForCollectionPath = appHierarchy => collectionKey => $(appHierarchy, [
  getFlattenedHierarchy,
  find(n => (isCollectionRecord(n)
                   && new RegExp(`${n.collectionPathRegx()}$`).test(collectionKey))),
]);

const hasMatchingAncestor = ancestorPredicate => decendantNode => switchCase(

  [node => isNothing(node.parent()),
    constant$1(false)],

  [node => ancestorPredicate(node.parent()),
    constant$1(true)],

  [defaultCase,
    node => hasMatchingAncestor(ancestorPredicate)(node.parent())],

)(decendantNode);

const getNode = (appHierarchy, nodeKey) => $(appHierarchy, [
  getFlattenedHierarchy,
  find(n => n.nodeKey() === nodeKey
                  || (isCollectionRecord(n)
                      && n.collectionNodeKey() === nodeKey)),
]);

const getCollectionNode = (appHierarchy, nodeKey) => $(appHierarchy, [
  getFlattenedHierarchy,
  find(n => (isCollectionRecord(n)
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
  take(splitKey(parentNodeKey).length),
  ks => joinKey(...ks),
]);

const getParentKey = (key) => {
  return $(key, [
    splitKey,
    take(splitKey(key).length - 1),
    joinKey,
  ]);
};

const isKeyAncestorOf = ancestorKey => decendantNode => hasMatchingAncestor(p => p.nodeKey() === ancestorKey)(decendantNode);

const hasNoMatchingAncestors = parentPredicate => node => !hasMatchingAncestor(parentPredicate)(node);

const findField = (recordNode, fieldName) => find(f => f.name == fieldName)(recordNode.fields);

const isAncestor = decendant => ancestor => isKeyAncestorOf(ancestor.nodeKey())(decendant);

const isDecendant = ancestor => decendant => isAncestor(decendant)(ancestor);

const getRecordNodeId = recordKey => $(recordKey, [
  splitKey,
  last,
  getRecordNodeIdFromId,
]);

const getRecordNodeIdFromId = recordId => $(recordId, [split('-'), first, parseInt]);

const getRecordNodeById = (hierarchy, recordId) => $(hierarchy, [
  getFlattenedHierarchy,
  find(n => isRecord(n)
                    && n.nodeId === getRecordNodeIdFromId(recordId)),
]);

const recordNodeIdIsAllowed = indexNode => nodeId => indexNode.allowedRecordNodeIds.length === 0
    || includes$1(nodeId)(indexNode.allowedRecordNodeIds);

const recordNodeIsAllowed = indexNode => recordNode => recordNodeIdIsAllowed(indexNode)(recordNode.nodeId);

const getAllowedRecordNodesForIndex = (appHierarchy, indexNode) => {
  const recordNodes = $(appHierarchy, [
    getFlattenedHierarchy,
    filter(isRecord),
  ]);

  if (isGlobalIndex(indexNode)) {
    return $(recordNodes, [
      filter(recordNodeIsAllowed(indexNode)),
    ]);
  }

  if (isAncestorIndex(indexNode)) {
    return $(recordNodes, [
      filter(isDecendant(indexNode.parent())),
      filter(recordNodeIsAllowed(indexNode)),
    ]);
  }

  if (isReferenceIndex(indexNode)) {
    return $(recordNodes, [
      filter(n => some(fieldReversesReferenceToIndex(indexNode))(n.fields)),
    ]);
  }
};

const getNodeFromNodeKeyHash = hierarchy => hash => $(hierarchy, [
  getFlattenedHierarchy,
  find(n => getHashCode(n.nodeKey()) === hash),
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
    && intersection(field.typeOptions.reverseIndexNodeKeys)(map(i => i.nodeKey())(node.indexes))
      .length > 0;

const fieldReversesReferenceToIndex = indexNode => field => field.type === 'reference'
    && intersection(field.typeOptions.reverseIndexNodeKeys)([indexNode.nodeKey()])
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
  if (has(record, field.name)) {
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
  const getInitialValue = isUndefined(field) || isUndefined(field.getInitialValue)
    ? 'default'
    : field.getInitialValue;

  return has(defaultValueFunctions, getInitialValue)
    ? defaultValueFunctions[getInitialValue]()
    : getSafeValueParser(tryParse, defaultValueFunctions)(getInitialValue);
};

const typeFunctions = specificFunctions => merge({
  value: constant$1,
  null: constant$1(null),
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

const getDefaultOptions = mapValues(v => v.defaultValue);

const makerule$1 = (isValid, getMessage) => ({ isValid, getMessage });
const parsedFailed = val => ({ success: false, value: val });
const parsedSuccess = val => ({ success: true, value: val });
const getDefaultExport = (name, tryParse, functions, options, validationRules, sampleValue, stringify) => ({
  getNew: getNewValue(tryParse, functions),
  safeParseField: getSafeFieldParser(tryParse, functions),
  safeParseValue: getSafeValueParser(tryParse, functions),
  tryParse,
  name,
  getDefaultOptions: () => getDefaultOptions(cloneDeep(options)),
  optionDefinitions: options,
  validateTypeConstraints: validateTypeConstraints(validationRules),
  sampleValue,
  stringify: val => (val === null || val === undefined
    ? '' : stringify(val)),
  getDefaultValue: functions.default,
});

const stringFunctions = typeFunctions({
  default: constant(null),
});

const stringTryParse = switchCase(
  [isString, parsedSuccess],
  [isNull, parsedSuccess],
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
    isValid: isBoolean,
    requirementDescription: 'allowDeclaredValuesOnly must be true or false',
    parse: toBoolOrNull,
  },
};

const typeConstraints = [
  makerule$1(async (val, opts) => val === null || opts.maxLength === null || val.length <= opts.maxLength,
    (val, opts) => `value exceeds maximum length of ${opts.maxLength}`),
  makerule$1(async (val, opts) => val === null
                           || opts.allowDeclaredValuesOnly === false
                           || includes(opts.values, val),
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
  default: constant(null),
});

const boolTryParse = switchCase(
  [isBoolean, parsedSuccess],
  [isNull, parsedSuccess],
  [isOneOf('true', '1', 'yes', 'on'), () => parsedSuccess(true)],
  [isOneOf('false', '0', 'no', 'off'), () => parsedSuccess(false)],
  [defaultCase, parsedFailed],
);

const options$1 = {
  allowNulls: {
    defaultValue: true,
    isValid: isBoolean,
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
  default: constant(null),
});

const parseStringtoNumberOrNull = (s) => {
  const num = Number(s);
  return isNaN(num) ? parsedFailed(s) : parsedSuccess(num);
};

const numberTryParse = switchCase(
  [isNumber, parsedSuccess],
  [isString, parseStringtoNumberOrNull],
  [isNull, parsedSuccess],
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
  default: constant(null),
  now: () => new Date(),
});

const isValidDate = d => d instanceof Date && !isNaN(d);

const parseStringToDate = s => switchCase(
  [isValidDate, parsedSuccess],
  [defaultCase, parsedFailed],
)(new Date(s));


const dateTryParse = switchCase(
  [isDate, parsedSuccess],
  [isString, parseStringToDate],
  [isNull, parsedSuccess],
  [defaultCase, parsedFailed],
);

const options$3 = {
  maxValue: {
    defaultValue: new Date(32503680000000),
    isValid: isDate,
    requirementDescription: 'must be a valid date',
    parse: toDateOrNull,
  },
  minValue: {
    defaultValue: new Date(-8520336000000),
    isValid: isDate,
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
  default: constant([]),
});

const mapToParsedArrary = type => $$(
  map(i => type.safeParseValue(i)),
  parsedSuccess,
);

const arrayTryParse = type => switchCase(
  [isArray$1, mapToParsedArrary(type)],
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

const hasStringValue = (ob, path) => has(ob, path)
    && isString(ob[path]);

const isObjectWithKey = v => isObjectLike(v)
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
  [isString, tryParseFromString],
  [isNull, () => parsedSuccess(referenceNothing())],
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

const isEmptyString = s => isString(s) && isEmpty(s);

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
    && intersection(fn.split(''))(illegalCharacters.split('')).length === 0
    && none(f => f === '..')(splitKey(filePath));
};

const fileNothing = () => ({ relativePath: '', size: 0 });

const fileFunctions = typeFunctions({
  default: fileNothing,
});

const fileTryParse = v => switchCase(
  [isValidFile, parsedSuccess],
  [isNull$1, () => parsedSuccess(fileNothing())],
  [defaultCase, parsedFailed],
)(v);

const fileName = filePath => $(filePath, [
  splitKey,
  last,
]);

const isValidFile = f => !isNull$1(f)
    && has$1('relativePath')(f) && has$1('size')(f)
    && isNumber$1(f.size)
    && isString$1(f.relativePath)
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
    keys,
    map((k) => {
      const kvType = {};
      const concreteArray = array(basicTypes[k]);
      kvType[concreteArray.name] = concreteArray;
      return kvType;
    }),
    types => assign({}, ...types),
  ]);

  return merge({}, basicTypes, arrays);
};


const all$1 = allTypes();

const getType = (typeName) => {
  if (!has(all$1, typeName)) throw new BadRequestError(`Do not recognise type ${typeName}`);
  return all$1[typeName];
};

const getSampleFieldValue = field => getType(field.type).sampleValue;

const getNewFieldValue = field => getType(field.type).getNew(field);

const safeParseField = (field, record) => getType(field.type).safeParseField(field, record);

const validateFieldParse = (field, record) => (has(record, field.name)
  ? getType(field.type).tryParse(record[field.name])
  : parsedSuccess(undefined)); // fields may be undefined by default

const getDefaultOptions$1 = type => getType(type).getDefaultOptions();

const validateTypeConstraints$1 = async (field, record, context) => await getType(field.type).validateTypeConstraints(field, record, context);

const detectType = (value) => {
  if (isString$1(value)) return string;
  if (isBoolean$1(value)) return bool;
  if (isNumber$1(value)) return number;
  if (isDate$1(value)) return datetime;
  if (isArray$2(value)) return array(detectType(value[0]));
  if (isObject(value)
       && has(value, 'key')
       && has(value, 'value')) return reference;
  if (isObject(value)
        && has(value, 'relativePath')
        && has(value, 'size')) return file;

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
  find(u => u.name.toLowerCase() === name.toLowerCase()),
]);

const stripUserOfSensitiveStuff = (user) => {
  const stripped = clone(user);
  delete stripped.tempCode;
  return stripped;
};

const parseTemporaryCode = fullCode => $(fullCode, [
  split(':'),
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
    values,
    includes$1(permissionType),
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
    some(permMatchesResource),
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
    keyBy('name'),
    mapValues(getFieldValue),
  ]);

  record.id = `${recordNode.nodeId}-${generate()}`;
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
    keyBy('name'),
    mapValues(f => safeParseField(f, storedData)),
  ]);

  const newKeyStack = [...keyStack, key];

  const references = $(recordNode.fields, [
    filter(f => f.type === 'reference'
                    && isNonEmptyString(loadedRecord[f.name].key)
                    && !includes$1(loadedRecord[f.name].key)(newKeyStack)),
    map(f => ({
      promise: _load(app, loadedRecord[f.name].key, newKeyStack),
      index: getNode(app.hierarchy, f.typeOptions.indexNodeKey),
      field: f,
    })),
  ]);

  if (references.length > 0) {
    const refRecords = await Promise.all(
      map(p => p.promise)(references),
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
  loadedRecord.id = $(key, [splitKey, last]);
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
    const shardNameFunc = compileCode$1(indexNode.getShardName);
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
    filter(k => (startRecord === null || k >= startShardName)
                    && (endRecord === null || k <= endShardName)),
    map(k => joinKey(indexKey, `${k}.csv`)),
  ]);
};

const ensureShardNameIsInShardMap = async (store, indexKey, indexedDataKey) => {
  const map = await getShardMap(store, indexKey);
  const shardName = shardNameFromKey(indexedDataKey);
  if (!includes$1(shardName)(map)) {
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
  last,
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
    map(n => mapRecord(createSampleRecord(n), indexNode)),
  ]);

  // always has record key and sort key
  const schema = {
    sortKey: all$1.string,
    key: all$1.string,
  };

  const fieldsHas = has$1(schema);
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
    keys$1,
    map(k => ({ name: k, type: schema[k].name })),
    filter(s => s.name !== 'sortKey'),
    orderBy('name', ['desc']), // reverse aplha
    concat([{ name: 'sortKey', type: all$1.string.name }]), // sortKey on end
    reverse, // sortKey first, then rest are alphabetical
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
            const updated = find(i => indexedItem.key === i.key)(itemsToWrite);
            const removed = find(k => indexedItem.key === k)(keysToRemove);
            
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
        const toAdd = difference(itemsToWrite, writtenItems);
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

        if(isString$1(text) && currentBuffer === null)
            currentBuffer = Buffer$1.from(text, "utf8");
        else if(isString$1(text))
            currentBuffer = Buffer$1.concat([
                currentBuffer,
                Buffer$1.from(text, "utf8")
            ]);
        
        if(currentBuffer !== null &&
            (currentBuffer.length > flushBoundary
             || !isString$1(text))) {

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
        const remainingBuffer = Buffer$1.from(remainingBytes);

        if(!nextBytesBuffer) nextBytesBuffer = Buffer$1.from([]);

        const moreToRead = nextBytesBuffer.length === BUFFER_MAX_BYTES;

        const buffer = Buffer$1.concat(
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
        const value = has$1(prop.name)(item)
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
    merge$1(options),
    merge$1(defaultOptions),
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
    return flatten(items);
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
    if (!has(cachedReferenceIndexes, typeOptions.indexNodeKey)) {
      cachedReferenceIndexes[typeOptions.indexNodeKey] = {
        typeOptions,
        data: await readReferenceIndex(
          app, recordKey, typeOptions,
        ),
      };
    }

    return cachedReferenceIndexes[typeOptions.indexNodeKey];
  };

  const getTypeOptions = typeOptions_or_fieldName => (isString$1(typeOptions_or_fieldName)
    ? findField(recordNode, typeOptions_or_fieldName)
      .typeOptions
    : typeOptions_or_fieldName);

  return {
    referenceExists: async (typeOptions_or_fieldName, key) => {
      const typeOptions = getTypeOptions(typeOptions_or_fieldName);
      const { data } = await lazyLoadReferenceIndex(typeOptions);
      return some$1(data, i => i.key === key);
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
    map(i => ({
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
  map(f => ({ name: f.name, parseResult: validateFieldParse(f, record) })),
  reduce((errors, f) => {
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
      filter(isNonEmptyString),
      map(m => ({ message: m, fields: [field.name] })),
      each(e => errors.push(e)),
    ]);
  }
  return errors;
};

const runRecordValidationRules = (record, recordNode) => {
  const runValidationRule = (rule) => {
    const isValid = compileExpression$1(rule.expressionWhenValid);
    const expressionContext = { record, _ };
    return (isValid(expressionContext)
      ? { valid: true }
      : ({
        valid: false,
        fields: rule.invalidFields,
        message: rule.messageWhenInvalid,
      }));
  };

  return $(recordNode.validationRules, [
    map(runValidationRule),
    flatten,
    filter(r => r.valid === false),
    map(r => ({ fields: r.fields, message: r.message })),
  ]);
};

const validate = app => async (record, context) => {
  context = isNothing(context)
    ? _getContext(app, record.key)
    : context;

  const recordNode = getExactNodeForPath(app.hierarchy)(record.key);
  const fieldParseFails = validateAllFieldParse(record, recordNode);

  // non parsing would cause further issues - exit here
  if (!isEmpty$1(fieldParseFails)) { return ({ isValid: false, errors: fieldParseFails }); }

  const recordValidationRuleFails = runRecordValidationRules(record, recordNode);
  const typeContraintFails = await validateAllTypeConstraints(record, recordNode, context);

  if (isEmpty$1(fieldParseFails)
       && isEmpty$1(recordValidationRuleFails)
       && isEmpty$1(typeContraintFails)) {
    return ({ isValid: true, errors: [] });
  }

  return ({
    isValid: false,
    errors: _.union(fieldParseFails, typeContraintFails, recordValidationRuleFails),
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
    filter(rootCollectionRecord),
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
    filter(isCollectionRecord),
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
    map(i => map(c => _allIdsShardKey(collectionKey, i, c))(allIdsStringsForFactor(collectionRecordNode))),
    flatten,
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
    find(i => i.includes(idFirstChar)),
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
    filter(isCollectionRecord),
    filter(n => isAncestor(targetNode)(n)
                    || n.nodeKey() === targetNode.nodeKey()),
    orderBy([n => n.nodeKey().length], ['asc']),
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

    return flatten(allIterators);
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
    pull(record.id),
    join$2(','),
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
  const uniqueId = generate();
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
  const recordClone = cloneDeep(record);
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

  const returnedClone = cloneDeep(recordClone);
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
    map(f => $(f.typeOptions.reverseIndexNodeKeys, [
      map(n => getNode(
        app.hierarchy,
        n,
      )),
    ])),
    flatten,
  ]);

  for (const indexNode of indexNodes) {
    await initialiseIndex(
      app.datastore, record.key, indexNode,
    );
  }
};

const fieldsThatReferenceThisRecord = (app, recordNode) => $(app.hierarchy, [
  getFlattenedHierarchy,
  filter(isRecord),
  map(n => n.fields),
  flatten,
  filter(fieldReversesReferenceToNode(recordNode)),
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

    if (includes$1(shardKey)(deletedAllIdsShards)) {
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

  const tempFilePath = `${fullFilePath}_${generate()}.temp`;

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
    filter(f => f.type === 'file'
      && record[f.name].relativePath === relativeFilePath
      && record[f.name].size !== expectedSize),
    map(f => f.name),
  ]);

  const incorrectFileArrayFields = $(recordNode.fields, [
    filter(a => a.type === 'array<file>'
      && $(record[a.name], [
        some(f => record[f.name].relativePath === relativeFilePath
          && record[f.name].size !== expectedSize),
      ])),
    map(f => f.name),
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

  if (includes$1('..')(pathParts)) naughtyUser();

  const recordKeyParts = splitKey(recordKey);

  const fullPathParts = [
    ...recordKeyParts,
    'files',
    ...filter(p => p !== '.')(pathParts),
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
    find(n => n.name === nodeName),
  ]);

  if (!node) throw new NotFoundError(`Cannot find node ${nodeName}`);

  return `${node.nodeId}-${id}`;
};

const setCustomId = app => (record, id) => {
  record.id = customId(app)(record.type, id);

  const keyParts = splitKey(record.key);

  record.key = $(keyParts, [
    take(keyParts.length - 1),
    union([record.id]),
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
    filter(n => isRecord(n)
                    && some(fieldReversesReferenceToIndex(indexNode))(n.fields)),
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

const recordNodeApplies = indexNode => recordNode => includes$1(recordNode.nodeId)(indexNode.allowedRecordNodeIds);

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
      totals[aggGroupDef][grouping] = isUndefined(groupingTotal)
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
    const value = compileCode$1(agg.aggregatedValue)({ record: item });

    if (!isNumber$1(value)) return existing;

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
    if (!has$1(aggGroup.name)(result)) {
      result[aggGroup.name] = {};
    }

    const thisGroupResult = result[aggGroup.name];

    if (isNonEmptyString(aggGroup.condition)) {
      if (!compileExpression$1(aggGroup.condition)({ record: item })) {
        continue;
      }
    }

    let group = isNonEmptyString(aggGroup.groupBy)
      ? compileCode$1(aggGroup.groupBy)({ record: item })
      : 'all';
    if (!isNonEmptyString(group)) {
      group = '(none)';
    }

    if (!has$1(group)(thisGroupResult)) {
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
    constant('/')],

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
  node.parent = constant(parent);
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
      const defaultIndex = find$1(
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
    map(n => n.nodeId),
    max]) + 1);
};

const constructHierarchy = (node, parent) => {
  construct(parent)(node);
  if (node.indexes) {
    each$1(node.indexes,
      child => constructHierarchy(child, node));
  }
  if (node.aggregateGroups) {
    each$1(node.aggregateGroups,
      child => constructHierarchy(child, node));
  }
  if (node.children && node.children.length > 0) {
    each$1(node.children,
      child => constructHierarchy(child, node));
  }
  if (node.fields) {
    each$1(node.fields,
      f => each$1(f.typeOptions, (val, key) => {
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

const allowedTypes = () => keys$1(all$1);

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
             || countBy('name')(allFields)[f.name] === 1),
  makerule('type', 'type is unknown',
    f => isNothingOrEmpty(f.type)
             || some(t => f.type === t)(allowedTypes())),
];

const typeOptionsRules = (field) => {
  const type = all$1[field.type];
  if (isNothing(type)) return [];

  const def = optName => type.optionDefinitions[optName];

  return $(field.typeOptions, [
    keys$1,
    filter(o => isSomething(def(o))
                    && isSomething(def(o).isValid)),
    map(o => makerule(
      `typeOptions.${o}`,
      `${def(o).requirementDescription}`,
      field => def(o).isValid(field.typeOptions[o]),
    )),
  ]);
};

const validateField = allFields => (field) => {
  const everySingleField = includes$1(field)(allFields) ? allFields : [...allFields, field];
  return applyRuleSet([...fieldRules(everySingleField), ...typeOptionsRules(field)])(field);
};

const validateAllFields = recordNode => $(recordNode.fields, [
  map(validateField(recordNode.fields)),
  flatten,
]);

const addField = (recordTemplate, field) => {
  if (isNothingOrEmpty(field.label)) {
    field.label = field.name;
  }
  const validationMessages = validateField([...recordTemplate.fields, field])(field);
  if (validationMessages.length > 0) {
    const errors = map(m => m.error)(validationMessages);
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
  [isNumber$1, v => v.toString()],
  [isBoolean$1, v => v.toString()],
  [defaultCase$1, v => `'${v}'`],
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
    a => isEmpty(a.aggregatedValue)
            || executesWithoutException(
              () => compileCode$1(a.aggregatedValue),
            )),
];

const validateAggregate = aggregate => applyRuleSet(aggregateRules)(aggregate);

const validateAllAggregates = all => $(all, [
  map(validateAggregate),
  flatten,
]);

const ruleSet = (...sets) => constant$1(flatten([...sets]));

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
    node => every(r => has(r, 'messageWhenInvalid'))(node.validationRules)),
  makerule('validationRules', "validation rule is missing a 'expressionWhenValid' member",
    node => every(r => has(r, 'expressionWhenValid'))(node.validationRules)),
];


const aggregateGroupRules = [
  makerule('condition', 'condition does not compile',
    a => isEmpty$1(a.condition)
             || executesWithoutException(
               () => compileExpression$1(a.condition),
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
    n => filter(f => f.parent() === n.parent()
                          && f.name === n.name)(flattened).length === 1,
  );

  const duplicateNodeKeyErrors = $(flattened, [
    map(n => applyRuleSet([duplicateNameRule])(n)),
    filter(isSomething),
    flatten,
  ]);

  const fieldErrors = $(flattened, [
    filter(isRecord),
    map(validateAllFields),
    flatten,
  ]);

  const aggregateErrors = $(flattened, [
    filter(isaggregateGroup),
    map(s => validateAllAggregates(
      s.aggregates,
    )),
    flatten,
  ]);

  return $(flattened, [
    map(validateNode),
    flatten,
    union(duplicateNodeKeyErrors),
    union(fieldErrors),
    union(aggregateErrors),
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
    filter(a => filter(a2 => a2.name === a.name)(allActions).length > 1),
    map(a => validationError(duplicateActionRule, a)),
  ]);

  const errors = $(allActions, [
    map(validateAction),
    flatten,
    union(duplicateActions),
    uniqBy('name'),
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
             || some(a => a.name === t.actionName)(actions)),
  makerule('eventName', 'invalid Event Name',
    t => !t.eventName
             || includes$1(t.eventName)(eventsList)),
  makerule('optionsCreator', 'Options Creator does not compile - check your expression',
    (t) => {
      if (!t.optionsCreator) return true;
      try {
        compileCode$1(t.optionsCreator);
        return true;
      } catch (_) { return false; }
    }),
  makerule('condition', 'Trigger condition does not compile - check your expression',
    (t) => {
      if (!t.condition) return true;
      try {
        compileExpression$1(t.condition);
        return true;
      } catch (_) { return false; }
    }),
]);

const validateTrigger = (trigger, allActions) => {
  const errors = applyRuleSet(triggerRules(allActions))(trigger);

  return errors;
};

const validateTriggers = (triggers, allActions) => $(triggers, [
  map(t => validateTrigger(t, allActions)),
  flatten,
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
    throw new Error(`Hierarchy is invalid: ${join$1(
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

    const actionValidErrs = map(e => e.error)(validateActions(actions));

    if (actionValidErrs.length > 0) {
      throw new BadRequestError(`Actions are invalid: ${join$1(actionValidErrs, ', ')}`);
    }

    const triggerValidErrs = map(e => e.error)(validateTriggers(triggers, actions));

    if (triggerValidErrs.length > 0) {
      throw new BadRequestError(`Triggers are invalid: ${join$1(triggerValidErrs, ', ')}`);
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
  map(stripUserOfSensitiveStuff),
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
    find(u => u.temporaryAccessId === temp.id),
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

  const tempCode = !temp.code ? generate() : temp.code;
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
    filter(l => some(ua => l.name === ua)(userAccessLevels)),
    map(l => l.permissions),
    flatten,
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
  const tempCode = generate()
        + generate()
        + generate()
        + generate();

  const tempId = generate();

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
    u => filter(u2 => insensitiveEquals(u2.name, u.name))(allUsers).length === 1),
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
    find(u => u.temporaryAccessId === temp.id),
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
  if (userErrors.length > 0) { throw new BadRequestError(`User is invalid. ${join$2('; ')(userErrors)}`); }

  const { auth, tempCode, temporaryAccessId } = await getAccess(
    app, password,
  );
  user.tempCode = tempCode;
  user.temporaryAccessId = temporaryAccessId;

  if (some(u => insensitiveEquals(u.name, user.name))(users)) { 
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
  values,
  includes$1(t),
]);

const isRecordOrIndexType = t => some(p => p === t)([
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
    l => isEmpty$1(l.name)
             || filter(a => insensitiveEquals(l.name, a.name))(allLevels).length === 1),
]);

const applyLevelRules = allLevels => applyRuleSet(accessLevelRules(allLevels));

const validateAccessLevel = app => (allLevels, level) => {
  const errs = $(level.permissions, [
    map(applyPermissionRules(app)),
    flatten,
    concat(
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
  map(l => validateAccessLevel(app)(allLevels, l)),
  flatten,
  uniqWith((x, y) => x.field === y.field
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
      map(e => e.error),
      join$2(', '),
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
    filter(isRecord),
  ]);

  for (const n of recordNodes) {
    permission.createRecord.add(n.nodeKey(), accessLevel);
    permission.updateRecord.add(n.nodeKey(), accessLevel);
    permission.deleteRecord.add(n.nodeKey(), accessLevel);
    permission.readRecord.add(n.nodeKey(), accessLevel);
  }

  const indexNodes = $(allNodes, [
    filter(isIndex),
  ]);

  for (const n of indexNodes) {
    permission.readIndex.add(n.nodeKey(), accessLevel);
  }

  for (const a of keys$1(app.actions)) {
    permission.executeAction.add(a, accessLevel);
  }

  $(permission, [
    values,
    filter(p => !p.isNode),
    each(p => p.add(accessLevel)),
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
      map(l => l.name),
    ],
  );

  const missing = difference(accessLevels)(actualAccessLevels);
  if (missing.length > 0) {
    throw new Error(`Invalid access levels supplied: ${join$2(', ', missing)}`);
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
  if (!has(handlers, eventName)) return;

  for (const handler of handlers[eventName]) {
    await handler(eventName, context);
  }
};

const subscribe = handlers => (eventName, handler) => {
  if (!has(handlers, eventName)) {
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
    func = compileCode$1(code);
  } catch(e) {
    e.message = `Error compiling code : ${code} : ${e.message}`;
    throw e;
  }

  return func;
};

const compileExpression = code => {
  let func;  
      
  try {
    func = compileExpression$1(code);
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
  reduce((all, a) => {
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
          find(a => a.name === trig.actionName)(actions),
          createOptions(trig.optionsCreator, ctx),
        );
      }
    });
  }
};

const validateSources = (behaviourSources, actions) => {
  const declaredSources = $(actions, [
    uniqBy(a => a.behaviourSource),
    map(a => a.behaviourSource),
  ]);

  const suppliedSources = keys$1(behaviourSources);

  const missingSources = difference(
    declaredSources, suppliedSources,
  );

  if (missingSources.length > 0) {
    throw new BadRequestError(`Declared behaviour sources are not supplied: ${join$2(', ', missingSources)}`);
  }

  const missingBehaviours = $(actions, [
    filter(a => !isFunction$1(behaviourSources[a.behaviourSource][a.behaviourName])),
    map(a => `Action: ${a.name} : ${a.behaviourSource}.${a.behaviourName}`),
  ]);

  if (missingBehaviours.length > 0) {
    throw new NotFoundError(`Missing behaviours: could not find behaviour functions: ${join$2(', ', missingBehaviours)}`);
  }
};

const retrieve = async (app) => {
  const transactionFiles = await app.datastore.getFolderContents(
    TRANSACTIONS_FOLDER,
  );

  let transactions = [];

  if (some(isBuildIndexFolder)(transactionFiles)) {
    const buildIndexFolder = find(isBuildIndexFolder)(transactionFiles);

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
    map(parseTransactionId),
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
    filter(f => f !== LOCK_FILENAME
                    && !isBuildIndexFolder(f)),
    map(parseTransactionId),
  ]);

  const transactionIdsByRecord = $(transactionIds, [
    groupBy('recordId'),
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
    const transForType = filter(forType)(trans);
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
    if (some(isDelete)(transIdsForRecord)) {
      const t = await verify(find(isDelete)(transIdsForRecord));
      if (t.verified) { dedupedTransactions.push(t); }
      continue;
    }
    if (some(isUpdate)(transIdsForRecord)) {
      const upd = await pickOne(transIdsForRecord, isUpdate);
      if (isSomething(upd) && upd.verified) { dedupedTransactions.push(upd); }
      continue;
    }
    if (some(isCreate)(transIdsForRecord)) {
      const cre = await pickOne(transIdsForRecord, isCreate);
      if (isSomething(cre)) { dedupedTransactions.push(cre); }
      continue;
    }
  }

  const duplicates = $(transactionIds, [
    filter(t => none(ddt => ddt.uniqueId === t.uniqueId)(dedupedTransactions)),
  ]);


  const deletePromises = map(t => app.datastore.deleteFile(
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
  const splitId = split(idSep)(id);
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

  const flatHierarchy = orderBy$1(getFlattenedHierarchy(appHierarchy),
    [node => node.pathRegx().length],
    ['desc']);

  const makeindexNodeAndKey_ForAncestorIndex = (indexNode, indexKey) => makeIndexNodeAndKey(indexNode, joinKey(indexKey, indexNode.name));

  const traverseAncestorIndexesInPath = () => reduce((acc, part) => {
    const currentIndexKey = joinKey(acc.lastIndexKey, part);
    acc.lastIndexKey = currentIndexKey;
    const testPathRegx = p => new RegExp(`${p.pathRegx()}$`).test(currentIndexKey);
    const nodeMatch = find(testPathRegx)(flatHierarchy);

    if (isNothing(nodeMatch)) { return acc; }

    if (!isRecord(nodeMatch)
                || nodeMatch.indexes.length === 0) { return acc; }

    const indexes = $(nodeMatch.indexes, [
      filter(i => i.indexType === indexTypes.ancestor
                        && (i.allowedRecordNodeIds.length === 0
                         || includes$1(nodeId)(i.allowedRecordNodeIds))),
    ]);

    each(v => acc.nodesAndKeys.push(
      makeindexNodeAndKey_ForAncestorIndex(v, currentIndexKey),
    ))(indexes);

    return acc;
  }, { lastIndexKey: '', nodesAndKeys: [] })(keyParts).nodesAndKeys;

  const rootIndexes = $(flatHierarchy, [
    filter(n => isGlobalIndex(n) && recordNodeIdIsAllowed(n)(nodeId)),
    map(i => makeIndexNodeAndKey(i, i.nodeKey())),
  ]);

  return union(traverseAncestorIndexesInPath())(rootIndexes);
};

const getRelevantReverseReferenceIndexes = (appHierarchy, record) => $(record.key, [
  getExactNodeForPath(appHierarchy),
  n => n.fields,
  filter(f => f.type === 'reference'
                    && isSomething(record[f.name])
                    && isNonEmptyString(record[f.name].key)),
  map(f => $(f.typeOptions.reverseIndexNodeKeys, [
    map(n => ({
      recordNode: getNode(appHierarchy, n),
      field: f,
    })),
  ])),
  flatten,
  map(n => makeIndexNodeAndKey(
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

  for (const shard of keys$1(recordsByShard)) {
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
    if (isUndefined(transByShard[t.indexShardKey])) {
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
  const updateTransactions = $(transactions, [filter(isUpdate)]);

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
    map(n => ({
      old: evaluateIndex(t.oldRecord, n),
      new: evaluateIndex(t.record, n),
    })),
    filter(indexFilter),
  ]);

  const toRemoveFilter = (n, isUnreferenced) => n.old.mappedRecord.passedFilter === true
        && (n.new.mappedRecord.passedFilter === false
            || isUnreferenced);

  const toAddFilter = (n, isNewlyReferenced) => (n.old.mappedRecord.passedFilter === false
        || isNewlyReferenced)
        && n.new.mappedRecord.passedFilter === true;

  const toUpdateFilter = n => n.new.mappedRecord.passedFilter === true
        && n.old.mappedRecord.passedFilter === true
        && !isEqual(n.old.mappedRecord.result,
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
    const filteredOut_toRemove = union$1(
      getIndexNodesToApply(toRemoveFilter)(t, ancestorIdxs),
      // still referenced - check filter
      getIndexNodesToApply(toRemoveFilter)(t, referenceChanges.notChanged),
      // un referenced - remove if in there already
      getIndexNodesToApply(n => toRemoveFilter(n, true))(t, referenceChanges.unReferenced),
    );

    // new records to add (filtered in)
    const filteredIn_toAdd = union$1(
      getIndexNodesToApply(toAddFilter)(t, ancestorIdxs),
      // newly referenced - check filter
      getIndexNodesToApply(n => toAddFilter(n, true))(t, referenceChanges.newlyReferenced),
      // reference unchanged - rerun filter in case something else changed
      getIndexNodesToApply(toAddFilter)(t, referenceChanges.notChanged),
    );

    const changed = union$1(
      getIndexNodesToApply(toUpdateFilter)(t, ancestorIdxs),
      // still referenced - recheck filter
      getIndexNodesToApply(toUpdateFilter)(t, referenceChanges.notChanged),
    );

    const shardKeyChanged = $(changed, [
      filter(c => c.old.indexShardKey !== c.new.indexShardKey),
    ]);

    const changedInSameShard = $(shardKeyChanged, [
      difference(changed),
    ]);

    for (const res of shardKeyChanged) {
      pull(res)(changed);
      filteredOut_toRemove.push(res);
      filteredIn_toAdd.push(res);
    }

    toRemove.push(
      $(filteredOut_toRemove, [
        map(i => i.old),
      ]),
    );

    toWrite.push(
      $(filteredIn_toAdd, [
        map(i => i.new),
      ]),
    );

    toWrite.push(
      $(changedInSameShard, [
        map(i => i.new),
      ]),
    );
  }

  return ({
    toRemove: flatten(toRemove),
    toWrite: flatten(toWrite),
  });
};

const getBuildIndexTransactionsByShard = (hierarchy, transactions) => {
  const buildTransactions = $(transactions, [filter(isBuildIndex)]);
  if (!isNonEmptyArray(buildTransactions)) return [];
  const indexNode = transactions.indexNode;

  const getIndexKeys = (t) => {
    if (isGlobalIndex(indexNode)) {
      return [indexNode.nodeKey()];
    }

    if (isReferenceIndex(indexNode)) {
      const recordNode = getExactNodeForPath(hierarchy)(t.record.key);
      const refFields = $(recordNode.fields, [
        filter(fieldReversesReferenceToIndex(indexNode)),
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

          if (!includes$1(indexKey)(indexKeys)) { indexKeys.push(indexKey); }
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
    map((t) => {
      const mappedRecord = evaluate(t.record)(indexNode);
      if (!mappedRecord.passedFilter) return null;
      const indexKeys = getIndexKeys(t);
      return $(indexKeys, [
        map(indexKey => ({
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
    flatten,
    filter(isSomething),
  ]);
};

const get_Create_Delete_TransactionsByShard = pred => (hierarchy, transactions) => {
  const createTransactions = $(transactions, [filter(pred)]);

  const getIndexNodesToApply = (t, indexes) => $(indexes, [
    map((n) => {
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
    filter(n => n.mappedRecord.passedFilter),
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

  return flatten(allToApply);
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

  const unReferenced = differenceBy(
    i => i.indexKey,
    oldIndexes, newIndexes,
  );

  const newlyReferenced = differenceBy(
    i => i.indexKey,
    newIndexes, oldIndexes,
  );

  const notChanged = intersectionBy(
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
        map(t => joinKey(
          folder,
          getTransactionId(
            t.recordId, t.transactionType,
            t.uniqueId,
          ),
        )),
        map(app.datastore.deleteFile),
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
    filter(isGlobalIndex),
  ]);

  for (const index of globalIndexes) {
    if (!await datastore.exists(index.nodeKey())) { await initialiseIndex(datastore, '', index); }
  }
};

const initialiseRootSingleRecords = async (datastore, hierachy) => {
  const flathierarchy = getFlattenedHierarchy(hierachy);
  const singleRecords = $(flathierarchy, [
    filter(isSingleRecord),
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

export default getAppApis;
export { index as common, events, eventsList, getActionsApi, getAppApis, getAuthApi, getCollectionApi, getDatabaseManager, getIndexApi, getRecordApi, getTemplateApi, hierarchy, initialiseData, setupDatastore };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVkaWJhc2UtY29yZS5lc20ubWpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tbW9uL2V2ZW50cy5qcyIsIi4uL3NyYy9jb21tb24vZXJyb3JzLmpzIiwiLi4vc3JjL2NvbW1vbi9hcGlXcmFwcGVyLmpzIiwiLi4vc3JjL2NvbW1vbi9sb2NrLmpzIiwiLi4vc3JjL2NvbW1vbi9pbmRleC5qcyIsIi4uL3NyYy9jb21tb24vdmFsaWRhdGlvbkNvbW1vbi5qcyIsIi4uL3NyYy9pbmRleGluZy9ldmFsdWF0ZS5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9pbmRleGVzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2hpZXJhcmNoeS5qcyIsIi4uL3NyYy90eXBlcy90eXBlSGVscGVycy5qcyIsIi4uL3NyYy90eXBlcy9zdHJpbmcuanMiLCIuLi9zcmMvdHlwZXMvYm9vbC5qcyIsIi4uL3NyYy90eXBlcy9udW1iZXIuanMiLCIuLi9zcmMvdHlwZXMvZGF0ZXRpbWUuanMiLCIuLi9zcmMvdHlwZXMvYXJyYXkuanMiLCIuLi9zcmMvdHlwZXMvcmVmZXJlbmNlLmpzIiwiLi4vc3JjL3R5cGVzL2ZpbGUuanMiLCIuLi9zcmMvdHlwZXMvaW5kZXguanMiLCIuLi9zcmMvYXV0aEFwaS9hdXRoQ29tbW9uLmpzIiwiLi4vc3JjL2F1dGhBcGkvaXNBdXRob3JpemVkLmpzIiwiLi4vc3JjL2F1dGhBcGkvcGVybWlzc2lvbnMuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2dldE5ldy5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvbG9hZC5qcyIsIi4uL3NyYy9pbmRleGluZy9wcm9taXNlUmVhZGFibGVTdHJlYW0uanMiLCIuLi9zcmMvaW5kZXhpbmcvc2hhcmRpbmcuanMiLCIuLi9zcmMvaW5kZXhpbmcvaW5kZXhTY2hlbWFDcmVhdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JvbGx1cC1wbHVnaW4tbm9kZS1nbG9iYWxzL3NyYy9nbG9iYWwuanMiLCIuLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVzNi9iYXNlNjQuanMiLCIuLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVzNi9pZWVlNzU0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2J1ZmZlci1lczYvaXNBcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9idWZmZXItZXM2L2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JvbGx1cC1wbHVnaW4tbm9kZS1idWlsdGlucy9zcmMvZXM2L3N0cmluZy1kZWNvZGVyLmpzIiwiLi4vc3JjL2luZGV4aW5nL3NlcmlhbGl6ZXIuanMiLCIuLi9zcmMvaW5kZXhpbmcvcmVhZC5qcyIsIi4uL3NyYy9pbmRleEFwaS9saXN0SXRlbXMuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2dldENvbnRleHQuanMiLCIuLi9zcmMvcmVjb3JkQXBpL3ZhbGlkYXRlLmpzIiwiLi4vc3JjL2NvbGxlY3Rpb25BcGkvaW5pdGlhbGlzZS5qcyIsIi4uL3NyYy9pbmRleGluZy9hbGxJZHMuanMiLCIuLi9zcmMvdHJhbnNhY3Rpb25zL3RyYW5zYWN0aW9uc0NvbW1vbi5qcyIsIi4uL3NyYy90cmFuc2FjdGlvbnMvY3JlYXRlLmpzIiwiLi4vc3JjL2luZGV4aW5nL2luaXRpYWxpc2VJbmRleC5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvc2F2ZS5qcyIsIi4uL3NyYy9jb2xsZWN0aW9uQXBpL2RlbGV0ZS5qcyIsIi4uL3NyYy9pbmRleEFwaS9kZWxldGUuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2RlbGV0ZS5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvdXBsb2FkRmlsZS5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZG93bmxvYWRGaWxlLmpzIiwiLi4vc3JjL3JlY29yZEFwaS9jdXN0b21JZC5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvaW5kZXguanMiLCIuLi9zcmMvY29sbGVjdGlvbkFwaS9nZXRBbGxvd2VkUmVjb3JkVHlwZXMuanMiLCIuLi9zcmMvY29sbGVjdGlvbkFwaS9pbmRleC5qcyIsIi4uL3NyYy9pbmRleEFwaS9idWlsZEluZGV4LmpzIiwiLi4vc3JjL2luZGV4QXBpL2FnZ3JlZ2F0ZXMuanMiLCIuLi9zcmMvaW5kZXhBcGkvaW5kZXguanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvY3JlYXRlTm9kZXMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvZmllbGRzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL3JlY29yZFZhbGlkYXRpb25SdWxlcy5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9jcmVhdGVBY3Rpb25zLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL3ZhbGlkYXRlQWdncmVnYXRlLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL3ZhbGlkYXRlLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2dldEFwcGxpY2F0aW9uRGVmaW5pdGlvbi5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9zYXZlQXBwbGljYXRpb25IaWVyYXJjaHkuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvc2F2ZUFjdGlvbnNBbmRUcmlnZ2Vycy5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9nZXRCZWhhdmlvdXJTb3VyY2VzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2luZGV4LmpzIiwiLi4vc3JjL2F1dGhBcGkvZ2V0VXNlcnMuanMiLCIuLi9zcmMvYXV0aEFwaS9sb2FkQWNjZXNzTGV2ZWxzLmpzIiwiLi4vc3JjL2F1dGhBcGkvYXV0aGVudGljYXRlLmpzIiwiLi4vc3JjL2F1dGhBcGkvY3JlYXRlVGVtcG9yYXJ5QWNjZXNzLmpzIiwiLi4vc3JjL2F1dGhBcGkvdmFsaWRhdGVVc2VyLmpzIiwiLi4vc3JjL2F1dGhBcGkvZ2V0TmV3VXNlci5qcyIsIi4uL3NyYy9hdXRoQXBpL3NldFBhc3N3b3JkLmpzIiwiLi4vc3JjL2F1dGhBcGkvY3JlYXRlVXNlci5qcyIsIi4uL3NyYy9hdXRoQXBpL2VuYWJsZVVzZXIuanMiLCIuLi9zcmMvYXV0aEFwaS9nZXROZXdBY2Nlc3NMZXZlbC5qcyIsIi4uL3NyYy9hdXRoQXBpL3ZhbGlkYXRlQWNjZXNzTGV2ZWxzLmpzIiwiLi4vc3JjL2F1dGhBcGkvc2F2ZUFjY2Vzc0xldmVscy5qcyIsIi4uL3NyYy9hdXRoQXBpL2dlbmVyYXRlRnVsbFBlcm1pc3Npb25zLmpzIiwiLi4vc3JjL2F1dGhBcGkvc2V0VXNlckFjY2Vzc0xldmVscy5qcyIsIi4uL3NyYy9hdXRoQXBpL2luZGV4LmpzIiwiLi4vc3JjL2FjdGlvbnNBcGkvZXhlY3V0ZS5qcyIsIi4uL3NyYy9hY3Rpb25zQXBpL2luZGV4LmpzIiwiLi4vc3JjL2FwcEluaXRpYWxpc2UvZXZlbnRBZ2dyZWdhdG9yLmpzIiwiLi4vc3JjL2FwcEluaXRpYWxpc2UvaW5kZXguanMiLCIuLi9zcmMvY29tbW9uL2NvbXBpbGVDb2RlLmpzIiwiLi4vc3JjL2FjdGlvbnNBcGkvaW5pdGlhbGlzZS5qcyIsIi4uL3NyYy90cmFuc2FjdGlvbnMvcmV0cmlldmUuanMiLCIuLi9zcmMvaW5kZXhpbmcvcmVsZXZhbnQuanMiLCIuLi9zcmMvaW5kZXhpbmcvcHJvbWlzZVdyaXRhYmxlU3RyZWFtLmpzIiwiLi4vc3JjL2luZGV4aW5nL2FwcGx5LmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9leGVjdXRlLmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9jbGVhbnVwLmpzIiwiLi4vc3JjL2FwcEluaXRpYWxpc2UvaW5pdGlhbGlzZURhdGEuanMiLCIuLi9zcmMvYXBwSW5pdGlhbGlzZS9kYXRhYmFzZU1hbmFnZXIuanMiLCIuLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdW5pb24sIHJlZHVjZSB9IGZyb20gJ2xvZGFzaC9mcCc7XHJcblxyXG5jb25zdCBjb21tb25QbHVzID0gZXh0cmEgPT4gdW5pb24oWydvbkJlZ2luJywgJ29uQ29tcGxldGUnLCAnb25FcnJvciddKShleHRyYSk7XHJcblxyXG5jb25zdCBjb21tb24gPSAoKSA9PiBjb21tb25QbHVzKFtdKTtcclxuXHJcbmNvbnN0IF9ldmVudHMgPSB7XHJcbiAgcmVjb3JkQXBpOiB7XHJcbiAgICBzYXZlOiBjb21tb25QbHVzKFtcclxuICAgICAgJ29uSW52YWxpZCcsXHJcbiAgICAgICdvblJlY29yZFVwZGF0ZWQnLFxyXG4gICAgICAnb25SZWNvcmRDcmVhdGVkJ10pLFxyXG4gICAgZGVsZXRlOiBjb21tb24oKSxcclxuICAgIGdldENvbnRleHQ6IGNvbW1vbigpLFxyXG4gICAgZ2V0TmV3OiBjb21tb24oKSxcclxuICAgIGxvYWQ6IGNvbW1vbigpLFxyXG4gICAgdmFsaWRhdGU6IGNvbW1vbigpLFxyXG4gICAgdXBsb2FkRmlsZTogY29tbW9uKCksXHJcbiAgICBkb3dubG9hZEZpbGU6IGNvbW1vbigpLFxyXG4gIH0sXHJcbiAgaW5kZXhBcGk6IHtcclxuICAgIGJ1aWxkSW5kZXg6IGNvbW1vbigpLFxyXG4gICAgbGlzdEl0ZW1zOiBjb21tb24oKSxcclxuICAgIGRlbGV0ZTogY29tbW9uKCksXHJcbiAgICBhZ2dyZWdhdGVzOiBjb21tb24oKSxcclxuICB9LFxyXG4gIGNvbGxlY3Rpb25BcGk6IHtcclxuICAgIGdldEFsbG93ZWRSZWNvcmRUeXBlczogY29tbW9uKCksXHJcbiAgICBpbml0aWFsaXNlOiBjb21tb24oKSxcclxuICAgIGRlbGV0ZTogY29tbW9uKCksXHJcbiAgfSxcclxuICBhdXRoQXBpOiB7XHJcbiAgICBhdXRoZW50aWNhdGU6IGNvbW1vbigpLFxyXG4gICAgYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzOiBjb21tb24oKSxcclxuICAgIGNyZWF0ZVRlbXBvcmFyeUFjY2VzczogY29tbW9uKCksXHJcbiAgICBjcmVhdGVVc2VyOiBjb21tb24oKSxcclxuICAgIGVuYWJsZVVzZXI6IGNvbW1vbigpLFxyXG4gICAgZGlzYWJsZVVzZXI6IGNvbW1vbigpLFxyXG4gICAgbG9hZEFjY2Vzc0xldmVsczogY29tbW9uKCksXHJcbiAgICBnZXROZXdBY2Nlc3NMZXZlbDogY29tbW9uKCksXHJcbiAgICBnZXROZXdVc2VyOiBjb21tb24oKSxcclxuICAgIGdldE5ld1VzZXJBdXRoOiBjb21tb24oKSxcclxuICAgIGdldFVzZXJzOiBjb21tb24oKSxcclxuICAgIHNhdmVBY2Nlc3NMZXZlbHM6IGNvbW1vbigpLFxyXG4gICAgaXNBdXRob3JpemVkOiBjb21tb24oKSxcclxuICAgIGNoYW5nZU15UGFzc3dvcmQ6IGNvbW1vbigpLFxyXG4gICAgc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZTogY29tbW9uKCksXHJcbiAgICBzY29yZVBhc3N3b3JkOiBjb21tb24oKSxcclxuICAgIGlzVmFsaWRQYXNzd29yZDogY29tbW9uKCksXHJcbiAgICB2YWxpZGF0ZVVzZXI6IGNvbW1vbigpLFxyXG4gICAgdmFsaWRhdGVBY2Nlc3NMZXZlbHM6IGNvbW1vbigpLFxyXG4gICAgc2V0VXNlckFjY2Vzc0xldmVsczogY29tbW9uKCksXHJcbiAgfSxcclxuICB0ZW1wbGF0ZUFwaToge1xyXG4gICAgc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5OiBjb21tb24oKSxcclxuICAgIHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnM6IGNvbW1vbigpLFxyXG4gIH0sXHJcbiAgYWN0aW9uc0FwaToge1xyXG4gICAgZXhlY3V0ZTogY29tbW9uKCksXHJcbiAgfSxcclxufTtcclxuXHJcbmNvbnN0IF9ldmVudHNMaXN0ID0gW107XHJcblxyXG5jb25zdCBtYWtlRXZlbnQgPSAoYXJlYSwgbWV0aG9kLCBuYW1lKSA9PiBgJHthcmVhfToke21ldGhvZH06JHtuYW1lfWA7XHJcblxyXG5mb3IgKGNvbnN0IGFyZWFLZXkgaW4gX2V2ZW50cykge1xyXG4gIGZvciAoY29uc3QgbWV0aG9kS2V5IGluIF9ldmVudHNbYXJlYUtleV0pIHtcclxuICAgIF9ldmVudHNbYXJlYUtleV1bbWV0aG9kS2V5XSA9IHJlZHVjZSgob2JqLCBzKSA9PiB7XHJcbiAgICAgIG9ialtzXSA9IG1ha2VFdmVudChhcmVhS2V5LCBtZXRob2RLZXksIHMpO1xyXG4gICAgICByZXR1cm4gb2JqO1xyXG4gICAgfSxcclxuICAgIHt9KShfZXZlbnRzW2FyZWFLZXldW21ldGhvZEtleV0pO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmZvciAoY29uc3QgYXJlYUtleSBpbiBfZXZlbnRzKSB7XHJcbiAgZm9yIChjb25zdCBtZXRob2RLZXkgaW4gX2V2ZW50c1thcmVhS2V5XSkge1xyXG4gICAgZm9yIChjb25zdCBuYW1lIGluIF9ldmVudHNbYXJlYUtleV1bbWV0aG9kS2V5XSkge1xyXG4gICAgICBfZXZlbnRzTGlzdC5wdXNoKFxyXG4gICAgICAgIF9ldmVudHNbYXJlYUtleV1bbWV0aG9kS2V5XVtuYW1lXSxcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY29uc3QgZXZlbnRzID0gX2V2ZW50cztcclxuXHJcbmV4cG9ydCBjb25zdCBldmVudHNMaXN0ID0gX2V2ZW50c0xpc3Q7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7IGV2ZW50czogX2V2ZW50cywgZXZlbnRzTGlzdDogX2V2ZW50c0xpc3QgfTtcclxuIiwiZXhwb3J0IGNsYXNzIEJhZFJlcXVlc3RFcnJvciBleHRlbmRzIEVycm9yIHtcclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcclxuICAgICAgICBzdXBlcihtZXNzYWdlKTtcclxuICAgICAgICB0aGlzLmh0dHBTdGF0dXNDb2RlID0gNDAwO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVW5hdXRob3Jpc2VkRXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XHJcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDQwMTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEZvcmJpZGRlbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xyXG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xyXG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBOb3RGb3VuZEVycm9yIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xyXG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xyXG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb25mbGljdEVycm9yIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xyXG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xyXG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBjbG9uZURlZXAsIGlzVW5kZWZpbmVkIH0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcclxuaW1wb3J0IHsgVW5hdXRob3Jpc2VkRXJyb3IgfSBmcm9tICcuL2Vycm9ycyc7XHJcblxyXG5leHBvcnQgY29uc3QgYXBpV3JhcHBlciA9IGFzeW5jIChhcHAsIGV2ZW50TmFtZXNwYWNlLCBpc0F1dGhvcml6ZWQsIGV2ZW50Q29udGV4dCwgZnVuYywgLi4ucGFyYW1zKSA9PiB7XHJcbiAgcHVzaENhbGxTdGFjayhhcHAsIGV2ZW50TmFtZXNwYWNlKTtcclxuXHJcbiAgaWYgKCFpc0F1dGhvcml6ZWQoYXBwKSkge1xyXG4gICAgaGFuZGxlTm90QXV0aG9yaXplZChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgY29uc3Qgc3RhcnREYXRlID0gRGF0ZS5ub3coKTtcclxuICBjb25zdCBlbGFwc2VkID0gKCkgPT4gKERhdGUubm93KCkgLSBzdGFydERhdGUpO1xyXG5cclxuICB0cnkge1xyXG4gICAgYXdhaXQgYXBwLnB1Ymxpc2goXHJcbiAgICAgIGV2ZW50TmFtZXNwYWNlLm9uQmVnaW4sXHJcbiAgICAgIGV2ZW50Q29udGV4dCxcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZnVuYyguLi5wYXJhbXMpO1xyXG5cclxuICAgIGF3YWl0IHB1Ymxpc2hDb21wbGV0ZShhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIHJlc3VsdCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBhd2FpdCBwdWJsaXNoRXJyb3IoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCBlcnJvcik7XHJcbiAgICB0aHJvdyBlcnJvcjtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgYXBpV3JhcHBlclN5bmMgPSAoYXBwLCBldmVudE5hbWVzcGFjZSwgaXNBdXRob3JpemVkLCBldmVudENvbnRleHQsIGZ1bmMsIC4uLnBhcmFtcykgPT4ge1xyXG4gIHB1c2hDYWxsU3RhY2soYXBwLCBldmVudE5hbWVzcGFjZSk7XHJcblxyXG4gIGlmICghaXNBdXRob3JpemVkKGFwcCkpIHtcclxuICAgIGhhbmRsZU5vdEF1dGhvcml6ZWQoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGNvbnN0IHN0YXJ0RGF0ZSA9IERhdGUubm93KCk7XHJcbiAgY29uc3QgZWxhcHNlZCA9ICgpID0+IChEYXRlLm5vdygpIC0gc3RhcnREYXRlKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIGFwcC5wdWJsaXNoKFxyXG4gICAgICBldmVudE5hbWVzcGFjZS5vbkJlZ2luLFxyXG4gICAgICBldmVudENvbnRleHQsXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IHJlc3VsdCA9IGZ1bmMoLi4ucGFyYW1zKTtcclxuXHJcbiAgICBwdWJsaXNoQ29tcGxldGUoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCByZXN1bHQpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcHVibGlzaEVycm9yKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgZXJyb3IpO1xyXG4gICAgdGhyb3cgZXJyb3I7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgaGFuZGxlTm90QXV0aG9yaXplZCA9IChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UpID0+IHtcclxuICBjb25zdCBlcnIgPSBuZXcgVW5hdXRob3Jpc2VkRXJyb3IoYFVuYXV0aG9yaXplZDogJHtldmVudE5hbWVzcGFjZX1gKTtcclxuICBwdWJsaXNoRXJyb3IoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCAoKSA9PiAwLCBlcnIpO1xyXG4gIHRocm93IGVycjtcclxufTtcclxuXHJcbmNvbnN0IHB1c2hDYWxsU3RhY2sgPSAoYXBwLCBldmVudE5hbWVzcGFjZSwgc2VlZENhbGxJZCkgPT4ge1xyXG4gIGNvbnN0IGNhbGxJZCA9IGdlbmVyYXRlKCk7XHJcblxyXG4gIGNvbnN0IGNyZWF0ZUNhbGxTdGFjayA9ICgpID0+ICh7XHJcbiAgICBzZWVkQ2FsbElkOiAhaXNVbmRlZmluZWQoc2VlZENhbGxJZClcclxuICAgICAgPyBzZWVkQ2FsbElkXHJcbiAgICAgIDogY2FsbElkLFxyXG4gICAgdGhyZWFkQ2FsbElkOiBjYWxsSWQsXHJcbiAgICBzdGFjazogW10sXHJcbiAgfSk7XHJcblxyXG4gIGlmIChpc1VuZGVmaW5lZChhcHAuY2FsbHMpKSB7XHJcbiAgICBhcHAuY2FsbHMgPSBjcmVhdGVDYWxsU3RhY2soKTtcclxuICB9XHJcblxyXG4gIGFwcC5jYWxscy5zdGFjay5wdXNoKHtcclxuICAgIG5hbWVzcGFjZTogZXZlbnROYW1lc3BhY2UsXHJcbiAgICBjYWxsSWQsXHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBwb3BDYWxsU3RhY2sgPSAoYXBwKSA9PiB7XHJcbiAgYXBwLmNhbGxzLnN0YWNrLnBvcCgpO1xyXG4gIGlmIChhcHAuY2FsbHMuc3RhY2subGVuZ3RoID09PSAwKSB7XHJcbiAgICBkZWxldGUgYXBwLmNhbGxzO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IHB1Ymxpc2hFcnJvciA9IGFzeW5jIChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIGVycikgPT4ge1xyXG4gIGNvbnN0IGN0eCA9IGNsb25lRGVlcChldmVudENvbnRleHQpO1xyXG4gIGN0eC5lcnJvciA9IGVycjtcclxuICBjdHguZWxhcHNlZCA9IGVsYXBzZWQoKTtcclxuICBhd2FpdCBhcHAucHVibGlzaChcclxuICAgIGV2ZW50TmFtZXNwYWNlLm9uRXJyb3IsXHJcbiAgICBjdHgsXHJcbiAgKTtcclxuICBwb3BDYWxsU3RhY2soYXBwKTtcclxufTtcclxuXHJcbmNvbnN0IHB1Ymxpc2hDb21wbGV0ZSA9IGFzeW5jIChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIHJlc3VsdCkgPT4ge1xyXG4gIGNvbnN0IGVuZGNvbnRleHQgPSBjbG9uZURlZXAoZXZlbnRDb250ZXh0KTtcclxuICBlbmRjb250ZXh0LnJlc3VsdCA9IHJlc3VsdDtcclxuICBlbmRjb250ZXh0LmVsYXBzZWQgPSBlbGFwc2VkKCk7XHJcbiAgYXdhaXQgYXBwLnB1Ymxpc2goXHJcbiAgICBldmVudE5hbWVzcGFjZS5vbkNvbXBsZXRlLFxyXG4gICAgZW5kY29udGV4dCxcclxuICApO1xyXG4gIHBvcENhbGxTdGFjayhhcHApO1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhcGlXcmFwcGVyO1xyXG4iLCJpbXBvcnQgeyBzcGxpdCB9IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7ICQgfSBmcm9tICcuL2luZGV4JztcclxuXHJcbmNvbnN0IGxvY2tPdmVybGFwTWlsbGlzZWNvbmRzID0gMTA7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TG9jayA9IGFzeW5jIChhcHAsIGxvY2tGaWxlLCB0aW1lb3V0TWlsbGlzZWNvbmRzLCBtYXhMb2NrUmV0cmllcywgcmV0cnlDb3VudCA9IDApID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgdGltZW91dCA9IChhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCkpXHJcbiAgICAgICAgICAgICsgdGltZW91dE1pbGxpc2Vjb25kcztcclxuXHJcbiAgICBjb25zdCBsb2NrID0ge1xyXG4gICAgICB0aW1lb3V0LFxyXG4gICAgICBrZXk6IGxvY2tGaWxlLFxyXG4gICAgICB0b3RhbFRpbWVvdXQ6IHRpbWVvdXRNaWxsaXNlY29uZHMsXHJcbiAgICB9O1xyXG5cclxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlRmlsZShcclxuICAgICAgbG9ja0ZpbGUsXHJcbiAgICAgIGdldExvY2tGaWxlQ29udGVudChcclxuICAgICAgICBsb2NrLnRvdGFsVGltZW91dCxcclxuICAgICAgICBsb2NrLnRpbWVvdXQsXHJcbiAgICAgICksXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiBsb2NrO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGlmIChyZXRyeUNvdW50ID09IG1heExvY2tSZXRyaWVzKSB7IHJldHVybiBOT19MT0NLOyB9XHJcblxyXG4gICAgY29uc3QgbG9jayA9IHBhcnNlTG9ja0ZpbGVDb250ZW50KFxyXG4gICAgICBsb2NrRmlsZSxcclxuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkRmlsZShsb2NrRmlsZSksXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IGN1cnJlbnRFcG9jaFRpbWUgPSBhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCk7XHJcblxyXG4gICAgaWYgKGN1cnJlbnRFcG9jaFRpbWUgPCBsb2NrLnRpbWVvdXQpIHtcclxuICAgICAgcmV0dXJuIE5PX0xPQ0s7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKGxvY2tGaWxlKTtcclxuICAgIH0gY2F0Y2ggKF8pIHtcclxuICAgICAgLy9lbXB0eVxyXG4gICAgfVxyXG5cclxuICAgIGF3YWl0IHNsZWVwRm9yUmV0cnkoKTtcclxuXHJcbiAgICByZXR1cm4gYXdhaXQgZ2V0TG9jayhcclxuICAgICAgYXBwLCBsb2NrRmlsZSwgdGltZW91dE1pbGxpc2Vjb25kcyxcclxuICAgICAgbWF4TG9ja1JldHJpZXMsIHJldHJ5Q291bnQgKyAxLFxyXG4gICAgKTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TG9ja0ZpbGVDb250ZW50ID0gKHRvdGFsVGltZW91dCwgZXBvY2hUaW1lKSA9PiBgJHt0b3RhbFRpbWVvdXR9OiR7ZXBvY2hUaW1lLnRvU3RyaW5nKCl9YDtcclxuXHJcbmNvbnN0IHBhcnNlTG9ja0ZpbGVDb250ZW50ID0gKGtleSwgY29udGVudCkgPT4gJChjb250ZW50LCBbXHJcbiAgc3BsaXQoJzonKSxcclxuICBwYXJ0cyA9PiAoe1xyXG4gICAgdG90YWxUaW1lb3V0OiBuZXcgTnVtYmVyKHBhcnRzWzBdKSxcclxuICAgIHRpbWVvdXQ6IG5ldyBOdW1iZXIocGFydHNbMV0pLFxyXG4gICAga2V5LFxyXG4gIH0pLFxyXG5dKTtcclxuXHJcbmV4cG9ydCBjb25zdCByZWxlYXNlTG9jayA9IGFzeW5jIChhcHAsIGxvY2spID0+IHtcclxuICBjb25zdCBjdXJyZW50RXBvY2hUaW1lID0gYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpO1xyXG4gIC8vIG9ubHkgcmVsZWFzZSBpZiBub3QgdGltZWRvdXRcclxuICBpZiAoY3VycmVudEVwb2NoVGltZSA8IChsb2NrLnRpbWVvdXQgLSBsb2NrT3ZlcmxhcE1pbGxpc2Vjb25kcykpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShsb2NrLmtleSk7XHJcbiAgICB9IGNhdGNoIChfKSB7XHJcbiAgICAgIC8vZW1wdHlcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZXh0ZW5kTG9jayA9IGFzeW5jIChhcHAsIGxvY2spID0+IHtcclxuICBjb25zdCBjdXJyZW50RXBvY2hUaW1lID0gYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpO1xyXG4gIC8vIG9ubHkgcmVsZWFzZSBpZiBub3QgdGltZWRvdXRcclxuICBpZiAoY3VycmVudEVwb2NoVGltZSA8IChsb2NrLnRpbWVvdXQgLSBsb2NrT3ZlcmxhcE1pbGxpc2Vjb25kcykpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvY2sudGltZW91dCA9IGN1cnJlbnRFcG9jaFRpbWUgKyBsb2NrLnRpbWVvdXRNaWxsaXNlY29uZHM7XHJcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlRmlsZShcclxuICAgICAgICBsb2NrLmtleSxcclxuICAgICAgICBnZXRMb2NrRmlsZUNvbnRlbnQobG9jay50b3RhbFRpbWVvdXQsIGxvY2sudGltZW91dCksXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybiBsb2NrO1xyXG4gICAgfSBjYXRjaCAoXykge1xyXG4gICAgICAvL2VtcHR5XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBOT19MT0NLO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IE5PX0xPQ0sgPSAnbm8gbG9jayc7XHJcbmV4cG9ydCBjb25zdCBpc05vbG9jayA9IGlkID0+IGlkID09PSBOT19MT0NLO1xyXG5cclxuY29uc3Qgc2xlZXBGb3JSZXRyeSA9ICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBsb2NrT3ZlcmxhcE1pbGxpc2Vjb25kcykpO1xyXG4iLCJpbXBvcnQge1xyXG4gIGlzVW5kZWZpbmVkLCBpc05hTiwgaXNOdWxsLFxyXG4gIHJlZHVjZSwgY29uc3RhbnQsIGhlYWQsIGlzRW1wdHksXHJcbiAgdGFpbCwgZmluZEluZGV4LCBzdGFydHNXaXRoLCBqb2luLFxyXG4gIGRyb3BSaWdodCwgZmxvdywgdGFrZVJpZ2h0LCB0cmltLFxyXG4gIHNwbGl0LCBpbmNsdWRlcywgcmVwbGFjZSwgaXNBcnJheSxcclxuICBpc1N0cmluZywgaXNJbnRlZ2VyLCBpc0RhdGUsIHRvTnVtYmVyLFxyXG59IGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IHNvbWUgfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBldmVudHMsIGV2ZW50c0xpc3QgfSBmcm9tICcuL2V2ZW50cyc7XHJcbmltcG9ydCB7IGFwaVdyYXBwZXIgfSBmcm9tICcuL2FwaVdyYXBwZXInO1xyXG5pbXBvcnQge1xyXG4gIGdldExvY2ssIE5PX0xPQ0ssXHJcbiAgaXNOb2xvY2tcclxufSBmcm9tICcuL2xvY2snO1xyXG5cclxuLy8gdGhpcyBpcyB0aGUgY29tYmluYXRvciBmdW5jdGlvblxyXG5leHBvcnQgY29uc3QgJCQgPSAoLi4uZnVuY3MpID0+IGFyZyA9PiBmbG93KGZ1bmNzKShhcmcpO1xyXG5cclxuLy8gdGhpcyBpcyB0aGUgcGlwZSBmdW5jdGlvblxyXG5leHBvcnQgY29uc3QgJCA9IChhcmcsIGZ1bmNzKSA9PiAkJCguLi5mdW5jcykoYXJnKTtcclxuXHJcbmV4cG9ydCBjb25zdCBrZXlTZXAgPSAnLyc7XHJcbmNvbnN0IHRyaW1LZXlTZXAgPSBzdHIgPT4gdHJpbShzdHIsIGtleVNlcCk7XHJcbmNvbnN0IHNwbGl0QnlLZXlTZXAgPSBzdHIgPT4gc3BsaXQoc3RyLCBrZXlTZXApO1xyXG5leHBvcnQgY29uc3Qgc2FmZUtleSA9IGtleSA9PiByZXBsYWNlKGAke2tleVNlcH0ke3RyaW1LZXlTZXAoa2V5KX1gLCBgJHtrZXlTZXB9JHtrZXlTZXB9YCwga2V5U2VwKTtcclxuZXhwb3J0IGNvbnN0IGpvaW5LZXkgPSAoLi4uc3RycykgPT4ge1xyXG4gIGNvbnN0IHBhcmFtc09yQXJyYXkgPSBzdHJzLmxlbmd0aCA9PT0gMSAmIGlzQXJyYXkoc3Ryc1swXSlcclxuICAgID8gc3Ryc1swXSA6IHN0cnM7XHJcbiAgcmV0dXJuIHNhZmVLZXkoam9pbihwYXJhbXNPckFycmF5LCBrZXlTZXApKTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNwbGl0S2V5ID0gJCQodHJpbUtleVNlcCwgc3BsaXRCeUtleVNlcCk7XHJcbmV4cG9ydCBjb25zdCBnZXREaXJGb21LZXkgPSAkJChzcGxpdEtleSwgZHJvcFJpZ2h0LCBwID0+IGpvaW5LZXkoLi4ucCkpO1xyXG5leHBvcnQgY29uc3QgZ2V0RmlsZUZyb21LZXkgPSAkJChzcGxpdEtleSwgdGFrZVJpZ2h0LCBoZWFkKTtcclxuXHJcbmV4cG9ydCBjb25zdCBjb25maWdGb2xkZXIgPSBgJHtrZXlTZXB9LmNvbmZpZ2A7XHJcbmV4cG9ydCBjb25zdCBmaWVsZERlZmluaXRpb25zID0gam9pbktleShjb25maWdGb2xkZXIsICdmaWVsZHMuanNvbicpO1xyXG5leHBvcnQgY29uc3QgdGVtcGxhdGVEZWZpbml0aW9ucyA9IGpvaW5LZXkoY29uZmlnRm9sZGVyLCAndGVtcGxhdGVzLmpzb24nKTtcclxuZXhwb3J0IGNvbnN0IGFwcERlZmluaXRpb25GaWxlID0gam9pbktleShjb25maWdGb2xkZXIsICdhcHBEZWZpbml0aW9uLmpzb24nKTtcclxuZXhwb3J0IGNvbnN0IGRpckluZGV4ID0gZm9sZGVyUGF0aCA9PiBqb2luS2V5KGNvbmZpZ0ZvbGRlciwgJ2RpcicsIC4uLnNwbGl0S2V5KGZvbGRlclBhdGgpLCAnZGlyLmlkeCcpO1xyXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhLZXlGcm9tRmlsZUtleSA9ICQkKGdldERpckZvbUtleSwgZGlySW5kZXgpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGlmRXhpc3RzID0gKHZhbCwgZXhpc3RzLCBub3RFeGlzdHMpID0+IChpc1VuZGVmaW5lZCh2YWwpXHJcbiAgPyBpc1VuZGVmaW5lZChub3RFeGlzdHMpID8gKCgpID0+IHsgfSkoKSA6IG5vdEV4aXN0cygpXHJcbiAgOiBleGlzdHMoKSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0T3JEZWZhdWx0ID0gKHZhbCwgZGVmYXVsdFZhbCkgPT4gaWZFeGlzdHModmFsLCAoKSA9PiB2YWwsICgpID0+IGRlZmF1bHRWYWwpO1xyXG5cclxuZXhwb3J0IGNvbnN0IG5vdCA9IGZ1bmMgPT4gdmFsID0+ICFmdW5jKHZhbCk7XHJcbmV4cG9ydCBjb25zdCBpc0RlZmluZWQgPSBub3QoaXNVbmRlZmluZWQpO1xyXG5leHBvcnQgY29uc3QgaXNOb25OdWxsID0gbm90KGlzTnVsbCk7XHJcbmV4cG9ydCBjb25zdCBpc05vdE5hTiA9IG5vdChpc05hTik7XHJcblxyXG5leHBvcnQgY29uc3QgYWxsVHJ1ZSA9ICguLi5mdW5jQXJncykgPT4gdmFsID0+IHJlZHVjZShmdW5jQXJncyxcclxuICAocmVzdWx0LCBjb25kaXRpb25GdW5jKSA9PiAoaXNOdWxsKHJlc3VsdCkgfHwgcmVzdWx0ID09IHRydWUpICYmIGNvbmRpdGlvbkZ1bmModmFsKSxcclxuICBudWxsKTtcclxuXHJcbmV4cG9ydCBjb25zdCBhbnlUcnVlID0gKC4uLmZ1bmNBcmdzKSA9PiB2YWwgPT4gcmVkdWNlKGZ1bmNBcmdzLFxyXG4gIChyZXN1bHQsIGNvbmRpdGlvbkZ1bmMpID0+IHJlc3VsdCA9PSB0cnVlIHx8IGNvbmRpdGlvbkZ1bmModmFsKSxcclxuICBudWxsKTtcclxuXHJcbmV4cG9ydCBjb25zdCBpbnNlbnNpdGl2ZUVxdWFscyA9IChzdHIxLCBzdHIyKSA9PiBzdHIxLnRyaW0oKS50b0xvd2VyQ2FzZSgpID09PSBzdHIyLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGlzU29tZXRoaW5nID0gYWxsVHJ1ZShpc0RlZmluZWQsIGlzTm9uTnVsbCwgaXNOb3ROYU4pO1xyXG5leHBvcnQgY29uc3QgaXNOb3RoaW5nID0gbm90KGlzU29tZXRoaW5nKTtcclxuZXhwb3J0IGNvbnN0IGlzTm90aGluZ09yRW1wdHkgPSB2ID0+IGlzTm90aGluZyh2KSB8fCBpc0VtcHR5KHYpO1xyXG5leHBvcnQgY29uc3Qgc29tZXRoaW5nT3JHZXREZWZhdWx0ID0gZ2V0RGVmYXVsdEZ1bmMgPT4gdmFsID0+IChpc1NvbWV0aGluZyh2YWwpID8gdmFsIDogZ2V0RGVmYXVsdEZ1bmMoKSk7XHJcbmV4cG9ydCBjb25zdCBzb21ldGhpbmdPckRlZmF1bHQgPSAodmFsLCBkZWZhdWx0VmFsKSA9PiBzb21ldGhpbmdPckdldERlZmF1bHQoY29uc3RhbnQoZGVmYXVsdFZhbCkpKHZhbCk7XHJcblxyXG5leHBvcnQgY29uc3QgbWFwSWZTb21ldGhpbmdPckRlZmF1bHQgPSAobWFwRnVuYywgZGVmYXVsdFZhbCkgPT4gdmFsID0+IChpc1NvbWV0aGluZyh2YWwpID8gbWFwRnVuYyh2YWwpIDogZGVmYXVsdFZhbCk7XHJcblxyXG5leHBvcnQgY29uc3QgbWFwSWZTb21ldGhpbmdPckJsYW5rID0gbWFwRnVuYyA9PiBtYXBJZlNvbWV0aGluZ09yRGVmYXVsdChtYXBGdW5jLCAnJyk7XHJcblxyXG5leHBvcnQgY29uc3Qgbm9uZSA9IHByZWRpY2F0ZSA9PiBjb2xsZWN0aW9uID0+ICFzb21lKHByZWRpY2F0ZSkoY29sbGVjdGlvbik7XHJcblxyXG5leHBvcnQgY29uc3QgYWxsID0gcHJlZGljYXRlID0+IGNvbGxlY3Rpb24gPT4gbm9uZSh2ID0+ICFwcmVkaWNhdGUodikpKGNvbGxlY3Rpb24pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGlzTm90RW1wdHkgPSBvYiA9PiAhaXNFbXB0eShvYik7XHJcbmV4cG9ydCBjb25zdCBpc0FzeW5jID0gZm4gPT4gZm4uY29uc3RydWN0b3IubmFtZSA9PT0gJ0FzeW5jRnVuY3Rpb24nO1xyXG5leHBvcnQgY29uc3QgaXNOb25FbXB0eUFycmF5ID0gYWxsVHJ1ZShpc0FycmF5LCBpc05vdEVtcHR5KTtcclxuZXhwb3J0IGNvbnN0IGlzTm9uRW1wdHlTdHJpbmcgPSBhbGxUcnVlKGlzU3RyaW5nLCBpc05vdEVtcHR5KTtcclxuZXhwb3J0IGNvbnN0IHRyeU9yID0gZmFpbEZ1bmMgPT4gKGZ1bmMsIC4uLmFyZ3MpID0+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGZ1bmMuYXBwbHkobnVsbCwgLi4uYXJncyk7XHJcbiAgfSBjYXRjaCAoXykge1xyXG4gICAgcmV0dXJuIGZhaWxGdW5jKCk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHRyeUF3YWl0T3IgPSBmYWlsRnVuYyA9PiBhc3luYyAoZnVuYywgLi4uYXJncykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgZnVuYy5hcHBseShudWxsLCAuLi5hcmdzKTtcclxuICB9IGNhdGNoIChfKSB7XHJcbiAgICByZXR1cm4gYXdhaXQgZmFpbEZ1bmMoKTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZGVmaW5lRXJyb3IgPSAoZnVuYywgZXJyb3JQcmVmaXgpID0+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGZ1bmMoKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGVyci5tZXNzYWdlID0gYCR7ZXJyb3JQcmVmaXh9IDogJHtlcnIubWVzc2FnZX1gO1xyXG4gICAgdGhyb3cgZXJyO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCB0cnlPcklnbm9yZSA9IHRyeU9yKCgpID0+IHsgfSk7XHJcbmV4cG9ydCBjb25zdCB0cnlBd2FpdE9ySWdub3JlID0gdHJ5QXdhaXRPcihhc3luYyAoKSA9PiB7IH0pO1xyXG5leHBvcnQgY29uc3QgY2F1c2VzRXhjZXB0aW9uID0gKGZ1bmMpID0+IHtcclxuICB0cnkge1xyXG4gICAgZnVuYygpO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24gPSBmdW5jID0+ICFjYXVzZXNFeGNlcHRpb24oZnVuYyk7XHJcblxyXG5leHBvcnQgY29uc3QgaGFuZGxlRXJyb3JXaXRoID0gcmV0dXJuVmFsSW5FcnJvciA9PiB0cnlPcihjb25zdGFudChyZXR1cm5WYWxJbkVycm9yKSk7XHJcblxyXG5leHBvcnQgY29uc3QgaGFuZGxlRXJyb3JXaXRoVW5kZWZpbmVkID0gaGFuZGxlRXJyb3JXaXRoKHVuZGVmaW5lZCk7XHJcblxyXG5leHBvcnQgY29uc3Qgc3dpdGNoQ2FzZSA9ICguLi5jYXNlcykgPT4gKHZhbHVlKSA9PiB7XHJcbiAgY29uc3QgbmV4dENhc2UgPSAoKSA9PiBoZWFkKGNhc2VzKVswXSh2YWx1ZSk7XHJcbiAgY29uc3QgbmV4dFJlc3VsdCA9ICgpID0+IGhlYWQoY2FzZXMpWzFdKHZhbHVlKTtcclxuXHJcbiAgaWYgKGlzRW1wdHkoY2FzZXMpKSByZXR1cm47IC8vIHVuZGVmaW5lZFxyXG4gIGlmIChuZXh0Q2FzZSgpID09PSB0cnVlKSByZXR1cm4gbmV4dFJlc3VsdCgpO1xyXG4gIHJldHVybiBzd2l0Y2hDYXNlKC4uLnRhaWwoY2FzZXMpKSh2YWx1ZSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgaXNWYWx1ZSA9IHZhbDEgPT4gdmFsMiA9PiAodmFsMSA9PT0gdmFsMik7XHJcbmV4cG9ydCBjb25zdCBpc09uZU9mID0gKC4uLnZhbHMpID0+IHZhbCA9PiBpbmNsdWRlcyh2YWxzLCB2YWwpO1xyXG5leHBvcnQgY29uc3QgZGVmYXVsdENhc2UgPSBjb25zdGFudCh0cnVlKTtcclxuZXhwb3J0IGNvbnN0IG1lbWJlck1hdGNoZXMgPSAobWVtYmVyLCBtYXRjaCkgPT4gb2JqID0+IG1hdGNoKG9ialttZW1iZXJdKTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgU3RhcnRzV2l0aCA9IHNlYXJjaEZvciA9PiBzZWFyY2hJbiA9PiBzdGFydHNXaXRoKHNlYXJjaEluLCBzZWFyY2hGb3IpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbnRhaW5zID0gdmFsID0+IGFycmF5ID0+IChmaW5kSW5kZXgoYXJyYXksIHYgPT4gdiA9PT0gdmFsKSA+IC0xKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRIYXNoQ29kZSA9IChzKSA9PiB7XHJcbiAgbGV0IGhhc2ggPSAwOyBsZXQgaTsgbGV0IGNoYXI7IGxldFxyXG4gICAgbDtcclxuICBpZiAocy5sZW5ndGggPT0gMCkgcmV0dXJuIGhhc2g7XHJcbiAgZm9yIChpID0gMCwgbCA9IHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICBjaGFyID0gcy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2hhcjtcclxuICAgIGhhc2ggfD0gMDsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXHJcbiAgfVxyXG5cclxuICAvLyBjb252ZXJ0aW5nIHRvIHN0cmluZywgYnV0IGRvbnQgd2FudCBhIFwiLVwiIHByZWZpeGVkXHJcbiAgaWYgKGhhc2ggPCAwKSB7IHJldHVybiBgbiR7KGhhc2ggKiAtMSkudG9TdHJpbmcoKX1gOyB9XHJcbiAgcmV0dXJuIGhhc2gudG9TdHJpbmcoKTtcclxufTtcclxuXHJcbi8vIHRoYW5rcyB0byBodHRwczovL2Jsb2cuZ3Jvc3NtYW4uaW8vaG93LXRvLXdyaXRlLWFzeW5jLWF3YWl0LXdpdGhvdXQtdHJ5LWNhdGNoLWJsb2Nrcy1pbi1qYXZhc2NyaXB0L1xyXG5leHBvcnQgY29uc3QgYXdFeCA9IGFzeW5jIChwcm9taXNlKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHByb21pc2U7XHJcbiAgICByZXR1cm4gW3VuZGVmaW5lZCwgcmVzdWx0XTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmV0dXJuIFtlcnJvciwgdW5kZWZpbmVkXTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgaXNTYWZlSW50ZWdlciA9IG4gPT4gaXNJbnRlZ2VyKG4pXHJcbiAgICAmJiBuIDw9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXHJcbiAgICAmJiBuID49IDAgLSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuXHJcbmV4cG9ydCBjb25zdCB0b0RhdGVPck51bGwgPSBzID0+IChpc051bGwocykgPyBudWxsXHJcbiAgOiBpc0RhdGUocykgPyBzIDogbmV3IERhdGUocykpO1xyXG5leHBvcnQgY29uc3QgdG9Cb29sT3JOdWxsID0gcyA9PiAoaXNOdWxsKHMpID8gbnVsbFxyXG4gIDogcyA9PT0gJ3RydWUnIHx8IHMgPT09IHRydWUpO1xyXG5leHBvcnQgY29uc3QgdG9OdW1iZXJPck51bGwgPSBzID0+IChpc051bGwocykgPyBudWxsXHJcbiAgOiB0b051bWJlcihzKSk7XHJcblxyXG5leHBvcnQgY29uc3QgaXNBcnJheU9mU3RyaW5nID0gb3B0cyA9PiBpc0FycmF5KG9wdHMpICYmIGFsbChpc1N0cmluZykob3B0cyk7XHJcblxyXG5leHBvcnQgY29uc3QgcGF1c2UgPSBhc3luYyBkdXJhdGlvbiA9PiBuZXcgUHJvbWlzZShyZXMgPT4gc2V0VGltZW91dChyZXMsIGR1cmF0aW9uKSk7XHJcblxyXG5leHBvcnQgY29uc3QgcmV0cnkgPSBhc3luYyAoZm4sIHJldHJpZXMsIGRlbGF5LCAuLi5hcmdzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBhd2FpdCBmbiguLi5hcmdzKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGlmIChyZXRyaWVzID4gMSkge1xyXG4gICAgICByZXR1cm4gYXdhaXQgcGF1c2UoZGVsYXkpLnRoZW4oYXN5bmMgKCkgPT4gYXdhaXQgcmV0cnkoZm4sIChyZXRyaWVzIC0gMSksIGRlbGF5LCAuLi5hcmdzKSk7XHJcbiAgICB9XHJcbiAgICB0aHJvdyBlcnI7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IHsgZXZlbnRzIH0gZnJvbSAnLi9ldmVudHMnO1xyXG5leHBvcnQgeyBhcGlXcmFwcGVyLCBhcGlXcmFwcGVyU3luYyB9IGZyb20gJy4vYXBpV3JhcHBlcic7XHJcbmV4cG9ydCB7XHJcbiAgZ2V0TG9jaywgTk9fTE9DSywgcmVsZWFzZUxvY2ssXHJcbiAgZXh0ZW5kTG9jaywgaXNOb2xvY2ssXHJcbn0gZnJvbSAnLi9sb2NrJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBpZkV4aXN0cyxcclxuICBnZXRPckRlZmF1bHQsXHJcbiAgaXNEZWZpbmVkLFxyXG4gIGlzTm9uTnVsbCxcclxuICBpc05vdE5hTixcclxuICBhbGxUcnVlLFxyXG4gIGlzU29tZXRoaW5nLFxyXG4gIG1hcElmU29tZXRoaW5nT3JEZWZhdWx0LFxyXG4gIG1hcElmU29tZXRoaW5nT3JCbGFuayxcclxuICBjb25maWdGb2xkZXIsXHJcbiAgZmllbGREZWZpbml0aW9ucyxcclxuICBpc05vdGhpbmcsXHJcbiAgbm90LFxyXG4gIHN3aXRjaENhc2UsXHJcbiAgZGVmYXVsdENhc2UsXHJcbiAgU3RhcnRzV2l0aCxcclxuICBjb250YWlucyxcclxuICB0ZW1wbGF0ZURlZmluaXRpb25zLFxyXG4gIGhhbmRsZUVycm9yV2l0aCxcclxuICBoYW5kbGVFcnJvcldpdGhVbmRlZmluZWQsXHJcbiAgdHJ5T3IsXHJcbiAgdHJ5T3JJZ25vcmUsXHJcbiAgdHJ5QXdhaXRPcixcclxuICB0cnlBd2FpdE9ySWdub3JlLFxyXG4gIGRpckluZGV4LFxyXG4gIGtleVNlcCxcclxuICAkLFxyXG4gICQkLFxyXG4gIGdldERpckZvbUtleSxcclxuICBnZXRGaWxlRnJvbUtleSxcclxuICBzcGxpdEtleSxcclxuICBzb21ldGhpbmdPckRlZmF1bHQsXHJcbiAgZ2V0SW5kZXhLZXlGcm9tRmlsZUtleSxcclxuICBqb2luS2V5LFxyXG4gIHNvbWV0aGluZ09yR2V0RGVmYXVsdCxcclxuICBhcHBEZWZpbml0aW9uRmlsZSxcclxuICBpc1ZhbHVlLFxyXG4gIGFsbCxcclxuICBpc09uZU9mLFxyXG4gIG1lbWJlck1hdGNoZXMsXHJcbiAgZGVmaW5lRXJyb3IsXHJcbiAgYW55VHJ1ZSxcclxuICBpc05vbkVtcHR5QXJyYXksXHJcbiAgY2F1c2VzRXhjZXB0aW9uLFxyXG4gIGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbixcclxuICBub25lLFxyXG4gIGdldEhhc2hDb2RlLFxyXG4gIGF3RXgsXHJcbiAgYXBpV3JhcHBlcixcclxuICBldmVudHMsXHJcbiAgZXZlbnRzTGlzdCxcclxuICBpc05vdGhpbmdPckVtcHR5LFxyXG4gIGlzU2FmZUludGVnZXIsXHJcbiAgdG9OdW1iZXIsXHJcbiAgdG9EYXRlOiB0b0RhdGVPck51bGwsXHJcbiAgdG9Cb29sOiB0b0Jvb2xPck51bGwsXHJcbiAgaXNBcnJheU9mU3RyaW5nLFxyXG4gIGdldExvY2ssXHJcbiAgTk9fTE9DSyxcclxuICBpc05vbG9jayxcclxuICBpbnNlbnNpdGl2ZUVxdWFscyxcclxuICBwYXVzZSxcclxuICByZXRyeSxcclxufTtcclxuIiwiaW1wb3J0IHsgZmlsdGVyLCBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyAkLCBpc1NvbWV0aGluZyB9IGZyb20gJy4vaW5kZXgnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHN0cmluZ05vdEVtcHR5ID0gcyA9PiBpc1NvbWV0aGluZyhzKSAmJiBzLnRyaW0oKS5sZW5ndGggPiAwO1xyXG5cclxuZXhwb3J0IGNvbnN0IG1ha2VydWxlID0gKGZpZWxkLCBlcnJvciwgaXNWYWxpZCkgPT4gKHsgZmllbGQsIGVycm9yLCBpc1ZhbGlkIH0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRpb25FcnJvciA9IChydWxlLCBpdGVtKSA9PiAoeyAuLi5ydWxlLCBpdGVtIH0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGFwcGx5UnVsZVNldCA9IHJ1bGVTZXQgPT4gaXRlbVRvVmFsaWRhdGUgPT4gJChydWxlU2V0LCBbXHJcbiAgbWFwKGFwcGx5UnVsZShpdGVtVG9WYWxpZGF0ZSkpLFxyXG4gIGZpbHRlcihpc1NvbWV0aGluZyksXHJcbl0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGFwcGx5UnVsZSA9IGl0ZW1Ub3ZhbGlkYXRlID0+IHJ1bGUgPT4gKHJ1bGUuaXNWYWxpZChpdGVtVG92YWxpZGF0ZSlcclxuICA/IG51bGxcclxuICA6IHZhbGlkYXRpb25FcnJvcihydWxlLCBpdGVtVG92YWxpZGF0ZSkpO1xyXG4iLCJpbXBvcnQgeyBjb21waWxlRXhwcmVzc2lvbiwgY29tcGlsZUNvZGUgfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XHJcbmltcG9ydCB7XHJcbiAgaXNVbmRlZmluZWQsIGtleXMsIFxyXG4gIGNsb25lRGVlcCwgaXNGdW5jdGlvbixcclxufSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBkZWZpbmVFcnJvciB9IGZyb20gJy4uL2NvbW1vbic7XHJcblxyXG5leHBvcnQgY29uc3QgZmlsdGVyRXZhbCA9ICdGSUxURVJfRVZBTFVBVEUnO1xyXG5leHBvcnQgY29uc3QgZmlsdGVyQ29tcGlsZSA9ICdGSUxURVJfQ09NUElMRSc7XHJcbmV4cG9ydCBjb25zdCBtYXBFdmFsID0gJ01BUF9FVkFMVUFURSc7XHJcbmV4cG9ydCBjb25zdCBtYXBDb21waWxlID0gJ01BUF9DT01QSUxFJztcclxuZXhwb3J0IGNvbnN0IHJlbW92ZVVuZGVjbGFyZWRGaWVsZHMgPSAnUkVNT1ZFX1VOREVDTEFSRURfRklFTERTJztcclxuZXhwb3J0IGNvbnN0IGFkZFVuTWFwcGVkRmllbGRzID0gJ0FERF9VTk1BUFBFRF9GSUVMRFMnO1xyXG5leHBvcnQgY29uc3QgYWRkVGhlS2V5ID0gJ0FERF9LRVknO1xyXG5cclxuXHJcbmNvbnN0IGdldEV2YWx1YXRlUmVzdWx0ID0gKCkgPT4gKHtcclxuICBpc0Vycm9yOiBmYWxzZSxcclxuICBwYXNzZWRGaWx0ZXI6IHRydWUsXHJcbiAgcmVzdWx0OiBudWxsLFxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBjb21waWxlRmlsdGVyID0gaW5kZXggPT4gY29tcGlsZUV4cHJlc3Npb24oaW5kZXguZmlsdGVyKTtcclxuXHJcbmV4cG9ydCBjb25zdCBjb21waWxlTWFwID0gaW5kZXggPT4gY29tcGlsZUNvZGUoaW5kZXgubWFwKTtcclxuXHJcbmV4cG9ydCBjb25zdCBwYXNzZXNGaWx0ZXIgPSAocmVjb3JkLCBpbmRleCkgPT4ge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB7IHJlY29yZCB9O1xyXG4gIGlmICghaW5kZXguZmlsdGVyKSByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgY29uc3QgY29tcGlsZWRGaWx0ZXIgPSBkZWZpbmVFcnJvcihcclxuICAgICgpID0+IGNvbXBpbGVGaWx0ZXIoaW5kZXgpLFxyXG4gICAgZmlsdGVyQ29tcGlsZSxcclxuICApO1xyXG5cclxuICByZXR1cm4gZGVmaW5lRXJyb3IoXHJcbiAgICAoKSA9PiBjb21waWxlZEZpbHRlcihjb250ZXh0KSxcclxuICAgIGZpbHRlckV2YWwsXHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBtYXBSZWNvcmQgPSAocmVjb3JkLCBpbmRleCkgPT4ge1xyXG4gIGNvbnN0IHJlY29yZENsb25lID0gY2xvbmVEZWVwKHJlY29yZCk7XHJcbiAgY29uc3QgY29udGV4dCA9IHsgcmVjb3JkOiByZWNvcmRDbG9uZSB9O1xyXG5cclxuICBjb25zdCBtYXAgPSBpbmRleC5tYXAgPyBpbmRleC5tYXAgOiAncmV0dXJuIHsuLi5yZWNvcmR9Oyc7XHJcblxyXG4gIGNvbnN0IGNvbXBpbGVkTWFwID0gZGVmaW5lRXJyb3IoXHJcbiAgICAoKSA9PiBjb21waWxlQ29kZShtYXApLFxyXG4gICAgbWFwQ29tcGlsZSxcclxuICApO1xyXG5cclxuICBjb25zdCBtYXBwZWQgPSBkZWZpbmVFcnJvcihcclxuICAgICgpID0+IGNvbXBpbGVkTWFwKGNvbnRleHQpLFxyXG4gICAgbWFwRXZhbCxcclxuICApO1xyXG5cclxuICBjb25zdCBtYXBwZWRLZXlzID0ga2V5cyhtYXBwZWQpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWFwcGVkS2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3Qga2V5ID0gbWFwcGVkS2V5c1tpXTtcclxuICAgIG1hcHBlZFtrZXldID0gaXNVbmRlZmluZWQobWFwcGVkW2tleV0pID8gbnVsbCA6IG1hcHBlZFtrZXldO1xyXG4gICAgaWYgKGlzRnVuY3Rpb24obWFwcGVkW2tleV0pKSB7XHJcbiAgICAgIGRlbGV0ZSBtYXBwZWRba2V5XTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG1hcHBlZC5rZXkgPSByZWNvcmQua2V5O1xyXG4gIG1hcHBlZC5zb3J0S2V5ID0gaW5kZXguZ2V0U29ydEtleVxyXG4gICAgPyBjb21waWxlQ29kZShpbmRleC5nZXRTb3J0S2V5KShjb250ZXh0KVxyXG4gICAgOiByZWNvcmQuaWQ7XHJcblxyXG4gIHJldHVybiBtYXBwZWQ7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZXZhbHVhdGUgPSByZWNvcmQgPT4gKGluZGV4KSA9PiB7XHJcbiAgY29uc3QgcmVzdWx0ID0gZ2V0RXZhbHVhdGVSZXN1bHQoKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIHJlc3VsdC5wYXNzZWRGaWx0ZXIgPSBwYXNzZXNGaWx0ZXIocmVjb3JkLCBpbmRleCk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICByZXN1bHQuaXNFcnJvciA9IHRydWU7XHJcbiAgICByZXN1bHQucGFzc2VkRmlsdGVyID0gZmFsc2U7XHJcbiAgICByZXN1bHQucmVzdWx0ID0gZXJyLm1lc3NhZ2U7XHJcbiAgfVxyXG5cclxuICBpZiAoIXJlc3VsdC5wYXNzZWRGaWx0ZXIpIHJldHVybiByZXN1bHQ7XHJcblxyXG4gIHRyeSB7XHJcbiAgICByZXN1bHQucmVzdWx0ID0gbWFwUmVjb3JkKHJlY29yZCwgaW5kZXgpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmVzdWx0LmlzRXJyb3IgPSB0cnVlO1xyXG4gICAgcmVzdWx0LnJlc3VsdCA9IGVyci5tZXNzYWdlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGV2YWx1YXRlO1xyXG4iLCJpbXBvcnQge1xyXG4gIG1hcCwgaXNFbXB0eSwgY291bnRCeSwgZmxhdHRlbiwgaW5jbHVkZXMsXHJcbn0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgam9pbiwga2V5cyB9IGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IGFwcGx5UnVsZVNldCwgbWFrZXJ1bGUgfSBmcm9tICcuLi9jb21tb24vdmFsaWRhdGlvbkNvbW1vbic7XHJcbmltcG9ydCB7IGNvbXBpbGVGaWx0ZXIsIGNvbXBpbGVNYXAgfSBmcm9tICcuLi9pbmRleGluZy9ldmFsdWF0ZSc7XHJcbmltcG9ydCB7IGlzTm9uRW1wdHlTdHJpbmcsIGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbiwgJCB9IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IGlzUmVjb3JkIH0gZnJvbSAnLi9oaWVyYXJjaHknO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluZGV4VHlwZXMgPSB7IHJlZmVyZW5jZTogJ3JlZmVyZW5jZScsIGFuY2VzdG9yOiAnYW5jZXN0b3InIH07XHJcblxyXG5leHBvcnQgY29uc3QgaW5kZXhSdWxlU2V0ID0gW1xyXG4gIG1ha2VydWxlKCdtYXAnLCAnaW5kZXggaGFzIG5vIG1hcCBmdW5jdGlvbicsXHJcbiAgICBpbmRleCA9PiBpc05vbkVtcHR5U3RyaW5nKGluZGV4Lm1hcCkpLFxyXG4gIG1ha2VydWxlKCdtYXAnLCBcImluZGV4J3MgbWFwIGZ1bmN0aW9uIGRvZXMgbm90IGNvbXBpbGVcIixcclxuICAgIGluZGV4ID0+ICFpc05vbkVtcHR5U3RyaW5nKGluZGV4Lm1hcClcclxuICAgICAgICAgICAgICAgIHx8IGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbigoKSA9PiBjb21waWxlTWFwKGluZGV4KSkpLFxyXG4gIG1ha2VydWxlKCdmaWx0ZXInLCBcImluZGV4J3MgZmlsdGVyIGZ1bmN0aW9uIGRvZXMgbm90IGNvbXBpbGVcIixcclxuICAgIGluZGV4ID0+ICFpc05vbkVtcHR5U3RyaW5nKGluZGV4LmZpbHRlcilcclxuICAgICAgICAgICAgICAgIHx8IGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbigoKSA9PiBjb21waWxlRmlsdGVyKGluZGV4KSkpLFxyXG4gIG1ha2VydWxlKCduYW1lJywgJ211c3QgZGVjbGFyZSBhIG5hbWUgZm9yIGluZGV4JyxcclxuICAgIGluZGV4ID0+IGlzTm9uRW1wdHlTdHJpbmcoaW5kZXgubmFtZSkpLFxyXG4gIG1ha2VydWxlKCduYW1lJywgJ3RoZXJlIGlzIGEgZHVwbGljYXRlIG5hbWVkIGluZGV4IG9uIHRoaXMgbm9kZScsXHJcbiAgICBpbmRleCA9PiBpc0VtcHR5KGluZGV4Lm5hbWUpXHJcbiAgICAgICAgICAgICAgICB8fCBjb3VudEJ5KCduYW1lJykoaW5kZXgucGFyZW50KCkuaW5kZXhlcylbaW5kZXgubmFtZV0gPT09IDEpLFxyXG4gIG1ha2VydWxlKCdpbmRleFR5cGUnLCAncmVmZXJlbmNlIGluZGV4IG1heSBvbmx5IGV4aXN0IG9uIGEgcmVjb3JkIG5vZGUnLFxyXG4gICAgaW5kZXggPT4gaXNSZWNvcmQoaW5kZXgucGFyZW50KCkpXHJcbiAgICAgICAgICAgICAgICAgIHx8IGluZGV4LmluZGV4VHlwZSAhPT0gaW5kZXhUeXBlcy5yZWZlcmVuY2UpLFxyXG4gIG1ha2VydWxlKCdpbmRleFR5cGUnLCBgaW5kZXggdHlwZSBtdXN0IGJlIG9uZSBvZjogJHtqb2luKCcsICcsIGtleXMoaW5kZXhUeXBlcykpfWAsXHJcbiAgICBpbmRleCA9PiBpbmNsdWRlcyhpbmRleC5pbmRleFR5cGUpKGtleXMoaW5kZXhUeXBlcykpKSxcclxuXTtcclxuXHJcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUluZGV4ID0gKGluZGV4LCBhbGxSZWZlcmVuY2VJbmRleGVzT25Ob2RlKSA9PiBhcHBseVJ1bGVTZXQoaW5kZXhSdWxlU2V0KGFsbFJlZmVyZW5jZUluZGV4ZXNPbk5vZGUpKShpbmRleCk7XHJcblxyXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBbGxJbmRleGVzID0gbm9kZSA9PiAkKG5vZGUuaW5kZXhlcywgW1xyXG4gIG1hcChpID0+IHZhbGlkYXRlSW5kZXgoaSwgbm9kZS5pbmRleGVzKSksXHJcbiAgZmxhdHRlbixcclxuXSk7XHJcbiIsImltcG9ydCB7XHJcbiAgZmluZCwgY29uc3RhbnQsIG1hcCwgbGFzdCxcclxuICBmaXJzdCwgc3BsaXQsIGludGVyc2VjdGlvbiwgdGFrZSxcclxuICB1bmlvbiwgaW5jbHVkZXMsIGZpbHRlciwgc29tZSxcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQge1xyXG4gICQsIHN3aXRjaENhc2UsIGlzTm90aGluZywgaXNTb21ldGhpbmcsXHJcbiAgZGVmYXVsdENhc2UsIHNwbGl0S2V5LCBpc05vbkVtcHR5U3RyaW5nLFxyXG4gIGpvaW5LZXksIGdldEhhc2hDb2RlLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IGluZGV4VHlwZXMgfSBmcm9tICcuL2luZGV4ZXMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEZsYXR0ZW5lZEhpZXJhcmNoeSA9IChhcHBIaWVyYXJjaHksIHVzZUNhY2hlZCA9IHRydWUpID0+IHtcclxuICBpZiAoaXNTb21ldGhpbmcoYXBwSGllcmFyY2h5LmdldEZsYXR0ZW5lZEhpZXJhcmNoeSkgJiYgdXNlQ2FjaGVkKSB7IHJldHVybiBhcHBIaWVyYXJjaHkuZ2V0RmxhdHRlbmVkSGllcmFyY2h5KCk7IH1cclxuXHJcbiAgY29uc3QgZmxhdHRlbkhpZXJhcmNoeSA9IChjdXJyZW50Tm9kZSwgZmxhdHRlbmVkKSA9PiB7XHJcbiAgICBmbGF0dGVuZWQucHVzaChjdXJyZW50Tm9kZSk7XHJcbiAgICBpZiAoKCFjdXJyZW50Tm9kZS5jaGlsZHJlblxyXG4gICAgICAgICAgICB8fCBjdXJyZW50Tm9kZS5jaGlsZHJlbi5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgICYmICghY3VycmVudE5vZGUuaW5kZXhlc1xyXG4gICAgICAgICAgICB8fCBjdXJyZW50Tm9kZS5pbmRleGVzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgJiYgKCFjdXJyZW50Tm9kZS5hZ2dyZWdhdGVHcm91cHNcclxuICAgICAgICAgICAgfHwgY3VycmVudE5vZGUuYWdncmVnYXRlR3JvdXBzLmxlbmd0aCA9PT0gMCkpIHtcclxuICAgICAgcmV0dXJuIGZsYXR0ZW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB1bmlvbklmQW55ID0gbDIgPT4gbDEgPT4gdW5pb24obDEpKCFsMiA/IFtdIDogbDIpO1xyXG5cclxuICAgIGNvbnN0IGNoaWxkcmVuID0gJChbXSwgW1xyXG4gICAgICB1bmlvbklmQW55KGN1cnJlbnROb2RlLmNoaWxkcmVuKSxcclxuICAgICAgdW5pb25JZkFueShjdXJyZW50Tm9kZS5pbmRleGVzKSxcclxuICAgICAgdW5pb25JZkFueShjdXJyZW50Tm9kZS5hZ2dyZWdhdGVHcm91cHMpLFxyXG4gICAgXSk7XHJcblxyXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xyXG4gICAgICBmbGF0dGVuSGllcmFyY2h5KGNoaWxkLCBmbGF0dGVuZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZsYXR0ZW5lZDtcclxuICB9O1xyXG5cclxuICBhcHBIaWVyYXJjaHkuZ2V0RmxhdHRlbmVkSGllcmFyY2h5ID0gKCkgPT4gZmxhdHRlbkhpZXJhcmNoeShhcHBIaWVyYXJjaHksIFtdKTtcclxuICByZXR1cm4gYXBwSGllcmFyY2h5LmdldEZsYXR0ZW5lZEhpZXJhcmNoeSgpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldExhc3RQYXJ0SW5LZXkgPSBrZXkgPT4gbGFzdChzcGxpdEtleShrZXkpKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXROb2Rlc0luUGF0aCA9IGFwcEhpZXJhcmNoeSA9PiBrZXkgPT4gJChhcHBIaWVyYXJjaHksIFtcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbiAgZmlsdGVyKG4gPT4gbmV3IFJlZ0V4cChgJHtuLnBhdGhSZWd4KCl9YCkudGVzdChrZXkpKSxcclxuXSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0RXhhY3ROb2RlRm9yUGF0aCA9IGFwcEhpZXJhcmNoeSA9PiBrZXkgPT4gJChhcHBIaWVyYXJjaHksIFtcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbiAgZmluZChuID0+IG5ldyBSZWdFeHAoYCR7bi5wYXRoUmVneCgpfSRgKS50ZXN0KGtleSkpLFxyXG5dKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGggPSBhcHBIaWVyYXJjaHkgPT4gY29sbGVjdGlvbktleSA9PiAkKGFwcEhpZXJhcmNoeSwgW1xyXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcclxuICBmaW5kKG4gPT4gKGlzQ29sbGVjdGlvblJlY29yZChuKVxyXG4gICAgICAgICAgICAgICAgICAgJiYgbmV3IFJlZ0V4cChgJHtuLmNvbGxlY3Rpb25QYXRoUmVneCgpfSRgKS50ZXN0KGNvbGxlY3Rpb25LZXkpKSksXHJcbl0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGhhc01hdGNoaW5nQW5jZXN0b3IgPSBhbmNlc3RvclByZWRpY2F0ZSA9PiBkZWNlbmRhbnROb2RlID0+IHN3aXRjaENhc2UoXHJcblxyXG4gIFtub2RlID0+IGlzTm90aGluZyhub2RlLnBhcmVudCgpKSxcclxuICAgIGNvbnN0YW50KGZhbHNlKV0sXHJcblxyXG4gIFtub2RlID0+IGFuY2VzdG9yUHJlZGljYXRlKG5vZGUucGFyZW50KCkpLFxyXG4gICAgY29uc3RhbnQodHJ1ZSldLFxyXG5cclxuICBbZGVmYXVsdENhc2UsXHJcbiAgICBub2RlID0+IGhhc01hdGNoaW5nQW5jZXN0b3IoYW5jZXN0b3JQcmVkaWNhdGUpKG5vZGUucGFyZW50KCkpXSxcclxuXHJcbikoZGVjZW5kYW50Tm9kZSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0Tm9kZSA9IChhcHBIaWVyYXJjaHksIG5vZGVLZXkpID0+ICQoYXBwSGllcmFyY2h5LCBbXHJcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxyXG4gIGZpbmQobiA9PiBuLm5vZGVLZXkoKSA9PT0gbm9kZUtleVxyXG4gICAgICAgICAgICAgICAgICB8fCAoaXNDb2xsZWN0aW9uUmVjb3JkKG4pXHJcbiAgICAgICAgICAgICAgICAgICAgICAmJiBuLmNvbGxlY3Rpb25Ob2RlS2V5KCkgPT09IG5vZGVLZXkpKSxcclxuXSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0Q29sbGVjdGlvbk5vZGUgPSAoYXBwSGllcmFyY2h5LCBub2RlS2V5KSA9PiAkKGFwcEhpZXJhcmNoeSwgW1xyXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcclxuICBmaW5kKG4gPT4gKGlzQ29sbGVjdGlvblJlY29yZChuKVxyXG4gICAgICAgICAgICAgICAgICAgICYmIG4uY29sbGVjdGlvbk5vZGVLZXkoKSA9PT0gbm9kZUtleSkpLFxyXG5dKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXROb2RlQnlLZXlPck5vZGVLZXkgPSAoYXBwSGllcmFyY2h5LCBrZXlPck5vZGVLZXkpID0+IHtcclxuICBjb25zdCBub2RlQnlLZXkgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcEhpZXJhcmNoeSkoa2V5T3JOb2RlS2V5KTtcclxuICByZXR1cm4gaXNOb3RoaW5nKG5vZGVCeUtleSlcclxuICAgID8gZ2V0Tm9kZShhcHBIaWVyYXJjaHksIGtleU9yTm9kZUtleSlcclxuICAgIDogbm9kZUJ5S2V5O1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldENvbGxlY3Rpb25Ob2RlQnlLZXlPck5vZGVLZXkgPSAoYXBwSGllcmFyY2h5LCBrZXlPck5vZGVLZXkpID0+IHtcclxuICBjb25zdCBub2RlQnlLZXkgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwSGllcmFyY2h5KShrZXlPck5vZGVLZXkpO1xyXG4gIHJldHVybiBpc05vdGhpbmcobm9kZUJ5S2V5KVxyXG4gICAgPyBnZXRDb2xsZWN0aW9uTm9kZShhcHBIaWVyYXJjaHksIGtleU9yTm9kZUtleSlcclxuICAgIDogbm9kZUJ5S2V5O1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGlzTm9kZSA9IChhcHBIaWVyYXJjaHksIGtleSkgPT4gaXNTb21ldGhpbmcoZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHBIaWVyYXJjaHkpKGtleSkpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEFjdHVhbEtleU9mUGFyZW50ID0gKHBhcmVudE5vZGVLZXksIGFjdHVhbENoaWxkS2V5KSA9PiAkKGFjdHVhbENoaWxkS2V5LCBbXHJcbiAgc3BsaXRLZXksXHJcbiAgdGFrZShzcGxpdEtleShwYXJlbnROb2RlS2V5KS5sZW5ndGgpLFxyXG4gIGtzID0+IGpvaW5LZXkoLi4ua3MpLFxyXG5dKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRQYXJlbnRLZXkgPSAoa2V5KSA9PiB7XHJcbiAgcmV0dXJuICQoa2V5LCBbXHJcbiAgICBzcGxpdEtleSxcclxuICAgIHRha2Uoc3BsaXRLZXkoa2V5KS5sZW5ndGggLSAxKSxcclxuICAgIGpvaW5LZXksXHJcbiAgXSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgaXNLZXlBbmNlc3Rvck9mID0gYW5jZXN0b3JLZXkgPT4gZGVjZW5kYW50Tm9kZSA9PiBoYXNNYXRjaGluZ0FuY2VzdG9yKHAgPT4gcC5ub2RlS2V5KCkgPT09IGFuY2VzdG9yS2V5KShkZWNlbmRhbnROb2RlKTtcclxuXHJcbmV4cG9ydCBjb25zdCBoYXNOb01hdGNoaW5nQW5jZXN0b3JzID0gcGFyZW50UHJlZGljYXRlID0+IG5vZGUgPT4gIWhhc01hdGNoaW5nQW5jZXN0b3IocGFyZW50UHJlZGljYXRlKShub2RlKTtcclxuXHJcbmV4cG9ydCBjb25zdCBmaW5kRmllbGQgPSAocmVjb3JkTm9kZSwgZmllbGROYW1lKSA9PiBmaW5kKGYgPT4gZi5uYW1lID09IGZpZWxkTmFtZSkocmVjb3JkTm9kZS5maWVsZHMpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGlzQW5jZXN0b3IgPSBkZWNlbmRhbnQgPT4gYW5jZXN0b3IgPT4gaXNLZXlBbmNlc3Rvck9mKGFuY2VzdG9yLm5vZGVLZXkoKSkoZGVjZW5kYW50KTtcclxuXHJcbmV4cG9ydCBjb25zdCBpc0RlY2VuZGFudCA9IGFuY2VzdG9yID0+IGRlY2VuZGFudCA9PiBpc0FuY2VzdG9yKGRlY2VuZGFudCkoYW5jZXN0b3IpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFJlY29yZE5vZGVJZCA9IHJlY29yZEtleSA9PiAkKHJlY29yZEtleSwgW1xyXG4gIHNwbGl0S2V5LFxyXG4gIGxhc3QsXHJcbiAgZ2V0UmVjb3JkTm9kZUlkRnJvbUlkLFxyXG5dKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRSZWNvcmROb2RlSWRGcm9tSWQgPSByZWNvcmRJZCA9PiAkKHJlY29yZElkLCBbc3BsaXQoJy0nKSwgZmlyc3QsIHBhcnNlSW50XSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkTm9kZUJ5SWQgPSAoaGllcmFyY2h5LCByZWNvcmRJZCkgPT4gJChoaWVyYXJjaHksIFtcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbiAgZmluZChuID0+IGlzUmVjb3JkKG4pXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgbi5ub2RlSWQgPT09IGdldFJlY29yZE5vZGVJZEZyb21JZChyZWNvcmRJZCkpLFxyXG5dKTtcclxuXHJcbmV4cG9ydCBjb25zdCByZWNvcmROb2RlSWRJc0FsbG93ZWQgPSBpbmRleE5vZGUgPT4gbm9kZUlkID0+IGluZGV4Tm9kZS5hbGxvd2VkUmVjb3JkTm9kZUlkcy5sZW5ndGggPT09IDBcclxuICAgIHx8IGluY2x1ZGVzKG5vZGVJZCkoaW5kZXhOb2RlLmFsbG93ZWRSZWNvcmROb2RlSWRzKTtcclxuXHJcbmV4cG9ydCBjb25zdCByZWNvcmROb2RlSXNBbGxvd2VkID0gaW5kZXhOb2RlID0+IHJlY29yZE5vZGUgPT4gcmVjb3JkTm9kZUlkSXNBbGxvd2VkKGluZGV4Tm9kZSkocmVjb3JkTm9kZS5ub2RlSWQpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4ID0gKGFwcEhpZXJhcmNoeSwgaW5kZXhOb2RlKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkTm9kZXMgPSAkKGFwcEhpZXJhcmNoeSwgW1xyXG4gICAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxyXG4gICAgZmlsdGVyKGlzUmVjb3JkKSxcclxuICBdKTtcclxuXHJcbiAgaWYgKGlzR2xvYmFsSW5kZXgoaW5kZXhOb2RlKSkge1xyXG4gICAgcmV0dXJuICQocmVjb3JkTm9kZXMsIFtcclxuICAgICAgZmlsdGVyKHJlY29yZE5vZGVJc0FsbG93ZWQoaW5kZXhOb2RlKSksXHJcbiAgICBdKTtcclxuICB9XHJcblxyXG4gIGlmIChpc0FuY2VzdG9ySW5kZXgoaW5kZXhOb2RlKSkge1xyXG4gICAgcmV0dXJuICQocmVjb3JkTm9kZXMsIFtcclxuICAgICAgZmlsdGVyKGlzRGVjZW5kYW50KGluZGV4Tm9kZS5wYXJlbnQoKSkpLFxyXG4gICAgICBmaWx0ZXIocmVjb3JkTm9kZUlzQWxsb3dlZChpbmRleE5vZGUpKSxcclxuICAgIF0pO1xyXG4gIH1cclxuXHJcbiAgaWYgKGlzUmVmZXJlbmNlSW5kZXgoaW5kZXhOb2RlKSkge1xyXG4gICAgcmV0dXJuICQocmVjb3JkTm9kZXMsIFtcclxuICAgICAgZmlsdGVyKG4gPT4gc29tZShmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleChpbmRleE5vZGUpKShuLmZpZWxkcykpLFxyXG4gICAgXSk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldE5vZGVGcm9tTm9kZUtleUhhc2ggPSBoaWVyYXJjaHkgPT4gaGFzaCA9PiAkKGhpZXJhcmNoeSwgW1xyXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcclxuICBmaW5kKG4gPT4gZ2V0SGFzaENvZGUobi5ub2RlS2V5KCkpID09PSBoYXNoKSxcclxuXSk7XHJcblxyXG5leHBvcnQgY29uc3QgaXNSZWNvcmQgPSBub2RlID0+IGlzU29tZXRoaW5nKG5vZGUpICYmIG5vZGUudHlwZSA9PT0gJ3JlY29yZCc7XHJcbmV4cG9ydCBjb25zdCBpc1NpbmdsZVJlY29yZCA9IG5vZGUgPT4gaXNSZWNvcmQobm9kZSkgJiYgbm9kZS5pc1NpbmdsZTtcclxuZXhwb3J0IGNvbnN0IGlzQ29sbGVjdGlvblJlY29yZCA9IG5vZGUgPT4gaXNSZWNvcmQobm9kZSkgJiYgIW5vZGUuaXNTaW5nbGU7XHJcbmV4cG9ydCBjb25zdCBpc0luZGV4ID0gbm9kZSA9PiBpc1NvbWV0aGluZyhub2RlKSAmJiBub2RlLnR5cGUgPT09ICdpbmRleCc7XHJcbmV4cG9ydCBjb25zdCBpc2FnZ3JlZ2F0ZUdyb3VwID0gbm9kZSA9PiBpc1NvbWV0aGluZyhub2RlKSAmJiBub2RlLnR5cGUgPT09ICdhZ2dyZWdhdGVHcm91cCc7XHJcbmV4cG9ydCBjb25zdCBpc1NoYXJkZWRJbmRleCA9IG5vZGUgPT4gaXNJbmRleChub2RlKSAmJiBpc05vbkVtcHR5U3RyaW5nKG5vZGUuZ2V0U2hhcmROYW1lKTtcclxuZXhwb3J0IGNvbnN0IGlzUm9vdCA9IG5vZGUgPT4gaXNTb21ldGhpbmcobm9kZSkgJiYgbm9kZS5pc1Jvb3QoKTtcclxuZXhwb3J0IGNvbnN0IGlzRGVjZW5kYW50T2ZBUmVjb3JkID0gaGFzTWF0Y2hpbmdBbmNlc3Rvcihpc1JlY29yZCk7XHJcbmV4cG9ydCBjb25zdCBpc0dsb2JhbEluZGV4ID0gbm9kZSA9PiBpc0luZGV4KG5vZGUpICYmIGlzUm9vdChub2RlLnBhcmVudCgpKTtcclxuZXhwb3J0IGNvbnN0IGlzUmVmZXJlbmNlSW5kZXggPSBub2RlID0+IGlzSW5kZXgobm9kZSkgJiYgbm9kZS5pbmRleFR5cGUgPT09IGluZGV4VHlwZXMucmVmZXJlbmNlO1xyXG5leHBvcnQgY29uc3QgaXNBbmNlc3RvckluZGV4ID0gbm9kZSA9PiBpc0luZGV4KG5vZGUpICYmIG5vZGUuaW5kZXhUeXBlID09PSBpbmRleFR5cGVzLmFuY2VzdG9yO1xyXG5cclxuZXhwb3J0IGNvbnN0IGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUgPSBub2RlID0+IGZpZWxkID0+IGZpZWxkLnR5cGUgPT09ICdyZWZlcmVuY2UnXHJcbiAgICAmJiBpbnRlcnNlY3Rpb24oZmllbGQudHlwZU9wdGlvbnMucmV2ZXJzZUluZGV4Tm9kZUtleXMpKG1hcChpID0+IGkubm9kZUtleSgpKShub2RlLmluZGV4ZXMpKVxyXG4gICAgICAubGVuZ3RoID4gMDtcclxuXHJcbmV4cG9ydCBjb25zdCBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleCA9IGluZGV4Tm9kZSA9PiBmaWVsZCA9PiBmaWVsZC50eXBlID09PSAncmVmZXJlbmNlJ1xyXG4gICAgJiYgaW50ZXJzZWN0aW9uKGZpZWxkLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzKShbaW5kZXhOb2RlLm5vZGVLZXkoKV0pXHJcbiAgICAgIC5sZW5ndGggPiAwO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGdldExhc3RQYXJ0SW5LZXksXHJcbiAgZ2V0Tm9kZXNJblBhdGgsXHJcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcclxuICBoYXNNYXRjaGluZ0FuY2VzdG9yLFxyXG4gIGdldE5vZGUsXHJcbiAgZ2V0Tm9kZUJ5S2V5T3JOb2RlS2V5LFxyXG4gIGlzTm9kZSxcclxuICBnZXRBY3R1YWxLZXlPZlBhcmVudCxcclxuICBnZXRQYXJlbnRLZXksXHJcbiAgaXNLZXlBbmNlc3Rvck9mLFxyXG4gIGhhc05vTWF0Y2hpbmdBbmNlc3RvcnMsXHJcbiAgZmluZEZpZWxkLFxyXG4gIGlzQW5jZXN0b3IsXHJcbiAgaXNEZWNlbmRhbnQsXHJcbiAgZ2V0UmVjb3JkTm9kZUlkLFxyXG4gIGdldFJlY29yZE5vZGVJZEZyb21JZCxcclxuICBnZXRSZWNvcmROb2RlQnlJZCxcclxuICByZWNvcmROb2RlSWRJc0FsbG93ZWQsXHJcbiAgcmVjb3JkTm9kZUlzQWxsb3dlZCxcclxuICBnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleCxcclxuICBnZXROb2RlRnJvbU5vZGVLZXlIYXNoLFxyXG4gIGlzUmVjb3JkLFxyXG4gIGlzQ29sbGVjdGlvblJlY29yZCxcclxuICBpc0luZGV4LFxyXG4gIGlzYWdncmVnYXRlR3JvdXAsXHJcbiAgaXNTaGFyZGVkSW5kZXgsXHJcbiAgaXNSb290LFxyXG4gIGlzRGVjZW5kYW50T2ZBUmVjb3JkLFxyXG4gIGlzR2xvYmFsSW5kZXgsXHJcbiAgaXNSZWZlcmVuY2VJbmRleCxcclxuICBpc0FuY2VzdG9ySW5kZXgsXHJcbiAgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvTm9kZSxcclxuICBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleCxcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbn07XHJcbiIsImltcG9ydCB7IG1lcmdlLCBoYXMgfSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQge1xyXG4gIGNvbnN0YW50LCBpc1VuZGVmaW5lZCwgXHJcbiAgbWFwVmFsdWVzLCBjbG9uZURlZXAsXHJcbn0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgaXNOb3RFbXB0eSB9IGZyb20gJy4uL2NvbW1vbic7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0U2FmZUZpZWxkUGFyc2VyID0gKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpID0+IChmaWVsZCwgcmVjb3JkKSA9PiB7XHJcbiAgaWYgKGhhcyhyZWNvcmQsIGZpZWxkLm5hbWUpKSB7XHJcbiAgICByZXR1cm4gZ2V0U2FmZVZhbHVlUGFyc2VyKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpKHJlY29yZFtmaWVsZC5uYW1lXSk7XHJcbiAgfVxyXG4gIHJldHVybiBkZWZhdWx0VmFsdWVGdW5jdGlvbnNbZmllbGQuZ2V0VW5kZWZpbmVkVmFsdWVdKCk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0U2FmZVZhbHVlUGFyc2VyID0gKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpID0+ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IHBhcnNlZCA9IHRyeVBhcnNlKHZhbHVlKTtcclxuICBpZiAocGFyc2VkLnN1Y2Nlc3MpIHtcclxuICAgIHJldHVybiBwYXJzZWQudmFsdWU7XHJcbiAgfVxyXG4gIHJldHVybiBkZWZhdWx0VmFsdWVGdW5jdGlvbnMuZGVmYXVsdCgpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldE5ld1ZhbHVlID0gKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpID0+IChmaWVsZCkgPT4ge1xyXG4gIGNvbnN0IGdldEluaXRpYWxWYWx1ZSA9IGlzVW5kZWZpbmVkKGZpZWxkKSB8fCBpc1VuZGVmaW5lZChmaWVsZC5nZXRJbml0aWFsVmFsdWUpXHJcbiAgICA/ICdkZWZhdWx0J1xyXG4gICAgOiBmaWVsZC5nZXRJbml0aWFsVmFsdWU7XHJcblxyXG4gIHJldHVybiBoYXMoZGVmYXVsdFZhbHVlRnVuY3Rpb25zLCBnZXRJbml0aWFsVmFsdWUpXHJcbiAgICA/IGRlZmF1bHRWYWx1ZUZ1bmN0aW9uc1tnZXRJbml0aWFsVmFsdWVdKClcclxuICAgIDogZ2V0U2FmZVZhbHVlUGFyc2VyKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpKGdldEluaXRpYWxWYWx1ZSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgdHlwZUZ1bmN0aW9ucyA9IHNwZWNpZmljRnVuY3Rpb25zID0+IG1lcmdlKHtcclxuICB2YWx1ZTogY29uc3RhbnQsXHJcbiAgbnVsbDogY29uc3RhbnQobnVsbCksXHJcbn0sIHNwZWNpZmljRnVuY3Rpb25zKTtcclxuXHJcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyA9IHZhbGlkYXRpb25SdWxlcyA9PiBhc3luYyAoZmllbGQsIHJlY29yZCwgY29udGV4dCkgPT4ge1xyXG4gIGNvbnN0IGZpZWxkVmFsdWUgPSByZWNvcmRbZmllbGQubmFtZV07XHJcbiAgY29uc3QgdmFsaWRhdGVSdWxlID0gYXN5bmMgciA9PiAoIWF3YWl0IHIuaXNWYWxpZChmaWVsZFZhbHVlLCBmaWVsZC50eXBlT3B0aW9ucywgY29udGV4dClcclxuICAgID8gci5nZXRNZXNzYWdlKGZpZWxkVmFsdWUsIGZpZWxkLnR5cGVPcHRpb25zKVxyXG4gICAgOiAnJyk7XHJcblxyXG4gIGNvbnN0IGVycm9ycyA9IFtdO1xyXG4gIGZvciAoY29uc3QgciBvZiB2YWxpZGF0aW9uUnVsZXMpIHtcclxuICAgIGNvbnN0IGVyciA9IGF3YWl0IHZhbGlkYXRlUnVsZShyKTtcclxuICAgIGlmIChpc05vdEVtcHR5KGVycikpIGVycm9ycy5wdXNoKGVycik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZXJyb3JzO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0RGVmYXVsdE9wdGlvbnMgPSBtYXBWYWx1ZXModiA9PiB2LmRlZmF1bHRWYWx1ZSk7XHJcblxyXG5leHBvcnQgY29uc3QgbWFrZXJ1bGUgPSAoaXNWYWxpZCwgZ2V0TWVzc2FnZSkgPT4gKHsgaXNWYWxpZCwgZ2V0TWVzc2FnZSB9KTtcclxuZXhwb3J0IGNvbnN0IHBhcnNlZEZhaWxlZCA9IHZhbCA9PiAoeyBzdWNjZXNzOiBmYWxzZSwgdmFsdWU6IHZhbCB9KTtcclxuZXhwb3J0IGNvbnN0IHBhcnNlZFN1Y2Nlc3MgPSB2YWwgPT4gKHsgc3VjY2VzczogdHJ1ZSwgdmFsdWU6IHZhbCB9KTtcclxuZXhwb3J0IGNvbnN0IGdldERlZmF1bHRFeHBvcnQgPSAobmFtZSwgdHJ5UGFyc2UsIGZ1bmN0aW9ucywgb3B0aW9ucywgdmFsaWRhdGlvblJ1bGVzLCBzYW1wbGVWYWx1ZSwgc3RyaW5naWZ5KSA9PiAoe1xyXG4gIGdldE5ldzogZ2V0TmV3VmFsdWUodHJ5UGFyc2UsIGZ1bmN0aW9ucyksXHJcbiAgc2FmZVBhcnNlRmllbGQ6IGdldFNhZmVGaWVsZFBhcnNlcih0cnlQYXJzZSwgZnVuY3Rpb25zKSxcclxuICBzYWZlUGFyc2VWYWx1ZTogZ2V0U2FmZVZhbHVlUGFyc2VyKHRyeVBhcnNlLCBmdW5jdGlvbnMpLFxyXG4gIHRyeVBhcnNlLFxyXG4gIG5hbWUsXHJcbiAgZ2V0RGVmYXVsdE9wdGlvbnM6ICgpID0+IGdldERlZmF1bHRPcHRpb25zKGNsb25lRGVlcChvcHRpb25zKSksXHJcbiAgb3B0aW9uRGVmaW5pdGlvbnM6IG9wdGlvbnMsXHJcbiAgdmFsaWRhdGVUeXBlQ29uc3RyYWludHM6IHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzKHZhbGlkYXRpb25SdWxlcyksXHJcbiAgc2FtcGxlVmFsdWUsXHJcbiAgc3RyaW5naWZ5OiB2YWwgPT4gKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZFxyXG4gICAgPyAnJyA6IHN0cmluZ2lmeSh2YWwpKSxcclxuICBnZXREZWZhdWx0VmFsdWU6IGZ1bmN0aW9ucy5kZWZhdWx0LFxyXG59KTtcclxuIiwiaW1wb3J0IHtcclxuICBjb25zdGFudCwgaXNTdHJpbmcsXHJcbiAgaXNOdWxsLCBpbmNsdWRlcywgaXNCb29sZWFuLFxyXG59IGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7XHJcbiAgdHlwZUZ1bmN0aW9ucyxcclxuICBtYWtlcnVsZSwgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcclxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcclxuaW1wb3J0IHtcclxuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9Cb29sT3JOdWxsLCB0b051bWJlck9yTnVsbCxcclxuICBpc1NhZmVJbnRlZ2VyLCBpc0FycmF5T2ZTdHJpbmcsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuXHJcbmNvbnN0IHN0cmluZ0Z1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xyXG4gIGRlZmF1bHQ6IGNvbnN0YW50KG51bGwpLFxyXG59KTtcclxuXHJcbmNvbnN0IHN0cmluZ1RyeVBhcnNlID0gc3dpdGNoQ2FzZShcclxuICBbaXNTdHJpbmcsIHBhcnNlZFN1Y2Nlc3NdLFxyXG4gIFtpc051bGwsIHBhcnNlZFN1Y2Nlc3NdLFxyXG4gIFtkZWZhdWx0Q2FzZSwgdiA9PiBwYXJzZWRTdWNjZXNzKHYudG9TdHJpbmcoKSldLFxyXG4pO1xyXG5cclxuY29uc3Qgb3B0aW9ucyA9IHtcclxuICBtYXhMZW5ndGg6IHtcclxuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcclxuICAgIGlzVmFsaWQ6IG4gPT4gbiA9PT0gbnVsbCB8fCBpc1NhZmVJbnRlZ2VyKG4pICYmIG4gPiAwLFxyXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ21heCBsZW5ndGggbXVzdCBiZSBudWxsIChubyBsaW1pdCkgb3IgYSBncmVhdGVyIHRoYW4gemVybyBpbnRlZ2VyJyxcclxuICAgIHBhcnNlOiB0b051bWJlck9yTnVsbCxcclxuICB9LFxyXG4gIHZhbHVlczoge1xyXG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxyXG4gICAgaXNWYWxpZDogdiA9PiB2ID09PSBudWxsIHx8IChpc0FycmF5T2ZTdHJpbmcodikgJiYgdi5sZW5ndGggPiAwICYmIHYubGVuZ3RoIDwgMTAwMDApLFxyXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogXCIndmFsdWVzJyBtdXN0IGJlIG51bGwgKG5vIHZhbHVlcykgb3IgYW4gYXJyeSBvZiBhdCBsZWFzdCBvbmUgc3RyaW5nXCIsXHJcbiAgICBwYXJzZTogcyA9PiBzLFxyXG4gIH0sXHJcbiAgYWxsb3dEZWNsYXJlZFZhbHVlc09ubHk6IHtcclxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXHJcbiAgICBpc1ZhbGlkOiBpc0Jvb2xlYW4sXHJcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnYWxsb3dEZWNsYXJlZFZhbHVlc09ubHkgbXVzdCBiZSB0cnVlIG9yIGZhbHNlJyxcclxuICAgIHBhcnNlOiB0b0Jvb2xPck51bGwsXHJcbiAgfSxcclxufTtcclxuXHJcbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcclxuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5tYXhMZW5ndGggPT09IG51bGwgfHwgdmFsLmxlbmd0aCA8PSBvcHRzLm1heExlbmd0aCxcclxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSBleGNlZWRzIG1heGltdW0gbGVuZ3RoIG9mICR7b3B0cy5tYXhMZW5ndGh9YCksXHJcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IG9wdHMuYWxsb3dEZWNsYXJlZFZhbHVlc09ubHkgPT09IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGluY2x1ZGVzKG9wdHMudmFsdWVzLCB2YWwpLFxyXG4gICh2YWwpID0+IGBcIiR7dmFsfVwiIGRvZXMgbm90IGV4aXN0IGluIHRoZSBsaXN0IG9mIGFsbG93ZWQgdmFsdWVzYCksXHJcbl07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxyXG4gICdzdHJpbmcnLFxyXG4gIHN0cmluZ1RyeVBhcnNlLFxyXG4gIHN0cmluZ0Z1bmN0aW9ucyxcclxuICBvcHRpb25zLFxyXG4gIHR5cGVDb25zdHJhaW50cyxcclxuICAnYWJjZGUnLFxyXG4gIHN0ciA9PiBzdHIsXHJcbik7XHJcbiIsImltcG9ydCB7IGNvbnN0YW50LCBpc0Jvb2xlYW4sIGlzTnVsbCB9IGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7XHJcbiAgdHlwZUZ1bmN0aW9ucyxcclxuICBtYWtlcnVsZSwgcGFyc2VkRmFpbGVkLCBwYXJzZWRTdWNjZXNzLFxyXG4gIGdldERlZmF1bHRFeHBvcnQsXHJcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XHJcbmltcG9ydCB7XHJcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIGlzT25lT2YsIHRvQm9vbE9yTnVsbCxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5cclxuY29uc3QgYm9vbEZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xyXG4gIGRlZmF1bHQ6IGNvbnN0YW50KG51bGwpLFxyXG59KTtcclxuXHJcbmNvbnN0IGJvb2xUcnlQYXJzZSA9IHN3aXRjaENhc2UoXHJcbiAgW2lzQm9vbGVhbiwgcGFyc2VkU3VjY2Vzc10sXHJcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXHJcbiAgW2lzT25lT2YoJ3RydWUnLCAnMScsICd5ZXMnLCAnb24nKSwgKCkgPT4gcGFyc2VkU3VjY2Vzcyh0cnVlKV0sXHJcbiAgW2lzT25lT2YoJ2ZhbHNlJywgJzAnLCAnbm8nLCAnb2ZmJyksICgpID0+IHBhcnNlZFN1Y2Nlc3MoZmFsc2UpXSxcclxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXHJcbik7XHJcblxyXG5jb25zdCBvcHRpb25zID0ge1xyXG4gIGFsbG93TnVsbHM6IHtcclxuICAgIGRlZmF1bHRWYWx1ZTogdHJ1ZSxcclxuICAgIGlzVmFsaWQ6IGlzQm9vbGVhbixcclxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgdHJ1ZSBvciBmYWxzZScsXHJcbiAgICBwYXJzZTogdG9Cb29sT3JOdWxsLFxyXG4gIH0sXHJcbn07XHJcblxyXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXHJcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gb3B0cy5hbGxvd051bGxzID09PSB0cnVlIHx8IHZhbCAhPT0gbnVsbCxcclxuICAgICgpID0+ICdmaWVsZCBjYW5ub3QgYmUgbnVsbCcpLFxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcclxuICAnYm9vbCcsIGJvb2xUcnlQYXJzZSwgYm9vbEZ1bmN0aW9ucyxcclxuICBvcHRpb25zLCB0eXBlQ29uc3RyYWludHMsIHRydWUsIEpTT04uc3RyaW5naWZ5LFxyXG4pO1xyXG4iLCJpbXBvcnQge1xyXG4gIGNvbnN0YW50LCBpc051bWJlciwgaXNTdHJpbmcsIGlzTnVsbCxcclxufSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQge1xyXG4gIG1ha2VydWxlLCB0eXBlRnVuY3Rpb25zLFxyXG4gIHBhcnNlZEZhaWxlZCwgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcclxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcclxuaW1wb3J0IHtcclxuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9OdW1iZXJPck51bGwsXHJcbiAgaXNTYWZlSW50ZWdlcixcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5cclxuY29uc3QgbnVtYmVyRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XHJcbiAgZGVmYXVsdDogY29uc3RhbnQobnVsbCksXHJcbn0pO1xyXG5cclxuY29uc3QgcGFyc2VTdHJpbmd0b051bWJlck9yTnVsbCA9IChzKSA9PiB7XHJcbiAgY29uc3QgbnVtID0gTnVtYmVyKHMpO1xyXG4gIHJldHVybiBpc05hTihudW0pID8gcGFyc2VkRmFpbGVkKHMpIDogcGFyc2VkU3VjY2VzcyhudW0pO1xyXG59O1xyXG5cclxuY29uc3QgbnVtYmVyVHJ5UGFyc2UgPSBzd2l0Y2hDYXNlKFxyXG4gIFtpc051bWJlciwgcGFyc2VkU3VjY2Vzc10sXHJcbiAgW2lzU3RyaW5nLCBwYXJzZVN0cmluZ3RvTnVtYmVyT3JOdWxsXSxcclxuICBbaXNOdWxsLCBwYXJzZWRTdWNjZXNzXSxcclxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXHJcbik7XHJcblxyXG5jb25zdCBvcHRpb25zID0ge1xyXG4gIG1heFZhbHVlOiB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxyXG4gICAgaXNWYWxpZDogaXNTYWZlSW50ZWdlcixcclxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgdmFsaWQgaW50ZWdlcicsXHJcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXHJcbiAgfSxcclxuICBtaW5WYWx1ZToge1xyXG4gICAgZGVmYXVsdFZhbHVlOiAwIC0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIsXHJcbiAgICBpc1ZhbGlkOiBpc1NhZmVJbnRlZ2VyLFxyXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB2YWxpZCBpbnRlZ2VyJyxcclxuICAgIHBhcnNlOiB0b051bWJlck9yTnVsbCxcclxuICB9LFxyXG4gIGRlY2ltYWxQbGFjZXM6IHtcclxuICAgIGRlZmF1bHRWYWx1ZTogMCxcclxuICAgIGlzVmFsaWQ6IG4gPT4gaXNTYWZlSW50ZWdlcihuKSAmJiBuID49IDAsXHJcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXInLFxyXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxyXG4gIH0sXHJcbn07XHJcblxyXG5jb25zdCBnZXREZWNpbWFsUGxhY2VzID0gKHZhbCkgPT4ge1xyXG4gIGNvbnN0IHNwbGl0RGVjaW1hbCA9IHZhbC50b1N0cmluZygpLnNwbGl0KCcuJyk7XHJcbiAgaWYgKHNwbGl0RGVjaW1hbC5sZW5ndGggPT09IDEpIHJldHVybiAwO1xyXG4gIHJldHVybiBzcGxpdERlY2ltYWxbMV0ubGVuZ3RoO1xyXG59O1xyXG5cclxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xyXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCBvcHRzLm1pblZhbHVlID09PSBudWxsIHx8IHZhbCA+PSBvcHRzLm1pblZhbHVlLFxyXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlICgke3ZhbC50b1N0cmluZygpfSkgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtvcHRzLm1pblZhbHVlfWApLFxyXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCBvcHRzLm1heFZhbHVlID09PSBudWxsIHx8IHZhbCA8PSBvcHRzLm1heFZhbHVlLFxyXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlICgke3ZhbC50b1N0cmluZygpfSkgbXVzdCBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gJHtvcHRzLm1pblZhbHVlfSBvcHRpb25zYCksXHJcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMuZGVjaW1hbFBsYWNlcyA+PSBnZXREZWNpbWFsUGxhY2VzKHZhbCksXHJcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgKCR7dmFsLnRvU3RyaW5nKCl9KSBtdXN0IGhhdmUgJHtvcHRzLmRlY2ltYWxQbGFjZXN9IGRlY2ltYWwgcGxhY2VzIG9yIGxlc3NgKSxcclxuXTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXHJcbiAgJ251bWJlcicsXHJcbiAgbnVtYmVyVHJ5UGFyc2UsXHJcbiAgbnVtYmVyRnVuY3Rpb25zLFxyXG4gIG9wdGlvbnMsXHJcbiAgdHlwZUNvbnN0cmFpbnRzLFxyXG4gIDEsXHJcbiAgbnVtID0+IG51bS50b1N0cmluZygpLFxyXG4pO1xyXG4iLCJpbXBvcnQge1xyXG4gIGNvbnN0YW50LCBpc0RhdGUsIGlzU3RyaW5nLCBpc051bGwsXHJcbn0gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHtcclxuICBtYWtlcnVsZSwgdHlwZUZ1bmN0aW9ucyxcclxuICBwYXJzZWRGYWlsZWQsIHBhcnNlZFN1Y2Nlc3MsIGdldERlZmF1bHRFeHBvcnQsXHJcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XHJcbmltcG9ydCB7XHJcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIHRvRGF0ZU9yTnVsbCxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5cclxuY29uc3QgZGF0ZUZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xyXG4gIGRlZmF1bHQ6IGNvbnN0YW50KG51bGwpLFxyXG4gIG5vdzogKCkgPT4gbmV3IERhdGUoKSxcclxufSk7XHJcblxyXG5jb25zdCBpc1ZhbGlkRGF0ZSA9IGQgPT4gZCBpbnN0YW5jZW9mIERhdGUgJiYgIWlzTmFOKGQpO1xyXG5cclxuY29uc3QgcGFyc2VTdHJpbmdUb0RhdGUgPSBzID0+IHN3aXRjaENhc2UoXHJcbiAgW2lzVmFsaWREYXRlLCBwYXJzZWRTdWNjZXNzXSxcclxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXHJcbikobmV3IERhdGUocykpO1xyXG5cclxuXHJcbmNvbnN0IGRhdGVUcnlQYXJzZSA9IHN3aXRjaENhc2UoXHJcbiAgW2lzRGF0ZSwgcGFyc2VkU3VjY2Vzc10sXHJcbiAgW2lzU3RyaW5nLCBwYXJzZVN0cmluZ1RvRGF0ZV0sXHJcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXHJcbiAgW2RlZmF1bHRDYXNlLCBwYXJzZWRGYWlsZWRdLFxyXG4pO1xyXG5cclxuY29uc3Qgb3B0aW9ucyA9IHtcclxuICBtYXhWYWx1ZToge1xyXG4gICAgZGVmYXVsdFZhbHVlOiBuZXcgRGF0ZSgzMjUwMzY4MDAwMDAwMCksXHJcbiAgICBpc1ZhbGlkOiBpc0RhdGUsXHJcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHZhbGlkIGRhdGUnLFxyXG4gICAgcGFyc2U6IHRvRGF0ZU9yTnVsbCxcclxuICB9LFxyXG4gIG1pblZhbHVlOiB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IG5ldyBEYXRlKC04NTIwMzM2MDAwMDAwKSxcclxuICAgIGlzVmFsaWQ6IGlzRGF0ZSxcclxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgdmFsaWQgZGF0ZScsXHJcbiAgICBwYXJzZTogdG9EYXRlT3JOdWxsLFxyXG4gIH0sXHJcbn07XHJcblxyXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXHJcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWluVmFsdWUgPT09IG51bGwgfHwgdmFsID49IG9wdHMubWluVmFsdWUsXHJcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgKCR7dmFsLnRvU3RyaW5nKCl9KSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAke29wdHMubWluVmFsdWV9YCksXHJcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWF4VmFsdWUgPT09IG51bGwgfHwgdmFsIDw9IG9wdHMubWF4VmFsdWUsXHJcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgKCR7dmFsLnRvU3RyaW5nKCl9KSBtdXN0IGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke29wdHMubWluVmFsdWV9IG9wdGlvbnNgKSxcclxuXTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXHJcbiAgJ2RhdGV0aW1lJyxcclxuICBkYXRlVHJ5UGFyc2UsXHJcbiAgZGF0ZUZ1bmN0aW9ucyxcclxuICBvcHRpb25zLFxyXG4gIHR5cGVDb25zdHJhaW50cyxcclxuICBuZXcgRGF0ZSgxOTg0LCA0LCAxKSxcclxuICBkYXRlID0+IEpTT04uc3RyaW5naWZ5KGRhdGUpLnJlcGxhY2UobmV3IFJlZ0V4cCgnXCInLCAnZycpLCAnJyksXHJcbik7XHJcbiIsImltcG9ydCB7IGNvbnN0YW50LCBpc0FycmF5IH0gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHtcclxuICB0eXBlRnVuY3Rpb25zLCBtYWtlcnVsZSxcclxuICBwYXJzZWRGYWlsZWQsIGdldERlZmF1bHRFeHBvcnQsIHBhcnNlZFN1Y2Nlc3MsXHJcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XHJcbmltcG9ydCB7XHJcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIHRvTnVtYmVyT3JOdWxsLFxyXG4gICQkLCBpc1NhZmVJbnRlZ2VyLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcblxyXG5jb25zdCBhcnJheUZ1bmN0aW9ucyA9ICgpID0+IHR5cGVGdW5jdGlvbnMoe1xyXG4gIGRlZmF1bHQ6IGNvbnN0YW50KFtdKSxcclxufSk7XHJcblxyXG5jb25zdCBtYXBUb1BhcnNlZEFycmFyeSA9IHR5cGUgPT4gJCQoXHJcbiAgbWFwKGkgPT4gdHlwZS5zYWZlUGFyc2VWYWx1ZShpKSksXHJcbiAgcGFyc2VkU3VjY2VzcyxcclxuKTtcclxuXHJcbmNvbnN0IGFycmF5VHJ5UGFyc2UgPSB0eXBlID0+IHN3aXRjaENhc2UoXHJcbiAgW2lzQXJyYXksIG1hcFRvUGFyc2VkQXJyYXJ5KHR5cGUpXSxcclxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXHJcbik7XHJcblxyXG5jb25zdCB0eXBlTmFtZSA9IHR5cGUgPT4gYGFycmF5PCR7dHlwZX0+YDtcclxuXHJcblxyXG5jb25zdCBvcHRpb25zID0ge1xyXG4gIG1heExlbmd0aDoge1xyXG4gICAgZGVmYXVsdFZhbHVlOiAxMDAwMCxcclxuICAgIGlzVmFsaWQ6IGlzU2FmZUludGVnZXIsXHJcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXInLFxyXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxyXG4gIH0sXHJcbiAgbWluTGVuZ3RoOiB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IDAsXHJcbiAgICBpc1ZhbGlkOiBuID0+IGlzU2FmZUludGVnZXIobikgJiYgbiA+PSAwLFxyXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyJyxcclxuICAgIHBhcnNlOiB0b051bWJlck9yTnVsbCxcclxuICB9LFxyXG59O1xyXG5cclxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xyXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCB2YWwubGVuZ3RoID49IG9wdHMubWluTGVuZ3RoLFxyXG4gICAgKHZhbCwgb3B0cykgPT4gYG11c3QgY2hvb3NlICR7b3B0cy5taW5MZW5ndGh9IG9yIG1vcmUgb3B0aW9uc2ApLFxyXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCB2YWwubGVuZ3RoIDw9IG9wdHMubWF4TGVuZ3RoLFxyXG4gICAgKHZhbCwgb3B0cykgPT4gYGNhbm5vdCBjaG9vc2UgbW9yZSB0aGFuICR7b3B0cy5tYXhMZW5ndGh9IG9wdGlvbnNgKSxcclxuXTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHR5cGUgPT4gZ2V0RGVmYXVsdEV4cG9ydChcclxuICB0eXBlTmFtZSh0eXBlLm5hbWUpLFxyXG4gIGFycmF5VHJ5UGFyc2UodHlwZSksXHJcbiAgYXJyYXlGdW5jdGlvbnModHlwZSksXHJcbiAgb3B0aW9ucyxcclxuICB0eXBlQ29uc3RyYWludHMsXHJcbiAgW3R5cGUuc2FtcGxlVmFsdWVdLFxyXG4gIEpTT04uc3RyaW5naWZ5LFxyXG4pO1xyXG4iLCJpbXBvcnQge1xyXG4gIGlzU3RyaW5nLCBpc09iamVjdExpa2UsXHJcbiAgaXNOdWxsLCBoYXMsIGlzRW1wdHksXHJcbn0gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHtcclxuICB0eXBlRnVuY3Rpb25zLCBtYWtlcnVsZSxcclxuICBwYXJzZWRTdWNjZXNzLCBnZXREZWZhdWx0RXhwb3J0LFxyXG4gIHBhcnNlZEZhaWxlZCxcclxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcclxuaW1wb3J0IHtcclxuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSxcclxuICBpc05vbkVtcHR5U3RyaW5nLCBpc0FycmF5T2ZTdHJpbmcsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuXHJcbmNvbnN0IHJlZmVyZW5jZU5vdGhpbmcgPSAoKSA9PiAoeyBrZXk6ICcnIH0pO1xyXG5cclxuY29uc3QgcmVmZXJlbmNlRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XHJcbiAgZGVmYXVsdDogcmVmZXJlbmNlTm90aGluZyxcclxufSk7XHJcblxyXG5jb25zdCBoYXNTdHJpbmdWYWx1ZSA9IChvYiwgcGF0aCkgPT4gaGFzKG9iLCBwYXRoKVxyXG4gICAgJiYgaXNTdHJpbmcob2JbcGF0aF0pO1xyXG5cclxuY29uc3QgaXNPYmplY3RXaXRoS2V5ID0gdiA9PiBpc09iamVjdExpa2UodilcclxuICAgICYmIGhhc1N0cmluZ1ZhbHVlKHYsICdrZXknKTtcclxuXHJcbmNvbnN0IHRyeVBhcnNlRnJvbVN0cmluZyA9IHMgPT4ge1xyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgYXNPYmogPSBKU09OLnBhcnNlKHMpO1xyXG4gICAgaWYoaXNPYmplY3RXaXRoS2V5KSB7XHJcbiAgICAgIHJldHVybiBwYXJzZWRTdWNjZXNzKGFzT2JqKTtcclxuICAgIH1cclxuICB9XHJcbiAgY2F0Y2goXykge1xyXG4gICAgLy8gRU1QVFlcclxuICB9XHJcblxyXG4gIHJldHVybiBwYXJzZWRGYWlsZWQocyk7XHJcbn1cclxuXHJcbmNvbnN0IHJlZmVyZW5jZVRyeVBhcnNlID0gdiA9PiBzd2l0Y2hDYXNlKFxyXG4gIFtpc09iamVjdFdpdGhLZXksIHBhcnNlZFN1Y2Nlc3NdLFxyXG4gIFtpc1N0cmluZywgdHJ5UGFyc2VGcm9tU3RyaW5nXSxcclxuICBbaXNOdWxsLCAoKSA9PiBwYXJzZWRTdWNjZXNzKHJlZmVyZW5jZU5vdGhpbmcoKSldLFxyXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcclxuKSh2KTtcclxuXHJcbmNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgaW5kZXhOb2RlS2V5OiB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXHJcbiAgICBpc1ZhbGlkOiBpc05vbkVtcHR5U3RyaW5nLFxyXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSBub24tZW1wdHkgc3RyaW5nJyxcclxuICAgIHBhcnNlOiBzID0+IHMsXHJcbiAgfSxcclxuICBkaXNwbGF5VmFsdWU6IHtcclxuICAgIGRlZmF1bHRWYWx1ZTogJycsXHJcbiAgICBpc1ZhbGlkOiBpc05vbkVtcHR5U3RyaW5nLFxyXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSBub24tZW1wdHkgc3RyaW5nJyxcclxuICAgIHBhcnNlOiBzID0+IHMsXHJcbiAgfSxcclxuICByZXZlcnNlSW5kZXhOb2RlS2V5czoge1xyXG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxyXG4gICAgaXNWYWxpZDogdiA9PiBpc0FycmF5T2ZTdHJpbmcodikgJiYgdi5sZW5ndGggPiAwLFxyXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSBub24tZW1wdHkgYXJyYXkgb2Ygc3RyaW5ncycsXHJcbiAgICBwYXJzZTogcyA9PiBzLFxyXG4gIH0sXHJcbn07XHJcblxyXG5jb25zdCBpc0VtcHR5U3RyaW5nID0gcyA9PiBpc1N0cmluZyhzKSAmJiBpc0VtcHR5KHMpO1xyXG5cclxuY29uc3QgZW5zdXJlUmVmZXJlbmNlRXhpc3RzID0gYXN5bmMgKHZhbCwgb3B0cywgY29udGV4dCkgPT4gaXNFbXB0eVN0cmluZyh2YWwua2V5KVxyXG4gICAgfHwgYXdhaXQgY29udGV4dC5yZWZlcmVuY2VFeGlzdHMob3B0cywgdmFsLmtleSk7XHJcblxyXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXHJcbiAgbWFrZXJ1bGUoXHJcbiAgICBlbnN1cmVSZWZlcmVuY2VFeGlzdHMsXHJcbiAgICAodmFsLCBvcHRzKSA9PiBgXCIke3ZhbFtvcHRzLmRpc3BsYXlWYWx1ZV19XCIgZG9lcyBub3QgZXhpc3QgaW4gb3B0aW9ucyBsaXN0IChrZXk6ICR7dmFsLmtleX0pYCxcclxuICApLFxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcclxuICAncmVmZXJlbmNlJyxcclxuICByZWZlcmVuY2VUcnlQYXJzZSxcclxuICByZWZlcmVuY2VGdW5jdGlvbnMsXHJcbiAgb3B0aW9ucyxcclxuICB0eXBlQ29uc3RyYWludHMsXHJcbiAgeyBrZXk6ICdrZXknLCB2YWx1ZTogJ3ZhbHVlJyB9LFxyXG4gIEpTT04uc3RyaW5naWZ5LFxyXG4pO1xyXG4iLCJpbXBvcnQge1xyXG4gIGxhc3QsIGhhcywgaXNTdHJpbmcsIGludGVyc2VjdGlvbixcclxuICBpc051bGwsIGlzTnVtYmVyLFxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7XHJcbiAgdHlwZUZ1bmN0aW9ucywgcGFyc2VkRmFpbGVkLFxyXG4gIHBhcnNlZFN1Y2Nlc3MsIGdldERlZmF1bHRFeHBvcnQsXHJcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XHJcbmltcG9ydCB7XHJcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIG5vbmUsXHJcbiAgJCwgc3BsaXRLZXksXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuXHJcbmNvbnN0IGlsbGVnYWxDaGFyYWN0ZXJzID0gJyo/XFxcXC86PD58XFwwXFxiXFxmXFx2JztcclxuXHJcbmV4cG9ydCBjb25zdCBpc0xlZ2FsRmlsZW5hbWUgPSAoZmlsZVBhdGgpID0+IHtcclxuICBjb25zdCBmbiA9IGZpbGVOYW1lKGZpbGVQYXRoKTtcclxuICByZXR1cm4gZm4ubGVuZ3RoIDw9IDI1NVxyXG4gICAgJiYgaW50ZXJzZWN0aW9uKGZuLnNwbGl0KCcnKSkoaWxsZWdhbENoYXJhY3RlcnMuc3BsaXQoJycpKS5sZW5ndGggPT09IDBcclxuICAgICYmIG5vbmUoZiA9PiBmID09PSAnLi4nKShzcGxpdEtleShmaWxlUGF0aCkpO1xyXG59O1xyXG5cclxuY29uc3QgZmlsZU5vdGhpbmcgPSAoKSA9PiAoeyByZWxhdGl2ZVBhdGg6ICcnLCBzaXplOiAwIH0pO1xyXG5cclxuY29uc3QgZmlsZUZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xyXG4gIGRlZmF1bHQ6IGZpbGVOb3RoaW5nLFxyXG59KTtcclxuXHJcbmNvbnN0IGZpbGVUcnlQYXJzZSA9IHYgPT4gc3dpdGNoQ2FzZShcclxuICBbaXNWYWxpZEZpbGUsIHBhcnNlZFN1Y2Nlc3NdLFxyXG4gIFtpc051bGwsICgpID0+IHBhcnNlZFN1Y2Nlc3MoZmlsZU5vdGhpbmcoKSldLFxyXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcclxuKSh2KTtcclxuXHJcbmNvbnN0IGZpbGVOYW1lID0gZmlsZVBhdGggPT4gJChmaWxlUGF0aCwgW1xyXG4gIHNwbGl0S2V5LFxyXG4gIGxhc3QsXHJcbl0pO1xyXG5cclxuY29uc3QgaXNWYWxpZEZpbGUgPSBmID0+ICFpc051bGwoZilcclxuICAgICYmIGhhcygncmVsYXRpdmVQYXRoJykoZikgJiYgaGFzKCdzaXplJykoZilcclxuICAgICYmIGlzTnVtYmVyKGYuc2l6ZSlcclxuICAgICYmIGlzU3RyaW5nKGYucmVsYXRpdmVQYXRoKVxyXG4gICAgJiYgaXNMZWdhbEZpbGVuYW1lKGYucmVsYXRpdmVQYXRoKTtcclxuXHJcbmNvbnN0IG9wdGlvbnMgPSB7fTtcclxuXHJcbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtdO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcclxuICAnZmlsZScsXHJcbiAgZmlsZVRyeVBhcnNlLFxyXG4gIGZpbGVGdW5jdGlvbnMsXHJcbiAgb3B0aW9ucyxcclxuICB0eXBlQ29uc3RyYWludHMsXHJcbiAgeyByZWxhdGl2ZVBhdGg6ICdzb21lX2ZpbGUuanBnJywgc2l6ZTogMTAwMCB9LFxyXG4gIEpTT04uc3RyaW5naWZ5LFxyXG4pO1xyXG4iLCJpbXBvcnQge1xyXG4gIGFzc2lnbiwga2V5cywgbWVyZ2UsIGhhcyxcclxufSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQge1xyXG4gIG1hcCwgaXNTdHJpbmcsIGlzTnVtYmVyLFxyXG4gIGlzQm9vbGVhbiwgaXNEYXRlLFxyXG4gIGlzT2JqZWN0LCBpc0FycmF5LFxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7ICQgfSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBwYXJzZWRTdWNjZXNzIH0gZnJvbSAnLi90eXBlSGVscGVycyc7XHJcbmltcG9ydCBzdHJpbmcgZnJvbSAnLi9zdHJpbmcnO1xyXG5pbXBvcnQgYm9vbCBmcm9tICcuL2Jvb2wnO1xyXG5pbXBvcnQgbnVtYmVyIGZyb20gJy4vbnVtYmVyJztcclxuaW1wb3J0IGRhdGV0aW1lIGZyb20gJy4vZGF0ZXRpbWUnO1xyXG5pbXBvcnQgYXJyYXkgZnJvbSAnLi9hcnJheSc7XHJcbmltcG9ydCByZWZlcmVuY2UgZnJvbSAnLi9yZWZlcmVuY2UnO1xyXG5pbXBvcnQgZmlsZSBmcm9tICcuL2ZpbGUnO1xyXG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcclxuXHJcbmNvbnN0IGFsbFR5cGVzID0gKCkgPT4ge1xyXG4gIGNvbnN0IGJhc2ljVHlwZXMgPSB7XHJcbiAgICBzdHJpbmcsIG51bWJlciwgZGF0ZXRpbWUsIGJvb2wsIHJlZmVyZW5jZSwgZmlsZSxcclxuICB9O1xyXG5cclxuICBjb25zdCBhcnJheXMgPSAkKGJhc2ljVHlwZXMsIFtcclxuICAgIGtleXMsXHJcbiAgICBtYXAoKGspID0+IHtcclxuICAgICAgY29uc3Qga3ZUeXBlID0ge307XHJcbiAgICAgIGNvbnN0IGNvbmNyZXRlQXJyYXkgPSBhcnJheShiYXNpY1R5cGVzW2tdKTtcclxuICAgICAga3ZUeXBlW2NvbmNyZXRlQXJyYXkubmFtZV0gPSBjb25jcmV0ZUFycmF5O1xyXG4gICAgICByZXR1cm4ga3ZUeXBlO1xyXG4gICAgfSksXHJcbiAgICB0eXBlcyA9PiBhc3NpZ24oe30sIC4uLnR5cGVzKSxcclxuICBdKTtcclxuXHJcbiAgcmV0dXJuIG1lcmdlKHt9LCBiYXNpY1R5cGVzLCBhcnJheXMpO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBhbGwgPSBhbGxUeXBlcygpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFR5cGUgPSAodHlwZU5hbWUpID0+IHtcclxuICBpZiAoIWhhcyhhbGwsIHR5cGVOYW1lKSkgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgRG8gbm90IHJlY29nbmlzZSB0eXBlICR7dHlwZU5hbWV9YCk7XHJcbiAgcmV0dXJuIGFsbFt0eXBlTmFtZV07XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0U2FtcGxlRmllbGRWYWx1ZSA9IGZpZWxkID0+IGdldFR5cGUoZmllbGQudHlwZSkuc2FtcGxlVmFsdWU7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TmV3RmllbGRWYWx1ZSA9IGZpZWxkID0+IGdldFR5cGUoZmllbGQudHlwZSkuZ2V0TmV3KGZpZWxkKTtcclxuXHJcbmV4cG9ydCBjb25zdCBzYWZlUGFyc2VGaWVsZCA9IChmaWVsZCwgcmVjb3JkKSA9PiBnZXRUeXBlKGZpZWxkLnR5cGUpLnNhZmVQYXJzZUZpZWxkKGZpZWxkLCByZWNvcmQpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlRmllbGRQYXJzZSA9IChmaWVsZCwgcmVjb3JkKSA9PiAoaGFzKHJlY29yZCwgZmllbGQubmFtZSlcclxuICA/IGdldFR5cGUoZmllbGQudHlwZSkudHJ5UGFyc2UocmVjb3JkW2ZpZWxkLm5hbWVdKVxyXG4gIDogcGFyc2VkU3VjY2Vzcyh1bmRlZmluZWQpKTsgLy8gZmllbGRzIG1heSBiZSB1bmRlZmluZWQgYnkgZGVmYXVsdFxyXG5cclxuZXhwb3J0IGNvbnN0IGdldERlZmF1bHRPcHRpb25zID0gdHlwZSA9PiBnZXRUeXBlKHR5cGUpLmdldERlZmF1bHRPcHRpb25zKCk7XHJcblxyXG5leHBvcnQgY29uc3QgdmFsaWRhdGVUeXBlQ29uc3RyYWludHMgPSBhc3luYyAoZmllbGQsIHJlY29yZCwgY29udGV4dCkgPT4gYXdhaXQgZ2V0VHlwZShmaWVsZC50eXBlKS52YWxpZGF0ZVR5cGVDb25zdHJhaW50cyhmaWVsZCwgcmVjb3JkLCBjb250ZXh0KTtcclxuXHJcbmV4cG9ydCBjb25zdCBkZXRlY3RUeXBlID0gKHZhbHVlKSA9PiB7XHJcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkgcmV0dXJuIHN0cmluZztcclxuICBpZiAoaXNCb29sZWFuKHZhbHVlKSkgcmV0dXJuIGJvb2w7XHJcbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSkgcmV0dXJuIG51bWJlcjtcclxuICBpZiAoaXNEYXRlKHZhbHVlKSkgcmV0dXJuIGRhdGV0aW1lO1xyXG4gIGlmIChpc0FycmF5KHZhbHVlKSkgcmV0dXJuIGFycmF5KGRldGVjdFR5cGUodmFsdWVbMF0pKTtcclxuICBpZiAoaXNPYmplY3QodmFsdWUpXHJcbiAgICAgICAmJiBoYXModmFsdWUsICdrZXknKVxyXG4gICAgICAgJiYgaGFzKHZhbHVlLCAndmFsdWUnKSkgcmV0dXJuIHJlZmVyZW5jZTtcclxuICBpZiAoaXNPYmplY3QodmFsdWUpXHJcbiAgICAgICAgJiYgaGFzKHZhbHVlLCAncmVsYXRpdmVQYXRoJylcclxuICAgICAgICAmJiBoYXModmFsdWUsICdzaXplJykpIHJldHVybiBmaWxlO1xyXG5cclxuICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBjYW5ub3QgZGV0ZXJtaW5lIHR5cGU6ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWApO1xyXG59O1xyXG4iLCJpbXBvcnQgeyBjbG9uZSwgZmluZCwgc3BsaXQgfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBqb2luS2V5LCAkIH0gZnJvbSAnLi4vY29tbW9uJztcclxuLy8gNSBtaW51dGVzXHJcbmV4cG9ydCBjb25zdCB0ZW1wQ29kZUV4cGlyeUxlbmd0aCA9IDUgKiA2MCAqIDEwMDA7XHJcblxyXG5leHBvcnQgY29uc3QgQVVUSF9GT0xERVIgPSAnLy5hdXRoJztcclxuZXhwb3J0IGNvbnN0IFVTRVJTX0xJU1RfRklMRSA9IGpvaW5LZXkoQVVUSF9GT0xERVIsICd1c2Vycy5qc29uJyk7XHJcbmV4cG9ydCBjb25zdCB1c2VyQXV0aEZpbGUgPSB1c2VybmFtZSA9PiBqb2luS2V5KEFVVEhfRk9MREVSLCBgYXV0aF8ke3VzZXJuYW1lfS5qc29uYCk7XHJcbmV4cG9ydCBjb25zdCBVU0VSU19MT0NLX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAndXNlcnNfbG9jaycpO1xyXG5leHBvcnQgY29uc3QgQUNDRVNTX0xFVkVMU19GSUxFID0gam9pbktleShBVVRIX0ZPTERFUiwgJ2FjY2Vzc19sZXZlbHMuanNvbicpO1xyXG5leHBvcnQgY29uc3QgQUNDRVNTX0xFVkVMU19MT0NLX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAnYWNjZXNzX2xldmVsc19sb2NrJyk7XHJcblxyXG5leHBvcnQgY29uc3QgcGVybWlzc2lvblR5cGVzID0ge1xyXG4gIENSRUFURV9SRUNPUkQ6ICdjcmVhdGUgcmVjb3JkJyxcclxuICBVUERBVEVfUkVDT1JEOiAndXBkYXRlIHJlY29yZCcsXHJcbiAgUkVBRF9SRUNPUkQ6ICdyZWFkIHJlY29yZCcsXHJcbiAgREVMRVRFX1JFQ09SRDogJ2RlbGV0ZSByZWNvcmQnLFxyXG4gIFJFQURfSU5ERVg6ICdyZWFkIGluZGV4JyxcclxuICBNQU5BR0VfSU5ERVg6ICdtYW5hZ2UgaW5kZXgnLFxyXG4gIE1BTkFHRV9DT0xMRUNUSU9OOiAnbWFuYWdlIGNvbGxlY3Rpb24nLFxyXG4gIFdSSVRFX1RFTVBMQVRFUzogJ3dyaXRlIHRlbXBsYXRlcycsXHJcbiAgQ1JFQVRFX1VTRVI6ICdjcmVhdGUgdXNlcicsXHJcbiAgU0VUX1BBU1NXT1JEOiAnc2V0IHBhc3N3b3JkJyxcclxuICBDUkVBVEVfVEVNUE9SQVJZX0FDQ0VTUzogJ2NyZWF0ZSB0ZW1wb3JhcnkgYWNjZXNzJyxcclxuICBFTkFCTEVfRElTQUJMRV9VU0VSOiAnZW5hYmxlIG9yIGRpc2FibGUgdXNlcicsXHJcbiAgV1JJVEVfQUNDRVNTX0xFVkVMUzogJ3dyaXRlIGFjY2VzcyBsZXZlbHMnLFxyXG4gIExJU1RfVVNFUlM6ICdsaXN0IHVzZXJzJyxcclxuICBMSVNUX0FDQ0VTU19MRVZFTFM6ICdsaXN0IGFjY2VzcyBsZXZlbHMnLFxyXG4gIEVYRUNVVEVfQUNUSU9OOiAnZXhlY3V0ZSBhY3Rpb24nLFxyXG4gIFNFVF9VU0VSX0FDQ0VTU19MRVZFTFM6ICdzZXQgdXNlciBhY2Nlc3MgbGV2ZWxzJyxcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRVc2VyQnlOYW1lID0gKHVzZXJzLCBuYW1lKSA9PiAkKHVzZXJzLCBbXHJcbiAgZmluZCh1ID0+IHUubmFtZS50b0xvd2VyQ2FzZSgpID09PSBuYW1lLnRvTG93ZXJDYXNlKCkpLFxyXG5dKTtcclxuXHJcbmV4cG9ydCBjb25zdCBzdHJpcFVzZXJPZlNlbnNpdGl2ZVN0dWZmID0gKHVzZXIpID0+IHtcclxuICBjb25zdCBzdHJpcHBlZCA9IGNsb25lKHVzZXIpO1xyXG4gIGRlbGV0ZSBzdHJpcHBlZC50ZW1wQ29kZTtcclxuICByZXR1cm4gc3RyaXBwZWQ7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgcGFyc2VUZW1wb3JhcnlDb2RlID0gZnVsbENvZGUgPT4gJChmdWxsQ29kZSwgW1xyXG4gIHNwbGl0KCc6JyksXHJcbiAgcGFydHMgPT4gKHtcclxuICAgIGlkOiBwYXJ0c1sxXSxcclxuICAgIGNvZGU6IHBhcnRzWzJdLFxyXG4gIH0pLFxyXG5dKTtcclxuIiwiaW1wb3J0IHsgdmFsdWVzLCBpbmNsdWRlcywgc29tZSB9IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IHBlcm1pc3Npb25UeXBlcyB9IGZyb20gJy4vYXV0aENvbW1vbic7XHJcbmltcG9ydCB7XHJcbiAgJCwgaXNOb3RoaW5nLCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IGdldE5vZGVCeUtleU9yTm9kZUtleSwgaXNOb2RlIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGlzQXV0aG9yaXplZCA9IGFwcCA9PiAocGVybWlzc2lvblR5cGUsIHJlc291cmNlS2V5KSA9PiBhcGlXcmFwcGVyU3luYyhcclxuICBhcHAsXHJcbiAgZXZlbnRzLmF1dGhBcGkuaXNBdXRob3JpemVkLFxyXG4gIGFsd2F5c0F1dGhvcml6ZWQsXHJcbiAgeyByZXNvdXJjZUtleSwgcGVybWlzc2lvblR5cGUgfSxcclxuICBfaXNBdXRob3JpemVkLCBhcHAsIHBlcm1pc3Npb25UeXBlLCByZXNvdXJjZUtleSxcclxuKTtcclxuXHJcbmV4cG9ydCBjb25zdCBfaXNBdXRob3JpemVkID0gKGFwcCwgcGVybWlzc2lvblR5cGUsIHJlc291cmNlS2V5KSA9PiB7XHJcbiAgaWYgKCFhcHAudXNlcikge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgdmFsaWRUeXBlID0gJChwZXJtaXNzaW9uVHlwZXMsIFtcclxuICAgIHZhbHVlcyxcclxuICAgIGluY2x1ZGVzKHBlcm1pc3Npb25UeXBlKSxcclxuICBdKTtcclxuXHJcbiAgaWYgKCF2YWxpZFR5cGUpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHBlcm1NYXRjaGVzUmVzb3VyY2UgPSAodXNlcnBlcm0pID0+IHtcclxuICAgIGNvbnN0IG5vZGVLZXkgPSBpc05vdGhpbmcocmVzb3VyY2VLZXkpXHJcbiAgICAgID8gbnVsbFxyXG4gICAgICA6IGlzTm9kZShhcHAuaGllcmFyY2h5LCByZXNvdXJjZUtleSlcclxuICAgICAgICA/IGdldE5vZGVCeUtleU9yTm9kZUtleShcclxuICAgICAgICAgIGFwcC5oaWVyYXJjaHksIHJlc291cmNlS2V5LFxyXG4gICAgICAgICkubm9kZUtleSgpXHJcbiAgICAgICAgOiByZXNvdXJjZUtleTtcclxuXHJcbiAgICByZXR1cm4gKHVzZXJwZXJtLnR5cGUgPT09IHBlcm1pc3Npb25UeXBlKVxyXG4gICAgICAgICYmIChcclxuICAgICAgICAgIGlzTm90aGluZyhyZXNvdXJjZUtleSlcclxuICAgICAgICAgICAgfHwgbm9kZUtleSA9PT0gdXNlcnBlcm0ubm9kZUtleVxyXG4gICAgICAgICk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuICQoYXBwLnVzZXIucGVybWlzc2lvbnMsIFtcclxuICAgIHNvbWUocGVybU1hdGNoZXNSZXNvdXJjZSksXHJcbiAgXSk7XHJcbn07XHJcbiIsImltcG9ydCB7IHBlcm1pc3Npb25UeXBlcyB9IGZyb20gJy4vYXV0aENvbW1vbic7XHJcbmltcG9ydCB7IGlzQXV0aG9yaXplZCB9IGZyb20gJy4vaXNBdXRob3JpemVkJztcclxuXHJcbmV4cG9ydCBjb25zdCB0ZW1wb3JhcnlBY2Nlc3NQZXJtaXNzaW9ucyA9ICgpID0+IChbeyB0eXBlOiBwZXJtaXNzaW9uVHlwZXMuU0VUX1BBU1NXT1JEIH1dKTtcclxuXHJcbmNvbnN0IG5vZGVQZXJtaXNzaW9uID0gdHlwZSA9PiAoe1xyXG4gIGFkZDogKG5vZGVLZXksIGFjY2Vzc0xldmVsKSA9PiBhY2Nlc3NMZXZlbC5wZXJtaXNzaW9ucy5wdXNoKHsgdHlwZSwgbm9kZUtleSB9KSxcclxuICBpc0F1dGhvcml6ZWQ6IHJlc291cmNlS2V5ID0+IGFwcCA9PiBpc0F1dGhvcml6ZWQoYXBwKSh0eXBlLCByZXNvdXJjZUtleSksXHJcbiAgaXNOb2RlOiB0cnVlLFxyXG4gIGdldDogbm9kZUtleSA9PiAoeyB0eXBlLCBub2RlS2V5IH0pLFxyXG59KTtcclxuXHJcbmNvbnN0IHN0YXRpY1Blcm1pc3Npb24gPSB0eXBlID0+ICh7XHJcbiAgYWRkOiBhY2Nlc3NMZXZlbCA9PiBhY2Nlc3NMZXZlbC5wZXJtaXNzaW9ucy5wdXNoKHsgdHlwZSB9KSxcclxuICBpc0F1dGhvcml6ZWQ6IGFwcCA9PiBpc0F1dGhvcml6ZWQoYXBwKSh0eXBlKSxcclxuICBpc05vZGU6IGZhbHNlLFxyXG4gIGdldDogKCkgPT4gKHsgdHlwZSB9KSxcclxufSk7XHJcblxyXG5jb25zdCBjcmVhdGVSZWNvcmQgPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuQ1JFQVRFX1JFQ09SRCk7XHJcblxyXG5jb25zdCB1cGRhdGVSZWNvcmQgPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuVVBEQVRFX1JFQ09SRCk7XHJcblxyXG5jb25zdCBkZWxldGVSZWNvcmQgPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuREVMRVRFX1JFQ09SRCk7XHJcblxyXG5jb25zdCByZWFkUmVjb3JkID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlJFQURfUkVDT1JEKTtcclxuXHJcbmNvbnN0IHdyaXRlVGVtcGxhdGVzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuV1JJVEVfVEVNUExBVEVTKTtcclxuXHJcbmNvbnN0IGNyZWF0ZVVzZXIgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfVVNFUik7XHJcblxyXG5jb25zdCBzZXRQYXNzd29yZCA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlNFVF9QQVNTV09SRCk7XHJcblxyXG5jb25zdCByZWFkSW5kZXggPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuUkVBRF9JTkRFWCk7XHJcblxyXG5jb25zdCBtYW5hZ2VJbmRleCA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLk1BTkFHRV9JTkRFWCk7XHJcblxyXG5jb25zdCBtYW5hZ2VDb2xsZWN0aW9uID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuTUFOQUdFX0NPTExFQ1RJT04pO1xyXG5cclxuY29uc3QgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuQ1JFQVRFX1RFTVBPUkFSWV9BQ0NFU1MpO1xyXG5cclxuY29uc3QgZW5hYmxlRGlzYWJsZVVzZXIgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5FTkFCTEVfRElTQUJMRV9VU0VSKTtcclxuXHJcbmNvbnN0IHdyaXRlQWNjZXNzTGV2ZWxzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuV1JJVEVfQUNDRVNTX0xFVkVMUyk7XHJcblxyXG5jb25zdCBsaXN0VXNlcnMgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5MSVNUX1VTRVJTKTtcclxuXHJcbmNvbnN0IGxpc3RBY2Nlc3NMZXZlbHMgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5MSVNUX0FDQ0VTU19MRVZFTFMpO1xyXG5cclxuY29uc3Qgc2V0VXNlckFjY2Vzc0xldmVscyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlNFVF9VU0VSX0FDQ0VTU19MRVZFTFMpO1xyXG5cclxuY29uc3QgZXhlY3V0ZUFjdGlvbiA9IG5vZGVQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5FWEVDVVRFX0FDVElPTik7XHJcblxyXG5leHBvcnQgY29uc3QgYWx3YXlzQXV0aG9yaXplZCA9ICgpID0+IHRydWU7XHJcblxyXG5leHBvcnQgY29uc3QgcGVybWlzc2lvbiA9IHtcclxuICBjcmVhdGVSZWNvcmQsXHJcbiAgdXBkYXRlUmVjb3JkLFxyXG4gIGRlbGV0ZVJlY29yZCxcclxuICByZWFkUmVjb3JkLFxyXG4gIHdyaXRlVGVtcGxhdGVzLFxyXG4gIGNyZWF0ZVVzZXIsXHJcbiAgc2V0UGFzc3dvcmQsXHJcbiAgcmVhZEluZGV4LFxyXG4gIGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyxcclxuICBlbmFibGVEaXNhYmxlVXNlcixcclxuICB3cml0ZUFjY2Vzc0xldmVscyxcclxuICBsaXN0VXNlcnMsXHJcbiAgbGlzdEFjY2Vzc0xldmVscyxcclxuICBtYW5hZ2VJbmRleCxcclxuICBtYW5hZ2VDb2xsZWN0aW9uLFxyXG4gIGV4ZWN1dGVBY3Rpb24sXHJcbiAgc2V0VXNlckFjY2Vzc0xldmVscyxcclxufTtcclxuIiwiaW1wb3J0IHtcclxuICBrZXlCeSwgbWFwVmFsdWVzLFxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnc2hvcnRpZCc7XHJcbmltcG9ydCB7IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7IGdldE5ld0ZpZWxkVmFsdWUgfSBmcm9tICcuLi90eXBlcyc7XHJcbmltcG9ydCB7XHJcbiAgJCwgam9pbktleSwgc2FmZUtleSwgYXBpV3JhcHBlclN5bmMsIGV2ZW50cyxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TmV3ID0gYXBwID0+IChjb2xsZWN0aW9uS2V5LCByZWNvcmRUeXBlTmFtZSkgPT4ge1xyXG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRSZWNvcmROb2RlKGFwcCwgY29sbGVjdGlvbktleSwgcmVjb3JkVHlwZU5hbWUpO1xyXG4gIHJldHVybiBhcGlXcmFwcGVyU3luYyhcclxuICAgIGFwcCxcclxuICAgIGV2ZW50cy5yZWNvcmRBcGkuZ2V0TmV3LFxyXG4gICAgcGVybWlzc2lvbi5jcmVhdGVSZWNvcmQuaXNBdXRob3JpemVkKHJlY29yZE5vZGUubm9kZUtleSgpKSxcclxuICAgIHsgY29sbGVjdGlvbktleSwgcmVjb3JkVHlwZU5hbWUgfSxcclxuICAgIF9nZXROZXcsIHJlY29yZE5vZGUsIGNvbGxlY3Rpb25LZXksXHJcbiAgKTtcclxufTtcclxuXHJcbmNvbnN0IF9nZXROZXcgPSAocmVjb3JkTm9kZSwgY29sbGVjdGlvbktleSkgPT4gY29uc3RydWN0UmVjb3JkKHJlY29yZE5vZGUsIGdldE5ld0ZpZWxkVmFsdWUsIGNvbGxlY3Rpb25LZXkpO1xyXG5cclxuY29uc3QgZ2V0UmVjb3JkTm9kZSA9IChhcHAsIGNvbGxlY3Rpb25LZXkpID0+IHtcclxuICBjb2xsZWN0aW9uS2V5ID0gc2FmZUtleShjb2xsZWN0aW9uS2V5KTtcclxuICByZXR1cm4gZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoKGFwcC5oaWVyYXJjaHkpKGNvbGxlY3Rpb25LZXkpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldE5ld0NoaWxkID0gYXBwID0+IChyZWNvcmRLZXksIGNvbGxlY3Rpb25OYW1lLCByZWNvcmRUeXBlTmFtZSkgPT4gXHJcbiAgZ2V0TmV3KGFwcCkoam9pbktleShyZWNvcmRLZXksIGNvbGxlY3Rpb25OYW1lKSwgcmVjb3JkVHlwZU5hbWUpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbnN0cnVjdFJlY29yZCA9IChyZWNvcmROb2RlLCBnZXRGaWVsZFZhbHVlLCBjb2xsZWN0aW9uS2V5KSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xyXG4gICAga2V5QnkoJ25hbWUnKSxcclxuICAgIG1hcFZhbHVlcyhnZXRGaWVsZFZhbHVlKSxcclxuICBdKTtcclxuXHJcbiAgcmVjb3JkLmlkID0gYCR7cmVjb3JkTm9kZS5ub2RlSWR9LSR7Z2VuZXJhdGUoKX1gO1xyXG4gIHJlY29yZC5rZXkgPSBqb2luS2V5KGNvbGxlY3Rpb25LZXksIHJlY29yZC5pZCk7XHJcbiAgcmVjb3JkLmlzTmV3ID0gdHJ1ZTtcclxuICByZWNvcmQudHlwZSA9IHJlY29yZE5vZGUubmFtZTtcclxuICByZXR1cm4gcmVjb3JkO1xyXG59O1xyXG4iLCJpbXBvcnQge1xyXG4gIGtleUJ5LCBtYXBWYWx1ZXMsIGZpbHRlciwgXHJcbiAgbWFwLCBpbmNsdWRlcywgbGFzdCxcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBnZXRFeGFjdE5vZGVGb3JQYXRoLCBnZXROb2RlIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHsgc2FmZVBhcnNlRmllbGQgfSBmcm9tICcuLi90eXBlcyc7XHJcbmltcG9ydCB7XHJcbiAgJCwgc3BsaXRLZXksIHNhZmVLZXksIGlzTm9uRW1wdHlTdHJpbmcsXHJcbiAgYXBpV3JhcHBlciwgZXZlbnRzLCBqb2luS2V5LFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IG1hcFJlY29yZCB9IGZyb20gJy4uL2luZGV4aW5nL2V2YWx1YXRlJztcclxuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFJlY29yZEZpbGVOYW1lID0ga2V5ID0+IGpvaW5LZXkoa2V5LCAncmVjb3JkLmpzb24nKTtcclxuXHJcbmV4cG9ydCBjb25zdCBsb2FkID0gYXBwID0+IGFzeW5jIGtleSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMucmVjb3JkQXBpLmxvYWQsXHJcbiAgcGVybWlzc2lvbi5yZWFkUmVjb3JkLmlzQXV0aG9yaXplZChrZXkpLFxyXG4gIHsga2V5IH0sXHJcbiAgX2xvYWQsIGFwcCwga2V5LFxyXG4pO1xyXG5cclxuZXhwb3J0IGNvbnN0IF9sb2FkID0gYXN5bmMgKGFwcCwga2V5LCBrZXlTdGFjayA9IFtdKSA9PiB7XHJcbiAga2V5ID0gc2FmZUtleShrZXkpO1xyXG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKGtleSk7XHJcbiAgY29uc3Qgc3RvcmVkRGF0YSA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXHJcbiAgICBnZXRSZWNvcmRGaWxlTmFtZShrZXkpLFxyXG4gICk7XHJcblxyXG4gIGNvbnN0IGxvYWRlZFJlY29yZCA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcclxuICAgIGtleUJ5KCduYW1lJyksXHJcbiAgICBtYXBWYWx1ZXMoZiA9PiBzYWZlUGFyc2VGaWVsZChmLCBzdG9yZWREYXRhKSksXHJcbiAgXSk7XHJcblxyXG4gIGNvbnN0IG5ld0tleVN0YWNrID0gWy4uLmtleVN0YWNrLCBrZXldO1xyXG5cclxuICBjb25zdCByZWZlcmVuY2VzID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xyXG4gICAgZmlsdGVyKGYgPT4gZi50eXBlID09PSAncmVmZXJlbmNlJ1xyXG4gICAgICAgICAgICAgICAgICAgICYmIGlzTm9uRW1wdHlTdHJpbmcobG9hZGVkUmVjb3JkW2YubmFtZV0ua2V5KVxyXG4gICAgICAgICAgICAgICAgICAgICYmICFpbmNsdWRlcyhsb2FkZWRSZWNvcmRbZi5uYW1lXS5rZXkpKG5ld0tleVN0YWNrKSksXHJcbiAgICBtYXAoZiA9PiAoe1xyXG4gICAgICBwcm9taXNlOiBfbG9hZChhcHAsIGxvYWRlZFJlY29yZFtmLm5hbWVdLmtleSwgbmV3S2V5U3RhY2spLFxyXG4gICAgICBpbmRleDogZ2V0Tm9kZShhcHAuaGllcmFyY2h5LCBmLnR5cGVPcHRpb25zLmluZGV4Tm9kZUtleSksXHJcbiAgICAgIGZpZWxkOiBmLFxyXG4gICAgfSkpLFxyXG4gIF0pO1xyXG5cclxuICBpZiAocmVmZXJlbmNlcy5sZW5ndGggPiAwKSB7XHJcbiAgICBjb25zdCByZWZSZWNvcmRzID0gYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgIG1hcChwID0+IHAucHJvbWlzZSkocmVmZXJlbmNlcyksXHJcbiAgICApO1xyXG5cclxuICAgIGZvciAoY29uc3QgcmVmIG9mIHJlZmVyZW5jZXMpIHtcclxuICAgICAgbG9hZGVkUmVjb3JkW3JlZi5maWVsZC5uYW1lXSA9IG1hcFJlY29yZChcclxuICAgICAgICByZWZSZWNvcmRzW3JlZmVyZW5jZXMuaW5kZXhPZihyZWYpXSxcclxuICAgICAgICByZWYuaW5kZXgsXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsb2FkZWRSZWNvcmQudHJhbnNhY3Rpb25JZCA9IHN0b3JlZERhdGEudHJhbnNhY3Rpb25JZDtcclxuICBsb2FkZWRSZWNvcmQuaXNOZXcgPSBmYWxzZTtcclxuICBsb2FkZWRSZWNvcmQua2V5ID0ga2V5O1xyXG4gIGxvYWRlZFJlY29yZC5pZCA9ICQoa2V5LCBbc3BsaXRLZXksIGxhc3RdKTtcclxuICBsb2FkZWRSZWNvcmQudHlwZSA9IHJlY29yZE5vZGUubmFtZTtcclxuICByZXR1cm4gbG9hZGVkUmVjb3JkO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbG9hZDtcclxuIiwiLy8gYWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXg0ZXIvanMtcHJvbWlzZS1yZWFkYWJsZVxyXG4vLyB0aGFua3MgOilcclxuICBcclxuZXhwb3J0IGNvbnN0IHByb21pc2VSZWFkYWJsZVN0cmVhbSA9IHN0cmVhbSA9PiB7XHJcbiAgIFxyXG4gICAgbGV0IF9lcnJvcmVkO1xyXG5cclxuICAgIGNvbnN0IF9lcnJvckhhbmRsZXIgPSBlcnIgPT4ge1xyXG4gICAgICAgIF9lcnJvcmVkID0gZXJyO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBfZXJyb3JIYW5kbGVyKTtcclxuICBcclxuICAgIGNvbnN0IHJlYWQgPSAoc2l6ZSkgPT4ge1xyXG4gIFxyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGlmIChfZXJyb3JlZCkge1xyXG4gICAgICAgICAgY29uc3QgZXJyID0gX2Vycm9yZWQ7XHJcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKVxyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBpZiAoIXN0cmVhbS5yZWFkYWJsZSB8fCBzdHJlYW0uY2xvc2VkIHx8IHN0cmVhbS5kZXN0cm95ZWQpIHtcclxuICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGNvbnN0IHJlYWRhYmxlSGFuZGxlciA9ICgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGNodW5rID0gc3RyZWFtLnJlYWQoc2l6ZSk7XHJcbiAgXHJcbiAgICAgICAgICBpZiAoY2h1bmspIHtcclxuICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgICAgIHJlc29sdmUoY2h1bmspO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBjb25zdCBjbG9zZUhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgY29uc3QgZW5kSGFuZGxlciA9ICgpID0+IHtcclxuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBjb25zdCBlcnJvckhhbmRsZXIgPSAoZXJyKSA9PiB7XHJcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xyXG4gICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGNvbnN0IHJlbW92ZUxpc3RlbmVycyA9ICgpID0+IHtcclxuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImNsb3NlXCIsIGNsb3NlSGFuZGxlcik7XHJcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xyXG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZW5kXCIsIGVuZEhhbmRsZXIpO1xyXG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwicmVhZGFibGVcIiwgcmVhZGFibGVIYW5kbGVyKTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgc3RyZWFtLm9uKFwiY2xvc2VcIiwgY2xvc2VIYW5kbGVyKTtcclxuICAgICAgICBzdHJlYW0ub24oXCJlbmRcIiwgZW5kSGFuZGxlcik7XHJcbiAgICAgICAgc3RyZWFtLm9uKFwiZXJyb3JcIiwgZXJyb3JIYW5kbGVyKTtcclxuICAgICAgICBzdHJlYW0ub24oXCJyZWFkYWJsZVwiLCByZWFkYWJsZUhhbmRsZXIpO1xyXG4gIFxyXG4gICAgICAgIHJlYWRhYmxlSGFuZGxlcigpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICBcclxuICBcclxuICAgIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XHJcbiAgICAgIGlmIChzdHJlYW0pIHtcclxuICAgICAgICBpZiAoX2Vycm9ySGFuZGxlcikge1xyXG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgX2Vycm9ySGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2Ygc3RyZWFtLmRlc3Ryb3kgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgc3RyZWFtLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgXHJcbiAgICByZXR1cm4ge3JlYWQsIGRlc3Ryb3ksIHN0cmVhbX07XHJcbiAgfVxyXG4gIFxyXG4gIGV4cG9ydCBkZWZhdWx0IHByb21pc2VSZWFkYWJsZVN0cmVhbVxyXG4gICIsImltcG9ydCB7IGNvbXBpbGVDb2RlIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xyXG5pbXBvcnQge1xyXG4gIGZpbHRlciwgaW5jbHVkZXMsIG1hcCwgbGFzdCxcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQge1xyXG4gIGdldEFjdHVhbEtleU9mUGFyZW50LCBpc0dsb2JhbEluZGV4LFxyXG4gIGdldFBhcmVudEtleSwgaXNTaGFyZGVkSW5kZXgsXHJcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcclxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQge1xyXG4gIGpvaW5LZXksIGlzTm9uRW1wdHlTdHJpbmcsIHNwbGl0S2V5LCAkLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhlZERhdGFLZXkgPSAoaW5kZXhOb2RlLCBpbmRleEtleSwgcmVjb3JkKSA9PiB7XHJcbiAgY29uc3QgZ2V0U2hhcmROYW1lID0gKGluZGV4Tm9kZSwgcmVjb3JkKSA9PiB7XHJcbiAgICBjb25zdCBzaGFyZE5hbWVGdW5jID0gY29tcGlsZUNvZGUoaW5kZXhOb2RlLmdldFNoYXJkTmFtZSk7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXR1cm4gc2hhcmROYW1lRnVuYyh7IHJlY29yZCB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBjb25zdCBlcnJvckRldGFpbHMgPSBgc2hhcmRDb2RlOiAke2luZGV4Tm9kZS5nZXRTaGFyZE5hbWV9IDo6IHJlY29yZDogJHtKU09OLnN0cmluZ2lmeShyZWNvcmQpfSA6OiBgXHJcbiAgICAgIGUubWVzc2FnZSA9IFwiRXJyb3IgcnVubmluZyBpbmRleCBzaGFyZG5hbWUgZnVuYzogXCIgKyBlcnJvckRldGFpbHMgKyBlLm1lc3NhZ2U7XHJcbiAgICAgIHRocm93IGU7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgc2hhcmROYW1lID0gaXNOb25FbXB0eVN0cmluZyhpbmRleE5vZGUuZ2V0U2hhcmROYW1lKVxyXG4gICAgPyBgJHtnZXRTaGFyZE5hbWUoaW5kZXhOb2RlLCByZWNvcmQpfS5jc3ZgXHJcbiAgICA6ICdpbmRleC5jc3YnO1xyXG5cclxuICByZXR1cm4gam9pbktleShpbmRleEtleSwgc2hhcmROYW1lKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRTaGFyZEtleXNJblJhbmdlID0gYXN5bmMgKGFwcCwgaW5kZXhLZXksIHN0YXJ0UmVjb3JkID0gbnVsbCwgZW5kUmVjb3JkID0gbnVsbCkgPT4ge1xyXG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoaW5kZXhLZXkpO1xyXG5cclxuICBjb25zdCBzdGFydFNoYXJkTmFtZSA9ICFzdGFydFJlY29yZFxyXG4gICAgPyBudWxsXHJcbiAgICA6IHNoYXJkTmFtZUZyb21LZXkoXHJcbiAgICAgIGdldEluZGV4ZWREYXRhS2V5KFxyXG4gICAgICAgIGluZGV4Tm9kZSxcclxuICAgICAgICBpbmRleEtleSxcclxuICAgICAgICBzdGFydFJlY29yZCxcclxuICAgICAgKSxcclxuICAgICk7XHJcblxyXG4gIGNvbnN0IGVuZFNoYXJkTmFtZSA9ICFlbmRSZWNvcmRcclxuICAgID8gbnVsbFxyXG4gICAgOiBzaGFyZE5hbWVGcm9tS2V5KFxyXG4gICAgICBnZXRJbmRleGVkRGF0YUtleShcclxuICAgICAgICBpbmRleE5vZGUsXHJcbiAgICAgICAgaW5kZXhLZXksXHJcbiAgICAgICAgZW5kUmVjb3JkLFxyXG4gICAgICApLFxyXG4gICAgKTtcclxuXHJcbiAgcmV0dXJuICQoYXdhaXQgZ2V0U2hhcmRNYXAoYXBwLmRhdGFzdG9yZSwgaW5kZXhLZXkpLCBbXHJcbiAgICBmaWx0ZXIoayA9PiAoc3RhcnRSZWNvcmQgPT09IG51bGwgfHwgayA+PSBzdGFydFNoYXJkTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAmJiAoZW5kUmVjb3JkID09PSBudWxsIHx8IGsgPD0gZW5kU2hhcmROYW1lKSksXHJcbiAgICBtYXAoayA9PiBqb2luS2V5KGluZGV4S2V5LCBgJHtrfS5jc3ZgKSksXHJcbiAgXSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZW5zdXJlU2hhcmROYW1lSXNJblNoYXJkTWFwID0gYXN5bmMgKHN0b3JlLCBpbmRleEtleSwgaW5kZXhlZERhdGFLZXkpID0+IHtcclxuICBjb25zdCBtYXAgPSBhd2FpdCBnZXRTaGFyZE1hcChzdG9yZSwgaW5kZXhLZXkpO1xyXG4gIGNvbnN0IHNoYXJkTmFtZSA9IHNoYXJkTmFtZUZyb21LZXkoaW5kZXhlZERhdGFLZXkpO1xyXG4gIGlmICghaW5jbHVkZXMoc2hhcmROYW1lKShtYXApKSB7XHJcbiAgICBtYXAucHVzaChzaGFyZE5hbWUpO1xyXG4gICAgYXdhaXQgd3JpdGVTaGFyZE1hcChzdG9yZSwgaW5kZXhLZXksIG1hcCk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNoYXJkTWFwID0gYXN5bmMgKGRhdGFzdG9yZSwgaW5kZXhLZXkpID0+IHtcclxuICBjb25zdCBzaGFyZE1hcEtleSA9IGdldFNoYXJkTWFwS2V5KGluZGV4S2V5KTtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IGRhdGFzdG9yZS5sb2FkSnNvbihzaGFyZE1hcEtleSk7XHJcbiAgfSBjYXRjaCAoXykge1xyXG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oc2hhcmRNYXBLZXksIFtdKTtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3Qgd3JpdGVTaGFyZE1hcCA9IGFzeW5jIChkYXRhc3RvcmUsIGluZGV4S2V5LCBzaGFyZE1hcCkgPT4gYXdhaXQgZGF0YXN0b3JlLnVwZGF0ZUpzb24oXHJcbiAgZ2V0U2hhcmRNYXBLZXkoaW5kZXhLZXkpLFxyXG4gIHNoYXJkTWFwLFxyXG4pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEFsbFNoYXJkS2V5cyA9IGFzeW5jIChhcHAsIGluZGV4S2V5KSA9PiBhd2FpdCBnZXRTaGFyZEtleXNJblJhbmdlKGFwcCwgaW5kZXhLZXkpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNoYXJkTWFwS2V5ID0gaW5kZXhLZXkgPT4gam9pbktleShpbmRleEtleSwgJ3NoYXJkTWFwLmpzb24nKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXkgPSBpbmRleEtleSA9PiBqb2luS2V5KGluZGV4S2V5LCAnaW5kZXguY3N2Jyk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhGb2xkZXJLZXkgPSBpbmRleEtleSA9PiBpbmRleEtleTtcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVJbmRleEZpbGUgPSBhc3luYyAoZGF0YXN0b3JlLCBpbmRleGVkRGF0YUtleSwgaW5kZXgpID0+IHtcclxuICBpZiAoaXNTaGFyZGVkSW5kZXgoaW5kZXgpKSB7XHJcbiAgICBjb25zdCBpbmRleEtleSA9IGdldFBhcmVudEtleShpbmRleGVkRGF0YUtleSk7XHJcbiAgICBjb25zdCBzaGFyZE1hcCA9IGF3YWl0IGdldFNoYXJkTWFwKGRhdGFzdG9yZSwgaW5kZXhLZXkpO1xyXG4gICAgc2hhcmRNYXAucHVzaChcclxuICAgICAgc2hhcmROYW1lRnJvbUtleShpbmRleGVkRGF0YUtleSksXHJcbiAgICApO1xyXG4gICAgYXdhaXQgd3JpdGVTaGFyZE1hcChkYXRhc3RvcmUsIGluZGV4S2V5LCBzaGFyZE1hcCk7XHJcbiAgfVxyXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGaWxlKGluZGV4ZWREYXRhS2V5LCAnJyk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3Qgc2hhcmROYW1lRnJvbUtleSA9IGtleSA9PiAkKGtleSwgW1xyXG4gIHNwbGl0S2V5LFxyXG4gIGxhc3QsXHJcbl0pLnJlcGxhY2UoJy5jc3YnLCAnJyk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhLZXlfQmFzZWRPbkRlY2VuZGFudCA9IChkZWNlbmRhbnRLZXksIGluZGV4Tm9kZSkgPT4ge1xyXG4gIGlmIChpc0dsb2JhbEluZGV4KGluZGV4Tm9kZSkpIHsgcmV0dXJuIGAke2luZGV4Tm9kZS5ub2RlS2V5KCl9YDsgfVxyXG5cclxuICBjb25zdCBpbmRleGVkRGF0YVBhcmVudEtleSA9IGdldEFjdHVhbEtleU9mUGFyZW50KFxyXG4gICAgaW5kZXhOb2RlLnBhcmVudCgpLm5vZGVLZXkoKSxcclxuICAgIGRlY2VuZGFudEtleSxcclxuICApO1xyXG5cclxuICByZXR1cm4gam9pbktleShcclxuICAgIGluZGV4ZWREYXRhUGFyZW50S2V5LFxyXG4gICAgaW5kZXhOb2RlLm5hbWUsXHJcbiAgKTtcclxufTtcclxuIiwiaW1wb3J0IHtcclxuICBoYXMsIGtleXMsIG1hcCwgb3JkZXJCeSxcclxuICBmaWx0ZXIsIGNvbmNhdCwgcmV2ZXJzZSxcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7IG1hcFJlY29yZCB9IGZyb20gJy4vZXZhbHVhdGUnO1xyXG5pbXBvcnQgeyBjb25zdHJ1Y3RSZWNvcmQgfSBmcm9tICcuLi9yZWNvcmRBcGkvZ2V0TmV3JztcclxuaW1wb3J0IHsgZ2V0U2FtcGxlRmllbGRWYWx1ZSwgZGV0ZWN0VHlwZSwgYWxsIH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5pbXBvcnQgeyAkIH0gZnJvbSAnLi4vY29tbW9uJztcclxuXHJcbmV4cG9ydCBjb25zdCBnZW5lcmF0ZVNjaGVtYSA9IChoaWVyYXJjaHksIGluZGV4Tm9kZSkgPT4ge1xyXG4gIGNvbnN0IHJlY29yZE5vZGVzID0gZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgoaGllcmFyY2h5LCBpbmRleE5vZGUpO1xyXG4gIGNvbnN0IG1hcHBlZFJlY29yZHMgPSAkKHJlY29yZE5vZGVzLCBbXHJcbiAgICBtYXAobiA9PiBtYXBSZWNvcmQoY3JlYXRlU2FtcGxlUmVjb3JkKG4pLCBpbmRleE5vZGUpKSxcclxuICBdKTtcclxuXHJcbiAgLy8gYWx3YXlzIGhhcyByZWNvcmQga2V5IGFuZCBzb3J0IGtleVxyXG4gIGNvbnN0IHNjaGVtYSA9IHtcclxuICAgIHNvcnRLZXk6IGFsbC5zdHJpbmcsXHJcbiAgICBrZXk6IGFsbC5zdHJpbmcsXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZmllbGRzSGFzID0gaGFzKHNjaGVtYSk7XHJcbiAgY29uc3Qgc2V0RmllbGQgPSAoZmllbGROYW1lLCB2YWx1ZSkgPT4ge1xyXG4gICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgY29uc3QgdGhpc1R5cGUgPSBkZXRlY3RUeXBlKHZhbHVlKTtcclxuICAgIGlmIChmaWVsZHNIYXMoZmllbGROYW1lKSkge1xyXG4gICAgICBpZiAoc2NoZW1hW2ZpZWxkTmFtZV0gIT09IHRoaXNUeXBlKSB7XHJcbiAgICAgICAgc2NoZW1hW2ZpZWxkTmFtZV0gPSBhbGwuc3RyaW5nO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzY2hlbWFbZmllbGROYW1lXSA9IHRoaXNUeXBlO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGZvciAoY29uc3QgbWFwcGVkUmVjIG9mIG1hcHBlZFJlY29yZHMpIHtcclxuICAgIGZvciAoY29uc3QgZiBpbiBtYXBwZWRSZWMpIHtcclxuICAgICAgc2V0RmllbGQoZiwgbWFwcGVkUmVjW2ZdKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIHJldHVyaW5nIGFuIGFycmF5IG9mIHtuYW1lLCB0eXBlfVxyXG4gIHJldHVybiAkKHNjaGVtYSwgW1xyXG4gICAga2V5cyxcclxuICAgIG1hcChrID0+ICh7IG5hbWU6IGssIHR5cGU6IHNjaGVtYVtrXS5uYW1lIH0pKSxcclxuICAgIGZpbHRlcihzID0+IHMubmFtZSAhPT0gJ3NvcnRLZXknKSxcclxuICAgIG9yZGVyQnkoJ25hbWUnLCBbJ2Rlc2MnXSksIC8vIHJldmVyc2UgYXBsaGFcclxuICAgIGNvbmNhdChbeyBuYW1lOiAnc29ydEtleScsIHR5cGU6IGFsbC5zdHJpbmcubmFtZSB9XSksIC8vIHNvcnRLZXkgb24gZW5kXHJcbiAgICByZXZlcnNlLCAvLyBzb3J0S2V5IGZpcnN0LCB0aGVuIHJlc3QgYXJlIGFscGhhYmV0aWNhbFxyXG4gIF0pO1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlU2FtcGxlUmVjb3JkID0gcmVjb3JkTm9kZSA9PiBjb25zdHJ1Y3RSZWNvcmQoXHJcbiAgcmVjb3JkTm9kZSxcclxuICBnZXRTYW1wbGVGaWVsZFZhbHVlLFxyXG4gIHJlY29yZE5vZGUucGFyZW50KCkubm9kZUtleSgpLFxyXG4pO1xyXG4iLCJleHBvcnQgZGVmYXVsdCAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6XG4gICAgICAgICAgICB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOlxuICAgICAgICAgICAgdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KTtcbiIsIlxudmFyIGxvb2t1cCA9IFtdXG52YXIgcmV2TG9va3VwID0gW11cbnZhciBBcnIgPSB0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcgPyBVaW50OEFycmF5IDogQXJyYXlcbnZhciBpbml0ZWQgPSBmYWxzZTtcbmZ1bmN0aW9uIGluaXQgKCkge1xuICBpbml0ZWQgPSB0cnVlO1xuICB2YXIgY29kZSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJ1xuICBmb3IgKHZhciBpID0gMCwgbGVuID0gY29kZS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGxvb2t1cFtpXSA9IGNvZGVbaV1cbiAgICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGlcbiAgfVxuXG4gIHJldkxvb2t1cFsnLScuY2hhckNvZGVBdCgwKV0gPSA2MlxuICByZXZMb29rdXBbJ18nLmNoYXJDb2RlQXQoMCldID0gNjNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQnl0ZUFycmF5IChiNjQpIHtcbiAgaWYgKCFpbml0ZWQpIHtcbiAgICBpbml0KCk7XG4gIH1cbiAgdmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcbiAgdmFyIGxlbiA9IGI2NC5sZW5ndGhcblxuICBpZiAobGVuICUgNCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuICB9XG5cbiAgLy8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcbiAgLy8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuICAvLyByZXByZXNlbnQgb25lIGJ5dGVcbiAgLy8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG4gIC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2VcbiAgcGxhY2VIb2xkZXJzID0gYjY0W2xlbiAtIDJdID09PSAnPScgPyAyIDogYjY0W2xlbiAtIDFdID09PSAnPScgPyAxIDogMFxuXG4gIC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuICBhcnIgPSBuZXcgQXJyKGxlbiAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG4gIC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcbiAgbCA9IHBsYWNlSG9sZGVycyA+IDAgPyBsZW4gLSA0IDogbGVuXG5cbiAgdmFyIEwgPSAwXG5cbiAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCAxMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPDwgNikgfCByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxuICAgIGFycltMKytdID0gKHRtcCA+PiAxNikgJiAweEZGXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDIpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldID4+IDQpXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDQpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildID4+IDIpXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuICByZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICsgbG9va3VwW251bSA+PiAxMiAmIDB4M0ZdICsgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gKyBsb29rdXBbbnVtICYgMHgzRl1cbn1cblxuZnVuY3Rpb24gZW5jb2RlQ2h1bmsgKHVpbnQ4LCBzdGFydCwgZW5kKSB7XG4gIHZhciB0bXBcbiAgdmFyIG91dHB1dCA9IFtdXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSAzKSB7XG4gICAgdG1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxuICB9XG4gIHJldHVybiBvdXRwdXQuam9pbignJylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21CeXRlQXJyYXkgKHVpbnQ4KSB7XG4gIGlmICghaW5pdGVkKSB7XG4gICAgaW5pdCgpO1xuICB9XG4gIHZhciB0bXBcbiAgdmFyIGxlbiA9IHVpbnQ4Lmxlbmd0aFxuICB2YXIgZXh0cmFCeXRlcyA9IGxlbiAlIDMgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcbiAgdmFyIG91dHB1dCA9ICcnXG4gIHZhciBwYXJ0cyA9IFtdXG4gIHZhciBtYXhDaHVua0xlbmd0aCA9IDE2MzgzIC8vIG11c3QgYmUgbXVsdGlwbGUgb2YgM1xuXG4gIC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbjIgPSBsZW4gLSBleHRyYUJ5dGVzOyBpIDwgbGVuMjsgaSArPSBtYXhDaHVua0xlbmd0aCkge1xuICAgIHBhcnRzLnB1c2goZW5jb2RlQ2h1bmsodWludDgsIGksIChpICsgbWF4Q2h1bmtMZW5ndGgpID4gbGVuMiA/IGxlbjIgOiAoaSArIG1heENodW5rTGVuZ3RoKSkpXG4gIH1cblxuICAvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG4gIGlmIChleHRyYUJ5dGVzID09PSAxKSB7XG4gICAgdG1wID0gdWludDhbbGVuIC0gMV1cbiAgICBvdXRwdXQgKz0gbG9va3VwW3RtcCA+PiAyXVxuICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA8PCA0KSAmIDB4M0ZdXG4gICAgb3V0cHV0ICs9ICc9PSdcbiAgfSBlbHNlIGlmIChleHRyYUJ5dGVzID09PSAyKSB7XG4gICAgdG1wID0gKHVpbnQ4W2xlbiAtIDJdIDw8IDgpICsgKHVpbnQ4W2xlbiAtIDFdKVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDEwXVxuICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA+PiA0KSAmIDB4M0ZdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDIpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz0nXG4gIH1cblxuICBwYXJ0cy5wdXNoKG91dHB1dClcblxuICByZXR1cm4gcGFydHMuam9pbignJylcbn1cbiIsIlxuZXhwb3J0IGZ1bmN0aW9uIHJlYWQgKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IG0gKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gd3JpdGUgKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAodmFsdWUgKiBjIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxuZXhwb3J0IGRlZmF1bHQgQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoYXJyKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGFycikgPT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xuXG5cbmltcG9ydCAqIGFzIGJhc2U2NCBmcm9tICcuL2Jhc2U2NCdcbmltcG9ydCAqIGFzIGllZWU3NTQgZnJvbSAnLi9pZWVlNzU0J1xuaW1wb3J0IGlzQXJyYXkgZnJvbSAnLi9pc0FycmF5J1xuXG5leHBvcnQgdmFyIElOU1BFQ1RfTUFYX0JZVEVTID0gNTBcblxuLyoqXG4gKiBJZiBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAobW9zdCBjb21wYXRpYmxlLCBldmVuIElFNilcbiAqXG4gKiBCcm93c2VycyB0aGF0IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssIENocm9tZSA3KywgU2FmYXJpIDUuMSssXG4gKiBPcGVyYSAxMS42KywgaU9TIDQuMisuXG4gKlxuICogRHVlIHRvIHZhcmlvdXMgYnJvd3NlciBidWdzLCBzb21ldGltZXMgdGhlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiB3aWxsIGJlIHVzZWQgZXZlblxuICogd2hlbiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0eXBlZCBhcnJheXMuXG4gKlxuICogTm90ZTpcbiAqXG4gKiAgIC0gRmlyZWZveCA0LTI5IGxhY2tzIHN1cHBvcnQgZm9yIGFkZGluZyBuZXcgcHJvcGVydGllcyB0byBgVWludDhBcnJheWAgaW5zdGFuY2VzLFxuICogICAgIFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4LlxuICpcbiAqICAgLSBDaHJvbWUgOS0xMCBpcyBtaXNzaW5nIHRoZSBgVHlwZWRBcnJheS5wcm90b3R5cGUuc3ViYXJyYXlgIGZ1bmN0aW9uLlxuICpcbiAqICAgLSBJRTEwIGhhcyBhIGJyb2tlbiBgVHlwZWRBcnJheS5wcm90b3R5cGUuc3ViYXJyYXlgIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYXJyYXlzIG9mXG4gKiAgICAgaW5jb3JyZWN0IGxlbmd0aCBpbiBzb21lIHNpdHVhdGlvbnMuXG5cbiAqIFdlIGRldGVjdCB0aGVzZSBidWdneSBicm93c2VycyBhbmQgc2V0IGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGAgdG8gYGZhbHNlYCBzbyB0aGV5XG4gKiBnZXQgdGhlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiwgd2hpY2ggaXMgc2xvd2VyIGJ1dCBiZWhhdmVzIGNvcnJlY3RseS5cbiAqL1xuQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgPSBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVCAhPT0gdW5kZWZpbmVkXG4gID8gZ2xvYmFsLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgOiB0cnVlXG5cbi8qXG4gKiBFeHBvcnQga01heExlbmd0aCBhZnRlciB0eXBlZCBhcnJheSBzdXBwb3J0IGlzIGRldGVybWluZWQuXG4gKi9cbnZhciBfa01heExlbmd0aCA9IGtNYXhMZW5ndGgoKVxuZXhwb3J0IHtfa01heExlbmd0aCBhcyBrTWF4TGVuZ3RofTtcbmZ1bmN0aW9uIHR5cGVkQXJyYXlTdXBwb3J0ICgpIHtcbiAgcmV0dXJuIHRydWU7XG4gIC8vIHJvbGx1cCBpc3N1ZXNcbiAgLy8gdHJ5IHtcbiAgLy8gICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoMSlcbiAgLy8gICBhcnIuX19wcm90b19fID0ge1xuICAvLyAgICAgX19wcm90b19fOiBVaW50OEFycmF5LnByb3RvdHlwZSxcbiAgLy8gICAgIGZvbzogZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuICAvLyAgIH1cbiAgLy8gICByZXR1cm4gYXJyLmZvbygpID09PSA0MiAmJiAvLyB0eXBlZCBhcnJheSBpbnN0YW5jZXMgY2FuIGJlIGF1Z21lbnRlZFxuICAvLyAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nICYmIC8vIGNocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICAvLyAgICAgICBhcnIuc3ViYXJyYXkoMSwgMSkuYnl0ZUxlbmd0aCA9PT0gMCAvLyBpZTEwIGhhcyBicm9rZW4gYHN1YmFycmF5YFxuICAvLyB9IGNhdGNoIChlKSB7XG4gIC8vICAgcmV0dXJuIGZhbHNlXG4gIC8vIH1cbn1cblxuZnVuY3Rpb24ga01heExlbmd0aCAoKSB7XG4gIHJldHVybiBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVFxuICAgID8gMHg3ZmZmZmZmZlxuICAgIDogMHgzZmZmZmZmZlxufVxuXG5mdW5jdGlvbiBjcmVhdGVCdWZmZXIgKHRoYXQsIGxlbmd0aCkge1xuICBpZiAoa01heExlbmd0aCgpIDwgbGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgdHlwZWQgYXJyYXkgbGVuZ3RoJylcbiAgfVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gbmV3IFVpbnQ4QXJyYXkobGVuZ3RoKVxuICAgIHRoYXQuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gYW4gb2JqZWN0IGluc3RhbmNlIG9mIHRoZSBCdWZmZXIgY2xhc3NcbiAgICBpZiAodGhhdCA9PT0gbnVsbCkge1xuICAgICAgdGhhdCA9IG5ldyBCdWZmZXIobGVuZ3RoKVxuICAgIH1cbiAgICB0aGF0Lmxlbmd0aCA9IGxlbmd0aFxuICB9XG5cbiAgcmV0dXJuIHRoYXRcbn1cblxuLyoqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGhhdmUgdGhlaXJcbiAqIHByb3RvdHlwZSBjaGFuZ2VkIHRvIGBCdWZmZXIucHJvdG90eXBlYC4gRnVydGhlcm1vcmUsIGBCdWZmZXJgIGlzIGEgc3ViY2xhc3Mgb2ZcbiAqIGBVaW50OEFycmF5YCwgc28gdGhlIHJldHVybmVkIGluc3RhbmNlcyB3aWxsIGhhdmUgYWxsIHRoZSBub2RlIGBCdWZmZXJgIG1ldGhvZHNcbiAqIGFuZCB0aGUgYFVpbnQ4QXJyYXlgIG1ldGhvZHMuIFNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0XG4gKiByZXR1cm5zIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIFRoZSBgVWludDhBcnJheWAgcHJvdG90eXBlIHJlbWFpbnMgdW5tb2RpZmllZC5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gQnVmZmVyIChhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmICEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIC8vIENvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdJZiBlbmNvZGluZyBpcyBzcGVjaWZpZWQgdGhlbiB0aGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZydcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGFsbG9jVW5zYWZlKHRoaXMsIGFyZylcbiAgfVxuICByZXR1cm4gZnJvbSh0aGlzLCBhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbi8vIFRPRE86IExlZ2FjeSwgbm90IG5lZWRlZCBhbnltb3JlLiBSZW1vdmUgaW4gbmV4dCBtYWpvciB2ZXJzaW9uLlxuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIGZyb20gKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKVxuICB9XG5cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZyb21TdHJpbmcodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQpXG4gIH1cblxuICByZXR1cm4gZnJvbU9iamVjdCh0aGF0LCB2YWx1ZSlcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsbHkgZXF1aXZhbGVudCB0byBCdWZmZXIoYXJnLCBlbmNvZGluZykgYnV0IHRocm93cyBhIFR5cGVFcnJvclxuICogaWYgdmFsdWUgaXMgYSBudW1iZXIuXG4gKiBCdWZmZXIuZnJvbShzdHJbLCBlbmNvZGluZ10pXG4gKiBCdWZmZXIuZnJvbShhcnJheSlcbiAqIEJ1ZmZlci5mcm9tKGJ1ZmZlcilcbiAqIEJ1ZmZlci5mcm9tKGFycmF5QnVmZmVyWywgYnl0ZU9mZnNldFssIGxlbmd0aF1dKVxuICoqL1xuQnVmZmVyLmZyb20gPSBmdW5jdGlvbiAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gZnJvbShudWxsLCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5pZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgQnVmZmVyLnByb3RvdHlwZS5fX3Byb3RvX18gPSBVaW50OEFycmF5LnByb3RvdHlwZVxuICBCdWZmZXIuX19wcm90b19fID0gVWludDhBcnJheVxuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnNwZWNpZXMgJiZcbiAgICAgIEJ1ZmZlcltTeW1ib2wuc3BlY2llc10gPT09IEJ1ZmZlcikge1xuICAgIC8vIEZpeCBzdWJhcnJheSgpIGluIEVTMjAxNi4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzk3XG4gICAgLy8gT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlciwgU3ltYm9sLnNwZWNpZXMsIHtcbiAgICAvLyAgIHZhbHVlOiBudWxsLFxuICAgIC8vICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgLy8gfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnRTaXplIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyJylcbiAgfSBlbHNlIGlmIChzaXplIDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBuZWdhdGl2ZScpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWxsb2MgKHRoYXQsIHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgaWYgKHNpemUgPD0gMCkge1xuICAgIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSlcbiAgfVxuICBpZiAoZmlsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT25seSBwYXkgYXR0ZW50aW9uIHRvIGVuY29kaW5nIGlmIGl0J3MgYSBzdHJpbmcuIFRoaXNcbiAgICAvLyBwcmV2ZW50cyBhY2NpZGVudGFsbHkgc2VuZGluZyBpbiBhIG51bWJlciB0aGF0IHdvdWxkXG4gICAgLy8gYmUgaW50ZXJwcmV0dGVkIGFzIGEgc3RhcnQgb2Zmc2V0LlxuICAgIHJldHVybiB0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnXG4gICAgICA/IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwsIGVuY29kaW5nKVxuICAgICAgOiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSkuZmlsbChmaWxsKVxuICB9XG4gIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSlcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiBhbGxvYyhzaXplWywgZmlsbFssIGVuY29kaW5nXV0pXG4gKiovXG5CdWZmZXIuYWxsb2MgPSBmdW5jdGlvbiAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGFsbG9jKG51bGwsIHNpemUsIGZpbGwsIGVuY29kaW5nKVxufVxuXG5mdW5jdGlvbiBhbGxvY1Vuc2FmZSAodGhhdCwgc2l6ZSkge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSA8IDAgPyAwIDogY2hlY2tlZChzaXplKSB8IDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7ICsraSkge1xuICAgICAgdGhhdFtpXSA9IDBcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIEJ1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShudWxsLCBzaXplKVxufVxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIFNsb3dCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShudWxsLCBzaXplKVxufVxuXG5mdW5jdGlvbiBmcm9tU3RyaW5nICh0aGF0LCBzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnIHx8IGVuY29kaW5nID09PSAnJykge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZW5jb2RpbmdcIiBtdXN0IGJlIGEgdmFsaWQgc3RyaW5nIGVuY29kaW5nJylcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBieXRlTGVuZ3RoKHN0cmluZywgZW5jb2RpbmcpIHwgMFxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbmd0aClcblxuICB2YXIgYWN0dWFsID0gdGhhdC53cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuXG4gIGlmIChhY3R1YWwgIT09IGxlbmd0aCkge1xuICAgIC8vIFdyaXRpbmcgYSBoZXggc3RyaW5nLCBmb3IgZXhhbXBsZSwgdGhhdCBjb250YWlucyBpbnZhbGlkIGNoYXJhY3RlcnMgd2lsbFxuICAgIC8vIGNhdXNlIGV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGZpcnN0IGludmFsaWQgY2hhcmFjdGVyIHRvIGJlIGlnbm9yZWQuIChlLmcuXG4gICAgLy8gJ2FieHhjZCcgd2lsbCBiZSB0cmVhdGVkIGFzICdhYicpXG4gICAgdGhhdCA9IHRoYXQuc2xpY2UoMCwgYWN0dWFsKVxuICB9XG5cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCA8IDAgPyAwIDogY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIHRoYXRbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUJ1ZmZlciAodGhhdCwgYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICBhcnJheS5ieXRlTGVuZ3RoIC8vIHRoaXMgdGhyb3dzIGlmIGBhcnJheWAgaXMgbm90IGEgdmFsaWQgQXJyYXlCdWZmZXJcblxuICBpZiAoYnl0ZU9mZnNldCA8IDAgfHwgYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXFwnb2Zmc2V0XFwnIGlzIG91dCBvZiBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0ICsgKGxlbmd0aCB8fCAwKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdsZW5ndGhcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYnl0ZU9mZnNldCA9PT0gdW5kZWZpbmVkICYmIGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSlcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQpXG4gIH0gZWxzZSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgdGhhdCA9IGFycmF5XG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIHRoYXQgPSBmcm9tQXJyYXlMaWtlKHRoYXQsIGFycmF5KVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKHRoYXQsIG9iaikge1xuICBpZiAoaW50ZXJuYWxJc0J1ZmZlcihvYmopKSB7XG4gICAgdmFyIGxlbiA9IGNoZWNrZWQob2JqLmxlbmd0aCkgfCAwXG4gICAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBsZW4pXG5cbiAgICBpZiAodGhhdC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGF0XG4gICAgfVxuXG4gICAgb2JqLmNvcHkodGhhdCwgMCwgMCwgbGVuKVxuICAgIHJldHVybiB0aGF0XG4gIH1cblxuICBpZiAob2JqKSB7XG4gICAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgIG9iai5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikgfHwgJ2xlbmd0aCcgaW4gb2JqKSB7XG4gICAgICBpZiAodHlwZW9mIG9iai5sZW5ndGggIT09ICdudW1iZXInIHx8IGlzbmFuKG9iai5sZW5ndGgpKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgMClcbiAgICAgIH1cbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iailcbiAgICB9XG5cbiAgICBpZiAob2JqLnR5cGUgPT09ICdCdWZmZXInICYmIGlzQXJyYXkob2JqLmRhdGEpKSB7XG4gICAgICByZXR1cm4gZnJvbUFycmF5TGlrZSh0aGF0LCBvYmouZGF0YSlcbiAgICB9XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nLCBCdWZmZXIsIEFycmF5QnVmZmVyLCBBcnJheSwgb3IgYXJyYXktbGlrZSBvYmplY3QuJylcbn1cblxuZnVuY3Rpb24gY2hlY2tlZCAobGVuZ3RoKSB7XG4gIC8vIE5vdGU6IGNhbm5vdCB1c2UgYGxlbmd0aCA8IGtNYXhMZW5ndGgoKWAgaGVyZSBiZWNhdXNlIHRoYXQgZmFpbHMgd2hlblxuICAvLyBsZW5ndGggaXMgTmFOICh3aGljaCBpcyBvdGhlcndpc2UgY29lcmNlZCB0byB6ZXJvLilcbiAgaWYgKGxlbmd0aCA+PSBrTWF4TGVuZ3RoKCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnc2l6ZTogMHgnICsga01heExlbmd0aCgpLnRvU3RyaW5nKDE2KSArICcgYnl0ZXMnKVxuICB9XG4gIHJldHVybiBsZW5ndGggfCAwXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTbG93QnVmZmVyIChsZW5ndGgpIHtcbiAgaWYgKCtsZW5ndGggIT0gbGVuZ3RoKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZXFlcWVxXG4gICAgbGVuZ3RoID0gMFxuICB9XG4gIHJldHVybiBCdWZmZXIuYWxsb2MoK2xlbmd0aClcbn1cbkJ1ZmZlci5pc0J1ZmZlciA9IGlzQnVmZmVyO1xuZnVuY3Rpb24gaW50ZXJuYWxJc0J1ZmZlciAoYikge1xuICByZXR1cm4gISEoYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKGEsIGIpIHtcbiAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKGEpIHx8ICFpbnRlcm5hbElzQnVmZmVyKGIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIG11c3QgYmUgQnVmZmVycycpXG4gIH1cblxuICBpZiAoYSA9PT0gYikgcmV0dXJuIDBcblxuICB2YXIgeCA9IGEubGVuZ3RoXG4gIHZhciB5ID0gYi5sZW5ndGhcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXVxuICAgICAgeSA9IGJbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIGlzRW5jb2RpbmcgKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gY29uY2F0IChsaXN0LCBsZW5ndGgpIHtcbiAgaWYgKCFpc0FycmF5KGxpc3QpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBCdWZmZXIuYWxsb2MoMClcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGxlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgbGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShsZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIGJ1ZiA9IGxpc3RbaV1cbiAgICBpZiAoIWludGVybmFsSXNCdWZmZXIoYnVmKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgICB9XG4gICAgYnVmLmNvcHkoYnVmZmVyLCBwb3MpXG4gICAgcG9zICs9IGJ1Zi5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmZmVyXG59XG5cbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKGludGVybmFsSXNCdWZmZXIoc3RyaW5nKSkge1xuICAgIHJldHVybiBzdHJpbmcubGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIEFycmF5QnVmZmVyLmlzVmlldyA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgKEFycmF5QnVmZmVyLmlzVmlldyhzdHJpbmcpIHx8IHN0cmluZyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSkge1xuICAgIHJldHVybiBzdHJpbmcuYnl0ZUxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuICAgIHN0cmluZyA9ICcnICsgc3RyaW5nXG4gIH1cblxuICB2YXIgbGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAobGVuID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIFVzZSBhIGZvciBsb29wIHRvIGF2b2lkIHJlY3Vyc2lvblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsZW5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIGxlbiAqIDJcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBsZW4gPj4+IDFcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aCAvLyBhc3N1bWUgdXRmOFxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuQnVmZmVyLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5cbmZ1bmN0aW9uIHNsb3dUb1N0cmluZyAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcblxuICAvLyBObyBuZWVkIHRvIHZlcmlmeSB0aGF0IFwidGhpcy5sZW5ndGggPD0gTUFYX1VJTlQzMlwiIHNpbmNlIGl0J3MgYSByZWFkLW9ubHlcbiAgLy8gcHJvcGVydHkgb2YgYSB0eXBlZCBhcnJheS5cblxuICAvLyBUaGlzIGJlaGF2ZXMgbmVpdGhlciBsaWtlIFN0cmluZyBub3IgVWludDhBcnJheSBpbiB0aGF0IHdlIHNldCBzdGFydC9lbmRcbiAgLy8gdG8gdGhlaXIgdXBwZXIvbG93ZXIgYm91bmRzIGlmIHRoZSB2YWx1ZSBwYXNzZWQgaXMgb3V0IG9mIHJhbmdlLlxuICAvLyB1bmRlZmluZWQgaXMgaGFuZGxlZCBzcGVjaWFsbHkgYXMgcGVyIEVDTUEtMjYyIDZ0aCBFZGl0aW9uLFxuICAvLyBTZWN0aW9uIDEzLjMuMy43IFJ1bnRpbWUgU2VtYW50aWNzOiBLZXllZEJpbmRpbmdJbml0aWFsaXphdGlvbi5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQgfHwgc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgLy8gUmV0dXJuIGVhcmx5IGlmIHN0YXJ0ID4gdGhpcy5sZW5ndGguIERvbmUgaGVyZSB0byBwcmV2ZW50IHBvdGVudGlhbCB1aW50MzJcbiAgLy8gY29lcmNpb24gZmFpbCBiZWxvdy5cbiAgaWYgKHN0YXJ0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCB8fCBlbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoZW5kIDw9IDApIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIC8vIEZvcmNlIGNvZXJzaW9uIHRvIHVpbnQzMi4gVGhpcyB3aWxsIGFsc28gY29lcmNlIGZhbHNleS9OYU4gdmFsdWVzIHRvIDAuXG4gIGVuZCA+Pj49IDBcbiAgc3RhcnQgPj4+PSAwXG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGF0aW4xU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1dGYxNmxlU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKGVuY29kaW5nICsgJycpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbi8vIFRoZSBwcm9wZXJ0eSBpcyB1c2VkIGJ5IGBCdWZmZXIuaXNCdWZmZXJgIGFuZCBgaXMtYnVmZmVyYCAoaW4gU2FmYXJpIDUtNykgdG8gZGV0ZWN0XG4vLyBCdWZmZXIgaW5zdGFuY2VzLlxuQnVmZmVyLnByb3RvdHlwZS5faXNCdWZmZXIgPSB0cnVlXG5cbmZ1bmN0aW9uIHN3YXAgKGIsIG4sIG0pIHtcbiAgdmFyIGkgPSBiW25dXG4gIGJbbl0gPSBiW21dXG4gIGJbbV0gPSBpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDE2ID0gZnVuY3Rpb24gc3dhcDE2ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSAyICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAxNi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMSlcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAzMiA9IGZ1bmN0aW9uIHN3YXAzMiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgNCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMzItYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDMpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDIpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwNjQgPSBmdW5jdGlvbiBzd2FwNjQgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDggIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDY0LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDgpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyA3KVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyA2KVxuICAgIHN3YXAodGhpcywgaSArIDIsIGkgKyA1KVxuICAgIHN3YXAodGhpcywgaSArIDMsIGkgKyA0KVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCB8IDBcbiAgaWYgKGxlbmd0aCA9PT0gMCkgcmV0dXJuICcnXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIDAsIGxlbmd0aClcbiAgcmV0dXJuIHNsb3dUb1N0cmluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gZXF1YWxzIChiKSB7XG4gIGlmICghaW50ZXJuYWxJc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYikgPT09IDBcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gIHZhciBzdHIgPSAnJ1xuICB2YXIgbWF4ID0gSU5TUEVDVF9NQVhfQllURVNcbiAgaWYgKHRoaXMubGVuZ3RoID4gMCkge1xuICAgIHN0ciA9IHRoaXMudG9TdHJpbmcoJ2hleCcsIDAsIG1heCkubWF0Y2goLy57Mn0vZykuam9pbignICcpXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbWF4KSBzdHIgKz0gJyAuLi4gJ1xuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgc3RyICsgJz4nXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKHRhcmdldCwgc3RhcnQsIGVuZCwgdGhpc1N0YXJ0LCB0aGlzRW5kKSB7XG4gIGlmICghaW50ZXJuYWxJc0J1ZmZlcih0YXJnZXQpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIH1cblxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuZCA9IHRhcmdldCA/IHRhcmdldC5sZW5ndGggOiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1N0YXJ0ID0gMFxuICB9XG4gIGlmICh0aGlzRW5kID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzRW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChzdGFydCA8IDAgfHwgZW5kID4gdGFyZ2V0Lmxlbmd0aCB8fCB0aGlzU3RhcnQgPCAwIHx8IHRoaXNFbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdvdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kICYmIHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kKSB7XG4gICAgcmV0dXJuIC0xXG4gIH1cbiAgaWYgKHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAxXG4gIH1cblxuICBzdGFydCA+Pj49IDBcbiAgZW5kID4+Pj0gMFxuICB0aGlzU3RhcnQgPj4+PSAwXG4gIHRoaXNFbmQgPj4+PSAwXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCkgcmV0dXJuIDBcblxuICB2YXIgeCA9IHRoaXNFbmQgLSB0aGlzU3RhcnRcbiAgdmFyIHkgPSBlbmQgLSBzdGFydFxuICB2YXIgbGVuID0gTWF0aC5taW4oeCwgeSlcblxuICB2YXIgdGhpc0NvcHkgPSB0aGlzLnNsaWNlKHRoaXNTdGFydCwgdGhpc0VuZClcbiAgdmFyIHRhcmdldENvcHkgPSB0YXJnZXQuc2xpY2Uoc3RhcnQsIGVuZClcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKHRoaXNDb3B5W2ldICE9PSB0YXJnZXRDb3B5W2ldKSB7XG4gICAgICB4ID0gdGhpc0NvcHlbaV1cbiAgICAgIHkgPSB0YXJnZXRDb3B5W2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuLy8gRmluZHMgZWl0aGVyIHRoZSBmaXJzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPj0gYGJ5dGVPZmZzZXRgLFxuLy8gT1IgdGhlIGxhc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0IDw9IGBieXRlT2Zmc2V0YC5cbi8vXG4vLyBBcmd1bWVudHM6XG4vLyAtIGJ1ZmZlciAtIGEgQnVmZmVyIHRvIHNlYXJjaFxuLy8gLSB2YWwgLSBhIHN0cmluZywgQnVmZmVyLCBvciBudW1iZXJcbi8vIC0gYnl0ZU9mZnNldCAtIGFuIGluZGV4IGludG8gYGJ1ZmZlcmA7IHdpbGwgYmUgY2xhbXBlZCB0byBhbiBpbnQzMlxuLy8gLSBlbmNvZGluZyAtIGFuIG9wdGlvbmFsIGVuY29kaW5nLCByZWxldmFudCBpcyB2YWwgaXMgYSBzdHJpbmdcbi8vIC0gZGlyIC0gdHJ1ZSBmb3IgaW5kZXhPZiwgZmFsc2UgZm9yIGxhc3RJbmRleE9mXG5mdW5jdGlvbiBiaWRpcmVjdGlvbmFsSW5kZXhPZiAoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgLy8gRW1wdHkgYnVmZmVyIG1lYW5zIG5vIG1hdGNoXG4gIGlmIChidWZmZXIubGVuZ3RoID09PSAwKSByZXR1cm4gLTFcblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldFxuICBpZiAodHlwZW9mIGJ5dGVPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBieXRlT2Zmc2V0XG4gICAgYnl0ZU9mZnNldCA9IDBcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0ID4gMHg3ZmZmZmZmZikge1xuICAgIGJ5dGVPZmZzZXQgPSAweDdmZmZmZmZmXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IC0weDgwMDAwMDAwKSB7XG4gICAgYnl0ZU9mZnNldCA9IC0weDgwMDAwMDAwXG4gIH1cbiAgYnl0ZU9mZnNldCA9ICtieXRlT2Zmc2V0ICAvLyBDb2VyY2UgdG8gTnVtYmVyLlxuICBpZiAoaXNOYU4oYnl0ZU9mZnNldCkpIHtcbiAgICAvLyBieXRlT2Zmc2V0OiBpdCBpdCdzIHVuZGVmaW5lZCwgbnVsbCwgTmFOLCBcImZvb1wiLCBldGMsIHNlYXJjaCB3aG9sZSBidWZmZXJcbiAgICBieXRlT2Zmc2V0ID0gZGlyID8gMCA6IChidWZmZXIubGVuZ3RoIC0gMSlcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0OiBuZWdhdGl2ZSBvZmZzZXRzIHN0YXJ0IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyXG4gIGlmIChieXRlT2Zmc2V0IDwgMCkgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggKyBieXRlT2Zmc2V0XG4gIGlmIChieXRlT2Zmc2V0ID49IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICBpZiAoZGlyKSByZXR1cm4gLTFcbiAgICBlbHNlIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoIC0gMVxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAwKSB7XG4gICAgaWYgKGRpcikgYnl0ZU9mZnNldCA9IDBcbiAgICBlbHNlIHJldHVybiAtMVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIHZhbFxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWwgPSBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICB9XG5cbiAgLy8gRmluYWxseSwgc2VhcmNoIGVpdGhlciBpbmRleE9mIChpZiBkaXIgaXMgdHJ1ZSkgb3IgbGFzdEluZGV4T2ZcbiAgaWYgKGludGVybmFsSXNCdWZmZXIodmFsKSkge1xuICAgIC8vIFNwZWNpYWwgY2FzZTogbG9va2luZyBmb3IgZW1wdHkgc3RyaW5nL2J1ZmZlciBhbHdheXMgZmFpbHNcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAweEZGIC8vIFNlYXJjaCBmb3IgYSBieXRlIHZhbHVlIFswLTI1NV1cbiAgICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiZcbiAgICAgICAgdHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgWyB2YWwgXSwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbmZ1bmN0aW9uIGFycmF5SW5kZXhPZiAoYXJyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgdmFyIGluZGV4U2l6ZSA9IDFcbiAgdmFyIGFyckxlbmd0aCA9IGFyci5sZW5ndGhcbiAgdmFyIHZhbExlbmd0aCA9IHZhbC5sZW5ndGhcblxuICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKGVuY29kaW5nID09PSAndWNzMicgfHwgZW5jb2RpbmcgPT09ICd1Y3MtMicgfHxcbiAgICAgICAgZW5jb2RpbmcgPT09ICd1dGYxNmxlJyB8fCBlbmNvZGluZyA9PT0gJ3V0Zi0xNmxlJykge1xuICAgICAgaWYgKGFyci5sZW5ndGggPCAyIHx8IHZhbC5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiAtMVxuICAgICAgfVxuICAgICAgaW5kZXhTaXplID0gMlxuICAgICAgYXJyTGVuZ3RoIC89IDJcbiAgICAgIHZhbExlbmd0aCAvPSAyXG4gICAgICBieXRlT2Zmc2V0IC89IDJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWFkIChidWYsIGkpIHtcbiAgICBpZiAoaW5kZXhTaXplID09PSAxKSB7XG4gICAgICByZXR1cm4gYnVmW2ldXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBidWYucmVhZFVJbnQxNkJFKGkgKiBpbmRleFNpemUpXG4gICAgfVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGRpcikge1xuICAgIHZhciBmb3VuZEluZGV4ID0gLTFcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpIDwgYXJyTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWFkKGFyciwgaSkgPT09IHJlYWQodmFsLCBmb3VuZEluZGV4ID09PSAtMSA/IDAgOiBpIC0gZm91bmRJbmRleCkpIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgICBpZiAoaSAtIGZvdW5kSW5kZXggKyAxID09PSB2YWxMZW5ndGgpIHJldHVybiBmb3VuZEluZGV4ICogaW5kZXhTaXplXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZm91bmRJbmRleCAhPT0gLTEpIGkgLT0gaSAtIGZvdW5kSW5kZXhcbiAgICAgICAgZm91bmRJbmRleCA9IC0xXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChieXRlT2Zmc2V0ICsgdmFsTGVuZ3RoID4gYXJyTGVuZ3RoKSBieXRlT2Zmc2V0ID0gYXJyTGVuZ3RoIC0gdmFsTGVuZ3RoXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciBmb3VuZCA9IHRydWVcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHJlYWQoYXJyLCBpICsgaikgIT09IHJlYWQodmFsLCBqKSkge1xuICAgICAgICAgIGZvdW5kID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmQpIHJldHVybiBpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gdGhpcy5pbmRleE9mKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpICE9PSAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCB0cnVlKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gbGFzdEluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGZhbHNlKVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChzdHJMZW4gJSAyICE9PSAwKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgcGFyc2VkID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGlmIChpc05hTihwYXJzZWQpKSByZXR1cm4gaVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHBhcnNlZFxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIHV0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGFzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gbGF0aW4xV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiB1Y3MyV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gd3JpdGUgKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcpXG4gIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgb2Zmc2V0WywgbGVuZ3RoXVssIGVuY29kaW5nXSlcbiAgfSBlbHNlIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGggfCAwXG4gICAgICBpZiAoZW5jb2RpbmcgPT09IHVuZGVmaW5lZCkgZW5jb2RpbmcgPSAndXRmOCdcbiAgICB9IGVsc2Uge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgLy8gbGVnYWN5IHdyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKSAtIHJlbW92ZSBpbiB2MC4xM1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCdcbiAgICApXG4gIH1cblxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGxlbmd0aCA+IHJlbWFpbmluZykgbGVuZ3RoID0gcmVtYWluaW5nXG5cbiAgaWYgKChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSkgfHwgb2Zmc2V0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGxhdGluMVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpICsgMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gfn5zdGFydFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IH5+ZW5kXG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ICs9IGxlblxuICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKSBlbmQgPSAwXG4gIH0gZWxzZSBpZiAoZW5kID4gbGVuKSB7XG4gICAgZW5kID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgdmFyIG5ld0J1ZlxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBuZXdCdWYgPSB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpXG4gICAgbmV3QnVmLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyArK2kpIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXdCdWZcbn1cblxuLypcbiAqIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgYnVmZmVyIGlzbid0IHRyeWluZyB0byB3cml0ZSBvdXQgb2YgYm91bmRzLlxuICovXG5mdW5jdGlvbiBjaGVja09mZnNldCAob2Zmc2V0LCBleHQsIGxlbmd0aCkge1xuICBpZiAoKG9mZnNldCAlIDEpICE9PSAwIHx8IG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdvZmZzZXQgaXMgbm90IHVpbnQnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gbGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRMRSA9IGZ1bmN0aW9uIHJlYWRVSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRSA9IGZ1bmN0aW9uIHJlYWRVSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiByZWFkVUludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdICogMHgxMDAwMDAwKSArXG4gICAgKCh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgIHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludExFID0gZnVuY3Rpb24gcmVhZEludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoXG4gIHZhciBtdWwgPSAxXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0taV1cbiAgd2hpbGUgKGkgPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1pXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiByZWFkSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICBpZiAoISh0aGlzW29mZnNldF0gJiAweDgwKSkgcmV0dXJuICh0aGlzW29mZnNldF0pXG4gIHJldHVybiAoKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gcmVhZEludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIDFdIHwgKHRoaXNbb2Zmc2V0XSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiByZWFkSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdKSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10gPDwgMjQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiByZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiByZWFkRmxvYXRCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgNTIsIDgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYnVmZmVyXCIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpXG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludEJFID0gZnVuY3Rpb24gd3JpdGVVSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiB3cml0ZVVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4ZmYsIDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgMik7IGkgPCBqOyArK2kpIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDQpOyBpIDwgajsgKytpKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludExFID0gZnVuY3Rpb24gd3JpdGVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpIC0gMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFID0gZnVuY3Rpb24gd3JpdGVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpICsgMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiB3cml0ZUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHg3ZiwgLTB4ODApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbmZ1bmN0aW9uIGNoZWNrSUVFRTc1NCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbiAgaWYgKG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5mdW5jdGlvbiB3cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDgsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG4gIHJldHVybiBvZmZzZXQgKyA4XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weSAodGFyZ2V0LCB0YXJnZXRTdGFydCwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0U3RhcnQgPj0gdGFyZ2V0Lmxlbmd0aCkgdGFyZ2V0U3RhcnQgPSB0YXJnZXQubGVuZ3RoXG4gIGlmICghdGFyZ2V0U3RhcnQpIHRhcmdldFN0YXJ0ID0gMFxuICBpZiAoZW5kID4gMCAmJiBlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVybiAwXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgaWYgKHRhcmdldFN0YXJ0IDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgfVxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuICB2YXIgaVxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQgJiYgc3RhcnQgPCB0YXJnZXRTdGFydCAmJiB0YXJnZXRTdGFydCA8IGVuZCkge1xuICAgIC8vIGRlc2NlbmRpbmcgY29weSBmcm9tIGVuZFxuICAgIGZvciAoaSA9IGxlbiAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIGlmIChsZW4gPCAxMDAwIHx8ICFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIGFzY2VuZGluZyBjb3B5IGZyb20gc3RhcnRcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIFVpbnQ4QXJyYXkucHJvdG90eXBlLnNldC5jYWxsKFxuICAgICAgdGFyZ2V0LFxuICAgICAgdGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLFxuICAgICAgdGFyZ2V0U3RhcnRcbiAgICApXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIFVzYWdlOlxuLy8gICAgYnVmZmVyLmZpbGwobnVtYmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChidWZmZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKHN0cmluZ1ssIG9mZnNldFssIGVuZF1dWywgZW5jb2RpbmddKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsLCBzdGFydCwgZW5kLCBlbmNvZGluZykge1xuICAvLyBIYW5kbGUgc3RyaW5nIGNhc2VzOlxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHlwZW9mIHN0YXJ0ID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBzdGFydFxuICAgICAgc3RhcnQgPSAwXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVuZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gZW5kXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH1cbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIGNvZGUgPSB2YWwuY2hhckNvZGVBdCgwKVxuICAgICAgaWYgKGNvZGUgPCAyNTYpIHtcbiAgICAgICAgdmFsID0gY29kZVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycgJiYgIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDI1NVxuICB9XG5cbiAgLy8gSW52YWxpZCByYW5nZXMgYXJlIG5vdCBzZXQgdG8gYSBkZWZhdWx0LCBzbyBjYW4gcmFuZ2UgY2hlY2sgZWFybHkuXG4gIGlmIChzdGFydCA8IDAgfHwgdGhpcy5sZW5ndGggPCBzdGFydCB8fCB0aGlzLmxlbmd0aCA8IGVuZCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdPdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzdGFydCA9IHN0YXJ0ID4+PiAwXG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gdGhpcy5sZW5ndGggOiBlbmQgPj4+IDBcblxuICBpZiAoIXZhbCkgdmFsID0gMFxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICAgIHRoaXNbaV0gPSB2YWxcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJ5dGVzID0gaW50ZXJuYWxJc0J1ZmZlcih2YWwpXG4gICAgICA/IHZhbFxuICAgICAgOiB1dGY4VG9CeXRlcyhuZXcgQnVmZmVyKHZhbCwgZW5jb2RpbmcpLnRvU3RyaW5nKCkpXG4gICAgdmFyIGxlbiA9IGJ5dGVzLmxlbmd0aFxuICAgIGZvciAoaSA9IDA7IGkgPCBlbmQgLSBzdGFydDsgKytpKSB7XG4gICAgICB0aGlzW2kgKyBzdGFydF0gPSBieXRlc1tpICUgbGVuXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxudmFyIElOVkFMSURfQkFTRTY0X1JFID0gL1teK1xcLzAtOUEtWmEtei1fXS9nXG5cbmZ1bmN0aW9uIGJhc2U2NGNsZWFuIChzdHIpIHtcbiAgLy8gTm9kZSBzdHJpcHMgb3V0IGludmFsaWQgY2hhcmFjdGVycyBsaWtlIFxcbiBhbmQgXFx0IGZyb20gdGhlIHN0cmluZywgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHN0ciA9IHN0cmluZ3RyaW0oc3RyKS5yZXBsYWNlKElOVkFMSURfQkFTRTY0X1JFLCAnJylcbiAgLy8gTm9kZSBjb252ZXJ0cyBzdHJpbmdzIHdpdGggbGVuZ3RoIDwgMiB0byAnJ1xuICBpZiAoc3RyLmxlbmd0aCA8IDIpIHJldHVybiAnJ1xuICAvLyBOb2RlIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBiYXNlNjQgc3RyaW5ncyAobWlzc2luZyB0cmFpbGluZyA9PT0pLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgd2hpbGUgKHN0ci5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgc3RyID0gc3RyICsgJz0nXG4gIH1cbiAgcmV0dXJuIHN0clxufVxuXG5mdW5jdGlvbiBzdHJpbmd0cmltIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKVxuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHJpbmcsIHVuaXRzKSB7XG4gIHVuaXRzID0gdW5pdHMgfHwgSW5maW5pdHlcbiAgdmFyIGNvZGVQb2ludFxuICB2YXIgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aFxuICB2YXIgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcbiAgdmFyIGJ5dGVzID0gW11cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgY29kZVBvaW50ID0gc3RyaW5nLmNoYXJDb2RlQXQoaSlcblxuICAgIC8vIGlzIHN1cnJvZ2F0ZSBjb21wb25lbnRcbiAgICBpZiAoY29kZVBvaW50ID4gMHhEN0ZGICYmIGNvZGVQb2ludCA8IDB4RTAwMCkge1xuICAgICAgLy8gbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICghbGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgICAvLyBubyBsZWFkIHlldFxuICAgICAgICBpZiAoY29kZVBvaW50ID4gMHhEQkZGKSB7XG4gICAgICAgICAgLy8gdW5leHBlY3RlZCB0cmFpbFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSBpZiAoaSArIDEgPT09IGxlbmd0aCkge1xuICAgICAgICAgIC8vIHVucGFpcmVkIGxlYWRcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsaWQgbGVhZFxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gMiBsZWFkcyBpbiBhIHJvd1xuICAgICAgaWYgKGNvZGVQb2ludCA8IDB4REMwMCkge1xuICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyB2YWxpZCBzdXJyb2dhdGUgcGFpclxuICAgICAgY29kZVBvaW50ID0gKGxlYWRTdXJyb2dhdGUgLSAweEQ4MDAgPDwgMTAgfCBjb2RlUG9pbnQgLSAweERDMDApICsgMHgxMDAwMFxuICAgIH0gZWxzZSBpZiAobGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgLy8gdmFsaWQgYm1wIGNoYXIsIGJ1dCBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgfVxuXG4gICAgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcblxuICAgIC8vIGVuY29kZSB1dGY4XG4gICAgaWYgKGNvZGVQb2ludCA8IDB4ODApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMSkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChjb2RlUG9pbnQpXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDgwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2IHwgMHhDMCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyB8IDB4RTAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDQpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDEyIHwgMHhGMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2RlIHBvaW50JylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnl0ZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0ciwgdW5pdHMpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcblxuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoYmFzZTY0Y2xlYW4oc3RyKSlcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gaXNuYW4gKHZhbCkge1xuICByZXR1cm4gdmFsICE9PSB2YWwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zZWxmLWNvbXBhcmVcbn1cblxuXG4vLyB0aGUgZm9sbG93aW5nIGlzIGZyb20gaXMtYnVmZmVyLCBhbHNvIGJ5IEZlcm9zcyBBYm91a2hhZGlqZWggYW5kIHdpdGggc2FtZSBsaXNlbmNlXG4vLyBUaGUgX2lzQnVmZmVyIGNoZWNrIGlzIGZvciBTYWZhcmkgNS03IHN1cHBvcnQsIGJlY2F1c2UgaXQncyBtaXNzaW5nXG4vLyBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yLiBSZW1vdmUgdGhpcyBldmVudHVhbGx5XG5leHBvcnQgZnVuY3Rpb24gaXNCdWZmZXIob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoISFvYmouX2lzQnVmZmVyIHx8IGlzRmFzdEJ1ZmZlcihvYmopIHx8IGlzU2xvd0J1ZmZlcihvYmopKVxufVxuXG5mdW5jdGlvbiBpc0Zhc3RCdWZmZXIgKG9iaikge1xuICByZXR1cm4gISFvYmouY29uc3RydWN0b3IgJiYgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKVxufVxuXG4vLyBGb3IgTm9kZSB2MC4xMCBzdXBwb3J0LiBSZW1vdmUgdGhpcyBldmVudHVhbGx5LlxuZnVuY3Rpb24gaXNTbG93QnVmZmVyIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmoucmVhZEZsb2F0TEUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5zbGljZSA9PT0gJ2Z1bmN0aW9uJyAmJiBpc0Zhc3RCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7QnVmZmVyfSBmcm9tICdidWZmZXInO1xudmFyIGlzQnVmZmVyRW5jb2RpbmcgPSBCdWZmZXIuaXNFbmNvZGluZ1xuICB8fCBmdW5jdGlvbihlbmNvZGluZykge1xuICAgICAgIHN3aXRjaCAoZW5jb2RpbmcgJiYgZW5jb2RpbmcudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgY2FzZSAnaGV4JzogY2FzZSAndXRmOCc6IGNhc2UgJ3V0Zi04JzogY2FzZSAnYXNjaWknOiBjYXNlICdiaW5hcnknOiBjYXNlICdiYXNlNjQnOiBjYXNlICd1Y3MyJzogY2FzZSAndWNzLTInOiBjYXNlICd1dGYxNmxlJzogY2FzZSAndXRmLTE2bGUnOiBjYXNlICdyYXcnOiByZXR1cm4gdHJ1ZTtcbiAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBmYWxzZTtcbiAgICAgICB9XG4gICAgIH1cblxuXG5mdW5jdGlvbiBhc3NlcnRFbmNvZGluZyhlbmNvZGluZykge1xuICBpZiAoZW5jb2RpbmcgJiYgIWlzQnVmZmVyRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpO1xuICB9XG59XG5cbi8vIFN0cmluZ0RlY29kZXIgcHJvdmlkZXMgYW4gaW50ZXJmYWNlIGZvciBlZmZpY2llbnRseSBzcGxpdHRpbmcgYSBzZXJpZXMgb2Zcbi8vIGJ1ZmZlcnMgaW50byBhIHNlcmllcyBvZiBKUyBzdHJpbmdzIHdpdGhvdXQgYnJlYWtpbmcgYXBhcnQgbXVsdGktYnl0ZVxuLy8gY2hhcmFjdGVycy4gQ0VTVS04IGlzIGhhbmRsZWQgYXMgcGFydCBvZiB0aGUgVVRGLTggZW5jb2RpbmcuXG4vL1xuLy8gQFRPRE8gSGFuZGxpbmcgYWxsIGVuY29kaW5ncyBpbnNpZGUgYSBzaW5nbGUgb2JqZWN0IG1ha2VzIGl0IHZlcnkgZGlmZmljdWx0XG4vLyB0byByZWFzb24gYWJvdXQgdGhpcyBjb2RlLCBzbyBpdCBzaG91bGQgYmUgc3BsaXQgdXAgaW4gdGhlIGZ1dHVyZS5cbi8vIEBUT0RPIFRoZXJlIHNob3VsZCBiZSBhIHV0Zjgtc3RyaWN0IGVuY29kaW5nIHRoYXQgcmVqZWN0cyBpbnZhbGlkIFVURi04IGNvZGVcbi8vIHBvaW50cyBhcyB1c2VkIGJ5IENFU1UtOC5cbmV4cG9ydCBmdW5jdGlvbiBTdHJpbmdEZWNvZGVyKGVuY29kaW5nKSB7XG4gIHRoaXMuZW5jb2RpbmcgPSAoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1stX10vLCAnJyk7XG4gIGFzc2VydEVuY29kaW5nKGVuY29kaW5nKTtcbiAgc3dpdGNoICh0aGlzLmVuY29kaW5nKSB7XG4gICAgY2FzZSAndXRmOCc6XG4gICAgICAvLyBDRVNVLTggcmVwcmVzZW50cyBlYWNoIG9mIFN1cnJvZ2F0ZSBQYWlyIGJ5IDMtYnl0ZXNcbiAgICAgIHRoaXMuc3Vycm9nYXRlU2l6ZSA9IDM7XG4gICAgICBicmVhaztcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIC8vIFVURi0xNiByZXByZXNlbnRzIGVhY2ggb2YgU3Vycm9nYXRlIFBhaXIgYnkgMi1ieXRlc1xuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMjtcbiAgICAgIHRoaXMuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSB1dGYxNkRldGVjdEluY29tcGxldGVDaGFyO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIC8vIEJhc2UtNjQgc3RvcmVzIDMgYnl0ZXMgaW4gNCBjaGFycywgYW5kIHBhZHMgdGhlIHJlbWFpbmRlci5cbiAgICAgIHRoaXMuc3Vycm9nYXRlU2l6ZSA9IDM7XG4gICAgICB0aGlzLmRldGVjdEluY29tcGxldGVDaGFyID0gYmFzZTY0RGV0ZWN0SW5jb21wbGV0ZUNoYXI7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhpcy53cml0ZSA9IHBhc3NUaHJvdWdoV3JpdGU7XG4gICAgICByZXR1cm47XG4gIH1cblxuICAvLyBFbm91Z2ggc3BhY2UgdG8gc3RvcmUgYWxsIGJ5dGVzIG9mIGEgc2luZ2xlIGNoYXJhY3Rlci4gVVRGLTggbmVlZHMgNFxuICAvLyBieXRlcywgYnV0IENFU1UtOCBtYXkgcmVxdWlyZSB1cCB0byA2ICgzIGJ5dGVzIHBlciBzdXJyb2dhdGUpLlxuICB0aGlzLmNoYXJCdWZmZXIgPSBuZXcgQnVmZmVyKDYpO1xuICAvLyBOdW1iZXIgb2YgYnl0ZXMgcmVjZWl2ZWQgZm9yIHRoZSBjdXJyZW50IGluY29tcGxldGUgbXVsdGktYnl0ZSBjaGFyYWN0ZXIuXG4gIHRoaXMuY2hhclJlY2VpdmVkID0gMDtcbiAgLy8gTnVtYmVyIG9mIGJ5dGVzIGV4cGVjdGVkIGZvciB0aGUgY3VycmVudCBpbmNvbXBsZXRlIG11bHRpLWJ5dGUgY2hhcmFjdGVyLlxuICB0aGlzLmNoYXJMZW5ndGggPSAwO1xufTtcblxuXG4vLyB3cml0ZSBkZWNvZGVzIHRoZSBnaXZlbiBidWZmZXIgYW5kIHJldHVybnMgaXQgYXMgSlMgc3RyaW5nIHRoYXQgaXNcbi8vIGd1YXJhbnRlZWQgdG8gbm90IGNvbnRhaW4gYW55IHBhcnRpYWwgbXVsdGktYnl0ZSBjaGFyYWN0ZXJzLiBBbnkgcGFydGlhbFxuLy8gY2hhcmFjdGVyIGZvdW5kIGF0IHRoZSBlbmQgb2YgdGhlIGJ1ZmZlciBpcyBidWZmZXJlZCB1cCwgYW5kIHdpbGwgYmVcbi8vIHJldHVybmVkIHdoZW4gY2FsbGluZyB3cml0ZSBhZ2FpbiB3aXRoIHRoZSByZW1haW5pbmcgYnl0ZXMuXG4vL1xuLy8gTm90ZTogQ29udmVydGluZyBhIEJ1ZmZlciBjb250YWluaW5nIGFuIG9ycGhhbiBzdXJyb2dhdGUgdG8gYSBTdHJpbmdcbi8vIGN1cnJlbnRseSB3b3JrcywgYnV0IGNvbnZlcnRpbmcgYSBTdHJpbmcgdG8gYSBCdWZmZXIgKHZpYSBgbmV3IEJ1ZmZlcmAsIG9yXG4vLyBCdWZmZXIjd3JpdGUpIHdpbGwgcmVwbGFjZSBpbmNvbXBsZXRlIHN1cnJvZ2F0ZXMgd2l0aCB0aGUgdW5pY29kZVxuLy8gcmVwbGFjZW1lbnQgY2hhcmFjdGVyLiBTZWUgaHR0cHM6Ly9jb2RlcmV2aWV3LmNocm9taXVtLm9yZy8xMjExNzMwMDkvIC5cblN0cmluZ0RlY29kZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oYnVmZmVyKSB7XG4gIHZhciBjaGFyU3RyID0gJyc7XG4gIC8vIGlmIG91ciBsYXN0IHdyaXRlIGVuZGVkIHdpdGggYW4gaW5jb21wbGV0ZSBtdWx0aWJ5dGUgY2hhcmFjdGVyXG4gIHdoaWxlICh0aGlzLmNoYXJMZW5ndGgpIHtcbiAgICAvLyBkZXRlcm1pbmUgaG93IG1hbnkgcmVtYWluaW5nIGJ5dGVzIHRoaXMgYnVmZmVyIGhhcyB0byBvZmZlciBmb3IgdGhpcyBjaGFyXG4gICAgdmFyIGF2YWlsYWJsZSA9IChidWZmZXIubGVuZ3RoID49IHRoaXMuY2hhckxlbmd0aCAtIHRoaXMuY2hhclJlY2VpdmVkKSA/XG4gICAgICAgIHRoaXMuY2hhckxlbmd0aCAtIHRoaXMuY2hhclJlY2VpdmVkIDpcbiAgICAgICAgYnVmZmVyLmxlbmd0aDtcblxuICAgIC8vIGFkZCB0aGUgbmV3IGJ5dGVzIHRvIHRoZSBjaGFyIGJ1ZmZlclxuICAgIGJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgdGhpcy5jaGFyUmVjZWl2ZWQsIDAsIGF2YWlsYWJsZSk7XG4gICAgdGhpcy5jaGFyUmVjZWl2ZWQgKz0gYXZhaWxhYmxlO1xuXG4gICAgaWYgKHRoaXMuY2hhclJlY2VpdmVkIDwgdGhpcy5jaGFyTGVuZ3RoKSB7XG4gICAgICAvLyBzdGlsbCBub3QgZW5vdWdoIGNoYXJzIGluIHRoaXMgYnVmZmVyPyB3YWl0IGZvciBtb3JlIC4uLlxuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBieXRlcyBiZWxvbmdpbmcgdG8gdGhlIGN1cnJlbnQgY2hhcmFjdGVyIGZyb20gdGhlIGJ1ZmZlclxuICAgIGJ1ZmZlciA9IGJ1ZmZlci5zbGljZShhdmFpbGFibGUsIGJ1ZmZlci5sZW5ndGgpO1xuXG4gICAgLy8gZ2V0IHRoZSBjaGFyYWN0ZXIgdGhhdCB3YXMgc3BsaXRcbiAgICBjaGFyU3RyID0gdGhpcy5jaGFyQnVmZmVyLnNsaWNlKDAsIHRoaXMuY2hhckxlbmd0aCkudG9TdHJpbmcodGhpcy5lbmNvZGluZyk7XG5cbiAgICAvLyBDRVNVLTg6IGxlYWQgc3Vycm9nYXRlIChEODAwLURCRkYpIGlzIGFsc28gdGhlIGluY29tcGxldGUgY2hhcmFjdGVyXG4gICAgdmFyIGNoYXJDb2RlID0gY2hhclN0ci5jaGFyQ29kZUF0KGNoYXJTdHIubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGNoYXJDb2RlID49IDB4RDgwMCAmJiBjaGFyQ29kZSA8PSAweERCRkYpIHtcbiAgICAgIHRoaXMuY2hhckxlbmd0aCArPSB0aGlzLnN1cnJvZ2F0ZVNpemU7XG4gICAgICBjaGFyU3RyID0gJyc7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgdGhpcy5jaGFyUmVjZWl2ZWQgPSB0aGlzLmNoYXJMZW5ndGggPSAwO1xuXG4gICAgLy8gaWYgdGhlcmUgYXJlIG5vIG1vcmUgYnl0ZXMgaW4gdGhpcyBidWZmZXIsIGp1c3QgZW1pdCBvdXIgY2hhclxuICAgIGlmIChidWZmZXIubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY2hhclN0cjtcbiAgICB9XG4gICAgYnJlYWs7XG4gIH1cblxuICAvLyBkZXRlcm1pbmUgYW5kIHNldCBjaGFyTGVuZ3RoIC8gY2hhclJlY2VpdmVkXG4gIHRoaXMuZGV0ZWN0SW5jb21wbGV0ZUNoYXIoYnVmZmVyKTtcblxuICB2YXIgZW5kID0gYnVmZmVyLmxlbmd0aDtcbiAgaWYgKHRoaXMuY2hhckxlbmd0aCkge1xuICAgIC8vIGJ1ZmZlciB0aGUgaW5jb21wbGV0ZSBjaGFyYWN0ZXIgYnl0ZXMgd2UgZ290XG4gICAgYnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCAwLCBidWZmZXIubGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQsIGVuZCk7XG4gICAgZW5kIC09IHRoaXMuY2hhclJlY2VpdmVkO1xuICB9XG5cbiAgY2hhclN0ciArPSBidWZmZXIudG9TdHJpbmcodGhpcy5lbmNvZGluZywgMCwgZW5kKTtcblxuICB2YXIgZW5kID0gY2hhclN0ci5sZW5ndGggLSAxO1xuICB2YXIgY2hhckNvZGUgPSBjaGFyU3RyLmNoYXJDb2RlQXQoZW5kKTtcbiAgLy8gQ0VTVS04OiBsZWFkIHN1cnJvZ2F0ZSAoRDgwMC1EQkZGKSBpcyBhbHNvIHRoZSBpbmNvbXBsZXRlIGNoYXJhY3RlclxuICBpZiAoY2hhckNvZGUgPj0gMHhEODAwICYmIGNoYXJDb2RlIDw9IDB4REJGRikge1xuICAgIHZhciBzaXplID0gdGhpcy5zdXJyb2dhdGVTaXplO1xuICAgIHRoaXMuY2hhckxlbmd0aCArPSBzaXplO1xuICAgIHRoaXMuY2hhclJlY2VpdmVkICs9IHNpemU7XG4gICAgdGhpcy5jaGFyQnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCBzaXplLCAwLCBzaXplKTtcbiAgICBidWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIDAsIDAsIHNpemUpO1xuICAgIHJldHVybiBjaGFyU3RyLnN1YnN0cmluZygwLCBlbmQpO1xuICB9XG5cbiAgLy8gb3IganVzdCBlbWl0IHRoZSBjaGFyU3RyXG4gIHJldHVybiBjaGFyU3RyO1xufTtcblxuLy8gZGV0ZWN0SW5jb21wbGV0ZUNoYXIgZGV0ZXJtaW5lcyBpZiB0aGVyZSBpcyBhbiBpbmNvbXBsZXRlIFVURi04IGNoYXJhY3RlciBhdFxuLy8gdGhlIGVuZCBvZiB0aGUgZ2l2ZW4gYnVmZmVyLiBJZiBzbywgaXQgc2V0cyB0aGlzLmNoYXJMZW5ndGggdG8gdGhlIGJ5dGVcbi8vIGxlbmd0aCB0aGF0IGNoYXJhY3RlciwgYW5kIHNldHMgdGhpcy5jaGFyUmVjZWl2ZWQgdG8gdGhlIG51bWJlciBvZiBieXRlc1xuLy8gdGhhdCBhcmUgYXZhaWxhYmxlIGZvciB0aGlzIGNoYXJhY3Rlci5cblN0cmluZ0RlY29kZXIucHJvdG90eXBlLmRldGVjdEluY29tcGxldGVDaGFyID0gZnVuY3Rpb24oYnVmZmVyKSB7XG4gIC8vIGRldGVybWluZSBob3cgbWFueSBieXRlcyB3ZSBoYXZlIHRvIGNoZWNrIGF0IHRoZSBlbmQgb2YgdGhpcyBidWZmZXJcbiAgdmFyIGkgPSAoYnVmZmVyLmxlbmd0aCA+PSAzKSA/IDMgOiBidWZmZXIubGVuZ3RoO1xuXG4gIC8vIEZpZ3VyZSBvdXQgaWYgb25lIG9mIHRoZSBsYXN0IGkgYnl0ZXMgb2Ygb3VyIGJ1ZmZlciBhbm5vdW5jZXMgYW5cbiAgLy8gaW5jb21wbGV0ZSBjaGFyLlxuICBmb3IgKDsgaSA+IDA7IGktLSkge1xuICAgIHZhciBjID0gYnVmZmVyW2J1ZmZlci5sZW5ndGggLSBpXTtcblxuICAgIC8vIFNlZSBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1VURi04I0Rlc2NyaXB0aW9uXG5cbiAgICAvLyAxMTBYWFhYWFxuICAgIGlmIChpID09IDEgJiYgYyA+PiA1ID09IDB4MDYpIHtcbiAgICAgIHRoaXMuY2hhckxlbmd0aCA9IDI7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyAxMTEwWFhYWFxuICAgIGlmIChpIDw9IDIgJiYgYyA+PiA0ID09IDB4MEUpIHtcbiAgICAgIHRoaXMuY2hhckxlbmd0aCA9IDM7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyAxMTExMFhYWFxuICAgIGlmIChpIDw9IDMgJiYgYyA+PiAzID09IDB4MUUpIHtcbiAgICAgIHRoaXMuY2hhckxlbmd0aCA9IDQ7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSBpO1xufTtcblxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oYnVmZmVyKSB7XG4gIHZhciByZXMgPSAnJztcbiAgaWYgKGJ1ZmZlciAmJiBidWZmZXIubGVuZ3RoKVxuICAgIHJlcyA9IHRoaXMud3JpdGUoYnVmZmVyKTtcblxuICBpZiAodGhpcy5jaGFyUmVjZWl2ZWQpIHtcbiAgICB2YXIgY3IgPSB0aGlzLmNoYXJSZWNlaXZlZDtcbiAgICB2YXIgYnVmID0gdGhpcy5jaGFyQnVmZmVyO1xuICAgIHZhciBlbmMgPSB0aGlzLmVuY29kaW5nO1xuICAgIHJlcyArPSBidWYuc2xpY2UoMCwgY3IpLnRvU3RyaW5nKGVuYyk7XG4gIH1cblxuICByZXR1cm4gcmVzO1xufTtcblxuZnVuY3Rpb24gcGFzc1Rocm91Z2hXcml0ZShidWZmZXIpIHtcbiAgcmV0dXJuIGJ1ZmZlci50b1N0cmluZyh0aGlzLmVuY29kaW5nKTtcbn1cblxuZnVuY3Rpb24gdXRmMTZEZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpIHtcbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSBidWZmZXIubGVuZ3RoICUgMjtcbiAgdGhpcy5jaGFyTGVuZ3RoID0gdGhpcy5jaGFyUmVjZWl2ZWQgPyAyIDogMDtcbn1cblxuZnVuY3Rpb24gYmFzZTY0RGV0ZWN0SW5jb21wbGV0ZUNoYXIoYnVmZmVyKSB7XG4gIHRoaXMuY2hhclJlY2VpdmVkID0gYnVmZmVyLmxlbmd0aCAlIDM7XG4gIHRoaXMuY2hhckxlbmd0aCA9IHRoaXMuY2hhclJlY2VpdmVkID8gMyA6IDA7XG59XG4iLCJpbXBvcnQge2dlbmVyYXRlU2NoZW1hfSBmcm9tIFwiLi9pbmRleFNjaGVtYUNyZWF0b3JcIjtcclxuaW1wb3J0IHsgaGFzLCBpc1N0cmluZywgZGlmZmVyZW5jZSwgZmluZCB9IGZyb20gXCJsb2Rhc2gvZnBcIjtcclxuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcInNhZmUtYnVmZmVyXCI7XHJcbmltcG9ydCB7U3RyaW5nRGVjb2Rlcn0gZnJvbSBcInN0cmluZ19kZWNvZGVyXCI7XHJcbmltcG9ydCB7Z2V0VHlwZX0gZnJvbSBcIi4uL3R5cGVzXCI7XHJcbmltcG9ydCB7IGlzU29tZXRoaW5nIH0gZnJvbSBcIi4uL2NvbW1vblwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEJVRkZFUl9NQVhfQllURVMgPSA1MjQyODg7IC8vIDAuNU1iXHJcblxyXG5leHBvcnQgY29uc3QgQ09OVElOVUVfUkVBRElOR19SRUNPUkRTID0gXCJDT05USU5VRV9SRUFESU5HXCI7XHJcbmV4cG9ydCBjb25zdCBSRUFEX1JFTUFJTklOR19URVhUID0gXCJSRUFEX1JFTUFJTklOR1wiO1xyXG5leHBvcnQgY29uc3QgQ0FOQ0VMX1JFQUQgPSBcIkNBTkNFTFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEluZGV4V3JpdGVyID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlLCByZWFkYWJsZVN0cmVhbSwgd3JpdGFibGVTdHJlYW0sIGVuZCkgPT4ge1xyXG4gICAgY29uc3Qgc2NoZW1hID0gZ2VuZXJhdGVTY2hlbWEoaGllcmFyY2h5LCBpbmRleE5vZGUpO1xyXG5cclxuICAgIHJldHVybiAoe1xyXG4gICAgICAgIHJlYWQ6IHJlYWQocmVhZGFibGVTdHJlYW0sIHNjaGVtYSksXHJcbiAgICAgICAgdXBkYXRlSW5kZXg6IHVwZGF0ZUluZGV4KHJlYWRhYmxlU3RyZWFtLCB3cml0YWJsZVN0cmVhbSwgc2NoZW1hLCBlbmQpXHJcbiAgICB9KTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRJbmRleFJlYWRlciA9IChoaWVyYXJjaHksIGluZGV4Tm9kZSwgcmVhZGFibGVTdHJlYW0pID0+IFxyXG4gICAgcmVhZChcclxuICAgICAgICByZWFkYWJsZVN0cmVhbSwgXHJcbiAgICAgICAgZ2VuZXJhdGVTY2hlbWEoaGllcmFyY2h5LCBpbmRleE5vZGUpXHJcbiAgICApO1xyXG5cclxuY29uc3QgdXBkYXRlSW5kZXggPSAocmVhZGFibGVTdHJlYW0sIHdyaXRhYmxlU3RyZWFtLCBzY2hlbWEpID0+IGFzeW5jIChpdGVtc1RvV3JpdGUsIGtleXNUb1JlbW92ZSkgPT4ge1xyXG4gICAgY29uc3Qgd3JpdGUgPSBuZXdPdXRwdXRXcml0ZXIoQlVGRkVSX01BWF9CWVRFUywgd3JpdGFibGVTdHJlYW0pO1xyXG4gICAgY29uc3Qgd3JpdHRlbkl0ZW1zID0gW107IFxyXG4gICAgYXdhaXQgcmVhZChyZWFkYWJsZVN0cmVhbSwgc2NoZW1hKShcclxuICAgICAgICBhc3luYyBpbmRleGVkSXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBmaW5kKGkgPT4gaW5kZXhlZEl0ZW0ua2V5ID09PSBpLmtleSkoaXRlbXNUb1dyaXRlKTtcclxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlZCA9IGZpbmQoayA9PiBpbmRleGVkSXRlbS5rZXkgPT09IGspKGtleXNUb1JlbW92ZSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihpc1NvbWV0aGluZyhyZW1vdmVkKSkgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNTb21ldGhpbmcodXBkYXRlZCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNlcmlhbGl6ZWRJdGVtID0gIHNlcmlhbGl6ZUl0ZW0oc2NoZW1hLCB1cGRhdGVkKTtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRlKHNlcmlhbGl6ZWRJdGVtKTtcclxuICAgICAgICAgICAgICAgIHdyaXR0ZW5JdGVtcy5wdXNoKHVwZGF0ZWQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgd3JpdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgc2VyaWFsaXplSXRlbShzY2hlbWEsIGluZGV4ZWRJdGVtKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSBcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYXN5bmMgdGV4dCA9PiBhd2FpdCB3cml0ZSh0ZXh0KVxyXG4gICAgKTtcclxuXHJcbiAgICBpZih3cml0dGVuSXRlbXMubGVuZ3RoICE9PSBpdGVtc1RvV3JpdGUubGVuZ3RoKSB7XHJcbiAgICAgICAgY29uc3QgdG9BZGQgPSBkaWZmZXJlbmNlKGl0ZW1zVG9Xcml0ZSwgd3JpdHRlbkl0ZW1zKTtcclxuICAgICAgICBmb3IobGV0IGFkZGVkIG9mIHRvQWRkKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHdyaXRlKFxyXG4gICAgICAgICAgICAgICAgc2VyaWFsaXplSXRlbShzY2hlbWEsIGFkZGVkKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSBpZih3cml0dGVuSXRlbXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgLy8gcG90ZW50aWFsbHkgYXJlIG5vIHJlY29yZHNcclxuICAgICAgICBhd2FpdCB3cml0ZShcIlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBhd2FpdCB3cml0ZSgpO1xyXG4gICAgYXdhaXQgd3JpdGFibGVTdHJlYW0uZW5kKCk7XHJcbn07XHJcblxyXG5jb25zdCByZWFkID0gKHJlYWRhYmxlU3RyZWFtLCBzY2hlbWEpID0+IGFzeW5jIChvbkdldEl0ZW0sIG9uR2V0VGV4dCkgPT4ge1xyXG4gICAgY29uc3QgcmVhZElucHV0ID0gbmV3SW5wdXRSZWFkZXIocmVhZGFibGVTdHJlYW0pO1xyXG4gICAgbGV0IHRleHQgPSBhd2FpdCByZWFkSW5wdXQoKTtcclxuICAgIGxldCBzdGF0dXMgPSBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XHJcbiAgICB3aGlsZSh0ZXh0Lmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgaWYoc3RhdHVzID09PSBSRUFEX1JFTUFJTklOR19URVhUKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IG9uR2V0VGV4dCh0ZXh0KTtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihzdGF0dXMgPT09IENBTkNFTF9SRUFEKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByb3dUZXh0ID0gXCJcIjtcclxuICAgICAgICBsZXQgY3VycmVudENoYXJJbmRleD0wO1xyXG4gICAgICAgIGZvcihsZXQgY3VycmVudENoYXIgb2YgdGV4dCkge1xyXG4gICAgICAgICAgICByb3dUZXh0ICs9IGN1cnJlbnRDaGFyO1xyXG4gICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCJcXHJcIikge1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzID0gYXdhaXQgb25HZXRJdGVtKFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2VyaWFsaXplUm93KHNjaGVtYSwgcm93VGV4dClcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICByb3dUZXh0ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGlmKHN0YXR1cyA9PT0gUkVBRF9SRU1BSU5JTkdfVEVYVCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN1cnJlbnRDaGFySW5kZXgrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGN1cnJlbnRDaGFySW5kZXggPCB0ZXh0Lmxlbmd0aCAtMSkge1xyXG4gICAgICAgICAgICBhd2FpdCBvbkdldFRleHQodGV4dC5zdWJzdHJpbmcoY3VycmVudENoYXJJbmRleCArIDEpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRleHQgPSBhd2FpdCByZWFkSW5wdXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBhd2FpdCByZWFkYWJsZVN0cmVhbS5kZXN0cm95KCk7XHJcblxyXG59O1xyXG5cclxuY29uc3QgbmV3T3V0cHV0V3JpdGVyID0gKGZsdXNoQm91bmRhcnksIHdyaXRhYmxlU3RyZWFtKSA9PiB7XHJcbiAgICBcclxuICAgIGxldCBjdXJyZW50QnVmZmVyID0gbnVsbDtcclxuXHJcbiAgICByZXR1cm4gYXN5bmMgKHRleHQpID0+IHtcclxuXHJcbiAgICAgICAgaWYoaXNTdHJpbmcodGV4dCkgJiYgY3VycmVudEJ1ZmZlciA9PT0gbnVsbClcclxuICAgICAgICAgICAgY3VycmVudEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKHRleHQsIFwidXRmOFwiKTtcclxuICAgICAgICBlbHNlIGlmKGlzU3RyaW5nKHRleHQpKVxyXG4gICAgICAgICAgICBjdXJyZW50QnVmZmVyID0gQnVmZmVyLmNvbmNhdChbXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50QnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgQnVmZmVyLmZyb20odGV4dCwgXCJ1dGY4XCIpXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGN1cnJlbnRCdWZmZXIgIT09IG51bGwgJiZcclxuICAgICAgICAgICAgKGN1cnJlbnRCdWZmZXIubGVuZ3RoID4gZmx1c2hCb3VuZGFyeVxyXG4gICAgICAgICAgICAgfHwgIWlzU3RyaW5nKHRleHQpKSkge1xyXG5cclxuICAgICAgICAgICAgYXdhaXQgd3JpdGFibGVTdHJlYW0ud3JpdGUoY3VycmVudEJ1ZmZlcik7XHJcbiAgICAgICAgICAgIGN1cnJlbnRCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IG5ld0lucHV0UmVhZGVyID0gKHJlYWRhYmxlU3RyZWFtKSA9PiB7XHJcblxyXG4gICAgY29uc3QgZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKCd1dGY4Jyk7XHJcbiAgICBsZXQgcmVtYWluaW5nQnl0ZXMgPSBbXTtcclxuXHJcbiAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xyXG5cclxuICAgICAgICBsZXQgbmV4dEJ5dGVzQnVmZmVyID0gYXdhaXQgcmVhZGFibGVTdHJlYW0ucmVhZChCVUZGRVJfTUFYX0JZVEVTKTtcclxuICAgICAgICBjb25zdCByZW1haW5pbmdCdWZmZXIgPSBCdWZmZXIuZnJvbShyZW1haW5pbmdCeXRlcyk7XHJcblxyXG4gICAgICAgIGlmKCFuZXh0Qnl0ZXNCdWZmZXIpIG5leHRCeXRlc0J1ZmZlciA9IEJ1ZmZlci5mcm9tKFtdKTtcclxuXHJcbiAgICAgICAgY29uc3QgbW9yZVRvUmVhZCA9IG5leHRCeXRlc0J1ZmZlci5sZW5ndGggPT09IEJVRkZFUl9NQVhfQllURVM7XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoXHJcbiAgICAgICAgICAgIFtyZW1haW5pbmdCdWZmZXIsIG5leHRCeXRlc0J1ZmZlcl0sXHJcbiAgICAgICAgICAgIHJlbWFpbmluZ0J1ZmZlci5sZW5ndGggKyBuZXh0Qnl0ZXNCdWZmZXIubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGRlY29kZXIud3JpdGUoYnVmZmVyKTtcclxuICAgICAgICByZW1haW5pbmdCeXRlcyA9IGRlY29kZXIuZW5kKGJ1ZmZlcik7XHJcblxyXG4gICAgICAgIGlmKCFtb3JlVG9SZWFkICYmIHJlbWFpbmluZ0J5dGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgLy8gaWYgZm9yIGFueSByZWFzb24sIHdlIGhhdmUgcmVtYWluaW5nIGJ5dGVzIGF0IHRoZSBlbmRcclxuICAgICAgICAgICAgLy8gb2YgdGhlIHN0cmVhbSwganVzdCBkaXNjYXJkIC0gZG9udCBzZWUgd2h5IHRoaXMgc2hvdWxkXHJcbiAgICAgICAgICAgIC8vIGV2ZXIgaGFwcGVuLCBidXQgaWYgaXQgZG9lcywgaXQgY291bGQgY2F1c2UgYSBzdGFjayBvdmVyZmxvd1xyXG4gICAgICAgICAgICByZW1haW5pbmdCeXRlcyA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuY29uc3QgZGVzZXJpYWxpemVSb3cgPSAoc2NoZW1hLCByb3dUZXh0KSA9PiB7XHJcbiAgICBsZXQgY3VycmVudFByb3BJbmRleCA9IDA7XHJcbiAgICBsZXQgY3VycmVudENoYXJJbmRleCA9IDA7XHJcbiAgICBsZXQgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XHJcbiAgICBsZXQgaXNFc2NhcGVkID0gZmFsc2U7XHJcbiAgICBjb25zdCBpdGVtID0ge307XHJcblxyXG4gICAgY29uc3Qgc2V0Q3VycmVudFByb3AgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY3VycmVudFByb3AgPSBzY2hlbWFbY3VycmVudFByb3BJbmRleF07XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IGdldFR5cGUoY3VycmVudFByb3AudHlwZSk7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjdXJyZW50VmFsdWVUZXh0ID09PSBcIlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICA/IHR5cGUuZ2V0RGVmYXVsdFZhbHVlKClcclxuICAgICAgICAgICAgICAgICAgICAgIDogdHlwZS5zYWZlUGFyc2VWYWx1ZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWVUZXh0KTtcclxuICAgICAgICBpdGVtW2N1cnJlbnRQcm9wLm5hbWVdID0gdmFsdWU7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICB3aGlsZShjdXJyZW50UHJvcEluZGV4IDwgc2NoZW1hLmxlbmd0aCkge1xyXG5cclxuICAgICAgICBpZihjdXJyZW50Q2hhckluZGV4IDwgcm93VGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudENoYXIgPSByb3dUZXh0W2N1cnJlbnRDaGFySW5kZXhdO1xyXG4gICAgICAgICAgICBpZihpc0VzY2FwZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcInJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZVRleHQgKz0gXCJcXHJcIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCArPSBjdXJyZW50Q2hhcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlzRXNjYXBlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudENoYXIgPT09IFwiLFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0Q3VycmVudFByb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWVUZXh0ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UHJvcEluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoY3VycmVudENoYXIgPT09IFwiXFxcXFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNFc2NhcGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCArPSBjdXJyZW50Q2hhcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdXJyZW50Q2hhckluZGV4Kys7IFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRWYWx1ZVRleHQgPSBcIlwiO1xyXG4gICAgICAgICAgICBzZXRDdXJyZW50UHJvcCgpO1xyXG4gICAgICAgICAgICBjdXJyZW50UHJvcEluZGV4Kys7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBpdGVtO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHNlcmlhbGl6ZUl0ZW0gPSAoc2NoZW1hLCBpdGVtKSAgPT4ge1xyXG5cclxuICAgIGxldCByb3dUZXh0ID0gXCJcIlxyXG5cclxuICAgIGZvcihsZXQgcHJvcCBvZiBzY2hlbWEpIHtcclxuICAgICAgICBjb25zdCB0eXBlID0gZ2V0VHlwZShwcm9wLnR5cGUpO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gaGFzKHByb3AubmFtZSkoaXRlbSlcclxuICAgICAgICAgICAgICAgICAgICAgID8gaXRlbVtwcm9wLm5hbWVdXHJcbiAgICAgICAgICAgICAgICAgICAgICA6IHR5cGUuZ2V0RGVmYXVsdFZhbHVlKClcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB2YWxTdHIgPSB0eXBlLnN0cmluZ2lmeSh2YWx1ZSk7XHJcblxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB2YWxTdHIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudENoYXIgPSB2YWxTdHJbaV07XHJcbiAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcIixcIiBcclxuICAgICAgICAgICAgICAgfHwgY3VycmVudENoYXIgPT09IFwiXFxyXCIgXHJcbiAgICAgICAgICAgICAgIHx8IGN1cnJlbnRDaGFyID09PSBcIlxcXFxcIikge1xyXG4gICAgICAgICAgICAgICAgcm93VGV4dCArPSBcIlxcXFxcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoY3VycmVudENoYXIgPT09IFwiXFxyXCIpIHtcclxuICAgICAgICAgICAgICAgIHJvd1RleHQgKz0gXCJyXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByb3dUZXh0ICs9IGN1cnJlbnRDaGFyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3dUZXh0ICs9IFwiLFwiO1xyXG4gICAgfVxyXG5cclxuICAgIHJvd1RleHQgKz0gXCJcXHJcIjtcclxuICAgIHJldHVybiByb3dUZXh0O1xyXG59OyIsImltcG9ydCBsdW5yIGZyb20gJ2x1bnInO1xyXG5pbXBvcnQge1xyXG4gIGdldEhhc2hDb2RlLFxyXG4gIGpvaW5LZXlcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQge1xyXG4gIGdldEFjdHVhbEtleU9mUGFyZW50LFxyXG4gIGlzR2xvYmFsSW5kZXgsXHJcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHtwcm9taXNlUmVhZGFibGVTdHJlYW19IGZyb20gXCIuL3Byb21pc2VSZWFkYWJsZVN0cmVhbVwiO1xyXG5pbXBvcnQgeyBjcmVhdGVJbmRleEZpbGUgfSBmcm9tICcuL3NoYXJkaW5nJztcclxuaW1wb3J0IHsgZ2VuZXJhdGVTY2hlbWEgfSBmcm9tICcuL2luZGV4U2NoZW1hQ3JlYXRvcic7XHJcbmltcG9ydCB7IGdldEluZGV4UmVhZGVyLCBDT05USU5VRV9SRUFESU5HX1JFQ09SRFMgfSBmcm9tICcuL3NlcmlhbGl6ZXInO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlYWRJbmRleCA9IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkcyA9IFtdO1xyXG4gIGNvbnN0IGRvUmVhZCA9IGl0ZXJhdGVJbmRleChcclxuICAgICAgICBhc3luYyBpdGVtID0+IHtcclxuICAgICAgcmVjb3Jkcy5wdXNoKGl0ZW0pO1xyXG4gICAgICByZXR1cm4gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xyXG4gICAgfSxcclxuICAgICAgICBhc3luYyAoKSA9PiByZWNvcmRzXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIGF3YWl0IGRvUmVhZChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBzZWFyY2hJbmRleCA9IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5LCBzZWFyY2hQaHJhc2UpID0+IHtcclxuICBjb25zdCByZWNvcmRzID0gW107XHJcbiAgY29uc3Qgc2NoZW1hID0gZ2VuZXJhdGVTY2hlbWEoaGllcmFyY2h5LCBpbmRleCk7XHJcbiAgY29uc3QgZG9SZWFkID0gaXRlcmF0ZUluZGV4KFxyXG4gICAgICAgIGFzeW5jIGl0ZW0gPT4ge1xyXG4gICAgICBjb25zdCBpZHggPSBsdW5yKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnJlZigna2V5Jyk7XHJcbiAgICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBzY2hlbWEpIHtcclxuICAgICAgICAgIHRoaXMuZmllbGQoZmllbGQubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYWRkKGl0ZW0pO1xyXG4gICAgICB9KTtcclxuICAgICAgY29uc3Qgc2VhcmNoUmVzdWx0cyA9IGlkeC5zZWFyY2goc2VhcmNoUGhyYXNlKTtcclxuICAgICAgaWYgKHNlYXJjaFJlc3VsdHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgaXRlbS5fc2VhcmNoUmVzdWx0ID0gc2VhcmNoUmVzdWx0c1swXTtcclxuICAgICAgICByZWNvcmRzLnB1c2goaXRlbSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcclxuICAgIH0sXHJcbiAgICAgICAgYXN5bmMgKCkgPT4gcmVjb3Jkc1xyXG4gICk7XHJcblxyXG4gIHJldHVybiBhd2FpdCBkb1JlYWQoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhlZERhdGFLZXlfZnJvbUluZGV4S2V5ID0gKGluZGV4S2V5KSA9PiBcclxuICBgJHtpbmRleEtleX0ke2luZGV4S2V5LmVuZHNXaXRoKCcuY3N2JykgPyAnJyA6ICcuY3N2J31gO1xyXG5cclxuZXhwb3J0IGNvbnN0IHVuaXF1ZUluZGV4TmFtZSA9IGluZGV4ID0+IGBpZHhfJHtcclxuICBnZXRIYXNoQ29kZShgJHtpbmRleC5maWx0ZXJ9JHtpbmRleC5tYXB9YClcclxufS5jc3ZgO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEluZGV4ZWREYXRhS2V5ID0gKGRlY2VuZGFudEtleSwgaW5kZXhOb2RlKSA9PiB7XHJcbiAgaWYgKGlzR2xvYmFsSW5kZXgoaW5kZXhOb2RlKSkgeyByZXR1cm4gYCR7aW5kZXhOb2RlLm5vZGVLZXkoKX0uY3N2YDsgfVxyXG5cclxuICBjb25zdCBpbmRleGVkRGF0YVBhcmVudEtleSA9IGdldEFjdHVhbEtleU9mUGFyZW50KFxyXG4gICAgaW5kZXhOb2RlLnBhcmVudCgpLm5vZGVLZXkoKSxcclxuICAgIGRlY2VuZGFudEtleSxcclxuICApO1xyXG5cclxuICBjb25zdCBpbmRleE5hbWUgPSBpbmRleE5vZGUubmFtZVxyXG4gICAgPyBgJHtpbmRleE5vZGUubmFtZX0uY3N2YFxyXG4gICAgOiB1bmlxdWVJbmRleE5hbWUoaW5kZXhOb2RlKTtcclxuXHJcbiAgcmV0dXJuIGpvaW5LZXkoXHJcbiAgICBpbmRleGVkRGF0YVBhcmVudEtleSxcclxuICAgIGluZGV4TmFtZSxcclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGl0ZXJhdGVJbmRleCA9IChvbkdldEl0ZW0sIGdldEZpbmFsUmVzdWx0KSA9PiBhc3luYyAoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZWFkYWJsZVN0cmVhbSA9IHByb21pc2VSZWFkYWJsZVN0cmVhbShcclxuICAgICAgICBhd2FpdCBkYXRhc3RvcmUucmVhZGFibGVGaWxlU3RyZWFtKGluZGV4ZWREYXRhS2V5KVxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCByZWFkID0gZ2V0SW5kZXhSZWFkZXIoaGllcmFyY2h5LCBpbmRleCwgcmVhZGFibGVTdHJlYW0pO1xyXG4gICAgYXdhaXQgcmVhZChvbkdldEl0ZW0pO1xyXG4gICAgcmV0dXJuIGdldEZpbmFsUmVzdWx0KCk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgaWYgKGF3YWl0IGRhdGFzdG9yZS5leGlzdHMoaW5kZXhlZERhdGFLZXkpKSB7XHJcbiAgICAgIHRocm93IGU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhd2FpdCBjcmVhdGVJbmRleEZpbGUoXHJcbiAgICAgICAgZGF0YXN0b3JlLFxyXG4gICAgICAgIGluZGV4ZWREYXRhS2V5LFxyXG4gICAgICAgIGluZGV4LFxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxufTtcclxuIiwiaW1wb3J0IHsgZmxhdHRlbiwgbWVyZ2UgfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQge1xyXG4gIHNhZmVLZXksIGFwaVdyYXBwZXIsICQsXHJcbiAgZXZlbnRzLCBpc05vbkVtcHR5U3RyaW5nLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IHJlYWRJbmRleCwgc2VhcmNoSW5kZXggfSBmcm9tICcuLi9pbmRleGluZy9yZWFkJztcclxuaW1wb3J0IHtcclxuICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXksXHJcbiAgZ2V0U2hhcmRLZXlzSW5SYW5nZSxcclxufSBmcm9tICcuLi9pbmRleGluZy9zaGFyZGluZyc7XHJcbmltcG9ydCB7XHJcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCwgaXNJbmRleCxcclxuICBpc1NoYXJkZWRJbmRleCxcclxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XHJcblxyXG5leHBvcnQgY29uc3QgbGlzdEl0ZW1zID0gYXBwID0+IGFzeW5jIChpbmRleEtleSwgb3B0aW9ucykgPT4gYXBpV3JhcHBlcihcclxuICBhcHAsXHJcbiAgZXZlbnRzLmluZGV4QXBpLmxpc3RJdGVtcyxcclxuICBwZXJtaXNzaW9uLnJlYWRJbmRleC5pc0F1dGhvcml6ZWQoaW5kZXhLZXkpLFxyXG4gIHsgaW5kZXhLZXksIG9wdGlvbnMgfSxcclxuICBfbGlzdEl0ZW1zLCBhcHAsIGluZGV4S2V5LCBvcHRpb25zLFxyXG4pO1xyXG5cclxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7IHJhbmdlU3RhcnRQYXJhbXM6IG51bGwsIHJhbmdlRW5kUGFyYW1zOiBudWxsLCBzZWFyY2hQaHJhc2U6IG51bGwgfTtcclxuXHJcbmNvbnN0IF9saXN0SXRlbXMgPSBhc3luYyAoYXBwLCBpbmRleEtleSwgb3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zKSA9PiB7XHJcbiAgY29uc3QgeyBzZWFyY2hQaHJhc2UsIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zIH0gPSAkKHt9LCBbXHJcbiAgICBtZXJnZShvcHRpb25zKSxcclxuICAgIG1lcmdlKGRlZmF1bHRPcHRpb25zKSxcclxuICBdKTtcclxuXHJcbiAgY29uc3QgZ2V0SXRlbXMgPSBhc3luYyBrZXkgPT4gKGlzTm9uRW1wdHlTdHJpbmcoc2VhcmNoUGhyYXNlKVxyXG4gICAgPyBhd2FpdCBzZWFyY2hJbmRleChcclxuICAgICAgYXBwLmhpZXJhcmNoeSxcclxuICAgICAgYXBwLmRhdGFzdG9yZSxcclxuICAgICAgaW5kZXhOb2RlLFxyXG4gICAgICBrZXksXHJcbiAgICAgIHNlYXJjaFBocmFzZSxcclxuICAgIClcclxuICAgIDogYXdhaXQgcmVhZEluZGV4KFxyXG4gICAgICBhcHAuaGllcmFyY2h5LFxyXG4gICAgICBhcHAuZGF0YXN0b3JlLFxyXG4gICAgICBpbmRleE5vZGUsXHJcbiAgICAgIGtleSxcclxuICAgICkpO1xyXG5cclxuICBpbmRleEtleSA9IHNhZmVLZXkoaW5kZXhLZXkpO1xyXG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoaW5kZXhLZXkpO1xyXG5cclxuICBpZiAoIWlzSW5kZXgoaW5kZXhOb2RlKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ3N1cHBsaWVkIGtleSBpcyBub3QgYW4gaW5kZXgnKTsgfVxyXG5cclxuICBpZiAoaXNTaGFyZGVkSW5kZXgoaW5kZXhOb2RlKSkge1xyXG4gICAgY29uc3Qgc2hhcmRLZXlzID0gYXdhaXQgZ2V0U2hhcmRLZXlzSW5SYW5nZShcclxuICAgICAgYXBwLCBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMsXHJcbiAgICApO1xyXG4gICAgY29uc3QgaXRlbXMgPSBbXTtcclxuICAgIGZvciAoY29uc3QgayBvZiBzaGFyZEtleXMpIHtcclxuICAgICAgaXRlbXMucHVzaChhd2FpdCBnZXRJdGVtcyhrKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmxhdHRlbihpdGVtcyk7XHJcbiAgfVxyXG4gIHJldHVybiBhd2FpdCBnZXRJdGVtcyhcclxuICAgIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleShpbmRleEtleSksXHJcbiAgKTtcclxufTtcclxuIiwiaW1wb3J0IHsgaGFzLCBzb21lIH0gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgbWFwLCBpc1N0cmluZyB9IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7XHJcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcclxuICBmaW5kRmllbGQsIGdldE5vZGUsIGlzR2xvYmFsSW5kZXgsXHJcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHsgbGlzdEl0ZW1zIH0gZnJvbSAnLi4vaW5kZXhBcGkvbGlzdEl0ZW1zJztcclxuaW1wb3J0IHtcclxuICAkLCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IGdldEluZGV4S2V5X0Jhc2VkT25EZWNlbmRhbnQgfSBmcm9tICcuLi9pbmRleGluZy9zaGFyZGluZyc7XHJcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRDb250ZXh0ID0gYXBwID0+IHJlY29yZEtleSA9PiBhcGlXcmFwcGVyU3luYyhcclxuICBhcHAsXHJcbiAgZXZlbnRzLnJlY29yZEFwaS5nZXRDb250ZXh0LFxyXG4gIHBlcm1pc3Npb24ucmVhZFJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkS2V5KSxcclxuICB7IHJlY29yZEtleSB9LFxyXG4gIF9nZXRDb250ZXh0LCBhcHAsIHJlY29yZEtleSxcclxuKTtcclxuXHJcbmV4cG9ydCBjb25zdCBfZ2V0Q29udGV4dCA9IChhcHAsIHJlY29yZEtleSkgPT4ge1xyXG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKHJlY29yZEtleSk7XHJcblxyXG4gIGNvbnN0IGNhY2hlZFJlZmVyZW5jZUluZGV4ZXMgPSB7fTtcclxuXHJcbiAgY29uc3QgbGF6eUxvYWRSZWZlcmVuY2VJbmRleCA9IGFzeW5jICh0eXBlT3B0aW9ucykgPT4ge1xyXG4gICAgaWYgKCFoYXMoY2FjaGVkUmVmZXJlbmNlSW5kZXhlcywgdHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5KSkge1xyXG4gICAgICBjYWNoZWRSZWZlcmVuY2VJbmRleGVzW3R5cGVPcHRpb25zLmluZGV4Tm9kZUtleV0gPSB7XHJcbiAgICAgICAgdHlwZU9wdGlvbnMsXHJcbiAgICAgICAgZGF0YTogYXdhaXQgcmVhZFJlZmVyZW5jZUluZGV4KFxyXG4gICAgICAgICAgYXBwLCByZWNvcmRLZXksIHR5cGVPcHRpb25zLFxyXG4gICAgICAgICksXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNhY2hlZFJlZmVyZW5jZUluZGV4ZXNbdHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5XTtcclxuICB9O1xyXG5cclxuICBjb25zdCBnZXRUeXBlT3B0aW9ucyA9IHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSA9PiAoaXNTdHJpbmcodHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKVxyXG4gICAgPyBmaW5kRmllbGQocmVjb3JkTm9kZSwgdHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKVxyXG4gICAgICAudHlwZU9wdGlvbnNcclxuICAgIDogdHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHJlZmVyZW5jZUV4aXN0czogYXN5bmMgKHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSwga2V5KSA9PiB7XHJcbiAgICAgIGNvbnN0IHR5cGVPcHRpb25zID0gZ2V0VHlwZU9wdGlvbnModHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKTtcclxuICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBsYXp5TG9hZFJlZmVyZW5jZUluZGV4KHR5cGVPcHRpb25zKTtcclxuICAgICAgcmV0dXJuIHNvbWUoZGF0YSwgaSA9PiBpLmtleSA9PT0ga2V5KTtcclxuICAgIH0sXHJcbiAgICByZWZlcmVuY2VPcHRpb25zOiBhc3luYyAodHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKSA9PiB7XHJcbiAgICAgIGNvbnN0IHR5cGVPcHRpb25zID0gZ2V0VHlwZU9wdGlvbnModHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKTtcclxuICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBsYXp5TG9hZFJlZmVyZW5jZUluZGV4KHR5cGVPcHRpb25zKTtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9LFxyXG4gICAgcmVjb3JkTm9kZSxcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3QgcmVhZFJlZmVyZW5jZUluZGV4ID0gYXN5bmMgKGFwcCwgcmVjb3JkS2V5LCB0eXBlT3B0aW9ucykgPT4ge1xyXG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldE5vZGUoYXBwLmhpZXJhcmNoeSwgdHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5KTtcclxuICBjb25zdCBpbmRleEtleSA9IGlzR2xvYmFsSW5kZXgoaW5kZXhOb2RlKVxyXG4gICAgPyBpbmRleE5vZGUubm9kZUtleSgpXHJcbiAgICA6IGdldEluZGV4S2V5X0Jhc2VkT25EZWNlbmRhbnQoXHJcbiAgICAgIHJlY29yZEtleSwgaW5kZXhOb2RlLFxyXG4gICAgKTtcclxuXHJcbiAgY29uc3QgaXRlbXMgPSBhd2FpdCBsaXN0SXRlbXMoYXBwKShpbmRleEtleSk7XHJcbiAgcmV0dXJuICQoaXRlbXMsIFtcclxuICAgIG1hcChpID0+ICh7XHJcbiAgICAgIGtleTogaS5rZXksXHJcbiAgICAgIHZhbHVlOiBpW3R5cGVPcHRpb25zLmRpc3BsYXlWYWx1ZV0sXHJcbiAgICB9KSksXHJcbiAgXSk7XHJcbn07XHJcbiIsImltcG9ydCB7XHJcbiAgbWFwLCByZWR1Y2UsIGZpbHRlcixcclxuICBpc0VtcHR5LCBmbGF0dGVuLCBlYWNoLFxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBnZXRFeGFjdE5vZGVGb3JQYXRoIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHsgdmFsaWRhdGVGaWVsZFBhcnNlLCB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyB9IGZyb20gJy4uL3R5cGVzJztcclxuaW1wb3J0IHsgJCwgaXNOb3RoaW5nLCBpc05vbkVtcHR5U3RyaW5nIH0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgX2dldENvbnRleHQgfSBmcm9tICcuL2dldENvbnRleHQnO1xyXG5cclxuY29uc3QgZmllbGRQYXJzZUVycm9yID0gKGZpZWxkTmFtZSwgdmFsdWUpID0+ICh7XHJcbiAgZmllbGRzOiBbZmllbGROYW1lXSxcclxuICBtZXNzYWdlOiBgQ291bGQgbm90IHBhcnNlIGZpZWxkICR7ZmllbGROYW1lfToke3ZhbHVlfWAsXHJcbn0pO1xyXG5cclxuY29uc3QgdmFsaWRhdGVBbGxGaWVsZFBhcnNlID0gKHJlY29yZCwgcmVjb3JkTm9kZSkgPT4gJChyZWNvcmROb2RlLmZpZWxkcywgW1xyXG4gIG1hcChmID0+ICh7IG5hbWU6IGYubmFtZSwgcGFyc2VSZXN1bHQ6IHZhbGlkYXRlRmllbGRQYXJzZShmLCByZWNvcmQpIH0pKSxcclxuICByZWR1Y2UoKGVycm9ycywgZikgPT4ge1xyXG4gICAgaWYgKGYucGFyc2VSZXN1bHQuc3VjY2VzcykgcmV0dXJuIGVycm9ycztcclxuICAgIGVycm9ycy5wdXNoKFxyXG4gICAgICBmaWVsZFBhcnNlRXJyb3IoZi5uYW1lLCBmLnBhcnNlUmVzdWx0LnZhbHVlKSxcclxuICAgICk7XHJcbiAgICByZXR1cm4gZXJyb3JzO1xyXG4gIH0sIFtdKSxcclxuXSk7XHJcblxyXG5jb25zdCB2YWxpZGF0ZUFsbFR5cGVDb25zdHJhaW50cyA9IGFzeW5jIChyZWNvcmQsIHJlY29yZE5vZGUsIGNvbnRleHQpID0+IHtcclxuICBjb25zdCBlcnJvcnMgPSBbXTtcclxuICBmb3IgKGNvbnN0IGZpZWxkIG9mIHJlY29yZE5vZGUuZmllbGRzKSB7XHJcbiAgICAkKGF3YWl0IHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzKGZpZWxkLCByZWNvcmQsIGNvbnRleHQpLCBbXHJcbiAgICAgIGZpbHRlcihpc05vbkVtcHR5U3RyaW5nKSxcclxuICAgICAgbWFwKG0gPT4gKHsgbWVzc2FnZTogbSwgZmllbGRzOiBbZmllbGQubmFtZV0gfSkpLFxyXG4gICAgICBlYWNoKGUgPT4gZXJyb3JzLnB1c2goZSkpLFxyXG4gICAgXSk7XHJcbiAgfVxyXG4gIHJldHVybiBlcnJvcnM7XHJcbn07XHJcblxyXG5jb25zdCBydW5SZWNvcmRWYWxpZGF0aW9uUnVsZXMgPSAocmVjb3JkLCByZWNvcmROb2RlKSA9PiB7XHJcbiAgY29uc3QgcnVuVmFsaWRhdGlvblJ1bGUgPSAocnVsZSkgPT4ge1xyXG4gICAgY29uc3QgaXNWYWxpZCA9IGNvbXBpbGVFeHByZXNzaW9uKHJ1bGUuZXhwcmVzc2lvbldoZW5WYWxpZCk7XHJcbiAgICBjb25zdCBleHByZXNzaW9uQ29udGV4dCA9IHsgcmVjb3JkLCBfIH07XHJcbiAgICByZXR1cm4gKGlzVmFsaWQoZXhwcmVzc2lvbkNvbnRleHQpXHJcbiAgICAgID8geyB2YWxpZDogdHJ1ZSB9XHJcbiAgICAgIDogKHtcclxuICAgICAgICB2YWxpZDogZmFsc2UsXHJcbiAgICAgICAgZmllbGRzOiBydWxlLmludmFsaWRGaWVsZHMsXHJcbiAgICAgICAgbWVzc2FnZTogcnVsZS5tZXNzYWdlV2hlbkludmFsaWQsXHJcbiAgICAgIH0pKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gJChyZWNvcmROb2RlLnZhbGlkYXRpb25SdWxlcywgW1xyXG4gICAgbWFwKHJ1blZhbGlkYXRpb25SdWxlKSxcclxuICAgIGZsYXR0ZW4sXHJcbiAgICBmaWx0ZXIociA9PiByLnZhbGlkID09PSBmYWxzZSksXHJcbiAgICBtYXAociA9PiAoeyBmaWVsZHM6IHIuZmllbGRzLCBtZXNzYWdlOiByLm1lc3NhZ2UgfSkpLFxyXG4gIF0pO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlID0gYXBwID0+IGFzeW5jIChyZWNvcmQsIGNvbnRleHQpID0+IHtcclxuICBjb250ZXh0ID0gaXNOb3RoaW5nKGNvbnRleHQpXHJcbiAgICA/IF9nZXRDb250ZXh0KGFwcCwgcmVjb3JkLmtleSlcclxuICAgIDogY29udGV4dDtcclxuXHJcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkocmVjb3JkLmtleSk7XHJcbiAgY29uc3QgZmllbGRQYXJzZUZhaWxzID0gdmFsaWRhdGVBbGxGaWVsZFBhcnNlKHJlY29yZCwgcmVjb3JkTm9kZSk7XHJcblxyXG4gIC8vIG5vbiBwYXJzaW5nIHdvdWxkIGNhdXNlIGZ1cnRoZXIgaXNzdWVzIC0gZXhpdCBoZXJlXHJcbiAgaWYgKCFpc0VtcHR5KGZpZWxkUGFyc2VGYWlscykpIHsgcmV0dXJuICh7IGlzVmFsaWQ6IGZhbHNlLCBlcnJvcnM6IGZpZWxkUGFyc2VGYWlscyB9KTsgfVxyXG5cclxuICBjb25zdCByZWNvcmRWYWxpZGF0aW9uUnVsZUZhaWxzID0gcnVuUmVjb3JkVmFsaWRhdGlvblJ1bGVzKHJlY29yZCwgcmVjb3JkTm9kZSk7XHJcbiAgY29uc3QgdHlwZUNvbnRyYWludEZhaWxzID0gYXdhaXQgdmFsaWRhdGVBbGxUeXBlQ29uc3RyYWludHMocmVjb3JkLCByZWNvcmROb2RlLCBjb250ZXh0KTtcclxuXHJcbiAgaWYgKGlzRW1wdHkoZmllbGRQYXJzZUZhaWxzKVxyXG4gICAgICAgJiYgaXNFbXB0eShyZWNvcmRWYWxpZGF0aW9uUnVsZUZhaWxzKVxyXG4gICAgICAgJiYgaXNFbXB0eSh0eXBlQ29udHJhaW50RmFpbHMpKSB7XHJcbiAgICByZXR1cm4gKHsgaXNWYWxpZDogdHJ1ZSwgZXJyb3JzOiBbXSB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoe1xyXG4gICAgaXNWYWxpZDogZmFsc2UsXHJcbiAgICBlcnJvcnM6IF8udW5pb24oZmllbGRQYXJzZUZhaWxzLCB0eXBlQ29udHJhaW50RmFpbHMsIHJlY29yZFZhbGlkYXRpb25SdWxlRmFpbHMpLFxyXG4gIH0pO1xyXG59O1xyXG4iLCJpbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQge1xyXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcclxuICBpc0NvbGxlY3Rpb25SZWNvcmQsXHJcbiAgaXNSb290LFxyXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXHJcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHsgJCwgYWxsVHJ1ZSwgam9pbktleSB9IGZyb20gJy4uL2NvbW1vbic7XHJcblxyXG5jb25zdCBlbnN1cmVDb2xsZWN0aW9uSXNJbml0aWFsaXNlZCA9IGFzeW5jIChkYXRhc3RvcmUsIG5vZGUsIHBhcmVudEtleSkgPT4ge1xyXG4gIGlmICghYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhwYXJlbnRLZXkpKSB7XHJcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKHBhcmVudEtleSk7XHJcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKFxyXG4gICAgICBqb2luS2V5KHBhcmVudEtleSwgJ2FsbGlkcycpLFxyXG4gICAgKTtcclxuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoXHJcbiAgICAgIGpvaW5LZXkoXHJcbiAgICAgICAgcGFyZW50S2V5LFxyXG4gICAgICAgICdhbGxpZHMnLFxyXG4gICAgICAgIG5vZGUubm9kZUlkLnRvU3RyaW5nKCksXHJcbiAgICAgICksXHJcbiAgICApO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlUm9vdENvbGxlY3Rpb25zID0gYXN5bmMgKGRhdGFzdG9yZSwgaGllcmFyY2h5KSA9PiB7XHJcbiAgY29uc3Qgcm9vdENvbGxlY3Rpb25SZWNvcmQgPSBhbGxUcnVlKFxyXG4gICAgbiA9PiBpc1Jvb3Qobi5wYXJlbnQoKSksXHJcbiAgICBpc0NvbGxlY3Rpb25SZWNvcmQsXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgZmxhdGhpZXJhcmNoeSA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShoaWVyYXJjaHkpO1xyXG5cclxuICBjb25zdCBjb2xsZWN0aW9uUmVjb3JkcyA9ICQoZmxhdGhpZXJhcmNoeSwgW1xyXG4gICAgZmlsdGVyKHJvb3RDb2xsZWN0aW9uUmVjb3JkKSxcclxuICBdKTtcclxuXHJcbiAgZm9yIChjb25zdCBjb2wgb2YgY29sbGVjdGlvblJlY29yZHMpIHtcclxuICAgIGF3YWl0IGVuc3VyZUNvbGxlY3Rpb25Jc0luaXRpYWxpc2VkKFxyXG4gICAgICBkYXRhc3RvcmUsXHJcbiAgICAgIGNvbCxcclxuICAgICAgY29sLmNvbGxlY3Rpb25QYXRoUmVneCgpLFxyXG4gICAgKTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdGlhbGlzZUNoaWxkQ29sbGVjdGlvbnMgPSBhc3luYyAoYXBwLCByZWNvcmRLZXkpID0+IHtcclxuICBjb25zdCBjaGlsZENvbGxlY3Rpb25SZWNvcmRzID0gJChyZWNvcmRLZXksIFtcclxuICAgIGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSksXHJcbiAgICBuID0+IG4uY2hpbGRyZW4sXHJcbiAgICBmaWx0ZXIoaXNDb2xsZWN0aW9uUmVjb3JkKSxcclxuICBdKTtcclxuXHJcbiAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZENvbGxlY3Rpb25SZWNvcmRzKSB7XHJcbiAgICBhd2FpdCBlbnN1cmVDb2xsZWN0aW9uSXNJbml0aWFsaXNlZChcclxuICAgICAgYXBwLmRhdGFzdG9yZSxcclxuICAgICAgY2hpbGQsXHJcbiAgICAgIGpvaW5LZXkocmVjb3JkS2V5LCBjaGlsZC5jb2xsZWN0aW9uTmFtZSksXHJcbiAgICApO1xyXG4gIH1cclxufTtcclxuIiwiaW1wb3J0IHtcclxuICBqb2luLCBwdWxsLFxyXG4gIG1hcCwgZmxhdHRlbiwgb3JkZXJCeSxcclxuICBmaWx0ZXIsIGZpbmQsXHJcbn0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHtcclxuICBnZXRQYXJlbnRLZXksXHJcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxyXG4gIGdldENvbGxlY3Rpb25Ob2RlQnlLZXlPck5vZGVLZXksIGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aCxcclxuICBpc0NvbGxlY3Rpb25SZWNvcmQsIGlzQW5jZXN0b3IsXHJcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHsgam9pbktleSwgc2FmZUtleSwgJCB9IGZyb20gJy4uL2NvbW1vbic7XHJcblxyXG5jb25zdCBhbGxJZENoYXJzID0gJzAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXy0nO1xyXG5cclxuY29uc3QgYWxsSWRzU3RyaW5nc0ZvckZhY3RvciA9IChjb2xsZWN0aW9uTm9kZSkgPT4ge1xyXG4gIGNvbnN0IGZhY3RvciA9IGNvbGxlY3Rpb25Ob2RlLmFsbGlkc1NoYXJkRmFjdG9yO1xyXG4gIGNvbnN0IGNoYXJSYW5nZVBlclNoYXJkID0gNjQgLyBmYWN0b3I7XHJcbiAgY29uc3QgYWxsSWRTdHJpbmdzID0gW107XHJcbiAgbGV0IGluZGV4ID0gMDtcclxuICBsZXQgY3VycmVudElkc1NoYXJkID0gJyc7XHJcbiAgd2hpbGUgKGluZGV4IDwgNjQpIHtcclxuICAgIGN1cnJlbnRJZHNTaGFyZCArPSBhbGxJZENoYXJzW2luZGV4XTtcclxuICAgIGlmICgoaW5kZXggKyAxKSAlIGNoYXJSYW5nZVBlclNoYXJkID09PSAwKSB7XHJcbiAgICAgIGFsbElkU3RyaW5ncy5wdXNoKGN1cnJlbnRJZHNTaGFyZCk7XHJcbiAgICAgIGN1cnJlbnRJZHNTaGFyZCA9ICcnO1xyXG4gICAgfVxyXG4gICAgaW5kZXgrKztcclxuICB9XHJcblxyXG4gIHJldHVybiBhbGxJZFN0cmluZ3M7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0QWxsSWRzU2hhcmROYW1lcyA9IChhcHBIaWVyYXJjaHksIGNvbGxlY3Rpb25LZXkpID0+IHtcclxuICBjb25zdCBjb2xsZWN0aW9uUmVjb3JkTm9kZSA9IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHBIaWVyYXJjaHkpKGNvbGxlY3Rpb25LZXkpO1xyXG4gIHJldHVybiAkKGNvbGxlY3Rpb25SZWNvcmROb2RlLCBbXHJcbiAgICBjID0+IFtjLm5vZGVJZF0sXHJcbiAgICBtYXAoaSA9PiBtYXAoYyA9PiBfYWxsSWRzU2hhcmRLZXkoY29sbGVjdGlvbktleSwgaSwgYykpKGFsbElkc1N0cmluZ3NGb3JGYWN0b3IoY29sbGVjdGlvblJlY29yZE5vZGUpKSksXHJcbiAgICBmbGF0dGVuLFxyXG4gIF0pO1xyXG59O1xyXG5cclxuY29uc3QgX2FsbElkc1NoYXJkS2V5ID0gKGNvbGxlY3Rpb25LZXksIGNoaWxkTm8sIHNoYXJkS2V5KSA9PiBqb2luS2V5KFxyXG4gIGNvbGxlY3Rpb25LZXksXHJcbiAgJ2FsbGlkcycsXHJcbiAgY2hpbGRObyxcclxuICBzaGFyZEtleSxcclxuKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRBbGxJZHNTaGFyZEtleSA9IChhcHBIaWVyYXJjaHksIGNvbGxlY3Rpb25LZXksIHJlY29yZElkKSA9PiB7XHJcbiAgY29uc3QgaW5kZXhPZkZpcnN0RGFzaCA9IHJlY29yZElkLmluZGV4T2YoJy0nKTtcclxuXHJcbiAgY29uc3QgY29sbGVjdGlvbk5vZGUgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwSGllcmFyY2h5KShjb2xsZWN0aW9uS2V5KTtcclxuXHJcbiAgY29uc3QgaWRGaXJzdENoYXIgPSByZWNvcmRJZFtpbmRleE9mRmlyc3REYXNoICsgMV07XHJcbiAgY29uc3QgYWxsSWRzU2hhcmRJZCA9ICQoY29sbGVjdGlvbk5vZGUsIFtcclxuICAgIGFsbElkc1N0cmluZ3NGb3JGYWN0b3IsXHJcbiAgICBmaW5kKGkgPT4gaS5pbmNsdWRlcyhpZEZpcnN0Q2hhcikpLFxyXG4gIF0pO1xyXG5cclxuICByZXR1cm4gX2FsbElkc1NoYXJkS2V5KFxyXG4gICAgY29sbGVjdGlvbktleSxcclxuICAgIHJlY29yZElkLnNsaWNlKDAsIGluZGV4T2ZGaXJzdERhc2gpLFxyXG4gICAgYWxsSWRzU2hhcmRJZCxcclxuICApO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0T3JDcmVhdGVTaGFyZEZpbGUgPSBhc3luYyAoZGF0YXN0b3JlLCBhbGxJZHNLZXkpID0+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IGRhdGFzdG9yZS5sb2FkRmlsZShhbGxJZHNLZXkpO1xyXG4gIH0gY2F0Y2ggKGVMb2FkKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRmlsZShhbGxJZHNLZXksICcnKTtcclxuICAgICAgcmV0dXJuICcnO1xyXG4gICAgfSBjYXRjaCAoZUNyZWF0ZSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgYEVycm9yIGxvYWRpbmcsIHRoZW4gY3JlYXRpbmcgYWxsSWRzICR7YWxsSWRzS2V5XHJcbiAgICAgICAgfSA6IExPQUQgOiAke2VMb2FkLm1lc3NhZ2VcclxuICAgICAgICB9IDogQ1JFQVRFIDogJHtlQ3JlYXRlfWAsXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgZ2V0U2hhcmRGaWxlID0gYXN5bmMgKGRhdGFzdG9yZSwgYWxsSWRzS2V5KSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBhd2FpdCBkYXRhc3RvcmUubG9hZEZpbGUoYWxsSWRzS2V5KTtcclxuICB9IGNhdGNoIChlTG9hZCkge1xyXG4gICAgcmV0dXJuICcnO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBhZGRUb0FsbElkcyA9IChhcHBIaWVyYXJjaHksIGRhdGFzdG9yZSkgPT4gYXN5bmMgKHJlY29yZCkgPT4ge1xyXG4gIGNvbnN0IGFsbElkc0tleSA9IGdldEFsbElkc1NoYXJkS2V5KFxyXG4gICAgYXBwSGllcmFyY2h5LFxyXG4gICAgZ2V0UGFyZW50S2V5KHJlY29yZC5rZXkpLFxyXG4gICAgcmVjb3JkLmlkLFxyXG4gICk7XHJcblxyXG4gIGxldCBhbGxJZHMgPSBhd2FpdCBnZXRPckNyZWF0ZVNoYXJkRmlsZShkYXRhc3RvcmUsIGFsbElkc0tleSk7XHJcblxyXG4gIGFsbElkcyArPSBgJHthbGxJZHMubGVuZ3RoID4gMCA/ICcsJyA6ICcnfSR7cmVjb3JkLmlkfWA7XHJcblxyXG4gIGF3YWl0IGRhdGFzdG9yZS51cGRhdGVGaWxlKGFsbElkc0tleSwgYWxsSWRzKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRBbGxJZHNJdGVyYXRvciA9IGFwcCA9PiBhc3luYyAoY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSkgPT4ge1xyXG4gIGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXkgPSBzYWZlS2V5KGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXkpO1xyXG4gIGNvbnN0IHRhcmdldE5vZGUgPSBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5KFxyXG4gICAgYXBwLmhpZXJhcmNoeSxcclxuICAgIGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXksXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgZ2V0QWxsSWRzSXRlcmF0b3JGb3JDb2xsZWN0aW9uS2V5ID0gYXN5bmMgKGNvbGxlY3Rpb25LZXkpID0+IHtcclxuICAgIGNvbnN0IGFsbF9hbGxJZHNLZXlzID0gZ2V0QWxsSWRzU2hhcmROYW1lcyhhcHAuaGllcmFyY2h5LCBjb2xsZWN0aW9uS2V5KTtcclxuICAgIGxldCBzaGFyZEluZGV4ID0gMDtcclxuXHJcbiAgICBjb25zdCBhbGxJZHNGcm9tU2hhcmRJdGVyYXRvciA9IGFzeW5jICgpID0+IHtcclxuICAgICAgaWYgKHNoYXJkSW5kZXggPT09IGFsbF9hbGxJZHNLZXlzLmxlbmd0aCkgeyByZXR1cm4gKHsgZG9uZTogdHJ1ZSwgcmVzdWx0OiB7IGlkczogW10sIGNvbGxlY3Rpb25LZXkgfSB9KTsgfVxyXG5cclxuICAgICAgY29uc3Qgc2hhcmRLZXkgPSBhbGxfYWxsSWRzS2V5c1tzaGFyZEluZGV4XTtcclxuXHJcbiAgICAgIGNvbnN0IGFsbElkcyA9IGF3YWl0IGdldEFsbElkc0Zyb21TaGFyZChhcHAuZGF0YXN0b3JlLCBzaGFyZEtleSk7XHJcblxyXG4gICAgICBzaGFyZEluZGV4Kys7XHJcblxyXG4gICAgICByZXR1cm4gKHtcclxuICAgICAgICByZXN1bHQ6IHtcclxuICAgICAgICAgIGlkczogYWxsSWRzLFxyXG4gICAgICAgICAgY29sbGVjdGlvbktleSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRvbmU6IGZhbHNlLFxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGFsbElkc0Zyb21TaGFyZEl0ZXJhdG9yO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGFuY2VzdG9ycyA9ICQoZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGFwcC5oaWVyYXJjaHkpLCBbXHJcbiAgICBmaWx0ZXIoaXNDb2xsZWN0aW9uUmVjb3JkKSxcclxuICAgIGZpbHRlcihuID0+IGlzQW5jZXN0b3IodGFyZ2V0Tm9kZSkobilcclxuICAgICAgICAgICAgICAgICAgICB8fCBuLm5vZGVLZXkoKSA9PT0gdGFyZ2V0Tm9kZS5ub2RlS2V5KCkpLFxyXG4gICAgb3JkZXJCeShbbiA9PiBuLm5vZGVLZXkoKS5sZW5ndGhdLCBbJ2FzYyddKSxcclxuICBdKTsgLy8gcGFyZW50cyBmaXJzdFxyXG5cclxuICBjb25zdCB0cmF2ZXJzZUZvckl0ZXJhdGVyYXRvcnMgPSBhc3luYyAocGFyZW50UmVjb3JkS2V5ID0gJycsIGN1cnJlbnROb2RlSW5kZXggPSAwKSA9PiB7XHJcbiAgICBjb25zdCBjdXJyZW50Tm9kZSA9IGFuY2VzdG9yc1tjdXJyZW50Tm9kZUluZGV4XTtcclxuICAgIGNvbnN0IGN1cnJlbnRDb2xsZWN0aW9uS2V5ID0gam9pbktleShcclxuICAgICAgcGFyZW50UmVjb3JkS2V5LFxyXG4gICAgICBjdXJyZW50Tm9kZS5jb2xsZWN0aW9uTmFtZSxcclxuICAgICk7XHJcbiAgICBpZiAoY3VycmVudE5vZGUubm9kZUtleSgpID09PSB0YXJnZXROb2RlLm5vZGVLZXkoKSkge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yRm9yQ29sbGVjdGlvbktleShcclxuICAgICAgICAgIGN1cnJlbnRDb2xsZWN0aW9uS2V5LFxyXG4gICAgICAgICldO1xyXG4gICAgfVxyXG4gICAgY29uc3QgYWxsSXRlcmF0b3JzID0gW107XHJcbiAgICBjb25zdCBjdXJyZW50SXRlcmF0b3IgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvckZvckNvbGxlY3Rpb25LZXkoXHJcbiAgICAgIGN1cnJlbnRDb2xsZWN0aW9uS2V5LFxyXG4gICAgKTtcclxuXHJcbiAgICBsZXQgaWRzID0gYXdhaXQgY3VycmVudEl0ZXJhdG9yKCk7XHJcbiAgICB3aGlsZSAoaWRzLmRvbmUgPT09IGZhbHNlKSB7XHJcbiAgICAgIGZvciAoY29uc3QgaWQgb2YgaWRzLnJlc3VsdC5pZHMpIHtcclxuICAgICAgICBhbGxJdGVyYXRvcnMucHVzaChcclxuICAgICAgICAgIGF3YWl0IHRyYXZlcnNlRm9ySXRlcmF0ZXJhdG9ycyhcclxuICAgICAgICAgICAgam9pbktleShjdXJyZW50Q29sbGVjdGlvbktleSwgaWQpLFxyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZUluZGV4ICsgMSxcclxuICAgICAgICAgICksXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWRzID0gYXdhaXQgY3VycmVudEl0ZXJhdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZsYXR0ZW4oYWxsSXRlcmF0b3JzKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBpdGVyYXRvcnNBcnJheSA9IGF3YWl0IHRyYXZlcnNlRm9ySXRlcmF0ZXJhdG9ycygpO1xyXG4gIGxldCBjdXJyZW50SXRlcmF0b3JJbmRleCA9IDA7XHJcbiAgcmV0dXJuIGFzeW5jICgpID0+IHtcclxuICAgIGlmIChpdGVyYXRvcnNBcnJheS5sZW5ndGggPT09IDApIHsgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgcmVzdWx0OiBbXSB9OyB9XHJcbiAgICBjb25zdCBpbm5lclJlc3VsdCA9IGF3YWl0IGl0ZXJhdG9yc0FycmF5W2N1cnJlbnRJdGVyYXRvckluZGV4XSgpO1xyXG4gICAgaWYgKCFpbm5lclJlc3VsdC5kb25lKSB7IHJldHVybiBpbm5lclJlc3VsdDsgfVxyXG4gICAgaWYgKGN1cnJlbnRJdGVyYXRvckluZGV4ID09IGl0ZXJhdG9yc0FycmF5Lmxlbmd0aCAtIDEpIHtcclxuICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgcmVzdWx0OiBpbm5lclJlc3VsdC5yZXN1bHQgfTtcclxuICAgIH1cclxuICAgIGN1cnJlbnRJdGVyYXRvckluZGV4Kys7XHJcbiAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgcmVzdWx0OiBpbm5lclJlc3VsdC5yZXN1bHQgfTtcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3QgZ2V0QWxsSWRzRnJvbVNoYXJkID0gYXN5bmMgKGRhdGFzdG9yZSwgc2hhcmRLZXkpID0+IHtcclxuICBjb25zdCBhbGxJZHNTdHIgPSBhd2FpdCBnZXRTaGFyZEZpbGUoZGF0YXN0b3JlLCBzaGFyZEtleSk7XHJcblxyXG4gIGNvbnN0IGFsbElkcyA9IFtdO1xyXG4gIGxldCBjdXJyZW50SWQgPSAnJztcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbElkc1N0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgY3VycmVudENoYXIgPSBhbGxJZHNTdHIuY2hhckF0KGkpO1xyXG4gICAgY29uc3QgaXNMYXN0ID0gKGkgPT09IGFsbElkc1N0ci5sZW5ndGggLSAxKTtcclxuICAgIGlmIChjdXJyZW50Q2hhciA9PT0gJywnIHx8IGlzTGFzdCkge1xyXG4gICAgICBpZiAoaXNMYXN0KSBjdXJyZW50SWQgKz0gY3VycmVudENoYXI7XHJcbiAgICAgIGFsbElkcy5wdXNoKGN1cnJlbnRJZCk7XHJcbiAgICAgIGN1cnJlbnRJZCA9ICcnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY3VycmVudElkICs9IGN1cnJlbnRDaGFyO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gYWxsSWRzO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlbW92ZUZyb21BbGxJZHMgPSAoYXBwSGllcmFyY2h5LCBkYXRhc3RvcmUpID0+IGFzeW5jIChyZWNvcmQpID0+IHtcclxuICBjb25zdCBzaGFyZEtleSA9IGdldEFsbElkc1NoYXJkS2V5KFxyXG4gICAgYXBwSGllcmFyY2h5LFxyXG4gICAgZ2V0UGFyZW50S2V5KHJlY29yZC5rZXkpLFxyXG4gICAgcmVjb3JkLmlkLFxyXG4gICk7XHJcbiAgY29uc3QgYWxsSWRzID0gYXdhaXQgZ2V0QWxsSWRzRnJvbVNoYXJkKGRhdGFzdG9yZSwgc2hhcmRLZXkpO1xyXG5cclxuICBjb25zdCBuZXdJZHMgPSAkKGFsbElkcywgW1xyXG4gICAgcHVsbChyZWNvcmQuaWQpLFxyXG4gICAgam9pbignLCcpLFxyXG4gIF0pO1xyXG5cclxuICBhd2FpdCBkYXRhc3RvcmUudXBkYXRlRmlsZShzaGFyZEtleSwgbmV3SWRzKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldEFsbElkc0l0ZXJhdG9yO1xyXG4iLCJpbXBvcnQge1xyXG4gIGpvaW5LZXksIGtleVNlcCwgZ2V0SGFzaENvZGUsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgZ2V0TGFzdFBhcnRJbktleSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcblxyXG5leHBvcnQgY29uc3QgVFJBTlNBQ1RJT05TX0ZPTERFUiA9IGAke2tleVNlcH0udHJhbnNhY3Rpb25zYDtcclxuZXhwb3J0IGNvbnN0IExPQ0tfRklMRU5BTUUgPSAnbG9jayc7XHJcbmV4cG9ydCBjb25zdCBMT0NLX0ZJTEVfS0VZID0gam9pbktleShcclxuICBUUkFOU0FDVElPTlNfRk9MREVSLCBMT0NLX0ZJTEVOQU1FLFxyXG4pO1xyXG5leHBvcnQgY29uc3QgaWRTZXAgPSAnJCc7XHJcblxyXG5jb25zdCBpc09mVHlwZSA9IHR5cCA9PiB0cmFucyA9PiB0cmFucy50cmFuc2FjdGlvblR5cGUgPT09IHR5cDtcclxuXHJcbmV4cG9ydCBjb25zdCBDUkVBVEVfUkVDT1JEX1RSQU5TQUNUSU9OID0gJ2NyZWF0ZSc7XHJcbmV4cG9ydCBjb25zdCBVUERBVEVfUkVDT1JEX1RSQU5TQUNUSU9OID0gJ3VwZGF0ZSc7XHJcbmV4cG9ydCBjb25zdCBERUxFVEVfUkVDT1JEX1RSQU5TQUNUSU9OID0gJ2RlbGV0ZSc7XHJcbmV4cG9ydCBjb25zdCBCVUlMRF9JTkRFWF9UUkFOU0FDVElPTiA9ICdidWlsZCc7XHJcblxyXG5leHBvcnQgY29uc3QgaXNVcGRhdGUgPSBpc09mVHlwZShVUERBVEVfUkVDT1JEX1RSQU5TQUNUSU9OKTtcclxuZXhwb3J0IGNvbnN0IGlzRGVsZXRlID0gaXNPZlR5cGUoREVMRVRFX1JFQ09SRF9UUkFOU0FDVElPTik7XHJcbmV4cG9ydCBjb25zdCBpc0NyZWF0ZSA9IGlzT2ZUeXBlKENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04pO1xyXG5leHBvcnQgY29uc3QgaXNCdWlsZEluZGV4ID0gaXNPZlR5cGUoQlVJTERfSU5ERVhfVFJBTlNBQ1RJT04pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGtleVRvRm9sZGVyTmFtZSA9IG5vZGVLZXkgPT4gZ2V0SGFzaENvZGUobm9kZUtleSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0VHJhbnNhY3Rpb25JZCA9IChyZWNvcmRJZCwgdHJhbnNhY3Rpb25UeXBlLCB1bmlxdWVJZCkgPT4gXHJcbiAgYCR7cmVjb3JkSWR9JHtpZFNlcH0ke3RyYW5zYWN0aW9uVHlwZX0ke2lkU2VwfSR7dW5pcXVlSWR9YDtcclxuXHJcbmV4cG9ydCBjb25zdCBidWlsZEluZGV4Rm9sZGVyID0gJy5CVUlMRC0nO1xyXG5leHBvcnQgY29uc3Qgbm9kZUtleUhhc2hGcm9tQnVpbGRGb2xkZXIgPSBmb2xkZXIgPT4gZm9sZGVyLnJlcGxhY2UoYnVpbGRJbmRleEZvbGRlciwgJycpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGlzQnVpbGRJbmRleEZvbGRlciA9IGtleSA9PiBnZXRMYXN0UGFydEluS2V5KGtleSkuc3RhcnRzV2l0aChidWlsZEluZGV4Rm9sZGVyKTtcclxuXHJcbmV4cG9ydCBjb25zdCBJbmRleE5vZGVLZXlGb2xkZXIgPSBpbmRleE5vZGVLZXkgPT4gam9pbktleShcclxuICBUUkFOU0FDVElPTlNfRk9MREVSLFxyXG4gIGJ1aWxkSW5kZXhGb2xkZXIgKyBrZXlUb0ZvbGRlck5hbWUoaW5kZXhOb2RlS2V5KSxcclxuKTtcclxuXHJcbmV4cG9ydCBjb25zdCBJbmRleE5vZGVLZXlCYXRjaEZvbGRlciA9IChpbmRleE5vZGVLZXksIGNvdW50KSA9PiBcclxuICBqb2luS2V5KEluZGV4Tm9kZUtleUZvbGRlcihpbmRleE5vZGVLZXkpLCBNYXRoLmZsb29yKGNvdW50IC8gQlVJTERJTkRFWF9CQVRDSF9DT1VOVCkudG9TdHJpbmcoKSk7XHJcblxyXG5leHBvcnQgY29uc3QgSW5kZXhTaGFyZEtleUZvbGRlciA9IChpbmRleE5vZGVLZXksIGluZGV4U2hhcmRLZXkpID0+IFxyXG4gIGpvaW5LZXkoSW5kZXhOb2RlS2V5Rm9sZGVyKGluZGV4Tm9kZUtleSksIGluZGV4U2hhcmRLZXkpO1xyXG5cclxuZXhwb3J0IGNvbnN0IEJVSUxESU5ERVhfQkFUQ0hfQ09VTlQgPSAxMDAwO1xyXG5leHBvcnQgY29uc3QgdGltZW91dE1pbGxpc2Vjb25kcyA9IDMwICogMTAwMDsgLy8gMzAgc2Vjc1xyXG5leHBvcnQgY29uc3QgbWF4TG9ja1JldHJpZXMgPSAxO1xyXG4iLCJpbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xyXG5pbXBvcnQgeyBqb2luS2V5IH0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgZ2V0TGFzdFBhcnRJbktleSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7XHJcbiAgSW5kZXhOb2RlS2V5Rm9sZGVyLCBCVUlMRElOREVYX0JBVENIX0NPVU5ULFxyXG4gIEluZGV4Tm9kZUtleUJhdGNoRm9sZGVyLCBUUkFOU0FDVElPTlNfRk9MREVSLCBnZXRUcmFuc2FjdGlvbklkLCBDUkVBVEVfUkVDT1JEX1RSQU5TQUNUSU9OLCBVUERBVEVfUkVDT1JEX1RSQU5TQUNUSU9OLFxyXG4gIERFTEVURV9SRUNPUkRfVFJBTlNBQ1RJT04sIEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OLFxyXG59IGZyb20gJy4vdHJhbnNhY3Rpb25zQ29tbW9uJztcclxuXHJcblxyXG5leHBvcnQgY29uc3QgdHJhbnNhY3Rpb25Gb3JDcmVhdGVSZWNvcmQgPSBhc3luYyAoYXBwLCByZWNvcmQpID0+IGF3YWl0IHRyYW5zYWN0aW9uKFxyXG4gIGFwcC5kYXRhc3RvcmUsIENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04sXHJcbiAgcmVjb3JkLmtleSwgeyByZWNvcmQgfSxcclxuICBnZXRUcmFuc2FjdGlvbktleV9SZWNvcmRzLFxyXG4pO1xyXG5cclxuZXhwb3J0IGNvbnN0IHRyYW5zYWN0aW9uRm9yVXBkYXRlUmVjb3JkID0gYXN5bmMgKGFwcCwgb2xkUmVjb3JkLCBuZXdSZWNvcmQpID0+IGF3YWl0IHRyYW5zYWN0aW9uKFxyXG4gIGFwcC5kYXRhc3RvcmUsIFVQREFURV9SRUNPUkRfVFJBTlNBQ1RJT04sXHJcbiAgbmV3UmVjb3JkLmtleSwgeyBvbGRSZWNvcmQsIHJlY29yZDogbmV3UmVjb3JkIH0sXHJcbiAgZ2V0VHJhbnNhY3Rpb25LZXlfUmVjb3JkcyxcclxuKTtcclxuXHJcbmV4cG9ydCBjb25zdCB0cmFuc2FjdGlvbkZvckRlbGV0ZVJlY29yZCA9IGFzeW5jIChhcHAsIHJlY29yZCkgPT4gYXdhaXQgdHJhbnNhY3Rpb24oXHJcbiAgYXBwLmRhdGFzdG9yZSwgREVMRVRFX1JFQ09SRF9UUkFOU0FDVElPTixcclxuICByZWNvcmQua2V5LCB7IHJlY29yZCB9LFxyXG4gIGdldFRyYW5zYWN0aW9uS2V5X1JlY29yZHMsXHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgdHJhbnNhY3Rpb25Gb3JCdWlsZEluZGV4ID0gYXN5bmMgKGFwcCwgaW5kZXhOb2RlS2V5LCByZWNvcmRLZXksIGNvdW50KSA9PiB7XHJcbiAgY29uc3QgdHJhbnNhY3Rpb25Gb2xkZXIgPSBJbmRleE5vZGVLZXlCYXRjaEZvbGRlcihpbmRleE5vZGVLZXksIGNvdW50KTtcclxuICBpZiAoY291bnQgJSBCVUlMRElOREVYX0JBVENIX0NPVU5UID09PSAwKSB7XHJcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcih0cmFuc2FjdGlvbkZvbGRlcik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYXdhaXQgdHJhbnNhY3Rpb24oXHJcbiAgICBhcHAuZGF0YXN0b3JlLCBCVUlMRF9JTkRFWF9UUkFOU0FDVElPTixcclxuICAgIHJlY29yZEtleSwgeyByZWNvcmRLZXkgfSxcclxuICAgIGlkID0+IGpvaW5LZXkodHJhbnNhY3Rpb25Gb2xkZXIsIGlkKSxcclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZUJ1aWxkSW5kZXhGb2xkZXIgPSBhc3luYyAoZGF0YXN0b3JlLCBpbmRleE5vZGVLZXkpID0+IGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoXHJcbiAgSW5kZXhOb2RlS2V5Rm9sZGVyKGluZGV4Tm9kZUtleSksXHJcbik7XHJcblxyXG5jb25zdCBnZXRUcmFuc2FjdGlvbktleV9SZWNvcmRzID0gaWQgPT4gam9pbktleShUUkFOU0FDVElPTlNfRk9MREVSLCBpZCk7XHJcblxyXG5jb25zdCB0cmFuc2FjdGlvbiA9IGFzeW5jIChkYXRhc3RvcmUsIHRyYW5zYWN0aW9uVHlwZSwgcmVjb3JkS2V5LCBkYXRhLCBnZXRUcmFuc2FjdGlvbktleSkgPT4ge1xyXG4gIGNvbnN0IHJlY29yZElkID0gZ2V0TGFzdFBhcnRJbktleShyZWNvcmRLZXkpO1xyXG4gIGNvbnN0IHVuaXF1ZUlkID0gZ2VuZXJhdGUoKTtcclxuICBjb25zdCBpZCA9IGdldFRyYW5zYWN0aW9uSWQoXHJcbiAgICByZWNvcmRJZCwgdHJhbnNhY3Rpb25UeXBlLCB1bmlxdWVJZCxcclxuICApO1xyXG5cclxuICBjb25zdCBrZXkgPSBnZXRUcmFuc2FjdGlvbktleShpZCk7XHJcblxyXG4gIGNvbnN0IHRyYW5zID0ge1xyXG4gICAgdHJhbnNhY3Rpb25UeXBlLFxyXG4gICAgcmVjb3JkS2V5LFxyXG4gICAgLi4uZGF0YSxcclxuICAgIGlkLFxyXG4gIH07XHJcblxyXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKFxyXG4gICAga2V5LCB0cmFucyxcclxuICApO1xyXG5cclxuICByZXR1cm4gdHJhbnM7XHJcbn07XHJcbiIsImltcG9ydCB7IGlzU2hhcmRlZEluZGV4IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHsgam9pbktleSB9IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IGdldFNoYXJkTWFwS2V5LCBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXksIGNyZWF0ZUluZGV4RmlsZSB9IGZyb20gJy4vc2hhcmRpbmcnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRpYWxpc2VJbmRleCA9IGFzeW5jIChkYXRhc3RvcmUsIHBhcmVudEtleSwgaW5kZXgpID0+IHtcclxuICBjb25zdCBpbmRleEtleSA9IGpvaW5LZXkocGFyZW50S2V5LCBpbmRleC5uYW1lKTtcclxuXHJcbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihpbmRleEtleSk7XHJcblxyXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleCkpIHtcclxuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGaWxlKFxyXG4gICAgICBnZXRTaGFyZE1hcEtleShpbmRleEtleSksXHJcbiAgICAgICdbXScsXHJcbiAgICApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBhd2FpdCBjcmVhdGVJbmRleEZpbGUoXHJcbiAgICAgIGRhdGFzdG9yZSxcclxuICAgICAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5KGluZGV4S2V5KSxcclxuICAgICAgaW5kZXgsXHJcbiAgICApO1xyXG4gIH1cclxufTtcclxuIiwiaW1wb3J0IHtcclxuICBjbG9uZURlZXAsXHJcbiAgZmxhdHRlbixcclxuICBtYXAsXHJcbiAgZmlsdGVyLFxyXG4gIGlzRXF1YWxcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBpbml0aWFsaXNlQ2hpbGRDb2xsZWN0aW9ucyB9IGZyb20gJy4uL2NvbGxlY3Rpb25BcGkvaW5pdGlhbGlzZSc7XHJcbmltcG9ydCB7IHZhbGlkYXRlIH0gZnJvbSAnLi92YWxpZGF0ZSc7XHJcbmltcG9ydCB7IF9sb2FkLCBnZXRSZWNvcmRGaWxlTmFtZSB9IGZyb20gJy4vbG9hZCc7XHJcbmltcG9ydCB7XHJcbiAgYXBpV3JhcHBlciwgZXZlbnRzLCAkLCBqb2luS2V5LFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7XHJcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxyXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXHJcbiAgaXNSZWNvcmQsXHJcbiAgZ2V0Tm9kZSxcclxuICBnZXRMYXN0UGFydEluS2V5LFxyXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUsXHJcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHsgbWFwUmVjb3JkIH0gZnJvbSAnLi4vaW5kZXhpbmcvZXZhbHVhdGUnO1xyXG5pbXBvcnQgeyBsaXN0SXRlbXMgfSBmcm9tICcuLi9pbmRleEFwaS9saXN0SXRlbXMnO1xyXG5pbXBvcnQgeyBhZGRUb0FsbElkcyB9IGZyb20gJy4uL2luZGV4aW5nL2FsbElkcyc7XHJcbmltcG9ydCB7XHJcbiAgdHJhbnNhY3Rpb25Gb3JDcmVhdGVSZWNvcmQsXHJcbiAgdHJhbnNhY3Rpb25Gb3JVcGRhdGVSZWNvcmQsXHJcbn0gZnJvbSAnLi4vdHJhbnNhY3Rpb25zL2NyZWF0ZSc7XHJcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcclxuaW1wb3J0IHsgaW5pdGlhbGlzZUluZGV4IH0gZnJvbSAnLi4vaW5kZXhpbmcvaW5pdGlhbGlzZUluZGV4JztcclxuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XHJcblxyXG5leHBvcnQgY29uc3Qgc2F2ZSA9IGFwcCA9PiBhc3luYyAocmVjb3JkLCBjb250ZXh0KSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMucmVjb3JkQXBpLnNhdmUsXHJcbiAgcmVjb3JkLmlzTmV3XHJcbiAgICA/IHBlcm1pc3Npb24uY3JlYXRlUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmQua2V5KVxyXG4gICAgOiBwZXJtaXNzaW9uLnVwZGF0ZVJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkLmtleSksIHsgcmVjb3JkIH0sXHJcbiAgX3NhdmUsIGFwcCwgcmVjb3JkLCBjb250ZXh0LCBmYWxzZSxcclxuKTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgX3NhdmUgPSBhc3luYyAoYXBwLCByZWNvcmQsIGNvbnRleHQsIHNraXBWYWxpZGF0aW9uID0gZmFsc2UpID0+IHtcclxuICBjb25zdCByZWNvcmRDbG9uZSA9IGNsb25lRGVlcChyZWNvcmQpO1xyXG4gIGlmICghc2tpcFZhbGlkYXRpb24pIHtcclxuICAgIGNvbnN0IHZhbGlkYXRpb25SZXN1bHQgPSBhd2FpdCB2YWxpZGF0ZShhcHApKHJlY29yZENsb25lLCBjb250ZXh0KTtcclxuICAgIGlmICghdmFsaWRhdGlvblJlc3VsdC5pc1ZhbGlkKSB7XHJcbiAgICAgIGF3YWl0IGFwcC5wdWJsaXNoKGV2ZW50cy5yZWNvcmRBcGkuc2F2ZS5vbkludmFsaWQsIHsgcmVjb3JkLCB2YWxpZGF0aW9uUmVzdWx0IH0pO1xyXG4gICAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBTYXZlIDogUmVjb3JkIEludmFsaWQgOiAke1xyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHZhbGlkYXRpb25SZXN1bHQuZXJyb3JzKX1gKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChyZWNvcmRDbG9uZS5pc05ldykge1xyXG4gICAgYXdhaXQgYWRkVG9BbGxJZHMoYXBwLmhpZXJhcmNoeSwgYXBwLmRhdGFzdG9yZSkocmVjb3JkQ2xvbmUpO1xyXG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSBhd2FpdCB0cmFuc2FjdGlvbkZvckNyZWF0ZVJlY29yZChcclxuICAgICAgYXBwLCByZWNvcmRDbG9uZSxcclxuICAgICk7XHJcbiAgICByZWNvcmRDbG9uZS50cmFuc2FjdGlvbklkID0gdHJhbnNhY3Rpb24uaWQ7XHJcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihyZWNvcmRDbG9uZS5rZXkpO1xyXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoXHJcbiAgICAgIGpvaW5LZXkocmVjb3JkQ2xvbmUua2V5LCAnZmlsZXMnKSxcclxuICAgICk7XHJcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmNyZWF0ZUpzb24oXHJcbiAgICAgIGdldFJlY29yZEZpbGVOYW1lKHJlY29yZENsb25lLmtleSksXHJcbiAgICAgIHJlY29yZENsb25lLFxyXG4gICAgKTtcclxuICAgIGF3YWl0IGluaXRpYWxpc2VSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyhhcHAsIHJlY29yZCk7XHJcbiAgICBhd2FpdCBpbml0aWFsaXNlQW5jZXN0b3JJbmRleGVzKGFwcCwgcmVjb3JkKTtcclxuICAgIGF3YWl0IGluaXRpYWxpc2VDaGlsZENvbGxlY3Rpb25zKGFwcCwgcmVjb3JkQ2xvbmUua2V5KTtcclxuICAgIGF3YWl0IGFwcC5wdWJsaXNoKGV2ZW50cy5yZWNvcmRBcGkuc2F2ZS5vblJlY29yZENyZWF0ZWQsIHtcclxuICAgICAgcmVjb3JkOiByZWNvcmRDbG9uZSxcclxuICAgIH0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zdCBvbGRSZWNvcmQgPSBhd2FpdCBfbG9hZChhcHAsIHJlY29yZENsb25lLmtleSk7XHJcbiAgICBjb25zdCB0cmFuc2FjdGlvbiA9IGF3YWl0IHRyYW5zYWN0aW9uRm9yVXBkYXRlUmVjb3JkKFxyXG4gICAgICBhcHAsIG9sZFJlY29yZCwgcmVjb3JkQ2xvbmUsXHJcbiAgICApO1xyXG4gICAgcmVjb3JkQ2xvbmUudHJhbnNhY3Rpb25JZCA9IHRyYW5zYWN0aW9uLmlkO1xyXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFxyXG4gICAgICBnZXRSZWNvcmRGaWxlTmFtZShyZWNvcmRDbG9uZS5rZXkpLFxyXG4gICAgICByZWNvcmRDbG9uZSxcclxuICAgICk7XHJcbiAgICBhd2FpdCBhcHAucHVibGlzaChldmVudHMucmVjb3JkQXBpLnNhdmUub25SZWNvcmRVcGRhdGVkLCB7XHJcbiAgICAgIG9sZDogb2xkUmVjb3JkLFxyXG4gICAgICBuZXc6IHJlY29yZENsb25lLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhd2FpdCBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucygpO1xyXG5cclxuICBjb25zdCByZXR1cm5lZENsb25lID0gY2xvbmVEZWVwKHJlY29yZENsb25lKTtcclxuICByZXR1cm5lZENsb25lLmlzTmV3ID0gZmFsc2U7XHJcbiAgcmV0dXJuIHJldHVybmVkQ2xvbmU7XHJcbn07XHJcblxyXG5jb25zdCBpbml0aWFsaXNlQW5jZXN0b3JJbmRleGVzID0gYXN5bmMgKGFwcCwgcmVjb3JkKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkocmVjb3JkLmtleSk7XHJcblxyXG4gIGZvciAoY29uc3QgaW5kZXggb2YgcmVjb3JkTm9kZS5pbmRleGVzKSB7XHJcbiAgICBjb25zdCBpbmRleEtleSA9IGpvaW5LZXkocmVjb3JkLmtleSwgaW5kZXgubmFtZSk7XHJcbiAgICBpZiAoIWF3YWl0IGFwcC5kYXRhc3RvcmUuZXhpc3RzKGluZGV4S2V5KSkgeyBhd2FpdCBpbml0aWFsaXNlSW5kZXgoYXBwLmRhdGFzdG9yZSwgcmVjb3JkLmtleSwgaW5kZXgpOyB9XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgaW5pdGlhbGlzZVJldmVyc2VSZWZlcmVuY2VJbmRleGVzID0gYXN5bmMgKGFwcCwgcmVjb3JkKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkocmVjb3JkLmtleSk7XHJcblxyXG4gIGNvbnN0IGluZGV4Tm9kZXMgPSAkKGZpZWxkc1RoYXRSZWZlcmVuY2VUaGlzUmVjb3JkKGFwcCwgcmVjb3JkTm9kZSksIFtcclxuICAgIG1hcChmID0+ICQoZi50eXBlT3B0aW9ucy5yZXZlcnNlSW5kZXhOb2RlS2V5cywgW1xyXG4gICAgICBtYXAobiA9PiBnZXROb2RlKFxyXG4gICAgICAgIGFwcC5oaWVyYXJjaHksXHJcbiAgICAgICAgbixcclxuICAgICAgKSksXHJcbiAgICBdKSksXHJcbiAgICBmbGF0dGVuLFxyXG4gIF0pO1xyXG5cclxuICBmb3IgKGNvbnN0IGluZGV4Tm9kZSBvZiBpbmRleE5vZGVzKSB7XHJcbiAgICBhd2FpdCBpbml0aWFsaXNlSW5kZXgoXHJcbiAgICAgIGFwcC5kYXRhc3RvcmUsIHJlY29yZC5rZXksIGluZGV4Tm9kZSxcclxuICAgICk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgZmllbGRzVGhhdFJlZmVyZW5jZVRoaXNSZWNvcmQgPSAoYXBwLCByZWNvcmROb2RlKSA9PiAkKGFwcC5oaWVyYXJjaHksIFtcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbiAgZmlsdGVyKGlzUmVjb3JkKSxcclxuICBtYXAobiA9PiBuLmZpZWxkcyksXHJcbiAgZmxhdHRlbixcclxuICBmaWx0ZXIoZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvTm9kZShyZWNvcmROb2RlKSksXHJcbl0pO1xyXG4iLCJpbXBvcnQgeyBpbmNsdWRlcyB9IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7XHJcbiAgc2FmZUtleSwgYXBpV3JhcHBlcixcclxuICBldmVudHMsIGpvaW5LZXksXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgX2RlbGV0ZVJlY29yZCB9IGZyb20gJy4uL3JlY29yZEFwaS9kZWxldGUnO1xyXG5pbXBvcnQgeyBnZXRBbGxJZHNJdGVyYXRvciwgZ2V0QWxsSWRzU2hhcmRLZXkgfSBmcm9tICcuLi9pbmRleGluZy9hbGxJZHMnO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XHJcblxyXG5leHBvcnQgY29uc3QgZGVsZXRlQ29sbGVjdGlvbiA9IChhcHAsIGRpc2FibGVDbGVhbnVwID0gZmFsc2UpID0+IGFzeW5jIGtleSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMuY29sbGVjdGlvbkFwaS5kZWxldGUsXHJcbiAgcGVybWlzc2lvbi5tYW5hZ2VDb2xsZWN0aW9uLmlzQXV0aG9yaXplZCxcclxuICB7IGtleSB9LFxyXG4gIF9kZWxldGVDb2xsZWN0aW9uLCBhcHAsIGtleSwgZGlzYWJsZUNsZWFudXAsXHJcbik7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IF9kZWxldGVDb2xsZWN0aW9uID0gYXN5bmMgKGFwcCwga2V5LCBkaXNhYmxlQ2xlYW51cCkgPT4ge1xyXG4gIGtleSA9IHNhZmVLZXkoa2V5KTtcclxuICBjb25zdCBub2RlID0gZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoKGFwcC5oaWVyYXJjaHkpKGtleSk7XHJcblxyXG4gIGF3YWl0IGRlbGV0ZVJlY29yZHMoYXBwLCBrZXkpO1xyXG4gIGF3YWl0IGRlbGV0ZUFsbElkc0ZvbGRlcnMoYXBwLCBub2RlLCBrZXkpO1xyXG4gIGF3YWl0IGRlbGV0ZUNvbGxlY3Rpb25Gb2xkZXIoYXBwLCBrZXkpO1xyXG4gIGlmICghZGlzYWJsZUNsZWFudXApIHsgYXdhaXQgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMoKTsgfVxyXG59O1xyXG5cclxuY29uc3QgZGVsZXRlQ29sbGVjdGlvbkZvbGRlciA9IGFzeW5jIChhcHAsIGtleSkgPT4gYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoa2V5KTtcclxuXHJcblxyXG5jb25zdCBkZWxldGVBbGxJZHNGb2xkZXJzID0gYXN5bmMgKGFwcCwgbm9kZSwga2V5KSA9PiB7XHJcbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoXHJcbiAgICBqb2luS2V5KFxyXG4gICAgICBrZXksICdhbGxpZHMnLFxyXG4gICAgICBub2RlLm5vZGVJZCxcclxuICAgICksXHJcbiAgKTtcclxuXHJcbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoXHJcbiAgICBqb2luS2V5KGtleSwgJ2FsbGlkcycpLFxyXG4gICk7XHJcbn07XHJcblxyXG5jb25zdCBkZWxldGVSZWNvcmRzID0gYXN5bmMgKGFwcCwga2V5KSA9PiB7XHJcbiAgY29uc3QgZGVsZXRlZEFsbElkc1NoYXJkcyA9IFtdO1xyXG4gIGNvbnN0IGRlbGV0ZUFsbElkc1NoYXJkID0gYXN5bmMgKHJlY29yZElkKSA9PiB7XHJcbiAgICBjb25zdCBzaGFyZEtleSA9IGdldEFsbElkc1NoYXJkS2V5KFxyXG4gICAgICBhcHAuaGllcmFyY2h5LCBrZXksIHJlY29yZElkLFxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAoaW5jbHVkZXMoc2hhcmRLZXkpKGRlbGV0ZWRBbGxJZHNTaGFyZHMpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVkQWxsSWRzU2hhcmRzLnB1c2goc2hhcmRLZXkpO1xyXG5cclxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShzaGFyZEtleSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaXRlcmF0ZSA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yKGFwcCkoa2V5KTtcclxuXHJcbiAgbGV0IGlkcyA9IGF3YWl0IGl0ZXJhdGUoKTtcclxuICB3aGlsZSAoIWlkcy5kb25lKSB7XHJcbiAgICBpZiAoaWRzLnJlc3VsdC5jb2xsZWN0aW9uS2V5ID09PSBrZXkpIHtcclxuICAgICAgZm9yIChjb25zdCBpZCBvZiBpZHMucmVzdWx0Lmlkcykge1xyXG4gICAgICAgIGF3YWl0IF9kZWxldGVSZWNvcmQoXHJcbiAgICAgICAgICBhcHAsXHJcbiAgICAgICAgICBqb2luS2V5KGtleSwgaWQpLFxyXG4gICAgICAgICAgdHJ1ZSxcclxuICAgICAgICApO1xyXG4gICAgICAgIGF3YWl0IGRlbGV0ZUFsbElkc1NoYXJkKGlkKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlkcyA9IGF3YWl0IGl0ZXJhdGUoKTtcclxuICB9XHJcbn07XHJcbiIsImltcG9ydCB7XHJcbiAgdHJ5QXdhaXRPcklnbm9yZSxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQge1xyXG4gIGlzSW5kZXgsIGlzU2hhcmRlZEluZGV4LFxyXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXHJcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHtcclxuICBnZXRBbGxTaGFyZEtleXMsIGdldFNoYXJkTWFwS2V5LFxyXG4gIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSxcclxufSBmcm9tICcuLi9pbmRleGluZy9zaGFyZGluZyc7XHJcblxyXG5leHBvcnQgY29uc3QgX2RlbGV0ZUluZGV4ID0gYXN5bmMgKGFwcCwgaW5kZXhLZXksIGluY2x1ZGVGb2xkZXIpID0+IHtcclxuICBjb25zdCBpbmRleE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKGluZGV4S2V5KTtcclxuXHJcbiAgaWYgKCFpc0luZGV4KGluZGV4Tm9kZSkpIHsgdGhyb3cgbmV3IEVycm9yKCdTdXBwbGllZCBrZXkgaXMgbm90IGFuIGluZGV4Jyk7IH1cclxuXHJcbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4Tm9kZSkpIHtcclxuICAgIGNvbnN0IHNoYXJkS2V5cyA9IGF3YWl0IGdldEFsbFNoYXJkS2V5cyhhcHAsIGluZGV4S2V5KTtcclxuICAgIGZvciAoY29uc3QgayBvZiBzaGFyZEtleXMpIHtcclxuICAgICAgYXdhaXQgdHJ5QXdhaXRPcklnbm9yZShcclxuICAgICAgICBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoayksXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICB0cnlBd2FpdE9ySWdub3JlKFxyXG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoXHJcbiAgICAgICAgZ2V0U2hhcmRNYXBLZXkoaW5kZXhLZXkpLFxyXG4gICAgICApLFxyXG4gICAgKTtcclxuICB9IGVsc2Uge1xyXG4gICAgYXdhaXQgdHJ5QXdhaXRPcklnbm9yZShcclxuICAgICAgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKFxyXG4gICAgICAgIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleShpbmRleEtleSksXHJcbiAgICAgICksXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgaWYgKGluY2x1ZGVGb2xkZXIpIHtcclxuICAgIHRyeUF3YWl0T3JJZ25vcmUoXHJcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKGluZGV4S2V5KSxcclxuICAgICk7XHJcbiAgfVxyXG59O1xyXG4iLCJpbXBvcnQge1xyXG4gIHNhZmVLZXksIGFwaVdyYXBwZXIsXHJcbiAgZXZlbnRzLCBqb2luS2V5LFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IF9sb2FkLCBnZXRSZWNvcmRGaWxlTmFtZSB9IGZyb20gJy4vbG9hZCc7XHJcbmltcG9ydCB7IF9kZWxldGVDb2xsZWN0aW9uIH0gZnJvbSAnLi4vY29sbGVjdGlvbkFwaS9kZWxldGUnO1xyXG5pbXBvcnQge1xyXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXHJcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LCBnZXROb2RlLFxyXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUsXHJcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHsgX2RlbGV0ZUluZGV4IH0gZnJvbSAnLi4vaW5kZXhBcGkvZGVsZXRlJztcclxuaW1wb3J0IHsgdHJhbnNhY3Rpb25Gb3JEZWxldGVSZWNvcmQgfSBmcm9tICcuLi90cmFuc2FjdGlvbnMvY3JlYXRlJztcclxuaW1wb3J0IHsgcmVtb3ZlRnJvbUFsbElkcyB9IGZyb20gJy4uL2luZGV4aW5nL2FsbElkcyc7XHJcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcclxuXHJcbmV4cG9ydCBjb25zdCBkZWxldGVSZWNvcmQgPSAoYXBwLCBkaXNhYmxlQ2xlYW51cCA9IGZhbHNlKSA9PiBhc3luYyBrZXkgPT4gYXBpV3JhcHBlcihcclxuICBhcHAsXHJcbiAgZXZlbnRzLnJlY29yZEFwaS5kZWxldGUsXHJcbiAgcGVybWlzc2lvbi5kZWxldGVSZWNvcmQuaXNBdXRob3JpemVkKGtleSksXHJcbiAgeyBrZXkgfSxcclxuICBfZGVsZXRlUmVjb3JkLCBhcHAsIGtleSwgZGlzYWJsZUNsZWFudXAsXHJcbik7XHJcblxyXG4vLyBjYWxsZWQgZGVsZXRlUmVjb3JkIGJlY2F1c2UgZGVsZXRlIGlzIGEga2V5d29yZFxyXG5leHBvcnQgY29uc3QgX2RlbGV0ZVJlY29yZCA9IGFzeW5jIChhcHAsIGtleSwgZGlzYWJsZUNsZWFudXApID0+IHtcclxuICBrZXkgPSBzYWZlS2V5KGtleSk7XHJcbiAgY29uc3Qgbm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoa2V5KTtcclxuXHJcbiAgY29uc3QgcmVjb3JkID0gYXdhaXQgX2xvYWQoYXBwLCBrZXkpO1xyXG4gIGF3YWl0IHRyYW5zYWN0aW9uRm9yRGVsZXRlUmVjb3JkKGFwcCwgcmVjb3JkKTtcclxuXHJcbiAgZm9yIChjb25zdCBjb2xsZWN0aW9uUmVjb3JkIG9mIG5vZGUuY2hpbGRyZW4pIHtcclxuICAgIGNvbnN0IGNvbGxlY3Rpb25LZXkgPSBqb2luS2V5KFxyXG4gICAgICBrZXksIGNvbGxlY3Rpb25SZWNvcmQuY29sbGVjdGlvbk5hbWUsXHJcbiAgICApO1xyXG4gICAgYXdhaXQgX2RlbGV0ZUNvbGxlY3Rpb24oYXBwLCBjb2xsZWN0aW9uS2V5LCB0cnVlKTtcclxuICB9XHJcblxyXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShcclxuICAgIGdldFJlY29yZEZpbGVOYW1lKGtleSksXHJcbiAgKTtcclxuXHJcbiAgYXdhaXQgZGVsZXRlRmlsZXMoYXBwLCBrZXkpO1xyXG5cclxuICBhd2FpdCByZW1vdmVGcm9tQWxsSWRzKGFwcC5oaWVyYXJjaHksIGFwcC5kYXRhc3RvcmUpKHJlY29yZCk7XHJcblxyXG4gIGlmICghZGlzYWJsZUNsZWFudXApIHsgYXdhaXQgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMoKTsgfVxyXG5cclxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihrZXkpO1xyXG4gIGF3YWl0IGRlbGV0ZUluZGV4ZXMoYXBwLCBrZXkpO1xyXG59O1xyXG5cclxuY29uc3QgZGVsZXRlSW5kZXhlcyA9IGFzeW5jIChhcHAsIGtleSkgPT4ge1xyXG4gIGNvbnN0IG5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKGtleSk7XHJcbiAgLyogY29uc3QgcmV2ZXJzZUluZGV4S2V5cyA9ICQoYXBwLmhpZXJhcmNoeSwgW1xyXG4gICAgICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcclxuICAgICAgICBtYXAobiA9PiBuLmZpZWxkcyksXHJcbiAgICAgICAgZmxhdHRlbixcclxuICAgICAgICBmaWx0ZXIoaXNTb21ldGhpbmcpLFxyXG4gICAgICAgIGZpbHRlcihmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlKG5vZGUpKSxcclxuICAgICAgICBtYXAoZiA9PiAkKGYudHlwZU9wdGlvbnMucmV2ZXJzZUluZGV4Tm9kZUtleXMsIFtcclxuICAgICAgICAgICAgICAgICAgICBtYXAobiA9PiBnZXROb2RlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5oaWVyYXJjaHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbikpXHJcbiAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICksXHJcbiAgICAgICAgZmxhdHRlbixcclxuICAgICAgICBtYXAobiA9PiBqb2luS2V5KGtleSwgbi5uYW1lKSlcclxuICAgIF0pO1xyXG5cclxuICAgIGZvcihsZXQgaSBvZiByZXZlcnNlSW5kZXhLZXlzKSB7XHJcbiAgICAgICAgYXdhaXQgX2RlbGV0ZUluZGV4KGFwcCwgaSwgdHJ1ZSk7XHJcbiAgICB9ICovXHJcblxyXG5cclxuICBmb3IgKGNvbnN0IGluZGV4IG9mIG5vZGUuaW5kZXhlcykge1xyXG4gICAgY29uc3QgaW5kZXhLZXkgPSBqb2luS2V5KGtleSwgaW5kZXgubmFtZSk7XHJcbiAgICBhd2FpdCBfZGVsZXRlSW5kZXgoYXBwLCBpbmRleEtleSwgdHJ1ZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgZGVsZXRlRmlsZXMgPSBhc3luYyAoYXBwLCBrZXkpID0+IHtcclxuICBjb25zdCBmaWxlc0ZvbGRlciA9IGpvaW5LZXkoa2V5LCAnZmlsZXMnKTtcclxuICBjb25zdCBhbGxGaWxlcyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0Rm9sZGVyQ29udGVudHMoXHJcbiAgICBmaWxlc0ZvbGRlcixcclxuICApO1xyXG5cclxuICBmb3IgKGNvbnN0IGZpbGUgb2YgYWxsRmlsZXMpIHtcclxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShmaWxlKTtcclxuICB9XHJcblxyXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKFxyXG4gICAgam9pbktleShrZXksICdmaWxlcycpLFxyXG4gICk7XHJcbn07XHJcbiIsImltcG9ydCB7XHJcbiAgaW5jbHVkZXMsIGZpbHRlcixcclxuICBtYXAsIHNvbWUsXHJcbn0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcclxuaW1wb3J0IHsgX2xvYWQgfSBmcm9tICcuL2xvYWQnO1xyXG5pbXBvcnQge1xyXG4gIGFwaVdyYXBwZXIsIGV2ZW50cywgc3BsaXRLZXksXHJcbiAgJCwgam9pbktleSwgaXNOb3RoaW5nLCB0cnlBd2FpdE9ySWdub3JlLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IGdldEV4YWN0Tm9kZUZvclBhdGggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XHJcbmltcG9ydCB7IGlzTGVnYWxGaWxlbmFtZSB9IGZyb20gJy4uL3R5cGVzL2ZpbGUnO1xyXG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IsIEZvcmJpZGRlbkVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XHJcblxyXG5leHBvcnQgY29uc3QgdXBsb2FkRmlsZSA9IGFwcCA9PiBhc3luYyAocmVjb3JkS2V5LCByZWFkYWJsZVN0cmVhbSwgcmVsYXRpdmVGaWxlUGF0aCkgPT4gYXBpV3JhcHBlcihcclxuICBhcHAsXHJcbiAgZXZlbnRzLnJlY29yZEFwaS51cGxvYWRGaWxlLFxyXG4gIHBlcm1pc3Npb24udXBkYXRlUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmRLZXkpLFxyXG4gIHsgcmVjb3JkS2V5LCByZWFkYWJsZVN0cmVhbSwgcmVsYXRpdmVGaWxlUGF0aCB9LFxyXG4gIF91cGxvYWRGaWxlLCBhcHAsIHJlY29yZEtleSwgcmVhZGFibGVTdHJlYW0sIHJlbGF0aXZlRmlsZVBhdGgsXHJcbik7XHJcblxyXG5jb25zdCBfdXBsb2FkRmlsZSA9IGFzeW5jIChhcHAsIHJlY29yZEtleSwgcmVhZGFibGVTdHJlYW0sIHJlbGF0aXZlRmlsZVBhdGgpID0+IHtcclxuICBpZiAoaXNOb3RoaW5nKHJlY29yZEtleSkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignUmVjb3JkIEtleSBub3Qgc3VwcGxpZWQnKTsgfVxyXG4gIGlmIChpc05vdGhpbmcocmVsYXRpdmVGaWxlUGF0aCkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignZmlsZSBwYXRoIG5vdCBzdXBwbGllZCcpOyB9XHJcbiAgaWYgKCFpc0xlZ2FsRmlsZW5hbWUocmVsYXRpdmVGaWxlUGF0aCkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignSWxsZWdhbCBmaWxlbmFtZScpOyB9XHJcblxyXG4gIGNvbnN0IHJlY29yZCA9IGF3YWl0IF9sb2FkKGFwcCwgcmVjb3JkS2V5KTtcclxuXHJcbiAgY29uc3QgZnVsbEZpbGVQYXRoID0gc2FmZUdldEZ1bGxGaWxlUGF0aChcclxuICAgIHJlY29yZEtleSwgcmVsYXRpdmVGaWxlUGF0aCxcclxuICApO1xyXG5cclxuICBjb25zdCB0ZW1wRmlsZVBhdGggPSBgJHtmdWxsRmlsZVBhdGh9XyR7Z2VuZXJhdGUoKX0udGVtcGA7XHJcblxyXG4gIGNvbnN0IG91dHB1dFN0cmVhbSA9IGF3YWl0IGFwcC5kYXRhc3RvcmUud3JpdGFibGVGaWxlU3RyZWFtKFxyXG4gICAgdGVtcEZpbGVQYXRoLFxyXG4gICk7XHJcblxyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSxyZWplY3QpID0+IHtcclxuICAgIHJlYWRhYmxlU3RyZWFtLnBpcGUob3V0cHV0U3RyZWFtKTtcclxuICAgIG91dHB1dFN0cmVhbS5vbignZXJyb3InLCByZWplY3QpO1xyXG4gICAgb3V0cHV0U3RyZWFtLm9uKCdmaW5pc2gnLCByZXNvbHZlKTtcclxuICB9KVxyXG4gIC50aGVuKCgpID0+IGFwcC5kYXRhc3RvcmUuZ2V0RmlsZVNpemUodGVtcEZpbGVQYXRoKSlcclxuICAudGhlbihzaXplID0+IHtcclxuICAgIGNvbnN0IGlzRXhwZWN0ZWRGaWxlU2l6ZSA9IGNoZWNrRmlsZVNpemVBZ2FpbnN0RmllbGRzKFxyXG4gICAgICBhcHAsIHJlY29yZCwgcmVsYXRpdmVGaWxlUGF0aCwgc2l6ZVxyXG4gICAgKTsgIFxyXG4gICAgaWYgKCFpc0V4cGVjdGVkRmlsZVNpemUpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgRmllbGRzIGZvciAke3JlbGF0aXZlRmlsZVBhdGh9IGRvIG5vdCBoYXZlIGV4cGVjdGVkIHNpemU6ICR7am9pbignLCcpKGluY29ycmVjdEZpZWxkcyl9YCk7IH0gIFxyXG5cclxuICB9KVxyXG4gIC50aGVuKCgpID0+IHRyeUF3YWl0T3JJZ25vcmUoYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlLCBmdWxsRmlsZVBhdGgpKVxyXG4gIC50aGVuKCgpID0+IGFwcC5kYXRhc3RvcmUucmVuYW1lRmlsZSh0ZW1wRmlsZVBhdGgsIGZ1bGxGaWxlUGF0aCkpO1xyXG5cclxuICAvKlxyXG4gIHJlYWRhYmxlU3RyZWFtLnBpcGUob3V0cHV0U3RyZWFtKTtcclxuXHJcbiAgYXdhaXQgbmV3IFByb21pc2UoZnVsZmlsbCA9PiBvdXRwdXRTdHJlYW0ub24oJ2ZpbmlzaCcsIGZ1bGZpbGwpKTtcclxuXHJcbiAgY29uc3QgaXNFeHBlY3RlZEZpbGVTaXplID0gY2hlY2tGaWxlU2l6ZUFnYWluc3RGaWVsZHMoXHJcbiAgICBhcHAsXHJcbiAgICByZWNvcmQsIHJlbGF0aXZlRmlsZVBhdGgsXHJcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZpbGVTaXplKHRlbXBGaWxlUGF0aCksXHJcbiAgKTtcclxuXHJcbiAgaWYgKCFpc0V4cGVjdGVkRmlsZVNpemUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgYEZpZWxkcyBmb3IgJHtyZWxhdGl2ZUZpbGVQYXRofSBkbyBub3QgaGF2ZSBleHBlY3RlZCBzaXplYCk7XHJcbiAgfVxyXG5cclxuICBhd2FpdCB0cnlBd2FpdE9ySWdub3JlKGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZSwgZnVsbEZpbGVQYXRoKTtcclxuXHJcbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS5yZW5hbWVGaWxlKHRlbXBGaWxlUGF0aCwgZnVsbEZpbGVQYXRoKTtcclxuICAqL1xyXG59O1xyXG5cclxuY29uc3QgY2hlY2tGaWxlU2l6ZUFnYWluc3RGaWVsZHMgPSAoYXBwLCByZWNvcmQsIHJlbGF0aXZlRmlsZVBhdGgsIGV4cGVjdGVkU2l6ZSkgPT4ge1xyXG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKHJlY29yZC5rZXkpO1xyXG5cclxuICBjb25zdCBpbmNvcnJlY3RGaWxlRmllbGRzID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xyXG4gICAgZmlsdGVyKGYgPT4gZi50eXBlID09PSAnZmlsZSdcclxuICAgICAgJiYgcmVjb3JkW2YubmFtZV0ucmVsYXRpdmVQYXRoID09PSByZWxhdGl2ZUZpbGVQYXRoXHJcbiAgICAgICYmIHJlY29yZFtmLm5hbWVdLnNpemUgIT09IGV4cGVjdGVkU2l6ZSksXHJcbiAgICBtYXAoZiA9PiBmLm5hbWUpLFxyXG4gIF0pO1xyXG5cclxuICBjb25zdCBpbmNvcnJlY3RGaWxlQXJyYXlGaWVsZHMgPSAkKHJlY29yZE5vZGUuZmllbGRzLCBbXHJcbiAgICBmaWx0ZXIoYSA9PiBhLnR5cGUgPT09ICdhcnJheTxmaWxlPidcclxuICAgICAgJiYgJChyZWNvcmRbYS5uYW1lXSwgW1xyXG4gICAgICAgIHNvbWUoZiA9PiByZWNvcmRbZi5uYW1lXS5yZWxhdGl2ZVBhdGggPT09IHJlbGF0aXZlRmlsZVBhdGhcclxuICAgICAgICAgICYmIHJlY29yZFtmLm5hbWVdLnNpemUgIT09IGV4cGVjdGVkU2l6ZSksXHJcbiAgICAgIF0pKSxcclxuICAgIG1hcChmID0+IGYubmFtZSksXHJcbiAgXSk7XHJcblxyXG4gIGNvbnN0IGluY29ycmVjdEZpZWxkcyA9IFtcclxuICAgIC4uLmluY29ycmVjdEZpbGVGaWVsZHMsXHJcbiAgICAuLi5pbmNvcnJlY3RGaWxlQXJyYXlGaWVsZHMsXHJcbiAgXTtcclxuXHJcbiAgaWYgKGluY29ycmVjdEZpZWxkcy5sZW5ndGggPiAwKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBzYWZlR2V0RnVsbEZpbGVQYXRoID0gKHJlY29yZEtleSwgcmVsYXRpdmVGaWxlUGF0aCkgPT4ge1xyXG4gIGNvbnN0IG5hdWdodHlVc2VyID0gKCkgPT4geyB0aHJvdyBuZXcgRm9yYmlkZGVuRXJyb3IoJ25hdWdodHkgbmF1Z2h0eScpOyB9O1xyXG5cclxuICBpZiAocmVsYXRpdmVGaWxlUGF0aC5zdGFydHNXaXRoKCcuLicpKSBuYXVnaHR5VXNlcigpO1xyXG5cclxuICBjb25zdCBwYXRoUGFydHMgPSBzcGxpdEtleShyZWxhdGl2ZUZpbGVQYXRoKTtcclxuXHJcbiAgaWYgKGluY2x1ZGVzKCcuLicpKHBhdGhQYXJ0cykpIG5hdWdodHlVc2VyKCk7XHJcblxyXG4gIGNvbnN0IHJlY29yZEtleVBhcnRzID0gc3BsaXRLZXkocmVjb3JkS2V5KTtcclxuXHJcbiAgY29uc3QgZnVsbFBhdGhQYXJ0cyA9IFtcclxuICAgIC4uLnJlY29yZEtleVBhcnRzLFxyXG4gICAgJ2ZpbGVzJyxcclxuICAgIC4uLmZpbHRlcihwID0+IHAgIT09ICcuJykocGF0aFBhcnRzKSxcclxuICBdO1xyXG5cclxuICByZXR1cm4gam9pbktleShmdWxsUGF0aFBhcnRzKTtcclxufTtcclxuIiwiaW1wb3J0IHsgYXBpV3JhcHBlciwgZXZlbnRzLCBpc05vdGhpbmcgfSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XHJcbmltcG9ydCB7IHNhZmVHZXRGdWxsRmlsZVBhdGggfSBmcm9tICcuL3VwbG9hZEZpbGUnO1xyXG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcclxuXHJcbmV4cG9ydCBjb25zdCBkb3dubG9hZEZpbGUgPSBhcHAgPT4gYXN5bmMgKHJlY29yZEtleSwgcmVsYXRpdmVQYXRoKSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMucmVjb3JkQXBpLnVwbG9hZEZpbGUsXHJcbiAgcGVybWlzc2lvbi5yZWFkUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmRLZXkpLFxyXG4gIHsgcmVjb3JkS2V5LCByZWxhdGl2ZVBhdGggfSwvL3JlbW92ZSBkdXBlIGtleSAncmVjb3JkS2V5JyBmcm9tIG9iamVjdFxyXG4gIF9kb3dubG9hZEZpbGUsIGFwcCwgcmVjb3JkS2V5LCByZWxhdGl2ZVBhdGgsXHJcbik7IFxyXG5cclxuXHJcbmNvbnN0IF9kb3dubG9hZEZpbGUgPSBhc3luYyAoYXBwLCByZWNvcmRLZXksIHJlbGF0aXZlUGF0aCkgPT4ge1xyXG4gIGlmIChpc05vdGhpbmcocmVjb3JkS2V5KSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdSZWNvcmQgS2V5IG5vdCBzdXBwbGllZCcpOyB9XHJcbiAgaWYgKGlzTm90aGluZyhyZWxhdGl2ZVBhdGgpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ2ZpbGUgcGF0aCBub3Qgc3VwcGxpZWQnKTsgfVxyXG5cclxuICByZXR1cm4gYXdhaXQgYXBwLmRhdGFzdG9yZS5yZWFkYWJsZUZpbGVTdHJlYW0oXHJcbiAgICBzYWZlR2V0RnVsbEZpbGVQYXRoKFxyXG4gICAgICByZWNvcmRLZXksIHJlbGF0aXZlUGF0aCxcclxuICAgICksXHJcbiAgKTtcclxufTtcclxuIiwiaW1wb3J0IHsgZmluZCwgdGFrZSwgdW5pb24gfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBnZXRGbGF0dGVuZWRIaWVyYXJjaHkgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyAkLCBzcGxpdEtleSwgam9pbktleSB9IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcclxuXHJcbmV4cG9ydCBjb25zdCBjdXN0b21JZCA9IGFwcCA9PiAobm9kZU5hbWUsIGlkKSA9PiB7XHJcbiAgY29uc3Qgbm9kZSA9ICQoYXBwLmhpZXJhcmNoeSwgW1xyXG4gICAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxyXG4gICAgZmluZChuID0+IG4ubmFtZSA9PT0gbm9kZU5hbWUpLFxyXG4gIF0pO1xyXG5cclxuICBpZiAoIW5vZGUpIHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGBDYW5ub3QgZmluZCBub2RlICR7bm9kZU5hbWV9YCk7XHJcblxyXG4gIHJldHVybiBgJHtub2RlLm5vZGVJZH0tJHtpZH1gO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHNldEN1c3RvbUlkID0gYXBwID0+IChyZWNvcmQsIGlkKSA9PiB7XHJcbiAgcmVjb3JkLmlkID0gY3VzdG9tSWQoYXBwKShyZWNvcmQudHlwZSwgaWQpO1xyXG5cclxuICBjb25zdCBrZXlQYXJ0cyA9IHNwbGl0S2V5KHJlY29yZC5rZXkpO1xyXG5cclxuICByZWNvcmQua2V5ID0gJChrZXlQYXJ0cywgW1xyXG4gICAgdGFrZShrZXlQYXJ0cy5sZW5ndGggLSAxKSxcclxuICAgIHVuaW9uKFtyZWNvcmQuaWRdKSxcclxuICAgIGpvaW5LZXksXHJcbiAgXSk7XHJcblxyXG4gIHJldHVybiByZWNvcmQ7XHJcbn07XHJcbiIsImltcG9ydCB7IGdldE5ldywgZ2V0TmV3Q2hpbGQgfSBmcm9tICcuL2dldE5ldyc7XHJcbmltcG9ydCB7IGxvYWQgfSBmcm9tICcuL2xvYWQnO1xyXG5pbXBvcnQgeyB2YWxpZGF0ZSB9IGZyb20gJy4vdmFsaWRhdGUnO1xyXG5pbXBvcnQgeyBnZXRDb250ZXh0IH0gZnJvbSAnLi9nZXRDb250ZXh0JztcclxuaW1wb3J0IHsgc2F2ZSB9IGZyb20gJy4vc2F2ZSc7XHJcbmltcG9ydCB7IGRlbGV0ZVJlY29yZCB9IGZyb20gJy4vZGVsZXRlJztcclxuaW1wb3J0IHsgdXBsb2FkRmlsZSB9IGZyb20gJy4vdXBsb2FkRmlsZSc7XHJcbmltcG9ydCB7IGRvd25sb2FkRmlsZSB9IGZyb20gJy4vZG93bmxvYWRGaWxlJztcclxuaW1wb3J0IHsgY3VzdG9tSWQsIHNldEN1c3RvbUlkIH0gZnJvbSAnLi9jdXN0b21JZCc7XHJcblxyXG5jb25zdCBhcGkgPSBhcHAgPT4gKHtcclxuICBnZXROZXc6IGdldE5ldyhhcHApLFxyXG4gIGdldE5ld0NoaWxkOiBnZXROZXdDaGlsZChhcHApLFxyXG4gIHNhdmU6IHNhdmUoYXBwKSxcclxuICBsb2FkOiBsb2FkKGFwcCksXHJcbiAgZGVsZXRlOiBkZWxldGVSZWNvcmQoYXBwLCBmYWxzZSksXHJcbiAgdmFsaWRhdGU6IHZhbGlkYXRlKGFwcCksXHJcbiAgZ2V0Q29udGV4dDogZ2V0Q29udGV4dChhcHApLFxyXG4gIHVwbG9hZEZpbGU6IHVwbG9hZEZpbGUoYXBwKSxcclxuICBkb3dubG9hZEZpbGU6IGRvd25sb2FkRmlsZShhcHApLFxyXG4gIGN1c3RvbUlkOiBjdXN0b21JZChhcHApLFxyXG4gIHNldEN1c3RvbUlkOiBzZXRDdXN0b21JZChhcHApLFxyXG59KTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkQXBpID0gYXBwID0+IGFwaShhcHApO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2V0UmVjb3JkQXBpO1xyXG4iLCJpbXBvcnQgeyBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQge1xyXG4gIGlzTm90aGluZywgc2FmZUtleSwgYXBpV3JhcHBlclN5bmMsIGV2ZW50cyxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0QWxsb3dlZFJlY29yZFR5cGVzID0gYXBwID0+IGtleSA9PiBhcGlXcmFwcGVyU3luYyhcclxuICBhcHAsXHJcbiAgZXZlbnRzLmNvbGxlY3Rpb25BcGkuZ2V0QWxsb3dlZFJlY29yZFR5cGVzLFxyXG4gIGFsd2F5c0F1dGhvcml6ZWQsXHJcbiAgeyBrZXkgfSxcclxuICBfZ2V0QWxsb3dlZFJlY29yZFR5cGVzLCBhcHAsIGtleSxcclxuKTtcclxuXHJcbmNvbnN0IF9nZXRBbGxvd2VkUmVjb3JkVHlwZXMgPSAoYXBwLCBrZXkpID0+IHtcclxuICBrZXkgPSBzYWZlS2V5KGtleSk7XHJcbiAgY29uc3Qgbm9kZSA9IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHAuaGllcmFyY2h5KShrZXkpO1xyXG4gIHJldHVybiBpc05vdGhpbmcobm9kZSkgPyBbXSA6IFtub2RlLm5hbWVdO1xyXG59O1xyXG4iLCJpbXBvcnQgeyBnZXRBbGxJZHNJdGVyYXRvciB9IGZyb20gJy4uL2luZGV4aW5nL2FsbElkcyc7XHJcbmltcG9ydCB7IGdldEFsbG93ZWRSZWNvcmRUeXBlcyB9IGZyb20gJy4vZ2V0QWxsb3dlZFJlY29yZFR5cGVzJztcclxuaW1wb3J0IHsgZGVsZXRlQ29sbGVjdGlvbiB9IGZyb20gJy4vZGVsZXRlJztcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRDb2xsZWN0aW9uQXBpID0gYXBwID0+ICh7XHJcbiAgZ2V0QWxsb3dlZFJlY29yZFR5cGVzOiBnZXRBbGxvd2VkUmVjb3JkVHlwZXMoYXBwKSxcclxuICBnZXRBbGxJZHNJdGVyYXRvcjogZ2V0QWxsSWRzSXRlcmF0b3IoYXBwKSxcclxuICBkZWxldGU6IGRlbGV0ZUNvbGxlY3Rpb24oYXBwKSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXRDb2xsZWN0aW9uQXBpO1xyXG4iLCJpbXBvcnQge1xyXG4gIGZpbmQsIGZpbHRlciwgXHJcbiAgaW5jbHVkZXMsIHNvbWUsXHJcbn0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgZ2V0QWxsSWRzSXRlcmF0b3IgfSBmcm9tICcuLi9pbmRleGluZy9hbGxJZHMnO1xyXG5pbXBvcnQge1xyXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSwgZ2V0UmVjb3JkTm9kZUJ5SWQsXHJcbiAgZ2V0Q29sbGVjdGlvbk5vZGVCeUtleU9yTm9kZUtleSwgZ2V0Tm9kZSwgaXNJbmRleCxcclxuICBpc1JlY29yZCwgaXNEZWNlbmRhbnQsIGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4LFxyXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4LFxyXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7XHJcbiAgam9pbktleSwgYXBpV3JhcHBlciwgZXZlbnRzLCAkLCBhbGxUcnVlLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7XHJcbiAgY3JlYXRlQnVpbGRJbmRleEZvbGRlcixcclxuICB0cmFuc2FjdGlvbkZvckJ1aWxkSW5kZXgsXHJcbn0gZnJvbSAnLi4vdHJhbnNhY3Rpb25zL2NyZWF0ZSc7XHJcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcclxuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XHJcblxyXG5cclxuLyoqIHJlYnVpbGRzIGFuIGluZGV4XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBhcHAgLSB0aGUgYXBwbGljYXRpb24gY29udGFpbmVyXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbmRleE5vZGVLZXkgLSBub2RlIGtleSBvZiB0aGUgaW5kZXgsIHdoaWNoIHRoZSBpbmRleCBiZWxvbmdzIHRvXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgYnVpbGRJbmRleCA9IGFwcCA9PiBhc3luYyBpbmRleE5vZGVLZXkgPT4gYXBpV3JhcHBlcihcclxuICBhcHAsXHJcbiAgZXZlbnRzLmluZGV4QXBpLmJ1aWxkSW5kZXgsXHJcbiAgcGVybWlzc2lvbi5tYW5hZ2VJbmRleC5pc0F1dGhvcml6ZWQsXHJcbiAgeyBpbmRleE5vZGVLZXkgfSxcclxuICBfYnVpbGRJbmRleCwgYXBwLCBpbmRleE5vZGVLZXksXHJcbik7XHJcblxyXG5jb25zdCBfYnVpbGRJbmRleCA9IGFzeW5jIChhcHAsIGluZGV4Tm9kZUtleSkgPT4ge1xyXG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldE5vZGUoYXBwLmhpZXJhcmNoeSwgaW5kZXhOb2RlS2V5KTtcclxuXHJcbiAgYXdhaXQgY3JlYXRlQnVpbGRJbmRleEZvbGRlcihhcHAuZGF0YXN0b3JlLCBpbmRleE5vZGVLZXkpO1xyXG5cclxuICBpZiAoIWlzSW5kZXgoaW5kZXhOb2RlKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdCdWlsZEluZGV4OiBtdXN0IHN1cHBseSBhbiBpbmRleG5vZGUnKTsgfVxyXG5cclxuICBpZiAoaW5kZXhOb2RlLmluZGV4VHlwZSA9PT0gJ3JlZmVyZW5jZScpIHtcclxuICAgIGF3YWl0IGJ1aWxkUmV2ZXJzZVJlZmVyZW5jZUluZGV4KFxyXG4gICAgICBhcHAsIGluZGV4Tm9kZSxcclxuICAgICk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGF3YWl0IGJ1aWxkSGVpcmFyY2hhbEluZGV4KFxyXG4gICAgICBhcHAsIGluZGV4Tm9kZSxcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBhd2FpdCBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucygpO1xyXG59O1xyXG5cclxuY29uc3QgYnVpbGRSZXZlcnNlUmVmZXJlbmNlSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleE5vZGUpID0+IHtcclxuICAvLyBJdGVyYXRlIHRocm91Z2ggYWxsIHJlZmVyZW5jSU5HIHJlY29yZHMsXHJcbiAgLy8gYW5kIHVwZGF0ZSByZWZlcmVuY2VkIGluZGV4IGZvciBlYWNoIHJlY29yZFxyXG4gIGxldCByZWNvcmRDb3VudCA9IDA7XHJcbiAgY29uc3QgcmVmZXJlbmNpbmdOb2RlcyA9ICQoYXBwLmhpZXJhcmNoeSwgW1xyXG4gICAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxyXG4gICAgZmlsdGVyKG4gPT4gaXNSZWNvcmQobilcclxuICAgICAgICAgICAgICAgICAgICAmJiBzb21lKGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4KGluZGV4Tm9kZSkpKG4uZmllbGRzKSksXHJcbiAgXSk7XHJcblxyXG4gIGNvbnN0IGNyZWF0ZVRyYW5zYWN0aW9uc0ZvclJlZmVyZW5jaW5nTm9kZSA9IGFzeW5jIChyZWZlcmVuY2luZ05vZGUpID0+IHtcclxuICAgIGNvbnN0IGl0ZXJhdGVSZWZlcmVuY2luZ05vZGVzID0gYXdhaXQgZ2V0QWxsSWRzSXRlcmF0b3IoYXBwKShyZWZlcmVuY2luZ05vZGUuY29sbGVjdGlvbk5vZGVLZXkoKSk7XHJcblxyXG4gICAgbGV0IHJlZmVyZW5jaW5nSWRJdGVyYXRvciA9IGF3YWl0IGl0ZXJhdGVSZWZlcmVuY2luZ05vZGVzKCk7XHJcbiAgICB3aGlsZSAoIXJlZmVyZW5jaW5nSWRJdGVyYXRvci5kb25lKSB7XHJcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZWZlcmVuY2luZ0lkSXRlcmF0b3I7XHJcbiAgICAgIGZvciAoY29uc3QgaWQgb2YgcmVzdWx0Lmlkcykge1xyXG4gICAgICAgIGNvbnN0IHJlY29yZEtleSA9IGpvaW5LZXkocmVzdWx0LmNvbGxlY3Rpb25LZXksIGlkKTtcclxuICAgICAgICBhd2FpdCB0cmFuc2FjdGlvbkZvckJ1aWxkSW5kZXgoYXBwLCBpbmRleE5vZGUubm9kZUtleSgpLCByZWNvcmRLZXksIHJlY29yZENvdW50KTtcclxuICAgICAgICByZWNvcmRDb3VudCsrO1xyXG4gICAgICB9XHJcbiAgICAgIHJlZmVyZW5jaW5nSWRJdGVyYXRvciA9IGF3YWl0IGl0ZXJhdGVSZWZlcmVuY2luZ05vZGVzKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZm9yIChjb25zdCByZWZlcmVuY2luZ05vZGUgb2YgcmVmZXJlbmNpbmdOb2Rlcykge1xyXG4gICAgYXdhaXQgY3JlYXRlVHJhbnNhY3Rpb25zRm9yUmVmZXJlbmNpbmdOb2RlKHJlZmVyZW5jaW5nTm9kZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgZ2V0QWxsb3dlZFBhcmVudENvbGxlY3Rpb25Ob2RlcyA9IChoaWVyYXJjaHksIGluZGV4Tm9kZSkgPT4gJChnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleChoaWVyYXJjaHksIGluZGV4Tm9kZSksIFtcclxuICBtYXAobiA9PiBuLnBhcmVudCgpKSxcclxuXSk7XHJcblxyXG5jb25zdCBidWlsZEhlaXJhcmNoYWxJbmRleCA9IGFzeW5jIChhcHAsIGluZGV4Tm9kZSkgPT4ge1xyXG4gIGxldCByZWNvcmRDb3VudCA9IDA7XHJcblxyXG4gIGNvbnN0IGNyZWF0ZVRyYW5zYWN0aW9uc0ZvcklkcyA9IGFzeW5jIChjb2xsZWN0aW9uS2V5LCBpZHMpID0+IHtcclxuICAgIGZvciAoY29uc3QgcmVjb3JkSWQgb2YgaWRzKSB7XHJcbiAgICAgIGNvbnN0IHJlY29yZEtleSA9IGpvaW5LZXkoY29sbGVjdGlvbktleSwgcmVjb3JkSWQpO1xyXG5cclxuICAgICAgY29uc3QgcmVjb3JkTm9kZSA9IGdldFJlY29yZE5vZGVCeUlkKFxyXG4gICAgICAgIGFwcC5oaWVyYXJjaHksXHJcbiAgICAgICAgcmVjb3JkSWQsXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBpZiAocmVjb3JkTm9kZUFwcGxpZXMoaW5kZXhOb2RlKShyZWNvcmROb2RlKSkge1xyXG4gICAgICAgIGF3YWl0IHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleChcclxuICAgICAgICAgIGFwcCwgaW5kZXhOb2RlLm5vZGVLZXkoKSxcclxuICAgICAgICAgIHJlY29yZEtleSwgcmVjb3JkQ291bnQsXHJcbiAgICAgICAgKTtcclxuICAgICAgICByZWNvcmRDb3VudCsrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcblxyXG4gIGNvbnN0IGNvbGxlY3Rpb25SZWNvcmRzID0gZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgoYXBwLmhpZXJhcmNoeSwgaW5kZXhOb2RlKTtcclxuXHJcbiAgZm9yIChjb25zdCB0YXJnZXRDb2xsZWN0aW9uUmVjb3JkTm9kZSBvZiBjb2xsZWN0aW9uUmVjb3Jkcykge1xyXG4gICAgY29uc3QgYWxsSWRzSXRlcmF0b3IgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvcihhcHApKHRhcmdldENvbGxlY3Rpb25SZWNvcmROb2RlLmNvbGxlY3Rpb25Ob2RlS2V5KCkpO1xyXG5cclxuICAgIGxldCBhbGxJZHMgPSBhd2FpdCBhbGxJZHNJdGVyYXRvcigpO1xyXG4gICAgd2hpbGUgKGFsbElkcy5kb25lID09PSBmYWxzZSkge1xyXG4gICAgICBhd2FpdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JJZHMoXHJcbiAgICAgICAgYWxsSWRzLnJlc3VsdC5jb2xsZWN0aW9uS2V5LFxyXG4gICAgICAgIGFsbElkcy5yZXN1bHQuaWRzLFxyXG4gICAgICApO1xyXG4gICAgICBhbGxJZHMgPSBhd2FpdCBhbGxJZHNJdGVyYXRvcigpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlY29yZENvdW50O1xyXG59O1xyXG5cclxuY29uc3QgY2hvb3NlQ2hpbGRSZWNvcmROb2RlQnlLZXkgPSAoY29sbGVjdGlvbk5vZGUsIHJlY29yZElkKSA9PiBmaW5kKGMgPT4gcmVjb3JkSWQuc3RhcnRzV2l0aChjLm5vZGVJZCkpKGNvbGxlY3Rpb25Ob2RlLmNoaWxkcmVuKTtcclxuXHJcbmNvbnN0IHJlY29yZE5vZGVBcHBsaWVzID0gaW5kZXhOb2RlID0+IHJlY29yZE5vZGUgPT4gaW5jbHVkZXMocmVjb3JkTm9kZS5ub2RlSWQpKGluZGV4Tm9kZS5hbGxvd2VkUmVjb3JkTm9kZUlkcyk7XHJcblxyXG5jb25zdCBoYXNBcHBsaWNhYmxlRGVjZW5kYW50ID0gKGhpZXJhcmNoeSwgYW5jZXN0b3JOb2RlLCBpbmRleE5vZGUpID0+ICQoaGllcmFyY2h5LCBbXHJcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxyXG4gIGZpbHRlcihcclxuICAgIGFsbFRydWUoXHJcbiAgICAgIGlzUmVjb3JkLFxyXG4gICAgICBpc0RlY2VuZGFudChhbmNlc3Rvck5vZGUpLFxyXG4gICAgICByZWNvcmROb2RlQXBwbGllcyhpbmRleE5vZGUpLFxyXG4gICAgKSxcclxuICApLFxyXG5dKTtcclxuXHJcbmNvbnN0IGFwcGx5QWxsRGVjZW5kYW50UmVjb3JkcyA9IGFzeW5jIChhcHAsIGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXksXHJcbiAgaW5kZXhOb2RlLCBpbmRleEtleSwgY3VycmVudEluZGV4ZWREYXRhLFxyXG4gIGN1cnJlbnRJbmRleGVkRGF0YUtleSwgcmVjb3JkQ291bnQgPSAwKSA9PiB7XHJcbiAgY29uc3QgY29sbGVjdGlvbk5vZGUgPSBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5KFxyXG4gICAgYXBwLmhpZXJhcmNoeSxcclxuICAgIGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXksXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgYWxsSWRzSXRlcmF0b3IgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvcihhcHApKGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXkpO1xyXG5cclxuXHJcbiAgY29uc3QgY3JlYXRlVHJhbnNhY3Rpb25zRm9ySWRzID0gYXN5bmMgKGNvbGxlY3Rpb25LZXksIGFsbElkcykgPT4ge1xyXG4gICAgZm9yIChjb25zdCByZWNvcmRJZCBvZiBhbGxJZHMpIHtcclxuICAgICAgY29uc3QgcmVjb3JkS2V5ID0gam9pbktleShjb2xsZWN0aW9uS2V5LCByZWNvcmRJZCk7XHJcblxyXG4gICAgICBjb25zdCByZWNvcmROb2RlID0gY2hvb3NlQ2hpbGRSZWNvcmROb2RlQnlLZXkoXHJcbiAgICAgICAgY29sbGVjdGlvbk5vZGUsXHJcbiAgICAgICAgcmVjb3JkSWQsXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBpZiAocmVjb3JkTm9kZUFwcGxpZXMoaW5kZXhOb2RlKShyZWNvcmROb2RlKSkge1xyXG4gICAgICAgIGF3YWl0IHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleChcclxuICAgICAgICAgIGFwcCwgaW5kZXhOb2RlLm5vZGVLZXkoKSxcclxuICAgICAgICAgIHJlY29yZEtleSwgcmVjb3JkQ291bnQsXHJcbiAgICAgICAgKTtcclxuICAgICAgICByZWNvcmRDb3VudCsrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaGFzQXBwbGljYWJsZURlY2VuZGFudChhcHAuaGllcmFyY2h5LCByZWNvcmROb2RlLCBpbmRleE5vZGUpKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZENvbGxlY3Rpb25Ob2RlIG9mIHJlY29yZE5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICAgIHJlY29yZENvdW50ID0gYXdhaXQgYXBwbHlBbGxEZWNlbmRhbnRSZWNvcmRzKFxyXG4gICAgICAgICAgICBhcHAsXHJcbiAgICAgICAgICAgIGpvaW5LZXkocmVjb3JkS2V5LCBjaGlsZENvbGxlY3Rpb25Ob2RlLmNvbGxlY3Rpb25OYW1lKSxcclxuICAgICAgICAgICAgaW5kZXhOb2RlLCBpbmRleEtleSwgY3VycmVudEluZGV4ZWREYXRhLFxyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXhlZERhdGFLZXksIHJlY29yZENvdW50LFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBsZXQgYWxsSWRzID0gYXdhaXQgYWxsSWRzSXRlcmF0b3IoKTtcclxuICB3aGlsZSAoYWxsSWRzLmRvbmUgPT09IGZhbHNlKSB7XHJcbiAgICBhd2FpdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JJZHMoXHJcbiAgICAgIGFsbElkcy5yZXN1bHQuY29sbGVjdGlvbktleSxcclxuICAgICAgYWxsSWRzLnJlc3VsdC5pZHMsXHJcbiAgICApO1xyXG4gICAgYWxsSWRzID0gYXdhaXQgYWxsSWRzSXRlcmF0b3IoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiByZWNvcmRDb3VudDtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGJ1aWxkSW5kZXg7XHJcbiIsImltcG9ydCB7IGhhcywgaXNOdW1iZXIsIGlzVW5kZWZpbmVkIH0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgY29tcGlsZUV4cHJlc3Npb24sIGNvbXBpbGVDb2RlIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xyXG5pbXBvcnQge1xyXG4gIHNhZmVLZXksIGFwaVdyYXBwZXIsXHJcbiAgZXZlbnRzLCBpc05vbkVtcHR5U3RyaW5nLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IGl0ZXJhdGVJbmRleCB9IGZyb20gJy4uL2luZGV4aW5nL3JlYWQnO1xyXG5pbXBvcnQge1xyXG4gIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSxcclxuICBnZXRTaGFyZEtleXNJblJhbmdlLFxyXG59IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcclxuaW1wb3J0IHtcclxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLCBpc0luZGV4LFxyXG4gIGlzU2hhcmRlZEluZGV4LFxyXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7IENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUyB9IGZyb20gJy4uL2luZGV4aW5nL3NlcmlhbGl6ZXInO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XHJcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGFnZ3JlZ2F0ZXMgPSBhcHAgPT4gYXN5bmMgKGluZGV4S2V5LCByYW5nZVN0YXJ0UGFyYW1zID0gbnVsbCwgcmFuZ2VFbmRQYXJhbXMgPSBudWxsKSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMuaW5kZXhBcGkuYWdncmVnYXRlcyxcclxuICBwZXJtaXNzaW9uLnJlYWRJbmRleC5pc0F1dGhvcml6ZWQoaW5kZXhLZXkpLFxyXG4gIHsgaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zIH0sXHJcbiAgX2FnZ3JlZ2F0ZXMsIGFwcCwgaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zLFxyXG4pO1xyXG5cclxuY29uc3QgX2FnZ3JlZ2F0ZXMgPSBhc3luYyAoYXBwLCBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMpID0+IHtcclxuICBpbmRleEtleSA9IHNhZmVLZXkoaW5kZXhLZXkpO1xyXG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoaW5kZXhLZXkpO1xyXG5cclxuICBpZiAoIWlzSW5kZXgoaW5kZXhOb2RlKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdzdXBwbGllZCBrZXkgaXMgbm90IGFuIGluZGV4Jyk7IH1cclxuXHJcbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4Tm9kZSkpIHtcclxuICAgIGNvbnN0IHNoYXJkS2V5cyA9IGF3YWl0IGdldFNoYXJkS2V5c0luUmFuZ2UoXHJcbiAgICAgIGFwcCwgaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zLFxyXG4gICAgKTtcclxuICAgIGxldCBhZ2dyZWdhdGVSZXN1bHQgPSBudWxsO1xyXG4gICAgZm9yIChjb25zdCBrIG9mIHNoYXJkS2V5cykge1xyXG4gICAgICBjb25zdCBzaGFyZFJlc3VsdCA9IGF3YWl0IGdldEFnZ3JlZ2F0ZXMoYXBwLmhpZXJhcmNoeSwgYXBwLmRhdGFzdG9yZSwgaW5kZXhOb2RlLCBrKTtcclxuICAgICAgaWYgKGFnZ3JlZ2F0ZVJlc3VsdCA9PT0gbnVsbCkge1xyXG4gICAgICAgIGFnZ3JlZ2F0ZVJlc3VsdCA9IHNoYXJkUmVzdWx0O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFnZ3JlZ2F0ZVJlc3VsdCA9IG1lcmdlU2hhcmRBZ2dyZWdhdGUoXHJcbiAgICAgICAgICBhZ2dyZWdhdGVSZXN1bHQsXHJcbiAgICAgICAgICBzaGFyZFJlc3VsdCxcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYWdncmVnYXRlUmVzdWx0O1xyXG4gIH1cclxuICByZXR1cm4gYXdhaXQgZ2V0QWdncmVnYXRlcyhcclxuICAgIGFwcC5oaWVyYXJjaHksXHJcbiAgICBhcHAuZGF0YXN0b3JlLFxyXG4gICAgaW5kZXhOb2RlLFxyXG4gICAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5KGluZGV4S2V5KSxcclxuICApO1xyXG59O1xyXG5cclxuY29uc3QgbWVyZ2VTaGFyZEFnZ3JlZ2F0ZSA9ICh0b3RhbHMsIHNoYXJkKSA9PiB7XHJcbiAgY29uc3QgbWVyZ2VHcm91cGluZyA9ICh0b3QsIHNocikgPT4ge1xyXG4gICAgdG90LmNvdW50ICs9IHNoci5jb3VudDtcclxuICAgIGZvciAoY29uc3QgYWdnTmFtZSBpbiB0b3QpIHtcclxuICAgICAgaWYgKGFnZ05hbWUgPT09ICdjb3VudCcpIGNvbnRpbnVlO1xyXG4gICAgICBjb25zdCB0b3RhZ2cgPSB0b3RbYWdnTmFtZV07XHJcbiAgICAgIGNvbnN0IHNocmFnZyA9IHNoclthZ2dOYW1lXTtcclxuICAgICAgdG90YWdnLnN1bSArPSBzaHJhZ2cuc3VtO1xyXG4gICAgICB0b3RhZ2cubWF4ID0gdG90YWdnLm1heCA+IHNocmFnZy5tYXhcclxuICAgICAgICA/IHRvdGFnZy5tYXhcclxuICAgICAgICA6IHNocmFnZy5tYXg7XHJcbiAgICAgIHRvdGFnZy5taW4gPSB0b3RhZ2cubWluIDwgc2hyYWdnLm1pblxyXG4gICAgICAgID8gdG90YWdnLm1pblxyXG4gICAgICAgIDogc2hyYWdnLm1pbjtcclxuICAgICAgdG90YWdnLm1lYW4gPSB0b3RhZ2cuc3VtIC8gdG90LmNvdW50O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvdDtcclxuICB9O1xyXG5cclxuICBmb3IgKGNvbnN0IGFnZ0dyb3VwRGVmIGluIHRvdGFscykge1xyXG4gICAgZm9yIChjb25zdCBncm91cGluZyBpbiBzaGFyZFthZ2dHcm91cERlZl0pIHtcclxuICAgICAgY29uc3QgZ3JvdXBpbmdUb3RhbCA9IHRvdGFsc1thZ2dHcm91cERlZl1bZ3JvdXBpbmddO1xyXG4gICAgICB0b3RhbHNbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXSA9IGlzVW5kZWZpbmVkKGdyb3VwaW5nVG90YWwpXHJcbiAgICAgICAgPyBzaGFyZFthZ2dHcm91cERlZl1bZ3JvdXBpbmddXHJcbiAgICAgICAgOiBtZXJnZUdyb3VwaW5nKFxyXG4gICAgICAgICAgdG90YWxzW2FnZ0dyb3VwRGVmXVtncm91cGluZ10sXHJcbiAgICAgICAgICBzaGFyZFthZ2dHcm91cERlZl1bZ3JvdXBpbmddLFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdG90YWxzO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0QWdncmVnYXRlcyA9IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KSA9PiB7XHJcbiAgY29uc3QgYWdncmVnYXRlUmVzdWx0ID0ge307XHJcbiAgY29uc3QgZG9SZWFkID0gaXRlcmF0ZUluZGV4KFxyXG4gICAgICAgIGFzeW5jIGl0ZW0gPT4ge1xyXG4gICAgICBhcHBseUl0ZW1Ub0FnZ3JlZ2F0ZVJlc3VsdChcclxuICAgICAgICBpbmRleCwgYWdncmVnYXRlUmVzdWx0LCBpdGVtLFxyXG4gICAgICApO1xyXG4gICAgICByZXR1cm4gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xyXG4gICAgfSxcclxuICAgICAgICBhc3luYyAoKSA9PiBhZ2dyZWdhdGVSZXN1bHRcclxuICApO1xyXG5cclxuICByZXR1cm4gYXdhaXQgZG9SZWFkKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXkpO1xyXG59O1xyXG5cclxuXHJcbmNvbnN0IGFwcGx5SXRlbVRvQWdncmVnYXRlUmVzdWx0ID0gKGluZGV4Tm9kZSwgcmVzdWx0LCBpdGVtKSA9PiB7XHJcbiAgY29uc3QgZ2V0SW5pdGlhbEFnZ3JlZ2F0ZVJlc3VsdCA9ICgpID0+ICh7XHJcbiAgICBzdW06IDAsIG1lYW46IG51bGwsIG1heDogbnVsbCwgbWluOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICBjb25zdCBhcHBseUFnZ3JlZ2F0ZVJlc3VsdCA9IChhZ2csIGV4aXN0aW5nLCBjb3VudCkgPT4ge1xyXG4gICAgY29uc3QgdmFsdWUgPSBjb21waWxlQ29kZShhZ2cuYWdncmVnYXRlZFZhbHVlKSh7IHJlY29yZDogaXRlbSB9KTtcclxuXHJcbiAgICBpZiAoIWlzTnVtYmVyKHZhbHVlKSkgcmV0dXJuIGV4aXN0aW5nO1xyXG5cclxuICAgIGV4aXN0aW5nLnN1bSArPSB2YWx1ZTtcclxuICAgIGV4aXN0aW5nLm1heCA9IHZhbHVlID4gZXhpc3RpbmcubWF4IHx8IGV4aXN0aW5nLm1heCA9PT0gbnVsbFxyXG4gICAgICA/IHZhbHVlXHJcbiAgICAgIDogZXhpc3RpbmcubWF4O1xyXG4gICAgZXhpc3RpbmcubWluID0gdmFsdWUgPCBleGlzdGluZy5taW4gfHwgZXhpc3RpbmcubWluID09PSBudWxsXHJcbiAgICAgID8gdmFsdWVcclxuICAgICAgOiBleGlzdGluZy5taW47XHJcbiAgICBleGlzdGluZy5tZWFuID0gZXhpc3Rpbmcuc3VtIC8gY291bnQ7XHJcbiAgICByZXR1cm4gZXhpc3Rpbmc7XHJcbiAgfTtcclxuXHJcbiAgZm9yIChjb25zdCBhZ2dHcm91cCBvZiBpbmRleE5vZGUuYWdncmVnYXRlR3JvdXBzKSB7XHJcbiAgICBpZiAoIWhhcyhhZ2dHcm91cC5uYW1lKShyZXN1bHQpKSB7XHJcbiAgICAgIHJlc3VsdFthZ2dHcm91cC5uYW1lXSA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRoaXNHcm91cFJlc3VsdCA9IHJlc3VsdFthZ2dHcm91cC5uYW1lXTtcclxuXHJcbiAgICBpZiAoaXNOb25FbXB0eVN0cmluZyhhZ2dHcm91cC5jb25kaXRpb24pKSB7XHJcbiAgICAgIGlmICghY29tcGlsZUV4cHJlc3Npb24oYWdnR3JvdXAuY29uZGl0aW9uKSh7IHJlY29yZDogaXRlbSB9KSkge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGdyb3VwID0gaXNOb25FbXB0eVN0cmluZyhhZ2dHcm91cC5ncm91cEJ5KVxyXG4gICAgICA/IGNvbXBpbGVDb2RlKGFnZ0dyb3VwLmdyb3VwQnkpKHsgcmVjb3JkOiBpdGVtIH0pXHJcbiAgICAgIDogJ2FsbCc7XHJcbiAgICBpZiAoIWlzTm9uRW1wdHlTdHJpbmcoZ3JvdXApKSB7XHJcbiAgICAgIGdyb3VwID0gJyhub25lKSc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFoYXMoZ3JvdXApKHRoaXNHcm91cFJlc3VsdCkpIHtcclxuICAgICAgdGhpc0dyb3VwUmVzdWx0W2dyb3VwXSA9IHsgY291bnQ6IDAgfTtcclxuICAgICAgZm9yIChjb25zdCBhZ2cgb2YgYWdnR3JvdXAuYWdncmVnYXRlcykge1xyXG4gICAgICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF1bYWdnLm5hbWVdID0gZ2V0SW5pdGlhbEFnZ3JlZ2F0ZVJlc3VsdCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpc0dyb3VwUmVzdWx0W2dyb3VwXS5jb3VudCsrO1xyXG5cclxuICAgIGZvciAoY29uc3QgYWdnIG9mIGFnZ0dyb3VwLmFnZ3JlZ2F0ZXMpIHtcclxuICAgICAgY29uc3QgZXhpc3RpbmdWYWx1ZXMgPSB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdW2FnZy5uYW1lXTtcclxuICAgICAgdGhpc0dyb3VwUmVzdWx0W2dyb3VwXVthZ2cubmFtZV0gPSBhcHBseUFnZ3JlZ2F0ZVJlc3VsdChcclxuICAgICAgICBhZ2csIGV4aXN0aW5nVmFsdWVzLFxyXG4gICAgICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF0uY291bnQsXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG4iLCJpbXBvcnQgeyBidWlsZEluZGV4IH0gZnJvbSAnLi9idWlsZEluZGV4JztcclxuaW1wb3J0IHsgbGlzdEl0ZW1zIH0gZnJvbSAnLi9saXN0SXRlbXMnO1xyXG5pbXBvcnQgeyBhZ2dyZWdhdGVzIH0gZnJvbSAnLi9hZ2dyZWdhdGVzJztcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRJbmRleEFwaSA9IGFwcCA9PiAoe1xyXG4gIGxpc3RJdGVtczogbGlzdEl0ZW1zKGFwcCksXHJcbiAgYnVpbGRJbmRleDogYnVpbGRJbmRleChhcHApLFxyXG4gIGFnZ3JlZ2F0ZXM6IGFnZ3JlZ2F0ZXMoYXBwKSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXRJbmRleEFwaTtcclxuIiwiaW1wb3J0IHsgZWFjaCwgY29uc3RhbnQsIGZpbmQgfSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBtYXAsIG1heCB9IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7XHJcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIGpvaW5LZXksXHJcbiAgJCwgaXNOb3RoaW5nLCBpc1NvbWV0aGluZyxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQge1xyXG4gIGlzSW5kZXgsIGlzUm9vdCwgaXNTaW5nbGVSZWNvcmQsIGlzQ29sbGVjdGlvblJlY29yZCxcclxuICBpc1JlY29yZCwgaXNhZ2dyZWdhdGVHcm91cCxcclxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbn0gZnJvbSAnLi9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBhbGwgfSBmcm9tICcuLi90eXBlcyc7XHJcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZU5vZGVFcnJvcnMgPSB7XHJcbiAgaW5kZXhDYW5ub3RCZVBhcmVudDogJ0luZGV4IHRlbXBsYXRlIGNhbm5vdCBiZSBhIHBhcmVudCcsXHJcbiAgYWxsTm9uUm9vdE5vZGVzTXVzdEhhdmVQYXJlbnQ6ICdPbmx5IHRoZSByb290IG5vZGUgbWF5IGhhdmUgbm8gcGFyZW50JyxcclxuICBpbmRleFBhcmVudE11c3RCZVJlY29yZE9yUm9vdDogJ0FuIGluZGV4IG1heSBvbmx5IGhhdmUgYSByZWNvcmQgb3Igcm9vdCBhcyBhIHBhcmVudCcsXHJcbiAgYWdncmVnYXRlUGFyZW50TXVzdEJlQW5JbmRleDogJ2FnZ3JlZ2F0ZUdyb3VwIHBhcmVudCBtdXN0IGJlIGFuIGluZGV4JyxcclxufTtcclxuXHJcbmNvbnN0IHBhdGhSZWd4TWFrZXIgPSBub2RlID0+ICgpID0+IG5vZGUubm9kZUtleSgpLnJlcGxhY2UoL3tpZH0vZywgJ1thLXpBLVowLTlfLV0rJyk7XHJcblxyXG5jb25zdCBub2RlS2V5TWFrZXIgPSBub2RlID0+ICgpID0+IHN3aXRjaENhc2UoXHJcblxyXG4gIFtuID0+IGlzUmVjb3JkKG4pICYmICFpc1NpbmdsZVJlY29yZChuKSxcclxuICAgIG4gPT4gam9pbktleShcclxuICAgICAgbm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksXHJcbiAgICAgIG5vZGUuY29sbGVjdGlvbk5hbWUsXHJcbiAgICAgIGAke24ubm9kZUlkfS17aWR9YCxcclxuICAgICldLFxyXG5cclxuICBbaXNSb290LFxyXG4gICAgY29uc3RhbnQoJy8nKV0sXHJcblxyXG4gIFtkZWZhdWx0Q2FzZSxcclxuICAgIG4gPT4gam9pbktleShub2RlLnBhcmVudCgpLm5vZGVLZXkoKSwgbi5uYW1lKV0sXHJcblxyXG4pKG5vZGUpO1xyXG5cclxuXHJcbmNvbnN0IHZhbGlkYXRlID0gcGFyZW50ID0+IChub2RlKSA9PiB7XHJcbiAgaWYgKGlzSW5kZXgobm9kZSlcclxuICAgICAgICAmJiBpc1NvbWV0aGluZyhwYXJlbnQpXHJcbiAgICAgICAgJiYgIWlzUm9vdChwYXJlbnQpXHJcbiAgICAgICAgJiYgIWlzUmVjb3JkKHBhcmVudCkpIHtcclxuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoY3JlYXRlTm9kZUVycm9ycy5pbmRleFBhcmVudE11c3RCZVJlY29yZE9yUm9vdCk7XHJcbiAgfVxyXG5cclxuICBpZiAoaXNhZ2dyZWdhdGVHcm91cChub2RlKVxyXG4gICAgICAgICYmIGlzU29tZXRoaW5nKHBhcmVudClcclxuICAgICAgICAmJiAhaXNJbmRleChwYXJlbnQpKSB7XHJcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGNyZWF0ZU5vZGVFcnJvcnMuYWdncmVnYXRlUGFyZW50TXVzdEJlQW5JbmRleCk7XHJcbiAgfVxyXG5cclxuICBpZiAoaXNOb3RoaW5nKHBhcmVudCkgJiYgIWlzUm9vdChub2RlKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGNyZWF0ZU5vZGVFcnJvcnMuYWxsTm9uUm9vdE5vZGVzTXVzdEhhdmVQYXJlbnQpOyB9XHJcblxyXG4gIHJldHVybiBub2RlO1xyXG59O1xyXG5cclxuY29uc3QgY29uc3RydWN0ID0gcGFyZW50ID0+IChub2RlKSA9PiB7XHJcbiAgbm9kZS5ub2RlS2V5ID0gbm9kZUtleU1ha2VyKG5vZGUpO1xyXG4gIG5vZGUucGF0aFJlZ3ggPSBwYXRoUmVneE1ha2VyKG5vZGUpO1xyXG4gIG5vZGUucGFyZW50ID0gY29uc3RhbnQocGFyZW50KTtcclxuICBub2RlLmlzUm9vdCA9ICgpID0+IGlzTm90aGluZyhwYXJlbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIG5vZGUubmFtZSA9PT0gJ3Jvb3QnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIG5vZGUudHlwZSA9PT0gJ3Jvb3QnO1xyXG4gIGlmIChpc0NvbGxlY3Rpb25SZWNvcmQobm9kZSkpIHtcclxuICAgIG5vZGUuY29sbGVjdGlvbk5vZGVLZXkgPSAoKSA9PiBqb2luS2V5KFxyXG4gICAgICBwYXJlbnQubm9kZUtleSgpLCBub2RlLmNvbGxlY3Rpb25OYW1lLFxyXG4gICAgKTtcclxuICAgIG5vZGUuY29sbGVjdGlvblBhdGhSZWd4ID0gKCkgPT4gam9pbktleShcclxuICAgICAgcGFyZW50LnBhdGhSZWd4KCksIG5vZGUuY29sbGVjdGlvbk5hbWUsXHJcbiAgICApO1xyXG4gIH1cclxuICByZXR1cm4gbm9kZTtcclxufTtcclxuXHJcbmNvbnN0IGFkZFRvUGFyZW50ID0gKG9iaikgPT4ge1xyXG4gIGNvbnN0IHBhcmVudCA9IG9iai5wYXJlbnQoKTtcclxuICBpZiAoaXNTb21ldGhpbmcocGFyZW50KSkge1xyXG4gICAgaWYgKGlzSW5kZXgob2JqKSlcclxuICAgIC8vIFE6IHdoeSBhcmUgaW5kZXhlcyBub3QgY2hpbGRyZW4gP1xyXG4gICAgLy8gQTogYmVjYXVzZSB0aGV5IGNhbm5vdCBoYXZlIGNoaWxkcmVuIG9mIHRoZWlyIG93bi5cclxuICAgIHsgcGFyZW50LmluZGV4ZXMucHVzaChvYmopOyB9IGVsc2UgaWYgKGlzYWdncmVnYXRlR3JvdXAob2JqKSkgeyBwYXJlbnQuYWdncmVnYXRlR3JvdXBzLnB1c2gob2JqKTsgfSBlbHNlIHsgcGFyZW50LmNoaWxkcmVuLnB1c2gob2JqKTsgfVxyXG5cclxuICAgIGlmIChpc1JlY29yZChvYmopKSB7XHJcbiAgICAgIGNvbnN0IGRlZmF1bHRJbmRleCA9IGZpbmQoXHJcbiAgICAgICAgcGFyZW50LmluZGV4ZXMsXHJcbiAgICAgICAgaSA9PiBpLm5hbWUgPT09IGAke3BhcmVudC5uYW1lfV9pbmRleGAsXHJcbiAgICAgICk7XHJcbiAgICAgIGlmIChkZWZhdWx0SW5kZXgpIHtcclxuICAgICAgICBkZWZhdWx0SW5kZXguYWxsb3dlZFJlY29yZE5vZGVJZHMucHVzaChvYmoubm9kZUlkKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gb2JqO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbnN0cnVjdE5vZGUgPSAocGFyZW50LCBvYmopID0+ICQob2JqLCBbXHJcbiAgY29uc3RydWN0KHBhcmVudCksXHJcbiAgdmFsaWRhdGUocGFyZW50KSxcclxuICBhZGRUb1BhcmVudCxcclxuXSk7XHJcblxyXG5jb25zdCBnZXROb2RlSWQgPSAocGFyZW50Tm9kZSkgPT4ge1xyXG4gIC8vIHRoaXMgY2FzZSBpcyBoYW5kbGVkIGJldHRlciBlbHNld2hlcmVcclxuICBpZiAoIXBhcmVudE5vZGUpIHJldHVybiBudWxsO1xyXG4gIGNvbnN0IGZpbmRSb290ID0gbiA9PiAoaXNSb290KG4pID8gbiA6IGZpbmRSb290KG4ucGFyZW50KCkpKTtcclxuICBjb25zdCByb290ID0gZmluZFJvb3QocGFyZW50Tm9kZSk7XHJcblxyXG4gIHJldHVybiAoJChyb290LCBbXHJcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXHJcbiAgICBtYXAobiA9PiBuLm5vZGVJZCksXHJcbiAgICBtYXhdKSArIDEpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbnN0cnVjdEhpZXJhcmNoeSA9IChub2RlLCBwYXJlbnQpID0+IHtcclxuICBjb25zdHJ1Y3QocGFyZW50KShub2RlKTtcclxuICBpZiAobm9kZS5pbmRleGVzKSB7XHJcbiAgICBlYWNoKG5vZGUuaW5kZXhlcyxcclxuICAgICAgY2hpbGQgPT4gY29uc3RydWN0SGllcmFyY2h5KGNoaWxkLCBub2RlKSk7XHJcbiAgfVxyXG4gIGlmIChub2RlLmFnZ3JlZ2F0ZUdyb3Vwcykge1xyXG4gICAgZWFjaChub2RlLmFnZ3JlZ2F0ZUdyb3VwcyxcclxuICAgICAgY2hpbGQgPT4gY29uc3RydWN0SGllcmFyY2h5KGNoaWxkLCBub2RlKSk7XHJcbiAgfVxyXG4gIGlmIChub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgZWFjaChub2RlLmNoaWxkcmVuLFxyXG4gICAgICBjaGlsZCA9PiBjb25zdHJ1Y3RIaWVyYXJjaHkoY2hpbGQsIG5vZGUpKTtcclxuICB9XHJcbiAgaWYgKG5vZGUuZmllbGRzKSB7XHJcbiAgICBlYWNoKG5vZGUuZmllbGRzLFxyXG4gICAgICBmID0+IGVhY2goZi50eXBlT3B0aW9ucywgKHZhbCwga2V5KSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGVmID0gYWxsW2YudHlwZV0ub3B0aW9uRGVmaW5pdGlvbnNba2V5XTtcclxuICAgICAgICBpZiAoIWRlZikge1xyXG4gICAgICAgICAgLy8gdW5rbm93biB0eXBlT3B0aW9uXHJcbiAgICAgICAgICBkZWxldGUgZi50eXBlT3B0aW9uc1trZXldO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBmLnR5cGVPcHRpb25zW2tleV0gPSBkZWYucGFyc2UodmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pKTtcclxuICB9XHJcbiAgcmV0dXJuIG5vZGU7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGdldE5ld1Jvb3RMZXZlbCA9ICgpID0+IGNvbnN0cnVjdCgpKHtcclxuICBuYW1lOiAncm9vdCcsXHJcbiAgdHlwZTogJ3Jvb3QnLFxyXG4gIGNoaWxkcmVuOiBbXSxcclxuICBwYXRoTWFwczogW10sXHJcbiAgaW5kZXhlczogW10sXHJcbiAgbm9kZUlkOiAwLFxyXG59KTtcclxuXHJcbmNvbnN0IF9nZXROZXdSZWNvcmRUZW1wbGF0ZSA9IChwYXJlbnQsIG5hbWUsIGNyZWF0ZURlZmF1bHRJbmRleCwgaXNTaW5nbGUpID0+IHtcclxuICBjb25zdCBub2RlID0gY29uc3RydWN0Tm9kZShwYXJlbnQsIHtcclxuICAgIG5hbWUsXHJcbiAgICB0eXBlOiAncmVjb3JkJyxcclxuICAgIGZpZWxkczogW10sXHJcbiAgICBjaGlsZHJlbjogW10sXHJcbiAgICB2YWxpZGF0aW9uUnVsZXM6IFtdLFxyXG4gICAgbm9kZUlkOiBnZXROb2RlSWQocGFyZW50KSxcclxuICAgIGluZGV4ZXM6IFtdLFxyXG4gICAgYWxsaWRzU2hhcmRGYWN0b3I6IGlzUmVjb3JkKHBhcmVudCkgPyAxIDogNjQsXHJcbiAgICBjb2xsZWN0aW9uTmFtZTogJycsXHJcbiAgICBpc1NpbmdsZSxcclxuICB9KTtcclxuXHJcbiAgaWYgKGNyZWF0ZURlZmF1bHRJbmRleCkge1xyXG4gICAgY29uc3QgZGVmYXVsdEluZGV4ID0gZ2V0TmV3SW5kZXhUZW1wbGF0ZShwYXJlbnQpO1xyXG4gICAgZGVmYXVsdEluZGV4Lm5hbWUgPSBgJHtuYW1lfV9pbmRleGA7XHJcbiAgICBkZWZhdWx0SW5kZXguYWxsb3dlZFJlY29yZE5vZGVJZHMucHVzaChub2RlLm5vZGVJZCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbm9kZTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXROZXdSZWNvcmRUZW1wbGF0ZSA9IChwYXJlbnQsIG5hbWUgPSAnJywgY3JlYXRlRGVmYXVsdEluZGV4ID0gdHJ1ZSkgPT4gX2dldE5ld1JlY29yZFRlbXBsYXRlKHBhcmVudCwgbmFtZSwgY3JlYXRlRGVmYXVsdEluZGV4LCBmYWxzZSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TmV3U2luZ2xlUmVjb3JkVGVtcGxhdGUgPSBwYXJlbnQgPT4gX2dldE5ld1JlY29yZFRlbXBsYXRlKHBhcmVudCwgJycsIGZhbHNlLCB0cnVlKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXROZXdJbmRleFRlbXBsYXRlID0gKHBhcmVudCwgdHlwZSA9ICdhbmNlc3RvcicpID0+IGNvbnN0cnVjdE5vZGUocGFyZW50LCB7XHJcbiAgbmFtZTogJycsXHJcbiAgdHlwZTogJ2luZGV4JyxcclxuICBtYXA6ICdyZXR1cm4gey4uLnJlY29yZH07JyxcclxuICBmaWx0ZXI6ICcnLFxyXG4gIGluZGV4VHlwZTogdHlwZSxcclxuICBnZXRTaGFyZE5hbWU6ICcnLFxyXG4gIGdldFNvcnRLZXk6ICdyZWNvcmQuaWQnLFxyXG4gIGFnZ3JlZ2F0ZUdyb3VwczogW10sXHJcbiAgYWxsb3dlZFJlY29yZE5vZGVJZHM6IFtdLFxyXG4gIG5vZGVJZDogZ2V0Tm9kZUlkKHBhcmVudCksXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldE5ld0FnZ3JlZ2F0ZUdyb3VwVGVtcGxhdGUgPSBpbmRleCA9PiBjb25zdHJ1Y3ROb2RlKGluZGV4LCB7XHJcbiAgbmFtZTogJycsXHJcbiAgdHlwZTogJ2FnZ3JlZ2F0ZUdyb3VwJyxcclxuICBncm91cEJ5OiAnJyxcclxuICBhZ2dyZWdhdGVzOiBbXSxcclxuICBjb25kaXRpb246ICcnLFxyXG4gIG5vZGVJZDogZ2V0Tm9kZUlkKGluZGV4KSxcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TmV3QWdncmVnYXRlVGVtcGxhdGUgPSAoc2V0KSA9PiB7XHJcbiAgY29uc3QgYWdncmVnYXRlZFZhbHVlID0ge1xyXG4gICAgbmFtZTogJycsXHJcbiAgICBhZ2dyZWdhdGVkVmFsdWU6ICcnLFxyXG4gIH07XHJcbiAgc2V0LmFnZ3JlZ2F0ZXMucHVzaChhZ2dyZWdhdGVkVmFsdWUpO1xyXG4gIHJldHVybiBhZ2dyZWdhdGVkVmFsdWU7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZ2V0TmV3Um9vdExldmVsLFxyXG4gIGdldE5ld1JlY29yZFRlbXBsYXRlLFxyXG4gIGdldE5ld0luZGV4VGVtcGxhdGUsXHJcbiAgY3JlYXRlTm9kZUVycm9ycyxcclxuICBjb25zdHJ1Y3RIaWVyYXJjaHksXHJcbiAgZ2V0TmV3QWdncmVnYXRlR3JvdXBUZW1wbGF0ZSxcclxuICBnZXROZXdBZ2dyZWdhdGVUZW1wbGF0ZSxcclxufTtcclxuIiwiaW1wb3J0IHtcclxuICBzb21lLCBtYXAsIGZpbHRlciwga2V5cywgaW5jbHVkZXMsXHJcbiAgY291bnRCeSwgZmxhdHRlbixcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQge1xyXG4gIGlzU29tZXRoaW5nLCAkLFxyXG4gIGlzTm9uRW1wdHlTdHJpbmcsXHJcbiAgaXNOb3RoaW5nT3JFbXB0eSxcclxuICBpc05vdGhpbmcsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgYWxsLCBnZXREZWZhdWx0T3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzJztcclxuaW1wb3J0IHsgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSB9IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcclxuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XHJcblxyXG5leHBvcnQgY29uc3QgZmllbGRFcnJvcnMgPSB7XHJcbiAgQWRkRmllbGRWYWxpZGF0aW9uRmFpbGVkOiAnQWRkIGZpZWxkIHZhbGlkYXRpb246ICcsXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgYWxsb3dlZFR5cGVzID0gKCkgPT4ga2V5cyhhbGwpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldE5ld0ZpZWxkID0gdHlwZSA9PiAoe1xyXG4gIG5hbWU6ICcnLCAvLyBob3cgZmllbGQgaXMgcmVmZXJlbmNlZCBpbnRlcm5hbGx5XHJcbiAgdHlwZSxcclxuICB0eXBlT3B0aW9uczogZ2V0RGVmYXVsdE9wdGlvbnModHlwZSksXHJcbiAgbGFiZWw6ICcnLCAvLyBob3cgZmllbGQgaXMgZGlzcGxheWVkXHJcbiAgZ2V0SW5pdGlhbFZhbHVlOiAnZGVmYXVsdCcsIC8vIGZ1bmN0aW9uIHRoYXQgZ2V0cyB2YWx1ZSB3aGVuIGluaXRpYWxseSBjcmVhdGVkXHJcbiAgZ2V0VW5kZWZpbmVkVmFsdWU6ICdkZWZhdWx0JywgLy8gZnVuY3Rpb24gdGhhdCBnZXRzIHZhbHVlIHdoZW4gZmllbGQgdW5kZWZpbmVkIG9uIHJlY29yZFxyXG59KTtcclxuXHJcbmNvbnN0IGZpZWxkUnVsZXMgPSBhbGxGaWVsZHMgPT4gW1xyXG4gIG1ha2VydWxlKCduYW1lJywgJ2ZpZWxkIG5hbWUgaXMgbm90IHNldCcsXHJcbiAgICBmID0+IGlzTm9uRW1wdHlTdHJpbmcoZi5uYW1lKSksXHJcbiAgbWFrZXJ1bGUoJ3R5cGUnLCAnZmllbGQgdHlwZSBpcyBub3Qgc2V0JyxcclxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLnR5cGUpKSxcclxuICBtYWtlcnVsZSgnbGFiZWwnLCAnZmllbGQgbGFiZWwgaXMgbm90IHNldCcsXHJcbiAgICBmID0+IGlzTm9uRW1wdHlTdHJpbmcoZi5sYWJlbCkpLFxyXG4gIG1ha2VydWxlKCdnZXRJbml0aWFsVmFsdWUnLCAnZ2V0SW5pdGlhbFZhbHVlIGZ1bmN0aW9uIGlzIG5vdCBzZXQnLFxyXG4gICAgZiA9PiBpc05vbkVtcHR5U3RyaW5nKGYuZ2V0SW5pdGlhbFZhbHVlKSksXHJcbiAgbWFrZXJ1bGUoJ2dldFVuZGVmaW5lZFZhbHVlJywgJ2dldFVuZGVmaW5lZFZhbHVlIGZ1bmN0aW9uIGlzIG5vdCBzZXQnLFxyXG4gICAgZiA9PiBpc05vbkVtcHR5U3RyaW5nKGYuZ2V0VW5kZWZpbmVkVmFsdWUpKSxcclxuICBtYWtlcnVsZSgnbmFtZScsICdmaWVsZCBuYW1lIGlzIGR1cGxpY2F0ZWQnLFxyXG4gICAgZiA9PiBpc05vdGhpbmdPckVtcHR5KGYubmFtZSlcclxuICAgICAgICAgICAgIHx8IGNvdW50QnkoJ25hbWUnKShhbGxGaWVsZHMpW2YubmFtZV0gPT09IDEpLFxyXG4gIG1ha2VydWxlKCd0eXBlJywgJ3R5cGUgaXMgdW5rbm93bicsXHJcbiAgICBmID0+IGlzTm90aGluZ09yRW1wdHkoZi50eXBlKVxyXG4gICAgICAgICAgICAgfHwgc29tZSh0ID0+IGYudHlwZSA9PT0gdCkoYWxsb3dlZFR5cGVzKCkpKSxcclxuXTtcclxuXHJcbmNvbnN0IHR5cGVPcHRpb25zUnVsZXMgPSAoZmllbGQpID0+IHtcclxuICBjb25zdCB0eXBlID0gYWxsW2ZpZWxkLnR5cGVdO1xyXG4gIGlmIChpc05vdGhpbmcodHlwZSkpIHJldHVybiBbXTtcclxuXHJcbiAgY29uc3QgZGVmID0gb3B0TmFtZSA9PiB0eXBlLm9wdGlvbkRlZmluaXRpb25zW29wdE5hbWVdO1xyXG5cclxuICByZXR1cm4gJChmaWVsZC50eXBlT3B0aW9ucywgW1xyXG4gICAga2V5cyxcclxuICAgIGZpbHRlcihvID0+IGlzU29tZXRoaW5nKGRlZihvKSlcclxuICAgICAgICAgICAgICAgICAgICAmJiBpc1NvbWV0aGluZyhkZWYobykuaXNWYWxpZCkpLFxyXG4gICAgbWFwKG8gPT4gbWFrZXJ1bGUoXHJcbiAgICAgIGB0eXBlT3B0aW9ucy4ke299YCxcclxuICAgICAgYCR7ZGVmKG8pLnJlcXVpcmVtZW50RGVzY3JpcHRpb259YCxcclxuICAgICAgZmllbGQgPT4gZGVmKG8pLmlzVmFsaWQoZmllbGQudHlwZU9wdGlvbnNbb10pLFxyXG4gICAgKSksXHJcbiAgXSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgdmFsaWRhdGVGaWVsZCA9IGFsbEZpZWxkcyA9PiAoZmllbGQpID0+IHtcclxuICBjb25zdCBldmVyeVNpbmdsZUZpZWxkID0gaW5jbHVkZXMoZmllbGQpKGFsbEZpZWxkcykgPyBhbGxGaWVsZHMgOiBbLi4uYWxsRmllbGRzLCBmaWVsZF07XHJcbiAgcmV0dXJuIGFwcGx5UnVsZVNldChbLi4uZmllbGRSdWxlcyhldmVyeVNpbmdsZUZpZWxkKSwgLi4udHlwZU9wdGlvbnNSdWxlcyhmaWVsZCldKShmaWVsZCk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBbGxGaWVsZHMgPSByZWNvcmROb2RlID0+ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcclxuICBtYXAodmFsaWRhdGVGaWVsZChyZWNvcmROb2RlLmZpZWxkcykpLFxyXG4gIGZsYXR0ZW4sXHJcbl0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGFkZEZpZWxkID0gKHJlY29yZFRlbXBsYXRlLCBmaWVsZCkgPT4ge1xyXG4gIGlmIChpc05vdGhpbmdPckVtcHR5KGZpZWxkLmxhYmVsKSkge1xyXG4gICAgZmllbGQubGFiZWwgPSBmaWVsZC5uYW1lO1xyXG4gIH1cclxuICBjb25zdCB2YWxpZGF0aW9uTWVzc2FnZXMgPSB2YWxpZGF0ZUZpZWxkKFsuLi5yZWNvcmRUZW1wbGF0ZS5maWVsZHMsIGZpZWxkXSkoZmllbGQpO1xyXG4gIGlmICh2YWxpZGF0aW9uTWVzc2FnZXMubGVuZ3RoID4gMCkge1xyXG4gICAgY29uc3QgZXJyb3JzID0gbWFwKG0gPT4gbS5lcnJvcikodmFsaWRhdGlvbk1lc3NhZ2VzKTtcclxuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYCR7ZmllbGRFcnJvcnMuQWRkRmllbGRWYWxpZGF0aW9uRmFpbGVkfSAke2Vycm9ycy5qb2luKCcsICcpfWApO1xyXG4gIH1cclxuICByZWNvcmRUZW1wbGF0ZS5maWVsZHMucHVzaChmaWVsZCk7XHJcbn07XHJcbiIsImltcG9ydCB7IGlzTnVtYmVyLCBpc0Jvb2xlYW4sIGRlZmF1bHRDYXNlIH0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgc3dpdGNoQ2FzZSB9IGZyb20gJy4uL2NvbW1vbic7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUgPSAoaW52YWxpZEZpZWxkcyxcclxuICBtZXNzYWdlV2hlbkludmFsaWQsXHJcbiAgZXhwcmVzc2lvbldoZW5WYWxpZCkgPT4gKHtcclxuICBpbnZhbGlkRmllbGRzLCBtZXNzYWdlV2hlbkludmFsaWQsIGV4cHJlc3Npb25XaGVuVmFsaWQsXHJcbn0pO1xyXG5cclxuY29uc3QgZ2V0U3RhdGljVmFsdWUgPSBzd2l0Y2hDYXNlKFxyXG4gIFtpc051bWJlciwgdiA9PiB2LnRvU3RyaW5nKCldLFxyXG4gIFtpc0Jvb2xlYW4sIHYgPT4gdi50b1N0cmluZygpXSxcclxuICBbZGVmYXVsdENhc2UsIHYgPT4gYCcke3Z9J2BdLFxyXG4pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbW1vblJlY29yZFZhbGlkYXRpb25SdWxlcyA9ICh7XHJcblxyXG4gIGZpZWxkTm90RW1wdHk6IGZpZWxkTmFtZSA9PiBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZShcclxuICAgIFtmaWVsZE5hbWVdLFxyXG4gICAgYCR7ZmllbGROYW1lfSBpcyBlbXB0eWAsXHJcbiAgICBgIV8uaXNFbXB0eShyZWNvcmRbJyR7ZmllbGROYW1lfSddKWAsXHJcbiAgKSxcclxuXHJcbiAgZmllbGRCZXR3ZWVuOiAoZmllbGROYW1lLCBtaW4sIG1heCkgPT4gZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUoXHJcbiAgICBbZmllbGROYW1lXSxcclxuICAgIGAke2ZpZWxkTmFtZX0gbXVzdCBiZSBiZXR3ZWVuICR7bWluLnRvU3RyaW5nKCl9IGFuZCAke21heC50b1N0cmluZygpfWAsXHJcbiAgICBgcmVjb3JkWycke2ZpZWxkTmFtZX0nXSA+PSAke2dldFN0YXRpY1ZhbHVlKG1pbil9ICYmICByZWNvcmRbJyR7ZmllbGROYW1lfSddIDw9ICR7Z2V0U3RhdGljVmFsdWUobWF4KX0gYCxcclxuICApLFxyXG5cclxuICBmaWVsZEdyZWF0ZXJUaGFuOiAoZmllbGROYW1lLCBtaW4sIG1heCkgPT4gZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUoXHJcbiAgICBbZmllbGROYW1lXSxcclxuICAgIGAke2ZpZWxkTmFtZX0gbXVzdCBiZSBncmVhdGVyIHRoYW4gJHttaW4udG9TdHJpbmcoKX0gYW5kICR7bWF4LnRvU3RyaW5nKCl9YCxcclxuICAgIGByZWNvcmRbJyR7ZmllbGROYW1lfSddID49ICR7Z2V0U3RhdGljVmFsdWUobWluKX0gIGAsXHJcbiAgKSxcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgYWRkUmVjb3JkVmFsaWRhdGlvblJ1bGUgPSByZWNvcmROb2RlID0+IHJ1bGUgPT4gcmVjb3JkTm9kZS52YWxpZGF0aW9uUnVsZXMucHVzaChydWxlKTtcclxuIiwiXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVUcmlnZ2VyID0gKCkgPT4gKHtcclxuICBhY3Rpb25OYW1lOiAnJyxcclxuICBldmVudE5hbWU6ICcnLFxyXG4gIC8vIGZ1bmN0aW9uLCBoYXMgYWNjZXNzIHRvIGV2ZW50IGNvbnRleHQsXHJcbiAgLy8gcmV0dXJucyBvYmplY3QgdGhhdCBpcyB1c2VkIGFzIHBhcmFtZXRlciB0byBhY3Rpb25cclxuICAvLyBvbmx5IHVzZWQgaWYgdHJpZ2dlcmVkIGJ5IGV2ZW50XHJcbiAgb3B0aW9uc0NyZWF0b3I6ICcnLFxyXG4gIC8vIGFjdGlvbiBydW5zIGlmIHRydWUsXHJcbiAgLy8gaGFzIGFjY2VzcyB0byBldmVudCBjb250ZXh0XHJcbiAgY29uZGl0aW9uOiAnJyxcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgY3JlYXRlQWN0aW9uID0gKCkgPT4gKHtcclxuICBuYW1lOiAnJyxcclxuICBiZWhhdmlvdXJTb3VyY2U6ICcnLFxyXG4gIC8vIG5hbWUgb2YgZnVuY3Rpb24gaW4gYWN0aW9uU291cmNlXHJcbiAgYmVoYXZpb3VyTmFtZTogJycsXHJcbiAgLy8gcGFyYW1ldGVyIHBhc3NlZCBpbnRvIGJlaGF2aW91ci5cclxuICAvLyBhbnkgb3RoZXIgcGFybXMgcGFzc2VkIGF0IHJ1bnRpbWUgZS5nLlxyXG4gIC8vIGJ5IHRyaWdnZXIsIG9yIG1hbnVhbGx5LCB3aWxsIGJlIG1lcmdlZCBpbnRvIHRoaXNcclxuICBpbml0aWFsT3B0aW9uczoge30sXHJcbn0pO1xyXG4iLCJpbXBvcnQgeyBmbGF0dGVuLCBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBpc0VtcHR5IH0gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgY29tcGlsZUNvZGUgfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XHJcbmltcG9ydCB7XHJcbiAgaXNOb25FbXB0eVN0cmluZywgXHJcbiAgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uLCAkLCBcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xyXG5cclxuY29uc3QgYWdncmVnYXRlUnVsZXMgPSBbXHJcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnY2hvb3NlIGEgbmFtZSBmb3IgdGhlIGFnZ3JlZ2F0ZScsXHJcbiAgICBhID0+IGlzTm9uRW1wdHlTdHJpbmcoYS5uYW1lKSksXHJcbiAgbWFrZXJ1bGUoJ2FnZ3JlZ2F0ZWRWYWx1ZScsICdhZ2dyZWdhdGVkVmFsdWUgZG9lcyBub3QgY29tcGlsZScsXHJcbiAgICBhID0+IGlzRW1wdHkoYS5hZ2dyZWdhdGVkVmFsdWUpXHJcbiAgICAgICAgICAgIHx8IGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbihcclxuICAgICAgICAgICAgICAoKSA9PiBjb21waWxlQ29kZShhLmFnZ3JlZ2F0ZWRWYWx1ZSksXHJcbiAgICAgICAgICAgICkpLFxyXG5dO1xyXG5cclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWdncmVnYXRlID0gYWdncmVnYXRlID0+IGFwcGx5UnVsZVNldChhZ2dyZWdhdGVSdWxlcykoYWdncmVnYXRlKTtcclxuXHJcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFsbEFnZ3JlZ2F0ZXMgPSBhbGwgPT4gJChhbGwsIFtcclxuICBtYXAodmFsaWRhdGVBZ2dyZWdhdGUpLFxyXG4gIGZsYXR0ZW4sXHJcbl0pO1xyXG4iLCJpbXBvcnQge1xyXG4gIGZpbHRlciwgdW5pb24sIGNvbnN0YW50LFxyXG4gIG1hcCwgZmxhdHRlbiwgZXZlcnksIHVuaXFCeSxcclxuICBzb21lLCBpbmNsdWRlcywgaXNFbXB0eSxcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBoYXMgfSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBjb21waWxlRXhwcmVzc2lvbiwgY29tcGlsZUNvZGUgfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XHJcbmltcG9ydCB7XHJcbiAgJCwgaXNTb21ldGhpbmcsIHN3aXRjaENhc2UsXHJcbiAgYW55VHJ1ZSwgaXNOb25FbXB0eUFycmF5LCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24sXHJcbiAgaXNOb25FbXB0eVN0cmluZywgZGVmYXVsdENhc2UsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHtcclxuICBpc1JlY29yZCwgaXNSb290LCBpc2FnZ3JlZ2F0ZUdyb3VwLFxyXG4gIGlzSW5kZXgsIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcclxufSBmcm9tICcuL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7IGV2ZW50c0xpc3QgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcclxuaW1wb3J0IHsgdmFsaWRhdGVBbGxGaWVsZHMgfSBmcm9tICcuL2ZpZWxkcyc7XHJcbmltcG9ydCB7XHJcbiAgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSwgc3RyaW5nTm90RW1wdHksXHJcbiAgdmFsaWRhdGlvbkVycm9yLFxyXG59IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcclxuaW1wb3J0IHsgaW5kZXhSdWxlU2V0IH0gZnJvbSAnLi9pbmRleGVzJztcclxuaW1wb3J0IHsgdmFsaWRhdGVBbGxBZ2dyZWdhdGVzIH0gZnJvbSAnLi92YWxpZGF0ZUFnZ3JlZ2F0ZSc7XHJcblxyXG5leHBvcnQgY29uc3QgcnVsZVNldCA9ICguLi5zZXRzKSA9PiBjb25zdGFudChmbGF0dGVuKFsuLi5zZXRzXSkpO1xyXG5cclxuY29uc3QgY29tbW9uUnVsZXMgPSBbXHJcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnbm9kZSBuYW1lIGlzIG5vdCBzZXQnLFxyXG4gICAgbm9kZSA9PiBzdHJpbmdOb3RFbXB0eShub2RlLm5hbWUpKSxcclxuICBtYWtlcnVsZSgndHlwZScsICdub2RlIHR5cGUgbm90IHJlY29nbmlzZWQnLFxyXG4gICAgYW55VHJ1ZShpc1JlY29yZCwgaXNSb290LCBpc0luZGV4LCBpc2FnZ3JlZ2F0ZUdyb3VwKSksXHJcbl07XHJcblxyXG5jb25zdCByZWNvcmRSdWxlcyA9IFtcclxuICBtYWtlcnVsZSgnZmllbGRzJywgJ25vIGZpZWxkcyBoYXZlIGJlZW4gYWRkZWQgdG8gdGhlIHJlY29yZCcsXHJcbiAgICBub2RlID0+IGlzTm9uRW1wdHlBcnJheShub2RlLmZpZWxkcykpLFxyXG4gIG1ha2VydWxlKCd2YWxpZGF0aW9uUnVsZXMnLCBcInZhbGlkYXRpb24gcnVsZSBpcyBtaXNzaW5nIGEgJ21lc3NhZ2VXaGVuVmFsaWQnIG1lbWJlclwiLFxyXG4gICAgbm9kZSA9PiBldmVyeShyID0+IGhhcyhyLCAnbWVzc2FnZVdoZW5JbnZhbGlkJykpKG5vZGUudmFsaWRhdGlvblJ1bGVzKSksXHJcbiAgbWFrZXJ1bGUoJ3ZhbGlkYXRpb25SdWxlcycsIFwidmFsaWRhdGlvbiBydWxlIGlzIG1pc3NpbmcgYSAnZXhwcmVzc2lvbldoZW5WYWxpZCcgbWVtYmVyXCIsXHJcbiAgICBub2RlID0+IGV2ZXJ5KHIgPT4gaGFzKHIsICdleHByZXNzaW9uV2hlblZhbGlkJykpKG5vZGUudmFsaWRhdGlvblJ1bGVzKSksXHJcbl07XHJcblxyXG5cclxuY29uc3QgYWdncmVnYXRlR3JvdXBSdWxlcyA9IFtcclxuICBtYWtlcnVsZSgnY29uZGl0aW9uJywgJ2NvbmRpdGlvbiBkb2VzIG5vdCBjb21waWxlJyxcclxuICAgIGEgPT4gaXNFbXB0eShhLmNvbmRpdGlvbilcclxuICAgICAgICAgICAgIHx8IGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbihcclxuICAgICAgICAgICAgICAgKCkgPT4gY29tcGlsZUV4cHJlc3Npb24oYS5jb25kaXRpb24pLFxyXG4gICAgICAgICAgICAgKSksXHJcbl07XHJcblxyXG5jb25zdCBnZXRSdWxlU2V0ID0gbm9kZSA9PiBzd2l0Y2hDYXNlKFxyXG5cclxuICBbaXNSZWNvcmQsIHJ1bGVTZXQoXHJcbiAgICBjb21tb25SdWxlcyxcclxuICAgIHJlY29yZFJ1bGVzLFxyXG4gICldLFxyXG5cclxuICBbaXNJbmRleCwgcnVsZVNldChcclxuICAgIGNvbW1vblJ1bGVzLFxyXG4gICAgaW5kZXhSdWxlU2V0LFxyXG4gICldLFxyXG5cclxuICBbaXNhZ2dyZWdhdGVHcm91cCwgcnVsZVNldChcclxuICAgIGNvbW1vblJ1bGVzLFxyXG4gICAgYWdncmVnYXRlR3JvdXBSdWxlcyxcclxuICApXSxcclxuXHJcbiAgW2RlZmF1bHRDYXNlLCBydWxlU2V0KGNvbW1vblJ1bGVzLCBbXSldLFxyXG4pKG5vZGUpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlTm9kZSA9IG5vZGUgPT4gYXBwbHlSdWxlU2V0KGdldFJ1bGVTZXQobm9kZSkpKG5vZGUpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWxsID0gKGFwcEhpZXJhcmNoeSkgPT4ge1xyXG4gIGNvbnN0IGZsYXR0ZW5lZCA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShcclxuICAgIGFwcEhpZXJhcmNoeSxcclxuICApO1xyXG5cclxuICBjb25zdCBkdXBsaWNhdGVOYW1lUnVsZSA9IG1ha2VydWxlKFxyXG4gICAgJ25hbWUnLCAnbm9kZSBuYW1lcyBtdXN0IGJlIHVuaXF1ZSB1bmRlciBzaGFyZWQgcGFyZW50JyxcclxuICAgIG4gPT4gZmlsdGVyKGYgPT4gZi5wYXJlbnQoKSA9PT0gbi5wYXJlbnQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICYmIGYubmFtZSA9PT0gbi5uYW1lKShmbGF0dGVuZWQpLmxlbmd0aCA9PT0gMSxcclxuICApO1xyXG5cclxuICBjb25zdCBkdXBsaWNhdGVOb2RlS2V5RXJyb3JzID0gJChmbGF0dGVuZWQsIFtcclxuICAgIG1hcChuID0+IGFwcGx5UnVsZVNldChbZHVwbGljYXRlTmFtZVJ1bGVdKShuKSksXHJcbiAgICBmaWx0ZXIoaXNTb21ldGhpbmcpLFxyXG4gICAgZmxhdHRlbixcclxuICBdKTtcclxuXHJcbiAgY29uc3QgZmllbGRFcnJvcnMgPSAkKGZsYXR0ZW5lZCwgW1xyXG4gICAgZmlsdGVyKGlzUmVjb3JkKSxcclxuICAgIG1hcCh2YWxpZGF0ZUFsbEZpZWxkcyksXHJcbiAgICBmbGF0dGVuLFxyXG4gIF0pO1xyXG5cclxuICBjb25zdCBhZ2dyZWdhdGVFcnJvcnMgPSAkKGZsYXR0ZW5lZCwgW1xyXG4gICAgZmlsdGVyKGlzYWdncmVnYXRlR3JvdXApLFxyXG4gICAgbWFwKHMgPT4gdmFsaWRhdGVBbGxBZ2dyZWdhdGVzKFxyXG4gICAgICBzLmFnZ3JlZ2F0ZXMsXHJcbiAgICApKSxcclxuICAgIGZsYXR0ZW4sXHJcbiAgXSk7XHJcblxyXG4gIHJldHVybiAkKGZsYXR0ZW5lZCwgW1xyXG4gICAgbWFwKHZhbGlkYXRlTm9kZSksXHJcbiAgICBmbGF0dGVuLFxyXG4gICAgdW5pb24oZHVwbGljYXRlTm9kZUtleUVycm9ycyksXHJcbiAgICB1bmlvbihmaWVsZEVycm9ycyksXHJcbiAgICB1bmlvbihhZ2dyZWdhdGVFcnJvcnMpLFxyXG4gIF0pO1xyXG59O1xyXG5cclxuY29uc3QgYWN0aW9uUnVsZXMgPSBbXHJcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnYWN0aW9uIG11c3QgaGF2ZSBhIG5hbWUnLFxyXG4gICAgYSA9PiBpc05vbkVtcHR5U3RyaW5nKGEubmFtZSkpLFxyXG4gIG1ha2VydWxlKCdiZWhhdmlvdXJOYW1lJywgJ211c3Qgc3VwcGx5IGEgYmVoYXZpb3VyIG5hbWUgdG8gdGhlIGFjdGlvbicsXHJcbiAgICBhID0+IGlzTm9uRW1wdHlTdHJpbmcoYS5iZWhhdmlvdXJOYW1lKSksXHJcbiAgbWFrZXJ1bGUoJ2JlaGF2aW91clNvdXJjZScsICdtdXN0IHN1cHBseSBhIGJlaGF2aW91ciBzb3VyY2UgZm9yIHRoZSBhY3Rpb24nLFxyXG4gICAgYSA9PiBpc05vbkVtcHR5U3RyaW5nKGEuYmVoYXZpb3VyU291cmNlKSksXHJcbl07XHJcblxyXG5jb25zdCBkdXBsaWNhdGVBY3Rpb25SdWxlID0gbWFrZXJ1bGUoJycsICdhY3Rpb24gbmFtZSBtdXN0IGJlIHVuaXF1ZScsICgpID0+IHt9KTtcclxuXHJcbmNvbnN0IHZhbGlkYXRlQWN0aW9uID0gYWN0aW9uID0+IGFwcGx5UnVsZVNldChhY3Rpb25SdWxlcykoYWN0aW9uKTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBY3Rpb25zID0gKGFsbEFjdGlvbnMpID0+IHtcclxuICBjb25zdCBkdXBsaWNhdGVBY3Rpb25zID0gJChhbGxBY3Rpb25zLCBbXHJcbiAgICBmaWx0ZXIoYSA9PiBmaWx0ZXIoYTIgPT4gYTIubmFtZSA9PT0gYS5uYW1lKShhbGxBY3Rpb25zKS5sZW5ndGggPiAxKSxcclxuICAgIG1hcChhID0+IHZhbGlkYXRpb25FcnJvcihkdXBsaWNhdGVBY3Rpb25SdWxlLCBhKSksXHJcbiAgXSk7XHJcblxyXG4gIGNvbnN0IGVycm9ycyA9ICQoYWxsQWN0aW9ucywgW1xyXG4gICAgbWFwKHZhbGlkYXRlQWN0aW9uKSxcclxuICAgIGZsYXR0ZW4sXHJcbiAgICB1bmlvbihkdXBsaWNhdGVBY3Rpb25zKSxcclxuICAgIHVuaXFCeSgnbmFtZScpLFxyXG4gIF0pO1xyXG5cclxuICByZXR1cm4gZXJyb3JzO1xyXG59O1xyXG5cclxuY29uc3QgdHJpZ2dlclJ1bGVzID0gYWN0aW9ucyA9PiAoW1xyXG4gIG1ha2VydWxlKCdhY3Rpb25OYW1lJywgJ211c3Qgc3BlY2lmeSBhbiBhY3Rpb24nLFxyXG4gICAgdCA9PiBpc05vbkVtcHR5U3RyaW5nKHQuYWN0aW9uTmFtZSkpLFxyXG4gIG1ha2VydWxlKCdldmVudE5hbWUnLCAnbXVzdCBzcGVjaWZ5IGFuZCBldmVudCcsXHJcbiAgICB0ID0+IGlzTm9uRW1wdHlTdHJpbmcodC5ldmVudE5hbWUpKSxcclxuICBtYWtlcnVsZSgnYWN0aW9uTmFtZScsICdzcGVjaWZpZWQgYWN0aW9uIG5vdCBzdXBwbGllZCcsXHJcbiAgICB0ID0+ICF0LmFjdGlvbk5hbWVcclxuICAgICAgICAgICAgIHx8IHNvbWUoYSA9PiBhLm5hbWUgPT09IHQuYWN0aW9uTmFtZSkoYWN0aW9ucykpLFxyXG4gIG1ha2VydWxlKCdldmVudE5hbWUnLCAnaW52YWxpZCBFdmVudCBOYW1lJyxcclxuICAgIHQgPT4gIXQuZXZlbnROYW1lXHJcbiAgICAgICAgICAgICB8fCBpbmNsdWRlcyh0LmV2ZW50TmFtZSkoZXZlbnRzTGlzdCkpLFxyXG4gIG1ha2VydWxlKCdvcHRpb25zQ3JlYXRvcicsICdPcHRpb25zIENyZWF0b3IgZG9lcyBub3QgY29tcGlsZSAtIGNoZWNrIHlvdXIgZXhwcmVzc2lvbicsXHJcbiAgICAodCkgPT4ge1xyXG4gICAgICBpZiAoIXQub3B0aW9uc0NyZWF0b3IpIHJldHVybiB0cnVlO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbXBpbGVDb2RlKHQub3B0aW9uc0NyZWF0b3IpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9IGNhdGNoIChfKSB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgfSksXHJcbiAgbWFrZXJ1bGUoJ2NvbmRpdGlvbicsICdUcmlnZ2VyIGNvbmRpdGlvbiBkb2VzIG5vdCBjb21waWxlIC0gY2hlY2sgeW91ciBleHByZXNzaW9uJyxcclxuICAgICh0KSA9PiB7XHJcbiAgICAgIGlmICghdC5jb25kaXRpb24pIHJldHVybiB0cnVlO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbXBpbGVFeHByZXNzaW9uKHQuY29uZGl0aW9uKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfSBjYXRjaCAoXykgeyByZXR1cm4gZmFsc2U7IH1cclxuICAgIH0pLFxyXG5dKTtcclxuXHJcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVRyaWdnZXIgPSAodHJpZ2dlciwgYWxsQWN0aW9ucykgPT4ge1xyXG4gIGNvbnN0IGVycm9ycyA9IGFwcGx5UnVsZVNldCh0cmlnZ2VyUnVsZXMoYWxsQWN0aW9ucykpKHRyaWdnZXIpO1xyXG5cclxuICByZXR1cm4gZXJyb3JzO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVHJpZ2dlcnMgPSAodHJpZ2dlcnMsIGFsbEFjdGlvbnMpID0+ICQodHJpZ2dlcnMsIFtcclxuICBtYXAodCA9PiB2YWxpZGF0ZVRyaWdnZXIodCwgYWxsQWN0aW9ucykpLFxyXG4gIGZsYXR0ZW4sXHJcbl0pO1xyXG4iLCJpbXBvcnQgeyBhcHBEZWZpbml0aW9uRmlsZSB9IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IGNvbnN0cnVjdEhpZXJhcmNoeSB9IGZyb20gJy4vY3JlYXRlTm9kZXMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbiA9IGRhdGFzdG9yZSA9PiBhc3luYyAoKSA9PiB7XHJcbiAgY29uc3QgZXhpc3RzID0gYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhhcHBEZWZpbml0aW9uRmlsZSk7XHJcblxyXG4gIGlmICghZXhpc3RzKSB0aHJvdyBuZXcgRXJyb3IoJ0FwcGxpY2F0aW9uIGRlZmluaXRpb24gZG9lcyBub3QgZXhpc3QnKTtcclxuXHJcbiAgY29uc3QgYXBwRGVmaW5pdGlvbiA9IGF3YWl0IGRhdGFzdG9yZS5sb2FkSnNvbihhcHBEZWZpbml0aW9uRmlsZSk7XHJcbiAgYXBwRGVmaW5pdGlvbi5oaWVyYXJjaHkgPSBjb25zdHJ1Y3RIaWVyYXJjaHkoXHJcbiAgICBhcHBEZWZpbml0aW9uLmhpZXJhcmNoeSxcclxuICApO1xyXG4gIHJldHVybiBhcHBEZWZpbml0aW9uO1xyXG59O1xyXG4iLCJpbXBvcnQgeyBqb2luIH0gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xyXG5pbXBvcnQgeyBhcHBEZWZpbml0aW9uRmlsZSB9IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IHZhbGlkYXRlQWxsIH0gZnJvbSAnLi92YWxpZGF0ZSc7XHJcbmltcG9ydCB7IGFwaVdyYXBwZXIgfSBmcm9tICcuLi9jb21tb24vYXBpV3JhcHBlcic7XHJcbmltcG9ydCB7IGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSA9IGFwcCA9PiBhc3luYyBoaWVyYXJjaHkgPT4gYXBpV3JhcHBlcihcclxuICBhcHAsXHJcbiAgZXZlbnRzLnRlbXBsYXRlQXBpLnNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSxcclxuICBwZXJtaXNzaW9uLndyaXRlVGVtcGxhdGVzLmlzQXV0aG9yaXplZCxcclxuICB7IGhpZXJhcmNoeSB9LFxyXG4gIF9zYXZlQXBwbGljYXRpb25IaWVyYXJjaHksIGFwcC5kYXRhc3RvcmUsIGhpZXJhcmNoeSxcclxuKTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgX3NhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSA9IGFzeW5jIChkYXRhc3RvcmUsIGhpZXJhcmNoeSkgPT4ge1xyXG4gIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSBhd2FpdCB2YWxpZGF0ZUFsbChoaWVyYXJjaHkpO1xyXG4gIGlmICh2YWxpZGF0aW9uRXJyb3JzLmxlbmd0aCA+IDApIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgSGllcmFyY2h5IGlzIGludmFsaWQ6ICR7am9pbihcclxuICAgICAgdmFsaWRhdGlvbkVycm9ycy5tYXAoZSA9PiBgJHtlLml0ZW0ubm9kZUtleSA/IGUuaXRlbS5ub2RlS2V5KCkgOiAnJ30gOiAke2UuZXJyb3J9YCksXHJcbiAgICAgICcsJyxcclxuICAgICl9YCk7XHJcbiAgfVxyXG5cclxuICBpZiAoYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhhcHBEZWZpbml0aW9uRmlsZSkpIHtcclxuICAgIGNvbnN0IGFwcERlZmluaXRpb24gPSBhd2FpdCBkYXRhc3RvcmUubG9hZEpzb24oYXBwRGVmaW5pdGlvbkZpbGUpO1xyXG4gICAgYXBwRGVmaW5pdGlvbi5oaWVyYXJjaHkgPSBoaWVyYXJjaHk7XHJcbiAgICBhd2FpdCBkYXRhc3RvcmUudXBkYXRlSnNvbihhcHBEZWZpbml0aW9uRmlsZSwgYXBwRGVmaW5pdGlvbik7XHJcbiAgfSBlbHNlIHtcclxuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoJy8uY29uZmlnJyk7XHJcbiAgICBjb25zdCBhcHBEZWZpbml0aW9uID0geyBhY3Rpb25zOiBbXSwgdHJpZ2dlcnM6IFtdLCBoaWVyYXJjaHkgfTtcclxuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKGFwcERlZmluaXRpb25GaWxlLCBhcHBEZWZpbml0aW9uKTtcclxuICB9XHJcbn07XHJcbiIsImltcG9ydCB7IGpvaW4gfSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBhcHBEZWZpbml0aW9uRmlsZSB9IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IHZhbGlkYXRlVHJpZ2dlcnMsIHZhbGlkYXRlQWN0aW9ucyB9IGZyb20gJy4vdmFsaWRhdGUnO1xyXG5pbXBvcnQgeyBhcGlXcmFwcGVyIH0gZnJvbSAnLi4vY29tbW9uL2FwaVdyYXBwZXInO1xyXG5pbXBvcnQgeyBldmVudHMgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcclxuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xyXG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcclxuXHJcbmV4cG9ydCBjb25zdCBzYXZlQWN0aW9uc0FuZFRyaWdnZXJzID0gYXBwID0+IGFzeW5jIChhY3Rpb25zLCB0cmlnZ2VycykgPT4gYXBpV3JhcHBlcihcclxuICBhcHAsXHJcbiAgZXZlbnRzLnRlbXBsYXRlQXBpLnNhdmVBY3Rpb25zQW5kVHJpZ2dlcnMsXHJcbiAgcGVybWlzc2lvbi53cml0ZVRlbXBsYXRlcy5pc0F1dGhvcml6ZWQsXHJcbiAgeyBhY3Rpb25zLCB0cmlnZ2VycyB9LFxyXG4gIF9zYXZlQWN0aW9uc0FuZFRyaWdnZXJzLCBhcHAuZGF0YXN0b3JlLCBhY3Rpb25zLCB0cmlnZ2VycyxcclxuKTtcclxuXHJcbmV4cG9ydCBjb25zdCBfc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycyA9IGFzeW5jIChkYXRhc3RvcmUsIGFjdGlvbnMsIHRyaWdnZXJzKSA9PiB7XHJcbiAgaWYgKGF3YWl0IGRhdGFzdG9yZS5leGlzdHMoYXBwRGVmaW5pdGlvbkZpbGUpKSB7XHJcbiAgICBjb25zdCBhcHBEZWZpbml0aW9uID0gYXdhaXQgZGF0YXN0b3JlLmxvYWRKc29uKGFwcERlZmluaXRpb25GaWxlKTtcclxuICAgIGFwcERlZmluaXRpb24uYWN0aW9ucyA9IGFjdGlvbnM7XHJcbiAgICBhcHBEZWZpbml0aW9uLnRyaWdnZXJzID0gdHJpZ2dlcnM7XHJcblxyXG4gICAgY29uc3QgYWN0aW9uVmFsaWRFcnJzID0gbWFwKGUgPT4gZS5lcnJvcikodmFsaWRhdGVBY3Rpb25zKGFjdGlvbnMpKTtcclxuXHJcbiAgICBpZiAoYWN0aW9uVmFsaWRFcnJzLmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgQWN0aW9ucyBhcmUgaW52YWxpZDogJHtqb2luKGFjdGlvblZhbGlkRXJycywgJywgJyl9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdHJpZ2dlclZhbGlkRXJycyA9IG1hcChlID0+IGUuZXJyb3IpKHZhbGlkYXRlVHJpZ2dlcnModHJpZ2dlcnMsIGFjdGlvbnMpKTtcclxuXHJcbiAgICBpZiAodHJpZ2dlclZhbGlkRXJycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYFRyaWdnZXJzIGFyZSBpbnZhbGlkOiAke2pvaW4odHJpZ2dlclZhbGlkRXJycywgJywgJyl9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXdhaXQgZGF0YXN0b3JlLnVwZGF0ZUpzb24oYXBwRGVmaW5pdGlvbkZpbGUsIGFwcERlZmluaXRpb24pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdDYW5ub3Qgc2F2ZSBhY3Rpb25zOiBBcHBsaWNhdGlvbiBkZWZpbml0aW9uIGRvZXMgbm90IGV4aXN0Jyk7XHJcbiAgfVxyXG59O1xyXG4iLCJcclxuZXhwb3J0IGNvbnN0IGdldEJlaGF2aW91clNvdXJjZXMgPSBhc3luYyAoZGF0YXN0b3JlKSA9PiB7XHJcbiAgICBhd2FpdCBkYXRhc3RvcmUubG9hZEZpbGUoJy8uY29uZmlnL2JlaGF2aW91clNvdXJjZXMuanMnKTtcclxufTtcclxuIiwiaW1wb3J0IHtcclxuICBnZXROZXdSb290TGV2ZWwsXHJcbiAgZ2V0TmV3UmVjb3JkVGVtcGxhdGUsIGdldE5ld0luZGV4VGVtcGxhdGUsXHJcbiAgY3JlYXRlTm9kZUVycm9ycywgY29uc3RydWN0SGllcmFyY2h5LFxyXG4gIGdldE5ld0FnZ3JlZ2F0ZUdyb3VwVGVtcGxhdGUsIGdldE5ld1NpbmdsZVJlY29yZFRlbXBsYXRlLFxyXG4gIGdldE5ld0FnZ3JlZ2F0ZVRlbXBsYXRlLCBjb25zdHJ1Y3ROb2RlLFxyXG59XHJcbiAgZnJvbSAnLi9jcmVhdGVOb2Rlcyc7XHJcbmltcG9ydCB7XHJcbiAgZ2V0TmV3RmllbGQsIHZhbGlkYXRlRmllbGQsXHJcbiAgYWRkRmllbGQsIGZpZWxkRXJyb3JzLFxyXG59IGZyb20gJy4vZmllbGRzJztcclxuaW1wb3J0IHtcclxuICBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZSwgY29tbW9uUmVjb3JkVmFsaWRhdGlvblJ1bGVzLFxyXG4gIGFkZFJlY29yZFZhbGlkYXRpb25SdWxlLFxyXG59IGZyb20gJy4vcmVjb3JkVmFsaWRhdGlvblJ1bGVzJztcclxuaW1wb3J0IHsgY3JlYXRlQWN0aW9uLCBjcmVhdGVUcmlnZ2VyIH0gZnJvbSAnLi9jcmVhdGVBY3Rpb25zJztcclxuaW1wb3J0IHtcclxuICB2YWxpZGF0ZVRyaWdnZXJzLCB2YWxpZGF0ZVRyaWdnZXIsIHZhbGlkYXRlTm9kZSxcclxuICB2YWxpZGF0ZUFjdGlvbnMsIHZhbGlkYXRlQWxsLFxyXG59IGZyb20gJy4vdmFsaWRhdGUnO1xyXG5pbXBvcnQgeyBnZXRBcHBsaWNhdGlvbkRlZmluaXRpb24gfSBmcm9tICcuL2dldEFwcGxpY2F0aW9uRGVmaW5pdGlvbic7XHJcbmltcG9ydCB7IHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSB9IGZyb20gJy4vc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5JztcclxuaW1wb3J0IHsgc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycyB9IGZyb20gJy4vc2F2ZUFjdGlvbnNBbmRUcmlnZ2Vycyc7XHJcbmltcG9ydCB7IGFsbCB9IGZyb20gJy4uL3R5cGVzJztcclxuaW1wb3J0IHsgZ2V0QmVoYXZpb3VyU291cmNlcyB9IGZyb20gXCIuL2dldEJlaGF2aW91clNvdXJjZXNcIjtcclxuXHJcbmNvbnN0IGFwaSA9IGFwcCA9PiAoe1xyXG5cclxuICBnZXRBcHBsaWNhdGlvbkRlZmluaXRpb246IGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbihhcHAuZGF0YXN0b3JlKSxcclxuICBzYXZlQXBwbGljYXRpb25IaWVyYXJjaHk6IHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeShhcHApLFxyXG4gIHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnM6IHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnMoYXBwKSxcclxuICBnZXRCZWhhdmlvdXJTb3VyY2VzOiAoKSA9PiBnZXRCZWhhdmlvdXJTb3VyY2VzKGFwcC5kYXRhc3RvcmUpLFxyXG4gIGdldE5ld1Jvb3RMZXZlbCxcclxuICBjb25zdHJ1Y3ROb2RlLFxyXG4gIGdldE5ld0luZGV4VGVtcGxhdGUsXHJcbiAgZ2V0TmV3UmVjb3JkVGVtcGxhdGUsXHJcbiAgZ2V0TmV3RmllbGQsXHJcbiAgdmFsaWRhdGVGaWVsZCxcclxuICBhZGRGaWVsZCxcclxuICBmaWVsZEVycm9ycyxcclxuICBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZSxcclxuICBjb21tb25SZWNvcmRWYWxpZGF0aW9uUnVsZXMsXHJcbiAgYWRkUmVjb3JkVmFsaWRhdGlvblJ1bGUsXHJcbiAgY3JlYXRlQWN0aW9uLFxyXG4gIGNyZWF0ZVRyaWdnZXIsXHJcbiAgdmFsaWRhdGVBY3Rpb25zLFxyXG4gIHZhbGlkYXRlVHJpZ2dlcixcclxuICBnZXROZXdBZ2dyZWdhdGVHcm91cFRlbXBsYXRlLFxyXG4gIGdldE5ld0FnZ3JlZ2F0ZVRlbXBsYXRlLFxyXG4gIGNvbnN0cnVjdEhpZXJhcmNoeSxcclxuICBnZXROZXdTaW5nbGVSZWNvcmRUZW1wbGF0ZSxcclxuICBhbGxUeXBlczogYWxsLFxyXG4gIHZhbGlkYXRlTm9kZSxcclxuICB2YWxpZGF0ZUFsbCxcclxuICB2YWxpZGF0ZVRyaWdnZXJzLFxyXG59KTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgZ2V0VGVtcGxhdGVBcGkgPSBhcHAgPT4gYXBpKGFwcCk7XHJcblxyXG5leHBvcnQgY29uc3QgZXJyb3JzID0gY3JlYXRlTm9kZUVycm9ycztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldFRlbXBsYXRlQXBpO1xyXG4iLCJpbXBvcnQgeyBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQge1xyXG4gIFVTRVJTX0xJU1RfRklMRSxcclxuICBzdHJpcFVzZXJPZlNlbnNpdGl2ZVN0dWZmLFxyXG59IGZyb20gJy4vYXV0aENvbW1vbic7XHJcbmltcG9ydCB7ICQsIGFwaVdyYXBwZXIsIGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRVc2VycyA9IGFwcCA9PiBhc3luYyAoKSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMuYXV0aEFwaS5nZXRVc2VycyxcclxuICBwZXJtaXNzaW9uLmxpc3RVc2Vycy5pc0F1dGhvcml6ZWQsXHJcbiAge30sXHJcbiAgX2dldFVzZXJzLCBhcHAsXHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgX2dldFVzZXJzID0gYXN5bmMgYXBwID0+ICQoYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihVU0VSU19MSVNUX0ZJTEUpLCBbXHJcbiAgbWFwKHN0cmlwVXNlck9mU2Vuc2l0aXZlU3R1ZmYpLFxyXG5dKTtcclxuIiwiaW1wb3J0IHsgQUNDRVNTX0xFVkVMU19GSUxFIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcclxuaW1wb3J0IHsgYXBpV3JhcHBlciwgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGxvYWRBY2Nlc3NMZXZlbHMgPSBhcHAgPT4gYXN5bmMgKCkgPT4gYXBpV3JhcHBlcihcclxuICBhcHAsXHJcbiAgZXZlbnRzLmF1dGhBcGkubG9hZEFjY2Vzc0xldmVscyxcclxuICBwZXJtaXNzaW9uLmxpc3RBY2Nlc3NMZXZlbHMuaXNBdXRob3JpemVkLFxyXG4gIHt9LFxyXG4gIF9sb2FkQWNjZXNzTGV2ZWxzLCBhcHAsXHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgX2xvYWRBY2Nlc3NMZXZlbHMgPSBhc3luYyBhcHAgPT4gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihBQ0NFU1NfTEVWRUxTX0ZJTEUpO1xyXG4iLCJpbXBvcnQge1xyXG4gIGZpbmQsIGZpbHRlciwgc29tZSxcclxuICBtYXAsIGZsYXR0ZW4sXHJcbn0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcclxuaW1wb3J0IHsgX2dldFVzZXJzIH0gZnJvbSAnLi9nZXRVc2Vycyc7XHJcbmltcG9ydCB7XHJcbiAgZ2V0VXNlckJ5TmFtZSwgdXNlckF1dGhGaWxlLFxyXG4gIHBhcnNlVGVtcG9yYXJ5Q29kZSxcclxufSBmcm9tICcuL2F1dGhDb21tb24nO1xyXG5pbXBvcnQgeyBfbG9hZEFjY2Vzc0xldmVscyB9IGZyb20gJy4vbG9hZEFjY2Vzc0xldmVscyc7XHJcbmltcG9ydCB7XHJcbiAgaXNOb3RoaW5nT3JFbXB0eSwgJCwgYXBpV3JhcHBlciwgZXZlbnRzLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IGFsd2F5c0F1dGhvcml6ZWQgfSBmcm9tICcuL3Blcm1pc3Npb25zJztcclxuXHJcbmNvbnN0IGR1bW15SGFzaCA9ICckYXJnb24yaSR2PTE5JG09NDA5Nix0PTMscD0xJFVaUm80MDlVWUJHakhKUzNDVjZVeHckclU4NHFVcVBlT1JGektZbVlZMGNlQkxEYVBPK0pXU0g0UGZOaUtYZklLayc7XHJcblxyXG5leHBvcnQgY29uc3QgYXV0aGVudGljYXRlID0gYXBwID0+IGFzeW5jICh1c2VybmFtZSwgcGFzc3dvcmQpID0+IGFwaVdyYXBwZXIoXHJcbiAgYXBwLFxyXG4gIGV2ZW50cy5hdXRoQXBpLmF1dGhlbnRpY2F0ZSxcclxuICBhbHdheXNBdXRob3JpemVkLFxyXG4gIHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0sXHJcbiAgX2F1dGhlbnRpY2F0ZSwgYXBwLCB1c2VybmFtZSwgcGFzc3dvcmQsXHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgX2F1dGhlbnRpY2F0ZSA9IGFzeW5jIChhcHAsIHVzZXJuYW1lLCBwYXNzd29yZCkgPT4ge1xyXG4gIGlmIChpc05vdGhpbmdPckVtcHR5KHVzZXJuYW1lKSB8fCBpc05vdGhpbmdPckVtcHR5KHBhc3N3b3JkKSkgeyByZXR1cm4gbnVsbDsgfVxyXG5cclxuICBjb25zdCBhbGxVc2VycyA9IGF3YWl0IF9nZXRVc2VycyhhcHApO1xyXG4gIGxldCB1c2VyID0gZ2V0VXNlckJ5TmFtZShcclxuICAgIGFsbFVzZXJzLFxyXG4gICAgdXNlcm5hbWUsXHJcbiAgKTtcclxuXHJcbiAgY29uc3Qgbm90QVVzZXIgPSAnbm90LWEtdXNlcic7XHJcbiAgLy8gY29udGludWUgd2l0aCBub24tdXNlciAtIHNvIHRpbWUgdG8gdmVyaWZ5IHJlbWFpbnMgY29uc2lzdGVudFxyXG4gIC8vIHdpdGggdmVyaWZpY2F0aW9uIG9mIGEgdmFsaWQgdXNlclxyXG4gIGlmICghdXNlciB8fCAhdXNlci5lbmFibGVkKSB7IHVzZXIgPSBub3RBVXNlcjsgfVxyXG5cclxuICBsZXQgdXNlckF1dGg7XHJcbiAgdHJ5IHtcclxuICAgIHVzZXJBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcclxuICAgICAgdXNlckF1dGhGaWxlKHVzZXJuYW1lKSxcclxuICAgICk7XHJcbiAgfSBjYXRjaCAoXykge1xyXG4gICAgdXNlckF1dGggPSB7IGFjY2Vzc0xldmVsczogW10sIHBhc3N3b3JkSGFzaDogZHVtbXlIYXNoIH07XHJcbiAgfVxyXG5cclxuICBjb25zdCBwZXJtaXNzaW9ucyA9IGF3YWl0IGJ1aWxkVXNlclBlcm1pc3Npb25zKGFwcCwgdXNlci5hY2Nlc3NMZXZlbHMpO1xyXG5cclxuICBjb25zdCB2ZXJpZmllZCA9IGF3YWl0IGFwcC5jcnlwdG8udmVyaWZ5KFxyXG4gICAgdXNlckF1dGgucGFzc3dvcmRIYXNoLFxyXG4gICAgcGFzc3dvcmQsXHJcbiAgKTtcclxuXHJcbiAgaWYgKHVzZXIgPT09IG5vdEFVc2VyKSB7IHJldHVybiBudWxsOyB9XHJcblxyXG4gIHJldHVybiB2ZXJpZmllZFxyXG4gICAgPyB7XHJcbiAgICAgIC4uLnVzZXIsIHBlcm1pc3Npb25zLCB0ZW1wOiBmYWxzZSwgaXNVc2VyOiB0cnVlLFxyXG4gICAgfVxyXG4gICAgOiBudWxsO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGF1dGhlbnRpY2F0ZVRlbXBvcmFyeUFjY2VzcyA9IGFwcCA9PiBhc3luYyAodGVtcEFjY2Vzc0NvZGUpID0+IHtcclxuICBpZiAoaXNOb3RoaW5nT3JFbXB0eSh0ZW1wQWNjZXNzQ29kZSkpIHsgcmV0dXJuIG51bGw7IH1cclxuXHJcbiAgY29uc3QgdGVtcCA9IHBhcnNlVGVtcG9yYXJ5Q29kZSh0ZW1wQWNjZXNzQ29kZSk7XHJcbiAgbGV0IHVzZXIgPSAkKGF3YWl0IF9nZXRVc2VycyhhcHApLCBbXHJcbiAgICBmaW5kKHUgPT4gdS50ZW1wb3JhcnlBY2Nlc3NJZCA9PT0gdGVtcC5pZCksXHJcbiAgXSk7XHJcblxyXG4gIGNvbnN0IG5vdEFVc2VyID0gJ25vdC1hLXVzZXInO1xyXG4gIGlmICghdXNlciB8fCAhdXNlci5lbmFibGVkKSB7IHVzZXIgPSBub3RBVXNlcjsgfVxyXG5cclxuICBsZXQgdXNlckF1dGg7XHJcbiAgdHJ5IHtcclxuICAgIHVzZXJBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcclxuICAgICAgdXNlckF1dGhGaWxlKHVzZXIubmFtZSksXHJcbiAgICApO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIHVzZXJBdXRoID0ge1xyXG4gICAgICB0ZW1wb3JhcnlBY2Nlc3NIYXNoOiBkdW1teUhhc2gsXHJcbiAgICAgIHRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoOiAoYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpICsgMTAwMDApLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGlmICh1c2VyQXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA8IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKSkgeyB1c2VyID0gbm90QVVzZXI7IH1cclxuXHJcbiAgY29uc3QgdGVtcENvZGUgPSAhdGVtcC5jb2RlID8gZ2VuZXJhdGUoKSA6IHRlbXAuY29kZTtcclxuICBjb25zdCB2ZXJpZmllZCA9IGF3YWl0IGFwcC5jcnlwdG8udmVyaWZ5KFxyXG4gICAgdXNlckF1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaCxcclxuICAgIHRlbXBDb2RlLFxyXG4gICk7XHJcblxyXG4gIGlmICh1c2VyID09PSBub3RBVXNlcikgeyByZXR1cm4gbnVsbDsgfVxyXG5cclxuICByZXR1cm4gdmVyaWZpZWRcclxuICAgID8ge1xyXG4gICAgICAuLi51c2VyLFxyXG4gICAgICBwZXJtaXNzaW9uczogW10sXHJcbiAgICAgIHRlbXA6IHRydWUsXHJcbiAgICAgIGlzVXNlcjogdHJ1ZSxcclxuICAgIH1cclxuICAgIDogbnVsbDtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBidWlsZFVzZXJQZXJtaXNzaW9ucyA9IGFzeW5jIChhcHAsIHVzZXJBY2Nlc3NMZXZlbHMpID0+IHtcclxuICBjb25zdCBhbGxBY2Nlc3NMZXZlbHMgPSBhd2FpdCBfbG9hZEFjY2Vzc0xldmVscyhhcHApO1xyXG5cclxuICByZXR1cm4gJChhbGxBY2Nlc3NMZXZlbHMubGV2ZWxzLCBbXHJcbiAgICBmaWx0ZXIobCA9PiBzb21lKHVhID0+IGwubmFtZSA9PT0gdWEpKHVzZXJBY2Nlc3NMZXZlbHMpKSxcclxuICAgIG1hcChsID0+IGwucGVybWlzc2lvbnMpLFxyXG4gICAgZmxhdHRlbixcclxuICBdKTtcclxufTtcclxuIiwiaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcclxuaW1wb3J0IHtcclxuICB0ZW1wQ29kZUV4cGlyeUxlbmd0aCwgVVNFUlNfTE9DS19GSUxFLFxyXG4gIFVTRVJTX0xJU1RfRklMRSwgdXNlckF1dGhGaWxlLFxyXG4gIGdldFVzZXJCeU5hbWUsXHJcbn0gZnJvbSAnLi9hdXRoQ29tbW9uJztcclxuaW1wb3J0IHtcclxuICBnZXRMb2NrLCBpc05vbG9jayxcclxuICByZWxlYXNlTG9jayxcclxufSBmcm9tICcuLi9jb21tb24vbG9jayc7XHJcbmltcG9ydCB7IGFwaVdyYXBwZXIsIGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IGFsd2F5c0F1dGhvcml6ZWQgfSBmcm9tICcuL3Blcm1pc3Npb25zJztcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVUZW1wb3JhcnlBY2Nlc3MgPSBhcHAgPT4gYXN5bmMgdXNlck5hbWUgPT4gYXBpV3JhcHBlcihcclxuICBhcHAsXHJcbiAgZXZlbnRzLmF1dGhBcGkuY3JlYXRlVGVtcG9yYXJ5QWNjZXNzLFxyXG4gIGFsd2F5c0F1dGhvcml6ZWQsXHJcbiAgeyB1c2VyTmFtZSB9LFxyXG4gIF9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MsIGFwcCwgdXNlck5hbWUsXHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgX2NyZWF0ZVRlbXBvcmFyeUFjY2VzcyA9IGFzeW5jIChhcHAsIHVzZXJOYW1lKSA9PiB7XHJcbiAgY29uc3QgdGVtcENvZGUgPSBhd2FpdCBnZXRUZW1wb3JhcnlDb2RlKGFwcCk7XHJcblxyXG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRMb2NrKFxyXG4gICAgYXBwLCBVU0VSU19MT0NLX0ZJTEUsIDEwMDAsIDIsXHJcbiAgKTtcclxuXHJcbiAgaWYgKGlzTm9sb2NrKGxvY2spKSB7IHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGNyZWF0ZSB0ZW1wb3JhcnkgYWNjZXNzLCBjb3VsZCBub3QgZ2V0IGxvY2sgLSB0cnkgYWdhaW4nKTsgfVxyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSk7XHJcblxyXG4gICAgY29uc3QgdXNlciA9IGdldFVzZXJCeU5hbWUodXNlcnMsIHVzZXJOYW1lKTtcclxuICAgIHVzZXIudGVtcG9yYXJ5QWNjZXNzSWQgPSB0ZW1wQ29kZS50ZW1wb3JhcnlBY2Nlc3NJZDtcclxuXHJcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXHJcbiAgICAgIFVTRVJTX0xJU1RfRklMRSxcclxuICAgICAgdXNlcnMsXHJcbiAgICApO1xyXG4gIH0gZmluYWxseSB7XHJcbiAgICBhd2FpdCByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgdXNlckF1dGggPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxyXG4gICAgdXNlckF1dGhGaWxlKHVzZXJOYW1lKSxcclxuICApO1xyXG4gIHVzZXJBdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2ggPSB0ZW1wQ29kZS50ZW1wb3JhcnlBY2Nlc3NIYXNoO1xyXG5cclxuICB1c2VyQXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA9IHRlbXBDb2RlLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoO1xyXG5cclxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXHJcbiAgICB1c2VyQXV0aEZpbGUodXNlck5hbWUpLFxyXG4gICAgdXNlckF1dGgsXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIHRlbXBDb2RlLnRlbXBDb2RlO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFRlbXBvcmFyeUNvZGUgPSBhc3luYyAoYXBwKSA9PiB7XHJcbiAgY29uc3QgdGVtcENvZGUgPSBnZW5lcmF0ZSgpXHJcbiAgICAgICAgKyBnZW5lcmF0ZSgpXHJcbiAgICAgICAgKyBnZW5lcmF0ZSgpXHJcbiAgICAgICAgKyBnZW5lcmF0ZSgpO1xyXG5cclxuICBjb25zdCB0ZW1wSWQgPSBnZW5lcmF0ZSgpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdGVtcG9yYXJ5QWNjZXNzSGFzaDogYXdhaXQgYXBwLmNyeXB0by5oYXNoKFxyXG4gICAgICB0ZW1wQ29kZSxcclxuICAgICksXHJcbiAgICB0ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaDpcclxuICAgICAgICAgICAgKGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKSkgKyB0ZW1wQ29kZUV4cGlyeUxlbmd0aCxcclxuICAgIHRlbXBDb2RlOiBgdG1wOiR7dGVtcElkfToke3RlbXBDb2RlfWAsXHJcbiAgICB0ZW1wb3JhcnlBY2Nlc3NJZDogdGVtcElkLFxyXG4gIH07XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgbG9va3NMaWtlVGVtcG9yYXJ5Q29kZSA9IGNvZGUgPT4gY29kZS5zdGFydHNXaXRoKCd0bXA6Jyk7XHJcbiIsImltcG9ydCB7XHJcbiAgbWFwLCB1bmlxV2l0aCxcclxuICBmbGF0dGVuLCBmaWx0ZXIsXHJcbn0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSB9IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcclxuaW1wb3J0IHtcclxuICAkLCBpbnNlbnNpdGl2ZUVxdWFscywgYXBpV3JhcHBlciwgZXZlbnRzLFxyXG4gIGlzTm9uRW1wdHlTdHJpbmcsIGFsbCxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XHJcblxyXG5jb25zdCB1c2VyUnVsZXMgPSBhbGxVc2VycyA9PiBbXHJcbiAgbWFrZXJ1bGUoJ25hbWUnLCAndXNlcm5hbWUgbXVzdCBiZSBzZXQnLFxyXG4gICAgdSA9PiBpc05vbkVtcHR5U3RyaW5nKHUubmFtZSkpLFxyXG4gIG1ha2VydWxlKCdhY2Nlc3NMZXZlbHMnLCAndXNlciBtdXN0IGhhdmUgYXQgbGVhc3Qgb25lIGFjY2VzcyBsZXZlbCcsXHJcbiAgICB1ID0+IHUuYWNjZXNzTGV2ZWxzLmxlbmd0aCA+IDApLFxyXG4gIG1ha2VydWxlKCduYW1lJywgJ3VzZXJuYW1lIG11c3QgYmUgdW5pcXVlJyxcclxuICAgIHUgPT4gZmlsdGVyKHUyID0+IGluc2Vuc2l0aXZlRXF1YWxzKHUyLm5hbWUsIHUubmFtZSkpKGFsbFVzZXJzKS5sZW5ndGggPT09IDEpLFxyXG4gIG1ha2VydWxlKCdhY2Nlc3NMZXZlbHMnLCAnYWNjZXNzIGxldmVscyBtdXN0IG9ubHkgY29udGFpbiBzdGluZ3MnLFxyXG4gICAgdSA9PiBhbGwoaXNOb25FbXB0eVN0cmluZykodS5hY2Nlc3NMZXZlbHMpKSxcclxuXTtcclxuXHJcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVVzZXIgPSAoKSA9PiAoYWxsdXNlcnMsIHVzZXIpID0+IGFwcGx5UnVsZVNldCh1c2VyUnVsZXMoYWxsdXNlcnMpKSh1c2VyKTtcclxuXHJcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVVzZXJzID0gYXBwID0+IGFsbFVzZXJzID0+IGFwaVdyYXBwZXIoXHJcbiAgYXBwLFxyXG4gIGV2ZW50cy5hdXRoQXBpLnZhbGlkYXRlVXNlcnMsXHJcbiAgYWx3YXlzQXV0aG9yaXplZCxcclxuICB7IGFsbFVzZXJzIH0sXHJcbiAgX3ZhbGlkYXRlVXNlcnMsIGFwcCwgYWxsVXNlcnMsXHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgX3ZhbGlkYXRlVXNlcnMgPSAoYXBwLCBhbGxVc2VycykgPT4gJChhbGxVc2VycywgW1xyXG4gIG1hcChsID0+IHZhbGlkYXRlVXNlcihhcHApKGFsbFVzZXJzLCBsKSksXHJcbiAgZmxhdHRlbixcclxuICB1bmlxV2l0aCgoeCwgeSkgPT4geC5maWVsZCA9PT0geS5maWVsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB4Lml0ZW0gPT09IHkuaXRlbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB4LmVycm9yID09PSB5LmVycm9yKSxcclxuXSk7XHJcbiIsImltcG9ydCB7IGFwaVdyYXBwZXJTeW5jLCBldmVudHMgfSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TmV3VXNlciA9IGFwcCA9PiAoKSA9PiBhcGlXcmFwcGVyU3luYyhcclxuICBhcHAsXHJcbiAgZXZlbnRzLmF1dGhBcGkuZ2V0TmV3VXNlcixcclxuICBwZXJtaXNzaW9uLmNyZWF0ZVVzZXIuaXNBdXRob3JpemVkLFxyXG4gIHt9LFxyXG4gIF9nZXROZXdVc2VyLCBhcHAsXHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgX2dldE5ld1VzZXIgPSAoKSA9PiAoe1xyXG4gIG5hbWU6ICcnLFxyXG4gIGFjY2Vzc0xldmVsczogW10sXHJcbiAgZW5hYmxlZDogdHJ1ZSxcclxuICB0ZW1wb3JhcnlBY2Nlc3NJZDogJycsXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldE5ld1VzZXJBdXRoID0gYXBwID0+ICgpID0+IGFwaVdyYXBwZXJTeW5jKFxyXG4gIGFwcCxcclxuICBldmVudHMuYXV0aEFwaS5nZXROZXdVc2VyQXV0aCxcclxuICBwZXJtaXNzaW9uLmNyZWF0ZVVzZXIuaXNBdXRob3JpemVkLFxyXG4gIHt9LFxyXG4gIF9nZXROZXdVc2VyQXV0aCwgYXBwLFxyXG4pO1xyXG5cclxuZXhwb3J0IGNvbnN0IF9nZXROZXdVc2VyQXV0aCA9ICgpID0+ICh7XHJcbiAgcGFzc3dvcmRIYXNoOiAnJyxcclxuICB0ZW1wb3JhcnlBY2Nlc3NIYXNoOiAnJyxcclxuICB0ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaDogMCxcclxufSk7XHJcbiIsImltcG9ydCB7IGZpbmQgfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyB1c2VyQXV0aEZpbGUsIHBhcnNlVGVtcG9yYXJ5Q29kZSB9IGZyb20gJy4vYXV0aENvbW1vbic7XHJcbmltcG9ydCB7XHJcbiAgaXNTb21ldGhpbmcsICQsIGFwaVdyYXBwZXIsIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgX2dldFVzZXJzIH0gZnJvbSAnLi9nZXRVc2Vycyc7XHJcbmltcG9ydCB7IGFsd2F5c0F1dGhvcml6ZWQgfSBmcm9tICcuL3Blcm1pc3Npb25zJztcclxuXHJcbmV4cG9ydCBjb25zdCBpc1ZhbGlkUGFzc3dvcmQgPSBhcHAgPT4gcGFzc3dvcmQgPT4gYXBpV3JhcHBlclN5bmMoXHJcbiAgYXBwLFxyXG4gIGV2ZW50cy5hdXRoQXBpLmlzVmFsaWRQYXNzd29yZCxcclxuICBhbHdheXNBdXRob3JpemVkLFxyXG4gIHsgcGFzc3dvcmQgfSxcclxuICBfaXNWYWxpZFBhc3N3b3JkLCBhcHAsIHBhc3N3b3JkLFxyXG4pO1xyXG5cclxuZXhwb3J0IGNvbnN0IF9pc1ZhbGlkUGFzc3dvcmQgPSAoYXBwLCBwYXNzd29yZCkgPT4gc2NvcmVQYXNzd29yZChwYXNzd29yZCkuc2NvcmUgPiAzMDtcclxuXHJcbmV4cG9ydCBjb25zdCBjaGFuZ2VNeVBhc3N3b3JkID0gYXBwID0+IGFzeW5jIChjdXJyZW50UHcsIG5ld3Bhc3N3b3JkKSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMuYXV0aEFwaS5jaGFuZ2VNeVBhc3N3b3JkLFxyXG4gIGFsd2F5c0F1dGhvcml6ZWQsXHJcbiAgeyBjdXJyZW50UHcsIG5ld3Bhc3N3b3JkIH0sXHJcbiAgX2NoYW5nZU15UGFzc3dvcmQsIGFwcCwgY3VycmVudFB3LCBuZXdwYXNzd29yZCxcclxuKTtcclxuXHJcbmV4cG9ydCBjb25zdCBfY2hhbmdlTXlQYXNzd29yZCA9IGFzeW5jIChhcHAsIGN1cnJlbnRQdywgbmV3cGFzc3dvcmQpID0+IHtcclxuICBjb25zdCBleGlzdGluZ0F1dGggPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxyXG4gICAgdXNlckF1dGhGaWxlKGFwcC51c2VyLm5hbWUpLFxyXG4gICk7XHJcblxyXG4gIGlmIChpc1NvbWV0aGluZyhleGlzdGluZ0F1dGgucGFzc3dvcmRIYXNoKSkge1xyXG4gICAgY29uc3QgdmVyaWZpZWQgPSBhd2FpdCBhcHAuY3J5cHRvLnZlcmlmeShcclxuICAgICAgZXhpc3RpbmdBdXRoLnBhc3N3b3JkSGFzaCxcclxuICAgICAgY3VycmVudFB3LFxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAodmVyaWZpZWQpIHtcclxuICAgICAgYXdhaXQgYXdhaXQgZG9TZXQoXHJcbiAgICAgICAgYXBwLCBleGlzdGluZ0F1dGgsXHJcbiAgICAgICAgYXBwLnVzZXIubmFtZSwgbmV3cGFzc3dvcmQsXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUgPSBhcHAgPT4gYXN5bmMgKHRlbXBDb2RlLCBuZXdwYXNzd29yZCkgPT4gYXBpV3JhcHBlcihcclxuICBhcHAsXHJcbiAgZXZlbnRzLmF1dGhBcGkuc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZSxcclxuICBhbHdheXNBdXRob3JpemVkLFxyXG4gIHsgdGVtcENvZGUsIG5ld3Bhc3N3b3JkIH0sXHJcbiAgX3NldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUsIGFwcCwgdGVtcENvZGUsIG5ld3Bhc3N3b3JkLFxyXG4pO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBfc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZSA9IGFzeW5jIChhcHAsIHRlbXBDb2RlLCBuZXdwYXNzd29yZCkgPT4ge1xyXG4gIGNvbnN0IGN1cnJlbnRUaW1lID0gYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpO1xyXG5cclxuICBjb25zdCB0ZW1wID0gcGFyc2VUZW1wb3JhcnlDb2RlKHRlbXBDb2RlKTtcclxuXHJcbiAgY29uc3QgdXNlciA9ICQoYXdhaXQgX2dldFVzZXJzKGFwcCksIFtcclxuICAgIGZpbmQodSA9PiB1LnRlbXBvcmFyeUFjY2Vzc0lkID09PSB0ZW1wLmlkKSxcclxuICBdKTtcclxuXHJcbiAgaWYgKCF1c2VyKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cclxuICBjb25zdCBleGlzdGluZ0F1dGggPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxyXG4gICAgdXNlckF1dGhGaWxlKHVzZXIubmFtZSksXHJcbiAgKTtcclxuXHJcbiAgaWYgKGlzU29tZXRoaW5nKGV4aXN0aW5nQXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoKVxyXG4gICAgICAgJiYgZXhpc3RpbmdBdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID4gY3VycmVudFRpbWUpIHtcclxuICAgIGNvbnN0IHZlcmlmaWVkID0gYXdhaXQgYXBwLmNyeXB0by52ZXJpZnkoXHJcbiAgICAgIGV4aXN0aW5nQXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoLFxyXG4gICAgICB0ZW1wLmNvZGUsXHJcbiAgICApO1xyXG5cclxuICAgIGlmICh2ZXJpZmllZCkge1xyXG4gICAgICBhd2FpdCBkb1NldChcclxuICAgICAgICBhcHAsIGV4aXN0aW5nQXV0aCxcclxuICAgICAgICB1c2VyLm5hbWUsIG5ld3Bhc3N3b3JkLFxyXG4gICAgICApO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbmNvbnN0IGRvU2V0ID0gYXN5bmMgKGFwcCwgYXV0aCwgdXNlcm5hbWUsIG5ld3Bhc3N3b3JkKSA9PiB7XHJcbiAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoID0gJyc7XHJcbiAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA9IDA7XHJcbiAgYXV0aC5wYXNzd29yZEhhc2ggPSBhd2FpdCBhcHAuY3J5cHRvLmhhc2goXHJcbiAgICBuZXdwYXNzd29yZCxcclxuICApO1xyXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcclxuICAgIHVzZXJBdXRoRmlsZSh1c2VybmFtZSksXHJcbiAgICBhdXRoLFxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3Qgc2NvcmVQYXNzd29yZCA9IGFwcCA9PiBwYXNzd29yZCA9PiBhcGlXcmFwcGVyU3luYyhcclxuICBhcHAsXHJcbiAgZXZlbnRzLmF1dGhBcGkuc2NvcmVQYXNzd29yZCxcclxuICBhbHdheXNBdXRob3JpemVkLFxyXG4gIHsgcGFzc3dvcmQgfSxcclxuICBfc2NvcmVQYXNzd29yZCwgcGFzc3dvcmQsXHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgX3Njb3JlUGFzc3dvcmQgPSAocGFzc3dvcmQpID0+IHtcclxuICAvLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzk0ODE3Mi9wYXNzd29yZC1zdHJlbmd0aC1tZXRlclxyXG4gIC8vIHRoYW5rIHlvdSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3VzZXJzLzQ2NjE3L3RtLWx2XHJcblxyXG4gIGxldCBzY29yZSA9IDA7XHJcbiAgaWYgKCFwYXNzd29yZCkgeyByZXR1cm4gc2NvcmU7IH1cclxuXHJcbiAgLy8gYXdhcmQgZXZlcnkgdW5pcXVlIGxldHRlciB1bnRpbCA1IHJlcGV0aXRpb25zXHJcbiAgY29uc3QgbGV0dGVycyA9IG5ldyBPYmplY3QoKTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhc3N3b3JkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXR0ZXJzW3Bhc3N3b3JkW2ldXSA9IChsZXR0ZXJzW3Bhc3N3b3JkW2ldXSB8fCAwKSArIDE7XHJcbiAgICBzY29yZSArPSA1LjAgLyBsZXR0ZXJzW3Bhc3N3b3JkW2ldXTtcclxuICB9XHJcblxyXG4gIC8vIGJvbnVzIHBvaW50cyBmb3IgbWl4aW5nIGl0IHVwXHJcbiAgY29uc3QgdmFyaWF0aW9ucyA9IHtcclxuICAgIGRpZ2l0czogL1xcZC8udGVzdChwYXNzd29yZCksXHJcbiAgICBsb3dlcjogL1thLXpdLy50ZXN0KHBhc3N3b3JkKSxcclxuICAgIHVwcGVyOiAvW0EtWl0vLnRlc3QocGFzc3dvcmQpLFxyXG4gICAgbm9uV29yZHM6IC9cXFcvLnRlc3QocGFzc3dvcmQpLFxyXG4gIH07XHJcblxyXG4gIGxldCB2YXJpYXRpb25Db3VudCA9IDA7XHJcbiAgZm9yIChjb25zdCBjaGVjayBpbiB2YXJpYXRpb25zKSB7XHJcbiAgICB2YXJpYXRpb25Db3VudCArPSAodmFyaWF0aW9uc1tjaGVja10gPT0gdHJ1ZSkgPyAxIDogMDtcclxuICB9XHJcbiAgc2NvcmUgKz0gKHZhcmlhdGlvbkNvdW50IC0gMSkgKiAxMDtcclxuXHJcbiAgY29uc3Qgc3RyZW5ndGhUZXh0ID0gc2NvcmUgPiA4MFxyXG4gICAgPyAnc3Ryb25nJ1xyXG4gICAgOiBzY29yZSA+IDYwXHJcbiAgICAgID8gJ2dvb2QnXHJcbiAgICAgIDogc2NvcmUgPj0gMzBcclxuICAgICAgICA/ICd3ZWFrJ1xyXG4gICAgICAgIDogJ3Zlcnkgd2Vhayc7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzY29yZTogcGFyc2VJbnQoc2NvcmUpLFxyXG4gICAgc3RyZW5ndGhUZXh0LFxyXG4gIH07XHJcbn07XHJcbiIsImltcG9ydCB7IGpvaW4sIHNvbWUgfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyB2YWxpZGF0ZVVzZXIgfSBmcm9tICcuL3ZhbGlkYXRlVXNlcic7XHJcbmltcG9ydCB7IGdldE5ld1VzZXJBdXRoIH0gZnJvbSAnLi9nZXROZXdVc2VyJztcclxuaW1wb3J0IHtcclxuICBnZXRMb2NrLCBpc05vbG9jaywgcmVsZWFzZUxvY2ssIGFwaVdyYXBwZXIsIGV2ZW50cyxcclxuICBpbnNlbnNpdGl2ZUVxdWFscywgaXNOb25FbXB0eVN0cmluZyxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQge1xyXG4gIFVTRVJTX0xPQ0tfRklMRSwgc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZixcclxuICBVU0VSU19MSVNUX0ZJTEUsIHVzZXJBdXRoRmlsZSxcclxufSBmcm9tICcuL2F1dGhDb21tb24nO1xyXG5pbXBvcnQgeyBnZXRUZW1wb3JhcnlDb2RlIH0gZnJvbSAnLi9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MnO1xyXG5pbXBvcnQgeyBpc1ZhbGlkUGFzc3dvcmQgfSBmcm9tICcuL3NldFBhc3N3b3JkJztcclxuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xyXG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVVc2VyID0gYXBwID0+IGFzeW5jICh1c2VyLCBwYXNzd29yZCA9IG51bGwpID0+IGFwaVdyYXBwZXIoXHJcbiAgYXBwLFxyXG4gIGV2ZW50cy5hdXRoQXBpLmNyZWF0ZVVzZXIsXHJcbiAgcGVybWlzc2lvbi5jcmVhdGVVc2VyLmlzQXV0aG9yaXplZCxcclxuICB7IHVzZXIsIHBhc3N3b3JkIH0sXHJcbiAgX2NyZWF0ZVVzZXIsIGFwcCwgdXNlciwgcGFzc3dvcmQsXHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgX2NyZWF0ZVVzZXIgPSBhc3luYyAoYXBwLCB1c2VyLCBwYXNzd29yZCA9IG51bGwpID0+IHtcclxuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhcclxuICAgIGFwcCwgVVNFUlNfTE9DS19GSUxFLCAxMDAwLCAyLFxyXG4gICk7XHJcblxyXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBjcmVhdGUgdXNlciwgY291bGQgbm90IGdldCBsb2NrIC0gdHJ5IGFnYWluJyk7IH1cclxuXHJcbiAgY29uc3QgdXNlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSk7XHJcblxyXG4gIGNvbnN0IHVzZXJFcnJvcnMgPSB2YWxpZGF0ZVVzZXIoYXBwKShbLi4udXNlcnMsIHVzZXJdLCB1c2VyKTtcclxuICBpZiAodXNlckVycm9ycy5sZW5ndGggPiAwKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYFVzZXIgaXMgaW52YWxpZC4gJHtqb2luKCc7ICcpKHVzZXJFcnJvcnMpfWApOyB9XHJcblxyXG4gIGNvbnN0IHsgYXV0aCwgdGVtcENvZGUsIHRlbXBvcmFyeUFjY2Vzc0lkIH0gPSBhd2FpdCBnZXRBY2Nlc3MoXHJcbiAgICBhcHAsIHBhc3N3b3JkLFxyXG4gICk7XHJcbiAgdXNlci50ZW1wQ29kZSA9IHRlbXBDb2RlO1xyXG4gIHVzZXIudGVtcG9yYXJ5QWNjZXNzSWQgPSB0ZW1wb3JhcnlBY2Nlc3NJZDtcclxuXHJcbiAgaWYgKHNvbWUodSA9PiBpbnNlbnNpdGl2ZUVxdWFscyh1Lm5hbWUsIHVzZXIubmFtZSkpKHVzZXJzKSkgeyBcclxuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ1VzZXIgYWxyZWFkeSBleGlzdHMnKTsgXHJcbiAgfVxyXG5cclxuICB1c2Vycy5wdXNoKFxyXG4gICAgc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZih1c2VyKSxcclxuICApO1xyXG5cclxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXHJcbiAgICBVU0VSU19MSVNUX0ZJTEUsXHJcbiAgICB1c2VycyxcclxuICApO1xyXG5cclxuICB0cnkge1xyXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVKc29uKFxyXG4gICAgICB1c2VyQXV0aEZpbGUodXNlci5uYW1lKSxcclxuICAgICAgYXV0aCxcclxuICAgICk7XHJcbiAgfSBjYXRjaCAoXykge1xyXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFxyXG4gICAgICB1c2VyQXV0aEZpbGUodXNlci5uYW1lKSxcclxuICAgICAgYXV0aCxcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBhd2FpdCByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xyXG5cclxuICByZXR1cm4gdXNlcjtcclxufTtcclxuXHJcbmNvbnN0IGdldEFjY2VzcyA9IGFzeW5jIChhcHAsIHBhc3N3b3JkKSA9PiB7XHJcbiAgY29uc3QgYXV0aCA9IGdldE5ld1VzZXJBdXRoKGFwcCkoKTtcclxuXHJcbiAgaWYgKGlzTm9uRW1wdHlTdHJpbmcocGFzc3dvcmQpKSB7XHJcbiAgICBpZiAoaXNWYWxpZFBhc3N3b3JkKHBhc3N3b3JkKSkge1xyXG4gICAgICBhdXRoLnBhc3N3b3JkSGFzaCA9IGF3YWl0IGFwcC5jcnlwdG8uaGFzaChwYXNzd29yZCk7XHJcbiAgICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaCA9ICcnO1xyXG4gICAgICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0lkID0gJyc7XHJcbiAgICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPSAwO1xyXG4gICAgICByZXR1cm4geyBhdXRoIH07XHJcbiAgICB9XHJcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdQYXNzd29yZCBkb2VzIG5vdCBtZWV0IHJlcXVpcmVtZW50cycpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zdCB0ZW1wQWNjZXNzID0gYXdhaXQgZ2V0VGVtcG9yYXJ5Q29kZShhcHApO1xyXG4gICAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoID0gdGVtcEFjY2Vzcy50ZW1wb3JhcnlBY2Nlc3NIYXNoO1xyXG4gICAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA9IHRlbXBBY2Nlc3MudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2g7XHJcbiAgICBhdXRoLnBhc3N3b3JkSGFzaCA9ICcnO1xyXG4gICAgcmV0dXJuICh7XHJcbiAgICAgIGF1dGgsXHJcbiAgICAgIHRlbXBDb2RlOiB0ZW1wQWNjZXNzLnRlbXBDb2RlLFxyXG4gICAgICB0ZW1wb3JhcnlBY2Nlc3NJZDogdGVtcEFjY2Vzcy50ZW1wb3JhcnlBY2Nlc3NJZCxcclxuICAgIH0pO1xyXG4gIH1cclxufTtcclxuIiwiaW1wb3J0IHtcclxuICBnZXRMb2NrLFxyXG4gIGlzTm9sb2NrLCByZWxlYXNlTG9jayxcclxufSBmcm9tICcuLi9jb21tb24vbG9jayc7XHJcbmltcG9ydCB7IFVTRVJTX0xPQ0tfRklMRSwgVVNFUlNfTElTVF9GSUxFLCBnZXRVc2VyQnlOYW1lIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcclxuaW1wb3J0IHsgYXBpV3JhcHBlciwgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xyXG5pbXBvcnQgeyBOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XHJcblxyXG5leHBvcnQgY29uc3QgZW5hYmxlVXNlciA9IGFwcCA9PiBhc3luYyB1c2VybmFtZSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMuYXV0aEFwaS5lbmFibGVVc2VyLFxyXG4gIHBlcm1pc3Npb24uZW5hYmxlRGlzYWJsZVVzZXIuaXNBdXRob3JpemVkLFxyXG4gIHsgdXNlcm5hbWUgfSxcclxuICBfZW5hYmxlVXNlciwgYXBwLCB1c2VybmFtZSxcclxuKTtcclxuXHJcbmV4cG9ydCBjb25zdCBkaXNhYmxlVXNlciA9IGFwcCA9PiBhc3luYyB1c2VybmFtZSA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMuYXV0aEFwaS5kaXNhYmxlVXNlcixcclxuICBwZXJtaXNzaW9uLmVuYWJsZURpc2FibGVVc2VyLmlzQXV0aG9yaXplZCxcclxuICB7IHVzZXJuYW1lIH0sXHJcbiAgX2Rpc2FibGVVc2VyLCBhcHAsIHVzZXJuYW1lLFxyXG4pO1xyXG5cclxuZXhwb3J0IGNvbnN0IF9lbmFibGVVc2VyID0gYXN5bmMgKGFwcCwgdXNlcm5hbWUpID0+IGF3YWl0IHRvZ2dsZVVzZXIoYXBwLCB1c2VybmFtZSwgdHJ1ZSk7XHJcblxyXG5leHBvcnQgY29uc3QgX2Rpc2FibGVVc2VyID0gYXN5bmMgKGFwcCwgdXNlcm5hbWUpID0+IGF3YWl0IHRvZ2dsZVVzZXIoYXBwLCB1c2VybmFtZSwgZmFsc2UpO1xyXG5cclxuY29uc3QgdG9nZ2xlVXNlciA9IGFzeW5jIChhcHAsIHVzZXJuYW1lLCBlbmFibGVkKSA9PiB7XHJcbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldExvY2soYXBwLCBVU0VSU19MT0NLX0ZJTEUsIDEwMDAsIDEsIDApO1xyXG5cclxuICBjb25zdCBhY3Rpb25OYW1lID0gZW5hYmxlZCA/ICdlbmFibGUnIDogJ2Rpc2FibGUnO1xyXG5cclxuICBpZiAoaXNOb2xvY2sobG9jaykpIHsgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgJHthY3Rpb25OYW1lfSB1c2VyIC0gY2Fubm90IGdldCBsb2NrYCk7IH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihVU0VSU19MSVNUX0ZJTEUpO1xyXG4gICAgY29uc3QgdXNlciA9IGdldFVzZXJCeU5hbWUodXNlcnMsIHVzZXJuYW1lKTtcclxuICAgIGlmICghdXNlcikgeyB0aHJvdyBuZXcgTm90Rm91bmRFcnJvcihgQ291bGQgbm90IGZpbmQgdXNlciB0byAke2FjdGlvbk5hbWV9YCk7IH1cclxuXHJcbiAgICBpZiAodXNlci5lbmFibGVkID09PSAhZW5hYmxlZCkge1xyXG4gICAgICB1c2VyLmVuYWJsZWQgPSBlbmFibGVkO1xyXG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oVVNFUlNfTElTVF9GSUxFLCB1c2Vycyk7XHJcbiAgICB9XHJcbiAgfSBmaW5hbGx5IHtcclxuICAgIHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XHJcbiAgfVxyXG59O1xyXG4iLCJleHBvcnQgY29uc3QgZ2V0TmV3QWNjZXNzTGV2ZWwgPSAoKSA9PiAoKSA9PiAoe1xyXG4gIG5hbWU6ICcnLFxyXG4gIHBlcm1pc3Npb25zOiBbXSxcclxuICBkZWZhdWx0OmZhbHNlXHJcbn0pO1xyXG4iLCJpbXBvcnQge1xyXG4gIHZhbHVlcywgaW5jbHVkZXMsIG1hcCwgY29uY2F0LCBpc0VtcHR5LCB1bmlxV2l0aCwgc29tZSxcclxuICBmbGF0dGVuLCBmaWx0ZXIsXHJcbn0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSB9IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcclxuaW1wb3J0IHsgcGVybWlzc2lvblR5cGVzIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcclxuaW1wb3J0IHtcclxuICAkLCBpc1NvbWV0aGluZywgaW5zZW5zaXRpdmVFcXVhbHMsXHJcbiAgaXNOb25FbXB0eVN0cmluZywgYXBpV3JhcHBlclN5bmMsIGV2ZW50cyxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBnZXROb2RlIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xyXG5cclxuY29uc3QgaXNBbGxvd2VkVHlwZSA9IHQgPT4gJChwZXJtaXNzaW9uVHlwZXMsIFtcclxuICB2YWx1ZXMsXHJcbiAgaW5jbHVkZXModCksXHJcbl0pO1xyXG5cclxuY29uc3QgaXNSZWNvcmRPckluZGV4VHlwZSA9IHQgPT4gc29tZShwID0+IHAgPT09IHQpKFtcclxuICBwZXJtaXNzaW9uVHlwZXMuQ1JFQVRFX1JFQ09SRCxcclxuICBwZXJtaXNzaW9uVHlwZXMuVVBEQVRFX1JFQ09SRCxcclxuICBwZXJtaXNzaW9uVHlwZXMuREVMRVRFX1JFQ09SRCxcclxuICBwZXJtaXNzaW9uVHlwZXMuUkVBRF9SRUNPUkQsXHJcbiAgcGVybWlzc2lvblR5cGVzLlJFQURfSU5ERVgsXHJcbiAgcGVybWlzc2lvblR5cGVzLkVYRUNVVEVfQUNUSU9OLFxyXG5dKTtcclxuXHJcblxyXG5jb25zdCBwZXJtaXNzaW9uUnVsZXMgPSBhcHAgPT4gKFtcclxuICBtYWtlcnVsZSgndHlwZScsICd0eXBlIG11c3QgYmUgb25lIG9mIGFsbG93ZWQgdHlwZXMnLFxyXG4gICAgcCA9PiBpc0FsbG93ZWRUeXBlKHAudHlwZSkpLFxyXG4gIG1ha2VydWxlKCdub2RlS2V5JywgJ3JlY29yZCBhbmQgaW5kZXggcGVybWlzc2lvbnMgbXVzdCBpbmNsdWRlIGEgdmFsaWQgbm9kZUtleScsXHJcbiAgICBwID0+ICghaXNSZWNvcmRPckluZGV4VHlwZShwLnR5cGUpKVxyXG4gICAgICAgICAgICAgfHwgaXNTb21ldGhpbmcoZ2V0Tm9kZShhcHAuaGllcmFyY2h5LCBwLm5vZGVLZXkpKSksXHJcbl0pO1xyXG5cclxuY29uc3QgYXBwbHlQZXJtaXNzaW9uUnVsZXMgPSBhcHAgPT4gYXBwbHlSdWxlU2V0KHBlcm1pc3Npb25SdWxlcyhhcHApKTtcclxuXHJcbmNvbnN0IGFjY2Vzc0xldmVsUnVsZXMgPSBhbGxMZXZlbHMgPT4gKFtcclxuICBtYWtlcnVsZSgnbmFtZScsICduYW1lIG11c3QgYmUgc2V0JyxcclxuICAgIGwgPT4gaXNOb25FbXB0eVN0cmluZyhsLm5hbWUpKSxcclxuICBtYWtlcnVsZSgnbmFtZScsICdhY2Nlc3MgbGV2ZWwgbmFtZXMgbXVzdCBiZSB1bmlxdWUnLFxyXG4gICAgbCA9PiBpc0VtcHR5KGwubmFtZSlcclxuICAgICAgICAgICAgIHx8IGZpbHRlcihhID0+IGluc2Vuc2l0aXZlRXF1YWxzKGwubmFtZSwgYS5uYW1lKSkoYWxsTGV2ZWxzKS5sZW5ndGggPT09IDEpLFxyXG5dKTtcclxuXHJcbmNvbnN0IGFwcGx5TGV2ZWxSdWxlcyA9IGFsbExldmVscyA9PiBhcHBseVJ1bGVTZXQoYWNjZXNzTGV2ZWxSdWxlcyhhbGxMZXZlbHMpKTtcclxuXHJcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFjY2Vzc0xldmVsID0gYXBwID0+IChhbGxMZXZlbHMsIGxldmVsKSA9PiB7XHJcbiAgY29uc3QgZXJycyA9ICQobGV2ZWwucGVybWlzc2lvbnMsIFtcclxuICAgIG1hcChhcHBseVBlcm1pc3Npb25SdWxlcyhhcHApKSxcclxuICAgIGZsYXR0ZW4sXHJcbiAgICBjb25jYXQoXHJcbiAgICAgIGFwcGx5TGV2ZWxSdWxlcyhhbGxMZXZlbHMpKGxldmVsKSxcclxuICAgICksXHJcbiAgXSk7XHJcblxyXG4gIHJldHVybiBlcnJzO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWNjZXNzTGV2ZWxzID0gYXBwID0+IGFsbExldmVscyA9PiBhcGlXcmFwcGVyU3luYyhcclxuICBhcHAsXHJcbiAgZXZlbnRzLmF1dGhBcGkudmFsaWRhdGVBY2Nlc3NMZXZlbHMsXHJcbiAgYWx3YXlzQXV0aG9yaXplZCxcclxuICB7IGFsbExldmVscyB9LFxyXG4gIF92YWxpZGF0ZUFjY2Vzc0xldmVscywgYXBwLCBhbGxMZXZlbHMsXHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgX3ZhbGlkYXRlQWNjZXNzTGV2ZWxzID0gKGFwcCwgYWxsTGV2ZWxzKSA9PiAkKGFsbExldmVscywgW1xyXG4gIG1hcChsID0+IHZhbGlkYXRlQWNjZXNzTGV2ZWwoYXBwKShhbGxMZXZlbHMsIGwpKSxcclxuICBmbGF0dGVuLFxyXG4gIHVuaXFXaXRoKCh4LCB5KSA9PiB4LmZpZWxkID09PSB5LmZpZWxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHguaXRlbSA9PT0geS5pdGVtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHguZXJyb3IgPT09IHkuZXJyb3IpLFxyXG5dKTtcclxuIiwiaW1wb3J0IHsgam9pbiwgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHtcclxuICBnZXRMb2NrLCByZWxlYXNlTG9jaywgJCxcclxuICBpc05vbG9jaywgYXBpV3JhcHBlciwgZXZlbnRzLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7XHJcbiAgQUNDRVNTX0xFVkVMU19MT0NLX0ZJTEUsXHJcbiAgQUNDRVNTX0xFVkVMU19GSUxFLFxyXG59IGZyb20gJy4vYXV0aENvbW1vbic7XHJcbmltcG9ydCB7IHZhbGlkYXRlQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi92YWxpZGF0ZUFjY2Vzc0xldmVscyc7XHJcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcclxuXHJcbmV4cG9ydCBjb25zdCBzYXZlQWNjZXNzTGV2ZWxzID0gYXBwID0+IGFzeW5jIGFjY2Vzc0xldmVscyA9PiBhcGlXcmFwcGVyKFxyXG4gIGFwcCxcclxuICBldmVudHMuYXV0aEFwaS5zYXZlQWNjZXNzTGV2ZWxzLFxyXG4gIHBlcm1pc3Npb24ud3JpdGVBY2Nlc3NMZXZlbHMuaXNBdXRob3JpemVkLFxyXG4gIHsgYWNjZXNzTGV2ZWxzIH0sXHJcbiAgX3NhdmVBY2Nlc3NMZXZlbHMsIGFwcCwgYWNjZXNzTGV2ZWxzLFxyXG4pO1xyXG5cclxuZXhwb3J0IGNvbnN0IF9zYXZlQWNjZXNzTGV2ZWxzID0gYXN5bmMgKGFwcCwgYWNjZXNzTGV2ZWxzKSA9PiB7XHJcbiAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRlQWNjZXNzTGV2ZWxzKGFwcCkoYWNjZXNzTGV2ZWxzLmxldmVscyk7XHJcbiAgaWYgKHZhbGlkYXRpb25FcnJvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgY29uc3QgZXJycyA9ICQodmFsaWRhdGlvbkVycm9ycywgW1xyXG4gICAgICBtYXAoZSA9PiBlLmVycm9yKSxcclxuICAgICAgam9pbignLCAnKSxcclxuICAgIF0pO1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICBgQWNjZXNzIExldmVscyBJbnZhbGlkOiAke2VycnN9YCxcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhcclxuICAgIGFwcCwgQUNDRVNTX0xFVkVMU19MT0NLX0ZJTEUsIDIwMDAsIDIsXHJcbiAgKTtcclxuXHJcbiAgaWYgKGlzTm9sb2NrKGxvY2spKSB7IHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGdldCBsb2NrIHRvIHNhdmUgYWNjZXNzIGxldmVscycpOyB9XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBleGlzdGluZyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oQUNDRVNTX0xFVkVMU19GSUxFKTtcclxuICAgIGlmIChleGlzdGluZy52ZXJzaW9uICE9PSBhY2Nlc3NMZXZlbHMudmVyc2lvbikgeyB0aHJvdyBuZXcgRXJyb3IoJ0FjY2VzcyBsZXZlbHMgaGF2ZSBhbHJlYWR5IGJlZW4gdXBkYXRlZCwgc2luY2UgeW91IGxvYWRlZCcpOyB9XHJcblxyXG4gICAgYWNjZXNzTGV2ZWxzLnZlcnNpb24rKztcclxuXHJcbiAgICBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oQUNDRVNTX0xFVkVMU19GSUxFLCBhY2Nlc3NMZXZlbHMpO1xyXG4gIH0gZmluYWxseSB7XHJcbiAgICBhd2FpdCByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xyXG4gIH1cclxufTtcclxuIiwiaW1wb3J0IHtcclxuICBmaWx0ZXIsIHZhbHVlcywgZWFjaCwga2V5cyxcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XHJcbmltcG9ydCB7XHJcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxyXG4gIGlzSW5kZXgsIGlzUmVjb3JkLFxyXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7ICQgfSBmcm9tICcuLi9jb21tb24nO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zID0gKGFwcCkgPT4ge1xyXG4gIGNvbnN0IGFsbE5vZGVzID0gZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGFwcC5oaWVyYXJjaHkpO1xyXG4gIGNvbnN0IGFjY2Vzc0xldmVsID0geyBwZXJtaXNzaW9uczogW10gfTtcclxuXHJcbiAgY29uc3QgcmVjb3JkTm9kZXMgPSAkKGFsbE5vZGVzLCBbXHJcbiAgICBmaWx0ZXIoaXNSZWNvcmQpLFxyXG4gIF0pO1xyXG5cclxuICBmb3IgKGNvbnN0IG4gb2YgcmVjb3JkTm9kZXMpIHtcclxuICAgIHBlcm1pc3Npb24uY3JlYXRlUmVjb3JkLmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xyXG4gICAgcGVybWlzc2lvbi51cGRhdGVSZWNvcmQuYWRkKG4ubm9kZUtleSgpLCBhY2Nlc3NMZXZlbCk7XHJcbiAgICBwZXJtaXNzaW9uLmRlbGV0ZVJlY29yZC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcclxuICAgIHBlcm1pc3Npb24ucmVhZFJlY29yZC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGluZGV4Tm9kZXMgPSAkKGFsbE5vZGVzLCBbXHJcbiAgICBmaWx0ZXIoaXNJbmRleCksXHJcbiAgXSk7XHJcblxyXG4gIGZvciAoY29uc3QgbiBvZiBpbmRleE5vZGVzKSB7XHJcbiAgICBwZXJtaXNzaW9uLnJlYWRJbmRleC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcclxuICB9XHJcblxyXG4gIGZvciAoY29uc3QgYSBvZiBrZXlzKGFwcC5hY3Rpb25zKSkge1xyXG4gICAgcGVybWlzc2lvbi5leGVjdXRlQWN0aW9uLmFkZChhLCBhY2Nlc3NMZXZlbCk7XHJcbiAgfVxyXG5cclxuICAkKHBlcm1pc3Npb24sIFtcclxuICAgIHZhbHVlcyxcclxuICAgIGZpbHRlcihwID0+ICFwLmlzTm9kZSksXHJcbiAgICBlYWNoKHAgPT4gcC5hZGQoYWNjZXNzTGV2ZWwpKSxcclxuICBdKTtcclxuXHJcbiAgcmV0dXJuIGFjY2Vzc0xldmVsLnBlcm1pc3Npb25zO1xyXG59O1xyXG4iLCJpbXBvcnQgeyBkaWZmZXJlbmNlLCBtYXAsIGpvaW4gfSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQge1xyXG4gIGdldExvY2ssIGlzTm9sb2NrLCByZWxlYXNlTG9jaywgJCxcclxuICBhcGlXcmFwcGVyLCBldmVudHMsXHJcbn0gZnJvbSAnLi4vY29tbW9uJztcclxuaW1wb3J0IHtcclxuICBVU0VSU19MT0NLX0ZJTEUsIEFDQ0VTU19MRVZFTFNfRklMRSxcclxuICBnZXRVc2VyQnlOYW1lLCBVU0VSU19MSVNUX0ZJTEUsXHJcbn0gZnJvbSAnLi9hdXRoQ29tbW9uJztcclxuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xyXG5pbXBvcnQgeyBOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0VXNlckFjY2Vzc0xldmVscyA9IGFwcCA9PiBhc3luYyAodXNlck5hbWUsIGFjY2Vzc0xldmVscykgPT4gYXBpV3JhcHBlcihcclxuICBhcHAsXHJcbiAgZXZlbnRzLmF1dGhBcGkuc2V0VXNlckFjY2Vzc0xldmVscyxcclxuICBwZXJtaXNzaW9uLnNldFVzZXJBY2Nlc3NMZXZlbHMuaXNBdXRob3JpemVkLFxyXG4gIHsgdXNlck5hbWUsIGFjY2Vzc0xldmVscyB9LFxyXG4gIF9zZXRVc2VyQWNjZXNzTGV2ZWxzLCBhcHAsIHVzZXJOYW1lLCBhY2Nlc3NMZXZlbHMsXHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgX3NldFVzZXJBY2Nlc3NMZXZlbHMgPSBhc3luYyAoYXBwLCB1c2VybmFtZSwgYWNjZXNzTGV2ZWxzKSA9PiB7XHJcbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldExvY2soYXBwLCBVU0VSU19MT0NLX0ZJTEUsIDEwMDAsIDEsIDApO1xyXG5cclxuICBjb25zdCBhY3R1YWxBY2Nlc3NMZXZlbHMgPSAkKFxyXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihBQ0NFU1NfTEVWRUxTX0ZJTEUpLFxyXG4gICAgW1xyXG4gICAgICBsID0+IGwubGV2ZWxzLFxyXG4gICAgICBtYXAobCA9PiBsLm5hbWUpLFxyXG4gICAgXSxcclxuICApO1xyXG5cclxuICBjb25zdCBtaXNzaW5nID0gZGlmZmVyZW5jZShhY2Nlc3NMZXZlbHMpKGFjdHVhbEFjY2Vzc0xldmVscyk7XHJcbiAgaWYgKG1pc3NpbmcubGVuZ3RoID4gMCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFjY2VzcyBsZXZlbHMgc3VwcGxpZWQ6ICR7am9pbignLCAnLCBtaXNzaW5nKX1gKTtcclxuICB9XHJcblxyXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIHNldCB1c2VyIGFjY2VzcyBsZXZlbHMgY2Fubm90IGdldCBsb2NrJyk7IH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihVU0VSU19MSVNUX0ZJTEUpO1xyXG4gICAgY29uc3QgdXNlciA9IGdldFVzZXJCeU5hbWUodXNlcnMsIHVzZXJuYW1lKTtcclxuICAgIGlmICghdXNlcikgeyB0aHJvdyBuZXcgTm90Rm91bmRFcnJvcihgQ291bGQgbm90IGZpbmQgdXNlciB3aXRoICR7dXNlcm5hbWV9YCk7IH1cclxuXHJcbiAgICB1c2VyLmFjY2Vzc0xldmVscyA9IGFjY2Vzc0xldmVscztcclxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihVU0VSU19MSVNUX0ZJTEUsIHVzZXJzKTtcclxuICB9IGZpbmFsbHkge1xyXG4gICAgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcclxuICB9XHJcbn07XHJcbiIsImltcG9ydCB7XHJcbiAgYXV0aGVudGljYXRlLFxyXG4gIGF1dGhlbnRpY2F0ZVRlbXBvcmFyeUFjY2VzcyxcclxufSBmcm9tICcuL2F1dGhlbnRpY2F0ZSc7XHJcbmltcG9ydCB7IGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyB9IGZyb20gJy4vY3JlYXRlVGVtcG9yYXJ5QWNjZXNzJztcclxuaW1wb3J0IHsgY3JlYXRlVXNlciB9IGZyb20gJy4vY3JlYXRlVXNlcic7XHJcbmltcG9ydCB7IGVuYWJsZVVzZXIsIGRpc2FibGVVc2VyIH0gZnJvbSAnLi9lbmFibGVVc2VyJztcclxuaW1wb3J0IHsgbG9hZEFjY2Vzc0xldmVscyB9IGZyb20gJy4vbG9hZEFjY2Vzc0xldmVscyc7XHJcbmltcG9ydCB7IGdldE5ld0FjY2Vzc0xldmVsIH0gZnJvbSAnLi9nZXROZXdBY2Nlc3NMZXZlbCc7XHJcbmltcG9ydCB7IGdldE5ld1VzZXIsIGdldE5ld1VzZXJBdXRoIH0gZnJvbSAnLi9nZXROZXdVc2VyJztcclxuaW1wb3J0IHsgZ2V0VXNlcnMgfSBmcm9tICcuL2dldFVzZXJzJztcclxuaW1wb3J0IHsgaXNBdXRob3JpemVkIH0gZnJvbSAnLi9pc0F1dGhvcml6ZWQnO1xyXG5pbXBvcnQgeyBzYXZlQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi9zYXZlQWNjZXNzTGV2ZWxzJztcclxuaW1wb3J0IHtcclxuICBjaGFuZ2VNeVBhc3N3b3JkLFxyXG4gIHNjb3JlUGFzc3dvcmQsIHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUsXHJcbiAgaXNWYWxpZFBhc3N3b3JkLFxyXG59IGZyb20gJy4vc2V0UGFzc3dvcmQnO1xyXG5pbXBvcnQgeyB2YWxpZGF0ZVVzZXIgfSBmcm9tICcuL3ZhbGlkYXRlVXNlcic7XHJcbmltcG9ydCB7IHZhbGlkYXRlQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi92YWxpZGF0ZUFjY2Vzc0xldmVscyc7XHJcbmltcG9ydCB7IGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zIH0gZnJvbSAnLi9nZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucyc7XHJcbmltcG9ydCB7IHNldFVzZXJBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL3NldFVzZXJBY2Nlc3NMZXZlbHMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEF1dGhBcGkgPSBhcHAgPT4gKHtcclxuICBhdXRoZW50aWNhdGU6IGF1dGhlbnRpY2F0ZShhcHApLFxyXG4gIGF1dGhlbnRpY2F0ZVRlbXBvcmFyeUFjY2VzczogYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzKGFwcCksXHJcbiAgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzOiBjcmVhdGVUZW1wb3JhcnlBY2Nlc3MoYXBwKSxcclxuICBjcmVhdGVVc2VyOiBjcmVhdGVVc2VyKGFwcCksXHJcbiAgbG9hZEFjY2Vzc0xldmVsczogbG9hZEFjY2Vzc0xldmVscyhhcHApLFxyXG4gIGVuYWJsZVVzZXI6IGVuYWJsZVVzZXIoYXBwKSxcclxuICBkaXNhYmxlVXNlcjogZGlzYWJsZVVzZXIoYXBwKSxcclxuICBnZXROZXdBY2Nlc3NMZXZlbDogZ2V0TmV3QWNjZXNzTGV2ZWwoYXBwKSxcclxuICBnZXROZXdVc2VyOiBnZXROZXdVc2VyKGFwcCksXHJcbiAgZ2V0TmV3VXNlckF1dGg6IGdldE5ld1VzZXJBdXRoKGFwcCksXHJcbiAgZ2V0VXNlcnM6IGdldFVzZXJzKGFwcCksXHJcbiAgc2F2ZUFjY2Vzc0xldmVsczogc2F2ZUFjY2Vzc0xldmVscyhhcHApLFxyXG4gIGlzQXV0aG9yaXplZDogaXNBdXRob3JpemVkKGFwcCksXHJcbiAgY2hhbmdlTXlQYXNzd29yZDogY2hhbmdlTXlQYXNzd29yZChhcHApLFxyXG4gIHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGU6IHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUoYXBwKSxcclxuICBzY29yZVBhc3N3b3JkLFxyXG4gIGlzVmFsaWRQYXNzd29yZDogaXNWYWxpZFBhc3N3b3JkKGFwcCksXHJcbiAgdmFsaWRhdGVVc2VyOiB2YWxpZGF0ZVVzZXIoYXBwKSxcclxuICB2YWxpZGF0ZUFjY2Vzc0xldmVsczogdmFsaWRhdGVBY2Nlc3NMZXZlbHMoYXBwKSxcclxuICBnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9uczogKCkgPT4gZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMoYXBwKSxcclxuICBzZXRVc2VyQWNjZXNzTGV2ZWxzOiBzZXRVc2VyQWNjZXNzTGV2ZWxzKGFwcCksXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2V0QXV0aEFwaTtcclxuIiwiaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xyXG5pbXBvcnQgeyBhcGlXcmFwcGVyU3luYyB9IGZyb20gJy4uL2NvbW1vbi9hcGlXcmFwcGVyJztcclxuaW1wb3J0IHsgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uL2V2ZW50cyc7XHJcblxyXG5leHBvcnQgY29uc3QgZXhlY3V0ZUFjdGlvbiA9IGFwcCA9PiAoYWN0aW9uTmFtZSwgb3B0aW9ucykgPT4ge1xyXG4gIGFwaVdyYXBwZXJTeW5jKFxyXG4gICAgYXBwLFxyXG4gICAgZXZlbnRzLmFjdGlvbnNBcGkuZXhlY3V0ZSxcclxuICAgIHBlcm1pc3Npb24uZXhlY3V0ZUFjdGlvbi5pc0F1dGhvcml6ZWQoYWN0aW9uTmFtZSksXHJcbiAgICB7IGFjdGlvbk5hbWUsIG9wdGlvbnMgfSxcclxuICAgIGFwcC5hY3Rpb25zW2FjdGlvbk5hbWVdLCBvcHRpb25zLFxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgX2V4ZWN1dGVBY3Rpb24gPSAoYmVoYXZpb3VyU291cmNlcywgYWN0aW9uLCBvcHRpb25zKSA9PiBiZWhhdmlvdXJTb3VyY2VzW2FjdGlvbi5iZWhhdmlvdXJTb3VyY2VdW2FjdGlvbi5iZWhhdmlvdXJOYW1lXShvcHRpb25zKTtcclxuIiwiaW1wb3J0IHsgZXhlY3V0ZUFjdGlvbiB9IGZyb20gJy4vZXhlY3V0ZSc7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0QWN0aW9uc0FwaSA9IGFwcCA9PiAoe1xyXG4gIGV4ZWN1dGU6IGV4ZWN1dGVBY3Rpb24oYXBwKSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXRBY3Rpb25zQXBpO1xyXG4iLCJpbXBvcnQgeyBoYXMgfSBmcm9tICdsb2Rhc2gnO1xyXG5cclxuY29uc3QgcHVibGlzaCA9IGhhbmRsZXJzID0+IGFzeW5jIChldmVudE5hbWUsIGNvbnRleHQgPSB7fSkgPT4ge1xyXG4gIGlmICghaGFzKGhhbmRsZXJzLCBldmVudE5hbWUpKSByZXR1cm47XHJcblxyXG4gIGZvciAoY29uc3QgaGFuZGxlciBvZiBoYW5kbGVyc1tldmVudE5hbWVdKSB7XHJcbiAgICBhd2FpdCBoYW5kbGVyKGV2ZW50TmFtZSwgY29udGV4dCk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3Qgc3Vic2NyaWJlID0gaGFuZGxlcnMgPT4gKGV2ZW50TmFtZSwgaGFuZGxlcikgPT4ge1xyXG4gIGlmICghaGFzKGhhbmRsZXJzLCBldmVudE5hbWUpKSB7XHJcbiAgICBoYW5kbGVyc1tldmVudE5hbWVdID0gW107XHJcbiAgfVxyXG4gIGhhbmRsZXJzW2V2ZW50TmFtZV0ucHVzaChoYW5kbGVyKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVFdmVudEFnZ3JlZ2F0b3IgPSAoKSA9PiB7XHJcbiAgY29uc3QgaGFuZGxlcnMgPSB7fTtcclxuICBjb25zdCBldmVudEFnZ3JlZ2F0b3IgPSAoe1xyXG4gICAgcHVibGlzaDogcHVibGlzaChoYW5kbGVycyksXHJcbiAgICBzdWJzY3JpYmU6IHN1YnNjcmliZShoYW5kbGVycyksXHJcbiAgfSk7XHJcbiAgcmV0dXJuIGV2ZW50QWdncmVnYXRvcjtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUV2ZW50QWdncmVnYXRvcjtcclxuIiwiaW1wb3J0IHsgcmV0cnkgfSBmcm9tICcuLi9jb21tb24vaW5kZXgnO1xyXG5pbXBvcnQgeyBOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XHJcblxyXG5jb25zdCBjcmVhdGVKc29uID0gb3JpZ2luYWxDcmVhdGVGaWxlID0+IGFzeW5jIChrZXksIG9iaiwgcmV0cmllcyA9IDUsIGRlbGF5ID0gNTAwKSA9PiBhd2FpdCByZXRyeShvcmlnaW5hbENyZWF0ZUZpbGUsIHJldHJpZXMsIGRlbGF5LCBrZXksIEpTT04uc3RyaW5naWZ5KG9iaikpO1xyXG5cclxuY29uc3QgY3JlYXRlTmV3RmlsZSA9IG9yaWdpbmFsQ3JlYXRlRmlsZSA9PiBhc3luYyAocGF0aCwgY29udGVudCwgcmV0cmllcyA9IDUsIGRlbGF5ID0gNTAwKSA9PiBhd2FpdCByZXRyeShvcmlnaW5hbENyZWF0ZUZpbGUsIHJldHJpZXMsIGRlbGF5LCBwYXRoLCBjb250ZW50KTtcclxuXHJcbmNvbnN0IGxvYWRKc29uID0gZGF0YXN0b3JlID0+IGFzeW5jIChrZXksIHJldHJpZXMgPSA1LCBkZWxheSA9IDUwMCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgcmV0cnkoSlNPTi5wYXJzZSwgcmV0cmllcywgZGVsYXksIGF3YWl0IGRhdGFzdG9yZS5sb2FkRmlsZShrZXkpKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGVyci5tZXNzYWdlKTtcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IHVwZGF0ZUpzb24gPSBkYXRhc3RvcmUgPT4gYXN5bmMgKGtleSwgb2JqLCByZXRyaWVzID0gNSwgZGVsYXkgPSA1MDApID0+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IHJldHJ5KGRhdGFzdG9yZS51cGRhdGVGaWxlLCByZXRyaWVzLCBkZWxheSwga2V5LCBKU09OLnN0cmluZ2lmeShvYmopKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGVyci5tZXNzYWdlKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXR1cERhdGFzdG9yZSA9IChkYXRhc3RvcmUpID0+IHtcclxuICBjb25zdCBvcmlnaW5hbENyZWF0ZUZpbGUgPSBkYXRhc3RvcmUuY3JlYXRlRmlsZTtcclxuICBkYXRhc3RvcmUubG9hZEpzb24gPSBsb2FkSnNvbihkYXRhc3RvcmUpO1xyXG4gIGRhdGFzdG9yZS5jcmVhdGVKc29uID0gY3JlYXRlSnNvbihvcmlnaW5hbENyZWF0ZUZpbGUpO1xyXG4gIGRhdGFzdG9yZS51cGRhdGVKc29uID0gdXBkYXRlSnNvbihkYXRhc3RvcmUpO1xyXG4gIGRhdGFzdG9yZS5jcmVhdGVGaWxlID0gY3JlYXRlTmV3RmlsZShvcmlnaW5hbENyZWF0ZUZpbGUpO1xyXG4gIGlmIChkYXRhc3RvcmUuY3JlYXRlRW1wdHlEYikgeyBkZWxldGUgZGF0YXN0b3JlLmNyZWF0ZUVtcHR5RGI7IH1cclxuICByZXR1cm4gZGF0YXN0b3JlO1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlRXZlbnRBZ2dyZWdhdG9yIH0gZnJvbSAnLi9ldmVudEFnZ3JlZ2F0b3InO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc2V0dXBEYXRhc3RvcmU7XHJcbiIsImltcG9ydCB7IFxyXG4gIGNvbXBpbGVFeHByZXNzaW9uIGFzIGNFeHAsIFxyXG4gIGNvbXBpbGVDb2RlIGFzIGNDb2RlIFxyXG59IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcclxuXHJcbmV4cG9ydCBjb25zdCBjb21waWxlQ29kZSA9IGNvZGUgPT4ge1xyXG4gIGxldCBmdW5jOyAgXHJcbiAgICBcclxuICB0cnkge1xyXG4gICAgZnVuYyA9IGNDb2RlKGNvZGUpO1xyXG4gIH0gY2F0Y2goZSkge1xyXG4gICAgZS5tZXNzYWdlID0gYEVycm9yIGNvbXBpbGluZyBjb2RlIDogJHtjb2RlfSA6ICR7ZS5tZXNzYWdlfWA7XHJcbiAgICB0aHJvdyBlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZ1bmM7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjb21waWxlRXhwcmVzc2lvbiA9IGNvZGUgPT4ge1xyXG4gIGxldCBmdW5jOyAgXHJcbiAgICAgIFxyXG4gIHRyeSB7XHJcbiAgICBmdW5jID0gY0V4cChjb2RlKTtcclxuICB9IGNhdGNoKGUpIHtcclxuICAgIGUubWVzc2FnZSA9IGBFcnJvciBjb21waWxpbmcgZXhwcmVzc2lvbiA6ICR7Y29kZX0gOiAke2UubWVzc2FnZX1gO1xyXG4gICAgdGhyb3cgZTtcclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIGZ1bmM7XHJcbn1cclxuIiwiaW1wb3J0IHtcclxuICBpc0Z1bmN0aW9uLCBmaWx0ZXIsIG1hcCxcclxuICB1bmlxQnksIGtleXMsIGRpZmZlcmVuY2UsXHJcbiAgam9pbiwgcmVkdWNlLCBmaW5kLFxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb21waWxlQ29kZSB9IGZyb20gJy4uL2NvbW1vbi9jb21waWxlQ29kZSc7XHJcbmltcG9ydCB7ICQgfSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQgeyBfZXhlY3V0ZUFjdGlvbiB9IGZyb20gJy4vZXhlY3V0ZSc7XHJcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciwgTm90Rm91bmRFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRpYWxpc2VBY3Rpb25zID0gKHN1YnNjcmliZSwgYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucywgdHJpZ2dlcnMsIGFwaXMpID0+IHtcclxuICB2YWxpZGF0ZVNvdXJjZXMoYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucyk7XHJcbiAgc3Vic2NyaWJlVHJpZ2dlcnMoc3Vic2NyaWJlLCBiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zLCB0cmlnZ2VycywgYXBpcyk7XHJcbiAgcmV0dXJuIGNyZWF0ZUFjdGlvbnNDb2xsZWN0aW9uKGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMpO1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlQWN0aW9uc0NvbGxlY3Rpb24gPSAoYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucykgPT4gJChhY3Rpb25zLCBbXHJcbiAgcmVkdWNlKChhbGwsIGEpID0+IHtcclxuICAgIGFsbFthLm5hbWVdID0gb3B0cyA9PiBfZXhlY3V0ZUFjdGlvbihiZWhhdmlvdXJTb3VyY2VzLCBhLCBvcHRzKTtcclxuICAgIHJldHVybiBhbGw7XHJcbiAgfSwge30pLFxyXG5dKTtcclxuXHJcbmNvbnN0IHN1YnNjcmliZVRyaWdnZXJzID0gKHN1YnNjcmliZSwgYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucywgdHJpZ2dlcnMsIGFwaXMpID0+IHtcclxuICBjb25zdCBjcmVhdGVPcHRpb25zID0gKG9wdGlvbnNDcmVhdG9yLCBldmVudENvbnRleHQpID0+IHtcclxuICAgIGlmICghb3B0aW9uc0NyZWF0b3IpIHJldHVybiB7fTtcclxuICAgIGNvbnN0IGNyZWF0ZSA9IGNvbXBpbGVDb2RlKG9wdGlvbnNDcmVhdG9yKTtcclxuICAgIHJldHVybiBjcmVhdGUoeyBjb250ZXh0OiBldmVudENvbnRleHQsIGFwaXMgfSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgc2hvdWxkUnVuVHJpZ2dlciA9ICh0cmlnZ2VyLCBldmVudENvbnRleHQpID0+IHtcclxuICAgIGlmICghdHJpZ2dlci5jb25kaXRpb24pIHJldHVybiB0cnVlO1xyXG4gICAgY29uc3Qgc2hvdWxkUnVuID0gY29tcGlsZUV4cHJlc3Npb24odHJpZ2dlci5jb25kaXRpb24pO1xyXG4gICAgcmV0dXJuIHNob3VsZFJ1bih7IGNvbnRleHQ6IGV2ZW50Q29udGV4dCB9KTtcclxuICB9O1xyXG5cclxuICBmb3IgKGxldCB0cmlnIG9mIHRyaWdnZXJzKSB7XHJcbiAgICBzdWJzY3JpYmUodHJpZy5ldmVudE5hbWUsIGFzeW5jIChldiwgY3R4KSA9PiB7XHJcbiAgICAgIGlmIChzaG91bGRSdW5UcmlnZ2VyKHRyaWcsIGN0eCkpIHtcclxuICAgICAgICBhd2FpdCBfZXhlY3V0ZUFjdGlvbihcclxuICAgICAgICAgIGJlaGF2aW91clNvdXJjZXMsXHJcbiAgICAgICAgICBmaW5kKGEgPT4gYS5uYW1lID09PSB0cmlnLmFjdGlvbk5hbWUpKGFjdGlvbnMpLFxyXG4gICAgICAgICAgY3JlYXRlT3B0aW9ucyh0cmlnLm9wdGlvbnNDcmVhdG9yLCBjdHgpLFxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IHZhbGlkYXRlU291cmNlcyA9IChiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zKSA9PiB7XHJcbiAgY29uc3QgZGVjbGFyZWRTb3VyY2VzID0gJChhY3Rpb25zLCBbXHJcbiAgICB1bmlxQnkoYSA9PiBhLmJlaGF2aW91clNvdXJjZSksXHJcbiAgICBtYXAoYSA9PiBhLmJlaGF2aW91clNvdXJjZSksXHJcbiAgXSk7XHJcblxyXG4gIGNvbnN0IHN1cHBsaWVkU291cmNlcyA9IGtleXMoYmVoYXZpb3VyU291cmNlcyk7XHJcblxyXG4gIGNvbnN0IG1pc3NpbmdTb3VyY2VzID0gZGlmZmVyZW5jZShcclxuICAgIGRlY2xhcmVkU291cmNlcywgc3VwcGxpZWRTb3VyY2VzLFxyXG4gICk7XHJcblxyXG4gIGlmIChtaXNzaW5nU291cmNlcy5sZW5ndGggPiAwKSB7XHJcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBEZWNsYXJlZCBiZWhhdmlvdXIgc291cmNlcyBhcmUgbm90IHN1cHBsaWVkOiAke2pvaW4oJywgJywgbWlzc2luZ1NvdXJjZXMpfWApO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgbWlzc2luZ0JlaGF2aW91cnMgPSAkKGFjdGlvbnMsIFtcclxuICAgIGZpbHRlcihhID0+ICFpc0Z1bmN0aW9uKGJlaGF2aW91clNvdXJjZXNbYS5iZWhhdmlvdXJTb3VyY2VdW2EuYmVoYXZpb3VyTmFtZV0pKSxcclxuICAgIG1hcChhID0+IGBBY3Rpb246ICR7YS5uYW1lfSA6ICR7YS5iZWhhdmlvdXJTb3VyY2V9LiR7YS5iZWhhdmlvdXJOYW1lfWApLFxyXG4gIF0pO1xyXG5cclxuICBpZiAobWlzc2luZ0JlaGF2aW91cnMubGVuZ3RoID4gMCkge1xyXG4gICAgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoYE1pc3NpbmcgYmVoYXZpb3VyczogY291bGQgbm90IGZpbmQgYmVoYXZpb3VyIGZ1bmN0aW9uczogJHtqb2luKCcsICcsIG1pc3NpbmdCZWhhdmlvdXJzKX1gKTtcclxuICB9XHJcbn07XHJcbiIsImltcG9ydCB7XHJcbiAgbWFwLCBmaWx0ZXIsIGdyb3VwQnksIHNwbGl0LFxyXG4gIHNvbWUsIGZpbmQsXHJcbn0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHtcclxuICBMT0NLX0ZJTEVOQU1FLCBUUkFOU0FDVElPTlNfRk9MREVSLCBpZFNlcCwgaXNVcGRhdGUsXHJcbiAgbm9kZUtleUhhc2hGcm9tQnVpbGRGb2xkZXIsIGlzQnVpbGRJbmRleEZvbGRlciwgZ2V0VHJhbnNhY3Rpb25JZCxcclxuICBpc0RlbGV0ZSwgaXNDcmVhdGUsXHJcbn0gZnJvbSAnLi90cmFuc2FjdGlvbnNDb21tb24nO1xyXG5pbXBvcnQge1xyXG4gIGpvaW5LZXksICQsIG5vbmUsIGlzU29tZXRoaW5nLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IGdldExhc3RQYXJ0SW5LZXksIGdldE5vZGVGcm9tTm9kZUtleUhhc2ggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBfbG9hZCB9IGZyb20gJy4uL3JlY29yZEFwaS9sb2FkJztcclxuXHJcbmV4cG9ydCBjb25zdCByZXRyaWV2ZSA9IGFzeW5jIChhcHApID0+IHtcclxuICBjb25zdCB0cmFuc2FjdGlvbkZpbGVzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5nZXRGb2xkZXJDb250ZW50cyhcclxuICAgIFRSQU5TQUNUSU9OU19GT0xERVIsXHJcbiAgKTtcclxuXHJcbiAgbGV0IHRyYW5zYWN0aW9ucyA9IFtdO1xyXG5cclxuICBpZiAoc29tZShpc0J1aWxkSW5kZXhGb2xkZXIpKHRyYW5zYWN0aW9uRmlsZXMpKSB7XHJcbiAgICBjb25zdCBidWlsZEluZGV4Rm9sZGVyID0gZmluZChpc0J1aWxkSW5kZXhGb2xkZXIpKHRyYW5zYWN0aW9uRmlsZXMpO1xyXG5cclxuICAgIHRyYW5zYWN0aW9ucyA9IGF3YWl0IHJldHJpZXZlQnVpbGRJbmRleFRyYW5zYWN0aW9ucyhcclxuICAgICAgYXBwLFxyXG4gICAgICBqb2luS2V5KFRSQU5TQUNUSU9OU19GT0xERVIsIGJ1aWxkSW5kZXhGb2xkZXIpLFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGlmICh0cmFuc2FjdGlvbnMubGVuZ3RoID4gMCkgcmV0dXJuIHRyYW5zYWN0aW9ucztcclxuXHJcbiAgcmV0dXJuIGF3YWl0IHJldHJpZXZlU3RhbmRhcmRUcmFuc2FjdGlvbnMoXHJcbiAgICBhcHAsIHRyYW5zYWN0aW9uRmlsZXMsXHJcbiAgKTtcclxufTtcclxuXHJcbmNvbnN0IHJldHJpZXZlQnVpbGRJbmRleFRyYW5zYWN0aW9ucyA9IGFzeW5jIChhcHAsIGJ1aWxkSW5kZXhGb2xkZXIpID0+IHtcclxuICBjb25zdCBjaGlsZEZvbGRlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZvbGRlckNvbnRlbnRzKGJ1aWxkSW5kZXhGb2xkZXIpO1xyXG4gIGlmIChjaGlsZEZvbGRlcnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAvLyBjbGVhbnVwXHJcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihidWlsZEluZGV4Rm9sZGVyKTtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGdldFRyYW5zYWN0aW9uRmlsZXMgPSBhc3luYyAoY2hpbGRGb2xkZXJJbmRleCA9IDApID0+IHtcclxuICAgIGlmIChjaGlsZEZvbGRlckluZGV4ID49IGNoaWxkRm9sZGVycy5sZW5ndGgpIHJldHVybiBbXTtcclxuXHJcbiAgICBjb25zdCBjaGlsZEZvbGRlcktleSA9IGpvaW5LZXkoYnVpbGRJbmRleEZvbGRlciwgY2hpbGRGb2xkZXJzW2NoaWxkRm9sZGVySW5kZXhdKTtcclxuICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5nZXRGb2xkZXJDb250ZW50cyhcclxuICAgICAgY2hpbGRGb2xkZXJLZXksXHJcbiAgICApO1xyXG5cclxuICAgIGlmIChmaWxlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoY2hpbGRGb2xkZXJLZXkpO1xyXG4gICAgICByZXR1cm4gYXdhaXQgZ2V0VHJhbnNhY3Rpb25GaWxlcyhjaGlsZEZvbGRlckluZGV4ICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHsgY2hpbGRGb2xkZXJLZXksIGZpbGVzIH07XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgdHJhbnNhY3Rpb25GaWxlcyA9IGF3YWl0IGdldFRyYW5zYWN0aW9uRmlsZXMoKTtcclxuXHJcbiAgaWYgKHRyYW5zYWN0aW9uRmlsZXMuZmlsZXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XHJcblxyXG4gIGNvbnN0IHRyYW5zYWN0aW9ucyA9ICQodHJhbnNhY3Rpb25GaWxlcy5maWxlcywgW1xyXG4gICAgbWFwKHBhcnNlVHJhbnNhY3Rpb25JZCksXHJcbiAgXSk7XHJcblxyXG4gIGZvciAoY29uc3QgdCBvZiB0cmFuc2FjdGlvbnMpIHtcclxuICAgIGNvbnN0IHRyYW5zYWN0aW9uQ29udGVudCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXHJcbiAgICAgIGpvaW5LZXkoXHJcbiAgICAgICAgdHJhbnNhY3Rpb25GaWxlcy5jaGlsZEZvbGRlcktleSxcclxuICAgICAgICB0LmZ1bGxJZCxcclxuICAgICAgKSxcclxuICAgICk7XHJcbiAgICB0LnJlY29yZCA9IGF3YWl0IF9sb2FkKGFwcCwgdHJhbnNhY3Rpb25Db250ZW50LnJlY29yZEtleSk7XHJcbiAgfVxyXG5cclxuICB0cmFuc2FjdGlvbnMuaW5kZXhOb2RlID0gJChidWlsZEluZGV4Rm9sZGVyLCBbXHJcbiAgICBnZXRMYXN0UGFydEluS2V5LFxyXG4gICAgbm9kZUtleUhhc2hGcm9tQnVpbGRGb2xkZXIsXHJcbiAgICBnZXROb2RlRnJvbU5vZGVLZXlIYXNoKGFwcC5oaWVyYXJjaHkpLFxyXG4gIF0pO1xyXG5cclxuICB0cmFuc2FjdGlvbnMuZm9sZGVyS2V5ID0gdHJhbnNhY3Rpb25GaWxlcy5jaGlsZEZvbGRlcktleTtcclxuXHJcbiAgcmV0dXJuIHRyYW5zYWN0aW9ucztcclxufTtcclxuXHJcbmNvbnN0IHJldHJpZXZlU3RhbmRhcmRUcmFuc2FjdGlvbnMgPSBhc3luYyAoYXBwLCB0cmFuc2FjdGlvbkZpbGVzKSA9PiB7XHJcbiAgY29uc3QgdHJhbnNhY3Rpb25JZHMgPSAkKHRyYW5zYWN0aW9uRmlsZXMsIFtcclxuICAgIGZpbHRlcihmID0+IGYgIT09IExPQ0tfRklMRU5BTUVcclxuICAgICAgICAgICAgICAgICAgICAmJiAhaXNCdWlsZEluZGV4Rm9sZGVyKGYpKSxcclxuICAgIG1hcChwYXJzZVRyYW5zYWN0aW9uSWQpLFxyXG4gIF0pO1xyXG5cclxuICBjb25zdCB0cmFuc2FjdGlvbklkc0J5UmVjb3JkID0gJCh0cmFuc2FjdGlvbklkcywgW1xyXG4gICAgZ3JvdXBCeSgncmVjb3JkSWQnKSxcclxuICBdKTtcclxuXHJcbiAgY29uc3QgZGVkdXBlZFRyYW5zYWN0aW9ucyA9IFtdO1xyXG5cclxuICBjb25zdCB2ZXJpZnkgPSBhc3luYyAodCkgPT4ge1xyXG4gICAgaWYgKHQudmVyaWZpZWQgPT09IHRydWUpIHJldHVybiB0O1xyXG5cclxuICAgIGNvbnN0IGlkID0gZ2V0VHJhbnNhY3Rpb25JZChcclxuICAgICAgdC5yZWNvcmRJZCxcclxuICAgICAgdC50cmFuc2FjdGlvblR5cGUsXHJcbiAgICAgIHQudW5pcXVlSWQsXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcclxuICAgICAgam9pbktleShUUkFOU0FDVElPTlNfRk9MREVSLCBpZCksXHJcbiAgICApO1xyXG5cclxuICAgIGlmIChpc0RlbGV0ZSh0KSkge1xyXG4gICAgICB0LnJlY29yZCA9IHRyYW5zYWN0aW9uLnJlY29yZDtcclxuICAgICAgdC52ZXJpZmllZCA9IHRydWU7XHJcbiAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlYyA9IGF3YWl0IF9sb2FkKFxyXG4gICAgICBhcHAsXHJcbiAgICAgIHRyYW5zYWN0aW9uLnJlY29yZEtleSxcclxuICAgICk7XHJcbiAgICBpZiAocmVjLnRyYW5zYWN0aW9uSWQgPT09IGlkKSB7XHJcbiAgICAgIHQucmVjb3JkID0gcmVjO1xyXG4gICAgICBpZiAodHJhbnNhY3Rpb24ub2xkUmVjb3JkKSB7IHQub2xkUmVjb3JkID0gdHJhbnNhY3Rpb24ub2xkUmVjb3JkOyB9XHJcbiAgICAgIHQudmVyaWZpZWQgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdC52ZXJpZmllZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0O1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHBpY2tPbmUgPSBhc3luYyAodHJhbnMsIGZvclR5cGUpID0+IHtcclxuICAgIGNvbnN0IHRyYW5zRm9yVHlwZSA9IGZpbHRlcihmb3JUeXBlKSh0cmFucyk7XHJcbiAgICBpZiAodHJhbnNGb3JUeXBlLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICBjb25zdCB0ID0gYXdhaXQgdmVyaWZ5KHRyYW5zRm9yVHlwZVswXSk7XHJcbiAgICAgIHJldHVybiAodC52ZXJpZmllZCA9PT0gdHJ1ZSA/IHQgOiBudWxsKTtcclxuICAgIH1cclxuICAgIGZvciAobGV0IHQgb2YgdHJhbnNGb3JUeXBlKSB7XHJcbiAgICAgIHQgPSBhd2FpdCB2ZXJpZnkodCk7XHJcbiAgICAgIGlmICh0LnZlcmlmaWVkID09PSB0cnVlKSB7IHJldHVybiB0OyB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfTtcclxuXHJcbiAgZm9yIChjb25zdCByZWNvcmRJZCBpbiB0cmFuc2FjdGlvbklkc0J5UmVjb3JkKSB7XHJcbiAgICBjb25zdCB0cmFuc0lkc0ZvclJlY29yZCA9IHRyYW5zYWN0aW9uSWRzQnlSZWNvcmRbcmVjb3JkSWRdO1xyXG4gICAgaWYgKHRyYW5zSWRzRm9yUmVjb3JkLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICBjb25zdCB0ID0gYXdhaXQgdmVyaWZ5KHRyYW5zSWRzRm9yUmVjb3JkWzBdKTtcclxuICAgICAgaWYgKHQudmVyaWZpZWQpIHsgZGVkdXBlZFRyYW5zYWN0aW9ucy5wdXNoKHQpOyB9XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG4gICAgaWYgKHNvbWUoaXNEZWxldGUpKHRyYW5zSWRzRm9yUmVjb3JkKSkge1xyXG4gICAgICBjb25zdCB0ID0gYXdhaXQgdmVyaWZ5KGZpbmQoaXNEZWxldGUpKHRyYW5zSWRzRm9yUmVjb3JkKSk7XHJcbiAgICAgIGlmICh0LnZlcmlmaWVkKSB7IGRlZHVwZWRUcmFuc2FjdGlvbnMucHVzaCh0KTsgfVxyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuICAgIGlmIChzb21lKGlzVXBkYXRlKSh0cmFuc0lkc0ZvclJlY29yZCkpIHtcclxuICAgICAgY29uc3QgdXBkID0gYXdhaXQgcGlja09uZSh0cmFuc0lkc0ZvclJlY29yZCwgaXNVcGRhdGUpO1xyXG4gICAgICBpZiAoaXNTb21ldGhpbmcodXBkKSAmJiB1cGQudmVyaWZpZWQpIHsgZGVkdXBlZFRyYW5zYWN0aW9ucy5wdXNoKHVwZCk7IH1cclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcbiAgICBpZiAoc29tZShpc0NyZWF0ZSkodHJhbnNJZHNGb3JSZWNvcmQpKSB7XHJcbiAgICAgIGNvbnN0IGNyZSA9IGF3YWl0IHBpY2tPbmUodHJhbnNJZHNGb3JSZWNvcmQsIGlzQ3JlYXRlKTtcclxuICAgICAgaWYgKGlzU29tZXRoaW5nKGNyZSkpIHsgZGVkdXBlZFRyYW5zYWN0aW9ucy5wdXNoKGNyZSk7IH1cclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdCBkdXBsaWNhdGVzID0gJCh0cmFuc2FjdGlvbklkcywgW1xyXG4gICAgZmlsdGVyKHQgPT4gbm9uZShkZHQgPT4gZGR0LnVuaXF1ZUlkID09PSB0LnVuaXF1ZUlkKShkZWR1cGVkVHJhbnNhY3Rpb25zKSksXHJcbiAgXSk7XHJcblxyXG5cclxuICBjb25zdCBkZWxldGVQcm9taXNlcyA9IG1hcCh0ID0+IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShcclxuICAgIGpvaW5LZXkoXHJcbiAgICAgIFRSQU5TQUNUSU9OU19GT0xERVIsXHJcbiAgICAgIGdldFRyYW5zYWN0aW9uSWQoXHJcbiAgICAgICAgdC5yZWNvcmRJZCxcclxuICAgICAgICB0LnRyYW5zYWN0aW9uVHlwZSxcclxuICAgICAgICB0LnVuaXF1ZUlkLFxyXG4gICAgICApLFxyXG4gICAgKSxcclxuICApKShkdXBsaWNhdGVzKTtcclxuXHJcbiAgYXdhaXQgUHJvbWlzZS5hbGwoZGVsZXRlUHJvbWlzZXMpO1xyXG5cclxuICByZXR1cm4gZGVkdXBlZFRyYW5zYWN0aW9ucztcclxufTtcclxuXHJcbmNvbnN0IHBhcnNlVHJhbnNhY3Rpb25JZCA9IChpZCkgPT4ge1xyXG4gIGNvbnN0IHNwbGl0SWQgPSBzcGxpdChpZFNlcCkoaWQpO1xyXG4gIHJldHVybiAoe1xyXG4gICAgcmVjb3JkSWQ6IHNwbGl0SWRbMF0sXHJcbiAgICB0cmFuc2FjdGlvblR5cGU6IHNwbGl0SWRbMV0sXHJcbiAgICB1bmlxdWVJZDogc3BsaXRJZFsyXSxcclxuICAgIGZ1bGxJZDogaWQsXHJcbiAgfSk7XHJcbn07XHJcbiIsImltcG9ydCB7IG9yZGVyQnkgfSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQge1xyXG4gIHJlZHVjZSwgZmluZCwgaW5jbHVkZXMsIGZsYXR0ZW4sIHVuaW9uLFxyXG4gIGZpbHRlciwgZWFjaCwgbWFwLFxyXG59IGZyb20gJ2xvZGFzaC9mcCc7XHJcbmltcG9ydCB7XHJcbiAgam9pbktleSwgc3BsaXRLZXksIGlzTm9uRW1wdHlTdHJpbmcsXHJcbiAgaXNOb3RoaW5nLCAkLCBpc1NvbWV0aGluZyxcclxufSBmcm9tICcuLi9jb21tb24nO1xyXG5pbXBvcnQge1xyXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSwgZ2V0Tm9kZSwgZ2V0UmVjb3JkTm9kZUlkLFxyXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsIHJlY29yZE5vZGVJZElzQWxsb3dlZCxcclxuICBpc1JlY29yZCwgaXNHbG9iYWxJbmRleCxcclxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBpbmRleFR5cGVzIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaW5kZXhlcyc7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0UmVsZXZhbnRBbmNlc3RvckluZGV4ZXMgPSAoYXBwSGllcmFyY2h5LCByZWNvcmQpID0+IHtcclxuICBjb25zdCBrZXkgPSByZWNvcmQua2V5O1xyXG4gIGNvbnN0IGtleVBhcnRzID0gc3BsaXRLZXkoa2V5KTtcclxuICBjb25zdCBub2RlSWQgPSBnZXRSZWNvcmROb2RlSWQoa2V5KTtcclxuXHJcbiAgY29uc3QgZmxhdEhpZXJhcmNoeSA9IG9yZGVyQnkoZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGFwcEhpZXJhcmNoeSksXHJcbiAgICBbbm9kZSA9PiBub2RlLnBhdGhSZWd4KCkubGVuZ3RoXSxcclxuICAgIFsnZGVzYyddKTtcclxuXHJcbiAgY29uc3QgbWFrZWluZGV4Tm9kZUFuZEtleV9Gb3JBbmNlc3RvckluZGV4ID0gKGluZGV4Tm9kZSwgaW5kZXhLZXkpID0+IG1ha2VJbmRleE5vZGVBbmRLZXkoaW5kZXhOb2RlLCBqb2luS2V5KGluZGV4S2V5LCBpbmRleE5vZGUubmFtZSkpO1xyXG5cclxuICBjb25zdCB0cmF2ZXJzZUFuY2VzdG9ySW5kZXhlc0luUGF0aCA9ICgpID0+IHJlZHVjZSgoYWNjLCBwYXJ0KSA9PiB7XHJcbiAgICBjb25zdCBjdXJyZW50SW5kZXhLZXkgPSBqb2luS2V5KGFjYy5sYXN0SW5kZXhLZXksIHBhcnQpO1xyXG4gICAgYWNjLmxhc3RJbmRleEtleSA9IGN1cnJlbnRJbmRleEtleTtcclxuICAgIGNvbnN0IHRlc3RQYXRoUmVneCA9IHAgPT4gbmV3IFJlZ0V4cChgJHtwLnBhdGhSZWd4KCl9JGApLnRlc3QoY3VycmVudEluZGV4S2V5KTtcclxuICAgIGNvbnN0IG5vZGVNYXRjaCA9IGZpbmQodGVzdFBhdGhSZWd4KShmbGF0SGllcmFyY2h5KTtcclxuXHJcbiAgICBpZiAoaXNOb3RoaW5nKG5vZGVNYXRjaCkpIHsgcmV0dXJuIGFjYzsgfVxyXG5cclxuICAgIGlmICghaXNSZWNvcmQobm9kZU1hdGNoKVxyXG4gICAgICAgICAgICAgICAgfHwgbm9kZU1hdGNoLmluZGV4ZXMubGVuZ3RoID09PSAwKSB7IHJldHVybiBhY2M7IH1cclxuXHJcbiAgICBjb25zdCBpbmRleGVzID0gJChub2RlTWF0Y2guaW5kZXhlcywgW1xyXG4gICAgICBmaWx0ZXIoaSA9PiBpLmluZGV4VHlwZSA9PT0gaW5kZXhUeXBlcy5hbmNlc3RvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAoaS5hbGxvd2VkUmVjb3JkTm9kZUlkcy5sZW5ndGggPT09IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGluY2x1ZGVzKG5vZGVJZCkoaS5hbGxvd2VkUmVjb3JkTm9kZUlkcykpKSxcclxuICAgIF0pO1xyXG5cclxuICAgIGVhY2godiA9PiBhY2Mubm9kZXNBbmRLZXlzLnB1c2goXHJcbiAgICAgIG1ha2VpbmRleE5vZGVBbmRLZXlfRm9yQW5jZXN0b3JJbmRleCh2LCBjdXJyZW50SW5kZXhLZXkpLFxyXG4gICAgKSkoaW5kZXhlcyk7XHJcblxyXG4gICAgcmV0dXJuIGFjYztcclxuICB9LCB7IGxhc3RJbmRleEtleTogJycsIG5vZGVzQW5kS2V5czogW10gfSkoa2V5UGFydHMpLm5vZGVzQW5kS2V5cztcclxuXHJcbiAgY29uc3Qgcm9vdEluZGV4ZXMgPSAkKGZsYXRIaWVyYXJjaHksIFtcclxuICAgIGZpbHRlcihuID0+IGlzR2xvYmFsSW5kZXgobikgJiYgcmVjb3JkTm9kZUlkSXNBbGxvd2VkKG4pKG5vZGVJZCkpLFxyXG4gICAgbWFwKGkgPT4gbWFrZUluZGV4Tm9kZUFuZEtleShpLCBpLm5vZGVLZXkoKSkpLFxyXG4gIF0pO1xyXG5cclxuICByZXR1cm4gdW5pb24odHJhdmVyc2VBbmNlc3RvckluZGV4ZXNJblBhdGgoKSkocm9vdEluZGV4ZXMpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFJlbGV2YW50UmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMgPSAoYXBwSGllcmFyY2h5LCByZWNvcmQpID0+ICQocmVjb3JkLmtleSwgW1xyXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwSGllcmFyY2h5KSxcclxuICBuID0+IG4uZmllbGRzLFxyXG4gIGZpbHRlcihmID0+IGYudHlwZSA9PT0gJ3JlZmVyZW5jZSdcclxuICAgICAgICAgICAgICAgICAgICAmJiBpc1NvbWV0aGluZyhyZWNvcmRbZi5uYW1lXSlcclxuICAgICAgICAgICAgICAgICAgICAmJiBpc05vbkVtcHR5U3RyaW5nKHJlY29yZFtmLm5hbWVdLmtleSkpLFxyXG4gIG1hcChmID0+ICQoZi50eXBlT3B0aW9ucy5yZXZlcnNlSW5kZXhOb2RlS2V5cywgW1xyXG4gICAgbWFwKG4gPT4gKHtcclxuICAgICAgcmVjb3JkTm9kZTogZ2V0Tm9kZShhcHBIaWVyYXJjaHksIG4pLFxyXG4gICAgICBmaWVsZDogZixcclxuICAgIH0pKSxcclxuICBdKSksXHJcbiAgZmxhdHRlbixcclxuICBtYXAobiA9PiBtYWtlSW5kZXhOb2RlQW5kS2V5KFxyXG4gICAgbi5yZWNvcmROb2RlLFxyXG4gICAgam9pbktleShyZWNvcmRbbi5maWVsZC5uYW1lXS5rZXksIG4ucmVjb3JkTm9kZS5uYW1lKSxcclxuICApKSxcclxuXSk7XHJcblxyXG5jb25zdCBtYWtlSW5kZXhOb2RlQW5kS2V5ID0gKGluZGV4Tm9kZSwgaW5kZXhLZXkpID0+ICh7IGluZGV4Tm9kZSwgaW5kZXhLZXkgfSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcztcclxuIiwiICAvLyBhZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2RleDRlci9qcy1wcm9taXNlLXdyaXRhYmxlXHJcbiAgLy8gVGhhbmsgeW91IDopIFxyXG4gIGV4cG9ydCBjb25zdCBwcm9taXNlV3JpdGVhYmxlU3RyZWFtID0gc3RyZWFtID0+IHtcclxuICBcclxuICAgIGxldCBfZXJyb3JlZDtcclxuICBcclxuICAgIGNvbnN0IF9lcnJvckhhbmRsZXIgPSBlcnIgPT4ge1xyXG4gICAgICAgIF9lcnJvcmVkID0gZXJyO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBfZXJyb3JIYW5kbGVyKTsgICAgXHJcbiAgXHJcbiAgICBjb25zdCB3cml0ZSA9IGNodW5rID0+IHsgIFxyXG4gICAgICBsZXQgcmVqZWN0ZWQgPSBmYWxzZTtcclxuICBcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBpZiAoX2Vycm9yZWQpIHtcclxuICAgICAgICAgIGNvbnN0IGVyciA9IF9lcnJvcmVkO1xyXG4gICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGlmICghc3RyZWFtLndyaXRhYmxlIHx8IHN0cmVhbS5jbG9zZWQgfHwgc3RyZWFtLmRlc3Ryb3llZCkge1xyXG4gICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJ3cml0ZSBhZnRlciBlbmRcIikpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBjb25zdCB3cml0ZUVycm9ySGFuZGxlciA9IGVyciA9PiB7XHJcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgIHJlamVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBzdHJlYW0ub25jZShcImVycm9yXCIsIHdyaXRlRXJyb3JIYW5kbGVyKTtcclxuICBcclxuICAgICAgICBjb25zdCBjYW5Xcml0ZSA9IHN0cmVhbS53cml0ZShjaHVuayk7XHJcbiAgXHJcbiAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgd3JpdGVFcnJvckhhbmRsZXIpO1xyXG4gIFxyXG4gICAgICAgIGlmIChjYW5Xcml0ZSkge1xyXG4gICAgICAgICAgaWYgKCFyZWplY3RlZCkge1xyXG4gICAgICAgICAgICByZXNvbHZlKGNodW5rLmxlbmd0aCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IGVyciA9PiB7XHJcbiAgICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcclxuICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgICBjb25zdCBkcmFpbkhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xyXG4gICAgICAgICAgICByZXNvbHZlKGNodW5rLmxlbmd0aCk7XHJcbiAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgICBjb25zdCBjbG9zZUhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xyXG4gICAgICAgICAgICByZXNvbHZlKGNodW5rLmxlbmd0aCk7XHJcbiAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgICBjb25zdCBmaW5pc2hIYW5kbGVyID0gKCkgPT4ge1xyXG4gICAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcclxuICAgICAgICAgICAgcmVzb2x2ZShjaHVuay5sZW5ndGgpO1xyXG4gICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgY29uc3QgcmVtb3ZlTGlzdGVuZXJzID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJjbG9zZVwiLCBjbG9zZUhhbmRsZXIpO1xyXG4gICAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJkcmFpblwiLCBkcmFpbkhhbmRsZXIpO1xyXG4gICAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xyXG4gICAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJmaW5pc2hcIiwgZmluaXNoSGFuZGxlcik7XHJcbiAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgICBzdHJlYW0ub24oXCJjbG9zZVwiLCBjbG9zZUhhbmRsZXIpO1xyXG4gICAgICAgICAgc3RyZWFtLm9uKFwiZHJhaW5cIiwgZHJhaW5IYW5kbGVyKTtcclxuICAgICAgICAgIHN0cmVhbS5vbihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XHJcbiAgICAgICAgICBzdHJlYW0ub24oXCJmaW5pc2hcIiwgZmluaXNoSGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIFxyXG4gICAgY29uc3QgZW5kID0gKCkgPT4ge1xyXG4gIFxyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGlmIChfZXJyb3JlZCkge1xyXG4gICAgICAgICAgY29uc3QgZXJyID0gX2Vycm9yZWQ7XHJcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgaWYgKCFzdHJlYW0ud3JpdGFibGUgfHwgc3RyZWFtLmNsb3NlZCB8fCBzdHJlYW0uZGVzdHJveWVkKSB7XHJcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBjb25zdCBmaW5pc2hIYW5kbGVyID0gKCkgPT4ge1xyXG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IChlcnIpID0+IHtcclxuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgY29uc3QgcmVtb3ZlTGlzdGVuZXJzID0gKCkgPT4ge1xyXG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgZXJyb3JIYW5kbGVyKTtcclxuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImZpbmlzaFwiLCBmaW5pc2hIYW5kbGVyKTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgc3RyZWFtLm9uKFwiZmluaXNoXCIsIGZpbmlzaEhhbmRsZXIpO1xyXG4gICAgICAgIHN0cmVhbS5vbihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XHJcbiAgXHJcbiAgICAgICAgc3RyZWFtLmVuZCgpO1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7d3JpdGUsIGVuZH07XHJcbiAgfVxyXG4gIFxyXG4gIGV4cG9ydCBkZWZhdWx0IHByb21pc2VXcml0ZWFibGVTdHJlYW1cclxuICAiLCJpbXBvcnQgeyBlbnN1cmVTaGFyZE5hbWVJc0luU2hhcmRNYXAgfSBmcm9tICcuL3NoYXJkaW5nJztcclxuaW1wb3J0IHsgZ2V0SW5kZXhXcml0ZXIgfSBmcm9tICcuL3NlcmlhbGl6ZXInO1xyXG5pbXBvcnQgeyBpc1NoYXJkZWRJbmRleCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XHJcbmltcG9ydCB7cHJvbWlzZVdyaXRlYWJsZVN0cmVhbX0gZnJvbSBcIi4vcHJvbWlzZVdyaXRhYmxlU3RyZWFtXCI7XHJcbmltcG9ydCB7cHJvbWlzZVJlYWRhYmxlU3RyZWFtfSBmcm9tIFwiLi9wcm9taXNlUmVhZGFibGVTdHJlYW1cIjtcclxuXHJcbmV4cG9ydCBjb25zdCBhcHBseVRvU2hhcmQgPSBhc3luYyAoaGllcmFyY2h5LCBzdG9yZSwgaW5kZXhLZXksXHJcbiAgaW5kZXhOb2RlLCBpbmRleFNoYXJkS2V5LCByZWNvcmRzVG9Xcml0ZSwga2V5c1RvUmVtb3ZlKSA9PiB7XHJcbiAgY29uc3QgY3JlYXRlSWZOb3RFeGlzdHMgPSByZWNvcmRzVG9Xcml0ZS5sZW5ndGggPiAwO1xyXG4gIGNvbnN0IHdyaXRlciA9IGF3YWl0IGdldFdyaXRlcihoaWVyYXJjaHksIHN0b3JlLCBpbmRleEtleSwgaW5kZXhTaGFyZEtleSwgaW5kZXhOb2RlLCBjcmVhdGVJZk5vdEV4aXN0cyk7XHJcbiAgaWYgKHdyaXRlciA9PT0gU0hBUkRfREVMRVRFRCkgcmV0dXJuO1xyXG5cclxuICBhd2FpdCB3cml0ZXIudXBkYXRlSW5kZXgocmVjb3Jkc1RvV3JpdGUsIGtleXNUb1JlbW92ZSk7XHJcbiAgYXdhaXQgc3dhcFRlbXBGaWxlSW4oc3RvcmUsIGluZGV4U2hhcmRLZXkpO1xyXG59O1xyXG5cclxuY29uc3QgU0hBUkRfREVMRVRFRCA9ICdTSEFSRF9ERUxFVEVEJztcclxuY29uc3QgZ2V0V3JpdGVyID0gYXN5bmMgKGhpZXJhcmNoeSwgc3RvcmUsIGluZGV4S2V5LCBpbmRleGVkRGF0YUtleSwgaW5kZXhOb2RlLCBjcmVhdGVJZk5vdEV4aXN0cykgPT4ge1xyXG4gIGxldCByZWFkYWJsZVN0cmVhbSA9IG51bGw7XHJcblxyXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleE5vZGUpKSB7XHJcbiAgICBhd2FpdCBlbnN1cmVTaGFyZE5hbWVJc0luU2hhcmRNYXAoc3RvcmUsIGluZGV4S2V5LCBpbmRleGVkRGF0YUtleSk7XHJcbiAgICBpZighYXdhaXQgc3RvcmUuZXhpc3RzKGluZGV4ZWREYXRhS2V5KSkge1xyXG4gICAgICBhd2FpdCBzdG9yZS5jcmVhdGVGaWxlKGluZGV4ZWREYXRhS2V5LCBcIlwiKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHRyeSB7XHJcblxyXG4gICAgcmVhZGFibGVTdHJlYW0gPSBwcm9taXNlUmVhZGFibGVTdHJlYW0oXHJcbiAgICAgICAgYXdhaXQgc3RvcmUucmVhZGFibGVGaWxlU3RyZWFtKGluZGV4ZWREYXRhS2V5KVxyXG4gICAgKTtcclxuXHJcbiAgfSBjYXRjaCAoZSkge1xyXG5cclxuICAgIGlmIChhd2FpdCBzdG9yZS5leGlzdHMoaW5kZXhlZERhdGFLZXkpKSB7XHJcbiAgICAgIHRocm93IGU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoY3JlYXRlSWZOb3RFeGlzdHMpIHsgXHJcbiAgICAgICAgYXdhaXQgc3RvcmUuY3JlYXRlRmlsZShpbmRleGVkRGF0YUtleSwgJycpOyBcclxuICAgICAgfSBlbHNlIHsgXHJcbiAgICAgICAgcmV0dXJuIFNIQVJEX0RFTEVURUQ7IFxyXG4gICAgICB9XHJcblxyXG4gICAgICByZWFkYWJsZVN0cmVhbSA9IHByb21pc2VSZWFkYWJsZVN0cmVhbShcclxuICAgICAgICAgIGF3YWl0IHN0b3JlLnJlYWRhYmxlRmlsZVN0cmVhbShpbmRleGVkRGF0YUtleSlcclxuICAgICAgKTtcclxuXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdCB3cml0YWJsZVN0cmVhbSA9IHByb21pc2VXcml0ZWFibGVTdHJlYW0oXHJcbiAgICAgIGF3YWl0IHN0b3JlLndyaXRhYmxlRmlsZVN0cmVhbShpbmRleGVkRGF0YUtleSArIFwiLnRlbXBcIilcclxuICApO1xyXG5cclxuICByZXR1cm4gZ2V0SW5kZXhXcml0ZXIoXHJcbiAgICBoaWVyYXJjaHksIGluZGV4Tm9kZSxcclxuICAgICAgICByZWFkYWJsZVN0cmVhbSwgd3JpdGFibGVTdHJlYW1cclxuICApO1xyXG59O1xyXG5cclxuY29uc3Qgc3dhcFRlbXBGaWxlSW4gPSBhc3luYyAoc3RvcmUsIGluZGV4ZWREYXRhS2V5LCBpc1JldHJ5ID0gZmFsc2UpID0+IHtcclxuICBjb25zdCB0ZW1wRmlsZSA9IGAke2luZGV4ZWREYXRhS2V5fS50ZW1wYDtcclxuICB0cnkge1xyXG4gICAgYXdhaXQgc3RvcmUuZGVsZXRlRmlsZShpbmRleGVkRGF0YUtleSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgLy8gaWdub3JlIGZhaWx1cmUsIGluY2FzZSBpdCBoYXMgbm90IGJlZW4gY3JlYXRlZCB5ZXRcclxuICB9XHJcbiAgdHJ5IHtcclxuICAgIGF3YWl0IHN0b3JlLnJlbmFtZUZpbGUodGVtcEZpbGUsIGluZGV4ZWREYXRhS2V5KTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICAvLyByZXRyeWluZyBpbiBjYXNlIGRlbGV0ZSBmYWlsdXJlIHdhcyBmb3Igc29tZSBvdGhlciByZWFzb25cclxuICAgIGlmICghaXNSZXRyeSkge1xyXG4gICAgICBhd2FpdCBzd2FwVGVtcEZpbGVJbihzdG9yZSwgaW5kZXhlZERhdGFLZXksIHRydWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIHN3YXAgaW4gaW5kZXggZmlsZWQ6IFwiICsgZS5tZXNzYWdlKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcbiIsImltcG9ydCB7XHJcbiAgZmlsdGVyLCBtYXAsIGlzVW5kZWZpbmVkLCBpbmNsdWRlcyxcclxuICBmbGF0dGVuLCBpbnRlcnNlY3Rpb25CeSxcclxuICBpc0VxdWFsLCBwdWxsLCBrZXlzLFxyXG4gIGRpZmZlcmVuY2VCeSwgZGlmZmVyZW5jZSxcclxufSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5pbXBvcnQgeyB1bmlvbiB9IGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7XHJcbiAgZ2V0UmVsZXZhbnRBbmNlc3RvckluZGV4ZXMsXHJcbiAgZ2V0UmVsZXZhbnRSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyxcclxufSBmcm9tICcuLi9pbmRleGluZy9yZWxldmFudCc7XHJcbmltcG9ydCB7IGV2YWx1YXRlIH0gZnJvbSAnLi4vaW5kZXhpbmcvZXZhbHVhdGUnO1xyXG5pbXBvcnQge1xyXG4gICQsIGlzU29tZXRoaW5nLFxyXG4gIGlzTm9uRW1wdHlBcnJheSwgam9pbktleSxcclxuICBpc05vbkVtcHR5U3RyaW5nLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IGdldEluZGV4ZWREYXRhS2V5IH0gZnJvbSAnLi4vaW5kZXhpbmcvc2hhcmRpbmcnO1xyXG5pbXBvcnQge1xyXG4gIGlzVXBkYXRlLCBpc0NyZWF0ZSxcclxuICBpc0RlbGV0ZSwgaXNCdWlsZEluZGV4LFxyXG59IGZyb20gJy4vdHJhbnNhY3Rpb25zQ29tbW9uJztcclxuaW1wb3J0IHsgYXBwbHlUb1NoYXJkIH0gZnJvbSAnLi4vaW5kZXhpbmcvYXBwbHknO1xyXG5pbXBvcnQge1xyXG4gIGdldEFjdHVhbEtleU9mUGFyZW50LFxyXG4gIGlzR2xvYmFsSW5kZXgsIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4LCBpc1JlZmVyZW5jZUluZGV4LFxyXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXHJcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcclxuXHJcbmV4cG9ydCBjb25zdCBleGVjdXRlVHJhbnNhY3Rpb25zID0gYXBwID0+IGFzeW5jICh0cmFuc2FjdGlvbnMpID0+IHtcclxuICBjb25zdCByZWNvcmRzQnlTaGFyZCA9IG1hcHBlZFJlY29yZHNCeUluZGV4U2hhcmQoYXBwLmhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKTtcclxuXHJcbiAgZm9yIChjb25zdCBzaGFyZCBvZiBrZXlzKHJlY29yZHNCeVNoYXJkKSkge1xyXG4gICAgYXdhaXQgYXBwbHlUb1NoYXJkKFxyXG4gICAgICBhcHAuaGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlLFxyXG4gICAgICByZWNvcmRzQnlTaGFyZFtzaGFyZF0uaW5kZXhLZXksXHJcbiAgICAgIHJlY29yZHNCeVNoYXJkW3NoYXJkXS5pbmRleE5vZGUsXHJcbiAgICAgIHNoYXJkLFxyXG4gICAgICByZWNvcmRzQnlTaGFyZFtzaGFyZF0ud3JpdGVzLFxyXG4gICAgICByZWNvcmRzQnlTaGFyZFtzaGFyZF0ucmVtb3ZlcyxcclxuICAgICk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgbWFwcGVkUmVjb3Jkc0J5SW5kZXhTaGFyZCA9IChoaWVyYXJjaHksIHRyYW5zYWN0aW9ucykgPT4ge1xyXG4gIGNvbnN0IHVwZGF0ZXMgPSBnZXRVcGRhdGVUcmFuc2FjdGlvbnNCeVNoYXJkKFxyXG4gICAgaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMsXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgY3JlYXRlZCA9IGdldENyZWF0ZVRyYW5zYWN0aW9uc0J5U2hhcmQoXHJcbiAgICBoaWVyYXJjaHksIHRyYW5zYWN0aW9ucyxcclxuICApO1xyXG4gIGNvbnN0IGRlbGV0ZXMgPSBnZXREZWxldGVUcmFuc2FjdGlvbnNCeVNoYXJkKFxyXG4gICAgaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMsXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgaW5kZXhCdWlsZCA9IGdldEJ1aWxkSW5kZXhUcmFuc2FjdGlvbnNCeVNoYXJkKFxyXG4gICAgaGllcmFyY2h5LFxyXG4gICAgdHJhbnNhY3Rpb25zLFxyXG4gICk7XHJcblxyXG4gIGNvbnN0IHRvUmVtb3ZlID0gW1xyXG4gICAgLi4uZGVsZXRlcyxcclxuICAgIC4uLnVwZGF0ZXMudG9SZW1vdmUsXHJcbiAgXTtcclxuXHJcbiAgY29uc3QgdG9Xcml0ZSA9IFtcclxuICAgIC4uLmNyZWF0ZWQsXHJcbiAgICAuLi51cGRhdGVzLnRvV3JpdGUsXHJcbiAgICAuLi5pbmRleEJ1aWxkLFxyXG4gIF07XHJcblxyXG4gIGNvbnN0IHRyYW5zQnlTaGFyZCA9IHt9O1xyXG5cclxuICBjb25zdCBpbml0aWFsaXNlU2hhcmQgPSAodCkgPT4ge1xyXG4gICAgaWYgKGlzVW5kZWZpbmVkKHRyYW5zQnlTaGFyZFt0LmluZGV4U2hhcmRLZXldKSkge1xyXG4gICAgICB0cmFuc0J5U2hhcmRbdC5pbmRleFNoYXJkS2V5XSA9IHtcclxuICAgICAgICB3cml0ZXM6IFtdLFxyXG4gICAgICAgIHJlbW92ZXM6IFtdLFxyXG4gICAgICAgIGluZGV4S2V5OiB0LmluZGV4S2V5LFxyXG4gICAgICAgIGluZGV4Tm9kZUtleTogdC5pbmRleE5vZGVLZXksXHJcbiAgICAgICAgaW5kZXhOb2RlOiB0LmluZGV4Tm9kZSxcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBmb3IgKGNvbnN0IHRyYW5zIG9mIHRvV3JpdGUpIHtcclxuICAgIGluaXRpYWxpc2VTaGFyZCh0cmFucyk7XHJcbiAgICB0cmFuc0J5U2hhcmRbdHJhbnMuaW5kZXhTaGFyZEtleV0ud3JpdGVzLnB1c2goXHJcbiAgICAgIHRyYW5zLm1hcHBlZFJlY29yZC5yZXN1bHQsXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZm9yIChjb25zdCB0cmFucyBvZiB0b1JlbW92ZSkge1xyXG4gICAgaW5pdGlhbGlzZVNoYXJkKHRyYW5zKTtcclxuICAgIHRyYW5zQnlTaGFyZFt0cmFucy5pbmRleFNoYXJkS2V5XS5yZW1vdmVzLnB1c2goXHJcbiAgICAgIHRyYW5zLm1hcHBlZFJlY29yZC5yZXN1bHQua2V5LFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0cmFuc0J5U2hhcmQ7XHJcbn07XHJcblxyXG5jb25zdCBnZXRVcGRhdGVUcmFuc2FjdGlvbnNCeVNoYXJkID0gKGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKSA9PiB7XHJcbiAgY29uc3QgdXBkYXRlVHJhbnNhY3Rpb25zID0gJCh0cmFuc2FjdGlvbnMsIFtmaWx0ZXIoaXNVcGRhdGUpXSk7XHJcblxyXG4gIGNvbnN0IGV2YWx1YXRlSW5kZXggPSAocmVjb3JkLCBpbmRleE5vZGVBbmRQYXRoKSA9PiB7XHJcbiAgICBjb25zdCBtYXBwZWRSZWNvcmQgPSBldmFsdWF0ZShyZWNvcmQpKGluZGV4Tm9kZUFuZFBhdGguaW5kZXhOb2RlKTtcclxuICAgIHJldHVybiAoe1xyXG4gICAgICBtYXBwZWRSZWNvcmQsXHJcbiAgICAgIGluZGV4Tm9kZTogaW5kZXhOb2RlQW5kUGF0aC5pbmRleE5vZGUsXHJcbiAgICAgIGluZGV4S2V5OiBpbmRleE5vZGVBbmRQYXRoLmluZGV4S2V5LFxyXG4gICAgICBpbmRleFNoYXJkS2V5OiBnZXRJbmRleGVkRGF0YUtleShcclxuICAgICAgICBpbmRleE5vZGVBbmRQYXRoLmluZGV4Tm9kZSxcclxuICAgICAgICBpbmRleE5vZGVBbmRQYXRoLmluZGV4S2V5LFxyXG4gICAgICAgIG1hcHBlZFJlY29yZC5yZXN1bHQsXHJcbiAgICAgICksXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBnZXRJbmRleE5vZGVzVG9BcHBseSA9IGluZGV4RmlsdGVyID0+ICh0LCBpbmRleGVzKSA9PiAkKGluZGV4ZXMsIFtcclxuICAgIG1hcChuID0+ICh7XHJcbiAgICAgIG9sZDogZXZhbHVhdGVJbmRleCh0Lm9sZFJlY29yZCwgbiksXHJcbiAgICAgIG5ldzogZXZhbHVhdGVJbmRleCh0LnJlY29yZCwgbiksXHJcbiAgICB9KSksXHJcbiAgICBmaWx0ZXIoaW5kZXhGaWx0ZXIpLFxyXG4gIF0pO1xyXG5cclxuICBjb25zdCB0b1JlbW92ZUZpbHRlciA9IChuLCBpc1VucmVmZXJlbmNlZCkgPT4gbi5vbGQubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gdHJ1ZVxyXG4gICAgICAgICYmIChuLm5ldy5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSBmYWxzZVxyXG4gICAgICAgICAgICB8fCBpc1VucmVmZXJlbmNlZCk7XHJcblxyXG4gIGNvbnN0IHRvQWRkRmlsdGVyID0gKG4sIGlzTmV3bHlSZWZlcmVuY2VkKSA9PiAobi5vbGQubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gZmFsc2VcclxuICAgICAgICB8fCBpc05ld2x5UmVmZXJlbmNlZClcclxuICAgICAgICAmJiBuLm5ldy5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSB0cnVlO1xyXG5cclxuICBjb25zdCB0b1VwZGF0ZUZpbHRlciA9IG4gPT4gbi5uZXcubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gdHJ1ZVxyXG4gICAgICAgICYmIG4ub2xkLm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IHRydWVcclxuICAgICAgICAmJiAhaXNFcXVhbChuLm9sZC5tYXBwZWRSZWNvcmQucmVzdWx0LFxyXG4gICAgICAgICAgbi5uZXcubWFwcGVkUmVjb3JkLnJlc3VsdCk7XHJcblxyXG4gIGNvbnN0IHRvUmVtb3ZlID0gW107XHJcbiAgY29uc3QgdG9Xcml0ZSA9IFtdO1xyXG5cclxuICBmb3IgKGNvbnN0IHQgb2YgdXBkYXRlVHJhbnNhY3Rpb25zKSB7XHJcbiAgICBjb25zdCBhbmNlc3RvcklkeHMgPSBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcyhcclxuICAgICAgaGllcmFyY2h5LCB0LnJlY29yZCxcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgcmVmZXJlbmNlQ2hhbmdlcyA9IGRpZmZSZXZlcnNlUmVmRm9yVXBkYXRlKFxyXG4gICAgICBoaWVyYXJjaHksIHQub2xkUmVjb3JkLCB0LnJlY29yZCxcclxuICAgICk7XHJcblxyXG4gICAgLy8gb2xkIHJlY29yZHMgdG8gcmVtb3ZlIChmaWx0ZXJlZCBvdXQpXHJcbiAgICBjb25zdCBmaWx0ZXJlZE91dF90b1JlbW92ZSA9IHVuaW9uKFxyXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b1JlbW92ZUZpbHRlcikodCwgYW5jZXN0b3JJZHhzKSxcclxuICAgICAgLy8gc3RpbGwgcmVmZXJlbmNlZCAtIGNoZWNrIGZpbHRlclxyXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b1JlbW92ZUZpbHRlcikodCwgcmVmZXJlbmNlQ2hhbmdlcy5ub3RDaGFuZ2VkKSxcclxuICAgICAgLy8gdW4gcmVmZXJlbmNlZCAtIHJlbW92ZSBpZiBpbiB0aGVyZSBhbHJlYWR5XHJcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KG4gPT4gdG9SZW1vdmVGaWx0ZXIobiwgdHJ1ZSkpKHQsIHJlZmVyZW5jZUNoYW5nZXMudW5SZWZlcmVuY2VkKSxcclxuICAgICk7XHJcblxyXG4gICAgLy8gbmV3IHJlY29yZHMgdG8gYWRkIChmaWx0ZXJlZCBpbilcclxuICAgIGNvbnN0IGZpbHRlcmVkSW5fdG9BZGQgPSB1bmlvbihcclxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodG9BZGRGaWx0ZXIpKHQsIGFuY2VzdG9ySWR4cyksXHJcbiAgICAgIC8vIG5ld2x5IHJlZmVyZW5jZWQgLSBjaGVjayBmaWx0ZXJcclxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkobiA9PiB0b0FkZEZpbHRlcihuLCB0cnVlKSkodCwgcmVmZXJlbmNlQ2hhbmdlcy5uZXdseVJlZmVyZW5jZWQpLFxyXG4gICAgICAvLyByZWZlcmVuY2UgdW5jaGFuZ2VkIC0gcmVydW4gZmlsdGVyIGluIGNhc2Ugc29tZXRoaW5nIGVsc2UgY2hhbmdlZFxyXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b0FkZEZpbHRlcikodCwgcmVmZXJlbmNlQ2hhbmdlcy5ub3RDaGFuZ2VkKSxcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgY2hhbmdlZCA9IHVuaW9uKFxyXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b1VwZGF0ZUZpbHRlcikodCwgYW5jZXN0b3JJZHhzKSxcclxuICAgICAgLy8gc3RpbGwgcmVmZXJlbmNlZCAtIHJlY2hlY2sgZmlsdGVyXHJcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvVXBkYXRlRmlsdGVyKSh0LCByZWZlcmVuY2VDaGFuZ2VzLm5vdENoYW5nZWQpLFxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBzaGFyZEtleUNoYW5nZWQgPSAkKGNoYW5nZWQsIFtcclxuICAgICAgZmlsdGVyKGMgPT4gYy5vbGQuaW5kZXhTaGFyZEtleSAhPT0gYy5uZXcuaW5kZXhTaGFyZEtleSksXHJcbiAgICBdKTtcclxuXHJcbiAgICBjb25zdCBjaGFuZ2VkSW5TYW1lU2hhcmQgPSAkKHNoYXJkS2V5Q2hhbmdlZCwgW1xyXG4gICAgICBkaWZmZXJlbmNlKGNoYW5nZWQpLFxyXG4gICAgXSk7XHJcblxyXG4gICAgZm9yIChjb25zdCByZXMgb2Ygc2hhcmRLZXlDaGFuZ2VkKSB7XHJcbiAgICAgIHB1bGwocmVzKShjaGFuZ2VkKTtcclxuICAgICAgZmlsdGVyZWRPdXRfdG9SZW1vdmUucHVzaChyZXMpO1xyXG4gICAgICBmaWx0ZXJlZEluX3RvQWRkLnB1c2gocmVzKTtcclxuICAgIH1cclxuXHJcbiAgICB0b1JlbW92ZS5wdXNoKFxyXG4gICAgICAkKGZpbHRlcmVkT3V0X3RvUmVtb3ZlLCBbXHJcbiAgICAgICAgbWFwKGkgPT4gaS5vbGQpLFxyXG4gICAgICBdKSxcclxuICAgICk7XHJcblxyXG4gICAgdG9Xcml0ZS5wdXNoKFxyXG4gICAgICAkKGZpbHRlcmVkSW5fdG9BZGQsIFtcclxuICAgICAgICBtYXAoaSA9PiBpLm5ldyksXHJcbiAgICAgIF0pLFxyXG4gICAgKTtcclxuXHJcbiAgICB0b1dyaXRlLnB1c2goXHJcbiAgICAgICQoY2hhbmdlZEluU2FtZVNoYXJkLCBbXHJcbiAgICAgICAgbWFwKGkgPT4gaS5uZXcpLFxyXG4gICAgICBdKSxcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKHtcclxuICAgIHRvUmVtb3ZlOiBmbGF0dGVuKHRvUmVtb3ZlKSxcclxuICAgIHRvV3JpdGU6IGZsYXR0ZW4odG9Xcml0ZSksXHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBnZXRCdWlsZEluZGV4VHJhbnNhY3Rpb25zQnlTaGFyZCA9IChoaWVyYXJjaHksIHRyYW5zYWN0aW9ucykgPT4ge1xyXG4gIGNvbnN0IGJ1aWxkVHJhbnNhY3Rpb25zID0gJCh0cmFuc2FjdGlvbnMsIFtmaWx0ZXIoaXNCdWlsZEluZGV4KV0pO1xyXG4gIGlmICghaXNOb25FbXB0eUFycmF5KGJ1aWxkVHJhbnNhY3Rpb25zKSkgcmV0dXJuIFtdO1xyXG4gIGNvbnN0IGluZGV4Tm9kZSA9IHRyYW5zYWN0aW9ucy5pbmRleE5vZGU7XHJcblxyXG4gIGNvbnN0IGdldEluZGV4S2V5cyA9ICh0KSA9PiB7XHJcbiAgICBpZiAoaXNHbG9iYWxJbmRleChpbmRleE5vZGUpKSB7XHJcbiAgICAgIHJldHVybiBbaW5kZXhOb2RlLm5vZGVLZXkoKV07XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzUmVmZXJlbmNlSW5kZXgoaW5kZXhOb2RlKSkge1xyXG4gICAgICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChoaWVyYXJjaHkpKHQucmVjb3JkLmtleSk7XHJcbiAgICAgIGNvbnN0IHJlZkZpZWxkcyA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcclxuICAgICAgICBmaWx0ZXIoZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXgoaW5kZXhOb2RlKSksXHJcbiAgICAgIF0pO1xyXG4gICAgICBjb25zdCBpbmRleEtleXMgPSBbXTtcclxuICAgICAgZm9yIChjb25zdCByZWZGaWVsZCBvZiByZWZGaWVsZHMpIHtcclxuICAgICAgICBjb25zdCByZWZWYWx1ZSA9IHQucmVjb3JkW3JlZkZpZWxkLm5hbWVdO1xyXG4gICAgICAgIGlmIChpc1NvbWV0aGluZyhyZWZWYWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICYmIGlzTm9uRW1wdHlTdHJpbmcocmVmVmFsdWUua2V5KSkge1xyXG4gICAgICAgICAgY29uc3QgaW5kZXhLZXkgPSBqb2luS2V5KFxyXG4gICAgICAgICAgICByZWZWYWx1ZS5rZXksXHJcbiAgICAgICAgICAgIGluZGV4Tm9kZS5uYW1lLFxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICBpZiAoIWluY2x1ZGVzKGluZGV4S2V5KShpbmRleEtleXMpKSB7IGluZGV4S2V5cy5wdXNoKGluZGV4S2V5KTsgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gaW5kZXhLZXlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBbam9pbktleShcclxuICAgICAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQoXHJcbiAgICAgICAgaW5kZXhOb2RlLnBhcmVudCgpLm5vZGVLZXkoKSxcclxuICAgICAgICB0LnJlY29yZC5rZXksXHJcbiAgICAgICksXHJcbiAgICAgIGluZGV4Tm9kZS5uYW1lLFxyXG4gICAgKV07XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuICQoYnVpbGRUcmFuc2FjdGlvbnMsIFtcclxuICAgIG1hcCgodCkgPT4ge1xyXG4gICAgICBjb25zdCBtYXBwZWRSZWNvcmQgPSBldmFsdWF0ZSh0LnJlY29yZCkoaW5kZXhOb2RlKTtcclxuICAgICAgaWYgKCFtYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyKSByZXR1cm4gbnVsbDtcclxuICAgICAgY29uc3QgaW5kZXhLZXlzID0gZ2V0SW5kZXhLZXlzKHQpO1xyXG4gICAgICByZXR1cm4gJChpbmRleEtleXMsIFtcclxuICAgICAgICBtYXAoaW5kZXhLZXkgPT4gKHtcclxuICAgICAgICAgIG1hcHBlZFJlY29yZCxcclxuICAgICAgICAgIGluZGV4Tm9kZSxcclxuICAgICAgICAgIGluZGV4S2V5LFxyXG4gICAgICAgICAgaW5kZXhTaGFyZEtleTogZ2V0SW5kZXhlZERhdGFLZXkoXHJcbiAgICAgICAgICAgIGluZGV4Tm9kZSxcclxuICAgICAgICAgICAgaW5kZXhLZXksXHJcbiAgICAgICAgICAgIG1hcHBlZFJlY29yZC5yZXN1bHQsXHJcbiAgICAgICAgICApLFxyXG4gICAgICAgIH0pKSxcclxuICAgICAgXSk7XHJcbiAgICB9KSxcclxuICAgIGZsYXR0ZW4sXHJcbiAgICBmaWx0ZXIoaXNTb21ldGhpbmcpLFxyXG4gIF0pO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0X0NyZWF0ZV9EZWxldGVfVHJhbnNhY3Rpb25zQnlTaGFyZCA9IHByZWQgPT4gKGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKSA9PiB7XHJcbiAgY29uc3QgY3JlYXRlVHJhbnNhY3Rpb25zID0gJCh0cmFuc2FjdGlvbnMsIFtmaWx0ZXIocHJlZCldKTtcclxuXHJcbiAgY29uc3QgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkgPSAodCwgaW5kZXhlcykgPT4gJChpbmRleGVzLCBbXHJcbiAgICBtYXAoKG4pID0+IHtcclxuICAgICAgY29uc3QgbWFwcGVkUmVjb3JkID0gZXZhbHVhdGUodC5yZWNvcmQpKG4uaW5kZXhOb2RlKTtcclxuICAgICAgcmV0dXJuICh7XHJcbiAgICAgICAgbWFwcGVkUmVjb3JkLFxyXG4gICAgICAgIGluZGV4Tm9kZTogbi5pbmRleE5vZGUsXHJcbiAgICAgICAgaW5kZXhLZXk6IG4uaW5kZXhLZXksXHJcbiAgICAgICAgaW5kZXhTaGFyZEtleTogZ2V0SW5kZXhlZERhdGFLZXkoXHJcbiAgICAgICAgICBuLmluZGV4Tm9kZSxcclxuICAgICAgICAgIG4uaW5kZXhLZXksXHJcbiAgICAgICAgICBtYXBwZWRSZWNvcmQucmVzdWx0LFxyXG4gICAgICAgICksXHJcbiAgICAgIH0pO1xyXG4gICAgfSksXHJcbiAgICBmaWx0ZXIobiA9PiBuLm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIpLFxyXG4gIF0pO1xyXG5cclxuICBjb25zdCBhbGxUb0FwcGx5ID0gW107XHJcblxyXG4gIGZvciAoY29uc3QgdCBvZiBjcmVhdGVUcmFuc2FjdGlvbnMpIHtcclxuICAgIGNvbnN0IGFuY2VzdG9ySWR4cyA9IGdldFJlbGV2YW50QW5jZXN0b3JJbmRleGVzKGhpZXJhcmNoeSwgdC5yZWNvcmQpO1xyXG4gICAgY29uc3QgcmV2ZXJzZVJlZiA9IGdldFJlbGV2YW50UmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMoaGllcmFyY2h5LCB0LnJlY29yZCk7XHJcblxyXG4gICAgYWxsVG9BcHBseS5wdXNoKFxyXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0LCBhbmNlc3RvcklkeHMpLFxyXG4gICAgKTtcclxuICAgIGFsbFRvQXBwbHkucHVzaChcclxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodCwgcmV2ZXJzZVJlZiksXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZsYXR0ZW4oYWxsVG9BcHBseSk7XHJcbn07XHJcblxyXG5jb25zdCBnZXREZWxldGVUcmFuc2FjdGlvbnNCeVNoYXJkID0gZ2V0X0NyZWF0ZV9EZWxldGVfVHJhbnNhY3Rpb25zQnlTaGFyZChpc0RlbGV0ZSk7XHJcblxyXG5jb25zdCBnZXRDcmVhdGVUcmFuc2FjdGlvbnNCeVNoYXJkID0gZ2V0X0NyZWF0ZV9EZWxldGVfVHJhbnNhY3Rpb25zQnlTaGFyZChpc0NyZWF0ZSk7XHJcblxyXG5jb25zdCBkaWZmUmV2ZXJzZVJlZkZvclVwZGF0ZSA9IChhcHBIaWVyYXJjaHksIG9sZFJlY29yZCwgbmV3UmVjb3JkKSA9PiB7XHJcbiAgY29uc3Qgb2xkSW5kZXhlcyA9IGdldFJlbGV2YW50UmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMoXHJcbiAgICBhcHBIaWVyYXJjaHksIG9sZFJlY29yZCxcclxuICApO1xyXG4gIGNvbnN0IG5ld0luZGV4ZXMgPSBnZXRSZWxldmFudFJldmVyc2VSZWZlcmVuY2VJbmRleGVzKFxyXG4gICAgYXBwSGllcmFyY2h5LCBuZXdSZWNvcmQsXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgdW5SZWZlcmVuY2VkID0gZGlmZmVyZW5jZUJ5KFxyXG4gICAgaSA9PiBpLmluZGV4S2V5LFxyXG4gICAgb2xkSW5kZXhlcywgbmV3SW5kZXhlcyxcclxuICApO1xyXG5cclxuICBjb25zdCBuZXdseVJlZmVyZW5jZWQgPSBkaWZmZXJlbmNlQnkoXHJcbiAgICBpID0+IGkuaW5kZXhLZXksXHJcbiAgICBuZXdJbmRleGVzLCBvbGRJbmRleGVzLFxyXG4gICk7XHJcblxyXG4gIGNvbnN0IG5vdENoYW5nZWQgPSBpbnRlcnNlY3Rpb25CeShcclxuICAgIGkgPT4gaS5pbmRleEtleSxcclxuICAgIG5ld0luZGV4ZXMsIG9sZEluZGV4ZXMsXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHVuUmVmZXJlbmNlZCxcclxuICAgIG5ld2x5UmVmZXJlbmNlZCxcclxuICAgIG5vdENoYW5nZWQsXHJcbiAgfTtcclxufTtcclxuIiwiaW1wb3J0IHsgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgcmV0cmlldmUgfSBmcm9tICcuL3JldHJpZXZlJztcclxuaW1wb3J0IHsgZXhlY3V0ZVRyYW5zYWN0aW9ucyB9IGZyb20gJy4vZXhlY3V0ZSc7XHJcbmltcG9ydCB7XHJcbiAgJCwgam9pbktleSwgZ2V0TG9jaywgaXNOb2xvY2ssIHJlbGVhc2VMb2NrLFxyXG59IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7XHJcbiAgTE9DS19GSUxFX0tFWSwgVFJBTlNBQ1RJT05TX0ZPTERFUixcclxuICB0aW1lb3V0TWlsbGlzZWNvbmRzLCBnZXRUcmFuc2FjdGlvbklkLFxyXG4gIG1heExvY2tSZXRyaWVzLFxyXG59IGZyb20gJy4vdHJhbnNhY3Rpb25zQ29tbW9uJztcclxuXHJcbmV4cG9ydCBjb25zdCBjbGVhbnVwID0gYXN5bmMgKGFwcCkgPT4ge1xyXG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRUcmFuc2FjdGlvbkxvY2soYXBwKTtcclxuICBpZiAoaXNOb2xvY2sobG9jaykpIHJldHVybjtcclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHRyYW5zYWN0aW9ucyA9IGF3YWl0IHJldHJpZXZlKGFwcCk7XHJcbiAgICBpZiAodHJhbnNhY3Rpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgYXdhaXQgZXhlY3V0ZVRyYW5zYWN0aW9ucyhhcHApKHRyYW5zYWN0aW9ucyk7XHJcblxyXG4gICAgICBjb25zdCBmb2xkZXIgPSB0cmFuc2FjdGlvbnMuZm9sZGVyS2V5XHJcbiAgICAgICAgPyB0cmFuc2FjdGlvbnMuZm9sZGVyS2V5XHJcbiAgICAgICAgOiBUUkFOU0FDVElPTlNfRk9MREVSO1xyXG5cclxuICAgICAgY29uc3QgZGVsZXRlRmlsZXMgPSAkKHRyYW5zYWN0aW9ucywgW1xyXG4gICAgICAgIG1hcCh0ID0+IGpvaW5LZXkoXHJcbiAgICAgICAgICBmb2xkZXIsXHJcbiAgICAgICAgICBnZXRUcmFuc2FjdGlvbklkKFxyXG4gICAgICAgICAgICB0LnJlY29yZElkLCB0LnRyYW5zYWN0aW9uVHlwZSxcclxuICAgICAgICAgICAgdC51bmlxdWVJZCxcclxuICAgICAgICAgICksXHJcbiAgICAgICAgKSksXHJcbiAgICAgICAgbWFwKGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZSksXHJcbiAgICAgIF0pO1xyXG5cclxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoZGVsZXRlRmlsZXMpO1xyXG4gICAgfVxyXG4gIH0gZmluYWxseSB7XHJcbiAgICBhd2FpdCByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGdldFRyYW5zYWN0aW9uTG9jayA9IGFzeW5jIGFwcCA9PiBhd2FpdCBnZXRMb2NrKFxyXG4gIGFwcCwgTE9DS19GSUxFX0tFWSxcclxuICB0aW1lb3V0TWlsbGlzZWNvbmRzLCBtYXhMb2NrUmV0cmllcyxcclxuKTtcclxuIiwiaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAnbG9kYXNoL2ZwJztcclxuaW1wb3J0IHsgY29uZmlnRm9sZGVyLCBhcHBEZWZpbml0aW9uRmlsZSwgJCB9IGZyb20gJy4uL2NvbW1vbic7XHJcbmltcG9ydCB7IFRSQU5TQUNUSU9OU19GT0xERVIgfSBmcm9tICcuLi90cmFuc2FjdGlvbnMvdHJhbnNhY3Rpb25zQ29tbW9uJztcclxuaW1wb3J0IHsgQVVUSF9GT0xERVIsIFVTRVJTX0xJU1RfRklMRSwgQUNDRVNTX0xFVkVMU19GSUxFIH0gZnJvbSAnLi4vYXV0aEFwaS9hdXRoQ29tbW9uJztcclxuaW1wb3J0IHsgaW5pdGlhbGlzZVJvb3RDb2xsZWN0aW9ucyB9IGZyb20gJy4uL2NvbGxlY3Rpb25BcGkvaW5pdGlhbGlzZSc7XHJcbmltcG9ydCB7IGluaXRpYWxpc2VJbmRleCB9IGZyb20gJy4uL2luZGV4aW5nL2luaXRpYWxpc2VJbmRleCc7XHJcbmltcG9ydCB7IGdldEZsYXR0ZW5lZEhpZXJhcmNoeSwgaXNHbG9iYWxJbmRleCwgaXNTaW5nbGVSZWNvcmQgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xyXG5pbXBvcnQgeyBfc2F2ZSB9IGZyb20gJy4uL3JlY29yZEFwaS9zYXZlJztcclxuaW1wb3J0IHsgZ2V0TmV3IH0gZnJvbSAnLi4vcmVjb3JkQXBpL2dldE5ldyc7XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdGlhbGlzZURhdGEgPSBhc3luYyAoZGF0YXN0b3JlLCBhcHBsaWNhdGlvbkRlZmluaXRpb24sIGFjY2Vzc0xldmVscykgPT4ge1xyXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoY29uZmlnRm9sZGVyKTtcclxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlSnNvbihhcHBEZWZpbml0aW9uRmlsZSwgYXBwbGljYXRpb25EZWZpbml0aW9uKTtcclxuXHJcbiAgYXdhaXQgaW5pdGlhbGlzZVJvb3RDb2xsZWN0aW9ucyhkYXRhc3RvcmUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbi5oaWVyYXJjaHkpO1xyXG4gIGF3YWl0IGluaXRpYWxpc2VSb290SW5kZXhlcyhkYXRhc3RvcmUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbi5oaWVyYXJjaHkpO1xyXG5cclxuICBhd2FpdCBpbml0aWFsaXNlUm9vdFNpbmdsZVJlY29yZHMoZGF0YXN0b3JlLCBhcHBsaWNhdGlvbkRlZmluaXRpb24uaGllcmFyY2h5KTtcclxuXHJcbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihUUkFOU0FDVElPTlNfRk9MREVSKTtcclxuXHJcbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihBVVRIX0ZPTERFUik7XHJcblxyXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKFVTRVJTX0xJU1RfRklMRSwgW10pO1xyXG5cclxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlSnNvbihcclxuICAgIEFDQ0VTU19MRVZFTFNfRklMRSwgXHJcbiAgICBhY2Nlc3NMZXZlbHMgPyBhY2Nlc3NMZXZlbHMgOiB7IHZlcnNpb246IDAsIGxldmVsczogW10gfSk7XHJcbn07XHJcblxyXG5jb25zdCBpbml0aWFsaXNlUm9vdEluZGV4ZXMgPSBhc3luYyAoZGF0YXN0b3JlLCBoaWVyYXJjaHkpID0+IHtcclxuICBjb25zdCBmbGF0aGllcmFyY2h5ID0gZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGhpZXJhcmNoeSk7XHJcbiAgY29uc3QgZ2xvYmFsSW5kZXhlcyA9ICQoZmxhdGhpZXJhcmNoeSwgW1xyXG4gICAgZmlsdGVyKGlzR2xvYmFsSW5kZXgpLFxyXG4gIF0pO1xyXG5cclxuICBmb3IgKGNvbnN0IGluZGV4IG9mIGdsb2JhbEluZGV4ZXMpIHtcclxuICAgIGlmICghYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhpbmRleC5ub2RlS2V5KCkpKSB7IGF3YWl0IGluaXRpYWxpc2VJbmRleChkYXRhc3RvcmUsICcnLCBpbmRleCk7IH1cclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBpbml0aWFsaXNlUm9vdFNpbmdsZVJlY29yZHMgPSBhc3luYyAoZGF0YXN0b3JlLCBoaWVyYWNoeSkgPT4ge1xyXG4gIGNvbnN0IGZsYXRoaWVyYXJjaHkgPSBnZXRGbGF0dGVuZWRIaWVyYXJjaHkoaGllcmFjaHkpO1xyXG4gIGNvbnN0IHNpbmdsZVJlY29yZHMgPSAkKGZsYXRoaWVyYXJjaHksIFtcclxuICAgIGZpbHRlcihpc1NpbmdsZVJlY29yZCksXHJcbiAgXSk7XHJcblxyXG4gIC8qIGZvciAobGV0IHJlY29yZCBvZiBzaW5nbGVSZWNvcmRzKSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0TmV3KHsgZGF0YXN0b3JlOiBkYXRhc3RvcmUsIGhpZXJhcmNoeTogYXBwRGVmaW5pdGlvbi5oaWVyYXJjaHkgfSlcclxuICAgICAgICAgICAgKHJlY29yZC5ub2RlS2V5KCksXHJcbiAgICAgICAgICAgICAgICByZWNvcmQubmFtZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICBfc2F2ZSh7IGRhdGFzdG9yZTogZGF0YXN0b3JlLCBoaWVyYXJjaHk6IGFwcERlZmluaXRpb24uaGllcmFyY2h5IH0sXHJcbiAgICAgICAgICAgIHJlc3VsdFxyXG4gICAgICAgICk7XHJcbiAgICB9ICovXHJcbn07XHJcbiIsImltcG9ydCB7IGlzTm90aGluZyB9IGZyb20gJy4uL2NvbW1vbic7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0RGF0YWJhc2VNYW5hZ2VyID0gZGF0YWJhc2VNYW5hZ2VyID0+ICh7XHJcbiAgY3JlYXRlRW1wdHlNYXN0ZXJEYjogY3JlYXRlRW1wdHlNYXN0ZXJEYihkYXRhYmFzZU1hbmFnZXIpLFxyXG4gIGNyZWF0ZUVtcHR5SW5zdGFuY2VEYjogY3JlYXRlRW1wdHlJbnN0YW5jZURiKGRhdGFiYXNlTWFuYWdlciksXHJcbiAgZ2V0SW5zdGFuY2VEYlJvb3RDb25maWc6IGRhdGFiYXNlTWFuYWdlci5nZXRJbnN0YW5jZURiUm9vdENvbmZpZyxcclxuICBtYXN0ZXJEYXRhc3RvcmVDb25maWc6IGdldE1hc3RlckRhdGFzdG9yZUNvbmZpZyhkYXRhYmFzZU1hbmFnZXIpLFxyXG4gIGdldEluc3RhbmNlRGF0YXN0b3JlQ29uZmlnOiBnZXRJbnN0YW5jZURhdGFzdG9yZUNvbmZpZyhkYXRhYmFzZU1hbmFnZXIpLFxyXG59KTtcclxuXHJcbmNvbnN0IGdldE1hc3RlckRhdGFzdG9yZUNvbmZpZyA9IGRhdGFiYXNlTWFuYWdlciA9PiBkYXRhYmFzZU1hbmFnZXIuZ2V0RGF0YXN0b3JlQ29uZmlnKCdtYXN0ZXInKTtcclxuXHJcbmNvbnN0IGdldEluc3RhbmNlRGF0YXN0b3JlQ29uZmlnID0gZGF0YWJhc2VNYW5hZ2VyID0+IChhcHBsaWNhdGlvbklkLCBpbnN0YW5jZUlkKSA9PiBkYXRhYmFzZU1hbmFnZXIuZ2V0RGF0YXN0b3JlQ29uZmlnKFxyXG4gIGFwcGxpY2F0aW9uSWQsIGluc3RhbmNlSWQsXHJcbik7XHJcblxyXG5jb25zdCBjcmVhdGVFbXB0eU1hc3RlckRiID0gZGF0YWJhc2VNYW5hZ2VyID0+IGFzeW5jICgpID0+IGF3YWl0IGRhdGFiYXNlTWFuYWdlci5jcmVhdGVFbXB0eURiKCdtYXN0ZXInKTtcclxuXHJcbmNvbnN0IGNyZWF0ZUVtcHR5SW5zdGFuY2VEYiA9IGRhdGFiYXNlTWFuYWdlciA9PiBhc3luYyAoYXBwbGljYXRpb25JZCwgaW5zdGFuY2VJZCkgPT4ge1xyXG4gIGlmIChpc05vdGhpbmcoYXBwbGljYXRpb25JZCkpIHsgdGhyb3cgbmV3IEVycm9yKCdDcmVhdGVEYjogYXBwbGljYXRpb24gaWQgbm90IHN1cHBsaWVkJyk7IH1cclxuICBpZiAoaXNOb3RoaW5nKGluc3RhbmNlSWQpKSB7IHRocm93IG5ldyBFcnJvcignQ3JlYXRlRGI6IGluc3RhbmNlIGlkIG5vdCBzdXBwbGllZCcpOyB9XHJcblxyXG4gIHJldHVybiBhd2FpdCBkYXRhYmFzZU1hbmFnZXIuY3JlYXRlRW1wdHlEYihcclxuICAgIGFwcGxpY2F0aW9uSWQsXHJcbiAgICBpbnN0YW5jZUlkLFxyXG4gICk7XHJcbn07XHJcbiIsImltcG9ydCBnZXRSZWNvcmRBcGkgZnJvbSBcIi4vcmVjb3JkQXBpXCI7XHJcbmltcG9ydCBnZXRDb2xsZWN0aW9uQXBpIGZyb20gXCIuL2NvbGxlY3Rpb25BcGlcIjtcclxuaW1wb3J0IGdldEluZGV4QXBpIGZyb20gXCIuL2luZGV4QXBpXCI7XHJcbmltcG9ydCBnZXRUZW1wbGF0ZUFwaSBmcm9tIFwiLi90ZW1wbGF0ZUFwaVwiO1xyXG5pbXBvcnQgZ2V0QXV0aEFwaSBmcm9tIFwiLi9hdXRoQXBpXCI7XHJcbmltcG9ydCBnZXRBY3Rpb25zQXBpIGZyb20gXCIuL2FjdGlvbnNBcGlcIjtcclxuaW1wb3J0IHtzZXR1cERhdGFzdG9yZSwgY3JlYXRlRXZlbnRBZ2dyZWdhdG9yfSBmcm9tIFwiLi9hcHBJbml0aWFsaXNlXCI7XHJcbmltcG9ydCB7aW5pdGlhbGlzZUFjdGlvbnN9IGZyb20gXCIuL2FjdGlvbnNBcGkvaW5pdGlhbGlzZVwiXHJcbmltcG9ydCB7aXNTb21ldGhpbmd9IGZyb20gXCIuL2NvbW1vblwiO1xyXG5pbXBvcnQge2NsZWFudXB9IGZyb20gXCIuL3RyYW5zYWN0aW9ucy9jbGVhbnVwXCI7XHJcbmltcG9ydCB7Z2VuZXJhdGVGdWxsUGVybWlzc2lvbnN9IGZyb20gXCIuL2F1dGhBcGkvZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnNcIjtcclxuaW1wb3J0IHtnZXRBcHBsaWNhdGlvbkRlZmluaXRpb259IGZyb20gXCIuL3RlbXBsYXRlQXBpL2dldEFwcGxpY2F0aW9uRGVmaW5pdGlvblwiO1xyXG5pbXBvcnQgY29tbW9uIGZyb20gXCIuL2NvbW1vblwiO1xyXG5pbXBvcnQge2dldEJlaGF2aW91clNvdXJjZXN9IGZyb20gXCIuL3RlbXBsYXRlQXBpL2dldEJlaGF2aW91clNvdXJjZXNcIjtcclxuaW1wb3J0IGhpZXJhcmNoeSBmcm9tIFwiLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHlcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRBcHBBcGlzID0gYXN5bmMgKHN0b3JlLCBiZWhhdmlvdXJTb3VyY2VzID0gbnVsbCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYW51cFRyYW5zYWN0aW9ucyA9IG51bGwsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEVwb2NoVGltZSA9IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3J5cHRvID0gbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBEZWZpbml0aW9uID0gbnVsbCkgPT4ge1xyXG5cclxuICAgIHN0b3JlID0gc2V0dXBEYXRhc3RvcmUoc3RvcmUpO1xyXG5cclxuICAgIGlmKCFhcHBEZWZpbml0aW9uKVxyXG4gICAgICAgIGFwcERlZmluaXRpb24gPSBhd2FpdCBnZXRBcHBsaWNhdGlvbkRlZmluaXRpb24oc3RvcmUpKCk7XHJcblxyXG4gICAgaWYoIWJlaGF2aW91clNvdXJjZXMpXHJcbiAgICAgICAgYmVoYXZpb3VyU291cmNlcyA9IGF3YWl0IGdldEJlaGF2aW91clNvdXJjZXMoc3RvcmUpO1xyXG5cclxuICAgIGNvbnN0IGV2ZW50QWdncmVnYXRvciA9IGNyZWF0ZUV2ZW50QWdncmVnYXRvcigpO1xyXG5cclxuICAgIGNvbnN0IGFwcCA9IHtcclxuICAgICAgICBkYXRhc3RvcmU6c3RvcmUsXHJcbiAgICAgICAgY3J5cHRvLFxyXG4gICAgICAgIHB1Ymxpc2g6ZXZlbnRBZ2dyZWdhdG9yLnB1Ymxpc2gsXHJcbiAgICAgICAgaGllcmFyY2h5OmFwcERlZmluaXRpb24uaGllcmFyY2h5LFxyXG4gICAgICAgIGFjdGlvbnM6YXBwRGVmaW5pdGlvbi5hY3Rpb25zXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHRlbXBsYXRlQXBpID0gZ2V0VGVtcGxhdGVBcGkoYXBwKTsgICAgXHJcblxyXG4gICAgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMgPSBpc1NvbWV0aGluZyhjbGVhbnVwVHJhbnNhY3Rpb25zKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBjbGVhbnVwVHJhbnNhY3Rpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogYXN5bmMgKCkgPT4gYXdhaXQgY2xlYW51cChhcHApO1xyXG5cclxuICAgIGFwcC5nZXRFcG9jaFRpbWUgPSBpc1NvbWV0aGluZyhnZXRFcG9jaFRpbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgPyBnZXRFcG9jaFRpbWVcclxuICAgICAgICAgICAgICAgICAgICAgICA6IGFzeW5jICgpID0+IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XHJcblxyXG4gICAgY29uc3QgcmVjb3JkQXBpID0gZ2V0UmVjb3JkQXBpKGFwcCk7XHJcbiAgICBjb25zdCBjb2xsZWN0aW9uQXBpID0gZ2V0Q29sbGVjdGlvbkFwaShhcHApO1xyXG4gICAgY29uc3QgaW5kZXhBcGkgPSBnZXRJbmRleEFwaShhcHApO1xyXG4gICAgY29uc3QgYXV0aEFwaSA9IGdldEF1dGhBcGkoYXBwKTtcclxuICAgIGNvbnN0IGFjdGlvbnNBcGkgPSBnZXRBY3Rpb25zQXBpKGFwcCk7XHJcblxyXG4gICAgY29uc3QgYXV0aGVudGljYXRlQXMgPSBhc3luYyAodXNlcm5hbWUsIHBhc3N3b3JkKSA9PiB7XHJcbiAgICAgICAgYXBwLnVzZXIgPSBhd2FpdCBhdXRoQXBpLmF1dGhlbnRpY2F0ZSh1c2VybmFtZSwgcGFzc3dvcmQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCB3aXRoRnVsbEFjY2VzcyA9ICgpID0+IHtcclxuICAgICAgICBhcHAudXNlciA9IHtcclxuICAgICAgICAgICAgbmFtZTogXCJhcHBcIixcclxuICAgICAgICAgICAgcGVybWlzc2lvbnMgOiBnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucyhhcHApLFxyXG4gICAgICAgICAgICBpc1VzZXI6ZmFsc2UsXHJcbiAgICAgICAgICAgIHRlbXA6ZmFsc2VcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGFzVXNlciA9ICh1c2VyKSA9PiB7XHJcbiAgICAgICAgYXBwLnVzZXIgPSB1c2VyXHJcbiAgICB9O1xyXG5cclxuICAgIFxyXG5cclxuICAgIGxldCBhcGlzID0ge1xyXG4gICAgICAgIHJlY29yZEFwaSwgXHJcbiAgICAgICAgdGVtcGxhdGVBcGksXHJcbiAgICAgICAgY29sbGVjdGlvbkFwaSxcclxuICAgICAgICBpbmRleEFwaSxcclxuICAgICAgICBhdXRoQXBpLFxyXG4gICAgICAgIGFjdGlvbnNBcGksXHJcbiAgICAgICAgc3Vic2NyaWJlOiBldmVudEFnZ3JlZ2F0b3Iuc3Vic2NyaWJlLFxyXG4gICAgICAgIGF1dGhlbnRpY2F0ZUFzLFxyXG4gICAgICAgIHdpdGhGdWxsQWNjZXNzLFxyXG4gICAgICAgIGFzVXNlclxyXG4gICAgfTtcclxuXHJcbiAgICBhcGlzLmFjdGlvbnMgPSBpbml0aWFsaXNlQWN0aW9ucyhcclxuICAgICAgICBldmVudEFnZ3JlZ2F0b3Iuc3Vic2NyaWJlLFxyXG4gICAgICAgIGJlaGF2aW91clNvdXJjZXMsXHJcbiAgICAgICAgYXBwRGVmaW5pdGlvbi5hY3Rpb25zLFxyXG4gICAgICAgIGFwcERlZmluaXRpb24udHJpZ2dlcnMsXHJcbiAgICAgICAgYXBpcyk7XHJcblxyXG5cclxuICAgIHJldHVybiBhcGlzO1xyXG59O1xyXG5cclxuZXhwb3J0IHtldmVudHMsIGV2ZW50c0xpc3R9IGZyb20gXCIuL2NvbW1vbi9ldmVudHNcIjtcclxuZXhwb3J0IHtnZXRUZW1wbGF0ZUFwaX0gZnJvbSBcIi4vdGVtcGxhdGVBcGlcIjtcclxuZXhwb3J0IHtnZXRSZWNvcmRBcGl9IGZyb20gXCIuL3JlY29yZEFwaVwiO1xyXG5leHBvcnQge2dldENvbGxlY3Rpb25BcGl9IGZyb20gXCIuL2NvbGxlY3Rpb25BcGlcIjtcclxuZXhwb3J0IHtnZXRBdXRoQXBpfSBmcm9tIFwiLi9hdXRoQXBpXCI7XHJcbmV4cG9ydCB7Z2V0SW5kZXhBcGl9IGZyb20gXCIuL2luZGV4QXBpXCI7XHJcbmV4cG9ydCB7c2V0dXBEYXRhc3RvcmV9IGZyb20gXCIuL2FwcEluaXRpYWxpc2VcIjtcclxuZXhwb3J0IHtnZXRBY3Rpb25zQXBpfSBmcm9tIFwiLi9hY3Rpb25zQXBpXCI7XHJcbmV4cG9ydCB7aW5pdGlhbGlzZURhdGF9IGZyb20gXCIuL2FwcEluaXRpYWxpc2UvaW5pdGlhbGlzZURhdGFcIjtcclxuZXhwb3J0IHtnZXREYXRhYmFzZU1hbmFnZXJ9IGZyb20gXCIuL2FwcEluaXRpYWxpc2UvZGF0YWJhc2VNYW5hZ2VyXCI7XHJcbmV4cG9ydCB7aGllcmFyY2h5fTtcclxuZXhwb3J0IHtjb21tb259O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2V0QXBwQXBpczsiXSwibmFtZXMiOlsic3BsaXQiLCJpc0FycmF5Iiwiam9pbiIsImlzVW5kZWZpbmVkIiwiaXNOYU4iLCJyZWR1Y2UiLCJjb21waWxlRXhwcmVzc2lvbiIsImNvbXBpbGVDb2RlIiwiY2xvbmVEZWVwIiwiaXNFbXB0eSIsImluY2x1ZGVzIiwiY29uc3RhbnQiLCJtYWtlcnVsZSIsIm9wdGlvbnMiLCJ0eXBlQ29uc3RyYWludHMiLCJpc051bGwiLCJoYXMiLCJpc051bWJlciIsImlzU3RyaW5nIiwiYWxsIiwiZ2V0RGVmYXVsdE9wdGlvbnMiLCJ2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyIsImlzQm9vbGVhbiIsImlzRGF0ZSIsImtleXMiLCJnbG9iYWwiLCJiYXNlNjQuZnJvbUJ5dGVBcnJheSIsImllZWU3NTQucmVhZCIsImllZWU3NTQud3JpdGUiLCJiYXNlNjQudG9CeXRlQXJyYXkiLCJyZWFkIiwiQnVmZmVyIiwicmVhZEluZGV4IiwibWVyZ2UiLCJzb21lIiwiZGVsZXRlUmVjb3JkIiwidmFsaWRhdGUiLCJmaW5kIiwiZWFjaCIsImRlZmF1bHRDYXNlIiwiYXBpIiwiY3JlYXRlVGVtcG9yYXJ5QWNjZXNzIiwiY3JlYXRlVXNlciIsInNldFVzZXJBY2Nlc3NMZXZlbHMiLCJleGVjdXRlQWN0aW9uIiwiY0NvZGUiLCJjRXhwIiwiaXNGdW5jdGlvbiIsIm9yZGVyQnkiLCJ1bmlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBLE1BQU0sVUFBVSxHQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRS9FLE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVwQyxNQUFNLE9BQU8sR0FBRztFQUNkLFNBQVMsRUFBRTtJQUNULElBQUksRUFBRSxVQUFVLENBQUM7TUFDZixXQUFXO01BQ1gsaUJBQWlCO01BQ2pCLGlCQUFpQixDQUFDLENBQUM7SUFDckIsTUFBTSxFQUFFLE1BQU0sRUFBRTtJQUNoQixVQUFVLEVBQUUsTUFBTSxFQUFFO0lBQ3BCLE1BQU0sRUFBRSxNQUFNLEVBQUU7SUFDaEIsSUFBSSxFQUFFLE1BQU0sRUFBRTtJQUNkLFFBQVEsRUFBRSxNQUFNLEVBQUU7SUFDbEIsVUFBVSxFQUFFLE1BQU0sRUFBRTtJQUNwQixZQUFZLEVBQUUsTUFBTSxFQUFFO0dBQ3ZCO0VBQ0QsUUFBUSxFQUFFO0lBQ1IsVUFBVSxFQUFFLE1BQU0sRUFBRTtJQUNwQixTQUFTLEVBQUUsTUFBTSxFQUFFO0lBQ25CLE1BQU0sRUFBRSxNQUFNLEVBQUU7SUFDaEIsVUFBVSxFQUFFLE1BQU0sRUFBRTtHQUNyQjtFQUNELGFBQWEsRUFBRTtJQUNiLHFCQUFxQixF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LEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUM7SUFDbEssR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLEtBQUk7SUFDN0IsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEtBQUk7SUFDNUIsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUk7R0FDdEI7O0VBRUQsSUFBSSxZQUFZLEtBQUssQ0FBQyxFQUFFO0lBQ3RCLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQztJQUNuRixHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSTtHQUN0QixNQUFNLElBQUksWUFBWSxLQUFLLENBQUMsRUFBRTtJQUM3QixHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUM7SUFDOUgsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFH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LEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0NBQ3RCOztBQzVHTSxTQUFTLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0VBQ3hELElBQUksQ0FBQyxFQUFFLEVBQUM7RUFDUixJQUFJLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxFQUFDO0VBQ2hDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFDO0VBQzFCLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxFQUFDO0VBQ3JCLElBQUksS0FBSyxHQUFHLENBQUMsRUFBQztFQUNkLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUM7RUFDL0IsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUM7RUFDckIsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUM7O0VBRTFCLENBQUMsSUFBSSxFQUFDOztFQUVOLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUM7RUFDN0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFDO0VBQ2QsS0FBSyxJQUFJLEtBQUk7RUFDYixPQUFPLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUUsRUFBRTs7RUFFMUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBQztFQUM3QixDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUM7RUFDZCxLQUFLLElBQUksS0FBSTtFQUNiLE9BQU8sS0FBSyxHQUFHLENBQUMsRUFB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QUFDLE1BQU0sRUFBQztHQUM3Qzs7RUFFRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsVUFBVSxFQUFDO0VBQ3JDLElBQUksR0FBRyxHQUFHLEVBQUM7RUFDWCxPQUFPLFVBQVUsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxFQUFFO0lBQ3ZDLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsVUFBVSxDQUFDLEdBQUcsSUFBRztHQUN6Qzs7RUFFRCxPQUFPLEdBQUc7RUFDWDs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLFNBQVMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQ2pFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztFQUNsRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7RUFDcEI7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7RUFDbEQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDOUM7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7RUFDbEQsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7RUFDOUM7O0FB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LEdBQUcsVUFBVSxFQUFDOztFQUVsRCxPQUFPLEdBQUc7RUFDWDs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxTQUFTLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQy9ELElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztFQUNsRCxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ2pELFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztFQUN4Qzs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxTQUFTLFdBQVcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQ3JFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztFQUNsRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUM7RUFDaEQsT0FBTyxDQUFDLEdBQUcsR0FBRyxNQUFNLElBQUksR0FBRyxHQUFHLFVBQVUsR0FBRyxHQUFHO0VBQy9DOztBQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFNBQVMsV0FBVyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7RUFDckUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0VBQ2xELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBQztFQUNoRCxPQUFPLENBQUMsR0FBRyxHQUFHLE1BQU0sSUFBSSxHQUFHLEdBQUcsVUFBVSxHQUFHLEdBQUc7RUFDL0M7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxXQUFXLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUNyRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7O0VBRWxELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0VBQzNCOztBQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFNBQVMsV0FBVyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7RUFDckUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDOztFQUVsRCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7S0FDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztFQUNyQjs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxTQUFTLFdBQVcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQ3JFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztFQUNsRCxPQUFPQyxJQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztFQUMvQzs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxTQUFTLFdBQVcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQ3JFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztFQUNsRCxPQUFPQSxJQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztFQUNoRDs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxTQUFTLFlBQVksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQ3ZFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztFQUNsRCxPQUFPQSxJQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztFQUMvQzs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxTQUFTLFlBQVksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQ3ZFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztFQUNsRCxPQUFPQSxJQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztFQUNoRDs7QUFFRCxTQUFTLFFBQVEsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRTtFQUNwRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyw2Q0FBNkMs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
