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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVkaWJhc2UtY29yZS5lc20ubWpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tbW9uL2V2ZW50cy5qcyIsIi4uL3NyYy9jb21tb24vZXJyb3JzLmpzIiwiLi4vc3JjL2NvbW1vbi9hcGlXcmFwcGVyLmpzIiwiLi4vc3JjL2NvbW1vbi9sb2NrLmpzIiwiLi4vc3JjL2NvbW1vbi9pbmRleC5qcyIsIi4uL3NyYy9jb21tb24vdmFsaWRhdGlvbkNvbW1vbi5qcyIsIi4uL3NyYy9pbmRleGluZy9ldmFsdWF0ZS5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9pbmRleGVzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2hpZXJhcmNoeS5qcyIsIi4uL3NyYy90eXBlcy90eXBlSGVscGVycy5qcyIsIi4uL3NyYy90eXBlcy9zdHJpbmcuanMiLCIuLi9zcmMvdHlwZXMvYm9vbC5qcyIsIi4uL3NyYy90eXBlcy9udW1iZXIuanMiLCIuLi9zcmMvdHlwZXMvZGF0ZXRpbWUuanMiLCIuLi9zcmMvdHlwZXMvYXJyYXkuanMiLCIuLi9zcmMvdHlwZXMvcmVmZXJlbmNlLmpzIiwiLi4vc3JjL3R5cGVzL2ZpbGUuanMiLCIuLi9zcmMvdHlwZXMvaW5kZXguanMiLCIuLi9zcmMvYXV0aEFwaS9hdXRoQ29tbW9uLmpzIiwiLi4vc3JjL2F1dGhBcGkvaXNBdXRob3JpemVkLmpzIiwiLi4vc3JjL2F1dGhBcGkvcGVybWlzc2lvbnMuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2dldE5ldy5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvbG9hZC5qcyIsIi4uL3NyYy9pbmRleGluZy9wcm9taXNlUmVhZGFibGVTdHJlYW0uanMiLCIuLi9zcmMvaW5kZXhpbmcvc2hhcmRpbmcuanMiLCIuLi9zcmMvaW5kZXhpbmcvaW5kZXhTY2hlbWFDcmVhdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JvbGx1cC1wbHVnaW4tbm9kZS1nbG9iYWxzL3NyYy9nbG9iYWwuanMiLCIuLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVzNi9iYXNlNjQuanMiLCIuLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVzNi9pZWVlNzU0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2J1ZmZlci1lczYvaXNBcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9idWZmZXItZXM2L2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JvbGx1cC1wbHVnaW4tbm9kZS1idWlsdGlucy9zcmMvZXM2L3N0cmluZy1kZWNvZGVyLmpzIiwiLi4vc3JjL2luZGV4aW5nL3NlcmlhbGl6ZXIuanMiLCIuLi9zcmMvaW5kZXhpbmcvcmVhZC5qcyIsIi4uL3NyYy9pbmRleEFwaS9saXN0SXRlbXMuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2dldENvbnRleHQuanMiLCIuLi9zcmMvcmVjb3JkQXBpL3ZhbGlkYXRlLmpzIiwiLi4vc3JjL2NvbGxlY3Rpb25BcGkvaW5pdGlhbGlzZS5qcyIsIi4uL3NyYy9pbmRleGluZy9hbGxJZHMuanMiLCIuLi9zcmMvdHJhbnNhY3Rpb25zL3RyYW5zYWN0aW9uc0NvbW1vbi5qcyIsIi4uL3NyYy90cmFuc2FjdGlvbnMvY3JlYXRlLmpzIiwiLi4vc3JjL2luZGV4aW5nL2luaXRpYWxpc2VJbmRleC5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvc2F2ZS5qcyIsIi4uL3NyYy9jb2xsZWN0aW9uQXBpL2RlbGV0ZS5qcyIsIi4uL3NyYy9pbmRleEFwaS9kZWxldGUuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2RlbGV0ZS5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvdXBsb2FkRmlsZS5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZG93bmxvYWRGaWxlLmpzIiwiLi4vc3JjL3JlY29yZEFwaS9jdXN0b21JZC5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvaW5kZXguanMiLCIuLi9zcmMvY29sbGVjdGlvbkFwaS9nZXRBbGxvd2VkUmVjb3JkVHlwZXMuanMiLCIuLi9zcmMvY29sbGVjdGlvbkFwaS9pbmRleC5qcyIsIi4uL3NyYy9pbmRleEFwaS9idWlsZEluZGV4LmpzIiwiLi4vc3JjL2luZGV4QXBpL2FnZ3JlZ2F0ZXMuanMiLCIuLi9zcmMvaW5kZXhBcGkvaW5kZXguanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvY3JlYXRlTm9kZXMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvZmllbGRzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL3JlY29yZFZhbGlkYXRpb25SdWxlcy5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9jcmVhdGVBY3Rpb25zLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL3ZhbGlkYXRlQWdncmVnYXRlLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL3ZhbGlkYXRlLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2dldEFwcGxpY2F0aW9uRGVmaW5pdGlvbi5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9zYXZlQXBwbGljYXRpb25IaWVyYXJjaHkuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvc2F2ZUFjdGlvbnNBbmRUcmlnZ2Vycy5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9nZXRCZWhhdmlvdXJTb3VyY2VzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2luZGV4LmpzIiwiLi4vc3JjL2F1dGhBcGkvZ2V0VXNlcnMuanMiLCIuLi9zcmMvYXV0aEFwaS9sb2FkQWNjZXNzTGV2ZWxzLmpzIiwiLi4vc3JjL2F1dGhBcGkvYXV0aGVudGljYXRlLmpzIiwiLi4vc3JjL2F1dGhBcGkvY3JlYXRlVGVtcG9yYXJ5QWNjZXNzLmpzIiwiLi4vc3JjL2F1dGhBcGkvdmFsaWRhdGVVc2VyLmpzIiwiLi4vc3JjL2F1dGhBcGkvZ2V0TmV3VXNlci5qcyIsIi4uL3NyYy9hdXRoQXBpL3NldFBhc3N3b3JkLmpzIiwiLi4vc3JjL2F1dGhBcGkvY3JlYXRlVXNlci5qcyIsIi4uL3NyYy9hdXRoQXBpL2VuYWJsZVVzZXIuanMiLCIuLi9zcmMvYXV0aEFwaS9nZXROZXdBY2Nlc3NMZXZlbC5qcyIsIi4uL3NyYy9hdXRoQXBpL3ZhbGlkYXRlQWNjZXNzTGV2ZWxzLmpzIiwiLi4vc3JjL2F1dGhBcGkvc2F2ZUFjY2Vzc0xldmVscy5qcyIsIi4uL3NyYy9hdXRoQXBpL2dlbmVyYXRlRnVsbFBlcm1pc3Npb25zLmpzIiwiLi4vc3JjL2F1dGhBcGkvc2V0VXNlckFjY2Vzc0xldmVscy5qcyIsIi4uL3NyYy9hdXRoQXBpL2luZGV4LmpzIiwiLi4vc3JjL2FjdGlvbnNBcGkvZXhlY3V0ZS5qcyIsIi4uL3NyYy9hY3Rpb25zQXBpL2luZGV4LmpzIiwiLi4vc3JjL2FwcEluaXRpYWxpc2UvZXZlbnRBZ2dyZWdhdG9yLmpzIiwiLi4vc3JjL2FwcEluaXRpYWxpc2UvaW5kZXguanMiLCIuLi9zcmMvY29tbW9uL2NvbXBpbGVDb2RlLmpzIiwiLi4vc3JjL2FjdGlvbnNBcGkvaW5pdGlhbGlzZS5qcyIsIi4uL3NyYy90cmFuc2FjdGlvbnMvcmV0cmlldmUuanMiLCIuLi9zcmMvaW5kZXhpbmcvcmVsZXZhbnQuanMiLCIuLi9zcmMvaW5kZXhpbmcvcHJvbWlzZVdyaXRhYmxlU3RyZWFtLmpzIiwiLi4vc3JjL2luZGV4aW5nL2FwcGx5LmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9leGVjdXRlLmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9jbGVhbnVwLmpzIiwiLi4vc3JjL2FwcEluaXRpYWxpc2UvaW5pdGlhbGlzZURhdGEuanMiLCIuLi9zcmMvYXBwSW5pdGlhbGlzZS9kYXRhYmFzZU1hbmFnZXIuanMiLCIuLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdW5pb24sIHJlZHVjZSB9IGZyb20gJ2xvZGFzaC9mcCc7XG5cbmNvbnN0IGNvbW1vblBsdXMgPSBleHRyYSA9PiB1bmlvbihbJ29uQmVnaW4nLCAnb25Db21wbGV0ZScsICdvbkVycm9yJ10pKGV4dHJhKTtcblxuY29uc3QgY29tbW9uID0gKCkgPT4gY29tbW9uUGx1cyhbXSk7XG5cbmNvbnN0IF9ldmVudHMgPSB7XG4gIHJlY29yZEFwaToge1xuICAgIHNhdmU6IGNvbW1vblBsdXMoW1xuICAgICAgJ29uSW52YWxpZCcsXG4gICAgICAnb25SZWNvcmRVcGRhdGVkJyxcbiAgICAgICdvblJlY29yZENyZWF0ZWQnXSksXG4gICAgZGVsZXRlOiBjb21tb24oKSxcbiAgICBnZXRDb250ZXh0OiBjb21tb24oKSxcbiAgICBnZXROZXc6IGNvbW1vbigpLFxuICAgIGxvYWQ6IGNvbW1vbigpLFxuICAgIHZhbGlkYXRlOiBjb21tb24oKSxcbiAgICB1cGxvYWRGaWxlOiBjb21tb24oKSxcbiAgICBkb3dubG9hZEZpbGU6IGNvbW1vbigpLFxuICB9LFxuICBpbmRleEFwaToge1xuICAgIGJ1aWxkSW5kZXg6IGNvbW1vbigpLFxuICAgIGxpc3RJdGVtczogY29tbW9uKCksXG4gICAgZGVsZXRlOiBjb21tb24oKSxcbiAgICBhZ2dyZWdhdGVzOiBjb21tb24oKSxcbiAgfSxcbiAgY29sbGVjdGlvbkFwaToge1xuICAgIGdldEFsbG93ZWRSZWNvcmRUeXBlczogY29tbW9uKCksXG4gICAgaW5pdGlhbGlzZTogY29tbW9uKCksXG4gICAgZGVsZXRlOiBjb21tb24oKSxcbiAgfSxcbiAgYXV0aEFwaToge1xuICAgIGF1dGhlbnRpY2F0ZTogY29tbW9uKCksXG4gICAgYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzOiBjb21tb24oKSxcbiAgICBjcmVhdGVUZW1wb3JhcnlBY2Nlc3M6IGNvbW1vbigpLFxuICAgIGNyZWF0ZVVzZXI6IGNvbW1vbigpLFxuICAgIGVuYWJsZVVzZXI6IGNvbW1vbigpLFxuICAgIGRpc2FibGVVc2VyOiBjb21tb24oKSxcbiAgICBsb2FkQWNjZXNzTGV2ZWxzOiBjb21tb24oKSxcbiAgICBnZXROZXdBY2Nlc3NMZXZlbDogY29tbW9uKCksXG4gICAgZ2V0TmV3VXNlcjogY29tbW9uKCksXG4gICAgZ2V0TmV3VXNlckF1dGg6IGNvbW1vbigpLFxuICAgIGdldFVzZXJzOiBjb21tb24oKSxcbiAgICBzYXZlQWNjZXNzTGV2ZWxzOiBjb21tb24oKSxcbiAgICBpc0F1dGhvcml6ZWQ6IGNvbW1vbigpLFxuICAgIGNoYW5nZU15UGFzc3dvcmQ6IGNvbW1vbigpLFxuICAgIHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGU6IGNvbW1vbigpLFxuICAgIHNjb3JlUGFzc3dvcmQ6IGNvbW1vbigpLFxuICAgIGlzVmFsaWRQYXNzd29yZDogY29tbW9uKCksXG4gICAgdmFsaWRhdGVVc2VyOiBjb21tb24oKSxcbiAgICB2YWxpZGF0ZUFjY2Vzc0xldmVsczogY29tbW9uKCksXG4gICAgc2V0VXNlckFjY2Vzc0xldmVsczogY29tbW9uKCksXG4gIH0sXG4gIHRlbXBsYXRlQXBpOiB7XG4gICAgc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5OiBjb21tb24oKSxcbiAgICBzYXZlQWN0aW9uc0FuZFRyaWdnZXJzOiBjb21tb24oKSxcbiAgfSxcbiAgYWN0aW9uc0FwaToge1xuICAgIGV4ZWN1dGU6IGNvbW1vbigpLFxuICB9LFxufTtcblxuY29uc3QgX2V2ZW50c0xpc3QgPSBbXTtcblxuY29uc3QgbWFrZUV2ZW50ID0gKGFyZWEsIG1ldGhvZCwgbmFtZSkgPT4gYCR7YXJlYX06JHttZXRob2R9OiR7bmFtZX1gO1xuXG5mb3IgKGNvbnN0IGFyZWFLZXkgaW4gX2V2ZW50cykge1xuICBmb3IgKGNvbnN0IG1ldGhvZEtleSBpbiBfZXZlbnRzW2FyZWFLZXldKSB7XG4gICAgX2V2ZW50c1thcmVhS2V5XVttZXRob2RLZXldID0gcmVkdWNlKChvYmosIHMpID0+IHtcbiAgICAgIG9ialtzXSA9IG1ha2VFdmVudChhcmVhS2V5LCBtZXRob2RLZXksIHMpO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9LFxuICAgIHt9KShfZXZlbnRzW2FyZWFLZXldW21ldGhvZEtleV0pO1xuICB9XG59XG5cblxuZm9yIChjb25zdCBhcmVhS2V5IGluIF9ldmVudHMpIHtcbiAgZm9yIChjb25zdCBtZXRob2RLZXkgaW4gX2V2ZW50c1thcmVhS2V5XSkge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBfZXZlbnRzW2FyZWFLZXldW21ldGhvZEtleV0pIHtcbiAgICAgIF9ldmVudHNMaXN0LnB1c2goXG4gICAgICAgIF9ldmVudHNbYXJlYUtleV1bbWV0aG9kS2V5XVtuYW1lXSxcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cblxuZXhwb3J0IGNvbnN0IGV2ZW50cyA9IF9ldmVudHM7XG5cbmV4cG9ydCBjb25zdCBldmVudHNMaXN0ID0gX2V2ZW50c0xpc3Q7XG5cbmV4cG9ydCBkZWZhdWx0IHsgZXZlbnRzOiBfZXZlbnRzLCBldmVudHNMaXN0OiBfZXZlbnRzTGlzdCB9O1xuIiwiZXhwb3J0IGNsYXNzIEJhZFJlcXVlc3RFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmh0dHBTdGF0dXNDb2RlID0gNDAwO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuYXV0aG9yaXNlZEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDE7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRm9yYmlkZGVuRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDQwMztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOb3RGb3VuZEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDQ7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29uZmxpY3RFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmh0dHBTdGF0dXNDb2RlID0gNDA5O1xuICAgIH1cbn0iLCJpbXBvcnQgeyBjbG9uZURlZXAsIGlzVW5kZWZpbmVkIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnc2hvcnRpZCc7XG5pbXBvcnQgeyBVbmF1dGhvcmlzZWRFcnJvciB9IGZyb20gJy4vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGFwaVdyYXBwZXIgPSBhc3luYyAoYXBwLCBldmVudE5hbWVzcGFjZSwgaXNBdXRob3JpemVkLCBldmVudENvbnRleHQsIGZ1bmMsIC4uLnBhcmFtcykgPT4ge1xuICBwdXNoQ2FsbFN0YWNrKGFwcCwgZXZlbnROYW1lc3BhY2UpO1xuXG4gIGlmICghaXNBdXRob3JpemVkKGFwcCkpIHtcbiAgICBoYW5kbGVOb3RBdXRob3JpemVkKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgc3RhcnREYXRlID0gRGF0ZS5ub3coKTtcbiAgY29uc3QgZWxhcHNlZCA9ICgpID0+IChEYXRlLm5vdygpIC0gc3RhcnREYXRlKTtcblxuICB0cnkge1xuICAgIGF3YWl0IGFwcC5wdWJsaXNoKFxuICAgICAgZXZlbnROYW1lc3BhY2Uub25CZWdpbixcbiAgICAgIGV2ZW50Q29udGV4dCxcbiAgICApO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZnVuYyguLi5wYXJhbXMpO1xuXG4gICAgYXdhaXQgcHVibGlzaENvbXBsZXRlKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGF3YWl0IHB1Ymxpc2hFcnJvcihhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIGVycm9yKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGFwaVdyYXBwZXJTeW5jID0gKGFwcCwgZXZlbnROYW1lc3BhY2UsIGlzQXV0aG9yaXplZCwgZXZlbnRDb250ZXh0LCBmdW5jLCAuLi5wYXJhbXMpID0+IHtcbiAgcHVzaENhbGxTdGFjayhhcHAsIGV2ZW50TmFtZXNwYWNlKTtcblxuICBpZiAoIWlzQXV0aG9yaXplZChhcHApKSB7XG4gICAgaGFuZGxlTm90QXV0aG9yaXplZChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHN0YXJ0RGF0ZSA9IERhdGUubm93KCk7XG4gIGNvbnN0IGVsYXBzZWQgPSAoKSA9PiAoRGF0ZS5ub3coKSAtIHN0YXJ0RGF0ZSk7XG5cbiAgdHJ5IHtcbiAgICBhcHAucHVibGlzaChcbiAgICAgIGV2ZW50TmFtZXNwYWNlLm9uQmVnaW4sXG4gICAgICBldmVudENvbnRleHQsXG4gICAgKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGZ1bmMoLi4ucGFyYW1zKTtcblxuICAgIHB1Ymxpc2hDb21wbGV0ZShhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBwdWJsaXNoRXJyb3IoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCBlcnJvcik7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cbmNvbnN0IGhhbmRsZU5vdEF1dGhvcml6ZWQgPSAoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlKSA9PiB7XG4gIGNvbnN0IGVyciA9IG5ldyBVbmF1dGhvcmlzZWRFcnJvcihgVW5hdXRob3JpemVkOiAke2V2ZW50TmFtZXNwYWNlfWApO1xuICBwdWJsaXNoRXJyb3IoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCAoKSA9PiAwLCBlcnIpO1xuICB0aHJvdyBlcnI7XG59O1xuXG5jb25zdCBwdXNoQ2FsbFN0YWNrID0gKGFwcCwgZXZlbnROYW1lc3BhY2UsIHNlZWRDYWxsSWQpID0+IHtcbiAgY29uc3QgY2FsbElkID0gZ2VuZXJhdGUoKTtcblxuICBjb25zdCBjcmVhdGVDYWxsU3RhY2sgPSAoKSA9PiAoe1xuICAgIHNlZWRDYWxsSWQ6ICFpc1VuZGVmaW5lZChzZWVkQ2FsbElkKVxuICAgICAgPyBzZWVkQ2FsbElkXG4gICAgICA6IGNhbGxJZCxcbiAgICB0aHJlYWRDYWxsSWQ6IGNhbGxJZCxcbiAgICBzdGFjazogW10sXG4gIH0pO1xuXG4gIGlmIChpc1VuZGVmaW5lZChhcHAuY2FsbHMpKSB7XG4gICAgYXBwLmNhbGxzID0gY3JlYXRlQ2FsbFN0YWNrKCk7XG4gIH1cblxuICBhcHAuY2FsbHMuc3RhY2sucHVzaCh7XG4gICAgbmFtZXNwYWNlOiBldmVudE5hbWVzcGFjZSxcbiAgICBjYWxsSWQsXG4gIH0pO1xufTtcblxuY29uc3QgcG9wQ2FsbFN0YWNrID0gKGFwcCkgPT4ge1xuICBhcHAuY2FsbHMuc3RhY2sucG9wKCk7XG4gIGlmIChhcHAuY2FsbHMuc3RhY2subGVuZ3RoID09PSAwKSB7XG4gICAgZGVsZXRlIGFwcC5jYWxscztcbiAgfVxufTtcblxuY29uc3QgcHVibGlzaEVycm9yID0gYXN5bmMgKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgZXJyKSA9PiB7XG4gIGNvbnN0IGN0eCA9IGNsb25lRGVlcChldmVudENvbnRleHQpO1xuICBjdHguZXJyb3IgPSBlcnI7XG4gIGN0eC5lbGFwc2VkID0gZWxhcHNlZCgpO1xuICBhd2FpdCBhcHAucHVibGlzaChcbiAgICBldmVudE5hbWVzcGFjZS5vbkVycm9yLFxuICAgIGN0eCxcbiAgKTtcbiAgcG9wQ2FsbFN0YWNrKGFwcCk7XG59O1xuXG5jb25zdCBwdWJsaXNoQ29tcGxldGUgPSBhc3luYyAoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCByZXN1bHQpID0+IHtcbiAgY29uc3QgZW5kY29udGV4dCA9IGNsb25lRGVlcChldmVudENvbnRleHQpO1xuICBlbmRjb250ZXh0LnJlc3VsdCA9IHJlc3VsdDtcbiAgZW5kY29udGV4dC5lbGFwc2VkID0gZWxhcHNlZCgpO1xuICBhd2FpdCBhcHAucHVibGlzaChcbiAgICBldmVudE5hbWVzcGFjZS5vbkNvbXBsZXRlLFxuICAgIGVuZGNvbnRleHQsXG4gICk7XG4gIHBvcENhbGxTdGFjayhhcHApO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYXBpV3JhcHBlcjtcbiIsImltcG9ydCB7IHNwbGl0IH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7ICQgfSBmcm9tICcuL2luZGV4JztcblxuY29uc3QgbG9ja092ZXJsYXBNaWxsaXNlY29uZHMgPSAxMDtcblxuZXhwb3J0IGNvbnN0IGdldExvY2sgPSBhc3luYyAoYXBwLCBsb2NrRmlsZSwgdGltZW91dE1pbGxpc2Vjb25kcywgbWF4TG9ja1JldHJpZXMsIHJldHJ5Q291bnQgPSAwKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgdGltZW91dCA9IChhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCkpXG4gICAgICAgICAgICArIHRpbWVvdXRNaWxsaXNlY29uZHM7XG5cbiAgICBjb25zdCBsb2NrID0ge1xuICAgICAgdGltZW91dCxcbiAgICAgIGtleTogbG9ja0ZpbGUsXG4gICAgICB0b3RhbFRpbWVvdXQ6IHRpbWVvdXRNaWxsaXNlY29uZHMsXG4gICAgfTtcblxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlRmlsZShcbiAgICAgIGxvY2tGaWxlLFxuICAgICAgZ2V0TG9ja0ZpbGVDb250ZW50KFxuICAgICAgICBsb2NrLnRvdGFsVGltZW91dCxcbiAgICAgICAgbG9jay50aW1lb3V0LFxuICAgICAgKSxcbiAgICApO1xuXG4gICAgcmV0dXJuIGxvY2s7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAocmV0cnlDb3VudCA9PSBtYXhMb2NrUmV0cmllcykgeyByZXR1cm4gTk9fTE9DSzsgfVxuXG4gICAgY29uc3QgbG9jayA9IHBhcnNlTG9ja0ZpbGVDb250ZW50KFxuICAgICAgbG9ja0ZpbGUsXG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRGaWxlKGxvY2tGaWxlKSxcbiAgICApO1xuXG4gICAgY29uc3QgY3VycmVudEVwb2NoVGltZSA9IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKTtcblxuICAgIGlmIChjdXJyZW50RXBvY2hUaW1lIDwgbG9jay50aW1lb3V0KSB7XG4gICAgICByZXR1cm4gTk9fTE9DSztcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKGxvY2tGaWxlKTtcbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICAvL2VtcHR5XG4gICAgfVxuXG4gICAgYXdhaXQgc2xlZXBGb3JSZXRyeSgpO1xuXG4gICAgcmV0dXJuIGF3YWl0IGdldExvY2soXG4gICAgICBhcHAsIGxvY2tGaWxlLCB0aW1lb3V0TWlsbGlzZWNvbmRzLFxuICAgICAgbWF4TG9ja1JldHJpZXMsIHJldHJ5Q291bnQgKyAxLFxuICAgICk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBnZXRMb2NrRmlsZUNvbnRlbnQgPSAodG90YWxUaW1lb3V0LCBlcG9jaFRpbWUpID0+IGAke3RvdGFsVGltZW91dH06JHtlcG9jaFRpbWUudG9TdHJpbmcoKX1gO1xuXG5jb25zdCBwYXJzZUxvY2tGaWxlQ29udGVudCA9IChrZXksIGNvbnRlbnQpID0+ICQoY29udGVudCwgW1xuICBzcGxpdCgnOicpLFxuICBwYXJ0cyA9PiAoe1xuICAgIHRvdGFsVGltZW91dDogbmV3IE51bWJlcihwYXJ0c1swXSksXG4gICAgdGltZW91dDogbmV3IE51bWJlcihwYXJ0c1sxXSksXG4gICAga2V5LFxuICB9KSxcbl0pO1xuXG5leHBvcnQgY29uc3QgcmVsZWFzZUxvY2sgPSBhc3luYyAoYXBwLCBsb2NrKSA9PiB7XG4gIGNvbnN0IGN1cnJlbnRFcG9jaFRpbWUgPSBhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCk7XG4gIC8vIG9ubHkgcmVsZWFzZSBpZiBub3QgdGltZWRvdXRcbiAgaWYgKGN1cnJlbnRFcG9jaFRpbWUgPCAobG9jay50aW1lb3V0IC0gbG9ja092ZXJsYXBNaWxsaXNlY29uZHMpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShsb2NrLmtleSk7XG4gICAgfSBjYXRjaCAoXykge1xuICAgICAgLy9lbXB0eVxuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGV4dGVuZExvY2sgPSBhc3luYyAoYXBwLCBsb2NrKSA9PiB7XG4gIGNvbnN0IGN1cnJlbnRFcG9jaFRpbWUgPSBhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCk7XG4gIC8vIG9ubHkgcmVsZWFzZSBpZiBub3QgdGltZWRvdXRcbiAgaWYgKGN1cnJlbnRFcG9jaFRpbWUgPCAobG9jay50aW1lb3V0IC0gbG9ja092ZXJsYXBNaWxsaXNlY29uZHMpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGxvY2sudGltZW91dCA9IGN1cnJlbnRFcG9jaFRpbWUgKyBsb2NrLnRpbWVvdXRNaWxsaXNlY29uZHM7XG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUZpbGUoXG4gICAgICAgIGxvY2sua2V5LFxuICAgICAgICBnZXRMb2NrRmlsZUNvbnRlbnQobG9jay50b3RhbFRpbWVvdXQsIGxvY2sudGltZW91dCksXG4gICAgICApO1xuICAgICAgcmV0dXJuIGxvY2s7XG4gICAgfSBjYXRjaCAoXykge1xuICAgICAgLy9lbXB0eVxuICAgIH1cbiAgfVxuICByZXR1cm4gTk9fTE9DSztcbn07XG5cbmV4cG9ydCBjb25zdCBOT19MT0NLID0gJ25vIGxvY2snO1xuZXhwb3J0IGNvbnN0IGlzTm9sb2NrID0gaWQgPT4gaWQgPT09IE5PX0xPQ0s7XG5cbmNvbnN0IHNsZWVwRm9yUmV0cnkgPSAoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbG9ja092ZXJsYXBNaWxsaXNlY29uZHMpKTtcbiIsImltcG9ydCB7XG4gIFxuICBoZWFkLCBcbiAgdGFpbCwgZmluZEluZGV4LCBzdGFydHNXaXRoLCBcbiAgZHJvcFJpZ2h0LCBmbG93LCB0YWtlUmlnaHQsIHRyaW0sXG4gIHJlcGxhY2VcbiAgXG59IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBcbiAgc29tZSwgcmVkdWNlLCBpc0VtcHR5LCBpc0FycmF5LCBqb2luLFxuICBpc1N0cmluZywgaXNJbnRlZ2VyLCBpc0RhdGUsIHRvTnVtYmVyLFxuICBpc1VuZGVmaW5lZCwgaXNOYU4sIGlzTnVsbCwgY29uc3RhbnQsXG4gIHNwbGl0LCBpbmNsdWRlc1xufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZXZlbnRzLCBldmVudHNMaXN0IH0gZnJvbSAnLi9ldmVudHMnO1xuaW1wb3J0IHsgYXBpV3JhcHBlciB9IGZyb20gJy4vYXBpV3JhcHBlcic7XG5pbXBvcnQge1xuICBnZXRMb2NrLCBOT19MT0NLLFxuICBpc05vbG9ja1xufSBmcm9tICcuL2xvY2snO1xuXG4vLyB0aGlzIGlzIHRoZSBjb21iaW5hdG9yIGZ1bmN0aW9uXG5leHBvcnQgY29uc3QgJCQgPSAoLi4uZnVuY3MpID0+IGFyZyA9PiBmbG93KGZ1bmNzKShhcmcpO1xuXG4vLyB0aGlzIGlzIHRoZSBwaXBlIGZ1bmN0aW9uXG5leHBvcnQgY29uc3QgJCA9IChhcmcsIGZ1bmNzKSA9PiAkJCguLi5mdW5jcykoYXJnKTtcblxuZXhwb3J0IGNvbnN0IGtleVNlcCA9ICcvJztcbmNvbnN0IHRyaW1LZXlTZXAgPSBzdHIgPT4gdHJpbShzdHIsIGtleVNlcCk7XG5jb25zdCBzcGxpdEJ5S2V5U2VwID0gc3RyID0+IHNwbGl0KGtleVNlcCkoc3RyKTtcbmV4cG9ydCBjb25zdCBzYWZlS2V5ID0ga2V5ID0+IHJlcGxhY2UoYCR7a2V5U2VwfSR7dHJpbUtleVNlcChrZXkpfWAsIGAke2tleVNlcH0ke2tleVNlcH1gLCBrZXlTZXApO1xuZXhwb3J0IGNvbnN0IGpvaW5LZXkgPSAoLi4uc3RycykgPT4ge1xuICBjb25zdCBwYXJhbXNPckFycmF5ID0gc3Rycy5sZW5ndGggPT09IDEgJiBpc0FycmF5KHN0cnNbMF0pXG4gICAgPyBzdHJzWzBdIDogc3RycztcbiAgcmV0dXJuIHNhZmVLZXkoam9pbihrZXlTZXApKHBhcmFtc09yQXJyYXkpKTtcbn07XG5leHBvcnQgY29uc3Qgc3BsaXRLZXkgPSAkJCh0cmltS2V5U2VwLCBzcGxpdEJ5S2V5U2VwKTtcbmV4cG9ydCBjb25zdCBnZXREaXJGb21LZXkgPSAkJChzcGxpdEtleSwgZHJvcFJpZ2h0LCBwID0+IGpvaW5LZXkoLi4ucCkpO1xuZXhwb3J0IGNvbnN0IGdldEZpbGVGcm9tS2V5ID0gJCQoc3BsaXRLZXksIHRha2VSaWdodCwgaGVhZCk7XG5cbmV4cG9ydCBjb25zdCBjb25maWdGb2xkZXIgPSBgJHtrZXlTZXB9LmNvbmZpZ2A7XG5leHBvcnQgY29uc3QgZmllbGREZWZpbml0aW9ucyA9IGpvaW5LZXkoY29uZmlnRm9sZGVyLCAnZmllbGRzLmpzb24nKTtcbmV4cG9ydCBjb25zdCB0ZW1wbGF0ZURlZmluaXRpb25zID0gam9pbktleShjb25maWdGb2xkZXIsICd0ZW1wbGF0ZXMuanNvbicpO1xuZXhwb3J0IGNvbnN0IGFwcERlZmluaXRpb25GaWxlID0gam9pbktleShjb25maWdGb2xkZXIsICdhcHBEZWZpbml0aW9uLmpzb24nKTtcbmV4cG9ydCBjb25zdCBkaXJJbmRleCA9IGZvbGRlclBhdGggPT4gam9pbktleShjb25maWdGb2xkZXIsICdkaXInLCAuLi5zcGxpdEtleShmb2xkZXJQYXRoKSwgJ2Rpci5pZHgnKTtcbmV4cG9ydCBjb25zdCBnZXRJbmRleEtleUZyb21GaWxlS2V5ID0gJCQoZ2V0RGlyRm9tS2V5LCBkaXJJbmRleCk7XG5cbmV4cG9ydCBjb25zdCBpZkV4aXN0cyA9ICh2YWwsIGV4aXN0cywgbm90RXhpc3RzKSA9PiAoaXNVbmRlZmluZWQodmFsKVxuICA/IGlzVW5kZWZpbmVkKG5vdEV4aXN0cykgPyAoKCkgPT4geyB9KSgpIDogbm90RXhpc3RzKClcbiAgOiBleGlzdHMoKSk7XG5cbmV4cG9ydCBjb25zdCBnZXRPckRlZmF1bHQgPSAodmFsLCBkZWZhdWx0VmFsKSA9PiBpZkV4aXN0cyh2YWwsICgpID0+IHZhbCwgKCkgPT4gZGVmYXVsdFZhbCk7XG5cbmV4cG9ydCBjb25zdCBub3QgPSBmdW5jID0+IHZhbCA9PiAhZnVuYyh2YWwpO1xuZXhwb3J0IGNvbnN0IGlzRGVmaW5lZCA9IG5vdChpc1VuZGVmaW5lZCk7XG5leHBvcnQgY29uc3QgaXNOb25OdWxsID0gbm90KGlzTnVsbCk7XG5leHBvcnQgY29uc3QgaXNOb3ROYU4gPSBub3QoaXNOYU4pO1xuXG5leHBvcnQgY29uc3QgYWxsVHJ1ZSA9ICguLi5mdW5jQXJncykgPT4gdmFsID0+IHJlZHVjZShcbiAgKHJlc3VsdCwgY29uZGl0aW9uRnVuYykgPT4gKGlzTnVsbChyZXN1bHQpIHx8IHJlc3VsdCA9PSB0cnVlKSAmJiBjb25kaXRpb25GdW5jKHZhbCksXG4gIG51bGwpKGZ1bmNBcmdzKTtcblxuZXhwb3J0IGNvbnN0IGFueVRydWUgPSAoLi4uZnVuY0FyZ3MpID0+IHZhbCA9PiByZWR1Y2UoXG4gIChyZXN1bHQsIGNvbmRpdGlvbkZ1bmMpID0+IHJlc3VsdCA9PSB0cnVlIHx8IGNvbmRpdGlvbkZ1bmModmFsKSxcbiAgbnVsbCkoZnVuY0FyZ3MpO1xuXG5leHBvcnQgY29uc3QgaW5zZW5zaXRpdmVFcXVhbHMgPSAoc3RyMSwgc3RyMikgPT4gc3RyMS50cmltKCkudG9Mb3dlckNhc2UoKSA9PT0gc3RyMi50cmltKCkudG9Mb3dlckNhc2UoKTtcblxuZXhwb3J0IGNvbnN0IGlzU29tZXRoaW5nID0gYWxsVHJ1ZShpc0RlZmluZWQsIGlzTm9uTnVsbCwgaXNOb3ROYU4pO1xuZXhwb3J0IGNvbnN0IGlzTm90aGluZyA9IG5vdChpc1NvbWV0aGluZyk7XG5leHBvcnQgY29uc3QgaXNOb3RoaW5nT3JFbXB0eSA9IHYgPT4gaXNOb3RoaW5nKHYpIHx8IGlzRW1wdHkodik7XG5leHBvcnQgY29uc3Qgc29tZXRoaW5nT3JHZXREZWZhdWx0ID0gZ2V0RGVmYXVsdEZ1bmMgPT4gdmFsID0+IChpc1NvbWV0aGluZyh2YWwpID8gdmFsIDogZ2V0RGVmYXVsdEZ1bmMoKSk7XG5leHBvcnQgY29uc3Qgc29tZXRoaW5nT3JEZWZhdWx0ID0gKHZhbCwgZGVmYXVsdFZhbCkgPT4gc29tZXRoaW5nT3JHZXREZWZhdWx0KGNvbnN0YW50KGRlZmF1bHRWYWwpKSh2YWwpO1xuXG5leHBvcnQgY29uc3QgbWFwSWZTb21ldGhpbmdPckRlZmF1bHQgPSAobWFwRnVuYywgZGVmYXVsdFZhbCkgPT4gdmFsID0+IChpc1NvbWV0aGluZyh2YWwpID8gbWFwRnVuYyh2YWwpIDogZGVmYXVsdFZhbCk7XG5cbmV4cG9ydCBjb25zdCBtYXBJZlNvbWV0aGluZ09yQmxhbmsgPSBtYXBGdW5jID0+IG1hcElmU29tZXRoaW5nT3JEZWZhdWx0KG1hcEZ1bmMsICcnKTtcblxuZXhwb3J0IGNvbnN0IG5vbmUgPSBwcmVkaWNhdGUgPT4gY29sbGVjdGlvbiA9PiAhc29tZShwcmVkaWNhdGUpKGNvbGxlY3Rpb24pO1xuXG5leHBvcnQgY29uc3QgYWxsID0gcHJlZGljYXRlID0+IGNvbGxlY3Rpb24gPT4gbm9uZSh2ID0+ICFwcmVkaWNhdGUodikpKGNvbGxlY3Rpb24pO1xuXG5leHBvcnQgY29uc3QgaXNOb3RFbXB0eSA9IG9iID0+ICFpc0VtcHR5KG9iKTtcbmV4cG9ydCBjb25zdCBpc0FzeW5jID0gZm4gPT4gZm4uY29uc3RydWN0b3IubmFtZSA9PT0gJ0FzeW5jRnVuY3Rpb24nO1xuZXhwb3J0IGNvbnN0IGlzTm9uRW1wdHlBcnJheSA9IGFsbFRydWUoaXNBcnJheSwgaXNOb3RFbXB0eSk7XG5leHBvcnQgY29uc3QgaXNOb25FbXB0eVN0cmluZyA9IGFsbFRydWUoaXNTdHJpbmcsIGlzTm90RW1wdHkpO1xuZXhwb3J0IGNvbnN0IHRyeU9yID0gZmFpbEZ1bmMgPT4gKGZ1bmMsIC4uLmFyZ3MpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnVuYy5hcHBseShudWxsLCAuLi5hcmdzKTtcbiAgfSBjYXRjaCAoXykge1xuICAgIHJldHVybiBmYWlsRnVuYygpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgdHJ5QXdhaXRPciA9IGZhaWxGdW5jID0+IGFzeW5jIChmdW5jLCAuLi5hcmdzKSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGZ1bmMuYXBwbHkobnVsbCwgLi4uYXJncyk7XG4gIH0gY2F0Y2ggKF8pIHtcbiAgICByZXR1cm4gYXdhaXQgZmFpbEZ1bmMoKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGRlZmluZUVycm9yID0gKGZ1bmMsIGVycm9yUHJlZml4KSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZ1bmMoKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZXJyLm1lc3NhZ2UgPSBgJHtlcnJvclByZWZpeH0gOiAke2Vyci5tZXNzYWdlfWA7XG4gICAgdGhyb3cgZXJyO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgdHJ5T3JJZ25vcmUgPSB0cnlPcigoKSA9PiB7IH0pO1xuZXhwb3J0IGNvbnN0IHRyeUF3YWl0T3JJZ25vcmUgPSB0cnlBd2FpdE9yKGFzeW5jICgpID0+IHsgfSk7XG5leHBvcnQgY29uc3QgY2F1c2VzRXhjZXB0aW9uID0gKGZ1bmMpID0+IHtcbiAgdHJ5IHtcbiAgICBmdW5jKCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24gPSBmdW5jID0+ICFjYXVzZXNFeGNlcHRpb24oZnVuYyk7XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVFcnJvcldpdGggPSByZXR1cm5WYWxJbkVycm9yID0+IHRyeU9yKGNvbnN0YW50KHJldHVyblZhbEluRXJyb3IpKTtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZUVycm9yV2l0aFVuZGVmaW5lZCA9IGhhbmRsZUVycm9yV2l0aCh1bmRlZmluZWQpO1xuXG5leHBvcnQgY29uc3Qgc3dpdGNoQ2FzZSA9ICguLi5jYXNlcykgPT4gKHZhbHVlKSA9PiB7XG4gIGNvbnN0IG5leHRDYXNlID0gKCkgPT4gaGVhZChjYXNlcylbMF0odmFsdWUpO1xuICBjb25zdCBuZXh0UmVzdWx0ID0gKCkgPT4gaGVhZChjYXNlcylbMV0odmFsdWUpO1xuXG4gIGlmIChpc0VtcHR5KGNhc2VzKSkgcmV0dXJuOyAvLyB1bmRlZmluZWRcbiAgaWYgKG5leHRDYXNlKCkgPT09IHRydWUpIHJldHVybiBuZXh0UmVzdWx0KCk7XG4gIHJldHVybiBzd2l0Y2hDYXNlKC4uLnRhaWwoY2FzZXMpKSh2YWx1ZSk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNWYWx1ZSA9IHZhbDEgPT4gdmFsMiA9PiAodmFsMSA9PT0gdmFsMik7XG5leHBvcnQgY29uc3QgaXNPbmVPZiA9ICguLi52YWxzKSA9PiB2YWwgPT4gaW5jbHVkZXModmFsKSh2YWxzKTtcbmV4cG9ydCBjb25zdCBkZWZhdWx0Q2FzZSA9IGNvbnN0YW50KHRydWUpO1xuZXhwb3J0IGNvbnN0IG1lbWJlck1hdGNoZXMgPSAobWVtYmVyLCBtYXRjaCkgPT4gb2JqID0+IG1hdGNoKG9ialttZW1iZXJdKTtcblxuXG5leHBvcnQgY29uc3QgU3RhcnRzV2l0aCA9IHNlYXJjaEZvciA9PiBzZWFyY2hJbiA9PiBzdGFydHNXaXRoKHNlYXJjaEluLCBzZWFyY2hGb3IpO1xuXG5leHBvcnQgY29uc3QgY29udGFpbnMgPSB2YWwgPT4gYXJyYXkgPT4gKGZpbmRJbmRleChhcnJheSwgdiA9PiB2ID09PSB2YWwpID4gLTEpO1xuXG5leHBvcnQgY29uc3QgZ2V0SGFzaENvZGUgPSAocykgPT4ge1xuICBsZXQgaGFzaCA9IDA7IGxldCBpOyBsZXQgY2hhcjsgbGV0XG4gICAgbDtcbiAgaWYgKHMubGVuZ3RoID09IDApIHJldHVybiBoYXNoO1xuICBmb3IgKGkgPSAwLCBsID0gcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjaGFyID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGNoYXI7XG4gICAgaGFzaCB8PSAwOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgfVxuXG4gIC8vIGNvbnZlcnRpbmcgdG8gc3RyaW5nLCBidXQgZG9udCB3YW50IGEgXCItXCIgcHJlZml4ZWRcbiAgaWYgKGhhc2ggPCAwKSB7IHJldHVybiBgbiR7KGhhc2ggKiAtMSkudG9TdHJpbmcoKX1gOyB9XG4gIHJldHVybiBoYXNoLnRvU3RyaW5nKCk7XG59O1xuXG4vLyB0aGFua3MgdG8gaHR0cHM6Ly9ibG9nLmdyb3NzbWFuLmlvL2hvdy10by13cml0ZS1hc3luYy1hd2FpdC13aXRob3V0LXRyeS1jYXRjaC1ibG9ja3MtaW4tamF2YXNjcmlwdC9cbmV4cG9ydCBjb25zdCBhd0V4ID0gYXN5bmMgKHByb21pc2UpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBwcm9taXNlO1xuICAgIHJldHVybiBbdW5kZWZpbmVkLCByZXN1bHRdO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBbZXJyb3IsIHVuZGVmaW5lZF07XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBpc1NhZmVJbnRlZ2VyID0gbiA9PiBpc0ludGVnZXIobilcbiAgICAmJiBuIDw9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gICAgJiYgbiA+PSAwIC0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG5cbmV4cG9ydCBjb25zdCB0b0RhdGVPck51bGwgPSBzID0+IChpc051bGwocykgPyBudWxsXG4gIDogaXNEYXRlKHMpID8gcyA6IG5ldyBEYXRlKHMpKTtcbmV4cG9ydCBjb25zdCB0b0Jvb2xPck51bGwgPSBzID0+IChpc051bGwocykgPyBudWxsXG4gIDogcyA9PT0gJ3RydWUnIHx8IHMgPT09IHRydWUpO1xuZXhwb3J0IGNvbnN0IHRvTnVtYmVyT3JOdWxsID0gcyA9PiAoaXNOdWxsKHMpID8gbnVsbFxuICA6IHRvTnVtYmVyKHMpKTtcblxuZXhwb3J0IGNvbnN0IGlzQXJyYXlPZlN0cmluZyA9IG9wdHMgPT4gaXNBcnJheShvcHRzKSAmJiBhbGwoaXNTdHJpbmcpKG9wdHMpO1xuXG5leHBvcnQgY29uc3QgcGF1c2UgPSBhc3luYyBkdXJhdGlvbiA9PiBuZXcgUHJvbWlzZShyZXMgPT4gc2V0VGltZW91dChyZXMsIGR1cmF0aW9uKSk7XG5cbmV4cG9ydCBjb25zdCByZXRyeSA9IGFzeW5jIChmbiwgcmV0cmllcywgZGVsYXksIC4uLmFyZ3MpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgZm4oLi4uYXJncyk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChyZXRyaWVzID4gMSkge1xuICAgICAgcmV0dXJuIGF3YWl0IHBhdXNlKGRlbGF5KS50aGVuKGFzeW5jICgpID0+IGF3YWl0IHJldHJ5KGZuLCAocmV0cmllcyAtIDEpLCBkZWxheSwgLi4uYXJncykpO1xuICAgIH1cbiAgICB0aHJvdyBlcnI7XG4gIH1cbn07XG5cbmV4cG9ydCB7IGV2ZW50cyB9IGZyb20gJy4vZXZlbnRzJztcbmV4cG9ydCB7IGFwaVdyYXBwZXIsIGFwaVdyYXBwZXJTeW5jIH0gZnJvbSAnLi9hcGlXcmFwcGVyJztcbmV4cG9ydCB7XG4gIGdldExvY2ssIE5PX0xPQ0ssIHJlbGVhc2VMb2NrLFxuICBleHRlbmRMb2NrLCBpc05vbG9jayxcbn0gZnJvbSAnLi9sb2NrJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBpZkV4aXN0cyxcbiAgZ2V0T3JEZWZhdWx0LFxuICBpc0RlZmluZWQsXG4gIGlzTm9uTnVsbCxcbiAgaXNOb3ROYU4sXG4gIGFsbFRydWUsXG4gIGlzU29tZXRoaW5nLFxuICBtYXBJZlNvbWV0aGluZ09yRGVmYXVsdCxcbiAgbWFwSWZTb21ldGhpbmdPckJsYW5rLFxuICBjb25maWdGb2xkZXIsXG4gIGZpZWxkRGVmaW5pdGlvbnMsXG4gIGlzTm90aGluZyxcbiAgbm90LFxuICBzd2l0Y2hDYXNlLFxuICBkZWZhdWx0Q2FzZSxcbiAgU3RhcnRzV2l0aCxcbiAgY29udGFpbnMsXG4gIHRlbXBsYXRlRGVmaW5pdGlvbnMsXG4gIGhhbmRsZUVycm9yV2l0aCxcbiAgaGFuZGxlRXJyb3JXaXRoVW5kZWZpbmVkLFxuICB0cnlPcixcbiAgdHJ5T3JJZ25vcmUsXG4gIHRyeUF3YWl0T3IsXG4gIHRyeUF3YWl0T3JJZ25vcmUsXG4gIGRpckluZGV4LFxuICBrZXlTZXAsXG4gICQsXG4gICQkLFxuICBnZXREaXJGb21LZXksXG4gIGdldEZpbGVGcm9tS2V5LFxuICBzcGxpdEtleSxcbiAgc29tZXRoaW5nT3JEZWZhdWx0LFxuICBnZXRJbmRleEtleUZyb21GaWxlS2V5LFxuICBqb2luS2V5LFxuICBzb21ldGhpbmdPckdldERlZmF1bHQsXG4gIGFwcERlZmluaXRpb25GaWxlLFxuICBpc1ZhbHVlLFxuICBhbGwsXG4gIGlzT25lT2YsXG4gIG1lbWJlck1hdGNoZXMsXG4gIGRlZmluZUVycm9yLFxuICBhbnlUcnVlLFxuICBpc05vbkVtcHR5QXJyYXksXG4gIGNhdXNlc0V4Y2VwdGlvbixcbiAgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uLFxuICBub25lLFxuICBnZXRIYXNoQ29kZSxcbiAgYXdFeCxcbiAgYXBpV3JhcHBlcixcbiAgZXZlbnRzLFxuICBldmVudHNMaXN0LFxuICBpc05vdGhpbmdPckVtcHR5LFxuICBpc1NhZmVJbnRlZ2VyLFxuICB0b051bWJlcixcbiAgdG9EYXRlOiB0b0RhdGVPck51bGwsXG4gIHRvQm9vbDogdG9Cb29sT3JOdWxsLFxuICBpc0FycmF5T2ZTdHJpbmcsXG4gIGdldExvY2ssXG4gIE5PX0xPQ0ssXG4gIGlzTm9sb2NrLFxuICBpbnNlbnNpdGl2ZUVxdWFscyxcbiAgcGF1c2UsXG4gIHJldHJ5LFxufTtcbiIsImltcG9ydCB7IGZpbHRlciwgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7ICQsIGlzU29tZXRoaW5nIH0gZnJvbSAnLi9pbmRleCc7XG5cbmV4cG9ydCBjb25zdCBzdHJpbmdOb3RFbXB0eSA9IHMgPT4gaXNTb21ldGhpbmcocykgJiYgcy50cmltKCkubGVuZ3RoID4gMDtcblxuZXhwb3J0IGNvbnN0IG1ha2VydWxlID0gKGZpZWxkLCBlcnJvciwgaXNWYWxpZCkgPT4gKHsgZmllbGQsIGVycm9yLCBpc1ZhbGlkIH0pO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGlvbkVycm9yID0gKHJ1bGUsIGl0ZW0pID0+ICh7IC4uLnJ1bGUsIGl0ZW0gfSk7XG5cbmV4cG9ydCBjb25zdCBhcHBseVJ1bGVTZXQgPSBydWxlU2V0ID0+IGl0ZW1Ub1ZhbGlkYXRlID0+ICQocnVsZVNldCwgW1xuICBtYXAoYXBwbHlSdWxlKGl0ZW1Ub1ZhbGlkYXRlKSksXG4gIGZpbHRlcihpc1NvbWV0aGluZyksXG5dKTtcblxuZXhwb3J0IGNvbnN0IGFwcGx5UnVsZSA9IGl0ZW1Ub3ZhbGlkYXRlID0+IHJ1bGUgPT4gKHJ1bGUuaXNWYWxpZChpdGVtVG92YWxpZGF0ZSlcbiAgPyBudWxsXG4gIDogdmFsaWRhdGlvbkVycm9yKHJ1bGUsIGl0ZW1Ub3ZhbGlkYXRlKSk7XG4iLCJpbXBvcnQgeyBjb21waWxlRXhwcmVzc2lvbiwgY29tcGlsZUNvZGUgfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XG5pbXBvcnQge1xuICBpc1VuZGVmaW5lZCwga2V5cywgXG4gIGNsb25lRGVlcCwgaXNGdW5jdGlvbixcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGRlZmluZUVycm9yIH0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGZpbHRlckV2YWwgPSAnRklMVEVSX0VWQUxVQVRFJztcbmV4cG9ydCBjb25zdCBmaWx0ZXJDb21waWxlID0gJ0ZJTFRFUl9DT01QSUxFJztcbmV4cG9ydCBjb25zdCBtYXBFdmFsID0gJ01BUF9FVkFMVUFURSc7XG5leHBvcnQgY29uc3QgbWFwQ29tcGlsZSA9ICdNQVBfQ09NUElMRSc7XG5leHBvcnQgY29uc3QgcmVtb3ZlVW5kZWNsYXJlZEZpZWxkcyA9ICdSRU1PVkVfVU5ERUNMQVJFRF9GSUVMRFMnO1xuZXhwb3J0IGNvbnN0IGFkZFVuTWFwcGVkRmllbGRzID0gJ0FERF9VTk1BUFBFRF9GSUVMRFMnO1xuZXhwb3J0IGNvbnN0IGFkZFRoZUtleSA9ICdBRERfS0VZJztcblxuXG5jb25zdCBnZXRFdmFsdWF0ZVJlc3VsdCA9ICgpID0+ICh7XG4gIGlzRXJyb3I6IGZhbHNlLFxuICBwYXNzZWRGaWx0ZXI6IHRydWUsXG4gIHJlc3VsdDogbnVsbCxcbn0pO1xuXG5leHBvcnQgY29uc3QgY29tcGlsZUZpbHRlciA9IGluZGV4ID0+IGNvbXBpbGVFeHByZXNzaW9uKGluZGV4LmZpbHRlcik7XG5cbmV4cG9ydCBjb25zdCBjb21waWxlTWFwID0gaW5kZXggPT4gY29tcGlsZUNvZGUoaW5kZXgubWFwKTtcblxuZXhwb3J0IGNvbnN0IHBhc3Nlc0ZpbHRlciA9IChyZWNvcmQsIGluZGV4KSA9PiB7XG4gIGNvbnN0IGNvbnRleHQgPSB7IHJlY29yZCB9O1xuICBpZiAoIWluZGV4LmZpbHRlcikgcmV0dXJuIHRydWU7XG5cbiAgY29uc3QgY29tcGlsZWRGaWx0ZXIgPSBkZWZpbmVFcnJvcihcbiAgICAoKSA9PiBjb21waWxlRmlsdGVyKGluZGV4KSxcbiAgICBmaWx0ZXJDb21waWxlLFxuICApO1xuXG4gIHJldHVybiBkZWZpbmVFcnJvcihcbiAgICAoKSA9PiBjb21waWxlZEZpbHRlcihjb250ZXh0KSxcbiAgICBmaWx0ZXJFdmFsLFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IG1hcFJlY29yZCA9IChyZWNvcmQsIGluZGV4KSA9PiB7XG4gIGNvbnN0IHJlY29yZENsb25lID0gY2xvbmVEZWVwKHJlY29yZCk7XG4gIGNvbnN0IGNvbnRleHQgPSB7IHJlY29yZDogcmVjb3JkQ2xvbmUgfTtcblxuICBjb25zdCBtYXAgPSBpbmRleC5tYXAgPyBpbmRleC5tYXAgOiAncmV0dXJuIHsuLi5yZWNvcmR9Oyc7XG5cbiAgY29uc3QgY29tcGlsZWRNYXAgPSBkZWZpbmVFcnJvcihcbiAgICAoKSA9PiBjb21waWxlQ29kZShtYXApLFxuICAgIG1hcENvbXBpbGUsXG4gICk7XG5cbiAgY29uc3QgbWFwcGVkID0gZGVmaW5lRXJyb3IoXG4gICAgKCkgPT4gY29tcGlsZWRNYXAoY29udGV4dCksXG4gICAgbWFwRXZhbCxcbiAgKTtcblxuICBjb25zdCBtYXBwZWRLZXlzID0ga2V5cyhtYXBwZWQpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hcHBlZEtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBrZXkgPSBtYXBwZWRLZXlzW2ldO1xuICAgIG1hcHBlZFtrZXldID0gaXNVbmRlZmluZWQobWFwcGVkW2tleV0pID8gbnVsbCA6IG1hcHBlZFtrZXldO1xuICAgIGlmIChpc0Z1bmN0aW9uKG1hcHBlZFtrZXldKSkge1xuICAgICAgZGVsZXRlIG1hcHBlZFtrZXldO1xuICAgIH1cbiAgfVxuXG4gIG1hcHBlZC5rZXkgPSByZWNvcmQua2V5O1xuICBtYXBwZWQuc29ydEtleSA9IGluZGV4LmdldFNvcnRLZXlcbiAgICA/IGNvbXBpbGVDb2RlKGluZGV4LmdldFNvcnRLZXkpKGNvbnRleHQpXG4gICAgOiByZWNvcmQuaWQ7XG5cbiAgcmV0dXJuIG1hcHBlZDtcbn07XG5cbmV4cG9ydCBjb25zdCBldmFsdWF0ZSA9IHJlY29yZCA9PiAoaW5kZXgpID0+IHtcbiAgY29uc3QgcmVzdWx0ID0gZ2V0RXZhbHVhdGVSZXN1bHQoKTtcblxuICB0cnkge1xuICAgIHJlc3VsdC5wYXNzZWRGaWx0ZXIgPSBwYXNzZXNGaWx0ZXIocmVjb3JkLCBpbmRleCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJlc3VsdC5pc0Vycm9yID0gdHJ1ZTtcbiAgICByZXN1bHQucGFzc2VkRmlsdGVyID0gZmFsc2U7XG4gICAgcmVzdWx0LnJlc3VsdCA9IGVyci5tZXNzYWdlO1xuICB9XG5cbiAgaWYgKCFyZXN1bHQucGFzc2VkRmlsdGVyKSByZXR1cm4gcmVzdWx0O1xuXG4gIHRyeSB7XG4gICAgcmVzdWx0LnJlc3VsdCA9IG1hcFJlY29yZChyZWNvcmQsIGluZGV4KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmVzdWx0LmlzRXJyb3IgPSB0cnVlO1xuICAgIHJlc3VsdC5yZXN1bHQgPSBlcnIubWVzc2FnZTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBldmFsdWF0ZTtcbiIsImltcG9ydCB7XG4gIG1hcCwgaXNFbXB0eSwgY291bnRCeSwgXG4gIGZsYXR0ZW4sIGluY2x1ZGVzLCBqb2luLCBrZXlzXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyAgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSB9IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcbmltcG9ydCB7IGNvbXBpbGVGaWx0ZXIsIGNvbXBpbGVNYXAgfSBmcm9tICcuLi9pbmRleGluZy9ldmFsdWF0ZSc7XG5pbXBvcnQgeyBpc05vbkVtcHR5U3RyaW5nLCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24sICQgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgaXNSZWNvcmQgfSBmcm9tICcuL2hpZXJhcmNoeSc7XG5cbmV4cG9ydCBjb25zdCBpbmRleFR5cGVzID0geyByZWZlcmVuY2U6ICdyZWZlcmVuY2UnLCBhbmNlc3RvcjogJ2FuY2VzdG9yJyB9O1xuXG5leHBvcnQgY29uc3QgaW5kZXhSdWxlU2V0ID0gW1xuICBtYWtlcnVsZSgnbWFwJywgJ2luZGV4IGhhcyBubyBtYXAgZnVuY3Rpb24nLFxuICAgIGluZGV4ID0+IGlzTm9uRW1wdHlTdHJpbmcoaW5kZXgubWFwKSksXG4gIG1ha2VydWxlKCdtYXAnLCBcImluZGV4J3MgbWFwIGZ1bmN0aW9uIGRvZXMgbm90IGNvbXBpbGVcIixcbiAgICBpbmRleCA9PiAhaXNOb25FbXB0eVN0cmluZyhpbmRleC5tYXApXG4gICAgICAgICAgICAgICAgfHwgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uKCgpID0+IGNvbXBpbGVNYXAoaW5kZXgpKSksXG4gIG1ha2VydWxlKCdmaWx0ZXInLCBcImluZGV4J3MgZmlsdGVyIGZ1bmN0aW9uIGRvZXMgbm90IGNvbXBpbGVcIixcbiAgICBpbmRleCA9PiAhaXNOb25FbXB0eVN0cmluZyhpbmRleC5maWx0ZXIpXG4gICAgICAgICAgICAgICAgfHwgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uKCgpID0+IGNvbXBpbGVGaWx0ZXIoaW5kZXgpKSksXG4gIG1ha2VydWxlKCduYW1lJywgJ211c3QgZGVjbGFyZSBhIG5hbWUgZm9yIGluZGV4JyxcbiAgICBpbmRleCA9PiBpc05vbkVtcHR5U3RyaW5nKGluZGV4Lm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAndGhlcmUgaXMgYSBkdXBsaWNhdGUgbmFtZWQgaW5kZXggb24gdGhpcyBub2RlJyxcbiAgICBpbmRleCA9PiBpc0VtcHR5KGluZGV4Lm5hbWUpXG4gICAgICAgICAgICAgICAgfHwgY291bnRCeSgnbmFtZScpKGluZGV4LnBhcmVudCgpLmluZGV4ZXMpW2luZGV4Lm5hbWVdID09PSAxKSxcbiAgbWFrZXJ1bGUoJ2luZGV4VHlwZScsICdyZWZlcmVuY2UgaW5kZXggbWF5IG9ubHkgZXhpc3Qgb24gYSByZWNvcmQgbm9kZScsXG4gICAgaW5kZXggPT4gaXNSZWNvcmQoaW5kZXgucGFyZW50KCkpXG4gICAgICAgICAgICAgICAgICB8fCBpbmRleC5pbmRleFR5cGUgIT09IGluZGV4VHlwZXMucmVmZXJlbmNlKSxcbiAgbWFrZXJ1bGUoJ2luZGV4VHlwZScsIGBpbmRleCB0eXBlIG11c3QgYmUgb25lIG9mOiAke2pvaW4oJywgJykoa2V5cyhpbmRleFR5cGVzKSl9YCxcbiAgICBpbmRleCA9PiBpbmNsdWRlcyhpbmRleC5pbmRleFR5cGUpKGtleXMoaW5kZXhUeXBlcykpKSxcbl07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUluZGV4ID0gKGluZGV4LCBhbGxSZWZlcmVuY2VJbmRleGVzT25Ob2RlKSA9PiBhcHBseVJ1bGVTZXQoaW5kZXhSdWxlU2V0KGFsbFJlZmVyZW5jZUluZGV4ZXNPbk5vZGUpKShpbmRleCk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFsbEluZGV4ZXMgPSBub2RlID0+ICQobm9kZS5pbmRleGVzLCBbXG4gIG1hcChpID0+IHZhbGlkYXRlSW5kZXgoaSwgbm9kZS5pbmRleGVzKSksXG4gIGZsYXR0ZW4sXG5dKTtcbiIsImltcG9ydCB7XG4gIGZpbmQsIGNvbnN0YW50LCBtYXAsIGxhc3QsXG4gIGZpcnN0LCBzcGxpdCwgaW50ZXJzZWN0aW9uLCB0YWtlLFxuICB1bmlvbiwgaW5jbHVkZXMsIGZpbHRlciwgc29tZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gICQsIHN3aXRjaENhc2UsIGlzTm90aGluZywgaXNTb21ldGhpbmcsXG4gIGRlZmF1bHRDYXNlLCBzcGxpdEtleSwgaXNOb25FbXB0eVN0cmluZyxcbiAgam9pbktleSwgZ2V0SGFzaENvZGUsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBpbmRleFR5cGVzIH0gZnJvbSAnLi9pbmRleGVzJztcblxuZXhwb3J0IGNvbnN0IGdldEZsYXR0ZW5lZEhpZXJhcmNoeSA9IChhcHBIaWVyYXJjaHksIHVzZUNhY2hlZCA9IHRydWUpID0+IHtcbiAgaWYgKGlzU29tZXRoaW5nKGFwcEhpZXJhcmNoeS5nZXRGbGF0dGVuZWRIaWVyYXJjaHkpICYmIHVzZUNhY2hlZCkgeyByZXR1cm4gYXBwSGllcmFyY2h5LmdldEZsYXR0ZW5lZEhpZXJhcmNoeSgpOyB9XG5cbiAgY29uc3QgZmxhdHRlbkhpZXJhcmNoeSA9IChjdXJyZW50Tm9kZSwgZmxhdHRlbmVkKSA9PiB7XG4gICAgZmxhdHRlbmVkLnB1c2goY3VycmVudE5vZGUpO1xuICAgIGlmICgoIWN1cnJlbnROb2RlLmNoaWxkcmVuXG4gICAgICAgICAgICB8fCBjdXJyZW50Tm9kZS5jaGlsZHJlbi5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAmJiAoIWN1cnJlbnROb2RlLmluZGV4ZXNcbiAgICAgICAgICAgIHx8IGN1cnJlbnROb2RlLmluZGV4ZXMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgJiYgKCFjdXJyZW50Tm9kZS5hZ2dyZWdhdGVHcm91cHNcbiAgICAgICAgICAgIHx8IGN1cnJlbnROb2RlLmFnZ3JlZ2F0ZUdyb3Vwcy5sZW5ndGggPT09IDApKSB7XG4gICAgICByZXR1cm4gZmxhdHRlbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IHVuaW9uSWZBbnkgPSBsMiA9PiBsMSA9PiB1bmlvbihsMSkoIWwyID8gW10gOiBsMik7XG5cbiAgICBjb25zdCBjaGlsZHJlbiA9ICQoW10sIFtcbiAgICAgIHVuaW9uSWZBbnkoY3VycmVudE5vZGUuY2hpbGRyZW4pLFxuICAgICAgdW5pb25JZkFueShjdXJyZW50Tm9kZS5pbmRleGVzKSxcbiAgICAgIHVuaW9uSWZBbnkoY3VycmVudE5vZGUuYWdncmVnYXRlR3JvdXBzKSxcbiAgICBdKTtcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGZsYXR0ZW5IaWVyYXJjaHkoY2hpbGQsIGZsYXR0ZW5lZCk7XG4gICAgfVxuICAgIHJldHVybiBmbGF0dGVuZWQ7XG4gIH07XG5cbiAgYXBwSGllcmFyY2h5LmdldEZsYXR0ZW5lZEhpZXJhcmNoeSA9ICgpID0+IGZsYXR0ZW5IaWVyYXJjaHkoYXBwSGllcmFyY2h5LCBbXSk7XG4gIHJldHVybiBhcHBIaWVyYXJjaHkuZ2V0RmxhdHRlbmVkSGllcmFyY2h5KCk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TGFzdFBhcnRJbktleSA9IGtleSA9PiBsYXN0KHNwbGl0S2V5KGtleSkpO1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZXNJblBhdGggPSBhcHBIaWVyYXJjaHkgPT4ga2V5ID0+ICQoYXBwSGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmlsdGVyKG4gPT4gbmV3IFJlZ0V4cChgJHtuLnBhdGhSZWd4KCl9YCkudGVzdChrZXkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0RXhhY3ROb2RlRm9yUGF0aCA9IGFwcEhpZXJhcmNoeSA9PiBrZXkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gbmV3IFJlZ0V4cChgJHtuLnBhdGhSZWd4KCl9JGApLnRlc3Qoa2V5KSksXG5dKTtcblxuZXhwb3J0IGNvbnN0IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aCA9IGFwcEhpZXJhcmNoeSA9PiBjb2xsZWN0aW9uS2V5ID0+ICQoYXBwSGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmluZChuID0+IChpc0NvbGxlY3Rpb25SZWNvcmQobilcbiAgICAgICAgICAgICAgICAgICAmJiBuZXcgUmVnRXhwKGAke24uY29sbGVjdGlvblBhdGhSZWd4KCl9JGApLnRlc3QoY29sbGVjdGlvbktleSkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgaGFzTWF0Y2hpbmdBbmNlc3RvciA9IGFuY2VzdG9yUHJlZGljYXRlID0+IGRlY2VuZGFudE5vZGUgPT4gc3dpdGNoQ2FzZShcblxuICBbbm9kZSA9PiBpc05vdGhpbmcobm9kZS5wYXJlbnQoKSksXG4gICAgY29uc3RhbnQoZmFsc2UpXSxcblxuICBbbm9kZSA9PiBhbmNlc3RvclByZWRpY2F0ZShub2RlLnBhcmVudCgpKSxcbiAgICBjb25zdGFudCh0cnVlKV0sXG5cbiAgW2RlZmF1bHRDYXNlLFxuICAgIG5vZGUgPT4gaGFzTWF0Y2hpbmdBbmNlc3RvcihhbmNlc3RvclByZWRpY2F0ZSkobm9kZS5wYXJlbnQoKSldLFxuXG4pKGRlY2VuZGFudE5vZGUpO1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZSA9IChhcHBIaWVyYXJjaHksIG5vZGVLZXkpID0+ICQoYXBwSGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmluZChuID0+IG4ubm9kZUtleSgpID09PSBub2RlS2V5XG4gICAgICAgICAgICAgICAgICB8fCAoaXNDb2xsZWN0aW9uUmVjb3JkKG4pXG4gICAgICAgICAgICAgICAgICAgICAgJiYgbi5jb2xsZWN0aW9uTm9kZUtleSgpID09PSBub2RlS2V5KSksXG5dKTtcblxuZXhwb3J0IGNvbnN0IGdldENvbGxlY3Rpb25Ob2RlID0gKGFwcEhpZXJhcmNoeSwgbm9kZUtleSkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gKGlzQ29sbGVjdGlvblJlY29yZChuKVxuICAgICAgICAgICAgICAgICAgICAmJiBuLmNvbGxlY3Rpb25Ob2RlS2V5KCkgPT09IG5vZGVLZXkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZUJ5S2V5T3JOb2RlS2V5ID0gKGFwcEhpZXJhcmNoeSwga2V5T3JOb2RlS2V5KSA9PiB7XG4gIGNvbnN0IG5vZGVCeUtleSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwSGllcmFyY2h5KShrZXlPck5vZGVLZXkpO1xuICByZXR1cm4gaXNOb3RoaW5nKG5vZGVCeUtleSlcbiAgICA/IGdldE5vZGUoYXBwSGllcmFyY2h5LCBrZXlPck5vZGVLZXkpXG4gICAgOiBub2RlQnlLZXk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Q29sbGVjdGlvbk5vZGVCeUtleU9yTm9kZUtleSA9IChhcHBIaWVyYXJjaHksIGtleU9yTm9kZUtleSkgPT4ge1xuICBjb25zdCBub2RlQnlLZXkgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwSGllcmFyY2h5KShrZXlPck5vZGVLZXkpO1xuICByZXR1cm4gaXNOb3RoaW5nKG5vZGVCeUtleSlcbiAgICA/IGdldENvbGxlY3Rpb25Ob2RlKGFwcEhpZXJhcmNoeSwga2V5T3JOb2RlS2V5KVxuICAgIDogbm9kZUJ5S2V5O1xufTtcblxuZXhwb3J0IGNvbnN0IGlzTm9kZSA9IChhcHBIaWVyYXJjaHksIGtleSkgPT4gaXNTb21ldGhpbmcoZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHBIaWVyYXJjaHkpKGtleSkpO1xuXG5leHBvcnQgY29uc3QgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQgPSAocGFyZW50Tm9kZUtleSwgYWN0dWFsQ2hpbGRLZXkpID0+ICQoYWN0dWFsQ2hpbGRLZXksIFtcbiAgc3BsaXRLZXksXG4gIHRha2Uoc3BsaXRLZXkocGFyZW50Tm9kZUtleSkubGVuZ3RoKSxcbiAga3MgPT4gam9pbktleSguLi5rcyksXG5dKTtcblxuZXhwb3J0IGNvbnN0IGdldFBhcmVudEtleSA9IChrZXkpID0+IHtcbiAgcmV0dXJuICQoa2V5LCBbXG4gICAgc3BsaXRLZXksXG4gICAgdGFrZShzcGxpdEtleShrZXkpLmxlbmd0aCAtIDEpLFxuICAgIGpvaW5LZXksXG4gIF0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzS2V5QW5jZXN0b3JPZiA9IGFuY2VzdG9yS2V5ID0+IGRlY2VuZGFudE5vZGUgPT4gaGFzTWF0Y2hpbmdBbmNlc3RvcihwID0+IHAubm9kZUtleSgpID09PSBhbmNlc3RvcktleSkoZGVjZW5kYW50Tm9kZSk7XG5cbmV4cG9ydCBjb25zdCBoYXNOb01hdGNoaW5nQW5jZXN0b3JzID0gcGFyZW50UHJlZGljYXRlID0+IG5vZGUgPT4gIWhhc01hdGNoaW5nQW5jZXN0b3IocGFyZW50UHJlZGljYXRlKShub2RlKTtcblxuZXhwb3J0IGNvbnN0IGZpbmRGaWVsZCA9IChyZWNvcmROb2RlLCBmaWVsZE5hbWUpID0+IGZpbmQoZiA9PiBmLm5hbWUgPT0gZmllbGROYW1lKShyZWNvcmROb2RlLmZpZWxkcyk7XG5cbmV4cG9ydCBjb25zdCBpc0FuY2VzdG9yID0gZGVjZW5kYW50ID0+IGFuY2VzdG9yID0+IGlzS2V5QW5jZXN0b3JPZihhbmNlc3Rvci5ub2RlS2V5KCkpKGRlY2VuZGFudCk7XG5cbmV4cG9ydCBjb25zdCBpc0RlY2VuZGFudCA9IGFuY2VzdG9yID0+IGRlY2VuZGFudCA9PiBpc0FuY2VzdG9yKGRlY2VuZGFudCkoYW5jZXN0b3IpO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkTm9kZUlkID0gcmVjb3JkS2V5ID0+ICQocmVjb3JkS2V5LCBbXG4gIHNwbGl0S2V5LFxuICBsYXN0LFxuICBnZXRSZWNvcmROb2RlSWRGcm9tSWQsXG5dKTtcblxuZXhwb3J0IGNvbnN0IGdldFJlY29yZE5vZGVJZEZyb21JZCA9IHJlY29yZElkID0+ICQocmVjb3JkSWQsIFtzcGxpdCgnLScpLCBmaXJzdCwgcGFyc2VJbnRdKTtcblxuZXhwb3J0IGNvbnN0IGdldFJlY29yZE5vZGVCeUlkID0gKGhpZXJhcmNoeSwgcmVjb3JkSWQpID0+ICQoaGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmluZChuID0+IGlzUmVjb3JkKG4pXG4gICAgICAgICAgICAgICAgICAgICYmIG4ubm9kZUlkID09PSBnZXRSZWNvcmROb2RlSWRGcm9tSWQocmVjb3JkSWQpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgcmVjb3JkTm9kZUlkSXNBbGxvd2VkID0gaW5kZXhOb2RlID0+IG5vZGVJZCA9PiBpbmRleE5vZGUuYWxsb3dlZFJlY29yZE5vZGVJZHMubGVuZ3RoID09PSAwXG4gICAgfHwgaW5jbHVkZXMobm9kZUlkKShpbmRleE5vZGUuYWxsb3dlZFJlY29yZE5vZGVJZHMpO1xuXG5leHBvcnQgY29uc3QgcmVjb3JkTm9kZUlzQWxsb3dlZCA9IGluZGV4Tm9kZSA9PiByZWNvcmROb2RlID0+IHJlY29yZE5vZGVJZElzQWxsb3dlZChpbmRleE5vZGUpKHJlY29yZE5vZGUubm9kZUlkKTtcblxuZXhwb3J0IGNvbnN0IGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4ID0gKGFwcEhpZXJhcmNoeSwgaW5kZXhOb2RlKSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGVzID0gJChhcHBIaWVyYXJjaHksIFtcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gICAgZmlsdGVyKGlzUmVjb3JkKSxcbiAgXSk7XG5cbiAgaWYgKGlzR2xvYmFsSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIHJldHVybiAkKHJlY29yZE5vZGVzLCBbXG4gICAgICBmaWx0ZXIocmVjb3JkTm9kZUlzQWxsb3dlZChpbmRleE5vZGUpKSxcbiAgICBdKTtcbiAgfVxuXG4gIGlmIChpc0FuY2VzdG9ySW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIHJldHVybiAkKHJlY29yZE5vZGVzLCBbXG4gICAgICBmaWx0ZXIoaXNEZWNlbmRhbnQoaW5kZXhOb2RlLnBhcmVudCgpKSksXG4gICAgICBmaWx0ZXIocmVjb3JkTm9kZUlzQWxsb3dlZChpbmRleE5vZGUpKSxcbiAgICBdKTtcbiAgfVxuXG4gIGlmIChpc1JlZmVyZW5jZUluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICByZXR1cm4gJChyZWNvcmROb2RlcywgW1xuICAgICAgZmlsdGVyKG4gPT4gc29tZShmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleChpbmRleE5vZGUpKShuLmZpZWxkcykpLFxuICAgIF0pO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZUZyb21Ob2RlS2V5SGFzaCA9IGhpZXJhcmNoeSA9PiBoYXNoID0+ICQoaGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmluZChuID0+IGdldEhhc2hDb2RlKG4ubm9kZUtleSgpKSA9PT0gaGFzaCksXG5dKTtcblxuZXhwb3J0IGNvbnN0IGlzUmVjb3JkID0gbm9kZSA9PiBpc1NvbWV0aGluZyhub2RlKSAmJiBub2RlLnR5cGUgPT09ICdyZWNvcmQnO1xuZXhwb3J0IGNvbnN0IGlzU2luZ2xlUmVjb3JkID0gbm9kZSA9PiBpc1JlY29yZChub2RlKSAmJiBub2RlLmlzU2luZ2xlO1xuZXhwb3J0IGNvbnN0IGlzQ29sbGVjdGlvblJlY29yZCA9IG5vZGUgPT4gaXNSZWNvcmQobm9kZSkgJiYgIW5vZGUuaXNTaW5nbGU7XG5leHBvcnQgY29uc3QgaXNJbmRleCA9IG5vZGUgPT4gaXNTb21ldGhpbmcobm9kZSkgJiYgbm9kZS50eXBlID09PSAnaW5kZXgnO1xuZXhwb3J0IGNvbnN0IGlzYWdncmVnYXRlR3JvdXAgPSBub2RlID0+IGlzU29tZXRoaW5nKG5vZGUpICYmIG5vZGUudHlwZSA9PT0gJ2FnZ3JlZ2F0ZUdyb3VwJztcbmV4cG9ydCBjb25zdCBpc1NoYXJkZWRJbmRleCA9IG5vZGUgPT4gaXNJbmRleChub2RlKSAmJiBpc05vbkVtcHR5U3RyaW5nKG5vZGUuZ2V0U2hhcmROYW1lKTtcbmV4cG9ydCBjb25zdCBpc1Jvb3QgPSBub2RlID0+IGlzU29tZXRoaW5nKG5vZGUpICYmIG5vZGUuaXNSb290KCk7XG5leHBvcnQgY29uc3QgaXNEZWNlbmRhbnRPZkFSZWNvcmQgPSBoYXNNYXRjaGluZ0FuY2VzdG9yKGlzUmVjb3JkKTtcbmV4cG9ydCBjb25zdCBpc0dsb2JhbEluZGV4ID0gbm9kZSA9PiBpc0luZGV4KG5vZGUpICYmIGlzUm9vdChub2RlLnBhcmVudCgpKTtcbmV4cG9ydCBjb25zdCBpc1JlZmVyZW5jZUluZGV4ID0gbm9kZSA9PiBpc0luZGV4KG5vZGUpICYmIG5vZGUuaW5kZXhUeXBlID09PSBpbmRleFR5cGVzLnJlZmVyZW5jZTtcbmV4cG9ydCBjb25zdCBpc0FuY2VzdG9ySW5kZXggPSBub2RlID0+IGlzSW5kZXgobm9kZSkgJiYgbm9kZS5pbmRleFR5cGUgPT09IGluZGV4VHlwZXMuYW5jZXN0b3I7XG5cbmV4cG9ydCBjb25zdCBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlID0gbm9kZSA9PiBmaWVsZCA9PiBmaWVsZC50eXBlID09PSAncmVmZXJlbmNlJ1xuICAgICYmIGludGVyc2VjdGlvbihmaWVsZC50eXBlT3B0aW9ucy5yZXZlcnNlSW5kZXhOb2RlS2V5cykobWFwKGkgPT4gaS5ub2RlS2V5KCkpKG5vZGUuaW5kZXhlcykpXG4gICAgICAubGVuZ3RoID4gMDtcblxuZXhwb3J0IGNvbnN0IGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4ID0gaW5kZXhOb2RlID0+IGZpZWxkID0+IGZpZWxkLnR5cGUgPT09ICdyZWZlcmVuY2UnXG4gICAgJiYgaW50ZXJzZWN0aW9uKGZpZWxkLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzKShbaW5kZXhOb2RlLm5vZGVLZXkoKV0pXG4gICAgICAubGVuZ3RoID4gMDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXRMYXN0UGFydEluS2V5LFxuICBnZXROb2Rlc0luUGF0aCxcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcbiAgaGFzTWF0Y2hpbmdBbmNlc3RvcixcbiAgZ2V0Tm9kZSxcbiAgZ2V0Tm9kZUJ5S2V5T3JOb2RlS2V5LFxuICBpc05vZGUsXG4gIGdldEFjdHVhbEtleU9mUGFyZW50LFxuICBnZXRQYXJlbnRLZXksXG4gIGlzS2V5QW5jZXN0b3JPZixcbiAgaGFzTm9NYXRjaGluZ0FuY2VzdG9ycyxcbiAgZmluZEZpZWxkLFxuICBpc0FuY2VzdG9yLFxuICBpc0RlY2VuZGFudCxcbiAgZ2V0UmVjb3JkTm9kZUlkLFxuICBnZXRSZWNvcmROb2RlSWRGcm9tSWQsXG4gIGdldFJlY29yZE5vZGVCeUlkLFxuICByZWNvcmROb2RlSWRJc0FsbG93ZWQsXG4gIHJlY29yZE5vZGVJc0FsbG93ZWQsXG4gIGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4LFxuICBnZXROb2RlRnJvbU5vZGVLZXlIYXNoLFxuICBpc1JlY29yZCxcbiAgaXNDb2xsZWN0aW9uUmVjb3JkLFxuICBpc0luZGV4LFxuICBpc2FnZ3JlZ2F0ZUdyb3VwLFxuICBpc1NoYXJkZWRJbmRleCxcbiAgaXNSb290LFxuICBpc0RlY2VuZGFudE9mQVJlY29yZCxcbiAgaXNHbG9iYWxJbmRleCxcbiAgaXNSZWZlcmVuY2VJbmRleCxcbiAgaXNBbmNlc3RvckluZGV4LFxuICBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlLFxuICBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleCxcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxufTtcbiIsImltcG9ydCB7IG1lcmdlIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7XG4gIGNvbnN0YW50LCBpc1VuZGVmaW5lZCwgaGFzLFxuICBtYXBWYWx1ZXMsIGNsb25lRGVlcCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGlzTm90RW1wdHkgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZ2V0U2FmZUZpZWxkUGFyc2VyID0gKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpID0+IChmaWVsZCwgcmVjb3JkKSA9PiB7XG4gIGlmIChoYXMoZmllbGQubmFtZSkocmVjb3JkKSkge1xuICAgIHJldHVybiBnZXRTYWZlVmFsdWVQYXJzZXIodHJ5UGFyc2UsIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucykocmVjb3JkW2ZpZWxkLm5hbWVdKTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZhbHVlRnVuY3Rpb25zW2ZpZWxkLmdldFVuZGVmaW5lZFZhbHVlXSgpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFNhZmVWYWx1ZVBhcnNlciA9ICh0cnlQYXJzZSwgZGVmYXVsdFZhbHVlRnVuY3Rpb25zKSA9PiAodmFsdWUpID0+IHtcbiAgY29uc3QgcGFyc2VkID0gdHJ5UGFyc2UodmFsdWUpO1xuICBpZiAocGFyc2VkLnN1Y2Nlc3MpIHtcbiAgICByZXR1cm4gcGFyc2VkLnZhbHVlO1xuICB9XG4gIHJldHVybiBkZWZhdWx0VmFsdWVGdW5jdGlvbnMuZGVmYXVsdCgpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld1ZhbHVlID0gKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpID0+IChmaWVsZCkgPT4ge1xuICBjb25zdCBnZXRJbml0aWFsVmFsdWUgPSBpc1VuZGVmaW5lZChmaWVsZCkgfHwgaXNVbmRlZmluZWQoZmllbGQuZ2V0SW5pdGlhbFZhbHVlKVxuICAgID8gJ2RlZmF1bHQnXG4gICAgOiBmaWVsZC5nZXRJbml0aWFsVmFsdWU7XG5cbiAgcmV0dXJuIGhhcyhnZXRJbml0aWFsVmFsdWUpKGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucylcbiAgICA/IGRlZmF1bHRWYWx1ZUZ1bmN0aW9uc1tnZXRJbml0aWFsVmFsdWVdKClcbiAgICA6IGdldFNhZmVWYWx1ZVBhcnNlcih0cnlQYXJzZSwgZGVmYXVsdFZhbHVlRnVuY3Rpb25zKShnZXRJbml0aWFsVmFsdWUpO1xufTtcblxuZXhwb3J0IGNvbnN0IHR5cGVGdW5jdGlvbnMgPSBzcGVjaWZpY0Z1bmN0aW9ucyA9PiBtZXJnZSh7XG4gIHZhbHVlOiBjb25zdGFudCxcbiAgbnVsbDogY29uc3RhbnQobnVsbCksXG59LCBzcGVjaWZpY0Z1bmN0aW9ucyk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyA9IHZhbGlkYXRpb25SdWxlcyA9PiBhc3luYyAoZmllbGQsIHJlY29yZCwgY29udGV4dCkgPT4ge1xuICBjb25zdCBmaWVsZFZhbHVlID0gcmVjb3JkW2ZpZWxkLm5hbWVdO1xuICBjb25zdCB2YWxpZGF0ZVJ1bGUgPSBhc3luYyByID0+ICghYXdhaXQgci5pc1ZhbGlkKGZpZWxkVmFsdWUsIGZpZWxkLnR5cGVPcHRpb25zLCBjb250ZXh0KVxuICAgID8gci5nZXRNZXNzYWdlKGZpZWxkVmFsdWUsIGZpZWxkLnR5cGVPcHRpb25zKVxuICAgIDogJycpO1xuXG4gIGNvbnN0IGVycm9ycyA9IFtdO1xuICBmb3IgKGNvbnN0IHIgb2YgdmFsaWRhdGlvblJ1bGVzKSB7XG4gICAgY29uc3QgZXJyID0gYXdhaXQgdmFsaWRhdGVSdWxlKHIpO1xuICAgIGlmIChpc05vdEVtcHR5KGVycikpIGVycm9ycy5wdXNoKGVycik7XG4gIH1cblxuICByZXR1cm4gZXJyb3JzO1xufTtcblxuY29uc3QgZ2V0RGVmYXVsdE9wdGlvbnMgPSBtYXBWYWx1ZXModiA9PiB2LmRlZmF1bHRWYWx1ZSk7XG5cbmV4cG9ydCBjb25zdCBtYWtlcnVsZSA9IChpc1ZhbGlkLCBnZXRNZXNzYWdlKSA9PiAoeyBpc1ZhbGlkLCBnZXRNZXNzYWdlIH0pO1xuZXhwb3J0IGNvbnN0IHBhcnNlZEZhaWxlZCA9IHZhbCA9PiAoeyBzdWNjZXNzOiBmYWxzZSwgdmFsdWU6IHZhbCB9KTtcbmV4cG9ydCBjb25zdCBwYXJzZWRTdWNjZXNzID0gdmFsID0+ICh7IHN1Y2Nlc3M6IHRydWUsIHZhbHVlOiB2YWwgfSk7XG5leHBvcnQgY29uc3QgZ2V0RGVmYXVsdEV4cG9ydCA9IChuYW1lLCB0cnlQYXJzZSwgZnVuY3Rpb25zLCBvcHRpb25zLCB2YWxpZGF0aW9uUnVsZXMsIHNhbXBsZVZhbHVlLCBzdHJpbmdpZnkpID0+ICh7XG4gIGdldE5ldzogZ2V0TmV3VmFsdWUodHJ5UGFyc2UsIGZ1bmN0aW9ucyksXG4gIHNhZmVQYXJzZUZpZWxkOiBnZXRTYWZlRmllbGRQYXJzZXIodHJ5UGFyc2UsIGZ1bmN0aW9ucyksXG4gIHNhZmVQYXJzZVZhbHVlOiBnZXRTYWZlVmFsdWVQYXJzZXIodHJ5UGFyc2UsIGZ1bmN0aW9ucyksXG4gIHRyeVBhcnNlLFxuICBuYW1lLFxuICBnZXREZWZhdWx0T3B0aW9uczogKCkgPT4gZ2V0RGVmYXVsdE9wdGlvbnMoY2xvbmVEZWVwKG9wdGlvbnMpKSxcbiAgb3B0aW9uRGVmaW5pdGlvbnM6IG9wdGlvbnMsXG4gIHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzOiB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyh2YWxpZGF0aW9uUnVsZXMpLFxuICBzYW1wbGVWYWx1ZSxcbiAgc3RyaW5naWZ5OiB2YWwgPT4gKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZFxuICAgID8gJycgOiBzdHJpbmdpZnkodmFsKSksXG4gIGdldERlZmF1bHRWYWx1ZTogZnVuY3Rpb25zLmRlZmF1bHQsXG59KTtcbiIsImltcG9ydCB7XG4gIGNvbnN0YW50LCBpc1N0cmluZyxcbiAgaXNOdWxsLCBpbmNsdWRlcywgaXNCb29sZWFuLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgdHlwZUZ1bmN0aW9ucyxcbiAgbWFrZXJ1bGUsIHBhcnNlZFN1Y2Nlc3MsIGdldERlZmF1bHRFeHBvcnQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIHRvQm9vbE9yTnVsbCwgdG9OdW1iZXJPck51bGwsXG4gIGlzU2FmZUludGVnZXIsIGlzQXJyYXlPZlN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3Qgc3RyaW5nRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XG4gIGRlZmF1bHQ6IGNvbnN0YW50KG51bGwpLFxufSk7XG5cbmNvbnN0IHN0cmluZ1RyeVBhcnNlID0gc3dpdGNoQ2FzZShcbiAgW2lzU3RyaW5nLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXG4gIFtkZWZhdWx0Q2FzZSwgdiA9PiBwYXJzZWRTdWNjZXNzKHYudG9TdHJpbmcoKSldLFxuKTtcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgbWF4TGVuZ3RoOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICAgIGlzVmFsaWQ6IG4gPT4gbiA9PT0gbnVsbCB8fCBpc1NhZmVJbnRlZ2VyKG4pICYmIG4gPiAwLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtYXggbGVuZ3RoIG11c3QgYmUgbnVsbCAobm8gbGltaXQpIG9yIGEgZ3JlYXRlciB0aGFuIHplcm8gaW50ZWdlcicsXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxuICB9LFxuICB2YWx1ZXM6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgaXNWYWxpZDogdiA9PiB2ID09PSBudWxsIHx8IChpc0FycmF5T2ZTdHJpbmcodikgJiYgdi5sZW5ndGggPiAwICYmIHYubGVuZ3RoIDwgMTAwMDApLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246IFwiJ3ZhbHVlcycgbXVzdCBiZSBudWxsIChubyB2YWx1ZXMpIG9yIGFuIGFycnkgb2YgYXQgbGVhc3Qgb25lIHN0cmluZ1wiLFxuICAgIHBhcnNlOiBzID0+IHMsXG4gIH0sXG4gIGFsbG93RGVjbGFyZWRWYWx1ZXNPbmx5OiB7XG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICBpc1ZhbGlkOiBpc0Jvb2xlYW4sXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ2FsbG93RGVjbGFyZWRWYWx1ZXNPbmx5IG11c3QgYmUgdHJ1ZSBvciBmYWxzZScsXG4gICAgcGFyc2U6IHRvQm9vbE9yTnVsbCxcbiAgfSxcbn07XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWF4TGVuZ3RoID09PSBudWxsIHx8IHZhbC5sZW5ndGggPD0gb3B0cy5tYXhMZW5ndGgsXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlIGV4Y2VlZHMgbWF4aW11bSBsZW5ndGggb2YgJHtvcHRzLm1heExlbmd0aH1gKSxcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBvcHRzLmFsbG93RGVjbGFyZWRWYWx1ZXNPbmx5ID09PSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgaW5jbHVkZXModmFsKShvcHRzLnZhbHVlcyksXG4gICh2YWwpID0+IGBcIiR7dmFsfVwiIGRvZXMgbm90IGV4aXN0IGluIHRoZSBsaXN0IG9mIGFsbG93ZWQgdmFsdWVzYCksXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxuICAnc3RyaW5nJyxcbiAgc3RyaW5nVHJ5UGFyc2UsXG4gIHN0cmluZ0Z1bmN0aW9ucyxcbiAgb3B0aW9ucyxcbiAgdHlwZUNvbnN0cmFpbnRzLFxuICAnYWJjZGUnLFxuICBzdHIgPT4gc3RyLFxuKTtcbiIsImltcG9ydCB7IGNvbnN0YW50LCBpc0Jvb2xlYW4sIGlzTnVsbCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICB0eXBlRnVuY3Rpb25zLFxuICBtYWtlcnVsZSwgcGFyc2VkRmFpbGVkLCBwYXJzZWRTdWNjZXNzLFxuICBnZXREZWZhdWx0RXhwb3J0LFxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLCBpc09uZU9mLCB0b0Jvb2xPck51bGwsXG59IGZyb20gJy4uL2NvbW1vbic7XG5cbmNvbnN0IGJvb2xGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogY29uc3RhbnQobnVsbCksXG59KTtcblxuY29uc3QgYm9vbFRyeVBhcnNlID0gc3dpdGNoQ2FzZShcbiAgW2lzQm9vbGVhbiwgcGFyc2VkU3VjY2Vzc10sXG4gIFtpc051bGwsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNPbmVPZigndHJ1ZScsICcxJywgJ3llcycsICdvbicpLCAoKSA9PiBwYXJzZWRTdWNjZXNzKHRydWUpXSxcbiAgW2lzT25lT2YoJ2ZhbHNlJywgJzAnLCAnbm8nLCAnb2ZmJyksICgpID0+IHBhcnNlZFN1Y2Nlc3MoZmFsc2UpXSxcbiAgW2RlZmF1bHRDYXNlLCBwYXJzZWRGYWlsZWRdLFxuKTtcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgYWxsb3dOdWxsczoge1xuICAgIGRlZmF1bHRWYWx1ZTogdHJ1ZSxcbiAgICBpc1ZhbGlkOiBpc0Jvb2xlYW4sXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB0cnVlIG9yIGZhbHNlJyxcbiAgICBwYXJzZTogdG9Cb29sT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiBvcHRzLmFsbG93TnVsbHMgPT09IHRydWUgfHwgdmFsICE9PSBudWxsLFxuICAgICgpID0+ICdmaWVsZCBjYW5ub3QgYmUgbnVsbCcpLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcbiAgJ2Jvb2wnLCBib29sVHJ5UGFyc2UsIGJvb2xGdW5jdGlvbnMsXG4gIG9wdGlvbnMsIHR5cGVDb25zdHJhaW50cywgdHJ1ZSwgSlNPTi5zdHJpbmdpZnksXG4pO1xuIiwiaW1wb3J0IHtcbiAgY29uc3RhbnQsIGlzTnVtYmVyLCBpc1N0cmluZywgaXNOdWxsLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgbWFrZXJ1bGUsIHR5cGVGdW5jdGlvbnMsXG4gIHBhcnNlZEZhaWxlZCwgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9OdW1iZXJPck51bGwsXG4gIGlzU2FmZUludGVnZXIsXG59IGZyb20gJy4uL2NvbW1vbic7XG5cbmNvbnN0IG51bWJlckZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBjb25zdGFudChudWxsKSxcbn0pO1xuXG5jb25zdCBwYXJzZVN0cmluZ3RvTnVtYmVyT3JOdWxsID0gKHMpID0+IHtcbiAgY29uc3QgbnVtID0gTnVtYmVyKHMpO1xuICByZXR1cm4gaXNOYU4obnVtKSA/IHBhcnNlZEZhaWxlZChzKSA6IHBhcnNlZFN1Y2Nlc3MobnVtKTtcbn07XG5cbmNvbnN0IG51bWJlclRyeVBhcnNlID0gc3dpdGNoQ2FzZShcbiAgW2lzTnVtYmVyLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzU3RyaW5nLCBwYXJzZVN0cmluZ3RvTnVtYmVyT3JOdWxsXSxcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbik7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIG1heFZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUixcbiAgICBpc1ZhbGlkOiBpc1NhZmVJbnRlZ2VyLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgdmFsaWQgaW50ZWdlcicsXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxuICB9LFxuICBtaW5WYWx1ZToge1xuICAgIGRlZmF1bHRWYWx1ZTogMCAtIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICAgIGlzVmFsaWQ6IGlzU2FmZUludGVnZXIsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB2YWxpZCBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG4gIGRlY2ltYWxQbGFjZXM6IHtcbiAgICBkZWZhdWx0VmFsdWU6IDAsXG4gICAgaXNWYWxpZDogbiA9PiBpc1NhZmVJbnRlZ2VyKG4pICYmIG4gPj0gMCxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXInLFxuICAgIHBhcnNlOiB0b051bWJlck9yTnVsbCxcbiAgfSxcbn07XG5cbmNvbnN0IGdldERlY2ltYWxQbGFjZXMgPSAodmFsKSA9PiB7XG4gIGNvbnN0IHNwbGl0RGVjaW1hbCA9IHZhbC50b1N0cmluZygpLnNwbGl0KCcuJyk7XG4gIGlmIChzcGxpdERlY2ltYWwubGVuZ3RoID09PSAxKSByZXR1cm4gMDtcbiAgcmV0dXJuIHNwbGl0RGVjaW1hbFsxXS5sZW5ndGg7XG59O1xuXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCBvcHRzLm1pblZhbHVlID09PSBudWxsIHx8IHZhbCA+PSBvcHRzLm1pblZhbHVlLFxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSAoJHt2YWwudG9TdHJpbmcoKX0pIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvICR7b3B0cy5taW5WYWx1ZX1gKSxcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWF4VmFsdWUgPT09IG51bGwgfHwgdmFsIDw9IG9wdHMubWF4VmFsdWUsXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlICgke3ZhbC50b1N0cmluZygpfSkgbXVzdCBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gJHtvcHRzLm1pblZhbHVlfSBvcHRpb25zYCksXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCBvcHRzLmRlY2ltYWxQbGFjZXMgPj0gZ2V0RGVjaW1hbFBsYWNlcyh2YWwpLFxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSAoJHt2YWwudG9TdHJpbmcoKX0pIG11c3QgaGF2ZSAke29wdHMuZGVjaW1hbFBsYWNlc30gZGVjaW1hbCBwbGFjZXMgb3IgbGVzc2ApLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcbiAgJ251bWJlcicsXG4gIG51bWJlclRyeVBhcnNlLFxuICBudW1iZXJGdW5jdGlvbnMsXG4gIG9wdGlvbnMsXG4gIHR5cGVDb25zdHJhaW50cyxcbiAgMSxcbiAgbnVtID0+IG51bS50b1N0cmluZygpLFxuKTtcbiIsImltcG9ydCB7XG4gIGNvbnN0YW50LCBpc0RhdGUsIGlzU3RyaW5nLCBpc051bGxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIG1ha2VydWxlLCB0eXBlRnVuY3Rpb25zLFxuICBwYXJzZWRGYWlsZWQsIHBhcnNlZFN1Y2Nlc3MsIGdldERlZmF1bHRFeHBvcnQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIHRvRGF0ZU9yTnVsbCxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgZGF0ZUZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBjb25zdGFudChudWxsKSxcbiAgbm93OiAoKSA9PiBuZXcgRGF0ZSgpLFxufSk7XG5cbmNvbnN0IGlzVmFsaWREYXRlID0gZCA9PiBkIGluc3RhbmNlb2YgRGF0ZSAmJiAhaXNOYU4oZCk7XG5cbmNvbnN0IHBhcnNlU3RyaW5nVG9EYXRlID0gcyA9PiBzd2l0Y2hDYXNlKFxuICBbaXNWYWxpZERhdGUsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pKG5ldyBEYXRlKHMpKTtcblxuXG5jb25zdCBkYXRlVHJ5UGFyc2UgPSBzd2l0Y2hDYXNlKFxuICBbaXNEYXRlLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzU3RyaW5nLCBwYXJzZVN0cmluZ1RvRGF0ZV0sXG4gIFtpc051bGwsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBtYXhWYWx1ZToge1xuICAgIGRlZmF1bHRWYWx1ZTogbmV3IERhdGUoMzI1MDM2ODAwMDAwMDApLFxuICAgIGlzVmFsaWQ6IGlzRGF0ZSxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHZhbGlkIGRhdGUnLFxuICAgIHBhcnNlOiB0b0RhdGVPck51bGwsXG4gIH0sXG4gIG1pblZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBuZXcgRGF0ZSgtODUyMDMzNjAwMDAwMCksXG4gICAgaXNWYWxpZDogaXNEYXRlLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgdmFsaWQgZGF0ZScsXG4gICAgcGFyc2U6IHRvRGF0ZU9yTnVsbCxcbiAgfSxcbn07XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWluVmFsdWUgPT09IG51bGwgfHwgdmFsID49IG9wdHMubWluVmFsdWUsXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlICgke3ZhbC50b1N0cmluZygpfSkgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtvcHRzLm1pblZhbHVlfWApLFxuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5tYXhWYWx1ZSA9PT0gbnVsbCB8fCB2YWwgPD0gb3B0cy5tYXhWYWx1ZSxcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgKCR7dmFsLnRvU3RyaW5nKCl9KSBtdXN0IGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke29wdHMubWluVmFsdWV9IG9wdGlvbnNgKSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXG4gICdkYXRldGltZScsXG4gIGRhdGVUcnlQYXJzZSxcbiAgZGF0ZUZ1bmN0aW9ucyxcbiAgb3B0aW9ucyxcbiAgdHlwZUNvbnN0cmFpbnRzLFxuICBuZXcgRGF0ZSgxOTg0LCA0LCAxKSxcbiAgZGF0ZSA9PiBKU09OLnN0cmluZ2lmeShkYXRlKS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1wiJywgJ2cnKSwgJycpLFxuKTtcbiIsImltcG9ydCB7IFxuICBtYXAsICBjb25zdGFudCwgaXNBcnJheSBcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIHR5cGVGdW5jdGlvbnMsIG1ha2VydWxlLFxuICBwYXJzZWRGYWlsZWQsIGdldERlZmF1bHRFeHBvcnQsIHBhcnNlZFN1Y2Nlc3MsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIHRvTnVtYmVyT3JOdWxsLFxuICAkJCwgaXNTYWZlSW50ZWdlcixcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgYXJyYXlGdW5jdGlvbnMgPSAoKSA9PiB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogY29uc3RhbnQoW10pLFxufSk7XG5cbmNvbnN0IG1hcFRvUGFyc2VkQXJyYXJ5ID0gdHlwZSA9PiAkJChcbiAgbWFwKGkgPT4gdHlwZS5zYWZlUGFyc2VWYWx1ZShpKSksXG4gIHBhcnNlZFN1Y2Nlc3MsXG4pO1xuXG5jb25zdCBhcnJheVRyeVBhcnNlID0gdHlwZSA9PiBzd2l0Y2hDYXNlKFxuICBbaXNBcnJheSwgbWFwVG9QYXJzZWRBcnJhcnkodHlwZSldLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pO1xuXG5jb25zdCB0eXBlTmFtZSA9IHR5cGUgPT4gYGFycmF5PCR7dHlwZX0+YDtcblxuXG5jb25zdCBvcHRpb25zID0ge1xuICBtYXhMZW5ndGg6IHtcbiAgICBkZWZhdWx0VmFsdWU6IDEwMDAwLFxuICAgIGlzVmFsaWQ6IGlzU2FmZUludGVnZXIsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG4gIG1pbkxlbmd0aDoge1xuICAgIGRlZmF1bHRWYWx1ZTogMCxcbiAgICBpc1ZhbGlkOiBuID0+IGlzU2FmZUludGVnZXIobikgJiYgbiA+PSAwLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlcicsXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgdmFsLmxlbmd0aCA+PSBvcHRzLm1pbkxlbmd0aCxcbiAgICAodmFsLCBvcHRzKSA9PiBgbXVzdCBjaG9vc2UgJHtvcHRzLm1pbkxlbmd0aH0gb3IgbW9yZSBvcHRpb25zYCksXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCB2YWwubGVuZ3RoIDw9IG9wdHMubWF4TGVuZ3RoLFxuICAgICh2YWwsIG9wdHMpID0+IGBjYW5ub3QgY2hvb3NlIG1vcmUgdGhhbiAke29wdHMubWF4TGVuZ3RofSBvcHRpb25zYCksXG5dO1xuXG5leHBvcnQgZGVmYXVsdCB0eXBlID0+IGdldERlZmF1bHRFeHBvcnQoXG4gIHR5cGVOYW1lKHR5cGUubmFtZSksXG4gIGFycmF5VHJ5UGFyc2UodHlwZSksXG4gIGFycmF5RnVuY3Rpb25zKHR5cGUpLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gIFt0eXBlLnNhbXBsZVZhbHVlXSxcbiAgSlNPTi5zdHJpbmdpZnksXG4pO1xuIiwiaW1wb3J0IHtcbiAgaXNTdHJpbmcsIGlzT2JqZWN0TGlrZSxcbiAgaXNOdWxsLCBoYXMsIGlzRW1wdHksXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICB0eXBlRnVuY3Rpb25zLCBtYWtlcnVsZSxcbiAgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcbiAgcGFyc2VkRmFpbGVkLFxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLFxuICBpc05vbkVtcHR5U3RyaW5nLCBpc0FycmF5T2ZTdHJpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5cbmNvbnN0IHJlZmVyZW5jZU5vdGhpbmcgPSAoKSA9PiAoeyBrZXk6ICcnIH0pO1xuXG5jb25zdCByZWZlcmVuY2VGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogcmVmZXJlbmNlTm90aGluZyxcbn0pO1xuXG5jb25zdCBoYXNTdHJpbmdWYWx1ZSA9IChvYiwgcGF0aCkgPT4gaGFzKHBhdGgpKG9iKVxuICAgICYmIGlzU3RyaW5nKG9iW3BhdGhdKTtcblxuY29uc3QgaXNPYmplY3RXaXRoS2V5ID0gdiA9PiBpc09iamVjdExpa2UodilcbiAgICAmJiBoYXNTdHJpbmdWYWx1ZSh2LCAna2V5Jyk7XG5cbmNvbnN0IHRyeVBhcnNlRnJvbVN0cmluZyA9IHMgPT4ge1xuXG4gIHRyeSB7XG4gICAgY29uc3QgYXNPYmogPSBKU09OLnBhcnNlKHMpO1xuICAgIGlmKGlzT2JqZWN0V2l0aEtleSkge1xuICAgICAgcmV0dXJuIHBhcnNlZFN1Y2Nlc3MoYXNPYmopO1xuICAgIH1cbiAgfVxuICBjYXRjaChfKSB7XG4gICAgLy8gRU1QVFlcbiAgfVxuXG4gIHJldHVybiBwYXJzZWRGYWlsZWQocyk7XG59XG5cbmNvbnN0IHJlZmVyZW5jZVRyeVBhcnNlID0gdiA9PiBzd2l0Y2hDYXNlKFxuICBbaXNPYmplY3RXaXRoS2V5LCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzU3RyaW5nLCB0cnlQYXJzZUZyb21TdHJpbmddLFxuICBbaXNOdWxsLCAoKSA9PiBwYXJzZWRTdWNjZXNzKHJlZmVyZW5jZU5vdGhpbmcoKSldLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pKHYpO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBpbmRleE5vZGVLZXk6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgaXNWYWxpZDogaXNOb25FbXB0eVN0cmluZyxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnLFxuICAgIHBhcnNlOiBzID0+IHMsXG4gIH0sXG4gIGRpc3BsYXlWYWx1ZToge1xuICAgIGRlZmF1bHRWYWx1ZTogJycsXG4gICAgaXNWYWxpZDogaXNOb25FbXB0eVN0cmluZyxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnLFxuICAgIHBhcnNlOiBzID0+IHMsXG4gIH0sXG4gIHJldmVyc2VJbmRleE5vZGVLZXlzOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICAgIGlzVmFsaWQ6IHYgPT4gaXNBcnJheU9mU3RyaW5nKHYpICYmIHYubGVuZ3RoID4gMCxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIG5vbi1lbXB0eSBhcnJheSBvZiBzdHJpbmdzJyxcbiAgICBwYXJzZTogcyA9PiBzLFxuICB9LFxufTtcblxuY29uc3QgaXNFbXB0eVN0cmluZyA9IHMgPT4gaXNTdHJpbmcocykgJiYgaXNFbXB0eShzKTtcblxuY29uc3QgZW5zdXJlUmVmZXJlbmNlRXhpc3RzID0gYXN5bmMgKHZhbCwgb3B0cywgY29udGV4dCkgPT4gaXNFbXB0eVN0cmluZyh2YWwua2V5KVxuICAgIHx8IGF3YWl0IGNvbnRleHQucmVmZXJlbmNlRXhpc3RzKG9wdHMsIHZhbC5rZXkpO1xuXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXG4gIG1ha2VydWxlKFxuICAgIGVuc3VyZVJlZmVyZW5jZUV4aXN0cyxcbiAgICAodmFsLCBvcHRzKSA9PiBgXCIke3ZhbFtvcHRzLmRpc3BsYXlWYWx1ZV19XCIgZG9lcyBub3QgZXhpc3QgaW4gb3B0aW9ucyBsaXN0IChrZXk6ICR7dmFsLmtleX0pYCxcbiAgKSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXG4gICdyZWZlcmVuY2UnLFxuICByZWZlcmVuY2VUcnlQYXJzZSxcbiAgcmVmZXJlbmNlRnVuY3Rpb25zLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gIHsga2V5OiAna2V5JywgdmFsdWU6ICd2YWx1ZScgfSxcbiAgSlNPTi5zdHJpbmdpZnksXG4pO1xuIiwiaW1wb3J0IHtcbiAgbGFzdCwgaGFzLCBpc1N0cmluZywgaW50ZXJzZWN0aW9uLFxuICBpc051bGwsIGlzTnVtYmVyLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgdHlwZUZ1bmN0aW9ucywgcGFyc2VkRmFpbGVkLFxuICBwYXJzZWRTdWNjZXNzLCBnZXREZWZhdWx0RXhwb3J0LFxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLCBub25lLFxuICAkLCBzcGxpdEtleSxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgaWxsZWdhbENoYXJhY3RlcnMgPSAnKj9cXFxcLzo8PnxcXDBcXGJcXGZcXHYnO1xuXG5leHBvcnQgY29uc3QgaXNMZWdhbEZpbGVuYW1lID0gKGZpbGVQYXRoKSA9PiB7XG4gIGNvbnN0IGZuID0gZmlsZU5hbWUoZmlsZVBhdGgpO1xuICByZXR1cm4gZm4ubGVuZ3RoIDw9IDI1NVxuICAgICYmIGludGVyc2VjdGlvbihmbi5zcGxpdCgnJykpKGlsbGVnYWxDaGFyYWN0ZXJzLnNwbGl0KCcnKSkubGVuZ3RoID09PSAwXG4gICAgJiYgbm9uZShmID0+IGYgPT09ICcuLicpKHNwbGl0S2V5KGZpbGVQYXRoKSk7XG59O1xuXG5jb25zdCBmaWxlTm90aGluZyA9ICgpID0+ICh7IHJlbGF0aXZlUGF0aDogJycsIHNpemU6IDAgfSk7XG5cbmNvbnN0IGZpbGVGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogZmlsZU5vdGhpbmcsXG59KTtcblxuY29uc3QgZmlsZVRyeVBhcnNlID0gdiA9PiBzd2l0Y2hDYXNlKFxuICBbaXNWYWxpZEZpbGUsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNOdWxsLCAoKSA9PiBwYXJzZWRTdWNjZXNzKGZpbGVOb3RoaW5nKCkpXSxcbiAgW2RlZmF1bHRDYXNlLCBwYXJzZWRGYWlsZWRdLFxuKSh2KTtcblxuY29uc3QgZmlsZU5hbWUgPSBmaWxlUGF0aCA9PiAkKGZpbGVQYXRoLCBbXG4gIHNwbGl0S2V5LFxuICBsYXN0LFxuXSk7XG5cbmNvbnN0IGlzVmFsaWRGaWxlID0gZiA9PiAhaXNOdWxsKGYpXG4gICAgJiYgaGFzKCdyZWxhdGl2ZVBhdGgnKShmKSAmJiBoYXMoJ3NpemUnKShmKVxuICAgICYmIGlzTnVtYmVyKGYuc2l6ZSlcbiAgICAmJiBpc1N0cmluZyhmLnJlbGF0aXZlUGF0aClcbiAgICAmJiBpc0xlZ2FsRmlsZW5hbWUoZi5yZWxhdGl2ZVBhdGgpO1xuXG5jb25zdCBvcHRpb25zID0ge307XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtdO1xuXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxuICAnZmlsZScsXG4gIGZpbGVUcnlQYXJzZSxcbiAgZmlsZUZ1bmN0aW9ucyxcbiAgb3B0aW9ucyxcbiAgdHlwZUNvbnN0cmFpbnRzLFxuICB7IHJlbGF0aXZlUGF0aDogJ3NvbWVfZmlsZS5qcGcnLCBzaXplOiAxMDAwIH0sXG4gIEpTT04uc3RyaW5naWZ5LFxuKTtcbiIsImltcG9ydCB7XG4gIGFzc2lnbiwgbWVyZ2UsIFxufSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgbWFwLCBpc1N0cmluZywgaXNOdW1iZXIsXG4gIGlzQm9vbGVhbiwgaXNEYXRlLCBrZXlzLFxuICBpc09iamVjdCwgaXNBcnJheSwgaGFzXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBhcnNlZFN1Y2Nlc3MgfSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCBzdHJpbmcgZnJvbSAnLi9zdHJpbmcnO1xuaW1wb3J0IGJvb2wgZnJvbSAnLi9ib29sJztcbmltcG9ydCBudW1iZXIgZnJvbSAnLi9udW1iZXInO1xuaW1wb3J0IGRhdGV0aW1lIGZyb20gJy4vZGF0ZXRpbWUnO1xuaW1wb3J0IGFycmF5IGZyb20gJy4vYXJyYXknO1xuaW1wb3J0IHJlZmVyZW5jZSBmcm9tICcuL3JlZmVyZW5jZSc7XG5pbXBvcnQgZmlsZSBmcm9tICcuL2ZpbGUnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmNvbnN0IGFsbFR5cGVzID0gKCkgPT4ge1xuICBjb25zdCBiYXNpY1R5cGVzID0ge1xuICAgIHN0cmluZywgbnVtYmVyLCBkYXRldGltZSwgYm9vbCwgcmVmZXJlbmNlLCBmaWxlLFxuICB9O1xuXG4gIGNvbnN0IGFycmF5cyA9ICQoYmFzaWNUeXBlcywgW1xuICAgIGtleXMsXG4gICAgbWFwKChrKSA9PiB7XG4gICAgICBjb25zdCBrdlR5cGUgPSB7fTtcbiAgICAgIGNvbnN0IGNvbmNyZXRlQXJyYXkgPSBhcnJheShiYXNpY1R5cGVzW2tdKTtcbiAgICAgIGt2VHlwZVtjb25jcmV0ZUFycmF5Lm5hbWVdID0gY29uY3JldGVBcnJheTtcbiAgICAgIHJldHVybiBrdlR5cGU7XG4gICAgfSksXG4gICAgdHlwZXMgPT4gYXNzaWduKHt9LCAuLi50eXBlcyksXG4gIF0pO1xuXG4gIHJldHVybiBtZXJnZSh7fSwgYmFzaWNUeXBlcywgYXJyYXlzKTtcbn07XG5cblxuZXhwb3J0IGNvbnN0IGFsbCA9IGFsbFR5cGVzKCk7XG5cbmV4cG9ydCBjb25zdCBnZXRUeXBlID0gKHR5cGVOYW1lKSA9PiB7XG4gIGlmICghaGFzKHR5cGVOYW1lKShhbGwpKSB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBEbyBub3QgcmVjb2duaXNlIHR5cGUgJHt0eXBlTmFtZX1gKTtcbiAgcmV0dXJuIGFsbFt0eXBlTmFtZV07XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U2FtcGxlRmllbGRWYWx1ZSA9IGZpZWxkID0+IGdldFR5cGUoZmllbGQudHlwZSkuc2FtcGxlVmFsdWU7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdGaWVsZFZhbHVlID0gZmllbGQgPT4gZ2V0VHlwZShmaWVsZC50eXBlKS5nZXROZXcoZmllbGQpO1xuXG5leHBvcnQgY29uc3Qgc2FmZVBhcnNlRmllbGQgPSAoZmllbGQsIHJlY29yZCkgPT4gZ2V0VHlwZShmaWVsZC50eXBlKS5zYWZlUGFyc2VGaWVsZChmaWVsZCwgcmVjb3JkKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlRmllbGRQYXJzZSA9IChmaWVsZCwgcmVjb3JkKSA9PiAoaGFzKGZpZWxkLm5hbWUpKHJlY29yZClcbiAgPyBnZXRUeXBlKGZpZWxkLnR5cGUpLnRyeVBhcnNlKHJlY29yZFtmaWVsZC5uYW1lXSlcbiAgOiBwYXJzZWRTdWNjZXNzKHVuZGVmaW5lZCkpOyAvLyBmaWVsZHMgbWF5IGJlIHVuZGVmaW5lZCBieSBkZWZhdWx0XG5cbmV4cG9ydCBjb25zdCBnZXREZWZhdWx0T3B0aW9ucyA9IHR5cGUgPT4gZ2V0VHlwZSh0eXBlKS5nZXREZWZhdWx0T3B0aW9ucygpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVUeXBlQ29uc3RyYWludHMgPSBhc3luYyAoZmllbGQsIHJlY29yZCwgY29udGV4dCkgPT4gYXdhaXQgZ2V0VHlwZShmaWVsZC50eXBlKS52YWxpZGF0ZVR5cGVDb25zdHJhaW50cyhmaWVsZCwgcmVjb3JkLCBjb250ZXh0KTtcblxuZXhwb3J0IGNvbnN0IGRldGVjdFR5cGUgPSAodmFsdWUpID0+IHtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkgcmV0dXJuIHN0cmluZztcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpIHJldHVybiBib29sO1xuICBpZiAoaXNOdW1iZXIodmFsdWUpKSByZXR1cm4gbnVtYmVyO1xuICBpZiAoaXNEYXRlKHZhbHVlKSkgcmV0dXJuIGRhdGV0aW1lO1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHJldHVybiBhcnJheShkZXRlY3RUeXBlKHZhbHVlWzBdKSk7XG4gIGlmIChpc09iamVjdCh2YWx1ZSlcbiAgICAgICAmJiBoYXMoJ2tleScpKHZhbHVlKVxuICAgICAgICYmIGhhcygndmFsdWUnKSh2YWx1ZSkpIHJldHVybiByZWZlcmVuY2U7XG4gIGlmIChpc09iamVjdCh2YWx1ZSlcbiAgICAgICAgJiYgaGFzKCdyZWxhdGl2ZVBhdGgnKSh2YWx1ZSlcbiAgICAgICAgJiYgaGFzKCdzaXplJykodmFsdWUpKSByZXR1cm4gZmlsZTtcblxuICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBjYW5ub3QgZGV0ZXJtaW5lIHR5cGU6ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWApO1xufTtcbiIsImltcG9ydCB7IGNsb25lLCBmaW5kLCBzcGxpdCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBqb2luS2V5LCAkIH0gZnJvbSAnLi4vY29tbW9uJztcbi8vIDUgbWludXRlc1xuZXhwb3J0IGNvbnN0IHRlbXBDb2RlRXhwaXJ5TGVuZ3RoID0gNSAqIDYwICogMTAwMDtcblxuZXhwb3J0IGNvbnN0IEFVVEhfRk9MREVSID0gJy8uYXV0aCc7XG5leHBvcnQgY29uc3QgVVNFUlNfTElTVF9GSUxFID0gam9pbktleShBVVRIX0ZPTERFUiwgJ3VzZXJzLmpzb24nKTtcbmV4cG9ydCBjb25zdCB1c2VyQXV0aEZpbGUgPSB1c2VybmFtZSA9PiBqb2luS2V5KEFVVEhfRk9MREVSLCBgYXV0aF8ke3VzZXJuYW1lfS5qc29uYCk7XG5leHBvcnQgY29uc3QgVVNFUlNfTE9DS19GSUxFID0gam9pbktleShBVVRIX0ZPTERFUiwgJ3VzZXJzX2xvY2snKTtcbmV4cG9ydCBjb25zdCBBQ0NFU1NfTEVWRUxTX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAnYWNjZXNzX2xldmVscy5qc29uJyk7XG5leHBvcnQgY29uc3QgQUNDRVNTX0xFVkVMU19MT0NLX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAnYWNjZXNzX2xldmVsc19sb2NrJyk7XG5cbmV4cG9ydCBjb25zdCBwZXJtaXNzaW9uVHlwZXMgPSB7XG4gIENSRUFURV9SRUNPUkQ6ICdjcmVhdGUgcmVjb3JkJyxcbiAgVVBEQVRFX1JFQ09SRDogJ3VwZGF0ZSByZWNvcmQnLFxuICBSRUFEX1JFQ09SRDogJ3JlYWQgcmVjb3JkJyxcbiAgREVMRVRFX1JFQ09SRDogJ2RlbGV0ZSByZWNvcmQnLFxuICBSRUFEX0lOREVYOiAncmVhZCBpbmRleCcsXG4gIE1BTkFHRV9JTkRFWDogJ21hbmFnZSBpbmRleCcsXG4gIE1BTkFHRV9DT0xMRUNUSU9OOiAnbWFuYWdlIGNvbGxlY3Rpb24nLFxuICBXUklURV9URU1QTEFURVM6ICd3cml0ZSB0ZW1wbGF0ZXMnLFxuICBDUkVBVEVfVVNFUjogJ2NyZWF0ZSB1c2VyJyxcbiAgU0VUX1BBU1NXT1JEOiAnc2V0IHBhc3N3b3JkJyxcbiAgQ1JFQVRFX1RFTVBPUkFSWV9BQ0NFU1M6ICdjcmVhdGUgdGVtcG9yYXJ5IGFjY2VzcycsXG4gIEVOQUJMRV9ESVNBQkxFX1VTRVI6ICdlbmFibGUgb3IgZGlzYWJsZSB1c2VyJyxcbiAgV1JJVEVfQUNDRVNTX0xFVkVMUzogJ3dyaXRlIGFjY2VzcyBsZXZlbHMnLFxuICBMSVNUX1VTRVJTOiAnbGlzdCB1c2VycycsXG4gIExJU1RfQUNDRVNTX0xFVkVMUzogJ2xpc3QgYWNjZXNzIGxldmVscycsXG4gIEVYRUNVVEVfQUNUSU9OOiAnZXhlY3V0ZSBhY3Rpb24nLFxuICBTRVRfVVNFUl9BQ0NFU1NfTEVWRUxTOiAnc2V0IHVzZXIgYWNjZXNzIGxldmVscycsXG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VXNlckJ5TmFtZSA9ICh1c2VycywgbmFtZSkgPT4gJCh1c2VycywgW1xuICBmaW5kKHUgPT4gdS5uYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUudG9Mb3dlckNhc2UoKSksXG5dKTtcblxuZXhwb3J0IGNvbnN0IHN0cmlwVXNlck9mU2Vuc2l0aXZlU3R1ZmYgPSAodXNlcikgPT4ge1xuICBjb25zdCBzdHJpcHBlZCA9IGNsb25lKHVzZXIpO1xuICBkZWxldGUgc3RyaXBwZWQudGVtcENvZGU7XG4gIHJldHVybiBzdHJpcHBlZDtcbn07XG5cbmV4cG9ydCBjb25zdCBwYXJzZVRlbXBvcmFyeUNvZGUgPSBmdWxsQ29kZSA9PiAkKGZ1bGxDb2RlLCBbXG4gIHNwbGl0KCc6JyksXG4gIHBhcnRzID0+ICh7XG4gICAgaWQ6IHBhcnRzWzFdLFxuICAgIGNvZGU6IHBhcnRzWzJdLFxuICB9KSxcbl0pO1xuIiwiaW1wb3J0IHsgdmFsdWVzLCBpbmNsdWRlcywgc29tZSB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uVHlwZXMgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHtcbiAgJCwgaXNOb3RoaW5nLCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0Tm9kZUJ5S2V5T3JOb2RlS2V5LCBpc05vZGUgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgaXNBdXRob3JpemVkID0gYXBwID0+IChwZXJtaXNzaW9uVHlwZSwgcmVzb3VyY2VLZXkpID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmlzQXV0aG9yaXplZCxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyByZXNvdXJjZUtleSwgcGVybWlzc2lvblR5cGUgfSxcbiAgX2lzQXV0aG9yaXplZCwgYXBwLCBwZXJtaXNzaW9uVHlwZSwgcmVzb3VyY2VLZXksXG4pO1xuXG5leHBvcnQgY29uc3QgX2lzQXV0aG9yaXplZCA9IChhcHAsIHBlcm1pc3Npb25UeXBlLCByZXNvdXJjZUtleSkgPT4ge1xuICBpZiAoIWFwcC51c2VyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgdmFsaWRUeXBlID0gJChwZXJtaXNzaW9uVHlwZXMsIFtcbiAgICB2YWx1ZXMsXG4gICAgaW5jbHVkZXMocGVybWlzc2lvblR5cGUpLFxuICBdKTtcblxuICBpZiAoIXZhbGlkVHlwZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHBlcm1NYXRjaGVzUmVzb3VyY2UgPSAodXNlcnBlcm0pID0+IHtcbiAgICBjb25zdCBub2RlS2V5ID0gaXNOb3RoaW5nKHJlc291cmNlS2V5KVxuICAgICAgPyBudWxsXG4gICAgICA6IGlzTm9kZShhcHAuaGllcmFyY2h5LCByZXNvdXJjZUtleSlcbiAgICAgICAgPyBnZXROb2RlQnlLZXlPck5vZGVLZXkoXG4gICAgICAgICAgYXBwLmhpZXJhcmNoeSwgcmVzb3VyY2VLZXksXG4gICAgICAgICkubm9kZUtleSgpXG4gICAgICAgIDogcmVzb3VyY2VLZXk7XG5cbiAgICByZXR1cm4gKHVzZXJwZXJtLnR5cGUgPT09IHBlcm1pc3Npb25UeXBlKVxuICAgICAgICAmJiAoXG4gICAgICAgICAgaXNOb3RoaW5nKHJlc291cmNlS2V5KVxuICAgICAgICAgICAgfHwgbm9kZUtleSA9PT0gdXNlcnBlcm0ubm9kZUtleVxuICAgICAgICApO1xuICB9O1xuXG4gIHJldHVybiAkKGFwcC51c2VyLnBlcm1pc3Npb25zLCBbXG4gICAgc29tZShwZXJtTWF0Y2hlc1Jlc291cmNlKSxcbiAgXSk7XG59O1xuIiwiaW1wb3J0IHsgcGVybWlzc2lvblR5cGVzIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7IGlzQXV0aG9yaXplZCB9IGZyb20gJy4vaXNBdXRob3JpemVkJztcblxuZXhwb3J0IGNvbnN0IHRlbXBvcmFyeUFjY2Vzc1Blcm1pc3Npb25zID0gKCkgPT4gKFt7IHR5cGU6IHBlcm1pc3Npb25UeXBlcy5TRVRfUEFTU1dPUkQgfV0pO1xuXG5jb25zdCBub2RlUGVybWlzc2lvbiA9IHR5cGUgPT4gKHtcbiAgYWRkOiAobm9kZUtleSwgYWNjZXNzTGV2ZWwpID0+IGFjY2Vzc0xldmVsLnBlcm1pc3Npb25zLnB1c2goeyB0eXBlLCBub2RlS2V5IH0pLFxuICBpc0F1dGhvcml6ZWQ6IHJlc291cmNlS2V5ID0+IGFwcCA9PiBpc0F1dGhvcml6ZWQoYXBwKSh0eXBlLCByZXNvdXJjZUtleSksXG4gIGlzTm9kZTogdHJ1ZSxcbiAgZ2V0OiBub2RlS2V5ID0+ICh7IHR5cGUsIG5vZGVLZXkgfSksXG59KTtcblxuY29uc3Qgc3RhdGljUGVybWlzc2lvbiA9IHR5cGUgPT4gKHtcbiAgYWRkOiBhY2Nlc3NMZXZlbCA9PiBhY2Nlc3NMZXZlbC5wZXJtaXNzaW9ucy5wdXNoKHsgdHlwZSB9KSxcbiAgaXNBdXRob3JpemVkOiBhcHAgPT4gaXNBdXRob3JpemVkKGFwcCkodHlwZSksXG4gIGlzTm9kZTogZmFsc2UsXG4gIGdldDogKCkgPT4gKHsgdHlwZSB9KSxcbn0pO1xuXG5jb25zdCBjcmVhdGVSZWNvcmQgPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuQ1JFQVRFX1JFQ09SRCk7XG5cbmNvbnN0IHVwZGF0ZVJlY29yZCA9IG5vZGVQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5VUERBVEVfUkVDT1JEKTtcblxuY29uc3QgZGVsZXRlUmVjb3JkID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkRFTEVURV9SRUNPUkQpO1xuXG5jb25zdCByZWFkUmVjb3JkID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlJFQURfUkVDT1JEKTtcblxuY29uc3Qgd3JpdGVUZW1wbGF0ZXMgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5XUklURV9URU1QTEFURVMpO1xuXG5jb25zdCBjcmVhdGVVc2VyID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuQ1JFQVRFX1VTRVIpO1xuXG5jb25zdCBzZXRQYXNzd29yZCA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlNFVF9QQVNTV09SRCk7XG5cbmNvbnN0IHJlYWRJbmRleCA9IG5vZGVQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5SRUFEX0lOREVYKTtcblxuY29uc3QgbWFuYWdlSW5kZXggPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5NQU5BR0VfSU5ERVgpO1xuXG5jb25zdCBtYW5hZ2VDb2xsZWN0aW9uID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuTUFOQUdFX0NPTExFQ1RJT04pO1xuXG5jb25zdCBjcmVhdGVUZW1wb3JhcnlBY2Nlc3MgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfVEVNUE9SQVJZX0FDQ0VTUyk7XG5cbmNvbnN0IGVuYWJsZURpc2FibGVVc2VyID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuRU5BQkxFX0RJU0FCTEVfVVNFUik7XG5cbmNvbnN0IHdyaXRlQWNjZXNzTGV2ZWxzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuV1JJVEVfQUNDRVNTX0xFVkVMUyk7XG5cbmNvbnN0IGxpc3RVc2VycyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkxJU1RfVVNFUlMpO1xuXG5jb25zdCBsaXN0QWNjZXNzTGV2ZWxzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuTElTVF9BQ0NFU1NfTEVWRUxTKTtcblxuY29uc3Qgc2V0VXNlckFjY2Vzc0xldmVscyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlNFVF9VU0VSX0FDQ0VTU19MRVZFTFMpO1xuXG5jb25zdCBleGVjdXRlQWN0aW9uID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkVYRUNVVEVfQUNUSU9OKTtcblxuZXhwb3J0IGNvbnN0IGFsd2F5c0F1dGhvcml6ZWQgPSAoKSA9PiB0cnVlO1xuXG5leHBvcnQgY29uc3QgcGVybWlzc2lvbiA9IHtcbiAgY3JlYXRlUmVjb3JkLFxuICB1cGRhdGVSZWNvcmQsXG4gIGRlbGV0ZVJlY29yZCxcbiAgcmVhZFJlY29yZCxcbiAgd3JpdGVUZW1wbGF0ZXMsXG4gIGNyZWF0ZVVzZXIsXG4gIHNldFBhc3N3b3JkLFxuICByZWFkSW5kZXgsXG4gIGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyxcbiAgZW5hYmxlRGlzYWJsZVVzZXIsXG4gIHdyaXRlQWNjZXNzTGV2ZWxzLFxuICBsaXN0VXNlcnMsXG4gIGxpc3RBY2Nlc3NMZXZlbHMsXG4gIG1hbmFnZUluZGV4LFxuICBtYW5hZ2VDb2xsZWN0aW9uLFxuICBleGVjdXRlQWN0aW9uLFxuICBzZXRVc2VyQWNjZXNzTGV2ZWxzLFxufTtcbiIsImltcG9ydCB7XG4gIGtleUJ5LCBtYXBWYWx1ZXMsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHsgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IGdldE5ld0ZpZWxkVmFsdWUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge1xuICAkLCBqb2luS2V5LCBzYWZlS2V5LCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3ID0gYXBwID0+IChjb2xsZWN0aW9uS2V5LCByZWNvcmRUeXBlTmFtZSkgPT4ge1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0UmVjb3JkTm9kZShhcHAsIGNvbGxlY3Rpb25LZXksIHJlY29yZFR5cGVOYW1lKTtcbiAgcmV0dXJuIGFwaVdyYXBwZXJTeW5jKFxuICAgIGFwcCxcbiAgICBldmVudHMucmVjb3JkQXBpLmdldE5ldyxcbiAgICBwZXJtaXNzaW9uLmNyZWF0ZVJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkTm9kZS5ub2RlS2V5KCkpLFxuICAgIHsgY29sbGVjdGlvbktleSwgcmVjb3JkVHlwZU5hbWUgfSxcbiAgICBfZ2V0TmV3LCByZWNvcmROb2RlLCBjb2xsZWN0aW9uS2V5LFxuICApO1xufTtcblxuY29uc3QgX2dldE5ldyA9IChyZWNvcmROb2RlLCBjb2xsZWN0aW9uS2V5KSA9PiBjb25zdHJ1Y3RSZWNvcmQocmVjb3JkTm9kZSwgZ2V0TmV3RmllbGRWYWx1ZSwgY29sbGVjdGlvbktleSk7XG5cbmNvbnN0IGdldFJlY29yZE5vZGUgPSAoYXBwLCBjb2xsZWN0aW9uS2V5KSA9PiB7XG4gIGNvbGxlY3Rpb25LZXkgPSBzYWZlS2V5KGNvbGxlY3Rpb25LZXkpO1xuICByZXR1cm4gZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoKGFwcC5oaWVyYXJjaHkpKGNvbGxlY3Rpb25LZXkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0NoaWxkID0gYXBwID0+IChyZWNvcmRLZXksIGNvbGxlY3Rpb25OYW1lLCByZWNvcmRUeXBlTmFtZSkgPT4gXG4gIGdldE5ldyhhcHApKGpvaW5LZXkocmVjb3JkS2V5LCBjb2xsZWN0aW9uTmFtZSksIHJlY29yZFR5cGVOYW1lKTtcblxuZXhwb3J0IGNvbnN0IGNvbnN0cnVjdFJlY29yZCA9IChyZWNvcmROb2RlLCBnZXRGaWVsZFZhbHVlLCBjb2xsZWN0aW9uS2V5KSA9PiB7XG4gIGNvbnN0IHJlY29yZCA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBrZXlCeSgnbmFtZScpLFxuICAgIG1hcFZhbHVlcyhnZXRGaWVsZFZhbHVlKSxcbiAgXSk7XG5cbiAgcmVjb3JkLmlkID0gYCR7cmVjb3JkTm9kZS5ub2RlSWR9LSR7Z2VuZXJhdGUoKX1gO1xuICByZWNvcmQua2V5ID0gam9pbktleShjb2xsZWN0aW9uS2V5LCByZWNvcmQuaWQpO1xuICByZWNvcmQuaXNOZXcgPSB0cnVlO1xuICByZWNvcmQudHlwZSA9IHJlY29yZE5vZGUubmFtZTtcbiAgcmV0dXJuIHJlY29yZDtcbn07XG4iLCJpbXBvcnQge1xuICBrZXlCeSwgbWFwVmFsdWVzLCBmaWx0ZXIsIFxuICBtYXAsIGluY2x1ZGVzLCBsYXN0LFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2V0RXhhY3ROb2RlRm9yUGF0aCwgZ2V0Tm9kZSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBzYWZlUGFyc2VGaWVsZCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7XG4gICQsIHNwbGl0S2V5LCBzYWZlS2V5LCBpc05vbkVtcHR5U3RyaW5nLFxuICBhcGlXcmFwcGVyLCBldmVudHMsIGpvaW5LZXksXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBtYXBSZWNvcmQgfSBmcm9tICcuLi9pbmRleGluZy9ldmFsdWF0ZSc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBnZXRSZWNvcmRGaWxlTmFtZSA9IGtleSA9PiBqb2luS2V5KGtleSwgJ3JlY29yZC5qc29uJyk7XG5cbmV4cG9ydCBjb25zdCBsb2FkID0gYXBwID0+IGFzeW5jIGtleSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5yZWNvcmRBcGkubG9hZCxcbiAgcGVybWlzc2lvbi5yZWFkUmVjb3JkLmlzQXV0aG9yaXplZChrZXkpLFxuICB7IGtleSB9LFxuICBfbG9hZCwgYXBwLCBrZXksXG4pO1xuXG5leHBvcnQgY29uc3QgX2xvYWQgPSBhc3luYyAoYXBwLCBrZXksIGtleVN0YWNrID0gW10pID0+IHtcbiAga2V5ID0gc2FmZUtleShrZXkpO1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShrZXkpO1xuICBjb25zdCBzdG9yZWREYXRhID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICBnZXRSZWNvcmRGaWxlTmFtZShrZXkpLFxuICApO1xuXG4gIGNvbnN0IGxvYWRlZFJlY29yZCA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBrZXlCeSgnbmFtZScpLFxuICAgIG1hcFZhbHVlcyhmID0+IHNhZmVQYXJzZUZpZWxkKGYsIHN0b3JlZERhdGEpKSxcbiAgXSk7XG5cbiAgY29uc3QgbmV3S2V5U3RhY2sgPSBbLi4ua2V5U3RhY2ssIGtleV07XG5cbiAgY29uc3QgcmVmZXJlbmNlcyA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBmaWx0ZXIoZiA9PiBmLnR5cGUgPT09ICdyZWZlcmVuY2UnXG4gICAgICAgICAgICAgICAgICAgICYmIGlzTm9uRW1wdHlTdHJpbmcobG9hZGVkUmVjb3JkW2YubmFtZV0ua2V5KVxuICAgICAgICAgICAgICAgICAgICAmJiAhaW5jbHVkZXMobG9hZGVkUmVjb3JkW2YubmFtZV0ua2V5KShuZXdLZXlTdGFjaykpLFxuICAgIG1hcChmID0+ICh7XG4gICAgICBwcm9taXNlOiBfbG9hZChhcHAsIGxvYWRlZFJlY29yZFtmLm5hbWVdLmtleSwgbmV3S2V5U3RhY2spLFxuICAgICAgaW5kZXg6IGdldE5vZGUoYXBwLmhpZXJhcmNoeSwgZi50eXBlT3B0aW9ucy5pbmRleE5vZGVLZXkpLFxuICAgICAgZmllbGQ6IGYsXG4gICAgfSkpLFxuICBdKTtcblxuICBpZiAocmVmZXJlbmNlcy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgcmVmUmVjb3JkcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgbWFwKHAgPT4gcC5wcm9taXNlKShyZWZlcmVuY2VzKSxcbiAgICApO1xuXG4gICAgZm9yIChjb25zdCByZWYgb2YgcmVmZXJlbmNlcykge1xuICAgICAgbG9hZGVkUmVjb3JkW3JlZi5maWVsZC5uYW1lXSA9IG1hcFJlY29yZChcbiAgICAgICAgcmVmUmVjb3Jkc1tyZWZlcmVuY2VzLmluZGV4T2YocmVmKV0sXG4gICAgICAgIHJlZi5pbmRleCxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgbG9hZGVkUmVjb3JkLnRyYW5zYWN0aW9uSWQgPSBzdG9yZWREYXRhLnRyYW5zYWN0aW9uSWQ7XG4gIGxvYWRlZFJlY29yZC5pc05ldyA9IGZhbHNlO1xuICBsb2FkZWRSZWNvcmQua2V5ID0ga2V5O1xuICBsb2FkZWRSZWNvcmQuaWQgPSAkKGtleSwgW3NwbGl0S2V5LCBsYXN0XSk7XG4gIGxvYWRlZFJlY29yZC50eXBlID0gcmVjb3JkTm9kZS5uYW1lO1xuICByZXR1cm4gbG9hZGVkUmVjb3JkO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgbG9hZDtcbiIsIi8vIGFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZGV4NGVyL2pzLXByb21pc2UtcmVhZGFibGVcbi8vIHRoYW5rcyA6KVxuICBcbmV4cG9ydCBjb25zdCBwcm9taXNlUmVhZGFibGVTdHJlYW0gPSBzdHJlYW0gPT4ge1xuICAgXG4gICAgbGV0IF9lcnJvcmVkO1xuXG4gICAgY29uc3QgX2Vycm9ySGFuZGxlciA9IGVyciA9PiB7XG4gICAgICAgIF9lcnJvcmVkID0gZXJyO1xuICAgIH07XG5cbiAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBfZXJyb3JIYW5kbGVyKTtcbiAgXG4gICAgY29uc3QgcmVhZCA9IChzaXplKSA9PiB7XG4gIFxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKF9lcnJvcmVkKSB7XG4gICAgICAgICAgY29uc3QgZXJyID0gX2Vycm9yZWQ7XG4gICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICAgIH1cbiAgXG4gICAgICAgIGlmICghc3RyZWFtLnJlYWRhYmxlIHx8IHN0cmVhbS5jbG9zZWQgfHwgc3RyZWFtLmRlc3Ryb3llZCkge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IHJlYWRhYmxlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICBjb25zdCBjaHVuayA9IHN0cmVhbS5yZWFkKHNpemUpO1xuICBcbiAgICAgICAgICBpZiAoY2h1bmspIHtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVzb2x2ZShjaHVuayk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCBjbG9zZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCBlbmRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgZXJyb3JIYW5kbGVyID0gKGVycikgPT4ge1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCByZW1vdmVMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiY2xvc2VcIiwgY2xvc2VIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVuZFwiLCBlbmRIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJyZWFkYWJsZVwiLCByZWFkYWJsZUhhbmRsZXIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBzdHJlYW0ub24oXCJjbG9zZVwiLCBjbG9zZUhhbmRsZXIpO1xuICAgICAgICBzdHJlYW0ub24oXCJlbmRcIiwgZW5kSGFuZGxlcik7XG4gICAgICAgIHN0cmVhbS5vbihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gICAgICAgIHN0cmVhbS5vbihcInJlYWRhYmxlXCIsIHJlYWRhYmxlSGFuZGxlcik7XG4gIFxuICAgICAgICByZWFkYWJsZUhhbmRsZXIoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgXG4gIFxuICAgIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XG4gICAgICBpZiAoc3RyZWFtKSB7XG4gICAgICAgIGlmIChfZXJyb3JIYW5kbGVyKSB7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgX2Vycm9ySGFuZGxlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBzdHJlYW0uZGVzdHJveSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgc3RyZWFtLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIFxuICAgIHJldHVybiB7cmVhZCwgZGVzdHJveSwgc3RyZWFtfTtcbiAgfVxuICBcbiAgZXhwb3J0IGRlZmF1bHQgcHJvbWlzZVJlYWRhYmxlU3RyZWFtXG4gICIsImltcG9ydCB7IGNvbXBpbGVDb2RlIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xuaW1wb3J0IHtcbiAgZmlsdGVyLCBpbmNsdWRlcywgbWFwLCBsYXN0LFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQsIGlzR2xvYmFsSW5kZXgsXG4gIGdldFBhcmVudEtleSwgaXNTaGFyZGVkSW5kZXgsXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xuICBqb2luS2V5LCBpc05vbkVtcHR5U3RyaW5nLCBzcGxpdEtleSwgJCxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4ZWREYXRhS2V5ID0gKGluZGV4Tm9kZSwgaW5kZXhLZXksIHJlY29yZCkgPT4ge1xuICBjb25zdCBnZXRTaGFyZE5hbWUgPSAoaW5kZXhOb2RlLCByZWNvcmQpID0+IHtcbiAgICBjb25zdCBzaGFyZE5hbWVGdW5jID0gY29tcGlsZUNvZGUoaW5kZXhOb2RlLmdldFNoYXJkTmFtZSk7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBzaGFyZE5hbWVGdW5jKHsgcmVjb3JkIH0pO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgY29uc3QgZXJyb3JEZXRhaWxzID0gYHNoYXJkQ29kZTogJHtpbmRleE5vZGUuZ2V0U2hhcmROYW1lfSA6OiByZWNvcmQ6ICR7SlNPTi5zdHJpbmdpZnkocmVjb3JkKX0gOjogYFxuICAgICAgZS5tZXNzYWdlID0gXCJFcnJvciBydW5uaW5nIGluZGV4IHNoYXJkbmFtZSBmdW5jOiBcIiArIGVycm9yRGV0YWlscyArIGUubWVzc2FnZTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHNoYXJkTmFtZSA9IGlzTm9uRW1wdHlTdHJpbmcoaW5kZXhOb2RlLmdldFNoYXJkTmFtZSlcbiAgICA/IGAke2dldFNoYXJkTmFtZShpbmRleE5vZGUsIHJlY29yZCl9LmNzdmBcbiAgICA6ICdpbmRleC5jc3YnO1xuXG4gIHJldHVybiBqb2luS2V5KGluZGV4S2V5LCBzaGFyZE5hbWUpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFNoYXJkS2V5c0luUmFuZ2UgPSBhc3luYyAoYXBwLCBpbmRleEtleSwgc3RhcnRSZWNvcmQgPSBudWxsLCBlbmRSZWNvcmQgPSBudWxsKSA9PiB7XG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoaW5kZXhLZXkpO1xuXG4gIGNvbnN0IHN0YXJ0U2hhcmROYW1lID0gIXN0YXJ0UmVjb3JkXG4gICAgPyBudWxsXG4gICAgOiBzaGFyZE5hbWVGcm9tS2V5KFxuICAgICAgZ2V0SW5kZXhlZERhdGFLZXkoXG4gICAgICAgIGluZGV4Tm9kZSxcbiAgICAgICAgaW5kZXhLZXksXG4gICAgICAgIHN0YXJ0UmVjb3JkLFxuICAgICAgKSxcbiAgICApO1xuXG4gIGNvbnN0IGVuZFNoYXJkTmFtZSA9ICFlbmRSZWNvcmRcbiAgICA/IG51bGxcbiAgICA6IHNoYXJkTmFtZUZyb21LZXkoXG4gICAgICBnZXRJbmRleGVkRGF0YUtleShcbiAgICAgICAgaW5kZXhOb2RlLFxuICAgICAgICBpbmRleEtleSxcbiAgICAgICAgZW5kUmVjb3JkLFxuICAgICAgKSxcbiAgICApO1xuXG4gIHJldHVybiAkKGF3YWl0IGdldFNoYXJkTWFwKGFwcC5kYXRhc3RvcmUsIGluZGV4S2V5KSwgW1xuICAgIGZpbHRlcihrID0+IChzdGFydFJlY29yZCA9PT0gbnVsbCB8fCBrID49IHN0YXJ0U2hhcmROYW1lKVxuICAgICAgICAgICAgICAgICAgICAmJiAoZW5kUmVjb3JkID09PSBudWxsIHx8IGsgPD0gZW5kU2hhcmROYW1lKSksXG4gICAgbWFwKGsgPT4gam9pbktleShpbmRleEtleSwgYCR7a30uY3N2YCkpLFxuICBdKTtcbn07XG5cbmV4cG9ydCBjb25zdCBlbnN1cmVTaGFyZE5hbWVJc0luU2hhcmRNYXAgPSBhc3luYyAoc3RvcmUsIGluZGV4S2V5LCBpbmRleGVkRGF0YUtleSkgPT4ge1xuICBjb25zdCBtYXAgPSBhd2FpdCBnZXRTaGFyZE1hcChzdG9yZSwgaW5kZXhLZXkpO1xuICBjb25zdCBzaGFyZE5hbWUgPSBzaGFyZE5hbWVGcm9tS2V5KGluZGV4ZWREYXRhS2V5KTtcbiAgaWYgKCFpbmNsdWRlcyhzaGFyZE5hbWUpKG1hcCkpIHtcbiAgICBtYXAucHVzaChzaGFyZE5hbWUpO1xuICAgIGF3YWl0IHdyaXRlU2hhcmRNYXAoc3RvcmUsIGluZGV4S2V5LCBtYXApO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U2hhcmRNYXAgPSBhc3luYyAoZGF0YXN0b3JlLCBpbmRleEtleSkgPT4ge1xuICBjb25zdCBzaGFyZE1hcEtleSA9IGdldFNoYXJkTWFwS2V5KGluZGV4S2V5KTtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgZGF0YXN0b3JlLmxvYWRKc29uKHNoYXJkTWFwS2V5KTtcbiAgfSBjYXRjaCAoXykge1xuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKHNoYXJkTWFwS2V5LCBbXSk7XG4gICAgcmV0dXJuIFtdO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3Qgd3JpdGVTaGFyZE1hcCA9IGFzeW5jIChkYXRhc3RvcmUsIGluZGV4S2V5LCBzaGFyZE1hcCkgPT4gYXdhaXQgZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gIGdldFNoYXJkTWFwS2V5KGluZGV4S2V5KSxcbiAgc2hhcmRNYXAsXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsU2hhcmRLZXlzID0gYXN5bmMgKGFwcCwgaW5kZXhLZXkpID0+IGF3YWl0IGdldFNoYXJkS2V5c0luUmFuZ2UoYXBwLCBpbmRleEtleSk7XG5cbmV4cG9ydCBjb25zdCBnZXRTaGFyZE1hcEtleSA9IGluZGV4S2V5ID0+IGpvaW5LZXkoaW5kZXhLZXksICdzaGFyZE1hcC5qc29uJyk7XG5cbmV4cG9ydCBjb25zdCBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXkgPSBpbmRleEtleSA9PiBqb2luS2V5KGluZGV4S2V5LCAnaW5kZXguY3N2Jyk7XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleEZvbGRlcktleSA9IGluZGV4S2V5ID0+IGluZGV4S2V5O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlSW5kZXhGaWxlID0gYXN5bmMgKGRhdGFzdG9yZSwgaW5kZXhlZERhdGFLZXksIGluZGV4KSA9PiB7XG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleCkpIHtcbiAgICBjb25zdCBpbmRleEtleSA9IGdldFBhcmVudEtleShpbmRleGVkRGF0YUtleSk7XG4gICAgY29uc3Qgc2hhcmRNYXAgPSBhd2FpdCBnZXRTaGFyZE1hcChkYXRhc3RvcmUsIGluZGV4S2V5KTtcbiAgICBzaGFyZE1hcC5wdXNoKFxuICAgICAgc2hhcmROYW1lRnJvbUtleShpbmRleGVkRGF0YUtleSksXG4gICAgKTtcbiAgICBhd2FpdCB3cml0ZVNoYXJkTWFwKGRhdGFzdG9yZSwgaW5kZXhLZXksIHNoYXJkTWFwKTtcbiAgfVxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRmlsZShpbmRleGVkRGF0YUtleSwgJycpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNoYXJkTmFtZUZyb21LZXkgPSBrZXkgPT4gJChrZXksIFtcbiAgc3BsaXRLZXksXG4gIGxhc3QsXG5dKS5yZXBsYWNlKCcuY3N2JywgJycpO1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhLZXlfQmFzZWRPbkRlY2VuZGFudCA9IChkZWNlbmRhbnRLZXksIGluZGV4Tm9kZSkgPT4ge1xuICBpZiAoaXNHbG9iYWxJbmRleChpbmRleE5vZGUpKSB7IHJldHVybiBgJHtpbmRleE5vZGUubm9kZUtleSgpfWA7IH1cblxuICBjb25zdCBpbmRleGVkRGF0YVBhcmVudEtleSA9IGdldEFjdHVhbEtleU9mUGFyZW50KFxuICAgIGluZGV4Tm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksXG4gICAgZGVjZW5kYW50S2V5LFxuICApO1xuXG4gIHJldHVybiBqb2luS2V5KFxuICAgIGluZGV4ZWREYXRhUGFyZW50S2V5LFxuICAgIGluZGV4Tm9kZS5uYW1lLFxuICApO1xufTtcbiIsImltcG9ydCB7XG4gIGhhcywga2V5cywgbWFwLCBvcmRlckJ5LFxuICBmaWx0ZXIsIGNvbmNhdCwgcmV2ZXJzZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IG1hcFJlY29yZCB9IGZyb20gJy4vZXZhbHVhdGUnO1xuaW1wb3J0IHsgY29uc3RydWN0UmVjb3JkIH0gZnJvbSAnLi4vcmVjb3JkQXBpL2dldE5ldyc7XG5pbXBvcnQgeyBnZXRTYW1wbGVGaWVsZFZhbHVlLCBkZXRlY3RUeXBlLCBhbGwgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlU2NoZW1hID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlKSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGVzID0gZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgoaGllcmFyY2h5LCBpbmRleE5vZGUpO1xuICBjb25zdCBtYXBwZWRSZWNvcmRzID0gJChyZWNvcmROb2RlcywgW1xuICAgIG1hcChuID0+IG1hcFJlY29yZChjcmVhdGVTYW1wbGVSZWNvcmQobiksIGluZGV4Tm9kZSkpLFxuICBdKTtcblxuICAvLyBhbHdheXMgaGFzIHJlY29yZCBrZXkgYW5kIHNvcnQga2V5XG4gIGNvbnN0IHNjaGVtYSA9IHtcbiAgICBzb3J0S2V5OiBhbGwuc3RyaW5nLFxuICAgIGtleTogYWxsLnN0cmluZyxcbiAgfTtcblxuICBjb25zdCBmaWVsZHNIYXMgPSBoYXMoc2NoZW1hKTtcbiAgY29uc3Qgc2V0RmllbGQgPSAoZmllbGROYW1lLCB2YWx1ZSkgPT4ge1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgdGhpc1R5cGUgPSBkZXRlY3RUeXBlKHZhbHVlKTtcbiAgICBpZiAoZmllbGRzSGFzKGZpZWxkTmFtZSkpIHtcbiAgICAgIGlmIChzY2hlbWFbZmllbGROYW1lXSAhPT0gdGhpc1R5cGUpIHtcbiAgICAgICAgc2NoZW1hW2ZpZWxkTmFtZV0gPSBhbGwuc3RyaW5nO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzY2hlbWFbZmllbGROYW1lXSA9IHRoaXNUeXBlO1xuICAgIH1cbiAgfTtcblxuICBmb3IgKGNvbnN0IG1hcHBlZFJlYyBvZiBtYXBwZWRSZWNvcmRzKSB7XG4gICAgZm9yIChjb25zdCBmIGluIG1hcHBlZFJlYykge1xuICAgICAgc2V0RmllbGQoZiwgbWFwcGVkUmVjW2ZdKTtcbiAgICB9XG4gIH1cblxuICAvLyByZXR1cmluZyBhbiBhcnJheSBvZiB7bmFtZSwgdHlwZX1cbiAgcmV0dXJuICQoc2NoZW1hLCBbXG4gICAga2V5cyxcbiAgICBtYXAoayA9PiAoeyBuYW1lOiBrLCB0eXBlOiBzY2hlbWFba10ubmFtZSB9KSksXG4gICAgZmlsdGVyKHMgPT4gcy5uYW1lICE9PSAnc29ydEtleScpLFxuICAgIG9yZGVyQnkoJ25hbWUnLCBbJ2Rlc2MnXSksIC8vIHJldmVyc2UgYXBsaGFcbiAgICBjb25jYXQoW3sgbmFtZTogJ3NvcnRLZXknLCB0eXBlOiBhbGwuc3RyaW5nLm5hbWUgfV0pLCAvLyBzb3J0S2V5IG9uIGVuZFxuICAgIHJldmVyc2UsIC8vIHNvcnRLZXkgZmlyc3QsIHRoZW4gcmVzdCBhcmUgYWxwaGFiZXRpY2FsXG4gIF0pO1xufTtcblxuY29uc3QgY3JlYXRlU2FtcGxlUmVjb3JkID0gcmVjb3JkTm9kZSA9PiBjb25zdHJ1Y3RSZWNvcmQoXG4gIHJlY29yZE5vZGUsXG4gIGdldFNhbXBsZUZpZWxkVmFsdWUsXG4gIHJlY29yZE5vZGUucGFyZW50KCkubm9kZUtleSgpLFxuKTtcbiIsImV4cG9ydCBkZWZhdWx0ICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDpcbiAgICAgICAgICAgIHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6XG4gICAgICAgICAgICB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pO1xuIiwiXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxudmFyIGluaXRlZCA9IGZhbHNlO1xuZnVuY3Rpb24gaW5pdCAoKSB7XG4gIGluaXRlZCA9IHRydWU7XG4gIHZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2RlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgbG9va3VwW2ldID0gY29kZVtpXVxuICAgIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxuICB9XG5cbiAgcmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG4gIHJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICBpZiAoIWluaXRlZCkge1xuICAgIGluaXQoKTtcbiAgfVxuICB2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXG4gIGlmIChsZW4gJSA0ID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG4gIH1cblxuICAvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuICAvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG4gIC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuICAvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcbiAgLy8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuICBwbGFjZUhvbGRlcnMgPSBiNjRbbGVuIC0gMl0gPT09ICc9JyA/IDIgOiBiNjRbbGVuIC0gMV0gPT09ICc9JyA/IDEgOiAwXG5cbiAgLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG4gIGFyciA9IG5ldyBBcnIobGVuICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cbiAgLy8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuICBsID0gcGxhY2VIb2xkZXJzID4gMCA/IGxlbiAtIDQgOiBsZW5cblxuICB2YXIgTCA9IDBcblxuICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTgpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDEyKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8IHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMyldXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDE2KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxMCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgNCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDYgJiAweDNGXSArIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG4gICAgb3V0cHV0LnB1c2godHJpcGxldFRvQmFzZTY0KHRtcCkpXG4gIH1cbiAgcmV0dXJuIG91dHB1dC5qb2luKCcnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgaWYgKCFpbml0ZWQpIHtcbiAgICBpbml0KCk7XG4gIH1cbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgb3V0cHV0ID0gJydcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayh1aW50OCwgaSwgKGkgKyBtYXhDaHVua0xlbmd0aCkgPiBsZW4yID8gbGVuMiA6IChpICsgbWF4Q2h1bmtMZW5ndGgpKSlcbiAgfVxuXG4gIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcbiAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcbiAgICB0bXAgPSB1aW50OFtsZW4gLSAxXVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDJdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz09J1xuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyAodWludDhbbGVuIC0gMV0pXG4gICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMTBdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXVxuICAgIG91dHB1dCArPSAnPSdcbiAgfVxuXG4gIHBhcnRzLnB1c2gob3V0cHV0KVxuXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gcmVhZCAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cml0ZSAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5leHBvcnQgZGVmYXVsdCBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cblxuaW1wb3J0ICogYXMgYmFzZTY0IGZyb20gJy4vYmFzZTY0J1xuaW1wb3J0ICogYXMgaWVlZTc1NCBmcm9tICcuL2llZWU3NTQnXG5pbXBvcnQgaXNBcnJheSBmcm9tICcuL2lzQXJyYXknXG5cbmV4cG9ydCB2YXIgSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBEdWUgdG8gdmFyaW91cyBicm93c2VyIGJ1Z3MsIHNvbWV0aW1lcyB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uIHdpbGwgYmUgdXNlZCBldmVuXG4gKiB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHR5cGVkIGFycmF5cy5cbiAqXG4gKiBOb3RlOlxuICpcbiAqICAgLSBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsXG4gKiAgICAgU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzguXG4gKlxuICogICAtIENocm9tZSA5LTEwIGlzIG1pc3NpbmcgdGhlIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24uXG4gKlxuICogICAtIElFMTAgaGFzIGEgYnJva2VuIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhcnJheXMgb2ZcbiAqICAgICBpbmNvcnJlY3QgbGVuZ3RoIGluIHNvbWUgc2l0dWF0aW9ucy5cblxuICogV2UgZGV0ZWN0IHRoZXNlIGJ1Z2d5IGJyb3dzZXJzIGFuZCBzZXQgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYCB0byBgZmFsc2VgIHNvIHRoZXlcbiAqIGdldCB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uLCB3aGljaCBpcyBzbG93ZXIgYnV0IGJlaGF2ZXMgY29ycmVjdGx5LlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUICE9PSB1bmRlZmluZWRcbiAgPyBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVFxuICA6IHRydWVcblxuLypcbiAqIEV4cG9ydCBrTWF4TGVuZ3RoIGFmdGVyIHR5cGVkIGFycmF5IHN1cHBvcnQgaXMgZGV0ZXJtaW5lZC5cbiAqL1xudmFyIF9rTWF4TGVuZ3RoID0ga01heExlbmd0aCgpXG5leHBvcnQge19rTWF4TGVuZ3RoIGFzIGtNYXhMZW5ndGh9O1xuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICByZXR1cm4gdHJ1ZTtcbiAgLy8gcm9sbHVwIGlzc3Vlc1xuICAvLyB0cnkge1xuICAvLyAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAvLyAgIGFyci5fX3Byb3RvX18gPSB7XG4gIC8vICAgICBfX3Byb3RvX186IFVpbnQ4QXJyYXkucHJvdG90eXBlLFxuICAvLyAgICAgZm9vOiBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gIC8vICAgfVxuICAvLyAgIHJldHVybiBhcnIuZm9vKCkgPT09IDQyICYmIC8vIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkXG4gIC8vICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgJiYgLy8gY2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIC8vICAgICAgIGFyci5zdWJhcnJheSgxLCAxKS5ieXRlTGVuZ3RoID09PSAwIC8vIGllMTAgaGFzIGJyb2tlbiBgc3ViYXJyYXlgXG4gIC8vIH0gY2F0Y2ggKGUpIHtcbiAgLy8gICByZXR1cm4gZmFsc2VcbiAgLy8gfVxufVxuXG5mdW5jdGlvbiBrTWF4TGVuZ3RoICgpIHtcbiAgcmV0dXJuIEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gICAgPyAweDdmZmZmZmZmXG4gICAgOiAweDNmZmZmZmZmXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAodGhhdCwgbGVuZ3RoKSB7XG4gIGlmIChrTWF4TGVuZ3RoKCkgPCBsZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCB0eXBlZCBhcnJheSBsZW5ndGgnKVxuICB9XG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoYXQgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIGlmICh0aGF0ID09PSBudWxsKSB7XG4gICAgICB0aGF0ID0gbmV3IEJ1ZmZlcihsZW5ndGgpXG4gICAgfVxuICAgIHRoYXQubGVuZ3RoID0gbGVuZ3RoXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgaGF2ZSB0aGVpclxuICogcHJvdG90eXBlIGNoYW5nZWQgdG8gYEJ1ZmZlci5wcm90b3R5cGVgLiBGdXJ0aGVybW9yZSwgYEJ1ZmZlcmAgaXMgYSBzdWJjbGFzcyBvZlxuICogYFVpbnQ4QXJyYXlgLCBzbyB0aGUgcmV0dXJuZWQgaW5zdGFuY2VzIHdpbGwgaGF2ZSBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgbWV0aG9kc1xuICogYW5kIHRoZSBgVWludDhBcnJheWAgbWV0aG9kcy4gU3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXRcbiAqIHJldHVybnMgYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogVGhlIGBVaW50OEFycmF5YCBwcm90b3R5cGUgcmVtYWlucyB1bm1vZGlmaWVkLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiYgISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIGlmICh0eXBlb2YgZW5jb2RpbmdPck9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0lmIGVuY29kaW5nIGlzIHNwZWNpZmllZCB0aGVuIHRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJ1xuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gYWxsb2NVbnNhZmUodGhpcywgYXJnKVxuICB9XG4gIHJldHVybiBmcm9tKHRoaXMsIGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxuLy8gVE9ETzogTGVnYWN5LCBub3QgbmVlZGVkIGFueW1vcmUuIFJlbW92ZSBpbiBuZXh0IG1ham9yIHZlcnNpb24uXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gZnJvbSAodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBhIG51bWJlcicpXG4gIH1cblxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnJvbVN0cmluZyh0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldClcbiAgfVxuXG4gIHJldHVybiBmcm9tT2JqZWN0KHRoYXQsIHZhbHVlKVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIEJ1ZmZlcihhcmcsIGVuY29kaW5nKSBidXQgdGhyb3dzIGEgVHlwZUVycm9yXG4gKiBpZiB2YWx1ZSBpcyBhIG51bWJlci5cbiAqIEJ1ZmZlci5mcm9tKHN0clssIGVuY29kaW5nXSlcbiAqIEJ1ZmZlci5mcm9tKGFycmF5KVxuICogQnVmZmVyLmZyb20oYnVmZmVyKVxuICogQnVmZmVyLmZyb20oYXJyYXlCdWZmZXJbLCBieXRlT2Zmc2V0WywgbGVuZ3RoXV0pXG4gKiovXG5CdWZmZXIuZnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBmcm9tKG51bGwsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbmlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICBCdWZmZXIucHJvdG90eXBlLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXkucHJvdG90eXBlXG4gIEJ1ZmZlci5fX3Byb3RvX18gPSBVaW50OEFycmF5XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wuc3BlY2llcyAmJlxuICAgICAgQnVmZmVyW1N5bWJvbC5zcGVjaWVzXSA9PT0gQnVmZmVyKSB7XG4gICAgLy8gRml4IHN1YmFycmF5KCkgaW4gRVMyMDE2LiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvOTdcbiAgICAvLyBPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLCBTeW1ib2wuc3BlY2llcywge1xuICAgIC8vICAgdmFsdWU6IG51bGwsXG4gICAgLy8gICBjb25maWd1cmFibGU6IHRydWVcbiAgICAvLyB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydFNpemUgKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9IGVsc2UgaWYgKHNpemUgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG5lZ2F0aXZlJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAodGhhdCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXR0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2MobnVsbCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlICh0aGF0LCBzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgKytpKSB7XG4gICAgICB0aGF0W2ldID0gMFxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gQnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gU2xvd0J1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICovXG5CdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHRoYXQsIHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGlmICghQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJlbmNvZGluZ1wiIG11c3QgYmUgYSB2YWxpZCBzdHJpbmcgZW5jb2RpbmcnKVxuICB9XG5cbiAgdmFyIGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuXG4gIHZhciBhY3R1YWwgPSB0aGF0LndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG5cbiAgaWYgKGFjdHVhbCAhPT0gbGVuZ3RoKSB7XG4gICAgLy8gV3JpdGluZyBhIGhleCBzdHJpbmcsIGZvciBleGFtcGxlLCB0aGF0IGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycyB3aWxsXG4gICAgLy8gY2F1c2UgZXZlcnl0aGluZyBhZnRlciB0aGUgZmlyc3QgaW52YWxpZCBjaGFyYWN0ZXIgdG8gYmUgaWdub3JlZC4gKGUuZy5cbiAgICAvLyAnYWJ4eGNkJyB3aWxsIGJlIHRyZWF0ZWQgYXMgJ2FiJylcbiAgICB0aGF0ID0gdGhhdC5zbGljZSgwLCBhY3R1YWwpXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlMaWtlICh0aGF0LCBhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyICh0aGF0LCBhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gIGFycmF5LmJ5dGVMZW5ndGggLy8gdGhpcyB0aHJvd3MgaWYgYGFycmF5YCBpcyBub3QgYSB2YWxpZCBBcnJheUJ1ZmZlclxuXG4gIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdvZmZzZXRcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgKyAobGVuZ3RoIHx8IDApKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ2xlbmd0aFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChieXRlT2Zmc2V0ID09PSB1bmRlZmluZWQgJiYgbGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5KVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldClcbiAgfSBlbHNlIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gYXJyYXlcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgdGhhdCA9IGZyb21BcnJheUxpa2UodGhhdCwgYXJyYXkpXG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAodGhhdCwgb2JqKSB7XG4gIGlmIChpbnRlcm5hbElzQnVmZmVyKG9iaikpIHtcbiAgICB2YXIgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbilcblxuICAgIGlmICh0aGF0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoYXRcbiAgICB9XG5cbiAgICBvYmouY29weSh0aGF0LCAwLCAwLCBsZW4pXG4gICAgcmV0dXJuIHRoYXRcbiAgfVxuXG4gIGlmIChvYmopIHtcbiAgICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgb2JqLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB8fCAnbGVuZ3RoJyBpbiBvYmopIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ251bWJlcicgfHwgaXNuYW4ob2JqLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCAwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqKVxuICAgIH1cblxuICAgIGlmIChvYmoudHlwZSA9PT0gJ0J1ZmZlcicgJiYgaXNBcnJheShvYmouZGF0YSkpIHtcbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iai5kYXRhKVxuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCBvciBhcnJheS1saWtlIG9iamVjdC4nKVxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwga01heExlbmd0aCgpYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IGtNYXhMZW5ndGgoKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBrTWF4TGVuZ3RoKCkudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNsb3dCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAoK2xlbmd0aCAhPSBsZW5ndGgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbiAgICBsZW5ndGggPSAwXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5hbGxvYygrbGVuZ3RoKVxufVxuQnVmZmVyLmlzQnVmZmVyID0gaXNCdWZmZXI7XG5mdW5jdGlvbiBpbnRlcm5hbElzQnVmZmVyIChiKSB7XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIWludGVybmFsSXNCdWZmZXIoYSkgfHwgIWludGVybmFsSXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgbXVzdCBiZSBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuXG4gIHZhciB4ID0gYS5sZW5ndGhcbiAgdmFyIHkgPSBiLmxlbmd0aFxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldXG4gICAgICB5ID0gYltpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnbGF0aW4xJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIWlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5hbGxvYygwKVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICBsZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYnVmID0gbGlzdFtpXVxuICAgIGlmICghaW50ZXJuYWxJc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoaW50ZXJuYWxJc0J1ZmZlcihzdHJpbmcpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5sZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQXJyYXlCdWZmZXIuaXNWaWV3ID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAoQXJyYXlCdWZmZXIuaXNWaWV3KHN0cmluZykgfHwgc3RyaW5nIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5ieXRlTGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgc3RyaW5nID0gJycgKyBzdHJpbmdcbiAgfVxuXG4gIHZhciBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gbGVuICogMlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGxlbiA+Pj4gMVxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoIC8vIGFzc3VtZSB1dGY4XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIC8vIE5vIG5lZWQgdG8gdmVyaWZ5IHRoYXQgXCJ0aGlzLmxlbmd0aCA8PSBNQVhfVUlOVDMyXCIgc2luY2UgaXQncyBhIHJlYWQtb25seVxuICAvLyBwcm9wZXJ0eSBvZiBhIHR5cGVkIGFycmF5LlxuXG4gIC8vIFRoaXMgYmVoYXZlcyBuZWl0aGVyIGxpa2UgU3RyaW5nIG5vciBVaW50OEFycmF5IGluIHRoYXQgd2Ugc2V0IHN0YXJ0L2VuZFxuICAvLyB0byB0aGVpciB1cHBlci9sb3dlciBib3VuZHMgaWYgdGhlIHZhbHVlIHBhc3NlZCBpcyBvdXQgb2YgcmFuZ2UuXG4gIC8vIHVuZGVmaW5lZCBpcyBoYW5kbGVkIHNwZWNpYWxseSBhcyBwZXIgRUNNQS0yNjIgNnRoIEVkaXRpb24sXG4gIC8vIFNlY3Rpb24gMTMuMy4zLjcgUnVudGltZSBTZW1hbnRpY3M6IEtleWVkQmluZGluZ0luaXRpYWxpemF0aW9uLlxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCB8fCBzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICAvLyBSZXR1cm4gZWFybHkgaWYgc3RhcnQgPiB0aGlzLmxlbmd0aC4gRG9uZSBoZXJlIHRvIHByZXZlbnQgcG90ZW50aWFsIHVpbnQzMlxuICAvLyBjb2VyY2lvbiBmYWlsIGJlbG93LlxuICBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbmQgPD0gMCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgLy8gRm9yY2UgY29lcnNpb24gdG8gdWludDMyLiBUaGlzIHdpbGwgYWxzbyBjb2VyY2UgZmFsc2V5L05hTiB2YWx1ZXMgdG8gMC5cbiAgZW5kID4+Pj0gMFxuICBzdGFydCA+Pj49IDBcblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gVGhlIHByb3BlcnR5IGlzIHVzZWQgYnkgYEJ1ZmZlci5pc0J1ZmZlcmAgYW5kIGBpcy1idWZmZXJgIChpbiBTYWZhcmkgNS03KSB0byBkZXRlY3Rcbi8vIEJ1ZmZlciBpbnN0YW5jZXMuXG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuZnVuY3Rpb24gc3dhcCAoYiwgbiwgbSkge1xuICB2YXIgaSA9IGJbbl1cbiAgYltuXSA9IGJbbV1cbiAgYlttXSA9IGlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMTYgPSBmdW5jdGlvbiBzd2FwMTYgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDIgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDE2LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAxKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDMyID0gZnVuY3Rpb24gc3dhcDMyICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAzMi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgMilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXA2NCA9IGZ1bmN0aW9uIHN3YXA2NCAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgOCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNjQtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gOCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDcpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDYpXG4gICAgc3dhcCh0aGlzLCBpICsgMiwgaSArIDUpXG4gICAgc3dhcCh0aGlzLCBpICsgMywgaSArIDQpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoIHwgMFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgaWYgKHRoaXMgPT09IGIpIHJldHVybiB0cnVlXG4gIHJldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLCBiKSA9PT0gMFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgdmFyIHN0ciA9ICcnXG4gIHZhciBtYXggPSBJTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgfVxuXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5kID0gdGFyZ2V0ID8gdGFyZ2V0Lmxlbmd0aCA6IDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzU3RhcnQgPSAwXG4gIH1cbiAgaWYgKHRoaXNFbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNFbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBlbmQgPiB0YXJnZXQubGVuZ3RoIHx8IHRoaXNTdGFydCA8IDAgfHwgdGhpc0VuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ291dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQgJiYgc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIHN0YXJ0ID4+Pj0gMFxuICBlbmQgPj4+PSAwXG4gIHRoaXNTdGFydCA+Pj49IDBcbiAgdGhpc0VuZCA+Pj49IDBcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0KSByZXR1cm4gMFxuXG4gIHZhciB4ID0gdGhpc0VuZCAtIHRoaXNTdGFydFxuICB2YXIgeSA9IGVuZCAtIHN0YXJ0XG4gIHZhciBsZW4gPSBNYXRoLm1pbih4LCB5KVxuXG4gIHZhciB0aGlzQ29weSA9IHRoaXMuc2xpY2UodGhpc1N0YXJ0LCB0aGlzRW5kKVxuICB2YXIgdGFyZ2V0Q29weSA9IHRhcmdldC5zbGljZShzdGFydCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAodGhpc0NvcHlbaV0gIT09IHRhcmdldENvcHlbaV0pIHtcbiAgICAgIHggPSB0aGlzQ29weVtpXVxuICAgICAgeSA9IHRhcmdldENvcHlbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG4vLyBGaW5kcyBlaXRoZXIgdGhlIGZpcnN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA+PSBgYnl0ZU9mZnNldGAsXG4vLyBPUiB0aGUgbGFzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPD0gYGJ5dGVPZmZzZXRgLlxuLy9cbi8vIEFyZ3VtZW50czpcbi8vIC0gYnVmZmVyIC0gYSBCdWZmZXIgdG8gc2VhcmNoXG4vLyAtIHZhbCAtIGEgc3RyaW5nLCBCdWZmZXIsIG9yIG51bWJlclxuLy8gLSBieXRlT2Zmc2V0IC0gYW4gaW5kZXggaW50byBgYnVmZmVyYDsgd2lsbCBiZSBjbGFtcGVkIHRvIGFuIGludDMyXG4vLyAtIGVuY29kaW5nIC0gYW4gb3B0aW9uYWwgZW5jb2RpbmcsIHJlbGV2YW50IGlzIHZhbCBpcyBhIHN0cmluZ1xuLy8gLSBkaXIgLSB0cnVlIGZvciBpbmRleE9mLCBmYWxzZSBmb3IgbGFzdEluZGV4T2ZcbmZ1bmN0aW9uIGJpZGlyZWN0aW9uYWxJbmRleE9mIChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICAvLyBFbXB0eSBidWZmZXIgbWVhbnMgbm8gbWF0Y2hcbiAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHJldHVybiAtMVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0XG4gIGlmICh0eXBlb2YgYnl0ZU9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IGJ5dGVPZmZzZXRcbiAgICBieXRlT2Zmc2V0ID0gMFxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPiAweDdmZmZmZmZmKSB7XG4gICAgYnl0ZU9mZnNldCA9IDB4N2ZmZmZmZmZcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgLTB4ODAwMDAwMDApIHtcbiAgICBieXRlT2Zmc2V0ID0gLTB4ODAwMDAwMDBcbiAgfVxuICBieXRlT2Zmc2V0ID0gK2J5dGVPZmZzZXQgIC8vIENvZXJjZSB0byBOdW1iZXIuXG4gIGlmIChpc05hTihieXRlT2Zmc2V0KSkge1xuICAgIC8vIGJ5dGVPZmZzZXQ6IGl0IGl0J3MgdW5kZWZpbmVkLCBudWxsLCBOYU4sIFwiZm9vXCIsIGV0Yywgc2VhcmNoIHdob2xlIGJ1ZmZlclxuICAgIGJ5dGVPZmZzZXQgPSBkaXIgPyAwIDogKGJ1ZmZlci5sZW5ndGggLSAxKVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXQ6IG5lZ2F0aXZlIG9mZnNldHMgc3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBidWZmZXJcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwKSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCArIGJ5dGVPZmZzZXRcbiAgaWYgKGJ5dGVPZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkge1xuICAgIGlmIChkaXIpIHJldHVybiAtMVxuICAgIGVsc2UgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggLSAxXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IDApIHtcbiAgICBpZiAoZGlyKSBieXRlT2Zmc2V0ID0gMFxuICAgIGVsc2UgcmV0dXJuIC0xXG4gIH1cblxuICAvLyBOb3JtYWxpemUgdmFsXG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIHZhbCA9IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gIH1cblxuICAvLyBGaW5hbGx5LCBzZWFyY2ggZWl0aGVyIGluZGV4T2YgKGlmIGRpciBpcyB0cnVlKSBvciBsYXN0SW5kZXhPZlxuICBpZiAoaW50ZXJuYWxJc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDB4RkYgLy8gU2VhcmNoIGZvciBhIGJ5dGUgdmFsdWUgWzAtMjU1XVxuICAgIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJlxuICAgICAgICB0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGRpcikge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCBbIHZhbCBdLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyJylcbn1cblxuZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICB2YXIgaW5kZXhTaXplID0gMVxuICB2YXIgYXJyTGVuZ3RoID0gYXJyLmxlbmd0aFxuICB2YXIgdmFsTGVuZ3RoID0gdmFsLmxlbmd0aFxuXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZW5jb2RpbmcgPT09ICd1Y3MyJyB8fCBlbmNvZGluZyA9PT0gJ3Vjcy0yJyB8fFxuICAgICAgICBlbmNvZGluZyA9PT0gJ3V0ZjE2bGUnIHx8IGVuY29kaW5nID09PSAndXRmLTE2bGUnKSB7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA8IDIgfHwgdmFsLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpbmRleFNpemUgPSAyXG4gICAgICBhcnJMZW5ndGggLz0gMlxuICAgICAgdmFsTGVuZ3RoIC89IDJcbiAgICAgIGJ5dGVPZmZzZXQgLz0gMlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGJ1ZiwgaSkge1xuICAgIGlmIChpbmRleFNpemUgPT09IDEpIHtcbiAgICAgIHJldHVybiBidWZbaV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ1Zi5yZWFkVUludDE2QkUoaSAqIGluZGV4U2l6ZSlcbiAgICB9XG4gIH1cblxuICB2YXIgaVxuICBpZiAoZGlyKSB7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPCBhcnJMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlYWQoYXJyLCBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIGZvdW5kSW5kZXggPSBpXG4gICAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbExlbmd0aCkgcmV0dXJuIGZvdW5kSW5kZXggKiBpbmRleFNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ICE9PSAtMSkgaSAtPSBpIC0gZm91bmRJbmRleFxuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGJ5dGVPZmZzZXQgKyB2YWxMZW5ndGggPiBhcnJMZW5ndGgpIGJ5dGVPZmZzZXQgPSBhcnJMZW5ndGggLSB2YWxMZW5ndGhcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGZvdW5kID0gdHJ1ZVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWxMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAocmVhZChhcnIsIGkgKyBqKSAhPT0gcmVhZCh2YWwsIGopKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuIGlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiB0aGlzLmluZGV4T2YodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykgIT09IC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIHRydWUpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZmFsc2UpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKHN0ckxlbiAlIDIgIT09IDApIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKGlzTmFOKHBhcnNlZCkpIHJldHVybiBpXG4gICAgYnVmW29mZnNldCArIGldID0gcGFyc2VkXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBsYXRpbjFXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBhc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHVjczJXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZylcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBvZmZzZXRbLCBsZW5ndGhdWywgZW5jb2RpbmddKVxuICB9IGVsc2UgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCB8IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICAvLyBsZWdhY3kgd3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpIC0gcmVtb3ZlIGluIHYwLjEzXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1ZmZlci53cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXRbLCBsZW5ndGhdKSBpcyBubyBsb25nZXIgc3VwcG9ydGVkJ1xuICAgIClcbiAgfVxuXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbGVuZ3RoID4gcmVtYWluaW5nKSBsZW5ndGggPSByZW1haW5pbmdcblxuICBpZiAoKHN0cmluZy5sZW5ndGggPiAwICYmIChsZW5ndGggPCAwIHx8IG9mZnNldCA8IDApKSB8fCBvZmZzZXQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIHdyaXRlIG91dHNpZGUgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIC8vIFdhcm5pbmc6IG1heExlbmd0aCBub3QgdGFrZW4gaW50byBhY2NvdW50IGluIGJhc2U2NFdyaXRlXG4gICAgICAgIHJldHVybiBiYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdWNzMldyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHV0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcbiAgdmFyIHJlcyA9IFtdXG5cbiAgdmFyIGkgPSBzdGFydFxuICB3aGlsZSAoaSA8IGVuZCkge1xuICAgIHZhciBmaXJzdEJ5dGUgPSBidWZbaV1cbiAgICB2YXIgY29kZVBvaW50ID0gbnVsbFxuICAgIHZhciBieXRlc1BlclNlcXVlbmNlID0gKGZpcnN0Qnl0ZSA+IDB4RUYpID8gNFxuICAgICAgOiAoZmlyc3RCeXRlID4gMHhERikgPyAzXG4gICAgICA6IChmaXJzdEJ5dGUgPiAweEJGKSA/IDJcbiAgICAgIDogMVxuXG4gICAgaWYgKGkgKyBieXRlc1BlclNlcXVlbmNlIDw9IGVuZCkge1xuICAgICAgdmFyIHNlY29uZEJ5dGUsIHRoaXJkQnl0ZSwgZm91cnRoQnl0ZSwgdGVtcENvZGVQb2ludFxuXG4gICAgICBzd2l0Y2ggKGJ5dGVzUGVyU2VxdWVuY2UpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmIChmaXJzdEJ5dGUgPCAweDgwKSB7XG4gICAgICAgICAgICBjb2RlUG9pbnQgPSBmaXJzdEJ5dGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHgxRikgPDwgMHg2IHwgKHNlY29uZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4QyB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKHRoaXJkQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0ZGICYmICh0ZW1wQ29kZVBvaW50IDwgMHhEODAwIHx8IHRlbXBDb2RlUG9pbnQgPiAweERGRkYpKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGZvdXJ0aEJ5dGUgPSBidWZbaSArIDNdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwICYmIChmb3VydGhCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweDEyIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweEMgfCAodGhpcmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKGZvdXJ0aEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweEZGRkYgJiYgdGVtcENvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGVQb2ludCA9PT0gbnVsbCkge1xuICAgICAgLy8gd2UgZGlkIG5vdCBnZW5lcmF0ZSBhIHZhbGlkIGNvZGVQb2ludCBzbyBpbnNlcnQgYVxuICAgICAgLy8gcmVwbGFjZW1lbnQgY2hhciAoVStGRkZEKSBhbmQgYWR2YW5jZSBvbmx5IDEgYnl0ZVxuICAgICAgY29kZVBvaW50ID0gMHhGRkZEXG4gICAgICBieXRlc1BlclNlcXVlbmNlID0gMVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50ID4gMHhGRkZGKSB7XG4gICAgICAvLyBlbmNvZGUgdG8gdXRmMTYgKHN1cnJvZ2F0ZSBwYWlyIGRhbmNlKVxuICAgICAgY29kZVBvaW50IC09IDB4MTAwMDBcbiAgICAgIHJlcy5wdXNoKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMClcbiAgICAgIGNvZGVQb2ludCA9IDB4REMwMCB8IGNvZGVQb2ludCAmIDB4M0ZGXG4gICAgfVxuXG4gICAgcmVzLnB1c2goY29kZVBvaW50KVxuICAgIGkgKz0gYnl0ZXNQZXJTZXF1ZW5jZVxuICB9XG5cbiAgcmV0dXJuIGRlY29kZUNvZGVQb2ludHNBcnJheShyZXMpXG59XG5cbi8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIyNzQ3MjcyLzY4MDc0MiwgdGhlIGJyb3dzZXIgd2l0aFxuLy8gdGhlIGxvd2VzdCBsaW1pdCBpcyBDaHJvbWUsIHdpdGggMHgxMDAwMCBhcmdzLlxuLy8gV2UgZ28gMSBtYWduaXR1ZGUgbGVzcywgZm9yIHNhZmV0eVxudmFyIE1BWF9BUkdVTUVOVFNfTEVOR1RIID0gMHgxMDAwXG5cbmZ1bmN0aW9uIGRlY29kZUNvZGVQb2ludHNBcnJheSAoY29kZVBvaW50cykge1xuICB2YXIgbGVuID0gY29kZVBvaW50cy5sZW5ndGhcbiAgaWYgKGxlbiA8PSBNQVhfQVJHVU1FTlRTX0xFTkdUSCkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY29kZVBvaW50cykgLy8gYXZvaWQgZXh0cmEgc2xpY2UoKVxuICB9XG5cbiAgLy8gRGVjb2RlIGluIGNodW5rcyB0byBhdm9pZCBcImNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZFwiLlxuICB2YXIgcmVzID0gJydcbiAgdmFyIGkgPSAwXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXG4gICAgICBTdHJpbmcsXG4gICAgICBjb2RlUG9pbnRzLnNsaWNlKGksIGkgKz0gTUFYX0FSR1VNRU5UU19MRU5HVEgpXG4gICAgKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0gJiAweDdGKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gbGF0aW4xU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiB1dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2kgKyAxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICB2YXIgbmV3QnVmXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIG5ld0J1ZiA9IHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZClcbiAgICBuZXdCdWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47ICsraSkge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ld0J1ZlxufVxuXG4vKlxuICogTmVlZCB0byBtYWtlIHN1cmUgdGhhdCBidWZmZXIgaXNuJ3QgdHJ5aW5nIHRvIHdyaXRlIG91dCBvZiBib3VuZHMuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT2Zmc2V0IChvZmZzZXQsIGV4dCwgbGVuZ3RoKSB7XG4gIGlmICgob2Zmc2V0ICUgMSkgIT09IDAgfHwgb2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ29mZnNldCBpcyBub3QgdWludCcpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBsZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdUcnlpbmcgdG8gYWNjZXNzIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludExFID0gZnVuY3Rpb24gcmVhZFVJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcbiAgfVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF1cbiAgdmFyIG11bCA9IDFcbiAgd2hpbGUgKGJ5dGVMZW5ndGggPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIHJlYWRVSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCA4KSB8IHRoaXNbb2Zmc2V0ICsgMV1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiByZWFkVUludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKCh0aGlzW29mZnNldF0pIHxcbiAgICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSkgK1xuICAgICAgKHRoaXNbb2Zmc2V0ICsgM10gKiAweDEwMDAwMDApXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50QkUgPSBmdW5jdGlvbiByZWFkSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGhcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1pXVxuICB3aGlsZSAoaSA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIHJlYWRJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gcmVhZEludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgMV0gfCAodGhpc1tvZmZzZXRdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgMjQpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdExFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdEJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiByZWFkRG91YmxlQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCA1MiwgOClcbn1cblxuZnVuY3Rpb24gY2hlY2tJbnQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAoIWludGVybmFsSXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZmZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHhmZiwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCAyKTsgaSA8IGo7ICsraSkge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgNCk7IGkgPCBqOyArK2kpIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gMFxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgLSAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgKyAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgOCwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICh0YXJnZXQsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXRTdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB0YXJnZXRTdGFydCA9IHRhcmdldC5sZW5ndGhcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwXG4gIGlmIChlbmQgPiAwICYmIGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDBcbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgdGhpcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAodGFyZ2V0U3RhcnQgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgaWYgKGVuZCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgKyBzdGFydFxuICB9XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG4gIHZhciBpXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yIChpID0gbGVuIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2UgaWYgKGxlbiA8IDEwMDAgfHwgIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gYXNjZW5kaW5nIGNvcHkgZnJvbSBzdGFydFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoY29kZSA8IDI1Nikge1xuICAgICAgICB2YWwgPSBjb2RlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMjU1XG4gIH1cblxuICAvLyBJbnZhbGlkIHJhbmdlcyBhcmUgbm90IHNldCB0byBhIGRlZmF1bHQsIHNvIGNhbiByYW5nZSBjaGVjayBlYXJseS5cbiAgaWYgKHN0YXJ0IDwgMCB8fCB0aGlzLmxlbmd0aCA8IHN0YXJ0IHx8IHRoaXMubGVuZ3RoIDwgZW5kKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ091dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgPj4+IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyB0aGlzLmxlbmd0aCA6IGVuZCA+Pj4gMFxuXG4gIGlmICghdmFsKSB2YWwgPSAwXG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgdGhpc1tpXSA9IHZhbFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYnl0ZXMgPSBpbnRlcm5hbElzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IHV0ZjhUb0J5dGVzKG5ldyBCdWZmZXIodmFsLCBlbmNvZGluZykudG9TdHJpbmcoKSlcbiAgICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rXFwvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyaW5ndHJpbShzdHIpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICB2YXIgY29kZVBvaW50XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICB2YXIgYnl0ZXMgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuXG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBpc25hbiAodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IHZhbCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuXG5cbi8vIHRoZSBmb2xsb3dpbmcgaXMgZnJvbSBpcy1idWZmZXIsIGFsc28gYnkgRmVyb3NzIEFib3VraGFkaWplaCBhbmQgd2l0aCBzYW1lIGxpc2VuY2Vcbi8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcbi8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcbmV4cG9ydCBmdW5jdGlvbiBpc0J1ZmZlcihvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmICghIW9iai5faXNCdWZmZXIgfHwgaXNGYXN0QnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikpXG59XG5cbmZ1bmN0aW9uIGlzRmFzdEJ1ZmZlciAob2JqKSB7XG4gIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG5cbi8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5mdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzRmFzdEJ1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtCdWZmZXJ9IGZyb20gJ2J1ZmZlcic7XG52YXIgaXNCdWZmZXJFbmNvZGluZyA9IEJ1ZmZlci5pc0VuY29kaW5nXG4gIHx8IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gICAgICAgc3dpdGNoIChlbmNvZGluZyAmJiBlbmNvZGluZy50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICBjYXNlICdoZXgnOiBjYXNlICd1dGY4JzogY2FzZSAndXRmLTgnOiBjYXNlICdhc2NpaSc6IGNhc2UgJ2JpbmFyeSc6IGNhc2UgJ2Jhc2U2NCc6IGNhc2UgJ3VjczInOiBjYXNlICd1Y3MtMic6IGNhc2UgJ3V0ZjE2bGUnOiBjYXNlICd1dGYtMTZsZSc6IGNhc2UgJ3Jhdyc6IHJldHVybiB0cnVlO1xuICAgICAgICAgZGVmYXVsdDogcmV0dXJuIGZhbHNlO1xuICAgICAgIH1cbiAgICAgfVxuXG5cbmZ1bmN0aW9uIGFzc2VydEVuY29kaW5nKGVuY29kaW5nKSB7XG4gIGlmIChlbmNvZGluZyAmJiAhaXNCdWZmZXJFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZyk7XG4gIH1cbn1cblxuLy8gU3RyaW5nRGVjb2RlciBwcm92aWRlcyBhbiBpbnRlcmZhY2UgZm9yIGVmZmljaWVudGx5IHNwbGl0dGluZyBhIHNlcmllcyBvZlxuLy8gYnVmZmVycyBpbnRvIGEgc2VyaWVzIG9mIEpTIHN0cmluZ3Mgd2l0aG91dCBicmVha2luZyBhcGFydCBtdWx0aS1ieXRlXG4vLyBjaGFyYWN0ZXJzLiBDRVNVLTggaXMgaGFuZGxlZCBhcyBwYXJ0IG9mIHRoZSBVVEYtOCBlbmNvZGluZy5cbi8vXG4vLyBAVE9ETyBIYW5kbGluZyBhbGwgZW5jb2RpbmdzIGluc2lkZSBhIHNpbmdsZSBvYmplY3QgbWFrZXMgaXQgdmVyeSBkaWZmaWN1bHRcbi8vIHRvIHJlYXNvbiBhYm91dCB0aGlzIGNvZGUsIHNvIGl0IHNob3VsZCBiZSBzcGxpdCB1cCBpbiB0aGUgZnV0dXJlLlxuLy8gQFRPRE8gVGhlcmUgc2hvdWxkIGJlIGEgdXRmOC1zdHJpY3QgZW5jb2RpbmcgdGhhdCByZWplY3RzIGludmFsaWQgVVRGLTggY29kZVxuLy8gcG9pbnRzIGFzIHVzZWQgYnkgQ0VTVS04LlxuZXhwb3J0IGZ1bmN0aW9uIFN0cmluZ0RlY29kZXIoZW5jb2RpbmcpIHtcbiAgdGhpcy5lbmNvZGluZyA9IChlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvWy1fXS8sICcnKTtcbiAgYXNzZXJ0RW5jb2RpbmcoZW5jb2RpbmcpO1xuICBzd2l0Y2ggKHRoaXMuZW5jb2RpbmcpIHtcbiAgICBjYXNlICd1dGY4JzpcbiAgICAgIC8vIENFU1UtOCByZXByZXNlbnRzIGVhY2ggb2YgU3Vycm9nYXRlIFBhaXIgYnkgMy1ieXRlc1xuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgLy8gVVRGLTE2IHJlcHJlc2VudHMgZWFjaCBvZiBTdXJyb2dhdGUgUGFpciBieSAyLWJ5dGVzXG4gICAgICB0aGlzLnN1cnJvZ2F0ZVNpemUgPSAyO1xuICAgICAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhciA9IHV0ZjE2RGV0ZWN0SW5jb21wbGV0ZUNoYXI7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgLy8gQmFzZS02NCBzdG9yZXMgMyBieXRlcyBpbiA0IGNoYXJzLCBhbmQgcGFkcyB0aGUgcmVtYWluZGVyLlxuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMztcbiAgICAgIHRoaXMuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSBiYXNlNjREZXRlY3RJbmNvbXBsZXRlQ2hhcjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aGlzLndyaXRlID0gcGFzc1Rocm91Z2hXcml0ZTtcbiAgICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEVub3VnaCBzcGFjZSB0byBzdG9yZSBhbGwgYnl0ZXMgb2YgYSBzaW5nbGUgY2hhcmFjdGVyLiBVVEYtOCBuZWVkcyA0XG4gIC8vIGJ5dGVzLCBidXQgQ0VTVS04IG1heSByZXF1aXJlIHVwIHRvIDYgKDMgYnl0ZXMgcGVyIHN1cnJvZ2F0ZSkuXG4gIHRoaXMuY2hhckJ1ZmZlciA9IG5ldyBCdWZmZXIoNik7XG4gIC8vIE51bWJlciBvZiBieXRlcyByZWNlaXZlZCBmb3IgdGhlIGN1cnJlbnQgaW5jb21wbGV0ZSBtdWx0aS1ieXRlIGNoYXJhY3Rlci5cbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSAwO1xuICAvLyBOdW1iZXIgb2YgYnl0ZXMgZXhwZWN0ZWQgZm9yIHRoZSBjdXJyZW50IGluY29tcGxldGUgbXVsdGktYnl0ZSBjaGFyYWN0ZXIuXG4gIHRoaXMuY2hhckxlbmd0aCA9IDA7XG59O1xuXG5cbi8vIHdyaXRlIGRlY29kZXMgdGhlIGdpdmVuIGJ1ZmZlciBhbmQgcmV0dXJucyBpdCBhcyBKUyBzdHJpbmcgdGhhdCBpc1xuLy8gZ3VhcmFudGVlZCB0byBub3QgY29udGFpbiBhbnkgcGFydGlhbCBtdWx0aS1ieXRlIGNoYXJhY3RlcnMuIEFueSBwYXJ0aWFsXG4vLyBjaGFyYWN0ZXIgZm91bmQgYXQgdGhlIGVuZCBvZiB0aGUgYnVmZmVyIGlzIGJ1ZmZlcmVkIHVwLCBhbmQgd2lsbCBiZVxuLy8gcmV0dXJuZWQgd2hlbiBjYWxsaW5nIHdyaXRlIGFnYWluIHdpdGggdGhlIHJlbWFpbmluZyBieXRlcy5cbi8vXG4vLyBOb3RlOiBDb252ZXJ0aW5nIGEgQnVmZmVyIGNvbnRhaW5pbmcgYW4gb3JwaGFuIHN1cnJvZ2F0ZSB0byBhIFN0cmluZ1xuLy8gY3VycmVudGx5IHdvcmtzLCBidXQgY29udmVydGluZyBhIFN0cmluZyB0byBhIEJ1ZmZlciAodmlhIGBuZXcgQnVmZmVyYCwgb3Jcbi8vIEJ1ZmZlciN3cml0ZSkgd2lsbCByZXBsYWNlIGluY29tcGxldGUgc3Vycm9nYXRlcyB3aXRoIHRoZSB1bmljb2RlXG4vLyByZXBsYWNlbWVudCBjaGFyYWN0ZXIuIFNlZSBodHRwczovL2NvZGVyZXZpZXcuY2hyb21pdW0ub3JnLzEyMTE3MzAwOS8gLlxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgdmFyIGNoYXJTdHIgPSAnJztcbiAgLy8gaWYgb3VyIGxhc3Qgd3JpdGUgZW5kZWQgd2l0aCBhbiBpbmNvbXBsZXRlIG11bHRpYnl0ZSBjaGFyYWN0ZXJcbiAgd2hpbGUgKHRoaXMuY2hhckxlbmd0aCkge1xuICAgIC8vIGRldGVybWluZSBob3cgbWFueSByZW1haW5pbmcgYnl0ZXMgdGhpcyBidWZmZXIgaGFzIHRvIG9mZmVyIGZvciB0aGlzIGNoYXJcbiAgICB2YXIgYXZhaWxhYmxlID0gKGJ1ZmZlci5sZW5ndGggPj0gdGhpcy5jaGFyTGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQpID9cbiAgICAgICAgdGhpcy5jaGFyTGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQgOlxuICAgICAgICBidWZmZXIubGVuZ3RoO1xuXG4gICAgLy8gYWRkIHRoZSBuZXcgYnl0ZXMgdG8gdGhlIGNoYXIgYnVmZmVyXG4gICAgYnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCB0aGlzLmNoYXJSZWNlaXZlZCwgMCwgYXZhaWxhYmxlKTtcbiAgICB0aGlzLmNoYXJSZWNlaXZlZCArPSBhdmFpbGFibGU7XG5cbiAgICBpZiAodGhpcy5jaGFyUmVjZWl2ZWQgPCB0aGlzLmNoYXJMZW5ndGgpIHtcbiAgICAgIC8vIHN0aWxsIG5vdCBlbm91Z2ggY2hhcnMgaW4gdGhpcyBidWZmZXI/IHdhaXQgZm9yIG1vcmUgLi4uXG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIGJ5dGVzIGJlbG9uZ2luZyB0byB0aGUgY3VycmVudCBjaGFyYWN0ZXIgZnJvbSB0aGUgYnVmZmVyXG4gICAgYnVmZmVyID0gYnVmZmVyLnNsaWNlKGF2YWlsYWJsZSwgYnVmZmVyLmxlbmd0aCk7XG5cbiAgICAvLyBnZXQgdGhlIGNoYXJhY3RlciB0aGF0IHdhcyBzcGxpdFxuICAgIGNoYXJTdHIgPSB0aGlzLmNoYXJCdWZmZXIuc2xpY2UoMCwgdGhpcy5jaGFyTGVuZ3RoKS50b1N0cmluZyh0aGlzLmVuY29kaW5nKTtcblxuICAgIC8vIENFU1UtODogbGVhZCBzdXJyb2dhdGUgKEQ4MDAtREJGRikgaXMgYWxzbyB0aGUgaW5jb21wbGV0ZSBjaGFyYWN0ZXJcbiAgICB2YXIgY2hhckNvZGUgPSBjaGFyU3RyLmNoYXJDb2RlQXQoY2hhclN0ci5sZW5ndGggLSAxKTtcbiAgICBpZiAoY2hhckNvZGUgPj0gMHhEODAwICYmIGNoYXJDb2RlIDw9IDB4REJGRikge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoICs9IHRoaXMuc3Vycm9nYXRlU2l6ZTtcbiAgICAgIGNoYXJTdHIgPSAnJztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICB0aGlzLmNoYXJSZWNlaXZlZCA9IHRoaXMuY2hhckxlbmd0aCA9IDA7XG5cbiAgICAvLyBpZiB0aGVyZSBhcmUgbm8gbW9yZSBieXRlcyBpbiB0aGlzIGJ1ZmZlciwganVzdCBlbWl0IG91ciBjaGFyXG4gICAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjaGFyU3RyO1xuICAgIH1cbiAgICBicmVhaztcbiAgfVxuXG4gIC8vIGRldGVybWluZSBhbmQgc2V0IGNoYXJMZW5ndGggLyBjaGFyUmVjZWl2ZWRcbiAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpO1xuXG4gIHZhciBlbmQgPSBidWZmZXIubGVuZ3RoO1xuICBpZiAodGhpcy5jaGFyTGVuZ3RoKSB7XG4gICAgLy8gYnVmZmVyIHRoZSBpbmNvbXBsZXRlIGNoYXJhY3RlciBieXRlcyB3ZSBnb3RcbiAgICBidWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIDAsIGJ1ZmZlci5sZW5ndGggLSB0aGlzLmNoYXJSZWNlaXZlZCwgZW5kKTtcbiAgICBlbmQgLT0gdGhpcy5jaGFyUmVjZWl2ZWQ7XG4gIH1cblxuICBjaGFyU3RyICs9IGJ1ZmZlci50b1N0cmluZyh0aGlzLmVuY29kaW5nLCAwLCBlbmQpO1xuXG4gIHZhciBlbmQgPSBjaGFyU3RyLmxlbmd0aCAtIDE7XG4gIHZhciBjaGFyQ29kZSA9IGNoYXJTdHIuY2hhckNvZGVBdChlbmQpO1xuICAvLyBDRVNVLTg6IGxlYWQgc3Vycm9nYXRlIChEODAwLURCRkYpIGlzIGFsc28gdGhlIGluY29tcGxldGUgY2hhcmFjdGVyXG4gIGlmIChjaGFyQ29kZSA+PSAweEQ4MDAgJiYgY2hhckNvZGUgPD0gMHhEQkZGKSB7XG4gICAgdmFyIHNpemUgPSB0aGlzLnN1cnJvZ2F0ZVNpemU7XG4gICAgdGhpcy5jaGFyTGVuZ3RoICs9IHNpemU7XG4gICAgdGhpcy5jaGFyUmVjZWl2ZWQgKz0gc2l6ZTtcbiAgICB0aGlzLmNoYXJCdWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIHNpemUsIDAsIHNpemUpO1xuICAgIGJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgMCwgMCwgc2l6ZSk7XG4gICAgcmV0dXJuIGNoYXJTdHIuc3Vic3RyaW5nKDAsIGVuZCk7XG4gIH1cblxuICAvLyBvciBqdXN0IGVtaXQgdGhlIGNoYXJTdHJcbiAgcmV0dXJuIGNoYXJTdHI7XG59O1xuXG4vLyBkZXRlY3RJbmNvbXBsZXRlQ2hhciBkZXRlcm1pbmVzIGlmIHRoZXJlIGlzIGFuIGluY29tcGxldGUgVVRGLTggY2hhcmFjdGVyIGF0XG4vLyB0aGUgZW5kIG9mIHRoZSBnaXZlbiBidWZmZXIuIElmIHNvLCBpdCBzZXRzIHRoaXMuY2hhckxlbmd0aCB0byB0aGUgYnl0ZVxuLy8gbGVuZ3RoIHRoYXQgY2hhcmFjdGVyLCBhbmQgc2V0cyB0aGlzLmNoYXJSZWNlaXZlZCB0byB0aGUgbnVtYmVyIG9mIGJ5dGVzXG4vLyB0aGF0IGFyZSBhdmFpbGFibGUgZm9yIHRoaXMgY2hhcmFjdGVyLlxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgLy8gZGV0ZXJtaW5lIGhvdyBtYW55IGJ5dGVzIHdlIGhhdmUgdG8gY2hlY2sgYXQgdGhlIGVuZCBvZiB0aGlzIGJ1ZmZlclxuICB2YXIgaSA9IChidWZmZXIubGVuZ3RoID49IDMpID8gMyA6IGJ1ZmZlci5sZW5ndGg7XG5cbiAgLy8gRmlndXJlIG91dCBpZiBvbmUgb2YgdGhlIGxhc3QgaSBieXRlcyBvZiBvdXIgYnVmZmVyIGFubm91bmNlcyBhblxuICAvLyBpbmNvbXBsZXRlIGNoYXIuXG4gIGZvciAoOyBpID4gMDsgaS0tKSB7XG4gICAgdmFyIGMgPSBidWZmZXJbYnVmZmVyLmxlbmd0aCAtIGldO1xuXG4gICAgLy8gU2VlIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVVRGLTgjRGVzY3JpcHRpb25cblxuICAgIC8vIDExMFhYWFhYXG4gICAgaWYgKGkgPT0gMSAmJiBjID4+IDUgPT0gMHgwNikge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gMjtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIDExMTBYWFhYXG4gICAgaWYgKGkgPD0gMiAmJiBjID4+IDQgPT0gMHgwRSkge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gMztcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIDExMTEwWFhYXG4gICAgaWYgKGkgPD0gMyAmJiBjID4+IDMgPT0gMHgxRSkge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gNDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGk7XG59O1xuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgdmFyIHJlcyA9ICcnO1xuICBpZiAoYnVmZmVyICYmIGJ1ZmZlci5sZW5ndGgpXG4gICAgcmVzID0gdGhpcy53cml0ZShidWZmZXIpO1xuXG4gIGlmICh0aGlzLmNoYXJSZWNlaXZlZCkge1xuICAgIHZhciBjciA9IHRoaXMuY2hhclJlY2VpdmVkO1xuICAgIHZhciBidWYgPSB0aGlzLmNoYXJCdWZmZXI7XG4gICAgdmFyIGVuYyA9IHRoaXMuZW5jb2Rpbmc7XG4gICAgcmVzICs9IGJ1Zi5zbGljZSgwLCBjcikudG9TdHJpbmcoZW5jKTtcbiAgfVxuXG4gIHJldHVybiByZXM7XG59O1xuXG5mdW5jdGlvbiBwYXNzVGhyb3VnaFdyaXRlKGJ1ZmZlcikge1xuICByZXR1cm4gYnVmZmVyLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcpO1xufVxuXG5mdW5jdGlvbiB1dGYxNkRldGVjdEluY29tcGxldGVDaGFyKGJ1ZmZlcikge1xuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGJ1ZmZlci5sZW5ndGggJSAyO1xuICB0aGlzLmNoYXJMZW5ndGggPSB0aGlzLmNoYXJSZWNlaXZlZCA/IDIgOiAwO1xufVxuXG5mdW5jdGlvbiBiYXNlNjREZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpIHtcbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSBidWZmZXIubGVuZ3RoICUgMztcbiAgdGhpcy5jaGFyTGVuZ3RoID0gdGhpcy5jaGFyUmVjZWl2ZWQgPyAzIDogMDtcbn1cbiIsImltcG9ydCB7Z2VuZXJhdGVTY2hlbWF9IGZyb20gXCIuL2luZGV4U2NoZW1hQ3JlYXRvclwiO1xuaW1wb3J0IHsgaGFzLCBpc1N0cmluZywgZGlmZmVyZW5jZSwgZmluZCB9IGZyb20gXCJsb2Rhc2gvZnBcIjtcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJzYWZlLWJ1ZmZlclwiO1xuaW1wb3J0IHtTdHJpbmdEZWNvZGVyfSBmcm9tIFwic3RyaW5nX2RlY29kZXJcIjtcbmltcG9ydCB7Z2V0VHlwZX0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgeyBpc1NvbWV0aGluZyB9IGZyb20gXCIuLi9jb21tb25cIjtcblxuZXhwb3J0IGNvbnN0IEJVRkZFUl9NQVhfQllURVMgPSA1MjQyODg7IC8vIDAuNU1iXG5cbmV4cG9ydCBjb25zdCBDT05USU5VRV9SRUFESU5HX1JFQ09SRFMgPSBcIkNPTlRJTlVFX1JFQURJTkdcIjtcbmV4cG9ydCBjb25zdCBSRUFEX1JFTUFJTklOR19URVhUID0gXCJSRUFEX1JFTUFJTklOR1wiO1xuZXhwb3J0IGNvbnN0IENBTkNFTF9SRUFEID0gXCJDQU5DRUxcIjtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4V3JpdGVyID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlLCByZWFkYWJsZVN0cmVhbSwgd3JpdGFibGVTdHJlYW0sIGVuZCkgPT4ge1xuICAgIGNvbnN0IHNjaGVtYSA9IGdlbmVyYXRlU2NoZW1hKGhpZXJhcmNoeSwgaW5kZXhOb2RlKTtcblxuICAgIHJldHVybiAoe1xuICAgICAgICByZWFkOiByZWFkKHJlYWRhYmxlU3RyZWFtLCBzY2hlbWEpLFxuICAgICAgICB1cGRhdGVJbmRleDogdXBkYXRlSW5kZXgocmVhZGFibGVTdHJlYW0sIHdyaXRhYmxlU3RyZWFtLCBzY2hlbWEsIGVuZClcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleFJlYWRlciA9IChoaWVyYXJjaHksIGluZGV4Tm9kZSwgcmVhZGFibGVTdHJlYW0pID0+IFxuICAgIHJlYWQoXG4gICAgICAgIHJlYWRhYmxlU3RyZWFtLCBcbiAgICAgICAgZ2VuZXJhdGVTY2hlbWEoaGllcmFyY2h5LCBpbmRleE5vZGUpXG4gICAgKTtcblxuY29uc3QgdXBkYXRlSW5kZXggPSAocmVhZGFibGVTdHJlYW0sIHdyaXRhYmxlU3RyZWFtLCBzY2hlbWEpID0+IGFzeW5jIChpdGVtc1RvV3JpdGUsIGtleXNUb1JlbW92ZSkgPT4ge1xuICAgIGNvbnN0IHdyaXRlID0gbmV3T3V0cHV0V3JpdGVyKEJVRkZFUl9NQVhfQllURVMsIHdyaXRhYmxlU3RyZWFtKTtcbiAgICBjb25zdCB3cml0dGVuSXRlbXMgPSBbXTsgXG4gICAgYXdhaXQgcmVhZChyZWFkYWJsZVN0cmVhbSwgc2NoZW1hKShcbiAgICAgICAgYXN5bmMgaW5kZXhlZEl0ZW0gPT4ge1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlZCA9IGZpbmQoaSA9PiBpbmRleGVkSXRlbS5rZXkgPT09IGkua2V5KShpdGVtc1RvV3JpdGUpO1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlZCA9IGZpbmQoayA9PiBpbmRleGVkSXRlbS5rZXkgPT09IGspKGtleXNUb1JlbW92ZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKGlzU29tZXRoaW5nKHJlbW92ZWQpKSBcbiAgICAgICAgICAgICAgICByZXR1cm4gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xuXG4gICAgICAgICAgICBpZihpc1NvbWV0aGluZyh1cGRhdGVkKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlcmlhbGl6ZWRJdGVtID0gIHNlcmlhbGl6ZUl0ZW0oc2NoZW1hLCB1cGRhdGVkKTtcbiAgICAgICAgICAgICAgICBhd2FpdCB3cml0ZShzZXJpYWxpemVkSXRlbSk7XG4gICAgICAgICAgICAgICAgd3JpdHRlbkl0ZW1zLnB1c2godXBkYXRlZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRlKFxuICAgICAgICAgICAgICAgICAgICBzZXJpYWxpemVJdGVtKHNjaGVtYSwgaW5kZXhlZEl0ZW0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gXG5cbiAgICAgICAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XG5cbiAgICAgICAgfSxcbiAgICAgICAgYXN5bmMgdGV4dCA9PiBhd2FpdCB3cml0ZSh0ZXh0KVxuICAgICk7XG5cbiAgICBpZih3cml0dGVuSXRlbXMubGVuZ3RoICE9PSBpdGVtc1RvV3JpdGUubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHRvQWRkID0gZGlmZmVyZW5jZShpdGVtc1RvV3JpdGUsIHdyaXR0ZW5JdGVtcyk7XG4gICAgICAgIGZvcihsZXQgYWRkZWQgb2YgdG9BZGQpIHtcbiAgICAgICAgICAgIGF3YWl0IHdyaXRlKFxuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZUl0ZW0oc2NoZW1hLCBhZGRlZClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYod3JpdHRlbkl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBwb3RlbnRpYWxseSBhcmUgbm8gcmVjb3Jkc1xuICAgICAgICBhd2FpdCB3cml0ZShcIlwiKTtcbiAgICB9XG5cbiAgICBhd2FpdCB3cml0ZSgpO1xuICAgIGF3YWl0IHdyaXRhYmxlU3RyZWFtLmVuZCgpO1xufTtcblxuY29uc3QgcmVhZCA9IChyZWFkYWJsZVN0cmVhbSwgc2NoZW1hKSA9PiBhc3luYyAob25HZXRJdGVtLCBvbkdldFRleHQpID0+IHtcbiAgICBjb25zdCByZWFkSW5wdXQgPSBuZXdJbnB1dFJlYWRlcihyZWFkYWJsZVN0cmVhbSk7XG4gICAgbGV0IHRleHQgPSBhd2FpdCByZWFkSW5wdXQoKTtcbiAgICBsZXQgc3RhdHVzID0gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xuICAgIHdoaWxlKHRleHQubGVuZ3RoID4gMCkge1xuXG4gICAgICAgIGlmKHN0YXR1cyA9PT0gUkVBRF9SRU1BSU5JTkdfVEVYVCkge1xuICAgICAgICAgICAgYXdhaXQgb25HZXRUZXh0KHRleHQpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZihzdGF0dXMgPT09IENBTkNFTF9SRUFEKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcm93VGV4dCA9IFwiXCI7XG4gICAgICAgIGxldCBjdXJyZW50Q2hhckluZGV4PTA7XG4gICAgICAgIGZvcihsZXQgY3VycmVudENoYXIgb2YgdGV4dCkge1xuICAgICAgICAgICAgcm93VGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcIlxcclwiKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzID0gYXdhaXQgb25HZXRJdGVtKFxuICAgICAgICAgICAgICAgICAgICBkZXNlcmlhbGl6ZVJvdyhzY2hlbWEsIHJvd1RleHQpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByb3dUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBpZihzdGF0dXMgPT09IFJFQURfUkVNQUlOSU5HX1RFWFQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudENoYXJJbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoY3VycmVudENoYXJJbmRleCA8IHRleHQubGVuZ3RoIC0xKSB7XG4gICAgICAgICAgICBhd2FpdCBvbkdldFRleHQodGV4dC5zdWJzdHJpbmcoY3VycmVudENoYXJJbmRleCArIDEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHQgPSBhd2FpdCByZWFkSW5wdXQoKTtcbiAgICB9XG5cbiAgICBhd2FpdCByZWFkYWJsZVN0cmVhbS5kZXN0cm95KCk7XG5cbn07XG5cbmNvbnN0IG5ld091dHB1dFdyaXRlciA9IChmbHVzaEJvdW5kYXJ5LCB3cml0YWJsZVN0cmVhbSkgPT4ge1xuICAgIFxuICAgIGxldCBjdXJyZW50QnVmZmVyID0gbnVsbDtcblxuICAgIHJldHVybiBhc3luYyAodGV4dCkgPT4ge1xuXG4gICAgICAgIGlmKGlzU3RyaW5nKHRleHQpICYmIGN1cnJlbnRCdWZmZXIgPT09IG51bGwpXG4gICAgICAgICAgICBjdXJyZW50QnVmZmVyID0gQnVmZmVyLmZyb20odGV4dCwgXCJ1dGY4XCIpO1xuICAgICAgICBlbHNlIGlmKGlzU3RyaW5nKHRleHQpKVxuICAgICAgICAgICAgY3VycmVudEJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoW1xuICAgICAgICAgICAgICAgIGN1cnJlbnRCdWZmZXIsXG4gICAgICAgICAgICAgICAgQnVmZmVyLmZyb20odGV4dCwgXCJ1dGY4XCIpXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgXG4gICAgICAgIGlmKGN1cnJlbnRCdWZmZXIgIT09IG51bGwgJiZcbiAgICAgICAgICAgIChjdXJyZW50QnVmZmVyLmxlbmd0aCA+IGZsdXNoQm91bmRhcnlcbiAgICAgICAgICAgICB8fCAhaXNTdHJpbmcodGV4dCkpKSB7XG5cbiAgICAgICAgICAgIGF3YWl0IHdyaXRhYmxlU3RyZWFtLndyaXRlKGN1cnJlbnRCdWZmZXIpO1xuICAgICAgICAgICAgY3VycmVudEJ1ZmZlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5jb25zdCBuZXdJbnB1dFJlYWRlciA9IChyZWFkYWJsZVN0cmVhbSkgPT4ge1xuXG4gICAgY29uc3QgZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKCd1dGY4Jyk7XG4gICAgbGV0IHJlbWFpbmluZ0J5dGVzID0gW107XG5cbiAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgIGxldCBuZXh0Qnl0ZXNCdWZmZXIgPSBhd2FpdCByZWFkYWJsZVN0cmVhbS5yZWFkKEJVRkZFUl9NQVhfQllURVMpO1xuICAgICAgICBjb25zdCByZW1haW5pbmdCdWZmZXIgPSBCdWZmZXIuZnJvbShyZW1haW5pbmdCeXRlcyk7XG5cbiAgICAgICAgaWYoIW5leHRCeXRlc0J1ZmZlcikgbmV4dEJ5dGVzQnVmZmVyID0gQnVmZmVyLmZyb20oW10pO1xuXG4gICAgICAgIGNvbnN0IG1vcmVUb1JlYWQgPSBuZXh0Qnl0ZXNCdWZmZXIubGVuZ3RoID09PSBCVUZGRVJfTUFYX0JZVEVTO1xuXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoXG4gICAgICAgICAgICBbcmVtYWluaW5nQnVmZmVyLCBuZXh0Qnl0ZXNCdWZmZXJdLFxuICAgICAgICAgICAgcmVtYWluaW5nQnVmZmVyLmxlbmd0aCArIG5leHRCeXRlc0J1ZmZlci5sZW5ndGgpO1xuXG4gICAgICAgIGNvbnN0IHRleHQgPSBkZWNvZGVyLndyaXRlKGJ1ZmZlcik7XG4gICAgICAgIHJlbWFpbmluZ0J5dGVzID0gZGVjb2Rlci5lbmQoYnVmZmVyKTtcblxuICAgICAgICBpZighbW9yZVRvUmVhZCAmJiByZW1haW5pbmdCeXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBpZiBmb3IgYW55IHJlYXNvbiwgd2UgaGF2ZSByZW1haW5pbmcgYnl0ZXMgYXQgdGhlIGVuZFxuICAgICAgICAgICAgLy8gb2YgdGhlIHN0cmVhbSwganVzdCBkaXNjYXJkIC0gZG9udCBzZWUgd2h5IHRoaXMgc2hvdWxkXG4gICAgICAgICAgICAvLyBldmVyIGhhcHBlbiwgYnV0IGlmIGl0IGRvZXMsIGl0IGNvdWxkIGNhdXNlIGEgc3RhY2sgb3ZlcmZsb3dcbiAgICAgICAgICAgIHJlbWFpbmluZ0J5dGVzID0gW107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9O1xufTtcblxuY29uc3QgZGVzZXJpYWxpemVSb3cgPSAoc2NoZW1hLCByb3dUZXh0KSA9PiB7XG4gICAgbGV0IGN1cnJlbnRQcm9wSW5kZXggPSAwO1xuICAgIGxldCBjdXJyZW50Q2hhckluZGV4ID0gMDtcbiAgICBsZXQgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XG4gICAgbGV0IGlzRXNjYXBlZCA9IGZhbHNlO1xuICAgIGNvbnN0IGl0ZW0gPSB7fTtcblxuICAgIGNvbnN0IHNldEN1cnJlbnRQcm9wID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJyZW50UHJvcCA9IHNjaGVtYVtjdXJyZW50UHJvcEluZGV4XTtcbiAgICAgICAgY29uc3QgdHlwZSA9IGdldFR5cGUoY3VycmVudFByb3AudHlwZSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY3VycmVudFZhbHVlVGV4dCA9PT0gXCJcIlxuICAgICAgICAgICAgICAgICAgICAgID8gdHlwZS5nZXREZWZhdWx0VmFsdWUoKVxuICAgICAgICAgICAgICAgICAgICAgIDogdHlwZS5zYWZlUGFyc2VWYWx1ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCk7XG4gICAgICAgIGl0ZW1bY3VycmVudFByb3AubmFtZV0gPSB2YWx1ZTtcbiAgICB9O1xuICAgIFxuICAgIHdoaWxlKGN1cnJlbnRQcm9wSW5kZXggPCBzY2hlbWEubGVuZ3RoKSB7XG5cbiAgICAgICAgaWYoY3VycmVudENoYXJJbmRleCA8IHJvd1RleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2hhciA9IHJvd1RleHRbY3VycmVudENoYXJJbmRleF07XG4gICAgICAgICAgICBpZihpc0VzY2FwZWQpIHtcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCJyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCArPSBcIlxcclwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZVRleHQgKz0gY3VycmVudENoYXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlzRXNjYXBlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCIsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0Q3VycmVudFByb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQcm9wSW5kZXgrKztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoY3VycmVudENoYXIgPT09IFwiXFxcXFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzRXNjYXBlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyZW50Q2hhckluZGV4Kys7IFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICBzZXRDdXJyZW50UHJvcCgpO1xuICAgICAgICAgICAgY3VycmVudFByb3BJbmRleCsrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZW07XG59O1xuXG5leHBvcnQgY29uc3Qgc2VyaWFsaXplSXRlbSA9IChzY2hlbWEsIGl0ZW0pICA9PiB7XG5cbiAgICBsZXQgcm93VGV4dCA9IFwiXCJcblxuICAgIGZvcihsZXQgcHJvcCBvZiBzY2hlbWEpIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IGdldFR5cGUocHJvcC50eXBlKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBoYXMocHJvcC5uYW1lKShpdGVtKVxuICAgICAgICAgICAgICAgICAgICAgID8gaXRlbVtwcm9wLm5hbWVdXG4gICAgICAgICAgICAgICAgICAgICAgOiB0eXBlLmdldERlZmF1bHRWYWx1ZSgpXG4gICAgICAgIFxuICAgICAgICBjb25zdCB2YWxTdHIgPSB0eXBlLnN0cmluZ2lmeSh2YWx1ZSk7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHZhbFN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudENoYXIgPSB2YWxTdHJbaV07XG4gICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCIsXCIgXG4gICAgICAgICAgICAgICB8fCBjdXJyZW50Q2hhciA9PT0gXCJcXHJcIiBcbiAgICAgICAgICAgICAgIHx8IGN1cnJlbnRDaGFyID09PSBcIlxcXFxcIikge1xuICAgICAgICAgICAgICAgIHJvd1RleHQgKz0gXCJcXFxcXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcIlxcclwiKSB7XG4gICAgICAgICAgICAgICAgcm93VGV4dCArPSBcInJcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcm93VGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJvd1RleHQgKz0gXCIsXCI7XG4gICAgfVxuXG4gICAgcm93VGV4dCArPSBcIlxcclwiO1xuICAgIHJldHVybiByb3dUZXh0O1xufTsiLCJpbXBvcnQgbHVuciBmcm9tICdsdW5yJztcbmltcG9ydCB7XG4gIGdldEhhc2hDb2RlLFxuICBqb2luS2V5XG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBnZXRBY3R1YWxLZXlPZlBhcmVudCxcbiAgaXNHbG9iYWxJbmRleCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7cHJvbWlzZVJlYWRhYmxlU3RyZWFtfSBmcm9tIFwiLi9wcm9taXNlUmVhZGFibGVTdHJlYW1cIjtcbmltcG9ydCB7IGNyZWF0ZUluZGV4RmlsZSB9IGZyb20gJy4vc2hhcmRpbmcnO1xuaW1wb3J0IHsgZ2VuZXJhdGVTY2hlbWEgfSBmcm9tICcuL2luZGV4U2NoZW1hQ3JlYXRvcic7XG5pbXBvcnQgeyBnZXRJbmRleFJlYWRlciwgQ09OVElOVUVfUkVBRElOR19SRUNPUkRTIH0gZnJvbSAnLi9zZXJpYWxpemVyJztcblxuZXhwb3J0IGNvbnN0IHJlYWRJbmRleCA9IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KSA9PiB7XG4gIGNvbnN0IHJlY29yZHMgPSBbXTtcbiAgY29uc3QgZG9SZWFkID0gaXRlcmF0ZUluZGV4KFxuICAgICAgICBhc3luYyBpdGVtID0+IHtcbiAgICAgIHJlY29yZHMucHVzaChpdGVtKTtcbiAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XG4gICAgfSxcbiAgICAgICAgYXN5bmMgKCkgPT4gcmVjb3Jkc1xuICApO1xuXG4gIHJldHVybiBhd2FpdCBkb1JlYWQoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2VhcmNoSW5kZXggPSBhc3luYyAoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSwgc2VhcmNoUGhyYXNlKSA9PiB7XG4gIGNvbnN0IHJlY29yZHMgPSBbXTtcbiAgY29uc3Qgc2NoZW1hID0gZ2VuZXJhdGVTY2hlbWEoaGllcmFyY2h5LCBpbmRleCk7XG4gIGNvbnN0IGRvUmVhZCA9IGl0ZXJhdGVJbmRleChcbiAgICAgICAgYXN5bmMgaXRlbSA9PiB7XG4gICAgICBjb25zdCBpZHggPSBsdW5yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yZWYoJ2tleScpO1xuICAgICAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIHNjaGVtYSkge1xuICAgICAgICAgIHRoaXMuZmllbGQoZmllbGQubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGQoaXRlbSk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNlYXJjaFJlc3VsdHMgPSBpZHguc2VhcmNoKHNlYXJjaFBocmFzZSk7XG4gICAgICBpZiAoc2VhcmNoUmVzdWx0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaXRlbS5fc2VhcmNoUmVzdWx0ID0gc2VhcmNoUmVzdWx0c1swXTtcbiAgICAgICAgcmVjb3Jkcy5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcbiAgICB9LFxuICAgICAgICBhc3luYyAoKSA9PiByZWNvcmRzXG4gICk7XG5cbiAgcmV0dXJuIGF3YWl0IGRvUmVhZChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleGVkRGF0YUtleV9mcm9tSW5kZXhLZXkgPSAoaW5kZXhLZXkpID0+IFxuICBgJHtpbmRleEtleX0ke2luZGV4S2V5LmVuZHNXaXRoKCcuY3N2JykgPyAnJyA6ICcuY3N2J31gO1xuXG5leHBvcnQgY29uc3QgdW5pcXVlSW5kZXhOYW1lID0gaW5kZXggPT4gYGlkeF8ke1xuICBnZXRIYXNoQ29kZShgJHtpbmRleC5maWx0ZXJ9JHtpbmRleC5tYXB9YClcbn0uY3N2YDtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4ZWREYXRhS2V5ID0gKGRlY2VuZGFudEtleSwgaW5kZXhOb2RlKSA9PiB7XG4gIGlmIChpc0dsb2JhbEluZGV4KGluZGV4Tm9kZSkpIHsgcmV0dXJuIGAke2luZGV4Tm9kZS5ub2RlS2V5KCl9LmNzdmA7IH1cblxuICBjb25zdCBpbmRleGVkRGF0YVBhcmVudEtleSA9IGdldEFjdHVhbEtleU9mUGFyZW50KFxuICAgIGluZGV4Tm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksXG4gICAgZGVjZW5kYW50S2V5LFxuICApO1xuXG4gIGNvbnN0IGluZGV4TmFtZSA9IGluZGV4Tm9kZS5uYW1lXG4gICAgPyBgJHtpbmRleE5vZGUubmFtZX0uY3N2YFxuICAgIDogdW5pcXVlSW5kZXhOYW1lKGluZGV4Tm9kZSk7XG5cbiAgcmV0dXJuIGpvaW5LZXkoXG4gICAgaW5kZXhlZERhdGFQYXJlbnRLZXksXG4gICAgaW5kZXhOYW1lLFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGl0ZXJhdGVJbmRleCA9IChvbkdldEl0ZW0sIGdldEZpbmFsUmVzdWx0KSA9PiBhc3luYyAoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlYWRhYmxlU3RyZWFtID0gcHJvbWlzZVJlYWRhYmxlU3RyZWFtKFxuICAgICAgICBhd2FpdCBkYXRhc3RvcmUucmVhZGFibGVGaWxlU3RyZWFtKGluZGV4ZWREYXRhS2V5KVxuICAgICk7XG5cbiAgICBjb25zdCByZWFkID0gZ2V0SW5kZXhSZWFkZXIoaGllcmFyY2h5LCBpbmRleCwgcmVhZGFibGVTdHJlYW0pO1xuICAgIGF3YWl0IHJlYWQob25HZXRJdGVtKTtcbiAgICByZXR1cm4gZ2V0RmluYWxSZXN1bHQoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGluZGV4ZWREYXRhS2V5KSkge1xuICAgICAgdGhyb3cgZTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgY3JlYXRlSW5kZXhGaWxlKFxuICAgICAgICBkYXRhc3RvcmUsXG4gICAgICAgIGluZGV4ZWREYXRhS2V5LFxuICAgICAgICBpbmRleCxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxufTtcbiIsImltcG9ydCB7IGZsYXR0ZW4sIG1lcmdlIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIHNhZmVLZXksIGFwaVdyYXBwZXIsICQsXG4gIGV2ZW50cywgaXNOb25FbXB0eVN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHJlYWRJbmRleCwgc2VhcmNoSW5kZXggfSBmcm9tICcuLi9pbmRleGluZy9yZWFkJztcbmltcG9ydCB7XG4gIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSxcbiAgZ2V0U2hhcmRLZXlzSW5SYW5nZSxcbn0gZnJvbSAnLi4vaW5kZXhpbmcvc2hhcmRpbmcnO1xuaW1wb3J0IHtcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCwgaXNJbmRleCxcbiAgaXNTaGFyZGVkSW5kZXgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBsaXN0SXRlbXMgPSBhcHAgPT4gYXN5bmMgKGluZGV4S2V5LCBvcHRpb25zKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5pbmRleEFwaS5saXN0SXRlbXMsXG4gIHBlcm1pc3Npb24ucmVhZEluZGV4LmlzQXV0aG9yaXplZChpbmRleEtleSksXG4gIHsgaW5kZXhLZXksIG9wdGlvbnMgfSxcbiAgX2xpc3RJdGVtcywgYXBwLCBpbmRleEtleSwgb3B0aW9ucyxcbik7XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0geyByYW5nZVN0YXJ0UGFyYW1zOiBudWxsLCByYW5nZUVuZFBhcmFtczogbnVsbCwgc2VhcmNoUGhyYXNlOiBudWxsIH07XG5cbmNvbnN0IF9saXN0SXRlbXMgPSBhc3luYyAoYXBwLCBpbmRleEtleSwgb3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zKSA9PiB7XG4gIGNvbnN0IHsgc2VhcmNoUGhyYXNlLCByYW5nZVN0YXJ0UGFyYW1zLCByYW5nZUVuZFBhcmFtcyB9ID0gJCh7fSwgW1xuICAgIG1lcmdlKG9wdGlvbnMpLFxuICAgIG1lcmdlKGRlZmF1bHRPcHRpb25zKSxcbiAgXSk7XG5cbiAgY29uc3QgZ2V0SXRlbXMgPSBhc3luYyBrZXkgPT4gKGlzTm9uRW1wdHlTdHJpbmcoc2VhcmNoUGhyYXNlKVxuICAgID8gYXdhaXQgc2VhcmNoSW5kZXgoXG4gICAgICBhcHAuaGllcmFyY2h5LFxuICAgICAgYXBwLmRhdGFzdG9yZSxcbiAgICAgIGluZGV4Tm9kZSxcbiAgICAgIGtleSxcbiAgICAgIHNlYXJjaFBocmFzZSxcbiAgICApXG4gICAgOiBhd2FpdCByZWFkSW5kZXgoXG4gICAgICBhcHAuaGllcmFyY2h5LFxuICAgICAgYXBwLmRhdGFzdG9yZSxcbiAgICAgIGluZGV4Tm9kZSxcbiAgICAgIGtleSxcbiAgICApKTtcblxuICBpbmRleEtleSA9IHNhZmVLZXkoaW5kZXhLZXkpO1xuICBjb25zdCBpbmRleE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKGluZGV4S2V5KTtcblxuICBpZiAoIWlzSW5kZXgoaW5kZXhOb2RlKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ3N1cHBsaWVkIGtleSBpcyBub3QgYW4gaW5kZXgnKTsgfVxuXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleE5vZGUpKSB7XG4gICAgY29uc3Qgc2hhcmRLZXlzID0gYXdhaXQgZ2V0U2hhcmRLZXlzSW5SYW5nZShcbiAgICAgIGFwcCwgaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zLFxuICAgICk7XG4gICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGsgb2Ygc2hhcmRLZXlzKSB7XG4gICAgICBpdGVtcy5wdXNoKGF3YWl0IGdldEl0ZW1zKGspKTtcbiAgICB9XG4gICAgcmV0dXJuIGZsYXR0ZW4oaXRlbXMpO1xuICB9XG4gIHJldHVybiBhd2FpdCBnZXRJdGVtcyhcbiAgICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXkoaW5kZXhLZXkpLFxuICApO1xufTtcbiIsImltcG9ydCB7IG1hcCwgaXNTdHJpbmcsIGhhcywgc29tZSB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxuICBmaW5kRmllbGQsIGdldE5vZGUsIGlzR2xvYmFsSW5kZXgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBsaXN0SXRlbXMgfSBmcm9tICcuLi9pbmRleEFwaS9saXN0SXRlbXMnO1xuaW1wb3J0IHtcbiAgJCwgYXBpV3JhcHBlclN5bmMsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldEluZGV4S2V5X0Jhc2VkT25EZWNlbmRhbnQgfSBmcm9tICcuLi9pbmRleGluZy9zaGFyZGluZyc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBnZXRDb250ZXh0ID0gYXBwID0+IHJlY29yZEtleSA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMucmVjb3JkQXBpLmdldENvbnRleHQsXG4gIHBlcm1pc3Npb24ucmVhZFJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkS2V5KSxcbiAgeyByZWNvcmRLZXkgfSxcbiAgX2dldENvbnRleHQsIGFwcCwgcmVjb3JkS2V5LFxuKTtcblxuZXhwb3J0IGNvbnN0IF9nZXRDb250ZXh0ID0gKGFwcCwgcmVjb3JkS2V5KSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKHJlY29yZEtleSk7XG5cbiAgY29uc3QgY2FjaGVkUmVmZXJlbmNlSW5kZXhlcyA9IHt9O1xuXG4gIGNvbnN0IGxhenlMb2FkUmVmZXJlbmNlSW5kZXggPSBhc3luYyAodHlwZU9wdGlvbnMpID0+IHtcbiAgICBpZiAoIWhhcyh0eXBlT3B0aW9ucy5pbmRleE5vZGVLZXkpKGNhY2hlZFJlZmVyZW5jZUluZGV4ZXMpKSB7XG4gICAgICBjYWNoZWRSZWZlcmVuY2VJbmRleGVzW3R5cGVPcHRpb25zLmluZGV4Tm9kZUtleV0gPSB7XG4gICAgICAgIHR5cGVPcHRpb25zLFxuICAgICAgICBkYXRhOiBhd2FpdCByZWFkUmVmZXJlbmNlSW5kZXgoXG4gICAgICAgICAgYXBwLCByZWNvcmRLZXksIHR5cGVPcHRpb25zLFxuICAgICAgICApLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2FjaGVkUmVmZXJlbmNlSW5kZXhlc1t0eXBlT3B0aW9ucy5pbmRleE5vZGVLZXldO1xuICB9O1xuXG4gIGNvbnN0IGdldFR5cGVPcHRpb25zID0gdHlwZU9wdGlvbnNfb3JfZmllbGROYW1lID0+IChpc1N0cmluZyh0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUpXG4gICAgPyBmaW5kRmllbGQocmVjb3JkTm9kZSwgdHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKVxuICAgICAgLnR5cGVPcHRpb25zXG4gICAgOiB0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUpO1xuXG4gIHJldHVybiB7XG4gICAgcmVmZXJlbmNlRXhpc3RzOiBhc3luYyAodHlwZU9wdGlvbnNfb3JfZmllbGROYW1lLCBrZXkpID0+IHtcbiAgICAgIGNvbnN0IHR5cGVPcHRpb25zID0gZ2V0VHlwZU9wdGlvbnModHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKTtcbiAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgbGF6eUxvYWRSZWZlcmVuY2VJbmRleCh0eXBlT3B0aW9ucyk7XG4gICAgICByZXR1cm4gc29tZShpID0+IGkua2V5ID09PSBrZXkpKGRhdGEpO1xuICAgIH0sXG4gICAgcmVmZXJlbmNlT3B0aW9uczogYXN5bmMgKHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSkgPT4ge1xuICAgICAgY29uc3QgdHlwZU9wdGlvbnMgPSBnZXRUeXBlT3B0aW9ucyh0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUpO1xuICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBsYXp5TG9hZFJlZmVyZW5jZUluZGV4KHR5cGVPcHRpb25zKTtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0sXG4gICAgcmVjb3JkTm9kZSxcbiAgfTtcbn07XG5cbmNvbnN0IHJlYWRSZWZlcmVuY2VJbmRleCA9IGFzeW5jIChhcHAsIHJlY29yZEtleSwgdHlwZU9wdGlvbnMpID0+IHtcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0Tm9kZShhcHAuaGllcmFyY2h5LCB0eXBlT3B0aW9ucy5pbmRleE5vZGVLZXkpO1xuICBjb25zdCBpbmRleEtleSA9IGlzR2xvYmFsSW5kZXgoaW5kZXhOb2RlKVxuICAgID8gaW5kZXhOb2RlLm5vZGVLZXkoKVxuICAgIDogZ2V0SW5kZXhLZXlfQmFzZWRPbkRlY2VuZGFudChcbiAgICAgIHJlY29yZEtleSwgaW5kZXhOb2RlLFxuICAgICk7XG5cbiAgY29uc3QgaXRlbXMgPSBhd2FpdCBsaXN0SXRlbXMoYXBwKShpbmRleEtleSk7XG4gIHJldHVybiAkKGl0ZW1zLCBbXG4gICAgbWFwKGkgPT4gKHtcbiAgICAgIGtleTogaS5rZXksXG4gICAgICB2YWx1ZTogaVt0eXBlT3B0aW9ucy5kaXNwbGF5VmFsdWVdLFxuICAgIH0pKSxcbiAgXSk7XG59O1xuIiwiaW1wb3J0IHtcbiAgbWFwLCByZWR1Y2UsIGZpbHRlcixcbiAgaXNFbXB0eSwgZmxhdHRlbiwgZWFjaCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IGdldEV4YWN0Tm9kZUZvclBhdGggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgdmFsaWRhdGVGaWVsZFBhcnNlLCB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7ICQsIGlzTm90aGluZywgaXNOb25FbXB0eVN0cmluZyB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBfZ2V0Q29udGV4dCB9IGZyb20gJy4vZ2V0Q29udGV4dCc7XG5cbmNvbnN0IGZpZWxkUGFyc2VFcnJvciA9IChmaWVsZE5hbWUsIHZhbHVlKSA9PiAoe1xuICBmaWVsZHM6IFtmaWVsZE5hbWVdLFxuICBtZXNzYWdlOiBgQ291bGQgbm90IHBhcnNlIGZpZWxkICR7ZmllbGROYW1lfToke3ZhbHVlfWAsXG59KTtcblxuY29uc3QgdmFsaWRhdGVBbGxGaWVsZFBhcnNlID0gKHJlY29yZCwgcmVjb3JkTm9kZSkgPT4gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICBtYXAoZiA9PiAoeyBuYW1lOiBmLm5hbWUsIHBhcnNlUmVzdWx0OiB2YWxpZGF0ZUZpZWxkUGFyc2UoZiwgcmVjb3JkKSB9KSksXG4gIHJlZHVjZSgoZXJyb3JzLCBmKSA9PiB7XG4gICAgaWYgKGYucGFyc2VSZXN1bHQuc3VjY2VzcykgcmV0dXJuIGVycm9ycztcbiAgICBlcnJvcnMucHVzaChcbiAgICAgIGZpZWxkUGFyc2VFcnJvcihmLm5hbWUsIGYucGFyc2VSZXN1bHQudmFsdWUpLFxuICAgICk7XG4gICAgcmV0dXJuIGVycm9ycztcbiAgfSwgW10pLFxuXSk7XG5cbmNvbnN0IHZhbGlkYXRlQWxsVHlwZUNvbnN0cmFpbnRzID0gYXN5bmMgKHJlY29yZCwgcmVjb3JkTm9kZSwgY29udGV4dCkgPT4ge1xuICBjb25zdCBlcnJvcnMgPSBbXTtcbiAgZm9yIChjb25zdCBmaWVsZCBvZiByZWNvcmROb2RlLmZpZWxkcykge1xuICAgICQoYXdhaXQgdmFsaWRhdGVUeXBlQ29uc3RyYWludHMoZmllbGQsIHJlY29yZCwgY29udGV4dCksIFtcbiAgICAgIGZpbHRlcihpc05vbkVtcHR5U3RyaW5nKSxcbiAgICAgIG1hcChtID0+ICh7IG1lc3NhZ2U6IG0sIGZpZWxkczogW2ZpZWxkLm5hbWVdIH0pKSxcbiAgICAgIGVhY2goZSA9PiBlcnJvcnMucHVzaChlKSksXG4gICAgXSk7XG4gIH1cbiAgcmV0dXJuIGVycm9ycztcbn07XG5cbmNvbnN0IHJ1blJlY29yZFZhbGlkYXRpb25SdWxlcyA9IChyZWNvcmQsIHJlY29yZE5vZGUpID0+IHtcbiAgY29uc3QgcnVuVmFsaWRhdGlvblJ1bGUgPSAocnVsZSkgPT4ge1xuICAgIGNvbnN0IGlzVmFsaWQgPSBjb21waWxlRXhwcmVzc2lvbihydWxlLmV4cHJlc3Npb25XaGVuVmFsaWQpO1xuICAgIGNvbnN0IGV4cHJlc3Npb25Db250ZXh0ID0geyByZWNvcmQsIF8gfTtcbiAgICByZXR1cm4gKGlzVmFsaWQoZXhwcmVzc2lvbkNvbnRleHQpXG4gICAgICA/IHsgdmFsaWQ6IHRydWUgfVxuICAgICAgOiAoe1xuICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgIGZpZWxkczogcnVsZS5pbnZhbGlkRmllbGRzLFxuICAgICAgICBtZXNzYWdlOiBydWxlLm1lc3NhZ2VXaGVuSW52YWxpZCxcbiAgICAgIH0pKTtcbiAgfTtcblxuICByZXR1cm4gJChyZWNvcmROb2RlLnZhbGlkYXRpb25SdWxlcywgW1xuICAgIG1hcChydW5WYWxpZGF0aW9uUnVsZSksXG4gICAgZmxhdHRlbixcbiAgICBmaWx0ZXIociA9PiByLnZhbGlkID09PSBmYWxzZSksXG4gICAgbWFwKHIgPT4gKHsgZmllbGRzOiByLmZpZWxkcywgbWVzc2FnZTogci5tZXNzYWdlIH0pKSxcbiAgXSk7XG59O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGUgPSBhcHAgPT4gYXN5bmMgKHJlY29yZCwgY29udGV4dCkgPT4ge1xuICBjb250ZXh0ID0gaXNOb3RoaW5nKGNvbnRleHQpXG4gICAgPyBfZ2V0Q29udGV4dChhcHAsIHJlY29yZC5rZXkpXG4gICAgOiBjb250ZXh0O1xuXG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKHJlY29yZC5rZXkpO1xuICBjb25zdCBmaWVsZFBhcnNlRmFpbHMgPSB2YWxpZGF0ZUFsbEZpZWxkUGFyc2UocmVjb3JkLCByZWNvcmROb2RlKTtcblxuICAvLyBub24gcGFyc2luZyB3b3VsZCBjYXVzZSBmdXJ0aGVyIGlzc3VlcyAtIGV4aXQgaGVyZVxuICBpZiAoIWlzRW1wdHkoZmllbGRQYXJzZUZhaWxzKSkgeyByZXR1cm4gKHsgaXNWYWxpZDogZmFsc2UsIGVycm9yczogZmllbGRQYXJzZUZhaWxzIH0pOyB9XG5cbiAgY29uc3QgcmVjb3JkVmFsaWRhdGlvblJ1bGVGYWlscyA9IHJ1blJlY29yZFZhbGlkYXRpb25SdWxlcyhyZWNvcmQsIHJlY29yZE5vZGUpO1xuICBjb25zdCB0eXBlQ29udHJhaW50RmFpbHMgPSBhd2FpdCB2YWxpZGF0ZUFsbFR5cGVDb25zdHJhaW50cyhyZWNvcmQsIHJlY29yZE5vZGUsIGNvbnRleHQpO1xuXG4gIGlmIChpc0VtcHR5KGZpZWxkUGFyc2VGYWlscylcbiAgICAgICAmJiBpc0VtcHR5KHJlY29yZFZhbGlkYXRpb25SdWxlRmFpbHMpXG4gICAgICAgJiYgaXNFbXB0eSh0eXBlQ29udHJhaW50RmFpbHMpKSB7XG4gICAgcmV0dXJuICh7IGlzVmFsaWQ6IHRydWUsIGVycm9yczogW10gfSk7XG4gIH1cblxuICByZXR1cm4gKHtcbiAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICBlcnJvcnM6IF8udW5pb24oZmllbGRQYXJzZUZhaWxzLCB0eXBlQ29udHJhaW50RmFpbHMsIHJlY29yZFZhbGlkYXRpb25SdWxlRmFpbHMpLFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBpc0NvbGxlY3Rpb25SZWNvcmQsXG4gIGlzUm9vdCxcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7ICQsIGFsbFRydWUsIGpvaW5LZXkgfSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBlbnN1cmVDb2xsZWN0aW9uSXNJbml0aWFsaXNlZCA9IGFzeW5jIChkYXRhc3RvcmUsIG5vZGUsIHBhcmVudEtleSkgPT4ge1xuICBpZiAoIWF3YWl0IGRhdGFzdG9yZS5leGlzdHMocGFyZW50S2V5KSkge1xuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIocGFyZW50S2V5KTtcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKFxuICAgICAgam9pbktleShwYXJlbnRLZXksICdhbGxpZHMnKSxcbiAgICApO1xuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoXG4gICAgICBqb2luS2V5KFxuICAgICAgICBwYXJlbnRLZXksXG4gICAgICAgICdhbGxpZHMnLFxuICAgICAgICBub2RlLm5vZGVJZC50b1N0cmluZygpLFxuICAgICAgKSxcbiAgICApO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgaW5pdGlhbGlzZVJvb3RDb2xsZWN0aW9ucyA9IGFzeW5jIChkYXRhc3RvcmUsIGhpZXJhcmNoeSkgPT4ge1xuICBjb25zdCByb290Q29sbGVjdGlvblJlY29yZCA9IGFsbFRydWUoXG4gICAgbiA9PiBpc1Jvb3Qobi5wYXJlbnQoKSksXG4gICAgaXNDb2xsZWN0aW9uUmVjb3JkLFxuICApO1xuXG4gIGNvbnN0IGZsYXRoaWVyYXJjaHkgPSBnZXRGbGF0dGVuZWRIaWVyYXJjaHkoaGllcmFyY2h5KTtcblxuICBjb25zdCBjb2xsZWN0aW9uUmVjb3JkcyA9ICQoZmxhdGhpZXJhcmNoeSwgW1xuICAgIGZpbHRlcihyb290Q29sbGVjdGlvblJlY29yZCksXG4gIF0pO1xuXG4gIGZvciAoY29uc3QgY29sIG9mIGNvbGxlY3Rpb25SZWNvcmRzKSB7XG4gICAgYXdhaXQgZW5zdXJlQ29sbGVjdGlvbklzSW5pdGlhbGlzZWQoXG4gICAgICBkYXRhc3RvcmUsXG4gICAgICBjb2wsXG4gICAgICBjb2wuY29sbGVjdGlvblBhdGhSZWd4KCksXG4gICAgKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxpc2VDaGlsZENvbGxlY3Rpb25zID0gYXN5bmMgKGFwcCwgcmVjb3JkS2V5KSA9PiB7XG4gIGNvbnN0IGNoaWxkQ29sbGVjdGlvblJlY29yZHMgPSAkKHJlY29yZEtleSwgW1xuICAgIGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSksXG4gICAgbiA9PiBuLmNoaWxkcmVuLFxuICAgIGZpbHRlcihpc0NvbGxlY3Rpb25SZWNvcmQpLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkQ29sbGVjdGlvblJlY29yZHMpIHtcbiAgICBhd2FpdCBlbnN1cmVDb2xsZWN0aW9uSXNJbml0aWFsaXNlZChcbiAgICAgIGFwcC5kYXRhc3RvcmUsXG4gICAgICBjaGlsZCxcbiAgICAgIGpvaW5LZXkocmVjb3JkS2V5LCBjaGlsZC5jb2xsZWN0aW9uTmFtZSksXG4gICAgKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIGpvaW4sIHB1bGwsXG4gIG1hcCwgZmxhdHRlbiwgb3JkZXJCeSxcbiAgZmlsdGVyLCBmaW5kLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgZ2V0UGFyZW50S2V5LFxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGdldENvbGxlY3Rpb25Ob2RlQnlLZXlPck5vZGVLZXksIGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aCxcbiAgaXNDb2xsZWN0aW9uUmVjb3JkLCBpc0FuY2VzdG9yLFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgam9pbktleSwgc2FmZUtleSwgJCB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmNvbnN0IGFsbElkQ2hhcnMgPSAnMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpfLSc7XG5cbmNvbnN0IGFsbElkc1N0cmluZ3NGb3JGYWN0b3IgPSAoY29sbGVjdGlvbk5vZGUpID0+IHtcbiAgY29uc3QgZmFjdG9yID0gY29sbGVjdGlvbk5vZGUuYWxsaWRzU2hhcmRGYWN0b3I7XG4gIGNvbnN0IGNoYXJSYW5nZVBlclNoYXJkID0gNjQgLyBmYWN0b3I7XG4gIGNvbnN0IGFsbElkU3RyaW5ncyA9IFtdO1xuICBsZXQgaW5kZXggPSAwO1xuICBsZXQgY3VycmVudElkc1NoYXJkID0gJyc7XG4gIHdoaWxlIChpbmRleCA8IDY0KSB7XG4gICAgY3VycmVudElkc1NoYXJkICs9IGFsbElkQ2hhcnNbaW5kZXhdO1xuICAgIGlmICgoaW5kZXggKyAxKSAlIGNoYXJSYW5nZVBlclNoYXJkID09PSAwKSB7XG4gICAgICBhbGxJZFN0cmluZ3MucHVzaChjdXJyZW50SWRzU2hhcmQpO1xuICAgICAgY3VycmVudElkc1NoYXJkID0gJyc7XG4gICAgfVxuICAgIGluZGV4Kys7XG4gIH1cblxuICByZXR1cm4gYWxsSWRTdHJpbmdzO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEFsbElkc1NoYXJkTmFtZXMgPSAoYXBwSGllcmFyY2h5LCBjb2xsZWN0aW9uS2V5KSA9PiB7XG4gIGNvbnN0IGNvbGxlY3Rpb25SZWNvcmROb2RlID0gZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoKGFwcEhpZXJhcmNoeSkoY29sbGVjdGlvbktleSk7XG4gIHJldHVybiAkKGNvbGxlY3Rpb25SZWNvcmROb2RlLCBbXG4gICAgYyA9PiBbYy5ub2RlSWRdLFxuICAgIG1hcChpID0+IG1hcChjID0+IF9hbGxJZHNTaGFyZEtleShjb2xsZWN0aW9uS2V5LCBpLCBjKSkoYWxsSWRzU3RyaW5nc0ZvckZhY3Rvcihjb2xsZWN0aW9uUmVjb3JkTm9kZSkpKSxcbiAgICBmbGF0dGVuLFxuICBdKTtcbn07XG5cbmNvbnN0IF9hbGxJZHNTaGFyZEtleSA9IChjb2xsZWN0aW9uS2V5LCBjaGlsZE5vLCBzaGFyZEtleSkgPT4gam9pbktleShcbiAgY29sbGVjdGlvbktleSxcbiAgJ2FsbGlkcycsXG4gIGNoaWxkTm8sXG4gIHNoYXJkS2V5LFxuKTtcblxuZXhwb3J0IGNvbnN0IGdldEFsbElkc1NoYXJkS2V5ID0gKGFwcEhpZXJhcmNoeSwgY29sbGVjdGlvbktleSwgcmVjb3JkSWQpID0+IHtcbiAgY29uc3QgaW5kZXhPZkZpcnN0RGFzaCA9IHJlY29yZElkLmluZGV4T2YoJy0nKTtcblxuICBjb25zdCBjb2xsZWN0aW9uTm9kZSA9IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHBIaWVyYXJjaHkpKGNvbGxlY3Rpb25LZXkpO1xuXG4gIGNvbnN0IGlkRmlyc3RDaGFyID0gcmVjb3JkSWRbaW5kZXhPZkZpcnN0RGFzaCArIDFdO1xuICBjb25zdCBhbGxJZHNTaGFyZElkID0gJChjb2xsZWN0aW9uTm9kZSwgW1xuICAgIGFsbElkc1N0cmluZ3NGb3JGYWN0b3IsXG4gICAgZmluZChpID0+IGkuaW5jbHVkZXMoaWRGaXJzdENoYXIpKSxcbiAgXSk7XG5cbiAgcmV0dXJuIF9hbGxJZHNTaGFyZEtleShcbiAgICBjb2xsZWN0aW9uS2V5LFxuICAgIHJlY29yZElkLnNsaWNlKDAsIGluZGV4T2ZGaXJzdERhc2gpLFxuICAgIGFsbElkc1NoYXJkSWQsXG4gICk7XG59O1xuXG5jb25zdCBnZXRPckNyZWF0ZVNoYXJkRmlsZSA9IGFzeW5jIChkYXRhc3RvcmUsIGFsbElkc0tleSkgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCBkYXRhc3RvcmUubG9hZEZpbGUoYWxsSWRzS2V5KTtcbiAgfSBjYXRjaCAoZUxvYWQpIHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZpbGUoYWxsSWRzS2V5LCAnJyk7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSBjYXRjaCAoZUNyZWF0ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgRXJyb3IgbG9hZGluZywgdGhlbiBjcmVhdGluZyBhbGxJZHMgJHthbGxJZHNLZXlcbiAgICAgICAgfSA6IExPQUQgOiAke2VMb2FkLm1lc3NhZ2VcbiAgICAgICAgfSA6IENSRUFURSA6ICR7ZUNyZWF0ZX1gLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IGdldFNoYXJkRmlsZSA9IGFzeW5jIChkYXRhc3RvcmUsIGFsbElkc0tleSkgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCBkYXRhc3RvcmUubG9hZEZpbGUoYWxsSWRzS2V5KTtcbiAgfSBjYXRjaCAoZUxvYWQpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBhZGRUb0FsbElkcyA9IChhcHBIaWVyYXJjaHksIGRhdGFzdG9yZSkgPT4gYXN5bmMgKHJlY29yZCkgPT4ge1xuICBjb25zdCBhbGxJZHNLZXkgPSBnZXRBbGxJZHNTaGFyZEtleShcbiAgICBhcHBIaWVyYXJjaHksXG4gICAgZ2V0UGFyZW50S2V5KHJlY29yZC5rZXkpLFxuICAgIHJlY29yZC5pZCxcbiAgKTtcblxuICBsZXQgYWxsSWRzID0gYXdhaXQgZ2V0T3JDcmVhdGVTaGFyZEZpbGUoZGF0YXN0b3JlLCBhbGxJZHNLZXkpO1xuXG4gIGFsbElkcyArPSBgJHthbGxJZHMubGVuZ3RoID4gMCA/ICcsJyA6ICcnfSR7cmVjb3JkLmlkfWA7XG5cbiAgYXdhaXQgZGF0YXN0b3JlLnVwZGF0ZUZpbGUoYWxsSWRzS2V5LCBhbGxJZHMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEFsbElkc0l0ZXJhdG9yID0gYXBwID0+IGFzeW5jIChjb2xsZWN0aW9uX0tleV9vcl9Ob2RlS2V5KSA9PiB7XG4gIGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXkgPSBzYWZlS2V5KGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXkpO1xuICBjb25zdCB0YXJnZXROb2RlID0gZ2V0Q29sbGVjdGlvbk5vZGVCeUtleU9yTm9kZUtleShcbiAgICBhcHAuaGllcmFyY2h5LFxuICAgIGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXksXG4gICk7XG5cbiAgY29uc3QgZ2V0QWxsSWRzSXRlcmF0b3JGb3JDb2xsZWN0aW9uS2V5ID0gYXN5bmMgKGNvbGxlY3Rpb25LZXkpID0+IHtcbiAgICBjb25zdCBhbGxfYWxsSWRzS2V5cyA9IGdldEFsbElkc1NoYXJkTmFtZXMoYXBwLmhpZXJhcmNoeSwgY29sbGVjdGlvbktleSk7XG4gICAgbGV0IHNoYXJkSW5kZXggPSAwO1xuXG4gICAgY29uc3QgYWxsSWRzRnJvbVNoYXJkSXRlcmF0b3IgPSBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoc2hhcmRJbmRleCA9PT0gYWxsX2FsbElkc0tleXMubGVuZ3RoKSB7IHJldHVybiAoeyBkb25lOiB0cnVlLCByZXN1bHQ6IHsgaWRzOiBbXSwgY29sbGVjdGlvbktleSB9IH0pOyB9XG5cbiAgICAgIGNvbnN0IHNoYXJkS2V5ID0gYWxsX2FsbElkc0tleXNbc2hhcmRJbmRleF07XG5cbiAgICAgIGNvbnN0IGFsbElkcyA9IGF3YWl0IGdldEFsbElkc0Zyb21TaGFyZChhcHAuZGF0YXN0b3JlLCBzaGFyZEtleSk7XG5cbiAgICAgIHNoYXJkSW5kZXgrKztcblxuICAgICAgcmV0dXJuICh7XG4gICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgIGlkczogYWxsSWRzLFxuICAgICAgICAgIGNvbGxlY3Rpb25LZXksXG4gICAgICAgIH0sXG4gICAgICAgIGRvbmU6IGZhbHNlLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiBhbGxJZHNGcm9tU2hhcmRJdGVyYXRvcjtcbiAgfTtcblxuICBjb25zdCBhbmNlc3RvcnMgPSAkKGdldEZsYXR0ZW5lZEhpZXJhcmNoeShhcHAuaGllcmFyY2h5KSwgW1xuICAgIGZpbHRlcihpc0NvbGxlY3Rpb25SZWNvcmQpLFxuICAgIGZpbHRlcihuID0+IGlzQW5jZXN0b3IodGFyZ2V0Tm9kZSkobilcbiAgICAgICAgICAgICAgICAgICAgfHwgbi5ub2RlS2V5KCkgPT09IHRhcmdldE5vZGUubm9kZUtleSgpKSxcbiAgICBvcmRlckJ5KFtuID0+IG4ubm9kZUtleSgpLmxlbmd0aF0sIFsnYXNjJ10pLFxuICBdKTsgLy8gcGFyZW50cyBmaXJzdFxuXG4gIGNvbnN0IHRyYXZlcnNlRm9ySXRlcmF0ZXJhdG9ycyA9IGFzeW5jIChwYXJlbnRSZWNvcmRLZXkgPSAnJywgY3VycmVudE5vZGVJbmRleCA9IDApID0+IHtcbiAgICBjb25zdCBjdXJyZW50Tm9kZSA9IGFuY2VzdG9yc1tjdXJyZW50Tm9kZUluZGV4XTtcbiAgICBjb25zdCBjdXJyZW50Q29sbGVjdGlvbktleSA9IGpvaW5LZXkoXG4gICAgICBwYXJlbnRSZWNvcmRLZXksXG4gICAgICBjdXJyZW50Tm9kZS5jb2xsZWN0aW9uTmFtZSxcbiAgICApO1xuICAgIGlmIChjdXJyZW50Tm9kZS5ub2RlS2V5KCkgPT09IHRhcmdldE5vZGUubm9kZUtleSgpKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvckZvckNvbGxlY3Rpb25LZXkoXG4gICAgICAgICAgY3VycmVudENvbGxlY3Rpb25LZXksXG4gICAgICAgICldO1xuICAgIH1cbiAgICBjb25zdCBhbGxJdGVyYXRvcnMgPSBbXTtcbiAgICBjb25zdCBjdXJyZW50SXRlcmF0b3IgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvckZvckNvbGxlY3Rpb25LZXkoXG4gICAgICBjdXJyZW50Q29sbGVjdGlvbktleSxcbiAgICApO1xuXG4gICAgbGV0IGlkcyA9IGF3YWl0IGN1cnJlbnRJdGVyYXRvcigpO1xuICAgIHdoaWxlIChpZHMuZG9uZSA9PT0gZmFsc2UpIHtcbiAgICAgIGZvciAoY29uc3QgaWQgb2YgaWRzLnJlc3VsdC5pZHMpIHtcbiAgICAgICAgYWxsSXRlcmF0b3JzLnB1c2goXG4gICAgICAgICAgYXdhaXQgdHJhdmVyc2VGb3JJdGVyYXRlcmF0b3JzKFxuICAgICAgICAgICAgam9pbktleShjdXJyZW50Q29sbGVjdGlvbktleSwgaWQpLFxuICAgICAgICAgICAgY3VycmVudE5vZGVJbmRleCArIDEsXG4gICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWRzID0gYXdhaXQgY3VycmVudEl0ZXJhdG9yKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZsYXR0ZW4oYWxsSXRlcmF0b3JzKTtcbiAgfTtcblxuICBjb25zdCBpdGVyYXRvcnNBcnJheSA9IGF3YWl0IHRyYXZlcnNlRm9ySXRlcmF0ZXJhdG9ycygpO1xuICBsZXQgY3VycmVudEl0ZXJhdG9ySW5kZXggPSAwO1xuICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuICAgIGlmIChpdGVyYXRvcnNBcnJheS5sZW5ndGggPT09IDApIHsgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgcmVzdWx0OiBbXSB9OyB9XG4gICAgY29uc3QgaW5uZXJSZXN1bHQgPSBhd2FpdCBpdGVyYXRvcnNBcnJheVtjdXJyZW50SXRlcmF0b3JJbmRleF0oKTtcbiAgICBpZiAoIWlubmVyUmVzdWx0LmRvbmUpIHsgcmV0dXJuIGlubmVyUmVzdWx0OyB9XG4gICAgaWYgKGN1cnJlbnRJdGVyYXRvckluZGV4ID09IGl0ZXJhdG9yc0FycmF5Lmxlbmd0aCAtIDEpIHtcbiAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHJlc3VsdDogaW5uZXJSZXN1bHQucmVzdWx0IH07XG4gICAgfVxuICAgIGN1cnJlbnRJdGVyYXRvckluZGV4Kys7XG4gICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHJlc3VsdDogaW5uZXJSZXN1bHQucmVzdWx0IH07XG4gIH07XG59O1xuXG5jb25zdCBnZXRBbGxJZHNGcm9tU2hhcmQgPSBhc3luYyAoZGF0YXN0b3JlLCBzaGFyZEtleSkgPT4ge1xuICBjb25zdCBhbGxJZHNTdHIgPSBhd2FpdCBnZXRTaGFyZEZpbGUoZGF0YXN0b3JlLCBzaGFyZEtleSk7XG5cbiAgY29uc3QgYWxsSWRzID0gW107XG4gIGxldCBjdXJyZW50SWQgPSAnJztcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxJZHNTdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjdXJyZW50Q2hhciA9IGFsbElkc1N0ci5jaGFyQXQoaSk7XG4gICAgY29uc3QgaXNMYXN0ID0gKGkgPT09IGFsbElkc1N0ci5sZW5ndGggLSAxKTtcbiAgICBpZiAoY3VycmVudENoYXIgPT09ICcsJyB8fCBpc0xhc3QpIHtcbiAgICAgIGlmIChpc0xhc3QpIGN1cnJlbnRJZCArPSBjdXJyZW50Q2hhcjtcbiAgICAgIGFsbElkcy5wdXNoKGN1cnJlbnRJZCk7XG4gICAgICBjdXJyZW50SWQgPSAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudElkICs9IGN1cnJlbnRDaGFyO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYWxsSWRzO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlbW92ZUZyb21BbGxJZHMgPSAoYXBwSGllcmFyY2h5LCBkYXRhc3RvcmUpID0+IGFzeW5jIChyZWNvcmQpID0+IHtcbiAgY29uc3Qgc2hhcmRLZXkgPSBnZXRBbGxJZHNTaGFyZEtleShcbiAgICBhcHBIaWVyYXJjaHksXG4gICAgZ2V0UGFyZW50S2V5KHJlY29yZC5rZXkpLFxuICAgIHJlY29yZC5pZCxcbiAgKTtcbiAgY29uc3QgYWxsSWRzID0gYXdhaXQgZ2V0QWxsSWRzRnJvbVNoYXJkKGRhdGFzdG9yZSwgc2hhcmRLZXkpO1xuXG4gIGNvbnN0IG5ld0lkcyA9ICQoYWxsSWRzLCBbXG4gICAgcHVsbChyZWNvcmQuaWQpLFxuICAgIGpvaW4oJywnKSxcbiAgXSk7XG5cbiAgYXdhaXQgZGF0YXN0b3JlLnVwZGF0ZUZpbGUoc2hhcmRLZXksIG5ld0lkcyk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRBbGxJZHNJdGVyYXRvcjtcbiIsImltcG9ydCB7XG4gIGpvaW5LZXksIGtleVNlcCwgZ2V0SGFzaENvZGUsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXRMYXN0UGFydEluS2V5IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcblxuZXhwb3J0IGNvbnN0IFRSQU5TQUNUSU9OU19GT0xERVIgPSBgJHtrZXlTZXB9LnRyYW5zYWN0aW9uc2A7XG5leHBvcnQgY29uc3QgTE9DS19GSUxFTkFNRSA9ICdsb2NrJztcbmV4cG9ydCBjb25zdCBMT0NLX0ZJTEVfS0VZID0gam9pbktleShcbiAgVFJBTlNBQ1RJT05TX0ZPTERFUiwgTE9DS19GSUxFTkFNRSxcbik7XG5leHBvcnQgY29uc3QgaWRTZXAgPSAnJCc7XG5cbmNvbnN0IGlzT2ZUeXBlID0gdHlwID0+IHRyYW5zID0+IHRyYW5zLnRyYW5zYWN0aW9uVHlwZSA9PT0gdHlwO1xuXG5leHBvcnQgY29uc3QgQ1JFQVRFX1JFQ09SRF9UUkFOU0FDVElPTiA9ICdjcmVhdGUnO1xuZXhwb3J0IGNvbnN0IFVQREFURV9SRUNPUkRfVFJBTlNBQ1RJT04gPSAndXBkYXRlJztcbmV4cG9ydCBjb25zdCBERUxFVEVfUkVDT1JEX1RSQU5TQUNUSU9OID0gJ2RlbGV0ZSc7XG5leHBvcnQgY29uc3QgQlVJTERfSU5ERVhfVFJBTlNBQ1RJT04gPSAnYnVpbGQnO1xuXG5leHBvcnQgY29uc3QgaXNVcGRhdGUgPSBpc09mVHlwZShVUERBVEVfUkVDT1JEX1RSQU5TQUNUSU9OKTtcbmV4cG9ydCBjb25zdCBpc0RlbGV0ZSA9IGlzT2ZUeXBlKERFTEVURV9SRUNPUkRfVFJBTlNBQ1RJT04pO1xuZXhwb3J0IGNvbnN0IGlzQ3JlYXRlID0gaXNPZlR5cGUoQ1JFQVRFX1JFQ09SRF9UUkFOU0FDVElPTik7XG5leHBvcnQgY29uc3QgaXNCdWlsZEluZGV4ID0gaXNPZlR5cGUoQlVJTERfSU5ERVhfVFJBTlNBQ1RJT04pO1xuXG5leHBvcnQgY29uc3Qga2V5VG9Gb2xkZXJOYW1lID0gbm9kZUtleSA9PiBnZXRIYXNoQ29kZShub2RlS2V5KTtcblxuZXhwb3J0IGNvbnN0IGdldFRyYW5zYWN0aW9uSWQgPSAocmVjb3JkSWQsIHRyYW5zYWN0aW9uVHlwZSwgdW5pcXVlSWQpID0+IFxuICBgJHtyZWNvcmRJZH0ke2lkU2VwfSR7dHJhbnNhY3Rpb25UeXBlfSR7aWRTZXB9JHt1bmlxdWVJZH1gO1xuXG5leHBvcnQgY29uc3QgYnVpbGRJbmRleEZvbGRlciA9ICcuQlVJTEQtJztcbmV4cG9ydCBjb25zdCBub2RlS2V5SGFzaEZyb21CdWlsZEZvbGRlciA9IGZvbGRlciA9PiBmb2xkZXIucmVwbGFjZShidWlsZEluZGV4Rm9sZGVyLCAnJyk7XG5cbmV4cG9ydCBjb25zdCBpc0J1aWxkSW5kZXhGb2xkZXIgPSBrZXkgPT4gZ2V0TGFzdFBhcnRJbktleShrZXkpLnN0YXJ0c1dpdGgoYnVpbGRJbmRleEZvbGRlcik7XG5cbmV4cG9ydCBjb25zdCBJbmRleE5vZGVLZXlGb2xkZXIgPSBpbmRleE5vZGVLZXkgPT4gam9pbktleShcbiAgVFJBTlNBQ1RJT05TX0ZPTERFUixcbiAgYnVpbGRJbmRleEZvbGRlciArIGtleVRvRm9sZGVyTmFtZShpbmRleE5vZGVLZXkpLFxuKTtcblxuZXhwb3J0IGNvbnN0IEluZGV4Tm9kZUtleUJhdGNoRm9sZGVyID0gKGluZGV4Tm9kZUtleSwgY291bnQpID0+IFxuICBqb2luS2V5KEluZGV4Tm9kZUtleUZvbGRlcihpbmRleE5vZGVLZXkpLCBNYXRoLmZsb29yKGNvdW50IC8gQlVJTERJTkRFWF9CQVRDSF9DT1VOVCkudG9TdHJpbmcoKSk7XG5cbmV4cG9ydCBjb25zdCBJbmRleFNoYXJkS2V5Rm9sZGVyID0gKGluZGV4Tm9kZUtleSwgaW5kZXhTaGFyZEtleSkgPT4gXG4gIGpvaW5LZXkoSW5kZXhOb2RlS2V5Rm9sZGVyKGluZGV4Tm9kZUtleSksIGluZGV4U2hhcmRLZXkpO1xuXG5leHBvcnQgY29uc3QgQlVJTERJTkRFWF9CQVRDSF9DT1VOVCA9IDEwMDA7XG5leHBvcnQgY29uc3QgdGltZW91dE1pbGxpc2Vjb25kcyA9IDMwICogMTAwMDsgLy8gMzAgc2Vjc1xuZXhwb3J0IGNvbnN0IG1heExvY2tSZXRyaWVzID0gMTtcbiIsImltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnc2hvcnRpZCc7XG5pbXBvcnQgeyBqb2luS2V5IH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldExhc3RQYXJ0SW5LZXkgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHtcbiAgSW5kZXhOb2RlS2V5Rm9sZGVyLCBCVUlMRElOREVYX0JBVENIX0NPVU5ULFxuICBJbmRleE5vZGVLZXlCYXRjaEZvbGRlciwgVFJBTlNBQ1RJT05TX0ZPTERFUiwgZ2V0VHJhbnNhY3Rpb25JZCwgQ1JFQVRFX1JFQ09SRF9UUkFOU0FDVElPTiwgVVBEQVRFX1JFQ09SRF9UUkFOU0FDVElPTixcbiAgREVMRVRFX1JFQ09SRF9UUkFOU0FDVElPTiwgQlVJTERfSU5ERVhfVFJBTlNBQ1RJT04sXG59IGZyb20gJy4vdHJhbnNhY3Rpb25zQ29tbW9uJztcblxuXG5leHBvcnQgY29uc3QgdHJhbnNhY3Rpb25Gb3JDcmVhdGVSZWNvcmQgPSBhc3luYyAoYXBwLCByZWNvcmQpID0+IGF3YWl0IHRyYW5zYWN0aW9uKFxuICBhcHAuZGF0YXN0b3JlLCBDUkVBVEVfUkVDT1JEX1RSQU5TQUNUSU9OLFxuICByZWNvcmQua2V5LCB7IHJlY29yZCB9LFxuICBnZXRUcmFuc2FjdGlvbktleV9SZWNvcmRzLFxuKTtcblxuZXhwb3J0IGNvbnN0IHRyYW5zYWN0aW9uRm9yVXBkYXRlUmVjb3JkID0gYXN5bmMgKGFwcCwgb2xkUmVjb3JkLCBuZXdSZWNvcmQpID0+IGF3YWl0IHRyYW5zYWN0aW9uKFxuICBhcHAuZGF0YXN0b3JlLCBVUERBVEVfUkVDT1JEX1RSQU5TQUNUSU9OLFxuICBuZXdSZWNvcmQua2V5LCB7IG9sZFJlY29yZCwgcmVjb3JkOiBuZXdSZWNvcmQgfSxcbiAgZ2V0VHJhbnNhY3Rpb25LZXlfUmVjb3Jkcyxcbik7XG5cbmV4cG9ydCBjb25zdCB0cmFuc2FjdGlvbkZvckRlbGV0ZVJlY29yZCA9IGFzeW5jIChhcHAsIHJlY29yZCkgPT4gYXdhaXQgdHJhbnNhY3Rpb24oXG4gIGFwcC5kYXRhc3RvcmUsIERFTEVURV9SRUNPUkRfVFJBTlNBQ1RJT04sXG4gIHJlY29yZC5rZXksIHsgcmVjb3JkIH0sXG4gIGdldFRyYW5zYWN0aW9uS2V5X1JlY29yZHMsXG4pO1xuXG5leHBvcnQgY29uc3QgdHJhbnNhY3Rpb25Gb3JCdWlsZEluZGV4ID0gYXN5bmMgKGFwcCwgaW5kZXhOb2RlS2V5LCByZWNvcmRLZXksIGNvdW50KSA9PiB7XG4gIGNvbnN0IHRyYW5zYWN0aW9uRm9sZGVyID0gSW5kZXhOb2RlS2V5QmF0Y2hGb2xkZXIoaW5kZXhOb2RlS2V5LCBjb3VudCk7XG4gIGlmIChjb3VudCAlIEJVSUxESU5ERVhfQkFUQ0hfQ09VTlQgPT09IDApIHtcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcih0cmFuc2FjdGlvbkZvbGRlcik7XG4gIH1cblxuICByZXR1cm4gYXdhaXQgdHJhbnNhY3Rpb24oXG4gICAgYXBwLmRhdGFzdG9yZSwgQlVJTERfSU5ERVhfVFJBTlNBQ1RJT04sXG4gICAgcmVjb3JkS2V5LCB7IHJlY29yZEtleSB9LFxuICAgIGlkID0+IGpvaW5LZXkodHJhbnNhY3Rpb25Gb2xkZXIsIGlkKSxcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVCdWlsZEluZGV4Rm9sZGVyID0gYXN5bmMgKGRhdGFzdG9yZSwgaW5kZXhOb2RlS2V5KSA9PiBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKFxuICBJbmRleE5vZGVLZXlGb2xkZXIoaW5kZXhOb2RlS2V5KSxcbik7XG5cbmNvbnN0IGdldFRyYW5zYWN0aW9uS2V5X1JlY29yZHMgPSBpZCA9PiBqb2luS2V5KFRSQU5TQUNUSU9OU19GT0xERVIsIGlkKTtcblxuY29uc3QgdHJhbnNhY3Rpb24gPSBhc3luYyAoZGF0YXN0b3JlLCB0cmFuc2FjdGlvblR5cGUsIHJlY29yZEtleSwgZGF0YSwgZ2V0VHJhbnNhY3Rpb25LZXkpID0+IHtcbiAgY29uc3QgcmVjb3JkSWQgPSBnZXRMYXN0UGFydEluS2V5KHJlY29yZEtleSk7XG4gIGNvbnN0IHVuaXF1ZUlkID0gZ2VuZXJhdGUoKTtcbiAgY29uc3QgaWQgPSBnZXRUcmFuc2FjdGlvbklkKFxuICAgIHJlY29yZElkLCB0cmFuc2FjdGlvblR5cGUsIHVuaXF1ZUlkLFxuICApO1xuXG4gIGNvbnN0IGtleSA9IGdldFRyYW5zYWN0aW9uS2V5KGlkKTtcblxuICBjb25zdCB0cmFucyA9IHtcbiAgICB0cmFuc2FjdGlvblR5cGUsXG4gICAgcmVjb3JkS2V5LFxuICAgIC4uLmRhdGEsXG4gICAgaWQsXG4gIH07XG5cbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oXG4gICAga2V5LCB0cmFucyxcbiAgKTtcblxuICByZXR1cm4gdHJhbnM7XG59O1xuIiwiaW1wb3J0IHsgaXNTaGFyZGVkSW5kZXggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgam9pbktleSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXRTaGFyZE1hcEtleSwgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5LCBjcmVhdGVJbmRleEZpbGUgfSBmcm9tICcuL3NoYXJkaW5nJztcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxpc2VJbmRleCA9IGFzeW5jIChkYXRhc3RvcmUsIHBhcmVudEtleSwgaW5kZXgpID0+IHtcbiAgY29uc3QgaW5kZXhLZXkgPSBqb2luS2V5KHBhcmVudEtleSwgaW5kZXgubmFtZSk7XG5cbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihpbmRleEtleSk7XG5cbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4KSkge1xuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGaWxlKFxuICAgICAgZ2V0U2hhcmRNYXBLZXkoaW5kZXhLZXkpLFxuICAgICAgJ1tdJyxcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGF3YWl0IGNyZWF0ZUluZGV4RmlsZShcbiAgICAgIGRhdGFzdG9yZSxcbiAgICAgIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleShpbmRleEtleSksXG4gICAgICBpbmRleCxcbiAgICApO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgY2xvbmVEZWVwLFxuICBmbGF0dGVuLFxuICBtYXAsXG4gIGZpbHRlcixcbiAgaXNFcXVhbFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgaW5pdGlhbGlzZUNoaWxkQ29sbGVjdGlvbnMgfSBmcm9tICcuLi9jb2xsZWN0aW9uQXBpL2luaXRpYWxpc2UnO1xuaW1wb3J0IHsgdmFsaWRhdGUgfSBmcm9tICcuL3ZhbGlkYXRlJztcbmltcG9ydCB7IF9sb2FkLCBnZXRSZWNvcmRGaWxlTmFtZSB9IGZyb20gJy4vbG9hZCc7XG5pbXBvcnQge1xuICBhcGlXcmFwcGVyLCBldmVudHMsICQsIGpvaW5LZXksXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXG4gIGlzUmVjb3JkLFxuICBnZXROb2RlLFxuICBnZXRMYXN0UGFydEluS2V5LFxuICBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlLFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgbWFwUmVjb3JkIH0gZnJvbSAnLi4vaW5kZXhpbmcvZXZhbHVhdGUnO1xuaW1wb3J0IHsgbGlzdEl0ZW1zIH0gZnJvbSAnLi4vaW5kZXhBcGkvbGlzdEl0ZW1zJztcbmltcG9ydCB7IGFkZFRvQWxsSWRzIH0gZnJvbSAnLi4vaW5kZXhpbmcvYWxsSWRzJztcbmltcG9ydCB7XG4gIHRyYW5zYWN0aW9uRm9yQ3JlYXRlUmVjb3JkLFxuICB0cmFuc2FjdGlvbkZvclVwZGF0ZVJlY29yZCxcbn0gZnJvbSAnLi4vdHJhbnNhY3Rpb25zL2NyZWF0ZSc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBpbml0aWFsaXNlSW5kZXggfSBmcm9tICcuLi9pbmRleGluZy9pbml0aWFsaXNlSW5kZXgnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBzYXZlID0gYXBwID0+IGFzeW5jIChyZWNvcmQsIGNvbnRleHQpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLnJlY29yZEFwaS5zYXZlLFxuICByZWNvcmQuaXNOZXdcbiAgICA/IHBlcm1pc3Npb24uY3JlYXRlUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmQua2V5KVxuICAgIDogcGVybWlzc2lvbi51cGRhdGVSZWNvcmQuaXNBdXRob3JpemVkKHJlY29yZC5rZXkpLCB7IHJlY29yZCB9LFxuICBfc2F2ZSwgYXBwLCByZWNvcmQsIGNvbnRleHQsIGZhbHNlLFxuKTtcblxuXG5leHBvcnQgY29uc3QgX3NhdmUgPSBhc3luYyAoYXBwLCByZWNvcmQsIGNvbnRleHQsIHNraXBWYWxpZGF0aW9uID0gZmFsc2UpID0+IHtcbiAgY29uc3QgcmVjb3JkQ2xvbmUgPSBjbG9uZURlZXAocmVjb3JkKTtcbiAgaWYgKCFza2lwVmFsaWRhdGlvbikge1xuICAgIGNvbnN0IHZhbGlkYXRpb25SZXN1bHQgPSBhd2FpdCB2YWxpZGF0ZShhcHApKHJlY29yZENsb25lLCBjb250ZXh0KTtcbiAgICBpZiAoIXZhbGlkYXRpb25SZXN1bHQuaXNWYWxpZCkge1xuICAgICAgYXdhaXQgYXBwLnB1Ymxpc2goZXZlbnRzLnJlY29yZEFwaS5zYXZlLm9uSW52YWxpZCwgeyByZWNvcmQsIHZhbGlkYXRpb25SZXN1bHQgfSk7XG4gICAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBTYXZlIDogUmVjb3JkIEludmFsaWQgOiAke1xuICAgICAgICBKU09OLnN0cmluZ2lmeSh2YWxpZGF0aW9uUmVzdWx0LmVycm9ycyl9YCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHJlY29yZENsb25lLmlzTmV3KSB7XG4gICAgYXdhaXQgYWRkVG9BbGxJZHMoYXBwLmhpZXJhcmNoeSwgYXBwLmRhdGFzdG9yZSkocmVjb3JkQ2xvbmUpO1xuICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gYXdhaXQgdHJhbnNhY3Rpb25Gb3JDcmVhdGVSZWNvcmQoXG4gICAgICBhcHAsIHJlY29yZENsb25lLFxuICAgICk7XG4gICAgcmVjb3JkQ2xvbmUudHJhbnNhY3Rpb25JZCA9IHRyYW5zYWN0aW9uLmlkO1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlRm9sZGVyKHJlY29yZENsb25lLmtleSk7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoXG4gICAgICBqb2luS2V5KHJlY29yZENsb25lLmtleSwgJ2ZpbGVzJyksXG4gICAgKTtcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmNyZWF0ZUpzb24oXG4gICAgICBnZXRSZWNvcmRGaWxlTmFtZShyZWNvcmRDbG9uZS5rZXkpLFxuICAgICAgcmVjb3JkQ2xvbmUsXG4gICAgKTtcbiAgICBhd2FpdCBpbml0aWFsaXNlUmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMoYXBwLCByZWNvcmQpO1xuICAgIGF3YWl0IGluaXRpYWxpc2VBbmNlc3RvckluZGV4ZXMoYXBwLCByZWNvcmQpO1xuICAgIGF3YWl0IGluaXRpYWxpc2VDaGlsZENvbGxlY3Rpb25zKGFwcCwgcmVjb3JkQ2xvbmUua2V5KTtcbiAgICBhd2FpdCBhcHAucHVibGlzaChldmVudHMucmVjb3JkQXBpLnNhdmUub25SZWNvcmRDcmVhdGVkLCB7XG4gICAgICByZWNvcmQ6IHJlY29yZENsb25lLFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG9sZFJlY29yZCA9IGF3YWl0IF9sb2FkKGFwcCwgcmVjb3JkQ2xvbmUua2V5KTtcbiAgICBjb25zdCB0cmFuc2FjdGlvbiA9IGF3YWl0IHRyYW5zYWN0aW9uRm9yVXBkYXRlUmVjb3JkKFxuICAgICAgYXBwLCBvbGRSZWNvcmQsIHJlY29yZENsb25lLFxuICAgICk7XG4gICAgcmVjb3JkQ2xvbmUudHJhbnNhY3Rpb25JZCA9IHRyYW5zYWN0aW9uLmlkO1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgICAgIGdldFJlY29yZEZpbGVOYW1lKHJlY29yZENsb25lLmtleSksXG4gICAgICByZWNvcmRDbG9uZSxcbiAgICApO1xuICAgIGF3YWl0IGFwcC5wdWJsaXNoKGV2ZW50cy5yZWNvcmRBcGkuc2F2ZS5vblJlY29yZFVwZGF0ZWQsIHtcbiAgICAgIG9sZDogb2xkUmVjb3JkLFxuICAgICAgbmV3OiByZWNvcmRDbG9uZSxcbiAgICB9KTtcbiAgfVxuXG4gIGF3YWl0IGFwcC5jbGVhbnVwVHJhbnNhY3Rpb25zKCk7XG5cbiAgY29uc3QgcmV0dXJuZWRDbG9uZSA9IGNsb25lRGVlcChyZWNvcmRDbG9uZSk7XG4gIHJldHVybmVkQ2xvbmUuaXNOZXcgPSBmYWxzZTtcbiAgcmV0dXJuIHJldHVybmVkQ2xvbmU7XG59O1xuXG5jb25zdCBpbml0aWFsaXNlQW5jZXN0b3JJbmRleGVzID0gYXN5bmMgKGFwcCwgcmVjb3JkKSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKHJlY29yZC5rZXkpO1xuXG4gIGZvciAoY29uc3QgaW5kZXggb2YgcmVjb3JkTm9kZS5pbmRleGVzKSB7XG4gICAgY29uc3QgaW5kZXhLZXkgPSBqb2luS2V5KHJlY29yZC5rZXksIGluZGV4Lm5hbWUpO1xuICAgIGlmICghYXdhaXQgYXBwLmRhdGFzdG9yZS5leGlzdHMoaW5kZXhLZXkpKSB7IGF3YWl0IGluaXRpYWxpc2VJbmRleChhcHAuZGF0YXN0b3JlLCByZWNvcmQua2V5LCBpbmRleCk7IH1cbiAgfVxufTtcblxuY29uc3QgaW5pdGlhbGlzZVJldmVyc2VSZWZlcmVuY2VJbmRleGVzID0gYXN5bmMgKGFwcCwgcmVjb3JkKSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKHJlY29yZC5rZXkpO1xuXG4gIGNvbnN0IGluZGV4Tm9kZXMgPSAkKGZpZWxkc1RoYXRSZWZlcmVuY2VUaGlzUmVjb3JkKGFwcCwgcmVjb3JkTm9kZSksIFtcbiAgICBtYXAoZiA9PiAkKGYudHlwZU9wdGlvbnMucmV2ZXJzZUluZGV4Tm9kZUtleXMsIFtcbiAgICAgIG1hcChuID0+IGdldE5vZGUoXG4gICAgICAgIGFwcC5oaWVyYXJjaHksXG4gICAgICAgIG4sXG4gICAgICApKSxcbiAgICBdKSksXG4gICAgZmxhdHRlbixcbiAgXSk7XG5cbiAgZm9yIChjb25zdCBpbmRleE5vZGUgb2YgaW5kZXhOb2Rlcykge1xuICAgIGF3YWl0IGluaXRpYWxpc2VJbmRleChcbiAgICAgIGFwcC5kYXRhc3RvcmUsIHJlY29yZC5rZXksIGluZGV4Tm9kZSxcbiAgICApO1xuICB9XG59O1xuXG5jb25zdCBmaWVsZHNUaGF0UmVmZXJlbmNlVGhpc1JlY29yZCA9IChhcHAsIHJlY29yZE5vZGUpID0+ICQoYXBwLmhpZXJhcmNoeSwgW1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGZpbHRlcihpc1JlY29yZCksXG4gIG1hcChuID0+IG4uZmllbGRzKSxcbiAgZmxhdHRlbixcbiAgZmlsdGVyKGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUocmVjb3JkTm9kZSkpLFxuXSk7XG4iLCJpbXBvcnQgeyBpbmNsdWRlcyB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHtcbiAgc2FmZUtleSwgYXBpV3JhcHBlcixcbiAgZXZlbnRzLCBqb2luS2V5LFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgX2RlbGV0ZVJlY29yZCB9IGZyb20gJy4uL3JlY29yZEFwaS9kZWxldGUnO1xuaW1wb3J0IHsgZ2V0QWxsSWRzSXRlcmF0b3IsIGdldEFsbElkc1NoYXJkS2V5IH0gZnJvbSAnLi4vaW5kZXhpbmcvYWxsSWRzJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGRlbGV0ZUNvbGxlY3Rpb24gPSAoYXBwLCBkaXNhYmxlQ2xlYW51cCA9IGZhbHNlKSA9PiBhc3luYyBrZXkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuY29sbGVjdGlvbkFwaS5kZWxldGUsXG4gIHBlcm1pc3Npb24ubWFuYWdlQ29sbGVjdGlvbi5pc0F1dGhvcml6ZWQsXG4gIHsga2V5IH0sXG4gIF9kZWxldGVDb2xsZWN0aW9uLCBhcHAsIGtleSwgZGlzYWJsZUNsZWFudXAsXG4pO1xuXG5cbmV4cG9ydCBjb25zdCBfZGVsZXRlQ29sbGVjdGlvbiA9IGFzeW5jIChhcHAsIGtleSwgZGlzYWJsZUNsZWFudXApID0+IHtcbiAga2V5ID0gc2FmZUtleShrZXkpO1xuICBjb25zdCBub2RlID0gZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoKGFwcC5oaWVyYXJjaHkpKGtleSk7XG5cbiAgYXdhaXQgZGVsZXRlUmVjb3JkcyhhcHAsIGtleSk7XG4gIGF3YWl0IGRlbGV0ZUFsbElkc0ZvbGRlcnMoYXBwLCBub2RlLCBrZXkpO1xuICBhd2FpdCBkZWxldGVDb2xsZWN0aW9uRm9sZGVyKGFwcCwga2V5KTtcbiAgaWYgKCFkaXNhYmxlQ2xlYW51cCkgeyBhd2FpdCBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucygpOyB9XG59O1xuXG5jb25zdCBkZWxldGVDb2xsZWN0aW9uRm9sZGVyID0gYXN5bmMgKGFwcCwga2V5KSA9PiBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihrZXkpO1xuXG5cbmNvbnN0IGRlbGV0ZUFsbElkc0ZvbGRlcnMgPSBhc3luYyAoYXBwLCBub2RlLCBrZXkpID0+IHtcbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoXG4gICAgam9pbktleShcbiAgICAgIGtleSwgJ2FsbGlkcycsXG4gICAgICBub2RlLm5vZGVJZCxcbiAgICApLFxuICApO1xuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKFxuICAgIGpvaW5LZXkoa2V5LCAnYWxsaWRzJyksXG4gICk7XG59O1xuXG5jb25zdCBkZWxldGVSZWNvcmRzID0gYXN5bmMgKGFwcCwga2V5KSA9PiB7XG4gIGNvbnN0IGRlbGV0ZWRBbGxJZHNTaGFyZHMgPSBbXTtcbiAgY29uc3QgZGVsZXRlQWxsSWRzU2hhcmQgPSBhc3luYyAocmVjb3JkSWQpID0+IHtcbiAgICBjb25zdCBzaGFyZEtleSA9IGdldEFsbElkc1NoYXJkS2V5KFxuICAgICAgYXBwLmhpZXJhcmNoeSwga2V5LCByZWNvcmRJZCxcbiAgICApO1xuXG4gICAgaWYgKGluY2x1ZGVzKHNoYXJkS2V5KShkZWxldGVkQWxsSWRzU2hhcmRzKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRlbGV0ZWRBbGxJZHNTaGFyZHMucHVzaChzaGFyZEtleSk7XG5cbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoc2hhcmRLZXkpO1xuICB9O1xuXG4gIGNvbnN0IGl0ZXJhdGUgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvcihhcHApKGtleSk7XG5cbiAgbGV0IGlkcyA9IGF3YWl0IGl0ZXJhdGUoKTtcbiAgd2hpbGUgKCFpZHMuZG9uZSkge1xuICAgIGlmIChpZHMucmVzdWx0LmNvbGxlY3Rpb25LZXkgPT09IGtleSkge1xuICAgICAgZm9yIChjb25zdCBpZCBvZiBpZHMucmVzdWx0Lmlkcykge1xuICAgICAgICBhd2FpdCBfZGVsZXRlUmVjb3JkKFxuICAgICAgICAgIGFwcCxcbiAgICAgICAgICBqb2luS2V5KGtleSwgaWQpLFxuICAgICAgICAgIHRydWUsXG4gICAgICAgICk7XG4gICAgICAgIGF3YWl0IGRlbGV0ZUFsbElkc1NoYXJkKGlkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZHMgPSBhd2FpdCBpdGVyYXRlKCk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICB0cnlBd2FpdE9ySWdub3JlLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgaXNJbmRleCwgaXNTaGFyZGVkSW5kZXgsXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xuICBnZXRBbGxTaGFyZEtleXMsIGdldFNoYXJkTWFwS2V5LFxuICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXksXG59IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcblxuZXhwb3J0IGNvbnN0IF9kZWxldGVJbmRleCA9IGFzeW5jIChhcHAsIGluZGV4S2V5LCBpbmNsdWRlRm9sZGVyKSA9PiB7XG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoaW5kZXhLZXkpO1xuXG4gIGlmICghaXNJbmRleChpbmRleE5vZGUpKSB7IHRocm93IG5ldyBFcnJvcignU3VwcGxpZWQga2V5IGlzIG5vdCBhbiBpbmRleCcpOyB9XG5cbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICBjb25zdCBzaGFyZEtleXMgPSBhd2FpdCBnZXRBbGxTaGFyZEtleXMoYXBwLCBpbmRleEtleSk7XG4gICAgZm9yIChjb25zdCBrIG9mIHNoYXJkS2V5cykge1xuICAgICAgYXdhaXQgdHJ5QXdhaXRPcklnbm9yZShcbiAgICAgICAgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKGspLFxuICAgICAgKTtcbiAgICB9XG4gICAgdHJ5QXdhaXRPcklnbm9yZShcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShcbiAgICAgICAgZ2V0U2hhcmRNYXBLZXkoaW5kZXhLZXkpLFxuICAgICAgKSxcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGF3YWl0IHRyeUF3YWl0T3JJZ25vcmUoXG4gICAgICBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoXG4gICAgICAgIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleShpbmRleEtleSksXG4gICAgICApLFxuICAgICk7XG4gIH1cblxuICBpZiAoaW5jbHVkZUZvbGRlcikge1xuICAgIHRyeUF3YWl0T3JJZ25vcmUoXG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihpbmRleEtleSksXG4gICAgKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIHNhZmVLZXksIGFwaVdyYXBwZXIsXG4gIGV2ZW50cywgam9pbktleSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IF9sb2FkLCBnZXRSZWNvcmRGaWxlTmFtZSB9IGZyb20gJy4vbG9hZCc7XG5pbXBvcnQgeyBfZGVsZXRlQ29sbGVjdGlvbiB9IGZyb20gJy4uL2NvbGxlY3Rpb25BcGkvZGVsZXRlJztcbmltcG9ydCB7XG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSwgZ2V0Tm9kZSxcbiAgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvTm9kZSxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IF9kZWxldGVJbmRleCB9IGZyb20gJy4uL2luZGV4QXBpL2RlbGV0ZSc7XG5pbXBvcnQgeyB0cmFuc2FjdGlvbkZvckRlbGV0ZVJlY29yZCB9IGZyb20gJy4uL3RyYW5zYWN0aW9ucy9jcmVhdGUnO1xuaW1wb3J0IHsgcmVtb3ZlRnJvbUFsbElkcyB9IGZyb20gJy4uL2luZGV4aW5nL2FsbElkcyc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBkZWxldGVSZWNvcmQgPSAoYXBwLCBkaXNhYmxlQ2xlYW51cCA9IGZhbHNlKSA9PiBhc3luYyBrZXkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMucmVjb3JkQXBpLmRlbGV0ZSxcbiAgcGVybWlzc2lvbi5kZWxldGVSZWNvcmQuaXNBdXRob3JpemVkKGtleSksXG4gIHsga2V5IH0sXG4gIF9kZWxldGVSZWNvcmQsIGFwcCwga2V5LCBkaXNhYmxlQ2xlYW51cCxcbik7XG5cbi8vIGNhbGxlZCBkZWxldGVSZWNvcmQgYmVjYXVzZSBkZWxldGUgaXMgYSBrZXl3b3JkXG5leHBvcnQgY29uc3QgX2RlbGV0ZVJlY29yZCA9IGFzeW5jIChhcHAsIGtleSwgZGlzYWJsZUNsZWFudXApID0+IHtcbiAga2V5ID0gc2FmZUtleShrZXkpO1xuICBjb25zdCBub2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShrZXkpO1xuXG4gIGNvbnN0IHJlY29yZCA9IGF3YWl0IF9sb2FkKGFwcCwga2V5KTtcbiAgYXdhaXQgdHJhbnNhY3Rpb25Gb3JEZWxldGVSZWNvcmQoYXBwLCByZWNvcmQpO1xuXG4gIGZvciAoY29uc3QgY29sbGVjdGlvblJlY29yZCBvZiBub2RlLmNoaWxkcmVuKSB7XG4gICAgY29uc3QgY29sbGVjdGlvbktleSA9IGpvaW5LZXkoXG4gICAgICBrZXksIGNvbGxlY3Rpb25SZWNvcmQuY29sbGVjdGlvbk5hbWUsXG4gICAgKTtcbiAgICBhd2FpdCBfZGVsZXRlQ29sbGVjdGlvbihhcHAsIGNvbGxlY3Rpb25LZXksIHRydWUpO1xuICB9XG5cbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKFxuICAgIGdldFJlY29yZEZpbGVOYW1lKGtleSksXG4gICk7XG5cbiAgYXdhaXQgZGVsZXRlRmlsZXMoYXBwLCBrZXkpO1xuXG4gIGF3YWl0IHJlbW92ZUZyb21BbGxJZHMoYXBwLmhpZXJhcmNoeSwgYXBwLmRhdGFzdG9yZSkocmVjb3JkKTtcblxuICBpZiAoIWRpc2FibGVDbGVhbnVwKSB7IGF3YWl0IGFwcC5jbGVhbnVwVHJhbnNhY3Rpb25zKCk7IH1cblxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihrZXkpO1xuICBhd2FpdCBkZWxldGVJbmRleGVzKGFwcCwga2V5KTtcbn07XG5cbmNvbnN0IGRlbGV0ZUluZGV4ZXMgPSBhc3luYyAoYXBwLCBrZXkpID0+IHtcbiAgY29uc3Qgbm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoa2V5KTtcbiAgLyogY29uc3QgcmV2ZXJzZUluZGV4S2V5cyA9ICQoYXBwLmhpZXJhcmNoeSwgW1xuICAgICAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gICAgICAgIG1hcChuID0+IG4uZmllbGRzKSxcbiAgICAgICAgZmxhdHRlbixcbiAgICAgICAgZmlsdGVyKGlzU29tZXRoaW5nKSxcbiAgICAgICAgZmlsdGVyKGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUobm9kZSkpLFxuICAgICAgICBtYXAoZiA9PiAkKGYudHlwZU9wdGlvbnMucmV2ZXJzZUluZGV4Tm9kZUtleXMsIFtcbiAgICAgICAgICAgICAgICAgICAgbWFwKG4gPT4gZ2V0Tm9kZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwLmhpZXJhcmNoeSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbikpXG4gICAgICAgICAgICAgICAgXSlcbiAgICAgICAgKSxcbiAgICAgICAgZmxhdHRlbixcbiAgICAgICAgbWFwKG4gPT4gam9pbktleShrZXksIG4ubmFtZSkpXG4gICAgXSk7XG5cbiAgICBmb3IobGV0IGkgb2YgcmV2ZXJzZUluZGV4S2V5cykge1xuICAgICAgICBhd2FpdCBfZGVsZXRlSW5kZXgoYXBwLCBpLCB0cnVlKTtcbiAgICB9ICovXG5cblxuICBmb3IgKGNvbnN0IGluZGV4IG9mIG5vZGUuaW5kZXhlcykge1xuICAgIGNvbnN0IGluZGV4S2V5ID0gam9pbktleShrZXksIGluZGV4Lm5hbWUpO1xuICAgIGF3YWl0IF9kZWxldGVJbmRleChhcHAsIGluZGV4S2V5LCB0cnVlKTtcbiAgfVxufTtcblxuY29uc3QgZGVsZXRlRmlsZXMgPSBhc3luYyAoYXBwLCBrZXkpID0+IHtcbiAgY29uc3QgZmlsZXNGb2xkZXIgPSBqb2luS2V5KGtleSwgJ2ZpbGVzJyk7XG4gIGNvbnN0IGFsbEZpbGVzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5nZXRGb2xkZXJDb250ZW50cyhcbiAgICBmaWxlc0ZvbGRlcixcbiAgKTtcblxuICBmb3IgKGNvbnN0IGZpbGUgb2YgYWxsRmlsZXMpIHtcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoZmlsZSk7XG4gIH1cblxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihcbiAgICBqb2luS2V5KGtleSwgJ2ZpbGVzJyksXG4gICk7XG59O1xuIiwiaW1wb3J0IHtcbiAgaW5jbHVkZXMsIGZpbHRlcixcbiAgbWFwLCBzb21lLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcbmltcG9ydCB7IF9sb2FkIH0gZnJvbSAnLi9sb2FkJztcbmltcG9ydCB7XG4gIGFwaVdyYXBwZXIsIGV2ZW50cywgc3BsaXRLZXksXG4gICQsIGpvaW5LZXksIGlzTm90aGluZywgdHJ5QXdhaXRPcklnbm9yZSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldEV4YWN0Tm9kZUZvclBhdGggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgaXNMZWdhbEZpbGVuYW1lIH0gZnJvbSAnLi4vdHlwZXMvZmlsZSc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IsIEZvcmJpZGRlbkVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCB1cGxvYWRGaWxlID0gYXBwID0+IGFzeW5jIChyZWNvcmRLZXksIHJlYWRhYmxlU3RyZWFtLCByZWxhdGl2ZUZpbGVQYXRoKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5yZWNvcmRBcGkudXBsb2FkRmlsZSxcbiAgcGVybWlzc2lvbi51cGRhdGVSZWNvcmQuaXNBdXRob3JpemVkKHJlY29yZEtleSksXG4gIHsgcmVjb3JkS2V5LCByZWFkYWJsZVN0cmVhbSwgcmVsYXRpdmVGaWxlUGF0aCB9LFxuICBfdXBsb2FkRmlsZSwgYXBwLCByZWNvcmRLZXksIHJlYWRhYmxlU3RyZWFtLCByZWxhdGl2ZUZpbGVQYXRoLFxuKTtcblxuY29uc3QgX3VwbG9hZEZpbGUgPSBhc3luYyAoYXBwLCByZWNvcmRLZXksIHJlYWRhYmxlU3RyZWFtLCByZWxhdGl2ZUZpbGVQYXRoKSA9PiB7XG4gIGlmIChpc05vdGhpbmcocmVjb3JkS2V5KSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdSZWNvcmQgS2V5IG5vdCBzdXBwbGllZCcpOyB9XG4gIGlmIChpc05vdGhpbmcocmVsYXRpdmVGaWxlUGF0aCkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignZmlsZSBwYXRoIG5vdCBzdXBwbGllZCcpOyB9XG4gIGlmICghaXNMZWdhbEZpbGVuYW1lKHJlbGF0aXZlRmlsZVBhdGgpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ0lsbGVnYWwgZmlsZW5hbWUnKTsgfVxuXG4gIGNvbnN0IHJlY29yZCA9IGF3YWl0IF9sb2FkKGFwcCwgcmVjb3JkS2V5KTtcblxuICBjb25zdCBmdWxsRmlsZVBhdGggPSBzYWZlR2V0RnVsbEZpbGVQYXRoKFxuICAgIHJlY29yZEtleSwgcmVsYXRpdmVGaWxlUGF0aCxcbiAgKTtcblxuICBjb25zdCB0ZW1wRmlsZVBhdGggPSBgJHtmdWxsRmlsZVBhdGh9XyR7Z2VuZXJhdGUoKX0udGVtcGA7XG5cbiAgY29uc3Qgb3V0cHV0U3RyZWFtID0gYXdhaXQgYXBwLmRhdGFzdG9yZS53cml0YWJsZUZpbGVTdHJlYW0oXG4gICAgdGVtcEZpbGVQYXRoLFxuICApO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSxyZWplY3QpID0+IHtcbiAgICByZWFkYWJsZVN0cmVhbS5waXBlKG91dHB1dFN0cmVhbSk7XG4gICAgb3V0cHV0U3RyZWFtLm9uKCdlcnJvcicsIHJlamVjdCk7XG4gICAgb3V0cHV0U3RyZWFtLm9uKCdmaW5pc2gnLCByZXNvbHZlKTtcbiAgfSlcbiAgLnRoZW4oKCkgPT4gYXBwLmRhdGFzdG9yZS5nZXRGaWxlU2l6ZSh0ZW1wRmlsZVBhdGgpKVxuICAudGhlbihzaXplID0+IHtcbiAgICBjb25zdCBpc0V4cGVjdGVkRmlsZVNpemUgPSBjaGVja0ZpbGVTaXplQWdhaW5zdEZpZWxkcyhcbiAgICAgIGFwcCwgcmVjb3JkLCByZWxhdGl2ZUZpbGVQYXRoLCBzaXplXG4gICAgKTsgIFxuICAgIGlmICghaXNFeHBlY3RlZEZpbGVTaXplKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYEZpZWxkcyBmb3IgJHtyZWxhdGl2ZUZpbGVQYXRofSBkbyBub3QgaGF2ZSBleHBlY3RlZCBzaXplOiAke2pvaW4oJywnKShpbmNvcnJlY3RGaWVsZHMpfWApOyB9ICBcblxuICB9KVxuICAudGhlbigoKSA9PiB0cnlBd2FpdE9ySWdub3JlKGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZSwgZnVsbEZpbGVQYXRoKSlcbiAgLnRoZW4oKCkgPT4gYXBwLmRhdGFzdG9yZS5yZW5hbWVGaWxlKHRlbXBGaWxlUGF0aCwgZnVsbEZpbGVQYXRoKSk7XG5cbiAgLypcbiAgcmVhZGFibGVTdHJlYW0ucGlwZShvdXRwdXRTdHJlYW0pO1xuXG4gIGF3YWl0IG5ldyBQcm9taXNlKGZ1bGZpbGwgPT4gb3V0cHV0U3RyZWFtLm9uKCdmaW5pc2gnLCBmdWxmaWxsKSk7XG5cbiAgY29uc3QgaXNFeHBlY3RlZEZpbGVTaXplID0gY2hlY2tGaWxlU2l6ZUFnYWluc3RGaWVsZHMoXG4gICAgYXBwLFxuICAgIHJlY29yZCwgcmVsYXRpdmVGaWxlUGF0aCxcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZpbGVTaXplKHRlbXBGaWxlUGF0aCksXG4gICk7XG5cbiAgaWYgKCFpc0V4cGVjdGVkRmlsZVNpemUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgRmllbGRzIGZvciAke3JlbGF0aXZlRmlsZVBhdGh9IGRvIG5vdCBoYXZlIGV4cGVjdGVkIHNpemVgKTtcbiAgfVxuXG4gIGF3YWl0IHRyeUF3YWl0T3JJZ25vcmUoYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlLCBmdWxsRmlsZVBhdGgpO1xuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUucmVuYW1lRmlsZSh0ZW1wRmlsZVBhdGgsIGZ1bGxGaWxlUGF0aCk7XG4gICovXG59O1xuXG5jb25zdCBjaGVja0ZpbGVTaXplQWdhaW5zdEZpZWxkcyA9IChhcHAsIHJlY29yZCwgcmVsYXRpdmVGaWxlUGF0aCwgZXhwZWN0ZWRTaXplKSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKHJlY29yZC5rZXkpO1xuXG4gIGNvbnN0IGluY29ycmVjdEZpbGVGaWVsZHMgPSAkKHJlY29yZE5vZGUuZmllbGRzLCBbXG4gICAgZmlsdGVyKGYgPT4gZi50eXBlID09PSAnZmlsZSdcbiAgICAgICYmIHJlY29yZFtmLm5hbWVdLnJlbGF0aXZlUGF0aCA9PT0gcmVsYXRpdmVGaWxlUGF0aFxuICAgICAgJiYgcmVjb3JkW2YubmFtZV0uc2l6ZSAhPT0gZXhwZWN0ZWRTaXplKSxcbiAgICBtYXAoZiA9PiBmLm5hbWUpLFxuICBdKTtcblxuICBjb25zdCBpbmNvcnJlY3RGaWxlQXJyYXlGaWVsZHMgPSAkKHJlY29yZE5vZGUuZmllbGRzLCBbXG4gICAgZmlsdGVyKGEgPT4gYS50eXBlID09PSAnYXJyYXk8ZmlsZT4nXG4gICAgICAmJiAkKHJlY29yZFthLm5hbWVdLCBbXG4gICAgICAgIHNvbWUoZiA9PiByZWNvcmRbZi5uYW1lXS5yZWxhdGl2ZVBhdGggPT09IHJlbGF0aXZlRmlsZVBhdGhcbiAgICAgICAgICAmJiByZWNvcmRbZi5uYW1lXS5zaXplICE9PSBleHBlY3RlZFNpemUpLFxuICAgICAgXSkpLFxuICAgIG1hcChmID0+IGYubmFtZSksXG4gIF0pO1xuXG4gIGNvbnN0IGluY29ycmVjdEZpZWxkcyA9IFtcbiAgICAuLi5pbmNvcnJlY3RGaWxlRmllbGRzLFxuICAgIC4uLmluY29ycmVjdEZpbGVBcnJheUZpZWxkcyxcbiAgXTtcblxuICBpZiAoaW5jb3JyZWN0RmllbGRzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmV4cG9ydCBjb25zdCBzYWZlR2V0RnVsbEZpbGVQYXRoID0gKHJlY29yZEtleSwgcmVsYXRpdmVGaWxlUGF0aCkgPT4ge1xuICBjb25zdCBuYXVnaHR5VXNlciA9ICgpID0+IHsgdGhyb3cgbmV3IEZvcmJpZGRlbkVycm9yKCduYXVnaHR5IG5hdWdodHknKTsgfTtcblxuICBpZiAocmVsYXRpdmVGaWxlUGF0aC5zdGFydHNXaXRoKCcuLicpKSBuYXVnaHR5VXNlcigpO1xuXG4gIGNvbnN0IHBhdGhQYXJ0cyA9IHNwbGl0S2V5KHJlbGF0aXZlRmlsZVBhdGgpO1xuXG4gIGlmIChpbmNsdWRlcygnLi4nKShwYXRoUGFydHMpKSBuYXVnaHR5VXNlcigpO1xuXG4gIGNvbnN0IHJlY29yZEtleVBhcnRzID0gc3BsaXRLZXkocmVjb3JkS2V5KTtcblxuICBjb25zdCBmdWxsUGF0aFBhcnRzID0gW1xuICAgIC4uLnJlY29yZEtleVBhcnRzLFxuICAgICdmaWxlcycsXG4gICAgLi4uZmlsdGVyKHAgPT4gcCAhPT0gJy4nKShwYXRoUGFydHMpLFxuICBdO1xuXG4gIHJldHVybiBqb2luS2V5KGZ1bGxQYXRoUGFydHMpO1xufTtcbiIsImltcG9ydCB7IGFwaVdyYXBwZXIsIGV2ZW50cywgaXNOb3RoaW5nIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IHNhZmVHZXRGdWxsRmlsZVBhdGggfSBmcm9tICcuL3VwbG9hZEZpbGUnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBkb3dubG9hZEZpbGUgPSBhcHAgPT4gYXN5bmMgKHJlY29yZEtleSwgcmVsYXRpdmVQYXRoKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5yZWNvcmRBcGkudXBsb2FkRmlsZSxcbiAgcGVybWlzc2lvbi5yZWFkUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmRLZXkpLFxuICB7IHJlY29yZEtleSwgcmVsYXRpdmVQYXRoIH0sLy9yZW1vdmUgZHVwZSBrZXkgJ3JlY29yZEtleScgZnJvbSBvYmplY3RcbiAgX2Rvd25sb2FkRmlsZSwgYXBwLCByZWNvcmRLZXksIHJlbGF0aXZlUGF0aCxcbik7IFxuXG5cbmNvbnN0IF9kb3dubG9hZEZpbGUgPSBhc3luYyAoYXBwLCByZWNvcmRLZXksIHJlbGF0aXZlUGF0aCkgPT4ge1xuICBpZiAoaXNOb3RoaW5nKHJlY29yZEtleSkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignUmVjb3JkIEtleSBub3Qgc3VwcGxpZWQnKTsgfVxuICBpZiAoaXNOb3RoaW5nKHJlbGF0aXZlUGF0aCkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignZmlsZSBwYXRoIG5vdCBzdXBwbGllZCcpOyB9XG5cbiAgcmV0dXJuIGF3YWl0IGFwcC5kYXRhc3RvcmUucmVhZGFibGVGaWxlU3RyZWFtKFxuICAgIHNhZmVHZXRGdWxsRmlsZVBhdGgoXG4gICAgICByZWNvcmRLZXksIHJlbGF0aXZlUGF0aCxcbiAgICApLFxuICApO1xufTtcbiIsImltcG9ydCB7IGZpbmQsIHRha2UsIHVuaW9uIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdldEZsYXR0ZW5lZEhpZXJhcmNoeSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyAkLCBzcGxpdEtleSwgam9pbktleSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBjdXN0b21JZCA9IGFwcCA9PiAobm9kZU5hbWUsIGlkKSA9PiB7XG4gIGNvbnN0IG5vZGUgPSAkKGFwcC5oaWVyYXJjaHksIFtcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gICAgZmluZChuID0+IG4ubmFtZSA9PT0gbm9kZU5hbWUpLFxuICBdKTtcblxuICBpZiAoIW5vZGUpIHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGBDYW5ub3QgZmluZCBub2RlICR7bm9kZU5hbWV9YCk7XG5cbiAgcmV0dXJuIGAke25vZGUubm9kZUlkfS0ke2lkfWA7XG59O1xuXG5leHBvcnQgY29uc3Qgc2V0Q3VzdG9tSWQgPSBhcHAgPT4gKHJlY29yZCwgaWQpID0+IHtcbiAgcmVjb3JkLmlkID0gY3VzdG9tSWQoYXBwKShyZWNvcmQudHlwZSwgaWQpO1xuXG4gIGNvbnN0IGtleVBhcnRzID0gc3BsaXRLZXkocmVjb3JkLmtleSk7XG5cbiAgcmVjb3JkLmtleSA9ICQoa2V5UGFydHMsIFtcbiAgICB0YWtlKGtleVBhcnRzLmxlbmd0aCAtIDEpLFxuICAgIHVuaW9uKFtyZWNvcmQuaWRdKSxcbiAgICBqb2luS2V5LFxuICBdKTtcblxuICByZXR1cm4gcmVjb3JkO1xufTtcbiIsImltcG9ydCB7IGdldE5ldywgZ2V0TmV3Q2hpbGQgfSBmcm9tICcuL2dldE5ldyc7XG5pbXBvcnQgeyBsb2FkIH0gZnJvbSAnLi9sb2FkJztcbmltcG9ydCB7IHZhbGlkYXRlIH0gZnJvbSAnLi92YWxpZGF0ZSc7XG5pbXBvcnQgeyBnZXRDb250ZXh0IH0gZnJvbSAnLi9nZXRDb250ZXh0JztcbmltcG9ydCB7IHNhdmUgfSBmcm9tICcuL3NhdmUnO1xuaW1wb3J0IHsgZGVsZXRlUmVjb3JkIH0gZnJvbSAnLi9kZWxldGUnO1xuaW1wb3J0IHsgdXBsb2FkRmlsZSB9IGZyb20gJy4vdXBsb2FkRmlsZSc7XG5pbXBvcnQgeyBkb3dubG9hZEZpbGUgfSBmcm9tICcuL2Rvd25sb2FkRmlsZSc7XG5pbXBvcnQgeyBjdXN0b21JZCwgc2V0Q3VzdG9tSWQgfSBmcm9tICcuL2N1c3RvbUlkJztcblxuY29uc3QgYXBpID0gYXBwID0+ICh7XG4gIGdldE5ldzogZ2V0TmV3KGFwcCksXG4gIGdldE5ld0NoaWxkOiBnZXROZXdDaGlsZChhcHApLFxuICBzYXZlOiBzYXZlKGFwcCksXG4gIGxvYWQ6IGxvYWQoYXBwKSxcbiAgZGVsZXRlOiBkZWxldGVSZWNvcmQoYXBwLCBmYWxzZSksXG4gIHZhbGlkYXRlOiB2YWxpZGF0ZShhcHApLFxuICBnZXRDb250ZXh0OiBnZXRDb250ZXh0KGFwcCksXG4gIHVwbG9hZEZpbGU6IHVwbG9hZEZpbGUoYXBwKSxcbiAgZG93bmxvYWRGaWxlOiBkb3dubG9hZEZpbGUoYXBwKSxcbiAgY3VzdG9tSWQ6IGN1c3RvbUlkKGFwcCksXG4gIHNldEN1c3RvbUlkOiBzZXRDdXN0b21JZChhcHApLFxufSk7XG5cblxuZXhwb3J0IGNvbnN0IGdldFJlY29yZEFwaSA9IGFwcCA9PiBhcGkoYXBwKTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmVjb3JkQXBpO1xuIiwiaW1wb3J0IHsgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7XG4gIGlzTm90aGluZywgc2FmZUtleSwgYXBpV3JhcHBlclN5bmMsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGFsd2F5c0F1dGhvcml6ZWQgfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGdldEFsbG93ZWRSZWNvcmRUeXBlcyA9IGFwcCA9PiBrZXkgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmNvbGxlY3Rpb25BcGkuZ2V0QWxsb3dlZFJlY29yZFR5cGVzLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IGtleSB9LFxuICBfZ2V0QWxsb3dlZFJlY29yZFR5cGVzLCBhcHAsIGtleSxcbik7XG5cbmNvbnN0IF9nZXRBbGxvd2VkUmVjb3JkVHlwZXMgPSAoYXBwLCBrZXkpID0+IHtcbiAga2V5ID0gc2FmZUtleShrZXkpO1xuICBjb25zdCBub2RlID0gZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoKGFwcC5oaWVyYXJjaHkpKGtleSk7XG4gIHJldHVybiBpc05vdGhpbmcobm9kZSkgPyBbXSA6IFtub2RlLm5hbWVdO1xufTtcbiIsImltcG9ydCB7IGdldEFsbElkc0l0ZXJhdG9yIH0gZnJvbSAnLi4vaW5kZXhpbmcvYWxsSWRzJztcbmltcG9ydCB7IGdldEFsbG93ZWRSZWNvcmRUeXBlcyB9IGZyb20gJy4vZ2V0QWxsb3dlZFJlY29yZFR5cGVzJztcbmltcG9ydCB7IGRlbGV0ZUNvbGxlY3Rpb24gfSBmcm9tICcuL2RlbGV0ZSc7XG5cbmV4cG9ydCBjb25zdCBnZXRDb2xsZWN0aW9uQXBpID0gYXBwID0+ICh7XG4gIGdldEFsbG93ZWRSZWNvcmRUeXBlczogZ2V0QWxsb3dlZFJlY29yZFR5cGVzKGFwcCksXG4gIGdldEFsbElkc0l0ZXJhdG9yOiBnZXRBbGxJZHNJdGVyYXRvcihhcHApLFxuICBkZWxldGU6IGRlbGV0ZUNvbGxlY3Rpb24oYXBwKSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRDb2xsZWN0aW9uQXBpO1xuIiwiaW1wb3J0IHtcbiAgZmluZCwgZmlsdGVyLCBcbiAgaW5jbHVkZXMsIHNvbWUsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZXRBbGxJZHNJdGVyYXRvciB9IGZyb20gJy4uL2luZGV4aW5nL2FsbElkcyc7XG5pbXBvcnQge1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksIGdldFJlY29yZE5vZGVCeUlkLFxuICBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5LCBnZXROb2RlLCBpc0luZGV4LFxuICBpc1JlY29yZCwgaXNEZWNlbmRhbnQsIGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4LFxuICBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7XG4gIGpvaW5LZXksIGFwaVdyYXBwZXIsIGV2ZW50cywgJCwgYWxsVHJ1ZSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIGNyZWF0ZUJ1aWxkSW5kZXhGb2xkZXIsXG4gIHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleCxcbn0gZnJvbSAnLi4vdHJhbnNhY3Rpb25zL2NyZWF0ZSc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuXG4vKiogcmVidWlsZHMgYW4gaW5kZXhcbiAqIEBwYXJhbSB7b2JqZWN0fSBhcHAgLSB0aGUgYXBwbGljYXRpb24gY29udGFpbmVyXG4gKiBAcGFyYW0ge3N0cmluZ30gaW5kZXhOb2RlS2V5IC0gbm9kZSBrZXkgb2YgdGhlIGluZGV4LCB3aGljaCB0aGUgaW5kZXggYmVsb25ncyB0b1xuICovXG5leHBvcnQgY29uc3QgYnVpbGRJbmRleCA9IGFwcCA9PiBhc3luYyBpbmRleE5vZGVLZXkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuaW5kZXhBcGkuYnVpbGRJbmRleCxcbiAgcGVybWlzc2lvbi5tYW5hZ2VJbmRleC5pc0F1dGhvcml6ZWQsXG4gIHsgaW5kZXhOb2RlS2V5IH0sXG4gIF9idWlsZEluZGV4LCBhcHAsIGluZGV4Tm9kZUtleSxcbik7XG5cbmNvbnN0IF9idWlsZEluZGV4ID0gYXN5bmMgKGFwcCwgaW5kZXhOb2RlS2V5KSA9PiB7XG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldE5vZGUoYXBwLmhpZXJhcmNoeSwgaW5kZXhOb2RlS2V5KTtcblxuICBhd2FpdCBjcmVhdGVCdWlsZEluZGV4Rm9sZGVyKGFwcC5kYXRhc3RvcmUsIGluZGV4Tm9kZUtleSk7XG5cbiAgaWYgKCFpc0luZGV4KGluZGV4Tm9kZSkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignQnVpbGRJbmRleDogbXVzdCBzdXBwbHkgYW4gaW5kZXhub2RlJyk7IH1cblxuICBpZiAoaW5kZXhOb2RlLmluZGV4VHlwZSA9PT0gJ3JlZmVyZW5jZScpIHtcbiAgICBhd2FpdCBidWlsZFJldmVyc2VSZWZlcmVuY2VJbmRleChcbiAgICAgIGFwcCwgaW5kZXhOb2RlLFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgYnVpbGRIZWlyYXJjaGFsSW5kZXgoXG4gICAgICBhcHAsIGluZGV4Tm9kZSxcbiAgICApO1xuICB9XG5cbiAgYXdhaXQgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMoKTtcbn07XG5cbmNvbnN0IGJ1aWxkUmV2ZXJzZVJlZmVyZW5jZUluZGV4ID0gYXN5bmMgKGFwcCwgaW5kZXhOb2RlKSA9PiB7XG4gIC8vIEl0ZXJhdGUgdGhyb3VnaCBhbGwgcmVmZXJlbmNJTkcgcmVjb3JkcyxcbiAgLy8gYW5kIHVwZGF0ZSByZWZlcmVuY2VkIGluZGV4IGZvciBlYWNoIHJlY29yZFxuICBsZXQgcmVjb3JkQ291bnQgPSAwO1xuICBjb25zdCByZWZlcmVuY2luZ05vZGVzID0gJChhcHAuaGllcmFyY2h5LCBbXG4gICAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICAgIGZpbHRlcihuID0+IGlzUmVjb3JkKG4pXG4gICAgICAgICAgICAgICAgICAgICYmIHNvbWUoZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXgoaW5kZXhOb2RlKSkobi5maWVsZHMpKSxcbiAgXSk7XG5cbiAgY29uc3QgY3JlYXRlVHJhbnNhY3Rpb25zRm9yUmVmZXJlbmNpbmdOb2RlID0gYXN5bmMgKHJlZmVyZW5jaW5nTm9kZSkgPT4ge1xuICAgIGNvbnN0IGl0ZXJhdGVSZWZlcmVuY2luZ05vZGVzID0gYXdhaXQgZ2V0QWxsSWRzSXRlcmF0b3IoYXBwKShyZWZlcmVuY2luZ05vZGUuY29sbGVjdGlvbk5vZGVLZXkoKSk7XG5cbiAgICBsZXQgcmVmZXJlbmNpbmdJZEl0ZXJhdG9yID0gYXdhaXQgaXRlcmF0ZVJlZmVyZW5jaW5nTm9kZXMoKTtcbiAgICB3aGlsZSAoIXJlZmVyZW5jaW5nSWRJdGVyYXRvci5kb25lKSB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVmZXJlbmNpbmdJZEl0ZXJhdG9yO1xuICAgICAgZm9yIChjb25zdCBpZCBvZiByZXN1bHQuaWRzKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZEtleSA9IGpvaW5LZXkocmVzdWx0LmNvbGxlY3Rpb25LZXksIGlkKTtcbiAgICAgICAgYXdhaXQgdHJhbnNhY3Rpb25Gb3JCdWlsZEluZGV4KGFwcCwgaW5kZXhOb2RlLm5vZGVLZXkoKSwgcmVjb3JkS2V5LCByZWNvcmRDb3VudCk7XG4gICAgICAgIHJlY29yZENvdW50Kys7XG4gICAgICB9XG4gICAgICByZWZlcmVuY2luZ0lkSXRlcmF0b3IgPSBhd2FpdCBpdGVyYXRlUmVmZXJlbmNpbmdOb2RlcygpO1xuICAgIH1cbiAgfTtcblxuICBmb3IgKGNvbnN0IHJlZmVyZW5jaW5nTm9kZSBvZiByZWZlcmVuY2luZ05vZGVzKSB7XG4gICAgYXdhaXQgY3JlYXRlVHJhbnNhY3Rpb25zRm9yUmVmZXJlbmNpbmdOb2RlKHJlZmVyZW5jaW5nTm9kZSk7XG4gIH1cbn07XG5cbmNvbnN0IGdldEFsbG93ZWRQYXJlbnRDb2xsZWN0aW9uTm9kZXMgPSAoaGllcmFyY2h5LCBpbmRleE5vZGUpID0+ICQoZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgoaGllcmFyY2h5LCBpbmRleE5vZGUpLCBbXG4gIG1hcChuID0+IG4ucGFyZW50KCkpLFxuXSk7XG5cbmNvbnN0IGJ1aWxkSGVpcmFyY2hhbEluZGV4ID0gYXN5bmMgKGFwcCwgaW5kZXhOb2RlKSA9PiB7XG4gIGxldCByZWNvcmRDb3VudCA9IDA7XG5cbiAgY29uc3QgY3JlYXRlVHJhbnNhY3Rpb25zRm9ySWRzID0gYXN5bmMgKGNvbGxlY3Rpb25LZXksIGlkcykgPT4ge1xuICAgIGZvciAoY29uc3QgcmVjb3JkSWQgb2YgaWRzKSB7XG4gICAgICBjb25zdCByZWNvcmRLZXkgPSBqb2luS2V5KGNvbGxlY3Rpb25LZXksIHJlY29yZElkKTtcblxuICAgICAgY29uc3QgcmVjb3JkTm9kZSA9IGdldFJlY29yZE5vZGVCeUlkKFxuICAgICAgICBhcHAuaGllcmFyY2h5LFxuICAgICAgICByZWNvcmRJZCxcbiAgICAgICk7XG5cbiAgICAgIGlmIChyZWNvcmROb2RlQXBwbGllcyhpbmRleE5vZGUpKHJlY29yZE5vZGUpKSB7XG4gICAgICAgIGF3YWl0IHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleChcbiAgICAgICAgICBhcHAsIGluZGV4Tm9kZS5ub2RlS2V5KCksXG4gICAgICAgICAgcmVjb3JkS2V5LCByZWNvcmRDb3VudCxcbiAgICAgICAgKTtcbiAgICAgICAgcmVjb3JkQ291bnQrKztcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cblxuICBjb25zdCBjb2xsZWN0aW9uUmVjb3JkcyA9IGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4KGFwcC5oaWVyYXJjaHksIGluZGV4Tm9kZSk7XG5cbiAgZm9yIChjb25zdCB0YXJnZXRDb2xsZWN0aW9uUmVjb3JkTm9kZSBvZiBjb2xsZWN0aW9uUmVjb3Jkcykge1xuICAgIGNvbnN0IGFsbElkc0l0ZXJhdG9yID0gYXdhaXQgZ2V0QWxsSWRzSXRlcmF0b3IoYXBwKSh0YXJnZXRDb2xsZWN0aW9uUmVjb3JkTm9kZS5jb2xsZWN0aW9uTm9kZUtleSgpKTtcblxuICAgIGxldCBhbGxJZHMgPSBhd2FpdCBhbGxJZHNJdGVyYXRvcigpO1xuICAgIHdoaWxlIChhbGxJZHMuZG9uZSA9PT0gZmFsc2UpIHtcbiAgICAgIGF3YWl0IGNyZWF0ZVRyYW5zYWN0aW9uc0ZvcklkcyhcbiAgICAgICAgYWxsSWRzLnJlc3VsdC5jb2xsZWN0aW9uS2V5LFxuICAgICAgICBhbGxJZHMucmVzdWx0LmlkcyxcbiAgICAgICk7XG4gICAgICBhbGxJZHMgPSBhd2FpdCBhbGxJZHNJdGVyYXRvcigpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZWNvcmRDb3VudDtcbn07XG5cbmNvbnN0IGNob29zZUNoaWxkUmVjb3JkTm9kZUJ5S2V5ID0gKGNvbGxlY3Rpb25Ob2RlLCByZWNvcmRJZCkgPT4gZmluZChjID0+IHJlY29yZElkLnN0YXJ0c1dpdGgoYy5ub2RlSWQpKShjb2xsZWN0aW9uTm9kZS5jaGlsZHJlbik7XG5cbmNvbnN0IHJlY29yZE5vZGVBcHBsaWVzID0gaW5kZXhOb2RlID0+IHJlY29yZE5vZGUgPT4gaW5jbHVkZXMocmVjb3JkTm9kZS5ub2RlSWQpKGluZGV4Tm9kZS5hbGxvd2VkUmVjb3JkTm9kZUlkcyk7XG5cbmNvbnN0IGhhc0FwcGxpY2FibGVEZWNlbmRhbnQgPSAoaGllcmFyY2h5LCBhbmNlc3Rvck5vZGUsIGluZGV4Tm9kZSkgPT4gJChoaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaWx0ZXIoXG4gICAgYWxsVHJ1ZShcbiAgICAgIGlzUmVjb3JkLFxuICAgICAgaXNEZWNlbmRhbnQoYW5jZXN0b3JOb2RlKSxcbiAgICAgIHJlY29yZE5vZGVBcHBsaWVzKGluZGV4Tm9kZSksXG4gICAgKSxcbiAgKSxcbl0pO1xuXG5jb25zdCBhcHBseUFsbERlY2VuZGFudFJlY29yZHMgPSBhc3luYyAoYXBwLCBjb2xsZWN0aW9uX0tleV9vcl9Ob2RlS2V5LFxuICBpbmRleE5vZGUsIGluZGV4S2V5LCBjdXJyZW50SW5kZXhlZERhdGEsXG4gIGN1cnJlbnRJbmRleGVkRGF0YUtleSwgcmVjb3JkQ291bnQgPSAwKSA9PiB7XG4gIGNvbnN0IGNvbGxlY3Rpb25Ob2RlID0gZ2V0Q29sbGVjdGlvbk5vZGVCeUtleU9yTm9kZUtleShcbiAgICBhcHAuaGllcmFyY2h5LFxuICAgIGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXksXG4gICk7XG5cbiAgY29uc3QgYWxsSWRzSXRlcmF0b3IgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvcihhcHApKGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXkpO1xuXG5cbiAgY29uc3QgY3JlYXRlVHJhbnNhY3Rpb25zRm9ySWRzID0gYXN5bmMgKGNvbGxlY3Rpb25LZXksIGFsbElkcykgPT4ge1xuICAgIGZvciAoY29uc3QgcmVjb3JkSWQgb2YgYWxsSWRzKSB7XG4gICAgICBjb25zdCByZWNvcmRLZXkgPSBqb2luS2V5KGNvbGxlY3Rpb25LZXksIHJlY29yZElkKTtcblxuICAgICAgY29uc3QgcmVjb3JkTm9kZSA9IGNob29zZUNoaWxkUmVjb3JkTm9kZUJ5S2V5KFxuICAgICAgICBjb2xsZWN0aW9uTm9kZSxcbiAgICAgICAgcmVjb3JkSWQsXG4gICAgICApO1xuXG4gICAgICBpZiAocmVjb3JkTm9kZUFwcGxpZXMoaW5kZXhOb2RlKShyZWNvcmROb2RlKSkge1xuICAgICAgICBhd2FpdCB0cmFuc2FjdGlvbkZvckJ1aWxkSW5kZXgoXG4gICAgICAgICAgYXBwLCBpbmRleE5vZGUubm9kZUtleSgpLFxuICAgICAgICAgIHJlY29yZEtleSwgcmVjb3JkQ291bnQsXG4gICAgICAgICk7XG4gICAgICAgIHJlY29yZENvdW50Kys7XG4gICAgICB9XG5cbiAgICAgIGlmIChoYXNBcHBsaWNhYmxlRGVjZW5kYW50KGFwcC5oaWVyYXJjaHksIHJlY29yZE5vZGUsIGluZGV4Tm9kZSkpIHtcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZENvbGxlY3Rpb25Ob2RlIG9mIHJlY29yZE5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICByZWNvcmRDb3VudCA9IGF3YWl0IGFwcGx5QWxsRGVjZW5kYW50UmVjb3JkcyhcbiAgICAgICAgICAgIGFwcCxcbiAgICAgICAgICAgIGpvaW5LZXkocmVjb3JkS2V5LCBjaGlsZENvbGxlY3Rpb25Ob2RlLmNvbGxlY3Rpb25OYW1lKSxcbiAgICAgICAgICAgIGluZGV4Tm9kZSwgaW5kZXhLZXksIGN1cnJlbnRJbmRleGVkRGF0YSxcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleGVkRGF0YUtleSwgcmVjb3JkQ291bnQsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBsZXQgYWxsSWRzID0gYXdhaXQgYWxsSWRzSXRlcmF0b3IoKTtcbiAgd2hpbGUgKGFsbElkcy5kb25lID09PSBmYWxzZSkge1xuICAgIGF3YWl0IGNyZWF0ZVRyYW5zYWN0aW9uc0ZvcklkcyhcbiAgICAgIGFsbElkcy5yZXN1bHQuY29sbGVjdGlvbktleSxcbiAgICAgIGFsbElkcy5yZXN1bHQuaWRzLFxuICAgICk7XG4gICAgYWxsSWRzID0gYXdhaXQgYWxsSWRzSXRlcmF0b3IoKTtcbiAgfVxuXG4gIHJldHVybiByZWNvcmRDb3VudDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGJ1aWxkSW5kZXg7XG4iLCJpbXBvcnQgeyBoYXMsIGlzTnVtYmVyLCBpc1VuZGVmaW5lZCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBjb21waWxlRXhwcmVzc2lvbiwgY29tcGlsZUNvZGUgfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XG5pbXBvcnQge1xuICBzYWZlS2V5LCBhcGlXcmFwcGVyLFxuICBldmVudHMsIGlzTm9uRW1wdHlTdHJpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBpdGVyYXRlSW5kZXggfSBmcm9tICcuLi9pbmRleGluZy9yZWFkJztcbmltcG9ydCB7XG4gIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSxcbiAgZ2V0U2hhcmRLZXlzSW5SYW5nZSxcbn0gZnJvbSAnLi4vaW5kZXhpbmcvc2hhcmRpbmcnO1xuaW1wb3J0IHtcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCwgaXNJbmRleCxcbiAgaXNTaGFyZGVkSW5kZXgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBDT05USU5VRV9SRUFESU5HX1JFQ09SRFMgfSBmcm9tICcuLi9pbmRleGluZy9zZXJpYWxpemVyJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgYWdncmVnYXRlcyA9IGFwcCA9PiBhc3luYyAoaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMgPSBudWxsLCByYW5nZUVuZFBhcmFtcyA9IG51bGwpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmluZGV4QXBpLmFnZ3JlZ2F0ZXMsXG4gIHBlcm1pc3Npb24ucmVhZEluZGV4LmlzQXV0aG9yaXplZChpbmRleEtleSksXG4gIHsgaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zIH0sXG4gIF9hZ2dyZWdhdGVzLCBhcHAsIGluZGV4S2V5LCByYW5nZVN0YXJ0UGFyYW1zLCByYW5nZUVuZFBhcmFtcyxcbik7XG5cbmNvbnN0IF9hZ2dyZWdhdGVzID0gYXN5bmMgKGFwcCwgaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zKSA9PiB7XG4gIGluZGV4S2V5ID0gc2FmZUtleShpbmRleEtleSk7XG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoaW5kZXhLZXkpO1xuXG4gIGlmICghaXNJbmRleChpbmRleE5vZGUpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ3N1cHBsaWVkIGtleSBpcyBub3QgYW4gaW5kZXgnKTsgfVxuXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleE5vZGUpKSB7XG4gICAgY29uc3Qgc2hhcmRLZXlzID0gYXdhaXQgZ2V0U2hhcmRLZXlzSW5SYW5nZShcbiAgICAgIGFwcCwgaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zLFxuICAgICk7XG4gICAgbGV0IGFnZ3JlZ2F0ZVJlc3VsdCA9IG51bGw7XG4gICAgZm9yIChjb25zdCBrIG9mIHNoYXJkS2V5cykge1xuICAgICAgY29uc3Qgc2hhcmRSZXN1bHQgPSBhd2FpdCBnZXRBZ2dyZWdhdGVzKGFwcC5oaWVyYXJjaHksIGFwcC5kYXRhc3RvcmUsIGluZGV4Tm9kZSwgayk7XG4gICAgICBpZiAoYWdncmVnYXRlUmVzdWx0ID09PSBudWxsKSB7XG4gICAgICAgIGFnZ3JlZ2F0ZVJlc3VsdCA9IHNoYXJkUmVzdWx0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWdncmVnYXRlUmVzdWx0ID0gbWVyZ2VTaGFyZEFnZ3JlZ2F0ZShcbiAgICAgICAgICBhZ2dyZWdhdGVSZXN1bHQsXG4gICAgICAgICAgc2hhcmRSZXN1bHQsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhZ2dyZWdhdGVSZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGF3YWl0IGdldEFnZ3JlZ2F0ZXMoXG4gICAgYXBwLmhpZXJhcmNoeSxcbiAgICBhcHAuZGF0YXN0b3JlLFxuICAgIGluZGV4Tm9kZSxcbiAgICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXkoaW5kZXhLZXkpLFxuICApO1xufTtcblxuY29uc3QgbWVyZ2VTaGFyZEFnZ3JlZ2F0ZSA9ICh0b3RhbHMsIHNoYXJkKSA9PiB7XG4gIGNvbnN0IG1lcmdlR3JvdXBpbmcgPSAodG90LCBzaHIpID0+IHtcbiAgICB0b3QuY291bnQgKz0gc2hyLmNvdW50O1xuICAgIGZvciAoY29uc3QgYWdnTmFtZSBpbiB0b3QpIHtcbiAgICAgIGlmIChhZ2dOYW1lID09PSAnY291bnQnKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IHRvdGFnZyA9IHRvdFthZ2dOYW1lXTtcbiAgICAgIGNvbnN0IHNocmFnZyA9IHNoclthZ2dOYW1lXTtcbiAgICAgIHRvdGFnZy5zdW0gKz0gc2hyYWdnLnN1bTtcbiAgICAgIHRvdGFnZy5tYXggPSB0b3RhZ2cubWF4ID4gc2hyYWdnLm1heFxuICAgICAgICA/IHRvdGFnZy5tYXhcbiAgICAgICAgOiBzaHJhZ2cubWF4O1xuICAgICAgdG90YWdnLm1pbiA9IHRvdGFnZy5taW4gPCBzaHJhZ2cubWluXG4gICAgICAgID8gdG90YWdnLm1pblxuICAgICAgICA6IHNocmFnZy5taW47XG4gICAgICB0b3RhZ2cubWVhbiA9IHRvdGFnZy5zdW0gLyB0b3QuY291bnQ7XG4gICAgfVxuICAgIHJldHVybiB0b3Q7XG4gIH07XG5cbiAgZm9yIChjb25zdCBhZ2dHcm91cERlZiBpbiB0b3RhbHMpIHtcbiAgICBmb3IgKGNvbnN0IGdyb3VwaW5nIGluIHNoYXJkW2FnZ0dyb3VwRGVmXSkge1xuICAgICAgY29uc3QgZ3JvdXBpbmdUb3RhbCA9IHRvdGFsc1thZ2dHcm91cERlZl1bZ3JvdXBpbmddO1xuICAgICAgdG90YWxzW2FnZ0dyb3VwRGVmXVtncm91cGluZ10gPSBpc1VuZGVmaW5lZChncm91cGluZ1RvdGFsKVxuICAgICAgICA/IHNoYXJkW2FnZ0dyb3VwRGVmXVtncm91cGluZ11cbiAgICAgICAgOiBtZXJnZUdyb3VwaW5nKFxuICAgICAgICAgIHRvdGFsc1thZ2dHcm91cERlZl1bZ3JvdXBpbmddLFxuICAgICAgICAgIHNoYXJkW2FnZ0dyb3VwRGVmXVtncm91cGluZ10sXG4gICAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRvdGFscztcbn07XG5cbmNvbnN0IGdldEFnZ3JlZ2F0ZXMgPSBhc3luYyAoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSkgPT4ge1xuICBjb25zdCBhZ2dyZWdhdGVSZXN1bHQgPSB7fTtcbiAgY29uc3QgZG9SZWFkID0gaXRlcmF0ZUluZGV4KFxuICAgICAgICBhc3luYyBpdGVtID0+IHtcbiAgICAgIGFwcGx5SXRlbVRvQWdncmVnYXRlUmVzdWx0KFxuICAgICAgICBpbmRleCwgYWdncmVnYXRlUmVzdWx0LCBpdGVtLFxuICAgICAgKTtcbiAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XG4gICAgfSxcbiAgICAgICAgYXN5bmMgKCkgPT4gYWdncmVnYXRlUmVzdWx0XG4gICk7XG5cbiAgcmV0dXJuIGF3YWl0IGRvUmVhZChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KTtcbn07XG5cblxuY29uc3QgYXBwbHlJdGVtVG9BZ2dyZWdhdGVSZXN1bHQgPSAoaW5kZXhOb2RlLCByZXN1bHQsIGl0ZW0pID0+IHtcbiAgY29uc3QgZ2V0SW5pdGlhbEFnZ3JlZ2F0ZVJlc3VsdCA9ICgpID0+ICh7XG4gICAgc3VtOiAwLCBtZWFuOiBudWxsLCBtYXg6IG51bGwsIG1pbjogbnVsbCxcbiAgfSk7XG5cbiAgY29uc3QgYXBwbHlBZ2dyZWdhdGVSZXN1bHQgPSAoYWdnLCBleGlzdGluZywgY291bnQpID0+IHtcbiAgICBjb25zdCB2YWx1ZSA9IGNvbXBpbGVDb2RlKGFnZy5hZ2dyZWdhdGVkVmFsdWUpKHsgcmVjb3JkOiBpdGVtIH0pO1xuXG4gICAgaWYgKCFpc051bWJlcih2YWx1ZSkpIHJldHVybiBleGlzdGluZztcblxuICAgIGV4aXN0aW5nLnN1bSArPSB2YWx1ZTtcbiAgICBleGlzdGluZy5tYXggPSB2YWx1ZSA+IGV4aXN0aW5nLm1heCB8fCBleGlzdGluZy5tYXggPT09IG51bGxcbiAgICAgID8gdmFsdWVcbiAgICAgIDogZXhpc3RpbmcubWF4O1xuICAgIGV4aXN0aW5nLm1pbiA9IHZhbHVlIDwgZXhpc3RpbmcubWluIHx8IGV4aXN0aW5nLm1pbiA9PT0gbnVsbFxuICAgICAgPyB2YWx1ZVxuICAgICAgOiBleGlzdGluZy5taW47XG4gICAgZXhpc3RpbmcubWVhbiA9IGV4aXN0aW5nLnN1bSAvIGNvdW50O1xuICAgIHJldHVybiBleGlzdGluZztcbiAgfTtcblxuICBmb3IgKGNvbnN0IGFnZ0dyb3VwIG9mIGluZGV4Tm9kZS5hZ2dyZWdhdGVHcm91cHMpIHtcbiAgICBpZiAoIWhhcyhhZ2dHcm91cC5uYW1lKShyZXN1bHQpKSB7XG4gICAgICByZXN1bHRbYWdnR3JvdXAubmFtZV0gPSB7fTtcbiAgICB9XG5cbiAgICBjb25zdCB0aGlzR3JvdXBSZXN1bHQgPSByZXN1bHRbYWdnR3JvdXAubmFtZV07XG5cbiAgICBpZiAoaXNOb25FbXB0eVN0cmluZyhhZ2dHcm91cC5jb25kaXRpb24pKSB7XG4gICAgICBpZiAoIWNvbXBpbGVFeHByZXNzaW9uKGFnZ0dyb3VwLmNvbmRpdGlvbikoeyByZWNvcmQ6IGl0ZW0gfSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGdyb3VwID0gaXNOb25FbXB0eVN0cmluZyhhZ2dHcm91cC5ncm91cEJ5KVxuICAgICAgPyBjb21waWxlQ29kZShhZ2dHcm91cC5ncm91cEJ5KSh7IHJlY29yZDogaXRlbSB9KVxuICAgICAgOiAnYWxsJztcbiAgICBpZiAoIWlzTm9uRW1wdHlTdHJpbmcoZ3JvdXApKSB7XG4gICAgICBncm91cCA9ICcobm9uZSknO1xuICAgIH1cblxuICAgIGlmICghaGFzKGdyb3VwKSh0aGlzR3JvdXBSZXN1bHQpKSB7XG4gICAgICB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdID0geyBjb3VudDogMCB9O1xuICAgICAgZm9yIChjb25zdCBhZ2cgb2YgYWdnR3JvdXAuYWdncmVnYXRlcykge1xuICAgICAgICB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdW2FnZy5uYW1lXSA9IGdldEluaXRpYWxBZ2dyZWdhdGVSZXN1bHQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdLmNvdW50Kys7XG5cbiAgICBmb3IgKGNvbnN0IGFnZyBvZiBhZ2dHcm91cC5hZ2dyZWdhdGVzKSB7XG4gICAgICBjb25zdCBleGlzdGluZ1ZhbHVlcyA9IHRoaXNHcm91cFJlc3VsdFtncm91cF1bYWdnLm5hbWVdO1xuICAgICAgdGhpc0dyb3VwUmVzdWx0W2dyb3VwXVthZ2cubmFtZV0gPSBhcHBseUFnZ3JlZ2F0ZVJlc3VsdChcbiAgICAgICAgYWdnLCBleGlzdGluZ1ZhbHVlcyxcbiAgICAgICAgdGhpc0dyb3VwUmVzdWx0W2dyb3VwXS5jb3VudCxcbiAgICAgICk7XG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgYnVpbGRJbmRleCB9IGZyb20gJy4vYnVpbGRJbmRleCc7XG5pbXBvcnQgeyBsaXN0SXRlbXMgfSBmcm9tICcuL2xpc3RJdGVtcyc7XG5pbXBvcnQgeyBhZ2dyZWdhdGVzIH0gZnJvbSAnLi9hZ2dyZWdhdGVzJztcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4QXBpID0gYXBwID0+ICh7XG4gIGxpc3RJdGVtczogbGlzdEl0ZW1zKGFwcCksXG4gIGJ1aWxkSW5kZXg6IGJ1aWxkSW5kZXgoYXBwKSxcbiAgYWdncmVnYXRlczogYWdncmVnYXRlcyhhcHApLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGdldEluZGV4QXBpO1xuIiwiaW1wb3J0IHsgZWFjaCwgZmluZCB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBtYXAsIG1heCwgY29uc3RhbnQgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIGpvaW5LZXksXG4gICQsIGlzTm90aGluZywgaXNTb21ldGhpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBpc0luZGV4LCBpc1Jvb3QsIGlzU2luZ2xlUmVjb3JkLCBpc0NvbGxlY3Rpb25SZWNvcmQsXG4gIGlzUmVjb3JkLCBpc2FnZ3JlZ2F0ZUdyb3VwLFxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG59IGZyb20gJy4vaGllcmFyY2h5JztcbmltcG9ydCB7IGFsbCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlTm9kZUVycm9ycyA9IHtcbiAgaW5kZXhDYW5ub3RCZVBhcmVudDogJ0luZGV4IHRlbXBsYXRlIGNhbm5vdCBiZSBhIHBhcmVudCcsXG4gIGFsbE5vblJvb3ROb2Rlc011c3RIYXZlUGFyZW50OiAnT25seSB0aGUgcm9vdCBub2RlIG1heSBoYXZlIG5vIHBhcmVudCcsXG4gIGluZGV4UGFyZW50TXVzdEJlUmVjb3JkT3JSb290OiAnQW4gaW5kZXggbWF5IG9ubHkgaGF2ZSBhIHJlY29yZCBvciByb290IGFzIGEgcGFyZW50JyxcbiAgYWdncmVnYXRlUGFyZW50TXVzdEJlQW5JbmRleDogJ2FnZ3JlZ2F0ZUdyb3VwIHBhcmVudCBtdXN0IGJlIGFuIGluZGV4Jyxcbn07XG5cbmNvbnN0IHBhdGhSZWd4TWFrZXIgPSBub2RlID0+ICgpID0+IG5vZGUubm9kZUtleSgpLnJlcGxhY2UoL3tpZH0vZywgJ1thLXpBLVowLTlfLV0rJyk7XG5cbmNvbnN0IG5vZGVLZXlNYWtlciA9IG5vZGUgPT4gKCkgPT4gc3dpdGNoQ2FzZShcblxuICBbbiA9PiBpc1JlY29yZChuKSAmJiAhaXNTaW5nbGVSZWNvcmQobiksXG4gICAgbiA9PiBqb2luS2V5KFxuICAgICAgbm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksXG4gICAgICBub2RlLmNvbGxlY3Rpb25OYW1lLFxuICAgICAgYCR7bi5ub2RlSWR9LXtpZH1gLFxuICAgICldLFxuXG4gIFtpc1Jvb3QsXG4gICAgY29uc3RhbnQoJy8nKV0sXG5cbiAgW2RlZmF1bHRDYXNlLFxuICAgIG4gPT4gam9pbktleShub2RlLnBhcmVudCgpLm5vZGVLZXkoKSwgbi5uYW1lKV0sXG5cbikobm9kZSk7XG5cblxuY29uc3QgdmFsaWRhdGUgPSBwYXJlbnQgPT4gKG5vZGUpID0+IHtcbiAgaWYgKGlzSW5kZXgobm9kZSlcbiAgICAgICAgJiYgaXNTb21ldGhpbmcocGFyZW50KVxuICAgICAgICAmJiAhaXNSb290KHBhcmVudClcbiAgICAgICAgJiYgIWlzUmVjb3JkKHBhcmVudCkpIHtcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGNyZWF0ZU5vZGVFcnJvcnMuaW5kZXhQYXJlbnRNdXN0QmVSZWNvcmRPclJvb3QpO1xuICB9XG5cbiAgaWYgKGlzYWdncmVnYXRlR3JvdXAobm9kZSlcbiAgICAgICAgJiYgaXNTb21ldGhpbmcocGFyZW50KVxuICAgICAgICAmJiAhaXNJbmRleChwYXJlbnQpKSB7XG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihjcmVhdGVOb2RlRXJyb3JzLmFnZ3JlZ2F0ZVBhcmVudE11c3RCZUFuSW5kZXgpO1xuICB9XG5cbiAgaWYgKGlzTm90aGluZyhwYXJlbnQpICYmICFpc1Jvb3Qobm9kZSkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihjcmVhdGVOb2RlRXJyb3JzLmFsbE5vblJvb3ROb2Rlc011c3RIYXZlUGFyZW50KTsgfVxuXG4gIHJldHVybiBub2RlO1xufTtcblxuY29uc3QgY29uc3RydWN0ID0gcGFyZW50ID0+IChub2RlKSA9PiB7XG4gIG5vZGUubm9kZUtleSA9IG5vZGVLZXlNYWtlcihub2RlKTtcbiAgbm9kZS5wYXRoUmVneCA9IHBhdGhSZWd4TWFrZXIobm9kZSk7XG4gIG5vZGUucGFyZW50ID0gY29uc3RhbnQocGFyZW50KTtcbiAgbm9kZS5pc1Jvb3QgPSAoKSA9PiBpc05vdGhpbmcocGFyZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgbm9kZS5uYW1lID09PSAncm9vdCdcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIG5vZGUudHlwZSA9PT0gJ3Jvb3QnO1xuICBpZiAoaXNDb2xsZWN0aW9uUmVjb3JkKG5vZGUpKSB7XG4gICAgbm9kZS5jb2xsZWN0aW9uTm9kZUtleSA9ICgpID0+IGpvaW5LZXkoXG4gICAgICBwYXJlbnQubm9kZUtleSgpLCBub2RlLmNvbGxlY3Rpb25OYW1lLFxuICAgICk7XG4gICAgbm9kZS5jb2xsZWN0aW9uUGF0aFJlZ3ggPSAoKSA9PiBqb2luS2V5KFxuICAgICAgcGFyZW50LnBhdGhSZWd4KCksIG5vZGUuY29sbGVjdGlvbk5hbWUsXG4gICAgKTtcbiAgfVxuICByZXR1cm4gbm9kZTtcbn07XG5cbmNvbnN0IGFkZFRvUGFyZW50ID0gKG9iaikgPT4ge1xuICBjb25zdCBwYXJlbnQgPSBvYmoucGFyZW50KCk7XG4gIGlmIChpc1NvbWV0aGluZyhwYXJlbnQpKSB7XG4gICAgaWYgKGlzSW5kZXgob2JqKSlcbiAgICAvLyBROiB3aHkgYXJlIGluZGV4ZXMgbm90IGNoaWxkcmVuID9cbiAgICAvLyBBOiBiZWNhdXNlIHRoZXkgY2Fubm90IGhhdmUgY2hpbGRyZW4gb2YgdGhlaXIgb3duLlxuICAgIHsgcGFyZW50LmluZGV4ZXMucHVzaChvYmopOyB9IGVsc2UgaWYgKGlzYWdncmVnYXRlR3JvdXAob2JqKSkgeyBwYXJlbnQuYWdncmVnYXRlR3JvdXBzLnB1c2gob2JqKTsgfSBlbHNlIHsgcGFyZW50LmNoaWxkcmVuLnB1c2gob2JqKTsgfVxuXG4gICAgaWYgKGlzUmVjb3JkKG9iaikpIHtcbiAgICAgIGNvbnN0IGRlZmF1bHRJbmRleCA9IGZpbmQoXG4gICAgICAgIHBhcmVudC5pbmRleGVzLFxuICAgICAgICBpID0+IGkubmFtZSA9PT0gYCR7cGFyZW50Lm5hbWV9X2luZGV4YCxcbiAgICAgICk7XG4gICAgICBpZiAoZGVmYXVsdEluZGV4KSB7XG4gICAgICAgIGRlZmF1bHRJbmRleC5hbGxvd2VkUmVjb3JkTm9kZUlkcy5wdXNoKG9iai5ub2RlSWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqO1xufTtcblxuZXhwb3J0IGNvbnN0IGNvbnN0cnVjdE5vZGUgPSAocGFyZW50LCBvYmopID0+ICQob2JqLCBbXG4gIGNvbnN0cnVjdChwYXJlbnQpLFxuICB2YWxpZGF0ZShwYXJlbnQpLFxuICBhZGRUb1BhcmVudCxcbl0pO1xuXG5jb25zdCBnZXROb2RlSWQgPSAocGFyZW50Tm9kZSkgPT4ge1xuICAvLyB0aGlzIGNhc2UgaXMgaGFuZGxlZCBiZXR0ZXIgZWxzZXdoZXJlXG4gIGlmICghcGFyZW50Tm9kZSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGZpbmRSb290ID0gbiA9PiAoaXNSb290KG4pID8gbiA6IGZpbmRSb290KG4ucGFyZW50KCkpKTtcbiAgY29uc3Qgcm9vdCA9IGZpbmRSb290KHBhcmVudE5vZGUpO1xuXG4gIHJldHVybiAoJChyb290LCBbXG4gICAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICAgIG1hcChuID0+IG4ubm9kZUlkKSxcbiAgICBtYXhdKSArIDEpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNvbnN0cnVjdEhpZXJhcmNoeSA9IChub2RlLCBwYXJlbnQpID0+IHtcbiAgY29uc3RydWN0KHBhcmVudCkobm9kZSk7XG4gIGlmIChub2RlLmluZGV4ZXMpIHtcbiAgICBlYWNoKG5vZGUuaW5kZXhlcyxcbiAgICAgIGNoaWxkID0+IGNvbnN0cnVjdEhpZXJhcmNoeShjaGlsZCwgbm9kZSkpO1xuICB9XG4gIGlmIChub2RlLmFnZ3JlZ2F0ZUdyb3Vwcykge1xuICAgIGVhY2gobm9kZS5hZ2dyZWdhdGVHcm91cHMsXG4gICAgICBjaGlsZCA9PiBjb25zdHJ1Y3RIaWVyYXJjaHkoY2hpbGQsIG5vZGUpKTtcbiAgfVxuICBpZiAobm9kZS5jaGlsZHJlbiAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICBlYWNoKG5vZGUuY2hpbGRyZW4sXG4gICAgICBjaGlsZCA9PiBjb25zdHJ1Y3RIaWVyYXJjaHkoY2hpbGQsIG5vZGUpKTtcbiAgfVxuICBpZiAobm9kZS5maWVsZHMpIHtcbiAgICBlYWNoKG5vZGUuZmllbGRzLFxuICAgICAgZiA9PiBlYWNoKGYudHlwZU9wdGlvbnMsICh2YWwsIGtleSkgPT4ge1xuICAgICAgICBjb25zdCBkZWYgPSBhbGxbZi50eXBlXS5vcHRpb25EZWZpbml0aW9uc1trZXldO1xuICAgICAgICBpZiAoIWRlZikge1xuICAgICAgICAgIC8vIHVua25vd24gdHlwZU9wdGlvblxuICAgICAgICAgIGRlbGV0ZSBmLnR5cGVPcHRpb25zW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZi50eXBlT3B0aW9uc1trZXldID0gZGVmLnBhcnNlKHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pKTtcbiAgfVxuICByZXR1cm4gbm9kZTtcbn07XG5cblxuZXhwb3J0IGNvbnN0IGdldE5ld1Jvb3RMZXZlbCA9ICgpID0+IGNvbnN0cnVjdCgpKHtcbiAgbmFtZTogJ3Jvb3QnLFxuICB0eXBlOiAncm9vdCcsXG4gIGNoaWxkcmVuOiBbXSxcbiAgcGF0aE1hcHM6IFtdLFxuICBpbmRleGVzOiBbXSxcbiAgbm9kZUlkOiAwLFxufSk7XG5cbmNvbnN0IF9nZXROZXdSZWNvcmRUZW1wbGF0ZSA9IChwYXJlbnQsIG5hbWUsIGNyZWF0ZURlZmF1bHRJbmRleCwgaXNTaW5nbGUpID0+IHtcbiAgY29uc3Qgbm9kZSA9IGNvbnN0cnVjdE5vZGUocGFyZW50LCB7XG4gICAgbmFtZSxcbiAgICB0eXBlOiAncmVjb3JkJyxcbiAgICBmaWVsZHM6IFtdLFxuICAgIGNoaWxkcmVuOiBbXSxcbiAgICB2YWxpZGF0aW9uUnVsZXM6IFtdLFxuICAgIG5vZGVJZDogZ2V0Tm9kZUlkKHBhcmVudCksXG4gICAgaW5kZXhlczogW10sXG4gICAgYWxsaWRzU2hhcmRGYWN0b3I6IGlzUmVjb3JkKHBhcmVudCkgPyAxIDogNjQsXG4gICAgY29sbGVjdGlvbk5hbWU6ICcnLFxuICAgIGlzU2luZ2xlLFxuICB9KTtcblxuICBpZiAoY3JlYXRlRGVmYXVsdEluZGV4KSB7XG4gICAgY29uc3QgZGVmYXVsdEluZGV4ID0gZ2V0TmV3SW5kZXhUZW1wbGF0ZShwYXJlbnQpO1xuICAgIGRlZmF1bHRJbmRleC5uYW1lID0gYCR7bmFtZX1faW5kZXhgO1xuICAgIGRlZmF1bHRJbmRleC5hbGxvd2VkUmVjb3JkTm9kZUlkcy5wdXNoKG5vZGUubm9kZUlkKTtcbiAgfVxuXG4gIHJldHVybiBub2RlO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld1JlY29yZFRlbXBsYXRlID0gKHBhcmVudCwgbmFtZSA9ICcnLCBjcmVhdGVEZWZhdWx0SW5kZXggPSB0cnVlKSA9PiBfZ2V0TmV3UmVjb3JkVGVtcGxhdGUocGFyZW50LCBuYW1lLCBjcmVhdGVEZWZhdWx0SW5kZXgsIGZhbHNlKTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld1NpbmdsZVJlY29yZFRlbXBsYXRlID0gcGFyZW50ID0+IF9nZXROZXdSZWNvcmRUZW1wbGF0ZShwYXJlbnQsICcnLCBmYWxzZSwgdHJ1ZSk7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdJbmRleFRlbXBsYXRlID0gKHBhcmVudCwgdHlwZSA9ICdhbmNlc3RvcicpID0+IGNvbnN0cnVjdE5vZGUocGFyZW50LCB7XG4gIG5hbWU6ICcnLFxuICB0eXBlOiAnaW5kZXgnLFxuICBtYXA6ICdyZXR1cm4gey4uLnJlY29yZH07JyxcbiAgZmlsdGVyOiAnJyxcbiAgaW5kZXhUeXBlOiB0eXBlLFxuICBnZXRTaGFyZE5hbWU6ICcnLFxuICBnZXRTb3J0S2V5OiAncmVjb3JkLmlkJyxcbiAgYWdncmVnYXRlR3JvdXBzOiBbXSxcbiAgYWxsb3dlZFJlY29yZE5vZGVJZHM6IFtdLFxuICBub2RlSWQ6IGdldE5vZGVJZChwYXJlbnQpLFxufSk7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdBZ2dyZWdhdGVHcm91cFRlbXBsYXRlID0gaW5kZXggPT4gY29uc3RydWN0Tm9kZShpbmRleCwge1xuICBuYW1lOiAnJyxcbiAgdHlwZTogJ2FnZ3JlZ2F0ZUdyb3VwJyxcbiAgZ3JvdXBCeTogJycsXG4gIGFnZ3JlZ2F0ZXM6IFtdLFxuICBjb25kaXRpb246ICcnLFxuICBub2RlSWQ6IGdldE5vZGVJZChpbmRleCksXG59KTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0FnZ3JlZ2F0ZVRlbXBsYXRlID0gKHNldCkgPT4ge1xuICBjb25zdCBhZ2dyZWdhdGVkVmFsdWUgPSB7XG4gICAgbmFtZTogJycsXG4gICAgYWdncmVnYXRlZFZhbHVlOiAnJyxcbiAgfTtcbiAgc2V0LmFnZ3JlZ2F0ZXMucHVzaChhZ2dyZWdhdGVkVmFsdWUpO1xuICByZXR1cm4gYWdncmVnYXRlZFZhbHVlO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXROZXdSb290TGV2ZWwsXG4gIGdldE5ld1JlY29yZFRlbXBsYXRlLFxuICBnZXROZXdJbmRleFRlbXBsYXRlLFxuICBjcmVhdGVOb2RlRXJyb3JzLFxuICBjb25zdHJ1Y3RIaWVyYXJjaHksXG4gIGdldE5ld0FnZ3JlZ2F0ZUdyb3VwVGVtcGxhdGUsXG4gIGdldE5ld0FnZ3JlZ2F0ZVRlbXBsYXRlLFxufTtcbiIsImltcG9ydCB7XG4gIHNvbWUsIG1hcCwgZmlsdGVyLCBrZXlzLCBpbmNsdWRlcyxcbiAgY291bnRCeSwgZmxhdHRlbixcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIGlzU29tZXRoaW5nLCAkLFxuICBpc05vbkVtcHR5U3RyaW5nLFxuICBpc05vdGhpbmdPckVtcHR5LFxuICBpc05vdGhpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBhbGwsIGdldERlZmF1bHRPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSB9IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgZmllbGRFcnJvcnMgPSB7XG4gIEFkZEZpZWxkVmFsaWRhdGlvbkZhaWxlZDogJ0FkZCBmaWVsZCB2YWxpZGF0aW9uOiAnLFxufTtcblxuZXhwb3J0IGNvbnN0IGFsbG93ZWRUeXBlcyA9ICgpID0+IGtleXMoYWxsKTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0ZpZWxkID0gdHlwZSA9PiAoe1xuICBuYW1lOiAnJywgLy8gaG93IGZpZWxkIGlzIHJlZmVyZW5jZWQgaW50ZXJuYWxseVxuICB0eXBlLFxuICB0eXBlT3B0aW9uczogZ2V0RGVmYXVsdE9wdGlvbnModHlwZSksXG4gIGxhYmVsOiAnJywgLy8gaG93IGZpZWxkIGlzIGRpc3BsYXllZFxuICBnZXRJbml0aWFsVmFsdWU6ICdkZWZhdWx0JywgLy8gZnVuY3Rpb24gdGhhdCBnZXRzIHZhbHVlIHdoZW4gaW5pdGlhbGx5IGNyZWF0ZWRcbiAgZ2V0VW5kZWZpbmVkVmFsdWU6ICdkZWZhdWx0JywgLy8gZnVuY3Rpb24gdGhhdCBnZXRzIHZhbHVlIHdoZW4gZmllbGQgdW5kZWZpbmVkIG9uIHJlY29yZFxufSk7XG5cbmNvbnN0IGZpZWxkUnVsZXMgPSBhbGxGaWVsZHMgPT4gW1xuICBtYWtlcnVsZSgnbmFtZScsICdmaWVsZCBuYW1lIGlzIG5vdCBzZXQnLFxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ3R5cGUnLCAnZmllbGQgdHlwZSBpcyBub3Qgc2V0JyxcbiAgICBmID0+IGlzTm9uRW1wdHlTdHJpbmcoZi50eXBlKSksXG4gIG1ha2VydWxlKCdsYWJlbCcsICdmaWVsZCBsYWJlbCBpcyBub3Qgc2V0JyxcbiAgICBmID0+IGlzTm9uRW1wdHlTdHJpbmcoZi5sYWJlbCkpLFxuICBtYWtlcnVsZSgnZ2V0SW5pdGlhbFZhbHVlJywgJ2dldEluaXRpYWxWYWx1ZSBmdW5jdGlvbiBpcyBub3Qgc2V0JyxcbiAgICBmID0+IGlzTm9uRW1wdHlTdHJpbmcoZi5nZXRJbml0aWFsVmFsdWUpKSxcbiAgbWFrZXJ1bGUoJ2dldFVuZGVmaW5lZFZhbHVlJywgJ2dldFVuZGVmaW5lZFZhbHVlIGZ1bmN0aW9uIGlzIG5vdCBzZXQnLFxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLmdldFVuZGVmaW5lZFZhbHVlKSksXG4gIG1ha2VydWxlKCduYW1lJywgJ2ZpZWxkIG5hbWUgaXMgZHVwbGljYXRlZCcsXG4gICAgZiA9PiBpc05vdGhpbmdPckVtcHR5KGYubmFtZSlcbiAgICAgICAgICAgICB8fCBjb3VudEJ5KCduYW1lJykoYWxsRmllbGRzKVtmLm5hbWVdID09PSAxKSxcbiAgbWFrZXJ1bGUoJ3R5cGUnLCAndHlwZSBpcyB1bmtub3duJyxcbiAgICBmID0+IGlzTm90aGluZ09yRW1wdHkoZi50eXBlKVxuICAgICAgICAgICAgIHx8IHNvbWUodCA9PiBmLnR5cGUgPT09IHQpKGFsbG93ZWRUeXBlcygpKSksXG5dO1xuXG5jb25zdCB0eXBlT3B0aW9uc1J1bGVzID0gKGZpZWxkKSA9PiB7XG4gIGNvbnN0IHR5cGUgPSBhbGxbZmllbGQudHlwZV07XG4gIGlmIChpc05vdGhpbmcodHlwZSkpIHJldHVybiBbXTtcblxuICBjb25zdCBkZWYgPSBvcHROYW1lID0+IHR5cGUub3B0aW9uRGVmaW5pdGlvbnNbb3B0TmFtZV07XG5cbiAgcmV0dXJuICQoZmllbGQudHlwZU9wdGlvbnMsIFtcbiAgICBrZXlzLFxuICAgIGZpbHRlcihvID0+IGlzU29tZXRoaW5nKGRlZihvKSlcbiAgICAgICAgICAgICAgICAgICAgJiYgaXNTb21ldGhpbmcoZGVmKG8pLmlzVmFsaWQpKSxcbiAgICBtYXAobyA9PiBtYWtlcnVsZShcbiAgICAgIGB0eXBlT3B0aW9ucy4ke299YCxcbiAgICAgIGAke2RlZihvKS5yZXF1aXJlbWVudERlc2NyaXB0aW9ufWAsXG4gICAgICBmaWVsZCA9PiBkZWYobykuaXNWYWxpZChmaWVsZC50eXBlT3B0aW9uc1tvXSksXG4gICAgKSksXG4gIF0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlRmllbGQgPSBhbGxGaWVsZHMgPT4gKGZpZWxkKSA9PiB7XG4gIGNvbnN0IGV2ZXJ5U2luZ2xlRmllbGQgPSBpbmNsdWRlcyhmaWVsZCkoYWxsRmllbGRzKSA/IGFsbEZpZWxkcyA6IFsuLi5hbGxGaWVsZHMsIGZpZWxkXTtcbiAgcmV0dXJuIGFwcGx5UnVsZVNldChbLi4uZmllbGRSdWxlcyhldmVyeVNpbmdsZUZpZWxkKSwgLi4udHlwZU9wdGlvbnNSdWxlcyhmaWVsZCldKShmaWVsZCk7XG59O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBbGxGaWVsZHMgPSByZWNvcmROb2RlID0+ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgbWFwKHZhbGlkYXRlRmllbGQocmVjb3JkTm9kZS5maWVsZHMpKSxcbiAgZmxhdHRlbixcbl0pO1xuXG5leHBvcnQgY29uc3QgYWRkRmllbGQgPSAocmVjb3JkVGVtcGxhdGUsIGZpZWxkKSA9PiB7XG4gIGlmIChpc05vdGhpbmdPckVtcHR5KGZpZWxkLmxhYmVsKSkge1xuICAgIGZpZWxkLmxhYmVsID0gZmllbGQubmFtZTtcbiAgfVxuICBjb25zdCB2YWxpZGF0aW9uTWVzc2FnZXMgPSB2YWxpZGF0ZUZpZWxkKFsuLi5yZWNvcmRUZW1wbGF0ZS5maWVsZHMsIGZpZWxkXSkoZmllbGQpO1xuICBpZiAodmFsaWRhdGlvbk1lc3NhZ2VzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBlcnJvcnMgPSBtYXAobSA9PiBtLmVycm9yKSh2YWxpZGF0aW9uTWVzc2FnZXMpO1xuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYCR7ZmllbGRFcnJvcnMuQWRkRmllbGRWYWxpZGF0aW9uRmFpbGVkfSAke2Vycm9ycy5qb2luKCcsICcpfWApO1xuICB9XG4gIHJlY29yZFRlbXBsYXRlLmZpZWxkcy5wdXNoKGZpZWxkKTtcbn07XG4iLCJpbXBvcnQgeyBpc051bWJlciwgaXNCb29sZWFuLCBkZWZhdWx0Q2FzZSB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBzd2l0Y2hDYXNlIH0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdldE5ld1JlY29yZFZhbGlkYXRpb25SdWxlID0gKGludmFsaWRGaWVsZHMsXG4gIG1lc3NhZ2VXaGVuSW52YWxpZCxcbiAgZXhwcmVzc2lvbldoZW5WYWxpZCkgPT4gKHtcbiAgaW52YWxpZEZpZWxkcywgbWVzc2FnZVdoZW5JbnZhbGlkLCBleHByZXNzaW9uV2hlblZhbGlkLFxufSk7XG5cbmNvbnN0IGdldFN0YXRpY1ZhbHVlID0gc3dpdGNoQ2FzZShcbiAgW2lzTnVtYmVyLCB2ID0+IHYudG9TdHJpbmcoKV0sXG4gIFtpc0Jvb2xlYW4sIHYgPT4gdi50b1N0cmluZygpXSxcbiAgW2RlZmF1bHRDYXNlLCB2ID0+IGAnJHt2fSdgXSxcbik7XG5cbmV4cG9ydCBjb25zdCBjb21tb25SZWNvcmRWYWxpZGF0aW9uUnVsZXMgPSAoe1xuXG4gIGZpZWxkTm90RW1wdHk6IGZpZWxkTmFtZSA9PiBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZShcbiAgICBbZmllbGROYW1lXSxcbiAgICBgJHtmaWVsZE5hbWV9IGlzIGVtcHR5YCxcbiAgICBgIV8uaXNFbXB0eShyZWNvcmRbJyR7ZmllbGROYW1lfSddKWAsXG4gICksXG5cbiAgZmllbGRCZXR3ZWVuOiAoZmllbGROYW1lLCBtaW4sIG1heCkgPT4gZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUoXG4gICAgW2ZpZWxkTmFtZV0sXG4gICAgYCR7ZmllbGROYW1lfSBtdXN0IGJlIGJldHdlZW4gJHttaW4udG9TdHJpbmcoKX0gYW5kICR7bWF4LnRvU3RyaW5nKCl9YCxcbiAgICBgcmVjb3JkWycke2ZpZWxkTmFtZX0nXSA+PSAke2dldFN0YXRpY1ZhbHVlKG1pbil9ICYmICByZWNvcmRbJyR7ZmllbGROYW1lfSddIDw9ICR7Z2V0U3RhdGljVmFsdWUobWF4KX0gYCxcbiAgKSxcblxuICBmaWVsZEdyZWF0ZXJUaGFuOiAoZmllbGROYW1lLCBtaW4sIG1heCkgPT4gZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUoXG4gICAgW2ZpZWxkTmFtZV0sXG4gICAgYCR7ZmllbGROYW1lfSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAke21pbi50b1N0cmluZygpfSBhbmQgJHttYXgudG9TdHJpbmcoKX1gLFxuICAgIGByZWNvcmRbJyR7ZmllbGROYW1lfSddID49ICR7Z2V0U3RhdGljVmFsdWUobWluKX0gIGAsXG4gICksXG59KTtcblxuZXhwb3J0IGNvbnN0IGFkZFJlY29yZFZhbGlkYXRpb25SdWxlID0gcmVjb3JkTm9kZSA9PiBydWxlID0+IHJlY29yZE5vZGUudmFsaWRhdGlvblJ1bGVzLnB1c2gocnVsZSk7XG4iLCJcbmV4cG9ydCBjb25zdCBjcmVhdGVUcmlnZ2VyID0gKCkgPT4gKHtcbiAgYWN0aW9uTmFtZTogJycsXG4gIGV2ZW50TmFtZTogJycsXG4gIC8vIGZ1bmN0aW9uLCBoYXMgYWNjZXNzIHRvIGV2ZW50IGNvbnRleHQsXG4gIC8vIHJldHVybnMgb2JqZWN0IHRoYXQgaXMgdXNlZCBhcyBwYXJhbWV0ZXIgdG8gYWN0aW9uXG4gIC8vIG9ubHkgdXNlZCBpZiB0cmlnZ2VyZWQgYnkgZXZlbnRcbiAgb3B0aW9uc0NyZWF0b3I6ICcnLFxuICAvLyBhY3Rpb24gcnVucyBpZiB0cnVlLFxuICAvLyBoYXMgYWNjZXNzIHRvIGV2ZW50IGNvbnRleHRcbiAgY29uZGl0aW9uOiAnJyxcbn0pO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlQWN0aW9uID0gKCkgPT4gKHtcbiAgbmFtZTogJycsXG4gIGJlaGF2aW91clNvdXJjZTogJycsXG4gIC8vIG5hbWUgb2YgZnVuY3Rpb24gaW4gYWN0aW9uU291cmNlXG4gIGJlaGF2aW91ck5hbWU6ICcnLFxuICAvLyBwYXJhbWV0ZXIgcGFzc2VkIGludG8gYmVoYXZpb3VyLlxuICAvLyBhbnkgb3RoZXIgcGFybXMgcGFzc2VkIGF0IHJ1bnRpbWUgZS5nLlxuICAvLyBieSB0cmlnZ2VyLCBvciBtYW51YWxseSwgd2lsbCBiZSBtZXJnZWQgaW50byB0aGlzXG4gIGluaXRpYWxPcHRpb25zOiB7fSxcbn0pO1xuIiwiaW1wb3J0IHsgZmxhdHRlbiwgbWFwLCBpc0VtcHR5IH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGNvbXBpbGVDb2RlIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xuaW1wb3J0IHtcbiAgaXNOb25FbXB0eVN0cmluZywgXG4gIGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbiwgJCwgXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuXG5jb25zdCBhZ2dyZWdhdGVSdWxlcyA9IFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnY2hvb3NlIGEgbmFtZSBmb3IgdGhlIGFnZ3JlZ2F0ZScsXG4gICAgYSA9PiBpc05vbkVtcHR5U3RyaW5nKGEubmFtZSkpLFxuICBtYWtlcnVsZSgnYWdncmVnYXRlZFZhbHVlJywgJ2FnZ3JlZ2F0ZWRWYWx1ZSBkb2VzIG5vdCBjb21waWxlJyxcbiAgICBhID0+IGlzRW1wdHkoYS5hZ2dyZWdhdGVkVmFsdWUpXG4gICAgICAgICAgICB8fCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24oXG4gICAgICAgICAgICAgICgpID0+IGNvbXBpbGVDb2RlKGEuYWdncmVnYXRlZFZhbHVlKSxcbiAgICAgICAgICAgICkpLFxuXTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWdncmVnYXRlID0gYWdncmVnYXRlID0+IGFwcGx5UnVsZVNldChhZ2dyZWdhdGVSdWxlcykoYWdncmVnYXRlKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWxsQWdncmVnYXRlcyA9IGFsbCA9PiAkKGFsbCwgW1xuICBtYXAodmFsaWRhdGVBZ2dyZWdhdGUpLFxuICBmbGF0dGVuLFxuXSk7XG4iLCJpbXBvcnQge1xuICBmaWx0ZXIsIHVuaW9uLCBjb25zdGFudCxcbiAgbWFwLCBmbGF0dGVuLCBldmVyeSwgdW5pcUJ5LFxuICBzb21lLCBpbmNsdWRlcywgaXNFbXB0eSwgaGFzXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBjb21waWxlRXhwcmVzc2lvbiwgY29tcGlsZUNvZGUgfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XG5pbXBvcnQge1xuICAkLCBpc1NvbWV0aGluZywgc3dpdGNoQ2FzZSxcbiAgYW55VHJ1ZSwgaXNOb25FbXB0eUFycmF5LCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24sXG4gIGlzTm9uRW1wdHlTdHJpbmcsIGRlZmF1bHRDYXNlLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgaXNSZWNvcmQsIGlzUm9vdCwgaXNhZ2dyZWdhdGVHcm91cCxcbiAgaXNJbmRleCwgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxufSBmcm9tICcuL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBldmVudHNMaXN0IH0gZnJvbSAnLi4vY29tbW9uL2V2ZW50cyc7XG5pbXBvcnQgeyB2YWxpZGF0ZUFsbEZpZWxkcyB9IGZyb20gJy4vZmllbGRzJztcbmltcG9ydCB7XG4gIGFwcGx5UnVsZVNldCwgbWFrZXJ1bGUsIHN0cmluZ05vdEVtcHR5LFxuICB2YWxpZGF0aW9uRXJyb3IsXG59IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcbmltcG9ydCB7IGluZGV4UnVsZVNldCB9IGZyb20gJy4vaW5kZXhlcyc7XG5pbXBvcnQgeyB2YWxpZGF0ZUFsbEFnZ3JlZ2F0ZXMgfSBmcm9tICcuL3ZhbGlkYXRlQWdncmVnYXRlJztcblxuZXhwb3J0IGNvbnN0IHJ1bGVTZXQgPSAoLi4uc2V0cykgPT4gY29uc3RhbnQoZmxhdHRlbihbLi4uc2V0c10pKTtcblxuY29uc3QgY29tbW9uUnVsZXMgPSBbXG4gIG1ha2VydWxlKCduYW1lJywgJ25vZGUgbmFtZSBpcyBub3Qgc2V0JyxcbiAgICBub2RlID0+IHN0cmluZ05vdEVtcHR5KG5vZGUubmFtZSkpLFxuICBtYWtlcnVsZSgndHlwZScsICdub2RlIHR5cGUgbm90IHJlY29nbmlzZWQnLFxuICAgIGFueVRydWUoaXNSZWNvcmQsIGlzUm9vdCwgaXNJbmRleCwgaXNhZ2dyZWdhdGVHcm91cCkpLFxuXTtcblxuY29uc3QgcmVjb3JkUnVsZXMgPSBbXG4gIG1ha2VydWxlKCdmaWVsZHMnLCAnbm8gZmllbGRzIGhhdmUgYmVlbiBhZGRlZCB0byB0aGUgcmVjb3JkJyxcbiAgICBub2RlID0+IGlzTm9uRW1wdHlBcnJheShub2RlLmZpZWxkcykpLFxuICBtYWtlcnVsZSgndmFsaWRhdGlvblJ1bGVzJywgXCJ2YWxpZGF0aW9uIHJ1bGUgaXMgbWlzc2luZyBhICdtZXNzYWdlV2hlblZhbGlkJyBtZW1iZXJcIixcbiAgICBub2RlID0+IGV2ZXJ5KHIgPT4gaGFzKCdtZXNzYWdlV2hlbkludmFsaWQnKShyKSkobm9kZS52YWxpZGF0aW9uUnVsZXMpKSxcbiAgbWFrZXJ1bGUoJ3ZhbGlkYXRpb25SdWxlcycsIFwidmFsaWRhdGlvbiBydWxlIGlzIG1pc3NpbmcgYSAnZXhwcmVzc2lvbldoZW5WYWxpZCcgbWVtYmVyXCIsXG4gICAgbm9kZSA9PiBldmVyeShyID0+IGhhcygnZXhwcmVzc2lvbldoZW5WYWxpZCcpKHIpKShub2RlLnZhbGlkYXRpb25SdWxlcykpLFxuXTtcblxuXG5jb25zdCBhZ2dyZWdhdGVHcm91cFJ1bGVzID0gW1xuICBtYWtlcnVsZSgnY29uZGl0aW9uJywgJ2NvbmRpdGlvbiBkb2VzIG5vdCBjb21waWxlJyxcbiAgICBhID0+IGlzRW1wdHkoYS5jb25kaXRpb24pXG4gICAgICAgICAgICAgfHwgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uKFxuICAgICAgICAgICAgICAgKCkgPT4gY29tcGlsZUV4cHJlc3Npb24oYS5jb25kaXRpb24pLFxuICAgICAgICAgICAgICkpLFxuXTtcblxuY29uc3QgZ2V0UnVsZVNldCA9IG5vZGUgPT4gc3dpdGNoQ2FzZShcblxuICBbaXNSZWNvcmQsIHJ1bGVTZXQoXG4gICAgY29tbW9uUnVsZXMsXG4gICAgcmVjb3JkUnVsZXMsXG4gICldLFxuXG4gIFtpc0luZGV4LCBydWxlU2V0KFxuICAgIGNvbW1vblJ1bGVzLFxuICAgIGluZGV4UnVsZVNldCxcbiAgKV0sXG5cbiAgW2lzYWdncmVnYXRlR3JvdXAsIHJ1bGVTZXQoXG4gICAgY29tbW9uUnVsZXMsXG4gICAgYWdncmVnYXRlR3JvdXBSdWxlcyxcbiAgKV0sXG5cbiAgW2RlZmF1bHRDYXNlLCBydWxlU2V0KGNvbW1vblJ1bGVzLCBbXSldLFxuKShub2RlKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlTm9kZSA9IG5vZGUgPT4gYXBwbHlSdWxlU2V0KGdldFJ1bGVTZXQobm9kZSkpKG5vZGUpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBbGwgPSAoYXBwSGllcmFyY2h5KSA9PiB7XG4gIGNvbnN0IGZsYXR0ZW5lZCA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShcbiAgICBhcHBIaWVyYXJjaHksXG4gICk7XG5cbiAgY29uc3QgZHVwbGljYXRlTmFtZVJ1bGUgPSBtYWtlcnVsZShcbiAgICAnbmFtZScsICdub2RlIG5hbWVzIG11c3QgYmUgdW5pcXVlIHVuZGVyIHNoYXJlZCBwYXJlbnQnLFxuICAgIG4gPT4gZmlsdGVyKGYgPT4gZi5wYXJlbnQoKSA9PT0gbi5wYXJlbnQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBmLm5hbWUgPT09IG4ubmFtZSkoZmxhdHRlbmVkKS5sZW5ndGggPT09IDEsXG4gICk7XG5cbiAgY29uc3QgZHVwbGljYXRlTm9kZUtleUVycm9ycyA9ICQoZmxhdHRlbmVkLCBbXG4gICAgbWFwKG4gPT4gYXBwbHlSdWxlU2V0KFtkdXBsaWNhdGVOYW1lUnVsZV0pKG4pKSxcbiAgICBmaWx0ZXIoaXNTb21ldGhpbmcpLFxuICAgIGZsYXR0ZW4sXG4gIF0pO1xuXG4gIGNvbnN0IGZpZWxkRXJyb3JzID0gJChmbGF0dGVuZWQsIFtcbiAgICBmaWx0ZXIoaXNSZWNvcmQpLFxuICAgIG1hcCh2YWxpZGF0ZUFsbEZpZWxkcyksXG4gICAgZmxhdHRlbixcbiAgXSk7XG5cbiAgY29uc3QgYWdncmVnYXRlRXJyb3JzID0gJChmbGF0dGVuZWQsIFtcbiAgICBmaWx0ZXIoaXNhZ2dyZWdhdGVHcm91cCksXG4gICAgbWFwKHMgPT4gdmFsaWRhdGVBbGxBZ2dyZWdhdGVzKFxuICAgICAgcy5hZ2dyZWdhdGVzLFxuICAgICkpLFxuICAgIGZsYXR0ZW4sXG4gIF0pO1xuXG4gIHJldHVybiAkKGZsYXR0ZW5lZCwgW1xuICAgIG1hcCh2YWxpZGF0ZU5vZGUpLFxuICAgIGZsYXR0ZW4sXG4gICAgdW5pb24oZHVwbGljYXRlTm9kZUtleUVycm9ycyksXG4gICAgdW5pb24oZmllbGRFcnJvcnMpLFxuICAgIHVuaW9uKGFnZ3JlZ2F0ZUVycm9ycyksXG4gIF0pO1xufTtcblxuY29uc3QgYWN0aW9uUnVsZXMgPSBbXG4gIG1ha2VydWxlKCduYW1lJywgJ2FjdGlvbiBtdXN0IGhhdmUgYSBuYW1lJyxcbiAgICBhID0+IGlzTm9uRW1wdHlTdHJpbmcoYS5uYW1lKSksXG4gIG1ha2VydWxlKCdiZWhhdmlvdXJOYW1lJywgJ211c3Qgc3VwcGx5IGEgYmVoYXZpb3VyIG5hbWUgdG8gdGhlIGFjdGlvbicsXG4gICAgYSA9PiBpc05vbkVtcHR5U3RyaW5nKGEuYmVoYXZpb3VyTmFtZSkpLFxuICBtYWtlcnVsZSgnYmVoYXZpb3VyU291cmNlJywgJ211c3Qgc3VwcGx5IGEgYmVoYXZpb3VyIHNvdXJjZSBmb3IgdGhlIGFjdGlvbicsXG4gICAgYSA9PiBpc05vbkVtcHR5U3RyaW5nKGEuYmVoYXZpb3VyU291cmNlKSksXG5dO1xuXG5jb25zdCBkdXBsaWNhdGVBY3Rpb25SdWxlID0gbWFrZXJ1bGUoJycsICdhY3Rpb24gbmFtZSBtdXN0IGJlIHVuaXF1ZScsICgpID0+IHt9KTtcblxuY29uc3QgdmFsaWRhdGVBY3Rpb24gPSBhY3Rpb24gPT4gYXBwbHlSdWxlU2V0KGFjdGlvblJ1bGVzKShhY3Rpb24pO1xuXG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFjdGlvbnMgPSAoYWxsQWN0aW9ucykgPT4ge1xuICBjb25zdCBkdXBsaWNhdGVBY3Rpb25zID0gJChhbGxBY3Rpb25zLCBbXG4gICAgZmlsdGVyKGEgPT4gZmlsdGVyKGEyID0+IGEyLm5hbWUgPT09IGEubmFtZSkoYWxsQWN0aW9ucykubGVuZ3RoID4gMSksXG4gICAgbWFwKGEgPT4gdmFsaWRhdGlvbkVycm9yKGR1cGxpY2F0ZUFjdGlvblJ1bGUsIGEpKSxcbiAgXSk7XG5cbiAgY29uc3QgZXJyb3JzID0gJChhbGxBY3Rpb25zLCBbXG4gICAgbWFwKHZhbGlkYXRlQWN0aW9uKSxcbiAgICBmbGF0dGVuLFxuICAgIHVuaW9uKGR1cGxpY2F0ZUFjdGlvbnMpLFxuICAgIHVuaXFCeSgnbmFtZScpLFxuICBdKTtcblxuICByZXR1cm4gZXJyb3JzO1xufTtcblxuY29uc3QgdHJpZ2dlclJ1bGVzID0gYWN0aW9ucyA9PiAoW1xuICBtYWtlcnVsZSgnYWN0aW9uTmFtZScsICdtdXN0IHNwZWNpZnkgYW4gYWN0aW9uJyxcbiAgICB0ID0+IGlzTm9uRW1wdHlTdHJpbmcodC5hY3Rpb25OYW1lKSksXG4gIG1ha2VydWxlKCdldmVudE5hbWUnLCAnbXVzdCBzcGVjaWZ5IGFuZCBldmVudCcsXG4gICAgdCA9PiBpc05vbkVtcHR5U3RyaW5nKHQuZXZlbnROYW1lKSksXG4gIG1ha2VydWxlKCdhY3Rpb25OYW1lJywgJ3NwZWNpZmllZCBhY3Rpb24gbm90IHN1cHBsaWVkJyxcbiAgICB0ID0+ICF0LmFjdGlvbk5hbWVcbiAgICAgICAgICAgICB8fCBzb21lKGEgPT4gYS5uYW1lID09PSB0LmFjdGlvbk5hbWUpKGFjdGlvbnMpKSxcbiAgbWFrZXJ1bGUoJ2V2ZW50TmFtZScsICdpbnZhbGlkIEV2ZW50IE5hbWUnLFxuICAgIHQgPT4gIXQuZXZlbnROYW1lXG4gICAgICAgICAgICAgfHwgaW5jbHVkZXModC5ldmVudE5hbWUpKGV2ZW50c0xpc3QpKSxcbiAgbWFrZXJ1bGUoJ29wdGlvbnNDcmVhdG9yJywgJ09wdGlvbnMgQ3JlYXRvciBkb2VzIG5vdCBjb21waWxlIC0gY2hlY2sgeW91ciBleHByZXNzaW9uJyxcbiAgICAodCkgPT4ge1xuICAgICAgaWYgKCF0Lm9wdGlvbnNDcmVhdG9yKSByZXR1cm4gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbXBpbGVDb2RlKHQub3B0aW9uc0NyZWF0b3IpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKF8pIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfSksXG4gIG1ha2VydWxlKCdjb25kaXRpb24nLCAnVHJpZ2dlciBjb25kaXRpb24gZG9lcyBub3QgY29tcGlsZSAtIGNoZWNrIHlvdXIgZXhwcmVzc2lvbicsXG4gICAgKHQpID0+IHtcbiAgICAgIGlmICghdC5jb25kaXRpb24pIHJldHVybiB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29tcGlsZUV4cHJlc3Npb24odC5jb25kaXRpb24pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKF8pIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfSksXG5dKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVHJpZ2dlciA9ICh0cmlnZ2VyLCBhbGxBY3Rpb25zKSA9PiB7XG4gIGNvbnN0IGVycm9ycyA9IGFwcGx5UnVsZVNldCh0cmlnZ2VyUnVsZXMoYWxsQWN0aW9ucykpKHRyaWdnZXIpO1xuXG4gIHJldHVybiBlcnJvcnM7XG59O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVUcmlnZ2VycyA9ICh0cmlnZ2VycywgYWxsQWN0aW9ucykgPT4gJCh0cmlnZ2VycywgW1xuICBtYXAodCA9PiB2YWxpZGF0ZVRyaWdnZXIodCwgYWxsQWN0aW9ucykpLFxuICBmbGF0dGVuLFxuXSk7XG4iLCJpbXBvcnQgeyBhcHBEZWZpbml0aW9uRmlsZSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBjb25zdHJ1Y3RIaWVyYXJjaHkgfSBmcm9tICcuL2NyZWF0ZU5vZGVzJztcblxuZXhwb3J0IGNvbnN0IGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbiA9IGRhdGFzdG9yZSA9PiBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGRhdGFzdG9yZS5leGlzdHMoYXBwRGVmaW5pdGlvbkZpbGUpO1xuXG4gIGlmICghZXhpc3RzKSB0aHJvdyBuZXcgRXJyb3IoJ0FwcGxpY2F0aW9uIGRlZmluaXRpb24gZG9lcyBub3QgZXhpc3QnKTtcblxuICBjb25zdCBhcHBEZWZpbml0aW9uID0gYXdhaXQgZGF0YXN0b3JlLmxvYWRKc29uKGFwcERlZmluaXRpb25GaWxlKTtcbiAgYXBwRGVmaW5pdGlvbi5oaWVyYXJjaHkgPSBjb25zdHJ1Y3RIaWVyYXJjaHkoXG4gICAgYXBwRGVmaW5pdGlvbi5oaWVyYXJjaHksXG4gICk7XG4gIHJldHVybiBhcHBEZWZpbml0aW9uO1xufTtcbiIsImltcG9ydCB7IGpvaW4gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgYXBwRGVmaW5pdGlvbkZpbGUgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgdmFsaWRhdGVBbGwgfSBmcm9tICcuL3ZhbGlkYXRlJztcbmltcG9ydCB7IGFwaVdyYXBwZXIgfSBmcm9tICcuLi9jb21tb24vYXBpV3JhcHBlcic7XG5pbXBvcnQgeyBldmVudHMgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcblxuZXhwb3J0IGNvbnN0IHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSA9IGFwcCA9PiBhc3luYyBoaWVyYXJjaHkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMudGVtcGxhdGVBcGkuc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5LFxuICBwZXJtaXNzaW9uLndyaXRlVGVtcGxhdGVzLmlzQXV0aG9yaXplZCxcbiAgeyBoaWVyYXJjaHkgfSxcbiAgX3NhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSwgYXBwLmRhdGFzdG9yZSwgaGllcmFyY2h5LFxuKTtcblxuXG5leHBvcnQgY29uc3QgX3NhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSA9IGFzeW5jIChkYXRhc3RvcmUsIGhpZXJhcmNoeSkgPT4ge1xuICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gYXdhaXQgdmFsaWRhdGVBbGwoaGllcmFyY2h5KTtcbiAgaWYgKHZhbGlkYXRpb25FcnJvcnMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSGllcmFyY2h5IGlzIGludmFsaWQ6ICR7am9pbihcbiAgICAgIHZhbGlkYXRpb25FcnJvcnMubWFwKGUgPT4gYCR7ZS5pdGVtLm5vZGVLZXkgPyBlLml0ZW0ubm9kZUtleSgpIDogJyd9IDogJHtlLmVycm9yfWApLFxuICAgICAgJywnLFxuICAgICl9YCk7XG4gIH1cblxuICBpZiAoYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhhcHBEZWZpbml0aW9uRmlsZSkpIHtcbiAgICBjb25zdCBhcHBEZWZpbml0aW9uID0gYXdhaXQgZGF0YXN0b3JlLmxvYWRKc29uKGFwcERlZmluaXRpb25GaWxlKTtcbiAgICBhcHBEZWZpbml0aW9uLmhpZXJhcmNoeSA9IGhpZXJhcmNoeTtcbiAgICBhd2FpdCBkYXRhc3RvcmUudXBkYXRlSnNvbihhcHBEZWZpbml0aW9uRmlsZSwgYXBwRGVmaW5pdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcignLy5jb25maWcnKTtcbiAgICBjb25zdCBhcHBEZWZpbml0aW9uID0geyBhY3Rpb25zOiBbXSwgdHJpZ2dlcnM6IFtdLCBoaWVyYXJjaHkgfTtcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlSnNvbihhcHBEZWZpbml0aW9uRmlsZSwgYXBwRGVmaW5pdGlvbik7XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBqb2luIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBhcHBEZWZpbml0aW9uRmlsZSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyB2YWxpZGF0ZVRyaWdnZXJzLCB2YWxpZGF0ZUFjdGlvbnMgfSBmcm9tICcuL3ZhbGlkYXRlJztcbmltcG9ydCB7IGFwaVdyYXBwZXIgfSBmcm9tICcuLi9jb21tb24vYXBpV3JhcHBlcic7XG5pbXBvcnQgeyBldmVudHMgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3Qgc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycyA9IGFwcCA9PiBhc3luYyAoYWN0aW9ucywgdHJpZ2dlcnMpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLnRlbXBsYXRlQXBpLnNhdmVBY3Rpb25zQW5kVHJpZ2dlcnMsXG4gIHBlcm1pc3Npb24ud3JpdGVUZW1wbGF0ZXMuaXNBdXRob3JpemVkLFxuICB7IGFjdGlvbnMsIHRyaWdnZXJzIH0sXG4gIF9zYXZlQWN0aW9uc0FuZFRyaWdnZXJzLCBhcHAuZGF0YXN0b3JlLCBhY3Rpb25zLCB0cmlnZ2Vycyxcbik7XG5cbmV4cG9ydCBjb25zdCBfc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycyA9IGFzeW5jIChkYXRhc3RvcmUsIGFjdGlvbnMsIHRyaWdnZXJzKSA9PiB7XG4gIGlmIChhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGFwcERlZmluaXRpb25GaWxlKSkge1xuICAgIGNvbnN0IGFwcERlZmluaXRpb24gPSBhd2FpdCBkYXRhc3RvcmUubG9hZEpzb24oYXBwRGVmaW5pdGlvbkZpbGUpO1xuICAgIGFwcERlZmluaXRpb24uYWN0aW9ucyA9IGFjdGlvbnM7XG4gICAgYXBwRGVmaW5pdGlvbi50cmlnZ2VycyA9IHRyaWdnZXJzO1xuXG4gICAgY29uc3QgYWN0aW9uVmFsaWRFcnJzID0gbWFwKGUgPT4gZS5lcnJvcikodmFsaWRhdGVBY3Rpb25zKGFjdGlvbnMpKTtcblxuICAgIGlmIChhY3Rpb25WYWxpZEVycnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgQWN0aW9ucyBhcmUgaW52YWxpZDogJHtqb2luKGFjdGlvblZhbGlkRXJycywgJywgJyl9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgdHJpZ2dlclZhbGlkRXJycyA9IG1hcChlID0+IGUuZXJyb3IpKHZhbGlkYXRlVHJpZ2dlcnModHJpZ2dlcnMsIGFjdGlvbnMpKTtcblxuICAgIGlmICh0cmlnZ2VyVmFsaWRFcnJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYFRyaWdnZXJzIGFyZSBpbnZhbGlkOiAke2pvaW4odHJpZ2dlclZhbGlkRXJycywgJywgJyl9YCk7XG4gICAgfVxuXG4gICAgYXdhaXQgZGF0YXN0b3JlLnVwZGF0ZUpzb24oYXBwRGVmaW5pdGlvbkZpbGUsIGFwcERlZmluaXRpb24pO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ0Nhbm5vdCBzYXZlIGFjdGlvbnM6IEFwcGxpY2F0aW9uIGRlZmluaXRpb24gZG9lcyBub3QgZXhpc3QnKTtcbiAgfVxufTtcbiIsIlxuZXhwb3J0IGNvbnN0IGdldEJlaGF2aW91clNvdXJjZXMgPSBhc3luYyAoZGF0YXN0b3JlKSA9PiB7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmxvYWRGaWxlKCcvLmNvbmZpZy9iZWhhdmlvdXJTb3VyY2VzLmpzJyk7XG59O1xuIiwiaW1wb3J0IHtcbiAgZ2V0TmV3Um9vdExldmVsLFxuICBnZXROZXdSZWNvcmRUZW1wbGF0ZSwgZ2V0TmV3SW5kZXhUZW1wbGF0ZSxcbiAgY3JlYXRlTm9kZUVycm9ycywgY29uc3RydWN0SGllcmFyY2h5LFxuICBnZXROZXdBZ2dyZWdhdGVHcm91cFRlbXBsYXRlLCBnZXROZXdTaW5nbGVSZWNvcmRUZW1wbGF0ZSxcbiAgZ2V0TmV3QWdncmVnYXRlVGVtcGxhdGUsIGNvbnN0cnVjdE5vZGUsXG59XG4gIGZyb20gJy4vY3JlYXRlTm9kZXMnO1xuaW1wb3J0IHtcbiAgZ2V0TmV3RmllbGQsIHZhbGlkYXRlRmllbGQsXG4gIGFkZEZpZWxkLCBmaWVsZEVycm9ycyxcbn0gZnJvbSAnLi9maWVsZHMnO1xuaW1wb3J0IHtcbiAgZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUsIGNvbW1vblJlY29yZFZhbGlkYXRpb25SdWxlcyxcbiAgYWRkUmVjb3JkVmFsaWRhdGlvblJ1bGUsXG59IGZyb20gJy4vcmVjb3JkVmFsaWRhdGlvblJ1bGVzJztcbmltcG9ydCB7IGNyZWF0ZUFjdGlvbiwgY3JlYXRlVHJpZ2dlciB9IGZyb20gJy4vY3JlYXRlQWN0aW9ucyc7XG5pbXBvcnQge1xuICB2YWxpZGF0ZVRyaWdnZXJzLCB2YWxpZGF0ZVRyaWdnZXIsIHZhbGlkYXRlTm9kZSxcbiAgdmFsaWRhdGVBY3Rpb25zLCB2YWxpZGF0ZUFsbCxcbn0gZnJvbSAnLi92YWxpZGF0ZSc7XG5pbXBvcnQgeyBnZXRBcHBsaWNhdGlvbkRlZmluaXRpb24gfSBmcm9tICcuL2dldEFwcGxpY2F0aW9uRGVmaW5pdGlvbic7XG5pbXBvcnQgeyBzYXZlQXBwbGljYXRpb25IaWVyYXJjaHkgfSBmcm9tICcuL3NhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSc7XG5pbXBvcnQgeyBzYXZlQWN0aW9uc0FuZFRyaWdnZXJzIH0gZnJvbSAnLi9zYXZlQWN0aW9uc0FuZFRyaWdnZXJzJztcbmltcG9ydCB7IGFsbCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGdldEJlaGF2aW91clNvdXJjZXMgfSBmcm9tIFwiLi9nZXRCZWhhdmlvdXJTb3VyY2VzXCI7XG5cbmNvbnN0IGFwaSA9IGFwcCA9PiAoe1xuXG4gIGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbjogZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uKGFwcC5kYXRhc3RvcmUpLFxuICBzYXZlQXBwbGljYXRpb25IaWVyYXJjaHk6IHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeShhcHApLFxuICBzYXZlQWN0aW9uc0FuZFRyaWdnZXJzOiBzYXZlQWN0aW9uc0FuZFRyaWdnZXJzKGFwcCksXG4gIGdldEJlaGF2aW91clNvdXJjZXM6ICgpID0+IGdldEJlaGF2aW91clNvdXJjZXMoYXBwLmRhdGFzdG9yZSksXG4gIGdldE5ld1Jvb3RMZXZlbCxcbiAgY29uc3RydWN0Tm9kZSxcbiAgZ2V0TmV3SW5kZXhUZW1wbGF0ZSxcbiAgZ2V0TmV3UmVjb3JkVGVtcGxhdGUsXG4gIGdldE5ld0ZpZWxkLFxuICB2YWxpZGF0ZUZpZWxkLFxuICBhZGRGaWVsZCxcbiAgZmllbGRFcnJvcnMsXG4gIGdldE5ld1JlY29yZFZhbGlkYXRpb25SdWxlLFxuICBjb21tb25SZWNvcmRWYWxpZGF0aW9uUnVsZXMsXG4gIGFkZFJlY29yZFZhbGlkYXRpb25SdWxlLFxuICBjcmVhdGVBY3Rpb24sXG4gIGNyZWF0ZVRyaWdnZXIsXG4gIHZhbGlkYXRlQWN0aW9ucyxcbiAgdmFsaWRhdGVUcmlnZ2VyLFxuICBnZXROZXdBZ2dyZWdhdGVHcm91cFRlbXBsYXRlLFxuICBnZXROZXdBZ2dyZWdhdGVUZW1wbGF0ZSxcbiAgY29uc3RydWN0SGllcmFyY2h5LFxuICBnZXROZXdTaW5nbGVSZWNvcmRUZW1wbGF0ZSxcbiAgYWxsVHlwZXM6IGFsbCxcbiAgdmFsaWRhdGVOb2RlLFxuICB2YWxpZGF0ZUFsbCxcbiAgdmFsaWRhdGVUcmlnZ2Vycyxcbn0pO1xuXG5cbmV4cG9ydCBjb25zdCBnZXRUZW1wbGF0ZUFwaSA9IGFwcCA9PiBhcGkoYXBwKTtcblxuZXhwb3J0IGNvbnN0IGVycm9ycyA9IGNyZWF0ZU5vZGVFcnJvcnM7XG5cbmV4cG9ydCBkZWZhdWx0IGdldFRlbXBsYXRlQXBpO1xuIiwiaW1wb3J0IHsgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIFVTRVJTX0xJU1RfRklMRSxcbiAgc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZixcbn0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7ICQsIGFwaVdyYXBwZXIsIGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBnZXRVc2VycyA9IGFwcCA9PiBhc3luYyAoKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmdldFVzZXJzLFxuICBwZXJtaXNzaW9uLmxpc3RVc2Vycy5pc0F1dGhvcml6ZWQsXG4gIHt9LFxuICBfZ2V0VXNlcnMsIGFwcCxcbik7XG5cbmV4cG9ydCBjb25zdCBfZ2V0VXNlcnMgPSBhc3luYyBhcHAgPT4gJChhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSksIFtcbiAgbWFwKHN0cmlwVXNlck9mU2Vuc2l0aXZlU3R1ZmYpLFxuXSk7XG4iLCJpbXBvcnQgeyBBQ0NFU1NfTEVWRUxTX0ZJTEUgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgYXBpV3JhcHBlciwgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGxvYWRBY2Nlc3NMZXZlbHMgPSBhcHAgPT4gYXN5bmMgKCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5sb2FkQWNjZXNzTGV2ZWxzLFxuICBwZXJtaXNzaW9uLmxpc3RBY2Nlc3NMZXZlbHMuaXNBdXRob3JpemVkLFxuICB7fSxcbiAgX2xvYWRBY2Nlc3NMZXZlbHMsIGFwcCxcbik7XG5cbmV4cG9ydCBjb25zdCBfbG9hZEFjY2Vzc0xldmVscyA9IGFzeW5jIGFwcCA9PiBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKEFDQ0VTU19MRVZFTFNfRklMRSk7XG4iLCJpbXBvcnQge1xuICBmaW5kLCBmaWx0ZXIsIHNvbWUsXG4gIG1hcCwgZmxhdHRlbixcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnc2hvcnRpZCc7XG5pbXBvcnQgeyBfZ2V0VXNlcnMgfSBmcm9tICcuL2dldFVzZXJzJztcbmltcG9ydCB7XG4gIGdldFVzZXJCeU5hbWUsIHVzZXJBdXRoRmlsZSxcbiAgcGFyc2VUZW1wb3JhcnlDb2RlLFxufSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgX2xvYWRBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL2xvYWRBY2Nlc3NMZXZlbHMnO1xuaW1wb3J0IHtcbiAgaXNOb3RoaW5nT3JFbXB0eSwgJCwgYXBpV3JhcHBlciwgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5jb25zdCBkdW1teUhhc2ggPSAnJGFyZ29uMmkkdj0xOSRtPTQwOTYsdD0zLHA9MSRVWlJvNDA5VVlCR2pISlMzQ1Y2VXh3JHJVODRxVXFQZU9SRnpLWW1ZWTBjZUJMRGFQTytKV1NINFBmTmlLWGZJS2snO1xuXG5leHBvcnQgY29uc3QgYXV0aGVudGljYXRlID0gYXBwID0+IGFzeW5jICh1c2VybmFtZSwgcGFzc3dvcmQpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuYXV0aGVudGljYXRlLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHVzZXJuYW1lLCBwYXNzd29yZCB9LFxuICBfYXV0aGVudGljYXRlLCBhcHAsIHVzZXJuYW1lLCBwYXNzd29yZCxcbik7XG5cbmV4cG9ydCBjb25zdCBfYXV0aGVudGljYXRlID0gYXN5bmMgKGFwcCwgdXNlcm5hbWUsIHBhc3N3b3JkKSA9PiB7XG4gIGlmIChpc05vdGhpbmdPckVtcHR5KHVzZXJuYW1lKSB8fCBpc05vdGhpbmdPckVtcHR5KHBhc3N3b3JkKSkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIGNvbnN0IGFsbFVzZXJzID0gYXdhaXQgX2dldFVzZXJzKGFwcCk7XG4gIGxldCB1c2VyID0gZ2V0VXNlckJ5TmFtZShcbiAgICBhbGxVc2VycyxcbiAgICB1c2VybmFtZSxcbiAgKTtcblxuICBjb25zdCBub3RBVXNlciA9ICdub3QtYS11c2VyJztcbiAgLy8gY29udGludWUgd2l0aCBub24tdXNlciAtIHNvIHRpbWUgdG8gdmVyaWZ5IHJlbWFpbnMgY29uc2lzdGVudFxuICAvLyB3aXRoIHZlcmlmaWNhdGlvbiBvZiBhIHZhbGlkIHVzZXJcbiAgaWYgKCF1c2VyIHx8ICF1c2VyLmVuYWJsZWQpIHsgdXNlciA9IG5vdEFVc2VyOyB9XG5cbiAgbGV0IHVzZXJBdXRoO1xuICB0cnkge1xuICAgIHVzZXJBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICAgIHVzZXJBdXRoRmlsZSh1c2VybmFtZSksXG4gICAgKTtcbiAgfSBjYXRjaCAoXykge1xuICAgIHVzZXJBdXRoID0geyBhY2Nlc3NMZXZlbHM6IFtdLCBwYXNzd29yZEhhc2g6IGR1bW15SGFzaCB9O1xuICB9XG5cbiAgY29uc3QgcGVybWlzc2lvbnMgPSBhd2FpdCBidWlsZFVzZXJQZXJtaXNzaW9ucyhhcHAsIHVzZXIuYWNjZXNzTGV2ZWxzKTtcblxuICBjb25zdCB2ZXJpZmllZCA9IGF3YWl0IGFwcC5jcnlwdG8udmVyaWZ5KFxuICAgIHVzZXJBdXRoLnBhc3N3b3JkSGFzaCxcbiAgICBwYXNzd29yZCxcbiAgKTtcblxuICBpZiAodXNlciA9PT0gbm90QVVzZXIpIHsgcmV0dXJuIG51bGw7IH1cblxuICByZXR1cm4gdmVyaWZpZWRcbiAgICA/IHtcbiAgICAgIC4uLnVzZXIsIHBlcm1pc3Npb25zLCB0ZW1wOiBmYWxzZSwgaXNVc2VyOiB0cnVlLFxuICAgIH1cbiAgICA6IG51bGw7XG59O1xuXG5leHBvcnQgY29uc3QgYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzID0gYXBwID0+IGFzeW5jICh0ZW1wQWNjZXNzQ29kZSkgPT4ge1xuICBpZiAoaXNOb3RoaW5nT3JFbXB0eSh0ZW1wQWNjZXNzQ29kZSkpIHsgcmV0dXJuIG51bGw7IH1cblxuICBjb25zdCB0ZW1wID0gcGFyc2VUZW1wb3JhcnlDb2RlKHRlbXBBY2Nlc3NDb2RlKTtcbiAgbGV0IHVzZXIgPSAkKGF3YWl0IF9nZXRVc2VycyhhcHApLCBbXG4gICAgZmluZCh1ID0+IHUudGVtcG9yYXJ5QWNjZXNzSWQgPT09IHRlbXAuaWQpLFxuICBdKTtcblxuICBjb25zdCBub3RBVXNlciA9ICdub3QtYS11c2VyJztcbiAgaWYgKCF1c2VyIHx8ICF1c2VyLmVuYWJsZWQpIHsgdXNlciA9IG5vdEFVc2VyOyB9XG5cbiAgbGV0IHVzZXJBdXRoO1xuICB0cnkge1xuICAgIHVzZXJBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICAgIHVzZXJBdXRoRmlsZSh1c2VyLm5hbWUpLFxuICAgICk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB1c2VyQXV0aCA9IHtcbiAgICAgIHRlbXBvcmFyeUFjY2Vzc0hhc2g6IGR1bW15SGFzaCxcbiAgICAgIHRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoOiAoYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpICsgMTAwMDApLFxuICAgIH07XG4gIH1cblxuICBpZiAodXNlckF1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPCBhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCkpIHsgdXNlciA9IG5vdEFVc2VyOyB9XG5cbiAgY29uc3QgdGVtcENvZGUgPSAhdGVtcC5jb2RlID8gZ2VuZXJhdGUoKSA6IHRlbXAuY29kZTtcbiAgY29uc3QgdmVyaWZpZWQgPSBhd2FpdCBhcHAuY3J5cHRvLnZlcmlmeShcbiAgICB1c2VyQXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoLFxuICAgIHRlbXBDb2RlLFxuICApO1xuXG4gIGlmICh1c2VyID09PSBub3RBVXNlcikgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHJldHVybiB2ZXJpZmllZFxuICAgID8ge1xuICAgICAgLi4udXNlcixcbiAgICAgIHBlcm1pc3Npb25zOiBbXSxcbiAgICAgIHRlbXA6IHRydWUsXG4gICAgICBpc1VzZXI6IHRydWUsXG4gICAgfVxuICAgIDogbnVsbDtcbn07XG5cbmV4cG9ydCBjb25zdCBidWlsZFVzZXJQZXJtaXNzaW9ucyA9IGFzeW5jIChhcHAsIHVzZXJBY2Nlc3NMZXZlbHMpID0+IHtcbiAgY29uc3QgYWxsQWNjZXNzTGV2ZWxzID0gYXdhaXQgX2xvYWRBY2Nlc3NMZXZlbHMoYXBwKTtcblxuICByZXR1cm4gJChhbGxBY2Nlc3NMZXZlbHMubGV2ZWxzLCBbXG4gICAgZmlsdGVyKGwgPT4gc29tZSh1YSA9PiBsLm5hbWUgPT09IHVhKSh1c2VyQWNjZXNzTGV2ZWxzKSksXG4gICAgbWFwKGwgPT4gbC5wZXJtaXNzaW9ucyksXG4gICAgZmxhdHRlbixcbiAgXSk7XG59O1xuIiwiaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcbmltcG9ydCB7XG4gIHRlbXBDb2RlRXhwaXJ5TGVuZ3RoLCBVU0VSU19MT0NLX0ZJTEUsXG4gIFVTRVJTX0xJU1RfRklMRSwgdXNlckF1dGhGaWxlLFxuICBnZXRVc2VyQnlOYW1lLFxufSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHtcbiAgZ2V0TG9jaywgaXNOb2xvY2ssXG4gIHJlbGVhc2VMb2NrLFxufSBmcm9tICcuLi9jb21tb24vbG9jayc7XG5pbXBvcnQgeyBhcGlXcmFwcGVyLCBldmVudHMgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzID0gYXBwID0+IGFzeW5jIHVzZXJOYW1lID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuY3JlYXRlVGVtcG9yYXJ5QWNjZXNzLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHVzZXJOYW1lIH0sXG4gIF9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MsIGFwcCwgdXNlck5hbWUsXG4pO1xuXG5leHBvcnQgY29uc3QgX2NyZWF0ZVRlbXBvcmFyeUFjY2VzcyA9IGFzeW5jIChhcHAsIHVzZXJOYW1lKSA9PiB7XG4gIGNvbnN0IHRlbXBDb2RlID0gYXdhaXQgZ2V0VGVtcG9yYXJ5Q29kZShhcHApO1xuXG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRMb2NrKFxuICAgIGFwcCwgVVNFUlNfTE9DS19GSUxFLCAxMDAwLCAyLFxuICApO1xuXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBjcmVhdGUgdGVtcG9yYXJ5IGFjY2VzcywgY291bGQgbm90IGdldCBsb2NrIC0gdHJ5IGFnYWluJyk7IH1cblxuICB0cnkge1xuICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihVU0VSU19MSVNUX0ZJTEUpO1xuXG4gICAgY29uc3QgdXNlciA9IGdldFVzZXJCeU5hbWUodXNlcnMsIHVzZXJOYW1lKTtcbiAgICB1c2VyLnRlbXBvcmFyeUFjY2Vzc0lkID0gdGVtcENvZGUudGVtcG9yYXJ5QWNjZXNzSWQ7XG5cbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgICBVU0VSU19MSVNUX0ZJTEUsXG4gICAgICB1c2VycyxcbiAgICApO1xuICB9IGZpbmFsbHkge1xuICAgIGF3YWl0IHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XG4gIH1cblxuICBjb25zdCB1c2VyQXV0aCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgdXNlckF1dGhGaWxlKHVzZXJOYW1lKSxcbiAgKTtcbiAgdXNlckF1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaCA9IHRlbXBDb2RlLnRlbXBvcmFyeUFjY2Vzc0hhc2g7XG5cbiAgdXNlckF1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPSB0ZW1wQ29kZS50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaDtcblxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgdXNlckF1dGhGaWxlKHVzZXJOYW1lKSxcbiAgICB1c2VyQXV0aCxcbiAgKTtcblxuICByZXR1cm4gdGVtcENvZGUudGVtcENvZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VGVtcG9yYXJ5Q29kZSA9IGFzeW5jIChhcHApID0+IHtcbiAgY29uc3QgdGVtcENvZGUgPSBnZW5lcmF0ZSgpXG4gICAgICAgICsgZ2VuZXJhdGUoKVxuICAgICAgICArIGdlbmVyYXRlKClcbiAgICAgICAgKyBnZW5lcmF0ZSgpO1xuXG4gIGNvbnN0IHRlbXBJZCA9IGdlbmVyYXRlKCk7XG5cbiAgcmV0dXJuIHtcbiAgICB0ZW1wb3JhcnlBY2Nlc3NIYXNoOiBhd2FpdCBhcHAuY3J5cHRvLmhhc2goXG4gICAgICB0ZW1wQ29kZSxcbiAgICApLFxuICAgIHRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoOlxuICAgICAgICAgICAgKGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKSkgKyB0ZW1wQ29kZUV4cGlyeUxlbmd0aCxcbiAgICB0ZW1wQ29kZTogYHRtcDoke3RlbXBJZH06JHt0ZW1wQ29kZX1gLFxuICAgIHRlbXBvcmFyeUFjY2Vzc0lkOiB0ZW1wSWQsXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgbG9va3NMaWtlVGVtcG9yYXJ5Q29kZSA9IGNvZGUgPT4gY29kZS5zdGFydHNXaXRoKCd0bXA6Jyk7XG4iLCJpbXBvcnQge1xuICBtYXAsIHVuaXFXaXRoLFxuICBmbGF0dGVuLCBmaWx0ZXIsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHtcbiAgJCwgaW5zZW5zaXRpdmVFcXVhbHMsIGFwaVdyYXBwZXIsIGV2ZW50cyxcbiAgaXNOb25FbXB0eVN0cmluZywgYWxsLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5jb25zdCB1c2VyUnVsZXMgPSBhbGxVc2VycyA9PiBbXG4gIG1ha2VydWxlKCduYW1lJywgJ3VzZXJuYW1lIG11c3QgYmUgc2V0JyxcbiAgICB1ID0+IGlzTm9uRW1wdHlTdHJpbmcodS5uYW1lKSksXG4gIG1ha2VydWxlKCdhY2Nlc3NMZXZlbHMnLCAndXNlciBtdXN0IGhhdmUgYXQgbGVhc3Qgb25lIGFjY2VzcyBsZXZlbCcsXG4gICAgdSA9PiB1LmFjY2Vzc0xldmVscy5sZW5ndGggPiAwKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAndXNlcm5hbWUgbXVzdCBiZSB1bmlxdWUnLFxuICAgIHUgPT4gZmlsdGVyKHUyID0+IGluc2Vuc2l0aXZlRXF1YWxzKHUyLm5hbWUsIHUubmFtZSkpKGFsbFVzZXJzKS5sZW5ndGggPT09IDEpLFxuICBtYWtlcnVsZSgnYWNjZXNzTGV2ZWxzJywgJ2FjY2VzcyBsZXZlbHMgbXVzdCBvbmx5IGNvbnRhaW4gc3RpbmdzJyxcbiAgICB1ID0+IGFsbChpc05vbkVtcHR5U3RyaW5nKSh1LmFjY2Vzc0xldmVscykpLFxuXTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVXNlciA9ICgpID0+IChhbGx1c2VycywgdXNlcikgPT4gYXBwbHlSdWxlU2V0KHVzZXJSdWxlcyhhbGx1c2VycykpKHVzZXIpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVVc2VycyA9IGFwcCA9PiBhbGxVc2VycyA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLnZhbGlkYXRlVXNlcnMsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgYWxsVXNlcnMgfSxcbiAgX3ZhbGlkYXRlVXNlcnMsIGFwcCwgYWxsVXNlcnMsXG4pO1xuXG5leHBvcnQgY29uc3QgX3ZhbGlkYXRlVXNlcnMgPSAoYXBwLCBhbGxVc2VycykgPT4gJChhbGxVc2VycywgW1xuICBtYXAobCA9PiB2YWxpZGF0ZVVzZXIoYXBwKShhbGxVc2VycywgbCkpLFxuICBmbGF0dGVuLFxuICB1bmlxV2l0aCgoeCwgeSkgPT4geC5maWVsZCA9PT0geS5maWVsZFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgeC5pdGVtID09PSB5Lml0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHguZXJyb3IgPT09IHkuZXJyb3IpLFxuXSk7XG4iLCJpbXBvcnQgeyBhcGlXcmFwcGVyU3luYywgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGdldE5ld1VzZXIgPSBhcHAgPT4gKCkgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuZ2V0TmV3VXNlcixcbiAgcGVybWlzc2lvbi5jcmVhdGVVc2VyLmlzQXV0aG9yaXplZCxcbiAge30sXG4gIF9nZXROZXdVc2VyLCBhcHAsXG4pO1xuXG5leHBvcnQgY29uc3QgX2dldE5ld1VzZXIgPSAoKSA9PiAoe1xuICBuYW1lOiAnJyxcbiAgYWNjZXNzTGV2ZWxzOiBbXSxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgdGVtcG9yYXJ5QWNjZXNzSWQ6ICcnLFxufSk7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdVc2VyQXV0aCA9IGFwcCA9PiAoKSA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5nZXROZXdVc2VyQXV0aCxcbiAgcGVybWlzc2lvbi5jcmVhdGVVc2VyLmlzQXV0aG9yaXplZCxcbiAge30sXG4gIF9nZXROZXdVc2VyQXV0aCwgYXBwLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9nZXROZXdVc2VyQXV0aCA9ICgpID0+ICh7XG4gIHBhc3N3b3JkSGFzaDogJycsXG4gIHRlbXBvcmFyeUFjY2Vzc0hhc2g6ICcnLFxuICB0ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaDogMCxcbn0pO1xuIiwiaW1wb3J0IHsgZmluZCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyB1c2VyQXV0aEZpbGUsIHBhcnNlVGVtcG9yYXJ5Q29kZSB9IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQge1xuICBpc1NvbWV0aGluZywgJCwgYXBpV3JhcHBlciwgYXBpV3JhcHBlclN5bmMsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IF9nZXRVc2VycyB9IGZyb20gJy4vZ2V0VXNlcnMnO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgaXNWYWxpZFBhc3N3b3JkID0gYXBwID0+IHBhc3N3b3JkID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmlzVmFsaWRQYXNzd29yZCxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyBwYXNzd29yZCB9LFxuICBfaXNWYWxpZFBhc3N3b3JkLCBhcHAsIHBhc3N3b3JkLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9pc1ZhbGlkUGFzc3dvcmQgPSAoYXBwLCBwYXNzd29yZCkgPT4gc2NvcmVQYXNzd29yZChwYXNzd29yZCkuc2NvcmUgPiAzMDtcblxuZXhwb3J0IGNvbnN0IGNoYW5nZU15UGFzc3dvcmQgPSBhcHAgPT4gYXN5bmMgKGN1cnJlbnRQdywgbmV3cGFzc3dvcmQpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuY2hhbmdlTXlQYXNzd29yZCxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyBjdXJyZW50UHcsIG5ld3Bhc3N3b3JkIH0sXG4gIF9jaGFuZ2VNeVBhc3N3b3JkLCBhcHAsIGN1cnJlbnRQdywgbmV3cGFzc3dvcmQsXG4pO1xuXG5leHBvcnQgY29uc3QgX2NoYW5nZU15UGFzc3dvcmQgPSBhc3luYyAoYXBwLCBjdXJyZW50UHcsIG5ld3Bhc3N3b3JkKSA9PiB7XG4gIGNvbnN0IGV4aXN0aW5nQXV0aCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgdXNlckF1dGhGaWxlKGFwcC51c2VyLm5hbWUpLFxuICApO1xuXG4gIGlmIChpc1NvbWV0aGluZyhleGlzdGluZ0F1dGgucGFzc3dvcmRIYXNoKSkge1xuICAgIGNvbnN0IHZlcmlmaWVkID0gYXdhaXQgYXBwLmNyeXB0by52ZXJpZnkoXG4gICAgICBleGlzdGluZ0F1dGgucGFzc3dvcmRIYXNoLFxuICAgICAgY3VycmVudFB3LFxuICAgICk7XG5cbiAgICBpZiAodmVyaWZpZWQpIHtcbiAgICAgIGF3YWl0IGF3YWl0IGRvU2V0KFxuICAgICAgICBhcHAsIGV4aXN0aW5nQXV0aCxcbiAgICAgICAgYXBwLnVzZXIubmFtZSwgbmV3cGFzc3dvcmQsXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuZXhwb3J0IGNvbnN0IHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUgPSBhcHAgPT4gYXN5bmMgKHRlbXBDb2RlLCBuZXdwYXNzd29yZCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5zZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHRlbXBDb2RlLCBuZXdwYXNzd29yZCB9LFxuICBfc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZSwgYXBwLCB0ZW1wQ29kZSwgbmV3cGFzc3dvcmQsXG4pO1xuXG5cbmV4cG9ydCBjb25zdCBfc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZSA9IGFzeW5jIChhcHAsIHRlbXBDb2RlLCBuZXdwYXNzd29yZCkgPT4ge1xuICBjb25zdCBjdXJyZW50VGltZSA9IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKTtcblxuICBjb25zdCB0ZW1wID0gcGFyc2VUZW1wb3JhcnlDb2RlKHRlbXBDb2RlKTtcblxuICBjb25zdCB1c2VyID0gJChhd2FpdCBfZ2V0VXNlcnMoYXBwKSwgW1xuICAgIGZpbmQodSA9PiB1LnRlbXBvcmFyeUFjY2Vzc0lkID09PSB0ZW1wLmlkKSxcbiAgXSk7XG5cbiAgaWYgKCF1c2VyKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGNvbnN0IGV4aXN0aW5nQXV0aCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgdXNlckF1dGhGaWxlKHVzZXIubmFtZSksXG4gICk7XG5cbiAgaWYgKGlzU29tZXRoaW5nKGV4aXN0aW5nQXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoKVxuICAgICAgICYmIGV4aXN0aW5nQXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA+IGN1cnJlbnRUaW1lKSB7XG4gICAgY29uc3QgdmVyaWZpZWQgPSBhd2FpdCBhcHAuY3J5cHRvLnZlcmlmeShcbiAgICAgIGV4aXN0aW5nQXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoLFxuICAgICAgdGVtcC5jb2RlLFxuICAgICk7XG5cbiAgICBpZiAodmVyaWZpZWQpIHtcbiAgICAgIGF3YWl0IGRvU2V0KFxuICAgICAgICBhcHAsIGV4aXN0aW5nQXV0aCxcbiAgICAgICAgdXNlci5uYW1lLCBuZXdwYXNzd29yZCxcbiAgICAgICk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5jb25zdCBkb1NldCA9IGFzeW5jIChhcHAsIGF1dGgsIHVzZXJuYW1lLCBuZXdwYXNzd29yZCkgPT4ge1xuICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2ggPSAnJztcbiAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA9IDA7XG4gIGF1dGgucGFzc3dvcmRIYXNoID0gYXdhaXQgYXBwLmNyeXB0by5oYXNoKFxuICAgIG5ld3Bhc3N3b3JkLFxuICApO1xuICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgdXNlckF1dGhGaWxlKHVzZXJuYW1lKSxcbiAgICBhdXRoLFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IHNjb3JlUGFzc3dvcmQgPSBhcHAgPT4gcGFzc3dvcmQgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuc2NvcmVQYXNzd29yZCxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyBwYXNzd29yZCB9LFxuICBfc2NvcmVQYXNzd29yZCwgcGFzc3dvcmQsXG4pO1xuXG5leHBvcnQgY29uc3QgX3Njb3JlUGFzc3dvcmQgPSAocGFzc3dvcmQpID0+IHtcbiAgLy8gZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85NDgxNzIvcGFzc3dvcmQtc3RyZW5ndGgtbWV0ZXJcbiAgLy8gdGhhbmsgeW91IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vdXNlcnMvNDY2MTcvdG0tbHZcblxuICBsZXQgc2NvcmUgPSAwO1xuICBpZiAoIXBhc3N3b3JkKSB7IHJldHVybiBzY29yZTsgfVxuXG4gIC8vIGF3YXJkIGV2ZXJ5IHVuaXF1ZSBsZXR0ZXIgdW50aWwgNSByZXBldGl0aW9uc1xuICBjb25zdCBsZXR0ZXJzID0gbmV3IE9iamVjdCgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhc3N3b3JkLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0dGVyc1twYXNzd29yZFtpXV0gPSAobGV0dGVyc1twYXNzd29yZFtpXV0gfHwgMCkgKyAxO1xuICAgIHNjb3JlICs9IDUuMCAvIGxldHRlcnNbcGFzc3dvcmRbaV1dO1xuICB9XG5cbiAgLy8gYm9udXMgcG9pbnRzIGZvciBtaXhpbmcgaXQgdXBcbiAgY29uc3QgdmFyaWF0aW9ucyA9IHtcbiAgICBkaWdpdHM6IC9cXGQvLnRlc3QocGFzc3dvcmQpLFxuICAgIGxvd2VyOiAvW2Etel0vLnRlc3QocGFzc3dvcmQpLFxuICAgIHVwcGVyOiAvW0EtWl0vLnRlc3QocGFzc3dvcmQpLFxuICAgIG5vbldvcmRzOiAvXFxXLy50ZXN0KHBhc3N3b3JkKSxcbiAgfTtcblxuICBsZXQgdmFyaWF0aW9uQ291bnQgPSAwO1xuICBmb3IgKGNvbnN0IGNoZWNrIGluIHZhcmlhdGlvbnMpIHtcbiAgICB2YXJpYXRpb25Db3VudCArPSAodmFyaWF0aW9uc1tjaGVja10gPT0gdHJ1ZSkgPyAxIDogMDtcbiAgfVxuICBzY29yZSArPSAodmFyaWF0aW9uQ291bnQgLSAxKSAqIDEwO1xuXG4gIGNvbnN0IHN0cmVuZ3RoVGV4dCA9IHNjb3JlID4gODBcbiAgICA/ICdzdHJvbmcnXG4gICAgOiBzY29yZSA+IDYwXG4gICAgICA/ICdnb29kJ1xuICAgICAgOiBzY29yZSA+PSAzMFxuICAgICAgICA/ICd3ZWFrJ1xuICAgICAgICA6ICd2ZXJ5IHdlYWsnO1xuXG4gIHJldHVybiB7XG4gICAgc2NvcmU6IHBhcnNlSW50KHNjb3JlKSxcbiAgICBzdHJlbmd0aFRleHQsXG4gIH07XG59O1xuIiwiaW1wb3J0IHsgam9pbiwgc29tZSB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyB2YWxpZGF0ZVVzZXIgfSBmcm9tICcuL3ZhbGlkYXRlVXNlcic7XG5pbXBvcnQgeyBnZXROZXdVc2VyQXV0aCB9IGZyb20gJy4vZ2V0TmV3VXNlcic7XG5pbXBvcnQge1xuICBnZXRMb2NrLCBpc05vbG9jaywgcmVsZWFzZUxvY2ssIGFwaVdyYXBwZXIsIGV2ZW50cyxcbiAgaW5zZW5zaXRpdmVFcXVhbHMsIGlzTm9uRW1wdHlTdHJpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBVU0VSU19MT0NLX0ZJTEUsIHN0cmlwVXNlck9mU2Vuc2l0aXZlU3R1ZmYsXG4gIFVTRVJTX0xJU1RfRklMRSwgdXNlckF1dGhGaWxlLFxufSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgZ2V0VGVtcG9yYXJ5Q29kZSB9IGZyb20gJy4vY3JlYXRlVGVtcG9yYXJ5QWNjZXNzJztcbmltcG9ydCB7IGlzVmFsaWRQYXNzd29yZCB9IGZyb20gJy4vc2V0UGFzc3dvcmQnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVVc2VyID0gYXBwID0+IGFzeW5jICh1c2VyLCBwYXNzd29yZCA9IG51bGwpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuY3JlYXRlVXNlcixcbiAgcGVybWlzc2lvbi5jcmVhdGVVc2VyLmlzQXV0aG9yaXplZCxcbiAgeyB1c2VyLCBwYXNzd29yZCB9LFxuICBfY3JlYXRlVXNlciwgYXBwLCB1c2VyLCBwYXNzd29yZCxcbik7XG5cbmV4cG9ydCBjb25zdCBfY3JlYXRlVXNlciA9IGFzeW5jIChhcHAsIHVzZXIsIHBhc3N3b3JkID0gbnVsbCkgPT4ge1xuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhcbiAgICBhcHAsIFVTRVJTX0xPQ0tfRklMRSwgMTAwMCwgMixcbiAgKTtcblxuICBpZiAoaXNOb2xvY2sobG9jaykpIHsgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gY3JlYXRlIHVzZXIsIGNvdWxkIG5vdCBnZXQgbG9jayAtIHRyeSBhZ2FpbicpOyB9XG5cbiAgY29uc3QgdXNlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSk7XG5cbiAgY29uc3QgdXNlckVycm9ycyA9IHZhbGlkYXRlVXNlcihhcHApKFsuLi51c2VycywgdXNlcl0sIHVzZXIpO1xuICBpZiAodXNlckVycm9ycy5sZW5ndGggPiAwKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYFVzZXIgaXMgaW52YWxpZC4gJHtqb2luKCc7ICcpKHVzZXJFcnJvcnMpfWApOyB9XG5cbiAgY29uc3QgeyBhdXRoLCB0ZW1wQ29kZSwgdGVtcG9yYXJ5QWNjZXNzSWQgfSA9IGF3YWl0IGdldEFjY2VzcyhcbiAgICBhcHAsIHBhc3N3b3JkLFxuICApO1xuICB1c2VyLnRlbXBDb2RlID0gdGVtcENvZGU7XG4gIHVzZXIudGVtcG9yYXJ5QWNjZXNzSWQgPSB0ZW1wb3JhcnlBY2Nlc3NJZDtcblxuICBpZiAoc29tZSh1ID0+IGluc2Vuc2l0aXZlRXF1YWxzKHUubmFtZSwgdXNlci5uYW1lKSkodXNlcnMpKSB7IFxuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ1VzZXIgYWxyZWFkeSBleGlzdHMnKTsgXG4gIH1cblxuICB1c2Vycy5wdXNoKFxuICAgIHN0cmlwVXNlck9mU2Vuc2l0aXZlU3R1ZmYodXNlciksXG4gICk7XG5cbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFxuICAgIFVTRVJTX0xJU1RfRklMRSxcbiAgICB1c2VycyxcbiAgKTtcblxuICB0cnkge1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlSnNvbihcbiAgICAgIHVzZXJBdXRoRmlsZSh1c2VyLm5hbWUpLFxuICAgICAgYXV0aCxcbiAgICApO1xuICB9IGNhdGNoIChfKSB7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFxuICAgICAgdXNlckF1dGhGaWxlKHVzZXIubmFtZSksXG4gICAgICBhdXRoLFxuICAgICk7XG4gIH1cblxuICBhd2FpdCByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xuXG4gIHJldHVybiB1c2VyO1xufTtcblxuY29uc3QgZ2V0QWNjZXNzID0gYXN5bmMgKGFwcCwgcGFzc3dvcmQpID0+IHtcbiAgY29uc3QgYXV0aCA9IGdldE5ld1VzZXJBdXRoKGFwcCkoKTtcblxuICBpZiAoaXNOb25FbXB0eVN0cmluZyhwYXNzd29yZCkpIHtcbiAgICBpZiAoaXNWYWxpZFBhc3N3b3JkKHBhc3N3b3JkKSkge1xuICAgICAgYXV0aC5wYXNzd29yZEhhc2ggPSBhd2FpdCBhcHAuY3J5cHRvLmhhc2gocGFzc3dvcmQpO1xuICAgICAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoID0gJyc7XG4gICAgICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0lkID0gJyc7XG4gICAgICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID0gMDtcbiAgICAgIHJldHVybiB7IGF1dGggfTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignUGFzc3dvcmQgZG9lcyBub3QgbWVldCByZXF1aXJlbWVudHMnKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCB0ZW1wQWNjZXNzID0gYXdhaXQgZ2V0VGVtcG9yYXJ5Q29kZShhcHApO1xuICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaCA9IHRlbXBBY2Nlc3MudGVtcG9yYXJ5QWNjZXNzSGFzaDtcbiAgICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID0gdGVtcEFjY2Vzcy50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaDtcbiAgICBhdXRoLnBhc3N3b3JkSGFzaCA9ICcnO1xuICAgIHJldHVybiAoe1xuICAgICAgYXV0aCxcbiAgICAgIHRlbXBDb2RlOiB0ZW1wQWNjZXNzLnRlbXBDb2RlLFxuICAgICAgdGVtcG9yYXJ5QWNjZXNzSWQ6IHRlbXBBY2Nlc3MudGVtcG9yYXJ5QWNjZXNzSWQsXG4gICAgfSk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBnZXRMb2NrLFxuICBpc05vbG9jaywgcmVsZWFzZUxvY2ssXG59IGZyb20gJy4uL2NvbW1vbi9sb2NrJztcbmltcG9ydCB7IFVTRVJTX0xPQ0tfRklMRSwgVVNFUlNfTElTVF9GSUxFLCBnZXRVc2VyQnlOYW1lIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7IGFwaVdyYXBwZXIsIGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBlbmFibGVVc2VyID0gYXBwID0+IGFzeW5jIHVzZXJuYW1lID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuZW5hYmxlVXNlcixcbiAgcGVybWlzc2lvbi5lbmFibGVEaXNhYmxlVXNlci5pc0F1dGhvcml6ZWQsXG4gIHsgdXNlcm5hbWUgfSxcbiAgX2VuYWJsZVVzZXIsIGFwcCwgdXNlcm5hbWUsXG4pO1xuXG5leHBvcnQgY29uc3QgZGlzYWJsZVVzZXIgPSBhcHAgPT4gYXN5bmMgdXNlcm5hbWUgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5kaXNhYmxlVXNlcixcbiAgcGVybWlzc2lvbi5lbmFibGVEaXNhYmxlVXNlci5pc0F1dGhvcml6ZWQsXG4gIHsgdXNlcm5hbWUgfSxcbiAgX2Rpc2FibGVVc2VyLCBhcHAsIHVzZXJuYW1lLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9lbmFibGVVc2VyID0gYXN5bmMgKGFwcCwgdXNlcm5hbWUpID0+IGF3YWl0IHRvZ2dsZVVzZXIoYXBwLCB1c2VybmFtZSwgdHJ1ZSk7XG5cbmV4cG9ydCBjb25zdCBfZGlzYWJsZVVzZXIgPSBhc3luYyAoYXBwLCB1c2VybmFtZSkgPT4gYXdhaXQgdG9nZ2xlVXNlcihhcHAsIHVzZXJuYW1lLCBmYWxzZSk7XG5cbmNvbnN0IHRvZ2dsZVVzZXIgPSBhc3luYyAoYXBwLCB1c2VybmFtZSwgZW5hYmxlZCkgPT4ge1xuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhhcHAsIFVTRVJTX0xPQ0tfRklMRSwgMTAwMCwgMSwgMCk7XG5cbiAgY29uc3QgYWN0aW9uTmFtZSA9IGVuYWJsZWQgPyAnZW5hYmxlJyA6ICdkaXNhYmxlJztcblxuICBpZiAoaXNOb2xvY2sobG9jaykpIHsgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgJHthY3Rpb25OYW1lfSB1c2VyIC0gY2Fubm90IGdldCBsb2NrYCk7IH1cblxuICB0cnkge1xuICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihVU0VSU19MSVNUX0ZJTEUpO1xuICAgIGNvbnN0IHVzZXIgPSBnZXRVc2VyQnlOYW1lKHVzZXJzLCB1c2VybmFtZSk7XG4gICAgaWYgKCF1c2VyKSB7IHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGBDb3VsZCBub3QgZmluZCB1c2VyIHRvICR7YWN0aW9uTmFtZX1gKTsgfVxuXG4gICAgaWYgKHVzZXIuZW5hYmxlZCA9PT0gIWVuYWJsZWQpIHtcbiAgICAgIHVzZXIuZW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oVVNFUlNfTElTVF9GSUxFLCB1c2Vycyk7XG4gICAgfVxuICB9IGZpbmFsbHkge1xuICAgIHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XG4gIH1cbn07XG4iLCJleHBvcnQgY29uc3QgZ2V0TmV3QWNjZXNzTGV2ZWwgPSAoKSA9PiAoKSA9PiAoe1xuICBuYW1lOiAnJyxcbiAgcGVybWlzc2lvbnM6IFtdLFxuICBkZWZhdWx0OmZhbHNlXG59KTtcbiIsImltcG9ydCB7XG4gIHZhbHVlcywgaW5jbHVkZXMsIG1hcCwgY29uY2F0LCBpc0VtcHR5LCB1bmlxV2l0aCwgc29tZSxcbiAgZmxhdHRlbiwgZmlsdGVyLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSB9IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb25UeXBlcyB9IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQge1xuICAkLCBpc1NvbWV0aGluZywgaW5zZW5zaXRpdmVFcXVhbHMsXG4gIGlzTm9uRW1wdHlTdHJpbmcsIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXROb2RlIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IGFsd2F5c0F1dGhvcml6ZWQgfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuY29uc3QgaXNBbGxvd2VkVHlwZSA9IHQgPT4gJChwZXJtaXNzaW9uVHlwZXMsIFtcbiAgdmFsdWVzLFxuICBpbmNsdWRlcyh0KSxcbl0pO1xuXG5jb25zdCBpc1JlY29yZE9ySW5kZXhUeXBlID0gdCA9PiBzb21lKHAgPT4gcCA9PT0gdCkoW1xuICBwZXJtaXNzaW9uVHlwZXMuQ1JFQVRFX1JFQ09SRCxcbiAgcGVybWlzc2lvblR5cGVzLlVQREFURV9SRUNPUkQsXG4gIHBlcm1pc3Npb25UeXBlcy5ERUxFVEVfUkVDT1JELFxuICBwZXJtaXNzaW9uVHlwZXMuUkVBRF9SRUNPUkQsXG4gIHBlcm1pc3Npb25UeXBlcy5SRUFEX0lOREVYLFxuICBwZXJtaXNzaW9uVHlwZXMuRVhFQ1VURV9BQ1RJT04sXG5dKTtcblxuXG5jb25zdCBwZXJtaXNzaW9uUnVsZXMgPSBhcHAgPT4gKFtcbiAgbWFrZXJ1bGUoJ3R5cGUnLCAndHlwZSBtdXN0IGJlIG9uZSBvZiBhbGxvd2VkIHR5cGVzJyxcbiAgICBwID0+IGlzQWxsb3dlZFR5cGUocC50eXBlKSksXG4gIG1ha2VydWxlKCdub2RlS2V5JywgJ3JlY29yZCBhbmQgaW5kZXggcGVybWlzc2lvbnMgbXVzdCBpbmNsdWRlIGEgdmFsaWQgbm9kZUtleScsXG4gICAgcCA9PiAoIWlzUmVjb3JkT3JJbmRleFR5cGUocC50eXBlKSlcbiAgICAgICAgICAgICB8fCBpc1NvbWV0aGluZyhnZXROb2RlKGFwcC5oaWVyYXJjaHksIHAubm9kZUtleSkpKSxcbl0pO1xuXG5jb25zdCBhcHBseVBlcm1pc3Npb25SdWxlcyA9IGFwcCA9PiBhcHBseVJ1bGVTZXQocGVybWlzc2lvblJ1bGVzKGFwcCkpO1xuXG5jb25zdCBhY2Nlc3NMZXZlbFJ1bGVzID0gYWxsTGV2ZWxzID0+IChbXG4gIG1ha2VydWxlKCduYW1lJywgJ25hbWUgbXVzdCBiZSBzZXQnLFxuICAgIGwgPT4gaXNOb25FbXB0eVN0cmluZyhsLm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnYWNjZXNzIGxldmVsIG5hbWVzIG11c3QgYmUgdW5pcXVlJyxcbiAgICBsID0+IGlzRW1wdHkobC5uYW1lKVxuICAgICAgICAgICAgIHx8IGZpbHRlcihhID0+IGluc2Vuc2l0aXZlRXF1YWxzKGwubmFtZSwgYS5uYW1lKSkoYWxsTGV2ZWxzKS5sZW5ndGggPT09IDEpLFxuXSk7XG5cbmNvbnN0IGFwcGx5TGV2ZWxSdWxlcyA9IGFsbExldmVscyA9PiBhcHBseVJ1bGVTZXQoYWNjZXNzTGV2ZWxSdWxlcyhhbGxMZXZlbHMpKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWNjZXNzTGV2ZWwgPSBhcHAgPT4gKGFsbExldmVscywgbGV2ZWwpID0+IHtcbiAgY29uc3QgZXJycyA9ICQobGV2ZWwucGVybWlzc2lvbnMsIFtcbiAgICBtYXAoYXBwbHlQZXJtaXNzaW9uUnVsZXMoYXBwKSksXG4gICAgZmxhdHRlbixcbiAgICBjb25jYXQoXG4gICAgICBhcHBseUxldmVsUnVsZXMoYWxsTGV2ZWxzKShsZXZlbCksXG4gICAgKSxcbiAgXSk7XG5cbiAgcmV0dXJuIGVycnM7XG59O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBY2Nlc3NMZXZlbHMgPSBhcHAgPT4gYWxsTGV2ZWxzID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLnZhbGlkYXRlQWNjZXNzTGV2ZWxzLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IGFsbExldmVscyB9LFxuICBfdmFsaWRhdGVBY2Nlc3NMZXZlbHMsIGFwcCwgYWxsTGV2ZWxzLFxuKTtcblxuZXhwb3J0IGNvbnN0IF92YWxpZGF0ZUFjY2Vzc0xldmVscyA9IChhcHAsIGFsbExldmVscykgPT4gJChhbGxMZXZlbHMsIFtcbiAgbWFwKGwgPT4gdmFsaWRhdGVBY2Nlc3NMZXZlbChhcHApKGFsbExldmVscywgbCkpLFxuICBmbGF0dGVuLFxuICB1bmlxV2l0aCgoeCwgeSkgPT4geC5maWVsZCA9PT0geS5maWVsZFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgeC5pdGVtID09PSB5Lml0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHguZXJyb3IgPT09IHkuZXJyb3IpLFxuXSk7XG4iLCJpbXBvcnQgeyBqb2luLCBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgZ2V0TG9jaywgcmVsZWFzZUxvY2ssICQsXG4gIGlzTm9sb2NrLCBhcGlXcmFwcGVyLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBBQ0NFU1NfTEVWRUxTX0xPQ0tfRklMRSxcbiAgQUNDRVNTX0xFVkVMU19GSUxFLFxufSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgdmFsaWRhdGVBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL3ZhbGlkYXRlQWNjZXNzTGV2ZWxzJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IHNhdmVBY2Nlc3NMZXZlbHMgPSBhcHAgPT4gYXN5bmMgYWNjZXNzTGV2ZWxzID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuc2F2ZUFjY2Vzc0xldmVscyxcbiAgcGVybWlzc2lvbi53cml0ZUFjY2Vzc0xldmVscy5pc0F1dGhvcml6ZWQsXG4gIHsgYWNjZXNzTGV2ZWxzIH0sXG4gIF9zYXZlQWNjZXNzTGV2ZWxzLCBhcHAsIGFjY2Vzc0xldmVscyxcbik7XG5cbmV4cG9ydCBjb25zdCBfc2F2ZUFjY2Vzc0xldmVscyA9IGFzeW5jIChhcHAsIGFjY2Vzc0xldmVscykgPT4ge1xuICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGVBY2Nlc3NMZXZlbHMoYXBwKShhY2Nlc3NMZXZlbHMubGV2ZWxzKTtcbiAgaWYgKHZhbGlkYXRpb25FcnJvcnMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGVycnMgPSAkKHZhbGlkYXRpb25FcnJvcnMsIFtcbiAgICAgIG1hcChlID0+IGUuZXJyb3IpLFxuICAgICAgam9pbignLCAnKSxcbiAgICBdKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgQWNjZXNzIExldmVscyBJbnZhbGlkOiAke2VycnN9YCxcbiAgICApO1xuICB9XG5cbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldExvY2soXG4gICAgYXBwLCBBQ0NFU1NfTEVWRUxTX0xPQ0tfRklMRSwgMjAwMCwgMixcbiAgKTtcblxuICBpZiAoaXNOb2xvY2sobG9jaykpIHsgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZ2V0IGxvY2sgdG8gc2F2ZSBhY2Nlc3MgbGV2ZWxzJyk7IH1cblxuICB0cnkge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihBQ0NFU1NfTEVWRUxTX0ZJTEUpO1xuICAgIGlmIChleGlzdGluZy52ZXJzaW9uICE9PSBhY2Nlc3NMZXZlbHMudmVyc2lvbikgeyB0aHJvdyBuZXcgRXJyb3IoJ0FjY2VzcyBsZXZlbHMgaGF2ZSBhbHJlYWR5IGJlZW4gdXBkYXRlZCwgc2luY2UgeW91IGxvYWRlZCcpOyB9XG5cbiAgICBhY2Nlc3NMZXZlbHMudmVyc2lvbisrO1xuXG4gICAgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKEFDQ0VTU19MRVZFTFNfRklMRSwgYWNjZXNzTGV2ZWxzKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgZmlsdGVyLCB2YWx1ZXMsIGVhY2gsIGtleXMsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5pbXBvcnQge1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGlzSW5kZXgsIGlzUmVjb3JkLFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgJCB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucyA9IChhcHApID0+IHtcbiAgY29uc3QgYWxsTm9kZXMgPSBnZXRGbGF0dGVuZWRIaWVyYXJjaHkoYXBwLmhpZXJhcmNoeSk7XG4gIGNvbnN0IGFjY2Vzc0xldmVsID0geyBwZXJtaXNzaW9uczogW10gfTtcblxuICBjb25zdCByZWNvcmROb2RlcyA9ICQoYWxsTm9kZXMsIFtcbiAgICBmaWx0ZXIoaXNSZWNvcmQpLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IG4gb2YgcmVjb3JkTm9kZXMpIHtcbiAgICBwZXJtaXNzaW9uLmNyZWF0ZVJlY29yZC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcbiAgICBwZXJtaXNzaW9uLnVwZGF0ZVJlY29yZC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcbiAgICBwZXJtaXNzaW9uLmRlbGV0ZVJlY29yZC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcbiAgICBwZXJtaXNzaW9uLnJlYWRSZWNvcmQuYWRkKG4ubm9kZUtleSgpLCBhY2Nlc3NMZXZlbCk7XG4gIH1cblxuICBjb25zdCBpbmRleE5vZGVzID0gJChhbGxOb2RlcywgW1xuICAgIGZpbHRlcihpc0luZGV4KSxcbiAgXSk7XG5cbiAgZm9yIChjb25zdCBuIG9mIGluZGV4Tm9kZXMpIHtcbiAgICBwZXJtaXNzaW9uLnJlYWRJbmRleC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcbiAgfVxuXG4gIGZvciAoY29uc3QgYSBvZiBrZXlzKGFwcC5hY3Rpb25zKSkge1xuICAgIHBlcm1pc3Npb24uZXhlY3V0ZUFjdGlvbi5hZGQoYSwgYWNjZXNzTGV2ZWwpO1xuICB9XG5cbiAgJChwZXJtaXNzaW9uLCBbXG4gICAgdmFsdWVzLFxuICAgIGZpbHRlcihwID0+ICFwLmlzTm9kZSksXG4gICAgZWFjaChwID0+IHAuYWRkKGFjY2Vzc0xldmVsKSksXG4gIF0pO1xuXG4gIHJldHVybiBhY2Nlc3NMZXZlbC5wZXJtaXNzaW9ucztcbn07XG4iLCJpbXBvcnQgeyBkaWZmZXJlbmNlLCBtYXAsIGpvaW4gfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgZ2V0TG9jaywgaXNOb2xvY2ssIHJlbGVhc2VMb2NrLCAkLFxuICBhcGlXcmFwcGVyLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBVU0VSU19MT0NLX0ZJTEUsIEFDQ0VTU19MRVZFTFNfRklMRSxcbiAgZ2V0VXNlckJ5TmFtZSwgVVNFUlNfTElTVF9GSUxFLFxufSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgTm90Rm91bmRFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3Qgc2V0VXNlckFjY2Vzc0xldmVscyA9IGFwcCA9PiBhc3luYyAodXNlck5hbWUsIGFjY2Vzc0xldmVscykgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5zZXRVc2VyQWNjZXNzTGV2ZWxzLFxuICBwZXJtaXNzaW9uLnNldFVzZXJBY2Nlc3NMZXZlbHMuaXNBdXRob3JpemVkLFxuICB7IHVzZXJOYW1lLCBhY2Nlc3NMZXZlbHMgfSxcbiAgX3NldFVzZXJBY2Nlc3NMZXZlbHMsIGFwcCwgdXNlck5hbWUsIGFjY2Vzc0xldmVscyxcbik7XG5cbmV4cG9ydCBjb25zdCBfc2V0VXNlckFjY2Vzc0xldmVscyA9IGFzeW5jIChhcHAsIHVzZXJuYW1lLCBhY2Nlc3NMZXZlbHMpID0+IHtcbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldExvY2soYXBwLCBVU0VSU19MT0NLX0ZJTEUsIDEwMDAsIDEsIDApO1xuXG4gIGNvbnN0IGFjdHVhbEFjY2Vzc0xldmVscyA9ICQoXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihBQ0NFU1NfTEVWRUxTX0ZJTEUpLFxuICAgIFtcbiAgICAgIGwgPT4gbC5sZXZlbHMsXG4gICAgICBtYXAobCA9PiBsLm5hbWUpLFxuICAgIF0sXG4gICk7XG5cbiAgY29uc3QgbWlzc2luZyA9IGRpZmZlcmVuY2UoYWNjZXNzTGV2ZWxzKShhY3R1YWxBY2Nlc3NMZXZlbHMpO1xuICBpZiAobWlzc2luZy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFjY2VzcyBsZXZlbHMgc3VwcGxpZWQ6ICR7am9pbignLCAnLCBtaXNzaW5nKX1gKTtcbiAgfVxuXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIHNldCB1c2VyIGFjY2VzcyBsZXZlbHMgY2Fubm90IGdldCBsb2NrJyk7IH1cblxuICB0cnkge1xuICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihVU0VSU19MSVNUX0ZJTEUpO1xuICAgIGNvbnN0IHVzZXIgPSBnZXRVc2VyQnlOYW1lKHVzZXJzLCB1c2VybmFtZSk7XG4gICAgaWYgKCF1c2VyKSB7IHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGBDb3VsZCBub3QgZmluZCB1c2VyIHdpdGggJHt1c2VybmFtZX1gKTsgfVxuXG4gICAgdXNlci5hY2Nlc3NMZXZlbHMgPSBhY2Nlc3NMZXZlbHM7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFVTRVJTX0xJU1RfRklMRSwgdXNlcnMpO1xuICB9IGZpbmFsbHkge1xuICAgIHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBhdXRoZW50aWNhdGUsXG4gIGF1dGhlbnRpY2F0ZVRlbXBvcmFyeUFjY2Vzcyxcbn0gZnJvbSAnLi9hdXRoZW50aWNhdGUnO1xuaW1wb3J0IHsgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzIH0gZnJvbSAnLi9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MnO1xuaW1wb3J0IHsgY3JlYXRlVXNlciB9IGZyb20gJy4vY3JlYXRlVXNlcic7XG5pbXBvcnQgeyBlbmFibGVVc2VyLCBkaXNhYmxlVXNlciB9IGZyb20gJy4vZW5hYmxlVXNlcic7XG5pbXBvcnQgeyBsb2FkQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi9sb2FkQWNjZXNzTGV2ZWxzJztcbmltcG9ydCB7IGdldE5ld0FjY2Vzc0xldmVsIH0gZnJvbSAnLi9nZXROZXdBY2Nlc3NMZXZlbCc7XG5pbXBvcnQgeyBnZXROZXdVc2VyLCBnZXROZXdVc2VyQXV0aCB9IGZyb20gJy4vZ2V0TmV3VXNlcic7XG5pbXBvcnQgeyBnZXRVc2VycyB9IGZyb20gJy4vZ2V0VXNlcnMnO1xuaW1wb3J0IHsgaXNBdXRob3JpemVkIH0gZnJvbSAnLi9pc0F1dGhvcml6ZWQnO1xuaW1wb3J0IHsgc2F2ZUFjY2Vzc0xldmVscyB9IGZyb20gJy4vc2F2ZUFjY2Vzc0xldmVscyc7XG5pbXBvcnQge1xuICBjaGFuZ2VNeVBhc3N3b3JkLFxuICBzY29yZVBhc3N3b3JkLCBzZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlLFxuICBpc1ZhbGlkUGFzc3dvcmQsXG59IGZyb20gJy4vc2V0UGFzc3dvcmQnO1xuaW1wb3J0IHsgdmFsaWRhdGVVc2VyIH0gZnJvbSAnLi92YWxpZGF0ZVVzZXInO1xuaW1wb3J0IHsgdmFsaWRhdGVBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL3ZhbGlkYXRlQWNjZXNzTGV2ZWxzJztcbmltcG9ydCB7IGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zIH0gZnJvbSAnLi9nZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBzZXRVc2VyQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi9zZXRVc2VyQWNjZXNzTGV2ZWxzJztcblxuZXhwb3J0IGNvbnN0IGdldEF1dGhBcGkgPSBhcHAgPT4gKHtcbiAgYXV0aGVudGljYXRlOiBhdXRoZW50aWNhdGUoYXBwKSxcbiAgYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzOiBhdXRoZW50aWNhdGVUZW1wb3JhcnlBY2Nlc3MoYXBwKSxcbiAgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzOiBjcmVhdGVUZW1wb3JhcnlBY2Nlc3MoYXBwKSxcbiAgY3JlYXRlVXNlcjogY3JlYXRlVXNlcihhcHApLFxuICBsb2FkQWNjZXNzTGV2ZWxzOiBsb2FkQWNjZXNzTGV2ZWxzKGFwcCksXG4gIGVuYWJsZVVzZXI6IGVuYWJsZVVzZXIoYXBwKSxcbiAgZGlzYWJsZVVzZXI6IGRpc2FibGVVc2VyKGFwcCksXG4gIGdldE5ld0FjY2Vzc0xldmVsOiBnZXROZXdBY2Nlc3NMZXZlbChhcHApLFxuICBnZXROZXdVc2VyOiBnZXROZXdVc2VyKGFwcCksXG4gIGdldE5ld1VzZXJBdXRoOiBnZXROZXdVc2VyQXV0aChhcHApLFxuICBnZXRVc2VyczogZ2V0VXNlcnMoYXBwKSxcbiAgc2F2ZUFjY2Vzc0xldmVsczogc2F2ZUFjY2Vzc0xldmVscyhhcHApLFxuICBpc0F1dGhvcml6ZWQ6IGlzQXV0aG9yaXplZChhcHApLFxuICBjaGFuZ2VNeVBhc3N3b3JkOiBjaGFuZ2VNeVBhc3N3b3JkKGFwcCksXG4gIHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGU6IHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUoYXBwKSxcbiAgc2NvcmVQYXNzd29yZCxcbiAgaXNWYWxpZFBhc3N3b3JkOiBpc1ZhbGlkUGFzc3dvcmQoYXBwKSxcbiAgdmFsaWRhdGVVc2VyOiB2YWxpZGF0ZVVzZXIoYXBwKSxcbiAgdmFsaWRhdGVBY2Nlc3NMZXZlbHM6IHZhbGlkYXRlQWNjZXNzTGV2ZWxzKGFwcCksXG4gIGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zOiAoKSA9PiBnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucyhhcHApLFxuICBzZXRVc2VyQWNjZXNzTGV2ZWxzOiBzZXRVc2VyQWNjZXNzTGV2ZWxzKGFwcCksXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0QXV0aEFwaTtcbiIsImltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IGFwaVdyYXBwZXJTeW5jIH0gZnJvbSAnLi4vY29tbW9uL2FwaVdyYXBwZXInO1xuaW1wb3J0IHsgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uL2V2ZW50cyc7XG5cbmV4cG9ydCBjb25zdCBleGVjdXRlQWN0aW9uID0gYXBwID0+IChhY3Rpb25OYW1lLCBvcHRpb25zKSA9PiB7XG4gIGFwaVdyYXBwZXJTeW5jKFxuICAgIGFwcCxcbiAgICBldmVudHMuYWN0aW9uc0FwaS5leGVjdXRlLFxuICAgIHBlcm1pc3Npb24uZXhlY3V0ZUFjdGlvbi5pc0F1dGhvcml6ZWQoYWN0aW9uTmFtZSksXG4gICAgeyBhY3Rpb25OYW1lLCBvcHRpb25zIH0sXG4gICAgYXBwLmFjdGlvbnNbYWN0aW9uTmFtZV0sIG9wdGlvbnMsXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgX2V4ZWN1dGVBY3Rpb24gPSAoYmVoYXZpb3VyU291cmNlcywgYWN0aW9uLCBvcHRpb25zKSA9PiBiZWhhdmlvdXJTb3VyY2VzW2FjdGlvbi5iZWhhdmlvdXJTb3VyY2VdW2FjdGlvbi5iZWhhdmlvdXJOYW1lXShvcHRpb25zKTtcbiIsImltcG9ydCB7IGV4ZWN1dGVBY3Rpb24gfSBmcm9tICcuL2V4ZWN1dGUnO1xuXG5leHBvcnQgY29uc3QgZ2V0QWN0aW9uc0FwaSA9IGFwcCA9PiAoe1xuICBleGVjdXRlOiBleGVjdXRlQWN0aW9uKGFwcCksXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0QWN0aW9uc0FwaTtcbiIsImltcG9ydCB7IGhhcyB9IGZyb20gJ2xvZGFzaC9mcCc7XG5cbmNvbnN0IHB1Ymxpc2ggPSBoYW5kbGVycyA9PiBhc3luYyAoZXZlbnROYW1lLCBjb250ZXh0ID0ge30pID0+IHtcbiAgaWYgKCFoYXMoZXZlbnROYW1lKShoYW5kbGVycykpIHJldHVybjtcblxuICBmb3IgKGNvbnN0IGhhbmRsZXIgb2YgaGFuZGxlcnNbZXZlbnROYW1lXSkge1xuICAgIGF3YWl0IGhhbmRsZXIoZXZlbnROYW1lLCBjb250ZXh0KTtcbiAgfVxufTtcblxuY29uc3Qgc3Vic2NyaWJlID0gaGFuZGxlcnMgPT4gKGV2ZW50TmFtZSwgaGFuZGxlcikgPT4ge1xuICBpZiAoIWhhcyhldmVudE5hbWUpKGhhbmRsZXJzKSkge1xuICAgIGhhbmRsZXJzW2V2ZW50TmFtZV0gPSBbXTtcbiAgfVxuICBoYW5kbGVyc1tldmVudE5hbWVdLnB1c2goaGFuZGxlcik7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlRXZlbnRBZ2dyZWdhdG9yID0gKCkgPT4ge1xuICBjb25zdCBoYW5kbGVycyA9IHt9O1xuICBjb25zdCBldmVudEFnZ3JlZ2F0b3IgPSAoe1xuICAgIHB1Ymxpc2g6IHB1Ymxpc2goaGFuZGxlcnMpLFxuICAgIHN1YnNjcmliZTogc3Vic2NyaWJlKGhhbmRsZXJzKSxcbiAgfSk7XG4gIHJldHVybiBldmVudEFnZ3JlZ2F0b3I7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVFdmVudEFnZ3JlZ2F0b3I7XG4iLCJpbXBvcnQgeyByZXRyeSB9IGZyb20gJy4uL2NvbW1vbi9pbmRleCc7XG5pbXBvcnQgeyBOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmNvbnN0IGNyZWF0ZUpzb24gPSBvcmlnaW5hbENyZWF0ZUZpbGUgPT4gYXN5bmMgKGtleSwgb2JqLCByZXRyaWVzID0gNSwgZGVsYXkgPSA1MDApID0+IGF3YWl0IHJldHJ5KG9yaWdpbmFsQ3JlYXRlRmlsZSwgcmV0cmllcywgZGVsYXksIGtleSwgSlNPTi5zdHJpbmdpZnkob2JqKSk7XG5cbmNvbnN0IGNyZWF0ZU5ld0ZpbGUgPSBvcmlnaW5hbENyZWF0ZUZpbGUgPT4gYXN5bmMgKHBhdGgsIGNvbnRlbnQsIHJldHJpZXMgPSA1LCBkZWxheSA9IDUwMCkgPT4gYXdhaXQgcmV0cnkob3JpZ2luYWxDcmVhdGVGaWxlLCByZXRyaWVzLCBkZWxheSwgcGF0aCwgY29udGVudCk7XG5cbmNvbnN0IGxvYWRKc29uID0gZGF0YXN0b3JlID0+IGFzeW5jIChrZXksIHJldHJpZXMgPSA1LCBkZWxheSA9IDUwMCkgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCByZXRyeShKU09OLnBhcnNlLCByZXRyaWVzLCBkZWxheSwgYXdhaXQgZGF0YXN0b3JlLmxvYWRGaWxlKGtleSkpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICB0aHJvdyBuZXcgTm90Rm91bmRFcnJvcihlcnIubWVzc2FnZSk7XG4gIH1cbn1cblxuY29uc3QgdXBkYXRlSnNvbiA9IGRhdGFzdG9yZSA9PiBhc3luYyAoa2V5LCBvYmosIHJldHJpZXMgPSA1LCBkZWxheSA9IDUwMCkgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCByZXRyeShkYXRhc3RvcmUudXBkYXRlRmlsZSwgcmV0cmllcywgZGVsYXksIGtleSwgSlNPTi5zdHJpbmdpZnkob2JqKSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGVyci5tZXNzYWdlKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgc2V0dXBEYXRhc3RvcmUgPSAoZGF0YXN0b3JlKSA9PiB7XG4gIGNvbnN0IG9yaWdpbmFsQ3JlYXRlRmlsZSA9IGRhdGFzdG9yZS5jcmVhdGVGaWxlO1xuICBkYXRhc3RvcmUubG9hZEpzb24gPSBsb2FkSnNvbihkYXRhc3RvcmUpO1xuICBkYXRhc3RvcmUuY3JlYXRlSnNvbiA9IGNyZWF0ZUpzb24ob3JpZ2luYWxDcmVhdGVGaWxlKTtcbiAgZGF0YXN0b3JlLnVwZGF0ZUpzb24gPSB1cGRhdGVKc29uKGRhdGFzdG9yZSk7XG4gIGRhdGFzdG9yZS5jcmVhdGVGaWxlID0gY3JlYXRlTmV3RmlsZShvcmlnaW5hbENyZWF0ZUZpbGUpO1xuICBpZiAoZGF0YXN0b3JlLmNyZWF0ZUVtcHR5RGIpIHsgZGVsZXRlIGRhdGFzdG9yZS5jcmVhdGVFbXB0eURiOyB9XG4gIHJldHVybiBkYXRhc3RvcmU7XG59O1xuXG5leHBvcnQgeyBjcmVhdGVFdmVudEFnZ3JlZ2F0b3IgfSBmcm9tICcuL2V2ZW50QWdncmVnYXRvcic7XG5cbmV4cG9ydCBkZWZhdWx0IHNldHVwRGF0YXN0b3JlO1xuIiwiaW1wb3J0IHsgXG4gIGNvbXBpbGVFeHByZXNzaW9uIGFzIGNFeHAsIFxuICBjb21waWxlQ29kZSBhcyBjQ29kZSBcbn0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xuXG5leHBvcnQgY29uc3QgY29tcGlsZUNvZGUgPSBjb2RlID0+IHtcbiAgbGV0IGZ1bmM7ICBcbiAgICBcbiAgdHJ5IHtcbiAgICBmdW5jID0gY0NvZGUoY29kZSk7XG4gIH0gY2F0Y2goZSkge1xuICAgIGUubWVzc2FnZSA9IGBFcnJvciBjb21waWxpbmcgY29kZSA6ICR7Y29kZX0gOiAke2UubWVzc2FnZX1gO1xuICAgIHRocm93IGU7XG4gIH1cblxuICByZXR1cm4gZnVuYztcbn1cblxuZXhwb3J0IGNvbnN0IGNvbXBpbGVFeHByZXNzaW9uID0gY29kZSA9PiB7XG4gIGxldCBmdW5jOyAgXG4gICAgICBcbiAgdHJ5IHtcbiAgICBmdW5jID0gY0V4cChjb2RlKTtcbiAgfSBjYXRjaChlKSB7XG4gICAgZS5tZXNzYWdlID0gYEVycm9yIGNvbXBpbGluZyBleHByZXNzaW9uIDogJHtjb2RlfSA6ICR7ZS5tZXNzYWdlfWA7XG4gICAgdGhyb3cgZTtcbiAgfVxuICBcbiAgcmV0dXJuIGZ1bmM7XG59XG4iLCJpbXBvcnQge1xuICBpc0Z1bmN0aW9uLCBmaWx0ZXIsIG1hcCxcbiAgdW5pcUJ5LCBrZXlzLCBkaWZmZXJlbmNlLFxuICBqb2luLCByZWR1Y2UsIGZpbmQsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBjb21waWxlRXhwcmVzc2lvbiwgY29tcGlsZUNvZGUgfSBmcm9tICcuLi9jb21tb24vY29tcGlsZUNvZGUnO1xuaW1wb3J0IHsgJCB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBfZXhlY3V0ZUFjdGlvbiB9IGZyb20gJy4vZXhlY3V0ZSc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IsIE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxpc2VBY3Rpb25zID0gKHN1YnNjcmliZSwgYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucywgdHJpZ2dlcnMsIGFwaXMpID0+IHtcbiAgdmFsaWRhdGVTb3VyY2VzKGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMpO1xuICBzdWJzY3JpYmVUcmlnZ2VycyhzdWJzY3JpYmUsIGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMsIHRyaWdnZXJzLCBhcGlzKTtcbiAgcmV0dXJuIGNyZWF0ZUFjdGlvbnNDb2xsZWN0aW9uKGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMpO1xufTtcblxuY29uc3QgY3JlYXRlQWN0aW9uc0NvbGxlY3Rpb24gPSAoYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucykgPT4gJChhY3Rpb25zLCBbXG4gIHJlZHVjZSgoYWxsLCBhKSA9PiB7XG4gICAgYWxsW2EubmFtZV0gPSBvcHRzID0+IF9leGVjdXRlQWN0aW9uKGJlaGF2aW91clNvdXJjZXMsIGEsIG9wdHMpO1xuICAgIHJldHVybiBhbGw7XG4gIH0sIHt9KSxcbl0pO1xuXG5jb25zdCBzdWJzY3JpYmVUcmlnZ2VycyA9IChzdWJzY3JpYmUsIGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMsIHRyaWdnZXJzLCBhcGlzKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZU9wdGlvbnMgPSAob3B0aW9uc0NyZWF0b3IsIGV2ZW50Q29udGV4dCkgPT4ge1xuICAgIGlmICghb3B0aW9uc0NyZWF0b3IpIHJldHVybiB7fTtcbiAgICBjb25zdCBjcmVhdGUgPSBjb21waWxlQ29kZShvcHRpb25zQ3JlYXRvcik7XG4gICAgcmV0dXJuIGNyZWF0ZSh7IGNvbnRleHQ6IGV2ZW50Q29udGV4dCwgYXBpcyB9KTtcbiAgfTtcblxuICBjb25zdCBzaG91bGRSdW5UcmlnZ2VyID0gKHRyaWdnZXIsIGV2ZW50Q29udGV4dCkgPT4ge1xuICAgIGlmICghdHJpZ2dlci5jb25kaXRpb24pIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHNob3VsZFJ1biA9IGNvbXBpbGVFeHByZXNzaW9uKHRyaWdnZXIuY29uZGl0aW9uKTtcbiAgICByZXR1cm4gc2hvdWxkUnVuKHsgY29udGV4dDogZXZlbnRDb250ZXh0IH0pO1xuICB9O1xuXG4gIGZvciAobGV0IHRyaWcgb2YgdHJpZ2dlcnMpIHtcbiAgICBzdWJzY3JpYmUodHJpZy5ldmVudE5hbWUsIGFzeW5jIChldiwgY3R4KSA9PiB7XG4gICAgICBpZiAoc2hvdWxkUnVuVHJpZ2dlcih0cmlnLCBjdHgpKSB7XG4gICAgICAgIGF3YWl0IF9leGVjdXRlQWN0aW9uKFxuICAgICAgICAgIGJlaGF2aW91clNvdXJjZXMsXG4gICAgICAgICAgZmluZChhID0+IGEubmFtZSA9PT0gdHJpZy5hY3Rpb25OYW1lKShhY3Rpb25zKSxcbiAgICAgICAgICBjcmVhdGVPcHRpb25zKHRyaWcub3B0aW9uc0NyZWF0b3IsIGN0eCksXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07XG5cbmNvbnN0IHZhbGlkYXRlU291cmNlcyA9IChiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zKSA9PiB7XG4gIGNvbnN0IGRlY2xhcmVkU291cmNlcyA9ICQoYWN0aW9ucywgW1xuICAgIHVuaXFCeShhID0+IGEuYmVoYXZpb3VyU291cmNlKSxcbiAgICBtYXAoYSA9PiBhLmJlaGF2aW91clNvdXJjZSksXG4gIF0pO1xuXG4gIGNvbnN0IHN1cHBsaWVkU291cmNlcyA9IGtleXMoYmVoYXZpb3VyU291cmNlcyk7XG5cbiAgY29uc3QgbWlzc2luZ1NvdXJjZXMgPSBkaWZmZXJlbmNlKFxuICAgIGRlY2xhcmVkU291cmNlcywgc3VwcGxpZWRTb3VyY2VzLFxuICApO1xuXG4gIGlmIChtaXNzaW5nU291cmNlcy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgRGVjbGFyZWQgYmVoYXZpb3VyIHNvdXJjZXMgYXJlIG5vdCBzdXBwbGllZDogJHtqb2luKCcsICcsIG1pc3NpbmdTb3VyY2VzKX1gKTtcbiAgfVxuXG4gIGNvbnN0IG1pc3NpbmdCZWhhdmlvdXJzID0gJChhY3Rpb25zLCBbXG4gICAgZmlsdGVyKGEgPT4gIWlzRnVuY3Rpb24oYmVoYXZpb3VyU291cmNlc1thLmJlaGF2aW91clNvdXJjZV1bYS5iZWhhdmlvdXJOYW1lXSkpLFxuICAgIG1hcChhID0+IGBBY3Rpb246ICR7YS5uYW1lfSA6ICR7YS5iZWhhdmlvdXJTb3VyY2V9LiR7YS5iZWhhdmlvdXJOYW1lfWApLFxuICBdKTtcblxuICBpZiAobWlzc2luZ0JlaGF2aW91cnMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGBNaXNzaW5nIGJlaGF2aW91cnM6IGNvdWxkIG5vdCBmaW5kIGJlaGF2aW91ciBmdW5jdGlvbnM6ICR7am9pbignLCAnLCBtaXNzaW5nQmVoYXZpb3Vycyl9YCk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBtYXAsIGZpbHRlciwgZ3JvdXBCeSwgc3BsaXQsXG4gIHNvbWUsIGZpbmQsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBMT0NLX0ZJTEVOQU1FLCBUUkFOU0FDVElPTlNfRk9MREVSLCBpZFNlcCwgaXNVcGRhdGUsXG4gIG5vZGVLZXlIYXNoRnJvbUJ1aWxkRm9sZGVyLCBpc0J1aWxkSW5kZXhGb2xkZXIsIGdldFRyYW5zYWN0aW9uSWQsXG4gIGlzRGVsZXRlLCBpc0NyZWF0ZSxcbn0gZnJvbSAnLi90cmFuc2FjdGlvbnNDb21tb24nO1xuaW1wb3J0IHtcbiAgam9pbktleSwgJCwgbm9uZSwgaXNTb21ldGhpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXRMYXN0UGFydEluS2V5LCBnZXROb2RlRnJvbU5vZGVLZXlIYXNoIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IF9sb2FkIH0gZnJvbSAnLi4vcmVjb3JkQXBpL2xvYWQnO1xuXG5leHBvcnQgY29uc3QgcmV0cmlldmUgPSBhc3luYyAoYXBwKSA9PiB7XG4gIGNvbnN0IHRyYW5zYWN0aW9uRmlsZXMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZvbGRlckNvbnRlbnRzKFxuICAgIFRSQU5TQUNUSU9OU19GT0xERVIsXG4gICk7XG5cbiAgbGV0IHRyYW5zYWN0aW9ucyA9IFtdO1xuXG4gIGlmIChzb21lKGlzQnVpbGRJbmRleEZvbGRlcikodHJhbnNhY3Rpb25GaWxlcykpIHtcbiAgICBjb25zdCBidWlsZEluZGV4Rm9sZGVyID0gZmluZChpc0J1aWxkSW5kZXhGb2xkZXIpKHRyYW5zYWN0aW9uRmlsZXMpO1xuXG4gICAgdHJhbnNhY3Rpb25zID0gYXdhaXQgcmV0cmlldmVCdWlsZEluZGV4VHJhbnNhY3Rpb25zKFxuICAgICAgYXBwLFxuICAgICAgam9pbktleShUUkFOU0FDVElPTlNfRk9MREVSLCBidWlsZEluZGV4Rm9sZGVyKSxcbiAgICApO1xuICB9XG5cbiAgaWYgKHRyYW5zYWN0aW9ucy5sZW5ndGggPiAwKSByZXR1cm4gdHJhbnNhY3Rpb25zO1xuXG4gIHJldHVybiBhd2FpdCByZXRyaWV2ZVN0YW5kYXJkVHJhbnNhY3Rpb25zKFxuICAgIGFwcCwgdHJhbnNhY3Rpb25GaWxlcyxcbiAgKTtcbn07XG5cbmNvbnN0IHJldHJpZXZlQnVpbGRJbmRleFRyYW5zYWN0aW9ucyA9IGFzeW5jIChhcHAsIGJ1aWxkSW5kZXhGb2xkZXIpID0+IHtcbiAgY29uc3QgY2hpbGRGb2xkZXJzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5nZXRGb2xkZXJDb250ZW50cyhidWlsZEluZGV4Rm9sZGVyKTtcbiAgaWYgKGNoaWxkRm9sZGVycy5sZW5ndGggPT09IDApIHtcbiAgICAvLyBjbGVhbnVwXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoYnVpbGRJbmRleEZvbGRlcik7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgZ2V0VHJhbnNhY3Rpb25GaWxlcyA9IGFzeW5jIChjaGlsZEZvbGRlckluZGV4ID0gMCkgPT4ge1xuICAgIGlmIChjaGlsZEZvbGRlckluZGV4ID49IGNoaWxkRm9sZGVycy5sZW5ndGgpIHJldHVybiBbXTtcblxuICAgIGNvbnN0IGNoaWxkRm9sZGVyS2V5ID0gam9pbktleShidWlsZEluZGV4Rm9sZGVyLCBjaGlsZEZvbGRlcnNbY2hpbGRGb2xkZXJJbmRleF0pO1xuICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5nZXRGb2xkZXJDb250ZW50cyhcbiAgICAgIGNoaWxkRm9sZGVyS2V5LFxuICAgICk7XG5cbiAgICBpZiAoZmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihjaGlsZEZvbGRlcktleSk7XG4gICAgICByZXR1cm4gYXdhaXQgZ2V0VHJhbnNhY3Rpb25GaWxlcyhjaGlsZEZvbGRlckluZGV4ICsgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgY2hpbGRGb2xkZXJLZXksIGZpbGVzIH07XG4gIH07XG5cbiAgY29uc3QgdHJhbnNhY3Rpb25GaWxlcyA9IGF3YWl0IGdldFRyYW5zYWN0aW9uRmlsZXMoKTtcblxuICBpZiAodHJhbnNhY3Rpb25GaWxlcy5maWxlcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCB0cmFuc2FjdGlvbnMgPSAkKHRyYW5zYWN0aW9uRmlsZXMuZmlsZXMsIFtcbiAgICBtYXAocGFyc2VUcmFuc2FjdGlvbklkKSxcbiAgXSk7XG5cbiAgZm9yIChjb25zdCB0IG9mIHRyYW5zYWN0aW9ucykge1xuICAgIGNvbnN0IHRyYW5zYWN0aW9uQ29udGVudCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgICBqb2luS2V5KFxuICAgICAgICB0cmFuc2FjdGlvbkZpbGVzLmNoaWxkRm9sZGVyS2V5LFxuICAgICAgICB0LmZ1bGxJZCxcbiAgICAgICksXG4gICAgKTtcbiAgICB0LnJlY29yZCA9IGF3YWl0IF9sb2FkKGFwcCwgdHJhbnNhY3Rpb25Db250ZW50LnJlY29yZEtleSk7XG4gIH1cblxuICB0cmFuc2FjdGlvbnMuaW5kZXhOb2RlID0gJChidWlsZEluZGV4Rm9sZGVyLCBbXG4gICAgZ2V0TGFzdFBhcnRJbktleSxcbiAgICBub2RlS2V5SGFzaEZyb21CdWlsZEZvbGRlcixcbiAgICBnZXROb2RlRnJvbU5vZGVLZXlIYXNoKGFwcC5oaWVyYXJjaHkpLFxuICBdKTtcblxuICB0cmFuc2FjdGlvbnMuZm9sZGVyS2V5ID0gdHJhbnNhY3Rpb25GaWxlcy5jaGlsZEZvbGRlcktleTtcblxuICByZXR1cm4gdHJhbnNhY3Rpb25zO1xufTtcblxuY29uc3QgcmV0cmlldmVTdGFuZGFyZFRyYW5zYWN0aW9ucyA9IGFzeW5jIChhcHAsIHRyYW5zYWN0aW9uRmlsZXMpID0+IHtcbiAgY29uc3QgdHJhbnNhY3Rpb25JZHMgPSAkKHRyYW5zYWN0aW9uRmlsZXMsIFtcbiAgICBmaWx0ZXIoZiA9PiBmICE9PSBMT0NLX0ZJTEVOQU1FXG4gICAgICAgICAgICAgICAgICAgICYmICFpc0J1aWxkSW5kZXhGb2xkZXIoZikpLFxuICAgIG1hcChwYXJzZVRyYW5zYWN0aW9uSWQpLFxuICBdKTtcblxuICBjb25zdCB0cmFuc2FjdGlvbklkc0J5UmVjb3JkID0gJCh0cmFuc2FjdGlvbklkcywgW1xuICAgIGdyb3VwQnkoJ3JlY29yZElkJyksXG4gIF0pO1xuXG4gIGNvbnN0IGRlZHVwZWRUcmFuc2FjdGlvbnMgPSBbXTtcblxuICBjb25zdCB2ZXJpZnkgPSBhc3luYyAodCkgPT4ge1xuICAgIGlmICh0LnZlcmlmaWVkID09PSB0cnVlKSByZXR1cm4gdDtcblxuICAgIGNvbnN0IGlkID0gZ2V0VHJhbnNhY3Rpb25JZChcbiAgICAgIHQucmVjb3JkSWQsXG4gICAgICB0LnRyYW5zYWN0aW9uVHlwZSxcbiAgICAgIHQudW5pcXVlSWQsXG4gICAgKTtcblxuICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICAgIGpvaW5LZXkoVFJBTlNBQ1RJT05TX0ZPTERFUiwgaWQpLFxuICAgICk7XG5cbiAgICBpZiAoaXNEZWxldGUodCkpIHtcbiAgICAgIHQucmVjb3JkID0gdHJhbnNhY3Rpb24ucmVjb3JkO1xuICAgICAgdC52ZXJpZmllZCA9IHRydWU7XG4gICAgICByZXR1cm4gdDtcbiAgICB9XG5cbiAgICBjb25zdCByZWMgPSBhd2FpdCBfbG9hZChcbiAgICAgIGFwcCxcbiAgICAgIHRyYW5zYWN0aW9uLnJlY29yZEtleSxcbiAgICApO1xuICAgIGlmIChyZWMudHJhbnNhY3Rpb25JZCA9PT0gaWQpIHtcbiAgICAgIHQucmVjb3JkID0gcmVjO1xuICAgICAgaWYgKHRyYW5zYWN0aW9uLm9sZFJlY29yZCkgeyB0Lm9sZFJlY29yZCA9IHRyYW5zYWN0aW9uLm9sZFJlY29yZDsgfVxuICAgICAgdC52ZXJpZmllZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHQudmVyaWZpZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdDtcbiAgfTtcblxuICBjb25zdCBwaWNrT25lID0gYXN5bmMgKHRyYW5zLCBmb3JUeXBlKSA9PiB7XG4gICAgY29uc3QgdHJhbnNGb3JUeXBlID0gZmlsdGVyKGZvclR5cGUpKHRyYW5zKTtcbiAgICBpZiAodHJhbnNGb3JUeXBlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY29uc3QgdCA9IGF3YWl0IHZlcmlmeSh0cmFuc0ZvclR5cGVbMF0pO1xuICAgICAgcmV0dXJuICh0LnZlcmlmaWVkID09PSB0cnVlID8gdCA6IG51bGwpO1xuICAgIH1cbiAgICBmb3IgKGxldCB0IG9mIHRyYW5zRm9yVHlwZSkge1xuICAgICAgdCA9IGF3YWl0IHZlcmlmeSh0KTtcbiAgICAgIGlmICh0LnZlcmlmaWVkID09PSB0cnVlKSB7IHJldHVybiB0OyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG5cbiAgZm9yIChjb25zdCByZWNvcmRJZCBpbiB0cmFuc2FjdGlvbklkc0J5UmVjb3JkKSB7XG4gICAgY29uc3QgdHJhbnNJZHNGb3JSZWNvcmQgPSB0cmFuc2FjdGlvbklkc0J5UmVjb3JkW3JlY29yZElkXTtcbiAgICBpZiAodHJhbnNJZHNGb3JSZWNvcmQubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCB0ID0gYXdhaXQgdmVyaWZ5KHRyYW5zSWRzRm9yUmVjb3JkWzBdKTtcbiAgICAgIGlmICh0LnZlcmlmaWVkKSB7IGRlZHVwZWRUcmFuc2FjdGlvbnMucHVzaCh0KTsgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChzb21lKGlzRGVsZXRlKSh0cmFuc0lkc0ZvclJlY29yZCkpIHtcbiAgICAgIGNvbnN0IHQgPSBhd2FpdCB2ZXJpZnkoZmluZChpc0RlbGV0ZSkodHJhbnNJZHNGb3JSZWNvcmQpKTtcbiAgICAgIGlmICh0LnZlcmlmaWVkKSB7IGRlZHVwZWRUcmFuc2FjdGlvbnMucHVzaCh0KTsgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChzb21lKGlzVXBkYXRlKSh0cmFuc0lkc0ZvclJlY29yZCkpIHtcbiAgICAgIGNvbnN0IHVwZCA9IGF3YWl0IHBpY2tPbmUodHJhbnNJZHNGb3JSZWNvcmQsIGlzVXBkYXRlKTtcbiAgICAgIGlmIChpc1NvbWV0aGluZyh1cGQpICYmIHVwZC52ZXJpZmllZCkgeyBkZWR1cGVkVHJhbnNhY3Rpb25zLnB1c2godXBkKTsgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChzb21lKGlzQ3JlYXRlKSh0cmFuc0lkc0ZvclJlY29yZCkpIHtcbiAgICAgIGNvbnN0IGNyZSA9IGF3YWl0IHBpY2tPbmUodHJhbnNJZHNGb3JSZWNvcmQsIGlzQ3JlYXRlKTtcbiAgICAgIGlmIChpc1NvbWV0aGluZyhjcmUpKSB7IGRlZHVwZWRUcmFuc2FjdGlvbnMucHVzaChjcmUpOyB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBkdXBsaWNhdGVzID0gJCh0cmFuc2FjdGlvbklkcywgW1xuICAgIGZpbHRlcih0ID0+IG5vbmUoZGR0ID0+IGRkdC51bmlxdWVJZCA9PT0gdC51bmlxdWVJZCkoZGVkdXBlZFRyYW5zYWN0aW9ucykpLFxuICBdKTtcblxuXG4gIGNvbnN0IGRlbGV0ZVByb21pc2VzID0gbWFwKHQgPT4gYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKFxuICAgIGpvaW5LZXkoXG4gICAgICBUUkFOU0FDVElPTlNfRk9MREVSLFxuICAgICAgZ2V0VHJhbnNhY3Rpb25JZChcbiAgICAgICAgdC5yZWNvcmRJZCxcbiAgICAgICAgdC50cmFuc2FjdGlvblR5cGUsXG4gICAgICAgIHQudW5pcXVlSWQsXG4gICAgICApLFxuICAgICksXG4gICkpKGR1cGxpY2F0ZXMpO1xuXG4gIGF3YWl0IFByb21pc2UuYWxsKGRlbGV0ZVByb21pc2VzKTtcblxuICByZXR1cm4gZGVkdXBlZFRyYW5zYWN0aW9ucztcbn07XG5cbmNvbnN0IHBhcnNlVHJhbnNhY3Rpb25JZCA9IChpZCkgPT4ge1xuICBjb25zdCBzcGxpdElkID0gc3BsaXQoaWRTZXApKGlkKTtcbiAgcmV0dXJuICh7XG4gICAgcmVjb3JkSWQ6IHNwbGl0SWRbMF0sXG4gICAgdHJhbnNhY3Rpb25UeXBlOiBzcGxpdElkWzFdLFxuICAgIHVuaXF1ZUlkOiBzcGxpdElkWzJdLFxuICAgIGZ1bGxJZDogaWQsXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IG9yZGVyQnkgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgcmVkdWNlLCBmaW5kLCBpbmNsdWRlcywgZmxhdHRlbiwgdW5pb24sXG4gIGZpbHRlciwgZWFjaCwgbWFwLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgam9pbktleSwgc3BsaXRLZXksIGlzTm9uRW1wdHlTdHJpbmcsXG4gIGlzTm90aGluZywgJCwgaXNTb21ldGhpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksIGdldE5vZGUsIGdldFJlY29yZE5vZGVJZCxcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCwgcmVjb3JkTm9kZUlkSXNBbGxvd2VkLFxuICBpc1JlY29yZCwgaXNHbG9iYWxJbmRleCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IGluZGV4VHlwZXMgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9pbmRleGVzJztcblxuZXhwb3J0IGNvbnN0IGdldFJlbGV2YW50QW5jZXN0b3JJbmRleGVzID0gKGFwcEhpZXJhcmNoeSwgcmVjb3JkKSA9PiB7XG4gIGNvbnN0IGtleSA9IHJlY29yZC5rZXk7XG4gIGNvbnN0IGtleVBhcnRzID0gc3BsaXRLZXkoa2V5KTtcbiAgY29uc3Qgbm9kZUlkID0gZ2V0UmVjb3JkTm9kZUlkKGtleSk7XG5cbiAgY29uc3QgZmxhdEhpZXJhcmNoeSA9IG9yZGVyQnkoZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGFwcEhpZXJhcmNoeSksXG4gICAgW25vZGUgPT4gbm9kZS5wYXRoUmVneCgpLmxlbmd0aF0sXG4gICAgWydkZXNjJ10pO1xuXG4gIGNvbnN0IG1ha2VpbmRleE5vZGVBbmRLZXlfRm9yQW5jZXN0b3JJbmRleCA9IChpbmRleE5vZGUsIGluZGV4S2V5KSA9PiBtYWtlSW5kZXhOb2RlQW5kS2V5KGluZGV4Tm9kZSwgam9pbktleShpbmRleEtleSwgaW5kZXhOb2RlLm5hbWUpKTtcblxuICBjb25zdCB0cmF2ZXJzZUFuY2VzdG9ySW5kZXhlc0luUGF0aCA9ICgpID0+IHJlZHVjZSgoYWNjLCBwYXJ0KSA9PiB7XG4gICAgY29uc3QgY3VycmVudEluZGV4S2V5ID0gam9pbktleShhY2MubGFzdEluZGV4S2V5LCBwYXJ0KTtcbiAgICBhY2MubGFzdEluZGV4S2V5ID0gY3VycmVudEluZGV4S2V5O1xuICAgIGNvbnN0IHRlc3RQYXRoUmVneCA9IHAgPT4gbmV3IFJlZ0V4cChgJHtwLnBhdGhSZWd4KCl9JGApLnRlc3QoY3VycmVudEluZGV4S2V5KTtcbiAgICBjb25zdCBub2RlTWF0Y2ggPSBmaW5kKHRlc3RQYXRoUmVneCkoZmxhdEhpZXJhcmNoeSk7XG5cbiAgICBpZiAoaXNOb3RoaW5nKG5vZGVNYXRjaCkpIHsgcmV0dXJuIGFjYzsgfVxuXG4gICAgaWYgKCFpc1JlY29yZChub2RlTWF0Y2gpXG4gICAgICAgICAgICAgICAgfHwgbm9kZU1hdGNoLmluZGV4ZXMubGVuZ3RoID09PSAwKSB7IHJldHVybiBhY2M7IH1cblxuICAgIGNvbnN0IGluZGV4ZXMgPSAkKG5vZGVNYXRjaC5pbmRleGVzLCBbXG4gICAgICBmaWx0ZXIoaSA9PiBpLmluZGV4VHlwZSA9PT0gaW5kZXhUeXBlcy5hbmNlc3RvclxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgKGkuYWxsb3dlZFJlY29yZE5vZGVJZHMubGVuZ3RoID09PSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgfHwgaW5jbHVkZXMobm9kZUlkKShpLmFsbG93ZWRSZWNvcmROb2RlSWRzKSkpLFxuICAgIF0pO1xuXG4gICAgZWFjaCh2ID0+IGFjYy5ub2Rlc0FuZEtleXMucHVzaChcbiAgICAgIG1ha2VpbmRleE5vZGVBbmRLZXlfRm9yQW5jZXN0b3JJbmRleCh2LCBjdXJyZW50SW5kZXhLZXkpLFxuICAgICkpKGluZGV4ZXMpO1xuXG4gICAgcmV0dXJuIGFjYztcbiAgfSwgeyBsYXN0SW5kZXhLZXk6ICcnLCBub2Rlc0FuZEtleXM6IFtdIH0pKGtleVBhcnRzKS5ub2Rlc0FuZEtleXM7XG5cbiAgY29uc3Qgcm9vdEluZGV4ZXMgPSAkKGZsYXRIaWVyYXJjaHksIFtcbiAgICBmaWx0ZXIobiA9PiBpc0dsb2JhbEluZGV4KG4pICYmIHJlY29yZE5vZGVJZElzQWxsb3dlZChuKShub2RlSWQpKSxcbiAgICBtYXAoaSA9PiBtYWtlSW5kZXhOb2RlQW5kS2V5KGksIGkubm9kZUtleSgpKSksXG4gIF0pO1xuXG4gIHJldHVybiB1bmlvbih0cmF2ZXJzZUFuY2VzdG9ySW5kZXhlc0luUGF0aCgpKShyb290SW5kZXhlcyk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0UmVsZXZhbnRSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyA9IChhcHBIaWVyYXJjaHksIHJlY29yZCkgPT4gJChyZWNvcmQua2V5LCBbXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwSGllcmFyY2h5KSxcbiAgbiA9PiBuLmZpZWxkcyxcbiAgZmlsdGVyKGYgPT4gZi50eXBlID09PSAncmVmZXJlbmNlJ1xuICAgICAgICAgICAgICAgICAgICAmJiBpc1NvbWV0aGluZyhyZWNvcmRbZi5uYW1lXSlcbiAgICAgICAgICAgICAgICAgICAgJiYgaXNOb25FbXB0eVN0cmluZyhyZWNvcmRbZi5uYW1lXS5rZXkpKSxcbiAgbWFwKGYgPT4gJChmLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzLCBbXG4gICAgbWFwKG4gPT4gKHtcbiAgICAgIHJlY29yZE5vZGU6IGdldE5vZGUoYXBwSGllcmFyY2h5LCBuKSxcbiAgICAgIGZpZWxkOiBmLFxuICAgIH0pKSxcbiAgXSkpLFxuICBmbGF0dGVuLFxuICBtYXAobiA9PiBtYWtlSW5kZXhOb2RlQW5kS2V5KFxuICAgIG4ucmVjb3JkTm9kZSxcbiAgICBqb2luS2V5KHJlY29yZFtuLmZpZWxkLm5hbWVdLmtleSwgbi5yZWNvcmROb2RlLm5hbWUpLFxuICApKSxcbl0pO1xuXG5jb25zdCBtYWtlSW5kZXhOb2RlQW5kS2V5ID0gKGluZGV4Tm9kZSwgaW5kZXhLZXkpID0+ICh7IGluZGV4Tm9kZSwgaW5kZXhLZXkgfSk7XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJlbGV2YW50QW5jZXN0b3JJbmRleGVzO1xuIiwiICAvLyBhZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2RleDRlci9qcy1wcm9taXNlLXdyaXRhYmxlXG4gIC8vIFRoYW5rIHlvdSA6KSBcbiAgZXhwb3J0IGNvbnN0IHByb21pc2VXcml0ZWFibGVTdHJlYW0gPSBzdHJlYW0gPT4ge1xuICBcbiAgICBsZXQgX2Vycm9yZWQ7XG4gIFxuICAgIGNvbnN0IF9lcnJvckhhbmRsZXIgPSBlcnIgPT4ge1xuICAgICAgICBfZXJyb3JlZCA9IGVycjtcbiAgICB9O1xuXG4gICAgc3RyZWFtLm9uKFwiZXJyb3JcIiwgX2Vycm9ySGFuZGxlcik7ICAgIFxuICBcbiAgICBjb25zdCB3cml0ZSA9IGNodW5rID0+IHsgIFxuICAgICAgbGV0IHJlamVjdGVkID0gZmFsc2U7XG4gIFxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKF9lcnJvcmVkKSB7XG4gICAgICAgICAgY29uc3QgZXJyID0gX2Vycm9yZWQ7XG4gICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBpZiAoIXN0cmVhbS53cml0YWJsZSB8fCBzdHJlYW0uY2xvc2VkIHx8IHN0cmVhbS5kZXN0cm95ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihcIndyaXRlIGFmdGVyIGVuZFwiKSk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IHdyaXRlRXJyb3JIYW5kbGVyID0gZXJyID0+IHtcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZWplY3RlZCA9IHRydWU7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIHN0cmVhbS5vbmNlKFwiZXJyb3JcIiwgd3JpdGVFcnJvckhhbmRsZXIpO1xuICBcbiAgICAgICAgY29uc3QgY2FuV3JpdGUgPSBzdHJlYW0ud3JpdGUoY2h1bmspO1xuICBcbiAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgd3JpdGVFcnJvckhhbmRsZXIpO1xuICBcbiAgICAgICAgaWYgKGNhbldyaXRlKSB7XG4gICAgICAgICAgaWYgKCFyZWplY3RlZCkge1xuICAgICAgICAgICAgcmVzb2x2ZShjaHVuay5sZW5ndGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBlcnJvckhhbmRsZXIgPSBlcnIgPT4ge1xuICAgICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgY29uc3QgZHJhaW5IYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICByZXNvbHZlKGNodW5rLmxlbmd0aCk7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICBjb25zdCBjbG9zZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHJlc29sdmUoY2h1bmsubGVuZ3RoKTtcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIGNvbnN0IGZpbmlzaEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHJlc29sdmUoY2h1bmsubGVuZ3RoKTtcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIGNvbnN0IHJlbW92ZUxpc3RlbmVycyA9ICgpID0+IHtcbiAgICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImNsb3NlXCIsIGNsb3NlSGFuZGxlcik7XG4gICAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJkcmFpblwiLCBkcmFpbkhhbmRsZXIpO1xuICAgICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImZpbmlzaFwiLCBmaW5pc2hIYW5kbGVyKTtcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIHN0cmVhbS5vbihcImNsb3NlXCIsIGNsb3NlSGFuZGxlcik7XG4gICAgICAgICAgc3RyZWFtLm9uKFwiZHJhaW5cIiwgZHJhaW5IYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5vbihcImZpbmlzaFwiLCBmaW5pc2hIYW5kbGVyKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIFxuICAgIGNvbnN0IGVuZCA9ICgpID0+IHtcbiAgXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoX2Vycm9yZWQpIHtcbiAgICAgICAgICBjb25zdCBlcnIgPSBfZXJyb3JlZDtcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGlmICghc3RyZWFtLndyaXRhYmxlIHx8IHN0cmVhbS5jbG9zZWQgfHwgc3RyZWFtLmRlc3Ryb3llZCkge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IGZpbmlzaEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCBlcnJvckhhbmRsZXIgPSAoZXJyKSA9PiB7XG4gICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IHJlbW92ZUxpc3RlbmVycyA9ICgpID0+IHtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImZpbmlzaFwiLCBmaW5pc2hIYW5kbGVyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgc3RyZWFtLm9uKFwiZmluaXNoXCIsIGZpbmlzaEhhbmRsZXIpO1xuICAgICAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xuICBcbiAgICAgICAgc3RyZWFtLmVuZCgpO1xuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4ge3dyaXRlLCBlbmR9O1xuICB9XG4gIFxuICBleHBvcnQgZGVmYXVsdCBwcm9taXNlV3JpdGVhYmxlU3RyZWFtXG4gICIsImltcG9ydCB7IGVuc3VyZVNoYXJkTmFtZUlzSW5TaGFyZE1hcCB9IGZyb20gJy4vc2hhcmRpbmcnO1xuaW1wb3J0IHsgZ2V0SW5kZXhXcml0ZXIgfSBmcm9tICcuL3NlcmlhbGl6ZXInO1xuaW1wb3J0IHsgaXNTaGFyZGVkSW5kZXggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHtwcm9taXNlV3JpdGVhYmxlU3RyZWFtfSBmcm9tIFwiLi9wcm9taXNlV3JpdGFibGVTdHJlYW1cIjtcbmltcG9ydCB7cHJvbWlzZVJlYWRhYmxlU3RyZWFtfSBmcm9tIFwiLi9wcm9taXNlUmVhZGFibGVTdHJlYW1cIjtcblxuZXhwb3J0IGNvbnN0IGFwcGx5VG9TaGFyZCA9IGFzeW5jIChoaWVyYXJjaHksIHN0b3JlLCBpbmRleEtleSxcbiAgaW5kZXhOb2RlLCBpbmRleFNoYXJkS2V5LCByZWNvcmRzVG9Xcml0ZSwga2V5c1RvUmVtb3ZlKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZUlmTm90RXhpc3RzID0gcmVjb3Jkc1RvV3JpdGUubGVuZ3RoID4gMDtcbiAgY29uc3Qgd3JpdGVyID0gYXdhaXQgZ2V0V3JpdGVyKGhpZXJhcmNoeSwgc3RvcmUsIGluZGV4S2V5LCBpbmRleFNoYXJkS2V5LCBpbmRleE5vZGUsIGNyZWF0ZUlmTm90RXhpc3RzKTtcbiAgaWYgKHdyaXRlciA9PT0gU0hBUkRfREVMRVRFRCkgcmV0dXJuO1xuXG4gIGF3YWl0IHdyaXRlci51cGRhdGVJbmRleChyZWNvcmRzVG9Xcml0ZSwga2V5c1RvUmVtb3ZlKTtcbiAgYXdhaXQgc3dhcFRlbXBGaWxlSW4oc3RvcmUsIGluZGV4U2hhcmRLZXkpO1xufTtcblxuY29uc3QgU0hBUkRfREVMRVRFRCA9ICdTSEFSRF9ERUxFVEVEJztcbmNvbnN0IGdldFdyaXRlciA9IGFzeW5jIChoaWVyYXJjaHksIHN0b3JlLCBpbmRleEtleSwgaW5kZXhlZERhdGFLZXksIGluZGV4Tm9kZSwgY3JlYXRlSWZOb3RFeGlzdHMpID0+IHtcbiAgbGV0IHJlYWRhYmxlU3RyZWFtID0gbnVsbDtcblxuICBpZiAoaXNTaGFyZGVkSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIGF3YWl0IGVuc3VyZVNoYXJkTmFtZUlzSW5TaGFyZE1hcChzdG9yZSwgaW5kZXhLZXksIGluZGV4ZWREYXRhS2V5KTtcbiAgICBpZighYXdhaXQgc3RvcmUuZXhpc3RzKGluZGV4ZWREYXRhS2V5KSkge1xuICAgICAgYXdhaXQgc3RvcmUuY3JlYXRlRmlsZShpbmRleGVkRGF0YUtleSwgXCJcIik7XG4gICAgfVxuICB9XG5cbiAgdHJ5IHtcblxuICAgIHJlYWRhYmxlU3RyZWFtID0gcHJvbWlzZVJlYWRhYmxlU3RyZWFtKFxuICAgICAgICBhd2FpdCBzdG9yZS5yZWFkYWJsZUZpbGVTdHJlYW0oaW5kZXhlZERhdGFLZXkpXG4gICAgKTtcblxuICB9IGNhdGNoIChlKSB7XG5cbiAgICBpZiAoYXdhaXQgc3RvcmUuZXhpc3RzKGluZGV4ZWREYXRhS2V5KSkge1xuICAgICAgdGhyb3cgZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNyZWF0ZUlmTm90RXhpc3RzKSB7IFxuICAgICAgICBhd2FpdCBzdG9yZS5jcmVhdGVGaWxlKGluZGV4ZWREYXRhS2V5LCAnJyk7IFxuICAgICAgfSBlbHNlIHsgXG4gICAgICAgIHJldHVybiBTSEFSRF9ERUxFVEVEOyBcbiAgICAgIH1cblxuICAgICAgcmVhZGFibGVTdHJlYW0gPSBwcm9taXNlUmVhZGFibGVTdHJlYW0oXG4gICAgICAgICAgYXdhaXQgc3RvcmUucmVhZGFibGVGaWxlU3RyZWFtKGluZGV4ZWREYXRhS2V5KVxuICAgICAgKTtcblxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHdyaXRhYmxlU3RyZWFtID0gcHJvbWlzZVdyaXRlYWJsZVN0cmVhbShcbiAgICAgIGF3YWl0IHN0b3JlLndyaXRhYmxlRmlsZVN0cmVhbShpbmRleGVkRGF0YUtleSArIFwiLnRlbXBcIilcbiAgKTtcblxuICByZXR1cm4gZ2V0SW5kZXhXcml0ZXIoXG4gICAgaGllcmFyY2h5LCBpbmRleE5vZGUsXG4gICAgICAgIHJlYWRhYmxlU3RyZWFtLCB3cml0YWJsZVN0cmVhbVxuICApO1xufTtcblxuY29uc3Qgc3dhcFRlbXBGaWxlSW4gPSBhc3luYyAoc3RvcmUsIGluZGV4ZWREYXRhS2V5LCBpc1JldHJ5ID0gZmFsc2UpID0+IHtcbiAgY29uc3QgdGVtcEZpbGUgPSBgJHtpbmRleGVkRGF0YUtleX0udGVtcGA7XG4gIHRyeSB7XG4gICAgYXdhaXQgc3RvcmUuZGVsZXRlRmlsZShpbmRleGVkRGF0YUtleSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBpZ25vcmUgZmFpbHVyZSwgaW5jYXNlIGl0IGhhcyBub3QgYmVlbiBjcmVhdGVkIHlldFxuICB9XG4gIHRyeSB7XG4gICAgYXdhaXQgc3RvcmUucmVuYW1lRmlsZSh0ZW1wRmlsZSwgaW5kZXhlZERhdGFLZXkpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gcmV0cnlpbmcgaW4gY2FzZSBkZWxldGUgZmFpbHVyZSB3YXMgZm9yIHNvbWUgb3RoZXIgcmVhc29uXG4gICAgaWYgKCFpc1JldHJ5KSB7XG4gICAgICBhd2FpdCBzd2FwVGVtcEZpbGVJbihzdG9yZSwgaW5kZXhlZERhdGFLZXksIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gc3dhcCBpbiBpbmRleCBmaWxlZDogXCIgKyBlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIGZpbHRlciwgbWFwLCBpc1VuZGVmaW5lZCwgaW5jbHVkZXMsXG4gIGZsYXR0ZW4sIGludGVyc2VjdGlvbkJ5LFxuICBpc0VxdWFsLCBwdWxsLCBrZXlzLFxuICBkaWZmZXJlbmNlQnksIGRpZmZlcmVuY2UsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyB1bmlvbiB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcyxcbiAgZ2V0UmVsZXZhbnRSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyxcbn0gZnJvbSAnLi4vaW5kZXhpbmcvcmVsZXZhbnQnO1xuaW1wb3J0IHsgZXZhbHVhdGUgfSBmcm9tICcuLi9pbmRleGluZy9ldmFsdWF0ZSc7XG5pbXBvcnQge1xuICAkLCBpc1NvbWV0aGluZyxcbiAgaXNOb25FbXB0eUFycmF5LCBqb2luS2V5LFxuICBpc05vbkVtcHR5U3RyaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0SW5kZXhlZERhdGFLZXkgfSBmcm9tICcuLi9pbmRleGluZy9zaGFyZGluZyc7XG5pbXBvcnQge1xuICBpc1VwZGF0ZSwgaXNDcmVhdGUsXG4gIGlzRGVsZXRlLCBpc0J1aWxkSW5kZXgsXG59IGZyb20gJy4vdHJhbnNhY3Rpb25zQ29tbW9uJztcbmltcG9ydCB7IGFwcGx5VG9TaGFyZCB9IGZyb20gJy4uL2luZGV4aW5nL2FwcGx5JztcbmltcG9ydCB7XG4gIGdldEFjdHVhbEtleU9mUGFyZW50LFxuICBpc0dsb2JhbEluZGV4LCBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleCwgaXNSZWZlcmVuY2VJbmRleCxcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcblxuZXhwb3J0IGNvbnN0IGV4ZWN1dGVUcmFuc2FjdGlvbnMgPSBhcHAgPT4gYXN5bmMgKHRyYW5zYWN0aW9ucykgPT4ge1xuICBjb25zdCByZWNvcmRzQnlTaGFyZCA9IG1hcHBlZFJlY29yZHNCeUluZGV4U2hhcmQoYXBwLmhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKTtcblxuICBmb3IgKGNvbnN0IHNoYXJkIG9mIGtleXMocmVjb3Jkc0J5U2hhcmQpKSB7XG4gICAgYXdhaXQgYXBwbHlUb1NoYXJkKFxuICAgICAgYXBwLmhpZXJhcmNoeSwgYXBwLmRhdGFzdG9yZSxcbiAgICAgIHJlY29yZHNCeVNoYXJkW3NoYXJkXS5pbmRleEtleSxcbiAgICAgIHJlY29yZHNCeVNoYXJkW3NoYXJkXS5pbmRleE5vZGUsXG4gICAgICBzaGFyZCxcbiAgICAgIHJlY29yZHNCeVNoYXJkW3NoYXJkXS53cml0ZXMsXG4gICAgICByZWNvcmRzQnlTaGFyZFtzaGFyZF0ucmVtb3ZlcyxcbiAgICApO1xuICB9XG59O1xuXG5jb25zdCBtYXBwZWRSZWNvcmRzQnlJbmRleFNoYXJkID0gKGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKSA9PiB7XG4gIGNvbnN0IHVwZGF0ZXMgPSBnZXRVcGRhdGVUcmFuc2FjdGlvbnNCeVNoYXJkKFxuICAgIGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zLFxuICApO1xuXG4gIGNvbnN0IGNyZWF0ZWQgPSBnZXRDcmVhdGVUcmFuc2FjdGlvbnNCeVNoYXJkKFxuICAgIGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zLFxuICApO1xuICBjb25zdCBkZWxldGVzID0gZ2V0RGVsZXRlVHJhbnNhY3Rpb25zQnlTaGFyZChcbiAgICBoaWVyYXJjaHksIHRyYW5zYWN0aW9ucyxcbiAgKTtcblxuICBjb25zdCBpbmRleEJ1aWxkID0gZ2V0QnVpbGRJbmRleFRyYW5zYWN0aW9uc0J5U2hhcmQoXG4gICAgaGllcmFyY2h5LFxuICAgIHRyYW5zYWN0aW9ucyxcbiAgKTtcblxuICBjb25zdCB0b1JlbW92ZSA9IFtcbiAgICAuLi5kZWxldGVzLFxuICAgIC4uLnVwZGF0ZXMudG9SZW1vdmUsXG4gIF07XG5cbiAgY29uc3QgdG9Xcml0ZSA9IFtcbiAgICAuLi5jcmVhdGVkLFxuICAgIC4uLnVwZGF0ZXMudG9Xcml0ZSxcbiAgICAuLi5pbmRleEJ1aWxkLFxuICBdO1xuXG4gIGNvbnN0IHRyYW5zQnlTaGFyZCA9IHt9O1xuXG4gIGNvbnN0IGluaXRpYWxpc2VTaGFyZCA9ICh0KSA9PiB7XG4gICAgaWYgKGlzVW5kZWZpbmVkKHRyYW5zQnlTaGFyZFt0LmluZGV4U2hhcmRLZXldKSkge1xuICAgICAgdHJhbnNCeVNoYXJkW3QuaW5kZXhTaGFyZEtleV0gPSB7XG4gICAgICAgIHdyaXRlczogW10sXG4gICAgICAgIHJlbW92ZXM6IFtdLFxuICAgICAgICBpbmRleEtleTogdC5pbmRleEtleSxcbiAgICAgICAgaW5kZXhOb2RlS2V5OiB0LmluZGV4Tm9kZUtleSxcbiAgICAgICAgaW5kZXhOb2RlOiB0LmluZGV4Tm9kZSxcbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG4gIGZvciAoY29uc3QgdHJhbnMgb2YgdG9Xcml0ZSkge1xuICAgIGluaXRpYWxpc2VTaGFyZCh0cmFucyk7XG4gICAgdHJhbnNCeVNoYXJkW3RyYW5zLmluZGV4U2hhcmRLZXldLndyaXRlcy5wdXNoKFxuICAgICAgdHJhbnMubWFwcGVkUmVjb3JkLnJlc3VsdCxcbiAgICApO1xuICB9XG5cbiAgZm9yIChjb25zdCB0cmFucyBvZiB0b1JlbW92ZSkge1xuICAgIGluaXRpYWxpc2VTaGFyZCh0cmFucyk7XG4gICAgdHJhbnNCeVNoYXJkW3RyYW5zLmluZGV4U2hhcmRLZXldLnJlbW92ZXMucHVzaChcbiAgICAgIHRyYW5zLm1hcHBlZFJlY29yZC5yZXN1bHQua2V5LFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gdHJhbnNCeVNoYXJkO1xufTtcblxuY29uc3QgZ2V0VXBkYXRlVHJhbnNhY3Rpb25zQnlTaGFyZCA9IChoaWVyYXJjaHksIHRyYW5zYWN0aW9ucykgPT4ge1xuICBjb25zdCB1cGRhdGVUcmFuc2FjdGlvbnMgPSAkKHRyYW5zYWN0aW9ucywgW2ZpbHRlcihpc1VwZGF0ZSldKTtcblxuICBjb25zdCBldmFsdWF0ZUluZGV4ID0gKHJlY29yZCwgaW5kZXhOb2RlQW5kUGF0aCkgPT4ge1xuICAgIGNvbnN0IG1hcHBlZFJlY29yZCA9IGV2YWx1YXRlKHJlY29yZCkoaW5kZXhOb2RlQW5kUGF0aC5pbmRleE5vZGUpO1xuICAgIHJldHVybiAoe1xuICAgICAgbWFwcGVkUmVjb3JkLFxuICAgICAgaW5kZXhOb2RlOiBpbmRleE5vZGVBbmRQYXRoLmluZGV4Tm9kZSxcbiAgICAgIGluZGV4S2V5OiBpbmRleE5vZGVBbmRQYXRoLmluZGV4S2V5LFxuICAgICAgaW5kZXhTaGFyZEtleTogZ2V0SW5kZXhlZERhdGFLZXkoXG4gICAgICAgIGluZGV4Tm9kZUFuZFBhdGguaW5kZXhOb2RlLFxuICAgICAgICBpbmRleE5vZGVBbmRQYXRoLmluZGV4S2V5LFxuICAgICAgICBtYXBwZWRSZWNvcmQucmVzdWx0LFxuICAgICAgKSxcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBnZXRJbmRleE5vZGVzVG9BcHBseSA9IGluZGV4RmlsdGVyID0+ICh0LCBpbmRleGVzKSA9PiAkKGluZGV4ZXMsIFtcbiAgICBtYXAobiA9PiAoe1xuICAgICAgb2xkOiBldmFsdWF0ZUluZGV4KHQub2xkUmVjb3JkLCBuKSxcbiAgICAgIG5ldzogZXZhbHVhdGVJbmRleCh0LnJlY29yZCwgbiksXG4gICAgfSkpLFxuICAgIGZpbHRlcihpbmRleEZpbHRlciksXG4gIF0pO1xuXG4gIGNvbnN0IHRvUmVtb3ZlRmlsdGVyID0gKG4sIGlzVW5yZWZlcmVuY2VkKSA9PiBuLm9sZC5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSB0cnVlXG4gICAgICAgICYmIChuLm5ldy5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSBmYWxzZVxuICAgICAgICAgICAgfHwgaXNVbnJlZmVyZW5jZWQpO1xuXG4gIGNvbnN0IHRvQWRkRmlsdGVyID0gKG4sIGlzTmV3bHlSZWZlcmVuY2VkKSA9PiAobi5vbGQubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gZmFsc2VcbiAgICAgICAgfHwgaXNOZXdseVJlZmVyZW5jZWQpXG4gICAgICAgICYmIG4ubmV3Lm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IHRydWU7XG5cbiAgY29uc3QgdG9VcGRhdGVGaWx0ZXIgPSBuID0+IG4ubmV3Lm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IHRydWVcbiAgICAgICAgJiYgbi5vbGQubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gdHJ1ZVxuICAgICAgICAmJiAhaXNFcXVhbChuLm9sZC5tYXBwZWRSZWNvcmQucmVzdWx0LFxuICAgICAgICAgIG4ubmV3Lm1hcHBlZFJlY29yZC5yZXN1bHQpO1xuXG4gIGNvbnN0IHRvUmVtb3ZlID0gW107XG4gIGNvbnN0IHRvV3JpdGUgPSBbXTtcblxuICBmb3IgKGNvbnN0IHQgb2YgdXBkYXRlVHJhbnNhY3Rpb25zKSB7XG4gICAgY29uc3QgYW5jZXN0b3JJZHhzID0gZ2V0UmVsZXZhbnRBbmNlc3RvckluZGV4ZXMoXG4gICAgICBoaWVyYXJjaHksIHQucmVjb3JkLFxuICAgICk7XG5cbiAgICBjb25zdCByZWZlcmVuY2VDaGFuZ2VzID0gZGlmZlJldmVyc2VSZWZGb3JVcGRhdGUoXG4gICAgICBoaWVyYXJjaHksIHQub2xkUmVjb3JkLCB0LnJlY29yZCxcbiAgICApO1xuXG4gICAgLy8gb2xkIHJlY29yZHMgdG8gcmVtb3ZlIChmaWx0ZXJlZCBvdXQpXG4gICAgY29uc3QgZmlsdGVyZWRPdXRfdG9SZW1vdmUgPSB1bmlvbihcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvUmVtb3ZlRmlsdGVyKSh0LCBhbmNlc3RvcklkeHMpLFxuICAgICAgLy8gc3RpbGwgcmVmZXJlbmNlZCAtIGNoZWNrIGZpbHRlclxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodG9SZW1vdmVGaWx0ZXIpKHQsIHJlZmVyZW5jZUNoYW5nZXMubm90Q2hhbmdlZCksXG4gICAgICAvLyB1biByZWZlcmVuY2VkIC0gcmVtb3ZlIGlmIGluIHRoZXJlIGFscmVhZHlcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KG4gPT4gdG9SZW1vdmVGaWx0ZXIobiwgdHJ1ZSkpKHQsIHJlZmVyZW5jZUNoYW5nZXMudW5SZWZlcmVuY2VkKSxcbiAgICApO1xuXG4gICAgLy8gbmV3IHJlY29yZHMgdG8gYWRkIChmaWx0ZXJlZCBpbilcbiAgICBjb25zdCBmaWx0ZXJlZEluX3RvQWRkID0gdW5pb24oXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b0FkZEZpbHRlcikodCwgYW5jZXN0b3JJZHhzKSxcbiAgICAgIC8vIG5ld2x5IHJlZmVyZW5jZWQgLSBjaGVjayBmaWx0ZXJcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KG4gPT4gdG9BZGRGaWx0ZXIobiwgdHJ1ZSkpKHQsIHJlZmVyZW5jZUNoYW5nZXMubmV3bHlSZWZlcmVuY2VkKSxcbiAgICAgIC8vIHJlZmVyZW5jZSB1bmNoYW5nZWQgLSByZXJ1biBmaWx0ZXIgaW4gY2FzZSBzb21ldGhpbmcgZWxzZSBjaGFuZ2VkXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b0FkZEZpbHRlcikodCwgcmVmZXJlbmNlQ2hhbmdlcy5ub3RDaGFuZ2VkKSxcbiAgICApO1xuXG4gICAgY29uc3QgY2hhbmdlZCA9IHVuaW9uKFxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodG9VcGRhdGVGaWx0ZXIpKHQsIGFuY2VzdG9ySWR4cyksXG4gICAgICAvLyBzdGlsbCByZWZlcmVuY2VkIC0gcmVjaGVjayBmaWx0ZXJcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvVXBkYXRlRmlsdGVyKSh0LCByZWZlcmVuY2VDaGFuZ2VzLm5vdENoYW5nZWQpLFxuICAgICk7XG5cbiAgICBjb25zdCBzaGFyZEtleUNoYW5nZWQgPSAkKGNoYW5nZWQsIFtcbiAgICAgIGZpbHRlcihjID0+IGMub2xkLmluZGV4U2hhcmRLZXkgIT09IGMubmV3LmluZGV4U2hhcmRLZXkpLFxuICAgIF0pO1xuXG4gICAgY29uc3QgY2hhbmdlZEluU2FtZVNoYXJkID0gJChzaGFyZEtleUNoYW5nZWQsIFtcbiAgICAgIGRpZmZlcmVuY2UoY2hhbmdlZCksXG4gICAgXSk7XG5cbiAgICBmb3IgKGNvbnN0IHJlcyBvZiBzaGFyZEtleUNoYW5nZWQpIHtcbiAgICAgIHB1bGwocmVzKShjaGFuZ2VkKTtcbiAgICAgIGZpbHRlcmVkT3V0X3RvUmVtb3ZlLnB1c2gocmVzKTtcbiAgICAgIGZpbHRlcmVkSW5fdG9BZGQucHVzaChyZXMpO1xuICAgIH1cblxuICAgIHRvUmVtb3ZlLnB1c2goXG4gICAgICAkKGZpbHRlcmVkT3V0X3RvUmVtb3ZlLCBbXG4gICAgICAgIG1hcChpID0+IGkub2xkKSxcbiAgICAgIF0pLFxuICAgICk7XG5cbiAgICB0b1dyaXRlLnB1c2goXG4gICAgICAkKGZpbHRlcmVkSW5fdG9BZGQsIFtcbiAgICAgICAgbWFwKGkgPT4gaS5uZXcpLFxuICAgICAgXSksXG4gICAgKTtcblxuICAgIHRvV3JpdGUucHVzaChcbiAgICAgICQoY2hhbmdlZEluU2FtZVNoYXJkLCBbXG4gICAgICAgIG1hcChpID0+IGkubmV3KSxcbiAgICAgIF0pLFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gKHtcbiAgICB0b1JlbW92ZTogZmxhdHRlbih0b1JlbW92ZSksXG4gICAgdG9Xcml0ZTogZmxhdHRlbih0b1dyaXRlKSxcbiAgfSk7XG59O1xuXG5jb25zdCBnZXRCdWlsZEluZGV4VHJhbnNhY3Rpb25zQnlTaGFyZCA9IChoaWVyYXJjaHksIHRyYW5zYWN0aW9ucykgPT4ge1xuICBjb25zdCBidWlsZFRyYW5zYWN0aW9ucyA9ICQodHJhbnNhY3Rpb25zLCBbZmlsdGVyKGlzQnVpbGRJbmRleCldKTtcbiAgaWYgKCFpc05vbkVtcHR5QXJyYXkoYnVpbGRUcmFuc2FjdGlvbnMpKSByZXR1cm4gW107XG4gIGNvbnN0IGluZGV4Tm9kZSA9IHRyYW5zYWN0aW9ucy5pbmRleE5vZGU7XG5cbiAgY29uc3QgZ2V0SW5kZXhLZXlzID0gKHQpID0+IHtcbiAgICBpZiAoaXNHbG9iYWxJbmRleChpbmRleE5vZGUpKSB7XG4gICAgICByZXR1cm4gW2luZGV4Tm9kZS5ub2RlS2V5KCldO1xuICAgIH1cblxuICAgIGlmIChpc1JlZmVyZW5jZUluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICAgIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGhpZXJhcmNoeSkodC5yZWNvcmQua2V5KTtcbiAgICAgIGNvbnN0IHJlZkZpZWxkcyA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICAgICAgZmlsdGVyKGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4KGluZGV4Tm9kZSkpLFxuICAgICAgXSk7XG4gICAgICBjb25zdCBpbmRleEtleXMgPSBbXTtcbiAgICAgIGZvciAoY29uc3QgcmVmRmllbGQgb2YgcmVmRmllbGRzKSB7XG4gICAgICAgIGNvbnN0IHJlZlZhbHVlID0gdC5yZWNvcmRbcmVmRmllbGQubmFtZV07XG4gICAgICAgIGlmIChpc1NvbWV0aGluZyhyZWZWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAmJiBpc05vbkVtcHR5U3RyaW5nKHJlZlZhbHVlLmtleSkpIHtcbiAgICAgICAgICBjb25zdCBpbmRleEtleSA9IGpvaW5LZXkoXG4gICAgICAgICAgICByZWZWYWx1ZS5rZXksXG4gICAgICAgICAgICBpbmRleE5vZGUubmFtZSxcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaWYgKCFpbmNsdWRlcyhpbmRleEtleSkoaW5kZXhLZXlzKSkgeyBpbmRleEtleXMucHVzaChpbmRleEtleSk7IH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGluZGV4S2V5cztcbiAgICB9XG5cbiAgICByZXR1cm4gW2pvaW5LZXkoXG4gICAgICBnZXRBY3R1YWxLZXlPZlBhcmVudChcbiAgICAgICAgaW5kZXhOb2RlLnBhcmVudCgpLm5vZGVLZXkoKSxcbiAgICAgICAgdC5yZWNvcmQua2V5LFxuICAgICAgKSxcbiAgICAgIGluZGV4Tm9kZS5uYW1lLFxuICAgICldO1xuICB9O1xuXG4gIHJldHVybiAkKGJ1aWxkVHJhbnNhY3Rpb25zLCBbXG4gICAgbWFwKCh0KSA9PiB7XG4gICAgICBjb25zdCBtYXBwZWRSZWNvcmQgPSBldmFsdWF0ZSh0LnJlY29yZCkoaW5kZXhOb2RlKTtcbiAgICAgIGlmICghbWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlcikgcmV0dXJuIG51bGw7XG4gICAgICBjb25zdCBpbmRleEtleXMgPSBnZXRJbmRleEtleXModCk7XG4gICAgICByZXR1cm4gJChpbmRleEtleXMsIFtcbiAgICAgICAgbWFwKGluZGV4S2V5ID0+ICh7XG4gICAgICAgICAgbWFwcGVkUmVjb3JkLFxuICAgICAgICAgIGluZGV4Tm9kZSxcbiAgICAgICAgICBpbmRleEtleSxcbiAgICAgICAgICBpbmRleFNoYXJkS2V5OiBnZXRJbmRleGVkRGF0YUtleShcbiAgICAgICAgICAgIGluZGV4Tm9kZSxcbiAgICAgICAgICAgIGluZGV4S2V5LFxuICAgICAgICAgICAgbWFwcGVkUmVjb3JkLnJlc3VsdCxcbiAgICAgICAgICApLFxuICAgICAgICB9KSksXG4gICAgICBdKTtcbiAgICB9KSxcbiAgICBmbGF0dGVuLFxuICAgIGZpbHRlcihpc1NvbWV0aGluZyksXG4gIF0pO1xufTtcblxuY29uc3QgZ2V0X0NyZWF0ZV9EZWxldGVfVHJhbnNhY3Rpb25zQnlTaGFyZCA9IHByZWQgPT4gKGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZVRyYW5zYWN0aW9ucyA9ICQodHJhbnNhY3Rpb25zLCBbZmlsdGVyKHByZWQpXSk7XG5cbiAgY29uc3QgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkgPSAodCwgaW5kZXhlcykgPT4gJChpbmRleGVzLCBbXG4gICAgbWFwKChuKSA9PiB7XG4gICAgICBjb25zdCBtYXBwZWRSZWNvcmQgPSBldmFsdWF0ZSh0LnJlY29yZCkobi5pbmRleE5vZGUpO1xuICAgICAgcmV0dXJuICh7XG4gICAgICAgIG1hcHBlZFJlY29yZCxcbiAgICAgICAgaW5kZXhOb2RlOiBuLmluZGV4Tm9kZSxcbiAgICAgICAgaW5kZXhLZXk6IG4uaW5kZXhLZXksXG4gICAgICAgIGluZGV4U2hhcmRLZXk6IGdldEluZGV4ZWREYXRhS2V5KFxuICAgICAgICAgIG4uaW5kZXhOb2RlLFxuICAgICAgICAgIG4uaW5kZXhLZXksXG4gICAgICAgICAgbWFwcGVkUmVjb3JkLnJlc3VsdCxcbiAgICAgICAgKSxcbiAgICAgIH0pO1xuICAgIH0pLFxuICAgIGZpbHRlcihuID0+IG4ubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciksXG4gIF0pO1xuXG4gIGNvbnN0IGFsbFRvQXBwbHkgPSBbXTtcblxuICBmb3IgKGNvbnN0IHQgb2YgY3JlYXRlVHJhbnNhY3Rpb25zKSB7XG4gICAgY29uc3QgYW5jZXN0b3JJZHhzID0gZ2V0UmVsZXZhbnRBbmNlc3RvckluZGV4ZXMoaGllcmFyY2h5LCB0LnJlY29yZCk7XG4gICAgY29uc3QgcmV2ZXJzZVJlZiA9IGdldFJlbGV2YW50UmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMoaGllcmFyY2h5LCB0LnJlY29yZCk7XG5cbiAgICBhbGxUb0FwcGx5LnB1c2goXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0LCBhbmNlc3RvcklkeHMpLFxuICAgICk7XG4gICAgYWxsVG9BcHBseS5wdXNoKFxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodCwgcmV2ZXJzZVJlZiksXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBmbGF0dGVuKGFsbFRvQXBwbHkpO1xufTtcblxuY29uc3QgZ2V0RGVsZXRlVHJhbnNhY3Rpb25zQnlTaGFyZCA9IGdldF9DcmVhdGVfRGVsZXRlX1RyYW5zYWN0aW9uc0J5U2hhcmQoaXNEZWxldGUpO1xuXG5jb25zdCBnZXRDcmVhdGVUcmFuc2FjdGlvbnNCeVNoYXJkID0gZ2V0X0NyZWF0ZV9EZWxldGVfVHJhbnNhY3Rpb25zQnlTaGFyZChpc0NyZWF0ZSk7XG5cbmNvbnN0IGRpZmZSZXZlcnNlUmVmRm9yVXBkYXRlID0gKGFwcEhpZXJhcmNoeSwgb2xkUmVjb3JkLCBuZXdSZWNvcmQpID0+IHtcbiAgY29uc3Qgb2xkSW5kZXhlcyA9IGdldFJlbGV2YW50UmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMoXG4gICAgYXBwSGllcmFyY2h5LCBvbGRSZWNvcmQsXG4gICk7XG4gIGNvbnN0IG5ld0luZGV4ZXMgPSBnZXRSZWxldmFudFJldmVyc2VSZWZlcmVuY2VJbmRleGVzKFxuICAgIGFwcEhpZXJhcmNoeSwgbmV3UmVjb3JkLFxuICApO1xuXG4gIGNvbnN0IHVuUmVmZXJlbmNlZCA9IGRpZmZlcmVuY2VCeShcbiAgICBpID0+IGkuaW5kZXhLZXksXG4gICAgb2xkSW5kZXhlcywgbmV3SW5kZXhlcyxcbiAgKTtcblxuICBjb25zdCBuZXdseVJlZmVyZW5jZWQgPSBkaWZmZXJlbmNlQnkoXG4gICAgaSA9PiBpLmluZGV4S2V5LFxuICAgIG5ld0luZGV4ZXMsIG9sZEluZGV4ZXMsXG4gICk7XG5cbiAgY29uc3Qgbm90Q2hhbmdlZCA9IGludGVyc2VjdGlvbkJ5KFxuICAgIGkgPT4gaS5pbmRleEtleSxcbiAgICBuZXdJbmRleGVzLCBvbGRJbmRleGVzLFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgdW5SZWZlcmVuY2VkLFxuICAgIG5ld2x5UmVmZXJlbmNlZCxcbiAgICBub3RDaGFuZ2VkLFxuICB9O1xufTtcbiIsImltcG9ydCB7IG1hcCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyByZXRyaWV2ZSB9IGZyb20gJy4vcmV0cmlldmUnO1xuaW1wb3J0IHsgZXhlY3V0ZVRyYW5zYWN0aW9ucyB9IGZyb20gJy4vZXhlY3V0ZSc7XG5pbXBvcnQge1xuICAkLCBqb2luS2V5LCBnZXRMb2NrLCBpc05vbG9jaywgcmVsZWFzZUxvY2ssXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBMT0NLX0ZJTEVfS0VZLCBUUkFOU0FDVElPTlNfRk9MREVSLFxuICB0aW1lb3V0TWlsbGlzZWNvbmRzLCBnZXRUcmFuc2FjdGlvbklkLFxuICBtYXhMb2NrUmV0cmllcyxcbn0gZnJvbSAnLi90cmFuc2FjdGlvbnNDb21tb24nO1xuXG5leHBvcnQgY29uc3QgY2xlYW51cCA9IGFzeW5jIChhcHApID0+IHtcbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldFRyYW5zYWN0aW9uTG9jayhhcHApO1xuICBpZiAoaXNOb2xvY2sobG9jaykpIHJldHVybjtcblxuICB0cnkge1xuICAgIGNvbnN0IHRyYW5zYWN0aW9ucyA9IGF3YWl0IHJldHJpZXZlKGFwcCk7XG4gICAgaWYgKHRyYW5zYWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBleGVjdXRlVHJhbnNhY3Rpb25zKGFwcCkodHJhbnNhY3Rpb25zKTtcblxuICAgICAgY29uc3QgZm9sZGVyID0gdHJhbnNhY3Rpb25zLmZvbGRlcktleVxuICAgICAgICA/IHRyYW5zYWN0aW9ucy5mb2xkZXJLZXlcbiAgICAgICAgOiBUUkFOU0FDVElPTlNfRk9MREVSO1xuXG4gICAgICBjb25zdCBkZWxldGVGaWxlcyA9ICQodHJhbnNhY3Rpb25zLCBbXG4gICAgICAgIG1hcCh0ID0+IGpvaW5LZXkoXG4gICAgICAgICAgZm9sZGVyLFxuICAgICAgICAgIGdldFRyYW5zYWN0aW9uSWQoXG4gICAgICAgICAgICB0LnJlY29yZElkLCB0LnRyYW5zYWN0aW9uVHlwZSxcbiAgICAgICAgICAgIHQudW5pcXVlSWQsXG4gICAgICAgICAgKSxcbiAgICAgICAgKSksXG4gICAgICAgIG1hcChhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUpLFxuICAgICAgXSk7XG5cbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKGRlbGV0ZUZpbGVzKTtcbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcbiAgfVxufTtcblxuY29uc3QgZ2V0VHJhbnNhY3Rpb25Mb2NrID0gYXN5bmMgYXBwID0+IGF3YWl0IGdldExvY2soXG4gIGFwcCwgTE9DS19GSUxFX0tFWSxcbiAgdGltZW91dE1pbGxpc2Vjb25kcywgbWF4TG9ja1JldHJpZXMsXG4pO1xuIiwiaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGNvbmZpZ0ZvbGRlciwgYXBwRGVmaW5pdGlvbkZpbGUsICQgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgVFJBTlNBQ1RJT05TX0ZPTERFUiB9IGZyb20gJy4uL3RyYW5zYWN0aW9ucy90cmFuc2FjdGlvbnNDb21tb24nO1xuaW1wb3J0IHsgQVVUSF9GT0xERVIsIFVTRVJTX0xJU1RfRklMRSwgQUNDRVNTX0xFVkVMU19GSUxFIH0gZnJvbSAnLi4vYXV0aEFwaS9hdXRoQ29tbW9uJztcbmltcG9ydCB7IGluaXRpYWxpc2VSb290Q29sbGVjdGlvbnMgfSBmcm9tICcuLi9jb2xsZWN0aW9uQXBpL2luaXRpYWxpc2UnO1xuaW1wb3J0IHsgaW5pdGlhbGlzZUluZGV4IH0gZnJvbSAnLi4vaW5kZXhpbmcvaW5pdGlhbGlzZUluZGV4JztcbmltcG9ydCB7IGdldEZsYXR0ZW5lZEhpZXJhcmNoeSwgaXNHbG9iYWxJbmRleCwgaXNTaW5nbGVSZWNvcmQgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgX3NhdmUgfSBmcm9tICcuLi9yZWNvcmRBcGkvc2F2ZSc7XG5pbXBvcnQgeyBnZXROZXcgfSBmcm9tICcuLi9yZWNvcmRBcGkvZ2V0TmV3JztcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxpc2VEYXRhID0gYXN5bmMgKGRhdGFzdG9yZSwgYXBwbGljYXRpb25EZWZpbml0aW9uLCBhY2Nlc3NMZXZlbHMpID0+IHtcbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihjb25maWdGb2xkZXIpO1xuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlSnNvbihhcHBEZWZpbml0aW9uRmlsZSwgYXBwbGljYXRpb25EZWZpbml0aW9uKTtcblxuICBhd2FpdCBpbml0aWFsaXNlUm9vdENvbGxlY3Rpb25zKGRhdGFzdG9yZSwgYXBwbGljYXRpb25EZWZpbml0aW9uLmhpZXJhcmNoeSk7XG4gIGF3YWl0IGluaXRpYWxpc2VSb290SW5kZXhlcyhkYXRhc3RvcmUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbi5oaWVyYXJjaHkpO1xuXG4gIGF3YWl0IGluaXRpYWxpc2VSb290U2luZ2xlUmVjb3JkcyhkYXRhc3RvcmUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbi5oaWVyYXJjaHkpO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoVFJBTlNBQ1RJT05TX0ZPTERFUik7XG5cbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihBVVRIX0ZPTERFUik7XG5cbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oVVNFUlNfTElTVF9GSUxFLCBbXSk7XG5cbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oXG4gICAgQUNDRVNTX0xFVkVMU19GSUxFLCBcbiAgICBhY2Nlc3NMZXZlbHMgPyBhY2Nlc3NMZXZlbHMgOiB7IHZlcnNpb246IDAsIGxldmVsczogW10gfSk7XG59O1xuXG5jb25zdCBpbml0aWFsaXNlUm9vdEluZGV4ZXMgPSBhc3luYyAoZGF0YXN0b3JlLCBoaWVyYXJjaHkpID0+IHtcbiAgY29uc3QgZmxhdGhpZXJhcmNoeSA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShoaWVyYXJjaHkpO1xuICBjb25zdCBnbG9iYWxJbmRleGVzID0gJChmbGF0aGllcmFyY2h5LCBbXG4gICAgZmlsdGVyKGlzR2xvYmFsSW5kZXgpLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IGluZGV4IG9mIGdsb2JhbEluZGV4ZXMpIHtcbiAgICBpZiAoIWF3YWl0IGRhdGFzdG9yZS5leGlzdHMoaW5kZXgubm9kZUtleSgpKSkgeyBhd2FpdCBpbml0aWFsaXNlSW5kZXgoZGF0YXN0b3JlLCAnJywgaW5kZXgpOyB9XG4gIH1cbn07XG5cbmNvbnN0IGluaXRpYWxpc2VSb290U2luZ2xlUmVjb3JkcyA9IGFzeW5jIChkYXRhc3RvcmUsIGhpZXJhY2h5KSA9PiB7XG4gIGNvbnN0IGZsYXRoaWVyYXJjaHkgPSBnZXRGbGF0dGVuZWRIaWVyYXJjaHkoaGllcmFjaHkpO1xuICBjb25zdCBzaW5nbGVSZWNvcmRzID0gJChmbGF0aGllcmFyY2h5LCBbXG4gICAgZmlsdGVyKGlzU2luZ2xlUmVjb3JkKSxcbiAgXSk7XG5cbiAgLyogZm9yIChsZXQgcmVjb3JkIG9mIHNpbmdsZVJlY29yZHMpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0TmV3KHsgZGF0YXN0b3JlOiBkYXRhc3RvcmUsIGhpZXJhcmNoeTogYXBwRGVmaW5pdGlvbi5oaWVyYXJjaHkgfSlcbiAgICAgICAgICAgIChyZWNvcmQubm9kZUtleSgpLFxuICAgICAgICAgICAgICAgIHJlY29yZC5uYW1lXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIF9zYXZlKHsgZGF0YXN0b3JlOiBkYXRhc3RvcmUsIGhpZXJhcmNoeTogYXBwRGVmaW5pdGlvbi5oaWVyYXJjaHkgfSxcbiAgICAgICAgICAgIHJlc3VsdFxuICAgICAgICApO1xuICAgIH0gKi9cbn07XG4iLCJpbXBvcnQgeyBpc05vdGhpbmcgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZ2V0RGF0YWJhc2VNYW5hZ2VyID0gZGF0YWJhc2VNYW5hZ2VyID0+ICh7XG4gIGNyZWF0ZUVtcHR5TWFzdGVyRGI6IGNyZWF0ZUVtcHR5TWFzdGVyRGIoZGF0YWJhc2VNYW5hZ2VyKSxcbiAgY3JlYXRlRW1wdHlJbnN0YW5jZURiOiBjcmVhdGVFbXB0eUluc3RhbmNlRGIoZGF0YWJhc2VNYW5hZ2VyKSxcbiAgZ2V0SW5zdGFuY2VEYlJvb3RDb25maWc6IGRhdGFiYXNlTWFuYWdlci5nZXRJbnN0YW5jZURiUm9vdENvbmZpZyxcbiAgbWFzdGVyRGF0YXN0b3JlQ29uZmlnOiBnZXRNYXN0ZXJEYXRhc3RvcmVDb25maWcoZGF0YWJhc2VNYW5hZ2VyKSxcbiAgZ2V0SW5zdGFuY2VEYXRhc3RvcmVDb25maWc6IGdldEluc3RhbmNlRGF0YXN0b3JlQ29uZmlnKGRhdGFiYXNlTWFuYWdlciksXG59KTtcblxuY29uc3QgZ2V0TWFzdGVyRGF0YXN0b3JlQ29uZmlnID0gZGF0YWJhc2VNYW5hZ2VyID0+IGRhdGFiYXNlTWFuYWdlci5nZXREYXRhc3RvcmVDb25maWcoJ21hc3RlcicpO1xuXG5jb25zdCBnZXRJbnN0YW5jZURhdGFzdG9yZUNvbmZpZyA9IGRhdGFiYXNlTWFuYWdlciA9PiAoYXBwbGljYXRpb25JZCwgaW5zdGFuY2VJZCkgPT4gZGF0YWJhc2VNYW5hZ2VyLmdldERhdGFzdG9yZUNvbmZpZyhcbiAgYXBwbGljYXRpb25JZCwgaW5zdGFuY2VJZCxcbik7XG5cbmNvbnN0IGNyZWF0ZUVtcHR5TWFzdGVyRGIgPSBkYXRhYmFzZU1hbmFnZXIgPT4gYXN5bmMgKCkgPT4gYXdhaXQgZGF0YWJhc2VNYW5hZ2VyLmNyZWF0ZUVtcHR5RGIoJ21hc3RlcicpO1xuXG5jb25zdCBjcmVhdGVFbXB0eUluc3RhbmNlRGIgPSBkYXRhYmFzZU1hbmFnZXIgPT4gYXN5bmMgKGFwcGxpY2F0aW9uSWQsIGluc3RhbmNlSWQpID0+IHtcbiAgaWYgKGlzTm90aGluZyhhcHBsaWNhdGlvbklkKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0ZURiOiBhcHBsaWNhdGlvbiBpZCBub3Qgc3VwcGxpZWQnKTsgfVxuICBpZiAoaXNOb3RoaW5nKGluc3RhbmNlSWQpKSB7IHRocm93IG5ldyBFcnJvcignQ3JlYXRlRGI6IGluc3RhbmNlIGlkIG5vdCBzdXBwbGllZCcpOyB9XG5cbiAgcmV0dXJuIGF3YWl0IGRhdGFiYXNlTWFuYWdlci5jcmVhdGVFbXB0eURiKFxuICAgIGFwcGxpY2F0aW9uSWQsXG4gICAgaW5zdGFuY2VJZCxcbiAgKTtcbn07XG4iLCJpbXBvcnQgZ2V0UmVjb3JkQXBpIGZyb20gXCIuL3JlY29yZEFwaVwiO1xuaW1wb3J0IGdldENvbGxlY3Rpb25BcGkgZnJvbSBcIi4vY29sbGVjdGlvbkFwaVwiO1xuaW1wb3J0IGdldEluZGV4QXBpIGZyb20gXCIuL2luZGV4QXBpXCI7XG5pbXBvcnQgZ2V0VGVtcGxhdGVBcGkgZnJvbSBcIi4vdGVtcGxhdGVBcGlcIjtcbmltcG9ydCBnZXRBdXRoQXBpIGZyb20gXCIuL2F1dGhBcGlcIjtcbmltcG9ydCBnZXRBY3Rpb25zQXBpIGZyb20gXCIuL2FjdGlvbnNBcGlcIjtcbmltcG9ydCB7c2V0dXBEYXRhc3RvcmUsIGNyZWF0ZUV2ZW50QWdncmVnYXRvcn0gZnJvbSBcIi4vYXBwSW5pdGlhbGlzZVwiO1xuaW1wb3J0IHtpbml0aWFsaXNlQWN0aW9uc30gZnJvbSBcIi4vYWN0aW9uc0FwaS9pbml0aWFsaXNlXCJcbmltcG9ydCB7aXNTb21ldGhpbmd9IGZyb20gXCIuL2NvbW1vblwiO1xuaW1wb3J0IHtjbGVhbnVwfSBmcm9tIFwiLi90cmFuc2FjdGlvbnMvY2xlYW51cFwiO1xuaW1wb3J0IHtnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9uc30gZnJvbSBcIi4vYXV0aEFwaS9nZW5lcmF0ZUZ1bGxQZXJtaXNzaW9uc1wiO1xuaW1wb3J0IHtnZXRBcHBsaWNhdGlvbkRlZmluaXRpb259IGZyb20gXCIuL3RlbXBsYXRlQXBpL2dldEFwcGxpY2F0aW9uRGVmaW5pdGlvblwiO1xuaW1wb3J0IGNvbW1vbiBmcm9tIFwiLi9jb21tb25cIjtcbmltcG9ydCB7Z2V0QmVoYXZpb3VyU291cmNlc30gZnJvbSBcIi4vdGVtcGxhdGVBcGkvZ2V0QmVoYXZpb3VyU291cmNlc1wiO1xuaW1wb3J0IGhpZXJhcmNoeSBmcm9tIFwiLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHlcIjtcblxuZXhwb3J0IGNvbnN0IGdldEFwcEFwaXMgPSBhc3luYyAoc3RvcmUsIGJlaGF2aW91clNvdXJjZXMgPSBudWxsLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYW51cFRyYW5zYWN0aW9ucyA9IG51bGwsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFcG9jaFRpbWUgPSBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcnlwdG8gPSBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBEZWZpbml0aW9uID0gbnVsbCkgPT4ge1xuXG4gICAgc3RvcmUgPSBzZXR1cERhdGFzdG9yZShzdG9yZSk7XG5cbiAgICBpZighYXBwRGVmaW5pdGlvbilcbiAgICAgICAgYXBwRGVmaW5pdGlvbiA9IGF3YWl0IGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbihzdG9yZSkoKTtcblxuICAgIGlmKCFiZWhhdmlvdXJTb3VyY2VzKVxuICAgICAgICBiZWhhdmlvdXJTb3VyY2VzID0gYXdhaXQgZ2V0QmVoYXZpb3VyU291cmNlcyhzdG9yZSk7XG5cbiAgICBjb25zdCBldmVudEFnZ3JlZ2F0b3IgPSBjcmVhdGVFdmVudEFnZ3JlZ2F0b3IoKTtcblxuICAgIGNvbnN0IGFwcCA9IHtcbiAgICAgICAgZGF0YXN0b3JlOnN0b3JlLFxuICAgICAgICBjcnlwdG8sXG4gICAgICAgIHB1Ymxpc2g6ZXZlbnRBZ2dyZWdhdG9yLnB1Ymxpc2gsXG4gICAgICAgIGhpZXJhcmNoeTphcHBEZWZpbml0aW9uLmhpZXJhcmNoeSxcbiAgICAgICAgYWN0aW9uczphcHBEZWZpbml0aW9uLmFjdGlvbnNcbiAgICB9O1xuXG4gICAgY29uc3QgdGVtcGxhdGVBcGkgPSBnZXRUZW1wbGF0ZUFwaShhcHApOyAgICBcblxuICAgIGFwcC5jbGVhbnVwVHJhbnNhY3Rpb25zID0gaXNTb21ldGhpbmcoY2xlYW51cFRyYW5zYWN0aW9ucykgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGNsZWFudXBUcmFuc2FjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogYXN5bmMgKCkgPT4gYXdhaXQgY2xlYW51cChhcHApO1xuXG4gICAgYXBwLmdldEVwb2NoVGltZSA9IGlzU29tZXRoaW5nKGdldEVwb2NoVGltZSlcbiAgICAgICAgICAgICAgICAgICAgICAgPyBnZXRFcG9jaFRpbWVcbiAgICAgICAgICAgICAgICAgICAgICAgOiBhc3luYyAoKSA9PiAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuXG4gICAgY29uc3QgcmVjb3JkQXBpID0gZ2V0UmVjb3JkQXBpKGFwcCk7XG4gICAgY29uc3QgY29sbGVjdGlvbkFwaSA9IGdldENvbGxlY3Rpb25BcGkoYXBwKTtcbiAgICBjb25zdCBpbmRleEFwaSA9IGdldEluZGV4QXBpKGFwcCk7XG4gICAgY29uc3QgYXV0aEFwaSA9IGdldEF1dGhBcGkoYXBwKTtcbiAgICBjb25zdCBhY3Rpb25zQXBpID0gZ2V0QWN0aW9uc0FwaShhcHApO1xuXG4gICAgY29uc3QgYXV0aGVudGljYXRlQXMgPSBhc3luYyAodXNlcm5hbWUsIHBhc3N3b3JkKSA9PiB7XG4gICAgICAgIGFwcC51c2VyID0gYXdhaXQgYXV0aEFwaS5hdXRoZW50aWNhdGUodXNlcm5hbWUsIHBhc3N3b3JkKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgd2l0aEZ1bGxBY2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgIGFwcC51c2VyID0ge1xuICAgICAgICAgICAgbmFtZTogXCJhcHBcIixcbiAgICAgICAgICAgIHBlcm1pc3Npb25zIDogZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMoYXBwKSxcbiAgICAgICAgICAgIGlzVXNlcjpmYWxzZSxcbiAgICAgICAgICAgIHRlbXA6ZmFsc2VcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBhc1VzZXIgPSAodXNlcikgPT4ge1xuICAgICAgICBhcHAudXNlciA9IHVzZXJcbiAgICB9O1xuXG4gICAgXG5cbiAgICBsZXQgYXBpcyA9IHtcbiAgICAgICAgcmVjb3JkQXBpLCBcbiAgICAgICAgdGVtcGxhdGVBcGksXG4gICAgICAgIGNvbGxlY3Rpb25BcGksXG4gICAgICAgIGluZGV4QXBpLFxuICAgICAgICBhdXRoQXBpLFxuICAgICAgICBhY3Rpb25zQXBpLFxuICAgICAgICBzdWJzY3JpYmU6IGV2ZW50QWdncmVnYXRvci5zdWJzY3JpYmUsXG4gICAgICAgIGF1dGhlbnRpY2F0ZUFzLFxuICAgICAgICB3aXRoRnVsbEFjY2VzcyxcbiAgICAgICAgYXNVc2VyXG4gICAgfTtcblxuICAgIGFwaXMuYWN0aW9ucyA9IGluaXRpYWxpc2VBY3Rpb25zKFxuICAgICAgICBldmVudEFnZ3JlZ2F0b3Iuc3Vic2NyaWJlLFxuICAgICAgICBiZWhhdmlvdXJTb3VyY2VzLFxuICAgICAgICBhcHBEZWZpbml0aW9uLmFjdGlvbnMsXG4gICAgICAgIGFwcERlZmluaXRpb24udHJpZ2dlcnMsXG4gICAgICAgIGFwaXMpO1xuXG5cbiAgICByZXR1cm4gYXBpcztcbn07XG5cbmV4cG9ydCB7ZXZlbnRzLCBldmVudHNMaXN0fSBmcm9tIFwiLi9jb21tb24vZXZlbnRzXCI7XG5leHBvcnQge2dldFRlbXBsYXRlQXBpfSBmcm9tIFwiLi90ZW1wbGF0ZUFwaVwiO1xuZXhwb3J0IHtnZXRSZWNvcmRBcGl9IGZyb20gXCIuL3JlY29yZEFwaVwiO1xuZXhwb3J0IHtnZXRDb2xsZWN0aW9uQXBpfSBmcm9tIFwiLi9jb2xsZWN0aW9uQXBpXCI7XG5leHBvcnQge2dldEF1dGhBcGl9IGZyb20gXCIuL2F1dGhBcGlcIjtcbmV4cG9ydCB7Z2V0SW5kZXhBcGl9IGZyb20gXCIuL2luZGV4QXBpXCI7XG5leHBvcnQge3NldHVwRGF0YXN0b3JlfSBmcm9tIFwiLi9hcHBJbml0aWFsaXNlXCI7XG5leHBvcnQge2dldEFjdGlvbnNBcGl9IGZyb20gXCIuL2FjdGlvbnNBcGlcIjtcbmV4cG9ydCB7aW5pdGlhbGlzZURhdGF9IGZyb20gXCIuL2FwcEluaXRpYWxpc2UvaW5pdGlhbGlzZURhdGFcIjtcbmV4cG9ydCB7Z2V0RGF0YWJhc2VNYW5hZ2VyfSBmcm9tIFwiLi9hcHBJbml0aWFsaXNlL2RhdGFiYXNlTWFuYWdlclwiO1xuZXhwb3J0IHtoaWVyYXJjaHl9O1xuZXhwb3J0IHtjb21tb259O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRBcHBBcGlzOyJdLCJuYW1lcyI6WyJpc0FycmF5Iiwiam9pbiIsImlzTmFOIiwiY29tcGlsZUV4cHJlc3Npb24iLCJjb21waWxlQ29kZSIsIm1ha2VydWxlIiwib3B0aW9ucyIsInR5cGVDb25zdHJhaW50cyIsImFsbCIsImdldERlZmF1bHRPcHRpb25zIiwidmFsaWRhdGVUeXBlQ29uc3RyYWludHMiLCJnbG9iYWwiLCJiYXNlNjQuZnJvbUJ5dGVBcnJheSIsImllZWU3NTQucmVhZCIsImllZWU3NTQud3JpdGUiLCJiYXNlNjQudG9CeXRlQXJyYXkiLCJyZWFkIiwiQnVmZmVyIiwicmVhZEluZGV4IiwibWVyZ2UiLCJkZWxldGVSZWNvcmQiLCJ2YWxpZGF0ZSIsImZpbmQiLCJlYWNoIiwiZGVmYXVsdENhc2UiLCJhcGkiLCJjcmVhdGVUZW1wb3JhcnlBY2Nlc3MiLCJjcmVhdGVVc2VyIiwic2V0VXNlckFjY2Vzc0xldmVscyIsImV4ZWN1dGVBY3Rpb24iLCJjQ29kZSIsImNFeHAiLCJvcmRlckJ5IiwidW5pb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQSxNQUFNLFVBQVUsR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUvRSxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFcEMsTUFBTSxPQUFPLEdBQUc7RUFDZCxTQUFTLEVBQUU7SUFDVCxJQUFJLEVBQUUsVUFBVSxDQUFDO01BQ2YsV0FBVztNQUNYLGlCQUFpQjtNQUNqQixpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JCLE1BQU0sRUFBRSxNQUFNLEVBQUU7SUFDaEIsVUFBVSxFQUFFLE1BQU0sRUFBRTtJQUNwQixNQUFNLEVBQUUsTUFBTSxFQUFFO0lBQ2hCLElBQUksRUFBRSxNQUFNLEVBQUU7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QUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUc7O0VBRXBDLElBQUksQ0FBQyxHQUFHLEVBQUM7O0VBRVQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDeEMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDO0lBQ2xLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEVBQUUsSUFBSSxLQUFJO0lBQzdCLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFJO0lBQzVCLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxLQUFJO0dBQ3RCOztFQUVELElBQUksWUFBWSxLQUFLLENBQUMsRUFBRTtJQUN0QixHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUM7SUFDbkYsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUk7R0FDdEIsTUFBTSxJQUFJLFlBQVksS0FBSyxDQUFDLEVBQUU7SUFDN0IsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDO0lBQzlILEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFJO0lBQzVCLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxLQUFJO0dBQ3RCOztFQUVELE9BQU8sR0FBRztDQUNYOztBQUVELFNBQVMsZUFBZSxFQUFFLEdBQUcsRUFBRTtFQUM3QixPQUFPLE1BQU0sQ0FBQyxHQUFHLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0NBQzFHOztBQUVELFNBQVMsV0FBVyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFO0VBQ3ZDLElBQUksSUFBRztFQUNQLElBQUksTUFBTSxHQUFHLEdBQUU7RUFDZixLQUFLLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDbkMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFD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T0FBTyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLEVBQUU7O0VBRTFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUM7RUFDN0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFDO0VBQ2QsS0FBSyxJQUFJLEtBQUk7RUFDYixPQUFPLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUUsRUFBRTs7RUFFMUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO0lBQ1gsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFLO0dBQ2QsTUFBTSxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDckIsT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxRQUFRLENBQUM7R0FDM0MsTUFBTTtJQUNMLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFDO0lBQ3pCLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBSztHQUNkO0VBQ0QsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7Q0FDaEQ7O0FBRUQsQUFBTyxTQUFTLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtFQUNoRSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBQztFQUNYLElBQUksSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLEVBQUM7RUFDaEMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUM7RUFDMUIsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUM7RUFDckIsSUFBSSxFQUFFLElBQUksSUFBSSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDO0VBQ2hFLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksTUFBTSxHQUFHLENBQUMsRUFBQztFQUMvQixJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBQztFQUNyQixJQUFJLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBQzs7RUFFM0QsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFDOztFQUV2QixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssUUFBUSxFQUFFO0lBQ3RDLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUM7SUFDeEIsQ0FBQyxHQUFHLEtBQUk7R0FDVCxNQUFNO0lBQ0wsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFDO0lBQzFDLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO01BQ3JDLENBQUMsR0FBRTtNQUNILENBQUMsSUFBSSxFQUFDO0tBQ1A7SUFDRCxJQUFJLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxFQUFFO01BQ2xCLEtBQUssSUFBSSxFQUFFLEdBQUcsRUFBQztLQUNoQixNQUFNO01BQ0wsS0FBSyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFDO0tBQ3JDO0lBQ0QsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUNsQixDQUFDLEdBQUU7TUFDSCxDQUFDLElBQUksRUFBQztLQUNQOztJQUVELElBQUksQ0FBQyxHQUFHLEtBQUssSUFBSSxJQUFJLEVBQUU7TUFDckIsQ0FBQyxHQUFHLEVBQUM7TUFDTCxDQUFDLEdBQUcsS0FBSTtLQUNULE1BQU0sSUFBSSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsRUFBRTtNQUN6QixDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUM7TUFDdkMsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFLO0tBQ2QsTUFBTTtNQUNMLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBQztNQUN0RCxDQUFDLEdBQUcsRUFBQztLQUNOO0dBQ0Y7O0VBRUQsT0FBTyxJQUFJLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsRUFBRSxFQUFFOztFQUVoRixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFB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QyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDckI7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxXQUFXLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUNyRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7RUFDbEQsT0FBT0MsSUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7RUFDL0M7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxXQUFXLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUNyRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7RUFDbEQsT0FBT0EsSUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7RUFDaEQ7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7RUFDbEQsT0FBT0EsSUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7RUFDL0M7O0FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUN2RSxJQUFJLENBQUMsUUFB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LENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBQzs7SUFFM0MsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFDO0dBQzdEOztFQUVELElBQUksQ0FBQyxHQUFHLEVBQUM7RUFDVCxJQUFJLEdBQUcsR0FBRyxFQUFDO0VBQ1gsSUFBSSxHQUFHLEdBQUcsRUFBQztFQUNYLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSTtFQUMzQixPQUFPLEVBQUUsQ0FBQyxHQUFHLFVBQVUsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUU7SUFDekMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQ3hELEdBQUcsR0FBRyxFQUFDO0tBQ1I7SUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsS0FBSTtHQUNyRDs7RUFFRCxPQUFPLE1BQU0sR0FBRyxVQUFVO0VBQzNCOztBQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFNBQVMsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRTtFQUN0RixLQUFLLEdBQUcsQ0FBQyxNQUFLO0VBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0VBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUU7SUFDYixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBQzs7SUFFM0MsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxLQUFL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
