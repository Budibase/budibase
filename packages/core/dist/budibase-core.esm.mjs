import { union, reduce, isUndefined, cloneDeep, split, toNumber, isArray as isArray$1, join as join$1, isNull, isNaN as isNaN$1, isEmpty, constant, some, includes, isInteger, isDate, isString, map, filter, keys, isFunction, countBy, last, find, take, first, intersection, mapValues, has, isBoolean, isNumber, isObjectLike, isObject, clone, values, keyBy, orderBy, concat, reverse, difference, merge as merge$1, flatten, each, pull, max, defaultCase as defaultCase$1, uniqBy, every, uniqWith, groupBy, differenceBy, intersectionBy, isEqual } from 'lodash/fp';
import { generate } from 'shortid';
import _, { flow, replace, trim, dropRight, head, takeRight, tail, startsWith, findIndex, merge, assign, each as each$1, find as find$1, join as join$2, orderBy as orderBy$1, union as union$1 } from 'lodash';
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
const splitByKeySep = str => split(keySep)(str);
const safeKey = key => replace(`${keySep}${trimKeySep(key)}`, `${keySep}${keySep}`, keySep);
const joinKey = (...strs) => {
  const paramsOrArray = strs.length === 1 & isArray$1(strs[0])
    ? strs[0] : strs;
  return safeKey(join$1(keySep)(paramsOrArray));
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

const ifExists = (val, exists, notExists) => (isUndefined(val)
  ? isUndefined(notExists) ? (() => { })() : notExists()
  : exists());

const getOrDefault = (val, defaultVal) => ifExists(val, () => val, () => defaultVal);

const not = func => val => !func(val);
const isDefined = not(isUndefined);
const isNonNull = not(isNull);
const isNotNaN = not(isNaN$1);

const allTrue = (...funcArgs) => val => reduce(
  (result, conditionFunc) => (isNull(result) || result == true) && conditionFunc(val),
  null)(funcArgs);

const anyTrue = (...funcArgs) => val => reduce(
  (result, conditionFunc) => result == true || conditionFunc(val),
  null)(funcArgs);

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
const isOneOf = (...vals) => val => includes(val)(vals);
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
  const recordClone = cloneDeep(record);
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
    mapped[key] = isUndefined(mapped[key]) ? null : mapped[key];
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
    index => isEmpty(index.name)
                || countBy('name')(index.parent().indexes)[index.name] === 1),
  makerule('indexType', 'reference index may only exist on a record node',
    index => isRecord(index.parent())
                  || index.indexType !== indexTypes.reference),
  makerule('indexType', `index type must be one of: ${join$1(', ')(keys(indexTypes))}`,
    index => includes(index.indexType)(keys(indexTypes))),
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
    constant(false)],

  [node => ancestorPredicate(node.parent()),
    constant(true)],

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
    || includes(nodeId)(indexNode.allowedRecordNodeIds);

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
  if (has(field.name)(record)) {
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

  return has(getInitialValue)(defaultValueFunctions)
    ? defaultValueFunctions[getInitialValue]()
    : getSafeValueParser(tryParse, defaultValueFunctions)(getInitialValue);
};

const typeFunctions = specificFunctions => merge({
  value: constant,
  null: constant(null),
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
                           || includes(val)(opts.values),
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

const hasStringValue = (ob, path) => has(path)(ob)
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
  [isNull, () => parsedSuccess(fileNothing())],
  [defaultCase, parsedFailed],
)(v);

const fileName = filePath => $(filePath, [
  splitKey,
  last,
]);

const isValidFile = f => !isNull(f)
    && has('relativePath')(f) && has('size')(f)
    && isNumber(f.size)
    && isString(f.relativePath)
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
  if (!has(typeName)(all$1)) throw new BadRequestError(`Do not recognise type ${typeName}`);
  return all$1[typeName];
};

const getSampleFieldValue = field => getType(field.type).sampleValue;

const getNewFieldValue = field => getType(field.type).getNew(field);

const safeParseField = (field, record) => getType(field.type).safeParseField(field, record);

const validateFieldParse = (field, record) => (has(field.name)(record)
  ? getType(field.type).tryParse(record[field.name])
  : parsedSuccess(undefined)); // fields may be undefined by default

const getDefaultOptions$1 = type => getType(type).getDefaultOptions();

const validateTypeConstraints$1 = async (field, record, context) => await getType(field.type).validateTypeConstraints(field, record, context);

const detectType = (value) => {
  if (isString(value)) return string;
  if (isBoolean(value)) return bool;
  if (isNumber(value)) return number;
  if (isDate(value)) return datetime;
  if (isArray$1(value)) return array(detectType(value[0]));
  if (isObject(value)
       && has('key')(value)
       && has('value')(value)) return reference;
  if (isObject(value)
        && has('relativePath')(value)
        && has('size')(value)) return file;

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
    includes(permissionType),
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
    keyBy('name'),
    mapValues(getFieldValue),
  ]);

  record.id = `${recordNode.nodeId}-${generate()}`;
  record.key = isSingleRecord(recordNode)
               ? joinKey(collectionKey, recordNode.name)
               : joinKey(collectionKey, record.id);
  record.isNew = true;
  record.type = recordNode.name;
  return record;
};

const getRecordFileName = key => joinKey(key, 'record.json');

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
                    && !includes(loadedRecord[f.name].key)(newKeyStack)),
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
  if (!includes(shardName)(map)) {
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

  const fieldsHas = has(schema);
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
    keys,
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

        if(isString(text) && currentBuffer === null)
            currentBuffer = Buffer$1.from(text, "utf8");
        else if(isString(text))
            currentBuffer = Buffer$1.concat([
                currentBuffer,
                Buffer$1.from(text, "utf8")
            ]);
        
        if(currentBuffer !== null &&
            (currentBuffer.length > flushBoundary
             || !isString(text))) {

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
        const value = has(prop.name)(item)
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
  const recordNode = getExactNodeForPath(app.hierarchy)(recordKey);

  const cachedReferenceIndexes = {};

  const lazyLoadReferenceIndex = async (typeOptions) => {
    if (!has(typeOptions.indexNodeKey)(cachedReferenceIndexes)) {
      cachedReferenceIndexes[typeOptions.indexNodeKey] = {
        typeOptions,
        data: await readReferenceIndex(
          app, recordKey, typeOptions,
        ),
      };
    }

    return cachedReferenceIndexes[typeOptions.indexNodeKey];
  };

  const getTypeOptions = typeOptions_or_fieldName => (isString(typeOptions_or_fieldName)
    ? findField(recordNode, typeOptions_or_fieldName)
      .typeOptions
    : typeOptions_or_fieldName);

  return {
    referenceExists: async (typeOptions_or_fieldName, key) => {
      const typeOptions = getTypeOptions(typeOptions_or_fieldName);
      const { data } = await lazyLoadReferenceIndex(typeOptions);
      return some(i => i.key === key)(data);
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
  if (!isEmpty(fieldParseFails)) { return ({ isValid: false, errors: fieldParseFails }); }

  const recordValidationRuleFails = runRecordValidationRules(record, recordNode);
  const typeContraintFails = await validateAllTypeConstraints(record, recordNode, context);

  if (isEmpty(fieldParseFails)
       && isEmpty(recordValidationRuleFails)
       && isEmpty(typeContraintFails)) {
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
    join$1(','),
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
    const recordNode = getExactNodeForPath(app.hierarchy)(record.key);
    if(!recordNode)
      throw new Error("Cannot find node for " + record.key);

    if(!isSingleRecord(recordNode))
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

    if (includes(shardKey)(deletedAllIdsShards)) {
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
  indexKey = safeKey(indexKey);
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

  if (includes('..')(pathParts)) naughtyUser();

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

const recordNodeApplies = indexNode => recordNode => includes(recordNode.nodeId)(indexNode.allowedRecordNodeIds);

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

    if (!isNumber(value)) return existing;

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
    if (!has(aggGroup.name)(result)) {
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

    if (!has(group)(thisGroupResult)) {
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

const allowedTypes = () => keys(all$1);

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
    keys,
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
  const everySingleField = includes(field)(allFields) ? allFields : [...allFields, field];
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
  [isNumber, v => v.toString()],
  [isBoolean, v => v.toString()],
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

const ruleSet = (...sets) => constant(flatten([...sets]));

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
    node => every(r => has('messageWhenInvalid')(r))(node.validationRules)),
  makerule('validationRules', "validation rule is missing a 'expressionWhenValid' member",
    node => every(r => has('expressionWhenValid')(r))(node.validationRules)),
];


const aggregateGroupRules = [
  makerule('condition', 'condition does not compile',
    a => isEmpty(a.condition)
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
             || includes(t.eventName)(eventsList)),
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
    throw new Error(`Hierarchy is invalid: ${join$2(
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
      throw new BadRequestError(`Actions are invalid: ${join$2(actionValidErrs, ', ')}`);
    }

    const triggerValidErrs = map(e => e.error)(validateTriggers(triggers, actions));

    if (triggerValidErrs.length > 0) {
      throw new BadRequestError(`Triggers are invalid: ${join$2(triggerValidErrs, ', ')}`);
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
  if (userErrors.length > 0) { throw new BadRequestError(`User is invalid. ${join$1('; ')(userErrors)}`); }

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
  includes(t),
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
    l => isEmpty(l.name)
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
      join$1(', '),
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

  for (const a of keys(app.actions)) {
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
    throw new Error(`Invalid access levels supplied: ${join$1(', ', missing)}`);
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
  if (!has(eventName)(handlers)) return;

  for (const handler of handlers[eventName]) {
    await handler(eventName, context);
  }
};

const subscribe = handlers => (eventName, handler) => {
  if (!has(eventName)(handlers)) {
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

  const suppliedSources = keys(behaviourSources);

  const missingSources = difference(
    declaredSources, suppliedSources,
  );

  if (missingSources.length > 0) {
    throw new BadRequestError(`Declared behaviour sources are not supplied: ${join$1(', ', missingSources)}`);
  }

  const missingBehaviours = $(actions, [
    filter(a => !isFunction(behaviourSources[a.behaviourSource][a.behaviourName])),
    map(a => `Action: ${a.name} : ${a.behaviourSource}.${a.behaviourName}`),
  ]);

  if (missingBehaviours.length > 0) {
    throw new NotFoundError(`Missing behaviours: could not find behaviour functions: ${join$1(', ', missingBehaviours)}`);
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
                         || includes(nodeId)(i.allowedRecordNodeIds))),
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

  for (const shard of keys(recordsByShard)) {
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

          if (!includes(indexKey)(indexKeys)) { indexKeys.push(indexKey); }
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
    filter(isGlobalIndex),
  ]);

  for (const index of globalIndexes) {
    if (!await datastore.exists(index.nodeKey())) { await initialiseIndex(datastore, '', index); }
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
    filter(isSingleRecord),
  ]);

  for (let record of singleRecords) {
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

export default getAppApis;
export { index as common, events, eventsList, getActionsApi, getAppApis, getAuthApi, getCollectionApi, getDatabaseManager, getIndexApi, getRecordApi, getTemplateApi, hierarchy, initialiseData, setupDatastore, userWithFullAccess };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVkaWJhc2UtY29yZS5lc20ubWpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tbW9uL2V2ZW50cy5qcyIsIi4uL3NyYy9jb21tb24vZXJyb3JzLmpzIiwiLi4vc3JjL2NvbW1vbi9hcGlXcmFwcGVyLmpzIiwiLi4vc3JjL2NvbW1vbi9sb2NrLmpzIiwiLi4vc3JjL2NvbW1vbi9pbmRleC5qcyIsIi4uL3NyYy9jb21tb24vdmFsaWRhdGlvbkNvbW1vbi5qcyIsIi4uL3NyYy9pbmRleGluZy9ldmFsdWF0ZS5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9pbmRleGVzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2hpZXJhcmNoeS5qcyIsIi4uL3NyYy90eXBlcy90eXBlSGVscGVycy5qcyIsIi4uL3NyYy90eXBlcy9zdHJpbmcuanMiLCIuLi9zcmMvdHlwZXMvYm9vbC5qcyIsIi4uL3NyYy90eXBlcy9udW1iZXIuanMiLCIuLi9zcmMvdHlwZXMvZGF0ZXRpbWUuanMiLCIuLi9zcmMvdHlwZXMvYXJyYXkuanMiLCIuLi9zcmMvdHlwZXMvcmVmZXJlbmNlLmpzIiwiLi4vc3JjL3R5cGVzL2ZpbGUuanMiLCIuLi9zcmMvdHlwZXMvaW5kZXguanMiLCIuLi9zcmMvYXV0aEFwaS9hdXRoQ29tbW9uLmpzIiwiLi4vc3JjL2F1dGhBcGkvaXNBdXRob3JpemVkLmpzIiwiLi4vc3JjL2F1dGhBcGkvcGVybWlzc2lvbnMuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2dldE5ldy5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvbG9hZC5qcyIsIi4uL3NyYy9pbmRleGluZy9wcm9taXNlUmVhZGFibGVTdHJlYW0uanMiLCIuLi9zcmMvaW5kZXhpbmcvc2hhcmRpbmcuanMiLCIuLi9zcmMvaW5kZXhpbmcvaW5kZXhTY2hlbWFDcmVhdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JvbGx1cC1wbHVnaW4tbm9kZS1nbG9iYWxzL3NyYy9nbG9iYWwuanMiLCIuLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVzNi9iYXNlNjQuanMiLCIuLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVzNi9pZWVlNzU0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2J1ZmZlci1lczYvaXNBcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9idWZmZXItZXM2L2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JvbGx1cC1wbHVnaW4tbm9kZS1idWlsdGlucy9zcmMvZXM2L3N0cmluZy1kZWNvZGVyLmpzIiwiLi4vc3JjL2luZGV4aW5nL3NlcmlhbGl6ZXIuanMiLCIuLi9zcmMvaW5kZXhpbmcvcmVhZC5qcyIsIi4uL3NyYy9pbmRleEFwaS9saXN0SXRlbXMuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2dldENvbnRleHQuanMiLCIuLi9zcmMvcmVjb3JkQXBpL3ZhbGlkYXRlLmpzIiwiLi4vc3JjL2NvbGxlY3Rpb25BcGkvaW5pdGlhbGlzZS5qcyIsIi4uL3NyYy9pbmRleGluZy9hbGxJZHMuanMiLCIuLi9zcmMvdHJhbnNhY3Rpb25zL3RyYW5zYWN0aW9uc0NvbW1vbi5qcyIsIi4uL3NyYy90cmFuc2FjdGlvbnMvY3JlYXRlLmpzIiwiLi4vc3JjL2luZGV4aW5nL2luaXRpYWxpc2VJbmRleC5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvc2F2ZS5qcyIsIi4uL3NyYy9jb2xsZWN0aW9uQXBpL2RlbGV0ZS5qcyIsIi4uL3NyYy9pbmRleEFwaS9kZWxldGUuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2RlbGV0ZS5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvdXBsb2FkRmlsZS5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZG93bmxvYWRGaWxlLmpzIiwiLi4vc3JjL3JlY29yZEFwaS9jdXN0b21JZC5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvaW5kZXguanMiLCIuLi9zcmMvY29sbGVjdGlvbkFwaS9nZXRBbGxvd2VkUmVjb3JkVHlwZXMuanMiLCIuLi9zcmMvY29sbGVjdGlvbkFwaS9pbmRleC5qcyIsIi4uL3NyYy9pbmRleEFwaS9idWlsZEluZGV4LmpzIiwiLi4vc3JjL2luZGV4QXBpL2FnZ3JlZ2F0ZXMuanMiLCIuLi9zcmMvaW5kZXhBcGkvaW5kZXguanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvY3JlYXRlTm9kZXMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvZmllbGRzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL3JlY29yZFZhbGlkYXRpb25SdWxlcy5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9jcmVhdGVBY3Rpb25zLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL3ZhbGlkYXRlQWdncmVnYXRlLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL3ZhbGlkYXRlLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2dldEFwcGxpY2F0aW9uRGVmaW5pdGlvbi5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9zYXZlQXBwbGljYXRpb25IaWVyYXJjaHkuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvc2F2ZUFjdGlvbnNBbmRUcmlnZ2Vycy5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9nZXRCZWhhdmlvdXJTb3VyY2VzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2luZGV4LmpzIiwiLi4vc3JjL2F1dGhBcGkvZ2V0VXNlcnMuanMiLCIuLi9zcmMvYXV0aEFwaS9sb2FkQWNjZXNzTGV2ZWxzLmpzIiwiLi4vc3JjL2F1dGhBcGkvYXV0aGVudGljYXRlLmpzIiwiLi4vc3JjL2F1dGhBcGkvY3JlYXRlVGVtcG9yYXJ5QWNjZXNzLmpzIiwiLi4vc3JjL2F1dGhBcGkvdmFsaWRhdGVVc2VyLmpzIiwiLi4vc3JjL2F1dGhBcGkvZ2V0TmV3VXNlci5qcyIsIi4uL3NyYy9hdXRoQXBpL3NldFBhc3N3b3JkLmpzIiwiLi4vc3JjL2F1dGhBcGkvY3JlYXRlVXNlci5qcyIsIi4uL3NyYy9hdXRoQXBpL2VuYWJsZVVzZXIuanMiLCIuLi9zcmMvYXV0aEFwaS9nZXROZXdBY2Nlc3NMZXZlbC5qcyIsIi4uL3NyYy9hdXRoQXBpL3ZhbGlkYXRlQWNjZXNzTGV2ZWxzLmpzIiwiLi4vc3JjL2F1dGhBcGkvc2F2ZUFjY2Vzc0xldmVscy5qcyIsIi4uL3NyYy9hdXRoQXBpL2dlbmVyYXRlRnVsbFBlcm1pc3Npb25zLmpzIiwiLi4vc3JjL2F1dGhBcGkvc2V0VXNlckFjY2Vzc0xldmVscy5qcyIsIi4uL3NyYy9hdXRoQXBpL2luZGV4LmpzIiwiLi4vc3JjL2FjdGlvbnNBcGkvZXhlY3V0ZS5qcyIsIi4uL3NyYy9hY3Rpb25zQXBpL2luZGV4LmpzIiwiLi4vc3JjL2FwcEluaXRpYWxpc2UvZXZlbnRBZ2dyZWdhdG9yLmpzIiwiLi4vc3JjL2FwcEluaXRpYWxpc2UvaW5kZXguanMiLCIuLi9zcmMvY29tbW9uL2NvbXBpbGVDb2RlLmpzIiwiLi4vc3JjL2FjdGlvbnNBcGkvaW5pdGlhbGlzZS5qcyIsIi4uL3NyYy90cmFuc2FjdGlvbnMvcmV0cmlldmUuanMiLCIuLi9zcmMvaW5kZXhpbmcvcmVsZXZhbnQuanMiLCIuLi9zcmMvaW5kZXhpbmcvcHJvbWlzZVdyaXRhYmxlU3RyZWFtLmpzIiwiLi4vc3JjL2luZGV4aW5nL2FwcGx5LmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9leGVjdXRlLmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9jbGVhbnVwLmpzIiwiLi4vc3JjL2FwcEluaXRpYWxpc2UvaW5pdGlhbGlzZURhdGEuanMiLCIuLi9zcmMvYXBwSW5pdGlhbGlzZS9kYXRhYmFzZU1hbmFnZXIuanMiLCIuLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdW5pb24sIHJlZHVjZSB9IGZyb20gJ2xvZGFzaC9mcCc7XG5cbmNvbnN0IGNvbW1vblBsdXMgPSBleHRyYSA9PiB1bmlvbihbJ29uQmVnaW4nLCAnb25Db21wbGV0ZScsICdvbkVycm9yJ10pKGV4dHJhKTtcblxuY29uc3QgY29tbW9uID0gKCkgPT4gY29tbW9uUGx1cyhbXSk7XG5cbmNvbnN0IF9ldmVudHMgPSB7XG4gIHJlY29yZEFwaToge1xuICAgIHNhdmU6IGNvbW1vblBsdXMoW1xuICAgICAgJ29uSW52YWxpZCcsXG4gICAgICAnb25SZWNvcmRVcGRhdGVkJyxcbiAgICAgICdvblJlY29yZENyZWF0ZWQnXSksXG4gICAgZGVsZXRlOiBjb21tb24oKSxcbiAgICBnZXRDb250ZXh0OiBjb21tb24oKSxcbiAgICBnZXROZXc6IGNvbW1vbigpLFxuICAgIGxvYWQ6IGNvbW1vbigpLFxuICAgIHZhbGlkYXRlOiBjb21tb24oKSxcbiAgICB1cGxvYWRGaWxlOiBjb21tb24oKSxcbiAgICBkb3dubG9hZEZpbGU6IGNvbW1vbigpLFxuICB9LFxuICBpbmRleEFwaToge1xuICAgIGJ1aWxkSW5kZXg6IGNvbW1vbigpLFxuICAgIGxpc3RJdGVtczogY29tbW9uKCksXG4gICAgZGVsZXRlOiBjb21tb24oKSxcbiAgICBhZ2dyZWdhdGVzOiBjb21tb24oKSxcbiAgfSxcbiAgY29sbGVjdGlvbkFwaToge1xuICAgIGdldEFsbG93ZWRSZWNvcmRUeXBlczogY29tbW9uKCksXG4gICAgaW5pdGlhbGlzZTogY29tbW9uKCksXG4gICAgZGVsZXRlOiBjb21tb24oKSxcbiAgfSxcbiAgYXV0aEFwaToge1xuICAgIGF1dGhlbnRpY2F0ZTogY29tbW9uKCksXG4gICAgYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzOiBjb21tb24oKSxcbiAgICBjcmVhdGVUZW1wb3JhcnlBY2Nlc3M6IGNvbW1vbigpLFxuICAgIGNyZWF0ZVVzZXI6IGNvbW1vbigpLFxuICAgIGVuYWJsZVVzZXI6IGNvbW1vbigpLFxuICAgIGRpc2FibGVVc2VyOiBjb21tb24oKSxcbiAgICBsb2FkQWNjZXNzTGV2ZWxzOiBjb21tb24oKSxcbiAgICBnZXROZXdBY2Nlc3NMZXZlbDogY29tbW9uKCksXG4gICAgZ2V0TmV3VXNlcjogY29tbW9uKCksXG4gICAgZ2V0TmV3VXNlckF1dGg6IGNvbW1vbigpLFxuICAgIGdldFVzZXJzOiBjb21tb24oKSxcbiAgICBzYXZlQWNjZXNzTGV2ZWxzOiBjb21tb24oKSxcbiAgICBpc0F1dGhvcml6ZWQ6IGNvbW1vbigpLFxuICAgIGNoYW5nZU15UGFzc3dvcmQ6IGNvbW1vbigpLFxuICAgIHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGU6IGNvbW1vbigpLFxuICAgIHNjb3JlUGFzc3dvcmQ6IGNvbW1vbigpLFxuICAgIGlzVmFsaWRQYXNzd29yZDogY29tbW9uKCksXG4gICAgdmFsaWRhdGVVc2VyOiBjb21tb24oKSxcbiAgICB2YWxpZGF0ZUFjY2Vzc0xldmVsczogY29tbW9uKCksXG4gICAgc2V0VXNlckFjY2Vzc0xldmVsczogY29tbW9uKCksXG4gIH0sXG4gIHRlbXBsYXRlQXBpOiB7XG4gICAgc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5OiBjb21tb24oKSxcbiAgICBzYXZlQWN0aW9uc0FuZFRyaWdnZXJzOiBjb21tb24oKSxcbiAgfSxcbiAgYWN0aW9uc0FwaToge1xuICAgIGV4ZWN1dGU6IGNvbW1vbigpLFxuICB9LFxufTtcblxuY29uc3QgX2V2ZW50c0xpc3QgPSBbXTtcblxuY29uc3QgbWFrZUV2ZW50ID0gKGFyZWEsIG1ldGhvZCwgbmFtZSkgPT4gYCR7YXJlYX06JHttZXRob2R9OiR7bmFtZX1gO1xuXG5mb3IgKGNvbnN0IGFyZWFLZXkgaW4gX2V2ZW50cykge1xuICBmb3IgKGNvbnN0IG1ldGhvZEtleSBpbiBfZXZlbnRzW2FyZWFLZXldKSB7XG4gICAgX2V2ZW50c1thcmVhS2V5XVttZXRob2RLZXldID0gcmVkdWNlKChvYmosIHMpID0+IHtcbiAgICAgIG9ialtzXSA9IG1ha2VFdmVudChhcmVhS2V5LCBtZXRob2RLZXksIHMpO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9LFxuICAgIHt9KShfZXZlbnRzW2FyZWFLZXldW21ldGhvZEtleV0pO1xuICB9XG59XG5cblxuZm9yIChjb25zdCBhcmVhS2V5IGluIF9ldmVudHMpIHtcbiAgZm9yIChjb25zdCBtZXRob2RLZXkgaW4gX2V2ZW50c1thcmVhS2V5XSkge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBfZXZlbnRzW2FyZWFLZXldW21ldGhvZEtleV0pIHtcbiAgICAgIF9ldmVudHNMaXN0LnB1c2goXG4gICAgICAgIF9ldmVudHNbYXJlYUtleV1bbWV0aG9kS2V5XVtuYW1lXSxcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cblxuZXhwb3J0IGNvbnN0IGV2ZW50cyA9IF9ldmVudHM7XG5cbmV4cG9ydCBjb25zdCBldmVudHNMaXN0ID0gX2V2ZW50c0xpc3Q7XG5cbmV4cG9ydCBkZWZhdWx0IHsgZXZlbnRzOiBfZXZlbnRzLCBldmVudHNMaXN0OiBfZXZlbnRzTGlzdCB9O1xuIiwiZXhwb3J0IGNsYXNzIEJhZFJlcXVlc3RFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmh0dHBTdGF0dXNDb2RlID0gNDAwO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuYXV0aG9yaXNlZEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDE7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRm9yYmlkZGVuRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDQwMztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOb3RGb3VuZEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDQ7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29uZmxpY3RFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmh0dHBTdGF0dXNDb2RlID0gNDA5O1xuICAgIH1cbn0iLCJpbXBvcnQgeyBjbG9uZURlZXAsIGlzVW5kZWZpbmVkIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnc2hvcnRpZCc7XG5pbXBvcnQgeyBVbmF1dGhvcmlzZWRFcnJvciB9IGZyb20gJy4vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGFwaVdyYXBwZXIgPSBhc3luYyAoYXBwLCBldmVudE5hbWVzcGFjZSwgaXNBdXRob3JpemVkLCBldmVudENvbnRleHQsIGZ1bmMsIC4uLnBhcmFtcykgPT4ge1xuICBwdXNoQ2FsbFN0YWNrKGFwcCwgZXZlbnROYW1lc3BhY2UpO1xuXG4gIGlmICghaXNBdXRob3JpemVkKGFwcCkpIHtcbiAgICBoYW5kbGVOb3RBdXRob3JpemVkKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgc3RhcnREYXRlID0gRGF0ZS5ub3coKTtcbiAgY29uc3QgZWxhcHNlZCA9ICgpID0+IChEYXRlLm5vdygpIC0gc3RhcnREYXRlKTtcblxuICB0cnkge1xuICAgIGF3YWl0IGFwcC5wdWJsaXNoKFxuICAgICAgZXZlbnROYW1lc3BhY2Uub25CZWdpbixcbiAgICAgIGV2ZW50Q29udGV4dCxcbiAgICApO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZnVuYyguLi5wYXJhbXMpO1xuXG4gICAgYXdhaXQgcHVibGlzaENvbXBsZXRlKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGF3YWl0IHB1Ymxpc2hFcnJvcihhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIGVycm9yKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGFwaVdyYXBwZXJTeW5jID0gKGFwcCwgZXZlbnROYW1lc3BhY2UsIGlzQXV0aG9yaXplZCwgZXZlbnRDb250ZXh0LCBmdW5jLCAuLi5wYXJhbXMpID0+IHtcbiAgcHVzaENhbGxTdGFjayhhcHAsIGV2ZW50TmFtZXNwYWNlKTtcblxuICBpZiAoIWlzQXV0aG9yaXplZChhcHApKSB7XG4gICAgaGFuZGxlTm90QXV0aG9yaXplZChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHN0YXJ0RGF0ZSA9IERhdGUubm93KCk7XG4gIGNvbnN0IGVsYXBzZWQgPSAoKSA9PiAoRGF0ZS5ub3coKSAtIHN0YXJ0RGF0ZSk7XG5cbiAgdHJ5IHtcbiAgICBhcHAucHVibGlzaChcbiAgICAgIGV2ZW50TmFtZXNwYWNlLm9uQmVnaW4sXG4gICAgICBldmVudENvbnRleHQsXG4gICAgKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGZ1bmMoLi4ucGFyYW1zKTtcblxuICAgIHB1Ymxpc2hDb21wbGV0ZShhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBwdWJsaXNoRXJyb3IoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCBlcnJvcik7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cbmNvbnN0IGhhbmRsZU5vdEF1dGhvcml6ZWQgPSAoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlKSA9PiB7XG4gIGNvbnN0IGVyciA9IG5ldyBVbmF1dGhvcmlzZWRFcnJvcihgVW5hdXRob3JpemVkOiAke2V2ZW50TmFtZXNwYWNlfWApO1xuICBwdWJsaXNoRXJyb3IoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCAoKSA9PiAwLCBlcnIpO1xuICB0aHJvdyBlcnI7XG59O1xuXG5jb25zdCBwdXNoQ2FsbFN0YWNrID0gKGFwcCwgZXZlbnROYW1lc3BhY2UsIHNlZWRDYWxsSWQpID0+IHtcbiAgY29uc3QgY2FsbElkID0gZ2VuZXJhdGUoKTtcblxuICBjb25zdCBjcmVhdGVDYWxsU3RhY2sgPSAoKSA9PiAoe1xuICAgIHNlZWRDYWxsSWQ6ICFpc1VuZGVmaW5lZChzZWVkQ2FsbElkKVxuICAgICAgPyBzZWVkQ2FsbElkXG4gICAgICA6IGNhbGxJZCxcbiAgICB0aHJlYWRDYWxsSWQ6IGNhbGxJZCxcbiAgICBzdGFjazogW10sXG4gIH0pO1xuXG4gIGlmIChpc1VuZGVmaW5lZChhcHAuY2FsbHMpKSB7XG4gICAgYXBwLmNhbGxzID0gY3JlYXRlQ2FsbFN0YWNrKCk7XG4gIH1cblxuICBhcHAuY2FsbHMuc3RhY2sucHVzaCh7XG4gICAgbmFtZXNwYWNlOiBldmVudE5hbWVzcGFjZSxcbiAgICBjYWxsSWQsXG4gIH0pO1xufTtcblxuY29uc3QgcG9wQ2FsbFN0YWNrID0gKGFwcCkgPT4ge1xuICBhcHAuY2FsbHMuc3RhY2sucG9wKCk7XG4gIGlmIChhcHAuY2FsbHMuc3RhY2subGVuZ3RoID09PSAwKSB7XG4gICAgZGVsZXRlIGFwcC5jYWxscztcbiAgfVxufTtcblxuY29uc3QgcHVibGlzaEVycm9yID0gYXN5bmMgKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgZXJyKSA9PiB7XG4gIGNvbnN0IGN0eCA9IGNsb25lRGVlcChldmVudENvbnRleHQpO1xuICBjdHguZXJyb3IgPSBlcnI7XG4gIGN0eC5lbGFwc2VkID0gZWxhcHNlZCgpO1xuICBhd2FpdCBhcHAucHVibGlzaChcbiAgICBldmVudE5hbWVzcGFjZS5vbkVycm9yLFxuICAgIGN0eCxcbiAgKTtcbiAgcG9wQ2FsbFN0YWNrKGFwcCk7XG59O1xuXG5jb25zdCBwdWJsaXNoQ29tcGxldGUgPSBhc3luYyAoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCByZXN1bHQpID0+IHtcbiAgY29uc3QgZW5kY29udGV4dCA9IGNsb25lRGVlcChldmVudENvbnRleHQpO1xuICBlbmRjb250ZXh0LnJlc3VsdCA9IHJlc3VsdDtcbiAgZW5kY29udGV4dC5lbGFwc2VkID0gZWxhcHNlZCgpO1xuICBhd2FpdCBhcHAucHVibGlzaChcbiAgICBldmVudE5hbWVzcGFjZS5vbkNvbXBsZXRlLFxuICAgIGVuZGNvbnRleHQsXG4gICk7XG4gIHBvcENhbGxTdGFjayhhcHApO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYXBpV3JhcHBlcjtcbiIsImltcG9ydCB7IHNwbGl0IH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7ICQgfSBmcm9tICcuL2luZGV4JztcblxuY29uc3QgbG9ja092ZXJsYXBNaWxsaXNlY29uZHMgPSAxMDtcblxuZXhwb3J0IGNvbnN0IGdldExvY2sgPSBhc3luYyAoYXBwLCBsb2NrRmlsZSwgdGltZW91dE1pbGxpc2Vjb25kcywgbWF4TG9ja1JldHJpZXMsIHJldHJ5Q291bnQgPSAwKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgdGltZW91dCA9IChhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCkpXG4gICAgICAgICAgICArIHRpbWVvdXRNaWxsaXNlY29uZHM7XG5cbiAgICBjb25zdCBsb2NrID0ge1xuICAgICAgdGltZW91dCxcbiAgICAgIGtleTogbG9ja0ZpbGUsXG4gICAgICB0b3RhbFRpbWVvdXQ6IHRpbWVvdXRNaWxsaXNlY29uZHMsXG4gICAgfTtcblxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlRmlsZShcbiAgICAgIGxvY2tGaWxlLFxuICAgICAgZ2V0TG9ja0ZpbGVDb250ZW50KFxuICAgICAgICBsb2NrLnRvdGFsVGltZW91dCxcbiAgICAgICAgbG9jay50aW1lb3V0LFxuICAgICAgKSxcbiAgICApO1xuXG4gICAgcmV0dXJuIGxvY2s7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAocmV0cnlDb3VudCA9PSBtYXhMb2NrUmV0cmllcykgeyByZXR1cm4gTk9fTE9DSzsgfVxuXG4gICAgY29uc3QgbG9jayA9IHBhcnNlTG9ja0ZpbGVDb250ZW50KFxuICAgICAgbG9ja0ZpbGUsXG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRGaWxlKGxvY2tGaWxlKSxcbiAgICApO1xuXG4gICAgY29uc3QgY3VycmVudEVwb2NoVGltZSA9IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKTtcblxuICAgIGlmIChjdXJyZW50RXBvY2hUaW1lIDwgbG9jay50aW1lb3V0KSB7XG4gICAgICByZXR1cm4gTk9fTE9DSztcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKGxvY2tGaWxlKTtcbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICAvL2VtcHR5XG4gICAgfVxuXG4gICAgYXdhaXQgc2xlZXBGb3JSZXRyeSgpO1xuXG4gICAgcmV0dXJuIGF3YWl0IGdldExvY2soXG4gICAgICBhcHAsIGxvY2tGaWxlLCB0aW1lb3V0TWlsbGlzZWNvbmRzLFxuICAgICAgbWF4TG9ja1JldHJpZXMsIHJldHJ5Q291bnQgKyAxLFxuICAgICk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBnZXRMb2NrRmlsZUNvbnRlbnQgPSAodG90YWxUaW1lb3V0LCBlcG9jaFRpbWUpID0+IGAke3RvdGFsVGltZW91dH06JHtlcG9jaFRpbWUudG9TdHJpbmcoKX1gO1xuXG5jb25zdCBwYXJzZUxvY2tGaWxlQ29udGVudCA9IChrZXksIGNvbnRlbnQpID0+ICQoY29udGVudCwgW1xuICBzcGxpdCgnOicpLFxuICBwYXJ0cyA9PiAoe1xuICAgIHRvdGFsVGltZW91dDogbmV3IE51bWJlcihwYXJ0c1swXSksXG4gICAgdGltZW91dDogbmV3IE51bWJlcihwYXJ0c1sxXSksXG4gICAga2V5LFxuICB9KSxcbl0pO1xuXG5leHBvcnQgY29uc3QgcmVsZWFzZUxvY2sgPSBhc3luYyAoYXBwLCBsb2NrKSA9PiB7XG4gIGNvbnN0IGN1cnJlbnRFcG9jaFRpbWUgPSBhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCk7XG4gIC8vIG9ubHkgcmVsZWFzZSBpZiBub3QgdGltZWRvdXRcbiAgaWYgKGN1cnJlbnRFcG9jaFRpbWUgPCAobG9jay50aW1lb3V0IC0gbG9ja092ZXJsYXBNaWxsaXNlY29uZHMpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShsb2NrLmtleSk7XG4gICAgfSBjYXRjaCAoXykge1xuICAgICAgLy9lbXB0eVxuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGV4dGVuZExvY2sgPSBhc3luYyAoYXBwLCBsb2NrKSA9PiB7XG4gIGNvbnN0IGN1cnJlbnRFcG9jaFRpbWUgPSBhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCk7XG4gIC8vIG9ubHkgcmVsZWFzZSBpZiBub3QgdGltZWRvdXRcbiAgaWYgKGN1cnJlbnRFcG9jaFRpbWUgPCAobG9jay50aW1lb3V0IC0gbG9ja092ZXJsYXBNaWxsaXNlY29uZHMpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGxvY2sudGltZW91dCA9IGN1cnJlbnRFcG9jaFRpbWUgKyBsb2NrLnRpbWVvdXRNaWxsaXNlY29uZHM7XG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUZpbGUoXG4gICAgICAgIGxvY2sua2V5LFxuICAgICAgICBnZXRMb2NrRmlsZUNvbnRlbnQobG9jay50b3RhbFRpbWVvdXQsIGxvY2sudGltZW91dCksXG4gICAgICApO1xuICAgICAgcmV0dXJuIGxvY2s7XG4gICAgfSBjYXRjaCAoXykge1xuICAgICAgLy9lbXB0eVxuICAgIH1cbiAgfVxuICByZXR1cm4gTk9fTE9DSztcbn07XG5cbmV4cG9ydCBjb25zdCBOT19MT0NLID0gJ25vIGxvY2snO1xuZXhwb3J0IGNvbnN0IGlzTm9sb2NrID0gaWQgPT4gaWQgPT09IE5PX0xPQ0s7XG5cbmNvbnN0IHNsZWVwRm9yUmV0cnkgPSAoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbG9ja092ZXJsYXBNaWxsaXNlY29uZHMpKTtcbiIsImltcG9ydCB7XG4gIFxuICBoZWFkLCBcbiAgdGFpbCwgZmluZEluZGV4LCBzdGFydHNXaXRoLCBcbiAgZHJvcFJpZ2h0LCBmbG93LCB0YWtlUmlnaHQsIHRyaW0sXG4gIHJlcGxhY2VcbiAgXG59IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBcbiAgc29tZSwgcmVkdWNlLCBpc0VtcHR5LCBpc0FycmF5LCBqb2luLFxuICBpc1N0cmluZywgaXNJbnRlZ2VyLCBpc0RhdGUsIHRvTnVtYmVyLFxuICBpc1VuZGVmaW5lZCwgaXNOYU4sIGlzTnVsbCwgY29uc3RhbnQsXG4gIHNwbGl0LCBpbmNsdWRlc1xufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZXZlbnRzLCBldmVudHNMaXN0IH0gZnJvbSAnLi9ldmVudHMnO1xuaW1wb3J0IHsgYXBpV3JhcHBlciB9IGZyb20gJy4vYXBpV3JhcHBlcic7XG5pbXBvcnQge1xuICBnZXRMb2NrLCBOT19MT0NLLFxuICBpc05vbG9ja1xufSBmcm9tICcuL2xvY2snO1xuXG4vLyB0aGlzIGlzIHRoZSBjb21iaW5hdG9yIGZ1bmN0aW9uXG5leHBvcnQgY29uc3QgJCQgPSAoLi4uZnVuY3MpID0+IGFyZyA9PiBmbG93KGZ1bmNzKShhcmcpO1xuXG4vLyB0aGlzIGlzIHRoZSBwaXBlIGZ1bmN0aW9uXG5leHBvcnQgY29uc3QgJCA9IChhcmcsIGZ1bmNzKSA9PiAkJCguLi5mdW5jcykoYXJnKTtcblxuZXhwb3J0IGNvbnN0IGtleVNlcCA9ICcvJztcbmNvbnN0IHRyaW1LZXlTZXAgPSBzdHIgPT4gdHJpbShzdHIsIGtleVNlcCk7XG5jb25zdCBzcGxpdEJ5S2V5U2VwID0gc3RyID0+IHNwbGl0KGtleVNlcCkoc3RyKTtcbmV4cG9ydCBjb25zdCBzYWZlS2V5ID0ga2V5ID0+IHJlcGxhY2UoYCR7a2V5U2VwfSR7dHJpbUtleVNlcChrZXkpfWAsIGAke2tleVNlcH0ke2tleVNlcH1gLCBrZXlTZXApO1xuZXhwb3J0IGNvbnN0IGpvaW5LZXkgPSAoLi4uc3RycykgPT4ge1xuICBjb25zdCBwYXJhbXNPckFycmF5ID0gc3Rycy5sZW5ndGggPT09IDEgJiBpc0FycmF5KHN0cnNbMF0pXG4gICAgPyBzdHJzWzBdIDogc3RycztcbiAgcmV0dXJuIHNhZmVLZXkoam9pbihrZXlTZXApKHBhcmFtc09yQXJyYXkpKTtcbn07XG5leHBvcnQgY29uc3Qgc3BsaXRLZXkgPSAkJCh0cmltS2V5U2VwLCBzcGxpdEJ5S2V5U2VwKTtcbmV4cG9ydCBjb25zdCBnZXREaXJGb21LZXkgPSAkJChzcGxpdEtleSwgZHJvcFJpZ2h0LCBwID0+IGpvaW5LZXkoLi4ucCkpO1xuZXhwb3J0IGNvbnN0IGdldEZpbGVGcm9tS2V5ID0gJCQoc3BsaXRLZXksIHRha2VSaWdodCwgaGVhZCk7XG5cbmV4cG9ydCBjb25zdCBjb25maWdGb2xkZXIgPSBgJHtrZXlTZXB9LmNvbmZpZ2A7XG5leHBvcnQgY29uc3QgZmllbGREZWZpbml0aW9ucyA9IGpvaW5LZXkoY29uZmlnRm9sZGVyLCAnZmllbGRzLmpzb24nKTtcbmV4cG9ydCBjb25zdCB0ZW1wbGF0ZURlZmluaXRpb25zID0gam9pbktleShjb25maWdGb2xkZXIsICd0ZW1wbGF0ZXMuanNvbicpO1xuZXhwb3J0IGNvbnN0IGFwcERlZmluaXRpb25GaWxlID0gam9pbktleShjb25maWdGb2xkZXIsICdhcHBEZWZpbml0aW9uLmpzb24nKTtcbmV4cG9ydCBjb25zdCBkaXJJbmRleCA9IGZvbGRlclBhdGggPT4gam9pbktleShjb25maWdGb2xkZXIsICdkaXInLCAuLi5zcGxpdEtleShmb2xkZXJQYXRoKSwgJ2Rpci5pZHgnKTtcbmV4cG9ydCBjb25zdCBnZXRJbmRleEtleUZyb21GaWxlS2V5ID0gJCQoZ2V0RGlyRm9tS2V5LCBkaXJJbmRleCk7XG5cbmV4cG9ydCBjb25zdCBpZkV4aXN0cyA9ICh2YWwsIGV4aXN0cywgbm90RXhpc3RzKSA9PiAoaXNVbmRlZmluZWQodmFsKVxuICA/IGlzVW5kZWZpbmVkKG5vdEV4aXN0cykgPyAoKCkgPT4geyB9KSgpIDogbm90RXhpc3RzKClcbiAgOiBleGlzdHMoKSk7XG5cbmV4cG9ydCBjb25zdCBnZXRPckRlZmF1bHQgPSAodmFsLCBkZWZhdWx0VmFsKSA9PiBpZkV4aXN0cyh2YWwsICgpID0+IHZhbCwgKCkgPT4gZGVmYXVsdFZhbCk7XG5cbmV4cG9ydCBjb25zdCBub3QgPSBmdW5jID0+IHZhbCA9PiAhZnVuYyh2YWwpO1xuZXhwb3J0IGNvbnN0IGlzRGVmaW5lZCA9IG5vdChpc1VuZGVmaW5lZCk7XG5leHBvcnQgY29uc3QgaXNOb25OdWxsID0gbm90KGlzTnVsbCk7XG5leHBvcnQgY29uc3QgaXNOb3ROYU4gPSBub3QoaXNOYU4pO1xuXG5leHBvcnQgY29uc3QgYWxsVHJ1ZSA9ICguLi5mdW5jQXJncykgPT4gdmFsID0+IHJlZHVjZShcbiAgKHJlc3VsdCwgY29uZGl0aW9uRnVuYykgPT4gKGlzTnVsbChyZXN1bHQpIHx8IHJlc3VsdCA9PSB0cnVlKSAmJiBjb25kaXRpb25GdW5jKHZhbCksXG4gIG51bGwpKGZ1bmNBcmdzKTtcblxuZXhwb3J0IGNvbnN0IGFueVRydWUgPSAoLi4uZnVuY0FyZ3MpID0+IHZhbCA9PiByZWR1Y2UoXG4gIChyZXN1bHQsIGNvbmRpdGlvbkZ1bmMpID0+IHJlc3VsdCA9PSB0cnVlIHx8IGNvbmRpdGlvbkZ1bmModmFsKSxcbiAgbnVsbCkoZnVuY0FyZ3MpO1xuXG5leHBvcnQgY29uc3QgaW5zZW5zaXRpdmVFcXVhbHMgPSAoc3RyMSwgc3RyMikgPT4gc3RyMS50cmltKCkudG9Mb3dlckNhc2UoKSA9PT0gc3RyMi50cmltKCkudG9Mb3dlckNhc2UoKTtcblxuZXhwb3J0IGNvbnN0IGlzU29tZXRoaW5nID0gYWxsVHJ1ZShpc0RlZmluZWQsIGlzTm9uTnVsbCwgaXNOb3ROYU4pO1xuZXhwb3J0IGNvbnN0IGlzTm90aGluZyA9IG5vdChpc1NvbWV0aGluZyk7XG5leHBvcnQgY29uc3QgaXNOb3RoaW5nT3JFbXB0eSA9IHYgPT4gaXNOb3RoaW5nKHYpIHx8IGlzRW1wdHkodik7XG5leHBvcnQgY29uc3Qgc29tZXRoaW5nT3JHZXREZWZhdWx0ID0gZ2V0RGVmYXVsdEZ1bmMgPT4gdmFsID0+IChpc1NvbWV0aGluZyh2YWwpID8gdmFsIDogZ2V0RGVmYXVsdEZ1bmMoKSk7XG5leHBvcnQgY29uc3Qgc29tZXRoaW5nT3JEZWZhdWx0ID0gKHZhbCwgZGVmYXVsdFZhbCkgPT4gc29tZXRoaW5nT3JHZXREZWZhdWx0KGNvbnN0YW50KGRlZmF1bHRWYWwpKSh2YWwpO1xuXG5leHBvcnQgY29uc3QgbWFwSWZTb21ldGhpbmdPckRlZmF1bHQgPSAobWFwRnVuYywgZGVmYXVsdFZhbCkgPT4gdmFsID0+IChpc1NvbWV0aGluZyh2YWwpID8gbWFwRnVuYyh2YWwpIDogZGVmYXVsdFZhbCk7XG5cbmV4cG9ydCBjb25zdCBtYXBJZlNvbWV0aGluZ09yQmxhbmsgPSBtYXBGdW5jID0+IG1hcElmU29tZXRoaW5nT3JEZWZhdWx0KG1hcEZ1bmMsICcnKTtcblxuZXhwb3J0IGNvbnN0IG5vbmUgPSBwcmVkaWNhdGUgPT4gY29sbGVjdGlvbiA9PiAhc29tZShwcmVkaWNhdGUpKGNvbGxlY3Rpb24pO1xuXG5leHBvcnQgY29uc3QgYWxsID0gcHJlZGljYXRlID0+IGNvbGxlY3Rpb24gPT4gbm9uZSh2ID0+ICFwcmVkaWNhdGUodikpKGNvbGxlY3Rpb24pO1xuXG5leHBvcnQgY29uc3QgaXNOb3RFbXB0eSA9IG9iID0+ICFpc0VtcHR5KG9iKTtcbmV4cG9ydCBjb25zdCBpc0FzeW5jID0gZm4gPT4gZm4uY29uc3RydWN0b3IubmFtZSA9PT0gJ0FzeW5jRnVuY3Rpb24nO1xuZXhwb3J0IGNvbnN0IGlzTm9uRW1wdHlBcnJheSA9IGFsbFRydWUoaXNBcnJheSwgaXNOb3RFbXB0eSk7XG5leHBvcnQgY29uc3QgaXNOb25FbXB0eVN0cmluZyA9IGFsbFRydWUoaXNTdHJpbmcsIGlzTm90RW1wdHkpO1xuZXhwb3J0IGNvbnN0IHRyeU9yID0gZmFpbEZ1bmMgPT4gKGZ1bmMsIC4uLmFyZ3MpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnVuYy5hcHBseShudWxsLCAuLi5hcmdzKTtcbiAgfSBjYXRjaCAoXykge1xuICAgIHJldHVybiBmYWlsRnVuYygpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgdHJ5QXdhaXRPciA9IGZhaWxGdW5jID0+IGFzeW5jIChmdW5jLCAuLi5hcmdzKSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGZ1bmMuYXBwbHkobnVsbCwgLi4uYXJncyk7XG4gIH0gY2F0Y2ggKF8pIHtcbiAgICByZXR1cm4gYXdhaXQgZmFpbEZ1bmMoKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGRlZmluZUVycm9yID0gKGZ1bmMsIGVycm9yUHJlZml4KSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZ1bmMoKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZXJyLm1lc3NhZ2UgPSBgJHtlcnJvclByZWZpeH0gOiAke2Vyci5tZXNzYWdlfWA7XG4gICAgdGhyb3cgZXJyO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgdHJ5T3JJZ25vcmUgPSB0cnlPcigoKSA9PiB7IH0pO1xuZXhwb3J0IGNvbnN0IHRyeUF3YWl0T3JJZ25vcmUgPSB0cnlBd2FpdE9yKGFzeW5jICgpID0+IHsgfSk7XG5leHBvcnQgY29uc3QgY2F1c2VzRXhjZXB0aW9uID0gKGZ1bmMpID0+IHtcbiAgdHJ5IHtcbiAgICBmdW5jKCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24gPSBmdW5jID0+ICFjYXVzZXNFeGNlcHRpb24oZnVuYyk7XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVFcnJvcldpdGggPSByZXR1cm5WYWxJbkVycm9yID0+IHRyeU9yKGNvbnN0YW50KHJldHVyblZhbEluRXJyb3IpKTtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZUVycm9yV2l0aFVuZGVmaW5lZCA9IGhhbmRsZUVycm9yV2l0aCh1bmRlZmluZWQpO1xuXG5leHBvcnQgY29uc3Qgc3dpdGNoQ2FzZSA9ICguLi5jYXNlcykgPT4gKHZhbHVlKSA9PiB7XG4gIGNvbnN0IG5leHRDYXNlID0gKCkgPT4gaGVhZChjYXNlcylbMF0odmFsdWUpO1xuICBjb25zdCBuZXh0UmVzdWx0ID0gKCkgPT4gaGVhZChjYXNlcylbMV0odmFsdWUpO1xuXG4gIGlmIChpc0VtcHR5KGNhc2VzKSkgcmV0dXJuOyAvLyB1bmRlZmluZWRcbiAgaWYgKG5leHRDYXNlKCkgPT09IHRydWUpIHJldHVybiBuZXh0UmVzdWx0KCk7XG4gIHJldHVybiBzd2l0Y2hDYXNlKC4uLnRhaWwoY2FzZXMpKSh2YWx1ZSk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNWYWx1ZSA9IHZhbDEgPT4gdmFsMiA9PiAodmFsMSA9PT0gdmFsMik7XG5leHBvcnQgY29uc3QgaXNPbmVPZiA9ICguLi52YWxzKSA9PiB2YWwgPT4gaW5jbHVkZXModmFsKSh2YWxzKTtcbmV4cG9ydCBjb25zdCBkZWZhdWx0Q2FzZSA9IGNvbnN0YW50KHRydWUpO1xuZXhwb3J0IGNvbnN0IG1lbWJlck1hdGNoZXMgPSAobWVtYmVyLCBtYXRjaCkgPT4gb2JqID0+IG1hdGNoKG9ialttZW1iZXJdKTtcblxuXG5leHBvcnQgY29uc3QgU3RhcnRzV2l0aCA9IHNlYXJjaEZvciA9PiBzZWFyY2hJbiA9PiBzdGFydHNXaXRoKHNlYXJjaEluLCBzZWFyY2hGb3IpO1xuXG5leHBvcnQgY29uc3QgY29udGFpbnMgPSB2YWwgPT4gYXJyYXkgPT4gKGZpbmRJbmRleChhcnJheSwgdiA9PiB2ID09PSB2YWwpID4gLTEpO1xuXG5leHBvcnQgY29uc3QgZ2V0SGFzaENvZGUgPSAocykgPT4ge1xuICBsZXQgaGFzaCA9IDA7IGxldCBpOyBsZXQgY2hhcjsgbGV0XG4gICAgbDtcbiAgaWYgKHMubGVuZ3RoID09IDApIHJldHVybiBoYXNoO1xuICBmb3IgKGkgPSAwLCBsID0gcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjaGFyID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGNoYXI7XG4gICAgaGFzaCB8PSAwOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgfVxuXG4gIC8vIGNvbnZlcnRpbmcgdG8gc3RyaW5nLCBidXQgZG9udCB3YW50IGEgXCItXCIgcHJlZml4ZWRcbiAgaWYgKGhhc2ggPCAwKSB7IHJldHVybiBgbiR7KGhhc2ggKiAtMSkudG9TdHJpbmcoKX1gOyB9XG4gIHJldHVybiBoYXNoLnRvU3RyaW5nKCk7XG59O1xuXG4vLyB0aGFua3MgdG8gaHR0cHM6Ly9ibG9nLmdyb3NzbWFuLmlvL2hvdy10by13cml0ZS1hc3luYy1hd2FpdC13aXRob3V0LXRyeS1jYXRjaC1ibG9ja3MtaW4tamF2YXNjcmlwdC9cbmV4cG9ydCBjb25zdCBhd0V4ID0gYXN5bmMgKHByb21pc2UpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBwcm9taXNlO1xuICAgIHJldHVybiBbdW5kZWZpbmVkLCByZXN1bHRdO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBbZXJyb3IsIHVuZGVmaW5lZF07XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBpc1NhZmVJbnRlZ2VyID0gbiA9PiBpc0ludGVnZXIobilcbiAgICAmJiBuIDw9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gICAgJiYgbiA+PSAwIC0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG5cbmV4cG9ydCBjb25zdCB0b0RhdGVPck51bGwgPSBzID0+IChpc051bGwocykgPyBudWxsXG4gIDogaXNEYXRlKHMpID8gcyA6IG5ldyBEYXRlKHMpKTtcbmV4cG9ydCBjb25zdCB0b0Jvb2xPck51bGwgPSBzID0+IChpc051bGwocykgPyBudWxsXG4gIDogcyA9PT0gJ3RydWUnIHx8IHMgPT09IHRydWUpO1xuZXhwb3J0IGNvbnN0IHRvTnVtYmVyT3JOdWxsID0gcyA9PiAoaXNOdWxsKHMpID8gbnVsbFxuICA6IHRvTnVtYmVyKHMpKTtcblxuZXhwb3J0IGNvbnN0IGlzQXJyYXlPZlN0cmluZyA9IG9wdHMgPT4gaXNBcnJheShvcHRzKSAmJiBhbGwoaXNTdHJpbmcpKG9wdHMpO1xuXG5leHBvcnQgY29uc3QgcGF1c2UgPSBhc3luYyBkdXJhdGlvbiA9PiBuZXcgUHJvbWlzZShyZXMgPT4gc2V0VGltZW91dChyZXMsIGR1cmF0aW9uKSk7XG5cbmV4cG9ydCBjb25zdCByZXRyeSA9IGFzeW5jIChmbiwgcmV0cmllcywgZGVsYXksIC4uLmFyZ3MpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgZm4oLi4uYXJncyk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChyZXRyaWVzID4gMSkge1xuICAgICAgcmV0dXJuIGF3YWl0IHBhdXNlKGRlbGF5KS50aGVuKGFzeW5jICgpID0+IGF3YWl0IHJldHJ5KGZuLCAocmV0cmllcyAtIDEpLCBkZWxheSwgLi4uYXJncykpO1xuICAgIH1cbiAgICB0aHJvdyBlcnI7XG4gIH1cbn07XG5cbmV4cG9ydCB7IGV2ZW50cyB9IGZyb20gJy4vZXZlbnRzJztcbmV4cG9ydCB7IGFwaVdyYXBwZXIsIGFwaVdyYXBwZXJTeW5jIH0gZnJvbSAnLi9hcGlXcmFwcGVyJztcbmV4cG9ydCB7XG4gIGdldExvY2ssIE5PX0xPQ0ssIHJlbGVhc2VMb2NrLFxuICBleHRlbmRMb2NrLCBpc05vbG9jayxcbn0gZnJvbSAnLi9sb2NrJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBpZkV4aXN0cyxcbiAgZ2V0T3JEZWZhdWx0LFxuICBpc0RlZmluZWQsXG4gIGlzTm9uTnVsbCxcbiAgaXNOb3ROYU4sXG4gIGFsbFRydWUsXG4gIGlzU29tZXRoaW5nLFxuICBtYXBJZlNvbWV0aGluZ09yRGVmYXVsdCxcbiAgbWFwSWZTb21ldGhpbmdPckJsYW5rLFxuICBjb25maWdGb2xkZXIsXG4gIGZpZWxkRGVmaW5pdGlvbnMsXG4gIGlzTm90aGluZyxcbiAgbm90LFxuICBzd2l0Y2hDYXNlLFxuICBkZWZhdWx0Q2FzZSxcbiAgU3RhcnRzV2l0aCxcbiAgY29udGFpbnMsXG4gIHRlbXBsYXRlRGVmaW5pdGlvbnMsXG4gIGhhbmRsZUVycm9yV2l0aCxcbiAgaGFuZGxlRXJyb3JXaXRoVW5kZWZpbmVkLFxuICB0cnlPcixcbiAgdHJ5T3JJZ25vcmUsXG4gIHRyeUF3YWl0T3IsXG4gIHRyeUF3YWl0T3JJZ25vcmUsXG4gIGRpckluZGV4LFxuICBrZXlTZXAsXG4gICQsXG4gICQkLFxuICBnZXREaXJGb21LZXksXG4gIGdldEZpbGVGcm9tS2V5LFxuICBzcGxpdEtleSxcbiAgc29tZXRoaW5nT3JEZWZhdWx0LFxuICBnZXRJbmRleEtleUZyb21GaWxlS2V5LFxuICBqb2luS2V5LFxuICBzb21ldGhpbmdPckdldERlZmF1bHQsXG4gIGFwcERlZmluaXRpb25GaWxlLFxuICBpc1ZhbHVlLFxuICBhbGwsXG4gIGlzT25lT2YsXG4gIG1lbWJlck1hdGNoZXMsXG4gIGRlZmluZUVycm9yLFxuICBhbnlUcnVlLFxuICBpc05vbkVtcHR5QXJyYXksXG4gIGNhdXNlc0V4Y2VwdGlvbixcbiAgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uLFxuICBub25lLFxuICBnZXRIYXNoQ29kZSxcbiAgYXdFeCxcbiAgYXBpV3JhcHBlcixcbiAgZXZlbnRzLFxuICBldmVudHNMaXN0LFxuICBpc05vdGhpbmdPckVtcHR5LFxuICBpc1NhZmVJbnRlZ2VyLFxuICB0b051bWJlcixcbiAgdG9EYXRlOiB0b0RhdGVPck51bGwsXG4gIHRvQm9vbDogdG9Cb29sT3JOdWxsLFxuICBpc0FycmF5T2ZTdHJpbmcsXG4gIGdldExvY2ssXG4gIE5PX0xPQ0ssXG4gIGlzTm9sb2NrLFxuICBpbnNlbnNpdGl2ZUVxdWFscyxcbiAgcGF1c2UsXG4gIHJldHJ5LFxufTtcbiIsImltcG9ydCB7IGZpbHRlciwgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7ICQsIGlzU29tZXRoaW5nIH0gZnJvbSAnLi9pbmRleCc7XG5cbmV4cG9ydCBjb25zdCBzdHJpbmdOb3RFbXB0eSA9IHMgPT4gaXNTb21ldGhpbmcocykgJiYgcy50cmltKCkubGVuZ3RoID4gMDtcblxuZXhwb3J0IGNvbnN0IG1ha2VydWxlID0gKGZpZWxkLCBlcnJvciwgaXNWYWxpZCkgPT4gKHsgZmllbGQsIGVycm9yLCBpc1ZhbGlkIH0pO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGlvbkVycm9yID0gKHJ1bGUsIGl0ZW0pID0+ICh7IC4uLnJ1bGUsIGl0ZW0gfSk7XG5cbmV4cG9ydCBjb25zdCBhcHBseVJ1bGVTZXQgPSBydWxlU2V0ID0+IGl0ZW1Ub1ZhbGlkYXRlID0+ICQocnVsZVNldCwgW1xuICBtYXAoYXBwbHlSdWxlKGl0ZW1Ub1ZhbGlkYXRlKSksXG4gIGZpbHRlcihpc1NvbWV0aGluZyksXG5dKTtcblxuZXhwb3J0IGNvbnN0IGFwcGx5UnVsZSA9IGl0ZW1Ub3ZhbGlkYXRlID0+IHJ1bGUgPT4gKHJ1bGUuaXNWYWxpZChpdGVtVG92YWxpZGF0ZSlcbiAgPyBudWxsXG4gIDogdmFsaWRhdGlvbkVycm9yKHJ1bGUsIGl0ZW1Ub3ZhbGlkYXRlKSk7XG4iLCJpbXBvcnQgeyBjb21waWxlRXhwcmVzc2lvbiwgY29tcGlsZUNvZGUgfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XG5pbXBvcnQge1xuICBpc1VuZGVmaW5lZCwga2V5cywgXG4gIGNsb25lRGVlcCwgaXNGdW5jdGlvbixcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGRlZmluZUVycm9yIH0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGZpbHRlckV2YWwgPSAnRklMVEVSX0VWQUxVQVRFJztcbmV4cG9ydCBjb25zdCBmaWx0ZXJDb21waWxlID0gJ0ZJTFRFUl9DT01QSUxFJztcbmV4cG9ydCBjb25zdCBtYXBFdmFsID0gJ01BUF9FVkFMVUFURSc7XG5leHBvcnQgY29uc3QgbWFwQ29tcGlsZSA9ICdNQVBfQ09NUElMRSc7XG5leHBvcnQgY29uc3QgcmVtb3ZlVW5kZWNsYXJlZEZpZWxkcyA9ICdSRU1PVkVfVU5ERUNMQVJFRF9GSUVMRFMnO1xuZXhwb3J0IGNvbnN0IGFkZFVuTWFwcGVkRmllbGRzID0gJ0FERF9VTk1BUFBFRF9GSUVMRFMnO1xuZXhwb3J0IGNvbnN0IGFkZFRoZUtleSA9ICdBRERfS0VZJztcblxuXG5jb25zdCBnZXRFdmFsdWF0ZVJlc3VsdCA9ICgpID0+ICh7XG4gIGlzRXJyb3I6IGZhbHNlLFxuICBwYXNzZWRGaWx0ZXI6IHRydWUsXG4gIHJlc3VsdDogbnVsbCxcbn0pO1xuXG5leHBvcnQgY29uc3QgY29tcGlsZUZpbHRlciA9IGluZGV4ID0+IGNvbXBpbGVFeHByZXNzaW9uKGluZGV4LmZpbHRlcik7XG5cbmV4cG9ydCBjb25zdCBjb21waWxlTWFwID0gaW5kZXggPT4gY29tcGlsZUNvZGUoaW5kZXgubWFwKTtcblxuZXhwb3J0IGNvbnN0IHBhc3Nlc0ZpbHRlciA9IChyZWNvcmQsIGluZGV4KSA9PiB7XG4gIGNvbnN0IGNvbnRleHQgPSB7IHJlY29yZCB9O1xuICBpZiAoIWluZGV4LmZpbHRlcikgcmV0dXJuIHRydWU7XG5cbiAgY29uc3QgY29tcGlsZWRGaWx0ZXIgPSBkZWZpbmVFcnJvcihcbiAgICAoKSA9PiBjb21waWxlRmlsdGVyKGluZGV4KSxcbiAgICBmaWx0ZXJDb21waWxlLFxuICApO1xuXG4gIHJldHVybiBkZWZpbmVFcnJvcihcbiAgICAoKSA9PiBjb21waWxlZEZpbHRlcihjb250ZXh0KSxcbiAgICBmaWx0ZXJFdmFsLFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IG1hcFJlY29yZCA9IChyZWNvcmQsIGluZGV4KSA9PiB7XG4gIGNvbnN0IHJlY29yZENsb25lID0gY2xvbmVEZWVwKHJlY29yZCk7XG4gIGNvbnN0IGNvbnRleHQgPSB7IHJlY29yZDogcmVjb3JkQ2xvbmUgfTtcblxuICBjb25zdCBtYXAgPSBpbmRleC5tYXAgPyBpbmRleC5tYXAgOiAncmV0dXJuIHsuLi5yZWNvcmR9Oyc7XG5cbiAgY29uc3QgY29tcGlsZWRNYXAgPSBkZWZpbmVFcnJvcihcbiAgICAoKSA9PiBjb21waWxlQ29kZShtYXApLFxuICAgIG1hcENvbXBpbGUsXG4gICk7XG5cbiAgY29uc3QgbWFwcGVkID0gZGVmaW5lRXJyb3IoXG4gICAgKCkgPT4gY29tcGlsZWRNYXAoY29udGV4dCksXG4gICAgbWFwRXZhbCxcbiAgKTtcblxuICBjb25zdCBtYXBwZWRLZXlzID0ga2V5cyhtYXBwZWQpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hcHBlZEtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBrZXkgPSBtYXBwZWRLZXlzW2ldO1xuICAgIG1hcHBlZFtrZXldID0gaXNVbmRlZmluZWQobWFwcGVkW2tleV0pID8gbnVsbCA6IG1hcHBlZFtrZXldO1xuICAgIGlmIChpc0Z1bmN0aW9uKG1hcHBlZFtrZXldKSkge1xuICAgICAgZGVsZXRlIG1hcHBlZFtrZXldO1xuICAgIH1cbiAgfVxuXG4gIG1hcHBlZC5rZXkgPSByZWNvcmQua2V5O1xuICBtYXBwZWQuc29ydEtleSA9IGluZGV4LmdldFNvcnRLZXlcbiAgICA/IGNvbXBpbGVDb2RlKGluZGV4LmdldFNvcnRLZXkpKGNvbnRleHQpXG4gICAgOiByZWNvcmQuaWQ7XG5cbiAgcmV0dXJuIG1hcHBlZDtcbn07XG5cbmV4cG9ydCBjb25zdCBldmFsdWF0ZSA9IHJlY29yZCA9PiAoaW5kZXgpID0+IHtcbiAgY29uc3QgcmVzdWx0ID0gZ2V0RXZhbHVhdGVSZXN1bHQoKTtcblxuICB0cnkge1xuICAgIHJlc3VsdC5wYXNzZWRGaWx0ZXIgPSBwYXNzZXNGaWx0ZXIocmVjb3JkLCBpbmRleCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJlc3VsdC5pc0Vycm9yID0gdHJ1ZTtcbiAgICByZXN1bHQucGFzc2VkRmlsdGVyID0gZmFsc2U7XG4gICAgcmVzdWx0LnJlc3VsdCA9IGVyci5tZXNzYWdlO1xuICB9XG5cbiAgaWYgKCFyZXN1bHQucGFzc2VkRmlsdGVyKSByZXR1cm4gcmVzdWx0O1xuXG4gIHRyeSB7XG4gICAgcmVzdWx0LnJlc3VsdCA9IG1hcFJlY29yZChyZWNvcmQsIGluZGV4KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmVzdWx0LmlzRXJyb3IgPSB0cnVlO1xuICAgIHJlc3VsdC5yZXN1bHQgPSBlcnIubWVzc2FnZTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBldmFsdWF0ZTtcbiIsImltcG9ydCB7XG4gIG1hcCwgaXNFbXB0eSwgY291bnRCeSwgXG4gIGZsYXR0ZW4sIGluY2x1ZGVzLCBqb2luLCBrZXlzXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyAgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSB9IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcbmltcG9ydCB7IGNvbXBpbGVGaWx0ZXIsIGNvbXBpbGVNYXAgfSBmcm9tICcuLi9pbmRleGluZy9ldmFsdWF0ZSc7XG5pbXBvcnQgeyBpc05vbkVtcHR5U3RyaW5nLCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24sICQgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgaXNSZWNvcmQgfSBmcm9tICcuL2hpZXJhcmNoeSc7XG5cbmV4cG9ydCBjb25zdCBpbmRleFR5cGVzID0geyByZWZlcmVuY2U6ICdyZWZlcmVuY2UnLCBhbmNlc3RvcjogJ2FuY2VzdG9yJyB9O1xuXG5leHBvcnQgY29uc3QgaW5kZXhSdWxlU2V0ID0gW1xuICBtYWtlcnVsZSgnbWFwJywgJ2luZGV4IGhhcyBubyBtYXAgZnVuY3Rpb24nLFxuICAgIGluZGV4ID0+IGlzTm9uRW1wdHlTdHJpbmcoaW5kZXgubWFwKSksXG4gIG1ha2VydWxlKCdtYXAnLCBcImluZGV4J3MgbWFwIGZ1bmN0aW9uIGRvZXMgbm90IGNvbXBpbGVcIixcbiAgICBpbmRleCA9PiAhaXNOb25FbXB0eVN0cmluZyhpbmRleC5tYXApXG4gICAgICAgICAgICAgICAgfHwgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uKCgpID0+IGNvbXBpbGVNYXAoaW5kZXgpKSksXG4gIG1ha2VydWxlKCdmaWx0ZXInLCBcImluZGV4J3MgZmlsdGVyIGZ1bmN0aW9uIGRvZXMgbm90IGNvbXBpbGVcIixcbiAgICBpbmRleCA9PiAhaXNOb25FbXB0eVN0cmluZyhpbmRleC5maWx0ZXIpXG4gICAgICAgICAgICAgICAgfHwgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uKCgpID0+IGNvbXBpbGVGaWx0ZXIoaW5kZXgpKSksXG4gIG1ha2VydWxlKCduYW1lJywgJ211c3QgZGVjbGFyZSBhIG5hbWUgZm9yIGluZGV4JyxcbiAgICBpbmRleCA9PiBpc05vbkVtcHR5U3RyaW5nKGluZGV4Lm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAndGhlcmUgaXMgYSBkdXBsaWNhdGUgbmFtZWQgaW5kZXggb24gdGhpcyBub2RlJyxcbiAgICBpbmRleCA9PiBpc0VtcHR5KGluZGV4Lm5hbWUpXG4gICAgICAgICAgICAgICAgfHwgY291bnRCeSgnbmFtZScpKGluZGV4LnBhcmVudCgpLmluZGV4ZXMpW2luZGV4Lm5hbWVdID09PSAxKSxcbiAgbWFrZXJ1bGUoJ2luZGV4VHlwZScsICdyZWZlcmVuY2UgaW5kZXggbWF5IG9ubHkgZXhpc3Qgb24gYSByZWNvcmQgbm9kZScsXG4gICAgaW5kZXggPT4gaXNSZWNvcmQoaW5kZXgucGFyZW50KCkpXG4gICAgICAgICAgICAgICAgICB8fCBpbmRleC5pbmRleFR5cGUgIT09IGluZGV4VHlwZXMucmVmZXJlbmNlKSxcbiAgbWFrZXJ1bGUoJ2luZGV4VHlwZScsIGBpbmRleCB0eXBlIG11c3QgYmUgb25lIG9mOiAke2pvaW4oJywgJykoa2V5cyhpbmRleFR5cGVzKSl9YCxcbiAgICBpbmRleCA9PiBpbmNsdWRlcyhpbmRleC5pbmRleFR5cGUpKGtleXMoaW5kZXhUeXBlcykpKSxcbl07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUluZGV4ID0gKGluZGV4LCBhbGxSZWZlcmVuY2VJbmRleGVzT25Ob2RlKSA9PiBhcHBseVJ1bGVTZXQoaW5kZXhSdWxlU2V0KGFsbFJlZmVyZW5jZUluZGV4ZXNPbk5vZGUpKShpbmRleCk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFsbEluZGV4ZXMgPSBub2RlID0+ICQobm9kZS5pbmRleGVzLCBbXG4gIG1hcChpID0+IHZhbGlkYXRlSW5kZXgoaSwgbm9kZS5pbmRleGVzKSksXG4gIGZsYXR0ZW4sXG5dKTtcbiIsImltcG9ydCB7XG4gIGZpbmQsIGNvbnN0YW50LCBtYXAsIGxhc3QsXG4gIGZpcnN0LCBzcGxpdCwgaW50ZXJzZWN0aW9uLCB0YWtlLFxuICB1bmlvbiwgaW5jbHVkZXMsIGZpbHRlciwgc29tZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gICQsIHN3aXRjaENhc2UsIGlzTm90aGluZywgaXNTb21ldGhpbmcsXG4gIGRlZmF1bHRDYXNlLCBzcGxpdEtleSwgaXNOb25FbXB0eVN0cmluZyxcbiAgam9pbktleSwgZ2V0SGFzaENvZGUsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBpbmRleFR5cGVzIH0gZnJvbSAnLi9pbmRleGVzJztcblxuZXhwb3J0IGNvbnN0IGdldEZsYXR0ZW5lZEhpZXJhcmNoeSA9IChhcHBIaWVyYXJjaHksIHVzZUNhY2hlZCA9IHRydWUpID0+IHtcbiAgaWYgKGlzU29tZXRoaW5nKGFwcEhpZXJhcmNoeS5nZXRGbGF0dGVuZWRIaWVyYXJjaHkpICYmIHVzZUNhY2hlZCkgeyByZXR1cm4gYXBwSGllcmFyY2h5LmdldEZsYXR0ZW5lZEhpZXJhcmNoeSgpOyB9XG5cbiAgY29uc3QgZmxhdHRlbkhpZXJhcmNoeSA9IChjdXJyZW50Tm9kZSwgZmxhdHRlbmVkKSA9PiB7XG4gICAgZmxhdHRlbmVkLnB1c2goY3VycmVudE5vZGUpO1xuICAgIGlmICgoIWN1cnJlbnROb2RlLmNoaWxkcmVuXG4gICAgICAgICAgICB8fCBjdXJyZW50Tm9kZS5jaGlsZHJlbi5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAmJiAoIWN1cnJlbnROb2RlLmluZGV4ZXNcbiAgICAgICAgICAgIHx8IGN1cnJlbnROb2RlLmluZGV4ZXMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgJiYgKCFjdXJyZW50Tm9kZS5hZ2dyZWdhdGVHcm91cHNcbiAgICAgICAgICAgIHx8IGN1cnJlbnROb2RlLmFnZ3JlZ2F0ZUdyb3Vwcy5sZW5ndGggPT09IDApKSB7XG4gICAgICByZXR1cm4gZmxhdHRlbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IHVuaW9uSWZBbnkgPSBsMiA9PiBsMSA9PiB1bmlvbihsMSkoIWwyID8gW10gOiBsMik7XG5cbiAgICBjb25zdCBjaGlsZHJlbiA9ICQoW10sIFtcbiAgICAgIHVuaW9uSWZBbnkoY3VycmVudE5vZGUuY2hpbGRyZW4pLFxuICAgICAgdW5pb25JZkFueShjdXJyZW50Tm9kZS5pbmRleGVzKSxcbiAgICAgIHVuaW9uSWZBbnkoY3VycmVudE5vZGUuYWdncmVnYXRlR3JvdXBzKSxcbiAgICBdKTtcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGZsYXR0ZW5IaWVyYXJjaHkoY2hpbGQsIGZsYXR0ZW5lZCk7XG4gICAgfVxuICAgIHJldHVybiBmbGF0dGVuZWQ7XG4gIH07XG5cbiAgYXBwSGllcmFyY2h5LmdldEZsYXR0ZW5lZEhpZXJhcmNoeSA9ICgpID0+IGZsYXR0ZW5IaWVyYXJjaHkoYXBwSGllcmFyY2h5LCBbXSk7XG4gIHJldHVybiBhcHBIaWVyYXJjaHkuZ2V0RmxhdHRlbmVkSGllcmFyY2h5KCk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TGFzdFBhcnRJbktleSA9IGtleSA9PiBsYXN0KHNwbGl0S2V5KGtleSkpO1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZXNJblBhdGggPSBhcHBIaWVyYXJjaHkgPT4ga2V5ID0+ICQoYXBwSGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmlsdGVyKG4gPT4gbmV3IFJlZ0V4cChgJHtuLnBhdGhSZWd4KCl9YCkudGVzdChrZXkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0RXhhY3ROb2RlRm9yUGF0aCA9IGFwcEhpZXJhcmNoeSA9PiBrZXkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gbmV3IFJlZ0V4cChgJHtuLnBhdGhSZWd4KCl9JGApLnRlc3Qoa2V5KSksXG5dKTtcblxuZXhwb3J0IGNvbnN0IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aCA9IGFwcEhpZXJhcmNoeSA9PiBjb2xsZWN0aW9uS2V5ID0+ICQoYXBwSGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmluZChuID0+IChpc0NvbGxlY3Rpb25SZWNvcmQobilcbiAgICAgICAgICAgICAgICAgICAmJiBuZXcgUmVnRXhwKGAke24uY29sbGVjdGlvblBhdGhSZWd4KCl9JGApLnRlc3QoY29sbGVjdGlvbktleSkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgaGFzTWF0Y2hpbmdBbmNlc3RvciA9IGFuY2VzdG9yUHJlZGljYXRlID0+IGRlY2VuZGFudE5vZGUgPT4gc3dpdGNoQ2FzZShcblxuICBbbm9kZSA9PiBpc05vdGhpbmcobm9kZS5wYXJlbnQoKSksXG4gICAgY29uc3RhbnQoZmFsc2UpXSxcblxuICBbbm9kZSA9PiBhbmNlc3RvclByZWRpY2F0ZShub2RlLnBhcmVudCgpKSxcbiAgICBjb25zdGFudCh0cnVlKV0sXG5cbiAgW2RlZmF1bHRDYXNlLFxuICAgIG5vZGUgPT4gaGFzTWF0Y2hpbmdBbmNlc3RvcihhbmNlc3RvclByZWRpY2F0ZSkobm9kZS5wYXJlbnQoKSldLFxuXG4pKGRlY2VuZGFudE5vZGUpO1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZSA9IChhcHBIaWVyYXJjaHksIG5vZGVLZXkpID0+ICQoYXBwSGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmluZChuID0+IG4ubm9kZUtleSgpID09PSBub2RlS2V5XG4gICAgICAgICAgICAgICAgICB8fCAoaXNDb2xsZWN0aW9uUmVjb3JkKG4pXG4gICAgICAgICAgICAgICAgICAgICAgJiYgbi5jb2xsZWN0aW9uTm9kZUtleSgpID09PSBub2RlS2V5KSksXG5dKTtcblxuZXhwb3J0IGNvbnN0IGdldENvbGxlY3Rpb25Ob2RlID0gKGFwcEhpZXJhcmNoeSwgbm9kZUtleSkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gKGlzQ29sbGVjdGlvblJlY29yZChuKVxuICAgICAgICAgICAgICAgICAgICAmJiBuLmNvbGxlY3Rpb25Ob2RlS2V5KCkgPT09IG5vZGVLZXkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZUJ5S2V5T3JOb2RlS2V5ID0gKGFwcEhpZXJhcmNoeSwga2V5T3JOb2RlS2V5KSA9PiB7XG4gIGNvbnN0IG5vZGVCeUtleSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwSGllcmFyY2h5KShrZXlPck5vZGVLZXkpO1xuICByZXR1cm4gaXNOb3RoaW5nKG5vZGVCeUtleSlcbiAgICA/IGdldE5vZGUoYXBwSGllcmFyY2h5LCBrZXlPck5vZGVLZXkpXG4gICAgOiBub2RlQnlLZXk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Q29sbGVjdGlvbk5vZGVCeUtleU9yTm9kZUtleSA9IChhcHBIaWVyYXJjaHksIGtleU9yTm9kZUtleSkgPT4ge1xuICBjb25zdCBub2RlQnlLZXkgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwSGllcmFyY2h5KShrZXlPck5vZGVLZXkpO1xuICByZXR1cm4gaXNOb3RoaW5nKG5vZGVCeUtleSlcbiAgICA/IGdldENvbGxlY3Rpb25Ob2RlKGFwcEhpZXJhcmNoeSwga2V5T3JOb2RlS2V5KVxuICAgIDogbm9kZUJ5S2V5O1xufTtcblxuZXhwb3J0IGNvbnN0IGlzTm9kZSA9IChhcHBIaWVyYXJjaHksIGtleSkgPT4gaXNTb21ldGhpbmcoZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHBIaWVyYXJjaHkpKGtleSkpO1xuXG5leHBvcnQgY29uc3QgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQgPSAocGFyZW50Tm9kZUtleSwgYWN0dWFsQ2hpbGRLZXkpID0+ICQoYWN0dWFsQ2hpbGRLZXksIFtcbiAgc3BsaXRLZXksXG4gIHRha2Uoc3BsaXRLZXkocGFyZW50Tm9kZUtleSkubGVuZ3RoKSxcbiAga3MgPT4gam9pbktleSguLi5rcyksXG5dKTtcblxuZXhwb3J0IGNvbnN0IGdldFBhcmVudEtleSA9IChrZXkpID0+IHtcbiAgcmV0dXJuICQoa2V5LCBbXG4gICAgc3BsaXRLZXksXG4gICAgdGFrZShzcGxpdEtleShrZXkpLmxlbmd0aCAtIDEpLFxuICAgIGpvaW5LZXksXG4gIF0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzS2V5QW5jZXN0b3JPZiA9IGFuY2VzdG9yS2V5ID0+IGRlY2VuZGFudE5vZGUgPT4gaGFzTWF0Y2hpbmdBbmNlc3RvcihwID0+IHAubm9kZUtleSgpID09PSBhbmNlc3RvcktleSkoZGVjZW5kYW50Tm9kZSk7XG5cbmV4cG9ydCBjb25zdCBoYXNOb01hdGNoaW5nQW5jZXN0b3JzID0gcGFyZW50UHJlZGljYXRlID0+IG5vZGUgPT4gIWhhc01hdGNoaW5nQW5jZXN0b3IocGFyZW50UHJlZGljYXRlKShub2RlKTtcblxuZXhwb3J0IGNvbnN0IGZpbmRGaWVsZCA9IChyZWNvcmROb2RlLCBmaWVsZE5hbWUpID0+IGZpbmQoZiA9PiBmLm5hbWUgPT0gZmllbGROYW1lKShyZWNvcmROb2RlLmZpZWxkcyk7XG5cbmV4cG9ydCBjb25zdCBpc0FuY2VzdG9yID0gZGVjZW5kYW50ID0+IGFuY2VzdG9yID0+IGlzS2V5QW5jZXN0b3JPZihhbmNlc3Rvci5ub2RlS2V5KCkpKGRlY2VuZGFudCk7XG5cbmV4cG9ydCBjb25zdCBpc0RlY2VuZGFudCA9IGFuY2VzdG9yID0+IGRlY2VuZGFudCA9PiBpc0FuY2VzdG9yKGRlY2VuZGFudCkoYW5jZXN0b3IpO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkTm9kZUlkID0gcmVjb3JkS2V5ID0+ICQocmVjb3JkS2V5LCBbXG4gIHNwbGl0S2V5LFxuICBsYXN0LFxuICBnZXRSZWNvcmROb2RlSWRGcm9tSWQsXG5dKTtcblxuZXhwb3J0IGNvbnN0IGdldFJlY29yZE5vZGVJZEZyb21JZCA9IHJlY29yZElkID0+ICQocmVjb3JkSWQsIFtzcGxpdCgnLScpLCBmaXJzdCwgcGFyc2VJbnRdKTtcblxuZXhwb3J0IGNvbnN0IGdldFJlY29yZE5vZGVCeUlkID0gKGhpZXJhcmNoeSwgcmVjb3JkSWQpID0+ICQoaGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmluZChuID0+IGlzUmVjb3JkKG4pXG4gICAgICAgICAgICAgICAgICAgICYmIG4ubm9kZUlkID09PSBnZXRSZWNvcmROb2RlSWRGcm9tSWQocmVjb3JkSWQpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgcmVjb3JkTm9kZUlkSXNBbGxvd2VkID0gaW5kZXhOb2RlID0+IG5vZGVJZCA9PiBpbmRleE5vZGUuYWxsb3dlZFJlY29yZE5vZGVJZHMubGVuZ3RoID09PSAwXG4gICAgfHwgaW5jbHVkZXMobm9kZUlkKShpbmRleE5vZGUuYWxsb3dlZFJlY29yZE5vZGVJZHMpO1xuXG5leHBvcnQgY29uc3QgcmVjb3JkTm9kZUlzQWxsb3dlZCA9IGluZGV4Tm9kZSA9PiByZWNvcmROb2RlID0+IHJlY29yZE5vZGVJZElzQWxsb3dlZChpbmRleE5vZGUpKHJlY29yZE5vZGUubm9kZUlkKTtcblxuZXhwb3J0IGNvbnN0IGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4ID0gKGFwcEhpZXJhcmNoeSwgaW5kZXhOb2RlKSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGVzID0gJChhcHBIaWVyYXJjaHksIFtcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gICAgZmlsdGVyKGlzUmVjb3JkKSxcbiAgXSk7XG5cbiAgaWYgKGlzR2xvYmFsSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIHJldHVybiAkKHJlY29yZE5vZGVzLCBbXG4gICAgICBmaWx0ZXIocmVjb3JkTm9kZUlzQWxsb3dlZChpbmRleE5vZGUpKSxcbiAgICBdKTtcbiAgfVxuXG4gIGlmIChpc0FuY2VzdG9ySW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIHJldHVybiAkKHJlY29yZE5vZGVzLCBbXG4gICAgICBmaWx0ZXIoaXNEZWNlbmRhbnQoaW5kZXhOb2RlLnBhcmVudCgpKSksXG4gICAgICBmaWx0ZXIocmVjb3JkTm9kZUlzQWxsb3dlZChpbmRleE5vZGUpKSxcbiAgICBdKTtcbiAgfVxuXG4gIGlmIChpc1JlZmVyZW5jZUluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICByZXR1cm4gJChyZWNvcmROb2RlcywgW1xuICAgICAgZmlsdGVyKG4gPT4gc29tZShmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleChpbmRleE5vZGUpKShuLmZpZWxkcykpLFxuICAgIF0pO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZUZyb21Ob2RlS2V5SGFzaCA9IGhpZXJhcmNoeSA9PiBoYXNoID0+ICQoaGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmluZChuID0+IGdldEhhc2hDb2RlKG4ubm9kZUtleSgpKSA9PT0gaGFzaCksXG5dKTtcblxuZXhwb3J0IGNvbnN0IGlzUmVjb3JkID0gbm9kZSA9PiBpc1NvbWV0aGluZyhub2RlKSAmJiBub2RlLnR5cGUgPT09ICdyZWNvcmQnO1xuZXhwb3J0IGNvbnN0IGlzU2luZ2xlUmVjb3JkID0gbm9kZSA9PiBpc1JlY29yZChub2RlKSAmJiBub2RlLmlzU2luZ2xlO1xuZXhwb3J0IGNvbnN0IGlzQ29sbGVjdGlvblJlY29yZCA9IG5vZGUgPT4gaXNSZWNvcmQobm9kZSkgJiYgIW5vZGUuaXNTaW5nbGU7XG5leHBvcnQgY29uc3QgaXNJbmRleCA9IG5vZGUgPT4gaXNTb21ldGhpbmcobm9kZSkgJiYgbm9kZS50eXBlID09PSAnaW5kZXgnO1xuZXhwb3J0IGNvbnN0IGlzYWdncmVnYXRlR3JvdXAgPSBub2RlID0+IGlzU29tZXRoaW5nKG5vZGUpICYmIG5vZGUudHlwZSA9PT0gJ2FnZ3JlZ2F0ZUdyb3VwJztcbmV4cG9ydCBjb25zdCBpc1NoYXJkZWRJbmRleCA9IG5vZGUgPT4gaXNJbmRleChub2RlKSAmJiBpc05vbkVtcHR5U3RyaW5nKG5vZGUuZ2V0U2hhcmROYW1lKTtcbmV4cG9ydCBjb25zdCBpc1Jvb3QgPSBub2RlID0+IGlzU29tZXRoaW5nKG5vZGUpICYmIG5vZGUuaXNSb290KCk7XG5leHBvcnQgY29uc3QgaXNEZWNlbmRhbnRPZkFSZWNvcmQgPSBoYXNNYXRjaGluZ0FuY2VzdG9yKGlzUmVjb3JkKTtcbmV4cG9ydCBjb25zdCBpc0dsb2JhbEluZGV4ID0gbm9kZSA9PiBpc0luZGV4KG5vZGUpICYmIGlzUm9vdChub2RlLnBhcmVudCgpKTtcbmV4cG9ydCBjb25zdCBpc1JlZmVyZW5jZUluZGV4ID0gbm9kZSA9PiBpc0luZGV4KG5vZGUpICYmIG5vZGUuaW5kZXhUeXBlID09PSBpbmRleFR5cGVzLnJlZmVyZW5jZTtcbmV4cG9ydCBjb25zdCBpc0FuY2VzdG9ySW5kZXggPSBub2RlID0+IGlzSW5kZXgobm9kZSkgJiYgbm9kZS5pbmRleFR5cGUgPT09IGluZGV4VHlwZXMuYW5jZXN0b3I7XG5cbmV4cG9ydCBjb25zdCBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlID0gbm9kZSA9PiBmaWVsZCA9PiBmaWVsZC50eXBlID09PSAncmVmZXJlbmNlJ1xuICAgICYmIGludGVyc2VjdGlvbihmaWVsZC50eXBlT3B0aW9ucy5yZXZlcnNlSW5kZXhOb2RlS2V5cykobWFwKGkgPT4gaS5ub2RlS2V5KCkpKG5vZGUuaW5kZXhlcykpXG4gICAgICAubGVuZ3RoID4gMDtcblxuZXhwb3J0IGNvbnN0IGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4ID0gaW5kZXhOb2RlID0+IGZpZWxkID0+IGZpZWxkLnR5cGUgPT09ICdyZWZlcmVuY2UnXG4gICAgJiYgaW50ZXJzZWN0aW9uKGZpZWxkLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzKShbaW5kZXhOb2RlLm5vZGVLZXkoKV0pXG4gICAgICAubGVuZ3RoID4gMDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXRMYXN0UGFydEluS2V5LFxuICBnZXROb2Rlc0luUGF0aCxcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcbiAgaGFzTWF0Y2hpbmdBbmNlc3RvcixcbiAgZ2V0Tm9kZSxcbiAgZ2V0Tm9kZUJ5S2V5T3JOb2RlS2V5LFxuICBpc05vZGUsXG4gIGdldEFjdHVhbEtleU9mUGFyZW50LFxuICBnZXRQYXJlbnRLZXksXG4gIGlzS2V5QW5jZXN0b3JPZixcbiAgaGFzTm9NYXRjaGluZ0FuY2VzdG9ycyxcbiAgZmluZEZpZWxkLFxuICBpc0FuY2VzdG9yLFxuICBpc0RlY2VuZGFudCxcbiAgZ2V0UmVjb3JkTm9kZUlkLFxuICBnZXRSZWNvcmROb2RlSWRGcm9tSWQsXG4gIGdldFJlY29yZE5vZGVCeUlkLFxuICByZWNvcmROb2RlSWRJc0FsbG93ZWQsXG4gIHJlY29yZE5vZGVJc0FsbG93ZWQsXG4gIGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4LFxuICBnZXROb2RlRnJvbU5vZGVLZXlIYXNoLFxuICBpc1JlY29yZCxcbiAgaXNDb2xsZWN0aW9uUmVjb3JkLFxuICBpc0luZGV4LFxuICBpc2FnZ3JlZ2F0ZUdyb3VwLFxuICBpc1NoYXJkZWRJbmRleCxcbiAgaXNSb290LFxuICBpc0RlY2VuZGFudE9mQVJlY29yZCxcbiAgaXNHbG9iYWxJbmRleCxcbiAgaXNSZWZlcmVuY2VJbmRleCxcbiAgaXNBbmNlc3RvckluZGV4LFxuICBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlLFxuICBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleCxcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxufTtcbiIsImltcG9ydCB7IG1lcmdlIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7XG4gIGNvbnN0YW50LCBpc1VuZGVmaW5lZCwgaGFzLFxuICBtYXBWYWx1ZXMsIGNsb25lRGVlcCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGlzTm90RW1wdHkgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZ2V0U2FmZUZpZWxkUGFyc2VyID0gKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpID0+IChmaWVsZCwgcmVjb3JkKSA9PiB7XG4gIGlmIChoYXMoZmllbGQubmFtZSkocmVjb3JkKSkge1xuICAgIHJldHVybiBnZXRTYWZlVmFsdWVQYXJzZXIodHJ5UGFyc2UsIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucykocmVjb3JkW2ZpZWxkLm5hbWVdKTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZhbHVlRnVuY3Rpb25zW2ZpZWxkLmdldFVuZGVmaW5lZFZhbHVlXSgpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFNhZmVWYWx1ZVBhcnNlciA9ICh0cnlQYXJzZSwgZGVmYXVsdFZhbHVlRnVuY3Rpb25zKSA9PiAodmFsdWUpID0+IHtcbiAgY29uc3QgcGFyc2VkID0gdHJ5UGFyc2UodmFsdWUpO1xuICBpZiAocGFyc2VkLnN1Y2Nlc3MpIHtcbiAgICByZXR1cm4gcGFyc2VkLnZhbHVlO1xuICB9XG4gIHJldHVybiBkZWZhdWx0VmFsdWVGdW5jdGlvbnMuZGVmYXVsdCgpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld1ZhbHVlID0gKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpID0+IChmaWVsZCkgPT4ge1xuICBjb25zdCBnZXRJbml0aWFsVmFsdWUgPSBpc1VuZGVmaW5lZChmaWVsZCkgfHwgaXNVbmRlZmluZWQoZmllbGQuZ2V0SW5pdGlhbFZhbHVlKVxuICAgID8gJ2RlZmF1bHQnXG4gICAgOiBmaWVsZC5nZXRJbml0aWFsVmFsdWU7XG5cbiAgcmV0dXJuIGhhcyhnZXRJbml0aWFsVmFsdWUpKGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucylcbiAgICA/IGRlZmF1bHRWYWx1ZUZ1bmN0aW9uc1tnZXRJbml0aWFsVmFsdWVdKClcbiAgICA6IGdldFNhZmVWYWx1ZVBhcnNlcih0cnlQYXJzZSwgZGVmYXVsdFZhbHVlRnVuY3Rpb25zKShnZXRJbml0aWFsVmFsdWUpO1xufTtcblxuZXhwb3J0IGNvbnN0IHR5cGVGdW5jdGlvbnMgPSBzcGVjaWZpY0Z1bmN0aW9ucyA9PiBtZXJnZSh7XG4gIHZhbHVlOiBjb25zdGFudCxcbiAgbnVsbDogY29uc3RhbnQobnVsbCksXG59LCBzcGVjaWZpY0Z1bmN0aW9ucyk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyA9IHZhbGlkYXRpb25SdWxlcyA9PiBhc3luYyAoZmllbGQsIHJlY29yZCwgY29udGV4dCkgPT4ge1xuICBjb25zdCBmaWVsZFZhbHVlID0gcmVjb3JkW2ZpZWxkLm5hbWVdO1xuICBjb25zdCB2YWxpZGF0ZVJ1bGUgPSBhc3luYyByID0+ICghYXdhaXQgci5pc1ZhbGlkKGZpZWxkVmFsdWUsIGZpZWxkLnR5cGVPcHRpb25zLCBjb250ZXh0KVxuICAgID8gci5nZXRNZXNzYWdlKGZpZWxkVmFsdWUsIGZpZWxkLnR5cGVPcHRpb25zKVxuICAgIDogJycpO1xuXG4gIGNvbnN0IGVycm9ycyA9IFtdO1xuICBmb3IgKGNvbnN0IHIgb2YgdmFsaWRhdGlvblJ1bGVzKSB7XG4gICAgY29uc3QgZXJyID0gYXdhaXQgdmFsaWRhdGVSdWxlKHIpO1xuICAgIGlmIChpc05vdEVtcHR5KGVycikpIGVycm9ycy5wdXNoKGVycik7XG4gIH1cblxuICByZXR1cm4gZXJyb3JzO1xufTtcblxuY29uc3QgZ2V0RGVmYXVsdE9wdGlvbnMgPSBtYXBWYWx1ZXModiA9PiB2LmRlZmF1bHRWYWx1ZSk7XG5cbmV4cG9ydCBjb25zdCBtYWtlcnVsZSA9IChpc1ZhbGlkLCBnZXRNZXNzYWdlKSA9PiAoeyBpc1ZhbGlkLCBnZXRNZXNzYWdlIH0pO1xuZXhwb3J0IGNvbnN0IHBhcnNlZEZhaWxlZCA9IHZhbCA9PiAoeyBzdWNjZXNzOiBmYWxzZSwgdmFsdWU6IHZhbCB9KTtcbmV4cG9ydCBjb25zdCBwYXJzZWRTdWNjZXNzID0gdmFsID0+ICh7IHN1Y2Nlc3M6IHRydWUsIHZhbHVlOiB2YWwgfSk7XG5leHBvcnQgY29uc3QgZ2V0RGVmYXVsdEV4cG9ydCA9IChuYW1lLCB0cnlQYXJzZSwgZnVuY3Rpb25zLCBvcHRpb25zLCB2YWxpZGF0aW9uUnVsZXMsIHNhbXBsZVZhbHVlLCBzdHJpbmdpZnkpID0+ICh7XG4gIGdldE5ldzogZ2V0TmV3VmFsdWUodHJ5UGFyc2UsIGZ1bmN0aW9ucyksXG4gIHNhZmVQYXJzZUZpZWxkOiBnZXRTYWZlRmllbGRQYXJzZXIodHJ5UGFyc2UsIGZ1bmN0aW9ucyksXG4gIHNhZmVQYXJzZVZhbHVlOiBnZXRTYWZlVmFsdWVQYXJzZXIodHJ5UGFyc2UsIGZ1bmN0aW9ucyksXG4gIHRyeVBhcnNlLFxuICBuYW1lLFxuICBnZXREZWZhdWx0T3B0aW9uczogKCkgPT4gZ2V0RGVmYXVsdE9wdGlvbnMoY2xvbmVEZWVwKG9wdGlvbnMpKSxcbiAgb3B0aW9uRGVmaW5pdGlvbnM6IG9wdGlvbnMsXG4gIHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzOiB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyh2YWxpZGF0aW9uUnVsZXMpLFxuICBzYW1wbGVWYWx1ZSxcbiAgc3RyaW5naWZ5OiB2YWwgPT4gKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZFxuICAgID8gJycgOiBzdHJpbmdpZnkodmFsKSksXG4gIGdldERlZmF1bHRWYWx1ZTogZnVuY3Rpb25zLmRlZmF1bHQsXG59KTtcbiIsImltcG9ydCB7XG4gIGNvbnN0YW50LCBpc1N0cmluZyxcbiAgaXNOdWxsLCBpbmNsdWRlcywgaXNCb29sZWFuLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgdHlwZUZ1bmN0aW9ucyxcbiAgbWFrZXJ1bGUsIHBhcnNlZFN1Y2Nlc3MsIGdldERlZmF1bHRFeHBvcnQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIHRvQm9vbE9yTnVsbCwgdG9OdW1iZXJPck51bGwsXG4gIGlzU2FmZUludGVnZXIsIGlzQXJyYXlPZlN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3Qgc3RyaW5nRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XG4gIGRlZmF1bHQ6IGNvbnN0YW50KG51bGwpLFxufSk7XG5cbmNvbnN0IHN0cmluZ1RyeVBhcnNlID0gc3dpdGNoQ2FzZShcbiAgW2lzU3RyaW5nLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXG4gIFtkZWZhdWx0Q2FzZSwgdiA9PiBwYXJzZWRTdWNjZXNzKHYudG9TdHJpbmcoKSldLFxuKTtcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgbWF4TGVuZ3RoOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICAgIGlzVmFsaWQ6IG4gPT4gbiA9PT0gbnVsbCB8fCBpc1NhZmVJbnRlZ2VyKG4pICYmIG4gPiAwLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtYXggbGVuZ3RoIG11c3QgYmUgbnVsbCAobm8gbGltaXQpIG9yIGEgZ3JlYXRlciB0aGFuIHplcm8gaW50ZWdlcicsXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxuICB9LFxuICB2YWx1ZXM6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgaXNWYWxpZDogdiA9PiB2ID09PSBudWxsIHx8IChpc0FycmF5T2ZTdHJpbmcodikgJiYgdi5sZW5ndGggPiAwICYmIHYubGVuZ3RoIDwgMTAwMDApLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246IFwiJ3ZhbHVlcycgbXVzdCBiZSBudWxsIChubyB2YWx1ZXMpIG9yIGFuIGFycnkgb2YgYXQgbGVhc3Qgb25lIHN0cmluZ1wiLFxuICAgIHBhcnNlOiBzID0+IHMsXG4gIH0sXG4gIGFsbG93RGVjbGFyZWRWYWx1ZXNPbmx5OiB7XG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICBpc1ZhbGlkOiBpc0Jvb2xlYW4sXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ2FsbG93RGVjbGFyZWRWYWx1ZXNPbmx5IG11c3QgYmUgdHJ1ZSBvciBmYWxzZScsXG4gICAgcGFyc2U6IHRvQm9vbE9yTnVsbCxcbiAgfSxcbn07XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWF4TGVuZ3RoID09PSBudWxsIHx8IHZhbC5sZW5ndGggPD0gb3B0cy5tYXhMZW5ndGgsXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlIGV4Y2VlZHMgbWF4aW11bSBsZW5ndGggb2YgJHtvcHRzLm1heExlbmd0aH1gKSxcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBvcHRzLmFsbG93RGVjbGFyZWRWYWx1ZXNPbmx5ID09PSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgaW5jbHVkZXModmFsKShvcHRzLnZhbHVlcyksXG4gICh2YWwpID0+IGBcIiR7dmFsfVwiIGRvZXMgbm90IGV4aXN0IGluIHRoZSBsaXN0IG9mIGFsbG93ZWQgdmFsdWVzYCksXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxuICAnc3RyaW5nJyxcbiAgc3RyaW5nVHJ5UGFyc2UsXG4gIHN0cmluZ0Z1bmN0aW9ucyxcbiAgb3B0aW9ucyxcbiAgdHlwZUNvbnN0cmFpbnRzLFxuICAnYWJjZGUnLFxuICBzdHIgPT4gc3RyLFxuKTtcbiIsImltcG9ydCB7IGNvbnN0YW50LCBpc0Jvb2xlYW4sIGlzTnVsbCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICB0eXBlRnVuY3Rpb25zLFxuICBtYWtlcnVsZSwgcGFyc2VkRmFpbGVkLCBwYXJzZWRTdWNjZXNzLFxuICBnZXREZWZhdWx0RXhwb3J0LFxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLCBpc09uZU9mLCB0b0Jvb2xPck51bGwsXG59IGZyb20gJy4uL2NvbW1vbic7XG5cbmNvbnN0IGJvb2xGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogY29uc3RhbnQobnVsbCksXG59KTtcblxuY29uc3QgYm9vbFRyeVBhcnNlID0gc3dpdGNoQ2FzZShcbiAgW2lzQm9vbGVhbiwgcGFyc2VkU3VjY2Vzc10sXG4gIFtpc051bGwsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNPbmVPZigndHJ1ZScsICcxJywgJ3llcycsICdvbicpLCAoKSA9PiBwYXJzZWRTdWNjZXNzKHRydWUpXSxcbiAgW2lzT25lT2YoJ2ZhbHNlJywgJzAnLCAnbm8nLCAnb2ZmJyksICgpID0+IHBhcnNlZFN1Y2Nlc3MoZmFsc2UpXSxcbiAgW2RlZmF1bHRDYXNlLCBwYXJzZWRGYWlsZWRdLFxuKTtcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgYWxsb3dOdWxsczoge1xuICAgIGRlZmF1bHRWYWx1ZTogdHJ1ZSxcbiAgICBpc1ZhbGlkOiBpc0Jvb2xlYW4sXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB0cnVlIG9yIGZhbHNlJyxcbiAgICBwYXJzZTogdG9Cb29sT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiBvcHRzLmFsbG93TnVsbHMgPT09IHRydWUgfHwgdmFsICE9PSBudWxsLFxuICAgICgpID0+ICdmaWVsZCBjYW5ub3QgYmUgbnVsbCcpLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcbiAgJ2Jvb2wnLCBib29sVHJ5UGFyc2UsIGJvb2xGdW5jdGlvbnMsXG4gIG9wdGlvbnMsIHR5cGVDb25zdHJhaW50cywgdHJ1ZSwgSlNPTi5zdHJpbmdpZnksXG4pO1xuIiwiaW1wb3J0IHtcbiAgY29uc3RhbnQsIGlzTnVtYmVyLCBpc1N0cmluZywgaXNOdWxsLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgbWFrZXJ1bGUsIHR5cGVGdW5jdGlvbnMsXG4gIHBhcnNlZEZhaWxlZCwgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9OdW1iZXJPck51bGwsXG4gIGlzU2FmZUludGVnZXIsXG59IGZyb20gJy4uL2NvbW1vbic7XG5cbmNvbnN0IG51bWJlckZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBjb25zdGFudChudWxsKSxcbn0pO1xuXG5jb25zdCBwYXJzZVN0cmluZ3RvTnVtYmVyT3JOdWxsID0gKHMpID0+IHtcbiAgY29uc3QgbnVtID0gTnVtYmVyKHMpO1xuICByZXR1cm4gaXNOYU4obnVtKSA/IHBhcnNlZEZhaWxlZChzKSA6IHBhcnNlZFN1Y2Nlc3MobnVtKTtcbn07XG5cbmNvbnN0IG51bWJlclRyeVBhcnNlID0gc3dpdGNoQ2FzZShcbiAgW2lzTnVtYmVyLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzU3RyaW5nLCBwYXJzZVN0cmluZ3RvTnVtYmVyT3JOdWxsXSxcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbik7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIG1heFZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUixcbiAgICBpc1ZhbGlkOiBpc1NhZmVJbnRlZ2VyLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgdmFsaWQgaW50ZWdlcicsXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxuICB9LFxuICBtaW5WYWx1ZToge1xuICAgIGRlZmF1bHRWYWx1ZTogMCAtIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICAgIGlzVmFsaWQ6IGlzU2FmZUludGVnZXIsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB2YWxpZCBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG4gIGRlY2ltYWxQbGFjZXM6IHtcbiAgICBkZWZhdWx0VmFsdWU6IDAsXG4gICAgaXNWYWxpZDogbiA9PiBpc1NhZmVJbnRlZ2VyKG4pICYmIG4gPj0gMCxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXInLFxuICAgIHBhcnNlOiB0b051bWJlck9yTnVsbCxcbiAgfSxcbn07XG5cbmNvbnN0IGdldERlY2ltYWxQbGFjZXMgPSAodmFsKSA9PiB7XG4gIGNvbnN0IHNwbGl0RGVjaW1hbCA9IHZhbC50b1N0cmluZygpLnNwbGl0KCcuJyk7XG4gIGlmIChzcGxpdERlY2ltYWwubGVuZ3RoID09PSAxKSByZXR1cm4gMDtcbiAgcmV0dXJuIHNwbGl0RGVjaW1hbFsxXS5sZW5ndGg7XG59O1xuXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCBvcHRzLm1pblZhbHVlID09PSBudWxsIHx8IHZhbCA+PSBvcHRzLm1pblZhbHVlLFxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSAoJHt2YWwudG9TdHJpbmcoKX0pIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvICR7b3B0cy5taW5WYWx1ZX1gKSxcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWF4VmFsdWUgPT09IG51bGwgfHwgdmFsIDw9IG9wdHMubWF4VmFsdWUsXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlICgke3ZhbC50b1N0cmluZygpfSkgbXVzdCBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gJHtvcHRzLm1pblZhbHVlfSBvcHRpb25zYCksXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCBvcHRzLmRlY2ltYWxQbGFjZXMgPj0gZ2V0RGVjaW1hbFBsYWNlcyh2YWwpLFxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSAoJHt2YWwudG9TdHJpbmcoKX0pIG11c3QgaGF2ZSAke29wdHMuZGVjaW1hbFBsYWNlc30gZGVjaW1hbCBwbGFjZXMgb3IgbGVzc2ApLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcbiAgJ251bWJlcicsXG4gIG51bWJlclRyeVBhcnNlLFxuICBudW1iZXJGdW5jdGlvbnMsXG4gIG9wdGlvbnMsXG4gIHR5cGVDb25zdHJhaW50cyxcbiAgMSxcbiAgbnVtID0+IG51bS50b1N0cmluZygpLFxuKTtcbiIsImltcG9ydCB7XG4gIGNvbnN0YW50LCBpc0RhdGUsIGlzU3RyaW5nLCBpc051bGxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIG1ha2VydWxlLCB0eXBlRnVuY3Rpb25zLFxuICBwYXJzZWRGYWlsZWQsIHBhcnNlZFN1Y2Nlc3MsIGdldERlZmF1bHRFeHBvcnQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIHRvRGF0ZU9yTnVsbCxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgZGF0ZUZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBjb25zdGFudChudWxsKSxcbiAgbm93OiAoKSA9PiBuZXcgRGF0ZSgpLFxufSk7XG5cbmNvbnN0IGlzVmFsaWREYXRlID0gZCA9PiBkIGluc3RhbmNlb2YgRGF0ZSAmJiAhaXNOYU4oZCk7XG5cbmNvbnN0IHBhcnNlU3RyaW5nVG9EYXRlID0gcyA9PiBzd2l0Y2hDYXNlKFxuICBbaXNWYWxpZERhdGUsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pKG5ldyBEYXRlKHMpKTtcblxuXG5jb25zdCBkYXRlVHJ5UGFyc2UgPSBzd2l0Y2hDYXNlKFxuICBbaXNEYXRlLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzU3RyaW5nLCBwYXJzZVN0cmluZ1RvRGF0ZV0sXG4gIFtpc051bGwsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBtYXhWYWx1ZToge1xuICAgIGRlZmF1bHRWYWx1ZTogbmV3IERhdGUoMzI1MDM2ODAwMDAwMDApLFxuICAgIGlzVmFsaWQ6IGlzRGF0ZSxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHZhbGlkIGRhdGUnLFxuICAgIHBhcnNlOiB0b0RhdGVPck51bGwsXG4gIH0sXG4gIG1pblZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBuZXcgRGF0ZSgtODUyMDMzNjAwMDAwMCksXG4gICAgaXNWYWxpZDogaXNEYXRlLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgdmFsaWQgZGF0ZScsXG4gICAgcGFyc2U6IHRvRGF0ZU9yTnVsbCxcbiAgfSxcbn07XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWluVmFsdWUgPT09IG51bGwgfHwgdmFsID49IG9wdHMubWluVmFsdWUsXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlICgke3ZhbC50b1N0cmluZygpfSkgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtvcHRzLm1pblZhbHVlfWApLFxuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5tYXhWYWx1ZSA9PT0gbnVsbCB8fCB2YWwgPD0gb3B0cy5tYXhWYWx1ZSxcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgKCR7dmFsLnRvU3RyaW5nKCl9KSBtdXN0IGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke29wdHMubWluVmFsdWV9IG9wdGlvbnNgKSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXG4gICdkYXRldGltZScsXG4gIGRhdGVUcnlQYXJzZSxcbiAgZGF0ZUZ1bmN0aW9ucyxcbiAgb3B0aW9ucyxcbiAgdHlwZUNvbnN0cmFpbnRzLFxuICBuZXcgRGF0ZSgxOTg0LCA0LCAxKSxcbiAgZGF0ZSA9PiBKU09OLnN0cmluZ2lmeShkYXRlKS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1wiJywgJ2cnKSwgJycpLFxuKTtcbiIsImltcG9ydCB7IFxuICBtYXAsICBjb25zdGFudCwgaXNBcnJheSBcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIHR5cGVGdW5jdGlvbnMsIG1ha2VydWxlLFxuICBwYXJzZWRGYWlsZWQsIGdldERlZmF1bHRFeHBvcnQsIHBhcnNlZFN1Y2Nlc3MsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIHRvTnVtYmVyT3JOdWxsLFxuICAkJCwgaXNTYWZlSW50ZWdlcixcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgYXJyYXlGdW5jdGlvbnMgPSAoKSA9PiB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogY29uc3RhbnQoW10pLFxufSk7XG5cbmNvbnN0IG1hcFRvUGFyc2VkQXJyYXJ5ID0gdHlwZSA9PiAkJChcbiAgbWFwKGkgPT4gdHlwZS5zYWZlUGFyc2VWYWx1ZShpKSksXG4gIHBhcnNlZFN1Y2Nlc3MsXG4pO1xuXG5jb25zdCBhcnJheVRyeVBhcnNlID0gdHlwZSA9PiBzd2l0Y2hDYXNlKFxuICBbaXNBcnJheSwgbWFwVG9QYXJzZWRBcnJhcnkodHlwZSldLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pO1xuXG5jb25zdCB0eXBlTmFtZSA9IHR5cGUgPT4gYGFycmF5PCR7dHlwZX0+YDtcblxuXG5jb25zdCBvcHRpb25zID0ge1xuICBtYXhMZW5ndGg6IHtcbiAgICBkZWZhdWx0VmFsdWU6IDEwMDAwLFxuICAgIGlzVmFsaWQ6IGlzU2FmZUludGVnZXIsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG4gIG1pbkxlbmd0aDoge1xuICAgIGRlZmF1bHRWYWx1ZTogMCxcbiAgICBpc1ZhbGlkOiBuID0+IGlzU2FmZUludGVnZXIobikgJiYgbiA+PSAwLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlcicsXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgdmFsLmxlbmd0aCA+PSBvcHRzLm1pbkxlbmd0aCxcbiAgICAodmFsLCBvcHRzKSA9PiBgbXVzdCBjaG9vc2UgJHtvcHRzLm1pbkxlbmd0aH0gb3IgbW9yZSBvcHRpb25zYCksXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCB2YWwubGVuZ3RoIDw9IG9wdHMubWF4TGVuZ3RoLFxuICAgICh2YWwsIG9wdHMpID0+IGBjYW5ub3QgY2hvb3NlIG1vcmUgdGhhbiAke29wdHMubWF4TGVuZ3RofSBvcHRpb25zYCksXG5dO1xuXG5leHBvcnQgZGVmYXVsdCB0eXBlID0+IGdldERlZmF1bHRFeHBvcnQoXG4gIHR5cGVOYW1lKHR5cGUubmFtZSksXG4gIGFycmF5VHJ5UGFyc2UodHlwZSksXG4gIGFycmF5RnVuY3Rpb25zKHR5cGUpLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gIFt0eXBlLnNhbXBsZVZhbHVlXSxcbiAgSlNPTi5zdHJpbmdpZnksXG4pO1xuIiwiaW1wb3J0IHtcbiAgaXNTdHJpbmcsIGlzT2JqZWN0TGlrZSxcbiAgaXNOdWxsLCBoYXMsIGlzRW1wdHksXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICB0eXBlRnVuY3Rpb25zLCBtYWtlcnVsZSxcbiAgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcbiAgcGFyc2VkRmFpbGVkLFxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLFxuICBpc05vbkVtcHR5U3RyaW5nLCBpc0FycmF5T2ZTdHJpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5cbmNvbnN0IHJlZmVyZW5jZU5vdGhpbmcgPSAoKSA9PiAoeyBrZXk6ICcnIH0pO1xuXG5jb25zdCByZWZlcmVuY2VGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogcmVmZXJlbmNlTm90aGluZyxcbn0pO1xuXG5jb25zdCBoYXNTdHJpbmdWYWx1ZSA9IChvYiwgcGF0aCkgPT4gaGFzKHBhdGgpKG9iKVxuICAgICYmIGlzU3RyaW5nKG9iW3BhdGhdKTtcblxuY29uc3QgaXNPYmplY3RXaXRoS2V5ID0gdiA9PiBpc09iamVjdExpa2UodilcbiAgICAmJiBoYXNTdHJpbmdWYWx1ZSh2LCAna2V5Jyk7XG5cbmNvbnN0IHRyeVBhcnNlRnJvbVN0cmluZyA9IHMgPT4ge1xuXG4gIHRyeSB7XG4gICAgY29uc3QgYXNPYmogPSBKU09OLnBhcnNlKHMpO1xuICAgIGlmKGlzT2JqZWN0V2l0aEtleSkge1xuICAgICAgcmV0dXJuIHBhcnNlZFN1Y2Nlc3MoYXNPYmopO1xuICAgIH1cbiAgfVxuICBjYXRjaChfKSB7XG4gICAgLy8gRU1QVFlcbiAgfVxuXG4gIHJldHVybiBwYXJzZWRGYWlsZWQocyk7XG59XG5cbmNvbnN0IHJlZmVyZW5jZVRyeVBhcnNlID0gdiA9PiBzd2l0Y2hDYXNlKFxuICBbaXNPYmplY3RXaXRoS2V5LCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzU3RyaW5nLCB0cnlQYXJzZUZyb21TdHJpbmddLFxuICBbaXNOdWxsLCAoKSA9PiBwYXJzZWRTdWNjZXNzKHJlZmVyZW5jZU5vdGhpbmcoKSldLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pKHYpO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBpbmRleE5vZGVLZXk6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgaXNWYWxpZDogaXNOb25FbXB0eVN0cmluZyxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnLFxuICAgIHBhcnNlOiBzID0+IHMsXG4gIH0sXG4gIGRpc3BsYXlWYWx1ZToge1xuICAgIGRlZmF1bHRWYWx1ZTogJycsXG4gICAgaXNWYWxpZDogaXNOb25FbXB0eVN0cmluZyxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnLFxuICAgIHBhcnNlOiBzID0+IHMsXG4gIH0sXG4gIHJldmVyc2VJbmRleE5vZGVLZXlzOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICAgIGlzVmFsaWQ6IHYgPT4gaXNBcnJheU9mU3RyaW5nKHYpICYmIHYubGVuZ3RoID4gMCxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIG5vbi1lbXB0eSBhcnJheSBvZiBzdHJpbmdzJyxcbiAgICBwYXJzZTogcyA9PiBzLFxuICB9LFxufTtcblxuY29uc3QgaXNFbXB0eVN0cmluZyA9IHMgPT4gaXNTdHJpbmcocykgJiYgaXNFbXB0eShzKTtcblxuY29uc3QgZW5zdXJlUmVmZXJlbmNlRXhpc3RzID0gYXN5bmMgKHZhbCwgb3B0cywgY29udGV4dCkgPT4gaXNFbXB0eVN0cmluZyh2YWwua2V5KVxuICAgIHx8IGF3YWl0IGNvbnRleHQucmVmZXJlbmNlRXhpc3RzKG9wdHMsIHZhbC5rZXkpO1xuXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXG4gIG1ha2VydWxlKFxuICAgIGVuc3VyZVJlZmVyZW5jZUV4aXN0cyxcbiAgICAodmFsLCBvcHRzKSA9PiBgXCIke3ZhbFtvcHRzLmRpc3BsYXlWYWx1ZV19XCIgZG9lcyBub3QgZXhpc3QgaW4gb3B0aW9ucyBsaXN0IChrZXk6ICR7dmFsLmtleX0pYCxcbiAgKSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXG4gICdyZWZlcmVuY2UnLFxuICByZWZlcmVuY2VUcnlQYXJzZSxcbiAgcmVmZXJlbmNlRnVuY3Rpb25zLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gIHsga2V5OiAna2V5JywgdmFsdWU6ICd2YWx1ZScgfSxcbiAgSlNPTi5zdHJpbmdpZnksXG4pO1xuIiwiaW1wb3J0IHtcbiAgbGFzdCwgaGFzLCBpc1N0cmluZywgaW50ZXJzZWN0aW9uLFxuICBpc051bGwsIGlzTnVtYmVyLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgdHlwZUZ1bmN0aW9ucywgcGFyc2VkRmFpbGVkLFxuICBwYXJzZWRTdWNjZXNzLCBnZXREZWZhdWx0RXhwb3J0LFxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLCBub25lLFxuICAkLCBzcGxpdEtleSxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgaWxsZWdhbENoYXJhY3RlcnMgPSAnKj9cXFxcLzo8PnxcXDBcXGJcXGZcXHYnO1xuXG5leHBvcnQgY29uc3QgaXNMZWdhbEZpbGVuYW1lID0gKGZpbGVQYXRoKSA9PiB7XG4gIGNvbnN0IGZuID0gZmlsZU5hbWUoZmlsZVBhdGgpO1xuICByZXR1cm4gZm4ubGVuZ3RoIDw9IDI1NVxuICAgICYmIGludGVyc2VjdGlvbihmbi5zcGxpdCgnJykpKGlsbGVnYWxDaGFyYWN0ZXJzLnNwbGl0KCcnKSkubGVuZ3RoID09PSAwXG4gICAgJiYgbm9uZShmID0+IGYgPT09ICcuLicpKHNwbGl0S2V5KGZpbGVQYXRoKSk7XG59O1xuXG5jb25zdCBmaWxlTm90aGluZyA9ICgpID0+ICh7IHJlbGF0aXZlUGF0aDogJycsIHNpemU6IDAgfSk7XG5cbmNvbnN0IGZpbGVGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogZmlsZU5vdGhpbmcsXG59KTtcblxuY29uc3QgZmlsZVRyeVBhcnNlID0gdiA9PiBzd2l0Y2hDYXNlKFxuICBbaXNWYWxpZEZpbGUsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNOdWxsLCAoKSA9PiBwYXJzZWRTdWNjZXNzKGZpbGVOb3RoaW5nKCkpXSxcbiAgW2RlZmF1bHRDYXNlLCBwYXJzZWRGYWlsZWRdLFxuKSh2KTtcblxuY29uc3QgZmlsZU5hbWUgPSBmaWxlUGF0aCA9PiAkKGZpbGVQYXRoLCBbXG4gIHNwbGl0S2V5LFxuICBsYXN0LFxuXSk7XG5cbmNvbnN0IGlzVmFsaWRGaWxlID0gZiA9PiAhaXNOdWxsKGYpXG4gICAgJiYgaGFzKCdyZWxhdGl2ZVBhdGgnKShmKSAmJiBoYXMoJ3NpemUnKShmKVxuICAgICYmIGlzTnVtYmVyKGYuc2l6ZSlcbiAgICAmJiBpc1N0cmluZyhmLnJlbGF0aXZlUGF0aClcbiAgICAmJiBpc0xlZ2FsRmlsZW5hbWUoZi5yZWxhdGl2ZVBhdGgpO1xuXG5jb25zdCBvcHRpb25zID0ge307XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtdO1xuXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxuICAnZmlsZScsXG4gIGZpbGVUcnlQYXJzZSxcbiAgZmlsZUZ1bmN0aW9ucyxcbiAgb3B0aW9ucyxcbiAgdHlwZUNvbnN0cmFpbnRzLFxuICB7IHJlbGF0aXZlUGF0aDogJ3NvbWVfZmlsZS5qcGcnLCBzaXplOiAxMDAwIH0sXG4gIEpTT04uc3RyaW5naWZ5LFxuKTtcbiIsImltcG9ydCB7XG4gIGFzc2lnbiwgbWVyZ2UsIFxufSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgbWFwLCBpc1N0cmluZywgaXNOdW1iZXIsXG4gIGlzQm9vbGVhbiwgaXNEYXRlLCBrZXlzLFxuICBpc09iamVjdCwgaXNBcnJheSwgaGFzXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBhcnNlZFN1Y2Nlc3MgfSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCBzdHJpbmcgZnJvbSAnLi9zdHJpbmcnO1xuaW1wb3J0IGJvb2wgZnJvbSAnLi9ib29sJztcbmltcG9ydCBudW1iZXIgZnJvbSAnLi9udW1iZXInO1xuaW1wb3J0IGRhdGV0aW1lIGZyb20gJy4vZGF0ZXRpbWUnO1xuaW1wb3J0IGFycmF5IGZyb20gJy4vYXJyYXknO1xuaW1wb3J0IHJlZmVyZW5jZSBmcm9tICcuL3JlZmVyZW5jZSc7XG5pbXBvcnQgZmlsZSBmcm9tICcuL2ZpbGUnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmNvbnN0IGFsbFR5cGVzID0gKCkgPT4ge1xuICBjb25zdCBiYXNpY1R5cGVzID0ge1xuICAgIHN0cmluZywgbnVtYmVyLCBkYXRldGltZSwgYm9vbCwgcmVmZXJlbmNlLCBmaWxlLFxuICB9O1xuXG4gIGNvbnN0IGFycmF5cyA9ICQoYmFzaWNUeXBlcywgW1xuICAgIGtleXMsXG4gICAgbWFwKChrKSA9PiB7XG4gICAgICBjb25zdCBrdlR5cGUgPSB7fTtcbiAgICAgIGNvbnN0IGNvbmNyZXRlQXJyYXkgPSBhcnJheShiYXNpY1R5cGVzW2tdKTtcbiAgICAgIGt2VHlwZVtjb25jcmV0ZUFycmF5Lm5hbWVdID0gY29uY3JldGVBcnJheTtcbiAgICAgIHJldHVybiBrdlR5cGU7XG4gICAgfSksXG4gICAgdHlwZXMgPT4gYXNzaWduKHt9LCAuLi50eXBlcyksXG4gIF0pO1xuXG4gIHJldHVybiBtZXJnZSh7fSwgYmFzaWNUeXBlcywgYXJyYXlzKTtcbn07XG5cblxuZXhwb3J0IGNvbnN0IGFsbCA9IGFsbFR5cGVzKCk7XG5cbmV4cG9ydCBjb25zdCBnZXRUeXBlID0gKHR5cGVOYW1lKSA9PiB7XG4gIGlmICghaGFzKHR5cGVOYW1lKShhbGwpKSB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBEbyBub3QgcmVjb2duaXNlIHR5cGUgJHt0eXBlTmFtZX1gKTtcbiAgcmV0dXJuIGFsbFt0eXBlTmFtZV07XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U2FtcGxlRmllbGRWYWx1ZSA9IGZpZWxkID0+IGdldFR5cGUoZmllbGQudHlwZSkuc2FtcGxlVmFsdWU7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdGaWVsZFZhbHVlID0gZmllbGQgPT4gZ2V0VHlwZShmaWVsZC50eXBlKS5nZXROZXcoZmllbGQpO1xuXG5leHBvcnQgY29uc3Qgc2FmZVBhcnNlRmllbGQgPSAoZmllbGQsIHJlY29yZCkgPT4gZ2V0VHlwZShmaWVsZC50eXBlKS5zYWZlUGFyc2VGaWVsZChmaWVsZCwgcmVjb3JkKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlRmllbGRQYXJzZSA9IChmaWVsZCwgcmVjb3JkKSA9PiAoaGFzKGZpZWxkLm5hbWUpKHJlY29yZClcbiAgPyBnZXRUeXBlKGZpZWxkLnR5cGUpLnRyeVBhcnNlKHJlY29yZFtmaWVsZC5uYW1lXSlcbiAgOiBwYXJzZWRTdWNjZXNzKHVuZGVmaW5lZCkpOyAvLyBmaWVsZHMgbWF5IGJlIHVuZGVmaW5lZCBieSBkZWZhdWx0XG5cbmV4cG9ydCBjb25zdCBnZXREZWZhdWx0T3B0aW9ucyA9IHR5cGUgPT4gZ2V0VHlwZSh0eXBlKS5nZXREZWZhdWx0T3B0aW9ucygpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVUeXBlQ29uc3RyYWludHMgPSBhc3luYyAoZmllbGQsIHJlY29yZCwgY29udGV4dCkgPT4gYXdhaXQgZ2V0VHlwZShmaWVsZC50eXBlKS52YWxpZGF0ZVR5cGVDb25zdHJhaW50cyhmaWVsZCwgcmVjb3JkLCBjb250ZXh0KTtcblxuZXhwb3J0IGNvbnN0IGRldGVjdFR5cGUgPSAodmFsdWUpID0+IHtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkgcmV0dXJuIHN0cmluZztcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpIHJldHVybiBib29sO1xuICBpZiAoaXNOdW1iZXIodmFsdWUpKSByZXR1cm4gbnVtYmVyO1xuICBpZiAoaXNEYXRlKHZhbHVlKSkgcmV0dXJuIGRhdGV0aW1lO1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHJldHVybiBhcnJheShkZXRlY3RUeXBlKHZhbHVlWzBdKSk7XG4gIGlmIChpc09iamVjdCh2YWx1ZSlcbiAgICAgICAmJiBoYXMoJ2tleScpKHZhbHVlKVxuICAgICAgICYmIGhhcygndmFsdWUnKSh2YWx1ZSkpIHJldHVybiByZWZlcmVuY2U7XG4gIGlmIChpc09iamVjdCh2YWx1ZSlcbiAgICAgICAgJiYgaGFzKCdyZWxhdGl2ZVBhdGgnKSh2YWx1ZSlcbiAgICAgICAgJiYgaGFzKCdzaXplJykodmFsdWUpKSByZXR1cm4gZmlsZTtcblxuICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBjYW5ub3QgZGV0ZXJtaW5lIHR5cGU6ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWApO1xufTtcbiIsImltcG9ydCB7IGNsb25lLCBmaW5kLCBzcGxpdCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBqb2luS2V5LCAkIH0gZnJvbSAnLi4vY29tbW9uJztcbi8vIDUgbWludXRlc1xuZXhwb3J0IGNvbnN0IHRlbXBDb2RlRXhwaXJ5TGVuZ3RoID0gNSAqIDYwICogMTAwMDtcblxuZXhwb3J0IGNvbnN0IEFVVEhfRk9MREVSID0gJy8uYXV0aCc7XG5leHBvcnQgY29uc3QgVVNFUlNfTElTVF9GSUxFID0gam9pbktleShBVVRIX0ZPTERFUiwgJ3VzZXJzLmpzb24nKTtcbmV4cG9ydCBjb25zdCB1c2VyQXV0aEZpbGUgPSB1c2VybmFtZSA9PiBqb2luS2V5KEFVVEhfRk9MREVSLCBgYXV0aF8ke3VzZXJuYW1lfS5qc29uYCk7XG5leHBvcnQgY29uc3QgVVNFUlNfTE9DS19GSUxFID0gam9pbktleShBVVRIX0ZPTERFUiwgJ3VzZXJzX2xvY2snKTtcbmV4cG9ydCBjb25zdCBBQ0NFU1NfTEVWRUxTX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAnYWNjZXNzX2xldmVscy5qc29uJyk7XG5leHBvcnQgY29uc3QgQUNDRVNTX0xFVkVMU19MT0NLX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAnYWNjZXNzX2xldmVsc19sb2NrJyk7XG5cbmV4cG9ydCBjb25zdCBwZXJtaXNzaW9uVHlwZXMgPSB7XG4gIENSRUFURV9SRUNPUkQ6ICdjcmVhdGUgcmVjb3JkJyxcbiAgVVBEQVRFX1JFQ09SRDogJ3VwZGF0ZSByZWNvcmQnLFxuICBSRUFEX1JFQ09SRDogJ3JlYWQgcmVjb3JkJyxcbiAgREVMRVRFX1JFQ09SRDogJ2RlbGV0ZSByZWNvcmQnLFxuICBSRUFEX0lOREVYOiAncmVhZCBpbmRleCcsXG4gIE1BTkFHRV9JTkRFWDogJ21hbmFnZSBpbmRleCcsXG4gIE1BTkFHRV9DT0xMRUNUSU9OOiAnbWFuYWdlIGNvbGxlY3Rpb24nLFxuICBXUklURV9URU1QTEFURVM6ICd3cml0ZSB0ZW1wbGF0ZXMnLFxuICBDUkVBVEVfVVNFUjogJ2NyZWF0ZSB1c2VyJyxcbiAgU0VUX1BBU1NXT1JEOiAnc2V0IHBhc3N3b3JkJyxcbiAgQ1JFQVRFX1RFTVBPUkFSWV9BQ0NFU1M6ICdjcmVhdGUgdGVtcG9yYXJ5IGFjY2VzcycsXG4gIEVOQUJMRV9ESVNBQkxFX1VTRVI6ICdlbmFibGUgb3IgZGlzYWJsZSB1c2VyJyxcbiAgV1JJVEVfQUNDRVNTX0xFVkVMUzogJ3dyaXRlIGFjY2VzcyBsZXZlbHMnLFxuICBMSVNUX1VTRVJTOiAnbGlzdCB1c2VycycsXG4gIExJU1RfQUNDRVNTX0xFVkVMUzogJ2xpc3QgYWNjZXNzIGxldmVscycsXG4gIEVYRUNVVEVfQUNUSU9OOiAnZXhlY3V0ZSBhY3Rpb24nLFxuICBTRVRfVVNFUl9BQ0NFU1NfTEVWRUxTOiAnc2V0IHVzZXIgYWNjZXNzIGxldmVscycsXG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VXNlckJ5TmFtZSA9ICh1c2VycywgbmFtZSkgPT4gJCh1c2VycywgW1xuICBmaW5kKHUgPT4gdS5uYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUudG9Mb3dlckNhc2UoKSksXG5dKTtcblxuZXhwb3J0IGNvbnN0IHN0cmlwVXNlck9mU2Vuc2l0aXZlU3R1ZmYgPSAodXNlcikgPT4ge1xuICBjb25zdCBzdHJpcHBlZCA9IGNsb25lKHVzZXIpO1xuICBkZWxldGUgc3RyaXBwZWQudGVtcENvZGU7XG4gIHJldHVybiBzdHJpcHBlZDtcbn07XG5cbmV4cG9ydCBjb25zdCBwYXJzZVRlbXBvcmFyeUNvZGUgPSBmdWxsQ29kZSA9PiAkKGZ1bGxDb2RlLCBbXG4gIHNwbGl0KCc6JyksXG4gIHBhcnRzID0+ICh7XG4gICAgaWQ6IHBhcnRzWzFdLFxuICAgIGNvZGU6IHBhcnRzWzJdLFxuICB9KSxcbl0pO1xuIiwiaW1wb3J0IHsgdmFsdWVzLCBpbmNsdWRlcywgc29tZSB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uVHlwZXMgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHtcbiAgJCwgaXNOb3RoaW5nLCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0Tm9kZUJ5S2V5T3JOb2RlS2V5LCBpc05vZGUgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgaXNBdXRob3JpemVkID0gYXBwID0+IChwZXJtaXNzaW9uVHlwZSwgcmVzb3VyY2VLZXkpID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmlzQXV0aG9yaXplZCxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyByZXNvdXJjZUtleSwgcGVybWlzc2lvblR5cGUgfSxcbiAgX2lzQXV0aG9yaXplZCwgYXBwLCBwZXJtaXNzaW9uVHlwZSwgcmVzb3VyY2VLZXksXG4pO1xuXG5leHBvcnQgY29uc3QgX2lzQXV0aG9yaXplZCA9IChhcHAsIHBlcm1pc3Npb25UeXBlLCByZXNvdXJjZUtleSkgPT4ge1xuICBpZiAoIWFwcC51c2VyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgdmFsaWRUeXBlID0gJChwZXJtaXNzaW9uVHlwZXMsIFtcbiAgICB2YWx1ZXMsXG4gICAgaW5jbHVkZXMocGVybWlzc2lvblR5cGUpLFxuICBdKTtcblxuICBpZiAoIXZhbGlkVHlwZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHBlcm1NYXRjaGVzUmVzb3VyY2UgPSAodXNlcnBlcm0pID0+IHtcbiAgICBjb25zdCBub2RlS2V5ID0gaXNOb3RoaW5nKHJlc291cmNlS2V5KVxuICAgICAgPyBudWxsXG4gICAgICA6IGlzTm9kZShhcHAuaGllcmFyY2h5LCByZXNvdXJjZUtleSlcbiAgICAgICAgPyBnZXROb2RlQnlLZXlPck5vZGVLZXkoXG4gICAgICAgICAgYXBwLmhpZXJhcmNoeSwgcmVzb3VyY2VLZXksXG4gICAgICAgICkubm9kZUtleSgpXG4gICAgICAgIDogcmVzb3VyY2VLZXk7XG5cbiAgICByZXR1cm4gKHVzZXJwZXJtLnR5cGUgPT09IHBlcm1pc3Npb25UeXBlKVxuICAgICAgICAmJiAoXG4gICAgICAgICAgaXNOb3RoaW5nKHJlc291cmNlS2V5KVxuICAgICAgICAgICAgfHwgbm9kZUtleSA9PT0gdXNlcnBlcm0ubm9kZUtleVxuICAgICAgICApO1xuICB9O1xuXG4gIHJldHVybiAkKGFwcC51c2VyLnBlcm1pc3Npb25zLCBbXG4gICAgc29tZShwZXJtTWF0Y2hlc1Jlc291cmNlKSxcbiAgXSk7XG59O1xuIiwiaW1wb3J0IHsgcGVybWlzc2lvblR5cGVzIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7IGlzQXV0aG9yaXplZCB9IGZyb20gJy4vaXNBdXRob3JpemVkJztcblxuZXhwb3J0IGNvbnN0IHRlbXBvcmFyeUFjY2Vzc1Blcm1pc3Npb25zID0gKCkgPT4gKFt7IHR5cGU6IHBlcm1pc3Npb25UeXBlcy5TRVRfUEFTU1dPUkQgfV0pO1xuXG5jb25zdCBub2RlUGVybWlzc2lvbiA9IHR5cGUgPT4gKHtcbiAgYWRkOiAobm9kZUtleSwgYWNjZXNzTGV2ZWwpID0+IGFjY2Vzc0xldmVsLnBlcm1pc3Npb25zLnB1c2goeyB0eXBlLCBub2RlS2V5IH0pLFxuICBpc0F1dGhvcml6ZWQ6IHJlc291cmNlS2V5ID0+IGFwcCA9PiBpc0F1dGhvcml6ZWQoYXBwKSh0eXBlLCByZXNvdXJjZUtleSksXG4gIGlzTm9kZTogdHJ1ZSxcbiAgZ2V0OiBub2RlS2V5ID0+ICh7IHR5cGUsIG5vZGVLZXkgfSksXG59KTtcblxuY29uc3Qgc3RhdGljUGVybWlzc2lvbiA9IHR5cGUgPT4gKHtcbiAgYWRkOiBhY2Nlc3NMZXZlbCA9PiBhY2Nlc3NMZXZlbC5wZXJtaXNzaW9ucy5wdXNoKHsgdHlwZSB9KSxcbiAgaXNBdXRob3JpemVkOiBhcHAgPT4gaXNBdXRob3JpemVkKGFwcCkodHlwZSksXG4gIGlzTm9kZTogZmFsc2UsXG4gIGdldDogKCkgPT4gKHsgdHlwZSB9KSxcbn0pO1xuXG5jb25zdCBjcmVhdGVSZWNvcmQgPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuQ1JFQVRFX1JFQ09SRCk7XG5cbmNvbnN0IHVwZGF0ZVJlY29yZCA9IG5vZGVQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5VUERBVEVfUkVDT1JEKTtcblxuY29uc3QgZGVsZXRlUmVjb3JkID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkRFTEVURV9SRUNPUkQpO1xuXG5jb25zdCByZWFkUmVjb3JkID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlJFQURfUkVDT1JEKTtcblxuY29uc3Qgd3JpdGVUZW1wbGF0ZXMgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5XUklURV9URU1QTEFURVMpO1xuXG5jb25zdCBjcmVhdGVVc2VyID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuQ1JFQVRFX1VTRVIpO1xuXG5jb25zdCBzZXRQYXNzd29yZCA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlNFVF9QQVNTV09SRCk7XG5cbmNvbnN0IHJlYWRJbmRleCA9IG5vZGVQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5SRUFEX0lOREVYKTtcblxuY29uc3QgbWFuYWdlSW5kZXggPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5NQU5BR0VfSU5ERVgpO1xuXG5jb25zdCBtYW5hZ2VDb2xsZWN0aW9uID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuTUFOQUdFX0NPTExFQ1RJT04pO1xuXG5jb25zdCBjcmVhdGVUZW1wb3JhcnlBY2Nlc3MgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfVEVNUE9SQVJZX0FDQ0VTUyk7XG5cbmNvbnN0IGVuYWJsZURpc2FibGVVc2VyID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuRU5BQkxFX0RJU0FCTEVfVVNFUik7XG5cbmNvbnN0IHdyaXRlQWNjZXNzTGV2ZWxzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuV1JJVEVfQUNDRVNTX0xFVkVMUyk7XG5cbmNvbnN0IGxpc3RVc2VycyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkxJU1RfVVNFUlMpO1xuXG5jb25zdCBsaXN0QWNjZXNzTGV2ZWxzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuTElTVF9BQ0NFU1NfTEVWRUxTKTtcblxuY29uc3Qgc2V0VXNlckFjY2Vzc0xldmVscyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlNFVF9VU0VSX0FDQ0VTU19MRVZFTFMpO1xuXG5jb25zdCBleGVjdXRlQWN0aW9uID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkVYRUNVVEVfQUNUSU9OKTtcblxuZXhwb3J0IGNvbnN0IGFsd2F5c0F1dGhvcml6ZWQgPSAoKSA9PiB0cnVlO1xuXG5leHBvcnQgY29uc3QgcGVybWlzc2lvbiA9IHtcbiAgY3JlYXRlUmVjb3JkLFxuICB1cGRhdGVSZWNvcmQsXG4gIGRlbGV0ZVJlY29yZCxcbiAgcmVhZFJlY29yZCxcbiAgd3JpdGVUZW1wbGF0ZXMsXG4gIGNyZWF0ZVVzZXIsXG4gIHNldFBhc3N3b3JkLFxuICByZWFkSW5kZXgsXG4gIGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyxcbiAgZW5hYmxlRGlzYWJsZVVzZXIsXG4gIHdyaXRlQWNjZXNzTGV2ZWxzLFxuICBsaXN0VXNlcnMsXG4gIGxpc3RBY2Nlc3NMZXZlbHMsXG4gIG1hbmFnZUluZGV4LFxuICBtYW5hZ2VDb2xsZWN0aW9uLFxuICBleGVjdXRlQWN0aW9uLFxuICBzZXRVc2VyQWNjZXNzTGV2ZWxzLFxufTtcbiIsImltcG9ydCB7XG4gIGtleUJ5LCBtYXBWYWx1ZXMsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHsgXG4gIGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aCwgaXNTaW5nbGVSZWNvcmQgXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBnZXROZXdGaWVsZFZhbHVlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtcbiAgJCwgam9pbktleSwgc2FmZUtleSwgYXBpV3JhcHBlclN5bmMsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGdldE5ldyA9IGFwcCA9PiAoY29sbGVjdGlvbktleSwgcmVjb3JkVHlwZU5hbWUpID0+IHtcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldFJlY29yZE5vZGUoYXBwLCBjb2xsZWN0aW9uS2V5LCByZWNvcmRUeXBlTmFtZSk7XG4gIGNvbGxlY3Rpb25LZXk9c2FmZUtleShjb2xsZWN0aW9uS2V5KTtcbiAgcmV0dXJuIGFwaVdyYXBwZXJTeW5jKFxuICAgIGFwcCxcbiAgICBldmVudHMucmVjb3JkQXBpLmdldE5ldyxcbiAgICBwZXJtaXNzaW9uLmNyZWF0ZVJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkTm9kZS5ub2RlS2V5KCkpLFxuICAgIHsgY29sbGVjdGlvbktleSwgcmVjb3JkVHlwZU5hbWUgfSxcbiAgICBfZ2V0TmV3LCByZWNvcmROb2RlLCBjb2xsZWN0aW9uS2V5LFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IF9nZXROZXcgPSAocmVjb3JkTm9kZSwgY29sbGVjdGlvbktleSkgPT4gY29uc3RydWN0UmVjb3JkKHJlY29yZE5vZGUsIGdldE5ld0ZpZWxkVmFsdWUsIGNvbGxlY3Rpb25LZXkpO1xuXG5jb25zdCBnZXRSZWNvcmROb2RlID0gKGFwcCwgY29sbGVjdGlvbktleSkgPT4ge1xuICBjb2xsZWN0aW9uS2V5ID0gc2FmZUtleShjb2xsZWN0aW9uS2V5KTtcbiAgcmV0dXJuIGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHAuaGllcmFyY2h5KShjb2xsZWN0aW9uS2V5KTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXROZXdDaGlsZCA9IGFwcCA9PiAocmVjb3JkS2V5LCBjb2xsZWN0aW9uTmFtZSwgcmVjb3JkVHlwZU5hbWUpID0+IFxuICBnZXROZXcoYXBwKShqb2luS2V5KHJlY29yZEtleSwgY29sbGVjdGlvbk5hbWUpLCByZWNvcmRUeXBlTmFtZSk7XG5cbmV4cG9ydCBjb25zdCBjb25zdHJ1Y3RSZWNvcmQgPSAocmVjb3JkTm9kZSwgZ2V0RmllbGRWYWx1ZSwgY29sbGVjdGlvbktleSkgPT4ge1xuICBjb25zdCByZWNvcmQgPSAkKHJlY29yZE5vZGUuZmllbGRzLCBbXG4gICAga2V5QnkoJ25hbWUnKSxcbiAgICBtYXBWYWx1ZXMoZ2V0RmllbGRWYWx1ZSksXG4gIF0pO1xuXG4gIHJlY29yZC5pZCA9IGAke3JlY29yZE5vZGUubm9kZUlkfS0ke2dlbmVyYXRlKCl9YDtcbiAgcmVjb3JkLmtleSA9IGlzU2luZ2xlUmVjb3JkKHJlY29yZE5vZGUpXG4gICAgICAgICAgICAgICA/IGpvaW5LZXkoY29sbGVjdGlvbktleSwgcmVjb3JkTm9kZS5uYW1lKVxuICAgICAgICAgICAgICAgOiBqb2luS2V5KGNvbGxlY3Rpb25LZXksIHJlY29yZC5pZCk7XG4gIHJlY29yZC5pc05ldyA9IHRydWU7XG4gIHJlY29yZC50eXBlID0gcmVjb3JkTm9kZS5uYW1lO1xuICByZXR1cm4gcmVjb3JkO1xufTtcbiIsImltcG9ydCB7XG4gIGtleUJ5LCBtYXBWYWx1ZXMsIGZpbHRlciwgXG4gIG1hcCwgaW5jbHVkZXMsIGxhc3QsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZXRFeGFjdE5vZGVGb3JQYXRoLCBnZXROb2RlIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IHNhZmVQYXJzZUZpZWxkIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtcbiAgJCwgc3BsaXRLZXksIHNhZmVLZXksIGlzTm9uRW1wdHlTdHJpbmcsXG4gIGFwaVdyYXBwZXIsIGV2ZW50cywgam9pbktleSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IG1hcFJlY29yZCB9IGZyb20gJy4uL2luZGV4aW5nL2V2YWx1YXRlJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGdldFJlY29yZEZpbGVOYW1lID0ga2V5ID0+IGpvaW5LZXkoa2V5LCAncmVjb3JkLmpzb24nKTtcblxuZXhwb3J0IGNvbnN0IGxvYWQgPSBhcHAgPT4gYXN5bmMga2V5ID0+IHtcbiAga2V5ID0gc2FmZUtleShrZXkpO1xuICByZXR1cm4gYXBpV3JhcHBlcihcbiAgICBhcHAsXG4gICAgZXZlbnRzLnJlY29yZEFwaS5sb2FkLFxuICAgIHBlcm1pc3Npb24ucmVhZFJlY29yZC5pc0F1dGhvcml6ZWQoa2V5KSxcbiAgICB7IGtleSB9LFxuICAgIF9sb2FkLCBhcHAsIGtleSxcbiAgKTtcbn1cblxuZXhwb3J0IGNvbnN0IF9sb2FkID0gYXN5bmMgKGFwcCwga2V5LCBrZXlTdGFjayA9IFtdKSA9PiB7XG4gIGtleSA9IHNhZmVLZXkoa2V5KTtcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoa2V5KTtcbiAgY29uc3Qgc3RvcmVkRGF0YSA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgZ2V0UmVjb3JkRmlsZU5hbWUoa2V5KSxcbiAgKTtcblxuICBjb25zdCBsb2FkZWRSZWNvcmQgPSAkKHJlY29yZE5vZGUuZmllbGRzLCBbXG4gICAga2V5QnkoJ25hbWUnKSxcbiAgICBtYXBWYWx1ZXMoZiA9PiBzYWZlUGFyc2VGaWVsZChmLCBzdG9yZWREYXRhKSksXG4gIF0pO1xuXG4gIGNvbnN0IG5ld0tleVN0YWNrID0gWy4uLmtleVN0YWNrLCBrZXldO1xuXG4gIGNvbnN0IHJlZmVyZW5jZXMgPSAkKHJlY29yZE5vZGUuZmllbGRzLCBbXG4gICAgZmlsdGVyKGYgPT4gZi50eXBlID09PSAncmVmZXJlbmNlJ1xuICAgICAgICAgICAgICAgICAgICAmJiBpc05vbkVtcHR5U3RyaW5nKGxvYWRlZFJlY29yZFtmLm5hbWVdLmtleSlcbiAgICAgICAgICAgICAgICAgICAgJiYgIWluY2x1ZGVzKGxvYWRlZFJlY29yZFtmLm5hbWVdLmtleSkobmV3S2V5U3RhY2spKSxcbiAgICBtYXAoZiA9PiAoe1xuICAgICAgcHJvbWlzZTogX2xvYWQoYXBwLCBsb2FkZWRSZWNvcmRbZi5uYW1lXS5rZXksIG5ld0tleVN0YWNrKSxcbiAgICAgIGluZGV4OiBnZXROb2RlKGFwcC5oaWVyYXJjaHksIGYudHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5KSxcbiAgICAgIGZpZWxkOiBmLFxuICAgIH0pKSxcbiAgXSk7XG5cbiAgaWYgKHJlZmVyZW5jZXMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IHJlZlJlY29yZHMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIG1hcChwID0+IHAucHJvbWlzZSkocmVmZXJlbmNlcyksXG4gICAgKTtcblxuICAgIGZvciAoY29uc3QgcmVmIG9mIHJlZmVyZW5jZXMpIHtcbiAgICAgIGxvYWRlZFJlY29yZFtyZWYuZmllbGQubmFtZV0gPSBtYXBSZWNvcmQoXG4gICAgICAgIHJlZlJlY29yZHNbcmVmZXJlbmNlcy5pbmRleE9mKHJlZildLFxuICAgICAgICByZWYuaW5kZXgsXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGxvYWRlZFJlY29yZC50cmFuc2FjdGlvbklkID0gc3RvcmVkRGF0YS50cmFuc2FjdGlvbklkO1xuICBsb2FkZWRSZWNvcmQuaXNOZXcgPSBmYWxzZTtcbiAgbG9hZGVkUmVjb3JkLmtleSA9IGtleTtcbiAgbG9hZGVkUmVjb3JkLmlkID0gJChrZXksIFtzcGxpdEtleSwgbGFzdF0pO1xuICBsb2FkZWRSZWNvcmQudHlwZSA9IHJlY29yZE5vZGUubmFtZTtcbiAgcmV0dXJuIGxvYWRlZFJlY29yZDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxvYWQ7XG4iLCIvLyBhZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2RleDRlci9qcy1wcm9taXNlLXJlYWRhYmxlXG4vLyB0aGFua3MgOilcbiAgXG5leHBvcnQgY29uc3QgcHJvbWlzZVJlYWRhYmxlU3RyZWFtID0gc3RyZWFtID0+IHtcbiAgIFxuICAgIGxldCBfZXJyb3JlZDtcblxuICAgIGNvbnN0IF9lcnJvckhhbmRsZXIgPSBlcnIgPT4ge1xuICAgICAgICBfZXJyb3JlZCA9IGVycjtcbiAgICB9O1xuXG4gICAgc3RyZWFtLm9uKFwiZXJyb3JcIiwgX2Vycm9ySGFuZGxlcik7XG4gIFxuICAgIGNvbnN0IHJlYWQgPSAoc2l6ZSkgPT4ge1xuICBcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGlmIChfZXJyb3JlZCkge1xuICAgICAgICAgIGNvbnN0IGVyciA9IF9lcnJvcmVkO1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgICB9XG4gIFxuICAgICAgICBpZiAoIXN0cmVhbS5yZWFkYWJsZSB8fCBzdHJlYW0uY2xvc2VkIHx8IHN0cmVhbS5kZXN0cm95ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCByZWFkYWJsZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY2h1bmsgPSBzdHJlYW0ucmVhZChzaXplKTtcbiAgXG4gICAgICAgICAgaWYgKGNodW5rKSB7XG4gICAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHJlc29sdmUoY2h1bmspO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgY2xvc2VIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgZW5kSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IChlcnIpID0+IHtcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgcmVtb3ZlTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImNsb3NlXCIsIGNsb3NlSGFuZGxlcik7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlbmRcIiwgZW5kSGFuZGxlcik7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwicmVhZGFibGVcIiwgcmVhZGFibGVIYW5kbGVyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgc3RyZWFtLm9uKFwiY2xvc2VcIiwgY2xvc2VIYW5kbGVyKTtcbiAgICAgICAgc3RyZWFtLm9uKFwiZW5kXCIsIGVuZEhhbmRsZXIpO1xuICAgICAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xuICAgICAgICBzdHJlYW0ub24oXCJyZWFkYWJsZVwiLCByZWFkYWJsZUhhbmRsZXIpO1xuICBcbiAgICAgICAgcmVhZGFibGVIYW5kbGVyKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIFxuICBcbiAgICBjb25zdCBkZXN0cm95ID0gKCkgPT4ge1xuICAgICAgaWYgKHN0cmVhbSkge1xuICAgICAgICBpZiAoX2Vycm9ySGFuZGxlcikge1xuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIF9lcnJvckhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygc3RyZWFtLmRlc3Ryb3kgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHN0cmVhbS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICBcbiAgICByZXR1cm4ge3JlYWQsIGRlc3Ryb3ksIHN0cmVhbX07XG4gIH1cbiAgXG4gIGV4cG9ydCBkZWZhdWx0IHByb21pc2VSZWFkYWJsZVN0cmVhbVxuICAiLCJpbXBvcnQgeyBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCB7XG4gIGZpbHRlciwgaW5jbHVkZXMsIG1hcCwgbGFzdCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIGdldEFjdHVhbEtleU9mUGFyZW50LCBpc0dsb2JhbEluZGV4LFxuICBnZXRQYXJlbnRLZXksIGlzU2hhcmRlZEluZGV4LFxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHtcbiAgam9pbktleSwgaXNOb25FbXB0eVN0cmluZywgc3BsaXRLZXksICQsXG59IGZyb20gJy4uL2NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleGVkRGF0YUtleSA9IChpbmRleE5vZGUsIGluZGV4S2V5LCByZWNvcmQpID0+IHtcbiAgY29uc3QgZ2V0U2hhcmROYW1lID0gKGluZGV4Tm9kZSwgcmVjb3JkKSA9PiB7XG4gICAgY29uc3Qgc2hhcmROYW1lRnVuYyA9IGNvbXBpbGVDb2RlKGluZGV4Tm9kZS5nZXRTaGFyZE5hbWUpO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gc2hhcmROYW1lRnVuYyh7IHJlY29yZCB9KTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGNvbnN0IGVycm9yRGV0YWlscyA9IGBzaGFyZENvZGU6ICR7aW5kZXhOb2RlLmdldFNoYXJkTmFtZX0gOjogcmVjb3JkOiAke0pTT04uc3RyaW5naWZ5KHJlY29yZCl9IDo6IGBcbiAgICAgIGUubWVzc2FnZSA9IFwiRXJyb3IgcnVubmluZyBpbmRleCBzaGFyZG5hbWUgZnVuYzogXCIgKyBlcnJvckRldGFpbHMgKyBlLm1lc3NhZ2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBzaGFyZE5hbWUgPSBpc05vbkVtcHR5U3RyaW5nKGluZGV4Tm9kZS5nZXRTaGFyZE5hbWUpXG4gICAgPyBgJHtnZXRTaGFyZE5hbWUoaW5kZXhOb2RlLCByZWNvcmQpfS5jc3ZgXG4gICAgOiAnaW5kZXguY3N2JztcblxuICByZXR1cm4gam9pbktleShpbmRleEtleSwgc2hhcmROYW1lKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRTaGFyZEtleXNJblJhbmdlID0gYXN5bmMgKGFwcCwgaW5kZXhLZXksIHN0YXJ0UmVjb3JkID0gbnVsbCwgZW5kUmVjb3JkID0gbnVsbCkgPT4ge1xuICBjb25zdCBpbmRleE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKGluZGV4S2V5KTtcblxuICBjb25zdCBzdGFydFNoYXJkTmFtZSA9ICFzdGFydFJlY29yZFxuICAgID8gbnVsbFxuICAgIDogc2hhcmROYW1lRnJvbUtleShcbiAgICAgIGdldEluZGV4ZWREYXRhS2V5KFxuICAgICAgICBpbmRleE5vZGUsXG4gICAgICAgIGluZGV4S2V5LFxuICAgICAgICBzdGFydFJlY29yZCxcbiAgICAgICksXG4gICAgKTtcblxuICBjb25zdCBlbmRTaGFyZE5hbWUgPSAhZW5kUmVjb3JkXG4gICAgPyBudWxsXG4gICAgOiBzaGFyZE5hbWVGcm9tS2V5KFxuICAgICAgZ2V0SW5kZXhlZERhdGFLZXkoXG4gICAgICAgIGluZGV4Tm9kZSxcbiAgICAgICAgaW5kZXhLZXksXG4gICAgICAgIGVuZFJlY29yZCxcbiAgICAgICksXG4gICAgKTtcblxuICByZXR1cm4gJChhd2FpdCBnZXRTaGFyZE1hcChhcHAuZGF0YXN0b3JlLCBpbmRleEtleSksIFtcbiAgICBmaWx0ZXIoayA9PiAoc3RhcnRSZWNvcmQgPT09IG51bGwgfHwgayA+PSBzdGFydFNoYXJkTmFtZSlcbiAgICAgICAgICAgICAgICAgICAgJiYgKGVuZFJlY29yZCA9PT0gbnVsbCB8fCBrIDw9IGVuZFNoYXJkTmFtZSkpLFxuICAgIG1hcChrID0+IGpvaW5LZXkoaW5kZXhLZXksIGAke2t9LmNzdmApKSxcbiAgXSk7XG59O1xuXG5leHBvcnQgY29uc3QgZW5zdXJlU2hhcmROYW1lSXNJblNoYXJkTWFwID0gYXN5bmMgKHN0b3JlLCBpbmRleEtleSwgaW5kZXhlZERhdGFLZXkpID0+IHtcbiAgY29uc3QgbWFwID0gYXdhaXQgZ2V0U2hhcmRNYXAoc3RvcmUsIGluZGV4S2V5KTtcbiAgY29uc3Qgc2hhcmROYW1lID0gc2hhcmROYW1lRnJvbUtleShpbmRleGVkRGF0YUtleSk7XG4gIGlmICghaW5jbHVkZXMoc2hhcmROYW1lKShtYXApKSB7XG4gICAgbWFwLnB1c2goc2hhcmROYW1lKTtcbiAgICBhd2FpdCB3cml0ZVNoYXJkTWFwKHN0b3JlLCBpbmRleEtleSwgbWFwKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGdldFNoYXJkTWFwID0gYXN5bmMgKGRhdGFzdG9yZSwgaW5kZXhLZXkpID0+IHtcbiAgY29uc3Qgc2hhcmRNYXBLZXkgPSBnZXRTaGFyZE1hcEtleShpbmRleEtleSk7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGRhdGFzdG9yZS5sb2FkSnNvbihzaGFyZE1hcEtleSk7XG4gIH0gY2F0Y2ggKF8pIHtcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlSnNvbihzaGFyZE1hcEtleSwgW10pO1xuICAgIHJldHVybiBbXTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHdyaXRlU2hhcmRNYXAgPSBhc3luYyAoZGF0YXN0b3JlLCBpbmRleEtleSwgc2hhcmRNYXApID0+IGF3YWl0IGRhdGFzdG9yZS51cGRhdGVKc29uKFxuICBnZXRTaGFyZE1hcEtleShpbmRleEtleSksXG4gIHNoYXJkTWFwLFxuKTtcblxuZXhwb3J0IGNvbnN0IGdldEFsbFNoYXJkS2V5cyA9IGFzeW5jIChhcHAsIGluZGV4S2V5KSA9PiBhd2FpdCBnZXRTaGFyZEtleXNJblJhbmdlKGFwcCwgaW5kZXhLZXkpO1xuXG5leHBvcnQgY29uc3QgZ2V0U2hhcmRNYXBLZXkgPSBpbmRleEtleSA9PiBqb2luS2V5KGluZGV4S2V5LCAnc2hhcmRNYXAuanNvbicpO1xuXG5leHBvcnQgY29uc3QgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5ID0gaW5kZXhLZXkgPT4gam9pbktleShpbmRleEtleSwgJ2luZGV4LmNzdicpO1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhGb2xkZXJLZXkgPSBpbmRleEtleSA9PiBpbmRleEtleTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUluZGV4RmlsZSA9IGFzeW5jIChkYXRhc3RvcmUsIGluZGV4ZWREYXRhS2V5LCBpbmRleCkgPT4ge1xuICBpZiAoaXNTaGFyZGVkSW5kZXgoaW5kZXgpKSB7XG4gICAgY29uc3QgaW5kZXhLZXkgPSBnZXRQYXJlbnRLZXkoaW5kZXhlZERhdGFLZXkpO1xuICAgIGNvbnN0IHNoYXJkTWFwID0gYXdhaXQgZ2V0U2hhcmRNYXAoZGF0YXN0b3JlLCBpbmRleEtleSk7XG4gICAgc2hhcmRNYXAucHVzaChcbiAgICAgIHNoYXJkTmFtZUZyb21LZXkoaW5kZXhlZERhdGFLZXkpLFxuICAgICk7XG4gICAgYXdhaXQgd3JpdGVTaGFyZE1hcChkYXRhc3RvcmUsIGluZGV4S2V5LCBzaGFyZE1hcCk7XG4gIH1cbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZpbGUoaW5kZXhlZERhdGFLZXksICcnKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzaGFyZE5hbWVGcm9tS2V5ID0ga2V5ID0+ICQoa2V5LCBbXG4gIHNwbGl0S2V5LFxuICBsYXN0LFxuXSkucmVwbGFjZSgnLmNzdicsICcnKTtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4S2V5X0Jhc2VkT25EZWNlbmRhbnQgPSAoZGVjZW5kYW50S2V5LCBpbmRleE5vZGUpID0+IHtcbiAgaWYgKGlzR2xvYmFsSW5kZXgoaW5kZXhOb2RlKSkgeyByZXR1cm4gYCR7aW5kZXhOb2RlLm5vZGVLZXkoKX1gOyB9XG5cbiAgY29uc3QgaW5kZXhlZERhdGFQYXJlbnRLZXkgPSBnZXRBY3R1YWxLZXlPZlBhcmVudChcbiAgICBpbmRleE5vZGUucGFyZW50KCkubm9kZUtleSgpLFxuICAgIGRlY2VuZGFudEtleSxcbiAgKTtcblxuICByZXR1cm4gam9pbktleShcbiAgICBpbmRleGVkRGF0YVBhcmVudEtleSxcbiAgICBpbmRleE5vZGUubmFtZSxcbiAgKTtcbn07XG4iLCJpbXBvcnQge1xuICBoYXMsIGtleXMsIG1hcCwgb3JkZXJCeSxcbiAgZmlsdGVyLCBjb25jYXQsIHJldmVyc2UsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBtYXBSZWNvcmQgfSBmcm9tICcuL2V2YWx1YXRlJztcbmltcG9ydCB7IGNvbnN0cnVjdFJlY29yZCB9IGZyb20gJy4uL3JlY29yZEFwaS9nZXROZXcnO1xuaW1wb3J0IHsgZ2V0U2FtcGxlRmllbGRWYWx1ZSwgZGV0ZWN0VHlwZSwgYWxsIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgJCB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBnZW5lcmF0ZVNjaGVtYSA9IChoaWVyYXJjaHksIGluZGV4Tm9kZSkgPT4ge1xuICBjb25zdCByZWNvcmROb2RlcyA9IGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4KGhpZXJhcmNoeSwgaW5kZXhOb2RlKTtcbiAgY29uc3QgbWFwcGVkUmVjb3JkcyA9ICQocmVjb3JkTm9kZXMsIFtcbiAgICBtYXAobiA9PiBtYXBSZWNvcmQoY3JlYXRlU2FtcGxlUmVjb3JkKG4pLCBpbmRleE5vZGUpKSxcbiAgXSk7XG5cbiAgLy8gYWx3YXlzIGhhcyByZWNvcmQga2V5IGFuZCBzb3J0IGtleVxuICBjb25zdCBzY2hlbWEgPSB7XG4gICAgc29ydEtleTogYWxsLnN0cmluZyxcbiAgICBrZXk6IGFsbC5zdHJpbmcsXG4gIH07XG5cbiAgY29uc3QgZmllbGRzSGFzID0gaGFzKHNjaGVtYSk7XG4gIGNvbnN0IHNldEZpZWxkID0gKGZpZWxkTmFtZSwgdmFsdWUpID0+IHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IHRoaXNUeXBlID0gZGV0ZWN0VHlwZSh2YWx1ZSk7XG4gICAgaWYgKGZpZWxkc0hhcyhmaWVsZE5hbWUpKSB7XG4gICAgICBpZiAoc2NoZW1hW2ZpZWxkTmFtZV0gIT09IHRoaXNUeXBlKSB7XG4gICAgICAgIHNjaGVtYVtmaWVsZE5hbWVdID0gYWxsLnN0cmluZztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc2NoZW1hW2ZpZWxkTmFtZV0gPSB0aGlzVHlwZTtcbiAgICB9XG4gIH07XG5cbiAgZm9yIChjb25zdCBtYXBwZWRSZWMgb2YgbWFwcGVkUmVjb3Jkcykge1xuICAgIGZvciAoY29uc3QgZiBpbiBtYXBwZWRSZWMpIHtcbiAgICAgIHNldEZpZWxkKGYsIG1hcHBlZFJlY1tmXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gcmV0dXJpbmcgYW4gYXJyYXkgb2Yge25hbWUsIHR5cGV9XG4gIHJldHVybiAkKHNjaGVtYSwgW1xuICAgIGtleXMsXG4gICAgbWFwKGsgPT4gKHsgbmFtZTogaywgdHlwZTogc2NoZW1hW2tdLm5hbWUgfSkpLFxuICAgIGZpbHRlcihzID0+IHMubmFtZSAhPT0gJ3NvcnRLZXknKSxcbiAgICBvcmRlckJ5KCduYW1lJywgWydkZXNjJ10pLCAvLyByZXZlcnNlIGFwbGhhXG4gICAgY29uY2F0KFt7IG5hbWU6ICdzb3J0S2V5JywgdHlwZTogYWxsLnN0cmluZy5uYW1lIH1dKSwgLy8gc29ydEtleSBvbiBlbmRcbiAgICByZXZlcnNlLCAvLyBzb3J0S2V5IGZpcnN0LCB0aGVuIHJlc3QgYXJlIGFscGhhYmV0aWNhbFxuICBdKTtcbn07XG5cbmNvbnN0IGNyZWF0ZVNhbXBsZVJlY29yZCA9IHJlY29yZE5vZGUgPT4gY29uc3RydWN0UmVjb3JkKFxuICByZWNvcmROb2RlLFxuICBnZXRTYW1wbGVGaWVsZFZhbHVlLFxuICByZWNvcmROb2RlLnBhcmVudCgpLm5vZGVLZXkoKSxcbik7XG4iLCJleHBvcnQgZGVmYXVsdCAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6XG4gICAgICAgICAgICB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOlxuICAgICAgICAgICAgdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KTtcbiIsIlxudmFyIGxvb2t1cCA9IFtdXG52YXIgcmV2TG9va3VwID0gW11cbnZhciBBcnIgPSB0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcgPyBVaW50OEFycmF5IDogQXJyYXlcbnZhciBpbml0ZWQgPSBmYWxzZTtcbmZ1bmN0aW9uIGluaXQgKCkge1xuICBpbml0ZWQgPSB0cnVlO1xuICB2YXIgY29kZSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJ1xuICBmb3IgKHZhciBpID0gMCwgbGVuID0gY29kZS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGxvb2t1cFtpXSA9IGNvZGVbaV1cbiAgICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGlcbiAgfVxuXG4gIHJldkxvb2t1cFsnLScuY2hhckNvZGVBdCgwKV0gPSA2MlxuICByZXZMb29rdXBbJ18nLmNoYXJDb2RlQXQoMCldID0gNjNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQnl0ZUFycmF5IChiNjQpIHtcbiAgaWYgKCFpbml0ZWQpIHtcbiAgICBpbml0KCk7XG4gIH1cbiAgdmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcbiAgdmFyIGxlbiA9IGI2NC5sZW5ndGhcblxuICBpZiAobGVuICUgNCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuICB9XG5cbiAgLy8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcbiAgLy8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuICAvLyByZXByZXNlbnQgb25lIGJ5dGVcbiAgLy8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG4gIC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2VcbiAgcGxhY2VIb2xkZXJzID0gYjY0W2xlbiAtIDJdID09PSAnPScgPyAyIDogYjY0W2xlbiAtIDFdID09PSAnPScgPyAxIDogMFxuXG4gIC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuICBhcnIgPSBuZXcgQXJyKGxlbiAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG4gIC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcbiAgbCA9IHBsYWNlSG9sZGVycyA+IDAgPyBsZW4gLSA0IDogbGVuXG5cbiAgdmFyIEwgPSAwXG5cbiAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCAxMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPDwgNikgfCByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxuICAgIGFycltMKytdID0gKHRtcCA+PiAxNikgJiAweEZGXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDIpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldID4+IDQpXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDQpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildID4+IDIpXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuICByZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICsgbG9va3VwW251bSA+PiAxMiAmIDB4M0ZdICsgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gKyBsb29rdXBbbnVtICYgMHgzRl1cbn1cblxuZnVuY3Rpb24gZW5jb2RlQ2h1bmsgKHVpbnQ4LCBzdGFydCwgZW5kKSB7XG4gIHZhciB0bXBcbiAgdmFyIG91dHB1dCA9IFtdXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSAzKSB7XG4gICAgdG1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxuICB9XG4gIHJldHVybiBvdXRwdXQuam9pbignJylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21CeXRlQXJyYXkgKHVpbnQ4KSB7XG4gIGlmICghaW5pdGVkKSB7XG4gICAgaW5pdCgpO1xuICB9XG4gIHZhciB0bXBcbiAgdmFyIGxlbiA9IHVpbnQ4Lmxlbmd0aFxuICB2YXIgZXh0cmFCeXRlcyA9IGxlbiAlIDMgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcbiAgdmFyIG91dHB1dCA9ICcnXG4gIHZhciBwYXJ0cyA9IFtdXG4gIHZhciBtYXhDaHVua0xlbmd0aCA9IDE2MzgzIC8vIG11c3QgYmUgbXVsdGlwbGUgb2YgM1xuXG4gIC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbjIgPSBsZW4gLSBleHRyYUJ5dGVzOyBpIDwgbGVuMjsgaSArPSBtYXhDaHVua0xlbmd0aCkge1xuICAgIHBhcnRzLnB1c2goZW5jb2RlQ2h1bmsodWludDgsIGksIChpICsgbWF4Q2h1bmtMZW5ndGgpID4gbGVuMiA/IGxlbjIgOiAoaSArIG1heENodW5rTGVuZ3RoKSkpXG4gIH1cblxuICAvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG4gIGlmIChleHRyYUJ5dGVzID09PSAxKSB7XG4gICAgdG1wID0gdWludDhbbGVuIC0gMV1cbiAgICBvdXRwdXQgKz0gbG9va3VwW3RtcCA+PiAyXVxuICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA8PCA0KSAmIDB4M0ZdXG4gICAgb3V0cHV0ICs9ICc9PSdcbiAgfSBlbHNlIGlmIChleHRyYUJ5dGVzID09PSAyKSB7XG4gICAgdG1wID0gKHVpbnQ4W2xlbiAtIDJdIDw8IDgpICsgKHVpbnQ4W2xlbiAtIDFdKVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDEwXVxuICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA+PiA0KSAmIDB4M0ZdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDIpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz0nXG4gIH1cblxuICBwYXJ0cy5wdXNoKG91dHB1dClcblxuICByZXR1cm4gcGFydHMuam9pbignJylcbn1cbiIsIlxuZXhwb3J0IGZ1bmN0aW9uIHJlYWQgKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IG0gKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gd3JpdGUgKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAodmFsdWUgKiBjIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxuZXhwb3J0IGRlZmF1bHQgQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoYXJyKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGFycikgPT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xuXG5cbmltcG9ydCAqIGFzIGJhc2U2NCBmcm9tICcuL2Jhc2U2NCdcbmltcG9ydCAqIGFzIGllZWU3NTQgZnJvbSAnLi9pZWVlNzU0J1xuaW1wb3J0IGlzQXJyYXkgZnJvbSAnLi9pc0FycmF5J1xuXG5leHBvcnQgdmFyIElOU1BFQ1RfTUFYX0JZVEVTID0gNTBcblxuLyoqXG4gKiBJZiBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAobW9zdCBjb21wYXRpYmxlLCBldmVuIElFNilcbiAqXG4gKiBCcm93c2VycyB0aGF0IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssIENocm9tZSA3KywgU2FmYXJpIDUuMSssXG4gKiBPcGVyYSAxMS42KywgaU9TIDQuMisuXG4gKlxuICogRHVlIHRvIHZhcmlvdXMgYnJvd3NlciBidWdzLCBzb21ldGltZXMgdGhlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiB3aWxsIGJlIHVzZWQgZXZlblxuICogd2hlbiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0eXBlZCBhcnJheXMuXG4gKlxuICogTm90ZTpcbiAqXG4gKiAgIC0gRmlyZWZveCA0LTI5IGxhY2tzIHN1cHBvcnQgZm9yIGFkZGluZyBuZXcgcHJvcGVydGllcyB0byBgVWludDhBcnJheWAgaW5zdGFuY2VzLFxuICogICAgIFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4LlxuICpcbiAqICAgLSBDaHJvbWUgOS0xMCBpcyBtaXNzaW5nIHRoZSBgVHlwZWRBcnJheS5wcm90b3R5cGUuc3ViYXJyYXlgIGZ1bmN0aW9uLlxuICpcbiAqICAgLSBJRTEwIGhhcyBhIGJyb2tlbiBgVHlwZWRBcnJheS5wcm90b3R5cGUuc3ViYXJyYXlgIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYXJyYXlzIG9mXG4gKiAgICAgaW5jb3JyZWN0IGxlbmd0aCBpbiBzb21lIHNpdHVhdGlvbnMuXG5cbiAqIFdlIGRldGVjdCB0aGVzZSBidWdneSBicm93c2VycyBhbmQgc2V0IGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGAgdG8gYGZhbHNlYCBzbyB0aGV5XG4gKiBnZXQgdGhlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiwgd2hpY2ggaXMgc2xvd2VyIGJ1dCBiZWhhdmVzIGNvcnJlY3RseS5cbiAqL1xuQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgPSBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVCAhPT0gdW5kZWZpbmVkXG4gID8gZ2xvYmFsLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgOiB0cnVlXG5cbi8qXG4gKiBFeHBvcnQga01heExlbmd0aCBhZnRlciB0eXBlZCBhcnJheSBzdXBwb3J0IGlzIGRldGVybWluZWQuXG4gKi9cbnZhciBfa01heExlbmd0aCA9IGtNYXhMZW5ndGgoKVxuZXhwb3J0IHtfa01heExlbmd0aCBhcyBrTWF4TGVuZ3RofTtcbmZ1bmN0aW9uIHR5cGVkQXJyYXlTdXBwb3J0ICgpIHtcbiAgcmV0dXJuIHRydWU7XG4gIC8vIHJvbGx1cCBpc3N1ZXNcbiAgLy8gdHJ5IHtcbiAgLy8gICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoMSlcbiAgLy8gICBhcnIuX19wcm90b19fID0ge1xuICAvLyAgICAgX19wcm90b19fOiBVaW50OEFycmF5LnByb3RvdHlwZSxcbiAgLy8gICAgIGZvbzogZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuICAvLyAgIH1cbiAgLy8gICByZXR1cm4gYXJyLmZvbygpID09PSA0MiAmJiAvLyB0eXBlZCBhcnJheSBpbnN0YW5jZXMgY2FuIGJlIGF1Z21lbnRlZFxuICAvLyAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nICYmIC8vIGNocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICAvLyAgICAgICBhcnIuc3ViYXJyYXkoMSwgMSkuYnl0ZUxlbmd0aCA9PT0gMCAvLyBpZTEwIGhhcyBicm9rZW4gYHN1YmFycmF5YFxuICAvLyB9IGNhdGNoIChlKSB7XG4gIC8vICAgcmV0dXJuIGZhbHNlXG4gIC8vIH1cbn1cblxuZnVuY3Rpb24ga01heExlbmd0aCAoKSB7XG4gIHJldHVybiBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVFxuICAgID8gMHg3ZmZmZmZmZlxuICAgIDogMHgzZmZmZmZmZlxufVxuXG5mdW5jdGlvbiBjcmVhdGVCdWZmZXIgKHRoYXQsIGxlbmd0aCkge1xuICBpZiAoa01heExlbmd0aCgpIDwgbGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgdHlwZWQgYXJyYXkgbGVuZ3RoJylcbiAgfVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gbmV3IFVpbnQ4QXJyYXkobGVuZ3RoKVxuICAgIHRoYXQuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gYW4gb2JqZWN0IGluc3RhbmNlIG9mIHRoZSBCdWZmZXIgY2xhc3NcbiAgICBpZiAodGhhdCA9PT0gbnVsbCkge1xuICAgICAgdGhhdCA9IG5ldyBCdWZmZXIobGVuZ3RoKVxuICAgIH1cbiAgICB0aGF0Lmxlbmd0aCA9IGxlbmd0aFxuICB9XG5cbiAgcmV0dXJuIHRoYXRcbn1cblxuLyoqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGhhdmUgdGhlaXJcbiAqIHByb3RvdHlwZSBjaGFuZ2VkIHRvIGBCdWZmZXIucHJvdG90eXBlYC4gRnVydGhlcm1vcmUsIGBCdWZmZXJgIGlzIGEgc3ViY2xhc3Mgb2ZcbiAqIGBVaW50OEFycmF5YCwgc28gdGhlIHJldHVybmVkIGluc3RhbmNlcyB3aWxsIGhhdmUgYWxsIHRoZSBub2RlIGBCdWZmZXJgIG1ldGhvZHNcbiAqIGFuZCB0aGUgYFVpbnQ4QXJyYXlgIG1ldGhvZHMuIFNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0XG4gKiByZXR1cm5zIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIFRoZSBgVWludDhBcnJheWAgcHJvdG90eXBlIHJlbWFpbnMgdW5tb2RpZmllZC5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gQnVmZmVyIChhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmICEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIC8vIENvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdJZiBlbmNvZGluZyBpcyBzcGVjaWZpZWQgdGhlbiB0aGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZydcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGFsbG9jVW5zYWZlKHRoaXMsIGFyZylcbiAgfVxuICByZXR1cm4gZnJvbSh0aGlzLCBhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbi8vIFRPRE86IExlZ2FjeSwgbm90IG5lZWRlZCBhbnltb3JlLiBSZW1vdmUgaW4gbmV4dCBtYWpvciB2ZXJzaW9uLlxuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIGZyb20gKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKVxuICB9XG5cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZyb21TdHJpbmcodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQpXG4gIH1cblxuICByZXR1cm4gZnJvbU9iamVjdCh0aGF0LCB2YWx1ZSlcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsbHkgZXF1aXZhbGVudCB0byBCdWZmZXIoYXJnLCBlbmNvZGluZykgYnV0IHRocm93cyBhIFR5cGVFcnJvclxuICogaWYgdmFsdWUgaXMgYSBudW1iZXIuXG4gKiBCdWZmZXIuZnJvbShzdHJbLCBlbmNvZGluZ10pXG4gKiBCdWZmZXIuZnJvbShhcnJheSlcbiAqIEJ1ZmZlci5mcm9tKGJ1ZmZlcilcbiAqIEJ1ZmZlci5mcm9tKGFycmF5QnVmZmVyWywgYnl0ZU9mZnNldFssIGxlbmd0aF1dKVxuICoqL1xuQnVmZmVyLmZyb20gPSBmdW5jdGlvbiAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gZnJvbShudWxsLCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5pZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgQnVmZmVyLnByb3RvdHlwZS5fX3Byb3RvX18gPSBVaW50OEFycmF5LnByb3RvdHlwZVxuICBCdWZmZXIuX19wcm90b19fID0gVWludDhBcnJheVxuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnNwZWNpZXMgJiZcbiAgICAgIEJ1ZmZlcltTeW1ib2wuc3BlY2llc10gPT09IEJ1ZmZlcikge1xuICAgIC8vIEZpeCBzdWJhcnJheSgpIGluIEVTMjAxNi4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzk3XG4gICAgLy8gT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlciwgU3ltYm9sLnNwZWNpZXMsIHtcbiAgICAvLyAgIHZhbHVlOiBudWxsLFxuICAgIC8vICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgLy8gfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnRTaXplIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyJylcbiAgfSBlbHNlIGlmIChzaXplIDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBuZWdhdGl2ZScpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWxsb2MgKHRoYXQsIHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgaWYgKHNpemUgPD0gMCkge1xuICAgIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSlcbiAgfVxuICBpZiAoZmlsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT25seSBwYXkgYXR0ZW50aW9uIHRvIGVuY29kaW5nIGlmIGl0J3MgYSBzdHJpbmcuIFRoaXNcbiAgICAvLyBwcmV2ZW50cyBhY2NpZGVudGFsbHkgc2VuZGluZyBpbiBhIG51bWJlciB0aGF0IHdvdWxkXG4gICAgLy8gYmUgaW50ZXJwcmV0dGVkIGFzIGEgc3RhcnQgb2Zmc2V0LlxuICAgIHJldHVybiB0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnXG4gICAgICA/IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwsIGVuY29kaW5nKVxuICAgICAgOiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSkuZmlsbChmaWxsKVxuICB9XG4gIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSlcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiBhbGxvYyhzaXplWywgZmlsbFssIGVuY29kaW5nXV0pXG4gKiovXG5CdWZmZXIuYWxsb2MgPSBmdW5jdGlvbiAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGFsbG9jKG51bGwsIHNpemUsIGZpbGwsIGVuY29kaW5nKVxufVxuXG5mdW5jdGlvbiBhbGxvY1Vuc2FmZSAodGhhdCwgc2l6ZSkge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSA8IDAgPyAwIDogY2hlY2tlZChzaXplKSB8IDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7ICsraSkge1xuICAgICAgdGhhdFtpXSA9IDBcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIEJ1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShudWxsLCBzaXplKVxufVxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIFNsb3dCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShudWxsLCBzaXplKVxufVxuXG5mdW5jdGlvbiBmcm9tU3RyaW5nICh0aGF0LCBzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnIHx8IGVuY29kaW5nID09PSAnJykge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZW5jb2RpbmdcIiBtdXN0IGJlIGEgdmFsaWQgc3RyaW5nIGVuY29kaW5nJylcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBieXRlTGVuZ3RoKHN0cmluZywgZW5jb2RpbmcpIHwgMFxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbmd0aClcblxuICB2YXIgYWN0dWFsID0gdGhhdC53cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuXG4gIGlmIChhY3R1YWwgIT09IGxlbmd0aCkge1xuICAgIC8vIFdyaXRpbmcgYSBoZXggc3RyaW5nLCBmb3IgZXhhbXBsZSwgdGhhdCBjb250YWlucyBpbnZhbGlkIGNoYXJhY3RlcnMgd2lsbFxuICAgIC8vIGNhdXNlIGV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGZpcnN0IGludmFsaWQgY2hhcmFjdGVyIHRvIGJlIGlnbm9yZWQuIChlLmcuXG4gICAgLy8gJ2FieHhjZCcgd2lsbCBiZSB0cmVhdGVkIGFzICdhYicpXG4gICAgdGhhdCA9IHRoYXQuc2xpY2UoMCwgYWN0dWFsKVxuICB9XG5cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCA8IDAgPyAwIDogY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIHRoYXRbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUJ1ZmZlciAodGhhdCwgYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICBhcnJheS5ieXRlTGVuZ3RoIC8vIHRoaXMgdGhyb3dzIGlmIGBhcnJheWAgaXMgbm90IGEgdmFsaWQgQXJyYXlCdWZmZXJcblxuICBpZiAoYnl0ZU9mZnNldCA8IDAgfHwgYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXFwnb2Zmc2V0XFwnIGlzIG91dCBvZiBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0ICsgKGxlbmd0aCB8fCAwKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdsZW5ndGhcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYnl0ZU9mZnNldCA9PT0gdW5kZWZpbmVkICYmIGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSlcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQpXG4gIH0gZWxzZSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgdGhhdCA9IGFycmF5XG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIHRoYXQgPSBmcm9tQXJyYXlMaWtlKHRoYXQsIGFycmF5KVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKHRoYXQsIG9iaikge1xuICBpZiAoaW50ZXJuYWxJc0J1ZmZlcihvYmopKSB7XG4gICAgdmFyIGxlbiA9IGNoZWNrZWQob2JqLmxlbmd0aCkgfCAwXG4gICAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBsZW4pXG5cbiAgICBpZiAodGhhdC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGF0XG4gICAgfVxuXG4gICAgb2JqLmNvcHkodGhhdCwgMCwgMCwgbGVuKVxuICAgIHJldHVybiB0aGF0XG4gIH1cblxuICBpZiAob2JqKSB7XG4gICAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgIG9iai5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikgfHwgJ2xlbmd0aCcgaW4gb2JqKSB7XG4gICAgICBpZiAodHlwZW9mIG9iai5sZW5ndGggIT09ICdudW1iZXInIHx8IGlzbmFuKG9iai5sZW5ndGgpKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgMClcbiAgICAgIH1cbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iailcbiAgICB9XG5cbiAgICBpZiAob2JqLnR5cGUgPT09ICdCdWZmZXInICYmIGlzQXJyYXkob2JqLmRhdGEpKSB7XG4gICAgICByZXR1cm4gZnJvbUFycmF5TGlrZSh0aGF0LCBvYmouZGF0YSlcbiAgICB9XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nLCBCdWZmZXIsIEFycmF5QnVmZmVyLCBBcnJheSwgb3IgYXJyYXktbGlrZSBvYmplY3QuJylcbn1cblxuZnVuY3Rpb24gY2hlY2tlZCAobGVuZ3RoKSB7XG4gIC8vIE5vdGU6IGNhbm5vdCB1c2UgYGxlbmd0aCA8IGtNYXhMZW5ndGgoKWAgaGVyZSBiZWNhdXNlIHRoYXQgZmFpbHMgd2hlblxuICAvLyBsZW5ndGggaXMgTmFOICh3aGljaCBpcyBvdGhlcndpc2UgY29lcmNlZCB0byB6ZXJvLilcbiAgaWYgKGxlbmd0aCA+PSBrTWF4TGVuZ3RoKCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnc2l6ZTogMHgnICsga01heExlbmd0aCgpLnRvU3RyaW5nKDE2KSArICcgYnl0ZXMnKVxuICB9XG4gIHJldHVybiBsZW5ndGggfCAwXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTbG93QnVmZmVyIChsZW5ndGgpIHtcbiAgaWYgKCtsZW5ndGggIT0gbGVuZ3RoKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZXFlcWVxXG4gICAgbGVuZ3RoID0gMFxuICB9XG4gIHJldHVybiBCdWZmZXIuYWxsb2MoK2xlbmd0aClcbn1cbkJ1ZmZlci5pc0J1ZmZlciA9IGlzQnVmZmVyO1xuZnVuY3Rpb24gaW50ZXJuYWxJc0J1ZmZlciAoYikge1xuICByZXR1cm4gISEoYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKGEsIGIpIHtcbiAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKGEpIHx8ICFpbnRlcm5hbElzQnVmZmVyKGIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIG11c3QgYmUgQnVmZmVycycpXG4gIH1cblxuICBpZiAoYSA9PT0gYikgcmV0dXJuIDBcblxuICB2YXIgeCA9IGEubGVuZ3RoXG4gIHZhciB5ID0gYi5sZW5ndGhcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXVxuICAgICAgeSA9IGJbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIGlzRW5jb2RpbmcgKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gY29uY2F0IChsaXN0LCBsZW5ndGgpIHtcbiAgaWYgKCFpc0FycmF5KGxpc3QpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBCdWZmZXIuYWxsb2MoMClcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGxlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgbGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShsZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIGJ1ZiA9IGxpc3RbaV1cbiAgICBpZiAoIWludGVybmFsSXNCdWZmZXIoYnVmKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgICB9XG4gICAgYnVmLmNvcHkoYnVmZmVyLCBwb3MpXG4gICAgcG9zICs9IGJ1Zi5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmZmVyXG59XG5cbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKGludGVybmFsSXNCdWZmZXIoc3RyaW5nKSkge1xuICAgIHJldHVybiBzdHJpbmcubGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIEFycmF5QnVmZmVyLmlzVmlldyA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgKEFycmF5QnVmZmVyLmlzVmlldyhzdHJpbmcpIHx8IHN0cmluZyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSkge1xuICAgIHJldHVybiBzdHJpbmcuYnl0ZUxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuICAgIHN0cmluZyA9ICcnICsgc3RyaW5nXG4gIH1cblxuICB2YXIgbGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAobGVuID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIFVzZSBhIGZvciBsb29wIHRvIGF2b2lkIHJlY3Vyc2lvblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsZW5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIGxlbiAqIDJcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBsZW4gPj4+IDFcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aCAvLyBhc3N1bWUgdXRmOFxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuQnVmZmVyLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5cbmZ1bmN0aW9uIHNsb3dUb1N0cmluZyAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcblxuICAvLyBObyBuZWVkIHRvIHZlcmlmeSB0aGF0IFwidGhpcy5sZW5ndGggPD0gTUFYX1VJTlQzMlwiIHNpbmNlIGl0J3MgYSByZWFkLW9ubHlcbiAgLy8gcHJvcGVydHkgb2YgYSB0eXBlZCBhcnJheS5cblxuICAvLyBUaGlzIGJlaGF2ZXMgbmVpdGhlciBsaWtlIFN0cmluZyBub3IgVWludDhBcnJheSBpbiB0aGF0IHdlIHNldCBzdGFydC9lbmRcbiAgLy8gdG8gdGhlaXIgdXBwZXIvbG93ZXIgYm91bmRzIGlmIHRoZSB2YWx1ZSBwYXNzZWQgaXMgb3V0IG9mIHJhbmdlLlxuICAvLyB1bmRlZmluZWQgaXMgaGFuZGxlZCBzcGVjaWFsbHkgYXMgcGVyIEVDTUEtMjYyIDZ0aCBFZGl0aW9uLFxuICAvLyBTZWN0aW9uIDEzLjMuMy43IFJ1bnRpbWUgU2VtYW50aWNzOiBLZXllZEJpbmRpbmdJbml0aWFsaXphdGlvbi5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQgfHwgc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgLy8gUmV0dXJuIGVhcmx5IGlmIHN0YXJ0ID4gdGhpcy5sZW5ndGguIERvbmUgaGVyZSB0byBwcmV2ZW50IHBvdGVudGlhbCB1aW50MzJcbiAgLy8gY29lcmNpb24gZmFpbCBiZWxvdy5cbiAgaWYgKHN0YXJ0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCB8fCBlbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoZW5kIDw9IDApIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIC8vIEZvcmNlIGNvZXJzaW9uIHRvIHVpbnQzMi4gVGhpcyB3aWxsIGFsc28gY29lcmNlIGZhbHNleS9OYU4gdmFsdWVzIHRvIDAuXG4gIGVuZCA+Pj49IDBcbiAgc3RhcnQgPj4+PSAwXG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGF0aW4xU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1dGYxNmxlU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKGVuY29kaW5nICsgJycpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbi8vIFRoZSBwcm9wZXJ0eSBpcyB1c2VkIGJ5IGBCdWZmZXIuaXNCdWZmZXJgIGFuZCBgaXMtYnVmZmVyYCAoaW4gU2FmYXJpIDUtNykgdG8gZGV0ZWN0XG4vLyBCdWZmZXIgaW5zdGFuY2VzLlxuQnVmZmVyLnByb3RvdHlwZS5faXNCdWZmZXIgPSB0cnVlXG5cbmZ1bmN0aW9uIHN3YXAgKGIsIG4sIG0pIHtcbiAgdmFyIGkgPSBiW25dXG4gIGJbbl0gPSBiW21dXG4gIGJbbV0gPSBpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDE2ID0gZnVuY3Rpb24gc3dhcDE2ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSAyICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAxNi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMSlcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAzMiA9IGZ1bmN0aW9uIHN3YXAzMiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgNCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMzItYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDMpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDIpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwNjQgPSBmdW5jdGlvbiBzd2FwNjQgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDggIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDY0LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDgpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyA3KVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyA2KVxuICAgIHN3YXAodGhpcywgaSArIDIsIGkgKyA1KVxuICAgIHN3YXAodGhpcywgaSArIDMsIGkgKyA0KVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCB8IDBcbiAgaWYgKGxlbmd0aCA9PT0gMCkgcmV0dXJuICcnXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIDAsIGxlbmd0aClcbiAgcmV0dXJuIHNsb3dUb1N0cmluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gZXF1YWxzIChiKSB7XG4gIGlmICghaW50ZXJuYWxJc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYikgPT09IDBcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gIHZhciBzdHIgPSAnJ1xuICB2YXIgbWF4ID0gSU5TUEVDVF9NQVhfQllURVNcbiAgaWYgKHRoaXMubGVuZ3RoID4gMCkge1xuICAgIHN0ciA9IHRoaXMudG9TdHJpbmcoJ2hleCcsIDAsIG1heCkubWF0Y2goLy57Mn0vZykuam9pbignICcpXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbWF4KSBzdHIgKz0gJyAuLi4gJ1xuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgc3RyICsgJz4nXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKHRhcmdldCwgc3RhcnQsIGVuZCwgdGhpc1N0YXJ0LCB0aGlzRW5kKSB7XG4gIGlmICghaW50ZXJuYWxJc0J1ZmZlcih0YXJnZXQpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIH1cblxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuZCA9IHRhcmdldCA/IHRhcmdldC5sZW5ndGggOiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1N0YXJ0ID0gMFxuICB9XG4gIGlmICh0aGlzRW5kID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzRW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChzdGFydCA8IDAgfHwgZW5kID4gdGFyZ2V0Lmxlbmd0aCB8fCB0aGlzU3RhcnQgPCAwIHx8IHRoaXNFbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdvdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kICYmIHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kKSB7XG4gICAgcmV0dXJuIC0xXG4gIH1cbiAgaWYgKHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAxXG4gIH1cblxuICBzdGFydCA+Pj49IDBcbiAgZW5kID4+Pj0gMFxuICB0aGlzU3RhcnQgPj4+PSAwXG4gIHRoaXNFbmQgPj4+PSAwXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCkgcmV0dXJuIDBcblxuICB2YXIgeCA9IHRoaXNFbmQgLSB0aGlzU3RhcnRcbiAgdmFyIHkgPSBlbmQgLSBzdGFydFxuICB2YXIgbGVuID0gTWF0aC5taW4oeCwgeSlcblxuICB2YXIgdGhpc0NvcHkgPSB0aGlzLnNsaWNlKHRoaXNTdGFydCwgdGhpc0VuZClcbiAgdmFyIHRhcmdldENvcHkgPSB0YXJnZXQuc2xpY2Uoc3RhcnQsIGVuZClcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKHRoaXNDb3B5W2ldICE9PSB0YXJnZXRDb3B5W2ldKSB7XG4gICAgICB4ID0gdGhpc0NvcHlbaV1cbiAgICAgIHkgPSB0YXJnZXRDb3B5W2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuLy8gRmluZHMgZWl0aGVyIHRoZSBmaXJzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPj0gYGJ5dGVPZmZzZXRgLFxuLy8gT1IgdGhlIGxhc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0IDw9IGBieXRlT2Zmc2V0YC5cbi8vXG4vLyBBcmd1bWVudHM6XG4vLyAtIGJ1ZmZlciAtIGEgQnVmZmVyIHRvIHNlYXJjaFxuLy8gLSB2YWwgLSBhIHN0cmluZywgQnVmZmVyLCBvciBudW1iZXJcbi8vIC0gYnl0ZU9mZnNldCAtIGFuIGluZGV4IGludG8gYGJ1ZmZlcmA7IHdpbGwgYmUgY2xhbXBlZCB0byBhbiBpbnQzMlxuLy8gLSBlbmNvZGluZyAtIGFuIG9wdGlvbmFsIGVuY29kaW5nLCByZWxldmFudCBpcyB2YWwgaXMgYSBzdHJpbmdcbi8vIC0gZGlyIC0gdHJ1ZSBmb3IgaW5kZXhPZiwgZmFsc2UgZm9yIGxhc3RJbmRleE9mXG5mdW5jdGlvbiBiaWRpcmVjdGlvbmFsSW5kZXhPZiAoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgLy8gRW1wdHkgYnVmZmVyIG1lYW5zIG5vIG1hdGNoXG4gIGlmIChidWZmZXIubGVuZ3RoID09PSAwKSByZXR1cm4gLTFcblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldFxuICBpZiAodHlwZW9mIGJ5dGVPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBieXRlT2Zmc2V0XG4gICAgYnl0ZU9mZnNldCA9IDBcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0ID4gMHg3ZmZmZmZmZikge1xuICAgIGJ5dGVPZmZzZXQgPSAweDdmZmZmZmZmXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IC0weDgwMDAwMDAwKSB7XG4gICAgYnl0ZU9mZnNldCA9IC0weDgwMDAwMDAwXG4gIH1cbiAgYnl0ZU9mZnNldCA9ICtieXRlT2Zmc2V0ICAvLyBDb2VyY2UgdG8gTnVtYmVyLlxuICBpZiAoaXNOYU4oYnl0ZU9mZnNldCkpIHtcbiAgICAvLyBieXRlT2Zmc2V0OiBpdCBpdCdzIHVuZGVmaW5lZCwgbnVsbCwgTmFOLCBcImZvb1wiLCBldGMsIHNlYXJjaCB3aG9sZSBidWZmZXJcbiAgICBieXRlT2Zmc2V0ID0gZGlyID8gMCA6IChidWZmZXIubGVuZ3RoIC0gMSlcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0OiBuZWdhdGl2ZSBvZmZzZXRzIHN0YXJ0IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyXG4gIGlmIChieXRlT2Zmc2V0IDwgMCkgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggKyBieXRlT2Zmc2V0XG4gIGlmIChieXRlT2Zmc2V0ID49IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICBpZiAoZGlyKSByZXR1cm4gLTFcbiAgICBlbHNlIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoIC0gMVxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAwKSB7XG4gICAgaWYgKGRpcikgYnl0ZU9mZnNldCA9IDBcbiAgICBlbHNlIHJldHVybiAtMVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIHZhbFxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWwgPSBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICB9XG5cbiAgLy8gRmluYWxseSwgc2VhcmNoIGVpdGhlciBpbmRleE9mIChpZiBkaXIgaXMgdHJ1ZSkgb3IgbGFzdEluZGV4T2ZcbiAgaWYgKGludGVybmFsSXNCdWZmZXIodmFsKSkge1xuICAgIC8vIFNwZWNpYWwgY2FzZTogbG9va2luZyBmb3IgZW1wdHkgc3RyaW5nL2J1ZmZlciBhbHdheXMgZmFpbHNcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAweEZGIC8vIFNlYXJjaCBmb3IgYSBieXRlIHZhbHVlIFswLTI1NV1cbiAgICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiZcbiAgICAgICAgdHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgWyB2YWwgXSwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbmZ1bmN0aW9uIGFycmF5SW5kZXhPZiAoYXJyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgdmFyIGluZGV4U2l6ZSA9IDFcbiAgdmFyIGFyckxlbmd0aCA9IGFyci5sZW5ndGhcbiAgdmFyIHZhbExlbmd0aCA9IHZhbC5sZW5ndGhcblxuICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKGVuY29kaW5nID09PSAndWNzMicgfHwgZW5jb2RpbmcgPT09ICd1Y3MtMicgfHxcbiAgICAgICAgZW5jb2RpbmcgPT09ICd1dGYxNmxlJyB8fCBlbmNvZGluZyA9PT0gJ3V0Zi0xNmxlJykge1xuICAgICAgaWYgKGFyci5sZW5ndGggPCAyIHx8IHZhbC5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiAtMVxuICAgICAgfVxuICAgICAgaW5kZXhTaXplID0gMlxuICAgICAgYXJyTGVuZ3RoIC89IDJcbiAgICAgIHZhbExlbmd0aCAvPSAyXG4gICAgICBieXRlT2Zmc2V0IC89IDJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWFkIChidWYsIGkpIHtcbiAgICBpZiAoaW5kZXhTaXplID09PSAxKSB7XG4gICAgICByZXR1cm4gYnVmW2ldXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBidWYucmVhZFVJbnQxNkJFKGkgKiBpbmRleFNpemUpXG4gICAgfVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGRpcikge1xuICAgIHZhciBmb3VuZEluZGV4ID0gLTFcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpIDwgYXJyTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWFkKGFyciwgaSkgPT09IHJlYWQodmFsLCBmb3VuZEluZGV4ID09PSAtMSA/IDAgOiBpIC0gZm91bmRJbmRleCkpIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgICBpZiAoaSAtIGZvdW5kSW5kZXggKyAxID09PSB2YWxMZW5ndGgpIHJldHVybiBmb3VuZEluZGV4ICogaW5kZXhTaXplXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZm91bmRJbmRleCAhPT0gLTEpIGkgLT0gaSAtIGZvdW5kSW5kZXhcbiAgICAgICAgZm91bmRJbmRleCA9IC0xXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChieXRlT2Zmc2V0ICsgdmFsTGVuZ3RoID4gYXJyTGVuZ3RoKSBieXRlT2Zmc2V0ID0gYXJyTGVuZ3RoIC0gdmFsTGVuZ3RoXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciBmb3VuZCA9IHRydWVcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHJlYWQoYXJyLCBpICsgaikgIT09IHJlYWQodmFsLCBqKSkge1xuICAgICAgICAgIGZvdW5kID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmQpIHJldHVybiBpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gdGhpcy5pbmRleE9mKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpICE9PSAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCB0cnVlKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gbGFzdEluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGZhbHNlKVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChzdHJMZW4gJSAyICE9PSAwKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgcGFyc2VkID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGlmIChpc05hTihwYXJzZWQpKSByZXR1cm4gaVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHBhcnNlZFxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIHV0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGFzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gbGF0aW4xV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiB1Y3MyV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gd3JpdGUgKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcpXG4gIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgb2Zmc2V0WywgbGVuZ3RoXVssIGVuY29kaW5nXSlcbiAgfSBlbHNlIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGggfCAwXG4gICAgICBpZiAoZW5jb2RpbmcgPT09IHVuZGVmaW5lZCkgZW5jb2RpbmcgPSAndXRmOCdcbiAgICB9IGVsc2Uge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgLy8gbGVnYWN5IHdyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKSAtIHJlbW92ZSBpbiB2MC4xM1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCdcbiAgICApXG4gIH1cblxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGxlbmd0aCA+IHJlbWFpbmluZykgbGVuZ3RoID0gcmVtYWluaW5nXG5cbiAgaWYgKChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSkgfHwgb2Zmc2V0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGxhdGluMVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpICsgMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gfn5zdGFydFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IH5+ZW5kXG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ICs9IGxlblxuICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKSBlbmQgPSAwXG4gIH0gZWxzZSBpZiAoZW5kID4gbGVuKSB7XG4gICAgZW5kID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgdmFyIG5ld0J1ZlxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBuZXdCdWYgPSB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpXG4gICAgbmV3QnVmLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyArK2kpIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXdCdWZcbn1cblxuLypcbiAqIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgYnVmZmVyIGlzbid0IHRyeWluZyB0byB3cml0ZSBvdXQgb2YgYm91bmRzLlxuICovXG5mdW5jdGlvbiBjaGVja09mZnNldCAob2Zmc2V0LCBleHQsIGxlbmd0aCkge1xuICBpZiAoKG9mZnNldCAlIDEpICE9PSAwIHx8IG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdvZmZzZXQgaXMgbm90IHVpbnQnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gbGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRMRSA9IGZ1bmN0aW9uIHJlYWRVSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRSA9IGZ1bmN0aW9uIHJlYWRVSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiByZWFkVUludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdICogMHgxMDAwMDAwKSArXG4gICAgKCh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgIHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludExFID0gZnVuY3Rpb24gcmVhZEludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoXG4gIHZhciBtdWwgPSAxXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0taV1cbiAgd2hpbGUgKGkgPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1pXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiByZWFkSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICBpZiAoISh0aGlzW29mZnNldF0gJiAweDgwKSkgcmV0dXJuICh0aGlzW29mZnNldF0pXG4gIHJldHVybiAoKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gcmVhZEludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIDFdIHwgKHRoaXNbb2Zmc2V0XSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiByZWFkSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdKSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10gPDwgMjQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiByZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiByZWFkRmxvYXRCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgNTIsIDgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYnVmZmVyXCIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpXG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludEJFID0gZnVuY3Rpb24gd3JpdGVVSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiB3cml0ZVVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4ZmYsIDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgMik7IGkgPCBqOyArK2kpIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDQpOyBpIDwgajsgKytpKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludExFID0gZnVuY3Rpb24gd3JpdGVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpIC0gMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFID0gZnVuY3Rpb24gd3JpdGVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpICsgMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiB3cml0ZUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHg3ZiwgLTB4ODApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbmZ1bmN0aW9uIGNoZWNrSUVFRTc1NCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbiAgaWYgKG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5mdW5jdGlvbiB3cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDgsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG4gIHJldHVybiBvZmZzZXQgKyA4XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weSAodGFyZ2V0LCB0YXJnZXRTdGFydCwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0U3RhcnQgPj0gdGFyZ2V0Lmxlbmd0aCkgdGFyZ2V0U3RhcnQgPSB0YXJnZXQubGVuZ3RoXG4gIGlmICghdGFyZ2V0U3RhcnQpIHRhcmdldFN0YXJ0ID0gMFxuICBpZiAoZW5kID4gMCAmJiBlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVybiAwXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgaWYgKHRhcmdldFN0YXJ0IDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgfVxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuICB2YXIgaVxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQgJiYgc3RhcnQgPCB0YXJnZXRTdGFydCAmJiB0YXJnZXRTdGFydCA8IGVuZCkge1xuICAgIC8vIGRlc2NlbmRpbmcgY29weSBmcm9tIGVuZFxuICAgIGZvciAoaSA9IGxlbiAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIGlmIChsZW4gPCAxMDAwIHx8ICFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIGFzY2VuZGluZyBjb3B5IGZyb20gc3RhcnRcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIFVpbnQ4QXJyYXkucHJvdG90eXBlLnNldC5jYWxsKFxuICAgICAgdGFyZ2V0LFxuICAgICAgdGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLFxuICAgICAgdGFyZ2V0U3RhcnRcbiAgICApXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIFVzYWdlOlxuLy8gICAgYnVmZmVyLmZpbGwobnVtYmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChidWZmZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKHN0cmluZ1ssIG9mZnNldFssIGVuZF1dWywgZW5jb2RpbmddKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsLCBzdGFydCwgZW5kLCBlbmNvZGluZykge1xuICAvLyBIYW5kbGUgc3RyaW5nIGNhc2VzOlxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHlwZW9mIHN0YXJ0ID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBzdGFydFxuICAgICAgc3RhcnQgPSAwXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVuZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gZW5kXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH1cbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIGNvZGUgPSB2YWwuY2hhckNvZGVBdCgwKVxuICAgICAgaWYgKGNvZGUgPCAyNTYpIHtcbiAgICAgICAgdmFsID0gY29kZVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycgJiYgIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDI1NVxuICB9XG5cbiAgLy8gSW52YWxpZCByYW5nZXMgYXJlIG5vdCBzZXQgdG8gYSBkZWZhdWx0LCBzbyBjYW4gcmFuZ2UgY2hlY2sgZWFybHkuXG4gIGlmIChzdGFydCA8IDAgfHwgdGhpcy5sZW5ndGggPCBzdGFydCB8fCB0aGlzLmxlbmd0aCA8IGVuZCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdPdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzdGFydCA9IHN0YXJ0ID4+PiAwXG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gdGhpcy5sZW5ndGggOiBlbmQgPj4+IDBcblxuICBpZiAoIXZhbCkgdmFsID0gMFxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICAgIHRoaXNbaV0gPSB2YWxcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJ5dGVzID0gaW50ZXJuYWxJc0J1ZmZlcih2YWwpXG4gICAgICA/IHZhbFxuICAgICAgOiB1dGY4VG9CeXRlcyhuZXcgQnVmZmVyKHZhbCwgZW5jb2RpbmcpLnRvU3RyaW5nKCkpXG4gICAgdmFyIGxlbiA9IGJ5dGVzLmxlbmd0aFxuICAgIGZvciAoaSA9IDA7IGkgPCBlbmQgLSBzdGFydDsgKytpKSB7XG4gICAgICB0aGlzW2kgKyBzdGFydF0gPSBieXRlc1tpICUgbGVuXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxudmFyIElOVkFMSURfQkFTRTY0X1JFID0gL1teK1xcLzAtOUEtWmEtei1fXS9nXG5cbmZ1bmN0aW9uIGJhc2U2NGNsZWFuIChzdHIpIHtcbiAgLy8gTm9kZSBzdHJpcHMgb3V0IGludmFsaWQgY2hhcmFjdGVycyBsaWtlIFxcbiBhbmQgXFx0IGZyb20gdGhlIHN0cmluZywgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHN0ciA9IHN0cmluZ3RyaW0oc3RyKS5yZXBsYWNlKElOVkFMSURfQkFTRTY0X1JFLCAnJylcbiAgLy8gTm9kZSBjb252ZXJ0cyBzdHJpbmdzIHdpdGggbGVuZ3RoIDwgMiB0byAnJ1xuICBpZiAoc3RyLmxlbmd0aCA8IDIpIHJldHVybiAnJ1xuICAvLyBOb2RlIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBiYXNlNjQgc3RyaW5ncyAobWlzc2luZyB0cmFpbGluZyA9PT0pLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgd2hpbGUgKHN0ci5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgc3RyID0gc3RyICsgJz0nXG4gIH1cbiAgcmV0dXJuIHN0clxufVxuXG5mdW5jdGlvbiBzdHJpbmd0cmltIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKVxuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHJpbmcsIHVuaXRzKSB7XG4gIHVuaXRzID0gdW5pdHMgfHwgSW5maW5pdHlcbiAgdmFyIGNvZGVQb2ludFxuICB2YXIgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aFxuICB2YXIgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcbiAgdmFyIGJ5dGVzID0gW11cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgY29kZVBvaW50ID0gc3RyaW5nLmNoYXJDb2RlQXQoaSlcblxuICAgIC8vIGlzIHN1cnJvZ2F0ZSBjb21wb25lbnRcbiAgICBpZiAoY29kZVBvaW50ID4gMHhEN0ZGICYmIGNvZGVQb2ludCA8IDB4RTAwMCkge1xuICAgICAgLy8gbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICghbGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgICAvLyBubyBsZWFkIHlldFxuICAgICAgICBpZiAoY29kZVBvaW50ID4gMHhEQkZGKSB7XG4gICAgICAgICAgLy8gdW5leHBlY3RlZCB0cmFpbFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSBpZiAoaSArIDEgPT09IGxlbmd0aCkge1xuICAgICAgICAgIC8vIHVucGFpcmVkIGxlYWRcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsaWQgbGVhZFxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gMiBsZWFkcyBpbiBhIHJvd1xuICAgICAgaWYgKGNvZGVQb2ludCA8IDB4REMwMCkge1xuICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyB2YWxpZCBzdXJyb2dhdGUgcGFpclxuICAgICAgY29kZVBvaW50ID0gKGxlYWRTdXJyb2dhdGUgLSAweEQ4MDAgPDwgMTAgfCBjb2RlUG9pbnQgLSAweERDMDApICsgMHgxMDAwMFxuICAgIH0gZWxzZSBpZiAobGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgLy8gdmFsaWQgYm1wIGNoYXIsIGJ1dCBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgfVxuXG4gICAgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcblxuICAgIC8vIGVuY29kZSB1dGY4XG4gICAgaWYgKGNvZGVQb2ludCA8IDB4ODApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMSkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChjb2RlUG9pbnQpXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDgwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2IHwgMHhDMCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyB8IDB4RTAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDQpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDEyIHwgMHhGMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2RlIHBvaW50JylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnl0ZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0ciwgdW5pdHMpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcblxuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoYmFzZTY0Y2xlYW4oc3RyKSlcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gaXNuYW4gKHZhbCkge1xuICByZXR1cm4gdmFsICE9PSB2YWwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zZWxmLWNvbXBhcmVcbn1cblxuXG4vLyB0aGUgZm9sbG93aW5nIGlzIGZyb20gaXMtYnVmZmVyLCBhbHNvIGJ5IEZlcm9zcyBBYm91a2hhZGlqZWggYW5kIHdpdGggc2FtZSBsaXNlbmNlXG4vLyBUaGUgX2lzQnVmZmVyIGNoZWNrIGlzIGZvciBTYWZhcmkgNS03IHN1cHBvcnQsIGJlY2F1c2UgaXQncyBtaXNzaW5nXG4vLyBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yLiBSZW1vdmUgdGhpcyBldmVudHVhbGx5XG5leHBvcnQgZnVuY3Rpb24gaXNCdWZmZXIob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoISFvYmouX2lzQnVmZmVyIHx8IGlzRmFzdEJ1ZmZlcihvYmopIHx8IGlzU2xvd0J1ZmZlcihvYmopKVxufVxuXG5mdW5jdGlvbiBpc0Zhc3RCdWZmZXIgKG9iaikge1xuICByZXR1cm4gISFvYmouY29uc3RydWN0b3IgJiYgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKVxufVxuXG4vLyBGb3IgTm9kZSB2MC4xMCBzdXBwb3J0LiBSZW1vdmUgdGhpcyBldmVudHVhbGx5LlxuZnVuY3Rpb24gaXNTbG93QnVmZmVyIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmoucmVhZEZsb2F0TEUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5zbGljZSA9PT0gJ2Z1bmN0aW9uJyAmJiBpc0Zhc3RCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7QnVmZmVyfSBmcm9tICdidWZmZXInO1xudmFyIGlzQnVmZmVyRW5jb2RpbmcgPSBCdWZmZXIuaXNFbmNvZGluZ1xuICB8fCBmdW5jdGlvbihlbmNvZGluZykge1xuICAgICAgIHN3aXRjaCAoZW5jb2RpbmcgJiYgZW5jb2RpbmcudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgY2FzZSAnaGV4JzogY2FzZSAndXRmOCc6IGNhc2UgJ3V0Zi04JzogY2FzZSAnYXNjaWknOiBjYXNlICdiaW5hcnknOiBjYXNlICdiYXNlNjQnOiBjYXNlICd1Y3MyJzogY2FzZSAndWNzLTInOiBjYXNlICd1dGYxNmxlJzogY2FzZSAndXRmLTE2bGUnOiBjYXNlICdyYXcnOiByZXR1cm4gdHJ1ZTtcbiAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBmYWxzZTtcbiAgICAgICB9XG4gICAgIH1cblxuXG5mdW5jdGlvbiBhc3NlcnRFbmNvZGluZyhlbmNvZGluZykge1xuICBpZiAoZW5jb2RpbmcgJiYgIWlzQnVmZmVyRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpO1xuICB9XG59XG5cbi8vIFN0cmluZ0RlY29kZXIgcHJvdmlkZXMgYW4gaW50ZXJmYWNlIGZvciBlZmZpY2llbnRseSBzcGxpdHRpbmcgYSBzZXJpZXMgb2Zcbi8vIGJ1ZmZlcnMgaW50byBhIHNlcmllcyBvZiBKUyBzdHJpbmdzIHdpdGhvdXQgYnJlYWtpbmcgYXBhcnQgbXVsdGktYnl0ZVxuLy8gY2hhcmFjdGVycy4gQ0VTVS04IGlzIGhhbmRsZWQgYXMgcGFydCBvZiB0aGUgVVRGLTggZW5jb2RpbmcuXG4vL1xuLy8gQFRPRE8gSGFuZGxpbmcgYWxsIGVuY29kaW5ncyBpbnNpZGUgYSBzaW5nbGUgb2JqZWN0IG1ha2VzIGl0IHZlcnkgZGlmZmljdWx0XG4vLyB0byByZWFzb24gYWJvdXQgdGhpcyBjb2RlLCBzbyBpdCBzaG91bGQgYmUgc3BsaXQgdXAgaW4gdGhlIGZ1dHVyZS5cbi8vIEBUT0RPIFRoZXJlIHNob3VsZCBiZSBhIHV0Zjgtc3RyaWN0IGVuY29kaW5nIHRoYXQgcmVqZWN0cyBpbnZhbGlkIFVURi04IGNvZGVcbi8vIHBvaW50cyBhcyB1c2VkIGJ5IENFU1UtOC5cbmV4cG9ydCBmdW5jdGlvbiBTdHJpbmdEZWNvZGVyKGVuY29kaW5nKSB7XG4gIHRoaXMuZW5jb2RpbmcgPSAoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1stX10vLCAnJyk7XG4gIGFzc2VydEVuY29kaW5nKGVuY29kaW5nKTtcbiAgc3dpdGNoICh0aGlzLmVuY29kaW5nKSB7XG4gICAgY2FzZSAndXRmOCc6XG4gICAgICAvLyBDRVNVLTggcmVwcmVzZW50cyBlYWNoIG9mIFN1cnJvZ2F0ZSBQYWlyIGJ5IDMtYnl0ZXNcbiAgICAgIHRoaXMuc3Vycm9nYXRlU2l6ZSA9IDM7XG4gICAgICBicmVhaztcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIC8vIFVURi0xNiByZXByZXNlbnRzIGVhY2ggb2YgU3Vycm9nYXRlIFBhaXIgYnkgMi1ieXRlc1xuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMjtcbiAgICAgIHRoaXMuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSB1dGYxNkRldGVjdEluY29tcGxldGVDaGFyO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIC8vIEJhc2UtNjQgc3RvcmVzIDMgYnl0ZXMgaW4gNCBjaGFycywgYW5kIHBhZHMgdGhlIHJlbWFpbmRlci5cbiAgICAgIHRoaXMuc3Vycm9nYXRlU2l6ZSA9IDM7XG4gICAgICB0aGlzLmRldGVjdEluY29tcGxldGVDaGFyID0gYmFzZTY0RGV0ZWN0SW5jb21wbGV0ZUNoYXI7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhpcy53cml0ZSA9IHBhc3NUaHJvdWdoV3JpdGU7XG4gICAgICByZXR1cm47XG4gIH1cblxuICAvLyBFbm91Z2ggc3BhY2UgdG8gc3RvcmUgYWxsIGJ5dGVzIG9mIGEgc2luZ2xlIGNoYXJhY3Rlci4gVVRGLTggbmVlZHMgNFxuICAvLyBieXRlcywgYnV0IENFU1UtOCBtYXkgcmVxdWlyZSB1cCB0byA2ICgzIGJ5dGVzIHBlciBzdXJyb2dhdGUpLlxuICB0aGlzLmNoYXJCdWZmZXIgPSBuZXcgQnVmZmVyKDYpO1xuICAvLyBOdW1iZXIgb2YgYnl0ZXMgcmVjZWl2ZWQgZm9yIHRoZSBjdXJyZW50IGluY29tcGxldGUgbXVsdGktYnl0ZSBjaGFyYWN0ZXIuXG4gIHRoaXMuY2hhclJlY2VpdmVkID0gMDtcbiAgLy8gTnVtYmVyIG9mIGJ5dGVzIGV4cGVjdGVkIGZvciB0aGUgY3VycmVudCBpbmNvbXBsZXRlIG11bHRpLWJ5dGUgY2hhcmFjdGVyLlxuICB0aGlzLmNoYXJMZW5ndGggPSAwO1xufTtcblxuXG4vLyB3cml0ZSBkZWNvZGVzIHRoZSBnaXZlbiBidWZmZXIgYW5kIHJldHVybnMgaXQgYXMgSlMgc3RyaW5nIHRoYXQgaXNcbi8vIGd1YXJhbnRlZWQgdG8gbm90IGNvbnRhaW4gYW55IHBhcnRpYWwgbXVsdGktYnl0ZSBjaGFyYWN0ZXJzLiBBbnkgcGFydGlhbFxuLy8gY2hhcmFjdGVyIGZvdW5kIGF0IHRoZSBlbmQgb2YgdGhlIGJ1ZmZlciBpcyBidWZmZXJlZCB1cCwgYW5kIHdpbGwgYmVcbi8vIHJldHVybmVkIHdoZW4gY2FsbGluZyB3cml0ZSBhZ2FpbiB3aXRoIHRoZSByZW1haW5pbmcgYnl0ZXMuXG4vL1xuLy8gTm90ZTogQ29udmVydGluZyBhIEJ1ZmZlciBjb250YWluaW5nIGFuIG9ycGhhbiBzdXJyb2dhdGUgdG8gYSBTdHJpbmdcbi8vIGN1cnJlbnRseSB3b3JrcywgYnV0IGNvbnZlcnRpbmcgYSBTdHJpbmcgdG8gYSBCdWZmZXIgKHZpYSBgbmV3IEJ1ZmZlcmAsIG9yXG4vLyBCdWZmZXIjd3JpdGUpIHdpbGwgcmVwbGFjZSBpbmNvbXBsZXRlIHN1cnJvZ2F0ZXMgd2l0aCB0aGUgdW5pY29kZVxuLy8gcmVwbGFjZW1lbnQgY2hhcmFjdGVyLiBTZWUgaHR0cHM6Ly9jb2RlcmV2aWV3LmNocm9taXVtLm9yZy8xMjExNzMwMDkvIC5cblN0cmluZ0RlY29kZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oYnVmZmVyKSB7XG4gIHZhciBjaGFyU3RyID0gJyc7XG4gIC8vIGlmIG91ciBsYXN0IHdyaXRlIGVuZGVkIHdpdGggYW4gaW5jb21wbGV0ZSBtdWx0aWJ5dGUgY2hhcmFjdGVyXG4gIHdoaWxlICh0aGlzLmNoYXJMZW5ndGgpIHtcbiAgICAvLyBkZXRlcm1pbmUgaG93IG1hbnkgcmVtYWluaW5nIGJ5dGVzIHRoaXMgYnVmZmVyIGhhcyB0byBvZmZlciBmb3IgdGhpcyBjaGFyXG4gICAgdmFyIGF2YWlsYWJsZSA9IChidWZmZXIubGVuZ3RoID49IHRoaXMuY2hhckxlbmd0aCAtIHRoaXMuY2hhclJlY2VpdmVkKSA/XG4gICAgICAgIHRoaXMuY2hhckxlbmd0aCAtIHRoaXMuY2hhclJlY2VpdmVkIDpcbiAgICAgICAgYnVmZmVyLmxlbmd0aDtcblxuICAgIC8vIGFkZCB0aGUgbmV3IGJ5dGVzIHRvIHRoZSBjaGFyIGJ1ZmZlclxuICAgIGJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgdGhpcy5jaGFyUmVjZWl2ZWQsIDAsIGF2YWlsYWJsZSk7XG4gICAgdGhpcy5jaGFyUmVjZWl2ZWQgKz0gYXZhaWxhYmxlO1xuXG4gICAgaWYgKHRoaXMuY2hhclJlY2VpdmVkIDwgdGhpcy5jaGFyTGVuZ3RoKSB7XG4gICAgICAvLyBzdGlsbCBub3QgZW5vdWdoIGNoYXJzIGluIHRoaXMgYnVmZmVyPyB3YWl0IGZvciBtb3JlIC4uLlxuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBieXRlcyBiZWxvbmdpbmcgdG8gdGhlIGN1cnJlbnQgY2hhcmFjdGVyIGZyb20gdGhlIGJ1ZmZlclxuICAgIGJ1ZmZlciA9IGJ1ZmZlci5zbGljZShhdmFpbGFibGUsIGJ1ZmZlci5sZW5ndGgpO1xuXG4gICAgLy8gZ2V0IHRoZSBjaGFyYWN0ZXIgdGhhdCB3YXMgc3BsaXRcbiAgICBjaGFyU3RyID0gdGhpcy5jaGFyQnVmZmVyLnNsaWNlKDAsIHRoaXMuY2hhckxlbmd0aCkudG9TdHJpbmcodGhpcy5lbmNvZGluZyk7XG5cbiAgICAvLyBDRVNVLTg6IGxlYWQgc3Vycm9nYXRlIChEODAwLURCRkYpIGlzIGFsc28gdGhlIGluY29tcGxldGUgY2hhcmFjdGVyXG4gICAgdmFyIGNoYXJDb2RlID0gY2hhclN0ci5jaGFyQ29kZUF0KGNoYXJTdHIubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGNoYXJDb2RlID49IDB4RDgwMCAmJiBjaGFyQ29kZSA8PSAweERCRkYpIHtcbiAgICAgIHRoaXMuY2hhckxlbmd0aCArPSB0aGlzLnN1cnJvZ2F0ZVNpemU7XG4gICAgICBjaGFyU3RyID0gJyc7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgdGhpcy5jaGFyUmVjZWl2ZWQgPSB0aGlzLmNoYXJMZW5ndGggPSAwO1xuXG4gICAgLy8gaWYgdGhlcmUgYXJlIG5vIG1vcmUgYnl0ZXMgaW4gdGhpcyBidWZmZXIsIGp1c3QgZW1pdCBvdXIgY2hhclxuICAgIGlmIChidWZmZXIubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY2hhclN0cjtcbiAgICB9XG4gICAgYnJlYWs7XG4gIH1cblxuICAvLyBkZXRlcm1pbmUgYW5kIHNldCBjaGFyTGVuZ3RoIC8gY2hhclJlY2VpdmVkXG4gIHRoaXMuZGV0ZWN0SW5jb21wbGV0ZUNoYXIoYnVmZmVyKTtcblxuICB2YXIgZW5kID0gYnVmZmVyLmxlbmd0aDtcbiAgaWYgKHRoaXMuY2hhckxlbmd0aCkge1xuICAgIC8vIGJ1ZmZlciB0aGUgaW5jb21wbGV0ZSBjaGFyYWN0ZXIgYnl0ZXMgd2UgZ290XG4gICAgYnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCAwLCBidWZmZXIubGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQsIGVuZCk7XG4gICAgZW5kIC09IHRoaXMuY2hhclJlY2VpdmVkO1xuICB9XG5cbiAgY2hhclN0ciArPSBidWZmZXIudG9TdHJpbmcodGhpcy5lbmNvZGluZywgMCwgZW5kKTtcblxuICB2YXIgZW5kID0gY2hhclN0ci5sZW5ndGggLSAxO1xuICB2YXIgY2hhckNvZGUgPSBjaGFyU3RyLmNoYXJDb2RlQXQoZW5kKTtcbiAgLy8gQ0VTVS04OiBsZWFkIHN1cnJvZ2F0ZSAoRDgwMC1EQkZGKSBpcyBhbHNvIHRoZSBpbmNvbXBsZXRlIGNoYXJhY3RlclxuICBpZiAoY2hhckNvZGUgPj0gMHhEODAwICYmIGNoYXJDb2RlIDw9IDB4REJGRikge1xuICAgIHZhciBzaXplID0gdGhpcy5zdXJyb2dhdGVTaXplO1xuICAgIHRoaXMuY2hhckxlbmd0aCArPSBzaXplO1xuICAgIHRoaXMuY2hhclJlY2VpdmVkICs9IHNpemU7XG4gICAgdGhpcy5jaGFyQnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCBzaXplLCAwLCBzaXplKTtcbiAgICBidWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIDAsIDAsIHNpemUpO1xuICAgIHJldHVybiBjaGFyU3RyLnN1YnN0cmluZygwLCBlbmQpO1xuICB9XG5cbiAgLy8gb3IganVzdCBlbWl0IHRoZSBjaGFyU3RyXG4gIHJldHVybiBjaGFyU3RyO1xufTtcblxuLy8gZGV0ZWN0SW5jb21wbGV0ZUNoYXIgZGV0ZXJtaW5lcyBpZiB0aGVyZSBpcyBhbiBpbmNvbXBsZXRlIFVURi04IGNoYXJhY3RlciBhdFxuLy8gdGhlIGVuZCBvZiB0aGUgZ2l2ZW4gYnVmZmVyLiBJZiBzbywgaXQgc2V0cyB0aGlzLmNoYXJMZW5ndGggdG8gdGhlIGJ5dGVcbi8vIGxlbmd0aCB0aGF0IGNoYXJhY3RlciwgYW5kIHNldHMgdGhpcy5jaGFyUmVjZWl2ZWQgdG8gdGhlIG51bWJlciBvZiBieXRlc1xuLy8gdGhhdCBhcmUgYXZhaWxhYmxlIGZvciB0aGlzIGNoYXJhY3Rlci5cblN0cmluZ0RlY29kZXIucHJvdG90eXBlLmRldGVjdEluY29tcGxldGVDaGFyID0gZnVuY3Rpb24oYnVmZmVyKSB7XG4gIC8vIGRldGVybWluZSBob3cgbWFueSBieXRlcyB3ZSBoYXZlIHRvIGNoZWNrIGF0IHRoZSBlbmQgb2YgdGhpcyBidWZmZXJcbiAgdmFyIGkgPSAoYnVmZmVyLmxlbmd0aCA+PSAzKSA/IDMgOiBidWZmZXIubGVuZ3RoO1xuXG4gIC8vIEZpZ3VyZSBvdXQgaWYgb25lIG9mIHRoZSBsYXN0IGkgYnl0ZXMgb2Ygb3VyIGJ1ZmZlciBhbm5vdW5jZXMgYW5cbiAgLy8gaW5jb21wbGV0ZSBjaGFyLlxuICBmb3IgKDsgaSA+IDA7IGktLSkge1xuICAgIHZhciBjID0gYnVmZmVyW2J1ZmZlci5sZW5ndGggLSBpXTtcblxuICAgIC8vIFNlZSBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1VURi04I0Rlc2NyaXB0aW9uXG5cbiAgICAvLyAxMTBYWFhYWFxuICAgIGlmIChpID09IDEgJiYgYyA+PiA1ID09IDB4MDYpIHtcbiAgICAgIHRoaXMuY2hhckxlbmd0aCA9IDI7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyAxMTEwWFhYWFxuICAgIGlmIChpIDw9IDIgJiYgYyA+PiA0ID09IDB4MEUpIHtcbiAgICAgIHRoaXMuY2hhckxlbmd0aCA9IDM7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyAxMTExMFhYWFxuICAgIGlmIChpIDw9IDMgJiYgYyA+PiAzID09IDB4MUUpIHtcbiAgICAgIHRoaXMuY2hhckxlbmd0aCA9IDQ7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSBpO1xufTtcblxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oYnVmZmVyKSB7XG4gIHZhciByZXMgPSAnJztcbiAgaWYgKGJ1ZmZlciAmJiBidWZmZXIubGVuZ3RoKVxuICAgIHJlcyA9IHRoaXMud3JpdGUoYnVmZmVyKTtcblxuICBpZiAodGhpcy5jaGFyUmVjZWl2ZWQpIHtcbiAgICB2YXIgY3IgPSB0aGlzLmNoYXJSZWNlaXZlZDtcbiAgICB2YXIgYnVmID0gdGhpcy5jaGFyQnVmZmVyO1xuICAgIHZhciBlbmMgPSB0aGlzLmVuY29kaW5nO1xuICAgIHJlcyArPSBidWYuc2xpY2UoMCwgY3IpLnRvU3RyaW5nKGVuYyk7XG4gIH1cblxuICByZXR1cm4gcmVzO1xufTtcblxuZnVuY3Rpb24gcGFzc1Rocm91Z2hXcml0ZShidWZmZXIpIHtcbiAgcmV0dXJuIGJ1ZmZlci50b1N0cmluZyh0aGlzLmVuY29kaW5nKTtcbn1cblxuZnVuY3Rpb24gdXRmMTZEZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpIHtcbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSBidWZmZXIubGVuZ3RoICUgMjtcbiAgdGhpcy5jaGFyTGVuZ3RoID0gdGhpcy5jaGFyUmVjZWl2ZWQgPyAyIDogMDtcbn1cblxuZnVuY3Rpb24gYmFzZTY0RGV0ZWN0SW5jb21wbGV0ZUNoYXIoYnVmZmVyKSB7XG4gIHRoaXMuY2hhclJlY2VpdmVkID0gYnVmZmVyLmxlbmd0aCAlIDM7XG4gIHRoaXMuY2hhckxlbmd0aCA9IHRoaXMuY2hhclJlY2VpdmVkID8gMyA6IDA7XG59XG4iLCJpbXBvcnQge2dlbmVyYXRlU2NoZW1hfSBmcm9tIFwiLi9pbmRleFNjaGVtYUNyZWF0b3JcIjtcbmltcG9ydCB7IGhhcywgaXNTdHJpbmcsIGRpZmZlcmVuY2UsIGZpbmQgfSBmcm9tIFwibG9kYXNoL2ZwXCI7XG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwic2FmZS1idWZmZXJcIjtcbmltcG9ydCB7U3RyaW5nRGVjb2Rlcn0gZnJvbSBcInN0cmluZ19kZWNvZGVyXCI7XG5pbXBvcnQge2dldFR5cGV9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgaXNTb21ldGhpbmcgfSBmcm9tIFwiLi4vY29tbW9uXCI7XG5cbmV4cG9ydCBjb25zdCBCVUZGRVJfTUFYX0JZVEVTID0gNTI0Mjg4OyAvLyAwLjVNYlxuXG5leHBvcnQgY29uc3QgQ09OVElOVUVfUkVBRElOR19SRUNPUkRTID0gXCJDT05USU5VRV9SRUFESU5HXCI7XG5leHBvcnQgY29uc3QgUkVBRF9SRU1BSU5JTkdfVEVYVCA9IFwiUkVBRF9SRU1BSU5JTkdcIjtcbmV4cG9ydCBjb25zdCBDQU5DRUxfUkVBRCA9IFwiQ0FOQ0VMXCI7XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleFdyaXRlciA9IChoaWVyYXJjaHksIGluZGV4Tm9kZSwgcmVhZGFibGVTdHJlYW0sIHdyaXRhYmxlU3RyZWFtLCBlbmQpID0+IHtcbiAgICBjb25zdCBzY2hlbWEgPSBnZW5lcmF0ZVNjaGVtYShoaWVyYXJjaHksIGluZGV4Tm9kZSk7XG5cbiAgICByZXR1cm4gKHtcbiAgICAgICAgcmVhZDogcmVhZChyZWFkYWJsZVN0cmVhbSwgc2NoZW1hKSxcbiAgICAgICAgdXBkYXRlSW5kZXg6IHVwZGF0ZUluZGV4KHJlYWRhYmxlU3RyZWFtLCB3cml0YWJsZVN0cmVhbSwgc2NoZW1hLCBlbmQpXG4gICAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhSZWFkZXIgPSAoaGllcmFyY2h5LCBpbmRleE5vZGUsIHJlYWRhYmxlU3RyZWFtKSA9PiBcbiAgICByZWFkKFxuICAgICAgICByZWFkYWJsZVN0cmVhbSwgXG4gICAgICAgIGdlbmVyYXRlU2NoZW1hKGhpZXJhcmNoeSwgaW5kZXhOb2RlKVxuICAgICk7XG5cbmNvbnN0IHVwZGF0ZUluZGV4ID0gKHJlYWRhYmxlU3RyZWFtLCB3cml0YWJsZVN0cmVhbSwgc2NoZW1hKSA9PiBhc3luYyAoaXRlbXNUb1dyaXRlLCBrZXlzVG9SZW1vdmUpID0+IHtcbiAgICBjb25zdCB3cml0ZSA9IG5ld091dHB1dFdyaXRlcihCVUZGRVJfTUFYX0JZVEVTLCB3cml0YWJsZVN0cmVhbSk7XG4gICAgY29uc3Qgd3JpdHRlbkl0ZW1zID0gW107IFxuICAgIGF3YWl0IHJlYWQocmVhZGFibGVTdHJlYW0sIHNjaGVtYSkoXG4gICAgICAgIGFzeW5jIGluZGV4ZWRJdGVtID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBmaW5kKGkgPT4gaW5kZXhlZEl0ZW0ua2V5ID09PSBpLmtleSkoaXRlbXNUb1dyaXRlKTtcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZWQgPSBmaW5kKGsgPT4gaW5kZXhlZEl0ZW0ua2V5ID09PSBrKShrZXlzVG9SZW1vdmUpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZihpc1NvbWV0aGluZyhyZW1vdmVkKSkgXG4gICAgICAgICAgICAgICAgcmV0dXJuIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcblxuICAgICAgICAgICAgaWYoaXNTb21ldGhpbmcodXBkYXRlZCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzZXJpYWxpemVkSXRlbSA9ICBzZXJpYWxpemVJdGVtKHNjaGVtYSwgdXBkYXRlZCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgd3JpdGUoc2VyaWFsaXplZEl0ZW0pO1xuICAgICAgICAgICAgICAgIHdyaXR0ZW5JdGVtcy5wdXNoKHVwZGF0ZWQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB3cml0ZShcbiAgICAgICAgICAgICAgICAgICAgc2VyaWFsaXplSXRlbShzY2hlbWEsIGluZGV4ZWRJdGVtKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IFxuXG4gICAgICAgICAgICByZXR1cm4gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGFzeW5jIHRleHQgPT4gYXdhaXQgd3JpdGUodGV4dClcbiAgICApO1xuXG4gICAgaWYod3JpdHRlbkl0ZW1zLmxlbmd0aCAhPT0gaXRlbXNUb1dyaXRlLmxlbmd0aCkge1xuICAgICAgICBjb25zdCB0b0FkZCA9IGRpZmZlcmVuY2UoaXRlbXNUb1dyaXRlLCB3cml0dGVuSXRlbXMpO1xuICAgICAgICBmb3IobGV0IGFkZGVkIG9mIHRvQWRkKSB7XG4gICAgICAgICAgICBhd2FpdCB3cml0ZShcbiAgICAgICAgICAgICAgICBzZXJpYWxpemVJdGVtKHNjaGVtYSwgYWRkZWQpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmKHdyaXR0ZW5JdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgLy8gcG90ZW50aWFsbHkgYXJlIG5vIHJlY29yZHNcbiAgICAgICAgYXdhaXQgd3JpdGUoXCJcIik7XG4gICAgfVxuXG4gICAgYXdhaXQgd3JpdGUoKTtcbiAgICBhd2FpdCB3cml0YWJsZVN0cmVhbS5lbmQoKTtcbn07XG5cbmNvbnN0IHJlYWQgPSAocmVhZGFibGVTdHJlYW0sIHNjaGVtYSkgPT4gYXN5bmMgKG9uR2V0SXRlbSwgb25HZXRUZXh0KSA9PiB7XG4gICAgY29uc3QgcmVhZElucHV0ID0gbmV3SW5wdXRSZWFkZXIocmVhZGFibGVTdHJlYW0pO1xuICAgIGxldCB0ZXh0ID0gYXdhaXQgcmVhZElucHV0KCk7XG4gICAgbGV0IHN0YXR1cyA9IENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcbiAgICB3aGlsZSh0ZXh0Lmxlbmd0aCA+IDApIHtcblxuICAgICAgICBpZihzdGF0dXMgPT09IFJFQURfUkVNQUlOSU5HX1RFWFQpIHtcbiAgICAgICAgICAgIGF3YWl0IG9uR2V0VGV4dCh0ZXh0KTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoc3RhdHVzID09PSBDQU5DRUxfUkVBRCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJvd1RleHQgPSBcIlwiO1xuICAgICAgICBsZXQgY3VycmVudENoYXJJbmRleD0wO1xuICAgICAgICBmb3IobGV0IGN1cnJlbnRDaGFyIG9mIHRleHQpIHtcbiAgICAgICAgICAgIHJvd1RleHQgKz0gY3VycmVudENoYXI7XG4gICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCJcXHJcIikge1xuICAgICAgICAgICAgICAgIHN0YXR1cyA9IGF3YWl0IG9uR2V0SXRlbShcbiAgICAgICAgICAgICAgICAgICAgZGVzZXJpYWxpemVSb3coc2NoZW1hLCByb3dUZXh0KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcm93VGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgaWYoc3RhdHVzID09PSBSRUFEX1JFTUFJTklOR19URVhUKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1cnJlbnRDaGFySW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGN1cnJlbnRDaGFySW5kZXggPCB0ZXh0Lmxlbmd0aCAtMSkge1xuICAgICAgICAgICAgYXdhaXQgb25HZXRUZXh0KHRleHQuc3Vic3RyaW5nKGN1cnJlbnRDaGFySW5kZXggKyAxKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0ZXh0ID0gYXdhaXQgcmVhZElucHV0KCk7XG4gICAgfVxuXG4gICAgYXdhaXQgcmVhZGFibGVTdHJlYW0uZGVzdHJveSgpO1xuXG59O1xuXG5jb25zdCBuZXdPdXRwdXRXcml0ZXIgPSAoZmx1c2hCb3VuZGFyeSwgd3JpdGFibGVTdHJlYW0pID0+IHtcbiAgICBcbiAgICBsZXQgY3VycmVudEJ1ZmZlciA9IG51bGw7XG5cbiAgICByZXR1cm4gYXN5bmMgKHRleHQpID0+IHtcblxuICAgICAgICBpZihpc1N0cmluZyh0ZXh0KSAmJiBjdXJyZW50QnVmZmVyID09PSBudWxsKVxuICAgICAgICAgICAgY3VycmVudEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKHRleHQsIFwidXRmOFwiKTtcbiAgICAgICAgZWxzZSBpZihpc1N0cmluZyh0ZXh0KSlcbiAgICAgICAgICAgIGN1cnJlbnRCdWZmZXIgPSBCdWZmZXIuY29uY2F0KFtcbiAgICAgICAgICAgICAgICBjdXJyZW50QnVmZmVyLFxuICAgICAgICAgICAgICAgIEJ1ZmZlci5mcm9tKHRleHQsIFwidXRmOFwiKVxuICAgICAgICAgICAgXSk7XG4gICAgICAgIFxuICAgICAgICBpZihjdXJyZW50QnVmZmVyICE9PSBudWxsICYmXG4gICAgICAgICAgICAoY3VycmVudEJ1ZmZlci5sZW5ndGggPiBmbHVzaEJvdW5kYXJ5XG4gICAgICAgICAgICAgfHwgIWlzU3RyaW5nKHRleHQpKSkge1xuXG4gICAgICAgICAgICBhd2FpdCB3cml0YWJsZVN0cmVhbS53cml0ZShjdXJyZW50QnVmZmVyKTtcbiAgICAgICAgICAgIGN1cnJlbnRCdWZmZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuY29uc3QgbmV3SW5wdXRSZWFkZXIgPSAocmVhZGFibGVTdHJlYW0pID0+IHtcblxuICAgIGNvbnN0IGRlY29kZXIgPSBuZXcgU3RyaW5nRGVjb2RlcigndXRmOCcpO1xuICAgIGxldCByZW1haW5pbmdCeXRlcyA9IFtdO1xuXG4gICAgcmV0dXJuIGFzeW5jICgpID0+IHtcblxuICAgICAgICBsZXQgbmV4dEJ5dGVzQnVmZmVyID0gYXdhaXQgcmVhZGFibGVTdHJlYW0ucmVhZChCVUZGRVJfTUFYX0JZVEVTKTtcbiAgICAgICAgY29uc3QgcmVtYWluaW5nQnVmZmVyID0gQnVmZmVyLmZyb20ocmVtYWluaW5nQnl0ZXMpO1xuXG4gICAgICAgIGlmKCFuZXh0Qnl0ZXNCdWZmZXIpIG5leHRCeXRlc0J1ZmZlciA9IEJ1ZmZlci5mcm9tKFtdKTtcblxuICAgICAgICBjb25zdCBtb3JlVG9SZWFkID0gbmV4dEJ5dGVzQnVmZmVyLmxlbmd0aCA9PT0gQlVGRkVSX01BWF9CWVRFUztcblxuICAgICAgICBjb25zdCBidWZmZXIgPSBCdWZmZXIuY29uY2F0KFxuICAgICAgICAgICAgW3JlbWFpbmluZ0J1ZmZlciwgbmV4dEJ5dGVzQnVmZmVyXSxcbiAgICAgICAgICAgIHJlbWFpbmluZ0J1ZmZlci5sZW5ndGggKyBuZXh0Qnl0ZXNCdWZmZXIubGVuZ3RoKTtcblxuICAgICAgICBjb25zdCB0ZXh0ID0gZGVjb2Rlci53cml0ZShidWZmZXIpO1xuICAgICAgICByZW1haW5pbmdCeXRlcyA9IGRlY29kZXIuZW5kKGJ1ZmZlcik7XG5cbiAgICAgICAgaWYoIW1vcmVUb1JlYWQgJiYgcmVtYWluaW5nQnl0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gaWYgZm9yIGFueSByZWFzb24sIHdlIGhhdmUgcmVtYWluaW5nIGJ5dGVzIGF0IHRoZSBlbmRcbiAgICAgICAgICAgIC8vIG9mIHRoZSBzdHJlYW0sIGp1c3QgZGlzY2FyZCAtIGRvbnQgc2VlIHdoeSB0aGlzIHNob3VsZFxuICAgICAgICAgICAgLy8gZXZlciBoYXBwZW4sIGJ1dCBpZiBpdCBkb2VzLCBpdCBjb3VsZCBjYXVzZSBhIHN0YWNrIG92ZXJmbG93XG4gICAgICAgICAgICByZW1haW5pbmdCeXRlcyA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfTtcbn07XG5cbmNvbnN0IGRlc2VyaWFsaXplUm93ID0gKHNjaGVtYSwgcm93VGV4dCkgPT4ge1xuICAgIGxldCBjdXJyZW50UHJvcEluZGV4ID0gMDtcbiAgICBsZXQgY3VycmVudENoYXJJbmRleCA9IDA7XG4gICAgbGV0IGN1cnJlbnRWYWx1ZVRleHQgPSBcIlwiO1xuICAgIGxldCBpc0VzY2FwZWQgPSBmYWxzZTtcbiAgICBjb25zdCBpdGVtID0ge307XG5cbiAgICBjb25zdCBzZXRDdXJyZW50UHJvcCA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgY3VycmVudFByb3AgPSBzY2hlbWFbY3VycmVudFByb3BJbmRleF07XG4gICAgICAgIGNvbnN0IHR5cGUgPSBnZXRUeXBlKGN1cnJlbnRQcm9wLnR5cGUpO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGN1cnJlbnRWYWx1ZVRleHQgPT09IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICA/IHR5cGUuZ2V0RGVmYXVsdFZhbHVlKClcbiAgICAgICAgICAgICAgICAgICAgICA6IHR5cGUuc2FmZVBhcnNlVmFsdWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZVRleHQpO1xuICAgICAgICBpdGVtW2N1cnJlbnRQcm9wLm5hbWVdID0gdmFsdWU7XG4gICAgfTtcbiAgICBcbiAgICB3aGlsZShjdXJyZW50UHJvcEluZGV4IDwgc2NoZW1hLmxlbmd0aCkge1xuXG4gICAgICAgIGlmKGN1cnJlbnRDaGFySW5kZXggPCByb3dUZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudENoYXIgPSByb3dUZXh0W2N1cnJlbnRDaGFySW5kZXhdO1xuICAgICAgICAgICAgaWYoaXNFc2NhcGVkKSB7XG4gICAgICAgICAgICAgICAgaWYoY3VycmVudENoYXIgPT09IFwiclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZVRleHQgKz0gXCJcXHJcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWVUZXh0ICs9IGN1cnJlbnRDaGFyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpc0VzY2FwZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYoY3VycmVudENoYXIgPT09IFwiLFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldEN1cnJlbnRQcm9wKCk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZVRleHQgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UHJvcEluZGV4Kys7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKGN1cnJlbnRDaGFyID09PSBcIlxcXFxcIikge1xuICAgICAgICAgICAgICAgICAgICBpc0VzY2FwZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZVRleHQgKz0gY3VycmVudENoYXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudENoYXJJbmRleCsrOyBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJlbnRWYWx1ZVRleHQgPSBcIlwiO1xuICAgICAgICAgICAgc2V0Q3VycmVudFByb3AoKTtcbiAgICAgICAgICAgIGN1cnJlbnRQcm9wSW5kZXgrKztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpdGVtO1xufTtcblxuZXhwb3J0IGNvbnN0IHNlcmlhbGl6ZUl0ZW0gPSAoc2NoZW1hLCBpdGVtKSAgPT4ge1xuXG4gICAgbGV0IHJvd1RleHQgPSBcIlwiXG5cbiAgICBmb3IobGV0IHByb3Agb2Ygc2NoZW1hKSB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSBnZXRUeXBlKHByb3AudHlwZSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaGFzKHByb3AubmFtZSkoaXRlbSlcbiAgICAgICAgICAgICAgICAgICAgICA/IGl0ZW1bcHJvcC5uYW1lXVxuICAgICAgICAgICAgICAgICAgICAgIDogdHlwZS5nZXREZWZhdWx0VmFsdWUoKVxuICAgICAgICBcbiAgICAgICAgY29uc3QgdmFsU3RyID0gdHlwZS5zdHJpbmdpZnkodmFsdWUpO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB2YWxTdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDaGFyID0gdmFsU3RyW2ldO1xuICAgICAgICAgICAgaWYoY3VycmVudENoYXIgPT09IFwiLFwiIFxuICAgICAgICAgICAgICAgfHwgY3VycmVudENoYXIgPT09IFwiXFxyXCIgXG4gICAgICAgICAgICAgICB8fCBjdXJyZW50Q2hhciA9PT0gXCJcXFxcXCIpIHtcbiAgICAgICAgICAgICAgICByb3dUZXh0ICs9IFwiXFxcXFwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCJcXHJcIikge1xuICAgICAgICAgICAgICAgIHJvd1RleHQgKz0gXCJyXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJvd1RleHQgKz0gY3VycmVudENoYXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByb3dUZXh0ICs9IFwiLFwiO1xuICAgIH1cblxuICAgIHJvd1RleHQgKz0gXCJcXHJcIjtcbiAgICByZXR1cm4gcm93VGV4dDtcbn07IiwiaW1wb3J0IGx1bnIgZnJvbSAnbHVucic7XG5pbXBvcnQge1xuICBnZXRIYXNoQ29kZSxcbiAgam9pbktleVxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQsXG4gIGlzR2xvYmFsSW5kZXgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge3Byb21pc2VSZWFkYWJsZVN0cmVhbX0gZnJvbSBcIi4vcHJvbWlzZVJlYWRhYmxlU3RyZWFtXCI7XG5pbXBvcnQgeyBjcmVhdGVJbmRleEZpbGUgfSBmcm9tICcuL3NoYXJkaW5nJztcbmltcG9ydCB7IGdlbmVyYXRlU2NoZW1hIH0gZnJvbSAnLi9pbmRleFNjaGVtYUNyZWF0b3InO1xuaW1wb3J0IHsgZ2V0SW5kZXhSZWFkZXIsIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUyB9IGZyb20gJy4vc2VyaWFsaXplcic7XG5cbmV4cG9ydCBjb25zdCByZWFkSW5kZXggPSBhc3luYyAoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSkgPT4ge1xuICBjb25zdCByZWNvcmRzID0gW107XG4gIGNvbnN0IGRvUmVhZCA9IGl0ZXJhdGVJbmRleChcbiAgICAgICAgYXN5bmMgaXRlbSA9PiB7XG4gICAgICByZWNvcmRzLnB1c2goaXRlbSk7XG4gICAgICByZXR1cm4gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xuICAgIH0sXG4gICAgICAgIGFzeW5jICgpID0+IHJlY29yZHNcbiAgKTtcblxuICByZXR1cm4gYXdhaXQgZG9SZWFkKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXkpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNlYXJjaEluZGV4ID0gYXN5bmMgKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXksIHNlYXJjaFBocmFzZSkgPT4ge1xuICBjb25zdCByZWNvcmRzID0gW107XG4gIGNvbnN0IHNjaGVtYSA9IGdlbmVyYXRlU2NoZW1hKGhpZXJhcmNoeSwgaW5kZXgpO1xuICBjb25zdCBkb1JlYWQgPSBpdGVyYXRlSW5kZXgoXG4gICAgICAgIGFzeW5jIGl0ZW0gPT4ge1xuICAgICAgY29uc3QgaWR4ID0gbHVucihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucmVmKCdrZXknKTtcbiAgICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBzY2hlbWEpIHtcbiAgICAgICAgICB0aGlzLmZpZWxkKGZpZWxkLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkKGl0ZW0pO1xuICAgICAgfSk7XG4gICAgICBjb25zdCBzZWFyY2hSZXN1bHRzID0gaWR4LnNlYXJjaChzZWFyY2hQaHJhc2UpO1xuICAgICAgaWYgKHNlYXJjaFJlc3VsdHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGl0ZW0uX3NlYXJjaFJlc3VsdCA9IHNlYXJjaFJlc3VsdHNbMF07XG4gICAgICAgIHJlY29yZHMucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XG4gICAgfSxcbiAgICAgICAgYXN5bmMgKCkgPT4gcmVjb3Jkc1xuICApO1xuXG4gIHJldHVybiBhd2FpdCBkb1JlYWQoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhlZERhdGFLZXlfZnJvbUluZGV4S2V5ID0gKGluZGV4S2V5KSA9PiBcbiAgYCR7aW5kZXhLZXl9JHtpbmRleEtleS5lbmRzV2l0aCgnLmNzdicpID8gJycgOiAnLmNzdid9YDtcblxuZXhwb3J0IGNvbnN0IHVuaXF1ZUluZGV4TmFtZSA9IGluZGV4ID0+IGBpZHhfJHtcbiAgZ2V0SGFzaENvZGUoYCR7aW5kZXguZmlsdGVyfSR7aW5kZXgubWFwfWApXG59LmNzdmA7XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleGVkRGF0YUtleSA9IChkZWNlbmRhbnRLZXksIGluZGV4Tm9kZSkgPT4ge1xuICBpZiAoaXNHbG9iYWxJbmRleChpbmRleE5vZGUpKSB7IHJldHVybiBgJHtpbmRleE5vZGUubm9kZUtleSgpfS5jc3ZgOyB9XG5cbiAgY29uc3QgaW5kZXhlZERhdGFQYXJlbnRLZXkgPSBnZXRBY3R1YWxLZXlPZlBhcmVudChcbiAgICBpbmRleE5vZGUucGFyZW50KCkubm9kZUtleSgpLFxuICAgIGRlY2VuZGFudEtleSxcbiAgKTtcblxuICBjb25zdCBpbmRleE5hbWUgPSBpbmRleE5vZGUubmFtZVxuICAgID8gYCR7aW5kZXhOb2RlLm5hbWV9LmNzdmBcbiAgICA6IHVuaXF1ZUluZGV4TmFtZShpbmRleE5vZGUpO1xuXG4gIHJldHVybiBqb2luS2V5KFxuICAgIGluZGV4ZWREYXRhUGFyZW50S2V5LFxuICAgIGluZGV4TmFtZSxcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpdGVyYXRlSW5kZXggPSAob25HZXRJdGVtLCBnZXRGaW5hbFJlc3VsdCkgPT4gYXN5bmMgKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXkpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCByZWFkYWJsZVN0cmVhbSA9IHByb21pc2VSZWFkYWJsZVN0cmVhbShcbiAgICAgICAgYXdhaXQgZGF0YXN0b3JlLnJlYWRhYmxlRmlsZVN0cmVhbShpbmRleGVkRGF0YUtleSlcbiAgICApO1xuXG4gICAgY29uc3QgcmVhZCA9IGdldEluZGV4UmVhZGVyKGhpZXJhcmNoeSwgaW5kZXgsIHJlYWRhYmxlU3RyZWFtKTtcbiAgICBhd2FpdCByZWFkKG9uR2V0SXRlbSk7XG4gICAgcmV0dXJuIGdldEZpbmFsUmVzdWx0KCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhpbmRleGVkRGF0YUtleSkpIHtcbiAgICAgIHRocm93IGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IGNyZWF0ZUluZGV4RmlsZShcbiAgICAgICAgZGF0YXN0b3JlLFxuICAgICAgICBpbmRleGVkRGF0YUtleSxcbiAgICAgICAgaW5kZXgsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBmbGF0dGVuLCBtZXJnZSB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBzYWZlS2V5LCBhcGlXcmFwcGVyLCAkLFxuICBldmVudHMsIGlzTm9uRW1wdHlTdHJpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyByZWFkSW5kZXgsIHNlYXJjaEluZGV4IH0gZnJvbSAnLi4vaW5kZXhpbmcvcmVhZCc7XG5pbXBvcnQge1xuICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXksXG4gIGdldFNoYXJkS2V5c0luUmFuZ2UsXG59IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcbmltcG9ydCB7XG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsIGlzSW5kZXgsXG4gIGlzU2hhcmRlZEluZGV4LFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgbGlzdEl0ZW1zID0gYXBwID0+IGFzeW5jIChpbmRleEtleSwgb3B0aW9ucykgPT4ge1xuICBpbmRleEtleSA9IHNhZmVLZXkoaW5kZXhLZXkpO1xuICByZXR1cm4gYXBpV3JhcHBlcihcbiAgICBhcHAsXG4gICAgZXZlbnRzLmluZGV4QXBpLmxpc3RJdGVtcyxcbiAgICBwZXJtaXNzaW9uLnJlYWRJbmRleC5pc0F1dGhvcml6ZWQoaW5kZXhLZXkpLFxuICAgIHsgaW5kZXhLZXksIG9wdGlvbnMgfSxcbiAgICBfbGlzdEl0ZW1zLCBhcHAsIGluZGV4S2V5LCBvcHRpb25zLFxuICApO1xufVxuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHsgcmFuZ2VTdGFydFBhcmFtczogbnVsbCwgcmFuZ2VFbmRQYXJhbXM6IG51bGwsIHNlYXJjaFBocmFzZTogbnVsbCB9O1xuXG5jb25zdCBfbGlzdEl0ZW1zID0gYXN5bmMgKGFwcCwgaW5kZXhLZXksIG9wdGlvbnMgPSBkZWZhdWx0T3B0aW9ucykgPT4ge1xuICBjb25zdCB7IHNlYXJjaFBocmFzZSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMgfSA9ICQoe30sIFtcbiAgICBtZXJnZShvcHRpb25zKSxcbiAgICBtZXJnZShkZWZhdWx0T3B0aW9ucyksXG4gIF0pO1xuXG4gIGNvbnN0IGdldEl0ZW1zID0gYXN5bmMga2V5ID0+IChpc05vbkVtcHR5U3RyaW5nKHNlYXJjaFBocmFzZSlcbiAgICA/IGF3YWl0IHNlYXJjaEluZGV4KFxuICAgICAgYXBwLmhpZXJhcmNoeSxcbiAgICAgIGFwcC5kYXRhc3RvcmUsXG4gICAgICBpbmRleE5vZGUsXG4gICAgICBrZXksXG4gICAgICBzZWFyY2hQaHJhc2UsXG4gICAgKVxuICAgIDogYXdhaXQgcmVhZEluZGV4KFxuICAgICAgYXBwLmhpZXJhcmNoeSxcbiAgICAgIGFwcC5kYXRhc3RvcmUsXG4gICAgICBpbmRleE5vZGUsXG4gICAgICBrZXksXG4gICAgKSk7XG5cbiAgaW5kZXhLZXkgPSBzYWZlS2V5KGluZGV4S2V5KTtcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShpbmRleEtleSk7XG5cbiAgaWYgKCFpc0luZGV4KGluZGV4Tm9kZSkpIHsgdGhyb3cgbmV3IEVycm9yKCdzdXBwbGllZCBrZXkgaXMgbm90IGFuIGluZGV4Jyk7IH1cblxuICBpZiAoaXNTaGFyZGVkSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIGNvbnN0IHNoYXJkS2V5cyA9IGF3YWl0IGdldFNoYXJkS2V5c0luUmFuZ2UoXG4gICAgICBhcHAsIGluZGV4S2V5LCByYW5nZVN0YXJ0UGFyYW1zLCByYW5nZUVuZFBhcmFtcyxcbiAgICApO1xuICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgZm9yIChjb25zdCBrIG9mIHNoYXJkS2V5cykge1xuICAgICAgaXRlbXMucHVzaChhd2FpdCBnZXRJdGVtcyhrKSk7XG4gICAgfVxuICAgIHJldHVybiBmbGF0dGVuKGl0ZW1zKTtcbiAgfVxuICByZXR1cm4gYXdhaXQgZ2V0SXRlbXMoXG4gICAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5KGluZGV4S2V5KSxcbiAgKTtcbn07XG4iLCJpbXBvcnQgeyBtYXAsIGlzU3RyaW5nLCBoYXMsIHNvbWUgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcbiAgZmluZEZpZWxkLCBnZXROb2RlLCBpc0dsb2JhbEluZGV4LFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgbGlzdEl0ZW1zIH0gZnJvbSAnLi4vaW5kZXhBcGkvbGlzdEl0ZW1zJztcbmltcG9ydCB7XG4gICQsIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsIHNhZmVLZXlcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldEluZGV4S2V5X0Jhc2VkT25EZWNlbmRhbnQgfSBmcm9tICcuLi9pbmRleGluZy9zaGFyZGluZyc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBnZXRDb250ZXh0ID0gYXBwID0+IHJlY29yZEtleSA9PiB7XG4gIHJlY29yZEtleSA9IHNhZmVLZXkocmVjb3JkS2V5KTtcbiAgcmV0dXJuICBhcGlXcmFwcGVyU3luYyhcbiAgICBhcHAsXG4gICAgZXZlbnRzLnJlY29yZEFwaS5nZXRDb250ZXh0LFxuICAgIHBlcm1pc3Npb24ucmVhZFJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkS2V5KSxcbiAgICB7IHJlY29yZEtleSB9LFxuICAgIF9nZXRDb250ZXh0LCBhcHAsIHJlY29yZEtleSxcbiAgKTtcbn1cblxuZXhwb3J0IGNvbnN0IF9nZXRDb250ZXh0ID0gKGFwcCwgcmVjb3JkS2V5KSA9PiB7XG4gIHJlY29yZEtleSA9IHNhZmVLZXkocmVjb3JkS2V5KTtcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkocmVjb3JkS2V5KTtcblxuICBjb25zdCBjYWNoZWRSZWZlcmVuY2VJbmRleGVzID0ge307XG5cbiAgY29uc3QgbGF6eUxvYWRSZWZlcmVuY2VJbmRleCA9IGFzeW5jICh0eXBlT3B0aW9ucykgPT4ge1xuICAgIGlmICghaGFzKHR5cGVPcHRpb25zLmluZGV4Tm9kZUtleSkoY2FjaGVkUmVmZXJlbmNlSW5kZXhlcykpIHtcbiAgICAgIGNhY2hlZFJlZmVyZW5jZUluZGV4ZXNbdHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5XSA9IHtcbiAgICAgICAgdHlwZU9wdGlvbnMsXG4gICAgICAgIGRhdGE6IGF3YWl0IHJlYWRSZWZlcmVuY2VJbmRleChcbiAgICAgICAgICBhcHAsIHJlY29yZEtleSwgdHlwZU9wdGlvbnMsXG4gICAgICAgICksXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBjYWNoZWRSZWZlcmVuY2VJbmRleGVzW3R5cGVPcHRpb25zLmluZGV4Tm9kZUtleV07XG4gIH07XG5cbiAgY29uc3QgZ2V0VHlwZU9wdGlvbnMgPSB0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUgPT4gKGlzU3RyaW5nKHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSlcbiAgICA/IGZpbmRGaWVsZChyZWNvcmROb2RlLCB0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUpXG4gICAgICAudHlwZU9wdGlvbnNcbiAgICA6IHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSk7XG5cbiAgcmV0dXJuIHtcbiAgICByZWZlcmVuY2VFeGlzdHM6IGFzeW5jICh0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUsIGtleSkgPT4ge1xuICAgICAgY29uc3QgdHlwZU9wdGlvbnMgPSBnZXRUeXBlT3B0aW9ucyh0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUpO1xuICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBsYXp5TG9hZFJlZmVyZW5jZUluZGV4KHR5cGVPcHRpb25zKTtcbiAgICAgIHJldHVybiBzb21lKGkgPT4gaS5rZXkgPT09IGtleSkoZGF0YSk7XG4gICAgfSxcbiAgICByZWZlcmVuY2VPcHRpb25zOiBhc3luYyAodHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKSA9PiB7XG4gICAgICBjb25zdCB0eXBlT3B0aW9ucyA9IGdldFR5cGVPcHRpb25zKHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSk7XG4gICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGxhenlMb2FkUmVmZXJlbmNlSW5kZXgodHlwZU9wdGlvbnMpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSxcbiAgICByZWNvcmROb2RlLFxuICB9O1xufTtcblxuY29uc3QgcmVhZFJlZmVyZW5jZUluZGV4ID0gYXN5bmMgKGFwcCwgcmVjb3JkS2V5LCB0eXBlT3B0aW9ucykgPT4ge1xuICBjb25zdCBpbmRleE5vZGUgPSBnZXROb2RlKGFwcC5oaWVyYXJjaHksIHR5cGVPcHRpb25zLmluZGV4Tm9kZUtleSk7XG4gIGNvbnN0IGluZGV4S2V5ID0gaXNHbG9iYWxJbmRleChpbmRleE5vZGUpXG4gICAgPyBpbmRleE5vZGUubm9kZUtleSgpXG4gICAgOiBnZXRJbmRleEtleV9CYXNlZE9uRGVjZW5kYW50KFxuICAgICAgcmVjb3JkS2V5LCBpbmRleE5vZGUsXG4gICAgKTtcblxuICBjb25zdCBpdGVtcyA9IGF3YWl0IGxpc3RJdGVtcyhhcHApKGluZGV4S2V5KTtcbiAgcmV0dXJuICQoaXRlbXMsIFtcbiAgICBtYXAoaSA9PiAoe1xuICAgICAga2V5OiBpLmtleSxcbiAgICAgIHZhbHVlOiBpW3R5cGVPcHRpb25zLmRpc3BsYXlWYWx1ZV0sXG4gICAgfSkpLFxuICBdKTtcbn07XG4iLCJpbXBvcnQge1xuICBtYXAsIHJlZHVjZSwgZmlsdGVyLFxuICBpc0VtcHR5LCBmbGF0dGVuLCBlYWNoLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgY29tcGlsZUV4cHJlc3Npb24gfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgZ2V0RXhhY3ROb2RlRm9yUGF0aCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyB2YWxpZGF0ZUZpZWxkUGFyc2UsIHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgJCwgaXNOb3RoaW5nLCBpc05vbkVtcHR5U3RyaW5nIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IF9nZXRDb250ZXh0IH0gZnJvbSAnLi9nZXRDb250ZXh0JztcblxuY29uc3QgZmllbGRQYXJzZUVycm9yID0gKGZpZWxkTmFtZSwgdmFsdWUpID0+ICh7XG4gIGZpZWxkczogW2ZpZWxkTmFtZV0sXG4gIG1lc3NhZ2U6IGBDb3VsZCBub3QgcGFyc2UgZmllbGQgJHtmaWVsZE5hbWV9OiR7dmFsdWV9YCxcbn0pO1xuXG5jb25zdCB2YWxpZGF0ZUFsbEZpZWxkUGFyc2UgPSAocmVjb3JkLCByZWNvcmROb2RlKSA9PiAkKHJlY29yZE5vZGUuZmllbGRzLCBbXG4gIG1hcChmID0+ICh7IG5hbWU6IGYubmFtZSwgcGFyc2VSZXN1bHQ6IHZhbGlkYXRlRmllbGRQYXJzZShmLCByZWNvcmQpIH0pKSxcbiAgcmVkdWNlKChlcnJvcnMsIGYpID0+IHtcbiAgICBpZiAoZi5wYXJzZVJlc3VsdC5zdWNjZXNzKSByZXR1cm4gZXJyb3JzO1xuICAgIGVycm9ycy5wdXNoKFxuICAgICAgZmllbGRQYXJzZUVycm9yKGYubmFtZSwgZi5wYXJzZVJlc3VsdC52YWx1ZSksXG4gICAgKTtcbiAgICByZXR1cm4gZXJyb3JzO1xuICB9LCBbXSksXG5dKTtcblxuY29uc3QgdmFsaWRhdGVBbGxUeXBlQ29uc3RyYWludHMgPSBhc3luYyAocmVjb3JkLCByZWNvcmROb2RlLCBjb250ZXh0KSA9PiB7XG4gIGNvbnN0IGVycm9ycyA9IFtdO1xuICBmb3IgKGNvbnN0IGZpZWxkIG9mIHJlY29yZE5vZGUuZmllbGRzKSB7XG4gICAgJChhd2FpdCB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyhmaWVsZCwgcmVjb3JkLCBjb250ZXh0KSwgW1xuICAgICAgZmlsdGVyKGlzTm9uRW1wdHlTdHJpbmcpLFxuICAgICAgbWFwKG0gPT4gKHsgbWVzc2FnZTogbSwgZmllbGRzOiBbZmllbGQubmFtZV0gfSkpLFxuICAgICAgZWFjaChlID0+IGVycm9ycy5wdXNoKGUpKSxcbiAgICBdKTtcbiAgfVxuICByZXR1cm4gZXJyb3JzO1xufTtcblxuY29uc3QgcnVuUmVjb3JkVmFsaWRhdGlvblJ1bGVzID0gKHJlY29yZCwgcmVjb3JkTm9kZSkgPT4ge1xuICBjb25zdCBydW5WYWxpZGF0aW9uUnVsZSA9IChydWxlKSA9PiB7XG4gICAgY29uc3QgaXNWYWxpZCA9IGNvbXBpbGVFeHByZXNzaW9uKHJ1bGUuZXhwcmVzc2lvbldoZW5WYWxpZCk7XG4gICAgY29uc3QgZXhwcmVzc2lvbkNvbnRleHQgPSB7IHJlY29yZCwgXyB9O1xuICAgIHJldHVybiAoaXNWYWxpZChleHByZXNzaW9uQ29udGV4dClcbiAgICAgID8geyB2YWxpZDogdHJ1ZSB9XG4gICAgICA6ICh7XG4gICAgICAgIHZhbGlkOiBmYWxzZSxcbiAgICAgICAgZmllbGRzOiBydWxlLmludmFsaWRGaWVsZHMsXG4gICAgICAgIG1lc3NhZ2U6IHJ1bGUubWVzc2FnZVdoZW5JbnZhbGlkLFxuICAgICAgfSkpO1xuICB9O1xuXG4gIHJldHVybiAkKHJlY29yZE5vZGUudmFsaWRhdGlvblJ1bGVzLCBbXG4gICAgbWFwKHJ1blZhbGlkYXRpb25SdWxlKSxcbiAgICBmbGF0dGVuLFxuICAgIGZpbHRlcihyID0+IHIudmFsaWQgPT09IGZhbHNlKSxcbiAgICBtYXAociA9PiAoeyBmaWVsZHM6IHIuZmllbGRzLCBtZXNzYWdlOiByLm1lc3NhZ2UgfSkpLFxuICBdKTtcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZSA9IGFwcCA9PiBhc3luYyAocmVjb3JkLCBjb250ZXh0KSA9PiB7XG4gIGNvbnRleHQgPSBpc05vdGhpbmcoY29udGV4dClcbiAgICA/IF9nZXRDb250ZXh0KGFwcCwgcmVjb3JkLmtleSlcbiAgICA6IGNvbnRleHQ7XG5cbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkocmVjb3JkLmtleSk7XG4gIGNvbnN0IGZpZWxkUGFyc2VGYWlscyA9IHZhbGlkYXRlQWxsRmllbGRQYXJzZShyZWNvcmQsIHJlY29yZE5vZGUpO1xuXG4gIC8vIG5vbiBwYXJzaW5nIHdvdWxkIGNhdXNlIGZ1cnRoZXIgaXNzdWVzIC0gZXhpdCBoZXJlXG4gIGlmICghaXNFbXB0eShmaWVsZFBhcnNlRmFpbHMpKSB7IHJldHVybiAoeyBpc1ZhbGlkOiBmYWxzZSwgZXJyb3JzOiBmaWVsZFBhcnNlRmFpbHMgfSk7IH1cblxuICBjb25zdCByZWNvcmRWYWxpZGF0aW9uUnVsZUZhaWxzID0gcnVuUmVjb3JkVmFsaWRhdGlvblJ1bGVzKHJlY29yZCwgcmVjb3JkTm9kZSk7XG4gIGNvbnN0IHR5cGVDb250cmFpbnRGYWlscyA9IGF3YWl0IHZhbGlkYXRlQWxsVHlwZUNvbnN0cmFpbnRzKHJlY29yZCwgcmVjb3JkTm9kZSwgY29udGV4dCk7XG5cbiAgaWYgKGlzRW1wdHkoZmllbGRQYXJzZUZhaWxzKVxuICAgICAgICYmIGlzRW1wdHkocmVjb3JkVmFsaWRhdGlvblJ1bGVGYWlscylcbiAgICAgICAmJiBpc0VtcHR5KHR5cGVDb250cmFpbnRGYWlscykpIHtcbiAgICByZXR1cm4gKHsgaXNWYWxpZDogdHJ1ZSwgZXJyb3JzOiBbXSB9KTtcbiAgfVxuXG4gIHJldHVybiAoe1xuICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgIGVycm9yczogXy51bmlvbihmaWVsZFBhcnNlRmFpbHMsIHR5cGVDb250cmFpbnRGYWlscywgcmVjb3JkVmFsaWRhdGlvblJ1bGVGYWlscyksXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IGZpbHRlciB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGlzQ29sbGVjdGlvblJlY29yZCxcbiAgaXNSb290LFxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgJCwgYWxsVHJ1ZSwgam9pbktleSB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmNvbnN0IGVuc3VyZUNvbGxlY3Rpb25Jc0luaXRpYWxpc2VkID0gYXN5bmMgKGRhdGFzdG9yZSwgbm9kZSwgcGFyZW50S2V5KSA9PiB7XG4gIGlmICghYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhwYXJlbnRLZXkpKSB7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihwYXJlbnRLZXkpO1xuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoXG4gICAgICBqb2luS2V5KHBhcmVudEtleSwgJ2FsbGlkcycpLFxuICAgICk7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihcbiAgICAgIGpvaW5LZXkoXG4gICAgICAgIHBhcmVudEtleSxcbiAgICAgICAgJ2FsbGlkcycsXG4gICAgICAgIG5vZGUubm9kZUlkLnRvU3RyaW5nKCksXG4gICAgICApLFxuICAgICk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlUm9vdENvbGxlY3Rpb25zID0gYXN5bmMgKGRhdGFzdG9yZSwgaGllcmFyY2h5KSA9PiB7XG4gIGNvbnN0IHJvb3RDb2xsZWN0aW9uUmVjb3JkID0gYWxsVHJ1ZShcbiAgICBuID0+IGlzUm9vdChuLnBhcmVudCgpKSxcbiAgICBpc0NvbGxlY3Rpb25SZWNvcmQsXG4gICk7XG5cbiAgY29uc3QgZmxhdGhpZXJhcmNoeSA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShoaWVyYXJjaHkpO1xuXG4gIGNvbnN0IGNvbGxlY3Rpb25SZWNvcmRzID0gJChmbGF0aGllcmFyY2h5LCBbXG4gICAgZmlsdGVyKHJvb3RDb2xsZWN0aW9uUmVjb3JkKSxcbiAgXSk7XG5cbiAgZm9yIChjb25zdCBjb2wgb2YgY29sbGVjdGlvblJlY29yZHMpIHtcbiAgICBhd2FpdCBlbnN1cmVDb2xsZWN0aW9uSXNJbml0aWFsaXNlZChcbiAgICAgIGRhdGFzdG9yZSxcbiAgICAgIGNvbCxcbiAgICAgIGNvbC5jb2xsZWN0aW9uUGF0aFJlZ3goKSxcbiAgICApO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgaW5pdGlhbGlzZUNoaWxkQ29sbGVjdGlvbnMgPSBhc3luYyAoYXBwLCByZWNvcmRLZXkpID0+IHtcbiAgY29uc3QgY2hpbGRDb2xsZWN0aW9uUmVjb3JkcyA9ICQocmVjb3JkS2V5LCBbXG4gICAgZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KSxcbiAgICBuID0+IG4uY2hpbGRyZW4sXG4gICAgZmlsdGVyKGlzQ29sbGVjdGlvblJlY29yZCksXG4gIF0pO1xuXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRDb2xsZWN0aW9uUmVjb3Jkcykge1xuICAgIGF3YWl0IGVuc3VyZUNvbGxlY3Rpb25Jc0luaXRpYWxpc2VkKFxuICAgICAgYXBwLmRhdGFzdG9yZSxcbiAgICAgIGNoaWxkLFxuICAgICAgam9pbktleShyZWNvcmRLZXksIGNoaWxkLmNvbGxlY3Rpb25OYW1lKSxcbiAgICApO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgam9pbiwgcHVsbCxcbiAgbWFwLCBmbGF0dGVuLCBvcmRlckJ5LFxuICBmaWx0ZXIsIGZpbmQsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRQYXJlbnRLZXksXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZ2V0Q29sbGVjdGlvbk5vZGVCeUtleU9yTm9kZUtleSwgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoLFxuICBpc0NvbGxlY3Rpb25SZWNvcmQsIGlzQW5jZXN0b3IsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBqb2luS2V5LCBzYWZlS2V5LCAkIH0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgYWxsSWRDaGFycyA9ICcwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWl8tJztcblxuY29uc3QgYWxsSWRzU3RyaW5nc0ZvckZhY3RvciA9IChjb2xsZWN0aW9uTm9kZSkgPT4ge1xuICBjb25zdCBmYWN0b3IgPSBjb2xsZWN0aW9uTm9kZS5hbGxpZHNTaGFyZEZhY3RvcjtcbiAgY29uc3QgY2hhclJhbmdlUGVyU2hhcmQgPSA2NCAvIGZhY3RvcjtcbiAgY29uc3QgYWxsSWRTdHJpbmdzID0gW107XG4gIGxldCBpbmRleCA9IDA7XG4gIGxldCBjdXJyZW50SWRzU2hhcmQgPSAnJztcbiAgd2hpbGUgKGluZGV4IDwgNjQpIHtcbiAgICBjdXJyZW50SWRzU2hhcmQgKz0gYWxsSWRDaGFyc1tpbmRleF07XG4gICAgaWYgKChpbmRleCArIDEpICUgY2hhclJhbmdlUGVyU2hhcmQgPT09IDApIHtcbiAgICAgIGFsbElkU3RyaW5ncy5wdXNoKGN1cnJlbnRJZHNTaGFyZCk7XG4gICAgICBjdXJyZW50SWRzU2hhcmQgPSAnJztcbiAgICB9XG4gICAgaW5kZXgrKztcbiAgfVxuXG4gIHJldHVybiBhbGxJZFN0cmluZ3M7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsSWRzU2hhcmROYW1lcyA9IChhcHBIaWVyYXJjaHksIGNvbGxlY3Rpb25LZXkpID0+IHtcbiAgY29uc3QgY29sbGVjdGlvblJlY29yZE5vZGUgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwSGllcmFyY2h5KShjb2xsZWN0aW9uS2V5KTtcbiAgcmV0dXJuICQoY29sbGVjdGlvblJlY29yZE5vZGUsIFtcbiAgICBjID0+IFtjLm5vZGVJZF0sXG4gICAgbWFwKGkgPT4gbWFwKGMgPT4gX2FsbElkc1NoYXJkS2V5KGNvbGxlY3Rpb25LZXksIGksIGMpKShhbGxJZHNTdHJpbmdzRm9yRmFjdG9yKGNvbGxlY3Rpb25SZWNvcmROb2RlKSkpLFxuICAgIGZsYXR0ZW4sXG4gIF0pO1xufTtcblxuY29uc3QgX2FsbElkc1NoYXJkS2V5ID0gKGNvbGxlY3Rpb25LZXksIGNoaWxkTm8sIHNoYXJkS2V5KSA9PiBqb2luS2V5KFxuICBjb2xsZWN0aW9uS2V5LFxuICAnYWxsaWRzJyxcbiAgY2hpbGRObyxcbiAgc2hhcmRLZXksXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsSWRzU2hhcmRLZXkgPSAoYXBwSGllcmFyY2h5LCBjb2xsZWN0aW9uS2V5LCByZWNvcmRJZCkgPT4ge1xuICBjb25zdCBpbmRleE9mRmlyc3REYXNoID0gcmVjb3JkSWQuaW5kZXhPZignLScpO1xuXG4gIGNvbnN0IGNvbGxlY3Rpb25Ob2RlID0gZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoKGFwcEhpZXJhcmNoeSkoY29sbGVjdGlvbktleSk7XG5cbiAgY29uc3QgaWRGaXJzdENoYXIgPSByZWNvcmRJZFtpbmRleE9mRmlyc3REYXNoICsgMV07XG4gIGNvbnN0IGFsbElkc1NoYXJkSWQgPSAkKGNvbGxlY3Rpb25Ob2RlLCBbXG4gICAgYWxsSWRzU3RyaW5nc0ZvckZhY3RvcixcbiAgICBmaW5kKGkgPT4gaS5pbmNsdWRlcyhpZEZpcnN0Q2hhcikpLFxuICBdKTtcblxuICByZXR1cm4gX2FsbElkc1NoYXJkS2V5KFxuICAgIGNvbGxlY3Rpb25LZXksXG4gICAgcmVjb3JkSWQuc2xpY2UoMCwgaW5kZXhPZkZpcnN0RGFzaCksXG4gICAgYWxsSWRzU2hhcmRJZCxcbiAgKTtcbn07XG5cbmNvbnN0IGdldE9yQ3JlYXRlU2hhcmRGaWxlID0gYXN5bmMgKGRhdGFzdG9yZSwgYWxsSWRzS2V5KSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGRhdGFzdG9yZS5sb2FkRmlsZShhbGxJZHNLZXkpO1xuICB9IGNhdGNoIChlTG9hZCkge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRmlsZShhbGxJZHNLZXksICcnKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9IGNhdGNoIChlQ3JlYXRlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBFcnJvciBsb2FkaW5nLCB0aGVuIGNyZWF0aW5nIGFsbElkcyAke2FsbElkc0tleVxuICAgICAgICB9IDogTE9BRCA6ICR7ZUxvYWQubWVzc2FnZVxuICAgICAgICB9IDogQ1JFQVRFIDogJHtlQ3JlYXRlfWAsXG4gICAgICApO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3QgZ2V0U2hhcmRGaWxlID0gYXN5bmMgKGRhdGFzdG9yZSwgYWxsSWRzS2V5KSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGRhdGFzdG9yZS5sb2FkRmlsZShhbGxJZHNLZXkpO1xuICB9IGNhdGNoIChlTG9hZCkge1xuICAgIHJldHVybiAnJztcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGFkZFRvQWxsSWRzID0gKGFwcEhpZXJhcmNoeSwgZGF0YXN0b3JlKSA9PiBhc3luYyAocmVjb3JkKSA9PiB7XG4gIGNvbnN0IGFsbElkc0tleSA9IGdldEFsbElkc1NoYXJkS2V5KFxuICAgIGFwcEhpZXJhcmNoeSxcbiAgICBnZXRQYXJlbnRLZXkocmVjb3JkLmtleSksXG4gICAgcmVjb3JkLmlkLFxuICApO1xuXG4gIGxldCBhbGxJZHMgPSBhd2FpdCBnZXRPckNyZWF0ZVNoYXJkRmlsZShkYXRhc3RvcmUsIGFsbElkc0tleSk7XG5cbiAgYWxsSWRzICs9IGAke2FsbElkcy5sZW5ndGggPiAwID8gJywnIDogJyd9JHtyZWNvcmQuaWR9YDtcblxuICBhd2FpdCBkYXRhc3RvcmUudXBkYXRlRmlsZShhbGxJZHNLZXksIGFsbElkcyk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsSWRzSXRlcmF0b3IgPSBhcHAgPT4gYXN5bmMgKGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXkpID0+IHtcbiAgY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSA9IHNhZmVLZXkoY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSk7XG4gIGNvbnN0IHRhcmdldE5vZGUgPSBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5KFxuICAgIGFwcC5oaWVyYXJjaHksXG4gICAgY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSxcbiAgKTtcblxuICBjb25zdCBnZXRBbGxJZHNJdGVyYXRvckZvckNvbGxlY3Rpb25LZXkgPSBhc3luYyAoY29sbGVjdGlvbktleSkgPT4ge1xuICAgIGNvbnN0IGFsbF9hbGxJZHNLZXlzID0gZ2V0QWxsSWRzU2hhcmROYW1lcyhhcHAuaGllcmFyY2h5LCBjb2xsZWN0aW9uS2V5KTtcbiAgICBsZXQgc2hhcmRJbmRleCA9IDA7XG5cbiAgICBjb25zdCBhbGxJZHNGcm9tU2hhcmRJdGVyYXRvciA9IGFzeW5jICgpID0+IHtcbiAgICAgIGlmIChzaGFyZEluZGV4ID09PSBhbGxfYWxsSWRzS2V5cy5sZW5ndGgpIHsgcmV0dXJuICh7IGRvbmU6IHRydWUsIHJlc3VsdDogeyBpZHM6IFtdLCBjb2xsZWN0aW9uS2V5IH0gfSk7IH1cblxuICAgICAgY29uc3Qgc2hhcmRLZXkgPSBhbGxfYWxsSWRzS2V5c1tzaGFyZEluZGV4XTtcblxuICAgICAgY29uc3QgYWxsSWRzID0gYXdhaXQgZ2V0QWxsSWRzRnJvbVNoYXJkKGFwcC5kYXRhc3RvcmUsIHNoYXJkS2V5KTtcblxuICAgICAgc2hhcmRJbmRleCsrO1xuXG4gICAgICByZXR1cm4gKHtcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgaWRzOiBhbGxJZHMsXG4gICAgICAgICAgY29sbGVjdGlvbktleSxcbiAgICAgICAgfSxcbiAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGFsbElkc0Zyb21TaGFyZEl0ZXJhdG9yO1xuICB9O1xuXG4gIGNvbnN0IGFuY2VzdG9ycyA9ICQoZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGFwcC5oaWVyYXJjaHkpLCBbXG4gICAgZmlsdGVyKGlzQ29sbGVjdGlvblJlY29yZCksXG4gICAgZmlsdGVyKG4gPT4gaXNBbmNlc3Rvcih0YXJnZXROb2RlKShuKVxuICAgICAgICAgICAgICAgICAgICB8fCBuLm5vZGVLZXkoKSA9PT0gdGFyZ2V0Tm9kZS5ub2RlS2V5KCkpLFxuICAgIG9yZGVyQnkoW24gPT4gbi5ub2RlS2V5KCkubGVuZ3RoXSwgWydhc2MnXSksXG4gIF0pOyAvLyBwYXJlbnRzIGZpcnN0XG5cbiAgY29uc3QgdHJhdmVyc2VGb3JJdGVyYXRlcmF0b3JzID0gYXN5bmMgKHBhcmVudFJlY29yZEtleSA9ICcnLCBjdXJyZW50Tm9kZUluZGV4ID0gMCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gYW5jZXN0b3JzW2N1cnJlbnROb2RlSW5kZXhdO1xuICAgIGNvbnN0IGN1cnJlbnRDb2xsZWN0aW9uS2V5ID0gam9pbktleShcbiAgICAgIHBhcmVudFJlY29yZEtleSxcbiAgICAgIGN1cnJlbnROb2RlLmNvbGxlY3Rpb25OYW1lLFxuICAgICk7XG4gICAgaWYgKGN1cnJlbnROb2RlLm5vZGVLZXkoKSA9PT0gdGFyZ2V0Tm9kZS5ub2RlS2V5KCkpIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yRm9yQ29sbGVjdGlvbktleShcbiAgICAgICAgICBjdXJyZW50Q29sbGVjdGlvbktleSxcbiAgICAgICAgKV07XG4gICAgfVxuICAgIGNvbnN0IGFsbEl0ZXJhdG9ycyA9IFtdO1xuICAgIGNvbnN0IGN1cnJlbnRJdGVyYXRvciA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yRm9yQ29sbGVjdGlvbktleShcbiAgICAgIGN1cnJlbnRDb2xsZWN0aW9uS2V5LFxuICAgICk7XG5cbiAgICBsZXQgaWRzID0gYXdhaXQgY3VycmVudEl0ZXJhdG9yKCk7XG4gICAgd2hpbGUgKGlkcy5kb25lID09PSBmYWxzZSkge1xuICAgICAgZm9yIChjb25zdCBpZCBvZiBpZHMucmVzdWx0Lmlkcykge1xuICAgICAgICBhbGxJdGVyYXRvcnMucHVzaChcbiAgICAgICAgICBhd2FpdCB0cmF2ZXJzZUZvckl0ZXJhdGVyYXRvcnMoXG4gICAgICAgICAgICBqb2luS2V5KGN1cnJlbnRDb2xsZWN0aW9uS2V5LCBpZCksXG4gICAgICAgICAgICBjdXJyZW50Tm9kZUluZGV4ICsgMSxcbiAgICAgICAgICApLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZHMgPSBhd2FpdCBjdXJyZW50SXRlcmF0b3IoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmxhdHRlbihhbGxJdGVyYXRvcnMpO1xuICB9O1xuXG4gIGNvbnN0IGl0ZXJhdG9yc0FycmF5ID0gYXdhaXQgdHJhdmVyc2VGb3JJdGVyYXRlcmF0b3JzKCk7XG4gIGxldCBjdXJyZW50SXRlcmF0b3JJbmRleCA9IDA7XG4gIHJldHVybiBhc3luYyAoKSA9PiB7XG4gICAgaWYgKGl0ZXJhdG9yc0FycmF5Lmxlbmd0aCA9PT0gMCkgeyByZXR1cm4geyBkb25lOiB0cnVlLCByZXN1bHQ6IFtdIH07IH1cbiAgICBjb25zdCBpbm5lclJlc3VsdCA9IGF3YWl0IGl0ZXJhdG9yc0FycmF5W2N1cnJlbnRJdGVyYXRvckluZGV4XSgpO1xuICAgIGlmICghaW5uZXJSZXN1bHQuZG9uZSkgeyByZXR1cm4gaW5uZXJSZXN1bHQ7IH1cbiAgICBpZiAoY3VycmVudEl0ZXJhdG9ySW5kZXggPT0gaXRlcmF0b3JzQXJyYXkubGVuZ3RoIC0gMSkge1xuICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgcmVzdWx0OiBpbm5lclJlc3VsdC5yZXN1bHQgfTtcbiAgICB9XG4gICAgY3VycmVudEl0ZXJhdG9ySW5kZXgrKztcbiAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgcmVzdWx0OiBpbm5lclJlc3VsdC5yZXN1bHQgfTtcbiAgfTtcbn07XG5cbmNvbnN0IGdldEFsbElkc0Zyb21TaGFyZCA9IGFzeW5jIChkYXRhc3RvcmUsIHNoYXJkS2V5KSA9PiB7XG4gIGNvbnN0IGFsbElkc1N0ciA9IGF3YWl0IGdldFNoYXJkRmlsZShkYXRhc3RvcmUsIHNoYXJkS2V5KTtcblxuICBjb25zdCBhbGxJZHMgPSBbXTtcbiAgbGV0IGN1cnJlbnRJZCA9ICcnO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbElkc1N0ci5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGN1cnJlbnRDaGFyID0gYWxsSWRzU3RyLmNoYXJBdChpKTtcbiAgICBjb25zdCBpc0xhc3QgPSAoaSA9PT0gYWxsSWRzU3RyLmxlbmd0aCAtIDEpO1xuICAgIGlmIChjdXJyZW50Q2hhciA9PT0gJywnIHx8IGlzTGFzdCkge1xuICAgICAgaWYgKGlzTGFzdCkgY3VycmVudElkICs9IGN1cnJlbnRDaGFyO1xuICAgICAgYWxsSWRzLnB1c2goY3VycmVudElkKTtcbiAgICAgIGN1cnJlbnRJZCA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50SWQgKz0gY3VycmVudENoYXI7XG4gICAgfVxuICB9XG4gIHJldHVybiBhbGxJZHM7XG59O1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlRnJvbUFsbElkcyA9IChhcHBIaWVyYXJjaHksIGRhdGFzdG9yZSkgPT4gYXN5bmMgKHJlY29yZCkgPT4ge1xuICBjb25zdCBzaGFyZEtleSA9IGdldEFsbElkc1NoYXJkS2V5KFxuICAgIGFwcEhpZXJhcmNoeSxcbiAgICBnZXRQYXJlbnRLZXkocmVjb3JkLmtleSksXG4gICAgcmVjb3JkLmlkLFxuICApO1xuICBjb25zdCBhbGxJZHMgPSBhd2FpdCBnZXRBbGxJZHNGcm9tU2hhcmQoZGF0YXN0b3JlLCBzaGFyZEtleSk7XG5cbiAgY29uc3QgbmV3SWRzID0gJChhbGxJZHMsIFtcbiAgICBwdWxsKHJlY29yZC5pZCksXG4gICAgam9pbignLCcpLFxuICBdKTtcblxuICBhd2FpdCBkYXRhc3RvcmUudXBkYXRlRmlsZShzaGFyZEtleSwgbmV3SWRzKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldEFsbElkc0l0ZXJhdG9yO1xuIiwiaW1wb3J0IHtcbiAgam9pbktleSwga2V5U2VwLCBnZXRIYXNoQ29kZSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldExhc3RQYXJ0SW5LZXkgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuXG5leHBvcnQgY29uc3QgVFJBTlNBQ1RJT05TX0ZPTERFUiA9IGAke2tleVNlcH0udHJhbnNhY3Rpb25zYDtcbmV4cG9ydCBjb25zdCBMT0NLX0ZJTEVOQU1FID0gJ2xvY2snO1xuZXhwb3J0IGNvbnN0IExPQ0tfRklMRV9LRVkgPSBqb2luS2V5KFxuICBUUkFOU0FDVElPTlNfRk9MREVSLCBMT0NLX0ZJTEVOQU1FLFxuKTtcbmV4cG9ydCBjb25zdCBpZFNlcCA9ICckJztcblxuY29uc3QgaXNPZlR5cGUgPSB0eXAgPT4gdHJhbnMgPT4gdHJhbnMudHJhbnNhY3Rpb25UeXBlID09PSB0eXA7XG5cbmV4cG9ydCBjb25zdCBDUkVBVEVfUkVDT1JEX1RSQU5TQUNUSU9OID0gJ2NyZWF0ZSc7XG5leHBvcnQgY29uc3QgVVBEQVRFX1JFQ09SRF9UUkFOU0FDVElPTiA9ICd1cGRhdGUnO1xuZXhwb3J0IGNvbnN0IERFTEVURV9SRUNPUkRfVFJBTlNBQ1RJT04gPSAnZGVsZXRlJztcbmV4cG9ydCBjb25zdCBCVUlMRF9JTkRFWF9UUkFOU0FDVElPTiA9ICdidWlsZCc7XG5cbmV4cG9ydCBjb25zdCBpc1VwZGF0ZSA9IGlzT2ZUeXBlKFVQREFURV9SRUNPUkRfVFJBTlNBQ1RJT04pO1xuZXhwb3J0IGNvbnN0IGlzRGVsZXRlID0gaXNPZlR5cGUoREVMRVRFX1JFQ09SRF9UUkFOU0FDVElPTik7XG5leHBvcnQgY29uc3QgaXNDcmVhdGUgPSBpc09mVHlwZShDUkVBVEVfUkVDT1JEX1RSQU5TQUNUSU9OKTtcbmV4cG9ydCBjb25zdCBpc0J1aWxkSW5kZXggPSBpc09mVHlwZShCVUlMRF9JTkRFWF9UUkFOU0FDVElPTik7XG5cbmV4cG9ydCBjb25zdCBrZXlUb0ZvbGRlck5hbWUgPSBub2RlS2V5ID0+IGdldEhhc2hDb2RlKG5vZGVLZXkpO1xuXG5leHBvcnQgY29uc3QgZ2V0VHJhbnNhY3Rpb25JZCA9IChyZWNvcmRJZCwgdHJhbnNhY3Rpb25UeXBlLCB1bmlxdWVJZCkgPT4gXG4gIGAke3JlY29yZElkfSR7aWRTZXB9JHt0cmFuc2FjdGlvblR5cGV9JHtpZFNlcH0ke3VuaXF1ZUlkfWA7XG5cbmV4cG9ydCBjb25zdCBidWlsZEluZGV4Rm9sZGVyID0gJy5CVUlMRC0nO1xuZXhwb3J0IGNvbnN0IG5vZGVLZXlIYXNoRnJvbUJ1aWxkRm9sZGVyID0gZm9sZGVyID0+IGZvbGRlci5yZXBsYWNlKGJ1aWxkSW5kZXhGb2xkZXIsICcnKTtcblxuZXhwb3J0IGNvbnN0IGlzQnVpbGRJbmRleEZvbGRlciA9IGtleSA9PiBnZXRMYXN0UGFydEluS2V5KGtleSkuc3RhcnRzV2l0aChidWlsZEluZGV4Rm9sZGVyKTtcblxuZXhwb3J0IGNvbnN0IEluZGV4Tm9kZUtleUZvbGRlciA9IGluZGV4Tm9kZUtleSA9PiBqb2luS2V5KFxuICBUUkFOU0FDVElPTlNfRk9MREVSLFxuICBidWlsZEluZGV4Rm9sZGVyICsga2V5VG9Gb2xkZXJOYW1lKGluZGV4Tm9kZUtleSksXG4pO1xuXG5leHBvcnQgY29uc3QgSW5kZXhOb2RlS2V5QmF0Y2hGb2xkZXIgPSAoaW5kZXhOb2RlS2V5LCBjb3VudCkgPT4gXG4gIGpvaW5LZXkoSW5kZXhOb2RlS2V5Rm9sZGVyKGluZGV4Tm9kZUtleSksIE1hdGguZmxvb3IoY291bnQgLyBCVUlMRElOREVYX0JBVENIX0NPVU5UKS50b1N0cmluZygpKTtcblxuZXhwb3J0IGNvbnN0IEluZGV4U2hhcmRLZXlGb2xkZXIgPSAoaW5kZXhOb2RlS2V5LCBpbmRleFNoYXJkS2V5KSA9PiBcbiAgam9pbktleShJbmRleE5vZGVLZXlGb2xkZXIoaW5kZXhOb2RlS2V5KSwgaW5kZXhTaGFyZEtleSk7XG5cbmV4cG9ydCBjb25zdCBCVUlMRElOREVYX0JBVENIX0NPVU5UID0gMTAwMDtcbmV4cG9ydCBjb25zdCB0aW1lb3V0TWlsbGlzZWNvbmRzID0gMzAgKiAxMDAwOyAvLyAzMCBzZWNzXG5leHBvcnQgY29uc3QgbWF4TG9ja1JldHJpZXMgPSAxO1xuIiwiaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcbmltcG9ydCB7IGpvaW5LZXkgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0TGFzdFBhcnRJbktleSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xuICBJbmRleE5vZGVLZXlGb2xkZXIsIEJVSUxESU5ERVhfQkFUQ0hfQ09VTlQsXG4gIEluZGV4Tm9kZUtleUJhdGNoRm9sZGVyLCBUUkFOU0FDVElPTlNfRk9MREVSLCBnZXRUcmFuc2FjdGlvbklkLCBDUkVBVEVfUkVDT1JEX1RSQU5TQUNUSU9OLCBVUERBVEVfUkVDT1JEX1RSQU5TQUNUSU9OLFxuICBERUxFVEVfUkVDT1JEX1RSQU5TQUNUSU9OLCBCVUlMRF9JTkRFWF9UUkFOU0FDVElPTixcbn0gZnJvbSAnLi90cmFuc2FjdGlvbnNDb21tb24nO1xuXG5cbmV4cG9ydCBjb25zdCB0cmFuc2FjdGlvbkZvckNyZWF0ZVJlY29yZCA9IGFzeW5jIChhcHAsIHJlY29yZCkgPT4gYXdhaXQgdHJhbnNhY3Rpb24oXG4gIGFwcC5kYXRhc3RvcmUsIENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04sXG4gIHJlY29yZC5rZXksIHsgcmVjb3JkIH0sXG4gIGdldFRyYW5zYWN0aW9uS2V5X1JlY29yZHMsXG4pO1xuXG5leHBvcnQgY29uc3QgdHJhbnNhY3Rpb25Gb3JVcGRhdGVSZWNvcmQgPSBhc3luYyAoYXBwLCBvbGRSZWNvcmQsIG5ld1JlY29yZCkgPT4gYXdhaXQgdHJhbnNhY3Rpb24oXG4gIGFwcC5kYXRhc3RvcmUsIFVQREFURV9SRUNPUkRfVFJBTlNBQ1RJT04sXG4gIG5ld1JlY29yZC5rZXksIHsgb2xkUmVjb3JkLCByZWNvcmQ6IG5ld1JlY29yZCB9LFxuICBnZXRUcmFuc2FjdGlvbktleV9SZWNvcmRzLFxuKTtcblxuZXhwb3J0IGNvbnN0IHRyYW5zYWN0aW9uRm9yRGVsZXRlUmVjb3JkID0gYXN5bmMgKGFwcCwgcmVjb3JkKSA9PiBhd2FpdCB0cmFuc2FjdGlvbihcbiAgYXBwLmRhdGFzdG9yZSwgREVMRVRFX1JFQ09SRF9UUkFOU0FDVElPTixcbiAgcmVjb3JkLmtleSwgeyByZWNvcmQgfSxcbiAgZ2V0VHJhbnNhY3Rpb25LZXlfUmVjb3Jkcyxcbik7XG5cbmV4cG9ydCBjb25zdCB0cmFuc2FjdGlvbkZvckJ1aWxkSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleE5vZGVLZXksIHJlY29yZEtleSwgY291bnQpID0+IHtcbiAgY29uc3QgdHJhbnNhY3Rpb25Gb2xkZXIgPSBJbmRleE5vZGVLZXlCYXRjaEZvbGRlcihpbmRleE5vZGVLZXksIGNvdW50KTtcbiAgaWYgKGNvdW50ICUgQlVJTERJTkRFWF9CQVRDSF9DT1VOVCA9PT0gMCkge1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlRm9sZGVyKHRyYW5zYWN0aW9uRm9sZGVyKTtcbiAgfVxuXG4gIHJldHVybiBhd2FpdCB0cmFuc2FjdGlvbihcbiAgICBhcHAuZGF0YXN0b3JlLCBCVUlMRF9JTkRFWF9UUkFOU0FDVElPTixcbiAgICByZWNvcmRLZXksIHsgcmVjb3JkS2V5IH0sXG4gICAgaWQgPT4gam9pbktleSh0cmFuc2FjdGlvbkZvbGRlciwgaWQpLFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUJ1aWxkSW5kZXhGb2xkZXIgPSBhc3luYyAoZGF0YXN0b3JlLCBpbmRleE5vZGVLZXkpID0+IGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoXG4gIEluZGV4Tm9kZUtleUZvbGRlcihpbmRleE5vZGVLZXkpLFxuKTtcblxuY29uc3QgZ2V0VHJhbnNhY3Rpb25LZXlfUmVjb3JkcyA9IGlkID0+IGpvaW5LZXkoVFJBTlNBQ1RJT05TX0ZPTERFUiwgaWQpO1xuXG5jb25zdCB0cmFuc2FjdGlvbiA9IGFzeW5jIChkYXRhc3RvcmUsIHRyYW5zYWN0aW9uVHlwZSwgcmVjb3JkS2V5LCBkYXRhLCBnZXRUcmFuc2FjdGlvbktleSkgPT4ge1xuICBjb25zdCByZWNvcmRJZCA9IGdldExhc3RQYXJ0SW5LZXkocmVjb3JkS2V5KTtcbiAgY29uc3QgdW5pcXVlSWQgPSBnZW5lcmF0ZSgpO1xuICBjb25zdCBpZCA9IGdldFRyYW5zYWN0aW9uSWQoXG4gICAgcmVjb3JkSWQsIHRyYW5zYWN0aW9uVHlwZSwgdW5pcXVlSWQsXG4gICk7XG5cbiAgY29uc3Qga2V5ID0gZ2V0VHJhbnNhY3Rpb25LZXkoaWQpO1xuXG4gIGNvbnN0IHRyYW5zID0ge1xuICAgIHRyYW5zYWN0aW9uVHlwZSxcbiAgICByZWNvcmRLZXksXG4gICAgLi4uZGF0YSxcbiAgICBpZCxcbiAgfTtcblxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlSnNvbihcbiAgICBrZXksIHRyYW5zLFxuICApO1xuXG4gIHJldHVybiB0cmFucztcbn07XG4iLCJpbXBvcnQgeyBpc1NoYXJkZWRJbmRleCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBqb2luS2V5IH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldFNoYXJkTWFwS2V5LCBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXksIGNyZWF0ZUluZGV4RmlsZSB9IGZyb20gJy4vc2hhcmRpbmcnO1xuXG5leHBvcnQgY29uc3QgaW5pdGlhbGlzZUluZGV4ID0gYXN5bmMgKGRhdGFzdG9yZSwgcGFyZW50S2V5LCBpbmRleCkgPT4ge1xuICBjb25zdCBpbmRleEtleSA9IGpvaW5LZXkocGFyZW50S2V5LCBpbmRleC5uYW1lKTtcblxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKGluZGV4S2V5KTtcblxuICBpZiAoaXNTaGFyZGVkSW5kZXgoaW5kZXgpKSB7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZpbGUoXG4gICAgICBnZXRTaGFyZE1hcEtleShpbmRleEtleSksXG4gICAgICAnW10nLFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgY3JlYXRlSW5kZXhGaWxlKFxuICAgICAgZGF0YXN0b3JlLFxuICAgICAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5KGluZGV4S2V5KSxcbiAgICAgIGluZGV4LFxuICAgICk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBjbG9uZURlZXAsXG4gIGZsYXR0ZW4sXG4gIG1hcCxcbiAgZmlsdGVyLFxuICBpc0VxdWFsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBpbml0aWFsaXNlQ2hpbGRDb2xsZWN0aW9ucyB9IGZyb20gJy4uL2NvbGxlY3Rpb25BcGkvaW5pdGlhbGlzZSc7XG5pbXBvcnQgeyB2YWxpZGF0ZSB9IGZyb20gJy4vdmFsaWRhdGUnO1xuaW1wb3J0IHsgX2xvYWQsIGdldFJlY29yZEZpbGVOYW1lIH0gZnJvbSAnLi9sb2FkJztcbmltcG9ydCB7XG4gIGFwaVdyYXBwZXIsIGV2ZW50cywgJCwgam9pbktleSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSwgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcbiAgaXNSZWNvcmQsIGdldE5vZGUsIGlzU2luZ2xlUmVjb3JkLFxuICBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlLFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgYWRkVG9BbGxJZHMgfSBmcm9tICcuLi9pbmRleGluZy9hbGxJZHMnO1xuaW1wb3J0IHtcbiAgdHJhbnNhY3Rpb25Gb3JDcmVhdGVSZWNvcmQsXG4gIHRyYW5zYWN0aW9uRm9yVXBkYXRlUmVjb3JkLFxufSBmcm9tICcuLi90cmFuc2FjdGlvbnMvY3JlYXRlJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IGluaXRpYWxpc2VJbmRleCB9IGZyb20gJy4uL2luZGV4aW5nL2luaXRpYWxpc2VJbmRleCc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IHNhdmUgPSBhcHAgPT4gYXN5bmMgKHJlY29yZCwgY29udGV4dCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMucmVjb3JkQXBpLnNhdmUsXG4gIHJlY29yZC5pc05ld1xuICAgID8gcGVybWlzc2lvbi5jcmVhdGVSZWNvcmQuaXNBdXRob3JpemVkKHJlY29yZC5rZXkpXG4gICAgOiBwZXJtaXNzaW9uLnVwZGF0ZVJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkLmtleSksIHsgcmVjb3JkIH0sXG4gIF9zYXZlLCBhcHAsIHJlY29yZCwgY29udGV4dCwgZmFsc2UsXG4pO1xuXG5cbmV4cG9ydCBjb25zdCBfc2F2ZSA9IGFzeW5jIChhcHAsIHJlY29yZCwgY29udGV4dCwgc2tpcFZhbGlkYXRpb24gPSBmYWxzZSkgPT4ge1xuICBjb25zdCByZWNvcmRDbG9uZSA9IGNsb25lRGVlcChyZWNvcmQpO1xuICBpZiAoIXNraXBWYWxpZGF0aW9uKSB7XG4gICAgY29uc3QgdmFsaWRhdGlvblJlc3VsdCA9IGF3YWl0IHZhbGlkYXRlKGFwcCkocmVjb3JkQ2xvbmUsIGNvbnRleHQpO1xuICAgIGlmICghdmFsaWRhdGlvblJlc3VsdC5pc1ZhbGlkKSB7XG4gICAgICBhd2FpdCBhcHAucHVibGlzaChldmVudHMucmVjb3JkQXBpLnNhdmUub25JbnZhbGlkLCB7IHJlY29yZCwgdmFsaWRhdGlvblJlc3VsdCB9KTtcbiAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYFNhdmUgOiBSZWNvcmQgSW52YWxpZCA6ICR7XG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHZhbGlkYXRpb25SZXN1bHQuZXJyb3JzKX1gKTtcbiAgICB9XG4gIH1cblxuICBpZiAocmVjb3JkQ2xvbmUuaXNOZXcpIHtcbiAgICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShyZWNvcmQua2V5KTtcbiAgICBpZighcmVjb3JkTm9kZSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG5vZGUgZm9yIFwiICsgcmVjb3JkLmtleSk7XG5cbiAgICBpZighaXNTaW5nbGVSZWNvcmQocmVjb3JkTm9kZSkpXG4gICAgICBhd2FpdCBhZGRUb0FsbElkcyhhcHAuaGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlKShyZWNvcmRDbG9uZSk7XG4gICAgICBcbiAgICBjb25zdCB0cmFuc2FjdGlvbiA9IGF3YWl0IHRyYW5zYWN0aW9uRm9yQ3JlYXRlUmVjb3JkKFxuICAgICAgYXBwLCByZWNvcmRDbG9uZSxcbiAgICApO1xuICAgIHJlY29yZENsb25lLnRyYW5zYWN0aW9uSWQgPSB0cmFuc2FjdGlvbi5pZDtcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihyZWNvcmRDbG9uZS5rZXkpO1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlRm9sZGVyKFxuICAgICAgam9pbktleShyZWNvcmRDbG9uZS5rZXksICdmaWxlcycpLFxuICAgICk7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVKc29uKFxuICAgICAgZ2V0UmVjb3JkRmlsZU5hbWUocmVjb3JkQ2xvbmUua2V5KSxcbiAgICAgIHJlY29yZENsb25lLFxuICAgICk7XG4gICAgYXdhaXQgaW5pdGlhbGlzZVJldmVyc2VSZWZlcmVuY2VJbmRleGVzKGFwcCwgcmVjb3JkKTtcbiAgICBhd2FpdCBpbml0aWFsaXNlQW5jZXN0b3JJbmRleGVzKGFwcCwgcmVjb3JkKTtcbiAgICBhd2FpdCBpbml0aWFsaXNlQ2hpbGRDb2xsZWN0aW9ucyhhcHAsIHJlY29yZENsb25lLmtleSk7XG4gICAgYXdhaXQgYXBwLnB1Ymxpc2goZXZlbnRzLnJlY29yZEFwaS5zYXZlLm9uUmVjb3JkQ3JlYXRlZCwge1xuICAgICAgcmVjb3JkOiByZWNvcmRDbG9uZSxcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBvbGRSZWNvcmQgPSBhd2FpdCBfbG9hZChhcHAsIHJlY29yZENsb25lLmtleSk7XG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSBhd2FpdCB0cmFuc2FjdGlvbkZvclVwZGF0ZVJlY29yZChcbiAgICAgIGFwcCwgb2xkUmVjb3JkLCByZWNvcmRDbG9uZSxcbiAgICApO1xuICAgIHJlY29yZENsb25lLnRyYW5zYWN0aW9uSWQgPSB0cmFuc2FjdGlvbi5pZDtcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgICBnZXRSZWNvcmRGaWxlTmFtZShyZWNvcmRDbG9uZS5rZXkpLFxuICAgICAgcmVjb3JkQ2xvbmUsXG4gICAgKTtcbiAgICBhd2FpdCBhcHAucHVibGlzaChldmVudHMucmVjb3JkQXBpLnNhdmUub25SZWNvcmRVcGRhdGVkLCB7XG4gICAgICBvbGQ6IG9sZFJlY29yZCxcbiAgICAgIG5ldzogcmVjb3JkQ2xvbmUsXG4gICAgfSk7XG4gIH1cblxuICBhd2FpdCBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucygpO1xuXG4gIGNvbnN0IHJldHVybmVkQ2xvbmUgPSBjbG9uZURlZXAocmVjb3JkQ2xvbmUpO1xuICByZXR1cm5lZENsb25lLmlzTmV3ID0gZmFsc2U7XG4gIHJldHVybiByZXR1cm5lZENsb25lO1xufTtcblxuY29uc3QgaW5pdGlhbGlzZUFuY2VzdG9ySW5kZXhlcyA9IGFzeW5jIChhcHAsIHJlY29yZCkgPT4ge1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShyZWNvcmQua2V5KTtcblxuICBmb3IgKGNvbnN0IGluZGV4IG9mIHJlY29yZE5vZGUuaW5kZXhlcykge1xuICAgIGNvbnN0IGluZGV4S2V5ID0gam9pbktleShyZWNvcmQua2V5LCBpbmRleC5uYW1lKTtcbiAgICBpZiAoIWF3YWl0IGFwcC5kYXRhc3RvcmUuZXhpc3RzKGluZGV4S2V5KSkgeyBhd2FpdCBpbml0aWFsaXNlSW5kZXgoYXBwLmRhdGFzdG9yZSwgcmVjb3JkLmtleSwgaW5kZXgpOyB9XG4gIH1cbn07XG5cbmNvbnN0IGluaXRpYWxpc2VSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyA9IGFzeW5jIChhcHAsIHJlY29yZCkgPT4ge1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShyZWNvcmQua2V5KTtcblxuICBjb25zdCBpbmRleE5vZGVzID0gJChmaWVsZHNUaGF0UmVmZXJlbmNlVGhpc1JlY29yZChhcHAsIHJlY29yZE5vZGUpLCBbXG4gICAgbWFwKGYgPT4gJChmLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzLCBbXG4gICAgICBtYXAobiA9PiBnZXROb2RlKFxuICAgICAgICBhcHAuaGllcmFyY2h5LFxuICAgICAgICBuLFxuICAgICAgKSksXG4gICAgXSkpLFxuICAgIGZsYXR0ZW4sXG4gIF0pO1xuXG4gIGZvciAoY29uc3QgaW5kZXhOb2RlIG9mIGluZGV4Tm9kZXMpIHtcbiAgICBhd2FpdCBpbml0aWFsaXNlSW5kZXgoXG4gICAgICBhcHAuZGF0YXN0b3JlLCByZWNvcmQua2V5LCBpbmRleE5vZGUsXG4gICAgKTtcbiAgfVxufTtcblxuY29uc3QgZmllbGRzVGhhdFJlZmVyZW5jZVRoaXNSZWNvcmQgPSAoYXBwLCByZWNvcmROb2RlKSA9PiAkKGFwcC5oaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaWx0ZXIoaXNSZWNvcmQpLFxuICBtYXAobiA9PiBuLmZpZWxkcyksXG4gIGZsYXR0ZW4sXG4gIGZpbHRlcihmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlKHJlY29yZE5vZGUpKSxcbl0pO1xuIiwiaW1wb3J0IHsgaW5jbHVkZXMgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7XG4gIHNhZmVLZXksIGFwaVdyYXBwZXIsXG4gIGV2ZW50cywgam9pbktleSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IF9kZWxldGVSZWNvcmQgfSBmcm9tICcuLi9yZWNvcmRBcGkvZGVsZXRlJztcbmltcG9ydCB7IGdldEFsbElkc0l0ZXJhdG9yLCBnZXRBbGxJZHNTaGFyZEtleSB9IGZyb20gJy4uL2luZGV4aW5nL2FsbElkcyc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBkZWxldGVDb2xsZWN0aW9uID0gKGFwcCwgZGlzYWJsZUNsZWFudXAgPSBmYWxzZSkgPT4gYXN5bmMga2V5ID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmNvbGxlY3Rpb25BcGkuZGVsZXRlLFxuICBwZXJtaXNzaW9uLm1hbmFnZUNvbGxlY3Rpb24uaXNBdXRob3JpemVkLFxuICB7IGtleSB9LFxuICBfZGVsZXRlQ29sbGVjdGlvbiwgYXBwLCBrZXksIGRpc2FibGVDbGVhbnVwLFxuKTtcblxuXG5leHBvcnQgY29uc3QgX2RlbGV0ZUNvbGxlY3Rpb24gPSBhc3luYyAoYXBwLCBrZXksIGRpc2FibGVDbGVhbnVwKSA9PiB7XG4gIGtleSA9IHNhZmVLZXkoa2V5KTtcbiAgY29uc3Qgbm9kZSA9IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHAuaGllcmFyY2h5KShrZXkpO1xuXG4gIGF3YWl0IGRlbGV0ZVJlY29yZHMoYXBwLCBrZXkpO1xuICBhd2FpdCBkZWxldGVBbGxJZHNGb2xkZXJzKGFwcCwgbm9kZSwga2V5KTtcbiAgYXdhaXQgZGVsZXRlQ29sbGVjdGlvbkZvbGRlcihhcHAsIGtleSk7XG4gIGlmICghZGlzYWJsZUNsZWFudXApIHsgYXdhaXQgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMoKTsgfVxufTtcblxuY29uc3QgZGVsZXRlQ29sbGVjdGlvbkZvbGRlciA9IGFzeW5jIChhcHAsIGtleSkgPT4gYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoa2V5KTtcblxuXG5jb25zdCBkZWxldGVBbGxJZHNGb2xkZXJzID0gYXN5bmMgKGFwcCwgbm9kZSwga2V5KSA9PiB7XG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKFxuICAgIGpvaW5LZXkoXG4gICAgICBrZXksICdhbGxpZHMnLFxuICAgICAgbm9kZS5ub2RlSWQsXG4gICAgKSxcbiAgKTtcblxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihcbiAgICBqb2luS2V5KGtleSwgJ2FsbGlkcycpLFxuICApO1xufTtcblxuY29uc3QgZGVsZXRlUmVjb3JkcyA9IGFzeW5jIChhcHAsIGtleSkgPT4ge1xuICBjb25zdCBkZWxldGVkQWxsSWRzU2hhcmRzID0gW107XG4gIGNvbnN0IGRlbGV0ZUFsbElkc1NoYXJkID0gYXN5bmMgKHJlY29yZElkKSA9PiB7XG4gICAgY29uc3Qgc2hhcmRLZXkgPSBnZXRBbGxJZHNTaGFyZEtleShcbiAgICAgIGFwcC5oaWVyYXJjaHksIGtleSwgcmVjb3JkSWQsXG4gICAgKTtcblxuICAgIGlmIChpbmNsdWRlcyhzaGFyZEtleSkoZGVsZXRlZEFsbElkc1NoYXJkcykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkZWxldGVkQWxsSWRzU2hhcmRzLnB1c2goc2hhcmRLZXkpO1xuXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKHNoYXJkS2V5KTtcbiAgfTtcblxuICBjb25zdCBpdGVyYXRlID0gYXdhaXQgZ2V0QWxsSWRzSXRlcmF0b3IoYXBwKShrZXkpO1xuXG4gIGxldCBpZHMgPSBhd2FpdCBpdGVyYXRlKCk7XG4gIHdoaWxlICghaWRzLmRvbmUpIHtcbiAgICBpZiAoaWRzLnJlc3VsdC5jb2xsZWN0aW9uS2V5ID09PSBrZXkpIHtcbiAgICAgIGZvciAoY29uc3QgaWQgb2YgaWRzLnJlc3VsdC5pZHMpIHtcbiAgICAgICAgYXdhaXQgX2RlbGV0ZVJlY29yZChcbiAgICAgICAgICBhcHAsXG4gICAgICAgICAgam9pbktleShrZXksIGlkKSxcbiAgICAgICAgICB0cnVlLFxuICAgICAgICApO1xuICAgICAgICBhd2FpdCBkZWxldGVBbGxJZHNTaGFyZChpZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWRzID0gYXdhaXQgaXRlcmF0ZSgpO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgdHJ5QXdhaXRPcklnbm9yZSxcbiAgc2FmZUtleVxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgaXNJbmRleCwgaXNTaGFyZGVkSW5kZXgsXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xuICBnZXRBbGxTaGFyZEtleXMsIGdldFNoYXJkTWFwS2V5LFxuICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXksXG59IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcblxuZXhwb3J0IGNvbnN0IF9kZWxldGVJbmRleCA9IGFzeW5jIChhcHAsIGluZGV4S2V5LCBpbmNsdWRlRm9sZGVyKSA9PiB7XG4gIGluZGV4S2V5ID0gc2FmZUtleShpbmRleEtleSk7XG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoaW5kZXhLZXkpO1xuXG4gIGlmICghaXNJbmRleChpbmRleE5vZGUpKSB7IHRocm93IG5ldyBFcnJvcignU3VwcGxpZWQga2V5IGlzIG5vdCBhbiBpbmRleCcpOyB9XG5cbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICBjb25zdCBzaGFyZEtleXMgPSBhd2FpdCBnZXRBbGxTaGFyZEtleXMoYXBwLCBpbmRleEtleSk7XG4gICAgZm9yIChjb25zdCBrIG9mIHNoYXJkS2V5cykge1xuICAgICAgYXdhaXQgdHJ5QXdhaXRPcklnbm9yZShcbiAgICAgICAgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKGspLFxuICAgICAgKTtcbiAgICB9XG4gICAgdHJ5QXdhaXRPcklnbm9yZShcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShcbiAgICAgICAgZ2V0U2hhcmRNYXBLZXkoaW5kZXhLZXkpLFxuICAgICAgKSxcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGF3YWl0IHRyeUF3YWl0T3JJZ25vcmUoXG4gICAgICBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoXG4gICAgICAgIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleShpbmRleEtleSksXG4gICAgICApLFxuICAgICk7XG4gIH1cblxuICBpZiAoaW5jbHVkZUZvbGRlcikge1xuICAgIHRyeUF3YWl0T3JJZ25vcmUoXG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihpbmRleEtleSksXG4gICAgKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIHNhZmVLZXksIGFwaVdyYXBwZXIsXG4gIGV2ZW50cywgam9pbktleSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IF9sb2FkLCBnZXRSZWNvcmRGaWxlTmFtZSB9IGZyb20gJy4vbG9hZCc7XG5pbXBvcnQgeyBfZGVsZXRlQ29sbGVjdGlvbiB9IGZyb20gJy4uL2NvbGxlY3Rpb25BcGkvZGVsZXRlJztcbmltcG9ydCB7XG4gIGdldEV4YWN0Tm9kZUZvclBhdGhcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IF9kZWxldGVJbmRleCB9IGZyb20gJy4uL2luZGV4QXBpL2RlbGV0ZSc7XG5pbXBvcnQgeyB0cmFuc2FjdGlvbkZvckRlbGV0ZVJlY29yZCB9IGZyb20gJy4uL3RyYW5zYWN0aW9ucy9jcmVhdGUnO1xuaW1wb3J0IHsgcmVtb3ZlRnJvbUFsbElkcyB9IGZyb20gJy4uL2luZGV4aW5nL2FsbElkcyc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBkZWxldGVSZWNvcmQgPSAoYXBwLCBkaXNhYmxlQ2xlYW51cCA9IGZhbHNlKSA9PiBhc3luYyBrZXkgPT4ge1xuICBrZXkgPSBzYWZlS2V5KGtleSk7XG4gIHJldHVybiBhcGlXcmFwcGVyKFxuICAgIGFwcCxcbiAgICBldmVudHMucmVjb3JkQXBpLmRlbGV0ZSxcbiAgICBwZXJtaXNzaW9uLmRlbGV0ZVJlY29yZC5pc0F1dGhvcml6ZWQoa2V5KSxcbiAgICB7IGtleSB9LFxuICAgIF9kZWxldGVSZWNvcmQsIGFwcCwga2V5LCBkaXNhYmxlQ2xlYW51cCxcbiAgKTtcbn1cblxuLy8gY2FsbGVkIGRlbGV0ZVJlY29yZCBiZWNhdXNlIGRlbGV0ZSBpcyBhIGtleXdvcmRcbmV4cG9ydCBjb25zdCBfZGVsZXRlUmVjb3JkID0gYXN5bmMgKGFwcCwga2V5LCBkaXNhYmxlQ2xlYW51cCkgPT4ge1xuICBrZXkgPSBzYWZlS2V5KGtleSk7XG4gIGNvbnN0IG5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKGtleSk7XG5cbiAgY29uc3QgcmVjb3JkID0gYXdhaXQgX2xvYWQoYXBwLCBrZXkpO1xuICBhd2FpdCB0cmFuc2FjdGlvbkZvckRlbGV0ZVJlY29yZChhcHAsIHJlY29yZCk7XG5cbiAgZm9yIChjb25zdCBjb2xsZWN0aW9uUmVjb3JkIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICBjb25zdCBjb2xsZWN0aW9uS2V5ID0gam9pbktleShcbiAgICAgIGtleSwgY29sbGVjdGlvblJlY29yZC5jb2xsZWN0aW9uTmFtZSxcbiAgICApO1xuICAgIGF3YWl0IF9kZWxldGVDb2xsZWN0aW9uKGFwcCwgY29sbGVjdGlvbktleSwgdHJ1ZSk7XG4gIH1cblxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoXG4gICAgZ2V0UmVjb3JkRmlsZU5hbWUoa2V5KSxcbiAgKTtcblxuICBhd2FpdCBkZWxldGVGaWxlcyhhcHAsIGtleSk7XG5cbiAgYXdhaXQgcmVtb3ZlRnJvbUFsbElkcyhhcHAuaGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlKShyZWNvcmQpO1xuXG4gIGlmICghZGlzYWJsZUNsZWFudXApIHsgYXdhaXQgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMoKTsgfVxuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKGtleSk7XG4gIGF3YWl0IGRlbGV0ZUluZGV4ZXMoYXBwLCBrZXkpO1xufTtcblxuY29uc3QgZGVsZXRlSW5kZXhlcyA9IGFzeW5jIChhcHAsIGtleSkgPT4ge1xuICBjb25zdCBub2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShrZXkpO1xuICAvKiBjb25zdCByZXZlcnNlSW5kZXhLZXlzID0gJChhcHAuaGllcmFyY2h5LCBbXG4gICAgICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgICAgICAgbWFwKG4gPT4gbi5maWVsZHMpLFxuICAgICAgICBmbGF0dGVuLFxuICAgICAgICBmaWx0ZXIoaXNTb21ldGhpbmcpLFxuICAgICAgICBmaWx0ZXIoZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvTm9kZShub2RlKSksXG4gICAgICAgIG1hcChmID0+ICQoZi50eXBlT3B0aW9ucy5yZXZlcnNlSW5kZXhOb2RlS2V5cywgW1xuICAgICAgICAgICAgICAgICAgICBtYXAobiA9PiBnZXROb2RlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAuaGllcmFyY2h5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuKSlcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICApLFxuICAgICAgICBmbGF0dGVuLFxuICAgICAgICBtYXAobiA9PiBqb2luS2V5KGtleSwgbi5uYW1lKSlcbiAgICBdKTtcblxuICAgIGZvcihsZXQgaSBvZiByZXZlcnNlSW5kZXhLZXlzKSB7XG4gICAgICAgIGF3YWl0IF9kZWxldGVJbmRleChhcHAsIGksIHRydWUpO1xuICAgIH0gKi9cblxuXG4gIGZvciAoY29uc3QgaW5kZXggb2Ygbm9kZS5pbmRleGVzKSB7XG4gICAgY29uc3QgaW5kZXhLZXkgPSBqb2luS2V5KGtleSwgaW5kZXgubmFtZSk7XG4gICAgYXdhaXQgX2RlbGV0ZUluZGV4KGFwcCwgaW5kZXhLZXksIHRydWUpO1xuICB9XG59O1xuXG5jb25zdCBkZWxldGVGaWxlcyA9IGFzeW5jIChhcHAsIGtleSkgPT4ge1xuICBjb25zdCBmaWxlc0ZvbGRlciA9IGpvaW5LZXkoa2V5LCAnZmlsZXMnKTtcbiAgY29uc3QgYWxsRmlsZXMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZvbGRlckNvbnRlbnRzKFxuICAgIGZpbGVzRm9sZGVyLFxuICApO1xuXG4gIGZvciAoY29uc3QgZmlsZSBvZiBhbGxGaWxlcykge1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShmaWxlKTtcbiAgfVxuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKFxuICAgIGpvaW5LZXkoa2V5LCAnZmlsZXMnKSxcbiAgKTtcbn07XG4iLCJpbXBvcnQge1xuICBpbmNsdWRlcywgZmlsdGVyLFxuICBtYXAsIHNvbWUsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHsgX2xvYWQgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IHtcbiAgYXBpV3JhcHBlciwgZXZlbnRzLCBzcGxpdEtleSxcbiAgJCwgam9pbktleSwgaXNOb3RoaW5nLCB0cnlBd2FpdE9ySWdub3JlLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0RXhhY3ROb2RlRm9yUGF0aCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBpc0xlZ2FsRmlsZW5hbWUgfSBmcm9tICcuLi90eXBlcy9maWxlJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciwgRm9yYmlkZGVuRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IHVwbG9hZEZpbGUgPSBhcHAgPT4gYXN5bmMgKHJlY29yZEtleSwgcmVhZGFibGVTdHJlYW0sIHJlbGF0aXZlRmlsZVBhdGgpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLnJlY29yZEFwaS51cGxvYWRGaWxlLFxuICBwZXJtaXNzaW9uLnVwZGF0ZVJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkS2V5KSxcbiAgeyByZWNvcmRLZXksIHJlYWRhYmxlU3RyZWFtLCByZWxhdGl2ZUZpbGVQYXRoIH0sXG4gIF91cGxvYWRGaWxlLCBhcHAsIHJlY29yZEtleSwgcmVhZGFibGVTdHJlYW0sIHJlbGF0aXZlRmlsZVBhdGgsXG4pO1xuXG5jb25zdCBfdXBsb2FkRmlsZSA9IGFzeW5jIChhcHAsIHJlY29yZEtleSwgcmVhZGFibGVTdHJlYW0sIHJlbGF0aXZlRmlsZVBhdGgpID0+IHtcbiAgaWYgKGlzTm90aGluZyhyZWNvcmRLZXkpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ1JlY29yZCBLZXkgbm90IHN1cHBsaWVkJyk7IH1cbiAgaWYgKGlzTm90aGluZyhyZWxhdGl2ZUZpbGVQYXRoKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdmaWxlIHBhdGggbm90IHN1cHBsaWVkJyk7IH1cbiAgaWYgKCFpc0xlZ2FsRmlsZW5hbWUocmVsYXRpdmVGaWxlUGF0aCkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignSWxsZWdhbCBmaWxlbmFtZScpOyB9XG5cbiAgY29uc3QgcmVjb3JkID0gYXdhaXQgX2xvYWQoYXBwLCByZWNvcmRLZXkpO1xuXG4gIGNvbnN0IGZ1bGxGaWxlUGF0aCA9IHNhZmVHZXRGdWxsRmlsZVBhdGgoXG4gICAgcmVjb3JkS2V5LCByZWxhdGl2ZUZpbGVQYXRoLFxuICApO1xuXG4gIGNvbnN0IHRlbXBGaWxlUGF0aCA9IGAke2Z1bGxGaWxlUGF0aH1fJHtnZW5lcmF0ZSgpfS50ZW1wYDtcblxuICBjb25zdCBvdXRwdXRTdHJlYW0gPSBhd2FpdCBhcHAuZGF0YXN0b3JlLndyaXRhYmxlRmlsZVN0cmVhbShcbiAgICB0ZW1wRmlsZVBhdGgsXG4gICk7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCkgPT4ge1xuICAgIHJlYWRhYmxlU3RyZWFtLnBpcGUob3V0cHV0U3RyZWFtKTtcbiAgICBvdXRwdXRTdHJlYW0ub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICBvdXRwdXRTdHJlYW0ub24oJ2ZpbmlzaCcsIHJlc29sdmUpO1xuICB9KVxuICAudGhlbigoKSA9PiBhcHAuZGF0YXN0b3JlLmdldEZpbGVTaXplKHRlbXBGaWxlUGF0aCkpXG4gIC50aGVuKHNpemUgPT4ge1xuICAgIGNvbnN0IGlzRXhwZWN0ZWRGaWxlU2l6ZSA9IGNoZWNrRmlsZVNpemVBZ2FpbnN0RmllbGRzKFxuICAgICAgYXBwLCByZWNvcmQsIHJlbGF0aXZlRmlsZVBhdGgsIHNpemVcbiAgICApOyAgXG4gICAgaWYgKCFpc0V4cGVjdGVkRmlsZVNpemUpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgRmllbGRzIGZvciAke3JlbGF0aXZlRmlsZVBhdGh9IGRvIG5vdCBoYXZlIGV4cGVjdGVkIHNpemU6ICR7am9pbignLCcpKGluY29ycmVjdEZpZWxkcyl9YCk7IH0gIFxuXG4gIH0pXG4gIC50aGVuKCgpID0+IHRyeUF3YWl0T3JJZ25vcmUoYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlLCBmdWxsRmlsZVBhdGgpKVxuICAudGhlbigoKSA9PiBhcHAuZGF0YXN0b3JlLnJlbmFtZUZpbGUodGVtcEZpbGVQYXRoLCBmdWxsRmlsZVBhdGgpKTtcblxuICAvKlxuICByZWFkYWJsZVN0cmVhbS5waXBlKG91dHB1dFN0cmVhbSk7XG5cbiAgYXdhaXQgbmV3IFByb21pc2UoZnVsZmlsbCA9PiBvdXRwdXRTdHJlYW0ub24oJ2ZpbmlzaCcsIGZ1bGZpbGwpKTtcblxuICBjb25zdCBpc0V4cGVjdGVkRmlsZVNpemUgPSBjaGVja0ZpbGVTaXplQWdhaW5zdEZpZWxkcyhcbiAgICBhcHAsXG4gICAgcmVjb3JkLCByZWxhdGl2ZUZpbGVQYXRoLFxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0RmlsZVNpemUodGVtcEZpbGVQYXRoKSxcbiAgKTtcblxuICBpZiAoIWlzRXhwZWN0ZWRGaWxlU2l6ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBGaWVsZHMgZm9yICR7cmVsYXRpdmVGaWxlUGF0aH0gZG8gbm90IGhhdmUgZXhwZWN0ZWQgc2l6ZWApO1xuICB9XG5cbiAgYXdhaXQgdHJ5QXdhaXRPcklnbm9yZShhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUsIGZ1bGxGaWxlUGF0aCk7XG5cbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS5yZW5hbWVGaWxlKHRlbXBGaWxlUGF0aCwgZnVsbEZpbGVQYXRoKTtcbiAgKi9cbn07XG5cbmNvbnN0IGNoZWNrRmlsZVNpemVBZ2FpbnN0RmllbGRzID0gKGFwcCwgcmVjb3JkLCByZWxhdGl2ZUZpbGVQYXRoLCBleHBlY3RlZFNpemUpID0+IHtcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkocmVjb3JkLmtleSk7XG5cbiAgY29uc3QgaW5jb3JyZWN0RmlsZUZpZWxkcyA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBmaWx0ZXIoZiA9PiBmLnR5cGUgPT09ICdmaWxlJ1xuICAgICAgJiYgcmVjb3JkW2YubmFtZV0ucmVsYXRpdmVQYXRoID09PSByZWxhdGl2ZUZpbGVQYXRoXG4gICAgICAmJiByZWNvcmRbZi5uYW1lXS5zaXplICE9PSBleHBlY3RlZFNpemUpLFxuICAgIG1hcChmID0+IGYubmFtZSksXG4gIF0pO1xuXG4gIGNvbnN0IGluY29ycmVjdEZpbGVBcnJheUZpZWxkcyA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBmaWx0ZXIoYSA9PiBhLnR5cGUgPT09ICdhcnJheTxmaWxlPidcbiAgICAgICYmICQocmVjb3JkW2EubmFtZV0sIFtcbiAgICAgICAgc29tZShmID0+IHJlY29yZFtmLm5hbWVdLnJlbGF0aXZlUGF0aCA9PT0gcmVsYXRpdmVGaWxlUGF0aFxuICAgICAgICAgICYmIHJlY29yZFtmLm5hbWVdLnNpemUgIT09IGV4cGVjdGVkU2l6ZSksXG4gICAgICBdKSksXG4gICAgbWFwKGYgPT4gZi5uYW1lKSxcbiAgXSk7XG5cbiAgY29uc3QgaW5jb3JyZWN0RmllbGRzID0gW1xuICAgIC4uLmluY29ycmVjdEZpbGVGaWVsZHMsXG4gICAgLi4uaW5jb3JyZWN0RmlsZUFycmF5RmllbGRzLFxuICBdO1xuXG4gIGlmIChpbmNvcnJlY3RGaWVsZHMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuZXhwb3J0IGNvbnN0IHNhZmVHZXRGdWxsRmlsZVBhdGggPSAocmVjb3JkS2V5LCByZWxhdGl2ZUZpbGVQYXRoKSA9PiB7XG4gIGNvbnN0IG5hdWdodHlVc2VyID0gKCkgPT4geyB0aHJvdyBuZXcgRm9yYmlkZGVuRXJyb3IoJ25hdWdodHkgbmF1Z2h0eScpOyB9O1xuXG4gIGlmIChyZWxhdGl2ZUZpbGVQYXRoLnN0YXJ0c1dpdGgoJy4uJykpIG5hdWdodHlVc2VyKCk7XG5cbiAgY29uc3QgcGF0aFBhcnRzID0gc3BsaXRLZXkocmVsYXRpdmVGaWxlUGF0aCk7XG5cbiAgaWYgKGluY2x1ZGVzKCcuLicpKHBhdGhQYXJ0cykpIG5hdWdodHlVc2VyKCk7XG5cbiAgY29uc3QgcmVjb3JkS2V5UGFydHMgPSBzcGxpdEtleShyZWNvcmRLZXkpO1xuXG4gIGNvbnN0IGZ1bGxQYXRoUGFydHMgPSBbXG4gICAgLi4ucmVjb3JkS2V5UGFydHMsXG4gICAgJ2ZpbGVzJyxcbiAgICAuLi5maWx0ZXIocCA9PiBwICE9PSAnLicpKHBhdGhQYXJ0cyksXG4gIF07XG5cbiAgcmV0dXJuIGpvaW5LZXkoZnVsbFBhdGhQYXJ0cyk7XG59O1xuIiwiaW1wb3J0IHsgYXBpV3JhcHBlciwgZXZlbnRzLCBpc05vdGhpbmcgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgc2FmZUdldEZ1bGxGaWxlUGF0aCB9IGZyb20gJy4vdXBsb2FkRmlsZSc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGRvd25sb2FkRmlsZSA9IGFwcCA9PiBhc3luYyAocmVjb3JkS2V5LCByZWxhdGl2ZVBhdGgpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLnJlY29yZEFwaS51cGxvYWRGaWxlLFxuICBwZXJtaXNzaW9uLnJlYWRSZWNvcmQuaXNBdXRob3JpemVkKHJlY29yZEtleSksXG4gIHsgcmVjb3JkS2V5LCByZWxhdGl2ZVBhdGggfSwvL3JlbW92ZSBkdXBlIGtleSAncmVjb3JkS2V5JyBmcm9tIG9iamVjdFxuICBfZG93bmxvYWRGaWxlLCBhcHAsIHJlY29yZEtleSwgcmVsYXRpdmVQYXRoLFxuKTsgXG5cblxuY29uc3QgX2Rvd25sb2FkRmlsZSA9IGFzeW5jIChhcHAsIHJlY29yZEtleSwgcmVsYXRpdmVQYXRoKSA9PiB7XG4gIGlmIChpc05vdGhpbmcocmVjb3JkS2V5KSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdSZWNvcmQgS2V5IG5vdCBzdXBwbGllZCcpOyB9XG4gIGlmIChpc05vdGhpbmcocmVsYXRpdmVQYXRoKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdmaWxlIHBhdGggbm90IHN1cHBsaWVkJyk7IH1cblxuICByZXR1cm4gYXdhaXQgYXBwLmRhdGFzdG9yZS5yZWFkYWJsZUZpbGVTdHJlYW0oXG4gICAgc2FmZUdldEZ1bGxGaWxlUGF0aChcbiAgICAgIHJlY29yZEtleSwgcmVsYXRpdmVQYXRoLFxuICAgICksXG4gICk7XG59O1xuIiwiaW1wb3J0IHsgZmluZCwgdGFrZSwgdW5pb24gfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2V0RmxhdHRlbmVkSGllcmFyY2h5IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7ICQsIHNwbGl0S2V5LCBqb2luS2V5IH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGN1c3RvbUlkID0gYXBwID0+IChub2RlTmFtZSwgaWQpID0+IHtcbiAgY29uc3Qgbm9kZSA9ICQoYXBwLmhpZXJhcmNoeSwgW1xuICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgICBmaW5kKG4gPT4gbi5uYW1lID09PSBub2RlTmFtZSksXG4gIF0pO1xuXG4gIGlmICghbm9kZSkgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoYENhbm5vdCBmaW5kIG5vZGUgJHtub2RlTmFtZX1gKTtcblxuICByZXR1cm4gYCR7bm9kZS5ub2RlSWR9LSR7aWR9YDtcbn07XG5cbmV4cG9ydCBjb25zdCBzZXRDdXN0b21JZCA9IGFwcCA9PiAocmVjb3JkLCBpZCkgPT4ge1xuICByZWNvcmQuaWQgPSBjdXN0b21JZChhcHApKHJlY29yZC50eXBlLCBpZCk7XG5cbiAgY29uc3Qga2V5UGFydHMgPSBzcGxpdEtleShyZWNvcmQua2V5KTtcblxuICByZWNvcmQua2V5ID0gJChrZXlQYXJ0cywgW1xuICAgIHRha2Uoa2V5UGFydHMubGVuZ3RoIC0gMSksXG4gICAgdW5pb24oW3JlY29yZC5pZF0pLFxuICAgIGpvaW5LZXksXG4gIF0pO1xuXG4gIHJldHVybiByZWNvcmQ7XG59O1xuIiwiaW1wb3J0IHsgZ2V0TmV3LCBnZXROZXdDaGlsZCB9IGZyb20gJy4vZ2V0TmV3JztcbmltcG9ydCB7IGxvYWQgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IHsgdmFsaWRhdGUgfSBmcm9tICcuL3ZhbGlkYXRlJztcbmltcG9ydCB7IGdldENvbnRleHQgfSBmcm9tICcuL2dldENvbnRleHQnO1xuaW1wb3J0IHsgc2F2ZSB9IGZyb20gJy4vc2F2ZSc7XG5pbXBvcnQgeyBkZWxldGVSZWNvcmQgfSBmcm9tICcuL2RlbGV0ZSc7XG5pbXBvcnQgeyB1cGxvYWRGaWxlIH0gZnJvbSAnLi91cGxvYWRGaWxlJztcbmltcG9ydCB7IGRvd25sb2FkRmlsZSB9IGZyb20gJy4vZG93bmxvYWRGaWxlJztcbmltcG9ydCB7IGN1c3RvbUlkLCBzZXRDdXN0b21JZCB9IGZyb20gJy4vY3VzdG9tSWQnO1xuXG5jb25zdCBhcGkgPSBhcHAgPT4gKHtcbiAgZ2V0TmV3OiBnZXROZXcoYXBwKSxcbiAgZ2V0TmV3Q2hpbGQ6IGdldE5ld0NoaWxkKGFwcCksXG4gIHNhdmU6IHNhdmUoYXBwKSxcbiAgbG9hZDogbG9hZChhcHApLFxuICBkZWxldGU6IGRlbGV0ZVJlY29yZChhcHAsIGZhbHNlKSxcbiAgdmFsaWRhdGU6IHZhbGlkYXRlKGFwcCksXG4gIGdldENvbnRleHQ6IGdldENvbnRleHQoYXBwKSxcbiAgdXBsb2FkRmlsZTogdXBsb2FkRmlsZShhcHApLFxuICBkb3dubG9hZEZpbGU6IGRvd25sb2FkRmlsZShhcHApLFxuICBjdXN0b21JZDogY3VzdG9tSWQoYXBwKSxcbiAgc2V0Q3VzdG9tSWQ6IHNldEN1c3RvbUlkKGFwcCksXG59KTtcblxuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkQXBpID0gYXBwID0+IGFwaShhcHApO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRSZWNvcmRBcGk7XG4iLCJpbXBvcnQgeyBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHtcbiAgaXNOb3RoaW5nLCBzYWZlS2V5LCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsb3dlZFJlY29yZFR5cGVzID0gYXBwID0+IGtleSA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuY29sbGVjdGlvbkFwaS5nZXRBbGxvd2VkUmVjb3JkVHlwZXMsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsga2V5IH0sXG4gIF9nZXRBbGxvd2VkUmVjb3JkVHlwZXMsIGFwcCwga2V5LFxuKTtcblxuY29uc3QgX2dldEFsbG93ZWRSZWNvcmRUeXBlcyA9IChhcHAsIGtleSkgPT4ge1xuICBrZXkgPSBzYWZlS2V5KGtleSk7XG4gIGNvbnN0IG5vZGUgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwLmhpZXJhcmNoeSkoa2V5KTtcbiAgcmV0dXJuIGlzTm90aGluZyhub2RlKSA/IFtdIDogW25vZGUubmFtZV07XG59O1xuIiwiaW1wb3J0IHsgZ2V0QWxsSWRzSXRlcmF0b3IgfSBmcm9tICcuLi9pbmRleGluZy9hbGxJZHMnO1xuaW1wb3J0IHsgZ2V0QWxsb3dlZFJlY29yZFR5cGVzIH0gZnJvbSAnLi9nZXRBbGxvd2VkUmVjb3JkVHlwZXMnO1xuaW1wb3J0IHsgZGVsZXRlQ29sbGVjdGlvbiB9IGZyb20gJy4vZGVsZXRlJztcblxuZXhwb3J0IGNvbnN0IGdldENvbGxlY3Rpb25BcGkgPSBhcHAgPT4gKHtcbiAgZ2V0QWxsb3dlZFJlY29yZFR5cGVzOiBnZXRBbGxvd2VkUmVjb3JkVHlwZXMoYXBwKSxcbiAgZ2V0QWxsSWRzSXRlcmF0b3I6IGdldEFsbElkc0l0ZXJhdG9yKGFwcCksXG4gIGRlbGV0ZTogZGVsZXRlQ29sbGVjdGlvbihhcHApLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGdldENvbGxlY3Rpb25BcGk7XG4iLCJpbXBvcnQge1xuICBmaW5kLCBmaWx0ZXIsIFxuICBpbmNsdWRlcywgc29tZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdldEFsbElkc0l0ZXJhdG9yIH0gZnJvbSAnLi4vaW5kZXhpbmcvYWxsSWRzJztcbmltcG9ydCB7XG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSwgZ2V0UmVjb3JkTm9kZUJ5SWQsXG4gIGdldENvbGxlY3Rpb25Ob2RlQnlLZXlPck5vZGVLZXksIGdldE5vZGUsIGlzSW5kZXgsXG4gIGlzUmVjb3JkLCBpc0RlY2VuZGFudCwgZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgsXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4LFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHtcbiAgam9pbktleSwgYXBpV3JhcHBlciwgZXZlbnRzLCAkLCBhbGxUcnVlLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgY3JlYXRlQnVpbGRJbmRleEZvbGRlcixcbiAgdHJhbnNhY3Rpb25Gb3JCdWlsZEluZGV4LFxufSBmcm9tICcuLi90cmFuc2FjdGlvbnMvY3JlYXRlJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5cbi8qKiByZWJ1aWxkcyBhbiBpbmRleFxuICogQHBhcmFtIHtvYmplY3R9IGFwcCAtIHRoZSBhcHBsaWNhdGlvbiBjb250YWluZXJcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbmRleE5vZGVLZXkgLSBub2RlIGtleSBvZiB0aGUgaW5kZXgsIHdoaWNoIHRoZSBpbmRleCBiZWxvbmdzIHRvXG4gKi9cbmV4cG9ydCBjb25zdCBidWlsZEluZGV4ID0gYXBwID0+IGFzeW5jIGluZGV4Tm9kZUtleSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5pbmRleEFwaS5idWlsZEluZGV4LFxuICBwZXJtaXNzaW9uLm1hbmFnZUluZGV4LmlzQXV0aG9yaXplZCxcbiAgeyBpbmRleE5vZGVLZXkgfSxcbiAgX2J1aWxkSW5kZXgsIGFwcCwgaW5kZXhOb2RlS2V5LFxuKTtcblxuY29uc3QgX2J1aWxkSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleE5vZGVLZXkpID0+IHtcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0Tm9kZShhcHAuaGllcmFyY2h5LCBpbmRleE5vZGVLZXkpO1xuXG4gIGF3YWl0IGNyZWF0ZUJ1aWxkSW5kZXhGb2xkZXIoYXBwLmRhdGFzdG9yZSwgaW5kZXhOb2RlS2V5KTtcblxuICBpZiAoIWlzSW5kZXgoaW5kZXhOb2RlKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdCdWlsZEluZGV4OiBtdXN0IHN1cHBseSBhbiBpbmRleG5vZGUnKTsgfVxuXG4gIGlmIChpbmRleE5vZGUuaW5kZXhUeXBlID09PSAncmVmZXJlbmNlJykge1xuICAgIGF3YWl0IGJ1aWxkUmV2ZXJzZVJlZmVyZW5jZUluZGV4KFxuICAgICAgYXBwLCBpbmRleE5vZGUsXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCBidWlsZEhlaXJhcmNoYWxJbmRleChcbiAgICAgIGFwcCwgaW5kZXhOb2RlLFxuICAgICk7XG4gIH1cblxuICBhd2FpdCBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucygpO1xufTtcblxuY29uc3QgYnVpbGRSZXZlcnNlUmVmZXJlbmNlSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleE5vZGUpID0+IHtcbiAgLy8gSXRlcmF0ZSB0aHJvdWdoIGFsbCByZWZlcmVuY0lORyByZWNvcmRzLFxuICAvLyBhbmQgdXBkYXRlIHJlZmVyZW5jZWQgaW5kZXggZm9yIGVhY2ggcmVjb3JkXG4gIGxldCByZWNvcmRDb3VudCA9IDA7XG4gIGNvbnN0IHJlZmVyZW5jaW5nTm9kZXMgPSAkKGFwcC5oaWVyYXJjaHksIFtcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gICAgZmlsdGVyKG4gPT4gaXNSZWNvcmQobilcbiAgICAgICAgICAgICAgICAgICAgJiYgc29tZShmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleChpbmRleE5vZGUpKShuLmZpZWxkcykpLFxuICBdKTtcblxuICBjb25zdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JSZWZlcmVuY2luZ05vZGUgPSBhc3luYyAocmVmZXJlbmNpbmdOb2RlKSA9PiB7XG4gICAgY29uc3QgaXRlcmF0ZVJlZmVyZW5jaW5nTm9kZXMgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvcihhcHApKHJlZmVyZW5jaW5nTm9kZS5jb2xsZWN0aW9uTm9kZUtleSgpKTtcblxuICAgIGxldCByZWZlcmVuY2luZ0lkSXRlcmF0b3IgPSBhd2FpdCBpdGVyYXRlUmVmZXJlbmNpbmdOb2RlcygpO1xuICAgIHdoaWxlICghcmVmZXJlbmNpbmdJZEl0ZXJhdG9yLmRvbmUpIHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZWZlcmVuY2luZ0lkSXRlcmF0b3I7XG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIHJlc3VsdC5pZHMpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkS2V5ID0gam9pbktleShyZXN1bHQuY29sbGVjdGlvbktleSwgaWQpO1xuICAgICAgICBhd2FpdCB0cmFuc2FjdGlvbkZvckJ1aWxkSW5kZXgoYXBwLCBpbmRleE5vZGUubm9kZUtleSgpLCByZWNvcmRLZXksIHJlY29yZENvdW50KTtcbiAgICAgICAgcmVjb3JkQ291bnQrKztcbiAgICAgIH1cbiAgICAgIHJlZmVyZW5jaW5nSWRJdGVyYXRvciA9IGF3YWl0IGl0ZXJhdGVSZWZlcmVuY2luZ05vZGVzKCk7XG4gICAgfVxuICB9O1xuXG4gIGZvciAoY29uc3QgcmVmZXJlbmNpbmdOb2RlIG9mIHJlZmVyZW5jaW5nTm9kZXMpIHtcbiAgICBhd2FpdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JSZWZlcmVuY2luZ05vZGUocmVmZXJlbmNpbmdOb2RlKTtcbiAgfVxufTtcblxuY29uc3QgZ2V0QWxsb3dlZFBhcmVudENvbGxlY3Rpb25Ob2RlcyA9IChoaWVyYXJjaHksIGluZGV4Tm9kZSkgPT4gJChnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleChoaWVyYXJjaHksIGluZGV4Tm9kZSksIFtcbiAgbWFwKG4gPT4gbi5wYXJlbnQoKSksXG5dKTtcblxuY29uc3QgYnVpbGRIZWlyYXJjaGFsSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleE5vZGUpID0+IHtcbiAgbGV0IHJlY29yZENvdW50ID0gMDtcblxuICBjb25zdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JJZHMgPSBhc3luYyAoY29sbGVjdGlvbktleSwgaWRzKSA9PiB7XG4gICAgZm9yIChjb25zdCByZWNvcmRJZCBvZiBpZHMpIHtcbiAgICAgIGNvbnN0IHJlY29yZEtleSA9IGpvaW5LZXkoY29sbGVjdGlvbktleSwgcmVjb3JkSWQpO1xuXG4gICAgICBjb25zdCByZWNvcmROb2RlID0gZ2V0UmVjb3JkTm9kZUJ5SWQoXG4gICAgICAgIGFwcC5oaWVyYXJjaHksXG4gICAgICAgIHJlY29yZElkLFxuICAgICAgKTtcblxuICAgICAgaWYgKHJlY29yZE5vZGVBcHBsaWVzKGluZGV4Tm9kZSkocmVjb3JkTm9kZSkpIHtcbiAgICAgICAgYXdhaXQgdHJhbnNhY3Rpb25Gb3JCdWlsZEluZGV4KFxuICAgICAgICAgIGFwcCwgaW5kZXhOb2RlLm5vZGVLZXkoKSxcbiAgICAgICAgICByZWNvcmRLZXksIHJlY29yZENvdW50LFxuICAgICAgICApO1xuICAgICAgICByZWNvcmRDb3VudCsrO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuXG4gIGNvbnN0IGNvbGxlY3Rpb25SZWNvcmRzID0gZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgoYXBwLmhpZXJhcmNoeSwgaW5kZXhOb2RlKTtcblxuICBmb3IgKGNvbnN0IHRhcmdldENvbGxlY3Rpb25SZWNvcmROb2RlIG9mIGNvbGxlY3Rpb25SZWNvcmRzKSB7XG4gICAgY29uc3QgYWxsSWRzSXRlcmF0b3IgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvcihhcHApKHRhcmdldENvbGxlY3Rpb25SZWNvcmROb2RlLmNvbGxlY3Rpb25Ob2RlS2V5KCkpO1xuXG4gICAgbGV0IGFsbElkcyA9IGF3YWl0IGFsbElkc0l0ZXJhdG9yKCk7XG4gICAgd2hpbGUgKGFsbElkcy5kb25lID09PSBmYWxzZSkge1xuICAgICAgYXdhaXQgY3JlYXRlVHJhbnNhY3Rpb25zRm9ySWRzKFxuICAgICAgICBhbGxJZHMucmVzdWx0LmNvbGxlY3Rpb25LZXksXG4gICAgICAgIGFsbElkcy5yZXN1bHQuaWRzLFxuICAgICAgKTtcbiAgICAgIGFsbElkcyA9IGF3YWl0IGFsbElkc0l0ZXJhdG9yKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlY29yZENvdW50O1xufTtcblxuY29uc3QgY2hvb3NlQ2hpbGRSZWNvcmROb2RlQnlLZXkgPSAoY29sbGVjdGlvbk5vZGUsIHJlY29yZElkKSA9PiBmaW5kKGMgPT4gcmVjb3JkSWQuc3RhcnRzV2l0aChjLm5vZGVJZCkpKGNvbGxlY3Rpb25Ob2RlLmNoaWxkcmVuKTtcblxuY29uc3QgcmVjb3JkTm9kZUFwcGxpZXMgPSBpbmRleE5vZGUgPT4gcmVjb3JkTm9kZSA9PiBpbmNsdWRlcyhyZWNvcmROb2RlLm5vZGVJZCkoaW5kZXhOb2RlLmFsbG93ZWRSZWNvcmROb2RlSWRzKTtcblxuY29uc3QgaGFzQXBwbGljYWJsZURlY2VuZGFudCA9IChoaWVyYXJjaHksIGFuY2VzdG9yTm9kZSwgaW5kZXhOb2RlKSA9PiAkKGhpZXJhcmNoeSwgW1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGZpbHRlcihcbiAgICBhbGxUcnVlKFxuICAgICAgaXNSZWNvcmQsXG4gICAgICBpc0RlY2VuZGFudChhbmNlc3Rvck5vZGUpLFxuICAgICAgcmVjb3JkTm9kZUFwcGxpZXMoaW5kZXhOb2RlKSxcbiAgICApLFxuICApLFxuXSk7XG5cbmNvbnN0IGFwcGx5QWxsRGVjZW5kYW50UmVjb3JkcyA9IGFzeW5jIChhcHAsIGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXksXG4gIGluZGV4Tm9kZSwgaW5kZXhLZXksIGN1cnJlbnRJbmRleGVkRGF0YSxcbiAgY3VycmVudEluZGV4ZWREYXRhS2V5LCByZWNvcmRDb3VudCA9IDApID0+IHtcbiAgY29uc3QgY29sbGVjdGlvbk5vZGUgPSBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5KFxuICAgIGFwcC5oaWVyYXJjaHksXG4gICAgY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSxcbiAgKTtcblxuICBjb25zdCBhbGxJZHNJdGVyYXRvciA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yKGFwcCkoY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSk7XG5cblxuICBjb25zdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JJZHMgPSBhc3luYyAoY29sbGVjdGlvbktleSwgYWxsSWRzKSA9PiB7XG4gICAgZm9yIChjb25zdCByZWNvcmRJZCBvZiBhbGxJZHMpIHtcbiAgICAgIGNvbnN0IHJlY29yZEtleSA9IGpvaW5LZXkoY29sbGVjdGlvbktleSwgcmVjb3JkSWQpO1xuXG4gICAgICBjb25zdCByZWNvcmROb2RlID0gY2hvb3NlQ2hpbGRSZWNvcmROb2RlQnlLZXkoXG4gICAgICAgIGNvbGxlY3Rpb25Ob2RlLFxuICAgICAgICByZWNvcmRJZCxcbiAgICAgICk7XG5cbiAgICAgIGlmIChyZWNvcmROb2RlQXBwbGllcyhpbmRleE5vZGUpKHJlY29yZE5vZGUpKSB7XG4gICAgICAgIGF3YWl0IHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleChcbiAgICAgICAgICBhcHAsIGluZGV4Tm9kZS5ub2RlS2V5KCksXG4gICAgICAgICAgcmVjb3JkS2V5LCByZWNvcmRDb3VudCxcbiAgICAgICAgKTtcbiAgICAgICAgcmVjb3JkQ291bnQrKztcbiAgICAgIH1cblxuICAgICAgaWYgKGhhc0FwcGxpY2FibGVEZWNlbmRhbnQoYXBwLmhpZXJhcmNoeSwgcmVjb3JkTm9kZSwgaW5kZXhOb2RlKSkge1xuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkQ29sbGVjdGlvbk5vZGUgb2YgcmVjb3JkTm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgIHJlY29yZENvdW50ID0gYXdhaXQgYXBwbHlBbGxEZWNlbmRhbnRSZWNvcmRzKFxuICAgICAgICAgICAgYXBwLFxuICAgICAgICAgICAgam9pbktleShyZWNvcmRLZXksIGNoaWxkQ29sbGVjdGlvbk5vZGUuY29sbGVjdGlvbk5hbWUpLFxuICAgICAgICAgICAgaW5kZXhOb2RlLCBpbmRleEtleSwgY3VycmVudEluZGV4ZWREYXRhLFxuICAgICAgICAgICAgY3VycmVudEluZGV4ZWREYXRhS2V5LCByZWNvcmRDb3VudCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGxldCBhbGxJZHMgPSBhd2FpdCBhbGxJZHNJdGVyYXRvcigpO1xuICB3aGlsZSAoYWxsSWRzLmRvbmUgPT09IGZhbHNlKSB7XG4gICAgYXdhaXQgY3JlYXRlVHJhbnNhY3Rpb25zRm9ySWRzKFxuICAgICAgYWxsSWRzLnJlc3VsdC5jb2xsZWN0aW9uS2V5LFxuICAgICAgYWxsSWRzLnJlc3VsdC5pZHMsXG4gICAgKTtcbiAgICBhbGxJZHMgPSBhd2FpdCBhbGxJZHNJdGVyYXRvcigpO1xuICB9XG5cbiAgcmV0dXJuIHJlY29yZENvdW50O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYnVpbGRJbmRleDtcbiIsImltcG9ydCB7IGhhcywgaXNOdW1iZXIsIGlzVW5kZWZpbmVkIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCB7XG4gIHNhZmVLZXksIGFwaVdyYXBwZXIsXG4gIGV2ZW50cywgaXNOb25FbXB0eVN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGl0ZXJhdGVJbmRleCB9IGZyb20gJy4uL2luZGV4aW5nL3JlYWQnO1xuaW1wb3J0IHtcbiAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5LFxuICBnZXRTaGFyZEtleXNJblJhbmdlLFxufSBmcm9tICcuLi9pbmRleGluZy9zaGFyZGluZyc7XG5pbXBvcnQge1xuICBnZXRFeGFjdE5vZGVGb3JQYXRoLCBpc0luZGV4LFxuICBpc1NoYXJkZWRJbmRleCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUyB9IGZyb20gJy4uL2luZGV4aW5nL3NlcmlhbGl6ZXInO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBhZ2dyZWdhdGVzID0gYXBwID0+IGFzeW5jIChpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcyA9IG51bGwsIHJhbmdlRW5kUGFyYW1zID0gbnVsbCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuaW5kZXhBcGkuYWdncmVnYXRlcyxcbiAgcGVybWlzc2lvbi5yZWFkSW5kZXguaXNBdXRob3JpemVkKGluZGV4S2V5KSxcbiAgeyBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMgfSxcbiAgX2FnZ3JlZ2F0ZXMsIGFwcCwgaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zLFxuKTtcblxuY29uc3QgX2FnZ3JlZ2F0ZXMgPSBhc3luYyAoYXBwLCBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMpID0+IHtcbiAgaW5kZXhLZXkgPSBzYWZlS2V5KGluZGV4S2V5KTtcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShpbmRleEtleSk7XG5cbiAgaWYgKCFpc0luZGV4KGluZGV4Tm9kZSkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignc3VwcGxpZWQga2V5IGlzIG5vdCBhbiBpbmRleCcpOyB9XG5cbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICBjb25zdCBzaGFyZEtleXMgPSBhd2FpdCBnZXRTaGFyZEtleXNJblJhbmdlKFxuICAgICAgYXBwLCBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMsXG4gICAgKTtcbiAgICBsZXQgYWdncmVnYXRlUmVzdWx0ID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IGsgb2Ygc2hhcmRLZXlzKSB7XG4gICAgICBjb25zdCBzaGFyZFJlc3VsdCA9IGF3YWl0IGdldEFnZ3JlZ2F0ZXMoYXBwLmhpZXJhcmNoeSwgYXBwLmRhdGFzdG9yZSwgaW5kZXhOb2RlLCBrKTtcbiAgICAgIGlmIChhZ2dyZWdhdGVSZXN1bHQgPT09IG51bGwpIHtcbiAgICAgICAgYWdncmVnYXRlUmVzdWx0ID0gc2hhcmRSZXN1bHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZ2dyZWdhdGVSZXN1bHQgPSBtZXJnZVNoYXJkQWdncmVnYXRlKFxuICAgICAgICAgIGFnZ3JlZ2F0ZVJlc3VsdCxcbiAgICAgICAgICBzaGFyZFJlc3VsdCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFnZ3JlZ2F0ZVJlc3VsdDtcbiAgfVxuICByZXR1cm4gYXdhaXQgZ2V0QWdncmVnYXRlcyhcbiAgICBhcHAuaGllcmFyY2h5LFxuICAgIGFwcC5kYXRhc3RvcmUsXG4gICAgaW5kZXhOb2RlLFxuICAgIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleShpbmRleEtleSksXG4gICk7XG59O1xuXG5jb25zdCBtZXJnZVNoYXJkQWdncmVnYXRlID0gKHRvdGFscywgc2hhcmQpID0+IHtcbiAgY29uc3QgbWVyZ2VHcm91cGluZyA9ICh0b3QsIHNocikgPT4ge1xuICAgIHRvdC5jb3VudCArPSBzaHIuY291bnQ7XG4gICAgZm9yIChjb25zdCBhZ2dOYW1lIGluIHRvdCkge1xuICAgICAgaWYgKGFnZ05hbWUgPT09ICdjb3VudCcpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgdG90YWdnID0gdG90W2FnZ05hbWVdO1xuICAgICAgY29uc3Qgc2hyYWdnID0gc2hyW2FnZ05hbWVdO1xuICAgICAgdG90YWdnLnN1bSArPSBzaHJhZ2cuc3VtO1xuICAgICAgdG90YWdnLm1heCA9IHRvdGFnZy5tYXggPiBzaHJhZ2cubWF4XG4gICAgICAgID8gdG90YWdnLm1heFxuICAgICAgICA6IHNocmFnZy5tYXg7XG4gICAgICB0b3RhZ2cubWluID0gdG90YWdnLm1pbiA8IHNocmFnZy5taW5cbiAgICAgICAgPyB0b3RhZ2cubWluXG4gICAgICAgIDogc2hyYWdnLm1pbjtcbiAgICAgIHRvdGFnZy5tZWFuID0gdG90YWdnLnN1bSAvIHRvdC5jb3VudDtcbiAgICB9XG4gICAgcmV0dXJuIHRvdDtcbiAgfTtcblxuICBmb3IgKGNvbnN0IGFnZ0dyb3VwRGVmIGluIHRvdGFscykge1xuICAgIGZvciAoY29uc3QgZ3JvdXBpbmcgaW4gc2hhcmRbYWdnR3JvdXBEZWZdKSB7XG4gICAgICBjb25zdCBncm91cGluZ1RvdGFsID0gdG90YWxzW2FnZ0dyb3VwRGVmXVtncm91cGluZ107XG4gICAgICB0b3RhbHNbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXSA9IGlzVW5kZWZpbmVkKGdyb3VwaW5nVG90YWwpXG4gICAgICAgID8gc2hhcmRbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXVxuICAgICAgICA6IG1lcmdlR3JvdXBpbmcoXG4gICAgICAgICAgdG90YWxzW2FnZ0dyb3VwRGVmXVtncm91cGluZ10sXG4gICAgICAgICAgc2hhcmRbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXSxcbiAgICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdG90YWxzO1xufTtcblxuY29uc3QgZ2V0QWdncmVnYXRlcyA9IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KSA9PiB7XG4gIGNvbnN0IGFnZ3JlZ2F0ZVJlc3VsdCA9IHt9O1xuICBjb25zdCBkb1JlYWQgPSBpdGVyYXRlSW5kZXgoXG4gICAgICAgIGFzeW5jIGl0ZW0gPT4ge1xuICAgICAgYXBwbHlJdGVtVG9BZ2dyZWdhdGVSZXN1bHQoXG4gICAgICAgIGluZGV4LCBhZ2dyZWdhdGVSZXN1bHQsIGl0ZW0sXG4gICAgICApO1xuICAgICAgcmV0dXJuIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcbiAgICB9LFxuICAgICAgICBhc3luYyAoKSA9PiBhZ2dyZWdhdGVSZXN1bHRcbiAgKTtcblxuICByZXR1cm4gYXdhaXQgZG9SZWFkKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXkpO1xufTtcblxuXG5jb25zdCBhcHBseUl0ZW1Ub0FnZ3JlZ2F0ZVJlc3VsdCA9IChpbmRleE5vZGUsIHJlc3VsdCwgaXRlbSkgPT4ge1xuICBjb25zdCBnZXRJbml0aWFsQWdncmVnYXRlUmVzdWx0ID0gKCkgPT4gKHtcbiAgICBzdW06IDAsIG1lYW46IG51bGwsIG1heDogbnVsbCwgbWluOiBudWxsLFxuICB9KTtcblxuICBjb25zdCBhcHBseUFnZ3JlZ2F0ZVJlc3VsdCA9IChhZ2csIGV4aXN0aW5nLCBjb3VudCkgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gY29tcGlsZUNvZGUoYWdnLmFnZ3JlZ2F0ZWRWYWx1ZSkoeyByZWNvcmQ6IGl0ZW0gfSk7XG5cbiAgICBpZiAoIWlzTnVtYmVyKHZhbHVlKSkgcmV0dXJuIGV4aXN0aW5nO1xuXG4gICAgZXhpc3Rpbmcuc3VtICs9IHZhbHVlO1xuICAgIGV4aXN0aW5nLm1heCA9IHZhbHVlID4gZXhpc3RpbmcubWF4IHx8IGV4aXN0aW5nLm1heCA9PT0gbnVsbFxuICAgICAgPyB2YWx1ZVxuICAgICAgOiBleGlzdGluZy5tYXg7XG4gICAgZXhpc3RpbmcubWluID0gdmFsdWUgPCBleGlzdGluZy5taW4gfHwgZXhpc3RpbmcubWluID09PSBudWxsXG4gICAgICA/IHZhbHVlXG4gICAgICA6IGV4aXN0aW5nLm1pbjtcbiAgICBleGlzdGluZy5tZWFuID0gZXhpc3Rpbmcuc3VtIC8gY291bnQ7XG4gICAgcmV0dXJuIGV4aXN0aW5nO1xuICB9O1xuXG4gIGZvciAoY29uc3QgYWdnR3JvdXAgb2YgaW5kZXhOb2RlLmFnZ3JlZ2F0ZUdyb3Vwcykge1xuICAgIGlmICghaGFzKGFnZ0dyb3VwLm5hbWUpKHJlc3VsdCkpIHtcbiAgICAgIHJlc3VsdFthZ2dHcm91cC5uYW1lXSA9IHt9O1xuICAgIH1cblxuICAgIGNvbnN0IHRoaXNHcm91cFJlc3VsdCA9IHJlc3VsdFthZ2dHcm91cC5uYW1lXTtcblxuICAgIGlmIChpc05vbkVtcHR5U3RyaW5nKGFnZ0dyb3VwLmNvbmRpdGlvbikpIHtcbiAgICAgIGlmICghY29tcGlsZUV4cHJlc3Npb24oYWdnR3JvdXAuY29uZGl0aW9uKSh7IHJlY29yZDogaXRlbSB9KSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgZ3JvdXAgPSBpc05vbkVtcHR5U3RyaW5nKGFnZ0dyb3VwLmdyb3VwQnkpXG4gICAgICA/IGNvbXBpbGVDb2RlKGFnZ0dyb3VwLmdyb3VwQnkpKHsgcmVjb3JkOiBpdGVtIH0pXG4gICAgICA6ICdhbGwnO1xuICAgIGlmICghaXNOb25FbXB0eVN0cmluZyhncm91cCkpIHtcbiAgICAgIGdyb3VwID0gJyhub25lKSc7XG4gICAgfVxuXG4gICAgaWYgKCFoYXMoZ3JvdXApKHRoaXNHcm91cFJlc3VsdCkpIHtcbiAgICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF0gPSB7IGNvdW50OiAwIH07XG4gICAgICBmb3IgKGNvbnN0IGFnZyBvZiBhZ2dHcm91cC5hZ2dyZWdhdGVzKSB7XG4gICAgICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF1bYWdnLm5hbWVdID0gZ2V0SW5pdGlhbEFnZ3JlZ2F0ZVJlc3VsdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF0uY291bnQrKztcblxuICAgIGZvciAoY29uc3QgYWdnIG9mIGFnZ0dyb3VwLmFnZ3JlZ2F0ZXMpIHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nVmFsdWVzID0gdGhpc0dyb3VwUmVzdWx0W2dyb3VwXVthZ2cubmFtZV07XG4gICAgICB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdW2FnZy5uYW1lXSA9IGFwcGx5QWdncmVnYXRlUmVzdWx0KFxuICAgICAgICBhZ2csIGV4aXN0aW5nVmFsdWVzLFxuICAgICAgICB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdLmNvdW50LFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBidWlsZEluZGV4IH0gZnJvbSAnLi9idWlsZEluZGV4JztcbmltcG9ydCB7IGxpc3RJdGVtcyB9IGZyb20gJy4vbGlzdEl0ZW1zJztcbmltcG9ydCB7IGFnZ3JlZ2F0ZXMgfSBmcm9tICcuL2FnZ3JlZ2F0ZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhBcGkgPSBhcHAgPT4gKHtcbiAgbGlzdEl0ZW1zOiBsaXN0SXRlbXMoYXBwKSxcbiAgYnVpbGRJbmRleDogYnVpbGRJbmRleChhcHApLFxuICBhZ2dyZWdhdGVzOiBhZ2dyZWdhdGVzKGFwcCksXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0SW5kZXhBcGk7XG4iLCJpbXBvcnQgeyBlYWNoLCBmaW5kIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IG1hcCwgbWF4LCBjb25zdGFudCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgam9pbktleSxcbiAgJCwgaXNOb3RoaW5nLCBpc1NvbWV0aGluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIGlzSW5kZXgsIGlzUm9vdCwgaXNTaW5nbGVSZWNvcmQsIGlzQ29sbGVjdGlvblJlY29yZCxcbiAgaXNSZWNvcmQsIGlzYWdncmVnYXRlR3JvdXAsXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbn0gZnJvbSAnLi9oaWVyYXJjaHknO1xuaW1wb3J0IHsgYWxsIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVOb2RlRXJyb3JzID0ge1xuICBpbmRleENhbm5vdEJlUGFyZW50OiAnSW5kZXggdGVtcGxhdGUgY2Fubm90IGJlIGEgcGFyZW50JyxcbiAgYWxsTm9uUm9vdE5vZGVzTXVzdEhhdmVQYXJlbnQ6ICdPbmx5IHRoZSByb290IG5vZGUgbWF5IGhhdmUgbm8gcGFyZW50JyxcbiAgaW5kZXhQYXJlbnRNdXN0QmVSZWNvcmRPclJvb3Q6ICdBbiBpbmRleCBtYXkgb25seSBoYXZlIGEgcmVjb3JkIG9yIHJvb3QgYXMgYSBwYXJlbnQnLFxuICBhZ2dyZWdhdGVQYXJlbnRNdXN0QmVBbkluZGV4OiAnYWdncmVnYXRlR3JvdXAgcGFyZW50IG11c3QgYmUgYW4gaW5kZXgnLFxufTtcblxuY29uc3QgcGF0aFJlZ3hNYWtlciA9IG5vZGUgPT4gKCkgPT4gbm9kZS5ub2RlS2V5KCkucmVwbGFjZSgve2lkfS9nLCAnW2EtekEtWjAtOV8tXSsnKTtcblxuY29uc3Qgbm9kZUtleU1ha2VyID0gbm9kZSA9PiAoKSA9PiBzd2l0Y2hDYXNlKFxuXG4gIFtuID0+IGlzUmVjb3JkKG4pICYmICFpc1NpbmdsZVJlY29yZChuKSxcbiAgICBuID0+IGpvaW5LZXkoXG4gICAgICBub2RlLnBhcmVudCgpLm5vZGVLZXkoKSxcbiAgICAgIG5vZGUuY29sbGVjdGlvbk5hbWUsXG4gICAgICBgJHtuLm5vZGVJZH0te2lkfWAsXG4gICAgKV0sXG5cbiAgW2lzUm9vdCxcbiAgICBjb25zdGFudCgnLycpXSxcblxuICBbZGVmYXVsdENhc2UsXG4gICAgbiA9PiBqb2luS2V5KG5vZGUucGFyZW50KCkubm9kZUtleSgpLCBuLm5hbWUpXSxcblxuKShub2RlKTtcblxuXG5jb25zdCB2YWxpZGF0ZSA9IHBhcmVudCA9PiAobm9kZSkgPT4ge1xuICBpZiAoaXNJbmRleChub2RlKVxuICAgICAgICAmJiBpc1NvbWV0aGluZyhwYXJlbnQpXG4gICAgICAgICYmICFpc1Jvb3QocGFyZW50KVxuICAgICAgICAmJiAhaXNSZWNvcmQocGFyZW50KSkge1xuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoY3JlYXRlTm9kZUVycm9ycy5pbmRleFBhcmVudE11c3RCZVJlY29yZE9yUm9vdCk7XG4gIH1cblxuICBpZiAoaXNhZ2dyZWdhdGVHcm91cChub2RlKVxuICAgICAgICAmJiBpc1NvbWV0aGluZyhwYXJlbnQpXG4gICAgICAgICYmICFpc0luZGV4KHBhcmVudCkpIHtcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGNyZWF0ZU5vZGVFcnJvcnMuYWdncmVnYXRlUGFyZW50TXVzdEJlQW5JbmRleCk7XG4gIH1cblxuICBpZiAoaXNOb3RoaW5nKHBhcmVudCkgJiYgIWlzUm9vdChub2RlKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGNyZWF0ZU5vZGVFcnJvcnMuYWxsTm9uUm9vdE5vZGVzTXVzdEhhdmVQYXJlbnQpOyB9XG5cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5jb25zdCBjb25zdHJ1Y3QgPSBwYXJlbnQgPT4gKG5vZGUpID0+IHtcbiAgbm9kZS5ub2RlS2V5ID0gbm9kZUtleU1ha2VyKG5vZGUpO1xuICBub2RlLnBhdGhSZWd4ID0gcGF0aFJlZ3hNYWtlcihub2RlKTtcbiAgbm9kZS5wYXJlbnQgPSBjb25zdGFudChwYXJlbnQpO1xuICBub2RlLmlzUm9vdCA9ICgpID0+IGlzTm90aGluZyhwYXJlbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBub2RlLm5hbWUgPT09ICdyb290J1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgbm9kZS50eXBlID09PSAncm9vdCc7XG4gIGlmIChpc0NvbGxlY3Rpb25SZWNvcmQobm9kZSkpIHtcbiAgICBub2RlLmNvbGxlY3Rpb25Ob2RlS2V5ID0gKCkgPT4gam9pbktleShcbiAgICAgIHBhcmVudC5ub2RlS2V5KCksIG5vZGUuY29sbGVjdGlvbk5hbWUsXG4gICAgKTtcbiAgICBub2RlLmNvbGxlY3Rpb25QYXRoUmVneCA9ICgpID0+IGpvaW5LZXkoXG4gICAgICBwYXJlbnQucGF0aFJlZ3goKSwgbm9kZS5jb2xsZWN0aW9uTmFtZSxcbiAgICApO1xuICB9XG4gIHJldHVybiBub2RlO1xufTtcblxuY29uc3QgYWRkVG9QYXJlbnQgPSAob2JqKSA9PiB7XG4gIGNvbnN0IHBhcmVudCA9IG9iai5wYXJlbnQoKTtcbiAgaWYgKGlzU29tZXRoaW5nKHBhcmVudCkpIHtcbiAgICBpZiAoaXNJbmRleChvYmopKVxuICAgIC8vIFE6IHdoeSBhcmUgaW5kZXhlcyBub3QgY2hpbGRyZW4gP1xuICAgIC8vIEE6IGJlY2F1c2UgdGhleSBjYW5ub3QgaGF2ZSBjaGlsZHJlbiBvZiB0aGVpciBvd24uXG4gICAgeyBcbiAgICAgIHBhcmVudC5pbmRleGVzLnB1c2gob2JqKTsgXG4gICAgfSBcbiAgICBlbHNlIGlmIChpc2FnZ3JlZ2F0ZUdyb3VwKG9iaikpIFxuICAgIHsgXG4gICAgICBwYXJlbnQuYWdncmVnYXRlR3JvdXBzLnB1c2gob2JqKTsgXG4gICAgfSBlbHNlIHsgXG4gICAgICBwYXJlbnQuY2hpbGRyZW4ucHVzaChvYmopOyBcbiAgICB9XG5cbiAgICBpZiAoaXNSZWNvcmQob2JqKSkge1xuICAgICAgY29uc3QgZGVmYXVsdEluZGV4ID0gZmluZChcbiAgICAgICAgcGFyZW50LmluZGV4ZXMsXG4gICAgICAgIGkgPT4gaS5uYW1lID09PSBgJHtwYXJlbnQubmFtZX1faW5kZXhgLFxuICAgICAgKTtcbiAgICAgIGlmIChkZWZhdWx0SW5kZXgpIHtcbiAgICAgICAgZGVmYXVsdEluZGV4LmFsbG93ZWRSZWNvcmROb2RlSWRzLnB1c2gob2JqLm5vZGVJZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmo7XG59O1xuXG5leHBvcnQgY29uc3QgY29uc3RydWN0Tm9kZSA9IChwYXJlbnQsIG9iaikgPT4gJChvYmosIFtcbiAgY29uc3RydWN0KHBhcmVudCksXG4gIHZhbGlkYXRlKHBhcmVudCksXG4gIGFkZFRvUGFyZW50LFxuXSk7XG5cbmNvbnN0IGdldE5vZGVJZCA9IChwYXJlbnROb2RlKSA9PiB7XG4gIC8vIHRoaXMgY2FzZSBpcyBoYW5kbGVkIGJldHRlciBlbHNld2hlcmVcbiAgaWYgKCFwYXJlbnROb2RlKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZmluZFJvb3QgPSBuID0+IChpc1Jvb3QobikgPyBuIDogZmluZFJvb3Qobi5wYXJlbnQoKSkpO1xuICBjb25zdCByb290ID0gZmluZFJvb3QocGFyZW50Tm9kZSk7XG5cbiAgcmV0dXJuICgkKHJvb3QsIFtcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gICAgbWFwKG4gPT4gbi5ub2RlSWQpLFxuICAgIG1heF0pICsgMSk7XG59O1xuXG5leHBvcnQgY29uc3QgY29uc3RydWN0SGllcmFyY2h5ID0gKG5vZGUsIHBhcmVudCkgPT4ge1xuICBjb25zdHJ1Y3QocGFyZW50KShub2RlKTtcbiAgaWYgKG5vZGUuaW5kZXhlcykge1xuICAgIGVhY2gobm9kZS5pbmRleGVzLFxuICAgICAgY2hpbGQgPT4gY29uc3RydWN0SGllcmFyY2h5KGNoaWxkLCBub2RlKSk7XG4gIH1cbiAgaWYgKG5vZGUuYWdncmVnYXRlR3JvdXBzKSB7XG4gICAgZWFjaChub2RlLmFnZ3JlZ2F0ZUdyb3VwcyxcbiAgICAgIGNoaWxkID0+IGNvbnN0cnVjdEhpZXJhcmNoeShjaGlsZCwgbm9kZSkpO1xuICB9XG4gIGlmIChub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgIGVhY2gobm9kZS5jaGlsZHJlbixcbiAgICAgIGNoaWxkID0+IGNvbnN0cnVjdEhpZXJhcmNoeShjaGlsZCwgbm9kZSkpO1xuICB9XG4gIGlmIChub2RlLmZpZWxkcykge1xuICAgIGVhY2gobm9kZS5maWVsZHMsXG4gICAgICBmID0+IGVhY2goZi50eXBlT3B0aW9ucywgKHZhbCwga2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IGRlZiA9IGFsbFtmLnR5cGVdLm9wdGlvbkRlZmluaXRpb25zW2tleV07XG4gICAgICAgIGlmICghZGVmKSB7XG4gICAgICAgICAgLy8gdW5rbm93biB0eXBlT3B0aW9uXG4gICAgICAgICAgZGVsZXRlIGYudHlwZU9wdGlvbnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmLnR5cGVPcHRpb25zW2tleV0gPSBkZWYucGFyc2UodmFsKTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICB9XG4gIHJldHVybiBub2RlO1xufTtcblxuXG5leHBvcnQgY29uc3QgZ2V0TmV3Um9vdExldmVsID0gKCkgPT4gY29uc3RydWN0KCkoe1xuICBuYW1lOiAncm9vdCcsXG4gIHR5cGU6ICdyb290JyxcbiAgY2hpbGRyZW46IFtdLFxuICBwYXRoTWFwczogW10sXG4gIGluZGV4ZXM6IFtdLFxuICBub2RlSWQ6IDAsXG59KTtcblxuY29uc3QgX2dldE5ld1JlY29yZFRlbXBsYXRlID0gKHBhcmVudCwgbmFtZSwgY3JlYXRlRGVmYXVsdEluZGV4LCBpc1NpbmdsZSkgPT4ge1xuICBjb25zdCBub2RlID0gY29uc3RydWN0Tm9kZShwYXJlbnQsIHtcbiAgICBuYW1lLFxuICAgIHR5cGU6ICdyZWNvcmQnLFxuICAgIGZpZWxkczogW10sXG4gICAgY2hpbGRyZW46IFtdLFxuICAgIHZhbGlkYXRpb25SdWxlczogW10sXG4gICAgbm9kZUlkOiBnZXROb2RlSWQocGFyZW50KSxcbiAgICBpbmRleGVzOiBbXSxcbiAgICBhbGxpZHNTaGFyZEZhY3RvcjogaXNSZWNvcmQocGFyZW50KSA/IDEgOiA2NCxcbiAgICBjb2xsZWN0aW9uTmFtZTogJycsXG4gICAgaXNTaW5nbGUsXG4gIH0pO1xuXG4gIGlmIChjcmVhdGVEZWZhdWx0SW5kZXgpIHtcbiAgICBjb25zdCBkZWZhdWx0SW5kZXggPSBnZXROZXdJbmRleFRlbXBsYXRlKHBhcmVudCk7XG4gICAgZGVmYXVsdEluZGV4Lm5hbWUgPSBgJHtuYW1lfV9pbmRleGA7XG4gICAgZGVmYXVsdEluZGV4LmFsbG93ZWRSZWNvcmROb2RlSWRzLnB1c2gobm9kZS5ub2RlSWQpO1xuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3UmVjb3JkVGVtcGxhdGUgPSAocGFyZW50LCBuYW1lID0gJycsIGNyZWF0ZURlZmF1bHRJbmRleCA9IHRydWUpID0+IF9nZXROZXdSZWNvcmRUZW1wbGF0ZShwYXJlbnQsIG5hbWUsIGNyZWF0ZURlZmF1bHRJbmRleCwgZmFsc2UpO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3U2luZ2xlUmVjb3JkVGVtcGxhdGUgPSBwYXJlbnQgPT4gX2dldE5ld1JlY29yZFRlbXBsYXRlKHBhcmVudCwgJycsIGZhbHNlLCB0cnVlKTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0luZGV4VGVtcGxhdGUgPSAocGFyZW50LCB0eXBlID0gJ2FuY2VzdG9yJykgPT4gY29uc3RydWN0Tm9kZShwYXJlbnQsIHtcbiAgbmFtZTogJycsXG4gIHR5cGU6ICdpbmRleCcsXG4gIG1hcDogJ3JldHVybiB7Li4ucmVjb3JkfTsnLFxuICBmaWx0ZXI6ICcnLFxuICBpbmRleFR5cGU6IHR5cGUsXG4gIGdldFNoYXJkTmFtZTogJycsXG4gIGdldFNvcnRLZXk6ICdyZWNvcmQuaWQnLFxuICBhZ2dyZWdhdGVHcm91cHM6IFtdLFxuICBhbGxvd2VkUmVjb3JkTm9kZUlkczogW10sXG4gIG5vZGVJZDogZ2V0Tm9kZUlkKHBhcmVudCksXG59KTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0FnZ3JlZ2F0ZUdyb3VwVGVtcGxhdGUgPSBpbmRleCA9PiBjb25zdHJ1Y3ROb2RlKGluZGV4LCB7XG4gIG5hbWU6ICcnLFxuICB0eXBlOiAnYWdncmVnYXRlR3JvdXAnLFxuICBncm91cEJ5OiAnJyxcbiAgYWdncmVnYXRlczogW10sXG4gIGNvbmRpdGlvbjogJycsXG4gIG5vZGVJZDogZ2V0Tm9kZUlkKGluZGV4KSxcbn0pO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3QWdncmVnYXRlVGVtcGxhdGUgPSAoc2V0KSA9PiB7XG4gIGNvbnN0IGFnZ3JlZ2F0ZWRWYWx1ZSA9IHtcbiAgICBuYW1lOiAnJyxcbiAgICBhZ2dyZWdhdGVkVmFsdWU6ICcnLFxuICB9O1xuICBzZXQuYWdncmVnYXRlcy5wdXNoKGFnZ3JlZ2F0ZWRWYWx1ZSk7XG4gIHJldHVybiBhZ2dyZWdhdGVkVmFsdWU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdldE5ld1Jvb3RMZXZlbCxcbiAgZ2V0TmV3UmVjb3JkVGVtcGxhdGUsXG4gIGdldE5ld0luZGV4VGVtcGxhdGUsXG4gIGNyZWF0ZU5vZGVFcnJvcnMsXG4gIGNvbnN0cnVjdEhpZXJhcmNoeSxcbiAgZ2V0TmV3QWdncmVnYXRlR3JvdXBUZW1wbGF0ZSxcbiAgZ2V0TmV3QWdncmVnYXRlVGVtcGxhdGUsXG59O1xuIiwiaW1wb3J0IHtcbiAgc29tZSwgbWFwLCBmaWx0ZXIsIGtleXMsIGluY2x1ZGVzLFxuICBjb3VudEJ5LCBmbGF0dGVuLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgaXNTb21ldGhpbmcsICQsXG4gIGlzTm9uRW1wdHlTdHJpbmcsXG4gIGlzTm90aGluZ09yRW1wdHksXG4gIGlzTm90aGluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGFsbCwgZ2V0RGVmYXVsdE9wdGlvbnMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBmaWVsZEVycm9ycyA9IHtcbiAgQWRkRmllbGRWYWxpZGF0aW9uRmFpbGVkOiAnQWRkIGZpZWxkIHZhbGlkYXRpb246ICcsXG59O1xuXG5leHBvcnQgY29uc3QgYWxsb3dlZFR5cGVzID0gKCkgPT4ga2V5cyhhbGwpO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3RmllbGQgPSB0eXBlID0+ICh7XG4gIG5hbWU6ICcnLCAvLyBob3cgZmllbGQgaXMgcmVmZXJlbmNlZCBpbnRlcm5hbGx5XG4gIHR5cGUsXG4gIHR5cGVPcHRpb25zOiBnZXREZWZhdWx0T3B0aW9ucyh0eXBlKSxcbiAgbGFiZWw6ICcnLCAvLyBob3cgZmllbGQgaXMgZGlzcGxheWVkXG4gIGdldEluaXRpYWxWYWx1ZTogJ2RlZmF1bHQnLCAvLyBmdW5jdGlvbiB0aGF0IGdldHMgdmFsdWUgd2hlbiBpbml0aWFsbHkgY3JlYXRlZFxuICBnZXRVbmRlZmluZWRWYWx1ZTogJ2RlZmF1bHQnLCAvLyBmdW5jdGlvbiB0aGF0IGdldHMgdmFsdWUgd2hlbiBmaWVsZCB1bmRlZmluZWQgb24gcmVjb3JkXG59KTtcblxuY29uc3QgZmllbGRSdWxlcyA9IGFsbEZpZWxkcyA9PiBbXG4gIG1ha2VydWxlKCduYW1lJywgJ2ZpZWxkIG5hbWUgaXMgbm90IHNldCcsXG4gICAgZiA9PiBpc05vbkVtcHR5U3RyaW5nKGYubmFtZSkpLFxuICBtYWtlcnVsZSgndHlwZScsICdmaWVsZCB0eXBlIGlzIG5vdCBzZXQnLFxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLnR5cGUpKSxcbiAgbWFrZXJ1bGUoJ2xhYmVsJywgJ2ZpZWxkIGxhYmVsIGlzIG5vdCBzZXQnLFxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLmxhYmVsKSksXG4gIG1ha2VydWxlKCdnZXRJbml0aWFsVmFsdWUnLCAnZ2V0SW5pdGlhbFZhbHVlIGZ1bmN0aW9uIGlzIG5vdCBzZXQnLFxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLmdldEluaXRpYWxWYWx1ZSkpLFxuICBtYWtlcnVsZSgnZ2V0VW5kZWZpbmVkVmFsdWUnLCAnZ2V0VW5kZWZpbmVkVmFsdWUgZnVuY3Rpb24gaXMgbm90IHNldCcsXG4gICAgZiA9PiBpc05vbkVtcHR5U3RyaW5nKGYuZ2V0VW5kZWZpbmVkVmFsdWUpKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnZmllbGQgbmFtZSBpcyBkdXBsaWNhdGVkJyxcbiAgICBmID0+IGlzTm90aGluZ09yRW1wdHkoZi5uYW1lKVxuICAgICAgICAgICAgIHx8IGNvdW50QnkoJ25hbWUnKShhbGxGaWVsZHMpW2YubmFtZV0gPT09IDEpLFxuICBtYWtlcnVsZSgndHlwZScsICd0eXBlIGlzIHVua25vd24nLFxuICAgIGYgPT4gaXNOb3RoaW5nT3JFbXB0eShmLnR5cGUpXG4gICAgICAgICAgICAgfHwgc29tZSh0ID0+IGYudHlwZSA9PT0gdCkoYWxsb3dlZFR5cGVzKCkpKSxcbl07XG5cbmNvbnN0IHR5cGVPcHRpb25zUnVsZXMgPSAoZmllbGQpID0+IHtcbiAgY29uc3QgdHlwZSA9IGFsbFtmaWVsZC50eXBlXTtcbiAgaWYgKGlzTm90aGluZyh0eXBlKSkgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IGRlZiA9IG9wdE5hbWUgPT4gdHlwZS5vcHRpb25EZWZpbml0aW9uc1tvcHROYW1lXTtcblxuICByZXR1cm4gJChmaWVsZC50eXBlT3B0aW9ucywgW1xuICAgIGtleXMsXG4gICAgZmlsdGVyKG8gPT4gaXNTb21ldGhpbmcoZGVmKG8pKVxuICAgICAgICAgICAgICAgICAgICAmJiBpc1NvbWV0aGluZyhkZWYobykuaXNWYWxpZCkpLFxuICAgIG1hcChvID0+IG1ha2VydWxlKFxuICAgICAgYHR5cGVPcHRpb25zLiR7b31gLFxuICAgICAgYCR7ZGVmKG8pLnJlcXVpcmVtZW50RGVzY3JpcHRpb259YCxcbiAgICAgIGZpZWxkID0+IGRlZihvKS5pc1ZhbGlkKGZpZWxkLnR5cGVPcHRpb25zW29dKSxcbiAgICApKSxcbiAgXSk7XG59O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVGaWVsZCA9IGFsbEZpZWxkcyA9PiAoZmllbGQpID0+IHtcbiAgY29uc3QgZXZlcnlTaW5nbGVGaWVsZCA9IGluY2x1ZGVzKGZpZWxkKShhbGxGaWVsZHMpID8gYWxsRmllbGRzIDogWy4uLmFsbEZpZWxkcywgZmllbGRdO1xuICByZXR1cm4gYXBwbHlSdWxlU2V0KFsuLi5maWVsZFJ1bGVzKGV2ZXJ5U2luZ2xlRmllbGQpLCAuLi50eXBlT3B0aW9uc1J1bGVzKGZpZWxkKV0pKGZpZWxkKTtcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFsbEZpZWxkcyA9IHJlY29yZE5vZGUgPT4gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICBtYXAodmFsaWRhdGVGaWVsZChyZWNvcmROb2RlLmZpZWxkcykpLFxuICBmbGF0dGVuLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBhZGRGaWVsZCA9IChyZWNvcmRUZW1wbGF0ZSwgZmllbGQpID0+IHtcbiAgaWYgKGlzTm90aGluZ09yRW1wdHkoZmllbGQubGFiZWwpKSB7XG4gICAgZmllbGQubGFiZWwgPSBmaWVsZC5uYW1lO1xuICB9XG4gIGNvbnN0IHZhbGlkYXRpb25NZXNzYWdlcyA9IHZhbGlkYXRlRmllbGQoWy4uLnJlY29yZFRlbXBsYXRlLmZpZWxkcywgZmllbGRdKShmaWVsZCk7XG4gIGlmICh2YWxpZGF0aW9uTWVzc2FnZXMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGVycm9ycyA9IG1hcChtID0+IG0uZXJyb3IpKHZhbGlkYXRpb25NZXNzYWdlcyk7XG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgJHtmaWVsZEVycm9ycy5BZGRGaWVsZFZhbGlkYXRpb25GYWlsZWR9ICR7ZXJyb3JzLmpvaW4oJywgJyl9YCk7XG4gIH1cbiAgcmVjb3JkVGVtcGxhdGUuZmllbGRzLnB1c2goZmllbGQpO1xufTtcbiIsImltcG9ydCB7IGlzTnVtYmVyLCBpc0Jvb2xlYW4sIGRlZmF1bHRDYXNlIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHN3aXRjaENhc2UgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUgPSAoaW52YWxpZEZpZWxkcyxcbiAgbWVzc2FnZVdoZW5JbnZhbGlkLFxuICBleHByZXNzaW9uV2hlblZhbGlkKSA9PiAoe1xuICBpbnZhbGlkRmllbGRzLCBtZXNzYWdlV2hlbkludmFsaWQsIGV4cHJlc3Npb25XaGVuVmFsaWQsXG59KTtcblxuY29uc3QgZ2V0U3RhdGljVmFsdWUgPSBzd2l0Y2hDYXNlKFxuICBbaXNOdW1iZXIsIHYgPT4gdi50b1N0cmluZygpXSxcbiAgW2lzQm9vbGVhbiwgdiA9PiB2LnRvU3RyaW5nKCldLFxuICBbZGVmYXVsdENhc2UsIHYgPT4gYCcke3Z9J2BdLFxuKTtcblxuZXhwb3J0IGNvbnN0IGNvbW1vblJlY29yZFZhbGlkYXRpb25SdWxlcyA9ICh7XG5cbiAgZmllbGROb3RFbXB0eTogZmllbGROYW1lID0+IGdldE5ld1JlY29yZFZhbGlkYXRpb25SdWxlKFxuICAgIFtmaWVsZE5hbWVdLFxuICAgIGAke2ZpZWxkTmFtZX0gaXMgZW1wdHlgLFxuICAgIGAhXy5pc0VtcHR5KHJlY29yZFsnJHtmaWVsZE5hbWV9J10pYCxcbiAgKSxcblxuICBmaWVsZEJldHdlZW46IChmaWVsZE5hbWUsIG1pbiwgbWF4KSA9PiBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZShcbiAgICBbZmllbGROYW1lXSxcbiAgICBgJHtmaWVsZE5hbWV9IG11c3QgYmUgYmV0d2VlbiAke21pbi50b1N0cmluZygpfSBhbmQgJHttYXgudG9TdHJpbmcoKX1gLFxuICAgIGByZWNvcmRbJyR7ZmllbGROYW1lfSddID49ICR7Z2V0U3RhdGljVmFsdWUobWluKX0gJiYgIHJlY29yZFsnJHtmaWVsZE5hbWV9J10gPD0gJHtnZXRTdGF0aWNWYWx1ZShtYXgpfSBgLFxuICApLFxuXG4gIGZpZWxkR3JlYXRlclRoYW46IChmaWVsZE5hbWUsIG1pbiwgbWF4KSA9PiBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZShcbiAgICBbZmllbGROYW1lXSxcbiAgICBgJHtmaWVsZE5hbWV9IG11c3QgYmUgZ3JlYXRlciB0aGFuICR7bWluLnRvU3RyaW5nKCl9IGFuZCAke21heC50b1N0cmluZygpfWAsXG4gICAgYHJlY29yZFsnJHtmaWVsZE5hbWV9J10gPj0gJHtnZXRTdGF0aWNWYWx1ZShtaW4pfSAgYCxcbiAgKSxcbn0pO1xuXG5leHBvcnQgY29uc3QgYWRkUmVjb3JkVmFsaWRhdGlvblJ1bGUgPSByZWNvcmROb2RlID0+IHJ1bGUgPT4gcmVjb3JkTm9kZS52YWxpZGF0aW9uUnVsZXMucHVzaChydWxlKTtcbiIsIlxuZXhwb3J0IGNvbnN0IGNyZWF0ZVRyaWdnZXIgPSAoKSA9PiAoe1xuICBhY3Rpb25OYW1lOiAnJyxcbiAgZXZlbnROYW1lOiAnJyxcbiAgLy8gZnVuY3Rpb24sIGhhcyBhY2Nlc3MgdG8gZXZlbnQgY29udGV4dCxcbiAgLy8gcmV0dXJucyBvYmplY3QgdGhhdCBpcyB1c2VkIGFzIHBhcmFtZXRlciB0byBhY3Rpb25cbiAgLy8gb25seSB1c2VkIGlmIHRyaWdnZXJlZCBieSBldmVudFxuICBvcHRpb25zQ3JlYXRvcjogJycsXG4gIC8vIGFjdGlvbiBydW5zIGlmIHRydWUsXG4gIC8vIGhhcyBhY2Nlc3MgdG8gZXZlbnQgY29udGV4dFxuICBjb25kaXRpb246ICcnLFxufSk7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVBY3Rpb24gPSAoKSA9PiAoe1xuICBuYW1lOiAnJyxcbiAgYmVoYXZpb3VyU291cmNlOiAnJyxcbiAgLy8gbmFtZSBvZiBmdW5jdGlvbiBpbiBhY3Rpb25Tb3VyY2VcbiAgYmVoYXZpb3VyTmFtZTogJycsXG4gIC8vIHBhcmFtZXRlciBwYXNzZWQgaW50byBiZWhhdmlvdXIuXG4gIC8vIGFueSBvdGhlciBwYXJtcyBwYXNzZWQgYXQgcnVudGltZSBlLmcuXG4gIC8vIGJ5IHRyaWdnZXIsIG9yIG1hbnVhbGx5LCB3aWxsIGJlIG1lcmdlZCBpbnRvIHRoaXNcbiAgaW5pdGlhbE9wdGlvbnM6IHt9LFxufSk7XG4iLCJpbXBvcnQgeyBmbGF0dGVuLCBtYXAsIGlzRW1wdHkgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgY29tcGlsZUNvZGUgfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XG5pbXBvcnQge1xuICBpc05vbkVtcHR5U3RyaW5nLCBcbiAgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uLCAkLCBcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGFwcGx5UnVsZVNldCwgbWFrZXJ1bGUgfSBmcm9tICcuLi9jb21tb24vdmFsaWRhdGlvbkNvbW1vbic7XG5cbmNvbnN0IGFnZ3JlZ2F0ZVJ1bGVzID0gW1xuICBtYWtlcnVsZSgnbmFtZScsICdjaG9vc2UgYSBuYW1lIGZvciB0aGUgYWdncmVnYXRlJyxcbiAgICBhID0+IGlzTm9uRW1wdHlTdHJpbmcoYS5uYW1lKSksXG4gIG1ha2VydWxlKCdhZ2dyZWdhdGVkVmFsdWUnLCAnYWdncmVnYXRlZFZhbHVlIGRvZXMgbm90IGNvbXBpbGUnLFxuICAgIGEgPT4gaXNFbXB0eShhLmFnZ3JlZ2F0ZWRWYWx1ZSlcbiAgICAgICAgICAgIHx8IGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbihcbiAgICAgICAgICAgICAgKCkgPT4gY29tcGlsZUNvZGUoYS5hZ2dyZWdhdGVkVmFsdWUpLFxuICAgICAgICAgICAgKSksXG5dO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBZ2dyZWdhdGUgPSBhZ2dyZWdhdGUgPT4gYXBwbHlSdWxlU2V0KGFnZ3JlZ2F0ZVJ1bGVzKShhZ2dyZWdhdGUpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBbGxBZ2dyZWdhdGVzID0gYWxsID0+ICQoYWxsLCBbXG4gIG1hcCh2YWxpZGF0ZUFnZ3JlZ2F0ZSksXG4gIGZsYXR0ZW4sXG5dKTtcbiIsImltcG9ydCB7XG4gIGZpbHRlciwgdW5pb24sIGNvbnN0YW50LFxuICBtYXAsIGZsYXR0ZW4sIGV2ZXJ5LCB1bmlxQnksXG4gIHNvbWUsIGluY2x1ZGVzLCBpc0VtcHR5LCBoYXNcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCB7XG4gICQsIGlzU29tZXRoaW5nLCBzd2l0Y2hDYXNlLFxuICBhbnlUcnVlLCBpc05vbkVtcHR5QXJyYXksIGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbixcbiAgaXNOb25FbXB0eVN0cmluZywgZGVmYXVsdENhc2UsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBpc1JlY29yZCwgaXNSb290LCBpc2FnZ3JlZ2F0ZUdyb3VwLFxuICBpc0luZGV4LCBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG59IGZyb20gJy4vaGllcmFyY2h5JztcbmltcG9ydCB7IGV2ZW50c0xpc3QgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcbmltcG9ydCB7IHZhbGlkYXRlQWxsRmllbGRzIH0gZnJvbSAnLi9maWVsZHMnO1xuaW1wb3J0IHtcbiAgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSwgc3RyaW5nTm90RW1wdHksXG4gIHZhbGlkYXRpb25FcnJvcixcbn0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHsgaW5kZXhSdWxlU2V0IH0gZnJvbSAnLi9pbmRleGVzJztcbmltcG9ydCB7IHZhbGlkYXRlQWxsQWdncmVnYXRlcyB9IGZyb20gJy4vdmFsaWRhdGVBZ2dyZWdhdGUnO1xuXG5leHBvcnQgY29uc3QgcnVsZVNldCA9ICguLi5zZXRzKSA9PiBjb25zdGFudChmbGF0dGVuKFsuLi5zZXRzXSkpO1xuXG5jb25zdCBjb21tb25SdWxlcyA9IFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnbm9kZSBuYW1lIGlzIG5vdCBzZXQnLFxuICAgIG5vZGUgPT4gc3RyaW5nTm90RW1wdHkobm9kZS5uYW1lKSksXG4gIG1ha2VydWxlKCd0eXBlJywgJ25vZGUgdHlwZSBub3QgcmVjb2duaXNlZCcsXG4gICAgYW55VHJ1ZShpc1JlY29yZCwgaXNSb290LCBpc0luZGV4LCBpc2FnZ3JlZ2F0ZUdyb3VwKSksXG5dO1xuXG5jb25zdCByZWNvcmRSdWxlcyA9IFtcbiAgbWFrZXJ1bGUoJ2ZpZWxkcycsICdubyBmaWVsZHMgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSByZWNvcmQnLFxuICAgIG5vZGUgPT4gaXNOb25FbXB0eUFycmF5KG5vZGUuZmllbGRzKSksXG4gIG1ha2VydWxlKCd2YWxpZGF0aW9uUnVsZXMnLCBcInZhbGlkYXRpb24gcnVsZSBpcyBtaXNzaW5nIGEgJ21lc3NhZ2VXaGVuVmFsaWQnIG1lbWJlclwiLFxuICAgIG5vZGUgPT4gZXZlcnkociA9PiBoYXMoJ21lc3NhZ2VXaGVuSW52YWxpZCcpKHIpKShub2RlLnZhbGlkYXRpb25SdWxlcykpLFxuICBtYWtlcnVsZSgndmFsaWRhdGlvblJ1bGVzJywgXCJ2YWxpZGF0aW9uIHJ1bGUgaXMgbWlzc2luZyBhICdleHByZXNzaW9uV2hlblZhbGlkJyBtZW1iZXJcIixcbiAgICBub2RlID0+IGV2ZXJ5KHIgPT4gaGFzKCdleHByZXNzaW9uV2hlblZhbGlkJykocikpKG5vZGUudmFsaWRhdGlvblJ1bGVzKSksXG5dO1xuXG5cbmNvbnN0IGFnZ3JlZ2F0ZUdyb3VwUnVsZXMgPSBbXG4gIG1ha2VydWxlKCdjb25kaXRpb24nLCAnY29uZGl0aW9uIGRvZXMgbm90IGNvbXBpbGUnLFxuICAgIGEgPT4gaXNFbXB0eShhLmNvbmRpdGlvbilcbiAgICAgICAgICAgICB8fCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24oXG4gICAgICAgICAgICAgICAoKSA9PiBjb21waWxlRXhwcmVzc2lvbihhLmNvbmRpdGlvbiksXG4gICAgICAgICAgICAgKSksXG5dO1xuXG5jb25zdCBnZXRSdWxlU2V0ID0gbm9kZSA9PiBzd2l0Y2hDYXNlKFxuXG4gIFtpc1JlY29yZCwgcnVsZVNldChcbiAgICBjb21tb25SdWxlcyxcbiAgICByZWNvcmRSdWxlcyxcbiAgKV0sXG5cbiAgW2lzSW5kZXgsIHJ1bGVTZXQoXG4gICAgY29tbW9uUnVsZXMsXG4gICAgaW5kZXhSdWxlU2V0LFxuICApXSxcblxuICBbaXNhZ2dyZWdhdGVHcm91cCwgcnVsZVNldChcbiAgICBjb21tb25SdWxlcyxcbiAgICBhZ2dyZWdhdGVHcm91cFJ1bGVzLFxuICApXSxcblxuICBbZGVmYXVsdENhc2UsIHJ1bGVTZXQoY29tbW9uUnVsZXMsIFtdKV0sXG4pKG5vZGUpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVOb2RlID0gbm9kZSA9PiBhcHBseVJ1bGVTZXQoZ2V0UnVsZVNldChub2RlKSkobm9kZSk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFsbCA9IChhcHBIaWVyYXJjaHkpID0+IHtcbiAgY29uc3QgZmxhdHRlbmVkID0gZ2V0RmxhdHRlbmVkSGllcmFyY2h5KFxuICAgIGFwcEhpZXJhcmNoeSxcbiAgKTtcblxuICBjb25zdCBkdXBsaWNhdGVOYW1lUnVsZSA9IG1ha2VydWxlKFxuICAgICduYW1lJywgJ25vZGUgbmFtZXMgbXVzdCBiZSB1bmlxdWUgdW5kZXIgc2hhcmVkIHBhcmVudCcsXG4gICAgbiA9PiBmaWx0ZXIoZiA9PiBmLnBhcmVudCgpID09PSBuLnBhcmVudCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICYmIGYubmFtZSA9PT0gbi5uYW1lKShmbGF0dGVuZWQpLmxlbmd0aCA9PT0gMSxcbiAgKTtcblxuICBjb25zdCBkdXBsaWNhdGVOb2RlS2V5RXJyb3JzID0gJChmbGF0dGVuZWQsIFtcbiAgICBtYXAobiA9PiBhcHBseVJ1bGVTZXQoW2R1cGxpY2F0ZU5hbWVSdWxlXSkobikpLFxuICAgIGZpbHRlcihpc1NvbWV0aGluZyksXG4gICAgZmxhdHRlbixcbiAgXSk7XG5cbiAgY29uc3QgZmllbGRFcnJvcnMgPSAkKGZsYXR0ZW5lZCwgW1xuICAgIGZpbHRlcihpc1JlY29yZCksXG4gICAgbWFwKHZhbGlkYXRlQWxsRmllbGRzKSxcbiAgICBmbGF0dGVuLFxuICBdKTtcblxuICBjb25zdCBhZ2dyZWdhdGVFcnJvcnMgPSAkKGZsYXR0ZW5lZCwgW1xuICAgIGZpbHRlcihpc2FnZ3JlZ2F0ZUdyb3VwKSxcbiAgICBtYXAocyA9PiB2YWxpZGF0ZUFsbEFnZ3JlZ2F0ZXMoXG4gICAgICBzLmFnZ3JlZ2F0ZXMsXG4gICAgKSksXG4gICAgZmxhdHRlbixcbiAgXSk7XG5cbiAgcmV0dXJuICQoZmxhdHRlbmVkLCBbXG4gICAgbWFwKHZhbGlkYXRlTm9kZSksXG4gICAgZmxhdHRlbixcbiAgICB1bmlvbihkdXBsaWNhdGVOb2RlS2V5RXJyb3JzKSxcbiAgICB1bmlvbihmaWVsZEVycm9ycyksXG4gICAgdW5pb24oYWdncmVnYXRlRXJyb3JzKSxcbiAgXSk7XG59O1xuXG5jb25zdCBhY3Rpb25SdWxlcyA9IFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnYWN0aW9uIG11c3QgaGF2ZSBhIG5hbWUnLFxuICAgIGEgPT4gaXNOb25FbXB0eVN0cmluZyhhLm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2JlaGF2aW91ck5hbWUnLCAnbXVzdCBzdXBwbHkgYSBiZWhhdmlvdXIgbmFtZSB0byB0aGUgYWN0aW9uJyxcbiAgICBhID0+IGlzTm9uRW1wdHlTdHJpbmcoYS5iZWhhdmlvdXJOYW1lKSksXG4gIG1ha2VydWxlKCdiZWhhdmlvdXJTb3VyY2UnLCAnbXVzdCBzdXBwbHkgYSBiZWhhdmlvdXIgc291cmNlIGZvciB0aGUgYWN0aW9uJyxcbiAgICBhID0+IGlzTm9uRW1wdHlTdHJpbmcoYS5iZWhhdmlvdXJTb3VyY2UpKSxcbl07XG5cbmNvbnN0IGR1cGxpY2F0ZUFjdGlvblJ1bGUgPSBtYWtlcnVsZSgnJywgJ2FjdGlvbiBuYW1lIG11c3QgYmUgdW5pcXVlJywgKCkgPT4ge30pO1xuXG5jb25zdCB2YWxpZGF0ZUFjdGlvbiA9IGFjdGlvbiA9PiBhcHBseVJ1bGVTZXQoYWN0aW9uUnVsZXMpKGFjdGlvbik7XG5cblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWN0aW9ucyA9IChhbGxBY3Rpb25zKSA9PiB7XG4gIGNvbnN0IGR1cGxpY2F0ZUFjdGlvbnMgPSAkKGFsbEFjdGlvbnMsIFtcbiAgICBmaWx0ZXIoYSA9PiBmaWx0ZXIoYTIgPT4gYTIubmFtZSA9PT0gYS5uYW1lKShhbGxBY3Rpb25zKS5sZW5ndGggPiAxKSxcbiAgICBtYXAoYSA9PiB2YWxpZGF0aW9uRXJyb3IoZHVwbGljYXRlQWN0aW9uUnVsZSwgYSkpLFxuICBdKTtcblxuICBjb25zdCBlcnJvcnMgPSAkKGFsbEFjdGlvbnMsIFtcbiAgICBtYXAodmFsaWRhdGVBY3Rpb24pLFxuICAgIGZsYXR0ZW4sXG4gICAgdW5pb24oZHVwbGljYXRlQWN0aW9ucyksXG4gICAgdW5pcUJ5KCduYW1lJyksXG4gIF0pO1xuXG4gIHJldHVybiBlcnJvcnM7XG59O1xuXG5jb25zdCB0cmlnZ2VyUnVsZXMgPSBhY3Rpb25zID0+IChbXG4gIG1ha2VydWxlKCdhY3Rpb25OYW1lJywgJ211c3Qgc3BlY2lmeSBhbiBhY3Rpb24nLFxuICAgIHQgPT4gaXNOb25FbXB0eVN0cmluZyh0LmFjdGlvbk5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2V2ZW50TmFtZScsICdtdXN0IHNwZWNpZnkgYW5kIGV2ZW50JyxcbiAgICB0ID0+IGlzTm9uRW1wdHlTdHJpbmcodC5ldmVudE5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2FjdGlvbk5hbWUnLCAnc3BlY2lmaWVkIGFjdGlvbiBub3Qgc3VwcGxpZWQnLFxuICAgIHQgPT4gIXQuYWN0aW9uTmFtZVxuICAgICAgICAgICAgIHx8IHNvbWUoYSA9PiBhLm5hbWUgPT09IHQuYWN0aW9uTmFtZSkoYWN0aW9ucykpLFxuICBtYWtlcnVsZSgnZXZlbnROYW1lJywgJ2ludmFsaWQgRXZlbnQgTmFtZScsXG4gICAgdCA9PiAhdC5ldmVudE5hbWVcbiAgICAgICAgICAgICB8fCBpbmNsdWRlcyh0LmV2ZW50TmFtZSkoZXZlbnRzTGlzdCkpLFxuICBtYWtlcnVsZSgnb3B0aW9uc0NyZWF0b3InLCAnT3B0aW9ucyBDcmVhdG9yIGRvZXMgbm90IGNvbXBpbGUgLSBjaGVjayB5b3VyIGV4cHJlc3Npb24nLFxuICAgICh0KSA9PiB7XG4gICAgICBpZiAoIXQub3B0aW9uc0NyZWF0b3IpIHJldHVybiB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29tcGlsZUNvZGUodC5vcHRpb25zQ3JlYXRvcik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoXykgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9KSxcbiAgbWFrZXJ1bGUoJ2NvbmRpdGlvbicsICdUcmlnZ2VyIGNvbmRpdGlvbiBkb2VzIG5vdCBjb21waWxlIC0gY2hlY2sgeW91ciBleHByZXNzaW9uJyxcbiAgICAodCkgPT4ge1xuICAgICAgaWYgKCF0LmNvbmRpdGlvbikgcmV0dXJuIHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICBjb21waWxlRXhwcmVzc2lvbih0LmNvbmRpdGlvbik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoXykgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9KSxcbl0pO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVUcmlnZ2VyID0gKHRyaWdnZXIsIGFsbEFjdGlvbnMpID0+IHtcbiAgY29uc3QgZXJyb3JzID0gYXBwbHlSdWxlU2V0KHRyaWdnZXJSdWxlcyhhbGxBY3Rpb25zKSkodHJpZ2dlcik7XG5cbiAgcmV0dXJuIGVycm9ycztcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVRyaWdnZXJzID0gKHRyaWdnZXJzLCBhbGxBY3Rpb25zKSA9PiAkKHRyaWdnZXJzLCBbXG4gIG1hcCh0ID0+IHZhbGlkYXRlVHJpZ2dlcih0LCBhbGxBY3Rpb25zKSksXG4gIGZsYXR0ZW4sXG5dKTtcbiIsImltcG9ydCB7IGFwcERlZmluaXRpb25GaWxlIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGNvbnN0cnVjdEhpZXJhcmNoeSB9IGZyb20gJy4vY3JlYXRlTm9kZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uID0gZGF0YXN0b3JlID0+IGFzeW5jICgpID0+IHtcbiAgY29uc3QgZXhpc3RzID0gYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhhcHBEZWZpbml0aW9uRmlsZSk7XG5cbiAgaWYgKCFleGlzdHMpIHRocm93IG5ldyBFcnJvcignQXBwbGljYXRpb24gZGVmaW5pdGlvbiBkb2VzIG5vdCBleGlzdCcpO1xuXG4gIGNvbnN0IGFwcERlZmluaXRpb24gPSBhd2FpdCBkYXRhc3RvcmUubG9hZEpzb24oYXBwRGVmaW5pdGlvbkZpbGUpO1xuICBhcHBEZWZpbml0aW9uLmhpZXJhcmNoeSA9IGNvbnN0cnVjdEhpZXJhcmNoeShcbiAgICBhcHBEZWZpbml0aW9uLmhpZXJhcmNoeSxcbiAgKTtcbiAgcmV0dXJuIGFwcERlZmluaXRpb247XG59O1xuIiwiaW1wb3J0IHsgam9pbiB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBhcHBEZWZpbml0aW9uRmlsZSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyB2YWxpZGF0ZUFsbCB9IGZyb20gJy4vdmFsaWRhdGUnO1xuaW1wb3J0IHsgYXBpV3JhcHBlciB9IGZyb20gJy4uL2NvbW1vbi9hcGlXcmFwcGVyJztcbmltcG9ydCB7IGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xuXG5leHBvcnQgY29uc3Qgc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5ID0gYXBwID0+IGFzeW5jIGhpZXJhcmNoeSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy50ZW1wbGF0ZUFwaS5zYXZlQXBwbGljYXRpb25IaWVyYXJjaHksXG4gIHBlcm1pc3Npb24ud3JpdGVUZW1wbGF0ZXMuaXNBdXRob3JpemVkLFxuICB7IGhpZXJhcmNoeSB9LFxuICBfc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlLCBoaWVyYXJjaHksXG4pO1xuXG5cbmV4cG9ydCBjb25zdCBfc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5ID0gYXN5bmMgKGRhdGFzdG9yZSwgaGllcmFyY2h5KSA9PiB7XG4gIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSBhd2FpdCB2YWxpZGF0ZUFsbChoaWVyYXJjaHkpO1xuICBpZiAodmFsaWRhdGlvbkVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBIaWVyYXJjaHkgaXMgaW52YWxpZDogJHtqb2luKFxuICAgICAgdmFsaWRhdGlvbkVycm9ycy5tYXAoZSA9PiBgJHtlLml0ZW0ubm9kZUtleSA/IGUuaXRlbS5ub2RlS2V5KCkgOiAnJ30gOiAke2UuZXJyb3J9YCksXG4gICAgICAnLCcsXG4gICAgKX1gKTtcbiAgfVxuXG4gIGlmIChhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGFwcERlZmluaXRpb25GaWxlKSkge1xuICAgIGNvbnN0IGFwcERlZmluaXRpb24gPSBhd2FpdCBkYXRhc3RvcmUubG9hZEpzb24oYXBwRGVmaW5pdGlvbkZpbGUpO1xuICAgIGFwcERlZmluaXRpb24uaGllcmFyY2h5ID0gaGllcmFyY2h5O1xuICAgIGF3YWl0IGRhdGFzdG9yZS51cGRhdGVKc29uKGFwcERlZmluaXRpb25GaWxlLCBhcHBEZWZpbml0aW9uKTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKCcvLmNvbmZpZycpO1xuICAgIGNvbnN0IGFwcERlZmluaXRpb24gPSB7IGFjdGlvbnM6IFtdLCB0cmlnZ2VyczogW10sIGhpZXJhcmNoeSB9O1xuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKGFwcERlZmluaXRpb25GaWxlLCBhcHBEZWZpbml0aW9uKTtcbiAgfVxufTtcbiIsImltcG9ydCB7IGpvaW4gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGFwcERlZmluaXRpb25GaWxlIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHZhbGlkYXRlVHJpZ2dlcnMsIHZhbGlkYXRlQWN0aW9ucyB9IGZyb20gJy4vdmFsaWRhdGUnO1xuaW1wb3J0IHsgYXBpV3JhcHBlciB9IGZyb20gJy4uL2NvbW1vbi9hcGlXcmFwcGVyJztcbmltcG9ydCB7IGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBzYXZlQWN0aW9uc0FuZFRyaWdnZXJzID0gYXBwID0+IGFzeW5jIChhY3Rpb25zLCB0cmlnZ2VycykgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMudGVtcGxhdGVBcGkuc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycyxcbiAgcGVybWlzc2lvbi53cml0ZVRlbXBsYXRlcy5pc0F1dGhvcml6ZWQsXG4gIHsgYWN0aW9ucywgdHJpZ2dlcnMgfSxcbiAgX3NhdmVBY3Rpb25zQW5kVHJpZ2dlcnMsIGFwcC5kYXRhc3RvcmUsIGFjdGlvbnMsIHRyaWdnZXJzLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9zYXZlQWN0aW9uc0FuZFRyaWdnZXJzID0gYXN5bmMgKGRhdGFzdG9yZSwgYWN0aW9ucywgdHJpZ2dlcnMpID0+IHtcbiAgaWYgKGF3YWl0IGRhdGFzdG9yZS5leGlzdHMoYXBwRGVmaW5pdGlvbkZpbGUpKSB7XG4gICAgY29uc3QgYXBwRGVmaW5pdGlvbiA9IGF3YWl0IGRhdGFzdG9yZS5sb2FkSnNvbihhcHBEZWZpbml0aW9uRmlsZSk7XG4gICAgYXBwRGVmaW5pdGlvbi5hY3Rpb25zID0gYWN0aW9ucztcbiAgICBhcHBEZWZpbml0aW9uLnRyaWdnZXJzID0gdHJpZ2dlcnM7XG5cbiAgICBjb25zdCBhY3Rpb25WYWxpZEVycnMgPSBtYXAoZSA9PiBlLmVycm9yKSh2YWxpZGF0ZUFjdGlvbnMoYWN0aW9ucykpO1xuXG4gICAgaWYgKGFjdGlvblZhbGlkRXJycy5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBBY3Rpb25zIGFyZSBpbnZhbGlkOiAke2pvaW4oYWN0aW9uVmFsaWRFcnJzLCAnLCAnKX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCB0cmlnZ2VyVmFsaWRFcnJzID0gbWFwKGUgPT4gZS5lcnJvcikodmFsaWRhdGVUcmlnZ2Vycyh0cmlnZ2VycywgYWN0aW9ucykpO1xuXG4gICAgaWYgKHRyaWdnZXJWYWxpZEVycnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgVHJpZ2dlcnMgYXJlIGludmFsaWQ6ICR7am9pbih0cmlnZ2VyVmFsaWRFcnJzLCAnLCAnKX1gKTtcbiAgICB9XG5cbiAgICBhd2FpdCBkYXRhc3RvcmUudXBkYXRlSnNvbihhcHBEZWZpbml0aW9uRmlsZSwgYXBwRGVmaW5pdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignQ2Fubm90IHNhdmUgYWN0aW9uczogQXBwbGljYXRpb24gZGVmaW5pdGlvbiBkb2VzIG5vdCBleGlzdCcpO1xuICB9XG59O1xuIiwiXG5leHBvcnQgY29uc3QgZ2V0QmVoYXZpb3VyU291cmNlcyA9IGFzeW5jIChkYXRhc3RvcmUpID0+IHtcbiAgICBhd2FpdCBkYXRhc3RvcmUubG9hZEZpbGUoJy8uY29uZmlnL2JlaGF2aW91clNvdXJjZXMuanMnKTtcbn07XG4iLCJpbXBvcnQge1xuICBnZXROZXdSb290TGV2ZWwsXG4gIGdldE5ld1JlY29yZFRlbXBsYXRlLCBnZXROZXdJbmRleFRlbXBsYXRlLFxuICBjcmVhdGVOb2RlRXJyb3JzLCBjb25zdHJ1Y3RIaWVyYXJjaHksXG4gIGdldE5ld0FnZ3JlZ2F0ZUdyb3VwVGVtcGxhdGUsIGdldE5ld1NpbmdsZVJlY29yZFRlbXBsYXRlLFxuICBnZXROZXdBZ2dyZWdhdGVUZW1wbGF0ZSwgY29uc3RydWN0Tm9kZSxcbn1cbiAgZnJvbSAnLi9jcmVhdGVOb2Rlcyc7XG5pbXBvcnQge1xuICBnZXROZXdGaWVsZCwgdmFsaWRhdGVGaWVsZCxcbiAgYWRkRmllbGQsIGZpZWxkRXJyb3JzLFxufSBmcm9tICcuL2ZpZWxkcyc7XG5pbXBvcnQge1xuICBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZSwgY29tbW9uUmVjb3JkVmFsaWRhdGlvblJ1bGVzLFxuICBhZGRSZWNvcmRWYWxpZGF0aW9uUnVsZSxcbn0gZnJvbSAnLi9yZWNvcmRWYWxpZGF0aW9uUnVsZXMnO1xuaW1wb3J0IHsgY3JlYXRlQWN0aW9uLCBjcmVhdGVUcmlnZ2VyIH0gZnJvbSAnLi9jcmVhdGVBY3Rpb25zJztcbmltcG9ydCB7XG4gIHZhbGlkYXRlVHJpZ2dlcnMsIHZhbGlkYXRlVHJpZ2dlciwgdmFsaWRhdGVOb2RlLFxuICB2YWxpZGF0ZUFjdGlvbnMsIHZhbGlkYXRlQWxsLFxufSBmcm9tICcuL3ZhbGlkYXRlJztcbmltcG9ydCB7IGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbiB9IGZyb20gJy4vZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uJztcbmltcG9ydCB7IHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSB9IGZyb20gJy4vc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5JztcbmltcG9ydCB7IHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnMgfSBmcm9tICcuL3NhdmVBY3Rpb25zQW5kVHJpZ2dlcnMnO1xuaW1wb3J0IHsgYWxsIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZ2V0QmVoYXZpb3VyU291cmNlcyB9IGZyb20gXCIuL2dldEJlaGF2aW91clNvdXJjZXNcIjtcblxuY29uc3QgYXBpID0gYXBwID0+ICh7XG5cbiAgZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uOiBnZXRBcHBsaWNhdGlvbkRlZmluaXRpb24oYXBwLmRhdGFzdG9yZSksXG4gIHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeTogc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5KGFwcCksXG4gIHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnM6IHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnMoYXBwKSxcbiAgZ2V0QmVoYXZpb3VyU291cmNlczogKCkgPT4gZ2V0QmVoYXZpb3VyU291cmNlcyhhcHAuZGF0YXN0b3JlKSxcbiAgZ2V0TmV3Um9vdExldmVsLFxuICBjb25zdHJ1Y3ROb2RlLFxuICBnZXROZXdJbmRleFRlbXBsYXRlLFxuICBnZXROZXdSZWNvcmRUZW1wbGF0ZSxcbiAgZ2V0TmV3RmllbGQsXG4gIHZhbGlkYXRlRmllbGQsXG4gIGFkZEZpZWxkLFxuICBmaWVsZEVycm9ycyxcbiAgZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUsXG4gIGNvbW1vblJlY29yZFZhbGlkYXRpb25SdWxlcyxcbiAgYWRkUmVjb3JkVmFsaWRhdGlvblJ1bGUsXG4gIGNyZWF0ZUFjdGlvbixcbiAgY3JlYXRlVHJpZ2dlcixcbiAgdmFsaWRhdGVBY3Rpb25zLFxuICB2YWxpZGF0ZVRyaWdnZXIsXG4gIGdldE5ld0FnZ3JlZ2F0ZUdyb3VwVGVtcGxhdGUsXG4gIGdldE5ld0FnZ3JlZ2F0ZVRlbXBsYXRlLFxuICBjb25zdHJ1Y3RIaWVyYXJjaHksXG4gIGdldE5ld1NpbmdsZVJlY29yZFRlbXBsYXRlLFxuICBhbGxUeXBlczogYWxsLFxuICB2YWxpZGF0ZU5vZGUsXG4gIHZhbGlkYXRlQWxsLFxuICB2YWxpZGF0ZVRyaWdnZXJzLFxufSk7XG5cblxuZXhwb3J0IGNvbnN0IGdldFRlbXBsYXRlQXBpID0gYXBwID0+IGFwaShhcHApO1xuXG5leHBvcnQgY29uc3QgZXJyb3JzID0gY3JlYXRlTm9kZUVycm9ycztcblxuZXhwb3J0IGRlZmF1bHQgZ2V0VGVtcGxhdGVBcGk7XG4iLCJpbXBvcnQgeyBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgVVNFUlNfTElTVF9GSUxFLFxuICBzdHJpcFVzZXJPZlNlbnNpdGl2ZVN0dWZmLFxufSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgJCwgYXBpV3JhcHBlciwgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGdldFVzZXJzID0gYXBwID0+IGFzeW5jICgpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuZ2V0VXNlcnMsXG4gIHBlcm1pc3Npb24ubGlzdFVzZXJzLmlzQXV0aG9yaXplZCxcbiAge30sXG4gIF9nZXRVc2VycywgYXBwLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9nZXRVc2VycyA9IGFzeW5jIGFwcCA9PiAkKGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oVVNFUlNfTElTVF9GSUxFKSwgW1xuICBtYXAoc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZiksXG5dKTtcbiIsImltcG9ydCB7IEFDQ0VTU19MRVZFTFNfRklMRSB9IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyBhcGlXcmFwcGVyLCBldmVudHMgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgbG9hZEFjY2Vzc0xldmVscyA9IGFwcCA9PiBhc3luYyAoKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmxvYWRBY2Nlc3NMZXZlbHMsXG4gIHBlcm1pc3Npb24ubGlzdEFjY2Vzc0xldmVscy5pc0F1dGhvcml6ZWQsXG4gIHt9LFxuICBfbG9hZEFjY2Vzc0xldmVscywgYXBwLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9sb2FkQWNjZXNzTGV2ZWxzID0gYXN5bmMgYXBwID0+IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oQUNDRVNTX0xFVkVMU19GSUxFKTtcbiIsImltcG9ydCB7XG4gIGZpbmQsIGZpbHRlciwgc29tZSxcbiAgbWFwLCBmbGF0dGVuLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcbmltcG9ydCB7IF9nZXRVc2VycyB9IGZyb20gJy4vZ2V0VXNlcnMnO1xuaW1wb3J0IHtcbiAgZ2V0VXNlckJ5TmFtZSwgdXNlckF1dGhGaWxlLFxuICBwYXJzZVRlbXBvcmFyeUNvZGUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyBfbG9hZEFjY2Vzc0xldmVscyB9IGZyb20gJy4vbG9hZEFjY2Vzc0xldmVscyc7XG5pbXBvcnQge1xuICBpc05vdGhpbmdPckVtcHR5LCAkLCBhcGlXcmFwcGVyLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmNvbnN0IGR1bW15SGFzaCA9ICckYXJnb24yaSR2PTE5JG09NDA5Nix0PTMscD0xJFVaUm80MDlVWUJHakhKUzNDVjZVeHckclU4NHFVcVBlT1JGektZbVlZMGNlQkxEYVBPK0pXU0g0UGZOaUtYZklLayc7XG5cbmV4cG9ydCBjb25zdCBhdXRoZW50aWNhdGUgPSBhcHAgPT4gYXN5bmMgKHVzZXJuYW1lLCBwYXNzd29yZCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5hdXRoZW50aWNhdGUsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0sXG4gIF9hdXRoZW50aWNhdGUsIGFwcCwgdXNlcm5hbWUsIHBhc3N3b3JkLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9hdXRoZW50aWNhdGUgPSBhc3luYyAoYXBwLCB1c2VybmFtZSwgcGFzc3dvcmQpID0+IHtcbiAgaWYgKGlzTm90aGluZ09yRW1wdHkodXNlcm5hbWUpIHx8IGlzTm90aGluZ09yRW1wdHkocGFzc3dvcmQpKSB7IHJldHVybiBudWxsOyB9XG5cbiAgY29uc3QgYWxsVXNlcnMgPSBhd2FpdCBfZ2V0VXNlcnMoYXBwKTtcbiAgbGV0IHVzZXIgPSBnZXRVc2VyQnlOYW1lKFxuICAgIGFsbFVzZXJzLFxuICAgIHVzZXJuYW1lLFxuICApO1xuXG4gIGNvbnN0IG5vdEFVc2VyID0gJ25vdC1hLXVzZXInO1xuICAvLyBjb250aW51ZSB3aXRoIG5vbi11c2VyIC0gc28gdGltZSB0byB2ZXJpZnkgcmVtYWlucyBjb25zaXN0ZW50XG4gIC8vIHdpdGggdmVyaWZpY2F0aW9uIG9mIGEgdmFsaWQgdXNlclxuICBpZiAoIXVzZXIgfHwgIXVzZXIuZW5hYmxlZCkgeyB1c2VyID0gbm90QVVzZXI7IH1cblxuICBsZXQgdXNlckF1dGg7XG4gIHRyeSB7XG4gICAgdXNlckF1dGggPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgICAgdXNlckF1dGhGaWxlKHVzZXJuYW1lKSxcbiAgICApO1xuICB9IGNhdGNoIChfKSB7XG4gICAgdXNlckF1dGggPSB7IGFjY2Vzc0xldmVsczogW10sIHBhc3N3b3JkSGFzaDogZHVtbXlIYXNoIH07XG4gIH1cblxuICBjb25zdCBwZXJtaXNzaW9ucyA9IGF3YWl0IGJ1aWxkVXNlclBlcm1pc3Npb25zKGFwcCwgdXNlci5hY2Nlc3NMZXZlbHMpO1xuXG4gIGNvbnN0IHZlcmlmaWVkID0gYXdhaXQgYXBwLmNyeXB0by52ZXJpZnkoXG4gICAgdXNlckF1dGgucGFzc3dvcmRIYXNoLFxuICAgIHBhc3N3b3JkLFxuICApO1xuXG4gIGlmICh1c2VyID09PSBub3RBVXNlcikgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHJldHVybiB2ZXJpZmllZFxuICAgID8ge1xuICAgICAgLi4udXNlciwgcGVybWlzc2lvbnMsIHRlbXA6IGZhbHNlLCBpc1VzZXI6IHRydWUsXG4gICAgfVxuICAgIDogbnVsbDtcbn07XG5cbmV4cG9ydCBjb25zdCBhdXRoZW50aWNhdGVUZW1wb3JhcnlBY2Nlc3MgPSBhcHAgPT4gYXN5bmMgKHRlbXBBY2Nlc3NDb2RlKSA9PiB7XG4gIGlmIChpc05vdGhpbmdPckVtcHR5KHRlbXBBY2Nlc3NDb2RlKSkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIGNvbnN0IHRlbXAgPSBwYXJzZVRlbXBvcmFyeUNvZGUodGVtcEFjY2Vzc0NvZGUpO1xuICBsZXQgdXNlciA9ICQoYXdhaXQgX2dldFVzZXJzKGFwcCksIFtcbiAgICBmaW5kKHUgPT4gdS50ZW1wb3JhcnlBY2Nlc3NJZCA9PT0gdGVtcC5pZCksXG4gIF0pO1xuXG4gIGNvbnN0IG5vdEFVc2VyID0gJ25vdC1hLXVzZXInO1xuICBpZiAoIXVzZXIgfHwgIXVzZXIuZW5hYmxlZCkgeyB1c2VyID0gbm90QVVzZXI7IH1cblxuICBsZXQgdXNlckF1dGg7XG4gIHRyeSB7XG4gICAgdXNlckF1dGggPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgICAgdXNlckF1dGhGaWxlKHVzZXIubmFtZSksXG4gICAgKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHVzZXJBdXRoID0ge1xuICAgICAgdGVtcG9yYXJ5QWNjZXNzSGFzaDogZHVtbXlIYXNoLFxuICAgICAgdGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2g6IChhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCkgKyAxMDAwMCksXG4gICAgfTtcbiAgfVxuXG4gIGlmICh1c2VyQXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA8IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKSkgeyB1c2VyID0gbm90QVVzZXI7IH1cblxuICBjb25zdCB0ZW1wQ29kZSA9ICF0ZW1wLmNvZGUgPyBnZW5lcmF0ZSgpIDogdGVtcC5jb2RlO1xuICBjb25zdCB2ZXJpZmllZCA9IGF3YWl0IGFwcC5jcnlwdG8udmVyaWZ5KFxuICAgIHVzZXJBdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2gsXG4gICAgdGVtcENvZGUsXG4gICk7XG5cbiAgaWYgKHVzZXIgPT09IG5vdEFVc2VyKSB7IHJldHVybiBudWxsOyB9XG5cbiAgcmV0dXJuIHZlcmlmaWVkXG4gICAgPyB7XG4gICAgICAuLi51c2VyLFxuICAgICAgcGVybWlzc2lvbnM6IFtdLFxuICAgICAgdGVtcDogdHJ1ZSxcbiAgICAgIGlzVXNlcjogdHJ1ZSxcbiAgICB9XG4gICAgOiBudWxsO1xufTtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkVXNlclBlcm1pc3Npb25zID0gYXN5bmMgKGFwcCwgdXNlckFjY2Vzc0xldmVscykgPT4ge1xuICBjb25zdCBhbGxBY2Nlc3NMZXZlbHMgPSBhd2FpdCBfbG9hZEFjY2Vzc0xldmVscyhhcHApO1xuXG4gIHJldHVybiAkKGFsbEFjY2Vzc0xldmVscy5sZXZlbHMsIFtcbiAgICBmaWx0ZXIobCA9PiBzb21lKHVhID0+IGwubmFtZSA9PT0gdWEpKHVzZXJBY2Nlc3NMZXZlbHMpKSxcbiAgICBtYXAobCA9PiBsLnBlcm1pc3Npb25zKSxcbiAgICBmbGF0dGVuLFxuICBdKTtcbn07XG4iLCJpbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHtcbiAgdGVtcENvZGVFeHBpcnlMZW5ndGgsIFVTRVJTX0xPQ0tfRklMRSxcbiAgVVNFUlNfTElTVF9GSUxFLCB1c2VyQXV0aEZpbGUsXG4gIGdldFVzZXJCeU5hbWUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQge1xuICBnZXRMb2NrLCBpc05vbG9jayxcbiAgcmVsZWFzZUxvY2ssXG59IGZyb20gJy4uL2NvbW1vbi9sb2NrJztcbmltcG9ydCB7IGFwaVdyYXBwZXIsIGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVUZW1wb3JhcnlBY2Nlc3MgPSBhcHAgPT4gYXN5bmMgdXNlck5hbWUgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5jcmVhdGVUZW1wb3JhcnlBY2Nlc3MsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgdXNlck5hbWUgfSxcbiAgX2NyZWF0ZVRlbXBvcmFyeUFjY2VzcywgYXBwLCB1c2VyTmFtZSxcbik7XG5cbmV4cG9ydCBjb25zdCBfY3JlYXRlVGVtcG9yYXJ5QWNjZXNzID0gYXN5bmMgKGFwcCwgdXNlck5hbWUpID0+IHtcbiAgY29uc3QgdGVtcENvZGUgPSBhd2FpdCBnZXRUZW1wb3JhcnlDb2RlKGFwcCk7XG5cbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldExvY2soXG4gICAgYXBwLCBVU0VSU19MT0NLX0ZJTEUsIDEwMDAsIDIsXG4gICk7XG5cbiAgaWYgKGlzTm9sb2NrKGxvY2spKSB7IHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGNyZWF0ZSB0ZW1wb3JhcnkgYWNjZXNzLCBjb3VsZCBub3QgZ2V0IGxvY2sgLSB0cnkgYWdhaW4nKTsgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSk7XG5cbiAgICBjb25zdCB1c2VyID0gZ2V0VXNlckJ5TmFtZSh1c2VycywgdXNlck5hbWUpO1xuICAgIHVzZXIudGVtcG9yYXJ5QWNjZXNzSWQgPSB0ZW1wQ29kZS50ZW1wb3JhcnlBY2Nlc3NJZDtcblxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgICAgIFVTRVJTX0xJU1RfRklMRSxcbiAgICAgIHVzZXJzLFxuICAgICk7XG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcbiAgfVxuXG4gIGNvbnN0IHVzZXJBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICB1c2VyQXV0aEZpbGUodXNlck5hbWUpLFxuICApO1xuICB1c2VyQXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoID0gdGVtcENvZGUudGVtcG9yYXJ5QWNjZXNzSGFzaDtcblxuICB1c2VyQXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA9IHRlbXBDb2RlLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoO1xuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgICB1c2VyQXV0aEZpbGUodXNlck5hbWUpLFxuICAgIHVzZXJBdXRoLFxuICApO1xuXG4gIHJldHVybiB0ZW1wQ29kZS50ZW1wQ29kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRUZW1wb3JhcnlDb2RlID0gYXN5bmMgKGFwcCkgPT4ge1xuICBjb25zdCB0ZW1wQ29kZSA9IGdlbmVyYXRlKClcbiAgICAgICAgKyBnZW5lcmF0ZSgpXG4gICAgICAgICsgZ2VuZXJhdGUoKVxuICAgICAgICArIGdlbmVyYXRlKCk7XG5cbiAgY29uc3QgdGVtcElkID0gZ2VuZXJhdGUoKTtcblxuICByZXR1cm4ge1xuICAgIHRlbXBvcmFyeUFjY2Vzc0hhc2g6IGF3YWl0IGFwcC5jcnlwdG8uaGFzaChcbiAgICAgIHRlbXBDb2RlLFxuICAgICksXG4gICAgdGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2g6XG4gICAgICAgICAgICAoYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpKSArIHRlbXBDb2RlRXhwaXJ5TGVuZ3RoLFxuICAgIHRlbXBDb2RlOiBgdG1wOiR7dGVtcElkfToke3RlbXBDb2RlfWAsXG4gICAgdGVtcG9yYXJ5QWNjZXNzSWQ6IHRlbXBJZCxcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBsb29rc0xpa2VUZW1wb3JhcnlDb2RlID0gY29kZSA9PiBjb2RlLnN0YXJ0c1dpdGgoJ3RtcDonKTtcbiIsImltcG9ydCB7XG4gIG1hcCwgdW5pcVdpdGgsXG4gIGZsYXR0ZW4sIGZpbHRlcixcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGFwcGx5UnVsZVNldCwgbWFrZXJ1bGUgfSBmcm9tICcuLi9jb21tb24vdmFsaWRhdGlvbkNvbW1vbic7XG5pbXBvcnQge1xuICAkLCBpbnNlbnNpdGl2ZUVxdWFscywgYXBpV3JhcHBlciwgZXZlbnRzLFxuICBpc05vbkVtcHR5U3RyaW5nLCBhbGwsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmNvbnN0IHVzZXJSdWxlcyA9IGFsbFVzZXJzID0+IFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAndXNlcm5hbWUgbXVzdCBiZSBzZXQnLFxuICAgIHUgPT4gaXNOb25FbXB0eVN0cmluZyh1Lm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2FjY2Vzc0xldmVscycsICd1c2VyIG11c3QgaGF2ZSBhdCBsZWFzdCBvbmUgYWNjZXNzIGxldmVsJyxcbiAgICB1ID0+IHUuYWNjZXNzTGV2ZWxzLmxlbmd0aCA+IDApLFxuICBtYWtlcnVsZSgnbmFtZScsICd1c2VybmFtZSBtdXN0IGJlIHVuaXF1ZScsXG4gICAgdSA9PiBmaWx0ZXIodTIgPT4gaW5zZW5zaXRpdmVFcXVhbHModTIubmFtZSwgdS5uYW1lKSkoYWxsVXNlcnMpLmxlbmd0aCA9PT0gMSksXG4gIG1ha2VydWxlKCdhY2Nlc3NMZXZlbHMnLCAnYWNjZXNzIGxldmVscyBtdXN0IG9ubHkgY29udGFpbiBzdGluZ3MnLFxuICAgIHUgPT4gYWxsKGlzTm9uRW1wdHlTdHJpbmcpKHUuYWNjZXNzTGV2ZWxzKSksXG5dO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVVc2VyID0gKCkgPT4gKGFsbHVzZXJzLCB1c2VyKSA9PiBhcHBseVJ1bGVTZXQodXNlclJ1bGVzKGFsbHVzZXJzKSkodXNlcik7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVVzZXJzID0gYXBwID0+IGFsbFVzZXJzID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkudmFsaWRhdGVVc2VycyxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyBhbGxVc2VycyB9LFxuICBfdmFsaWRhdGVVc2VycywgYXBwLCBhbGxVc2Vycyxcbik7XG5cbmV4cG9ydCBjb25zdCBfdmFsaWRhdGVVc2VycyA9IChhcHAsIGFsbFVzZXJzKSA9PiAkKGFsbFVzZXJzLCBbXG4gIG1hcChsID0+IHZhbGlkYXRlVXNlcihhcHApKGFsbFVzZXJzLCBsKSksXG4gIGZsYXR0ZW4sXG4gIHVuaXFXaXRoKCh4LCB5KSA9PiB4LmZpZWxkID09PSB5LmZpZWxkXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB4Lml0ZW0gPT09IHkuaXRlbVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgeC5lcnJvciA9PT0geS5lcnJvciksXG5dKTtcbiIsImltcG9ydCB7IGFwaVdyYXBwZXJTeW5jLCBldmVudHMgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3VXNlciA9IGFwcCA9PiAoKSA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5nZXROZXdVc2VyLFxuICBwZXJtaXNzaW9uLmNyZWF0ZVVzZXIuaXNBdXRob3JpemVkLFxuICB7fSxcbiAgX2dldE5ld1VzZXIsIGFwcCxcbik7XG5cbmV4cG9ydCBjb25zdCBfZ2V0TmV3VXNlciA9ICgpID0+ICh7XG4gIG5hbWU6ICcnLFxuICBhY2Nlc3NMZXZlbHM6IFtdLFxuICBlbmFibGVkOiB0cnVlLFxuICB0ZW1wb3JhcnlBY2Nlc3NJZDogJycsXG59KTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld1VzZXJBdXRoID0gYXBwID0+ICgpID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmdldE5ld1VzZXJBdXRoLFxuICBwZXJtaXNzaW9uLmNyZWF0ZVVzZXIuaXNBdXRob3JpemVkLFxuICB7fSxcbiAgX2dldE5ld1VzZXJBdXRoLCBhcHAsXG4pO1xuXG5leHBvcnQgY29uc3QgX2dldE5ld1VzZXJBdXRoID0gKCkgPT4gKHtcbiAgcGFzc3dvcmRIYXNoOiAnJyxcbiAgdGVtcG9yYXJ5QWNjZXNzSGFzaDogJycsXG4gIHRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoOiAwLFxufSk7XG4iLCJpbXBvcnQgeyBmaW5kIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHVzZXJBdXRoRmlsZSwgcGFyc2VUZW1wb3JhcnlDb2RlIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7XG4gIGlzU29tZXRoaW5nLCAkLCBhcGlXcmFwcGVyLCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgX2dldFVzZXJzIH0gZnJvbSAnLi9nZXRVc2Vycyc7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBpc1ZhbGlkUGFzc3dvcmQgPSBhcHAgPT4gcGFzc3dvcmQgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuaXNWYWxpZFBhc3N3b3JkLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHBhc3N3b3JkIH0sXG4gIF9pc1ZhbGlkUGFzc3dvcmQsIGFwcCwgcGFzc3dvcmQsXG4pO1xuXG5leHBvcnQgY29uc3QgX2lzVmFsaWRQYXNzd29yZCA9IChhcHAsIHBhc3N3b3JkKSA9PiBzY29yZVBhc3N3b3JkKHBhc3N3b3JkKS5zY29yZSA+IDMwO1xuXG5leHBvcnQgY29uc3QgY2hhbmdlTXlQYXNzd29yZCA9IGFwcCA9PiBhc3luYyAoY3VycmVudFB3LCBuZXdwYXNzd29yZCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5jaGFuZ2VNeVBhc3N3b3JkLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IGN1cnJlbnRQdywgbmV3cGFzc3dvcmQgfSxcbiAgX2NoYW5nZU15UGFzc3dvcmQsIGFwcCwgY3VycmVudFB3LCBuZXdwYXNzd29yZCxcbik7XG5cbmV4cG9ydCBjb25zdCBfY2hhbmdlTXlQYXNzd29yZCA9IGFzeW5jIChhcHAsIGN1cnJlbnRQdywgbmV3cGFzc3dvcmQpID0+IHtcbiAgY29uc3QgZXhpc3RpbmdBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICB1c2VyQXV0aEZpbGUoYXBwLnVzZXIubmFtZSksXG4gICk7XG5cbiAgaWYgKGlzU29tZXRoaW5nKGV4aXN0aW5nQXV0aC5wYXNzd29yZEhhc2gpKSB7XG4gICAgY29uc3QgdmVyaWZpZWQgPSBhd2FpdCBhcHAuY3J5cHRvLnZlcmlmeShcbiAgICAgIGV4aXN0aW5nQXV0aC5wYXNzd29yZEhhc2gsXG4gICAgICBjdXJyZW50UHcsXG4gICAgKTtcblxuICAgIGlmICh2ZXJpZmllZCkge1xuICAgICAgYXdhaXQgYXdhaXQgZG9TZXQoXG4gICAgICAgIGFwcCwgZXhpc3RpbmdBdXRoLFxuICAgICAgICBhcHAudXNlci5uYW1lLCBuZXdwYXNzd29yZCxcbiAgICAgICk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3Qgc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZSA9IGFwcCA9PiBhc3luYyAodGVtcENvZGUsIG5ld3Bhc3N3b3JkKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLnNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgdGVtcENvZGUsIG5ld3Bhc3N3b3JkIH0sXG4gIF9zZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlLCBhcHAsIHRlbXBDb2RlLCBuZXdwYXNzd29yZCxcbik7XG5cblxuZXhwb3J0IGNvbnN0IF9zZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlID0gYXN5bmMgKGFwcCwgdGVtcENvZGUsIG5ld3Bhc3N3b3JkKSA9PiB7XG4gIGNvbnN0IGN1cnJlbnRUaW1lID0gYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpO1xuXG4gIGNvbnN0IHRlbXAgPSBwYXJzZVRlbXBvcmFyeUNvZGUodGVtcENvZGUpO1xuXG4gIGNvbnN0IHVzZXIgPSAkKGF3YWl0IF9nZXRVc2VycyhhcHApLCBbXG4gICAgZmluZCh1ID0+IHUudGVtcG9yYXJ5QWNjZXNzSWQgPT09IHRlbXAuaWQpLFxuICBdKTtcblxuICBpZiAoIXVzZXIpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgY29uc3QgZXhpc3RpbmdBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICB1c2VyQXV0aEZpbGUodXNlci5uYW1lKSxcbiAgKTtcblxuICBpZiAoaXNTb21ldGhpbmcoZXhpc3RpbmdBdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2gpXG4gICAgICAgJiYgZXhpc3RpbmdBdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID4gY3VycmVudFRpbWUpIHtcbiAgICBjb25zdCB2ZXJpZmllZCA9IGF3YWl0IGFwcC5jcnlwdG8udmVyaWZ5KFxuICAgICAgZXhpc3RpbmdBdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2gsXG4gICAgICB0ZW1wLmNvZGUsXG4gICAgKTtcblxuICAgIGlmICh2ZXJpZmllZCkge1xuICAgICAgYXdhaXQgZG9TZXQoXG4gICAgICAgIGFwcCwgZXhpc3RpbmdBdXRoLFxuICAgICAgICB1c2VyLm5hbWUsIG5ld3Bhc3N3b3JkLFxuICAgICAgKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IGRvU2V0ID0gYXN5bmMgKGFwcCwgYXV0aCwgdXNlcm5hbWUsIG5ld3Bhc3N3b3JkKSA9PiB7XG4gIGF1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaCA9ICcnO1xuICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID0gMDtcbiAgYXV0aC5wYXNzd29yZEhhc2ggPSBhd2FpdCBhcHAuY3J5cHRvLmhhc2goXG4gICAgbmV3cGFzc3dvcmQsXG4gICk7XG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgICB1c2VyQXV0aEZpbGUodXNlcm5hbWUpLFxuICAgIGF1dGgsXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2NvcmVQYXNzd29yZCA9IGFwcCA9PiBwYXNzd29yZCA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5zY29yZVBhc3N3b3JkLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHBhc3N3b3JkIH0sXG4gIF9zY29yZVBhc3N3b3JkLCBwYXNzd29yZCxcbik7XG5cbmV4cG9ydCBjb25zdCBfc2NvcmVQYXNzd29yZCA9IChwYXNzd29yZCkgPT4ge1xuICAvLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzk0ODE3Mi9wYXNzd29yZC1zdHJlbmd0aC1tZXRlclxuICAvLyB0aGFuayB5b3UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS91c2Vycy80NjYxNy90bS1sdlxuXG4gIGxldCBzY29yZSA9IDA7XG4gIGlmICghcGFzc3dvcmQpIHsgcmV0dXJuIHNjb3JlOyB9XG5cbiAgLy8gYXdhcmQgZXZlcnkgdW5pcXVlIGxldHRlciB1bnRpbCA1IHJlcGV0aXRpb25zXG4gIGNvbnN0IGxldHRlcnMgPSBuZXcgT2JqZWN0KCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGFzc3dvcmQubGVuZ3RoOyBpKyspIHtcbiAgICBsZXR0ZXJzW3Bhc3N3b3JkW2ldXSA9IChsZXR0ZXJzW3Bhc3N3b3JkW2ldXSB8fCAwKSArIDE7XG4gICAgc2NvcmUgKz0gNS4wIC8gbGV0dGVyc1twYXNzd29yZFtpXV07XG4gIH1cblxuICAvLyBib251cyBwb2ludHMgZm9yIG1peGluZyBpdCB1cFxuICBjb25zdCB2YXJpYXRpb25zID0ge1xuICAgIGRpZ2l0czogL1xcZC8udGVzdChwYXNzd29yZCksXG4gICAgbG93ZXI6IC9bYS16XS8udGVzdChwYXNzd29yZCksXG4gICAgdXBwZXI6IC9bQS1aXS8udGVzdChwYXNzd29yZCksXG4gICAgbm9uV29yZHM6IC9cXFcvLnRlc3QocGFzc3dvcmQpLFxuICB9O1xuXG4gIGxldCB2YXJpYXRpb25Db3VudCA9IDA7XG4gIGZvciAoY29uc3QgY2hlY2sgaW4gdmFyaWF0aW9ucykge1xuICAgIHZhcmlhdGlvbkNvdW50ICs9ICh2YXJpYXRpb25zW2NoZWNrXSA9PSB0cnVlKSA/IDEgOiAwO1xuICB9XG4gIHNjb3JlICs9ICh2YXJpYXRpb25Db3VudCAtIDEpICogMTA7XG5cbiAgY29uc3Qgc3RyZW5ndGhUZXh0ID0gc2NvcmUgPiA4MFxuICAgID8gJ3N0cm9uZydcbiAgICA6IHNjb3JlID4gNjBcbiAgICAgID8gJ2dvb2QnXG4gICAgICA6IHNjb3JlID49IDMwXG4gICAgICAgID8gJ3dlYWsnXG4gICAgICAgIDogJ3Zlcnkgd2Vhayc7XG5cbiAgcmV0dXJuIHtcbiAgICBzY29yZTogcGFyc2VJbnQoc2NvcmUpLFxuICAgIHN0cmVuZ3RoVGV4dCxcbiAgfTtcbn07XG4iLCJpbXBvcnQgeyBqb2luLCBzb21lIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHZhbGlkYXRlVXNlciB9IGZyb20gJy4vdmFsaWRhdGVVc2VyJztcbmltcG9ydCB7IGdldE5ld1VzZXJBdXRoIH0gZnJvbSAnLi9nZXROZXdVc2VyJztcbmltcG9ydCB7XG4gIGdldExvY2ssIGlzTm9sb2NrLCByZWxlYXNlTG9jaywgYXBpV3JhcHBlciwgZXZlbnRzLFxuICBpbnNlbnNpdGl2ZUVxdWFscywgaXNOb25FbXB0eVN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIFVTRVJTX0xPQ0tfRklMRSwgc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZixcbiAgVVNFUlNfTElTVF9GSUxFLCB1c2VyQXV0aEZpbGUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyBnZXRUZW1wb3JhcnlDb2RlIH0gZnJvbSAnLi9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MnO1xuaW1wb3J0IHsgaXNWYWxpZFBhc3N3b3JkIH0gZnJvbSAnLi9zZXRQYXNzd29yZCc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVVzZXIgPSBhcHAgPT4gYXN5bmMgKHVzZXIsIHBhc3N3b3JkID0gbnVsbCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5jcmVhdGVVc2VyLFxuICBwZXJtaXNzaW9uLmNyZWF0ZVVzZXIuaXNBdXRob3JpemVkLFxuICB7IHVzZXIsIHBhc3N3b3JkIH0sXG4gIF9jcmVhdGVVc2VyLCBhcHAsIHVzZXIsIHBhc3N3b3JkLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9jcmVhdGVVc2VyID0gYXN5bmMgKGFwcCwgdXNlciwgcGFzc3dvcmQgPSBudWxsKSA9PiB7XG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRMb2NrKFxuICAgIGFwcCwgVVNFUlNfTE9DS19GSUxFLCAxMDAwLCAyLFxuICApO1xuXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBjcmVhdGUgdXNlciwgY291bGQgbm90IGdldCBsb2NrIC0gdHJ5IGFnYWluJyk7IH1cblxuICBjb25zdCB1c2VycyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oVVNFUlNfTElTVF9GSUxFKTtcblxuICBjb25zdCB1c2VyRXJyb3JzID0gdmFsaWRhdGVVc2VyKGFwcCkoWy4uLnVzZXJzLCB1c2VyXSwgdXNlcik7XG4gIGlmICh1c2VyRXJyb3JzLmxlbmd0aCA+IDApIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgVXNlciBpcyBpbnZhbGlkLiAke2pvaW4oJzsgJykodXNlckVycm9ycyl9YCk7IH1cblxuICBjb25zdCB7IGF1dGgsIHRlbXBDb2RlLCB0ZW1wb3JhcnlBY2Nlc3NJZCB9ID0gYXdhaXQgZ2V0QWNjZXNzKFxuICAgIGFwcCwgcGFzc3dvcmQsXG4gICk7XG4gIHVzZXIudGVtcENvZGUgPSB0ZW1wQ29kZTtcbiAgdXNlci50ZW1wb3JhcnlBY2Nlc3NJZCA9IHRlbXBvcmFyeUFjY2Vzc0lkO1xuXG4gIGlmIChzb21lKHUgPT4gaW5zZW5zaXRpdmVFcXVhbHModS5uYW1lLCB1c2VyLm5hbWUpKSh1c2VycykpIHsgXG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignVXNlciBhbHJlYWR5IGV4aXN0cycpOyBcbiAgfVxuXG4gIHVzZXJzLnB1c2goXG4gICAgc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZih1c2VyKSxcbiAgKTtcblxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgVVNFUlNfTElTVF9GSUxFLFxuICAgIHVzZXJzLFxuICApO1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVKc29uKFxuICAgICAgdXNlckF1dGhGaWxlKHVzZXIubmFtZSksXG4gICAgICBhdXRoLFxuICAgICk7XG4gIH0gY2F0Y2ggKF8pIHtcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgICB1c2VyQXV0aEZpbGUodXNlci5uYW1lKSxcbiAgICAgIGF1dGgsXG4gICAgKTtcbiAgfVxuXG4gIGF3YWl0IHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XG5cbiAgcmV0dXJuIHVzZXI7XG59O1xuXG5jb25zdCBnZXRBY2Nlc3MgPSBhc3luYyAoYXBwLCBwYXNzd29yZCkgPT4ge1xuICBjb25zdCBhdXRoID0gZ2V0TmV3VXNlckF1dGgoYXBwKSgpO1xuXG4gIGlmIChpc05vbkVtcHR5U3RyaW5nKHBhc3N3b3JkKSkge1xuICAgIGlmIChpc1ZhbGlkUGFzc3dvcmQocGFzc3dvcmQpKSB7XG4gICAgICBhdXRoLnBhc3N3b3JkSGFzaCA9IGF3YWl0IGFwcC5jcnlwdG8uaGFzaChwYXNzd29yZCk7XG4gICAgICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2ggPSAnJztcbiAgICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzSWQgPSAnJztcbiAgICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPSAwO1xuICAgICAgcmV0dXJuIHsgYXV0aCB9O1xuICAgIH1cbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdQYXNzd29yZCBkb2VzIG5vdCBtZWV0IHJlcXVpcmVtZW50cycpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHRlbXBBY2Nlc3MgPSBhd2FpdCBnZXRUZW1wb3JhcnlDb2RlKGFwcCk7XG4gICAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoID0gdGVtcEFjY2Vzcy50ZW1wb3JhcnlBY2Nlc3NIYXNoO1xuICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPSB0ZW1wQWNjZXNzLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoO1xuICAgIGF1dGgucGFzc3dvcmRIYXNoID0gJyc7XG4gICAgcmV0dXJuICh7XG4gICAgICBhdXRoLFxuICAgICAgdGVtcENvZGU6IHRlbXBBY2Nlc3MudGVtcENvZGUsXG4gICAgICB0ZW1wb3JhcnlBY2Nlc3NJZDogdGVtcEFjY2Vzcy50ZW1wb3JhcnlBY2Nlc3NJZCxcbiAgICB9KTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIGdldExvY2ssXG4gIGlzTm9sb2NrLCByZWxlYXNlTG9jayxcbn0gZnJvbSAnLi4vY29tbW9uL2xvY2snO1xuaW1wb3J0IHsgVVNFUlNfTE9DS19GSUxFLCBVU0VSU19MSVNUX0ZJTEUsIGdldFVzZXJCeU5hbWUgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgYXBpV3JhcHBlciwgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGVuYWJsZVVzZXIgPSBhcHAgPT4gYXN5bmMgdXNlcm5hbWUgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5lbmFibGVVc2VyLFxuICBwZXJtaXNzaW9uLmVuYWJsZURpc2FibGVVc2VyLmlzQXV0aG9yaXplZCxcbiAgeyB1c2VybmFtZSB9LFxuICBfZW5hYmxlVXNlciwgYXBwLCB1c2VybmFtZSxcbik7XG5cbmV4cG9ydCBjb25zdCBkaXNhYmxlVXNlciA9IGFwcCA9PiBhc3luYyB1c2VybmFtZSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmRpc2FibGVVc2VyLFxuICBwZXJtaXNzaW9uLmVuYWJsZURpc2FibGVVc2VyLmlzQXV0aG9yaXplZCxcbiAgeyB1c2VybmFtZSB9LFxuICBfZGlzYWJsZVVzZXIsIGFwcCwgdXNlcm5hbWUsXG4pO1xuXG5leHBvcnQgY29uc3QgX2VuYWJsZVVzZXIgPSBhc3luYyAoYXBwLCB1c2VybmFtZSkgPT4gYXdhaXQgdG9nZ2xlVXNlcihhcHAsIHVzZXJuYW1lLCB0cnVlKTtcblxuZXhwb3J0IGNvbnN0IF9kaXNhYmxlVXNlciA9IGFzeW5jIChhcHAsIHVzZXJuYW1lKSA9PiBhd2FpdCB0b2dnbGVVc2VyKGFwcCwgdXNlcm5hbWUsIGZhbHNlKTtcblxuY29uc3QgdG9nZ2xlVXNlciA9IGFzeW5jIChhcHAsIHVzZXJuYW1lLCBlbmFibGVkKSA9PiB7XG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRMb2NrKGFwcCwgVVNFUlNfTE9DS19GSUxFLCAxMDAwLCAxLCAwKTtcblxuICBjb25zdCBhY3Rpb25OYW1lID0gZW5hYmxlZCA/ICdlbmFibGUnIDogJ2Rpc2FibGUnO1xuXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCAke2FjdGlvbk5hbWV9IHVzZXIgLSBjYW5ub3QgZ2V0IGxvY2tgKTsgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSk7XG4gICAgY29uc3QgdXNlciA9IGdldFVzZXJCeU5hbWUodXNlcnMsIHVzZXJuYW1lKTtcbiAgICBpZiAoIXVzZXIpIHsgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoYENvdWxkIG5vdCBmaW5kIHVzZXIgdG8gJHthY3Rpb25OYW1lfWApOyB9XG5cbiAgICBpZiAodXNlci5lbmFibGVkID09PSAhZW5hYmxlZCkge1xuICAgICAgdXNlci5lbmFibGVkID0gZW5hYmxlZDtcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihVU0VSU19MSVNUX0ZJTEUsIHVzZXJzKTtcbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcbiAgfVxufTtcbiIsImV4cG9ydCBjb25zdCBnZXROZXdBY2Nlc3NMZXZlbCA9ICgpID0+ICgpID0+ICh7XG4gIG5hbWU6ICcnLFxuICBwZXJtaXNzaW9uczogW10sXG4gIGRlZmF1bHQ6ZmFsc2Vcbn0pO1xuIiwiaW1wb3J0IHtcbiAgdmFsdWVzLCBpbmNsdWRlcywgbWFwLCBjb25jYXQsIGlzRW1wdHksIHVuaXFXaXRoLCBzb21lLFxuICBmbGF0dGVuLCBmaWx0ZXIsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvblR5cGVzIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7XG4gICQsIGlzU29tZXRoaW5nLCBpbnNlbnNpdGl2ZUVxdWFscyxcbiAgaXNOb25FbXB0eVN0cmluZywgYXBpV3JhcHBlclN5bmMsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldE5vZGUgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5jb25zdCBpc0FsbG93ZWRUeXBlID0gdCA9PiAkKHBlcm1pc3Npb25UeXBlcywgW1xuICB2YWx1ZXMsXG4gIGluY2x1ZGVzKHQpLFxuXSk7XG5cbmNvbnN0IGlzUmVjb3JkT3JJbmRleFR5cGUgPSB0ID0+IHNvbWUocCA9PiBwID09PSB0KShbXG4gIHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfUkVDT1JELFxuICBwZXJtaXNzaW9uVHlwZXMuVVBEQVRFX1JFQ09SRCxcbiAgcGVybWlzc2lvblR5cGVzLkRFTEVURV9SRUNPUkQsXG4gIHBlcm1pc3Npb25UeXBlcy5SRUFEX1JFQ09SRCxcbiAgcGVybWlzc2lvblR5cGVzLlJFQURfSU5ERVgsXG4gIHBlcm1pc3Npb25UeXBlcy5FWEVDVVRFX0FDVElPTixcbl0pO1xuXG5cbmNvbnN0IHBlcm1pc3Npb25SdWxlcyA9IGFwcCA9PiAoW1xuICBtYWtlcnVsZSgndHlwZScsICd0eXBlIG11c3QgYmUgb25lIG9mIGFsbG93ZWQgdHlwZXMnLFxuICAgIHAgPT4gaXNBbGxvd2VkVHlwZShwLnR5cGUpKSxcbiAgbWFrZXJ1bGUoJ25vZGVLZXknLCAncmVjb3JkIGFuZCBpbmRleCBwZXJtaXNzaW9ucyBtdXN0IGluY2x1ZGUgYSB2YWxpZCBub2RlS2V5JyxcbiAgICBwID0+ICghaXNSZWNvcmRPckluZGV4VHlwZShwLnR5cGUpKVxuICAgICAgICAgICAgIHx8IGlzU29tZXRoaW5nKGdldE5vZGUoYXBwLmhpZXJhcmNoeSwgcC5ub2RlS2V5KSkpLFxuXSk7XG5cbmNvbnN0IGFwcGx5UGVybWlzc2lvblJ1bGVzID0gYXBwID0+IGFwcGx5UnVsZVNldChwZXJtaXNzaW9uUnVsZXMoYXBwKSk7XG5cbmNvbnN0IGFjY2Vzc0xldmVsUnVsZXMgPSBhbGxMZXZlbHMgPT4gKFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnbmFtZSBtdXN0IGJlIHNldCcsXG4gICAgbCA9PiBpc05vbkVtcHR5U3RyaW5nKGwubmFtZSkpLFxuICBtYWtlcnVsZSgnbmFtZScsICdhY2Nlc3MgbGV2ZWwgbmFtZXMgbXVzdCBiZSB1bmlxdWUnLFxuICAgIGwgPT4gaXNFbXB0eShsLm5hbWUpXG4gICAgICAgICAgICAgfHwgZmlsdGVyKGEgPT4gaW5zZW5zaXRpdmVFcXVhbHMobC5uYW1lLCBhLm5hbWUpKShhbGxMZXZlbHMpLmxlbmd0aCA9PT0gMSksXG5dKTtcblxuY29uc3QgYXBwbHlMZXZlbFJ1bGVzID0gYWxsTGV2ZWxzID0+IGFwcGx5UnVsZVNldChhY2Nlc3NMZXZlbFJ1bGVzKGFsbExldmVscykpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBY2Nlc3NMZXZlbCA9IGFwcCA9PiAoYWxsTGV2ZWxzLCBsZXZlbCkgPT4ge1xuICBjb25zdCBlcnJzID0gJChsZXZlbC5wZXJtaXNzaW9ucywgW1xuICAgIG1hcChhcHBseVBlcm1pc3Npb25SdWxlcyhhcHApKSxcbiAgICBmbGF0dGVuLFxuICAgIGNvbmNhdChcbiAgICAgIGFwcGx5TGV2ZWxSdWxlcyhhbGxMZXZlbHMpKGxldmVsKSxcbiAgICApLFxuICBdKTtcblxuICByZXR1cm4gZXJycztcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFjY2Vzc0xldmVscyA9IGFwcCA9PiBhbGxMZXZlbHMgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkudmFsaWRhdGVBY2Nlc3NMZXZlbHMsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgYWxsTGV2ZWxzIH0sXG4gIF92YWxpZGF0ZUFjY2Vzc0xldmVscywgYXBwLCBhbGxMZXZlbHMsXG4pO1xuXG5leHBvcnQgY29uc3QgX3ZhbGlkYXRlQWNjZXNzTGV2ZWxzID0gKGFwcCwgYWxsTGV2ZWxzKSA9PiAkKGFsbExldmVscywgW1xuICBtYXAobCA9PiB2YWxpZGF0ZUFjY2Vzc0xldmVsKGFwcCkoYWxsTGV2ZWxzLCBsKSksXG4gIGZsYXR0ZW4sXG4gIHVuaXFXaXRoKCh4LCB5KSA9PiB4LmZpZWxkID09PSB5LmZpZWxkXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB4Lml0ZW0gPT09IHkuaXRlbVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgeC5lcnJvciA9PT0geS5lcnJvciksXG5dKTtcbiIsImltcG9ydCB7IGpvaW4sIG1hcCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRMb2NrLCByZWxlYXNlTG9jaywgJCxcbiAgaXNOb2xvY2ssIGFwaVdyYXBwZXIsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIEFDQ0VTU19MRVZFTFNfTE9DS19GSUxFLFxuICBBQ0NFU1NfTEVWRUxTX0ZJTEUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyB2YWxpZGF0ZUFjY2Vzc0xldmVscyB9IGZyb20gJy4vdmFsaWRhdGVBY2Nlc3NMZXZlbHMnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3Qgc2F2ZUFjY2Vzc0xldmVscyA9IGFwcCA9PiBhc3luYyBhY2Nlc3NMZXZlbHMgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5zYXZlQWNjZXNzTGV2ZWxzLFxuICBwZXJtaXNzaW9uLndyaXRlQWNjZXNzTGV2ZWxzLmlzQXV0aG9yaXplZCxcbiAgeyBhY2Nlc3NMZXZlbHMgfSxcbiAgX3NhdmVBY2Nlc3NMZXZlbHMsIGFwcCwgYWNjZXNzTGV2ZWxzLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9zYXZlQWNjZXNzTGV2ZWxzID0gYXN5bmMgKGFwcCwgYWNjZXNzTGV2ZWxzKSA9PiB7XG4gIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0ZUFjY2Vzc0xldmVscyhhcHApKGFjY2Vzc0xldmVscy5sZXZlbHMpO1xuICBpZiAodmFsaWRhdGlvbkVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgZXJycyA9ICQodmFsaWRhdGlvbkVycm9ycywgW1xuICAgICAgbWFwKGUgPT4gZS5lcnJvciksXG4gICAgICBqb2luKCcsICcpLFxuICAgIF0pO1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBBY2Nlc3MgTGV2ZWxzIEludmFsaWQ6ICR7ZXJyc31gLFxuICAgICk7XG4gIH1cblxuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhcbiAgICBhcHAsIEFDQ0VTU19MRVZFTFNfTE9DS19GSUxFLCAyMDAwLCAyLFxuICApO1xuXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBnZXQgbG9jayB0byBzYXZlIGFjY2VzcyBsZXZlbHMnKTsgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKEFDQ0VTU19MRVZFTFNfRklMRSk7XG4gICAgaWYgKGV4aXN0aW5nLnZlcnNpb24gIT09IGFjY2Vzc0xldmVscy52ZXJzaW9uKSB7IHRocm93IG5ldyBFcnJvcignQWNjZXNzIGxldmVscyBoYXZlIGFscmVhZHkgYmVlbiB1cGRhdGVkLCBzaW5jZSB5b3UgbG9hZGVkJyk7IH1cblxuICAgIGFjY2Vzc0xldmVscy52ZXJzaW9uKys7XG5cbiAgICBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oQUNDRVNTX0xFVkVMU19GSUxFLCBhY2Nlc3NMZXZlbHMpO1xuICB9IGZpbmFsbHkge1xuICAgIGF3YWl0IHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBmaWx0ZXIsIHZhbHVlcywgZWFjaCwga2V5cyxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcbmltcG9ydCB7XG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgaXNJbmRleCwgaXNSZWNvcmQsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zID0gKGFwcCkgPT4ge1xuICBjb25zdCBhbGxOb2RlcyA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShhcHAuaGllcmFyY2h5KTtcbiAgY29uc3QgYWNjZXNzTGV2ZWwgPSB7IHBlcm1pc3Npb25zOiBbXSB9O1xuXG4gIGNvbnN0IHJlY29yZE5vZGVzID0gJChhbGxOb2RlcywgW1xuICAgIGZpbHRlcihpc1JlY29yZCksXG4gIF0pO1xuXG4gIGZvciAoY29uc3QgbiBvZiByZWNvcmROb2Rlcykge1xuICAgIHBlcm1pc3Npb24uY3JlYXRlUmVjb3JkLmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xuICAgIHBlcm1pc3Npb24udXBkYXRlUmVjb3JkLmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xuICAgIHBlcm1pc3Npb24uZGVsZXRlUmVjb3JkLmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xuICAgIHBlcm1pc3Npb24ucmVhZFJlY29yZC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcbiAgfVxuXG4gIGNvbnN0IGluZGV4Tm9kZXMgPSAkKGFsbE5vZGVzLCBbXG4gICAgZmlsdGVyKGlzSW5kZXgpLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IG4gb2YgaW5kZXhOb2Rlcykge1xuICAgIHBlcm1pc3Npb24ucmVhZEluZGV4LmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xuICB9XG5cbiAgZm9yIChjb25zdCBhIG9mIGtleXMoYXBwLmFjdGlvbnMpKSB7XG4gICAgcGVybWlzc2lvbi5leGVjdXRlQWN0aW9uLmFkZChhLCBhY2Nlc3NMZXZlbCk7XG4gIH1cblxuICAkKHBlcm1pc3Npb24sIFtcbiAgICB2YWx1ZXMsXG4gICAgZmlsdGVyKHAgPT4gIXAuaXNOb2RlKSxcbiAgICBlYWNoKHAgPT4gcC5hZGQoYWNjZXNzTGV2ZWwpKSxcbiAgXSk7XG5cbiAgcmV0dXJuIGFjY2Vzc0xldmVsLnBlcm1pc3Npb25zO1xufTtcbiIsImltcG9ydCB7IGRpZmZlcmVuY2UsIG1hcCwgam9pbiB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRMb2NrLCBpc05vbG9jaywgcmVsZWFzZUxvY2ssICQsXG4gIGFwaVdyYXBwZXIsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIFVTRVJTX0xPQ0tfRklMRSwgQUNDRVNTX0xFVkVMU19GSUxFLFxuICBnZXRVc2VyQnlOYW1lLCBVU0VSU19MSVNUX0ZJTEUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBzZXRVc2VyQWNjZXNzTGV2ZWxzID0gYXBwID0+IGFzeW5jICh1c2VyTmFtZSwgYWNjZXNzTGV2ZWxzKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLnNldFVzZXJBY2Nlc3NMZXZlbHMsXG4gIHBlcm1pc3Npb24uc2V0VXNlckFjY2Vzc0xldmVscy5pc0F1dGhvcml6ZWQsXG4gIHsgdXNlck5hbWUsIGFjY2Vzc0xldmVscyB9LFxuICBfc2V0VXNlckFjY2Vzc0xldmVscywgYXBwLCB1c2VyTmFtZSwgYWNjZXNzTGV2ZWxzLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9zZXRVc2VyQWNjZXNzTGV2ZWxzID0gYXN5bmMgKGFwcCwgdXNlcm5hbWUsIGFjY2Vzc0xldmVscykgPT4ge1xuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhhcHAsIFVTRVJTX0xPQ0tfRklMRSwgMTAwMCwgMSwgMCk7XG5cbiAgY29uc3QgYWN0dWFsQWNjZXNzTGV2ZWxzID0gJChcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKEFDQ0VTU19MRVZFTFNfRklMRSksXG4gICAgW1xuICAgICAgbCA9PiBsLmxldmVscyxcbiAgICAgIG1hcChsID0+IGwubmFtZSksXG4gICAgXSxcbiAgKTtcblxuICBjb25zdCBtaXNzaW5nID0gZGlmZmVyZW5jZShhY2Nlc3NMZXZlbHMpKGFjdHVhbEFjY2Vzc0xldmVscyk7XG4gIGlmIChtaXNzaW5nLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgYWNjZXNzIGxldmVscyBzdXBwbGllZDogJHtqb2luKCcsICcsIG1pc3NpbmcpfWApO1xuICB9XG5cbiAgaWYgKGlzTm9sb2NrKGxvY2spKSB7IHRocm93IG5ldyBFcnJvcignQ291bGQgc2V0IHVzZXIgYWNjZXNzIGxldmVscyBjYW5ub3QgZ2V0IGxvY2snKTsgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSk7XG4gICAgY29uc3QgdXNlciA9IGdldFVzZXJCeU5hbWUodXNlcnMsIHVzZXJuYW1lKTtcbiAgICBpZiAoIXVzZXIpIHsgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoYENvdWxkIG5vdCBmaW5kIHVzZXIgd2l0aCAke3VzZXJuYW1lfWApOyB9XG5cbiAgICB1c2VyLmFjY2Vzc0xldmVscyA9IGFjY2Vzc0xldmVscztcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oVVNFUlNfTElTVF9GSUxFLCB1c2Vycyk7XG4gIH0gZmluYWxseSB7XG4gICAgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIGF1dGhlbnRpY2F0ZSxcbiAgYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzLFxufSBmcm9tICcuL2F1dGhlbnRpY2F0ZSc7XG5pbXBvcnQgeyBjcmVhdGVUZW1wb3JhcnlBY2Nlc3MgfSBmcm9tICcuL2NyZWF0ZVRlbXBvcmFyeUFjY2Vzcyc7XG5pbXBvcnQgeyBjcmVhdGVVc2VyIH0gZnJvbSAnLi9jcmVhdGVVc2VyJztcbmltcG9ydCB7IGVuYWJsZVVzZXIsIGRpc2FibGVVc2VyIH0gZnJvbSAnLi9lbmFibGVVc2VyJztcbmltcG9ydCB7IGxvYWRBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL2xvYWRBY2Nlc3NMZXZlbHMnO1xuaW1wb3J0IHsgZ2V0TmV3QWNjZXNzTGV2ZWwgfSBmcm9tICcuL2dldE5ld0FjY2Vzc0xldmVsJztcbmltcG9ydCB7IGdldE5ld1VzZXIsIGdldE5ld1VzZXJBdXRoIH0gZnJvbSAnLi9nZXROZXdVc2VyJztcbmltcG9ydCB7IGdldFVzZXJzIH0gZnJvbSAnLi9nZXRVc2Vycyc7XG5pbXBvcnQgeyBpc0F1dGhvcml6ZWQgfSBmcm9tICcuL2lzQXV0aG9yaXplZCc7XG5pbXBvcnQgeyBzYXZlQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi9zYXZlQWNjZXNzTGV2ZWxzJztcbmltcG9ydCB7XG4gIGNoYW5nZU15UGFzc3dvcmQsXG4gIHNjb3JlUGFzc3dvcmQsIHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUsXG4gIGlzVmFsaWRQYXNzd29yZCxcbn0gZnJvbSAnLi9zZXRQYXNzd29yZCc7XG5pbXBvcnQgeyB2YWxpZGF0ZVVzZXIgfSBmcm9tICcuL3ZhbGlkYXRlVXNlcic7XG5pbXBvcnQgeyB2YWxpZGF0ZUFjY2Vzc0xldmVscyB9IGZyb20gJy4vdmFsaWRhdGVBY2Nlc3NMZXZlbHMnO1xuaW1wb3J0IHsgZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMgfSBmcm9tICcuL2dlbmVyYXRlRnVsbFBlcm1pc3Npb25zJztcbmltcG9ydCB7IHNldFVzZXJBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL3NldFVzZXJBY2Nlc3NMZXZlbHMnO1xuXG5leHBvcnQgY29uc3QgZ2V0QXV0aEFwaSA9IGFwcCA9PiAoe1xuICBhdXRoZW50aWNhdGU6IGF1dGhlbnRpY2F0ZShhcHApLFxuICBhdXRoZW50aWNhdGVUZW1wb3JhcnlBY2Nlc3M6IGF1dGhlbnRpY2F0ZVRlbXBvcmFyeUFjY2VzcyhhcHApLFxuICBjcmVhdGVUZW1wb3JhcnlBY2Nlc3M6IGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyhhcHApLFxuICBjcmVhdGVVc2VyOiBjcmVhdGVVc2VyKGFwcCksXG4gIGxvYWRBY2Nlc3NMZXZlbHM6IGxvYWRBY2Nlc3NMZXZlbHMoYXBwKSxcbiAgZW5hYmxlVXNlcjogZW5hYmxlVXNlcihhcHApLFxuICBkaXNhYmxlVXNlcjogZGlzYWJsZVVzZXIoYXBwKSxcbiAgZ2V0TmV3QWNjZXNzTGV2ZWw6IGdldE5ld0FjY2Vzc0xldmVsKGFwcCksXG4gIGdldE5ld1VzZXI6IGdldE5ld1VzZXIoYXBwKSxcbiAgZ2V0TmV3VXNlckF1dGg6IGdldE5ld1VzZXJBdXRoKGFwcCksXG4gIGdldFVzZXJzOiBnZXRVc2VycyhhcHApLFxuICBzYXZlQWNjZXNzTGV2ZWxzOiBzYXZlQWNjZXNzTGV2ZWxzKGFwcCksXG4gIGlzQXV0aG9yaXplZDogaXNBdXRob3JpemVkKGFwcCksXG4gIGNoYW5nZU15UGFzc3dvcmQ6IGNoYW5nZU15UGFzc3dvcmQoYXBwKSxcbiAgc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZTogc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZShhcHApLFxuICBzY29yZVBhc3N3b3JkLFxuICBpc1ZhbGlkUGFzc3dvcmQ6IGlzVmFsaWRQYXNzd29yZChhcHApLFxuICB2YWxpZGF0ZVVzZXI6IHZhbGlkYXRlVXNlcihhcHApLFxuICB2YWxpZGF0ZUFjY2Vzc0xldmVsczogdmFsaWRhdGVBY2Nlc3NMZXZlbHMoYXBwKSxcbiAgZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnM6ICgpID0+IGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zKGFwcCksXG4gIHNldFVzZXJBY2Nlc3NMZXZlbHM6IHNldFVzZXJBY2Nlc3NMZXZlbHMoYXBwKSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRBdXRoQXBpO1xuIiwiaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgYXBpV3JhcHBlclN5bmMgfSBmcm9tICcuLi9jb21tb24vYXBpV3JhcHBlcic7XG5pbXBvcnQgeyBldmVudHMgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcblxuZXhwb3J0IGNvbnN0IGV4ZWN1dGVBY3Rpb24gPSBhcHAgPT4gKGFjdGlvbk5hbWUsIG9wdGlvbnMpID0+IHtcbiAgYXBpV3JhcHBlclN5bmMoXG4gICAgYXBwLFxuICAgIGV2ZW50cy5hY3Rpb25zQXBpLmV4ZWN1dGUsXG4gICAgcGVybWlzc2lvbi5leGVjdXRlQWN0aW9uLmlzQXV0aG9yaXplZChhY3Rpb25OYW1lKSxcbiAgICB7IGFjdGlvbk5hbWUsIG9wdGlvbnMgfSxcbiAgICBhcHAuYWN0aW9uc1thY3Rpb25OYW1lXSwgb3B0aW9ucyxcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBfZXhlY3V0ZUFjdGlvbiA9IChiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb24sIG9wdGlvbnMpID0+IGJlaGF2aW91clNvdXJjZXNbYWN0aW9uLmJlaGF2aW91clNvdXJjZV1bYWN0aW9uLmJlaGF2aW91ck5hbWVdKG9wdGlvbnMpO1xuIiwiaW1wb3J0IHsgZXhlY3V0ZUFjdGlvbiB9IGZyb20gJy4vZXhlY3V0ZSc7XG5cbmV4cG9ydCBjb25zdCBnZXRBY3Rpb25zQXBpID0gYXBwID0+ICh7XG4gIGV4ZWN1dGU6IGV4ZWN1dGVBY3Rpb24oYXBwKSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRBY3Rpb25zQXBpO1xuIiwiaW1wb3J0IHsgaGFzIH0gZnJvbSAnbG9kYXNoL2ZwJztcblxuY29uc3QgcHVibGlzaCA9IGhhbmRsZXJzID0+IGFzeW5jIChldmVudE5hbWUsIGNvbnRleHQgPSB7fSkgPT4ge1xuICBpZiAoIWhhcyhldmVudE5hbWUpKGhhbmRsZXJzKSkgcmV0dXJuO1xuXG4gIGZvciAoY29uc3QgaGFuZGxlciBvZiBoYW5kbGVyc1tldmVudE5hbWVdKSB7XG4gICAgYXdhaXQgaGFuZGxlcihldmVudE5hbWUsIGNvbnRleHQpO1xuICB9XG59O1xuXG5jb25zdCBzdWJzY3JpYmUgPSBoYW5kbGVycyA9PiAoZXZlbnROYW1lLCBoYW5kbGVyKSA9PiB7XG4gIGlmICghaGFzKGV2ZW50TmFtZSkoaGFuZGxlcnMpKSB7XG4gICAgaGFuZGxlcnNbZXZlbnROYW1lXSA9IFtdO1xuICB9XG4gIGhhbmRsZXJzW2V2ZW50TmFtZV0ucHVzaChoYW5kbGVyKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVFdmVudEFnZ3JlZ2F0b3IgPSAoKSA9PiB7XG4gIGNvbnN0IGhhbmRsZXJzID0ge307XG4gIGNvbnN0IGV2ZW50QWdncmVnYXRvciA9ICh7XG4gICAgcHVibGlzaDogcHVibGlzaChoYW5kbGVycyksXG4gICAgc3Vic2NyaWJlOiBzdWJzY3JpYmUoaGFuZGxlcnMpLFxuICB9KTtcbiAgcmV0dXJuIGV2ZW50QWdncmVnYXRvcjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUV2ZW50QWdncmVnYXRvcjtcbiIsImltcG9ydCB7IHJldHJ5IH0gZnJvbSAnLi4vY29tbW9uL2luZGV4JztcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuY29uc3QgY3JlYXRlSnNvbiA9IG9yaWdpbmFsQ3JlYXRlRmlsZSA9PiBhc3luYyAoa2V5LCBvYmosIHJldHJpZXMgPSA1LCBkZWxheSA9IDUwMCkgPT4gYXdhaXQgcmV0cnkob3JpZ2luYWxDcmVhdGVGaWxlLCByZXRyaWVzLCBkZWxheSwga2V5LCBKU09OLnN0cmluZ2lmeShvYmopKTtcblxuY29uc3QgY3JlYXRlTmV3RmlsZSA9IG9yaWdpbmFsQ3JlYXRlRmlsZSA9PiBhc3luYyAocGF0aCwgY29udGVudCwgcmV0cmllcyA9IDUsIGRlbGF5ID0gNTAwKSA9PiBhd2FpdCByZXRyeShvcmlnaW5hbENyZWF0ZUZpbGUsIHJldHJpZXMsIGRlbGF5LCBwYXRoLCBjb250ZW50KTtcblxuY29uc3QgbG9hZEpzb24gPSBkYXRhc3RvcmUgPT4gYXN5bmMgKGtleSwgcmV0cmllcyA9IDUsIGRlbGF5ID0gNTAwKSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IHJldHJ5KEpTT04ucGFyc2UsIHJldHJpZXMsIGRlbGF5LCBhd2FpdCBkYXRhc3RvcmUubG9hZEZpbGUoa2V5KSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGVyci5tZXNzYWdlKTtcbiAgfVxufVxuXG5jb25zdCB1cGRhdGVKc29uID0gZGF0YXN0b3JlID0+IGFzeW5jIChrZXksIG9iaiwgcmV0cmllcyA9IDUsIGRlbGF5ID0gNTAwKSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IHJldHJ5KGRhdGFzdG9yZS51cGRhdGVGaWxlLCByZXRyaWVzLCBkZWxheSwga2V5LCBKU09OLnN0cmluZ2lmeShvYmopKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoZXJyLm1lc3NhZ2UpO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBzZXR1cERhdGFzdG9yZSA9IChkYXRhc3RvcmUpID0+IHtcbiAgY29uc3Qgb3JpZ2luYWxDcmVhdGVGaWxlID0gZGF0YXN0b3JlLmNyZWF0ZUZpbGU7XG4gIGRhdGFzdG9yZS5sb2FkSnNvbiA9IGxvYWRKc29uKGRhdGFzdG9yZSk7XG4gIGRhdGFzdG9yZS5jcmVhdGVKc29uID0gY3JlYXRlSnNvbihvcmlnaW5hbENyZWF0ZUZpbGUpO1xuICBkYXRhc3RvcmUudXBkYXRlSnNvbiA9IHVwZGF0ZUpzb24oZGF0YXN0b3JlKTtcbiAgZGF0YXN0b3JlLmNyZWF0ZUZpbGUgPSBjcmVhdGVOZXdGaWxlKG9yaWdpbmFsQ3JlYXRlRmlsZSk7XG4gIGlmIChkYXRhc3RvcmUuY3JlYXRlRW1wdHlEYikgeyBkZWxldGUgZGF0YXN0b3JlLmNyZWF0ZUVtcHR5RGI7IH1cbiAgcmV0dXJuIGRhdGFzdG9yZTtcbn07XG5cbmV4cG9ydCB7IGNyZWF0ZUV2ZW50QWdncmVnYXRvciB9IGZyb20gJy4vZXZlbnRBZ2dyZWdhdG9yJztcblxuZXhwb3J0IGRlZmF1bHQgc2V0dXBEYXRhc3RvcmU7XG4iLCJpbXBvcnQgeyBcbiAgY29tcGlsZUV4cHJlc3Npb24gYXMgY0V4cCwgXG4gIGNvbXBpbGVDb2RlIGFzIGNDb2RlIFxufSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XG5cbmV4cG9ydCBjb25zdCBjb21waWxlQ29kZSA9IGNvZGUgPT4ge1xuICBsZXQgZnVuYzsgIFxuICAgIFxuICB0cnkge1xuICAgIGZ1bmMgPSBjQ29kZShjb2RlKTtcbiAgfSBjYXRjaChlKSB7XG4gICAgZS5tZXNzYWdlID0gYEVycm9yIGNvbXBpbGluZyBjb2RlIDogJHtjb2RlfSA6ICR7ZS5tZXNzYWdlfWA7XG4gICAgdGhyb3cgZTtcbiAgfVxuXG4gIHJldHVybiBmdW5jO1xufVxuXG5leHBvcnQgY29uc3QgY29tcGlsZUV4cHJlc3Npb24gPSBjb2RlID0+IHtcbiAgbGV0IGZ1bmM7ICBcbiAgICAgIFxuICB0cnkge1xuICAgIGZ1bmMgPSBjRXhwKGNvZGUpO1xuICB9IGNhdGNoKGUpIHtcbiAgICBlLm1lc3NhZ2UgPSBgRXJyb3IgY29tcGlsaW5nIGV4cHJlc3Npb24gOiAke2NvZGV9IDogJHtlLm1lc3NhZ2V9YDtcbiAgICB0aHJvdyBlO1xuICB9XG4gIFxuICByZXR1cm4gZnVuYztcbn1cbiIsImltcG9ydCB7XG4gIGlzRnVuY3Rpb24sIGZpbHRlciwgbWFwLFxuICB1bmlxQnksIGtleXMsIGRpZmZlcmVuY2UsXG4gIGpvaW4sIHJlZHVjZSwgZmluZCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb21waWxlQ29kZSB9IGZyb20gJy4uL2NvbW1vbi9jb21waWxlQ29kZSc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IF9leGVjdXRlQWN0aW9uIH0gZnJvbSAnLi9leGVjdXRlJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciwgTm90Rm91bmRFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgaW5pdGlhbGlzZUFjdGlvbnMgPSAoc3Vic2NyaWJlLCBiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zLCB0cmlnZ2VycywgYXBpcykgPT4ge1xuICB2YWxpZGF0ZVNvdXJjZXMoYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucyk7XG4gIHN1YnNjcmliZVRyaWdnZXJzKHN1YnNjcmliZSwgYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucywgdHJpZ2dlcnMsIGFwaXMpO1xuICByZXR1cm4gY3JlYXRlQWN0aW9uc0NvbGxlY3Rpb24oYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucyk7XG59O1xuXG5jb25zdCBjcmVhdGVBY3Rpb25zQ29sbGVjdGlvbiA9IChiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zKSA9PiAkKGFjdGlvbnMsIFtcbiAgcmVkdWNlKChhbGwsIGEpID0+IHtcbiAgICBhbGxbYS5uYW1lXSA9IG9wdHMgPT4gX2V4ZWN1dGVBY3Rpb24oYmVoYXZpb3VyU291cmNlcywgYSwgb3B0cyk7XG4gICAgcmV0dXJuIGFsbDtcbiAgfSwge30pLFxuXSk7XG5cbmNvbnN0IHN1YnNjcmliZVRyaWdnZXJzID0gKHN1YnNjcmliZSwgYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucywgdHJpZ2dlcnMsIGFwaXMpID0+IHtcbiAgY29uc3QgY3JlYXRlT3B0aW9ucyA9IChvcHRpb25zQ3JlYXRvciwgZXZlbnRDb250ZXh0KSA9PiB7XG4gICAgaWYgKCFvcHRpb25zQ3JlYXRvcikgcmV0dXJuIHt9O1xuICAgIGNvbnN0IGNyZWF0ZSA9IGNvbXBpbGVDb2RlKG9wdGlvbnNDcmVhdG9yKTtcbiAgICByZXR1cm4gY3JlYXRlKHsgY29udGV4dDogZXZlbnRDb250ZXh0LCBhcGlzIH0pO1xuICB9O1xuXG4gIGNvbnN0IHNob3VsZFJ1blRyaWdnZXIgPSAodHJpZ2dlciwgZXZlbnRDb250ZXh0KSA9PiB7XG4gICAgaWYgKCF0cmlnZ2VyLmNvbmRpdGlvbikgcmV0dXJuIHRydWU7XG4gICAgY29uc3Qgc2hvdWxkUnVuID0gY29tcGlsZUV4cHJlc3Npb24odHJpZ2dlci5jb25kaXRpb24pO1xuICAgIHJldHVybiBzaG91bGRSdW4oeyBjb250ZXh0OiBldmVudENvbnRleHQgfSk7XG4gIH07XG5cbiAgZm9yIChsZXQgdHJpZyBvZiB0cmlnZ2Vycykge1xuICAgIHN1YnNjcmliZSh0cmlnLmV2ZW50TmFtZSwgYXN5bmMgKGV2LCBjdHgpID0+IHtcbiAgICAgIGlmIChzaG91bGRSdW5UcmlnZ2VyKHRyaWcsIGN0eCkpIHtcbiAgICAgICAgYXdhaXQgX2V4ZWN1dGVBY3Rpb24oXG4gICAgICAgICAgYmVoYXZpb3VyU291cmNlcyxcbiAgICAgICAgICBmaW5kKGEgPT4gYS5uYW1lID09PSB0cmlnLmFjdGlvbk5hbWUpKGFjdGlvbnMpLFxuICAgICAgICAgIGNyZWF0ZU9wdGlvbnModHJpZy5vcHRpb25zQ3JlYXRvciwgY3R4KSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufTtcblxuY29uc3QgdmFsaWRhdGVTb3VyY2VzID0gKGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMpID0+IHtcbiAgY29uc3QgZGVjbGFyZWRTb3VyY2VzID0gJChhY3Rpb25zLCBbXG4gICAgdW5pcUJ5KGEgPT4gYS5iZWhhdmlvdXJTb3VyY2UpLFxuICAgIG1hcChhID0+IGEuYmVoYXZpb3VyU291cmNlKSxcbiAgXSk7XG5cbiAgY29uc3Qgc3VwcGxpZWRTb3VyY2VzID0ga2V5cyhiZWhhdmlvdXJTb3VyY2VzKTtcblxuICBjb25zdCBtaXNzaW5nU291cmNlcyA9IGRpZmZlcmVuY2UoXG4gICAgZGVjbGFyZWRTb3VyY2VzLCBzdXBwbGllZFNvdXJjZXMsXG4gICk7XG5cbiAgaWYgKG1pc3NpbmdTb3VyY2VzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBEZWNsYXJlZCBiZWhhdmlvdXIgc291cmNlcyBhcmUgbm90IHN1cHBsaWVkOiAke2pvaW4oJywgJywgbWlzc2luZ1NvdXJjZXMpfWApO1xuICB9XG5cbiAgY29uc3QgbWlzc2luZ0JlaGF2aW91cnMgPSAkKGFjdGlvbnMsIFtcbiAgICBmaWx0ZXIoYSA9PiAhaXNGdW5jdGlvbihiZWhhdmlvdXJTb3VyY2VzW2EuYmVoYXZpb3VyU291cmNlXVthLmJlaGF2aW91ck5hbWVdKSksXG4gICAgbWFwKGEgPT4gYEFjdGlvbjogJHthLm5hbWV9IDogJHthLmJlaGF2aW91clNvdXJjZX0uJHthLmJlaGF2aW91ck5hbWV9YCksXG4gIF0pO1xuXG4gIGlmIChtaXNzaW5nQmVoYXZpb3Vycy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoYE1pc3NpbmcgYmVoYXZpb3VyczogY291bGQgbm90IGZpbmQgYmVoYXZpb3VyIGZ1bmN0aW9uczogJHtqb2luKCcsICcsIG1pc3NpbmdCZWhhdmlvdXJzKX1gKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIG1hcCwgZmlsdGVyLCBncm91cEJ5LCBzcGxpdCxcbiAgc29tZSwgZmluZCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIExPQ0tfRklMRU5BTUUsIFRSQU5TQUNUSU9OU19GT0xERVIsIGlkU2VwLCBpc1VwZGF0ZSxcbiAgbm9kZUtleUhhc2hGcm9tQnVpbGRGb2xkZXIsIGlzQnVpbGRJbmRleEZvbGRlciwgZ2V0VHJhbnNhY3Rpb25JZCxcbiAgaXNEZWxldGUsIGlzQ3JlYXRlLFxufSBmcm9tICcuL3RyYW5zYWN0aW9uc0NvbW1vbic7XG5pbXBvcnQge1xuICBqb2luS2V5LCAkLCBub25lLCBpc1NvbWV0aGluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldExhc3RQYXJ0SW5LZXksIGdldE5vZGVGcm9tTm9kZUtleUhhc2ggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgX2xvYWQgfSBmcm9tICcuLi9yZWNvcmRBcGkvbG9hZCc7XG5cbmV4cG9ydCBjb25zdCByZXRyaWV2ZSA9IGFzeW5jIChhcHApID0+IHtcbiAgY29uc3QgdHJhbnNhY3Rpb25GaWxlcyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0Rm9sZGVyQ29udGVudHMoXG4gICAgVFJBTlNBQ1RJT05TX0ZPTERFUixcbiAgKTtcblxuICBsZXQgdHJhbnNhY3Rpb25zID0gW107XG5cbiAgaWYgKHNvbWUoaXNCdWlsZEluZGV4Rm9sZGVyKSh0cmFuc2FjdGlvbkZpbGVzKSkge1xuICAgIGNvbnN0IGJ1aWxkSW5kZXhGb2xkZXIgPSBmaW5kKGlzQnVpbGRJbmRleEZvbGRlcikodHJhbnNhY3Rpb25GaWxlcyk7XG5cbiAgICB0cmFuc2FjdGlvbnMgPSBhd2FpdCByZXRyaWV2ZUJ1aWxkSW5kZXhUcmFuc2FjdGlvbnMoXG4gICAgICBhcHAsXG4gICAgICBqb2luS2V5KFRSQU5TQUNUSU9OU19GT0xERVIsIGJ1aWxkSW5kZXhGb2xkZXIpLFxuICAgICk7XG4gIH1cblxuICBpZiAodHJhbnNhY3Rpb25zLmxlbmd0aCA+IDApIHJldHVybiB0cmFuc2FjdGlvbnM7XG5cbiAgcmV0dXJuIGF3YWl0IHJldHJpZXZlU3RhbmRhcmRUcmFuc2FjdGlvbnMoXG4gICAgYXBwLCB0cmFuc2FjdGlvbkZpbGVzLFxuICApO1xufTtcblxuY29uc3QgcmV0cmlldmVCdWlsZEluZGV4VHJhbnNhY3Rpb25zID0gYXN5bmMgKGFwcCwgYnVpbGRJbmRleEZvbGRlcikgPT4ge1xuICBjb25zdCBjaGlsZEZvbGRlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZvbGRlckNvbnRlbnRzKGJ1aWxkSW5kZXhGb2xkZXIpO1xuICBpZiAoY2hpbGRGb2xkZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgIC8vIGNsZWFudXBcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihidWlsZEluZGV4Rm9sZGVyKTtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCBnZXRUcmFuc2FjdGlvbkZpbGVzID0gYXN5bmMgKGNoaWxkRm9sZGVySW5kZXggPSAwKSA9PiB7XG4gICAgaWYgKGNoaWxkRm9sZGVySW5kZXggPj0gY2hpbGRGb2xkZXJzLmxlbmd0aCkgcmV0dXJuIFtdO1xuXG4gICAgY29uc3QgY2hpbGRGb2xkZXJLZXkgPSBqb2luS2V5KGJ1aWxkSW5kZXhGb2xkZXIsIGNoaWxkRm9sZGVyc1tjaGlsZEZvbGRlckluZGV4XSk7XG4gICAgY29uc3QgZmlsZXMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZvbGRlckNvbnRlbnRzKFxuICAgICAgY2hpbGRGb2xkZXJLZXksXG4gICAgKTtcblxuICAgIGlmIChmaWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKGNoaWxkRm9sZGVyS2V5KTtcbiAgICAgIHJldHVybiBhd2FpdCBnZXRUcmFuc2FjdGlvbkZpbGVzKGNoaWxkRm9sZGVySW5kZXggKyAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBjaGlsZEZvbGRlcktleSwgZmlsZXMgfTtcbiAgfTtcblxuICBjb25zdCB0cmFuc2FjdGlvbkZpbGVzID0gYXdhaXQgZ2V0VHJhbnNhY3Rpb25GaWxlcygpO1xuXG4gIGlmICh0cmFuc2FjdGlvbkZpbGVzLmZpbGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IHRyYW5zYWN0aW9ucyA9ICQodHJhbnNhY3Rpb25GaWxlcy5maWxlcywgW1xuICAgIG1hcChwYXJzZVRyYW5zYWN0aW9uSWQpLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IHQgb2YgdHJhbnNhY3Rpb25zKSB7XG4gICAgY29uc3QgdHJhbnNhY3Rpb25Db250ZW50ID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICAgIGpvaW5LZXkoXG4gICAgICAgIHRyYW5zYWN0aW9uRmlsZXMuY2hpbGRGb2xkZXJLZXksXG4gICAgICAgIHQuZnVsbElkLFxuICAgICAgKSxcbiAgICApO1xuICAgIHQucmVjb3JkID0gYXdhaXQgX2xvYWQoYXBwLCB0cmFuc2FjdGlvbkNvbnRlbnQucmVjb3JkS2V5KTtcbiAgfVxuXG4gIHRyYW5zYWN0aW9ucy5pbmRleE5vZGUgPSAkKGJ1aWxkSW5kZXhGb2xkZXIsIFtcbiAgICBnZXRMYXN0UGFydEluS2V5LFxuICAgIG5vZGVLZXlIYXNoRnJvbUJ1aWxkRm9sZGVyLFxuICAgIGdldE5vZGVGcm9tTm9kZUtleUhhc2goYXBwLmhpZXJhcmNoeSksXG4gIF0pO1xuXG4gIHRyYW5zYWN0aW9ucy5mb2xkZXJLZXkgPSB0cmFuc2FjdGlvbkZpbGVzLmNoaWxkRm9sZGVyS2V5O1xuXG4gIHJldHVybiB0cmFuc2FjdGlvbnM7XG59O1xuXG5jb25zdCByZXRyaWV2ZVN0YW5kYXJkVHJhbnNhY3Rpb25zID0gYXN5bmMgKGFwcCwgdHJhbnNhY3Rpb25GaWxlcykgPT4ge1xuICBjb25zdCB0cmFuc2FjdGlvbklkcyA9ICQodHJhbnNhY3Rpb25GaWxlcywgW1xuICAgIGZpbHRlcihmID0+IGYgIT09IExPQ0tfRklMRU5BTUVcbiAgICAgICAgICAgICAgICAgICAgJiYgIWlzQnVpbGRJbmRleEZvbGRlcihmKSksXG4gICAgbWFwKHBhcnNlVHJhbnNhY3Rpb25JZCksXG4gIF0pO1xuXG4gIGNvbnN0IHRyYW5zYWN0aW9uSWRzQnlSZWNvcmQgPSAkKHRyYW5zYWN0aW9uSWRzLCBbXG4gICAgZ3JvdXBCeSgncmVjb3JkSWQnKSxcbiAgXSk7XG5cbiAgY29uc3QgZGVkdXBlZFRyYW5zYWN0aW9ucyA9IFtdO1xuXG4gIGNvbnN0IHZlcmlmeSA9IGFzeW5jICh0KSA9PiB7XG4gICAgaWYgKHQudmVyaWZpZWQgPT09IHRydWUpIHJldHVybiB0O1xuXG4gICAgY29uc3QgaWQgPSBnZXRUcmFuc2FjdGlvbklkKFxuICAgICAgdC5yZWNvcmRJZCxcbiAgICAgIHQudHJhbnNhY3Rpb25UeXBlLFxuICAgICAgdC51bmlxdWVJZCxcbiAgICApO1xuXG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgICAgam9pbktleShUUkFOU0FDVElPTlNfRk9MREVSLCBpZCksXG4gICAgKTtcblxuICAgIGlmIChpc0RlbGV0ZSh0KSkge1xuICAgICAgdC5yZWNvcmQgPSB0cmFuc2FjdGlvbi5yZWNvcmQ7XG4gICAgICB0LnZlcmlmaWVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0O1xuICAgIH1cblxuICAgIGNvbnN0IHJlYyA9IGF3YWl0IF9sb2FkKFxuICAgICAgYXBwLFxuICAgICAgdHJhbnNhY3Rpb24ucmVjb3JkS2V5LFxuICAgICk7XG4gICAgaWYgKHJlYy50cmFuc2FjdGlvbklkID09PSBpZCkge1xuICAgICAgdC5yZWNvcmQgPSByZWM7XG4gICAgICBpZiAodHJhbnNhY3Rpb24ub2xkUmVjb3JkKSB7IHQub2xkUmVjb3JkID0gdHJhbnNhY3Rpb24ub2xkUmVjb3JkOyB9XG4gICAgICB0LnZlcmlmaWVkID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdC52ZXJpZmllZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0O1xuICB9O1xuXG4gIGNvbnN0IHBpY2tPbmUgPSBhc3luYyAodHJhbnMsIGZvclR5cGUpID0+IHtcbiAgICBjb25zdCB0cmFuc0ZvclR5cGUgPSBmaWx0ZXIoZm9yVHlwZSkodHJhbnMpO1xuICAgIGlmICh0cmFuc0ZvclR5cGUubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCB0ID0gYXdhaXQgdmVyaWZ5KHRyYW5zRm9yVHlwZVswXSk7XG4gICAgICByZXR1cm4gKHQudmVyaWZpZWQgPT09IHRydWUgPyB0IDogbnVsbCk7XG4gICAgfVxuICAgIGZvciAobGV0IHQgb2YgdHJhbnNGb3JUeXBlKSB7XG4gICAgICB0ID0gYXdhaXQgdmVyaWZ5KHQpO1xuICAgICAgaWYgKHQudmVyaWZpZWQgPT09IHRydWUpIHsgcmV0dXJuIHQ7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICBmb3IgKGNvbnN0IHJlY29yZElkIGluIHRyYW5zYWN0aW9uSWRzQnlSZWNvcmQpIHtcbiAgICBjb25zdCB0cmFuc0lkc0ZvclJlY29yZCA9IHRyYW5zYWN0aW9uSWRzQnlSZWNvcmRbcmVjb3JkSWRdO1xuICAgIGlmICh0cmFuc0lkc0ZvclJlY29yZC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNvbnN0IHQgPSBhd2FpdCB2ZXJpZnkodHJhbnNJZHNGb3JSZWNvcmRbMF0pO1xuICAgICAgaWYgKHQudmVyaWZpZWQpIHsgZGVkdXBlZFRyYW5zYWN0aW9ucy5wdXNoKHQpOyB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHNvbWUoaXNEZWxldGUpKHRyYW5zSWRzRm9yUmVjb3JkKSkge1xuICAgICAgY29uc3QgdCA9IGF3YWl0IHZlcmlmeShmaW5kKGlzRGVsZXRlKSh0cmFuc0lkc0ZvclJlY29yZCkpO1xuICAgICAgaWYgKHQudmVyaWZpZWQpIHsgZGVkdXBlZFRyYW5zYWN0aW9ucy5wdXNoKHQpOyB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHNvbWUoaXNVcGRhdGUpKHRyYW5zSWRzRm9yUmVjb3JkKSkge1xuICAgICAgY29uc3QgdXBkID0gYXdhaXQgcGlja09uZSh0cmFuc0lkc0ZvclJlY29yZCwgaXNVcGRhdGUpO1xuICAgICAgaWYgKGlzU29tZXRoaW5nKHVwZCkgJiYgdXBkLnZlcmlmaWVkKSB7IGRlZHVwZWRUcmFuc2FjdGlvbnMucHVzaCh1cGQpOyB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHNvbWUoaXNDcmVhdGUpKHRyYW5zSWRzRm9yUmVjb3JkKSkge1xuICAgICAgY29uc3QgY3JlID0gYXdhaXQgcGlja09uZSh0cmFuc0lkc0ZvclJlY29yZCwgaXNDcmVhdGUpO1xuICAgICAgaWYgKGlzU29tZXRoaW5nKGNyZSkpIHsgZGVkdXBlZFRyYW5zYWN0aW9ucy5wdXNoKGNyZSk7IH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGR1cGxpY2F0ZXMgPSAkKHRyYW5zYWN0aW9uSWRzLCBbXG4gICAgZmlsdGVyKHQgPT4gbm9uZShkZHQgPT4gZGR0LnVuaXF1ZUlkID09PSB0LnVuaXF1ZUlkKShkZWR1cGVkVHJhbnNhY3Rpb25zKSksXG4gIF0pO1xuXG5cbiAgY29uc3QgZGVsZXRlUHJvbWlzZXMgPSBtYXAodCA9PiBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoXG4gICAgam9pbktleShcbiAgICAgIFRSQU5TQUNUSU9OU19GT0xERVIsXG4gICAgICBnZXRUcmFuc2FjdGlvbklkKFxuICAgICAgICB0LnJlY29yZElkLFxuICAgICAgICB0LnRyYW5zYWN0aW9uVHlwZSxcbiAgICAgICAgdC51bmlxdWVJZCxcbiAgICAgICksXG4gICAgKSxcbiAgKSkoZHVwbGljYXRlcyk7XG5cbiAgYXdhaXQgUHJvbWlzZS5hbGwoZGVsZXRlUHJvbWlzZXMpO1xuXG4gIHJldHVybiBkZWR1cGVkVHJhbnNhY3Rpb25zO1xufTtcblxuY29uc3QgcGFyc2VUcmFuc2FjdGlvbklkID0gKGlkKSA9PiB7XG4gIGNvbnN0IHNwbGl0SWQgPSBzcGxpdChpZFNlcCkoaWQpO1xuICByZXR1cm4gKHtcbiAgICByZWNvcmRJZDogc3BsaXRJZFswXSxcbiAgICB0cmFuc2FjdGlvblR5cGU6IHNwbGl0SWRbMV0sXG4gICAgdW5pcXVlSWQ6IHNwbGl0SWRbMl0sXG4gICAgZnVsbElkOiBpZCxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgb3JkZXJCeSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICByZWR1Y2UsIGZpbmQsIGluY2x1ZGVzLCBmbGF0dGVuLCB1bmlvbixcbiAgZmlsdGVyLCBlYWNoLCBtYXAsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBqb2luS2V5LCBzcGxpdEtleSwgaXNOb25FbXB0eVN0cmluZyxcbiAgaXNOb3RoaW5nLCAkLCBpc1NvbWV0aGluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSwgZ2V0Tm9kZSwgZ2V0UmVjb3JkTm9kZUlkLFxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLCByZWNvcmROb2RlSWRJc0FsbG93ZWQsXG4gIGlzUmVjb3JkLCBpc0dsb2JhbEluZGV4LFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgaW5kZXhUeXBlcyB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2luZGV4ZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVsZXZhbnRBbmNlc3RvckluZGV4ZXMgPSAoYXBwSGllcmFyY2h5LCByZWNvcmQpID0+IHtcbiAgY29uc3Qga2V5ID0gcmVjb3JkLmtleTtcbiAgY29uc3Qga2V5UGFydHMgPSBzcGxpdEtleShrZXkpO1xuICBjb25zdCBub2RlSWQgPSBnZXRSZWNvcmROb2RlSWQoa2V5KTtcblxuICBjb25zdCBmbGF0SGllcmFyY2h5ID0gb3JkZXJCeShnZXRGbGF0dGVuZWRIaWVyYXJjaHkoYXBwSGllcmFyY2h5KSxcbiAgICBbbm9kZSA9PiBub2RlLnBhdGhSZWd4KCkubGVuZ3RoXSxcbiAgICBbJ2Rlc2MnXSk7XG5cbiAgY29uc3QgbWFrZWluZGV4Tm9kZUFuZEtleV9Gb3JBbmNlc3RvckluZGV4ID0gKGluZGV4Tm9kZSwgaW5kZXhLZXkpID0+IG1ha2VJbmRleE5vZGVBbmRLZXkoaW5kZXhOb2RlLCBqb2luS2V5KGluZGV4S2V5LCBpbmRleE5vZGUubmFtZSkpO1xuXG4gIGNvbnN0IHRyYXZlcnNlQW5jZXN0b3JJbmRleGVzSW5QYXRoID0gKCkgPT4gcmVkdWNlKChhY2MsIHBhcnQpID0+IHtcbiAgICBjb25zdCBjdXJyZW50SW5kZXhLZXkgPSBqb2luS2V5KGFjYy5sYXN0SW5kZXhLZXksIHBhcnQpO1xuICAgIGFjYy5sYXN0SW5kZXhLZXkgPSBjdXJyZW50SW5kZXhLZXk7XG4gICAgY29uc3QgdGVzdFBhdGhSZWd4ID0gcCA9PiBuZXcgUmVnRXhwKGAke3AucGF0aFJlZ3goKX0kYCkudGVzdChjdXJyZW50SW5kZXhLZXkpO1xuICAgIGNvbnN0IG5vZGVNYXRjaCA9IGZpbmQodGVzdFBhdGhSZWd4KShmbGF0SGllcmFyY2h5KTtcblxuICAgIGlmIChpc05vdGhpbmcobm9kZU1hdGNoKSkgeyByZXR1cm4gYWNjOyB9XG5cbiAgICBpZiAoIWlzUmVjb3JkKG5vZGVNYXRjaClcbiAgICAgICAgICAgICAgICB8fCBub2RlTWF0Y2guaW5kZXhlcy5sZW5ndGggPT09IDApIHsgcmV0dXJuIGFjYzsgfVxuXG4gICAgY29uc3QgaW5kZXhlcyA9ICQobm9kZU1hdGNoLmluZGV4ZXMsIFtcbiAgICAgIGZpbHRlcihpID0+IGkuaW5kZXhUeXBlID09PSBpbmRleFR5cGVzLmFuY2VzdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAoaS5hbGxvd2VkUmVjb3JkTm9kZUlkcy5sZW5ndGggPT09IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICB8fCBpbmNsdWRlcyhub2RlSWQpKGkuYWxsb3dlZFJlY29yZE5vZGVJZHMpKSksXG4gICAgXSk7XG5cbiAgICBlYWNoKHYgPT4gYWNjLm5vZGVzQW5kS2V5cy5wdXNoKFxuICAgICAgbWFrZWluZGV4Tm9kZUFuZEtleV9Gb3JBbmNlc3RvckluZGV4KHYsIGN1cnJlbnRJbmRleEtleSksXG4gICAgKSkoaW5kZXhlcyk7XG5cbiAgICByZXR1cm4gYWNjO1xuICB9LCB7IGxhc3RJbmRleEtleTogJycsIG5vZGVzQW5kS2V5czogW10gfSkoa2V5UGFydHMpLm5vZGVzQW5kS2V5cztcblxuICBjb25zdCByb290SW5kZXhlcyA9ICQoZmxhdEhpZXJhcmNoeSwgW1xuICAgIGZpbHRlcihuID0+IGlzR2xvYmFsSW5kZXgobikgJiYgcmVjb3JkTm9kZUlkSXNBbGxvd2VkKG4pKG5vZGVJZCkpLFxuICAgIG1hcChpID0+IG1ha2VJbmRleE5vZGVBbmRLZXkoaSwgaS5ub2RlS2V5KCkpKSxcbiAgXSk7XG5cbiAgcmV0dXJuIHVuaW9uKHRyYXZlcnNlQW5jZXN0b3JJbmRleGVzSW5QYXRoKCkpKHJvb3RJbmRleGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRSZWxldmFudFJldmVyc2VSZWZlcmVuY2VJbmRleGVzID0gKGFwcEhpZXJhcmNoeSwgcmVjb3JkKSA9PiAkKHJlY29yZC5rZXksIFtcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHBIaWVyYXJjaHkpLFxuICBuID0+IG4uZmllbGRzLFxuICBmaWx0ZXIoZiA9PiBmLnR5cGUgPT09ICdyZWZlcmVuY2UnXG4gICAgICAgICAgICAgICAgICAgICYmIGlzU29tZXRoaW5nKHJlY29yZFtmLm5hbWVdKVxuICAgICAgICAgICAgICAgICAgICAmJiBpc05vbkVtcHR5U3RyaW5nKHJlY29yZFtmLm5hbWVdLmtleSkpLFxuICBtYXAoZiA9PiAkKGYudHlwZU9wdGlvbnMucmV2ZXJzZUluZGV4Tm9kZUtleXMsIFtcbiAgICBtYXAobiA9PiAoe1xuICAgICAgcmVjb3JkTm9kZTogZ2V0Tm9kZShhcHBIaWVyYXJjaHksIG4pLFxuICAgICAgZmllbGQ6IGYsXG4gICAgfSkpLFxuICBdKSksXG4gIGZsYXR0ZW4sXG4gIG1hcChuID0+IG1ha2VJbmRleE5vZGVBbmRLZXkoXG4gICAgbi5yZWNvcmROb2RlLFxuICAgIGpvaW5LZXkocmVjb3JkW24uZmllbGQubmFtZV0ua2V5LCBuLnJlY29yZE5vZGUubmFtZSksXG4gICkpLFxuXSk7XG5cbmNvbnN0IG1ha2VJbmRleE5vZGVBbmRLZXkgPSAoaW5kZXhOb2RlLCBpbmRleEtleSkgPT4gKHsgaW5kZXhOb2RlLCBpbmRleEtleSB9KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmVsZXZhbnRBbmNlc3RvckluZGV4ZXM7XG4iLCIgIC8vIGFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZGV4NGVyL2pzLXByb21pc2Utd3JpdGFibGVcbiAgLy8gVGhhbmsgeW91IDopIFxuICBleHBvcnQgY29uc3QgcHJvbWlzZVdyaXRlYWJsZVN0cmVhbSA9IHN0cmVhbSA9PiB7XG4gIFxuICAgIGxldCBfZXJyb3JlZDtcbiAgXG4gICAgY29uc3QgX2Vycm9ySGFuZGxlciA9IGVyciA9PiB7XG4gICAgICAgIF9lcnJvcmVkID0gZXJyO1xuICAgIH07XG5cbiAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBfZXJyb3JIYW5kbGVyKTsgICAgXG4gIFxuICAgIGNvbnN0IHdyaXRlID0gY2h1bmsgPT4geyAgXG4gICAgICBsZXQgcmVqZWN0ZWQgPSBmYWxzZTtcbiAgXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoX2Vycm9yZWQpIHtcbiAgICAgICAgICBjb25zdCBlcnIgPSBfZXJyb3JlZDtcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGlmICghc3RyZWFtLndyaXRhYmxlIHx8IHN0cmVhbS5jbG9zZWQgfHwgc3RyZWFtLmRlc3Ryb3llZCkge1xuICAgICAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKFwid3JpdGUgYWZ0ZXIgZW5kXCIpKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3Qgd3JpdGVFcnJvckhhbmRsZXIgPSBlcnIgPT4ge1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJlamVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgc3RyZWFtLm9uY2UoXCJlcnJvclwiLCB3cml0ZUVycm9ySGFuZGxlcik7XG4gIFxuICAgICAgICBjb25zdCBjYW5Xcml0ZSA9IHN0cmVhbS53cml0ZShjaHVuayk7XG4gIFxuICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCB3cml0ZUVycm9ySGFuZGxlcik7XG4gIFxuICAgICAgICBpZiAoY2FuV3JpdGUpIHtcbiAgICAgICAgICBpZiAoIXJlamVjdGVkKSB7XG4gICAgICAgICAgICByZXNvbHZlKGNodW5rLmxlbmd0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IGVyciA9PiB7XG4gICAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICBjb25zdCBkcmFpbkhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHJlc29sdmUoY2h1bmsubGVuZ3RoKTtcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIGNvbnN0IGNsb3NlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVzb2x2ZShjaHVuay5sZW5ndGgpO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgY29uc3QgZmluaXNoSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVzb2x2ZShjaHVuay5sZW5ndGgpO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgY29uc3QgcmVtb3ZlTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiY2xvc2VcIiwgY2xvc2VIYW5kbGVyKTtcbiAgICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImRyYWluXCIsIGRyYWluSGFuZGxlcik7XG4gICAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xuICAgICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZmluaXNoXCIsIGZpbmlzaEhhbmRsZXIpO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgc3RyZWFtLm9uKFwiY2xvc2VcIiwgY2xvc2VIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ub24oXCJkcmFpblwiLCBkcmFpbkhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5vbihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gICAgICAgICAgc3RyZWFtLm9uKFwiZmluaXNoXCIsIGZpbmlzaEhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgXG4gICAgY29uc3QgZW5kID0gKCkgPT4ge1xuICBcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGlmIChfZXJyb3JlZCkge1xuICAgICAgICAgIGNvbnN0IGVyciA9IF9lcnJvcmVkO1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgaWYgKCFzdHJlYW0ud3JpdGFibGUgfHwgc3RyZWFtLmNsb3NlZCB8fCBzdHJlYW0uZGVzdHJveWVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgZmluaXNoSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IChlcnIpID0+IHtcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgcmVtb3ZlTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZmluaXNoXCIsIGZpbmlzaEhhbmRsZXIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBzdHJlYW0ub24oXCJmaW5pc2hcIiwgZmluaXNoSGFuZGxlcik7XG4gICAgICAgIHN0cmVhbS5vbihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gIFxuICAgICAgICBzdHJlYW0uZW5kKCk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiB7d3JpdGUsIGVuZH07XG4gIH1cbiAgXG4gIGV4cG9ydCBkZWZhdWx0IHByb21pc2VXcml0ZWFibGVTdHJlYW1cbiAgIiwiaW1wb3J0IHsgZW5zdXJlU2hhcmROYW1lSXNJblNoYXJkTWFwIH0gZnJvbSAnLi9zaGFyZGluZyc7XG5pbXBvcnQgeyBnZXRJbmRleFdyaXRlciB9IGZyb20gJy4vc2VyaWFsaXplcic7XG5pbXBvcnQgeyBpc1NoYXJkZWRJbmRleCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge3Byb21pc2VXcml0ZWFibGVTdHJlYW19IGZyb20gXCIuL3Byb21pc2VXcml0YWJsZVN0cmVhbVwiO1xuaW1wb3J0IHtwcm9taXNlUmVhZGFibGVTdHJlYW19IGZyb20gXCIuL3Byb21pc2VSZWFkYWJsZVN0cmVhbVwiO1xuXG5leHBvcnQgY29uc3QgYXBwbHlUb1NoYXJkID0gYXN5bmMgKGhpZXJhcmNoeSwgc3RvcmUsIGluZGV4S2V5LFxuICBpbmRleE5vZGUsIGluZGV4U2hhcmRLZXksIHJlY29yZHNUb1dyaXRlLCBrZXlzVG9SZW1vdmUpID0+IHtcbiAgY29uc3QgY3JlYXRlSWZOb3RFeGlzdHMgPSByZWNvcmRzVG9Xcml0ZS5sZW5ndGggPiAwO1xuICBjb25zdCB3cml0ZXIgPSBhd2FpdCBnZXRXcml0ZXIoaGllcmFyY2h5LCBzdG9yZSwgaW5kZXhLZXksIGluZGV4U2hhcmRLZXksIGluZGV4Tm9kZSwgY3JlYXRlSWZOb3RFeGlzdHMpO1xuICBpZiAod3JpdGVyID09PSBTSEFSRF9ERUxFVEVEKSByZXR1cm47XG5cbiAgYXdhaXQgd3JpdGVyLnVwZGF0ZUluZGV4KHJlY29yZHNUb1dyaXRlLCBrZXlzVG9SZW1vdmUpO1xuICBhd2FpdCBzd2FwVGVtcEZpbGVJbihzdG9yZSwgaW5kZXhTaGFyZEtleSk7XG59O1xuXG5jb25zdCBTSEFSRF9ERUxFVEVEID0gJ1NIQVJEX0RFTEVURUQnO1xuY29uc3QgZ2V0V3JpdGVyID0gYXN5bmMgKGhpZXJhcmNoeSwgc3RvcmUsIGluZGV4S2V5LCBpbmRleGVkRGF0YUtleSwgaW5kZXhOb2RlLCBjcmVhdGVJZk5vdEV4aXN0cykgPT4ge1xuICBsZXQgcmVhZGFibGVTdHJlYW0gPSBudWxsO1xuXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleE5vZGUpKSB7XG4gICAgYXdhaXQgZW5zdXJlU2hhcmROYW1lSXNJblNoYXJkTWFwKHN0b3JlLCBpbmRleEtleSwgaW5kZXhlZERhdGFLZXkpO1xuICAgIGlmKCFhd2FpdCBzdG9yZS5leGlzdHMoaW5kZXhlZERhdGFLZXkpKSB7XG4gICAgICBhd2FpdCBzdG9yZS5jcmVhdGVGaWxlKGluZGV4ZWREYXRhS2V5LCBcIlwiKTtcbiAgICB9XG4gIH1cblxuICB0cnkge1xuXG4gICAgcmVhZGFibGVTdHJlYW0gPSBwcm9taXNlUmVhZGFibGVTdHJlYW0oXG4gICAgICAgIGF3YWl0IHN0b3JlLnJlYWRhYmxlRmlsZVN0cmVhbShpbmRleGVkRGF0YUtleSlcbiAgICApO1xuXG4gIH0gY2F0Y2ggKGUpIHtcblxuICAgIGlmIChhd2FpdCBzdG9yZS5leGlzdHMoaW5kZXhlZERhdGFLZXkpKSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY3JlYXRlSWZOb3RFeGlzdHMpIHsgXG4gICAgICAgIGF3YWl0IHN0b3JlLmNyZWF0ZUZpbGUoaW5kZXhlZERhdGFLZXksICcnKTsgXG4gICAgICB9IGVsc2UgeyBcbiAgICAgICAgcmV0dXJuIFNIQVJEX0RFTEVURUQ7IFxuICAgICAgfVxuXG4gICAgICByZWFkYWJsZVN0cmVhbSA9IHByb21pc2VSZWFkYWJsZVN0cmVhbShcbiAgICAgICAgICBhd2FpdCBzdG9yZS5yZWFkYWJsZUZpbGVTdHJlYW0oaW5kZXhlZERhdGFLZXkpXG4gICAgICApO1xuXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgd3JpdGFibGVTdHJlYW0gPSBwcm9taXNlV3JpdGVhYmxlU3RyZWFtKFxuICAgICAgYXdhaXQgc3RvcmUud3JpdGFibGVGaWxlU3RyZWFtKGluZGV4ZWREYXRhS2V5ICsgXCIudGVtcFwiKVxuICApO1xuXG4gIHJldHVybiBnZXRJbmRleFdyaXRlcihcbiAgICBoaWVyYXJjaHksIGluZGV4Tm9kZSxcbiAgICAgICAgcmVhZGFibGVTdHJlYW0sIHdyaXRhYmxlU3RyZWFtXG4gICk7XG59O1xuXG5jb25zdCBzd2FwVGVtcEZpbGVJbiA9IGFzeW5jIChzdG9yZSwgaW5kZXhlZERhdGFLZXksIGlzUmV0cnkgPSBmYWxzZSkgPT4ge1xuICBjb25zdCB0ZW1wRmlsZSA9IGAke2luZGV4ZWREYXRhS2V5fS50ZW1wYDtcbiAgdHJ5IHtcbiAgICBhd2FpdCBzdG9yZS5kZWxldGVGaWxlKGluZGV4ZWREYXRhS2V5KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIGlnbm9yZSBmYWlsdXJlLCBpbmNhc2UgaXQgaGFzIG5vdCBiZWVuIGNyZWF0ZWQgeWV0XG4gIH1cbiAgdHJ5IHtcbiAgICBhd2FpdCBzdG9yZS5yZW5hbWVGaWxlKHRlbXBGaWxlLCBpbmRleGVkRGF0YUtleSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyByZXRyeWluZyBpbiBjYXNlIGRlbGV0ZSBmYWlsdXJlIHdhcyBmb3Igc29tZSBvdGhlciByZWFzb25cbiAgICBpZiAoIWlzUmV0cnkpIHtcbiAgICAgIGF3YWl0IHN3YXBUZW1wRmlsZUluKHN0b3JlLCBpbmRleGVkRGF0YUtleSwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBzd2FwIGluIGluZGV4IGZpbGVkOiBcIiArIGUubWVzc2FnZSk7XG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgZmlsdGVyLCBtYXAsIGlzVW5kZWZpbmVkLCBpbmNsdWRlcyxcbiAgZmxhdHRlbiwgaW50ZXJzZWN0aW9uQnksXG4gIGlzRXF1YWwsIHB1bGwsIGtleXMsXG4gIGRpZmZlcmVuY2VCeSwgZGlmZmVyZW5jZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHVuaW9uIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7XG4gIGdldFJlbGV2YW50QW5jZXN0b3JJbmRleGVzLFxuICBnZXRSZWxldmFudFJldmVyc2VSZWZlcmVuY2VJbmRleGVzLFxufSBmcm9tICcuLi9pbmRleGluZy9yZWxldmFudCc7XG5pbXBvcnQgeyBldmFsdWF0ZSB9IGZyb20gJy4uL2luZGV4aW5nL2V2YWx1YXRlJztcbmltcG9ydCB7XG4gICQsIGlzU29tZXRoaW5nLFxuICBpc05vbkVtcHR5QXJyYXksIGpvaW5LZXksXG4gIGlzTm9uRW1wdHlTdHJpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXRJbmRleGVkRGF0YUtleSB9IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcbmltcG9ydCB7XG4gIGlzVXBkYXRlLCBpc0NyZWF0ZSxcbiAgaXNEZWxldGUsIGlzQnVpbGRJbmRleCxcbn0gZnJvbSAnLi90cmFuc2FjdGlvbnNDb21tb24nO1xuaW1wb3J0IHsgYXBwbHlUb1NoYXJkIH0gZnJvbSAnLi4vaW5kZXhpbmcvYXBwbHknO1xuaW1wb3J0IHtcbiAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQsXG4gIGlzR2xvYmFsSW5kZXgsIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4LCBpc1JlZmVyZW5jZUluZGV4LFxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuXG5leHBvcnQgY29uc3QgZXhlY3V0ZVRyYW5zYWN0aW9ucyA9IGFwcCA9PiBhc3luYyAodHJhbnNhY3Rpb25zKSA9PiB7XG4gIGNvbnN0IHJlY29yZHNCeVNoYXJkID0gbWFwcGVkUmVjb3Jkc0J5SW5kZXhTaGFyZChhcHAuaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMpO1xuXG4gIGZvciAoY29uc3Qgc2hhcmQgb2Yga2V5cyhyZWNvcmRzQnlTaGFyZCkpIHtcbiAgICBhd2FpdCBhcHBseVRvU2hhcmQoXG4gICAgICBhcHAuaGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlLFxuICAgICAgcmVjb3Jkc0J5U2hhcmRbc2hhcmRdLmluZGV4S2V5LFxuICAgICAgcmVjb3Jkc0J5U2hhcmRbc2hhcmRdLmluZGV4Tm9kZSxcbiAgICAgIHNoYXJkLFxuICAgICAgcmVjb3Jkc0J5U2hhcmRbc2hhcmRdLndyaXRlcyxcbiAgICAgIHJlY29yZHNCeVNoYXJkW3NoYXJkXS5yZW1vdmVzLFxuICAgICk7XG4gIH1cbn07XG5cbmNvbnN0IG1hcHBlZFJlY29yZHNCeUluZGV4U2hhcmQgPSAoaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMpID0+IHtcbiAgY29uc3QgdXBkYXRlcyA9IGdldFVwZGF0ZVRyYW5zYWN0aW9uc0J5U2hhcmQoXG4gICAgaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMsXG4gICk7XG5cbiAgY29uc3QgY3JlYXRlZCA9IGdldENyZWF0ZVRyYW5zYWN0aW9uc0J5U2hhcmQoXG4gICAgaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMsXG4gICk7XG4gIGNvbnN0IGRlbGV0ZXMgPSBnZXREZWxldGVUcmFuc2FjdGlvbnNCeVNoYXJkKFxuICAgIGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zLFxuICApO1xuXG4gIGNvbnN0IGluZGV4QnVpbGQgPSBnZXRCdWlsZEluZGV4VHJhbnNhY3Rpb25zQnlTaGFyZChcbiAgICBoaWVyYXJjaHksXG4gICAgdHJhbnNhY3Rpb25zLFxuICApO1xuXG4gIGNvbnN0IHRvUmVtb3ZlID0gW1xuICAgIC4uLmRlbGV0ZXMsXG4gICAgLi4udXBkYXRlcy50b1JlbW92ZSxcbiAgXTtcblxuICBjb25zdCB0b1dyaXRlID0gW1xuICAgIC4uLmNyZWF0ZWQsXG4gICAgLi4udXBkYXRlcy50b1dyaXRlLFxuICAgIC4uLmluZGV4QnVpbGQsXG4gIF07XG5cbiAgY29uc3QgdHJhbnNCeVNoYXJkID0ge307XG5cbiAgY29uc3QgaW5pdGlhbGlzZVNoYXJkID0gKHQpID0+IHtcbiAgICBpZiAoaXNVbmRlZmluZWQodHJhbnNCeVNoYXJkW3QuaW5kZXhTaGFyZEtleV0pKSB7XG4gICAgICB0cmFuc0J5U2hhcmRbdC5pbmRleFNoYXJkS2V5XSA9IHtcbiAgICAgICAgd3JpdGVzOiBbXSxcbiAgICAgICAgcmVtb3ZlczogW10sXG4gICAgICAgIGluZGV4S2V5OiB0LmluZGV4S2V5LFxuICAgICAgICBpbmRleE5vZGVLZXk6IHQuaW5kZXhOb2RlS2V5LFxuICAgICAgICBpbmRleE5vZGU6IHQuaW5kZXhOb2RlLFxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cbiAgZm9yIChjb25zdCB0cmFucyBvZiB0b1dyaXRlKSB7XG4gICAgaW5pdGlhbGlzZVNoYXJkKHRyYW5zKTtcbiAgICB0cmFuc0J5U2hhcmRbdHJhbnMuaW5kZXhTaGFyZEtleV0ud3JpdGVzLnB1c2goXG4gICAgICB0cmFucy5tYXBwZWRSZWNvcmQucmVzdWx0LFxuICAgICk7XG4gIH1cblxuICBmb3IgKGNvbnN0IHRyYW5zIG9mIHRvUmVtb3ZlKSB7XG4gICAgaW5pdGlhbGlzZVNoYXJkKHRyYW5zKTtcbiAgICB0cmFuc0J5U2hhcmRbdHJhbnMuaW5kZXhTaGFyZEtleV0ucmVtb3Zlcy5wdXNoKFxuICAgICAgdHJhbnMubWFwcGVkUmVjb3JkLnJlc3VsdC5rZXksXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiB0cmFuc0J5U2hhcmQ7XG59O1xuXG5jb25zdCBnZXRVcGRhdGVUcmFuc2FjdGlvbnNCeVNoYXJkID0gKGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKSA9PiB7XG4gIGNvbnN0IHVwZGF0ZVRyYW5zYWN0aW9ucyA9ICQodHJhbnNhY3Rpb25zLCBbZmlsdGVyKGlzVXBkYXRlKV0pO1xuXG4gIGNvbnN0IGV2YWx1YXRlSW5kZXggPSAocmVjb3JkLCBpbmRleE5vZGVBbmRQYXRoKSA9PiB7XG4gICAgY29uc3QgbWFwcGVkUmVjb3JkID0gZXZhbHVhdGUocmVjb3JkKShpbmRleE5vZGVBbmRQYXRoLmluZGV4Tm9kZSk7XG4gICAgcmV0dXJuICh7XG4gICAgICBtYXBwZWRSZWNvcmQsXG4gICAgICBpbmRleE5vZGU6IGluZGV4Tm9kZUFuZFBhdGguaW5kZXhOb2RlLFxuICAgICAgaW5kZXhLZXk6IGluZGV4Tm9kZUFuZFBhdGguaW5kZXhLZXksXG4gICAgICBpbmRleFNoYXJkS2V5OiBnZXRJbmRleGVkRGF0YUtleShcbiAgICAgICAgaW5kZXhOb2RlQW5kUGF0aC5pbmRleE5vZGUsXG4gICAgICAgIGluZGV4Tm9kZUFuZFBhdGguaW5kZXhLZXksXG4gICAgICAgIG1hcHBlZFJlY29yZC5yZXN1bHQsXG4gICAgICApLFxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGdldEluZGV4Tm9kZXNUb0FwcGx5ID0gaW5kZXhGaWx0ZXIgPT4gKHQsIGluZGV4ZXMpID0+ICQoaW5kZXhlcywgW1xuICAgIG1hcChuID0+ICh7XG4gICAgICBvbGQ6IGV2YWx1YXRlSW5kZXgodC5vbGRSZWNvcmQsIG4pLFxuICAgICAgbmV3OiBldmFsdWF0ZUluZGV4KHQucmVjb3JkLCBuKSxcbiAgICB9KSksXG4gICAgZmlsdGVyKGluZGV4RmlsdGVyKSxcbiAgXSk7XG5cbiAgY29uc3QgdG9SZW1vdmVGaWx0ZXIgPSAobiwgaXNVbnJlZmVyZW5jZWQpID0+IG4ub2xkLm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IHRydWVcbiAgICAgICAgJiYgKG4ubmV3Lm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IGZhbHNlXG4gICAgICAgICAgICB8fCBpc1VucmVmZXJlbmNlZCk7XG5cbiAgY29uc3QgdG9BZGRGaWx0ZXIgPSAobiwgaXNOZXdseVJlZmVyZW5jZWQpID0+IChuLm9sZC5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSBmYWxzZVxuICAgICAgICB8fCBpc05ld2x5UmVmZXJlbmNlZClcbiAgICAgICAgJiYgbi5uZXcubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gdHJ1ZTtcblxuICBjb25zdCB0b1VwZGF0ZUZpbHRlciA9IG4gPT4gbi5uZXcubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gdHJ1ZVxuICAgICAgICAmJiBuLm9sZC5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSB0cnVlXG4gICAgICAgICYmICFpc0VxdWFsKG4ub2xkLm1hcHBlZFJlY29yZC5yZXN1bHQsXG4gICAgICAgICAgbi5uZXcubWFwcGVkUmVjb3JkLnJlc3VsdCk7XG5cbiAgY29uc3QgdG9SZW1vdmUgPSBbXTtcbiAgY29uc3QgdG9Xcml0ZSA9IFtdO1xuXG4gIGZvciAoY29uc3QgdCBvZiB1cGRhdGVUcmFuc2FjdGlvbnMpIHtcbiAgICBjb25zdCBhbmNlc3RvcklkeHMgPSBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcyhcbiAgICAgIGhpZXJhcmNoeSwgdC5yZWNvcmQsXG4gICAgKTtcblxuICAgIGNvbnN0IHJlZmVyZW5jZUNoYW5nZXMgPSBkaWZmUmV2ZXJzZVJlZkZvclVwZGF0ZShcbiAgICAgIGhpZXJhcmNoeSwgdC5vbGRSZWNvcmQsIHQucmVjb3JkLFxuICAgICk7XG5cbiAgICAvLyBvbGQgcmVjb3JkcyB0byByZW1vdmUgKGZpbHRlcmVkIG91dClcbiAgICBjb25zdCBmaWx0ZXJlZE91dF90b1JlbW92ZSA9IHVuaW9uKFxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodG9SZW1vdmVGaWx0ZXIpKHQsIGFuY2VzdG9ySWR4cyksXG4gICAgICAvLyBzdGlsbCByZWZlcmVuY2VkIC0gY2hlY2sgZmlsdGVyXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b1JlbW92ZUZpbHRlcikodCwgcmVmZXJlbmNlQ2hhbmdlcy5ub3RDaGFuZ2VkKSxcbiAgICAgIC8vIHVuIHJlZmVyZW5jZWQgLSByZW1vdmUgaWYgaW4gdGhlcmUgYWxyZWFkeVxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkobiA9PiB0b1JlbW92ZUZpbHRlcihuLCB0cnVlKSkodCwgcmVmZXJlbmNlQ2hhbmdlcy51blJlZmVyZW5jZWQpLFxuICAgICk7XG5cbiAgICAvLyBuZXcgcmVjb3JkcyB0byBhZGQgKGZpbHRlcmVkIGluKVxuICAgIGNvbnN0IGZpbHRlcmVkSW5fdG9BZGQgPSB1bmlvbihcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvQWRkRmlsdGVyKSh0LCBhbmNlc3RvcklkeHMpLFxuICAgICAgLy8gbmV3bHkgcmVmZXJlbmNlZCAtIGNoZWNrIGZpbHRlclxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkobiA9PiB0b0FkZEZpbHRlcihuLCB0cnVlKSkodCwgcmVmZXJlbmNlQ2hhbmdlcy5uZXdseVJlZmVyZW5jZWQpLFxuICAgICAgLy8gcmVmZXJlbmNlIHVuY2hhbmdlZCAtIHJlcnVuIGZpbHRlciBpbiBjYXNlIHNvbWV0aGluZyBlbHNlIGNoYW5nZWRcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvQWRkRmlsdGVyKSh0LCByZWZlcmVuY2VDaGFuZ2VzLm5vdENoYW5nZWQpLFxuICAgICk7XG5cbiAgICBjb25zdCBjaGFuZ2VkID0gdW5pb24oXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b1VwZGF0ZUZpbHRlcikodCwgYW5jZXN0b3JJZHhzKSxcbiAgICAgIC8vIHN0aWxsIHJlZmVyZW5jZWQgLSByZWNoZWNrIGZpbHRlclxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodG9VcGRhdGVGaWx0ZXIpKHQsIHJlZmVyZW5jZUNoYW5nZXMubm90Q2hhbmdlZCksXG4gICAgKTtcblxuICAgIGNvbnN0IHNoYXJkS2V5Q2hhbmdlZCA9ICQoY2hhbmdlZCwgW1xuICAgICAgZmlsdGVyKGMgPT4gYy5vbGQuaW5kZXhTaGFyZEtleSAhPT0gYy5uZXcuaW5kZXhTaGFyZEtleSksXG4gICAgXSk7XG5cbiAgICBjb25zdCBjaGFuZ2VkSW5TYW1lU2hhcmQgPSAkKHNoYXJkS2V5Q2hhbmdlZCwgW1xuICAgICAgZGlmZmVyZW5jZShjaGFuZ2VkKSxcbiAgICBdKTtcblxuICAgIGZvciAoY29uc3QgcmVzIG9mIHNoYXJkS2V5Q2hhbmdlZCkge1xuICAgICAgcHVsbChyZXMpKGNoYW5nZWQpO1xuICAgICAgZmlsdGVyZWRPdXRfdG9SZW1vdmUucHVzaChyZXMpO1xuICAgICAgZmlsdGVyZWRJbl90b0FkZC5wdXNoKHJlcyk7XG4gICAgfVxuXG4gICAgdG9SZW1vdmUucHVzaChcbiAgICAgICQoZmlsdGVyZWRPdXRfdG9SZW1vdmUsIFtcbiAgICAgICAgbWFwKGkgPT4gaS5vbGQpLFxuICAgICAgXSksXG4gICAgKTtcblxuICAgIHRvV3JpdGUucHVzaChcbiAgICAgICQoZmlsdGVyZWRJbl90b0FkZCwgW1xuICAgICAgICBtYXAoaSA9PiBpLm5ldyksXG4gICAgICBdKSxcbiAgICApO1xuXG4gICAgdG9Xcml0ZS5wdXNoKFxuICAgICAgJChjaGFuZ2VkSW5TYW1lU2hhcmQsIFtcbiAgICAgICAgbWFwKGkgPT4gaS5uZXcpLFxuICAgICAgXSksXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiAoe1xuICAgIHRvUmVtb3ZlOiBmbGF0dGVuKHRvUmVtb3ZlKSxcbiAgICB0b1dyaXRlOiBmbGF0dGVuKHRvV3JpdGUpLFxuICB9KTtcbn07XG5cbmNvbnN0IGdldEJ1aWxkSW5kZXhUcmFuc2FjdGlvbnNCeVNoYXJkID0gKGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKSA9PiB7XG4gIGNvbnN0IGJ1aWxkVHJhbnNhY3Rpb25zID0gJCh0cmFuc2FjdGlvbnMsIFtmaWx0ZXIoaXNCdWlsZEluZGV4KV0pO1xuICBpZiAoIWlzTm9uRW1wdHlBcnJheShidWlsZFRyYW5zYWN0aW9ucykpIHJldHVybiBbXTtcbiAgY29uc3QgaW5kZXhOb2RlID0gdHJhbnNhY3Rpb25zLmluZGV4Tm9kZTtcblxuICBjb25zdCBnZXRJbmRleEtleXMgPSAodCkgPT4ge1xuICAgIGlmIChpc0dsb2JhbEluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICAgIHJldHVybiBbaW5kZXhOb2RlLm5vZGVLZXkoKV07XG4gICAgfVxuXG4gICAgaWYgKGlzUmVmZXJlbmNlSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgICAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoaGllcmFyY2h5KSh0LnJlY29yZC5rZXkpO1xuICAgICAgY29uc3QgcmVmRmllbGRzID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICAgICAgICBmaWx0ZXIoZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXgoaW5kZXhOb2RlKSksXG4gICAgICBdKTtcbiAgICAgIGNvbnN0IGluZGV4S2V5cyA9IFtdO1xuICAgICAgZm9yIChjb25zdCByZWZGaWVsZCBvZiByZWZGaWVsZHMpIHtcbiAgICAgICAgY29uc3QgcmVmVmFsdWUgPSB0LnJlY29yZFtyZWZGaWVsZC5uYW1lXTtcbiAgICAgICAgaWYgKGlzU29tZXRoaW5nKHJlZlZhbHVlKVxuICAgICAgICAgICAgICAgICAgICYmIGlzTm9uRW1wdHlTdHJpbmcocmVmVmFsdWUua2V5KSkge1xuICAgICAgICAgIGNvbnN0IGluZGV4S2V5ID0gam9pbktleShcbiAgICAgICAgICAgIHJlZlZhbHVlLmtleSxcbiAgICAgICAgICAgIGluZGV4Tm9kZS5uYW1lLFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAoIWluY2x1ZGVzKGluZGV4S2V5KShpbmRleEtleXMpKSB7IGluZGV4S2V5cy5wdXNoKGluZGV4S2V5KTsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaW5kZXhLZXlzO1xuICAgIH1cblxuICAgIHJldHVybiBbam9pbktleShcbiAgICAgIGdldEFjdHVhbEtleU9mUGFyZW50KFxuICAgICAgICBpbmRleE5vZGUucGFyZW50KCkubm9kZUtleSgpLFxuICAgICAgICB0LnJlY29yZC5rZXksXG4gICAgICApLFxuICAgICAgaW5kZXhOb2RlLm5hbWUsXG4gICAgKV07XG4gIH07XG5cbiAgcmV0dXJuICQoYnVpbGRUcmFuc2FjdGlvbnMsIFtcbiAgICBtYXAoKHQpID0+IHtcbiAgICAgIGNvbnN0IG1hcHBlZFJlY29yZCA9IGV2YWx1YXRlKHQucmVjb3JkKShpbmRleE5vZGUpO1xuICAgICAgaWYgKCFtYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyKSByZXR1cm4gbnVsbDtcbiAgICAgIGNvbnN0IGluZGV4S2V5cyA9IGdldEluZGV4S2V5cyh0KTtcbiAgICAgIHJldHVybiAkKGluZGV4S2V5cywgW1xuICAgICAgICBtYXAoaW5kZXhLZXkgPT4gKHtcbiAgICAgICAgICBtYXBwZWRSZWNvcmQsXG4gICAgICAgICAgaW5kZXhOb2RlLFxuICAgICAgICAgIGluZGV4S2V5LFxuICAgICAgICAgIGluZGV4U2hhcmRLZXk6IGdldEluZGV4ZWREYXRhS2V5KFxuICAgICAgICAgICAgaW5kZXhOb2RlLFxuICAgICAgICAgICAgaW5kZXhLZXksXG4gICAgICAgICAgICBtYXBwZWRSZWNvcmQucmVzdWx0LFxuICAgICAgICAgICksXG4gICAgICAgIH0pKSxcbiAgICAgIF0pO1xuICAgIH0pLFxuICAgIGZsYXR0ZW4sXG4gICAgZmlsdGVyKGlzU29tZXRoaW5nKSxcbiAgXSk7XG59O1xuXG5jb25zdCBnZXRfQ3JlYXRlX0RlbGV0ZV9UcmFuc2FjdGlvbnNCeVNoYXJkID0gcHJlZCA9PiAoaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMpID0+IHtcbiAgY29uc3QgY3JlYXRlVHJhbnNhY3Rpb25zID0gJCh0cmFuc2FjdGlvbnMsIFtmaWx0ZXIocHJlZCldKTtcblxuICBjb25zdCBnZXRJbmRleE5vZGVzVG9BcHBseSA9ICh0LCBpbmRleGVzKSA9PiAkKGluZGV4ZXMsIFtcbiAgICBtYXAoKG4pID0+IHtcbiAgICAgIGNvbnN0IG1hcHBlZFJlY29yZCA9IGV2YWx1YXRlKHQucmVjb3JkKShuLmluZGV4Tm9kZSk7XG4gICAgICByZXR1cm4gKHtcbiAgICAgICAgbWFwcGVkUmVjb3JkLFxuICAgICAgICBpbmRleE5vZGU6IG4uaW5kZXhOb2RlLFxuICAgICAgICBpbmRleEtleTogbi5pbmRleEtleSxcbiAgICAgICAgaW5kZXhTaGFyZEtleTogZ2V0SW5kZXhlZERhdGFLZXkoXG4gICAgICAgICAgbi5pbmRleE5vZGUsXG4gICAgICAgICAgbi5pbmRleEtleSxcbiAgICAgICAgICBtYXBwZWRSZWNvcmQucmVzdWx0LFxuICAgICAgICApLFxuICAgICAgfSk7XG4gICAgfSksXG4gICAgZmlsdGVyKG4gPT4gbi5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyKSxcbiAgXSk7XG5cbiAgY29uc3QgYWxsVG9BcHBseSA9IFtdO1xuXG4gIGZvciAoY29uc3QgdCBvZiBjcmVhdGVUcmFuc2FjdGlvbnMpIHtcbiAgICBjb25zdCBhbmNlc3RvcklkeHMgPSBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcyhoaWVyYXJjaHksIHQucmVjb3JkKTtcbiAgICBjb25zdCByZXZlcnNlUmVmID0gZ2V0UmVsZXZhbnRSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyhoaWVyYXJjaHksIHQucmVjb3JkKTtcblxuICAgIGFsbFRvQXBwbHkucHVzaChcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHQsIGFuY2VzdG9ySWR4cyksXG4gICAgKTtcbiAgICBhbGxUb0FwcGx5LnB1c2goXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0LCByZXZlcnNlUmVmKSxcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIGZsYXR0ZW4oYWxsVG9BcHBseSk7XG59O1xuXG5jb25zdCBnZXREZWxldGVUcmFuc2FjdGlvbnNCeVNoYXJkID0gZ2V0X0NyZWF0ZV9EZWxldGVfVHJhbnNhY3Rpb25zQnlTaGFyZChpc0RlbGV0ZSk7XG5cbmNvbnN0IGdldENyZWF0ZVRyYW5zYWN0aW9uc0J5U2hhcmQgPSBnZXRfQ3JlYXRlX0RlbGV0ZV9UcmFuc2FjdGlvbnNCeVNoYXJkKGlzQ3JlYXRlKTtcblxuY29uc3QgZGlmZlJldmVyc2VSZWZGb3JVcGRhdGUgPSAoYXBwSGllcmFyY2h5LCBvbGRSZWNvcmQsIG5ld1JlY29yZCkgPT4ge1xuICBjb25zdCBvbGRJbmRleGVzID0gZ2V0UmVsZXZhbnRSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyhcbiAgICBhcHBIaWVyYXJjaHksIG9sZFJlY29yZCxcbiAgKTtcbiAgY29uc3QgbmV3SW5kZXhlcyA9IGdldFJlbGV2YW50UmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMoXG4gICAgYXBwSGllcmFyY2h5LCBuZXdSZWNvcmQsXG4gICk7XG5cbiAgY29uc3QgdW5SZWZlcmVuY2VkID0gZGlmZmVyZW5jZUJ5KFxuICAgIGkgPT4gaS5pbmRleEtleSxcbiAgICBvbGRJbmRleGVzLCBuZXdJbmRleGVzLFxuICApO1xuXG4gIGNvbnN0IG5ld2x5UmVmZXJlbmNlZCA9IGRpZmZlcmVuY2VCeShcbiAgICBpID0+IGkuaW5kZXhLZXksXG4gICAgbmV3SW5kZXhlcywgb2xkSW5kZXhlcyxcbiAgKTtcblxuICBjb25zdCBub3RDaGFuZ2VkID0gaW50ZXJzZWN0aW9uQnkoXG4gICAgaSA9PiBpLmluZGV4S2V5LFxuICAgIG5ld0luZGV4ZXMsIG9sZEluZGV4ZXMsXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICB1blJlZmVyZW5jZWQsXG4gICAgbmV3bHlSZWZlcmVuY2VkLFxuICAgIG5vdENoYW5nZWQsXG4gIH07XG59O1xuIiwiaW1wb3J0IHsgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHJldHJpZXZlIH0gZnJvbSAnLi9yZXRyaWV2ZSc7XG5pbXBvcnQgeyBleGVjdXRlVHJhbnNhY3Rpb25zIH0gZnJvbSAnLi9leGVjdXRlJztcbmltcG9ydCB7XG4gICQsIGpvaW5LZXksIGdldExvY2ssIGlzTm9sb2NrLCByZWxlYXNlTG9jayxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIExPQ0tfRklMRV9LRVksIFRSQU5TQUNUSU9OU19GT0xERVIsXG4gIHRpbWVvdXRNaWxsaXNlY29uZHMsIGdldFRyYW5zYWN0aW9uSWQsXG4gIG1heExvY2tSZXRyaWVzLFxufSBmcm9tICcuL3RyYW5zYWN0aW9uc0NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBjbGVhbnVwID0gYXN5bmMgKGFwcCkgPT4ge1xuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0VHJhbnNhY3Rpb25Mb2NrKGFwcCk7XG4gIGlmIChpc05vbG9jayhsb2NrKSkgcmV0dXJuO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgdHJhbnNhY3Rpb25zID0gYXdhaXQgcmV0cmlldmUoYXBwKTtcbiAgICBpZiAodHJhbnNhY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IGV4ZWN1dGVUcmFuc2FjdGlvbnMoYXBwKSh0cmFuc2FjdGlvbnMpO1xuXG4gICAgICBjb25zdCBmb2xkZXIgPSB0cmFuc2FjdGlvbnMuZm9sZGVyS2V5XG4gICAgICAgID8gdHJhbnNhY3Rpb25zLmZvbGRlcktleVxuICAgICAgICA6IFRSQU5TQUNUSU9OU19GT0xERVI7XG5cbiAgICAgIGNvbnN0IGRlbGV0ZUZpbGVzID0gJCh0cmFuc2FjdGlvbnMsIFtcbiAgICAgICAgbWFwKHQgPT4gam9pbktleShcbiAgICAgICAgICBmb2xkZXIsXG4gICAgICAgICAgZ2V0VHJhbnNhY3Rpb25JZChcbiAgICAgICAgICAgIHQucmVjb3JkSWQsIHQudHJhbnNhY3Rpb25UeXBlLFxuICAgICAgICAgICAgdC51bmlxdWVJZCxcbiAgICAgICAgICApLFxuICAgICAgICApKSxcbiAgICAgICAgbWFwKGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZSksXG4gICAgICBdKTtcblxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoZGVsZXRlRmlsZXMpO1xuICAgIH1cbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xuICB9XG59O1xuXG5jb25zdCBnZXRUcmFuc2FjdGlvbkxvY2sgPSBhc3luYyBhcHAgPT4gYXdhaXQgZ2V0TG9jayhcbiAgYXBwLCBMT0NLX0ZJTEVfS0VZLFxuICB0aW1lb3V0TWlsbGlzZWNvbmRzLCBtYXhMb2NrUmV0cmllcyxcbik7XG4iLCJpbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgY29uZmlnRm9sZGVyLCBhcHBEZWZpbml0aW9uRmlsZSwgJCB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBUUkFOU0FDVElPTlNfRk9MREVSIH0gZnJvbSAnLi4vdHJhbnNhY3Rpb25zL3RyYW5zYWN0aW9uc0NvbW1vbic7XG5pbXBvcnQgeyBBVVRIX0ZPTERFUiwgVVNFUlNfTElTVF9GSUxFLCBBQ0NFU1NfTEVWRUxTX0ZJTEUgfSBmcm9tICcuLi9hdXRoQXBpL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgaW5pdGlhbGlzZVJvb3RDb2xsZWN0aW9ucyB9IGZyb20gJy4uL2NvbGxlY3Rpb25BcGkvaW5pdGlhbGlzZSc7XG5pbXBvcnQgeyBpbml0aWFsaXNlSW5kZXggfSBmcm9tICcuLi9pbmRleGluZy9pbml0aWFsaXNlSW5kZXgnO1xuaW1wb3J0IHsgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LCBpc0dsb2JhbEluZGV4LCBpc1NpbmdsZVJlY29yZCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBfZ2V0TmV3IH0gZnJvbSBcIi4uL3JlY29yZEFwaS9nZXROZXdcIjtcbmltcG9ydCB7IF9zYXZlIH0gZnJvbSBcIi4uL3JlY29yZEFwaS9zYXZlXCI7XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlRGF0YSA9IGFzeW5jIChkYXRhc3RvcmUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbiwgYWNjZXNzTGV2ZWxzKSA9PiB7XG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoY29uZmlnRm9sZGVyKTtcbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oYXBwRGVmaW5pdGlvbkZpbGUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbik7XG5cbiAgYXdhaXQgaW5pdGlhbGlzZVJvb3RDb2xsZWN0aW9ucyhkYXRhc3RvcmUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbi5oaWVyYXJjaHkpO1xuICBhd2FpdCBpbml0aWFsaXNlUm9vdEluZGV4ZXMoZGF0YXN0b3JlLCBhcHBsaWNhdGlvbkRlZmluaXRpb24uaGllcmFyY2h5KTtcblxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKFRSQU5TQUNUSU9OU19GT0xERVIpO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoQVVUSF9GT0xERVIpO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKFVTRVJTX0xJU1RfRklMRSwgW10pO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKFxuICAgIEFDQ0VTU19MRVZFTFNfRklMRSwgXG4gICAgYWNjZXNzTGV2ZWxzID8gYWNjZXNzTGV2ZWxzIDogeyB2ZXJzaW9uOiAwLCBsZXZlbHM6IFtdIH0pO1xuXG4gIGF3YWl0IGluaXRpYWxpc2VSb290U2luZ2xlUmVjb3JkcyhkYXRhc3RvcmUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbi5oaWVyYXJjaHkpO1xufTtcblxuY29uc3QgaW5pdGlhbGlzZVJvb3RJbmRleGVzID0gYXN5bmMgKGRhdGFzdG9yZSwgaGllcmFyY2h5KSA9PiB7XG4gIGNvbnN0IGZsYXRoaWVyYXJjaHkgPSBnZXRGbGF0dGVuZWRIaWVyYXJjaHkoaGllcmFyY2h5KTtcbiAgY29uc3QgZ2xvYmFsSW5kZXhlcyA9ICQoZmxhdGhpZXJhcmNoeSwgW1xuICAgIGZpbHRlcihpc0dsb2JhbEluZGV4KSxcbiAgXSk7XG5cbiAgZm9yIChjb25zdCBpbmRleCBvZiBnbG9iYWxJbmRleGVzKSB7XG4gICAgaWYgKCFhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGluZGV4Lm5vZGVLZXkoKSkpIHsgYXdhaXQgaW5pdGlhbGlzZUluZGV4KGRhdGFzdG9yZSwgJycsIGluZGV4KTsgfVxuICB9XG59O1xuXG5jb25zdCBpbml0aWFsaXNlUm9vdFNpbmdsZVJlY29yZHMgPSBhc3luYyAoZGF0YXN0b3JlLCBoaWVyYXJjaHkpID0+IHtcbiAgY29uc3QgYXBwID0geyBcbiAgICBwdWJsaXNoOigpPT57fSxcbiAgICBjbGVhbnVwVHJhbnNhY3Rpb25zOiAoKSA9PiB7fSxcbiAgICBkYXRhc3RvcmUsIGhpZXJhcmNoeSBcbiAgfTtcblxuICBjb25zdCBmbGF0aGllcmFyY2h5ID0gZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGhpZXJhcmNoeSk7XG4gIGNvbnN0IHNpbmdsZVJlY29yZHMgPSAkKGZsYXRoaWVyYXJjaHksIFtcbiAgICBmaWx0ZXIoaXNTaW5nbGVSZWNvcmQpLFxuICBdKTtcblxuICBmb3IgKGxldCByZWNvcmQgb2Ygc2luZ2xlUmVjb3Jkcykge1xuICAgIGNvbnN0IHJlc3VsdCA9IF9nZXROZXcocmVjb3JkLCBcIlwiKTtcbiAgICBhd2FpdCBfc2F2ZShhcHAscmVzdWx0KTtcbiAgfVxufTtcbiIsImltcG9ydCB7IGlzTm90aGluZyB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBnZXREYXRhYmFzZU1hbmFnZXIgPSBkYXRhYmFzZU1hbmFnZXIgPT4gKHtcbiAgY3JlYXRlRW1wdHlNYXN0ZXJEYjogY3JlYXRlRW1wdHlNYXN0ZXJEYihkYXRhYmFzZU1hbmFnZXIpLFxuICBjcmVhdGVFbXB0eUluc3RhbmNlRGI6IGNyZWF0ZUVtcHR5SW5zdGFuY2VEYihkYXRhYmFzZU1hbmFnZXIpLFxuICBnZXRJbnN0YW5jZURiUm9vdENvbmZpZzogZGF0YWJhc2VNYW5hZ2VyLmdldEluc3RhbmNlRGJSb290Q29uZmlnLFxuICBtYXN0ZXJEYXRhc3RvcmVDb25maWc6IGdldE1hc3RlckRhdGFzdG9yZUNvbmZpZyhkYXRhYmFzZU1hbmFnZXIpLFxuICBnZXRJbnN0YW5jZURhdGFzdG9yZUNvbmZpZzogZ2V0SW5zdGFuY2VEYXRhc3RvcmVDb25maWcoZGF0YWJhc2VNYW5hZ2VyKSxcbn0pO1xuXG5jb25zdCBnZXRNYXN0ZXJEYXRhc3RvcmVDb25maWcgPSBkYXRhYmFzZU1hbmFnZXIgPT4gZGF0YWJhc2VNYW5hZ2VyLmdldERhdGFzdG9yZUNvbmZpZygnbWFzdGVyJyk7XG5cbmNvbnN0IGdldEluc3RhbmNlRGF0YXN0b3JlQ29uZmlnID0gZGF0YWJhc2VNYW5hZ2VyID0+IChhcHBsaWNhdGlvbklkLCBpbnN0YW5jZUlkKSA9PiBkYXRhYmFzZU1hbmFnZXIuZ2V0RGF0YXN0b3JlQ29uZmlnKFxuICBhcHBsaWNhdGlvbklkLCBpbnN0YW5jZUlkLFxuKTtcblxuY29uc3QgY3JlYXRlRW1wdHlNYXN0ZXJEYiA9IGRhdGFiYXNlTWFuYWdlciA9PiBhc3luYyAoKSA9PiBhd2FpdCBkYXRhYmFzZU1hbmFnZXIuY3JlYXRlRW1wdHlEYignbWFzdGVyJyk7XG5cbmNvbnN0IGNyZWF0ZUVtcHR5SW5zdGFuY2VEYiA9IGRhdGFiYXNlTWFuYWdlciA9PiBhc3luYyAoYXBwbGljYXRpb25JZCwgaW5zdGFuY2VJZCkgPT4ge1xuICBpZiAoaXNOb3RoaW5nKGFwcGxpY2F0aW9uSWQpKSB7IHRocm93IG5ldyBFcnJvcignQ3JlYXRlRGI6IGFwcGxpY2F0aW9uIGlkIG5vdCBzdXBwbGllZCcpOyB9XG4gIGlmIChpc05vdGhpbmcoaW5zdGFuY2VJZCkpIHsgdGhyb3cgbmV3IEVycm9yKCdDcmVhdGVEYjogaW5zdGFuY2UgaWQgbm90IHN1cHBsaWVkJyk7IH1cblxuICByZXR1cm4gYXdhaXQgZGF0YWJhc2VNYW5hZ2VyLmNyZWF0ZUVtcHR5RGIoXG4gICAgYXBwbGljYXRpb25JZCxcbiAgICBpbnN0YW5jZUlkLFxuICApO1xufTtcbiIsImltcG9ydCBnZXRSZWNvcmRBcGkgZnJvbSBcIi4vcmVjb3JkQXBpXCI7XG5pbXBvcnQgZ2V0Q29sbGVjdGlvbkFwaSBmcm9tIFwiLi9jb2xsZWN0aW9uQXBpXCI7XG5pbXBvcnQgZ2V0SW5kZXhBcGkgZnJvbSBcIi4vaW5kZXhBcGlcIjtcbmltcG9ydCBnZXRUZW1wbGF0ZUFwaSBmcm9tIFwiLi90ZW1wbGF0ZUFwaVwiO1xuaW1wb3J0IGdldEF1dGhBcGkgZnJvbSBcIi4vYXV0aEFwaVwiO1xuaW1wb3J0IGdldEFjdGlvbnNBcGkgZnJvbSBcIi4vYWN0aW9uc0FwaVwiO1xuaW1wb3J0IHtzZXR1cERhdGFzdG9yZSwgY3JlYXRlRXZlbnRBZ2dyZWdhdG9yfSBmcm9tIFwiLi9hcHBJbml0aWFsaXNlXCI7XG5pbXBvcnQge2luaXRpYWxpc2VBY3Rpb25zfSBmcm9tIFwiLi9hY3Rpb25zQXBpL2luaXRpYWxpc2VcIlxuaW1wb3J0IHtpc1NvbWV0aGluZ30gZnJvbSBcIi4vY29tbW9uXCI7XG5pbXBvcnQge2NsZWFudXB9IGZyb20gXCIuL3RyYW5zYWN0aW9ucy9jbGVhbnVwXCI7XG5pbXBvcnQge2dlbmVyYXRlRnVsbFBlcm1pc3Npb25zfSBmcm9tIFwiLi9hdXRoQXBpL2dlbmVyYXRlRnVsbFBlcm1pc3Npb25zXCI7XG5pbXBvcnQge2dldEFwcGxpY2F0aW9uRGVmaW5pdGlvbn0gZnJvbSBcIi4vdGVtcGxhdGVBcGkvZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uXCI7XG5pbXBvcnQgY29tbW9uIGZyb20gXCIuL2NvbW1vblwiO1xuaW1wb3J0IHtnZXRCZWhhdmlvdXJTb3VyY2VzfSBmcm9tIFwiLi90ZW1wbGF0ZUFwaS9nZXRCZWhhdmlvdXJTb3VyY2VzXCI7XG5pbXBvcnQgaGllcmFyY2h5IGZyb20gXCIuL3RlbXBsYXRlQXBpL2hpZXJhcmNoeVwiO1xuXG5leHBvcnQgY29uc3QgZ2V0QXBwQXBpcyA9IGFzeW5jIChzdG9yZSwgYmVoYXZpb3VyU291cmNlcyA9IG51bGwsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhbnVwVHJhbnNhY3Rpb25zID0gbnVsbCwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEVwb2NoVGltZSA9IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyeXB0byA9IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcERlZmluaXRpb24gPSBudWxsKSA9PiB7XG5cbiAgICBzdG9yZSA9IHNldHVwRGF0YXN0b3JlKHN0b3JlKTtcblxuICAgIGlmKCFhcHBEZWZpbml0aW9uKVxuICAgICAgICBhcHBEZWZpbml0aW9uID0gYXdhaXQgZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uKHN0b3JlKSgpO1xuXG4gICAgaWYoIWJlaGF2aW91clNvdXJjZXMpXG4gICAgICAgIGJlaGF2aW91clNvdXJjZXMgPSBhd2FpdCBnZXRCZWhhdmlvdXJTb3VyY2VzKHN0b3JlKTtcblxuICAgIGNvbnN0IGV2ZW50QWdncmVnYXRvciA9IGNyZWF0ZUV2ZW50QWdncmVnYXRvcigpO1xuXG4gICAgY29uc3QgYXBwID0ge1xuICAgICAgICBkYXRhc3RvcmU6c3RvcmUsXG4gICAgICAgIGNyeXB0byxcbiAgICAgICAgcHVibGlzaDpldmVudEFnZ3JlZ2F0b3IucHVibGlzaCxcbiAgICAgICAgaGllcmFyY2h5OmFwcERlZmluaXRpb24uaGllcmFyY2h5LFxuICAgICAgICBhY3Rpb25zOmFwcERlZmluaXRpb24uYWN0aW9uc1xuICAgIH07XG5cbiAgICBjb25zdCB0ZW1wbGF0ZUFwaSA9IGdldFRlbXBsYXRlQXBpKGFwcCk7ICAgIFxuXG4gICAgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMgPSBpc1NvbWV0aGluZyhjbGVhbnVwVHJhbnNhY3Rpb25zKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gY2xlYW51cFRyYW5zYWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBhc3luYyAoKSA9PiBhd2FpdCBjbGVhbnVwKGFwcCk7XG5cbiAgICBhcHAuZ2V0RXBvY2hUaW1lID0gaXNTb21ldGhpbmcoZ2V0RXBvY2hUaW1lKVxuICAgICAgICAgICAgICAgICAgICAgICA/IGdldEVwb2NoVGltZVxuICAgICAgICAgICAgICAgICAgICAgICA6IGFzeW5jICgpID0+IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG5cbiAgICBjb25zdCByZWNvcmRBcGkgPSBnZXRSZWNvcmRBcGkoYXBwKTtcbiAgICBjb25zdCBjb2xsZWN0aW9uQXBpID0gZ2V0Q29sbGVjdGlvbkFwaShhcHApO1xuICAgIGNvbnN0IGluZGV4QXBpID0gZ2V0SW5kZXhBcGkoYXBwKTtcbiAgICBjb25zdCBhdXRoQXBpID0gZ2V0QXV0aEFwaShhcHApO1xuICAgIGNvbnN0IGFjdGlvbnNBcGkgPSBnZXRBY3Rpb25zQXBpKGFwcCk7XG5cbiAgICBjb25zdCBhdXRoZW50aWNhdGVBcyA9IGFzeW5jICh1c2VybmFtZSwgcGFzc3dvcmQpID0+IHtcbiAgICAgICAgYXBwLnVzZXIgPSBhd2FpdCBhdXRoQXBpLmF1dGhlbnRpY2F0ZSh1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgIH07XG5cbiAgICBjb25zdCB3aXRoRnVsbEFjY2VzcyA9ICgpID0+IFxuICAgICAgICB1c2VyV2l0aEZ1bGxBY2Nlc3MoYXBwKTsgICAgXG5cbiAgICBjb25zdCBhc1VzZXIgPSAodXNlcikgPT4ge1xuICAgICAgICBhcHAudXNlciA9IHVzZXJcbiAgICB9OyAgICBcblxuICAgIGxldCBhcGlzID0ge1xuICAgICAgICByZWNvcmRBcGksIFxuICAgICAgICB0ZW1wbGF0ZUFwaSxcbiAgICAgICAgY29sbGVjdGlvbkFwaSxcbiAgICAgICAgaW5kZXhBcGksXG4gICAgICAgIGF1dGhBcGksXG4gICAgICAgIGFjdGlvbnNBcGksXG4gICAgICAgIHN1YnNjcmliZTogZXZlbnRBZ2dyZWdhdG9yLnN1YnNjcmliZSxcbiAgICAgICAgYXV0aGVudGljYXRlQXMsXG4gICAgICAgIHdpdGhGdWxsQWNjZXNzLFxuICAgICAgICBhc1VzZXJcbiAgICB9O1xuXG4gICAgYXBpcy5hY3Rpb25zID0gaW5pdGlhbGlzZUFjdGlvbnMoXG4gICAgICAgIGV2ZW50QWdncmVnYXRvci5zdWJzY3JpYmUsXG4gICAgICAgIGJlaGF2aW91clNvdXJjZXMsXG4gICAgICAgIGFwcERlZmluaXRpb24uYWN0aW9ucyxcbiAgICAgICAgYXBwRGVmaW5pdGlvbi50cmlnZ2VycyxcbiAgICAgICAgYXBpcyk7XG5cblxuICAgIHJldHVybiBhcGlzO1xufTtcblxuZXhwb3J0IGNvbnN0IHVzZXJXaXRoRnVsbEFjY2VzcyA9IChhcHApID0+IHtcbiAgICBhcHAudXNlciA9IHtcbiAgICAgICAgbmFtZTogXCJhcHBcIixcbiAgICAgICAgcGVybWlzc2lvbnMgOiBnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucyhhcHApLFxuICAgICAgICBpc1VzZXI6ZmFsc2UsXG4gICAgICAgIHRlbXA6ZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIGFwcC51c2VyO1xufTtcblxuZXhwb3J0IHtldmVudHMsIGV2ZW50c0xpc3R9IGZyb20gXCIuL2NvbW1vbi9ldmVudHNcIjtcbmV4cG9ydCB7Z2V0VGVtcGxhdGVBcGl9IGZyb20gXCIuL3RlbXBsYXRlQXBpXCI7XG5leHBvcnQge2dldFJlY29yZEFwaX0gZnJvbSBcIi4vcmVjb3JkQXBpXCI7XG5leHBvcnQge2dldENvbGxlY3Rpb25BcGl9IGZyb20gXCIuL2NvbGxlY3Rpb25BcGlcIjtcbmV4cG9ydCB7Z2V0QXV0aEFwaX0gZnJvbSBcIi4vYXV0aEFwaVwiO1xuZXhwb3J0IHtnZXRJbmRleEFwaX0gZnJvbSBcIi4vaW5kZXhBcGlcIjtcbmV4cG9ydCB7c2V0dXBEYXRhc3RvcmV9IGZyb20gXCIuL2FwcEluaXRpYWxpc2VcIjtcbmV4cG9ydCB7Z2V0QWN0aW9uc0FwaX0gZnJvbSBcIi4vYWN0aW9uc0FwaVwiO1xuZXhwb3J0IHtpbml0aWFsaXNlRGF0YX0gZnJvbSBcIi4vYXBwSW5pdGlhbGlzZS9pbml0aWFsaXNlRGF0YVwiO1xuZXhwb3J0IHtnZXREYXRhYmFzZU1hbmFnZXJ9IGZyb20gXCIuL2FwcEluaXRpYWxpc2UvZGF0YWJhc2VNYW5hZ2VyXCI7XG5leHBvcnQge2hpZXJhcmNoeX07XG5leHBvcnQge2NvbW1vbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldEFwcEFwaXM7Il0sIm5hbWVzIjpbImlzQXJyYXkiLCJqb2luIiwiaXNOYU4iLCJjb21waWxlRXhwcmVzc2lvbiIsImNvbXBpbGVDb2RlIiwibWFrZXJ1bGUiLCJvcHRpb25zIiwidHlwZUNvbnN0cmFpbnRzIiwiYWxsIiwiZ2V0RGVmYXVsdE9wdGlvbnMiLCJ2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyIsImdsb2JhbCIsImJhc2U2NC5mcm9tQnl0ZUFycmF5IiwiaWVlZTc1NC5yZWFkIiwiaWVlZTc1NC53cml0ZSIsImJhc2U2NC50b0J5dGVBcnJheSIsInJlYWQiLCJCdWZmZXIiLCJyZWFkSW5kZXgiLCJtZXJnZSIsImRlbGV0ZVJlY29yZCIsInZhbGlkYXRlIiwiZmluZCIsImVhY2giLCJkZWZhdWx0Q2FzZSIsImFwaSIsImNyZWF0ZVRlbXBvcmFyeUFjY2VzcyIsImNyZWF0ZVVzZXIiLCJzZXRVc2VyQWNjZXNzTGV2ZWxzIiwiZXhlY3V0ZUFjdGlvbiIsImNDb2RlIiwiY0V4cCIsIm9yZGVyQnkiLCJ1bmlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBLE1BQU0sVUFBVSxHQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRS9FLE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVwQyxNQUFNLE9BQU8sR0FBRztFQUNkLFNBQVMsRUFBRTtJQUNULElBQUksRUFBRSxVQUFVLENBQUM7TUFDZixXQUFXO01BQ1gsaUJBQWlCO01BQ2pCLGlCQUFpQixDQUFDLENBQUM7SUFDckIsTUFBTSxFQUFFLE1BQU0sRUFBRTtJQUNoQixVQUFVLEVBQUUsTUFBTSxFQUFFO0lBQ3BCLE1BQU0sRUFBRSxNQUFNLEVBQUU7SUFDaEIsSUFBSSxFQUFFLE1BQU0sRUFBRTtJQUNkLFFBQVEsRUFBRSxNQUFNLEVBQUU7SUFDbEIsVUFBVSxFQUFFLE1BQU0sRUFBRTtJQUNwQixZQUFZLEVBQUUsTUFBTSxFQUFFO0dBQ3ZCO0VBQ0QsUUFBUSxFQUFFO0lBQ1IsVUFBVSxFQUFFLE1BQU0sRUFBRTtJQUNwQixTQUFTLEVBQUUsTUFBTSxFQUFFO0lBQ25CLE1BQU0sRUFBRSxNQUFNLEVBQUU7SUFDaEIsVUFBVSxFQUFFLE1BQU0sRUFBRTtHQUNyQjtFQUNELGFBQWEsRUFBRTtJQUNiLHFCQUFxQixFQUFFLE1BQU0sRUFBRTtJQUMvQixVQUFVLEVBQUUsTUFBTSxFQUFFO0lBQ3BCLE1BQU0sRUFBRSxNQUFNLEVBQUU7R0FDakI7RUFDRCxPQUFPLEVBQUU7SUFDUCxZQUFZLEVBQUUsTUFBTSxFQUFFO0lBQ3RCLDJCQUEyQixFQUFFLE1BQU0sRUFBRTtJQUNyQyxxQkFBcUIsRUFBRSxNQUFNLEVBQUU7SUFDL0IsVUFBVSxFQUFFLE1BQU0sRUFBRTtJQUNwQixVQUFVLEVBQUUsTUFBTSxFQUFFO0lBQ3BCLFdBQVcsRUFBRSxNQUFNLEVBQUU7SUFDckIsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFO0lBQzFCLGlCQUFpQixFQUFFLE1BQU0sRUFBRTtJQUMzQixVQUFVLEVBQUUsTUFBTSxFQUFFO0lBQ3BCLGNBQWMsRUFBRSxNQUFNLEVBQUU7SUFDeEIsUUFBUSxFQUFFLE1BQU0sRUFBRTtJQUNsQixnQkFBZ0IsRUFBRSxNQUFNLEVBQUU7SUFDMUIsWUFBWSxFQUFFLE1BQU0sRUFBRTtJQUN0QixnQkFBZ0IsRUFBRSxNQUFNLEVBQUU7SUFDMUIsNEJBQTRCLEVBQUUsTUFBTSxFQUFFO0lBQ3RDLGFBQWEsRUFBRSxNQUFNLEVBQUU7SUFDdkIsZUFBZSxFQUFFLE1BQU0sRUFBRTtJQUN6QixZQUFZLEVBQUUsTUFBTSxFQUFFO0lBQ3RCLG9CQUFvQixFQUFFLE1BQU0sRUFBRTtJQUM5QixtQkFBbUIsRUFBRSxNQUFNLEVBQUU7R0FDOUI7RUFDRCxXQUFXLEVBQUU7SUFDWCx3QkFBd0IsRUFBRSxNQUFNLEVBQUU7SUFDbEMsc0JBQXNCLEVBQUUsTUFBTSxFQUFFO0dBQ2pDO0VBQ0QsVUFBVSxFQUFFO0lBQ1YsT0FBTyxFQUFFLE1BQU0sRUFBRTtHQUNsQjtDQUNGLENBQUM7O0FBRUYsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDOztBQUV2QixNQUFNLFNBQVMsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFdEUsS0FBSyxNQUFNLE9BQU8sSUFBSSxPQUFPLEVBQUU7RUFDN0IsS0FBSyxNQUFNLFNBQVMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7SUFDeEMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUs7TUFDL0MsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQzFDLE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUFDRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztHQUNsQztDQUNGOzs7QUFHRCxLQUFLLE1BQU0sT0FBTyxJQUFJLE9BQU8sRUFBRTtFQUM3QixLQUFLLE1BQU0sU0FBUyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtJQUN4QyxLQUFLLE1BQU0sSUFBSSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRTtNQUM5QyxXQUFXLENBQUMsSUFBSTtRQUNkLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUM7T0FDbEMsQ0FBQztLQUNIO0dBQ0Y7Q0FDRjs7O0FBR0QsQUFBWSxNQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7O0FBRTlCLEFBQVksTUFBQyxVQUFVLEdBQUcsV0FBVzs7QUMxRjlCLE1BQU0sZUFBZSxTQUFTLEtBQUssQ0FBQztJQUN2QyxXQUFXLENBQUMsT0FBTyxFQUFFO1FBQ2pCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO0tBQzdCO0NBQ0o7O0FBRUQsQUFBTyxNQUFNLGlCQUFpQixTQUFTLEtBQUssQ0FBQztJQUN6QyxXQUFXLENBQUMsT0FBTyxFQUFFO1FBQ2pCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO0tBQzdCO0NBQ0o7O0FBRUQsQUFBTyxNQUFNLGNBQWMsU0FBUyxLQUFLLENBQUM7SUFDdEMsV0FBVyxDQUFDLE9BQU8sRUFBRTtRQUNqQixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztLQUM3QjtDQUNKOztBQUVELEFBQU8sTUFBTSxhQUFhLFNBQVMsS0FBSyxDQUFDO0lBQ3JDLFdBQVcsQ0FBQyxPQUFPLEVBQUU7UUFDakIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUM7S0FDN0I7Q0FDSjs7QUN0Qk0sTUFBTSxVQUFVLEdBQUcsT0FBTyxHQUFHLEVBQUUsY0FBYyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxLQUFLO0VBQ3BHLGFBQWEsQ0FBQyxHQUFHLEVBQUUsY0FBYyxDQUFDLENBQUM7O0VBRW5DLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDdEIsbUJBQW1CLENBQUMsR0FBRyxFQUFFLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQztJQUN2RCxPQUFPO0dBQ1I7O0VBRUQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0VBQzdCLE1BQU0sT0FBTyxHQUFHLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDOztFQUUvQyxJQUFJO0lBQ0YsTUFBTSxHQUFHLENBQUMsT0FBTztNQUNmLGNBQWMsQ0FBQyxPQUFPO01BQ3RCLFlBQVk7S0FDYixDQUFDOztJQUVGLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7O0lBRXJDLE1BQU0sZUFBZSxDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMxRSxPQUFPLE1BQU0sQ0FBQztHQUNmLENBQUMsT0FBTyxLQUFLLEVBQUU7SUFDZCxNQUFNLFlBQVksQ0FBQyxHQUFHLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEUsTUFBTSxLQUFLLENBQUM7R0FDYjtDQUNGLENBQUM7O0FBRUYsQUFBTyxNQUFNLGNBQWMsR0FBRyxDQUFDLEdBQUcsRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLEtBQUs7RUFDbEcsYUFBYSxDQUFDLEdBQUcsRUFBRSxjQUFjLENBQUMsQ0FBQzs7RUFFbkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUN0QixtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsWUFBWSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3ZELE9BQU87R0FDUjs7RUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7RUFDN0IsTUFBTSxPQUFPLEdBQUcsT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUM7O0VBRS9DLElBQUk7SUFDRixHQUFHLENBQUMsT0FBTztNQUNULGNBQWMsQ0FBQyxPQUFPO01BQ3RCLFlBQVk7S0FDYixDQUFDOztJQUVGLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDOztJQUUvQixlQUFlLENBQUMsR0FBRyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3BFLE9BQU8sTUFBTSxDQUFDO0dBQ2YsQ0FBQyxPQUFPLEtBQUssRUFBRTtJQUNkLFlBQVksQ0FBQyxHQUFHLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDaEUsTUFBTSxLQUFLLENBQUM7R0FDYjtDQUNGLENBQUM7O0FBRUYsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUUsY0FBYyxLQUFLO0VBQ2pFLE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQWlCLENBQUMsQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3JFLFlBQVksQ0FBQyxHQUFHLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxNQUFNLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztFQUM5RCxNQUFNLEdBQUcsQ0FBQztDQUNYLENBQUM7O0FBRUYsTUFBTSxhQUFhLEdBQUcsQ0FBQyxHQUFHLEVBQUUsY0FBYyxFQUFFLFVBQVUsS0FBSztFQUN6RCxNQUFNLE1BQU0sR0FBRyxRQUFRLEVBQUUsQ0FBQzs7RUFFMUIsTUFBTSxlQUFlLEdBQUcsT0FBTztJQUM3QixVQUFVLEVBQUUsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDO1FBQ2hDLFVBQVU7UUFDVixNQUFNO0lBQ1YsWUFBWSxFQUFFLE1BQU07SUFDcEIsS0FBSyxFQUFFLEVBQUU7R0FDVixDQUFDLENBQUM7O0VBRUgsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO0lBQzFCLEdBQUcsQ0FBQyxLQUFLLEdBQUcsZUFBZSxFQUFFLENBQUM7R0FDL0I7O0VBRUQsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ25CLFNBQVMsRUFBRSxjQUFjO0lBQ3pCLE1BQU07R0FDUCxDQUFDLENBQUM7Q0FDSixDQUFDOztBQUVGLE1BQU0sWUFBWSxHQUFHLENBQUMsR0FBRyxLQUFLO0VBQzVCLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO0VBQ3RCLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtJQUNoQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUM7R0FDbEI7Q0FDRixDQUFDOztBQUVGLE1BQU0sWUFBWSxHQUFHLE9BQU8sR0FBRyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSztFQUM5RSxNQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7RUFDcEMsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7RUFDaEIsR0FBRyxDQUFDLE9BQU8sR0FBRyxPQUFPLEVBQUUsQ0FBQztFQUN4QixNQUFNLEdBQUcsQ0FBQyxPQUFPO0lBQ2YsY0FBYyxDQUFDLE9BQU87SUFDdEIsR0FBRztHQUNKLENBQUM7RUFDRixZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDbkIsQ0FBQzs7QUFFRixNQUFNLGVBQWUsR0FBRyxPQUFPLEdBQUcsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxNQUFNLEtBQUs7RUFDcEYsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO0VBQzNDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0VBQzNCLFVBQVUsQ0FBQyxPQUFPLEdBQUcsT0FBTyxFQUFFLENBQUM7RUFDL0IsTUFBTSxHQUFHLENBQUMsT0FBTztJQUNmLGNBQWMsQ0FBQyxVQUFVO0lBQ3pCLFVBQVU7R0FDWCxDQUFDO0VBQ0YsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ2xCLE9BQU8sTUFBTSxDQUFDO0NBQ2YsQ0FBQzs7QUM5R0YsTUFBTSx1QkFBdUIsR0FBRyxFQUFFLENBQUM7O0FBRW5DLEFBQU8sTUFBTSxPQUFPLEdBQUcsT0FBTyxHQUFHLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBRSxVQUFVLEdBQUcsQ0FBQyxLQUFLO0VBQ25HLElBQUk7SUFDRixNQUFNLE9BQU8sR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLFlBQVksRUFBRTtjQUMvQixtQkFBbUIsQ0FBQzs7SUFFOUIsTUFBTSxJQUFJLEdBQUc7TUFDWCxPQUFPO01BQ1AsR0FBRyxFQUFFLFFBQVE7TUFDYixZQUFZLEVBQUUsbUJBQW1CO0tBQ2xDLENBQUM7O0lBRUYsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVU7TUFDNUIsUUFBUTtNQUNSLGtCQUFrQjtRQUNoQixJQUFJLENBQUMsWUFBWTtRQUNqQixJQUFJLENBQUMsT0FBTztPQUNiO0tBQ0YsQ0FBQzs7SUFFRixPQUFPLElBQUksQ0FBQztHQUNiLENBQUMsT0FBTyxDQUFDLEVBQUU7SUFDVixJQUFJLFVBQVUsSUFBSSxjQUFjLEVBQUUsRUFBRSxPQUFPLE9BQU8sQ0FBQyxFQUFFOztJQUVyRCxNQUFNLElBQUksR0FBRyxvQkFBb0I7TUFDL0IsUUFBUTtNQUNSLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0tBQ3ZDLENBQUM7O0lBRUYsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7SUFFbEQsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFO01BQ25DLE9BQU8sT0FBTyxDQUFDO0tBQ2hCOztJQUVELElBQUk7TUFDRixNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzFDLENBQUMsT0FBTyxDQUFDLEVBQUU7O0tBRVg7O0lBRUQsTUFBTSxhQUFhLEVBQUUsQ0FBQzs7SUFFdEIsT0FBTyxNQUFNLE9BQU87TUFDbEIsR0FBRyxFQUFFLFFBQVEsRUFBRSxtQkFBbUI7TUFDbEMsY0FBYyxFQUFFLFVBQVUsR0FBRyxDQUFDO0tBQy9CLENBQUM7R0FDSDtDQUNGLENBQUM7O0FBRUYsQUFBTyxNQUFNLGtCQUFrQixHQUFHLENBQUMsWUFBWSxFQUFFLFNBQVMsS0FBSyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUV6RyxNQUFNLG9CQUFvQixHQUFHLENBQUMsR0FBRyxFQUFFLE9BQU8sS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQ3hELEtBQUssQ0FBQyxHQUFHLENBQUM7RUFDVixLQUFLLEtBQUs7SUFDUixZQUFZLEVBQUUsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLE9BQU8sRUFBRSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0IsR0FBRztHQUNKLENBQUM7Q0FDSCxDQUFDLENBQUM7O0FBRUgsQUFBTyxNQUFNLFdBQVcsR0FBRyxPQUFPLEdBQUcsRUFBRSxJQUFJLEtBQUs7RUFDOUMsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7RUFFbEQsSUFBSSxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLHVCQUF1QixDQUFDLEVBQUU7SUFDL0QsSUFBSTtNQUNGLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzFDLENBQUMsT0FBTyxDQUFDLEVBQUU7O0tBRVg7R0FDRjtDQUNGLENBQUM7QUFDRixBQWtCQTtBQUNBLEFBQU8sTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQ2pDLEFBQU8sTUFBTSxRQUFRLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxPQUFPLENBQUM7O0FBRTdDLE1BQU0sYUFBYSxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxJQUFJLFVBQVUsQ0FBQyxPQUFPLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDOztBQzdFakc7QUFDQSxBQUFPLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxLQUFLLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7O0FBR3hELEFBQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVuRCxBQUFPLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQztBQUMxQixNQUFNLFVBQVUsR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM1QyxNQUFNLGFBQWEsR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hELEFBQU8sTUFBTSxPQUFPLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNuRyxBQUFPLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLEtBQUs7RUFDbEMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUdBLFNBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDdEQsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztFQUNuQixPQUFPLE9BQU8sQ0FBQ0MsTUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Q0FDN0MsQ0FBQztBQUNGLEFBQU8sTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUN0RCxBQUFPLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hFLEFBQU8sTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRTVELEFBQU8sTUFBTSxZQUFZLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQyxBQUFPLE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUMsQ0FBQztBQUNyRSxBQUFPLE1BQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzNFLEFBQU8sTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDN0UsQUFBTyxNQUFNLFFBQVEsR0FBRyxVQUFVLElBQUksT0FBTyxDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDdkcsQUFBTyxNQUFNLHNCQUFzQixHQUFHLEVBQUUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7O0FBRWpFLEFBQU8sTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsTUFBTSxXQUFXLENBQUMsR0FBRyxDQUFDO0lBQ2pFLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsU0FBUyxFQUFFO0lBQ3BELE1BQU0sRUFBRSxDQUFDLENBQUM7O0FBRWQsQUFBTyxNQUFNLFlBQVksR0FBRyxDQUFDLEdBQUcsRUFBRSxVQUFVLEtBQUssUUFBUSxDQUFDLEdBQUcsRUFBRSxNQUFNLEdBQUcsRUFBRSxNQUFNLFVBQVUsQ0FBQyxDQUFDOztBQUU1RixBQUFPLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0MsQUFBTyxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDMUMsQUFBTyxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDckMsQUFBTyxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUNDLE9BQUssQ0FBQyxDQUFDOztBQUVuQyxBQUFPLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxRQUFRLEtBQUssR0FBRyxJQUFJLE1BQU07RUFDbkQsQ0FBQyxNQUFNLEVBQUUsYUFBYSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sSUFBSSxJQUFJLEtBQUssYUFBYSxDQUFDLEdBQUcsQ0FBQztFQUNuRixJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFbEIsQUFBTyxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQUcsUUFBUSxLQUFLLEdBQUcsSUFBSSxNQUFNO0VBQ25ELENBQUMsTUFBTSxFQUFFLGFBQWEsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLGFBQWEsQ0FBQyxHQUFHLENBQUM7RUFDL0QsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRWxCLEFBQU8sTUFBTSxpQkFBaUIsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7QUFFekcsQUFBTyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNuRSxBQUFPLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMxQyxBQUFPLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEUsQUFBTyxNQUFNLHFCQUFxQixHQUFHLGNBQWMsSUFBSSxHQUFHLEtBQUssV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxjQUFjLEVBQUUsQ0FBQyxDQUFDO0FBQzFHLEFBQU8sTUFBTSxrQkFBa0IsR0FBRyxDQUFDLEdBQUcsRUFBRSxVQUFVLEtBQUsscUJBQXFCLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXhHLEFBQU8sTUFBTSx1QkFBdUIsR0FBRyxDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQUssR0FBRyxLQUFLLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUM7O0FBRXRILEFBQU8sTUFBTSxxQkFBcUIsR0FBRyxPQUFPLElBQUksdUJBQXVCLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUVyRixBQUFPLE1BQU0sSUFBSSxHQUFHLFNBQVMsSUFBSSxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRTVFLEFBQU8sTUFBTSxHQUFHLEdBQUcsU0FBUyxJQUFJLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRW5GLEFBQU8sTUFBTSxVQUFVLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdDLEFBQ08sTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDRixTQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDNUQsQUFBTyxNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDOUQsQUFBTyxNQUFNLEtBQUssR0FBRyxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLEtBQUs7RUFDbEQsSUFBSTtJQUNGLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztHQUNsQyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQ1YsT0FBTyxRQUFRLEVBQUUsQ0FBQztHQUNuQjtDQUNGLENBQUM7O0FBRUYsQUFBTyxNQUFNLFVBQVUsR0FBRyxRQUFRLElBQUksT0FBTyxJQUFJLEVBQUUsR0FBRyxJQUFJLEtBQUs7RUFDN0QsSUFBSTtJQUNGLE9BQU8sTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0dBQ3hDLENBQUMsT0FBTyxDQUFDLEVBQUU7SUFDVixPQUFPLE1BQU0sUUFBUSxFQUFFLENBQUM7R0FDekI7Q0FDRixDQUFDOztBQUVGLEFBQU8sTUFBTSxXQUFXLEdBQUcsQ0FBQyxJQUFJLEVBQUUsV0FBVyxLQUFLO0VBQ2hELElBQUk7SUFDRixPQUFPLElBQUksRUFBRSxDQUFDO0dBQ2YsQ0FBQyxPQUFPLEdBQUcsRUFBRTtJQUNaLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDaEQsTUFBTSxHQUFHLENBQUM7R0FDWDtDQUNGLENBQUM7O0FBRUYsQUFBTyxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUM1QyxBQUFPLE1BQU0sZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7QUFDNUQsQUFBTyxNQUFNLGVBQWUsR0FBRyxDQUFDLElBQUksS0FBSztFQUN2QyxJQUFJO0lBQ0YsSUFBSSxFQUFFLENBQUM7SUFDUCxPQUFPLEtBQUssQ0FBQztHQUNkLENBQUMsT0FBTyxDQUFDLEVBQUU7SUFDVixPQUFPLElBQUksQ0FBQztHQUNiO0NBQ0YsQ0FBQzs7QUFFRixBQUFPLE1BQU0sd0JBQXdCLEdBQUcsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV2RSxBQUFPLE1BQU0sZUFBZSxHQUFHLGdCQUFnQixJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDOztBQUVyRixBQUFPLE1BQU0sd0JBQXdCLEdBQUcsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUVuRSxBQUFPLE1BQU0sVUFBVSxHQUFHLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQyxLQUFLLEtBQUs7RUFDakQsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDN0MsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7O0VBRS9DLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU87RUFDM0IsSUFBSSxRQUFRLEVBQUUsS0FBSyxJQUFJLEVBQUUsT0FBTyxVQUFVLEVBQUUsQ0FBQztFQUM3QyxPQUFPLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0NBQzFDLENBQUM7O0FBRUYsQUFBTyxNQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksSUFBSSxLQUFLLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQztBQUN2RCxBQUFPLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLEtBQUssR0FBRyxJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvRCxBQUFPLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxQyxBQUFPLE1BQU0sYUFBYSxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzs7QUFHMUUsQUFBTyxNQUFNLFVBQVUsR0FBRyxTQUFTLElBQUksUUFBUSxJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBRW5GLEFBQU8sTUFBTSxRQUFRLEdBQUcsR0FBRyxJQUFJLEtBQUssS0FBSyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFaEYsQUFBTyxNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUMsS0FBSztFQUNoQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFDO0VBQ0osSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQztFQUMvQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNwQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2QixJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQztJQUNuQyxJQUFJLElBQUksQ0FBQyxDQUFDO0dBQ1g7OztFQUdELElBQUksSUFBSSxHQUFHLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7RUFDdEQsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7Q0FDeEIsQ0FBQzs7O0FBR0YsQUFBTyxNQUFNLElBQUksR0FBRyxPQUFPLE9BQU8sS0FBSztFQUNyQyxJQUFJO0lBQ0YsTUFBTSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUM7SUFDN0IsT0FBTyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztHQUM1QixDQUFDLE9BQU8sS0FBSyxFQUFFO0lBQ2QsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztHQUMzQjtDQUNGLENBQUM7O0FBRUYsQUFBTyxNQUFNLGFBQWEsR0FBRyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztPQUN2QyxDQUFDLElBQUksTUFBTSxDQUFDLGdCQUFnQjtPQUM1QixDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQzs7QUFFeEMsQUFBTyxNQUFNLFlBQVksR0FBRyxDQUFDLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUk7SUFDOUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pDLEFBQU8sTUFBTSxZQUFZLEdBQUcsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJO0lBQzlDLENBQUMsS0FBSyxNQUFNLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO0FBQ2hDLEFBQU8sTUFBTSxjQUFjLEdBQUcsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJO0lBQ2hELFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVqQixBQUFPLE1BQU0sZUFBZSxHQUFHLElBQUksSUFBSUEsU0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFNUUsQUFBTyxNQUFNLEtBQUssR0FBRyxNQUFNLFFBQVEsSUFBSSxJQUFJLE9BQU8sQ0FBQyxHQUFHLElBQUksVUFBVSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDOztBQUVyRixBQUFPLE1BQU0sS0FBSyxHQUFHLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLEtBQUs7RUFDMUQsSUFBSTtJQUNGLE9BQU8sTUFBTSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztHQUMxQixDQUFDLE9BQU8sR0FBRyxFQUFFO0lBQ1osSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO01BQ2YsT0FBTyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxNQUFNLEtBQUssQ0FBQyxFQUFFLEdBQUcsT0FBTyxHQUFHLENBQUMsR0FBRyxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQzVGO0lBQ0QsTUFBTSxHQUFHLENBQUM7R0FDWDtDQUNGLENBQUM7QUFDRixBQU9BO0FBQ0EsWUFBZTtFQUNiLFFBQVE7RUFDUixZQUFZO0VBQ1osU0FBUztFQUNULFNBQVM7RUFDVCxRQUFRO0VBQ1IsT0FBTztFQUNQLFdBQVc7RUFDWCx1QkFBdUI7RUFDdkIscUJBQXFCO0VBQ3JCLFlBQVk7RUFDWixnQkFBZ0I7RUFDaEIsU0FBUztFQUNULEdBQUc7RUFDSCxVQUFVO0VBQ1YsV0FBVztFQUNYLFVBQVU7RUFDVixRQUFRO0VBQ1IsbUJBQW1CO0VBQ25CLGVBQWU7RUFDZix3QkFBd0I7RUFDeEIsS0FBSztFQUNMLFdBQVc7RUFDWCxVQUFVO0VBQ1YsZ0JBQWdCO0VBQ2hCLFFBQVE7RUFDUixNQUFNO0VBQ04sQ0FBQztFQUNELEVBQUU7RUFDRixZQUFZO0VBQ1osY0FBYztFQUNkLFFBQVE7RUFDUixrQkFBa0I7RUFDbEIsc0JBQXNCO0VBQ3RCLE9BQU87RUFDUCxxQkFBcUI7RUFDckIsaUJBQWlCO0VBQ2pCLE9BQU87RUFDUCxHQUFHO0VBQ0gsT0FBTztFQUNQLGFBQWE7RUFDYixXQUFXO0VBQ1gsT0FBTztFQUNQLGVBQWU7RUFDZixlQUFlO0VBQ2Ysd0JBQXdCO0VBQ3hCLElBQUk7RUFDSixXQUFXO0VBQ1gsSUFBSTtFQUNKLFVBQVU7RUFDVixNQUFNO0VBQ04sVUFBVTtFQUNWLGdCQUFnQjtFQUNoQixhQUFhO0VBQ2IsUUFBUTtFQUNSLE1BQU0sRUFBRSxZQUFZO0VBQ3BCLE1BQU0sRUFBRSxZQUFZO0VBQ3BCLGVBQWU7RUFDZixPQUFPO0VBQ1AsT0FBTztFQUNQLFFBQVE7RUFDUixpQkFBaUI7RUFDakIsS0FBSztFQUNMLEtBQUs7Q0FDTixDQUFDOztBQzFRSyxNQUFNLGNBQWMsR0FBRyxDQUFDLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOztBQUV6RSxBQUFPLE1BQU0sUUFBUSxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7O0FBRS9FLEFBQU8sTUFBTSxlQUFlLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxNQUFNLEVBQUUsR0FBRyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQzs7QUFFbkUsQUFBTyxNQUFNLFlBQVksR0FBRyxPQUFPLElBQUksY0FBYyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUU7RUFDbEUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUM5QixNQUFNLENBQUMsV0FBVyxDQUFDO0NBQ3BCLENBQUMsQ0FBQzs7QUFFSCxBQUFPLE1BQU0sU0FBUyxHQUFHLGNBQWMsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7SUFDNUUsSUFBSTtJQUNKLGVBQWUsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQzs7QUNUcEMsTUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUM7QUFDNUMsQUFBTyxNQUFNLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQztBQUM5QyxBQUFPLE1BQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQztBQUN0QyxBQUFPLE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQztBQUN4QyxBQUdBOztBQUVBLE1BQU0saUJBQWlCLEdBQUcsT0FBTztFQUMvQixPQUFPLEVBQUUsS0FBSztFQUNkLFlBQVksRUFBRSxJQUFJO0VBQ2xCLE1BQU0sRUFBRSxJQUFJO0NBQ2IsQ0FBQyxDQUFDOztBQUVILEFBQU8sTUFBTSxhQUFhLEdBQUcsS0FBSyxJQUFJRyxtQkFBaUIsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXRFLEFBQU8sTUFBTSxVQUFVLEdBQUcsS0FBSyxJQUFJQyxhQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUUxRCxBQUFPLE1BQU0sWUFBWSxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssS0FBSztFQUM3QyxNQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDO0VBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sSUFBSSxDQUFDOztFQUUvQixNQUFNLGNBQWMsR0FBRyxXQUFXO0lBQ2hDLE1BQU0sYUFBYSxDQUFDLEtBQUssQ0FBQztJQUMxQixhQUFhO0dBQ2QsQ0FBQzs7RUFFRixPQUFPLFdBQVc7SUFDaEIsTUFBTSxjQUFjLENBQUMsT0FBTyxDQUFDO0lBQzdCLFVBQVU7R0FDWCxDQUFDO0NBQ0gsQ0FBQzs7QUFFRixBQUFPLE1BQU0sU0FBUyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssS0FBSztFQUMxQyxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDdEMsTUFBTSxPQUFPLEdBQUcsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLENBQUM7O0VBRXhDLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxxQkFBcUIsQ0FBQzs7RUFFMUQsTUFBTSxXQUFXLEdBQUcsV0FBVztJQUM3QixNQUFNQSxhQUFXLENBQUMsR0FBRyxDQUFDO0lBQ3RCLFVBQVU7R0FDWCxDQUFDOztFQUVGLE1BQU0sTUFBTSxHQUFHLFdBQVc7SUFDeEIsTUFBTSxXQUFXLENBQUMsT0FBTyxDQUFDO0lBQzFCLE9BQU87R0FDUixDQUFDOztFQUVGLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUNoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUMxQyxNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVELElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO01BQzNCLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3BCO0dBQ0Y7O0VBRUQsTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO0VBQ3hCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLFVBQVU7TUFDN0JBLGFBQVcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDO01BQ3RDLE1BQU0sQ0FBQyxFQUFFLENBQUM7O0VBRWQsT0FBTyxNQUFNLENBQUM7Q0FDZixDQUFDOztBQUVGLEFBQU8sTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxLQUFLO0VBQzNDLE1BQU0sTUFBTSxHQUFHLGlCQUFpQixFQUFFLENBQUM7O0VBRW5DLElBQUk7SUFDRixNQUFNLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDbkQsQ0FBQyxPQUFPLEdBQUcsRUFBRTtJQUNaLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLE1BQU0sQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0lBQzVCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztHQUM3Qjs7RUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxPQUFPLE1BQU0sQ0FBQzs7RUFFeEMsSUFBSTtJQUNGLE1BQU0sQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztHQUMxQyxDQUFDLE9BQU8sR0FBRyxFQUFFO0lBQ1osTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDdEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO0dBQzdCOztFQUVELE9BQU8sTUFBTSxDQUFDO0NBQ2YsQ0FBQzs7QUNyRkssTUFBTSxVQUFVLEdBQUcsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsQ0FBQzs7QUFFM0UsQUFBTyxNQUFNLFlBQVksR0FBRztFQUMxQixRQUFRLENBQUMsS0FBSyxFQUFFLDJCQUEyQjtJQUN6QyxLQUFLLElBQUksZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ3ZDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsdUNBQXVDO0lBQ3JELEtBQUssSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7bUJBQ3RCLHdCQUF3QixDQUFDLE1BQU0sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7RUFDbkUsUUFBUSxDQUFDLFFBQVEsRUFBRSwwQ0FBMEM7SUFDM0QsS0FBSyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQzttQkFDekIsd0JBQXdCLENBQUMsTUFBTSxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztFQUN0RSxRQUFRLENBQUMsTUFBTSxFQUFFLCtCQUErQjtJQUM5QyxLQUFLLElBQUksZ0JBQWdCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3hDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsK0NBQStDO0lBQzlELEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQzttQkFDYixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDM0UsUUFBUSxDQUFDLFdBQVcsRUFBRSxpREFBaUQ7SUFDckUsS0FBSyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7cUJBQ2hCLEtBQUssQ0FBQyxTQUFTLEtBQUssVUFBVSxDQUFDLFNBQVMsQ0FBQztFQUM1RCxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsMkJBQTJCLEVBQUVILE1BQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hGLEtBQUssSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0NBQ3hELENBQUM7O0FDbkJLLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxZQUFZLEVBQUUsU0FBUyxHQUFHLElBQUksS0FBSztFQUN2RSxJQUFJLFdBQVcsQ0FBQyxZQUFZLENBQUMscUJBQXFCLENBQUMsSUFBSSxTQUFTLEVBQUUsRUFBRSxPQUFPLFlBQVksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLEVBQUU7O0VBRWxILE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxXQUFXLEVBQUUsU0FBUyxLQUFLO0lBQ25ELFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDNUIsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLFFBQVE7ZUFDZixXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDO2dCQUNoQyxDQUFDLFdBQVcsQ0FBQyxPQUFPO2VBQ3JCLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztnQkFDaEMsQ0FBQyxXQUFXLENBQUMsZUFBZTtlQUM3QixXQUFXLENBQUMsZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsRUFBRTtNQUNwRCxPQUFPLFNBQVMsQ0FBQztLQUNsQjs7SUFFRCxNQUFNLFVBQVUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7O0lBRXhELE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUU7TUFDckIsVUFBVSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7TUFDaEMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUM7TUFDL0IsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUM7S0FDeEMsQ0FBQyxDQUFDOztJQUVILEtBQUssTUFBTSxLQUFLLElBQUksUUFBUSxFQUFFO01BQzVCLGdCQUFnQixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztLQUNwQztJQUNELE9BQU8sU0FBUyxDQUFDO0dBQ2xCLENBQUM7O0VBRUYsWUFBWSxDQUFDLHFCQUFxQixHQUFHLE1BQU0sZ0JBQWdCLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQzlFLE9BQU8sWUFBWSxDQUFDLHFCQUFxQixFQUFFLENBQUM7Q0FDN0MsQ0FBQzs7QUFFRixBQUFPLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFM0QsQUFBTyxNQUFNLGNBQWMsR0FBRyxZQUFZLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUU7RUFDbkUscUJBQXFCO0VBQ3JCLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDckQsQ0FBQyxDQUFDOztBQUVILEFBQU8sTUFBTSxtQkFBbUIsR0FBRyxZQUFZLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUU7RUFDeEUscUJBQXFCO0VBQ3JCLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNwRCxDQUFDLENBQUM7O0FBRUgsQUFBTyxNQUFNLHdCQUF3QixHQUFHLFlBQVksSUFBSSxhQUFhLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRTtFQUN2RixxQkFBcUI7RUFDckIsSUFBSSxDQUFDLENBQUMsS0FBSyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7c0JBQ1osSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Q0FDbkYsQ0FBQyxDQUFDOztBQUVILEFBQU8sTUFBTSxtQkFBbUIsR0FBRyxpQkFBaUIsSUFBSSxhQUFhLElBQUksVUFBVTs7RUFFakYsQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUMvQixRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7O0VBRWxCLENBQUMsSUFBSSxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUN2QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7O0VBRWpCLENBQUMsV0FBVztJQUNWLElBQUksSUFBSSxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDOztDQUVqRSxDQUFDLGFBQWEsQ0FBQyxDQUFDOztBQUVqQixBQUFPLE1BQU0sT0FBTyxHQUFHLENBQUMsWUFBWSxFQUFFLE9BQU8sS0FBSyxDQUFDLENBQUMsWUFBWSxFQUFFO0VBQ2hFLHFCQUFxQjtFQUNyQixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxPQUFPO3NCQUNiLGtCQUFrQixDQUFDLENBQUMsQ0FBQzt5QkFDbEIsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLEtBQUssT0FBTyxDQUFDLENBQUM7Q0FDM0QsQ0FBQyxDQUFDOztBQUVILEFBQU8sTUFBTSxpQkFBaUIsR0FBRyxDQUFDLFlBQVksRUFBRSxPQUFPLEtBQUssQ0FBQyxDQUFDLFlBQVksRUFBRTtFQUMxRSxxQkFBcUI7RUFDckIsSUFBSSxDQUFDLENBQUMsS0FBSyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7dUJBQ1gsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLEtBQUssT0FBTyxDQUFDLENBQUM7Q0FDekQsQ0FBQyxDQUFDOztBQUVILEFBQU8sTUFBTSxxQkFBcUIsR0FBRyxDQUFDLFlBQVksRUFBRSxZQUFZLEtBQUs7RUFDbkUsTUFBTSxTQUFTLEdBQUcsbUJBQW1CLENBQUMsWUFBWSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7RUFDbEUsT0FBTyxTQUFTLENBQUMsU0FBUyxDQUFDO01BQ3ZCLE9BQU8sQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDO01BQ25DLFNBQVMsQ0FBQztDQUNmLENBQUM7O0FBRUYsQUFBTyxNQUFNLCtCQUErQixHQUFHLENBQUMsWUFBWSxFQUFFLFlBQVksS0FBSztFQUM3RSxNQUFNLFNBQVMsR0FBRyx3QkFBd0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztFQUN2RSxPQUFPLFNBQVMsQ0FBQyxTQUFTLENBQUM7TUFDdkIsaUJBQWlCLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQztNQUM3QyxTQUFTLENBQUM7Q0FDZixDQUFDOztBQUVGLEFBQU8sTUFBTSxNQUFNLEdBQUcsQ0FBQyxZQUFZLEVBQUUsR0FBRyxLQUFLLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztBQUVqRyxBQUFPLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxhQUFhLEVBQUUsY0FBYyxLQUFLLENBQUMsQ0FBQyxjQUFjLEVBQUU7RUFDdkYsUUFBUTtFQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxDQUFDO0VBQ3BDLEVBQUUsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7Q0FDckIsQ0FBQyxDQUFDOztBQUVILEFBQU8sTUFBTSxZQUFZLEdBQUcsQ0FBQyxHQUFHLEtBQUs7RUFDbkMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFO0lBQ1osUUFBUTtJQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUM5QixPQUFPO0dBQ1IsQ0FBQyxDQUFDO0NBQ0osQ0FBQzs7QUFFRixBQUFPLE1BQU0sZUFBZSxHQUFHLFdBQVcsSUFBSSxhQUFhLElBQUksbUJBQW1CLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxXQUFXLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFcEksQUFBTyxNQUFNLHNCQUFzQixHQUFHLGVBQWUsSUFBSSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFN0csQUFBTyxNQUFNLFNBQVMsR0FBRyxDQUFDLFVBQVUsRUFBRSxTQUFTLEtBQUssSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFdEcsQUFBTyxNQUFNLFVBQVUsR0FBRyxTQUFTLElBQUksUUFBUSxJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFbEcsQUFBTyxNQUFNLFdBQVcsR0FBRyxRQUFRLElBQUksU0FBUyxJQUFJLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFcEYsQUFBTyxNQUFNLGVBQWUsR0FBRyxTQUFTLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRTtFQUN2RCxRQUFRO0VBQ1IsSUFBSTtFQUNKLHFCQUFxQjtDQUN0QixDQUFDLENBQUM7O0FBRUgsQUFBTyxNQUFNLHFCQUFxQixHQUFHLFFBQVEsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDOztBQUU1RixBQUFPLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUU7RUFDckUscUJBQXFCO0VBQ3JCLElBQUksQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQzt1QkFDQSxDQUFDLENBQUMsTUFBTSxLQUFLLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0NBQ25FLENBQUMsQ0FBQzs7QUFFSCxBQUFPLE1BQU0scUJBQXFCLEdBQUcsU0FBUyxJQUFJLE1BQU0sSUFBSSxTQUFTLENBQUMsb0JBQW9CLENBQUMsTUFBTSxLQUFLLENBQUM7T0FDaEcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOztBQUV4RCxBQUFPLE1BQU0sbUJBQW1CLEdBQUcsU0FBUyxJQUFJLFVBQVUsSUFBSSxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWxILEFBQU8sTUFBTSw2QkFBNkIsR0FBRyxDQUFDLFlBQVksRUFBRSxTQUFTLEtBQUs7RUFDeEUsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLFlBQVksRUFBRTtJQUNsQyxxQkFBcUI7SUFDckIsTUFBTSxDQUFDLFFBQVEsQ0FBQztHQUNqQixDQUFDLENBQUM7O0VBRUgsSUFBSSxhQUFhLENBQUMsU0FBUyxDQUFDLEVBQUU7SUFDNUIsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFO01BQ3BCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUN2QyxDQUFDLENBQUM7R0FDSjs7RUFFRCxJQUFJLGVBQWUsQ0FBQyxTQUFTLENBQUMsRUFBRTtJQUM5QixPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUU7TUFDcEIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztNQUN2QyxNQUFNLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDdkMsQ0FBQyxDQUFDO0dBQ0o7O0VBRUQsSUFBSSxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsRUFBRTtJQUMvQixPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUU7TUFDcEIsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsNkJBQTZCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDdEUsQ0FBQyxDQUFDO0dBQ0o7Q0FDRixDQUFDOztBQUVGLEFBQU8sTUFBTSxzQkFBc0IsR0FBRyxTQUFTLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUU7RUFDdEUscUJBQXFCO0VBQ3JCLElBQUksQ0FBQyxDQUFDLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQztDQUM3QyxDQUFDLENBQUM7O0FBRUgsQUFBTyxNQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDO0FBQzVFLEFBQU8sTUFBTSxjQUFjLEdBQUcsSUFBSSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ3RFLEFBQU8sTUFBTSxrQkFBa0IsR0FBRyxJQUFJLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUMzRSxBQUFPLE1BQU0sT0FBTyxHQUFHLElBQUksSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPLENBQUM7QUFDMUUsQUFBTyxNQUFNLGdCQUFnQixHQUFHLElBQUksSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxnQkFBZ0IsQ0FBQztBQUM1RixBQUFPLE1BQU0sY0FBYyxHQUFHLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzNGLEFBQU8sTUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDakUsQUFBTyxNQUFNLG9CQUFvQixHQUFHLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xFLEFBQU8sTUFBTSxhQUFhLEdBQUcsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDNUUsQUFBTyxNQUFNLGdCQUFnQixHQUFHLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxVQUFVLENBQUMsU0FBUyxDQUFDO0FBQ2pHLEFBQU8sTUFBTSxlQUFlLEdBQUcsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFVBQVUsQ0FBQyxRQUFRLENBQUM7O0FBRS9GLEFBQU8sTUFBTSw0QkFBNEIsR0FBRyxJQUFJLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssV0FBVztPQUNoRixZQUFZLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQ3pGLE1BQU0sR0FBRyxDQUFDLENBQUM7O0FBRWxCLEFBQU8sTUFBTSw2QkFBNkIsR0FBRyxTQUFTLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssV0FBVztPQUN0RixZQUFZLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7T0FDM0UsTUFBTSxHQUFHLENBQUMsQ0FBQzs7QUFFbEIsZ0JBQWU7RUFDYixnQkFBZ0I7RUFDaEIsY0FBYztFQUNkLG1CQUFtQjtFQUNuQixtQkFBbUI7RUFDbkIsT0FBTztFQUNQLHFCQUFxQjtFQUNyQixNQUFNO0VBQ04sb0JBQW9CO0VBQ3BCLFlBQVk7RUFDWixlQUFlO0VBQ2Ysc0JBQXNCO0VBQ3RCLFNBQVM7RUFDVCxVQUFVO0VBQ1YsV0FBVztFQUNYLGVBQWU7RUFDZixxQkFBcUI7RUFDckIsaUJBQWlCO0VBQ2pCLHFCQUFxQjtFQUNyQixtQkFBbUI7RUFDbkIsNkJBQTZCO0VBQzdCLHNCQUFzQjtFQUN0QixRQUFRO0VBQ1Isa0JBQWtCO0VBQ2xCLE9BQU87RUFDUCxnQkFBZ0I7RUFDaEIsY0FBYztFQUNkLE1BQU07RUFDTixvQkFBb0I7RUFDcEIsYUFBYTtFQUNiLGdCQUFnQjtFQUNoQixlQUFlO0VBQ2YsNEJBQTRCO0VBQzVCLDZCQUE2QjtFQUM3QixxQkFBcUI7Q0FDdEIsQ0FBQzs7QUNsT0ssTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFFBQVEsRUFBRSxxQkFBcUIsS0FBSyxDQUFDLEtBQUssRUFBRSxNQUFNLEtBQUs7RUFDeEYsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0lBQzNCLE9BQU8sa0JBQWtCLENBQUMsUUFBUSxFQUFFLHFCQUFxQixDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQ2hGO0VBQ0QsT0FBTyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDO0NBQ3pELENBQUM7O0FBRUYsQUFBTyxNQUFNLGtCQUFrQixHQUFHLENBQUMsUUFBUSxFQUFFLHFCQUFxQixLQUFLLENBQUMsS0FBSyxLQUFLO0VBQ2hGLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUMvQixJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7SUFDbEIsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO0dBQ3JCO0VBQ0QsT0FBTyxxQkFBcUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztDQUN4QyxDQUFDOztBQUVGLEFBQU8sTUFBTSxXQUFXLEdBQUcsQ0FBQyxRQUFRLEVBQUUscUJBQXFCLEtBQUssQ0FBQyxLQUFLLEtBQUs7RUFDekUsTUFBTSxlQUFlLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDO01BQzVFLFNBQVM7TUFDVCxLQUFLLENBQUMsZUFBZSxDQUFDOztFQUUxQixPQUFPLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQztNQUM5QyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsRUFBRTtNQUN4QyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUscUJBQXFCLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztDQUMxRSxDQUFDOztBQUVGLEFBQU8sTUFBTSxhQUFhLEdBQUcsaUJBQWlCLElBQUksS0FBSyxDQUFDO0VBQ3RELEtBQUssRUFBRSxRQUFRO0VBQ2YsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUM7Q0FDckIsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDOztBQUV0QixBQUFPLE1BQU0sdUJBQXVCLEdBQUcsZUFBZSxJQUFJLE9BQU8sS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLEtBQUs7RUFDMUYsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUN0QyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUM7TUFDckYsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQztNQUMzQyxFQUFFLENBQUMsQ0FBQzs7RUFFUixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7RUFDbEIsS0FBSyxNQUFNLENBQUMsSUFBSSxlQUFlLEVBQUU7SUFDL0IsTUFBTSxHQUFHLEdBQUcsTUFBTSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUN2Qzs7RUFFRCxPQUFPLE1BQU0sQ0FBQztDQUNmLENBQUM7O0FBRUYsTUFBTSxpQkFBaUIsR0FBRyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFekQsQUFBTyxNQUFNSSxVQUFRLEdBQUcsQ0FBQyxPQUFPLEVBQUUsVUFBVSxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7QUFDM0UsQUFBTyxNQUFNLFlBQVksR0FBRyxHQUFHLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3BFLEFBQU8sTUFBTSxhQUFhLEdBQUcsR0FBRyxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNwRSxBQUFPLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxTQUFTLE1BQU07RUFDaEgsTUFBTSxFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDO0VBQ3hDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDO0VBQ3ZELGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDO0VBQ3ZELFFBQVE7RUFDUixJQUFJO0VBQ0osaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7RUFDOUQsaUJBQWlCLEVBQUUsT0FBTztFQUMxQix1QkFBdUIsRUFBRSx1QkFBdUIsQ0FBQyxlQUFlLENBQUM7RUFDakUsV0FBVztFQUNYLFNBQVMsRUFBRSxHQUFHLEtBQUssR0FBRyxLQUFLLElBQUksSUFBSSxHQUFHLEtBQUssU0FBUztNQUNoRCxFQUFFLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ3hCLGVBQWUsRUFBRSxTQUFTLENBQUMsT0FBTztDQUNuQyxDQUFDLENBQUM7O0FDekRILE1BQU0sZUFBZSxHQUFHLGFBQWEsQ0FBQztFQUNwQyxPQUFPLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQztDQUN4QixDQUFDLENBQUM7O0FBRUgsTUFBTSxjQUFjLEdBQUcsVUFBVTtFQUMvQixDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUM7RUFDekIsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDO0VBQ3ZCLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Q0FDaEQsQ0FBQzs7QUFFRixNQUFNLE9BQU8sR0FBRztFQUNkLFNBQVMsRUFBRTtJQUNULFlBQVksRUFBRSxJQUFJO0lBQ2xCLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDckQsc0JBQXNCLEVBQUUsbUVBQW1FO0lBQzNGLEtBQUssRUFBRSxjQUFjO0dBQ3RCO0VBQ0QsTUFBTSxFQUFFO0lBQ04sWUFBWSxFQUFFLElBQUk7SUFDbEIsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUNwRixzQkFBc0IsRUFBRSxxRUFBcUU7SUFDN0YsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDO0dBQ2Q7RUFDRCx1QkFBdUIsRUFBRTtJQUN2QixZQUFZLEVBQUUsS0FBSztJQUNuQixPQUFPLEVBQUUsU0FBUztJQUNsQixzQkFBc0IsRUFBRSwrQ0FBK0M7SUFDdkUsS0FBSyxFQUFFLFlBQVk7R0FDcEI7Q0FDRixDQUFDOztBQUVGLE1BQU0sZUFBZSxHQUFHO0VBQ3RCQSxVQUFRLENBQUMsT0FBTyxHQUFHLEVBQUUsSUFBSSxLQUFLLEdBQUcsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxJQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUztJQUNuRyxDQUFDLEdBQUcsRUFBRSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztFQUNyRUEsVUFBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLElBQUksS0FBSyxHQUFHLEtBQUssSUFBSTs4QkFDZCxJQUFJLENBQUMsdUJBQXVCLEtBQUssS0FBSzs4QkFDdEMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7RUFDdEQsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7Q0FDbEUsQ0FBQzs7QUFFRixhQUFlLGdCQUFnQjtFQUM3QixRQUFRO0VBQ1IsY0FBYztFQUNkLGVBQWU7RUFDZixPQUFPO0VBQ1AsZUFBZTtFQUNmLE9BQU87RUFDUCxHQUFHLElBQUksR0FBRztDQUNYLENBQUM7O0FDbkRGLE1BQU0sYUFBYSxHQUFHLGFBQWEsQ0FBQztFQUNsQyxPQUFPLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQztDQUN4QixDQUFDLENBQUM7O0FBRUgsTUFBTSxZQUFZLEdBQUcsVUFBVTtFQUM3QixDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUM7RUFDMUIsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDO0VBQ3ZCLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLE1BQU0sYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzlELENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFLE1BQU0sYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQ2hFLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQztDQUM1QixDQUFDOztBQUVGLE1BQU1DLFNBQU8sR0FBRztFQUNkLFVBQVUsRUFBRTtJQUNWLFlBQVksRUFBRSxJQUFJO0lBQ2xCLE9BQU8sRUFBRSxTQUFTO0lBQ2xCLHNCQUFzQixFQUFFLHlCQUF5QjtJQUNqRCxLQUFLLEVBQUUsWUFBWTtHQUNwQjtDQUNGLENBQUM7O0FBRUYsTUFBTUMsaUJBQWUsR0FBRztFQUN0QkYsVUFBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLElBQUksS0FBSyxJQUFJLENBQUMsVUFBVSxLQUFLLElBQUksSUFBSSxHQUFHLEtBQUssSUFBSTtJQUNwRSxNQUFNLHNCQUFzQixDQUFDO0NBQ2hDLENBQUM7O0FBRUYsV0FBZSxnQkFBZ0I7RUFDN0IsTUFBTSxFQUFFLFlBQVksRUFBRSxhQUFhO0VBQ25DQyxTQUFPLEVBQUVDLGlCQUFlLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTO0NBQy9DLENBQUM7O0FDM0JGLE1BQU0sZUFBZSxHQUFHLGFBQWEsQ0FBQztFQUNwQyxPQUFPLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQztDQUN4QixDQUFDLENBQUM7O0FBRUgsTUFBTSx5QkFBeUIsR0FBRyxDQUFDLENBQUMsS0FBSztFQUN2QyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDdEIsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUMxRCxDQUFDOztBQUVGLE1BQU0sY0FBYyxHQUFHLFVBQVU7RUFDL0IsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDO0VBQ3pCLENBQUMsUUFBUSxFQUFFLHlCQUF5QixDQUFDO0VBQ3JDLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQztFQUN2QixDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUM7Q0FDNUIsQ0FBQzs7QUFFRixNQUFNRCxTQUFPLEdBQUc7RUFDZCxRQUFRLEVBQUU7SUFDUixZQUFZLEVBQUUsTUFBTSxDQUFDLGdCQUFnQjtJQUNyQyxPQUFPLEVBQUUsYUFBYTtJQUN0QixzQkFBc0IsRUFBRSx5QkFBeUI7SUFDakQsS0FBSyxFQUFFLGNBQWM7R0FDdEI7RUFDRCxRQUFRLEVBQUU7SUFDUixZQUFZLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0I7SUFDekMsT0FBTyxFQUFFLGFBQWE7SUFDdEIsc0JBQXNCLEVBQUUseUJBQXlCO0lBQ2pELEtBQUssRUFBRSxjQUFjO0dBQ3RCO0VBQ0QsYUFBYSxFQUFFO0lBQ2IsWUFBWSxFQUFFLENBQUM7SUFDZixPQUFPLEVBQUUsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUN4QyxzQkFBc0IsRUFBRSw0QkFBNEI7SUFDcEQsS0FBSyxFQUFFLGNBQWM7R0FDdEI7Q0FDRixDQUFDOztBQUVGLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxHQUFHLEtBQUs7RUFDaEMsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUMvQyxJQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0VBQ3hDLE9BQU8sWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztDQUMvQixDQUFDOztBQUVGLE1BQU1DLGlCQUFlLEdBQUc7RUFDdEJGLFVBQVEsQ0FBQyxPQUFPLEdBQUcsRUFBRSxJQUFJLEtBQUssR0FBRyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVE7SUFDMUYsQ0FBQyxHQUFHLEVBQUUsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztFQUMvRkEsVUFBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLElBQUksS0FBSyxHQUFHLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUTtJQUMxRixDQUFDLEdBQUcsRUFBRSxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDcEdBLFVBQVEsQ0FBQyxPQUFPLEdBQUcsRUFBRSxJQUFJLEtBQUssR0FBRyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLGdCQUFnQixDQUFDLEdBQUcsQ0FBQztJQUN2RixDQUFDLEdBQUcsRUFBRSxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDLENBQUM7Q0FDckcsQ0FBQzs7QUFFRixhQUFlLGdCQUFnQjtFQUM3QixRQUFRO0VBQ1IsY0FBYztFQUNkLGVBQWU7RUFDZkMsU0FBTztFQUNQQyxpQkFBZTtFQUNmLENBQUM7RUFDRCxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRTtDQUN0QixDQUFDOztBQzdERixNQUFNLGFBQWEsR0FBRyxhQUFhLENBQUM7RUFDbEMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUM7RUFDdkIsR0FBRyxFQUFFLE1BQU0sSUFBSSxJQUFJLEVBQUU7Q0FDdEIsQ0FBQyxDQUFDOztBQUVILE1BQU0sV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV4RCxNQUFNLGlCQUFpQixHQUFHLENBQUMsSUFBSSxVQUFVO0VBQ3ZDLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQztFQUM1QixDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUM7Q0FDNUIsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7QUFHZixNQUFNLFlBQVksR0FBRyxVQUFVO0VBQzdCLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQztFQUN2QixDQUFDLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQztFQUM3QixDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUM7RUFDdkIsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDO0NBQzVCLENBQUM7O0FBRUYsTUFBTUQsU0FBTyxHQUFHO0VBQ2QsUUFBUSxFQUFFO0lBQ1IsWUFBWSxFQUFFLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUN0QyxPQUFPLEVBQUUsTUFBTTtJQUNmLHNCQUFzQixFQUFFLHNCQUFzQjtJQUM5QyxLQUFLLEVBQUUsWUFBWTtHQUNwQjtFQUNELFFBQVEsRUFBRTtJQUNSLFlBQVksRUFBRSxJQUFJLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQztJQUN0QyxPQUFPLEVBQUUsTUFBTTtJQUNmLHNCQUFzQixFQUFFLHNCQUFzQjtJQUM5QyxLQUFLLEVBQUUsWUFBWTtHQUNwQjtDQUNGLENBQUM7O0FBRUYsTUFBTUMsaUJBQWUsR0FBRztFQUN0QkYsVUFBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLElBQUksS0FBSyxHQUFHLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUTtJQUMxRixDQUFDLEdBQUcsRUFBRSxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLG1DQUFtQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0VBQy9GQSxVQUFRLENBQUMsT0FBTyxHQUFHLEVBQUUsSUFBSSxLQUFLLEdBQUcsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRO0lBQzFGLENBQUMsR0FBRyxFQUFFLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsZ0NBQWdDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztDQUNyRyxDQUFDOztBQUVGLGVBQWUsZ0JBQWdCO0VBQzdCLFVBQVU7RUFDVixZQUFZO0VBQ1osYUFBYTtFQUNiQyxTQUFPO0VBQ1BDLGlCQUFlO0VBQ2YsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDcEIsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUM7Q0FDL0QsQ0FBQzs7QUNqREYsTUFBTSxjQUFjLEdBQUcsTUFBTSxhQUFhLENBQUM7RUFDekMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUM7Q0FDdEIsQ0FBQyxDQUFDOztBQUVILE1BQU0saUJBQWlCLEdBQUcsSUFBSSxJQUFJLEVBQUU7RUFDbEMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2hDLGFBQWE7Q0FDZCxDQUFDOztBQUVGLE1BQU0sYUFBYSxHQUFHLElBQUksSUFBSSxVQUFVO0VBQ3RDLENBQUNQLFNBQU8sRUFBRSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNsQyxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUM7Q0FDNUIsQ0FBQzs7QUFFRixNQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7QUFHMUMsTUFBTU0sU0FBTyxHQUFHO0VBQ2QsU0FBUyxFQUFFO0lBQ1QsWUFBWSxFQUFFLEtBQUs7SUFDbkIsT0FBTyxFQUFFLGFBQWE7SUFDdEIsc0JBQXNCLEVBQUUsNEJBQTRCO0lBQ3BELEtBQUssRUFBRSxjQUFjO0dBQ3RCO0VBQ0QsU0FBUyxFQUFFO0lBQ1QsWUFBWSxFQUFFLENBQUM7SUFDZixPQUFPLEVBQUUsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUN4QyxzQkFBc0IsRUFBRSw0QkFBNEI7SUFDcEQsS0FBSyxFQUFFLGNBQWM7R0FDdEI7Q0FDRixDQUFDOztBQUVGLE1BQU1DLGlCQUFlLEdBQUc7RUFDdEJGLFVBQVEsQ0FBQyxPQUFPLEdBQUcsRUFBRSxJQUFJLEtBQUssR0FBRyxLQUFLLElBQUksSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTO0lBQ3hFLENBQUMsR0FBRyxFQUFFLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFDakVBLFVBQVEsQ0FBQyxPQUFPLEdBQUcsRUFBRSxJQUFJLEtBQUssR0FBRyxLQUFLLElBQUksSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTO0lBQ3hFLENBQUMsR0FBRyxFQUFFLElBQUksS0FBSyxDQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7Q0FDdEUsQ0FBQzs7QUFFRixZQUFlLElBQUksSUFBSSxnQkFBZ0I7RUFDckMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7RUFDbkIsYUFBYSxDQUFDLElBQUksQ0FBQztFQUNuQixjQUFjLENBQUMsQUFBSSxDQUFDO0VBQ3BCQyxTQUFPO0VBQ1BDLGlCQUFlO0VBQ2YsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO0VBQ2xCLElBQUksQ0FBQyxTQUFTO0NBQ2YsQ0FBQzs7QUM3Q0YsTUFBTSxnQkFBZ0IsR0FBRyxPQUFPLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRTdDLE1BQU0sa0JBQWtCLEdBQUcsYUFBYSxDQUFDO0VBQ3ZDLE9BQU8sRUFBRSxnQkFBZ0I7Q0FDMUIsQ0FBQyxDQUFDOztBQUVILE1BQU0sY0FBYyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO09BQzNDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFMUIsTUFBTSxlQUFlLEdBQUcsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUM7T0FDckMsY0FBYyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFaEMsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLElBQUk7O0VBRTlCLElBQUk7SUFDRixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLEdBQUcsZUFBZSxFQUFFO01BQ2xCLE9BQU8sYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzdCO0dBQ0Y7RUFDRCxNQUFNLENBQUMsRUFBRTs7R0FFUjs7RUFFRCxPQUFPLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN4Qjs7QUFFRCxNQUFNLGlCQUFpQixHQUFHLENBQUMsSUFBSSxVQUFVO0VBQ3ZDLENBQUMsZUFBZSxFQUFFLGFBQWEsQ0FBQztFQUNoQyxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQztFQUM5QixDQUFDLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7RUFDakQsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDO0NBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRUwsTUFBTUQsU0FBTyxHQUFHO0VBQ2QsWUFBWSxFQUFFO0lBQ1osWUFBWSxFQUFFLElBQUk7SUFDbEIsT0FBTyxFQUFFLGdCQUFnQjtJQUN6QixzQkFBc0IsRUFBRSw0QkFBNEI7SUFDcEQsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDO0dBQ2Q7RUFDRCxZQUFZLEVBQUU7SUFDWixZQUFZLEVBQUUsRUFBRTtJQUNoQixPQUFPLEVBQUUsZ0JBQWdCO0lBQ3pCLHNCQUFzQixFQUFFLDRCQUE0QjtJQUNwRCxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUM7R0FDZDtFQUNELG9CQUFvQixFQUFFO0lBQ3BCLFlBQVksRUFBRSxJQUFJO0lBQ2xCLE9BQU8sRUFBRSxDQUFDLElBQUksZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztJQUNoRCxzQkFBc0IsRUFBRSxzQ0FBc0M7SUFDOUQsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDO0dBQ2Q7Q0FDRixDQUFDOztBQUVGLE1BQU0sYUFBYSxHQUFHLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVyRCxNQUFNLHFCQUFxQixHQUFHLE9BQU8sR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEtBQUssYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7T0FDM0UsTUFBTSxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXBELE1BQU1DLGlCQUFlLEdBQUc7RUFDdEJGLFVBQVE7SUFDTixxQkFBcUI7SUFDckIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsdUNBQXVDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7R0FDOUY7Q0FDRixDQUFDOztBQUVGLGdCQUFlLGdCQUFnQjtFQUM3QixXQUFXO0VBQ1gsaUJBQWlCO0VBQ2pCLGtCQUFrQjtFQUNsQkMsU0FBTztFQUNQQyxpQkFBZTtFQUNmLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO0VBQzlCLElBQUksQ0FBQyxTQUFTO0NBQ2YsQ0FBQzs7QUM1RUYsTUFBTSxpQkFBaUIsR0FBRyxtQkFBbUIsQ0FBQzs7QUFFOUMsQUFBTyxNQUFNLGVBQWUsR0FBRyxDQUFDLFFBQVEsS0FBSztFQUMzQyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDOUIsT0FBTyxFQUFFLENBQUMsTUFBTSxJQUFJLEdBQUc7T0FDbEIsWUFBWSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQztPQUNwRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztDQUNoRCxDQUFDOztBQUVGLE1BQU0sV0FBVyxHQUFHLE9BQU8sRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUUxRCxNQUFNLGFBQWEsR0FBRyxhQUFhLENBQUM7RUFDbEMsT0FBTyxFQUFFLFdBQVc7Q0FDckIsQ0FBQyxDQUFDOztBQUVILE1BQU0sWUFBWSxHQUFHLENBQUMsSUFBSSxVQUFVO0VBQ2xDLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQztFQUM1QixDQUFDLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0VBQzVDLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQztDQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVMLE1BQU0sUUFBUSxHQUFHLFFBQVEsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFO0VBQ3ZDLFFBQVE7RUFDUixJQUFJO0NBQ0wsQ0FBQyxDQUFDOztBQUVILE1BQU0sV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7T0FDNUIsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDeEMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7T0FDaEIsUUFBUSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUM7T0FDeEIsZUFBZSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFdkMsTUFBTUQsU0FBTyxHQUFHLEVBQUUsQ0FBQzs7QUFFbkIsTUFBTUMsaUJBQWUsR0FBRyxFQUFFLENBQUM7O0FBRTNCLFdBQWUsZ0JBQWdCO0VBQzdCLE1BQU07RUFDTixZQUFZO0VBQ1osYUFBYTtFQUNiRCxTQUFPO0VBQ1BDLGlCQUFlO0VBQ2YsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7RUFDN0MsSUFBSSxDQUFDLFNBQVM7Q0FDZixDQUFDOztBQ3RDRixNQUFNLFFBQVEsR0FBRyxNQUFNO0VBQ3JCLE1BQU0sVUFBVSxHQUFHO0lBQ2pCLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSTtHQUNoRCxDQUFDOztFQUVGLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxVQUFVLEVBQUU7SUFDM0IsSUFBSTtJQUNKLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSztNQUNULE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztNQUNsQixNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDM0MsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxhQUFhLENBQUM7TUFDM0MsT0FBTyxNQUFNLENBQUM7S0FDZixDQUFDO0lBQ0YsS0FBSyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxLQUFLLENBQUM7R0FDOUIsQ0FBQyxDQUFDOztFQUVILE9BQU8sS0FBSyxDQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7Q0FDdEMsQ0FBQzs7O0FBR0YsQUFBTyxNQUFNQyxLQUFHLEdBQUcsUUFBUSxFQUFFLENBQUM7O0FBRTlCLEFBQU8sTUFBTSxPQUFPLEdBQUcsQ0FBQyxRQUFRLEtBQUs7RUFDbkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQ0EsS0FBRyxDQUFDLEVBQUUsTUFBTSxJQUFJLGVBQWUsQ0FBQyxDQUFDLHNCQUFzQixFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN4RixPQUFPQSxLQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7Q0FDdEIsQ0FBQzs7QUFFRixBQUFPLE1BQU0sbUJBQW1CLEdBQUcsS0FBSyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDOztBQUU1RSxBQUFPLE1BQU0sZ0JBQWdCLEdBQUcsS0FBSyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUzRSxBQUFPLE1BQU0sY0FBYyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sS0FBSyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRW5HLEFBQU8sTUFBTSxrQkFBa0IsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDekUsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoRCxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7QUFFOUIsQUFBTyxNQUFNQyxtQkFBaUIsR0FBRyxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUM7O0FBRTNFLEFBQU8sTUFBTUMseUJBQXVCLEdBQUcsT0FBTyxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsdUJBQXVCLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFbkosQUFBTyxNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQUssS0FBSztFQUNuQyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLE1BQU0sQ0FBQztFQUNuQyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQztFQUNsQyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLE1BQU0sQ0FBQztFQUNuQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLFFBQVEsQ0FBQztFQUNuQyxJQUFJVixTQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDdkQsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDO1VBQ1gsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQztVQUNqQixHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxTQUFTLENBQUM7RUFDOUMsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDO1dBQ1YsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssQ0FBQztXQUMxQixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUM7O0VBRXpDLE1BQU0sSUFBSSxlQUFlLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQzlFLENBQUM7O0FDeEVGO0FBQ0EsQUFBTyxNQUFNLG9CQUFvQixHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDOztBQUVsRCxBQUFPLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQztBQUNwQyxBQUFPLE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDbEUsQUFBTyxNQUFNLFlBQVksR0FBRyxRQUFRLElBQUksT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN0RixBQUFPLE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDbEUsQUFBTyxNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUM3RSxBQUFPLE1BQU0sdUJBQXVCLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDOztBQUVsRixBQUFPLE1BQU0sZUFBZSxHQUFHO0VBQzdCLGFBQWEsRUFBRSxlQUFlO0VBQzlCLGFBQWEsRUFBRSxlQUFlO0VBQzlCLFdBQVcsRUFBRSxhQUFhO0VBQzFCLGFBQWEsRUFBRSxlQUFlO0VBQzlCLFVBQVUsRUFBRSxZQUFZO0VBQ3hCLFlBQVksRUFBRSxjQUFjO0VBQzVCLGlCQUFpQixFQUFFLG1CQUFtQjtFQUN0QyxlQUFlLEVBQUUsaUJBQWlCO0VBQ2xDLFdBQVcsRUFBRSxhQUFhO0VBQzFCLFlBQVksRUFBRSxjQUFjO0VBQzVCLHVCQUF1QixFQUFFLHlCQUF5QjtFQUNsRCxtQkFBbUIsRUFBRSx3QkFBd0I7RUFDN0MsbUJBQW1CLEVBQUUscUJBQXFCO0VBQzFDLFVBQVUsRUFBRSxZQUFZO0VBQ3hCLGtCQUFrQixFQUFFLG9CQUFvQjtFQUN4QyxjQUFjLEVBQUUsZ0JBQWdCO0VBQ2hDLHNCQUFzQixFQUFFLHdCQUF3QjtDQUNqRCxDQUFDOztBQUVGLEFBQU8sTUFBTSxhQUFhLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUU7RUFDckQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztDQUN2RCxDQUFDLENBQUM7O0FBRUgsQUFBTyxNQUFNLHlCQUF5QixHQUFHLENBQUMsSUFBSSxLQUFLO0VBQ2pELE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM3QixPQUFPLFFBQVEsQ0FBQyxRQUFRLENBQUM7RUFDekIsT0FBTyxRQUFRLENBQUM7Q0FDakIsQ0FBQzs7QUFFRixBQUFPLE1BQU0sa0JBQWtCLEdBQUcsUUFBUSxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUU7RUFDeEQsS0FBSyxDQUFDLEdBQUcsQ0FBQztFQUNWLEtBQUssS0FBSztJQUNSLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ1osSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7R0FDZixDQUFDO0NBQ0gsQ0FBQyxDQUFDOztBQ3hDSSxNQUFNLFlBQVksR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsV0FBVyxLQUFLLGNBQWM7RUFDaEYsR0FBRztFQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWTtFQUMzQixnQkFBZ0I7RUFDaEIsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFO0VBQy9CLGFBQWEsRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFFLFdBQVc7Q0FDaEQsQ0FBQzs7QUFFRixBQUFPLE1BQU0sYUFBYSxHQUFHLENBQUMsR0FBRyxFQUFFLGNBQWMsRUFBRSxXQUFXLEtBQUs7RUFDakUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7SUFDYixPQUFPLEtBQUssQ0FBQztHQUNkOztFQUVELE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxlQUFlLEVBQUU7SUFDbkMsTUFBTTtJQUNOLFFBQVEsQ0FBQyxjQUFjLENBQUM7R0FDekIsQ0FBQyxDQUFDOztFQUVILElBQUksQ0FBQyxTQUFTLEVBQUU7SUFDZCxPQUFPLEtBQUssQ0FBQztHQUNkOztFQUVELE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxRQUFRLEtBQUs7SUFDeEMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNsQyxJQUFJO1FBQ0osTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDO1VBQ2hDLHFCQUFxQjtVQUNyQixHQUFHLENBQUMsU0FBUyxFQUFFLFdBQVc7U0FDM0IsQ0FBQyxPQUFPLEVBQUU7VUFDVCxXQUFXLENBQUM7O0lBRWxCLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLGNBQWM7O1VBRWxDLFNBQVMsQ0FBQyxXQUFXLENBQUM7ZUFDakIsT0FBTyxLQUFLLFFBQVEsQ0FBQyxPQUFPO1NBQ2xDLENBQUM7R0FDUCxDQUFDOztFQUVGLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO0lBQzdCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztHQUMxQixDQUFDLENBQUM7Q0FDSixDQUFDOztBQzVDRixNQUFNLGNBQWMsR0FBRyxJQUFJLEtBQUs7RUFDOUIsR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFLFdBQVcsS0FBSyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQztFQUM5RSxZQUFZLEVBQUUsV0FBVyxJQUFJLEdBQUcsSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQztFQUN4RSxNQUFNLEVBQUUsSUFBSTtFQUNaLEdBQUcsRUFBRSxPQUFPLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUM7Q0FDcEMsQ0FBQyxDQUFDOztBQUVILE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxLQUFLO0VBQ2hDLEdBQUcsRUFBRSxXQUFXLElBQUksV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQztFQUMxRCxZQUFZLEVBQUUsR0FBRyxJQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7RUFDNUMsTUFBTSxFQUFFLEtBQUs7RUFDYixHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDO0NBQ3RCLENBQUMsQ0FBQzs7QUFFSCxNQUFNLFlBQVksR0FBRyxjQUFjLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDOztBQUVuRSxNQUFNLFlBQVksR0FBRyxjQUFjLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDOztBQUVuRSxNQUFNLFlBQVksR0FBRyxjQUFjLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDOztBQUVuRSxNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUUvRCxNQUFNLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUM7O0FBRXpFLE1BQU0sVUFBVSxHQUFHLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFakUsTUFBTSxXQUFXLEdBQUcsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUVuRSxNQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUU3RCxNQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRW5FLE1BQU0sZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0FBRTdFLE1BQU0scUJBQXFCLEdBQUcsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLHVCQUF1QixDQUFDLENBQUM7O0FBRXhGLE1BQU0saUJBQWlCLEdBQUcsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUM7O0FBRWhGLE1BQU0saUJBQWlCLEdBQUcsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUM7O0FBRWhGLE1BQU0sU0FBUyxHQUFHLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFL0QsTUFBTSxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7QUFFOUUsTUFBTSxtQkFBbUIsR0FBRyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7QUFFckYsTUFBTSxhQUFhLEdBQUcsY0FBYyxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFckUsQUFBTyxNQUFNLGdCQUFnQixHQUFHLE1BQU0sSUFBSSxDQUFDOztBQUUzQyxBQUFPLE1BQU0sVUFBVSxHQUFHO0VBQ3hCLFlBQVk7RUFDWixZQUFZO0VBQ1osWUFBWTtFQUNaLFVBQVU7RUFDVixjQUFjO0VBQ2QsVUFBVTtFQUNWLFdBQVc7RUFDWCxTQUFTO0VBQ1QscUJBQXFCO0VBQ3JCLGlCQUFpQjtFQUNqQixpQkFBaUI7RUFDakIsU0FBUztFQUNULGdCQUFnQjtFQUNoQixXQUFXO0VBQ1gsZ0JBQWdCO0VBQ2hCLGFBQWE7RUFDYixtQkFBbUI7Q0FDcEIsQ0FBQzs7QUM1REssTUFBTSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLGNBQWMsS0FBSztFQUM5RCxNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsR0FBRyxFQUFFLGFBQWEsQUFBZ0IsQ0FBQyxDQUFDO0VBQ3JFLGFBQWEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7RUFDckMsT0FBTyxjQUFjO0lBQ25CLEdBQUc7SUFDSCxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU07SUFDdkIsVUFBVSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzFELEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRTtJQUNqQyxPQUFPLEVBQUUsVUFBVSxFQUFFLGFBQWE7R0FDbkMsQ0FBQztDQUNILENBQUM7O0FBRUYsQUFBTyxNQUFNLE9BQU8sR0FBRyxDQUFDLFVBQVUsRUFBRSxhQUFhLEtBQUssZUFBZSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsQ0FBQzs7QUFFbkgsTUFBTSxhQUFhLEdBQUcsQ0FBQyxHQUFHLEVBQUUsYUFBYSxLQUFLO0VBQzVDLGFBQWEsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7RUFDdkMsT0FBTyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7Q0FDL0QsQ0FBQzs7QUFFRixBQUFPLE1BQU0sV0FBVyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUUsY0FBYztFQUMxRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQzs7QUFFbEUsQUFBTyxNQUFNLGVBQWUsR0FBRyxDQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUUsYUFBYSxLQUFLO0VBQzNFLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO0lBQ2xDLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDYixTQUFTLENBQUMsYUFBYSxDQUFDO0dBQ3pCLENBQUMsQ0FBQzs7RUFFSCxNQUFNLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDakQsTUFBTSxDQUFDLEdBQUcsR0FBRyxjQUFjLENBQUMsVUFBVSxDQUFDO2lCQUN4QixPQUFPLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUM7aUJBQ3ZDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ2pELE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0VBQ3BCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztFQUM5QixPQUFPLE1BQU0sQ0FBQztDQUNmLENBQUM7O0FDbkNLLE1BQU0saUJBQWlCLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7O0FBRXBFLEFBQU8sTUFBTSxJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sR0FBRyxJQUFJO0VBQ3RDLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDbkIsT0FBTyxVQUFVO0lBQ2YsR0FBRztJQUNILE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSTtJQUNyQixVQUFVLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUM7SUFDdkMsRUFBRSxHQUFHLEVBQUU7SUFDUCxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUc7R0FDaEIsQ0FBQztFQUNIOztBQUVELEFBQU8sTUFBTSxLQUFLLEdBQUcsT0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLFFBQVEsR0FBRyxFQUFFLEtBQUs7RUFDdEQsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNuQixNQUFNLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDM0QsTUFBTSxVQUFVLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVE7SUFDN0MsaUJBQWlCLENBQUMsR0FBRyxDQUFDO0dBQ3ZCLENBQUM7O0VBRUYsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7SUFDeEMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUNiLFNBQVMsQ0FBQyxDQUFDLElBQUksY0FBYyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztHQUM5QyxDQUFDLENBQUM7O0VBRUgsTUFBTSxXQUFXLEdBQUcsQ0FBQyxHQUFHLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQzs7RUFFdkMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7SUFDdEMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFdBQVc7dUJBQ2YsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUM7dUJBQzFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDcEUsR0FBRyxDQUFDLENBQUMsS0FBSztNQUNSLE9BQU8sRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQztNQUMxRCxLQUFLLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUM7TUFDekQsS0FBSyxFQUFFLENBQUM7S0FDVCxDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7O0VBRUgsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtJQUN6QixNQUFNLFVBQVUsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHO01BQ2xDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQztLQUNoQyxDQUFDOztJQUVGLEtBQUssTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFO01BQzVCLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVM7UUFDdEMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkMsR0FBRyxDQUFDLEtBQUs7T0FDVixDQUFDO0tBQ0g7R0FDRjs7RUFFRCxZQUFZLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUM7RUFDdEQsWUFBWSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7RUFDM0IsWUFBWSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7RUFDdkIsWUFBWSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7RUFDM0MsWUFBWSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO0VBQ3BDLE9BQU8sWUFBWSxDQUFDO0NBQ3JCLENBQUM7O0FDdEVGOzs7QUFHQSxBQUFPLE1BQU0scUJBQXFCLEdBQUcsTUFBTSxJQUFJOztJQUUzQyxJQUFJLFFBQVEsQ0FBQzs7SUFFYixNQUFNLGFBQWEsR0FBRyxHQUFHLElBQUk7UUFDekIsUUFBUSxHQUFHLEdBQUcsQ0FBQztLQUNsQixDQUFDOztJQUVGLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDOztJQUVsQyxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksS0FBSzs7TUFFckIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEtBQUs7UUFDdEMsSUFBSSxRQUFRLEVBQUU7VUFDWixNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUM7VUFDckIsUUFBUSxHQUFHLFNBQVMsQ0FBQztVQUNyQixPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUM7U0FDbkI7O1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO1VBQ3pELE9BQU8sT0FBTyxFQUFFLENBQUM7U0FDbEI7O1FBRUQsTUFBTSxlQUFlLEdBQUcsTUFBTTtVQUM1QixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztVQUVoQyxJQUFJLEtBQUssRUFBRTtZQUNULGVBQWUsRUFBRSxDQUFDO1lBQ2xCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztXQUNoQjtVQUNGOztRQUVELE1BQU0sWUFBWSxHQUFHLE1BQU07VUFDekIsZUFBZSxFQUFFLENBQUM7VUFDbEIsT0FBTyxFQUFFLENBQUM7VUFDWDs7UUFFRCxNQUFNLFVBQVUsR0FBRyxNQUFNO1VBQ3ZCLGVBQWUsRUFBRSxDQUFDO1VBQ2xCLE9BQU8sRUFBRSxDQUFDO1VBQ1g7O1FBRUQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxHQUFHLEtBQUs7VUFDNUIsUUFBUSxHQUFHLFNBQVMsQ0FBQztVQUNyQixlQUFlLEVBQUUsQ0FBQztVQUNsQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7VUFDYjs7UUFFRCxNQUFNLGVBQWUsR0FBRyxNQUFNO1VBQzVCLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO1VBQzdDLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO1VBQzdDLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1VBQ3pDLE1BQU0sQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1VBQ3BEOztRQUVELE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDOztRQUV2QyxlQUFlLEVBQUUsQ0FBQztPQUNuQixDQUFDLENBQUM7TUFDSjs7O0lBR0QsTUFBTSxPQUFPLEdBQUcsTUFBTTtNQUNwQixJQUFJLE1BQU0sRUFBRTtRQUNWLElBQUksYUFBYSxFQUFFO1VBQ2pCLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1NBQy9DO1FBQ0QsSUFBSSxPQUFPLE1BQU0sQ0FBQyxPQUFPLEtBQUssVUFBVSxFQUFFO1VBQ3hDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNsQjtPQUNGO0tBQ0YsQ0FBQzs7SUFFRixPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztHQUNoQzs7QUNuRUksTUFBTSxpQkFBaUIsR0FBRyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxLQUFLO0VBQ2hFLE1BQU0sWUFBWSxHQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sS0FBSztJQUMxQyxNQUFNLGFBQWEsR0FBR0ksYUFBVyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMxRCxJQUFJO01BQ0YsT0FBTyxhQUFhLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0tBQ2xDLENBQUMsTUFBTSxDQUFDLEVBQUU7TUFDVCxNQUFNLFlBQVksR0FBRyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBQztNQUNwRyxDQUFDLENBQUMsT0FBTyxHQUFHLHNDQUFzQyxHQUFHLFlBQVksR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO01BQzlFLE1BQU0sQ0FBQyxDQUFDO0tBQ1Q7R0FDRixDQUFDOztFQUVGLE1BQU0sU0FBUyxHQUFHLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUM7TUFDdEQsQ0FBQyxFQUFFLFlBQVksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDO01BQ3hDLFdBQVcsQ0FBQzs7RUFFaEIsT0FBTyxPQUFPLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0NBQ3JDLENBQUM7O0FBRUYsQUFBTyxNQUFNLG1CQUFtQixHQUFHLE9BQU8sR0FBRyxFQUFFLFFBQVEsRUFBRSxXQUFXLEdBQUcsSUFBSSxFQUFFLFNBQVMsR0FBRyxJQUFJLEtBQUs7RUFDaEcsTUFBTSxTQUFTLEdBQUcsbUJBQW1CLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztFQUUvRCxNQUFNLGNBQWMsR0FBRyxDQUFDLFdBQVc7TUFDL0IsSUFBSTtNQUNKLGdCQUFnQjtNQUNoQixpQkFBaUI7UUFDZixTQUFTO1FBQ1QsUUFBUTtRQUNSLFdBQVc7T0FDWjtLQUNGLENBQUM7O0VBRUosTUFBTSxZQUFZLEdBQUcsQ0FBQyxTQUFTO01BQzNCLElBQUk7TUFDSixnQkFBZ0I7TUFDaEIsaUJBQWlCO1FBQ2YsU0FBUztRQUNULFFBQVE7UUFDUixTQUFTO09BQ1Y7S0FDRixDQUFDOztFQUVKLE9BQU8sQ0FBQyxDQUFDLE1BQU0sV0FBVyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLEVBQUU7SUFDbkQsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLGNBQWM7d0JBQ3BDLFNBQVMsS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDO0lBQzdELEdBQUcsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDeEMsQ0FBQyxDQUFDO0NBQ0osQ0FBQzs7QUFFRixBQUFPLE1BQU0sMkJBQTJCLEdBQUcsT0FBTyxLQUFLLEVBQUUsUUFBUSxFQUFFLGNBQWMsS0FBSztFQUNwRixNQUFNLEdBQUcsR0FBRyxNQUFNLFdBQVcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7RUFDL0MsTUFBTSxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUM7RUFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUM3QixHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3BCLE1BQU0sYUFBYSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7R0FDM0M7Q0FDRixDQUFDOztBQUVGLEFBQU8sTUFBTSxXQUFXLEdBQUcsT0FBTyxTQUFTLEVBQUUsUUFBUSxLQUFLO0VBQ3hELE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUM3QyxJQUFJO0lBQ0YsT0FBTyxNQUFNLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7R0FDOUMsQ0FBQyxPQUFPLENBQUMsRUFBRTtJQUNWLE1BQU0sU0FBUyxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDNUMsT0FBTyxFQUFFLENBQUM7R0FDWDtDQUNGLENBQUM7O0FBRUYsQUFBTyxNQUFNLGFBQWEsR0FBRyxPQUFPLFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUSxLQUFLLE1BQU0sU0FBUyxDQUFDLFVBQVU7RUFDOUYsY0FBYyxDQUFDLFFBQVEsQ0FBQztFQUN4QixRQUFRO0NBQ1QsQ0FBQzs7QUFFRixBQUFPLE1BQU0sZUFBZSxHQUFHLE9BQU8sR0FBRyxFQUFFLFFBQVEsS0FBSyxNQUFNLG1CQUFtQixDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFakcsQUFBTyxNQUFNLGNBQWMsR0FBRyxRQUFRLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQzs7QUFFN0UsQUFBTyxNQUFNLHdCQUF3QixHQUFHLFFBQVEsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ25GLEFBRUE7QUFDQSxBQUFPLE1BQU0sZUFBZSxHQUFHLE9BQU8sU0FBUyxFQUFFLGNBQWMsRUFBRSxLQUFLLEtBQUs7RUFDekUsSUFBSSxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7SUFDekIsTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzlDLE1BQU0sUUFBUSxHQUFHLE1BQU0sV0FBVyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN4RCxRQUFRLENBQUMsSUFBSTtNQUNYLGdCQUFnQixDQUFDLGNBQWMsQ0FBQztLQUNqQyxDQUFDO0lBQ0YsTUFBTSxhQUFhLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztHQUNwRDtFQUNELE1BQU0sU0FBUyxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLENBQUM7Q0FDaEQsQ0FBQzs7QUFFRixBQUFPLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUU7RUFDNUMsUUFBUTtFQUNSLElBQUk7Q0FDTCxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFdkIsQUFBTyxNQUFNLDRCQUE0QixHQUFHLENBQUMsWUFBWSxFQUFFLFNBQVMsS0FBSztFQUN2RSxJQUFJLGFBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTs7RUFFbEUsTUFBTSxvQkFBb0IsR0FBRyxvQkFBb0I7SUFDL0MsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sRUFBRTtJQUM1QixZQUFZO0dBQ2IsQ0FBQzs7RUFFRixPQUFPLE9BQU87SUFDWixvQkFBb0I7SUFDcEIsU0FBUyxDQUFDLElBQUk7R0FDZixDQUFDO0NBQ0gsQ0FBQzs7QUNqSEssTUFBTSxjQUFjLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxLQUFLO0VBQ3RELE1BQU0sV0FBVyxHQUFHLDZCQUE2QixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztFQUN4RSxNQUFNLGFBQWEsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFO0lBQ25DLEdBQUcsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0dBQ3RELENBQUMsQ0FBQzs7O0VBR0gsTUFBTSxNQUFNLEdBQUc7SUFDYixPQUFPLEVBQUVJLEtBQUcsQ0FBQyxNQUFNO0lBQ25CLEdBQUcsRUFBRUEsS0FBRyxDQUFDLE1BQU07R0FDaEIsQ0FBQzs7RUFFRixNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDOUIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxLQUFLO0lBQ3JDLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFOztJQUV0RCxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkMsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUU7TUFDeEIsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssUUFBUSxFQUFFO1FBQ2xDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBR0EsS0FBRyxDQUFDLE1BQU0sQ0FBQztPQUNoQztLQUNGLE1BQU07TUFDTCxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsUUFBUSxDQUFDO0tBQzlCO0dBQ0YsQ0FBQzs7RUFFRixLQUFLLE1BQU0sU0FBUyxJQUFJLGFBQWEsRUFBRTtJQUNyQyxLQUFLLE1BQU0sQ0FBQyxJQUFJLFNBQVMsRUFBRTtNQUN6QixRQUFRLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzNCO0dBQ0Y7OztFQUdELE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRTtJQUNmLElBQUk7SUFDSixHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDN0MsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQztJQUNqQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekIsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRUEsS0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3BELE9BQU87R0FDUixDQUFDLENBQUM7Q0FDSixDQUFDOztBQUVGLE1BQU0sa0JBQWtCLEdBQUcsVUFBVSxJQUFJLGVBQWU7RUFDdEQsVUFBVTtFQUNWLG1CQUFtQjtFQUNuQixVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFO0NBQzlCLENBQUM7O0FDekRGLGVBQWUsQ0FBQyxPQUFPLE1BQU0sS0FBSyxXQUFXLEdBQUcsTUFBTTtZQUMxQyxPQUFPLElBQUksS0FBSyxXQUFXLEdBQUcsSUFBSTtZQUNsQyxPQUFPLE1BQU0sS0FBSyxXQUFXLEdBQUcsTUFBTSxHQUFHLEVBQUUsRUFBRTs7QUNEekQsSUFBSSxNQUFNLEdBQUcsR0FBRTtBQUNmLElBQUksU0FBUyxHQUFHLEdBQUU7QUFDbEIsSUFBSSxHQUFHLEdBQUcsT0FBTyxVQUFVLEtBQUssV0FBVyxHQUFHLFVBQVUsR0FBRyxNQUFLO0FBQ2hFLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQztBQUNuQixTQUFTLElBQUksSUFBSTtFQUNmLE1BQU0sR0FBRyxJQUFJLENBQUM7RUFDZCxJQUFJLElBQUksR0FBRyxtRUFBa0U7RUFDN0UsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtJQUMvQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBQztJQUNuQixTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUM7R0FDbEM7O0VBRUQsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFFO0VBQ2pDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRTtDQUNsQzs7QUFFRCxBQUFPLFNBQVMsV0FBVyxFQUFFLEdBQUcsRUFBRTtFQUNoQyxJQUFJLENBQUMsTUFBTSxFQUFFO0lBQ1gsSUFBSSxFQUFFLENBQUM7R0FDUjtFQUNELElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxJQUFHO0VBQ25DLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFNOztFQUVwQixJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQztHQUNsRTs7Ozs7OztFQU9ELFlBQVksR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUM7OztFQUd0RSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxFQUFDOzs7RUFHekMsQ0FBQyxHQUFHLFlBQVksR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFHOztFQUVwQyxJQUFJLENBQUMsR0FBRyxFQUFDOztFQUVULEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO0lBQ3hDLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQztJQUNsSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUFFLElBQUksS0FBSTtJQUM3QixHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksS0FBSTtJQUM1QixHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSTtHQUN0Qjs7RUFFRCxJQUFJLFlBQVksS0FBSyxDQUFDLEVBQUU7SUFDdEIsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDO0lBQ25GLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxLQUFJO0dBQ3RCLE1BQU0sSUFBSSxZQUFZLEtBQUssQ0FBQyxFQUFFO0lBQzdCLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENB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LElBQUksS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBQztFQUNoRSxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUM7RUFDL0IsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUM7RUFDckIsSUFBSSxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUM7O0VBRTNELEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBQzs7RUFFdkIsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLFFBQVEsRUFBRTtJQUN0QyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFDO0lBQ3hCLENBQUMsR0FBRyxLQUFJO0dBQ1QsTUFBTTtJQUNMLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBQztJQUMxQyxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtNQUNyQyxDQUFDLEdBQUU7TUFDSCxDQUFDLElBQUksRUFBQztLQUNQO0lBQ0QsSUFBSSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsRUFBRTtNQUNsQixLQUFLLElBQUksRUFBRSxHQUFHLEVBQUM7S0FDaEIsTUFBTTtNQUNMLEtBQUssSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxD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QU0sRUFBQztFQUNsRCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztFQUM5Qzs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxTQUFTLFlBQVksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQ3ZFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQzs7RUFFbEQsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztPQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztFQUNuQzs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxTQUFTLFlBQVksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0VBQ3ZFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQzs7RUFFbEQsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxTQUFTO0tBQzdCLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFO0tBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDcEI7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxTQUFTLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUU7RUFDN0UsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0VBQ25CLFVBQVUsR0FBRyxVQUFVLEdBQUcsRUFBQztFQUMzQixJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7O0VBRTNELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUM7RUFDdEIsSUFBSSxHQUFHLEdBQUcsRUFBQztFQUNYLElBQUksQ0FBQyxHQUFHLEVBQUM7RUFDVCxPQUFPLEVBQUUsQ0FBQyxHQUFHLFVBQVUsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUU7SUFDekMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBRztHQUM5QjtFQUNELEdBQUcsSUFBSSxLQUFJOztFQUVYLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsRUFBQzs7RUFFbEQsT0FBTyxHQUFHO0VBQ1g7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxTQUFTLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUU7RUFDN0UsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0VBQ25CLFVBQVUsR0FBRyxVQUFVLEdBQUcsRUFBQztFQUMzQixJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7O0VBRTNELElBQUksQ0FBQyxHQUFHLFdBQVU7RUFDbEIsSUFBSSxHQUFHLEdBQUcsRUFBQztFQUNYLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUM7RUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRTtJQUM5QixHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUc7R0FD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QU0sRUFBRSxRQUFRLEVBQUU7RUFDckUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0VBQ2xELE9BQU9DLElBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQy9DOztBQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFNBQVMsV0FBVyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7RUFDckUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0VBQ2xELE9BQU9BLElBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQ2hEOztBQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsWUFBWSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7RUFDdkUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0VBQ2xELE9BQU9BLElBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQy9DOztBQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsWUFBWSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7RUFDdkUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0VBQ2xELE9BQU9BLElBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQ2hEOztBQUVELFNBQVMsUUFBUSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdB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TyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxFQUFFO0lBQ2pDLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtNQUN4RCxHQUFHLEdBQUcsRUFBQztLQUNSO0lBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksR0FBRyxHQUFHLEtBQUk7R0FDckQ7O0VBRUQsT0FBTyxNQUFNLEdBQUcsVUFBVTtFQUMzQjs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUN4RSxLQUFLLEdBQUcsQ0FBQyxNQUFLO0VBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0VBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUM7RUFDNUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUM7RUFDMUQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLEdBQUcsS0FBSyxHQUFHLEVBQUM7RUFDdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLEVBQUM7RUFDN0IsT0FBTyxNQUFNLEdBQUcsQ0FBQztFQUNsQjs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxTQUFTLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUM5RSxLQUFLLEdBQUcsQ0FBQyxNQUFLO0VBQ2QsTUFBTSxH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
