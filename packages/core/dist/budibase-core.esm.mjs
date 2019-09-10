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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVkaWJhc2UtY29yZS5lc20ubWpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tbW9uL2V2ZW50cy5qcyIsIi4uL3NyYy9jb21tb24vZXJyb3JzLmpzIiwiLi4vc3JjL2NvbW1vbi9hcGlXcmFwcGVyLmpzIiwiLi4vc3JjL2NvbW1vbi9sb2NrLmpzIiwiLi4vc3JjL2NvbW1vbi9pbmRleC5qcyIsIi4uL3NyYy9jb21tb24vdmFsaWRhdGlvbkNvbW1vbi5qcyIsIi4uL3NyYy9pbmRleGluZy9ldmFsdWF0ZS5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9pbmRleGVzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2hpZXJhcmNoeS5qcyIsIi4uL3NyYy90eXBlcy90eXBlSGVscGVycy5qcyIsIi4uL3NyYy90eXBlcy9zdHJpbmcuanMiLCIuLi9zcmMvdHlwZXMvYm9vbC5qcyIsIi4uL3NyYy90eXBlcy9udW1iZXIuanMiLCIuLi9zcmMvdHlwZXMvZGF0ZXRpbWUuanMiLCIuLi9zcmMvdHlwZXMvYXJyYXkuanMiLCIuLi9zcmMvdHlwZXMvcmVmZXJlbmNlLmpzIiwiLi4vc3JjL3R5cGVzL2ZpbGUuanMiLCIuLi9zcmMvdHlwZXMvaW5kZXguanMiLCIuLi9zcmMvYXV0aEFwaS9hdXRoQ29tbW9uLmpzIiwiLi4vc3JjL2F1dGhBcGkvaXNBdXRob3JpemVkLmpzIiwiLi4vc3JjL2F1dGhBcGkvcGVybWlzc2lvbnMuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2dldE5ldy5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvbG9hZC5qcyIsIi4uL3NyYy9pbmRleGluZy9wcm9taXNlUmVhZGFibGVTdHJlYW0uanMiLCIuLi9zcmMvaW5kZXhpbmcvc2hhcmRpbmcuanMiLCIuLi9zcmMvaW5kZXhpbmcvaW5kZXhTY2hlbWFDcmVhdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JvbGx1cC1wbHVnaW4tbm9kZS1nbG9iYWxzL3NyYy9nbG9iYWwuanMiLCIuLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVzNi9iYXNlNjQuanMiLCIuLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVzNi9pZWVlNzU0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2J1ZmZlci1lczYvaXNBcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9idWZmZXItZXM2L2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JvbGx1cC1wbHVnaW4tbm9kZS1idWlsdGlucy9zcmMvZXM2L3N0cmluZy1kZWNvZGVyLmpzIiwiLi4vc3JjL2luZGV4aW5nL3NlcmlhbGl6ZXIuanMiLCIuLi9zcmMvaW5kZXhpbmcvcmVhZC5qcyIsIi4uL3NyYy9pbmRleEFwaS9saXN0SXRlbXMuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2dldENvbnRleHQuanMiLCIuLi9zcmMvcmVjb3JkQXBpL3ZhbGlkYXRlLmpzIiwiLi4vc3JjL2NvbGxlY3Rpb25BcGkvaW5pdGlhbGlzZS5qcyIsIi4uL3NyYy9pbmRleGluZy9hbGxJZHMuanMiLCIuLi9zcmMvdHJhbnNhY3Rpb25zL3RyYW5zYWN0aW9uc0NvbW1vbi5qcyIsIi4uL3NyYy90cmFuc2FjdGlvbnMvY3JlYXRlLmpzIiwiLi4vc3JjL2luZGV4aW5nL2luaXRpYWxpc2VJbmRleC5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvc2F2ZS5qcyIsIi4uL3NyYy9jb2xsZWN0aW9uQXBpL2RlbGV0ZS5qcyIsIi4uL3NyYy9pbmRleEFwaS9kZWxldGUuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2RlbGV0ZS5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvdXBsb2FkRmlsZS5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZG93bmxvYWRGaWxlLmpzIiwiLi4vc3JjL3JlY29yZEFwaS9jdXN0b21JZC5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvaW5kZXguanMiLCIuLi9zcmMvY29sbGVjdGlvbkFwaS9nZXRBbGxvd2VkUmVjb3JkVHlwZXMuanMiLCIuLi9zcmMvY29sbGVjdGlvbkFwaS9pbmRleC5qcyIsIi4uL3NyYy9pbmRleEFwaS9idWlsZEluZGV4LmpzIiwiLi4vc3JjL2luZGV4QXBpL2FnZ3JlZ2F0ZXMuanMiLCIuLi9zcmMvaW5kZXhBcGkvaW5kZXguanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvY3JlYXRlTm9kZXMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvZmllbGRzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL3JlY29yZFZhbGlkYXRpb25SdWxlcy5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9jcmVhdGVBY3Rpb25zLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL3ZhbGlkYXRlQWdncmVnYXRlLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL3ZhbGlkYXRlLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2dldEFwcGxpY2F0aW9uRGVmaW5pdGlvbi5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9zYXZlQXBwbGljYXRpb25IaWVyYXJjaHkuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvc2F2ZUFjdGlvbnNBbmRUcmlnZ2Vycy5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9nZXRCZWhhdmlvdXJTb3VyY2VzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2luZGV4LmpzIiwiLi4vc3JjL2F1dGhBcGkvZ2V0VXNlcnMuanMiLCIuLi9zcmMvYXV0aEFwaS9sb2FkQWNjZXNzTGV2ZWxzLmpzIiwiLi4vc3JjL2F1dGhBcGkvYXV0aGVudGljYXRlLmpzIiwiLi4vc3JjL2F1dGhBcGkvY3JlYXRlVGVtcG9yYXJ5QWNjZXNzLmpzIiwiLi4vc3JjL2F1dGhBcGkvdmFsaWRhdGVVc2VyLmpzIiwiLi4vc3JjL2F1dGhBcGkvZ2V0TmV3VXNlci5qcyIsIi4uL3NyYy9hdXRoQXBpL3NldFBhc3N3b3JkLmpzIiwiLi4vc3JjL2F1dGhBcGkvY3JlYXRlVXNlci5qcyIsIi4uL3NyYy9hdXRoQXBpL2VuYWJsZVVzZXIuanMiLCIuLi9zcmMvYXV0aEFwaS9nZXROZXdBY2Nlc3NMZXZlbC5qcyIsIi4uL3NyYy9hdXRoQXBpL3ZhbGlkYXRlQWNjZXNzTGV2ZWxzLmpzIiwiLi4vc3JjL2F1dGhBcGkvc2F2ZUFjY2Vzc0xldmVscy5qcyIsIi4uL3NyYy9hdXRoQXBpL2dlbmVyYXRlRnVsbFBlcm1pc3Npb25zLmpzIiwiLi4vc3JjL2F1dGhBcGkvc2V0VXNlckFjY2Vzc0xldmVscy5qcyIsIi4uL3NyYy9hdXRoQXBpL2luZGV4LmpzIiwiLi4vc3JjL2FjdGlvbnNBcGkvZXhlY3V0ZS5qcyIsIi4uL3NyYy9hY3Rpb25zQXBpL2luZGV4LmpzIiwiLi4vc3JjL2FwcEluaXRpYWxpc2UvZXZlbnRBZ2dyZWdhdG9yLmpzIiwiLi4vc3JjL2FwcEluaXRpYWxpc2UvaW5kZXguanMiLCIuLi9zcmMvY29tbW9uL2NvbXBpbGVDb2RlLmpzIiwiLi4vc3JjL2FjdGlvbnNBcGkvaW5pdGlhbGlzZS5qcyIsIi4uL3NyYy90cmFuc2FjdGlvbnMvcmV0cmlldmUuanMiLCIuLi9zcmMvaW5kZXhpbmcvcmVsZXZhbnQuanMiLCIuLi9zcmMvaW5kZXhpbmcvcHJvbWlzZVdyaXRhYmxlU3RyZWFtLmpzIiwiLi4vc3JjL2luZGV4aW5nL2FwcGx5LmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9leGVjdXRlLmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9jbGVhbnVwLmpzIiwiLi4vc3JjL2FwcEluaXRpYWxpc2UvaW5pdGlhbGlzZURhdGEuanMiLCIuLi9zcmMvYXBwSW5pdGlhbGlzZS9kYXRhYmFzZU1hbmFnZXIuanMiLCIuLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdW5pb24sIHJlZHVjZSB9IGZyb20gJ2xvZGFzaC9mcCc7XG5cbmNvbnN0IGNvbW1vblBsdXMgPSBleHRyYSA9PiB1bmlvbihbJ29uQmVnaW4nLCAnb25Db21wbGV0ZScsICdvbkVycm9yJ10pKGV4dHJhKTtcblxuY29uc3QgY29tbW9uID0gKCkgPT4gY29tbW9uUGx1cyhbXSk7XG5cbmNvbnN0IF9ldmVudHMgPSB7XG4gIHJlY29yZEFwaToge1xuICAgIHNhdmU6IGNvbW1vblBsdXMoW1xuICAgICAgJ29uSW52YWxpZCcsXG4gICAgICAnb25SZWNvcmRVcGRhdGVkJyxcbiAgICAgICdvblJlY29yZENyZWF0ZWQnXSksXG4gICAgZGVsZXRlOiBjb21tb24oKSxcbiAgICBnZXRDb250ZXh0OiBjb21tb24oKSxcbiAgICBnZXROZXc6IGNvbW1vbigpLFxuICAgIGxvYWQ6IGNvbW1vbigpLFxuICAgIHZhbGlkYXRlOiBjb21tb24oKSxcbiAgICB1cGxvYWRGaWxlOiBjb21tb24oKSxcbiAgICBkb3dubG9hZEZpbGU6IGNvbW1vbigpLFxuICB9LFxuICBpbmRleEFwaToge1xuICAgIGJ1aWxkSW5kZXg6IGNvbW1vbigpLFxuICAgIGxpc3RJdGVtczogY29tbW9uKCksXG4gICAgZGVsZXRlOiBjb21tb24oKSxcbiAgICBhZ2dyZWdhdGVzOiBjb21tb24oKSxcbiAgfSxcbiAgY29sbGVjdGlvbkFwaToge1xuICAgIGdldEFsbG93ZWRSZWNvcmRUeXBlczogY29tbW9uKCksXG4gICAgaW5pdGlhbGlzZTogY29tbW9uKCksXG4gICAgZGVsZXRlOiBjb21tb24oKSxcbiAgfSxcbiAgYXV0aEFwaToge1xuICAgIGF1dGhlbnRpY2F0ZTogY29tbW9uKCksXG4gICAgYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzOiBjb21tb24oKSxcbiAgICBjcmVhdGVUZW1wb3JhcnlBY2Nlc3M6IGNvbW1vbigpLFxuICAgIGNyZWF0ZVVzZXI6IGNvbW1vbigpLFxuICAgIGVuYWJsZVVzZXI6IGNvbW1vbigpLFxuICAgIGRpc2FibGVVc2VyOiBjb21tb24oKSxcbiAgICBsb2FkQWNjZXNzTGV2ZWxzOiBjb21tb24oKSxcbiAgICBnZXROZXdBY2Nlc3NMZXZlbDogY29tbW9uKCksXG4gICAgZ2V0TmV3VXNlcjogY29tbW9uKCksXG4gICAgZ2V0TmV3VXNlckF1dGg6IGNvbW1vbigpLFxuICAgIGdldFVzZXJzOiBjb21tb24oKSxcbiAgICBzYXZlQWNjZXNzTGV2ZWxzOiBjb21tb24oKSxcbiAgICBpc0F1dGhvcml6ZWQ6IGNvbW1vbigpLFxuICAgIGNoYW5nZU15UGFzc3dvcmQ6IGNvbW1vbigpLFxuICAgIHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGU6IGNvbW1vbigpLFxuICAgIHNjb3JlUGFzc3dvcmQ6IGNvbW1vbigpLFxuICAgIGlzVmFsaWRQYXNzd29yZDogY29tbW9uKCksXG4gICAgdmFsaWRhdGVVc2VyOiBjb21tb24oKSxcbiAgICB2YWxpZGF0ZUFjY2Vzc0xldmVsczogY29tbW9uKCksXG4gICAgc2V0VXNlckFjY2Vzc0xldmVsczogY29tbW9uKCksXG4gIH0sXG4gIHRlbXBsYXRlQXBpOiB7XG4gICAgc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5OiBjb21tb24oKSxcbiAgICBzYXZlQWN0aW9uc0FuZFRyaWdnZXJzOiBjb21tb24oKSxcbiAgfSxcbiAgYWN0aW9uc0FwaToge1xuICAgIGV4ZWN1dGU6IGNvbW1vbigpLFxuICB9LFxufTtcblxuY29uc3QgX2V2ZW50c0xpc3QgPSBbXTtcblxuY29uc3QgbWFrZUV2ZW50ID0gKGFyZWEsIG1ldGhvZCwgbmFtZSkgPT4gYCR7YXJlYX06JHttZXRob2R9OiR7bmFtZX1gO1xuXG5mb3IgKGNvbnN0IGFyZWFLZXkgaW4gX2V2ZW50cykge1xuICBmb3IgKGNvbnN0IG1ldGhvZEtleSBpbiBfZXZlbnRzW2FyZWFLZXldKSB7XG4gICAgX2V2ZW50c1thcmVhS2V5XVttZXRob2RLZXldID0gcmVkdWNlKChvYmosIHMpID0+IHtcbiAgICAgIG9ialtzXSA9IG1ha2VFdmVudChhcmVhS2V5LCBtZXRob2RLZXksIHMpO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9LFxuICAgIHt9KShfZXZlbnRzW2FyZWFLZXldW21ldGhvZEtleV0pO1xuICB9XG59XG5cblxuZm9yIChjb25zdCBhcmVhS2V5IGluIF9ldmVudHMpIHtcbiAgZm9yIChjb25zdCBtZXRob2RLZXkgaW4gX2V2ZW50c1thcmVhS2V5XSkge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBfZXZlbnRzW2FyZWFLZXldW21ldGhvZEtleV0pIHtcbiAgICAgIF9ldmVudHNMaXN0LnB1c2goXG4gICAgICAgIF9ldmVudHNbYXJlYUtleV1bbWV0aG9kS2V5XVtuYW1lXSxcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cblxuZXhwb3J0IGNvbnN0IGV2ZW50cyA9IF9ldmVudHM7XG5cbmV4cG9ydCBjb25zdCBldmVudHNMaXN0ID0gX2V2ZW50c0xpc3Q7XG5cbmV4cG9ydCBkZWZhdWx0IHsgZXZlbnRzOiBfZXZlbnRzLCBldmVudHNMaXN0OiBfZXZlbnRzTGlzdCB9O1xuIiwiZXhwb3J0IGNsYXNzIEJhZFJlcXVlc3RFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmh0dHBTdGF0dXNDb2RlID0gNDAwO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuYXV0aG9yaXNlZEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDE7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRm9yYmlkZGVuRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDQwMztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOb3RGb3VuZEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDQ7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29uZmxpY3RFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmh0dHBTdGF0dXNDb2RlID0gNDA5O1xuICAgIH1cbn0iLCJpbXBvcnQgeyBjbG9uZURlZXAsIGlzVW5kZWZpbmVkIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnc2hvcnRpZCc7XG5pbXBvcnQgeyBVbmF1dGhvcmlzZWRFcnJvciB9IGZyb20gJy4vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGFwaVdyYXBwZXIgPSBhc3luYyAoYXBwLCBldmVudE5hbWVzcGFjZSwgaXNBdXRob3JpemVkLCBldmVudENvbnRleHQsIGZ1bmMsIC4uLnBhcmFtcykgPT4ge1xuICBwdXNoQ2FsbFN0YWNrKGFwcCwgZXZlbnROYW1lc3BhY2UpO1xuXG4gIGlmICghaXNBdXRob3JpemVkKGFwcCkpIHtcbiAgICBoYW5kbGVOb3RBdXRob3JpemVkKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgc3RhcnREYXRlID0gRGF0ZS5ub3coKTtcbiAgY29uc3QgZWxhcHNlZCA9ICgpID0+IChEYXRlLm5vdygpIC0gc3RhcnREYXRlKTtcblxuICB0cnkge1xuICAgIGF3YWl0IGFwcC5wdWJsaXNoKFxuICAgICAgZXZlbnROYW1lc3BhY2Uub25CZWdpbixcbiAgICAgIGV2ZW50Q29udGV4dCxcbiAgICApO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZnVuYyguLi5wYXJhbXMpO1xuXG4gICAgYXdhaXQgcHVibGlzaENvbXBsZXRlKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGF3YWl0IHB1Ymxpc2hFcnJvcihhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIGVycm9yKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGFwaVdyYXBwZXJTeW5jID0gKGFwcCwgZXZlbnROYW1lc3BhY2UsIGlzQXV0aG9yaXplZCwgZXZlbnRDb250ZXh0LCBmdW5jLCAuLi5wYXJhbXMpID0+IHtcbiAgcHVzaENhbGxTdGFjayhhcHAsIGV2ZW50TmFtZXNwYWNlKTtcblxuICBpZiAoIWlzQXV0aG9yaXplZChhcHApKSB7XG4gICAgaGFuZGxlTm90QXV0aG9yaXplZChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHN0YXJ0RGF0ZSA9IERhdGUubm93KCk7XG4gIGNvbnN0IGVsYXBzZWQgPSAoKSA9PiAoRGF0ZS5ub3coKSAtIHN0YXJ0RGF0ZSk7XG5cbiAgdHJ5IHtcbiAgICBhcHAucHVibGlzaChcbiAgICAgIGV2ZW50TmFtZXNwYWNlLm9uQmVnaW4sXG4gICAgICBldmVudENvbnRleHQsXG4gICAgKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGZ1bmMoLi4ucGFyYW1zKTtcblxuICAgIHB1Ymxpc2hDb21wbGV0ZShhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBwdWJsaXNoRXJyb3IoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCBlcnJvcik7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cbmNvbnN0IGhhbmRsZU5vdEF1dGhvcml6ZWQgPSAoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlKSA9PiB7XG4gIGNvbnN0IGVyciA9IG5ldyBVbmF1dGhvcmlzZWRFcnJvcihgVW5hdXRob3JpemVkOiAke2V2ZW50TmFtZXNwYWNlfWApO1xuICBwdWJsaXNoRXJyb3IoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCAoKSA9PiAwLCBlcnIpO1xuICB0aHJvdyBlcnI7XG59O1xuXG5jb25zdCBwdXNoQ2FsbFN0YWNrID0gKGFwcCwgZXZlbnROYW1lc3BhY2UsIHNlZWRDYWxsSWQpID0+IHtcbiAgY29uc3QgY2FsbElkID0gZ2VuZXJhdGUoKTtcblxuICBjb25zdCBjcmVhdGVDYWxsU3RhY2sgPSAoKSA9PiAoe1xuICAgIHNlZWRDYWxsSWQ6ICFpc1VuZGVmaW5lZChzZWVkQ2FsbElkKVxuICAgICAgPyBzZWVkQ2FsbElkXG4gICAgICA6IGNhbGxJZCxcbiAgICB0aHJlYWRDYWxsSWQ6IGNhbGxJZCxcbiAgICBzdGFjazogW10sXG4gIH0pO1xuXG4gIGlmIChpc1VuZGVmaW5lZChhcHAuY2FsbHMpKSB7XG4gICAgYXBwLmNhbGxzID0gY3JlYXRlQ2FsbFN0YWNrKCk7XG4gIH1cblxuICBhcHAuY2FsbHMuc3RhY2sucHVzaCh7XG4gICAgbmFtZXNwYWNlOiBldmVudE5hbWVzcGFjZSxcbiAgICBjYWxsSWQsXG4gIH0pO1xufTtcblxuY29uc3QgcG9wQ2FsbFN0YWNrID0gKGFwcCkgPT4ge1xuICBhcHAuY2FsbHMuc3RhY2sucG9wKCk7XG4gIGlmIChhcHAuY2FsbHMuc3RhY2subGVuZ3RoID09PSAwKSB7XG4gICAgZGVsZXRlIGFwcC5jYWxscztcbiAgfVxufTtcblxuY29uc3QgcHVibGlzaEVycm9yID0gYXN5bmMgKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgZXJyKSA9PiB7XG4gIGNvbnN0IGN0eCA9IGNsb25lRGVlcChldmVudENvbnRleHQpO1xuICBjdHguZXJyb3IgPSBlcnI7XG4gIGN0eC5lbGFwc2VkID0gZWxhcHNlZCgpO1xuICBhd2FpdCBhcHAucHVibGlzaChcbiAgICBldmVudE5hbWVzcGFjZS5vbkVycm9yLFxuICAgIGN0eCxcbiAgKTtcbiAgcG9wQ2FsbFN0YWNrKGFwcCk7XG59O1xuXG5jb25zdCBwdWJsaXNoQ29tcGxldGUgPSBhc3luYyAoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCByZXN1bHQpID0+IHtcbiAgY29uc3QgZW5kY29udGV4dCA9IGNsb25lRGVlcChldmVudENvbnRleHQpO1xuICBlbmRjb250ZXh0LnJlc3VsdCA9IHJlc3VsdDtcbiAgZW5kY29udGV4dC5lbGFwc2VkID0gZWxhcHNlZCgpO1xuICBhd2FpdCBhcHAucHVibGlzaChcbiAgICBldmVudE5hbWVzcGFjZS5vbkNvbXBsZXRlLFxuICAgIGVuZGNvbnRleHQsXG4gICk7XG4gIHBvcENhbGxTdGFjayhhcHApO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYXBpV3JhcHBlcjtcbiIsImltcG9ydCB7IHNwbGl0IH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7ICQgfSBmcm9tICcuL2luZGV4JztcblxuY29uc3QgbG9ja092ZXJsYXBNaWxsaXNlY29uZHMgPSAxMDtcblxuZXhwb3J0IGNvbnN0IGdldExvY2sgPSBhc3luYyAoYXBwLCBsb2NrRmlsZSwgdGltZW91dE1pbGxpc2Vjb25kcywgbWF4TG9ja1JldHJpZXMsIHJldHJ5Q291bnQgPSAwKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgdGltZW91dCA9IChhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCkpXG4gICAgICAgICAgICArIHRpbWVvdXRNaWxsaXNlY29uZHM7XG5cbiAgICBjb25zdCBsb2NrID0ge1xuICAgICAgdGltZW91dCxcbiAgICAgIGtleTogbG9ja0ZpbGUsXG4gICAgICB0b3RhbFRpbWVvdXQ6IHRpbWVvdXRNaWxsaXNlY29uZHMsXG4gICAgfTtcblxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlRmlsZShcbiAgICAgIGxvY2tGaWxlLFxuICAgICAgZ2V0TG9ja0ZpbGVDb250ZW50KFxuICAgICAgICBsb2NrLnRvdGFsVGltZW91dCxcbiAgICAgICAgbG9jay50aW1lb3V0LFxuICAgICAgKSxcbiAgICApO1xuXG4gICAgcmV0dXJuIGxvY2s7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAocmV0cnlDb3VudCA9PSBtYXhMb2NrUmV0cmllcykgeyByZXR1cm4gTk9fTE9DSzsgfVxuXG4gICAgY29uc3QgbG9jayA9IHBhcnNlTG9ja0ZpbGVDb250ZW50KFxuICAgICAgbG9ja0ZpbGUsXG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRGaWxlKGxvY2tGaWxlKSxcbiAgICApO1xuXG4gICAgY29uc3QgY3VycmVudEVwb2NoVGltZSA9IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKTtcblxuICAgIGlmIChjdXJyZW50RXBvY2hUaW1lIDwgbG9jay50aW1lb3V0KSB7XG4gICAgICByZXR1cm4gTk9fTE9DSztcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKGxvY2tGaWxlKTtcbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICAvL2VtcHR5XG4gICAgfVxuXG4gICAgYXdhaXQgc2xlZXBGb3JSZXRyeSgpO1xuXG4gICAgcmV0dXJuIGF3YWl0IGdldExvY2soXG4gICAgICBhcHAsIGxvY2tGaWxlLCB0aW1lb3V0TWlsbGlzZWNvbmRzLFxuICAgICAgbWF4TG9ja1JldHJpZXMsIHJldHJ5Q291bnQgKyAxLFxuICAgICk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBnZXRMb2NrRmlsZUNvbnRlbnQgPSAodG90YWxUaW1lb3V0LCBlcG9jaFRpbWUpID0+IGAke3RvdGFsVGltZW91dH06JHtlcG9jaFRpbWUudG9TdHJpbmcoKX1gO1xuXG5jb25zdCBwYXJzZUxvY2tGaWxlQ29udGVudCA9IChrZXksIGNvbnRlbnQpID0+ICQoY29udGVudCwgW1xuICBzcGxpdCgnOicpLFxuICBwYXJ0cyA9PiAoe1xuICAgIHRvdGFsVGltZW91dDogbmV3IE51bWJlcihwYXJ0c1swXSksXG4gICAgdGltZW91dDogbmV3IE51bWJlcihwYXJ0c1sxXSksXG4gICAga2V5LFxuICB9KSxcbl0pO1xuXG5leHBvcnQgY29uc3QgcmVsZWFzZUxvY2sgPSBhc3luYyAoYXBwLCBsb2NrKSA9PiB7XG4gIGNvbnN0IGN1cnJlbnRFcG9jaFRpbWUgPSBhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCk7XG4gIC8vIG9ubHkgcmVsZWFzZSBpZiBub3QgdGltZWRvdXRcbiAgaWYgKGN1cnJlbnRFcG9jaFRpbWUgPCAobG9jay50aW1lb3V0IC0gbG9ja092ZXJsYXBNaWxsaXNlY29uZHMpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShsb2NrLmtleSk7XG4gICAgfSBjYXRjaCAoXykge1xuICAgICAgLy9lbXB0eVxuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGV4dGVuZExvY2sgPSBhc3luYyAoYXBwLCBsb2NrKSA9PiB7XG4gIGNvbnN0IGN1cnJlbnRFcG9jaFRpbWUgPSBhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCk7XG4gIC8vIG9ubHkgcmVsZWFzZSBpZiBub3QgdGltZWRvdXRcbiAgaWYgKGN1cnJlbnRFcG9jaFRpbWUgPCAobG9jay50aW1lb3V0IC0gbG9ja092ZXJsYXBNaWxsaXNlY29uZHMpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGxvY2sudGltZW91dCA9IGN1cnJlbnRFcG9jaFRpbWUgKyBsb2NrLnRpbWVvdXRNaWxsaXNlY29uZHM7XG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUZpbGUoXG4gICAgICAgIGxvY2sua2V5LFxuICAgICAgICBnZXRMb2NrRmlsZUNvbnRlbnQobG9jay50b3RhbFRpbWVvdXQsIGxvY2sudGltZW91dCksXG4gICAgICApO1xuICAgICAgcmV0dXJuIGxvY2s7XG4gICAgfSBjYXRjaCAoXykge1xuICAgICAgLy9lbXB0eVxuICAgIH1cbiAgfVxuICByZXR1cm4gTk9fTE9DSztcbn07XG5cbmV4cG9ydCBjb25zdCBOT19MT0NLID0gJ25vIGxvY2snO1xuZXhwb3J0IGNvbnN0IGlzTm9sb2NrID0gaWQgPT4gaWQgPT09IE5PX0xPQ0s7XG5cbmNvbnN0IHNsZWVwRm9yUmV0cnkgPSAoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbG9ja092ZXJsYXBNaWxsaXNlY29uZHMpKTtcbiIsImltcG9ydCB7XG4gIGlzVW5kZWZpbmVkLCBpc05hTiwgaXNOdWxsLFxuICByZWR1Y2UsIGNvbnN0YW50LCBoZWFkLCBpc0VtcHR5LFxuICB0YWlsLCBmaW5kSW5kZXgsIHN0YXJ0c1dpdGgsIGpvaW4sXG4gIGRyb3BSaWdodCwgZmxvdywgdGFrZVJpZ2h0LCB0cmltLFxuICBzcGxpdCwgaW5jbHVkZXMsIHJlcGxhY2UsIGlzQXJyYXksXG4gIGlzU3RyaW5nLCBpc0ludGVnZXIsIGlzRGF0ZSwgdG9OdW1iZXIsXG59IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBzb21lIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGV2ZW50cywgZXZlbnRzTGlzdCB9IGZyb20gJy4vZXZlbnRzJztcbmltcG9ydCB7IGFwaVdyYXBwZXIgfSBmcm9tICcuL2FwaVdyYXBwZXInO1xuaW1wb3J0IHtcbiAgZ2V0TG9jaywgTk9fTE9DSyxcbiAgaXNOb2xvY2tcbn0gZnJvbSAnLi9sb2NrJztcblxuLy8gdGhpcyBpcyB0aGUgY29tYmluYXRvciBmdW5jdGlvblxuZXhwb3J0IGNvbnN0ICQkID0gKC4uLmZ1bmNzKSA9PiBhcmcgPT4gZmxvdyhmdW5jcykoYXJnKTtcblxuLy8gdGhpcyBpcyB0aGUgcGlwZSBmdW5jdGlvblxuZXhwb3J0IGNvbnN0ICQgPSAoYXJnLCBmdW5jcykgPT4gJCQoLi4uZnVuY3MpKGFyZyk7XG5cbmV4cG9ydCBjb25zdCBrZXlTZXAgPSAnLyc7XG5jb25zdCB0cmltS2V5U2VwID0gc3RyID0+IHRyaW0oc3RyLCBrZXlTZXApO1xuY29uc3Qgc3BsaXRCeUtleVNlcCA9IHN0ciA9PiBzcGxpdChzdHIsIGtleVNlcCk7XG5leHBvcnQgY29uc3Qgc2FmZUtleSA9IGtleSA9PiByZXBsYWNlKGAke2tleVNlcH0ke3RyaW1LZXlTZXAoa2V5KX1gLCBgJHtrZXlTZXB9JHtrZXlTZXB9YCwga2V5U2VwKTtcbmV4cG9ydCBjb25zdCBqb2luS2V5ID0gKC4uLnN0cnMpID0+IHtcbiAgY29uc3QgcGFyYW1zT3JBcnJheSA9IHN0cnMubGVuZ3RoID09PSAxICYgaXNBcnJheShzdHJzWzBdKVxuICAgID8gc3Ryc1swXSA6IHN0cnM7XG4gIHJldHVybiBzYWZlS2V5KGpvaW4ocGFyYW1zT3JBcnJheSwga2V5U2VwKSk7XG59O1xuZXhwb3J0IGNvbnN0IHNwbGl0S2V5ID0gJCQodHJpbUtleVNlcCwgc3BsaXRCeUtleVNlcCk7XG5leHBvcnQgY29uc3QgZ2V0RGlyRm9tS2V5ID0gJCQoc3BsaXRLZXksIGRyb3BSaWdodCwgcCA9PiBqb2luS2V5KC4uLnApKTtcbmV4cG9ydCBjb25zdCBnZXRGaWxlRnJvbUtleSA9ICQkKHNwbGl0S2V5LCB0YWtlUmlnaHQsIGhlYWQpO1xuXG5leHBvcnQgY29uc3QgY29uZmlnRm9sZGVyID0gYCR7a2V5U2VwfS5jb25maWdgO1xuZXhwb3J0IGNvbnN0IGZpZWxkRGVmaW5pdGlvbnMgPSBqb2luS2V5KGNvbmZpZ0ZvbGRlciwgJ2ZpZWxkcy5qc29uJyk7XG5leHBvcnQgY29uc3QgdGVtcGxhdGVEZWZpbml0aW9ucyA9IGpvaW5LZXkoY29uZmlnRm9sZGVyLCAndGVtcGxhdGVzLmpzb24nKTtcbmV4cG9ydCBjb25zdCBhcHBEZWZpbml0aW9uRmlsZSA9IGpvaW5LZXkoY29uZmlnRm9sZGVyLCAnYXBwRGVmaW5pdGlvbi5qc29uJyk7XG5leHBvcnQgY29uc3QgZGlySW5kZXggPSBmb2xkZXJQYXRoID0+IGpvaW5LZXkoY29uZmlnRm9sZGVyLCAnZGlyJywgLi4uc3BsaXRLZXkoZm9sZGVyUGF0aCksICdkaXIuaWR4Jyk7XG5leHBvcnQgY29uc3QgZ2V0SW5kZXhLZXlGcm9tRmlsZUtleSA9ICQkKGdldERpckZvbUtleSwgZGlySW5kZXgpO1xuXG5leHBvcnQgY29uc3QgaWZFeGlzdHMgPSAodmFsLCBleGlzdHMsIG5vdEV4aXN0cykgPT4gKGlzVW5kZWZpbmVkKHZhbClcbiAgPyBpc1VuZGVmaW5lZChub3RFeGlzdHMpID8gKCgpID0+IHsgfSkoKSA6IG5vdEV4aXN0cygpXG4gIDogZXhpc3RzKCkpO1xuXG5leHBvcnQgY29uc3QgZ2V0T3JEZWZhdWx0ID0gKHZhbCwgZGVmYXVsdFZhbCkgPT4gaWZFeGlzdHModmFsLCAoKSA9PiB2YWwsICgpID0+IGRlZmF1bHRWYWwpO1xuXG5leHBvcnQgY29uc3Qgbm90ID0gZnVuYyA9PiB2YWwgPT4gIWZ1bmModmFsKTtcbmV4cG9ydCBjb25zdCBpc0RlZmluZWQgPSBub3QoaXNVbmRlZmluZWQpO1xuZXhwb3J0IGNvbnN0IGlzTm9uTnVsbCA9IG5vdChpc051bGwpO1xuZXhwb3J0IGNvbnN0IGlzTm90TmFOID0gbm90KGlzTmFOKTtcblxuZXhwb3J0IGNvbnN0IGFsbFRydWUgPSAoLi4uZnVuY0FyZ3MpID0+IHZhbCA9PiByZWR1Y2UoZnVuY0FyZ3MsXG4gIChyZXN1bHQsIGNvbmRpdGlvbkZ1bmMpID0+IChpc051bGwocmVzdWx0KSB8fCByZXN1bHQgPT0gdHJ1ZSkgJiYgY29uZGl0aW9uRnVuYyh2YWwpLFxuICBudWxsKTtcblxuZXhwb3J0IGNvbnN0IGFueVRydWUgPSAoLi4uZnVuY0FyZ3MpID0+IHZhbCA9PiByZWR1Y2UoZnVuY0FyZ3MsXG4gIChyZXN1bHQsIGNvbmRpdGlvbkZ1bmMpID0+IHJlc3VsdCA9PSB0cnVlIHx8IGNvbmRpdGlvbkZ1bmModmFsKSxcbiAgbnVsbCk7XG5cbmV4cG9ydCBjb25zdCBpbnNlbnNpdGl2ZUVxdWFscyA9IChzdHIxLCBzdHIyKSA9PiBzdHIxLnRyaW0oKS50b0xvd2VyQ2FzZSgpID09PSBzdHIyLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuXG5leHBvcnQgY29uc3QgaXNTb21ldGhpbmcgPSBhbGxUcnVlKGlzRGVmaW5lZCwgaXNOb25OdWxsLCBpc05vdE5hTik7XG5leHBvcnQgY29uc3QgaXNOb3RoaW5nID0gbm90KGlzU29tZXRoaW5nKTtcbmV4cG9ydCBjb25zdCBpc05vdGhpbmdPckVtcHR5ID0gdiA9PiBpc05vdGhpbmcodikgfHwgaXNFbXB0eSh2KTtcbmV4cG9ydCBjb25zdCBzb21ldGhpbmdPckdldERlZmF1bHQgPSBnZXREZWZhdWx0RnVuYyA9PiB2YWwgPT4gKGlzU29tZXRoaW5nKHZhbCkgPyB2YWwgOiBnZXREZWZhdWx0RnVuYygpKTtcbmV4cG9ydCBjb25zdCBzb21ldGhpbmdPckRlZmF1bHQgPSAodmFsLCBkZWZhdWx0VmFsKSA9PiBzb21ldGhpbmdPckdldERlZmF1bHQoY29uc3RhbnQoZGVmYXVsdFZhbCkpKHZhbCk7XG5cbmV4cG9ydCBjb25zdCBtYXBJZlNvbWV0aGluZ09yRGVmYXVsdCA9IChtYXBGdW5jLCBkZWZhdWx0VmFsKSA9PiB2YWwgPT4gKGlzU29tZXRoaW5nKHZhbCkgPyBtYXBGdW5jKHZhbCkgOiBkZWZhdWx0VmFsKTtcblxuZXhwb3J0IGNvbnN0IG1hcElmU29tZXRoaW5nT3JCbGFuayA9IG1hcEZ1bmMgPT4gbWFwSWZTb21ldGhpbmdPckRlZmF1bHQobWFwRnVuYywgJycpO1xuXG5leHBvcnQgY29uc3Qgbm9uZSA9IHByZWRpY2F0ZSA9PiBjb2xsZWN0aW9uID0+ICFzb21lKHByZWRpY2F0ZSkoY29sbGVjdGlvbik7XG5cbmV4cG9ydCBjb25zdCBhbGwgPSBwcmVkaWNhdGUgPT4gY29sbGVjdGlvbiA9PiBub25lKHYgPT4gIXByZWRpY2F0ZSh2KSkoY29sbGVjdGlvbik7XG5cbmV4cG9ydCBjb25zdCBpc05vdEVtcHR5ID0gb2IgPT4gIWlzRW1wdHkob2IpO1xuZXhwb3J0IGNvbnN0IGlzQXN5bmMgPSBmbiA9PiBmbi5jb25zdHJ1Y3Rvci5uYW1lID09PSAnQXN5bmNGdW5jdGlvbic7XG5leHBvcnQgY29uc3QgaXNOb25FbXB0eUFycmF5ID0gYWxsVHJ1ZShpc0FycmF5LCBpc05vdEVtcHR5KTtcbmV4cG9ydCBjb25zdCBpc05vbkVtcHR5U3RyaW5nID0gYWxsVHJ1ZShpc1N0cmluZywgaXNOb3RFbXB0eSk7XG5leHBvcnQgY29uc3QgdHJ5T3IgPSBmYWlsRnVuYyA9PiAoZnVuYywgLi4uYXJncykgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBmdW5jLmFwcGx5KG51bGwsIC4uLmFyZ3MpO1xuICB9IGNhdGNoIChfKSB7XG4gICAgcmV0dXJuIGZhaWxGdW5jKCk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCB0cnlBd2FpdE9yID0gZmFpbEZ1bmMgPT4gYXN5bmMgKGZ1bmMsIC4uLmFyZ3MpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgZnVuYy5hcHBseShudWxsLCAuLi5hcmdzKTtcbiAgfSBjYXRjaCAoXykge1xuICAgIHJldHVybiBhd2FpdCBmYWlsRnVuYygpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZGVmaW5lRXJyb3IgPSAoZnVuYywgZXJyb3JQcmVmaXgpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnVuYygpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBlcnIubWVzc2FnZSA9IGAke2Vycm9yUHJlZml4fSA6ICR7ZXJyLm1lc3NhZ2V9YDtcbiAgICB0aHJvdyBlcnI7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCB0cnlPcklnbm9yZSA9IHRyeU9yKCgpID0+IHsgfSk7XG5leHBvcnQgY29uc3QgdHJ5QXdhaXRPcklnbm9yZSA9IHRyeUF3YWl0T3IoYXN5bmMgKCkgPT4geyB9KTtcbmV4cG9ydCBjb25zdCBjYXVzZXNFeGNlcHRpb24gPSAoZnVuYykgPT4ge1xuICB0cnkge1xuICAgIGZ1bmMoKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbiA9IGZ1bmMgPT4gIWNhdXNlc0V4Y2VwdGlvbihmdW5jKTtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZUVycm9yV2l0aCA9IHJldHVyblZhbEluRXJyb3IgPT4gdHJ5T3IoY29uc3RhbnQocmV0dXJuVmFsSW5FcnJvcikpO1xuXG5leHBvcnQgY29uc3QgaGFuZGxlRXJyb3JXaXRoVW5kZWZpbmVkID0gaGFuZGxlRXJyb3JXaXRoKHVuZGVmaW5lZCk7XG5cbmV4cG9ydCBjb25zdCBzd2l0Y2hDYXNlID0gKC4uLmNhc2VzKSA9PiAodmFsdWUpID0+IHtcbiAgY29uc3QgbmV4dENhc2UgPSAoKSA9PiBoZWFkKGNhc2VzKVswXSh2YWx1ZSk7XG4gIGNvbnN0IG5leHRSZXN1bHQgPSAoKSA9PiBoZWFkKGNhc2VzKVsxXSh2YWx1ZSk7XG5cbiAgaWYgKGlzRW1wdHkoY2FzZXMpKSByZXR1cm47IC8vIHVuZGVmaW5lZFxuICBpZiAobmV4dENhc2UoKSA9PT0gdHJ1ZSkgcmV0dXJuIG5leHRSZXN1bHQoKTtcbiAgcmV0dXJuIHN3aXRjaENhc2UoLi4udGFpbChjYXNlcykpKHZhbHVlKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1ZhbHVlID0gdmFsMSA9PiB2YWwyID0+ICh2YWwxID09PSB2YWwyKTtcbmV4cG9ydCBjb25zdCBpc09uZU9mID0gKC4uLnZhbHMpID0+IHZhbCA9PiBpbmNsdWRlcyh2YWxzLCB2YWwpO1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRDYXNlID0gY29uc3RhbnQodHJ1ZSk7XG5leHBvcnQgY29uc3QgbWVtYmVyTWF0Y2hlcyA9IChtZW1iZXIsIG1hdGNoKSA9PiBvYmogPT4gbWF0Y2gob2JqW21lbWJlcl0pO1xuXG5cbmV4cG9ydCBjb25zdCBTdGFydHNXaXRoID0gc2VhcmNoRm9yID0+IHNlYXJjaEluID0+IHN0YXJ0c1dpdGgoc2VhcmNoSW4sIHNlYXJjaEZvcik7XG5cbmV4cG9ydCBjb25zdCBjb250YWlucyA9IHZhbCA9PiBhcnJheSA9PiAoZmluZEluZGV4KGFycmF5LCB2ID0+IHYgPT09IHZhbCkgPiAtMSk7XG5cbmV4cG9ydCBjb25zdCBnZXRIYXNoQ29kZSA9IChzKSA9PiB7XG4gIGxldCBoYXNoID0gMDsgbGV0IGk7IGxldCBjaGFyOyBsZXRcbiAgICBsO1xuICBpZiAocy5sZW5ndGggPT0gMCkgcmV0dXJuIGhhc2g7XG4gIGZvciAoaSA9IDAsIGwgPSBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNoYXIgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2hhcjtcbiAgICBoYXNoIHw9IDA7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICB9XG5cbiAgLy8gY29udmVydGluZyB0byBzdHJpbmcsIGJ1dCBkb250IHdhbnQgYSBcIi1cIiBwcmVmaXhlZFxuICBpZiAoaGFzaCA8IDApIHsgcmV0dXJuIGBuJHsoaGFzaCAqIC0xKS50b1N0cmluZygpfWA7IH1cbiAgcmV0dXJuIGhhc2gudG9TdHJpbmcoKTtcbn07XG5cbi8vIHRoYW5rcyB0byBodHRwczovL2Jsb2cuZ3Jvc3NtYW4uaW8vaG93LXRvLXdyaXRlLWFzeW5jLWF3YWl0LXdpdGhvdXQtdHJ5LWNhdGNoLWJsb2Nrcy1pbi1qYXZhc2NyaXB0L1xuZXhwb3J0IGNvbnN0IGF3RXggPSBhc3luYyAocHJvbWlzZSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHByb21pc2U7XG4gICAgcmV0dXJuIFt1bmRlZmluZWQsIHJlc3VsdF07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIFtlcnJvciwgdW5kZWZpbmVkXTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGlzU2FmZUludGVnZXIgPSBuID0+IGlzSW50ZWdlcihuKVxuICAgICYmIG4gPD0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgICAmJiBuID49IDAgLSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcblxuZXhwb3J0IGNvbnN0IHRvRGF0ZU9yTnVsbCA9IHMgPT4gKGlzTnVsbChzKSA/IG51bGxcbiAgOiBpc0RhdGUocykgPyBzIDogbmV3IERhdGUocykpO1xuZXhwb3J0IGNvbnN0IHRvQm9vbE9yTnVsbCA9IHMgPT4gKGlzTnVsbChzKSA/IG51bGxcbiAgOiBzID09PSAndHJ1ZScgfHwgcyA9PT0gdHJ1ZSk7XG5leHBvcnQgY29uc3QgdG9OdW1iZXJPck51bGwgPSBzID0+IChpc051bGwocykgPyBudWxsXG4gIDogdG9OdW1iZXIocykpO1xuXG5leHBvcnQgY29uc3QgaXNBcnJheU9mU3RyaW5nID0gb3B0cyA9PiBpc0FycmF5KG9wdHMpICYmIGFsbChpc1N0cmluZykob3B0cyk7XG5cbmV4cG9ydCBjb25zdCBwYXVzZSA9IGFzeW5jIGR1cmF0aW9uID0+IG5ldyBQcm9taXNlKHJlcyA9PiBzZXRUaW1lb3V0KHJlcywgZHVyYXRpb24pKTtcblxuZXhwb3J0IGNvbnN0IHJldHJ5ID0gYXN5bmMgKGZuLCByZXRyaWVzLCBkZWxheSwgLi4uYXJncykgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCBmbiguLi5hcmdzKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKHJldHJpZXMgPiAxKSB7XG4gICAgICByZXR1cm4gYXdhaXQgcGF1c2UoZGVsYXkpLnRoZW4oYXN5bmMgKCkgPT4gYXdhaXQgcmV0cnkoZm4sIChyZXRyaWVzIC0gMSksIGRlbGF5LCAuLi5hcmdzKSk7XG4gICAgfVxuICAgIHRocm93IGVycjtcbiAgfVxufTtcblxuZXhwb3J0IHsgZXZlbnRzIH0gZnJvbSAnLi9ldmVudHMnO1xuZXhwb3J0IHsgYXBpV3JhcHBlciwgYXBpV3JhcHBlclN5bmMgfSBmcm9tICcuL2FwaVdyYXBwZXInO1xuZXhwb3J0IHtcbiAgZ2V0TG9jaywgTk9fTE9DSywgcmVsZWFzZUxvY2ssXG4gIGV4dGVuZExvY2ssIGlzTm9sb2NrLFxufSBmcm9tICcuL2xvY2snO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGlmRXhpc3RzLFxuICBnZXRPckRlZmF1bHQsXG4gIGlzRGVmaW5lZCxcbiAgaXNOb25OdWxsLFxuICBpc05vdE5hTixcbiAgYWxsVHJ1ZSxcbiAgaXNTb21ldGhpbmcsXG4gIG1hcElmU29tZXRoaW5nT3JEZWZhdWx0LFxuICBtYXBJZlNvbWV0aGluZ09yQmxhbmssXG4gIGNvbmZpZ0ZvbGRlcixcbiAgZmllbGREZWZpbml0aW9ucyxcbiAgaXNOb3RoaW5nLFxuICBub3QsXG4gIHN3aXRjaENhc2UsXG4gIGRlZmF1bHRDYXNlLFxuICBTdGFydHNXaXRoLFxuICBjb250YWlucyxcbiAgdGVtcGxhdGVEZWZpbml0aW9ucyxcbiAgaGFuZGxlRXJyb3JXaXRoLFxuICBoYW5kbGVFcnJvcldpdGhVbmRlZmluZWQsXG4gIHRyeU9yLFxuICB0cnlPcklnbm9yZSxcbiAgdHJ5QXdhaXRPcixcbiAgdHJ5QXdhaXRPcklnbm9yZSxcbiAgZGlySW5kZXgsXG4gIGtleVNlcCxcbiAgJCxcbiAgJCQsXG4gIGdldERpckZvbUtleSxcbiAgZ2V0RmlsZUZyb21LZXksXG4gIHNwbGl0S2V5LFxuICBzb21ldGhpbmdPckRlZmF1bHQsXG4gIGdldEluZGV4S2V5RnJvbUZpbGVLZXksXG4gIGpvaW5LZXksXG4gIHNvbWV0aGluZ09yR2V0RGVmYXVsdCxcbiAgYXBwRGVmaW5pdGlvbkZpbGUsXG4gIGlzVmFsdWUsXG4gIGFsbCxcbiAgaXNPbmVPZixcbiAgbWVtYmVyTWF0Y2hlcyxcbiAgZGVmaW5lRXJyb3IsXG4gIGFueVRydWUsXG4gIGlzTm9uRW1wdHlBcnJheSxcbiAgY2F1c2VzRXhjZXB0aW9uLFxuICBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24sXG4gIG5vbmUsXG4gIGdldEhhc2hDb2RlLFxuICBhd0V4LFxuICBhcGlXcmFwcGVyLFxuICBldmVudHMsXG4gIGV2ZW50c0xpc3QsXG4gIGlzTm90aGluZ09yRW1wdHksXG4gIGlzU2FmZUludGVnZXIsXG4gIHRvTnVtYmVyLFxuICB0b0RhdGU6IHRvRGF0ZU9yTnVsbCxcbiAgdG9Cb29sOiB0b0Jvb2xPck51bGwsXG4gIGlzQXJyYXlPZlN0cmluZyxcbiAgZ2V0TG9jayxcbiAgTk9fTE9DSyxcbiAgaXNOb2xvY2ssXG4gIGluc2Vuc2l0aXZlRXF1YWxzLFxuICBwYXVzZSxcbiAgcmV0cnksXG59O1xuIiwiaW1wb3J0IHsgZmlsdGVyLCBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgJCwgaXNTb21ldGhpbmcgfSBmcm9tICcuL2luZGV4JztcblxuZXhwb3J0IGNvbnN0IHN0cmluZ05vdEVtcHR5ID0gcyA9PiBpc1NvbWV0aGluZyhzKSAmJiBzLnRyaW0oKS5sZW5ndGggPiAwO1xuXG5leHBvcnQgY29uc3QgbWFrZXJ1bGUgPSAoZmllbGQsIGVycm9yLCBpc1ZhbGlkKSA9PiAoeyBmaWVsZCwgZXJyb3IsIGlzVmFsaWQgfSk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0aW9uRXJyb3IgPSAocnVsZSwgaXRlbSkgPT4gKHsgLi4ucnVsZSwgaXRlbSB9KTtcblxuZXhwb3J0IGNvbnN0IGFwcGx5UnVsZVNldCA9IHJ1bGVTZXQgPT4gaXRlbVRvVmFsaWRhdGUgPT4gJChydWxlU2V0LCBbXG4gIG1hcChhcHBseVJ1bGUoaXRlbVRvVmFsaWRhdGUpKSxcbiAgZmlsdGVyKGlzU29tZXRoaW5nKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgYXBwbHlSdWxlID0gaXRlbVRvdmFsaWRhdGUgPT4gcnVsZSA9PiAocnVsZS5pc1ZhbGlkKGl0ZW1Ub3ZhbGlkYXRlKVxuICA/IG51bGxcbiAgOiB2YWxpZGF0aW9uRXJyb3IocnVsZSwgaXRlbVRvdmFsaWRhdGUpKTtcbiIsImltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCB7XG4gIGlzVW5kZWZpbmVkLCBrZXlzLCBcbiAgY2xvbmVEZWVwLCBpc0Z1bmN0aW9uLFxufSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgZGVmaW5lRXJyb3IgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZmlsdGVyRXZhbCA9ICdGSUxURVJfRVZBTFVBVEUnO1xuZXhwb3J0IGNvbnN0IGZpbHRlckNvbXBpbGUgPSAnRklMVEVSX0NPTVBJTEUnO1xuZXhwb3J0IGNvbnN0IG1hcEV2YWwgPSAnTUFQX0VWQUxVQVRFJztcbmV4cG9ydCBjb25zdCBtYXBDb21waWxlID0gJ01BUF9DT01QSUxFJztcbmV4cG9ydCBjb25zdCByZW1vdmVVbmRlY2xhcmVkRmllbGRzID0gJ1JFTU9WRV9VTkRFQ0xBUkVEX0ZJRUxEUyc7XG5leHBvcnQgY29uc3QgYWRkVW5NYXBwZWRGaWVsZHMgPSAnQUREX1VOTUFQUEVEX0ZJRUxEUyc7XG5leHBvcnQgY29uc3QgYWRkVGhlS2V5ID0gJ0FERF9LRVknO1xuXG5cbmNvbnN0IGdldEV2YWx1YXRlUmVzdWx0ID0gKCkgPT4gKHtcbiAgaXNFcnJvcjogZmFsc2UsXG4gIHBhc3NlZEZpbHRlcjogdHJ1ZSxcbiAgcmVzdWx0OiBudWxsLFxufSk7XG5cbmV4cG9ydCBjb25zdCBjb21waWxlRmlsdGVyID0gaW5kZXggPT4gY29tcGlsZUV4cHJlc3Npb24oaW5kZXguZmlsdGVyKTtcblxuZXhwb3J0IGNvbnN0IGNvbXBpbGVNYXAgPSBpbmRleCA9PiBjb21waWxlQ29kZShpbmRleC5tYXApO1xuXG5leHBvcnQgY29uc3QgcGFzc2VzRmlsdGVyID0gKHJlY29yZCwgaW5kZXgpID0+IHtcbiAgY29uc3QgY29udGV4dCA9IHsgcmVjb3JkIH07XG4gIGlmICghaW5kZXguZmlsdGVyKSByZXR1cm4gdHJ1ZTtcblxuICBjb25zdCBjb21waWxlZEZpbHRlciA9IGRlZmluZUVycm9yKFxuICAgICgpID0+IGNvbXBpbGVGaWx0ZXIoaW5kZXgpLFxuICAgIGZpbHRlckNvbXBpbGUsXG4gICk7XG5cbiAgcmV0dXJuIGRlZmluZUVycm9yKFxuICAgICgpID0+IGNvbXBpbGVkRmlsdGVyKGNvbnRleHQpLFxuICAgIGZpbHRlckV2YWwsXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgbWFwUmVjb3JkID0gKHJlY29yZCwgaW5kZXgpID0+IHtcbiAgY29uc3QgcmVjb3JkQ2xvbmUgPSBjbG9uZURlZXAocmVjb3JkKTtcbiAgY29uc3QgY29udGV4dCA9IHsgcmVjb3JkOiByZWNvcmRDbG9uZSB9O1xuXG4gIGNvbnN0IG1hcCA9IGluZGV4Lm1hcCA/IGluZGV4Lm1hcCA6ICdyZXR1cm4gey4uLnJlY29yZH07JztcblxuICBjb25zdCBjb21waWxlZE1hcCA9IGRlZmluZUVycm9yKFxuICAgICgpID0+IGNvbXBpbGVDb2RlKG1hcCksXG4gICAgbWFwQ29tcGlsZSxcbiAgKTtcblxuICBjb25zdCBtYXBwZWQgPSBkZWZpbmVFcnJvcihcbiAgICAoKSA9PiBjb21waWxlZE1hcChjb250ZXh0KSxcbiAgICBtYXBFdmFsLFxuICApO1xuXG4gIGNvbnN0IG1hcHBlZEtleXMgPSBrZXlzKG1hcHBlZCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWFwcGVkS2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGtleSA9IG1hcHBlZEtleXNbaV07XG4gICAgbWFwcGVkW2tleV0gPSBpc1VuZGVmaW5lZChtYXBwZWRba2V5XSkgPyBudWxsIDogbWFwcGVkW2tleV07XG4gICAgaWYgKGlzRnVuY3Rpb24obWFwcGVkW2tleV0pKSB7XG4gICAgICBkZWxldGUgbWFwcGVkW2tleV07XG4gICAgfVxuICB9XG5cbiAgbWFwcGVkLmtleSA9IHJlY29yZC5rZXk7XG4gIG1hcHBlZC5zb3J0S2V5ID0gaW5kZXguZ2V0U29ydEtleVxuICAgID8gY29tcGlsZUNvZGUoaW5kZXguZ2V0U29ydEtleSkoY29udGV4dClcbiAgICA6IHJlY29yZC5pZDtcblxuICByZXR1cm4gbWFwcGVkO1xufTtcblxuZXhwb3J0IGNvbnN0IGV2YWx1YXRlID0gcmVjb3JkID0+IChpbmRleCkgPT4ge1xuICBjb25zdCByZXN1bHQgPSBnZXRFdmFsdWF0ZVJlc3VsdCgpO1xuXG4gIHRyeSB7XG4gICAgcmVzdWx0LnBhc3NlZEZpbHRlciA9IHBhc3Nlc0ZpbHRlcihyZWNvcmQsIGluZGV4KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmVzdWx0LmlzRXJyb3IgPSB0cnVlO1xuICAgIHJlc3VsdC5wYXNzZWRGaWx0ZXIgPSBmYWxzZTtcbiAgICByZXN1bHQucmVzdWx0ID0gZXJyLm1lc3NhZ2U7XG4gIH1cblxuICBpZiAoIXJlc3VsdC5wYXNzZWRGaWx0ZXIpIHJldHVybiByZXN1bHQ7XG5cbiAgdHJ5IHtcbiAgICByZXN1bHQucmVzdWx0ID0gbWFwUmVjb3JkKHJlY29yZCwgaW5kZXgpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXN1bHQuaXNFcnJvciA9IHRydWU7XG4gICAgcmVzdWx0LnJlc3VsdCA9IGVyci5tZXNzYWdlO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGV2YWx1YXRlO1xuIiwiaW1wb3J0IHtcbiAgbWFwLCBpc0VtcHR5LCBjb3VudEJ5LCBmbGF0dGVuLCBpbmNsdWRlcyxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGpvaW4sIGtleXMgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSB9IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcbmltcG9ydCB7IGNvbXBpbGVGaWx0ZXIsIGNvbXBpbGVNYXAgfSBmcm9tICcuLi9pbmRleGluZy9ldmFsdWF0ZSc7XG5pbXBvcnQgeyBpc05vbkVtcHR5U3RyaW5nLCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24sICQgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgaXNSZWNvcmQgfSBmcm9tICcuL2hpZXJhcmNoeSc7XG5cbmV4cG9ydCBjb25zdCBpbmRleFR5cGVzID0geyByZWZlcmVuY2U6ICdyZWZlcmVuY2UnLCBhbmNlc3RvcjogJ2FuY2VzdG9yJyB9O1xuXG5leHBvcnQgY29uc3QgaW5kZXhSdWxlU2V0ID0gW1xuICBtYWtlcnVsZSgnbWFwJywgJ2luZGV4IGhhcyBubyBtYXAgZnVuY3Rpb24nLFxuICAgIGluZGV4ID0+IGlzTm9uRW1wdHlTdHJpbmcoaW5kZXgubWFwKSksXG4gIG1ha2VydWxlKCdtYXAnLCBcImluZGV4J3MgbWFwIGZ1bmN0aW9uIGRvZXMgbm90IGNvbXBpbGVcIixcbiAgICBpbmRleCA9PiAhaXNOb25FbXB0eVN0cmluZyhpbmRleC5tYXApXG4gICAgICAgICAgICAgICAgfHwgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uKCgpID0+IGNvbXBpbGVNYXAoaW5kZXgpKSksXG4gIG1ha2VydWxlKCdmaWx0ZXInLCBcImluZGV4J3MgZmlsdGVyIGZ1bmN0aW9uIGRvZXMgbm90IGNvbXBpbGVcIixcbiAgICBpbmRleCA9PiAhaXNOb25FbXB0eVN0cmluZyhpbmRleC5maWx0ZXIpXG4gICAgICAgICAgICAgICAgfHwgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uKCgpID0+IGNvbXBpbGVGaWx0ZXIoaW5kZXgpKSksXG4gIG1ha2VydWxlKCduYW1lJywgJ211c3QgZGVjbGFyZSBhIG5hbWUgZm9yIGluZGV4JyxcbiAgICBpbmRleCA9PiBpc05vbkVtcHR5U3RyaW5nKGluZGV4Lm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAndGhlcmUgaXMgYSBkdXBsaWNhdGUgbmFtZWQgaW5kZXggb24gdGhpcyBub2RlJyxcbiAgICBpbmRleCA9PiBpc0VtcHR5KGluZGV4Lm5hbWUpXG4gICAgICAgICAgICAgICAgfHwgY291bnRCeSgnbmFtZScpKGluZGV4LnBhcmVudCgpLmluZGV4ZXMpW2luZGV4Lm5hbWVdID09PSAxKSxcbiAgbWFrZXJ1bGUoJ2luZGV4VHlwZScsICdyZWZlcmVuY2UgaW5kZXggbWF5IG9ubHkgZXhpc3Qgb24gYSByZWNvcmQgbm9kZScsXG4gICAgaW5kZXggPT4gaXNSZWNvcmQoaW5kZXgucGFyZW50KCkpXG4gICAgICAgICAgICAgICAgICB8fCBpbmRleC5pbmRleFR5cGUgIT09IGluZGV4VHlwZXMucmVmZXJlbmNlKSxcbiAgbWFrZXJ1bGUoJ2luZGV4VHlwZScsIGBpbmRleCB0eXBlIG11c3QgYmUgb25lIG9mOiAke2pvaW4oJywgJywga2V5cyhpbmRleFR5cGVzKSl9YCxcbiAgICBpbmRleCA9PiBpbmNsdWRlcyhpbmRleC5pbmRleFR5cGUpKGtleXMoaW5kZXhUeXBlcykpKSxcbl07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUluZGV4ID0gKGluZGV4LCBhbGxSZWZlcmVuY2VJbmRleGVzT25Ob2RlKSA9PiBhcHBseVJ1bGVTZXQoaW5kZXhSdWxlU2V0KGFsbFJlZmVyZW5jZUluZGV4ZXNPbk5vZGUpKShpbmRleCk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFsbEluZGV4ZXMgPSBub2RlID0+ICQobm9kZS5pbmRleGVzLCBbXG4gIG1hcChpID0+IHZhbGlkYXRlSW5kZXgoaSwgbm9kZS5pbmRleGVzKSksXG4gIGZsYXR0ZW4sXG5dKTtcbiIsImltcG9ydCB7XG4gIGZpbmQsIGNvbnN0YW50LCBtYXAsIGxhc3QsXG4gIGZpcnN0LCBzcGxpdCwgaW50ZXJzZWN0aW9uLCB0YWtlLFxuICB1bmlvbiwgaW5jbHVkZXMsIGZpbHRlciwgc29tZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gICQsIHN3aXRjaENhc2UsIGlzTm90aGluZywgaXNTb21ldGhpbmcsXG4gIGRlZmF1bHRDYXNlLCBzcGxpdEtleSwgaXNOb25FbXB0eVN0cmluZyxcbiAgam9pbktleSwgZ2V0SGFzaENvZGUsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBpbmRleFR5cGVzIH0gZnJvbSAnLi9pbmRleGVzJztcblxuZXhwb3J0IGNvbnN0IGdldEZsYXR0ZW5lZEhpZXJhcmNoeSA9IChhcHBIaWVyYXJjaHksIHVzZUNhY2hlZCA9IHRydWUpID0+IHtcbiAgaWYgKGlzU29tZXRoaW5nKGFwcEhpZXJhcmNoeS5nZXRGbGF0dGVuZWRIaWVyYXJjaHkpICYmIHVzZUNhY2hlZCkgeyByZXR1cm4gYXBwSGllcmFyY2h5LmdldEZsYXR0ZW5lZEhpZXJhcmNoeSgpOyB9XG5cbiAgY29uc3QgZmxhdHRlbkhpZXJhcmNoeSA9IChjdXJyZW50Tm9kZSwgZmxhdHRlbmVkKSA9PiB7XG4gICAgZmxhdHRlbmVkLnB1c2goY3VycmVudE5vZGUpO1xuICAgIGlmICgoIWN1cnJlbnROb2RlLmNoaWxkcmVuXG4gICAgICAgICAgICB8fCBjdXJyZW50Tm9kZS5jaGlsZHJlbi5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAmJiAoIWN1cnJlbnROb2RlLmluZGV4ZXNcbiAgICAgICAgICAgIHx8IGN1cnJlbnROb2RlLmluZGV4ZXMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgJiYgKCFjdXJyZW50Tm9kZS5hZ2dyZWdhdGVHcm91cHNcbiAgICAgICAgICAgIHx8IGN1cnJlbnROb2RlLmFnZ3JlZ2F0ZUdyb3Vwcy5sZW5ndGggPT09IDApKSB7XG4gICAgICByZXR1cm4gZmxhdHRlbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IHVuaW9uSWZBbnkgPSBsMiA9PiBsMSA9PiB1bmlvbihsMSkoIWwyID8gW10gOiBsMik7XG5cbiAgICBjb25zdCBjaGlsZHJlbiA9ICQoW10sIFtcbiAgICAgIHVuaW9uSWZBbnkoY3VycmVudE5vZGUuY2hpbGRyZW4pLFxuICAgICAgdW5pb25JZkFueShjdXJyZW50Tm9kZS5pbmRleGVzKSxcbiAgICAgIHVuaW9uSWZBbnkoY3VycmVudE5vZGUuYWdncmVnYXRlR3JvdXBzKSxcbiAgICBdKTtcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGZsYXR0ZW5IaWVyYXJjaHkoY2hpbGQsIGZsYXR0ZW5lZCk7XG4gICAgfVxuICAgIHJldHVybiBmbGF0dGVuZWQ7XG4gIH07XG5cbiAgYXBwSGllcmFyY2h5LmdldEZsYXR0ZW5lZEhpZXJhcmNoeSA9ICgpID0+IGZsYXR0ZW5IaWVyYXJjaHkoYXBwSGllcmFyY2h5LCBbXSk7XG4gIHJldHVybiBhcHBIaWVyYXJjaHkuZ2V0RmxhdHRlbmVkSGllcmFyY2h5KCk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TGFzdFBhcnRJbktleSA9IGtleSA9PiBsYXN0KHNwbGl0S2V5KGtleSkpO1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZXNJblBhdGggPSBhcHBIaWVyYXJjaHkgPT4ga2V5ID0+ICQoYXBwSGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmlsdGVyKG4gPT4gbmV3IFJlZ0V4cChgJHtuLnBhdGhSZWd4KCl9YCkudGVzdChrZXkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0RXhhY3ROb2RlRm9yUGF0aCA9IGFwcEhpZXJhcmNoeSA9PiBrZXkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gbmV3IFJlZ0V4cChgJHtuLnBhdGhSZWd4KCl9JGApLnRlc3Qoa2V5KSksXG5dKTtcblxuZXhwb3J0IGNvbnN0IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aCA9IGFwcEhpZXJhcmNoeSA9PiBjb2xsZWN0aW9uS2V5ID0+ICQoYXBwSGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmluZChuID0+IChpc0NvbGxlY3Rpb25SZWNvcmQobilcbiAgICAgICAgICAgICAgICAgICAmJiBuZXcgUmVnRXhwKGAke24uY29sbGVjdGlvblBhdGhSZWd4KCl9JGApLnRlc3QoY29sbGVjdGlvbktleSkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgaGFzTWF0Y2hpbmdBbmNlc3RvciA9IGFuY2VzdG9yUHJlZGljYXRlID0+IGRlY2VuZGFudE5vZGUgPT4gc3dpdGNoQ2FzZShcblxuICBbbm9kZSA9PiBpc05vdGhpbmcobm9kZS5wYXJlbnQoKSksXG4gICAgY29uc3RhbnQoZmFsc2UpXSxcblxuICBbbm9kZSA9PiBhbmNlc3RvclByZWRpY2F0ZShub2RlLnBhcmVudCgpKSxcbiAgICBjb25zdGFudCh0cnVlKV0sXG5cbiAgW2RlZmF1bHRDYXNlLFxuICAgIG5vZGUgPT4gaGFzTWF0Y2hpbmdBbmNlc3RvcihhbmNlc3RvclByZWRpY2F0ZSkobm9kZS5wYXJlbnQoKSldLFxuXG4pKGRlY2VuZGFudE5vZGUpO1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZSA9IChhcHBIaWVyYXJjaHksIG5vZGVLZXkpID0+ICQoYXBwSGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmluZChuID0+IG4ubm9kZUtleSgpID09PSBub2RlS2V5XG4gICAgICAgICAgICAgICAgICB8fCAoaXNDb2xsZWN0aW9uUmVjb3JkKG4pXG4gICAgICAgICAgICAgICAgICAgICAgJiYgbi5jb2xsZWN0aW9uTm9kZUtleSgpID09PSBub2RlS2V5KSksXG5dKTtcblxuZXhwb3J0IGNvbnN0IGdldENvbGxlY3Rpb25Ob2RlID0gKGFwcEhpZXJhcmNoeSwgbm9kZUtleSkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gKGlzQ29sbGVjdGlvblJlY29yZChuKVxuICAgICAgICAgICAgICAgICAgICAmJiBuLmNvbGxlY3Rpb25Ob2RlS2V5KCkgPT09IG5vZGVLZXkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZUJ5S2V5T3JOb2RlS2V5ID0gKGFwcEhpZXJhcmNoeSwga2V5T3JOb2RlS2V5KSA9PiB7XG4gIGNvbnN0IG5vZGVCeUtleSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwSGllcmFyY2h5KShrZXlPck5vZGVLZXkpO1xuICByZXR1cm4gaXNOb3RoaW5nKG5vZGVCeUtleSlcbiAgICA/IGdldE5vZGUoYXBwSGllcmFyY2h5LCBrZXlPck5vZGVLZXkpXG4gICAgOiBub2RlQnlLZXk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Q29sbGVjdGlvbk5vZGVCeUtleU9yTm9kZUtleSA9IChhcHBIaWVyYXJjaHksIGtleU9yTm9kZUtleSkgPT4ge1xuICBjb25zdCBub2RlQnlLZXkgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwSGllcmFyY2h5KShrZXlPck5vZGVLZXkpO1xuICByZXR1cm4gaXNOb3RoaW5nKG5vZGVCeUtleSlcbiAgICA/IGdldENvbGxlY3Rpb25Ob2RlKGFwcEhpZXJhcmNoeSwga2V5T3JOb2RlS2V5KVxuICAgIDogbm9kZUJ5S2V5O1xufTtcblxuZXhwb3J0IGNvbnN0IGlzTm9kZSA9IChhcHBIaWVyYXJjaHksIGtleSkgPT4gaXNTb21ldGhpbmcoZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHBIaWVyYXJjaHkpKGtleSkpO1xuXG5leHBvcnQgY29uc3QgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQgPSAocGFyZW50Tm9kZUtleSwgYWN0dWFsQ2hpbGRLZXkpID0+ICQoYWN0dWFsQ2hpbGRLZXksIFtcbiAgc3BsaXRLZXksXG4gIHRha2Uoc3BsaXRLZXkocGFyZW50Tm9kZUtleSkubGVuZ3RoKSxcbiAga3MgPT4gam9pbktleSguLi5rcyksXG5dKTtcblxuZXhwb3J0IGNvbnN0IGdldFBhcmVudEtleSA9IChrZXkpID0+IHtcbiAgcmV0dXJuICQoa2V5LCBbXG4gICAgc3BsaXRLZXksXG4gICAgdGFrZShzcGxpdEtleShrZXkpLmxlbmd0aCAtIDEpLFxuICAgIGpvaW5LZXksXG4gIF0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzS2V5QW5jZXN0b3JPZiA9IGFuY2VzdG9yS2V5ID0+IGRlY2VuZGFudE5vZGUgPT4gaGFzTWF0Y2hpbmdBbmNlc3RvcihwID0+IHAubm9kZUtleSgpID09PSBhbmNlc3RvcktleSkoZGVjZW5kYW50Tm9kZSk7XG5cbmV4cG9ydCBjb25zdCBoYXNOb01hdGNoaW5nQW5jZXN0b3JzID0gcGFyZW50UHJlZGljYXRlID0+IG5vZGUgPT4gIWhhc01hdGNoaW5nQW5jZXN0b3IocGFyZW50UHJlZGljYXRlKShub2RlKTtcblxuZXhwb3J0IGNvbnN0IGZpbmRGaWVsZCA9IChyZWNvcmROb2RlLCBmaWVsZE5hbWUpID0+IGZpbmQoZiA9PiBmLm5hbWUgPT0gZmllbGROYW1lKShyZWNvcmROb2RlLmZpZWxkcyk7XG5cbmV4cG9ydCBjb25zdCBpc0FuY2VzdG9yID0gZGVjZW5kYW50ID0+IGFuY2VzdG9yID0+IGlzS2V5QW5jZXN0b3JPZihhbmNlc3Rvci5ub2RlS2V5KCkpKGRlY2VuZGFudCk7XG5cbmV4cG9ydCBjb25zdCBpc0RlY2VuZGFudCA9IGFuY2VzdG9yID0+IGRlY2VuZGFudCA9PiBpc0FuY2VzdG9yKGRlY2VuZGFudCkoYW5jZXN0b3IpO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkTm9kZUlkID0gcmVjb3JkS2V5ID0+ICQocmVjb3JkS2V5LCBbXG4gIHNwbGl0S2V5LFxuICBsYXN0LFxuICBnZXRSZWNvcmROb2RlSWRGcm9tSWQsXG5dKTtcblxuZXhwb3J0IGNvbnN0IGdldFJlY29yZE5vZGVJZEZyb21JZCA9IHJlY29yZElkID0+ICQocmVjb3JkSWQsIFtzcGxpdCgnLScpLCBmaXJzdCwgcGFyc2VJbnRdKTtcblxuZXhwb3J0IGNvbnN0IGdldFJlY29yZE5vZGVCeUlkID0gKGhpZXJhcmNoeSwgcmVjb3JkSWQpID0+ICQoaGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmluZChuID0+IGlzUmVjb3JkKG4pXG4gICAgICAgICAgICAgICAgICAgICYmIG4ubm9kZUlkID09PSBnZXRSZWNvcmROb2RlSWRGcm9tSWQocmVjb3JkSWQpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgcmVjb3JkTm9kZUlkSXNBbGxvd2VkID0gaW5kZXhOb2RlID0+IG5vZGVJZCA9PiBpbmRleE5vZGUuYWxsb3dlZFJlY29yZE5vZGVJZHMubGVuZ3RoID09PSAwXG4gICAgfHwgaW5jbHVkZXMobm9kZUlkKShpbmRleE5vZGUuYWxsb3dlZFJlY29yZE5vZGVJZHMpO1xuXG5leHBvcnQgY29uc3QgcmVjb3JkTm9kZUlzQWxsb3dlZCA9IGluZGV4Tm9kZSA9PiByZWNvcmROb2RlID0+IHJlY29yZE5vZGVJZElzQWxsb3dlZChpbmRleE5vZGUpKHJlY29yZE5vZGUubm9kZUlkKTtcblxuZXhwb3J0IGNvbnN0IGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4ID0gKGFwcEhpZXJhcmNoeSwgaW5kZXhOb2RlKSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGVzID0gJChhcHBIaWVyYXJjaHksIFtcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gICAgZmlsdGVyKGlzUmVjb3JkKSxcbiAgXSk7XG5cbiAgaWYgKGlzR2xvYmFsSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIHJldHVybiAkKHJlY29yZE5vZGVzLCBbXG4gICAgICBmaWx0ZXIocmVjb3JkTm9kZUlzQWxsb3dlZChpbmRleE5vZGUpKSxcbiAgICBdKTtcbiAgfVxuXG4gIGlmIChpc0FuY2VzdG9ySW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIHJldHVybiAkKHJlY29yZE5vZGVzLCBbXG4gICAgICBmaWx0ZXIoaXNEZWNlbmRhbnQoaW5kZXhOb2RlLnBhcmVudCgpKSksXG4gICAgICBmaWx0ZXIocmVjb3JkTm9kZUlzQWxsb3dlZChpbmRleE5vZGUpKSxcbiAgICBdKTtcbiAgfVxuXG4gIGlmIChpc1JlZmVyZW5jZUluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICByZXR1cm4gJChyZWNvcmROb2RlcywgW1xuICAgICAgZmlsdGVyKG4gPT4gc29tZShmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleChpbmRleE5vZGUpKShuLmZpZWxkcykpLFxuICAgIF0pO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZUZyb21Ob2RlS2V5SGFzaCA9IGhpZXJhcmNoeSA9PiBoYXNoID0+ICQoaGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmluZChuID0+IGdldEhhc2hDb2RlKG4ubm9kZUtleSgpKSA9PT0gaGFzaCksXG5dKTtcblxuZXhwb3J0IGNvbnN0IGlzUmVjb3JkID0gbm9kZSA9PiBpc1NvbWV0aGluZyhub2RlKSAmJiBub2RlLnR5cGUgPT09ICdyZWNvcmQnO1xuZXhwb3J0IGNvbnN0IGlzU2luZ2xlUmVjb3JkID0gbm9kZSA9PiBpc1JlY29yZChub2RlKSAmJiBub2RlLmlzU2luZ2xlO1xuZXhwb3J0IGNvbnN0IGlzQ29sbGVjdGlvblJlY29yZCA9IG5vZGUgPT4gaXNSZWNvcmQobm9kZSkgJiYgIW5vZGUuaXNTaW5nbGU7XG5leHBvcnQgY29uc3QgaXNJbmRleCA9IG5vZGUgPT4gaXNTb21ldGhpbmcobm9kZSkgJiYgbm9kZS50eXBlID09PSAnaW5kZXgnO1xuZXhwb3J0IGNvbnN0IGlzYWdncmVnYXRlR3JvdXAgPSBub2RlID0+IGlzU29tZXRoaW5nKG5vZGUpICYmIG5vZGUudHlwZSA9PT0gJ2FnZ3JlZ2F0ZUdyb3VwJztcbmV4cG9ydCBjb25zdCBpc1NoYXJkZWRJbmRleCA9IG5vZGUgPT4gaXNJbmRleChub2RlKSAmJiBpc05vbkVtcHR5U3RyaW5nKG5vZGUuZ2V0U2hhcmROYW1lKTtcbmV4cG9ydCBjb25zdCBpc1Jvb3QgPSBub2RlID0+IGlzU29tZXRoaW5nKG5vZGUpICYmIG5vZGUuaXNSb290KCk7XG5leHBvcnQgY29uc3QgaXNEZWNlbmRhbnRPZkFSZWNvcmQgPSBoYXNNYXRjaGluZ0FuY2VzdG9yKGlzUmVjb3JkKTtcbmV4cG9ydCBjb25zdCBpc0dsb2JhbEluZGV4ID0gbm9kZSA9PiBpc0luZGV4KG5vZGUpICYmIGlzUm9vdChub2RlLnBhcmVudCgpKTtcbmV4cG9ydCBjb25zdCBpc1JlZmVyZW5jZUluZGV4ID0gbm9kZSA9PiBpc0luZGV4KG5vZGUpICYmIG5vZGUuaW5kZXhUeXBlID09PSBpbmRleFR5cGVzLnJlZmVyZW5jZTtcbmV4cG9ydCBjb25zdCBpc0FuY2VzdG9ySW5kZXggPSBub2RlID0+IGlzSW5kZXgobm9kZSkgJiYgbm9kZS5pbmRleFR5cGUgPT09IGluZGV4VHlwZXMuYW5jZXN0b3I7XG5cbmV4cG9ydCBjb25zdCBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlID0gbm9kZSA9PiBmaWVsZCA9PiBmaWVsZC50eXBlID09PSAncmVmZXJlbmNlJ1xuICAgICYmIGludGVyc2VjdGlvbihmaWVsZC50eXBlT3B0aW9ucy5yZXZlcnNlSW5kZXhOb2RlS2V5cykobWFwKGkgPT4gaS5ub2RlS2V5KCkpKG5vZGUuaW5kZXhlcykpXG4gICAgICAubGVuZ3RoID4gMDtcblxuZXhwb3J0IGNvbnN0IGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4ID0gaW5kZXhOb2RlID0+IGZpZWxkID0+IGZpZWxkLnR5cGUgPT09ICdyZWZlcmVuY2UnXG4gICAgJiYgaW50ZXJzZWN0aW9uKGZpZWxkLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzKShbaW5kZXhOb2RlLm5vZGVLZXkoKV0pXG4gICAgICAubGVuZ3RoID4gMDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXRMYXN0UGFydEluS2V5LFxuICBnZXROb2Rlc0luUGF0aCxcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcbiAgaGFzTWF0Y2hpbmdBbmNlc3RvcixcbiAgZ2V0Tm9kZSxcbiAgZ2V0Tm9kZUJ5S2V5T3JOb2RlS2V5LFxuICBpc05vZGUsXG4gIGdldEFjdHVhbEtleU9mUGFyZW50LFxuICBnZXRQYXJlbnRLZXksXG4gIGlzS2V5QW5jZXN0b3JPZixcbiAgaGFzTm9NYXRjaGluZ0FuY2VzdG9ycyxcbiAgZmluZEZpZWxkLFxuICBpc0FuY2VzdG9yLFxuICBpc0RlY2VuZGFudCxcbiAgZ2V0UmVjb3JkTm9kZUlkLFxuICBnZXRSZWNvcmROb2RlSWRGcm9tSWQsXG4gIGdldFJlY29yZE5vZGVCeUlkLFxuICByZWNvcmROb2RlSWRJc0FsbG93ZWQsXG4gIHJlY29yZE5vZGVJc0FsbG93ZWQsXG4gIGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4LFxuICBnZXROb2RlRnJvbU5vZGVLZXlIYXNoLFxuICBpc1JlY29yZCxcbiAgaXNDb2xsZWN0aW9uUmVjb3JkLFxuICBpc0luZGV4LFxuICBpc2FnZ3JlZ2F0ZUdyb3VwLFxuICBpc1NoYXJkZWRJbmRleCxcbiAgaXNSb290LFxuICBpc0RlY2VuZGFudE9mQVJlY29yZCxcbiAgaXNHbG9iYWxJbmRleCxcbiAgaXNSZWZlcmVuY2VJbmRleCxcbiAgaXNBbmNlc3RvckluZGV4LFxuICBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlLFxuICBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleCxcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxufTtcbiIsImltcG9ydCB7IG1lcmdlLCBoYXMgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgY29uc3RhbnQsIGlzVW5kZWZpbmVkLCBcbiAgbWFwVmFsdWVzLCBjbG9uZURlZXAsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBpc05vdEVtcHR5IH0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdldFNhZmVGaWVsZFBhcnNlciA9ICh0cnlQYXJzZSwgZGVmYXVsdFZhbHVlRnVuY3Rpb25zKSA9PiAoZmllbGQsIHJlY29yZCkgPT4ge1xuICBpZiAoaGFzKHJlY29yZCwgZmllbGQubmFtZSkpIHtcbiAgICByZXR1cm4gZ2V0U2FmZVZhbHVlUGFyc2VyKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpKHJlY29yZFtmaWVsZC5uYW1lXSk7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZUZ1bmN0aW9uc1tmaWVsZC5nZXRVbmRlZmluZWRWYWx1ZV0oKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRTYWZlVmFsdWVQYXJzZXIgPSAodHJ5UGFyc2UsIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucykgPT4gKHZhbHVlKSA9PiB7XG4gIGNvbnN0IHBhcnNlZCA9IHRyeVBhcnNlKHZhbHVlKTtcbiAgaWYgKHBhcnNlZC5zdWNjZXNzKSB7XG4gICAgcmV0dXJuIHBhcnNlZC52YWx1ZTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZhbHVlRnVuY3Rpb25zLmRlZmF1bHQoKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXROZXdWYWx1ZSA9ICh0cnlQYXJzZSwgZGVmYXVsdFZhbHVlRnVuY3Rpb25zKSA9PiAoZmllbGQpID0+IHtcbiAgY29uc3QgZ2V0SW5pdGlhbFZhbHVlID0gaXNVbmRlZmluZWQoZmllbGQpIHx8IGlzVW5kZWZpbmVkKGZpZWxkLmdldEluaXRpYWxWYWx1ZSlcbiAgICA/ICdkZWZhdWx0J1xuICAgIDogZmllbGQuZ2V0SW5pdGlhbFZhbHVlO1xuXG4gIHJldHVybiBoYXMoZGVmYXVsdFZhbHVlRnVuY3Rpb25zLCBnZXRJbml0aWFsVmFsdWUpXG4gICAgPyBkZWZhdWx0VmFsdWVGdW5jdGlvbnNbZ2V0SW5pdGlhbFZhbHVlXSgpXG4gICAgOiBnZXRTYWZlVmFsdWVQYXJzZXIodHJ5UGFyc2UsIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucykoZ2V0SW5pdGlhbFZhbHVlKTtcbn07XG5cbmV4cG9ydCBjb25zdCB0eXBlRnVuY3Rpb25zID0gc3BlY2lmaWNGdW5jdGlvbnMgPT4gbWVyZ2Uoe1xuICB2YWx1ZTogY29uc3RhbnQsXG4gIG51bGw6IGNvbnN0YW50KG51bGwpLFxufSwgc3BlY2lmaWNGdW5jdGlvbnMpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVUeXBlQ29uc3RyYWludHMgPSB2YWxpZGF0aW9uUnVsZXMgPT4gYXN5bmMgKGZpZWxkLCByZWNvcmQsIGNvbnRleHQpID0+IHtcbiAgY29uc3QgZmllbGRWYWx1ZSA9IHJlY29yZFtmaWVsZC5uYW1lXTtcbiAgY29uc3QgdmFsaWRhdGVSdWxlID0gYXN5bmMgciA9PiAoIWF3YWl0IHIuaXNWYWxpZChmaWVsZFZhbHVlLCBmaWVsZC50eXBlT3B0aW9ucywgY29udGV4dClcbiAgICA/IHIuZ2V0TWVzc2FnZShmaWVsZFZhbHVlLCBmaWVsZC50eXBlT3B0aW9ucylcbiAgICA6ICcnKTtcblxuICBjb25zdCBlcnJvcnMgPSBbXTtcbiAgZm9yIChjb25zdCByIG9mIHZhbGlkYXRpb25SdWxlcykge1xuICAgIGNvbnN0IGVyciA9IGF3YWl0IHZhbGlkYXRlUnVsZShyKTtcbiAgICBpZiAoaXNOb3RFbXB0eShlcnIpKSBlcnJvcnMucHVzaChlcnIpO1xuICB9XG5cbiAgcmV0dXJuIGVycm9ycztcbn07XG5cbmNvbnN0IGdldERlZmF1bHRPcHRpb25zID0gbWFwVmFsdWVzKHYgPT4gdi5kZWZhdWx0VmFsdWUpO1xuXG5leHBvcnQgY29uc3QgbWFrZXJ1bGUgPSAoaXNWYWxpZCwgZ2V0TWVzc2FnZSkgPT4gKHsgaXNWYWxpZCwgZ2V0TWVzc2FnZSB9KTtcbmV4cG9ydCBjb25zdCBwYXJzZWRGYWlsZWQgPSB2YWwgPT4gKHsgc3VjY2VzczogZmFsc2UsIHZhbHVlOiB2YWwgfSk7XG5leHBvcnQgY29uc3QgcGFyc2VkU3VjY2VzcyA9IHZhbCA9PiAoeyBzdWNjZXNzOiB0cnVlLCB2YWx1ZTogdmFsIH0pO1xuZXhwb3J0IGNvbnN0IGdldERlZmF1bHRFeHBvcnQgPSAobmFtZSwgdHJ5UGFyc2UsIGZ1bmN0aW9ucywgb3B0aW9ucywgdmFsaWRhdGlvblJ1bGVzLCBzYW1wbGVWYWx1ZSwgc3RyaW5naWZ5KSA9PiAoe1xuICBnZXROZXc6IGdldE5ld1ZhbHVlKHRyeVBhcnNlLCBmdW5jdGlvbnMpLFxuICBzYWZlUGFyc2VGaWVsZDogZ2V0U2FmZUZpZWxkUGFyc2VyKHRyeVBhcnNlLCBmdW5jdGlvbnMpLFxuICBzYWZlUGFyc2VWYWx1ZTogZ2V0U2FmZVZhbHVlUGFyc2VyKHRyeVBhcnNlLCBmdW5jdGlvbnMpLFxuICB0cnlQYXJzZSxcbiAgbmFtZSxcbiAgZ2V0RGVmYXVsdE9wdGlvbnM6ICgpID0+IGdldERlZmF1bHRPcHRpb25zKGNsb25lRGVlcChvcHRpb25zKSksXG4gIG9wdGlvbkRlZmluaXRpb25zOiBvcHRpb25zLFxuICB2YWxpZGF0ZVR5cGVDb25zdHJhaW50czogdmFsaWRhdGVUeXBlQ29uc3RyYWludHModmFsaWRhdGlvblJ1bGVzKSxcbiAgc2FtcGxlVmFsdWUsXG4gIHN0cmluZ2lmeTogdmFsID0+ICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWRcbiAgICA/ICcnIDogc3RyaW5naWZ5KHZhbCkpLFxuICBnZXREZWZhdWx0VmFsdWU6IGZ1bmN0aW9ucy5kZWZhdWx0LFxufSk7XG4iLCJpbXBvcnQge1xuICBjb25zdGFudCwgaXNTdHJpbmcsXG4gIGlzTnVsbCwgaW5jbHVkZXMsIGlzQm9vbGVhbixcbn0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7XG4gIHR5cGVGdW5jdGlvbnMsXG4gIG1ha2VydWxlLCBwYXJzZWRTdWNjZXNzLCBnZXREZWZhdWx0RXhwb3J0LFxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLCB0b0Jvb2xPck51bGwsIHRvTnVtYmVyT3JOdWxsLFxuICBpc1NhZmVJbnRlZ2VyLCBpc0FycmF5T2ZTdHJpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5cbmNvbnN0IHN0cmluZ0Z1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBjb25zdGFudChudWxsKSxcbn0pO1xuXG5jb25zdCBzdHJpbmdUcnlQYXJzZSA9IHN3aXRjaENhc2UoXG4gIFtpc1N0cmluZywgcGFyc2VkU3VjY2Vzc10sXG4gIFtpc051bGwsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbZGVmYXVsdENhc2UsIHYgPT4gcGFyc2VkU3VjY2Vzcyh2LnRvU3RyaW5nKCkpXSxcbik7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIG1heExlbmd0aDoge1xuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICBpc1ZhbGlkOiBuID0+IG4gPT09IG51bGwgfHwgaXNTYWZlSW50ZWdlcihuKSAmJiBuID4gMCxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbWF4IGxlbmd0aCBtdXN0IGJlIG51bGwgKG5vIGxpbWl0KSBvciBhIGdyZWF0ZXIgdGhhbiB6ZXJvIGludGVnZXInLFxuICAgIHBhcnNlOiB0b051bWJlck9yTnVsbCxcbiAgfSxcbiAgdmFsdWVzOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICAgIGlzVmFsaWQ6IHYgPT4gdiA9PT0gbnVsbCB8fCAoaXNBcnJheU9mU3RyaW5nKHYpICYmIHYubGVuZ3RoID4gMCAmJiB2Lmxlbmd0aCA8IDEwMDAwKSxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiBcIid2YWx1ZXMnIG11c3QgYmUgbnVsbCAobm8gdmFsdWVzKSBvciBhbiBhcnJ5IG9mIGF0IGxlYXN0IG9uZSBzdHJpbmdcIixcbiAgICBwYXJzZTogcyA9PiBzLFxuICB9LFxuICBhbGxvd0RlY2xhcmVkVmFsdWVzT25seToge1xuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgaXNWYWxpZDogaXNCb29sZWFuLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdhbGxvd0RlY2xhcmVkVmFsdWVzT25seSBtdXN0IGJlIHRydWUgb3IgZmFsc2UnLFxuICAgIHBhcnNlOiB0b0Jvb2xPck51bGwsXG4gIH0sXG59O1xuXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCBvcHRzLm1heExlbmd0aCA9PT0gbnVsbCB8fCB2YWwubGVuZ3RoIDw9IG9wdHMubWF4TGVuZ3RoLFxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSBleGNlZWRzIG1heGltdW0gbGVuZ3RoIG9mICR7b3B0cy5tYXhMZW5ndGh9YCksXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgb3B0cy5hbGxvd0RlY2xhcmVkVmFsdWVzT25seSA9PT0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGluY2x1ZGVzKG9wdHMudmFsdWVzLCB2YWwpLFxuICAodmFsKSA9PiBgXCIke3ZhbH1cIiBkb2VzIG5vdCBleGlzdCBpbiB0aGUgbGlzdCBvZiBhbGxvd2VkIHZhbHVlc2ApLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcbiAgJ3N0cmluZycsXG4gIHN0cmluZ1RyeVBhcnNlLFxuICBzdHJpbmdGdW5jdGlvbnMsXG4gIG9wdGlvbnMsXG4gIHR5cGVDb25zdHJhaW50cyxcbiAgJ2FiY2RlJyxcbiAgc3RyID0+IHN0cixcbik7XG4iLCJpbXBvcnQgeyBjb25zdGFudCwgaXNCb29sZWFuLCBpc051bGwgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgdHlwZUZ1bmN0aW9ucyxcbiAgbWFrZXJ1bGUsIHBhcnNlZEZhaWxlZCwgcGFyc2VkU3VjY2VzcyxcbiAgZ2V0RGVmYXVsdEV4cG9ydCxcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgaXNPbmVPZiwgdG9Cb29sT3JOdWxsLFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBib29sRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XG4gIGRlZmF1bHQ6IGNvbnN0YW50KG51bGwpLFxufSk7XG5cbmNvbnN0IGJvb2xUcnlQYXJzZSA9IHN3aXRjaENhc2UoXG4gIFtpc0Jvb2xlYW4sIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNOdWxsLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzT25lT2YoJ3RydWUnLCAnMScsICd5ZXMnLCAnb24nKSwgKCkgPT4gcGFyc2VkU3VjY2Vzcyh0cnVlKV0sXG4gIFtpc09uZU9mKCdmYWxzZScsICcwJywgJ25vJywgJ29mZicpLCAoKSA9PiBwYXJzZWRTdWNjZXNzKGZhbHNlKV0sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbik7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIGFsbG93TnVsbHM6IHtcbiAgICBkZWZhdWx0VmFsdWU6IHRydWUsXG4gICAgaXNWYWxpZDogaXNCb29sZWFuLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgdHJ1ZSBvciBmYWxzZScsXG4gICAgcGFyc2U6IHRvQm9vbE9yTnVsbCxcbiAgfSxcbn07XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gb3B0cy5hbGxvd051bGxzID09PSB0cnVlIHx8IHZhbCAhPT0gbnVsbCxcbiAgICAoKSA9PiAnZmllbGQgY2Fubm90IGJlIG51bGwnKSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXG4gICdib29sJywgYm9vbFRyeVBhcnNlLCBib29sRnVuY3Rpb25zLFxuICBvcHRpb25zLCB0eXBlQ29uc3RyYWludHMsIHRydWUsIEpTT04uc3RyaW5naWZ5LFxuKTtcbiIsImltcG9ydCB7XG4gIGNvbnN0YW50LCBpc051bWJlciwgaXNTdHJpbmcsIGlzTnVsbCxcbn0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7XG4gIG1ha2VydWxlLCB0eXBlRnVuY3Rpb25zLFxuICBwYXJzZWRGYWlsZWQsIHBhcnNlZFN1Y2Nlc3MsIGdldERlZmF1bHRFeHBvcnQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIHRvTnVtYmVyT3JOdWxsLFxuICBpc1NhZmVJbnRlZ2VyLFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBudW1iZXJGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogY29uc3RhbnQobnVsbCksXG59KTtcblxuY29uc3QgcGFyc2VTdHJpbmd0b051bWJlck9yTnVsbCA9IChzKSA9PiB7XG4gIGNvbnN0IG51bSA9IE51bWJlcihzKTtcbiAgcmV0dXJuIGlzTmFOKG51bSkgPyBwYXJzZWRGYWlsZWQocykgOiBwYXJzZWRTdWNjZXNzKG51bSk7XG59O1xuXG5jb25zdCBudW1iZXJUcnlQYXJzZSA9IHN3aXRjaENhc2UoXG4gIFtpc051bWJlciwgcGFyc2VkU3VjY2Vzc10sXG4gIFtpc1N0cmluZywgcGFyc2VTdHJpbmd0b051bWJlck9yTnVsbF0sXG4gIFtpc051bGwsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBtYXhWYWx1ZToge1xuICAgIGRlZmF1bHRWYWx1ZTogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIsXG4gICAgaXNWYWxpZDogaXNTYWZlSW50ZWdlcixcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHZhbGlkIGludGVnZXInLFxuICAgIHBhcnNlOiB0b051bWJlck9yTnVsbCxcbiAgfSxcbiAgbWluVmFsdWU6IHtcbiAgICBkZWZhdWx0VmFsdWU6IDAgLSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUixcbiAgICBpc1ZhbGlkOiBpc1NhZmVJbnRlZ2VyLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgdmFsaWQgaW50ZWdlcicsXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxuICB9LFxuICBkZWNpbWFsUGxhY2VzOiB7XG4gICAgZGVmYXVsdFZhbHVlOiAwLFxuICAgIGlzVmFsaWQ6IG4gPT4gaXNTYWZlSW50ZWdlcihuKSAmJiBuID49IDAsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG59O1xuXG5jb25zdCBnZXREZWNpbWFsUGxhY2VzID0gKHZhbCkgPT4ge1xuICBjb25zdCBzcGxpdERlY2ltYWwgPSB2YWwudG9TdHJpbmcoKS5zcGxpdCgnLicpO1xuICBpZiAoc3BsaXREZWNpbWFsLmxlbmd0aCA9PT0gMSkgcmV0dXJuIDA7XG4gIHJldHVybiBzcGxpdERlY2ltYWxbMV0ubGVuZ3RoO1xufTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5taW5WYWx1ZSA9PT0gbnVsbCB8fCB2YWwgPj0gb3B0cy5taW5WYWx1ZSxcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgKCR7dmFsLnRvU3RyaW5nKCl9KSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAke29wdHMubWluVmFsdWV9YCksXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCBvcHRzLm1heFZhbHVlID09PSBudWxsIHx8IHZhbCA8PSBvcHRzLm1heFZhbHVlLFxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSAoJHt2YWwudG9TdHJpbmcoKX0pIG11c3QgYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvICR7b3B0cy5taW5WYWx1ZX0gb3B0aW9uc2ApLFxuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5kZWNpbWFsUGxhY2VzID49IGdldERlY2ltYWxQbGFjZXModmFsKSxcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgKCR7dmFsLnRvU3RyaW5nKCl9KSBtdXN0IGhhdmUgJHtvcHRzLmRlY2ltYWxQbGFjZXN9IGRlY2ltYWwgcGxhY2VzIG9yIGxlc3NgKSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXG4gICdudW1iZXInLFxuICBudW1iZXJUcnlQYXJzZSxcbiAgbnVtYmVyRnVuY3Rpb25zLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gIDEsXG4gIG51bSA9PiBudW0udG9TdHJpbmcoKSxcbik7XG4iLCJpbXBvcnQge1xuICBjb25zdGFudCwgaXNEYXRlLCBpc1N0cmluZywgaXNOdWxsLFxufSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgbWFrZXJ1bGUsIHR5cGVGdW5jdGlvbnMsXG4gIHBhcnNlZEZhaWxlZCwgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9EYXRlT3JOdWxsLFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBkYXRlRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XG4gIGRlZmF1bHQ6IGNvbnN0YW50KG51bGwpLFxuICBub3c6ICgpID0+IG5ldyBEYXRlKCksXG59KTtcblxuY29uc3QgaXNWYWxpZERhdGUgPSBkID0+IGQgaW5zdGFuY2VvZiBEYXRlICYmICFpc05hTihkKTtcblxuY29uc3QgcGFyc2VTdHJpbmdUb0RhdGUgPSBzID0+IHN3aXRjaENhc2UoXG4gIFtpc1ZhbGlkRGF0ZSwgcGFyc2VkU3VjY2Vzc10sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbikobmV3IERhdGUocykpO1xuXG5cbmNvbnN0IGRhdGVUcnlQYXJzZSA9IHN3aXRjaENhc2UoXG4gIFtpc0RhdGUsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNTdHJpbmcsIHBhcnNlU3RyaW5nVG9EYXRlXSxcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbik7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIG1heFZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBuZXcgRGF0ZSgzMjUwMzY4MDAwMDAwMCksXG4gICAgaXNWYWxpZDogaXNEYXRlLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgdmFsaWQgZGF0ZScsXG4gICAgcGFyc2U6IHRvRGF0ZU9yTnVsbCxcbiAgfSxcbiAgbWluVmFsdWU6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG5ldyBEYXRlKC04NTIwMzM2MDAwMDAwKSxcbiAgICBpc1ZhbGlkOiBpc0RhdGUsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB2YWxpZCBkYXRlJyxcbiAgICBwYXJzZTogdG9EYXRlT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5taW5WYWx1ZSA9PT0gbnVsbCB8fCB2YWwgPj0gb3B0cy5taW5WYWx1ZSxcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgKCR7dmFsLnRvU3RyaW5nKCl9KSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAke29wdHMubWluVmFsdWV9YCksXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCBvcHRzLm1heFZhbHVlID09PSBudWxsIHx8IHZhbCA8PSBvcHRzLm1heFZhbHVlLFxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSAoJHt2YWwudG9TdHJpbmcoKX0pIG11c3QgYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvICR7b3B0cy5taW5WYWx1ZX0gb3B0aW9uc2ApLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcbiAgJ2RhdGV0aW1lJyxcbiAgZGF0ZVRyeVBhcnNlLFxuICBkYXRlRnVuY3Rpb25zLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gIG5ldyBEYXRlKDE5ODQsIDQsIDEpLFxuICBkYXRlID0+IEpTT04uc3RyaW5naWZ5KGRhdGUpLnJlcGxhY2UobmV3IFJlZ0V4cCgnXCInLCAnZycpLCAnJyksXG4pO1xuIiwiaW1wb3J0IHsgY29uc3RhbnQsIGlzQXJyYXkgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIHR5cGVGdW5jdGlvbnMsIG1ha2VydWxlLFxuICBwYXJzZWRGYWlsZWQsIGdldERlZmF1bHRFeHBvcnQsIHBhcnNlZFN1Y2Nlc3MsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIHRvTnVtYmVyT3JOdWxsLFxuICAkJCwgaXNTYWZlSW50ZWdlcixcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgYXJyYXlGdW5jdGlvbnMgPSAoKSA9PiB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogY29uc3RhbnQoW10pLFxufSk7XG5cbmNvbnN0IG1hcFRvUGFyc2VkQXJyYXJ5ID0gdHlwZSA9PiAkJChcbiAgbWFwKGkgPT4gdHlwZS5zYWZlUGFyc2VWYWx1ZShpKSksXG4gIHBhcnNlZFN1Y2Nlc3MsXG4pO1xuXG5jb25zdCBhcnJheVRyeVBhcnNlID0gdHlwZSA9PiBzd2l0Y2hDYXNlKFxuICBbaXNBcnJheSwgbWFwVG9QYXJzZWRBcnJhcnkodHlwZSldLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pO1xuXG5jb25zdCB0eXBlTmFtZSA9IHR5cGUgPT4gYGFycmF5PCR7dHlwZX0+YDtcblxuXG5jb25zdCBvcHRpb25zID0ge1xuICBtYXhMZW5ndGg6IHtcbiAgICBkZWZhdWx0VmFsdWU6IDEwMDAwLFxuICAgIGlzVmFsaWQ6IGlzU2FmZUludGVnZXIsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG4gIG1pbkxlbmd0aDoge1xuICAgIGRlZmF1bHRWYWx1ZTogMCxcbiAgICBpc1ZhbGlkOiBuID0+IGlzU2FmZUludGVnZXIobikgJiYgbiA+PSAwLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlcicsXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgdmFsLmxlbmd0aCA+PSBvcHRzLm1pbkxlbmd0aCxcbiAgICAodmFsLCBvcHRzKSA9PiBgbXVzdCBjaG9vc2UgJHtvcHRzLm1pbkxlbmd0aH0gb3IgbW9yZSBvcHRpb25zYCksXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCB2YWwubGVuZ3RoIDw9IG9wdHMubWF4TGVuZ3RoLFxuICAgICh2YWwsIG9wdHMpID0+IGBjYW5ub3QgY2hvb3NlIG1vcmUgdGhhbiAke29wdHMubWF4TGVuZ3RofSBvcHRpb25zYCksXG5dO1xuXG5leHBvcnQgZGVmYXVsdCB0eXBlID0+IGdldERlZmF1bHRFeHBvcnQoXG4gIHR5cGVOYW1lKHR5cGUubmFtZSksXG4gIGFycmF5VHJ5UGFyc2UodHlwZSksXG4gIGFycmF5RnVuY3Rpb25zKHR5cGUpLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gIFt0eXBlLnNhbXBsZVZhbHVlXSxcbiAgSlNPTi5zdHJpbmdpZnksXG4pO1xuIiwiaW1wb3J0IHtcbiAgaXNTdHJpbmcsIGlzT2JqZWN0TGlrZSxcbiAgaXNOdWxsLCBoYXMsIGlzRW1wdHksXG59IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICB0eXBlRnVuY3Rpb25zLCBtYWtlcnVsZSxcbiAgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcbiAgcGFyc2VkRmFpbGVkLFxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLFxuICBpc05vbkVtcHR5U3RyaW5nLCBpc0FycmF5T2ZTdHJpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5cbmNvbnN0IHJlZmVyZW5jZU5vdGhpbmcgPSAoKSA9PiAoeyBrZXk6ICcnIH0pO1xuXG5jb25zdCByZWZlcmVuY2VGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogcmVmZXJlbmNlTm90aGluZyxcbn0pO1xuXG5jb25zdCBoYXNTdHJpbmdWYWx1ZSA9IChvYiwgcGF0aCkgPT4gaGFzKG9iLCBwYXRoKVxuICAgICYmIGlzU3RyaW5nKG9iW3BhdGhdKTtcblxuY29uc3QgaXNPYmplY3RXaXRoS2V5ID0gdiA9PiBpc09iamVjdExpa2UodilcbiAgICAmJiBoYXNTdHJpbmdWYWx1ZSh2LCAna2V5Jyk7XG5cbmNvbnN0IHRyeVBhcnNlRnJvbVN0cmluZyA9IHMgPT4ge1xuXG4gIHRyeSB7XG4gICAgY29uc3QgYXNPYmogPSBKU09OLnBhcnNlKHMpO1xuICAgIGlmKGlzT2JqZWN0V2l0aEtleSkge1xuICAgICAgcmV0dXJuIHBhcnNlZFN1Y2Nlc3MoYXNPYmopO1xuICAgIH1cbiAgfVxuICBjYXRjaChfKSB7XG4gICAgLy8gRU1QVFlcbiAgfVxuXG4gIHJldHVybiBwYXJzZWRGYWlsZWQocyk7XG59XG5cbmNvbnN0IHJlZmVyZW5jZVRyeVBhcnNlID0gdiA9PiBzd2l0Y2hDYXNlKFxuICBbaXNPYmplY3RXaXRoS2V5LCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzU3RyaW5nLCB0cnlQYXJzZUZyb21TdHJpbmddLFxuICBbaXNOdWxsLCAoKSA9PiBwYXJzZWRTdWNjZXNzKHJlZmVyZW5jZU5vdGhpbmcoKSldLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pKHYpO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBpbmRleE5vZGVLZXk6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgaXNWYWxpZDogaXNOb25FbXB0eVN0cmluZyxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnLFxuICAgIHBhcnNlOiBzID0+IHMsXG4gIH0sXG4gIGRpc3BsYXlWYWx1ZToge1xuICAgIGRlZmF1bHRWYWx1ZTogJycsXG4gICAgaXNWYWxpZDogaXNOb25FbXB0eVN0cmluZyxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnLFxuICAgIHBhcnNlOiBzID0+IHMsXG4gIH0sXG4gIHJldmVyc2VJbmRleE5vZGVLZXlzOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICAgIGlzVmFsaWQ6IHYgPT4gaXNBcnJheU9mU3RyaW5nKHYpICYmIHYubGVuZ3RoID4gMCxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIG5vbi1lbXB0eSBhcnJheSBvZiBzdHJpbmdzJyxcbiAgICBwYXJzZTogcyA9PiBzLFxuICB9LFxufTtcblxuY29uc3QgaXNFbXB0eVN0cmluZyA9IHMgPT4gaXNTdHJpbmcocykgJiYgaXNFbXB0eShzKTtcblxuY29uc3QgZW5zdXJlUmVmZXJlbmNlRXhpc3RzID0gYXN5bmMgKHZhbCwgb3B0cywgY29udGV4dCkgPT4gaXNFbXB0eVN0cmluZyh2YWwua2V5KVxuICAgIHx8IGF3YWl0IGNvbnRleHQucmVmZXJlbmNlRXhpc3RzKG9wdHMsIHZhbC5rZXkpO1xuXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXG4gIG1ha2VydWxlKFxuICAgIGVuc3VyZVJlZmVyZW5jZUV4aXN0cyxcbiAgICAodmFsLCBvcHRzKSA9PiBgXCIke3ZhbFtvcHRzLmRpc3BsYXlWYWx1ZV19XCIgZG9lcyBub3QgZXhpc3QgaW4gb3B0aW9ucyBsaXN0IChrZXk6ICR7dmFsLmtleX0pYCxcbiAgKSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXG4gICdyZWZlcmVuY2UnLFxuICByZWZlcmVuY2VUcnlQYXJzZSxcbiAgcmVmZXJlbmNlRnVuY3Rpb25zLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gIHsga2V5OiAna2V5JywgdmFsdWU6ICd2YWx1ZScgfSxcbiAgSlNPTi5zdHJpbmdpZnksXG4pO1xuIiwiaW1wb3J0IHtcbiAgbGFzdCwgaGFzLCBpc1N0cmluZywgaW50ZXJzZWN0aW9uLFxuICBpc051bGwsIGlzTnVtYmVyLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgdHlwZUZ1bmN0aW9ucywgcGFyc2VkRmFpbGVkLFxuICBwYXJzZWRTdWNjZXNzLCBnZXREZWZhdWx0RXhwb3J0LFxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLCBub25lLFxuICAkLCBzcGxpdEtleSxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgaWxsZWdhbENoYXJhY3RlcnMgPSAnKj9cXFxcLzo8PnxcXDBcXGJcXGZcXHYnO1xuXG5leHBvcnQgY29uc3QgaXNMZWdhbEZpbGVuYW1lID0gKGZpbGVQYXRoKSA9PiB7XG4gIGNvbnN0IGZuID0gZmlsZU5hbWUoZmlsZVBhdGgpO1xuICByZXR1cm4gZm4ubGVuZ3RoIDw9IDI1NVxuICAgICYmIGludGVyc2VjdGlvbihmbi5zcGxpdCgnJykpKGlsbGVnYWxDaGFyYWN0ZXJzLnNwbGl0KCcnKSkubGVuZ3RoID09PSAwXG4gICAgJiYgbm9uZShmID0+IGYgPT09ICcuLicpKHNwbGl0S2V5KGZpbGVQYXRoKSk7XG59O1xuXG5jb25zdCBmaWxlTm90aGluZyA9ICgpID0+ICh7IHJlbGF0aXZlUGF0aDogJycsIHNpemU6IDAgfSk7XG5cbmNvbnN0IGZpbGVGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogZmlsZU5vdGhpbmcsXG59KTtcblxuY29uc3QgZmlsZVRyeVBhcnNlID0gdiA9PiBzd2l0Y2hDYXNlKFxuICBbaXNWYWxpZEZpbGUsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNOdWxsLCAoKSA9PiBwYXJzZWRTdWNjZXNzKGZpbGVOb3RoaW5nKCkpXSxcbiAgW2RlZmF1bHRDYXNlLCBwYXJzZWRGYWlsZWRdLFxuKSh2KTtcblxuY29uc3QgZmlsZU5hbWUgPSBmaWxlUGF0aCA9PiAkKGZpbGVQYXRoLCBbXG4gIHNwbGl0S2V5LFxuICBsYXN0LFxuXSk7XG5cbmNvbnN0IGlzVmFsaWRGaWxlID0gZiA9PiAhaXNOdWxsKGYpXG4gICAgJiYgaGFzKCdyZWxhdGl2ZVBhdGgnKShmKSAmJiBoYXMoJ3NpemUnKShmKVxuICAgICYmIGlzTnVtYmVyKGYuc2l6ZSlcbiAgICAmJiBpc1N0cmluZyhmLnJlbGF0aXZlUGF0aClcbiAgICAmJiBpc0xlZ2FsRmlsZW5hbWUoZi5yZWxhdGl2ZVBhdGgpO1xuXG5jb25zdCBvcHRpb25zID0ge307XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtdO1xuXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxuICAnZmlsZScsXG4gIGZpbGVUcnlQYXJzZSxcbiAgZmlsZUZ1bmN0aW9ucyxcbiAgb3B0aW9ucyxcbiAgdHlwZUNvbnN0cmFpbnRzLFxuICB7IHJlbGF0aXZlUGF0aDogJ3NvbWVfZmlsZS5qcGcnLCBzaXplOiAxMDAwIH0sXG4gIEpTT04uc3RyaW5naWZ5LFxuKTtcbiIsImltcG9ydCB7XG4gIGFzc2lnbiwga2V5cywgbWVyZ2UsIGhhcyxcbn0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7XG4gIG1hcCwgaXNTdHJpbmcsIGlzTnVtYmVyLFxuICBpc0Jvb2xlYW4sIGlzRGF0ZSxcbiAgaXNPYmplY3QsIGlzQXJyYXksXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBhcnNlZFN1Y2Nlc3MgfSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCBzdHJpbmcgZnJvbSAnLi9zdHJpbmcnO1xuaW1wb3J0IGJvb2wgZnJvbSAnLi9ib29sJztcbmltcG9ydCBudW1iZXIgZnJvbSAnLi9udW1iZXInO1xuaW1wb3J0IGRhdGV0aW1lIGZyb20gJy4vZGF0ZXRpbWUnO1xuaW1wb3J0IGFycmF5IGZyb20gJy4vYXJyYXknO1xuaW1wb3J0IHJlZmVyZW5jZSBmcm9tICcuL3JlZmVyZW5jZSc7XG5pbXBvcnQgZmlsZSBmcm9tICcuL2ZpbGUnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmNvbnN0IGFsbFR5cGVzID0gKCkgPT4ge1xuICBjb25zdCBiYXNpY1R5cGVzID0ge1xuICAgIHN0cmluZywgbnVtYmVyLCBkYXRldGltZSwgYm9vbCwgcmVmZXJlbmNlLCBmaWxlLFxuICB9O1xuXG4gIGNvbnN0IGFycmF5cyA9ICQoYmFzaWNUeXBlcywgW1xuICAgIGtleXMsXG4gICAgbWFwKChrKSA9PiB7XG4gICAgICBjb25zdCBrdlR5cGUgPSB7fTtcbiAgICAgIGNvbnN0IGNvbmNyZXRlQXJyYXkgPSBhcnJheShiYXNpY1R5cGVzW2tdKTtcbiAgICAgIGt2VHlwZVtjb25jcmV0ZUFycmF5Lm5hbWVdID0gY29uY3JldGVBcnJheTtcbiAgICAgIHJldHVybiBrdlR5cGU7XG4gICAgfSksXG4gICAgdHlwZXMgPT4gYXNzaWduKHt9LCAuLi50eXBlcyksXG4gIF0pO1xuXG4gIHJldHVybiBtZXJnZSh7fSwgYmFzaWNUeXBlcywgYXJyYXlzKTtcbn07XG5cblxuZXhwb3J0IGNvbnN0IGFsbCA9IGFsbFR5cGVzKCk7XG5cbmV4cG9ydCBjb25zdCBnZXRUeXBlID0gKHR5cGVOYW1lKSA9PiB7XG4gIGlmICghaGFzKGFsbCwgdHlwZU5hbWUpKSB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBEbyBub3QgcmVjb2duaXNlIHR5cGUgJHt0eXBlTmFtZX1gKTtcbiAgcmV0dXJuIGFsbFt0eXBlTmFtZV07XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U2FtcGxlRmllbGRWYWx1ZSA9IGZpZWxkID0+IGdldFR5cGUoZmllbGQudHlwZSkuc2FtcGxlVmFsdWU7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdGaWVsZFZhbHVlID0gZmllbGQgPT4gZ2V0VHlwZShmaWVsZC50eXBlKS5nZXROZXcoZmllbGQpO1xuXG5leHBvcnQgY29uc3Qgc2FmZVBhcnNlRmllbGQgPSAoZmllbGQsIHJlY29yZCkgPT4gZ2V0VHlwZShmaWVsZC50eXBlKS5zYWZlUGFyc2VGaWVsZChmaWVsZCwgcmVjb3JkKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlRmllbGRQYXJzZSA9IChmaWVsZCwgcmVjb3JkKSA9PiAoaGFzKHJlY29yZCwgZmllbGQubmFtZSlcbiAgPyBnZXRUeXBlKGZpZWxkLnR5cGUpLnRyeVBhcnNlKHJlY29yZFtmaWVsZC5uYW1lXSlcbiAgOiBwYXJzZWRTdWNjZXNzKHVuZGVmaW5lZCkpOyAvLyBmaWVsZHMgbWF5IGJlIHVuZGVmaW5lZCBieSBkZWZhdWx0XG5cbmV4cG9ydCBjb25zdCBnZXREZWZhdWx0T3B0aW9ucyA9IHR5cGUgPT4gZ2V0VHlwZSh0eXBlKS5nZXREZWZhdWx0T3B0aW9ucygpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVUeXBlQ29uc3RyYWludHMgPSBhc3luYyAoZmllbGQsIHJlY29yZCwgY29udGV4dCkgPT4gYXdhaXQgZ2V0VHlwZShmaWVsZC50eXBlKS52YWxpZGF0ZVR5cGVDb25zdHJhaW50cyhmaWVsZCwgcmVjb3JkLCBjb250ZXh0KTtcblxuZXhwb3J0IGNvbnN0IGRldGVjdFR5cGUgPSAodmFsdWUpID0+IHtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkgcmV0dXJuIHN0cmluZztcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpIHJldHVybiBib29sO1xuICBpZiAoaXNOdW1iZXIodmFsdWUpKSByZXR1cm4gbnVtYmVyO1xuICBpZiAoaXNEYXRlKHZhbHVlKSkgcmV0dXJuIGRhdGV0aW1lO1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHJldHVybiBhcnJheShkZXRlY3RUeXBlKHZhbHVlWzBdKSk7XG4gIGlmIChpc09iamVjdCh2YWx1ZSlcbiAgICAgICAmJiBoYXModmFsdWUsICdrZXknKVxuICAgICAgICYmIGhhcyh2YWx1ZSwgJ3ZhbHVlJykpIHJldHVybiByZWZlcmVuY2U7XG4gIGlmIChpc09iamVjdCh2YWx1ZSlcbiAgICAgICAgJiYgaGFzKHZhbHVlLCAncmVsYXRpdmVQYXRoJylcbiAgICAgICAgJiYgaGFzKHZhbHVlLCAnc2l6ZScpKSByZXR1cm4gZmlsZTtcblxuICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBjYW5ub3QgZGV0ZXJtaW5lIHR5cGU6ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWApO1xufTtcbiIsImltcG9ydCB7IGNsb25lLCBmaW5kLCBzcGxpdCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBqb2luS2V5LCAkIH0gZnJvbSAnLi4vY29tbW9uJztcbi8vIDUgbWludXRlc1xuZXhwb3J0IGNvbnN0IHRlbXBDb2RlRXhwaXJ5TGVuZ3RoID0gNSAqIDYwICogMTAwMDtcblxuZXhwb3J0IGNvbnN0IEFVVEhfRk9MREVSID0gJy8uYXV0aCc7XG5leHBvcnQgY29uc3QgVVNFUlNfTElTVF9GSUxFID0gam9pbktleShBVVRIX0ZPTERFUiwgJ3VzZXJzLmpzb24nKTtcbmV4cG9ydCBjb25zdCB1c2VyQXV0aEZpbGUgPSB1c2VybmFtZSA9PiBqb2luS2V5KEFVVEhfRk9MREVSLCBgYXV0aF8ke3VzZXJuYW1lfS5qc29uYCk7XG5leHBvcnQgY29uc3QgVVNFUlNfTE9DS19GSUxFID0gam9pbktleShBVVRIX0ZPTERFUiwgJ3VzZXJzX2xvY2snKTtcbmV4cG9ydCBjb25zdCBBQ0NFU1NfTEVWRUxTX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAnYWNjZXNzX2xldmVscy5qc29uJyk7XG5leHBvcnQgY29uc3QgQUNDRVNTX0xFVkVMU19MT0NLX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAnYWNjZXNzX2xldmVsc19sb2NrJyk7XG5cbmV4cG9ydCBjb25zdCBwZXJtaXNzaW9uVHlwZXMgPSB7XG4gIENSRUFURV9SRUNPUkQ6ICdjcmVhdGUgcmVjb3JkJyxcbiAgVVBEQVRFX1JFQ09SRDogJ3VwZGF0ZSByZWNvcmQnLFxuICBSRUFEX1JFQ09SRDogJ3JlYWQgcmVjb3JkJyxcbiAgREVMRVRFX1JFQ09SRDogJ2RlbGV0ZSByZWNvcmQnLFxuICBSRUFEX0lOREVYOiAncmVhZCBpbmRleCcsXG4gIE1BTkFHRV9JTkRFWDogJ21hbmFnZSBpbmRleCcsXG4gIE1BTkFHRV9DT0xMRUNUSU9OOiAnbWFuYWdlIGNvbGxlY3Rpb24nLFxuICBXUklURV9URU1QTEFURVM6ICd3cml0ZSB0ZW1wbGF0ZXMnLFxuICBDUkVBVEVfVVNFUjogJ2NyZWF0ZSB1c2VyJyxcbiAgU0VUX1BBU1NXT1JEOiAnc2V0IHBhc3N3b3JkJyxcbiAgQ1JFQVRFX1RFTVBPUkFSWV9BQ0NFU1M6ICdjcmVhdGUgdGVtcG9yYXJ5IGFjY2VzcycsXG4gIEVOQUJMRV9ESVNBQkxFX1VTRVI6ICdlbmFibGUgb3IgZGlzYWJsZSB1c2VyJyxcbiAgV1JJVEVfQUNDRVNTX0xFVkVMUzogJ3dyaXRlIGFjY2VzcyBsZXZlbHMnLFxuICBMSVNUX1VTRVJTOiAnbGlzdCB1c2VycycsXG4gIExJU1RfQUNDRVNTX0xFVkVMUzogJ2xpc3QgYWNjZXNzIGxldmVscycsXG4gIEVYRUNVVEVfQUNUSU9OOiAnZXhlY3V0ZSBhY3Rpb24nLFxuICBTRVRfVVNFUl9BQ0NFU1NfTEVWRUxTOiAnc2V0IHVzZXIgYWNjZXNzIGxldmVscycsXG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VXNlckJ5TmFtZSA9ICh1c2VycywgbmFtZSkgPT4gJCh1c2VycywgW1xuICBmaW5kKHUgPT4gdS5uYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUudG9Mb3dlckNhc2UoKSksXG5dKTtcblxuZXhwb3J0IGNvbnN0IHN0cmlwVXNlck9mU2Vuc2l0aXZlU3R1ZmYgPSAodXNlcikgPT4ge1xuICBjb25zdCBzdHJpcHBlZCA9IGNsb25lKHVzZXIpO1xuICBkZWxldGUgc3RyaXBwZWQudGVtcENvZGU7XG4gIHJldHVybiBzdHJpcHBlZDtcbn07XG5cbmV4cG9ydCBjb25zdCBwYXJzZVRlbXBvcmFyeUNvZGUgPSBmdWxsQ29kZSA9PiAkKGZ1bGxDb2RlLCBbXG4gIHNwbGl0KCc6JyksXG4gIHBhcnRzID0+ICh7XG4gICAgaWQ6IHBhcnRzWzFdLFxuICAgIGNvZGU6IHBhcnRzWzJdLFxuICB9KSxcbl0pO1xuIiwiaW1wb3J0IHsgdmFsdWVzLCBpbmNsdWRlcywgc29tZSB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uVHlwZXMgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHtcbiAgJCwgaXNOb3RoaW5nLCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0Tm9kZUJ5S2V5T3JOb2RlS2V5LCBpc05vZGUgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgaXNBdXRob3JpemVkID0gYXBwID0+IChwZXJtaXNzaW9uVHlwZSwgcmVzb3VyY2VLZXkpID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmlzQXV0aG9yaXplZCxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyByZXNvdXJjZUtleSwgcGVybWlzc2lvblR5cGUgfSxcbiAgX2lzQXV0aG9yaXplZCwgYXBwLCBwZXJtaXNzaW9uVHlwZSwgcmVzb3VyY2VLZXksXG4pO1xuXG5leHBvcnQgY29uc3QgX2lzQXV0aG9yaXplZCA9IChhcHAsIHBlcm1pc3Npb25UeXBlLCByZXNvdXJjZUtleSkgPT4ge1xuICBpZiAoIWFwcC51c2VyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgdmFsaWRUeXBlID0gJChwZXJtaXNzaW9uVHlwZXMsIFtcbiAgICB2YWx1ZXMsXG4gICAgaW5jbHVkZXMocGVybWlzc2lvblR5cGUpLFxuICBdKTtcblxuICBpZiAoIXZhbGlkVHlwZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHBlcm1NYXRjaGVzUmVzb3VyY2UgPSAodXNlcnBlcm0pID0+IHtcbiAgICBjb25zdCBub2RlS2V5ID0gaXNOb3RoaW5nKHJlc291cmNlS2V5KVxuICAgICAgPyBudWxsXG4gICAgICA6IGlzTm9kZShhcHAuaGllcmFyY2h5LCByZXNvdXJjZUtleSlcbiAgICAgICAgPyBnZXROb2RlQnlLZXlPck5vZGVLZXkoXG4gICAgICAgICAgYXBwLmhpZXJhcmNoeSwgcmVzb3VyY2VLZXksXG4gICAgICAgICkubm9kZUtleSgpXG4gICAgICAgIDogcmVzb3VyY2VLZXk7XG5cbiAgICByZXR1cm4gKHVzZXJwZXJtLnR5cGUgPT09IHBlcm1pc3Npb25UeXBlKVxuICAgICAgICAmJiAoXG4gICAgICAgICAgaXNOb3RoaW5nKHJlc291cmNlS2V5KVxuICAgICAgICAgICAgfHwgbm9kZUtleSA9PT0gdXNlcnBlcm0ubm9kZUtleVxuICAgICAgICApO1xuICB9O1xuXG4gIHJldHVybiAkKGFwcC51c2VyLnBlcm1pc3Npb25zLCBbXG4gICAgc29tZShwZXJtTWF0Y2hlc1Jlc291cmNlKSxcbiAgXSk7XG59O1xuIiwiaW1wb3J0IHsgcGVybWlzc2lvblR5cGVzIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7IGlzQXV0aG9yaXplZCB9IGZyb20gJy4vaXNBdXRob3JpemVkJztcblxuZXhwb3J0IGNvbnN0IHRlbXBvcmFyeUFjY2Vzc1Blcm1pc3Npb25zID0gKCkgPT4gKFt7IHR5cGU6IHBlcm1pc3Npb25UeXBlcy5TRVRfUEFTU1dPUkQgfV0pO1xuXG5jb25zdCBub2RlUGVybWlzc2lvbiA9IHR5cGUgPT4gKHtcbiAgYWRkOiAobm9kZUtleSwgYWNjZXNzTGV2ZWwpID0+IGFjY2Vzc0xldmVsLnBlcm1pc3Npb25zLnB1c2goeyB0eXBlLCBub2RlS2V5IH0pLFxuICBpc0F1dGhvcml6ZWQ6IHJlc291cmNlS2V5ID0+IGFwcCA9PiBpc0F1dGhvcml6ZWQoYXBwKSh0eXBlLCByZXNvdXJjZUtleSksXG4gIGlzTm9kZTogdHJ1ZSxcbiAgZ2V0OiBub2RlS2V5ID0+ICh7IHR5cGUsIG5vZGVLZXkgfSksXG59KTtcblxuY29uc3Qgc3RhdGljUGVybWlzc2lvbiA9IHR5cGUgPT4gKHtcbiAgYWRkOiBhY2Nlc3NMZXZlbCA9PiBhY2Nlc3NMZXZlbC5wZXJtaXNzaW9ucy5wdXNoKHsgdHlwZSB9KSxcbiAgaXNBdXRob3JpemVkOiBhcHAgPT4gaXNBdXRob3JpemVkKGFwcCkodHlwZSksXG4gIGlzTm9kZTogZmFsc2UsXG4gIGdldDogKCkgPT4gKHsgdHlwZSB9KSxcbn0pO1xuXG5jb25zdCBjcmVhdGVSZWNvcmQgPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuQ1JFQVRFX1JFQ09SRCk7XG5cbmNvbnN0IHVwZGF0ZVJlY29yZCA9IG5vZGVQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5VUERBVEVfUkVDT1JEKTtcblxuY29uc3QgZGVsZXRlUmVjb3JkID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkRFTEVURV9SRUNPUkQpO1xuXG5jb25zdCByZWFkUmVjb3JkID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlJFQURfUkVDT1JEKTtcblxuY29uc3Qgd3JpdGVUZW1wbGF0ZXMgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5XUklURV9URU1QTEFURVMpO1xuXG5jb25zdCBjcmVhdGVVc2VyID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuQ1JFQVRFX1VTRVIpO1xuXG5jb25zdCBzZXRQYXNzd29yZCA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlNFVF9QQVNTV09SRCk7XG5cbmNvbnN0IHJlYWRJbmRleCA9IG5vZGVQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5SRUFEX0lOREVYKTtcblxuY29uc3QgbWFuYWdlSW5kZXggPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5NQU5BR0VfSU5ERVgpO1xuXG5jb25zdCBtYW5hZ2VDb2xsZWN0aW9uID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuTUFOQUdFX0NPTExFQ1RJT04pO1xuXG5jb25zdCBjcmVhdGVUZW1wb3JhcnlBY2Nlc3MgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfVEVNUE9SQVJZX0FDQ0VTUyk7XG5cbmNvbnN0IGVuYWJsZURpc2FibGVVc2VyID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuRU5BQkxFX0RJU0FCTEVfVVNFUik7XG5cbmNvbnN0IHdyaXRlQWNjZXNzTGV2ZWxzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuV1JJVEVfQUNDRVNTX0xFVkVMUyk7XG5cbmNvbnN0IGxpc3RVc2VycyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkxJU1RfVVNFUlMpO1xuXG5jb25zdCBsaXN0QWNjZXNzTGV2ZWxzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuTElTVF9BQ0NFU1NfTEVWRUxTKTtcblxuY29uc3Qgc2V0VXNlckFjY2Vzc0xldmVscyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlNFVF9VU0VSX0FDQ0VTU19MRVZFTFMpO1xuXG5jb25zdCBleGVjdXRlQWN0aW9uID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkVYRUNVVEVfQUNUSU9OKTtcblxuZXhwb3J0IGNvbnN0IGFsd2F5c0F1dGhvcml6ZWQgPSAoKSA9PiB0cnVlO1xuXG5leHBvcnQgY29uc3QgcGVybWlzc2lvbiA9IHtcbiAgY3JlYXRlUmVjb3JkLFxuICB1cGRhdGVSZWNvcmQsXG4gIGRlbGV0ZVJlY29yZCxcbiAgcmVhZFJlY29yZCxcbiAgd3JpdGVUZW1wbGF0ZXMsXG4gIGNyZWF0ZVVzZXIsXG4gIHNldFBhc3N3b3JkLFxuICByZWFkSW5kZXgsXG4gIGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyxcbiAgZW5hYmxlRGlzYWJsZVVzZXIsXG4gIHdyaXRlQWNjZXNzTGV2ZWxzLFxuICBsaXN0VXNlcnMsXG4gIGxpc3RBY2Nlc3NMZXZlbHMsXG4gIG1hbmFnZUluZGV4LFxuICBtYW5hZ2VDb2xsZWN0aW9uLFxuICBleGVjdXRlQWN0aW9uLFxuICBzZXRVc2VyQWNjZXNzTGV2ZWxzLFxufTtcbiIsImltcG9ydCB7XG4gIGtleUJ5LCBtYXBWYWx1ZXMsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHsgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IGdldE5ld0ZpZWxkVmFsdWUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge1xuICAkLCBqb2luS2V5LCBzYWZlS2V5LCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3ID0gYXBwID0+IChjb2xsZWN0aW9uS2V5LCByZWNvcmRUeXBlTmFtZSkgPT4ge1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0UmVjb3JkTm9kZShhcHAsIGNvbGxlY3Rpb25LZXksIHJlY29yZFR5cGVOYW1lKTtcbiAgcmV0dXJuIGFwaVdyYXBwZXJTeW5jKFxuICAgIGFwcCxcbiAgICBldmVudHMucmVjb3JkQXBpLmdldE5ldyxcbiAgICBwZXJtaXNzaW9uLmNyZWF0ZVJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkTm9kZS5ub2RlS2V5KCkpLFxuICAgIHsgY29sbGVjdGlvbktleSwgcmVjb3JkVHlwZU5hbWUgfSxcbiAgICBfZ2V0TmV3LCByZWNvcmROb2RlLCBjb2xsZWN0aW9uS2V5LFxuICApO1xufTtcblxuY29uc3QgX2dldE5ldyA9IChyZWNvcmROb2RlLCBjb2xsZWN0aW9uS2V5KSA9PiBjb25zdHJ1Y3RSZWNvcmQocmVjb3JkTm9kZSwgZ2V0TmV3RmllbGRWYWx1ZSwgY29sbGVjdGlvbktleSk7XG5cbmNvbnN0IGdldFJlY29yZE5vZGUgPSAoYXBwLCBjb2xsZWN0aW9uS2V5KSA9PiB7XG4gIGNvbGxlY3Rpb25LZXkgPSBzYWZlS2V5KGNvbGxlY3Rpb25LZXkpO1xuICByZXR1cm4gZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoKGFwcC5oaWVyYXJjaHkpKGNvbGxlY3Rpb25LZXkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0NoaWxkID0gYXBwID0+IChyZWNvcmRLZXksIGNvbGxlY3Rpb25OYW1lLCByZWNvcmRUeXBlTmFtZSkgPT4gXG4gIGdldE5ldyhhcHApKGpvaW5LZXkocmVjb3JkS2V5LCBjb2xsZWN0aW9uTmFtZSksIHJlY29yZFR5cGVOYW1lKTtcblxuZXhwb3J0IGNvbnN0IGNvbnN0cnVjdFJlY29yZCA9IChyZWNvcmROb2RlLCBnZXRGaWVsZFZhbHVlLCBjb2xsZWN0aW9uS2V5KSA9PiB7XG4gIGNvbnN0IHJlY29yZCA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBrZXlCeSgnbmFtZScpLFxuICAgIG1hcFZhbHVlcyhnZXRGaWVsZFZhbHVlKSxcbiAgXSk7XG5cbiAgcmVjb3JkLmlkID0gYCR7cmVjb3JkTm9kZS5ub2RlSWR9LSR7Z2VuZXJhdGUoKX1gO1xuICByZWNvcmQua2V5ID0gam9pbktleShjb2xsZWN0aW9uS2V5LCByZWNvcmQuaWQpO1xuICByZWNvcmQuaXNOZXcgPSB0cnVlO1xuICByZWNvcmQudHlwZSA9IHJlY29yZE5vZGUubmFtZTtcbiAgcmV0dXJuIHJlY29yZDtcbn07XG4iLCJpbXBvcnQge1xuICBrZXlCeSwgbWFwVmFsdWVzLCBmaWx0ZXIsIFxuICBtYXAsIGluY2x1ZGVzLCBsYXN0LFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2V0RXhhY3ROb2RlRm9yUGF0aCwgZ2V0Tm9kZSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBzYWZlUGFyc2VGaWVsZCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7XG4gICQsIHNwbGl0S2V5LCBzYWZlS2V5LCBpc05vbkVtcHR5U3RyaW5nLFxuICBhcGlXcmFwcGVyLCBldmVudHMsIGpvaW5LZXksXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBtYXBSZWNvcmQgfSBmcm9tICcuLi9pbmRleGluZy9ldmFsdWF0ZSc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBnZXRSZWNvcmRGaWxlTmFtZSA9IGtleSA9PiBqb2luS2V5KGtleSwgJ3JlY29yZC5qc29uJyk7XG5cbmV4cG9ydCBjb25zdCBsb2FkID0gYXBwID0+IGFzeW5jIGtleSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5yZWNvcmRBcGkubG9hZCxcbiAgcGVybWlzc2lvbi5yZWFkUmVjb3JkLmlzQXV0aG9yaXplZChrZXkpLFxuICB7IGtleSB9LFxuICBfbG9hZCwgYXBwLCBrZXksXG4pO1xuXG5leHBvcnQgY29uc3QgX2xvYWQgPSBhc3luYyAoYXBwLCBrZXksIGtleVN0YWNrID0gW10pID0+IHtcbiAga2V5ID0gc2FmZUtleShrZXkpO1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShrZXkpO1xuICBjb25zdCBzdG9yZWREYXRhID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICBnZXRSZWNvcmRGaWxlTmFtZShrZXkpLFxuICApO1xuXG4gIGNvbnN0IGxvYWRlZFJlY29yZCA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBrZXlCeSgnbmFtZScpLFxuICAgIG1hcFZhbHVlcyhmID0+IHNhZmVQYXJzZUZpZWxkKGYsIHN0b3JlZERhdGEpKSxcbiAgXSk7XG5cbiAgY29uc3QgbmV3S2V5U3RhY2sgPSBbLi4ua2V5U3RhY2ssIGtleV07XG5cbiAgY29uc3QgcmVmZXJlbmNlcyA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBmaWx0ZXIoZiA9PiBmLnR5cGUgPT09ICdyZWZlcmVuY2UnXG4gICAgICAgICAgICAgICAgICAgICYmIGlzTm9uRW1wdHlTdHJpbmcobG9hZGVkUmVjb3JkW2YubmFtZV0ua2V5KVxuICAgICAgICAgICAgICAgICAgICAmJiAhaW5jbHVkZXMobG9hZGVkUmVjb3JkW2YubmFtZV0ua2V5KShuZXdLZXlTdGFjaykpLFxuICAgIG1hcChmID0+ICh7XG4gICAgICBwcm9taXNlOiBfbG9hZChhcHAsIGxvYWRlZFJlY29yZFtmLm5hbWVdLmtleSwgbmV3S2V5U3RhY2spLFxuICAgICAgaW5kZXg6IGdldE5vZGUoYXBwLmhpZXJhcmNoeSwgZi50eXBlT3B0aW9ucy5pbmRleE5vZGVLZXkpLFxuICAgICAgZmllbGQ6IGYsXG4gICAgfSkpLFxuICBdKTtcblxuICBpZiAocmVmZXJlbmNlcy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgcmVmUmVjb3JkcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgbWFwKHAgPT4gcC5wcm9taXNlKShyZWZlcmVuY2VzKSxcbiAgICApO1xuXG4gICAgZm9yIChjb25zdCByZWYgb2YgcmVmZXJlbmNlcykge1xuICAgICAgbG9hZGVkUmVjb3JkW3JlZi5maWVsZC5uYW1lXSA9IG1hcFJlY29yZChcbiAgICAgICAgcmVmUmVjb3Jkc1tyZWZlcmVuY2VzLmluZGV4T2YocmVmKV0sXG4gICAgICAgIHJlZi5pbmRleCxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgbG9hZGVkUmVjb3JkLnRyYW5zYWN0aW9uSWQgPSBzdG9yZWREYXRhLnRyYW5zYWN0aW9uSWQ7XG4gIGxvYWRlZFJlY29yZC5pc05ldyA9IGZhbHNlO1xuICBsb2FkZWRSZWNvcmQua2V5ID0ga2V5O1xuICBsb2FkZWRSZWNvcmQuaWQgPSAkKGtleSwgW3NwbGl0S2V5LCBsYXN0XSk7XG4gIGxvYWRlZFJlY29yZC50eXBlID0gcmVjb3JkTm9kZS5uYW1lO1xuICByZXR1cm4gbG9hZGVkUmVjb3JkO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgbG9hZDtcbiIsIi8vIGFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZGV4NGVyL2pzLXByb21pc2UtcmVhZGFibGVcbi8vIHRoYW5rcyA6KVxuICBcbmV4cG9ydCBjb25zdCBwcm9taXNlUmVhZGFibGVTdHJlYW0gPSBzdHJlYW0gPT4ge1xuICAgXG4gICAgbGV0IF9lcnJvcmVkO1xuXG4gICAgY29uc3QgX2Vycm9ySGFuZGxlciA9IGVyciA9PiB7XG4gICAgICAgIF9lcnJvcmVkID0gZXJyO1xuICAgIH07XG5cbiAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBfZXJyb3JIYW5kbGVyKTtcbiAgXG4gICAgY29uc3QgcmVhZCA9IChzaXplKSA9PiB7XG4gIFxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKF9lcnJvcmVkKSB7XG4gICAgICAgICAgY29uc3QgZXJyID0gX2Vycm9yZWQ7XG4gICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICAgIH1cbiAgXG4gICAgICAgIGlmICghc3RyZWFtLnJlYWRhYmxlIHx8IHN0cmVhbS5jbG9zZWQgfHwgc3RyZWFtLmRlc3Ryb3llZCkge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IHJlYWRhYmxlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICBjb25zdCBjaHVuayA9IHN0cmVhbS5yZWFkKHNpemUpO1xuICBcbiAgICAgICAgICBpZiAoY2h1bmspIHtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVzb2x2ZShjaHVuayk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCBjbG9zZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCBlbmRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgZXJyb3JIYW5kbGVyID0gKGVycikgPT4ge1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCByZW1vdmVMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiY2xvc2VcIiwgY2xvc2VIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVuZFwiLCBlbmRIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJyZWFkYWJsZVwiLCByZWFkYWJsZUhhbmRsZXIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBzdHJlYW0ub24oXCJjbG9zZVwiLCBjbG9zZUhhbmRsZXIpO1xuICAgICAgICBzdHJlYW0ub24oXCJlbmRcIiwgZW5kSGFuZGxlcik7XG4gICAgICAgIHN0cmVhbS5vbihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gICAgICAgIHN0cmVhbS5vbihcInJlYWRhYmxlXCIsIHJlYWRhYmxlSGFuZGxlcik7XG4gIFxuICAgICAgICByZWFkYWJsZUhhbmRsZXIoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgXG4gIFxuICAgIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XG4gICAgICBpZiAoc3RyZWFtKSB7XG4gICAgICAgIGlmIChfZXJyb3JIYW5kbGVyKSB7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgX2Vycm9ySGFuZGxlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBzdHJlYW0uZGVzdHJveSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgc3RyZWFtLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIFxuICAgIHJldHVybiB7cmVhZCwgZGVzdHJveSwgc3RyZWFtfTtcbiAgfVxuICBcbiAgZXhwb3J0IGRlZmF1bHQgcHJvbWlzZVJlYWRhYmxlU3RyZWFtXG4gICIsImltcG9ydCB7IGNvbXBpbGVDb2RlIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xuaW1wb3J0IHtcbiAgZmlsdGVyLCBpbmNsdWRlcywgbWFwLCBsYXN0LFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQsIGlzR2xvYmFsSW5kZXgsXG4gIGdldFBhcmVudEtleSwgaXNTaGFyZGVkSW5kZXgsXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xuICBqb2luS2V5LCBpc05vbkVtcHR5U3RyaW5nLCBzcGxpdEtleSwgJCxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4ZWREYXRhS2V5ID0gKGluZGV4Tm9kZSwgaW5kZXhLZXksIHJlY29yZCkgPT4ge1xuICBjb25zdCBnZXRTaGFyZE5hbWUgPSAoaW5kZXhOb2RlLCByZWNvcmQpID0+IHtcbiAgICBjb25zdCBzaGFyZE5hbWVGdW5jID0gY29tcGlsZUNvZGUoaW5kZXhOb2RlLmdldFNoYXJkTmFtZSk7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBzaGFyZE5hbWVGdW5jKHsgcmVjb3JkIH0pO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgY29uc3QgZXJyb3JEZXRhaWxzID0gYHNoYXJkQ29kZTogJHtpbmRleE5vZGUuZ2V0U2hhcmROYW1lfSA6OiByZWNvcmQ6ICR7SlNPTi5zdHJpbmdpZnkocmVjb3JkKX0gOjogYFxuICAgICAgZS5tZXNzYWdlID0gXCJFcnJvciBydW5uaW5nIGluZGV4IHNoYXJkbmFtZSBmdW5jOiBcIiArIGVycm9yRGV0YWlscyArIGUubWVzc2FnZTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHNoYXJkTmFtZSA9IGlzTm9uRW1wdHlTdHJpbmcoaW5kZXhOb2RlLmdldFNoYXJkTmFtZSlcbiAgICA/IGAke2dldFNoYXJkTmFtZShpbmRleE5vZGUsIHJlY29yZCl9LmNzdmBcbiAgICA6ICdpbmRleC5jc3YnO1xuXG4gIHJldHVybiBqb2luS2V5KGluZGV4S2V5LCBzaGFyZE5hbWUpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFNoYXJkS2V5c0luUmFuZ2UgPSBhc3luYyAoYXBwLCBpbmRleEtleSwgc3RhcnRSZWNvcmQgPSBudWxsLCBlbmRSZWNvcmQgPSBudWxsKSA9PiB7XG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoaW5kZXhLZXkpO1xuXG4gIGNvbnN0IHN0YXJ0U2hhcmROYW1lID0gIXN0YXJ0UmVjb3JkXG4gICAgPyBudWxsXG4gICAgOiBzaGFyZE5hbWVGcm9tS2V5KFxuICAgICAgZ2V0SW5kZXhlZERhdGFLZXkoXG4gICAgICAgIGluZGV4Tm9kZSxcbiAgICAgICAgaW5kZXhLZXksXG4gICAgICAgIHN0YXJ0UmVjb3JkLFxuICAgICAgKSxcbiAgICApO1xuXG4gIGNvbnN0IGVuZFNoYXJkTmFtZSA9ICFlbmRSZWNvcmRcbiAgICA/IG51bGxcbiAgICA6IHNoYXJkTmFtZUZyb21LZXkoXG4gICAgICBnZXRJbmRleGVkRGF0YUtleShcbiAgICAgICAgaW5kZXhOb2RlLFxuICAgICAgICBpbmRleEtleSxcbiAgICAgICAgZW5kUmVjb3JkLFxuICAgICAgKSxcbiAgICApO1xuXG4gIHJldHVybiAkKGF3YWl0IGdldFNoYXJkTWFwKGFwcC5kYXRhc3RvcmUsIGluZGV4S2V5KSwgW1xuICAgIGZpbHRlcihrID0+IChzdGFydFJlY29yZCA9PT0gbnVsbCB8fCBrID49IHN0YXJ0U2hhcmROYW1lKVxuICAgICAgICAgICAgICAgICAgICAmJiAoZW5kUmVjb3JkID09PSBudWxsIHx8IGsgPD0gZW5kU2hhcmROYW1lKSksXG4gICAgbWFwKGsgPT4gam9pbktleShpbmRleEtleSwgYCR7a30uY3N2YCkpLFxuICBdKTtcbn07XG5cbmV4cG9ydCBjb25zdCBlbnN1cmVTaGFyZE5hbWVJc0luU2hhcmRNYXAgPSBhc3luYyAoc3RvcmUsIGluZGV4S2V5LCBpbmRleGVkRGF0YUtleSkgPT4ge1xuICBjb25zdCBtYXAgPSBhd2FpdCBnZXRTaGFyZE1hcChzdG9yZSwgaW5kZXhLZXkpO1xuICBjb25zdCBzaGFyZE5hbWUgPSBzaGFyZE5hbWVGcm9tS2V5KGluZGV4ZWREYXRhS2V5KTtcbiAgaWYgKCFpbmNsdWRlcyhzaGFyZE5hbWUpKG1hcCkpIHtcbiAgICBtYXAucHVzaChzaGFyZE5hbWUpO1xuICAgIGF3YWl0IHdyaXRlU2hhcmRNYXAoc3RvcmUsIGluZGV4S2V5LCBtYXApO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U2hhcmRNYXAgPSBhc3luYyAoZGF0YXN0b3JlLCBpbmRleEtleSkgPT4ge1xuICBjb25zdCBzaGFyZE1hcEtleSA9IGdldFNoYXJkTWFwS2V5KGluZGV4S2V5KTtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgZGF0YXN0b3JlLmxvYWRKc29uKHNoYXJkTWFwS2V5KTtcbiAgfSBjYXRjaCAoXykge1xuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKHNoYXJkTWFwS2V5LCBbXSk7XG4gICAgcmV0dXJuIFtdO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3Qgd3JpdGVTaGFyZE1hcCA9IGFzeW5jIChkYXRhc3RvcmUsIGluZGV4S2V5LCBzaGFyZE1hcCkgPT4gYXdhaXQgZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gIGdldFNoYXJkTWFwS2V5KGluZGV4S2V5KSxcbiAgc2hhcmRNYXAsXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsU2hhcmRLZXlzID0gYXN5bmMgKGFwcCwgaW5kZXhLZXkpID0+IGF3YWl0IGdldFNoYXJkS2V5c0luUmFuZ2UoYXBwLCBpbmRleEtleSk7XG5cbmV4cG9ydCBjb25zdCBnZXRTaGFyZE1hcEtleSA9IGluZGV4S2V5ID0+IGpvaW5LZXkoaW5kZXhLZXksICdzaGFyZE1hcC5qc29uJyk7XG5cbmV4cG9ydCBjb25zdCBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXkgPSBpbmRleEtleSA9PiBqb2luS2V5KGluZGV4S2V5LCAnaW5kZXguY3N2Jyk7XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleEZvbGRlcktleSA9IGluZGV4S2V5ID0+IGluZGV4S2V5O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlSW5kZXhGaWxlID0gYXN5bmMgKGRhdGFzdG9yZSwgaW5kZXhlZERhdGFLZXksIGluZGV4KSA9PiB7XG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleCkpIHtcbiAgICBjb25zdCBpbmRleEtleSA9IGdldFBhcmVudEtleShpbmRleGVkRGF0YUtleSk7XG4gICAgY29uc3Qgc2hhcmRNYXAgPSBhd2FpdCBnZXRTaGFyZE1hcChkYXRhc3RvcmUsIGluZGV4S2V5KTtcbiAgICBzaGFyZE1hcC5wdXNoKFxuICAgICAgc2hhcmROYW1lRnJvbUtleShpbmRleGVkRGF0YUtleSksXG4gICAgKTtcbiAgICBhd2FpdCB3cml0ZVNoYXJkTWFwKGRhdGFzdG9yZSwgaW5kZXhLZXksIHNoYXJkTWFwKTtcbiAgfVxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRmlsZShpbmRleGVkRGF0YUtleSwgJycpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNoYXJkTmFtZUZyb21LZXkgPSBrZXkgPT4gJChrZXksIFtcbiAgc3BsaXRLZXksXG4gIGxhc3QsXG5dKS5yZXBsYWNlKCcuY3N2JywgJycpO1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhLZXlfQmFzZWRPbkRlY2VuZGFudCA9IChkZWNlbmRhbnRLZXksIGluZGV4Tm9kZSkgPT4ge1xuICBpZiAoaXNHbG9iYWxJbmRleChpbmRleE5vZGUpKSB7IHJldHVybiBgJHtpbmRleE5vZGUubm9kZUtleSgpfWA7IH1cblxuICBjb25zdCBpbmRleGVkRGF0YVBhcmVudEtleSA9IGdldEFjdHVhbEtleU9mUGFyZW50KFxuICAgIGluZGV4Tm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksXG4gICAgZGVjZW5kYW50S2V5LFxuICApO1xuXG4gIHJldHVybiBqb2luS2V5KFxuICAgIGluZGV4ZWREYXRhUGFyZW50S2V5LFxuICAgIGluZGV4Tm9kZS5uYW1lLFxuICApO1xufTtcbiIsImltcG9ydCB7XG4gIGhhcywga2V5cywgbWFwLCBvcmRlckJ5LFxuICBmaWx0ZXIsIGNvbmNhdCwgcmV2ZXJzZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IG1hcFJlY29yZCB9IGZyb20gJy4vZXZhbHVhdGUnO1xuaW1wb3J0IHsgY29uc3RydWN0UmVjb3JkIH0gZnJvbSAnLi4vcmVjb3JkQXBpL2dldE5ldyc7XG5pbXBvcnQgeyBnZXRTYW1wbGVGaWVsZFZhbHVlLCBkZXRlY3RUeXBlLCBhbGwgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlU2NoZW1hID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlKSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGVzID0gZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgoaGllcmFyY2h5LCBpbmRleE5vZGUpO1xuICBjb25zdCBtYXBwZWRSZWNvcmRzID0gJChyZWNvcmROb2RlcywgW1xuICAgIG1hcChuID0+IG1hcFJlY29yZChjcmVhdGVTYW1wbGVSZWNvcmQobiksIGluZGV4Tm9kZSkpLFxuICBdKTtcblxuICAvLyBhbHdheXMgaGFzIHJlY29yZCBrZXkgYW5kIHNvcnQga2V5XG4gIGNvbnN0IHNjaGVtYSA9IHtcbiAgICBzb3J0S2V5OiBhbGwuc3RyaW5nLFxuICAgIGtleTogYWxsLnN0cmluZyxcbiAgfTtcblxuICBjb25zdCBmaWVsZHNIYXMgPSBoYXMoc2NoZW1hKTtcbiAgY29uc3Qgc2V0RmllbGQgPSAoZmllbGROYW1lLCB2YWx1ZSkgPT4ge1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgdGhpc1R5cGUgPSBkZXRlY3RUeXBlKHZhbHVlKTtcbiAgICBpZiAoZmllbGRzSGFzKGZpZWxkTmFtZSkpIHtcbiAgICAgIGlmIChzY2hlbWFbZmllbGROYW1lXSAhPT0gdGhpc1R5cGUpIHtcbiAgICAgICAgc2NoZW1hW2ZpZWxkTmFtZV0gPSBhbGwuc3RyaW5nO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzY2hlbWFbZmllbGROYW1lXSA9IHRoaXNUeXBlO1xuICAgIH1cbiAgfTtcblxuICBmb3IgKGNvbnN0IG1hcHBlZFJlYyBvZiBtYXBwZWRSZWNvcmRzKSB7XG4gICAgZm9yIChjb25zdCBmIGluIG1hcHBlZFJlYykge1xuICAgICAgc2V0RmllbGQoZiwgbWFwcGVkUmVjW2ZdKTtcbiAgICB9XG4gIH1cblxuICAvLyByZXR1cmluZyBhbiBhcnJheSBvZiB7bmFtZSwgdHlwZX1cbiAgcmV0dXJuICQoc2NoZW1hLCBbXG4gICAga2V5cyxcbiAgICBtYXAoayA9PiAoeyBuYW1lOiBrLCB0eXBlOiBzY2hlbWFba10ubmFtZSB9KSksXG4gICAgZmlsdGVyKHMgPT4gcy5uYW1lICE9PSAnc29ydEtleScpLFxuICAgIG9yZGVyQnkoJ25hbWUnLCBbJ2Rlc2MnXSksIC8vIHJldmVyc2UgYXBsaGFcbiAgICBjb25jYXQoW3sgbmFtZTogJ3NvcnRLZXknLCB0eXBlOiBhbGwuc3RyaW5nLm5hbWUgfV0pLCAvLyBzb3J0S2V5IG9uIGVuZFxuICAgIHJldmVyc2UsIC8vIHNvcnRLZXkgZmlyc3QsIHRoZW4gcmVzdCBhcmUgYWxwaGFiZXRpY2FsXG4gIF0pO1xufTtcblxuY29uc3QgY3JlYXRlU2FtcGxlUmVjb3JkID0gcmVjb3JkTm9kZSA9PiBjb25zdHJ1Y3RSZWNvcmQoXG4gIHJlY29yZE5vZGUsXG4gIGdldFNhbXBsZUZpZWxkVmFsdWUsXG4gIHJlY29yZE5vZGUucGFyZW50KCkubm9kZUtleSgpLFxuKTtcbiIsImV4cG9ydCBkZWZhdWx0ICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDpcbiAgICAgICAgICAgIHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6XG4gICAgICAgICAgICB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pO1xuIiwiXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxudmFyIGluaXRlZCA9IGZhbHNlO1xuZnVuY3Rpb24gaW5pdCAoKSB7XG4gIGluaXRlZCA9IHRydWU7XG4gIHZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2RlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgbG9va3VwW2ldID0gY29kZVtpXVxuICAgIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxuICB9XG5cbiAgcmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG4gIHJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICBpZiAoIWluaXRlZCkge1xuICAgIGluaXQoKTtcbiAgfVxuICB2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXG4gIGlmIChsZW4gJSA0ID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG4gIH1cblxuICAvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuICAvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG4gIC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuICAvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcbiAgLy8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuICBwbGFjZUhvbGRlcnMgPSBiNjRbbGVuIC0gMl0gPT09ICc9JyA/IDIgOiBiNjRbbGVuIC0gMV0gPT09ICc9JyA/IDEgOiAwXG5cbiAgLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG4gIGFyciA9IG5ldyBBcnIobGVuICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cbiAgLy8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuICBsID0gcGxhY2VIb2xkZXJzID4gMCA/IGxlbiAtIDQgOiBsZW5cblxuICB2YXIgTCA9IDBcblxuICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTgpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDEyKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8IHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMyldXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDE2KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxMCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgNCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDYgJiAweDNGXSArIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG4gICAgb3V0cHV0LnB1c2godHJpcGxldFRvQmFzZTY0KHRtcCkpXG4gIH1cbiAgcmV0dXJuIG91dHB1dC5qb2luKCcnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgaWYgKCFpbml0ZWQpIHtcbiAgICBpbml0KCk7XG4gIH1cbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgb3V0cHV0ID0gJydcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayh1aW50OCwgaSwgKGkgKyBtYXhDaHVua0xlbmd0aCkgPiBsZW4yID8gbGVuMiA6IChpICsgbWF4Q2h1bmtMZW5ndGgpKSlcbiAgfVxuXG4gIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcbiAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcbiAgICB0bXAgPSB1aW50OFtsZW4gLSAxXVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDJdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz09J1xuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyAodWludDhbbGVuIC0gMV0pXG4gICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMTBdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXVxuICAgIG91dHB1dCArPSAnPSdcbiAgfVxuXG4gIHBhcnRzLnB1c2gob3V0cHV0KVxuXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gcmVhZCAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cml0ZSAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5leHBvcnQgZGVmYXVsdCBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cblxuaW1wb3J0ICogYXMgYmFzZTY0IGZyb20gJy4vYmFzZTY0J1xuaW1wb3J0ICogYXMgaWVlZTc1NCBmcm9tICcuL2llZWU3NTQnXG5pbXBvcnQgaXNBcnJheSBmcm9tICcuL2lzQXJyYXknXG5cbmV4cG9ydCB2YXIgSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBEdWUgdG8gdmFyaW91cyBicm93c2VyIGJ1Z3MsIHNvbWV0aW1lcyB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uIHdpbGwgYmUgdXNlZCBldmVuXG4gKiB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHR5cGVkIGFycmF5cy5cbiAqXG4gKiBOb3RlOlxuICpcbiAqICAgLSBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsXG4gKiAgICAgU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzguXG4gKlxuICogICAtIENocm9tZSA5LTEwIGlzIG1pc3NpbmcgdGhlIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24uXG4gKlxuICogICAtIElFMTAgaGFzIGEgYnJva2VuIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhcnJheXMgb2ZcbiAqICAgICBpbmNvcnJlY3QgbGVuZ3RoIGluIHNvbWUgc2l0dWF0aW9ucy5cblxuICogV2UgZGV0ZWN0IHRoZXNlIGJ1Z2d5IGJyb3dzZXJzIGFuZCBzZXQgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYCB0byBgZmFsc2VgIHNvIHRoZXlcbiAqIGdldCB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uLCB3aGljaCBpcyBzbG93ZXIgYnV0IGJlaGF2ZXMgY29ycmVjdGx5LlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUICE9PSB1bmRlZmluZWRcbiAgPyBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVFxuICA6IHRydWVcblxuLypcbiAqIEV4cG9ydCBrTWF4TGVuZ3RoIGFmdGVyIHR5cGVkIGFycmF5IHN1cHBvcnQgaXMgZGV0ZXJtaW5lZC5cbiAqL1xudmFyIF9rTWF4TGVuZ3RoID0ga01heExlbmd0aCgpXG5leHBvcnQge19rTWF4TGVuZ3RoIGFzIGtNYXhMZW5ndGh9O1xuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICByZXR1cm4gdHJ1ZTtcbiAgLy8gcm9sbHVwIGlzc3Vlc1xuICAvLyB0cnkge1xuICAvLyAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAvLyAgIGFyci5fX3Byb3RvX18gPSB7XG4gIC8vICAgICBfX3Byb3RvX186IFVpbnQ4QXJyYXkucHJvdG90eXBlLFxuICAvLyAgICAgZm9vOiBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gIC8vICAgfVxuICAvLyAgIHJldHVybiBhcnIuZm9vKCkgPT09IDQyICYmIC8vIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkXG4gIC8vICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgJiYgLy8gY2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIC8vICAgICAgIGFyci5zdWJhcnJheSgxLCAxKS5ieXRlTGVuZ3RoID09PSAwIC8vIGllMTAgaGFzIGJyb2tlbiBgc3ViYXJyYXlgXG4gIC8vIH0gY2F0Y2ggKGUpIHtcbiAgLy8gICByZXR1cm4gZmFsc2VcbiAgLy8gfVxufVxuXG5mdW5jdGlvbiBrTWF4TGVuZ3RoICgpIHtcbiAgcmV0dXJuIEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gICAgPyAweDdmZmZmZmZmXG4gICAgOiAweDNmZmZmZmZmXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAodGhhdCwgbGVuZ3RoKSB7XG4gIGlmIChrTWF4TGVuZ3RoKCkgPCBsZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCB0eXBlZCBhcnJheSBsZW5ndGgnKVxuICB9XG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoYXQgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIGlmICh0aGF0ID09PSBudWxsKSB7XG4gICAgICB0aGF0ID0gbmV3IEJ1ZmZlcihsZW5ndGgpXG4gICAgfVxuICAgIHRoYXQubGVuZ3RoID0gbGVuZ3RoXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgaGF2ZSB0aGVpclxuICogcHJvdG90eXBlIGNoYW5nZWQgdG8gYEJ1ZmZlci5wcm90b3R5cGVgLiBGdXJ0aGVybW9yZSwgYEJ1ZmZlcmAgaXMgYSBzdWJjbGFzcyBvZlxuICogYFVpbnQ4QXJyYXlgLCBzbyB0aGUgcmV0dXJuZWQgaW5zdGFuY2VzIHdpbGwgaGF2ZSBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgbWV0aG9kc1xuICogYW5kIHRoZSBgVWludDhBcnJheWAgbWV0aG9kcy4gU3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXRcbiAqIHJldHVybnMgYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogVGhlIGBVaW50OEFycmF5YCBwcm90b3R5cGUgcmVtYWlucyB1bm1vZGlmaWVkLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiYgISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIGlmICh0eXBlb2YgZW5jb2RpbmdPck9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0lmIGVuY29kaW5nIGlzIHNwZWNpZmllZCB0aGVuIHRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJ1xuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gYWxsb2NVbnNhZmUodGhpcywgYXJnKVxuICB9XG4gIHJldHVybiBmcm9tKHRoaXMsIGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxuLy8gVE9ETzogTGVnYWN5LCBub3QgbmVlZGVkIGFueW1vcmUuIFJlbW92ZSBpbiBuZXh0IG1ham9yIHZlcnNpb24uXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gZnJvbSAodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBhIG51bWJlcicpXG4gIH1cblxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnJvbVN0cmluZyh0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldClcbiAgfVxuXG4gIHJldHVybiBmcm9tT2JqZWN0KHRoYXQsIHZhbHVlKVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIEJ1ZmZlcihhcmcsIGVuY29kaW5nKSBidXQgdGhyb3dzIGEgVHlwZUVycm9yXG4gKiBpZiB2YWx1ZSBpcyBhIG51bWJlci5cbiAqIEJ1ZmZlci5mcm9tKHN0clssIGVuY29kaW5nXSlcbiAqIEJ1ZmZlci5mcm9tKGFycmF5KVxuICogQnVmZmVyLmZyb20oYnVmZmVyKVxuICogQnVmZmVyLmZyb20oYXJyYXlCdWZmZXJbLCBieXRlT2Zmc2V0WywgbGVuZ3RoXV0pXG4gKiovXG5CdWZmZXIuZnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBmcm9tKG51bGwsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbmlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICBCdWZmZXIucHJvdG90eXBlLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXkucHJvdG90eXBlXG4gIEJ1ZmZlci5fX3Byb3RvX18gPSBVaW50OEFycmF5XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wuc3BlY2llcyAmJlxuICAgICAgQnVmZmVyW1N5bWJvbC5zcGVjaWVzXSA9PT0gQnVmZmVyKSB7XG4gICAgLy8gRml4IHN1YmFycmF5KCkgaW4gRVMyMDE2LiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvOTdcbiAgICAvLyBPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLCBTeW1ib2wuc3BlY2llcywge1xuICAgIC8vICAgdmFsdWU6IG51bGwsXG4gICAgLy8gICBjb25maWd1cmFibGU6IHRydWVcbiAgICAvLyB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydFNpemUgKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9IGVsc2UgaWYgKHNpemUgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG5lZ2F0aXZlJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAodGhhdCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXR0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2MobnVsbCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlICh0aGF0LCBzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgKytpKSB7XG4gICAgICB0aGF0W2ldID0gMFxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gQnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gU2xvd0J1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICovXG5CdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHRoYXQsIHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGlmICghQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJlbmNvZGluZ1wiIG11c3QgYmUgYSB2YWxpZCBzdHJpbmcgZW5jb2RpbmcnKVxuICB9XG5cbiAgdmFyIGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuXG4gIHZhciBhY3R1YWwgPSB0aGF0LndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG5cbiAgaWYgKGFjdHVhbCAhPT0gbGVuZ3RoKSB7XG4gICAgLy8gV3JpdGluZyBhIGhleCBzdHJpbmcsIGZvciBleGFtcGxlLCB0aGF0IGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycyB3aWxsXG4gICAgLy8gY2F1c2UgZXZlcnl0aGluZyBhZnRlciB0aGUgZmlyc3QgaW52YWxpZCBjaGFyYWN0ZXIgdG8gYmUgaWdub3JlZC4gKGUuZy5cbiAgICAvLyAnYWJ4eGNkJyB3aWxsIGJlIHRyZWF0ZWQgYXMgJ2FiJylcbiAgICB0aGF0ID0gdGhhdC5zbGljZSgwLCBhY3R1YWwpXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlMaWtlICh0aGF0LCBhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyICh0aGF0LCBhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gIGFycmF5LmJ5dGVMZW5ndGggLy8gdGhpcyB0aHJvd3MgaWYgYGFycmF5YCBpcyBub3QgYSB2YWxpZCBBcnJheUJ1ZmZlclxuXG4gIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdvZmZzZXRcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgKyAobGVuZ3RoIHx8IDApKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ2xlbmd0aFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChieXRlT2Zmc2V0ID09PSB1bmRlZmluZWQgJiYgbGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5KVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldClcbiAgfSBlbHNlIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gYXJyYXlcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgdGhhdCA9IGZyb21BcnJheUxpa2UodGhhdCwgYXJyYXkpXG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAodGhhdCwgb2JqKSB7XG4gIGlmIChpbnRlcm5hbElzQnVmZmVyKG9iaikpIHtcbiAgICB2YXIgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbilcblxuICAgIGlmICh0aGF0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoYXRcbiAgICB9XG5cbiAgICBvYmouY29weSh0aGF0LCAwLCAwLCBsZW4pXG4gICAgcmV0dXJuIHRoYXRcbiAgfVxuXG4gIGlmIChvYmopIHtcbiAgICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgb2JqLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB8fCAnbGVuZ3RoJyBpbiBvYmopIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ251bWJlcicgfHwgaXNuYW4ob2JqLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCAwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqKVxuICAgIH1cblxuICAgIGlmIChvYmoudHlwZSA9PT0gJ0J1ZmZlcicgJiYgaXNBcnJheShvYmouZGF0YSkpIHtcbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iai5kYXRhKVxuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCBvciBhcnJheS1saWtlIG9iamVjdC4nKVxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwga01heExlbmd0aCgpYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IGtNYXhMZW5ndGgoKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBrTWF4TGVuZ3RoKCkudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNsb3dCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAoK2xlbmd0aCAhPSBsZW5ndGgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbiAgICBsZW5ndGggPSAwXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5hbGxvYygrbGVuZ3RoKVxufVxuQnVmZmVyLmlzQnVmZmVyID0gaXNCdWZmZXI7XG5mdW5jdGlvbiBpbnRlcm5hbElzQnVmZmVyIChiKSB7XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIWludGVybmFsSXNCdWZmZXIoYSkgfHwgIWludGVybmFsSXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgbXVzdCBiZSBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuXG4gIHZhciB4ID0gYS5sZW5ndGhcbiAgdmFyIHkgPSBiLmxlbmd0aFxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldXG4gICAgICB5ID0gYltpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnbGF0aW4xJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIWlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5hbGxvYygwKVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICBsZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYnVmID0gbGlzdFtpXVxuICAgIGlmICghaW50ZXJuYWxJc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoaW50ZXJuYWxJc0J1ZmZlcihzdHJpbmcpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5sZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQXJyYXlCdWZmZXIuaXNWaWV3ID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAoQXJyYXlCdWZmZXIuaXNWaWV3KHN0cmluZykgfHwgc3RyaW5nIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5ieXRlTGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgc3RyaW5nID0gJycgKyBzdHJpbmdcbiAgfVxuXG4gIHZhciBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gbGVuICogMlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGxlbiA+Pj4gMVxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoIC8vIGFzc3VtZSB1dGY4XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIC8vIE5vIG5lZWQgdG8gdmVyaWZ5IHRoYXQgXCJ0aGlzLmxlbmd0aCA8PSBNQVhfVUlOVDMyXCIgc2luY2UgaXQncyBhIHJlYWQtb25seVxuICAvLyBwcm9wZXJ0eSBvZiBhIHR5cGVkIGFycmF5LlxuXG4gIC8vIFRoaXMgYmVoYXZlcyBuZWl0aGVyIGxpa2UgU3RyaW5nIG5vciBVaW50OEFycmF5IGluIHRoYXQgd2Ugc2V0IHN0YXJ0L2VuZFxuICAvLyB0byB0aGVpciB1cHBlci9sb3dlciBib3VuZHMgaWYgdGhlIHZhbHVlIHBhc3NlZCBpcyBvdXQgb2YgcmFuZ2UuXG4gIC8vIHVuZGVmaW5lZCBpcyBoYW5kbGVkIHNwZWNpYWxseSBhcyBwZXIgRUNNQS0yNjIgNnRoIEVkaXRpb24sXG4gIC8vIFNlY3Rpb24gMTMuMy4zLjcgUnVudGltZSBTZW1hbnRpY3M6IEtleWVkQmluZGluZ0luaXRpYWxpemF0aW9uLlxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCB8fCBzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICAvLyBSZXR1cm4gZWFybHkgaWYgc3RhcnQgPiB0aGlzLmxlbmd0aC4gRG9uZSBoZXJlIHRvIHByZXZlbnQgcG90ZW50aWFsIHVpbnQzMlxuICAvLyBjb2VyY2lvbiBmYWlsIGJlbG93LlxuICBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbmQgPD0gMCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgLy8gRm9yY2UgY29lcnNpb24gdG8gdWludDMyLiBUaGlzIHdpbGwgYWxzbyBjb2VyY2UgZmFsc2V5L05hTiB2YWx1ZXMgdG8gMC5cbiAgZW5kID4+Pj0gMFxuICBzdGFydCA+Pj49IDBcblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gVGhlIHByb3BlcnR5IGlzIHVzZWQgYnkgYEJ1ZmZlci5pc0J1ZmZlcmAgYW5kIGBpcy1idWZmZXJgIChpbiBTYWZhcmkgNS03KSB0byBkZXRlY3Rcbi8vIEJ1ZmZlciBpbnN0YW5jZXMuXG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuZnVuY3Rpb24gc3dhcCAoYiwgbiwgbSkge1xuICB2YXIgaSA9IGJbbl1cbiAgYltuXSA9IGJbbV1cbiAgYlttXSA9IGlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMTYgPSBmdW5jdGlvbiBzd2FwMTYgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDIgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDE2LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAxKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDMyID0gZnVuY3Rpb24gc3dhcDMyICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAzMi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgMilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXA2NCA9IGZ1bmN0aW9uIHN3YXA2NCAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgOCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNjQtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gOCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDcpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDYpXG4gICAgc3dhcCh0aGlzLCBpICsgMiwgaSArIDUpXG4gICAgc3dhcCh0aGlzLCBpICsgMywgaSArIDQpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoIHwgMFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgaWYgKHRoaXMgPT09IGIpIHJldHVybiB0cnVlXG4gIHJldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLCBiKSA9PT0gMFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgdmFyIHN0ciA9ICcnXG4gIHZhciBtYXggPSBJTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgfVxuXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5kID0gdGFyZ2V0ID8gdGFyZ2V0Lmxlbmd0aCA6IDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzU3RhcnQgPSAwXG4gIH1cbiAgaWYgKHRoaXNFbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNFbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBlbmQgPiB0YXJnZXQubGVuZ3RoIHx8IHRoaXNTdGFydCA8IDAgfHwgdGhpc0VuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ291dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQgJiYgc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIHN0YXJ0ID4+Pj0gMFxuICBlbmQgPj4+PSAwXG4gIHRoaXNTdGFydCA+Pj49IDBcbiAgdGhpc0VuZCA+Pj49IDBcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0KSByZXR1cm4gMFxuXG4gIHZhciB4ID0gdGhpc0VuZCAtIHRoaXNTdGFydFxuICB2YXIgeSA9IGVuZCAtIHN0YXJ0XG4gIHZhciBsZW4gPSBNYXRoLm1pbih4LCB5KVxuXG4gIHZhciB0aGlzQ29weSA9IHRoaXMuc2xpY2UodGhpc1N0YXJ0LCB0aGlzRW5kKVxuICB2YXIgdGFyZ2V0Q29weSA9IHRhcmdldC5zbGljZShzdGFydCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAodGhpc0NvcHlbaV0gIT09IHRhcmdldENvcHlbaV0pIHtcbiAgICAgIHggPSB0aGlzQ29weVtpXVxuICAgICAgeSA9IHRhcmdldENvcHlbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG4vLyBGaW5kcyBlaXRoZXIgdGhlIGZpcnN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA+PSBgYnl0ZU9mZnNldGAsXG4vLyBPUiB0aGUgbGFzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPD0gYGJ5dGVPZmZzZXRgLlxuLy9cbi8vIEFyZ3VtZW50czpcbi8vIC0gYnVmZmVyIC0gYSBCdWZmZXIgdG8gc2VhcmNoXG4vLyAtIHZhbCAtIGEgc3RyaW5nLCBCdWZmZXIsIG9yIG51bWJlclxuLy8gLSBieXRlT2Zmc2V0IC0gYW4gaW5kZXggaW50byBgYnVmZmVyYDsgd2lsbCBiZSBjbGFtcGVkIHRvIGFuIGludDMyXG4vLyAtIGVuY29kaW5nIC0gYW4gb3B0aW9uYWwgZW5jb2RpbmcsIHJlbGV2YW50IGlzIHZhbCBpcyBhIHN0cmluZ1xuLy8gLSBkaXIgLSB0cnVlIGZvciBpbmRleE9mLCBmYWxzZSBmb3IgbGFzdEluZGV4T2ZcbmZ1bmN0aW9uIGJpZGlyZWN0aW9uYWxJbmRleE9mIChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICAvLyBFbXB0eSBidWZmZXIgbWVhbnMgbm8gbWF0Y2hcbiAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHJldHVybiAtMVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0XG4gIGlmICh0eXBlb2YgYnl0ZU9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IGJ5dGVPZmZzZXRcbiAgICBieXRlT2Zmc2V0ID0gMFxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPiAweDdmZmZmZmZmKSB7XG4gICAgYnl0ZU9mZnNldCA9IDB4N2ZmZmZmZmZcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgLTB4ODAwMDAwMDApIHtcbiAgICBieXRlT2Zmc2V0ID0gLTB4ODAwMDAwMDBcbiAgfVxuICBieXRlT2Zmc2V0ID0gK2J5dGVPZmZzZXQgIC8vIENvZXJjZSB0byBOdW1iZXIuXG4gIGlmIChpc05hTihieXRlT2Zmc2V0KSkge1xuICAgIC8vIGJ5dGVPZmZzZXQ6IGl0IGl0J3MgdW5kZWZpbmVkLCBudWxsLCBOYU4sIFwiZm9vXCIsIGV0Yywgc2VhcmNoIHdob2xlIGJ1ZmZlclxuICAgIGJ5dGVPZmZzZXQgPSBkaXIgPyAwIDogKGJ1ZmZlci5sZW5ndGggLSAxKVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXQ6IG5lZ2F0aXZlIG9mZnNldHMgc3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBidWZmZXJcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwKSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCArIGJ5dGVPZmZzZXRcbiAgaWYgKGJ5dGVPZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkge1xuICAgIGlmIChkaXIpIHJldHVybiAtMVxuICAgIGVsc2UgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggLSAxXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IDApIHtcbiAgICBpZiAoZGlyKSBieXRlT2Zmc2V0ID0gMFxuICAgIGVsc2UgcmV0dXJuIC0xXG4gIH1cblxuICAvLyBOb3JtYWxpemUgdmFsXG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIHZhbCA9IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gIH1cblxuICAvLyBGaW5hbGx5LCBzZWFyY2ggZWl0aGVyIGluZGV4T2YgKGlmIGRpciBpcyB0cnVlKSBvciBsYXN0SW5kZXhPZlxuICBpZiAoaW50ZXJuYWxJc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDB4RkYgLy8gU2VhcmNoIGZvciBhIGJ5dGUgdmFsdWUgWzAtMjU1XVxuICAgIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJlxuICAgICAgICB0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGRpcikge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCBbIHZhbCBdLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyJylcbn1cblxuZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICB2YXIgaW5kZXhTaXplID0gMVxuICB2YXIgYXJyTGVuZ3RoID0gYXJyLmxlbmd0aFxuICB2YXIgdmFsTGVuZ3RoID0gdmFsLmxlbmd0aFxuXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZW5jb2RpbmcgPT09ICd1Y3MyJyB8fCBlbmNvZGluZyA9PT0gJ3Vjcy0yJyB8fFxuICAgICAgICBlbmNvZGluZyA9PT0gJ3V0ZjE2bGUnIHx8IGVuY29kaW5nID09PSAndXRmLTE2bGUnKSB7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA8IDIgfHwgdmFsLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpbmRleFNpemUgPSAyXG4gICAgICBhcnJMZW5ndGggLz0gMlxuICAgICAgdmFsTGVuZ3RoIC89IDJcbiAgICAgIGJ5dGVPZmZzZXQgLz0gMlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGJ1ZiwgaSkge1xuICAgIGlmIChpbmRleFNpemUgPT09IDEpIHtcbiAgICAgIHJldHVybiBidWZbaV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ1Zi5yZWFkVUludDE2QkUoaSAqIGluZGV4U2l6ZSlcbiAgICB9XG4gIH1cblxuICB2YXIgaVxuICBpZiAoZGlyKSB7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPCBhcnJMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlYWQoYXJyLCBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIGZvdW5kSW5kZXggPSBpXG4gICAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbExlbmd0aCkgcmV0dXJuIGZvdW5kSW5kZXggKiBpbmRleFNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ICE9PSAtMSkgaSAtPSBpIC0gZm91bmRJbmRleFxuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGJ5dGVPZmZzZXQgKyB2YWxMZW5ndGggPiBhcnJMZW5ndGgpIGJ5dGVPZmZzZXQgPSBhcnJMZW5ndGggLSB2YWxMZW5ndGhcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGZvdW5kID0gdHJ1ZVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWxMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAocmVhZChhcnIsIGkgKyBqKSAhPT0gcmVhZCh2YWwsIGopKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuIGlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiB0aGlzLmluZGV4T2YodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykgIT09IC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIHRydWUpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZmFsc2UpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKHN0ckxlbiAlIDIgIT09IDApIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKGlzTmFOKHBhcnNlZCkpIHJldHVybiBpXG4gICAgYnVmW29mZnNldCArIGldID0gcGFyc2VkXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBsYXRpbjFXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBhc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHVjczJXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZylcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBvZmZzZXRbLCBsZW5ndGhdWywgZW5jb2RpbmddKVxuICB9IGVsc2UgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCB8IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICAvLyBsZWdhY3kgd3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpIC0gcmVtb3ZlIGluIHYwLjEzXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1ZmZlci53cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXRbLCBsZW5ndGhdKSBpcyBubyBsb25nZXIgc3VwcG9ydGVkJ1xuICAgIClcbiAgfVxuXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbGVuZ3RoID4gcmVtYWluaW5nKSBsZW5ndGggPSByZW1haW5pbmdcblxuICBpZiAoKHN0cmluZy5sZW5ndGggPiAwICYmIChsZW5ndGggPCAwIHx8IG9mZnNldCA8IDApKSB8fCBvZmZzZXQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIHdyaXRlIG91dHNpZGUgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIC8vIFdhcm5pbmc6IG1heExlbmd0aCBub3QgdGFrZW4gaW50byBhY2NvdW50IGluIGJhc2U2NFdyaXRlXG4gICAgICAgIHJldHVybiBiYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdWNzMldyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHV0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcbiAgdmFyIHJlcyA9IFtdXG5cbiAgdmFyIGkgPSBzdGFydFxuICB3aGlsZSAoaSA8IGVuZCkge1xuICAgIHZhciBmaXJzdEJ5dGUgPSBidWZbaV1cbiAgICB2YXIgY29kZVBvaW50ID0gbnVsbFxuICAgIHZhciBieXRlc1BlclNlcXVlbmNlID0gKGZpcnN0Qnl0ZSA+IDB4RUYpID8gNFxuICAgICAgOiAoZmlyc3RCeXRlID4gMHhERikgPyAzXG4gICAgICA6IChmaXJzdEJ5dGUgPiAweEJGKSA/IDJcbiAgICAgIDogMVxuXG4gICAgaWYgKGkgKyBieXRlc1BlclNlcXVlbmNlIDw9IGVuZCkge1xuICAgICAgdmFyIHNlY29uZEJ5dGUsIHRoaXJkQnl0ZSwgZm91cnRoQnl0ZSwgdGVtcENvZGVQb2ludFxuXG4gICAgICBzd2l0Y2ggKGJ5dGVzUGVyU2VxdWVuY2UpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmIChmaXJzdEJ5dGUgPCAweDgwKSB7XG4gICAgICAgICAgICBjb2RlUG9pbnQgPSBmaXJzdEJ5dGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHgxRikgPDwgMHg2IHwgKHNlY29uZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4QyB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKHRoaXJkQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0ZGICYmICh0ZW1wQ29kZVBvaW50IDwgMHhEODAwIHx8IHRlbXBDb2RlUG9pbnQgPiAweERGRkYpKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGZvdXJ0aEJ5dGUgPSBidWZbaSArIDNdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwICYmIChmb3VydGhCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweDEyIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweEMgfCAodGhpcmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKGZvdXJ0aEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweEZGRkYgJiYgdGVtcENvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGVQb2ludCA9PT0gbnVsbCkge1xuICAgICAgLy8gd2UgZGlkIG5vdCBnZW5lcmF0ZSBhIHZhbGlkIGNvZGVQb2ludCBzbyBpbnNlcnQgYVxuICAgICAgLy8gcmVwbGFjZW1lbnQgY2hhciAoVStGRkZEKSBhbmQgYWR2YW5jZSBvbmx5IDEgYnl0ZVxuICAgICAgY29kZVBvaW50ID0gMHhGRkZEXG4gICAgICBieXRlc1BlclNlcXVlbmNlID0gMVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50ID4gMHhGRkZGKSB7XG4gICAgICAvLyBlbmNvZGUgdG8gdXRmMTYgKHN1cnJvZ2F0ZSBwYWlyIGRhbmNlKVxuICAgICAgY29kZVBvaW50IC09IDB4MTAwMDBcbiAgICAgIHJlcy5wdXNoKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMClcbiAgICAgIGNvZGVQb2ludCA9IDB4REMwMCB8IGNvZGVQb2ludCAmIDB4M0ZGXG4gICAgfVxuXG4gICAgcmVzLnB1c2goY29kZVBvaW50KVxuICAgIGkgKz0gYnl0ZXNQZXJTZXF1ZW5jZVxuICB9XG5cbiAgcmV0dXJuIGRlY29kZUNvZGVQb2ludHNBcnJheShyZXMpXG59XG5cbi8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIyNzQ3MjcyLzY4MDc0MiwgdGhlIGJyb3dzZXIgd2l0aFxuLy8gdGhlIGxvd2VzdCBsaW1pdCBpcyBDaHJvbWUsIHdpdGggMHgxMDAwMCBhcmdzLlxuLy8gV2UgZ28gMSBtYWduaXR1ZGUgbGVzcywgZm9yIHNhZmV0eVxudmFyIE1BWF9BUkdVTUVOVFNfTEVOR1RIID0gMHgxMDAwXG5cbmZ1bmN0aW9uIGRlY29kZUNvZGVQb2ludHNBcnJheSAoY29kZVBvaW50cykge1xuICB2YXIgbGVuID0gY29kZVBvaW50cy5sZW5ndGhcbiAgaWYgKGxlbiA8PSBNQVhfQVJHVU1FTlRTX0xFTkdUSCkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY29kZVBvaW50cykgLy8gYXZvaWQgZXh0cmEgc2xpY2UoKVxuICB9XG5cbiAgLy8gRGVjb2RlIGluIGNodW5rcyB0byBhdm9pZCBcImNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZFwiLlxuICB2YXIgcmVzID0gJydcbiAgdmFyIGkgPSAwXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXG4gICAgICBTdHJpbmcsXG4gICAgICBjb2RlUG9pbnRzLnNsaWNlKGksIGkgKz0gTUFYX0FSR1VNRU5UU19MRU5HVEgpXG4gICAgKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0gJiAweDdGKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gbGF0aW4xU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiB1dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2kgKyAxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICB2YXIgbmV3QnVmXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIG5ld0J1ZiA9IHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZClcbiAgICBuZXdCdWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47ICsraSkge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ld0J1ZlxufVxuXG4vKlxuICogTmVlZCB0byBtYWtlIHN1cmUgdGhhdCBidWZmZXIgaXNuJ3QgdHJ5aW5nIHRvIHdyaXRlIG91dCBvZiBib3VuZHMuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT2Zmc2V0IChvZmZzZXQsIGV4dCwgbGVuZ3RoKSB7XG4gIGlmICgob2Zmc2V0ICUgMSkgIT09IDAgfHwgb2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ29mZnNldCBpcyBub3QgdWludCcpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBsZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdUcnlpbmcgdG8gYWNjZXNzIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludExFID0gZnVuY3Rpb24gcmVhZFVJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcbiAgfVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF1cbiAgdmFyIG11bCA9IDFcbiAgd2hpbGUgKGJ5dGVMZW5ndGggPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIHJlYWRVSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCA4KSB8IHRoaXNbb2Zmc2V0ICsgMV1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiByZWFkVUludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKCh0aGlzW29mZnNldF0pIHxcbiAgICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSkgK1xuICAgICAgKHRoaXNbb2Zmc2V0ICsgM10gKiAweDEwMDAwMDApXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50QkUgPSBmdW5jdGlvbiByZWFkSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGhcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1pXVxuICB3aGlsZSAoaSA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIHJlYWRJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gcmVhZEludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgMV0gfCAodGhpc1tvZmZzZXRdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgMjQpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdExFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdEJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiByZWFkRG91YmxlQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCA1MiwgOClcbn1cblxuZnVuY3Rpb24gY2hlY2tJbnQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAoIWludGVybmFsSXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZmZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHhmZiwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCAyKTsgaSA8IGo7ICsraSkge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgNCk7IGkgPCBqOyArK2kpIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gMFxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgLSAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgKyAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgOCwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICh0YXJnZXQsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXRTdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB0YXJnZXRTdGFydCA9IHRhcmdldC5sZW5ndGhcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwXG4gIGlmIChlbmQgPiAwICYmIGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDBcbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgdGhpcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAodGFyZ2V0U3RhcnQgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgaWYgKGVuZCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgKyBzdGFydFxuICB9XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG4gIHZhciBpXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yIChpID0gbGVuIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2UgaWYgKGxlbiA8IDEwMDAgfHwgIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gYXNjZW5kaW5nIGNvcHkgZnJvbSBzdGFydFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoY29kZSA8IDI1Nikge1xuICAgICAgICB2YWwgPSBjb2RlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMjU1XG4gIH1cblxuICAvLyBJbnZhbGlkIHJhbmdlcyBhcmUgbm90IHNldCB0byBhIGRlZmF1bHQsIHNvIGNhbiByYW5nZSBjaGVjayBlYXJseS5cbiAgaWYgKHN0YXJ0IDwgMCB8fCB0aGlzLmxlbmd0aCA8IHN0YXJ0IHx8IHRoaXMubGVuZ3RoIDwgZW5kKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ091dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgPj4+IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyB0aGlzLmxlbmd0aCA6IGVuZCA+Pj4gMFxuXG4gIGlmICghdmFsKSB2YWwgPSAwXG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgdGhpc1tpXSA9IHZhbFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYnl0ZXMgPSBpbnRlcm5hbElzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IHV0ZjhUb0J5dGVzKG5ldyBCdWZmZXIodmFsLCBlbmNvZGluZykudG9TdHJpbmcoKSlcbiAgICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rXFwvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyaW5ndHJpbShzdHIpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICB2YXIgY29kZVBvaW50XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICB2YXIgYnl0ZXMgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuXG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBpc25hbiAodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IHZhbCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuXG5cbi8vIHRoZSBmb2xsb3dpbmcgaXMgZnJvbSBpcy1idWZmZXIsIGFsc28gYnkgRmVyb3NzIEFib3VraGFkaWplaCBhbmQgd2l0aCBzYW1lIGxpc2VuY2Vcbi8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcbi8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcbmV4cG9ydCBmdW5jdGlvbiBpc0J1ZmZlcihvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmICghIW9iai5faXNCdWZmZXIgfHwgaXNGYXN0QnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikpXG59XG5cbmZ1bmN0aW9uIGlzRmFzdEJ1ZmZlciAob2JqKSB7XG4gIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG5cbi8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5mdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzRmFzdEJ1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtCdWZmZXJ9IGZyb20gJ2J1ZmZlcic7XG52YXIgaXNCdWZmZXJFbmNvZGluZyA9IEJ1ZmZlci5pc0VuY29kaW5nXG4gIHx8IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gICAgICAgc3dpdGNoIChlbmNvZGluZyAmJiBlbmNvZGluZy50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICBjYXNlICdoZXgnOiBjYXNlICd1dGY4JzogY2FzZSAndXRmLTgnOiBjYXNlICdhc2NpaSc6IGNhc2UgJ2JpbmFyeSc6IGNhc2UgJ2Jhc2U2NCc6IGNhc2UgJ3VjczInOiBjYXNlICd1Y3MtMic6IGNhc2UgJ3V0ZjE2bGUnOiBjYXNlICd1dGYtMTZsZSc6IGNhc2UgJ3Jhdyc6IHJldHVybiB0cnVlO1xuICAgICAgICAgZGVmYXVsdDogcmV0dXJuIGZhbHNlO1xuICAgICAgIH1cbiAgICAgfVxuXG5cbmZ1bmN0aW9uIGFzc2VydEVuY29kaW5nKGVuY29kaW5nKSB7XG4gIGlmIChlbmNvZGluZyAmJiAhaXNCdWZmZXJFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZyk7XG4gIH1cbn1cblxuLy8gU3RyaW5nRGVjb2RlciBwcm92aWRlcyBhbiBpbnRlcmZhY2UgZm9yIGVmZmljaWVudGx5IHNwbGl0dGluZyBhIHNlcmllcyBvZlxuLy8gYnVmZmVycyBpbnRvIGEgc2VyaWVzIG9mIEpTIHN0cmluZ3Mgd2l0aG91dCBicmVha2luZyBhcGFydCBtdWx0aS1ieXRlXG4vLyBjaGFyYWN0ZXJzLiBDRVNVLTggaXMgaGFuZGxlZCBhcyBwYXJ0IG9mIHRoZSBVVEYtOCBlbmNvZGluZy5cbi8vXG4vLyBAVE9ETyBIYW5kbGluZyBhbGwgZW5jb2RpbmdzIGluc2lkZSBhIHNpbmdsZSBvYmplY3QgbWFrZXMgaXQgdmVyeSBkaWZmaWN1bHRcbi8vIHRvIHJlYXNvbiBhYm91dCB0aGlzIGNvZGUsIHNvIGl0IHNob3VsZCBiZSBzcGxpdCB1cCBpbiB0aGUgZnV0dXJlLlxuLy8gQFRPRE8gVGhlcmUgc2hvdWxkIGJlIGEgdXRmOC1zdHJpY3QgZW5jb2RpbmcgdGhhdCByZWplY3RzIGludmFsaWQgVVRGLTggY29kZVxuLy8gcG9pbnRzIGFzIHVzZWQgYnkgQ0VTVS04LlxuZXhwb3J0IGZ1bmN0aW9uIFN0cmluZ0RlY29kZXIoZW5jb2RpbmcpIHtcbiAgdGhpcy5lbmNvZGluZyA9IChlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvWy1fXS8sICcnKTtcbiAgYXNzZXJ0RW5jb2RpbmcoZW5jb2RpbmcpO1xuICBzd2l0Y2ggKHRoaXMuZW5jb2RpbmcpIHtcbiAgICBjYXNlICd1dGY4JzpcbiAgICAgIC8vIENFU1UtOCByZXByZXNlbnRzIGVhY2ggb2YgU3Vycm9nYXRlIFBhaXIgYnkgMy1ieXRlc1xuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgLy8gVVRGLTE2IHJlcHJlc2VudHMgZWFjaCBvZiBTdXJyb2dhdGUgUGFpciBieSAyLWJ5dGVzXG4gICAgICB0aGlzLnN1cnJvZ2F0ZVNpemUgPSAyO1xuICAgICAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhciA9IHV0ZjE2RGV0ZWN0SW5jb21wbGV0ZUNoYXI7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgLy8gQmFzZS02NCBzdG9yZXMgMyBieXRlcyBpbiA0IGNoYXJzLCBhbmQgcGFkcyB0aGUgcmVtYWluZGVyLlxuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMztcbiAgICAgIHRoaXMuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSBiYXNlNjREZXRlY3RJbmNvbXBsZXRlQ2hhcjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aGlzLndyaXRlID0gcGFzc1Rocm91Z2hXcml0ZTtcbiAgICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEVub3VnaCBzcGFjZSB0byBzdG9yZSBhbGwgYnl0ZXMgb2YgYSBzaW5nbGUgY2hhcmFjdGVyLiBVVEYtOCBuZWVkcyA0XG4gIC8vIGJ5dGVzLCBidXQgQ0VTVS04IG1heSByZXF1aXJlIHVwIHRvIDYgKDMgYnl0ZXMgcGVyIHN1cnJvZ2F0ZSkuXG4gIHRoaXMuY2hhckJ1ZmZlciA9IG5ldyBCdWZmZXIoNik7XG4gIC8vIE51bWJlciBvZiBieXRlcyByZWNlaXZlZCBmb3IgdGhlIGN1cnJlbnQgaW5jb21wbGV0ZSBtdWx0aS1ieXRlIGNoYXJhY3Rlci5cbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSAwO1xuICAvLyBOdW1iZXIgb2YgYnl0ZXMgZXhwZWN0ZWQgZm9yIHRoZSBjdXJyZW50IGluY29tcGxldGUgbXVsdGktYnl0ZSBjaGFyYWN0ZXIuXG4gIHRoaXMuY2hhckxlbmd0aCA9IDA7XG59O1xuXG5cbi8vIHdyaXRlIGRlY29kZXMgdGhlIGdpdmVuIGJ1ZmZlciBhbmQgcmV0dXJucyBpdCBhcyBKUyBzdHJpbmcgdGhhdCBpc1xuLy8gZ3VhcmFudGVlZCB0byBub3QgY29udGFpbiBhbnkgcGFydGlhbCBtdWx0aS1ieXRlIGNoYXJhY3RlcnMuIEFueSBwYXJ0aWFsXG4vLyBjaGFyYWN0ZXIgZm91bmQgYXQgdGhlIGVuZCBvZiB0aGUgYnVmZmVyIGlzIGJ1ZmZlcmVkIHVwLCBhbmQgd2lsbCBiZVxuLy8gcmV0dXJuZWQgd2hlbiBjYWxsaW5nIHdyaXRlIGFnYWluIHdpdGggdGhlIHJlbWFpbmluZyBieXRlcy5cbi8vXG4vLyBOb3RlOiBDb252ZXJ0aW5nIGEgQnVmZmVyIGNvbnRhaW5pbmcgYW4gb3JwaGFuIHN1cnJvZ2F0ZSB0byBhIFN0cmluZ1xuLy8gY3VycmVudGx5IHdvcmtzLCBidXQgY29udmVydGluZyBhIFN0cmluZyB0byBhIEJ1ZmZlciAodmlhIGBuZXcgQnVmZmVyYCwgb3Jcbi8vIEJ1ZmZlciN3cml0ZSkgd2lsbCByZXBsYWNlIGluY29tcGxldGUgc3Vycm9nYXRlcyB3aXRoIHRoZSB1bmljb2RlXG4vLyByZXBsYWNlbWVudCBjaGFyYWN0ZXIuIFNlZSBodHRwczovL2NvZGVyZXZpZXcuY2hyb21pdW0ub3JnLzEyMTE3MzAwOS8gLlxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgdmFyIGNoYXJTdHIgPSAnJztcbiAgLy8gaWYgb3VyIGxhc3Qgd3JpdGUgZW5kZWQgd2l0aCBhbiBpbmNvbXBsZXRlIG11bHRpYnl0ZSBjaGFyYWN0ZXJcbiAgd2hpbGUgKHRoaXMuY2hhckxlbmd0aCkge1xuICAgIC8vIGRldGVybWluZSBob3cgbWFueSByZW1haW5pbmcgYnl0ZXMgdGhpcyBidWZmZXIgaGFzIHRvIG9mZmVyIGZvciB0aGlzIGNoYXJcbiAgICB2YXIgYXZhaWxhYmxlID0gKGJ1ZmZlci5sZW5ndGggPj0gdGhpcy5jaGFyTGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQpID9cbiAgICAgICAgdGhpcy5jaGFyTGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQgOlxuICAgICAgICBidWZmZXIubGVuZ3RoO1xuXG4gICAgLy8gYWRkIHRoZSBuZXcgYnl0ZXMgdG8gdGhlIGNoYXIgYnVmZmVyXG4gICAgYnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCB0aGlzLmNoYXJSZWNlaXZlZCwgMCwgYXZhaWxhYmxlKTtcbiAgICB0aGlzLmNoYXJSZWNlaXZlZCArPSBhdmFpbGFibGU7XG5cbiAgICBpZiAodGhpcy5jaGFyUmVjZWl2ZWQgPCB0aGlzLmNoYXJMZW5ndGgpIHtcbiAgICAgIC8vIHN0aWxsIG5vdCBlbm91Z2ggY2hhcnMgaW4gdGhpcyBidWZmZXI/IHdhaXQgZm9yIG1vcmUgLi4uXG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIGJ5dGVzIGJlbG9uZ2luZyB0byB0aGUgY3VycmVudCBjaGFyYWN0ZXIgZnJvbSB0aGUgYnVmZmVyXG4gICAgYnVmZmVyID0gYnVmZmVyLnNsaWNlKGF2YWlsYWJsZSwgYnVmZmVyLmxlbmd0aCk7XG5cbiAgICAvLyBnZXQgdGhlIGNoYXJhY3RlciB0aGF0IHdhcyBzcGxpdFxuICAgIGNoYXJTdHIgPSB0aGlzLmNoYXJCdWZmZXIuc2xpY2UoMCwgdGhpcy5jaGFyTGVuZ3RoKS50b1N0cmluZyh0aGlzLmVuY29kaW5nKTtcblxuICAgIC8vIENFU1UtODogbGVhZCBzdXJyb2dhdGUgKEQ4MDAtREJGRikgaXMgYWxzbyB0aGUgaW5jb21wbGV0ZSBjaGFyYWN0ZXJcbiAgICB2YXIgY2hhckNvZGUgPSBjaGFyU3RyLmNoYXJDb2RlQXQoY2hhclN0ci5sZW5ndGggLSAxKTtcbiAgICBpZiAoY2hhckNvZGUgPj0gMHhEODAwICYmIGNoYXJDb2RlIDw9IDB4REJGRikge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoICs9IHRoaXMuc3Vycm9nYXRlU2l6ZTtcbiAgICAgIGNoYXJTdHIgPSAnJztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICB0aGlzLmNoYXJSZWNlaXZlZCA9IHRoaXMuY2hhckxlbmd0aCA9IDA7XG5cbiAgICAvLyBpZiB0aGVyZSBhcmUgbm8gbW9yZSBieXRlcyBpbiB0aGlzIGJ1ZmZlciwganVzdCBlbWl0IG91ciBjaGFyXG4gICAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjaGFyU3RyO1xuICAgIH1cbiAgICBicmVhaztcbiAgfVxuXG4gIC8vIGRldGVybWluZSBhbmQgc2V0IGNoYXJMZW5ndGggLyBjaGFyUmVjZWl2ZWRcbiAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpO1xuXG4gIHZhciBlbmQgPSBidWZmZXIubGVuZ3RoO1xuICBpZiAodGhpcy5jaGFyTGVuZ3RoKSB7XG4gICAgLy8gYnVmZmVyIHRoZSBpbmNvbXBsZXRlIGNoYXJhY3RlciBieXRlcyB3ZSBnb3RcbiAgICBidWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIDAsIGJ1ZmZlci5sZW5ndGggLSB0aGlzLmNoYXJSZWNlaXZlZCwgZW5kKTtcbiAgICBlbmQgLT0gdGhpcy5jaGFyUmVjZWl2ZWQ7XG4gIH1cblxuICBjaGFyU3RyICs9IGJ1ZmZlci50b1N0cmluZyh0aGlzLmVuY29kaW5nLCAwLCBlbmQpO1xuXG4gIHZhciBlbmQgPSBjaGFyU3RyLmxlbmd0aCAtIDE7XG4gIHZhciBjaGFyQ29kZSA9IGNoYXJTdHIuY2hhckNvZGVBdChlbmQpO1xuICAvLyBDRVNVLTg6IGxlYWQgc3Vycm9nYXRlIChEODAwLURCRkYpIGlzIGFsc28gdGhlIGluY29tcGxldGUgY2hhcmFjdGVyXG4gIGlmIChjaGFyQ29kZSA+PSAweEQ4MDAgJiYgY2hhckNvZGUgPD0gMHhEQkZGKSB7XG4gICAgdmFyIHNpemUgPSB0aGlzLnN1cnJvZ2F0ZVNpemU7XG4gICAgdGhpcy5jaGFyTGVuZ3RoICs9IHNpemU7XG4gICAgdGhpcy5jaGFyUmVjZWl2ZWQgKz0gc2l6ZTtcbiAgICB0aGlzLmNoYXJCdWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIHNpemUsIDAsIHNpemUpO1xuICAgIGJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgMCwgMCwgc2l6ZSk7XG4gICAgcmV0dXJuIGNoYXJTdHIuc3Vic3RyaW5nKDAsIGVuZCk7XG4gIH1cblxuICAvLyBvciBqdXN0IGVtaXQgdGhlIGNoYXJTdHJcbiAgcmV0dXJuIGNoYXJTdHI7XG59O1xuXG4vLyBkZXRlY3RJbmNvbXBsZXRlQ2hhciBkZXRlcm1pbmVzIGlmIHRoZXJlIGlzIGFuIGluY29tcGxldGUgVVRGLTggY2hhcmFjdGVyIGF0XG4vLyB0aGUgZW5kIG9mIHRoZSBnaXZlbiBidWZmZXIuIElmIHNvLCBpdCBzZXRzIHRoaXMuY2hhckxlbmd0aCB0byB0aGUgYnl0ZVxuLy8gbGVuZ3RoIHRoYXQgY2hhcmFjdGVyLCBhbmQgc2V0cyB0aGlzLmNoYXJSZWNlaXZlZCB0byB0aGUgbnVtYmVyIG9mIGJ5dGVzXG4vLyB0aGF0IGFyZSBhdmFpbGFibGUgZm9yIHRoaXMgY2hhcmFjdGVyLlxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgLy8gZGV0ZXJtaW5lIGhvdyBtYW55IGJ5dGVzIHdlIGhhdmUgdG8gY2hlY2sgYXQgdGhlIGVuZCBvZiB0aGlzIGJ1ZmZlclxuICB2YXIgaSA9IChidWZmZXIubGVuZ3RoID49IDMpID8gMyA6IGJ1ZmZlci5sZW5ndGg7XG5cbiAgLy8gRmlndXJlIG91dCBpZiBvbmUgb2YgdGhlIGxhc3QgaSBieXRlcyBvZiBvdXIgYnVmZmVyIGFubm91bmNlcyBhblxuICAvLyBpbmNvbXBsZXRlIGNoYXIuXG4gIGZvciAoOyBpID4gMDsgaS0tKSB7XG4gICAgdmFyIGMgPSBidWZmZXJbYnVmZmVyLmxlbmd0aCAtIGldO1xuXG4gICAgLy8gU2VlIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVVRGLTgjRGVzY3JpcHRpb25cblxuICAgIC8vIDExMFhYWFhYXG4gICAgaWYgKGkgPT0gMSAmJiBjID4+IDUgPT0gMHgwNikge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gMjtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIDExMTBYWFhYXG4gICAgaWYgKGkgPD0gMiAmJiBjID4+IDQgPT0gMHgwRSkge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gMztcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIDExMTEwWFhYXG4gICAgaWYgKGkgPD0gMyAmJiBjID4+IDMgPT0gMHgxRSkge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gNDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGk7XG59O1xuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgdmFyIHJlcyA9ICcnO1xuICBpZiAoYnVmZmVyICYmIGJ1ZmZlci5sZW5ndGgpXG4gICAgcmVzID0gdGhpcy53cml0ZShidWZmZXIpO1xuXG4gIGlmICh0aGlzLmNoYXJSZWNlaXZlZCkge1xuICAgIHZhciBjciA9IHRoaXMuY2hhclJlY2VpdmVkO1xuICAgIHZhciBidWYgPSB0aGlzLmNoYXJCdWZmZXI7XG4gICAgdmFyIGVuYyA9IHRoaXMuZW5jb2Rpbmc7XG4gICAgcmVzICs9IGJ1Zi5zbGljZSgwLCBjcikudG9TdHJpbmcoZW5jKTtcbiAgfVxuXG4gIHJldHVybiByZXM7XG59O1xuXG5mdW5jdGlvbiBwYXNzVGhyb3VnaFdyaXRlKGJ1ZmZlcikge1xuICByZXR1cm4gYnVmZmVyLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcpO1xufVxuXG5mdW5jdGlvbiB1dGYxNkRldGVjdEluY29tcGxldGVDaGFyKGJ1ZmZlcikge1xuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGJ1ZmZlci5sZW5ndGggJSAyO1xuICB0aGlzLmNoYXJMZW5ndGggPSB0aGlzLmNoYXJSZWNlaXZlZCA/IDIgOiAwO1xufVxuXG5mdW5jdGlvbiBiYXNlNjREZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpIHtcbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSBidWZmZXIubGVuZ3RoICUgMztcbiAgdGhpcy5jaGFyTGVuZ3RoID0gdGhpcy5jaGFyUmVjZWl2ZWQgPyAzIDogMDtcbn1cbiIsImltcG9ydCB7Z2VuZXJhdGVTY2hlbWF9IGZyb20gXCIuL2luZGV4U2NoZW1hQ3JlYXRvclwiO1xuaW1wb3J0IHsgaGFzLCBpc1N0cmluZywgZGlmZmVyZW5jZSwgZmluZCB9IGZyb20gXCJsb2Rhc2gvZnBcIjtcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJzYWZlLWJ1ZmZlclwiO1xuaW1wb3J0IHtTdHJpbmdEZWNvZGVyfSBmcm9tIFwic3RyaW5nX2RlY29kZXJcIjtcbmltcG9ydCB7Z2V0VHlwZX0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgeyBpc1NvbWV0aGluZyB9IGZyb20gXCIuLi9jb21tb25cIjtcblxuZXhwb3J0IGNvbnN0IEJVRkZFUl9NQVhfQllURVMgPSA1MjQyODg7IC8vIDAuNU1iXG5cbmV4cG9ydCBjb25zdCBDT05USU5VRV9SRUFESU5HX1JFQ09SRFMgPSBcIkNPTlRJTlVFX1JFQURJTkdcIjtcbmV4cG9ydCBjb25zdCBSRUFEX1JFTUFJTklOR19URVhUID0gXCJSRUFEX1JFTUFJTklOR1wiO1xuZXhwb3J0IGNvbnN0IENBTkNFTF9SRUFEID0gXCJDQU5DRUxcIjtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4V3JpdGVyID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlLCByZWFkYWJsZVN0cmVhbSwgd3JpdGFibGVTdHJlYW0sIGVuZCkgPT4ge1xuICAgIGNvbnN0IHNjaGVtYSA9IGdlbmVyYXRlU2NoZW1hKGhpZXJhcmNoeSwgaW5kZXhOb2RlKTtcblxuICAgIHJldHVybiAoe1xuICAgICAgICByZWFkOiByZWFkKHJlYWRhYmxlU3RyZWFtLCBzY2hlbWEpLFxuICAgICAgICB1cGRhdGVJbmRleDogdXBkYXRlSW5kZXgocmVhZGFibGVTdHJlYW0sIHdyaXRhYmxlU3RyZWFtLCBzY2hlbWEsIGVuZClcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleFJlYWRlciA9IChoaWVyYXJjaHksIGluZGV4Tm9kZSwgcmVhZGFibGVTdHJlYW0pID0+IFxuICAgIHJlYWQoXG4gICAgICAgIHJlYWRhYmxlU3RyZWFtLCBcbiAgICAgICAgZ2VuZXJhdGVTY2hlbWEoaGllcmFyY2h5LCBpbmRleE5vZGUpXG4gICAgKTtcblxuY29uc3QgdXBkYXRlSW5kZXggPSAocmVhZGFibGVTdHJlYW0sIHdyaXRhYmxlU3RyZWFtLCBzY2hlbWEpID0+IGFzeW5jIChpdGVtc1RvV3JpdGUsIGtleXNUb1JlbW92ZSkgPT4ge1xuICAgIGNvbnN0IHdyaXRlID0gbmV3T3V0cHV0V3JpdGVyKEJVRkZFUl9NQVhfQllURVMsIHdyaXRhYmxlU3RyZWFtKTtcbiAgICBjb25zdCB3cml0dGVuSXRlbXMgPSBbXTsgXG4gICAgYXdhaXQgcmVhZChyZWFkYWJsZVN0cmVhbSwgc2NoZW1hKShcbiAgICAgICAgYXN5bmMgaW5kZXhlZEl0ZW0gPT4ge1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlZCA9IGZpbmQoaSA9PiBpbmRleGVkSXRlbS5rZXkgPT09IGkua2V5KShpdGVtc1RvV3JpdGUpO1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlZCA9IGZpbmQoayA9PiBpbmRleGVkSXRlbS5rZXkgPT09IGspKGtleXNUb1JlbW92ZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKGlzU29tZXRoaW5nKHJlbW92ZWQpKSBcbiAgICAgICAgICAgICAgICByZXR1cm4gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xuXG4gICAgICAgICAgICBpZihpc1NvbWV0aGluZyh1cGRhdGVkKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlcmlhbGl6ZWRJdGVtID0gIHNlcmlhbGl6ZUl0ZW0oc2NoZW1hLCB1cGRhdGVkKTtcbiAgICAgICAgICAgICAgICBhd2FpdCB3cml0ZShzZXJpYWxpemVkSXRlbSk7XG4gICAgICAgICAgICAgICAgd3JpdHRlbkl0ZW1zLnB1c2godXBkYXRlZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRlKFxuICAgICAgICAgICAgICAgICAgICBzZXJpYWxpemVJdGVtKHNjaGVtYSwgaW5kZXhlZEl0ZW0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gXG5cbiAgICAgICAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XG5cbiAgICAgICAgfSxcbiAgICAgICAgYXN5bmMgdGV4dCA9PiBhd2FpdCB3cml0ZSh0ZXh0KVxuICAgICk7XG5cbiAgICBpZih3cml0dGVuSXRlbXMubGVuZ3RoICE9PSBpdGVtc1RvV3JpdGUubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHRvQWRkID0gZGlmZmVyZW5jZShpdGVtc1RvV3JpdGUsIHdyaXR0ZW5JdGVtcyk7XG4gICAgICAgIGZvcihsZXQgYWRkZWQgb2YgdG9BZGQpIHtcbiAgICAgICAgICAgIGF3YWl0IHdyaXRlKFxuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZUl0ZW0oc2NoZW1hLCBhZGRlZClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYod3JpdHRlbkl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBwb3RlbnRpYWxseSBhcmUgbm8gcmVjb3Jkc1xuICAgICAgICBhd2FpdCB3cml0ZShcIlwiKTtcbiAgICB9XG5cbiAgICBhd2FpdCB3cml0ZSgpO1xuICAgIGF3YWl0IHdyaXRhYmxlU3RyZWFtLmVuZCgpO1xufTtcblxuY29uc3QgcmVhZCA9IChyZWFkYWJsZVN0cmVhbSwgc2NoZW1hKSA9PiBhc3luYyAob25HZXRJdGVtLCBvbkdldFRleHQpID0+IHtcbiAgICBjb25zdCByZWFkSW5wdXQgPSBuZXdJbnB1dFJlYWRlcihyZWFkYWJsZVN0cmVhbSk7XG4gICAgbGV0IHRleHQgPSBhd2FpdCByZWFkSW5wdXQoKTtcbiAgICBsZXQgc3RhdHVzID0gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xuICAgIHdoaWxlKHRleHQubGVuZ3RoID4gMCkge1xuXG4gICAgICAgIGlmKHN0YXR1cyA9PT0gUkVBRF9SRU1BSU5JTkdfVEVYVCkge1xuICAgICAgICAgICAgYXdhaXQgb25HZXRUZXh0KHRleHQpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZihzdGF0dXMgPT09IENBTkNFTF9SRUFEKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcm93VGV4dCA9IFwiXCI7XG4gICAgICAgIGxldCBjdXJyZW50Q2hhckluZGV4PTA7XG4gICAgICAgIGZvcihsZXQgY3VycmVudENoYXIgb2YgdGV4dCkge1xuICAgICAgICAgICAgcm93VGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcIlxcclwiKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzID0gYXdhaXQgb25HZXRJdGVtKFxuICAgICAgICAgICAgICAgICAgICBkZXNlcmlhbGl6ZVJvdyhzY2hlbWEsIHJvd1RleHQpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByb3dUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBpZihzdGF0dXMgPT09IFJFQURfUkVNQUlOSU5HX1RFWFQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudENoYXJJbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoY3VycmVudENoYXJJbmRleCA8IHRleHQubGVuZ3RoIC0xKSB7XG4gICAgICAgICAgICBhd2FpdCBvbkdldFRleHQodGV4dC5zdWJzdHJpbmcoY3VycmVudENoYXJJbmRleCArIDEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHQgPSBhd2FpdCByZWFkSW5wdXQoKTtcbiAgICB9XG5cbiAgICBhd2FpdCByZWFkYWJsZVN0cmVhbS5kZXN0cm95KCk7XG5cbn07XG5cbmNvbnN0IG5ld091dHB1dFdyaXRlciA9IChmbHVzaEJvdW5kYXJ5LCB3cml0YWJsZVN0cmVhbSkgPT4ge1xuICAgIFxuICAgIGxldCBjdXJyZW50QnVmZmVyID0gbnVsbDtcblxuICAgIHJldHVybiBhc3luYyAodGV4dCkgPT4ge1xuXG4gICAgICAgIGlmKGlzU3RyaW5nKHRleHQpICYmIGN1cnJlbnRCdWZmZXIgPT09IG51bGwpXG4gICAgICAgICAgICBjdXJyZW50QnVmZmVyID0gQnVmZmVyLmZyb20odGV4dCwgXCJ1dGY4XCIpO1xuICAgICAgICBlbHNlIGlmKGlzU3RyaW5nKHRleHQpKVxuICAgICAgICAgICAgY3VycmVudEJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoW1xuICAgICAgICAgICAgICAgIGN1cnJlbnRCdWZmZXIsXG4gICAgICAgICAgICAgICAgQnVmZmVyLmZyb20odGV4dCwgXCJ1dGY4XCIpXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgXG4gICAgICAgIGlmKGN1cnJlbnRCdWZmZXIgIT09IG51bGwgJiZcbiAgICAgICAgICAgIChjdXJyZW50QnVmZmVyLmxlbmd0aCA+IGZsdXNoQm91bmRhcnlcbiAgICAgICAgICAgICB8fCAhaXNTdHJpbmcodGV4dCkpKSB7XG5cbiAgICAgICAgICAgIGF3YWl0IHdyaXRhYmxlU3RyZWFtLndyaXRlKGN1cnJlbnRCdWZmZXIpO1xuICAgICAgICAgICAgY3VycmVudEJ1ZmZlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5jb25zdCBuZXdJbnB1dFJlYWRlciA9IChyZWFkYWJsZVN0cmVhbSkgPT4ge1xuXG4gICAgY29uc3QgZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKCd1dGY4Jyk7XG4gICAgbGV0IHJlbWFpbmluZ0J5dGVzID0gW107XG5cbiAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgIGxldCBuZXh0Qnl0ZXNCdWZmZXIgPSBhd2FpdCByZWFkYWJsZVN0cmVhbS5yZWFkKEJVRkZFUl9NQVhfQllURVMpO1xuICAgICAgICBjb25zdCByZW1haW5pbmdCdWZmZXIgPSBCdWZmZXIuZnJvbShyZW1haW5pbmdCeXRlcyk7XG5cbiAgICAgICAgaWYoIW5leHRCeXRlc0J1ZmZlcikgbmV4dEJ5dGVzQnVmZmVyID0gQnVmZmVyLmZyb20oW10pO1xuXG4gICAgICAgIGNvbnN0IG1vcmVUb1JlYWQgPSBuZXh0Qnl0ZXNCdWZmZXIubGVuZ3RoID09PSBCVUZGRVJfTUFYX0JZVEVTO1xuXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoXG4gICAgICAgICAgICBbcmVtYWluaW5nQnVmZmVyLCBuZXh0Qnl0ZXNCdWZmZXJdLFxuICAgICAgICAgICAgcmVtYWluaW5nQnVmZmVyLmxlbmd0aCArIG5leHRCeXRlc0J1ZmZlci5sZW5ndGgpO1xuXG4gICAgICAgIGNvbnN0IHRleHQgPSBkZWNvZGVyLndyaXRlKGJ1ZmZlcik7XG4gICAgICAgIHJlbWFpbmluZ0J5dGVzID0gZGVjb2Rlci5lbmQoYnVmZmVyKTtcblxuICAgICAgICBpZighbW9yZVRvUmVhZCAmJiByZW1haW5pbmdCeXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBpZiBmb3IgYW55IHJlYXNvbiwgd2UgaGF2ZSByZW1haW5pbmcgYnl0ZXMgYXQgdGhlIGVuZFxuICAgICAgICAgICAgLy8gb2YgdGhlIHN0cmVhbSwganVzdCBkaXNjYXJkIC0gZG9udCBzZWUgd2h5IHRoaXMgc2hvdWxkXG4gICAgICAgICAgICAvLyBldmVyIGhhcHBlbiwgYnV0IGlmIGl0IGRvZXMsIGl0IGNvdWxkIGNhdXNlIGEgc3RhY2sgb3ZlcmZsb3dcbiAgICAgICAgICAgIHJlbWFpbmluZ0J5dGVzID0gW107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9O1xufTtcblxuY29uc3QgZGVzZXJpYWxpemVSb3cgPSAoc2NoZW1hLCByb3dUZXh0KSA9PiB7XG4gICAgbGV0IGN1cnJlbnRQcm9wSW5kZXggPSAwO1xuICAgIGxldCBjdXJyZW50Q2hhckluZGV4ID0gMDtcbiAgICBsZXQgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XG4gICAgbGV0IGlzRXNjYXBlZCA9IGZhbHNlO1xuICAgIGNvbnN0IGl0ZW0gPSB7fTtcblxuICAgIGNvbnN0IHNldEN1cnJlbnRQcm9wID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJyZW50UHJvcCA9IHNjaGVtYVtjdXJyZW50UHJvcEluZGV4XTtcbiAgICAgICAgY29uc3QgdHlwZSA9IGdldFR5cGUoY3VycmVudFByb3AudHlwZSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY3VycmVudFZhbHVlVGV4dCA9PT0gXCJcIlxuICAgICAgICAgICAgICAgICAgICAgID8gdHlwZS5nZXREZWZhdWx0VmFsdWUoKVxuICAgICAgICAgICAgICAgICAgICAgIDogdHlwZS5zYWZlUGFyc2VWYWx1ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCk7XG4gICAgICAgIGl0ZW1bY3VycmVudFByb3AubmFtZV0gPSB2YWx1ZTtcbiAgICB9O1xuICAgIFxuICAgIHdoaWxlKGN1cnJlbnRQcm9wSW5kZXggPCBzY2hlbWEubGVuZ3RoKSB7XG5cbiAgICAgICAgaWYoY3VycmVudENoYXJJbmRleCA8IHJvd1RleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2hhciA9IHJvd1RleHRbY3VycmVudENoYXJJbmRleF07XG4gICAgICAgICAgICBpZihpc0VzY2FwZWQpIHtcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCJyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCArPSBcIlxcclwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZVRleHQgKz0gY3VycmVudENoYXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlzRXNjYXBlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCIsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0Q3VycmVudFByb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQcm9wSW5kZXgrKztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoY3VycmVudENoYXIgPT09IFwiXFxcXFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzRXNjYXBlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyZW50Q2hhckluZGV4Kys7IFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICBzZXRDdXJyZW50UHJvcCgpO1xuICAgICAgICAgICAgY3VycmVudFByb3BJbmRleCsrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZW07XG59O1xuXG5leHBvcnQgY29uc3Qgc2VyaWFsaXplSXRlbSA9IChzY2hlbWEsIGl0ZW0pICA9PiB7XG5cbiAgICBsZXQgcm93VGV4dCA9IFwiXCJcblxuICAgIGZvcihsZXQgcHJvcCBvZiBzY2hlbWEpIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IGdldFR5cGUocHJvcC50eXBlKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBoYXMocHJvcC5uYW1lKShpdGVtKVxuICAgICAgICAgICAgICAgICAgICAgID8gaXRlbVtwcm9wLm5hbWVdXG4gICAgICAgICAgICAgICAgICAgICAgOiB0eXBlLmdldERlZmF1bHRWYWx1ZSgpXG4gICAgICAgIFxuICAgICAgICBjb25zdCB2YWxTdHIgPSB0eXBlLnN0cmluZ2lmeSh2YWx1ZSk7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHZhbFN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudENoYXIgPSB2YWxTdHJbaV07XG4gICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCIsXCIgXG4gICAgICAgICAgICAgICB8fCBjdXJyZW50Q2hhciA9PT0gXCJcXHJcIiBcbiAgICAgICAgICAgICAgIHx8IGN1cnJlbnRDaGFyID09PSBcIlxcXFxcIikge1xuICAgICAgICAgICAgICAgIHJvd1RleHQgKz0gXCJcXFxcXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcIlxcclwiKSB7XG4gICAgICAgICAgICAgICAgcm93VGV4dCArPSBcInJcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcm93VGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJvd1RleHQgKz0gXCIsXCI7XG4gICAgfVxuXG4gICAgcm93VGV4dCArPSBcIlxcclwiO1xuICAgIHJldHVybiByb3dUZXh0O1xufTsiLCJpbXBvcnQgbHVuciBmcm9tICdsdW5yJztcbmltcG9ydCB7XG4gIGdldEhhc2hDb2RlLFxuICBqb2luS2V5XG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBnZXRBY3R1YWxLZXlPZlBhcmVudCxcbiAgaXNHbG9iYWxJbmRleCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7cHJvbWlzZVJlYWRhYmxlU3RyZWFtfSBmcm9tIFwiLi9wcm9taXNlUmVhZGFibGVTdHJlYW1cIjtcbmltcG9ydCB7IGNyZWF0ZUluZGV4RmlsZSB9IGZyb20gJy4vc2hhcmRpbmcnO1xuaW1wb3J0IHsgZ2VuZXJhdGVTY2hlbWEgfSBmcm9tICcuL2luZGV4U2NoZW1hQ3JlYXRvcic7XG5pbXBvcnQgeyBnZXRJbmRleFJlYWRlciwgQ09OVElOVUVfUkVBRElOR19SRUNPUkRTIH0gZnJvbSAnLi9zZXJpYWxpemVyJztcblxuZXhwb3J0IGNvbnN0IHJlYWRJbmRleCA9IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KSA9PiB7XG4gIGNvbnN0IHJlY29yZHMgPSBbXTtcbiAgY29uc3QgZG9SZWFkID0gaXRlcmF0ZUluZGV4KFxuICAgICAgICBhc3luYyBpdGVtID0+IHtcbiAgICAgIHJlY29yZHMucHVzaChpdGVtKTtcbiAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XG4gICAgfSxcbiAgICAgICAgYXN5bmMgKCkgPT4gcmVjb3Jkc1xuICApO1xuXG4gIHJldHVybiBhd2FpdCBkb1JlYWQoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2VhcmNoSW5kZXggPSBhc3luYyAoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSwgc2VhcmNoUGhyYXNlKSA9PiB7XG4gIGNvbnN0IHJlY29yZHMgPSBbXTtcbiAgY29uc3Qgc2NoZW1hID0gZ2VuZXJhdGVTY2hlbWEoaGllcmFyY2h5LCBpbmRleCk7XG4gIGNvbnN0IGRvUmVhZCA9IGl0ZXJhdGVJbmRleChcbiAgICAgICAgYXN5bmMgaXRlbSA9PiB7XG4gICAgICBjb25zdCBpZHggPSBsdW5yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yZWYoJ2tleScpO1xuICAgICAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIHNjaGVtYSkge1xuICAgICAgICAgIHRoaXMuZmllbGQoZmllbGQubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGQoaXRlbSk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNlYXJjaFJlc3VsdHMgPSBpZHguc2VhcmNoKHNlYXJjaFBocmFzZSk7XG4gICAgICBpZiAoc2VhcmNoUmVzdWx0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaXRlbS5fc2VhcmNoUmVzdWx0ID0gc2VhcmNoUmVzdWx0c1swXTtcbiAgICAgICAgcmVjb3Jkcy5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcbiAgICB9LFxuICAgICAgICBhc3luYyAoKSA9PiByZWNvcmRzXG4gICk7XG5cbiAgcmV0dXJuIGF3YWl0IGRvUmVhZChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleGVkRGF0YUtleV9mcm9tSW5kZXhLZXkgPSAoaW5kZXhLZXkpID0+IFxuICBgJHtpbmRleEtleX0ke2luZGV4S2V5LmVuZHNXaXRoKCcuY3N2JykgPyAnJyA6ICcuY3N2J31gO1xuXG5leHBvcnQgY29uc3QgdW5pcXVlSW5kZXhOYW1lID0gaW5kZXggPT4gYGlkeF8ke1xuICBnZXRIYXNoQ29kZShgJHtpbmRleC5maWx0ZXJ9JHtpbmRleC5tYXB9YClcbn0uY3N2YDtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4ZWREYXRhS2V5ID0gKGRlY2VuZGFudEtleSwgaW5kZXhOb2RlKSA9PiB7XG4gIGlmIChpc0dsb2JhbEluZGV4KGluZGV4Tm9kZSkpIHsgcmV0dXJuIGAke2luZGV4Tm9kZS5ub2RlS2V5KCl9LmNzdmA7IH1cblxuICBjb25zdCBpbmRleGVkRGF0YVBhcmVudEtleSA9IGdldEFjdHVhbEtleU9mUGFyZW50KFxuICAgIGluZGV4Tm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksXG4gICAgZGVjZW5kYW50S2V5LFxuICApO1xuXG4gIGNvbnN0IGluZGV4TmFtZSA9IGluZGV4Tm9kZS5uYW1lXG4gICAgPyBgJHtpbmRleE5vZGUubmFtZX0uY3N2YFxuICAgIDogdW5pcXVlSW5kZXhOYW1lKGluZGV4Tm9kZSk7XG5cbiAgcmV0dXJuIGpvaW5LZXkoXG4gICAgaW5kZXhlZERhdGFQYXJlbnRLZXksXG4gICAgaW5kZXhOYW1lLFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGl0ZXJhdGVJbmRleCA9IChvbkdldEl0ZW0sIGdldEZpbmFsUmVzdWx0KSA9PiBhc3luYyAoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlYWRhYmxlU3RyZWFtID0gcHJvbWlzZVJlYWRhYmxlU3RyZWFtKFxuICAgICAgICBhd2FpdCBkYXRhc3RvcmUucmVhZGFibGVGaWxlU3RyZWFtKGluZGV4ZWREYXRhS2V5KVxuICAgICk7XG5cbiAgICBjb25zdCByZWFkID0gZ2V0SW5kZXhSZWFkZXIoaGllcmFyY2h5LCBpbmRleCwgcmVhZGFibGVTdHJlYW0pO1xuICAgIGF3YWl0IHJlYWQob25HZXRJdGVtKTtcbiAgICByZXR1cm4gZ2V0RmluYWxSZXN1bHQoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGluZGV4ZWREYXRhS2V5KSkge1xuICAgICAgdGhyb3cgZTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgY3JlYXRlSW5kZXhGaWxlKFxuICAgICAgICBkYXRhc3RvcmUsXG4gICAgICAgIGluZGV4ZWREYXRhS2V5LFxuICAgICAgICBpbmRleCxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxufTtcbiIsImltcG9ydCB7IGZsYXR0ZW4sIG1lcmdlIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIHNhZmVLZXksIGFwaVdyYXBwZXIsICQsXG4gIGV2ZW50cywgaXNOb25FbXB0eVN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHJlYWRJbmRleCwgc2VhcmNoSW5kZXggfSBmcm9tICcuLi9pbmRleGluZy9yZWFkJztcbmltcG9ydCB7XG4gIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSxcbiAgZ2V0U2hhcmRLZXlzSW5SYW5nZSxcbn0gZnJvbSAnLi4vaW5kZXhpbmcvc2hhcmRpbmcnO1xuaW1wb3J0IHtcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCwgaXNJbmRleCxcbiAgaXNTaGFyZGVkSW5kZXgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBsaXN0SXRlbXMgPSBhcHAgPT4gYXN5bmMgKGluZGV4S2V5LCBvcHRpb25zKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5pbmRleEFwaS5saXN0SXRlbXMsXG4gIHBlcm1pc3Npb24ucmVhZEluZGV4LmlzQXV0aG9yaXplZChpbmRleEtleSksXG4gIHsgaW5kZXhLZXksIG9wdGlvbnMgfSxcbiAgX2xpc3RJdGVtcywgYXBwLCBpbmRleEtleSwgb3B0aW9ucyxcbik7XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0geyByYW5nZVN0YXJ0UGFyYW1zOiBudWxsLCByYW5nZUVuZFBhcmFtczogbnVsbCwgc2VhcmNoUGhyYXNlOiBudWxsIH07XG5cbmNvbnN0IF9saXN0SXRlbXMgPSBhc3luYyAoYXBwLCBpbmRleEtleSwgb3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zKSA9PiB7XG4gIGNvbnN0IHsgc2VhcmNoUGhyYXNlLCByYW5nZVN0YXJ0UGFyYW1zLCByYW5nZUVuZFBhcmFtcyB9ID0gJCh7fSwgW1xuICAgIG1lcmdlKG9wdGlvbnMpLFxuICAgIG1lcmdlKGRlZmF1bHRPcHRpb25zKSxcbiAgXSk7XG5cbiAgY29uc3QgZ2V0SXRlbXMgPSBhc3luYyBrZXkgPT4gKGlzTm9uRW1wdHlTdHJpbmcoc2VhcmNoUGhyYXNlKVxuICAgID8gYXdhaXQgc2VhcmNoSW5kZXgoXG4gICAgICBhcHAuaGllcmFyY2h5LFxuICAgICAgYXBwLmRhdGFzdG9yZSxcbiAgICAgIGluZGV4Tm9kZSxcbiAgICAgIGtleSxcbiAgICAgIHNlYXJjaFBocmFzZSxcbiAgICApXG4gICAgOiBhd2FpdCByZWFkSW5kZXgoXG4gICAgICBhcHAuaGllcmFyY2h5LFxuICAgICAgYXBwLmRhdGFzdG9yZSxcbiAgICAgIGluZGV4Tm9kZSxcbiAgICAgIGtleSxcbiAgICApKTtcblxuICBpbmRleEtleSA9IHNhZmVLZXkoaW5kZXhLZXkpO1xuICBjb25zdCBpbmRleE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKGluZGV4S2V5KTtcblxuICBpZiAoIWlzSW5kZXgoaW5kZXhOb2RlKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ3N1cHBsaWVkIGtleSBpcyBub3QgYW4gaW5kZXgnKTsgfVxuXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleE5vZGUpKSB7XG4gICAgY29uc3Qgc2hhcmRLZXlzID0gYXdhaXQgZ2V0U2hhcmRLZXlzSW5SYW5nZShcbiAgICAgIGFwcCwgaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zLFxuICAgICk7XG4gICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGsgb2Ygc2hhcmRLZXlzKSB7XG4gICAgICBpdGVtcy5wdXNoKGF3YWl0IGdldEl0ZW1zKGspKTtcbiAgICB9XG4gICAgcmV0dXJuIGZsYXR0ZW4oaXRlbXMpO1xuICB9XG4gIHJldHVybiBhd2FpdCBnZXRJdGVtcyhcbiAgICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXkoaW5kZXhLZXkpLFxuICApO1xufTtcbiIsImltcG9ydCB7IGhhcywgc29tZSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBtYXAsIGlzU3RyaW5nIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXG4gIGZpbmRGaWVsZCwgZ2V0Tm9kZSwgaXNHbG9iYWxJbmRleCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IGxpc3RJdGVtcyB9IGZyb20gJy4uL2luZGV4QXBpL2xpc3RJdGVtcyc7XG5pbXBvcnQge1xuICAkLCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0SW5kZXhLZXlfQmFzZWRPbkRlY2VuZGFudCB9IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGdldENvbnRleHQgPSBhcHAgPT4gcmVjb3JkS2V5ID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5yZWNvcmRBcGkuZ2V0Q29udGV4dCxcbiAgcGVybWlzc2lvbi5yZWFkUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmRLZXkpLFxuICB7IHJlY29yZEtleSB9LFxuICBfZ2V0Q29udGV4dCwgYXBwLCByZWNvcmRLZXksXG4pO1xuXG5leHBvcnQgY29uc3QgX2dldENvbnRleHQgPSAoYXBwLCByZWNvcmRLZXkpID0+IHtcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkocmVjb3JkS2V5KTtcblxuICBjb25zdCBjYWNoZWRSZWZlcmVuY2VJbmRleGVzID0ge307XG5cbiAgY29uc3QgbGF6eUxvYWRSZWZlcmVuY2VJbmRleCA9IGFzeW5jICh0eXBlT3B0aW9ucykgPT4ge1xuICAgIGlmICghaGFzKGNhY2hlZFJlZmVyZW5jZUluZGV4ZXMsIHR5cGVPcHRpb25zLmluZGV4Tm9kZUtleSkpIHtcbiAgICAgIGNhY2hlZFJlZmVyZW5jZUluZGV4ZXNbdHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5XSA9IHtcbiAgICAgICAgdHlwZU9wdGlvbnMsXG4gICAgICAgIGRhdGE6IGF3YWl0IHJlYWRSZWZlcmVuY2VJbmRleChcbiAgICAgICAgICBhcHAsIHJlY29yZEtleSwgdHlwZU9wdGlvbnMsXG4gICAgICAgICksXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBjYWNoZWRSZWZlcmVuY2VJbmRleGVzW3R5cGVPcHRpb25zLmluZGV4Tm9kZUtleV07XG4gIH07XG5cbiAgY29uc3QgZ2V0VHlwZU9wdGlvbnMgPSB0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUgPT4gKGlzU3RyaW5nKHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSlcbiAgICA/IGZpbmRGaWVsZChyZWNvcmROb2RlLCB0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUpXG4gICAgICAudHlwZU9wdGlvbnNcbiAgICA6IHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSk7XG5cbiAgcmV0dXJuIHtcbiAgICByZWZlcmVuY2VFeGlzdHM6IGFzeW5jICh0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUsIGtleSkgPT4ge1xuICAgICAgY29uc3QgdHlwZU9wdGlvbnMgPSBnZXRUeXBlT3B0aW9ucyh0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUpO1xuICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBsYXp5TG9hZFJlZmVyZW5jZUluZGV4KHR5cGVPcHRpb25zKTtcbiAgICAgIHJldHVybiBzb21lKGRhdGEsIGkgPT4gaS5rZXkgPT09IGtleSk7XG4gICAgfSxcbiAgICByZWZlcmVuY2VPcHRpb25zOiBhc3luYyAodHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKSA9PiB7XG4gICAgICBjb25zdCB0eXBlT3B0aW9ucyA9IGdldFR5cGVPcHRpb25zKHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSk7XG4gICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGxhenlMb2FkUmVmZXJlbmNlSW5kZXgodHlwZU9wdGlvbnMpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSxcbiAgICByZWNvcmROb2RlLFxuICB9O1xufTtcblxuY29uc3QgcmVhZFJlZmVyZW5jZUluZGV4ID0gYXN5bmMgKGFwcCwgcmVjb3JkS2V5LCB0eXBlT3B0aW9ucykgPT4ge1xuICBjb25zdCBpbmRleE5vZGUgPSBnZXROb2RlKGFwcC5oaWVyYXJjaHksIHR5cGVPcHRpb25zLmluZGV4Tm9kZUtleSk7XG4gIGNvbnN0IGluZGV4S2V5ID0gaXNHbG9iYWxJbmRleChpbmRleE5vZGUpXG4gICAgPyBpbmRleE5vZGUubm9kZUtleSgpXG4gICAgOiBnZXRJbmRleEtleV9CYXNlZE9uRGVjZW5kYW50KFxuICAgICAgcmVjb3JkS2V5LCBpbmRleE5vZGUsXG4gICAgKTtcblxuICBjb25zdCBpdGVtcyA9IGF3YWl0IGxpc3RJdGVtcyhhcHApKGluZGV4S2V5KTtcbiAgcmV0dXJuICQoaXRlbXMsIFtcbiAgICBtYXAoaSA9PiAoe1xuICAgICAga2V5OiBpLmtleSxcbiAgICAgIHZhbHVlOiBpW3R5cGVPcHRpb25zLmRpc3BsYXlWYWx1ZV0sXG4gICAgfSkpLFxuICBdKTtcbn07XG4iLCJpbXBvcnQge1xuICBtYXAsIHJlZHVjZSwgZmlsdGVyLFxuICBpc0VtcHR5LCBmbGF0dGVuLCBlYWNoLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgY29tcGlsZUV4cHJlc3Npb24gfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgZ2V0RXhhY3ROb2RlRm9yUGF0aCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyB2YWxpZGF0ZUZpZWxkUGFyc2UsIHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgJCwgaXNOb3RoaW5nLCBpc05vbkVtcHR5U3RyaW5nIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IF9nZXRDb250ZXh0IH0gZnJvbSAnLi9nZXRDb250ZXh0JztcblxuY29uc3QgZmllbGRQYXJzZUVycm9yID0gKGZpZWxkTmFtZSwgdmFsdWUpID0+ICh7XG4gIGZpZWxkczogW2ZpZWxkTmFtZV0sXG4gIG1lc3NhZ2U6IGBDb3VsZCBub3QgcGFyc2UgZmllbGQgJHtmaWVsZE5hbWV9OiR7dmFsdWV9YCxcbn0pO1xuXG5jb25zdCB2YWxpZGF0ZUFsbEZpZWxkUGFyc2UgPSAocmVjb3JkLCByZWNvcmROb2RlKSA9PiAkKHJlY29yZE5vZGUuZmllbGRzLCBbXG4gIG1hcChmID0+ICh7IG5hbWU6IGYubmFtZSwgcGFyc2VSZXN1bHQ6IHZhbGlkYXRlRmllbGRQYXJzZShmLCByZWNvcmQpIH0pKSxcbiAgcmVkdWNlKChlcnJvcnMsIGYpID0+IHtcbiAgICBpZiAoZi5wYXJzZVJlc3VsdC5zdWNjZXNzKSByZXR1cm4gZXJyb3JzO1xuICAgIGVycm9ycy5wdXNoKFxuICAgICAgZmllbGRQYXJzZUVycm9yKGYubmFtZSwgZi5wYXJzZVJlc3VsdC52YWx1ZSksXG4gICAgKTtcbiAgICByZXR1cm4gZXJyb3JzO1xuICB9LCBbXSksXG5dKTtcblxuY29uc3QgdmFsaWRhdGVBbGxUeXBlQ29uc3RyYWludHMgPSBhc3luYyAocmVjb3JkLCByZWNvcmROb2RlLCBjb250ZXh0KSA9PiB7XG4gIGNvbnN0IGVycm9ycyA9IFtdO1xuICBmb3IgKGNvbnN0IGZpZWxkIG9mIHJlY29yZE5vZGUuZmllbGRzKSB7XG4gICAgJChhd2FpdCB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyhmaWVsZCwgcmVjb3JkLCBjb250ZXh0KSwgW1xuICAgICAgZmlsdGVyKGlzTm9uRW1wdHlTdHJpbmcpLFxuICAgICAgbWFwKG0gPT4gKHsgbWVzc2FnZTogbSwgZmllbGRzOiBbZmllbGQubmFtZV0gfSkpLFxuICAgICAgZWFjaChlID0+IGVycm9ycy5wdXNoKGUpKSxcbiAgICBdKTtcbiAgfVxuICByZXR1cm4gZXJyb3JzO1xufTtcblxuY29uc3QgcnVuUmVjb3JkVmFsaWRhdGlvblJ1bGVzID0gKHJlY29yZCwgcmVjb3JkTm9kZSkgPT4ge1xuICBjb25zdCBydW5WYWxpZGF0aW9uUnVsZSA9IChydWxlKSA9PiB7XG4gICAgY29uc3QgaXNWYWxpZCA9IGNvbXBpbGVFeHByZXNzaW9uKHJ1bGUuZXhwcmVzc2lvbldoZW5WYWxpZCk7XG4gICAgY29uc3QgZXhwcmVzc2lvbkNvbnRleHQgPSB7IHJlY29yZCwgXyB9O1xuICAgIHJldHVybiAoaXNWYWxpZChleHByZXNzaW9uQ29udGV4dClcbiAgICAgID8geyB2YWxpZDogdHJ1ZSB9XG4gICAgICA6ICh7XG4gICAgICAgIHZhbGlkOiBmYWxzZSxcbiAgICAgICAgZmllbGRzOiBydWxlLmludmFsaWRGaWVsZHMsXG4gICAgICAgIG1lc3NhZ2U6IHJ1bGUubWVzc2FnZVdoZW5JbnZhbGlkLFxuICAgICAgfSkpO1xuICB9O1xuXG4gIHJldHVybiAkKHJlY29yZE5vZGUudmFsaWRhdGlvblJ1bGVzLCBbXG4gICAgbWFwKHJ1blZhbGlkYXRpb25SdWxlKSxcbiAgICBmbGF0dGVuLFxuICAgIGZpbHRlcihyID0+IHIudmFsaWQgPT09IGZhbHNlKSxcbiAgICBtYXAociA9PiAoeyBmaWVsZHM6IHIuZmllbGRzLCBtZXNzYWdlOiByLm1lc3NhZ2UgfSkpLFxuICBdKTtcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZSA9IGFwcCA9PiBhc3luYyAocmVjb3JkLCBjb250ZXh0KSA9PiB7XG4gIGNvbnRleHQgPSBpc05vdGhpbmcoY29udGV4dClcbiAgICA/IF9nZXRDb250ZXh0KGFwcCwgcmVjb3JkLmtleSlcbiAgICA6IGNvbnRleHQ7XG5cbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkocmVjb3JkLmtleSk7XG4gIGNvbnN0IGZpZWxkUGFyc2VGYWlscyA9IHZhbGlkYXRlQWxsRmllbGRQYXJzZShyZWNvcmQsIHJlY29yZE5vZGUpO1xuXG4gIC8vIG5vbiBwYXJzaW5nIHdvdWxkIGNhdXNlIGZ1cnRoZXIgaXNzdWVzIC0gZXhpdCBoZXJlXG4gIGlmICghaXNFbXB0eShmaWVsZFBhcnNlRmFpbHMpKSB7IHJldHVybiAoeyBpc1ZhbGlkOiBmYWxzZSwgZXJyb3JzOiBmaWVsZFBhcnNlRmFpbHMgfSk7IH1cblxuICBjb25zdCByZWNvcmRWYWxpZGF0aW9uUnVsZUZhaWxzID0gcnVuUmVjb3JkVmFsaWRhdGlvblJ1bGVzKHJlY29yZCwgcmVjb3JkTm9kZSk7XG4gIGNvbnN0IHR5cGVDb250cmFpbnRGYWlscyA9IGF3YWl0IHZhbGlkYXRlQWxsVHlwZUNvbnN0cmFpbnRzKHJlY29yZCwgcmVjb3JkTm9kZSwgY29udGV4dCk7XG5cbiAgaWYgKGlzRW1wdHkoZmllbGRQYXJzZUZhaWxzKVxuICAgICAgICYmIGlzRW1wdHkocmVjb3JkVmFsaWRhdGlvblJ1bGVGYWlscylcbiAgICAgICAmJiBpc0VtcHR5KHR5cGVDb250cmFpbnRGYWlscykpIHtcbiAgICByZXR1cm4gKHsgaXNWYWxpZDogdHJ1ZSwgZXJyb3JzOiBbXSB9KTtcbiAgfVxuXG4gIHJldHVybiAoe1xuICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgIGVycm9yczogXy51bmlvbihmaWVsZFBhcnNlRmFpbHMsIHR5cGVDb250cmFpbnRGYWlscywgcmVjb3JkVmFsaWRhdGlvblJ1bGVGYWlscyksXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IGZpbHRlciB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGlzQ29sbGVjdGlvblJlY29yZCxcbiAgaXNSb290LFxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgJCwgYWxsVHJ1ZSwgam9pbktleSB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmNvbnN0IGVuc3VyZUNvbGxlY3Rpb25Jc0luaXRpYWxpc2VkID0gYXN5bmMgKGRhdGFzdG9yZSwgbm9kZSwgcGFyZW50S2V5KSA9PiB7XG4gIGlmICghYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhwYXJlbnRLZXkpKSB7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihwYXJlbnRLZXkpO1xuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoXG4gICAgICBqb2luS2V5KHBhcmVudEtleSwgJ2FsbGlkcycpLFxuICAgICk7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihcbiAgICAgIGpvaW5LZXkoXG4gICAgICAgIHBhcmVudEtleSxcbiAgICAgICAgJ2FsbGlkcycsXG4gICAgICAgIG5vZGUubm9kZUlkLnRvU3RyaW5nKCksXG4gICAgICApLFxuICAgICk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlUm9vdENvbGxlY3Rpb25zID0gYXN5bmMgKGRhdGFzdG9yZSwgaGllcmFyY2h5KSA9PiB7XG4gIGNvbnN0IHJvb3RDb2xsZWN0aW9uUmVjb3JkID0gYWxsVHJ1ZShcbiAgICBuID0+IGlzUm9vdChuLnBhcmVudCgpKSxcbiAgICBpc0NvbGxlY3Rpb25SZWNvcmQsXG4gICk7XG5cbiAgY29uc3QgZmxhdGhpZXJhcmNoeSA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShoaWVyYXJjaHkpO1xuXG4gIGNvbnN0IGNvbGxlY3Rpb25SZWNvcmRzID0gJChmbGF0aGllcmFyY2h5LCBbXG4gICAgZmlsdGVyKHJvb3RDb2xsZWN0aW9uUmVjb3JkKSxcbiAgXSk7XG5cbiAgZm9yIChjb25zdCBjb2wgb2YgY29sbGVjdGlvblJlY29yZHMpIHtcbiAgICBhd2FpdCBlbnN1cmVDb2xsZWN0aW9uSXNJbml0aWFsaXNlZChcbiAgICAgIGRhdGFzdG9yZSxcbiAgICAgIGNvbCxcbiAgICAgIGNvbC5jb2xsZWN0aW9uUGF0aFJlZ3goKSxcbiAgICApO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgaW5pdGlhbGlzZUNoaWxkQ29sbGVjdGlvbnMgPSBhc3luYyAoYXBwLCByZWNvcmRLZXkpID0+IHtcbiAgY29uc3QgY2hpbGRDb2xsZWN0aW9uUmVjb3JkcyA9ICQocmVjb3JkS2V5LCBbXG4gICAgZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KSxcbiAgICBuID0+IG4uY2hpbGRyZW4sXG4gICAgZmlsdGVyKGlzQ29sbGVjdGlvblJlY29yZCksXG4gIF0pO1xuXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRDb2xsZWN0aW9uUmVjb3Jkcykge1xuICAgIGF3YWl0IGVuc3VyZUNvbGxlY3Rpb25Jc0luaXRpYWxpc2VkKFxuICAgICAgYXBwLmRhdGFzdG9yZSxcbiAgICAgIGNoaWxkLFxuICAgICAgam9pbktleShyZWNvcmRLZXksIGNoaWxkLmNvbGxlY3Rpb25OYW1lKSxcbiAgICApO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgam9pbiwgcHVsbCxcbiAgbWFwLCBmbGF0dGVuLCBvcmRlckJ5LFxuICBmaWx0ZXIsIGZpbmQsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRQYXJlbnRLZXksXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZ2V0Q29sbGVjdGlvbk5vZGVCeUtleU9yTm9kZUtleSwgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoLFxuICBpc0NvbGxlY3Rpb25SZWNvcmQsIGlzQW5jZXN0b3IsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBqb2luS2V5LCBzYWZlS2V5LCAkIH0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgYWxsSWRDaGFycyA9ICcwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWl8tJztcblxuY29uc3QgYWxsSWRzU3RyaW5nc0ZvckZhY3RvciA9IChjb2xsZWN0aW9uTm9kZSkgPT4ge1xuICBjb25zdCBmYWN0b3IgPSBjb2xsZWN0aW9uTm9kZS5hbGxpZHNTaGFyZEZhY3RvcjtcbiAgY29uc3QgY2hhclJhbmdlUGVyU2hhcmQgPSA2NCAvIGZhY3RvcjtcbiAgY29uc3QgYWxsSWRTdHJpbmdzID0gW107XG4gIGxldCBpbmRleCA9IDA7XG4gIGxldCBjdXJyZW50SWRzU2hhcmQgPSAnJztcbiAgd2hpbGUgKGluZGV4IDwgNjQpIHtcbiAgICBjdXJyZW50SWRzU2hhcmQgKz0gYWxsSWRDaGFyc1tpbmRleF07XG4gICAgaWYgKChpbmRleCArIDEpICUgY2hhclJhbmdlUGVyU2hhcmQgPT09IDApIHtcbiAgICAgIGFsbElkU3RyaW5ncy5wdXNoKGN1cnJlbnRJZHNTaGFyZCk7XG4gICAgICBjdXJyZW50SWRzU2hhcmQgPSAnJztcbiAgICB9XG4gICAgaW5kZXgrKztcbiAgfVxuXG4gIHJldHVybiBhbGxJZFN0cmluZ3M7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsSWRzU2hhcmROYW1lcyA9IChhcHBIaWVyYXJjaHksIGNvbGxlY3Rpb25LZXkpID0+IHtcbiAgY29uc3QgY29sbGVjdGlvblJlY29yZE5vZGUgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwSGllcmFyY2h5KShjb2xsZWN0aW9uS2V5KTtcbiAgcmV0dXJuICQoY29sbGVjdGlvblJlY29yZE5vZGUsIFtcbiAgICBjID0+IFtjLm5vZGVJZF0sXG4gICAgbWFwKGkgPT4gbWFwKGMgPT4gX2FsbElkc1NoYXJkS2V5KGNvbGxlY3Rpb25LZXksIGksIGMpKShhbGxJZHNTdHJpbmdzRm9yRmFjdG9yKGNvbGxlY3Rpb25SZWNvcmROb2RlKSkpLFxuICAgIGZsYXR0ZW4sXG4gIF0pO1xufTtcblxuY29uc3QgX2FsbElkc1NoYXJkS2V5ID0gKGNvbGxlY3Rpb25LZXksIGNoaWxkTm8sIHNoYXJkS2V5KSA9PiBqb2luS2V5KFxuICBjb2xsZWN0aW9uS2V5LFxuICAnYWxsaWRzJyxcbiAgY2hpbGRObyxcbiAgc2hhcmRLZXksXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsSWRzU2hhcmRLZXkgPSAoYXBwSGllcmFyY2h5LCBjb2xsZWN0aW9uS2V5LCByZWNvcmRJZCkgPT4ge1xuICBjb25zdCBpbmRleE9mRmlyc3REYXNoID0gcmVjb3JkSWQuaW5kZXhPZignLScpO1xuXG4gIGNvbnN0IGNvbGxlY3Rpb25Ob2RlID0gZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoKGFwcEhpZXJhcmNoeSkoY29sbGVjdGlvbktleSk7XG5cbiAgY29uc3QgaWRGaXJzdENoYXIgPSByZWNvcmRJZFtpbmRleE9mRmlyc3REYXNoICsgMV07XG4gIGNvbnN0IGFsbElkc1NoYXJkSWQgPSAkKGNvbGxlY3Rpb25Ob2RlLCBbXG4gICAgYWxsSWRzU3RyaW5nc0ZvckZhY3RvcixcbiAgICBmaW5kKGkgPT4gaS5pbmNsdWRlcyhpZEZpcnN0Q2hhcikpLFxuICBdKTtcblxuICByZXR1cm4gX2FsbElkc1NoYXJkS2V5KFxuICAgIGNvbGxlY3Rpb25LZXksXG4gICAgcmVjb3JkSWQuc2xpY2UoMCwgaW5kZXhPZkZpcnN0RGFzaCksXG4gICAgYWxsSWRzU2hhcmRJZCxcbiAgKTtcbn07XG5cbmNvbnN0IGdldE9yQ3JlYXRlU2hhcmRGaWxlID0gYXN5bmMgKGRhdGFzdG9yZSwgYWxsSWRzS2V5KSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGRhdGFzdG9yZS5sb2FkRmlsZShhbGxJZHNLZXkpO1xuICB9IGNhdGNoIChlTG9hZCkge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRmlsZShhbGxJZHNLZXksICcnKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9IGNhdGNoIChlQ3JlYXRlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBFcnJvciBsb2FkaW5nLCB0aGVuIGNyZWF0aW5nIGFsbElkcyAke2FsbElkc0tleVxuICAgICAgICB9IDogTE9BRCA6ICR7ZUxvYWQubWVzc2FnZVxuICAgICAgICB9IDogQ1JFQVRFIDogJHtlQ3JlYXRlfWAsXG4gICAgICApO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3QgZ2V0U2hhcmRGaWxlID0gYXN5bmMgKGRhdGFzdG9yZSwgYWxsSWRzS2V5KSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGRhdGFzdG9yZS5sb2FkRmlsZShhbGxJZHNLZXkpO1xuICB9IGNhdGNoIChlTG9hZCkge1xuICAgIHJldHVybiAnJztcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGFkZFRvQWxsSWRzID0gKGFwcEhpZXJhcmNoeSwgZGF0YXN0b3JlKSA9PiBhc3luYyAocmVjb3JkKSA9PiB7XG4gIGNvbnN0IGFsbElkc0tleSA9IGdldEFsbElkc1NoYXJkS2V5KFxuICAgIGFwcEhpZXJhcmNoeSxcbiAgICBnZXRQYXJlbnRLZXkocmVjb3JkLmtleSksXG4gICAgcmVjb3JkLmlkLFxuICApO1xuXG4gIGxldCBhbGxJZHMgPSBhd2FpdCBnZXRPckNyZWF0ZVNoYXJkRmlsZShkYXRhc3RvcmUsIGFsbElkc0tleSk7XG5cbiAgYWxsSWRzICs9IGAke2FsbElkcy5sZW5ndGggPiAwID8gJywnIDogJyd9JHtyZWNvcmQuaWR9YDtcblxuICBhd2FpdCBkYXRhc3RvcmUudXBkYXRlRmlsZShhbGxJZHNLZXksIGFsbElkcyk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsSWRzSXRlcmF0b3IgPSBhcHAgPT4gYXN5bmMgKGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXkpID0+IHtcbiAgY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSA9IHNhZmVLZXkoY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSk7XG4gIGNvbnN0IHRhcmdldE5vZGUgPSBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5KFxuICAgIGFwcC5oaWVyYXJjaHksXG4gICAgY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSxcbiAgKTtcblxuICBjb25zdCBnZXRBbGxJZHNJdGVyYXRvckZvckNvbGxlY3Rpb25LZXkgPSBhc3luYyAoY29sbGVjdGlvbktleSkgPT4ge1xuICAgIGNvbnN0IGFsbF9hbGxJZHNLZXlzID0gZ2V0QWxsSWRzU2hhcmROYW1lcyhhcHAuaGllcmFyY2h5LCBjb2xsZWN0aW9uS2V5KTtcbiAgICBsZXQgc2hhcmRJbmRleCA9IDA7XG5cbiAgICBjb25zdCBhbGxJZHNGcm9tU2hhcmRJdGVyYXRvciA9IGFzeW5jICgpID0+IHtcbiAgICAgIGlmIChzaGFyZEluZGV4ID09PSBhbGxfYWxsSWRzS2V5cy5sZW5ndGgpIHsgcmV0dXJuICh7IGRvbmU6IHRydWUsIHJlc3VsdDogeyBpZHM6IFtdLCBjb2xsZWN0aW9uS2V5IH0gfSk7IH1cblxuICAgICAgY29uc3Qgc2hhcmRLZXkgPSBhbGxfYWxsSWRzS2V5c1tzaGFyZEluZGV4XTtcblxuICAgICAgY29uc3QgYWxsSWRzID0gYXdhaXQgZ2V0QWxsSWRzRnJvbVNoYXJkKGFwcC5kYXRhc3RvcmUsIHNoYXJkS2V5KTtcblxuICAgICAgc2hhcmRJbmRleCsrO1xuXG4gICAgICByZXR1cm4gKHtcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgaWRzOiBhbGxJZHMsXG4gICAgICAgICAgY29sbGVjdGlvbktleSxcbiAgICAgICAgfSxcbiAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGFsbElkc0Zyb21TaGFyZEl0ZXJhdG9yO1xuICB9O1xuXG4gIGNvbnN0IGFuY2VzdG9ycyA9ICQoZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGFwcC5oaWVyYXJjaHkpLCBbXG4gICAgZmlsdGVyKGlzQ29sbGVjdGlvblJlY29yZCksXG4gICAgZmlsdGVyKG4gPT4gaXNBbmNlc3Rvcih0YXJnZXROb2RlKShuKVxuICAgICAgICAgICAgICAgICAgICB8fCBuLm5vZGVLZXkoKSA9PT0gdGFyZ2V0Tm9kZS5ub2RlS2V5KCkpLFxuICAgIG9yZGVyQnkoW24gPT4gbi5ub2RlS2V5KCkubGVuZ3RoXSwgWydhc2MnXSksXG4gIF0pOyAvLyBwYXJlbnRzIGZpcnN0XG5cbiAgY29uc3QgdHJhdmVyc2VGb3JJdGVyYXRlcmF0b3JzID0gYXN5bmMgKHBhcmVudFJlY29yZEtleSA9ICcnLCBjdXJyZW50Tm9kZUluZGV4ID0gMCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gYW5jZXN0b3JzW2N1cnJlbnROb2RlSW5kZXhdO1xuICAgIGNvbnN0IGN1cnJlbnRDb2xsZWN0aW9uS2V5ID0gam9pbktleShcbiAgICAgIHBhcmVudFJlY29yZEtleSxcbiAgICAgIGN1cnJlbnROb2RlLmNvbGxlY3Rpb25OYW1lLFxuICAgICk7XG4gICAgaWYgKGN1cnJlbnROb2RlLm5vZGVLZXkoKSA9PT0gdGFyZ2V0Tm9kZS5ub2RlS2V5KCkpIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yRm9yQ29sbGVjdGlvbktleShcbiAgICAgICAgICBjdXJyZW50Q29sbGVjdGlvbktleSxcbiAgICAgICAgKV07XG4gICAgfVxuICAgIGNvbnN0IGFsbEl0ZXJhdG9ycyA9IFtdO1xuICAgIGNvbnN0IGN1cnJlbnRJdGVyYXRvciA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yRm9yQ29sbGVjdGlvbktleShcbiAgICAgIGN1cnJlbnRDb2xsZWN0aW9uS2V5LFxuICAgICk7XG5cbiAgICBsZXQgaWRzID0gYXdhaXQgY3VycmVudEl0ZXJhdG9yKCk7XG4gICAgd2hpbGUgKGlkcy5kb25lID09PSBmYWxzZSkge1xuICAgICAgZm9yIChjb25zdCBpZCBvZiBpZHMucmVzdWx0Lmlkcykge1xuICAgICAgICBhbGxJdGVyYXRvcnMucHVzaChcbiAgICAgICAgICBhd2FpdCB0cmF2ZXJzZUZvckl0ZXJhdGVyYXRvcnMoXG4gICAgICAgICAgICBqb2luS2V5KGN1cnJlbnRDb2xsZWN0aW9uS2V5LCBpZCksXG4gICAgICAgICAgICBjdXJyZW50Tm9kZUluZGV4ICsgMSxcbiAgICAgICAgICApLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZHMgPSBhd2FpdCBjdXJyZW50SXRlcmF0b3IoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmxhdHRlbihhbGxJdGVyYXRvcnMpO1xuICB9O1xuXG4gIGNvbnN0IGl0ZXJhdG9yc0FycmF5ID0gYXdhaXQgdHJhdmVyc2VGb3JJdGVyYXRlcmF0b3JzKCk7XG4gIGxldCBjdXJyZW50SXRlcmF0b3JJbmRleCA9IDA7XG4gIHJldHVybiBhc3luYyAoKSA9PiB7XG4gICAgaWYgKGl0ZXJhdG9yc0FycmF5Lmxlbmd0aCA9PT0gMCkgeyByZXR1cm4geyBkb25lOiB0cnVlLCByZXN1bHQ6IFtdIH07IH1cbiAgICBjb25zdCBpbm5lclJlc3VsdCA9IGF3YWl0IGl0ZXJhdG9yc0FycmF5W2N1cnJlbnRJdGVyYXRvckluZGV4XSgpO1xuICAgIGlmICghaW5uZXJSZXN1bHQuZG9uZSkgeyByZXR1cm4gaW5uZXJSZXN1bHQ7IH1cbiAgICBpZiAoY3VycmVudEl0ZXJhdG9ySW5kZXggPT0gaXRlcmF0b3JzQXJyYXkubGVuZ3RoIC0gMSkge1xuICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgcmVzdWx0OiBpbm5lclJlc3VsdC5yZXN1bHQgfTtcbiAgICB9XG4gICAgY3VycmVudEl0ZXJhdG9ySW5kZXgrKztcbiAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgcmVzdWx0OiBpbm5lclJlc3VsdC5yZXN1bHQgfTtcbiAgfTtcbn07XG5cbmNvbnN0IGdldEFsbElkc0Zyb21TaGFyZCA9IGFzeW5jIChkYXRhc3RvcmUsIHNoYXJkS2V5KSA9PiB7XG4gIGNvbnN0IGFsbElkc1N0ciA9IGF3YWl0IGdldFNoYXJkRmlsZShkYXRhc3RvcmUsIHNoYXJkS2V5KTtcblxuICBjb25zdCBhbGxJZHMgPSBbXTtcbiAgbGV0IGN1cnJlbnRJZCA9ICcnO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbElkc1N0ci5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGN1cnJlbnRDaGFyID0gYWxsSWRzU3RyLmNoYXJBdChpKTtcbiAgICBjb25zdCBpc0xhc3QgPSAoaSA9PT0gYWxsSWRzU3RyLmxlbmd0aCAtIDEpO1xuICAgIGlmIChjdXJyZW50Q2hhciA9PT0gJywnIHx8IGlzTGFzdCkge1xuICAgICAgaWYgKGlzTGFzdCkgY3VycmVudElkICs9IGN1cnJlbnRDaGFyO1xuICAgICAgYWxsSWRzLnB1c2goY3VycmVudElkKTtcbiAgICAgIGN1cnJlbnRJZCA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50SWQgKz0gY3VycmVudENoYXI7XG4gICAgfVxuICB9XG4gIHJldHVybiBhbGxJZHM7XG59O1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlRnJvbUFsbElkcyA9IChhcHBIaWVyYXJjaHksIGRhdGFzdG9yZSkgPT4gYXN5bmMgKHJlY29yZCkgPT4ge1xuICBjb25zdCBzaGFyZEtleSA9IGdldEFsbElkc1NoYXJkS2V5KFxuICAgIGFwcEhpZXJhcmNoeSxcbiAgICBnZXRQYXJlbnRLZXkocmVjb3JkLmtleSksXG4gICAgcmVjb3JkLmlkLFxuICApO1xuICBjb25zdCBhbGxJZHMgPSBhd2FpdCBnZXRBbGxJZHNGcm9tU2hhcmQoZGF0YXN0b3JlLCBzaGFyZEtleSk7XG5cbiAgY29uc3QgbmV3SWRzID0gJChhbGxJZHMsIFtcbiAgICBwdWxsKHJlY29yZC5pZCksXG4gICAgam9pbignLCcpLFxuICBdKTtcblxuICBhd2FpdCBkYXRhc3RvcmUudXBkYXRlRmlsZShzaGFyZEtleSwgbmV3SWRzKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldEFsbElkc0l0ZXJhdG9yO1xuIiwiaW1wb3J0IHtcbiAgam9pbktleSwga2V5U2VwLCBnZXRIYXNoQ29kZSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldExhc3RQYXJ0SW5LZXkgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuXG5leHBvcnQgY29uc3QgVFJBTlNBQ1RJT05TX0ZPTERFUiA9IGAke2tleVNlcH0udHJhbnNhY3Rpb25zYDtcbmV4cG9ydCBjb25zdCBMT0NLX0ZJTEVOQU1FID0gJ2xvY2snO1xuZXhwb3J0IGNvbnN0IExPQ0tfRklMRV9LRVkgPSBqb2luS2V5KFxuICBUUkFOU0FDVElPTlNfRk9MREVSLCBMT0NLX0ZJTEVOQU1FLFxuKTtcbmV4cG9ydCBjb25zdCBpZFNlcCA9ICckJztcblxuY29uc3QgaXNPZlR5cGUgPSB0eXAgPT4gdHJhbnMgPT4gdHJhbnMudHJhbnNhY3Rpb25UeXBlID09PSB0eXA7XG5cbmV4cG9ydCBjb25zdCBDUkVBVEVfUkVDT1JEX1RSQU5TQUNUSU9OID0gJ2NyZWF0ZSc7XG5leHBvcnQgY29uc3QgVVBEQVRFX1JFQ09SRF9UUkFOU0FDVElPTiA9ICd1cGRhdGUnO1xuZXhwb3J0IGNvbnN0IERFTEVURV9SRUNPUkRfVFJBTlNBQ1RJT04gPSAnZGVsZXRlJztcbmV4cG9ydCBjb25zdCBCVUlMRF9JTkRFWF9UUkFOU0FDVElPTiA9ICdidWlsZCc7XG5cbmV4cG9ydCBjb25zdCBpc1VwZGF0ZSA9IGlzT2ZUeXBlKFVQREFURV9SRUNPUkRfVFJBTlNBQ1RJT04pO1xuZXhwb3J0IGNvbnN0IGlzRGVsZXRlID0gaXNPZlR5cGUoREVMRVRFX1JFQ09SRF9UUkFOU0FDVElPTik7XG5leHBvcnQgY29uc3QgaXNDcmVhdGUgPSBpc09mVHlwZShDUkVBVEVfUkVDT1JEX1RSQU5TQUNUSU9OKTtcbmV4cG9ydCBjb25zdCBpc0J1aWxkSW5kZXggPSBpc09mVHlwZShCVUlMRF9JTkRFWF9UUkFOU0FDVElPTik7XG5cbmV4cG9ydCBjb25zdCBrZXlUb0ZvbGRlck5hbWUgPSBub2RlS2V5ID0+IGdldEhhc2hDb2RlKG5vZGVLZXkpO1xuXG5leHBvcnQgY29uc3QgZ2V0VHJhbnNhY3Rpb25JZCA9IChyZWNvcmRJZCwgdHJhbnNhY3Rpb25UeXBlLCB1bmlxdWVJZCkgPT4gXG4gIGAke3JlY29yZElkfSR7aWRTZXB9JHt0cmFuc2FjdGlvblR5cGV9JHtpZFNlcH0ke3VuaXF1ZUlkfWA7XG5cbmV4cG9ydCBjb25zdCBidWlsZEluZGV4Rm9sZGVyID0gJy5CVUlMRC0nO1xuZXhwb3J0IGNvbnN0IG5vZGVLZXlIYXNoRnJvbUJ1aWxkRm9sZGVyID0gZm9sZGVyID0+IGZvbGRlci5yZXBsYWNlKGJ1aWxkSW5kZXhGb2xkZXIsICcnKTtcblxuZXhwb3J0IGNvbnN0IGlzQnVpbGRJbmRleEZvbGRlciA9IGtleSA9PiBnZXRMYXN0UGFydEluS2V5KGtleSkuc3RhcnRzV2l0aChidWlsZEluZGV4Rm9sZGVyKTtcblxuZXhwb3J0IGNvbnN0IEluZGV4Tm9kZUtleUZvbGRlciA9IGluZGV4Tm9kZUtleSA9PiBqb2luS2V5KFxuICBUUkFOU0FDVElPTlNfRk9MREVSLFxuICBidWlsZEluZGV4Rm9sZGVyICsga2V5VG9Gb2xkZXJOYW1lKGluZGV4Tm9kZUtleSksXG4pO1xuXG5leHBvcnQgY29uc3QgSW5kZXhOb2RlS2V5QmF0Y2hGb2xkZXIgPSAoaW5kZXhOb2RlS2V5LCBjb3VudCkgPT4gXG4gIGpvaW5LZXkoSW5kZXhOb2RlS2V5Rm9sZGVyKGluZGV4Tm9kZUtleSksIE1hdGguZmxvb3IoY291bnQgLyBCVUlMRElOREVYX0JBVENIX0NPVU5UKS50b1N0cmluZygpKTtcblxuZXhwb3J0IGNvbnN0IEluZGV4U2hhcmRLZXlGb2xkZXIgPSAoaW5kZXhOb2RlS2V5LCBpbmRleFNoYXJkS2V5KSA9PiBcbiAgam9pbktleShJbmRleE5vZGVLZXlGb2xkZXIoaW5kZXhOb2RlS2V5KSwgaW5kZXhTaGFyZEtleSk7XG5cbmV4cG9ydCBjb25zdCBCVUlMRElOREVYX0JBVENIX0NPVU5UID0gMTAwMDtcbmV4cG9ydCBjb25zdCB0aW1lb3V0TWlsbGlzZWNvbmRzID0gMzAgKiAxMDAwOyAvLyAzMCBzZWNzXG5leHBvcnQgY29uc3QgbWF4TG9ja1JldHJpZXMgPSAxO1xuIiwiaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcbmltcG9ydCB7IGpvaW5LZXkgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0TGFzdFBhcnRJbktleSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xuICBJbmRleE5vZGVLZXlGb2xkZXIsIEJVSUxESU5ERVhfQkFUQ0hfQ09VTlQsXG4gIEluZGV4Tm9kZUtleUJhdGNoRm9sZGVyLCBUUkFOU0FDVElPTlNfRk9MREVSLCBnZXRUcmFuc2FjdGlvbklkLCBDUkVBVEVfUkVDT1JEX1RSQU5TQUNUSU9OLCBVUERBVEVfUkVDT1JEX1RSQU5TQUNUSU9OLFxuICBERUxFVEVfUkVDT1JEX1RSQU5TQUNUSU9OLCBCVUlMRF9JTkRFWF9UUkFOU0FDVElPTixcbn0gZnJvbSAnLi90cmFuc2FjdGlvbnNDb21tb24nO1xuXG5cbmV4cG9ydCBjb25zdCB0cmFuc2FjdGlvbkZvckNyZWF0ZVJlY29yZCA9IGFzeW5jIChhcHAsIHJlY29yZCkgPT4gYXdhaXQgdHJhbnNhY3Rpb24oXG4gIGFwcC5kYXRhc3RvcmUsIENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04sXG4gIHJlY29yZC5rZXksIHsgcmVjb3JkIH0sXG4gIGdldFRyYW5zYWN0aW9uS2V5X1JlY29yZHMsXG4pO1xuXG5leHBvcnQgY29uc3QgdHJhbnNhY3Rpb25Gb3JVcGRhdGVSZWNvcmQgPSBhc3luYyAoYXBwLCBvbGRSZWNvcmQsIG5ld1JlY29yZCkgPT4gYXdhaXQgdHJhbnNhY3Rpb24oXG4gIGFwcC5kYXRhc3RvcmUsIFVQREFURV9SRUNPUkRfVFJBTlNBQ1RJT04sXG4gIG5ld1JlY29yZC5rZXksIHsgb2xkUmVjb3JkLCByZWNvcmQ6IG5ld1JlY29yZCB9LFxuICBnZXRUcmFuc2FjdGlvbktleV9SZWNvcmRzLFxuKTtcblxuZXhwb3J0IGNvbnN0IHRyYW5zYWN0aW9uRm9yRGVsZXRlUmVjb3JkID0gYXN5bmMgKGFwcCwgcmVjb3JkKSA9PiBhd2FpdCB0cmFuc2FjdGlvbihcbiAgYXBwLmRhdGFzdG9yZSwgREVMRVRFX1JFQ09SRF9UUkFOU0FDVElPTixcbiAgcmVjb3JkLmtleSwgeyByZWNvcmQgfSxcbiAgZ2V0VHJhbnNhY3Rpb25LZXlfUmVjb3Jkcyxcbik7XG5cbmV4cG9ydCBjb25zdCB0cmFuc2FjdGlvbkZvckJ1aWxkSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleE5vZGVLZXksIHJlY29yZEtleSwgY291bnQpID0+IHtcbiAgY29uc3QgdHJhbnNhY3Rpb25Gb2xkZXIgPSBJbmRleE5vZGVLZXlCYXRjaEZvbGRlcihpbmRleE5vZGVLZXksIGNvdW50KTtcbiAgaWYgKGNvdW50ICUgQlVJTERJTkRFWF9CQVRDSF9DT1VOVCA9PT0gMCkge1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlRm9sZGVyKHRyYW5zYWN0aW9uRm9sZGVyKTtcbiAgfVxuXG4gIHJldHVybiBhd2FpdCB0cmFuc2FjdGlvbihcbiAgICBhcHAuZGF0YXN0b3JlLCBCVUlMRF9JTkRFWF9UUkFOU0FDVElPTixcbiAgICByZWNvcmRLZXksIHsgcmVjb3JkS2V5IH0sXG4gICAgaWQgPT4gam9pbktleSh0cmFuc2FjdGlvbkZvbGRlciwgaWQpLFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUJ1aWxkSW5kZXhGb2xkZXIgPSBhc3luYyAoZGF0YXN0b3JlLCBpbmRleE5vZGVLZXkpID0+IGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoXG4gIEluZGV4Tm9kZUtleUZvbGRlcihpbmRleE5vZGVLZXkpLFxuKTtcblxuY29uc3QgZ2V0VHJhbnNhY3Rpb25LZXlfUmVjb3JkcyA9IGlkID0+IGpvaW5LZXkoVFJBTlNBQ1RJT05TX0ZPTERFUiwgaWQpO1xuXG5jb25zdCB0cmFuc2FjdGlvbiA9IGFzeW5jIChkYXRhc3RvcmUsIHRyYW5zYWN0aW9uVHlwZSwgcmVjb3JkS2V5LCBkYXRhLCBnZXRUcmFuc2FjdGlvbktleSkgPT4ge1xuICBjb25zdCByZWNvcmRJZCA9IGdldExhc3RQYXJ0SW5LZXkocmVjb3JkS2V5KTtcbiAgY29uc3QgdW5pcXVlSWQgPSBnZW5lcmF0ZSgpO1xuICBjb25zdCBpZCA9IGdldFRyYW5zYWN0aW9uSWQoXG4gICAgcmVjb3JkSWQsIHRyYW5zYWN0aW9uVHlwZSwgdW5pcXVlSWQsXG4gICk7XG5cbiAgY29uc3Qga2V5ID0gZ2V0VHJhbnNhY3Rpb25LZXkoaWQpO1xuXG4gIGNvbnN0IHRyYW5zID0ge1xuICAgIHRyYW5zYWN0aW9uVHlwZSxcbiAgICByZWNvcmRLZXksXG4gICAgLi4uZGF0YSxcbiAgICBpZCxcbiAgfTtcblxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlSnNvbihcbiAgICBrZXksIHRyYW5zLFxuICApO1xuXG4gIHJldHVybiB0cmFucztcbn07XG4iLCJpbXBvcnQgeyBpc1NoYXJkZWRJbmRleCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBqb2luS2V5IH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldFNoYXJkTWFwS2V5LCBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXksIGNyZWF0ZUluZGV4RmlsZSB9IGZyb20gJy4vc2hhcmRpbmcnO1xuXG5leHBvcnQgY29uc3QgaW5pdGlhbGlzZUluZGV4ID0gYXN5bmMgKGRhdGFzdG9yZSwgcGFyZW50S2V5LCBpbmRleCkgPT4ge1xuICBjb25zdCBpbmRleEtleSA9IGpvaW5LZXkocGFyZW50S2V5LCBpbmRleC5uYW1lKTtcblxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKGluZGV4S2V5KTtcblxuICBpZiAoaXNTaGFyZGVkSW5kZXgoaW5kZXgpKSB7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZpbGUoXG4gICAgICBnZXRTaGFyZE1hcEtleShpbmRleEtleSksXG4gICAgICAnW10nLFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgY3JlYXRlSW5kZXhGaWxlKFxuICAgICAgZGF0YXN0b3JlLFxuICAgICAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5KGluZGV4S2V5KSxcbiAgICAgIGluZGV4LFxuICAgICk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBjbG9uZURlZXAsXG4gIGZsYXR0ZW4sXG4gIG1hcCxcbiAgZmlsdGVyLFxuICBpc0VxdWFsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBpbml0aWFsaXNlQ2hpbGRDb2xsZWN0aW9ucyB9IGZyb20gJy4uL2NvbGxlY3Rpb25BcGkvaW5pdGlhbGlzZSc7XG5pbXBvcnQgeyB2YWxpZGF0ZSB9IGZyb20gJy4vdmFsaWRhdGUnO1xuaW1wb3J0IHsgX2xvYWQsIGdldFJlY29yZEZpbGVOYW1lIH0gZnJvbSAnLi9sb2FkJztcbmltcG9ydCB7XG4gIGFwaVdyYXBwZXIsIGV2ZW50cywgJCwgam9pbktleSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcbiAgaXNSZWNvcmQsXG4gIGdldE5vZGUsXG4gIGdldExhc3RQYXJ0SW5LZXksXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBtYXBSZWNvcmQgfSBmcm9tICcuLi9pbmRleGluZy9ldmFsdWF0ZSc7XG5pbXBvcnQgeyBsaXN0SXRlbXMgfSBmcm9tICcuLi9pbmRleEFwaS9saXN0SXRlbXMnO1xuaW1wb3J0IHsgYWRkVG9BbGxJZHMgfSBmcm9tICcuLi9pbmRleGluZy9hbGxJZHMnO1xuaW1wb3J0IHtcbiAgdHJhbnNhY3Rpb25Gb3JDcmVhdGVSZWNvcmQsXG4gIHRyYW5zYWN0aW9uRm9yVXBkYXRlUmVjb3JkLFxufSBmcm9tICcuLi90cmFuc2FjdGlvbnMvY3JlYXRlJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IGluaXRpYWxpc2VJbmRleCB9IGZyb20gJy4uL2luZGV4aW5nL2luaXRpYWxpc2VJbmRleCc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IHNhdmUgPSBhcHAgPT4gYXN5bmMgKHJlY29yZCwgY29udGV4dCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMucmVjb3JkQXBpLnNhdmUsXG4gIHJlY29yZC5pc05ld1xuICAgID8gcGVybWlzc2lvbi5jcmVhdGVSZWNvcmQuaXNBdXRob3JpemVkKHJlY29yZC5rZXkpXG4gICAgOiBwZXJtaXNzaW9uLnVwZGF0ZVJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkLmtleSksIHsgcmVjb3JkIH0sXG4gIF9zYXZlLCBhcHAsIHJlY29yZCwgY29udGV4dCwgZmFsc2UsXG4pO1xuXG5cbmV4cG9ydCBjb25zdCBfc2F2ZSA9IGFzeW5jIChhcHAsIHJlY29yZCwgY29udGV4dCwgc2tpcFZhbGlkYXRpb24gPSBmYWxzZSkgPT4ge1xuICBjb25zdCByZWNvcmRDbG9uZSA9IGNsb25lRGVlcChyZWNvcmQpO1xuICBpZiAoIXNraXBWYWxpZGF0aW9uKSB7XG4gICAgY29uc3QgdmFsaWRhdGlvblJlc3VsdCA9IGF3YWl0IHZhbGlkYXRlKGFwcCkocmVjb3JkQ2xvbmUsIGNvbnRleHQpO1xuICAgIGlmICghdmFsaWRhdGlvblJlc3VsdC5pc1ZhbGlkKSB7XG4gICAgICBhd2FpdCBhcHAucHVibGlzaChldmVudHMucmVjb3JkQXBpLnNhdmUub25JbnZhbGlkLCB7IHJlY29yZCwgdmFsaWRhdGlvblJlc3VsdCB9KTtcbiAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYFNhdmUgOiBSZWNvcmQgSW52YWxpZCA6ICR7XG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHZhbGlkYXRpb25SZXN1bHQuZXJyb3JzKX1gKTtcbiAgICB9XG4gIH1cblxuICBpZiAocmVjb3JkQ2xvbmUuaXNOZXcpIHtcbiAgICBhd2FpdCBhZGRUb0FsbElkcyhhcHAuaGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlKShyZWNvcmRDbG9uZSk7XG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSBhd2FpdCB0cmFuc2FjdGlvbkZvckNyZWF0ZVJlY29yZChcbiAgICAgIGFwcCwgcmVjb3JkQ2xvbmUsXG4gICAgKTtcbiAgICByZWNvcmRDbG9uZS50cmFuc2FjdGlvbklkID0gdHJhbnNhY3Rpb24uaWQ7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVGb2xkZXIocmVjb3JkQ2xvbmUua2V5KTtcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihcbiAgICAgIGpvaW5LZXkocmVjb3JkQ2xvbmUua2V5LCAnZmlsZXMnKSxcbiAgICApO1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlSnNvbihcbiAgICAgIGdldFJlY29yZEZpbGVOYW1lKHJlY29yZENsb25lLmtleSksXG4gICAgICByZWNvcmRDbG9uZSxcbiAgICApO1xuICAgIGF3YWl0IGluaXRpYWxpc2VSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyhhcHAsIHJlY29yZCk7XG4gICAgYXdhaXQgaW5pdGlhbGlzZUFuY2VzdG9ySW5kZXhlcyhhcHAsIHJlY29yZCk7XG4gICAgYXdhaXQgaW5pdGlhbGlzZUNoaWxkQ29sbGVjdGlvbnMoYXBwLCByZWNvcmRDbG9uZS5rZXkpO1xuICAgIGF3YWl0IGFwcC5wdWJsaXNoKGV2ZW50cy5yZWNvcmRBcGkuc2F2ZS5vblJlY29yZENyZWF0ZWQsIHtcbiAgICAgIHJlY29yZDogcmVjb3JkQ2xvbmUsXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgb2xkUmVjb3JkID0gYXdhaXQgX2xvYWQoYXBwLCByZWNvcmRDbG9uZS5rZXkpO1xuICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gYXdhaXQgdHJhbnNhY3Rpb25Gb3JVcGRhdGVSZWNvcmQoXG4gICAgICBhcHAsIG9sZFJlY29yZCwgcmVjb3JkQ2xvbmUsXG4gICAgKTtcbiAgICByZWNvcmRDbG9uZS50cmFuc2FjdGlvbklkID0gdHJhbnNhY3Rpb24uaWQ7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFxuICAgICAgZ2V0UmVjb3JkRmlsZU5hbWUocmVjb3JkQ2xvbmUua2V5KSxcbiAgICAgIHJlY29yZENsb25lLFxuICAgICk7XG4gICAgYXdhaXQgYXBwLnB1Ymxpc2goZXZlbnRzLnJlY29yZEFwaS5zYXZlLm9uUmVjb3JkVXBkYXRlZCwge1xuICAgICAgb2xkOiBvbGRSZWNvcmQsXG4gICAgICBuZXc6IHJlY29yZENsb25lLFxuICAgIH0pO1xuICB9XG5cbiAgYXdhaXQgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMoKTtcblxuICBjb25zdCByZXR1cm5lZENsb25lID0gY2xvbmVEZWVwKHJlY29yZENsb25lKTtcbiAgcmV0dXJuZWRDbG9uZS5pc05ldyA9IGZhbHNlO1xuICByZXR1cm4gcmV0dXJuZWRDbG9uZTtcbn07XG5cbmNvbnN0IGluaXRpYWxpc2VBbmNlc3RvckluZGV4ZXMgPSBhc3luYyAoYXBwLCByZWNvcmQpID0+IHtcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkocmVjb3JkLmtleSk7XG5cbiAgZm9yIChjb25zdCBpbmRleCBvZiByZWNvcmROb2RlLmluZGV4ZXMpIHtcbiAgICBjb25zdCBpbmRleEtleSA9IGpvaW5LZXkocmVjb3JkLmtleSwgaW5kZXgubmFtZSk7XG4gICAgaWYgKCFhd2FpdCBhcHAuZGF0YXN0b3JlLmV4aXN0cyhpbmRleEtleSkpIHsgYXdhaXQgaW5pdGlhbGlzZUluZGV4KGFwcC5kYXRhc3RvcmUsIHJlY29yZC5rZXksIGluZGV4KTsgfVxuICB9XG59O1xuXG5jb25zdCBpbml0aWFsaXNlUmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMgPSBhc3luYyAoYXBwLCByZWNvcmQpID0+IHtcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkocmVjb3JkLmtleSk7XG5cbiAgY29uc3QgaW5kZXhOb2RlcyA9ICQoZmllbGRzVGhhdFJlZmVyZW5jZVRoaXNSZWNvcmQoYXBwLCByZWNvcmROb2RlKSwgW1xuICAgIG1hcChmID0+ICQoZi50eXBlT3B0aW9ucy5yZXZlcnNlSW5kZXhOb2RlS2V5cywgW1xuICAgICAgbWFwKG4gPT4gZ2V0Tm9kZShcbiAgICAgICAgYXBwLmhpZXJhcmNoeSxcbiAgICAgICAgbixcbiAgICAgICkpLFxuICAgIF0pKSxcbiAgICBmbGF0dGVuLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IGluZGV4Tm9kZSBvZiBpbmRleE5vZGVzKSB7XG4gICAgYXdhaXQgaW5pdGlhbGlzZUluZGV4KFxuICAgICAgYXBwLmRhdGFzdG9yZSwgcmVjb3JkLmtleSwgaW5kZXhOb2RlLFxuICAgICk7XG4gIH1cbn07XG5cbmNvbnN0IGZpZWxkc1RoYXRSZWZlcmVuY2VUaGlzUmVjb3JkID0gKGFwcCwgcmVjb3JkTm9kZSkgPT4gJChhcHAuaGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmlsdGVyKGlzUmVjb3JkKSxcbiAgbWFwKG4gPT4gbi5maWVsZHMpLFxuICBmbGF0dGVuLFxuICBmaWx0ZXIoZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvTm9kZShyZWNvcmROb2RlKSksXG5dKTtcbiIsImltcG9ydCB7IGluY2x1ZGVzIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xuICBzYWZlS2V5LCBhcGlXcmFwcGVyLFxuICBldmVudHMsIGpvaW5LZXksXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBfZGVsZXRlUmVjb3JkIH0gZnJvbSAnLi4vcmVjb3JkQXBpL2RlbGV0ZSc7XG5pbXBvcnQgeyBnZXRBbGxJZHNJdGVyYXRvciwgZ2V0QWxsSWRzU2hhcmRLZXkgfSBmcm9tICcuLi9pbmRleGluZy9hbGxJZHMnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZGVsZXRlQ29sbGVjdGlvbiA9IChhcHAsIGRpc2FibGVDbGVhbnVwID0gZmFsc2UpID0+IGFzeW5jIGtleSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5jb2xsZWN0aW9uQXBpLmRlbGV0ZSxcbiAgcGVybWlzc2lvbi5tYW5hZ2VDb2xsZWN0aW9uLmlzQXV0aG9yaXplZCxcbiAgeyBrZXkgfSxcbiAgX2RlbGV0ZUNvbGxlY3Rpb24sIGFwcCwga2V5LCBkaXNhYmxlQ2xlYW51cCxcbik7XG5cblxuZXhwb3J0IGNvbnN0IF9kZWxldGVDb2xsZWN0aW9uID0gYXN5bmMgKGFwcCwga2V5LCBkaXNhYmxlQ2xlYW51cCkgPT4ge1xuICBrZXkgPSBzYWZlS2V5KGtleSk7XG4gIGNvbnN0IG5vZGUgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwLmhpZXJhcmNoeSkoa2V5KTtcblxuICBhd2FpdCBkZWxldGVSZWNvcmRzKGFwcCwga2V5KTtcbiAgYXdhaXQgZGVsZXRlQWxsSWRzRm9sZGVycyhhcHAsIG5vZGUsIGtleSk7XG4gIGF3YWl0IGRlbGV0ZUNvbGxlY3Rpb25Gb2xkZXIoYXBwLCBrZXkpO1xuICBpZiAoIWRpc2FibGVDbGVhbnVwKSB7IGF3YWl0IGFwcC5jbGVhbnVwVHJhbnNhY3Rpb25zKCk7IH1cbn07XG5cbmNvbnN0IGRlbGV0ZUNvbGxlY3Rpb25Gb2xkZXIgPSBhc3luYyAoYXBwLCBrZXkpID0+IGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKGtleSk7XG5cblxuY29uc3QgZGVsZXRlQWxsSWRzRm9sZGVycyA9IGFzeW5jIChhcHAsIG5vZGUsIGtleSkgPT4ge1xuICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihcbiAgICBqb2luS2V5KFxuICAgICAga2V5LCAnYWxsaWRzJyxcbiAgICAgIG5vZGUubm9kZUlkLFxuICAgICksXG4gICk7XG5cbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoXG4gICAgam9pbktleShrZXksICdhbGxpZHMnKSxcbiAgKTtcbn07XG5cbmNvbnN0IGRlbGV0ZVJlY29yZHMgPSBhc3luYyAoYXBwLCBrZXkpID0+IHtcbiAgY29uc3QgZGVsZXRlZEFsbElkc1NoYXJkcyA9IFtdO1xuICBjb25zdCBkZWxldGVBbGxJZHNTaGFyZCA9IGFzeW5jIChyZWNvcmRJZCkgPT4ge1xuICAgIGNvbnN0IHNoYXJkS2V5ID0gZ2V0QWxsSWRzU2hhcmRLZXkoXG4gICAgICBhcHAuaGllcmFyY2h5LCBrZXksIHJlY29yZElkLFxuICAgICk7XG5cbiAgICBpZiAoaW5jbHVkZXMoc2hhcmRLZXkpKGRlbGV0ZWRBbGxJZHNTaGFyZHMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZGVsZXRlZEFsbElkc1NoYXJkcy5wdXNoKHNoYXJkS2V5KTtcblxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShzaGFyZEtleSk7XG4gIH07XG5cbiAgY29uc3QgaXRlcmF0ZSA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yKGFwcCkoa2V5KTtcblxuICBsZXQgaWRzID0gYXdhaXQgaXRlcmF0ZSgpO1xuICB3aGlsZSAoIWlkcy5kb25lKSB7XG4gICAgaWYgKGlkcy5yZXN1bHQuY29sbGVjdGlvbktleSA9PT0ga2V5KSB7XG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIGlkcy5yZXN1bHQuaWRzKSB7XG4gICAgICAgIGF3YWl0IF9kZWxldGVSZWNvcmQoXG4gICAgICAgICAgYXBwLFxuICAgICAgICAgIGpvaW5LZXkoa2V5LCBpZCksXG4gICAgICAgICAgdHJ1ZSxcbiAgICAgICAgKTtcbiAgICAgICAgYXdhaXQgZGVsZXRlQWxsSWRzU2hhcmQoaWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlkcyA9IGF3YWl0IGl0ZXJhdGUoKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIHRyeUF3YWl0T3JJZ25vcmUsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBpc0luZGV4LCBpc1NoYXJkZWRJbmRleCxcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7XG4gIGdldEFsbFNoYXJkS2V5cywgZ2V0U2hhcmRNYXBLZXksXG4gIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSxcbn0gZnJvbSAnLi4vaW5kZXhpbmcvc2hhcmRpbmcnO1xuXG5leHBvcnQgY29uc3QgX2RlbGV0ZUluZGV4ID0gYXN5bmMgKGFwcCwgaW5kZXhLZXksIGluY2x1ZGVGb2xkZXIpID0+IHtcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShpbmRleEtleSk7XG5cbiAgaWYgKCFpc0luZGV4KGluZGV4Tm9kZSkpIHsgdGhyb3cgbmV3IEVycm9yKCdTdXBwbGllZCBrZXkgaXMgbm90IGFuIGluZGV4Jyk7IH1cblxuICBpZiAoaXNTaGFyZGVkSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIGNvbnN0IHNoYXJkS2V5cyA9IGF3YWl0IGdldEFsbFNoYXJkS2V5cyhhcHAsIGluZGV4S2V5KTtcbiAgICBmb3IgKGNvbnN0IGsgb2Ygc2hhcmRLZXlzKSB7XG4gICAgICBhd2FpdCB0cnlBd2FpdE9ySWdub3JlKFxuICAgICAgICBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoayksXG4gICAgICApO1xuICAgIH1cbiAgICB0cnlBd2FpdE9ySWdub3JlKFxuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKFxuICAgICAgICBnZXRTaGFyZE1hcEtleShpbmRleEtleSksXG4gICAgICApLFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgdHJ5QXdhaXRPcklnbm9yZShcbiAgICAgIGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShcbiAgICAgICAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5KGluZGV4S2V5KSxcbiAgICAgICksXG4gICAgKTtcbiAgfVxuXG4gIGlmIChpbmNsdWRlRm9sZGVyKSB7XG4gICAgdHJ5QXdhaXRPcklnbm9yZShcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKGluZGV4S2V5KSxcbiAgICApO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgc2FmZUtleSwgYXBpV3JhcHBlcixcbiAgZXZlbnRzLCBqb2luS2V5LFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgX2xvYWQsIGdldFJlY29yZEZpbGVOYW1lIH0gZnJvbSAnLi9sb2FkJztcbmltcG9ydCB7IF9kZWxldGVDb2xsZWN0aW9uIH0gZnJvbSAnLi4vY29sbGVjdGlvbkFwaS9kZWxldGUnO1xuaW1wb3J0IHtcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LCBnZXROb2RlLFxuICBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlLFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgX2RlbGV0ZUluZGV4IH0gZnJvbSAnLi4vaW5kZXhBcGkvZGVsZXRlJztcbmltcG9ydCB7IHRyYW5zYWN0aW9uRm9yRGVsZXRlUmVjb3JkIH0gZnJvbSAnLi4vdHJhbnNhY3Rpb25zL2NyZWF0ZSc7XG5pbXBvcnQgeyByZW1vdmVGcm9tQWxsSWRzIH0gZnJvbSAnLi4vaW5kZXhpbmcvYWxsSWRzJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGRlbGV0ZVJlY29yZCA9IChhcHAsIGRpc2FibGVDbGVhbnVwID0gZmFsc2UpID0+IGFzeW5jIGtleSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5yZWNvcmRBcGkuZGVsZXRlLFxuICBwZXJtaXNzaW9uLmRlbGV0ZVJlY29yZC5pc0F1dGhvcml6ZWQoa2V5KSxcbiAgeyBrZXkgfSxcbiAgX2RlbGV0ZVJlY29yZCwgYXBwLCBrZXksIGRpc2FibGVDbGVhbnVwLFxuKTtcblxuLy8gY2FsbGVkIGRlbGV0ZVJlY29yZCBiZWNhdXNlIGRlbGV0ZSBpcyBhIGtleXdvcmRcbmV4cG9ydCBjb25zdCBfZGVsZXRlUmVjb3JkID0gYXN5bmMgKGFwcCwga2V5LCBkaXNhYmxlQ2xlYW51cCkgPT4ge1xuICBrZXkgPSBzYWZlS2V5KGtleSk7XG4gIGNvbnN0IG5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKGtleSk7XG5cbiAgY29uc3QgcmVjb3JkID0gYXdhaXQgX2xvYWQoYXBwLCBrZXkpO1xuICBhd2FpdCB0cmFuc2FjdGlvbkZvckRlbGV0ZVJlY29yZChhcHAsIHJlY29yZCk7XG5cbiAgZm9yIChjb25zdCBjb2xsZWN0aW9uUmVjb3JkIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICBjb25zdCBjb2xsZWN0aW9uS2V5ID0gam9pbktleShcbiAgICAgIGtleSwgY29sbGVjdGlvblJlY29yZC5jb2xsZWN0aW9uTmFtZSxcbiAgICApO1xuICAgIGF3YWl0IF9kZWxldGVDb2xsZWN0aW9uKGFwcCwgY29sbGVjdGlvbktleSwgdHJ1ZSk7XG4gIH1cblxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoXG4gICAgZ2V0UmVjb3JkRmlsZU5hbWUoa2V5KSxcbiAgKTtcblxuICBhd2FpdCBkZWxldGVGaWxlcyhhcHAsIGtleSk7XG5cbiAgYXdhaXQgcmVtb3ZlRnJvbUFsbElkcyhhcHAuaGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlKShyZWNvcmQpO1xuXG4gIGlmICghZGlzYWJsZUNsZWFudXApIHsgYXdhaXQgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMoKTsgfVxuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKGtleSk7XG4gIGF3YWl0IGRlbGV0ZUluZGV4ZXMoYXBwLCBrZXkpO1xufTtcblxuY29uc3QgZGVsZXRlSW5kZXhlcyA9IGFzeW5jIChhcHAsIGtleSkgPT4ge1xuICBjb25zdCBub2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShrZXkpO1xuICAvKiBjb25zdCByZXZlcnNlSW5kZXhLZXlzID0gJChhcHAuaGllcmFyY2h5LCBbXG4gICAgICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgICAgICAgbWFwKG4gPT4gbi5maWVsZHMpLFxuICAgICAgICBmbGF0dGVuLFxuICAgICAgICBmaWx0ZXIoaXNTb21ldGhpbmcpLFxuICAgICAgICBmaWx0ZXIoZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvTm9kZShub2RlKSksXG4gICAgICAgIG1hcChmID0+ICQoZi50eXBlT3B0aW9ucy5yZXZlcnNlSW5kZXhOb2RlS2V5cywgW1xuICAgICAgICAgICAgICAgICAgICBtYXAobiA9PiBnZXROb2RlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAuaGllcmFyY2h5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuKSlcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICApLFxuICAgICAgICBmbGF0dGVuLFxuICAgICAgICBtYXAobiA9PiBqb2luS2V5KGtleSwgbi5uYW1lKSlcbiAgICBdKTtcblxuICAgIGZvcihsZXQgaSBvZiByZXZlcnNlSW5kZXhLZXlzKSB7XG4gICAgICAgIGF3YWl0IF9kZWxldGVJbmRleChhcHAsIGksIHRydWUpO1xuICAgIH0gKi9cblxuXG4gIGZvciAoY29uc3QgaW5kZXggb2Ygbm9kZS5pbmRleGVzKSB7XG4gICAgY29uc3QgaW5kZXhLZXkgPSBqb2luS2V5KGtleSwgaW5kZXgubmFtZSk7XG4gICAgYXdhaXQgX2RlbGV0ZUluZGV4KGFwcCwgaW5kZXhLZXksIHRydWUpO1xuICB9XG59O1xuXG5jb25zdCBkZWxldGVGaWxlcyA9IGFzeW5jIChhcHAsIGtleSkgPT4ge1xuICBjb25zdCBmaWxlc0ZvbGRlciA9IGpvaW5LZXkoa2V5LCAnZmlsZXMnKTtcbiAgY29uc3QgYWxsRmlsZXMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZvbGRlckNvbnRlbnRzKFxuICAgIGZpbGVzRm9sZGVyLFxuICApO1xuXG4gIGZvciAoY29uc3QgZmlsZSBvZiBhbGxGaWxlcykge1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShmaWxlKTtcbiAgfVxuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKFxuICAgIGpvaW5LZXkoa2V5LCAnZmlsZXMnKSxcbiAgKTtcbn07XG4iLCJpbXBvcnQge1xuICBpbmNsdWRlcywgZmlsdGVyLFxuICBtYXAsIHNvbWUsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHsgX2xvYWQgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IHtcbiAgYXBpV3JhcHBlciwgZXZlbnRzLCBzcGxpdEtleSxcbiAgJCwgam9pbktleSwgaXNOb3RoaW5nLCB0cnlBd2FpdE9ySWdub3JlLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0RXhhY3ROb2RlRm9yUGF0aCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBpc0xlZ2FsRmlsZW5hbWUgfSBmcm9tICcuLi90eXBlcy9maWxlJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciwgRm9yYmlkZGVuRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IHVwbG9hZEZpbGUgPSBhcHAgPT4gYXN5bmMgKHJlY29yZEtleSwgcmVhZGFibGVTdHJlYW0sIHJlbGF0aXZlRmlsZVBhdGgpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLnJlY29yZEFwaS51cGxvYWRGaWxlLFxuICBwZXJtaXNzaW9uLnVwZGF0ZVJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkS2V5KSxcbiAgeyByZWNvcmRLZXksIHJlYWRhYmxlU3RyZWFtLCByZWxhdGl2ZUZpbGVQYXRoIH0sXG4gIF91cGxvYWRGaWxlLCBhcHAsIHJlY29yZEtleSwgcmVhZGFibGVTdHJlYW0sIHJlbGF0aXZlRmlsZVBhdGgsXG4pO1xuXG5jb25zdCBfdXBsb2FkRmlsZSA9IGFzeW5jIChhcHAsIHJlY29yZEtleSwgcmVhZGFibGVTdHJlYW0sIHJlbGF0aXZlRmlsZVBhdGgpID0+IHtcbiAgaWYgKGlzTm90aGluZyhyZWNvcmRLZXkpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ1JlY29yZCBLZXkgbm90IHN1cHBsaWVkJyk7IH1cbiAgaWYgKGlzTm90aGluZyhyZWxhdGl2ZUZpbGVQYXRoKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdmaWxlIHBhdGggbm90IHN1cHBsaWVkJyk7IH1cbiAgaWYgKCFpc0xlZ2FsRmlsZW5hbWUocmVsYXRpdmVGaWxlUGF0aCkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignSWxsZWdhbCBmaWxlbmFtZScpOyB9XG5cbiAgY29uc3QgcmVjb3JkID0gYXdhaXQgX2xvYWQoYXBwLCByZWNvcmRLZXkpO1xuXG4gIGNvbnN0IGZ1bGxGaWxlUGF0aCA9IHNhZmVHZXRGdWxsRmlsZVBhdGgoXG4gICAgcmVjb3JkS2V5LCByZWxhdGl2ZUZpbGVQYXRoLFxuICApO1xuXG4gIGNvbnN0IHRlbXBGaWxlUGF0aCA9IGAke2Z1bGxGaWxlUGF0aH1fJHtnZW5lcmF0ZSgpfS50ZW1wYDtcblxuICBjb25zdCBvdXRwdXRTdHJlYW0gPSBhd2FpdCBhcHAuZGF0YXN0b3JlLndyaXRhYmxlRmlsZVN0cmVhbShcbiAgICB0ZW1wRmlsZVBhdGgsXG4gICk7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCkgPT4ge1xuICAgIHJlYWRhYmxlU3RyZWFtLnBpcGUob3V0cHV0U3RyZWFtKTtcbiAgICBvdXRwdXRTdHJlYW0ub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICBvdXRwdXRTdHJlYW0ub24oJ2ZpbmlzaCcsIHJlc29sdmUpO1xuICB9KVxuICAudGhlbigoKSA9PiBhcHAuZGF0YXN0b3JlLmdldEZpbGVTaXplKHRlbXBGaWxlUGF0aCkpXG4gIC50aGVuKHNpemUgPT4ge1xuICAgIGNvbnN0IGlzRXhwZWN0ZWRGaWxlU2l6ZSA9IGNoZWNrRmlsZVNpemVBZ2FpbnN0RmllbGRzKFxuICAgICAgYXBwLCByZWNvcmQsIHJlbGF0aXZlRmlsZVBhdGgsIHNpemVcbiAgICApOyAgXG4gICAgaWYgKCFpc0V4cGVjdGVkRmlsZVNpemUpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgRmllbGRzIGZvciAke3JlbGF0aXZlRmlsZVBhdGh9IGRvIG5vdCBoYXZlIGV4cGVjdGVkIHNpemU6ICR7am9pbignLCcpKGluY29ycmVjdEZpZWxkcyl9YCk7IH0gIFxuXG4gIH0pXG4gIC50aGVuKCgpID0+IHRyeUF3YWl0T3JJZ25vcmUoYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlLCBmdWxsRmlsZVBhdGgpKVxuICAudGhlbigoKSA9PiBhcHAuZGF0YXN0b3JlLnJlbmFtZUZpbGUodGVtcEZpbGVQYXRoLCBmdWxsRmlsZVBhdGgpKTtcblxuICAvKlxuICByZWFkYWJsZVN0cmVhbS5waXBlKG91dHB1dFN0cmVhbSk7XG5cbiAgYXdhaXQgbmV3IFByb21pc2UoZnVsZmlsbCA9PiBvdXRwdXRTdHJlYW0ub24oJ2ZpbmlzaCcsIGZ1bGZpbGwpKTtcblxuICBjb25zdCBpc0V4cGVjdGVkRmlsZVNpemUgPSBjaGVja0ZpbGVTaXplQWdhaW5zdEZpZWxkcyhcbiAgICBhcHAsXG4gICAgcmVjb3JkLCByZWxhdGl2ZUZpbGVQYXRoLFxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0RmlsZVNpemUodGVtcEZpbGVQYXRoKSxcbiAgKTtcblxuICBpZiAoIWlzRXhwZWN0ZWRGaWxlU2l6ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBGaWVsZHMgZm9yICR7cmVsYXRpdmVGaWxlUGF0aH0gZG8gbm90IGhhdmUgZXhwZWN0ZWQgc2l6ZWApO1xuICB9XG5cbiAgYXdhaXQgdHJ5QXdhaXRPcklnbm9yZShhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUsIGZ1bGxGaWxlUGF0aCk7XG5cbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS5yZW5hbWVGaWxlKHRlbXBGaWxlUGF0aCwgZnVsbEZpbGVQYXRoKTtcbiAgKi9cbn07XG5cbmNvbnN0IGNoZWNrRmlsZVNpemVBZ2FpbnN0RmllbGRzID0gKGFwcCwgcmVjb3JkLCByZWxhdGl2ZUZpbGVQYXRoLCBleHBlY3RlZFNpemUpID0+IHtcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkocmVjb3JkLmtleSk7XG5cbiAgY29uc3QgaW5jb3JyZWN0RmlsZUZpZWxkcyA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBmaWx0ZXIoZiA9PiBmLnR5cGUgPT09ICdmaWxlJ1xuICAgICAgJiYgcmVjb3JkW2YubmFtZV0ucmVsYXRpdmVQYXRoID09PSByZWxhdGl2ZUZpbGVQYXRoXG4gICAgICAmJiByZWNvcmRbZi5uYW1lXS5zaXplICE9PSBleHBlY3RlZFNpemUpLFxuICAgIG1hcChmID0+IGYubmFtZSksXG4gIF0pO1xuXG4gIGNvbnN0IGluY29ycmVjdEZpbGVBcnJheUZpZWxkcyA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBmaWx0ZXIoYSA9PiBhLnR5cGUgPT09ICdhcnJheTxmaWxlPidcbiAgICAgICYmICQocmVjb3JkW2EubmFtZV0sIFtcbiAgICAgICAgc29tZShmID0+IHJlY29yZFtmLm5hbWVdLnJlbGF0aXZlUGF0aCA9PT0gcmVsYXRpdmVGaWxlUGF0aFxuICAgICAgICAgICYmIHJlY29yZFtmLm5hbWVdLnNpemUgIT09IGV4cGVjdGVkU2l6ZSksXG4gICAgICBdKSksXG4gICAgbWFwKGYgPT4gZi5uYW1lKSxcbiAgXSk7XG5cbiAgY29uc3QgaW5jb3JyZWN0RmllbGRzID0gW1xuICAgIC4uLmluY29ycmVjdEZpbGVGaWVsZHMsXG4gICAgLi4uaW5jb3JyZWN0RmlsZUFycmF5RmllbGRzLFxuICBdO1xuXG4gIGlmIChpbmNvcnJlY3RGaWVsZHMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuZXhwb3J0IGNvbnN0IHNhZmVHZXRGdWxsRmlsZVBhdGggPSAocmVjb3JkS2V5LCByZWxhdGl2ZUZpbGVQYXRoKSA9PiB7XG4gIGNvbnN0IG5hdWdodHlVc2VyID0gKCkgPT4geyB0aHJvdyBuZXcgRm9yYmlkZGVuRXJyb3IoJ25hdWdodHkgbmF1Z2h0eScpOyB9O1xuXG4gIGlmIChyZWxhdGl2ZUZpbGVQYXRoLnN0YXJ0c1dpdGgoJy4uJykpIG5hdWdodHlVc2VyKCk7XG5cbiAgY29uc3QgcGF0aFBhcnRzID0gc3BsaXRLZXkocmVsYXRpdmVGaWxlUGF0aCk7XG5cbiAgaWYgKGluY2x1ZGVzKCcuLicpKHBhdGhQYXJ0cykpIG5hdWdodHlVc2VyKCk7XG5cbiAgY29uc3QgcmVjb3JkS2V5UGFydHMgPSBzcGxpdEtleShyZWNvcmRLZXkpO1xuXG4gIGNvbnN0IGZ1bGxQYXRoUGFydHMgPSBbXG4gICAgLi4ucmVjb3JkS2V5UGFydHMsXG4gICAgJ2ZpbGVzJyxcbiAgICAuLi5maWx0ZXIocCA9PiBwICE9PSAnLicpKHBhdGhQYXJ0cyksXG4gIF07XG5cbiAgcmV0dXJuIGpvaW5LZXkoZnVsbFBhdGhQYXJ0cyk7XG59O1xuIiwiaW1wb3J0IHsgYXBpV3JhcHBlciwgZXZlbnRzLCBpc05vdGhpbmcgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgc2FmZUdldEZ1bGxGaWxlUGF0aCB9IGZyb20gJy4vdXBsb2FkRmlsZSc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGRvd25sb2FkRmlsZSA9IGFwcCA9PiBhc3luYyAocmVjb3JkS2V5LCByZWxhdGl2ZVBhdGgpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLnJlY29yZEFwaS51cGxvYWRGaWxlLFxuICBwZXJtaXNzaW9uLnJlYWRSZWNvcmQuaXNBdXRob3JpemVkKHJlY29yZEtleSksXG4gIHsgcmVjb3JkS2V5LCByZWxhdGl2ZVBhdGggfSwvL3JlbW92ZSBkdXBlIGtleSAncmVjb3JkS2V5JyBmcm9tIG9iamVjdFxuICBfZG93bmxvYWRGaWxlLCBhcHAsIHJlY29yZEtleSwgcmVsYXRpdmVQYXRoLFxuKTsgXG5cblxuY29uc3QgX2Rvd25sb2FkRmlsZSA9IGFzeW5jIChhcHAsIHJlY29yZEtleSwgcmVsYXRpdmVQYXRoKSA9PiB7XG4gIGlmIChpc05vdGhpbmcocmVjb3JkS2V5KSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdSZWNvcmQgS2V5IG5vdCBzdXBwbGllZCcpOyB9XG4gIGlmIChpc05vdGhpbmcocmVsYXRpdmVQYXRoKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdmaWxlIHBhdGggbm90IHN1cHBsaWVkJyk7IH1cblxuICByZXR1cm4gYXdhaXQgYXBwLmRhdGFzdG9yZS5yZWFkYWJsZUZpbGVTdHJlYW0oXG4gICAgc2FmZUdldEZ1bGxGaWxlUGF0aChcbiAgICAgIHJlY29yZEtleSwgcmVsYXRpdmVQYXRoLFxuICAgICksXG4gICk7XG59O1xuIiwiaW1wb3J0IHsgZmluZCwgdGFrZSwgdW5pb24gfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2V0RmxhdHRlbmVkSGllcmFyY2h5IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7ICQsIHNwbGl0S2V5LCBqb2luS2V5IH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGN1c3RvbUlkID0gYXBwID0+IChub2RlTmFtZSwgaWQpID0+IHtcbiAgY29uc3Qgbm9kZSA9ICQoYXBwLmhpZXJhcmNoeSwgW1xuICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgICBmaW5kKG4gPT4gbi5uYW1lID09PSBub2RlTmFtZSksXG4gIF0pO1xuXG4gIGlmICghbm9kZSkgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoYENhbm5vdCBmaW5kIG5vZGUgJHtub2RlTmFtZX1gKTtcblxuICByZXR1cm4gYCR7bm9kZS5ub2RlSWR9LSR7aWR9YDtcbn07XG5cbmV4cG9ydCBjb25zdCBzZXRDdXN0b21JZCA9IGFwcCA9PiAocmVjb3JkLCBpZCkgPT4ge1xuICByZWNvcmQuaWQgPSBjdXN0b21JZChhcHApKHJlY29yZC50eXBlLCBpZCk7XG5cbiAgY29uc3Qga2V5UGFydHMgPSBzcGxpdEtleShyZWNvcmQua2V5KTtcblxuICByZWNvcmQua2V5ID0gJChrZXlQYXJ0cywgW1xuICAgIHRha2Uoa2V5UGFydHMubGVuZ3RoIC0gMSksXG4gICAgdW5pb24oW3JlY29yZC5pZF0pLFxuICAgIGpvaW5LZXksXG4gIF0pO1xuXG4gIHJldHVybiByZWNvcmQ7XG59O1xuIiwiaW1wb3J0IHsgZ2V0TmV3LCBnZXROZXdDaGlsZCB9IGZyb20gJy4vZ2V0TmV3JztcbmltcG9ydCB7IGxvYWQgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IHsgdmFsaWRhdGUgfSBmcm9tICcuL3ZhbGlkYXRlJztcbmltcG9ydCB7IGdldENvbnRleHQgfSBmcm9tICcuL2dldENvbnRleHQnO1xuaW1wb3J0IHsgc2F2ZSB9IGZyb20gJy4vc2F2ZSc7XG5pbXBvcnQgeyBkZWxldGVSZWNvcmQgfSBmcm9tICcuL2RlbGV0ZSc7XG5pbXBvcnQgeyB1cGxvYWRGaWxlIH0gZnJvbSAnLi91cGxvYWRGaWxlJztcbmltcG9ydCB7IGRvd25sb2FkRmlsZSB9IGZyb20gJy4vZG93bmxvYWRGaWxlJztcbmltcG9ydCB7IGN1c3RvbUlkLCBzZXRDdXN0b21JZCB9IGZyb20gJy4vY3VzdG9tSWQnO1xuXG5jb25zdCBhcGkgPSBhcHAgPT4gKHtcbiAgZ2V0TmV3OiBnZXROZXcoYXBwKSxcbiAgZ2V0TmV3Q2hpbGQ6IGdldE5ld0NoaWxkKGFwcCksXG4gIHNhdmU6IHNhdmUoYXBwKSxcbiAgbG9hZDogbG9hZChhcHApLFxuICBkZWxldGU6IGRlbGV0ZVJlY29yZChhcHAsIGZhbHNlKSxcbiAgdmFsaWRhdGU6IHZhbGlkYXRlKGFwcCksXG4gIGdldENvbnRleHQ6IGdldENvbnRleHQoYXBwKSxcbiAgdXBsb2FkRmlsZTogdXBsb2FkRmlsZShhcHApLFxuICBkb3dubG9hZEZpbGU6IGRvd25sb2FkRmlsZShhcHApLFxuICBjdXN0b21JZDogY3VzdG9tSWQoYXBwKSxcbiAgc2V0Q3VzdG9tSWQ6IHNldEN1c3RvbUlkKGFwcCksXG59KTtcblxuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkQXBpID0gYXBwID0+IGFwaShhcHApO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRSZWNvcmRBcGk7XG4iLCJpbXBvcnQgeyBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHtcbiAgaXNOb3RoaW5nLCBzYWZlS2V5LCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsb3dlZFJlY29yZFR5cGVzID0gYXBwID0+IGtleSA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuY29sbGVjdGlvbkFwaS5nZXRBbGxvd2VkUmVjb3JkVHlwZXMsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsga2V5IH0sXG4gIF9nZXRBbGxvd2VkUmVjb3JkVHlwZXMsIGFwcCwga2V5LFxuKTtcblxuY29uc3QgX2dldEFsbG93ZWRSZWNvcmRUeXBlcyA9IChhcHAsIGtleSkgPT4ge1xuICBrZXkgPSBzYWZlS2V5KGtleSk7XG4gIGNvbnN0IG5vZGUgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwLmhpZXJhcmNoeSkoa2V5KTtcbiAgcmV0dXJuIGlzTm90aGluZyhub2RlKSA/IFtdIDogW25vZGUubmFtZV07XG59O1xuIiwiaW1wb3J0IHsgZ2V0QWxsSWRzSXRlcmF0b3IgfSBmcm9tICcuLi9pbmRleGluZy9hbGxJZHMnO1xuaW1wb3J0IHsgZ2V0QWxsb3dlZFJlY29yZFR5cGVzIH0gZnJvbSAnLi9nZXRBbGxvd2VkUmVjb3JkVHlwZXMnO1xuaW1wb3J0IHsgZGVsZXRlQ29sbGVjdGlvbiB9IGZyb20gJy4vZGVsZXRlJztcblxuZXhwb3J0IGNvbnN0IGdldENvbGxlY3Rpb25BcGkgPSBhcHAgPT4gKHtcbiAgZ2V0QWxsb3dlZFJlY29yZFR5cGVzOiBnZXRBbGxvd2VkUmVjb3JkVHlwZXMoYXBwKSxcbiAgZ2V0QWxsSWRzSXRlcmF0b3I6IGdldEFsbElkc0l0ZXJhdG9yKGFwcCksXG4gIGRlbGV0ZTogZGVsZXRlQ29sbGVjdGlvbihhcHApLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGdldENvbGxlY3Rpb25BcGk7XG4iLCJpbXBvcnQge1xuICBmaW5kLCBmaWx0ZXIsIFxuICBpbmNsdWRlcywgc29tZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdldEFsbElkc0l0ZXJhdG9yIH0gZnJvbSAnLi4vaW5kZXhpbmcvYWxsSWRzJztcbmltcG9ydCB7XG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSwgZ2V0UmVjb3JkTm9kZUJ5SWQsXG4gIGdldENvbGxlY3Rpb25Ob2RlQnlLZXlPck5vZGVLZXksIGdldE5vZGUsIGlzSW5kZXgsXG4gIGlzUmVjb3JkLCBpc0RlY2VuZGFudCwgZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgsXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4LFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHtcbiAgam9pbktleSwgYXBpV3JhcHBlciwgZXZlbnRzLCAkLCBhbGxUcnVlLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgY3JlYXRlQnVpbGRJbmRleEZvbGRlcixcbiAgdHJhbnNhY3Rpb25Gb3JCdWlsZEluZGV4LFxufSBmcm9tICcuLi90cmFuc2FjdGlvbnMvY3JlYXRlJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5cbi8qKiByZWJ1aWxkcyBhbiBpbmRleFxuICogQHBhcmFtIHtvYmplY3R9IGFwcCAtIHRoZSBhcHBsaWNhdGlvbiBjb250YWluZXJcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbmRleE5vZGVLZXkgLSBub2RlIGtleSBvZiB0aGUgaW5kZXgsIHdoaWNoIHRoZSBpbmRleCBiZWxvbmdzIHRvXG4gKi9cbmV4cG9ydCBjb25zdCBidWlsZEluZGV4ID0gYXBwID0+IGFzeW5jIGluZGV4Tm9kZUtleSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5pbmRleEFwaS5idWlsZEluZGV4LFxuICBwZXJtaXNzaW9uLm1hbmFnZUluZGV4LmlzQXV0aG9yaXplZCxcbiAgeyBpbmRleE5vZGVLZXkgfSxcbiAgX2J1aWxkSW5kZXgsIGFwcCwgaW5kZXhOb2RlS2V5LFxuKTtcblxuY29uc3QgX2J1aWxkSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleE5vZGVLZXkpID0+IHtcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0Tm9kZShhcHAuaGllcmFyY2h5LCBpbmRleE5vZGVLZXkpO1xuXG4gIGF3YWl0IGNyZWF0ZUJ1aWxkSW5kZXhGb2xkZXIoYXBwLmRhdGFzdG9yZSwgaW5kZXhOb2RlS2V5KTtcblxuICBpZiAoIWlzSW5kZXgoaW5kZXhOb2RlKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdCdWlsZEluZGV4OiBtdXN0IHN1cHBseSBhbiBpbmRleG5vZGUnKTsgfVxuXG4gIGlmIChpbmRleE5vZGUuaW5kZXhUeXBlID09PSAncmVmZXJlbmNlJykge1xuICAgIGF3YWl0IGJ1aWxkUmV2ZXJzZVJlZmVyZW5jZUluZGV4KFxuICAgICAgYXBwLCBpbmRleE5vZGUsXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCBidWlsZEhlaXJhcmNoYWxJbmRleChcbiAgICAgIGFwcCwgaW5kZXhOb2RlLFxuICAgICk7XG4gIH1cblxuICBhd2FpdCBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucygpO1xufTtcblxuY29uc3QgYnVpbGRSZXZlcnNlUmVmZXJlbmNlSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleE5vZGUpID0+IHtcbiAgLy8gSXRlcmF0ZSB0aHJvdWdoIGFsbCByZWZlcmVuY0lORyByZWNvcmRzLFxuICAvLyBhbmQgdXBkYXRlIHJlZmVyZW5jZWQgaW5kZXggZm9yIGVhY2ggcmVjb3JkXG4gIGxldCByZWNvcmRDb3VudCA9IDA7XG4gIGNvbnN0IHJlZmVyZW5jaW5nTm9kZXMgPSAkKGFwcC5oaWVyYXJjaHksIFtcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gICAgZmlsdGVyKG4gPT4gaXNSZWNvcmQobilcbiAgICAgICAgICAgICAgICAgICAgJiYgc29tZShmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleChpbmRleE5vZGUpKShuLmZpZWxkcykpLFxuICBdKTtcblxuICBjb25zdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JSZWZlcmVuY2luZ05vZGUgPSBhc3luYyAocmVmZXJlbmNpbmdOb2RlKSA9PiB7XG4gICAgY29uc3QgaXRlcmF0ZVJlZmVyZW5jaW5nTm9kZXMgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvcihhcHApKHJlZmVyZW5jaW5nTm9kZS5jb2xsZWN0aW9uTm9kZUtleSgpKTtcblxuICAgIGxldCByZWZlcmVuY2luZ0lkSXRlcmF0b3IgPSBhd2FpdCBpdGVyYXRlUmVmZXJlbmNpbmdOb2RlcygpO1xuICAgIHdoaWxlICghcmVmZXJlbmNpbmdJZEl0ZXJhdG9yLmRvbmUpIHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZWZlcmVuY2luZ0lkSXRlcmF0b3I7XG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIHJlc3VsdC5pZHMpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkS2V5ID0gam9pbktleShyZXN1bHQuY29sbGVjdGlvbktleSwgaWQpO1xuICAgICAgICBhd2FpdCB0cmFuc2FjdGlvbkZvckJ1aWxkSW5kZXgoYXBwLCBpbmRleE5vZGUubm9kZUtleSgpLCByZWNvcmRLZXksIHJlY29yZENvdW50KTtcbiAgICAgICAgcmVjb3JkQ291bnQrKztcbiAgICAgIH1cbiAgICAgIHJlZmVyZW5jaW5nSWRJdGVyYXRvciA9IGF3YWl0IGl0ZXJhdGVSZWZlcmVuY2luZ05vZGVzKCk7XG4gICAgfVxuICB9O1xuXG4gIGZvciAoY29uc3QgcmVmZXJlbmNpbmdOb2RlIG9mIHJlZmVyZW5jaW5nTm9kZXMpIHtcbiAgICBhd2FpdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JSZWZlcmVuY2luZ05vZGUocmVmZXJlbmNpbmdOb2RlKTtcbiAgfVxufTtcblxuY29uc3QgZ2V0QWxsb3dlZFBhcmVudENvbGxlY3Rpb25Ob2RlcyA9IChoaWVyYXJjaHksIGluZGV4Tm9kZSkgPT4gJChnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleChoaWVyYXJjaHksIGluZGV4Tm9kZSksIFtcbiAgbWFwKG4gPT4gbi5wYXJlbnQoKSksXG5dKTtcblxuY29uc3QgYnVpbGRIZWlyYXJjaGFsSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleE5vZGUpID0+IHtcbiAgbGV0IHJlY29yZENvdW50ID0gMDtcblxuICBjb25zdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JJZHMgPSBhc3luYyAoY29sbGVjdGlvbktleSwgaWRzKSA9PiB7XG4gICAgZm9yIChjb25zdCByZWNvcmRJZCBvZiBpZHMpIHtcbiAgICAgIGNvbnN0IHJlY29yZEtleSA9IGpvaW5LZXkoY29sbGVjdGlvbktleSwgcmVjb3JkSWQpO1xuXG4gICAgICBjb25zdCByZWNvcmROb2RlID0gZ2V0UmVjb3JkTm9kZUJ5SWQoXG4gICAgICAgIGFwcC5oaWVyYXJjaHksXG4gICAgICAgIHJlY29yZElkLFxuICAgICAgKTtcblxuICAgICAgaWYgKHJlY29yZE5vZGVBcHBsaWVzKGluZGV4Tm9kZSkocmVjb3JkTm9kZSkpIHtcbiAgICAgICAgYXdhaXQgdHJhbnNhY3Rpb25Gb3JCdWlsZEluZGV4KFxuICAgICAgICAgIGFwcCwgaW5kZXhOb2RlLm5vZGVLZXkoKSxcbiAgICAgICAgICByZWNvcmRLZXksIHJlY29yZENvdW50LFxuICAgICAgICApO1xuICAgICAgICByZWNvcmRDb3VudCsrO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuXG4gIGNvbnN0IGNvbGxlY3Rpb25SZWNvcmRzID0gZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgoYXBwLmhpZXJhcmNoeSwgaW5kZXhOb2RlKTtcblxuICBmb3IgKGNvbnN0IHRhcmdldENvbGxlY3Rpb25SZWNvcmROb2RlIG9mIGNvbGxlY3Rpb25SZWNvcmRzKSB7XG4gICAgY29uc3QgYWxsSWRzSXRlcmF0b3IgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvcihhcHApKHRhcmdldENvbGxlY3Rpb25SZWNvcmROb2RlLmNvbGxlY3Rpb25Ob2RlS2V5KCkpO1xuXG4gICAgbGV0IGFsbElkcyA9IGF3YWl0IGFsbElkc0l0ZXJhdG9yKCk7XG4gICAgd2hpbGUgKGFsbElkcy5kb25lID09PSBmYWxzZSkge1xuICAgICAgYXdhaXQgY3JlYXRlVHJhbnNhY3Rpb25zRm9ySWRzKFxuICAgICAgICBhbGxJZHMucmVzdWx0LmNvbGxlY3Rpb25LZXksXG4gICAgICAgIGFsbElkcy5yZXN1bHQuaWRzLFxuICAgICAgKTtcbiAgICAgIGFsbElkcyA9IGF3YWl0IGFsbElkc0l0ZXJhdG9yKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlY29yZENvdW50O1xufTtcblxuY29uc3QgY2hvb3NlQ2hpbGRSZWNvcmROb2RlQnlLZXkgPSAoY29sbGVjdGlvbk5vZGUsIHJlY29yZElkKSA9PiBmaW5kKGMgPT4gcmVjb3JkSWQuc3RhcnRzV2l0aChjLm5vZGVJZCkpKGNvbGxlY3Rpb25Ob2RlLmNoaWxkcmVuKTtcblxuY29uc3QgcmVjb3JkTm9kZUFwcGxpZXMgPSBpbmRleE5vZGUgPT4gcmVjb3JkTm9kZSA9PiBpbmNsdWRlcyhyZWNvcmROb2RlLm5vZGVJZCkoaW5kZXhOb2RlLmFsbG93ZWRSZWNvcmROb2RlSWRzKTtcblxuY29uc3QgaGFzQXBwbGljYWJsZURlY2VuZGFudCA9IChoaWVyYXJjaHksIGFuY2VzdG9yTm9kZSwgaW5kZXhOb2RlKSA9PiAkKGhpZXJhcmNoeSwgW1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGZpbHRlcihcbiAgICBhbGxUcnVlKFxuICAgICAgaXNSZWNvcmQsXG4gICAgICBpc0RlY2VuZGFudChhbmNlc3Rvck5vZGUpLFxuICAgICAgcmVjb3JkTm9kZUFwcGxpZXMoaW5kZXhOb2RlKSxcbiAgICApLFxuICApLFxuXSk7XG5cbmNvbnN0IGFwcGx5QWxsRGVjZW5kYW50UmVjb3JkcyA9IGFzeW5jIChhcHAsIGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXksXG4gIGluZGV4Tm9kZSwgaW5kZXhLZXksIGN1cnJlbnRJbmRleGVkRGF0YSxcbiAgY3VycmVudEluZGV4ZWREYXRhS2V5LCByZWNvcmRDb3VudCA9IDApID0+IHtcbiAgY29uc3QgY29sbGVjdGlvbk5vZGUgPSBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5KFxuICAgIGFwcC5oaWVyYXJjaHksXG4gICAgY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSxcbiAgKTtcblxuICBjb25zdCBhbGxJZHNJdGVyYXRvciA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yKGFwcCkoY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSk7XG5cblxuICBjb25zdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JJZHMgPSBhc3luYyAoY29sbGVjdGlvbktleSwgYWxsSWRzKSA9PiB7XG4gICAgZm9yIChjb25zdCByZWNvcmRJZCBvZiBhbGxJZHMpIHtcbiAgICAgIGNvbnN0IHJlY29yZEtleSA9IGpvaW5LZXkoY29sbGVjdGlvbktleSwgcmVjb3JkSWQpO1xuXG4gICAgICBjb25zdCByZWNvcmROb2RlID0gY2hvb3NlQ2hpbGRSZWNvcmROb2RlQnlLZXkoXG4gICAgICAgIGNvbGxlY3Rpb25Ob2RlLFxuICAgICAgICByZWNvcmRJZCxcbiAgICAgICk7XG5cbiAgICAgIGlmIChyZWNvcmROb2RlQXBwbGllcyhpbmRleE5vZGUpKHJlY29yZE5vZGUpKSB7XG4gICAgICAgIGF3YWl0IHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleChcbiAgICAgICAgICBhcHAsIGluZGV4Tm9kZS5ub2RlS2V5KCksXG4gICAgICAgICAgcmVjb3JkS2V5LCByZWNvcmRDb3VudCxcbiAgICAgICAgKTtcbiAgICAgICAgcmVjb3JkQ291bnQrKztcbiAgICAgIH1cblxuICAgICAgaWYgKGhhc0FwcGxpY2FibGVEZWNlbmRhbnQoYXBwLmhpZXJhcmNoeSwgcmVjb3JkTm9kZSwgaW5kZXhOb2RlKSkge1xuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkQ29sbGVjdGlvbk5vZGUgb2YgcmVjb3JkTm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgIHJlY29yZENvdW50ID0gYXdhaXQgYXBwbHlBbGxEZWNlbmRhbnRSZWNvcmRzKFxuICAgICAgICAgICAgYXBwLFxuICAgICAgICAgICAgam9pbktleShyZWNvcmRLZXksIGNoaWxkQ29sbGVjdGlvbk5vZGUuY29sbGVjdGlvbk5hbWUpLFxuICAgICAgICAgICAgaW5kZXhOb2RlLCBpbmRleEtleSwgY3VycmVudEluZGV4ZWREYXRhLFxuICAgICAgICAgICAgY3VycmVudEluZGV4ZWREYXRhS2V5LCByZWNvcmRDb3VudCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGxldCBhbGxJZHMgPSBhd2FpdCBhbGxJZHNJdGVyYXRvcigpO1xuICB3aGlsZSAoYWxsSWRzLmRvbmUgPT09IGZhbHNlKSB7XG4gICAgYXdhaXQgY3JlYXRlVHJhbnNhY3Rpb25zRm9ySWRzKFxuICAgICAgYWxsSWRzLnJlc3VsdC5jb2xsZWN0aW9uS2V5LFxuICAgICAgYWxsSWRzLnJlc3VsdC5pZHMsXG4gICAgKTtcbiAgICBhbGxJZHMgPSBhd2FpdCBhbGxJZHNJdGVyYXRvcigpO1xuICB9XG5cbiAgcmV0dXJuIHJlY29yZENvdW50O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYnVpbGRJbmRleDtcbiIsImltcG9ydCB7IGhhcywgaXNOdW1iZXIsIGlzVW5kZWZpbmVkIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCB7XG4gIHNhZmVLZXksIGFwaVdyYXBwZXIsXG4gIGV2ZW50cywgaXNOb25FbXB0eVN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGl0ZXJhdGVJbmRleCB9IGZyb20gJy4uL2luZGV4aW5nL3JlYWQnO1xuaW1wb3J0IHtcbiAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5LFxuICBnZXRTaGFyZEtleXNJblJhbmdlLFxufSBmcm9tICcuLi9pbmRleGluZy9zaGFyZGluZyc7XG5pbXBvcnQge1xuICBnZXRFeGFjdE5vZGVGb3JQYXRoLCBpc0luZGV4LFxuICBpc1NoYXJkZWRJbmRleCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUyB9IGZyb20gJy4uL2luZGV4aW5nL3NlcmlhbGl6ZXInO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBhZ2dyZWdhdGVzID0gYXBwID0+IGFzeW5jIChpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcyA9IG51bGwsIHJhbmdlRW5kUGFyYW1zID0gbnVsbCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuaW5kZXhBcGkuYWdncmVnYXRlcyxcbiAgcGVybWlzc2lvbi5yZWFkSW5kZXguaXNBdXRob3JpemVkKGluZGV4S2V5KSxcbiAgeyBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMgfSxcbiAgX2FnZ3JlZ2F0ZXMsIGFwcCwgaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zLFxuKTtcblxuY29uc3QgX2FnZ3JlZ2F0ZXMgPSBhc3luYyAoYXBwLCBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMpID0+IHtcbiAgaW5kZXhLZXkgPSBzYWZlS2V5KGluZGV4S2V5KTtcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShpbmRleEtleSk7XG5cbiAgaWYgKCFpc0luZGV4KGluZGV4Tm9kZSkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignc3VwcGxpZWQga2V5IGlzIG5vdCBhbiBpbmRleCcpOyB9XG5cbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICBjb25zdCBzaGFyZEtleXMgPSBhd2FpdCBnZXRTaGFyZEtleXNJblJhbmdlKFxuICAgICAgYXBwLCBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMsXG4gICAgKTtcbiAgICBsZXQgYWdncmVnYXRlUmVzdWx0ID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IGsgb2Ygc2hhcmRLZXlzKSB7XG4gICAgICBjb25zdCBzaGFyZFJlc3VsdCA9IGF3YWl0IGdldEFnZ3JlZ2F0ZXMoYXBwLmhpZXJhcmNoeSwgYXBwLmRhdGFzdG9yZSwgaW5kZXhOb2RlLCBrKTtcbiAgICAgIGlmIChhZ2dyZWdhdGVSZXN1bHQgPT09IG51bGwpIHtcbiAgICAgICAgYWdncmVnYXRlUmVzdWx0ID0gc2hhcmRSZXN1bHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZ2dyZWdhdGVSZXN1bHQgPSBtZXJnZVNoYXJkQWdncmVnYXRlKFxuICAgICAgICAgIGFnZ3JlZ2F0ZVJlc3VsdCxcbiAgICAgICAgICBzaGFyZFJlc3VsdCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFnZ3JlZ2F0ZVJlc3VsdDtcbiAgfVxuICByZXR1cm4gYXdhaXQgZ2V0QWdncmVnYXRlcyhcbiAgICBhcHAuaGllcmFyY2h5LFxuICAgIGFwcC5kYXRhc3RvcmUsXG4gICAgaW5kZXhOb2RlLFxuICAgIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleShpbmRleEtleSksXG4gICk7XG59O1xuXG5jb25zdCBtZXJnZVNoYXJkQWdncmVnYXRlID0gKHRvdGFscywgc2hhcmQpID0+IHtcbiAgY29uc3QgbWVyZ2VHcm91cGluZyA9ICh0b3QsIHNocikgPT4ge1xuICAgIHRvdC5jb3VudCArPSBzaHIuY291bnQ7XG4gICAgZm9yIChjb25zdCBhZ2dOYW1lIGluIHRvdCkge1xuICAgICAgaWYgKGFnZ05hbWUgPT09ICdjb3VudCcpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgdG90YWdnID0gdG90W2FnZ05hbWVdO1xuICAgICAgY29uc3Qgc2hyYWdnID0gc2hyW2FnZ05hbWVdO1xuICAgICAgdG90YWdnLnN1bSArPSBzaHJhZ2cuc3VtO1xuICAgICAgdG90YWdnLm1heCA9IHRvdGFnZy5tYXggPiBzaHJhZ2cubWF4XG4gICAgICAgID8gdG90YWdnLm1heFxuICAgICAgICA6IHNocmFnZy5tYXg7XG4gICAgICB0b3RhZ2cubWluID0gdG90YWdnLm1pbiA8IHNocmFnZy5taW5cbiAgICAgICAgPyB0b3RhZ2cubWluXG4gICAgICAgIDogc2hyYWdnLm1pbjtcbiAgICAgIHRvdGFnZy5tZWFuID0gdG90YWdnLnN1bSAvIHRvdC5jb3VudDtcbiAgICB9XG4gICAgcmV0dXJuIHRvdDtcbiAgfTtcblxuICBmb3IgKGNvbnN0IGFnZ0dyb3VwRGVmIGluIHRvdGFscykge1xuICAgIGZvciAoY29uc3QgZ3JvdXBpbmcgaW4gc2hhcmRbYWdnR3JvdXBEZWZdKSB7XG4gICAgICBjb25zdCBncm91cGluZ1RvdGFsID0gdG90YWxzW2FnZ0dyb3VwRGVmXVtncm91cGluZ107XG4gICAgICB0b3RhbHNbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXSA9IGlzVW5kZWZpbmVkKGdyb3VwaW5nVG90YWwpXG4gICAgICAgID8gc2hhcmRbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXVxuICAgICAgICA6IG1lcmdlR3JvdXBpbmcoXG4gICAgICAgICAgdG90YWxzW2FnZ0dyb3VwRGVmXVtncm91cGluZ10sXG4gICAgICAgICAgc2hhcmRbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXSxcbiAgICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdG90YWxzO1xufTtcblxuY29uc3QgZ2V0QWdncmVnYXRlcyA9IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KSA9PiB7XG4gIGNvbnN0IGFnZ3JlZ2F0ZVJlc3VsdCA9IHt9O1xuICBjb25zdCBkb1JlYWQgPSBpdGVyYXRlSW5kZXgoXG4gICAgICAgIGFzeW5jIGl0ZW0gPT4ge1xuICAgICAgYXBwbHlJdGVtVG9BZ2dyZWdhdGVSZXN1bHQoXG4gICAgICAgIGluZGV4LCBhZ2dyZWdhdGVSZXN1bHQsIGl0ZW0sXG4gICAgICApO1xuICAgICAgcmV0dXJuIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcbiAgICB9LFxuICAgICAgICBhc3luYyAoKSA9PiBhZ2dyZWdhdGVSZXN1bHRcbiAgKTtcblxuICByZXR1cm4gYXdhaXQgZG9SZWFkKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXkpO1xufTtcblxuXG5jb25zdCBhcHBseUl0ZW1Ub0FnZ3JlZ2F0ZVJlc3VsdCA9IChpbmRleE5vZGUsIHJlc3VsdCwgaXRlbSkgPT4ge1xuICBjb25zdCBnZXRJbml0aWFsQWdncmVnYXRlUmVzdWx0ID0gKCkgPT4gKHtcbiAgICBzdW06IDAsIG1lYW46IG51bGwsIG1heDogbnVsbCwgbWluOiBudWxsLFxuICB9KTtcblxuICBjb25zdCBhcHBseUFnZ3JlZ2F0ZVJlc3VsdCA9IChhZ2csIGV4aXN0aW5nLCBjb3VudCkgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gY29tcGlsZUNvZGUoYWdnLmFnZ3JlZ2F0ZWRWYWx1ZSkoeyByZWNvcmQ6IGl0ZW0gfSk7XG5cbiAgICBpZiAoIWlzTnVtYmVyKHZhbHVlKSkgcmV0dXJuIGV4aXN0aW5nO1xuXG4gICAgZXhpc3Rpbmcuc3VtICs9IHZhbHVlO1xuICAgIGV4aXN0aW5nLm1heCA9IHZhbHVlID4gZXhpc3RpbmcubWF4IHx8IGV4aXN0aW5nLm1heCA9PT0gbnVsbFxuICAgICAgPyB2YWx1ZVxuICAgICAgOiBleGlzdGluZy5tYXg7XG4gICAgZXhpc3RpbmcubWluID0gdmFsdWUgPCBleGlzdGluZy5taW4gfHwgZXhpc3RpbmcubWluID09PSBudWxsXG4gICAgICA/IHZhbHVlXG4gICAgICA6IGV4aXN0aW5nLm1pbjtcbiAgICBleGlzdGluZy5tZWFuID0gZXhpc3Rpbmcuc3VtIC8gY291bnQ7XG4gICAgcmV0dXJuIGV4aXN0aW5nO1xuICB9O1xuXG4gIGZvciAoY29uc3QgYWdnR3JvdXAgb2YgaW5kZXhOb2RlLmFnZ3JlZ2F0ZUdyb3Vwcykge1xuICAgIGlmICghaGFzKGFnZ0dyb3VwLm5hbWUpKHJlc3VsdCkpIHtcbiAgICAgIHJlc3VsdFthZ2dHcm91cC5uYW1lXSA9IHt9O1xuICAgIH1cblxuICAgIGNvbnN0IHRoaXNHcm91cFJlc3VsdCA9IHJlc3VsdFthZ2dHcm91cC5uYW1lXTtcblxuICAgIGlmIChpc05vbkVtcHR5U3RyaW5nKGFnZ0dyb3VwLmNvbmRpdGlvbikpIHtcbiAgICAgIGlmICghY29tcGlsZUV4cHJlc3Npb24oYWdnR3JvdXAuY29uZGl0aW9uKSh7IHJlY29yZDogaXRlbSB9KSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgZ3JvdXAgPSBpc05vbkVtcHR5U3RyaW5nKGFnZ0dyb3VwLmdyb3VwQnkpXG4gICAgICA/IGNvbXBpbGVDb2RlKGFnZ0dyb3VwLmdyb3VwQnkpKHsgcmVjb3JkOiBpdGVtIH0pXG4gICAgICA6ICdhbGwnO1xuICAgIGlmICghaXNOb25FbXB0eVN0cmluZyhncm91cCkpIHtcbiAgICAgIGdyb3VwID0gJyhub25lKSc7XG4gICAgfVxuXG4gICAgaWYgKCFoYXMoZ3JvdXApKHRoaXNHcm91cFJlc3VsdCkpIHtcbiAgICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF0gPSB7IGNvdW50OiAwIH07XG4gICAgICBmb3IgKGNvbnN0IGFnZyBvZiBhZ2dHcm91cC5hZ2dyZWdhdGVzKSB7XG4gICAgICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF1bYWdnLm5hbWVdID0gZ2V0SW5pdGlhbEFnZ3JlZ2F0ZVJlc3VsdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF0uY291bnQrKztcblxuICAgIGZvciAoY29uc3QgYWdnIG9mIGFnZ0dyb3VwLmFnZ3JlZ2F0ZXMpIHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nVmFsdWVzID0gdGhpc0dyb3VwUmVzdWx0W2dyb3VwXVthZ2cubmFtZV07XG4gICAgICB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdW2FnZy5uYW1lXSA9IGFwcGx5QWdncmVnYXRlUmVzdWx0KFxuICAgICAgICBhZ2csIGV4aXN0aW5nVmFsdWVzLFxuICAgICAgICB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdLmNvdW50LFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBidWlsZEluZGV4IH0gZnJvbSAnLi9idWlsZEluZGV4JztcbmltcG9ydCB7IGxpc3RJdGVtcyB9IGZyb20gJy4vbGlzdEl0ZW1zJztcbmltcG9ydCB7IGFnZ3JlZ2F0ZXMgfSBmcm9tICcuL2FnZ3JlZ2F0ZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhBcGkgPSBhcHAgPT4gKHtcbiAgbGlzdEl0ZW1zOiBsaXN0SXRlbXMoYXBwKSxcbiAgYnVpbGRJbmRleDogYnVpbGRJbmRleChhcHApLFxuICBhZ2dyZWdhdGVzOiBhZ2dyZWdhdGVzKGFwcCksXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0SW5kZXhBcGk7XG4iLCJpbXBvcnQgeyBlYWNoLCBjb25zdGFudCwgZmluZCB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBtYXAsIG1heCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgam9pbktleSxcbiAgJCwgaXNOb3RoaW5nLCBpc1NvbWV0aGluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIGlzSW5kZXgsIGlzUm9vdCwgaXNTaW5nbGVSZWNvcmQsIGlzQ29sbGVjdGlvblJlY29yZCxcbiAgaXNSZWNvcmQsIGlzYWdncmVnYXRlR3JvdXAsXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbn0gZnJvbSAnLi9oaWVyYXJjaHknO1xuaW1wb3J0IHsgYWxsIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVOb2RlRXJyb3JzID0ge1xuICBpbmRleENhbm5vdEJlUGFyZW50OiAnSW5kZXggdGVtcGxhdGUgY2Fubm90IGJlIGEgcGFyZW50JyxcbiAgYWxsTm9uUm9vdE5vZGVzTXVzdEhhdmVQYXJlbnQ6ICdPbmx5IHRoZSByb290IG5vZGUgbWF5IGhhdmUgbm8gcGFyZW50JyxcbiAgaW5kZXhQYXJlbnRNdXN0QmVSZWNvcmRPclJvb3Q6ICdBbiBpbmRleCBtYXkgb25seSBoYXZlIGEgcmVjb3JkIG9yIHJvb3QgYXMgYSBwYXJlbnQnLFxuICBhZ2dyZWdhdGVQYXJlbnRNdXN0QmVBbkluZGV4OiAnYWdncmVnYXRlR3JvdXAgcGFyZW50IG11c3QgYmUgYW4gaW5kZXgnLFxufTtcblxuY29uc3QgcGF0aFJlZ3hNYWtlciA9IG5vZGUgPT4gKCkgPT4gbm9kZS5ub2RlS2V5KCkucmVwbGFjZSgve2lkfS9nLCAnW2EtekEtWjAtOV8tXSsnKTtcblxuY29uc3Qgbm9kZUtleU1ha2VyID0gbm9kZSA9PiAoKSA9PiBzd2l0Y2hDYXNlKFxuXG4gIFtuID0+IGlzUmVjb3JkKG4pICYmICFpc1NpbmdsZVJlY29yZChuKSxcbiAgICBuID0+IGpvaW5LZXkoXG4gICAgICBub2RlLnBhcmVudCgpLm5vZGVLZXkoKSxcbiAgICAgIG5vZGUuY29sbGVjdGlvbk5hbWUsXG4gICAgICBgJHtuLm5vZGVJZH0te2lkfWAsXG4gICAgKV0sXG5cbiAgW2lzUm9vdCxcbiAgICBjb25zdGFudCgnLycpXSxcblxuICBbZGVmYXVsdENhc2UsXG4gICAgbiA9PiBqb2luS2V5KG5vZGUucGFyZW50KCkubm9kZUtleSgpLCBuLm5hbWUpXSxcblxuKShub2RlKTtcblxuXG5jb25zdCB2YWxpZGF0ZSA9IHBhcmVudCA9PiAobm9kZSkgPT4ge1xuICBpZiAoaXNJbmRleChub2RlKVxuICAgICAgICAmJiBpc1NvbWV0aGluZyhwYXJlbnQpXG4gICAgICAgICYmICFpc1Jvb3QocGFyZW50KVxuICAgICAgICAmJiAhaXNSZWNvcmQocGFyZW50KSkge1xuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoY3JlYXRlTm9kZUVycm9ycy5pbmRleFBhcmVudE11c3RCZVJlY29yZE9yUm9vdCk7XG4gIH1cblxuICBpZiAoaXNhZ2dyZWdhdGVHcm91cChub2RlKVxuICAgICAgICAmJiBpc1NvbWV0aGluZyhwYXJlbnQpXG4gICAgICAgICYmICFpc0luZGV4KHBhcmVudCkpIHtcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGNyZWF0ZU5vZGVFcnJvcnMuYWdncmVnYXRlUGFyZW50TXVzdEJlQW5JbmRleCk7XG4gIH1cblxuICBpZiAoaXNOb3RoaW5nKHBhcmVudCkgJiYgIWlzUm9vdChub2RlKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGNyZWF0ZU5vZGVFcnJvcnMuYWxsTm9uUm9vdE5vZGVzTXVzdEhhdmVQYXJlbnQpOyB9XG5cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5jb25zdCBjb25zdHJ1Y3QgPSBwYXJlbnQgPT4gKG5vZGUpID0+IHtcbiAgbm9kZS5ub2RlS2V5ID0gbm9kZUtleU1ha2VyKG5vZGUpO1xuICBub2RlLnBhdGhSZWd4ID0gcGF0aFJlZ3hNYWtlcihub2RlKTtcbiAgbm9kZS5wYXJlbnQgPSBjb25zdGFudChwYXJlbnQpO1xuICBub2RlLmlzUm9vdCA9ICgpID0+IGlzTm90aGluZyhwYXJlbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBub2RlLm5hbWUgPT09ICdyb290J1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgbm9kZS50eXBlID09PSAncm9vdCc7XG4gIGlmIChpc0NvbGxlY3Rpb25SZWNvcmQobm9kZSkpIHtcbiAgICBub2RlLmNvbGxlY3Rpb25Ob2RlS2V5ID0gKCkgPT4gam9pbktleShcbiAgICAgIHBhcmVudC5ub2RlS2V5KCksIG5vZGUuY29sbGVjdGlvbk5hbWUsXG4gICAgKTtcbiAgICBub2RlLmNvbGxlY3Rpb25QYXRoUmVneCA9ICgpID0+IGpvaW5LZXkoXG4gICAgICBwYXJlbnQucGF0aFJlZ3goKSwgbm9kZS5jb2xsZWN0aW9uTmFtZSxcbiAgICApO1xuICB9XG4gIHJldHVybiBub2RlO1xufTtcblxuY29uc3QgYWRkVG9QYXJlbnQgPSAob2JqKSA9PiB7XG4gIGNvbnN0IHBhcmVudCA9IG9iai5wYXJlbnQoKTtcbiAgaWYgKGlzU29tZXRoaW5nKHBhcmVudCkpIHtcbiAgICBpZiAoaXNJbmRleChvYmopKVxuICAgIC8vIFE6IHdoeSBhcmUgaW5kZXhlcyBub3QgY2hpbGRyZW4gP1xuICAgIC8vIEE6IGJlY2F1c2UgdGhleSBjYW5ub3QgaGF2ZSBjaGlsZHJlbiBvZiB0aGVpciBvd24uXG4gICAgeyBwYXJlbnQuaW5kZXhlcy5wdXNoKG9iaik7IH0gZWxzZSBpZiAoaXNhZ2dyZWdhdGVHcm91cChvYmopKSB7IHBhcmVudC5hZ2dyZWdhdGVHcm91cHMucHVzaChvYmopOyB9IGVsc2UgeyBwYXJlbnQuY2hpbGRyZW4ucHVzaChvYmopOyB9XG5cbiAgICBpZiAoaXNSZWNvcmQob2JqKSkge1xuICAgICAgY29uc3QgZGVmYXVsdEluZGV4ID0gZmluZChcbiAgICAgICAgcGFyZW50LmluZGV4ZXMsXG4gICAgICAgIGkgPT4gaS5uYW1lID09PSBgJHtwYXJlbnQubmFtZX1faW5kZXhgLFxuICAgICAgKTtcbiAgICAgIGlmIChkZWZhdWx0SW5kZXgpIHtcbiAgICAgICAgZGVmYXVsdEluZGV4LmFsbG93ZWRSZWNvcmROb2RlSWRzLnB1c2gob2JqLm5vZGVJZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmo7XG59O1xuXG5leHBvcnQgY29uc3QgY29uc3RydWN0Tm9kZSA9IChwYXJlbnQsIG9iaikgPT4gJChvYmosIFtcbiAgY29uc3RydWN0KHBhcmVudCksXG4gIHZhbGlkYXRlKHBhcmVudCksXG4gIGFkZFRvUGFyZW50LFxuXSk7XG5cbmNvbnN0IGdldE5vZGVJZCA9IChwYXJlbnROb2RlKSA9PiB7XG4gIC8vIHRoaXMgY2FzZSBpcyBoYW5kbGVkIGJldHRlciBlbHNld2hlcmVcbiAgaWYgKCFwYXJlbnROb2RlKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZmluZFJvb3QgPSBuID0+IChpc1Jvb3QobikgPyBuIDogZmluZFJvb3Qobi5wYXJlbnQoKSkpO1xuICBjb25zdCByb290ID0gZmluZFJvb3QocGFyZW50Tm9kZSk7XG5cbiAgcmV0dXJuICgkKHJvb3QsIFtcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gICAgbWFwKG4gPT4gbi5ub2RlSWQpLFxuICAgIG1heF0pICsgMSk7XG59O1xuXG5leHBvcnQgY29uc3QgY29uc3RydWN0SGllcmFyY2h5ID0gKG5vZGUsIHBhcmVudCkgPT4ge1xuICBjb25zdHJ1Y3QocGFyZW50KShub2RlKTtcbiAgaWYgKG5vZGUuaW5kZXhlcykge1xuICAgIGVhY2gobm9kZS5pbmRleGVzLFxuICAgICAgY2hpbGQgPT4gY29uc3RydWN0SGllcmFyY2h5KGNoaWxkLCBub2RlKSk7XG4gIH1cbiAgaWYgKG5vZGUuYWdncmVnYXRlR3JvdXBzKSB7XG4gICAgZWFjaChub2RlLmFnZ3JlZ2F0ZUdyb3VwcyxcbiAgICAgIGNoaWxkID0+IGNvbnN0cnVjdEhpZXJhcmNoeShjaGlsZCwgbm9kZSkpO1xuICB9XG4gIGlmIChub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgIGVhY2gobm9kZS5jaGlsZHJlbixcbiAgICAgIGNoaWxkID0+IGNvbnN0cnVjdEhpZXJhcmNoeShjaGlsZCwgbm9kZSkpO1xuICB9XG4gIGlmIChub2RlLmZpZWxkcykge1xuICAgIGVhY2gobm9kZS5maWVsZHMsXG4gICAgICBmID0+IGVhY2goZi50eXBlT3B0aW9ucywgKHZhbCwga2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IGRlZiA9IGFsbFtmLnR5cGVdLm9wdGlvbkRlZmluaXRpb25zW2tleV07XG4gICAgICAgIGlmICghZGVmKSB7XG4gICAgICAgICAgLy8gdW5rbm93biB0eXBlT3B0aW9uXG4gICAgICAgICAgZGVsZXRlIGYudHlwZU9wdGlvbnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmLnR5cGVPcHRpb25zW2tleV0gPSBkZWYucGFyc2UodmFsKTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICB9XG4gIHJldHVybiBub2RlO1xufTtcblxuXG5leHBvcnQgY29uc3QgZ2V0TmV3Um9vdExldmVsID0gKCkgPT4gY29uc3RydWN0KCkoe1xuICBuYW1lOiAncm9vdCcsXG4gIHR5cGU6ICdyb290JyxcbiAgY2hpbGRyZW46IFtdLFxuICBwYXRoTWFwczogW10sXG4gIGluZGV4ZXM6IFtdLFxuICBub2RlSWQ6IDAsXG59KTtcblxuY29uc3QgX2dldE5ld1JlY29yZFRlbXBsYXRlID0gKHBhcmVudCwgbmFtZSwgY3JlYXRlRGVmYXVsdEluZGV4LCBpc1NpbmdsZSkgPT4ge1xuICBjb25zdCBub2RlID0gY29uc3RydWN0Tm9kZShwYXJlbnQsIHtcbiAgICBuYW1lLFxuICAgIHR5cGU6ICdyZWNvcmQnLFxuICAgIGZpZWxkczogW10sXG4gICAgY2hpbGRyZW46IFtdLFxuICAgIHZhbGlkYXRpb25SdWxlczogW10sXG4gICAgbm9kZUlkOiBnZXROb2RlSWQocGFyZW50KSxcbiAgICBpbmRleGVzOiBbXSxcbiAgICBhbGxpZHNTaGFyZEZhY3RvcjogaXNSZWNvcmQocGFyZW50KSA/IDEgOiA2NCxcbiAgICBjb2xsZWN0aW9uTmFtZTogJycsXG4gICAgaXNTaW5nbGUsXG4gIH0pO1xuXG4gIGlmIChjcmVhdGVEZWZhdWx0SW5kZXgpIHtcbiAgICBjb25zdCBkZWZhdWx0SW5kZXggPSBnZXROZXdJbmRleFRlbXBsYXRlKHBhcmVudCk7XG4gICAgZGVmYXVsdEluZGV4Lm5hbWUgPSBgJHtuYW1lfV9pbmRleGA7XG4gICAgZGVmYXVsdEluZGV4LmFsbG93ZWRSZWNvcmROb2RlSWRzLnB1c2gobm9kZS5ub2RlSWQpO1xuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3UmVjb3JkVGVtcGxhdGUgPSAocGFyZW50LCBuYW1lID0gJycsIGNyZWF0ZURlZmF1bHRJbmRleCA9IHRydWUpID0+IF9nZXROZXdSZWNvcmRUZW1wbGF0ZShwYXJlbnQsIG5hbWUsIGNyZWF0ZURlZmF1bHRJbmRleCwgZmFsc2UpO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3U2luZ2xlUmVjb3JkVGVtcGxhdGUgPSBwYXJlbnQgPT4gX2dldE5ld1JlY29yZFRlbXBsYXRlKHBhcmVudCwgJycsIGZhbHNlLCB0cnVlKTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0luZGV4VGVtcGxhdGUgPSAocGFyZW50LCB0eXBlID0gJ2FuY2VzdG9yJykgPT4gY29uc3RydWN0Tm9kZShwYXJlbnQsIHtcbiAgbmFtZTogJycsXG4gIHR5cGU6ICdpbmRleCcsXG4gIG1hcDogJ3JldHVybiB7Li4ucmVjb3JkfTsnLFxuICBmaWx0ZXI6ICcnLFxuICBpbmRleFR5cGU6IHR5cGUsXG4gIGdldFNoYXJkTmFtZTogJycsXG4gIGdldFNvcnRLZXk6ICdyZWNvcmQuaWQnLFxuICBhZ2dyZWdhdGVHcm91cHM6IFtdLFxuICBhbGxvd2VkUmVjb3JkTm9kZUlkczogW10sXG4gIG5vZGVJZDogZ2V0Tm9kZUlkKHBhcmVudCksXG59KTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0FnZ3JlZ2F0ZUdyb3VwVGVtcGxhdGUgPSBpbmRleCA9PiBjb25zdHJ1Y3ROb2RlKGluZGV4LCB7XG4gIG5hbWU6ICcnLFxuICB0eXBlOiAnYWdncmVnYXRlR3JvdXAnLFxuICBncm91cEJ5OiAnJyxcbiAgYWdncmVnYXRlczogW10sXG4gIGNvbmRpdGlvbjogJycsXG4gIG5vZGVJZDogZ2V0Tm9kZUlkKGluZGV4KSxcbn0pO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3QWdncmVnYXRlVGVtcGxhdGUgPSAoc2V0KSA9PiB7XG4gIGNvbnN0IGFnZ3JlZ2F0ZWRWYWx1ZSA9IHtcbiAgICBuYW1lOiAnJyxcbiAgICBhZ2dyZWdhdGVkVmFsdWU6ICcnLFxuICB9O1xuICBzZXQuYWdncmVnYXRlcy5wdXNoKGFnZ3JlZ2F0ZWRWYWx1ZSk7XG4gIHJldHVybiBhZ2dyZWdhdGVkVmFsdWU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdldE5ld1Jvb3RMZXZlbCxcbiAgZ2V0TmV3UmVjb3JkVGVtcGxhdGUsXG4gIGdldE5ld0luZGV4VGVtcGxhdGUsXG4gIGNyZWF0ZU5vZGVFcnJvcnMsXG4gIGNvbnN0cnVjdEhpZXJhcmNoeSxcbiAgZ2V0TmV3QWdncmVnYXRlR3JvdXBUZW1wbGF0ZSxcbiAgZ2V0TmV3QWdncmVnYXRlVGVtcGxhdGUsXG59O1xuIiwiaW1wb3J0IHtcbiAgc29tZSwgbWFwLCBmaWx0ZXIsIGtleXMsIGluY2x1ZGVzLFxuICBjb3VudEJ5LCBmbGF0dGVuLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgaXNTb21ldGhpbmcsICQsXG4gIGlzTm9uRW1wdHlTdHJpbmcsXG4gIGlzTm90aGluZ09yRW1wdHksXG4gIGlzTm90aGluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGFsbCwgZ2V0RGVmYXVsdE9wdGlvbnMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBmaWVsZEVycm9ycyA9IHtcbiAgQWRkRmllbGRWYWxpZGF0aW9uRmFpbGVkOiAnQWRkIGZpZWxkIHZhbGlkYXRpb246ICcsXG59O1xuXG5leHBvcnQgY29uc3QgYWxsb3dlZFR5cGVzID0gKCkgPT4ga2V5cyhhbGwpO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3RmllbGQgPSB0eXBlID0+ICh7XG4gIG5hbWU6ICcnLCAvLyBob3cgZmllbGQgaXMgcmVmZXJlbmNlZCBpbnRlcm5hbGx5XG4gIHR5cGUsXG4gIHR5cGVPcHRpb25zOiBnZXREZWZhdWx0T3B0aW9ucyh0eXBlKSxcbiAgbGFiZWw6ICcnLCAvLyBob3cgZmllbGQgaXMgZGlzcGxheWVkXG4gIGdldEluaXRpYWxWYWx1ZTogJ2RlZmF1bHQnLCAvLyBmdW5jdGlvbiB0aGF0IGdldHMgdmFsdWUgd2hlbiBpbml0aWFsbHkgY3JlYXRlZFxuICBnZXRVbmRlZmluZWRWYWx1ZTogJ2RlZmF1bHQnLCAvLyBmdW5jdGlvbiB0aGF0IGdldHMgdmFsdWUgd2hlbiBmaWVsZCB1bmRlZmluZWQgb24gcmVjb3JkXG59KTtcblxuY29uc3QgZmllbGRSdWxlcyA9IGFsbEZpZWxkcyA9PiBbXG4gIG1ha2VydWxlKCduYW1lJywgJ2ZpZWxkIG5hbWUgaXMgbm90IHNldCcsXG4gICAgZiA9PiBpc05vbkVtcHR5U3RyaW5nKGYubmFtZSkpLFxuICBtYWtlcnVsZSgndHlwZScsICdmaWVsZCB0eXBlIGlzIG5vdCBzZXQnLFxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLnR5cGUpKSxcbiAgbWFrZXJ1bGUoJ2xhYmVsJywgJ2ZpZWxkIGxhYmVsIGlzIG5vdCBzZXQnLFxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLmxhYmVsKSksXG4gIG1ha2VydWxlKCdnZXRJbml0aWFsVmFsdWUnLCAnZ2V0SW5pdGlhbFZhbHVlIGZ1bmN0aW9uIGlzIG5vdCBzZXQnLFxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLmdldEluaXRpYWxWYWx1ZSkpLFxuICBtYWtlcnVsZSgnZ2V0VW5kZWZpbmVkVmFsdWUnLCAnZ2V0VW5kZWZpbmVkVmFsdWUgZnVuY3Rpb24gaXMgbm90IHNldCcsXG4gICAgZiA9PiBpc05vbkVtcHR5U3RyaW5nKGYuZ2V0VW5kZWZpbmVkVmFsdWUpKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnZmllbGQgbmFtZSBpcyBkdXBsaWNhdGVkJyxcbiAgICBmID0+IGlzTm90aGluZ09yRW1wdHkoZi5uYW1lKVxuICAgICAgICAgICAgIHx8IGNvdW50QnkoJ25hbWUnKShhbGxGaWVsZHMpW2YubmFtZV0gPT09IDEpLFxuICBtYWtlcnVsZSgndHlwZScsICd0eXBlIGlzIHVua25vd24nLFxuICAgIGYgPT4gaXNOb3RoaW5nT3JFbXB0eShmLnR5cGUpXG4gICAgICAgICAgICAgfHwgc29tZSh0ID0+IGYudHlwZSA9PT0gdCkoYWxsb3dlZFR5cGVzKCkpKSxcbl07XG5cbmNvbnN0IHR5cGVPcHRpb25zUnVsZXMgPSAoZmllbGQpID0+IHtcbiAgY29uc3QgdHlwZSA9IGFsbFtmaWVsZC50eXBlXTtcbiAgaWYgKGlzTm90aGluZyh0eXBlKSkgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IGRlZiA9IG9wdE5hbWUgPT4gdHlwZS5vcHRpb25EZWZpbml0aW9uc1tvcHROYW1lXTtcblxuICByZXR1cm4gJChmaWVsZC50eXBlT3B0aW9ucywgW1xuICAgIGtleXMsXG4gICAgZmlsdGVyKG8gPT4gaXNTb21ldGhpbmcoZGVmKG8pKVxuICAgICAgICAgICAgICAgICAgICAmJiBpc1NvbWV0aGluZyhkZWYobykuaXNWYWxpZCkpLFxuICAgIG1hcChvID0+IG1ha2VydWxlKFxuICAgICAgYHR5cGVPcHRpb25zLiR7b31gLFxuICAgICAgYCR7ZGVmKG8pLnJlcXVpcmVtZW50RGVzY3JpcHRpb259YCxcbiAgICAgIGZpZWxkID0+IGRlZihvKS5pc1ZhbGlkKGZpZWxkLnR5cGVPcHRpb25zW29dKSxcbiAgICApKSxcbiAgXSk7XG59O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVGaWVsZCA9IGFsbEZpZWxkcyA9PiAoZmllbGQpID0+IHtcbiAgY29uc3QgZXZlcnlTaW5nbGVGaWVsZCA9IGluY2x1ZGVzKGZpZWxkKShhbGxGaWVsZHMpID8gYWxsRmllbGRzIDogWy4uLmFsbEZpZWxkcywgZmllbGRdO1xuICByZXR1cm4gYXBwbHlSdWxlU2V0KFsuLi5maWVsZFJ1bGVzKGV2ZXJ5U2luZ2xlRmllbGQpLCAuLi50eXBlT3B0aW9uc1J1bGVzKGZpZWxkKV0pKGZpZWxkKTtcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFsbEZpZWxkcyA9IHJlY29yZE5vZGUgPT4gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICBtYXAodmFsaWRhdGVGaWVsZChyZWNvcmROb2RlLmZpZWxkcykpLFxuICBmbGF0dGVuLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBhZGRGaWVsZCA9IChyZWNvcmRUZW1wbGF0ZSwgZmllbGQpID0+IHtcbiAgaWYgKGlzTm90aGluZ09yRW1wdHkoZmllbGQubGFiZWwpKSB7XG4gICAgZmllbGQubGFiZWwgPSBmaWVsZC5uYW1lO1xuICB9XG4gIGNvbnN0IHZhbGlkYXRpb25NZXNzYWdlcyA9IHZhbGlkYXRlRmllbGQoWy4uLnJlY29yZFRlbXBsYXRlLmZpZWxkcywgZmllbGRdKShmaWVsZCk7XG4gIGlmICh2YWxpZGF0aW9uTWVzc2FnZXMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGVycm9ycyA9IG1hcChtID0+IG0uZXJyb3IpKHZhbGlkYXRpb25NZXNzYWdlcyk7XG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgJHtmaWVsZEVycm9ycy5BZGRGaWVsZFZhbGlkYXRpb25GYWlsZWR9ICR7ZXJyb3JzLmpvaW4oJywgJyl9YCk7XG4gIH1cbiAgcmVjb3JkVGVtcGxhdGUuZmllbGRzLnB1c2goZmllbGQpO1xufTtcbiIsImltcG9ydCB7IGlzTnVtYmVyLCBpc0Jvb2xlYW4sIGRlZmF1bHRDYXNlIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHN3aXRjaENhc2UgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUgPSAoaW52YWxpZEZpZWxkcyxcbiAgbWVzc2FnZVdoZW5JbnZhbGlkLFxuICBleHByZXNzaW9uV2hlblZhbGlkKSA9PiAoe1xuICBpbnZhbGlkRmllbGRzLCBtZXNzYWdlV2hlbkludmFsaWQsIGV4cHJlc3Npb25XaGVuVmFsaWQsXG59KTtcblxuY29uc3QgZ2V0U3RhdGljVmFsdWUgPSBzd2l0Y2hDYXNlKFxuICBbaXNOdW1iZXIsIHYgPT4gdi50b1N0cmluZygpXSxcbiAgW2lzQm9vbGVhbiwgdiA9PiB2LnRvU3RyaW5nKCldLFxuICBbZGVmYXVsdENhc2UsIHYgPT4gYCcke3Z9J2BdLFxuKTtcblxuZXhwb3J0IGNvbnN0IGNvbW1vblJlY29yZFZhbGlkYXRpb25SdWxlcyA9ICh7XG5cbiAgZmllbGROb3RFbXB0eTogZmllbGROYW1lID0+IGdldE5ld1JlY29yZFZhbGlkYXRpb25SdWxlKFxuICAgIFtmaWVsZE5hbWVdLFxuICAgIGAke2ZpZWxkTmFtZX0gaXMgZW1wdHlgLFxuICAgIGAhXy5pc0VtcHR5KHJlY29yZFsnJHtmaWVsZE5hbWV9J10pYCxcbiAgKSxcblxuICBmaWVsZEJldHdlZW46IChmaWVsZE5hbWUsIG1pbiwgbWF4KSA9PiBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZShcbiAgICBbZmllbGROYW1lXSxcbiAgICBgJHtmaWVsZE5hbWV9IG11c3QgYmUgYmV0d2VlbiAke21pbi50b1N0cmluZygpfSBhbmQgJHttYXgudG9TdHJpbmcoKX1gLFxuICAgIGByZWNvcmRbJyR7ZmllbGROYW1lfSddID49ICR7Z2V0U3RhdGljVmFsdWUobWluKX0gJiYgIHJlY29yZFsnJHtmaWVsZE5hbWV9J10gPD0gJHtnZXRTdGF0aWNWYWx1ZShtYXgpfSBgLFxuICApLFxuXG4gIGZpZWxkR3JlYXRlclRoYW46IChmaWVsZE5hbWUsIG1pbiwgbWF4KSA9PiBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZShcbiAgICBbZmllbGROYW1lXSxcbiAgICBgJHtmaWVsZE5hbWV9IG11c3QgYmUgZ3JlYXRlciB0aGFuICR7bWluLnRvU3RyaW5nKCl9IGFuZCAke21heC50b1N0cmluZygpfWAsXG4gICAgYHJlY29yZFsnJHtmaWVsZE5hbWV9J10gPj0gJHtnZXRTdGF0aWNWYWx1ZShtaW4pfSAgYCxcbiAgKSxcbn0pO1xuXG5leHBvcnQgY29uc3QgYWRkUmVjb3JkVmFsaWRhdGlvblJ1bGUgPSByZWNvcmROb2RlID0+IHJ1bGUgPT4gcmVjb3JkTm9kZS52YWxpZGF0aW9uUnVsZXMucHVzaChydWxlKTtcbiIsIlxuZXhwb3J0IGNvbnN0IGNyZWF0ZVRyaWdnZXIgPSAoKSA9PiAoe1xuICBhY3Rpb25OYW1lOiAnJyxcbiAgZXZlbnROYW1lOiAnJyxcbiAgLy8gZnVuY3Rpb24sIGhhcyBhY2Nlc3MgdG8gZXZlbnQgY29udGV4dCxcbiAgLy8gcmV0dXJucyBvYmplY3QgdGhhdCBpcyB1c2VkIGFzIHBhcmFtZXRlciB0byBhY3Rpb25cbiAgLy8gb25seSB1c2VkIGlmIHRyaWdnZXJlZCBieSBldmVudFxuICBvcHRpb25zQ3JlYXRvcjogJycsXG4gIC8vIGFjdGlvbiBydW5zIGlmIHRydWUsXG4gIC8vIGhhcyBhY2Nlc3MgdG8gZXZlbnQgY29udGV4dFxuICBjb25kaXRpb246ICcnLFxufSk7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVBY3Rpb24gPSAoKSA9PiAoe1xuICBuYW1lOiAnJyxcbiAgYmVoYXZpb3VyU291cmNlOiAnJyxcbiAgLy8gbmFtZSBvZiBmdW5jdGlvbiBpbiBhY3Rpb25Tb3VyY2VcbiAgYmVoYXZpb3VyTmFtZTogJycsXG4gIC8vIHBhcmFtZXRlciBwYXNzZWQgaW50byBiZWhhdmlvdXIuXG4gIC8vIGFueSBvdGhlciBwYXJtcyBwYXNzZWQgYXQgcnVudGltZSBlLmcuXG4gIC8vIGJ5IHRyaWdnZXIsIG9yIG1hbnVhbGx5LCB3aWxsIGJlIG1lcmdlZCBpbnRvIHRoaXNcbiAgaW5pdGlhbE9wdGlvbnM6IHt9LFxufSk7XG4iLCJpbXBvcnQgeyBmbGF0dGVuLCBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgaXNFbXB0eSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCB7XG4gIGlzTm9uRW1wdHlTdHJpbmcsIFxuICBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24sICQsIFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSB9IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcblxuY29uc3QgYWdncmVnYXRlUnVsZXMgPSBbXG4gIG1ha2VydWxlKCduYW1lJywgJ2Nob29zZSBhIG5hbWUgZm9yIHRoZSBhZ2dyZWdhdGUnLFxuICAgIGEgPT4gaXNOb25FbXB0eVN0cmluZyhhLm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2FnZ3JlZ2F0ZWRWYWx1ZScsICdhZ2dyZWdhdGVkVmFsdWUgZG9lcyBub3QgY29tcGlsZScsXG4gICAgYSA9PiBpc0VtcHR5KGEuYWdncmVnYXRlZFZhbHVlKVxuICAgICAgICAgICAgfHwgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uKFxuICAgICAgICAgICAgICAoKSA9PiBjb21waWxlQ29kZShhLmFnZ3JlZ2F0ZWRWYWx1ZSksXG4gICAgICAgICAgICApKSxcbl07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFnZ3JlZ2F0ZSA9IGFnZ3JlZ2F0ZSA9PiBhcHBseVJ1bGVTZXQoYWdncmVnYXRlUnVsZXMpKGFnZ3JlZ2F0ZSk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFsbEFnZ3JlZ2F0ZXMgPSBhbGwgPT4gJChhbGwsIFtcbiAgbWFwKHZhbGlkYXRlQWdncmVnYXRlKSxcbiAgZmxhdHRlbixcbl0pO1xuIiwiaW1wb3J0IHtcbiAgZmlsdGVyLCB1bmlvbiwgY29uc3RhbnQsXG4gIG1hcCwgZmxhdHRlbiwgZXZlcnksIHVuaXFCeSxcbiAgc29tZSwgaW5jbHVkZXMsIGlzRW1wdHksXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBoYXMgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgY29tcGlsZUV4cHJlc3Npb24sIGNvbXBpbGVDb2RlIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xuaW1wb3J0IHtcbiAgJCwgaXNTb21ldGhpbmcsIHN3aXRjaENhc2UsXG4gIGFueVRydWUsIGlzTm9uRW1wdHlBcnJheSwgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uLFxuICBpc05vbkVtcHR5U3RyaW5nLCBkZWZhdWx0Q2FzZSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIGlzUmVjb3JkLCBpc1Jvb3QsIGlzYWdncmVnYXRlR3JvdXAsXG4gIGlzSW5kZXgsIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbn0gZnJvbSAnLi9oaWVyYXJjaHknO1xuaW1wb3J0IHsgZXZlbnRzTGlzdCB9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xuaW1wb3J0IHsgdmFsaWRhdGVBbGxGaWVsZHMgfSBmcm9tICcuL2ZpZWxkcyc7XG5pbXBvcnQge1xuICBhcHBseVJ1bGVTZXQsIG1ha2VydWxlLCBzdHJpbmdOb3RFbXB0eSxcbiAgdmFsaWRhdGlvbkVycm9yLFxufSBmcm9tICcuLi9jb21tb24vdmFsaWRhdGlvbkNvbW1vbic7XG5pbXBvcnQgeyBpbmRleFJ1bGVTZXQgfSBmcm9tICcuL2luZGV4ZXMnO1xuaW1wb3J0IHsgdmFsaWRhdGVBbGxBZ2dyZWdhdGVzIH0gZnJvbSAnLi92YWxpZGF0ZUFnZ3JlZ2F0ZSc7XG5cbmV4cG9ydCBjb25zdCBydWxlU2V0ID0gKC4uLnNldHMpID0+IGNvbnN0YW50KGZsYXR0ZW4oWy4uLnNldHNdKSk7XG5cbmNvbnN0IGNvbW1vblJ1bGVzID0gW1xuICBtYWtlcnVsZSgnbmFtZScsICdub2RlIG5hbWUgaXMgbm90IHNldCcsXG4gICAgbm9kZSA9PiBzdHJpbmdOb3RFbXB0eShub2RlLm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ3R5cGUnLCAnbm9kZSB0eXBlIG5vdCByZWNvZ25pc2VkJyxcbiAgICBhbnlUcnVlKGlzUmVjb3JkLCBpc1Jvb3QsIGlzSW5kZXgsIGlzYWdncmVnYXRlR3JvdXApKSxcbl07XG5cbmNvbnN0IHJlY29yZFJ1bGVzID0gW1xuICBtYWtlcnVsZSgnZmllbGRzJywgJ25vIGZpZWxkcyBoYXZlIGJlZW4gYWRkZWQgdG8gdGhlIHJlY29yZCcsXG4gICAgbm9kZSA9PiBpc05vbkVtcHR5QXJyYXkobm9kZS5maWVsZHMpKSxcbiAgbWFrZXJ1bGUoJ3ZhbGlkYXRpb25SdWxlcycsIFwidmFsaWRhdGlvbiBydWxlIGlzIG1pc3NpbmcgYSAnbWVzc2FnZVdoZW5WYWxpZCcgbWVtYmVyXCIsXG4gICAgbm9kZSA9PiBldmVyeShyID0+IGhhcyhyLCAnbWVzc2FnZVdoZW5JbnZhbGlkJykpKG5vZGUudmFsaWRhdGlvblJ1bGVzKSksXG4gIG1ha2VydWxlKCd2YWxpZGF0aW9uUnVsZXMnLCBcInZhbGlkYXRpb24gcnVsZSBpcyBtaXNzaW5nIGEgJ2V4cHJlc3Npb25XaGVuVmFsaWQnIG1lbWJlclwiLFxuICAgIG5vZGUgPT4gZXZlcnkociA9PiBoYXMociwgJ2V4cHJlc3Npb25XaGVuVmFsaWQnKSkobm9kZS52YWxpZGF0aW9uUnVsZXMpKSxcbl07XG5cblxuY29uc3QgYWdncmVnYXRlR3JvdXBSdWxlcyA9IFtcbiAgbWFrZXJ1bGUoJ2NvbmRpdGlvbicsICdjb25kaXRpb24gZG9lcyBub3QgY29tcGlsZScsXG4gICAgYSA9PiBpc0VtcHR5KGEuY29uZGl0aW9uKVxuICAgICAgICAgICAgIHx8IGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbihcbiAgICAgICAgICAgICAgICgpID0+IGNvbXBpbGVFeHByZXNzaW9uKGEuY29uZGl0aW9uKSxcbiAgICAgICAgICAgICApKSxcbl07XG5cbmNvbnN0IGdldFJ1bGVTZXQgPSBub2RlID0+IHN3aXRjaENhc2UoXG5cbiAgW2lzUmVjb3JkLCBydWxlU2V0KFxuICAgIGNvbW1vblJ1bGVzLFxuICAgIHJlY29yZFJ1bGVzLFxuICApXSxcblxuICBbaXNJbmRleCwgcnVsZVNldChcbiAgICBjb21tb25SdWxlcyxcbiAgICBpbmRleFJ1bGVTZXQsXG4gICldLFxuXG4gIFtpc2FnZ3JlZ2F0ZUdyb3VwLCBydWxlU2V0KFxuICAgIGNvbW1vblJ1bGVzLFxuICAgIGFnZ3JlZ2F0ZUdyb3VwUnVsZXMsXG4gICldLFxuXG4gIFtkZWZhdWx0Q2FzZSwgcnVsZVNldChjb21tb25SdWxlcywgW10pXSxcbikobm9kZSk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZU5vZGUgPSBub2RlID0+IGFwcGx5UnVsZVNldChnZXRSdWxlU2V0KG5vZGUpKShub2RlKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWxsID0gKGFwcEhpZXJhcmNoeSkgPT4ge1xuICBjb25zdCBmbGF0dGVuZWQgPSBnZXRGbGF0dGVuZWRIaWVyYXJjaHkoXG4gICAgYXBwSGllcmFyY2h5LFxuICApO1xuXG4gIGNvbnN0IGR1cGxpY2F0ZU5hbWVSdWxlID0gbWFrZXJ1bGUoXG4gICAgJ25hbWUnLCAnbm9kZSBuYW1lcyBtdXN0IGJlIHVuaXF1ZSB1bmRlciBzaGFyZWQgcGFyZW50JyxcbiAgICBuID0+IGZpbHRlcihmID0+IGYucGFyZW50KCkgPT09IG4ucGFyZW50KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgZi5uYW1lID09PSBuLm5hbWUpKGZsYXR0ZW5lZCkubGVuZ3RoID09PSAxLFxuICApO1xuXG4gIGNvbnN0IGR1cGxpY2F0ZU5vZGVLZXlFcnJvcnMgPSAkKGZsYXR0ZW5lZCwgW1xuICAgIG1hcChuID0+IGFwcGx5UnVsZVNldChbZHVwbGljYXRlTmFtZVJ1bGVdKShuKSksXG4gICAgZmlsdGVyKGlzU29tZXRoaW5nKSxcbiAgICBmbGF0dGVuLFxuICBdKTtcblxuICBjb25zdCBmaWVsZEVycm9ycyA9ICQoZmxhdHRlbmVkLCBbXG4gICAgZmlsdGVyKGlzUmVjb3JkKSxcbiAgICBtYXAodmFsaWRhdGVBbGxGaWVsZHMpLFxuICAgIGZsYXR0ZW4sXG4gIF0pO1xuXG4gIGNvbnN0IGFnZ3JlZ2F0ZUVycm9ycyA9ICQoZmxhdHRlbmVkLCBbXG4gICAgZmlsdGVyKGlzYWdncmVnYXRlR3JvdXApLFxuICAgIG1hcChzID0+IHZhbGlkYXRlQWxsQWdncmVnYXRlcyhcbiAgICAgIHMuYWdncmVnYXRlcyxcbiAgICApKSxcbiAgICBmbGF0dGVuLFxuICBdKTtcblxuICByZXR1cm4gJChmbGF0dGVuZWQsIFtcbiAgICBtYXAodmFsaWRhdGVOb2RlKSxcbiAgICBmbGF0dGVuLFxuICAgIHVuaW9uKGR1cGxpY2F0ZU5vZGVLZXlFcnJvcnMpLFxuICAgIHVuaW9uKGZpZWxkRXJyb3JzKSxcbiAgICB1bmlvbihhZ2dyZWdhdGVFcnJvcnMpLFxuICBdKTtcbn07XG5cbmNvbnN0IGFjdGlvblJ1bGVzID0gW1xuICBtYWtlcnVsZSgnbmFtZScsICdhY3Rpb24gbXVzdCBoYXZlIGEgbmFtZScsXG4gICAgYSA9PiBpc05vbkVtcHR5U3RyaW5nKGEubmFtZSkpLFxuICBtYWtlcnVsZSgnYmVoYXZpb3VyTmFtZScsICdtdXN0IHN1cHBseSBhIGJlaGF2aW91ciBuYW1lIHRvIHRoZSBhY3Rpb24nLFxuICAgIGEgPT4gaXNOb25FbXB0eVN0cmluZyhhLmJlaGF2aW91ck5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2JlaGF2aW91clNvdXJjZScsICdtdXN0IHN1cHBseSBhIGJlaGF2aW91ciBzb3VyY2UgZm9yIHRoZSBhY3Rpb24nLFxuICAgIGEgPT4gaXNOb25FbXB0eVN0cmluZyhhLmJlaGF2aW91clNvdXJjZSkpLFxuXTtcblxuY29uc3QgZHVwbGljYXRlQWN0aW9uUnVsZSA9IG1ha2VydWxlKCcnLCAnYWN0aW9uIG5hbWUgbXVzdCBiZSB1bmlxdWUnLCAoKSA9PiB7fSk7XG5cbmNvbnN0IHZhbGlkYXRlQWN0aW9uID0gYWN0aW9uID0+IGFwcGx5UnVsZVNldChhY3Rpb25SdWxlcykoYWN0aW9uKTtcblxuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBY3Rpb25zID0gKGFsbEFjdGlvbnMpID0+IHtcbiAgY29uc3QgZHVwbGljYXRlQWN0aW9ucyA9ICQoYWxsQWN0aW9ucywgW1xuICAgIGZpbHRlcihhID0+IGZpbHRlcihhMiA9PiBhMi5uYW1lID09PSBhLm5hbWUpKGFsbEFjdGlvbnMpLmxlbmd0aCA+IDEpLFxuICAgIG1hcChhID0+IHZhbGlkYXRpb25FcnJvcihkdXBsaWNhdGVBY3Rpb25SdWxlLCBhKSksXG4gIF0pO1xuXG4gIGNvbnN0IGVycm9ycyA9ICQoYWxsQWN0aW9ucywgW1xuICAgIG1hcCh2YWxpZGF0ZUFjdGlvbiksXG4gICAgZmxhdHRlbixcbiAgICB1bmlvbihkdXBsaWNhdGVBY3Rpb25zKSxcbiAgICB1bmlxQnkoJ25hbWUnKSxcbiAgXSk7XG5cbiAgcmV0dXJuIGVycm9ycztcbn07XG5cbmNvbnN0IHRyaWdnZXJSdWxlcyA9IGFjdGlvbnMgPT4gKFtcbiAgbWFrZXJ1bGUoJ2FjdGlvbk5hbWUnLCAnbXVzdCBzcGVjaWZ5IGFuIGFjdGlvbicsXG4gICAgdCA9PiBpc05vbkVtcHR5U3RyaW5nKHQuYWN0aW9uTmFtZSkpLFxuICBtYWtlcnVsZSgnZXZlbnROYW1lJywgJ211c3Qgc3BlY2lmeSBhbmQgZXZlbnQnLFxuICAgIHQgPT4gaXNOb25FbXB0eVN0cmluZyh0LmV2ZW50TmFtZSkpLFxuICBtYWtlcnVsZSgnYWN0aW9uTmFtZScsICdzcGVjaWZpZWQgYWN0aW9uIG5vdCBzdXBwbGllZCcsXG4gICAgdCA9PiAhdC5hY3Rpb25OYW1lXG4gICAgICAgICAgICAgfHwgc29tZShhID0+IGEubmFtZSA9PT0gdC5hY3Rpb25OYW1lKShhY3Rpb25zKSksXG4gIG1ha2VydWxlKCdldmVudE5hbWUnLCAnaW52YWxpZCBFdmVudCBOYW1lJyxcbiAgICB0ID0+ICF0LmV2ZW50TmFtZVxuICAgICAgICAgICAgIHx8IGluY2x1ZGVzKHQuZXZlbnROYW1lKShldmVudHNMaXN0KSksXG4gIG1ha2VydWxlKCdvcHRpb25zQ3JlYXRvcicsICdPcHRpb25zIENyZWF0b3IgZG9lcyBub3QgY29tcGlsZSAtIGNoZWNrIHlvdXIgZXhwcmVzc2lvbicsXG4gICAgKHQpID0+IHtcbiAgICAgIGlmICghdC5vcHRpb25zQ3JlYXRvcikgcmV0dXJuIHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICBjb21waWxlQ29kZSh0Lm9wdGlvbnNDcmVhdG9yKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGNhdGNoIChfKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIH0pLFxuICBtYWtlcnVsZSgnY29uZGl0aW9uJywgJ1RyaWdnZXIgY29uZGl0aW9uIGRvZXMgbm90IGNvbXBpbGUgLSBjaGVjayB5b3VyIGV4cHJlc3Npb24nLFxuICAgICh0KSA9PiB7XG4gICAgICBpZiAoIXQuY29uZGl0aW9uKSByZXR1cm4gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbXBpbGVFeHByZXNzaW9uKHQuY29uZGl0aW9uKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGNhdGNoIChfKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIH0pLFxuXSk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVRyaWdnZXIgPSAodHJpZ2dlciwgYWxsQWN0aW9ucykgPT4ge1xuICBjb25zdCBlcnJvcnMgPSBhcHBseVJ1bGVTZXQodHJpZ2dlclJ1bGVzKGFsbEFjdGlvbnMpKSh0cmlnZ2VyKTtcblxuICByZXR1cm4gZXJyb3JzO1xufTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVHJpZ2dlcnMgPSAodHJpZ2dlcnMsIGFsbEFjdGlvbnMpID0+ICQodHJpZ2dlcnMsIFtcbiAgbWFwKHQgPT4gdmFsaWRhdGVUcmlnZ2VyKHQsIGFsbEFjdGlvbnMpKSxcbiAgZmxhdHRlbixcbl0pO1xuIiwiaW1wb3J0IHsgYXBwRGVmaW5pdGlvbkZpbGUgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgY29uc3RydWN0SGllcmFyY2h5IH0gZnJvbSAnLi9jcmVhdGVOb2Rlcyc7XG5cbmV4cG9ydCBjb25zdCBnZXRBcHBsaWNhdGlvbkRlZmluaXRpb24gPSBkYXRhc3RvcmUgPT4gYXN5bmMgKCkgPT4ge1xuICBjb25zdCBleGlzdHMgPSBhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGFwcERlZmluaXRpb25GaWxlKTtcblxuICBpZiAoIWV4aXN0cykgdGhyb3cgbmV3IEVycm9yKCdBcHBsaWNhdGlvbiBkZWZpbml0aW9uIGRvZXMgbm90IGV4aXN0Jyk7XG5cbiAgY29uc3QgYXBwRGVmaW5pdGlvbiA9IGF3YWl0IGRhdGFzdG9yZS5sb2FkSnNvbihhcHBEZWZpbml0aW9uRmlsZSk7XG4gIGFwcERlZmluaXRpb24uaGllcmFyY2h5ID0gY29uc3RydWN0SGllcmFyY2h5KFxuICAgIGFwcERlZmluaXRpb24uaGllcmFyY2h5LFxuICApO1xuICByZXR1cm4gYXBwRGVmaW5pdGlvbjtcbn07XG4iLCJpbXBvcnQgeyBqb2luIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IGFwcERlZmluaXRpb25GaWxlIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHZhbGlkYXRlQWxsIH0gZnJvbSAnLi92YWxpZGF0ZSc7XG5pbXBvcnQgeyBhcGlXcmFwcGVyIH0gZnJvbSAnLi4vY29tbW9uL2FwaVdyYXBwZXInO1xuaW1wb3J0IHsgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uL2V2ZW50cyc7XG5cbmV4cG9ydCBjb25zdCBzYXZlQXBwbGljYXRpb25IaWVyYXJjaHkgPSBhcHAgPT4gYXN5bmMgaGllcmFyY2h5ID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLnRlbXBsYXRlQXBpLnNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSxcbiAgcGVybWlzc2lvbi53cml0ZVRlbXBsYXRlcy5pc0F1dGhvcml6ZWQsXG4gIHsgaGllcmFyY2h5IH0sXG4gIF9zYXZlQXBwbGljYXRpb25IaWVyYXJjaHksIGFwcC5kYXRhc3RvcmUsIGhpZXJhcmNoeSxcbik7XG5cblxuZXhwb3J0IGNvbnN0IF9zYXZlQXBwbGljYXRpb25IaWVyYXJjaHkgPSBhc3luYyAoZGF0YXN0b3JlLCBoaWVyYXJjaHkpID0+IHtcbiAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IGF3YWl0IHZhbGlkYXRlQWxsKGhpZXJhcmNoeSk7XG4gIGlmICh2YWxpZGF0aW9uRXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEhpZXJhcmNoeSBpcyBpbnZhbGlkOiAke2pvaW4oXG4gICAgICB2YWxpZGF0aW9uRXJyb3JzLm1hcChlID0+IGAke2UuaXRlbS5ub2RlS2V5ID8gZS5pdGVtLm5vZGVLZXkoKSA6ICcnfSA6ICR7ZS5lcnJvcn1gKSxcbiAgICAgICcsJyxcbiAgICApfWApO1xuICB9XG5cbiAgaWYgKGF3YWl0IGRhdGFzdG9yZS5leGlzdHMoYXBwRGVmaW5pdGlvbkZpbGUpKSB7XG4gICAgY29uc3QgYXBwRGVmaW5pdGlvbiA9IGF3YWl0IGRhdGFzdG9yZS5sb2FkSnNvbihhcHBEZWZpbml0aW9uRmlsZSk7XG4gICAgYXBwRGVmaW5pdGlvbi5oaWVyYXJjaHkgPSBoaWVyYXJjaHk7XG4gICAgYXdhaXQgZGF0YXN0b3JlLnVwZGF0ZUpzb24oYXBwRGVmaW5pdGlvbkZpbGUsIGFwcERlZmluaXRpb24pO1xuICB9IGVsc2Uge1xuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoJy8uY29uZmlnJyk7XG4gICAgY29uc3QgYXBwRGVmaW5pdGlvbiA9IHsgYWN0aW9uczogW10sIHRyaWdnZXJzOiBbXSwgaGllcmFyY2h5IH07XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oYXBwRGVmaW5pdGlvbkZpbGUsIGFwcERlZmluaXRpb24pO1xuICB9XG59O1xuIiwiaW1wb3J0IHsgam9pbiB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgYXBwRGVmaW5pdGlvbkZpbGUgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgdmFsaWRhdGVUcmlnZ2VycywgdmFsaWRhdGVBY3Rpb25zIH0gZnJvbSAnLi92YWxpZGF0ZSc7XG5pbXBvcnQgeyBhcGlXcmFwcGVyIH0gZnJvbSAnLi4vY29tbW9uL2FwaVdyYXBwZXInO1xuaW1wb3J0IHsgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uL2V2ZW50cyc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnMgPSBhcHAgPT4gYXN5bmMgKGFjdGlvbnMsIHRyaWdnZXJzKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy50ZW1wbGF0ZUFwaS5zYXZlQWN0aW9uc0FuZFRyaWdnZXJzLFxuICBwZXJtaXNzaW9uLndyaXRlVGVtcGxhdGVzLmlzQXV0aG9yaXplZCxcbiAgeyBhY3Rpb25zLCB0cmlnZ2VycyB9LFxuICBfc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycywgYXBwLmRhdGFzdG9yZSwgYWN0aW9ucywgdHJpZ2dlcnMsXG4pO1xuXG5leHBvcnQgY29uc3QgX3NhdmVBY3Rpb25zQW5kVHJpZ2dlcnMgPSBhc3luYyAoZGF0YXN0b3JlLCBhY3Rpb25zLCB0cmlnZ2VycykgPT4ge1xuICBpZiAoYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhhcHBEZWZpbml0aW9uRmlsZSkpIHtcbiAgICBjb25zdCBhcHBEZWZpbml0aW9uID0gYXdhaXQgZGF0YXN0b3JlLmxvYWRKc29uKGFwcERlZmluaXRpb25GaWxlKTtcbiAgICBhcHBEZWZpbml0aW9uLmFjdGlvbnMgPSBhY3Rpb25zO1xuICAgIGFwcERlZmluaXRpb24udHJpZ2dlcnMgPSB0cmlnZ2VycztcblxuICAgIGNvbnN0IGFjdGlvblZhbGlkRXJycyA9IG1hcChlID0+IGUuZXJyb3IpKHZhbGlkYXRlQWN0aW9ucyhhY3Rpb25zKSk7XG5cbiAgICBpZiAoYWN0aW9uVmFsaWRFcnJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYEFjdGlvbnMgYXJlIGludmFsaWQ6ICR7am9pbihhY3Rpb25WYWxpZEVycnMsICcsICcpfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHRyaWdnZXJWYWxpZEVycnMgPSBtYXAoZSA9PiBlLmVycm9yKSh2YWxpZGF0ZVRyaWdnZXJzKHRyaWdnZXJzLCBhY3Rpb25zKSk7XG5cbiAgICBpZiAodHJpZ2dlclZhbGlkRXJycy5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBUcmlnZ2VycyBhcmUgaW52YWxpZDogJHtqb2luKHRyaWdnZXJWYWxpZEVycnMsICcsICcpfWApO1xuICAgIH1cblxuICAgIGF3YWl0IGRhdGFzdG9yZS51cGRhdGVKc29uKGFwcERlZmluaXRpb25GaWxlLCBhcHBEZWZpbml0aW9uKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdDYW5ub3Qgc2F2ZSBhY3Rpb25zOiBBcHBsaWNhdGlvbiBkZWZpbml0aW9uIGRvZXMgbm90IGV4aXN0Jyk7XG4gIH1cbn07XG4iLCJcbmV4cG9ydCBjb25zdCBnZXRCZWhhdmlvdXJTb3VyY2VzID0gYXN5bmMgKGRhdGFzdG9yZSkgPT4ge1xuICAgIGF3YWl0IGRhdGFzdG9yZS5sb2FkRmlsZSgnLy5jb25maWcvYmVoYXZpb3VyU291cmNlcy5qcycpO1xufTtcbiIsImltcG9ydCB7XG4gIGdldE5ld1Jvb3RMZXZlbCxcbiAgZ2V0TmV3UmVjb3JkVGVtcGxhdGUsIGdldE5ld0luZGV4VGVtcGxhdGUsXG4gIGNyZWF0ZU5vZGVFcnJvcnMsIGNvbnN0cnVjdEhpZXJhcmNoeSxcbiAgZ2V0TmV3QWdncmVnYXRlR3JvdXBUZW1wbGF0ZSwgZ2V0TmV3U2luZ2xlUmVjb3JkVGVtcGxhdGUsXG4gIGdldE5ld0FnZ3JlZ2F0ZVRlbXBsYXRlLCBjb25zdHJ1Y3ROb2RlLFxufVxuICBmcm9tICcuL2NyZWF0ZU5vZGVzJztcbmltcG9ydCB7XG4gIGdldE5ld0ZpZWxkLCB2YWxpZGF0ZUZpZWxkLFxuICBhZGRGaWVsZCwgZmllbGRFcnJvcnMsXG59IGZyb20gJy4vZmllbGRzJztcbmltcG9ydCB7XG4gIGdldE5ld1JlY29yZFZhbGlkYXRpb25SdWxlLCBjb21tb25SZWNvcmRWYWxpZGF0aW9uUnVsZXMsXG4gIGFkZFJlY29yZFZhbGlkYXRpb25SdWxlLFxufSBmcm9tICcuL3JlY29yZFZhbGlkYXRpb25SdWxlcyc7XG5pbXBvcnQgeyBjcmVhdGVBY3Rpb24sIGNyZWF0ZVRyaWdnZXIgfSBmcm9tICcuL2NyZWF0ZUFjdGlvbnMnO1xuaW1wb3J0IHtcbiAgdmFsaWRhdGVUcmlnZ2VycywgdmFsaWRhdGVUcmlnZ2VyLCB2YWxpZGF0ZU5vZGUsXG4gIHZhbGlkYXRlQWN0aW9ucywgdmFsaWRhdGVBbGwsXG59IGZyb20gJy4vdmFsaWRhdGUnO1xuaW1wb3J0IHsgZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uIH0gZnJvbSAnLi9nZXRBcHBsaWNhdGlvbkRlZmluaXRpb24nO1xuaW1wb3J0IHsgc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5IH0gZnJvbSAnLi9zYXZlQXBwbGljYXRpb25IaWVyYXJjaHknO1xuaW1wb3J0IHsgc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycyB9IGZyb20gJy4vc2F2ZUFjdGlvbnNBbmRUcmlnZ2Vycyc7XG5pbXBvcnQgeyBhbGwgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBnZXRCZWhhdmlvdXJTb3VyY2VzIH0gZnJvbSBcIi4vZ2V0QmVoYXZpb3VyU291cmNlc1wiO1xuXG5jb25zdCBhcGkgPSBhcHAgPT4gKHtcblxuICBnZXRBcHBsaWNhdGlvbkRlZmluaXRpb246IGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbihhcHAuZGF0YXN0b3JlKSxcbiAgc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5OiBzYXZlQXBwbGljYXRpb25IaWVyYXJjaHkoYXBwKSxcbiAgc2F2ZUFjdGlvbnNBbmRUcmlnZ2Vyczogc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycyhhcHApLFxuICBnZXRCZWhhdmlvdXJTb3VyY2VzOiAoKSA9PiBnZXRCZWhhdmlvdXJTb3VyY2VzKGFwcC5kYXRhc3RvcmUpLFxuICBnZXROZXdSb290TGV2ZWwsXG4gIGNvbnN0cnVjdE5vZGUsXG4gIGdldE5ld0luZGV4VGVtcGxhdGUsXG4gIGdldE5ld1JlY29yZFRlbXBsYXRlLFxuICBnZXROZXdGaWVsZCxcbiAgdmFsaWRhdGVGaWVsZCxcbiAgYWRkRmllbGQsXG4gIGZpZWxkRXJyb3JzLFxuICBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZSxcbiAgY29tbW9uUmVjb3JkVmFsaWRhdGlvblJ1bGVzLFxuICBhZGRSZWNvcmRWYWxpZGF0aW9uUnVsZSxcbiAgY3JlYXRlQWN0aW9uLFxuICBjcmVhdGVUcmlnZ2VyLFxuICB2YWxpZGF0ZUFjdGlvbnMsXG4gIHZhbGlkYXRlVHJpZ2dlcixcbiAgZ2V0TmV3QWdncmVnYXRlR3JvdXBUZW1wbGF0ZSxcbiAgZ2V0TmV3QWdncmVnYXRlVGVtcGxhdGUsXG4gIGNvbnN0cnVjdEhpZXJhcmNoeSxcbiAgZ2V0TmV3U2luZ2xlUmVjb3JkVGVtcGxhdGUsXG4gIGFsbFR5cGVzOiBhbGwsXG4gIHZhbGlkYXRlTm9kZSxcbiAgdmFsaWRhdGVBbGwsXG4gIHZhbGlkYXRlVHJpZ2dlcnMsXG59KTtcblxuXG5leHBvcnQgY29uc3QgZ2V0VGVtcGxhdGVBcGkgPSBhcHAgPT4gYXBpKGFwcCk7XG5cbmV4cG9ydCBjb25zdCBlcnJvcnMgPSBjcmVhdGVOb2RlRXJyb3JzO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRUZW1wbGF0ZUFwaTtcbiIsImltcG9ydCB7IG1hcCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBVU0VSU19MSVNUX0ZJTEUsXG4gIHN0cmlwVXNlck9mU2Vuc2l0aXZlU3R1ZmYsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyAkLCBhcGlXcmFwcGVyLCBldmVudHMgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZ2V0VXNlcnMgPSBhcHAgPT4gYXN5bmMgKCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5nZXRVc2VycyxcbiAgcGVybWlzc2lvbi5saXN0VXNlcnMuaXNBdXRob3JpemVkLFxuICB7fSxcbiAgX2dldFVzZXJzLCBhcHAsXG4pO1xuXG5leHBvcnQgY29uc3QgX2dldFVzZXJzID0gYXN5bmMgYXBwID0+ICQoYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihVU0VSU19MSVNUX0ZJTEUpLCBbXG4gIG1hcChzdHJpcFVzZXJPZlNlbnNpdGl2ZVN0dWZmKSxcbl0pO1xuIiwiaW1wb3J0IHsgQUNDRVNTX0xFVkVMU19GSUxFIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7IGFwaVdyYXBwZXIsIGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBsb2FkQWNjZXNzTGV2ZWxzID0gYXBwID0+IGFzeW5jICgpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkubG9hZEFjY2Vzc0xldmVscyxcbiAgcGVybWlzc2lvbi5saXN0QWNjZXNzTGV2ZWxzLmlzQXV0aG9yaXplZCxcbiAge30sXG4gIF9sb2FkQWNjZXNzTGV2ZWxzLCBhcHAsXG4pO1xuXG5leHBvcnQgY29uc3QgX2xvYWRBY2Nlc3NMZXZlbHMgPSBhc3luYyBhcHAgPT4gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihBQ0NFU1NfTEVWRUxTX0ZJTEUpO1xuIiwiaW1wb3J0IHtcbiAgZmluZCwgZmlsdGVyLCBzb21lLFxuICBtYXAsIGZsYXR0ZW4sXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHsgX2dldFVzZXJzIH0gZnJvbSAnLi9nZXRVc2Vycyc7XG5pbXBvcnQge1xuICBnZXRVc2VyQnlOYW1lLCB1c2VyQXV0aEZpbGUsXG4gIHBhcnNlVGVtcG9yYXJ5Q29kZSxcbn0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7IF9sb2FkQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi9sb2FkQWNjZXNzTGV2ZWxzJztcbmltcG9ydCB7XG4gIGlzTm90aGluZ09yRW1wdHksICQsIGFwaVdyYXBwZXIsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGFsd2F5c0F1dGhvcml6ZWQgfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuY29uc3QgZHVtbXlIYXNoID0gJyRhcmdvbjJpJHY9MTkkbT00MDk2LHQ9MyxwPTEkVVpSbzQwOVVZQkdqSEpTM0NWNlV4dyRyVTg0cVVxUGVPUkZ6S1ltWVkwY2VCTERhUE8rSldTSDRQZk5pS1hmSUtrJztcblxuZXhwb3J0IGNvbnN0IGF1dGhlbnRpY2F0ZSA9IGFwcCA9PiBhc3luYyAodXNlcm5hbWUsIHBhc3N3b3JkKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmF1dGhlbnRpY2F0ZSxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyB1c2VybmFtZSwgcGFzc3dvcmQgfSxcbiAgX2F1dGhlbnRpY2F0ZSwgYXBwLCB1c2VybmFtZSwgcGFzc3dvcmQsXG4pO1xuXG5leHBvcnQgY29uc3QgX2F1dGhlbnRpY2F0ZSA9IGFzeW5jIChhcHAsIHVzZXJuYW1lLCBwYXNzd29yZCkgPT4ge1xuICBpZiAoaXNOb3RoaW5nT3JFbXB0eSh1c2VybmFtZSkgfHwgaXNOb3RoaW5nT3JFbXB0eShwYXNzd29yZCkpIHsgcmV0dXJuIG51bGw7IH1cblxuICBjb25zdCBhbGxVc2VycyA9IGF3YWl0IF9nZXRVc2VycyhhcHApO1xuICBsZXQgdXNlciA9IGdldFVzZXJCeU5hbWUoXG4gICAgYWxsVXNlcnMsXG4gICAgdXNlcm5hbWUsXG4gICk7XG5cbiAgY29uc3Qgbm90QVVzZXIgPSAnbm90LWEtdXNlcic7XG4gIC8vIGNvbnRpbnVlIHdpdGggbm9uLXVzZXIgLSBzbyB0aW1lIHRvIHZlcmlmeSByZW1haW5zIGNvbnNpc3RlbnRcbiAgLy8gd2l0aCB2ZXJpZmljYXRpb24gb2YgYSB2YWxpZCB1c2VyXG4gIGlmICghdXNlciB8fCAhdXNlci5lbmFibGVkKSB7IHVzZXIgPSBub3RBVXNlcjsgfVxuXG4gIGxldCB1c2VyQXV0aDtcbiAgdHJ5IHtcbiAgICB1c2VyQXV0aCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgICB1c2VyQXV0aEZpbGUodXNlcm5hbWUpLFxuICAgICk7XG4gIH0gY2F0Y2ggKF8pIHtcbiAgICB1c2VyQXV0aCA9IHsgYWNjZXNzTGV2ZWxzOiBbXSwgcGFzc3dvcmRIYXNoOiBkdW1teUhhc2ggfTtcbiAgfVxuXG4gIGNvbnN0IHBlcm1pc3Npb25zID0gYXdhaXQgYnVpbGRVc2VyUGVybWlzc2lvbnMoYXBwLCB1c2VyLmFjY2Vzc0xldmVscyk7XG5cbiAgY29uc3QgdmVyaWZpZWQgPSBhd2FpdCBhcHAuY3J5cHRvLnZlcmlmeShcbiAgICB1c2VyQXV0aC5wYXNzd29yZEhhc2gsXG4gICAgcGFzc3dvcmQsXG4gICk7XG5cbiAgaWYgKHVzZXIgPT09IG5vdEFVc2VyKSB7IHJldHVybiBudWxsOyB9XG5cbiAgcmV0dXJuIHZlcmlmaWVkXG4gICAgPyB7XG4gICAgICAuLi51c2VyLCBwZXJtaXNzaW9ucywgdGVtcDogZmFsc2UsIGlzVXNlcjogdHJ1ZSxcbiAgICB9XG4gICAgOiBudWxsO1xufTtcblxuZXhwb3J0IGNvbnN0IGF1dGhlbnRpY2F0ZVRlbXBvcmFyeUFjY2VzcyA9IGFwcCA9PiBhc3luYyAodGVtcEFjY2Vzc0NvZGUpID0+IHtcbiAgaWYgKGlzTm90aGluZ09yRW1wdHkodGVtcEFjY2Vzc0NvZGUpKSB7IHJldHVybiBudWxsOyB9XG5cbiAgY29uc3QgdGVtcCA9IHBhcnNlVGVtcG9yYXJ5Q29kZSh0ZW1wQWNjZXNzQ29kZSk7XG4gIGxldCB1c2VyID0gJChhd2FpdCBfZ2V0VXNlcnMoYXBwKSwgW1xuICAgIGZpbmQodSA9PiB1LnRlbXBvcmFyeUFjY2Vzc0lkID09PSB0ZW1wLmlkKSxcbiAgXSk7XG5cbiAgY29uc3Qgbm90QVVzZXIgPSAnbm90LWEtdXNlcic7XG4gIGlmICghdXNlciB8fCAhdXNlci5lbmFibGVkKSB7IHVzZXIgPSBub3RBVXNlcjsgfVxuXG4gIGxldCB1c2VyQXV0aDtcbiAgdHJ5IHtcbiAgICB1c2VyQXV0aCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgICB1c2VyQXV0aEZpbGUodXNlci5uYW1lKSxcbiAgICApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdXNlckF1dGggPSB7XG4gICAgICB0ZW1wb3JhcnlBY2Nlc3NIYXNoOiBkdW1teUhhc2gsXG4gICAgICB0ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaDogKGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKSArIDEwMDAwKSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKHVzZXJBdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoIDwgYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpKSB7IHVzZXIgPSBub3RBVXNlcjsgfVxuXG4gIGNvbnN0IHRlbXBDb2RlID0gIXRlbXAuY29kZSA/IGdlbmVyYXRlKCkgOiB0ZW1wLmNvZGU7XG4gIGNvbnN0IHZlcmlmaWVkID0gYXdhaXQgYXBwLmNyeXB0by52ZXJpZnkoXG4gICAgdXNlckF1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaCxcbiAgICB0ZW1wQ29kZSxcbiAgKTtcblxuICBpZiAodXNlciA9PT0gbm90QVVzZXIpIHsgcmV0dXJuIG51bGw7IH1cblxuICByZXR1cm4gdmVyaWZpZWRcbiAgICA/IHtcbiAgICAgIC4uLnVzZXIsXG4gICAgICBwZXJtaXNzaW9uczogW10sXG4gICAgICB0ZW1wOiB0cnVlLFxuICAgICAgaXNVc2VyOiB0cnVlLFxuICAgIH1cbiAgICA6IG51bGw7XG59O1xuXG5leHBvcnQgY29uc3QgYnVpbGRVc2VyUGVybWlzc2lvbnMgPSBhc3luYyAoYXBwLCB1c2VyQWNjZXNzTGV2ZWxzKSA9PiB7XG4gIGNvbnN0IGFsbEFjY2Vzc0xldmVscyA9IGF3YWl0IF9sb2FkQWNjZXNzTGV2ZWxzKGFwcCk7XG5cbiAgcmV0dXJuICQoYWxsQWNjZXNzTGV2ZWxzLmxldmVscywgW1xuICAgIGZpbHRlcihsID0+IHNvbWUodWEgPT4gbC5uYW1lID09PSB1YSkodXNlckFjY2Vzc0xldmVscykpLFxuICAgIG1hcChsID0+IGwucGVybWlzc2lvbnMpLFxuICAgIGZsYXR0ZW4sXG4gIF0pO1xufTtcbiIsImltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnc2hvcnRpZCc7XG5pbXBvcnQge1xuICB0ZW1wQ29kZUV4cGlyeUxlbmd0aCwgVVNFUlNfTE9DS19GSUxFLFxuICBVU0VSU19MSVNUX0ZJTEUsIHVzZXJBdXRoRmlsZSxcbiAgZ2V0VXNlckJ5TmFtZSxcbn0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7XG4gIGdldExvY2ssIGlzTm9sb2NrLFxuICByZWxlYXNlTG9jayxcbn0gZnJvbSAnLi4vY29tbW9uL2xvY2snO1xuaW1wb3J0IHsgYXBpV3JhcHBlciwgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGFsd2F5c0F1dGhvcml6ZWQgfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyA9IGFwcCA9PiBhc3luYyB1c2VyTmFtZSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmNyZWF0ZVRlbXBvcmFyeUFjY2VzcyxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyB1c2VyTmFtZSB9LFxuICBfY3JlYXRlVGVtcG9yYXJ5QWNjZXNzLCBhcHAsIHVzZXJOYW1lLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MgPSBhc3luYyAoYXBwLCB1c2VyTmFtZSkgPT4ge1xuICBjb25zdCB0ZW1wQ29kZSA9IGF3YWl0IGdldFRlbXBvcmFyeUNvZGUoYXBwKTtcblxuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhcbiAgICBhcHAsIFVTRVJTX0xPQ0tfRklMRSwgMTAwMCwgMixcbiAgKTtcblxuICBpZiAoaXNOb2xvY2sobG9jaykpIHsgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gY3JlYXRlIHRlbXBvcmFyeSBhY2Nlc3MsIGNvdWxkIG5vdCBnZXQgbG9jayAtIHRyeSBhZ2FpbicpOyB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB1c2VycyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oVVNFUlNfTElTVF9GSUxFKTtcblxuICAgIGNvbnN0IHVzZXIgPSBnZXRVc2VyQnlOYW1lKHVzZXJzLCB1c2VyTmFtZSk7XG4gICAgdXNlci50ZW1wb3JhcnlBY2Nlc3NJZCA9IHRlbXBDb2RlLnRlbXBvcmFyeUFjY2Vzc0lkO1xuXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFxuICAgICAgVVNFUlNfTElTVF9GSUxFLFxuICAgICAgdXNlcnMsXG4gICAgKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xuICB9XG5cbiAgY29uc3QgdXNlckF1dGggPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgIHVzZXJBdXRoRmlsZSh1c2VyTmFtZSksXG4gICk7XG4gIHVzZXJBdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2ggPSB0ZW1wQ29kZS50ZW1wb3JhcnlBY2Nlc3NIYXNoO1xuXG4gIHVzZXJBdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID0gdGVtcENvZGUudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2g7XG5cbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFxuICAgIHVzZXJBdXRoRmlsZSh1c2VyTmFtZSksXG4gICAgdXNlckF1dGgsXG4gICk7XG5cbiAgcmV0dXJuIHRlbXBDb2RlLnRlbXBDb2RlO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFRlbXBvcmFyeUNvZGUgPSBhc3luYyAoYXBwKSA9PiB7XG4gIGNvbnN0IHRlbXBDb2RlID0gZ2VuZXJhdGUoKVxuICAgICAgICArIGdlbmVyYXRlKClcbiAgICAgICAgKyBnZW5lcmF0ZSgpXG4gICAgICAgICsgZ2VuZXJhdGUoKTtcblxuICBjb25zdCB0ZW1wSWQgPSBnZW5lcmF0ZSgpO1xuXG4gIHJldHVybiB7XG4gICAgdGVtcG9yYXJ5QWNjZXNzSGFzaDogYXdhaXQgYXBwLmNyeXB0by5oYXNoKFxuICAgICAgdGVtcENvZGUsXG4gICAgKSxcbiAgICB0ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaDpcbiAgICAgICAgICAgIChhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCkpICsgdGVtcENvZGVFeHBpcnlMZW5ndGgsXG4gICAgdGVtcENvZGU6IGB0bXA6JHt0ZW1wSWR9OiR7dGVtcENvZGV9YCxcbiAgICB0ZW1wb3JhcnlBY2Nlc3NJZDogdGVtcElkLFxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGxvb2tzTGlrZVRlbXBvcmFyeUNvZGUgPSBjb2RlID0+IGNvZGUuc3RhcnRzV2l0aCgndG1wOicpO1xuIiwiaW1wb3J0IHtcbiAgbWFwLCB1bmlxV2l0aCxcbiAgZmxhdHRlbiwgZmlsdGVyLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSB9IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcbmltcG9ydCB7XG4gICQsIGluc2Vuc2l0aXZlRXF1YWxzLCBhcGlXcmFwcGVyLCBldmVudHMsXG4gIGlzTm9uRW1wdHlTdHJpbmcsIGFsbCxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGFsd2F5c0F1dGhvcml6ZWQgfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuY29uc3QgdXNlclJ1bGVzID0gYWxsVXNlcnMgPT4gW1xuICBtYWtlcnVsZSgnbmFtZScsICd1c2VybmFtZSBtdXN0IGJlIHNldCcsXG4gICAgdSA9PiBpc05vbkVtcHR5U3RyaW5nKHUubmFtZSkpLFxuICBtYWtlcnVsZSgnYWNjZXNzTGV2ZWxzJywgJ3VzZXIgbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBhY2Nlc3MgbGV2ZWwnLFxuICAgIHUgPT4gdS5hY2Nlc3NMZXZlbHMubGVuZ3RoID4gMCksXG4gIG1ha2VydWxlKCduYW1lJywgJ3VzZXJuYW1lIG11c3QgYmUgdW5pcXVlJyxcbiAgICB1ID0+IGZpbHRlcih1MiA9PiBpbnNlbnNpdGl2ZUVxdWFscyh1Mi5uYW1lLCB1Lm5hbWUpKShhbGxVc2VycykubGVuZ3RoID09PSAxKSxcbiAgbWFrZXJ1bGUoJ2FjY2Vzc0xldmVscycsICdhY2Nlc3MgbGV2ZWxzIG11c3Qgb25seSBjb250YWluIHN0aW5ncycsXG4gICAgdSA9PiBhbGwoaXNOb25FbXB0eVN0cmluZykodS5hY2Nlc3NMZXZlbHMpKSxcbl07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVVzZXIgPSAoKSA9PiAoYWxsdXNlcnMsIHVzZXIpID0+IGFwcGx5UnVsZVNldCh1c2VyUnVsZXMoYWxsdXNlcnMpKSh1c2VyKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVXNlcnMgPSBhcHAgPT4gYWxsVXNlcnMgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS52YWxpZGF0ZVVzZXJzLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IGFsbFVzZXJzIH0sXG4gIF92YWxpZGF0ZVVzZXJzLCBhcHAsIGFsbFVzZXJzLFxuKTtcblxuZXhwb3J0IGNvbnN0IF92YWxpZGF0ZVVzZXJzID0gKGFwcCwgYWxsVXNlcnMpID0+ICQoYWxsVXNlcnMsIFtcbiAgbWFwKGwgPT4gdmFsaWRhdGVVc2VyKGFwcCkoYWxsVXNlcnMsIGwpKSxcbiAgZmxhdHRlbixcbiAgdW5pcVdpdGgoKHgsIHkpID0+IHguZmllbGQgPT09IHkuZmllbGRcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHguaXRlbSA9PT0geS5pdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB4LmVycm9yID09PSB5LmVycm9yKSxcbl0pO1xuIiwiaW1wb3J0IHsgYXBpV3JhcHBlclN5bmMsIGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdVc2VyID0gYXBwID0+ICgpID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmdldE5ld1VzZXIsXG4gIHBlcm1pc3Npb24uY3JlYXRlVXNlci5pc0F1dGhvcml6ZWQsXG4gIHt9LFxuICBfZ2V0TmV3VXNlciwgYXBwLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9nZXROZXdVc2VyID0gKCkgPT4gKHtcbiAgbmFtZTogJycsXG4gIGFjY2Vzc0xldmVsczogW10sXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHRlbXBvcmFyeUFjY2Vzc0lkOiAnJyxcbn0pO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3VXNlckF1dGggPSBhcHAgPT4gKCkgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuZ2V0TmV3VXNlckF1dGgsXG4gIHBlcm1pc3Npb24uY3JlYXRlVXNlci5pc0F1dGhvcml6ZWQsXG4gIHt9LFxuICBfZ2V0TmV3VXNlckF1dGgsIGFwcCxcbik7XG5cbmV4cG9ydCBjb25zdCBfZ2V0TmV3VXNlckF1dGggPSAoKSA9PiAoe1xuICBwYXNzd29yZEhhc2g6ICcnLFxuICB0ZW1wb3JhcnlBY2Nlc3NIYXNoOiAnJyxcbiAgdGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2g6IDAsXG59KTtcbiIsImltcG9ydCB7IGZpbmQgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgdXNlckF1dGhGaWxlLCBwYXJzZVRlbXBvcmFyeUNvZGUgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHtcbiAgaXNTb21ldGhpbmcsICQsIGFwaVdyYXBwZXIsIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBfZ2V0VXNlcnMgfSBmcm9tICcuL2dldFVzZXJzJztcbmltcG9ydCB7IGFsd2F5c0F1dGhvcml6ZWQgfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGlzVmFsaWRQYXNzd29yZCA9IGFwcCA9PiBwYXNzd29yZCA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5pc1ZhbGlkUGFzc3dvcmQsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgcGFzc3dvcmQgfSxcbiAgX2lzVmFsaWRQYXNzd29yZCwgYXBwLCBwYXNzd29yZCxcbik7XG5cbmV4cG9ydCBjb25zdCBfaXNWYWxpZFBhc3N3b3JkID0gKGFwcCwgcGFzc3dvcmQpID0+IHNjb3JlUGFzc3dvcmQocGFzc3dvcmQpLnNjb3JlID4gMzA7XG5cbmV4cG9ydCBjb25zdCBjaGFuZ2VNeVBhc3N3b3JkID0gYXBwID0+IGFzeW5jIChjdXJyZW50UHcsIG5ld3Bhc3N3b3JkKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmNoYW5nZU15UGFzc3dvcmQsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgY3VycmVudFB3LCBuZXdwYXNzd29yZCB9LFxuICBfY2hhbmdlTXlQYXNzd29yZCwgYXBwLCBjdXJyZW50UHcsIG5ld3Bhc3N3b3JkLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9jaGFuZ2VNeVBhc3N3b3JkID0gYXN5bmMgKGFwcCwgY3VycmVudFB3LCBuZXdwYXNzd29yZCkgPT4ge1xuICBjb25zdCBleGlzdGluZ0F1dGggPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgIHVzZXJBdXRoRmlsZShhcHAudXNlci5uYW1lKSxcbiAgKTtcblxuICBpZiAoaXNTb21ldGhpbmcoZXhpc3RpbmdBdXRoLnBhc3N3b3JkSGFzaCkpIHtcbiAgICBjb25zdCB2ZXJpZmllZCA9IGF3YWl0IGFwcC5jcnlwdG8udmVyaWZ5KFxuICAgICAgZXhpc3RpbmdBdXRoLnBhc3N3b3JkSGFzaCxcbiAgICAgIGN1cnJlbnRQdyxcbiAgICApO1xuXG4gICAgaWYgKHZlcmlmaWVkKSB7XG4gICAgICBhd2FpdCBhd2FpdCBkb1NldChcbiAgICAgICAgYXBwLCBleGlzdGluZ0F1dGgsXG4gICAgICAgIGFwcC51c2VyLm5hbWUsIG5ld3Bhc3N3b3JkLFxuICAgICAgKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmV4cG9ydCBjb25zdCBzZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlID0gYXBwID0+IGFzeW5jICh0ZW1wQ29kZSwgbmV3cGFzc3dvcmQpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZSxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyB0ZW1wQ29kZSwgbmV3cGFzc3dvcmQgfSxcbiAgX3NldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUsIGFwcCwgdGVtcENvZGUsIG5ld3Bhc3N3b3JkLFxuKTtcblxuXG5leHBvcnQgY29uc3QgX3NldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUgPSBhc3luYyAoYXBwLCB0ZW1wQ29kZSwgbmV3cGFzc3dvcmQpID0+IHtcbiAgY29uc3QgY3VycmVudFRpbWUgPSBhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCk7XG5cbiAgY29uc3QgdGVtcCA9IHBhcnNlVGVtcG9yYXJ5Q29kZSh0ZW1wQ29kZSk7XG5cbiAgY29uc3QgdXNlciA9ICQoYXdhaXQgX2dldFVzZXJzKGFwcCksIFtcbiAgICBmaW5kKHUgPT4gdS50ZW1wb3JhcnlBY2Nlc3NJZCA9PT0gdGVtcC5pZCksXG4gIF0pO1xuXG4gIGlmICghdXNlcikgeyByZXR1cm4gZmFsc2U7IH1cblxuICBjb25zdCBleGlzdGluZ0F1dGggPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgIHVzZXJBdXRoRmlsZSh1c2VyLm5hbWUpLFxuICApO1xuXG4gIGlmIChpc1NvbWV0aGluZyhleGlzdGluZ0F1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaClcbiAgICAgICAmJiBleGlzdGluZ0F1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPiBjdXJyZW50VGltZSkge1xuICAgIGNvbnN0IHZlcmlmaWVkID0gYXdhaXQgYXBwLmNyeXB0by52ZXJpZnkoXG4gICAgICBleGlzdGluZ0F1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaCxcbiAgICAgIHRlbXAuY29kZSxcbiAgICApO1xuXG4gICAgaWYgKHZlcmlmaWVkKSB7XG4gICAgICBhd2FpdCBkb1NldChcbiAgICAgICAgYXBwLCBleGlzdGluZ0F1dGgsXG4gICAgICAgIHVzZXIubmFtZSwgbmV3cGFzc3dvcmQsXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgZG9TZXQgPSBhc3luYyAoYXBwLCBhdXRoLCB1c2VybmFtZSwgbmV3cGFzc3dvcmQpID0+IHtcbiAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoID0gJyc7XG4gIGF1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPSAwO1xuICBhdXRoLnBhc3N3b3JkSGFzaCA9IGF3YWl0IGFwcC5jcnlwdG8uaGFzaChcbiAgICBuZXdwYXNzd29yZCxcbiAgKTtcbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFxuICAgIHVzZXJBdXRoRmlsZSh1c2VybmFtZSksXG4gICAgYXV0aCxcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzY29yZVBhc3N3b3JkID0gYXBwID0+IHBhc3N3b3JkID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLnNjb3JlUGFzc3dvcmQsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgcGFzc3dvcmQgfSxcbiAgX3Njb3JlUGFzc3dvcmQsIHBhc3N3b3JkLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9zY29yZVBhc3N3b3JkID0gKHBhc3N3b3JkKSA9PiB7XG4gIC8vIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTQ4MTcyL3Bhc3N3b3JkLXN0cmVuZ3RoLW1ldGVyXG4gIC8vIHRoYW5rIHlvdSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3VzZXJzLzQ2NjE3L3RtLWx2XG5cbiAgbGV0IHNjb3JlID0gMDtcbiAgaWYgKCFwYXNzd29yZCkgeyByZXR1cm4gc2NvcmU7IH1cblxuICAvLyBhd2FyZCBldmVyeSB1bmlxdWUgbGV0dGVyIHVudGlsIDUgcmVwZXRpdGlvbnNcbiAgY29uc3QgbGV0dGVycyA9IG5ldyBPYmplY3QoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXNzd29yZC5sZW5ndGg7IGkrKykge1xuICAgIGxldHRlcnNbcGFzc3dvcmRbaV1dID0gKGxldHRlcnNbcGFzc3dvcmRbaV1dIHx8IDApICsgMTtcbiAgICBzY29yZSArPSA1LjAgLyBsZXR0ZXJzW3Bhc3N3b3JkW2ldXTtcbiAgfVxuXG4gIC8vIGJvbnVzIHBvaW50cyBmb3IgbWl4aW5nIGl0IHVwXG4gIGNvbnN0IHZhcmlhdGlvbnMgPSB7XG4gICAgZGlnaXRzOiAvXFxkLy50ZXN0KHBhc3N3b3JkKSxcbiAgICBsb3dlcjogL1thLXpdLy50ZXN0KHBhc3N3b3JkKSxcbiAgICB1cHBlcjogL1tBLVpdLy50ZXN0KHBhc3N3b3JkKSxcbiAgICBub25Xb3JkczogL1xcVy8udGVzdChwYXNzd29yZCksXG4gIH07XG5cbiAgbGV0IHZhcmlhdGlvbkNvdW50ID0gMDtcbiAgZm9yIChjb25zdCBjaGVjayBpbiB2YXJpYXRpb25zKSB7XG4gICAgdmFyaWF0aW9uQ291bnQgKz0gKHZhcmlhdGlvbnNbY2hlY2tdID09IHRydWUpID8gMSA6IDA7XG4gIH1cbiAgc2NvcmUgKz0gKHZhcmlhdGlvbkNvdW50IC0gMSkgKiAxMDtcblxuICBjb25zdCBzdHJlbmd0aFRleHQgPSBzY29yZSA+IDgwXG4gICAgPyAnc3Ryb25nJ1xuICAgIDogc2NvcmUgPiA2MFxuICAgICAgPyAnZ29vZCdcbiAgICAgIDogc2NvcmUgPj0gMzBcbiAgICAgICAgPyAnd2VhaydcbiAgICAgICAgOiAndmVyeSB3ZWFrJztcblxuICByZXR1cm4ge1xuICAgIHNjb3JlOiBwYXJzZUludChzY29yZSksXG4gICAgc3RyZW5ndGhUZXh0LFxuICB9O1xufTtcbiIsImltcG9ydCB7IGpvaW4sIHNvbWUgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgdmFsaWRhdGVVc2VyIH0gZnJvbSAnLi92YWxpZGF0ZVVzZXInO1xuaW1wb3J0IHsgZ2V0TmV3VXNlckF1dGggfSBmcm9tICcuL2dldE5ld1VzZXInO1xuaW1wb3J0IHtcbiAgZ2V0TG9jaywgaXNOb2xvY2ssIHJlbGVhc2VMb2NrLCBhcGlXcmFwcGVyLCBldmVudHMsXG4gIGluc2Vuc2l0aXZlRXF1YWxzLCBpc05vbkVtcHR5U3RyaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgVVNFUlNfTE9DS19GSUxFLCBzdHJpcFVzZXJPZlNlbnNpdGl2ZVN0dWZmLFxuICBVU0VSU19MSVNUX0ZJTEUsIHVzZXJBdXRoRmlsZSxcbn0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7IGdldFRlbXBvcmFyeUNvZGUgfSBmcm9tICcuL2NyZWF0ZVRlbXBvcmFyeUFjY2Vzcyc7XG5pbXBvcnQgeyBpc1ZhbGlkUGFzc3dvcmQgfSBmcm9tICcuL3NldFBhc3N3b3JkJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlVXNlciA9IGFwcCA9PiBhc3luYyAodXNlciwgcGFzc3dvcmQgPSBudWxsKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmNyZWF0ZVVzZXIsXG4gIHBlcm1pc3Npb24uY3JlYXRlVXNlci5pc0F1dGhvcml6ZWQsXG4gIHsgdXNlciwgcGFzc3dvcmQgfSxcbiAgX2NyZWF0ZVVzZXIsIGFwcCwgdXNlciwgcGFzc3dvcmQsXG4pO1xuXG5leHBvcnQgY29uc3QgX2NyZWF0ZVVzZXIgPSBhc3luYyAoYXBwLCB1c2VyLCBwYXNzd29yZCA9IG51bGwpID0+IHtcbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldExvY2soXG4gICAgYXBwLCBVU0VSU19MT0NLX0ZJTEUsIDEwMDAsIDIsXG4gICk7XG5cbiAgaWYgKGlzTm9sb2NrKGxvY2spKSB7IHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGNyZWF0ZSB1c2VyLCBjb3VsZCBub3QgZ2V0IGxvY2sgLSB0cnkgYWdhaW4nKTsgfVxuXG4gIGNvbnN0IHVzZXJzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihVU0VSU19MSVNUX0ZJTEUpO1xuXG4gIGNvbnN0IHVzZXJFcnJvcnMgPSB2YWxpZGF0ZVVzZXIoYXBwKShbLi4udXNlcnMsIHVzZXJdLCB1c2VyKTtcbiAgaWYgKHVzZXJFcnJvcnMubGVuZ3RoID4gMCkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBVc2VyIGlzIGludmFsaWQuICR7am9pbignOyAnKSh1c2VyRXJyb3JzKX1gKTsgfVxuXG4gIGNvbnN0IHsgYXV0aCwgdGVtcENvZGUsIHRlbXBvcmFyeUFjY2Vzc0lkIH0gPSBhd2FpdCBnZXRBY2Nlc3MoXG4gICAgYXBwLCBwYXNzd29yZCxcbiAgKTtcbiAgdXNlci50ZW1wQ29kZSA9IHRlbXBDb2RlO1xuICB1c2VyLnRlbXBvcmFyeUFjY2Vzc0lkID0gdGVtcG9yYXJ5QWNjZXNzSWQ7XG5cbiAgaWYgKHNvbWUodSA9PiBpbnNlbnNpdGl2ZUVxdWFscyh1Lm5hbWUsIHVzZXIubmFtZSkpKHVzZXJzKSkgeyBcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdVc2VyIGFscmVhZHkgZXhpc3RzJyk7IFxuICB9XG5cbiAgdXNlcnMucHVzaChcbiAgICBzdHJpcFVzZXJPZlNlbnNpdGl2ZVN0dWZmKHVzZXIpLFxuICApO1xuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgICBVU0VSU19MSVNUX0ZJTEUsXG4gICAgdXNlcnMsXG4gICk7XG5cbiAgdHJ5IHtcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmNyZWF0ZUpzb24oXG4gICAgICB1c2VyQXV0aEZpbGUodXNlci5uYW1lKSxcbiAgICAgIGF1dGgsXG4gICAgKTtcbiAgfSBjYXRjaCAoXykge1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgICAgIHVzZXJBdXRoRmlsZSh1c2VyLm5hbWUpLFxuICAgICAgYXV0aCxcbiAgICApO1xuICB9XG5cbiAgYXdhaXQgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcblxuICByZXR1cm4gdXNlcjtcbn07XG5cbmNvbnN0IGdldEFjY2VzcyA9IGFzeW5jIChhcHAsIHBhc3N3b3JkKSA9PiB7XG4gIGNvbnN0IGF1dGggPSBnZXROZXdVc2VyQXV0aChhcHApKCk7XG5cbiAgaWYgKGlzTm9uRW1wdHlTdHJpbmcocGFzc3dvcmQpKSB7XG4gICAgaWYgKGlzVmFsaWRQYXNzd29yZChwYXNzd29yZCkpIHtcbiAgICAgIGF1dGgucGFzc3dvcmRIYXNoID0gYXdhaXQgYXBwLmNyeXB0by5oYXNoKHBhc3N3b3JkKTtcbiAgICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaCA9ICcnO1xuICAgICAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NJZCA9ICcnO1xuICAgICAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA9IDA7XG4gICAgICByZXR1cm4geyBhdXRoIH07XG4gICAgfVxuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ1Bhc3N3b3JkIGRvZXMgbm90IG1lZXQgcmVxdWlyZW1lbnRzJyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgdGVtcEFjY2VzcyA9IGF3YWl0IGdldFRlbXBvcmFyeUNvZGUoYXBwKTtcbiAgICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2ggPSB0ZW1wQWNjZXNzLnRlbXBvcmFyeUFjY2Vzc0hhc2g7XG4gICAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA9IHRlbXBBY2Nlc3MudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2g7XG4gICAgYXV0aC5wYXNzd29yZEhhc2ggPSAnJztcbiAgICByZXR1cm4gKHtcbiAgICAgIGF1dGgsXG4gICAgICB0ZW1wQ29kZTogdGVtcEFjY2Vzcy50ZW1wQ29kZSxcbiAgICAgIHRlbXBvcmFyeUFjY2Vzc0lkOiB0ZW1wQWNjZXNzLnRlbXBvcmFyeUFjY2Vzc0lkLFxuICAgIH0pO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgZ2V0TG9jayxcbiAgaXNOb2xvY2ssIHJlbGVhc2VMb2NrLFxufSBmcm9tICcuLi9jb21tb24vbG9jayc7XG5pbXBvcnQgeyBVU0VSU19MT0NLX0ZJTEUsIFVTRVJTX0xJU1RfRklMRSwgZ2V0VXNlckJ5TmFtZSB9IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyBhcGlXcmFwcGVyLCBldmVudHMgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgTm90Rm91bmRFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgZW5hYmxlVXNlciA9IGFwcCA9PiBhc3luYyB1c2VybmFtZSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmVuYWJsZVVzZXIsXG4gIHBlcm1pc3Npb24uZW5hYmxlRGlzYWJsZVVzZXIuaXNBdXRob3JpemVkLFxuICB7IHVzZXJuYW1lIH0sXG4gIF9lbmFibGVVc2VyLCBhcHAsIHVzZXJuYW1lLFxuKTtcblxuZXhwb3J0IGNvbnN0IGRpc2FibGVVc2VyID0gYXBwID0+IGFzeW5jIHVzZXJuYW1lID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuZGlzYWJsZVVzZXIsXG4gIHBlcm1pc3Npb24uZW5hYmxlRGlzYWJsZVVzZXIuaXNBdXRob3JpemVkLFxuICB7IHVzZXJuYW1lIH0sXG4gIF9kaXNhYmxlVXNlciwgYXBwLCB1c2VybmFtZSxcbik7XG5cbmV4cG9ydCBjb25zdCBfZW5hYmxlVXNlciA9IGFzeW5jIChhcHAsIHVzZXJuYW1lKSA9PiBhd2FpdCB0b2dnbGVVc2VyKGFwcCwgdXNlcm5hbWUsIHRydWUpO1xuXG5leHBvcnQgY29uc3QgX2Rpc2FibGVVc2VyID0gYXN5bmMgKGFwcCwgdXNlcm5hbWUpID0+IGF3YWl0IHRvZ2dsZVVzZXIoYXBwLCB1c2VybmFtZSwgZmFsc2UpO1xuXG5jb25zdCB0b2dnbGVVc2VyID0gYXN5bmMgKGFwcCwgdXNlcm5hbWUsIGVuYWJsZWQpID0+IHtcbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldExvY2soYXBwLCBVU0VSU19MT0NLX0ZJTEUsIDEwMDAsIDEsIDApO1xuXG4gIGNvbnN0IGFjdGlvbk5hbWUgPSBlbmFibGVkID8gJ2VuYWJsZScgOiAnZGlzYWJsZSc7XG5cbiAgaWYgKGlzTm9sb2NrKGxvY2spKSB7IHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90ICR7YWN0aW9uTmFtZX0gdXNlciAtIGNhbm5vdCBnZXQgbG9ja2ApOyB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB1c2VycyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oVVNFUlNfTElTVF9GSUxFKTtcbiAgICBjb25zdCB1c2VyID0gZ2V0VXNlckJ5TmFtZSh1c2VycywgdXNlcm5hbWUpO1xuICAgIGlmICghdXNlcikgeyB0aHJvdyBuZXcgTm90Rm91bmRFcnJvcihgQ291bGQgbm90IGZpbmQgdXNlciB0byAke2FjdGlvbk5hbWV9YCk7IH1cblxuICAgIGlmICh1c2VyLmVuYWJsZWQgPT09ICFlbmFibGVkKSB7XG4gICAgICB1c2VyLmVuYWJsZWQgPSBlbmFibGVkO1xuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFVTRVJTX0xJU1RfRklMRSwgdXNlcnMpO1xuICAgIH1cbiAgfSBmaW5hbGx5IHtcbiAgICByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xuICB9XG59O1xuIiwiZXhwb3J0IGNvbnN0IGdldE5ld0FjY2Vzc0xldmVsID0gKCkgPT4gKCkgPT4gKHtcbiAgbmFtZTogJycsXG4gIHBlcm1pc3Npb25zOiBbXSxcbiAgZGVmYXVsdDpmYWxzZVxufSk7XG4iLCJpbXBvcnQge1xuICB2YWx1ZXMsIGluY2x1ZGVzLCBtYXAsIGNvbmNhdCwgaXNFbXB0eSwgdW5pcVdpdGgsIHNvbWUsXG4gIGZsYXR0ZW4sIGZpbHRlcixcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGFwcGx5UnVsZVNldCwgbWFrZXJ1bGUgfSBmcm9tICcuLi9jb21tb24vdmFsaWRhdGlvbkNvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uVHlwZXMgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHtcbiAgJCwgaXNTb21ldGhpbmcsIGluc2Vuc2l0aXZlRXF1YWxzLFxuICBpc05vbkVtcHR5U3RyaW5nLCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0Tm9kZSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmNvbnN0IGlzQWxsb3dlZFR5cGUgPSB0ID0+ICQocGVybWlzc2lvblR5cGVzLCBbXG4gIHZhbHVlcyxcbiAgaW5jbHVkZXModCksXG5dKTtcblxuY29uc3QgaXNSZWNvcmRPckluZGV4VHlwZSA9IHQgPT4gc29tZShwID0+IHAgPT09IHQpKFtcbiAgcGVybWlzc2lvblR5cGVzLkNSRUFURV9SRUNPUkQsXG4gIHBlcm1pc3Npb25UeXBlcy5VUERBVEVfUkVDT1JELFxuICBwZXJtaXNzaW9uVHlwZXMuREVMRVRFX1JFQ09SRCxcbiAgcGVybWlzc2lvblR5cGVzLlJFQURfUkVDT1JELFxuICBwZXJtaXNzaW9uVHlwZXMuUkVBRF9JTkRFWCxcbiAgcGVybWlzc2lvblR5cGVzLkVYRUNVVEVfQUNUSU9OLFxuXSk7XG5cblxuY29uc3QgcGVybWlzc2lvblJ1bGVzID0gYXBwID0+IChbXG4gIG1ha2VydWxlKCd0eXBlJywgJ3R5cGUgbXVzdCBiZSBvbmUgb2YgYWxsb3dlZCB0eXBlcycsXG4gICAgcCA9PiBpc0FsbG93ZWRUeXBlKHAudHlwZSkpLFxuICBtYWtlcnVsZSgnbm9kZUtleScsICdyZWNvcmQgYW5kIGluZGV4IHBlcm1pc3Npb25zIG11c3QgaW5jbHVkZSBhIHZhbGlkIG5vZGVLZXknLFxuICAgIHAgPT4gKCFpc1JlY29yZE9ySW5kZXhUeXBlKHAudHlwZSkpXG4gICAgICAgICAgICAgfHwgaXNTb21ldGhpbmcoZ2V0Tm9kZShhcHAuaGllcmFyY2h5LCBwLm5vZGVLZXkpKSksXG5dKTtcblxuY29uc3QgYXBwbHlQZXJtaXNzaW9uUnVsZXMgPSBhcHAgPT4gYXBwbHlSdWxlU2V0KHBlcm1pc3Npb25SdWxlcyhhcHApKTtcblxuY29uc3QgYWNjZXNzTGV2ZWxSdWxlcyA9IGFsbExldmVscyA9PiAoW1xuICBtYWtlcnVsZSgnbmFtZScsICduYW1lIG11c3QgYmUgc2V0JyxcbiAgICBsID0+IGlzTm9uRW1wdHlTdHJpbmcobC5uYW1lKSksXG4gIG1ha2VydWxlKCduYW1lJywgJ2FjY2VzcyBsZXZlbCBuYW1lcyBtdXN0IGJlIHVuaXF1ZScsXG4gICAgbCA9PiBpc0VtcHR5KGwubmFtZSlcbiAgICAgICAgICAgICB8fCBmaWx0ZXIoYSA9PiBpbnNlbnNpdGl2ZUVxdWFscyhsLm5hbWUsIGEubmFtZSkpKGFsbExldmVscykubGVuZ3RoID09PSAxKSxcbl0pO1xuXG5jb25zdCBhcHBseUxldmVsUnVsZXMgPSBhbGxMZXZlbHMgPT4gYXBwbHlSdWxlU2V0KGFjY2Vzc0xldmVsUnVsZXMoYWxsTGV2ZWxzKSk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFjY2Vzc0xldmVsID0gYXBwID0+IChhbGxMZXZlbHMsIGxldmVsKSA9PiB7XG4gIGNvbnN0IGVycnMgPSAkKGxldmVsLnBlcm1pc3Npb25zLCBbXG4gICAgbWFwKGFwcGx5UGVybWlzc2lvblJ1bGVzKGFwcCkpLFxuICAgIGZsYXR0ZW4sXG4gICAgY29uY2F0KFxuICAgICAgYXBwbHlMZXZlbFJ1bGVzKGFsbExldmVscykobGV2ZWwpLFxuICAgICksXG4gIF0pO1xuXG4gIHJldHVybiBlcnJzO1xufTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWNjZXNzTGV2ZWxzID0gYXBwID0+IGFsbExldmVscyA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS52YWxpZGF0ZUFjY2Vzc0xldmVscyxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyBhbGxMZXZlbHMgfSxcbiAgX3ZhbGlkYXRlQWNjZXNzTGV2ZWxzLCBhcHAsIGFsbExldmVscyxcbik7XG5cbmV4cG9ydCBjb25zdCBfdmFsaWRhdGVBY2Nlc3NMZXZlbHMgPSAoYXBwLCBhbGxMZXZlbHMpID0+ICQoYWxsTGV2ZWxzLCBbXG4gIG1hcChsID0+IHZhbGlkYXRlQWNjZXNzTGV2ZWwoYXBwKShhbGxMZXZlbHMsIGwpKSxcbiAgZmxhdHRlbixcbiAgdW5pcVdpdGgoKHgsIHkpID0+IHguZmllbGQgPT09IHkuZmllbGRcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHguaXRlbSA9PT0geS5pdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB4LmVycm9yID09PSB5LmVycm9yKSxcbl0pO1xuIiwiaW1wb3J0IHsgam9pbiwgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIGdldExvY2ssIHJlbGVhc2VMb2NrLCAkLFxuICBpc05vbG9jaywgYXBpV3JhcHBlciwgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgQUNDRVNTX0xFVkVMU19MT0NLX0ZJTEUsXG4gIEFDQ0VTU19MRVZFTFNfRklMRSxcbn0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7IHZhbGlkYXRlQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi92YWxpZGF0ZUFjY2Vzc0xldmVscyc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBzYXZlQWNjZXNzTGV2ZWxzID0gYXBwID0+IGFzeW5jIGFjY2Vzc0xldmVscyA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLnNhdmVBY2Nlc3NMZXZlbHMsXG4gIHBlcm1pc3Npb24ud3JpdGVBY2Nlc3NMZXZlbHMuaXNBdXRob3JpemVkLFxuICB7IGFjY2Vzc0xldmVscyB9LFxuICBfc2F2ZUFjY2Vzc0xldmVscywgYXBwLCBhY2Nlc3NMZXZlbHMsXG4pO1xuXG5leHBvcnQgY29uc3QgX3NhdmVBY2Nlc3NMZXZlbHMgPSBhc3luYyAoYXBwLCBhY2Nlc3NMZXZlbHMpID0+IHtcbiAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRlQWNjZXNzTGV2ZWxzKGFwcCkoYWNjZXNzTGV2ZWxzLmxldmVscyk7XG4gIGlmICh2YWxpZGF0aW9uRXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBlcnJzID0gJCh2YWxpZGF0aW9uRXJyb3JzLCBbXG4gICAgICBtYXAoZSA9PiBlLmVycm9yKSxcbiAgICAgIGpvaW4oJywgJyksXG4gICAgXSk7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEFjY2VzcyBMZXZlbHMgSW52YWxpZDogJHtlcnJzfWAsXG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRMb2NrKFxuICAgIGFwcCwgQUNDRVNTX0xFVkVMU19MT0NLX0ZJTEUsIDIwMDAsIDIsXG4gICk7XG5cbiAgaWYgKGlzTm9sb2NrKGxvY2spKSB7IHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGdldCBsb2NrIHRvIHNhdmUgYWNjZXNzIGxldmVscycpOyB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBleGlzdGluZyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oQUNDRVNTX0xFVkVMU19GSUxFKTtcbiAgICBpZiAoZXhpc3RpbmcudmVyc2lvbiAhPT0gYWNjZXNzTGV2ZWxzLnZlcnNpb24pIHsgdGhyb3cgbmV3IEVycm9yKCdBY2Nlc3MgbGV2ZWxzIGhhdmUgYWxyZWFkeSBiZWVuIHVwZGF0ZWQsIHNpbmNlIHlvdSBsb2FkZWQnKTsgfVxuXG4gICAgYWNjZXNzTGV2ZWxzLnZlcnNpb24rKztcblxuICAgIGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihBQ0NFU1NfTEVWRUxTX0ZJTEUsIGFjY2Vzc0xldmVscyk7XG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIGZpbHRlciwgdmFsdWVzLCBlYWNoLCBrZXlzLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuaW1wb3J0IHtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBpc0luZGV4LCBpc1JlY29yZCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7ICQgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMgPSAoYXBwKSA9PiB7XG4gIGNvbnN0IGFsbE5vZGVzID0gZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGFwcC5oaWVyYXJjaHkpO1xuICBjb25zdCBhY2Nlc3NMZXZlbCA9IHsgcGVybWlzc2lvbnM6IFtdIH07XG5cbiAgY29uc3QgcmVjb3JkTm9kZXMgPSAkKGFsbE5vZGVzLCBbXG4gICAgZmlsdGVyKGlzUmVjb3JkKSxcbiAgXSk7XG5cbiAgZm9yIChjb25zdCBuIG9mIHJlY29yZE5vZGVzKSB7XG4gICAgcGVybWlzc2lvbi5jcmVhdGVSZWNvcmQuYWRkKG4ubm9kZUtleSgpLCBhY2Nlc3NMZXZlbCk7XG4gICAgcGVybWlzc2lvbi51cGRhdGVSZWNvcmQuYWRkKG4ubm9kZUtleSgpLCBhY2Nlc3NMZXZlbCk7XG4gICAgcGVybWlzc2lvbi5kZWxldGVSZWNvcmQuYWRkKG4ubm9kZUtleSgpLCBhY2Nlc3NMZXZlbCk7XG4gICAgcGVybWlzc2lvbi5yZWFkUmVjb3JkLmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xuICB9XG5cbiAgY29uc3QgaW5kZXhOb2RlcyA9ICQoYWxsTm9kZXMsIFtcbiAgICBmaWx0ZXIoaXNJbmRleCksXG4gIF0pO1xuXG4gIGZvciAoY29uc3QgbiBvZiBpbmRleE5vZGVzKSB7XG4gICAgcGVybWlzc2lvbi5yZWFkSW5kZXguYWRkKG4ubm9kZUtleSgpLCBhY2Nlc3NMZXZlbCk7XG4gIH1cblxuICBmb3IgKGNvbnN0IGEgb2Yga2V5cyhhcHAuYWN0aW9ucykpIHtcbiAgICBwZXJtaXNzaW9uLmV4ZWN1dGVBY3Rpb24uYWRkKGEsIGFjY2Vzc0xldmVsKTtcbiAgfVxuXG4gICQocGVybWlzc2lvbiwgW1xuICAgIHZhbHVlcyxcbiAgICBmaWx0ZXIocCA9PiAhcC5pc05vZGUpLFxuICAgIGVhY2gocCA9PiBwLmFkZChhY2Nlc3NMZXZlbCkpLFxuICBdKTtcblxuICByZXR1cm4gYWNjZXNzTGV2ZWwucGVybWlzc2lvbnM7XG59O1xuIiwiaW1wb3J0IHsgZGlmZmVyZW5jZSwgbWFwLCBqb2luIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIGdldExvY2ssIGlzTm9sb2NrLCByZWxlYXNlTG9jaywgJCxcbiAgYXBpV3JhcHBlciwgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgVVNFUlNfTE9DS19GSUxFLCBBQ0NFU1NfTEVWRUxTX0ZJTEUsXG4gIGdldFVzZXJCeU5hbWUsIFVTRVJTX0xJU1RfRklMRSxcbn0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IHNldFVzZXJBY2Nlc3NMZXZlbHMgPSBhcHAgPT4gYXN5bmMgKHVzZXJOYW1lLCBhY2Nlc3NMZXZlbHMpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuc2V0VXNlckFjY2Vzc0xldmVscyxcbiAgcGVybWlzc2lvbi5zZXRVc2VyQWNjZXNzTGV2ZWxzLmlzQXV0aG9yaXplZCxcbiAgeyB1c2VyTmFtZSwgYWNjZXNzTGV2ZWxzIH0sXG4gIF9zZXRVc2VyQWNjZXNzTGV2ZWxzLCBhcHAsIHVzZXJOYW1lLCBhY2Nlc3NMZXZlbHMsXG4pO1xuXG5leHBvcnQgY29uc3QgX3NldFVzZXJBY2Nlc3NMZXZlbHMgPSBhc3luYyAoYXBwLCB1c2VybmFtZSwgYWNjZXNzTGV2ZWxzKSA9PiB7XG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRMb2NrKGFwcCwgVVNFUlNfTE9DS19GSUxFLCAxMDAwLCAxLCAwKTtcblxuICBjb25zdCBhY3R1YWxBY2Nlc3NMZXZlbHMgPSAkKFxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oQUNDRVNTX0xFVkVMU19GSUxFKSxcbiAgICBbXG4gICAgICBsID0+IGwubGV2ZWxzLFxuICAgICAgbWFwKGwgPT4gbC5uYW1lKSxcbiAgICBdLFxuICApO1xuXG4gIGNvbnN0IG1pc3NpbmcgPSBkaWZmZXJlbmNlKGFjY2Vzc0xldmVscykoYWN0dWFsQWNjZXNzTGV2ZWxzKTtcbiAgaWYgKG1pc3NpbmcubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBhY2Nlc3MgbGV2ZWxzIHN1cHBsaWVkOiAke2pvaW4oJywgJywgbWlzc2luZyl9YCk7XG4gIH1cblxuICBpZiAoaXNOb2xvY2sobG9jaykpIHsgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBzZXQgdXNlciBhY2Nlc3MgbGV2ZWxzIGNhbm5vdCBnZXQgbG9jaycpOyB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB1c2VycyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oVVNFUlNfTElTVF9GSUxFKTtcbiAgICBjb25zdCB1c2VyID0gZ2V0VXNlckJ5TmFtZSh1c2VycywgdXNlcm5hbWUpO1xuICAgIGlmICghdXNlcikgeyB0aHJvdyBuZXcgTm90Rm91bmRFcnJvcihgQ291bGQgbm90IGZpbmQgdXNlciB3aXRoICR7dXNlcm5hbWV9YCk7IH1cblxuICAgIHVzZXIuYWNjZXNzTGV2ZWxzID0gYWNjZXNzTGV2ZWxzO1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihVU0VSU19MSVNUX0ZJTEUsIHVzZXJzKTtcbiAgfSBmaW5hbGx5IHtcbiAgICByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgYXV0aGVudGljYXRlLFxuICBhdXRoZW50aWNhdGVUZW1wb3JhcnlBY2Nlc3MsXG59IGZyb20gJy4vYXV0aGVudGljYXRlJztcbmltcG9ydCB7IGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyB9IGZyb20gJy4vY3JlYXRlVGVtcG9yYXJ5QWNjZXNzJztcbmltcG9ydCB7IGNyZWF0ZVVzZXIgfSBmcm9tICcuL2NyZWF0ZVVzZXInO1xuaW1wb3J0IHsgZW5hYmxlVXNlciwgZGlzYWJsZVVzZXIgfSBmcm9tICcuL2VuYWJsZVVzZXInO1xuaW1wb3J0IHsgbG9hZEFjY2Vzc0xldmVscyB9IGZyb20gJy4vbG9hZEFjY2Vzc0xldmVscyc7XG5pbXBvcnQgeyBnZXROZXdBY2Nlc3NMZXZlbCB9IGZyb20gJy4vZ2V0TmV3QWNjZXNzTGV2ZWwnO1xuaW1wb3J0IHsgZ2V0TmV3VXNlciwgZ2V0TmV3VXNlckF1dGggfSBmcm9tICcuL2dldE5ld1VzZXInO1xuaW1wb3J0IHsgZ2V0VXNlcnMgfSBmcm9tICcuL2dldFVzZXJzJztcbmltcG9ydCB7IGlzQXV0aG9yaXplZCB9IGZyb20gJy4vaXNBdXRob3JpemVkJztcbmltcG9ydCB7IHNhdmVBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL3NhdmVBY2Nlc3NMZXZlbHMnO1xuaW1wb3J0IHtcbiAgY2hhbmdlTXlQYXNzd29yZCxcbiAgc2NvcmVQYXNzd29yZCwgc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZSxcbiAgaXNWYWxpZFBhc3N3b3JkLFxufSBmcm9tICcuL3NldFBhc3N3b3JkJztcbmltcG9ydCB7IHZhbGlkYXRlVXNlciB9IGZyb20gJy4vdmFsaWRhdGVVc2VyJztcbmltcG9ydCB7IHZhbGlkYXRlQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi92YWxpZGF0ZUFjY2Vzc0xldmVscyc7XG5pbXBvcnQgeyBnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucyB9IGZyb20gJy4vZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgc2V0VXNlckFjY2Vzc0xldmVscyB9IGZyb20gJy4vc2V0VXNlckFjY2Vzc0xldmVscyc7XG5cbmV4cG9ydCBjb25zdCBnZXRBdXRoQXBpID0gYXBwID0+ICh7XG4gIGF1dGhlbnRpY2F0ZTogYXV0aGVudGljYXRlKGFwcCksXG4gIGF1dGhlbnRpY2F0ZVRlbXBvcmFyeUFjY2VzczogYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzKGFwcCksXG4gIGNyZWF0ZVRlbXBvcmFyeUFjY2VzczogY3JlYXRlVGVtcG9yYXJ5QWNjZXNzKGFwcCksXG4gIGNyZWF0ZVVzZXI6IGNyZWF0ZVVzZXIoYXBwKSxcbiAgbG9hZEFjY2Vzc0xldmVsczogbG9hZEFjY2Vzc0xldmVscyhhcHApLFxuICBlbmFibGVVc2VyOiBlbmFibGVVc2VyKGFwcCksXG4gIGRpc2FibGVVc2VyOiBkaXNhYmxlVXNlcihhcHApLFxuICBnZXROZXdBY2Nlc3NMZXZlbDogZ2V0TmV3QWNjZXNzTGV2ZWwoYXBwKSxcbiAgZ2V0TmV3VXNlcjogZ2V0TmV3VXNlcihhcHApLFxuICBnZXROZXdVc2VyQXV0aDogZ2V0TmV3VXNlckF1dGgoYXBwKSxcbiAgZ2V0VXNlcnM6IGdldFVzZXJzKGFwcCksXG4gIHNhdmVBY2Nlc3NMZXZlbHM6IHNhdmVBY2Nlc3NMZXZlbHMoYXBwKSxcbiAgaXNBdXRob3JpemVkOiBpc0F1dGhvcml6ZWQoYXBwKSxcbiAgY2hhbmdlTXlQYXNzd29yZDogY2hhbmdlTXlQYXNzd29yZChhcHApLFxuICBzZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlOiBzZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlKGFwcCksXG4gIHNjb3JlUGFzc3dvcmQsXG4gIGlzVmFsaWRQYXNzd29yZDogaXNWYWxpZFBhc3N3b3JkKGFwcCksXG4gIHZhbGlkYXRlVXNlcjogdmFsaWRhdGVVc2VyKGFwcCksXG4gIHZhbGlkYXRlQWNjZXNzTGV2ZWxzOiB2YWxpZGF0ZUFjY2Vzc0xldmVscyhhcHApLFxuICBnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9uczogKCkgPT4gZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMoYXBwKSxcbiAgc2V0VXNlckFjY2Vzc0xldmVsczogc2V0VXNlckFjY2Vzc0xldmVscyhhcHApLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGdldEF1dGhBcGk7XG4iLCJpbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBhcGlXcmFwcGVyU3luYyB9IGZyb20gJy4uL2NvbW1vbi9hcGlXcmFwcGVyJztcbmltcG9ydCB7IGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xuXG5leHBvcnQgY29uc3QgZXhlY3V0ZUFjdGlvbiA9IGFwcCA9PiAoYWN0aW9uTmFtZSwgb3B0aW9ucykgPT4ge1xuICBhcGlXcmFwcGVyU3luYyhcbiAgICBhcHAsXG4gICAgZXZlbnRzLmFjdGlvbnNBcGkuZXhlY3V0ZSxcbiAgICBwZXJtaXNzaW9uLmV4ZWN1dGVBY3Rpb24uaXNBdXRob3JpemVkKGFjdGlvbk5hbWUpLFxuICAgIHsgYWN0aW9uTmFtZSwgb3B0aW9ucyB9LFxuICAgIGFwcC5hY3Rpb25zW2FjdGlvbk5hbWVdLCBvcHRpb25zLFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IF9leGVjdXRlQWN0aW9uID0gKGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbiwgb3B0aW9ucykgPT4gYmVoYXZpb3VyU291cmNlc1thY3Rpb24uYmVoYXZpb3VyU291cmNlXVthY3Rpb24uYmVoYXZpb3VyTmFtZV0ob3B0aW9ucyk7XG4iLCJpbXBvcnQgeyBleGVjdXRlQWN0aW9uIH0gZnJvbSAnLi9leGVjdXRlJztcblxuZXhwb3J0IGNvbnN0IGdldEFjdGlvbnNBcGkgPSBhcHAgPT4gKHtcbiAgZXhlY3V0ZTogZXhlY3V0ZUFjdGlvbihhcHApLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGdldEFjdGlvbnNBcGk7XG4iLCJpbXBvcnQgeyBoYXMgfSBmcm9tICdsb2Rhc2gnO1xuXG5jb25zdCBwdWJsaXNoID0gaGFuZGxlcnMgPT4gYXN5bmMgKGV2ZW50TmFtZSwgY29udGV4dCA9IHt9KSA9PiB7XG4gIGlmICghaGFzKGhhbmRsZXJzLCBldmVudE5hbWUpKSByZXR1cm47XG5cbiAgZm9yIChjb25zdCBoYW5kbGVyIG9mIGhhbmRsZXJzW2V2ZW50TmFtZV0pIHtcbiAgICBhd2FpdCBoYW5kbGVyKGV2ZW50TmFtZSwgY29udGV4dCk7XG4gIH1cbn07XG5cbmNvbnN0IHN1YnNjcmliZSA9IGhhbmRsZXJzID0+IChldmVudE5hbWUsIGhhbmRsZXIpID0+IHtcbiAgaWYgKCFoYXMoaGFuZGxlcnMsIGV2ZW50TmFtZSkpIHtcbiAgICBoYW5kbGVyc1tldmVudE5hbWVdID0gW107XG4gIH1cbiAgaGFuZGxlcnNbZXZlbnROYW1lXS5wdXNoKGhhbmRsZXIpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUV2ZW50QWdncmVnYXRvciA9ICgpID0+IHtcbiAgY29uc3QgaGFuZGxlcnMgPSB7fTtcbiAgY29uc3QgZXZlbnRBZ2dyZWdhdG9yID0gKHtcbiAgICBwdWJsaXNoOiBwdWJsaXNoKGhhbmRsZXJzKSxcbiAgICBzdWJzY3JpYmU6IHN1YnNjcmliZShoYW5kbGVycyksXG4gIH0pO1xuICByZXR1cm4gZXZlbnRBZ2dyZWdhdG9yO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRXZlbnRBZ2dyZWdhdG9yO1xuIiwiaW1wb3J0IHsgcmV0cnkgfSBmcm9tICcuLi9jb21tb24vaW5kZXgnO1xuaW1wb3J0IHsgTm90Rm91bmRFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5jb25zdCBjcmVhdGVKc29uID0gb3JpZ2luYWxDcmVhdGVGaWxlID0+IGFzeW5jIChrZXksIG9iaiwgcmV0cmllcyA9IDUsIGRlbGF5ID0gNTAwKSA9PiBhd2FpdCByZXRyeShvcmlnaW5hbENyZWF0ZUZpbGUsIHJldHJpZXMsIGRlbGF5LCBrZXksIEpTT04uc3RyaW5naWZ5KG9iaikpO1xuXG5jb25zdCBjcmVhdGVOZXdGaWxlID0gb3JpZ2luYWxDcmVhdGVGaWxlID0+IGFzeW5jIChwYXRoLCBjb250ZW50LCByZXRyaWVzID0gNSwgZGVsYXkgPSA1MDApID0+IGF3YWl0IHJldHJ5KG9yaWdpbmFsQ3JlYXRlRmlsZSwgcmV0cmllcywgZGVsYXksIHBhdGgsIGNvbnRlbnQpO1xuXG5jb25zdCBsb2FkSnNvbiA9IGRhdGFzdG9yZSA9PiBhc3luYyAoa2V5LCByZXRyaWVzID0gNSwgZGVsYXkgPSA1MDApID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgcmV0cnkoSlNPTi5wYXJzZSwgcmV0cmllcywgZGVsYXksIGF3YWl0IGRhdGFzdG9yZS5sb2FkRmlsZShrZXkpKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoZXJyLm1lc3NhZ2UpO1xuICB9XG59XG5cbmNvbnN0IHVwZGF0ZUpzb24gPSBkYXRhc3RvcmUgPT4gYXN5bmMgKGtleSwgb2JqLCByZXRyaWVzID0gNSwgZGVsYXkgPSA1MDApID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgcmV0cnkoZGF0YXN0b3JlLnVwZGF0ZUZpbGUsIHJldHJpZXMsIGRlbGF5LCBrZXksIEpTT04uc3RyaW5naWZ5KG9iaikpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICB0aHJvdyBuZXcgTm90Rm91bmRFcnJvcihlcnIubWVzc2FnZSk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHNldHVwRGF0YXN0b3JlID0gKGRhdGFzdG9yZSkgPT4ge1xuICBjb25zdCBvcmlnaW5hbENyZWF0ZUZpbGUgPSBkYXRhc3RvcmUuY3JlYXRlRmlsZTtcbiAgZGF0YXN0b3JlLmxvYWRKc29uID0gbG9hZEpzb24oZGF0YXN0b3JlKTtcbiAgZGF0YXN0b3JlLmNyZWF0ZUpzb24gPSBjcmVhdGVKc29uKG9yaWdpbmFsQ3JlYXRlRmlsZSk7XG4gIGRhdGFzdG9yZS51cGRhdGVKc29uID0gdXBkYXRlSnNvbihkYXRhc3RvcmUpO1xuICBkYXRhc3RvcmUuY3JlYXRlRmlsZSA9IGNyZWF0ZU5ld0ZpbGUob3JpZ2luYWxDcmVhdGVGaWxlKTtcbiAgaWYgKGRhdGFzdG9yZS5jcmVhdGVFbXB0eURiKSB7IGRlbGV0ZSBkYXRhc3RvcmUuY3JlYXRlRW1wdHlEYjsgfVxuICByZXR1cm4gZGF0YXN0b3JlO1xufTtcblxuZXhwb3J0IHsgY3JlYXRlRXZlbnRBZ2dyZWdhdG9yIH0gZnJvbSAnLi9ldmVudEFnZ3JlZ2F0b3InO1xuXG5leHBvcnQgZGVmYXVsdCBzZXR1cERhdGFzdG9yZTtcbiIsImltcG9ydCB7IFxuICBjb21waWxlRXhwcmVzc2lvbiBhcyBjRXhwLCBcbiAgY29tcGlsZUNvZGUgYXMgY0NvZGUgXG59IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcblxuZXhwb3J0IGNvbnN0IGNvbXBpbGVDb2RlID0gY29kZSA9PiB7XG4gIGxldCBmdW5jOyAgXG4gICAgXG4gIHRyeSB7XG4gICAgZnVuYyA9IGNDb2RlKGNvZGUpO1xuICB9IGNhdGNoKGUpIHtcbiAgICBlLm1lc3NhZ2UgPSBgRXJyb3IgY29tcGlsaW5nIGNvZGUgOiAke2NvZGV9IDogJHtlLm1lc3NhZ2V9YDtcbiAgICB0aHJvdyBlO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmM7XG59XG5cbmV4cG9ydCBjb25zdCBjb21waWxlRXhwcmVzc2lvbiA9IGNvZGUgPT4ge1xuICBsZXQgZnVuYzsgIFxuICAgICAgXG4gIHRyeSB7XG4gICAgZnVuYyA9IGNFeHAoY29kZSk7XG4gIH0gY2F0Y2goZSkge1xuICAgIGUubWVzc2FnZSA9IGBFcnJvciBjb21waWxpbmcgZXhwcmVzc2lvbiA6ICR7Y29kZX0gOiAke2UubWVzc2FnZX1gO1xuICAgIHRocm93IGU7XG4gIH1cbiAgXG4gIHJldHVybiBmdW5jO1xufVxuIiwiaW1wb3J0IHtcbiAgaXNGdW5jdGlvbiwgZmlsdGVyLCBtYXAsXG4gIHVuaXFCeSwga2V5cywgZGlmZmVyZW5jZSxcbiAgam9pbiwgcmVkdWNlLCBmaW5kLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgY29tcGlsZUV4cHJlc3Npb24sIGNvbXBpbGVDb2RlIH0gZnJvbSAnLi4vY29tbW9uL2NvbXBpbGVDb2RlJztcbmltcG9ydCB7ICQgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgX2V4ZWN1dGVBY3Rpb24gfSBmcm9tICcuL2V4ZWN1dGUnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yLCBOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlQWN0aW9ucyA9IChzdWJzY3JpYmUsIGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMsIHRyaWdnZXJzLCBhcGlzKSA9PiB7XG4gIHZhbGlkYXRlU291cmNlcyhiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zKTtcbiAgc3Vic2NyaWJlVHJpZ2dlcnMoc3Vic2NyaWJlLCBiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zLCB0cmlnZ2VycywgYXBpcyk7XG4gIHJldHVybiBjcmVhdGVBY3Rpb25zQ29sbGVjdGlvbihiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zKTtcbn07XG5cbmNvbnN0IGNyZWF0ZUFjdGlvbnNDb2xsZWN0aW9uID0gKGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMpID0+ICQoYWN0aW9ucywgW1xuICByZWR1Y2UoKGFsbCwgYSkgPT4ge1xuICAgIGFsbFthLm5hbWVdID0gb3B0cyA9PiBfZXhlY3V0ZUFjdGlvbihiZWhhdmlvdXJTb3VyY2VzLCBhLCBvcHRzKTtcbiAgICByZXR1cm4gYWxsO1xuICB9LCB7fSksXG5dKTtcblxuY29uc3Qgc3Vic2NyaWJlVHJpZ2dlcnMgPSAoc3Vic2NyaWJlLCBiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zLCB0cmlnZ2VycywgYXBpcykgPT4ge1xuICBjb25zdCBjcmVhdGVPcHRpb25zID0gKG9wdGlvbnNDcmVhdG9yLCBldmVudENvbnRleHQpID0+IHtcbiAgICBpZiAoIW9wdGlvbnNDcmVhdG9yKSByZXR1cm4ge307XG4gICAgY29uc3QgY3JlYXRlID0gY29tcGlsZUNvZGUob3B0aW9uc0NyZWF0b3IpO1xuICAgIHJldHVybiBjcmVhdGUoeyBjb250ZXh0OiBldmVudENvbnRleHQsIGFwaXMgfSk7XG4gIH07XG5cbiAgY29uc3Qgc2hvdWxkUnVuVHJpZ2dlciA9ICh0cmlnZ2VyLCBldmVudENvbnRleHQpID0+IHtcbiAgICBpZiAoIXRyaWdnZXIuY29uZGl0aW9uKSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCBzaG91bGRSdW4gPSBjb21waWxlRXhwcmVzc2lvbih0cmlnZ2VyLmNvbmRpdGlvbik7XG4gICAgcmV0dXJuIHNob3VsZFJ1bih7IGNvbnRleHQ6IGV2ZW50Q29udGV4dCB9KTtcbiAgfTtcblxuICBmb3IgKGxldCB0cmlnIG9mIHRyaWdnZXJzKSB7XG4gICAgc3Vic2NyaWJlKHRyaWcuZXZlbnROYW1lLCBhc3luYyAoZXYsIGN0eCkgPT4ge1xuICAgICAgaWYgKHNob3VsZFJ1blRyaWdnZXIodHJpZywgY3R4KSkge1xuICAgICAgICBhd2FpdCBfZXhlY3V0ZUFjdGlvbihcbiAgICAgICAgICBiZWhhdmlvdXJTb3VyY2VzLFxuICAgICAgICAgIGZpbmQoYSA9PiBhLm5hbWUgPT09IHRyaWcuYWN0aW9uTmFtZSkoYWN0aW9ucyksXG4gICAgICAgICAgY3JlYXRlT3B0aW9ucyh0cmlnLm9wdGlvbnNDcmVhdG9yLCBjdHgpLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59O1xuXG5jb25zdCB2YWxpZGF0ZVNvdXJjZXMgPSAoYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucykgPT4ge1xuICBjb25zdCBkZWNsYXJlZFNvdXJjZXMgPSAkKGFjdGlvbnMsIFtcbiAgICB1bmlxQnkoYSA9PiBhLmJlaGF2aW91clNvdXJjZSksXG4gICAgbWFwKGEgPT4gYS5iZWhhdmlvdXJTb3VyY2UpLFxuICBdKTtcblxuICBjb25zdCBzdXBwbGllZFNvdXJjZXMgPSBrZXlzKGJlaGF2aW91clNvdXJjZXMpO1xuXG4gIGNvbnN0IG1pc3NpbmdTb3VyY2VzID0gZGlmZmVyZW5jZShcbiAgICBkZWNsYXJlZFNvdXJjZXMsIHN1cHBsaWVkU291cmNlcyxcbiAgKTtcblxuICBpZiAobWlzc2luZ1NvdXJjZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYERlY2xhcmVkIGJlaGF2aW91ciBzb3VyY2VzIGFyZSBub3Qgc3VwcGxpZWQ6ICR7am9pbignLCAnLCBtaXNzaW5nU291cmNlcyl9YCk7XG4gIH1cblxuICBjb25zdCBtaXNzaW5nQmVoYXZpb3VycyA9ICQoYWN0aW9ucywgW1xuICAgIGZpbHRlcihhID0+ICFpc0Z1bmN0aW9uKGJlaGF2aW91clNvdXJjZXNbYS5iZWhhdmlvdXJTb3VyY2VdW2EuYmVoYXZpb3VyTmFtZV0pKSxcbiAgICBtYXAoYSA9PiBgQWN0aW9uOiAke2EubmFtZX0gOiAke2EuYmVoYXZpb3VyU291cmNlfS4ke2EuYmVoYXZpb3VyTmFtZX1gKSxcbiAgXSk7XG5cbiAgaWYgKG1pc3NpbmdCZWhhdmlvdXJzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgTm90Rm91bmRFcnJvcihgTWlzc2luZyBiZWhhdmlvdXJzOiBjb3VsZCBub3QgZmluZCBiZWhhdmlvdXIgZnVuY3Rpb25zOiAke2pvaW4oJywgJywgbWlzc2luZ0JlaGF2aW91cnMpfWApO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgbWFwLCBmaWx0ZXIsIGdyb3VwQnksIHNwbGl0LFxuICBzb21lLCBmaW5kLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgTE9DS19GSUxFTkFNRSwgVFJBTlNBQ1RJT05TX0ZPTERFUiwgaWRTZXAsIGlzVXBkYXRlLFxuICBub2RlS2V5SGFzaEZyb21CdWlsZEZvbGRlciwgaXNCdWlsZEluZGV4Rm9sZGVyLCBnZXRUcmFuc2FjdGlvbklkLFxuICBpc0RlbGV0ZSwgaXNDcmVhdGUsXG59IGZyb20gJy4vdHJhbnNhY3Rpb25zQ29tbW9uJztcbmltcG9ydCB7XG4gIGpvaW5LZXksICQsIG5vbmUsIGlzU29tZXRoaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0TGFzdFBhcnRJbktleSwgZ2V0Tm9kZUZyb21Ob2RlS2V5SGFzaCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBfbG9hZCB9IGZyb20gJy4uL3JlY29yZEFwaS9sb2FkJztcblxuZXhwb3J0IGNvbnN0IHJldHJpZXZlID0gYXN5bmMgKGFwcCkgPT4ge1xuICBjb25zdCB0cmFuc2FjdGlvbkZpbGVzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5nZXRGb2xkZXJDb250ZW50cyhcbiAgICBUUkFOU0FDVElPTlNfRk9MREVSLFxuICApO1xuXG4gIGxldCB0cmFuc2FjdGlvbnMgPSBbXTtcblxuICBpZiAoc29tZShpc0J1aWxkSW5kZXhGb2xkZXIpKHRyYW5zYWN0aW9uRmlsZXMpKSB7XG4gICAgY29uc3QgYnVpbGRJbmRleEZvbGRlciA9IGZpbmQoaXNCdWlsZEluZGV4Rm9sZGVyKSh0cmFuc2FjdGlvbkZpbGVzKTtcblxuICAgIHRyYW5zYWN0aW9ucyA9IGF3YWl0IHJldHJpZXZlQnVpbGRJbmRleFRyYW5zYWN0aW9ucyhcbiAgICAgIGFwcCxcbiAgICAgIGpvaW5LZXkoVFJBTlNBQ1RJT05TX0ZPTERFUiwgYnVpbGRJbmRleEZvbGRlciksXG4gICAgKTtcbiAgfVxuXG4gIGlmICh0cmFuc2FjdGlvbnMubGVuZ3RoID4gMCkgcmV0dXJuIHRyYW5zYWN0aW9ucztcblxuICByZXR1cm4gYXdhaXQgcmV0cmlldmVTdGFuZGFyZFRyYW5zYWN0aW9ucyhcbiAgICBhcHAsIHRyYW5zYWN0aW9uRmlsZXMsXG4gICk7XG59O1xuXG5jb25zdCByZXRyaWV2ZUJ1aWxkSW5kZXhUcmFuc2FjdGlvbnMgPSBhc3luYyAoYXBwLCBidWlsZEluZGV4Rm9sZGVyKSA9PiB7XG4gIGNvbnN0IGNoaWxkRm9sZGVycyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0Rm9sZGVyQ29udGVudHMoYnVpbGRJbmRleEZvbGRlcik7XG4gIGlmIChjaGlsZEZvbGRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gY2xlYW51cFxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKGJ1aWxkSW5kZXhGb2xkZXIpO1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IGdldFRyYW5zYWN0aW9uRmlsZXMgPSBhc3luYyAoY2hpbGRGb2xkZXJJbmRleCA9IDApID0+IHtcbiAgICBpZiAoY2hpbGRGb2xkZXJJbmRleCA+PSBjaGlsZEZvbGRlcnMubGVuZ3RoKSByZXR1cm4gW107XG5cbiAgICBjb25zdCBjaGlsZEZvbGRlcktleSA9IGpvaW5LZXkoYnVpbGRJbmRleEZvbGRlciwgY2hpbGRGb2xkZXJzW2NoaWxkRm9sZGVySW5kZXhdKTtcbiAgICBjb25zdCBmaWxlcyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0Rm9sZGVyQ29udGVudHMoXG4gICAgICBjaGlsZEZvbGRlcktleSxcbiAgICApO1xuXG4gICAgaWYgKGZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoY2hpbGRGb2xkZXJLZXkpO1xuICAgICAgcmV0dXJuIGF3YWl0IGdldFRyYW5zYWN0aW9uRmlsZXMoY2hpbGRGb2xkZXJJbmRleCArIDEpO1xuICAgIH1cblxuICAgIHJldHVybiB7IGNoaWxkRm9sZGVyS2V5LCBmaWxlcyB9O1xuICB9O1xuXG4gIGNvbnN0IHRyYW5zYWN0aW9uRmlsZXMgPSBhd2FpdCBnZXRUcmFuc2FjdGlvbkZpbGVzKCk7XG5cbiAgaWYgKHRyYW5zYWN0aW9uRmlsZXMuZmlsZXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgdHJhbnNhY3Rpb25zID0gJCh0cmFuc2FjdGlvbkZpbGVzLmZpbGVzLCBbXG4gICAgbWFwKHBhcnNlVHJhbnNhY3Rpb25JZCksXG4gIF0pO1xuXG4gIGZvciAoY29uc3QgdCBvZiB0cmFuc2FjdGlvbnMpIHtcbiAgICBjb25zdCB0cmFuc2FjdGlvbkNvbnRlbnQgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgICAgam9pbktleShcbiAgICAgICAgdHJhbnNhY3Rpb25GaWxlcy5jaGlsZEZvbGRlcktleSxcbiAgICAgICAgdC5mdWxsSWQsXG4gICAgICApLFxuICAgICk7XG4gICAgdC5yZWNvcmQgPSBhd2FpdCBfbG9hZChhcHAsIHRyYW5zYWN0aW9uQ29udGVudC5yZWNvcmRLZXkpO1xuICB9XG5cbiAgdHJhbnNhY3Rpb25zLmluZGV4Tm9kZSA9ICQoYnVpbGRJbmRleEZvbGRlciwgW1xuICAgIGdldExhc3RQYXJ0SW5LZXksXG4gICAgbm9kZUtleUhhc2hGcm9tQnVpbGRGb2xkZXIsXG4gICAgZ2V0Tm9kZUZyb21Ob2RlS2V5SGFzaChhcHAuaGllcmFyY2h5KSxcbiAgXSk7XG5cbiAgdHJhbnNhY3Rpb25zLmZvbGRlcktleSA9IHRyYW5zYWN0aW9uRmlsZXMuY2hpbGRGb2xkZXJLZXk7XG5cbiAgcmV0dXJuIHRyYW5zYWN0aW9ucztcbn07XG5cbmNvbnN0IHJldHJpZXZlU3RhbmRhcmRUcmFuc2FjdGlvbnMgPSBhc3luYyAoYXBwLCB0cmFuc2FjdGlvbkZpbGVzKSA9PiB7XG4gIGNvbnN0IHRyYW5zYWN0aW9uSWRzID0gJCh0cmFuc2FjdGlvbkZpbGVzLCBbXG4gICAgZmlsdGVyKGYgPT4gZiAhPT0gTE9DS19GSUxFTkFNRVxuICAgICAgICAgICAgICAgICAgICAmJiAhaXNCdWlsZEluZGV4Rm9sZGVyKGYpKSxcbiAgICBtYXAocGFyc2VUcmFuc2FjdGlvbklkKSxcbiAgXSk7XG5cbiAgY29uc3QgdHJhbnNhY3Rpb25JZHNCeVJlY29yZCA9ICQodHJhbnNhY3Rpb25JZHMsIFtcbiAgICBncm91cEJ5KCdyZWNvcmRJZCcpLFxuICBdKTtcblxuICBjb25zdCBkZWR1cGVkVHJhbnNhY3Rpb25zID0gW107XG5cbiAgY29uc3QgdmVyaWZ5ID0gYXN5bmMgKHQpID0+IHtcbiAgICBpZiAodC52ZXJpZmllZCA9PT0gdHJ1ZSkgcmV0dXJuIHQ7XG5cbiAgICBjb25zdCBpZCA9IGdldFRyYW5zYWN0aW9uSWQoXG4gICAgICB0LnJlY29yZElkLFxuICAgICAgdC50cmFuc2FjdGlvblR5cGUsXG4gICAgICB0LnVuaXF1ZUlkLFxuICAgICk7XG5cbiAgICBjb25zdCB0cmFuc2FjdGlvbiA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgICBqb2luS2V5KFRSQU5TQUNUSU9OU19GT0xERVIsIGlkKSxcbiAgICApO1xuXG4gICAgaWYgKGlzRGVsZXRlKHQpKSB7XG4gICAgICB0LnJlY29yZCA9IHRyYW5zYWN0aW9uLnJlY29yZDtcbiAgICAgIHQudmVyaWZpZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHQ7XG4gICAgfVxuXG4gICAgY29uc3QgcmVjID0gYXdhaXQgX2xvYWQoXG4gICAgICBhcHAsXG4gICAgICB0cmFuc2FjdGlvbi5yZWNvcmRLZXksXG4gICAgKTtcbiAgICBpZiAocmVjLnRyYW5zYWN0aW9uSWQgPT09IGlkKSB7XG4gICAgICB0LnJlY29yZCA9IHJlYztcbiAgICAgIGlmICh0cmFuc2FjdGlvbi5vbGRSZWNvcmQpIHsgdC5vbGRSZWNvcmQgPSB0cmFuc2FjdGlvbi5vbGRSZWNvcmQ7IH1cbiAgICAgIHQudmVyaWZpZWQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0LnZlcmlmaWVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHQ7XG4gIH07XG5cbiAgY29uc3QgcGlja09uZSA9IGFzeW5jICh0cmFucywgZm9yVHlwZSkgPT4ge1xuICAgIGNvbnN0IHRyYW5zRm9yVHlwZSA9IGZpbHRlcihmb3JUeXBlKSh0cmFucyk7XG4gICAgaWYgKHRyYW5zRm9yVHlwZS5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNvbnN0IHQgPSBhd2FpdCB2ZXJpZnkodHJhbnNGb3JUeXBlWzBdKTtcbiAgICAgIHJldHVybiAodC52ZXJpZmllZCA9PT0gdHJ1ZSA/IHQgOiBudWxsKTtcbiAgICB9XG4gICAgZm9yIChsZXQgdCBvZiB0cmFuc0ZvclR5cGUpIHtcbiAgICAgIHQgPSBhd2FpdCB2ZXJpZnkodCk7XG4gICAgICBpZiAodC52ZXJpZmllZCA9PT0gdHJ1ZSkgeyByZXR1cm4gdDsgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIGZvciAoY29uc3QgcmVjb3JkSWQgaW4gdHJhbnNhY3Rpb25JZHNCeVJlY29yZCkge1xuICAgIGNvbnN0IHRyYW5zSWRzRm9yUmVjb3JkID0gdHJhbnNhY3Rpb25JZHNCeVJlY29yZFtyZWNvcmRJZF07XG4gICAgaWYgKHRyYW5zSWRzRm9yUmVjb3JkLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY29uc3QgdCA9IGF3YWl0IHZlcmlmeSh0cmFuc0lkc0ZvclJlY29yZFswXSk7XG4gICAgICBpZiAodC52ZXJpZmllZCkgeyBkZWR1cGVkVHJhbnNhY3Rpb25zLnB1c2godCk7IH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoc29tZShpc0RlbGV0ZSkodHJhbnNJZHNGb3JSZWNvcmQpKSB7XG4gICAgICBjb25zdCB0ID0gYXdhaXQgdmVyaWZ5KGZpbmQoaXNEZWxldGUpKHRyYW5zSWRzRm9yUmVjb3JkKSk7XG4gICAgICBpZiAodC52ZXJpZmllZCkgeyBkZWR1cGVkVHJhbnNhY3Rpb25zLnB1c2godCk7IH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoc29tZShpc1VwZGF0ZSkodHJhbnNJZHNGb3JSZWNvcmQpKSB7XG4gICAgICBjb25zdCB1cGQgPSBhd2FpdCBwaWNrT25lKHRyYW5zSWRzRm9yUmVjb3JkLCBpc1VwZGF0ZSk7XG4gICAgICBpZiAoaXNTb21ldGhpbmcodXBkKSAmJiB1cGQudmVyaWZpZWQpIHsgZGVkdXBlZFRyYW5zYWN0aW9ucy5wdXNoKHVwZCk7IH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoc29tZShpc0NyZWF0ZSkodHJhbnNJZHNGb3JSZWNvcmQpKSB7XG4gICAgICBjb25zdCBjcmUgPSBhd2FpdCBwaWNrT25lKHRyYW5zSWRzRm9yUmVjb3JkLCBpc0NyZWF0ZSk7XG4gICAgICBpZiAoaXNTb21ldGhpbmcoY3JlKSkgeyBkZWR1cGVkVHJhbnNhY3Rpb25zLnB1c2goY3JlKTsgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZHVwbGljYXRlcyA9ICQodHJhbnNhY3Rpb25JZHMsIFtcbiAgICBmaWx0ZXIodCA9PiBub25lKGRkdCA9PiBkZHQudW5pcXVlSWQgPT09IHQudW5pcXVlSWQpKGRlZHVwZWRUcmFuc2FjdGlvbnMpKSxcbiAgXSk7XG5cblxuICBjb25zdCBkZWxldGVQcm9taXNlcyA9IG1hcCh0ID0+IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShcbiAgICBqb2luS2V5KFxuICAgICAgVFJBTlNBQ1RJT05TX0ZPTERFUixcbiAgICAgIGdldFRyYW5zYWN0aW9uSWQoXG4gICAgICAgIHQucmVjb3JkSWQsXG4gICAgICAgIHQudHJhbnNhY3Rpb25UeXBlLFxuICAgICAgICB0LnVuaXF1ZUlkLFxuICAgICAgKSxcbiAgICApLFxuICApKShkdXBsaWNhdGVzKTtcblxuICBhd2FpdCBQcm9taXNlLmFsbChkZWxldGVQcm9taXNlcyk7XG5cbiAgcmV0dXJuIGRlZHVwZWRUcmFuc2FjdGlvbnM7XG59O1xuXG5jb25zdCBwYXJzZVRyYW5zYWN0aW9uSWQgPSAoaWQpID0+IHtcbiAgY29uc3Qgc3BsaXRJZCA9IHNwbGl0KGlkU2VwKShpZCk7XG4gIHJldHVybiAoe1xuICAgIHJlY29yZElkOiBzcGxpdElkWzBdLFxuICAgIHRyYW5zYWN0aW9uVHlwZTogc3BsaXRJZFsxXSxcbiAgICB1bmlxdWVJZDogc3BsaXRJZFsyXSxcbiAgICBmdWxsSWQ6IGlkLFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBvcmRlckJ5IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7XG4gIHJlZHVjZSwgZmluZCwgaW5jbHVkZXMsIGZsYXR0ZW4sIHVuaW9uLFxuICBmaWx0ZXIsIGVhY2gsIG1hcCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIGpvaW5LZXksIHNwbGl0S2V5LCBpc05vbkVtcHR5U3RyaW5nLFxuICBpc05vdGhpbmcsICQsIGlzU29tZXRoaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LCBnZXROb2RlLCBnZXRSZWNvcmROb2RlSWQsXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsIHJlY29yZE5vZGVJZElzQWxsb3dlZCxcbiAgaXNSZWNvcmQsIGlzR2xvYmFsSW5kZXgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBpbmRleFR5cGVzIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaW5kZXhlcyc7XG5cbmV4cG9ydCBjb25zdCBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcyA9IChhcHBIaWVyYXJjaHksIHJlY29yZCkgPT4ge1xuICBjb25zdCBrZXkgPSByZWNvcmQua2V5O1xuICBjb25zdCBrZXlQYXJ0cyA9IHNwbGl0S2V5KGtleSk7XG4gIGNvbnN0IG5vZGVJZCA9IGdldFJlY29yZE5vZGVJZChrZXkpO1xuXG4gIGNvbnN0IGZsYXRIaWVyYXJjaHkgPSBvcmRlckJ5KGdldEZsYXR0ZW5lZEhpZXJhcmNoeShhcHBIaWVyYXJjaHkpLFxuICAgIFtub2RlID0+IG5vZGUucGF0aFJlZ3goKS5sZW5ndGhdLFxuICAgIFsnZGVzYyddKTtcblxuICBjb25zdCBtYWtlaW5kZXhOb2RlQW5kS2V5X0ZvckFuY2VzdG9ySW5kZXggPSAoaW5kZXhOb2RlLCBpbmRleEtleSkgPT4gbWFrZUluZGV4Tm9kZUFuZEtleShpbmRleE5vZGUsIGpvaW5LZXkoaW5kZXhLZXksIGluZGV4Tm9kZS5uYW1lKSk7XG5cbiAgY29uc3QgdHJhdmVyc2VBbmNlc3RvckluZGV4ZXNJblBhdGggPSAoKSA9PiByZWR1Y2UoKGFjYywgcGFydCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRJbmRleEtleSA9IGpvaW5LZXkoYWNjLmxhc3RJbmRleEtleSwgcGFydCk7XG4gICAgYWNjLmxhc3RJbmRleEtleSA9IGN1cnJlbnRJbmRleEtleTtcbiAgICBjb25zdCB0ZXN0UGF0aFJlZ3ggPSBwID0+IG5ldyBSZWdFeHAoYCR7cC5wYXRoUmVneCgpfSRgKS50ZXN0KGN1cnJlbnRJbmRleEtleSk7XG4gICAgY29uc3Qgbm9kZU1hdGNoID0gZmluZCh0ZXN0UGF0aFJlZ3gpKGZsYXRIaWVyYXJjaHkpO1xuXG4gICAgaWYgKGlzTm90aGluZyhub2RlTWF0Y2gpKSB7IHJldHVybiBhY2M7IH1cblxuICAgIGlmICghaXNSZWNvcmQobm9kZU1hdGNoKVxuICAgICAgICAgICAgICAgIHx8IG5vZGVNYXRjaC5pbmRleGVzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gYWNjOyB9XG5cbiAgICBjb25zdCBpbmRleGVzID0gJChub2RlTWF0Y2guaW5kZXhlcywgW1xuICAgICAgZmlsdGVyKGkgPT4gaS5pbmRleFR5cGUgPT09IGluZGV4VHlwZXMuYW5jZXN0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIChpLmFsbG93ZWRSZWNvcmROb2RlSWRzLmxlbmd0aCA9PT0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGluY2x1ZGVzKG5vZGVJZCkoaS5hbGxvd2VkUmVjb3JkTm9kZUlkcykpKSxcbiAgICBdKTtcblxuICAgIGVhY2godiA9PiBhY2Mubm9kZXNBbmRLZXlzLnB1c2goXG4gICAgICBtYWtlaW5kZXhOb2RlQW5kS2V5X0ZvckFuY2VzdG9ySW5kZXgodiwgY3VycmVudEluZGV4S2V5KSxcbiAgICApKShpbmRleGVzKTtcblxuICAgIHJldHVybiBhY2M7XG4gIH0sIHsgbGFzdEluZGV4S2V5OiAnJywgbm9kZXNBbmRLZXlzOiBbXSB9KShrZXlQYXJ0cykubm9kZXNBbmRLZXlzO1xuXG4gIGNvbnN0IHJvb3RJbmRleGVzID0gJChmbGF0SGllcmFyY2h5LCBbXG4gICAgZmlsdGVyKG4gPT4gaXNHbG9iYWxJbmRleChuKSAmJiByZWNvcmROb2RlSWRJc0FsbG93ZWQobikobm9kZUlkKSksXG4gICAgbWFwKGkgPT4gbWFrZUluZGV4Tm9kZUFuZEtleShpLCBpLm5vZGVLZXkoKSkpLFxuICBdKTtcblxuICByZXR1cm4gdW5pb24odHJhdmVyc2VBbmNlc3RvckluZGV4ZXNJblBhdGgoKSkocm9vdEluZGV4ZXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFJlbGV2YW50UmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMgPSAoYXBwSGllcmFyY2h5LCByZWNvcmQpID0+ICQocmVjb3JkLmtleSwgW1xuICBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcEhpZXJhcmNoeSksXG4gIG4gPT4gbi5maWVsZHMsXG4gIGZpbHRlcihmID0+IGYudHlwZSA9PT0gJ3JlZmVyZW5jZSdcbiAgICAgICAgICAgICAgICAgICAgJiYgaXNTb21ldGhpbmcocmVjb3JkW2YubmFtZV0pXG4gICAgICAgICAgICAgICAgICAgICYmIGlzTm9uRW1wdHlTdHJpbmcocmVjb3JkW2YubmFtZV0ua2V5KSksXG4gIG1hcChmID0+ICQoZi50eXBlT3B0aW9ucy5yZXZlcnNlSW5kZXhOb2RlS2V5cywgW1xuICAgIG1hcChuID0+ICh7XG4gICAgICByZWNvcmROb2RlOiBnZXROb2RlKGFwcEhpZXJhcmNoeSwgbiksXG4gICAgICBmaWVsZDogZixcbiAgICB9KSksXG4gIF0pKSxcbiAgZmxhdHRlbixcbiAgbWFwKG4gPT4gbWFrZUluZGV4Tm9kZUFuZEtleShcbiAgICBuLnJlY29yZE5vZGUsXG4gICAgam9pbktleShyZWNvcmRbbi5maWVsZC5uYW1lXS5rZXksIG4ucmVjb3JkTm9kZS5uYW1lKSxcbiAgKSksXG5dKTtcblxuY29uc3QgbWFrZUluZGV4Tm9kZUFuZEtleSA9IChpbmRleE5vZGUsIGluZGV4S2V5KSA9PiAoeyBpbmRleE5vZGUsIGluZGV4S2V5IH0pO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcztcbiIsIiAgLy8gYWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXg0ZXIvanMtcHJvbWlzZS13cml0YWJsZVxuICAvLyBUaGFuayB5b3UgOikgXG4gIGV4cG9ydCBjb25zdCBwcm9taXNlV3JpdGVhYmxlU3RyZWFtID0gc3RyZWFtID0+IHtcbiAgXG4gICAgbGV0IF9lcnJvcmVkO1xuICBcbiAgICBjb25zdCBfZXJyb3JIYW5kbGVyID0gZXJyID0+IHtcbiAgICAgICAgX2Vycm9yZWQgPSBlcnI7XG4gICAgfTtcblxuICAgIHN0cmVhbS5vbihcImVycm9yXCIsIF9lcnJvckhhbmRsZXIpOyAgICBcbiAgXG4gICAgY29uc3Qgd3JpdGUgPSBjaHVuayA9PiB7ICBcbiAgICAgIGxldCByZWplY3RlZCA9IGZhbHNlO1xuICBcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGlmIChfZXJyb3JlZCkge1xuICAgICAgICAgIGNvbnN0IGVyciA9IF9lcnJvcmVkO1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgaWYgKCFzdHJlYW0ud3JpdGFibGUgfHwgc3RyZWFtLmNsb3NlZCB8fCBzdHJlYW0uZGVzdHJveWVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJ3cml0ZSBhZnRlciBlbmRcIikpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCB3cml0ZUVycm9ySGFuZGxlciA9IGVyciA9PiB7XG4gICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmVqZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBzdHJlYW0ub25jZShcImVycm9yXCIsIHdyaXRlRXJyb3JIYW5kbGVyKTtcbiAgXG4gICAgICAgIGNvbnN0IGNhbldyaXRlID0gc3RyZWFtLndyaXRlKGNodW5rKTtcbiAgXG4gICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIHdyaXRlRXJyb3JIYW5kbGVyKTtcbiAgXG4gICAgICAgIGlmIChjYW5Xcml0ZSkge1xuICAgICAgICAgIGlmICghcmVqZWN0ZWQpIHtcbiAgICAgICAgICAgIHJlc29sdmUoY2h1bmsubGVuZ3RoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgZXJyb3JIYW5kbGVyID0gZXJyID0+IHtcbiAgICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIGNvbnN0IGRyYWluSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVzb2x2ZShjaHVuay5sZW5ndGgpO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgY29uc3QgY2xvc2VIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICByZXNvbHZlKGNodW5rLmxlbmd0aCk7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICBjb25zdCBmaW5pc2hIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICByZXNvbHZlKGNodW5rLmxlbmd0aCk7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICBjb25zdCByZW1vdmVMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJjbG9zZVwiLCBjbG9zZUhhbmRsZXIpO1xuICAgICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZHJhaW5cIiwgZHJhaW5IYW5kbGVyKTtcbiAgICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gICAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJmaW5pc2hcIiwgZmluaXNoSGFuZGxlcik7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICBzdHJlYW0ub24oXCJjbG9zZVwiLCBjbG9zZUhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5vbihcImRyYWluXCIsIGRyYWluSGFuZGxlcik7XG4gICAgICAgICAgc3RyZWFtLm9uKFwiZXJyb3JcIiwgZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ub24oXCJmaW5pc2hcIiwgZmluaXNoSGFuZGxlcik7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICBcbiAgICBjb25zdCBlbmQgPSAoKSA9PiB7XG4gIFxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKF9lcnJvcmVkKSB7XG4gICAgICAgICAgY29uc3QgZXJyID0gX2Vycm9yZWQ7XG4gICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBpZiAoIXN0cmVhbS53cml0YWJsZSB8fCBzdHJlYW0uY2xvc2VkIHx8IHN0cmVhbS5kZXN0cm95ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCBmaW5pc2hIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgZXJyb3JIYW5kbGVyID0gKGVycikgPT4ge1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCByZW1vdmVMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJmaW5pc2hcIiwgZmluaXNoSGFuZGxlcik7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIHN0cmVhbS5vbihcImZpbmlzaFwiLCBmaW5pc2hIYW5kbGVyKTtcbiAgICAgICAgc3RyZWFtLm9uKFwiZXJyb3JcIiwgZXJyb3JIYW5kbGVyKTtcbiAgXG4gICAgICAgIHN0cmVhbS5lbmQoKTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHt3cml0ZSwgZW5kfTtcbiAgfVxuICBcbiAgZXhwb3J0IGRlZmF1bHQgcHJvbWlzZVdyaXRlYWJsZVN0cmVhbVxuICAiLCJpbXBvcnQgeyBlbnN1cmVTaGFyZE5hbWVJc0luU2hhcmRNYXAgfSBmcm9tICcuL3NoYXJkaW5nJztcbmltcG9ydCB7IGdldEluZGV4V3JpdGVyIH0gZnJvbSAnLi9zZXJpYWxpemVyJztcbmltcG9ydCB7IGlzU2hhcmRlZEluZGV4IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7cHJvbWlzZVdyaXRlYWJsZVN0cmVhbX0gZnJvbSBcIi4vcHJvbWlzZVdyaXRhYmxlU3RyZWFtXCI7XG5pbXBvcnQge3Byb21pc2VSZWFkYWJsZVN0cmVhbX0gZnJvbSBcIi4vcHJvbWlzZVJlYWRhYmxlU3RyZWFtXCI7XG5cbmV4cG9ydCBjb25zdCBhcHBseVRvU2hhcmQgPSBhc3luYyAoaGllcmFyY2h5LCBzdG9yZSwgaW5kZXhLZXksXG4gIGluZGV4Tm9kZSwgaW5kZXhTaGFyZEtleSwgcmVjb3Jkc1RvV3JpdGUsIGtleXNUb1JlbW92ZSkgPT4ge1xuICBjb25zdCBjcmVhdGVJZk5vdEV4aXN0cyA9IHJlY29yZHNUb1dyaXRlLmxlbmd0aCA+IDA7XG4gIGNvbnN0IHdyaXRlciA9IGF3YWl0IGdldFdyaXRlcihoaWVyYXJjaHksIHN0b3JlLCBpbmRleEtleSwgaW5kZXhTaGFyZEtleSwgaW5kZXhOb2RlLCBjcmVhdGVJZk5vdEV4aXN0cyk7XG4gIGlmICh3cml0ZXIgPT09IFNIQVJEX0RFTEVURUQpIHJldHVybjtcblxuICBhd2FpdCB3cml0ZXIudXBkYXRlSW5kZXgocmVjb3Jkc1RvV3JpdGUsIGtleXNUb1JlbW92ZSk7XG4gIGF3YWl0IHN3YXBUZW1wRmlsZUluKHN0b3JlLCBpbmRleFNoYXJkS2V5KTtcbn07XG5cbmNvbnN0IFNIQVJEX0RFTEVURUQgPSAnU0hBUkRfREVMRVRFRCc7XG5jb25zdCBnZXRXcml0ZXIgPSBhc3luYyAoaGllcmFyY2h5LCBzdG9yZSwgaW5kZXhLZXksIGluZGV4ZWREYXRhS2V5LCBpbmRleE5vZGUsIGNyZWF0ZUlmTm90RXhpc3RzKSA9PiB7XG4gIGxldCByZWFkYWJsZVN0cmVhbSA9IG51bGw7XG5cbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICBhd2FpdCBlbnN1cmVTaGFyZE5hbWVJc0luU2hhcmRNYXAoc3RvcmUsIGluZGV4S2V5LCBpbmRleGVkRGF0YUtleSk7XG4gICAgaWYoIWF3YWl0IHN0b3JlLmV4aXN0cyhpbmRleGVkRGF0YUtleSkpIHtcbiAgICAgIGF3YWl0IHN0b3JlLmNyZWF0ZUZpbGUoaW5kZXhlZERhdGFLZXksIFwiXCIpO1xuICAgIH1cbiAgfVxuXG4gIHRyeSB7XG5cbiAgICByZWFkYWJsZVN0cmVhbSA9IHByb21pc2VSZWFkYWJsZVN0cmVhbShcbiAgICAgICAgYXdhaXQgc3RvcmUucmVhZGFibGVGaWxlU3RyZWFtKGluZGV4ZWREYXRhS2V5KVxuICAgICk7XG5cbiAgfSBjYXRjaCAoZSkge1xuXG4gICAgaWYgKGF3YWl0IHN0b3JlLmV4aXN0cyhpbmRleGVkRGF0YUtleSkpIHtcbiAgICAgIHRocm93IGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjcmVhdGVJZk5vdEV4aXN0cykgeyBcbiAgICAgICAgYXdhaXQgc3RvcmUuY3JlYXRlRmlsZShpbmRleGVkRGF0YUtleSwgJycpOyBcbiAgICAgIH0gZWxzZSB7IFxuICAgICAgICByZXR1cm4gU0hBUkRfREVMRVRFRDsgXG4gICAgICB9XG5cbiAgICAgIHJlYWRhYmxlU3RyZWFtID0gcHJvbWlzZVJlYWRhYmxlU3RyZWFtKFxuICAgICAgICAgIGF3YWl0IHN0b3JlLnJlYWRhYmxlRmlsZVN0cmVhbShpbmRleGVkRGF0YUtleSlcbiAgICAgICk7XG5cbiAgICB9XG4gIH1cblxuICBjb25zdCB3cml0YWJsZVN0cmVhbSA9IHByb21pc2VXcml0ZWFibGVTdHJlYW0oXG4gICAgICBhd2FpdCBzdG9yZS53cml0YWJsZUZpbGVTdHJlYW0oaW5kZXhlZERhdGFLZXkgKyBcIi50ZW1wXCIpXG4gICk7XG5cbiAgcmV0dXJuIGdldEluZGV4V3JpdGVyKFxuICAgIGhpZXJhcmNoeSwgaW5kZXhOb2RlLFxuICAgICAgICByZWFkYWJsZVN0cmVhbSwgd3JpdGFibGVTdHJlYW1cbiAgKTtcbn07XG5cbmNvbnN0IHN3YXBUZW1wRmlsZUluID0gYXN5bmMgKHN0b3JlLCBpbmRleGVkRGF0YUtleSwgaXNSZXRyeSA9IGZhbHNlKSA9PiB7XG4gIGNvbnN0IHRlbXBGaWxlID0gYCR7aW5kZXhlZERhdGFLZXl9LnRlbXBgO1xuICB0cnkge1xuICAgIGF3YWl0IHN0b3JlLmRlbGV0ZUZpbGUoaW5kZXhlZERhdGFLZXkpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gaWdub3JlIGZhaWx1cmUsIGluY2FzZSBpdCBoYXMgbm90IGJlZW4gY3JlYXRlZCB5ZXRcbiAgfVxuICB0cnkge1xuICAgIGF3YWl0IHN0b3JlLnJlbmFtZUZpbGUodGVtcEZpbGUsIGluZGV4ZWREYXRhS2V5KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIHJldHJ5aW5nIGluIGNhc2UgZGVsZXRlIGZhaWx1cmUgd2FzIGZvciBzb21lIG90aGVyIHJlYXNvblxuICAgIGlmICghaXNSZXRyeSkge1xuICAgICAgYXdhaXQgc3dhcFRlbXBGaWxlSW4oc3RvcmUsIGluZGV4ZWREYXRhS2V5LCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIHN3YXAgaW4gaW5kZXggZmlsZWQ6IFwiICsgZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBmaWx0ZXIsIG1hcCwgaXNVbmRlZmluZWQsIGluY2x1ZGVzLFxuICBmbGF0dGVuLCBpbnRlcnNlY3Rpb25CeSxcbiAgaXNFcXVhbCwgcHVsbCwga2V5cyxcbiAgZGlmZmVyZW5jZUJ5LCBkaWZmZXJlbmNlLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgdW5pb24gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgZ2V0UmVsZXZhbnRBbmNlc3RvckluZGV4ZXMsXG4gIGdldFJlbGV2YW50UmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMsXG59IGZyb20gJy4uL2luZGV4aW5nL3JlbGV2YW50JztcbmltcG9ydCB7IGV2YWx1YXRlIH0gZnJvbSAnLi4vaW5kZXhpbmcvZXZhbHVhdGUnO1xuaW1wb3J0IHtcbiAgJCwgaXNTb21ldGhpbmcsXG4gIGlzTm9uRW1wdHlBcnJheSwgam9pbktleSxcbiAgaXNOb25FbXB0eVN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldEluZGV4ZWREYXRhS2V5IH0gZnJvbSAnLi4vaW5kZXhpbmcvc2hhcmRpbmcnO1xuaW1wb3J0IHtcbiAgaXNVcGRhdGUsIGlzQ3JlYXRlLFxuICBpc0RlbGV0ZSwgaXNCdWlsZEluZGV4LFxufSBmcm9tICcuL3RyYW5zYWN0aW9uc0NvbW1vbic7XG5pbXBvcnQgeyBhcHBseVRvU2hhcmQgfSBmcm9tICcuLi9pbmRleGluZy9hcHBseSc7XG5pbXBvcnQge1xuICBnZXRBY3R1YWxLZXlPZlBhcmVudCxcbiAgaXNHbG9iYWxJbmRleCwgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXgsIGlzUmVmZXJlbmNlSW5kZXgsXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5cbmV4cG9ydCBjb25zdCBleGVjdXRlVHJhbnNhY3Rpb25zID0gYXBwID0+IGFzeW5jICh0cmFuc2FjdGlvbnMpID0+IHtcbiAgY29uc3QgcmVjb3Jkc0J5U2hhcmQgPSBtYXBwZWRSZWNvcmRzQnlJbmRleFNoYXJkKGFwcC5oaWVyYXJjaHksIHRyYW5zYWN0aW9ucyk7XG5cbiAgZm9yIChjb25zdCBzaGFyZCBvZiBrZXlzKHJlY29yZHNCeVNoYXJkKSkge1xuICAgIGF3YWl0IGFwcGx5VG9TaGFyZChcbiAgICAgIGFwcC5oaWVyYXJjaHksIGFwcC5kYXRhc3RvcmUsXG4gICAgICByZWNvcmRzQnlTaGFyZFtzaGFyZF0uaW5kZXhLZXksXG4gICAgICByZWNvcmRzQnlTaGFyZFtzaGFyZF0uaW5kZXhOb2RlLFxuICAgICAgc2hhcmQsXG4gICAgICByZWNvcmRzQnlTaGFyZFtzaGFyZF0ud3JpdGVzLFxuICAgICAgcmVjb3Jkc0J5U2hhcmRbc2hhcmRdLnJlbW92ZXMsXG4gICAgKTtcbiAgfVxufTtcblxuY29uc3QgbWFwcGVkUmVjb3Jkc0J5SW5kZXhTaGFyZCA9IChoaWVyYXJjaHksIHRyYW5zYWN0aW9ucykgPT4ge1xuICBjb25zdCB1cGRhdGVzID0gZ2V0VXBkYXRlVHJhbnNhY3Rpb25zQnlTaGFyZChcbiAgICBoaWVyYXJjaHksIHRyYW5zYWN0aW9ucyxcbiAgKTtcblxuICBjb25zdCBjcmVhdGVkID0gZ2V0Q3JlYXRlVHJhbnNhY3Rpb25zQnlTaGFyZChcbiAgICBoaWVyYXJjaHksIHRyYW5zYWN0aW9ucyxcbiAgKTtcbiAgY29uc3QgZGVsZXRlcyA9IGdldERlbGV0ZVRyYW5zYWN0aW9uc0J5U2hhcmQoXG4gICAgaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMsXG4gICk7XG5cbiAgY29uc3QgaW5kZXhCdWlsZCA9IGdldEJ1aWxkSW5kZXhUcmFuc2FjdGlvbnNCeVNoYXJkKFxuICAgIGhpZXJhcmNoeSxcbiAgICB0cmFuc2FjdGlvbnMsXG4gICk7XG5cbiAgY29uc3QgdG9SZW1vdmUgPSBbXG4gICAgLi4uZGVsZXRlcyxcbiAgICAuLi51cGRhdGVzLnRvUmVtb3ZlLFxuICBdO1xuXG4gIGNvbnN0IHRvV3JpdGUgPSBbXG4gICAgLi4uY3JlYXRlZCxcbiAgICAuLi51cGRhdGVzLnRvV3JpdGUsXG4gICAgLi4uaW5kZXhCdWlsZCxcbiAgXTtcblxuICBjb25zdCB0cmFuc0J5U2hhcmQgPSB7fTtcblxuICBjb25zdCBpbml0aWFsaXNlU2hhcmQgPSAodCkgPT4ge1xuICAgIGlmIChpc1VuZGVmaW5lZCh0cmFuc0J5U2hhcmRbdC5pbmRleFNoYXJkS2V5XSkpIHtcbiAgICAgIHRyYW5zQnlTaGFyZFt0LmluZGV4U2hhcmRLZXldID0ge1xuICAgICAgICB3cml0ZXM6IFtdLFxuICAgICAgICByZW1vdmVzOiBbXSxcbiAgICAgICAgaW5kZXhLZXk6IHQuaW5kZXhLZXksXG4gICAgICAgIGluZGV4Tm9kZUtleTogdC5pbmRleE5vZGVLZXksXG4gICAgICAgIGluZGV4Tm9kZTogdC5pbmRleE5vZGUsXG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuICBmb3IgKGNvbnN0IHRyYW5zIG9mIHRvV3JpdGUpIHtcbiAgICBpbml0aWFsaXNlU2hhcmQodHJhbnMpO1xuICAgIHRyYW5zQnlTaGFyZFt0cmFucy5pbmRleFNoYXJkS2V5XS53cml0ZXMucHVzaChcbiAgICAgIHRyYW5zLm1hcHBlZFJlY29yZC5yZXN1bHQsXG4gICAgKTtcbiAgfVxuXG4gIGZvciAoY29uc3QgdHJhbnMgb2YgdG9SZW1vdmUpIHtcbiAgICBpbml0aWFsaXNlU2hhcmQodHJhbnMpO1xuICAgIHRyYW5zQnlTaGFyZFt0cmFucy5pbmRleFNoYXJkS2V5XS5yZW1vdmVzLnB1c2goXG4gICAgICB0cmFucy5tYXBwZWRSZWNvcmQucmVzdWx0LmtleSxcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIHRyYW5zQnlTaGFyZDtcbn07XG5cbmNvbnN0IGdldFVwZGF0ZVRyYW5zYWN0aW9uc0J5U2hhcmQgPSAoaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMpID0+IHtcbiAgY29uc3QgdXBkYXRlVHJhbnNhY3Rpb25zID0gJCh0cmFuc2FjdGlvbnMsIFtmaWx0ZXIoaXNVcGRhdGUpXSk7XG5cbiAgY29uc3QgZXZhbHVhdGVJbmRleCA9IChyZWNvcmQsIGluZGV4Tm9kZUFuZFBhdGgpID0+IHtcbiAgICBjb25zdCBtYXBwZWRSZWNvcmQgPSBldmFsdWF0ZShyZWNvcmQpKGluZGV4Tm9kZUFuZFBhdGguaW5kZXhOb2RlKTtcbiAgICByZXR1cm4gKHtcbiAgICAgIG1hcHBlZFJlY29yZCxcbiAgICAgIGluZGV4Tm9kZTogaW5kZXhOb2RlQW5kUGF0aC5pbmRleE5vZGUsXG4gICAgICBpbmRleEtleTogaW5kZXhOb2RlQW5kUGF0aC5pbmRleEtleSxcbiAgICAgIGluZGV4U2hhcmRLZXk6IGdldEluZGV4ZWREYXRhS2V5KFxuICAgICAgICBpbmRleE5vZGVBbmRQYXRoLmluZGV4Tm9kZSxcbiAgICAgICAgaW5kZXhOb2RlQW5kUGF0aC5pbmRleEtleSxcbiAgICAgICAgbWFwcGVkUmVjb3JkLnJlc3VsdCxcbiAgICAgICksXG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkgPSBpbmRleEZpbHRlciA9PiAodCwgaW5kZXhlcykgPT4gJChpbmRleGVzLCBbXG4gICAgbWFwKG4gPT4gKHtcbiAgICAgIG9sZDogZXZhbHVhdGVJbmRleCh0Lm9sZFJlY29yZCwgbiksXG4gICAgICBuZXc6IGV2YWx1YXRlSW5kZXgodC5yZWNvcmQsIG4pLFxuICAgIH0pKSxcbiAgICBmaWx0ZXIoaW5kZXhGaWx0ZXIpLFxuICBdKTtcblxuICBjb25zdCB0b1JlbW92ZUZpbHRlciA9IChuLCBpc1VucmVmZXJlbmNlZCkgPT4gbi5vbGQubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gdHJ1ZVxuICAgICAgICAmJiAobi5uZXcubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gZmFsc2VcbiAgICAgICAgICAgIHx8IGlzVW5yZWZlcmVuY2VkKTtcblxuICBjb25zdCB0b0FkZEZpbHRlciA9IChuLCBpc05ld2x5UmVmZXJlbmNlZCkgPT4gKG4ub2xkLm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IGZhbHNlXG4gICAgICAgIHx8IGlzTmV3bHlSZWZlcmVuY2VkKVxuICAgICAgICAmJiBuLm5ldy5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSB0cnVlO1xuXG4gIGNvbnN0IHRvVXBkYXRlRmlsdGVyID0gbiA9PiBuLm5ldy5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSB0cnVlXG4gICAgICAgICYmIG4ub2xkLm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IHRydWVcbiAgICAgICAgJiYgIWlzRXF1YWwobi5vbGQubWFwcGVkUmVjb3JkLnJlc3VsdCxcbiAgICAgICAgICBuLm5ldy5tYXBwZWRSZWNvcmQucmVzdWx0KTtcblxuICBjb25zdCB0b1JlbW92ZSA9IFtdO1xuICBjb25zdCB0b1dyaXRlID0gW107XG5cbiAgZm9yIChjb25zdCB0IG9mIHVwZGF0ZVRyYW5zYWN0aW9ucykge1xuICAgIGNvbnN0IGFuY2VzdG9ySWR4cyA9IGdldFJlbGV2YW50QW5jZXN0b3JJbmRleGVzKFxuICAgICAgaGllcmFyY2h5LCB0LnJlY29yZCxcbiAgICApO1xuXG4gICAgY29uc3QgcmVmZXJlbmNlQ2hhbmdlcyA9IGRpZmZSZXZlcnNlUmVmRm9yVXBkYXRlKFxuICAgICAgaGllcmFyY2h5LCB0Lm9sZFJlY29yZCwgdC5yZWNvcmQsXG4gICAgKTtcblxuICAgIC8vIG9sZCByZWNvcmRzIHRvIHJlbW92ZSAoZmlsdGVyZWQgb3V0KVxuICAgIGNvbnN0IGZpbHRlcmVkT3V0X3RvUmVtb3ZlID0gdW5pb24oXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b1JlbW92ZUZpbHRlcikodCwgYW5jZXN0b3JJZHhzKSxcbiAgICAgIC8vIHN0aWxsIHJlZmVyZW5jZWQgLSBjaGVjayBmaWx0ZXJcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvUmVtb3ZlRmlsdGVyKSh0LCByZWZlcmVuY2VDaGFuZ2VzLm5vdENoYW5nZWQpLFxuICAgICAgLy8gdW4gcmVmZXJlbmNlZCAtIHJlbW92ZSBpZiBpbiB0aGVyZSBhbHJlYWR5XG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseShuID0+IHRvUmVtb3ZlRmlsdGVyKG4sIHRydWUpKSh0LCByZWZlcmVuY2VDaGFuZ2VzLnVuUmVmZXJlbmNlZCksXG4gICAgKTtcblxuICAgIC8vIG5ldyByZWNvcmRzIHRvIGFkZCAoZmlsdGVyZWQgaW4pXG4gICAgY29uc3QgZmlsdGVyZWRJbl90b0FkZCA9IHVuaW9uKFxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodG9BZGRGaWx0ZXIpKHQsIGFuY2VzdG9ySWR4cyksXG4gICAgICAvLyBuZXdseSByZWZlcmVuY2VkIC0gY2hlY2sgZmlsdGVyXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseShuID0+IHRvQWRkRmlsdGVyKG4sIHRydWUpKSh0LCByZWZlcmVuY2VDaGFuZ2VzLm5ld2x5UmVmZXJlbmNlZCksXG4gICAgICAvLyByZWZlcmVuY2UgdW5jaGFuZ2VkIC0gcmVydW4gZmlsdGVyIGluIGNhc2Ugc29tZXRoaW5nIGVsc2UgY2hhbmdlZFxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodG9BZGRGaWx0ZXIpKHQsIHJlZmVyZW5jZUNoYW5nZXMubm90Q2hhbmdlZCksXG4gICAgKTtcblxuICAgIGNvbnN0IGNoYW5nZWQgPSB1bmlvbihcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvVXBkYXRlRmlsdGVyKSh0LCBhbmNlc3RvcklkeHMpLFxuICAgICAgLy8gc3RpbGwgcmVmZXJlbmNlZCAtIHJlY2hlY2sgZmlsdGVyXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b1VwZGF0ZUZpbHRlcikodCwgcmVmZXJlbmNlQ2hhbmdlcy5ub3RDaGFuZ2VkKSxcbiAgICApO1xuXG4gICAgY29uc3Qgc2hhcmRLZXlDaGFuZ2VkID0gJChjaGFuZ2VkLCBbXG4gICAgICBmaWx0ZXIoYyA9PiBjLm9sZC5pbmRleFNoYXJkS2V5ICE9PSBjLm5ldy5pbmRleFNoYXJkS2V5KSxcbiAgICBdKTtcblxuICAgIGNvbnN0IGNoYW5nZWRJblNhbWVTaGFyZCA9ICQoc2hhcmRLZXlDaGFuZ2VkLCBbXG4gICAgICBkaWZmZXJlbmNlKGNoYW5nZWQpLFxuICAgIF0pO1xuXG4gICAgZm9yIChjb25zdCByZXMgb2Ygc2hhcmRLZXlDaGFuZ2VkKSB7XG4gICAgICBwdWxsKHJlcykoY2hhbmdlZCk7XG4gICAgICBmaWx0ZXJlZE91dF90b1JlbW92ZS5wdXNoKHJlcyk7XG4gICAgICBmaWx0ZXJlZEluX3RvQWRkLnB1c2gocmVzKTtcbiAgICB9XG5cbiAgICB0b1JlbW92ZS5wdXNoKFxuICAgICAgJChmaWx0ZXJlZE91dF90b1JlbW92ZSwgW1xuICAgICAgICBtYXAoaSA9PiBpLm9sZCksXG4gICAgICBdKSxcbiAgICApO1xuXG4gICAgdG9Xcml0ZS5wdXNoKFxuICAgICAgJChmaWx0ZXJlZEluX3RvQWRkLCBbXG4gICAgICAgIG1hcChpID0+IGkubmV3KSxcbiAgICAgIF0pLFxuICAgICk7XG5cbiAgICB0b1dyaXRlLnB1c2goXG4gICAgICAkKGNoYW5nZWRJblNhbWVTaGFyZCwgW1xuICAgICAgICBtYXAoaSA9PiBpLm5ldyksXG4gICAgICBdKSxcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuICh7XG4gICAgdG9SZW1vdmU6IGZsYXR0ZW4odG9SZW1vdmUpLFxuICAgIHRvV3JpdGU6IGZsYXR0ZW4odG9Xcml0ZSksXG4gIH0pO1xufTtcblxuY29uc3QgZ2V0QnVpbGRJbmRleFRyYW5zYWN0aW9uc0J5U2hhcmQgPSAoaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMpID0+IHtcbiAgY29uc3QgYnVpbGRUcmFuc2FjdGlvbnMgPSAkKHRyYW5zYWN0aW9ucywgW2ZpbHRlcihpc0J1aWxkSW5kZXgpXSk7XG4gIGlmICghaXNOb25FbXB0eUFycmF5KGJ1aWxkVHJhbnNhY3Rpb25zKSkgcmV0dXJuIFtdO1xuICBjb25zdCBpbmRleE5vZGUgPSB0cmFuc2FjdGlvbnMuaW5kZXhOb2RlO1xuXG4gIGNvbnN0IGdldEluZGV4S2V5cyA9ICh0KSA9PiB7XG4gICAgaWYgKGlzR2xvYmFsSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgICAgcmV0dXJuIFtpbmRleE5vZGUubm9kZUtleSgpXTtcbiAgICB9XG5cbiAgICBpZiAoaXNSZWZlcmVuY2VJbmRleChpbmRleE5vZGUpKSB7XG4gICAgICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChoaWVyYXJjaHkpKHQucmVjb3JkLmtleSk7XG4gICAgICBjb25zdCByZWZGaWVsZHMgPSAkKHJlY29yZE5vZGUuZmllbGRzLCBbXG4gICAgICAgIGZpbHRlcihmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleChpbmRleE5vZGUpKSxcbiAgICAgIF0pO1xuICAgICAgY29uc3QgaW5kZXhLZXlzID0gW107XG4gICAgICBmb3IgKGNvbnN0IHJlZkZpZWxkIG9mIHJlZkZpZWxkcykge1xuICAgICAgICBjb25zdCByZWZWYWx1ZSA9IHQucmVjb3JkW3JlZkZpZWxkLm5hbWVdO1xuICAgICAgICBpZiAoaXNTb21ldGhpbmcocmVmVmFsdWUpXG4gICAgICAgICAgICAgICAgICAgJiYgaXNOb25FbXB0eVN0cmluZyhyZWZWYWx1ZS5rZXkpKSB7XG4gICAgICAgICAgY29uc3QgaW5kZXhLZXkgPSBqb2luS2V5KFxuICAgICAgICAgICAgcmVmVmFsdWUua2V5LFxuICAgICAgICAgICAgaW5kZXhOb2RlLm5hbWUsXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmICghaW5jbHVkZXMoaW5kZXhLZXkpKGluZGV4S2V5cykpIHsgaW5kZXhLZXlzLnB1c2goaW5kZXhLZXkpOyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpbmRleEtleXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtqb2luS2V5KFxuICAgICAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQoXG4gICAgICAgIGluZGV4Tm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksXG4gICAgICAgIHQucmVjb3JkLmtleSxcbiAgICAgICksXG4gICAgICBpbmRleE5vZGUubmFtZSxcbiAgICApXTtcbiAgfTtcblxuICByZXR1cm4gJChidWlsZFRyYW5zYWN0aW9ucywgW1xuICAgIG1hcCgodCkgPT4ge1xuICAgICAgY29uc3QgbWFwcGVkUmVjb3JkID0gZXZhbHVhdGUodC5yZWNvcmQpKGluZGV4Tm9kZSk7XG4gICAgICBpZiAoIW1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIpIHJldHVybiBudWxsO1xuICAgICAgY29uc3QgaW5kZXhLZXlzID0gZ2V0SW5kZXhLZXlzKHQpO1xuICAgICAgcmV0dXJuICQoaW5kZXhLZXlzLCBbXG4gICAgICAgIG1hcChpbmRleEtleSA9PiAoe1xuICAgICAgICAgIG1hcHBlZFJlY29yZCxcbiAgICAgICAgICBpbmRleE5vZGUsXG4gICAgICAgICAgaW5kZXhLZXksXG4gICAgICAgICAgaW5kZXhTaGFyZEtleTogZ2V0SW5kZXhlZERhdGFLZXkoXG4gICAgICAgICAgICBpbmRleE5vZGUsXG4gICAgICAgICAgICBpbmRleEtleSxcbiAgICAgICAgICAgIG1hcHBlZFJlY29yZC5yZXN1bHQsXG4gICAgICAgICAgKSxcbiAgICAgICAgfSkpLFxuICAgICAgXSk7XG4gICAgfSksXG4gICAgZmxhdHRlbixcbiAgICBmaWx0ZXIoaXNTb21ldGhpbmcpLFxuICBdKTtcbn07XG5cbmNvbnN0IGdldF9DcmVhdGVfRGVsZXRlX1RyYW5zYWN0aW9uc0J5U2hhcmQgPSBwcmVkID0+IChoaWVyYXJjaHksIHRyYW5zYWN0aW9ucykgPT4ge1xuICBjb25zdCBjcmVhdGVUcmFuc2FjdGlvbnMgPSAkKHRyYW5zYWN0aW9ucywgW2ZpbHRlcihwcmVkKV0pO1xuXG4gIGNvbnN0IGdldEluZGV4Tm9kZXNUb0FwcGx5ID0gKHQsIGluZGV4ZXMpID0+ICQoaW5kZXhlcywgW1xuICAgIG1hcCgobikgPT4ge1xuICAgICAgY29uc3QgbWFwcGVkUmVjb3JkID0gZXZhbHVhdGUodC5yZWNvcmQpKG4uaW5kZXhOb2RlKTtcbiAgICAgIHJldHVybiAoe1xuICAgICAgICBtYXBwZWRSZWNvcmQsXG4gICAgICAgIGluZGV4Tm9kZTogbi5pbmRleE5vZGUsXG4gICAgICAgIGluZGV4S2V5OiBuLmluZGV4S2V5LFxuICAgICAgICBpbmRleFNoYXJkS2V5OiBnZXRJbmRleGVkRGF0YUtleShcbiAgICAgICAgICBuLmluZGV4Tm9kZSxcbiAgICAgICAgICBuLmluZGV4S2V5LFxuICAgICAgICAgIG1hcHBlZFJlY29yZC5yZXN1bHQsXG4gICAgICAgICksXG4gICAgICB9KTtcbiAgICB9KSxcbiAgICBmaWx0ZXIobiA9PiBuLm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIpLFxuICBdKTtcblxuICBjb25zdCBhbGxUb0FwcGx5ID0gW107XG5cbiAgZm9yIChjb25zdCB0IG9mIGNyZWF0ZVRyYW5zYWN0aW9ucykge1xuICAgIGNvbnN0IGFuY2VzdG9ySWR4cyA9IGdldFJlbGV2YW50QW5jZXN0b3JJbmRleGVzKGhpZXJhcmNoeSwgdC5yZWNvcmQpO1xuICAgIGNvbnN0IHJldmVyc2VSZWYgPSBnZXRSZWxldmFudFJldmVyc2VSZWZlcmVuY2VJbmRleGVzKGhpZXJhcmNoeSwgdC5yZWNvcmQpO1xuXG4gICAgYWxsVG9BcHBseS5wdXNoKFxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodCwgYW5jZXN0b3JJZHhzKSxcbiAgICApO1xuICAgIGFsbFRvQXBwbHkucHVzaChcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHQsIHJldmVyc2VSZWYpLFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gZmxhdHRlbihhbGxUb0FwcGx5KTtcbn07XG5cbmNvbnN0IGdldERlbGV0ZVRyYW5zYWN0aW9uc0J5U2hhcmQgPSBnZXRfQ3JlYXRlX0RlbGV0ZV9UcmFuc2FjdGlvbnNCeVNoYXJkKGlzRGVsZXRlKTtcblxuY29uc3QgZ2V0Q3JlYXRlVHJhbnNhY3Rpb25zQnlTaGFyZCA9IGdldF9DcmVhdGVfRGVsZXRlX1RyYW5zYWN0aW9uc0J5U2hhcmQoaXNDcmVhdGUpO1xuXG5jb25zdCBkaWZmUmV2ZXJzZVJlZkZvclVwZGF0ZSA9IChhcHBIaWVyYXJjaHksIG9sZFJlY29yZCwgbmV3UmVjb3JkKSA9PiB7XG4gIGNvbnN0IG9sZEluZGV4ZXMgPSBnZXRSZWxldmFudFJldmVyc2VSZWZlcmVuY2VJbmRleGVzKFxuICAgIGFwcEhpZXJhcmNoeSwgb2xkUmVjb3JkLFxuICApO1xuICBjb25zdCBuZXdJbmRleGVzID0gZ2V0UmVsZXZhbnRSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyhcbiAgICBhcHBIaWVyYXJjaHksIG5ld1JlY29yZCxcbiAgKTtcblxuICBjb25zdCB1blJlZmVyZW5jZWQgPSBkaWZmZXJlbmNlQnkoXG4gICAgaSA9PiBpLmluZGV4S2V5LFxuICAgIG9sZEluZGV4ZXMsIG5ld0luZGV4ZXMsXG4gICk7XG5cbiAgY29uc3QgbmV3bHlSZWZlcmVuY2VkID0gZGlmZmVyZW5jZUJ5KFxuICAgIGkgPT4gaS5pbmRleEtleSxcbiAgICBuZXdJbmRleGVzLCBvbGRJbmRleGVzLFxuICApO1xuXG4gIGNvbnN0IG5vdENoYW5nZWQgPSBpbnRlcnNlY3Rpb25CeShcbiAgICBpID0+IGkuaW5kZXhLZXksXG4gICAgbmV3SW5kZXhlcywgb2xkSW5kZXhlcyxcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIHVuUmVmZXJlbmNlZCxcbiAgICBuZXdseVJlZmVyZW5jZWQsXG4gICAgbm90Q2hhbmdlZCxcbiAgfTtcbn07XG4iLCJpbXBvcnQgeyBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgcmV0cmlldmUgfSBmcm9tICcuL3JldHJpZXZlJztcbmltcG9ydCB7IGV4ZWN1dGVUcmFuc2FjdGlvbnMgfSBmcm9tICcuL2V4ZWN1dGUnO1xuaW1wb3J0IHtcbiAgJCwgam9pbktleSwgZ2V0TG9jaywgaXNOb2xvY2ssIHJlbGVhc2VMb2NrLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgTE9DS19GSUxFX0tFWSwgVFJBTlNBQ1RJT05TX0ZPTERFUixcbiAgdGltZW91dE1pbGxpc2Vjb25kcywgZ2V0VHJhbnNhY3Rpb25JZCxcbiAgbWF4TG9ja1JldHJpZXMsXG59IGZyb20gJy4vdHJhbnNhY3Rpb25zQ29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGNsZWFudXAgPSBhc3luYyAoYXBwKSA9PiB7XG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRUcmFuc2FjdGlvbkxvY2soYXBwKTtcbiAgaWYgKGlzTm9sb2NrKGxvY2spKSByZXR1cm47XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB0cmFuc2FjdGlvbnMgPSBhd2FpdCByZXRyaWV2ZShhcHApO1xuICAgIGlmICh0cmFuc2FjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgZXhlY3V0ZVRyYW5zYWN0aW9ucyhhcHApKHRyYW5zYWN0aW9ucyk7XG5cbiAgICAgIGNvbnN0IGZvbGRlciA9IHRyYW5zYWN0aW9ucy5mb2xkZXJLZXlcbiAgICAgICAgPyB0cmFuc2FjdGlvbnMuZm9sZGVyS2V5XG4gICAgICAgIDogVFJBTlNBQ1RJT05TX0ZPTERFUjtcblxuICAgICAgY29uc3QgZGVsZXRlRmlsZXMgPSAkKHRyYW5zYWN0aW9ucywgW1xuICAgICAgICBtYXAodCA9PiBqb2luS2V5KFxuICAgICAgICAgIGZvbGRlcixcbiAgICAgICAgICBnZXRUcmFuc2FjdGlvbklkKFxuICAgICAgICAgICAgdC5yZWNvcmRJZCwgdC50cmFuc2FjdGlvblR5cGUsXG4gICAgICAgICAgICB0LnVuaXF1ZUlkLFxuICAgICAgICAgICksXG4gICAgICAgICkpLFxuICAgICAgICBtYXAoYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKSxcbiAgICAgIF0pO1xuXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChkZWxldGVGaWxlcyk7XG4gICAgfVxuICB9IGZpbmFsbHkge1xuICAgIGF3YWl0IHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XG4gIH1cbn07XG5cbmNvbnN0IGdldFRyYW5zYWN0aW9uTG9jayA9IGFzeW5jIGFwcCA9PiBhd2FpdCBnZXRMb2NrKFxuICBhcHAsIExPQ0tfRklMRV9LRVksXG4gIHRpbWVvdXRNaWxsaXNlY29uZHMsIG1heExvY2tSZXRyaWVzLFxuKTtcbiIsImltcG9ydCB7IGZpbHRlciB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBjb25maWdGb2xkZXIsIGFwcERlZmluaXRpb25GaWxlLCAkIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IFRSQU5TQUNUSU9OU19GT0xERVIgfSBmcm9tICcuLi90cmFuc2FjdGlvbnMvdHJhbnNhY3Rpb25zQ29tbW9uJztcbmltcG9ydCB7IEFVVEhfRk9MREVSLCBVU0VSU19MSVNUX0ZJTEUsIEFDQ0VTU19MRVZFTFNfRklMRSB9IGZyb20gJy4uL2F1dGhBcGkvYXV0aENvbW1vbic7XG5pbXBvcnQgeyBpbml0aWFsaXNlUm9vdENvbGxlY3Rpb25zIH0gZnJvbSAnLi4vY29sbGVjdGlvbkFwaS9pbml0aWFsaXNlJztcbmltcG9ydCB7IGluaXRpYWxpc2VJbmRleCB9IGZyb20gJy4uL2luZGV4aW5nL2luaXRpYWxpc2VJbmRleCc7XG5pbXBvcnQgeyBnZXRGbGF0dGVuZWRIaWVyYXJjaHksIGlzR2xvYmFsSW5kZXgsIGlzU2luZ2xlUmVjb3JkIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IF9zYXZlIH0gZnJvbSAnLi4vcmVjb3JkQXBpL3NhdmUnO1xuaW1wb3J0IHsgZ2V0TmV3IH0gZnJvbSAnLi4vcmVjb3JkQXBpL2dldE5ldyc7XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlRGF0YSA9IGFzeW5jIChkYXRhc3RvcmUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbiwgYWNjZXNzTGV2ZWxzKSA9PiB7XG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoY29uZmlnRm9sZGVyKTtcbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oYXBwRGVmaW5pdGlvbkZpbGUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbik7XG5cbiAgYXdhaXQgaW5pdGlhbGlzZVJvb3RDb2xsZWN0aW9ucyhkYXRhc3RvcmUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbi5oaWVyYXJjaHkpO1xuICBhd2FpdCBpbml0aWFsaXNlUm9vdEluZGV4ZXMoZGF0YXN0b3JlLCBhcHBsaWNhdGlvbkRlZmluaXRpb24uaGllcmFyY2h5KTtcblxuICBhd2FpdCBpbml0aWFsaXNlUm9vdFNpbmdsZVJlY29yZHMoZGF0YXN0b3JlLCBhcHBsaWNhdGlvbkRlZmluaXRpb24uaGllcmFyY2h5KTtcblxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKFRSQU5TQUNUSU9OU19GT0xERVIpO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoQVVUSF9GT0xERVIpO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKFVTRVJTX0xJU1RfRklMRSwgW10pO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKFxuICAgIEFDQ0VTU19MRVZFTFNfRklMRSwgXG4gICAgYWNjZXNzTGV2ZWxzID8gYWNjZXNzTGV2ZWxzIDogeyB2ZXJzaW9uOiAwLCBsZXZlbHM6IFtdIH0pO1xufTtcblxuY29uc3QgaW5pdGlhbGlzZVJvb3RJbmRleGVzID0gYXN5bmMgKGRhdGFzdG9yZSwgaGllcmFyY2h5KSA9PiB7XG4gIGNvbnN0IGZsYXRoaWVyYXJjaHkgPSBnZXRGbGF0dGVuZWRIaWVyYXJjaHkoaGllcmFyY2h5KTtcbiAgY29uc3QgZ2xvYmFsSW5kZXhlcyA9ICQoZmxhdGhpZXJhcmNoeSwgW1xuICAgIGZpbHRlcihpc0dsb2JhbEluZGV4KSxcbiAgXSk7XG5cbiAgZm9yIChjb25zdCBpbmRleCBvZiBnbG9iYWxJbmRleGVzKSB7XG4gICAgaWYgKCFhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGluZGV4Lm5vZGVLZXkoKSkpIHsgYXdhaXQgaW5pdGlhbGlzZUluZGV4KGRhdGFzdG9yZSwgJycsIGluZGV4KTsgfVxuICB9XG59O1xuXG5jb25zdCBpbml0aWFsaXNlUm9vdFNpbmdsZVJlY29yZHMgPSBhc3luYyAoZGF0YXN0b3JlLCBoaWVyYWNoeSkgPT4ge1xuICBjb25zdCBmbGF0aGllcmFyY2h5ID0gZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGhpZXJhY2h5KTtcbiAgY29uc3Qgc2luZ2xlUmVjb3JkcyA9ICQoZmxhdGhpZXJhcmNoeSwgW1xuICAgIGZpbHRlcihpc1NpbmdsZVJlY29yZCksXG4gIF0pO1xuXG4gIC8qIGZvciAobGV0IHJlY29yZCBvZiBzaW5nbGVSZWNvcmRzKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGdldE5ldyh7IGRhdGFzdG9yZTogZGF0YXN0b3JlLCBoaWVyYXJjaHk6IGFwcERlZmluaXRpb24uaGllcmFyY2h5IH0pXG4gICAgICAgICAgICAocmVjb3JkLm5vZGVLZXkoKSxcbiAgICAgICAgICAgICAgICByZWNvcmQubmFtZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBfc2F2ZSh7IGRhdGFzdG9yZTogZGF0YXN0b3JlLCBoaWVyYXJjaHk6IGFwcERlZmluaXRpb24uaGllcmFyY2h5IH0sXG4gICAgICAgICAgICByZXN1bHRcbiAgICAgICAgKTtcbiAgICB9ICovXG59O1xuIiwiaW1wb3J0IHsgaXNOb3RoaW5nIH0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdldERhdGFiYXNlTWFuYWdlciA9IGRhdGFiYXNlTWFuYWdlciA9PiAoe1xuICBjcmVhdGVFbXB0eU1hc3RlckRiOiBjcmVhdGVFbXB0eU1hc3RlckRiKGRhdGFiYXNlTWFuYWdlciksXG4gIGNyZWF0ZUVtcHR5SW5zdGFuY2VEYjogY3JlYXRlRW1wdHlJbnN0YW5jZURiKGRhdGFiYXNlTWFuYWdlciksXG4gIGdldEluc3RhbmNlRGJSb290Q29uZmlnOiBkYXRhYmFzZU1hbmFnZXIuZ2V0SW5zdGFuY2VEYlJvb3RDb25maWcsXG4gIG1hc3RlckRhdGFzdG9yZUNvbmZpZzogZ2V0TWFzdGVyRGF0YXN0b3JlQ29uZmlnKGRhdGFiYXNlTWFuYWdlciksXG4gIGdldEluc3RhbmNlRGF0YXN0b3JlQ29uZmlnOiBnZXRJbnN0YW5jZURhdGFzdG9yZUNvbmZpZyhkYXRhYmFzZU1hbmFnZXIpLFxufSk7XG5cbmNvbnN0IGdldE1hc3RlckRhdGFzdG9yZUNvbmZpZyA9IGRhdGFiYXNlTWFuYWdlciA9PiBkYXRhYmFzZU1hbmFnZXIuZ2V0RGF0YXN0b3JlQ29uZmlnKCdtYXN0ZXInKTtcblxuY29uc3QgZ2V0SW5zdGFuY2VEYXRhc3RvcmVDb25maWcgPSBkYXRhYmFzZU1hbmFnZXIgPT4gKGFwcGxpY2F0aW9uSWQsIGluc3RhbmNlSWQpID0+IGRhdGFiYXNlTWFuYWdlci5nZXREYXRhc3RvcmVDb25maWcoXG4gIGFwcGxpY2F0aW9uSWQsIGluc3RhbmNlSWQsXG4pO1xuXG5jb25zdCBjcmVhdGVFbXB0eU1hc3RlckRiID0gZGF0YWJhc2VNYW5hZ2VyID0+IGFzeW5jICgpID0+IGF3YWl0IGRhdGFiYXNlTWFuYWdlci5jcmVhdGVFbXB0eURiKCdtYXN0ZXInKTtcblxuY29uc3QgY3JlYXRlRW1wdHlJbnN0YW5jZURiID0gZGF0YWJhc2VNYW5hZ2VyID0+IGFzeW5jIChhcHBsaWNhdGlvbklkLCBpbnN0YW5jZUlkKSA9PiB7XG4gIGlmIChpc05vdGhpbmcoYXBwbGljYXRpb25JZCkpIHsgdGhyb3cgbmV3IEVycm9yKCdDcmVhdGVEYjogYXBwbGljYXRpb24gaWQgbm90IHN1cHBsaWVkJyk7IH1cbiAgaWYgKGlzTm90aGluZyhpbnN0YW5jZUlkKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0ZURiOiBpbnN0YW5jZSBpZCBub3Qgc3VwcGxpZWQnKTsgfVxuXG4gIHJldHVybiBhd2FpdCBkYXRhYmFzZU1hbmFnZXIuY3JlYXRlRW1wdHlEYihcbiAgICBhcHBsaWNhdGlvbklkLFxuICAgIGluc3RhbmNlSWQsXG4gICk7XG59O1xuIiwiaW1wb3J0IGdldFJlY29yZEFwaSBmcm9tIFwiLi9yZWNvcmRBcGlcIjtcbmltcG9ydCBnZXRDb2xsZWN0aW9uQXBpIGZyb20gXCIuL2NvbGxlY3Rpb25BcGlcIjtcbmltcG9ydCBnZXRJbmRleEFwaSBmcm9tIFwiLi9pbmRleEFwaVwiO1xuaW1wb3J0IGdldFRlbXBsYXRlQXBpIGZyb20gXCIuL3RlbXBsYXRlQXBpXCI7XG5pbXBvcnQgZ2V0QXV0aEFwaSBmcm9tIFwiLi9hdXRoQXBpXCI7XG5pbXBvcnQgZ2V0QWN0aW9uc0FwaSBmcm9tIFwiLi9hY3Rpb25zQXBpXCI7XG5pbXBvcnQge3NldHVwRGF0YXN0b3JlLCBjcmVhdGVFdmVudEFnZ3JlZ2F0b3J9IGZyb20gXCIuL2FwcEluaXRpYWxpc2VcIjtcbmltcG9ydCB7aW5pdGlhbGlzZUFjdGlvbnN9IGZyb20gXCIuL2FjdGlvbnNBcGkvaW5pdGlhbGlzZVwiXG5pbXBvcnQge2lzU29tZXRoaW5nfSBmcm9tIFwiLi9jb21tb25cIjtcbmltcG9ydCB7Y2xlYW51cH0gZnJvbSBcIi4vdHJhbnNhY3Rpb25zL2NsZWFudXBcIjtcbmltcG9ydCB7Z2VuZXJhdGVGdWxsUGVybWlzc2lvbnN9IGZyb20gXCIuL2F1dGhBcGkvZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnNcIjtcbmltcG9ydCB7Z2V0QXBwbGljYXRpb25EZWZpbml0aW9ufSBmcm9tIFwiLi90ZW1wbGF0ZUFwaS9nZXRBcHBsaWNhdGlvbkRlZmluaXRpb25cIjtcbmltcG9ydCBjb21tb24gZnJvbSBcIi4vY29tbW9uXCI7XG5pbXBvcnQge2dldEJlaGF2aW91clNvdXJjZXN9IGZyb20gXCIuL3RlbXBsYXRlQXBpL2dldEJlaGF2aW91clNvdXJjZXNcIjtcbmltcG9ydCBoaWVyYXJjaHkgZnJvbSBcIi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5XCI7XG5cbmV4cG9ydCBjb25zdCBnZXRBcHBBcGlzID0gYXN5bmMgKHN0b3JlLCBiZWhhdmlvdXJTb3VyY2VzID0gbnVsbCwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFudXBUcmFuc2FjdGlvbnMgPSBudWxsLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXBvY2hUaW1lID0gbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3J5cHRvID0gbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwRGVmaW5pdGlvbiA9IG51bGwpID0+IHtcblxuICAgIHN0b3JlID0gc2V0dXBEYXRhc3RvcmUoc3RvcmUpO1xuXG4gICAgaWYoIWFwcERlZmluaXRpb24pXG4gICAgICAgIGFwcERlZmluaXRpb24gPSBhd2FpdCBnZXRBcHBsaWNhdGlvbkRlZmluaXRpb24oc3RvcmUpKCk7XG5cbiAgICBpZighYmVoYXZpb3VyU291cmNlcylcbiAgICAgICAgYmVoYXZpb3VyU291cmNlcyA9IGF3YWl0IGdldEJlaGF2aW91clNvdXJjZXMoc3RvcmUpO1xuXG4gICAgY29uc3QgZXZlbnRBZ2dyZWdhdG9yID0gY3JlYXRlRXZlbnRBZ2dyZWdhdG9yKCk7XG5cbiAgICBjb25zdCBhcHAgPSB7XG4gICAgICAgIGRhdGFzdG9yZTpzdG9yZSxcbiAgICAgICAgY3J5cHRvLFxuICAgICAgICBwdWJsaXNoOmV2ZW50QWdncmVnYXRvci5wdWJsaXNoLFxuICAgICAgICBoaWVyYXJjaHk6YXBwRGVmaW5pdGlvbi5oaWVyYXJjaHksXG4gICAgICAgIGFjdGlvbnM6YXBwRGVmaW5pdGlvbi5hY3Rpb25zXG4gICAgfTtcblxuICAgIGNvbnN0IHRlbXBsYXRlQXBpID0gZ2V0VGVtcGxhdGVBcGkoYXBwKTsgICAgXG5cbiAgICBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucyA9IGlzU29tZXRoaW5nKGNsZWFudXBUcmFuc2FjdGlvbnMpIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBjbGVhbnVwVHJhbnNhY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGFzeW5jICgpID0+IGF3YWl0IGNsZWFudXAoYXBwKTtcblxuICAgIGFwcC5nZXRFcG9jaFRpbWUgPSBpc1NvbWV0aGluZyhnZXRFcG9jaFRpbWUpXG4gICAgICAgICAgICAgICAgICAgICAgID8gZ2V0RXBvY2hUaW1lXG4gICAgICAgICAgICAgICAgICAgICAgIDogYXN5bmMgKCkgPT4gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblxuICAgIGNvbnN0IHJlY29yZEFwaSA9IGdldFJlY29yZEFwaShhcHApO1xuICAgIGNvbnN0IGNvbGxlY3Rpb25BcGkgPSBnZXRDb2xsZWN0aW9uQXBpKGFwcCk7XG4gICAgY29uc3QgaW5kZXhBcGkgPSBnZXRJbmRleEFwaShhcHApO1xuICAgIGNvbnN0IGF1dGhBcGkgPSBnZXRBdXRoQXBpKGFwcCk7XG4gICAgY29uc3QgYWN0aW9uc0FwaSA9IGdldEFjdGlvbnNBcGkoYXBwKTtcblxuICAgIGNvbnN0IGF1dGhlbnRpY2F0ZUFzID0gYXN5bmMgKHVzZXJuYW1lLCBwYXNzd29yZCkgPT4ge1xuICAgICAgICBhcHAudXNlciA9IGF3YWl0IGF1dGhBcGkuYXV0aGVudGljYXRlKHVzZXJuYW1lLCBwYXNzd29yZCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHdpdGhGdWxsQWNjZXNzID0gKCkgPT4ge1xuICAgICAgICBhcHAudXNlciA9IHtcbiAgICAgICAgICAgIG5hbWU6IFwiYXBwXCIsXG4gICAgICAgICAgICBwZXJtaXNzaW9ucyA6IGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zKGFwcCksXG4gICAgICAgICAgICBpc1VzZXI6ZmFsc2UsXG4gICAgICAgICAgICB0ZW1wOmZhbHNlXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgYXNVc2VyID0gKHVzZXIpID0+IHtcbiAgICAgICAgYXBwLnVzZXIgPSB1c2VyXG4gICAgfTtcblxuICAgIFxuXG4gICAgbGV0IGFwaXMgPSB7XG4gICAgICAgIHJlY29yZEFwaSwgXG4gICAgICAgIHRlbXBsYXRlQXBpLFxuICAgICAgICBjb2xsZWN0aW9uQXBpLFxuICAgICAgICBpbmRleEFwaSxcbiAgICAgICAgYXV0aEFwaSxcbiAgICAgICAgYWN0aW9uc0FwaSxcbiAgICAgICAgc3Vic2NyaWJlOiBldmVudEFnZ3JlZ2F0b3Iuc3Vic2NyaWJlLFxuICAgICAgICBhdXRoZW50aWNhdGVBcyxcbiAgICAgICAgd2l0aEZ1bGxBY2Nlc3MsXG4gICAgICAgIGFzVXNlclxuICAgIH07XG5cbiAgICBhcGlzLmFjdGlvbnMgPSBpbml0aWFsaXNlQWN0aW9ucyhcbiAgICAgICAgZXZlbnRBZ2dyZWdhdG9yLnN1YnNjcmliZSxcbiAgICAgICAgYmVoYXZpb3VyU291cmNlcyxcbiAgICAgICAgYXBwRGVmaW5pdGlvbi5hY3Rpb25zLFxuICAgICAgICBhcHBEZWZpbml0aW9uLnRyaWdnZXJzLFxuICAgICAgICBhcGlzKTtcblxuXG4gICAgcmV0dXJuIGFwaXM7XG59O1xuXG5leHBvcnQge2V2ZW50cywgZXZlbnRzTGlzdH0gZnJvbSBcIi4vY29tbW9uL2V2ZW50c1wiO1xuZXhwb3J0IHtnZXRUZW1wbGF0ZUFwaX0gZnJvbSBcIi4vdGVtcGxhdGVBcGlcIjtcbmV4cG9ydCB7Z2V0UmVjb3JkQXBpfSBmcm9tIFwiLi9yZWNvcmRBcGlcIjtcbmV4cG9ydCB7Z2V0Q29sbGVjdGlvbkFwaX0gZnJvbSBcIi4vY29sbGVjdGlvbkFwaVwiO1xuZXhwb3J0IHtnZXRBdXRoQXBpfSBmcm9tIFwiLi9hdXRoQXBpXCI7XG5leHBvcnQge2dldEluZGV4QXBpfSBmcm9tIFwiLi9pbmRleEFwaVwiO1xuZXhwb3J0IHtzZXR1cERhdGFzdG9yZX0gZnJvbSBcIi4vYXBwSW5pdGlhbGlzZVwiO1xuZXhwb3J0IHtnZXRBY3Rpb25zQXBpfSBmcm9tIFwiLi9hY3Rpb25zQXBpXCI7XG5leHBvcnQge2luaXRpYWxpc2VEYXRhfSBmcm9tIFwiLi9hcHBJbml0aWFsaXNlL2luaXRpYWxpc2VEYXRhXCI7XG5leHBvcnQge2dldERhdGFiYXNlTWFuYWdlcn0gZnJvbSBcIi4vYXBwSW5pdGlhbGlzZS9kYXRhYmFzZU1hbmFnZXJcIjtcbmV4cG9ydCB7aGllcmFyY2h5fTtcbmV4cG9ydCB7Y29tbW9ufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0QXBwQXBpczsiXSwibmFtZXMiOlsic3BsaXQiLCJpc0FycmF5Iiwiam9pbiIsImlzVW5kZWZpbmVkIiwiaXNOYU4iLCJyZWR1Y2UiLCJjb21waWxlRXhwcmVzc2lvbiIsImNvbXBpbGVDb2RlIiwiY2xvbmVEZWVwIiwiaXNFbXB0eSIsImluY2x1ZGVzIiwiY29uc3RhbnQiLCJtYWtlcnVsZSIsIm9wdGlvbnMiLCJ0eXBlQ29uc3RyYWludHMiLCJpc051bGwiLCJoYXMiLCJpc051bWJlciIsImlzU3RyaW5nIiwiYWxsIiwiZ2V0RGVmYXVsdE9wdGlvbnMiLCJ2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyIsImlzQm9vbGVhbiIsImlzRGF0ZSIsImtleXMiLCJnbG9iYWwiLCJiYXNlNjQuZnJvbUJ5dGVBcnJheSIsImllZWU3NTQucmVhZCIsImllZWU3NTQud3JpdGUiLCJiYXNlNjQudG9CeXRlQXJyYXkiLCJyZWFkIiwiQnVmZmVyIiwicmVhZEluZGV4IiwibWVyZ2UiLCJzb21lIiwiZGVsZXRlUmVjb3JkIiwidmFsaWRhdGUiLCJmaW5kIiwiZWFjaCIsImRlZmF1bHRDYXNlIiwiYXBpIiwiY3JlYXRlVGVtcG9yYXJ5QWNjZXNzIiwiY3JlYXRlVXNlciIsInNldFVzZXJBY2Nlc3NMZXZlbHMiLCJleGVjdXRlQWN0aW9uIiwiY0NvZGUiLCJjRXhwIiwiaXNGdW5jdGlvbiIsIm9yZGVyQnkiLCJ1bmlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBLE1BQU0sVUFBVSxHQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRS9FLE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLEVBQUUsQ0FBQyxD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LEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFDOzs7RUFHdEUsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksRUFBQzs7O0VBR3pDLENBQUMsR0FBRyxZQUFZLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBRzs7RUFFcEMsSUFBSSxDQUFDLEdBQUcsRUFBQzs7RUFFVCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUN4QyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUM7SUFDbEssR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLEtBQUk7SUFDN0IsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEtBQUk7SUFDNUIsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUk7R0FDdEI7O0VBRUQsSUFBSSxZQUFZLEtBQUssQ0FBQyxFQUFFO0lBQ3RCLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FB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TSxJQUFJLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFDO0lBQ25DLE1BQU0sSUFBSSxLQUFJO0dBQ2YsTUFBTSxJQUFJLFVBQVUsS0FBSyxDQUFDLEVBQUU7SUFDM0IsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBQztJQUM5QyxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUM7SUFDM0IsTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFDO0lBQ25DLE1BQU0sSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksRUFBQztJQUNuQyxNQUFNLElBQUksSUFBRztHQUNkOztFQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFDOztFQUVsQixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0NBQ3RCOztBQzVHTSxTQUFTLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0VBQ3hELElBQUksQ0FBQyxFQUFFLEVBQUM7RUFDUixJQUFJLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxFQUFDO0VBQ2hDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFDO0VBQzFCLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxFQUFDO0VBQ3JCLElBQUksS0FBSyxHQUFHLENBQUMsRUFBQztFQUNkLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUM7RUFDL0IsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUM7RUFDckIsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0s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Q0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7RUFDbEQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDOUM7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7RUFDbEQsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7RUFDOUM7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7O0VBRWxELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7T0FDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7RUFDbkM7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FB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VyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7RUFDckUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDOztFQUVsRCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7S0FDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztFQUNyQjs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxTQUFTLFdBQVcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQ3JFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztFQUNsRCxPQUFPQyxJQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztFQUMvQzs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxTQUFTLFdBQVcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQ3JFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztFQUNsRCxPQUFPQSxJQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztFQUNoRDs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxTQUFTLFlBQVksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQ3ZFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztFQUNs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QyxDQUFDO01BQ25FLENBQUMsWUFBWSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUM7R0FDakM7Q0FDRjs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxTQUFTLGFBQWEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUNoRixLQUFLLEdBQUcsQ0FBQyxNQUFLO0VBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0VBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO0VBQzFELElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO0lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxFQUFDO0lBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBQztHQUNqQyxNQUFNO0lBQ0wsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO0dBQzdDO0VBQ0QsT0FBTyxNQUFNLEdBQUcsQ0FBQztFQUNsQjs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxTQUFTLGFBQWEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUNoRixLQUFLLEdBQUcsQ0FBQyxNQUFLO0VBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0VBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO0VBQzFELElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO0lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFDO0lBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcs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
