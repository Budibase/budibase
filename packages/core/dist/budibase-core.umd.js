(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash/fp'), require('shortid'), require('lodash'), require('@nx-js/compiler-util'), require('lunr'), require('safe-buffer')) :
  typeof define === 'function' && define.amd ? define(['exports', 'lodash/fp', 'shortid', 'lodash', '@nx-js/compiler-util', 'lunr', 'safe-buffer'], factory) :
  (global = global || self, factory(global['@budibase/core'] = {}, global.fp, global.shortid, global._, global.compiler_util, global.lunr, global.safe_buffer));
}(this, function (exports, fp, shortid, _, compilerUtil, lunr, safeBuffer) { 'use strict';

  var ___default = 'default' in _ ? _['default'] : _;
  lunr = lunr && lunr.hasOwnProperty('default') ? lunr['default'] : lunr;

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

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVkaWJhc2UtY29yZS51bWQuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21tb24vZXZlbnRzLmpzIiwiLi4vc3JjL2NvbW1vbi9lcnJvcnMuanMiLCIuLi9zcmMvY29tbW9uL2FwaVdyYXBwZXIuanMiLCIuLi9zcmMvY29tbW9uL2xvY2suanMiLCIuLi9zcmMvY29tbW9uL2luZGV4LmpzIiwiLi4vc3JjL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uLmpzIiwiLi4vc3JjL2luZGV4aW5nL2V2YWx1YXRlLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2luZGV4ZXMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvaGllcmFyY2h5LmpzIiwiLi4vc3JjL3R5cGVzL3R5cGVIZWxwZXJzLmpzIiwiLi4vc3JjL3R5cGVzL3N0cmluZy5qcyIsIi4uL3NyYy90eXBlcy9ib29sLmpzIiwiLi4vc3JjL3R5cGVzL251bWJlci5qcyIsIi4uL3NyYy90eXBlcy9kYXRldGltZS5qcyIsIi4uL3NyYy90eXBlcy9hcnJheS5qcyIsIi4uL3NyYy90eXBlcy9yZWZlcmVuY2UuanMiLCIuLi9zcmMvdHlwZXMvZmlsZS5qcyIsIi4uL3NyYy90eXBlcy9pbmRleC5qcyIsIi4uL3NyYy9hdXRoQXBpL2F1dGhDb21tb24uanMiLCIuLi9zcmMvYXV0aEFwaS9pc0F1dGhvcml6ZWQuanMiLCIuLi9zcmMvYXV0aEFwaS9wZXJtaXNzaW9ucy5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZ2V0TmV3LmpzIiwiLi4vc3JjL3JlY29yZEFwaS9sb2FkLmpzIiwiLi4vc3JjL2luZGV4aW5nL3Byb21pc2VSZWFkYWJsZVN0cmVhbS5qcyIsIi4uL3NyYy9pbmRleGluZy9zaGFyZGluZy5qcyIsIi4uL3NyYy9pbmRleGluZy9pbmRleFNjaGVtYUNyZWF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvcm9sbHVwLXBsdWdpbi1ub2RlLWdsb2JhbHMvc3JjL2dsb2JhbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9idWZmZXItZXM2L2Jhc2U2NC5qcyIsIi4uL25vZGVfbW9kdWxlcy9idWZmZXItZXM2L2llZWU3NTQuanMiLCIuLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVzNi9pc0FycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2J1ZmZlci1lczYvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvcm9sbHVwLXBsdWdpbi1ub2RlLWJ1aWx0aW5zL3NyYy9lczYvc3RyaW5nLWRlY29kZXIuanMiLCIuLi9zcmMvaW5kZXhpbmcvc2VyaWFsaXplci5qcyIsIi4uL3NyYy9pbmRleGluZy9yZWFkLmpzIiwiLi4vc3JjL2luZGV4QXBpL2xpc3RJdGVtcy5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZ2V0Q29udGV4dC5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvdmFsaWRhdGUuanMiLCIuLi9zcmMvY29sbGVjdGlvbkFwaS9pbml0aWFsaXNlLmpzIiwiLi4vc3JjL2luZGV4aW5nL2FsbElkcy5qcyIsIi4uL3NyYy90cmFuc2FjdGlvbnMvdHJhbnNhY3Rpb25zQ29tbW9uLmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9jcmVhdGUuanMiLCIuLi9zcmMvaW5kZXhpbmcvaW5pdGlhbGlzZUluZGV4LmpzIiwiLi4vc3JjL3JlY29yZEFwaS9zYXZlLmpzIiwiLi4vc3JjL2NvbGxlY3Rpb25BcGkvZGVsZXRlLmpzIiwiLi4vc3JjL2luZGV4QXBpL2RlbGV0ZS5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZGVsZXRlLmpzIiwiLi4vc3JjL3JlY29yZEFwaS91cGxvYWRGaWxlLmpzIiwiLi4vc3JjL3JlY29yZEFwaS9kb3dubG9hZEZpbGUuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2N1c3RvbUlkLmpzIiwiLi4vc3JjL3JlY29yZEFwaS9pbmRleC5qcyIsIi4uL3NyYy9jb2xsZWN0aW9uQXBpL2dldEFsbG93ZWRSZWNvcmRUeXBlcy5qcyIsIi4uL3NyYy9jb2xsZWN0aW9uQXBpL2luZGV4LmpzIiwiLi4vc3JjL2luZGV4QXBpL2J1aWxkSW5kZXguanMiLCIuLi9zcmMvaW5kZXhBcGkvYWdncmVnYXRlcy5qcyIsIi4uL3NyYy9pbmRleEFwaS9pbmRleC5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9jcmVhdGVOb2Rlcy5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9maWVsZHMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvcmVjb3JkVmFsaWRhdGlvblJ1bGVzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2NyZWF0ZUFjdGlvbnMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvdmFsaWRhdGVBZ2dyZWdhdGUuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvdmFsaWRhdGUuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL3NhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeS5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9zYXZlQWN0aW9uc0FuZFRyaWdnZXJzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2dldEJlaGF2aW91clNvdXJjZXMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvaW5kZXguanMiLCIuLi9zcmMvYXV0aEFwaS9nZXRVc2Vycy5qcyIsIi4uL3NyYy9hdXRoQXBpL2xvYWRBY2Nlc3NMZXZlbHMuanMiLCIuLi9zcmMvYXV0aEFwaS9hdXRoZW50aWNhdGUuanMiLCIuLi9zcmMvYXV0aEFwaS9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MuanMiLCIuLi9zcmMvYXV0aEFwaS92YWxpZGF0ZVVzZXIuanMiLCIuLi9zcmMvYXV0aEFwaS9nZXROZXdVc2VyLmpzIiwiLi4vc3JjL2F1dGhBcGkvc2V0UGFzc3dvcmQuanMiLCIuLi9zcmMvYXV0aEFwaS9jcmVhdGVVc2VyLmpzIiwiLi4vc3JjL2F1dGhBcGkvZW5hYmxlVXNlci5qcyIsIi4uL3NyYy9hdXRoQXBpL2dldE5ld0FjY2Vzc0xldmVsLmpzIiwiLi4vc3JjL2F1dGhBcGkvdmFsaWRhdGVBY2Nlc3NMZXZlbHMuanMiLCIuLi9zcmMvYXV0aEFwaS9zYXZlQWNjZXNzTGV2ZWxzLmpzIiwiLi4vc3JjL2F1dGhBcGkvZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMuanMiLCIuLi9zcmMvYXV0aEFwaS9zZXRVc2VyQWNjZXNzTGV2ZWxzLmpzIiwiLi4vc3JjL2F1dGhBcGkvaW5kZXguanMiLCIuLi9zcmMvYWN0aW9uc0FwaS9leGVjdXRlLmpzIiwiLi4vc3JjL2FjdGlvbnNBcGkvaW5kZXguanMiLCIuLi9zcmMvYXBwSW5pdGlhbGlzZS9ldmVudEFnZ3JlZ2F0b3IuanMiLCIuLi9zcmMvYXBwSW5pdGlhbGlzZS9pbmRleC5qcyIsIi4uL3NyYy9jb21tb24vY29tcGlsZUNvZGUuanMiLCIuLi9zcmMvYWN0aW9uc0FwaS9pbml0aWFsaXNlLmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9yZXRyaWV2ZS5qcyIsIi4uL3NyYy9pbmRleGluZy9yZWxldmFudC5qcyIsIi4uL3NyYy9pbmRleGluZy9wcm9taXNlV3JpdGFibGVTdHJlYW0uanMiLCIuLi9zcmMvaW5kZXhpbmcvYXBwbHkuanMiLCIuLi9zcmMvdHJhbnNhY3Rpb25zL2V4ZWN1dGUuanMiLCIuLi9zcmMvdHJhbnNhY3Rpb25zL2NsZWFudXAuanMiLCIuLi9zcmMvYXBwSW5pdGlhbGlzZS9pbml0aWFsaXNlRGF0YS5qcyIsIi4uL3NyYy9hcHBJbml0aWFsaXNlL2RhdGFiYXNlTWFuYWdlci5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1bmlvbiwgcmVkdWNlIH0gZnJvbSAnbG9kYXNoL2ZwJztcblxuY29uc3QgY29tbW9uUGx1cyA9IGV4dHJhID0+IHVuaW9uKFsnb25CZWdpbicsICdvbkNvbXBsZXRlJywgJ29uRXJyb3InXSkoZXh0cmEpO1xuXG5jb25zdCBjb21tb24gPSAoKSA9PiBjb21tb25QbHVzKFtdKTtcblxuY29uc3QgX2V2ZW50cyA9IHtcbiAgcmVjb3JkQXBpOiB7XG4gICAgc2F2ZTogY29tbW9uUGx1cyhbXG4gICAgICAnb25JbnZhbGlkJyxcbiAgICAgICdvblJlY29yZFVwZGF0ZWQnLFxuICAgICAgJ29uUmVjb3JkQ3JlYXRlZCddKSxcbiAgICBkZWxldGU6IGNvbW1vbigpLFxuICAgIGdldENvbnRleHQ6IGNvbW1vbigpLFxuICAgIGdldE5ldzogY29tbW9uKCksXG4gICAgbG9hZDogY29tbW9uKCksXG4gICAgdmFsaWRhdGU6IGNvbW1vbigpLFxuICAgIHVwbG9hZEZpbGU6IGNvbW1vbigpLFxuICAgIGRvd25sb2FkRmlsZTogY29tbW9uKCksXG4gIH0sXG4gIGluZGV4QXBpOiB7XG4gICAgYnVpbGRJbmRleDogY29tbW9uKCksXG4gICAgbGlzdEl0ZW1zOiBjb21tb24oKSxcbiAgICBkZWxldGU6IGNvbW1vbigpLFxuICAgIGFnZ3JlZ2F0ZXM6IGNvbW1vbigpLFxuICB9LFxuICBjb2xsZWN0aW9uQXBpOiB7XG4gICAgZ2V0QWxsb3dlZFJlY29yZFR5cGVzOiBjb21tb24oKSxcbiAgICBpbml0aWFsaXNlOiBjb21tb24oKSxcbiAgICBkZWxldGU6IGNvbW1vbigpLFxuICB9LFxuICBhdXRoQXBpOiB7XG4gICAgYXV0aGVudGljYXRlOiBjb21tb24oKSxcbiAgICBhdXRoZW50aWNhdGVUZW1wb3JhcnlBY2Nlc3M6IGNvbW1vbigpLFxuICAgIGNyZWF0ZVRlbXBvcmFyeUFjY2VzczogY29tbW9uKCksXG4gICAgY3JlYXRlVXNlcjogY29tbW9uKCksXG4gICAgZW5hYmxlVXNlcjogY29tbW9uKCksXG4gICAgZGlzYWJsZVVzZXI6IGNvbW1vbigpLFxuICAgIGxvYWRBY2Nlc3NMZXZlbHM6IGNvbW1vbigpLFxuICAgIGdldE5ld0FjY2Vzc0xldmVsOiBjb21tb24oKSxcbiAgICBnZXROZXdVc2VyOiBjb21tb24oKSxcbiAgICBnZXROZXdVc2VyQXV0aDogY29tbW9uKCksXG4gICAgZ2V0VXNlcnM6IGNvbW1vbigpLFxuICAgIHNhdmVBY2Nlc3NMZXZlbHM6IGNvbW1vbigpLFxuICAgIGlzQXV0aG9yaXplZDogY29tbW9uKCksXG4gICAgY2hhbmdlTXlQYXNzd29yZDogY29tbW9uKCksXG4gICAgc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZTogY29tbW9uKCksXG4gICAgc2NvcmVQYXNzd29yZDogY29tbW9uKCksXG4gICAgaXNWYWxpZFBhc3N3b3JkOiBjb21tb24oKSxcbiAgICB2YWxpZGF0ZVVzZXI6IGNvbW1vbigpLFxuICAgIHZhbGlkYXRlQWNjZXNzTGV2ZWxzOiBjb21tb24oKSxcbiAgICBzZXRVc2VyQWNjZXNzTGV2ZWxzOiBjb21tb24oKSxcbiAgfSxcbiAgdGVtcGxhdGVBcGk6IHtcbiAgICBzYXZlQXBwbGljYXRpb25IaWVyYXJjaHk6IGNvbW1vbigpLFxuICAgIHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnM6IGNvbW1vbigpLFxuICB9LFxuICBhY3Rpb25zQXBpOiB7XG4gICAgZXhlY3V0ZTogY29tbW9uKCksXG4gIH0sXG59O1xuXG5jb25zdCBfZXZlbnRzTGlzdCA9IFtdO1xuXG5jb25zdCBtYWtlRXZlbnQgPSAoYXJlYSwgbWV0aG9kLCBuYW1lKSA9PiBgJHthcmVhfToke21ldGhvZH06JHtuYW1lfWA7XG5cbmZvciAoY29uc3QgYXJlYUtleSBpbiBfZXZlbnRzKSB7XG4gIGZvciAoY29uc3QgbWV0aG9kS2V5IGluIF9ldmVudHNbYXJlYUtleV0pIHtcbiAgICBfZXZlbnRzW2FyZWFLZXldW21ldGhvZEtleV0gPSByZWR1Y2UoKG9iaiwgcykgPT4ge1xuICAgICAgb2JqW3NdID0gbWFrZUV2ZW50KGFyZWFLZXksIG1ldGhvZEtleSwgcyk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0sXG4gICAge30pKF9ldmVudHNbYXJlYUtleV1bbWV0aG9kS2V5XSk7XG4gIH1cbn1cblxuXG5mb3IgKGNvbnN0IGFyZWFLZXkgaW4gX2V2ZW50cykge1xuICBmb3IgKGNvbnN0IG1ldGhvZEtleSBpbiBfZXZlbnRzW2FyZWFLZXldKSB7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIF9ldmVudHNbYXJlYUtleV1bbWV0aG9kS2V5XSkge1xuICAgICAgX2V2ZW50c0xpc3QucHVzaChcbiAgICAgICAgX2V2ZW50c1thcmVhS2V5XVttZXRob2RLZXldW25hbWVdLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuXG5leHBvcnQgY29uc3QgZXZlbnRzID0gX2V2ZW50cztcblxuZXhwb3J0IGNvbnN0IGV2ZW50c0xpc3QgPSBfZXZlbnRzTGlzdDtcblxuZXhwb3J0IGRlZmF1bHQgeyBldmVudHM6IF9ldmVudHMsIGV2ZW50c0xpc3Q6IF9ldmVudHNMaXN0IH07XG4iLCJleHBvcnQgY2xhc3MgQmFkUmVxdWVzdEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDA7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5hdXRob3Jpc2VkRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDQwMTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGb3JiaWRkZW5FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmh0dHBTdGF0dXNDb2RlID0gNDAzO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5vdEZvdW5kRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDQwNDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb25mbGljdEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDk7XG4gICAgfVxufSIsImltcG9ydCB7IGNsb25lRGVlcCwgaXNVbmRlZmluZWQgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcbmltcG9ydCB7IFVuYXV0aG9yaXNlZEVycm9yIH0gZnJvbSAnLi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgYXBpV3JhcHBlciA9IGFzeW5jIChhcHAsIGV2ZW50TmFtZXNwYWNlLCBpc0F1dGhvcml6ZWQsIGV2ZW50Q29udGV4dCwgZnVuYywgLi4ucGFyYW1zKSA9PiB7XG4gIHB1c2hDYWxsU3RhY2soYXBwLCBldmVudE5hbWVzcGFjZSk7XG5cbiAgaWYgKCFpc0F1dGhvcml6ZWQoYXBwKSkge1xuICAgIGhhbmRsZU5vdEF1dGhvcml6ZWQoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzdGFydERhdGUgPSBEYXRlLm5vdygpO1xuICBjb25zdCBlbGFwc2VkID0gKCkgPT4gKERhdGUubm93KCkgLSBzdGFydERhdGUpO1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgYXBwLnB1Ymxpc2goXG4gICAgICBldmVudE5hbWVzcGFjZS5vbkJlZ2luLFxuICAgICAgZXZlbnRDb250ZXh0LFxuICAgICk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBmdW5jKC4uLnBhcmFtcyk7XG5cbiAgICBhd2FpdCBwdWJsaXNoQ29tcGxldGUoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgYXdhaXQgcHVibGlzaEVycm9yKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgYXBpV3JhcHBlclN5bmMgPSAoYXBwLCBldmVudE5hbWVzcGFjZSwgaXNBdXRob3JpemVkLCBldmVudENvbnRleHQsIGZ1bmMsIC4uLnBhcmFtcykgPT4ge1xuICBwdXNoQ2FsbFN0YWNrKGFwcCwgZXZlbnROYW1lc3BhY2UpO1xuXG4gIGlmICghaXNBdXRob3JpemVkKGFwcCkpIHtcbiAgICBoYW5kbGVOb3RBdXRob3JpemVkKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgc3RhcnREYXRlID0gRGF0ZS5ub3coKTtcbiAgY29uc3QgZWxhcHNlZCA9ICgpID0+IChEYXRlLm5vdygpIC0gc3RhcnREYXRlKTtcblxuICB0cnkge1xuICAgIGFwcC5wdWJsaXNoKFxuICAgICAgZXZlbnROYW1lc3BhY2Uub25CZWdpbixcbiAgICAgIGV2ZW50Q29udGV4dCxcbiAgICApO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gZnVuYyguLi5wYXJhbXMpO1xuXG4gICAgcHVibGlzaENvbXBsZXRlKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHB1Ymxpc2hFcnJvcihhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIGVycm9yKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxuY29uc3QgaGFuZGxlTm90QXV0aG9yaXplZCA9IChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UpID0+IHtcbiAgY29uc3QgZXJyID0gbmV3IFVuYXV0aG9yaXNlZEVycm9yKGBVbmF1dGhvcml6ZWQ6ICR7ZXZlbnROYW1lc3BhY2V9YCk7XG4gIHB1Ymxpc2hFcnJvcihhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsICgpID0+IDAsIGVycik7XG4gIHRocm93IGVycjtcbn07XG5cbmNvbnN0IHB1c2hDYWxsU3RhY2sgPSAoYXBwLCBldmVudE5hbWVzcGFjZSwgc2VlZENhbGxJZCkgPT4ge1xuICBjb25zdCBjYWxsSWQgPSBnZW5lcmF0ZSgpO1xuXG4gIGNvbnN0IGNyZWF0ZUNhbGxTdGFjayA9ICgpID0+ICh7XG4gICAgc2VlZENhbGxJZDogIWlzVW5kZWZpbmVkKHNlZWRDYWxsSWQpXG4gICAgICA/IHNlZWRDYWxsSWRcbiAgICAgIDogY2FsbElkLFxuICAgIHRocmVhZENhbGxJZDogY2FsbElkLFxuICAgIHN0YWNrOiBbXSxcbiAgfSk7XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGFwcC5jYWxscykpIHtcbiAgICBhcHAuY2FsbHMgPSBjcmVhdGVDYWxsU3RhY2soKTtcbiAgfVxuXG4gIGFwcC5jYWxscy5zdGFjay5wdXNoKHtcbiAgICBuYW1lc3BhY2U6IGV2ZW50TmFtZXNwYWNlLFxuICAgIGNhbGxJZCxcbiAgfSk7XG59O1xuXG5jb25zdCBwb3BDYWxsU3RhY2sgPSAoYXBwKSA9PiB7XG4gIGFwcC5jYWxscy5zdGFjay5wb3AoKTtcbiAgaWYgKGFwcC5jYWxscy5zdGFjay5sZW5ndGggPT09IDApIHtcbiAgICBkZWxldGUgYXBwLmNhbGxzO1xuICB9XG59O1xuXG5jb25zdCBwdWJsaXNoRXJyb3IgPSBhc3luYyAoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCBlcnIpID0+IHtcbiAgY29uc3QgY3R4ID0gY2xvbmVEZWVwKGV2ZW50Q29udGV4dCk7XG4gIGN0eC5lcnJvciA9IGVycjtcbiAgY3R4LmVsYXBzZWQgPSBlbGFwc2VkKCk7XG4gIGF3YWl0IGFwcC5wdWJsaXNoKFxuICAgIGV2ZW50TmFtZXNwYWNlLm9uRXJyb3IsXG4gICAgY3R4LFxuICApO1xuICBwb3BDYWxsU3RhY2soYXBwKTtcbn07XG5cbmNvbnN0IHB1Ymxpc2hDb21wbGV0ZSA9IGFzeW5jIChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIHJlc3VsdCkgPT4ge1xuICBjb25zdCBlbmRjb250ZXh0ID0gY2xvbmVEZWVwKGV2ZW50Q29udGV4dCk7XG4gIGVuZGNvbnRleHQucmVzdWx0ID0gcmVzdWx0O1xuICBlbmRjb250ZXh0LmVsYXBzZWQgPSBlbGFwc2VkKCk7XG4gIGF3YWl0IGFwcC5wdWJsaXNoKFxuICAgIGV2ZW50TmFtZXNwYWNlLm9uQ29tcGxldGUsXG4gICAgZW5kY29udGV4dCxcbiAgKTtcbiAgcG9wQ2FsbFN0YWNrKGFwcCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhcGlXcmFwcGVyO1xuIiwiaW1wb3J0IHsgc3BsaXQgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgJCB9IGZyb20gJy4vaW5kZXgnO1xuXG5jb25zdCBsb2NrT3ZlcmxhcE1pbGxpc2Vjb25kcyA9IDEwO1xuXG5leHBvcnQgY29uc3QgZ2V0TG9jayA9IGFzeW5jIChhcHAsIGxvY2tGaWxlLCB0aW1lb3V0TWlsbGlzZWNvbmRzLCBtYXhMb2NrUmV0cmllcywgcmV0cnlDb3VudCA9IDApID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB0aW1lb3V0ID0gKGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKSlcbiAgICAgICAgICAgICsgdGltZW91dE1pbGxpc2Vjb25kcztcblxuICAgIGNvbnN0IGxvY2sgPSB7XG4gICAgICB0aW1lb3V0LFxuICAgICAga2V5OiBsb2NrRmlsZSxcbiAgICAgIHRvdGFsVGltZW91dDogdGltZW91dE1pbGxpc2Vjb25kcyxcbiAgICB9O1xuXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVGaWxlKFxuICAgICAgbG9ja0ZpbGUsXG4gICAgICBnZXRMb2NrRmlsZUNvbnRlbnQoXG4gICAgICAgIGxvY2sudG90YWxUaW1lb3V0LFxuICAgICAgICBsb2NrLnRpbWVvdXQsXG4gICAgICApLFxuICAgICk7XG5cbiAgICByZXR1cm4gbG9jaztcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChyZXRyeUNvdW50ID09IG1heExvY2tSZXRyaWVzKSB7IHJldHVybiBOT19MT0NLOyB9XG5cbiAgICBjb25zdCBsb2NrID0gcGFyc2VMb2NrRmlsZUNvbnRlbnQoXG4gICAgICBsb2NrRmlsZSxcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEZpbGUobG9ja0ZpbGUpLFxuICAgICk7XG5cbiAgICBjb25zdCBjdXJyZW50RXBvY2hUaW1lID0gYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpO1xuXG4gICAgaWYgKGN1cnJlbnRFcG9jaFRpbWUgPCBsb2NrLnRpbWVvdXQpIHtcbiAgICAgIHJldHVybiBOT19MT0NLO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUobG9ja0ZpbGUpO1xuICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgIC8vZW1wdHlcbiAgICB9XG5cbiAgICBhd2FpdCBzbGVlcEZvclJldHJ5KCk7XG5cbiAgICByZXR1cm4gYXdhaXQgZ2V0TG9jayhcbiAgICAgIGFwcCwgbG9ja0ZpbGUsIHRpbWVvdXRNaWxsaXNlY29uZHMsXG4gICAgICBtYXhMb2NrUmV0cmllcywgcmV0cnlDb3VudCArIDEsXG4gICAgKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGdldExvY2tGaWxlQ29udGVudCA9ICh0b3RhbFRpbWVvdXQsIGVwb2NoVGltZSkgPT4gYCR7dG90YWxUaW1lb3V0fToke2Vwb2NoVGltZS50b1N0cmluZygpfWA7XG5cbmNvbnN0IHBhcnNlTG9ja0ZpbGVDb250ZW50ID0gKGtleSwgY29udGVudCkgPT4gJChjb250ZW50LCBbXG4gIHNwbGl0KCc6JyksXG4gIHBhcnRzID0+ICh7XG4gICAgdG90YWxUaW1lb3V0OiBuZXcgTnVtYmVyKHBhcnRzWzBdKSxcbiAgICB0aW1lb3V0OiBuZXcgTnVtYmVyKHBhcnRzWzFdKSxcbiAgICBrZXksXG4gIH0pLFxuXSk7XG5cbmV4cG9ydCBjb25zdCByZWxlYXNlTG9jayA9IGFzeW5jIChhcHAsIGxvY2spID0+IHtcbiAgY29uc3QgY3VycmVudEVwb2NoVGltZSA9IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKTtcbiAgLy8gb25seSByZWxlYXNlIGlmIG5vdCB0aW1lZG91dFxuICBpZiAoY3VycmVudEVwb2NoVGltZSA8IChsb2NrLnRpbWVvdXQgLSBsb2NrT3ZlcmxhcE1pbGxpc2Vjb25kcykpIHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKGxvY2sua2V5KTtcbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICAvL2VtcHR5XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZXh0ZW5kTG9jayA9IGFzeW5jIChhcHAsIGxvY2spID0+IHtcbiAgY29uc3QgY3VycmVudEVwb2NoVGltZSA9IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKTtcbiAgLy8gb25seSByZWxlYXNlIGlmIG5vdCB0aW1lZG91dFxuICBpZiAoY3VycmVudEVwb2NoVGltZSA8IChsb2NrLnRpbWVvdXQgLSBsb2NrT3ZlcmxhcE1pbGxpc2Vjb25kcykpIHtcbiAgICB0cnkge1xuICAgICAgbG9jay50aW1lb3V0ID0gY3VycmVudEVwb2NoVGltZSArIGxvY2sudGltZW91dE1pbGxpc2Vjb25kcztcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlRmlsZShcbiAgICAgICAgbG9jay5rZXksXG4gICAgICAgIGdldExvY2tGaWxlQ29udGVudChsb2NrLnRvdGFsVGltZW91dCwgbG9jay50aW1lb3V0KSxcbiAgICAgICk7XG4gICAgICByZXR1cm4gbG9jaztcbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICAvL2VtcHR5XG4gICAgfVxuICB9XG4gIHJldHVybiBOT19MT0NLO1xufTtcblxuZXhwb3J0IGNvbnN0IE5PX0xPQ0sgPSAnbm8gbG9jayc7XG5leHBvcnQgY29uc3QgaXNOb2xvY2sgPSBpZCA9PiBpZCA9PT0gTk9fTE9DSztcblxuY29uc3Qgc2xlZXBGb3JSZXRyeSA9ICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBsb2NrT3ZlcmxhcE1pbGxpc2Vjb25kcykpO1xuIiwiaW1wb3J0IHtcbiAgaXNVbmRlZmluZWQsIGlzTmFOLCBpc051bGwsXG4gIHJlZHVjZSwgY29uc3RhbnQsIGhlYWQsIGlzRW1wdHksXG4gIHRhaWwsIGZpbmRJbmRleCwgc3RhcnRzV2l0aCwgam9pbixcbiAgZHJvcFJpZ2h0LCBmbG93LCB0YWtlUmlnaHQsIHRyaW0sXG4gIHNwbGl0LCBpbmNsdWRlcywgcmVwbGFjZSwgaXNBcnJheSxcbiAgaXNTdHJpbmcsIGlzSW50ZWdlciwgaXNEYXRlLCB0b051bWJlcixcbn0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IHNvbWUgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZXZlbnRzLCBldmVudHNMaXN0IH0gZnJvbSAnLi9ldmVudHMnO1xuaW1wb3J0IHsgYXBpV3JhcHBlciB9IGZyb20gJy4vYXBpV3JhcHBlcic7XG5pbXBvcnQge1xuICBnZXRMb2NrLCBOT19MT0NLLFxuICBpc05vbG9ja1xufSBmcm9tICcuL2xvY2snO1xuXG4vLyB0aGlzIGlzIHRoZSBjb21iaW5hdG9yIGZ1bmN0aW9uXG5leHBvcnQgY29uc3QgJCQgPSAoLi4uZnVuY3MpID0+IGFyZyA9PiBmbG93KGZ1bmNzKShhcmcpO1xuXG4vLyB0aGlzIGlzIHRoZSBwaXBlIGZ1bmN0aW9uXG5leHBvcnQgY29uc3QgJCA9IChhcmcsIGZ1bmNzKSA9PiAkJCguLi5mdW5jcykoYXJnKTtcblxuZXhwb3J0IGNvbnN0IGtleVNlcCA9ICcvJztcbmNvbnN0IHRyaW1LZXlTZXAgPSBzdHIgPT4gdHJpbShzdHIsIGtleVNlcCk7XG5jb25zdCBzcGxpdEJ5S2V5U2VwID0gc3RyID0+IHNwbGl0KHN0ciwga2V5U2VwKTtcbmV4cG9ydCBjb25zdCBzYWZlS2V5ID0ga2V5ID0+IHJlcGxhY2UoYCR7a2V5U2VwfSR7dHJpbUtleVNlcChrZXkpfWAsIGAke2tleVNlcH0ke2tleVNlcH1gLCBrZXlTZXApO1xuZXhwb3J0IGNvbnN0IGpvaW5LZXkgPSAoLi4uc3RycykgPT4ge1xuICBjb25zdCBwYXJhbXNPckFycmF5ID0gc3Rycy5sZW5ndGggPT09IDEgJiBpc0FycmF5KHN0cnNbMF0pXG4gICAgPyBzdHJzWzBdIDogc3RycztcbiAgcmV0dXJuIHNhZmVLZXkoam9pbihwYXJhbXNPckFycmF5LCBrZXlTZXApKTtcbn07XG5leHBvcnQgY29uc3Qgc3BsaXRLZXkgPSAkJCh0cmltS2V5U2VwLCBzcGxpdEJ5S2V5U2VwKTtcbmV4cG9ydCBjb25zdCBnZXREaXJGb21LZXkgPSAkJChzcGxpdEtleSwgZHJvcFJpZ2h0LCBwID0+IGpvaW5LZXkoLi4ucCkpO1xuZXhwb3J0IGNvbnN0IGdldEZpbGVGcm9tS2V5ID0gJCQoc3BsaXRLZXksIHRha2VSaWdodCwgaGVhZCk7XG5cbmV4cG9ydCBjb25zdCBjb25maWdGb2xkZXIgPSBgJHtrZXlTZXB9LmNvbmZpZ2A7XG5leHBvcnQgY29uc3QgZmllbGREZWZpbml0aW9ucyA9IGpvaW5LZXkoY29uZmlnRm9sZGVyLCAnZmllbGRzLmpzb24nKTtcbmV4cG9ydCBjb25zdCB0ZW1wbGF0ZURlZmluaXRpb25zID0gam9pbktleShjb25maWdGb2xkZXIsICd0ZW1wbGF0ZXMuanNvbicpO1xuZXhwb3J0IGNvbnN0IGFwcERlZmluaXRpb25GaWxlID0gam9pbktleShjb25maWdGb2xkZXIsICdhcHBEZWZpbml0aW9uLmpzb24nKTtcbmV4cG9ydCBjb25zdCBkaXJJbmRleCA9IGZvbGRlclBhdGggPT4gam9pbktleShjb25maWdGb2xkZXIsICdkaXInLCAuLi5zcGxpdEtleShmb2xkZXJQYXRoKSwgJ2Rpci5pZHgnKTtcbmV4cG9ydCBjb25zdCBnZXRJbmRleEtleUZyb21GaWxlS2V5ID0gJCQoZ2V0RGlyRm9tS2V5LCBkaXJJbmRleCk7XG5cbmV4cG9ydCBjb25zdCBpZkV4aXN0cyA9ICh2YWwsIGV4aXN0cywgbm90RXhpc3RzKSA9PiAoaXNVbmRlZmluZWQodmFsKVxuICA/IGlzVW5kZWZpbmVkKG5vdEV4aXN0cykgPyAoKCkgPT4geyB9KSgpIDogbm90RXhpc3RzKClcbiAgOiBleGlzdHMoKSk7XG5cbmV4cG9ydCBjb25zdCBnZXRPckRlZmF1bHQgPSAodmFsLCBkZWZhdWx0VmFsKSA9PiBpZkV4aXN0cyh2YWwsICgpID0+IHZhbCwgKCkgPT4gZGVmYXVsdFZhbCk7XG5cbmV4cG9ydCBjb25zdCBub3QgPSBmdW5jID0+IHZhbCA9PiAhZnVuYyh2YWwpO1xuZXhwb3J0IGNvbnN0IGlzRGVmaW5lZCA9IG5vdChpc1VuZGVmaW5lZCk7XG5leHBvcnQgY29uc3QgaXNOb25OdWxsID0gbm90KGlzTnVsbCk7XG5leHBvcnQgY29uc3QgaXNOb3ROYU4gPSBub3QoaXNOYU4pO1xuXG5leHBvcnQgY29uc3QgYWxsVHJ1ZSA9ICguLi5mdW5jQXJncykgPT4gdmFsID0+IHJlZHVjZShmdW5jQXJncyxcbiAgKHJlc3VsdCwgY29uZGl0aW9uRnVuYykgPT4gKGlzTnVsbChyZXN1bHQpIHx8IHJlc3VsdCA9PSB0cnVlKSAmJiBjb25kaXRpb25GdW5jKHZhbCksXG4gIG51bGwpO1xuXG5leHBvcnQgY29uc3QgYW55VHJ1ZSA9ICguLi5mdW5jQXJncykgPT4gdmFsID0+IHJlZHVjZShmdW5jQXJncyxcbiAgKHJlc3VsdCwgY29uZGl0aW9uRnVuYykgPT4gcmVzdWx0ID09IHRydWUgfHwgY29uZGl0aW9uRnVuYyh2YWwpLFxuICBudWxsKTtcblxuZXhwb3J0IGNvbnN0IGluc2Vuc2l0aXZlRXF1YWxzID0gKHN0cjEsIHN0cjIpID0+IHN0cjEudHJpbSgpLnRvTG93ZXJDYXNlKCkgPT09IHN0cjIudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG5cbmV4cG9ydCBjb25zdCBpc1NvbWV0aGluZyA9IGFsbFRydWUoaXNEZWZpbmVkLCBpc05vbk51bGwsIGlzTm90TmFOKTtcbmV4cG9ydCBjb25zdCBpc05vdGhpbmcgPSBub3QoaXNTb21ldGhpbmcpO1xuZXhwb3J0IGNvbnN0IGlzTm90aGluZ09yRW1wdHkgPSB2ID0+IGlzTm90aGluZyh2KSB8fCBpc0VtcHR5KHYpO1xuZXhwb3J0IGNvbnN0IHNvbWV0aGluZ09yR2V0RGVmYXVsdCA9IGdldERlZmF1bHRGdW5jID0+IHZhbCA9PiAoaXNTb21ldGhpbmcodmFsKSA/IHZhbCA6IGdldERlZmF1bHRGdW5jKCkpO1xuZXhwb3J0IGNvbnN0IHNvbWV0aGluZ09yRGVmYXVsdCA9ICh2YWwsIGRlZmF1bHRWYWwpID0+IHNvbWV0aGluZ09yR2V0RGVmYXVsdChjb25zdGFudChkZWZhdWx0VmFsKSkodmFsKTtcblxuZXhwb3J0IGNvbnN0IG1hcElmU29tZXRoaW5nT3JEZWZhdWx0ID0gKG1hcEZ1bmMsIGRlZmF1bHRWYWwpID0+IHZhbCA9PiAoaXNTb21ldGhpbmcodmFsKSA/IG1hcEZ1bmModmFsKSA6IGRlZmF1bHRWYWwpO1xuXG5leHBvcnQgY29uc3QgbWFwSWZTb21ldGhpbmdPckJsYW5rID0gbWFwRnVuYyA9PiBtYXBJZlNvbWV0aGluZ09yRGVmYXVsdChtYXBGdW5jLCAnJyk7XG5cbmV4cG9ydCBjb25zdCBub25lID0gcHJlZGljYXRlID0+IGNvbGxlY3Rpb24gPT4gIXNvbWUocHJlZGljYXRlKShjb2xsZWN0aW9uKTtcblxuZXhwb3J0IGNvbnN0IGFsbCA9IHByZWRpY2F0ZSA9PiBjb2xsZWN0aW9uID0+IG5vbmUodiA9PiAhcHJlZGljYXRlKHYpKShjb2xsZWN0aW9uKTtcblxuZXhwb3J0IGNvbnN0IGlzTm90RW1wdHkgPSBvYiA9PiAhaXNFbXB0eShvYik7XG5leHBvcnQgY29uc3QgaXNBc3luYyA9IGZuID0+IGZuLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdBc3luY0Z1bmN0aW9uJztcbmV4cG9ydCBjb25zdCBpc05vbkVtcHR5QXJyYXkgPSBhbGxUcnVlKGlzQXJyYXksIGlzTm90RW1wdHkpO1xuZXhwb3J0IGNvbnN0IGlzTm9uRW1wdHlTdHJpbmcgPSBhbGxUcnVlKGlzU3RyaW5nLCBpc05vdEVtcHR5KTtcbmV4cG9ydCBjb25zdCB0cnlPciA9IGZhaWxGdW5jID0+IChmdW5jLCAuLi5hcmdzKSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZ1bmMuYXBwbHkobnVsbCwgLi4uYXJncyk7XG4gIH0gY2F0Y2ggKF8pIHtcbiAgICByZXR1cm4gZmFpbEZ1bmMoKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHRyeUF3YWl0T3IgPSBmYWlsRnVuYyA9PiBhc3luYyAoZnVuYywgLi4uYXJncykgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCBmdW5jLmFwcGx5KG51bGwsIC4uLmFyZ3MpO1xuICB9IGNhdGNoIChfKSB7XG4gICAgcmV0dXJuIGF3YWl0IGZhaWxGdW5jKCk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBkZWZpbmVFcnJvciA9IChmdW5jLCBlcnJvclByZWZpeCkgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBmdW5jKCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGVyci5tZXNzYWdlID0gYCR7ZXJyb3JQcmVmaXh9IDogJHtlcnIubWVzc2FnZX1gO1xuICAgIHRocm93IGVycjtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHRyeU9ySWdub3JlID0gdHJ5T3IoKCkgPT4geyB9KTtcbmV4cG9ydCBjb25zdCB0cnlBd2FpdE9ySWdub3JlID0gdHJ5QXdhaXRPcihhc3luYyAoKSA9PiB7IH0pO1xuZXhwb3J0IGNvbnN0IGNhdXNlc0V4Y2VwdGlvbiA9IChmdW5jKSA9PiB7XG4gIHRyeSB7XG4gICAgZnVuYygpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uID0gZnVuYyA9PiAhY2F1c2VzRXhjZXB0aW9uKGZ1bmMpO1xuXG5leHBvcnQgY29uc3QgaGFuZGxlRXJyb3JXaXRoID0gcmV0dXJuVmFsSW5FcnJvciA9PiB0cnlPcihjb25zdGFudChyZXR1cm5WYWxJbkVycm9yKSk7XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVFcnJvcldpdGhVbmRlZmluZWQgPSBoYW5kbGVFcnJvcldpdGgodW5kZWZpbmVkKTtcblxuZXhwb3J0IGNvbnN0IHN3aXRjaENhc2UgPSAoLi4uY2FzZXMpID0+ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBuZXh0Q2FzZSA9ICgpID0+IGhlYWQoY2FzZXMpWzBdKHZhbHVlKTtcbiAgY29uc3QgbmV4dFJlc3VsdCA9ICgpID0+IGhlYWQoY2FzZXMpWzFdKHZhbHVlKTtcblxuICBpZiAoaXNFbXB0eShjYXNlcykpIHJldHVybjsgLy8gdW5kZWZpbmVkXG4gIGlmIChuZXh0Q2FzZSgpID09PSB0cnVlKSByZXR1cm4gbmV4dFJlc3VsdCgpO1xuICByZXR1cm4gc3dpdGNoQ2FzZSguLi50YWlsKGNhc2VzKSkodmFsdWUpO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzVmFsdWUgPSB2YWwxID0+IHZhbDIgPT4gKHZhbDEgPT09IHZhbDIpO1xuZXhwb3J0IGNvbnN0IGlzT25lT2YgPSAoLi4udmFscykgPT4gdmFsID0+IGluY2x1ZGVzKHZhbHMsIHZhbCk7XG5leHBvcnQgY29uc3QgZGVmYXVsdENhc2UgPSBjb25zdGFudCh0cnVlKTtcbmV4cG9ydCBjb25zdCBtZW1iZXJNYXRjaGVzID0gKG1lbWJlciwgbWF0Y2gpID0+IG9iaiA9PiBtYXRjaChvYmpbbWVtYmVyXSk7XG5cblxuZXhwb3J0IGNvbnN0IFN0YXJ0c1dpdGggPSBzZWFyY2hGb3IgPT4gc2VhcmNoSW4gPT4gc3RhcnRzV2l0aChzZWFyY2hJbiwgc2VhcmNoRm9yKTtcblxuZXhwb3J0IGNvbnN0IGNvbnRhaW5zID0gdmFsID0+IGFycmF5ID0+IChmaW5kSW5kZXgoYXJyYXksIHYgPT4gdiA9PT0gdmFsKSA+IC0xKTtcblxuZXhwb3J0IGNvbnN0IGdldEhhc2hDb2RlID0gKHMpID0+IHtcbiAgbGV0IGhhc2ggPSAwOyBsZXQgaTsgbGV0IGNoYXI7IGxldFxuICAgIGw7XG4gIGlmIChzLmxlbmd0aCA9PSAwKSByZXR1cm4gaGFzaDtcbiAgZm9yIChpID0gMCwgbCA9IHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY2hhciA9IHMuY2hhckNvZGVBdChpKTtcbiAgICBoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjaGFyO1xuICAgIGhhc2ggfD0gMDsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gIH1cblxuICAvLyBjb252ZXJ0aW5nIHRvIHN0cmluZywgYnV0IGRvbnQgd2FudCBhIFwiLVwiIHByZWZpeGVkXG4gIGlmIChoYXNoIDwgMCkgeyByZXR1cm4gYG4keyhoYXNoICogLTEpLnRvU3RyaW5nKCl9YDsgfVxuICByZXR1cm4gaGFzaC50b1N0cmluZygpO1xufTtcblxuLy8gdGhhbmtzIHRvIGh0dHBzOi8vYmxvZy5ncm9zc21hbi5pby9ob3ctdG8td3JpdGUtYXN5bmMtYXdhaXQtd2l0aG91dC10cnktY2F0Y2gtYmxvY2tzLWluLWphdmFzY3JpcHQvXG5leHBvcnQgY29uc3QgYXdFeCA9IGFzeW5jIChwcm9taXNlKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcHJvbWlzZTtcbiAgICByZXR1cm4gW3VuZGVmaW5lZCwgcmVzdWx0XTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gW2Vycm9yLCB1bmRlZmluZWRdO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgaXNTYWZlSW50ZWdlciA9IG4gPT4gaXNJbnRlZ2VyKG4pXG4gICAgJiYgbiA8PSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxuICAgICYmIG4gPj0gMCAtIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuXG5leHBvcnQgY29uc3QgdG9EYXRlT3JOdWxsID0gcyA9PiAoaXNOdWxsKHMpID8gbnVsbFxuICA6IGlzRGF0ZShzKSA/IHMgOiBuZXcgRGF0ZShzKSk7XG5leHBvcnQgY29uc3QgdG9Cb29sT3JOdWxsID0gcyA9PiAoaXNOdWxsKHMpID8gbnVsbFxuICA6IHMgPT09ICd0cnVlJyB8fCBzID09PSB0cnVlKTtcbmV4cG9ydCBjb25zdCB0b051bWJlck9yTnVsbCA9IHMgPT4gKGlzTnVsbChzKSA/IG51bGxcbiAgOiB0b051bWJlcihzKSk7XG5cbmV4cG9ydCBjb25zdCBpc0FycmF5T2ZTdHJpbmcgPSBvcHRzID0+IGlzQXJyYXkob3B0cykgJiYgYWxsKGlzU3RyaW5nKShvcHRzKTtcblxuZXhwb3J0IGNvbnN0IHBhdXNlID0gYXN5bmMgZHVyYXRpb24gPT4gbmV3IFByb21pc2UocmVzID0+IHNldFRpbWVvdXQocmVzLCBkdXJhdGlvbikpO1xuXG5leHBvcnQgY29uc3QgcmV0cnkgPSBhc3luYyAoZm4sIHJldHJpZXMsIGRlbGF5LCAuLi5hcmdzKSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGZuKC4uLmFyZ3MpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAocmV0cmllcyA+IDEpIHtcbiAgICAgIHJldHVybiBhd2FpdCBwYXVzZShkZWxheSkudGhlbihhc3luYyAoKSA9PiBhd2FpdCByZXRyeShmbiwgKHJldHJpZXMgLSAxKSwgZGVsYXksIC4uLmFyZ3MpKTtcbiAgICB9XG4gICAgdGhyb3cgZXJyO1xuICB9XG59O1xuXG5leHBvcnQgeyBldmVudHMgfSBmcm9tICcuL2V2ZW50cyc7XG5leHBvcnQgeyBhcGlXcmFwcGVyLCBhcGlXcmFwcGVyU3luYyB9IGZyb20gJy4vYXBpV3JhcHBlcic7XG5leHBvcnQge1xuICBnZXRMb2NrLCBOT19MT0NLLCByZWxlYXNlTG9jayxcbiAgZXh0ZW5kTG9jaywgaXNOb2xvY2ssXG59IGZyb20gJy4vbG9jayc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaWZFeGlzdHMsXG4gIGdldE9yRGVmYXVsdCxcbiAgaXNEZWZpbmVkLFxuICBpc05vbk51bGwsXG4gIGlzTm90TmFOLFxuICBhbGxUcnVlLFxuICBpc1NvbWV0aGluZyxcbiAgbWFwSWZTb21ldGhpbmdPckRlZmF1bHQsXG4gIG1hcElmU29tZXRoaW5nT3JCbGFuayxcbiAgY29uZmlnRm9sZGVyLFxuICBmaWVsZERlZmluaXRpb25zLFxuICBpc05vdGhpbmcsXG4gIG5vdCxcbiAgc3dpdGNoQ2FzZSxcbiAgZGVmYXVsdENhc2UsXG4gIFN0YXJ0c1dpdGgsXG4gIGNvbnRhaW5zLFxuICB0ZW1wbGF0ZURlZmluaXRpb25zLFxuICBoYW5kbGVFcnJvcldpdGgsXG4gIGhhbmRsZUVycm9yV2l0aFVuZGVmaW5lZCxcbiAgdHJ5T3IsXG4gIHRyeU9ySWdub3JlLFxuICB0cnlBd2FpdE9yLFxuICB0cnlBd2FpdE9ySWdub3JlLFxuICBkaXJJbmRleCxcbiAga2V5U2VwLFxuICAkLFxuICAkJCxcbiAgZ2V0RGlyRm9tS2V5LFxuICBnZXRGaWxlRnJvbUtleSxcbiAgc3BsaXRLZXksXG4gIHNvbWV0aGluZ09yRGVmYXVsdCxcbiAgZ2V0SW5kZXhLZXlGcm9tRmlsZUtleSxcbiAgam9pbktleSxcbiAgc29tZXRoaW5nT3JHZXREZWZhdWx0LFxuICBhcHBEZWZpbml0aW9uRmlsZSxcbiAgaXNWYWx1ZSxcbiAgYWxsLFxuICBpc09uZU9mLFxuICBtZW1iZXJNYXRjaGVzLFxuICBkZWZpbmVFcnJvcixcbiAgYW55VHJ1ZSxcbiAgaXNOb25FbXB0eUFycmF5LFxuICBjYXVzZXNFeGNlcHRpb24sXG4gIGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbixcbiAgbm9uZSxcbiAgZ2V0SGFzaENvZGUsXG4gIGF3RXgsXG4gIGFwaVdyYXBwZXIsXG4gIGV2ZW50cyxcbiAgZXZlbnRzTGlzdCxcbiAgaXNOb3RoaW5nT3JFbXB0eSxcbiAgaXNTYWZlSW50ZWdlcixcbiAgdG9OdW1iZXIsXG4gIHRvRGF0ZTogdG9EYXRlT3JOdWxsLFxuICB0b0Jvb2w6IHRvQm9vbE9yTnVsbCxcbiAgaXNBcnJheU9mU3RyaW5nLFxuICBnZXRMb2NrLFxuICBOT19MT0NLLFxuICBpc05vbG9jayxcbiAgaW5zZW5zaXRpdmVFcXVhbHMsXG4gIHBhdXNlLFxuICByZXRyeSxcbn07XG4iLCJpbXBvcnQgeyBmaWx0ZXIsIG1hcCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyAkLCBpc1NvbWV0aGluZyB9IGZyb20gJy4vaW5kZXgnO1xuXG5leHBvcnQgY29uc3Qgc3RyaW5nTm90RW1wdHkgPSBzID0+IGlzU29tZXRoaW5nKHMpICYmIHMudHJpbSgpLmxlbmd0aCA+IDA7XG5cbmV4cG9ydCBjb25zdCBtYWtlcnVsZSA9IChmaWVsZCwgZXJyb3IsIGlzVmFsaWQpID0+ICh7IGZpZWxkLCBlcnJvciwgaXNWYWxpZCB9KTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRpb25FcnJvciA9IChydWxlLCBpdGVtKSA9PiAoeyAuLi5ydWxlLCBpdGVtIH0pO1xuXG5leHBvcnQgY29uc3QgYXBwbHlSdWxlU2V0ID0gcnVsZVNldCA9PiBpdGVtVG9WYWxpZGF0ZSA9PiAkKHJ1bGVTZXQsIFtcbiAgbWFwKGFwcGx5UnVsZShpdGVtVG9WYWxpZGF0ZSkpLFxuICBmaWx0ZXIoaXNTb21ldGhpbmcpLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBhcHBseVJ1bGUgPSBpdGVtVG92YWxpZGF0ZSA9PiBydWxlID0+IChydWxlLmlzVmFsaWQoaXRlbVRvdmFsaWRhdGUpXG4gID8gbnVsbFxuICA6IHZhbGlkYXRpb25FcnJvcihydWxlLCBpdGVtVG92YWxpZGF0ZSkpO1xuIiwiaW1wb3J0IHsgY29tcGlsZUV4cHJlc3Npb24sIGNvbXBpbGVDb2RlIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xuaW1wb3J0IHtcbiAgaXNVbmRlZmluZWQsIGtleXMsIFxuICBjbG9uZURlZXAsIGlzRnVuY3Rpb24sXG59IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBkZWZpbmVFcnJvciB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBmaWx0ZXJFdmFsID0gJ0ZJTFRFUl9FVkFMVUFURSc7XG5leHBvcnQgY29uc3QgZmlsdGVyQ29tcGlsZSA9ICdGSUxURVJfQ09NUElMRSc7XG5leHBvcnQgY29uc3QgbWFwRXZhbCA9ICdNQVBfRVZBTFVBVEUnO1xuZXhwb3J0IGNvbnN0IG1hcENvbXBpbGUgPSAnTUFQX0NPTVBJTEUnO1xuZXhwb3J0IGNvbnN0IHJlbW92ZVVuZGVjbGFyZWRGaWVsZHMgPSAnUkVNT1ZFX1VOREVDTEFSRURfRklFTERTJztcbmV4cG9ydCBjb25zdCBhZGRVbk1hcHBlZEZpZWxkcyA9ICdBRERfVU5NQVBQRURfRklFTERTJztcbmV4cG9ydCBjb25zdCBhZGRUaGVLZXkgPSAnQUREX0tFWSc7XG5cblxuY29uc3QgZ2V0RXZhbHVhdGVSZXN1bHQgPSAoKSA9PiAoe1xuICBpc0Vycm9yOiBmYWxzZSxcbiAgcGFzc2VkRmlsdGVyOiB0cnVlLFxuICByZXN1bHQ6IG51bGwsXG59KTtcblxuZXhwb3J0IGNvbnN0IGNvbXBpbGVGaWx0ZXIgPSBpbmRleCA9PiBjb21waWxlRXhwcmVzc2lvbihpbmRleC5maWx0ZXIpO1xuXG5leHBvcnQgY29uc3QgY29tcGlsZU1hcCA9IGluZGV4ID0+IGNvbXBpbGVDb2RlKGluZGV4Lm1hcCk7XG5cbmV4cG9ydCBjb25zdCBwYXNzZXNGaWx0ZXIgPSAocmVjb3JkLCBpbmRleCkgPT4ge1xuICBjb25zdCBjb250ZXh0ID0geyByZWNvcmQgfTtcbiAgaWYgKCFpbmRleC5maWx0ZXIpIHJldHVybiB0cnVlO1xuXG4gIGNvbnN0IGNvbXBpbGVkRmlsdGVyID0gZGVmaW5lRXJyb3IoXG4gICAgKCkgPT4gY29tcGlsZUZpbHRlcihpbmRleCksXG4gICAgZmlsdGVyQ29tcGlsZSxcbiAgKTtcblxuICByZXR1cm4gZGVmaW5lRXJyb3IoXG4gICAgKCkgPT4gY29tcGlsZWRGaWx0ZXIoY29udGV4dCksXG4gICAgZmlsdGVyRXZhbCxcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBtYXBSZWNvcmQgPSAocmVjb3JkLCBpbmRleCkgPT4ge1xuICBjb25zdCByZWNvcmRDbG9uZSA9IGNsb25lRGVlcChyZWNvcmQpO1xuICBjb25zdCBjb250ZXh0ID0geyByZWNvcmQ6IHJlY29yZENsb25lIH07XG5cbiAgY29uc3QgbWFwID0gaW5kZXgubWFwID8gaW5kZXgubWFwIDogJ3JldHVybiB7Li4ucmVjb3JkfTsnO1xuXG4gIGNvbnN0IGNvbXBpbGVkTWFwID0gZGVmaW5lRXJyb3IoXG4gICAgKCkgPT4gY29tcGlsZUNvZGUobWFwKSxcbiAgICBtYXBDb21waWxlLFxuICApO1xuXG4gIGNvbnN0IG1hcHBlZCA9IGRlZmluZUVycm9yKFxuICAgICgpID0+IGNvbXBpbGVkTWFwKGNvbnRleHQpLFxuICAgIG1hcEV2YWwsXG4gICk7XG5cbiAgY29uc3QgbWFwcGVkS2V5cyA9IGtleXMobWFwcGVkKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXBwZWRLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qga2V5ID0gbWFwcGVkS2V5c1tpXTtcbiAgICBtYXBwZWRba2V5XSA9IGlzVW5kZWZpbmVkKG1hcHBlZFtrZXldKSA/IG51bGwgOiBtYXBwZWRba2V5XTtcbiAgICBpZiAoaXNGdW5jdGlvbihtYXBwZWRba2V5XSkpIHtcbiAgICAgIGRlbGV0ZSBtYXBwZWRba2V5XTtcbiAgICB9XG4gIH1cblxuICBtYXBwZWQua2V5ID0gcmVjb3JkLmtleTtcbiAgbWFwcGVkLnNvcnRLZXkgPSBpbmRleC5nZXRTb3J0S2V5XG4gICAgPyBjb21waWxlQ29kZShpbmRleC5nZXRTb3J0S2V5KShjb250ZXh0KVxuICAgIDogcmVjb3JkLmlkO1xuXG4gIHJldHVybiBtYXBwZWQ7XG59O1xuXG5leHBvcnQgY29uc3QgZXZhbHVhdGUgPSByZWNvcmQgPT4gKGluZGV4KSA9PiB7XG4gIGNvbnN0IHJlc3VsdCA9IGdldEV2YWx1YXRlUmVzdWx0KCk7XG5cbiAgdHJ5IHtcbiAgICByZXN1bHQucGFzc2VkRmlsdGVyID0gcGFzc2VzRmlsdGVyKHJlY29yZCwgaW5kZXgpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXN1bHQuaXNFcnJvciA9IHRydWU7XG4gICAgcmVzdWx0LnBhc3NlZEZpbHRlciA9IGZhbHNlO1xuICAgIHJlc3VsdC5yZXN1bHQgPSBlcnIubWVzc2FnZTtcbiAgfVxuXG4gIGlmICghcmVzdWx0LnBhc3NlZEZpbHRlcikgcmV0dXJuIHJlc3VsdDtcblxuICB0cnkge1xuICAgIHJlc3VsdC5yZXN1bHQgPSBtYXBSZWNvcmQocmVjb3JkLCBpbmRleCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJlc3VsdC5pc0Vycm9yID0gdHJ1ZTtcbiAgICByZXN1bHQucmVzdWx0ID0gZXJyLm1lc3NhZ2U7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZXZhbHVhdGU7XG4iLCJpbXBvcnQge1xuICBtYXAsIGlzRW1wdHksIGNvdW50QnksIGZsYXR0ZW4sIGluY2x1ZGVzLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgam9pbiwga2V5cyB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHsgY29tcGlsZUZpbHRlciwgY29tcGlsZU1hcCB9IGZyb20gJy4uL2luZGV4aW5nL2V2YWx1YXRlJztcbmltcG9ydCB7IGlzTm9uRW1wdHlTdHJpbmcsIGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbiwgJCB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBpc1JlY29yZCB9IGZyb20gJy4vaGllcmFyY2h5JztcblxuZXhwb3J0IGNvbnN0IGluZGV4VHlwZXMgPSB7IHJlZmVyZW5jZTogJ3JlZmVyZW5jZScsIGFuY2VzdG9yOiAnYW5jZXN0b3InIH07XG5cbmV4cG9ydCBjb25zdCBpbmRleFJ1bGVTZXQgPSBbXG4gIG1ha2VydWxlKCdtYXAnLCAnaW5kZXggaGFzIG5vIG1hcCBmdW5jdGlvbicsXG4gICAgaW5kZXggPT4gaXNOb25FbXB0eVN0cmluZyhpbmRleC5tYXApKSxcbiAgbWFrZXJ1bGUoJ21hcCcsIFwiaW5kZXgncyBtYXAgZnVuY3Rpb24gZG9lcyBub3QgY29tcGlsZVwiLFxuICAgIGluZGV4ID0+ICFpc05vbkVtcHR5U3RyaW5nKGluZGV4Lm1hcClcbiAgICAgICAgICAgICAgICB8fCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24oKCkgPT4gY29tcGlsZU1hcChpbmRleCkpKSxcbiAgbWFrZXJ1bGUoJ2ZpbHRlcicsIFwiaW5kZXgncyBmaWx0ZXIgZnVuY3Rpb24gZG9lcyBub3QgY29tcGlsZVwiLFxuICAgIGluZGV4ID0+ICFpc05vbkVtcHR5U3RyaW5nKGluZGV4LmZpbHRlcilcbiAgICAgICAgICAgICAgICB8fCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24oKCkgPT4gY29tcGlsZUZpbHRlcihpbmRleCkpKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnbXVzdCBkZWNsYXJlIGEgbmFtZSBmb3IgaW5kZXgnLFxuICAgIGluZGV4ID0+IGlzTm9uRW1wdHlTdHJpbmcoaW5kZXgubmFtZSkpLFxuICBtYWtlcnVsZSgnbmFtZScsICd0aGVyZSBpcyBhIGR1cGxpY2F0ZSBuYW1lZCBpbmRleCBvbiB0aGlzIG5vZGUnLFxuICAgIGluZGV4ID0+IGlzRW1wdHkoaW5kZXgubmFtZSlcbiAgICAgICAgICAgICAgICB8fCBjb3VudEJ5KCduYW1lJykoaW5kZXgucGFyZW50KCkuaW5kZXhlcylbaW5kZXgubmFtZV0gPT09IDEpLFxuICBtYWtlcnVsZSgnaW5kZXhUeXBlJywgJ3JlZmVyZW5jZSBpbmRleCBtYXkgb25seSBleGlzdCBvbiBhIHJlY29yZCBub2RlJyxcbiAgICBpbmRleCA9PiBpc1JlY29yZChpbmRleC5wYXJlbnQoKSlcbiAgICAgICAgICAgICAgICAgIHx8IGluZGV4LmluZGV4VHlwZSAhPT0gaW5kZXhUeXBlcy5yZWZlcmVuY2UpLFxuICBtYWtlcnVsZSgnaW5kZXhUeXBlJywgYGluZGV4IHR5cGUgbXVzdCBiZSBvbmUgb2Y6ICR7am9pbignLCAnLCBrZXlzKGluZGV4VHlwZXMpKX1gLFxuICAgIGluZGV4ID0+IGluY2x1ZGVzKGluZGV4LmluZGV4VHlwZSkoa2V5cyhpbmRleFR5cGVzKSkpLFxuXTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlSW5kZXggPSAoaW5kZXgsIGFsbFJlZmVyZW5jZUluZGV4ZXNPbk5vZGUpID0+IGFwcGx5UnVsZVNldChpbmRleFJ1bGVTZXQoYWxsUmVmZXJlbmNlSW5kZXhlc09uTm9kZSkpKGluZGV4KTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWxsSW5kZXhlcyA9IG5vZGUgPT4gJChub2RlLmluZGV4ZXMsIFtcbiAgbWFwKGkgPT4gdmFsaWRhdGVJbmRleChpLCBub2RlLmluZGV4ZXMpKSxcbiAgZmxhdHRlbixcbl0pO1xuIiwiaW1wb3J0IHtcbiAgZmluZCwgY29uc3RhbnQsIG1hcCwgbGFzdCxcbiAgZmlyc3QsIHNwbGl0LCBpbnRlcnNlY3Rpb24sIHRha2UsXG4gIHVuaW9uLCBpbmNsdWRlcywgZmlsdGVyLCBzb21lLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgJCwgc3dpdGNoQ2FzZSwgaXNOb3RoaW5nLCBpc1NvbWV0aGluZyxcbiAgZGVmYXVsdENhc2UsIHNwbGl0S2V5LCBpc05vbkVtcHR5U3RyaW5nLFxuICBqb2luS2V5LCBnZXRIYXNoQ29kZSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGluZGV4VHlwZXMgfSBmcm9tICcuL2luZGV4ZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0RmxhdHRlbmVkSGllcmFyY2h5ID0gKGFwcEhpZXJhcmNoeSwgdXNlQ2FjaGVkID0gdHJ1ZSkgPT4ge1xuICBpZiAoaXNTb21ldGhpbmcoYXBwSGllcmFyY2h5LmdldEZsYXR0ZW5lZEhpZXJhcmNoeSkgJiYgdXNlQ2FjaGVkKSB7IHJldHVybiBhcHBIaWVyYXJjaHkuZ2V0RmxhdHRlbmVkSGllcmFyY2h5KCk7IH1cblxuICBjb25zdCBmbGF0dGVuSGllcmFyY2h5ID0gKGN1cnJlbnROb2RlLCBmbGF0dGVuZWQpID0+IHtcbiAgICBmbGF0dGVuZWQucHVzaChjdXJyZW50Tm9kZSk7XG4gICAgaWYgKCghY3VycmVudE5vZGUuY2hpbGRyZW5cbiAgICAgICAgICAgIHx8IGN1cnJlbnROb2RlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICYmICghY3VycmVudE5vZGUuaW5kZXhlc1xuICAgICAgICAgICAgfHwgY3VycmVudE5vZGUuaW5kZXhlcy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAmJiAoIWN1cnJlbnROb2RlLmFnZ3JlZ2F0ZUdyb3Vwc1xuICAgICAgICAgICAgfHwgY3VycmVudE5vZGUuYWdncmVnYXRlR3JvdXBzLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgIHJldHVybiBmbGF0dGVuZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgdW5pb25JZkFueSA9IGwyID0+IGwxID0+IHVuaW9uKGwxKSghbDIgPyBbXSA6IGwyKTtcblxuICAgIGNvbnN0IGNoaWxkcmVuID0gJChbXSwgW1xuICAgICAgdW5pb25JZkFueShjdXJyZW50Tm9kZS5jaGlsZHJlbiksXG4gICAgICB1bmlvbklmQW55KGN1cnJlbnROb2RlLmluZGV4ZXMpLFxuICAgICAgdW5pb25JZkFueShjdXJyZW50Tm9kZS5hZ2dyZWdhdGVHcm91cHMpLFxuICAgIF0pO1xuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgZmxhdHRlbkhpZXJhcmNoeShjaGlsZCwgZmxhdHRlbmVkKTtcbiAgICB9XG4gICAgcmV0dXJuIGZsYXR0ZW5lZDtcbiAgfTtcblxuICBhcHBIaWVyYXJjaHkuZ2V0RmxhdHRlbmVkSGllcmFyY2h5ID0gKCkgPT4gZmxhdHRlbkhpZXJhcmNoeShhcHBIaWVyYXJjaHksIFtdKTtcbiAgcmV0dXJuIGFwcEhpZXJhcmNoeS5nZXRGbGF0dGVuZWRIaWVyYXJjaHkoKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRMYXN0UGFydEluS2V5ID0ga2V5ID0+IGxhc3Qoc3BsaXRLZXkoa2V5KSk7XG5cbmV4cG9ydCBjb25zdCBnZXROb2Rlc0luUGF0aCA9IGFwcEhpZXJhcmNoeSA9PiBrZXkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaWx0ZXIobiA9PiBuZXcgUmVnRXhwKGAke24ucGF0aFJlZ3goKX1gKS50ZXN0KGtleSkpLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBnZXRFeGFjdE5vZGVGb3JQYXRoID0gYXBwSGllcmFyY2h5ID0+IGtleSA9PiAkKGFwcEhpZXJhcmNoeSwgW1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGZpbmQobiA9PiBuZXcgUmVnRXhwKGAke24ucGF0aFJlZ3goKX0kYCkudGVzdChrZXkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoID0gYXBwSGllcmFyY2h5ID0+IGNvbGxlY3Rpb25LZXkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gKGlzQ29sbGVjdGlvblJlY29yZChuKVxuICAgICAgICAgICAgICAgICAgICYmIG5ldyBSZWdFeHAoYCR7bi5jb2xsZWN0aW9uUGF0aFJlZ3goKX0kYCkudGVzdChjb2xsZWN0aW9uS2V5KSkpLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBoYXNNYXRjaGluZ0FuY2VzdG9yID0gYW5jZXN0b3JQcmVkaWNhdGUgPT4gZGVjZW5kYW50Tm9kZSA9PiBzd2l0Y2hDYXNlKFxuXG4gIFtub2RlID0+IGlzTm90aGluZyhub2RlLnBhcmVudCgpKSxcbiAgICBjb25zdGFudChmYWxzZSldLFxuXG4gIFtub2RlID0+IGFuY2VzdG9yUHJlZGljYXRlKG5vZGUucGFyZW50KCkpLFxuICAgIGNvbnN0YW50KHRydWUpXSxcblxuICBbZGVmYXVsdENhc2UsXG4gICAgbm9kZSA9PiBoYXNNYXRjaGluZ0FuY2VzdG9yKGFuY2VzdG9yUHJlZGljYXRlKShub2RlLnBhcmVudCgpKV0sXG5cbikoZGVjZW5kYW50Tm9kZSk7XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlID0gKGFwcEhpZXJhcmNoeSwgbm9kZUtleSkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gbi5ub2RlS2V5KCkgPT09IG5vZGVLZXlcbiAgICAgICAgICAgICAgICAgIHx8IChpc0NvbGxlY3Rpb25SZWNvcmQobilcbiAgICAgICAgICAgICAgICAgICAgICAmJiBuLmNvbGxlY3Rpb25Ob2RlS2V5KCkgPT09IG5vZGVLZXkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0Q29sbGVjdGlvbk5vZGUgPSAoYXBwSGllcmFyY2h5LCBub2RlS2V5KSA9PiAkKGFwcEhpZXJhcmNoeSwgW1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGZpbmQobiA9PiAoaXNDb2xsZWN0aW9uUmVjb3JkKG4pXG4gICAgICAgICAgICAgICAgICAgICYmIG4uY29sbGVjdGlvbk5vZGVLZXkoKSA9PT0gbm9kZUtleSkpLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlQnlLZXlPck5vZGVLZXkgPSAoYXBwSGllcmFyY2h5LCBrZXlPck5vZGVLZXkpID0+IHtcbiAgY29uc3Qgbm9kZUJ5S2V5ID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHBIaWVyYXJjaHkpKGtleU9yTm9kZUtleSk7XG4gIHJldHVybiBpc05vdGhpbmcobm9kZUJ5S2V5KVxuICAgID8gZ2V0Tm9kZShhcHBIaWVyYXJjaHksIGtleU9yTm9kZUtleSlcbiAgICA6IG5vZGVCeUtleTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5ID0gKGFwcEhpZXJhcmNoeSwga2V5T3JOb2RlS2V5KSA9PiB7XG4gIGNvbnN0IG5vZGVCeUtleSA9IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHBIaWVyYXJjaHkpKGtleU9yTm9kZUtleSk7XG4gIHJldHVybiBpc05vdGhpbmcobm9kZUJ5S2V5KVxuICAgID8gZ2V0Q29sbGVjdGlvbk5vZGUoYXBwSGllcmFyY2h5LCBrZXlPck5vZGVLZXkpXG4gICAgOiBub2RlQnlLZXk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNOb2RlID0gKGFwcEhpZXJhcmNoeSwga2V5KSA9PiBpc1NvbWV0aGluZyhnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcEhpZXJhcmNoeSkoa2V5KSk7XG5cbmV4cG9ydCBjb25zdCBnZXRBY3R1YWxLZXlPZlBhcmVudCA9IChwYXJlbnROb2RlS2V5LCBhY3R1YWxDaGlsZEtleSkgPT4gJChhY3R1YWxDaGlsZEtleSwgW1xuICBzcGxpdEtleSxcbiAgdGFrZShzcGxpdEtleShwYXJlbnROb2RlS2V5KS5sZW5ndGgpLFxuICBrcyA9PiBqb2luS2V5KC4uLmtzKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0UGFyZW50S2V5ID0gKGtleSkgPT4ge1xuICByZXR1cm4gJChrZXksIFtcbiAgICBzcGxpdEtleSxcbiAgICB0YWtlKHNwbGl0S2V5KGtleSkubGVuZ3RoIC0gMSksXG4gICAgam9pbktleSxcbiAgXSk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNLZXlBbmNlc3Rvck9mID0gYW5jZXN0b3JLZXkgPT4gZGVjZW5kYW50Tm9kZSA9PiBoYXNNYXRjaGluZ0FuY2VzdG9yKHAgPT4gcC5ub2RlS2V5KCkgPT09IGFuY2VzdG9yS2V5KShkZWNlbmRhbnROb2RlKTtcblxuZXhwb3J0IGNvbnN0IGhhc05vTWF0Y2hpbmdBbmNlc3RvcnMgPSBwYXJlbnRQcmVkaWNhdGUgPT4gbm9kZSA9PiAhaGFzTWF0Y2hpbmdBbmNlc3RvcihwYXJlbnRQcmVkaWNhdGUpKG5vZGUpO1xuXG5leHBvcnQgY29uc3QgZmluZEZpZWxkID0gKHJlY29yZE5vZGUsIGZpZWxkTmFtZSkgPT4gZmluZChmID0+IGYubmFtZSA9PSBmaWVsZE5hbWUpKHJlY29yZE5vZGUuZmllbGRzKTtcblxuZXhwb3J0IGNvbnN0IGlzQW5jZXN0b3IgPSBkZWNlbmRhbnQgPT4gYW5jZXN0b3IgPT4gaXNLZXlBbmNlc3Rvck9mKGFuY2VzdG9yLm5vZGVLZXkoKSkoZGVjZW5kYW50KTtcblxuZXhwb3J0IGNvbnN0IGlzRGVjZW5kYW50ID0gYW5jZXN0b3IgPT4gZGVjZW5kYW50ID0+IGlzQW5jZXN0b3IoZGVjZW5kYW50KShhbmNlc3Rvcik7XG5cbmV4cG9ydCBjb25zdCBnZXRSZWNvcmROb2RlSWQgPSByZWNvcmRLZXkgPT4gJChyZWNvcmRLZXksIFtcbiAgc3BsaXRLZXksXG4gIGxhc3QsXG4gIGdldFJlY29yZE5vZGVJZEZyb21JZCxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkTm9kZUlkRnJvbUlkID0gcmVjb3JkSWQgPT4gJChyZWNvcmRJZCwgW3NwbGl0KCctJyksIGZpcnN0LCBwYXJzZUludF0pO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkTm9kZUJ5SWQgPSAoaGllcmFyY2h5LCByZWNvcmRJZCkgPT4gJChoaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gaXNSZWNvcmQobilcbiAgICAgICAgICAgICAgICAgICAgJiYgbi5ub2RlSWQgPT09IGdldFJlY29yZE5vZGVJZEZyb21JZChyZWNvcmRJZCkpLFxuXSk7XG5cbmV4cG9ydCBjb25zdCByZWNvcmROb2RlSWRJc0FsbG93ZWQgPSBpbmRleE5vZGUgPT4gbm9kZUlkID0+IGluZGV4Tm9kZS5hbGxvd2VkUmVjb3JkTm9kZUlkcy5sZW5ndGggPT09IDBcbiAgICB8fCBpbmNsdWRlcyhub2RlSWQpKGluZGV4Tm9kZS5hbGxvd2VkUmVjb3JkTm9kZUlkcyk7XG5cbmV4cG9ydCBjb25zdCByZWNvcmROb2RlSXNBbGxvd2VkID0gaW5kZXhOb2RlID0+IHJlY29yZE5vZGUgPT4gcmVjb3JkTm9kZUlkSXNBbGxvd2VkKGluZGV4Tm9kZSkocmVjb3JkTm9kZS5ub2RlSWQpO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXggPSAoYXBwSGllcmFyY2h5LCBpbmRleE5vZGUpID0+IHtcbiAgY29uc3QgcmVjb3JkTm9kZXMgPSAkKGFwcEhpZXJhcmNoeSwgW1xuICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgICBmaWx0ZXIoaXNSZWNvcmQpLFxuICBdKTtcblxuICBpZiAoaXNHbG9iYWxJbmRleChpbmRleE5vZGUpKSB7XG4gICAgcmV0dXJuICQocmVjb3JkTm9kZXMsIFtcbiAgICAgIGZpbHRlcihyZWNvcmROb2RlSXNBbGxvd2VkKGluZGV4Tm9kZSkpLFxuICAgIF0pO1xuICB9XG5cbiAgaWYgKGlzQW5jZXN0b3JJbmRleChpbmRleE5vZGUpKSB7XG4gICAgcmV0dXJuICQocmVjb3JkTm9kZXMsIFtcbiAgICAgIGZpbHRlcihpc0RlY2VuZGFudChpbmRleE5vZGUucGFyZW50KCkpKSxcbiAgICAgIGZpbHRlcihyZWNvcmROb2RlSXNBbGxvd2VkKGluZGV4Tm9kZSkpLFxuICAgIF0pO1xuICB9XG5cbiAgaWYgKGlzUmVmZXJlbmNlSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIHJldHVybiAkKHJlY29yZE5vZGVzLCBbXG4gICAgICBmaWx0ZXIobiA9PiBzb21lKGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4KGluZGV4Tm9kZSkpKG4uZmllbGRzKSksXG4gICAgXSk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlRnJvbU5vZGVLZXlIYXNoID0gaGllcmFyY2h5ID0+IGhhc2ggPT4gJChoaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gZ2V0SGFzaENvZGUobi5ub2RlS2V5KCkpID09PSBoYXNoKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgaXNSZWNvcmQgPSBub2RlID0+IGlzU29tZXRoaW5nKG5vZGUpICYmIG5vZGUudHlwZSA9PT0gJ3JlY29yZCc7XG5leHBvcnQgY29uc3QgaXNTaW5nbGVSZWNvcmQgPSBub2RlID0+IGlzUmVjb3JkKG5vZGUpICYmIG5vZGUuaXNTaW5nbGU7XG5leHBvcnQgY29uc3QgaXNDb2xsZWN0aW9uUmVjb3JkID0gbm9kZSA9PiBpc1JlY29yZChub2RlKSAmJiAhbm9kZS5pc1NpbmdsZTtcbmV4cG9ydCBjb25zdCBpc0luZGV4ID0gbm9kZSA9PiBpc1NvbWV0aGluZyhub2RlKSAmJiBub2RlLnR5cGUgPT09ICdpbmRleCc7XG5leHBvcnQgY29uc3QgaXNhZ2dyZWdhdGVHcm91cCA9IG5vZGUgPT4gaXNTb21ldGhpbmcobm9kZSkgJiYgbm9kZS50eXBlID09PSAnYWdncmVnYXRlR3JvdXAnO1xuZXhwb3J0IGNvbnN0IGlzU2hhcmRlZEluZGV4ID0gbm9kZSA9PiBpc0luZGV4KG5vZGUpICYmIGlzTm9uRW1wdHlTdHJpbmcobm9kZS5nZXRTaGFyZE5hbWUpO1xuZXhwb3J0IGNvbnN0IGlzUm9vdCA9IG5vZGUgPT4gaXNTb21ldGhpbmcobm9kZSkgJiYgbm9kZS5pc1Jvb3QoKTtcbmV4cG9ydCBjb25zdCBpc0RlY2VuZGFudE9mQVJlY29yZCA9IGhhc01hdGNoaW5nQW5jZXN0b3IoaXNSZWNvcmQpO1xuZXhwb3J0IGNvbnN0IGlzR2xvYmFsSW5kZXggPSBub2RlID0+IGlzSW5kZXgobm9kZSkgJiYgaXNSb290KG5vZGUucGFyZW50KCkpO1xuZXhwb3J0IGNvbnN0IGlzUmVmZXJlbmNlSW5kZXggPSBub2RlID0+IGlzSW5kZXgobm9kZSkgJiYgbm9kZS5pbmRleFR5cGUgPT09IGluZGV4VHlwZXMucmVmZXJlbmNlO1xuZXhwb3J0IGNvbnN0IGlzQW5jZXN0b3JJbmRleCA9IG5vZGUgPT4gaXNJbmRleChub2RlKSAmJiBub2RlLmluZGV4VHlwZSA9PT0gaW5kZXhUeXBlcy5hbmNlc3RvcjtcblxuZXhwb3J0IGNvbnN0IGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUgPSBub2RlID0+IGZpZWxkID0+IGZpZWxkLnR5cGUgPT09ICdyZWZlcmVuY2UnXG4gICAgJiYgaW50ZXJzZWN0aW9uKGZpZWxkLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzKShtYXAoaSA9PiBpLm5vZGVLZXkoKSkobm9kZS5pbmRleGVzKSlcbiAgICAgIC5sZW5ndGggPiAwO1xuXG5leHBvcnQgY29uc3QgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXggPSBpbmRleE5vZGUgPT4gZmllbGQgPT4gZmllbGQudHlwZSA9PT0gJ3JlZmVyZW5jZSdcbiAgICAmJiBpbnRlcnNlY3Rpb24oZmllbGQudHlwZU9wdGlvbnMucmV2ZXJzZUluZGV4Tm9kZUtleXMpKFtpbmRleE5vZGUubm9kZUtleSgpXSlcbiAgICAgIC5sZW5ndGggPiAwO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdldExhc3RQYXJ0SW5LZXksXG4gIGdldE5vZGVzSW5QYXRoLFxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxuICBoYXNNYXRjaGluZ0FuY2VzdG9yLFxuICBnZXROb2RlLFxuICBnZXROb2RlQnlLZXlPck5vZGVLZXksXG4gIGlzTm9kZSxcbiAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQsXG4gIGdldFBhcmVudEtleSxcbiAgaXNLZXlBbmNlc3Rvck9mLFxuICBoYXNOb01hdGNoaW5nQW5jZXN0b3JzLFxuICBmaW5kRmllbGQsXG4gIGlzQW5jZXN0b3IsXG4gIGlzRGVjZW5kYW50LFxuICBnZXRSZWNvcmROb2RlSWQsXG4gIGdldFJlY29yZE5vZGVJZEZyb21JZCxcbiAgZ2V0UmVjb3JkTm9kZUJ5SWQsXG4gIHJlY29yZE5vZGVJZElzQWxsb3dlZCxcbiAgcmVjb3JkTm9kZUlzQWxsb3dlZCxcbiAgZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgsXG4gIGdldE5vZGVGcm9tTm9kZUtleUhhc2gsXG4gIGlzUmVjb3JkLFxuICBpc0NvbGxlY3Rpb25SZWNvcmQsXG4gIGlzSW5kZXgsXG4gIGlzYWdncmVnYXRlR3JvdXAsXG4gIGlzU2hhcmRlZEluZGV4LFxuICBpc1Jvb3QsXG4gIGlzRGVjZW5kYW50T2ZBUmVjb3JkLFxuICBpc0dsb2JhbEluZGV4LFxuICBpc1JlZmVyZW5jZUluZGV4LFxuICBpc0FuY2VzdG9ySW5kZXgsXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUsXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4LFxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG59O1xuIiwiaW1wb3J0IHsgbWVyZ2UsIGhhcyB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICBjb25zdGFudCwgaXNVbmRlZmluZWQsIFxuICBtYXBWYWx1ZXMsIGNsb25lRGVlcCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGlzTm90RW1wdHkgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZ2V0U2FmZUZpZWxkUGFyc2VyID0gKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpID0+IChmaWVsZCwgcmVjb3JkKSA9PiB7XG4gIGlmIChoYXMocmVjb3JkLCBmaWVsZC5uYW1lKSkge1xuICAgIHJldHVybiBnZXRTYWZlVmFsdWVQYXJzZXIodHJ5UGFyc2UsIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucykocmVjb3JkW2ZpZWxkLm5hbWVdKTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZhbHVlRnVuY3Rpb25zW2ZpZWxkLmdldFVuZGVmaW5lZFZhbHVlXSgpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFNhZmVWYWx1ZVBhcnNlciA9ICh0cnlQYXJzZSwgZGVmYXVsdFZhbHVlRnVuY3Rpb25zKSA9PiAodmFsdWUpID0+IHtcbiAgY29uc3QgcGFyc2VkID0gdHJ5UGFyc2UodmFsdWUpO1xuICBpZiAocGFyc2VkLnN1Y2Nlc3MpIHtcbiAgICByZXR1cm4gcGFyc2VkLnZhbHVlO1xuICB9XG4gIHJldHVybiBkZWZhdWx0VmFsdWVGdW5jdGlvbnMuZGVmYXVsdCgpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld1ZhbHVlID0gKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpID0+IChmaWVsZCkgPT4ge1xuICBjb25zdCBnZXRJbml0aWFsVmFsdWUgPSBpc1VuZGVmaW5lZChmaWVsZCkgfHwgaXNVbmRlZmluZWQoZmllbGQuZ2V0SW5pdGlhbFZhbHVlKVxuICAgID8gJ2RlZmF1bHQnXG4gICAgOiBmaWVsZC5nZXRJbml0aWFsVmFsdWU7XG5cbiAgcmV0dXJuIGhhcyhkZWZhdWx0VmFsdWVGdW5jdGlvbnMsIGdldEluaXRpYWxWYWx1ZSlcbiAgICA/IGRlZmF1bHRWYWx1ZUZ1bmN0aW9uc1tnZXRJbml0aWFsVmFsdWVdKClcbiAgICA6IGdldFNhZmVWYWx1ZVBhcnNlcih0cnlQYXJzZSwgZGVmYXVsdFZhbHVlRnVuY3Rpb25zKShnZXRJbml0aWFsVmFsdWUpO1xufTtcblxuZXhwb3J0IGNvbnN0IHR5cGVGdW5jdGlvbnMgPSBzcGVjaWZpY0Z1bmN0aW9ucyA9PiBtZXJnZSh7XG4gIHZhbHVlOiBjb25zdGFudCxcbiAgbnVsbDogY29uc3RhbnQobnVsbCksXG59LCBzcGVjaWZpY0Z1bmN0aW9ucyk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyA9IHZhbGlkYXRpb25SdWxlcyA9PiBhc3luYyAoZmllbGQsIHJlY29yZCwgY29udGV4dCkgPT4ge1xuICBjb25zdCBmaWVsZFZhbHVlID0gcmVjb3JkW2ZpZWxkLm5hbWVdO1xuICBjb25zdCB2YWxpZGF0ZVJ1bGUgPSBhc3luYyByID0+ICghYXdhaXQgci5pc1ZhbGlkKGZpZWxkVmFsdWUsIGZpZWxkLnR5cGVPcHRpb25zLCBjb250ZXh0KVxuICAgID8gci5nZXRNZXNzYWdlKGZpZWxkVmFsdWUsIGZpZWxkLnR5cGVPcHRpb25zKVxuICAgIDogJycpO1xuXG4gIGNvbnN0IGVycm9ycyA9IFtdO1xuICBmb3IgKGNvbnN0IHIgb2YgdmFsaWRhdGlvblJ1bGVzKSB7XG4gICAgY29uc3QgZXJyID0gYXdhaXQgdmFsaWRhdGVSdWxlKHIpO1xuICAgIGlmIChpc05vdEVtcHR5KGVycikpIGVycm9ycy5wdXNoKGVycik7XG4gIH1cblxuICByZXR1cm4gZXJyb3JzO1xufTtcblxuY29uc3QgZ2V0RGVmYXVsdE9wdGlvbnMgPSBtYXBWYWx1ZXModiA9PiB2LmRlZmF1bHRWYWx1ZSk7XG5cbmV4cG9ydCBjb25zdCBtYWtlcnVsZSA9IChpc1ZhbGlkLCBnZXRNZXNzYWdlKSA9PiAoeyBpc1ZhbGlkLCBnZXRNZXNzYWdlIH0pO1xuZXhwb3J0IGNvbnN0IHBhcnNlZEZhaWxlZCA9IHZhbCA9PiAoeyBzdWNjZXNzOiBmYWxzZSwgdmFsdWU6IHZhbCB9KTtcbmV4cG9ydCBjb25zdCBwYXJzZWRTdWNjZXNzID0gdmFsID0+ICh7IHN1Y2Nlc3M6IHRydWUsIHZhbHVlOiB2YWwgfSk7XG5leHBvcnQgY29uc3QgZ2V0RGVmYXVsdEV4cG9ydCA9IChuYW1lLCB0cnlQYXJzZSwgZnVuY3Rpb25zLCBvcHRpb25zLCB2YWxpZGF0aW9uUnVsZXMsIHNhbXBsZVZhbHVlLCBzdHJpbmdpZnkpID0+ICh7XG4gIGdldE5ldzogZ2V0TmV3VmFsdWUodHJ5UGFyc2UsIGZ1bmN0aW9ucyksXG4gIHNhZmVQYXJzZUZpZWxkOiBnZXRTYWZlRmllbGRQYXJzZXIodHJ5UGFyc2UsIGZ1bmN0aW9ucyksXG4gIHNhZmVQYXJzZVZhbHVlOiBnZXRTYWZlVmFsdWVQYXJzZXIodHJ5UGFyc2UsIGZ1bmN0aW9ucyksXG4gIHRyeVBhcnNlLFxuICBuYW1lLFxuICBnZXREZWZhdWx0T3B0aW9uczogKCkgPT4gZ2V0RGVmYXVsdE9wdGlvbnMoY2xvbmVEZWVwKG9wdGlvbnMpKSxcbiAgb3B0aW9uRGVmaW5pdGlvbnM6IG9wdGlvbnMsXG4gIHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzOiB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyh2YWxpZGF0aW9uUnVsZXMpLFxuICBzYW1wbGVWYWx1ZSxcbiAgc3RyaW5naWZ5OiB2YWwgPT4gKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZFxuICAgID8gJycgOiBzdHJpbmdpZnkodmFsKSksXG4gIGdldERlZmF1bHRWYWx1ZTogZnVuY3Rpb25zLmRlZmF1bHQsXG59KTtcbiIsImltcG9ydCB7XG4gIGNvbnN0YW50LCBpc1N0cmluZyxcbiAgaXNOdWxsLCBpbmNsdWRlcywgaXNCb29sZWFuLFxufSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgdHlwZUZ1bmN0aW9ucyxcbiAgbWFrZXJ1bGUsIHBhcnNlZFN1Y2Nlc3MsIGdldERlZmF1bHRFeHBvcnQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIHRvQm9vbE9yTnVsbCwgdG9OdW1iZXJPck51bGwsXG4gIGlzU2FmZUludGVnZXIsIGlzQXJyYXlPZlN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3Qgc3RyaW5nRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XG4gIGRlZmF1bHQ6IGNvbnN0YW50KG51bGwpLFxufSk7XG5cbmNvbnN0IHN0cmluZ1RyeVBhcnNlID0gc3dpdGNoQ2FzZShcbiAgW2lzU3RyaW5nLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXG4gIFtkZWZhdWx0Q2FzZSwgdiA9PiBwYXJzZWRTdWNjZXNzKHYudG9TdHJpbmcoKSldLFxuKTtcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgbWF4TGVuZ3RoOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICAgIGlzVmFsaWQ6IG4gPT4gbiA9PT0gbnVsbCB8fCBpc1NhZmVJbnRlZ2VyKG4pICYmIG4gPiAwLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtYXggbGVuZ3RoIG11c3QgYmUgbnVsbCAobm8gbGltaXQpIG9yIGEgZ3JlYXRlciB0aGFuIHplcm8gaW50ZWdlcicsXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxuICB9LFxuICB2YWx1ZXM6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgaXNWYWxpZDogdiA9PiB2ID09PSBudWxsIHx8IChpc0FycmF5T2ZTdHJpbmcodikgJiYgdi5sZW5ndGggPiAwICYmIHYubGVuZ3RoIDwgMTAwMDApLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246IFwiJ3ZhbHVlcycgbXVzdCBiZSBudWxsIChubyB2YWx1ZXMpIG9yIGFuIGFycnkgb2YgYXQgbGVhc3Qgb25lIHN0cmluZ1wiLFxuICAgIHBhcnNlOiBzID0+IHMsXG4gIH0sXG4gIGFsbG93RGVjbGFyZWRWYWx1ZXNPbmx5OiB7XG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICBpc1ZhbGlkOiBpc0Jvb2xlYW4sXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ2FsbG93RGVjbGFyZWRWYWx1ZXNPbmx5IG11c3QgYmUgdHJ1ZSBvciBmYWxzZScsXG4gICAgcGFyc2U6IHRvQm9vbE9yTnVsbCxcbiAgfSxcbn07XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWF4TGVuZ3RoID09PSBudWxsIHx8IHZhbC5sZW5ndGggPD0gb3B0cy5tYXhMZW5ndGgsXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlIGV4Y2VlZHMgbWF4aW11bSBsZW5ndGggb2YgJHtvcHRzLm1heExlbmd0aH1gKSxcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBvcHRzLmFsbG93RGVjbGFyZWRWYWx1ZXNPbmx5ID09PSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgaW5jbHVkZXMob3B0cy52YWx1ZXMsIHZhbCksXG4gICh2YWwpID0+IGBcIiR7dmFsfVwiIGRvZXMgbm90IGV4aXN0IGluIHRoZSBsaXN0IG9mIGFsbG93ZWQgdmFsdWVzYCksXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxuICAnc3RyaW5nJyxcbiAgc3RyaW5nVHJ5UGFyc2UsXG4gIHN0cmluZ0Z1bmN0aW9ucyxcbiAgb3B0aW9ucyxcbiAgdHlwZUNvbnN0cmFpbnRzLFxuICAnYWJjZGUnLFxuICBzdHIgPT4gc3RyLFxuKTtcbiIsImltcG9ydCB7IGNvbnN0YW50LCBpc0Jvb2xlYW4sIGlzTnVsbCB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICB0eXBlRnVuY3Rpb25zLFxuICBtYWtlcnVsZSwgcGFyc2VkRmFpbGVkLCBwYXJzZWRTdWNjZXNzLFxuICBnZXREZWZhdWx0RXhwb3J0LFxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLCBpc09uZU9mLCB0b0Jvb2xPck51bGwsXG59IGZyb20gJy4uL2NvbW1vbic7XG5cbmNvbnN0IGJvb2xGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogY29uc3RhbnQobnVsbCksXG59KTtcblxuY29uc3QgYm9vbFRyeVBhcnNlID0gc3dpdGNoQ2FzZShcbiAgW2lzQm9vbGVhbiwgcGFyc2VkU3VjY2Vzc10sXG4gIFtpc051bGwsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNPbmVPZigndHJ1ZScsICcxJywgJ3llcycsICdvbicpLCAoKSA9PiBwYXJzZWRTdWNjZXNzKHRydWUpXSxcbiAgW2lzT25lT2YoJ2ZhbHNlJywgJzAnLCAnbm8nLCAnb2ZmJyksICgpID0+IHBhcnNlZFN1Y2Nlc3MoZmFsc2UpXSxcbiAgW2RlZmF1bHRDYXNlLCBwYXJzZWRGYWlsZWRdLFxuKTtcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgYWxsb3dOdWxsczoge1xuICAgIGRlZmF1bHRWYWx1ZTogdHJ1ZSxcbiAgICBpc1ZhbGlkOiBpc0Jvb2xlYW4sXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB0cnVlIG9yIGZhbHNlJyxcbiAgICBwYXJzZTogdG9Cb29sT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiBvcHRzLmFsbG93TnVsbHMgPT09IHRydWUgfHwgdmFsICE9PSBudWxsLFxuICAgICgpID0+ICdmaWVsZCBjYW5ub3QgYmUgbnVsbCcpLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcbiAgJ2Jvb2wnLCBib29sVHJ5UGFyc2UsIGJvb2xGdW5jdGlvbnMsXG4gIG9wdGlvbnMsIHR5cGVDb25zdHJhaW50cywgdHJ1ZSwgSlNPTi5zdHJpbmdpZnksXG4pO1xuIiwiaW1wb3J0IHtcbiAgY29uc3RhbnQsIGlzTnVtYmVyLCBpc1N0cmluZywgaXNOdWxsLFxufSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgbWFrZXJ1bGUsIHR5cGVGdW5jdGlvbnMsXG4gIHBhcnNlZEZhaWxlZCwgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9OdW1iZXJPck51bGwsXG4gIGlzU2FmZUludGVnZXIsXG59IGZyb20gJy4uL2NvbW1vbic7XG5cbmNvbnN0IG51bWJlckZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBjb25zdGFudChudWxsKSxcbn0pO1xuXG5jb25zdCBwYXJzZVN0cmluZ3RvTnVtYmVyT3JOdWxsID0gKHMpID0+IHtcbiAgY29uc3QgbnVtID0gTnVtYmVyKHMpO1xuICByZXR1cm4gaXNOYU4obnVtKSA/IHBhcnNlZEZhaWxlZChzKSA6IHBhcnNlZFN1Y2Nlc3MobnVtKTtcbn07XG5cbmNvbnN0IG51bWJlclRyeVBhcnNlID0gc3dpdGNoQ2FzZShcbiAgW2lzTnVtYmVyLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzU3RyaW5nLCBwYXJzZVN0cmluZ3RvTnVtYmVyT3JOdWxsXSxcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbik7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIG1heFZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUixcbiAgICBpc1ZhbGlkOiBpc1NhZmVJbnRlZ2VyLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgdmFsaWQgaW50ZWdlcicsXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxuICB9LFxuICBtaW5WYWx1ZToge1xuICAgIGRlZmF1bHRWYWx1ZTogMCAtIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICAgIGlzVmFsaWQ6IGlzU2FmZUludGVnZXIsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB2YWxpZCBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG4gIGRlY2ltYWxQbGFjZXM6IHtcbiAgICBkZWZhdWx0VmFsdWU6IDAsXG4gICAgaXNWYWxpZDogbiA9PiBpc1NhZmVJbnRlZ2VyKG4pICYmIG4gPj0gMCxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXInLFxuICAgIHBhcnNlOiB0b051bWJlck9yTnVsbCxcbiAgfSxcbn07XG5cbmNvbnN0IGdldERlY2ltYWxQbGFjZXMgPSAodmFsKSA9PiB7XG4gIGNvbnN0IHNwbGl0RGVjaW1hbCA9IHZhbC50b1N0cmluZygpLnNwbGl0KCcuJyk7XG4gIGlmIChzcGxpdERlY2ltYWwubGVuZ3RoID09PSAxKSByZXR1cm4gMDtcbiAgcmV0dXJuIHNwbGl0RGVjaW1hbFsxXS5sZW5ndGg7XG59O1xuXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCBvcHRzLm1pblZhbHVlID09PSBudWxsIHx8IHZhbCA+PSBvcHRzLm1pblZhbHVlLFxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSAoJHt2YWwudG9TdHJpbmcoKX0pIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvICR7b3B0cy5taW5WYWx1ZX1gKSxcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWF4VmFsdWUgPT09IG51bGwgfHwgdmFsIDw9IG9wdHMubWF4VmFsdWUsXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlICgke3ZhbC50b1N0cmluZygpfSkgbXVzdCBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gJHtvcHRzLm1pblZhbHVlfSBvcHRpb25zYCksXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCBvcHRzLmRlY2ltYWxQbGFjZXMgPj0gZ2V0RGVjaW1hbFBsYWNlcyh2YWwpLFxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSAoJHt2YWwudG9TdHJpbmcoKX0pIG11c3QgaGF2ZSAke29wdHMuZGVjaW1hbFBsYWNlc30gZGVjaW1hbCBwbGFjZXMgb3IgbGVzc2ApLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcbiAgJ251bWJlcicsXG4gIG51bWJlclRyeVBhcnNlLFxuICBudW1iZXJGdW5jdGlvbnMsXG4gIG9wdGlvbnMsXG4gIHR5cGVDb25zdHJhaW50cyxcbiAgMSxcbiAgbnVtID0+IG51bS50b1N0cmluZygpLFxuKTtcbiIsImltcG9ydCB7XG4gIGNvbnN0YW50LCBpc0RhdGUsIGlzU3RyaW5nLCBpc051bGwsXG59IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICBtYWtlcnVsZSwgdHlwZUZ1bmN0aW9ucyxcbiAgcGFyc2VkRmFpbGVkLCBwYXJzZWRTdWNjZXNzLCBnZXREZWZhdWx0RXhwb3J0LFxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLCB0b0RhdGVPck51bGwsXG59IGZyb20gJy4uL2NvbW1vbic7XG5cbmNvbnN0IGRhdGVGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogY29uc3RhbnQobnVsbCksXG4gIG5vdzogKCkgPT4gbmV3IERhdGUoKSxcbn0pO1xuXG5jb25zdCBpc1ZhbGlkRGF0ZSA9IGQgPT4gZCBpbnN0YW5jZW9mIERhdGUgJiYgIWlzTmFOKGQpO1xuXG5jb25zdCBwYXJzZVN0cmluZ1RvRGF0ZSA9IHMgPT4gc3dpdGNoQ2FzZShcbiAgW2lzVmFsaWREYXRlLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2RlZmF1bHRDYXNlLCBwYXJzZWRGYWlsZWRdLFxuKShuZXcgRGF0ZShzKSk7XG5cblxuY29uc3QgZGF0ZVRyeVBhcnNlID0gc3dpdGNoQ2FzZShcbiAgW2lzRGF0ZSwgcGFyc2VkU3VjY2Vzc10sXG4gIFtpc1N0cmluZywgcGFyc2VTdHJpbmdUb0RhdGVdLFxuICBbaXNOdWxsLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2RlZmF1bHRDYXNlLCBwYXJzZWRGYWlsZWRdLFxuKTtcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgbWF4VmFsdWU6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG5ldyBEYXRlKDMyNTAzNjgwMDAwMDAwKSxcbiAgICBpc1ZhbGlkOiBpc0RhdGUsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB2YWxpZCBkYXRlJyxcbiAgICBwYXJzZTogdG9EYXRlT3JOdWxsLFxuICB9LFxuICBtaW5WYWx1ZToge1xuICAgIGRlZmF1bHRWYWx1ZTogbmV3IERhdGUoLTg1MjAzMzYwMDAwMDApLFxuICAgIGlzVmFsaWQ6IGlzRGF0ZSxcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHZhbGlkIGRhdGUnLFxuICAgIHBhcnNlOiB0b0RhdGVPck51bGwsXG4gIH0sXG59O1xuXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCBvcHRzLm1pblZhbHVlID09PSBudWxsIHx8IHZhbCA+PSBvcHRzLm1pblZhbHVlLFxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSAoJHt2YWwudG9TdHJpbmcoKX0pIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvICR7b3B0cy5taW5WYWx1ZX1gKSxcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWF4VmFsdWUgPT09IG51bGwgfHwgdmFsIDw9IG9wdHMubWF4VmFsdWUsXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlICgke3ZhbC50b1N0cmluZygpfSkgbXVzdCBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gJHtvcHRzLm1pblZhbHVlfSBvcHRpb25zYCksXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxuICAnZGF0ZXRpbWUnLFxuICBkYXRlVHJ5UGFyc2UsXG4gIGRhdGVGdW5jdGlvbnMsXG4gIG9wdGlvbnMsXG4gIHR5cGVDb25zdHJhaW50cyxcbiAgbmV3IERhdGUoMTk4NCwgNCwgMSksXG4gIGRhdGUgPT4gSlNPTi5zdHJpbmdpZnkoZGF0ZSkucmVwbGFjZShuZXcgUmVnRXhwKCdcIicsICdnJyksICcnKSxcbik7XG4iLCJpbXBvcnQgeyBjb25zdGFudCwgaXNBcnJheSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgdHlwZUZ1bmN0aW9ucywgbWFrZXJ1bGUsXG4gIHBhcnNlZEZhaWxlZCwgZ2V0RGVmYXVsdEV4cG9ydCwgcGFyc2VkU3VjY2Vzcyxcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9OdW1iZXJPck51bGwsXG4gICQkLCBpc1NhZmVJbnRlZ2VyLFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBhcnJheUZ1bmN0aW9ucyA9ICgpID0+IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBjb25zdGFudChbXSksXG59KTtcblxuY29uc3QgbWFwVG9QYXJzZWRBcnJhcnkgPSB0eXBlID0+ICQkKFxuICBtYXAoaSA9PiB0eXBlLnNhZmVQYXJzZVZhbHVlKGkpKSxcbiAgcGFyc2VkU3VjY2Vzcyxcbik7XG5cbmNvbnN0IGFycmF5VHJ5UGFyc2UgPSB0eXBlID0+IHN3aXRjaENhc2UoXG4gIFtpc0FycmF5LCBtYXBUb1BhcnNlZEFycmFyeSh0eXBlKV0sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbik7XG5cbmNvbnN0IHR5cGVOYW1lID0gdHlwZSA9PiBgYXJyYXk8JHt0eXBlfT5gO1xuXG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIG1heExlbmd0aDoge1xuICAgIGRlZmF1bHRWYWx1ZTogMTAwMDAsXG4gICAgaXNWYWxpZDogaXNTYWZlSW50ZWdlcixcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXInLFxuICAgIHBhcnNlOiB0b051bWJlck9yTnVsbCxcbiAgfSxcbiAgbWluTGVuZ3RoOiB7XG4gICAgZGVmYXVsdFZhbHVlOiAwLFxuICAgIGlzVmFsaWQ6IG4gPT4gaXNTYWZlSW50ZWdlcihuKSAmJiBuID49IDAsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG59O1xuXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCB2YWwubGVuZ3RoID49IG9wdHMubWluTGVuZ3RoLFxuICAgICh2YWwsIG9wdHMpID0+IGBtdXN0IGNob29zZSAke29wdHMubWluTGVuZ3RofSBvciBtb3JlIG9wdGlvbnNgKSxcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IHZhbC5sZW5ndGggPD0gb3B0cy5tYXhMZW5ndGgsXG4gICAgKHZhbCwgb3B0cykgPT4gYGNhbm5vdCBjaG9vc2UgbW9yZSB0aGFuICR7b3B0cy5tYXhMZW5ndGh9IG9wdGlvbnNgKSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IHR5cGUgPT4gZ2V0RGVmYXVsdEV4cG9ydChcbiAgdHlwZU5hbWUodHlwZS5uYW1lKSxcbiAgYXJyYXlUcnlQYXJzZSh0eXBlKSxcbiAgYXJyYXlGdW5jdGlvbnModHlwZSksXG4gIG9wdGlvbnMsXG4gIHR5cGVDb25zdHJhaW50cyxcbiAgW3R5cGUuc2FtcGxlVmFsdWVdLFxuICBKU09OLnN0cmluZ2lmeSxcbik7XG4iLCJpbXBvcnQge1xuICBpc1N0cmluZywgaXNPYmplY3RMaWtlLFxuICBpc051bGwsIGhhcywgaXNFbXB0eSxcbn0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7XG4gIHR5cGVGdW5jdGlvbnMsIG1ha2VydWxlLFxuICBwYXJzZWRTdWNjZXNzLCBnZXREZWZhdWx0RXhwb3J0LFxuICBwYXJzZWRGYWlsZWQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsXG4gIGlzTm9uRW1wdHlTdHJpbmcsIGlzQXJyYXlPZlN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgcmVmZXJlbmNlTm90aGluZyA9ICgpID0+ICh7IGtleTogJycgfSk7XG5cbmNvbnN0IHJlZmVyZW5jZUZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiByZWZlcmVuY2VOb3RoaW5nLFxufSk7XG5cbmNvbnN0IGhhc1N0cmluZ1ZhbHVlID0gKG9iLCBwYXRoKSA9PiBoYXMob2IsIHBhdGgpXG4gICAgJiYgaXNTdHJpbmcob2JbcGF0aF0pO1xuXG5jb25zdCBpc09iamVjdFdpdGhLZXkgPSB2ID0+IGlzT2JqZWN0TGlrZSh2KVxuICAgICYmIGhhc1N0cmluZ1ZhbHVlKHYsICdrZXknKTtcblxuY29uc3QgdHJ5UGFyc2VGcm9tU3RyaW5nID0gcyA9PiB7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBhc09iaiA9IEpTT04ucGFyc2Uocyk7XG4gICAgaWYoaXNPYmplY3RXaXRoS2V5KSB7XG4gICAgICByZXR1cm4gcGFyc2VkU3VjY2Vzcyhhc09iaik7XG4gICAgfVxuICB9XG4gIGNhdGNoKF8pIHtcbiAgICAvLyBFTVBUWVxuICB9XG5cbiAgcmV0dXJuIHBhcnNlZEZhaWxlZChzKTtcbn1cblxuY29uc3QgcmVmZXJlbmNlVHJ5UGFyc2UgPSB2ID0+IHN3aXRjaENhc2UoXG4gIFtpc09iamVjdFdpdGhLZXksIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNTdHJpbmcsIHRyeVBhcnNlRnJvbVN0cmluZ10sXG4gIFtpc051bGwsICgpID0+IHBhcnNlZFN1Y2Nlc3MocmVmZXJlbmNlTm90aGluZygpKV0sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbikodik7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIGluZGV4Tm9kZUtleToge1xuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICBpc1ZhbGlkOiBpc05vbkVtcHR5U3RyaW5nLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZycsXG4gICAgcGFyc2U6IHMgPT4gcyxcbiAgfSxcbiAgZGlzcGxheVZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiAnJyxcbiAgICBpc1ZhbGlkOiBpc05vbkVtcHR5U3RyaW5nLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZycsXG4gICAgcGFyc2U6IHMgPT4gcyxcbiAgfSxcbiAgcmV2ZXJzZUluZGV4Tm9kZUtleXM6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgaXNWYWxpZDogdiA9PiBpc0FycmF5T2ZTdHJpbmcodikgJiYgdi5sZW5ndGggPiAwLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgbm9uLWVtcHR5IGFycmF5IG9mIHN0cmluZ3MnLFxuICAgIHBhcnNlOiBzID0+IHMsXG4gIH0sXG59O1xuXG5jb25zdCBpc0VtcHR5U3RyaW5nID0gcyA9PiBpc1N0cmluZyhzKSAmJiBpc0VtcHR5KHMpO1xuXG5jb25zdCBlbnN1cmVSZWZlcmVuY2VFeGlzdHMgPSBhc3luYyAodmFsLCBvcHRzLCBjb250ZXh0KSA9PiBpc0VtcHR5U3RyaW5nKHZhbC5rZXkpXG4gICAgfHwgYXdhaXQgY29udGV4dC5yZWZlcmVuY2VFeGlzdHMob3B0cywgdmFsLmtleSk7XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcbiAgbWFrZXJ1bGUoXG4gICAgZW5zdXJlUmVmZXJlbmNlRXhpc3RzLFxuICAgICh2YWwsIG9wdHMpID0+IGBcIiR7dmFsW29wdHMuZGlzcGxheVZhbHVlXX1cIiBkb2VzIG5vdCBleGlzdCBpbiBvcHRpb25zIGxpc3QgKGtleTogJHt2YWwua2V5fSlgLFxuICApLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcbiAgJ3JlZmVyZW5jZScsXG4gIHJlZmVyZW5jZVRyeVBhcnNlLFxuICByZWZlcmVuY2VGdW5jdGlvbnMsXG4gIG9wdGlvbnMsXG4gIHR5cGVDb25zdHJhaW50cyxcbiAgeyBrZXk6ICdrZXknLCB2YWx1ZTogJ3ZhbHVlJyB9LFxuICBKU09OLnN0cmluZ2lmeSxcbik7XG4iLCJpbXBvcnQge1xuICBsYXN0LCBoYXMsIGlzU3RyaW5nLCBpbnRlcnNlY3Rpb24sXG4gIGlzTnVsbCwgaXNOdW1iZXIsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICB0eXBlRnVuY3Rpb25zLCBwYXJzZWRGYWlsZWQsXG4gIHBhcnNlZFN1Y2Nlc3MsIGdldERlZmF1bHRFeHBvcnQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIG5vbmUsXG4gICQsIHNwbGl0S2V5LFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBpbGxlZ2FsQ2hhcmFjdGVycyA9ICcqP1xcXFwvOjw+fFxcMFxcYlxcZlxcdic7XG5cbmV4cG9ydCBjb25zdCBpc0xlZ2FsRmlsZW5hbWUgPSAoZmlsZVBhdGgpID0+IHtcbiAgY29uc3QgZm4gPSBmaWxlTmFtZShmaWxlUGF0aCk7XG4gIHJldHVybiBmbi5sZW5ndGggPD0gMjU1XG4gICAgJiYgaW50ZXJzZWN0aW9uKGZuLnNwbGl0KCcnKSkoaWxsZWdhbENoYXJhY3RlcnMuc3BsaXQoJycpKS5sZW5ndGggPT09IDBcbiAgICAmJiBub25lKGYgPT4gZiA9PT0gJy4uJykoc3BsaXRLZXkoZmlsZVBhdGgpKTtcbn07XG5cbmNvbnN0IGZpbGVOb3RoaW5nID0gKCkgPT4gKHsgcmVsYXRpdmVQYXRoOiAnJywgc2l6ZTogMCB9KTtcblxuY29uc3QgZmlsZUZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBmaWxlTm90aGluZyxcbn0pO1xuXG5jb25zdCBmaWxlVHJ5UGFyc2UgPSB2ID0+IHN3aXRjaENhc2UoXG4gIFtpc1ZhbGlkRmlsZSwgcGFyc2VkU3VjY2Vzc10sXG4gIFtpc051bGwsICgpID0+IHBhcnNlZFN1Y2Nlc3MoZmlsZU5vdGhpbmcoKSldLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pKHYpO1xuXG5jb25zdCBmaWxlTmFtZSA9IGZpbGVQYXRoID0+ICQoZmlsZVBhdGgsIFtcbiAgc3BsaXRLZXksXG4gIGxhc3QsXG5dKTtcblxuY29uc3QgaXNWYWxpZEZpbGUgPSBmID0+ICFpc051bGwoZilcbiAgICAmJiBoYXMoJ3JlbGF0aXZlUGF0aCcpKGYpICYmIGhhcygnc2l6ZScpKGYpXG4gICAgJiYgaXNOdW1iZXIoZi5zaXplKVxuICAgICYmIGlzU3RyaW5nKGYucmVsYXRpdmVQYXRoKVxuICAgICYmIGlzTGVnYWxGaWxlbmFtZShmLnJlbGF0aXZlUGF0aCk7XG5cbmNvbnN0IG9wdGlvbnMgPSB7fTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW107XG5cbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXG4gICdmaWxlJyxcbiAgZmlsZVRyeVBhcnNlLFxuICBmaWxlRnVuY3Rpb25zLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gIHsgcmVsYXRpdmVQYXRoOiAnc29tZV9maWxlLmpwZycsIHNpemU6IDEwMDAgfSxcbiAgSlNPTi5zdHJpbmdpZnksXG4pO1xuIiwiaW1wb3J0IHtcbiAgYXNzaWduLCBrZXlzLCBtZXJnZSwgaGFzLFxufSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgbWFwLCBpc1N0cmluZywgaXNOdW1iZXIsXG4gIGlzQm9vbGVhbiwgaXNEYXRlLFxuICBpc09iamVjdCwgaXNBcnJheSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7ICQgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGFyc2VkU3VjY2VzcyB9IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHN0cmluZyBmcm9tICcuL3N0cmluZyc7XG5pbXBvcnQgYm9vbCBmcm9tICcuL2Jvb2wnO1xuaW1wb3J0IG51bWJlciBmcm9tICcuL251bWJlcic7XG5pbXBvcnQgZGF0ZXRpbWUgZnJvbSAnLi9kYXRldGltZSc7XG5pbXBvcnQgYXJyYXkgZnJvbSAnLi9hcnJheSc7XG5pbXBvcnQgcmVmZXJlbmNlIGZyb20gJy4vcmVmZXJlbmNlJztcbmltcG9ydCBmaWxlIGZyb20gJy4vZmlsZSc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuY29uc3QgYWxsVHlwZXMgPSAoKSA9PiB7XG4gIGNvbnN0IGJhc2ljVHlwZXMgPSB7XG4gICAgc3RyaW5nLCBudW1iZXIsIGRhdGV0aW1lLCBib29sLCByZWZlcmVuY2UsIGZpbGUsXG4gIH07XG5cbiAgY29uc3QgYXJyYXlzID0gJChiYXNpY1R5cGVzLCBbXG4gICAga2V5cyxcbiAgICBtYXAoKGspID0+IHtcbiAgICAgIGNvbnN0IGt2VHlwZSA9IHt9O1xuICAgICAgY29uc3QgY29uY3JldGVBcnJheSA9IGFycmF5KGJhc2ljVHlwZXNba10pO1xuICAgICAga3ZUeXBlW2NvbmNyZXRlQXJyYXkubmFtZV0gPSBjb25jcmV0ZUFycmF5O1xuICAgICAgcmV0dXJuIGt2VHlwZTtcbiAgICB9KSxcbiAgICB0eXBlcyA9PiBhc3NpZ24oe30sIC4uLnR5cGVzKSxcbiAgXSk7XG5cbiAgcmV0dXJuIG1lcmdlKHt9LCBiYXNpY1R5cGVzLCBhcnJheXMpO1xufTtcblxuXG5leHBvcnQgY29uc3QgYWxsID0gYWxsVHlwZXMoKTtcblxuZXhwb3J0IGNvbnN0IGdldFR5cGUgPSAodHlwZU5hbWUpID0+IHtcbiAgaWYgKCFoYXMoYWxsLCB0eXBlTmFtZSkpIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYERvIG5vdCByZWNvZ25pc2UgdHlwZSAke3R5cGVOYW1lfWApO1xuICByZXR1cm4gYWxsW3R5cGVOYW1lXTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRTYW1wbGVGaWVsZFZhbHVlID0gZmllbGQgPT4gZ2V0VHlwZShmaWVsZC50eXBlKS5zYW1wbGVWYWx1ZTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0ZpZWxkVmFsdWUgPSBmaWVsZCA9PiBnZXRUeXBlKGZpZWxkLnR5cGUpLmdldE5ldyhmaWVsZCk7XG5cbmV4cG9ydCBjb25zdCBzYWZlUGFyc2VGaWVsZCA9IChmaWVsZCwgcmVjb3JkKSA9PiBnZXRUeXBlKGZpZWxkLnR5cGUpLnNhZmVQYXJzZUZpZWxkKGZpZWxkLCByZWNvcmQpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVGaWVsZFBhcnNlID0gKGZpZWxkLCByZWNvcmQpID0+IChoYXMocmVjb3JkLCBmaWVsZC5uYW1lKVxuICA/IGdldFR5cGUoZmllbGQudHlwZSkudHJ5UGFyc2UocmVjb3JkW2ZpZWxkLm5hbWVdKVxuICA6IHBhcnNlZFN1Y2Nlc3ModW5kZWZpbmVkKSk7IC8vIGZpZWxkcyBtYXkgYmUgdW5kZWZpbmVkIGJ5IGRlZmF1bHRcblxuZXhwb3J0IGNvbnN0IGdldERlZmF1bHRPcHRpb25zID0gdHlwZSA9PiBnZXRUeXBlKHR5cGUpLmdldERlZmF1bHRPcHRpb25zKCk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyA9IGFzeW5jIChmaWVsZCwgcmVjb3JkLCBjb250ZXh0KSA9PiBhd2FpdCBnZXRUeXBlKGZpZWxkLnR5cGUpLnZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzKGZpZWxkLCByZWNvcmQsIGNvbnRleHQpO1xuXG5leHBvcnQgY29uc3QgZGV0ZWN0VHlwZSA9ICh2YWx1ZSkgPT4ge1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSByZXR1cm4gc3RyaW5nO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSkgcmV0dXJuIGJvb2w7XG4gIGlmIChpc051bWJlcih2YWx1ZSkpIHJldHVybiBudW1iZXI7XG4gIGlmIChpc0RhdGUodmFsdWUpKSByZXR1cm4gZGF0ZXRpbWU7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkgcmV0dXJuIGFycmF5KGRldGVjdFR5cGUodmFsdWVbMF0pKTtcbiAgaWYgKGlzT2JqZWN0KHZhbHVlKVxuICAgICAgICYmIGhhcyh2YWx1ZSwgJ2tleScpXG4gICAgICAgJiYgaGFzKHZhbHVlLCAndmFsdWUnKSkgcmV0dXJuIHJlZmVyZW5jZTtcbiAgaWYgKGlzT2JqZWN0KHZhbHVlKVxuICAgICAgICAmJiBoYXModmFsdWUsICdyZWxhdGl2ZVBhdGgnKVxuICAgICAgICAmJiBoYXModmFsdWUsICdzaXplJykpIHJldHVybiBmaWxlO1xuXG4gIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYGNhbm5vdCBkZXRlcm1pbmUgdHlwZTogJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSl9YCk7XG59O1xuIiwiaW1wb3J0IHsgY2xvbmUsIGZpbmQsIHNwbGl0IH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGpvaW5LZXksICQgfSBmcm9tICcuLi9jb21tb24nO1xuLy8gNSBtaW51dGVzXG5leHBvcnQgY29uc3QgdGVtcENvZGVFeHBpcnlMZW5ndGggPSA1ICogNjAgKiAxMDAwO1xuXG5leHBvcnQgY29uc3QgQVVUSF9GT0xERVIgPSAnLy5hdXRoJztcbmV4cG9ydCBjb25zdCBVU0VSU19MSVNUX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAndXNlcnMuanNvbicpO1xuZXhwb3J0IGNvbnN0IHVzZXJBdXRoRmlsZSA9IHVzZXJuYW1lID0+IGpvaW5LZXkoQVVUSF9GT0xERVIsIGBhdXRoXyR7dXNlcm5hbWV9Lmpzb25gKTtcbmV4cG9ydCBjb25zdCBVU0VSU19MT0NLX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAndXNlcnNfbG9jaycpO1xuZXhwb3J0IGNvbnN0IEFDQ0VTU19MRVZFTFNfRklMRSA9IGpvaW5LZXkoQVVUSF9GT0xERVIsICdhY2Nlc3NfbGV2ZWxzLmpzb24nKTtcbmV4cG9ydCBjb25zdCBBQ0NFU1NfTEVWRUxTX0xPQ0tfRklMRSA9IGpvaW5LZXkoQVVUSF9GT0xERVIsICdhY2Nlc3NfbGV2ZWxzX2xvY2snKTtcblxuZXhwb3J0IGNvbnN0IHBlcm1pc3Npb25UeXBlcyA9IHtcbiAgQ1JFQVRFX1JFQ09SRDogJ2NyZWF0ZSByZWNvcmQnLFxuICBVUERBVEVfUkVDT1JEOiAndXBkYXRlIHJlY29yZCcsXG4gIFJFQURfUkVDT1JEOiAncmVhZCByZWNvcmQnLFxuICBERUxFVEVfUkVDT1JEOiAnZGVsZXRlIHJlY29yZCcsXG4gIFJFQURfSU5ERVg6ICdyZWFkIGluZGV4JyxcbiAgTUFOQUdFX0lOREVYOiAnbWFuYWdlIGluZGV4JyxcbiAgTUFOQUdFX0NPTExFQ1RJT046ICdtYW5hZ2UgY29sbGVjdGlvbicsXG4gIFdSSVRFX1RFTVBMQVRFUzogJ3dyaXRlIHRlbXBsYXRlcycsXG4gIENSRUFURV9VU0VSOiAnY3JlYXRlIHVzZXInLFxuICBTRVRfUEFTU1dPUkQ6ICdzZXQgcGFzc3dvcmQnLFxuICBDUkVBVEVfVEVNUE9SQVJZX0FDQ0VTUzogJ2NyZWF0ZSB0ZW1wb3JhcnkgYWNjZXNzJyxcbiAgRU5BQkxFX0RJU0FCTEVfVVNFUjogJ2VuYWJsZSBvciBkaXNhYmxlIHVzZXInLFxuICBXUklURV9BQ0NFU1NfTEVWRUxTOiAnd3JpdGUgYWNjZXNzIGxldmVscycsXG4gIExJU1RfVVNFUlM6ICdsaXN0IHVzZXJzJyxcbiAgTElTVF9BQ0NFU1NfTEVWRUxTOiAnbGlzdCBhY2Nlc3MgbGV2ZWxzJyxcbiAgRVhFQ1VURV9BQ1RJT046ICdleGVjdXRlIGFjdGlvbicsXG4gIFNFVF9VU0VSX0FDQ0VTU19MRVZFTFM6ICdzZXQgdXNlciBhY2Nlc3MgbGV2ZWxzJyxcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRVc2VyQnlOYW1lID0gKHVzZXJzLCBuYW1lKSA9PiAkKHVzZXJzLCBbXG4gIGZpbmQodSA9PiB1Lm5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZS50b0xvd2VyQ2FzZSgpKSxcbl0pO1xuXG5leHBvcnQgY29uc3Qgc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZiA9ICh1c2VyKSA9PiB7XG4gIGNvbnN0IHN0cmlwcGVkID0gY2xvbmUodXNlcik7XG4gIGRlbGV0ZSBzdHJpcHBlZC50ZW1wQ29kZTtcbiAgcmV0dXJuIHN0cmlwcGVkO1xufTtcblxuZXhwb3J0IGNvbnN0IHBhcnNlVGVtcG9yYXJ5Q29kZSA9IGZ1bGxDb2RlID0+ICQoZnVsbENvZGUsIFtcbiAgc3BsaXQoJzonKSxcbiAgcGFydHMgPT4gKHtcbiAgICBpZDogcGFydHNbMV0sXG4gICAgY29kZTogcGFydHNbMl0sXG4gIH0pLFxuXSk7XG4iLCJpbXBvcnQgeyB2YWx1ZXMsIGluY2x1ZGVzLCBzb21lIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHBlcm1pc3Npb25UeXBlcyB9IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQge1xuICAkLCBpc05vdGhpbmcsIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXROb2RlQnlLZXlPck5vZGVLZXksIGlzTm9kZSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBpc0F1dGhvcml6ZWQgPSBhcHAgPT4gKHBlcm1pc3Npb25UeXBlLCByZXNvdXJjZUtleSkgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuaXNBdXRob3JpemVkLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHJlc291cmNlS2V5LCBwZXJtaXNzaW9uVHlwZSB9LFxuICBfaXNBdXRob3JpemVkLCBhcHAsIHBlcm1pc3Npb25UeXBlLCByZXNvdXJjZUtleSxcbik7XG5cbmV4cG9ydCBjb25zdCBfaXNBdXRob3JpemVkID0gKGFwcCwgcGVybWlzc2lvblR5cGUsIHJlc291cmNlS2V5KSA9PiB7XG4gIGlmICghYXBwLnVzZXIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCB2YWxpZFR5cGUgPSAkKHBlcm1pc3Npb25UeXBlcywgW1xuICAgIHZhbHVlcyxcbiAgICBpbmNsdWRlcyhwZXJtaXNzaW9uVHlwZSksXG4gIF0pO1xuXG4gIGlmICghdmFsaWRUeXBlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgcGVybU1hdGNoZXNSZXNvdXJjZSA9ICh1c2VycGVybSkgPT4ge1xuICAgIGNvbnN0IG5vZGVLZXkgPSBpc05vdGhpbmcocmVzb3VyY2VLZXkpXG4gICAgICA/IG51bGxcbiAgICAgIDogaXNOb2RlKGFwcC5oaWVyYXJjaHksIHJlc291cmNlS2V5KVxuICAgICAgICA/IGdldE5vZGVCeUtleU9yTm9kZUtleShcbiAgICAgICAgICBhcHAuaGllcmFyY2h5LCByZXNvdXJjZUtleSxcbiAgICAgICAgKS5ub2RlS2V5KClcbiAgICAgICAgOiByZXNvdXJjZUtleTtcblxuICAgIHJldHVybiAodXNlcnBlcm0udHlwZSA9PT0gcGVybWlzc2lvblR5cGUpXG4gICAgICAgICYmIChcbiAgICAgICAgICBpc05vdGhpbmcocmVzb3VyY2VLZXkpXG4gICAgICAgICAgICB8fCBub2RlS2V5ID09PSB1c2VycGVybS5ub2RlS2V5XG4gICAgICAgICk7XG4gIH07XG5cbiAgcmV0dXJuICQoYXBwLnVzZXIucGVybWlzc2lvbnMsIFtcbiAgICBzb21lKHBlcm1NYXRjaGVzUmVzb3VyY2UpLFxuICBdKTtcbn07XG4iLCJpbXBvcnQgeyBwZXJtaXNzaW9uVHlwZXMgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgaXNBdXRob3JpemVkIH0gZnJvbSAnLi9pc0F1dGhvcml6ZWQnO1xuXG5leHBvcnQgY29uc3QgdGVtcG9yYXJ5QWNjZXNzUGVybWlzc2lvbnMgPSAoKSA9PiAoW3sgdHlwZTogcGVybWlzc2lvblR5cGVzLlNFVF9QQVNTV09SRCB9XSk7XG5cbmNvbnN0IG5vZGVQZXJtaXNzaW9uID0gdHlwZSA9PiAoe1xuICBhZGQ6IChub2RlS2V5LCBhY2Nlc3NMZXZlbCkgPT4gYWNjZXNzTGV2ZWwucGVybWlzc2lvbnMucHVzaCh7IHR5cGUsIG5vZGVLZXkgfSksXG4gIGlzQXV0aG9yaXplZDogcmVzb3VyY2VLZXkgPT4gYXBwID0+IGlzQXV0aG9yaXplZChhcHApKHR5cGUsIHJlc291cmNlS2V5KSxcbiAgaXNOb2RlOiB0cnVlLFxuICBnZXQ6IG5vZGVLZXkgPT4gKHsgdHlwZSwgbm9kZUtleSB9KSxcbn0pO1xuXG5jb25zdCBzdGF0aWNQZXJtaXNzaW9uID0gdHlwZSA9PiAoe1xuICBhZGQ6IGFjY2Vzc0xldmVsID0+IGFjY2Vzc0xldmVsLnBlcm1pc3Npb25zLnB1c2goeyB0eXBlIH0pLFxuICBpc0F1dGhvcml6ZWQ6IGFwcCA9PiBpc0F1dGhvcml6ZWQoYXBwKSh0eXBlKSxcbiAgaXNOb2RlOiBmYWxzZSxcbiAgZ2V0OiAoKSA9PiAoeyB0eXBlIH0pLFxufSk7XG5cbmNvbnN0IGNyZWF0ZVJlY29yZCA9IG5vZGVQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfUkVDT1JEKTtcblxuY29uc3QgdXBkYXRlUmVjb3JkID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlVQREFURV9SRUNPUkQpO1xuXG5jb25zdCBkZWxldGVSZWNvcmQgPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuREVMRVRFX1JFQ09SRCk7XG5cbmNvbnN0IHJlYWRSZWNvcmQgPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuUkVBRF9SRUNPUkQpO1xuXG5jb25zdCB3cml0ZVRlbXBsYXRlcyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLldSSVRFX1RFTVBMQVRFUyk7XG5cbmNvbnN0IGNyZWF0ZVVzZXIgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfVVNFUik7XG5cbmNvbnN0IHNldFBhc3N3b3JkID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuU0VUX1BBU1NXT1JEKTtcblxuY29uc3QgcmVhZEluZGV4ID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlJFQURfSU5ERVgpO1xuXG5jb25zdCBtYW5hZ2VJbmRleCA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLk1BTkFHRV9JTkRFWCk7XG5cbmNvbnN0IG1hbmFnZUNvbGxlY3Rpb24gPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5NQU5BR0VfQ09MTEVDVElPTik7XG5cbmNvbnN0IGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkNSRUFURV9URU1QT1JBUllfQUNDRVNTKTtcblxuY29uc3QgZW5hYmxlRGlzYWJsZVVzZXIgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5FTkFCTEVfRElTQUJMRV9VU0VSKTtcblxuY29uc3Qgd3JpdGVBY2Nlc3NMZXZlbHMgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5XUklURV9BQ0NFU1NfTEVWRUxTKTtcblxuY29uc3QgbGlzdFVzZXJzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuTElTVF9VU0VSUyk7XG5cbmNvbnN0IGxpc3RBY2Nlc3NMZXZlbHMgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5MSVNUX0FDQ0VTU19MRVZFTFMpO1xuXG5jb25zdCBzZXRVc2VyQWNjZXNzTGV2ZWxzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuU0VUX1VTRVJfQUNDRVNTX0xFVkVMUyk7XG5cbmNvbnN0IGV4ZWN1dGVBY3Rpb24gPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuRVhFQ1VURV9BQ1RJT04pO1xuXG5leHBvcnQgY29uc3QgYWx3YXlzQXV0aG9yaXplZCA9ICgpID0+IHRydWU7XG5cbmV4cG9ydCBjb25zdCBwZXJtaXNzaW9uID0ge1xuICBjcmVhdGVSZWNvcmQsXG4gIHVwZGF0ZVJlY29yZCxcbiAgZGVsZXRlUmVjb3JkLFxuICByZWFkUmVjb3JkLFxuICB3cml0ZVRlbXBsYXRlcyxcbiAgY3JlYXRlVXNlcixcbiAgc2V0UGFzc3dvcmQsXG4gIHJlYWRJbmRleCxcbiAgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzLFxuICBlbmFibGVEaXNhYmxlVXNlcixcbiAgd3JpdGVBY2Nlc3NMZXZlbHMsXG4gIGxpc3RVc2VycyxcbiAgbGlzdEFjY2Vzc0xldmVscyxcbiAgbWFuYWdlSW5kZXgsXG4gIG1hbmFnZUNvbGxlY3Rpb24sXG4gIGV4ZWN1dGVBY3Rpb24sXG4gIHNldFVzZXJBY2Nlc3NMZXZlbHMsXG59O1xuIiwiaW1wb3J0IHtcbiAga2V5QnksIG1hcFZhbHVlcyxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnc2hvcnRpZCc7XG5pbXBvcnQgeyBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgZ2V0TmV3RmllbGRWYWx1ZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7XG4gICQsIGpvaW5LZXksIHNhZmVLZXksIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBnZXROZXcgPSBhcHAgPT4gKGNvbGxlY3Rpb25LZXksIHJlY29yZFR5cGVOYW1lKSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRSZWNvcmROb2RlKGFwcCwgY29sbGVjdGlvbktleSwgcmVjb3JkVHlwZU5hbWUpO1xuICByZXR1cm4gYXBpV3JhcHBlclN5bmMoXG4gICAgYXBwLFxuICAgIGV2ZW50cy5yZWNvcmRBcGkuZ2V0TmV3LFxuICAgIHBlcm1pc3Npb24uY3JlYXRlUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmROb2RlLm5vZGVLZXkoKSksXG4gICAgeyBjb2xsZWN0aW9uS2V5LCByZWNvcmRUeXBlTmFtZSB9LFxuICAgIF9nZXROZXcsIHJlY29yZE5vZGUsIGNvbGxlY3Rpb25LZXksXG4gICk7XG59O1xuXG5jb25zdCBfZ2V0TmV3ID0gKHJlY29yZE5vZGUsIGNvbGxlY3Rpb25LZXkpID0+IGNvbnN0cnVjdFJlY29yZChyZWNvcmROb2RlLCBnZXROZXdGaWVsZFZhbHVlLCBjb2xsZWN0aW9uS2V5KTtcblxuY29uc3QgZ2V0UmVjb3JkTm9kZSA9IChhcHAsIGNvbGxlY3Rpb25LZXkpID0+IHtcbiAgY29sbGVjdGlvbktleSA9IHNhZmVLZXkoY29sbGVjdGlvbktleSk7XG4gIHJldHVybiBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwLmhpZXJhcmNoeSkoY29sbGVjdGlvbktleSk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3Q2hpbGQgPSBhcHAgPT4gKHJlY29yZEtleSwgY29sbGVjdGlvbk5hbWUsIHJlY29yZFR5cGVOYW1lKSA9PiBcbiAgZ2V0TmV3KGFwcCkoam9pbktleShyZWNvcmRLZXksIGNvbGxlY3Rpb25OYW1lKSwgcmVjb3JkVHlwZU5hbWUpO1xuXG5leHBvcnQgY29uc3QgY29uc3RydWN0UmVjb3JkID0gKHJlY29yZE5vZGUsIGdldEZpZWxkVmFsdWUsIGNvbGxlY3Rpb25LZXkpID0+IHtcbiAgY29uc3QgcmVjb3JkID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICAgIGtleUJ5KCduYW1lJyksXG4gICAgbWFwVmFsdWVzKGdldEZpZWxkVmFsdWUpLFxuICBdKTtcblxuICByZWNvcmQuaWQgPSBgJHtyZWNvcmROb2RlLm5vZGVJZH0tJHtnZW5lcmF0ZSgpfWA7XG4gIHJlY29yZC5rZXkgPSBqb2luS2V5KGNvbGxlY3Rpb25LZXksIHJlY29yZC5pZCk7XG4gIHJlY29yZC5pc05ldyA9IHRydWU7XG4gIHJlY29yZC50eXBlID0gcmVjb3JkTm9kZS5uYW1lO1xuICByZXR1cm4gcmVjb3JkO1xufTtcbiIsImltcG9ydCB7XG4gIGtleUJ5LCBtYXBWYWx1ZXMsIGZpbHRlciwgXG4gIG1hcCwgaW5jbHVkZXMsIGxhc3QsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZXRFeGFjdE5vZGVGb3JQYXRoLCBnZXROb2RlIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IHNhZmVQYXJzZUZpZWxkIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtcbiAgJCwgc3BsaXRLZXksIHNhZmVLZXksIGlzTm9uRW1wdHlTdHJpbmcsXG4gIGFwaVdyYXBwZXIsIGV2ZW50cywgam9pbktleSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IG1hcFJlY29yZCB9IGZyb20gJy4uL2luZGV4aW5nL2V2YWx1YXRlJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGdldFJlY29yZEZpbGVOYW1lID0ga2V5ID0+IGpvaW5LZXkoa2V5LCAncmVjb3JkLmpzb24nKTtcblxuZXhwb3J0IGNvbnN0IGxvYWQgPSBhcHAgPT4gYXN5bmMga2V5ID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLnJlY29yZEFwaS5sb2FkLFxuICBwZXJtaXNzaW9uLnJlYWRSZWNvcmQuaXNBdXRob3JpemVkKGtleSksXG4gIHsga2V5IH0sXG4gIF9sb2FkLCBhcHAsIGtleSxcbik7XG5cbmV4cG9ydCBjb25zdCBfbG9hZCA9IGFzeW5jIChhcHAsIGtleSwga2V5U3RhY2sgPSBbXSkgPT4ge1xuICBrZXkgPSBzYWZlS2V5KGtleSk7XG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKGtleSk7XG4gIGNvbnN0IHN0b3JlZERhdGEgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgIGdldFJlY29yZEZpbGVOYW1lKGtleSksXG4gICk7XG5cbiAgY29uc3QgbG9hZGVkUmVjb3JkID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICAgIGtleUJ5KCduYW1lJyksXG4gICAgbWFwVmFsdWVzKGYgPT4gc2FmZVBhcnNlRmllbGQoZiwgc3RvcmVkRGF0YSkpLFxuICBdKTtcblxuICBjb25zdCBuZXdLZXlTdGFjayA9IFsuLi5rZXlTdGFjaywga2V5XTtcblxuICBjb25zdCByZWZlcmVuY2VzID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICAgIGZpbHRlcihmID0+IGYudHlwZSA9PT0gJ3JlZmVyZW5jZSdcbiAgICAgICAgICAgICAgICAgICAgJiYgaXNOb25FbXB0eVN0cmluZyhsb2FkZWRSZWNvcmRbZi5uYW1lXS5rZXkpXG4gICAgICAgICAgICAgICAgICAgICYmICFpbmNsdWRlcyhsb2FkZWRSZWNvcmRbZi5uYW1lXS5rZXkpKG5ld0tleVN0YWNrKSksXG4gICAgbWFwKGYgPT4gKHtcbiAgICAgIHByb21pc2U6IF9sb2FkKGFwcCwgbG9hZGVkUmVjb3JkW2YubmFtZV0ua2V5LCBuZXdLZXlTdGFjayksXG4gICAgICBpbmRleDogZ2V0Tm9kZShhcHAuaGllcmFyY2h5LCBmLnR5cGVPcHRpb25zLmluZGV4Tm9kZUtleSksXG4gICAgICBmaWVsZDogZixcbiAgICB9KSksXG4gIF0pO1xuXG4gIGlmIChyZWZlcmVuY2VzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCByZWZSZWNvcmRzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICBtYXAocCA9PiBwLnByb21pc2UpKHJlZmVyZW5jZXMpLFxuICAgICk7XG5cbiAgICBmb3IgKGNvbnN0IHJlZiBvZiByZWZlcmVuY2VzKSB7XG4gICAgICBsb2FkZWRSZWNvcmRbcmVmLmZpZWxkLm5hbWVdID0gbWFwUmVjb3JkKFxuICAgICAgICByZWZSZWNvcmRzW3JlZmVyZW5jZXMuaW5kZXhPZihyZWYpXSxcbiAgICAgICAgcmVmLmluZGV4LFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBsb2FkZWRSZWNvcmQudHJhbnNhY3Rpb25JZCA9IHN0b3JlZERhdGEudHJhbnNhY3Rpb25JZDtcbiAgbG9hZGVkUmVjb3JkLmlzTmV3ID0gZmFsc2U7XG4gIGxvYWRlZFJlY29yZC5rZXkgPSBrZXk7XG4gIGxvYWRlZFJlY29yZC5pZCA9ICQoa2V5LCBbc3BsaXRLZXksIGxhc3RdKTtcbiAgbG9hZGVkUmVjb3JkLnR5cGUgPSByZWNvcmROb2RlLm5hbWU7XG4gIHJldHVybiBsb2FkZWRSZWNvcmQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBsb2FkO1xuIiwiLy8gYWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXg0ZXIvanMtcHJvbWlzZS1yZWFkYWJsZVxuLy8gdGhhbmtzIDopXG4gIFxuZXhwb3J0IGNvbnN0IHByb21pc2VSZWFkYWJsZVN0cmVhbSA9IHN0cmVhbSA9PiB7XG4gICBcbiAgICBsZXQgX2Vycm9yZWQ7XG5cbiAgICBjb25zdCBfZXJyb3JIYW5kbGVyID0gZXJyID0+IHtcbiAgICAgICAgX2Vycm9yZWQgPSBlcnI7XG4gICAgfTtcblxuICAgIHN0cmVhbS5vbihcImVycm9yXCIsIF9lcnJvckhhbmRsZXIpO1xuICBcbiAgICBjb25zdCByZWFkID0gKHNpemUpID0+IHtcbiAgXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoX2Vycm9yZWQpIHtcbiAgICAgICAgICBjb25zdCBlcnIgPSBfZXJyb3JlZDtcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgfVxuICBcbiAgICAgICAgaWYgKCFzdHJlYW0ucmVhZGFibGUgfHwgc3RyZWFtLmNsb3NlZCB8fCBzdHJlYW0uZGVzdHJveWVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgcmVhZGFibGVIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNodW5rID0gc3RyZWFtLnJlYWQoc2l6ZSk7XG4gIFxuICAgICAgICAgIGlmIChjaHVuaykge1xuICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICByZXNvbHZlKGNodW5rKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IGNsb3NlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IGVuZEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCBlcnJvckhhbmRsZXIgPSAoZXJyKSA9PiB7XG4gICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IHJlbW92ZUxpc3RlbmVycyA9ICgpID0+IHtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJjbG9zZVwiLCBjbG9zZUhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZW5kXCIsIGVuZEhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcInJlYWRhYmxlXCIsIHJlYWRhYmxlSGFuZGxlcik7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIHN0cmVhbS5vbihcImNsb3NlXCIsIGNsb3NlSGFuZGxlcik7XG4gICAgICAgIHN0cmVhbS5vbihcImVuZFwiLCBlbmRIYW5kbGVyKTtcbiAgICAgICAgc3RyZWFtLm9uKFwiZXJyb3JcIiwgZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgc3RyZWFtLm9uKFwicmVhZGFibGVcIiwgcmVhZGFibGVIYW5kbGVyKTtcbiAgXG4gICAgICAgIHJlYWRhYmxlSGFuZGxlcigpO1xuICAgICAgfSk7XG4gICAgfVxuICBcbiAgXG4gICAgY29uc3QgZGVzdHJveSA9ICgpID0+IHtcbiAgICAgIGlmIChzdHJlYW0pIHtcbiAgICAgICAgaWYgKF9lcnJvckhhbmRsZXIpIHtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBfZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHN0cmVhbS5kZXN0cm95ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBzdHJlYW0uZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgXG4gICAgcmV0dXJuIHtyZWFkLCBkZXN0cm95LCBzdHJlYW19O1xuICB9XG4gIFxuICBleHBvcnQgZGVmYXVsdCBwcm9taXNlUmVhZGFibGVTdHJlYW1cbiAgIiwiaW1wb3J0IHsgY29tcGlsZUNvZGUgfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XG5pbXBvcnQge1xuICBmaWx0ZXIsIGluY2x1ZGVzLCBtYXAsIGxhc3QsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRBY3R1YWxLZXlPZlBhcmVudCwgaXNHbG9iYWxJbmRleCxcbiAgZ2V0UGFyZW50S2V5LCBpc1NoYXJkZWRJbmRleCxcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7XG4gIGpvaW5LZXksIGlzTm9uRW1wdHlTdHJpbmcsIHNwbGl0S2V5LCAkLFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhlZERhdGFLZXkgPSAoaW5kZXhOb2RlLCBpbmRleEtleSwgcmVjb3JkKSA9PiB7XG4gIGNvbnN0IGdldFNoYXJkTmFtZSA9IChpbmRleE5vZGUsIHJlY29yZCkgPT4ge1xuICAgIGNvbnN0IHNoYXJkTmFtZUZ1bmMgPSBjb21waWxlQ29kZShpbmRleE5vZGUuZ2V0U2hhcmROYW1lKTtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHNoYXJkTmFtZUZ1bmMoeyByZWNvcmQgfSk7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zdCBlcnJvckRldGFpbHMgPSBgc2hhcmRDb2RlOiAke2luZGV4Tm9kZS5nZXRTaGFyZE5hbWV9IDo6IHJlY29yZDogJHtKU09OLnN0cmluZ2lmeShyZWNvcmQpfSA6OiBgXG4gICAgICBlLm1lc3NhZ2UgPSBcIkVycm9yIHJ1bm5pbmcgaW5kZXggc2hhcmRuYW1lIGZ1bmM6IFwiICsgZXJyb3JEZXRhaWxzICsgZS5tZXNzYWdlO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgc2hhcmROYW1lID0gaXNOb25FbXB0eVN0cmluZyhpbmRleE5vZGUuZ2V0U2hhcmROYW1lKVxuICAgID8gYCR7Z2V0U2hhcmROYW1lKGluZGV4Tm9kZSwgcmVjb3JkKX0uY3N2YFxuICAgIDogJ2luZGV4LmNzdic7XG5cbiAgcmV0dXJuIGpvaW5LZXkoaW5kZXhLZXksIHNoYXJkTmFtZSk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U2hhcmRLZXlzSW5SYW5nZSA9IGFzeW5jIChhcHAsIGluZGV4S2V5LCBzdGFydFJlY29yZCA9IG51bGwsIGVuZFJlY29yZCA9IG51bGwpID0+IHtcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShpbmRleEtleSk7XG5cbiAgY29uc3Qgc3RhcnRTaGFyZE5hbWUgPSAhc3RhcnRSZWNvcmRcbiAgICA/IG51bGxcbiAgICA6IHNoYXJkTmFtZUZyb21LZXkoXG4gICAgICBnZXRJbmRleGVkRGF0YUtleShcbiAgICAgICAgaW5kZXhOb2RlLFxuICAgICAgICBpbmRleEtleSxcbiAgICAgICAgc3RhcnRSZWNvcmQsXG4gICAgICApLFxuICAgICk7XG5cbiAgY29uc3QgZW5kU2hhcmROYW1lID0gIWVuZFJlY29yZFxuICAgID8gbnVsbFxuICAgIDogc2hhcmROYW1lRnJvbUtleShcbiAgICAgIGdldEluZGV4ZWREYXRhS2V5KFxuICAgICAgICBpbmRleE5vZGUsXG4gICAgICAgIGluZGV4S2V5LFxuICAgICAgICBlbmRSZWNvcmQsXG4gICAgICApLFxuICAgICk7XG5cbiAgcmV0dXJuICQoYXdhaXQgZ2V0U2hhcmRNYXAoYXBwLmRhdGFzdG9yZSwgaW5kZXhLZXkpLCBbXG4gICAgZmlsdGVyKGsgPT4gKHN0YXJ0UmVjb3JkID09PSBudWxsIHx8IGsgPj0gc3RhcnRTaGFyZE5hbWUpXG4gICAgICAgICAgICAgICAgICAgICYmIChlbmRSZWNvcmQgPT09IG51bGwgfHwgayA8PSBlbmRTaGFyZE5hbWUpKSxcbiAgICBtYXAoayA9PiBqb2luS2V5KGluZGV4S2V5LCBgJHtrfS5jc3ZgKSksXG4gIF0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGVuc3VyZVNoYXJkTmFtZUlzSW5TaGFyZE1hcCA9IGFzeW5jIChzdG9yZSwgaW5kZXhLZXksIGluZGV4ZWREYXRhS2V5KSA9PiB7XG4gIGNvbnN0IG1hcCA9IGF3YWl0IGdldFNoYXJkTWFwKHN0b3JlLCBpbmRleEtleSk7XG4gIGNvbnN0IHNoYXJkTmFtZSA9IHNoYXJkTmFtZUZyb21LZXkoaW5kZXhlZERhdGFLZXkpO1xuICBpZiAoIWluY2x1ZGVzKHNoYXJkTmFtZSkobWFwKSkge1xuICAgIG1hcC5wdXNoKHNoYXJkTmFtZSk7XG4gICAgYXdhaXQgd3JpdGVTaGFyZE1hcChzdG9yZSwgaW5kZXhLZXksIG1hcCk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBnZXRTaGFyZE1hcCA9IGFzeW5jIChkYXRhc3RvcmUsIGluZGV4S2V5KSA9PiB7XG4gIGNvbnN0IHNoYXJkTWFwS2V5ID0gZ2V0U2hhcmRNYXBLZXkoaW5kZXhLZXkpO1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCBkYXRhc3RvcmUubG9hZEpzb24oc2hhcmRNYXBLZXkpO1xuICB9IGNhdGNoIChfKSB7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oc2hhcmRNYXBLZXksIFtdKTtcbiAgICByZXR1cm4gW107XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCB3cml0ZVNoYXJkTWFwID0gYXN5bmMgKGRhdGFzdG9yZSwgaW5kZXhLZXksIHNoYXJkTWFwKSA9PiBhd2FpdCBkYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgZ2V0U2hhcmRNYXBLZXkoaW5kZXhLZXkpLFxuICBzaGFyZE1hcCxcbik7XG5cbmV4cG9ydCBjb25zdCBnZXRBbGxTaGFyZEtleXMgPSBhc3luYyAoYXBwLCBpbmRleEtleSkgPT4gYXdhaXQgZ2V0U2hhcmRLZXlzSW5SYW5nZShhcHAsIGluZGV4S2V5KTtcblxuZXhwb3J0IGNvbnN0IGdldFNoYXJkTWFwS2V5ID0gaW5kZXhLZXkgPT4gam9pbktleShpbmRleEtleSwgJ3NoYXJkTWFwLmpzb24nKTtcblxuZXhwb3J0IGNvbnN0IGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSA9IGluZGV4S2V5ID0+IGpvaW5LZXkoaW5kZXhLZXksICdpbmRleC5jc3YnKTtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4Rm9sZGVyS2V5ID0gaW5kZXhLZXkgPT4gaW5kZXhLZXk7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVJbmRleEZpbGUgPSBhc3luYyAoZGF0YXN0b3JlLCBpbmRleGVkRGF0YUtleSwgaW5kZXgpID0+IHtcbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4KSkge1xuICAgIGNvbnN0IGluZGV4S2V5ID0gZ2V0UGFyZW50S2V5KGluZGV4ZWREYXRhS2V5KTtcbiAgICBjb25zdCBzaGFyZE1hcCA9IGF3YWl0IGdldFNoYXJkTWFwKGRhdGFzdG9yZSwgaW5kZXhLZXkpO1xuICAgIHNoYXJkTWFwLnB1c2goXG4gICAgICBzaGFyZE5hbWVGcm9tS2V5KGluZGV4ZWREYXRhS2V5KSxcbiAgICApO1xuICAgIGF3YWl0IHdyaXRlU2hhcmRNYXAoZGF0YXN0b3JlLCBpbmRleEtleSwgc2hhcmRNYXApO1xuICB9XG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGaWxlKGluZGV4ZWREYXRhS2V5LCAnJyk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2hhcmROYW1lRnJvbUtleSA9IGtleSA9PiAkKGtleSwgW1xuICBzcGxpdEtleSxcbiAgbGFzdCxcbl0pLnJlcGxhY2UoJy5jc3YnLCAnJyk7XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleEtleV9CYXNlZE9uRGVjZW5kYW50ID0gKGRlY2VuZGFudEtleSwgaW5kZXhOb2RlKSA9PiB7XG4gIGlmIChpc0dsb2JhbEluZGV4KGluZGV4Tm9kZSkpIHsgcmV0dXJuIGAke2luZGV4Tm9kZS5ub2RlS2V5KCl9YDsgfVxuXG4gIGNvbnN0IGluZGV4ZWREYXRhUGFyZW50S2V5ID0gZ2V0QWN0dWFsS2V5T2ZQYXJlbnQoXG4gICAgaW5kZXhOb2RlLnBhcmVudCgpLm5vZGVLZXkoKSxcbiAgICBkZWNlbmRhbnRLZXksXG4gICk7XG5cbiAgcmV0dXJuIGpvaW5LZXkoXG4gICAgaW5kZXhlZERhdGFQYXJlbnRLZXksXG4gICAgaW5kZXhOb2RlLm5hbWUsXG4gICk7XG59O1xuIiwiaW1wb3J0IHtcbiAgaGFzLCBrZXlzLCBtYXAsIG9yZGVyQnksXG4gIGZpbHRlciwgY29uY2F0LCByZXZlcnNlLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgbWFwUmVjb3JkIH0gZnJvbSAnLi9ldmFsdWF0ZSc7XG5pbXBvcnQgeyBjb25zdHJ1Y3RSZWNvcmQgfSBmcm9tICcuLi9yZWNvcmRBcGkvZ2V0TmV3JztcbmltcG9ydCB7IGdldFNhbXBsZUZpZWxkVmFsdWUsIGRldGVjdFR5cGUsIGFsbCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7ICQgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZ2VuZXJhdGVTY2hlbWEgPSAoaGllcmFyY2h5LCBpbmRleE5vZGUpID0+IHtcbiAgY29uc3QgcmVjb3JkTm9kZXMgPSBnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleChoaWVyYXJjaHksIGluZGV4Tm9kZSk7XG4gIGNvbnN0IG1hcHBlZFJlY29yZHMgPSAkKHJlY29yZE5vZGVzLCBbXG4gICAgbWFwKG4gPT4gbWFwUmVjb3JkKGNyZWF0ZVNhbXBsZVJlY29yZChuKSwgaW5kZXhOb2RlKSksXG4gIF0pO1xuXG4gIC8vIGFsd2F5cyBoYXMgcmVjb3JkIGtleSBhbmQgc29ydCBrZXlcbiAgY29uc3Qgc2NoZW1hID0ge1xuICAgIHNvcnRLZXk6IGFsbC5zdHJpbmcsXG4gICAga2V5OiBhbGwuc3RyaW5nLFxuICB9O1xuXG4gIGNvbnN0IGZpZWxkc0hhcyA9IGhhcyhzY2hlbWEpO1xuICBjb25zdCBzZXRGaWVsZCA9IChmaWVsZE5hbWUsIHZhbHVlKSA9PiB7XG4gICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCB0aGlzVHlwZSA9IGRldGVjdFR5cGUodmFsdWUpO1xuICAgIGlmIChmaWVsZHNIYXMoZmllbGROYW1lKSkge1xuICAgICAgaWYgKHNjaGVtYVtmaWVsZE5hbWVdICE9PSB0aGlzVHlwZSkge1xuICAgICAgICBzY2hlbWFbZmllbGROYW1lXSA9IGFsbC5zdHJpbmc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjaGVtYVtmaWVsZE5hbWVdID0gdGhpc1R5cGU7XG4gICAgfVxuICB9O1xuXG4gIGZvciAoY29uc3QgbWFwcGVkUmVjIG9mIG1hcHBlZFJlY29yZHMpIHtcbiAgICBmb3IgKGNvbnN0IGYgaW4gbWFwcGVkUmVjKSB7XG4gICAgICBzZXRGaWVsZChmLCBtYXBwZWRSZWNbZl0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIHJldHVyaW5nIGFuIGFycmF5IG9mIHtuYW1lLCB0eXBlfVxuICByZXR1cm4gJChzY2hlbWEsIFtcbiAgICBrZXlzLFxuICAgIG1hcChrID0+ICh7IG5hbWU6IGssIHR5cGU6IHNjaGVtYVtrXS5uYW1lIH0pKSxcbiAgICBmaWx0ZXIocyA9PiBzLm5hbWUgIT09ICdzb3J0S2V5JyksXG4gICAgb3JkZXJCeSgnbmFtZScsIFsnZGVzYyddKSwgLy8gcmV2ZXJzZSBhcGxoYVxuICAgIGNvbmNhdChbeyBuYW1lOiAnc29ydEtleScsIHR5cGU6IGFsbC5zdHJpbmcubmFtZSB9XSksIC8vIHNvcnRLZXkgb24gZW5kXG4gICAgcmV2ZXJzZSwgLy8gc29ydEtleSBmaXJzdCwgdGhlbiByZXN0IGFyZSBhbHBoYWJldGljYWxcbiAgXSk7XG59O1xuXG5jb25zdCBjcmVhdGVTYW1wbGVSZWNvcmQgPSByZWNvcmROb2RlID0+IGNvbnN0cnVjdFJlY29yZChcbiAgcmVjb3JkTm9kZSxcbiAgZ2V0U2FtcGxlRmllbGRWYWx1ZSxcbiAgcmVjb3JkTm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksXG4pO1xuIiwiZXhwb3J0IGRlZmF1bHQgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOlxuICAgICAgICAgICAgdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDpcbiAgICAgICAgICAgIHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSk7XG4iLCJcbnZhciBsb29rdXAgPSBbXVxudmFyIHJldkxvb2t1cCA9IFtdXG52YXIgQXJyID0gdHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnID8gVWludDhBcnJheSA6IEFycmF5XG52YXIgaW5pdGVkID0gZmFsc2U7XG5mdW5jdGlvbiBpbml0ICgpIHtcbiAgaW5pdGVkID0gdHJ1ZTtcbiAgdmFyIGNvZGUgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLydcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBsb29rdXBbaV0gPSBjb2RlW2ldXG4gICAgcmV2TG9va3VwW2NvZGUuY2hhckNvZGVBdChpKV0gPSBpXG4gIH1cblxuICByZXZMb29rdXBbJy0nLmNoYXJDb2RlQXQoMCldID0gNjJcbiAgcmV2TG9va3VwWydfJy5jaGFyQ29kZUF0KDApXSA9IDYzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0J5dGVBcnJheSAoYjY0KSB7XG4gIGlmICghaW5pdGVkKSB7XG4gICAgaW5pdCgpO1xuICB9XG4gIHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cbiAgaWYgKGxlbiAlIDQgPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0JylcbiAgfVxuXG4gIC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG4gIC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcbiAgLy8gcmVwcmVzZW50IG9uZSBieXRlXG4gIC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuICAvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG4gIHBsYWNlSG9sZGVycyA9IGI2NFtsZW4gLSAyXSA9PT0gJz0nID8gMiA6IGI2NFtsZW4gLSAxXSA9PT0gJz0nID8gMSA6IDBcblxuICAvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcbiAgYXJyID0gbmV3IEFycihsZW4gKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuICAvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG4gIGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gbGVuIC0gNCA6IGxlblxuXG4gIHZhciBMID0gMFxuXG4gIGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxOCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgMTIpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildIDw8IDYpIHwgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAzKV1cbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gMTYpICYgMHhGRlxuICAgIGFycltMKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAyKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA+PiA0KVxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDEwKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCA0KSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA+PiAyKVxuICAgIGFycltMKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcbiAgcmV0dXJuIGxvb2t1cFtudW0gPj4gMTggJiAweDNGXSArIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArIGxvb2t1cFtudW0gPj4gNiAmIDB4M0ZdICsgbG9va3VwW251bSAmIDB4M0ZdXG59XG5cbmZ1bmN0aW9uIGVuY29kZUNodW5rICh1aW50OCwgc3RhcnQsIGVuZCkge1xuICB2YXIgdG1wXG4gIHZhciBvdXRwdXQgPSBbXVxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkgKz0gMykge1xuICAgIHRtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcbiAgICBvdXRwdXQucHVzaCh0cmlwbGV0VG9CYXNlNjQodG1wKSlcbiAgfVxuICByZXR1cm4gb3V0cHV0LmpvaW4oJycpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tQnl0ZUFycmF5ICh1aW50OCkge1xuICBpZiAoIWluaXRlZCkge1xuICAgIGluaXQoKTtcbiAgfVxuICB2YXIgdG1wXG4gIHZhciBsZW4gPSB1aW50OC5sZW5ndGhcbiAgdmFyIGV4dHJhQnl0ZXMgPSBsZW4gJSAzIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG4gIHZhciBvdXRwdXQgPSAnJ1xuICB2YXIgcGFydHMgPSBbXVxuICB2YXIgbWF4Q2h1bmtMZW5ndGggPSAxNjM4MyAvLyBtdXN0IGJlIG11bHRpcGxlIG9mIDNcblxuICAvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4yID0gbGVuIC0gZXh0cmFCeXRlczsgaSA8IGxlbjI7IGkgKz0gbWF4Q2h1bmtMZW5ndGgpIHtcbiAgICBwYXJ0cy5wdXNoKGVuY29kZUNodW5rKHVpbnQ4LCBpLCAoaSArIG1heENodW5rTGVuZ3RoKSA+IGxlbjIgPyBsZW4yIDogKGkgKyBtYXhDaHVua0xlbmd0aCkpKVxuICB9XG5cbiAgLy8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuICBpZiAoZXh0cmFCeXRlcyA9PT0gMSkge1xuICAgIHRtcCA9IHVpbnQ4W2xlbiAtIDFdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMl1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgNCkgJiAweDNGXVxuICAgIG91dHB1dCArPSAnPT0nXG4gIH0gZWxzZSBpZiAoZXh0cmFCeXRlcyA9PT0gMikge1xuICAgIHRtcCA9ICh1aW50OFtsZW4gLSAyXSA8PCA4KSArICh1aW50OFtsZW4gLSAxXSlcbiAgICBvdXRwdXQgKz0gbG9va3VwW3RtcCA+PiAxMF1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPj4gNCkgJiAweDNGXVxuICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA8PCAyKSAmIDB4M0ZdXG4gICAgb3V0cHV0ICs9ICc9J1xuICB9XG5cbiAgcGFydHMucHVzaChvdXRwdXQpXG5cbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiByZWFkIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdyaXRlIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbmV4cG9ydCBkZWZhdWx0IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKGFycikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChhcnIpID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cblxuXG5pbXBvcnQgKiBhcyBiYXNlNjQgZnJvbSAnLi9iYXNlNjQnXG5pbXBvcnQgKiBhcyBpZWVlNzU0IGZyb20gJy4vaWVlZTc1NCdcbmltcG9ydCBpc0FycmF5IGZyb20gJy4vaXNBcnJheSdcblxuZXhwb3J0IHZhciBJTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKG1vc3QgY29tcGF0aWJsZSwgZXZlbiBJRTYpXG4gKlxuICogQnJvd3NlcnMgdGhhdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLCBDaHJvbWUgNyssIFNhZmFyaSA1LjErLFxuICogT3BlcmEgMTEuNissIGlPUyA0LjIrLlxuICpcbiAqIER1ZSB0byB2YXJpb3VzIGJyb3dzZXIgYnVncywgc29tZXRpbWVzIHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24gd2lsbCBiZSB1c2VkIGV2ZW5cbiAqIHdoZW4gdGhlIGJyb3dzZXIgc3VwcG9ydHMgdHlwZWQgYXJyYXlzLlxuICpcbiAqIE5vdGU6XG4gKlxuICogICAtIEZpcmVmb3ggNC0yOSBsYWNrcyBzdXBwb3J0IGZvciBhZGRpbmcgbmV3IHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcyxcbiAqICAgICBTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOC5cbiAqXG4gKiAgIC0gQ2hyb21lIDktMTAgaXMgbWlzc2luZyB0aGUgYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbi5cbiAqXG4gKiAgIC0gSUUxMCBoYXMgYSBicm9rZW4gYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFycmF5cyBvZlxuICogICAgIGluY29ycmVjdCBsZW5ndGggaW4gc29tZSBzaXR1YXRpb25zLlxuXG4gKiBXZSBkZXRlY3QgdGhlc2UgYnVnZ3kgYnJvd3NlcnMgYW5kIHNldCBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgIHRvIGBmYWxzZWAgc28gdGhleVxuICogZ2V0IHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24sIHdoaWNoIGlzIHNsb3dlciBidXQgYmVoYXZlcyBjb3JyZWN0bHkuXG4gKi9cbkJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUID0gZ2xvYmFsLlRZUEVEX0FSUkFZX1NVUFBPUlQgIT09IHVuZGVmaW5lZFxuICA/IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gIDogdHJ1ZVxuXG4vKlxuICogRXhwb3J0IGtNYXhMZW5ndGggYWZ0ZXIgdHlwZWQgYXJyYXkgc3VwcG9ydCBpcyBkZXRlcm1pbmVkLlxuICovXG52YXIgX2tNYXhMZW5ndGggPSBrTWF4TGVuZ3RoKClcbmV4cG9ydCB7X2tNYXhMZW5ndGggYXMga01heExlbmd0aH07XG5mdW5jdGlvbiB0eXBlZEFycmF5U3VwcG9ydCAoKSB7XG4gIHJldHVybiB0cnVlO1xuICAvLyByb2xsdXAgaXNzdWVzXG4gIC8vIHRyeSB7XG4gIC8vICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KDEpXG4gIC8vICAgYXJyLl9fcHJvdG9fXyA9IHtcbiAgLy8gICAgIF9fcHJvdG9fXzogVWludDhBcnJheS5wcm90b3R5cGUsXG4gIC8vICAgICBmb286IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH1cbiAgLy8gICB9XG4gIC8vICAgcmV0dXJuIGFyci5mb28oKSA9PT0gNDIgJiYgLy8gdHlwZWQgYXJyYXkgaW5zdGFuY2VzIGNhbiBiZSBhdWdtZW50ZWRcbiAgLy8gICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAmJiAvLyBjaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgLy8gICAgICAgYXJyLnN1YmFycmF5KDEsIDEpLmJ5dGVMZW5ndGggPT09IDAgLy8gaWUxMCBoYXMgYnJva2VuIGBzdWJhcnJheWBcbiAgLy8gfSBjYXRjaCAoZSkge1xuICAvLyAgIHJldHVybiBmYWxzZVxuICAvLyB9XG59XG5cbmZ1bmN0aW9uIGtNYXhMZW5ndGggKCkge1xuICByZXR1cm4gQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgICA/IDB4N2ZmZmZmZmZcbiAgICA6IDB4M2ZmZmZmZmZcbn1cblxuZnVuY3Rpb24gY3JlYXRlQnVmZmVyICh0aGF0LCBsZW5ndGgpIHtcbiAgaWYgKGtNYXhMZW5ndGgoKSA8IGxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHR5cGVkIGFycmF5IGxlbmd0aCcpXG4gIH1cbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgdGhhdCA9IG5ldyBVaW50OEFycmF5KGxlbmd0aClcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgaWYgKHRoYXQgPT09IG51bGwpIHtcbiAgICAgIHRoYXQgPSBuZXcgQnVmZmVyKGxlbmd0aClcbiAgICB9XG4gICAgdGhhdC5sZW5ndGggPSBsZW5ndGhcbiAgfVxuXG4gIHJldHVybiB0aGF0XG59XG5cbi8qKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBoYXZlIHRoZWlyXG4gKiBwcm90b3R5cGUgY2hhbmdlZCB0byBgQnVmZmVyLnByb3RvdHlwZWAuIEZ1cnRoZXJtb3JlLCBgQnVmZmVyYCBpcyBhIHN1YmNsYXNzIG9mXG4gKiBgVWludDhBcnJheWAsIHNvIHRoZSByZXR1cm5lZCBpbnN0YW5jZXMgd2lsbCBoYXZlIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBtZXRob2RzXG4gKiBhbmQgdGhlIGBVaW50OEFycmF5YCBtZXRob2RzLiBTcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdFxuICogcmV0dXJucyBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBUaGUgYFVpbnQ4QXJyYXlgIHByb3RvdHlwZSByZW1haW5zIHVubW9kaWZpZWQuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1ZmZlciAoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiAhKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICAvLyBDb21tb24gY2FzZS5cbiAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZ09yT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnSWYgZW5jb2RpbmcgaXMgc3BlY2lmaWVkIHRoZW4gdGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBhbGxvY1Vuc2FmZSh0aGlzLCBhcmcpXG4gIH1cbiAgcmV0dXJuIGZyb20odGhpcywgYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTIgLy8gbm90IHVzZWQgYnkgdGhpcyBpbXBsZW1lbnRhdGlvblxuXG4vLyBUT0RPOiBMZWdhY3ksIG5vdCBuZWVkZWQgYW55bW9yZS4gUmVtb3ZlIGluIG5leHQgbWFqb3IgdmVyc2lvbi5cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiBmcm9tICh0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIGEgbnVtYmVyJylcbiAgfVxuXG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0KVxuICB9XG5cbiAgcmV0dXJuIGZyb21PYmplY3QodGhhdCwgdmFsdWUpXG59XG5cbi8qKlxuICogRnVuY3Rpb25hbGx5IGVxdWl2YWxlbnQgdG8gQnVmZmVyKGFyZywgZW5jb2RpbmcpIGJ1dCB0aHJvd3MgYSBUeXBlRXJyb3JcbiAqIGlmIHZhbHVlIGlzIGEgbnVtYmVyLlxuICogQnVmZmVyLmZyb20oc3RyWywgZW5jb2RpbmddKVxuICogQnVmZmVyLmZyb20oYXJyYXkpXG4gKiBCdWZmZXIuZnJvbShidWZmZXIpXG4gKiBCdWZmZXIuZnJvbShhcnJheUJ1ZmZlclssIGJ5dGVPZmZzZXRbLCBsZW5ndGhdXSlcbiAqKi9cbkJ1ZmZlci5mcm9tID0gZnVuY3Rpb24gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGZyb20obnVsbCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gIEJ1ZmZlci5wcm90b3R5cGUuX19wcm90b19fID0gVWludDhBcnJheS5wcm90b3R5cGVcbiAgQnVmZmVyLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXlcbiAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC5zcGVjaWVzICYmXG4gICAgICBCdWZmZXJbU3ltYm9sLnNwZWNpZXNdID09PSBCdWZmZXIpIHtcbiAgICAvLyBGaXggc3ViYXJyYXkoKSBpbiBFUzIwMTYuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvcHVsbC85N1xuICAgIC8vIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIsIFN5bWJvbC5zcGVjaWVzLCB7XG4gICAgLy8gICB2YWx1ZTogbnVsbCxcbiAgICAvLyAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIC8vIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gYXNzZXJ0U2l6ZSAoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBiZSBhIG51bWJlcicpXG4gIH0gZWxzZSBpZiAoc2l6ZSA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgbmVnYXRpdmUnKVxuICB9XG59XG5cbmZ1bmN0aW9uIGFsbG9jICh0aGF0LCBzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIGlmIChzaXplIDw9IDApIHtcbiAgICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpXG4gIH1cbiAgaWYgKGZpbGwgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIE9ubHkgcGF5IGF0dGVudGlvbiB0byBlbmNvZGluZyBpZiBpdCdzIGEgc3RyaW5nLiBUaGlzXG4gICAgLy8gcHJldmVudHMgYWNjaWRlbnRhbGx5IHNlbmRpbmcgaW4gYSBudW1iZXIgdGhhdCB3b3VsZFxuICAgIC8vIGJlIGludGVycHJldHRlZCBhcyBhIHN0YXJ0IG9mZnNldC5cbiAgICByZXR1cm4gdHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJ1xuICAgICAgPyBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSkuZmlsbChmaWxsLCBlbmNvZGluZylcbiAgICAgIDogY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpLmZpbGwoZmlsbClcbiAgfVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBmaWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogYWxsb2Moc2l6ZVssIGZpbGxbLCBlbmNvZGluZ11dKVxuICoqL1xuQnVmZmVyLmFsbG9jID0gZnVuY3Rpb24gKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIHJldHVybiBhbGxvYyhudWxsLCBzaXplLCBmaWxsLCBlbmNvZGluZylcbn1cblxuZnVuY3Rpb24gYWxsb2NVbnNhZmUgKHRoYXQsIHNpemUpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUgPCAwID8gMCA6IGNoZWNrZWQoc2l6ZSkgfCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyArK2kpIHtcbiAgICAgIHRoYXRbaV0gPSAwXG4gICAgfVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbi8qKlxuICogRXF1aXZhbGVudCB0byBCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqICovXG5CdWZmZXIuYWxsb2NVbnNhZmUgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUobnVsbCwgc2l6ZSlcbn1cbi8qKlxuICogRXF1aXZhbGVudCB0byBTbG93QnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZVNsb3cgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUobnVsbCwgc2l6ZSlcbn1cblxuZnVuY3Rpb24gZnJvbVN0cmluZyAodGhhdCwgc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJyB8fCBlbmNvZGluZyA9PT0gJycpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICB9XG5cbiAgaWYgKCFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImVuY29kaW5nXCIgbXVzdCBiZSBhIHZhbGlkIHN0cmluZyBlbmNvZGluZycpXG4gIH1cblxuICB2YXIgbGVuZ3RoID0gYnl0ZUxlbmd0aChzdHJpbmcsIGVuY29kaW5nKSB8IDBcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBsZW5ndGgpXG5cbiAgdmFyIGFjdHVhbCA9IHRoYXQud3JpdGUoc3RyaW5nLCBlbmNvZGluZylcblxuICBpZiAoYWN0dWFsICE9PSBsZW5ndGgpIHtcbiAgICAvLyBXcml0aW5nIGEgaGV4IHN0cmluZywgZm9yIGV4YW1wbGUsIHRoYXQgY29udGFpbnMgaW52YWxpZCBjaGFyYWN0ZXJzIHdpbGxcbiAgICAvLyBjYXVzZSBldmVyeXRoaW5nIGFmdGVyIHRoZSBmaXJzdCBpbnZhbGlkIGNoYXJhY3RlciB0byBiZSBpZ25vcmVkLiAoZS5nLlxuICAgIC8vICdhYnh4Y2QnIHdpbGwgYmUgdHJlYXRlZCBhcyAnYWInKVxuICAgIHRoYXQgPSB0aGF0LnNsaWNlKDAsIGFjdHVhbClcbiAgfVxuXG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUxpa2UgKHRoYXQsIGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGggPCAwID8gMCA6IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICB0aGF0W2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlCdWZmZXIgKHRoYXQsIGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgYXJyYXkuYnl0ZUxlbmd0aCAvLyB0aGlzIHRocm93cyBpZiBgYXJyYXlgIGlzIG5vdCBhIHZhbGlkIEFycmF5QnVmZmVyXG5cbiAgaWYgKGJ5dGVPZmZzZXQgPCAwIHx8IGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0KSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ29mZnNldFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCArIChsZW5ndGggfHwgMCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXFwnbGVuZ3RoXFwnIGlzIG91dCBvZiBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGJ5dGVPZmZzZXQgPT09IHVuZGVmaW5lZCAmJiBsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXkpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0KVxuICB9IGVsc2Uge1xuICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoYXQgPSBhcnJheVxuICAgIHRoYXQuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gYW4gb2JqZWN0IGluc3RhbmNlIG9mIHRoZSBCdWZmZXIgY2xhc3NcbiAgICB0aGF0ID0gZnJvbUFycmF5TGlrZSh0aGF0LCBhcnJheSlcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tT2JqZWN0ICh0aGF0LCBvYmopIHtcbiAgaWYgKGludGVybmFsSXNCdWZmZXIob2JqKSkge1xuICAgIHZhciBsZW4gPSBjaGVja2VkKG9iai5sZW5ndGgpIHwgMFxuICAgIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuKVxuXG4gICAgaWYgKHRoYXQubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhhdFxuICAgIH1cblxuICAgIG9iai5jb3B5KHRoYXQsIDAsIDAsIGxlbilcbiAgICByZXR1cm4gdGhhdFxuICB9XG5cbiAgaWYgKG9iaikge1xuICAgIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICBvYmouYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHx8ICdsZW5ndGgnIGluIG9iaikge1xuICAgICAgaWYgKHR5cGVvZiBvYmoubGVuZ3RoICE9PSAnbnVtYmVyJyB8fCBpc25hbihvYmoubGVuZ3RoKSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIDApXG4gICAgICB9XG4gICAgICByZXR1cm4gZnJvbUFycmF5TGlrZSh0aGF0LCBvYmopXG4gICAgfVxuXG4gICAgaWYgKG9iai50eXBlID09PSAnQnVmZmVyJyAmJiBpc0FycmF5KG9iai5kYXRhKSkge1xuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqLmRhdGEpXG4gICAgfVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksIG9yIGFycmF5LWxpa2Ugb2JqZWN0LicpXG59XG5cbmZ1bmN0aW9uIGNoZWNrZWQgKGxlbmd0aCkge1xuICAvLyBOb3RlOiBjYW5ub3QgdXNlIGBsZW5ndGggPCBrTWF4TGVuZ3RoKClgIGhlcmUgYmVjYXVzZSB0aGF0IGZhaWxzIHdoZW5cbiAgLy8gbGVuZ3RoIGlzIE5hTiAod2hpY2ggaXMgb3RoZXJ3aXNlIGNvZXJjZWQgdG8gemVyby4pXG4gIGlmIChsZW5ndGggPj0ga01heExlbmd0aCgpKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gYWxsb2NhdGUgQnVmZmVyIGxhcmdlciB0aGFuIG1heGltdW0gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ3NpemU6IDB4JyArIGtNYXhMZW5ndGgoKS50b1N0cmluZygxNikgKyAnIGJ5dGVzJylcbiAgfVxuICByZXR1cm4gbGVuZ3RoIHwgMFxufVxuXG5leHBvcnQgZnVuY3Rpb24gU2xvd0J1ZmZlciAobGVuZ3RoKSB7XG4gIGlmICgrbGVuZ3RoICE9IGxlbmd0aCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuICAgIGxlbmd0aCA9IDBcbiAgfVxuICByZXR1cm4gQnVmZmVyLmFsbG9jKCtsZW5ndGgpXG59XG5CdWZmZXIuaXNCdWZmZXIgPSBpc0J1ZmZlcjtcbmZ1bmN0aW9uIGludGVybmFsSXNCdWZmZXIgKGIpIHtcbiAgcmV0dXJuICEhKGIgIT0gbnVsbCAmJiBiLl9pc0J1ZmZlcilcbn1cblxuQnVmZmVyLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlIChhLCBiKSB7XG4gIGlmICghaW50ZXJuYWxJc0J1ZmZlcihhKSB8fCAhaW50ZXJuYWxJc0J1ZmZlcihiKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyBtdXN0IGJlIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGEgPT09IGIpIHJldHVybiAwXG5cbiAgdmFyIHggPSBhLmxlbmd0aFxuICB2YXIgeSA9IGIubGVuZ3RoXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV1cbiAgICAgIHkgPSBiW2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiBpc0VuY29kaW5nIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdsYXRpbjEnOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdCAobGlzdCwgbGVuZ3RoKSB7XG4gIGlmICghaXNBcnJheShsaXN0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gIH1cblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gQnVmZmVyLmFsbG9jKDApXG4gIH1cblxuICB2YXIgaVxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBsZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWZmZXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUobGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgIHZhciBidWYgPSBsaXN0W2ldXG4gICAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKGJ1ZikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gICAgfVxuICAgIGJ1Zi5jb3B5KGJ1ZmZlciwgcG9zKVxuICAgIHBvcyArPSBidWYubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZmZlclxufVxuXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmIChpbnRlcm5hbElzQnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBBcnJheUJ1ZmZlci5pc1ZpZXcgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIChBcnJheUJ1ZmZlci5pc1ZpZXcoc3RyaW5nKSB8fCBzdHJpbmcgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikpIHtcbiAgICByZXR1cm4gc3RyaW5nLmJ5dGVMZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICBzdHJpbmcgPSAnJyArIHN0cmluZ1xuICB9XG5cbiAgdmFyIGxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKGxlbiA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBVc2UgYSBmb3IgbG9vcCB0byBhdm9pZCByZWN1cnNpb25cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGVuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiBsZW4gKiAyXG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gbGVuID4+PiAxXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGggLy8gYXNzdW1lIHV0ZjhcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuXG5mdW5jdGlvbiBzbG93VG9TdHJpbmcgKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG5cbiAgLy8gTm8gbmVlZCB0byB2ZXJpZnkgdGhhdCBcInRoaXMubGVuZ3RoIDw9IE1BWF9VSU5UMzJcIiBzaW5jZSBpdCdzIGEgcmVhZC1vbmx5XG4gIC8vIHByb3BlcnR5IG9mIGEgdHlwZWQgYXJyYXkuXG5cbiAgLy8gVGhpcyBiZWhhdmVzIG5laXRoZXIgbGlrZSBTdHJpbmcgbm9yIFVpbnQ4QXJyYXkgaW4gdGhhdCB3ZSBzZXQgc3RhcnQvZW5kXG4gIC8vIHRvIHRoZWlyIHVwcGVyL2xvd2VyIGJvdW5kcyBpZiB0aGUgdmFsdWUgcGFzc2VkIGlzIG91dCBvZiByYW5nZS5cbiAgLy8gdW5kZWZpbmVkIGlzIGhhbmRsZWQgc3BlY2lhbGx5IGFzIHBlciBFQ01BLTI2MiA2dGggRWRpdGlvbixcbiAgLy8gU2VjdGlvbiAxMy4zLjMuNyBSdW50aW1lIFNlbWFudGljczogS2V5ZWRCaW5kaW5nSW5pdGlhbGl6YXRpb24uXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkIHx8IHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIC8vIFJldHVybiBlYXJseSBpZiBzdGFydCA+IHRoaXMubGVuZ3RoLiBEb25lIGhlcmUgdG8gcHJldmVudCBwb3RlbnRpYWwgdWludDMyXG4gIC8vIGNvZXJjaW9uIGZhaWwgYmVsb3cuXG4gIGlmIChzdGFydCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVuZCA8PSAwKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICAvLyBGb3JjZSBjb2Vyc2lvbiB0byB1aW50MzIuIFRoaXMgd2lsbCBhbHNvIGNvZXJjZSBmYWxzZXkvTmFOIHZhbHVlcyB0byAwLlxuICBlbmQgPj4+PSAwXG4gIHN0YXJ0ID4+Pj0gMFxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdXRmMTZsZVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9IChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vLyBUaGUgcHJvcGVydHkgaXMgdXNlZCBieSBgQnVmZmVyLmlzQnVmZmVyYCBhbmQgYGlzLWJ1ZmZlcmAgKGluIFNhZmFyaSA1LTcpIHRvIGRldGVjdFxuLy8gQnVmZmVyIGluc3RhbmNlcy5cbkJ1ZmZlci5wcm90b3R5cGUuX2lzQnVmZmVyID0gdHJ1ZVxuXG5mdW5jdGlvbiBzd2FwIChiLCBuLCBtKSB7XG4gIHZhciBpID0gYltuXVxuICBiW25dID0gYlttXVxuICBiW21dID0gaVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAxNiA9IGZ1bmN0aW9uIHN3YXAxNiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgMiAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMTYtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDEpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMzIgPSBmdW5jdGlvbiBzd2FwMzIgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDQgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDMyLWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAzKVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyAyKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDY0ID0gZnVuY3Rpb24gc3dhcDY0ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA4ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA2NC1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA4KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgNylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgNilcbiAgICBzd2FwKHRoaXMsIGkgKyAyLCBpICsgNSlcbiAgICBzd2FwKHRoaXMsIGkgKyAzLCBpICsgNClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGggfCAwXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAnJ1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCAwLCBsZW5ndGgpXG4gIHJldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAoYikge1xuICBpZiAoIWludGVybmFsSXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIHRydWVcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpID09PSAwXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QgKCkge1xuICB2YXIgc3RyID0gJydcbiAgdmFyIG1heCA9IElOU1BFQ1RfTUFYX0JZVEVTXG4gIGlmICh0aGlzLmxlbmd0aCA+IDApIHtcbiAgICBzdHIgPSB0aGlzLnRvU3RyaW5nKCdoZXgnLCAwLCBtYXgpLm1hdGNoKC8uezJ9L2cpLmpvaW4oJyAnKVxuICAgIGlmICh0aGlzLmxlbmd0aCA+IG1heCkgc3RyICs9ICcgLi4uICdcbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIHN0ciArICc+J1xufVxuXG5CdWZmZXIucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlICh0YXJnZXQsIHN0YXJ0LCBlbmQsIHRoaXNTdGFydCwgdGhpc0VuZCkge1xuICBpZiAoIWludGVybmFsSXNCdWZmZXIodGFyZ2V0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICB9XG5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSB0YXJnZXQgPyB0YXJnZXQubGVuZ3RoIDogMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNTdGFydCA9IDBcbiAgfVxuICBpZiAodGhpc0VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc0VuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IGVuZCA+IHRhcmdldC5sZW5ndGggfHwgdGhpc1N0YXJ0IDwgMCB8fCB0aGlzRW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCAmJiBzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCkge1xuICAgIHJldHVybiAtMVxuICB9XG4gIGlmIChzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgc3RhcnQgPj4+PSAwXG4gIGVuZCA+Pj49IDBcbiAgdGhpc1N0YXJ0ID4+Pj0gMFxuICB0aGlzRW5kID4+Pj0gMFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQpIHJldHVybiAwXG5cbiAgdmFyIHggPSB0aGlzRW5kIC0gdGhpc1N0YXJ0XG4gIHZhciB5ID0gZW5kIC0gc3RhcnRcbiAgdmFyIGxlbiA9IE1hdGgubWluKHgsIHkpXG5cbiAgdmFyIHRoaXNDb3B5ID0gdGhpcy5zbGljZSh0aGlzU3RhcnQsIHRoaXNFbmQpXG4gIHZhciB0YXJnZXRDb3B5ID0gdGFyZ2V0LnNsaWNlKHN0YXJ0LCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIGlmICh0aGlzQ29weVtpXSAhPT0gdGFyZ2V0Q29weVtpXSkge1xuICAgICAgeCA9IHRoaXNDb3B5W2ldXG4gICAgICB5ID0gdGFyZ2V0Q29weVtpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbi8vIEZpbmRzIGVpdGhlciB0aGUgZmlyc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0ID49IGBieXRlT2Zmc2V0YCxcbi8vIE9SIHRoZSBsYXN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA8PSBgYnl0ZU9mZnNldGAuXG4vL1xuLy8gQXJndW1lbnRzOlxuLy8gLSBidWZmZXIgLSBhIEJ1ZmZlciB0byBzZWFyY2hcbi8vIC0gdmFsIC0gYSBzdHJpbmcsIEJ1ZmZlciwgb3IgbnVtYmVyXG4vLyAtIGJ5dGVPZmZzZXQgLSBhbiBpbmRleCBpbnRvIGBidWZmZXJgOyB3aWxsIGJlIGNsYW1wZWQgdG8gYW4gaW50MzJcbi8vIC0gZW5jb2RpbmcgLSBhbiBvcHRpb25hbCBlbmNvZGluZywgcmVsZXZhbnQgaXMgdmFsIGlzIGEgc3RyaW5nXG4vLyAtIGRpciAtIHRydWUgZm9yIGluZGV4T2YsIGZhbHNlIGZvciBsYXN0SW5kZXhPZlxuZnVuY3Rpb24gYmlkaXJlY3Rpb25hbEluZGV4T2YgKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIC8vIEVtcHR5IGJ1ZmZlciBtZWFucyBubyBtYXRjaFxuICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXRcbiAgaWYgKHR5cGVvZiBieXRlT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gYnl0ZU9mZnNldFxuICAgIGJ5dGVPZmZzZXQgPSAwXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIHtcbiAgICBieXRlT2Zmc2V0ID0gMHg3ZmZmZmZmZlxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkge1xuICAgIGJ5dGVPZmZzZXQgPSAtMHg4MDAwMDAwMFxuICB9XG4gIGJ5dGVPZmZzZXQgPSArYnl0ZU9mZnNldCAgLy8gQ29lcmNlIHRvIE51bWJlci5cbiAgaWYgKGlzTmFOKGJ5dGVPZmZzZXQpKSB7XG4gICAgLy8gYnl0ZU9mZnNldDogaXQgaXQncyB1bmRlZmluZWQsIG51bGwsIE5hTiwgXCJmb29cIiwgZXRjLCBzZWFyY2ggd2hvbGUgYnVmZmVyXG4gICAgYnl0ZU9mZnNldCA9IGRpciA/IDAgOiAoYnVmZmVyLmxlbmd0aCAtIDEpXG4gIH1cblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldDogbmVnYXRpdmUgb2Zmc2V0cyBzdGFydCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICBpZiAoYnl0ZU9mZnNldCA8IDApIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoICsgYnl0ZU9mZnNldFxuICBpZiAoYnl0ZU9mZnNldCA+PSBidWZmZXIubGVuZ3RoKSB7XG4gICAgaWYgKGRpcikgcmV0dXJuIC0xXG4gICAgZWxzZSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCAtIDFcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgMCkge1xuICAgIGlmIChkaXIpIGJ5dGVPZmZzZXQgPSAwXG4gICAgZWxzZSByZXR1cm4gLTFcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB2YWxcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsID0gQnVmZmVyLmZyb20odmFsLCBlbmNvZGluZylcbiAgfVxuXG4gIC8vIEZpbmFsbHksIHNlYXJjaCBlaXRoZXIgaW5kZXhPZiAoaWYgZGlyIGlzIHRydWUpIG9yIGxhc3RJbmRleE9mXG4gIGlmIChpbnRlcm5hbElzQnVmZmVyKHZhbCkpIHtcbiAgICAvLyBTcGVjaWFsIGNhc2U6IGxvb2tpbmcgZm9yIGVtcHR5IHN0cmluZy9idWZmZXIgYWx3YXlzIGZhaWxzXG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMHhGRiAvLyBTZWFyY2ggZm9yIGEgYnl0ZSB2YWx1ZSBbMC0yNTVdXG4gICAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmXG4gICAgICAgIHR5cGVvZiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAoZGlyKSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIFsgdmFsIF0sIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCd2YWwgbXVzdCBiZSBzdHJpbmcsIG51bWJlciBvciBCdWZmZXInKVxufVxuXG5mdW5jdGlvbiBhcnJheUluZGV4T2YgKGFyciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIHZhciBpbmRleFNpemUgPSAxXG4gIHZhciBhcnJMZW5ndGggPSBhcnIubGVuZ3RoXG4gIHZhciB2YWxMZW5ndGggPSB2YWwubGVuZ3RoXG5cbiAgaWYgKGVuY29kaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgIGlmIChlbmNvZGluZyA9PT0gJ3VjczInIHx8IGVuY29kaW5nID09PSAndWNzLTInIHx8XG4gICAgICAgIGVuY29kaW5nID09PSAndXRmMTZsZScgfHwgZW5jb2RpbmcgPT09ICd1dGYtMTZsZScpIHtcbiAgICAgIGlmIChhcnIubGVuZ3RoIDwgMiB8fCB2YWwubGVuZ3RoIDwgMikge1xuICAgICAgICByZXR1cm4gLTFcbiAgICAgIH1cbiAgICAgIGluZGV4U2l6ZSA9IDJcbiAgICAgIGFyckxlbmd0aCAvPSAyXG4gICAgICB2YWxMZW5ndGggLz0gMlxuICAgICAgYnl0ZU9mZnNldCAvPSAyXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZCAoYnVmLCBpKSB7XG4gICAgaWYgKGluZGV4U2l6ZSA9PT0gMSkge1xuICAgICAgcmV0dXJuIGJ1ZltpXVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYnVmLnJlYWRVSW50MTZCRShpICogaW5kZXhTaXplKVxuICAgIH1cbiAgfVxuXG4gIHZhciBpXG4gIGlmIChkaXIpIHtcbiAgICB2YXIgZm91bmRJbmRleCA9IC0xXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA8IGFyckxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocmVhZChhcnIsIGkpID09PSByZWFkKHZhbCwgZm91bmRJbmRleCA9PT0gLTEgPyAwIDogaSAtIGZvdW5kSW5kZXgpKSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ID09PSAtMSkgZm91bmRJbmRleCA9IGlcbiAgICAgICAgaWYgKGkgLSBmb3VuZEluZGV4ICsgMSA9PT0gdmFsTGVuZ3RoKSByZXR1cm4gZm91bmRJbmRleCAqIGluZGV4U2l6ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggIT09IC0xKSBpIC09IGkgLSBmb3VuZEluZGV4XG4gICAgICAgIGZvdW5kSW5kZXggPSAtMVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYnl0ZU9mZnNldCArIHZhbExlbmd0aCA+IGFyckxlbmd0aCkgYnl0ZU9mZnNldCA9IGFyckxlbmd0aCAtIHZhbExlbmd0aFxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YXIgZm91bmQgPSB0cnVlXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZhbExlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmIChyZWFkKGFyciwgaSArIGopICE9PSByZWFkKHZhbCwgaikpIHtcbiAgICAgICAgICBmb3VuZCA9IGZhbHNlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZvdW5kKSByZXR1cm4gaVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXMgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIHRoaXMuaW5kZXhPZih2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSAhPT0gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gaW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgdHJ1ZSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uIGxhc3RJbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBmYWxzZSlcbn1cblxuZnVuY3Rpb24gaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAoc3RyTGVuICUgMiAhPT0gMCkgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHBhcnNlZCA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBpZiAoaXNOYU4ocGFyc2VkKSkgcmV0dXJuIGlcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGxhdGluMVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGFzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gdWNzMldyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIHdyaXRlIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nKVxuICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIG9mZnNldFssIGxlbmd0aF1bLCBlbmNvZGluZ10pXG4gIH0gZWxzZSBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgICBpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgbGVuZ3RoID0gbGVuZ3RoIHwgMFxuICAgICAgaWYgKGVuY29kaW5nID09PSB1bmRlZmluZWQpIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIC8vIGxlZ2FjeSB3cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aCkgLSByZW1vdmUgaW4gdjAuMTNcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnQnVmZmVyLndyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldFssIGxlbmd0aF0pIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQnXG4gICAgKVxuICB9XG5cbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCB8fCBsZW5ndGggPiByZW1haW5pbmcpIGxlbmd0aCA9IHJlbWFpbmluZ1xuXG4gIGlmICgoc3RyaW5nLmxlbmd0aCA+IDAgJiYgKGxlbmd0aCA8IDAgfHwgb2Zmc2V0IDwgMCkpIHx8IG9mZnNldCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gd3JpdGUgb3V0c2lkZSBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGF0aW4xV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgLy8gV2FybmluZzogbWF4TGVuZ3RoIG5vdCB0YWtlbiBpbnRvIGFjY291bnQgaW4gYmFzZTY0V3JpdGVcbiAgICAgICAgcmV0dXJuIGJhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1Y3MyV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG5mdW5jdGlvbiBiYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuICB2YXIgcmVzID0gW11cblxuICB2YXIgaSA9IHN0YXJ0XG4gIHdoaWxlIChpIDwgZW5kKSB7XG4gICAgdmFyIGZpcnN0Qnl0ZSA9IGJ1ZltpXVxuICAgIHZhciBjb2RlUG9pbnQgPSBudWxsXG4gICAgdmFyIGJ5dGVzUGVyU2VxdWVuY2UgPSAoZmlyc3RCeXRlID4gMHhFRikgPyA0XG4gICAgICA6IChmaXJzdEJ5dGUgPiAweERGKSA/IDNcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4QkYpID8gMlxuICAgICAgOiAxXG5cbiAgICBpZiAoaSArIGJ5dGVzUGVyU2VxdWVuY2UgPD0gZW5kKSB7XG4gICAgICB2YXIgc2Vjb25kQnl0ZSwgdGhpcmRCeXRlLCBmb3VydGhCeXRlLCB0ZW1wQ29kZVBvaW50XG5cbiAgICAgIHN3aXRjaCAoYnl0ZXNQZXJTZXF1ZW5jZSkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgaWYgKGZpcnN0Qnl0ZSA8IDB4ODApIHtcbiAgICAgICAgICAgIGNvZGVQb2ludCA9IGZpcnN0Qnl0ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweDFGKSA8PCAweDYgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0YpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHhDIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAodGhpcmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3RkYgJiYgKHRlbXBDb2RlUG9pbnQgPCAweEQ4MDAgfHwgdGVtcENvZGVQb2ludCA+IDB4REZGRikpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgZm91cnRoQnl0ZSA9IGJ1ZltpICsgM11cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKGZvdXJ0aEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4MTIgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4QyB8ICh0aGlyZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAoZm91cnRoQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4RkZGRiAmJiB0ZW1wQ29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29kZVBvaW50ID09PSBudWxsKSB7XG4gICAgICAvLyB3ZSBkaWQgbm90IGdlbmVyYXRlIGEgdmFsaWQgY29kZVBvaW50IHNvIGluc2VydCBhXG4gICAgICAvLyByZXBsYWNlbWVudCBjaGFyIChVK0ZGRkQpIGFuZCBhZHZhbmNlIG9ubHkgMSBieXRlXG4gICAgICBjb2RlUG9pbnQgPSAweEZGRkRcbiAgICAgIGJ5dGVzUGVyU2VxdWVuY2UgPSAxXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPiAweEZGRkYpIHtcbiAgICAgIC8vIGVuY29kZSB0byB1dGYxNiAoc3Vycm9nYXRlIHBhaXIgZGFuY2UpXG4gICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMFxuICAgICAgcmVzLnB1c2goY29kZVBvaW50ID4+PiAxMCAmIDB4M0ZGIHwgMHhEODAwKVxuICAgICAgY29kZVBvaW50ID0gMHhEQzAwIHwgY29kZVBvaW50ICYgMHgzRkZcbiAgICB9XG5cbiAgICByZXMucHVzaChjb2RlUG9pbnQpXG4gICAgaSArPSBieXRlc1BlclNlcXVlbmNlXG4gIH1cblxuICByZXR1cm4gZGVjb2RlQ29kZVBvaW50c0FycmF5KHJlcylcbn1cblxuLy8gQmFzZWQgb24gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjI3NDcyNzIvNjgwNzQyLCB0aGUgYnJvd3NlciB3aXRoXG4vLyB0aGUgbG93ZXN0IGxpbWl0IGlzIENocm9tZSwgd2l0aCAweDEwMDAwIGFyZ3MuXG4vLyBXZSBnbyAxIG1hZ25pdHVkZSBsZXNzLCBmb3Igc2FmZXR5XG52YXIgTUFYX0FSR1VNRU5UU19MRU5HVEggPSAweDEwMDBcblxuZnVuY3Rpb24gZGVjb2RlQ29kZVBvaW50c0FycmF5IChjb2RlUG9pbnRzKSB7XG4gIHZhciBsZW4gPSBjb2RlUG9pbnRzLmxlbmd0aFxuICBpZiAobGVuIDw9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjb2RlUG9pbnRzKSAvLyBhdm9pZCBleHRyYSBzbGljZSgpXG4gIH1cblxuICAvLyBEZWNvZGUgaW4gY2h1bmtzIHRvIGF2b2lkIFwiY2FsbCBzdGFjayBzaXplIGV4Y2VlZGVkXCIuXG4gIHZhciByZXMgPSAnJ1xuICB2YXIgaSA9IDBcbiAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcbiAgICAgIFN0cmluZyxcbiAgICAgIGNvZGVQb2ludHMuc2xpY2UoaSwgaSArPSBNQVhfQVJHVU1FTlRTX0xFTkdUSClcbiAgICApXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSAmIDB4N0YpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBsYXRpbjFTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBoZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSArIDFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIHNsaWNlIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IH5+c3RhcnRcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB+fmVuZFxuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCArPSBsZW5cbiAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgfSBlbHNlIGlmIChzdGFydCA+IGxlbikge1xuICAgIHN0YXJ0ID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5cbiAgICBpZiAoZW5kIDwgMCkgZW5kID0gMFxuICB9IGVsc2UgaWYgKGVuZCA+IGxlbikge1xuICAgIGVuZCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIHZhciBuZXdCdWZcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgbmV3QnVmID0gdGhpcy5zdWJhcnJheShzdGFydCwgZW5kKVxuICAgIG5ld0J1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgKytpKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50TEUgPSBmdW5jdGlvbiByZWFkVUludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50QkUgPSBmdW5jdGlvbiByZWFkVUludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuICB9XG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXVxuICB2YXIgbXVsID0gMVxuICB3aGlsZSAoYnl0ZUxlbmd0aCA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gcmVhZFVJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiByZWFkVUludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDgpIHwgdGhpc1tvZmZzZXQgKyAxXVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAoKHRoaXNbb2Zmc2V0XSkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpKSArXG4gICAgICAodGhpc1tvZmZzZXQgKyAzXSAqIDB4MTAwMDAwMClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiByZWFkVUludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSAqIDB4MTAwMDAwMCkgK1xuICAgICgodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICB0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRMRSA9IGZ1bmN0aW9uIHJlYWRJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRCRSA9IGZ1bmN0aW9uIHJlYWRJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aFxuICB2YXIgbXVsID0gMVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWldXG4gIHdoaWxlIChpID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0taV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gcmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgaWYgKCEodGhpc1tvZmZzZXRdICYgMHg4MCkpIHJldHVybiAodGhpc1tvZmZzZXRdKVxuICByZXR1cm4gKCgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiByZWFkSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAxXSB8ICh0aGlzW29mZnNldF0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gcmVhZEludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDNdIDw8IDI0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gcmVhZEludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCAyNCkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gcmVhZEZsb2F0TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gcmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiByZWFkRG91YmxlTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghaW50ZXJuYWxJc0J1ZmZlcihidWYpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImJ1ZmZlclwiIGFyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXIgaW5zdGFuY2UnKVxuICBpZiAodmFsdWUgPiBtYXggfHwgdmFsdWUgPCBtaW4pIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgaXMgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlVUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlVUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVVSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweGZmLCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUpXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbmZ1bmN0aW9uIG9iamVjdFdyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbikge1xuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDIpOyBpIDwgajsgKytpKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbmZ1bmN0aW9uIG9iamVjdFdyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbikge1xuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCA0KTsgaSA8IGo7ICsraSkge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSA+Pj4gKGxpdHRsZUVuZGlhbiA/IGkgOiAzIC0gaSkgKiA4KSAmIDB4ZmZcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSAwXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSAtIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSArIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4N2YsIC0weDgwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUpXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5mdW5jdGlvbiBjaGVja0lFRUU3NTQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuZnVuY3Rpb24gd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA0LCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiB3cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA4LCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkgKHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldFN0YXJ0ID49IHRhcmdldC5sZW5ndGgpIHRhcmdldFN0YXJ0ID0gdGFyZ2V0Lmxlbmd0aFxuICBpZiAoIXRhcmdldFN0YXJ0KSB0YXJnZXRTdGFydCA9IDBcbiAgaWYgKGVuZCA+IDAgJiYgZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMFxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCB0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGlmICh0YXJnZXRTdGFydCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIH1cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBpZiAoZW5kIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgPCBlbmQgLSBzdGFydCkge1xuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCArIHN0YXJ0XG4gIH1cblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcbiAgdmFyIGlcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0ICYmIHN0YXJ0IDwgdGFyZ2V0U3RhcnQgJiYgdGFyZ2V0U3RhcnQgPCBlbmQpIHtcbiAgICAvLyBkZXNjZW5kaW5nIGNvcHkgZnJvbSBlbmRcbiAgICBmb3IgKGkgPSBsZW4gLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSBpZiAobGVuIDwgMTAwMCB8fCAhQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBhc2NlbmRpbmcgY29weSBmcm9tIHN0YXJ0XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBVaW50OEFycmF5LnByb3RvdHlwZS5zZXQuY2FsbChcbiAgICAgIHRhcmdldCxcbiAgICAgIHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSxcbiAgICAgIHRhcmdldFN0YXJ0XG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIGxlblxufVxuXG4vLyBVc2FnZTpcbi8vICAgIGJ1ZmZlci5maWxsKG51bWJlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoYnVmZmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChzdHJpbmdbLCBvZmZzZXRbLCBlbmRdXVssIGVuY29kaW5nXSlcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uIGZpbGwgKHZhbCwgc3RhcnQsIGVuZCwgZW5jb2RpbmcpIHtcbiAgLy8gSGFuZGxlIHN0cmluZyBjYXNlczpcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHR5cGVvZiBzdGFydCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gc3RhcnRcbiAgICAgIHN0YXJ0ID0gMFxuICAgICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBlbmQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IGVuZFxuICAgICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgICB9XG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZhciBjb2RlID0gdmFsLmNoYXJDb2RlQXQoMClcbiAgICAgIGlmIChjb2RlIDwgMjU2KSB7XG4gICAgICAgIHZhbCA9IGNvZGVcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGVuY29kaW5nICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZW5jb2RpbmcgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnICYmICFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAyNTVcbiAgfVxuXG4gIC8vIEludmFsaWQgcmFuZ2VzIGFyZSBub3Qgc2V0IHRvIGEgZGVmYXVsdCwgc28gY2FuIHJhbmdlIGNoZWNrIGVhcmx5LlxuICBpZiAoc3RhcnQgPCAwIHx8IHRoaXMubGVuZ3RoIDwgc3RhcnQgfHwgdGhpcy5sZW5ndGggPCBlbmQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignT3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgc3RhcnQgPSBzdGFydCA+Pj4gMFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IHRoaXMubGVuZ3RoIDogZW5kID4+PiAwXG5cbiAgaWYgKCF2YWwpIHZhbCA9IDBcblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgICB0aGlzW2ldID0gdmFsXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBieXRlcyA9IGludGVybmFsSXNCdWZmZXIodmFsKVxuICAgICAgPyB2YWxcbiAgICAgIDogdXRmOFRvQnl0ZXMobmV3IEJ1ZmZlcih2YWwsIGVuY29kaW5nKS50b1N0cmluZygpKVxuICAgIHZhciBsZW4gPSBieXRlcy5sZW5ndGhcbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5kIC0gc3RhcnQ7ICsraSkge1xuICAgICAgdGhpc1tpICsgc3RhcnRdID0gYnl0ZXNbaSAlIGxlbl1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbnZhciBJTlZBTElEX0JBU0U2NF9SRSA9IC9bXitcXC8wLTlBLVphLXotX10vZ1xuXG5mdW5jdGlvbiBiYXNlNjRjbGVhbiAoc3RyKSB7XG4gIC8vIE5vZGUgc3RyaXBzIG91dCBpbnZhbGlkIGNoYXJhY3RlcnMgbGlrZSBcXG4gYW5kIFxcdCBmcm9tIHRoZSBzdHJpbmcsIGJhc2U2NC1qcyBkb2VzIG5vdFxuICBzdHIgPSBzdHJpbmd0cmltKHN0cikucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgY29udmVydHMgc3RyaW5ncyB3aXRoIGxlbmd0aCA8IDIgdG8gJydcbiAgaWYgKHN0ci5sZW5ndGggPCAyKSByZXR1cm4gJydcbiAgLy8gTm9kZSBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgYmFzZTY0IHN0cmluZ3MgKG1pc3NpbmcgdHJhaWxpbmcgPT09KSwgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHdoaWxlIChzdHIubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgIHN0ciA9IHN0ciArICc9J1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyaW5nLCB1bml0cykge1xuICB1bml0cyA9IHVuaXRzIHx8IEluZmluaXR5XG4gIHZhciBjb2RlUG9pbnRcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgdmFyIGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIHZhciBieXRlcyA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvZGVQb2ludCA9IHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cbiAgICAvLyBpcyBzdXJyb2dhdGUgY29tcG9uZW50XG4gICAgaWYgKGNvZGVQb2ludCA+IDB4RDdGRiAmJiBjb2RlUG9pbnQgPCAweEUwMDApIHtcbiAgICAgIC8vIGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoIWxlYWRTdXJyb2dhdGUpIHtcbiAgICAgICAgLy8gbm8gbGVhZCB5ZXRcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+IDB4REJGRikge1xuICAgICAgICAgIC8vIHVuZXhwZWN0ZWQgdHJhaWxcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKGkgKyAxID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAvLyB1bnBhaXJlZCBsZWFkXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkIGxlYWRcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIDIgbGVhZHMgaW4gYSByb3dcbiAgICAgIGlmIChjb2RlUG9pbnQgPCAweERDMDApIHtcbiAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gdmFsaWQgc3Vycm9nYXRlIHBhaXJcbiAgICAgIGNvZGVQb2ludCA9IChsZWFkU3Vycm9nYXRlIC0gMHhEODAwIDw8IDEwIHwgY29kZVBvaW50IC0gMHhEQzAwKSArIDB4MTAwMDBcbiAgICB9IGVsc2UgaWYgKGxlYWRTdXJyb2dhdGUpIHtcbiAgICAgIC8vIHZhbGlkIGJtcCBjaGFyLCBidXQgbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgIH1cblxuICAgIGxlYWRTdXJyb2dhdGUgPSBudWxsXG5cbiAgICAvLyBlbmNvZGUgdXRmOFxuICAgIGlmIChjb2RlUG9pbnQgPCAweDgwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDEpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goY29kZVBvaW50KVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHg4MDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiB8IDB4QzAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDMpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgfCAweEUwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSA0KSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHgxMiB8IDB4RjAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIsIHVuaXRzKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KGJhc2U2NGNsZWFuKHN0cikpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKSBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGlzbmFuICh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gdmFsIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2VsZi1jb21wYXJlXG59XG5cblxuLy8gdGhlIGZvbGxvd2luZyBpcyBmcm9tIGlzLWJ1ZmZlciwgYWxzbyBieSBGZXJvc3MgQWJvdWtoYWRpamVoIGFuZCB3aXRoIHNhbWUgbGlzZW5jZVxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxuZXhwb3J0IGZ1bmN0aW9uIGlzQnVmZmVyKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgKCEhb2JqLl9pc0J1ZmZlciB8fCBpc0Zhc3RCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSlcbn1cblxuZnVuY3Rpb24gaXNGYXN0QnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNGYXN0QnVmZmVyKG9iai5zbGljZSgwLCAwKSlcbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge0J1ZmZlcn0gZnJvbSAnYnVmZmVyJztcbnZhciBpc0J1ZmZlckVuY29kaW5nID0gQnVmZmVyLmlzRW5jb2RpbmdcbiAgfHwgZnVuY3Rpb24oZW5jb2RpbmcpIHtcbiAgICAgICBzd2l0Y2ggKGVuY29kaW5nICYmIGVuY29kaW5nLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgIGNhc2UgJ2hleCc6IGNhc2UgJ3V0ZjgnOiBjYXNlICd1dGYtOCc6IGNhc2UgJ2FzY2lpJzogY2FzZSAnYmluYXJ5JzogY2FzZSAnYmFzZTY0JzogY2FzZSAndWNzMic6IGNhc2UgJ3Vjcy0yJzogY2FzZSAndXRmMTZsZSc6IGNhc2UgJ3V0Zi0xNmxlJzogY2FzZSAncmF3JzogcmV0dXJuIHRydWU7XG4gICAgICAgICBkZWZhdWx0OiByZXR1cm4gZmFsc2U7XG4gICAgICAgfVxuICAgICB9XG5cblxuZnVuY3Rpb24gYXNzZXJ0RW5jb2RpbmcoZW5jb2RpbmcpIHtcbiAgaWYgKGVuY29kaW5nICYmICFpc0J1ZmZlckVuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKTtcbiAgfVxufVxuXG4vLyBTdHJpbmdEZWNvZGVyIHByb3ZpZGVzIGFuIGludGVyZmFjZSBmb3IgZWZmaWNpZW50bHkgc3BsaXR0aW5nIGEgc2VyaWVzIG9mXG4vLyBidWZmZXJzIGludG8gYSBzZXJpZXMgb2YgSlMgc3RyaW5ncyB3aXRob3V0IGJyZWFraW5nIGFwYXJ0IG11bHRpLWJ5dGVcbi8vIGNoYXJhY3RlcnMuIENFU1UtOCBpcyBoYW5kbGVkIGFzIHBhcnQgb2YgdGhlIFVURi04IGVuY29kaW5nLlxuLy9cbi8vIEBUT0RPIEhhbmRsaW5nIGFsbCBlbmNvZGluZ3MgaW5zaWRlIGEgc2luZ2xlIG9iamVjdCBtYWtlcyBpdCB2ZXJ5IGRpZmZpY3VsdFxuLy8gdG8gcmVhc29uIGFib3V0IHRoaXMgY29kZSwgc28gaXQgc2hvdWxkIGJlIHNwbGl0IHVwIGluIHRoZSBmdXR1cmUuXG4vLyBAVE9ETyBUaGVyZSBzaG91bGQgYmUgYSB1dGY4LXN0cmljdCBlbmNvZGluZyB0aGF0IHJlamVjdHMgaW52YWxpZCBVVEYtOCBjb2RlXG4vLyBwb2ludHMgYXMgdXNlZCBieSBDRVNVLTguXG5leHBvcnQgZnVuY3Rpb24gU3RyaW5nRGVjb2RlcihlbmNvZGluZykge1xuICB0aGlzLmVuY29kaW5nID0gKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bLV9dLywgJycpO1xuICBhc3NlcnRFbmNvZGluZyhlbmNvZGluZyk7XG4gIHN3aXRjaCAodGhpcy5lbmNvZGluZykge1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgLy8gQ0VTVS04IHJlcHJlc2VudHMgZWFjaCBvZiBTdXJyb2dhdGUgUGFpciBieSAzLWJ5dGVzXG4gICAgICB0aGlzLnN1cnJvZ2F0ZVNpemUgPSAzO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICAvLyBVVEYtMTYgcmVwcmVzZW50cyBlYWNoIG9mIFN1cnJvZ2F0ZSBQYWlyIGJ5IDItYnl0ZXNcbiAgICAgIHRoaXMuc3Vycm9nYXRlU2l6ZSA9IDI7XG4gICAgICB0aGlzLmRldGVjdEluY29tcGxldGVDaGFyID0gdXRmMTZEZXRlY3RJbmNvbXBsZXRlQ2hhcjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAvLyBCYXNlLTY0IHN0b3JlcyAzIGJ5dGVzIGluIDQgY2hhcnMsIGFuZCBwYWRzIHRoZSByZW1haW5kZXIuXG4gICAgICB0aGlzLnN1cnJvZ2F0ZVNpemUgPSAzO1xuICAgICAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhciA9IGJhc2U2NERldGVjdEluY29tcGxldGVDaGFyO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRoaXMud3JpdGUgPSBwYXNzVGhyb3VnaFdyaXRlO1xuICAgICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRW5vdWdoIHNwYWNlIHRvIHN0b3JlIGFsbCBieXRlcyBvZiBhIHNpbmdsZSBjaGFyYWN0ZXIuIFVURi04IG5lZWRzIDRcbiAgLy8gYnl0ZXMsIGJ1dCBDRVNVLTggbWF5IHJlcXVpcmUgdXAgdG8gNiAoMyBieXRlcyBwZXIgc3Vycm9nYXRlKS5cbiAgdGhpcy5jaGFyQnVmZmVyID0gbmV3IEJ1ZmZlcig2KTtcbiAgLy8gTnVtYmVyIG9mIGJ5dGVzIHJlY2VpdmVkIGZvciB0aGUgY3VycmVudCBpbmNvbXBsZXRlIG11bHRpLWJ5dGUgY2hhcmFjdGVyLlxuICB0aGlzLmNoYXJSZWNlaXZlZCA9IDA7XG4gIC8vIE51bWJlciBvZiBieXRlcyBleHBlY3RlZCBmb3IgdGhlIGN1cnJlbnQgaW5jb21wbGV0ZSBtdWx0aS1ieXRlIGNoYXJhY3Rlci5cbiAgdGhpcy5jaGFyTGVuZ3RoID0gMDtcbn07XG5cblxuLy8gd3JpdGUgZGVjb2RlcyB0aGUgZ2l2ZW4gYnVmZmVyIGFuZCByZXR1cm5zIGl0IGFzIEpTIHN0cmluZyB0aGF0IGlzXG4vLyBndWFyYW50ZWVkIHRvIG5vdCBjb250YWluIGFueSBwYXJ0aWFsIG11bHRpLWJ5dGUgY2hhcmFjdGVycy4gQW55IHBhcnRpYWxcbi8vIGNoYXJhY3RlciBmb3VuZCBhdCB0aGUgZW5kIG9mIHRoZSBidWZmZXIgaXMgYnVmZmVyZWQgdXAsIGFuZCB3aWxsIGJlXG4vLyByZXR1cm5lZCB3aGVuIGNhbGxpbmcgd3JpdGUgYWdhaW4gd2l0aCB0aGUgcmVtYWluaW5nIGJ5dGVzLlxuLy9cbi8vIE5vdGU6IENvbnZlcnRpbmcgYSBCdWZmZXIgY29udGFpbmluZyBhbiBvcnBoYW4gc3Vycm9nYXRlIHRvIGEgU3RyaW5nXG4vLyBjdXJyZW50bHkgd29ya3MsIGJ1dCBjb252ZXJ0aW5nIGEgU3RyaW5nIHRvIGEgQnVmZmVyICh2aWEgYG5ldyBCdWZmZXJgLCBvclxuLy8gQnVmZmVyI3dyaXRlKSB3aWxsIHJlcGxhY2UgaW5jb21wbGV0ZSBzdXJyb2dhdGVzIHdpdGggdGhlIHVuaWNvZGVcbi8vIHJlcGxhY2VtZW50IGNoYXJhY3Rlci4gU2VlIGh0dHBzOi8vY29kZXJldmlldy5jaHJvbWl1bS5vcmcvMTIxMTczMDA5LyAuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICB2YXIgY2hhclN0ciA9ICcnO1xuICAvLyBpZiBvdXIgbGFzdCB3cml0ZSBlbmRlZCB3aXRoIGFuIGluY29tcGxldGUgbXVsdGlieXRlIGNoYXJhY3RlclxuICB3aGlsZSAodGhpcy5jaGFyTGVuZ3RoKSB7XG4gICAgLy8gZGV0ZXJtaW5lIGhvdyBtYW55IHJlbWFpbmluZyBieXRlcyB0aGlzIGJ1ZmZlciBoYXMgdG8gb2ZmZXIgZm9yIHRoaXMgY2hhclxuICAgIHZhciBhdmFpbGFibGUgPSAoYnVmZmVyLmxlbmd0aCA+PSB0aGlzLmNoYXJMZW5ndGggLSB0aGlzLmNoYXJSZWNlaXZlZCkgP1xuICAgICAgICB0aGlzLmNoYXJMZW5ndGggLSB0aGlzLmNoYXJSZWNlaXZlZCA6XG4gICAgICAgIGJ1ZmZlci5sZW5ndGg7XG5cbiAgICAvLyBhZGQgdGhlIG5ldyBieXRlcyB0byB0aGUgY2hhciBidWZmZXJcbiAgICBidWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIHRoaXMuY2hhclJlY2VpdmVkLCAwLCBhdmFpbGFibGUpO1xuICAgIHRoaXMuY2hhclJlY2VpdmVkICs9IGF2YWlsYWJsZTtcblxuICAgIGlmICh0aGlzLmNoYXJSZWNlaXZlZCA8IHRoaXMuY2hhckxlbmd0aCkge1xuICAgICAgLy8gc3RpbGwgbm90IGVub3VnaCBjaGFycyBpbiB0aGlzIGJ1ZmZlcj8gd2FpdCBmb3IgbW9yZSAuLi5cbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgYnl0ZXMgYmVsb25naW5nIHRvIHRoZSBjdXJyZW50IGNoYXJhY3RlciBmcm9tIHRoZSBidWZmZXJcbiAgICBidWZmZXIgPSBidWZmZXIuc2xpY2UoYXZhaWxhYmxlLCBidWZmZXIubGVuZ3RoKTtcblxuICAgIC8vIGdldCB0aGUgY2hhcmFjdGVyIHRoYXQgd2FzIHNwbGl0XG4gICAgY2hhclN0ciA9IHRoaXMuY2hhckJ1ZmZlci5zbGljZSgwLCB0aGlzLmNoYXJMZW5ndGgpLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcpO1xuXG4gICAgLy8gQ0VTVS04OiBsZWFkIHN1cnJvZ2F0ZSAoRDgwMC1EQkZGKSBpcyBhbHNvIHRoZSBpbmNvbXBsZXRlIGNoYXJhY3RlclxuICAgIHZhciBjaGFyQ29kZSA9IGNoYXJTdHIuY2hhckNvZGVBdChjaGFyU3RyLmxlbmd0aCAtIDEpO1xuICAgIGlmIChjaGFyQ29kZSA+PSAweEQ4MDAgJiYgY2hhckNvZGUgPD0gMHhEQkZGKSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggKz0gdGhpcy5zdXJyb2dhdGVTaXplO1xuICAgICAgY2hhclN0ciA9ICcnO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHRoaXMuY2hhclJlY2VpdmVkID0gdGhpcy5jaGFyTGVuZ3RoID0gMDtcblxuICAgIC8vIGlmIHRoZXJlIGFyZSBubyBtb3JlIGJ5dGVzIGluIHRoaXMgYnVmZmVyLCBqdXN0IGVtaXQgb3VyIGNoYXJcbiAgICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGNoYXJTdHI7XG4gICAgfVxuICAgIGJyZWFrO1xuICB9XG5cbiAgLy8gZGV0ZXJtaW5lIGFuZCBzZXQgY2hhckxlbmd0aCAvIGNoYXJSZWNlaXZlZFxuICB0aGlzLmRldGVjdEluY29tcGxldGVDaGFyKGJ1ZmZlcik7XG5cbiAgdmFyIGVuZCA9IGJ1ZmZlci5sZW5ndGg7XG4gIGlmICh0aGlzLmNoYXJMZW5ndGgpIHtcbiAgICAvLyBidWZmZXIgdGhlIGluY29tcGxldGUgY2hhcmFjdGVyIGJ5dGVzIHdlIGdvdFxuICAgIGJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgMCwgYnVmZmVyLmxlbmd0aCAtIHRoaXMuY2hhclJlY2VpdmVkLCBlbmQpO1xuICAgIGVuZCAtPSB0aGlzLmNoYXJSZWNlaXZlZDtcbiAgfVxuXG4gIGNoYXJTdHIgKz0gYnVmZmVyLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcsIDAsIGVuZCk7XG5cbiAgdmFyIGVuZCA9IGNoYXJTdHIubGVuZ3RoIC0gMTtcbiAgdmFyIGNoYXJDb2RlID0gY2hhclN0ci5jaGFyQ29kZUF0KGVuZCk7XG4gIC8vIENFU1UtODogbGVhZCBzdXJyb2dhdGUgKEQ4MDAtREJGRikgaXMgYWxzbyB0aGUgaW5jb21wbGV0ZSBjaGFyYWN0ZXJcbiAgaWYgKGNoYXJDb2RlID49IDB4RDgwMCAmJiBjaGFyQ29kZSA8PSAweERCRkYpIHtcbiAgICB2YXIgc2l6ZSA9IHRoaXMuc3Vycm9nYXRlU2l6ZTtcbiAgICB0aGlzLmNoYXJMZW5ndGggKz0gc2l6ZTtcbiAgICB0aGlzLmNoYXJSZWNlaXZlZCArPSBzaXplO1xuICAgIHRoaXMuY2hhckJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgc2l6ZSwgMCwgc2l6ZSk7XG4gICAgYnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCAwLCAwLCBzaXplKTtcbiAgICByZXR1cm4gY2hhclN0ci5zdWJzdHJpbmcoMCwgZW5kKTtcbiAgfVxuXG4gIC8vIG9yIGp1c3QgZW1pdCB0aGUgY2hhclN0clxuICByZXR1cm4gY2hhclN0cjtcbn07XG5cbi8vIGRldGVjdEluY29tcGxldGVDaGFyIGRldGVybWluZXMgaWYgdGhlcmUgaXMgYW4gaW5jb21wbGV0ZSBVVEYtOCBjaGFyYWN0ZXIgYXRcbi8vIHRoZSBlbmQgb2YgdGhlIGdpdmVuIGJ1ZmZlci4gSWYgc28sIGl0IHNldHMgdGhpcy5jaGFyTGVuZ3RoIHRvIHRoZSBieXRlXG4vLyBsZW5ndGggdGhhdCBjaGFyYWN0ZXIsIGFuZCBzZXRzIHRoaXMuY2hhclJlY2VpdmVkIHRvIHRoZSBudW1iZXIgb2YgYnl0ZXNcbi8vIHRoYXQgYXJlIGF2YWlsYWJsZSBmb3IgdGhpcyBjaGFyYWN0ZXIuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5kZXRlY3RJbmNvbXBsZXRlQ2hhciA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICAvLyBkZXRlcm1pbmUgaG93IG1hbnkgYnl0ZXMgd2UgaGF2ZSB0byBjaGVjayBhdCB0aGUgZW5kIG9mIHRoaXMgYnVmZmVyXG4gIHZhciBpID0gKGJ1ZmZlci5sZW5ndGggPj0gMykgPyAzIDogYnVmZmVyLmxlbmd0aDtcblxuICAvLyBGaWd1cmUgb3V0IGlmIG9uZSBvZiB0aGUgbGFzdCBpIGJ5dGVzIG9mIG91ciBidWZmZXIgYW5ub3VuY2VzIGFuXG4gIC8vIGluY29tcGxldGUgY2hhci5cbiAgZm9yICg7IGkgPiAwOyBpLS0pIHtcbiAgICB2YXIgYyA9IGJ1ZmZlcltidWZmZXIubGVuZ3RoIC0gaV07XG5cbiAgICAvLyBTZWUgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9VVEYtOCNEZXNjcmlwdGlvblxuXG4gICAgLy8gMTEwWFhYWFhcbiAgICBpZiAoaSA9PSAxICYmIGMgPj4gNSA9PSAweDA2KSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggPSAyO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gMTExMFhYWFhcbiAgICBpZiAoaSA8PSAyICYmIGMgPj4gNCA9PSAweDBFKSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggPSAzO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gMTExMTBYWFhcbiAgICBpZiAoaSA8PSAzICYmIGMgPj4gMyA9PSAweDFFKSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggPSA0O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHRoaXMuY2hhclJlY2VpdmVkID0gaTtcbn07XG5cblN0cmluZ0RlY29kZXIucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICB2YXIgcmVzID0gJyc7XG4gIGlmIChidWZmZXIgJiYgYnVmZmVyLmxlbmd0aClcbiAgICByZXMgPSB0aGlzLndyaXRlKGJ1ZmZlcik7XG5cbiAgaWYgKHRoaXMuY2hhclJlY2VpdmVkKSB7XG4gICAgdmFyIGNyID0gdGhpcy5jaGFyUmVjZWl2ZWQ7XG4gICAgdmFyIGJ1ZiA9IHRoaXMuY2hhckJ1ZmZlcjtcbiAgICB2YXIgZW5jID0gdGhpcy5lbmNvZGluZztcbiAgICByZXMgKz0gYnVmLnNsaWNlKDAsIGNyKS50b1N0cmluZyhlbmMpO1xuICB9XG5cbiAgcmV0dXJuIHJlcztcbn07XG5cbmZ1bmN0aW9uIHBhc3NUaHJvdWdoV3JpdGUoYnVmZmVyKSB7XG4gIHJldHVybiBidWZmZXIudG9TdHJpbmcodGhpcy5lbmNvZGluZyk7XG59XG5cbmZ1bmN0aW9uIHV0ZjE2RGV0ZWN0SW5jb21wbGV0ZUNoYXIoYnVmZmVyKSB7XG4gIHRoaXMuY2hhclJlY2VpdmVkID0gYnVmZmVyLmxlbmd0aCAlIDI7XG4gIHRoaXMuY2hhckxlbmd0aCA9IHRoaXMuY2hhclJlY2VpdmVkID8gMiA6IDA7XG59XG5cbmZ1bmN0aW9uIGJhc2U2NERldGVjdEluY29tcGxldGVDaGFyKGJ1ZmZlcikge1xuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGJ1ZmZlci5sZW5ndGggJSAzO1xuICB0aGlzLmNoYXJMZW5ndGggPSB0aGlzLmNoYXJSZWNlaXZlZCA/IDMgOiAwO1xufVxuIiwiaW1wb3J0IHtnZW5lcmF0ZVNjaGVtYX0gZnJvbSBcIi4vaW5kZXhTY2hlbWFDcmVhdG9yXCI7XG5pbXBvcnQgeyBoYXMsIGlzU3RyaW5nLCBkaWZmZXJlbmNlLCBmaW5kIH0gZnJvbSBcImxvZGFzaC9mcFwiO1xuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcInNhZmUtYnVmZmVyXCI7XG5pbXBvcnQge1N0cmluZ0RlY29kZXJ9IGZyb20gXCJzdHJpbmdfZGVjb2RlclwiO1xuaW1wb3J0IHtnZXRUeXBlfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IGlzU29tZXRoaW5nIH0gZnJvbSBcIi4uL2NvbW1vblwiO1xuXG5leHBvcnQgY29uc3QgQlVGRkVSX01BWF9CWVRFUyA9IDUyNDI4ODsgLy8gMC41TWJcblxuZXhwb3J0IGNvbnN0IENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUyA9IFwiQ09OVElOVUVfUkVBRElOR1wiO1xuZXhwb3J0IGNvbnN0IFJFQURfUkVNQUlOSU5HX1RFWFQgPSBcIlJFQURfUkVNQUlOSU5HXCI7XG5leHBvcnQgY29uc3QgQ0FOQ0VMX1JFQUQgPSBcIkNBTkNFTFwiO1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhXcml0ZXIgPSAoaGllcmFyY2h5LCBpbmRleE5vZGUsIHJlYWRhYmxlU3RyZWFtLCB3cml0YWJsZVN0cmVhbSwgZW5kKSA9PiB7XG4gICAgY29uc3Qgc2NoZW1hID0gZ2VuZXJhdGVTY2hlbWEoaGllcmFyY2h5LCBpbmRleE5vZGUpO1xuXG4gICAgcmV0dXJuICh7XG4gICAgICAgIHJlYWQ6IHJlYWQocmVhZGFibGVTdHJlYW0sIHNjaGVtYSksXG4gICAgICAgIHVwZGF0ZUluZGV4OiB1cGRhdGVJbmRleChyZWFkYWJsZVN0cmVhbSwgd3JpdGFibGVTdHJlYW0sIHNjaGVtYSwgZW5kKVxuICAgIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4UmVhZGVyID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlLCByZWFkYWJsZVN0cmVhbSkgPT4gXG4gICAgcmVhZChcbiAgICAgICAgcmVhZGFibGVTdHJlYW0sIFxuICAgICAgICBnZW5lcmF0ZVNjaGVtYShoaWVyYXJjaHksIGluZGV4Tm9kZSlcbiAgICApO1xuXG5jb25zdCB1cGRhdGVJbmRleCA9IChyZWFkYWJsZVN0cmVhbSwgd3JpdGFibGVTdHJlYW0sIHNjaGVtYSkgPT4gYXN5bmMgKGl0ZW1zVG9Xcml0ZSwga2V5c1RvUmVtb3ZlKSA9PiB7XG4gICAgY29uc3Qgd3JpdGUgPSBuZXdPdXRwdXRXcml0ZXIoQlVGRkVSX01BWF9CWVRFUywgd3JpdGFibGVTdHJlYW0pO1xuICAgIGNvbnN0IHdyaXR0ZW5JdGVtcyA9IFtdOyBcbiAgICBhd2FpdCByZWFkKHJlYWRhYmxlU3RyZWFtLCBzY2hlbWEpKFxuICAgICAgICBhc3luYyBpbmRleGVkSXRlbSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGVkID0gZmluZChpID0+IGluZGV4ZWRJdGVtLmtleSA9PT0gaS5rZXkpKGl0ZW1zVG9Xcml0ZSk7XG4gICAgICAgICAgICBjb25zdCByZW1vdmVkID0gZmluZChrID0+IGluZGV4ZWRJdGVtLmtleSA9PT0gaykoa2V5c1RvUmVtb3ZlKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoaXNTb21ldGhpbmcocmVtb3ZlZCkpIFxuICAgICAgICAgICAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XG5cbiAgICAgICAgICAgIGlmKGlzU29tZXRoaW5nKHVwZGF0ZWQpKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VyaWFsaXplZEl0ZW0gPSAgc2VyaWFsaXplSXRlbShzY2hlbWEsIHVwZGF0ZWQpO1xuICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRlKHNlcmlhbGl6ZWRJdGVtKTtcbiAgICAgICAgICAgICAgICB3cml0dGVuSXRlbXMucHVzaCh1cGRhdGVkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgd3JpdGUoXG4gICAgICAgICAgICAgICAgICAgIHNlcmlhbGl6ZUl0ZW0oc2NoZW1hLCBpbmRleGVkSXRlbSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBcblxuICAgICAgICAgICAgcmV0dXJuIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcblxuICAgICAgICB9LFxuICAgICAgICBhc3luYyB0ZXh0ID0+IGF3YWl0IHdyaXRlKHRleHQpXG4gICAgKTtcblxuICAgIGlmKHdyaXR0ZW5JdGVtcy5sZW5ndGggIT09IGl0ZW1zVG9Xcml0ZS5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgdG9BZGQgPSBkaWZmZXJlbmNlKGl0ZW1zVG9Xcml0ZSwgd3JpdHRlbkl0ZW1zKTtcbiAgICAgICAgZm9yKGxldCBhZGRlZCBvZiB0b0FkZCkge1xuICAgICAgICAgICAgYXdhaXQgd3JpdGUoXG4gICAgICAgICAgICAgICAgc2VyaWFsaXplSXRlbShzY2hlbWEsIGFkZGVkKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZih3cml0dGVuSXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIHBvdGVudGlhbGx5IGFyZSBubyByZWNvcmRzXG4gICAgICAgIGF3YWl0IHdyaXRlKFwiXCIpO1xuICAgIH1cblxuICAgIGF3YWl0IHdyaXRlKCk7XG4gICAgYXdhaXQgd3JpdGFibGVTdHJlYW0uZW5kKCk7XG59O1xuXG5jb25zdCByZWFkID0gKHJlYWRhYmxlU3RyZWFtLCBzY2hlbWEpID0+IGFzeW5jIChvbkdldEl0ZW0sIG9uR2V0VGV4dCkgPT4ge1xuICAgIGNvbnN0IHJlYWRJbnB1dCA9IG5ld0lucHV0UmVhZGVyKHJlYWRhYmxlU3RyZWFtKTtcbiAgICBsZXQgdGV4dCA9IGF3YWl0IHJlYWRJbnB1dCgpO1xuICAgIGxldCBzdGF0dXMgPSBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XG4gICAgd2hpbGUodGV4dC5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgaWYoc3RhdHVzID09PSBSRUFEX1JFTUFJTklOR19URVhUKSB7XG4gICAgICAgICAgICBhd2FpdCBvbkdldFRleHQodGV4dCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHN0YXR1cyA9PT0gQ0FOQ0VMX1JFQUQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByb3dUZXh0ID0gXCJcIjtcbiAgICAgICAgbGV0IGN1cnJlbnRDaGFySW5kZXg9MDtcbiAgICAgICAgZm9yKGxldCBjdXJyZW50Q2hhciBvZiB0ZXh0KSB7XG4gICAgICAgICAgICByb3dUZXh0ICs9IGN1cnJlbnRDaGFyO1xuICAgICAgICAgICAgaWYoY3VycmVudENoYXIgPT09IFwiXFxyXCIpIHtcbiAgICAgICAgICAgICAgICBzdGF0dXMgPSBhd2FpdCBvbkdldEl0ZW0oXG4gICAgICAgICAgICAgICAgICAgIGRlc2VyaWFsaXplUm93KHNjaGVtYSwgcm93VGV4dClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJvd1RleHQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGlmKHN0YXR1cyA9PT0gUkVBRF9SRU1BSU5JTkdfVEVYVCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyZW50Q2hhckluZGV4Kys7XG4gICAgICAgIH1cblxuICAgICAgICBpZihjdXJyZW50Q2hhckluZGV4IDwgdGV4dC5sZW5ndGggLTEpIHtcbiAgICAgICAgICAgIGF3YWl0IG9uR2V0VGV4dCh0ZXh0LnN1YnN0cmluZyhjdXJyZW50Q2hhckluZGV4ICsgMSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGV4dCA9IGF3YWl0IHJlYWRJbnB1dCgpO1xuICAgIH1cblxuICAgIGF3YWl0IHJlYWRhYmxlU3RyZWFtLmRlc3Ryb3koKTtcblxufTtcblxuY29uc3QgbmV3T3V0cHV0V3JpdGVyID0gKGZsdXNoQm91bmRhcnksIHdyaXRhYmxlU3RyZWFtKSA9PiB7XG4gICAgXG4gICAgbGV0IGN1cnJlbnRCdWZmZXIgPSBudWxsO1xuXG4gICAgcmV0dXJuIGFzeW5jICh0ZXh0KSA9PiB7XG5cbiAgICAgICAgaWYoaXNTdHJpbmcodGV4dCkgJiYgY3VycmVudEJ1ZmZlciA9PT0gbnVsbClcbiAgICAgICAgICAgIGN1cnJlbnRCdWZmZXIgPSBCdWZmZXIuZnJvbSh0ZXh0LCBcInV0ZjhcIik7XG4gICAgICAgIGVsc2UgaWYoaXNTdHJpbmcodGV4dCkpXG4gICAgICAgICAgICBjdXJyZW50QnVmZmVyID0gQnVmZmVyLmNvbmNhdChbXG4gICAgICAgICAgICAgICAgY3VycmVudEJ1ZmZlcixcbiAgICAgICAgICAgICAgICBCdWZmZXIuZnJvbSh0ZXh0LCBcInV0ZjhcIilcbiAgICAgICAgICAgIF0pO1xuICAgICAgICBcbiAgICAgICAgaWYoY3VycmVudEJ1ZmZlciAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgKGN1cnJlbnRCdWZmZXIubGVuZ3RoID4gZmx1c2hCb3VuZGFyeVxuICAgICAgICAgICAgIHx8ICFpc1N0cmluZyh0ZXh0KSkpIHtcblxuICAgICAgICAgICAgYXdhaXQgd3JpdGFibGVTdHJlYW0ud3JpdGUoY3VycmVudEJ1ZmZlcik7XG4gICAgICAgICAgICBjdXJyZW50QnVmZmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmNvbnN0IG5ld0lucHV0UmVhZGVyID0gKHJlYWRhYmxlU3RyZWFtKSA9PiB7XG5cbiAgICBjb25zdCBkZWNvZGVyID0gbmV3IFN0cmluZ0RlY29kZXIoJ3V0ZjgnKTtcbiAgICBsZXQgcmVtYWluaW5nQnl0ZXMgPSBbXTtcblxuICAgIHJldHVybiBhc3luYyAoKSA9PiB7XG5cbiAgICAgICAgbGV0IG5leHRCeXRlc0J1ZmZlciA9IGF3YWl0IHJlYWRhYmxlU3RyZWFtLnJlYWQoQlVGRkVSX01BWF9CWVRFUyk7XG4gICAgICAgIGNvbnN0IHJlbWFpbmluZ0J1ZmZlciA9IEJ1ZmZlci5mcm9tKHJlbWFpbmluZ0J5dGVzKTtcblxuICAgICAgICBpZighbmV4dEJ5dGVzQnVmZmVyKSBuZXh0Qnl0ZXNCdWZmZXIgPSBCdWZmZXIuZnJvbShbXSk7XG5cbiAgICAgICAgY29uc3QgbW9yZVRvUmVhZCA9IG5leHRCeXRlc0J1ZmZlci5sZW5ndGggPT09IEJVRkZFUl9NQVhfQllURVM7XG5cbiAgICAgICAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmNvbmNhdChcbiAgICAgICAgICAgIFtyZW1haW5pbmdCdWZmZXIsIG5leHRCeXRlc0J1ZmZlcl0sXG4gICAgICAgICAgICByZW1haW5pbmdCdWZmZXIubGVuZ3RoICsgbmV4dEJ5dGVzQnVmZmVyLmxlbmd0aCk7XG5cbiAgICAgICAgY29uc3QgdGV4dCA9IGRlY29kZXIud3JpdGUoYnVmZmVyKTtcbiAgICAgICAgcmVtYWluaW5nQnl0ZXMgPSBkZWNvZGVyLmVuZChidWZmZXIpO1xuXG4gICAgICAgIGlmKCFtb3JlVG9SZWFkICYmIHJlbWFpbmluZ0J5dGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIGlmIGZvciBhbnkgcmVhc29uLCB3ZSBoYXZlIHJlbWFpbmluZyBieXRlcyBhdCB0aGUgZW5kXG4gICAgICAgICAgICAvLyBvZiB0aGUgc3RyZWFtLCBqdXN0IGRpc2NhcmQgLSBkb250IHNlZSB3aHkgdGhpcyBzaG91bGRcbiAgICAgICAgICAgIC8vIGV2ZXIgaGFwcGVuLCBidXQgaWYgaXQgZG9lcywgaXQgY291bGQgY2F1c2UgYSBzdGFjayBvdmVyZmxvd1xuICAgICAgICAgICAgcmVtYWluaW5nQnl0ZXMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH07XG59O1xuXG5jb25zdCBkZXNlcmlhbGl6ZVJvdyA9IChzY2hlbWEsIHJvd1RleHQpID0+IHtcbiAgICBsZXQgY3VycmVudFByb3BJbmRleCA9IDA7XG4gICAgbGV0IGN1cnJlbnRDaGFySW5kZXggPSAwO1xuICAgIGxldCBjdXJyZW50VmFsdWVUZXh0ID0gXCJcIjtcbiAgICBsZXQgaXNFc2NhcGVkID0gZmFsc2U7XG4gICAgY29uc3QgaXRlbSA9IHt9O1xuXG4gICAgY29uc3Qgc2V0Q3VycmVudFByb3AgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRQcm9wID0gc2NoZW1hW2N1cnJlbnRQcm9wSW5kZXhdO1xuICAgICAgICBjb25zdCB0eXBlID0gZ2V0VHlwZShjdXJyZW50UHJvcC50eXBlKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjdXJyZW50VmFsdWVUZXh0ID09PSBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgPyB0eXBlLmdldERlZmF1bHRWYWx1ZSgpXG4gICAgICAgICAgICAgICAgICAgICAgOiB0eXBlLnNhZmVQYXJzZVZhbHVlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWVUZXh0KTtcbiAgICAgICAgaXRlbVtjdXJyZW50UHJvcC5uYW1lXSA9IHZhbHVlO1xuICAgIH07XG4gICAgXG4gICAgd2hpbGUoY3VycmVudFByb3BJbmRleCA8IHNjaGVtYS5sZW5ndGgpIHtcblxuICAgICAgICBpZihjdXJyZW50Q2hhckluZGV4IDwgcm93VGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDaGFyID0gcm93VGV4dFtjdXJyZW50Q2hhckluZGV4XTtcbiAgICAgICAgICAgIGlmKGlzRXNjYXBlZCkge1xuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcInJcIikge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWVUZXh0ICs9IFwiXFxyXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaXNFc2NhcGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcIixcIikge1xuICAgICAgICAgICAgICAgICAgICBzZXRDdXJyZW50UHJvcCgpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWVUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFByb3BJbmRleCsrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihjdXJyZW50Q2hhciA9PT0gXCJcXFxcXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNFc2NhcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWVUZXh0ICs9IGN1cnJlbnRDaGFyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1cnJlbnRDaGFySW5kZXgrKzsgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdXJyZW50VmFsdWVUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgIHNldEN1cnJlbnRQcm9wKCk7XG4gICAgICAgICAgICBjdXJyZW50UHJvcEluZGV4Kys7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaXRlbTtcbn07XG5cbmV4cG9ydCBjb25zdCBzZXJpYWxpemVJdGVtID0gKHNjaGVtYSwgaXRlbSkgID0+IHtcblxuICAgIGxldCByb3dUZXh0ID0gXCJcIlxuXG4gICAgZm9yKGxldCBwcm9wIG9mIHNjaGVtYSkge1xuICAgICAgICBjb25zdCB0eXBlID0gZ2V0VHlwZShwcm9wLnR5cGUpO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGhhcyhwcm9wLm5hbWUpKGl0ZW0pXG4gICAgICAgICAgICAgICAgICAgICAgPyBpdGVtW3Byb3AubmFtZV1cbiAgICAgICAgICAgICAgICAgICAgICA6IHR5cGUuZ2V0RGVmYXVsdFZhbHVlKClcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHZhbFN0ciA9IHR5cGUuc3RyaW5naWZ5KHZhbHVlKTtcblxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdmFsU3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2hhciA9IHZhbFN0cltpXTtcbiAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcIixcIiBcbiAgICAgICAgICAgICAgIHx8IGN1cnJlbnRDaGFyID09PSBcIlxcclwiIFxuICAgICAgICAgICAgICAgfHwgY3VycmVudENoYXIgPT09IFwiXFxcXFwiKSB7XG4gICAgICAgICAgICAgICAgcm93VGV4dCArPSBcIlxcXFxcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoY3VycmVudENoYXIgPT09IFwiXFxyXCIpIHtcbiAgICAgICAgICAgICAgICByb3dUZXh0ICs9IFwiclwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByb3dUZXh0ICs9IGN1cnJlbnRDaGFyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcm93VGV4dCArPSBcIixcIjtcbiAgICB9XG5cbiAgICByb3dUZXh0ICs9IFwiXFxyXCI7XG4gICAgcmV0dXJuIHJvd1RleHQ7XG59OyIsImltcG9ydCBsdW5yIGZyb20gJ2x1bnInO1xuaW1wb3J0IHtcbiAgZ2V0SGFzaENvZGUsXG4gIGpvaW5LZXlcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIGdldEFjdHVhbEtleU9mUGFyZW50LFxuICBpc0dsb2JhbEluZGV4LFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHtwcm9taXNlUmVhZGFibGVTdHJlYW19IGZyb20gXCIuL3Byb21pc2VSZWFkYWJsZVN0cmVhbVwiO1xuaW1wb3J0IHsgY3JlYXRlSW5kZXhGaWxlIH0gZnJvbSAnLi9zaGFyZGluZyc7XG5pbXBvcnQgeyBnZW5lcmF0ZVNjaGVtYSB9IGZyb20gJy4vaW5kZXhTY2hlbWFDcmVhdG9yJztcbmltcG9ydCB7IGdldEluZGV4UmVhZGVyLCBDT05USU5VRV9SRUFESU5HX1JFQ09SRFMgfSBmcm9tICcuL3NlcmlhbGl6ZXInO1xuXG5leHBvcnQgY29uc3QgcmVhZEluZGV4ID0gYXN5bmMgKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXkpID0+IHtcbiAgY29uc3QgcmVjb3JkcyA9IFtdO1xuICBjb25zdCBkb1JlYWQgPSBpdGVyYXRlSW5kZXgoXG4gICAgICAgIGFzeW5jIGl0ZW0gPT4ge1xuICAgICAgcmVjb3Jkcy5wdXNoKGl0ZW0pO1xuICAgICAgcmV0dXJuIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcbiAgICB9LFxuICAgICAgICBhc3luYyAoKSA9PiByZWNvcmRzXG4gICk7XG5cbiAgcmV0dXJuIGF3YWl0IGRvUmVhZChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KTtcbn07XG5cbmV4cG9ydCBjb25zdCBzZWFyY2hJbmRleCA9IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5LCBzZWFyY2hQaHJhc2UpID0+IHtcbiAgY29uc3QgcmVjb3JkcyA9IFtdO1xuICBjb25zdCBzY2hlbWEgPSBnZW5lcmF0ZVNjaGVtYShoaWVyYXJjaHksIGluZGV4KTtcbiAgY29uc3QgZG9SZWFkID0gaXRlcmF0ZUluZGV4KFxuICAgICAgICBhc3luYyBpdGVtID0+IHtcbiAgICAgIGNvbnN0IGlkeCA9IGx1bnIoZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnJlZigna2V5Jyk7XG4gICAgICAgIGZvciAoY29uc3QgZmllbGQgb2Ygc2NoZW1hKSB7XG4gICAgICAgICAgdGhpcy5maWVsZChmaWVsZC5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkZChpdGVtKTtcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc2VhcmNoUmVzdWx0cyA9IGlkeC5zZWFyY2goc2VhcmNoUGhyYXNlKTtcbiAgICAgIGlmIChzZWFyY2hSZXN1bHRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpdGVtLl9zZWFyY2hSZXN1bHQgPSBzZWFyY2hSZXN1bHRzWzBdO1xuICAgICAgICByZWNvcmRzLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xuICAgIH0sXG4gICAgICAgIGFzeW5jICgpID0+IHJlY29yZHNcbiAgKTtcblxuICByZXR1cm4gYXdhaXQgZG9SZWFkKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4ZWREYXRhS2V5X2Zyb21JbmRleEtleSA9IChpbmRleEtleSkgPT4gXG4gIGAke2luZGV4S2V5fSR7aW5kZXhLZXkuZW5kc1dpdGgoJy5jc3YnKSA/ICcnIDogJy5jc3YnfWA7XG5cbmV4cG9ydCBjb25zdCB1bmlxdWVJbmRleE5hbWUgPSBpbmRleCA9PiBgaWR4XyR7XG4gIGdldEhhc2hDb2RlKGAke2luZGV4LmZpbHRlcn0ke2luZGV4Lm1hcH1gKVxufS5jc3ZgO1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhlZERhdGFLZXkgPSAoZGVjZW5kYW50S2V5LCBpbmRleE5vZGUpID0+IHtcbiAgaWYgKGlzR2xvYmFsSW5kZXgoaW5kZXhOb2RlKSkgeyByZXR1cm4gYCR7aW5kZXhOb2RlLm5vZGVLZXkoKX0uY3N2YDsgfVxuXG4gIGNvbnN0IGluZGV4ZWREYXRhUGFyZW50S2V5ID0gZ2V0QWN0dWFsS2V5T2ZQYXJlbnQoXG4gICAgaW5kZXhOb2RlLnBhcmVudCgpLm5vZGVLZXkoKSxcbiAgICBkZWNlbmRhbnRLZXksXG4gICk7XG5cbiAgY29uc3QgaW5kZXhOYW1lID0gaW5kZXhOb2RlLm5hbWVcbiAgICA/IGAke2luZGV4Tm9kZS5uYW1lfS5jc3ZgXG4gICAgOiB1bmlxdWVJbmRleE5hbWUoaW5kZXhOb2RlKTtcblxuICByZXR1cm4gam9pbktleShcbiAgICBpbmRleGVkRGF0YVBhcmVudEtleSxcbiAgICBpbmRleE5hbWUsXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgaXRlcmF0ZUluZGV4ID0gKG9uR2V0SXRlbSwgZ2V0RmluYWxSZXN1bHQpID0+IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVhZGFibGVTdHJlYW0gPSBwcm9taXNlUmVhZGFibGVTdHJlYW0oXG4gICAgICAgIGF3YWl0IGRhdGFzdG9yZS5yZWFkYWJsZUZpbGVTdHJlYW0oaW5kZXhlZERhdGFLZXkpXG4gICAgKTtcblxuICAgIGNvbnN0IHJlYWQgPSBnZXRJbmRleFJlYWRlcihoaWVyYXJjaHksIGluZGV4LCByZWFkYWJsZVN0cmVhbSk7XG4gICAgYXdhaXQgcmVhZChvbkdldEl0ZW0pO1xuICAgIHJldHVybiBnZXRGaW5hbFJlc3VsdCgpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGF3YWl0IGRhdGFzdG9yZS5leGlzdHMoaW5kZXhlZERhdGFLZXkpKSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCBjcmVhdGVJbmRleEZpbGUoXG4gICAgICAgIGRhdGFzdG9yZSxcbiAgICAgICAgaW5kZXhlZERhdGFLZXksXG4gICAgICAgIGluZGV4LFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG59O1xuIiwiaW1wb3J0IHsgZmxhdHRlbiwgbWVyZ2UgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgc2FmZUtleSwgYXBpV3JhcHBlciwgJCxcbiAgZXZlbnRzLCBpc05vbkVtcHR5U3RyaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcmVhZEluZGV4LCBzZWFyY2hJbmRleCB9IGZyb20gJy4uL2luZGV4aW5nL3JlYWQnO1xuaW1wb3J0IHtcbiAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5LFxuICBnZXRTaGFyZEtleXNJblJhbmdlLFxufSBmcm9tICcuLi9pbmRleGluZy9zaGFyZGluZyc7XG5pbXBvcnQge1xuICBnZXRFeGFjdE5vZGVGb3JQYXRoLCBpc0luZGV4LFxuICBpc1NoYXJkZWRJbmRleCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGxpc3RJdGVtcyA9IGFwcCA9PiBhc3luYyAoaW5kZXhLZXksIG9wdGlvbnMpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmluZGV4QXBpLmxpc3RJdGVtcyxcbiAgcGVybWlzc2lvbi5yZWFkSW5kZXguaXNBdXRob3JpemVkKGluZGV4S2V5KSxcbiAgeyBpbmRleEtleSwgb3B0aW9ucyB9LFxuICBfbGlzdEl0ZW1zLCBhcHAsIGluZGV4S2V5LCBvcHRpb25zLFxuKTtcblxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7IHJhbmdlU3RhcnRQYXJhbXM6IG51bGwsIHJhbmdlRW5kUGFyYW1zOiBudWxsLCBzZWFyY2hQaHJhc2U6IG51bGwgfTtcblxuY29uc3QgX2xpc3RJdGVtcyA9IGFzeW5jIChhcHAsIGluZGV4S2V5LCBvcHRpb25zID0gZGVmYXVsdE9wdGlvbnMpID0+IHtcbiAgY29uc3QgeyBzZWFyY2hQaHJhc2UsIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zIH0gPSAkKHt9LCBbXG4gICAgbWVyZ2Uob3B0aW9ucyksXG4gICAgbWVyZ2UoZGVmYXVsdE9wdGlvbnMpLFxuICBdKTtcblxuICBjb25zdCBnZXRJdGVtcyA9IGFzeW5jIGtleSA9PiAoaXNOb25FbXB0eVN0cmluZyhzZWFyY2hQaHJhc2UpXG4gICAgPyBhd2FpdCBzZWFyY2hJbmRleChcbiAgICAgIGFwcC5oaWVyYXJjaHksXG4gICAgICBhcHAuZGF0YXN0b3JlLFxuICAgICAgaW5kZXhOb2RlLFxuICAgICAga2V5LFxuICAgICAgc2VhcmNoUGhyYXNlLFxuICAgIClcbiAgICA6IGF3YWl0IHJlYWRJbmRleChcbiAgICAgIGFwcC5oaWVyYXJjaHksXG4gICAgICBhcHAuZGF0YXN0b3JlLFxuICAgICAgaW5kZXhOb2RlLFxuICAgICAga2V5LFxuICAgICkpO1xuXG4gIGluZGV4S2V5ID0gc2FmZUtleShpbmRleEtleSk7XG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoaW5kZXhLZXkpO1xuXG4gIGlmICghaXNJbmRleChpbmRleE5vZGUpKSB7IHRocm93IG5ldyBFcnJvcignc3VwcGxpZWQga2V5IGlzIG5vdCBhbiBpbmRleCcpOyB9XG5cbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICBjb25zdCBzaGFyZEtleXMgPSBhd2FpdCBnZXRTaGFyZEtleXNJblJhbmdlKFxuICAgICAgYXBwLCBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMsXG4gICAgKTtcbiAgICBjb25zdCBpdGVtcyA9IFtdO1xuICAgIGZvciAoY29uc3QgayBvZiBzaGFyZEtleXMpIHtcbiAgICAgIGl0ZW1zLnB1c2goYXdhaXQgZ2V0SXRlbXMoaykpO1xuICAgIH1cbiAgICByZXR1cm4gZmxhdHRlbihpdGVtcyk7XG4gIH1cbiAgcmV0dXJuIGF3YWl0IGdldEl0ZW1zKFxuICAgIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleShpbmRleEtleSksXG4gICk7XG59O1xuIiwiaW1wb3J0IHsgaGFzLCBzb21lIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IG1hcCwgaXNTdHJpbmcgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcbiAgZmluZEZpZWxkLCBnZXROb2RlLCBpc0dsb2JhbEluZGV4LFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgbGlzdEl0ZW1zIH0gZnJvbSAnLi4vaW5kZXhBcGkvbGlzdEl0ZW1zJztcbmltcG9ydCB7XG4gICQsIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXRJbmRleEtleV9CYXNlZE9uRGVjZW5kYW50IH0gZnJvbSAnLi4vaW5kZXhpbmcvc2hhcmRpbmcnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZ2V0Q29udGV4dCA9IGFwcCA9PiByZWNvcmRLZXkgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLnJlY29yZEFwaS5nZXRDb250ZXh0LFxuICBwZXJtaXNzaW9uLnJlYWRSZWNvcmQuaXNBdXRob3JpemVkKHJlY29yZEtleSksXG4gIHsgcmVjb3JkS2V5IH0sXG4gIF9nZXRDb250ZXh0LCBhcHAsIHJlY29yZEtleSxcbik7XG5cbmV4cG9ydCBjb25zdCBfZ2V0Q29udGV4dCA9IChhcHAsIHJlY29yZEtleSkgPT4ge1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShyZWNvcmRLZXkpO1xuXG4gIGNvbnN0IGNhY2hlZFJlZmVyZW5jZUluZGV4ZXMgPSB7fTtcblxuICBjb25zdCBsYXp5TG9hZFJlZmVyZW5jZUluZGV4ID0gYXN5bmMgKHR5cGVPcHRpb25zKSA9PiB7XG4gICAgaWYgKCFoYXMoY2FjaGVkUmVmZXJlbmNlSW5kZXhlcywgdHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5KSkge1xuICAgICAgY2FjaGVkUmVmZXJlbmNlSW5kZXhlc1t0eXBlT3B0aW9ucy5pbmRleE5vZGVLZXldID0ge1xuICAgICAgICB0eXBlT3B0aW9ucyxcbiAgICAgICAgZGF0YTogYXdhaXQgcmVhZFJlZmVyZW5jZUluZGV4KFxuICAgICAgICAgIGFwcCwgcmVjb3JkS2V5LCB0eXBlT3B0aW9ucyxcbiAgICAgICAgKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhY2hlZFJlZmVyZW5jZUluZGV4ZXNbdHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5XTtcbiAgfTtcblxuICBjb25zdCBnZXRUeXBlT3B0aW9ucyA9IHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSA9PiAoaXNTdHJpbmcodHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKVxuICAgID8gZmluZEZpZWxkKHJlY29yZE5vZGUsIHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSlcbiAgICAgIC50eXBlT3B0aW9uc1xuICAgIDogdHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKTtcblxuICByZXR1cm4ge1xuICAgIHJlZmVyZW5jZUV4aXN0czogYXN5bmMgKHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSwga2V5KSA9PiB7XG4gICAgICBjb25zdCB0eXBlT3B0aW9ucyA9IGdldFR5cGVPcHRpb25zKHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSk7XG4gICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGxhenlMb2FkUmVmZXJlbmNlSW5kZXgodHlwZU9wdGlvbnMpO1xuICAgICAgcmV0dXJuIHNvbWUoZGF0YSwgaSA9PiBpLmtleSA9PT0ga2V5KTtcbiAgICB9LFxuICAgIHJlZmVyZW5jZU9wdGlvbnM6IGFzeW5jICh0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHR5cGVPcHRpb25zID0gZ2V0VHlwZU9wdGlvbnModHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKTtcbiAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgbGF6eUxvYWRSZWZlcmVuY2VJbmRleCh0eXBlT3B0aW9ucyk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9LFxuICAgIHJlY29yZE5vZGUsXG4gIH07XG59O1xuXG5jb25zdCByZWFkUmVmZXJlbmNlSW5kZXggPSBhc3luYyAoYXBwLCByZWNvcmRLZXksIHR5cGVPcHRpb25zKSA9PiB7XG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldE5vZGUoYXBwLmhpZXJhcmNoeSwgdHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5KTtcbiAgY29uc3QgaW5kZXhLZXkgPSBpc0dsb2JhbEluZGV4KGluZGV4Tm9kZSlcbiAgICA/IGluZGV4Tm9kZS5ub2RlS2V5KClcbiAgICA6IGdldEluZGV4S2V5X0Jhc2VkT25EZWNlbmRhbnQoXG4gICAgICByZWNvcmRLZXksIGluZGV4Tm9kZSxcbiAgICApO1xuXG4gIGNvbnN0IGl0ZW1zID0gYXdhaXQgbGlzdEl0ZW1zKGFwcCkoaW5kZXhLZXkpO1xuICByZXR1cm4gJChpdGVtcywgW1xuICAgIG1hcChpID0+ICh7XG4gICAgICBrZXk6IGkua2V5LFxuICAgICAgdmFsdWU6IGlbdHlwZU9wdGlvbnMuZGlzcGxheVZhbHVlXSxcbiAgICB9KSksXG4gIF0pO1xufTtcbiIsImltcG9ydCB7XG4gIG1hcCwgcmVkdWNlLCBmaWx0ZXIsXG4gIGlzRW1wdHksIGZsYXR0ZW4sIGVhY2gsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBjb21waWxlRXhwcmVzc2lvbiB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBnZXRFeGFjdE5vZGVGb3JQYXRoIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IHZhbGlkYXRlRmllbGRQYXJzZSwgdmFsaWRhdGVUeXBlQ29uc3RyYWludHMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyAkLCBpc05vdGhpbmcsIGlzTm9uRW1wdHlTdHJpbmcgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgX2dldENvbnRleHQgfSBmcm9tICcuL2dldENvbnRleHQnO1xuXG5jb25zdCBmaWVsZFBhcnNlRXJyb3IgPSAoZmllbGROYW1lLCB2YWx1ZSkgPT4gKHtcbiAgZmllbGRzOiBbZmllbGROYW1lXSxcbiAgbWVzc2FnZTogYENvdWxkIG5vdCBwYXJzZSBmaWVsZCAke2ZpZWxkTmFtZX06JHt2YWx1ZX1gLFxufSk7XG5cbmNvbnN0IHZhbGlkYXRlQWxsRmllbGRQYXJzZSA9IChyZWNvcmQsIHJlY29yZE5vZGUpID0+ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgbWFwKGYgPT4gKHsgbmFtZTogZi5uYW1lLCBwYXJzZVJlc3VsdDogdmFsaWRhdGVGaWVsZFBhcnNlKGYsIHJlY29yZCkgfSkpLFxuICByZWR1Y2UoKGVycm9ycywgZikgPT4ge1xuICAgIGlmIChmLnBhcnNlUmVzdWx0LnN1Y2Nlc3MpIHJldHVybiBlcnJvcnM7XG4gICAgZXJyb3JzLnB1c2goXG4gICAgICBmaWVsZFBhcnNlRXJyb3IoZi5uYW1lLCBmLnBhcnNlUmVzdWx0LnZhbHVlKSxcbiAgICApO1xuICAgIHJldHVybiBlcnJvcnM7XG4gIH0sIFtdKSxcbl0pO1xuXG5jb25zdCB2YWxpZGF0ZUFsbFR5cGVDb25zdHJhaW50cyA9IGFzeW5jIChyZWNvcmQsIHJlY29yZE5vZGUsIGNvbnRleHQpID0+IHtcbiAgY29uc3QgZXJyb3JzID0gW107XG4gIGZvciAoY29uc3QgZmllbGQgb2YgcmVjb3JkTm9kZS5maWVsZHMpIHtcbiAgICAkKGF3YWl0IHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzKGZpZWxkLCByZWNvcmQsIGNvbnRleHQpLCBbXG4gICAgICBmaWx0ZXIoaXNOb25FbXB0eVN0cmluZyksXG4gICAgICBtYXAobSA9PiAoeyBtZXNzYWdlOiBtLCBmaWVsZHM6IFtmaWVsZC5uYW1lXSB9KSksXG4gICAgICBlYWNoKGUgPT4gZXJyb3JzLnB1c2goZSkpLFxuICAgIF0pO1xuICB9XG4gIHJldHVybiBlcnJvcnM7XG59O1xuXG5jb25zdCBydW5SZWNvcmRWYWxpZGF0aW9uUnVsZXMgPSAocmVjb3JkLCByZWNvcmROb2RlKSA9PiB7XG4gIGNvbnN0IHJ1blZhbGlkYXRpb25SdWxlID0gKHJ1bGUpID0+IHtcbiAgICBjb25zdCBpc1ZhbGlkID0gY29tcGlsZUV4cHJlc3Npb24ocnVsZS5leHByZXNzaW9uV2hlblZhbGlkKTtcbiAgICBjb25zdCBleHByZXNzaW9uQ29udGV4dCA9IHsgcmVjb3JkLCBfIH07XG4gICAgcmV0dXJuIChpc1ZhbGlkKGV4cHJlc3Npb25Db250ZXh0KVxuICAgICAgPyB7IHZhbGlkOiB0cnVlIH1cbiAgICAgIDogKHtcbiAgICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgICBmaWVsZHM6IHJ1bGUuaW52YWxpZEZpZWxkcyxcbiAgICAgICAgbWVzc2FnZTogcnVsZS5tZXNzYWdlV2hlbkludmFsaWQsXG4gICAgICB9KSk7XG4gIH07XG5cbiAgcmV0dXJuICQocmVjb3JkTm9kZS52YWxpZGF0aW9uUnVsZXMsIFtcbiAgICBtYXAocnVuVmFsaWRhdGlvblJ1bGUpLFxuICAgIGZsYXR0ZW4sXG4gICAgZmlsdGVyKHIgPT4gci52YWxpZCA9PT0gZmFsc2UpLFxuICAgIG1hcChyID0+ICh7IGZpZWxkczogci5maWVsZHMsIG1lc3NhZ2U6IHIubWVzc2FnZSB9KSksXG4gIF0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlID0gYXBwID0+IGFzeW5jIChyZWNvcmQsIGNvbnRleHQpID0+IHtcbiAgY29udGV4dCA9IGlzTm90aGluZyhjb250ZXh0KVxuICAgID8gX2dldENvbnRleHQoYXBwLCByZWNvcmQua2V5KVxuICAgIDogY29udGV4dDtcblxuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShyZWNvcmQua2V5KTtcbiAgY29uc3QgZmllbGRQYXJzZUZhaWxzID0gdmFsaWRhdGVBbGxGaWVsZFBhcnNlKHJlY29yZCwgcmVjb3JkTm9kZSk7XG5cbiAgLy8gbm9uIHBhcnNpbmcgd291bGQgY2F1c2UgZnVydGhlciBpc3N1ZXMgLSBleGl0IGhlcmVcbiAgaWYgKCFpc0VtcHR5KGZpZWxkUGFyc2VGYWlscykpIHsgcmV0dXJuICh7IGlzVmFsaWQ6IGZhbHNlLCBlcnJvcnM6IGZpZWxkUGFyc2VGYWlscyB9KTsgfVxuXG4gIGNvbnN0IHJlY29yZFZhbGlkYXRpb25SdWxlRmFpbHMgPSBydW5SZWNvcmRWYWxpZGF0aW9uUnVsZXMocmVjb3JkLCByZWNvcmROb2RlKTtcbiAgY29uc3QgdHlwZUNvbnRyYWludEZhaWxzID0gYXdhaXQgdmFsaWRhdGVBbGxUeXBlQ29uc3RyYWludHMocmVjb3JkLCByZWNvcmROb2RlLCBjb250ZXh0KTtcblxuICBpZiAoaXNFbXB0eShmaWVsZFBhcnNlRmFpbHMpXG4gICAgICAgJiYgaXNFbXB0eShyZWNvcmRWYWxpZGF0aW9uUnVsZUZhaWxzKVxuICAgICAgICYmIGlzRW1wdHkodHlwZUNvbnRyYWludEZhaWxzKSkge1xuICAgIHJldHVybiAoeyBpc1ZhbGlkOiB0cnVlLCBlcnJvcnM6IFtdIH0pO1xuICB9XG5cbiAgcmV0dXJuICh7XG4gICAgaXNWYWxpZDogZmFsc2UsXG4gICAgZXJyb3JzOiBfLnVuaW9uKGZpZWxkUGFyc2VGYWlscywgdHlwZUNvbnRyYWludEZhaWxzLCByZWNvcmRWYWxpZGF0aW9uUnVsZUZhaWxzKSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgaXNDb2xsZWN0aW9uUmVjb3JkLFxuICBpc1Jvb3QsXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyAkLCBhbGxUcnVlLCBqb2luS2V5IH0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgZW5zdXJlQ29sbGVjdGlvbklzSW5pdGlhbGlzZWQgPSBhc3luYyAoZGF0YXN0b3JlLCBub2RlLCBwYXJlbnRLZXkpID0+IHtcbiAgaWYgKCFhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKHBhcmVudEtleSkpIHtcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKHBhcmVudEtleSk7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihcbiAgICAgIGpvaW5LZXkocGFyZW50S2V5LCAnYWxsaWRzJyksXG4gICAgKTtcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKFxuICAgICAgam9pbktleShcbiAgICAgICAgcGFyZW50S2V5LFxuICAgICAgICAnYWxsaWRzJyxcbiAgICAgICAgbm9kZS5ub2RlSWQudG9TdHJpbmcoKSxcbiAgICAgICksXG4gICAgKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxpc2VSb290Q29sbGVjdGlvbnMgPSBhc3luYyAoZGF0YXN0b3JlLCBoaWVyYXJjaHkpID0+IHtcbiAgY29uc3Qgcm9vdENvbGxlY3Rpb25SZWNvcmQgPSBhbGxUcnVlKFxuICAgIG4gPT4gaXNSb290KG4ucGFyZW50KCkpLFxuICAgIGlzQ29sbGVjdGlvblJlY29yZCxcbiAgKTtcblxuICBjb25zdCBmbGF0aGllcmFyY2h5ID0gZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGhpZXJhcmNoeSk7XG5cbiAgY29uc3QgY29sbGVjdGlvblJlY29yZHMgPSAkKGZsYXRoaWVyYXJjaHksIFtcbiAgICBmaWx0ZXIocm9vdENvbGxlY3Rpb25SZWNvcmQpLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IGNvbCBvZiBjb2xsZWN0aW9uUmVjb3Jkcykge1xuICAgIGF3YWl0IGVuc3VyZUNvbGxlY3Rpb25Jc0luaXRpYWxpc2VkKFxuICAgICAgZGF0YXN0b3JlLFxuICAgICAgY29sLFxuICAgICAgY29sLmNvbGxlY3Rpb25QYXRoUmVneCgpLFxuICAgICk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlQ2hpbGRDb2xsZWN0aW9ucyA9IGFzeW5jIChhcHAsIHJlY29yZEtleSkgPT4ge1xuICBjb25zdCBjaGlsZENvbGxlY3Rpb25SZWNvcmRzID0gJChyZWNvcmRLZXksIFtcbiAgICBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpLFxuICAgIG4gPT4gbi5jaGlsZHJlbixcbiAgICBmaWx0ZXIoaXNDb2xsZWN0aW9uUmVjb3JkKSxcbiAgXSk7XG5cbiAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZENvbGxlY3Rpb25SZWNvcmRzKSB7XG4gICAgYXdhaXQgZW5zdXJlQ29sbGVjdGlvbklzSW5pdGlhbGlzZWQoXG4gICAgICBhcHAuZGF0YXN0b3JlLFxuICAgICAgY2hpbGQsXG4gICAgICBqb2luS2V5KHJlY29yZEtleSwgY2hpbGQuY29sbGVjdGlvbk5hbWUpLFxuICAgICk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBqb2luLCBwdWxsLFxuICBtYXAsIGZsYXR0ZW4sIG9yZGVyQnksXG4gIGZpbHRlciwgZmluZCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIGdldFBhcmVudEtleSxcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5LCBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgsXG4gIGlzQ29sbGVjdGlvblJlY29yZCwgaXNBbmNlc3Rvcixcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IGpvaW5LZXksIHNhZmVLZXksICQgfSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBhbGxJZENoYXJzID0gJzAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXy0nO1xuXG5jb25zdCBhbGxJZHNTdHJpbmdzRm9yRmFjdG9yID0gKGNvbGxlY3Rpb25Ob2RlKSA9PiB7XG4gIGNvbnN0IGZhY3RvciA9IGNvbGxlY3Rpb25Ob2RlLmFsbGlkc1NoYXJkRmFjdG9yO1xuICBjb25zdCBjaGFyUmFuZ2VQZXJTaGFyZCA9IDY0IC8gZmFjdG9yO1xuICBjb25zdCBhbGxJZFN0cmluZ3MgPSBbXTtcbiAgbGV0IGluZGV4ID0gMDtcbiAgbGV0IGN1cnJlbnRJZHNTaGFyZCA9ICcnO1xuICB3aGlsZSAoaW5kZXggPCA2NCkge1xuICAgIGN1cnJlbnRJZHNTaGFyZCArPSBhbGxJZENoYXJzW2luZGV4XTtcbiAgICBpZiAoKGluZGV4ICsgMSkgJSBjaGFyUmFuZ2VQZXJTaGFyZCA9PT0gMCkge1xuICAgICAgYWxsSWRTdHJpbmdzLnB1c2goY3VycmVudElkc1NoYXJkKTtcbiAgICAgIGN1cnJlbnRJZHNTaGFyZCA9ICcnO1xuICAgIH1cbiAgICBpbmRleCsrO1xuICB9XG5cbiAgcmV0dXJuIGFsbElkU3RyaW5ncztcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRBbGxJZHNTaGFyZE5hbWVzID0gKGFwcEhpZXJhcmNoeSwgY29sbGVjdGlvbktleSkgPT4ge1xuICBjb25zdCBjb2xsZWN0aW9uUmVjb3JkTm9kZSA9IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHBIaWVyYXJjaHkpKGNvbGxlY3Rpb25LZXkpO1xuICByZXR1cm4gJChjb2xsZWN0aW9uUmVjb3JkTm9kZSwgW1xuICAgIGMgPT4gW2Mubm9kZUlkXSxcbiAgICBtYXAoaSA9PiBtYXAoYyA9PiBfYWxsSWRzU2hhcmRLZXkoY29sbGVjdGlvbktleSwgaSwgYykpKGFsbElkc1N0cmluZ3NGb3JGYWN0b3IoY29sbGVjdGlvblJlY29yZE5vZGUpKSksXG4gICAgZmxhdHRlbixcbiAgXSk7XG59O1xuXG5jb25zdCBfYWxsSWRzU2hhcmRLZXkgPSAoY29sbGVjdGlvbktleSwgY2hpbGRObywgc2hhcmRLZXkpID0+IGpvaW5LZXkoXG4gIGNvbGxlY3Rpb25LZXksXG4gICdhbGxpZHMnLFxuICBjaGlsZE5vLFxuICBzaGFyZEtleSxcbik7XG5cbmV4cG9ydCBjb25zdCBnZXRBbGxJZHNTaGFyZEtleSA9IChhcHBIaWVyYXJjaHksIGNvbGxlY3Rpb25LZXksIHJlY29yZElkKSA9PiB7XG4gIGNvbnN0IGluZGV4T2ZGaXJzdERhc2ggPSByZWNvcmRJZC5pbmRleE9mKCctJyk7XG5cbiAgY29uc3QgY29sbGVjdGlvbk5vZGUgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwSGllcmFyY2h5KShjb2xsZWN0aW9uS2V5KTtcblxuICBjb25zdCBpZEZpcnN0Q2hhciA9IHJlY29yZElkW2luZGV4T2ZGaXJzdERhc2ggKyAxXTtcbiAgY29uc3QgYWxsSWRzU2hhcmRJZCA9ICQoY29sbGVjdGlvbk5vZGUsIFtcbiAgICBhbGxJZHNTdHJpbmdzRm9yRmFjdG9yLFxuICAgIGZpbmQoaSA9PiBpLmluY2x1ZGVzKGlkRmlyc3RDaGFyKSksXG4gIF0pO1xuXG4gIHJldHVybiBfYWxsSWRzU2hhcmRLZXkoXG4gICAgY29sbGVjdGlvbktleSxcbiAgICByZWNvcmRJZC5zbGljZSgwLCBpbmRleE9mRmlyc3REYXNoKSxcbiAgICBhbGxJZHNTaGFyZElkLFxuICApO1xufTtcblxuY29uc3QgZ2V0T3JDcmVhdGVTaGFyZEZpbGUgPSBhc3luYyAoZGF0YXN0b3JlLCBhbGxJZHNLZXkpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgZGF0YXN0b3JlLmxvYWRGaWxlKGFsbElkc0tleSk7XG4gIH0gY2F0Y2ggKGVMb2FkKSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGaWxlKGFsbElkc0tleSwgJycpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH0gY2F0Y2ggKGVDcmVhdGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEVycm9yIGxvYWRpbmcsIHRoZW4gY3JlYXRpbmcgYWxsSWRzICR7YWxsSWRzS2V5XG4gICAgICAgIH0gOiBMT0FEIDogJHtlTG9hZC5tZXNzYWdlXG4gICAgICAgIH0gOiBDUkVBVEUgOiAke2VDcmVhdGV9YCxcbiAgICAgICk7XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCBnZXRTaGFyZEZpbGUgPSBhc3luYyAoZGF0YXN0b3JlLCBhbGxJZHNLZXkpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgZGF0YXN0b3JlLmxvYWRGaWxlKGFsbElkc0tleSk7XG4gIH0gY2F0Y2ggKGVMb2FkKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgYWRkVG9BbGxJZHMgPSAoYXBwSGllcmFyY2h5LCBkYXRhc3RvcmUpID0+IGFzeW5jIChyZWNvcmQpID0+IHtcbiAgY29uc3QgYWxsSWRzS2V5ID0gZ2V0QWxsSWRzU2hhcmRLZXkoXG4gICAgYXBwSGllcmFyY2h5LFxuICAgIGdldFBhcmVudEtleShyZWNvcmQua2V5KSxcbiAgICByZWNvcmQuaWQsXG4gICk7XG5cbiAgbGV0IGFsbElkcyA9IGF3YWl0IGdldE9yQ3JlYXRlU2hhcmRGaWxlKGRhdGFzdG9yZSwgYWxsSWRzS2V5KTtcblxuICBhbGxJZHMgKz0gYCR7YWxsSWRzLmxlbmd0aCA+IDAgPyAnLCcgOiAnJ30ke3JlY29yZC5pZH1gO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS51cGRhdGVGaWxlKGFsbElkc0tleSwgYWxsSWRzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRBbGxJZHNJdGVyYXRvciA9IGFwcCA9PiBhc3luYyAoY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSkgPT4ge1xuICBjb2xsZWN0aW9uX0tleV9vcl9Ob2RlS2V5ID0gc2FmZUtleShjb2xsZWN0aW9uX0tleV9vcl9Ob2RlS2V5KTtcbiAgY29uc3QgdGFyZ2V0Tm9kZSA9IGdldENvbGxlY3Rpb25Ob2RlQnlLZXlPck5vZGVLZXkoXG4gICAgYXBwLmhpZXJhcmNoeSxcbiAgICBjb2xsZWN0aW9uX0tleV9vcl9Ob2RlS2V5LFxuICApO1xuXG4gIGNvbnN0IGdldEFsbElkc0l0ZXJhdG9yRm9yQ29sbGVjdGlvbktleSA9IGFzeW5jIChjb2xsZWN0aW9uS2V5KSA9PiB7XG4gICAgY29uc3QgYWxsX2FsbElkc0tleXMgPSBnZXRBbGxJZHNTaGFyZE5hbWVzKGFwcC5oaWVyYXJjaHksIGNvbGxlY3Rpb25LZXkpO1xuICAgIGxldCBzaGFyZEluZGV4ID0gMDtcblxuICAgIGNvbnN0IGFsbElkc0Zyb21TaGFyZEl0ZXJhdG9yID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKHNoYXJkSW5kZXggPT09IGFsbF9hbGxJZHNLZXlzLmxlbmd0aCkgeyByZXR1cm4gKHsgZG9uZTogdHJ1ZSwgcmVzdWx0OiB7IGlkczogW10sIGNvbGxlY3Rpb25LZXkgfSB9KTsgfVxuXG4gICAgICBjb25zdCBzaGFyZEtleSA9IGFsbF9hbGxJZHNLZXlzW3NoYXJkSW5kZXhdO1xuXG4gICAgICBjb25zdCBhbGxJZHMgPSBhd2FpdCBnZXRBbGxJZHNGcm9tU2hhcmQoYXBwLmRhdGFzdG9yZSwgc2hhcmRLZXkpO1xuXG4gICAgICBzaGFyZEluZGV4Kys7XG5cbiAgICAgIHJldHVybiAoe1xuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICBpZHM6IGFsbElkcyxcbiAgICAgICAgICBjb2xsZWN0aW9uS2V5LFxuICAgICAgICB9LFxuICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gYWxsSWRzRnJvbVNoYXJkSXRlcmF0b3I7XG4gIH07XG5cbiAgY29uc3QgYW5jZXN0b3JzID0gJChnZXRGbGF0dGVuZWRIaWVyYXJjaHkoYXBwLmhpZXJhcmNoeSksIFtcbiAgICBmaWx0ZXIoaXNDb2xsZWN0aW9uUmVjb3JkKSxcbiAgICBmaWx0ZXIobiA9PiBpc0FuY2VzdG9yKHRhcmdldE5vZGUpKG4pXG4gICAgICAgICAgICAgICAgICAgIHx8IG4ubm9kZUtleSgpID09PSB0YXJnZXROb2RlLm5vZGVLZXkoKSksXG4gICAgb3JkZXJCeShbbiA9PiBuLm5vZGVLZXkoKS5sZW5ndGhdLCBbJ2FzYyddKSxcbiAgXSk7IC8vIHBhcmVudHMgZmlyc3RcblxuICBjb25zdCB0cmF2ZXJzZUZvckl0ZXJhdGVyYXRvcnMgPSBhc3luYyAocGFyZW50UmVjb3JkS2V5ID0gJycsIGN1cnJlbnROb2RlSW5kZXggPSAwKSA9PiB7XG4gICAgY29uc3QgY3VycmVudE5vZGUgPSBhbmNlc3RvcnNbY3VycmVudE5vZGVJbmRleF07XG4gICAgY29uc3QgY3VycmVudENvbGxlY3Rpb25LZXkgPSBqb2luS2V5KFxuICAgICAgcGFyZW50UmVjb3JkS2V5LFxuICAgICAgY3VycmVudE5vZGUuY29sbGVjdGlvbk5hbWUsXG4gICAgKTtcbiAgICBpZiAoY3VycmVudE5vZGUubm9kZUtleSgpID09PSB0YXJnZXROb2RlLm5vZGVLZXkoKSkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgYXdhaXQgZ2V0QWxsSWRzSXRlcmF0b3JGb3JDb2xsZWN0aW9uS2V5KFxuICAgICAgICAgIGN1cnJlbnRDb2xsZWN0aW9uS2V5LFxuICAgICAgICApXTtcbiAgICB9XG4gICAgY29uc3QgYWxsSXRlcmF0b3JzID0gW107XG4gICAgY29uc3QgY3VycmVudEl0ZXJhdG9yID0gYXdhaXQgZ2V0QWxsSWRzSXRlcmF0b3JGb3JDb2xsZWN0aW9uS2V5KFxuICAgICAgY3VycmVudENvbGxlY3Rpb25LZXksXG4gICAgKTtcblxuICAgIGxldCBpZHMgPSBhd2FpdCBjdXJyZW50SXRlcmF0b3IoKTtcbiAgICB3aGlsZSAoaWRzLmRvbmUgPT09IGZhbHNlKSB7XG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIGlkcy5yZXN1bHQuaWRzKSB7XG4gICAgICAgIGFsbEl0ZXJhdG9ycy5wdXNoKFxuICAgICAgICAgIGF3YWl0IHRyYXZlcnNlRm9ySXRlcmF0ZXJhdG9ycyhcbiAgICAgICAgICAgIGpvaW5LZXkoY3VycmVudENvbGxlY3Rpb25LZXksIGlkKSxcbiAgICAgICAgICAgIGN1cnJlbnROb2RlSW5kZXggKyAxLFxuICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlkcyA9IGF3YWl0IGN1cnJlbnRJdGVyYXRvcigpO1xuICAgIH1cblxuICAgIHJldHVybiBmbGF0dGVuKGFsbEl0ZXJhdG9ycyk7XG4gIH07XG5cbiAgY29uc3QgaXRlcmF0b3JzQXJyYXkgPSBhd2FpdCB0cmF2ZXJzZUZvckl0ZXJhdGVyYXRvcnMoKTtcbiAgbGV0IGN1cnJlbnRJdGVyYXRvckluZGV4ID0gMDtcbiAgcmV0dXJuIGFzeW5jICgpID0+IHtcbiAgICBpZiAoaXRlcmF0b3JzQXJyYXkubGVuZ3RoID09PSAwKSB7IHJldHVybiB7IGRvbmU6IHRydWUsIHJlc3VsdDogW10gfTsgfVxuICAgIGNvbnN0IGlubmVyUmVzdWx0ID0gYXdhaXQgaXRlcmF0b3JzQXJyYXlbY3VycmVudEl0ZXJhdG9ySW5kZXhdKCk7XG4gICAgaWYgKCFpbm5lclJlc3VsdC5kb25lKSB7IHJldHVybiBpbm5lclJlc3VsdDsgfVxuICAgIGlmIChjdXJyZW50SXRlcmF0b3JJbmRleCA9PSBpdGVyYXRvcnNBcnJheS5sZW5ndGggLSAxKSB7XG4gICAgICByZXR1cm4geyBkb25lOiB0cnVlLCByZXN1bHQ6IGlubmVyUmVzdWx0LnJlc3VsdCB9O1xuICAgIH1cbiAgICBjdXJyZW50SXRlcmF0b3JJbmRleCsrO1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCByZXN1bHQ6IGlubmVyUmVzdWx0LnJlc3VsdCB9O1xuICB9O1xufTtcblxuY29uc3QgZ2V0QWxsSWRzRnJvbVNoYXJkID0gYXN5bmMgKGRhdGFzdG9yZSwgc2hhcmRLZXkpID0+IHtcbiAgY29uc3QgYWxsSWRzU3RyID0gYXdhaXQgZ2V0U2hhcmRGaWxlKGRhdGFzdG9yZSwgc2hhcmRLZXkpO1xuXG4gIGNvbnN0IGFsbElkcyA9IFtdO1xuICBsZXQgY3VycmVudElkID0gJyc7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsSWRzU3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY3VycmVudENoYXIgPSBhbGxJZHNTdHIuY2hhckF0KGkpO1xuICAgIGNvbnN0IGlzTGFzdCA9IChpID09PSBhbGxJZHNTdHIubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGN1cnJlbnRDaGFyID09PSAnLCcgfHwgaXNMYXN0KSB7XG4gICAgICBpZiAoaXNMYXN0KSBjdXJyZW50SWQgKz0gY3VycmVudENoYXI7XG4gICAgICBhbGxJZHMucHVzaChjdXJyZW50SWQpO1xuICAgICAgY3VycmVudElkID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnRJZCArPSBjdXJyZW50Q2hhcjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFsbElkcztcbn07XG5cbmV4cG9ydCBjb25zdCByZW1vdmVGcm9tQWxsSWRzID0gKGFwcEhpZXJhcmNoeSwgZGF0YXN0b3JlKSA9PiBhc3luYyAocmVjb3JkKSA9PiB7XG4gIGNvbnN0IHNoYXJkS2V5ID0gZ2V0QWxsSWRzU2hhcmRLZXkoXG4gICAgYXBwSGllcmFyY2h5LFxuICAgIGdldFBhcmVudEtleShyZWNvcmQua2V5KSxcbiAgICByZWNvcmQuaWQsXG4gICk7XG4gIGNvbnN0IGFsbElkcyA9IGF3YWl0IGdldEFsbElkc0Zyb21TaGFyZChkYXRhc3RvcmUsIHNoYXJkS2V5KTtcblxuICBjb25zdCBuZXdJZHMgPSAkKGFsbElkcywgW1xuICAgIHB1bGwocmVjb3JkLmlkKSxcbiAgICBqb2luKCcsJyksXG4gIF0pO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS51cGRhdGVGaWxlKHNoYXJkS2V5LCBuZXdJZHMpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0QWxsSWRzSXRlcmF0b3I7XG4iLCJpbXBvcnQge1xuICBqb2luS2V5LCBrZXlTZXAsIGdldEhhc2hDb2RlLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0TGFzdFBhcnRJbktleSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5cbmV4cG9ydCBjb25zdCBUUkFOU0FDVElPTlNfRk9MREVSID0gYCR7a2V5U2VwfS50cmFuc2FjdGlvbnNgO1xuZXhwb3J0IGNvbnN0IExPQ0tfRklMRU5BTUUgPSAnbG9jayc7XG5leHBvcnQgY29uc3QgTE9DS19GSUxFX0tFWSA9IGpvaW5LZXkoXG4gIFRSQU5TQUNUSU9OU19GT0xERVIsIExPQ0tfRklMRU5BTUUsXG4pO1xuZXhwb3J0IGNvbnN0IGlkU2VwID0gJyQnO1xuXG5jb25zdCBpc09mVHlwZSA9IHR5cCA9PiB0cmFucyA9PiB0cmFucy50cmFuc2FjdGlvblR5cGUgPT09IHR5cDtcblxuZXhwb3J0IGNvbnN0IENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04gPSAnY3JlYXRlJztcbmV4cG9ydCBjb25zdCBVUERBVEVfUkVDT1JEX1RSQU5TQUNUSU9OID0gJ3VwZGF0ZSc7XG5leHBvcnQgY29uc3QgREVMRVRFX1JFQ09SRF9UUkFOU0FDVElPTiA9ICdkZWxldGUnO1xuZXhwb3J0IGNvbnN0IEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OID0gJ2J1aWxkJztcblxuZXhwb3J0IGNvbnN0IGlzVXBkYXRlID0gaXNPZlR5cGUoVVBEQVRFX1JFQ09SRF9UUkFOU0FDVElPTik7XG5leHBvcnQgY29uc3QgaXNEZWxldGUgPSBpc09mVHlwZShERUxFVEVfUkVDT1JEX1RSQU5TQUNUSU9OKTtcbmV4cG9ydCBjb25zdCBpc0NyZWF0ZSA9IGlzT2ZUeXBlKENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04pO1xuZXhwb3J0IGNvbnN0IGlzQnVpbGRJbmRleCA9IGlzT2ZUeXBlKEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OKTtcblxuZXhwb3J0IGNvbnN0IGtleVRvRm9sZGVyTmFtZSA9IG5vZGVLZXkgPT4gZ2V0SGFzaENvZGUobm9kZUtleSk7XG5cbmV4cG9ydCBjb25zdCBnZXRUcmFuc2FjdGlvbklkID0gKHJlY29yZElkLCB0cmFuc2FjdGlvblR5cGUsIHVuaXF1ZUlkKSA9PiBcbiAgYCR7cmVjb3JkSWR9JHtpZFNlcH0ke3RyYW5zYWN0aW9uVHlwZX0ke2lkU2VwfSR7dW5pcXVlSWR9YDtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkSW5kZXhGb2xkZXIgPSAnLkJVSUxELSc7XG5leHBvcnQgY29uc3Qgbm9kZUtleUhhc2hGcm9tQnVpbGRGb2xkZXIgPSBmb2xkZXIgPT4gZm9sZGVyLnJlcGxhY2UoYnVpbGRJbmRleEZvbGRlciwgJycpO1xuXG5leHBvcnQgY29uc3QgaXNCdWlsZEluZGV4Rm9sZGVyID0ga2V5ID0+IGdldExhc3RQYXJ0SW5LZXkoa2V5KS5zdGFydHNXaXRoKGJ1aWxkSW5kZXhGb2xkZXIpO1xuXG5leHBvcnQgY29uc3QgSW5kZXhOb2RlS2V5Rm9sZGVyID0gaW5kZXhOb2RlS2V5ID0+IGpvaW5LZXkoXG4gIFRSQU5TQUNUSU9OU19GT0xERVIsXG4gIGJ1aWxkSW5kZXhGb2xkZXIgKyBrZXlUb0ZvbGRlck5hbWUoaW5kZXhOb2RlS2V5KSxcbik7XG5cbmV4cG9ydCBjb25zdCBJbmRleE5vZGVLZXlCYXRjaEZvbGRlciA9IChpbmRleE5vZGVLZXksIGNvdW50KSA9PiBcbiAgam9pbktleShJbmRleE5vZGVLZXlGb2xkZXIoaW5kZXhOb2RlS2V5KSwgTWF0aC5mbG9vcihjb3VudCAvIEJVSUxESU5ERVhfQkFUQ0hfQ09VTlQpLnRvU3RyaW5nKCkpO1xuXG5leHBvcnQgY29uc3QgSW5kZXhTaGFyZEtleUZvbGRlciA9IChpbmRleE5vZGVLZXksIGluZGV4U2hhcmRLZXkpID0+IFxuICBqb2luS2V5KEluZGV4Tm9kZUtleUZvbGRlcihpbmRleE5vZGVLZXkpLCBpbmRleFNoYXJkS2V5KTtcblxuZXhwb3J0IGNvbnN0IEJVSUxESU5ERVhfQkFUQ0hfQ09VTlQgPSAxMDAwO1xuZXhwb3J0IGNvbnN0IHRpbWVvdXRNaWxsaXNlY29uZHMgPSAzMCAqIDEwMDA7IC8vIDMwIHNlY3NcbmV4cG9ydCBjb25zdCBtYXhMb2NrUmV0cmllcyA9IDE7XG4iLCJpbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHsgam9pbktleSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXRMYXN0UGFydEluS2V5IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7XG4gIEluZGV4Tm9kZUtleUZvbGRlciwgQlVJTERJTkRFWF9CQVRDSF9DT1VOVCxcbiAgSW5kZXhOb2RlS2V5QmF0Y2hGb2xkZXIsIFRSQU5TQUNUSU9OU19GT0xERVIsIGdldFRyYW5zYWN0aW9uSWQsIENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04sIFVQREFURV9SRUNPUkRfVFJBTlNBQ1RJT04sXG4gIERFTEVURV9SRUNPUkRfVFJBTlNBQ1RJT04sIEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OLFxufSBmcm9tICcuL3RyYW5zYWN0aW9uc0NvbW1vbic7XG5cblxuZXhwb3J0IGNvbnN0IHRyYW5zYWN0aW9uRm9yQ3JlYXRlUmVjb3JkID0gYXN5bmMgKGFwcCwgcmVjb3JkKSA9PiBhd2FpdCB0cmFuc2FjdGlvbihcbiAgYXBwLmRhdGFzdG9yZSwgQ1JFQVRFX1JFQ09SRF9UUkFOU0FDVElPTixcbiAgcmVjb3JkLmtleSwgeyByZWNvcmQgfSxcbiAgZ2V0VHJhbnNhY3Rpb25LZXlfUmVjb3Jkcyxcbik7XG5cbmV4cG9ydCBjb25zdCB0cmFuc2FjdGlvbkZvclVwZGF0ZVJlY29yZCA9IGFzeW5jIChhcHAsIG9sZFJlY29yZCwgbmV3UmVjb3JkKSA9PiBhd2FpdCB0cmFuc2FjdGlvbihcbiAgYXBwLmRhdGFzdG9yZSwgVVBEQVRFX1JFQ09SRF9UUkFOU0FDVElPTixcbiAgbmV3UmVjb3JkLmtleSwgeyBvbGRSZWNvcmQsIHJlY29yZDogbmV3UmVjb3JkIH0sXG4gIGdldFRyYW5zYWN0aW9uS2V5X1JlY29yZHMsXG4pO1xuXG5leHBvcnQgY29uc3QgdHJhbnNhY3Rpb25Gb3JEZWxldGVSZWNvcmQgPSBhc3luYyAoYXBwLCByZWNvcmQpID0+IGF3YWl0IHRyYW5zYWN0aW9uKFxuICBhcHAuZGF0YXN0b3JlLCBERUxFVEVfUkVDT1JEX1RSQU5TQUNUSU9OLFxuICByZWNvcmQua2V5LCB7IHJlY29yZCB9LFxuICBnZXRUcmFuc2FjdGlvbktleV9SZWNvcmRzLFxuKTtcblxuZXhwb3J0IGNvbnN0IHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleCA9IGFzeW5jIChhcHAsIGluZGV4Tm9kZUtleSwgcmVjb3JkS2V5LCBjb3VudCkgPT4ge1xuICBjb25zdCB0cmFuc2FjdGlvbkZvbGRlciA9IEluZGV4Tm9kZUtleUJhdGNoRm9sZGVyKGluZGV4Tm9kZUtleSwgY291bnQpO1xuICBpZiAoY291bnQgJSBCVUlMRElOREVYX0JBVENIX0NPVU5UID09PSAwKSB7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVGb2xkZXIodHJhbnNhY3Rpb25Gb2xkZXIpO1xuICB9XG5cbiAgcmV0dXJuIGF3YWl0IHRyYW5zYWN0aW9uKFxuICAgIGFwcC5kYXRhc3RvcmUsIEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OLFxuICAgIHJlY29yZEtleSwgeyByZWNvcmRLZXkgfSxcbiAgICBpZCA9PiBqb2luS2V5KHRyYW5zYWN0aW9uRm9sZGVyLCBpZCksXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlQnVpbGRJbmRleEZvbGRlciA9IGFzeW5jIChkYXRhc3RvcmUsIGluZGV4Tm9kZUtleSkgPT4gYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihcbiAgSW5kZXhOb2RlS2V5Rm9sZGVyKGluZGV4Tm9kZUtleSksXG4pO1xuXG5jb25zdCBnZXRUcmFuc2FjdGlvbktleV9SZWNvcmRzID0gaWQgPT4gam9pbktleShUUkFOU0FDVElPTlNfRk9MREVSLCBpZCk7XG5cbmNvbnN0IHRyYW5zYWN0aW9uID0gYXN5bmMgKGRhdGFzdG9yZSwgdHJhbnNhY3Rpb25UeXBlLCByZWNvcmRLZXksIGRhdGEsIGdldFRyYW5zYWN0aW9uS2V5KSA9PiB7XG4gIGNvbnN0IHJlY29yZElkID0gZ2V0TGFzdFBhcnRJbktleShyZWNvcmRLZXkpO1xuICBjb25zdCB1bmlxdWVJZCA9IGdlbmVyYXRlKCk7XG4gIGNvbnN0IGlkID0gZ2V0VHJhbnNhY3Rpb25JZChcbiAgICByZWNvcmRJZCwgdHJhbnNhY3Rpb25UeXBlLCB1bmlxdWVJZCxcbiAgKTtcblxuICBjb25zdCBrZXkgPSBnZXRUcmFuc2FjdGlvbktleShpZCk7XG5cbiAgY29uc3QgdHJhbnMgPSB7XG4gICAgdHJhbnNhY3Rpb25UeXBlLFxuICAgIHJlY29yZEtleSxcbiAgICAuLi5kYXRhLFxuICAgIGlkLFxuICB9O1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKFxuICAgIGtleSwgdHJhbnMsXG4gICk7XG5cbiAgcmV0dXJuIHRyYW5zO1xufTtcbiIsImltcG9ydCB7IGlzU2hhcmRlZEluZGV4IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IGpvaW5LZXkgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0U2hhcmRNYXBLZXksIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSwgY3JlYXRlSW5kZXhGaWxlIH0gZnJvbSAnLi9zaGFyZGluZyc7XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlSW5kZXggPSBhc3luYyAoZGF0YXN0b3JlLCBwYXJlbnRLZXksIGluZGV4KSA9PiB7XG4gIGNvbnN0IGluZGV4S2V5ID0gam9pbktleShwYXJlbnRLZXksIGluZGV4Lm5hbWUpO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoaW5kZXhLZXkpO1xuXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleCkpIHtcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRmlsZShcbiAgICAgIGdldFNoYXJkTWFwS2V5KGluZGV4S2V5KSxcbiAgICAgICdbXScsXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCBjcmVhdGVJbmRleEZpbGUoXG4gICAgICBkYXRhc3RvcmUsXG4gICAgICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXkoaW5kZXhLZXkpLFxuICAgICAgaW5kZXgsXG4gICAgKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIGNsb25lRGVlcCxcbiAgZmxhdHRlbixcbiAgbWFwLFxuICBmaWx0ZXIsXG4gIGlzRXF1YWxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGluaXRpYWxpc2VDaGlsZENvbGxlY3Rpb25zIH0gZnJvbSAnLi4vY29sbGVjdGlvbkFwaS9pbml0aWFsaXNlJztcbmltcG9ydCB7IHZhbGlkYXRlIH0gZnJvbSAnLi92YWxpZGF0ZSc7XG5pbXBvcnQgeyBfbG9hZCwgZ2V0UmVjb3JkRmlsZU5hbWUgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IHtcbiAgYXBpV3JhcHBlciwgZXZlbnRzLCAkLCBqb2luS2V5LFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxuICBpc1JlY29yZCxcbiAgZ2V0Tm9kZSxcbiAgZ2V0TGFzdFBhcnRJbktleSxcbiAgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvTm9kZSxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IG1hcFJlY29yZCB9IGZyb20gJy4uL2luZGV4aW5nL2V2YWx1YXRlJztcbmltcG9ydCB7IGxpc3RJdGVtcyB9IGZyb20gJy4uL2luZGV4QXBpL2xpc3RJdGVtcyc7XG5pbXBvcnQgeyBhZGRUb0FsbElkcyB9IGZyb20gJy4uL2luZGV4aW5nL2FsbElkcyc7XG5pbXBvcnQge1xuICB0cmFuc2FjdGlvbkZvckNyZWF0ZVJlY29yZCxcbiAgdHJhbnNhY3Rpb25Gb3JVcGRhdGVSZWNvcmQsXG59IGZyb20gJy4uL3RyYW5zYWN0aW9ucy9jcmVhdGUnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgaW5pdGlhbGlzZUluZGV4IH0gZnJvbSAnLi4vaW5kZXhpbmcvaW5pdGlhbGlzZUluZGV4JztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3Qgc2F2ZSA9IGFwcCA9PiBhc3luYyAocmVjb3JkLCBjb250ZXh0KSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5yZWNvcmRBcGkuc2F2ZSxcbiAgcmVjb3JkLmlzTmV3XG4gICAgPyBwZXJtaXNzaW9uLmNyZWF0ZVJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkLmtleSlcbiAgICA6IHBlcm1pc3Npb24udXBkYXRlUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmQua2V5KSwgeyByZWNvcmQgfSxcbiAgX3NhdmUsIGFwcCwgcmVjb3JkLCBjb250ZXh0LCBmYWxzZSxcbik7XG5cblxuZXhwb3J0IGNvbnN0IF9zYXZlID0gYXN5bmMgKGFwcCwgcmVjb3JkLCBjb250ZXh0LCBza2lwVmFsaWRhdGlvbiA9IGZhbHNlKSA9PiB7XG4gIGNvbnN0IHJlY29yZENsb25lID0gY2xvbmVEZWVwKHJlY29yZCk7XG4gIGlmICghc2tpcFZhbGlkYXRpb24pIHtcbiAgICBjb25zdCB2YWxpZGF0aW9uUmVzdWx0ID0gYXdhaXQgdmFsaWRhdGUoYXBwKShyZWNvcmRDbG9uZSwgY29udGV4dCk7XG4gICAgaWYgKCF2YWxpZGF0aW9uUmVzdWx0LmlzVmFsaWQpIHtcbiAgICAgIGF3YWl0IGFwcC5wdWJsaXNoKGV2ZW50cy5yZWNvcmRBcGkuc2F2ZS5vbkludmFsaWQsIHsgcmVjb3JkLCB2YWxpZGF0aW9uUmVzdWx0IH0pO1xuICAgICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgU2F2ZSA6IFJlY29yZCBJbnZhbGlkIDogJHtcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkodmFsaWRhdGlvblJlc3VsdC5lcnJvcnMpfWApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChyZWNvcmRDbG9uZS5pc05ldykge1xuICAgIGF3YWl0IGFkZFRvQWxsSWRzKGFwcC5oaWVyYXJjaHksIGFwcC5kYXRhc3RvcmUpKHJlY29yZENsb25lKTtcbiAgICBjb25zdCB0cmFuc2FjdGlvbiA9IGF3YWl0IHRyYW5zYWN0aW9uRm9yQ3JlYXRlUmVjb3JkKFxuICAgICAgYXBwLCByZWNvcmRDbG9uZSxcbiAgICApO1xuICAgIHJlY29yZENsb25lLnRyYW5zYWN0aW9uSWQgPSB0cmFuc2FjdGlvbi5pZDtcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihyZWNvcmRDbG9uZS5rZXkpO1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlRm9sZGVyKFxuICAgICAgam9pbktleShyZWNvcmRDbG9uZS5rZXksICdmaWxlcycpLFxuICAgICk7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVKc29uKFxuICAgICAgZ2V0UmVjb3JkRmlsZU5hbWUocmVjb3JkQ2xvbmUua2V5KSxcbiAgICAgIHJlY29yZENsb25lLFxuICAgICk7XG4gICAgYXdhaXQgaW5pdGlhbGlzZVJldmVyc2VSZWZlcmVuY2VJbmRleGVzKGFwcCwgcmVjb3JkKTtcbiAgICBhd2FpdCBpbml0aWFsaXNlQW5jZXN0b3JJbmRleGVzKGFwcCwgcmVjb3JkKTtcbiAgICBhd2FpdCBpbml0aWFsaXNlQ2hpbGRDb2xsZWN0aW9ucyhhcHAsIHJlY29yZENsb25lLmtleSk7XG4gICAgYXdhaXQgYXBwLnB1Ymxpc2goZXZlbnRzLnJlY29yZEFwaS5zYXZlLm9uUmVjb3JkQ3JlYXRlZCwge1xuICAgICAgcmVjb3JkOiByZWNvcmRDbG9uZSxcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBvbGRSZWNvcmQgPSBhd2FpdCBfbG9hZChhcHAsIHJlY29yZENsb25lLmtleSk7XG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSBhd2FpdCB0cmFuc2FjdGlvbkZvclVwZGF0ZVJlY29yZChcbiAgICAgIGFwcCwgb2xkUmVjb3JkLCByZWNvcmRDbG9uZSxcbiAgICApO1xuICAgIHJlY29yZENsb25lLnRyYW5zYWN0aW9uSWQgPSB0cmFuc2FjdGlvbi5pZDtcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgICBnZXRSZWNvcmRGaWxlTmFtZShyZWNvcmRDbG9uZS5rZXkpLFxuICAgICAgcmVjb3JkQ2xvbmUsXG4gICAgKTtcbiAgICBhd2FpdCBhcHAucHVibGlzaChldmVudHMucmVjb3JkQXBpLnNhdmUub25SZWNvcmRVcGRhdGVkLCB7XG4gICAgICBvbGQ6IG9sZFJlY29yZCxcbiAgICAgIG5ldzogcmVjb3JkQ2xvbmUsXG4gICAgfSk7XG4gIH1cblxuICBhd2FpdCBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucygpO1xuXG4gIGNvbnN0IHJldHVybmVkQ2xvbmUgPSBjbG9uZURlZXAocmVjb3JkQ2xvbmUpO1xuICByZXR1cm5lZENsb25lLmlzTmV3ID0gZmFsc2U7XG4gIHJldHVybiByZXR1cm5lZENsb25lO1xufTtcblxuY29uc3QgaW5pdGlhbGlzZUFuY2VzdG9ySW5kZXhlcyA9IGFzeW5jIChhcHAsIHJlY29yZCkgPT4ge1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShyZWNvcmQua2V5KTtcblxuICBmb3IgKGNvbnN0IGluZGV4IG9mIHJlY29yZE5vZGUuaW5kZXhlcykge1xuICAgIGNvbnN0IGluZGV4S2V5ID0gam9pbktleShyZWNvcmQua2V5LCBpbmRleC5uYW1lKTtcbiAgICBpZiAoIWF3YWl0IGFwcC5kYXRhc3RvcmUuZXhpc3RzKGluZGV4S2V5KSkgeyBhd2FpdCBpbml0aWFsaXNlSW5kZXgoYXBwLmRhdGFzdG9yZSwgcmVjb3JkLmtleSwgaW5kZXgpOyB9XG4gIH1cbn07XG5cbmNvbnN0IGluaXRpYWxpc2VSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyA9IGFzeW5jIChhcHAsIHJlY29yZCkgPT4ge1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShyZWNvcmQua2V5KTtcblxuICBjb25zdCBpbmRleE5vZGVzID0gJChmaWVsZHNUaGF0UmVmZXJlbmNlVGhpc1JlY29yZChhcHAsIHJlY29yZE5vZGUpLCBbXG4gICAgbWFwKGYgPT4gJChmLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzLCBbXG4gICAgICBtYXAobiA9PiBnZXROb2RlKFxuICAgICAgICBhcHAuaGllcmFyY2h5LFxuICAgICAgICBuLFxuICAgICAgKSksXG4gICAgXSkpLFxuICAgIGZsYXR0ZW4sXG4gIF0pO1xuXG4gIGZvciAoY29uc3QgaW5kZXhOb2RlIG9mIGluZGV4Tm9kZXMpIHtcbiAgICBhd2FpdCBpbml0aWFsaXNlSW5kZXgoXG4gICAgICBhcHAuZGF0YXN0b3JlLCByZWNvcmQua2V5LCBpbmRleE5vZGUsXG4gICAgKTtcbiAgfVxufTtcblxuY29uc3QgZmllbGRzVGhhdFJlZmVyZW5jZVRoaXNSZWNvcmQgPSAoYXBwLCByZWNvcmROb2RlKSA9PiAkKGFwcC5oaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaWx0ZXIoaXNSZWNvcmQpLFxuICBtYXAobiA9PiBuLmZpZWxkcyksXG4gIGZsYXR0ZW4sXG4gIGZpbHRlcihmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlKHJlY29yZE5vZGUpKSxcbl0pO1xuIiwiaW1wb3J0IHsgaW5jbHVkZXMgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7XG4gIHNhZmVLZXksIGFwaVdyYXBwZXIsXG4gIGV2ZW50cywgam9pbktleSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IF9kZWxldGVSZWNvcmQgfSBmcm9tICcuLi9yZWNvcmRBcGkvZGVsZXRlJztcbmltcG9ydCB7IGdldEFsbElkc0l0ZXJhdG9yLCBnZXRBbGxJZHNTaGFyZEtleSB9IGZyb20gJy4uL2luZGV4aW5nL2FsbElkcyc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBkZWxldGVDb2xsZWN0aW9uID0gKGFwcCwgZGlzYWJsZUNsZWFudXAgPSBmYWxzZSkgPT4gYXN5bmMga2V5ID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmNvbGxlY3Rpb25BcGkuZGVsZXRlLFxuICBwZXJtaXNzaW9uLm1hbmFnZUNvbGxlY3Rpb24uaXNBdXRob3JpemVkLFxuICB7IGtleSB9LFxuICBfZGVsZXRlQ29sbGVjdGlvbiwgYXBwLCBrZXksIGRpc2FibGVDbGVhbnVwLFxuKTtcblxuXG5leHBvcnQgY29uc3QgX2RlbGV0ZUNvbGxlY3Rpb24gPSBhc3luYyAoYXBwLCBrZXksIGRpc2FibGVDbGVhbnVwKSA9PiB7XG4gIGtleSA9IHNhZmVLZXkoa2V5KTtcbiAgY29uc3Qgbm9kZSA9IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHAuaGllcmFyY2h5KShrZXkpO1xuXG4gIGF3YWl0IGRlbGV0ZVJlY29yZHMoYXBwLCBrZXkpO1xuICBhd2FpdCBkZWxldGVBbGxJZHNGb2xkZXJzKGFwcCwgbm9kZSwga2V5KTtcbiAgYXdhaXQgZGVsZXRlQ29sbGVjdGlvbkZvbGRlcihhcHAsIGtleSk7XG4gIGlmICghZGlzYWJsZUNsZWFudXApIHsgYXdhaXQgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMoKTsgfVxufTtcblxuY29uc3QgZGVsZXRlQ29sbGVjdGlvbkZvbGRlciA9IGFzeW5jIChhcHAsIGtleSkgPT4gYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoa2V5KTtcblxuXG5jb25zdCBkZWxldGVBbGxJZHNGb2xkZXJzID0gYXN5bmMgKGFwcCwgbm9kZSwga2V5KSA9PiB7XG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKFxuICAgIGpvaW5LZXkoXG4gICAgICBrZXksICdhbGxpZHMnLFxuICAgICAgbm9kZS5ub2RlSWQsXG4gICAgKSxcbiAgKTtcblxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihcbiAgICBqb2luS2V5KGtleSwgJ2FsbGlkcycpLFxuICApO1xufTtcblxuY29uc3QgZGVsZXRlUmVjb3JkcyA9IGFzeW5jIChhcHAsIGtleSkgPT4ge1xuICBjb25zdCBkZWxldGVkQWxsSWRzU2hhcmRzID0gW107XG4gIGNvbnN0IGRlbGV0ZUFsbElkc1NoYXJkID0gYXN5bmMgKHJlY29yZElkKSA9PiB7XG4gICAgY29uc3Qgc2hhcmRLZXkgPSBnZXRBbGxJZHNTaGFyZEtleShcbiAgICAgIGFwcC5oaWVyYXJjaHksIGtleSwgcmVjb3JkSWQsXG4gICAgKTtcblxuICAgIGlmIChpbmNsdWRlcyhzaGFyZEtleSkoZGVsZXRlZEFsbElkc1NoYXJkcykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkZWxldGVkQWxsSWRzU2hhcmRzLnB1c2goc2hhcmRLZXkpO1xuXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKHNoYXJkS2V5KTtcbiAgfTtcblxuICBjb25zdCBpdGVyYXRlID0gYXdhaXQgZ2V0QWxsSWRzSXRlcmF0b3IoYXBwKShrZXkpO1xuXG4gIGxldCBpZHMgPSBhd2FpdCBpdGVyYXRlKCk7XG4gIHdoaWxlICghaWRzLmRvbmUpIHtcbiAgICBpZiAoaWRzLnJlc3VsdC5jb2xsZWN0aW9uS2V5ID09PSBrZXkpIHtcbiAgICAgIGZvciAoY29uc3QgaWQgb2YgaWRzLnJlc3VsdC5pZHMpIHtcbiAgICAgICAgYXdhaXQgX2RlbGV0ZVJlY29yZChcbiAgICAgICAgICBhcHAsXG4gICAgICAgICAgam9pbktleShrZXksIGlkKSxcbiAgICAgICAgICB0cnVlLFxuICAgICAgICApO1xuICAgICAgICBhd2FpdCBkZWxldGVBbGxJZHNTaGFyZChpZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWRzID0gYXdhaXQgaXRlcmF0ZSgpO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgdHJ5QXdhaXRPcklnbm9yZSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIGlzSW5kZXgsIGlzU2hhcmRlZEluZGV4LFxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHtcbiAgZ2V0QWxsU2hhcmRLZXlzLCBnZXRTaGFyZE1hcEtleSxcbiAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5LFxufSBmcm9tICcuLi9pbmRleGluZy9zaGFyZGluZyc7XG5cbmV4cG9ydCBjb25zdCBfZGVsZXRlSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleEtleSwgaW5jbHVkZUZvbGRlcikgPT4ge1xuICBjb25zdCBpbmRleE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKGluZGV4S2V5KTtcblxuICBpZiAoIWlzSW5kZXgoaW5kZXhOb2RlKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ1N1cHBsaWVkIGtleSBpcyBub3QgYW4gaW5kZXgnKTsgfVxuXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleE5vZGUpKSB7XG4gICAgY29uc3Qgc2hhcmRLZXlzID0gYXdhaXQgZ2V0QWxsU2hhcmRLZXlzKGFwcCwgaW5kZXhLZXkpO1xuICAgIGZvciAoY29uc3QgayBvZiBzaGFyZEtleXMpIHtcbiAgICAgIGF3YWl0IHRyeUF3YWl0T3JJZ25vcmUoXG4gICAgICAgIGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShrKSxcbiAgICAgICk7XG4gICAgfVxuICAgIHRyeUF3YWl0T3JJZ25vcmUoXG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoXG4gICAgICAgIGdldFNoYXJkTWFwS2V5KGluZGV4S2V5KSxcbiAgICAgICksXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCB0cnlBd2FpdE9ySWdub3JlKFxuICAgICAgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKFxuICAgICAgICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXkoaW5kZXhLZXkpLFxuICAgICAgKSxcbiAgICApO1xuICB9XG5cbiAgaWYgKGluY2x1ZGVGb2xkZXIpIHtcbiAgICB0cnlBd2FpdE9ySWdub3JlKFxuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoaW5kZXhLZXkpLFxuICAgICk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBzYWZlS2V5LCBhcGlXcmFwcGVyLFxuICBldmVudHMsIGpvaW5LZXksXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBfbG9hZCwgZ2V0UmVjb3JkRmlsZU5hbWUgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IHsgX2RlbGV0ZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9jb2xsZWN0aW9uQXBpL2RlbGV0ZSc7XG5pbXBvcnQge1xuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksIGdldE5vZGUsXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBfZGVsZXRlSW5kZXggfSBmcm9tICcuLi9pbmRleEFwaS9kZWxldGUnO1xuaW1wb3J0IHsgdHJhbnNhY3Rpb25Gb3JEZWxldGVSZWNvcmQgfSBmcm9tICcuLi90cmFuc2FjdGlvbnMvY3JlYXRlJztcbmltcG9ydCB7IHJlbW92ZUZyb21BbGxJZHMgfSBmcm9tICcuLi9pbmRleGluZy9hbGxJZHMnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZGVsZXRlUmVjb3JkID0gKGFwcCwgZGlzYWJsZUNsZWFudXAgPSBmYWxzZSkgPT4gYXN5bmMga2V5ID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLnJlY29yZEFwaS5kZWxldGUsXG4gIHBlcm1pc3Npb24uZGVsZXRlUmVjb3JkLmlzQXV0aG9yaXplZChrZXkpLFxuICB7IGtleSB9LFxuICBfZGVsZXRlUmVjb3JkLCBhcHAsIGtleSwgZGlzYWJsZUNsZWFudXAsXG4pO1xuXG4vLyBjYWxsZWQgZGVsZXRlUmVjb3JkIGJlY2F1c2UgZGVsZXRlIGlzIGEga2V5d29yZFxuZXhwb3J0IGNvbnN0IF9kZWxldGVSZWNvcmQgPSBhc3luYyAoYXBwLCBrZXksIGRpc2FibGVDbGVhbnVwKSA9PiB7XG4gIGtleSA9IHNhZmVLZXkoa2V5KTtcbiAgY29uc3Qgbm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoa2V5KTtcblxuICBjb25zdCByZWNvcmQgPSBhd2FpdCBfbG9hZChhcHAsIGtleSk7XG4gIGF3YWl0IHRyYW5zYWN0aW9uRm9yRGVsZXRlUmVjb3JkKGFwcCwgcmVjb3JkKTtcblxuICBmb3IgKGNvbnN0IGNvbGxlY3Rpb25SZWNvcmQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgIGNvbnN0IGNvbGxlY3Rpb25LZXkgPSBqb2luS2V5KFxuICAgICAga2V5LCBjb2xsZWN0aW9uUmVjb3JkLmNvbGxlY3Rpb25OYW1lLFxuICAgICk7XG4gICAgYXdhaXQgX2RlbGV0ZUNvbGxlY3Rpb24oYXBwLCBjb2xsZWN0aW9uS2V5LCB0cnVlKTtcbiAgfVxuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShcbiAgICBnZXRSZWNvcmRGaWxlTmFtZShrZXkpLFxuICApO1xuXG4gIGF3YWl0IGRlbGV0ZUZpbGVzKGFwcCwga2V5KTtcblxuICBhd2FpdCByZW1vdmVGcm9tQWxsSWRzKGFwcC5oaWVyYXJjaHksIGFwcC5kYXRhc3RvcmUpKHJlY29yZCk7XG5cbiAgaWYgKCFkaXNhYmxlQ2xlYW51cCkgeyBhd2FpdCBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucygpOyB9XG5cbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoa2V5KTtcbiAgYXdhaXQgZGVsZXRlSW5kZXhlcyhhcHAsIGtleSk7XG59O1xuXG5jb25zdCBkZWxldGVJbmRleGVzID0gYXN5bmMgKGFwcCwga2V5KSA9PiB7XG4gIGNvbnN0IG5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKGtleSk7XG4gIC8qIGNvbnN0IHJldmVyc2VJbmRleEtleXMgPSAkKGFwcC5oaWVyYXJjaHksIFtcbiAgICAgICAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICAgICAgICBtYXAobiA9PiBuLmZpZWxkcyksXG4gICAgICAgIGZsYXR0ZW4sXG4gICAgICAgIGZpbHRlcihpc1NvbWV0aGluZyksXG4gICAgICAgIGZpbHRlcihmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlKG5vZGUpKSxcbiAgICAgICAgbWFwKGYgPT4gJChmLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzLCBbXG4gICAgICAgICAgICAgICAgICAgIG1hcChuID0+IGdldE5vZGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5oaWVyYXJjaHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG4pKVxuICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICksXG4gICAgICAgIGZsYXR0ZW4sXG4gICAgICAgIG1hcChuID0+IGpvaW5LZXkoa2V5LCBuLm5hbWUpKVxuICAgIF0pO1xuXG4gICAgZm9yKGxldCBpIG9mIHJldmVyc2VJbmRleEtleXMpIHtcbiAgICAgICAgYXdhaXQgX2RlbGV0ZUluZGV4KGFwcCwgaSwgdHJ1ZSk7XG4gICAgfSAqL1xuXG5cbiAgZm9yIChjb25zdCBpbmRleCBvZiBub2RlLmluZGV4ZXMpIHtcbiAgICBjb25zdCBpbmRleEtleSA9IGpvaW5LZXkoa2V5LCBpbmRleC5uYW1lKTtcbiAgICBhd2FpdCBfZGVsZXRlSW5kZXgoYXBwLCBpbmRleEtleSwgdHJ1ZSk7XG4gIH1cbn07XG5cbmNvbnN0IGRlbGV0ZUZpbGVzID0gYXN5bmMgKGFwcCwga2V5KSA9PiB7XG4gIGNvbnN0IGZpbGVzRm9sZGVyID0gam9pbktleShrZXksICdmaWxlcycpO1xuICBjb25zdCBhbGxGaWxlcyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0Rm9sZGVyQ29udGVudHMoXG4gICAgZmlsZXNGb2xkZXIsXG4gICk7XG5cbiAgZm9yIChjb25zdCBmaWxlIG9mIGFsbEZpbGVzKSB7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKGZpbGUpO1xuICB9XG5cbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoXG4gICAgam9pbktleShrZXksICdmaWxlcycpLFxuICApO1xufTtcbiIsImltcG9ydCB7XG4gIGluY2x1ZGVzLCBmaWx0ZXIsXG4gIG1hcCwgc29tZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnc2hvcnRpZCc7XG5pbXBvcnQgeyBfbG9hZCB9IGZyb20gJy4vbG9hZCc7XG5pbXBvcnQge1xuICBhcGlXcmFwcGVyLCBldmVudHMsIHNwbGl0S2V5LFxuICAkLCBqb2luS2V5LCBpc05vdGhpbmcsIHRyeUF3YWl0T3JJZ25vcmUsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXRFeGFjdE5vZGVGb3JQYXRoIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IGlzTGVnYWxGaWxlbmFtZSB9IGZyb20gJy4uL3R5cGVzL2ZpbGUnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yLCBGb3JiaWRkZW5FcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgdXBsb2FkRmlsZSA9IGFwcCA9PiBhc3luYyAocmVjb3JkS2V5LCByZWFkYWJsZVN0cmVhbSwgcmVsYXRpdmVGaWxlUGF0aCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMucmVjb3JkQXBpLnVwbG9hZEZpbGUsXG4gIHBlcm1pc3Npb24udXBkYXRlUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmRLZXkpLFxuICB7IHJlY29yZEtleSwgcmVhZGFibGVTdHJlYW0sIHJlbGF0aXZlRmlsZVBhdGggfSxcbiAgX3VwbG9hZEZpbGUsIGFwcCwgcmVjb3JkS2V5LCByZWFkYWJsZVN0cmVhbSwgcmVsYXRpdmVGaWxlUGF0aCxcbik7XG5cbmNvbnN0IF91cGxvYWRGaWxlID0gYXN5bmMgKGFwcCwgcmVjb3JkS2V5LCByZWFkYWJsZVN0cmVhbSwgcmVsYXRpdmVGaWxlUGF0aCkgPT4ge1xuICBpZiAoaXNOb3RoaW5nKHJlY29yZEtleSkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignUmVjb3JkIEtleSBub3Qgc3VwcGxpZWQnKTsgfVxuICBpZiAoaXNOb3RoaW5nKHJlbGF0aXZlRmlsZVBhdGgpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ2ZpbGUgcGF0aCBub3Qgc3VwcGxpZWQnKTsgfVxuICBpZiAoIWlzTGVnYWxGaWxlbmFtZShyZWxhdGl2ZUZpbGVQYXRoKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdJbGxlZ2FsIGZpbGVuYW1lJyk7IH1cblxuICBjb25zdCByZWNvcmQgPSBhd2FpdCBfbG9hZChhcHAsIHJlY29yZEtleSk7XG5cbiAgY29uc3QgZnVsbEZpbGVQYXRoID0gc2FmZUdldEZ1bGxGaWxlUGF0aChcbiAgICByZWNvcmRLZXksIHJlbGF0aXZlRmlsZVBhdGgsXG4gICk7XG5cbiAgY29uc3QgdGVtcEZpbGVQYXRoID0gYCR7ZnVsbEZpbGVQYXRofV8ke2dlbmVyYXRlKCl9LnRlbXBgO1xuXG4gIGNvbnN0IG91dHB1dFN0cmVhbSA9IGF3YWl0IGFwcC5kYXRhc3RvcmUud3JpdGFibGVGaWxlU3RyZWFtKFxuICAgIHRlbXBGaWxlUGF0aCxcbiAgKTtcblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUscmVqZWN0KSA9PiB7XG4gICAgcmVhZGFibGVTdHJlYW0ucGlwZShvdXRwdXRTdHJlYW0pO1xuICAgIG91dHB1dFN0cmVhbS5vbignZXJyb3InLCByZWplY3QpO1xuICAgIG91dHB1dFN0cmVhbS5vbignZmluaXNoJywgcmVzb2x2ZSk7XG4gIH0pXG4gIC50aGVuKCgpID0+IGFwcC5kYXRhc3RvcmUuZ2V0RmlsZVNpemUodGVtcEZpbGVQYXRoKSlcbiAgLnRoZW4oc2l6ZSA9PiB7XG4gICAgY29uc3QgaXNFeHBlY3RlZEZpbGVTaXplID0gY2hlY2tGaWxlU2l6ZUFnYWluc3RGaWVsZHMoXG4gICAgICBhcHAsIHJlY29yZCwgcmVsYXRpdmVGaWxlUGF0aCwgc2l6ZVxuICAgICk7ICBcbiAgICBpZiAoIWlzRXhwZWN0ZWRGaWxlU2l6ZSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBGaWVsZHMgZm9yICR7cmVsYXRpdmVGaWxlUGF0aH0gZG8gbm90IGhhdmUgZXhwZWN0ZWQgc2l6ZTogJHtqb2luKCcsJykoaW5jb3JyZWN0RmllbGRzKX1gKTsgfSAgXG5cbiAgfSlcbiAgLnRoZW4oKCkgPT4gdHJ5QXdhaXRPcklnbm9yZShhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUsIGZ1bGxGaWxlUGF0aCkpXG4gIC50aGVuKCgpID0+IGFwcC5kYXRhc3RvcmUucmVuYW1lRmlsZSh0ZW1wRmlsZVBhdGgsIGZ1bGxGaWxlUGF0aCkpO1xuXG4gIC8qXG4gIHJlYWRhYmxlU3RyZWFtLnBpcGUob3V0cHV0U3RyZWFtKTtcblxuICBhd2FpdCBuZXcgUHJvbWlzZShmdWxmaWxsID0+IG91dHB1dFN0cmVhbS5vbignZmluaXNoJywgZnVsZmlsbCkpO1xuXG4gIGNvbnN0IGlzRXhwZWN0ZWRGaWxlU2l6ZSA9IGNoZWNrRmlsZVNpemVBZ2FpbnN0RmllbGRzKFxuICAgIGFwcCxcbiAgICByZWNvcmQsIHJlbGF0aXZlRmlsZVBhdGgsXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5nZXRGaWxlU2l6ZSh0ZW1wRmlsZVBhdGgpLFxuICApO1xuXG4gIGlmICghaXNFeHBlY3RlZEZpbGVTaXplKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEZpZWxkcyBmb3IgJHtyZWxhdGl2ZUZpbGVQYXRofSBkbyBub3QgaGF2ZSBleHBlY3RlZCBzaXplYCk7XG4gIH1cblxuICBhd2FpdCB0cnlBd2FpdE9ySWdub3JlKGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZSwgZnVsbEZpbGVQYXRoKTtcblxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLnJlbmFtZUZpbGUodGVtcEZpbGVQYXRoLCBmdWxsRmlsZVBhdGgpO1xuICAqL1xufTtcblxuY29uc3QgY2hlY2tGaWxlU2l6ZUFnYWluc3RGaWVsZHMgPSAoYXBwLCByZWNvcmQsIHJlbGF0aXZlRmlsZVBhdGgsIGV4cGVjdGVkU2l6ZSkgPT4ge1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShyZWNvcmQua2V5KTtcblxuICBjb25zdCBpbmNvcnJlY3RGaWxlRmllbGRzID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICAgIGZpbHRlcihmID0+IGYudHlwZSA9PT0gJ2ZpbGUnXG4gICAgICAmJiByZWNvcmRbZi5uYW1lXS5yZWxhdGl2ZVBhdGggPT09IHJlbGF0aXZlRmlsZVBhdGhcbiAgICAgICYmIHJlY29yZFtmLm5hbWVdLnNpemUgIT09IGV4cGVjdGVkU2l6ZSksXG4gICAgbWFwKGYgPT4gZi5uYW1lKSxcbiAgXSk7XG5cbiAgY29uc3QgaW5jb3JyZWN0RmlsZUFycmF5RmllbGRzID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICAgIGZpbHRlcihhID0+IGEudHlwZSA9PT0gJ2FycmF5PGZpbGU+J1xuICAgICAgJiYgJChyZWNvcmRbYS5uYW1lXSwgW1xuICAgICAgICBzb21lKGYgPT4gcmVjb3JkW2YubmFtZV0ucmVsYXRpdmVQYXRoID09PSByZWxhdGl2ZUZpbGVQYXRoXG4gICAgICAgICAgJiYgcmVjb3JkW2YubmFtZV0uc2l6ZSAhPT0gZXhwZWN0ZWRTaXplKSxcbiAgICAgIF0pKSxcbiAgICBtYXAoZiA9PiBmLm5hbWUpLFxuICBdKTtcblxuICBjb25zdCBpbmNvcnJlY3RGaWVsZHMgPSBbXG4gICAgLi4uaW5jb3JyZWN0RmlsZUZpZWxkcyxcbiAgICAuLi5pbmNvcnJlY3RGaWxlQXJyYXlGaWVsZHMsXG4gIF07XG5cbiAgaWYgKGluY29ycmVjdEZpZWxkcy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5leHBvcnQgY29uc3Qgc2FmZUdldEZ1bGxGaWxlUGF0aCA9IChyZWNvcmRLZXksIHJlbGF0aXZlRmlsZVBhdGgpID0+IHtcbiAgY29uc3QgbmF1Z2h0eVVzZXIgPSAoKSA9PiB7IHRocm93IG5ldyBGb3JiaWRkZW5FcnJvcignbmF1Z2h0eSBuYXVnaHR5Jyk7IH07XG5cbiAgaWYgKHJlbGF0aXZlRmlsZVBhdGguc3RhcnRzV2l0aCgnLi4nKSkgbmF1Z2h0eVVzZXIoKTtcblxuICBjb25zdCBwYXRoUGFydHMgPSBzcGxpdEtleShyZWxhdGl2ZUZpbGVQYXRoKTtcblxuICBpZiAoaW5jbHVkZXMoJy4uJykocGF0aFBhcnRzKSkgbmF1Z2h0eVVzZXIoKTtcblxuICBjb25zdCByZWNvcmRLZXlQYXJ0cyA9IHNwbGl0S2V5KHJlY29yZEtleSk7XG5cbiAgY29uc3QgZnVsbFBhdGhQYXJ0cyA9IFtcbiAgICAuLi5yZWNvcmRLZXlQYXJ0cyxcbiAgICAnZmlsZXMnLFxuICAgIC4uLmZpbHRlcihwID0+IHAgIT09ICcuJykocGF0aFBhcnRzKSxcbiAgXTtcblxuICByZXR1cm4gam9pbktleShmdWxsUGF0aFBhcnRzKTtcbn07XG4iLCJpbXBvcnQgeyBhcGlXcmFwcGVyLCBldmVudHMsIGlzTm90aGluZyB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBzYWZlR2V0RnVsbEZpbGVQYXRoIH0gZnJvbSAnLi91cGxvYWRGaWxlJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgZG93bmxvYWRGaWxlID0gYXBwID0+IGFzeW5jIChyZWNvcmRLZXksIHJlbGF0aXZlUGF0aCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMucmVjb3JkQXBpLnVwbG9hZEZpbGUsXG4gIHBlcm1pc3Npb24ucmVhZFJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkS2V5KSxcbiAgeyByZWNvcmRLZXksIHJlbGF0aXZlUGF0aCB9LC8vcmVtb3ZlIGR1cGUga2V5ICdyZWNvcmRLZXknIGZyb20gb2JqZWN0XG4gIF9kb3dubG9hZEZpbGUsIGFwcCwgcmVjb3JkS2V5LCByZWxhdGl2ZVBhdGgsXG4pOyBcblxuXG5jb25zdCBfZG93bmxvYWRGaWxlID0gYXN5bmMgKGFwcCwgcmVjb3JkS2V5LCByZWxhdGl2ZVBhdGgpID0+IHtcbiAgaWYgKGlzTm90aGluZyhyZWNvcmRLZXkpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ1JlY29yZCBLZXkgbm90IHN1cHBsaWVkJyk7IH1cbiAgaWYgKGlzTm90aGluZyhyZWxhdGl2ZVBhdGgpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ2ZpbGUgcGF0aCBub3Qgc3VwcGxpZWQnKTsgfVxuXG4gIHJldHVybiBhd2FpdCBhcHAuZGF0YXN0b3JlLnJlYWRhYmxlRmlsZVN0cmVhbShcbiAgICBzYWZlR2V0RnVsbEZpbGVQYXRoKFxuICAgICAgcmVjb3JkS2V5LCByZWxhdGl2ZVBhdGgsXG4gICAgKSxcbiAgKTtcbn07XG4iLCJpbXBvcnQgeyBmaW5kLCB0YWtlLCB1bmlvbiB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZXRGbGF0dGVuZWRIaWVyYXJjaHkgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgJCwgc3BsaXRLZXksIGpvaW5LZXkgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgTm90Rm91bmRFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgY3VzdG9tSWQgPSBhcHAgPT4gKG5vZGVOYW1lLCBpZCkgPT4ge1xuICBjb25zdCBub2RlID0gJChhcHAuaGllcmFyY2h5LCBbXG4gICAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICAgIGZpbmQobiA9PiBuLm5hbWUgPT09IG5vZGVOYW1lKSxcbiAgXSk7XG5cbiAgaWYgKCFub2RlKSB0aHJvdyBuZXcgTm90Rm91bmRFcnJvcihgQ2Fubm90IGZpbmQgbm9kZSAke25vZGVOYW1lfWApO1xuXG4gIHJldHVybiBgJHtub2RlLm5vZGVJZH0tJHtpZH1gO1xufTtcblxuZXhwb3J0IGNvbnN0IHNldEN1c3RvbUlkID0gYXBwID0+IChyZWNvcmQsIGlkKSA9PiB7XG4gIHJlY29yZC5pZCA9IGN1c3RvbUlkKGFwcCkocmVjb3JkLnR5cGUsIGlkKTtcblxuICBjb25zdCBrZXlQYXJ0cyA9IHNwbGl0S2V5KHJlY29yZC5rZXkpO1xuXG4gIHJlY29yZC5rZXkgPSAkKGtleVBhcnRzLCBbXG4gICAgdGFrZShrZXlQYXJ0cy5sZW5ndGggLSAxKSxcbiAgICB1bmlvbihbcmVjb3JkLmlkXSksXG4gICAgam9pbktleSxcbiAgXSk7XG5cbiAgcmV0dXJuIHJlY29yZDtcbn07XG4iLCJpbXBvcnQgeyBnZXROZXcsIGdldE5ld0NoaWxkIH0gZnJvbSAnLi9nZXROZXcnO1xuaW1wb3J0IHsgbG9hZCB9IGZyb20gJy4vbG9hZCc7XG5pbXBvcnQgeyB2YWxpZGF0ZSB9IGZyb20gJy4vdmFsaWRhdGUnO1xuaW1wb3J0IHsgZ2V0Q29udGV4dCB9IGZyb20gJy4vZ2V0Q29udGV4dCc7XG5pbXBvcnQgeyBzYXZlIH0gZnJvbSAnLi9zYXZlJztcbmltcG9ydCB7IGRlbGV0ZVJlY29yZCB9IGZyb20gJy4vZGVsZXRlJztcbmltcG9ydCB7IHVwbG9hZEZpbGUgfSBmcm9tICcuL3VwbG9hZEZpbGUnO1xuaW1wb3J0IHsgZG93bmxvYWRGaWxlIH0gZnJvbSAnLi9kb3dubG9hZEZpbGUnO1xuaW1wb3J0IHsgY3VzdG9tSWQsIHNldEN1c3RvbUlkIH0gZnJvbSAnLi9jdXN0b21JZCc7XG5cbmNvbnN0IGFwaSA9IGFwcCA9PiAoe1xuICBnZXROZXc6IGdldE5ldyhhcHApLFxuICBnZXROZXdDaGlsZDogZ2V0TmV3Q2hpbGQoYXBwKSxcbiAgc2F2ZTogc2F2ZShhcHApLFxuICBsb2FkOiBsb2FkKGFwcCksXG4gIGRlbGV0ZTogZGVsZXRlUmVjb3JkKGFwcCwgZmFsc2UpLFxuICB2YWxpZGF0ZTogdmFsaWRhdGUoYXBwKSxcbiAgZ2V0Q29udGV4dDogZ2V0Q29udGV4dChhcHApLFxuICB1cGxvYWRGaWxlOiB1cGxvYWRGaWxlKGFwcCksXG4gIGRvd25sb2FkRmlsZTogZG93bmxvYWRGaWxlKGFwcCksXG4gIGN1c3RvbUlkOiBjdXN0b21JZChhcHApLFxuICBzZXRDdXN0b21JZDogc2V0Q3VzdG9tSWQoYXBwKSxcbn0pO1xuXG5cbmV4cG9ydCBjb25zdCBnZXRSZWNvcmRBcGkgPSBhcHAgPT4gYXBpKGFwcCk7XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJlY29yZEFwaTtcbiIsImltcG9ydCB7IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xuICBpc05vdGhpbmcsIHNhZmVLZXksIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBnZXRBbGxvd2VkUmVjb3JkVHlwZXMgPSBhcHAgPT4ga2V5ID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5jb2xsZWN0aW9uQXBpLmdldEFsbG93ZWRSZWNvcmRUeXBlcyxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyBrZXkgfSxcbiAgX2dldEFsbG93ZWRSZWNvcmRUeXBlcywgYXBwLCBrZXksXG4pO1xuXG5jb25zdCBfZ2V0QWxsb3dlZFJlY29yZFR5cGVzID0gKGFwcCwga2V5KSA9PiB7XG4gIGtleSA9IHNhZmVLZXkoa2V5KTtcbiAgY29uc3Qgbm9kZSA9IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHAuaGllcmFyY2h5KShrZXkpO1xuICByZXR1cm4gaXNOb3RoaW5nKG5vZGUpID8gW10gOiBbbm9kZS5uYW1lXTtcbn07XG4iLCJpbXBvcnQgeyBnZXRBbGxJZHNJdGVyYXRvciB9IGZyb20gJy4uL2luZGV4aW5nL2FsbElkcyc7XG5pbXBvcnQgeyBnZXRBbGxvd2VkUmVjb3JkVHlwZXMgfSBmcm9tICcuL2dldEFsbG93ZWRSZWNvcmRUeXBlcyc7XG5pbXBvcnQgeyBkZWxldGVDb2xsZWN0aW9uIH0gZnJvbSAnLi9kZWxldGUnO1xuXG5leHBvcnQgY29uc3QgZ2V0Q29sbGVjdGlvbkFwaSA9IGFwcCA9PiAoe1xuICBnZXRBbGxvd2VkUmVjb3JkVHlwZXM6IGdldEFsbG93ZWRSZWNvcmRUeXBlcyhhcHApLFxuICBnZXRBbGxJZHNJdGVyYXRvcjogZ2V0QWxsSWRzSXRlcmF0b3IoYXBwKSxcbiAgZGVsZXRlOiBkZWxldGVDb2xsZWN0aW9uKGFwcCksXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0Q29sbGVjdGlvbkFwaTtcbiIsImltcG9ydCB7XG4gIGZpbmQsIGZpbHRlciwgXG4gIGluY2x1ZGVzLCBzb21lLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2V0QWxsSWRzSXRlcmF0b3IgfSBmcm9tICcuLi9pbmRleGluZy9hbGxJZHMnO1xuaW1wb3J0IHtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LCBnZXRSZWNvcmROb2RlQnlJZCxcbiAgZ2V0Q29sbGVjdGlvbk5vZGVCeUtleU9yTm9kZUtleSwgZ2V0Tm9kZSwgaXNJbmRleCxcbiAgaXNSZWNvcmQsIGlzRGVjZW5kYW50LCBnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleCxcbiAgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xuICBqb2luS2V5LCBhcGlXcmFwcGVyLCBldmVudHMsICQsIGFsbFRydWUsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBjcmVhdGVCdWlsZEluZGV4Rm9sZGVyLFxuICB0cmFuc2FjdGlvbkZvckJ1aWxkSW5kZXgsXG59IGZyb20gJy4uL3RyYW5zYWN0aW9ucy9jcmVhdGUnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cblxuLyoqIHJlYnVpbGRzIGFuIGluZGV4XG4gKiBAcGFyYW0ge29iamVjdH0gYXBwIC0gdGhlIGFwcGxpY2F0aW9uIGNvbnRhaW5lclxuICogQHBhcmFtIHtzdHJpbmd9IGluZGV4Tm9kZUtleSAtIG5vZGUga2V5IG9mIHRoZSBpbmRleCwgd2hpY2ggdGhlIGluZGV4IGJlbG9uZ3MgdG9cbiAqL1xuZXhwb3J0IGNvbnN0IGJ1aWxkSW5kZXggPSBhcHAgPT4gYXN5bmMgaW5kZXhOb2RlS2V5ID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmluZGV4QXBpLmJ1aWxkSW5kZXgsXG4gIHBlcm1pc3Npb24ubWFuYWdlSW5kZXguaXNBdXRob3JpemVkLFxuICB7IGluZGV4Tm9kZUtleSB9LFxuICBfYnVpbGRJbmRleCwgYXBwLCBpbmRleE5vZGVLZXksXG4pO1xuXG5jb25zdCBfYnVpbGRJbmRleCA9IGFzeW5jIChhcHAsIGluZGV4Tm9kZUtleSkgPT4ge1xuICBjb25zdCBpbmRleE5vZGUgPSBnZXROb2RlKGFwcC5oaWVyYXJjaHksIGluZGV4Tm9kZUtleSk7XG5cbiAgYXdhaXQgY3JlYXRlQnVpbGRJbmRleEZvbGRlcihhcHAuZGF0YXN0b3JlLCBpbmRleE5vZGVLZXkpO1xuXG4gIGlmICghaXNJbmRleChpbmRleE5vZGUpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ0J1aWxkSW5kZXg6IG11c3Qgc3VwcGx5IGFuIGluZGV4bm9kZScpOyB9XG5cbiAgaWYgKGluZGV4Tm9kZS5pbmRleFR5cGUgPT09ICdyZWZlcmVuY2UnKSB7XG4gICAgYXdhaXQgYnVpbGRSZXZlcnNlUmVmZXJlbmNlSW5kZXgoXG4gICAgICBhcHAsIGluZGV4Tm9kZSxcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGF3YWl0IGJ1aWxkSGVpcmFyY2hhbEluZGV4KFxuICAgICAgYXBwLCBpbmRleE5vZGUsXG4gICAgKTtcbiAgfVxuXG4gIGF3YWl0IGFwcC5jbGVhbnVwVHJhbnNhY3Rpb25zKCk7XG59O1xuXG5jb25zdCBidWlsZFJldmVyc2VSZWZlcmVuY2VJbmRleCA9IGFzeW5jIChhcHAsIGluZGV4Tm9kZSkgPT4ge1xuICAvLyBJdGVyYXRlIHRocm91Z2ggYWxsIHJlZmVyZW5jSU5HIHJlY29yZHMsXG4gIC8vIGFuZCB1cGRhdGUgcmVmZXJlbmNlZCBpbmRleCBmb3IgZWFjaCByZWNvcmRcbiAgbGV0IHJlY29yZENvdW50ID0gMDtcbiAgY29uc3QgcmVmZXJlbmNpbmdOb2RlcyA9ICQoYXBwLmhpZXJhcmNoeSwgW1xuICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgICBmaWx0ZXIobiA9PiBpc1JlY29yZChuKVxuICAgICAgICAgICAgICAgICAgICAmJiBzb21lKGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4KGluZGV4Tm9kZSkpKG4uZmllbGRzKSksXG4gIF0pO1xuXG4gIGNvbnN0IGNyZWF0ZVRyYW5zYWN0aW9uc0ZvclJlZmVyZW5jaW5nTm9kZSA9IGFzeW5jIChyZWZlcmVuY2luZ05vZGUpID0+IHtcbiAgICBjb25zdCBpdGVyYXRlUmVmZXJlbmNpbmdOb2RlcyA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yKGFwcCkocmVmZXJlbmNpbmdOb2RlLmNvbGxlY3Rpb25Ob2RlS2V5KCkpO1xuXG4gICAgbGV0IHJlZmVyZW5jaW5nSWRJdGVyYXRvciA9IGF3YWl0IGl0ZXJhdGVSZWZlcmVuY2luZ05vZGVzKCk7XG4gICAgd2hpbGUgKCFyZWZlcmVuY2luZ0lkSXRlcmF0b3IuZG9uZSkge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlZmVyZW5jaW5nSWRJdGVyYXRvcjtcbiAgICAgIGZvciAoY29uc3QgaWQgb2YgcmVzdWx0Lmlkcykge1xuICAgICAgICBjb25zdCByZWNvcmRLZXkgPSBqb2luS2V5KHJlc3VsdC5jb2xsZWN0aW9uS2V5LCBpZCk7XG4gICAgICAgIGF3YWl0IHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleChhcHAsIGluZGV4Tm9kZS5ub2RlS2V5KCksIHJlY29yZEtleSwgcmVjb3JkQ291bnQpO1xuICAgICAgICByZWNvcmRDb3VudCsrO1xuICAgICAgfVxuICAgICAgcmVmZXJlbmNpbmdJZEl0ZXJhdG9yID0gYXdhaXQgaXRlcmF0ZVJlZmVyZW5jaW5nTm9kZXMoKTtcbiAgICB9XG4gIH07XG5cbiAgZm9yIChjb25zdCByZWZlcmVuY2luZ05vZGUgb2YgcmVmZXJlbmNpbmdOb2Rlcykge1xuICAgIGF3YWl0IGNyZWF0ZVRyYW5zYWN0aW9uc0ZvclJlZmVyZW5jaW5nTm9kZShyZWZlcmVuY2luZ05vZGUpO1xuICB9XG59O1xuXG5jb25zdCBnZXRBbGxvd2VkUGFyZW50Q29sbGVjdGlvbk5vZGVzID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlKSA9PiAkKGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4KGhpZXJhcmNoeSwgaW5kZXhOb2RlKSwgW1xuICBtYXAobiA9PiBuLnBhcmVudCgpKSxcbl0pO1xuXG5jb25zdCBidWlsZEhlaXJhcmNoYWxJbmRleCA9IGFzeW5jIChhcHAsIGluZGV4Tm9kZSkgPT4ge1xuICBsZXQgcmVjb3JkQ291bnQgPSAwO1xuXG4gIGNvbnN0IGNyZWF0ZVRyYW5zYWN0aW9uc0ZvcklkcyA9IGFzeW5jIChjb2xsZWN0aW9uS2V5LCBpZHMpID0+IHtcbiAgICBmb3IgKGNvbnN0IHJlY29yZElkIG9mIGlkcykge1xuICAgICAgY29uc3QgcmVjb3JkS2V5ID0gam9pbktleShjb2xsZWN0aW9uS2V5LCByZWNvcmRJZCk7XG5cbiAgICAgIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRSZWNvcmROb2RlQnlJZChcbiAgICAgICAgYXBwLmhpZXJhcmNoeSxcbiAgICAgICAgcmVjb3JkSWQsXG4gICAgICApO1xuXG4gICAgICBpZiAocmVjb3JkTm9kZUFwcGxpZXMoaW5kZXhOb2RlKShyZWNvcmROb2RlKSkge1xuICAgICAgICBhd2FpdCB0cmFuc2FjdGlvbkZvckJ1aWxkSW5kZXgoXG4gICAgICAgICAgYXBwLCBpbmRleE5vZGUubm9kZUtleSgpLFxuICAgICAgICAgIHJlY29yZEtleSwgcmVjb3JkQ291bnQsXG4gICAgICAgICk7XG4gICAgICAgIHJlY29yZENvdW50Kys7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG5cbiAgY29uc3QgY29sbGVjdGlvblJlY29yZHMgPSBnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleChhcHAuaGllcmFyY2h5LCBpbmRleE5vZGUpO1xuXG4gIGZvciAoY29uc3QgdGFyZ2V0Q29sbGVjdGlvblJlY29yZE5vZGUgb2YgY29sbGVjdGlvblJlY29yZHMpIHtcbiAgICBjb25zdCBhbGxJZHNJdGVyYXRvciA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yKGFwcCkodGFyZ2V0Q29sbGVjdGlvblJlY29yZE5vZGUuY29sbGVjdGlvbk5vZGVLZXkoKSk7XG5cbiAgICBsZXQgYWxsSWRzID0gYXdhaXQgYWxsSWRzSXRlcmF0b3IoKTtcbiAgICB3aGlsZSAoYWxsSWRzLmRvbmUgPT09IGZhbHNlKSB7XG4gICAgICBhd2FpdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JJZHMoXG4gICAgICAgIGFsbElkcy5yZXN1bHQuY29sbGVjdGlvbktleSxcbiAgICAgICAgYWxsSWRzLnJlc3VsdC5pZHMsXG4gICAgICApO1xuICAgICAgYWxsSWRzID0gYXdhaXQgYWxsSWRzSXRlcmF0b3IoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVjb3JkQ291bnQ7XG59O1xuXG5jb25zdCBjaG9vc2VDaGlsZFJlY29yZE5vZGVCeUtleSA9IChjb2xsZWN0aW9uTm9kZSwgcmVjb3JkSWQpID0+IGZpbmQoYyA9PiByZWNvcmRJZC5zdGFydHNXaXRoKGMubm9kZUlkKSkoY29sbGVjdGlvbk5vZGUuY2hpbGRyZW4pO1xuXG5jb25zdCByZWNvcmROb2RlQXBwbGllcyA9IGluZGV4Tm9kZSA9PiByZWNvcmROb2RlID0+IGluY2x1ZGVzKHJlY29yZE5vZGUubm9kZUlkKShpbmRleE5vZGUuYWxsb3dlZFJlY29yZE5vZGVJZHMpO1xuXG5jb25zdCBoYXNBcHBsaWNhYmxlRGVjZW5kYW50ID0gKGhpZXJhcmNoeSwgYW5jZXN0b3JOb2RlLCBpbmRleE5vZGUpID0+ICQoaGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmlsdGVyKFxuICAgIGFsbFRydWUoXG4gICAgICBpc1JlY29yZCxcbiAgICAgIGlzRGVjZW5kYW50KGFuY2VzdG9yTm9kZSksXG4gICAgICByZWNvcmROb2RlQXBwbGllcyhpbmRleE5vZGUpLFxuICAgICksXG4gICksXG5dKTtcblxuY29uc3QgYXBwbHlBbGxEZWNlbmRhbnRSZWNvcmRzID0gYXN5bmMgKGFwcCwgY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSxcbiAgaW5kZXhOb2RlLCBpbmRleEtleSwgY3VycmVudEluZGV4ZWREYXRhLFxuICBjdXJyZW50SW5kZXhlZERhdGFLZXksIHJlY29yZENvdW50ID0gMCkgPT4ge1xuICBjb25zdCBjb2xsZWN0aW9uTm9kZSA9IGdldENvbGxlY3Rpb25Ob2RlQnlLZXlPck5vZGVLZXkoXG4gICAgYXBwLmhpZXJhcmNoeSxcbiAgICBjb2xsZWN0aW9uX0tleV9vcl9Ob2RlS2V5LFxuICApO1xuXG4gIGNvbnN0IGFsbElkc0l0ZXJhdG9yID0gYXdhaXQgZ2V0QWxsSWRzSXRlcmF0b3IoYXBwKShjb2xsZWN0aW9uX0tleV9vcl9Ob2RlS2V5KTtcblxuXG4gIGNvbnN0IGNyZWF0ZVRyYW5zYWN0aW9uc0ZvcklkcyA9IGFzeW5jIChjb2xsZWN0aW9uS2V5LCBhbGxJZHMpID0+IHtcbiAgICBmb3IgKGNvbnN0IHJlY29yZElkIG9mIGFsbElkcykge1xuICAgICAgY29uc3QgcmVjb3JkS2V5ID0gam9pbktleShjb2xsZWN0aW9uS2V5LCByZWNvcmRJZCk7XG5cbiAgICAgIGNvbnN0IHJlY29yZE5vZGUgPSBjaG9vc2VDaGlsZFJlY29yZE5vZGVCeUtleShcbiAgICAgICAgY29sbGVjdGlvbk5vZGUsXG4gICAgICAgIHJlY29yZElkLFxuICAgICAgKTtcblxuICAgICAgaWYgKHJlY29yZE5vZGVBcHBsaWVzKGluZGV4Tm9kZSkocmVjb3JkTm9kZSkpIHtcbiAgICAgICAgYXdhaXQgdHJhbnNhY3Rpb25Gb3JCdWlsZEluZGV4KFxuICAgICAgICAgIGFwcCwgaW5kZXhOb2RlLm5vZGVLZXkoKSxcbiAgICAgICAgICByZWNvcmRLZXksIHJlY29yZENvdW50LFxuICAgICAgICApO1xuICAgICAgICByZWNvcmRDb3VudCsrO1xuICAgICAgfVxuXG4gICAgICBpZiAoaGFzQXBwbGljYWJsZURlY2VuZGFudChhcHAuaGllcmFyY2h5LCByZWNvcmROb2RlLCBpbmRleE5vZGUpKSB7XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGRDb2xsZWN0aW9uTm9kZSBvZiByZWNvcmROb2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgcmVjb3JkQ291bnQgPSBhd2FpdCBhcHBseUFsbERlY2VuZGFudFJlY29yZHMoXG4gICAgICAgICAgICBhcHAsXG4gICAgICAgICAgICBqb2luS2V5KHJlY29yZEtleSwgY2hpbGRDb2xsZWN0aW9uTm9kZS5jb2xsZWN0aW9uTmFtZSksXG4gICAgICAgICAgICBpbmRleE5vZGUsIGluZGV4S2V5LCBjdXJyZW50SW5kZXhlZERhdGEsXG4gICAgICAgICAgICBjdXJyZW50SW5kZXhlZERhdGFLZXksIHJlY29yZENvdW50LFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgbGV0IGFsbElkcyA9IGF3YWl0IGFsbElkc0l0ZXJhdG9yKCk7XG4gIHdoaWxlIChhbGxJZHMuZG9uZSA9PT0gZmFsc2UpIHtcbiAgICBhd2FpdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JJZHMoXG4gICAgICBhbGxJZHMucmVzdWx0LmNvbGxlY3Rpb25LZXksXG4gICAgICBhbGxJZHMucmVzdWx0LmlkcyxcbiAgICApO1xuICAgIGFsbElkcyA9IGF3YWl0IGFsbElkc0l0ZXJhdG9yKCk7XG4gIH1cblxuICByZXR1cm4gcmVjb3JkQ291bnQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBidWlsZEluZGV4O1xuIiwiaW1wb3J0IHsgaGFzLCBpc051bWJlciwgaXNVbmRlZmluZWQgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgY29tcGlsZUV4cHJlc3Npb24sIGNvbXBpbGVDb2RlIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xuaW1wb3J0IHtcbiAgc2FmZUtleSwgYXBpV3JhcHBlcixcbiAgZXZlbnRzLCBpc05vbkVtcHR5U3RyaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgaXRlcmF0ZUluZGV4IH0gZnJvbSAnLi4vaW5kZXhpbmcvcmVhZCc7XG5pbXBvcnQge1xuICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXksXG4gIGdldFNoYXJkS2V5c0luUmFuZ2UsXG59IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcbmltcG9ydCB7XG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsIGlzSW5kZXgsXG4gIGlzU2hhcmRlZEluZGV4LFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgQ09OVElOVUVfUkVBRElOR19SRUNPUkRTIH0gZnJvbSAnLi4vaW5kZXhpbmcvc2VyaWFsaXplcic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGFnZ3JlZ2F0ZXMgPSBhcHAgPT4gYXN5bmMgKGluZGV4S2V5LCByYW5nZVN0YXJ0UGFyYW1zID0gbnVsbCwgcmFuZ2VFbmRQYXJhbXMgPSBudWxsKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5pbmRleEFwaS5hZ2dyZWdhdGVzLFxuICBwZXJtaXNzaW9uLnJlYWRJbmRleC5pc0F1dGhvcml6ZWQoaW5kZXhLZXkpLFxuICB7IGluZGV4S2V5LCByYW5nZVN0YXJ0UGFyYW1zLCByYW5nZUVuZFBhcmFtcyB9LFxuICBfYWdncmVnYXRlcywgYXBwLCBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMsXG4pO1xuXG5jb25zdCBfYWdncmVnYXRlcyA9IGFzeW5jIChhcHAsIGluZGV4S2V5LCByYW5nZVN0YXJ0UGFyYW1zLCByYW5nZUVuZFBhcmFtcykgPT4ge1xuICBpbmRleEtleSA9IHNhZmVLZXkoaW5kZXhLZXkpO1xuICBjb25zdCBpbmRleE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKGluZGV4S2V5KTtcblxuICBpZiAoIWlzSW5kZXgoaW5kZXhOb2RlKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdzdXBwbGllZCBrZXkgaXMgbm90IGFuIGluZGV4Jyk7IH1cblxuICBpZiAoaXNTaGFyZGVkSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIGNvbnN0IHNoYXJkS2V5cyA9IGF3YWl0IGdldFNoYXJkS2V5c0luUmFuZ2UoXG4gICAgICBhcHAsIGluZGV4S2V5LCByYW5nZVN0YXJ0UGFyYW1zLCByYW5nZUVuZFBhcmFtcyxcbiAgICApO1xuICAgIGxldCBhZ2dyZWdhdGVSZXN1bHQgPSBudWxsO1xuICAgIGZvciAoY29uc3QgayBvZiBzaGFyZEtleXMpIHtcbiAgICAgIGNvbnN0IHNoYXJkUmVzdWx0ID0gYXdhaXQgZ2V0QWdncmVnYXRlcyhhcHAuaGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlLCBpbmRleE5vZGUsIGspO1xuICAgICAgaWYgKGFnZ3JlZ2F0ZVJlc3VsdCA9PT0gbnVsbCkge1xuICAgICAgICBhZ2dyZWdhdGVSZXN1bHQgPSBzaGFyZFJlc3VsdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFnZ3JlZ2F0ZVJlc3VsdCA9IG1lcmdlU2hhcmRBZ2dyZWdhdGUoXG4gICAgICAgICAgYWdncmVnYXRlUmVzdWx0LFxuICAgICAgICAgIHNoYXJkUmVzdWx0LFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYWdncmVnYXRlUmVzdWx0O1xuICB9XG4gIHJldHVybiBhd2FpdCBnZXRBZ2dyZWdhdGVzKFxuICAgIGFwcC5oaWVyYXJjaHksXG4gICAgYXBwLmRhdGFzdG9yZSxcbiAgICBpbmRleE5vZGUsXG4gICAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5KGluZGV4S2V5KSxcbiAgKTtcbn07XG5cbmNvbnN0IG1lcmdlU2hhcmRBZ2dyZWdhdGUgPSAodG90YWxzLCBzaGFyZCkgPT4ge1xuICBjb25zdCBtZXJnZUdyb3VwaW5nID0gKHRvdCwgc2hyKSA9PiB7XG4gICAgdG90LmNvdW50ICs9IHNoci5jb3VudDtcbiAgICBmb3IgKGNvbnN0IGFnZ05hbWUgaW4gdG90KSB7XG4gICAgICBpZiAoYWdnTmFtZSA9PT0gJ2NvdW50JykgY29udGludWU7XG4gICAgICBjb25zdCB0b3RhZ2cgPSB0b3RbYWdnTmFtZV07XG4gICAgICBjb25zdCBzaHJhZ2cgPSBzaHJbYWdnTmFtZV07XG4gICAgICB0b3RhZ2cuc3VtICs9IHNocmFnZy5zdW07XG4gICAgICB0b3RhZ2cubWF4ID0gdG90YWdnLm1heCA+IHNocmFnZy5tYXhcbiAgICAgICAgPyB0b3RhZ2cubWF4XG4gICAgICAgIDogc2hyYWdnLm1heDtcbiAgICAgIHRvdGFnZy5taW4gPSB0b3RhZ2cubWluIDwgc2hyYWdnLm1pblxuICAgICAgICA/IHRvdGFnZy5taW5cbiAgICAgICAgOiBzaHJhZ2cubWluO1xuICAgICAgdG90YWdnLm1lYW4gPSB0b3RhZ2cuc3VtIC8gdG90LmNvdW50O1xuICAgIH1cbiAgICByZXR1cm4gdG90O1xuICB9O1xuXG4gIGZvciAoY29uc3QgYWdnR3JvdXBEZWYgaW4gdG90YWxzKSB7XG4gICAgZm9yIChjb25zdCBncm91cGluZyBpbiBzaGFyZFthZ2dHcm91cERlZl0pIHtcbiAgICAgIGNvbnN0IGdyb3VwaW5nVG90YWwgPSB0b3RhbHNbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXTtcbiAgICAgIHRvdGFsc1thZ2dHcm91cERlZl1bZ3JvdXBpbmddID0gaXNVbmRlZmluZWQoZ3JvdXBpbmdUb3RhbClcbiAgICAgICAgPyBzaGFyZFthZ2dHcm91cERlZl1bZ3JvdXBpbmddXG4gICAgICAgIDogbWVyZ2VHcm91cGluZyhcbiAgICAgICAgICB0b3RhbHNbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXSxcbiAgICAgICAgICBzaGFyZFthZ2dHcm91cERlZl1bZ3JvdXBpbmddLFxuICAgICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0b3RhbHM7XG59O1xuXG5jb25zdCBnZXRBZ2dyZWdhdGVzID0gYXN5bmMgKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXkpID0+IHtcbiAgY29uc3QgYWdncmVnYXRlUmVzdWx0ID0ge307XG4gIGNvbnN0IGRvUmVhZCA9IGl0ZXJhdGVJbmRleChcbiAgICAgICAgYXN5bmMgaXRlbSA9PiB7XG4gICAgICBhcHBseUl0ZW1Ub0FnZ3JlZ2F0ZVJlc3VsdChcbiAgICAgICAgaW5kZXgsIGFnZ3JlZ2F0ZVJlc3VsdCwgaXRlbSxcbiAgICAgICk7XG4gICAgICByZXR1cm4gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xuICAgIH0sXG4gICAgICAgIGFzeW5jICgpID0+IGFnZ3JlZ2F0ZVJlc3VsdFxuICApO1xuXG4gIHJldHVybiBhd2FpdCBkb1JlYWQoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSk7XG59O1xuXG5cbmNvbnN0IGFwcGx5SXRlbVRvQWdncmVnYXRlUmVzdWx0ID0gKGluZGV4Tm9kZSwgcmVzdWx0LCBpdGVtKSA9PiB7XG4gIGNvbnN0IGdldEluaXRpYWxBZ2dyZWdhdGVSZXN1bHQgPSAoKSA9PiAoe1xuICAgIHN1bTogMCwgbWVhbjogbnVsbCwgbWF4OiBudWxsLCBtaW46IG51bGwsXG4gIH0pO1xuXG4gIGNvbnN0IGFwcGx5QWdncmVnYXRlUmVzdWx0ID0gKGFnZywgZXhpc3RpbmcsIGNvdW50KSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSBjb21waWxlQ29kZShhZ2cuYWdncmVnYXRlZFZhbHVlKSh7IHJlY29yZDogaXRlbSB9KTtcblxuICAgIGlmICghaXNOdW1iZXIodmFsdWUpKSByZXR1cm4gZXhpc3Rpbmc7XG5cbiAgICBleGlzdGluZy5zdW0gKz0gdmFsdWU7XG4gICAgZXhpc3RpbmcubWF4ID0gdmFsdWUgPiBleGlzdGluZy5tYXggfHwgZXhpc3RpbmcubWF4ID09PSBudWxsXG4gICAgICA/IHZhbHVlXG4gICAgICA6IGV4aXN0aW5nLm1heDtcbiAgICBleGlzdGluZy5taW4gPSB2YWx1ZSA8IGV4aXN0aW5nLm1pbiB8fCBleGlzdGluZy5taW4gPT09IG51bGxcbiAgICAgID8gdmFsdWVcbiAgICAgIDogZXhpc3RpbmcubWluO1xuICAgIGV4aXN0aW5nLm1lYW4gPSBleGlzdGluZy5zdW0gLyBjb3VudDtcbiAgICByZXR1cm4gZXhpc3Rpbmc7XG4gIH07XG5cbiAgZm9yIChjb25zdCBhZ2dHcm91cCBvZiBpbmRleE5vZGUuYWdncmVnYXRlR3JvdXBzKSB7XG4gICAgaWYgKCFoYXMoYWdnR3JvdXAubmFtZSkocmVzdWx0KSkge1xuICAgICAgcmVzdWx0W2FnZ0dyb3VwLm5hbWVdID0ge307XG4gICAgfVxuXG4gICAgY29uc3QgdGhpc0dyb3VwUmVzdWx0ID0gcmVzdWx0W2FnZ0dyb3VwLm5hbWVdO1xuXG4gICAgaWYgKGlzTm9uRW1wdHlTdHJpbmcoYWdnR3JvdXAuY29uZGl0aW9uKSkge1xuICAgICAgaWYgKCFjb21waWxlRXhwcmVzc2lvbihhZ2dHcm91cC5jb25kaXRpb24pKHsgcmVjb3JkOiBpdGVtIH0pKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBncm91cCA9IGlzTm9uRW1wdHlTdHJpbmcoYWdnR3JvdXAuZ3JvdXBCeSlcbiAgICAgID8gY29tcGlsZUNvZGUoYWdnR3JvdXAuZ3JvdXBCeSkoeyByZWNvcmQ6IGl0ZW0gfSlcbiAgICAgIDogJ2FsbCc7XG4gICAgaWYgKCFpc05vbkVtcHR5U3RyaW5nKGdyb3VwKSkge1xuICAgICAgZ3JvdXAgPSAnKG5vbmUpJztcbiAgICB9XG5cbiAgICBpZiAoIWhhcyhncm91cCkodGhpc0dyb3VwUmVzdWx0KSkge1xuICAgICAgdGhpc0dyb3VwUmVzdWx0W2dyb3VwXSA9IHsgY291bnQ6IDAgfTtcbiAgICAgIGZvciAoY29uc3QgYWdnIG9mIGFnZ0dyb3VwLmFnZ3JlZ2F0ZXMpIHtcbiAgICAgICAgdGhpc0dyb3VwUmVzdWx0W2dyb3VwXVthZ2cubmFtZV0gPSBnZXRJbml0aWFsQWdncmVnYXRlUmVzdWx0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpc0dyb3VwUmVzdWx0W2dyb3VwXS5jb3VudCsrO1xuXG4gICAgZm9yIChjb25zdCBhZ2cgb2YgYWdnR3JvdXAuYWdncmVnYXRlcykge1xuICAgICAgY29uc3QgZXhpc3RpbmdWYWx1ZXMgPSB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdW2FnZy5uYW1lXTtcbiAgICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF1bYWdnLm5hbWVdID0gYXBwbHlBZ2dyZWdhdGVSZXN1bHQoXG4gICAgICAgIGFnZywgZXhpc3RpbmdWYWx1ZXMsXG4gICAgICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF0uY291bnQsXG4gICAgICApO1xuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IGJ1aWxkSW5kZXggfSBmcm9tICcuL2J1aWxkSW5kZXgnO1xuaW1wb3J0IHsgbGlzdEl0ZW1zIH0gZnJvbSAnLi9saXN0SXRlbXMnO1xuaW1wb3J0IHsgYWdncmVnYXRlcyB9IGZyb20gJy4vYWdncmVnYXRlcyc7XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleEFwaSA9IGFwcCA9PiAoe1xuICBsaXN0SXRlbXM6IGxpc3RJdGVtcyhhcHApLFxuICBidWlsZEluZGV4OiBidWlsZEluZGV4KGFwcCksXG4gIGFnZ3JlZ2F0ZXM6IGFnZ3JlZ2F0ZXMoYXBwKSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRJbmRleEFwaTtcbiIsImltcG9ydCB7IGVhY2gsIGNvbnN0YW50LCBmaW5kIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IG1hcCwgbWF4IH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLCBqb2luS2V5LFxuICAkLCBpc05vdGhpbmcsIGlzU29tZXRoaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgaXNJbmRleCwgaXNSb290LCBpc1NpbmdsZVJlY29yZCwgaXNDb2xsZWN0aW9uUmVjb3JkLFxuICBpc1JlY29yZCwgaXNhZ2dyZWdhdGVHcm91cCxcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxufSBmcm9tICcuL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBhbGwgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZU5vZGVFcnJvcnMgPSB7XG4gIGluZGV4Q2Fubm90QmVQYXJlbnQ6ICdJbmRleCB0ZW1wbGF0ZSBjYW5ub3QgYmUgYSBwYXJlbnQnLFxuICBhbGxOb25Sb290Tm9kZXNNdXN0SGF2ZVBhcmVudDogJ09ubHkgdGhlIHJvb3Qgbm9kZSBtYXkgaGF2ZSBubyBwYXJlbnQnLFxuICBpbmRleFBhcmVudE11c3RCZVJlY29yZE9yUm9vdDogJ0FuIGluZGV4IG1heSBvbmx5IGhhdmUgYSByZWNvcmQgb3Igcm9vdCBhcyBhIHBhcmVudCcsXG4gIGFnZ3JlZ2F0ZVBhcmVudE11c3RCZUFuSW5kZXg6ICdhZ2dyZWdhdGVHcm91cCBwYXJlbnQgbXVzdCBiZSBhbiBpbmRleCcsXG59O1xuXG5jb25zdCBwYXRoUmVneE1ha2VyID0gbm9kZSA9PiAoKSA9PiBub2RlLm5vZGVLZXkoKS5yZXBsYWNlKC97aWR9L2csICdbYS16QS1aMC05Xy1dKycpO1xuXG5jb25zdCBub2RlS2V5TWFrZXIgPSBub2RlID0+ICgpID0+IHN3aXRjaENhc2UoXG5cbiAgW24gPT4gaXNSZWNvcmQobikgJiYgIWlzU2luZ2xlUmVjb3JkKG4pLFxuICAgIG4gPT4gam9pbktleShcbiAgICAgIG5vZGUucGFyZW50KCkubm9kZUtleSgpLFxuICAgICAgbm9kZS5jb2xsZWN0aW9uTmFtZSxcbiAgICAgIGAke24ubm9kZUlkfS17aWR9YCxcbiAgICApXSxcblxuICBbaXNSb290LFxuICAgIGNvbnN0YW50KCcvJyldLFxuXG4gIFtkZWZhdWx0Q2FzZSxcbiAgICBuID0+IGpvaW5LZXkobm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksIG4ubmFtZSldLFxuXG4pKG5vZGUpO1xuXG5cbmNvbnN0IHZhbGlkYXRlID0gcGFyZW50ID0+IChub2RlKSA9PiB7XG4gIGlmIChpc0luZGV4KG5vZGUpXG4gICAgICAgICYmIGlzU29tZXRoaW5nKHBhcmVudClcbiAgICAgICAgJiYgIWlzUm9vdChwYXJlbnQpXG4gICAgICAgICYmICFpc1JlY29yZChwYXJlbnQpKSB7XG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihjcmVhdGVOb2RlRXJyb3JzLmluZGV4UGFyZW50TXVzdEJlUmVjb3JkT3JSb290KTtcbiAgfVxuXG4gIGlmIChpc2FnZ3JlZ2F0ZUdyb3VwKG5vZGUpXG4gICAgICAgICYmIGlzU29tZXRoaW5nKHBhcmVudClcbiAgICAgICAgJiYgIWlzSW5kZXgocGFyZW50KSkge1xuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoY3JlYXRlTm9kZUVycm9ycy5hZ2dyZWdhdGVQYXJlbnRNdXN0QmVBbkluZGV4KTtcbiAgfVxuXG4gIGlmIChpc05vdGhpbmcocGFyZW50KSAmJiAhaXNSb290KG5vZGUpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoY3JlYXRlTm9kZUVycm9ycy5hbGxOb25Sb290Tm9kZXNNdXN0SGF2ZVBhcmVudCk7IH1cblxuICByZXR1cm4gbm9kZTtcbn07XG5cbmNvbnN0IGNvbnN0cnVjdCA9IHBhcmVudCA9PiAobm9kZSkgPT4ge1xuICBub2RlLm5vZGVLZXkgPSBub2RlS2V5TWFrZXIobm9kZSk7XG4gIG5vZGUucGF0aFJlZ3ggPSBwYXRoUmVneE1ha2VyKG5vZGUpO1xuICBub2RlLnBhcmVudCA9IGNvbnN0YW50KHBhcmVudCk7XG4gIG5vZGUuaXNSb290ID0gKCkgPT4gaXNOb3RoaW5nKHBhcmVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIG5vZGUubmFtZSA9PT0gJ3Jvb3QnXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBub2RlLnR5cGUgPT09ICdyb290JztcbiAgaWYgKGlzQ29sbGVjdGlvblJlY29yZChub2RlKSkge1xuICAgIG5vZGUuY29sbGVjdGlvbk5vZGVLZXkgPSAoKSA9PiBqb2luS2V5KFxuICAgICAgcGFyZW50Lm5vZGVLZXkoKSwgbm9kZS5jb2xsZWN0aW9uTmFtZSxcbiAgICApO1xuICAgIG5vZGUuY29sbGVjdGlvblBhdGhSZWd4ID0gKCkgPT4gam9pbktleShcbiAgICAgIHBhcmVudC5wYXRoUmVneCgpLCBub2RlLmNvbGxlY3Rpb25OYW1lLFxuICAgICk7XG4gIH1cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5jb25zdCBhZGRUb1BhcmVudCA9IChvYmopID0+IHtcbiAgY29uc3QgcGFyZW50ID0gb2JqLnBhcmVudCgpO1xuICBpZiAoaXNTb21ldGhpbmcocGFyZW50KSkge1xuICAgIGlmIChpc0luZGV4KG9iaikpXG4gICAgLy8gUTogd2h5IGFyZSBpbmRleGVzIG5vdCBjaGlsZHJlbiA/XG4gICAgLy8gQTogYmVjYXVzZSB0aGV5IGNhbm5vdCBoYXZlIGNoaWxkcmVuIG9mIHRoZWlyIG93bi5cbiAgICB7IHBhcmVudC5pbmRleGVzLnB1c2gob2JqKTsgfSBlbHNlIGlmIChpc2FnZ3JlZ2F0ZUdyb3VwKG9iaikpIHsgcGFyZW50LmFnZ3JlZ2F0ZUdyb3Vwcy5wdXNoKG9iaik7IH0gZWxzZSB7IHBhcmVudC5jaGlsZHJlbi5wdXNoKG9iaik7IH1cblxuICAgIGlmIChpc1JlY29yZChvYmopKSB7XG4gICAgICBjb25zdCBkZWZhdWx0SW5kZXggPSBmaW5kKFxuICAgICAgICBwYXJlbnQuaW5kZXhlcyxcbiAgICAgICAgaSA9PiBpLm5hbWUgPT09IGAke3BhcmVudC5uYW1lfV9pbmRleGAsXG4gICAgICApO1xuICAgICAgaWYgKGRlZmF1bHRJbmRleCkge1xuICAgICAgICBkZWZhdWx0SW5kZXguYWxsb3dlZFJlY29yZE5vZGVJZHMucHVzaChvYmoubm9kZUlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9iajtcbn07XG5cbmV4cG9ydCBjb25zdCBjb25zdHJ1Y3ROb2RlID0gKHBhcmVudCwgb2JqKSA9PiAkKG9iaiwgW1xuICBjb25zdHJ1Y3QocGFyZW50KSxcbiAgdmFsaWRhdGUocGFyZW50KSxcbiAgYWRkVG9QYXJlbnQsXG5dKTtcblxuY29uc3QgZ2V0Tm9kZUlkID0gKHBhcmVudE5vZGUpID0+IHtcbiAgLy8gdGhpcyBjYXNlIGlzIGhhbmRsZWQgYmV0dGVyIGVsc2V3aGVyZVxuICBpZiAoIXBhcmVudE5vZGUpIHJldHVybiBudWxsO1xuICBjb25zdCBmaW5kUm9vdCA9IG4gPT4gKGlzUm9vdChuKSA/IG4gOiBmaW5kUm9vdChuLnBhcmVudCgpKSk7XG4gIGNvbnN0IHJvb3QgPSBmaW5kUm9vdChwYXJlbnROb2RlKTtcblxuICByZXR1cm4gKCQocm9vdCwgW1xuICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgICBtYXAobiA9PiBuLm5vZGVJZCksXG4gICAgbWF4XSkgKyAxKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjb25zdHJ1Y3RIaWVyYXJjaHkgPSAobm9kZSwgcGFyZW50KSA9PiB7XG4gIGNvbnN0cnVjdChwYXJlbnQpKG5vZGUpO1xuICBpZiAobm9kZS5pbmRleGVzKSB7XG4gICAgZWFjaChub2RlLmluZGV4ZXMsXG4gICAgICBjaGlsZCA9PiBjb25zdHJ1Y3RIaWVyYXJjaHkoY2hpbGQsIG5vZGUpKTtcbiAgfVxuICBpZiAobm9kZS5hZ2dyZWdhdGVHcm91cHMpIHtcbiAgICBlYWNoKG5vZGUuYWdncmVnYXRlR3JvdXBzLFxuICAgICAgY2hpbGQgPT4gY29uc3RydWN0SGllcmFyY2h5KGNoaWxkLCBub2RlKSk7XG4gIH1cbiAgaWYgKG5vZGUuY2hpbGRyZW4gJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgZWFjaChub2RlLmNoaWxkcmVuLFxuICAgICAgY2hpbGQgPT4gY29uc3RydWN0SGllcmFyY2h5KGNoaWxkLCBub2RlKSk7XG4gIH1cbiAgaWYgKG5vZGUuZmllbGRzKSB7XG4gICAgZWFjaChub2RlLmZpZWxkcyxcbiAgICAgIGYgPT4gZWFjaChmLnR5cGVPcHRpb25zLCAodmFsLCBrZXkpID0+IHtcbiAgICAgICAgY29uc3QgZGVmID0gYWxsW2YudHlwZV0ub3B0aW9uRGVmaW5pdGlvbnNba2V5XTtcbiAgICAgICAgaWYgKCFkZWYpIHtcbiAgICAgICAgICAvLyB1bmtub3duIHR5cGVPcHRpb25cbiAgICAgICAgICBkZWxldGUgZi50eXBlT3B0aW9uc1trZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGYudHlwZU9wdGlvbnNba2V5XSA9IGRlZi5wYXJzZSh2YWwpO1xuICAgICAgICB9XG4gICAgICB9KSk7XG4gIH1cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5cbmV4cG9ydCBjb25zdCBnZXROZXdSb290TGV2ZWwgPSAoKSA9PiBjb25zdHJ1Y3QoKSh7XG4gIG5hbWU6ICdyb290JyxcbiAgdHlwZTogJ3Jvb3QnLFxuICBjaGlsZHJlbjogW10sXG4gIHBhdGhNYXBzOiBbXSxcbiAgaW5kZXhlczogW10sXG4gIG5vZGVJZDogMCxcbn0pO1xuXG5jb25zdCBfZ2V0TmV3UmVjb3JkVGVtcGxhdGUgPSAocGFyZW50LCBuYW1lLCBjcmVhdGVEZWZhdWx0SW5kZXgsIGlzU2luZ2xlKSA9PiB7XG4gIGNvbnN0IG5vZGUgPSBjb25zdHJ1Y3ROb2RlKHBhcmVudCwge1xuICAgIG5hbWUsXG4gICAgdHlwZTogJ3JlY29yZCcsXG4gICAgZmllbGRzOiBbXSxcbiAgICBjaGlsZHJlbjogW10sXG4gICAgdmFsaWRhdGlvblJ1bGVzOiBbXSxcbiAgICBub2RlSWQ6IGdldE5vZGVJZChwYXJlbnQpLFxuICAgIGluZGV4ZXM6IFtdLFxuICAgIGFsbGlkc1NoYXJkRmFjdG9yOiBpc1JlY29yZChwYXJlbnQpID8gMSA6IDY0LFxuICAgIGNvbGxlY3Rpb25OYW1lOiAnJyxcbiAgICBpc1NpbmdsZSxcbiAgfSk7XG5cbiAgaWYgKGNyZWF0ZURlZmF1bHRJbmRleCkge1xuICAgIGNvbnN0IGRlZmF1bHRJbmRleCA9IGdldE5ld0luZGV4VGVtcGxhdGUocGFyZW50KTtcbiAgICBkZWZhdWx0SW5kZXgubmFtZSA9IGAke25hbWV9X2luZGV4YDtcbiAgICBkZWZhdWx0SW5kZXguYWxsb3dlZFJlY29yZE5vZGVJZHMucHVzaChub2RlLm5vZGVJZCk7XG4gIH1cblxuICByZXR1cm4gbm9kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXROZXdSZWNvcmRUZW1wbGF0ZSA9IChwYXJlbnQsIG5hbWUgPSAnJywgY3JlYXRlRGVmYXVsdEluZGV4ID0gdHJ1ZSkgPT4gX2dldE5ld1JlY29yZFRlbXBsYXRlKHBhcmVudCwgbmFtZSwgY3JlYXRlRGVmYXVsdEluZGV4LCBmYWxzZSk7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdTaW5nbGVSZWNvcmRUZW1wbGF0ZSA9IHBhcmVudCA9PiBfZ2V0TmV3UmVjb3JkVGVtcGxhdGUocGFyZW50LCAnJywgZmFsc2UsIHRydWUpO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3SW5kZXhUZW1wbGF0ZSA9IChwYXJlbnQsIHR5cGUgPSAnYW5jZXN0b3InKSA9PiBjb25zdHJ1Y3ROb2RlKHBhcmVudCwge1xuICBuYW1lOiAnJyxcbiAgdHlwZTogJ2luZGV4JyxcbiAgbWFwOiAncmV0dXJuIHsuLi5yZWNvcmR9OycsXG4gIGZpbHRlcjogJycsXG4gIGluZGV4VHlwZTogdHlwZSxcbiAgZ2V0U2hhcmROYW1lOiAnJyxcbiAgZ2V0U29ydEtleTogJ3JlY29yZC5pZCcsXG4gIGFnZ3JlZ2F0ZUdyb3VwczogW10sXG4gIGFsbG93ZWRSZWNvcmROb2RlSWRzOiBbXSxcbiAgbm9kZUlkOiBnZXROb2RlSWQocGFyZW50KSxcbn0pO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3QWdncmVnYXRlR3JvdXBUZW1wbGF0ZSA9IGluZGV4ID0+IGNvbnN0cnVjdE5vZGUoaW5kZXgsIHtcbiAgbmFtZTogJycsXG4gIHR5cGU6ICdhZ2dyZWdhdGVHcm91cCcsXG4gIGdyb3VwQnk6ICcnLFxuICBhZ2dyZWdhdGVzOiBbXSxcbiAgY29uZGl0aW9uOiAnJyxcbiAgbm9kZUlkOiBnZXROb2RlSWQoaW5kZXgpLFxufSk7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdBZ2dyZWdhdGVUZW1wbGF0ZSA9IChzZXQpID0+IHtcbiAgY29uc3QgYWdncmVnYXRlZFZhbHVlID0ge1xuICAgIG5hbWU6ICcnLFxuICAgIGFnZ3JlZ2F0ZWRWYWx1ZTogJycsXG4gIH07XG4gIHNldC5hZ2dyZWdhdGVzLnB1c2goYWdncmVnYXRlZFZhbHVlKTtcbiAgcmV0dXJuIGFnZ3JlZ2F0ZWRWYWx1ZTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZ2V0TmV3Um9vdExldmVsLFxuICBnZXROZXdSZWNvcmRUZW1wbGF0ZSxcbiAgZ2V0TmV3SW5kZXhUZW1wbGF0ZSxcbiAgY3JlYXRlTm9kZUVycm9ycyxcbiAgY29uc3RydWN0SGllcmFyY2h5LFxuICBnZXROZXdBZ2dyZWdhdGVHcm91cFRlbXBsYXRlLFxuICBnZXROZXdBZ2dyZWdhdGVUZW1wbGF0ZSxcbn07XG4iLCJpbXBvcnQge1xuICBzb21lLCBtYXAsIGZpbHRlciwga2V5cywgaW5jbHVkZXMsXG4gIGNvdW50QnksIGZsYXR0ZW4sXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBpc1NvbWV0aGluZywgJCxcbiAgaXNOb25FbXB0eVN0cmluZyxcbiAgaXNOb3RoaW5nT3JFbXB0eSxcbiAgaXNOb3RoaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgYWxsLCBnZXREZWZhdWx0T3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGFwcGx5UnVsZVNldCwgbWFrZXJ1bGUgfSBmcm9tICcuLi9jb21tb24vdmFsaWRhdGlvbkNvbW1vbic7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGZpZWxkRXJyb3JzID0ge1xuICBBZGRGaWVsZFZhbGlkYXRpb25GYWlsZWQ6ICdBZGQgZmllbGQgdmFsaWRhdGlvbjogJyxcbn07XG5cbmV4cG9ydCBjb25zdCBhbGxvd2VkVHlwZXMgPSAoKSA9PiBrZXlzKGFsbCk7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdGaWVsZCA9IHR5cGUgPT4gKHtcbiAgbmFtZTogJycsIC8vIGhvdyBmaWVsZCBpcyByZWZlcmVuY2VkIGludGVybmFsbHlcbiAgdHlwZSxcbiAgdHlwZU9wdGlvbnM6IGdldERlZmF1bHRPcHRpb25zKHR5cGUpLFxuICBsYWJlbDogJycsIC8vIGhvdyBmaWVsZCBpcyBkaXNwbGF5ZWRcbiAgZ2V0SW5pdGlhbFZhbHVlOiAnZGVmYXVsdCcsIC8vIGZ1bmN0aW9uIHRoYXQgZ2V0cyB2YWx1ZSB3aGVuIGluaXRpYWxseSBjcmVhdGVkXG4gIGdldFVuZGVmaW5lZFZhbHVlOiAnZGVmYXVsdCcsIC8vIGZ1bmN0aW9uIHRoYXQgZ2V0cyB2YWx1ZSB3aGVuIGZpZWxkIHVuZGVmaW5lZCBvbiByZWNvcmRcbn0pO1xuXG5jb25zdCBmaWVsZFJ1bGVzID0gYWxsRmllbGRzID0+IFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnZmllbGQgbmFtZSBpcyBub3Qgc2V0JyxcbiAgICBmID0+IGlzTm9uRW1wdHlTdHJpbmcoZi5uYW1lKSksXG4gIG1ha2VydWxlKCd0eXBlJywgJ2ZpZWxkIHR5cGUgaXMgbm90IHNldCcsXG4gICAgZiA9PiBpc05vbkVtcHR5U3RyaW5nKGYudHlwZSkpLFxuICBtYWtlcnVsZSgnbGFiZWwnLCAnZmllbGQgbGFiZWwgaXMgbm90IHNldCcsXG4gICAgZiA9PiBpc05vbkVtcHR5U3RyaW5nKGYubGFiZWwpKSxcbiAgbWFrZXJ1bGUoJ2dldEluaXRpYWxWYWx1ZScsICdnZXRJbml0aWFsVmFsdWUgZnVuY3Rpb24gaXMgbm90IHNldCcsXG4gICAgZiA9PiBpc05vbkVtcHR5U3RyaW5nKGYuZ2V0SW5pdGlhbFZhbHVlKSksXG4gIG1ha2VydWxlKCdnZXRVbmRlZmluZWRWYWx1ZScsICdnZXRVbmRlZmluZWRWYWx1ZSBmdW5jdGlvbiBpcyBub3Qgc2V0JyxcbiAgICBmID0+IGlzTm9uRW1wdHlTdHJpbmcoZi5nZXRVbmRlZmluZWRWYWx1ZSkpLFxuICBtYWtlcnVsZSgnbmFtZScsICdmaWVsZCBuYW1lIGlzIGR1cGxpY2F0ZWQnLFxuICAgIGYgPT4gaXNOb3RoaW5nT3JFbXB0eShmLm5hbWUpXG4gICAgICAgICAgICAgfHwgY291bnRCeSgnbmFtZScpKGFsbEZpZWxkcylbZi5uYW1lXSA9PT0gMSksXG4gIG1ha2VydWxlKCd0eXBlJywgJ3R5cGUgaXMgdW5rbm93bicsXG4gICAgZiA9PiBpc05vdGhpbmdPckVtcHR5KGYudHlwZSlcbiAgICAgICAgICAgICB8fCBzb21lKHQgPT4gZi50eXBlID09PSB0KShhbGxvd2VkVHlwZXMoKSkpLFxuXTtcblxuY29uc3QgdHlwZU9wdGlvbnNSdWxlcyA9IChmaWVsZCkgPT4ge1xuICBjb25zdCB0eXBlID0gYWxsW2ZpZWxkLnR5cGVdO1xuICBpZiAoaXNOb3RoaW5nKHR5cGUpKSByZXR1cm4gW107XG5cbiAgY29uc3QgZGVmID0gb3B0TmFtZSA9PiB0eXBlLm9wdGlvbkRlZmluaXRpb25zW29wdE5hbWVdO1xuXG4gIHJldHVybiAkKGZpZWxkLnR5cGVPcHRpb25zLCBbXG4gICAga2V5cyxcbiAgICBmaWx0ZXIobyA9PiBpc1NvbWV0aGluZyhkZWYobykpXG4gICAgICAgICAgICAgICAgICAgICYmIGlzU29tZXRoaW5nKGRlZihvKS5pc1ZhbGlkKSksXG4gICAgbWFwKG8gPT4gbWFrZXJ1bGUoXG4gICAgICBgdHlwZU9wdGlvbnMuJHtvfWAsXG4gICAgICBgJHtkZWYobykucmVxdWlyZW1lbnREZXNjcmlwdGlvbn1gLFxuICAgICAgZmllbGQgPT4gZGVmKG8pLmlzVmFsaWQoZmllbGQudHlwZU9wdGlvbnNbb10pLFxuICAgICkpLFxuICBdKTtcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUZpZWxkID0gYWxsRmllbGRzID0+IChmaWVsZCkgPT4ge1xuICBjb25zdCBldmVyeVNpbmdsZUZpZWxkID0gaW5jbHVkZXMoZmllbGQpKGFsbEZpZWxkcykgPyBhbGxGaWVsZHMgOiBbLi4uYWxsRmllbGRzLCBmaWVsZF07XG4gIHJldHVybiBhcHBseVJ1bGVTZXQoWy4uLmZpZWxkUnVsZXMoZXZlcnlTaW5nbGVGaWVsZCksIC4uLnR5cGVPcHRpb25zUnVsZXMoZmllbGQpXSkoZmllbGQpO1xufTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWxsRmllbGRzID0gcmVjb3JkTm9kZSA9PiAkKHJlY29yZE5vZGUuZmllbGRzLCBbXG4gIG1hcCh2YWxpZGF0ZUZpZWxkKHJlY29yZE5vZGUuZmllbGRzKSksXG4gIGZsYXR0ZW4sXG5dKTtcblxuZXhwb3J0IGNvbnN0IGFkZEZpZWxkID0gKHJlY29yZFRlbXBsYXRlLCBmaWVsZCkgPT4ge1xuICBpZiAoaXNOb3RoaW5nT3JFbXB0eShmaWVsZC5sYWJlbCkpIHtcbiAgICBmaWVsZC5sYWJlbCA9IGZpZWxkLm5hbWU7XG4gIH1cbiAgY29uc3QgdmFsaWRhdGlvbk1lc3NhZ2VzID0gdmFsaWRhdGVGaWVsZChbLi4ucmVjb3JkVGVtcGxhdGUuZmllbGRzLCBmaWVsZF0pKGZpZWxkKTtcbiAgaWYgKHZhbGlkYXRpb25NZXNzYWdlcy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgZXJyb3JzID0gbWFwKG0gPT4gbS5lcnJvcikodmFsaWRhdGlvbk1lc3NhZ2VzKTtcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGAke2ZpZWxkRXJyb3JzLkFkZEZpZWxkVmFsaWRhdGlvbkZhaWxlZH0gJHtlcnJvcnMuam9pbignLCAnKX1gKTtcbiAgfVxuICByZWNvcmRUZW1wbGF0ZS5maWVsZHMucHVzaChmaWVsZCk7XG59O1xuIiwiaW1wb3J0IHsgaXNOdW1iZXIsIGlzQm9vbGVhbiwgZGVmYXVsdENhc2UgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgc3dpdGNoQ2FzZSB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZSA9IChpbnZhbGlkRmllbGRzLFxuICBtZXNzYWdlV2hlbkludmFsaWQsXG4gIGV4cHJlc3Npb25XaGVuVmFsaWQpID0+ICh7XG4gIGludmFsaWRGaWVsZHMsIG1lc3NhZ2VXaGVuSW52YWxpZCwgZXhwcmVzc2lvbldoZW5WYWxpZCxcbn0pO1xuXG5jb25zdCBnZXRTdGF0aWNWYWx1ZSA9IHN3aXRjaENhc2UoXG4gIFtpc051bWJlciwgdiA9PiB2LnRvU3RyaW5nKCldLFxuICBbaXNCb29sZWFuLCB2ID0+IHYudG9TdHJpbmcoKV0sXG4gIFtkZWZhdWx0Q2FzZSwgdiA9PiBgJyR7dn0nYF0sXG4pO1xuXG5leHBvcnQgY29uc3QgY29tbW9uUmVjb3JkVmFsaWRhdGlvblJ1bGVzID0gKHtcblxuICBmaWVsZE5vdEVtcHR5OiBmaWVsZE5hbWUgPT4gZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUoXG4gICAgW2ZpZWxkTmFtZV0sXG4gICAgYCR7ZmllbGROYW1lfSBpcyBlbXB0eWAsXG4gICAgYCFfLmlzRW1wdHkocmVjb3JkWycke2ZpZWxkTmFtZX0nXSlgLFxuICApLFxuXG4gIGZpZWxkQmV0d2VlbjogKGZpZWxkTmFtZSwgbWluLCBtYXgpID0+IGdldE5ld1JlY29yZFZhbGlkYXRpb25SdWxlKFxuICAgIFtmaWVsZE5hbWVdLFxuICAgIGAke2ZpZWxkTmFtZX0gbXVzdCBiZSBiZXR3ZWVuICR7bWluLnRvU3RyaW5nKCl9IGFuZCAke21heC50b1N0cmluZygpfWAsXG4gICAgYHJlY29yZFsnJHtmaWVsZE5hbWV9J10gPj0gJHtnZXRTdGF0aWNWYWx1ZShtaW4pfSAmJiAgcmVjb3JkWycke2ZpZWxkTmFtZX0nXSA8PSAke2dldFN0YXRpY1ZhbHVlKG1heCl9IGAsXG4gICksXG5cbiAgZmllbGRHcmVhdGVyVGhhbjogKGZpZWxkTmFtZSwgbWluLCBtYXgpID0+IGdldE5ld1JlY29yZFZhbGlkYXRpb25SdWxlKFxuICAgIFtmaWVsZE5hbWVdLFxuICAgIGAke2ZpZWxkTmFtZX0gbXVzdCBiZSBncmVhdGVyIHRoYW4gJHttaW4udG9TdHJpbmcoKX0gYW5kICR7bWF4LnRvU3RyaW5nKCl9YCxcbiAgICBgcmVjb3JkWycke2ZpZWxkTmFtZX0nXSA+PSAke2dldFN0YXRpY1ZhbHVlKG1pbil9ICBgLFxuICApLFxufSk7XG5cbmV4cG9ydCBjb25zdCBhZGRSZWNvcmRWYWxpZGF0aW9uUnVsZSA9IHJlY29yZE5vZGUgPT4gcnVsZSA9PiByZWNvcmROb2RlLnZhbGlkYXRpb25SdWxlcy5wdXNoKHJ1bGUpO1xuIiwiXG5leHBvcnQgY29uc3QgY3JlYXRlVHJpZ2dlciA9ICgpID0+ICh7XG4gIGFjdGlvbk5hbWU6ICcnLFxuICBldmVudE5hbWU6ICcnLFxuICAvLyBmdW5jdGlvbiwgaGFzIGFjY2VzcyB0byBldmVudCBjb250ZXh0LFxuICAvLyByZXR1cm5zIG9iamVjdCB0aGF0IGlzIHVzZWQgYXMgcGFyYW1ldGVyIHRvIGFjdGlvblxuICAvLyBvbmx5IHVzZWQgaWYgdHJpZ2dlcmVkIGJ5IGV2ZW50XG4gIG9wdGlvbnNDcmVhdG9yOiAnJyxcbiAgLy8gYWN0aW9uIHJ1bnMgaWYgdHJ1ZSxcbiAgLy8gaGFzIGFjY2VzcyB0byBldmVudCBjb250ZXh0XG4gIGNvbmRpdGlvbjogJycsXG59KTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUFjdGlvbiA9ICgpID0+ICh7XG4gIG5hbWU6ICcnLFxuICBiZWhhdmlvdXJTb3VyY2U6ICcnLFxuICAvLyBuYW1lIG9mIGZ1bmN0aW9uIGluIGFjdGlvblNvdXJjZVxuICBiZWhhdmlvdXJOYW1lOiAnJyxcbiAgLy8gcGFyYW1ldGVyIHBhc3NlZCBpbnRvIGJlaGF2aW91ci5cbiAgLy8gYW55IG90aGVyIHBhcm1zIHBhc3NlZCBhdCBydW50aW1lIGUuZy5cbiAgLy8gYnkgdHJpZ2dlciwgb3IgbWFudWFsbHksIHdpbGwgYmUgbWVyZ2VkIGludG8gdGhpc1xuICBpbml0aWFsT3B0aW9uczoge30sXG59KTtcbiIsImltcG9ydCB7IGZsYXR0ZW4sIG1hcCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBpc0VtcHR5IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IGNvbXBpbGVDb2RlIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xuaW1wb3J0IHtcbiAgaXNOb25FbXB0eVN0cmluZywgXG4gIGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbiwgJCwgXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuXG5jb25zdCBhZ2dyZWdhdGVSdWxlcyA9IFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnY2hvb3NlIGEgbmFtZSBmb3IgdGhlIGFnZ3JlZ2F0ZScsXG4gICAgYSA9PiBpc05vbkVtcHR5U3RyaW5nKGEubmFtZSkpLFxuICBtYWtlcnVsZSgnYWdncmVnYXRlZFZhbHVlJywgJ2FnZ3JlZ2F0ZWRWYWx1ZSBkb2VzIG5vdCBjb21waWxlJyxcbiAgICBhID0+IGlzRW1wdHkoYS5hZ2dyZWdhdGVkVmFsdWUpXG4gICAgICAgICAgICB8fCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24oXG4gICAgICAgICAgICAgICgpID0+IGNvbXBpbGVDb2RlKGEuYWdncmVnYXRlZFZhbHVlKSxcbiAgICAgICAgICAgICkpLFxuXTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWdncmVnYXRlID0gYWdncmVnYXRlID0+IGFwcGx5UnVsZVNldChhZ2dyZWdhdGVSdWxlcykoYWdncmVnYXRlKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWxsQWdncmVnYXRlcyA9IGFsbCA9PiAkKGFsbCwgW1xuICBtYXAodmFsaWRhdGVBZ2dyZWdhdGUpLFxuICBmbGF0dGVuLFxuXSk7XG4iLCJpbXBvcnQge1xuICBmaWx0ZXIsIHVuaW9uLCBjb25zdGFudCxcbiAgbWFwLCBmbGF0dGVuLCBldmVyeSwgdW5pcUJ5LFxuICBzb21lLCBpbmNsdWRlcywgaXNFbXB0eSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGhhcyB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBjb21waWxlRXhwcmVzc2lvbiwgY29tcGlsZUNvZGUgfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XG5pbXBvcnQge1xuICAkLCBpc1NvbWV0aGluZywgc3dpdGNoQ2FzZSxcbiAgYW55VHJ1ZSwgaXNOb25FbXB0eUFycmF5LCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24sXG4gIGlzTm9uRW1wdHlTdHJpbmcsIGRlZmF1bHRDYXNlLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgaXNSZWNvcmQsIGlzUm9vdCwgaXNhZ2dyZWdhdGVHcm91cCxcbiAgaXNJbmRleCwgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxufSBmcm9tICcuL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBldmVudHNMaXN0IH0gZnJvbSAnLi4vY29tbW9uL2V2ZW50cyc7XG5pbXBvcnQgeyB2YWxpZGF0ZUFsbEZpZWxkcyB9IGZyb20gJy4vZmllbGRzJztcbmltcG9ydCB7XG4gIGFwcGx5UnVsZVNldCwgbWFrZXJ1bGUsIHN0cmluZ05vdEVtcHR5LFxuICB2YWxpZGF0aW9uRXJyb3IsXG59IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcbmltcG9ydCB7IGluZGV4UnVsZVNldCB9IGZyb20gJy4vaW5kZXhlcyc7XG5pbXBvcnQgeyB2YWxpZGF0ZUFsbEFnZ3JlZ2F0ZXMgfSBmcm9tICcuL3ZhbGlkYXRlQWdncmVnYXRlJztcblxuZXhwb3J0IGNvbnN0IHJ1bGVTZXQgPSAoLi4uc2V0cykgPT4gY29uc3RhbnQoZmxhdHRlbihbLi4uc2V0c10pKTtcblxuY29uc3QgY29tbW9uUnVsZXMgPSBbXG4gIG1ha2VydWxlKCduYW1lJywgJ25vZGUgbmFtZSBpcyBub3Qgc2V0JyxcbiAgICBub2RlID0+IHN0cmluZ05vdEVtcHR5KG5vZGUubmFtZSkpLFxuICBtYWtlcnVsZSgndHlwZScsICdub2RlIHR5cGUgbm90IHJlY29nbmlzZWQnLFxuICAgIGFueVRydWUoaXNSZWNvcmQsIGlzUm9vdCwgaXNJbmRleCwgaXNhZ2dyZWdhdGVHcm91cCkpLFxuXTtcblxuY29uc3QgcmVjb3JkUnVsZXMgPSBbXG4gIG1ha2VydWxlKCdmaWVsZHMnLCAnbm8gZmllbGRzIGhhdmUgYmVlbiBhZGRlZCB0byB0aGUgcmVjb3JkJyxcbiAgICBub2RlID0+IGlzTm9uRW1wdHlBcnJheShub2RlLmZpZWxkcykpLFxuICBtYWtlcnVsZSgndmFsaWRhdGlvblJ1bGVzJywgXCJ2YWxpZGF0aW9uIHJ1bGUgaXMgbWlzc2luZyBhICdtZXNzYWdlV2hlblZhbGlkJyBtZW1iZXJcIixcbiAgICBub2RlID0+IGV2ZXJ5KHIgPT4gaGFzKHIsICdtZXNzYWdlV2hlbkludmFsaWQnKSkobm9kZS52YWxpZGF0aW9uUnVsZXMpKSxcbiAgbWFrZXJ1bGUoJ3ZhbGlkYXRpb25SdWxlcycsIFwidmFsaWRhdGlvbiBydWxlIGlzIG1pc3NpbmcgYSAnZXhwcmVzc2lvbldoZW5WYWxpZCcgbWVtYmVyXCIsXG4gICAgbm9kZSA9PiBldmVyeShyID0+IGhhcyhyLCAnZXhwcmVzc2lvbldoZW5WYWxpZCcpKShub2RlLnZhbGlkYXRpb25SdWxlcykpLFxuXTtcblxuXG5jb25zdCBhZ2dyZWdhdGVHcm91cFJ1bGVzID0gW1xuICBtYWtlcnVsZSgnY29uZGl0aW9uJywgJ2NvbmRpdGlvbiBkb2VzIG5vdCBjb21waWxlJyxcbiAgICBhID0+IGlzRW1wdHkoYS5jb25kaXRpb24pXG4gICAgICAgICAgICAgfHwgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uKFxuICAgICAgICAgICAgICAgKCkgPT4gY29tcGlsZUV4cHJlc3Npb24oYS5jb25kaXRpb24pLFxuICAgICAgICAgICAgICkpLFxuXTtcblxuY29uc3QgZ2V0UnVsZVNldCA9IG5vZGUgPT4gc3dpdGNoQ2FzZShcblxuICBbaXNSZWNvcmQsIHJ1bGVTZXQoXG4gICAgY29tbW9uUnVsZXMsXG4gICAgcmVjb3JkUnVsZXMsXG4gICldLFxuXG4gIFtpc0luZGV4LCBydWxlU2V0KFxuICAgIGNvbW1vblJ1bGVzLFxuICAgIGluZGV4UnVsZVNldCxcbiAgKV0sXG5cbiAgW2lzYWdncmVnYXRlR3JvdXAsIHJ1bGVTZXQoXG4gICAgY29tbW9uUnVsZXMsXG4gICAgYWdncmVnYXRlR3JvdXBSdWxlcyxcbiAgKV0sXG5cbiAgW2RlZmF1bHRDYXNlLCBydWxlU2V0KGNvbW1vblJ1bGVzLCBbXSldLFxuKShub2RlKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlTm9kZSA9IG5vZGUgPT4gYXBwbHlSdWxlU2V0KGdldFJ1bGVTZXQobm9kZSkpKG5vZGUpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBbGwgPSAoYXBwSGllcmFyY2h5KSA9PiB7XG4gIGNvbnN0IGZsYXR0ZW5lZCA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShcbiAgICBhcHBIaWVyYXJjaHksXG4gICk7XG5cbiAgY29uc3QgZHVwbGljYXRlTmFtZVJ1bGUgPSBtYWtlcnVsZShcbiAgICAnbmFtZScsICdub2RlIG5hbWVzIG11c3QgYmUgdW5pcXVlIHVuZGVyIHNoYXJlZCBwYXJlbnQnLFxuICAgIG4gPT4gZmlsdGVyKGYgPT4gZi5wYXJlbnQoKSA9PT0gbi5wYXJlbnQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBmLm5hbWUgPT09IG4ubmFtZSkoZmxhdHRlbmVkKS5sZW5ndGggPT09IDEsXG4gICk7XG5cbiAgY29uc3QgZHVwbGljYXRlTm9kZUtleUVycm9ycyA9ICQoZmxhdHRlbmVkLCBbXG4gICAgbWFwKG4gPT4gYXBwbHlSdWxlU2V0KFtkdXBsaWNhdGVOYW1lUnVsZV0pKG4pKSxcbiAgICBmaWx0ZXIoaXNTb21ldGhpbmcpLFxuICAgIGZsYXR0ZW4sXG4gIF0pO1xuXG4gIGNvbnN0IGZpZWxkRXJyb3JzID0gJChmbGF0dGVuZWQsIFtcbiAgICBmaWx0ZXIoaXNSZWNvcmQpLFxuICAgIG1hcCh2YWxpZGF0ZUFsbEZpZWxkcyksXG4gICAgZmxhdHRlbixcbiAgXSk7XG5cbiAgY29uc3QgYWdncmVnYXRlRXJyb3JzID0gJChmbGF0dGVuZWQsIFtcbiAgICBmaWx0ZXIoaXNhZ2dyZWdhdGVHcm91cCksXG4gICAgbWFwKHMgPT4gdmFsaWRhdGVBbGxBZ2dyZWdhdGVzKFxuICAgICAgcy5hZ2dyZWdhdGVzLFxuICAgICkpLFxuICAgIGZsYXR0ZW4sXG4gIF0pO1xuXG4gIHJldHVybiAkKGZsYXR0ZW5lZCwgW1xuICAgIG1hcCh2YWxpZGF0ZU5vZGUpLFxuICAgIGZsYXR0ZW4sXG4gICAgdW5pb24oZHVwbGljYXRlTm9kZUtleUVycm9ycyksXG4gICAgdW5pb24oZmllbGRFcnJvcnMpLFxuICAgIHVuaW9uKGFnZ3JlZ2F0ZUVycm9ycyksXG4gIF0pO1xufTtcblxuY29uc3QgYWN0aW9uUnVsZXMgPSBbXG4gIG1ha2VydWxlKCduYW1lJywgJ2FjdGlvbiBtdXN0IGhhdmUgYSBuYW1lJyxcbiAgICBhID0+IGlzTm9uRW1wdHlTdHJpbmcoYS5uYW1lKSksXG4gIG1ha2VydWxlKCdiZWhhdmlvdXJOYW1lJywgJ211c3Qgc3VwcGx5IGEgYmVoYXZpb3VyIG5hbWUgdG8gdGhlIGFjdGlvbicsXG4gICAgYSA9PiBpc05vbkVtcHR5U3RyaW5nKGEuYmVoYXZpb3VyTmFtZSkpLFxuICBtYWtlcnVsZSgnYmVoYXZpb3VyU291cmNlJywgJ211c3Qgc3VwcGx5IGEgYmVoYXZpb3VyIHNvdXJjZSBmb3IgdGhlIGFjdGlvbicsXG4gICAgYSA9PiBpc05vbkVtcHR5U3RyaW5nKGEuYmVoYXZpb3VyU291cmNlKSksXG5dO1xuXG5jb25zdCBkdXBsaWNhdGVBY3Rpb25SdWxlID0gbWFrZXJ1bGUoJycsICdhY3Rpb24gbmFtZSBtdXN0IGJlIHVuaXF1ZScsICgpID0+IHt9KTtcblxuY29uc3QgdmFsaWRhdGVBY3Rpb24gPSBhY3Rpb24gPT4gYXBwbHlSdWxlU2V0KGFjdGlvblJ1bGVzKShhY3Rpb24pO1xuXG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFjdGlvbnMgPSAoYWxsQWN0aW9ucykgPT4ge1xuICBjb25zdCBkdXBsaWNhdGVBY3Rpb25zID0gJChhbGxBY3Rpb25zLCBbXG4gICAgZmlsdGVyKGEgPT4gZmlsdGVyKGEyID0+IGEyLm5hbWUgPT09IGEubmFtZSkoYWxsQWN0aW9ucykubGVuZ3RoID4gMSksXG4gICAgbWFwKGEgPT4gdmFsaWRhdGlvbkVycm9yKGR1cGxpY2F0ZUFjdGlvblJ1bGUsIGEpKSxcbiAgXSk7XG5cbiAgY29uc3QgZXJyb3JzID0gJChhbGxBY3Rpb25zLCBbXG4gICAgbWFwKHZhbGlkYXRlQWN0aW9uKSxcbiAgICBmbGF0dGVuLFxuICAgIHVuaW9uKGR1cGxpY2F0ZUFjdGlvbnMpLFxuICAgIHVuaXFCeSgnbmFtZScpLFxuICBdKTtcblxuICByZXR1cm4gZXJyb3JzO1xufTtcblxuY29uc3QgdHJpZ2dlclJ1bGVzID0gYWN0aW9ucyA9PiAoW1xuICBtYWtlcnVsZSgnYWN0aW9uTmFtZScsICdtdXN0IHNwZWNpZnkgYW4gYWN0aW9uJyxcbiAgICB0ID0+IGlzTm9uRW1wdHlTdHJpbmcodC5hY3Rpb25OYW1lKSksXG4gIG1ha2VydWxlKCdldmVudE5hbWUnLCAnbXVzdCBzcGVjaWZ5IGFuZCBldmVudCcsXG4gICAgdCA9PiBpc05vbkVtcHR5U3RyaW5nKHQuZXZlbnROYW1lKSksXG4gIG1ha2VydWxlKCdhY3Rpb25OYW1lJywgJ3NwZWNpZmllZCBhY3Rpb24gbm90IHN1cHBsaWVkJyxcbiAgICB0ID0+ICF0LmFjdGlvbk5hbWVcbiAgICAgICAgICAgICB8fCBzb21lKGEgPT4gYS5uYW1lID09PSB0LmFjdGlvbk5hbWUpKGFjdGlvbnMpKSxcbiAgbWFrZXJ1bGUoJ2V2ZW50TmFtZScsICdpbnZhbGlkIEV2ZW50IE5hbWUnLFxuICAgIHQgPT4gIXQuZXZlbnROYW1lXG4gICAgICAgICAgICAgfHwgaW5jbHVkZXModC5ldmVudE5hbWUpKGV2ZW50c0xpc3QpKSxcbiAgbWFrZXJ1bGUoJ29wdGlvbnNDcmVhdG9yJywgJ09wdGlvbnMgQ3JlYXRvciBkb2VzIG5vdCBjb21waWxlIC0gY2hlY2sgeW91ciBleHByZXNzaW9uJyxcbiAgICAodCkgPT4ge1xuICAgICAgaWYgKCF0Lm9wdGlvbnNDcmVhdG9yKSByZXR1cm4gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbXBpbGVDb2RlKHQub3B0aW9uc0NyZWF0b3IpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKF8pIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfSksXG4gIG1ha2VydWxlKCdjb25kaXRpb24nLCAnVHJpZ2dlciBjb25kaXRpb24gZG9lcyBub3QgY29tcGlsZSAtIGNoZWNrIHlvdXIgZXhwcmVzc2lvbicsXG4gICAgKHQpID0+IHtcbiAgICAgIGlmICghdC5jb25kaXRpb24pIHJldHVybiB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29tcGlsZUV4cHJlc3Npb24odC5jb25kaXRpb24pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKF8pIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfSksXG5dKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVHJpZ2dlciA9ICh0cmlnZ2VyLCBhbGxBY3Rpb25zKSA9PiB7XG4gIGNvbnN0IGVycm9ycyA9IGFwcGx5UnVsZVNldCh0cmlnZ2VyUnVsZXMoYWxsQWN0aW9ucykpKHRyaWdnZXIpO1xuXG4gIHJldHVybiBlcnJvcnM7XG59O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVUcmlnZ2VycyA9ICh0cmlnZ2VycywgYWxsQWN0aW9ucykgPT4gJCh0cmlnZ2VycywgW1xuICBtYXAodCA9PiB2YWxpZGF0ZVRyaWdnZXIodCwgYWxsQWN0aW9ucykpLFxuICBmbGF0dGVuLFxuXSk7XG4iLCJpbXBvcnQgeyBhcHBEZWZpbml0aW9uRmlsZSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBjb25zdHJ1Y3RIaWVyYXJjaHkgfSBmcm9tICcuL2NyZWF0ZU5vZGVzJztcblxuZXhwb3J0IGNvbnN0IGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbiA9IGRhdGFzdG9yZSA9PiBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGRhdGFzdG9yZS5leGlzdHMoYXBwRGVmaW5pdGlvbkZpbGUpO1xuXG4gIGlmICghZXhpc3RzKSB0aHJvdyBuZXcgRXJyb3IoJ0FwcGxpY2F0aW9uIGRlZmluaXRpb24gZG9lcyBub3QgZXhpc3QnKTtcblxuICBjb25zdCBhcHBEZWZpbml0aW9uID0gYXdhaXQgZGF0YXN0b3JlLmxvYWRKc29uKGFwcERlZmluaXRpb25GaWxlKTtcbiAgYXBwRGVmaW5pdGlvbi5oaWVyYXJjaHkgPSBjb25zdHJ1Y3RIaWVyYXJjaHkoXG4gICAgYXBwRGVmaW5pdGlvbi5oaWVyYXJjaHksXG4gICk7XG4gIHJldHVybiBhcHBEZWZpbml0aW9uO1xufTtcbiIsImltcG9ydCB7IGpvaW4gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgYXBwRGVmaW5pdGlvbkZpbGUgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgdmFsaWRhdGVBbGwgfSBmcm9tICcuL3ZhbGlkYXRlJztcbmltcG9ydCB7IGFwaVdyYXBwZXIgfSBmcm9tICcuLi9jb21tb24vYXBpV3JhcHBlcic7XG5pbXBvcnQgeyBldmVudHMgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcblxuZXhwb3J0IGNvbnN0IHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSA9IGFwcCA9PiBhc3luYyBoaWVyYXJjaHkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMudGVtcGxhdGVBcGkuc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5LFxuICBwZXJtaXNzaW9uLndyaXRlVGVtcGxhdGVzLmlzQXV0aG9yaXplZCxcbiAgeyBoaWVyYXJjaHkgfSxcbiAgX3NhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSwgYXBwLmRhdGFzdG9yZSwgaGllcmFyY2h5LFxuKTtcblxuXG5leHBvcnQgY29uc3QgX3NhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSA9IGFzeW5jIChkYXRhc3RvcmUsIGhpZXJhcmNoeSkgPT4ge1xuICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gYXdhaXQgdmFsaWRhdGVBbGwoaGllcmFyY2h5KTtcbiAgaWYgKHZhbGlkYXRpb25FcnJvcnMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSGllcmFyY2h5IGlzIGludmFsaWQ6ICR7am9pbihcbiAgICAgIHZhbGlkYXRpb25FcnJvcnMubWFwKGUgPT4gYCR7ZS5pdGVtLm5vZGVLZXkgPyBlLml0ZW0ubm9kZUtleSgpIDogJyd9IDogJHtlLmVycm9yfWApLFxuICAgICAgJywnLFxuICAgICl9YCk7XG4gIH1cblxuICBpZiAoYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhhcHBEZWZpbml0aW9uRmlsZSkpIHtcbiAgICBjb25zdCBhcHBEZWZpbml0aW9uID0gYXdhaXQgZGF0YXN0b3JlLmxvYWRKc29uKGFwcERlZmluaXRpb25GaWxlKTtcbiAgICBhcHBEZWZpbml0aW9uLmhpZXJhcmNoeSA9IGhpZXJhcmNoeTtcbiAgICBhd2FpdCBkYXRhc3RvcmUudXBkYXRlSnNvbihhcHBEZWZpbml0aW9uRmlsZSwgYXBwRGVmaW5pdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcignLy5jb25maWcnKTtcbiAgICBjb25zdCBhcHBEZWZpbml0aW9uID0geyBhY3Rpb25zOiBbXSwgdHJpZ2dlcnM6IFtdLCBoaWVyYXJjaHkgfTtcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlSnNvbihhcHBEZWZpbml0aW9uRmlsZSwgYXBwRGVmaW5pdGlvbik7XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBqb2luIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBhcHBEZWZpbml0aW9uRmlsZSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyB2YWxpZGF0ZVRyaWdnZXJzLCB2YWxpZGF0ZUFjdGlvbnMgfSBmcm9tICcuL3ZhbGlkYXRlJztcbmltcG9ydCB7IGFwaVdyYXBwZXIgfSBmcm9tICcuLi9jb21tb24vYXBpV3JhcHBlcic7XG5pbXBvcnQgeyBldmVudHMgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3Qgc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycyA9IGFwcCA9PiBhc3luYyAoYWN0aW9ucywgdHJpZ2dlcnMpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLnRlbXBsYXRlQXBpLnNhdmVBY3Rpb25zQW5kVHJpZ2dlcnMsXG4gIHBlcm1pc3Npb24ud3JpdGVUZW1wbGF0ZXMuaXNBdXRob3JpemVkLFxuICB7IGFjdGlvbnMsIHRyaWdnZXJzIH0sXG4gIF9zYXZlQWN0aW9uc0FuZFRyaWdnZXJzLCBhcHAuZGF0YXN0b3JlLCBhY3Rpb25zLCB0cmlnZ2Vycyxcbik7XG5cbmV4cG9ydCBjb25zdCBfc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycyA9IGFzeW5jIChkYXRhc3RvcmUsIGFjdGlvbnMsIHRyaWdnZXJzKSA9PiB7XG4gIGlmIChhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGFwcERlZmluaXRpb25GaWxlKSkge1xuICAgIGNvbnN0IGFwcERlZmluaXRpb24gPSBhd2FpdCBkYXRhc3RvcmUubG9hZEpzb24oYXBwRGVmaW5pdGlvbkZpbGUpO1xuICAgIGFwcERlZmluaXRpb24uYWN0aW9ucyA9IGFjdGlvbnM7XG4gICAgYXBwRGVmaW5pdGlvbi50cmlnZ2VycyA9IHRyaWdnZXJzO1xuXG4gICAgY29uc3QgYWN0aW9uVmFsaWRFcnJzID0gbWFwKGUgPT4gZS5lcnJvcikodmFsaWRhdGVBY3Rpb25zKGFjdGlvbnMpKTtcblxuICAgIGlmIChhY3Rpb25WYWxpZEVycnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgQWN0aW9ucyBhcmUgaW52YWxpZDogJHtqb2luKGFjdGlvblZhbGlkRXJycywgJywgJyl9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgdHJpZ2dlclZhbGlkRXJycyA9IG1hcChlID0+IGUuZXJyb3IpKHZhbGlkYXRlVHJpZ2dlcnModHJpZ2dlcnMsIGFjdGlvbnMpKTtcblxuICAgIGlmICh0cmlnZ2VyVmFsaWRFcnJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYFRyaWdnZXJzIGFyZSBpbnZhbGlkOiAke2pvaW4odHJpZ2dlclZhbGlkRXJycywgJywgJyl9YCk7XG4gICAgfVxuXG4gICAgYXdhaXQgZGF0YXN0b3JlLnVwZGF0ZUpzb24oYXBwRGVmaW5pdGlvbkZpbGUsIGFwcERlZmluaXRpb24pO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ0Nhbm5vdCBzYXZlIGFjdGlvbnM6IEFwcGxpY2F0aW9uIGRlZmluaXRpb24gZG9lcyBub3QgZXhpc3QnKTtcbiAgfVxufTtcbiIsIlxuZXhwb3J0IGNvbnN0IGdldEJlaGF2aW91clNvdXJjZXMgPSBhc3luYyAoZGF0YXN0b3JlKSA9PiB7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmxvYWRGaWxlKCcvLmNvbmZpZy9iZWhhdmlvdXJTb3VyY2VzLmpzJyk7XG59O1xuIiwiaW1wb3J0IHtcbiAgZ2V0TmV3Um9vdExldmVsLFxuICBnZXROZXdSZWNvcmRUZW1wbGF0ZSwgZ2V0TmV3SW5kZXhUZW1wbGF0ZSxcbiAgY3JlYXRlTm9kZUVycm9ycywgY29uc3RydWN0SGllcmFyY2h5LFxuICBnZXROZXdBZ2dyZWdhdGVHcm91cFRlbXBsYXRlLCBnZXROZXdTaW5nbGVSZWNvcmRUZW1wbGF0ZSxcbiAgZ2V0TmV3QWdncmVnYXRlVGVtcGxhdGUsIGNvbnN0cnVjdE5vZGUsXG59XG4gIGZyb20gJy4vY3JlYXRlTm9kZXMnO1xuaW1wb3J0IHtcbiAgZ2V0TmV3RmllbGQsIHZhbGlkYXRlRmllbGQsXG4gIGFkZEZpZWxkLCBmaWVsZEVycm9ycyxcbn0gZnJvbSAnLi9maWVsZHMnO1xuaW1wb3J0IHtcbiAgZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUsIGNvbW1vblJlY29yZFZhbGlkYXRpb25SdWxlcyxcbiAgYWRkUmVjb3JkVmFsaWRhdGlvblJ1bGUsXG59IGZyb20gJy4vcmVjb3JkVmFsaWRhdGlvblJ1bGVzJztcbmltcG9ydCB7IGNyZWF0ZUFjdGlvbiwgY3JlYXRlVHJpZ2dlciB9IGZyb20gJy4vY3JlYXRlQWN0aW9ucyc7XG5pbXBvcnQge1xuICB2YWxpZGF0ZVRyaWdnZXJzLCB2YWxpZGF0ZVRyaWdnZXIsIHZhbGlkYXRlTm9kZSxcbiAgdmFsaWRhdGVBY3Rpb25zLCB2YWxpZGF0ZUFsbCxcbn0gZnJvbSAnLi92YWxpZGF0ZSc7XG5pbXBvcnQgeyBnZXRBcHBsaWNhdGlvbkRlZmluaXRpb24gfSBmcm9tICcuL2dldEFwcGxpY2F0aW9uRGVmaW5pdGlvbic7XG5pbXBvcnQgeyBzYXZlQXBwbGljYXRpb25IaWVyYXJjaHkgfSBmcm9tICcuL3NhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSc7XG5pbXBvcnQgeyBzYXZlQWN0aW9uc0FuZFRyaWdnZXJzIH0gZnJvbSAnLi9zYXZlQWN0aW9uc0FuZFRyaWdnZXJzJztcbmltcG9ydCB7IGFsbCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGdldEJlaGF2aW91clNvdXJjZXMgfSBmcm9tIFwiLi9nZXRCZWhhdmlvdXJTb3VyY2VzXCI7XG5cbmNvbnN0IGFwaSA9IGFwcCA9PiAoe1xuXG4gIGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbjogZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uKGFwcC5kYXRhc3RvcmUpLFxuICBzYXZlQXBwbGljYXRpb25IaWVyYXJjaHk6IHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeShhcHApLFxuICBzYXZlQWN0aW9uc0FuZFRyaWdnZXJzOiBzYXZlQWN0aW9uc0FuZFRyaWdnZXJzKGFwcCksXG4gIGdldEJlaGF2aW91clNvdXJjZXM6ICgpID0+IGdldEJlaGF2aW91clNvdXJjZXMoYXBwLmRhdGFzdG9yZSksXG4gIGdldE5ld1Jvb3RMZXZlbCxcbiAgY29uc3RydWN0Tm9kZSxcbiAgZ2V0TmV3SW5kZXhUZW1wbGF0ZSxcbiAgZ2V0TmV3UmVjb3JkVGVtcGxhdGUsXG4gIGdldE5ld0ZpZWxkLFxuICB2YWxpZGF0ZUZpZWxkLFxuICBhZGRGaWVsZCxcbiAgZmllbGRFcnJvcnMsXG4gIGdldE5ld1JlY29yZFZhbGlkYXRpb25SdWxlLFxuICBjb21tb25SZWNvcmRWYWxpZGF0aW9uUnVsZXMsXG4gIGFkZFJlY29yZFZhbGlkYXRpb25SdWxlLFxuICBjcmVhdGVBY3Rpb24sXG4gIGNyZWF0ZVRyaWdnZXIsXG4gIHZhbGlkYXRlQWN0aW9ucyxcbiAgdmFsaWRhdGVUcmlnZ2VyLFxuICBnZXROZXdBZ2dyZWdhdGVHcm91cFRlbXBsYXRlLFxuICBnZXROZXdBZ2dyZWdhdGVUZW1wbGF0ZSxcbiAgY29uc3RydWN0SGllcmFyY2h5LFxuICBnZXROZXdTaW5nbGVSZWNvcmRUZW1wbGF0ZSxcbiAgYWxsVHlwZXM6IGFsbCxcbiAgdmFsaWRhdGVOb2RlLFxuICB2YWxpZGF0ZUFsbCxcbiAgdmFsaWRhdGVUcmlnZ2Vycyxcbn0pO1xuXG5cbmV4cG9ydCBjb25zdCBnZXRUZW1wbGF0ZUFwaSA9IGFwcCA9PiBhcGkoYXBwKTtcblxuZXhwb3J0IGNvbnN0IGVycm9ycyA9IGNyZWF0ZU5vZGVFcnJvcnM7XG5cbmV4cG9ydCBkZWZhdWx0IGdldFRlbXBsYXRlQXBpO1xuIiwiaW1wb3J0IHsgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIFVTRVJTX0xJU1RfRklMRSxcbiAgc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZixcbn0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7ICQsIGFwaVdyYXBwZXIsIGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBnZXRVc2VycyA9IGFwcCA9PiBhc3luYyAoKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmdldFVzZXJzLFxuICBwZXJtaXNzaW9uLmxpc3RVc2Vycy5pc0F1dGhvcml6ZWQsXG4gIHt9LFxuICBfZ2V0VXNlcnMsIGFwcCxcbik7XG5cbmV4cG9ydCBjb25zdCBfZ2V0VXNlcnMgPSBhc3luYyBhcHAgPT4gJChhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSksIFtcbiAgbWFwKHN0cmlwVXNlck9mU2Vuc2l0aXZlU3R1ZmYpLFxuXSk7XG4iLCJpbXBvcnQgeyBBQ0NFU1NfTEVWRUxTX0ZJTEUgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgYXBpV3JhcHBlciwgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGxvYWRBY2Nlc3NMZXZlbHMgPSBhcHAgPT4gYXN5bmMgKCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5sb2FkQWNjZXNzTGV2ZWxzLFxuICBwZXJtaXNzaW9uLmxpc3RBY2Nlc3NMZXZlbHMuaXNBdXRob3JpemVkLFxuICB7fSxcbiAgX2xvYWRBY2Nlc3NMZXZlbHMsIGFwcCxcbik7XG5cbmV4cG9ydCBjb25zdCBfbG9hZEFjY2Vzc0xldmVscyA9IGFzeW5jIGFwcCA9PiBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKEFDQ0VTU19MRVZFTFNfRklMRSk7XG4iLCJpbXBvcnQge1xuICBmaW5kLCBmaWx0ZXIsIHNvbWUsXG4gIG1hcCwgZmxhdHRlbixcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnc2hvcnRpZCc7XG5pbXBvcnQgeyBfZ2V0VXNlcnMgfSBmcm9tICcuL2dldFVzZXJzJztcbmltcG9ydCB7XG4gIGdldFVzZXJCeU5hbWUsIHVzZXJBdXRoRmlsZSxcbiAgcGFyc2VUZW1wb3JhcnlDb2RlLFxufSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgX2xvYWRBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL2xvYWRBY2Nlc3NMZXZlbHMnO1xuaW1wb3J0IHtcbiAgaXNOb3RoaW5nT3JFbXB0eSwgJCwgYXBpV3JhcHBlciwgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5jb25zdCBkdW1teUhhc2ggPSAnJGFyZ29uMmkkdj0xOSRtPTQwOTYsdD0zLHA9MSRVWlJvNDA5VVlCR2pISlMzQ1Y2VXh3JHJVODRxVXFQZU9SRnpLWW1ZWTBjZUJMRGFQTytKV1NINFBmTmlLWGZJS2snO1xuXG5leHBvcnQgY29uc3QgYXV0aGVudGljYXRlID0gYXBwID0+IGFzeW5jICh1c2VybmFtZSwgcGFzc3dvcmQpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuYXV0aGVudGljYXRlLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHVzZXJuYW1lLCBwYXNzd29yZCB9LFxuICBfYXV0aGVudGljYXRlLCBhcHAsIHVzZXJuYW1lLCBwYXNzd29yZCxcbik7XG5cbmV4cG9ydCBjb25zdCBfYXV0aGVudGljYXRlID0gYXN5bmMgKGFwcCwgdXNlcm5hbWUsIHBhc3N3b3JkKSA9PiB7XG4gIGlmIChpc05vdGhpbmdPckVtcHR5KHVzZXJuYW1lKSB8fCBpc05vdGhpbmdPckVtcHR5KHBhc3N3b3JkKSkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIGNvbnN0IGFsbFVzZXJzID0gYXdhaXQgX2dldFVzZXJzKGFwcCk7XG4gIGxldCB1c2VyID0gZ2V0VXNlckJ5TmFtZShcbiAgICBhbGxVc2VycyxcbiAgICB1c2VybmFtZSxcbiAgKTtcblxuICBjb25zdCBub3RBVXNlciA9ICdub3QtYS11c2VyJztcbiAgLy8gY29udGludWUgd2l0aCBub24tdXNlciAtIHNvIHRpbWUgdG8gdmVyaWZ5IHJlbWFpbnMgY29uc2lzdGVudFxuICAvLyB3aXRoIHZlcmlmaWNhdGlvbiBvZiBhIHZhbGlkIHVzZXJcbiAgaWYgKCF1c2VyIHx8ICF1c2VyLmVuYWJsZWQpIHsgdXNlciA9IG5vdEFVc2VyOyB9XG5cbiAgbGV0IHVzZXJBdXRoO1xuICB0cnkge1xuICAgIHVzZXJBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICAgIHVzZXJBdXRoRmlsZSh1c2VybmFtZSksXG4gICAgKTtcbiAgfSBjYXRjaCAoXykge1xuICAgIHVzZXJBdXRoID0geyBhY2Nlc3NMZXZlbHM6IFtdLCBwYXNzd29yZEhhc2g6IGR1bW15SGFzaCB9O1xuICB9XG5cbiAgY29uc3QgcGVybWlzc2lvbnMgPSBhd2FpdCBidWlsZFVzZXJQZXJtaXNzaW9ucyhhcHAsIHVzZXIuYWNjZXNzTGV2ZWxzKTtcblxuICBjb25zdCB2ZXJpZmllZCA9IGF3YWl0IGFwcC5jcnlwdG8udmVyaWZ5KFxuICAgIHVzZXJBdXRoLnBhc3N3b3JkSGFzaCxcbiAgICBwYXNzd29yZCxcbiAgKTtcblxuICBpZiAodXNlciA9PT0gbm90QVVzZXIpIHsgcmV0dXJuIG51bGw7IH1cblxuICByZXR1cm4gdmVyaWZpZWRcbiAgICA/IHtcbiAgICAgIC4uLnVzZXIsIHBlcm1pc3Npb25zLCB0ZW1wOiBmYWxzZSwgaXNVc2VyOiB0cnVlLFxuICAgIH1cbiAgICA6IG51bGw7XG59O1xuXG5leHBvcnQgY29uc3QgYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzID0gYXBwID0+IGFzeW5jICh0ZW1wQWNjZXNzQ29kZSkgPT4ge1xuICBpZiAoaXNOb3RoaW5nT3JFbXB0eSh0ZW1wQWNjZXNzQ29kZSkpIHsgcmV0dXJuIG51bGw7IH1cblxuICBjb25zdCB0ZW1wID0gcGFyc2VUZW1wb3JhcnlDb2RlKHRlbXBBY2Nlc3NDb2RlKTtcbiAgbGV0IHVzZXIgPSAkKGF3YWl0IF9nZXRVc2VycyhhcHApLCBbXG4gICAgZmluZCh1ID0+IHUudGVtcG9yYXJ5QWNjZXNzSWQgPT09IHRlbXAuaWQpLFxuICBdKTtcblxuICBjb25zdCBub3RBVXNlciA9ICdub3QtYS11c2VyJztcbiAgaWYgKCF1c2VyIHx8ICF1c2VyLmVuYWJsZWQpIHsgdXNlciA9IG5vdEFVc2VyOyB9XG5cbiAgbGV0IHVzZXJBdXRoO1xuICB0cnkge1xuICAgIHVzZXJBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICAgIHVzZXJBdXRoRmlsZSh1c2VyLm5hbWUpLFxuICAgICk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB1c2VyQXV0aCA9IHtcbiAgICAgIHRlbXBvcmFyeUFjY2Vzc0hhc2g6IGR1bW15SGFzaCxcbiAgICAgIHRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoOiAoYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpICsgMTAwMDApLFxuICAgIH07XG4gIH1cblxuICBpZiAodXNlckF1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPCBhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCkpIHsgdXNlciA9IG5vdEFVc2VyOyB9XG5cbiAgY29uc3QgdGVtcENvZGUgPSAhdGVtcC5jb2RlID8gZ2VuZXJhdGUoKSA6IHRlbXAuY29kZTtcbiAgY29uc3QgdmVyaWZpZWQgPSBhd2FpdCBhcHAuY3J5cHRvLnZlcmlmeShcbiAgICB1c2VyQXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoLFxuICAgIHRlbXBDb2RlLFxuICApO1xuXG4gIGlmICh1c2VyID09PSBub3RBVXNlcikgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHJldHVybiB2ZXJpZmllZFxuICAgID8ge1xuICAgICAgLi4udXNlcixcbiAgICAgIHBlcm1pc3Npb25zOiBbXSxcbiAgICAgIHRlbXA6IHRydWUsXG4gICAgICBpc1VzZXI6IHRydWUsXG4gICAgfVxuICAgIDogbnVsbDtcbn07XG5cbmV4cG9ydCBjb25zdCBidWlsZFVzZXJQZXJtaXNzaW9ucyA9IGFzeW5jIChhcHAsIHVzZXJBY2Nlc3NMZXZlbHMpID0+IHtcbiAgY29uc3QgYWxsQWNjZXNzTGV2ZWxzID0gYXdhaXQgX2xvYWRBY2Nlc3NMZXZlbHMoYXBwKTtcblxuICByZXR1cm4gJChhbGxBY2Nlc3NMZXZlbHMubGV2ZWxzLCBbXG4gICAgZmlsdGVyKGwgPT4gc29tZSh1YSA9PiBsLm5hbWUgPT09IHVhKSh1c2VyQWNjZXNzTGV2ZWxzKSksXG4gICAgbWFwKGwgPT4gbC5wZXJtaXNzaW9ucyksXG4gICAgZmxhdHRlbixcbiAgXSk7XG59O1xuIiwiaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcbmltcG9ydCB7XG4gIHRlbXBDb2RlRXhwaXJ5TGVuZ3RoLCBVU0VSU19MT0NLX0ZJTEUsXG4gIFVTRVJTX0xJU1RfRklMRSwgdXNlckF1dGhGaWxlLFxuICBnZXRVc2VyQnlOYW1lLFxufSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHtcbiAgZ2V0TG9jaywgaXNOb2xvY2ssXG4gIHJlbGVhc2VMb2NrLFxufSBmcm9tICcuLi9jb21tb24vbG9jayc7XG5pbXBvcnQgeyBhcGlXcmFwcGVyLCBldmVudHMgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzID0gYXBwID0+IGFzeW5jIHVzZXJOYW1lID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuY3JlYXRlVGVtcG9yYXJ5QWNjZXNzLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHVzZXJOYW1lIH0sXG4gIF9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MsIGFwcCwgdXNlck5hbWUsXG4pO1xuXG5leHBvcnQgY29uc3QgX2NyZWF0ZVRlbXBvcmFyeUFjY2VzcyA9IGFzeW5jIChhcHAsIHVzZXJOYW1lKSA9PiB7XG4gIGNvbnN0IHRlbXBDb2RlID0gYXdhaXQgZ2V0VGVtcG9yYXJ5Q29kZShhcHApO1xuXG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRMb2NrKFxuICAgIGFwcCwgVVNFUlNfTE9DS19GSUxFLCAxMDAwLCAyLFxuICApO1xuXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBjcmVhdGUgdGVtcG9yYXJ5IGFjY2VzcywgY291bGQgbm90IGdldCBsb2NrIC0gdHJ5IGFnYWluJyk7IH1cblxuICB0cnkge1xuICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihVU0VSU19MSVNUX0ZJTEUpO1xuXG4gICAgY29uc3QgdXNlciA9IGdldFVzZXJCeU5hbWUodXNlcnMsIHVzZXJOYW1lKTtcbiAgICB1c2VyLnRlbXBvcmFyeUFjY2Vzc0lkID0gdGVtcENvZGUudGVtcG9yYXJ5QWNjZXNzSWQ7XG5cbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgICBVU0VSU19MSVNUX0ZJTEUsXG4gICAgICB1c2VycyxcbiAgICApO1xuICB9IGZpbmFsbHkge1xuICAgIGF3YWl0IHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XG4gIH1cblxuICBjb25zdCB1c2VyQXV0aCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgdXNlckF1dGhGaWxlKHVzZXJOYW1lKSxcbiAgKTtcbiAgdXNlckF1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaCA9IHRlbXBDb2RlLnRlbXBvcmFyeUFjY2Vzc0hhc2g7XG5cbiAgdXNlckF1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPSB0ZW1wQ29kZS50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaDtcblxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgdXNlckF1dGhGaWxlKHVzZXJOYW1lKSxcbiAgICB1c2VyQXV0aCxcbiAgKTtcblxuICByZXR1cm4gdGVtcENvZGUudGVtcENvZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VGVtcG9yYXJ5Q29kZSA9IGFzeW5jIChhcHApID0+IHtcbiAgY29uc3QgdGVtcENvZGUgPSBnZW5lcmF0ZSgpXG4gICAgICAgICsgZ2VuZXJhdGUoKVxuICAgICAgICArIGdlbmVyYXRlKClcbiAgICAgICAgKyBnZW5lcmF0ZSgpO1xuXG4gIGNvbnN0IHRlbXBJZCA9IGdlbmVyYXRlKCk7XG5cbiAgcmV0dXJuIHtcbiAgICB0ZW1wb3JhcnlBY2Nlc3NIYXNoOiBhd2FpdCBhcHAuY3J5cHRvLmhhc2goXG4gICAgICB0ZW1wQ29kZSxcbiAgICApLFxuICAgIHRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoOlxuICAgICAgICAgICAgKGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKSkgKyB0ZW1wQ29kZUV4cGlyeUxlbmd0aCxcbiAgICB0ZW1wQ29kZTogYHRtcDoke3RlbXBJZH06JHt0ZW1wQ29kZX1gLFxuICAgIHRlbXBvcmFyeUFjY2Vzc0lkOiB0ZW1wSWQsXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgbG9va3NMaWtlVGVtcG9yYXJ5Q29kZSA9IGNvZGUgPT4gY29kZS5zdGFydHNXaXRoKCd0bXA6Jyk7XG4iLCJpbXBvcnQge1xuICBtYXAsIHVuaXFXaXRoLFxuICBmbGF0dGVuLCBmaWx0ZXIsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHtcbiAgJCwgaW5zZW5zaXRpdmVFcXVhbHMsIGFwaVdyYXBwZXIsIGV2ZW50cyxcbiAgaXNOb25FbXB0eVN0cmluZywgYWxsLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5jb25zdCB1c2VyUnVsZXMgPSBhbGxVc2VycyA9PiBbXG4gIG1ha2VydWxlKCduYW1lJywgJ3VzZXJuYW1lIG11c3QgYmUgc2V0JyxcbiAgICB1ID0+IGlzTm9uRW1wdHlTdHJpbmcodS5uYW1lKSksXG4gIG1ha2VydWxlKCdhY2Nlc3NMZXZlbHMnLCAndXNlciBtdXN0IGhhdmUgYXQgbGVhc3Qgb25lIGFjY2VzcyBsZXZlbCcsXG4gICAgdSA9PiB1LmFjY2Vzc0xldmVscy5sZW5ndGggPiAwKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAndXNlcm5hbWUgbXVzdCBiZSB1bmlxdWUnLFxuICAgIHUgPT4gZmlsdGVyKHUyID0+IGluc2Vuc2l0aXZlRXF1YWxzKHUyLm5hbWUsIHUubmFtZSkpKGFsbFVzZXJzKS5sZW5ndGggPT09IDEpLFxuICBtYWtlcnVsZSgnYWNjZXNzTGV2ZWxzJywgJ2FjY2VzcyBsZXZlbHMgbXVzdCBvbmx5IGNvbnRhaW4gc3RpbmdzJyxcbiAgICB1ID0+IGFsbChpc05vbkVtcHR5U3RyaW5nKSh1LmFjY2Vzc0xldmVscykpLFxuXTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVXNlciA9ICgpID0+IChhbGx1c2VycywgdXNlcikgPT4gYXBwbHlSdWxlU2V0KHVzZXJSdWxlcyhhbGx1c2VycykpKHVzZXIpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVVc2VycyA9IGFwcCA9PiBhbGxVc2VycyA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLnZhbGlkYXRlVXNlcnMsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgYWxsVXNlcnMgfSxcbiAgX3ZhbGlkYXRlVXNlcnMsIGFwcCwgYWxsVXNlcnMsXG4pO1xuXG5leHBvcnQgY29uc3QgX3ZhbGlkYXRlVXNlcnMgPSAoYXBwLCBhbGxVc2VycykgPT4gJChhbGxVc2VycywgW1xuICBtYXAobCA9PiB2YWxpZGF0ZVVzZXIoYXBwKShhbGxVc2VycywgbCkpLFxuICBmbGF0dGVuLFxuICB1bmlxV2l0aCgoeCwgeSkgPT4geC5maWVsZCA9PT0geS5maWVsZFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgeC5pdGVtID09PSB5Lml0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHguZXJyb3IgPT09IHkuZXJyb3IpLFxuXSk7XG4iLCJpbXBvcnQgeyBhcGlXcmFwcGVyU3luYywgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGdldE5ld1VzZXIgPSBhcHAgPT4gKCkgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuZ2V0TmV3VXNlcixcbiAgcGVybWlzc2lvbi5jcmVhdGVVc2VyLmlzQXV0aG9yaXplZCxcbiAge30sXG4gIF9nZXROZXdVc2VyLCBhcHAsXG4pO1xuXG5leHBvcnQgY29uc3QgX2dldE5ld1VzZXIgPSAoKSA9PiAoe1xuICBuYW1lOiAnJyxcbiAgYWNjZXNzTGV2ZWxzOiBbXSxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgdGVtcG9yYXJ5QWNjZXNzSWQ6ICcnLFxufSk7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdVc2VyQXV0aCA9IGFwcCA9PiAoKSA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5nZXROZXdVc2VyQXV0aCxcbiAgcGVybWlzc2lvbi5jcmVhdGVVc2VyLmlzQXV0aG9yaXplZCxcbiAge30sXG4gIF9nZXROZXdVc2VyQXV0aCwgYXBwLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9nZXROZXdVc2VyQXV0aCA9ICgpID0+ICh7XG4gIHBhc3N3b3JkSGFzaDogJycsXG4gIHRlbXBvcmFyeUFjY2Vzc0hhc2g6ICcnLFxuICB0ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaDogMCxcbn0pO1xuIiwiaW1wb3J0IHsgZmluZCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyB1c2VyQXV0aEZpbGUsIHBhcnNlVGVtcG9yYXJ5Q29kZSB9IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQge1xuICBpc1NvbWV0aGluZywgJCwgYXBpV3JhcHBlciwgYXBpV3JhcHBlclN5bmMsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IF9nZXRVc2VycyB9IGZyb20gJy4vZ2V0VXNlcnMnO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgaXNWYWxpZFBhc3N3b3JkID0gYXBwID0+IHBhc3N3b3JkID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmlzVmFsaWRQYXNzd29yZCxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyBwYXNzd29yZCB9LFxuICBfaXNWYWxpZFBhc3N3b3JkLCBhcHAsIHBhc3N3b3JkLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9pc1ZhbGlkUGFzc3dvcmQgPSAoYXBwLCBwYXNzd29yZCkgPT4gc2NvcmVQYXNzd29yZChwYXNzd29yZCkuc2NvcmUgPiAzMDtcblxuZXhwb3J0IGNvbnN0IGNoYW5nZU15UGFzc3dvcmQgPSBhcHAgPT4gYXN5bmMgKGN1cnJlbnRQdywgbmV3cGFzc3dvcmQpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuY2hhbmdlTXlQYXNzd29yZCxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyBjdXJyZW50UHcsIG5ld3Bhc3N3b3JkIH0sXG4gIF9jaGFuZ2VNeVBhc3N3b3JkLCBhcHAsIGN1cnJlbnRQdywgbmV3cGFzc3dvcmQsXG4pO1xuXG5leHBvcnQgY29uc3QgX2NoYW5nZU15UGFzc3dvcmQgPSBhc3luYyAoYXBwLCBjdXJyZW50UHcsIG5ld3Bhc3N3b3JkKSA9PiB7XG4gIGNvbnN0IGV4aXN0aW5nQXV0aCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgdXNlckF1dGhGaWxlKGFwcC51c2VyLm5hbWUpLFxuICApO1xuXG4gIGlmIChpc1NvbWV0aGluZyhleGlzdGluZ0F1dGgucGFzc3dvcmRIYXNoKSkge1xuICAgIGNvbnN0IHZlcmlmaWVkID0gYXdhaXQgYXBwLmNyeXB0by52ZXJpZnkoXG4gICAgICBleGlzdGluZ0F1dGgucGFzc3dvcmRIYXNoLFxuICAgICAgY3VycmVudFB3LFxuICAgICk7XG5cbiAgICBpZiAodmVyaWZpZWQpIHtcbiAgICAgIGF3YWl0IGF3YWl0IGRvU2V0KFxuICAgICAgICBhcHAsIGV4aXN0aW5nQXV0aCxcbiAgICAgICAgYXBwLnVzZXIubmFtZSwgbmV3cGFzc3dvcmQsXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuZXhwb3J0IGNvbnN0IHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUgPSBhcHAgPT4gYXN5bmMgKHRlbXBDb2RlLCBuZXdwYXNzd29yZCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5zZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHRlbXBDb2RlLCBuZXdwYXNzd29yZCB9LFxuICBfc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZSwgYXBwLCB0ZW1wQ29kZSwgbmV3cGFzc3dvcmQsXG4pO1xuXG5cbmV4cG9ydCBjb25zdCBfc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZSA9IGFzeW5jIChhcHAsIHRlbXBDb2RlLCBuZXdwYXNzd29yZCkgPT4ge1xuICBjb25zdCBjdXJyZW50VGltZSA9IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKTtcblxuICBjb25zdCB0ZW1wID0gcGFyc2VUZW1wb3JhcnlDb2RlKHRlbXBDb2RlKTtcblxuICBjb25zdCB1c2VyID0gJChhd2FpdCBfZ2V0VXNlcnMoYXBwKSwgW1xuICAgIGZpbmQodSA9PiB1LnRlbXBvcmFyeUFjY2Vzc0lkID09PSB0ZW1wLmlkKSxcbiAgXSk7XG5cbiAgaWYgKCF1c2VyKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGNvbnN0IGV4aXN0aW5nQXV0aCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgdXNlckF1dGhGaWxlKHVzZXIubmFtZSksXG4gICk7XG5cbiAgaWYgKGlzU29tZXRoaW5nKGV4aXN0aW5nQXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoKVxuICAgICAgICYmIGV4aXN0aW5nQXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA+IGN1cnJlbnRUaW1lKSB7XG4gICAgY29uc3QgdmVyaWZpZWQgPSBhd2FpdCBhcHAuY3J5cHRvLnZlcmlmeShcbiAgICAgIGV4aXN0aW5nQXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoLFxuICAgICAgdGVtcC5jb2RlLFxuICAgICk7XG5cbiAgICBpZiAodmVyaWZpZWQpIHtcbiAgICAgIGF3YWl0IGRvU2V0KFxuICAgICAgICBhcHAsIGV4aXN0aW5nQXV0aCxcbiAgICAgICAgdXNlci5uYW1lLCBuZXdwYXNzd29yZCxcbiAgICAgICk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5jb25zdCBkb1NldCA9IGFzeW5jIChhcHAsIGF1dGgsIHVzZXJuYW1lLCBuZXdwYXNzd29yZCkgPT4ge1xuICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2ggPSAnJztcbiAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA9IDA7XG4gIGF1dGgucGFzc3dvcmRIYXNoID0gYXdhaXQgYXBwLmNyeXB0by5oYXNoKFxuICAgIG5ld3Bhc3N3b3JkLFxuICApO1xuICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgdXNlckF1dGhGaWxlKHVzZXJuYW1lKSxcbiAgICBhdXRoLFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IHNjb3JlUGFzc3dvcmQgPSBhcHAgPT4gcGFzc3dvcmQgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuc2NvcmVQYXNzd29yZCxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyBwYXNzd29yZCB9LFxuICBfc2NvcmVQYXNzd29yZCwgcGFzc3dvcmQsXG4pO1xuXG5leHBvcnQgY29uc3QgX3Njb3JlUGFzc3dvcmQgPSAocGFzc3dvcmQpID0+IHtcbiAgLy8gZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85NDgxNzIvcGFzc3dvcmQtc3RyZW5ndGgtbWV0ZXJcbiAgLy8gdGhhbmsgeW91IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vdXNlcnMvNDY2MTcvdG0tbHZcblxuICBsZXQgc2NvcmUgPSAwO1xuICBpZiAoIXBhc3N3b3JkKSB7IHJldHVybiBzY29yZTsgfVxuXG4gIC8vIGF3YXJkIGV2ZXJ5IHVuaXF1ZSBsZXR0ZXIgdW50aWwgNSByZXBldGl0aW9uc1xuICBjb25zdCBsZXR0ZXJzID0gbmV3IE9iamVjdCgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhc3N3b3JkLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0dGVyc1twYXNzd29yZFtpXV0gPSAobGV0dGVyc1twYXNzd29yZFtpXV0gfHwgMCkgKyAxO1xuICAgIHNjb3JlICs9IDUuMCAvIGxldHRlcnNbcGFzc3dvcmRbaV1dO1xuICB9XG5cbiAgLy8gYm9udXMgcG9pbnRzIGZvciBtaXhpbmcgaXQgdXBcbiAgY29uc3QgdmFyaWF0aW9ucyA9IHtcbiAgICBkaWdpdHM6IC9cXGQvLnRlc3QocGFzc3dvcmQpLFxuICAgIGxvd2VyOiAvW2Etel0vLnRlc3QocGFzc3dvcmQpLFxuICAgIHVwcGVyOiAvW0EtWl0vLnRlc3QocGFzc3dvcmQpLFxuICAgIG5vbldvcmRzOiAvXFxXLy50ZXN0KHBhc3N3b3JkKSxcbiAgfTtcblxuICBsZXQgdmFyaWF0aW9uQ291bnQgPSAwO1xuICBmb3IgKGNvbnN0IGNoZWNrIGluIHZhcmlhdGlvbnMpIHtcbiAgICB2YXJpYXRpb25Db3VudCArPSAodmFyaWF0aW9uc1tjaGVja10gPT0gdHJ1ZSkgPyAxIDogMDtcbiAgfVxuICBzY29yZSArPSAodmFyaWF0aW9uQ291bnQgLSAxKSAqIDEwO1xuXG4gIGNvbnN0IHN0cmVuZ3RoVGV4dCA9IHNjb3JlID4gODBcbiAgICA/ICdzdHJvbmcnXG4gICAgOiBzY29yZSA+IDYwXG4gICAgICA/ICdnb29kJ1xuICAgICAgOiBzY29yZSA+PSAzMFxuICAgICAgICA/ICd3ZWFrJ1xuICAgICAgICA6ICd2ZXJ5IHdlYWsnO1xuXG4gIHJldHVybiB7XG4gICAgc2NvcmU6IHBhcnNlSW50KHNjb3JlKSxcbiAgICBzdHJlbmd0aFRleHQsXG4gIH07XG59O1xuIiwiaW1wb3J0IHsgam9pbiwgc29tZSB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyB2YWxpZGF0ZVVzZXIgfSBmcm9tICcuL3ZhbGlkYXRlVXNlcic7XG5pbXBvcnQgeyBnZXROZXdVc2VyQXV0aCB9IGZyb20gJy4vZ2V0TmV3VXNlcic7XG5pbXBvcnQge1xuICBnZXRMb2NrLCBpc05vbG9jaywgcmVsZWFzZUxvY2ssIGFwaVdyYXBwZXIsIGV2ZW50cyxcbiAgaW5zZW5zaXRpdmVFcXVhbHMsIGlzTm9uRW1wdHlTdHJpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBVU0VSU19MT0NLX0ZJTEUsIHN0cmlwVXNlck9mU2Vuc2l0aXZlU3R1ZmYsXG4gIFVTRVJTX0xJU1RfRklMRSwgdXNlckF1dGhGaWxlLFxufSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgZ2V0VGVtcG9yYXJ5Q29kZSB9IGZyb20gJy4vY3JlYXRlVGVtcG9yYXJ5QWNjZXNzJztcbmltcG9ydCB7IGlzVmFsaWRQYXNzd29yZCB9IGZyb20gJy4vc2V0UGFzc3dvcmQnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVVc2VyID0gYXBwID0+IGFzeW5jICh1c2VyLCBwYXNzd29yZCA9IG51bGwpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuY3JlYXRlVXNlcixcbiAgcGVybWlzc2lvbi5jcmVhdGVVc2VyLmlzQXV0aG9yaXplZCxcbiAgeyB1c2VyLCBwYXNzd29yZCB9LFxuICBfY3JlYXRlVXNlciwgYXBwLCB1c2VyLCBwYXNzd29yZCxcbik7XG5cbmV4cG9ydCBjb25zdCBfY3JlYXRlVXNlciA9IGFzeW5jIChhcHAsIHVzZXIsIHBhc3N3b3JkID0gbnVsbCkgPT4ge1xuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhcbiAgICBhcHAsIFVTRVJTX0xPQ0tfRklMRSwgMTAwMCwgMixcbiAgKTtcblxuICBpZiAoaXNOb2xvY2sobG9jaykpIHsgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gY3JlYXRlIHVzZXIsIGNvdWxkIG5vdCBnZXQgbG9jayAtIHRyeSBhZ2FpbicpOyB9XG5cbiAgY29uc3QgdXNlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSk7XG5cbiAgY29uc3QgdXNlckVycm9ycyA9IHZhbGlkYXRlVXNlcihhcHApKFsuLi51c2VycywgdXNlcl0sIHVzZXIpO1xuICBpZiAodXNlckVycm9ycy5sZW5ndGggPiAwKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYFVzZXIgaXMgaW52YWxpZC4gJHtqb2luKCc7ICcpKHVzZXJFcnJvcnMpfWApOyB9XG5cbiAgY29uc3QgeyBhdXRoLCB0ZW1wQ29kZSwgdGVtcG9yYXJ5QWNjZXNzSWQgfSA9IGF3YWl0IGdldEFjY2VzcyhcbiAgICBhcHAsIHBhc3N3b3JkLFxuICApO1xuICB1c2VyLnRlbXBDb2RlID0gdGVtcENvZGU7XG4gIHVzZXIudGVtcG9yYXJ5QWNjZXNzSWQgPSB0ZW1wb3JhcnlBY2Nlc3NJZDtcblxuICBpZiAoc29tZSh1ID0+IGluc2Vuc2l0aXZlRXF1YWxzKHUubmFtZSwgdXNlci5uYW1lKSkodXNlcnMpKSB7IFxuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ1VzZXIgYWxyZWFkeSBleGlzdHMnKTsgXG4gIH1cblxuICB1c2Vycy5wdXNoKFxuICAgIHN0cmlwVXNlck9mU2Vuc2l0aXZlU3R1ZmYodXNlciksXG4gICk7XG5cbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFxuICAgIFVTRVJTX0xJU1RfRklMRSxcbiAgICB1c2VycyxcbiAgKTtcblxuICB0cnkge1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlSnNvbihcbiAgICAgIHVzZXJBdXRoRmlsZSh1c2VyLm5hbWUpLFxuICAgICAgYXV0aCxcbiAgICApO1xuICB9IGNhdGNoIChfKSB7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFxuICAgICAgdXNlckF1dGhGaWxlKHVzZXIubmFtZSksXG4gICAgICBhdXRoLFxuICAgICk7XG4gIH1cblxuICBhd2FpdCByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xuXG4gIHJldHVybiB1c2VyO1xufTtcblxuY29uc3QgZ2V0QWNjZXNzID0gYXN5bmMgKGFwcCwgcGFzc3dvcmQpID0+IHtcbiAgY29uc3QgYXV0aCA9IGdldE5ld1VzZXJBdXRoKGFwcCkoKTtcblxuICBpZiAoaXNOb25FbXB0eVN0cmluZyhwYXNzd29yZCkpIHtcbiAgICBpZiAoaXNWYWxpZFBhc3N3b3JkKHBhc3N3b3JkKSkge1xuICAgICAgYXV0aC5wYXNzd29yZEhhc2ggPSBhd2FpdCBhcHAuY3J5cHRvLmhhc2gocGFzc3dvcmQpO1xuICAgICAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoID0gJyc7XG4gICAgICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0lkID0gJyc7XG4gICAgICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID0gMDtcbiAgICAgIHJldHVybiB7IGF1dGggfTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignUGFzc3dvcmQgZG9lcyBub3QgbWVldCByZXF1aXJlbWVudHMnKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCB0ZW1wQWNjZXNzID0gYXdhaXQgZ2V0VGVtcG9yYXJ5Q29kZShhcHApO1xuICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaCA9IHRlbXBBY2Nlc3MudGVtcG9yYXJ5QWNjZXNzSGFzaDtcbiAgICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID0gdGVtcEFjY2Vzcy50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaDtcbiAgICBhdXRoLnBhc3N3b3JkSGFzaCA9ICcnO1xuICAgIHJldHVybiAoe1xuICAgICAgYXV0aCxcbiAgICAgIHRlbXBDb2RlOiB0ZW1wQWNjZXNzLnRlbXBDb2RlLFxuICAgICAgdGVtcG9yYXJ5QWNjZXNzSWQ6IHRlbXBBY2Nlc3MudGVtcG9yYXJ5QWNjZXNzSWQsXG4gICAgfSk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBnZXRMb2NrLFxuICBpc05vbG9jaywgcmVsZWFzZUxvY2ssXG59IGZyb20gJy4uL2NvbW1vbi9sb2NrJztcbmltcG9ydCB7IFVTRVJTX0xPQ0tfRklMRSwgVVNFUlNfTElTVF9GSUxFLCBnZXRVc2VyQnlOYW1lIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7IGFwaVdyYXBwZXIsIGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBlbmFibGVVc2VyID0gYXBwID0+IGFzeW5jIHVzZXJuYW1lID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuZW5hYmxlVXNlcixcbiAgcGVybWlzc2lvbi5lbmFibGVEaXNhYmxlVXNlci5pc0F1dGhvcml6ZWQsXG4gIHsgdXNlcm5hbWUgfSxcbiAgX2VuYWJsZVVzZXIsIGFwcCwgdXNlcm5hbWUsXG4pO1xuXG5leHBvcnQgY29uc3QgZGlzYWJsZVVzZXIgPSBhcHAgPT4gYXN5bmMgdXNlcm5hbWUgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5kaXNhYmxlVXNlcixcbiAgcGVybWlzc2lvbi5lbmFibGVEaXNhYmxlVXNlci5pc0F1dGhvcml6ZWQsXG4gIHsgdXNlcm5hbWUgfSxcbiAgX2Rpc2FibGVVc2VyLCBhcHAsIHVzZXJuYW1lLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9lbmFibGVVc2VyID0gYXN5bmMgKGFwcCwgdXNlcm5hbWUpID0+IGF3YWl0IHRvZ2dsZVVzZXIoYXBwLCB1c2VybmFtZSwgdHJ1ZSk7XG5cbmV4cG9ydCBjb25zdCBfZGlzYWJsZVVzZXIgPSBhc3luYyAoYXBwLCB1c2VybmFtZSkgPT4gYXdhaXQgdG9nZ2xlVXNlcihhcHAsIHVzZXJuYW1lLCBmYWxzZSk7XG5cbmNvbnN0IHRvZ2dsZVVzZXIgPSBhc3luYyAoYXBwLCB1c2VybmFtZSwgZW5hYmxlZCkgPT4ge1xuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhhcHAsIFVTRVJTX0xPQ0tfRklMRSwgMTAwMCwgMSwgMCk7XG5cbiAgY29uc3QgYWN0aW9uTmFtZSA9IGVuYWJsZWQgPyAnZW5hYmxlJyA6ICdkaXNhYmxlJztcblxuICBpZiAoaXNOb2xvY2sobG9jaykpIHsgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgJHthY3Rpb25OYW1lfSB1c2VyIC0gY2Fubm90IGdldCBsb2NrYCk7IH1cblxuICB0cnkge1xuICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihVU0VSU19MSVNUX0ZJTEUpO1xuICAgIGNvbnN0IHVzZXIgPSBnZXRVc2VyQnlOYW1lKHVzZXJzLCB1c2VybmFtZSk7XG4gICAgaWYgKCF1c2VyKSB7IHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGBDb3VsZCBub3QgZmluZCB1c2VyIHRvICR7YWN0aW9uTmFtZX1gKTsgfVxuXG4gICAgaWYgKHVzZXIuZW5hYmxlZCA9PT0gIWVuYWJsZWQpIHtcbiAgICAgIHVzZXIuZW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oVVNFUlNfTElTVF9GSUxFLCB1c2Vycyk7XG4gICAgfVxuICB9IGZpbmFsbHkge1xuICAgIHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XG4gIH1cbn07XG4iLCJleHBvcnQgY29uc3QgZ2V0TmV3QWNjZXNzTGV2ZWwgPSAoKSA9PiAoKSA9PiAoe1xuICBuYW1lOiAnJyxcbiAgcGVybWlzc2lvbnM6IFtdLFxuICBkZWZhdWx0OmZhbHNlXG59KTtcbiIsImltcG9ydCB7XG4gIHZhbHVlcywgaW5jbHVkZXMsIG1hcCwgY29uY2F0LCBpc0VtcHR5LCB1bmlxV2l0aCwgc29tZSxcbiAgZmxhdHRlbiwgZmlsdGVyLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSB9IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb25UeXBlcyB9IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQge1xuICAkLCBpc1NvbWV0aGluZywgaW5zZW5zaXRpdmVFcXVhbHMsXG4gIGlzTm9uRW1wdHlTdHJpbmcsIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXROb2RlIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IGFsd2F5c0F1dGhvcml6ZWQgfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuY29uc3QgaXNBbGxvd2VkVHlwZSA9IHQgPT4gJChwZXJtaXNzaW9uVHlwZXMsIFtcbiAgdmFsdWVzLFxuICBpbmNsdWRlcyh0KSxcbl0pO1xuXG5jb25zdCBpc1JlY29yZE9ySW5kZXhUeXBlID0gdCA9PiBzb21lKHAgPT4gcCA9PT0gdCkoW1xuICBwZXJtaXNzaW9uVHlwZXMuQ1JFQVRFX1JFQ09SRCxcbiAgcGVybWlzc2lvblR5cGVzLlVQREFURV9SRUNPUkQsXG4gIHBlcm1pc3Npb25UeXBlcy5ERUxFVEVfUkVDT1JELFxuICBwZXJtaXNzaW9uVHlwZXMuUkVBRF9SRUNPUkQsXG4gIHBlcm1pc3Npb25UeXBlcy5SRUFEX0lOREVYLFxuICBwZXJtaXNzaW9uVHlwZXMuRVhFQ1VURV9BQ1RJT04sXG5dKTtcblxuXG5jb25zdCBwZXJtaXNzaW9uUnVsZXMgPSBhcHAgPT4gKFtcbiAgbWFrZXJ1bGUoJ3R5cGUnLCAndHlwZSBtdXN0IGJlIG9uZSBvZiBhbGxvd2VkIHR5cGVzJyxcbiAgICBwID0+IGlzQWxsb3dlZFR5cGUocC50eXBlKSksXG4gIG1ha2VydWxlKCdub2RlS2V5JywgJ3JlY29yZCBhbmQgaW5kZXggcGVybWlzc2lvbnMgbXVzdCBpbmNsdWRlIGEgdmFsaWQgbm9kZUtleScsXG4gICAgcCA9PiAoIWlzUmVjb3JkT3JJbmRleFR5cGUocC50eXBlKSlcbiAgICAgICAgICAgICB8fCBpc1NvbWV0aGluZyhnZXROb2RlKGFwcC5oaWVyYXJjaHksIHAubm9kZUtleSkpKSxcbl0pO1xuXG5jb25zdCBhcHBseVBlcm1pc3Npb25SdWxlcyA9IGFwcCA9PiBhcHBseVJ1bGVTZXQocGVybWlzc2lvblJ1bGVzKGFwcCkpO1xuXG5jb25zdCBhY2Nlc3NMZXZlbFJ1bGVzID0gYWxsTGV2ZWxzID0+IChbXG4gIG1ha2VydWxlKCduYW1lJywgJ25hbWUgbXVzdCBiZSBzZXQnLFxuICAgIGwgPT4gaXNOb25FbXB0eVN0cmluZyhsLm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnYWNjZXNzIGxldmVsIG5hbWVzIG11c3QgYmUgdW5pcXVlJyxcbiAgICBsID0+IGlzRW1wdHkobC5uYW1lKVxuICAgICAgICAgICAgIHx8IGZpbHRlcihhID0+IGluc2Vuc2l0aXZlRXF1YWxzKGwubmFtZSwgYS5uYW1lKSkoYWxsTGV2ZWxzKS5sZW5ndGggPT09IDEpLFxuXSk7XG5cbmNvbnN0IGFwcGx5TGV2ZWxSdWxlcyA9IGFsbExldmVscyA9PiBhcHBseVJ1bGVTZXQoYWNjZXNzTGV2ZWxSdWxlcyhhbGxMZXZlbHMpKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWNjZXNzTGV2ZWwgPSBhcHAgPT4gKGFsbExldmVscywgbGV2ZWwpID0+IHtcbiAgY29uc3QgZXJycyA9ICQobGV2ZWwucGVybWlzc2lvbnMsIFtcbiAgICBtYXAoYXBwbHlQZXJtaXNzaW9uUnVsZXMoYXBwKSksXG4gICAgZmxhdHRlbixcbiAgICBjb25jYXQoXG4gICAgICBhcHBseUxldmVsUnVsZXMoYWxsTGV2ZWxzKShsZXZlbCksXG4gICAgKSxcbiAgXSk7XG5cbiAgcmV0dXJuIGVycnM7XG59O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBY2Nlc3NMZXZlbHMgPSBhcHAgPT4gYWxsTGV2ZWxzID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLnZhbGlkYXRlQWNjZXNzTGV2ZWxzLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IGFsbExldmVscyB9LFxuICBfdmFsaWRhdGVBY2Nlc3NMZXZlbHMsIGFwcCwgYWxsTGV2ZWxzLFxuKTtcblxuZXhwb3J0IGNvbnN0IF92YWxpZGF0ZUFjY2Vzc0xldmVscyA9IChhcHAsIGFsbExldmVscykgPT4gJChhbGxMZXZlbHMsIFtcbiAgbWFwKGwgPT4gdmFsaWRhdGVBY2Nlc3NMZXZlbChhcHApKGFsbExldmVscywgbCkpLFxuICBmbGF0dGVuLFxuICB1bmlxV2l0aCgoeCwgeSkgPT4geC5maWVsZCA9PT0geS5maWVsZFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgeC5pdGVtID09PSB5Lml0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHguZXJyb3IgPT09IHkuZXJyb3IpLFxuXSk7XG4iLCJpbXBvcnQgeyBqb2luLCBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgZ2V0TG9jaywgcmVsZWFzZUxvY2ssICQsXG4gIGlzTm9sb2NrLCBhcGlXcmFwcGVyLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBBQ0NFU1NfTEVWRUxTX0xPQ0tfRklMRSxcbiAgQUNDRVNTX0xFVkVMU19GSUxFLFxufSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgdmFsaWRhdGVBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL3ZhbGlkYXRlQWNjZXNzTGV2ZWxzJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IHNhdmVBY2Nlc3NMZXZlbHMgPSBhcHAgPT4gYXN5bmMgYWNjZXNzTGV2ZWxzID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuc2F2ZUFjY2Vzc0xldmVscyxcbiAgcGVybWlzc2lvbi53cml0ZUFjY2Vzc0xldmVscy5pc0F1dGhvcml6ZWQsXG4gIHsgYWNjZXNzTGV2ZWxzIH0sXG4gIF9zYXZlQWNjZXNzTGV2ZWxzLCBhcHAsIGFjY2Vzc0xldmVscyxcbik7XG5cbmV4cG9ydCBjb25zdCBfc2F2ZUFjY2Vzc0xldmVscyA9IGFzeW5jIChhcHAsIGFjY2Vzc0xldmVscykgPT4ge1xuICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGVBY2Nlc3NMZXZlbHMoYXBwKShhY2Nlc3NMZXZlbHMubGV2ZWxzKTtcbiAgaWYgKHZhbGlkYXRpb25FcnJvcnMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGVycnMgPSAkKHZhbGlkYXRpb25FcnJvcnMsIFtcbiAgICAgIG1hcChlID0+IGUuZXJyb3IpLFxuICAgICAgam9pbignLCAnKSxcbiAgICBdKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgQWNjZXNzIExldmVscyBJbnZhbGlkOiAke2VycnN9YCxcbiAgICApO1xuICB9XG5cbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldExvY2soXG4gICAgYXBwLCBBQ0NFU1NfTEVWRUxTX0xPQ0tfRklMRSwgMjAwMCwgMixcbiAgKTtcblxuICBpZiAoaXNOb2xvY2sobG9jaykpIHsgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZ2V0IGxvY2sgdG8gc2F2ZSBhY2Nlc3MgbGV2ZWxzJyk7IH1cblxuICB0cnkge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihBQ0NFU1NfTEVWRUxTX0ZJTEUpO1xuICAgIGlmIChleGlzdGluZy52ZXJzaW9uICE9PSBhY2Nlc3NMZXZlbHMudmVyc2lvbikgeyB0aHJvdyBuZXcgRXJyb3IoJ0FjY2VzcyBsZXZlbHMgaGF2ZSBhbHJlYWR5IGJlZW4gdXBkYXRlZCwgc2luY2UgeW91IGxvYWRlZCcpOyB9XG5cbiAgICBhY2Nlc3NMZXZlbHMudmVyc2lvbisrO1xuXG4gICAgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKEFDQ0VTU19MRVZFTFNfRklMRSwgYWNjZXNzTGV2ZWxzKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgZmlsdGVyLCB2YWx1ZXMsIGVhY2gsIGtleXMsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5pbXBvcnQge1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGlzSW5kZXgsIGlzUmVjb3JkLFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgJCB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucyA9IChhcHApID0+IHtcbiAgY29uc3QgYWxsTm9kZXMgPSBnZXRGbGF0dGVuZWRIaWVyYXJjaHkoYXBwLmhpZXJhcmNoeSk7XG4gIGNvbnN0IGFjY2Vzc0xldmVsID0geyBwZXJtaXNzaW9uczogW10gfTtcblxuICBjb25zdCByZWNvcmROb2RlcyA9ICQoYWxsTm9kZXMsIFtcbiAgICBmaWx0ZXIoaXNSZWNvcmQpLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IG4gb2YgcmVjb3JkTm9kZXMpIHtcbiAgICBwZXJtaXNzaW9uLmNyZWF0ZVJlY29yZC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcbiAgICBwZXJtaXNzaW9uLnVwZGF0ZVJlY29yZC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcbiAgICBwZXJtaXNzaW9uLmRlbGV0ZVJlY29yZC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcbiAgICBwZXJtaXNzaW9uLnJlYWRSZWNvcmQuYWRkKG4ubm9kZUtleSgpLCBhY2Nlc3NMZXZlbCk7XG4gIH1cblxuICBjb25zdCBpbmRleE5vZGVzID0gJChhbGxOb2RlcywgW1xuICAgIGZpbHRlcihpc0luZGV4KSxcbiAgXSk7XG5cbiAgZm9yIChjb25zdCBuIG9mIGluZGV4Tm9kZXMpIHtcbiAgICBwZXJtaXNzaW9uLnJlYWRJbmRleC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcbiAgfVxuXG4gIGZvciAoY29uc3QgYSBvZiBrZXlzKGFwcC5hY3Rpb25zKSkge1xuICAgIHBlcm1pc3Npb24uZXhlY3V0ZUFjdGlvbi5hZGQoYSwgYWNjZXNzTGV2ZWwpO1xuICB9XG5cbiAgJChwZXJtaXNzaW9uLCBbXG4gICAgdmFsdWVzLFxuICAgIGZpbHRlcihwID0+ICFwLmlzTm9kZSksXG4gICAgZWFjaChwID0+IHAuYWRkKGFjY2Vzc0xldmVsKSksXG4gIF0pO1xuXG4gIHJldHVybiBhY2Nlc3NMZXZlbC5wZXJtaXNzaW9ucztcbn07XG4iLCJpbXBvcnQgeyBkaWZmZXJlbmNlLCBtYXAsIGpvaW4gfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgZ2V0TG9jaywgaXNOb2xvY2ssIHJlbGVhc2VMb2NrLCAkLFxuICBhcGlXcmFwcGVyLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBVU0VSU19MT0NLX0ZJTEUsIEFDQ0VTU19MRVZFTFNfRklMRSxcbiAgZ2V0VXNlckJ5TmFtZSwgVVNFUlNfTElTVF9GSUxFLFxufSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgTm90Rm91bmRFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3Qgc2V0VXNlckFjY2Vzc0xldmVscyA9IGFwcCA9PiBhc3luYyAodXNlck5hbWUsIGFjY2Vzc0xldmVscykgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5zZXRVc2VyQWNjZXNzTGV2ZWxzLFxuICBwZXJtaXNzaW9uLnNldFVzZXJBY2Nlc3NMZXZlbHMuaXNBdXRob3JpemVkLFxuICB7IHVzZXJOYW1lLCBhY2Nlc3NMZXZlbHMgfSxcbiAgX3NldFVzZXJBY2Nlc3NMZXZlbHMsIGFwcCwgdXNlck5hbWUsIGFjY2Vzc0xldmVscyxcbik7XG5cbmV4cG9ydCBjb25zdCBfc2V0VXNlckFjY2Vzc0xldmVscyA9IGFzeW5jIChhcHAsIHVzZXJuYW1lLCBhY2Nlc3NMZXZlbHMpID0+IHtcbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldExvY2soYXBwLCBVU0VSU19MT0NLX0ZJTEUsIDEwMDAsIDEsIDApO1xuXG4gIGNvbnN0IGFjdHVhbEFjY2Vzc0xldmVscyA9ICQoXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihBQ0NFU1NfTEVWRUxTX0ZJTEUpLFxuICAgIFtcbiAgICAgIGwgPT4gbC5sZXZlbHMsXG4gICAgICBtYXAobCA9PiBsLm5hbWUpLFxuICAgIF0sXG4gICk7XG5cbiAgY29uc3QgbWlzc2luZyA9IGRpZmZlcmVuY2UoYWNjZXNzTGV2ZWxzKShhY3R1YWxBY2Nlc3NMZXZlbHMpO1xuICBpZiAobWlzc2luZy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFjY2VzcyBsZXZlbHMgc3VwcGxpZWQ6ICR7am9pbignLCAnLCBtaXNzaW5nKX1gKTtcbiAgfVxuXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIHNldCB1c2VyIGFjY2VzcyBsZXZlbHMgY2Fubm90IGdldCBsb2NrJyk7IH1cblxuICB0cnkge1xuICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihVU0VSU19MSVNUX0ZJTEUpO1xuICAgIGNvbnN0IHVzZXIgPSBnZXRVc2VyQnlOYW1lKHVzZXJzLCB1c2VybmFtZSk7XG4gICAgaWYgKCF1c2VyKSB7IHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGBDb3VsZCBub3QgZmluZCB1c2VyIHdpdGggJHt1c2VybmFtZX1gKTsgfVxuXG4gICAgdXNlci5hY2Nlc3NMZXZlbHMgPSBhY2Nlc3NMZXZlbHM7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFVTRVJTX0xJU1RfRklMRSwgdXNlcnMpO1xuICB9IGZpbmFsbHkge1xuICAgIHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBhdXRoZW50aWNhdGUsXG4gIGF1dGhlbnRpY2F0ZVRlbXBvcmFyeUFjY2Vzcyxcbn0gZnJvbSAnLi9hdXRoZW50aWNhdGUnO1xuaW1wb3J0IHsgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzIH0gZnJvbSAnLi9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MnO1xuaW1wb3J0IHsgY3JlYXRlVXNlciB9IGZyb20gJy4vY3JlYXRlVXNlcic7XG5pbXBvcnQgeyBlbmFibGVVc2VyLCBkaXNhYmxlVXNlciB9IGZyb20gJy4vZW5hYmxlVXNlcic7XG5pbXBvcnQgeyBsb2FkQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi9sb2FkQWNjZXNzTGV2ZWxzJztcbmltcG9ydCB7IGdldE5ld0FjY2Vzc0xldmVsIH0gZnJvbSAnLi9nZXROZXdBY2Nlc3NMZXZlbCc7XG5pbXBvcnQgeyBnZXROZXdVc2VyLCBnZXROZXdVc2VyQXV0aCB9IGZyb20gJy4vZ2V0TmV3VXNlcic7XG5pbXBvcnQgeyBnZXRVc2VycyB9IGZyb20gJy4vZ2V0VXNlcnMnO1xuaW1wb3J0IHsgaXNBdXRob3JpemVkIH0gZnJvbSAnLi9pc0F1dGhvcml6ZWQnO1xuaW1wb3J0IHsgc2F2ZUFjY2Vzc0xldmVscyB9IGZyb20gJy4vc2F2ZUFjY2Vzc0xldmVscyc7XG5pbXBvcnQge1xuICBjaGFuZ2VNeVBhc3N3b3JkLFxuICBzY29yZVBhc3N3b3JkLCBzZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlLFxuICBpc1ZhbGlkUGFzc3dvcmQsXG59IGZyb20gJy4vc2V0UGFzc3dvcmQnO1xuaW1wb3J0IHsgdmFsaWRhdGVVc2VyIH0gZnJvbSAnLi92YWxpZGF0ZVVzZXInO1xuaW1wb3J0IHsgdmFsaWRhdGVBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL3ZhbGlkYXRlQWNjZXNzTGV2ZWxzJztcbmltcG9ydCB7IGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zIH0gZnJvbSAnLi9nZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBzZXRVc2VyQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi9zZXRVc2VyQWNjZXNzTGV2ZWxzJztcblxuZXhwb3J0IGNvbnN0IGdldEF1dGhBcGkgPSBhcHAgPT4gKHtcbiAgYXV0aGVudGljYXRlOiBhdXRoZW50aWNhdGUoYXBwKSxcbiAgYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzOiBhdXRoZW50aWNhdGVUZW1wb3JhcnlBY2Nlc3MoYXBwKSxcbiAgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzOiBjcmVhdGVUZW1wb3JhcnlBY2Nlc3MoYXBwKSxcbiAgY3JlYXRlVXNlcjogY3JlYXRlVXNlcihhcHApLFxuICBsb2FkQWNjZXNzTGV2ZWxzOiBsb2FkQWNjZXNzTGV2ZWxzKGFwcCksXG4gIGVuYWJsZVVzZXI6IGVuYWJsZVVzZXIoYXBwKSxcbiAgZGlzYWJsZVVzZXI6IGRpc2FibGVVc2VyKGFwcCksXG4gIGdldE5ld0FjY2Vzc0xldmVsOiBnZXROZXdBY2Nlc3NMZXZlbChhcHApLFxuICBnZXROZXdVc2VyOiBnZXROZXdVc2VyKGFwcCksXG4gIGdldE5ld1VzZXJBdXRoOiBnZXROZXdVc2VyQXV0aChhcHApLFxuICBnZXRVc2VyczogZ2V0VXNlcnMoYXBwKSxcbiAgc2F2ZUFjY2Vzc0xldmVsczogc2F2ZUFjY2Vzc0xldmVscyhhcHApLFxuICBpc0F1dGhvcml6ZWQ6IGlzQXV0aG9yaXplZChhcHApLFxuICBjaGFuZ2VNeVBhc3N3b3JkOiBjaGFuZ2VNeVBhc3N3b3JkKGFwcCksXG4gIHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGU6IHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUoYXBwKSxcbiAgc2NvcmVQYXNzd29yZCxcbiAgaXNWYWxpZFBhc3N3b3JkOiBpc1ZhbGlkUGFzc3dvcmQoYXBwKSxcbiAgdmFsaWRhdGVVc2VyOiB2YWxpZGF0ZVVzZXIoYXBwKSxcbiAgdmFsaWRhdGVBY2Nlc3NMZXZlbHM6IHZhbGlkYXRlQWNjZXNzTGV2ZWxzKGFwcCksXG4gIGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zOiAoKSA9PiBnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucyhhcHApLFxuICBzZXRVc2VyQWNjZXNzTGV2ZWxzOiBzZXRVc2VyQWNjZXNzTGV2ZWxzKGFwcCksXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0QXV0aEFwaTtcbiIsImltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IGFwaVdyYXBwZXJTeW5jIH0gZnJvbSAnLi4vY29tbW9uL2FwaVdyYXBwZXInO1xuaW1wb3J0IHsgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uL2V2ZW50cyc7XG5cbmV4cG9ydCBjb25zdCBleGVjdXRlQWN0aW9uID0gYXBwID0+IChhY3Rpb25OYW1lLCBvcHRpb25zKSA9PiB7XG4gIGFwaVdyYXBwZXJTeW5jKFxuICAgIGFwcCxcbiAgICBldmVudHMuYWN0aW9uc0FwaS5leGVjdXRlLFxuICAgIHBlcm1pc3Npb24uZXhlY3V0ZUFjdGlvbi5pc0F1dGhvcml6ZWQoYWN0aW9uTmFtZSksXG4gICAgeyBhY3Rpb25OYW1lLCBvcHRpb25zIH0sXG4gICAgYXBwLmFjdGlvbnNbYWN0aW9uTmFtZV0sIG9wdGlvbnMsXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgX2V4ZWN1dGVBY3Rpb24gPSAoYmVoYXZpb3VyU291cmNlcywgYWN0aW9uLCBvcHRpb25zKSA9PiBiZWhhdmlvdXJTb3VyY2VzW2FjdGlvbi5iZWhhdmlvdXJTb3VyY2VdW2FjdGlvbi5iZWhhdmlvdXJOYW1lXShvcHRpb25zKTtcbiIsImltcG9ydCB7IGV4ZWN1dGVBY3Rpb24gfSBmcm9tICcuL2V4ZWN1dGUnO1xuXG5leHBvcnQgY29uc3QgZ2V0QWN0aW9uc0FwaSA9IGFwcCA9PiAoe1xuICBleGVjdXRlOiBleGVjdXRlQWN0aW9uKGFwcCksXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0QWN0aW9uc0FwaTtcbiIsImltcG9ydCB7IGhhcyB9IGZyb20gJ2xvZGFzaCc7XG5cbmNvbnN0IHB1Ymxpc2ggPSBoYW5kbGVycyA9PiBhc3luYyAoZXZlbnROYW1lLCBjb250ZXh0ID0ge30pID0+IHtcbiAgaWYgKCFoYXMoaGFuZGxlcnMsIGV2ZW50TmFtZSkpIHJldHVybjtcblxuICBmb3IgKGNvbnN0IGhhbmRsZXIgb2YgaGFuZGxlcnNbZXZlbnROYW1lXSkge1xuICAgIGF3YWl0IGhhbmRsZXIoZXZlbnROYW1lLCBjb250ZXh0KTtcbiAgfVxufTtcblxuY29uc3Qgc3Vic2NyaWJlID0gaGFuZGxlcnMgPT4gKGV2ZW50TmFtZSwgaGFuZGxlcikgPT4ge1xuICBpZiAoIWhhcyhoYW5kbGVycywgZXZlbnROYW1lKSkge1xuICAgIGhhbmRsZXJzW2V2ZW50TmFtZV0gPSBbXTtcbiAgfVxuICBoYW5kbGVyc1tldmVudE5hbWVdLnB1c2goaGFuZGxlcik7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlRXZlbnRBZ2dyZWdhdG9yID0gKCkgPT4ge1xuICBjb25zdCBoYW5kbGVycyA9IHt9O1xuICBjb25zdCBldmVudEFnZ3JlZ2F0b3IgPSAoe1xuICAgIHB1Ymxpc2g6IHB1Ymxpc2goaGFuZGxlcnMpLFxuICAgIHN1YnNjcmliZTogc3Vic2NyaWJlKGhhbmRsZXJzKSxcbiAgfSk7XG4gIHJldHVybiBldmVudEFnZ3JlZ2F0b3I7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVFdmVudEFnZ3JlZ2F0b3I7XG4iLCJpbXBvcnQgeyByZXRyeSB9IGZyb20gJy4uL2NvbW1vbi9pbmRleCc7XG5pbXBvcnQgeyBOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmNvbnN0IGNyZWF0ZUpzb24gPSBvcmlnaW5hbENyZWF0ZUZpbGUgPT4gYXN5bmMgKGtleSwgb2JqLCByZXRyaWVzID0gNSwgZGVsYXkgPSA1MDApID0+IGF3YWl0IHJldHJ5KG9yaWdpbmFsQ3JlYXRlRmlsZSwgcmV0cmllcywgZGVsYXksIGtleSwgSlNPTi5zdHJpbmdpZnkob2JqKSk7XG5cbmNvbnN0IGNyZWF0ZU5ld0ZpbGUgPSBvcmlnaW5hbENyZWF0ZUZpbGUgPT4gYXN5bmMgKHBhdGgsIGNvbnRlbnQsIHJldHJpZXMgPSA1LCBkZWxheSA9IDUwMCkgPT4gYXdhaXQgcmV0cnkob3JpZ2luYWxDcmVhdGVGaWxlLCByZXRyaWVzLCBkZWxheSwgcGF0aCwgY29udGVudCk7XG5cbmNvbnN0IGxvYWRKc29uID0gZGF0YXN0b3JlID0+IGFzeW5jIChrZXksIHJldHJpZXMgPSA1LCBkZWxheSA9IDUwMCkgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCByZXRyeShKU09OLnBhcnNlLCByZXRyaWVzLCBkZWxheSwgYXdhaXQgZGF0YXN0b3JlLmxvYWRGaWxlKGtleSkpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICB0aHJvdyBuZXcgTm90Rm91bmRFcnJvcihlcnIubWVzc2FnZSk7XG4gIH1cbn1cblxuY29uc3QgdXBkYXRlSnNvbiA9IGRhdGFzdG9yZSA9PiBhc3luYyAoa2V5LCBvYmosIHJldHJpZXMgPSA1LCBkZWxheSA9IDUwMCkgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCByZXRyeShkYXRhc3RvcmUudXBkYXRlRmlsZSwgcmV0cmllcywgZGVsYXksIGtleSwgSlNPTi5zdHJpbmdpZnkob2JqKSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGVyci5tZXNzYWdlKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgc2V0dXBEYXRhc3RvcmUgPSAoZGF0YXN0b3JlKSA9PiB7XG4gIGNvbnN0IG9yaWdpbmFsQ3JlYXRlRmlsZSA9IGRhdGFzdG9yZS5jcmVhdGVGaWxlO1xuICBkYXRhc3RvcmUubG9hZEpzb24gPSBsb2FkSnNvbihkYXRhc3RvcmUpO1xuICBkYXRhc3RvcmUuY3JlYXRlSnNvbiA9IGNyZWF0ZUpzb24ob3JpZ2luYWxDcmVhdGVGaWxlKTtcbiAgZGF0YXN0b3JlLnVwZGF0ZUpzb24gPSB1cGRhdGVKc29uKGRhdGFzdG9yZSk7XG4gIGRhdGFzdG9yZS5jcmVhdGVGaWxlID0gY3JlYXRlTmV3RmlsZShvcmlnaW5hbENyZWF0ZUZpbGUpO1xuICBpZiAoZGF0YXN0b3JlLmNyZWF0ZUVtcHR5RGIpIHsgZGVsZXRlIGRhdGFzdG9yZS5jcmVhdGVFbXB0eURiOyB9XG4gIHJldHVybiBkYXRhc3RvcmU7XG59O1xuXG5leHBvcnQgeyBjcmVhdGVFdmVudEFnZ3JlZ2F0b3IgfSBmcm9tICcuL2V2ZW50QWdncmVnYXRvcic7XG5cbmV4cG9ydCBkZWZhdWx0IHNldHVwRGF0YXN0b3JlO1xuIiwiaW1wb3J0IHsgXG4gIGNvbXBpbGVFeHByZXNzaW9uIGFzIGNFeHAsIFxuICBjb21waWxlQ29kZSBhcyBjQ29kZSBcbn0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xuXG5leHBvcnQgY29uc3QgY29tcGlsZUNvZGUgPSBjb2RlID0+IHtcbiAgbGV0IGZ1bmM7ICBcbiAgICBcbiAgdHJ5IHtcbiAgICBmdW5jID0gY0NvZGUoY29kZSk7XG4gIH0gY2F0Y2goZSkge1xuICAgIGUubWVzc2FnZSA9IGBFcnJvciBjb21waWxpbmcgY29kZSA6ICR7Y29kZX0gOiAke2UubWVzc2FnZX1gO1xuICAgIHRocm93IGU7XG4gIH1cblxuICByZXR1cm4gZnVuYztcbn1cblxuZXhwb3J0IGNvbnN0IGNvbXBpbGVFeHByZXNzaW9uID0gY29kZSA9PiB7XG4gIGxldCBmdW5jOyAgXG4gICAgICBcbiAgdHJ5IHtcbiAgICBmdW5jID0gY0V4cChjb2RlKTtcbiAgfSBjYXRjaChlKSB7XG4gICAgZS5tZXNzYWdlID0gYEVycm9yIGNvbXBpbGluZyBleHByZXNzaW9uIDogJHtjb2RlfSA6ICR7ZS5tZXNzYWdlfWA7XG4gICAgdGhyb3cgZTtcbiAgfVxuICBcbiAgcmV0dXJuIGZ1bmM7XG59XG4iLCJpbXBvcnQge1xuICBpc0Z1bmN0aW9uLCBmaWx0ZXIsIG1hcCxcbiAgdW5pcUJ5LCBrZXlzLCBkaWZmZXJlbmNlLFxuICBqb2luLCByZWR1Y2UsIGZpbmQsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBjb21waWxlRXhwcmVzc2lvbiwgY29tcGlsZUNvZGUgfSBmcm9tICcuLi9jb21tb24vY29tcGlsZUNvZGUnO1xuaW1wb3J0IHsgJCB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBfZXhlY3V0ZUFjdGlvbiB9IGZyb20gJy4vZXhlY3V0ZSc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IsIE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxpc2VBY3Rpb25zID0gKHN1YnNjcmliZSwgYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucywgdHJpZ2dlcnMsIGFwaXMpID0+IHtcbiAgdmFsaWRhdGVTb3VyY2VzKGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMpO1xuICBzdWJzY3JpYmVUcmlnZ2VycyhzdWJzY3JpYmUsIGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMsIHRyaWdnZXJzLCBhcGlzKTtcbiAgcmV0dXJuIGNyZWF0ZUFjdGlvbnNDb2xsZWN0aW9uKGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMpO1xufTtcblxuY29uc3QgY3JlYXRlQWN0aW9uc0NvbGxlY3Rpb24gPSAoYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucykgPT4gJChhY3Rpb25zLCBbXG4gIHJlZHVjZSgoYWxsLCBhKSA9PiB7XG4gICAgYWxsW2EubmFtZV0gPSBvcHRzID0+IF9leGVjdXRlQWN0aW9uKGJlaGF2aW91clNvdXJjZXMsIGEsIG9wdHMpO1xuICAgIHJldHVybiBhbGw7XG4gIH0sIHt9KSxcbl0pO1xuXG5jb25zdCBzdWJzY3JpYmVUcmlnZ2VycyA9IChzdWJzY3JpYmUsIGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMsIHRyaWdnZXJzLCBhcGlzKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZU9wdGlvbnMgPSAob3B0aW9uc0NyZWF0b3IsIGV2ZW50Q29udGV4dCkgPT4ge1xuICAgIGlmICghb3B0aW9uc0NyZWF0b3IpIHJldHVybiB7fTtcbiAgICBjb25zdCBjcmVhdGUgPSBjb21waWxlQ29kZShvcHRpb25zQ3JlYXRvcik7XG4gICAgcmV0dXJuIGNyZWF0ZSh7IGNvbnRleHQ6IGV2ZW50Q29udGV4dCwgYXBpcyB9KTtcbiAgfTtcblxuICBjb25zdCBzaG91bGRSdW5UcmlnZ2VyID0gKHRyaWdnZXIsIGV2ZW50Q29udGV4dCkgPT4ge1xuICAgIGlmICghdHJpZ2dlci5jb25kaXRpb24pIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHNob3VsZFJ1biA9IGNvbXBpbGVFeHByZXNzaW9uKHRyaWdnZXIuY29uZGl0aW9uKTtcbiAgICByZXR1cm4gc2hvdWxkUnVuKHsgY29udGV4dDogZXZlbnRDb250ZXh0IH0pO1xuICB9O1xuXG4gIGZvciAobGV0IHRyaWcgb2YgdHJpZ2dlcnMpIHtcbiAgICBzdWJzY3JpYmUodHJpZy5ldmVudE5hbWUsIGFzeW5jIChldiwgY3R4KSA9PiB7XG4gICAgICBpZiAoc2hvdWxkUnVuVHJpZ2dlcih0cmlnLCBjdHgpKSB7XG4gICAgICAgIGF3YWl0IF9leGVjdXRlQWN0aW9uKFxuICAgICAgICAgIGJlaGF2aW91clNvdXJjZXMsXG4gICAgICAgICAgZmluZChhID0+IGEubmFtZSA9PT0gdHJpZy5hY3Rpb25OYW1lKShhY3Rpb25zKSxcbiAgICAgICAgICBjcmVhdGVPcHRpb25zKHRyaWcub3B0aW9uc0NyZWF0b3IsIGN0eCksXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07XG5cbmNvbnN0IHZhbGlkYXRlU291cmNlcyA9IChiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zKSA9PiB7XG4gIGNvbnN0IGRlY2xhcmVkU291cmNlcyA9ICQoYWN0aW9ucywgW1xuICAgIHVuaXFCeShhID0+IGEuYmVoYXZpb3VyU291cmNlKSxcbiAgICBtYXAoYSA9PiBhLmJlaGF2aW91clNvdXJjZSksXG4gIF0pO1xuXG4gIGNvbnN0IHN1cHBsaWVkU291cmNlcyA9IGtleXMoYmVoYXZpb3VyU291cmNlcyk7XG5cbiAgY29uc3QgbWlzc2luZ1NvdXJjZXMgPSBkaWZmZXJlbmNlKFxuICAgIGRlY2xhcmVkU291cmNlcywgc3VwcGxpZWRTb3VyY2VzLFxuICApO1xuXG4gIGlmIChtaXNzaW5nU291cmNlcy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgRGVjbGFyZWQgYmVoYXZpb3VyIHNvdXJjZXMgYXJlIG5vdCBzdXBwbGllZDogJHtqb2luKCcsICcsIG1pc3NpbmdTb3VyY2VzKX1gKTtcbiAgfVxuXG4gIGNvbnN0IG1pc3NpbmdCZWhhdmlvdXJzID0gJChhY3Rpb25zLCBbXG4gICAgZmlsdGVyKGEgPT4gIWlzRnVuY3Rpb24oYmVoYXZpb3VyU291cmNlc1thLmJlaGF2aW91clNvdXJjZV1bYS5iZWhhdmlvdXJOYW1lXSkpLFxuICAgIG1hcChhID0+IGBBY3Rpb246ICR7YS5uYW1lfSA6ICR7YS5iZWhhdmlvdXJTb3VyY2V9LiR7YS5iZWhhdmlvdXJOYW1lfWApLFxuICBdKTtcblxuICBpZiAobWlzc2luZ0JlaGF2aW91cnMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGBNaXNzaW5nIGJlaGF2aW91cnM6IGNvdWxkIG5vdCBmaW5kIGJlaGF2aW91ciBmdW5jdGlvbnM6ICR7am9pbignLCAnLCBtaXNzaW5nQmVoYXZpb3Vycyl9YCk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBtYXAsIGZpbHRlciwgZ3JvdXBCeSwgc3BsaXQsXG4gIHNvbWUsIGZpbmQsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBMT0NLX0ZJTEVOQU1FLCBUUkFOU0FDVElPTlNfRk9MREVSLCBpZFNlcCwgaXNVcGRhdGUsXG4gIG5vZGVLZXlIYXNoRnJvbUJ1aWxkRm9sZGVyLCBpc0J1aWxkSW5kZXhGb2xkZXIsIGdldFRyYW5zYWN0aW9uSWQsXG4gIGlzRGVsZXRlLCBpc0NyZWF0ZSxcbn0gZnJvbSAnLi90cmFuc2FjdGlvbnNDb21tb24nO1xuaW1wb3J0IHtcbiAgam9pbktleSwgJCwgbm9uZSwgaXNTb21ldGhpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXRMYXN0UGFydEluS2V5LCBnZXROb2RlRnJvbU5vZGVLZXlIYXNoIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IF9sb2FkIH0gZnJvbSAnLi4vcmVjb3JkQXBpL2xvYWQnO1xuXG5leHBvcnQgY29uc3QgcmV0cmlldmUgPSBhc3luYyAoYXBwKSA9PiB7XG4gIGNvbnN0IHRyYW5zYWN0aW9uRmlsZXMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZvbGRlckNvbnRlbnRzKFxuICAgIFRSQU5TQUNUSU9OU19GT0xERVIsXG4gICk7XG5cbiAgbGV0IHRyYW5zYWN0aW9ucyA9IFtdO1xuXG4gIGlmIChzb21lKGlzQnVpbGRJbmRleEZvbGRlcikodHJhbnNhY3Rpb25GaWxlcykpIHtcbiAgICBjb25zdCBidWlsZEluZGV4Rm9sZGVyID0gZmluZChpc0J1aWxkSW5kZXhGb2xkZXIpKHRyYW5zYWN0aW9uRmlsZXMpO1xuXG4gICAgdHJhbnNhY3Rpb25zID0gYXdhaXQgcmV0cmlldmVCdWlsZEluZGV4VHJhbnNhY3Rpb25zKFxuICAgICAgYXBwLFxuICAgICAgam9pbktleShUUkFOU0FDVElPTlNfRk9MREVSLCBidWlsZEluZGV4Rm9sZGVyKSxcbiAgICApO1xuICB9XG5cbiAgaWYgKHRyYW5zYWN0aW9ucy5sZW5ndGggPiAwKSByZXR1cm4gdHJhbnNhY3Rpb25zO1xuXG4gIHJldHVybiBhd2FpdCByZXRyaWV2ZVN0YW5kYXJkVHJhbnNhY3Rpb25zKFxuICAgIGFwcCwgdHJhbnNhY3Rpb25GaWxlcyxcbiAgKTtcbn07XG5cbmNvbnN0IHJldHJpZXZlQnVpbGRJbmRleFRyYW5zYWN0aW9ucyA9IGFzeW5jIChhcHAsIGJ1aWxkSW5kZXhGb2xkZXIpID0+IHtcbiAgY29uc3QgY2hpbGRGb2xkZXJzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5nZXRGb2xkZXJDb250ZW50cyhidWlsZEluZGV4Rm9sZGVyKTtcbiAgaWYgKGNoaWxkRm9sZGVycy5sZW5ndGggPT09IDApIHtcbiAgICAvLyBjbGVhbnVwXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoYnVpbGRJbmRleEZvbGRlcik7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgZ2V0VHJhbnNhY3Rpb25GaWxlcyA9IGFzeW5jIChjaGlsZEZvbGRlckluZGV4ID0gMCkgPT4ge1xuICAgIGlmIChjaGlsZEZvbGRlckluZGV4ID49IGNoaWxkRm9sZGVycy5sZW5ndGgpIHJldHVybiBbXTtcblxuICAgIGNvbnN0IGNoaWxkRm9sZGVyS2V5ID0gam9pbktleShidWlsZEluZGV4Rm9sZGVyLCBjaGlsZEZvbGRlcnNbY2hpbGRGb2xkZXJJbmRleF0pO1xuICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5nZXRGb2xkZXJDb250ZW50cyhcbiAgICAgIGNoaWxkRm9sZGVyS2V5LFxuICAgICk7XG5cbiAgICBpZiAoZmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihjaGlsZEZvbGRlcktleSk7XG4gICAgICByZXR1cm4gYXdhaXQgZ2V0VHJhbnNhY3Rpb25GaWxlcyhjaGlsZEZvbGRlckluZGV4ICsgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgY2hpbGRGb2xkZXJLZXksIGZpbGVzIH07XG4gIH07XG5cbiAgY29uc3QgdHJhbnNhY3Rpb25GaWxlcyA9IGF3YWl0IGdldFRyYW5zYWN0aW9uRmlsZXMoKTtcblxuICBpZiAodHJhbnNhY3Rpb25GaWxlcy5maWxlcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCB0cmFuc2FjdGlvbnMgPSAkKHRyYW5zYWN0aW9uRmlsZXMuZmlsZXMsIFtcbiAgICBtYXAocGFyc2VUcmFuc2FjdGlvbklkKSxcbiAgXSk7XG5cbiAgZm9yIChjb25zdCB0IG9mIHRyYW5zYWN0aW9ucykge1xuICAgIGNvbnN0IHRyYW5zYWN0aW9uQ29udGVudCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgICBqb2luS2V5KFxuICAgICAgICB0cmFuc2FjdGlvbkZpbGVzLmNoaWxkRm9sZGVyS2V5LFxuICAgICAgICB0LmZ1bGxJZCxcbiAgICAgICksXG4gICAgKTtcbiAgICB0LnJlY29yZCA9IGF3YWl0IF9sb2FkKGFwcCwgdHJhbnNhY3Rpb25Db250ZW50LnJlY29yZEtleSk7XG4gIH1cblxuICB0cmFuc2FjdGlvbnMuaW5kZXhOb2RlID0gJChidWlsZEluZGV4Rm9sZGVyLCBbXG4gICAgZ2V0TGFzdFBhcnRJbktleSxcbiAgICBub2RlS2V5SGFzaEZyb21CdWlsZEZvbGRlcixcbiAgICBnZXROb2RlRnJvbU5vZGVLZXlIYXNoKGFwcC5oaWVyYXJjaHkpLFxuICBdKTtcblxuICB0cmFuc2FjdGlvbnMuZm9sZGVyS2V5ID0gdHJhbnNhY3Rpb25GaWxlcy5jaGlsZEZvbGRlcktleTtcblxuICByZXR1cm4gdHJhbnNhY3Rpb25zO1xufTtcblxuY29uc3QgcmV0cmlldmVTdGFuZGFyZFRyYW5zYWN0aW9ucyA9IGFzeW5jIChhcHAsIHRyYW5zYWN0aW9uRmlsZXMpID0+IHtcbiAgY29uc3QgdHJhbnNhY3Rpb25JZHMgPSAkKHRyYW5zYWN0aW9uRmlsZXMsIFtcbiAgICBmaWx0ZXIoZiA9PiBmICE9PSBMT0NLX0ZJTEVOQU1FXG4gICAgICAgICAgICAgICAgICAgICYmICFpc0J1aWxkSW5kZXhGb2xkZXIoZikpLFxuICAgIG1hcChwYXJzZVRyYW5zYWN0aW9uSWQpLFxuICBdKTtcblxuICBjb25zdCB0cmFuc2FjdGlvbklkc0J5UmVjb3JkID0gJCh0cmFuc2FjdGlvbklkcywgW1xuICAgIGdyb3VwQnkoJ3JlY29yZElkJyksXG4gIF0pO1xuXG4gIGNvbnN0IGRlZHVwZWRUcmFuc2FjdGlvbnMgPSBbXTtcblxuICBjb25zdCB2ZXJpZnkgPSBhc3luYyAodCkgPT4ge1xuICAgIGlmICh0LnZlcmlmaWVkID09PSB0cnVlKSByZXR1cm4gdDtcblxuICAgIGNvbnN0IGlkID0gZ2V0VHJhbnNhY3Rpb25JZChcbiAgICAgIHQucmVjb3JkSWQsXG4gICAgICB0LnRyYW5zYWN0aW9uVHlwZSxcbiAgICAgIHQudW5pcXVlSWQsXG4gICAgKTtcblxuICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICAgIGpvaW5LZXkoVFJBTlNBQ1RJT05TX0ZPTERFUiwgaWQpLFxuICAgICk7XG5cbiAgICBpZiAoaXNEZWxldGUodCkpIHtcbiAgICAgIHQucmVjb3JkID0gdHJhbnNhY3Rpb24ucmVjb3JkO1xuICAgICAgdC52ZXJpZmllZCA9IHRydWU7XG4gICAgICByZXR1cm4gdDtcbiAgICB9XG5cbiAgICBjb25zdCByZWMgPSBhd2FpdCBfbG9hZChcbiAgICAgIGFwcCxcbiAgICAgIHRyYW5zYWN0aW9uLnJlY29yZEtleSxcbiAgICApO1xuICAgIGlmIChyZWMudHJhbnNhY3Rpb25JZCA9PT0gaWQpIHtcbiAgICAgIHQucmVjb3JkID0gcmVjO1xuICAgICAgaWYgKHRyYW5zYWN0aW9uLm9sZFJlY29yZCkgeyB0Lm9sZFJlY29yZCA9IHRyYW5zYWN0aW9uLm9sZFJlY29yZDsgfVxuICAgICAgdC52ZXJpZmllZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHQudmVyaWZpZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdDtcbiAgfTtcblxuICBjb25zdCBwaWNrT25lID0gYXN5bmMgKHRyYW5zLCBmb3JUeXBlKSA9PiB7XG4gICAgY29uc3QgdHJhbnNGb3JUeXBlID0gZmlsdGVyKGZvclR5cGUpKHRyYW5zKTtcbiAgICBpZiAodHJhbnNGb3JUeXBlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY29uc3QgdCA9IGF3YWl0IHZlcmlmeSh0cmFuc0ZvclR5cGVbMF0pO1xuICAgICAgcmV0dXJuICh0LnZlcmlmaWVkID09PSB0cnVlID8gdCA6IG51bGwpO1xuICAgIH1cbiAgICBmb3IgKGxldCB0IG9mIHRyYW5zRm9yVHlwZSkge1xuICAgICAgdCA9IGF3YWl0IHZlcmlmeSh0KTtcbiAgICAgIGlmICh0LnZlcmlmaWVkID09PSB0cnVlKSB7IHJldHVybiB0OyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG5cbiAgZm9yIChjb25zdCByZWNvcmRJZCBpbiB0cmFuc2FjdGlvbklkc0J5UmVjb3JkKSB7XG4gICAgY29uc3QgdHJhbnNJZHNGb3JSZWNvcmQgPSB0cmFuc2FjdGlvbklkc0J5UmVjb3JkW3JlY29yZElkXTtcbiAgICBpZiAodHJhbnNJZHNGb3JSZWNvcmQubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCB0ID0gYXdhaXQgdmVyaWZ5KHRyYW5zSWRzRm9yUmVjb3JkWzBdKTtcbiAgICAgIGlmICh0LnZlcmlmaWVkKSB7IGRlZHVwZWRUcmFuc2FjdGlvbnMucHVzaCh0KTsgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChzb21lKGlzRGVsZXRlKSh0cmFuc0lkc0ZvclJlY29yZCkpIHtcbiAgICAgIGNvbnN0IHQgPSBhd2FpdCB2ZXJpZnkoZmluZChpc0RlbGV0ZSkodHJhbnNJZHNGb3JSZWNvcmQpKTtcbiAgICAgIGlmICh0LnZlcmlmaWVkKSB7IGRlZHVwZWRUcmFuc2FjdGlvbnMucHVzaCh0KTsgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChzb21lKGlzVXBkYXRlKSh0cmFuc0lkc0ZvclJlY29yZCkpIHtcbiAgICAgIGNvbnN0IHVwZCA9IGF3YWl0IHBpY2tPbmUodHJhbnNJZHNGb3JSZWNvcmQsIGlzVXBkYXRlKTtcbiAgICAgIGlmIChpc1NvbWV0aGluZyh1cGQpICYmIHVwZC52ZXJpZmllZCkgeyBkZWR1cGVkVHJhbnNhY3Rpb25zLnB1c2godXBkKTsgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChzb21lKGlzQ3JlYXRlKSh0cmFuc0lkc0ZvclJlY29yZCkpIHtcbiAgICAgIGNvbnN0IGNyZSA9IGF3YWl0IHBpY2tPbmUodHJhbnNJZHNGb3JSZWNvcmQsIGlzQ3JlYXRlKTtcbiAgICAgIGlmIChpc1NvbWV0aGluZyhjcmUpKSB7IGRlZHVwZWRUcmFuc2FjdGlvbnMucHVzaChjcmUpOyB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBkdXBsaWNhdGVzID0gJCh0cmFuc2FjdGlvbklkcywgW1xuICAgIGZpbHRlcih0ID0+IG5vbmUoZGR0ID0+IGRkdC51bmlxdWVJZCA9PT0gdC51bmlxdWVJZCkoZGVkdXBlZFRyYW5zYWN0aW9ucykpLFxuICBdKTtcblxuXG4gIGNvbnN0IGRlbGV0ZVByb21pc2VzID0gbWFwKHQgPT4gYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKFxuICAgIGpvaW5LZXkoXG4gICAgICBUUkFOU0FDVElPTlNfRk9MREVSLFxuICAgICAgZ2V0VHJhbnNhY3Rpb25JZChcbiAgICAgICAgdC5yZWNvcmRJZCxcbiAgICAgICAgdC50cmFuc2FjdGlvblR5cGUsXG4gICAgICAgIHQudW5pcXVlSWQsXG4gICAgICApLFxuICAgICksXG4gICkpKGR1cGxpY2F0ZXMpO1xuXG4gIGF3YWl0IFByb21pc2UuYWxsKGRlbGV0ZVByb21pc2VzKTtcblxuICByZXR1cm4gZGVkdXBlZFRyYW5zYWN0aW9ucztcbn07XG5cbmNvbnN0IHBhcnNlVHJhbnNhY3Rpb25JZCA9IChpZCkgPT4ge1xuICBjb25zdCBzcGxpdElkID0gc3BsaXQoaWRTZXApKGlkKTtcbiAgcmV0dXJuICh7XG4gICAgcmVjb3JkSWQ6IHNwbGl0SWRbMF0sXG4gICAgdHJhbnNhY3Rpb25UeXBlOiBzcGxpdElkWzFdLFxuICAgIHVuaXF1ZUlkOiBzcGxpdElkWzJdLFxuICAgIGZ1bGxJZDogaWQsXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IG9yZGVyQnkgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgcmVkdWNlLCBmaW5kLCBpbmNsdWRlcywgZmxhdHRlbiwgdW5pb24sXG4gIGZpbHRlciwgZWFjaCwgbWFwLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgam9pbktleSwgc3BsaXRLZXksIGlzTm9uRW1wdHlTdHJpbmcsXG4gIGlzTm90aGluZywgJCwgaXNTb21ldGhpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksIGdldE5vZGUsIGdldFJlY29yZE5vZGVJZCxcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCwgcmVjb3JkTm9kZUlkSXNBbGxvd2VkLFxuICBpc1JlY29yZCwgaXNHbG9iYWxJbmRleCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IGluZGV4VHlwZXMgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9pbmRleGVzJztcblxuZXhwb3J0IGNvbnN0IGdldFJlbGV2YW50QW5jZXN0b3JJbmRleGVzID0gKGFwcEhpZXJhcmNoeSwgcmVjb3JkKSA9PiB7XG4gIGNvbnN0IGtleSA9IHJlY29yZC5rZXk7XG4gIGNvbnN0IGtleVBhcnRzID0gc3BsaXRLZXkoa2V5KTtcbiAgY29uc3Qgbm9kZUlkID0gZ2V0UmVjb3JkTm9kZUlkKGtleSk7XG5cbiAgY29uc3QgZmxhdEhpZXJhcmNoeSA9IG9yZGVyQnkoZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGFwcEhpZXJhcmNoeSksXG4gICAgW25vZGUgPT4gbm9kZS5wYXRoUmVneCgpLmxlbmd0aF0sXG4gICAgWydkZXNjJ10pO1xuXG4gIGNvbnN0IG1ha2VpbmRleE5vZGVBbmRLZXlfRm9yQW5jZXN0b3JJbmRleCA9IChpbmRleE5vZGUsIGluZGV4S2V5KSA9PiBtYWtlSW5kZXhOb2RlQW5kS2V5KGluZGV4Tm9kZSwgam9pbktleShpbmRleEtleSwgaW5kZXhOb2RlLm5hbWUpKTtcblxuICBjb25zdCB0cmF2ZXJzZUFuY2VzdG9ySW5kZXhlc0luUGF0aCA9ICgpID0+IHJlZHVjZSgoYWNjLCBwYXJ0KSA9PiB7XG4gICAgY29uc3QgY3VycmVudEluZGV4S2V5ID0gam9pbktleShhY2MubGFzdEluZGV4S2V5LCBwYXJ0KTtcbiAgICBhY2MubGFzdEluZGV4S2V5ID0gY3VycmVudEluZGV4S2V5O1xuICAgIGNvbnN0IHRlc3RQYXRoUmVneCA9IHAgPT4gbmV3IFJlZ0V4cChgJHtwLnBhdGhSZWd4KCl9JGApLnRlc3QoY3VycmVudEluZGV4S2V5KTtcbiAgICBjb25zdCBub2RlTWF0Y2ggPSBmaW5kKHRlc3RQYXRoUmVneCkoZmxhdEhpZXJhcmNoeSk7XG5cbiAgICBpZiAoaXNOb3RoaW5nKG5vZGVNYXRjaCkpIHsgcmV0dXJuIGFjYzsgfVxuXG4gICAgaWYgKCFpc1JlY29yZChub2RlTWF0Y2gpXG4gICAgICAgICAgICAgICAgfHwgbm9kZU1hdGNoLmluZGV4ZXMubGVuZ3RoID09PSAwKSB7IHJldHVybiBhY2M7IH1cblxuICAgIGNvbnN0IGluZGV4ZXMgPSAkKG5vZGVNYXRjaC5pbmRleGVzLCBbXG4gICAgICBmaWx0ZXIoaSA9PiBpLmluZGV4VHlwZSA9PT0gaW5kZXhUeXBlcy5hbmNlc3RvclxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgKGkuYWxsb3dlZFJlY29yZE5vZGVJZHMubGVuZ3RoID09PSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgfHwgaW5jbHVkZXMobm9kZUlkKShpLmFsbG93ZWRSZWNvcmROb2RlSWRzKSkpLFxuICAgIF0pO1xuXG4gICAgZWFjaCh2ID0+IGFjYy5ub2Rlc0FuZEtleXMucHVzaChcbiAgICAgIG1ha2VpbmRleE5vZGVBbmRLZXlfRm9yQW5jZXN0b3JJbmRleCh2LCBjdXJyZW50SW5kZXhLZXkpLFxuICAgICkpKGluZGV4ZXMpO1xuXG4gICAgcmV0dXJuIGFjYztcbiAgfSwgeyBsYXN0SW5kZXhLZXk6ICcnLCBub2Rlc0FuZEtleXM6IFtdIH0pKGtleVBhcnRzKS5ub2Rlc0FuZEtleXM7XG5cbiAgY29uc3Qgcm9vdEluZGV4ZXMgPSAkKGZsYXRIaWVyYXJjaHksIFtcbiAgICBmaWx0ZXIobiA9PiBpc0dsb2JhbEluZGV4KG4pICYmIHJlY29yZE5vZGVJZElzQWxsb3dlZChuKShub2RlSWQpKSxcbiAgICBtYXAoaSA9PiBtYWtlSW5kZXhOb2RlQW5kS2V5KGksIGkubm9kZUtleSgpKSksXG4gIF0pO1xuXG4gIHJldHVybiB1bmlvbih0cmF2ZXJzZUFuY2VzdG9ySW5kZXhlc0luUGF0aCgpKShyb290SW5kZXhlcyk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0UmVsZXZhbnRSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyA9IChhcHBIaWVyYXJjaHksIHJlY29yZCkgPT4gJChyZWNvcmQua2V5LCBbXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwSGllcmFyY2h5KSxcbiAgbiA9PiBuLmZpZWxkcyxcbiAgZmlsdGVyKGYgPT4gZi50eXBlID09PSAncmVmZXJlbmNlJ1xuICAgICAgICAgICAgICAgICAgICAmJiBpc1NvbWV0aGluZyhyZWNvcmRbZi5uYW1lXSlcbiAgICAgICAgICAgICAgICAgICAgJiYgaXNOb25FbXB0eVN0cmluZyhyZWNvcmRbZi5uYW1lXS5rZXkpKSxcbiAgbWFwKGYgPT4gJChmLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzLCBbXG4gICAgbWFwKG4gPT4gKHtcbiAgICAgIHJlY29yZE5vZGU6IGdldE5vZGUoYXBwSGllcmFyY2h5LCBuKSxcbiAgICAgIGZpZWxkOiBmLFxuICAgIH0pKSxcbiAgXSkpLFxuICBmbGF0dGVuLFxuICBtYXAobiA9PiBtYWtlSW5kZXhOb2RlQW5kS2V5KFxuICAgIG4ucmVjb3JkTm9kZSxcbiAgICBqb2luS2V5KHJlY29yZFtuLmZpZWxkLm5hbWVdLmtleSwgbi5yZWNvcmROb2RlLm5hbWUpLFxuICApKSxcbl0pO1xuXG5jb25zdCBtYWtlSW5kZXhOb2RlQW5kS2V5ID0gKGluZGV4Tm9kZSwgaW5kZXhLZXkpID0+ICh7IGluZGV4Tm9kZSwgaW5kZXhLZXkgfSk7XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJlbGV2YW50QW5jZXN0b3JJbmRleGVzO1xuIiwiICAvLyBhZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2RleDRlci9qcy1wcm9taXNlLXdyaXRhYmxlXG4gIC8vIFRoYW5rIHlvdSA6KSBcbiAgZXhwb3J0IGNvbnN0IHByb21pc2VXcml0ZWFibGVTdHJlYW0gPSBzdHJlYW0gPT4ge1xuICBcbiAgICBsZXQgX2Vycm9yZWQ7XG4gIFxuICAgIGNvbnN0IF9lcnJvckhhbmRsZXIgPSBlcnIgPT4ge1xuICAgICAgICBfZXJyb3JlZCA9IGVycjtcbiAgICB9O1xuXG4gICAgc3RyZWFtLm9uKFwiZXJyb3JcIiwgX2Vycm9ySGFuZGxlcik7ICAgIFxuICBcbiAgICBjb25zdCB3cml0ZSA9IGNodW5rID0+IHsgIFxuICAgICAgbGV0IHJlamVjdGVkID0gZmFsc2U7XG4gIFxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKF9lcnJvcmVkKSB7XG4gICAgICAgICAgY29uc3QgZXJyID0gX2Vycm9yZWQ7XG4gICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBpZiAoIXN0cmVhbS53cml0YWJsZSB8fCBzdHJlYW0uY2xvc2VkIHx8IHN0cmVhbS5kZXN0cm95ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihcIndyaXRlIGFmdGVyIGVuZFwiKSk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IHdyaXRlRXJyb3JIYW5kbGVyID0gZXJyID0+IHtcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZWplY3RlZCA9IHRydWU7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIHN0cmVhbS5vbmNlKFwiZXJyb3JcIiwgd3JpdGVFcnJvckhhbmRsZXIpO1xuICBcbiAgICAgICAgY29uc3QgY2FuV3JpdGUgPSBzdHJlYW0ud3JpdGUoY2h1bmspO1xuICBcbiAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgd3JpdGVFcnJvckhhbmRsZXIpO1xuICBcbiAgICAgICAgaWYgKGNhbldyaXRlKSB7XG4gICAgICAgICAgaWYgKCFyZWplY3RlZCkge1xuICAgICAgICAgICAgcmVzb2x2ZShjaHVuay5sZW5ndGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBlcnJvckhhbmRsZXIgPSBlcnIgPT4ge1xuICAgICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgY29uc3QgZHJhaW5IYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICByZXNvbHZlKGNodW5rLmxlbmd0aCk7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICBjb25zdCBjbG9zZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHJlc29sdmUoY2h1bmsubGVuZ3RoKTtcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIGNvbnN0IGZpbmlzaEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHJlc29sdmUoY2h1bmsubGVuZ3RoKTtcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIGNvbnN0IHJlbW92ZUxpc3RlbmVycyA9ICgpID0+IHtcbiAgICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImNsb3NlXCIsIGNsb3NlSGFuZGxlcik7XG4gICAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJkcmFpblwiLCBkcmFpbkhhbmRsZXIpO1xuICAgICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImZpbmlzaFwiLCBmaW5pc2hIYW5kbGVyKTtcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIHN0cmVhbS5vbihcImNsb3NlXCIsIGNsb3NlSGFuZGxlcik7XG4gICAgICAgICAgc3RyZWFtLm9uKFwiZHJhaW5cIiwgZHJhaW5IYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5vbihcImZpbmlzaFwiLCBmaW5pc2hIYW5kbGVyKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIFxuICAgIGNvbnN0IGVuZCA9ICgpID0+IHtcbiAgXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoX2Vycm9yZWQpIHtcbiAgICAgICAgICBjb25zdCBlcnIgPSBfZXJyb3JlZDtcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGlmICghc3RyZWFtLndyaXRhYmxlIHx8IHN0cmVhbS5jbG9zZWQgfHwgc3RyZWFtLmRlc3Ryb3llZCkge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IGZpbmlzaEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCBlcnJvckhhbmRsZXIgPSAoZXJyKSA9PiB7XG4gICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IHJlbW92ZUxpc3RlbmVycyA9ICgpID0+IHtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImZpbmlzaFwiLCBmaW5pc2hIYW5kbGVyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgc3RyZWFtLm9uKFwiZmluaXNoXCIsIGZpbmlzaEhhbmRsZXIpO1xuICAgICAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xuICBcbiAgICAgICAgc3RyZWFtLmVuZCgpO1xuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4ge3dyaXRlLCBlbmR9O1xuICB9XG4gIFxuICBleHBvcnQgZGVmYXVsdCBwcm9taXNlV3JpdGVhYmxlU3RyZWFtXG4gICIsImltcG9ydCB7IGVuc3VyZVNoYXJkTmFtZUlzSW5TaGFyZE1hcCB9IGZyb20gJy4vc2hhcmRpbmcnO1xuaW1wb3J0IHsgZ2V0SW5kZXhXcml0ZXIgfSBmcm9tICcuL3NlcmlhbGl6ZXInO1xuaW1wb3J0IHsgaXNTaGFyZGVkSW5kZXggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHtwcm9taXNlV3JpdGVhYmxlU3RyZWFtfSBmcm9tIFwiLi9wcm9taXNlV3JpdGFibGVTdHJlYW1cIjtcbmltcG9ydCB7cHJvbWlzZVJlYWRhYmxlU3RyZWFtfSBmcm9tIFwiLi9wcm9taXNlUmVhZGFibGVTdHJlYW1cIjtcblxuZXhwb3J0IGNvbnN0IGFwcGx5VG9TaGFyZCA9IGFzeW5jIChoaWVyYXJjaHksIHN0b3JlLCBpbmRleEtleSxcbiAgaW5kZXhOb2RlLCBpbmRleFNoYXJkS2V5LCByZWNvcmRzVG9Xcml0ZSwga2V5c1RvUmVtb3ZlKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZUlmTm90RXhpc3RzID0gcmVjb3Jkc1RvV3JpdGUubGVuZ3RoID4gMDtcbiAgY29uc3Qgd3JpdGVyID0gYXdhaXQgZ2V0V3JpdGVyKGhpZXJhcmNoeSwgc3RvcmUsIGluZGV4S2V5LCBpbmRleFNoYXJkS2V5LCBpbmRleE5vZGUsIGNyZWF0ZUlmTm90RXhpc3RzKTtcbiAgaWYgKHdyaXRlciA9PT0gU0hBUkRfREVMRVRFRCkgcmV0dXJuO1xuXG4gIGF3YWl0IHdyaXRlci51cGRhdGVJbmRleChyZWNvcmRzVG9Xcml0ZSwga2V5c1RvUmVtb3ZlKTtcbiAgYXdhaXQgc3dhcFRlbXBGaWxlSW4oc3RvcmUsIGluZGV4U2hhcmRLZXkpO1xufTtcblxuY29uc3QgU0hBUkRfREVMRVRFRCA9ICdTSEFSRF9ERUxFVEVEJztcbmNvbnN0IGdldFdyaXRlciA9IGFzeW5jIChoaWVyYXJjaHksIHN0b3JlLCBpbmRleEtleSwgaW5kZXhlZERhdGFLZXksIGluZGV4Tm9kZSwgY3JlYXRlSWZOb3RFeGlzdHMpID0+IHtcbiAgbGV0IHJlYWRhYmxlU3RyZWFtID0gbnVsbDtcblxuICBpZiAoaXNTaGFyZGVkSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIGF3YWl0IGVuc3VyZVNoYXJkTmFtZUlzSW5TaGFyZE1hcChzdG9yZSwgaW5kZXhLZXksIGluZGV4ZWREYXRhS2V5KTtcbiAgICBpZighYXdhaXQgc3RvcmUuZXhpc3RzKGluZGV4ZWREYXRhS2V5KSkge1xuICAgICAgYXdhaXQgc3RvcmUuY3JlYXRlRmlsZShpbmRleGVkRGF0YUtleSwgXCJcIik7XG4gICAgfVxuICB9XG5cbiAgdHJ5IHtcblxuICAgIHJlYWRhYmxlU3RyZWFtID0gcHJvbWlzZVJlYWRhYmxlU3RyZWFtKFxuICAgICAgICBhd2FpdCBzdG9yZS5yZWFkYWJsZUZpbGVTdHJlYW0oaW5kZXhlZERhdGFLZXkpXG4gICAgKTtcblxuICB9IGNhdGNoIChlKSB7XG5cbiAgICBpZiAoYXdhaXQgc3RvcmUuZXhpc3RzKGluZGV4ZWREYXRhS2V5KSkge1xuICAgICAgdGhyb3cgZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNyZWF0ZUlmTm90RXhpc3RzKSB7IFxuICAgICAgICBhd2FpdCBzdG9yZS5jcmVhdGVGaWxlKGluZGV4ZWREYXRhS2V5LCAnJyk7IFxuICAgICAgfSBlbHNlIHsgXG4gICAgICAgIHJldHVybiBTSEFSRF9ERUxFVEVEOyBcbiAgICAgIH1cblxuICAgICAgcmVhZGFibGVTdHJlYW0gPSBwcm9taXNlUmVhZGFibGVTdHJlYW0oXG4gICAgICAgICAgYXdhaXQgc3RvcmUucmVhZGFibGVGaWxlU3RyZWFtKGluZGV4ZWREYXRhS2V5KVxuICAgICAgKTtcblxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHdyaXRhYmxlU3RyZWFtID0gcHJvbWlzZVdyaXRlYWJsZVN0cmVhbShcbiAgICAgIGF3YWl0IHN0b3JlLndyaXRhYmxlRmlsZVN0cmVhbShpbmRleGVkRGF0YUtleSArIFwiLnRlbXBcIilcbiAgKTtcblxuICByZXR1cm4gZ2V0SW5kZXhXcml0ZXIoXG4gICAgaGllcmFyY2h5LCBpbmRleE5vZGUsXG4gICAgICAgIHJlYWRhYmxlU3RyZWFtLCB3cml0YWJsZVN0cmVhbVxuICApO1xufTtcblxuY29uc3Qgc3dhcFRlbXBGaWxlSW4gPSBhc3luYyAoc3RvcmUsIGluZGV4ZWREYXRhS2V5LCBpc1JldHJ5ID0gZmFsc2UpID0+IHtcbiAgY29uc3QgdGVtcEZpbGUgPSBgJHtpbmRleGVkRGF0YUtleX0udGVtcGA7XG4gIHRyeSB7XG4gICAgYXdhaXQgc3RvcmUuZGVsZXRlRmlsZShpbmRleGVkRGF0YUtleSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBpZ25vcmUgZmFpbHVyZSwgaW5jYXNlIGl0IGhhcyBub3QgYmVlbiBjcmVhdGVkIHlldFxuICB9XG4gIHRyeSB7XG4gICAgYXdhaXQgc3RvcmUucmVuYW1lRmlsZSh0ZW1wRmlsZSwgaW5kZXhlZERhdGFLZXkpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gcmV0cnlpbmcgaW4gY2FzZSBkZWxldGUgZmFpbHVyZSB3YXMgZm9yIHNvbWUgb3RoZXIgcmVhc29uXG4gICAgaWYgKCFpc1JldHJ5KSB7XG4gICAgICBhd2FpdCBzd2FwVGVtcEZpbGVJbihzdG9yZSwgaW5kZXhlZERhdGFLZXksIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gc3dhcCBpbiBpbmRleCBmaWxlZDogXCIgKyBlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIGZpbHRlciwgbWFwLCBpc1VuZGVmaW5lZCwgaW5jbHVkZXMsXG4gIGZsYXR0ZW4sIGludGVyc2VjdGlvbkJ5LFxuICBpc0VxdWFsLCBwdWxsLCBrZXlzLFxuICBkaWZmZXJlbmNlQnksIGRpZmZlcmVuY2UsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyB1bmlvbiB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcyxcbiAgZ2V0UmVsZXZhbnRSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyxcbn0gZnJvbSAnLi4vaW5kZXhpbmcvcmVsZXZhbnQnO1xuaW1wb3J0IHsgZXZhbHVhdGUgfSBmcm9tICcuLi9pbmRleGluZy9ldmFsdWF0ZSc7XG5pbXBvcnQge1xuICAkLCBpc1NvbWV0aGluZyxcbiAgaXNOb25FbXB0eUFycmF5LCBqb2luS2V5LFxuICBpc05vbkVtcHR5U3RyaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0SW5kZXhlZERhdGFLZXkgfSBmcm9tICcuLi9pbmRleGluZy9zaGFyZGluZyc7XG5pbXBvcnQge1xuICBpc1VwZGF0ZSwgaXNDcmVhdGUsXG4gIGlzRGVsZXRlLCBpc0J1aWxkSW5kZXgsXG59IGZyb20gJy4vdHJhbnNhY3Rpb25zQ29tbW9uJztcbmltcG9ydCB7IGFwcGx5VG9TaGFyZCB9IGZyb20gJy4uL2luZGV4aW5nL2FwcGx5JztcbmltcG9ydCB7XG4gIGdldEFjdHVhbEtleU9mUGFyZW50LFxuICBpc0dsb2JhbEluZGV4LCBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleCwgaXNSZWZlcmVuY2VJbmRleCxcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcblxuZXhwb3J0IGNvbnN0IGV4ZWN1dGVUcmFuc2FjdGlvbnMgPSBhcHAgPT4gYXN5bmMgKHRyYW5zYWN0aW9ucykgPT4ge1xuICBjb25zdCByZWNvcmRzQnlTaGFyZCA9IG1hcHBlZFJlY29yZHNCeUluZGV4U2hhcmQoYXBwLmhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKTtcblxuICBmb3IgKGNvbnN0IHNoYXJkIG9mIGtleXMocmVjb3Jkc0J5U2hhcmQpKSB7XG4gICAgYXdhaXQgYXBwbHlUb1NoYXJkKFxuICAgICAgYXBwLmhpZXJhcmNoeSwgYXBwLmRhdGFzdG9yZSxcbiAgICAgIHJlY29yZHNCeVNoYXJkW3NoYXJkXS5pbmRleEtleSxcbiAgICAgIHJlY29yZHNCeVNoYXJkW3NoYXJkXS5pbmRleE5vZGUsXG4gICAgICBzaGFyZCxcbiAgICAgIHJlY29yZHNCeVNoYXJkW3NoYXJkXS53cml0ZXMsXG4gICAgICByZWNvcmRzQnlTaGFyZFtzaGFyZF0ucmVtb3ZlcyxcbiAgICApO1xuICB9XG59O1xuXG5jb25zdCBtYXBwZWRSZWNvcmRzQnlJbmRleFNoYXJkID0gKGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKSA9PiB7XG4gIGNvbnN0IHVwZGF0ZXMgPSBnZXRVcGRhdGVUcmFuc2FjdGlvbnNCeVNoYXJkKFxuICAgIGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zLFxuICApO1xuXG4gIGNvbnN0IGNyZWF0ZWQgPSBnZXRDcmVhdGVUcmFuc2FjdGlvbnNCeVNoYXJkKFxuICAgIGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zLFxuICApO1xuICBjb25zdCBkZWxldGVzID0gZ2V0RGVsZXRlVHJhbnNhY3Rpb25zQnlTaGFyZChcbiAgICBoaWVyYXJjaHksIHRyYW5zYWN0aW9ucyxcbiAgKTtcblxuICBjb25zdCBpbmRleEJ1aWxkID0gZ2V0QnVpbGRJbmRleFRyYW5zYWN0aW9uc0J5U2hhcmQoXG4gICAgaGllcmFyY2h5LFxuICAgIHRyYW5zYWN0aW9ucyxcbiAgKTtcblxuICBjb25zdCB0b1JlbW92ZSA9IFtcbiAgICAuLi5kZWxldGVzLFxuICAgIC4uLnVwZGF0ZXMudG9SZW1vdmUsXG4gIF07XG5cbiAgY29uc3QgdG9Xcml0ZSA9IFtcbiAgICAuLi5jcmVhdGVkLFxuICAgIC4uLnVwZGF0ZXMudG9Xcml0ZSxcbiAgICAuLi5pbmRleEJ1aWxkLFxuICBdO1xuXG4gIGNvbnN0IHRyYW5zQnlTaGFyZCA9IHt9O1xuXG4gIGNvbnN0IGluaXRpYWxpc2VTaGFyZCA9ICh0KSA9PiB7XG4gICAgaWYgKGlzVW5kZWZpbmVkKHRyYW5zQnlTaGFyZFt0LmluZGV4U2hhcmRLZXldKSkge1xuICAgICAgdHJhbnNCeVNoYXJkW3QuaW5kZXhTaGFyZEtleV0gPSB7XG4gICAgICAgIHdyaXRlczogW10sXG4gICAgICAgIHJlbW92ZXM6IFtdLFxuICAgICAgICBpbmRleEtleTogdC5pbmRleEtleSxcbiAgICAgICAgaW5kZXhOb2RlS2V5OiB0LmluZGV4Tm9kZUtleSxcbiAgICAgICAgaW5kZXhOb2RlOiB0LmluZGV4Tm9kZSxcbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG4gIGZvciAoY29uc3QgdHJhbnMgb2YgdG9Xcml0ZSkge1xuICAgIGluaXRpYWxpc2VTaGFyZCh0cmFucyk7XG4gICAgdHJhbnNCeVNoYXJkW3RyYW5zLmluZGV4U2hhcmRLZXldLndyaXRlcy5wdXNoKFxuICAgICAgdHJhbnMubWFwcGVkUmVjb3JkLnJlc3VsdCxcbiAgICApO1xuICB9XG5cbiAgZm9yIChjb25zdCB0cmFucyBvZiB0b1JlbW92ZSkge1xuICAgIGluaXRpYWxpc2VTaGFyZCh0cmFucyk7XG4gICAgdHJhbnNCeVNoYXJkW3RyYW5zLmluZGV4U2hhcmRLZXldLnJlbW92ZXMucHVzaChcbiAgICAgIHRyYW5zLm1hcHBlZFJlY29yZC5yZXN1bHQua2V5LFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gdHJhbnNCeVNoYXJkO1xufTtcblxuY29uc3QgZ2V0VXBkYXRlVHJhbnNhY3Rpb25zQnlTaGFyZCA9IChoaWVyYXJjaHksIHRyYW5zYWN0aW9ucykgPT4ge1xuICBjb25zdCB1cGRhdGVUcmFuc2FjdGlvbnMgPSAkKHRyYW5zYWN0aW9ucywgW2ZpbHRlcihpc1VwZGF0ZSldKTtcblxuICBjb25zdCBldmFsdWF0ZUluZGV4ID0gKHJlY29yZCwgaW5kZXhOb2RlQW5kUGF0aCkgPT4ge1xuICAgIGNvbnN0IG1hcHBlZFJlY29yZCA9IGV2YWx1YXRlKHJlY29yZCkoaW5kZXhOb2RlQW5kUGF0aC5pbmRleE5vZGUpO1xuICAgIHJldHVybiAoe1xuICAgICAgbWFwcGVkUmVjb3JkLFxuICAgICAgaW5kZXhOb2RlOiBpbmRleE5vZGVBbmRQYXRoLmluZGV4Tm9kZSxcbiAgICAgIGluZGV4S2V5OiBpbmRleE5vZGVBbmRQYXRoLmluZGV4S2V5LFxuICAgICAgaW5kZXhTaGFyZEtleTogZ2V0SW5kZXhlZERhdGFLZXkoXG4gICAgICAgIGluZGV4Tm9kZUFuZFBhdGguaW5kZXhOb2RlLFxuICAgICAgICBpbmRleE5vZGVBbmRQYXRoLmluZGV4S2V5LFxuICAgICAgICBtYXBwZWRSZWNvcmQucmVzdWx0LFxuICAgICAgKSxcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBnZXRJbmRleE5vZGVzVG9BcHBseSA9IGluZGV4RmlsdGVyID0+ICh0LCBpbmRleGVzKSA9PiAkKGluZGV4ZXMsIFtcbiAgICBtYXAobiA9PiAoe1xuICAgICAgb2xkOiBldmFsdWF0ZUluZGV4KHQub2xkUmVjb3JkLCBuKSxcbiAgICAgIG5ldzogZXZhbHVhdGVJbmRleCh0LnJlY29yZCwgbiksXG4gICAgfSkpLFxuICAgIGZpbHRlcihpbmRleEZpbHRlciksXG4gIF0pO1xuXG4gIGNvbnN0IHRvUmVtb3ZlRmlsdGVyID0gKG4sIGlzVW5yZWZlcmVuY2VkKSA9PiBuLm9sZC5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSB0cnVlXG4gICAgICAgICYmIChuLm5ldy5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSBmYWxzZVxuICAgICAgICAgICAgfHwgaXNVbnJlZmVyZW5jZWQpO1xuXG4gIGNvbnN0IHRvQWRkRmlsdGVyID0gKG4sIGlzTmV3bHlSZWZlcmVuY2VkKSA9PiAobi5vbGQubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gZmFsc2VcbiAgICAgICAgfHwgaXNOZXdseVJlZmVyZW5jZWQpXG4gICAgICAgICYmIG4ubmV3Lm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IHRydWU7XG5cbiAgY29uc3QgdG9VcGRhdGVGaWx0ZXIgPSBuID0+IG4ubmV3Lm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IHRydWVcbiAgICAgICAgJiYgbi5vbGQubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gdHJ1ZVxuICAgICAgICAmJiAhaXNFcXVhbChuLm9sZC5tYXBwZWRSZWNvcmQucmVzdWx0LFxuICAgICAgICAgIG4ubmV3Lm1hcHBlZFJlY29yZC5yZXN1bHQpO1xuXG4gIGNvbnN0IHRvUmVtb3ZlID0gW107XG4gIGNvbnN0IHRvV3JpdGUgPSBbXTtcblxuICBmb3IgKGNvbnN0IHQgb2YgdXBkYXRlVHJhbnNhY3Rpb25zKSB7XG4gICAgY29uc3QgYW5jZXN0b3JJZHhzID0gZ2V0UmVsZXZhbnRBbmNlc3RvckluZGV4ZXMoXG4gICAgICBoaWVyYXJjaHksIHQucmVjb3JkLFxuICAgICk7XG5cbiAgICBjb25zdCByZWZlcmVuY2VDaGFuZ2VzID0gZGlmZlJldmVyc2VSZWZGb3JVcGRhdGUoXG4gICAgICBoaWVyYXJjaHksIHQub2xkUmVjb3JkLCB0LnJlY29yZCxcbiAgICApO1xuXG4gICAgLy8gb2xkIHJlY29yZHMgdG8gcmVtb3ZlIChmaWx0ZXJlZCBvdXQpXG4gICAgY29uc3QgZmlsdGVyZWRPdXRfdG9SZW1vdmUgPSB1bmlvbihcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvUmVtb3ZlRmlsdGVyKSh0LCBhbmNlc3RvcklkeHMpLFxuICAgICAgLy8gc3RpbGwgcmVmZXJlbmNlZCAtIGNoZWNrIGZpbHRlclxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodG9SZW1vdmVGaWx0ZXIpKHQsIHJlZmVyZW5jZUNoYW5nZXMubm90Q2hhbmdlZCksXG4gICAgICAvLyB1biByZWZlcmVuY2VkIC0gcmVtb3ZlIGlmIGluIHRoZXJlIGFscmVhZHlcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KG4gPT4gdG9SZW1vdmVGaWx0ZXIobiwgdHJ1ZSkpKHQsIHJlZmVyZW5jZUNoYW5nZXMudW5SZWZlcmVuY2VkKSxcbiAgICApO1xuXG4gICAgLy8gbmV3IHJlY29yZHMgdG8gYWRkIChmaWx0ZXJlZCBpbilcbiAgICBjb25zdCBmaWx0ZXJlZEluX3RvQWRkID0gdW5pb24oXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b0FkZEZpbHRlcikodCwgYW5jZXN0b3JJZHhzKSxcbiAgICAgIC8vIG5ld2x5IHJlZmVyZW5jZWQgLSBjaGVjayBmaWx0ZXJcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KG4gPT4gdG9BZGRGaWx0ZXIobiwgdHJ1ZSkpKHQsIHJlZmVyZW5jZUNoYW5nZXMubmV3bHlSZWZlcmVuY2VkKSxcbiAgICAgIC8vIHJlZmVyZW5jZSB1bmNoYW5nZWQgLSByZXJ1biBmaWx0ZXIgaW4gY2FzZSBzb21ldGhpbmcgZWxzZSBjaGFuZ2VkXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b0FkZEZpbHRlcikodCwgcmVmZXJlbmNlQ2hhbmdlcy5ub3RDaGFuZ2VkKSxcbiAgICApO1xuXG4gICAgY29uc3QgY2hhbmdlZCA9IHVuaW9uKFxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodG9VcGRhdGVGaWx0ZXIpKHQsIGFuY2VzdG9ySWR4cyksXG4gICAgICAvLyBzdGlsbCByZWZlcmVuY2VkIC0gcmVjaGVjayBmaWx0ZXJcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvVXBkYXRlRmlsdGVyKSh0LCByZWZlcmVuY2VDaGFuZ2VzLm5vdENoYW5nZWQpLFxuICAgICk7XG5cbiAgICBjb25zdCBzaGFyZEtleUNoYW5nZWQgPSAkKGNoYW5nZWQsIFtcbiAgICAgIGZpbHRlcihjID0+IGMub2xkLmluZGV4U2hhcmRLZXkgIT09IGMubmV3LmluZGV4U2hhcmRLZXkpLFxuICAgIF0pO1xuXG4gICAgY29uc3QgY2hhbmdlZEluU2FtZVNoYXJkID0gJChzaGFyZEtleUNoYW5nZWQsIFtcbiAgICAgIGRpZmZlcmVuY2UoY2hhbmdlZCksXG4gICAgXSk7XG5cbiAgICBmb3IgKGNvbnN0IHJlcyBvZiBzaGFyZEtleUNoYW5nZWQpIHtcbiAgICAgIHB1bGwocmVzKShjaGFuZ2VkKTtcbiAgICAgIGZpbHRlcmVkT3V0X3RvUmVtb3ZlLnB1c2gocmVzKTtcbiAgICAgIGZpbHRlcmVkSW5fdG9BZGQucHVzaChyZXMpO1xuICAgIH1cblxuICAgIHRvUmVtb3ZlLnB1c2goXG4gICAgICAkKGZpbHRlcmVkT3V0X3RvUmVtb3ZlLCBbXG4gICAgICAgIG1hcChpID0+IGkub2xkKSxcbiAgICAgIF0pLFxuICAgICk7XG5cbiAgICB0b1dyaXRlLnB1c2goXG4gICAgICAkKGZpbHRlcmVkSW5fdG9BZGQsIFtcbiAgICAgICAgbWFwKGkgPT4gaS5uZXcpLFxuICAgICAgXSksXG4gICAgKTtcblxuICAgIHRvV3JpdGUucHVzaChcbiAgICAgICQoY2hhbmdlZEluU2FtZVNoYXJkLCBbXG4gICAgICAgIG1hcChpID0+IGkubmV3KSxcbiAgICAgIF0pLFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gKHtcbiAgICB0b1JlbW92ZTogZmxhdHRlbih0b1JlbW92ZSksXG4gICAgdG9Xcml0ZTogZmxhdHRlbih0b1dyaXRlKSxcbiAgfSk7XG59O1xuXG5jb25zdCBnZXRCdWlsZEluZGV4VHJhbnNhY3Rpb25zQnlTaGFyZCA9IChoaWVyYXJjaHksIHRyYW5zYWN0aW9ucykgPT4ge1xuICBjb25zdCBidWlsZFRyYW5zYWN0aW9ucyA9ICQodHJhbnNhY3Rpb25zLCBbZmlsdGVyKGlzQnVpbGRJbmRleCldKTtcbiAgaWYgKCFpc05vbkVtcHR5QXJyYXkoYnVpbGRUcmFuc2FjdGlvbnMpKSByZXR1cm4gW107XG4gIGNvbnN0IGluZGV4Tm9kZSA9IHRyYW5zYWN0aW9ucy5pbmRleE5vZGU7XG5cbiAgY29uc3QgZ2V0SW5kZXhLZXlzID0gKHQpID0+IHtcbiAgICBpZiAoaXNHbG9iYWxJbmRleChpbmRleE5vZGUpKSB7XG4gICAgICByZXR1cm4gW2luZGV4Tm9kZS5ub2RlS2V5KCldO1xuICAgIH1cblxuICAgIGlmIChpc1JlZmVyZW5jZUluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICAgIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGhpZXJhcmNoeSkodC5yZWNvcmQua2V5KTtcbiAgICAgIGNvbnN0IHJlZkZpZWxkcyA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICAgICAgZmlsdGVyKGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4KGluZGV4Tm9kZSkpLFxuICAgICAgXSk7XG4gICAgICBjb25zdCBpbmRleEtleXMgPSBbXTtcbiAgICAgIGZvciAoY29uc3QgcmVmRmllbGQgb2YgcmVmRmllbGRzKSB7XG4gICAgICAgIGNvbnN0IHJlZlZhbHVlID0gdC5yZWNvcmRbcmVmRmllbGQubmFtZV07XG4gICAgICAgIGlmIChpc1NvbWV0aGluZyhyZWZWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAmJiBpc05vbkVtcHR5U3RyaW5nKHJlZlZhbHVlLmtleSkpIHtcbiAgICAgICAgICBjb25zdCBpbmRleEtleSA9IGpvaW5LZXkoXG4gICAgICAgICAgICByZWZWYWx1ZS5rZXksXG4gICAgICAgICAgICBpbmRleE5vZGUubmFtZSxcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaWYgKCFpbmNsdWRlcyhpbmRleEtleSkoaW5kZXhLZXlzKSkgeyBpbmRleEtleXMucHVzaChpbmRleEtleSk7IH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGluZGV4S2V5cztcbiAgICB9XG5cbiAgICByZXR1cm4gW2pvaW5LZXkoXG4gICAgICBnZXRBY3R1YWxLZXlPZlBhcmVudChcbiAgICAgICAgaW5kZXhOb2RlLnBhcmVudCgpLm5vZGVLZXkoKSxcbiAgICAgICAgdC5yZWNvcmQua2V5LFxuICAgICAgKSxcbiAgICAgIGluZGV4Tm9kZS5uYW1lLFxuICAgICldO1xuICB9O1xuXG4gIHJldHVybiAkKGJ1aWxkVHJhbnNhY3Rpb25zLCBbXG4gICAgbWFwKCh0KSA9PiB7XG4gICAgICBjb25zdCBtYXBwZWRSZWNvcmQgPSBldmFsdWF0ZSh0LnJlY29yZCkoaW5kZXhOb2RlKTtcbiAgICAgIGlmICghbWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlcikgcmV0dXJuIG51bGw7XG4gICAgICBjb25zdCBpbmRleEtleXMgPSBnZXRJbmRleEtleXModCk7XG4gICAgICByZXR1cm4gJChpbmRleEtleXMsIFtcbiAgICAgICAgbWFwKGluZGV4S2V5ID0+ICh7XG4gICAgICAgICAgbWFwcGVkUmVjb3JkLFxuICAgICAgICAgIGluZGV4Tm9kZSxcbiAgICAgICAgICBpbmRleEtleSxcbiAgICAgICAgICBpbmRleFNoYXJkS2V5OiBnZXRJbmRleGVkRGF0YUtleShcbiAgICAgICAgICAgIGluZGV4Tm9kZSxcbiAgICAgICAgICAgIGluZGV4S2V5LFxuICAgICAgICAgICAgbWFwcGVkUmVjb3JkLnJlc3VsdCxcbiAgICAgICAgICApLFxuICAgICAgICB9KSksXG4gICAgICBdKTtcbiAgICB9KSxcbiAgICBmbGF0dGVuLFxuICAgIGZpbHRlcihpc1NvbWV0aGluZyksXG4gIF0pO1xufTtcblxuY29uc3QgZ2V0X0NyZWF0ZV9EZWxldGVfVHJhbnNhY3Rpb25zQnlTaGFyZCA9IHByZWQgPT4gKGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZVRyYW5zYWN0aW9ucyA9ICQodHJhbnNhY3Rpb25zLCBbZmlsdGVyKHByZWQpXSk7XG5cbiAgY29uc3QgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkgPSAodCwgaW5kZXhlcykgPT4gJChpbmRleGVzLCBbXG4gICAgbWFwKChuKSA9PiB7XG4gICAgICBjb25zdCBtYXBwZWRSZWNvcmQgPSBldmFsdWF0ZSh0LnJlY29yZCkobi5pbmRleE5vZGUpO1xuICAgICAgcmV0dXJuICh7XG4gICAgICAgIG1hcHBlZFJlY29yZCxcbiAgICAgICAgaW5kZXhOb2RlOiBuLmluZGV4Tm9kZSxcbiAgICAgICAgaW5kZXhLZXk6IG4uaW5kZXhLZXksXG4gICAgICAgIGluZGV4U2hhcmRLZXk6IGdldEluZGV4ZWREYXRhS2V5KFxuICAgICAgICAgIG4uaW5kZXhOb2RlLFxuICAgICAgICAgIG4uaW5kZXhLZXksXG4gICAgICAgICAgbWFwcGVkUmVjb3JkLnJlc3VsdCxcbiAgICAgICAgKSxcbiAgICAgIH0pO1xuICAgIH0pLFxuICAgIGZpbHRlcihuID0+IG4ubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciksXG4gIF0pO1xuXG4gIGNvbnN0IGFsbFRvQXBwbHkgPSBbXTtcblxuICBmb3IgKGNvbnN0IHQgb2YgY3JlYXRlVHJhbnNhY3Rpb25zKSB7XG4gICAgY29uc3QgYW5jZXN0b3JJZHhzID0gZ2V0UmVsZXZhbnRBbmNlc3RvckluZGV4ZXMoaGllcmFyY2h5LCB0LnJlY29yZCk7XG4gICAgY29uc3QgcmV2ZXJzZVJlZiA9IGdldFJlbGV2YW50UmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMoaGllcmFyY2h5LCB0LnJlY29yZCk7XG5cbiAgICBhbGxUb0FwcGx5LnB1c2goXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0LCBhbmNlc3RvcklkeHMpLFxuICAgICk7XG4gICAgYWxsVG9BcHBseS5wdXNoKFxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodCwgcmV2ZXJzZVJlZiksXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBmbGF0dGVuKGFsbFRvQXBwbHkpO1xufTtcblxuY29uc3QgZ2V0RGVsZXRlVHJhbnNhY3Rpb25zQnlTaGFyZCA9IGdldF9DcmVhdGVfRGVsZXRlX1RyYW5zYWN0aW9uc0J5U2hhcmQoaXNEZWxldGUpO1xuXG5jb25zdCBnZXRDcmVhdGVUcmFuc2FjdGlvbnNCeVNoYXJkID0gZ2V0X0NyZWF0ZV9EZWxldGVfVHJhbnNhY3Rpb25zQnlTaGFyZChpc0NyZWF0ZSk7XG5cbmNvbnN0IGRpZmZSZXZlcnNlUmVmRm9yVXBkYXRlID0gKGFwcEhpZXJhcmNoeSwgb2xkUmVjb3JkLCBuZXdSZWNvcmQpID0+IHtcbiAgY29uc3Qgb2xkSW5kZXhlcyA9IGdldFJlbGV2YW50UmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMoXG4gICAgYXBwSGllcmFyY2h5LCBvbGRSZWNvcmQsXG4gICk7XG4gIGNvbnN0IG5ld0luZGV4ZXMgPSBnZXRSZWxldmFudFJldmVyc2VSZWZlcmVuY2VJbmRleGVzKFxuICAgIGFwcEhpZXJhcmNoeSwgbmV3UmVjb3JkLFxuICApO1xuXG4gIGNvbnN0IHVuUmVmZXJlbmNlZCA9IGRpZmZlcmVuY2VCeShcbiAgICBpID0+IGkuaW5kZXhLZXksXG4gICAgb2xkSW5kZXhlcywgbmV3SW5kZXhlcyxcbiAgKTtcblxuICBjb25zdCBuZXdseVJlZmVyZW5jZWQgPSBkaWZmZXJlbmNlQnkoXG4gICAgaSA9PiBpLmluZGV4S2V5LFxuICAgIG5ld0luZGV4ZXMsIG9sZEluZGV4ZXMsXG4gICk7XG5cbiAgY29uc3Qgbm90Q2hhbmdlZCA9IGludGVyc2VjdGlvbkJ5KFxuICAgIGkgPT4gaS5pbmRleEtleSxcbiAgICBuZXdJbmRleGVzLCBvbGRJbmRleGVzLFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgdW5SZWZlcmVuY2VkLFxuICAgIG5ld2x5UmVmZXJlbmNlZCxcbiAgICBub3RDaGFuZ2VkLFxuICB9O1xufTtcbiIsImltcG9ydCB7IG1hcCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyByZXRyaWV2ZSB9IGZyb20gJy4vcmV0cmlldmUnO1xuaW1wb3J0IHsgZXhlY3V0ZVRyYW5zYWN0aW9ucyB9IGZyb20gJy4vZXhlY3V0ZSc7XG5pbXBvcnQge1xuICAkLCBqb2luS2V5LCBnZXRMb2NrLCBpc05vbG9jaywgcmVsZWFzZUxvY2ssXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBMT0NLX0ZJTEVfS0VZLCBUUkFOU0FDVElPTlNfRk9MREVSLFxuICB0aW1lb3V0TWlsbGlzZWNvbmRzLCBnZXRUcmFuc2FjdGlvbklkLFxuICBtYXhMb2NrUmV0cmllcyxcbn0gZnJvbSAnLi90cmFuc2FjdGlvbnNDb21tb24nO1xuXG5leHBvcnQgY29uc3QgY2xlYW51cCA9IGFzeW5jIChhcHApID0+IHtcbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldFRyYW5zYWN0aW9uTG9jayhhcHApO1xuICBpZiAoaXNOb2xvY2sobG9jaykpIHJldHVybjtcblxuICB0cnkge1xuICAgIGNvbnN0IHRyYW5zYWN0aW9ucyA9IGF3YWl0IHJldHJpZXZlKGFwcCk7XG4gICAgaWYgKHRyYW5zYWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBleGVjdXRlVHJhbnNhY3Rpb25zKGFwcCkodHJhbnNhY3Rpb25zKTtcblxuICAgICAgY29uc3QgZm9sZGVyID0gdHJhbnNhY3Rpb25zLmZvbGRlcktleVxuICAgICAgICA/IHRyYW5zYWN0aW9ucy5mb2xkZXJLZXlcbiAgICAgICAgOiBUUkFOU0FDVElPTlNfRk9MREVSO1xuXG4gICAgICBjb25zdCBkZWxldGVGaWxlcyA9ICQodHJhbnNhY3Rpb25zLCBbXG4gICAgICAgIG1hcCh0ID0+IGpvaW5LZXkoXG4gICAgICAgICAgZm9sZGVyLFxuICAgICAgICAgIGdldFRyYW5zYWN0aW9uSWQoXG4gICAgICAgICAgICB0LnJlY29yZElkLCB0LnRyYW5zYWN0aW9uVHlwZSxcbiAgICAgICAgICAgIHQudW5pcXVlSWQsXG4gICAgICAgICAgKSxcbiAgICAgICAgKSksXG4gICAgICAgIG1hcChhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUpLFxuICAgICAgXSk7XG5cbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKGRlbGV0ZUZpbGVzKTtcbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcbiAgfVxufTtcblxuY29uc3QgZ2V0VHJhbnNhY3Rpb25Mb2NrID0gYXN5bmMgYXBwID0+IGF3YWl0IGdldExvY2soXG4gIGFwcCwgTE9DS19GSUxFX0tFWSxcbiAgdGltZW91dE1pbGxpc2Vjb25kcywgbWF4TG9ja1JldHJpZXMsXG4pO1xuIiwiaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGNvbmZpZ0ZvbGRlciwgYXBwRGVmaW5pdGlvbkZpbGUsICQgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgVFJBTlNBQ1RJT05TX0ZPTERFUiB9IGZyb20gJy4uL3RyYW5zYWN0aW9ucy90cmFuc2FjdGlvbnNDb21tb24nO1xuaW1wb3J0IHsgQVVUSF9GT0xERVIsIFVTRVJTX0xJU1RfRklMRSwgQUNDRVNTX0xFVkVMU19GSUxFIH0gZnJvbSAnLi4vYXV0aEFwaS9hdXRoQ29tbW9uJztcbmltcG9ydCB7IGluaXRpYWxpc2VSb290Q29sbGVjdGlvbnMgfSBmcm9tICcuLi9jb2xsZWN0aW9uQXBpL2luaXRpYWxpc2UnO1xuaW1wb3J0IHsgaW5pdGlhbGlzZUluZGV4IH0gZnJvbSAnLi4vaW5kZXhpbmcvaW5pdGlhbGlzZUluZGV4JztcbmltcG9ydCB7IGdldEZsYXR0ZW5lZEhpZXJhcmNoeSwgaXNHbG9iYWxJbmRleCwgaXNTaW5nbGVSZWNvcmQgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgX3NhdmUgfSBmcm9tICcuLi9yZWNvcmRBcGkvc2F2ZSc7XG5pbXBvcnQgeyBnZXROZXcgfSBmcm9tICcuLi9yZWNvcmRBcGkvZ2V0TmV3JztcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxpc2VEYXRhID0gYXN5bmMgKGRhdGFzdG9yZSwgYXBwbGljYXRpb25EZWZpbml0aW9uLCBhY2Nlc3NMZXZlbHMpID0+IHtcbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihjb25maWdGb2xkZXIpO1xuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlSnNvbihhcHBEZWZpbml0aW9uRmlsZSwgYXBwbGljYXRpb25EZWZpbml0aW9uKTtcblxuICBhd2FpdCBpbml0aWFsaXNlUm9vdENvbGxlY3Rpb25zKGRhdGFzdG9yZSwgYXBwbGljYXRpb25EZWZpbml0aW9uLmhpZXJhcmNoeSk7XG4gIGF3YWl0IGluaXRpYWxpc2VSb290SW5kZXhlcyhkYXRhc3RvcmUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbi5oaWVyYXJjaHkpO1xuXG4gIGF3YWl0IGluaXRpYWxpc2VSb290U2luZ2xlUmVjb3JkcyhkYXRhc3RvcmUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbi5oaWVyYXJjaHkpO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoVFJBTlNBQ1RJT05TX0ZPTERFUik7XG5cbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihBVVRIX0ZPTERFUik7XG5cbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oVVNFUlNfTElTVF9GSUxFLCBbXSk7XG5cbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oXG4gICAgQUNDRVNTX0xFVkVMU19GSUxFLCBcbiAgICBhY2Nlc3NMZXZlbHMgPyBhY2Nlc3NMZXZlbHMgOiB7IHZlcnNpb246IDAsIGxldmVsczogW10gfSk7XG59O1xuXG5jb25zdCBpbml0aWFsaXNlUm9vdEluZGV4ZXMgPSBhc3luYyAoZGF0YXN0b3JlLCBoaWVyYXJjaHkpID0+IHtcbiAgY29uc3QgZmxhdGhpZXJhcmNoeSA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShoaWVyYXJjaHkpO1xuICBjb25zdCBnbG9iYWxJbmRleGVzID0gJChmbGF0aGllcmFyY2h5LCBbXG4gICAgZmlsdGVyKGlzR2xvYmFsSW5kZXgpLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IGluZGV4IG9mIGdsb2JhbEluZGV4ZXMpIHtcbiAgICBpZiAoIWF3YWl0IGRhdGFzdG9yZS5leGlzdHMoaW5kZXgubm9kZUtleSgpKSkgeyBhd2FpdCBpbml0aWFsaXNlSW5kZXgoZGF0YXN0b3JlLCAnJywgaW5kZXgpOyB9XG4gIH1cbn07XG5cbmNvbnN0IGluaXRpYWxpc2VSb290U2luZ2xlUmVjb3JkcyA9IGFzeW5jIChkYXRhc3RvcmUsIGhpZXJhY2h5KSA9PiB7XG4gIGNvbnN0IGZsYXRoaWVyYXJjaHkgPSBnZXRGbGF0dGVuZWRIaWVyYXJjaHkoaGllcmFjaHkpO1xuICBjb25zdCBzaW5nbGVSZWNvcmRzID0gJChmbGF0aGllcmFyY2h5LCBbXG4gICAgZmlsdGVyKGlzU2luZ2xlUmVjb3JkKSxcbiAgXSk7XG5cbiAgLyogZm9yIChsZXQgcmVjb3JkIG9mIHNpbmdsZVJlY29yZHMpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0TmV3KHsgZGF0YXN0b3JlOiBkYXRhc3RvcmUsIGhpZXJhcmNoeTogYXBwRGVmaW5pdGlvbi5oaWVyYXJjaHkgfSlcbiAgICAgICAgICAgIChyZWNvcmQubm9kZUtleSgpLFxuICAgICAgICAgICAgICAgIHJlY29yZC5uYW1lXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIF9zYXZlKHsgZGF0YXN0b3JlOiBkYXRhc3RvcmUsIGhpZXJhcmNoeTogYXBwRGVmaW5pdGlvbi5oaWVyYXJjaHkgfSxcbiAgICAgICAgICAgIHJlc3VsdFxuICAgICAgICApO1xuICAgIH0gKi9cbn07XG4iLCJpbXBvcnQgeyBpc05vdGhpbmcgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZ2V0RGF0YWJhc2VNYW5hZ2VyID0gZGF0YWJhc2VNYW5hZ2VyID0+ICh7XG4gIGNyZWF0ZUVtcHR5TWFzdGVyRGI6IGNyZWF0ZUVtcHR5TWFzdGVyRGIoZGF0YWJhc2VNYW5hZ2VyKSxcbiAgY3JlYXRlRW1wdHlJbnN0YW5jZURiOiBjcmVhdGVFbXB0eUluc3RhbmNlRGIoZGF0YWJhc2VNYW5hZ2VyKSxcbiAgZ2V0SW5zdGFuY2VEYlJvb3RDb25maWc6IGRhdGFiYXNlTWFuYWdlci5nZXRJbnN0YW5jZURiUm9vdENvbmZpZyxcbiAgbWFzdGVyRGF0YXN0b3JlQ29uZmlnOiBnZXRNYXN0ZXJEYXRhc3RvcmVDb25maWcoZGF0YWJhc2VNYW5hZ2VyKSxcbiAgZ2V0SW5zdGFuY2VEYXRhc3RvcmVDb25maWc6IGdldEluc3RhbmNlRGF0YXN0b3JlQ29uZmlnKGRhdGFiYXNlTWFuYWdlciksXG59KTtcblxuY29uc3QgZ2V0TWFzdGVyRGF0YXN0b3JlQ29uZmlnID0gZGF0YWJhc2VNYW5hZ2VyID0+IGRhdGFiYXNlTWFuYWdlci5nZXREYXRhc3RvcmVDb25maWcoJ21hc3RlcicpO1xuXG5jb25zdCBnZXRJbnN0YW5jZURhdGFzdG9yZUNvbmZpZyA9IGRhdGFiYXNlTWFuYWdlciA9PiAoYXBwbGljYXRpb25JZCwgaW5zdGFuY2VJZCkgPT4gZGF0YWJhc2VNYW5hZ2VyLmdldERhdGFzdG9yZUNvbmZpZyhcbiAgYXBwbGljYXRpb25JZCwgaW5zdGFuY2VJZCxcbik7XG5cbmNvbnN0IGNyZWF0ZUVtcHR5TWFzdGVyRGIgPSBkYXRhYmFzZU1hbmFnZXIgPT4gYXN5bmMgKCkgPT4gYXdhaXQgZGF0YWJhc2VNYW5hZ2VyLmNyZWF0ZUVtcHR5RGIoJ21hc3RlcicpO1xuXG5jb25zdCBjcmVhdGVFbXB0eUluc3RhbmNlRGIgPSBkYXRhYmFzZU1hbmFnZXIgPT4gYXN5bmMgKGFwcGxpY2F0aW9uSWQsIGluc3RhbmNlSWQpID0+IHtcbiAgaWYgKGlzTm90aGluZyhhcHBsaWNhdGlvbklkKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0ZURiOiBhcHBsaWNhdGlvbiBpZCBub3Qgc3VwcGxpZWQnKTsgfVxuICBpZiAoaXNOb3RoaW5nKGluc3RhbmNlSWQpKSB7IHRocm93IG5ldyBFcnJvcignQ3JlYXRlRGI6IGluc3RhbmNlIGlkIG5vdCBzdXBwbGllZCcpOyB9XG5cbiAgcmV0dXJuIGF3YWl0IGRhdGFiYXNlTWFuYWdlci5jcmVhdGVFbXB0eURiKFxuICAgIGFwcGxpY2F0aW9uSWQsXG4gICAgaW5zdGFuY2VJZCxcbiAgKTtcbn07XG4iLCJpbXBvcnQgZ2V0UmVjb3JkQXBpIGZyb20gXCIuL3JlY29yZEFwaVwiO1xuaW1wb3J0IGdldENvbGxlY3Rpb25BcGkgZnJvbSBcIi4vY29sbGVjdGlvbkFwaVwiO1xuaW1wb3J0IGdldEluZGV4QXBpIGZyb20gXCIuL2luZGV4QXBpXCI7XG5pbXBvcnQgZ2V0VGVtcGxhdGVBcGkgZnJvbSBcIi4vdGVtcGxhdGVBcGlcIjtcbmltcG9ydCBnZXRBdXRoQXBpIGZyb20gXCIuL2F1dGhBcGlcIjtcbmltcG9ydCBnZXRBY3Rpb25zQXBpIGZyb20gXCIuL2FjdGlvbnNBcGlcIjtcbmltcG9ydCB7c2V0dXBEYXRhc3RvcmUsIGNyZWF0ZUV2ZW50QWdncmVnYXRvcn0gZnJvbSBcIi4vYXBwSW5pdGlhbGlzZVwiO1xuaW1wb3J0IHtpbml0aWFsaXNlQWN0aW9uc30gZnJvbSBcIi4vYWN0aW9uc0FwaS9pbml0aWFsaXNlXCJcbmltcG9ydCB7aXNTb21ldGhpbmd9IGZyb20gXCIuL2NvbW1vblwiO1xuaW1wb3J0IHtjbGVhbnVwfSBmcm9tIFwiLi90cmFuc2FjdGlvbnMvY2xlYW51cFwiO1xuaW1wb3J0IHtnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9uc30gZnJvbSBcIi4vYXV0aEFwaS9nZW5lcmF0ZUZ1bGxQZXJtaXNzaW9uc1wiO1xuaW1wb3J0IHtnZXRBcHBsaWNhdGlvbkRlZmluaXRpb259IGZyb20gXCIuL3RlbXBsYXRlQXBpL2dldEFwcGxpY2F0aW9uRGVmaW5pdGlvblwiO1xuaW1wb3J0IGNvbW1vbiBmcm9tIFwiLi9jb21tb25cIjtcbmltcG9ydCB7Z2V0QmVoYXZpb3VyU291cmNlc30gZnJvbSBcIi4vdGVtcGxhdGVBcGkvZ2V0QmVoYXZpb3VyU291cmNlc1wiO1xuaW1wb3J0IGhpZXJhcmNoeSBmcm9tIFwiLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHlcIjtcblxuZXhwb3J0IGNvbnN0IGdldEFwcEFwaXMgPSBhc3luYyAoc3RvcmUsIGJlaGF2aW91clNvdXJjZXMgPSBudWxsLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYW51cFRyYW5zYWN0aW9ucyA9IG51bGwsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFcG9jaFRpbWUgPSBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcnlwdG8gPSBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBEZWZpbml0aW9uID0gbnVsbCkgPT4ge1xuXG4gICAgc3RvcmUgPSBzZXR1cERhdGFzdG9yZShzdG9yZSk7XG5cbiAgICBpZighYXBwRGVmaW5pdGlvbilcbiAgICAgICAgYXBwRGVmaW5pdGlvbiA9IGF3YWl0IGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbihzdG9yZSkoKTtcblxuICAgIGlmKCFiZWhhdmlvdXJTb3VyY2VzKVxuICAgICAgICBiZWhhdmlvdXJTb3VyY2VzID0gYXdhaXQgZ2V0QmVoYXZpb3VyU291cmNlcyhzdG9yZSk7XG5cbiAgICBjb25zdCBldmVudEFnZ3JlZ2F0b3IgPSBjcmVhdGVFdmVudEFnZ3JlZ2F0b3IoKTtcblxuICAgIGNvbnN0IGFwcCA9IHtcbiAgICAgICAgZGF0YXN0b3JlOnN0b3JlLFxuICAgICAgICBjcnlwdG8sXG4gICAgICAgIHB1Ymxpc2g6ZXZlbnRBZ2dyZWdhdG9yLnB1Ymxpc2gsXG4gICAgICAgIGhpZXJhcmNoeTphcHBEZWZpbml0aW9uLmhpZXJhcmNoeSxcbiAgICAgICAgYWN0aW9uczphcHBEZWZpbml0aW9uLmFjdGlvbnNcbiAgICB9O1xuXG4gICAgY29uc3QgdGVtcGxhdGVBcGkgPSBnZXRUZW1wbGF0ZUFwaShhcHApOyAgICBcblxuICAgIGFwcC5jbGVhbnVwVHJhbnNhY3Rpb25zID0gaXNTb21ldGhpbmcoY2xlYW51cFRyYW5zYWN0aW9ucykgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGNsZWFudXBUcmFuc2FjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogYXN5bmMgKCkgPT4gYXdhaXQgY2xlYW51cChhcHApO1xuXG4gICAgYXBwLmdldEVwb2NoVGltZSA9IGlzU29tZXRoaW5nKGdldEVwb2NoVGltZSlcbiAgICAgICAgICAgICAgICAgICAgICAgPyBnZXRFcG9jaFRpbWVcbiAgICAgICAgICAgICAgICAgICAgICAgOiBhc3luYyAoKSA9PiAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuXG4gICAgY29uc3QgcmVjb3JkQXBpID0gZ2V0UmVjb3JkQXBpKGFwcCk7XG4gICAgY29uc3QgY29sbGVjdGlvbkFwaSA9IGdldENvbGxlY3Rpb25BcGkoYXBwKTtcbiAgICBjb25zdCBpbmRleEFwaSA9IGdldEluZGV4QXBpKGFwcCk7XG4gICAgY29uc3QgYXV0aEFwaSA9IGdldEF1dGhBcGkoYXBwKTtcbiAgICBjb25zdCBhY3Rpb25zQXBpID0gZ2V0QWN0aW9uc0FwaShhcHApO1xuXG4gICAgY29uc3QgYXV0aGVudGljYXRlQXMgPSBhc3luYyAodXNlcm5hbWUsIHBhc3N3b3JkKSA9PiB7XG4gICAgICAgIGFwcC51c2VyID0gYXdhaXQgYXV0aEFwaS5hdXRoZW50aWNhdGUodXNlcm5hbWUsIHBhc3N3b3JkKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgd2l0aEZ1bGxBY2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgIGFwcC51c2VyID0ge1xuICAgICAgICAgICAgbmFtZTogXCJhcHBcIixcbiAgICAgICAgICAgIHBlcm1pc3Npb25zIDogZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMoYXBwKSxcbiAgICAgICAgICAgIGlzVXNlcjpmYWxzZSxcbiAgICAgICAgICAgIHRlbXA6ZmFsc2VcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBhc1VzZXIgPSAodXNlcikgPT4ge1xuICAgICAgICBhcHAudXNlciA9IHVzZXJcbiAgICB9O1xuXG4gICAgXG5cbiAgICBsZXQgYXBpcyA9IHtcbiAgICAgICAgcmVjb3JkQXBpLCBcbiAgICAgICAgdGVtcGxhdGVBcGksXG4gICAgICAgIGNvbGxlY3Rpb25BcGksXG4gICAgICAgIGluZGV4QXBpLFxuICAgICAgICBhdXRoQXBpLFxuICAgICAgICBhY3Rpb25zQXBpLFxuICAgICAgICBzdWJzY3JpYmU6IGV2ZW50QWdncmVnYXRvci5zdWJzY3JpYmUsXG4gICAgICAgIGF1dGhlbnRpY2F0ZUFzLFxuICAgICAgICB3aXRoRnVsbEFjY2VzcyxcbiAgICAgICAgYXNVc2VyXG4gICAgfTtcblxuICAgIGFwaXMuYWN0aW9ucyA9IGluaXRpYWxpc2VBY3Rpb25zKFxuICAgICAgICBldmVudEFnZ3JlZ2F0b3Iuc3Vic2NyaWJlLFxuICAgICAgICBiZWhhdmlvdXJTb3VyY2VzLFxuICAgICAgICBhcHBEZWZpbml0aW9uLmFjdGlvbnMsXG4gICAgICAgIGFwcERlZmluaXRpb24udHJpZ2dlcnMsXG4gICAgICAgIGFwaXMpO1xuXG5cbiAgICByZXR1cm4gYXBpcztcbn07XG5cbmV4cG9ydCB7ZXZlbnRzLCBldmVudHNMaXN0fSBmcm9tIFwiLi9jb21tb24vZXZlbnRzXCI7XG5leHBvcnQge2dldFRlbXBsYXRlQXBpfSBmcm9tIFwiLi90ZW1wbGF0ZUFwaVwiO1xuZXhwb3J0IHtnZXRSZWNvcmRBcGl9IGZyb20gXCIuL3JlY29yZEFwaVwiO1xuZXhwb3J0IHtnZXRDb2xsZWN0aW9uQXBpfSBmcm9tIFwiLi9jb2xsZWN0aW9uQXBpXCI7XG5leHBvcnQge2dldEF1dGhBcGl9IGZyb20gXCIuL2F1dGhBcGlcIjtcbmV4cG9ydCB7Z2V0SW5kZXhBcGl9IGZyb20gXCIuL2luZGV4QXBpXCI7XG5leHBvcnQge3NldHVwRGF0YXN0b3JlfSBmcm9tIFwiLi9hcHBJbml0aWFsaXNlXCI7XG5leHBvcnQge2dldEFjdGlvbnNBcGl9IGZyb20gXCIuL2FjdGlvbnNBcGlcIjtcbmV4cG9ydCB7aW5pdGlhbGlzZURhdGF9IGZyb20gXCIuL2FwcEluaXRpYWxpc2UvaW5pdGlhbGlzZURhdGFcIjtcbmV4cG9ydCB7Z2V0RGF0YWJhc2VNYW5hZ2VyfSBmcm9tIFwiLi9hcHBJbml0aWFsaXNlL2RhdGFiYXNlTWFuYWdlclwiO1xuZXhwb3J0IHtoaWVyYXJjaHl9O1xuZXhwb3J0IHtjb21tb259O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRBcHBBcGlzOyJdLCJuYW1lcyI6WyJ1bmlvbiIsInJlZHVjZSIsImdlbmVyYXRlIiwiaXNVbmRlZmluZWQiLCJjbG9uZURlZXAiLCJzcGxpdCIsImZsb3ciLCJ0cmltIiwicmVwbGFjZSIsImlzQXJyYXkiLCJqb2luIiwiZHJvcFJpZ2h0IiwidGFrZVJpZ2h0IiwiaGVhZCIsImlzTnVsbCIsImlzTmFOIiwiaXNFbXB0eSIsImNvbnN0YW50Iiwic29tZSIsImlzU3RyaW5nIiwidGFpbCIsImluY2x1ZGVzIiwic3RhcnRzV2l0aCIsImZpbmRJbmRleCIsImlzSW50ZWdlciIsImlzRGF0ZSIsInRvTnVtYmVyIiwibWFwIiwiZmlsdGVyIiwiY29tcGlsZUV4cHJlc3Npb24iLCJjb21waWxlQ29kZSIsImtleXMiLCJpc0Z1bmN0aW9uIiwiY291bnRCeSIsImxhc3QiLCJmaW5kIiwidGFrZSIsImZpcnN0IiwiaW50ZXJzZWN0aW9uIiwiaGFzIiwibWVyZ2UiLCJtYXBWYWx1ZXMiLCJtYWtlcnVsZSIsImlzQm9vbGVhbiIsIm9wdGlvbnMiLCJ0eXBlQ29uc3RyYWludHMiLCJpc051bWJlciIsImlzT2JqZWN0TGlrZSIsImFzc2lnbiIsImFsbCIsImdldERlZmF1bHRPcHRpb25zIiwidmFsaWRhdGVUeXBlQ29uc3RyYWludHMiLCJpc09iamVjdCIsImNsb25lIiwidmFsdWVzIiwia2V5QnkiLCJvcmRlckJ5IiwiY29uY2F0IiwicmV2ZXJzZSIsImdsb2JhbCIsImJhc2U2NC5mcm9tQnl0ZUFycmF5IiwiaWVlZTc1NC5yZWFkIiwiaWVlZTc1NC53cml0ZSIsImJhc2U2NC50b0J5dGVBcnJheSIsInJlYWQiLCJkaWZmZXJlbmNlIiwiQnVmZmVyIiwicmVhZEluZGV4IiwiZmxhdHRlbiIsImVhY2giLCJfIiwicHVsbCIsImRlbGV0ZVJlY29yZCIsInZhbGlkYXRlIiwibWF4IiwiZGVmYXVsdENhc2UiLCJldmVyeSIsInVuaXFCeSIsImFwaSIsImNyZWF0ZVRlbXBvcmFyeUFjY2VzcyIsImNyZWF0ZVVzZXIiLCJ1bmlxV2l0aCIsInNldFVzZXJBY2Nlc3NMZXZlbHMiLCJleGVjdXRlQWN0aW9uIiwiY0NvZGUiLCJjRXhwIiwiZ3JvdXBCeSIsImlzRXF1YWwiLCJkaWZmZXJlbmNlQnkiLCJpbnRlcnNlY3Rpb25CeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0VBRUEsTUFBTSxVQUFVLEdBQUcsS0FBSyxJQUFJQSxRQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7O0VBRS9FLE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztFQUVwQyxNQUFNLE9BQU8sR0FBRztFQUNoQixFQUFFLFNBQVMsRUFBRTtFQUNiLElBQUksSUFBSSxFQUFFLFVBQVUsQ0FBQztFQUNyQixNQUFNLFdBQVc7RUFDakIsTUFBTSxpQkFBaUI7RUFDdkIsTUFBTSxpQkFBaUIsQ0FBQyxDQUFDO0VBQ3pCLElBQUksTUFBTSxFQUFFLE1BQU0sRUFBRTtFQUNwQixJQUFJLFVBQVUsRUFBRSxNQUFNLEVBQUU7RUFDeEIsSUFBSSxNQUFNLEVBQUUsTUFBTSxFQUFFO0VBQ3BCLElBQUksSUFBSSxFQUFFLE1BQU0sRUFBRTtFQUNsQixJQUFJLFFBQVEsRUFBRSxNQUFNLEVBQUU7RUFDdEIsSUFBSSxVQUFVLEVBQUUsTUFBTSxFQUFFO0VBQ3hCLElBQUksWUFBWSxFQUFFLE1BQU0sRUFBRTtFQUMxQixHQUFHO0VBQ0gsRUFBRSxRQUFRLEVBQUU7RUFDWixJQUFJLFVBQVUsRUFBRSxNQUFNLEVBQUU7RUFDeEIsSUFBSSxTQUFTLEVBQUUsTUFBTSxFQUFFO0VBQ3ZCLElBQUksTUFBTSxFQUFFLE1BQU0sRUFBRTtFQUNwQixJQUFJLFVBQVUsRUFBRSxNQUFN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Q0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFLFlBQVksR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUM7O0VBRXhFO0VBQ0EsRUFBRSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxFQUFDOztFQUUzQztFQUNBLEVBQUUsQ0FBQyxHQUFHLFlBQVksR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFHOztFQUV0QyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUM7O0VBRVgsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtFQUM1QyxJQUFJLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQztFQUN0SyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEVBQUUsSUFBSSxLQUFJO0VBQ2pDLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEtBQUk7RUFDaEMsSUFBSSxH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RSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0VBQzFELEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBQztFQUNWLEVBQUUsSUFBSSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBQztFQUNsQyxFQUFFLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFDO0VBQzVCLEVBQUUsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUM7RUFDdkIsRUFBRSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUM7RUFDaEIsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFDO0VBQ2pDLEVBQUUsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUM7RUFDdkIsRUFBRSxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBQzs7RUFFNUIsRUFBRSxDQUFDLElBQUksRUFBQzs7RUFFUixFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUM7RUFDL0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUM7RUFDaEIsRUFBRSxLQUFLLElBQUksS0FBSTtFQUNmLEVBQUUsT0FBTyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLEVBQUU7O0VBRTVFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBQztFQUMvQixFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBQztFQUNoQixFQUFFLEtBQUssSUFBSSxLQUFJO0VB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T0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUM7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDbEQsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDOUM7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7O0lBRWxELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDbkM7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7O0lBRWxELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsU0FBUztPQUM3QixDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElB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QU0sQ0FBQyxJQUFJLEVBQUU7T0FDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNyQjs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxTQUFTLFdBQVcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0lBQ3JFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztJQUNsRCxPQUFPQyxJQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvQzs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxTQUFTLFdBQVcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0lBQ3JFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztJQUNsRCxPQUFPQSxJQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNoRDs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxTQUFTLFlBQVksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0lBQ3ZFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztJQUNsRCxPQUFPQSxJQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvQzs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxTQUFTLFlBQVksRUFBRSxNQUFNLEVB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QUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUNoRixLQUFLLEdBQUcsQ0FBQyxNQUFLO0lBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0lBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO0lBQzFELElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO01BQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxFQUFDO01BQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBQztLQUNqQyxNQUFNO01BQ0wsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO0tBQzdDO0lBQ0QsT0FBTyxNQUFNLEdBQUcsQ0FBQztJQUNsQjs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxTQUFTLGFBQWEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUNoRixLQUFLLEdBQUcsQ0FBQyxNQUFLO0lBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0lBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO0lBQzFELElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO01BQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFDO01BQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksRUFBQztLQUNsQyxNQUFNO01BQ0wsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDO0tBQzlDO0lBQ0QsT0FBTyxNQUFNLEdBQUcsQ0FBQztJQUNsQjs7RUFFRCxTQUFTLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRTtJQUM1RCxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLFVBQVUsR0FBRyxLQUFLLEdBQUcsRUFBQztJQUM3QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO01BQ2hFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEtBQUssQ0FBQyxZQUFZLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUk7S0FDcEU7R0FDRjs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxTQUFTLGFBQWEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUNoRixLQUFLLEdBQUcsQ0FBQyxNQUFLO0lBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0lBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFDO0lBQzlELElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO01BQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUUsRUFBQztNQUNqQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUM7TUFDakMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFDO01BQ2hDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxFQUFDO0tBQzlCLE1BQU07TUFDTCxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUM7S0FDN0M7SUFDRCxPQUFPLE1BQU0sR0FBRyxDQUFDO0lBQ2xCOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxHQUFHLFNBQVMsYUFBYSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0lBQ2hGLEtBQUssR0FBRyxDQUFDLE1BQUs7SUFDZCxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUM7SUFDbkIsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUM7SUFDOUQsSUFBSSxNQUFNLENBQUMsbUJBQW1CLEVBQUU7TUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUM7TUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFDO01BQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBQztNQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLEVBQUM7S0FDbEMsTUFBTTtNQUNMLGlCQUFpQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQztLQUM5QztJQUNELE9BQU8sTUFBTSxHQUFHLENBQUM7SUFDbEI7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsU0FBUyxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFO0lBQ3RGLEtBQUssR0FBRyxDQUFDLE1BQUs7SUFDZCxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUM7SUFDbkIsSUFBSSxDQUFDLFFBQVEsRUFBRTtNQUNiLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFDOztNQUUzQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUM7S0FDN0Q7O0lBRUQsSUFBSSxDQUFDLEdBQUcsRUFBQztJQUNULElBQUksR0FBRyxHQUFHLEVBQUM7SUFDWCxJQUFJLEdBQUcsR0FBRyxFQUFDO0lBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssR0FBRyxLQUFJO0lBQzNCLE9BQU8sRUFBRSxDQUFDLEdBQUcsVUFBVSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRTtNQUN6QyxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDeEQsR0FBRyxHQUFHLEVBQUM7T0FDUjtNQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxLQUFJO0tBQ3JEOztJQUVELE9BQU8sTUFBTSxHQUFHLFVBQVU7SUFDM0I7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsU0FBUyxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFO0lBQ3RGLEtBQUssR0FBRyxDQUFDLE1BQUs7SUFDZCxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUM7SUFDbkIsSUFBSSxDQUFDLFFBQVEsRUFBRTtNQUNiLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFDOztNQUUzQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUM7S0FDN0Q7O0lBRUQsSUFBSSxDQUFDLEdBQUcsVUFBVSxHQUFHLEVBQUM7SUFDdEIsSUFBSSxHQUFHLEdBQUcsRUFBQztJQUNYLElBQUksR0FBRyxHQUFHLEVBQUM7SUFDWCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxLQUFJO0lBQy9CLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRTtNQUNqQyxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDeEQsR0FBRyxHQUFHLEVBQUM7T0FDUjtNQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxLQUFJO0tBQ3JEOztJQUVELE9BQU8sTUFBTSxHQUFHLFVBQVU7SUFDM0I7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7SUFDeEUsS0FBSyxHQUFHLENBQUMsTUFBSztJQUNkLE1BQU0sR0FBRyxNQUFNLEdBQUcsRUFBQztJQUNuQixJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFDO0lBQzVELElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFDO0lBQzFELElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsSUFBSSxHQUFHLEtBQUssR0FBRyxFQUFDO0lBQ3ZDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxFQUFDO0lBQzdCLE9BQU8sTUFBTSxHQUFHLENBQUM7SUFDbEI7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7SUFDOUUsS0FBSyxHQUFHLENBQUMsTUFBSztJQUNkLE1BQU0sR0FBRyxNQUFNLEdBQUcsRUFBQztJQUNuQixJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFDO0lBQ2hFLElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO01BQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxFQUFDO01BQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBQztLQUNqQyxNQUFNO01BQ0wsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO0tBQzdDO0lBQ0QsT0FBTyxNQUFNLEdBQUcsQ0FBQztJQUNsQjs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxTQUFTLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUM5RSxLQUFLLEdBQUcsQ0FBQyxNQUFLO0lBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0lBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUM7SUFDaEUsSUFBSSxNQUFNLENBQUMsbUJBQW1CLEVBQUU7TUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUM7TUFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxFQUFDO0tBQ2xDLE1BQU07TUFDTCxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUM7S0FDOUM7SUFDRCxPQUFPLE1BQU0sR0FBRyxDQUFDO0lBQ2xCOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0lBQzlFLEtBQUssR0FBRyxDQUFDLE1BQUs7SUFDZCxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUM7SUFDbkIsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLFVBQVUsRUFBQztJQUN4RSxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRTtNQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksRUFBQztNQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUM7TUFDaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFDO01BQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUUsRUFBQztLQUNsQyxNQUFNO01BQ0wsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO0tBQzdDO0lBQ0QsT0FBTyxNQUFNLEdBQUcsQ0FBQztJQUNsQjs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxTQUFTLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUM5RSxLQUFLLEdBQUcsQ0FBQyxNQUFLO0lBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0lBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxVQUFVLEVBQUM7SUFDeEUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxVQUFVLEdBQUcsS0FBSyxHQUFHLEVBQUM7SUFDN0MsSUFBSSxNQUFNLENBQUMsbUJBQW1CLEVBQUU7TUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUM7TUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFDO01BQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBQztNQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLEVBQUM7S0FDbEMsTUFBTTtNQUNMLGlCQUFpQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQztLQUM5QztJQUNELE9BQU8sTUFBTSxHQUFHLENBQUM7SUFDbEI7O0VBRUQsU0FBUyxZQUFZLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUU7SUFDeEQsSUFBSSxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxJQUFJLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQztJQUN6RSxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxJQUFJLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQztHQUMzRDs7RUFFRCxTQUFTLFVBQVUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFO0lBQy9ELElBQUksQ0FBQyxRQUFRLEVBQUU7TUFDYixZQUFZLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxBQUFpRCxFQUFDO0tBQ3JGO0lBQ0RDLEtBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBQztJQUN0RCxPQUFPLE1BQU0sR0FBRyxDQUFDO0dBQ2xCOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0lBQzlFLE9BQU8sVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUM7SUFDdkQ7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7SUFDOUUsT0FBTyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQztJQUN4RDs7RUFFRCxTQUFTLFdBQVcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFO0lBQ2hFLElBQUksQ0FBQyxRQUFRLEVBQUU7TUFDYixZQUFZLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxBQUFtRCxFQUFDO0tBQ3ZGO0lBQ0RBLEtBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBQztJQUN0RCxPQUFPLE1BQU0sR0FBRyxDQUFDO0dBQ2xCOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxHQUFHLFNBQVMsYUFBYSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0lBQ2hGLE9BQU8sV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUM7SUFDeEQ7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsU0FBUyxhQUFhLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7SUFDaEYsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQztJQUN6RDs7O0VBR0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsU0FBUyxJQUFJLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFO0lBQ3RFLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxHQUFHLEVBQUM7SUFDckIsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTTtJQUN4QyxJQUFJLFdBQVcsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLFdBQVcsR0FBRyxNQUFNLENBQUMsT0FBTTtJQUM3RCxJQUFJLENBQUMsV0FBVyxFQUFFLFdBQVcsR0FBRyxFQUFDO0lBQ2pDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQUcsR0FBRyxNQUFLOzs7SUFHdkMsSUFBSSxHQUFHLEtBQUssS0FBSyxFQUFFLE9BQU8sQ0FBQztJQUMzQixJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE9BQU8sQ0FBQzs7O0lBR3RELElBQUksV0FBVyxHQUFHLENBQUMsRUFBRTtNQUNuQixNQUFNLElBQUksVUFBVSxDQUFDLDJCQUEyQixDQUFDO0tBQ2xEO0lBQ0QsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sSUFBSSxVQUFVLENBQUMsMkJBQTJCLENBQUM7SUFDeEYsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLE1BQU0sSUFBSSxVQUFVLENBQUMseUJBQXlCLENBQUM7OztJQUc1RCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTTtJQUN4QyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsV0FBVyxHQUFHLEdBQUcsR0FBRyxLQUFLLEVBQUU7TUFDN0MsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsV0FBVyxHQUFHLE1BQUs7S0FDMUM7O0lBRUQsSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLE1BQUs7SUFDckIsSUFBSSxFQUFDOztJQUVMLElBQUksSUFBSSxLQUFLLE1BQU0sSUFBSSxLQUFLLEdBQUcsV0FBVyxJQUFJLFdBQVcsR0FBRyxHQUFHLEVBQUU7O01BRS9ELEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUM3QixNQUFNLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFDO09BQzFDO0tBQ0YsTUFBTSxJQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUU7O01BRXBELEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ3hCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUM7T0FDMUM7S0FDRixNQUFNO01BQ0wsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSTtRQUMzQixNQUFNO1FBQ04sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUNqQyxXQUFXO1FBQ1o7S0FDRjs7SUFFRCxPQUFPLEdBQUc7SUFDWDs7Ozs7O0VBTUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsU0FBUyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFOztJQUVoRSxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtNQUMzQixJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtRQUM3QixRQUFRLEdBQUcsTUFBSztRQUNoQixLQUFLLEdBQUcsRUFBQztRQUNULEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTTtPQUNsQixNQUFNLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1FBQ2xDLFFBQVEsR0FBRyxJQUFHO1FBQ2QsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFNO09BQ2xCO01BQ0QsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUNwQixJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBQztRQUM1QixJQUFJLElBQUksR0FBRyxHQUFHLEVBQUU7VUFDZCxHQUFHLEdBQUcsS0FBSTtTQUNYO09BQ0Y7TUFDRCxJQUFJLFFBQVEsS0FBSyxTQUFTLElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxFQUFFO1FBQzFELE1BQU0sSUFBSSxTQUFTLENBQUMsMkJBQTJCLENBQUM7T0FDakQ7TUFDRCxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDaEUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxvQkFBb0IsR0FBRyxRQUFRLENBQUM7T0FDckQ7S0FDRixNQUFNLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO01BQ2xDLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBRztLQUNoQjs7O0lBR0QsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFO01BQ3pELE1BQU0sSUFBSSxVQUFVLENBQUMsb0JBQW9CLENBQUM7S0FDM0M7O0lBRUQsSUFBSSxHQUFHLElBQUksS0FBSyxFQUFFO01BQ2hCLE9BQU8sSUFBSTtLQUNaOztJQUVELEtBQUssR0FBRyxLQUFLLEtBQUssRUFBQztJQUNuQixHQUFHLEdBQUcsR0FBRyxLQUFLLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFDOztJQUVqRCxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxFQUFDOztJQUVqQixJQUFJLEVBQUM7SUFDTCxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtNQUMzQixLQUFLLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUM1QixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBRztPQUNkO0tBQ0YsTUFBTTtNQUNMLElBQUksS0FBSyxHQUFHLGdCQUFnQixDQUFDLEdBQUcsQ0FBQztVQUM3QixHQUFHO1VBQ0gsV0FBVyxDQUFDLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBQztNQUNyRCxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsT0FBTTtNQUN0QixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDaEMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBQztPQUNqQztLQUNGOztJQUVELE9BQU8sSUFBSTtJQUNaOzs7OztFQUtELElBQUksaUJBQWlCLEdBQUcscUJBQW9COztFQUU1QyxTQUFTLFdBQVcsRUFBRSxHQUFHLEVBQUU7O0lBRXpCLEdBQUcsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsRUFBQzs7SUFFcEQsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUU7O0lBRTdCLE9BQU8sR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQzNCLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBRztLQUNoQjtJQUNELE9BQU8sR0FBRztHQUNYOztFQUVELFNBQVMsVUFBVSxFQUFFLEdBQUcsRUFBRTtJQUN4QixJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFO0lBQy9CLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDO0dBQ3JDOztFQUVELFNBQVMsS0FBSyxFQUFFLENBQUMsRUFBRTtJQUNqQixJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7SUFDdkMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztHQUN0Qjs7RUFFRCxTQUFTLFdBQVcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO0lBQ25DLEtBQUssR0FBRyxLQUFLLElBQUksU0FBUTtJQUN6QixJQUFJLFVBQVM7SUFDYixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTTtJQUMxQixJQUFJLGFBQWEsR0FBRyxLQUFJO0lBQ3hCLElBQUksS0FBSyxHQUFHLEdBQUU7O0lBRWQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtNQUMvQixTQUFTLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUM7OztNQUdoQyxJQUFJLFNBQVMsR0FBRyxNQUFNLElBQUksU0FBUyxHQUFHLE1BQU0sRUFBRTs7UUFFNUMsSUFBSSxDQUFDLGFBQWEsRUFBRTs7VUFFbEIsSUFBSSxTQUFTLEdBQUcsTUFBTSxFQUFFOztZQUV0QixJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDO1lBQ25ELFFBQVE7V0FDVCxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxNQUFNLEVBQUU7O1lBRTNCLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUM7WUFDbkQsUUFBUTtXQUNUOzs7VUFHRCxhQUFhLEdBQUcsVUFBUzs7VUFFekIsUUFBUTtTQUNUOzs7UUFHRCxJQUFJLFNBQVMsR0FBRyxNQUFNLEVBQUU7VUFDdEIsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQztVQUNuRCxhQUFhLEdBQUcsVUFBUztVQUN6QixRQUFRO1NBQ1Q7OztRQUdELFNBQVMsR0FBRyxDQUFDLGFBQWEsR0FBRyxNQUFNLElBQUksRUFBRSxHQUFHLFNBQVMsR0FBRyxNQUFNLElBQUksUUFBTztPQUMxRSxNQUFNLElBQUksYUFBYSxFQUFFOztRQUV4QixJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDO09BQ3BEOztNQUVELGFBQWEsR0FBRyxLQUFJOzs7TUFHcEIsSUFBSSxTQUFTLEdBQUcsSUFBSSxFQUFFO1FBQ3BCLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLO1FBQzNCLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFDO09BQ3RCLE1BQU0sSUFBSSxTQUFTLEdBQUcsS0FBSyxFQUFFO1FBQzVCLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLO1FBQzNCLEtBQUssQ0FBQyxJQUFJO1VBQ1IsU0FBUyxJQUFJLEdBQUcsR0FBRyxJQUFJO1VBQ3ZCLFNBQVMsR0FBRyxJQUFJLEdBQUcsSUFBSTtVQUN4QjtPQUNGLE1BQU0sSUFBSSxTQUFTLEdBQUcsT0FBTyxFQUFFO1FBQzlCLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLO1FBQzNCLEtBQUssQ0FBQyxJQUFJO1VBQ1IsU0FBUyxJQUFJLEdBQUcsR0FBRyxJQUFJO1VBQ3ZCLFNBQVMsSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUk7VUFDOUIsU0FBUyxHQUFHLElBQUksR0FBRyxJQUFJO1VBQ3hCO09BQ0YsTUFBTSxJQUFJLFNBQVMsR0FBRyxRQUFRLEVBQUU7UUFDL0IsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUs7UUFDM0IsS0FBSyxDQUFDLElBQUk7VUFDUixTQUFTLElBQUksSUFBSSxHQUFHLElBQUk7VUFDeEIsU0FBUyxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsSUFBSTtVQUM5QixTQUFTLElBQUksR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJO1VBQzlCLFNBQVMsR0FBRyxJQUFJLEdBQUcsSUFBSTtVQUN4QjtPQUNGLE1BQU07UUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDO09BQ3RDO0tBQ0Y7O0lBRUQsT0FBTyxLQUFLO0dBQ2I7O0VBRUQsU0FBUyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQzFCLElBQUksU0FBUyxHQUFHLEdBQUU7SUFDbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7O01BRW5DLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUM7S0FDekM7SUFDRCxPQUFPLFNBQVM7R0FDakI7O0VBRUQsU0FBUyxjQUFjLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtJQUNuQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRTtJQUNiLElBQUksU0FBUyxHQUFHLEdBQUU7SUFDbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7TUFDbkMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUs7O01BRTNCLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBQztNQUNyQixFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUM7TUFDWCxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUc7TUFDWixTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBQztNQUNsQixTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBQztLQUNuQjs7SUFFRCxPQUFPLFNBQVM7R0FDakI7OztFQUdELFNBQVMsYUFBYSxFQUFFLEdBQUcsRUFBRTtJQUMzQixPQUFPQyxXQUFrQixDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUM1Qzs7RUFFRCxTQUFTLFVBQVUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7SUFDN0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtNQUMvQixJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sSUFBSSxHQUFHLENBQUMsTUFBTSxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSztNQUMxRCxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUM7S0FDekI7SUFDRCxPQUFPLENBQUM7R0FDVDs7RUFFRCxTQUFTLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFDbkIsT0FBTyxHQUFHLEtBQUssR0FBRztHQUNuQjs7Ozs7O0FBTUQsRUFBTyxTQUFTLFFBQVEsQ0FBQyxHQUFHLEVBQUU7SUFDNUIsT0FBTyxHQUFHLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDbEY7O0VBRUQsU0FBUyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQzFCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLElBQUksT0FBTyxHQUFHLENBQUMsV0FBVyxDQUFDLFFBQVEsS0FBSyxVQUFVLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO0dBQzVHOzs7RUFHRCxTQUFTLFlBQVksRUFBRSxHQUFHLEVBQUU7SUFDMUIsT0FBTyxPQUFPLEdBQUcsQ0FBQyxXQUFXLEtBQUssVUFBVSxJQUFJLE9BQU8sR0FBRyxDQUFDLEtBQUssS0FBSyxVQUFVLElBQUksWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0dBQ2pIOztFQ2h4REQ7QUFDQSxFQXFCQSxJQUFJLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxVQUFVO0VBQ3hDLEtBQUssU0FBUyxRQUFRLEVBQUU7RUFDeEIsT0FBTyxRQUFRLFFBQVEsSUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFO0VBQ2pELFNBQVMsS0FBSyxLQUFLLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsS0FBSyxNQUFNLENBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsS0FBSyxVQUFVLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRSxPQUFPLElBQUksQ0FBQztFQUNoTCxTQUFTLFNBQVMsT0FBTyxLQUFLLENBQUM7RUFDL0IsUUFBUTtFQUNSLE9BQU07OztFQUdOLFNBQVMsY0FBYyxDQUFDLFFBQVEsRUFBRTtFQUNsQyxFQUFFLElBQUksUUFBUSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEVBQUU7RUFDL0MsSUFBSSxNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixHQUFHLFFBQVEsQ0FBQyxDQUFDO0VBQ3JELEdBQUc7RUFDSCxDQUFDOztFQUVEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7QUFDQSxFQUFPLFNBQVMsYUFBYSxDQUFDLFFBQVEsRUFBRTtFQUN4QyxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxRQUFRLElBQUksTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7RUFDekUsRUFBRSxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDM0IsRUFBRSxRQUFRLElBQUksQ0FBQyxRQUFRO0VBQ3ZCLElBQUksS0FBSyxNQUFNO0VBQ2Y7RUFDQSxNQUFNLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO0VBQzdCLE1BQU0sTUFBTTtFQUNaLElBQUksS0FBSyxNQUFNLENBQUM7RUFDaEIsSUFBSSxLQUFLLFNBQVM7RUFDbEI7RUFDQSxNQUFNLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO0VBQzdCLE1BQU0sSUFBSSxDQUFDLG9CQUFvQixHQUFHLHlCQUF5QixDQUFDO0VBQzVELE1BQU0sTUFBTTtFQUNaLElBQUksS0FBSyxRQUFRO0VBQ2pCO0VBQ0EsTUFBTSxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztFQUM3QixNQUFNLElBQUksQ0FBQyxvQkFBb0IsR0FBRywwQkFBMEIsQ0FBQztFQUM3RCxNQUFNLE1BQU07RUFDWixJQUFJO0VBQ0osTUFBTSxJQUFJLENBQUMsS0FBSyxHQUFHLGdCQUFnQixDQUFDO0VBQ3BDLE1BQU0sT0FBTztFQUNiLEdBQUc7O0VBRUg7RUFDQTtFQUNBLEVBQUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNsQztFQUNBLEVBQUUsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7RUFDeEI7RUFDQSxFQUFFLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0VBQ3RCLENBQUMsQUFDRDs7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxhQUFhLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxTQUFTLE1BQU0sRUFBRTtFQUNqRCxFQUFFLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztFQUNuQjtFQUNBLEVBQUUsT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFO0VBQzFCO0VBQ0EsSUFBSSxJQUFJLFNBQVMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWTtFQUN6RSxRQUFRLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVk7RUFDM0MsUUFBUSxNQUFNLENBQUMsTUFBTSxDQUFDOztFQUV0QjtFQUNBLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0VBQ2xFLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxTQUFTLENBQUM7O0VBRW5DLElBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUU7RUFDN0M7RUFDQSxNQUFNLE9BQU8sRUFBRSxDQUFDO0VBQ2hCLEtBQUs7O0VBRUw7RUFDQSxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7O0VBRXBEO0VBQ0EsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztFQUVoRjtFQUNBLElBQUksSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQzFELElBQUksSUFBSSxRQUFRLElBQUksTUFBTSxJQUFJLFFBQVEsSUFBSSxNQUFNLEVBQUU7RUFDbEQsTUFBTSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUM7RUFDNUMsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO0VBQ25CLE1BQU0sU0FBUztFQUNmLEtBQUs7RUFDTCxJQUFJLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7O0VBRTVDO0VBQ0EsSUFBSSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0VBQzdCLE1BQU0sT0FBTyxPQUFPLENBQUM7RUFDckIsS0FBSztFQUNMLElBQUksTUFBTTtFQUNWLEdBQUc7O0VBRUg7RUFDQSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7RUFFcEMsRUFBRSxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0VBQzFCLEVBQUUsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0VBQ3ZCO0VBQ0EsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQztFQUM1RSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDO0VBQzdCLEdBQUc7O0VBRUgsRUFBRSxPQUFPLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzs7RUFFcEQsRUFBRSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztFQUMvQixFQUFFLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDekM7RUFDQSxFQUFFLElBQUksUUFBUSxJQUFJLE1BQU0sSUFBSSxRQUFRLElBQUksTUFBTSxFQUFFO0VBQ2hELElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztFQUNsQyxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDO0VBQzVCLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUM7RUFDOUIsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7RUFDekQsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztFQUM3QyxJQUFJLE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7RUFDckMsR0FBRzs7RUFFSDtFQUNBLEVBQUUsT0FBTyxPQUFPLENBQUM7RUFDakIsQ0FBQyxDQUFDOztFQUVGO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsYUFBYSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsR0FBRyxTQUFTLE1BQU0sRUFBRTtFQUNoRTtFQUNBLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQzs7RUFFbkQ7RUFDQTtFQUNBLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0VBQ3JCLElBQUksSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0VBRXRDOztFQUVBO0VBQ0EsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7RUFDbEMsTUFBTSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztFQUMxQixNQUFNLE1BQU07RUFDWixLQUFLOztFQUVMO0VBQ0EsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7RUFDbEMsTUFBTSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztFQUMxQixNQUFNLE1BQU07RUFDWixLQUFLOztFQUVMO0VBQ0EsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7RUFDbEMsTUFBTSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztFQUMxQixNQUFNLE1BQU07RUFDWixLQUFLO0VBQ0wsR0FBRztFQUNILEVBQUUsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7RUFDeEIsQ0FBQyxDQUFDOztFQUVGLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFNBQVMsTUFBTSxFQUFFO0VBQy9DLEVBQUUsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0VBQ2YsRUFBRSxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTTtFQUM3QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztFQUU3QixFQUFFLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtFQUN6QixJQUFJLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7RUFDL0IsSUFBSSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO0VBQzlCLElBQUksSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztFQUM1QixJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDMUMsR0FBRzs7RUFFSCxFQUFFLE9BQU8sR0FBRyxDQUFDO0VBQ2IsQ0FBQyxDQUFDOztFQUVGLFNBQVMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFO0VBQ2xDLEVBQUUsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUN4QyxDQUFDOztFQUVELFNBQVMseUJBQXlCLENBQUMsTUFBTSxFQUFFO0VBQzNDLEVBQUUsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztFQUN4QyxFQUFFLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzlDLENBQUM7O0VBRUQsU0FBUywwQkFBMEIsQ0FBQyxNQUFNLEVBQUU7RUFDNUMsRUFBRSxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0VBQ3hDLEVBQUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDOUMsQ0FBQzs7RUNwTk0sTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7O0FBRXZDLEVBQU8sTUFBTSx3QkFBd0IsR0FBRyxrQkFBa0IsQ0FBQztBQUMzRCxFQUFPLE1BQU0sbUJBQW1CLEdBQUcsZ0JBQWdCLENBQUM7QUFDcEQsRUFBTyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUM7O0FBRXBDLEVBQU8sTUFBTSxjQUFjLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsR0FBRyxLQUFLO0VBQzdGLElBQUksTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzs7RUFFeEQsSUFBSSxRQUFRO0VBQ1osUUFBUSxJQUFJLEVBQUVDLE1BQUksQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDO0VBQzFDLFFBQVEsV0FBVyxFQUFFLFdBQVcsQ0FBQyxjQUFjLEVBQUUsY0FBYyxFQUFFLE1BQU0sQUFBSyxDQUFDO0VBQzdFLEtBQUssRUFBRTtFQUNQLENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0sY0FBYyxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxjQUFjO0VBQ25FLElBQUlBLE1BQUk7RUFDUixRQUFRLGNBQWM7RUFDdEIsUUFBUSxjQUFjLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQztFQUM1QyxLQUFLLENBQUM7O0VBRU4sTUFBTSxXQUFXLEdBQUcsQ0FBQyxjQUFjLEVBQUUsY0FBYyxFQUFFLE1BQU0sS0FBSyxPQUFPLFlBQVksRUFBRSxZQUFZLEtBQUs7RUFDdEcsSUFBSSxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDLENBQUM7RUFDcEUsSUFBSSxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7RUFDNUIsSUFBSSxNQUFNQSxNQUFJLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQztFQUN0QyxRQUFRLE1BQU0sV0FBVyxJQUFJO0VBQzdCLFlBQVksTUFBTSxPQUFPLEdBQUc3QixPQUFJLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO0VBQy9FLFlBQVksTUFBTSxPQUFPLEdBQUdBLE9BQUksQ0FBQyxDQUFDLElBQUksV0FBVyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztFQUMzRTtFQUNBLFlBQVksR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDO0VBQ25DLGdCQUFnQixPQUFPLHdCQUF3QixDQUFDOztFQUVoRCxZQUFZLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0VBQ3JDLGdCQUFnQixNQUFNLGNBQWMsSUFBSSxhQUFhLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0VBQ3ZFLGdCQUFnQixNQUFNLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUM1QyxnQkFBZ0IsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUMzQyxhQUFhLE1BQU07RUFDbkIsZ0JBQWdCLE1BQU0sS0FBSztFQUMzQixvQkFBb0IsYUFBYSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUM7RUFDdEQsaUJBQWlCLENBQUM7RUFDbEIsYUFBYTs7RUFFYixZQUFZLE9BQU8sd0JBQXdCLENBQUM7O0VBRTVDLFNBQVM7RUFDVCxRQUFRLE1BQU0sSUFBSSxJQUFJLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQztFQUN2QyxLQUFLLENBQUM7O0VBRU4sSUFBSSxHQUFHLFlBQVksQ0FBQyxNQUFNLEtBQUssWUFBWSxDQUFDLE1BQU0sRUFBRTtFQUNwRCxRQUFRLE1BQU0sS0FBSyxHQUFHOEIsYUFBVSxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztFQUM3RCxRQUFRLElBQUksSUFBSSxLQUFLLElBQUksS0FBSyxFQUFFO0VBQ2hDLFlBQVksTUFBTSxLQUFLO0VBQ3ZCLGdCQUFnQixhQUFhLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQztFQUM1QyxhQUFhLENBQUM7RUFDZCxTQUFTO0VBQ1QsS0FBSyxNQUFNLEdBQUcsWUFBWSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7RUFDekM7RUFDQSxRQUFRLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3hCLEtBQUs7O0VBRUwsSUFBSSxNQUFNLEtBQUssRUFBRSxDQUFDO0VBQ2xCLElBQUksTUFBTSxjQUFjLENBQUMsR0FBRyxFQUFFLENBQUM7RUFDL0IsQ0FBQyxDQUFDOztFQUVGLE1BQU1ELE1BQUksR0FBRyxDQUFDLGNBQWMsRUFBRSxNQUFNLEtBQUssT0FBTyxTQUFTLEVBQUUsU0FBUyxLQUFLO0VBQ3pFLElBQUksTUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0VBQ3JELElBQUksSUFBSSxJQUFJLEdBQUcsTUFBTSxTQUFTLEVBQUUsQ0FBQztFQUNqQyxJQUFJLElBQUksTUFBTSxHQUFHLHdCQUF3QixDQUFDO0VBQzFDLElBQUksTUFBTSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs7RUFFM0IsUUFBUSxHQUFHLE1BQU0sS0FBSyxtQkFBbUIsRUFBRTtFQUMzQyxZQUFZLE1BQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ2xDLFlBQVksU0FBUztFQUNyQixTQUFTOztFQUVULFFBQVEsR0FBRyxNQUFNLEtBQUssV0FBVyxFQUFFO0VBQ25DLFlBQVksT0FBTztFQUNuQixTQUFTOztFQUVULFFBQVEsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0VBQ3pCLFFBQVEsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7RUFDL0IsUUFBUSxJQUFJLElBQUksV0FBVyxJQUFJLElBQUksRUFBRTtFQUNyQyxZQUFZLE9BQU8sSUFBSSxXQUFXLENBQUM7RUFDbkMsWUFBWSxHQUFHLFdBQVcsS0FBSyxJQUFJLEVBQUU7RUFDckMsZ0JBQWdCLE1BQU0sR0FBRyxNQUFNLFNBQVM7RUFDeEMsb0JBQW9CLGNBQWMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDO0VBQ25ELGlCQUFpQixDQUFDO0VBQ2xCLGdCQUFnQixPQUFPLEdBQUcsRUFBRSxDQUFDO0VBQzdCLGdCQUFnQixHQUFHLE1BQU0sS0FBSyxtQkFBbUIsRUFBRTtFQUNuRCxvQkFBb0IsTUFBTTtFQUMxQixpQkFBaUI7RUFDakIsYUFBYTtFQUNiLFlBQVksZ0JBQWdCLEVBQUUsQ0FBQztFQUMvQixTQUFTOztFQUVULFFBQVEsR0FBRyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtFQUM5QyxZQUFZLE1BQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNsRSxTQUFTOztFQUVULFFBQVEsSUFBSSxHQUFHLE1BQU0sU0FBUyxFQUFFLENBQUM7RUFDakMsS0FBSzs7RUFFTCxJQUFJLE1BQU0sY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDOztFQUVuQyxDQUFDLENBQUM7O0VBRUYsTUFBTSxlQUFlLEdBQUcsQ0FBQyxhQUFhLEVBQUUsY0FBYyxLQUFLO0VBQzNEO0VBQ0EsSUFBSSxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUM7O0VBRTdCLElBQUksT0FBTyxPQUFPLElBQUksS0FBSzs7RUFFM0IsUUFBUSxHQUFHN0MsV0FBUSxDQUFDLElBQUksQ0FBQyxJQUFJLGFBQWEsS0FBSyxJQUFJO0VBQ25ELFlBQVksYUFBYSxHQUFHK0MsaUJBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0VBQ3RELGFBQWEsR0FBRy9DLFdBQVEsQ0FBQyxJQUFJLENBQUM7RUFDOUIsWUFBWSxhQUFhLEdBQUcrQyxpQkFBTSxDQUFDLE1BQU0sQ0FBQztFQUMxQyxnQkFBZ0IsYUFBYTtFQUM3QixnQkFBZ0JBLGlCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7RUFDekMsYUFBYSxDQUFDLENBQUM7RUFDZjtFQUNBLFFBQVEsR0FBRyxhQUFhLEtBQUssSUFBSTtFQUNqQyxhQUFhLGFBQWEsQ0FBQyxNQUFNLEdBQUcsYUFBYTtFQUNqRCxnQkFBZ0IsQ0FBQy9DLFdBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFOztFQUVsQyxZQUFZLE1BQU0sY0FBYyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztFQUN0RCxZQUFZLGFBQWEsR0FBRyxJQUFJLENBQUM7RUFDakMsU0FBUztFQUNULEtBQUs7RUFDTCxDQUFDLENBQUM7O0VBRUYsTUFBTSxjQUFjLEdBQUcsQ0FBQyxjQUFjLEtBQUs7O0VBRTNDLElBQUksTUFBTSxPQUFPLEdBQUcsSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDOUMsSUFBSSxJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7O0VBRTVCLElBQUksT0FBTyxZQUFZOztFQUV2QixRQUFRLElBQUksZUFBZSxHQUFHLE1BQU0sY0FBYyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0VBQzFFLFFBQVEsTUFBTSxlQUFlLEdBQUcrQyxpQkFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQzs7RUFFNUQsUUFBUSxHQUFHLENBQUMsZUFBZSxFQUFFLGVBQWUsR0FBR0EsaUJBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7O0VBRS9ELFFBQVEsTUFBTSxVQUFVLEdBQUcsZUFBZSxDQUFDLE1BQU0sS0FBSyxnQkFBZ0IsQ0FBQzs7RUFFdkUsUUFBUSxNQUFNLE1BQU0sR0FBR0EsaUJBQU0sQ0FBQyxNQUFNO0VBQ3BDLFlBQVksQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDO0VBQzlDLFlBQVksZUFBZSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7O0VBRTdELFFBQVEsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUMzQyxRQUFRLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztFQUU3QyxRQUFRLEdBQUcsQ0FBQyxVQUFVLElBQUksY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7RUFDckQ7RUFDQTtFQUNBO0VBQ0EsWUFBWSxjQUFjLEdBQUcsRUFBRSxDQUFDO0VBQ2hDLFNBQVM7O0VBRVQsUUFBUSxPQUFPLElBQUksQ0FBQztFQUNwQixLQUFLLENBQUM7RUFDTixDQUFDLENBQUM7O0VBRUYsTUFBTSxjQUFjLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxLQUFLO0VBQzVDLElBQUksSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7RUFDN0IsSUFBSSxJQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQztFQUM3QixJQUFJLElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0VBQzlCLElBQUksSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO0VBQzFCLElBQUksTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDOztFQUVwQixJQUFJLE1BQU0sY0FBYyxHQUFHLE1BQU07RUFDakMsUUFBUSxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUNyRCxRQUFRLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDL0MsUUFBUSxNQUFNLEtBQUssR0FBRyxnQkFBZ0IsS0FBSyxFQUFFO0VBQzdDLHdCQUF3QixJQUFJLENBQUMsZUFBZSxFQUFFO0VBQzlDLHdCQUF3QixJQUFJLENBQUMsY0FBYztFQUMzQywwQkFBMEIsZ0JBQWdCLENBQUMsQ0FBQztFQUM1QyxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO0VBQ3ZDLEtBQUssQ0FBQztFQUNOO0VBQ0EsSUFBSSxNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUU7O0VBRTVDLFFBQVEsR0FBRyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFO0VBQzlDLFlBQVksTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFDMUQsWUFBWSxHQUFHLFNBQVMsRUFBRTtFQUMxQixnQkFBZ0IsR0FBRyxXQUFXLEtBQUssR0FBRyxFQUFFO0VBQ3hDLG9CQUFvQixnQkFBZ0IsSUFBSSxJQUFJLENBQUM7RUFDN0MsaUJBQWlCLE1BQU07RUFDdkIsb0JBQW9CLGdCQUFnQixJQUFJLFdBQVcsQ0FBQztFQUNwRCxpQkFBaUI7RUFDakIsZ0JBQWdCLFNBQVMsR0FBRyxLQUFLLENBQUM7RUFDbEMsYUFBYSxNQUFNO0VBQ25CLGdCQUFnQixHQUFHLFdBQVcsS0FBSyxHQUFHLEVBQUU7RUFDeEMsb0JBQW9CLGNBQWMsRUFBRSxDQUFDO0VBQ3JDLG9CQUFvQixnQkFBZ0IsR0FBRyxFQUFFLENBQUM7RUFDMUMsb0JBQW9CLGdCQUFnQixFQUFFLENBQUM7RUFDdkMsaUJBQWlCLE1BQU0sR0FBRyxXQUFXLEtBQUssSUFBSSxFQUFFO0VBQ2hELG9CQUFvQixTQUFTLEdBQUcsSUFBSSxDQUFDO0VBQ3JDLGlCQUFpQixNQUFNO0VBQ3ZCLG9CQUFvQixnQkFBZ0IsSUFBSSxXQUFXLENBQUM7RUFDcEQsaUJBQWlCO0VBQ2pCLGFBQWE7RUFDYixZQUFZLGdCQUFnQixFQUFFLENBQUM7RUFDL0IsU0FBUyxNQUFNO0VBQ2YsWUFBWSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7RUFDbEMsWUFBWSxjQUFjLEVBQUUsQ0FBQztFQUM3QixZQUFZLGdCQUFnQixFQUFFLENBQUM7RUFDL0IsU0FBUztFQUNULEtBQUs7O0VBRUwsSUFBSSxPQUFPLElBQUksQ0FBQztFQUNoQixDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLGFBQWEsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLE1BQU07O0VBRWhELElBQUksSUFBSSxPQUFPLEdBQUcsR0FBRTs7RUFFcEIsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLE1BQU0sRUFBRTtFQUM1QixRQUFRLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDeEMsUUFBUSxNQUFNLEtBQUssR0FBRzNCLE1BQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDO0VBQzFDLHdCQUF3QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztFQUN2Qyx3QkFBd0IsSUFBSSxDQUFDLGVBQWUsR0FBRTtFQUM5QztFQUNBLFFBQVEsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7RUFFN0MsUUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtFQUMvQyxZQUFZLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMxQyxZQUFZLEdBQUcsV0FBVyxLQUFLLEdBQUc7RUFDbEMsa0JBQWtCLFdBQVcsS0FBSyxJQUFJO0VBQ3RDLGtCQUFrQixXQUFXLEtBQUssSUFBSSxFQUFFO0VBQ3hDLGdCQUFnQixPQUFPLElBQUksSUFBSSxDQUFDO0VBQ2hDLGFBQWE7O0VBRWIsWUFBWSxHQUFHLFdBQVcsS0FBSyxJQUFJLEVBQUU7RUFDckMsZ0JBQWdCLE9BQU8sSUFBSSxHQUFHLENBQUM7RUFDL0IsYUFBYSxNQUFNO0VBQ25CLGdCQUFnQixPQUFPLElBQUksV0FBVyxDQUFDO0VBQ3ZDLGFBQWE7RUFDYixTQUFTOztFQUVULFFBQVEsT0FBTyxJQUFJLEdBQUcsQ0FBQztFQUN2QixLQUFLOztFQUVMLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQztFQUNwQixJQUFJLE9BQU8sT0FBTyxDQUFDO0VBQ25CLENBQUM7O0lBQUMsRkM3T0ssTUFBTTRCLFdBQVMsR0FBRyxPQUFPLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLGNBQWMsS0FBSztFQUNoRixFQUFFLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztFQUNyQixFQUFFLE1BQU0sTUFBTSxHQUFHLFlBQVk7RUFDN0IsUUFBUSxNQUFNLElBQUksSUFBSTtFQUN0QixNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDekIsTUFBTSxPQUFPLHdCQUF3QixDQUFDO0VBQ3RDLEtBQUs7RUFDTCxRQUFRLFlBQVksT0FBTztFQUMzQixHQUFHLENBQUM7O0VBRUosRUFBRSxPQUFPLE1BQU0sTUFBTSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0VBQ25FLENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0sV0FBVyxHQUFHLE9BQU8sU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLFlBQVksS0FBSztFQUNoRyxFQUFFLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztFQUNyQixFQUFFLE1BQU0sTUFBTSxHQUFHLGNBQWMsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7RUFDbEQsRUFBRSxNQUFNLE1BQU0sR0FBRyxZQUFZO0VBQzdCLFFBQVEsTUFBTSxJQUFJLElBQUk7RUFDdEIsTUFBTSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWTtFQUNuQyxRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDeEIsUUFBUSxLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRTtFQUNwQyxVQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ2pDLFNBQVM7RUFDVCxRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDdkIsT0FBTyxDQUFDLENBQUM7RUFDVCxNQUFNLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7RUFDckQsTUFBTSxJQUFJLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0VBQ3RDLFFBQVEsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDOUMsUUFBUSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzNCLE9BQU87RUFDUCxNQUFNLE9BQU8sd0JBQXdCLENBQUM7RUFDdEMsS0FBSztFQUNMLFFBQVEsWUFBWSxPQUFPO0VBQzNCLEdBQUcsQ0FBQzs7RUFFSixFQUFFLE9BQU8sTUFBTSxNQUFNLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUM7RUFDbkUsQ0FBQyxDQUFDO0FBQ0YsQUF5QkE7QUFDQSxFQUFPLE1BQU0sWUFBWSxHQUFHLENBQUMsU0FBUyxFQUFFLGNBQWMsS0FBSyxPQUFPLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLGNBQWMsS0FBSztFQUNsSCxFQUFFLElBQUk7RUFDTixJQUFJLE1BQU0sY0FBYyxHQUFHLHFCQUFxQjtFQUNoRCxRQUFRLE1BQU0sU0FBUyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQztFQUMxRCxLQUFLLENBQUM7O0VBRU4sSUFBSSxNQUFNLElBQUksR0FBRyxjQUFjLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQztFQUNsRSxJQUFJLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQzFCLElBQUksT0FBTyxjQUFjLEVBQUUsQ0FBQztFQUM1QixHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7RUFDZCxJQUFJLElBQUksTUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFO0VBQ2hELE1BQU0sTUFBTSxDQUFDLENBQUM7RUFDZCxLQUFLLE1BQU07RUFDWCxNQUFNLE1BQU0sZUFBZTtFQUMzQixRQUFRLFNBQVM7RUFDakIsUUFBUSxjQUFjO0VBQ3RCLFFBQVEsS0FBSztFQUNiLE9BQU8sQ0FBQztFQUNSLEtBQUs7RUFDTCxJQUFJLE9BQU8sRUFBRSxDQUFDO0VBQ2QsR0FBRztFQUNILENBQUMsQ0FBQzs7RUNsRkssTUFBTSxTQUFTLEdBQUcsR0FBRyxJQUFJLE9BQU8sUUFBUSxFQUFFLE9BQU8sS0FBSyxVQUFVO0VBQ3ZFLEVBQUUsR0FBRztFQUNMLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTO0VBQzNCLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDO0VBQzdDLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFO0VBQ3ZCLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsT0FBTztFQUNwQyxDQUFDLENBQUM7O0VBRUYsTUFBTSxjQUFjLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUM7O0VBRTVGLE1BQU0sVUFBVSxHQUFHLE9BQU8sR0FBRyxFQUFFLFFBQVEsRUFBRSxPQUFPLEdBQUcsY0FBYyxLQUFLO0VBQ3RFLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFO0VBQ25FLElBQUkzQixRQUFLLENBQUMsT0FBTyxDQUFDO0VBQ2xCLElBQUlBLFFBQUssQ0FBQyxjQUFjLENBQUM7RUFDekIsR0FBRyxDQUFDLENBQUM7O0VBRUwsRUFBRSxNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsS0FBSyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUM7RUFDL0QsTUFBTSxNQUFNLFdBQVc7RUFDdkIsTUFBTSxHQUFHLENBQUMsU0FBUztFQUNuQixNQUFNLEdBQUcsQ0FBQyxTQUFTO0VBQ25CLE1BQU0sU0FBUztFQUNmLE1BQU0sR0FBRztFQUNULE1BQU0sWUFBWTtFQUNsQixLQUFLO0VBQ0wsTUFBTSxNQUFNMkIsV0FBUztFQUNyQixNQUFNLEdBQUcsQ0FBQyxTQUFTO0VBQ25CLE1BQU0sR0FBRyxDQUFDLFNBQVM7RUFDbkIsTUFBTSxTQUFTO0VBQ2YsTUFBTSxHQUFHO0VBQ1QsS0FBSyxDQUFDLENBQUM7O0VBRVAsRUFBRSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQy9CLEVBQUUsTUFBTSxTQUFTLEdBQUcsbUJBQW1CLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztFQUVqRSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUMsRUFBRTs7RUFFL0UsRUFBRSxJQUFJLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRTtFQUNqQyxJQUFJLE1BQU0sU0FBUyxHQUFHLE1BQU0sbUJBQW1CO0VBQy9DLE1BQU0sR0FBRyxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxjQUFjO0VBQ3JELEtBQUssQ0FBQztFQUNOLElBQUksTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO0VBQ3JCLElBQUksS0FBSyxNQUFNLENBQUMsSUFBSSxTQUFTLEVBQUU7RUFDL0IsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDcEMsS0FBSztFQUNMLElBQUksT0FBT0MsVUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQzFCLEdBQUc7RUFDSCxFQUFFLE9BQU8sTUFBTSxRQUFRO0VBQ3ZCLElBQUksd0JBQXdCLENBQUMsUUFBUSxDQUFDO0VBQ3RDLEdBQUcsQ0FBQztFQUNKLENBQUMsQ0FBQzs7RUNwREssTUFBTSxVQUFVLEdBQUcsR0FBRyxJQUFJLFNBQVMsSUFBSSxjQUFjO0VBQzVELEVBQUUsR0FBRztFQUNMLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVO0VBQzdCLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO0VBQy9DLEVBQUUsRUFBRSxTQUFTLEVBQUU7RUFDZixFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsU0FBUztFQUM3QixDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQUcsRUFBRSxTQUFTLEtBQUs7RUFDL0MsRUFBRSxNQUFNLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7O0VBRW5FLEVBQUUsTUFBTSxzQkFBc0IsR0FBRyxFQUFFLENBQUM7O0VBRXBDLEVBQUUsTUFBTSxzQkFBc0IsR0FBRyxPQUFPLFdBQVcsS0FBSztFQUN4RCxJQUFJLElBQUksQ0FBQzdCLEtBQUcsQ0FBQyxzQkFBc0IsRUFBRSxXQUFXLENBQUMsWUFBWSxDQUFDLEVBQUU7RUFDaEUsTUFBTSxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLEdBQUc7RUFDekQsUUFBUSxXQUFXO0VBQ25CLFFBQVEsSUFBSSxFQUFFLE1BQU0sa0JBQWtCO0VBQ3RDLFVBQVUsR0FBRyxFQUFFLFNBQVMsRUFBRSxXQUFXO0VBQ3JDLFNBQVM7RUFDVCxPQUFPLENBQUM7RUFDUixLQUFLOztFQUVMLElBQUksT0FBTyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7RUFDNUQsR0FBRyxDQUFDOztFQUVKLEVBQUUsTUFBTSxjQUFjLEdBQUcsd0JBQXdCLEtBQUtwQixXQUFRLENBQUMsd0JBQXdCLENBQUM7RUFDeEYsTUFBTSxTQUFTLENBQUMsVUFBVSxFQUFFLHdCQUF3QixDQUFDO0VBQ3JELE9BQU8sV0FBVztFQUNsQixNQUFNLHdCQUF3QixDQUFDLENBQUM7O0VBRWhDLEVBQUUsT0FBTztFQUNULElBQUksZUFBZSxFQUFFLE9BQU8sd0JBQXdCLEVBQUUsR0FBRyxLQUFLO0VBQzlELE1BQU0sTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLHdCQUF3QixDQUFDLENBQUM7RUFDbkUsTUFBTSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztFQUNqRSxNQUFNLE9BQU9ELE1BQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7RUFDNUMsS0FBSztFQUNMLElBQUksZ0JBQWdCLEVBQUUsT0FBTyx3QkFBd0IsS0FBSztFQUMxRCxNQUFNLE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0VBQ25FLE1BQU0sTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sc0JBQXNCLENBQUMsV0FBVyxDQUFDLENBQUM7RUFDakUsTUFBTSxPQUFPLElBQUksQ0FBQztFQUNsQixLQUFLO0VBQ0wsSUFBSSxVQUFVO0VBQ2QsR0FBRyxDQUFDO0VBQ0osQ0FBQyxDQUFDOztFQUVGLE1BQU0sa0JBQWtCLEdBQUcsT0FBTyxHQUFHLEVBQUUsU0FBUyxFQUFFLFdBQVcsS0FBSztFQUNsRSxFQUFFLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztFQUNyRSxFQUFFLE1BQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUM7RUFDM0MsTUFBTSxTQUFTLENBQUMsT0FBTyxFQUFFO0VBQ3pCLE1BQU0sNEJBQTRCO0VBQ2xDLE1BQU0sU0FBUyxFQUFFLFNBQVM7RUFDMUIsS0FBSyxDQUFDOztFQUVOLEVBQUUsTUFBTSxLQUFLLEdBQUcsTUFBTSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDL0MsRUFBRSxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7RUFDbEIsSUFBSVMsTUFBRyxDQUFDLENBQUMsS0FBSztFQUNkLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHO0VBQ2hCLE1BQU0sS0FBSyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDO0VBQ3hDLEtBQUssQ0FBQyxDQUFDO0VBQ1AsR0FBRyxDQUFDLENBQUM7RUFDTCxDQUFDLENBQUM7O0VDL0RGLE1BQU0sZUFBZSxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssTUFBTTtFQUMvQyxFQUFFLE1BQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQztFQUNyQixFQUFFLE9BQU8sRUFBRSxDQUFDLHNCQUFzQixFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7RUFDeEQsQ0FBQyxDQUFDLENBQUM7O0VBRUgsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7RUFDM0UsRUFBRUEsTUFBRyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQzFFLEVBQUUxQixTQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLO0VBQ3hCLElBQUksSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxPQUFPLE1BQU0sQ0FBQztFQUM3QyxJQUFJLE1BQU0sQ0FBQyxJQUFJO0VBQ2YsTUFBTSxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztFQUNsRCxLQUFLLENBQUM7RUFDTixJQUFJLE9BQU8sTUFBTSxDQUFDO0VBQ2xCLEdBQUcsRUFBRSxFQUFFLENBQUM7RUFDUixDQUFDLENBQUMsQ0FBQzs7RUFFSCxNQUFNLDBCQUEwQixHQUFHLE9BQU8sTUFBTSxFQUFFLFVBQVUsRUFBRSxPQUFPLEtBQUs7RUFDMUUsRUFBRSxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7RUFDcEIsRUFBRSxLQUFLLE1BQU0sS0FBSyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUU7RUFDekMsSUFBSSxDQUFDLENBQUMsTUFBTWtELHlCQUF1QixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLEVBQUU7RUFDN0QsTUFBTXZCLFNBQU0sQ0FBQyxnQkFBZ0IsQ0FBQztFQUM5QixNQUFNRCxNQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RELE1BQU0wQyxPQUFJLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDL0IsS0FBSyxDQUFDLENBQUM7RUFDUCxHQUFHO0VBQ0gsRUFBRSxPQUFPLE1BQU0sQ0FBQztFQUNoQixDQUFDLENBQUM7O0VBRUYsTUFBTSx3QkFBd0IsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLEtBQUs7RUFDekQsRUFBRSxNQUFNLGlCQUFpQixHQUFHLENBQUMsSUFBSSxLQUFLO0VBQ3RDLElBQUksTUFBTSxPQUFPLEdBQUd4Qyw4QkFBaUIsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztFQUNoRSxJQUFJLE1BQU0saUJBQWlCLEdBQUcsRUFBRSxNQUFNLEtBQUV5QyxVQUFDLEVBQUUsQ0FBQztFQUM1QyxJQUFJLFFBQVEsT0FBTyxDQUFDLGlCQUFpQixDQUFDO0VBQ3RDLFFBQVEsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO0VBQ3ZCLFNBQVM7RUFDVCxRQUFRLEtBQUssRUFBRSxLQUFLO0VBQ3BCLFFBQVEsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhO0VBQ2xDLFFBQVEsT0FBTyxFQUFFLElBQUksQ0FBQyxrQkFBa0I7RUFDeEMsT0FBTyxDQUFDLEVBQUU7RUFDVixHQUFHLENBQUM7O0VBRUosRUFBRSxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFO0VBQ3ZDLElBQUkzQyxNQUFHLENBQUMsaUJBQWlCLENBQUM7RUFDMUIsSUFBSXlDLFVBQU87RUFDWCxJQUFJeEMsU0FBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQztFQUNsQyxJQUFJRCxNQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0VBQ3hELEdBQUcsQ0FBQyxDQUFDO0VBQ0wsQ0FBQyxDQUFDOztBQUVGLEVBQU8sTUFBTSxRQUFRLEdBQUcsR0FBRyxJQUFJLE9BQU8sTUFBTSxFQUFFLE9BQU8sS0FBSztFQUMxRCxFQUFFLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDO0VBQzlCLE1BQU0sV0FBVyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDO0VBQ2xDLE1BQU0sT0FBTyxDQUFDOztFQUVkLEVBQUUsTUFBTSxVQUFVLEdBQUcsbUJBQW1CLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNwRSxFQUFFLE1BQU0sZUFBZSxHQUFHLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQzs7RUFFcEU7RUFDQSxFQUFFLElBQUksQ0FBQ1gsVUFBTyxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxFQUFFLEVBQUU7O0VBRTFGLEVBQUUsTUFBTSx5QkFBeUIsR0FBRyx3QkFBd0IsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7RUFDakYsRUFBRSxNQUFNLGtCQUFrQixHQUFHLE1BQU0sMEJBQTBCLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQzs7RUFFM0YsRUFBRSxJQUFJQSxVQUFPLENBQUMsZUFBZSxDQUFDO0VBQzlCLFVBQVVBLFVBQU8sQ0FBQyx5QkFBeUIsQ0FBQztFQUM1QyxVQUFVQSxVQUFPLENBQUMsa0JBQWtCLENBQUMsRUFBRTtFQUN2QyxJQUFJLFFBQVEsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRTtFQUMzQyxHQUFHOztFQUVILEVBQUUsUUFBUTtFQUNWLElBQUksT0FBTyxFQUFFLEtBQUs7RUFDbEIsSUFBSSxNQUFNLEVBQUVzRCxVQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSx5QkFBeUIsQ0FBQztFQUNuRixHQUFHLEVBQUU7RUFDTCxDQUFDLENBQUM7O0VDM0VGLE1BQU0sNkJBQTZCLEdBQUcsT0FBTyxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsS0FBSztFQUM1RSxFQUFFLElBQUksQ0FBQyxNQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUU7RUFDMUMsSUFBSSxNQUFNLFNBQVMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDNUMsSUFBSSxNQUFNLFNBQVMsQ0FBQyxZQUFZO0VBQ2hDLE1BQU0sT0FBTyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUM7RUFDbEMsS0FBSyxDQUFDO0VBQ04sSUFBSSxNQUFNLFNBQVMsQ0FBQyxZQUFZO0VBQ2hDLE1BQU0sT0FBTztFQUNiLFFBQVEsU0FBUztFQUNqQixRQUFRLFFBQVE7RUFDaEIsUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtFQUM5QixPQUFPO0VBQ1AsS0FBSyxDQUFDO0VBQ04sR0FBRztFQUNILENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0seUJBQXlCLEdBQUcsT0FBTyxTQUFTLEVBQUUsU0FBUyxLQUFLO0VBQ3pFLEVBQUUsTUFBTSxvQkFBb0IsR0FBRyxPQUFPO0VBQ3RDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7RUFDM0IsSUFBSSxrQkFBa0I7RUFDdEIsR0FBRyxDQUFDOztFQUVKLEVBQUUsTUFBTSxhQUFhLEdBQUcscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7O0VBRXpELEVBQUUsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLENBQUMsYUFBYSxFQUFFO0VBQzdDLElBQUkxQyxTQUFNLENBQUMsb0JBQW9CLENBQUM7RUFDaEMsR0FBRyxDQUFDLENBQUM7O0VBRUwsRUFBRSxLQUFLLE1BQU0sR0FBRyxJQUFJLGlCQUFpQixFQUFFO0VBQ3ZDLElBQUksTUFBTSw2QkFBNkI7RUFDdkMsTUFBTSxTQUFTO0VBQ2YsTUFBTSxHQUFHO0VBQ1QsTUFBTSxHQUFHLENBQUMsa0JBQWtCLEVBQUU7RUFDOUIsS0FBSyxDQUFDO0VBQ04sR0FBRztFQUNILENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0sMEJBQTBCLEdBQUcsT0FBTyxHQUFHLEVBQUUsU0FBUyxLQUFLO0VBQ3BFLEVBQUUsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFO0VBQzlDLElBQUksbUJBQW1CLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztFQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUTtFQUNuQixJQUFJQSxTQUFNLENBQUMsa0JBQWtCLENBQUM7RUFDOUIsR0FBRyxDQUFDLENBQUM7O0VBRUwsRUFBRSxLQUFLLE1BQU0sS0FBSyxJQUFJLHNCQUFzQixFQUFFO0VBQzlDLElBQUksTUFBTSw2QkFBNkI7RUFDdkMsTUFBTSxHQUFHLENBQUMsU0FBUztFQUNuQixNQUFNLEtBQUs7RUFDWCxNQUFNLE9BQU8sQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQztFQUM5QyxLQUFLLENBQUM7RUFDTixHQUFHO0VBQ0gsQ0FBQyxDQUFDOztFQy9DRixNQUFNLFVBQVUsR0FBRyxrRUFBa0UsQ0FBQzs7RUFFdEYsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLGNBQWMsS0FBSztFQUNuRCxFQUFFLE1BQU0sTUFBTSxHQUFHLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQztFQUNsRCxFQUFFLE1BQU0saUJBQWlCLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQztFQUN4QyxFQUFFLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztFQUMxQixFQUFFLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztFQUNoQixFQUFFLElBQUksZUFBZSxHQUFHLEVBQUUsQ0FBQztFQUMzQixFQUFFLE9BQU8sS0FBSyxHQUFHLEVBQUUsRUFBRTtFQUNyQixJQUFJLGVBQWUsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDekMsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxpQkFBaUIsS0FBSyxDQUFDLEVBQUU7RUFDL0MsTUFBTSxZQUFZLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0VBQ3pDLE1BQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQztFQUMzQixLQUFLO0VBQ0wsSUFBSSxLQUFLLEVBQUUsQ0FBQztFQUNaLEdBQUc7O0VBRUgsRUFBRSxPQUFPLFlBQVksQ0FBQztFQUN0QixDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLG1CQUFtQixHQUFHLENBQUMsWUFBWSxFQUFFLGFBQWEsS0FBSztFQUNwRSxFQUFFLE1BQU0sb0JBQW9CLEdBQUcsd0JBQXdCLENBQUMsWUFBWSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7RUFDckYsRUFBRSxPQUFPLENBQUMsQ0FBQyxvQkFBb0IsRUFBRTtFQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7RUFDbkIsSUFBSUQsTUFBRyxDQUFDLENBQUMsSUFBSUEsTUFBRyxDQUFDLENBQUMsSUFBSSxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztFQUMxRyxJQUFJeUMsVUFBTztFQUNYLEdBQUcsQ0FBQyxDQUFDO0VBQ0wsQ0FBQyxDQUFDOztFQUVGLE1BQU0sZUFBZSxHQUFHLENBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxRQUFRLEtBQUssT0FBTztFQUNyRSxFQUFFLGFBQWE7RUFDZixFQUFFLFFBQVE7RUFDVixFQUFFLE9BQU87RUFDVCxFQUFFLFFBQVE7RUFDVixDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLGlCQUFpQixHQUFHLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxRQUFRLEtBQUs7RUFDNUUsRUFBRSxNQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7O0VBRWpELEVBQUUsTUFBTSxjQUFjLEdBQUcsd0JBQXdCLENBQUMsWUFBWSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7O0VBRS9FLEVBQUUsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQ3JELEVBQUUsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRTtFQUMxQyxJQUFJLHNCQUFzQjtFQUMxQixJQUFJakMsT0FBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0VBQ3RDLEdBQUcsQ0FBQyxDQUFDOztFQUVMLEVBQUUsT0FBTyxlQUFlO0VBQ3hCLElBQUksYUFBYTtFQUNqQixJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLGdCQUFnQixDQUFDO0VBQ3ZDLElBQUksYUFBYTtFQUNqQixHQUFHLENBQUM7RUFDSixDQUFDLENBQUM7O0VBRUYsTUFBTSxvQkFBb0IsR0FBRyxPQUFPLFNBQVMsRUFBRSxTQUFTLEtBQUs7RUFDN0QsRUFBRSxJQUFJO0VBQ04sSUFBSSxPQUFPLE1BQU0sU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUMvQyxHQUFHLENBQUMsT0FBTyxLQUFLLEVBQUU7RUFDbEIsSUFBSSxJQUFJO0VBQ1IsTUFBTSxNQUFNLFNBQVMsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQ2hELE1BQU0sT0FBTyxFQUFFLENBQUM7RUFDaEIsS0FBSyxDQUFDLE9BQU8sT0FBTyxFQUFFO0VBQ3RCLE1BQU0sTUFBTSxJQUFJLEtBQUs7RUFDckIsUUFBUSxDQUFDLG9DQUFvQyxFQUFFLFNBQVM7U0FDL0MsVUFBVSxFQUFFLEtBQUssQ0FBQyxPQUFPO1NBQ3pCLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztFQUNoQyxPQUFPLENBQUM7RUFDUixLQUFLO0VBQ0wsR0FBRztFQUNILENBQUMsQ0FBQzs7RUFFRixNQUFNLFlBQVksR0FBRyxPQUFPLFNBQVMsRUFBRSxTQUFTLEtBQUs7RUFDckQsRUFBRSxJQUFJO0VBQ04sSUFBSSxPQUFPLE1BQU0sU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUMvQyxHQUFHLENBQUMsT0FBTyxLQUFLLEVBQUU7RUFDbEIsSUFBSSxPQUFPLEVBQUUsQ0FBQztFQUNkLEdBQUc7RUFDSCxDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLFdBQVcsR0FBRyxDQUFDLFlBQVksRUFBRSxTQUFTLEtBQUssT0FBTyxNQUFNLEtBQUs7RUFDMUUsRUFBRSxNQUFNLFNBQVMsR0FBRyxpQkFBaUI7RUFDckMsSUFBSSxZQUFZO0VBQ2hCLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7RUFDNUIsSUFBSSxNQUFNLENBQUMsRUFBRTtFQUNiLEdBQUcsQ0FBQzs7RUFFSixFQUFFLElBQUksTUFBTSxHQUFHLE1BQU0sb0JBQW9CLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDOztFQUVoRSxFQUFFLE1BQU0sSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztFQUUxRCxFQUFFLE1BQU0sU0FBUyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7RUFDaEQsQ0FBQyxDQUFDOztBQUVGLEVBQU8sTUFBTSxpQkFBaUIsR0FBRyxHQUFHLElBQUksT0FBTyx5QkFBeUIsS0FBSztFQUM3RSxFQUFFLHlCQUF5QixHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0VBQ2pFLEVBQUUsTUFBTSxVQUFVLEdBQUcsK0JBQStCO0VBQ3BELElBQUksR0FBRyxDQUFDLFNBQVM7RUFDakIsSUFBSSx5QkFBeUI7RUFDN0IsR0FBRyxDQUFDOztFQUVKLEVBQUUsTUFBTSxpQ0FBaUMsR0FBRyxPQUFPLGFBQWEsS0FBSztFQUNyRSxJQUFJLE1BQU0sY0FBYyxHQUFHLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7RUFDN0UsSUFBSSxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7O0VBRXZCLElBQUksTUFBTSx1QkFBdUIsR0FBRyxZQUFZO0VBQ2hELE1BQU0sSUFBSSxVQUFVLEtBQUssY0FBYyxDQUFDLE1BQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsYUFBYSxFQUFFLEVBQUUsRUFBRSxFQUFFOztFQUVoSCxNQUFNLE1BQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7RUFFbEQsTUFBTSxNQUFNLE1BQU0sR0FBRyxNQUFNLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7O0VBRXZFLE1BQU0sVUFBVSxFQUFFLENBQUM7O0VBRW5CLE1BQU0sUUFBUTtFQUNkLFFBQVEsTUFBTSxFQUFFO0VBQ2hCLFVBQVUsR0FBRyxFQUFFLE1BQU07RUFDckIsVUFBVSxhQUFhO0VBQ3ZCLFNBQVM7RUFDVCxRQUFRLElBQUksRUFBRSxLQUFLO0VBQ25CLE9BQU8sRUFBRTtFQUNULEtBQUssQ0FBQzs7RUFFTixJQUFJLE9BQU8sdUJBQXVCLENBQUM7RUFDbkMsR0FBRyxDQUFDOztFQUVKLEVBQUUsTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRTtFQUM1RCxJQUFJUCxTQUFNLENBQUMsa0JBQWtCLENBQUM7RUFDOUIsSUFBSUEsU0FBTSxDQUFDLENBQUMsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3pDLHVCQUF1QixDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0VBQzVELElBQUk0QixVQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDL0MsR0FBRyxDQUFDLENBQUM7O0VBRUwsRUFBRSxNQUFNLHdCQUF3QixHQUFHLE9BQU8sZUFBZSxHQUFHLEVBQUUsRUFBRSxnQkFBZ0IsR0FBRyxDQUFDLEtBQUs7RUFDekYsSUFBSSxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUNwRCxJQUFJLE1BQU0sb0JBQW9CLEdBQUcsT0FBTztFQUN4QyxNQUFNLGVBQWU7RUFDckIsTUFBTSxXQUFXLENBQUMsY0FBYztFQUNoQyxLQUFLLENBQUM7RUFDTixJQUFJLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRTtFQUN4RCxNQUFNLE9BQU87RUFDYixRQUFRLE1BQU0saUNBQWlDO0VBQy9DLFVBQVUsb0JBQW9CO0VBQzlCLFNBQVMsQ0FBQyxDQUFDO0VBQ1gsS0FBSztFQUNMLElBQUksTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0VBQzVCLElBQUksTUFBTSxlQUFlLEdBQUcsTUFBTSxpQ0FBaUM7RUFDbkUsTUFBTSxvQkFBb0I7RUFDMUIsS0FBSyxDQUFDOztFQUVOLElBQUksSUFBSSxHQUFHLEdBQUcsTUFBTSxlQUFlLEVBQUUsQ0FBQztFQUN0QyxJQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUU7RUFDL0IsTUFBTSxLQUFLLE1BQU0sRUFBRSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFO0VBQ3ZDLFFBQVEsWUFBWSxDQUFDLElBQUk7RUFDekIsVUFBVSxNQUFNLHdCQUF3QjtFQUN4QyxZQUFZLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLENBQUM7RUFDN0MsWUFBWSxnQkFBZ0IsR0FBRyxDQUFDO0VBQ2hDLFdBQVc7RUFDWCxTQUFTLENBQUM7RUFDVixPQUFPOztFQUVQLE1BQU0sR0FBRyxHQUFHLE1BQU0sZUFBZSxFQUFFLENBQUM7RUFDcEMsS0FBSzs7RUFFTCxJQUFJLE9BQU9ZLFVBQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztFQUNqQyxHQUFHLENBQUM7O0VBRUosRUFBRSxNQUFNLGNBQWMsR0FBRyxNQUFNLHdCQUF3QixFQUFFLENBQUM7RUFDMUQsRUFBRSxJQUFJLG9CQUFvQixHQUFHLENBQUMsQ0FBQztFQUMvQixFQUFFLE9BQU8sWUFBWTtFQUNyQixJQUFJLElBQUksY0FBYyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtFQUMzRSxJQUFJLE1BQU0sV0FBVyxHQUFHLE1BQU0sY0FBYyxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQztFQUNyRSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxXQUFXLENBQUMsRUFBRTtFQUNsRCxJQUFJLElBQUksb0JBQW9CLElBQUksY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7RUFDM0QsTUFBTSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO0VBQ3hELEtBQUs7RUFDTCxJQUFJLG9CQUFvQixFQUFFLENBQUM7RUFDM0IsSUFBSSxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO0VBQ3ZELEdBQUcsQ0FBQztFQUNKLENBQUMsQ0FBQzs7RUFFRixNQUFNLGtCQUFrQixHQUFHLE9BQU8sU0FBUyxFQUFFLFFBQVEsS0FBSztFQUMxRCxFQUFFLE1BQU0sU0FBUyxHQUFHLE1BQU0sWUFBWSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQzs7RUFFNUQsRUFBRSxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7RUFDcEIsRUFBRSxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7RUFDckIsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtFQUM3QyxJQUFJLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDNUMsSUFBSSxNQUFNLE1BQU0sSUFBSSxDQUFDLEtBQUssU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztFQUNoRCxJQUFJLElBQUksV0FBVyxLQUFLLEdBQUcsSUFBSSxNQUFNLEVBQUU7RUFDdkMsTUFBTSxJQUFJLE1BQU0sRUFBRSxTQUFTLElBQUksV0FBVyxDQUFDO0VBQzNDLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUM3QixNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7RUFDckIsS0FBSyxNQUFNO0VBQ1gsTUFBTSxTQUFTLElBQUksV0FBVyxDQUFDO0VBQy9CLEtBQUs7RUFDTCxHQUFHO0VBQ0gsRUFBRSxPQUFPLE1BQU0sQ0FBQztFQUNoQixDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLGdCQUFnQixHQUFHLENBQUMsWUFBWSxFQUFFLFNBQVMsS0FBSyxPQUFPLE1BQU0sS0FBSztFQUMvRSxFQUFFLE1BQU0sUUFBUSxHQUFHLGlCQUFpQjtFQUNwQyxJQUFJLFlBQVk7RUFDaEIsSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztFQUM1QixJQUFJLE1BQU0sQ0FBQyxFQUFFO0VBQ2IsR0FBRyxDQUFDO0VBQ0osRUFBRSxNQUFNLE1BQU0sR0FBRyxNQUFNLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQzs7RUFFL0QsRUFBRSxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFO0VBQzNCLElBQUlHLE9BQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO0VBQ25CLElBQUk3RCxPQUFJLENBQUMsR0FBRyxDQUFDO0VBQ2IsR0FBRyxDQUFDLENBQUM7O0VBRUwsRUFBRSxNQUFNLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0VBQy9DLENBQUMsQ0FBQzs7RUM3TkssTUFBTSxtQkFBbUIsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzVELEVBQU8sTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDO0FBQ3BDLEVBQU8sTUFBTSxhQUFhLEdBQUcsT0FBTztFQUNwQyxFQUFFLG1CQUFtQixFQUFFLGFBQWE7RUFDcEMsQ0FBQyxDQUFDO0FBQ0YsRUFBTyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUM7O0VBRXpCLE1BQU0sUUFBUSxHQUFHLEdBQUcsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLGVBQWUsS0FBSyxHQUFHLENBQUM7O0FBRS9ELEVBQU8sTUFBTSx5QkFBeUIsR0FBRyxRQUFRLENBQUM7QUFDbEQsRUFBTyxNQUFNLHlCQUF5QixHQUFHLFFBQVEsQ0FBQztBQUNsRCxFQUFPLE1BQU0seUJBQXlCLEdBQUcsUUFBUSxDQUFDO0FBQ2xELEVBQU8sTUFBTSx1QkFBdUIsR0FBRyxPQUFPLENBQUM7O0FBRS9DLEVBQU8sTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDNUQsRUFBTyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUM1RCxFQUFPLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQzVELEVBQU8sTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLHVCQUF1QixDQUFDLENBQUM7O0FBRTlELEVBQU8sTUFBTSxlQUFlLEdBQUcsT0FBTyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFL0QsRUFBTyxNQUFNLGdCQUFnQixHQUFHLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxRQUFRO0VBQ3BFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUFFLGVBQWUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7O0FBRTdELEVBQU8sTUFBTSxnQkFBZ0IsR0FBRyxTQUFTLENBQUM7QUFDMUMsRUFBTyxNQUFNLDBCQUEwQixHQUFHLE1BQU0sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUV6RixFQUFPLE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxJQUFJLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUU1RixFQUFPLE1BQU0sa0JBQWtCLEdBQUcsWUFBWSxJQUFJLE9BQU87RUFDekQsRUFBRSxtQkFBbUI7RUFDckIsRUFBRSxnQkFBZ0IsR0FBRyxlQUFlLENBQUMsWUFBWSxDQUFDO0VBQ2xELENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxZQUFZLEVBQUUsS0FBSztFQUMzRCxFQUFFLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxzQkFBc0IsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDbkcsQUFHQTtBQUNBLEVBQU8sTUFBTSxzQkFBc0IsR0FBRyxJQUFJLENBQUM7QUFDM0MsRUFBTyxNQUFNLG1CQUFtQixHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDN0MsRUFBTyxNQUFNLGNBQWMsR0FBRyxDQUFDLENBQUM7O0VDckN6QixNQUFNLDBCQUEwQixHQUFHLE9BQU8sR0FBRyxFQUFFLE1BQU0sS0FBSyxNQUFNLFdBQVc7RUFDbEYsRUFBRSxHQUFHLENBQUMsU0FBUyxFQUFFLHlCQUF5QjtFQUMxQyxFQUFFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUU7RUFDeEIsRUFBRSx5QkFBeUI7RUFDM0IsQ0FBQyxDQUFDOztBQUVGLEVBQU8sTUFBTSwwQkFBMEIsR0FBRyxPQUFPLEdBQUcsRUFBRSxTQUFTLEVBQUUsU0FBUyxLQUFLLE1BQU0sV0FBVztFQUNoRyxFQUFFLEdBQUcsQ0FBQyxTQUFTLEVBQUUseUJBQXlCO0VBQzFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFO0VBQ2pELEVBQUUseUJBQXlCO0VBQzNCLENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0sMEJBQTBCLEdBQUcsT0FBTyxHQUFHLEVBQUUsTUFBTSxLQUFLLE1BQU0sV0FBVztFQUNsRixFQUFFLEdBQUcsQ0FBQyxTQUFTLEVBQUUseUJBQXlCO0VBQzFDLEVBQUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRTtFQUN4QixFQUFFLHlCQUF5QjtFQUMzQixDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLHdCQUF3QixHQUFHLE9BQU8sR0FBRyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsS0FBSyxLQUFLO0VBQ3ZGLEVBQUUsTUFBTSxpQkFBaUIsR0FBRyx1QkFBdUIsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7RUFDekUsRUFBRSxJQUFJLEtBQUssR0FBRyxzQkFBc0IsS0FBSyxDQUFDLEVBQUU7RUFDNUMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUM7RUFDeEQsR0FBRzs7RUFFSCxFQUFFLE9BQU8sTUFBTSxXQUFXO0VBQzFCLElBQUksR0FBRyxDQUFDLFNBQVMsRUFBRSx1QkFBdUI7RUFDMUMsSUFBSSxTQUFTLEVBQUUsRUFBRSxTQUFTLEVBQUU7RUFDNUIsSUFBSSxFQUFFLElBQUksT0FBTyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQztFQUN4QyxHQUFHLENBQUM7RUFDSixDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLHNCQUFzQixHQUFHLE9BQU8sU0FBUyxFQUFFLFlBQVksS0FBSyxNQUFNLFNBQVMsQ0FBQyxZQUFZO0VBQ3JHLEVBQUUsa0JBQWtCLENBQUMsWUFBWSxDQUFDO0VBQ2xDLENBQUMsQ0FBQzs7RUFFRixNQUFNLHlCQUF5QixHQUFHLEVBQUUsSUFBSSxPQUFPLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxDQUFDLENBQUM7O0VBRXpFLE1BQU0sV0FBVyxHQUFHLE9BQU8sU0FBUyxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixLQUFLO0VBQzlGLEVBQUUsTUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDL0MsRUFBRSxNQUFNLFFBQVEsR0FBR1IsZ0JBQVEsRUFBRSxDQUFDO0VBQzlCLEVBQUUsTUFBTSxFQUFFLEdBQUcsZ0JBQWdCO0VBQzdCLElBQUksUUFBUSxFQUFFLGVBQWUsRUFBRSxRQUFRO0VBQ3ZDLEdBQUcsQ0FBQzs7RUFFSixFQUFFLE1BQU0sR0FBRyxHQUFHLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDOztFQUVwQyxFQUFFLE1BQU0sS0FBSyxHQUFHO0VBQ2hCLElBQUksZUFBZTtFQUNuQixJQUFJLFNBQVM7RUFDYixJQUFJLEdBQUcsSUFBSTtFQUNYLElBQUksRUFBRTtFQUNOLEdBQUcsQ0FBQzs7RUFFSixFQUFFLE1BQU0sU0FBUyxDQUFDLFVBQVU7RUFDNUIsSUFBSSxHQUFHLEVBQUUsS0FBSztFQUNkLEdBQUcsQ0FBQzs7RUFFSixFQUFFLE9BQU8sS0FBSyxDQUFDO0VBQ2YsQ0FBQyxDQUFDOztFQ2hFSyxNQUFNLGVBQWUsR0FBRyxPQUFPLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxLQUFLO0VBQ3RFLEVBQUUsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7O0VBRWxELEVBQUUsTUFBTSxTQUFTLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztFQUV6QyxFQUFFLElBQUksY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFO0VBQzdCLElBQUksTUFBTSxTQUFTLENBQUMsVUFBVTtFQUM5QixNQUFNLGNBQWMsQ0FBQyxRQUFRLENBQUM7RUFDOUIsTUFBTSxJQUFJO0VBQ1YsS0FBSyxDQUFDO0VBQ04sR0FBRyxNQUFNO0VBQ1QsSUFBSSxNQUFNLGVBQWU7RUFDekIsTUFBTSxTQUFTO0VBQ2YsTUFBTSx3QkFBd0IsQ0FBQyxRQUFRLENBQUM7RUFDeEMsTUFBTSxLQUFLO0VBQ1gsS0FBSyxDQUFDO0VBQ04sR0FBRztFQUNILENBQUMsQ0FBQzs7RUNXSyxNQUFNLElBQUksR0FBRyxHQUFHLElBQUksT0FBTyxNQUFNLEVBQUUsT0FBTyxLQUFLLFVBQVU7RUFDaEUsRUFBRSxHQUFHO0VBQ0wsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUk7RUFDdkIsRUFBRSxNQUFNLENBQUMsS0FBSztFQUNkLE1BQU0sVUFBVSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztFQUN0RCxNQUFNLFVBQVUsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRTtFQUNsRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLO0VBQ3BDLENBQUMsQ0FBQzs7O0FBR0YsRUFBTyxNQUFNLEtBQUssR0FBRyxPQUFPLEdBQUcsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsR0FBRyxLQUFLLEtBQUs7RUFDN0UsRUFBRSxNQUFNLFdBQVcsR0FBR0UsWUFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ3hDLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRTtFQUN2QixJQUFJLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0VBQ3ZFLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRTtFQUNuQyxNQUFNLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO0VBQ3ZGLE1BQU0sTUFBTSxJQUFJLGVBQWUsQ0FBQyxDQUFDLHdCQUF3QjtRQUNqRCxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ25ELEtBQUs7RUFDTCxHQUFHOztFQUVILEVBQUUsSUFBSSxXQUFXLENBQUMsS0FBSyxFQUFFO0VBQ3pCLElBQUksTUFBTSxXQUFXLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7RUFDakUsSUFBSSxNQUFNLFdBQVcsR0FBRyxNQUFNLDBCQUEwQjtFQUN4RCxNQUFNLEdBQUcsRUFBRSxXQUFXO0VBQ3RCLEtBQUssQ0FBQztFQUNOLElBQUksV0FBVyxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDO0VBQy9DLElBQUksTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDdEQsSUFBSSxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsWUFBWTtFQUNwQyxNQUFNLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQztFQUN2QyxLQUFLLENBQUM7RUFDTixJQUFJLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVO0VBQ2xDLE1BQU0saUJBQWlCLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQztFQUN4QyxNQUFNLFdBQVc7RUFDakIsS0FBSyxDQUFDO0VBQ04sSUFBSSxNQUFNLGlDQUFpQyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztFQUN6RCxJQUFJLE1BQU0seUJBQXlCLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0VBQ2pELElBQUksTUFBTSwwQkFBMEIsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzNELElBQUksTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtFQUM3RCxNQUFNLE1BQU0sRUFBRSxXQUFXO0VBQ3pCLEtBQUssQ0FBQyxDQUFDO0VBQ1AsR0FBRyxNQUFNO0VBQ1QsSUFBSSxNQUFNLFNBQVMsR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ3hELElBQUksTUFBTSxXQUFXLEdBQUcsTUFBTSwwQkFBMEI7RUFDeEQsTUFBTSxHQUFHLEVBQUUsU0FBUyxFQUFFLFdBQVc7RUFDakMsS0FBSyxDQUFDO0VBQ04sSUFBSSxXQUFXLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQyxFQUFFLENBQUM7RUFDL0MsSUFBSSxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVTtFQUNsQyxNQUFNLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUM7RUFDeEMsTUFBTSxXQUFXO0VBQ2pCLEtBQUssQ0FBQztFQUNOLElBQUksTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtFQUM3RCxNQUFNLEdBQUcsRUFBRSxTQUFTO0VBQ3BCLE1BQU0sR0FBRyxFQUFFLFdBQVc7RUFDdEIsS0FBSyxDQUFDLENBQUM7RUFDUCxHQUFHOztFQUVILEVBQUUsTUFBTSxHQUFHLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzs7RUFFbEMsRUFBRSxNQUFNLGFBQWEsR0FBR0EsWUFBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0VBQy9DLEVBQUUsYUFBYSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7RUFDOUIsRUFBRSxPQUFPLGFBQWEsQ0FBQztFQUN2QixDQUFDLENBQUM7O0VBRUYsTUFBTSx5QkFBeUIsR0FBRyxPQUFPLEdBQUcsRUFBRSxNQUFNLEtBQUs7RUFDekQsRUFBRSxNQUFNLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztFQUVwRSxFQUFFLEtBQUssTUFBTSxLQUFLLElBQUksVUFBVSxDQUFDLE9BQU8sRUFBRTtFQUMxQyxJQUFJLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNyRCxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsTUFBTSxlQUFlLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUU7RUFDM0csR0FBRztFQUNILENBQUMsQ0FBQzs7RUFFRixNQUFNLGlDQUFpQyxHQUFHLE9BQU8sR0FBRyxFQUFFLE1BQU0sS0FBSztFQUNqRSxFQUFFLE1BQU0sVUFBVSxHQUFHLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7O0VBRXBFLEVBQUUsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLDZCQUE2QixDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsRUFBRTtFQUN2RSxJQUFJdUIsTUFBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRTtFQUNuRCxNQUFNQSxNQUFHLENBQUMsQ0FBQyxJQUFJLE9BQU87RUFDdEIsUUFBUSxHQUFHLENBQUMsU0FBUztFQUNyQixRQUFRLENBQUM7RUFDVCxPQUFPLENBQUM7RUFDUixLQUFLLENBQUMsQ0FBQztFQUNQLElBQUl5QyxVQUFPO0VBQ1gsR0FBRyxDQUFDLENBQUM7O0VBRUwsRUFBRSxLQUFLLE1BQU0sU0FBUyxJQUFJLFVBQVUsRUFBRTtFQUN0QyxJQUFJLE1BQU0sZUFBZTtFQUN6QixNQUFNLEdBQUcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxTQUFTO0VBQzFDLEtBQUssQ0FBQztFQUNOLEdBQUc7RUFDSCxDQUFDLENBQUM7O0VBRUYsTUFBTSw2QkFBNkIsR0FBRyxDQUFDLEdBQUcsRUFBRSxVQUFVLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUU7RUFDNUUsRUFBRSxxQkFBcUI7RUFDdkIsRUFBRXhDLFNBQU0sQ0FBQyxRQUFRLENBQUM7RUFDbEIsRUFBRUQsTUFBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO0VBQ3BCLEVBQUV5QyxVQUFPO0VBQ1QsRUFBRXhDLFNBQU0sQ0FBQyw0QkFBNEIsQ0FBQyxVQUFVLENBQUMsQ0FBQztFQUNsRCxDQUFDLENBQUMsQ0FBQzs7RUN6SEksTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLEdBQUcsRUFBRSxjQUFjLEdBQUcsS0FBSyxLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVU7RUFDeEYsRUFBRSxHQUFHO0VBQ0wsRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU07RUFDN0IsRUFBRSxVQUFVLENBQUMsZ0JBQWdCLENBQUMsWUFBWTtFQUMxQyxFQUFFLEVBQUUsR0FBRyxFQUFFO0VBQ1QsRUFBRSxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLGNBQWM7RUFDN0MsQ0FBQyxDQUFDOzs7QUFHRixFQUFPLE1BQU0saUJBQWlCLEdBQUcsT0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLGNBQWMsS0FBSztFQUNyRSxFQUFFLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDckIsRUFBRSxNQUFNLElBQUksR0FBRyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7O0VBRTVELEVBQUUsTUFBTSxhQUFhLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQ2hDLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQzVDLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7RUFDekMsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUUsTUFBTSxHQUFHLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFO0VBQzNELENBQUMsQ0FBQzs7RUFFRixNQUFNLHNCQUFzQixHQUFHLE9BQU8sR0FBRyxFQUFFLEdBQUcsS0FBSyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7RUFHekYsTUFBTSxtQkFBbUIsR0FBRyxPQUFPLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxLQUFLO0VBQ3RELEVBQUUsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFlBQVk7RUFDbEMsSUFBSSxPQUFPO0VBQ1gsTUFBTSxHQUFHLEVBQUUsUUFBUTtFQUNuQixNQUFNLElBQUksQ0FBQyxNQUFNO0VBQ2pCLEtBQUs7RUFDTCxHQUFHLENBQUM7O0VBRUosRUFBRSxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsWUFBWTtFQUNsQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDO0VBQzFCLEdBQUcsQ0FBQztFQUNKLENBQUMsQ0FBQzs7RUFFRixNQUFNLGFBQWEsR0FBRyxPQUFPLEdBQUcsRUFBRSxHQUFHLEtBQUs7RUFDMUMsRUFBRSxNQUFNLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztFQUNqQyxFQUFFLE1BQU0saUJBQWlCLEdBQUcsT0FBTyxRQUFRLEtBQUs7RUFDaEQsSUFBSSxNQUFNLFFBQVEsR0FBRyxpQkFBaUI7RUFDdEMsTUFBTSxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxRQUFRO0VBQ2xDLEtBQUssQ0FBQzs7RUFFTixJQUFJLElBQUlQLFdBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO0VBQ2pELE1BQU0sT0FBTztFQUNiLEtBQUs7O0VBRUwsSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O0VBRXZDLElBQUksTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUM3QyxHQUFHLENBQUM7O0VBRUosRUFBRSxNQUFNLE9BQU8sR0FBRyxNQUFNLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztFQUVwRCxFQUFFLElBQUksR0FBRyxHQUFHLE1BQU0sT0FBTyxFQUFFLENBQUM7RUFDNUIsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRTtFQUNwQixJQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEtBQUssR0FBRyxFQUFFO0VBQzFDLE1BQU0sS0FBSyxNQUFNLEVBQUUsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtFQUN2QyxRQUFRLE1BQU0sYUFBYTtFQUMzQixVQUFVLEdBQUc7RUFDYixVQUFVLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO0VBQzFCLFVBQVUsSUFBSTtFQUNkLFNBQVMsQ0FBQztFQUNWLFFBQVEsTUFBTSxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUNwQyxPQUFPO0VBQ1AsS0FBSzs7RUFFTCxJQUFJLEdBQUcsR0FBRyxNQUFNLE9BQU8sRUFBRSxDQUFDO0VBQzFCLEdBQUc7RUFDSCxDQUFDLENBQUM7O0VDbEVLLE1BQU0sWUFBWSxHQUFHLE9BQU8sR0FBRyxFQUFFLFFBQVEsRUFBRSxhQUFhLEtBQUs7RUFDcEUsRUFBRSxNQUFNLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7O0VBRWpFLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQyxFQUFFOztFQUUvRSxFQUFFLElBQUksY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFO0VBQ2pDLElBQUksTUFBTSxTQUFTLEdBQUcsTUFBTSxlQUFlLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0VBQzNELElBQUksS0FBSyxNQUFNLENBQUMsSUFBSSxTQUFTLEVBQUU7RUFDL0IsTUFBTSxNQUFNLGdCQUFnQjtFQUM1QixRQUFRLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztFQUNuQyxPQUFPLENBQUM7RUFDUixLQUFLO0VBQ0wsSUFBSSxnQkFBZ0I7RUFDcEIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVTtFQUNwQyxRQUFRLGNBQWMsQ0FBQyxRQUFRLENBQUM7RUFDaEMsT0FBTztFQUNQLEtBQUssQ0FBQztFQUNOLEdBQUcsTUFBTTtFQUNULElBQUksTUFBTSxnQkFBZ0I7RUFDMUIsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVU7RUFDOUIsUUFBUSx3QkFBd0IsQ0FBQyxRQUFRLENBQUM7RUFDMUMsT0FBTztFQUNQLEtBQUssQ0FBQztFQUNOLEdBQUc7O0VBRUgsRUFBRSxJQUFJLGFBQWEsRUFBRTtFQUNyQixJQUFJLGdCQUFnQjtFQUNwQixNQUFNLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDO0VBQ2hELEtBQUssQ0FBQztFQUNOLEdBQUc7RUFDSCxDQUFDLENBQUM7O0VDMUJLLE1BQU1tRCxjQUFZLEdBQUcsQ0FBQyxHQUFHLEVBQUUsY0FBYyxHQUFHLEtBQUssS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVO0VBQ3BGLEVBQUUsR0FBRztFQUNMLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNO0VBQ3pCLEVBQUUsVUFBVSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDO0VBQzNDLEVBQUUsRUFBRSxHQUFHLEVBQUU7RUFDVCxFQUFFLGFBQWEsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLGNBQWM7RUFDekMsQ0FBQyxDQUFDOztFQUVGO0FBQ0EsRUFBTyxNQUFNLGFBQWEsR0FBRyxPQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsY0FBYyxLQUFLO0VBQ2pFLEVBQUUsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNyQixFQUFFLE1BQU0sSUFBSSxHQUFHLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7RUFFdkQsRUFBRSxNQUFNLE1BQU0sR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7RUFDdkMsRUFBRSxNQUFNLDBCQUEwQixDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQzs7RUFFaEQsRUFBRSxLQUFLLE1BQU0sZ0JBQWdCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtFQUNoRCxJQUFJLE1BQU0sYUFBYSxHQUFHLE9BQU87RUFDakMsTUFBTSxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsY0FBYztFQUMxQyxLQUFLLENBQUM7RUFDTixJQUFJLE1BQU0saUJBQWlCLENBQUMsR0FBRyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztFQUN0RCxHQUFHOztFQUVILEVBQUUsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVU7RUFDaEMsSUFBSSxpQkFBaUIsQ0FBQyxHQUFHLENBQUM7RUFDMUIsR0FBRyxDQUFDOztFQUVKLEVBQUUsTUFBTSxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDOztFQUU5QixFQUFFLE1BQU0sZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7O0VBRS9ELEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLE1BQU0sR0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUMsRUFBRTs7RUFFM0QsRUFBRSxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ3hDLEVBQUUsTUFBTSxhQUFhLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQ2hDLENBQUMsQ0FBQzs7RUFFRixNQUFNLGFBQWEsR0FBRyxPQUFPLEdBQUcsRUFBRSxHQUFHLEtBQUs7RUFDMUMsRUFBRSxNQUFNLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDdkQ7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUVBO0VBQ0E7RUFDQTs7O0VBR0EsRUFBRSxLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7RUFDcEMsSUFBSSxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUM5QyxJQUFJLE1BQU0sWUFBWSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7RUFDNUMsR0FBRztFQUNILENBQUMsQ0FBQzs7RUFFRixNQUFNLFdBQVcsR0FBRyxPQUFPLEdBQUcsRUFBRSxHQUFHLEtBQUs7RUFDeEMsRUFBRSxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0VBQzVDLEVBQUUsTUFBTSxRQUFRLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLGlCQUFpQjtFQUN4RCxJQUFJLFdBQVc7RUFDZixHQUFHLENBQUM7O0VBRUosRUFBRSxLQUFLLE1BQU0sSUFBSSxJQUFJLFFBQVEsRUFBRTtFQUMvQixJQUFJLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDekMsR0FBRzs7RUFFSCxFQUFFLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZO0VBQ2xDLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUM7RUFDekIsR0FBRyxDQUFDO0VBQ0osQ0FBQyxDQUFDOztFQ2hGSyxNQUFNLFVBQVUsR0FBRyxHQUFHLElBQUksT0FBTyxTQUFTLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixLQUFLLFVBQVU7RUFDbEcsRUFBRSxHQUFHO0VBQ0wsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVU7RUFDN0IsRUFBRSxVQUFVLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUM7RUFDakQsRUFBRSxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsZ0JBQWdCLEVBQUU7RUFDakQsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsZ0JBQWdCO0VBQy9ELENBQUMsQ0FBQzs7RUFFRixNQUFNLFdBQVcsR0FBRyxPQUFPLEdBQUcsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixLQUFLO0VBQ2hGLEVBQUUsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxNQUFNLElBQUksZUFBZSxDQUFDLHlCQUF5QixDQUFDLENBQUMsRUFBRTtFQUNyRixFQUFFLElBQUksU0FBUyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxNQUFNLElBQUksZUFBZSxDQUFDLHdCQUF3QixDQUFDLENBQUMsRUFBRTtFQUMzRixFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLE1BQU0sSUFBSSxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxFQUFFOztFQUU1RixFQUFFLE1BQU0sTUFBTSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQzs7RUFFN0MsRUFBRSxNQUFNLFlBQVksR0FBRyxtQkFBbUI7RUFDMUMsSUFBSSxTQUFTLEVBQUUsZ0JBQWdCO0VBQy9CLEdBQUcsQ0FBQzs7RUFFSixFQUFFLE1BQU0sWUFBWSxHQUFHLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxFQUFFdEUsZ0JBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDOztFQUU1RCxFQUFFLE1BQU0sWUFBWSxHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0I7RUFDN0QsSUFBSSxZQUFZO0VBQ2hCLEdBQUcsQ0FBQzs7RUFFSixFQUFFLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLO0VBQ3pDLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztFQUN0QyxJQUFJLFlBQVksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0VBQ3JDLElBQUksWUFBWSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7RUFDdkMsR0FBRyxDQUFDO0VBQ0osR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztFQUN0RCxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUk7RUFDaEIsSUFBSSxNQUFNLGtCQUFrQixHQUFHLDBCQUEwQjtFQUN6RCxNQUFNLEdBQUcsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSTtFQUN6QyxLQUFLLENBQUM7RUFDTixJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLE1BQU0sSUFBSSxlQUFlLENBQUMsQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLENBQUMsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7O0VBRXRKLEdBQUcsQ0FBQztFQUNKLEdBQUcsSUFBSSxDQUFDLE1BQU0sZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7RUFDdkUsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQzs7RUFFcEU7RUFDQTs7RUFFQTs7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUVBO0VBQ0E7RUFDQTtFQUNBOztFQUVBOztFQUVBO0VBQ0E7RUFDQSxDQUFDLENBQUM7O0VBRUYsTUFBTSwwQkFBMEIsR0FBRyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsWUFBWSxLQUFLO0VBQ3BGLEVBQUUsTUFBTSxVQUFVLEdBQUcsbUJBQW1CLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7RUFFcEUsRUFBRSxNQUFNLG1CQUFtQixHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO0VBQ25ELElBQUkwQixTQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTTtFQUNqQyxTQUFTLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxLQUFLLGdCQUFnQjtFQUN6RCxTQUFTLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFlBQVksQ0FBQztFQUM5QyxJQUFJRCxNQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUM7RUFDcEIsR0FBRyxDQUFDLENBQUM7O0VBRUwsRUFBRSxNQUFNLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO0VBQ3hELElBQUlDLFNBQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxhQUFhO0VBQ3hDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7RUFDM0IsUUFBUVYsT0FBSSxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksS0FBSyxnQkFBZ0I7RUFDbEUsYUFBYSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxZQUFZLENBQUM7RUFDbEQsT0FBTyxDQUFDLENBQUM7RUFDVCxJQUFJUyxNQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUM7RUFDcEIsR0FBRyxDQUFDLENBQUM7O0VBRUwsRUFBRSxNQUFNLGVBQWUsR0FBRztFQUMxQixJQUFJLEdBQUcsbUJBQW1CO0VBQzFCLElBQUksR0FBRyx3QkFBd0I7RUFDL0IsR0FBRyxDQUFDOztFQUVKLEVBQUUsSUFBSSxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtFQUNsQyxJQUFJLE9BQU8sS0FBSyxDQUFDO0VBQ2pCLEdBQUc7O0VBRUgsRUFBRSxPQUFPLElBQUksQ0FBQztFQUNkLENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLEtBQUs7RUFDcEUsRUFBRSxNQUFNLFdBQVcsR0FBRyxNQUFNLEVBQUUsTUFBTSxJQUFJLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7RUFFN0UsRUFBRSxJQUFJLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQzs7RUFFdkQsRUFBRSxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7RUFFL0MsRUFBRSxJQUFJTixXQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUM7O0VBRS9DLEVBQUUsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztFQUU3QyxFQUFFLE1BQU0sYUFBYSxHQUFHO0VBQ3hCLElBQUksR0FBRyxjQUFjO0VBQ3JCLElBQUksT0FBTztFQUNYLElBQUksR0FBR08sU0FBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDO0VBQ3hDLEdBQUcsQ0FBQzs7RUFFSixFQUFFLE9BQU8sT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0VBQ2hDLENBQUMsQ0FBQzs7RUMxSEssTUFBTSxZQUFZLEdBQUcsR0FBRyxJQUFJLE9BQU8sU0FBUyxFQUFFLFlBQVksS0FBSyxVQUFVO0VBQ2hGLEVBQUUsR0FBRztFQUNMLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVO0VBQzdCLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO0VBQy9DLEVBQUUsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFO0VBQzdCLEVBQUUsYUFBYSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsWUFBWTtFQUM3QyxDQUFDLENBQUM7OztFQUdGLE1BQU0sYUFBYSxHQUFHLE9BQU8sR0FBRyxFQUFFLFNBQVMsRUFBRSxZQUFZLEtBQUs7RUFDOUQsRUFBRSxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLE1BQU0sSUFBSSxlQUFlLENBQUMseUJBQXlCLENBQUMsQ0FBQyxFQUFFO0VBQ3JGLEVBQUUsSUFBSSxTQUFTLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxNQUFNLElBQUksZUFBZSxDQUFDLHdCQUF3QixDQUFDLENBQUMsRUFBRTs7RUFFdkYsRUFBRSxPQUFPLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0I7RUFDL0MsSUFBSSxtQkFBbUI7RUFDdkIsTUFBTSxTQUFTLEVBQUUsWUFBWTtFQUM3QixLQUFLO0VBQ0wsR0FBRyxDQUFDO0VBQ0osQ0FBQyxDQUFDOztFQ2xCSyxNQUFNLFFBQVEsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLO0VBQ2pELEVBQUUsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUU7RUFDaEMsSUFBSSxxQkFBcUI7RUFDekIsSUFBSU8sT0FBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQztFQUNsQyxHQUFHLENBQUMsQ0FBQzs7RUFFTCxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxJQUFJLGFBQWEsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7RUFFckUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQ2hDLENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0sV0FBVyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUs7RUFDbEQsRUFBRSxNQUFNLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDOztFQUU3QyxFQUFFLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7O0VBRXhDLEVBQUUsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFO0VBQzNCLElBQUlDLE9BQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztFQUM3QixJQUFJcEMsUUFBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLElBQUksT0FBTztFQUNYLEdBQUcsQ0FBQyxDQUFDOztFQUVMLEVBQUUsT0FBTyxNQUFNLENBQUM7RUFDaEIsQ0FBQyxDQUFDOztFQ2xCRixNQUFNLEdBQUcsR0FBRyxHQUFHLEtBQUs7RUFDcEIsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQztFQUNyQixFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsR0FBRyxDQUFDO0VBQy9CLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUM7RUFDakIsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQztFQUNqQixFQUFFLE1BQU0sRUFBRXdFLGNBQVksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDO0VBQ2xDLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUM7RUFDekIsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQztFQUM3QixFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDO0VBQzdCLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQyxHQUFHLENBQUM7RUFDakMsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQztFQUN6QixFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsR0FBRyxDQUFDO0VBQy9CLENBQUMsQ0FBQyxDQUFDOzs7QUFHSCxBQUFZLFFBQUMsWUFBWSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDOztFQ25CcEMsTUFBTSxxQkFBcUIsR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLGNBQWM7RUFDakUsRUFBRSxHQUFHO0VBQ0wsRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDLHFCQUFxQjtFQUM1QyxFQUFFLGdCQUFnQjtFQUNsQixFQUFFLEVBQUUsR0FBRyxFQUFFO0VBQ1QsRUFBRSxzQkFBc0IsRUFBRSxHQUFHLEVBQUUsR0FBRztFQUNsQyxDQUFDLENBQUM7O0VBRUYsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUs7RUFDN0MsRUFBRSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ3JCLEVBQUUsTUFBTSxJQUFJLEdBQUcsd0JBQXdCLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzVELEVBQUUsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzVDLENBQUMsQ0FBQzs7QUNkVSxRQUFDLGdCQUFnQixHQUFHLEdBQUcsS0FBSztFQUN4QyxFQUFFLHFCQUFxQixFQUFFLHFCQUFxQixDQUFDLEdBQUcsQ0FBQztFQUNuRCxFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLEdBQUcsQ0FBQztFQUMzQyxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxHQUFHLENBQUM7RUFDL0IsQ0FBQyxDQUFDOztFQ2NGO0VBQ0E7RUFDQTtFQUNBO0FBQ0EsRUFBTyxNQUFNLFVBQVUsR0FBRyxHQUFHLElBQUksTUFBTSxZQUFZLElBQUksVUFBVTtFQUNqRSxFQUFFLEdBQUc7RUFDTCxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVTtFQUM1QixFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsWUFBWTtFQUNyQyxFQUFFLEVBQUUsWUFBWSxFQUFFO0VBQ2xCLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxZQUFZO0VBQ2hDLENBQUMsQ0FBQzs7RUFFRixNQUFNLFdBQVcsR0FBRyxPQUFPLEdBQUcsRUFBRSxZQUFZLEtBQUs7RUFDakQsRUFBRSxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQzs7RUFFekQsRUFBRSxNQUFNLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7O0VBRTVELEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLE1BQU0sSUFBSSxlQUFlLENBQUMsc0NBQXNDLENBQUMsQ0FBQyxFQUFFOztFQUVqRyxFQUFFLElBQUksU0FBUyxDQUFDLFNBQVMsS0FBSyxXQUFXLEVBQUU7RUFDM0MsSUFBSSxNQUFNLDBCQUEwQjtFQUNwQyxNQUFNLEdBQUcsRUFBRSxTQUFTO0VBQ3BCLEtBQUssQ0FBQztFQUNOLEdBQUcsTUFBTTtFQUNULElBQUksTUFBTSxvQkFBb0I7RUFDOUIsTUFBTSxHQUFHLEVBQUUsU0FBUztFQUNwQixLQUFLLENBQUM7RUFDTixHQUFHOztFQUVILEVBQUUsTUFBTSxHQUFHLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztFQUNsQyxDQUFDLENBQUM7O0VBRUYsTUFBTSwwQkFBMEIsR0FBRyxPQUFPLEdBQUcsRUFBRSxTQUFTLEtBQUs7RUFDN0Q7RUFDQTtFQUNBLEVBQUUsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDO0VBQ3RCLEVBQUUsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRTtFQUM1QyxJQUFJLHFCQUFxQjtFQUN6QixJQUFJNUMsU0FBTSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO0VBQzNCLHVCQUF1QlYsT0FBSSxDQUFDLDZCQUE2QixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ2hGLEdBQUcsQ0FBQyxDQUFDOztFQUVMLEVBQUUsTUFBTSxvQ0FBb0MsR0FBRyxPQUFPLGVBQWUsS0FBSztFQUMxRSxJQUFJLE1BQU0sdUJBQXVCLEdBQUcsTUFBTSxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDOztFQUV0RyxJQUFJLElBQUkscUJBQXFCLEdBQUcsTUFBTSx1QkFBdUIsRUFBRSxDQUFDO0VBQ2hFLElBQUksT0FBTyxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRTtFQUN4QyxNQUFNLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxxQkFBcUIsQ0FBQztFQUMvQyxNQUFNLEtBQUssTUFBTSxFQUFFLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRTtFQUNuQyxRQUFRLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQzVELFFBQVEsTUFBTSx3QkFBd0IsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztFQUN6RixRQUFRLFdBQVcsRUFBRSxDQUFDO0VBQ3RCLE9BQU87RUFDUCxNQUFNLHFCQUFxQixHQUFHLE1BQU0sdUJBQXVCLEVBQUUsQ0FBQztFQUM5RCxLQUFLO0VBQ0wsR0FBRyxDQUFDOztFQUVKLEVBQUUsS0FBSyxNQUFNLGVBQWUsSUFBSSxnQkFBZ0IsRUFBRTtFQUNsRCxJQUFJLE1BQU0sb0NBQW9DLENBQUMsZUFBZSxDQUFDLENBQUM7RUFDaEUsR0FBRztFQUNILENBQUMsQ0FBQztBQUNGLEFBSUE7RUFDQSxNQUFNLG9CQUFvQixHQUFHLE9BQU8sR0FBRyxFQUFFLFNBQVMsS0FBSztFQUN2RCxFQUFFLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQzs7RUFFdEIsRUFBRSxNQUFNLHdCQUF3QixHQUFHLE9BQU8sYUFBYSxFQUFFLEdBQUcsS0FBSztFQUNqRSxJQUFJLEtBQUssTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0VBQ2hDLE1BQU0sTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQzs7RUFFekQsTUFBTSxNQUFNLFVBQVUsR0FBRyxpQkFBaUI7RUFDMUMsUUFBUSxHQUFHLENBQUMsU0FBUztFQUNyQixRQUFRLFFBQVE7RUFDaEIsT0FBTyxDQUFDOztFQUVSLE1BQU0sSUFBSSxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRTtFQUNwRCxRQUFRLE1BQU0sd0JBQXdCO0VBQ3RDLFVBQVUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxPQUFPLEVBQUU7RUFDbEMsVUFBVSxTQUFTLEVBQUUsV0FBVztFQUNoQyxTQUFTLENBQUM7RUFDVixRQUFRLFdBQVcsRUFBRSxDQUFDO0VBQ3RCLE9BQU87RUFDUCxLQUFLO0VBQ0wsR0FBRyxDQUFDOzs7RUFHSixFQUFFLE1BQU0saUJBQWlCLEdBQUcsNkJBQTZCLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzs7RUFFcEYsRUFBRSxLQUFLLE1BQU0sMEJBQTBCLElBQUksaUJBQWlCLEVBQUU7RUFDOUQsSUFBSSxNQUFNLGNBQWMsR0FBRyxNQUFNLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLDBCQUEwQixDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQzs7RUFFeEcsSUFBSSxJQUFJLE1BQU0sR0FBRyxNQUFNLGNBQWMsRUFBRSxDQUFDO0VBQ3hDLElBQUksT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBRTtFQUNsQyxNQUFNLE1BQU0sd0JBQXdCO0VBQ3BDLFFBQVEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhO0VBQ25DLFFBQVEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHO0VBQ3pCLE9BQU8sQ0FBQztFQUNSLE1BQU0sTUFBTSxHQUFHLE1BQU0sY0FBYyxFQUFFLENBQUM7RUFDdEMsS0FBSztFQUNMLEdBQUc7O0VBRUgsRUFBRSxPQUFPLFdBQVcsQ0FBQztFQUNyQixDQUFDLENBQUM7QUFDRixBQUVBO0VBQ0EsTUFBTSxpQkFBaUIsR0FBRyxTQUFTLElBQUksVUFBVSxJQUFJRyxXQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOztFQ2hIMUcsTUFBTSxVQUFVLEdBQUcsR0FBRyxJQUFJLE9BQU8sUUFBUSxFQUFFLGdCQUFnQixHQUFHLElBQUksRUFBRSxjQUFjLEdBQUcsSUFBSSxLQUFLLFVBQVU7RUFDL0csRUFBRSxHQUFHO0VBQ0wsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVU7RUFDNUIsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7RUFDN0MsRUFBRSxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLEVBQUU7RUFDaEQsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxjQUFjO0VBQzlELENBQUMsQ0FBQzs7RUFFRixNQUFNLFdBQVcsR0FBRyxPQUFPLEdBQUcsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxLQUFLO0VBQy9FLEVBQUUsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUMvQixFQUFFLE1BQU0sU0FBUyxHQUFHLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7RUFFakUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsTUFBTSxJQUFJLGVBQWUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLEVBQUU7O0VBRXpGLEVBQUUsSUFBSSxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUU7RUFDakMsSUFBSSxNQUFNLFNBQVMsR0FBRyxNQUFNLG1CQUFtQjtFQUMvQyxNQUFNLEdBQUcsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYztFQUNyRCxLQUFLLENBQUM7RUFDTixJQUFJLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQztFQUMvQixJQUFJLEtBQUssTUFBTSxDQUFDLElBQUksU0FBUyxFQUFFO0VBQy9CLE1BQU0sTUFBTSxXQUFXLEdBQUcsTUFBTSxhQUFhLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUMxRixNQUFNLElBQUksZUFBZSxLQUFLLElBQUksRUFBRTtFQUNwQyxRQUFRLGVBQWUsR0FBRyxXQUFXLENBQUM7RUFDdEMsT0FBTyxNQUFNO0VBQ2IsUUFBUSxlQUFlLEdBQUcsbUJBQW1CO0VBQzdDLFVBQVUsZUFBZTtFQUN6QixVQUFVLFdBQVc7RUFDckIsU0FBUyxDQUFDO0VBQ1YsT0FBTztFQUNQLEtBQUs7RUFDTCxJQUFJLE9BQU8sZUFBZSxDQUFDO0VBQzNCLEdBQUc7RUFDSCxFQUFFLE9BQU8sTUFBTSxhQUFhO0VBQzVCLElBQUksR0FBRyxDQUFDLFNBQVM7RUFDakIsSUFBSSxHQUFHLENBQUMsU0FBUztFQUNqQixJQUFJLFNBQVM7RUFDYixJQUFJLHdCQUF3QixDQUFDLFFBQVEsQ0FBQztFQUN0QyxHQUFHLENBQUM7RUFDSixDQUFDLENBQUM7O0VBRUYsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLEtBQUs7RUFDL0MsRUFBRSxNQUFNLGFBQWEsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUs7RUFDdEMsSUFBSSxHQUFHLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUM7RUFDM0IsSUFBSSxLQUFLLE1BQU0sT0FBTyxJQUFJLEdBQUcsRUFBRTtFQUMvQixNQUFNLElBQUksT0FBTyxLQUFLLE9BQU8sRUFBRSxTQUFTO0VBQ3hDLE1BQU0sTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0VBQ2xDLE1BQU0sTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0VBQ2xDLE1BQU0sTUFBTSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDO0VBQy9CLE1BQU0sTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHO0VBQzFDLFVBQVUsTUFBTSxDQUFDLEdBQUc7RUFDcEIsVUFBVSxNQUFNLENBQUMsR0FBRyxDQUFDO0VBQ3JCLE1BQU0sTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHO0VBQzFDLFVBQVUsTUFBTSxDQUFDLEdBQUc7RUFDcEIsVUFBVSxNQUFNLENBQUMsR0FBRyxDQUFDO0VBQ3JCLE1BQU0sTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7RUFDM0MsS0FBSztFQUNMLElBQUksT0FBTyxHQUFHLENBQUM7RUFDZixHQUFHLENBQUM7O0VBRUosRUFBRSxLQUFLLE1BQU0sV0FBVyxJQUFJLE1BQU0sRUFBRTtFQUNwQyxJQUFJLEtBQUssTUFBTSxRQUFRLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFO0VBQy9DLE1BQU0sTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQzFELE1BQU0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHbEIsY0FBVyxDQUFDLGFBQWEsQ0FBQztFQUNoRSxVQUFVLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLENBQUM7RUFDdEMsVUFBVSxhQUFhO0VBQ3ZCLFVBQVUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztFQUN2QyxVQUFVLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLENBQUM7RUFDdEMsU0FBUyxDQUFDO0VBQ1YsS0FBSztFQUNMLEdBQUc7O0VBRUgsRUFBRSxPQUFPLE1BQU0sQ0FBQztFQUNoQixDQUFDLENBQUM7O0VBRUYsTUFBTSxhQUFhLEdBQUcsT0FBTyxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxjQUFjLEtBQUs7RUFDN0UsRUFBRSxNQUFNLGVBQWUsR0FBRyxFQUFFLENBQUM7RUFDN0IsRUFBRSxNQUFNLE1BQU0sR0FBRyxZQUFZO0VBQzdCLFFBQVEsTUFBTSxJQUFJLElBQUk7RUFDdEIsTUFBTSwwQkFBMEI7RUFDaEMsUUFBUSxLQUFLLEVBQUUsZUFBZSxFQUFFLElBQUk7RUFDcEMsT0FBTyxDQUFDO0VBQ1IsTUFBTSxPQUFPLHdCQUF3QixDQUFDO0VBQ3RDLEtBQUs7RUFDTCxRQUFRLFlBQVksZUFBZTtFQUNuQyxHQUFHLENBQUM7O0VBRUosRUFBRSxPQUFPLE1BQU0sTUFBTSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0VBQ25FLENBQUMsQ0FBQzs7O0VBR0YsTUFBTSwwQkFBMEIsR0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLO0VBQ2hFLEVBQUUsTUFBTSx5QkFBeUIsR0FBRyxPQUFPO0VBQzNDLElBQUksR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUk7RUFDNUMsR0FBRyxDQUFDLENBQUM7O0VBRUwsRUFBRSxNQUFNLG9CQUFvQixHQUFHLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEtBQUs7RUFDekQsSUFBSSxNQUFNLEtBQUssR0FBRzJCLHdCQUFXLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7O0VBRXJFLElBQUksSUFBSSxDQUFDZ0IsV0FBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU8sUUFBUSxDQUFDOztFQUUxQyxJQUFJLFFBQVEsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDO0VBQzFCLElBQUksUUFBUSxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsUUFBUSxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsR0FBRyxLQUFLLElBQUk7RUFDaEUsUUFBUSxLQUFLO0VBQ2IsUUFBUSxRQUFRLENBQUMsR0FBRyxDQUFDO0VBQ3JCLElBQUksUUFBUSxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsUUFBUSxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsR0FBRyxLQUFLLElBQUk7RUFDaEUsUUFBUSxLQUFLO0VBQ2IsUUFBUSxRQUFRLENBQUMsR0FBRyxDQUFDO0VBQ3JCLElBQUksUUFBUSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQztFQUN6QyxJQUFJLE9BQU8sUUFBUSxDQUFDO0VBQ3BCLEdBQUcsQ0FBQzs7RUFFSixFQUFFLEtBQUssTUFBTSxRQUFRLElBQUksU0FBUyxDQUFDLGVBQWUsRUFBRTtFQUNwRCxJQUFJLElBQUksQ0FBQ1AsTUFBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRTtFQUNyQyxNQUFNLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0VBQ2pDLEtBQUs7O0VBRUwsSUFBSSxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDOztFQUVsRCxJQUFJLElBQUksZ0JBQWdCLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO0VBQzlDLE1BQU0sSUFBSSxDQUFDViw4QkFBaUIsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRTtFQUNwRSxRQUFRLFNBQVM7RUFDakIsT0FBTztFQUNQLEtBQUs7O0VBRUwsSUFBSSxJQUFJLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO0VBQ2xELFFBQVFDLHdCQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO0VBQ3ZELFFBQVEsS0FBSyxDQUFDO0VBQ2QsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEVBQUU7RUFDbEMsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDO0VBQ3ZCLEtBQUs7O0VBRUwsSUFBSSxJQUFJLENBQUNTLE1BQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUMsRUFBRTtFQUN0QyxNQUFNLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztFQUM1QyxNQUFNLEtBQUssTUFBTSxHQUFHLElBQUksUUFBUSxDQUFDLFVBQVUsRUFBRTtFQUM3QyxRQUFRLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcseUJBQXlCLEVBQUUsQ0FBQztFQUN2RSxPQUFPO0VBQ1AsS0FBSzs7RUFFTCxJQUFJLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7RUFFbkMsSUFBSSxLQUFLLE1BQU0sR0FBRyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEVBQUU7RUFDM0MsTUFBTSxNQUFNLGNBQWMsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzlELE1BQU0sZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxvQkFBb0I7RUFDN0QsUUFBUSxHQUFHLEVBQUUsY0FBYztFQUMzQixRQUFRLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLO0VBQ3BDLE9BQU8sQ0FBQztFQUNSLEtBQUs7RUFDTCxHQUFHO0VBQ0gsQ0FBQyxDQUFDOztBQ25LVSxRQUFDLFdBQVcsR0FBRyxHQUFHLEtBQUs7RUFDbkMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQztFQUMzQixFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDO0VBQzdCLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUM7RUFDN0IsQ0FBQyxDQUFDOztFQ01LLE1BQU0sZ0JBQWdCLEdBQUc7RUFDaEMsRUFBRSxtQkFBbUIsRUFBRSxtQ0FBbUM7RUFDMUQsRUFBRSw2QkFBNkIsRUFBRSx1Q0FBdUM7RUFDeEUsRUFBRSw2QkFBNkIsRUFBRSxxREFBcUQ7RUFDdEYsRUFBRSw0QkFBNEIsRUFBRSx3Q0FBd0M7RUFDeEUsQ0FBQyxDQUFDOztFQUVGLE1BQU0sYUFBYSxHQUFHLElBQUksSUFBSSxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDLENBQUM7O0VBRXRGLE1BQU0sWUFBWSxHQUFHLElBQUksSUFBSSxNQUFNLFVBQVU7O0VBRTdDLEVBQUUsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztFQUN6QyxJQUFJLENBQUMsSUFBSSxPQUFPO0VBQ2hCLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sRUFBRTtFQUM3QixNQUFNLElBQUksQ0FBQyxjQUFjO0VBQ3pCLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0VBQ3hCLEtBQUssQ0FBQzs7RUFFTixFQUFFLENBQUMsTUFBTTtFQUNULElBQUl0QixVQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7O0VBRWxCLEVBQUUsQ0FBQyxXQUFXO0VBQ2QsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7O0VBRWxELENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7O0VBR1IsTUFBTXdELFVBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEtBQUs7RUFDckMsRUFBRSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUM7RUFDbkIsV0FBVyxXQUFXLENBQUMsTUFBTSxDQUFDO0VBQzlCLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0VBQzFCLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7RUFDOUIsSUFBSSxNQUFNLElBQUksZUFBZSxDQUFDLGdCQUFnQixDQUFDLDZCQUE2QixDQUFDLENBQUM7RUFDOUUsR0FBRzs7RUFFSCxFQUFFLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDO0VBQzVCLFdBQVcsV0FBVyxDQUFDLE1BQU0sQ0FBQztFQUM5QixXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0VBQzdCLElBQUksTUFBTSxJQUFJLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0VBQzdFLEdBQUc7O0VBRUgsRUFBRSxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sSUFBSSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxFQUFFOztFQUV4SCxFQUFFLE9BQU8sSUFBSSxDQUFDO0VBQ2QsQ0FBQyxDQUFDOztFQUVGLE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksS0FBSztFQUN0QyxFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3BDLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDdEMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHeEQsVUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ2pDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUM7RUFDdkMsMkJBQTJCLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTTtFQUMvQywyQkFBMkIsSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLENBQUM7RUFDaEQsRUFBRSxJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFO0VBQ2hDLElBQUksSUFBSSxDQUFDLGlCQUFpQixHQUFHLE1BQU0sT0FBTztFQUMxQyxNQUFNLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYztFQUMzQyxLQUFLLENBQUM7RUFDTixJQUFJLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxNQUFNLE9BQU87RUFDM0MsTUFBTSxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLGNBQWM7RUFDNUMsS0FBSyxDQUFDO0VBQ04sR0FBRztFQUNILEVBQUUsT0FBTyxJQUFJLENBQUM7RUFDZCxDQUFDLENBQUM7O0VBRUYsTUFBTSxXQUFXLEdBQUcsQ0FBQyxHQUFHLEtBQUs7RUFDN0IsRUFBRSxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7RUFDOUIsRUFBRSxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRTtFQUMzQixJQUFJLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQztFQUNwQjtFQUNBO0VBQ0EsSUFBSSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxJQUFJLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTs7RUFFM0ksSUFBSSxJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtFQUN2QixNQUFNLE1BQU0sWUFBWSxHQUFHa0IsTUFBSTtFQUMvQixRQUFRLE1BQU0sQ0FBQyxPQUFPO0VBQ3RCLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0VBQzlDLE9BQU8sQ0FBQztFQUNSLE1BQU0sSUFBSSxZQUFZLEVBQUU7RUFDeEIsUUFBUSxZQUFZLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUMzRCxPQUFPO0VBQ1AsS0FBSztFQUNMLEdBQUc7RUFDSCxFQUFFLE9BQU8sR0FBRyxDQUFDO0VBQ2IsQ0FBQyxDQUFDOztBQUVGLEVBQU8sTUFBTSxhQUFhLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUU7RUFDckQsRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDO0VBQ25CLEVBQUVzQyxVQUFRLENBQUMsTUFBTSxDQUFDO0VBQ2xCLEVBQUUsV0FBVztFQUNiLENBQUMsQ0FBQyxDQUFDOztFQUVILE1BQU0sU0FBUyxHQUFHLENBQUMsVUFBVSxLQUFLO0VBQ2xDO0VBQ0EsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLE9BQU8sSUFBSSxDQUFDO0VBQy9CLEVBQUUsTUFBTSxRQUFRLEdBQUcsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDL0QsRUFBRSxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7O0VBRXBDLEVBQUUsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFO0VBQ2xCLElBQUkscUJBQXFCO0VBQ3pCLElBQUk5QyxNQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUM7RUFDdEIsSUFBSStDLE1BQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0VBQ2YsQ0FBQyxDQUFDOztBQUVGLEVBQU8sTUFBTSxrQkFBa0IsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLEtBQUs7RUFDcEQsRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDMUIsRUFBRSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7RUFDcEIsSUFBSUwsTUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPO0VBQ3JCLE1BQU0sS0FBSyxJQUFJLGtCQUFrQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0VBQ2hELEdBQUc7RUFDSCxFQUFFLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtFQUM1QixJQUFJQSxNQUFJLENBQUMsSUFBSSxDQUFDLGVBQWU7RUFDN0IsTUFBTSxLQUFLLElBQUksa0JBQWtCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7RUFDaEQsR0FBRztFQUNILEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtFQUNqRCxJQUFJQSxNQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7RUFDdEIsTUFBTSxLQUFLLElBQUksa0JBQWtCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7RUFDaEQsR0FBRztFQUNILEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0VBQ25CLElBQUlBLE1BQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtFQUNwQixNQUFNLENBQUMsSUFBSUEsTUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLO0VBQzdDLFFBQVEsTUFBTSxHQUFHLEdBQUdwQixLQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ3ZELFFBQVEsSUFBSSxDQUFDLEdBQUcsRUFBRTtFQUNsQjtFQUNBLFVBQVUsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ3BDLFNBQVMsTUFBTTtFQUNmLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzlDLFNBQVM7RUFDVCxPQUFPLENBQUMsQ0FBQyxDQUFDO0VBQ1YsR0FBRztFQUNILEVBQUUsT0FBTyxJQUFJLENBQUM7RUFDZCxDQUFDLENBQUM7OztBQUdGLEVBQU8sTUFBTSxlQUFlLEdBQUcsTUFBTSxTQUFTLEVBQUUsQ0FBQztFQUNqRCxFQUFFLElBQUksRUFBRSxNQUFNO0VBQ2QsRUFBRSxJQUFJLEVBQUUsTUFBTTtFQUNkLEVBQUUsUUFBUSxFQUFFLEVBQUU7RUFDZCxFQUFFLFFBQVEsRUFBRSxFQUFFO0VBQ2QsRUFBRSxPQUFPLEVBQUUsRUFBRTtFQUNiLEVBQUUsTUFBTSxFQUFFLENBQUM7RUFDWCxDQUFDLENBQUMsQ0FBQzs7RUFFSCxNQUFNLHFCQUFxQixHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEtBQUs7RUFDOUUsRUFBRSxNQUFNLElBQUksR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFO0VBQ3JDLElBQUksSUFBSTtFQUNSLElBQUksSUFBSSxFQUFFLFFBQVE7RUFDbEIsSUFBSSxNQUFNLEVBQUUsRUFBRTtFQUNkLElBQUksUUFBUSxFQUFFLEVBQUU7RUFDaEIsSUFBSSxlQUFlLEVBQUUsRUFBRTtFQUN2QixJQUFJLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDO0VBQzdCLElBQUksT0FBTyxFQUFFLEVBQUU7RUFDZixJQUFJLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtFQUNoRCxJQUFJLGNBQWMsRUFBRSxFQUFFO0VBQ3RCLElBQUksUUFBUTtFQUNaLEdBQUcsQ0FBQyxDQUFDOztFQUVMLEVBQUUsSUFBSSxrQkFBa0IsRUFBRTtFQUMxQixJQUFJLE1BQU0sWUFBWSxHQUFHLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ3JELElBQUksWUFBWSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ3hDLElBQUksWUFBWSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDeEQsR0FBRzs7RUFFSCxFQUFFLE9BQU8sSUFBSSxDQUFDO0VBQ2QsQ0FBQyxDQUFDOztBQUVGLEVBQU8sTUFBTSxvQkFBb0IsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLGtCQUFrQixHQUFHLElBQUksS0FBSyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUVySixFQUFPLE1BQU0sMEJBQTBCLEdBQUcsTUFBTSxJQUFJLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDOztBQUVuRyxFQUFPLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxHQUFHLFVBQVUsS0FBSyxhQUFhLENBQUMsTUFBTSxFQUFFO0VBQ3hGLEVBQUUsSUFBSSxFQUFFLEVBQUU7RUFDVixFQUFFLElBQUksRUFBRSxPQUFPO0VBQ2YsRUFBRSxHQUFHLEVBQUUscUJBQXFCO0VBQzVCLEVBQUUsTUFBTSxFQUFFLEVBQUU7RUFDWixFQUFFLFNBQVMsRUFBRSxJQUFJO0VBQ2pCLEVBQUUsWUFBWSxFQUFFLEVBQUU7RUFDbEIsRUFBRSxVQUFVLEVBQUUsV0FBVztFQUN6QixFQUFFLGVBQWUsRUFBRSxFQUFFO0VBQ3JCLEVBQUUsb0JBQW9CLEVBQUUsRUFBRTtFQUMxQixFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDO0VBQzNCLENBQUMsQ0FBQyxDQUFDOztBQUVILEVBQU8sTUFBTSw0QkFBNEIsR0FBRyxLQUFLLElBQUksYUFBYSxDQUFDLEtBQUssRUFBRTtFQUMxRSxFQUFFLElBQUksRUFBRSxFQUFFO0VBQ1YsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCO0VBQ3hCLEVBQUUsT0FBTyxFQUFFLEVBQUU7RUFDYixFQUFFLFVBQVUsRUFBRSxFQUFFO0VBQ2hCLEVBQUUsU0FBUyxFQUFFLEVBQUU7RUFDZixFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDO0VBQzFCLENBQUMsQ0FBQyxDQUFDOztBQUVILEVBQU8sTUFBTSx1QkFBdUIsR0FBRyxDQUFDLEdBQUcsS0FBSztFQUNoRCxFQUFFLE1BQU0sZUFBZSxHQUFHO0VBQzFCLElBQUksSUFBSSxFQUFFLEVBQUU7RUFDWixJQUFJLGVBQWUsRUFBRSxFQUFFO0VBQ3ZCLEdBQUcsQ0FBQztFQUNKLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7RUFDdkMsRUFBRSxPQUFPLGVBQWUsQ0FBQztFQUN6QixDQUFDLENBQUM7O0VDdE1LLE1BQU0sV0FBVyxHQUFHO0VBQzNCLEVBQUUsd0JBQXdCLEVBQUUsd0JBQXdCO0VBQ3BELENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0sWUFBWSxHQUFHLE1BQU1sQixPQUFJLENBQUNrQixLQUFHLENBQUMsQ0FBQzs7QUFFNUMsRUFBTyxNQUFNLFdBQVcsR0FBRyxJQUFJLEtBQUs7RUFDcEMsRUFBRSxJQUFJLEVBQUUsRUFBRTtFQUNWLEVBQUUsSUFBSTtFQUNOLEVBQUUsV0FBVyxFQUFFQyxtQkFBaUIsQ0FBQyxJQUFJLENBQUM7RUFDdEMsRUFBRSxLQUFLLEVBQUUsRUFBRTtFQUNYLEVBQUUsZUFBZSxFQUFFLFNBQVM7RUFDNUIsRUFBRSxpQkFBaUIsRUFBRSxTQUFTO0VBQzlCLENBQUMsQ0FBQyxDQUFDOztFQUVILE1BQU0sVUFBVSxHQUFHLFNBQVMsSUFBSTtFQUNoQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsdUJBQXVCO0VBQzFDLElBQUksQ0FBQyxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNsQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsdUJBQXVCO0VBQzFDLElBQUksQ0FBQyxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNsQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLEVBQUUsd0JBQXdCO0VBQzVDLElBQUksQ0FBQyxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNuQyxFQUFFLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxxQ0FBcUM7RUFDbkUsSUFBSSxDQUFDLElBQUksZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0VBQzdDLEVBQUUsUUFBUSxDQUFDLG1CQUFtQixFQUFFLHVDQUF1QztFQUN2RSxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQztFQUMvQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsMEJBQTBCO0VBQzdDLElBQUksQ0FBQyxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7RUFDakMsZ0JBQWdCakIsVUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDekQsRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFFLGlCQUFpQjtFQUNwQyxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0VBQ2pDLGdCQUFnQmYsT0FBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7RUFDeEQsQ0FBQyxDQUFDOztFQUVGLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxLQUFLLEtBQUs7RUFDcEMsRUFBRSxNQUFNLElBQUksR0FBRytCLEtBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDL0IsRUFBRSxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQzs7RUFFakMsRUFBRSxNQUFNLEdBQUcsR0FBRyxPQUFPLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDOztFQUV6RCxFQUFFLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7RUFDOUIsSUFBSWxCLE9BQUk7RUFDUixJQUFJSCxTQUFNLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDbkMsdUJBQXVCLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7RUFDbkQsSUFBSUQsTUFBRyxDQUFDLENBQUMsSUFBSSxRQUFRO0VBQ3JCLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDeEIsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUM7RUFDeEMsTUFBTSxLQUFLLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ25ELEtBQUssQ0FBQztFQUNOLEdBQUcsQ0FBQyxDQUFDO0VBQ0wsQ0FBQyxDQUFDOztBQUVGLEVBQU8sTUFBTSxhQUFhLEdBQUcsU0FBUyxJQUFJLENBQUMsS0FBSyxLQUFLO0VBQ3JELEVBQUUsTUFBTSxnQkFBZ0IsR0FBR04sV0FBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDLEdBQUcsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0VBQzFGLEVBQUUsT0FBTyxZQUFZLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQzVGLENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0saUJBQWlCLEdBQUcsVUFBVSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO0VBQ3BFLEVBQUVNLE1BQUcsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ3ZDLEVBQUV5QyxVQUFPO0VBQ1QsQ0FBQyxDQUFDLENBQUM7O0FBRUgsRUFBTyxNQUFNLFFBQVEsR0FBRyxDQUFDLGNBQWMsRUFBRSxLQUFLLEtBQUs7RUFDbkQsRUFBRSxJQUFJLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtFQUNyQyxJQUFJLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztFQUM3QixHQUFHO0VBQ0gsRUFBRSxNQUFNLGtCQUFrQixHQUFHLGFBQWEsQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQ3JGLEVBQUUsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0VBQ3JDLElBQUksTUFBTSxNQUFNLEdBQUd6QyxNQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0VBQ3pELElBQUksTUFBTSxJQUFJLGVBQWUsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLHdCQUF3QixDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzlGLEdBQUc7RUFDSCxFQUFFLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQ3BDLENBQUMsQ0FBQzs7RUNuRkssTUFBTSwwQkFBMEIsR0FBRyxDQUFDLGFBQWE7RUFDeEQsRUFBRSxrQkFBa0I7RUFDcEIsRUFBRSxtQkFBbUIsTUFBTTtFQUMzQixFQUFFLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxtQkFBbUI7RUFDeEQsQ0FBQyxDQUFDLENBQUM7O0VBRUgsTUFBTSxjQUFjLEdBQUcsVUFBVTtFQUNqQyxFQUFFLENBQUNtQixXQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztFQUMvQixFQUFFLENBQUNILFlBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0VBQ2hDLEVBQUUsQ0FBQ2dDLGNBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzlCLENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0sMkJBQTJCLElBQUk7O0VBRTVDLEVBQUUsYUFBYSxFQUFFLFNBQVMsSUFBSSwwQkFBMEI7RUFDeEQsSUFBSSxDQUFDLFNBQVMsQ0FBQztFQUNmLElBQUksQ0FBQyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUM7RUFDM0IsSUFBSSxDQUFDLG1CQUFtQixFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUM7RUFDeEMsR0FBRzs7RUFFSCxFQUFFLFlBQVksRUFBRSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxLQUFLLDBCQUEwQjtFQUNuRSxJQUFJLENBQUMsU0FBUyxDQUFDO0VBQ2YsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7RUFDMUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzVHLEdBQUc7O0VBRUgsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxLQUFLLDBCQUEwQjtFQUN2RSxJQUFJLENBQUMsU0FBUyxDQUFDO0VBQ2YsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDLHNCQUFzQixFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7RUFDL0UsSUFBSSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7RUFDeEQsR0FBRztFQUNILENBQUMsQ0FBQyxDQUFDOztBQUVILEVBQU8sTUFBTSx1QkFBdUIsR0FBRyxVQUFVLElBQUksSUFBSSxJQUFJLFVBQVUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztFQ25DNUYsTUFBTSxhQUFhLEdBQUcsT0FBTztFQUNwQyxFQUFFLFVBQVUsRUFBRSxFQUFFO0VBQ2hCLEVBQUUsU0FBUyxFQUFFLEVBQUU7RUFDZjtFQUNBO0VBQ0E7RUFDQSxFQUFFLGNBQWMsRUFBRSxFQUFFO0VBQ3BCO0VBQ0E7RUFDQSxFQUFFLFNBQVMsRUFBRSxFQUFFO0VBQ2YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsRUFBTyxNQUFNLFlBQVksR0FBRyxPQUFPO0VBQ25DLEVBQUUsSUFBSSxFQUFFLEVBQUU7RUFDVixFQUFFLGVBQWUsRUFBRSxFQUFFO0VBQ3JCO0VBQ0EsRUFBRSxhQUFhLEVBQUUsRUFBRTtFQUNuQjtFQUNBO0VBQ0E7RUFDQSxFQUFFLGNBQWMsRUFBRSxFQUFFO0VBQ3BCLENBQUMsQ0FBQyxDQUFDOztFQ2JILE1BQU0sY0FBYyxHQUFHO0VBQ3ZCLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFBRSxpQ0FBaUM7RUFDcEQsSUFBSSxDQUFDLElBQUksZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ2xDLEVBQUUsUUFBUSxDQUFDLGlCQUFpQixFQUFFLGtDQUFrQztFQUNoRSxJQUFJLENBQUMsSUFBSTNELFNBQU8sQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDO0VBQ25DLGVBQWUsd0JBQXdCO0VBQ3ZDLGNBQWMsTUFBTWMsd0JBQVcsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDO0VBQ2xELGFBQWEsQ0FBQztFQUNkLENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0saUJBQWlCLEdBQUcsU0FBUyxJQUFJLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFdEYsRUFBTyxNQUFNLHFCQUFxQixHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFO0VBQ25ELEVBQUVILE1BQUcsQ0FBQyxpQkFBaUIsQ0FBQztFQUN4QixFQUFFeUMsVUFBTztFQUNULENBQUMsQ0FBQyxDQUFDOztFQ0NJLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLEtBQUtuRCxXQUFRLENBQUNtRCxVQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7RUFFakUsTUFBTSxXQUFXLEdBQUc7RUFDcEIsRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFFLHNCQUFzQjtFQUN6QyxJQUFJLElBQUksSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3RDLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFBRSwwQkFBMEI7RUFDN0MsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztFQUN6RCxDQUFDLENBQUM7O0VBRUYsTUFBTSxXQUFXLEdBQUc7RUFDcEIsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLHlDQUF5QztFQUM5RCxJQUFJLElBQUksSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ3pDLEVBQUUsUUFBUSxDQUFDLGlCQUFpQixFQUFFLHdEQUF3RDtFQUN0RixJQUFJLElBQUksSUFBSVEsUUFBSyxDQUFDLENBQUMsSUFBSXJDLEtBQUcsQ0FBQyxDQUFDLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztFQUMzRSxFQUFFLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSwyREFBMkQ7RUFDekYsSUFBSSxJQUFJLElBQUlxQyxRQUFLLENBQUMsQ0FBQyxJQUFJckMsS0FBRyxDQUFDLENBQUMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0VBQzVFLENBQUMsQ0FBQzs7O0VBR0YsTUFBTSxtQkFBbUIsR0FBRztFQUM1QixFQUFFLFFBQVEsQ0FBQyxXQUFXLEVBQUUsNEJBQTRCO0VBQ3BELElBQUksQ0FBQyxJQUFJdkIsVUFBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7RUFDN0IsZ0JBQWdCLHdCQUF3QjtFQUN4QyxlQUFlLE1BQU1hLDhCQUFpQixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7RUFDbkQsY0FBYyxDQUFDO0VBQ2YsQ0FBQyxDQUFDOztFQUVGLE1BQU0sVUFBVSxHQUFHLElBQUksSUFBSSxVQUFVOztFQUVyQyxFQUFFLENBQUMsUUFBUSxFQUFFLE9BQU87RUFDcEIsSUFBSSxXQUFXO0VBQ2YsSUFBSSxXQUFXO0VBQ2YsR0FBRyxDQUFDOztFQUVKLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTztFQUNuQixJQUFJLFdBQVc7RUFDZixJQUFJLFlBQVk7RUFDaEIsR0FBRyxDQUFDOztFQUVKLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPO0VBQzVCLElBQUksV0FBVztFQUNmLElBQUksbUJBQW1CO0VBQ3ZCLEdBQUcsQ0FBQzs7RUFFSixFQUFFLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7RUFDekMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVSLEVBQU8sTUFBTSxZQUFZLEdBQUcsSUFBSSxJQUFJLFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFekUsRUFBTyxNQUFNLFdBQVcsR0FBRyxDQUFDLFlBQVksS0FBSztFQUM3QyxFQUFFLE1BQU0sU0FBUyxHQUFHLHFCQUFxQjtFQUN6QyxJQUFJLFlBQVk7RUFDaEIsR0FBRyxDQUFDOztFQUVKLEVBQUUsTUFBTSxpQkFBaUIsR0FBRyxRQUFRO0VBQ3BDLElBQUksTUFBTSxFQUFFLCtDQUErQztFQUMzRCxJQUFJLENBQUMsSUFBSUQsU0FBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRTtFQUM5Qyw2QkFBNkIsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUM7RUFDdkUsR0FBRyxDQUFDOztFQUVKLEVBQUUsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFO0VBQzlDLElBQUlELE1BQUcsQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2xELElBQUlDLFNBQU0sQ0FBQyxXQUFXLENBQUM7RUFDdkIsSUFBSXdDLFVBQU87RUFDWCxHQUFHLENBQUMsQ0FBQzs7RUFFTCxFQUFFLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUU7RUFDbkMsSUFBSXhDLFNBQU0sQ0FBQyxRQUFRLENBQUM7RUFDcEIsSUFBSUQsTUFBRyxDQUFDLGlCQUFpQixDQUFDO0VBQzFCLElBQUl5QyxVQUFPO0VBQ1gsR0FBRyxDQUFDLENBQUM7O0VBRUwsRUFBRSxNQUFNLGVBQWUsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFO0VBQ3ZDLElBQUl4QyxTQUFNLENBQUMsZ0JBQWdCLENBQUM7RUFDNUIsSUFBSUQsTUFBRyxDQUFDLENBQUMsSUFBSSxxQkFBcUI7RUFDbEMsTUFBTSxDQUFDLENBQUMsVUFBVTtFQUNsQixLQUFLLENBQUM7RUFDTixJQUFJeUMsVUFBTztFQUNYLEdBQUcsQ0FBQyxDQUFDOztFQUVMLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFO0VBQ3RCLElBQUl6QyxNQUFHLENBQUMsWUFBWSxDQUFDO0VBQ3JCLElBQUl5QyxVQUFPO0VBQ1gsSUFBSXBFLFFBQUssQ0FBQyxzQkFBc0IsQ0FBQztFQUNqQyxJQUFJQSxRQUFLLENBQUMsV0FBVyxDQUFDO0VBQ3RCLElBQUlBLFFBQUssQ0FBQyxlQUFlLENBQUM7RUFDMUIsR0FBRyxDQUFDLENBQUM7RUFDTCxDQUFDLENBQUM7O0VBRUYsTUFBTSxXQUFXLEdBQUc7RUFDcEIsRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFFLHlCQUF5QjtFQUM1QyxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDbEMsRUFBRSxRQUFRLENBQUMsZUFBZSxFQUFFLDRDQUE0QztFQUN4RSxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7RUFDM0MsRUFBRSxRQUFRLENBQUMsaUJBQWlCLEVBQUUsK0NBQStDO0VBQzdFLElBQUksQ0FBQyxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztFQUM3QyxDQUFDLENBQUM7O0VBRUYsTUFBTSxtQkFBbUIsR0FBRyxRQUFRLENBQUMsRUFBRSxFQUFFLDRCQUE0QixFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7O0VBRWpGLE1BQU0sY0FBYyxHQUFHLE1BQU0sSUFBSSxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7OztBQUduRSxFQUFPLE1BQU0sZUFBZSxHQUFHLENBQUMsVUFBVSxLQUFLO0VBQy9DLEVBQUUsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsVUFBVSxFQUFFO0VBQ3pDLElBQUk0QixTQUFNLENBQUMsQ0FBQyxJQUFJQSxTQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7RUFDeEUsSUFBSUQsTUFBRyxDQUFDLENBQUMsSUFBSSxlQUFlLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDckQsR0FBRyxDQUFDLENBQUM7O0VBRUwsRUFBRSxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsVUFBVSxFQUFFO0VBQy9CLElBQUlBLE1BQUcsQ0FBQyxjQUFjLENBQUM7RUFDdkIsSUFBSXlDLFVBQU87RUFDWCxJQUFJcEUsUUFBSyxDQUFDLGdCQUFnQixDQUFDO0VBQzNCLElBQUk2RSxTQUFNLENBQUMsTUFBTSxDQUFDO0VBQ2xCLEdBQUcsQ0FBQyxDQUFDOztFQUVMLEVBQUUsT0FBTyxNQUFNLENBQUM7RUFDaEIsQ0FBQyxDQUFDOztFQUVGLE1BQU0sWUFBWSxHQUFHLE9BQU8sS0FBSztFQUNqQyxFQUFFLFFBQVEsQ0FBQyxZQUFZLEVBQUUsd0JBQXdCO0VBQ2pELElBQUksQ0FBQyxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztFQUN4QyxFQUFFLFFBQVEsQ0FBQyxXQUFXLEVBQUUsd0JBQXdCO0VBQ2hELElBQUksQ0FBQyxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUN2QyxFQUFFLFFBQVEsQ0FBQyxZQUFZLEVBQUUsK0JBQStCO0VBQ3hELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVU7RUFDdEIsZ0JBQWdCM0QsT0FBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUM1RCxFQUFFLFFBQVEsQ0FBQyxXQUFXLEVBQUUsb0JBQW9CO0VBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVM7RUFDckIsZ0JBQWdCRyxXQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0VBQ2xELEVBQUUsUUFBUSxDQUFDLGdCQUFnQixFQUFFLDBEQUEwRDtFQUN2RixJQUFJLENBQUMsQ0FBQyxLQUFLO0VBQ1gsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxPQUFPLElBQUksQ0FBQztFQUN6QyxNQUFNLElBQUk7RUFDVixRQUFRUyx3QkFBVyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUN0QyxRQUFRLE9BQU8sSUFBSSxDQUFDO0VBQ3BCLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sS0FBSyxDQUFDLEVBQUU7RUFDbkMsS0FBSyxDQUFDO0VBQ04sRUFBRSxRQUFRLENBQUMsV0FBVyxFQUFFLDREQUE0RDtFQUNwRixJQUFJLENBQUMsQ0FBQyxLQUFLO0VBQ1gsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxPQUFPLElBQUksQ0FBQztFQUNwQyxNQUFNLElBQUk7RUFDVixRQUFRRCw4QkFBaUIsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDdkMsUUFBUSxPQUFPLElBQUksQ0FBQztFQUNwQixPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLEtBQUssQ0FBQyxFQUFFO0VBQ25DLEtBQUssQ0FBQztFQUNOLENBQUMsQ0FBQyxDQUFDOztBQUVILEVBQU8sTUFBTSxlQUFlLEdBQUcsQ0FBQyxPQUFPLEVBQUUsVUFBVSxLQUFLO0VBQ3hELEVBQUUsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztFQUVqRSxFQUFFLE9BQU8sTUFBTSxDQUFDO0VBQ2hCLENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxRQUFRLEVBQUUsVUFBVSxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUU7RUFDdEUsRUFBRUYsTUFBRyxDQUFDLENBQUMsSUFBSSxlQUFlLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0VBQzFDLEVBQUV5QyxVQUFPO0VBQ1QsQ0FBQyxDQUFDLENBQUM7O0VDbkxJLE1BQU0sd0JBQXdCLEdBQUcsU0FBUyxJQUFJLFlBQVk7RUFDakUsRUFBRSxNQUFNLE1BQU0sR0FBRyxNQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7RUFFM0QsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQzs7RUFFeEUsRUFBRSxNQUFNLGFBQWEsR0FBRyxNQUFNLFNBQVMsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQztFQUNwRSxFQUFFLGFBQWEsQ0FBQyxTQUFTLEdBQUcsa0JBQWtCO0VBQzlDLElBQUksYUFBYSxDQUFDLFNBQVM7RUFDM0IsR0FBRyxDQUFDO0VBQ0osRUFBRSxPQUFPLGFBQWEsQ0FBQztFQUN2QixDQUFDLENBQUM7O0VDTkssTUFBTSx3QkFBd0IsR0FBRyxHQUFHLElBQUksTUFBTSxTQUFTLElBQUksVUFBVTtFQUM1RSxFQUFFLEdBQUc7RUFDTCxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsd0JBQXdCO0VBQzdDLEVBQUUsVUFBVSxDQUFDLGNBQWMsQ0FBQyxZQUFZO0VBQ3hDLEVBQUUsRUFBRSxTQUFTLEVBQUU7RUFDZixFQUFFLHlCQUF5QixFQUFFLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUztFQUNyRCxDQUFDLENBQUM7OztBQUdGLEVBQU8sTUFBTSx5QkFBeUIsR0FBRyxPQUFPLFNBQVMsRUFBRSxTQUFTLEtBQUs7RUFDekUsRUFBRSxNQUFNLGdCQUFnQixHQUFHLE1BQU0sV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ3hELEVBQUUsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0VBQ25DLElBQUksTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLHNCQUFzQixFQUFFMUQsTUFBSTtNQUMzQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7TUFDbkYsR0FBRztLQUNKLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDVCxHQUFHOztFQUVILEVBQUUsSUFBSSxNQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsRUFBRTtFQUNqRCxJQUFJLE1BQU0sYUFBYSxHQUFHLE1BQU0sU0FBUyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0VBQ3RFLElBQUksYUFBYSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7RUFDeEMsSUFBSSxNQUFNLFNBQVMsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUUsYUFBYSxDQUFDLENBQUM7RUFDakUsR0FBRyxNQUFNO0VBQ1QsSUFBSSxNQUFNLFNBQVMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7RUFDN0MsSUFBSSxNQUFNLGFBQWEsR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQztFQUNuRSxJQUFJLE1BQU0sU0FBUyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxhQUFhLENBQUMsQ0FBQztFQUNqRSxHQUFHO0VBQ0gsQ0FBQyxDQUFDOztFQ3pCSyxNQUFNLHNCQUFzQixHQUFHLEdBQUcsSUFBSSxPQUFPLE9BQU8sRUFBRSxRQUFRLEtBQUssVUFBVTtFQUNwRixFQUFFLEdBQUc7RUFDTCxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsc0JBQXNCO0VBQzNDLEVBQUUsVUFBVSxDQUFDLGNBQWMsQ0FBQyxZQUFZO0VBQ3hDLEVBQUUsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0VBQ3ZCLEVBQUUsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsUUFBUTtFQUMzRCxDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLHVCQUF1QixHQUFHLE9BQU8sU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEtBQUs7RUFDL0UsRUFBRSxJQUFJLE1BQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO0VBQ2pELElBQUksTUFBTSxhQUFhLEdBQUcsTUFBTSxTQUFTLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUM7RUFDdEUsSUFBSSxhQUFhLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztFQUNwQyxJQUFJLGFBQWEsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztFQUV0QyxJQUFJLE1BQU0sZUFBZSxHQUFHaUIsTUFBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7O0VBRXhFLElBQUksSUFBSSxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtFQUNwQyxNQUFNLE1BQU0sSUFBSSxlQUFlLENBQUMsQ0FBQyxxQkFBcUIsRUFBRWpCLE1BQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDdkYsS0FBSzs7RUFFTCxJQUFJLE1BQU0sZ0JBQWdCLEdBQUdpQixNQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQzs7RUFFcEYsSUFBSSxJQUFJLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7RUFDckMsTUFBTSxNQUFNLElBQUksZUFBZSxDQUFDLENBQUMsc0JBQXNCLEVBQUVqQixNQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDekYsS0FBSzs7RUFFTCxJQUFJLE1BQU0sU0FBUyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxhQUFhLENBQUMsQ0FBQztFQUNqRSxHQUFHLE1BQU07RUFDVCxJQUFJLE1BQU0sSUFBSSxlQUFlLENBQUMsNERBQTRELENBQUMsQ0FBQztFQUM1RixHQUFHO0VBQ0gsQ0FBQyxDQUFDOztFQ3RDSyxNQUFNLG1CQUFtQixHQUFHLE9BQU8sU0FBUyxLQUFLO0VBQ3hELElBQUksTUFBTSxTQUFTLENBQUMsUUFBUSxDQUFDLDhCQUE4QixDQUFDLENBQUM7RUFDN0QsQ0FBQyxDQUFDOztFQ3dCRixNQUFNb0UsS0FBRyxHQUFHLEdBQUcsS0FBSzs7RUFFcEIsRUFBRSx3QkFBd0IsRUFBRSx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO0VBQ25FLEVBQUUsd0JBQXdCLEVBQUUsd0JBQXdCLENBQUMsR0FBRyxDQUFDO0VBQ3pELEVBQUUsc0JBQXNCLEVBQUUsc0JBQXNCLENBQUMsR0FBRyxDQUFDO0VBQ3JELEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO0VBQy9ELEVBQUUsZUFBZTtFQUNqQixFQUFFLGFBQWE7RUFDZixFQUFFLG1CQUFtQjtFQUNyQixFQUFFLG9CQUFvQjtFQUN0QixFQUFFLFdBQVc7RUFDYixFQUFFLGFBQWE7RUFDZixFQUFFLFFBQVE7RUFDVixFQUFFLFdBQVc7RUFDYixFQUFFLDBCQUEwQjtFQUM1QixFQUFFLDJCQUEyQjtFQUM3QixFQUFFLHVCQUF1QjtFQUN6QixFQUFFLFlBQVk7RUFDZCxFQUFFLGFBQWE7RUFDZixFQUFFLGVBQWU7RUFDakIsRUFBRSxlQUFlO0VBQ2pCLEVBQUUsNEJBQTRCO0VBQzlCLEVBQUUsdUJBQXVCO0VBQ3pCLEVBQUUsa0JBQWtCO0VBQ3BCLEVBQUUsMEJBQTBCO0VBQzVCLEVBQUUsUUFBUSxFQUFFN0IsS0FBRztFQUNmLEVBQUUsWUFBWTtFQUNkLEVBQUUsV0FBVztFQUNiLEVBQUUsZ0JBQWdCO0VBQ2xCLENBQUMsQ0FBQyxDQUFDOzs7QUFHSCxBQUFZLFFBQUMsY0FBYyxHQUFHLEdBQUcsSUFBSTZCLEtBQUcsQ0FBQyxHQUFHLENBQUM7O0VDbkR0QyxNQUFNLFFBQVEsR0FBRyxHQUFHLElBQUksWUFBWSxVQUFVO0VBQ3JELEVBQUUsR0FBRztFQUNMLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRO0VBQ3pCLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxZQUFZO0VBQ25DLEVBQUUsRUFBRTtFQUNKLEVBQUUsU0FBUyxFQUFFLEdBQUc7RUFDaEIsQ0FBQyxDQUFDOztBQUVGLEVBQU8sTUFBTSxTQUFTLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUU7RUFDdkYsRUFBRW5ELE1BQUcsQ0FBQyx5QkFBeUIsQ0FBQztFQUNoQyxDQUFDLENBQUMsQ0FBQzs7RUNkSSxNQUFNLGdCQUFnQixHQUFHLEdBQUcsSUFBSSxZQUFZLFVBQVU7RUFDN0QsRUFBRSxHQUFHO0VBQ0wsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQjtFQUNqQyxFQUFFLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZO0VBQzFDLEVBQUUsRUFBRTtFQUNKLEVBQUUsaUJBQWlCLEVBQUUsR0FBRztFQUN4QixDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLGlCQUFpQixHQUFHLE1BQU0sR0FBRyxJQUFJLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7RUNJL0YsTUFBTSxTQUFTLEdBQUcsaUdBQWlHLENBQUM7O0FBRXBILEVBQU8sTUFBTSxZQUFZLEdBQUcsR0FBRyxJQUFJLE9BQU8sUUFBUSxFQUFFLFFBQVEsS0FBSyxVQUFVO0VBQzNFLEVBQUUsR0FBRztFQUNMLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZO0VBQzdCLEVBQUUsZ0JBQWdCO0VBQ2xCLEVBQUUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFO0VBQ3hCLEVBQUUsYUFBYSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUTtFQUN4QyxDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLGFBQWEsR0FBRyxPQUFPLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxLQUFLO0VBQ2hFLEVBQUUsSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLEVBQUU7O0VBRWhGLEVBQUUsTUFBTSxRQUFRLEdBQUcsTUFBTSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDeEMsRUFBRSxJQUFJLElBQUksR0FBRyxhQUFhO0VBQzFCLElBQUksUUFBUTtFQUNaLElBQUksUUFBUTtFQUNaLEdBQUcsQ0FBQzs7RUFFSixFQUFFLE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQztFQUNoQztFQUNBO0VBQ0EsRUFBRSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksR0FBRyxRQUFRLENBQUMsRUFBRTs7RUFFbEQsRUFBRSxJQUFJLFFBQVEsQ0FBQztFQUNmLEVBQUUsSUFBSTtFQUNOLElBQUksUUFBUSxHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRO0VBQzNDLE1BQU0sWUFBWSxDQUFDLFFBQVEsQ0FBQztFQUM1QixLQUFLLENBQUM7RUFDTixHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7RUFDZCxJQUFJLFFBQVEsR0FBRyxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxDQUFDO0VBQzdELEdBQUc7O0VBRUgsRUFBRSxNQUFNLFdBQVcsR0FBRyxNQUFNLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7O0VBRXpFLEVBQUUsTUFBTSxRQUFRLEdBQUcsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU07RUFDMUMsSUFBSSxRQUFRLENBQUMsWUFBWTtFQUN6QixJQUFJLFFBQVE7RUFDWixHQUFHLENBQUM7O0VBRUosRUFBRSxJQUFJLElBQUksS0FBSyxRQUFRLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxFQUFFOztFQUV6QyxFQUFFLE9BQU8sUUFBUTtFQUNqQixNQUFNO0VBQ04sTUFBTSxHQUFHLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSTtFQUNyRCxLQUFLO0VBQ0wsTUFBTSxJQUFJLENBQUM7RUFDWCxDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLDJCQUEyQixHQUFHLEdBQUcsSUFBSSxPQUFPLGNBQWMsS0FBSztFQUM1RSxFQUFFLElBQUksZ0JBQWdCLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxFQUFFOztFQUV4RCxFQUFFLE1BQU0sSUFBSSxHQUFHLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDO0VBQ2xELEVBQUUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0VBQ3JDLElBQUlRLE9BQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLGlCQUFpQixLQUFLLElBQUksQ0FBQyxFQUFFLENBQUM7RUFDOUMsR0FBRyxDQUFDLENBQUM7O0VBRUwsRUFBRSxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUM7RUFDaEMsRUFBRSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksR0FBRyxRQUFRLENBQUMsRUFBRTs7RUFFbEQsRUFBRSxJQUFJLFFBQVEsQ0FBQztFQUNmLEVBQUUsSUFBSTtFQUNOLElBQUksUUFBUSxHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRO0VBQzNDLE1BQU0sWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7RUFDN0IsS0FBSyxDQUFDO0VBQ04sR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0VBQ2QsSUFBSSxRQUFRLEdBQUc7RUFDZixNQUFNLG1CQUFtQixFQUFFLFNBQVM7RUFDcEMsTUFBTSwwQkFBMEIsR0FBRyxNQUFNLEdBQUcsQ0FBQyxZQUFZLEVBQUUsR0FBRyxLQUFLLENBQUM7RUFDcEUsS0FBSyxDQUFDO0VBQ04sR0FBRzs7RUFFSCxFQUFFLElBQUksUUFBUSxDQUFDLDBCQUEwQixHQUFHLE1BQU0sR0FBRyxDQUFDLFlBQVksRUFBRSxFQUFFLEVBQUUsSUFBSSxHQUFHLFFBQVEsQ0FBQyxFQUFFOztFQUUxRixFQUFFLE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksR0FBR2pDLGdCQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0VBQ3ZELEVBQUUsTUFBTSxRQUFRLEdBQUcsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU07RUFDMUMsSUFBSSxRQUFRLENBQUMsbUJBQW1CO0VBQ2hDLElBQUksUUFBUTtFQUNaLEdBQUcsQ0FBQzs7RUFFSixFQUFFLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLEVBQUU7O0VBRXpDLEVBQUUsT0FBTyxRQUFRO0VBQ2pCLE1BQU07RUFDTixNQUFNLEdBQUcsSUFBSTtFQUNiLE1BQU0sV0FBVyxFQUFFLEVBQUU7RUFDckIsTUFBTSxJQUFJLEVBQUUsSUFBSTtFQUNoQixNQUFNLE1BQU0sRUFBRSxJQUFJO0VBQ2xCLEtBQUs7RUFDTCxNQUFNLElBQUksQ0FBQztFQUNYLENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0sb0JBQW9CLEdBQUcsT0FBTyxHQUFHLEVBQUUsZ0JBQWdCLEtBQUs7RUFDckUsRUFBRSxNQUFNLGVBQWUsR0FBRyxNQUFNLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDOztFQUV2RCxFQUFFLE9BQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUU7RUFDbkMsSUFBSTBCLFNBQU0sQ0FBQyxDQUFDLElBQUlWLE9BQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0VBQzVELElBQUlTLE1BQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQztFQUMzQixJQUFJeUMsVUFBTztFQUNYLEdBQUcsQ0FBQyxDQUFDO0VBQ0wsQ0FBQyxDQUFDOztFQ3ZHSyxNQUFNVyx1QkFBcUIsR0FBRyxHQUFHLElBQUksTUFBTSxRQUFRLElBQUksVUFBVTtFQUN4RSxFQUFFLEdBQUc7RUFDTCxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXFCO0VBQ3RDLEVBQUUsZ0JBQWdCO0VBQ2xCLEVBQUUsRUFBRSxRQUFRLEVBQUU7RUFDZCxFQUFFLHNCQUFzQixFQUFFLEdBQUcsRUFBRSxRQUFRO0VBQ3ZDLENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0sc0JBQXNCLEdBQUcsT0FBTyxHQUFHLEVBQUUsUUFBUSxLQUFLO0VBQy9ELEVBQUUsTUFBTSxRQUFRLEdBQUcsTUFBTSxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7RUFFL0MsRUFBRSxNQUFNLElBQUksR0FBRyxNQUFNLE9BQU87RUFDNUIsSUFBSSxHQUFHLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxDQUFDO0VBQ2pDLEdBQUcsQ0FBQzs7RUFFSixFQUFFLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxtRUFBbUUsQ0FBQyxDQUFDLEVBQUU7O0VBRS9HLEVBQUUsSUFBSTtFQUNOLElBQUksTUFBTSxLQUFLLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQzs7RUFFaEUsSUFBSSxNQUFNLElBQUksR0FBRyxhQUFhLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0VBQ2hELElBQUksSUFBSSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQzs7RUFFeEQsSUFBSSxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVTtFQUNsQyxNQUFNLGVBQWU7RUFDckIsTUFBTSxLQUFLO0VBQ1gsS0FBSyxDQUFDO0VBQ04sR0FBRyxTQUFTO0VBQ1osSUFBSSxNQUFNLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7RUFDakMsR0FBRzs7RUFFSCxFQUFFLE1BQU0sUUFBUSxHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRO0VBQy9DLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQztFQUMxQixHQUFHLENBQUM7RUFDSixFQUFFLFFBQVEsQ0FBQyxtQkFBbUIsR0FBRyxRQUFRLENBQUMsbUJBQW1CLENBQUM7O0VBRTlELEVBQUUsUUFBUSxDQUFDLDBCQUEwQixHQUFHLFFBQVEsQ0FBQywwQkFBMEIsQ0FBQzs7RUFFNUUsRUFBRSxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVTtFQUNoQyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUM7RUFDMUIsSUFBSSxRQUFRO0VBQ1osR0FBRyxDQUFDOztFQUVKLEVBQUUsT0FBTyxRQUFRLENBQUMsUUFBUSxDQUFDO0VBQzNCLENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxHQUFHLEtBQUs7RUFDL0MsRUFBRSxNQUFNLFFBQVEsR0FBRzdFLGdCQUFRLEVBQUU7RUFDN0IsVUFBVUEsZ0JBQVEsRUFBRTtFQUNwQixVQUFVQSxnQkFBUSxFQUFFO0VBQ3BCLFVBQVVBLGdCQUFRLEVBQUUsQ0FBQzs7RUFFckIsRUFBRSxNQUFNLE1BQU0sR0FBR0EsZ0JBQVEsRUFBRSxDQUFDOztFQUU1QixFQUFFLE9BQU87RUFDVCxJQUFJLG1CQUFtQixFQUFFLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJO0VBQzlDLE1BQU0sUUFBUTtFQUNkLEtBQUs7RUFDTCxJQUFJLDBCQUEwQjtFQUM5QixZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsWUFBWSxFQUFFLElBQUksb0JBQW9CO0VBQzdELElBQUksUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7RUFDekMsSUFBSSxpQkFBaUIsRUFBRSxNQUFNO0VBQzdCLEdBQUcsQ0FBQztFQUNKLENBQUMsQ0FBQzs7RUNqRUYsTUFBTSxTQUFTLEdBQUcsUUFBUSxJQUFJO0VBQzlCLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFBRSxzQkFBc0I7RUFDekMsSUFBSSxDQUFDLElBQUksZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ2xDLEVBQUUsUUFBUSxDQUFDLGNBQWMsRUFBRSwwQ0FBMEM7RUFDckUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0VBQ25DLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFBRSx5QkFBeUI7RUFDNUMsSUFBSSxDQUFDLElBQUkwQixTQUFNLENBQUMsRUFBRSxJQUFJLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztFQUNqRixFQUFFLFFBQVEsQ0FBQyxjQUFjLEVBQUUsd0NBQXdDO0VBQ25FLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztFQUMvQyxDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksS0FBSyxZQUFZLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7O0VDbkJ2RixNQUFNLFVBQVUsR0FBRyxHQUFHLElBQUksTUFBTSxjQUFjO0VBQ3JELEVBQUUsR0FBRztFQUNMLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO0VBQzNCLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxZQUFZO0VBQ3BDLEVBQUUsRUFBRTtFQUNKLEVBQUUsV0FBVyxFQUFFLEdBQUc7RUFDbEIsQ0FBQyxDQUFDOztBQUVGLEVBQU8sTUFBTSxXQUFXLEdBQUcsT0FBTztFQUNsQyxFQUFFLElBQUksRUFBRSxFQUFFO0VBQ1YsRUFBRSxZQUFZLEVBQUUsRUFBRTtFQUNsQixFQUFFLE9BQU8sRUFBRSxJQUFJO0VBQ2YsRUFBRSxpQkFBaUIsRUFBRSxFQUFFO0VBQ3ZCLENBQUMsQ0FBQyxDQUFDOztBQUVILEVBQU8sTUFBTSxjQUFjLEdBQUcsR0FBRyxJQUFJLE1BQU0sY0FBYztFQUN6RCxFQUFFLEdBQUc7RUFDTCxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYztFQUMvQixFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsWUFBWTtFQUNwQyxFQUFFLEVBQUU7RUFDSixFQUFFLGVBQWUsRUFBRSxHQUFHO0VBQ3RCLENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0sZUFBZSxHQUFHLE9BQU87RUFDdEMsRUFBRSxZQUFZLEVBQUUsRUFBRTtFQUNsQixFQUFFLG1CQUFtQixFQUFFLEVBQUU7RUFDekIsRUFBRSwwQkFBMEIsRUFBRSxDQUFDO0VBQy9CLENBQUMsQ0FBQyxDQUFDOztFQ3RCSSxNQUFNLGVBQWUsR0FBRyxHQUFHLElBQUksUUFBUSxJQUFJLGNBQWM7RUFDaEUsRUFBRSxHQUFHO0VBQ0wsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLGVBQWU7RUFDaEMsRUFBRSxnQkFBZ0I7RUFDbEIsRUFBRSxFQUFFLFFBQVEsRUFBRTtFQUNkLEVBQUUsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLFFBQVE7RUFDakMsQ0FBQyxDQUFDOztBQUVGLEVBQU8sTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLEdBQUcsRUFBRSxRQUFRLEtBQUssYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7O0FBRXRGLEVBQU8sTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLElBQUksT0FBTyxTQUFTLEVBQUUsV0FBVyxLQUFLLFVBQVU7RUFDbkYsRUFBRSxHQUFHO0VBQ0wsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQjtFQUNqQyxFQUFFLGdCQUFnQjtFQUNsQixFQUFFLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRTtFQUM1QixFQUFFLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsV0FBVztFQUNoRCxDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLGlCQUFpQixHQUFHLE9BQU8sR0FBRyxFQUFFLFNBQVMsRUFBRSxXQUFXLEtBQUs7RUFDeEUsRUFBRSxNQUFNLFlBQVksR0FBRyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUTtFQUNuRCxJQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztFQUMvQixHQUFHLENBQUM7O0VBRUosRUFBRSxJQUFJLFdBQVcsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEVBQUU7RUFDOUMsSUFBSSxNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTTtFQUM1QyxNQUFNLFlBQVksQ0FBQyxZQUFZO0VBQy9CLE1BQU0sU0FBUztFQUNmLEtBQUssQ0FBQzs7RUFFTixJQUFJLElBQUksUUFBUSxFQUFFO0VBQ2xCLE1BQU0sTUFBTSxNQUFNLEtBQUs7RUFDdkIsUUFBUSxHQUFHLEVBQUUsWUFBWTtFQUN6QixRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVc7RUFDbEMsT0FBTyxDQUFDO0VBQ1IsTUFBTSxPQUFPLElBQUksQ0FBQztFQUNsQixLQUFLO0VBQ0wsR0FBRzs7RUFFSCxFQUFFLE9BQU8sS0FBSyxDQUFDO0VBQ2YsQ0FBQyxDQUFDOztBQUVGLEVBQU8sTUFBTSw0QkFBNEIsR0FBRyxHQUFHLElBQUksT0FBTyxRQUFRLEVBQUUsV0FBVyxLQUFLLFVBQVU7RUFDOUYsRUFBRSxHQUFHO0VBQ0wsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLDRCQUE0QjtFQUM3QyxFQUFFLGdCQUFnQjtFQUNsQixFQUFFLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRTtFQUMzQixFQUFFLDZCQUE2QixFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsV0FBVztFQUMzRCxDQUFDLENBQUM7OztBQUdGLEVBQU8sTUFBTSw2QkFBNkIsR0FBRyxPQUFPLEdBQUcsRUFBRSxRQUFRLEVBQUUsV0FBVyxLQUFLO0VBQ25GLEVBQUUsTUFBTSxXQUFXLEdBQUcsTUFBTSxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7O0VBRS9DLEVBQUUsTUFBTSxJQUFJLEdBQUcsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7O0VBRTVDLEVBQUUsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0VBQ3ZDLElBQUlPLE9BQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLGlCQUFpQixLQUFLLElBQUksQ0FBQyxFQUFFLENBQUM7RUFDOUMsR0FBRyxDQUFDLENBQUM7O0VBRUwsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxLQUFLLENBQUMsRUFBRTs7RUFFOUIsRUFBRSxNQUFNLFlBQVksR0FBRyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUTtFQUNuRCxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0VBQzNCLEdBQUcsQ0FBQzs7RUFFSixFQUFFLElBQUksV0FBVyxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQztFQUNuRCxVQUFVLFlBQVksQ0FBQywwQkFBMEIsR0FBRyxXQUFXLEVBQUU7RUFDakUsSUFBSSxNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTTtFQUM1QyxNQUFNLFlBQVksQ0FBQyxtQkFBbUI7RUFDdEMsTUFBTSxJQUFJLENBQUMsSUFBSTtFQUNmLEtBQUssQ0FBQzs7RUFFTixJQUFJLElBQUksUUFBUSxFQUFFO0VBQ2xCLE1BQU0sTUFBTSxLQUFLO0VBQ2pCLFFBQVEsR0FBRyxFQUFFLFlBQVk7RUFDekIsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVc7RUFDOUIsT0FBTyxDQUFDO0VBQ1IsTUFBTSxPQUFPLElBQUksQ0FBQztFQUNsQixLQUFLO0VBQ0wsR0FBRzs7RUFFSCxFQUFFLE9BQU8sS0FBSyxDQUFDO0VBQ2YsQ0FBQyxDQUFDOztFQUVGLE1BQU0sS0FBSyxHQUFHLE9BQU8sR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsV0FBVyxLQUFLO0VBQzFELEVBQUUsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztFQUNoQyxFQUFFLElBQUksQ0FBQywwQkFBMEIsR0FBRyxDQUFDLENBQUM7RUFDdEMsRUFBRSxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJO0VBQzNDLElBQUksV0FBVztFQUNmLEdBQUcsQ0FBQztFQUNKLEVBQUUsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVU7RUFDaEMsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDO0VBQzFCLElBQUksSUFBSTtFQUNSLEdBQUcsQ0FBQztFQUNKLENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0sYUFBYSxHQUFHLEdBQUcsSUFBSSxRQUFRLElBQUksY0FBYztFQUM5RCxFQUFFLEdBQUc7RUFDTCxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYTtFQUM5QixFQUFFLGdCQUFnQjtFQUNsQixFQUFFLEVBQUUsUUFBUSxFQUFFO0VBQ2QsRUFBRSxjQUFjLEVBQUUsUUFBUTtFQUMxQixDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLGNBQWMsR0FBRyxDQUFDLFFBQVEsS0FBSztFQUM1QztFQUNBOztFQUVBLEVBQUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0VBQ2hCLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLE9BQU8sS0FBSyxDQUFDLEVBQUU7O0VBRWxDO0VBQ0EsRUFBRSxNQUFNLE9BQU8sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO0VBQy9CLEVBQUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7RUFDNUMsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUMzRCxJQUFJLEtBQUssSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3hDLEdBQUc7O0VBRUg7RUFDQSxFQUFFLE1BQU0sVUFBVSxHQUFHO0VBQ3JCLElBQUksTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0VBQy9CLElBQUksS0FBSyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0VBQ2pDLElBQUksS0FBSyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0VBQ2pDLElBQUksUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0VBQ2pDLEdBQUcsQ0FBQzs7RUFFSixFQUFFLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQztFQUN6QixFQUFFLEtBQUssTUFBTSxLQUFLLElBQUksVUFBVSxFQUFFO0VBQ2xDLElBQUksY0FBYyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzFELEdBQUc7RUFDSCxFQUFFLEtBQUssSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDOztFQUVyQyxFQUFFLE1BQU0sWUFBWSxHQUFHLEtBQUssR0FBRyxFQUFFO0VBQ2pDLE1BQU0sUUFBUTtFQUNkLE1BQU0sS0FBSyxHQUFHLEVBQUU7RUFDaEIsUUFBUSxNQUFNO0VBQ2QsUUFBUSxLQUFLLElBQUksRUFBRTtFQUNuQixVQUFVLE1BQU07RUFDaEIsVUFBVSxXQUFXLENBQUM7O0VBRXRCLEVBQUUsT0FBTztFQUNULElBQUksS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUM7RUFDMUIsSUFBSSxZQUFZO0VBQ2hCLEdBQUcsQ0FBQztFQUNKLENBQUMsQ0FBQzs7RUN4SUssTUFBTTZDLFlBQVUsR0FBRyxHQUFHLElBQUksT0FBTyxJQUFJLEVBQUUsUUFBUSxHQUFHLElBQUksS0FBSyxVQUFVO0VBQzVFLEVBQUUsR0FBRztFQUNMLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO0VBQzNCLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxZQUFZO0VBQ3BDLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO0VBQ3BCLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUTtFQUNsQyxDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLFdBQVcsR0FBRyxPQUFPLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxHQUFHLElBQUksS0FBSztFQUNqRSxFQUFFLE1BQU0sSUFBSSxHQUFHLE1BQU0sT0FBTztFQUM1QixJQUFJLEdBQUcsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLENBQUM7RUFDakMsR0FBRyxDQUFDOztFQUVKLEVBQUUsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHVEQUF1RCxDQUFDLENBQUMsRUFBRTs7RUFFbkcsRUFBRSxNQUFNLEtBQUssR0FBRyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztFQUU5RCxFQUFFLE1BQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyxBQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0VBQy9ELEVBQUUsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxFQUFFLE1BQU0sSUFBSSxlQUFlLENBQUMsQ0FBQyxpQkFBaUIsRUFBRXRFLE9BQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFOztFQUV6RyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLEdBQUcsTUFBTSxTQUFTO0VBQy9ELElBQUksR0FBRyxFQUFFLFFBQVE7RUFDakIsR0FBRyxDQUFDO0VBQ0osRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztFQUMzQixFQUFFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQzs7RUFFN0MsRUFBRSxJQUFJUSxPQUFJLENBQUMsQ0FBQyxJQUFJLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7RUFDOUQsSUFBSSxNQUFNLElBQUksZUFBZSxDQUFDLHFCQUFxQixDQUFDLENBQUM7RUFDckQsR0FBRzs7RUFFSCxFQUFFLEtBQUssQ0FBQyxJQUFJO0VBQ1osSUFBSSx5QkFBeUIsQ0FBQyxJQUFJLENBQUM7RUFDbkMsR0FBRyxDQUFDOztFQUVKLEVBQUUsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVU7RUFDaEMsSUFBSSxlQUFlO0VBQ25CLElBQUksS0FBSztFQUNULEdBQUcsQ0FBQzs7RUFFSixFQUFFLElBQUk7RUFDTixJQUFJLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVO0VBQ2xDLE1BQU0sWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7RUFDN0IsTUFBTSxJQUFJO0VBQ1YsS0FBSyxDQUFDO0VBQ04sR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0VBQ2QsSUFBSSxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVTtFQUNsQyxNQUFNLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0VBQzdCLE1BQU0sSUFBSTtFQUNWLEtBQUssQ0FBQztFQUNOLEdBQUc7O0VBRUgsRUFBRSxNQUFNLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7O0VBRS9CLEVBQUUsT0FBTyxJQUFJLENBQUM7RUFDZCxDQUFDLENBQUM7O0VBRUYsTUFBTSxTQUFTLEdBQUcsT0FBTyxHQUFHLEVBQUUsUUFBUSxLQUFLO0VBQzNDLEVBQUUsTUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7O0VBRXJDLEVBQUUsSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsRUFBRTtFQUNsQyxJQUFJLElBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0VBQ25DLE1BQU0sSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQzFELE1BQU0sSUFBSSxDQUFDLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztFQUNwQyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7RUFDbEMsTUFBTSxJQUFJLENBQUMsMEJBQTBCLEdBQUcsQ0FBQyxDQUFDO0VBQzFDLE1BQU0sT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDO0VBQ3RCLEtBQUs7RUFDTCxJQUFJLE1BQU0sSUFBSSxlQUFlLENBQUMscUNBQXFDLENBQUMsQ0FBQztFQUNyRSxHQUFHLE1BQU07RUFDVCxJQUFJLE1BQU0sVUFBVSxHQUFHLE1BQU0sZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDbkQsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsVUFBVSxDQUFDLG1CQUFtQixDQUFDO0VBQzlELElBQUksSUFBSSxDQUFDLDBCQUEwQixHQUFHLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQztFQUM1RSxJQUFJLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0VBQzNCLElBQUksUUFBUTtFQUNaLE1BQU0sSUFBSTtFQUNWLE1BQU0sUUFBUSxFQUFFLFVBQVUsQ0FBQyxRQUFRO0VBQ25DLE1BQU0saUJBQWlCLEVBQUUsVUFBVSxDQUFDLGlCQUFpQjtFQUNyRCxLQUFLLEVBQUU7RUFDUCxHQUFHO0VBQ0gsQ0FBQyxDQUFDOztFQ3RGSyxNQUFNLFVBQVUsR0FBRyxHQUFHLElBQUksTUFBTSxRQUFRLElBQUksVUFBVTtFQUM3RCxFQUFFLEdBQUc7RUFDTCxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtFQUMzQixFQUFFLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZO0VBQzNDLEVBQUUsRUFBRSxRQUFRLEVBQUU7RUFDZCxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsUUFBUTtFQUM1QixDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLFdBQVcsR0FBRyxHQUFHLElBQUksTUFBTSxRQUFRLElBQUksVUFBVTtFQUM5RCxFQUFFLEdBQUc7RUFDTCxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztFQUM1QixFQUFFLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZO0VBQzNDLEVBQUUsRUFBRSxRQUFRLEVBQUU7RUFDZCxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsUUFBUTtFQUM3QixDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLFdBQVcsR0FBRyxPQUFPLEdBQUcsRUFBRSxRQUFRLEtBQUssTUFBTSxVQUFVLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFMUYsRUFBTyxNQUFNLFlBQVksR0FBRyxPQUFPLEdBQUcsRUFBRSxRQUFRLEtBQUssTUFBTSxVQUFVLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQzs7RUFFNUYsTUFBTSxVQUFVLEdBQUcsT0FBTyxHQUFHLEVBQUUsUUFBUSxFQUFFLE9BQU8sS0FBSztFQUNyRCxFQUFFLE1BQU0sSUFBSSxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7RUFFL0QsRUFBRSxNQUFNLFVBQVUsR0FBRyxPQUFPLEdBQUcsUUFBUSxHQUFHLFNBQVMsQ0FBQzs7RUFFcEQsRUFBRSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxFQUFFOztFQUU1RixFQUFFLElBQUk7RUFDTixJQUFJLE1BQU0sS0FBSyxHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7RUFDaEUsSUFBSSxNQUFNLElBQUksR0FBRyxhQUFhLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0VBQ2hELElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sSUFBSSxhQUFhLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTs7RUFFbkYsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssQ0FBQyxPQUFPLEVBQUU7RUFDbkMsTUFBTSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztFQUM3QixNQUFNLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDO0VBQzdELEtBQUs7RUFDTCxHQUFHLFNBQVM7RUFDWixJQUFJLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7RUFDM0IsR0FBRztFQUNILENBQUMsQ0FBQzs7RUNoREssTUFBTSxpQkFBaUIsR0FBRyxNQUFNLE9BQU87RUFDOUMsRUFBRSxJQUFJLEVBQUUsRUFBRTtFQUNWLEVBQUUsV0FBVyxFQUFFLEVBQUU7RUFDakIsRUFBRSxPQUFPLENBQUMsS0FBSztFQUNmLENBQUMsQ0FBQyxDQUFDOztFQ1NILE1BQU0sYUFBYSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxFQUFFO0VBQzlDLEVBQUVvQyxTQUFNO0VBQ1IsRUFBRWpDLFdBQVEsQ0FBQyxDQUFDLENBQUM7RUFDYixDQUFDLENBQUMsQ0FBQzs7RUFFSCxNQUFNLG1CQUFtQixHQUFHLENBQUMsSUFBSUgsT0FBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7RUFDcEQsRUFBRSxlQUFlLENBQUMsYUFBYTtFQUMvQixFQUFFLGVBQWUsQ0FBQyxhQUFhO0VBQy9CLEVBQUUsZUFBZSxDQUFDLGFBQWE7RUFDL0IsRUFBRSxlQUFlLENBQUMsV0FBVztFQUM3QixFQUFFLGVBQWUsQ0FBQyxVQUFVO0VBQzVCLEVBQUUsZUFBZSxDQUFDLGNBQWM7RUFDaEMsQ0FBQyxDQUFDLENBQUM7OztFQUdILE1BQU0sZUFBZSxHQUFHLEdBQUcsS0FBSztFQUNoQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsbUNBQW1DO0VBQ3RELElBQUksQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDL0IsRUFBRSxRQUFRLENBQUMsU0FBUyxFQUFFLDJEQUEyRDtFQUNqRixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztFQUN0QyxnQkFBZ0IsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0VBQy9ELENBQUMsQ0FBQyxDQUFDOztFQUVILE1BQU0sb0JBQW9CLEdBQUcsR0FBRyxJQUFJLFlBQVksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7RUFFdkUsTUFBTSxnQkFBZ0IsR0FBRyxTQUFTLEtBQUs7RUFDdkMsRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFFLGtCQUFrQjtFQUNyQyxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDbEMsRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFFLG1DQUFtQztFQUN0RCxJQUFJLENBQUMsSUFBSUYsVUFBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7RUFDeEIsZ0JBQWdCWSxTQUFNLENBQUMsQ0FBQyxJQUFJLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztFQUN2RixDQUFDLENBQUMsQ0FBQzs7RUFFSCxNQUFNLGVBQWUsR0FBRyxTQUFTLElBQUksWUFBWSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7O0FBRS9FLEVBQU8sTUFBTSxtQkFBbUIsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxLQUFLO0VBQ2hFLEVBQUUsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7RUFDcEMsSUFBSUQsTUFBRyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ2xDLElBQUl5QyxVQUFPO0VBQ1gsSUFBSVgsU0FBTTtFQUNWLE1BQU0sZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQztFQUN2QyxLQUFLO0VBQ0wsR0FBRyxDQUFDLENBQUM7O0VBRUwsRUFBRSxPQUFPLElBQUksQ0FBQztFQUNkLENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0sb0JBQW9CLEdBQUcsR0FBRyxJQUFJLFNBQVMsSUFBSSxjQUFjO0VBQ3RFLEVBQUUsR0FBRztFQUNMLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0I7RUFDckMsRUFBRSxnQkFBZ0I7RUFDbEIsRUFBRSxFQUFFLFNBQVMsRUFBRTtFQUNmLEVBQUUscUJBQXFCLEVBQUUsR0FBRyxFQUFFLFNBQVM7RUFDdkMsQ0FBQyxDQUFDOztBQUVGLEVBQU8sTUFBTSxxQkFBcUIsR0FBRyxDQUFDLEdBQUcsRUFBRSxTQUFTLEtBQUssQ0FBQyxDQUFDLFNBQVMsRUFBRTtFQUN0RSxFQUFFOUIsTUFBRyxDQUFDLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDbEQsRUFBRXlDLFVBQU87RUFDVCxFQUFFYSxXQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLEtBQUs7RUFDeEMsMkJBQTJCLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUk7RUFDNUMsMkJBQTJCLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQztFQUMvQyxDQUFDLENBQUMsQ0FBQzs7RUM5REksTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLElBQUksTUFBTSxZQUFZLElBQUksVUFBVTtFQUN2RSxFQUFFLEdBQUc7RUFDTCxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCO0VBQ2pDLEVBQUUsVUFBVSxDQUFDLGlCQUFpQixDQUFDLFlBQVk7RUFDM0MsRUFBRSxFQUFFLFlBQVksRUFBRTtFQUNsQixFQUFFLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxZQUFZO0VBQ3RDLENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0saUJBQWlCLEdBQUcsT0FBTyxHQUFHLEVBQUUsWUFBWSxLQUFLO0VBQzlELEVBQUUsTUFBTSxnQkFBZ0IsR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDMUUsRUFBRSxJQUFJLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7RUFDbkMsSUFBSSxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsZ0JBQWdCLEVBQUU7RUFDckMsTUFBTXRELE1BQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztFQUN2QixNQUFNakIsT0FBSSxDQUFDLElBQUksQ0FBQztFQUNoQixLQUFLLENBQUMsQ0FBQztFQUNQLElBQUksTUFBTSxJQUFJLEtBQUs7RUFDbkIsTUFBTSxDQUFDLHVCQUF1QixFQUFFLElBQUksQ0FBQyxDQUFDO0VBQ3RDLEtBQUssQ0FBQztFQUNOLEdBQUc7O0VBRUgsRUFBRSxNQUFNLElBQUksR0FBRyxNQUFNLE9BQU87RUFDNUIsSUFBSSxHQUFHLEVBQUUsdUJBQXVCLEVBQUUsSUFBSSxFQUFFLENBQUM7RUFDekMsR0FBRyxDQUFDOztFQUVKLEVBQUUsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUMsRUFBRTs7RUFFdEYsRUFBRSxJQUFJO0VBQ04sSUFBSSxNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7RUFDdEUsSUFBSSxJQUFJLFFBQVEsQ0FBQyxPQUFPLEtBQUssWUFBWSxDQUFDLE9BQU8sRUFBRSxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQyxFQUFFOztFQUVwSSxJQUFJLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7RUFFM0IsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxZQUFZLENBQUMsQ0FBQztFQUMvRCxHQUFHLFNBQVM7RUFDWixJQUFJLE1BQU0sV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztFQUNqQyxHQUFHO0VBQ0gsQ0FBQyxDQUFDOztFQ3RDSyxNQUFNLHVCQUF1QixHQUFHLENBQUMsR0FBRyxLQUFLO0VBQ2hELEVBQUUsTUFBTSxRQUFRLEdBQUcscUJBQXFCLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ3hELEVBQUUsTUFBTSxXQUFXLEdBQUcsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLENBQUM7O0VBRTFDLEVBQUUsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRTtFQUNsQyxJQUFJa0IsU0FBTSxDQUFDLFFBQVEsQ0FBQztFQUNwQixHQUFHLENBQUMsQ0FBQzs7RUFFTCxFQUFFLEtBQUssTUFBTSxDQUFDLElBQUksV0FBVyxFQUFFO0VBQy9CLElBQUksVUFBVSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0VBQzFELElBQUksVUFBVSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0VBQzFELElBQUksVUFBVSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0VBQzFELElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0VBQ3hELEdBQUc7O0VBRUgsRUFBRSxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFO0VBQ2pDLElBQUlBLFNBQU0sQ0FBQyxPQUFPLENBQUM7RUFDbkIsR0FBRyxDQUFDLENBQUM7O0VBRUwsRUFBRSxLQUFLLE1BQU0sQ0FBQyxJQUFJLFVBQVUsRUFBRTtFQUM5QixJQUFJLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztFQUN2RCxHQUFHOztFQUVILEVBQUUsS0FBSyxNQUFNLENBQUMsSUFBSUcsT0FBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRTtFQUNyQyxJQUFJLFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztFQUNqRCxHQUFHOztFQUVILEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRTtFQUNoQixJQUFJdUIsU0FBTTtFQUNWLElBQUkxQixTQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztFQUMxQixJQUFJeUMsT0FBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0VBQ2pDLEdBQUcsQ0FBQyxDQUFDOztFQUVMLEVBQUUsT0FBTyxXQUFXLENBQUMsV0FBVyxDQUFDO0VBQ2pDLENBQUMsQ0FBQzs7RUNoQ0ssTUFBTWEscUJBQW1CLEdBQUcsR0FBRyxJQUFJLE9BQU8sUUFBUSxFQUFFLFlBQVksS0FBSyxVQUFVO0VBQ3RGLEVBQUUsR0FBRztFQUNMLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUI7RUFDcEMsRUFBRSxVQUFVLENBQUMsbUJBQW1CLENBQUMsWUFBWTtFQUM3QyxFQUFFLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRTtFQUM1QixFQUFFLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsWUFBWTtFQUNuRCxDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLG9CQUFvQixHQUFHLE9BQU8sR0FBRyxFQUFFLFFBQVEsRUFBRSxZQUFZLEtBQUs7RUFDM0UsRUFBRSxNQUFNLElBQUksR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0VBRS9ELEVBQUUsTUFBTSxrQkFBa0IsR0FBRyxDQUFDO0VBQzlCLElBQUksTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQztFQUNwRCxJQUFJO0VBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU07RUFDbkIsTUFBTXZELE1BQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQztFQUN0QixLQUFLO0VBQ0wsR0FBRyxDQUFDOztFQUVKLEVBQUUsTUFBTSxPQUFPLEdBQUdzQyxhQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQztFQUMvRCxFQUFFLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7RUFDMUIsSUFBSSxNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsZ0NBQWdDLEVBQUV2RCxPQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzlFLEdBQUc7O0VBRUgsRUFBRSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQyxFQUFFOztFQUUxRixFQUFFLElBQUk7RUFDTixJQUFJLE1BQU0sS0FBSyxHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7RUFDaEUsSUFBSSxNQUFNLElBQUksR0FBRyxhQUFhLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0VBQ2hELElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sSUFBSSxhQUFhLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTs7RUFFbkYsSUFBSSxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztFQUNyQyxJQUFJLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDO0VBQzNELEdBQUcsU0FBUztFQUNaLElBQUksV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztFQUMzQixHQUFHO0VBQ0gsQ0FBQyxDQUFDOztBQ3pCVSxRQUFDLFVBQVUsR0FBRyxHQUFHLEtBQUs7RUFDbEMsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQztFQUNqQyxFQUFFLDJCQUEyQixFQUFFLDJCQUEyQixDQUFDLEdBQUcsQ0FBQztFQUMvRCxFQUFFLHFCQUFxQixFQUFFcUUsdUJBQXFCLENBQUMsR0FBRyxDQUFDO0VBQ25ELEVBQUUsVUFBVSxFQUFFQyxZQUFVLENBQUMsR0FBRyxDQUFDO0VBQzdCLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxDQUFDO0VBQ3pDLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUM7RUFDN0IsRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDLEdBQUcsQ0FBQztFQUMvQixFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLEFBQUcsQ0FBQztFQUMzQyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDO0VBQzdCLEVBQUUsY0FBYyxFQUFFLGNBQWMsQ0FBQyxHQUFHLENBQUM7RUFDckMsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQztFQUN6QixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLEdBQUcsQ0FBQztFQUN6QyxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDO0VBQ2pDLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxDQUFDO0VBQ3pDLEVBQUUsNEJBQTRCLEVBQUUsNEJBQTRCLENBQUMsR0FBRyxDQUFDO0VBQ2pFLEVBQUUsYUFBYTtFQUNmLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUM7RUFDdkMsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLEFBQUcsQ0FBQztFQUNqQyxFQUFFLG9CQUFvQixFQUFFLG9CQUFvQixDQUFDLEdBQUcsQ0FBQztFQUNqRCxFQUFFLHVCQUF1QixFQUFFLE1BQU0sdUJBQXVCLENBQUMsR0FBRyxDQUFDO0VBQzdELEVBQUUsbUJBQW1CLEVBQUVFLHFCQUFtQixDQUFDLEdBQUcsQ0FBQztFQUMvQyxDQUFDLENBQUM7O0VDekNLLE1BQU1DLGVBQWEsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsT0FBTyxLQUFLO0VBQzdELEVBQUUsY0FBYztFQUNoQixJQUFJLEdBQUc7RUFDUCxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTztFQUM3QixJQUFJLFVBQVUsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztFQUNyRCxJQUFJLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRTtFQUMzQixJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsT0FBTztFQUNwQyxHQUFHLENBQUM7RUFDSixDQUFDLENBQUM7O0FBRUYsRUFBTyxNQUFNLGNBQWMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxPQUFPLEtBQUssZ0JBQWdCLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUNaakksUUFBQyxhQUFhLEdBQUcsR0FBRyxLQUFLO0VBQ3JDLEVBQUUsT0FBTyxFQUFFQSxlQUFhLENBQUMsR0FBRyxDQUFDO0VBQzdCLENBQUMsQ0FBQzs7RUNGRixNQUFNLE9BQU8sR0FBRyxRQUFRLElBQUksT0FBTyxTQUFTLEVBQUUsT0FBTyxHQUFHLEVBQUUsS0FBSztFQUMvRCxFQUFFLElBQUksQ0FBQzVDLEtBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLEVBQUUsT0FBTzs7RUFFeEMsRUFBRSxLQUFLLE1BQU0sT0FBTyxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtFQUM3QyxJQUFJLE1BQU0sT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztFQUN0QyxHQUFHO0VBQ0gsQ0FBQyxDQUFDOztFQUVGLE1BQU0sU0FBUyxHQUFHLFFBQVEsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLEtBQUs7RUFDdEQsRUFBRSxJQUFJLENBQUNBLEtBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLEVBQUU7RUFDakMsSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDO0VBQzdCLEdBQUc7RUFDSCxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7RUFDcEMsQ0FBQyxDQUFDOztBQUVGLEVBQU8sTUFBTSxxQkFBcUIsR0FBRyxNQUFNO0VBQzNDLEVBQUUsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO0VBQ3RCLEVBQUUsTUFBTSxlQUFlLElBQUk7RUFDM0IsSUFBSSxPQUFPLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQztFQUM5QixJQUFJLFNBQVMsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDO0VBQ2xDLEdBQUcsQ0FBQyxDQUFDO0VBQ0wsRUFBRSxPQUFPLGVBQWUsQ0FBQztFQUN6QixDQUFDLENBQUM7O0VDckJGLE1BQU0sVUFBVSxHQUFHLGtCQUFrQixJQUFJLE9BQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxHQUFHLEtBQUssTUFBTSxLQUFLLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztFQUVqSyxNQUFNLGFBQWEsR0FBRyxrQkFBa0IsSUFBSSxPQUFPLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsR0FBRyxLQUFLLE1BQU0sS0FBSyxDQUFDLGtCQUFrQixFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztFQUU5SixNQUFNLFFBQVEsR0FBRyxTQUFTLElBQUksT0FBTyxHQUFHLEVBQUUsT0FBTyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsR0FBRyxLQUFLO0VBQ3ZFLEVBQUUsSUFBSTtFQUNOLElBQUksT0FBTyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDbEYsR0FBRyxDQUFDLE9BQU8sR0FBRyxFQUFFO0VBQ2hCLElBQUksTUFBTSxJQUFJLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7RUFDekMsR0FBRztFQUNILEVBQUM7O0VBRUQsTUFBTSxVQUFVLEdBQUcsU0FBUyxJQUFJLE9BQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxHQUFHLEtBQUs7RUFDOUUsRUFBRSxJQUFJO0VBQ04sSUFBSSxPQUFPLE1BQU0sS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQ3ZGLEdBQUcsQ0FBQyxPQUFPLEdBQUcsRUFBRTtFQUNoQixJQUFJLE1BQU0sSUFBSSxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0VBQ3pDLEdBQUc7RUFDSCxFQUFDOztBQUVELEFBQVksUUFBQyxjQUFjLEdBQUcsQ0FBQyxTQUFTLEtBQUs7RUFDN0MsRUFBRSxNQUFNLGtCQUFrQixHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUM7RUFDbEQsRUFBRSxTQUFTLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUMzQyxFQUFFLFNBQVMsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7RUFDeEQsRUFBRSxTQUFTLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUMvQyxFQUFFLFNBQVMsQ0FBQyxVQUFVLEdBQUcsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUM7RUFDM0QsRUFBRSxJQUFJLFNBQVMsQ0FBQyxhQUFhLEVBQUUsRUFBRSxPQUFPLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRTtFQUNsRSxFQUFFLE9BQU8sU0FBUyxDQUFDO0VBQ25CLENBQUM7O0VDMUJNLE1BQU0sV0FBVyxHQUFHLElBQUksSUFBSTtFQUNuQyxFQUFFLElBQUksSUFBSSxDQUFDO0VBQ1g7RUFDQSxFQUFFLElBQUk7RUFDTixJQUFJLElBQUksR0FBRzZDLHdCQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDdkIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0VBQ2IsSUFBSSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztFQUNoRSxJQUFJLE1BQU0sQ0FBQyxDQUFDO0VBQ1osR0FBRzs7RUFFSCxFQUFFLE9BQU8sSUFBSSxDQUFDO0VBQ2QsRUFBQzs7QUFFRCxFQUFPLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxJQUFJO0VBQ3pDLEVBQUUsSUFBSSxJQUFJLENBQUM7RUFDWDtFQUNBLEVBQUUsSUFBSTtFQUNOLElBQUksSUFBSSxHQUFHQyw4QkFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3RCLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtFQUNiLElBQUksQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLDZCQUE2QixFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7RUFDdEUsSUFBSSxNQUFNLENBQUMsQ0FBQztFQUNaLEdBQUc7RUFDSDtFQUNBLEVBQUUsT0FBTyxJQUFJLENBQUM7RUFDZCxDQUFDOztFQ25CTSxNQUFNLGlCQUFpQixHQUFHLENBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxLQUFLO0VBQzNGLEVBQUUsZUFBZSxDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0VBQzdDLEVBQUUsaUJBQWlCLENBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7RUFDMUUsRUFBRSxPQUFPLHVCQUF1QixDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0VBQzVELENBQUMsQ0FBQzs7RUFFRixNQUFNLHVCQUF1QixHQUFHLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxLQUFLLENBQUMsQ0FBQyxPQUFPLEVBQUU7RUFDMUUsRUFBRXBGLFNBQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUs7RUFDckIsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxjQUFjLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0VBQ3BFLElBQUksT0FBTyxHQUFHLENBQUM7RUFDZixHQUFHLEVBQUUsRUFBRSxDQUFDO0VBQ1IsQ0FBQyxDQUFDLENBQUM7O0VBRUgsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksS0FBSztFQUNwRixFQUFFLE1BQU0sYUFBYSxHQUFHLENBQUMsY0FBYyxFQUFFLFlBQVksS0FBSztFQUMxRCxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsT0FBTyxFQUFFLENBQUM7RUFDbkMsSUFBSSxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7RUFDL0MsSUFBSSxPQUFPLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztFQUNuRCxHQUFHLENBQUM7O0VBRUosRUFBRSxNQUFNLGdCQUFnQixHQUFHLENBQUMsT0FBTyxFQUFFLFlBQVksS0FBSztFQUN0RCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sSUFBSSxDQUFDO0VBQ3hDLElBQUksTUFBTSxTQUFTLEdBQUcsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQzNELElBQUksT0FBTyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztFQUNoRCxHQUFHLENBQUM7O0VBRUosRUFBRSxLQUFLLElBQUksSUFBSSxJQUFJLFFBQVEsRUFBRTtFQUM3QixJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUcsS0FBSztFQUNqRCxNQUFNLElBQUksZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO0VBQ3ZDLFFBQVEsTUFBTSxjQUFjO0VBQzVCLFVBQVUsZ0JBQWdCO0VBQzFCLFVBQVVrQyxPQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztFQUN4RCxVQUFVLGFBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQztFQUNqRCxTQUFTLENBQUM7RUFDVixPQUFPO0VBQ1AsS0FBSyxDQUFDLENBQUM7RUFDUCxHQUFHO0VBQ0gsQ0FBQyxDQUFDOztFQUVGLE1BQU0sZUFBZSxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxLQUFLO0VBQ3ZELEVBQUUsTUFBTSxlQUFlLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRTtFQUNyQyxJQUFJMEMsU0FBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDO0VBQ2xDLElBQUlsRCxNQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxlQUFlLENBQUM7RUFDL0IsR0FBRyxDQUFDLENBQUM7O0VBRUwsRUFBRSxNQUFNLGVBQWUsR0FBR0ksT0FBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0VBRWpELEVBQUUsTUFBTSxjQUFjLEdBQUdrQyxhQUFVO0VBQ25DLElBQUksZUFBZSxFQUFFLGVBQWU7RUFDcEMsR0FBRyxDQUFDOztFQUVKLEVBQUUsSUFBSSxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtFQUNqQyxJQUFJLE1BQU0sSUFBSSxlQUFlLENBQUMsQ0FBQyw2Q0FBNkMsRUFBRXZELE9BQUksQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDNUcsR0FBRzs7RUFFSCxFQUFFLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRTtFQUN2QyxJQUFJa0IsU0FBTSxDQUFDLENBQUMsSUFBSSxDQUFDSSxhQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0VBQ2xGLElBQUlMLE1BQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7RUFDM0UsR0FBRyxDQUFDLENBQUM7O0VBRUwsRUFBRSxJQUFJLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7RUFDcEMsSUFBSSxNQUFNLElBQUksYUFBYSxDQUFDLENBQUMsd0RBQXdELEVBQUVqQixPQUFJLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDeEgsR0FBRztFQUNILENBQUMsQ0FBQzs7RUMxREssTUFBTSxRQUFRLEdBQUcsT0FBTyxHQUFHLEtBQUs7RUFDdkMsRUFBRSxNQUFNLGdCQUFnQixHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUI7RUFDaEUsSUFBSSxtQkFBbUI7RUFDdkIsR0FBRyxDQUFDOztFQUVKLEVBQUUsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDOztFQUV4QixFQUFFLElBQUlRLE9BQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEVBQUU7RUFDbEQsSUFBSSxNQUFNLGdCQUFnQixHQUFHaUIsT0FBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7RUFFeEUsSUFBSSxZQUFZLEdBQUcsTUFBTSw4QkFBOEI7RUFDdkQsTUFBTSxHQUFHO0VBQ1QsTUFBTSxPQUFPLENBQUMsbUJBQW1CLEVBQUUsZ0JBQWdCLENBQUM7RUFDcEQsS0FBSyxDQUFDO0VBQ04sR0FBRzs7RUFFSCxFQUFFLElBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsT0FBTyxZQUFZLENBQUM7O0VBRW5ELEVBQUUsT0FBTyxNQUFNLDRCQUE0QjtFQUMzQyxJQUFJLEdBQUcsRUFBRSxnQkFBZ0I7RUFDekIsR0FBRyxDQUFDO0VBQ0osQ0FBQyxDQUFDOztFQUVGLE1BQU0sOEJBQThCLEdBQUcsT0FBTyxHQUFHLEVBQUUsZ0JBQWdCLEtBQUs7RUFDeEUsRUFBRSxNQUFNLFlBQVksR0FBRyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUMvRSxFQUFFLElBQUksWUFBWSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7RUFDakM7RUFDQSxJQUFJLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUN2RCxJQUFJLE9BQU8sRUFBRSxDQUFDO0VBQ2QsR0FBRzs7RUFFSCxFQUFFLE1BQU0sbUJBQW1CLEdBQUcsT0FBTyxnQkFBZ0IsR0FBRyxDQUFDLEtBQUs7RUFDOUQsSUFBSSxJQUFJLGdCQUFnQixJQUFJLFlBQVksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUM7O0VBRTNELElBQUksTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixFQUFFLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7RUFDckYsSUFBSSxNQUFNLEtBQUssR0FBRyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsaUJBQWlCO0VBQ3ZELE1BQU0sY0FBYztFQUNwQixLQUFLLENBQUM7O0VBRU4sSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0VBQzVCLE1BQU0sTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUN2RCxNQUFNLE9BQU8sTUFBTSxtQkFBbUIsQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsQ0FBQztFQUM3RCxLQUFLOztFQUVMLElBQUksT0FBTyxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsQ0FBQztFQUNyQyxHQUFHLENBQUM7O0VBRUosRUFBRSxNQUFNLGdCQUFnQixHQUFHLE1BQU0sbUJBQW1CLEVBQUUsQ0FBQzs7RUFFdkQsRUFBRSxJQUFJLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDOztFQUVyRCxFQUFFLE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUU7RUFDakQsSUFBSVIsTUFBRyxDQUFDLGtCQUFrQixDQUFDO0VBQzNCLEdBQUcsQ0FBQyxDQUFDOztFQUVMLEVBQUUsS0FBSyxNQUFNLENBQUMsSUFBSSxZQUFZLEVBQUU7RUFDaEMsSUFBSSxNQUFNLGtCQUFrQixHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRO0VBQzNELE1BQU0sT0FBTztFQUNiLFFBQVEsZ0JBQWdCLENBQUMsY0FBYztFQUN2QyxRQUFRLENBQUMsQ0FBQyxNQUFNO0VBQ2hCLE9BQU87RUFDUCxLQUFLLENBQUM7RUFDTixJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxLQUFLLENBQUMsR0FBRyxFQUFFLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQzlELEdBQUc7O0VBRUgsRUFBRSxZQUFZLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRTtFQUMvQyxJQUFJLGdCQUFnQjtFQUNwQixJQUFJLDBCQUEwQjtFQUM5QixJQUFJLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUM7RUFDekMsR0FBRyxDQUFDLENBQUM7O0VBRUwsRUFBRSxZQUFZLENBQUMsU0FBUyxHQUFHLGdCQUFnQixDQUFDLGNBQWMsQ0FBQzs7RUFFM0QsRUFBRSxPQUFPLFlBQVksQ0FBQztFQUN0QixDQUFDLENBQUM7O0VBRUYsTUFBTSw0QkFBNEIsR0FBRyxPQUFPLEdBQUcsRUFBRSxnQkFBZ0IsS0FBSztFQUN0RSxFQUFFLE1BQU0sY0FBYyxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRTtFQUM3QyxJQUFJQyxTQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxhQUFhO0VBQ25DLHVCQUF1QixDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzlDLElBQUlELE1BQUcsQ0FBQyxrQkFBa0IsQ0FBQztFQUMzQixHQUFHLENBQUMsQ0FBQzs7RUFFTCxFQUFFLE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRTtFQUNuRCxJQUFJMkQsVUFBTyxDQUFDLFVBQVUsQ0FBQztFQUN2QixHQUFHLENBQUMsQ0FBQzs7RUFFTCxFQUFFLE1BQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDOztFQUVqQyxFQUFFLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLO0VBQzlCLElBQUksSUFBSSxDQUFDLENBQUMsUUFBUSxLQUFLLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQzs7RUFFdEMsSUFBSSxNQUFNLEVBQUUsR0FBRyxnQkFBZ0I7RUFDL0IsTUFBTSxDQUFDLENBQUMsUUFBUTtFQUNoQixNQUFNLENBQUMsQ0FBQyxlQUFlO0VBQ3ZCLE1BQU0sQ0FBQyxDQUFDLFFBQVE7RUFDaEIsS0FBSyxDQUFDOztFQUVOLElBQUksTUFBTSxXQUFXLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVE7RUFDcEQsTUFBTSxPQUFPLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxDQUFDO0VBQ3RDLEtBQUssQ0FBQzs7RUFFTixJQUFJLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFO0VBQ3JCLE1BQU0sQ0FBQyxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO0VBQ3BDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7RUFDeEIsTUFBTSxPQUFPLENBQUMsQ0FBQztFQUNmLEtBQUs7O0VBRUwsSUFBSSxNQUFNLEdBQUcsR0FBRyxNQUFNLEtBQUs7RUFDM0IsTUFBTSxHQUFHO0VBQ1QsTUFBTSxXQUFXLENBQUMsU0FBUztFQUMzQixLQUFLLENBQUM7RUFDTixJQUFJLElBQUksR0FBRyxDQUFDLGFBQWEsS0FBSyxFQUFFLEVBQUU7RUFDbEMsTUFBTSxDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztFQUNyQixNQUFNLElBQUksV0FBVyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFFO0VBQ3pFLE1BQU0sQ0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7RUFDeEIsS0FBSyxNQUFNO0VBQ1gsTUFBTSxDQUFDLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztFQUN6QixLQUFLOztFQUVMLElBQUksT0FBTyxDQUFDLENBQUM7RUFDYixHQUFHLENBQUM7O0VBRUosRUFBRSxNQUFNLE9BQU8sR0FBRyxPQUFPLEtBQUssRUFBRSxPQUFPLEtBQUs7RUFDNUMsSUFBSSxNQUFNLFlBQVksR0FBRzFELFNBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNoRCxJQUFJLElBQUksWUFBWSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7RUFDbkMsTUFBTSxNQUFNLENBQUMsR0FBRyxNQUFNLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM5QyxNQUFNLFFBQVEsQ0FBQyxDQUFDLFFBQVEsS0FBSyxJQUFJLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRTtFQUM5QyxLQUFLO0VBQ0wsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLFlBQVksRUFBRTtFQUNoQyxNQUFNLENBQUMsR0FBRyxNQUFNLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMxQixNQUFNLElBQUksQ0FBQyxDQUFDLFFBQVEsS0FBSyxJQUFJLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFO0VBQzVDLEtBQUs7O0VBRUwsSUFBSSxPQUFPLElBQUksQ0FBQztFQUNoQixHQUFHLENBQUM7O0VBRUosRUFBRSxLQUFLLE1BQU0sUUFBUSxJQUFJLHNCQUFzQixFQUFFO0VBQ2pELElBQUksTUFBTSxpQkFBaUIsR0FBRyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUMvRCxJQUFJLElBQUksaUJBQWlCLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtFQUN4QyxNQUFNLE1BQU0sQ0FBQyxHQUFHLE1BQU0sTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDbkQsTUFBTSxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtFQUN0RCxNQUFNLFNBQVM7RUFDZixLQUFLO0VBQ0wsSUFBSSxJQUFJVixPQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsaUJBQWlCLENBQUMsRUFBRTtFQUMzQyxNQUFNLE1BQU0sQ0FBQyxHQUFHLE1BQU0sTUFBTSxDQUFDaUIsT0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztFQUNoRSxNQUFNLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0VBQ3RELE1BQU0sU0FBUztFQUNmLEtBQUs7RUFDTCxJQUFJLElBQUlqQixPQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsaUJBQWlCLENBQUMsRUFBRTtFQUMzQyxNQUFNLE1BQU0sR0FBRyxHQUFHLE1BQU0sT0FBTyxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0VBQzdELE1BQU0sSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLG1CQUFtQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0VBQzlFLE1BQU0sU0FBUztFQUNmLEtBQUs7RUFDTCxJQUFJLElBQUlBLE9BQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO0VBQzNDLE1BQU0sTUFBTSxHQUFHLEdBQUcsTUFBTSxPQUFPLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUM7RUFDN0QsTUFBTSxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLG1CQUFtQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0VBQzlELE1BQU0sU0FBUztFQUNmLEtBQUs7RUFDTCxHQUFHOztFQUVILEVBQUUsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRTtFQUN2QyxJQUFJVSxTQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQztFQUM5RSxHQUFHLENBQUMsQ0FBQzs7O0VBR0wsRUFBRSxNQUFNLGNBQWMsR0FBR0QsTUFBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVU7RUFDMUQsSUFBSSxPQUFPO0VBQ1gsTUFBTSxtQkFBbUI7RUFDekIsTUFBTSxnQkFBZ0I7RUFDdEIsUUFBUSxDQUFDLENBQUMsUUFBUTtFQUNsQixRQUFRLENBQUMsQ0FBQyxlQUFlO0VBQ3pCLFFBQVEsQ0FBQyxDQUFDLFFBQVE7RUFDbEIsT0FBTztFQUNQLEtBQUs7RUFDTCxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7RUFFakIsRUFBRSxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7O0VBRXBDLEVBQUUsT0FBTyxtQkFBbUIsQ0FBQztFQUM3QixDQUFDLENBQUM7O0VBRUYsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLEVBQUUsS0FBSztFQUNuQyxFQUFFLE1BQU0sT0FBTyxHQUFHdEIsUUFBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ25DLEVBQUUsUUFBUTtFQUNWLElBQUksUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7RUFDeEIsSUFBSSxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztFQUMvQixJQUFJLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0VBQ3hCLElBQUksTUFBTSxFQUFFLEVBQUU7RUFDZCxHQUFHLEVBQUU7RUFDTCxDQUFDLENBQUM7O0VDN0xLLE1BQU0sMEJBQTBCLEdBQUcsQ0FBQyxZQUFZLEVBQUUsTUFBTSxLQUFLO0VBQ3BFLEVBQUUsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztFQUN6QixFQUFFLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNqQyxFQUFFLE1BQU0sTUFBTSxHQUFHLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7RUFFdEMsRUFBRSxNQUFNLGFBQWEsR0FBR21ELFNBQU8sQ0FBQyxxQkFBcUIsQ0FBQyxZQUFZLENBQUM7RUFDbkUsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDO0VBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOztFQUVkLEVBQUUsTUFBTSxvQ0FBb0MsR0FBRyxDQUFDLFNBQVMsRUFBRSxRQUFRLEtBQUssbUJBQW1CLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0VBRTFJLEVBQUUsTUFBTSw2QkFBNkIsR0FBRyxNQUFNdkQsU0FBTSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksS0FBSztFQUNwRSxJQUFJLE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0VBQzVELElBQUksR0FBRyxDQUFDLFlBQVksR0FBRyxlQUFlLENBQUM7RUFDdkMsSUFBSSxNQUFNLFlBQVksR0FBRyxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztFQUNuRixJQUFJLE1BQU0sU0FBUyxHQUFHa0MsT0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDOztFQUV4RCxJQUFJLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxHQUFHLENBQUMsRUFBRTs7RUFFN0MsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztFQUM1QixtQkFBbUIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLEVBQUUsT0FBTyxHQUFHLENBQUMsRUFBRTs7RUFFbEUsSUFBSSxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtFQUN6QyxNQUFNUCxTQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEtBQUssVUFBVSxDQUFDLFFBQVE7RUFDckQsNEJBQTRCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEtBQUssQ0FBQztFQUMvRCw0QkFBNEJQLFdBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO0VBQ3RFLEtBQUssQ0FBQyxDQUFDOztFQUVQLElBQUlnRCxPQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSTtFQUNuQyxNQUFNLG9DQUFvQyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUM7RUFDOUQsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7O0VBRWhCLElBQUksT0FBTyxHQUFHLENBQUM7RUFDZixHQUFHLEVBQUUsRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQzs7RUFFcEUsRUFBRSxNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUMsYUFBYSxFQUFFO0VBQ3ZDLElBQUl6QyxTQUFNLENBQUMsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUNyRSxJQUFJRCxNQUFHLENBQUMsQ0FBQyxJQUFJLG1CQUFtQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztFQUNqRCxHQUFHLENBQUMsQ0FBQzs7RUFFTCxFQUFFLE9BQU8zQixRQUFLLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0VBQzdELENBQUMsQ0FBQzs7QUFFRixFQUFPLE1BQU0sa0NBQWtDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsTUFBTSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFO0VBQzFGLEVBQUUsbUJBQW1CLENBQUMsWUFBWSxDQUFDO0VBQ25DLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNO0VBQ2YsRUFBRTRCLFNBQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxXQUFXO0VBQ3BDLHVCQUF1QixXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNsRCx1QkFBdUIsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUM1RCxFQUFFRCxNQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLG9CQUFvQixFQUFFO0VBQ2pELElBQUlBLE1BQUcsQ0FBQyxDQUFDLEtBQUs7RUFDZCxNQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztFQUMxQyxNQUFNLEtBQUssRUFBRSxDQUFDO0VBQ2QsS0FBSyxDQUFDLENBQUM7RUFDUCxHQUFHLENBQUMsQ0FBQztFQUNMLEVBQUV5QyxVQUFPO0VBQ1QsRUFBRXpDLE1BQUcsQ0FBQyxDQUFDLElBQUksbUJBQW1CO0VBQzlCLElBQUksQ0FBQyxDQUFDLFVBQVU7RUFDaEIsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO0VBQ3hELEdBQUcsQ0FBQztFQUNKLENBQUMsQ0FBQyxDQUFDOztFQUVILE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxNQUFNLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7O0VDOUU3RTtFQUNGO0VBQ0EsRUFBRSxBQUFPLE1BQU0sc0JBQXNCLEdBQUcsTUFBTSxJQUFJO0VBQ2xEO0VBQ0EsSUFBSSxJQUFJLFFBQVEsQ0FBQztFQUNqQjtFQUNBLElBQUksTUFBTSxhQUFhLEdBQUcsR0FBRyxJQUFJO0VBQ2pDLFFBQVEsUUFBUSxHQUFHLEdBQUcsQ0FBQztFQUN2QixLQUFLLENBQUM7O0VBRU4sSUFBSSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztFQUN0QztFQUNBLElBQUksTUFBTSxLQUFLLEdBQUcsS0FBSyxJQUFJO0VBQzNCLE1BQU0sSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO0VBQzNCO0VBQ0EsTUFBTSxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sS0FBSztFQUM5QyxRQUFRLElBQUksUUFBUSxFQUFFO0VBQ3RCLFVBQVUsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDO0VBQy9CLFVBQVUsUUFBUSxHQUFHLFNBQVMsQ0FBQztFQUMvQixVQUFVLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzdCLFNBQVM7RUFDVDtFQUNBLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO0VBQ25FLFVBQVUsT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0VBQ3RELFNBQVM7RUFDVDtFQUNBLFFBQVEsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLElBQUk7RUFDekMsVUFBVSxRQUFRLEdBQUcsU0FBUyxDQUFDO0VBQy9CLFVBQVUsUUFBUSxHQUFHLElBQUksQ0FBQztFQUMxQixVQUFVLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUN0QixVQUFTO0VBQ1Q7RUFDQSxRQUFRLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGlCQUFpQixDQUFDLENBQUM7RUFDaEQ7RUFDQSxRQUFRLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDN0M7RUFDQSxRQUFRLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLGlCQUFpQixDQUFDLENBQUM7RUFDMUQ7RUFDQSxRQUFRLElBQUksUUFBUSxFQUFFO0VBQ3RCLFVBQVUsSUFBSSxDQUFDLFFBQVEsRUFBRTtFQUN6QixZQUFZLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDbEMsV0FBVztFQUNYLFNBQVMsTUFBTTtFQUNmLFVBQVUsTUFBTSxZQUFZLEdBQUcsR0FBRyxJQUFJO0VBQ3RDLFlBQVksUUFBUSxHQUFHLFNBQVMsQ0FBQztFQUNqQyxZQUFZLGVBQWUsRUFBRSxDQUFDO0VBQzlCLFlBQVksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ3hCLFlBQVc7RUFDWDtFQUNBLFVBQVUsTUFBTSxZQUFZLEdBQUcsTUFBTTtFQUNyQyxZQUFZLGVBQWUsRUFBRSxDQUFDO0VBQzlCLFlBQVksT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUNsQyxZQUFXO0VBQ1g7RUFDQSxVQUFVLE1BQU0sWUFBWSxHQUFHLE1BQU07RUFDckMsWUFBWSxlQUFlLEVBQUUsQ0FBQztFQUM5QixZQUFZLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDbEMsWUFBVztFQUNYO0VBQ0EsVUFBVSxNQUFNLGFBQWEsR0FBRyxNQUFNO0VBQ3RDLFlBQVksZUFBZSxFQUFFLENBQUM7RUFDOUIsWUFBWSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ2xDLFlBQVc7RUFDWDtFQUNBLFVBQVUsTUFBTSxlQUFlLEdBQUcsTUFBTTtFQUN4QyxZQUFZLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0VBQ3pELFlBQVksTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7RUFDekQsWUFBWSxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztFQUN6RCxZQUFZLE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0VBQzNELFlBQVc7RUFDWDtFQUNBLFVBQVUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7RUFDM0MsVUFBVSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztFQUMzQyxVQUFVLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0VBQzNDLFVBQVUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7RUFDN0MsU0FBUztFQUNULE9BQU8sQ0FBQztFQUNSLE1BQUs7RUFDTDtFQUNBLElBQUksTUFBTSxHQUFHLEdBQUcsTUFBTTtFQUN0QjtFQUNBLE1BQU0sT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEtBQUs7RUFDOUMsUUFBUSxJQUFJLFFBQVEsRUFBRTtFQUN0QixVQUFVLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQztFQUMvQixVQUFVLFFBQVEsR0FBRyxTQUFTLENBQUM7RUFDL0IsVUFBVSxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUM3QixTQUFTO0VBQ1Q7RUFDQSxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtFQUNuRSxVQUFVLE9BQU8sT0FBTyxFQUFFLENBQUM7RUFDM0IsU0FBUztFQUNUO0VBQ0EsUUFBUSxNQUFNLGFBQWEsR0FBRyxNQUFNO0VBQ3BDLFVBQVUsZUFBZSxFQUFFLENBQUM7RUFDNUIsVUFBVSxPQUFPLEVBQUUsQ0FBQztFQUNwQixVQUFTO0VBQ1Q7RUFDQSxRQUFRLE1BQU0sWUFBWSxHQUFHLENBQUMsR0FBRyxLQUFLO0VBQ3RDLFVBQVUsUUFBUSxHQUFHLFNBQVMsQ0FBQztFQUMvQixVQUFVLGVBQWUsRUFBRSxDQUFDO0VBQzVCLFVBQVUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ3RCLFVBQVM7RUFDVDtFQUNBLFFBQVEsTUFBTSxlQUFlLEdBQUcsTUFBTTtFQUN0QyxVQUFVLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0VBQ3ZELFVBQVUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7RUFDekQsVUFBUztFQUNUO0VBQ0EsUUFBUSxNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztFQUMzQyxRQUFRLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0VBQ3pDO0VBQ0EsUUFBUSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7RUFDckIsT0FBTyxDQUFDO0VBQ1IsTUFBSzs7RUFFTCxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7RUFDeEIsR0FBRzs7RUM5R0ksTUFBTSxZQUFZLEdBQUcsT0FBTyxTQUFTLEVBQUUsS0FBSyxFQUFFLFFBQVE7RUFDN0QsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxZQUFZLEtBQUs7RUFDN0QsRUFBRSxNQUFNLGlCQUFpQixHQUFHLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0VBQ3RELEVBQUUsTUFBTSxNQUFNLEdBQUcsTUFBTSxTQUFTLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0VBQzFHLEVBQUUsSUFBSSxNQUFNLEtBQUssYUFBYSxFQUFFLE9BQU87O0VBRXZDLEVBQUUsTUFBTSxNQUFNLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQztFQUN6RCxFQUFFLE1BQU0sY0FBYyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztFQUM3QyxDQUFDLENBQUM7O0VBRUYsTUFBTSxhQUFhLEdBQUcsZUFBZSxDQUFDO0VBQ3RDLE1BQU0sU0FBUyxHQUFHLE9BQU8sU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsS0FBSztFQUN0RyxFQUFFLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQzs7RUFFNUIsRUFBRSxJQUFJLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRTtFQUNqQyxJQUFJLE1BQU0sMkJBQTJCLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQztFQUN2RSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUU7RUFDNUMsTUFBTSxNQUFNLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQ2pELEtBQUs7RUFDTCxHQUFHOztFQUVILEVBQUUsSUFBSTs7RUFFTixJQUFJLGNBQWMsR0FBRyxxQkFBcUI7RUFDMUMsUUFBUSxNQUFNLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUM7RUFDdEQsS0FBSyxDQUFDOztFQUVOLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRTs7RUFFZCxJQUFJLElBQUksTUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFO0VBQzVDLE1BQU0sTUFBTSxDQUFDLENBQUM7RUFDZCxLQUFLLE1BQU07RUFDWCxNQUFNLElBQUksaUJBQWlCLEVBQUU7RUFDN0IsUUFBUSxNQUFNLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQ25ELE9BQU8sTUFBTTtFQUNiLFFBQVEsT0FBTyxhQUFhLENBQUM7RUFDN0IsT0FBTzs7RUFFUCxNQUFNLGNBQWMsR0FBRyxxQkFBcUI7RUFDNUMsVUFBVSxNQUFNLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUM7RUFDeEQsT0FBTyxDQUFDOztFQUVSLEtBQUs7RUFDTCxHQUFHOztFQUVILEVBQUUsTUFBTSxjQUFjLEdBQUcsc0JBQXNCO0VBQy9DLE1BQU0sTUFBTSxLQUFLLENBQUMsa0JBQWtCLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQztFQUM5RCxHQUFHLENBQUM7O0VBRUosRUFBRSxPQUFPLGNBQWM7RUFDdkIsSUFBSSxTQUFTLEVBQUUsU0FBUztFQUN4QixRQUFRLGNBQWMsRUFBRSxjQUFjO0VBQ3RDLEdBQUcsQ0FBQztFQUNKLENBQUMsQ0FBQzs7RUFFRixNQUFNLGNBQWMsR0FBRyxPQUFPLEtBQUssRUFBRSxjQUFjLEVBQUUsT0FBTyxHQUFHLEtBQUssS0FBSztFQUN6RSxFQUFFLE1BQU0sUUFBUSxHQUFHLENBQUMsRUFBRSxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDNUMsRUFBRSxJQUFJO0VBQ04sSUFBSSxNQUFNLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7RUFDM0MsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0VBQ2Q7RUFDQSxHQUFHO0VBQ0gsRUFBRSxJQUFJO0VBQ04sSUFBSSxNQUFNLEtBQUssQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0VBQ3JELEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRTtFQUNkO0VBQ0EsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0VBQ2xCLE1BQU0sTUFBTSxjQUFjLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztFQUN4RCxLQUFLLE1BQU07RUFDWCxNQUFNLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0VBQ3JFLEtBQUs7RUFDTCxHQUFHO0VBQ0gsQ0FBQyxDQUFDOztFQ2pESyxNQUFNLG1CQUFtQixHQUFHLEdBQUcsSUFBSSxPQUFPLFlBQVksS0FBSztFQUNsRSxFQUFFLE1BQU0sY0FBYyxHQUFHLHlCQUF5QixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7O0VBRWhGLEVBQUUsS0FBSyxNQUFNLEtBQUssSUFBSUksT0FBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFO0VBQzVDLElBQUksTUFBTSxZQUFZO0VBQ3RCLE1BQU0sR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUztFQUNsQyxNQUFNLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRO0VBQ3BDLE1BQU0sY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVM7RUFDckMsTUFBTSxLQUFLO0VBQ1gsTUFBTSxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTTtFQUNsQyxNQUFNLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPO0VBQ25DLEtBQUssQ0FBQztFQUNOLEdBQUc7RUFDSCxDQUFDLENBQUM7O0VBRUYsTUFBTSx5QkFBeUIsR0FBRyxDQUFDLFNBQVMsRUFBRSxZQUFZLEtBQUs7RUFDL0QsRUFBRSxNQUFNLE9BQU8sR0FBRyw0QkFBNEI7RUFDOUMsSUFBSSxTQUFTLEVBQUUsWUFBWTtFQUMzQixHQUFHLENBQUM7O0VBRUosRUFBRSxNQUFNLE9BQU8sR0FBRyw0QkFBNEI7RUFDOUMsSUFBSSxTQUFTLEVBQUUsWUFBWTtFQUMzQixHQUFHLENBQUM7RUFDSixFQUFFLE1BQU0sT0FBTyxHQUFHLDRCQUE0QjtFQUM5QyxJQUFJLFNBQVMsRUFBRSxZQUFZO0VBQzNCLEdBQUcsQ0FBQzs7RUFFSixFQUFFLE1BQU0sVUFBVSxHQUFHLGdDQUFnQztFQUNyRCxJQUFJLFNBQVM7RUFDYixJQUFJLFlBQVk7RUFDaEIsR0FBRyxDQUFDOztFQUVKLEVBQUUsTUFBTSxRQUFRLEdBQUc7RUFDbkIsSUFBSSxHQUFHLE9BQU87RUFDZCxJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVE7RUFDdkIsR0FBRyxDQUFDOztFQUVKLEVBQUUsTUFBTSxPQUFPLEdBQUc7RUFDbEIsSUFBSSxHQUFHLE9BQU87RUFDZCxJQUFJLEdBQUcsT0FBTyxDQUFDLE9BQU87RUFDdEIsSUFBSSxHQUFHLFVBQVU7RUFDakIsR0FBRyxDQUFDOztFQUVKLEVBQUUsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDOztFQUUxQixFQUFFLE1BQU0sZUFBZSxHQUFHLENBQUMsQ0FBQyxLQUFLO0VBQ2pDLElBQUksSUFBSTVCLGNBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUU7RUFDcEQsTUFBTSxZQUFZLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxHQUFHO0VBQ3RDLFFBQVEsTUFBTSxFQUFFLEVBQUU7RUFDbEIsUUFBUSxPQUFPLEVBQUUsRUFBRTtFQUNuQixRQUFRLFFBQVEsRUFBRSxDQUFDLENBQUMsUUFBUTtFQUM1QixRQUFRLFlBQVksRUFBRSxDQUFDLENBQUMsWUFBWTtFQUNwQyxRQUFRLFNBQVMsRUFBRSxDQUFDLENBQUMsU0FBUztFQUM5QixPQUFPLENBQUM7RUFDUixLQUFLO0VBQ0wsR0FBRyxDQUFDOztFQUVKLEVBQUUsS0FBSyxNQUFNLEtBQUssSUFBSSxPQUFPLEVBQUU7RUFDL0IsSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDM0IsSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJO0VBQ2pELE1BQU0sS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNO0VBQy9CLEtBQUssQ0FBQztFQUNOLEdBQUc7O0VBRUgsRUFBRSxLQUFLLE1BQU0sS0FBSyxJQUFJLFFBQVEsRUFBRTtFQUNoQyxJQUFJLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUMzQixJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUk7RUFDbEQsTUFBTSxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHO0VBQ25DLEtBQUssQ0FBQztFQUNOLEdBQUc7O0VBRUgsRUFBRSxPQUFPLFlBQVksQ0FBQztFQUN0QixDQUFDLENBQUM7O0VBRUYsTUFBTSw0QkFBNEIsR0FBRyxDQUFDLFNBQVMsRUFBRSxZQUFZLEtBQUs7RUFDbEUsRUFBRSxNQUFNLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQ3lCLFNBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7O0VBRWpFLEVBQUUsTUFBTSxhQUFhLEdBQUcsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLEtBQUs7RUFDdEQsSUFBSSxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDdEUsSUFBSSxRQUFRO0VBQ1osTUFBTSxZQUFZO0VBQ2xCLE1BQU0sU0FBUyxFQUFFLGdCQUFnQixDQUFDLFNBQVM7RUFDM0MsTUFBTSxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsUUFBUTtFQUN6QyxNQUFNLGFBQWEsRUFBRSxpQkFBaUI7RUFDdEMsUUFBUSxnQkFBZ0IsQ0FBQyxTQUFTO0VBQ2xDLFFBQVEsZ0JBQWdCLENBQUMsUUFBUTtFQUNqQyxRQUFRLFlBQVksQ0FBQyxNQUFNO0VBQzNCLE9BQU87RUFDUCxLQUFLLEVBQUU7RUFDUCxHQUFHLENBQUM7O0VBRUosRUFBRSxNQUFNLG9CQUFvQixHQUFHLFdBQVcsSUFBSSxDQUFDLENBQUMsRUFBRSxPQUFPLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRTtFQUN6RSxJQUFJRCxNQUFHLENBQUMsQ0FBQyxLQUFLO0VBQ2QsTUFBTSxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0VBQ3hDLE1BQU0sR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztFQUNyQyxLQUFLLENBQUMsQ0FBQztFQUNQLElBQUlDLFNBQU0sQ0FBQyxXQUFXLENBQUM7RUFDdkIsR0FBRyxDQUFDLENBQUM7O0VBRUwsRUFBRSxNQUFNLGNBQWMsR0FBRyxDQUFDLENBQUMsRUFBRSxjQUFjLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsWUFBWSxLQUFLLElBQUk7RUFDeEYsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxZQUFZLEtBQUssS0FBSztFQUNyRCxlQUFlLGNBQWMsQ0FBQyxDQUFDOztFQUUvQixFQUFFLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFLGlCQUFpQixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsWUFBWSxLQUFLLEtBQUs7RUFDMUYsV0FBVyxpQkFBaUI7RUFDNUIsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxZQUFZLEtBQUssSUFBSSxDQUFDOztFQUVwRCxFQUFFLE1BQU0sY0FBYyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxZQUFZLEtBQUssSUFBSTtFQUN0RSxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFlBQVksS0FBSyxJQUFJO0VBQ25ELFdBQVcsQ0FBQzJELFVBQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNO0VBQzdDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7O0VBRXJDLEVBQUUsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO0VBQ3RCLEVBQUUsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDOztFQUVyQixFQUFFLEtBQUssTUFBTSxDQUFDLElBQUksa0JBQWtCLEVBQUU7RUFDdEMsSUFBSSxNQUFNLFlBQVksR0FBRywwQkFBMEI7RUFDbkQsTUFBTSxTQUFTLEVBQUUsQ0FBQyxDQUFDLE1BQU07RUFDekIsS0FBSyxDQUFDOztFQUVOLElBQUksTUFBTSxnQkFBZ0IsR0FBRyx1QkFBdUI7RUFDcEQsTUFBTSxTQUFTLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsTUFBTTtFQUN0QyxLQUFLLENBQUM7O0VBRU47RUFDQSxJQUFJLE1BQU0sb0JBQW9CLEdBQUd2RixPQUFLO0VBQ3RDLE1BQU0sb0JBQW9CLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQztFQUMzRDtFQUNBLE1BQU0sb0JBQW9CLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLFVBQVUsQ0FBQztFQUMxRTtFQUNBLE1BQU0sb0JBQW9CLENBQUMsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsWUFBWSxDQUFDO0VBQzFGLEtBQUssQ0FBQzs7RUFFTjtFQUNBLElBQUksTUFBTSxnQkFBZ0IsR0FBR0EsT0FBSztFQUNsQyxNQUFNLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUM7RUFDeEQ7RUFDQSxNQUFNLG9CQUFvQixDQUFDLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLGVBQWUsQ0FBQztFQUMxRjtFQUNBLE1BQU0sb0JBQW9CLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLFVBQVUsQ0FBQztFQUN2RSxLQUFLLENBQUM7O0VBRU4sSUFBSSxNQUFNLE9BQU8sR0FBR0EsT0FBSztFQUN6QixNQUFNLG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUM7RUFDM0Q7RUFDQSxNQUFNLG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7RUFDMUUsS0FBSyxDQUFDOztFQUVOLElBQUksTUFBTSxlQUFlLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRTtFQUN2QyxNQUFNNEIsU0FBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztFQUM5RCxLQUFLLENBQUMsQ0FBQzs7RUFFUCxJQUFJLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLGVBQWUsRUFBRTtFQUNsRCxNQUFNcUMsYUFBVSxDQUFDLE9BQU8sQ0FBQztFQUN6QixLQUFLLENBQUMsQ0FBQzs7RUFFUCxJQUFJLEtBQUssTUFBTSxHQUFHLElBQUksZUFBZSxFQUFFO0VBQ3ZDLE1BQU1NLE9BQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUN6QixNQUFNLG9CQUFvQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNyQyxNQUFNLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNqQyxLQUFLOztFQUVMLElBQUksUUFBUSxDQUFDLElBQUk7RUFDakIsTUFBTSxDQUFDLENBQUMsb0JBQW9CLEVBQUU7RUFDOUIsUUFBUTVDLE1BQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQztFQUN2QixPQUFPLENBQUM7RUFDUixLQUFLLENBQUM7O0VBRU4sSUFBSSxPQUFPLENBQUMsSUFBSTtFQUNoQixNQUFNLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRTtFQUMxQixRQUFRQSxNQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUM7RUFDdkIsT0FBTyxDQUFDO0VBQ1IsS0FBSyxDQUFDOztFQUVOLElBQUksT0FBTyxDQUFDLElBQUk7RUFDaEIsTUFBTSxDQUFDLENBQUMsa0JBQWtCLEVBQUU7RUFDNUIsUUFBUUEsTUFBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO0VBQ3ZCLE9BQU8sQ0FBQztFQUNSLEtBQUssQ0FBQztFQUNOLEdBQUc7O0VBRUgsRUFBRSxRQUFRO0VBQ1YsSUFBSSxRQUFRLEVBQUV5QyxVQUFPLENBQUMsUUFBUSxDQUFDO0VBQy9CLElBQUksT0FBTyxFQUFFQSxVQUFPLENBQUMsT0FBTyxDQUFDO0VBQzdCLEdBQUcsRUFBRTtFQUNMLENBQUMsQ0FBQzs7RUFFRixNQUFNLGdDQUFnQyxHQUFHLENBQUMsU0FBUyxFQUFFLFlBQVksS0FBSztFQUN0RSxFQUFFLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDeEMsU0FBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNwRSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQztFQUNyRCxFQUFFLE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUM7O0VBRTNDLEVBQUUsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDLEtBQUs7RUFDOUIsSUFBSSxJQUFJLGFBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRTtFQUNsQyxNQUFNLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztFQUNuQyxLQUFLOztFQUVMLElBQUksSUFBSSxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsRUFBRTtFQUNyQyxNQUFNLE1BQU0sVUFBVSxHQUFHLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDdEUsTUFBTSxNQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtFQUM3QyxRQUFRQSxTQUFNLENBQUMsNkJBQTZCLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDeEQsT0FBTyxDQUFDLENBQUM7RUFDVCxNQUFNLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztFQUMzQixNQUFNLEtBQUssTUFBTSxRQUFRLElBQUksU0FBUyxFQUFFO0VBQ3hDLFFBQVEsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDakQsUUFBUSxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUM7RUFDakMsc0JBQXNCLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtFQUN0RCxVQUFVLE1BQU0sUUFBUSxHQUFHLE9BQU87RUFDbEMsWUFBWSxRQUFRLENBQUMsR0FBRztFQUN4QixZQUFZLFNBQVMsQ0FBQyxJQUFJO0VBQzFCLFdBQVcsQ0FBQzs7RUFFWixVQUFVLElBQUksQ0FBQ1AsV0FBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFO0VBQzNFLFNBQVM7RUFDVCxPQUFPO0VBQ1AsTUFBTSxPQUFPLFNBQVMsQ0FBQztFQUN2QixLQUFLOztFQUVMLElBQUksT0FBTyxDQUFDLE9BQU87RUFDbkIsTUFBTSxvQkFBb0I7RUFDMUIsUUFBUSxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFO0VBQ3BDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHO0VBQ3BCLE9BQU87RUFDUCxNQUFNLFNBQVMsQ0FBQyxJQUFJO0VBQ3BCLEtBQUssQ0FBQyxDQUFDO0VBQ1AsR0FBRyxDQUFDOztFQUVKLEVBQUUsT0FBTyxDQUFDLENBQUMsaUJBQWlCLEVBQUU7RUFDOUIsSUFBSU0sTUFBRyxDQUFDLENBQUMsQ0FBQyxLQUFLO0VBQ2YsTUFBTSxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ3pELE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsT0FBTyxJQUFJLENBQUM7RUFDbEQsTUFBTSxNQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDeEMsTUFBTSxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUU7RUFDMUIsUUFBUUEsTUFBRyxDQUFDLFFBQVEsS0FBSztFQUN6QixVQUFVLFlBQVk7RUFDdEIsVUFBVSxTQUFTO0VBQ25CLFVBQVUsUUFBUTtFQUNsQixVQUFVLGFBQWEsRUFBRSxpQkFBaUI7RUFDMUMsWUFBWSxTQUFTO0VBQ3JCLFlBQVksUUFBUTtFQUNwQixZQUFZLFlBQVksQ0FBQyxNQUFNO0VBQy9CLFdBQVc7RUFDWCxTQUFTLENBQUMsQ0FBQztFQUNYLE9BQU8sQ0FBQyxDQUFDO0VBQ1QsS0FBSyxDQUFDO0VBQ04sSUFBSXlDLFVBQU87RUFDWCxJQUFJeEMsU0FBTSxDQUFDLFdBQVcsQ0FBQztFQUN2QixHQUFHLENBQUMsQ0FBQztFQUNMLENBQUMsQ0FBQzs7RUFFRixNQUFNLHFDQUFxQyxHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLEtBQUs7RUFDbkYsRUFBRSxNQUFNLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQ0EsU0FBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7RUFFN0QsRUFBRSxNQUFNLG9CQUFvQixHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQzFELElBQUlELE1BQUcsQ0FBQyxDQUFDLENBQUMsS0FBSztFQUNmLE1BQU0sTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDM0QsTUFBTSxRQUFRO0VBQ2QsUUFBUSxZQUFZO0VBQ3BCLFFBQVEsU0FBUyxFQUFFLENBQUMsQ0FBQyxTQUFTO0VBQzlCLFFBQVEsUUFBUSxFQUFFLENBQUMsQ0FBQyxRQUFRO0VBQzVCLFFBQVEsYUFBYSxFQUFFLGlCQUFpQjtFQUN4QyxVQUFVLENBQUMsQ0FBQyxTQUFTO0VBQ3JCLFVBQVUsQ0FBQyxDQUFDLFFBQVE7RUFDcEIsVUFBVSxZQUFZLENBQUMsTUFBTTtFQUM3QixTQUFTO0VBQ1QsT0FBTyxFQUFFO0VBQ1QsS0FBSyxDQUFDO0VBQ04sSUFBSUMsU0FBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQztFQUM1QyxHQUFHLENBQUMsQ0FBQzs7RUFFTCxFQUFFLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQzs7RUFFeEIsRUFBRSxLQUFLLE1BQU0sQ0FBQyxJQUFJLGtCQUFrQixFQUFFO0VBQ3RDLElBQUksTUFBTSxZQUFZLEdBQUcsMEJBQTBCLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUN6RSxJQUFJLE1BQU0sVUFBVSxHQUFHLGtDQUFrQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7O0VBRS9FLElBQUksVUFBVSxDQUFDLElBQUk7RUFDbkIsTUFBTSxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDO0VBQzNDLEtBQUssQ0FBQztFQUNOLElBQUksVUFBVSxDQUFDLElBQUk7RUFDbkIsTUFBTSxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDO0VBQ3pDLEtBQUssQ0FBQztFQUNOLEdBQUc7O0VBRUgsRUFBRSxPQUFPd0MsVUFBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0VBQzdCLENBQUMsQ0FBQzs7RUFFRixNQUFNLDRCQUE0QixHQUFHLHFDQUFxQyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztFQUVyRixNQUFNLDRCQUE0QixHQUFHLHFDQUFxQyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztFQUVyRixNQUFNLHVCQUF1QixHQUFHLENBQUMsWUFBWSxFQUFFLFNBQVMsRUFBRSxTQUFTLEtBQUs7RUFDeEUsRUFBRSxNQUFNLFVBQVUsR0FBRyxrQ0FBa0M7RUFDdkQsSUFBSSxZQUFZLEVBQUUsU0FBUztFQUMzQixHQUFHLENBQUM7RUFDSixFQUFFLE1BQU0sVUFBVSxHQUFHLGtDQUFrQztFQUN2RCxJQUFJLFlBQVksRUFBRSxTQUFTO0VBQzNCLEdBQUcsQ0FBQzs7RUFFSixFQUFFLE1BQU0sWUFBWSxHQUFHb0IsZUFBWTtFQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUTtFQUNuQixJQUFJLFVBQVUsRUFBRSxVQUFVO0VBQzFCLEdBQUcsQ0FBQzs7RUFFSixFQUFFLE1BQU0sZUFBZSxHQUFHQSxlQUFZO0VBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRO0VBQ25CLElBQUksVUFBVSxFQUFFLFVBQVU7RUFDMUIsR0FBRyxDQUFDOztFQUVKLEVBQUUsTUFBTSxVQUFVLEdBQUdDLGlCQUFjO0VBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRO0VBQ25CLElBQUksVUFBVSxFQUFFLFVBQVU7RUFDMUIsR0FBRyxDQUFDOztFQUVKLEVBQUUsT0FBTztFQUNULElBQUksWUFBWTtFQUNoQixJQUFJLGVBQWU7RUFDbkIsSUFBSSxVQUFVO0VBQ2QsR0FBRyxDQUFDO0VBQ0osQ0FBQyxDQUFDOztFQ2hWSyxNQUFNLE9BQU8sR0FBRyxPQUFPLEdBQUcsS0FBSztFQUN0QyxFQUFFLE1BQU0sSUFBSSxHQUFHLE1BQU0sa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDN0MsRUFBRSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPOztFQUU3QixFQUFFLElBQUk7RUFDTixJQUFJLE1BQU0sWUFBWSxHQUFHLE1BQU0sUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzdDLElBQUksSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtFQUNqQyxNQUFNLE1BQU0sbUJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7O0VBRW5ELE1BQU0sTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLFNBQVM7RUFDM0MsVUFBVSxZQUFZLENBQUMsU0FBUztFQUNoQyxVQUFVLG1CQUFtQixDQUFDOztFQUU5QixNQUFNLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUU7RUFDMUMsUUFBUTlELE1BQUcsQ0FBQyxDQUFDLElBQUksT0FBTztFQUN4QixVQUFVLE1BQU07RUFDaEIsVUFBVSxnQkFBZ0I7RUFDMUIsWUFBWSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxlQUFlO0VBQ3pDLFlBQVksQ0FBQyxDQUFDLFFBQVE7RUFDdEIsV0FBVztFQUNYLFNBQVMsQ0FBQztFQUNWLFFBQVFBLE1BQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztFQUNyQyxPQUFPLENBQUMsQ0FBQzs7RUFFVCxNQUFNLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztFQUNyQyxLQUFLO0VBQ0wsR0FBRyxTQUFTO0VBQ1osSUFBSSxNQUFNLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7RUFDakMsR0FBRztFQUNILENBQUMsQ0FBQzs7RUFFRixNQUFNLGtCQUFrQixHQUFHLE1BQU0sR0FBRyxJQUFJLE1BQU0sT0FBTztFQUNyRCxFQUFFLEdBQUcsRUFBRSxhQUFhO0VBQ3BCLEVBQUUsbUJBQW1CLEVBQUUsY0FBYztFQUNyQyxDQUFDLENBQUM7O0FDcENVLFFBQUMsY0FBYyxHQUFHLE9BQU8sU0FBUyxFQUFFLHFCQUFxQixFQUFFLFlBQVksS0FBSztFQUN4RixFQUFFLE1BQU0sU0FBUyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztFQUM3QyxFQUFFLE1BQU0sU0FBUyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDOztFQUV2RSxFQUFFLE1BQU0seUJBQXlCLENBQUMsU0FBUyxFQUFFLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQzlFLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQyxTQUFTLEVBQUUscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7O0VBRTFFLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQyxTQUFTLEVBQUUscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7O0VBRWhGLEVBQUUsTUFBTSxTQUFTLENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUM7O0VBRXBELEVBQUUsTUFBTSxTQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDOztFQUU1QyxFQUFFLE1BQU0sU0FBUyxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUM7O0VBRWxELEVBQUUsTUFBTSxTQUFTLENBQUMsVUFBVTtFQUM1QixJQUFJLGtCQUFrQjtFQUN0QixJQUFJLFlBQVksR0FBRyxZQUFZLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQzlELENBQUMsQ0FBQzs7RUFFRixNQUFNLHFCQUFxQixHQUFHLE9BQU8sU0FBUyxFQUFFLFNBQVMsS0FBSztFQUM5RCxFQUFFLE1BQU0sYUFBYSxHQUFHLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ3pELEVBQUUsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDLGFBQWEsRUFBRTtFQUN6QyxJQUFJQyxTQUFNLENBQUMsYUFBYSxDQUFDO0VBQ3pCLEdBQUcsQ0FBQyxDQUFDOztFQUVMLEVBQUUsS0FBSyxNQUFNLEtBQUssSUFBSSxhQUFhLEVBQUU7RUFDckMsSUFBSSxJQUFJLENBQUMsTUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxlQUFlLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFO0VBQ2xHLEdBQUc7RUFDSCxDQUFDLENBQUM7O0VBRUYsTUFBTSwyQkFBMkIsR0FBRyxPQUFPLFNBQVMsRUFBRSxRQUFRLEtBQUs7RUFDbkUsRUFBRSxNQUFNLGFBQWEsR0FBRyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUN4RCxFQUFFLE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBQyxhQUFhLEVBQUU7RUFDekMsSUFBSUEsU0FBTSxDQUFDLGNBQWMsQ0FBQztFQUMxQixHQUFHLENBQUMsQ0FBQzs7RUFFTDtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsQ0FBQyxDQUFDOztBQ3ZEVSxRQUFDLGtCQUFrQixHQUFHLGVBQWUsS0FBSztFQUN0RCxFQUFFLG1CQUFtQixFQUFFLG1CQUFtQixDQUFDLGVBQWUsQ0FBQztFQUMzRCxFQUFFLHFCQUFxQixFQUFFLHFCQUFxQixDQUFDLGVBQWUsQ0FBQztFQUMvRCxFQUFFLHVCQUF1QixFQUFFLGVBQWUsQ0FBQyx1QkFBdUI7RUFDbEUsRUFBRSxxQkFBcUIsRUFBRSx3QkFBd0IsQ0FBQyxlQUFlLENBQUM7RUFDbEUsRUFBRSwwQkFBMEIsRUFBRSwwQkFBMEIsQ0FBQyxlQUFlLENBQUM7RUFDekUsQ0FBQyxDQUFDLENBQUM7O0VBRUgsTUFBTSx3QkFBd0IsR0FBRyxlQUFlLElBQUksZUFBZSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDOztFQUVqRyxNQUFNLDBCQUEwQixHQUFHLGVBQWUsSUFBSSxDQUFDLGFBQWEsRUFBRSxVQUFVLEtBQUssZUFBZSxDQUFDLGtCQUFrQjtFQUN2SCxFQUFFLGFBQWEsRUFBRSxVQUFVO0VBQzNCLENBQUMsQ0FBQzs7RUFFRixNQUFNLG1CQUFtQixHQUFHLGVBQWUsSUFBSSxZQUFZLE1BQU0sZUFBZSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7RUFFekcsTUFBTSxxQkFBcUIsR0FBRyxlQUFlLElBQUksT0FBTyxhQUFhLEVBQUUsVUFBVSxLQUFLO0VBQ3RGLEVBQUUsSUFBSSxTQUFTLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUMsRUFBRTtFQUM3RixFQUFFLElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDLEVBQUU7O0VBRXZGLEVBQUUsT0FBTyxNQUFNLGVBQWUsQ0FBQyxhQUFhO0VBQzVDLElBQUksYUFBYTtFQUNqQixJQUFJLFVBQVU7RUFDZCxHQUFHLENBQUM7RUFDSixDQUFDLENBQUM7O0FDVlUsUUFBQyxVQUFVLEdBQUcsT0FBTyxLQUFLLEVBQUUsZ0JBQWdCLEdBQUcsSUFBSTtFQUMvRCxnQ0FBZ0MsbUJBQW1CLEdBQUcsSUFBSTtFQUMxRCxnQ0FBZ0MsWUFBWSxHQUFHLElBQUk7RUFDbkQsZ0NBQWdDLE1BQU0sR0FBRyxJQUFJO0VBQzdDLGdDQUFnQyxhQUFhLEdBQUcsSUFBSSxLQUFLOztFQUV6RCxJQUFJLEtBQUssR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7O0VBRWxDLElBQUksR0FBRyxDQUFDLGFBQWE7RUFDckIsUUFBUSxhQUFhLEdBQUcsTUFBTSx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDOztFQUVoRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0I7RUFDeEIsUUFBUSxnQkFBZ0IsR0FBRyxNQUFNLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDOztFQUU1RCxJQUFJLE1BQU0sZUFBZSxHQUFHLHFCQUFxQixFQUFFLENBQUM7O0VBRXBELElBQUksTUFBTSxHQUFHLEdBQUc7RUFDaEIsUUFBUSxTQUFTLENBQUMsS0FBSztFQUN2QixRQUFRLE1BQU07RUFDZCxRQUFRLE9BQU8sQ0FBQyxlQUFlLENBQUMsT0FBTztFQUN2QyxRQUFRLFNBQVMsQ0FBQyxhQUFhLENBQUMsU0FBUztFQUN6QyxRQUFRLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTztFQUNyQyxLQUFLLENBQUM7O0VBRU4sSUFBSSxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7O0VBRTVDLElBQUksR0FBRyxDQUFDLG1CQUFtQixHQUFHLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQztFQUM5RCxnQ0FBZ0MsbUJBQW1CO0VBQ25ELGdDQUFnQyxZQUFZLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztFQUUvRCxJQUFJLEdBQUcsQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQztFQUNoRCx5QkFBeUIsWUFBWTtFQUNyQyx5QkFBeUIsWUFBWSxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUM7O0VBRTVELElBQUksTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ3hDLElBQUksTUFBTSxhQUFhLEdBQUcsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDaEQsSUFBSSxNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDdEMsSUFBSSxNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDcEMsSUFBSSxNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7O0VBRTFDLElBQUksTUFBTSxjQUFjLEdBQUcsT0FBTyxRQUFRLEVBQUUsUUFBUSxLQUFLO0VBQ3pELFFBQVEsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLE9BQU8sQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0VBQ2xFLEtBQUssQ0FBQzs7RUFFTixJQUFJLE1BQU0sY0FBYyxHQUFHLE1BQU07RUFDakMsUUFBUSxHQUFHLENBQUMsSUFBSSxHQUFHO0VBQ25CLFlBQVksSUFBSSxFQUFFLEtBQUs7RUFDdkIsWUFBWSxXQUFXLEdBQUcsdUJBQXVCLENBQUMsR0FBRyxDQUFDO0VBQ3RELFlBQVksTUFBTSxDQUFDLEtBQUs7RUFDeEIsWUFBWSxJQUFJLENBQUMsS0FBSztFQUN0QixVQUFTO0VBQ1QsS0FBSyxDQUFDOztFQUVOLElBQUksTUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFJLEtBQUs7RUFDN0IsUUFBUSxHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUk7RUFDdkIsS0FBSyxDQUFDOztFQUVOOztFQUVBLElBQUksSUFBSSxJQUFJLEdBQUc7RUFDZixRQUFRLFNBQVM7RUFDakIsUUFBUSxXQUFXO0VBQ25CLFFBQVEsYUFBYTtFQUNyQixRQUFRLFFBQVE7RUFDaEIsUUFBUSxPQUFPO0VBQ2YsUUFBUSxVQUFVO0VBQ2xCLFFBQVEsU0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTO0VBQzVDLFFBQVEsY0FBYztFQUN0QixRQUFRLGNBQWM7RUFDdEIsUUFBUSxNQUFNO0VBQ2QsS0FBSyxDQUFDOztFQUVOLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxpQkFBaUI7RUFDcEMsUUFBUSxlQUFlLENBQUMsU0FBUztFQUNqQyxRQUFRLGdCQUFnQjtFQUN4QixRQUFRLGFBQWEsQ0FBQyxPQUFPO0VBQzdCLFFBQVEsYUFBYSxDQUFDLFFBQVE7RUFDOUIsUUFBUSxJQUFJLENBQUMsQ0FBQzs7O0VBR2QsSUFBSSxPQUFPLElBQUksQ0FBQztFQUNoQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
