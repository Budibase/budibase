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
  const splitByKeySep = str => fp.split(keySep)(str);
  const safeKey = key => _.replace(`${keySep}${trimKeySep(key)}`, `${keySep}${keySep}`, keySep);
  const joinKey = (...strs) => {
    const paramsOrArray = strs.length === 1 & fp.isArray(strs[0])
      ? strs[0] : strs;
    return safeKey(fp.join(keySep)(paramsOrArray));
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
      fp.filter(isSingleRecord),
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

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVkaWJhc2UtY29yZS51bWQuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21tb24vZXZlbnRzLmpzIiwiLi4vc3JjL2NvbW1vbi9lcnJvcnMuanMiLCIuLi9zcmMvY29tbW9uL2FwaVdyYXBwZXIuanMiLCIuLi9zcmMvY29tbW9uL2xvY2suanMiLCIuLi9zcmMvY29tbW9uL2luZGV4LmpzIiwiLi4vc3JjL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uLmpzIiwiLi4vc3JjL2luZGV4aW5nL2V2YWx1YXRlLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2luZGV4ZXMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvaGllcmFyY2h5LmpzIiwiLi4vc3JjL3R5cGVzL3R5cGVIZWxwZXJzLmpzIiwiLi4vc3JjL3R5cGVzL3N0cmluZy5qcyIsIi4uL3NyYy90eXBlcy9ib29sLmpzIiwiLi4vc3JjL3R5cGVzL251bWJlci5qcyIsIi4uL3NyYy90eXBlcy9kYXRldGltZS5qcyIsIi4uL3NyYy90eXBlcy9hcnJheS5qcyIsIi4uL3NyYy90eXBlcy9yZWZlcmVuY2UuanMiLCIuLi9zcmMvdHlwZXMvZmlsZS5qcyIsIi4uL3NyYy90eXBlcy9pbmRleC5qcyIsIi4uL3NyYy9hdXRoQXBpL2F1dGhDb21tb24uanMiLCIuLi9zcmMvYXV0aEFwaS9pc0F1dGhvcml6ZWQuanMiLCIuLi9zcmMvYXV0aEFwaS9wZXJtaXNzaW9ucy5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZ2V0TmV3LmpzIiwiLi4vc3JjL3JlY29yZEFwaS9sb2FkLmpzIiwiLi4vc3JjL2luZGV4aW5nL3Byb21pc2VSZWFkYWJsZVN0cmVhbS5qcyIsIi4uL3NyYy9pbmRleGluZy9zaGFyZGluZy5qcyIsIi4uL3NyYy9pbmRleGluZy9pbmRleFNjaGVtYUNyZWF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvcm9sbHVwLXBsdWdpbi1ub2RlLWdsb2JhbHMvc3JjL2dsb2JhbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9idWZmZXItZXM2L2Jhc2U2NC5qcyIsIi4uL25vZGVfbW9kdWxlcy9idWZmZXItZXM2L2llZWU3NTQuanMiLCIuLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVzNi9pc0FycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2J1ZmZlci1lczYvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvcm9sbHVwLXBsdWdpbi1ub2RlLWJ1aWx0aW5zL3NyYy9lczYvc3RyaW5nLWRlY29kZXIuanMiLCIuLi9zcmMvaW5kZXhpbmcvc2VyaWFsaXplci5qcyIsIi4uL3NyYy9pbmRleGluZy9yZWFkLmpzIiwiLi4vc3JjL2luZGV4QXBpL2xpc3RJdGVtcy5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZ2V0Q29udGV4dC5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvdmFsaWRhdGUuanMiLCIuLi9zcmMvY29sbGVjdGlvbkFwaS9pbml0aWFsaXNlLmpzIiwiLi4vc3JjL2luZGV4aW5nL2FsbElkcy5qcyIsIi4uL3NyYy90cmFuc2FjdGlvbnMvdHJhbnNhY3Rpb25zQ29tbW9uLmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9jcmVhdGUuanMiLCIuLi9zcmMvaW5kZXhpbmcvaW5pdGlhbGlzZUluZGV4LmpzIiwiLi4vc3JjL3JlY29yZEFwaS9zYXZlLmpzIiwiLi4vc3JjL2NvbGxlY3Rpb25BcGkvZGVsZXRlLmpzIiwiLi4vc3JjL2luZGV4QXBpL2RlbGV0ZS5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZGVsZXRlLmpzIiwiLi4vc3JjL3JlY29yZEFwaS91cGxvYWRGaWxlLmpzIiwiLi4vc3JjL3JlY29yZEFwaS9kb3dubG9hZEZpbGUuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2N1c3RvbUlkLmpzIiwiLi4vc3JjL3JlY29yZEFwaS9pbmRleC5qcyIsIi4uL3NyYy9jb2xsZWN0aW9uQXBpL2dldEFsbG93ZWRSZWNvcmRUeXBlcy5qcyIsIi4uL3NyYy9jb2xsZWN0aW9uQXBpL2luZGV4LmpzIiwiLi4vc3JjL2luZGV4QXBpL2J1aWxkSW5kZXguanMiLCIuLi9zcmMvaW5kZXhBcGkvYWdncmVnYXRlcy5qcyIsIi4uL3NyYy9pbmRleEFwaS9pbmRleC5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9jcmVhdGVOb2Rlcy5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9maWVsZHMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvcmVjb3JkVmFsaWRhdGlvblJ1bGVzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2NyZWF0ZUFjdGlvbnMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvdmFsaWRhdGVBZ2dyZWdhdGUuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvdmFsaWRhdGUuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL3NhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeS5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9zYXZlQWN0aW9uc0FuZFRyaWdnZXJzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2dldEJlaGF2aW91clNvdXJjZXMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvaW5kZXguanMiLCIuLi9zcmMvYXV0aEFwaS9nZXRVc2Vycy5qcyIsIi4uL3NyYy9hdXRoQXBpL2xvYWRBY2Nlc3NMZXZlbHMuanMiLCIuLi9zcmMvYXV0aEFwaS9hdXRoZW50aWNhdGUuanMiLCIuLi9zcmMvYXV0aEFwaS9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MuanMiLCIuLi9zcmMvYXV0aEFwaS92YWxpZGF0ZVVzZXIuanMiLCIuLi9zcmMvYXV0aEFwaS9nZXROZXdVc2VyLmpzIiwiLi4vc3JjL2F1dGhBcGkvc2V0UGFzc3dvcmQuanMiLCIuLi9zcmMvYXV0aEFwaS9jcmVhdGVVc2VyLmpzIiwiLi4vc3JjL2F1dGhBcGkvZW5hYmxlVXNlci5qcyIsIi4uL3NyYy9hdXRoQXBpL2dldE5ld0FjY2Vzc0xldmVsLmpzIiwiLi4vc3JjL2F1dGhBcGkvdmFsaWRhdGVBY2Nlc3NMZXZlbHMuanMiLCIuLi9zcmMvYXV0aEFwaS9zYXZlQWNjZXNzTGV2ZWxzLmpzIiwiLi4vc3JjL2F1dGhBcGkvZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMuanMiLCIuLi9zcmMvYXV0aEFwaS9zZXRVc2VyQWNjZXNzTGV2ZWxzLmpzIiwiLi4vc3JjL2F1dGhBcGkvaW5kZXguanMiLCIuLi9zcmMvYWN0aW9uc0FwaS9leGVjdXRlLmpzIiwiLi4vc3JjL2FjdGlvbnNBcGkvaW5kZXguanMiLCIuLi9zcmMvYXBwSW5pdGlhbGlzZS9ldmVudEFnZ3JlZ2F0b3IuanMiLCIuLi9zcmMvYXBwSW5pdGlhbGlzZS9pbmRleC5qcyIsIi4uL3NyYy9jb21tb24vY29tcGlsZUNvZGUuanMiLCIuLi9zcmMvYWN0aW9uc0FwaS9pbml0aWFsaXNlLmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9yZXRyaWV2ZS5qcyIsIi4uL3NyYy9pbmRleGluZy9yZWxldmFudC5qcyIsIi4uL3NyYy9pbmRleGluZy9wcm9taXNlV3JpdGFibGVTdHJlYW0uanMiLCIuLi9zcmMvaW5kZXhpbmcvYXBwbHkuanMiLCIuLi9zcmMvdHJhbnNhY3Rpb25zL2V4ZWN1dGUuanMiLCIuLi9zcmMvdHJhbnNhY3Rpb25zL2NsZWFudXAuanMiLCIuLi9zcmMvYXBwSW5pdGlhbGlzZS9pbml0aWFsaXNlRGF0YS5qcyIsIi4uL3NyYy9hcHBJbml0aWFsaXNlL2RhdGFiYXNlTWFuYWdlci5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1bmlvbiwgcmVkdWNlIH0gZnJvbSAnbG9kYXNoL2ZwJztcblxuY29uc3QgY29tbW9uUGx1cyA9IGV4dHJhID0+IHVuaW9uKFsnb25CZWdpbicsICdvbkNvbXBsZXRlJywgJ29uRXJyb3InXSkoZXh0cmEpO1xuXG5jb25zdCBjb21tb24gPSAoKSA9PiBjb21tb25QbHVzKFtdKTtcblxuY29uc3QgX2V2ZW50cyA9IHtcbiAgcmVjb3JkQXBpOiB7XG4gICAgc2F2ZTogY29tbW9uUGx1cyhbXG4gICAgICAnb25JbnZhbGlkJyxcbiAgICAgICdvblJlY29yZFVwZGF0ZWQnLFxuICAgICAgJ29uUmVjb3JkQ3JlYXRlZCddKSxcbiAgICBkZWxldGU6IGNvbW1vbigpLFxuICAgIGdldENvbnRleHQ6IGNvbW1vbigpLFxuICAgIGdldE5ldzogY29tbW9uKCksXG4gICAgbG9hZDogY29tbW9uKCksXG4gICAgdmFsaWRhdGU6IGNvbW1vbigpLFxuICAgIHVwbG9hZEZpbGU6IGNvbW1vbigpLFxuICAgIGRvd25sb2FkRmlsZTogY29tbW9uKCksXG4gIH0sXG4gIGluZGV4QXBpOiB7XG4gICAgYnVpbGRJbmRleDogY29tbW9uKCksXG4gICAgbGlzdEl0ZW1zOiBjb21tb24oKSxcbiAgICBkZWxldGU6IGNvbW1vbigpLFxuICAgIGFnZ3JlZ2F0ZXM6IGNvbW1vbigpLFxuICB9LFxuICBjb2xsZWN0aW9uQXBpOiB7XG4gICAgZ2V0QWxsb3dlZFJlY29yZFR5cGVzOiBjb21tb24oKSxcbiAgICBpbml0aWFsaXNlOiBjb21tb24oKSxcbiAgICBkZWxldGU6IGNvbW1vbigpLFxuICB9LFxuICBhdXRoQXBpOiB7XG4gICAgYXV0aGVudGljYXRlOiBjb21tb24oKSxcbiAgICBhdXRoZW50aWNhdGVUZW1wb3JhcnlBY2Nlc3M6IGNvbW1vbigpLFxuICAgIGNyZWF0ZVRlbXBvcmFyeUFjY2VzczogY29tbW9uKCksXG4gICAgY3JlYXRlVXNlcjogY29tbW9uKCksXG4gICAgZW5hYmxlVXNlcjogY29tbW9uKCksXG4gICAgZGlzYWJsZVVzZXI6IGNvbW1vbigpLFxuICAgIGxvYWRBY2Nlc3NMZXZlbHM6IGNvbW1vbigpLFxuICAgIGdldE5ld0FjY2Vzc0xldmVsOiBjb21tb24oKSxcbiAgICBnZXROZXdVc2VyOiBjb21tb24oKSxcbiAgICBnZXROZXdVc2VyQXV0aDogY29tbW9uKCksXG4gICAgZ2V0VXNlcnM6IGNvbW1vbigpLFxuICAgIHNhdmVBY2Nlc3NMZXZlbHM6IGNvbW1vbigpLFxuICAgIGlzQXV0aG9yaXplZDogY29tbW9uKCksXG4gICAgY2hhbmdlTXlQYXNzd29yZDogY29tbW9uKCksXG4gICAgc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZTogY29tbW9uKCksXG4gICAgc2NvcmVQYXNzd29yZDogY29tbW9uKCksXG4gICAgaXNWYWxpZFBhc3N3b3JkOiBjb21tb24oKSxcbiAgICB2YWxpZGF0ZVVzZXI6IGNvbW1vbigpLFxuICAgIHZhbGlkYXRlQWNjZXNzTGV2ZWxzOiBjb21tb24oKSxcbiAgICBzZXRVc2VyQWNjZXNzTGV2ZWxzOiBjb21tb24oKSxcbiAgfSxcbiAgdGVtcGxhdGVBcGk6IHtcbiAgICBzYXZlQXBwbGljYXRpb25IaWVyYXJjaHk6IGNvbW1vbigpLFxuICAgIHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnM6IGNvbW1vbigpLFxuICB9LFxuICBhY3Rpb25zQXBpOiB7XG4gICAgZXhlY3V0ZTogY29tbW9uKCksXG4gIH0sXG59O1xuXG5jb25zdCBfZXZlbnRzTGlzdCA9IFtdO1xuXG5jb25zdCBtYWtlRXZlbnQgPSAoYXJlYSwgbWV0aG9kLCBuYW1lKSA9PiBgJHthcmVhfToke21ldGhvZH06JHtuYW1lfWA7XG5cbmZvciAoY29uc3QgYXJlYUtleSBpbiBfZXZlbnRzKSB7XG4gIGZvciAoY29uc3QgbWV0aG9kS2V5IGluIF9ldmVudHNbYXJlYUtleV0pIHtcbiAgICBfZXZlbnRzW2FyZWFLZXldW21ldGhvZEtleV0gPSByZWR1Y2UoKG9iaiwgcykgPT4ge1xuICAgICAgb2JqW3NdID0gbWFrZUV2ZW50KGFyZWFLZXksIG1ldGhvZEtleSwgcyk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0sXG4gICAge30pKF9ldmVudHNbYXJlYUtleV1bbWV0aG9kS2V5XSk7XG4gIH1cbn1cblxuXG5mb3IgKGNvbnN0IGFyZWFLZXkgaW4gX2V2ZW50cykge1xuICBmb3IgKGNvbnN0IG1ldGhvZEtleSBpbiBfZXZlbnRzW2FyZWFLZXldKSB7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIF9ldmVudHNbYXJlYUtleV1bbWV0aG9kS2V5XSkge1xuICAgICAgX2V2ZW50c0xpc3QucHVzaChcbiAgICAgICAgX2V2ZW50c1thcmVhS2V5XVttZXRob2RLZXldW25hbWVdLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuXG5leHBvcnQgY29uc3QgZXZlbnRzID0gX2V2ZW50cztcblxuZXhwb3J0IGNvbnN0IGV2ZW50c0xpc3QgPSBfZXZlbnRzTGlzdDtcblxuZXhwb3J0IGRlZmF1bHQgeyBldmVudHM6IF9ldmVudHMsIGV2ZW50c0xpc3Q6IF9ldmVudHNMaXN0IH07XG4iLCJleHBvcnQgY2xhc3MgQmFkUmVxdWVzdEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDA7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5hdXRob3Jpc2VkRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDQwMTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGb3JiaWRkZW5FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmh0dHBTdGF0dXNDb2RlID0gNDAzO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5vdEZvdW5kRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDQwNDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb25mbGljdEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDk7XG4gICAgfVxufSIsImltcG9ydCB7IGNsb25lRGVlcCwgaXNVbmRlZmluZWQgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcbmltcG9ydCB7IFVuYXV0aG9yaXNlZEVycm9yIH0gZnJvbSAnLi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgYXBpV3JhcHBlciA9IGFzeW5jIChhcHAsIGV2ZW50TmFtZXNwYWNlLCBpc0F1dGhvcml6ZWQsIGV2ZW50Q29udGV4dCwgZnVuYywgLi4ucGFyYW1zKSA9PiB7XG4gIHB1c2hDYWxsU3RhY2soYXBwLCBldmVudE5hbWVzcGFjZSk7XG5cbiAgaWYgKCFpc0F1dGhvcml6ZWQoYXBwKSkge1xuICAgIGhhbmRsZU5vdEF1dGhvcml6ZWQoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzdGFydERhdGUgPSBEYXRlLm5vdygpO1xuICBjb25zdCBlbGFwc2VkID0gKCkgPT4gKERhdGUubm93KCkgLSBzdGFydERhdGUpO1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgYXBwLnB1Ymxpc2goXG4gICAgICBldmVudE5hbWVzcGFjZS5vbkJlZ2luLFxuICAgICAgZXZlbnRDb250ZXh0LFxuICAgICk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBmdW5jKC4uLnBhcmFtcyk7XG5cbiAgICBhd2FpdCBwdWJsaXNoQ29tcGxldGUoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgYXdhaXQgcHVibGlzaEVycm9yKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgYXBpV3JhcHBlclN5bmMgPSAoYXBwLCBldmVudE5hbWVzcGFjZSwgaXNBdXRob3JpemVkLCBldmVudENvbnRleHQsIGZ1bmMsIC4uLnBhcmFtcykgPT4ge1xuICBwdXNoQ2FsbFN0YWNrKGFwcCwgZXZlbnROYW1lc3BhY2UpO1xuXG4gIGlmICghaXNBdXRob3JpemVkKGFwcCkpIHtcbiAgICBoYW5kbGVOb3RBdXRob3JpemVkKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgc3RhcnREYXRlID0gRGF0ZS5ub3coKTtcbiAgY29uc3QgZWxhcHNlZCA9ICgpID0+IChEYXRlLm5vdygpIC0gc3RhcnREYXRlKTtcblxuICB0cnkge1xuICAgIGFwcC5wdWJsaXNoKFxuICAgICAgZXZlbnROYW1lc3BhY2Uub25CZWdpbixcbiAgICAgIGV2ZW50Q29udGV4dCxcbiAgICApO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gZnVuYyguLi5wYXJhbXMpO1xuXG4gICAgcHVibGlzaENvbXBsZXRlKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHB1Ymxpc2hFcnJvcihhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIGVycm9yKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxuY29uc3QgaGFuZGxlTm90QXV0aG9yaXplZCA9IChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UpID0+IHtcbiAgY29uc3QgZXJyID0gbmV3IFVuYXV0aG9yaXNlZEVycm9yKGBVbmF1dGhvcml6ZWQ6ICR7ZXZlbnROYW1lc3BhY2V9YCk7XG4gIHB1Ymxpc2hFcnJvcihhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsICgpID0+IDAsIGVycik7XG4gIHRocm93IGVycjtcbn07XG5cbmNvbnN0IHB1c2hDYWxsU3RhY2sgPSAoYXBwLCBldmVudE5hbWVzcGFjZSwgc2VlZENhbGxJZCkgPT4ge1xuICBjb25zdCBjYWxsSWQgPSBnZW5lcmF0ZSgpO1xuXG4gIGNvbnN0IGNyZWF0ZUNhbGxTdGFjayA9ICgpID0+ICh7XG4gICAgc2VlZENhbGxJZDogIWlzVW5kZWZpbmVkKHNlZWRDYWxsSWQpXG4gICAgICA/IHNlZWRDYWxsSWRcbiAgICAgIDogY2FsbElkLFxuICAgIHRocmVhZENhbGxJZDogY2FsbElkLFxuICAgIHN0YWNrOiBbXSxcbiAgfSk7XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGFwcC5jYWxscykpIHtcbiAgICBhcHAuY2FsbHMgPSBjcmVhdGVDYWxsU3RhY2soKTtcbiAgfVxuXG4gIGFwcC5jYWxscy5zdGFjay5wdXNoKHtcbiAgICBuYW1lc3BhY2U6IGV2ZW50TmFtZXNwYWNlLFxuICAgIGNhbGxJZCxcbiAgfSk7XG59O1xuXG5jb25zdCBwb3BDYWxsU3RhY2sgPSAoYXBwKSA9PiB7XG4gIGFwcC5jYWxscy5zdGFjay5wb3AoKTtcbiAgaWYgKGFwcC5jYWxscy5zdGFjay5sZW5ndGggPT09IDApIHtcbiAgICBkZWxldGUgYXBwLmNhbGxzO1xuICB9XG59O1xuXG5jb25zdCBwdWJsaXNoRXJyb3IgPSBhc3luYyAoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCBlcnIpID0+IHtcbiAgY29uc3QgY3R4ID0gY2xvbmVEZWVwKGV2ZW50Q29udGV4dCk7XG4gIGN0eC5lcnJvciA9IGVycjtcbiAgY3R4LmVsYXBzZWQgPSBlbGFwc2VkKCk7XG4gIGF3YWl0IGFwcC5wdWJsaXNoKFxuICAgIGV2ZW50TmFtZXNwYWNlLm9uRXJyb3IsXG4gICAgY3R4LFxuICApO1xuICBwb3BDYWxsU3RhY2soYXBwKTtcbn07XG5cbmNvbnN0IHB1Ymxpc2hDb21wbGV0ZSA9IGFzeW5jIChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIHJlc3VsdCkgPT4ge1xuICBjb25zdCBlbmRjb250ZXh0ID0gY2xvbmVEZWVwKGV2ZW50Q29udGV4dCk7XG4gIGVuZGNvbnRleHQucmVzdWx0ID0gcmVzdWx0O1xuICBlbmRjb250ZXh0LmVsYXBzZWQgPSBlbGFwc2VkKCk7XG4gIGF3YWl0IGFwcC5wdWJsaXNoKFxuICAgIGV2ZW50TmFtZXNwYWNlLm9uQ29tcGxldGUsXG4gICAgZW5kY29udGV4dCxcbiAgKTtcbiAgcG9wQ2FsbFN0YWNrKGFwcCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhcGlXcmFwcGVyO1xuIiwiaW1wb3J0IHsgc3BsaXQgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgJCB9IGZyb20gJy4vaW5kZXgnO1xuXG5jb25zdCBsb2NrT3ZlcmxhcE1pbGxpc2Vjb25kcyA9IDEwO1xuXG5leHBvcnQgY29uc3QgZ2V0TG9jayA9IGFzeW5jIChhcHAsIGxvY2tGaWxlLCB0aW1lb3V0TWlsbGlzZWNvbmRzLCBtYXhMb2NrUmV0cmllcywgcmV0cnlDb3VudCA9IDApID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB0aW1lb3V0ID0gKGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKSlcbiAgICAgICAgICAgICsgdGltZW91dE1pbGxpc2Vjb25kcztcblxuICAgIGNvbnN0IGxvY2sgPSB7XG4gICAgICB0aW1lb3V0LFxuICAgICAga2V5OiBsb2NrRmlsZSxcbiAgICAgIHRvdGFsVGltZW91dDogdGltZW91dE1pbGxpc2Vjb25kcyxcbiAgICB9O1xuXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVGaWxlKFxuICAgICAgbG9ja0ZpbGUsXG4gICAgICBnZXRMb2NrRmlsZUNvbnRlbnQoXG4gICAgICAgIGxvY2sudG90YWxUaW1lb3V0LFxuICAgICAgICBsb2NrLnRpbWVvdXQsXG4gICAgICApLFxuICAgICk7XG5cbiAgICByZXR1cm4gbG9jaztcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChyZXRyeUNvdW50ID09IG1heExvY2tSZXRyaWVzKSB7IHJldHVybiBOT19MT0NLOyB9XG5cbiAgICBjb25zdCBsb2NrID0gcGFyc2VMb2NrRmlsZUNvbnRlbnQoXG4gICAgICBsb2NrRmlsZSxcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEZpbGUobG9ja0ZpbGUpLFxuICAgICk7XG5cbiAgICBjb25zdCBjdXJyZW50RXBvY2hUaW1lID0gYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpO1xuXG4gICAgaWYgKGN1cnJlbnRFcG9jaFRpbWUgPCBsb2NrLnRpbWVvdXQpIHtcbiAgICAgIHJldHVybiBOT19MT0NLO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUobG9ja0ZpbGUpO1xuICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgIC8vZW1wdHlcbiAgICB9XG5cbiAgICBhd2FpdCBzbGVlcEZvclJldHJ5KCk7XG5cbiAgICByZXR1cm4gYXdhaXQgZ2V0TG9jayhcbiAgICAgIGFwcCwgbG9ja0ZpbGUsIHRpbWVvdXRNaWxsaXNlY29uZHMsXG4gICAgICBtYXhMb2NrUmV0cmllcywgcmV0cnlDb3VudCArIDEsXG4gICAgKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGdldExvY2tGaWxlQ29udGVudCA9ICh0b3RhbFRpbWVvdXQsIGVwb2NoVGltZSkgPT4gYCR7dG90YWxUaW1lb3V0fToke2Vwb2NoVGltZS50b1N0cmluZygpfWA7XG5cbmNvbnN0IHBhcnNlTG9ja0ZpbGVDb250ZW50ID0gKGtleSwgY29udGVudCkgPT4gJChjb250ZW50LCBbXG4gIHNwbGl0KCc6JyksXG4gIHBhcnRzID0+ICh7XG4gICAgdG90YWxUaW1lb3V0OiBuZXcgTnVtYmVyKHBhcnRzWzBdKSxcbiAgICB0aW1lb3V0OiBuZXcgTnVtYmVyKHBhcnRzWzFdKSxcbiAgICBrZXksXG4gIH0pLFxuXSk7XG5cbmV4cG9ydCBjb25zdCByZWxlYXNlTG9jayA9IGFzeW5jIChhcHAsIGxvY2spID0+IHtcbiAgY29uc3QgY3VycmVudEVwb2NoVGltZSA9IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKTtcbiAgLy8gb25seSByZWxlYXNlIGlmIG5vdCB0aW1lZG91dFxuICBpZiAoY3VycmVudEVwb2NoVGltZSA8IChsb2NrLnRpbWVvdXQgLSBsb2NrT3ZlcmxhcE1pbGxpc2Vjb25kcykpIHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKGxvY2sua2V5KTtcbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICAvL2VtcHR5XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZXh0ZW5kTG9jayA9IGFzeW5jIChhcHAsIGxvY2spID0+IHtcbiAgY29uc3QgY3VycmVudEVwb2NoVGltZSA9IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKTtcbiAgLy8gb25seSByZWxlYXNlIGlmIG5vdCB0aW1lZG91dFxuICBpZiAoY3VycmVudEVwb2NoVGltZSA8IChsb2NrLnRpbWVvdXQgLSBsb2NrT3ZlcmxhcE1pbGxpc2Vjb25kcykpIHtcbiAgICB0cnkge1xuICAgICAgbG9jay50aW1lb3V0ID0gY3VycmVudEVwb2NoVGltZSArIGxvY2sudGltZW91dE1pbGxpc2Vjb25kcztcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlRmlsZShcbiAgICAgICAgbG9jay5rZXksXG4gICAgICAgIGdldExvY2tGaWxlQ29udGVudChsb2NrLnRvdGFsVGltZW91dCwgbG9jay50aW1lb3V0KSxcbiAgICAgICk7XG4gICAgICByZXR1cm4gbG9jaztcbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICAvL2VtcHR5XG4gICAgfVxuICB9XG4gIHJldHVybiBOT19MT0NLO1xufTtcblxuZXhwb3J0IGNvbnN0IE5PX0xPQ0sgPSAnbm8gbG9jayc7XG5leHBvcnQgY29uc3QgaXNOb2xvY2sgPSBpZCA9PiBpZCA9PT0gTk9fTE9DSztcblxuY29uc3Qgc2xlZXBGb3JSZXRyeSA9ICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBsb2NrT3ZlcmxhcE1pbGxpc2Vjb25kcykpO1xuIiwiaW1wb3J0IHtcbiAgXG4gIGhlYWQsIFxuICB0YWlsLCBmaW5kSW5kZXgsIHN0YXJ0c1dpdGgsIFxuICBkcm9wUmlnaHQsIGZsb3csIHRha2VSaWdodCwgdHJpbSxcbiAgcmVwbGFjZVxuICBcbn0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IFxuICBzb21lLCByZWR1Y2UsIGlzRW1wdHksIGlzQXJyYXksIGpvaW4sXG4gIGlzU3RyaW5nLCBpc0ludGVnZXIsIGlzRGF0ZSwgdG9OdW1iZXIsXG4gIGlzVW5kZWZpbmVkLCBpc05hTiwgaXNOdWxsLCBjb25zdGFudCxcbiAgc3BsaXQsIGluY2x1ZGVzXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBldmVudHMsIGV2ZW50c0xpc3QgfSBmcm9tICcuL2V2ZW50cyc7XG5pbXBvcnQgeyBhcGlXcmFwcGVyIH0gZnJvbSAnLi9hcGlXcmFwcGVyJztcbmltcG9ydCB7XG4gIGdldExvY2ssIE5PX0xPQ0ssXG4gIGlzTm9sb2NrXG59IGZyb20gJy4vbG9jayc7XG5cbi8vIHRoaXMgaXMgdGhlIGNvbWJpbmF0b3IgZnVuY3Rpb25cbmV4cG9ydCBjb25zdCAkJCA9ICguLi5mdW5jcykgPT4gYXJnID0+IGZsb3coZnVuY3MpKGFyZyk7XG5cbi8vIHRoaXMgaXMgdGhlIHBpcGUgZnVuY3Rpb25cbmV4cG9ydCBjb25zdCAkID0gKGFyZywgZnVuY3MpID0+ICQkKC4uLmZ1bmNzKShhcmcpO1xuXG5leHBvcnQgY29uc3Qga2V5U2VwID0gJy8nO1xuY29uc3QgdHJpbUtleVNlcCA9IHN0ciA9PiB0cmltKHN0ciwga2V5U2VwKTtcbmNvbnN0IHNwbGl0QnlLZXlTZXAgPSBzdHIgPT4gc3BsaXQoa2V5U2VwKShzdHIpO1xuZXhwb3J0IGNvbnN0IHNhZmVLZXkgPSBrZXkgPT4gcmVwbGFjZShgJHtrZXlTZXB9JHt0cmltS2V5U2VwKGtleSl9YCwgYCR7a2V5U2VwfSR7a2V5U2VwfWAsIGtleVNlcCk7XG5leHBvcnQgY29uc3Qgam9pbktleSA9ICguLi5zdHJzKSA9PiB7XG4gIGNvbnN0IHBhcmFtc09yQXJyYXkgPSBzdHJzLmxlbmd0aCA9PT0gMSAmIGlzQXJyYXkoc3Ryc1swXSlcbiAgICA/IHN0cnNbMF0gOiBzdHJzO1xuICByZXR1cm4gc2FmZUtleShqb2luKGtleVNlcCkocGFyYW1zT3JBcnJheSkpO1xufTtcbmV4cG9ydCBjb25zdCBzcGxpdEtleSA9ICQkKHRyaW1LZXlTZXAsIHNwbGl0QnlLZXlTZXApO1xuZXhwb3J0IGNvbnN0IGdldERpckZvbUtleSA9ICQkKHNwbGl0S2V5LCBkcm9wUmlnaHQsIHAgPT4gam9pbktleSguLi5wKSk7XG5leHBvcnQgY29uc3QgZ2V0RmlsZUZyb21LZXkgPSAkJChzcGxpdEtleSwgdGFrZVJpZ2h0LCBoZWFkKTtcblxuZXhwb3J0IGNvbnN0IGNvbmZpZ0ZvbGRlciA9IGAke2tleVNlcH0uY29uZmlnYDtcbmV4cG9ydCBjb25zdCBmaWVsZERlZmluaXRpb25zID0gam9pbktleShjb25maWdGb2xkZXIsICdmaWVsZHMuanNvbicpO1xuZXhwb3J0IGNvbnN0IHRlbXBsYXRlRGVmaW5pdGlvbnMgPSBqb2luS2V5KGNvbmZpZ0ZvbGRlciwgJ3RlbXBsYXRlcy5qc29uJyk7XG5leHBvcnQgY29uc3QgYXBwRGVmaW5pdGlvbkZpbGUgPSBqb2luS2V5KGNvbmZpZ0ZvbGRlciwgJ2FwcERlZmluaXRpb24uanNvbicpO1xuZXhwb3J0IGNvbnN0IGRpckluZGV4ID0gZm9sZGVyUGF0aCA9PiBqb2luS2V5KGNvbmZpZ0ZvbGRlciwgJ2RpcicsIC4uLnNwbGl0S2V5KGZvbGRlclBhdGgpLCAnZGlyLmlkeCcpO1xuZXhwb3J0IGNvbnN0IGdldEluZGV4S2V5RnJvbUZpbGVLZXkgPSAkJChnZXREaXJGb21LZXksIGRpckluZGV4KTtcblxuZXhwb3J0IGNvbnN0IGlmRXhpc3RzID0gKHZhbCwgZXhpc3RzLCBub3RFeGlzdHMpID0+IChpc1VuZGVmaW5lZCh2YWwpXG4gID8gaXNVbmRlZmluZWQobm90RXhpc3RzKSA/ICgoKSA9PiB7IH0pKCkgOiBub3RFeGlzdHMoKVxuICA6IGV4aXN0cygpKTtcblxuZXhwb3J0IGNvbnN0IGdldE9yRGVmYXVsdCA9ICh2YWwsIGRlZmF1bHRWYWwpID0+IGlmRXhpc3RzKHZhbCwgKCkgPT4gdmFsLCAoKSA9PiBkZWZhdWx0VmFsKTtcblxuZXhwb3J0IGNvbnN0IG5vdCA9IGZ1bmMgPT4gdmFsID0+ICFmdW5jKHZhbCk7XG5leHBvcnQgY29uc3QgaXNEZWZpbmVkID0gbm90KGlzVW5kZWZpbmVkKTtcbmV4cG9ydCBjb25zdCBpc05vbk51bGwgPSBub3QoaXNOdWxsKTtcbmV4cG9ydCBjb25zdCBpc05vdE5hTiA9IG5vdChpc05hTik7XG5cbmV4cG9ydCBjb25zdCBhbGxUcnVlID0gKC4uLmZ1bmNBcmdzKSA9PiB2YWwgPT4gcmVkdWNlKFxuICAocmVzdWx0LCBjb25kaXRpb25GdW5jKSA9PiAoaXNOdWxsKHJlc3VsdCkgfHwgcmVzdWx0ID09IHRydWUpICYmIGNvbmRpdGlvbkZ1bmModmFsKSxcbiAgbnVsbCkoZnVuY0FyZ3MpO1xuXG5leHBvcnQgY29uc3QgYW55VHJ1ZSA9ICguLi5mdW5jQXJncykgPT4gdmFsID0+IHJlZHVjZShcbiAgKHJlc3VsdCwgY29uZGl0aW9uRnVuYykgPT4gcmVzdWx0ID09IHRydWUgfHwgY29uZGl0aW9uRnVuYyh2YWwpLFxuICBudWxsKShmdW5jQXJncyk7XG5cbmV4cG9ydCBjb25zdCBpbnNlbnNpdGl2ZUVxdWFscyA9IChzdHIxLCBzdHIyKSA9PiBzdHIxLnRyaW0oKS50b0xvd2VyQ2FzZSgpID09PSBzdHIyLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuXG5leHBvcnQgY29uc3QgaXNTb21ldGhpbmcgPSBhbGxUcnVlKGlzRGVmaW5lZCwgaXNOb25OdWxsLCBpc05vdE5hTik7XG5leHBvcnQgY29uc3QgaXNOb3RoaW5nID0gbm90KGlzU29tZXRoaW5nKTtcbmV4cG9ydCBjb25zdCBpc05vdGhpbmdPckVtcHR5ID0gdiA9PiBpc05vdGhpbmcodikgfHwgaXNFbXB0eSh2KTtcbmV4cG9ydCBjb25zdCBzb21ldGhpbmdPckdldERlZmF1bHQgPSBnZXREZWZhdWx0RnVuYyA9PiB2YWwgPT4gKGlzU29tZXRoaW5nKHZhbCkgPyB2YWwgOiBnZXREZWZhdWx0RnVuYygpKTtcbmV4cG9ydCBjb25zdCBzb21ldGhpbmdPckRlZmF1bHQgPSAodmFsLCBkZWZhdWx0VmFsKSA9PiBzb21ldGhpbmdPckdldERlZmF1bHQoY29uc3RhbnQoZGVmYXVsdFZhbCkpKHZhbCk7XG5cbmV4cG9ydCBjb25zdCBtYXBJZlNvbWV0aGluZ09yRGVmYXVsdCA9IChtYXBGdW5jLCBkZWZhdWx0VmFsKSA9PiB2YWwgPT4gKGlzU29tZXRoaW5nKHZhbCkgPyBtYXBGdW5jKHZhbCkgOiBkZWZhdWx0VmFsKTtcblxuZXhwb3J0IGNvbnN0IG1hcElmU29tZXRoaW5nT3JCbGFuayA9IG1hcEZ1bmMgPT4gbWFwSWZTb21ldGhpbmdPckRlZmF1bHQobWFwRnVuYywgJycpO1xuXG5leHBvcnQgY29uc3Qgbm9uZSA9IHByZWRpY2F0ZSA9PiBjb2xsZWN0aW9uID0+ICFzb21lKHByZWRpY2F0ZSkoY29sbGVjdGlvbik7XG5cbmV4cG9ydCBjb25zdCBhbGwgPSBwcmVkaWNhdGUgPT4gY29sbGVjdGlvbiA9PiBub25lKHYgPT4gIXByZWRpY2F0ZSh2KSkoY29sbGVjdGlvbik7XG5cbmV4cG9ydCBjb25zdCBpc05vdEVtcHR5ID0gb2IgPT4gIWlzRW1wdHkob2IpO1xuZXhwb3J0IGNvbnN0IGlzQXN5bmMgPSBmbiA9PiBmbi5jb25zdHJ1Y3Rvci5uYW1lID09PSAnQXN5bmNGdW5jdGlvbic7XG5leHBvcnQgY29uc3QgaXNOb25FbXB0eUFycmF5ID0gYWxsVHJ1ZShpc0FycmF5LCBpc05vdEVtcHR5KTtcbmV4cG9ydCBjb25zdCBpc05vbkVtcHR5U3RyaW5nID0gYWxsVHJ1ZShpc1N0cmluZywgaXNOb3RFbXB0eSk7XG5leHBvcnQgY29uc3QgdHJ5T3IgPSBmYWlsRnVuYyA9PiAoZnVuYywgLi4uYXJncykgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBmdW5jLmFwcGx5KG51bGwsIC4uLmFyZ3MpO1xuICB9IGNhdGNoIChfKSB7XG4gICAgcmV0dXJuIGZhaWxGdW5jKCk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCB0cnlBd2FpdE9yID0gZmFpbEZ1bmMgPT4gYXN5bmMgKGZ1bmMsIC4uLmFyZ3MpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgZnVuYy5hcHBseShudWxsLCAuLi5hcmdzKTtcbiAgfSBjYXRjaCAoXykge1xuICAgIHJldHVybiBhd2FpdCBmYWlsRnVuYygpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZGVmaW5lRXJyb3IgPSAoZnVuYywgZXJyb3JQcmVmaXgpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnVuYygpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBlcnIubWVzc2FnZSA9IGAke2Vycm9yUHJlZml4fSA6ICR7ZXJyLm1lc3NhZ2V9YDtcbiAgICB0aHJvdyBlcnI7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCB0cnlPcklnbm9yZSA9IHRyeU9yKCgpID0+IHsgfSk7XG5leHBvcnQgY29uc3QgdHJ5QXdhaXRPcklnbm9yZSA9IHRyeUF3YWl0T3IoYXN5bmMgKCkgPT4geyB9KTtcbmV4cG9ydCBjb25zdCBjYXVzZXNFeGNlcHRpb24gPSAoZnVuYykgPT4ge1xuICB0cnkge1xuICAgIGZ1bmMoKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbiA9IGZ1bmMgPT4gIWNhdXNlc0V4Y2VwdGlvbihmdW5jKTtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZUVycm9yV2l0aCA9IHJldHVyblZhbEluRXJyb3IgPT4gdHJ5T3IoY29uc3RhbnQocmV0dXJuVmFsSW5FcnJvcikpO1xuXG5leHBvcnQgY29uc3QgaGFuZGxlRXJyb3JXaXRoVW5kZWZpbmVkID0gaGFuZGxlRXJyb3JXaXRoKHVuZGVmaW5lZCk7XG5cbmV4cG9ydCBjb25zdCBzd2l0Y2hDYXNlID0gKC4uLmNhc2VzKSA9PiAodmFsdWUpID0+IHtcbiAgY29uc3QgbmV4dENhc2UgPSAoKSA9PiBoZWFkKGNhc2VzKVswXSh2YWx1ZSk7XG4gIGNvbnN0IG5leHRSZXN1bHQgPSAoKSA9PiBoZWFkKGNhc2VzKVsxXSh2YWx1ZSk7XG5cbiAgaWYgKGlzRW1wdHkoY2FzZXMpKSByZXR1cm47IC8vIHVuZGVmaW5lZFxuICBpZiAobmV4dENhc2UoKSA9PT0gdHJ1ZSkgcmV0dXJuIG5leHRSZXN1bHQoKTtcbiAgcmV0dXJuIHN3aXRjaENhc2UoLi4udGFpbChjYXNlcykpKHZhbHVlKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1ZhbHVlID0gdmFsMSA9PiB2YWwyID0+ICh2YWwxID09PSB2YWwyKTtcbmV4cG9ydCBjb25zdCBpc09uZU9mID0gKC4uLnZhbHMpID0+IHZhbCA9PiBpbmNsdWRlcyh2YWwpKHZhbHMpO1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRDYXNlID0gY29uc3RhbnQodHJ1ZSk7XG5leHBvcnQgY29uc3QgbWVtYmVyTWF0Y2hlcyA9IChtZW1iZXIsIG1hdGNoKSA9PiBvYmogPT4gbWF0Y2gob2JqW21lbWJlcl0pO1xuXG5cbmV4cG9ydCBjb25zdCBTdGFydHNXaXRoID0gc2VhcmNoRm9yID0+IHNlYXJjaEluID0+IHN0YXJ0c1dpdGgoc2VhcmNoSW4sIHNlYXJjaEZvcik7XG5cbmV4cG9ydCBjb25zdCBjb250YWlucyA9IHZhbCA9PiBhcnJheSA9PiAoZmluZEluZGV4KGFycmF5LCB2ID0+IHYgPT09IHZhbCkgPiAtMSk7XG5cbmV4cG9ydCBjb25zdCBnZXRIYXNoQ29kZSA9IChzKSA9PiB7XG4gIGxldCBoYXNoID0gMDsgbGV0IGk7IGxldCBjaGFyOyBsZXRcbiAgICBsO1xuICBpZiAocy5sZW5ndGggPT0gMCkgcmV0dXJuIGhhc2g7XG4gIGZvciAoaSA9IDAsIGwgPSBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNoYXIgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2hhcjtcbiAgICBoYXNoIHw9IDA7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICB9XG5cbiAgLy8gY29udmVydGluZyB0byBzdHJpbmcsIGJ1dCBkb250IHdhbnQgYSBcIi1cIiBwcmVmaXhlZFxuICBpZiAoaGFzaCA8IDApIHsgcmV0dXJuIGBuJHsoaGFzaCAqIC0xKS50b1N0cmluZygpfWA7IH1cbiAgcmV0dXJuIGhhc2gudG9TdHJpbmcoKTtcbn07XG5cbi8vIHRoYW5rcyB0byBodHRwczovL2Jsb2cuZ3Jvc3NtYW4uaW8vaG93LXRvLXdyaXRlLWFzeW5jLWF3YWl0LXdpdGhvdXQtdHJ5LWNhdGNoLWJsb2Nrcy1pbi1qYXZhc2NyaXB0L1xuZXhwb3J0IGNvbnN0IGF3RXggPSBhc3luYyAocHJvbWlzZSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHByb21pc2U7XG4gICAgcmV0dXJuIFt1bmRlZmluZWQsIHJlc3VsdF07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIFtlcnJvciwgdW5kZWZpbmVkXTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGlzU2FmZUludGVnZXIgPSBuID0+IGlzSW50ZWdlcihuKVxuICAgICYmIG4gPD0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgICAmJiBuID49IDAgLSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcblxuZXhwb3J0IGNvbnN0IHRvRGF0ZU9yTnVsbCA9IHMgPT4gKGlzTnVsbChzKSA/IG51bGxcbiAgOiBpc0RhdGUocykgPyBzIDogbmV3IERhdGUocykpO1xuZXhwb3J0IGNvbnN0IHRvQm9vbE9yTnVsbCA9IHMgPT4gKGlzTnVsbChzKSA/IG51bGxcbiAgOiBzID09PSAndHJ1ZScgfHwgcyA9PT0gdHJ1ZSk7XG5leHBvcnQgY29uc3QgdG9OdW1iZXJPck51bGwgPSBzID0+IChpc051bGwocykgPyBudWxsXG4gIDogdG9OdW1iZXIocykpO1xuXG5leHBvcnQgY29uc3QgaXNBcnJheU9mU3RyaW5nID0gb3B0cyA9PiBpc0FycmF5KG9wdHMpICYmIGFsbChpc1N0cmluZykob3B0cyk7XG5cbmV4cG9ydCBjb25zdCBwYXVzZSA9IGFzeW5jIGR1cmF0aW9uID0+IG5ldyBQcm9taXNlKHJlcyA9PiBzZXRUaW1lb3V0KHJlcywgZHVyYXRpb24pKTtcblxuZXhwb3J0IGNvbnN0IHJldHJ5ID0gYXN5bmMgKGZuLCByZXRyaWVzLCBkZWxheSwgLi4uYXJncykgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCBmbiguLi5hcmdzKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKHJldHJpZXMgPiAxKSB7XG4gICAgICByZXR1cm4gYXdhaXQgcGF1c2UoZGVsYXkpLnRoZW4oYXN5bmMgKCkgPT4gYXdhaXQgcmV0cnkoZm4sIChyZXRyaWVzIC0gMSksIGRlbGF5LCAuLi5hcmdzKSk7XG4gICAgfVxuICAgIHRocm93IGVycjtcbiAgfVxufTtcblxuZXhwb3J0IHsgZXZlbnRzIH0gZnJvbSAnLi9ldmVudHMnO1xuZXhwb3J0IHsgYXBpV3JhcHBlciwgYXBpV3JhcHBlclN5bmMgfSBmcm9tICcuL2FwaVdyYXBwZXInO1xuZXhwb3J0IHtcbiAgZ2V0TG9jaywgTk9fTE9DSywgcmVsZWFzZUxvY2ssXG4gIGV4dGVuZExvY2ssIGlzTm9sb2NrLFxufSBmcm9tICcuL2xvY2snO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGlmRXhpc3RzLFxuICBnZXRPckRlZmF1bHQsXG4gIGlzRGVmaW5lZCxcbiAgaXNOb25OdWxsLFxuICBpc05vdE5hTixcbiAgYWxsVHJ1ZSxcbiAgaXNTb21ldGhpbmcsXG4gIG1hcElmU29tZXRoaW5nT3JEZWZhdWx0LFxuICBtYXBJZlNvbWV0aGluZ09yQmxhbmssXG4gIGNvbmZpZ0ZvbGRlcixcbiAgZmllbGREZWZpbml0aW9ucyxcbiAgaXNOb3RoaW5nLFxuICBub3QsXG4gIHN3aXRjaENhc2UsXG4gIGRlZmF1bHRDYXNlLFxuICBTdGFydHNXaXRoLFxuICBjb250YWlucyxcbiAgdGVtcGxhdGVEZWZpbml0aW9ucyxcbiAgaGFuZGxlRXJyb3JXaXRoLFxuICBoYW5kbGVFcnJvcldpdGhVbmRlZmluZWQsXG4gIHRyeU9yLFxuICB0cnlPcklnbm9yZSxcbiAgdHJ5QXdhaXRPcixcbiAgdHJ5QXdhaXRPcklnbm9yZSxcbiAgZGlySW5kZXgsXG4gIGtleVNlcCxcbiAgJCxcbiAgJCQsXG4gIGdldERpckZvbUtleSxcbiAgZ2V0RmlsZUZyb21LZXksXG4gIHNwbGl0S2V5LFxuICBzb21ldGhpbmdPckRlZmF1bHQsXG4gIGdldEluZGV4S2V5RnJvbUZpbGVLZXksXG4gIGpvaW5LZXksXG4gIHNvbWV0aGluZ09yR2V0RGVmYXVsdCxcbiAgYXBwRGVmaW5pdGlvbkZpbGUsXG4gIGlzVmFsdWUsXG4gIGFsbCxcbiAgaXNPbmVPZixcbiAgbWVtYmVyTWF0Y2hlcyxcbiAgZGVmaW5lRXJyb3IsXG4gIGFueVRydWUsXG4gIGlzTm9uRW1wdHlBcnJheSxcbiAgY2F1c2VzRXhjZXB0aW9uLFxuICBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24sXG4gIG5vbmUsXG4gIGdldEhhc2hDb2RlLFxuICBhd0V4LFxuICBhcGlXcmFwcGVyLFxuICBldmVudHMsXG4gIGV2ZW50c0xpc3QsXG4gIGlzTm90aGluZ09yRW1wdHksXG4gIGlzU2FmZUludGVnZXIsXG4gIHRvTnVtYmVyLFxuICB0b0RhdGU6IHRvRGF0ZU9yTnVsbCxcbiAgdG9Cb29sOiB0b0Jvb2xPck51bGwsXG4gIGlzQXJyYXlPZlN0cmluZyxcbiAgZ2V0TG9jayxcbiAgTk9fTE9DSyxcbiAgaXNOb2xvY2ssXG4gIGluc2Vuc2l0aXZlRXF1YWxzLFxuICBwYXVzZSxcbiAgcmV0cnksXG59O1xuIiwiaW1wb3J0IHsgZmlsdGVyLCBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgJCwgaXNTb21ldGhpbmcgfSBmcm9tICcuL2luZGV4JztcblxuZXhwb3J0IGNvbnN0IHN0cmluZ05vdEVtcHR5ID0gcyA9PiBpc1NvbWV0aGluZyhzKSAmJiBzLnRyaW0oKS5sZW5ndGggPiAwO1xuXG5leHBvcnQgY29uc3QgbWFrZXJ1bGUgPSAoZmllbGQsIGVycm9yLCBpc1ZhbGlkKSA9PiAoeyBmaWVsZCwgZXJyb3IsIGlzVmFsaWQgfSk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0aW9uRXJyb3IgPSAocnVsZSwgaXRlbSkgPT4gKHsgLi4ucnVsZSwgaXRlbSB9KTtcblxuZXhwb3J0IGNvbnN0IGFwcGx5UnVsZVNldCA9IHJ1bGVTZXQgPT4gaXRlbVRvVmFsaWRhdGUgPT4gJChydWxlU2V0LCBbXG4gIG1hcChhcHBseVJ1bGUoaXRlbVRvVmFsaWRhdGUpKSxcbiAgZmlsdGVyKGlzU29tZXRoaW5nKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgYXBwbHlSdWxlID0gaXRlbVRvdmFsaWRhdGUgPT4gcnVsZSA9PiAocnVsZS5pc1ZhbGlkKGl0ZW1Ub3ZhbGlkYXRlKVxuICA/IG51bGxcbiAgOiB2YWxpZGF0aW9uRXJyb3IocnVsZSwgaXRlbVRvdmFsaWRhdGUpKTtcbiIsImltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCB7XG4gIGlzVW5kZWZpbmVkLCBrZXlzLCBcbiAgY2xvbmVEZWVwLCBpc0Z1bmN0aW9uLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZGVmaW5lRXJyb3IgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZmlsdGVyRXZhbCA9ICdGSUxURVJfRVZBTFVBVEUnO1xuZXhwb3J0IGNvbnN0IGZpbHRlckNvbXBpbGUgPSAnRklMVEVSX0NPTVBJTEUnO1xuZXhwb3J0IGNvbnN0IG1hcEV2YWwgPSAnTUFQX0VWQUxVQVRFJztcbmV4cG9ydCBjb25zdCBtYXBDb21waWxlID0gJ01BUF9DT01QSUxFJztcbmV4cG9ydCBjb25zdCByZW1vdmVVbmRlY2xhcmVkRmllbGRzID0gJ1JFTU9WRV9VTkRFQ0xBUkVEX0ZJRUxEUyc7XG5leHBvcnQgY29uc3QgYWRkVW5NYXBwZWRGaWVsZHMgPSAnQUREX1VOTUFQUEVEX0ZJRUxEUyc7XG5leHBvcnQgY29uc3QgYWRkVGhlS2V5ID0gJ0FERF9LRVknO1xuXG5cbmNvbnN0IGdldEV2YWx1YXRlUmVzdWx0ID0gKCkgPT4gKHtcbiAgaXNFcnJvcjogZmFsc2UsXG4gIHBhc3NlZEZpbHRlcjogdHJ1ZSxcbiAgcmVzdWx0OiBudWxsLFxufSk7XG5cbmV4cG9ydCBjb25zdCBjb21waWxlRmlsdGVyID0gaW5kZXggPT4gY29tcGlsZUV4cHJlc3Npb24oaW5kZXguZmlsdGVyKTtcblxuZXhwb3J0IGNvbnN0IGNvbXBpbGVNYXAgPSBpbmRleCA9PiBjb21waWxlQ29kZShpbmRleC5tYXApO1xuXG5leHBvcnQgY29uc3QgcGFzc2VzRmlsdGVyID0gKHJlY29yZCwgaW5kZXgpID0+IHtcbiAgY29uc3QgY29udGV4dCA9IHsgcmVjb3JkIH07XG4gIGlmICghaW5kZXguZmlsdGVyKSByZXR1cm4gdHJ1ZTtcblxuICBjb25zdCBjb21waWxlZEZpbHRlciA9IGRlZmluZUVycm9yKFxuICAgICgpID0+IGNvbXBpbGVGaWx0ZXIoaW5kZXgpLFxuICAgIGZpbHRlckNvbXBpbGUsXG4gICk7XG5cbiAgcmV0dXJuIGRlZmluZUVycm9yKFxuICAgICgpID0+IGNvbXBpbGVkRmlsdGVyKGNvbnRleHQpLFxuICAgIGZpbHRlckV2YWwsXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgbWFwUmVjb3JkID0gKHJlY29yZCwgaW5kZXgpID0+IHtcbiAgY29uc3QgcmVjb3JkQ2xvbmUgPSBjbG9uZURlZXAocmVjb3JkKTtcbiAgY29uc3QgY29udGV4dCA9IHsgcmVjb3JkOiByZWNvcmRDbG9uZSB9O1xuXG4gIGNvbnN0IG1hcCA9IGluZGV4Lm1hcCA/IGluZGV4Lm1hcCA6ICdyZXR1cm4gey4uLnJlY29yZH07JztcblxuICBjb25zdCBjb21waWxlZE1hcCA9IGRlZmluZUVycm9yKFxuICAgICgpID0+IGNvbXBpbGVDb2RlKG1hcCksXG4gICAgbWFwQ29tcGlsZSxcbiAgKTtcblxuICBjb25zdCBtYXBwZWQgPSBkZWZpbmVFcnJvcihcbiAgICAoKSA9PiBjb21waWxlZE1hcChjb250ZXh0KSxcbiAgICBtYXBFdmFsLFxuICApO1xuXG4gIGNvbnN0IG1hcHBlZEtleXMgPSBrZXlzKG1hcHBlZCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWFwcGVkS2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGtleSA9IG1hcHBlZEtleXNbaV07XG4gICAgbWFwcGVkW2tleV0gPSBpc1VuZGVmaW5lZChtYXBwZWRba2V5XSkgPyBudWxsIDogbWFwcGVkW2tleV07XG4gICAgaWYgKGlzRnVuY3Rpb24obWFwcGVkW2tleV0pKSB7XG4gICAgICBkZWxldGUgbWFwcGVkW2tleV07XG4gICAgfVxuICB9XG5cbiAgbWFwcGVkLmtleSA9IHJlY29yZC5rZXk7XG4gIG1hcHBlZC5zb3J0S2V5ID0gaW5kZXguZ2V0U29ydEtleVxuICAgID8gY29tcGlsZUNvZGUoaW5kZXguZ2V0U29ydEtleSkoY29udGV4dClcbiAgICA6IHJlY29yZC5pZDtcblxuICByZXR1cm4gbWFwcGVkO1xufTtcblxuZXhwb3J0IGNvbnN0IGV2YWx1YXRlID0gcmVjb3JkID0+IChpbmRleCkgPT4ge1xuICBjb25zdCByZXN1bHQgPSBnZXRFdmFsdWF0ZVJlc3VsdCgpO1xuXG4gIHRyeSB7XG4gICAgcmVzdWx0LnBhc3NlZEZpbHRlciA9IHBhc3Nlc0ZpbHRlcihyZWNvcmQsIGluZGV4KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmVzdWx0LmlzRXJyb3IgPSB0cnVlO1xuICAgIHJlc3VsdC5wYXNzZWRGaWx0ZXIgPSBmYWxzZTtcbiAgICByZXN1bHQucmVzdWx0ID0gZXJyLm1lc3NhZ2U7XG4gIH1cblxuICBpZiAoIXJlc3VsdC5wYXNzZWRGaWx0ZXIpIHJldHVybiByZXN1bHQ7XG5cbiAgdHJ5IHtcbiAgICByZXN1bHQucmVzdWx0ID0gbWFwUmVjb3JkKHJlY29yZCwgaW5kZXgpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXN1bHQuaXNFcnJvciA9IHRydWU7XG4gICAgcmVzdWx0LnJlc3VsdCA9IGVyci5tZXNzYWdlO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGV2YWx1YXRlO1xuIiwiaW1wb3J0IHtcbiAgbWFwLCBpc0VtcHR5LCBjb3VudEJ5LCBcbiAgZmxhdHRlbiwgaW5jbHVkZXMsIGpvaW4sIGtleXNcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7ICB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHsgY29tcGlsZUZpbHRlciwgY29tcGlsZU1hcCB9IGZyb20gJy4uL2luZGV4aW5nL2V2YWx1YXRlJztcbmltcG9ydCB7IGlzTm9uRW1wdHlTdHJpbmcsIGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbiwgJCB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBpc1JlY29yZCB9IGZyb20gJy4vaGllcmFyY2h5JztcblxuZXhwb3J0IGNvbnN0IGluZGV4VHlwZXMgPSB7IHJlZmVyZW5jZTogJ3JlZmVyZW5jZScsIGFuY2VzdG9yOiAnYW5jZXN0b3InIH07XG5cbmV4cG9ydCBjb25zdCBpbmRleFJ1bGVTZXQgPSBbXG4gIG1ha2VydWxlKCdtYXAnLCAnaW5kZXggaGFzIG5vIG1hcCBmdW5jdGlvbicsXG4gICAgaW5kZXggPT4gaXNOb25FbXB0eVN0cmluZyhpbmRleC5tYXApKSxcbiAgbWFrZXJ1bGUoJ21hcCcsIFwiaW5kZXgncyBtYXAgZnVuY3Rpb24gZG9lcyBub3QgY29tcGlsZVwiLFxuICAgIGluZGV4ID0+ICFpc05vbkVtcHR5U3RyaW5nKGluZGV4Lm1hcClcbiAgICAgICAgICAgICAgICB8fCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24oKCkgPT4gY29tcGlsZU1hcChpbmRleCkpKSxcbiAgbWFrZXJ1bGUoJ2ZpbHRlcicsIFwiaW5kZXgncyBmaWx0ZXIgZnVuY3Rpb24gZG9lcyBub3QgY29tcGlsZVwiLFxuICAgIGluZGV4ID0+ICFpc05vbkVtcHR5U3RyaW5nKGluZGV4LmZpbHRlcilcbiAgICAgICAgICAgICAgICB8fCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24oKCkgPT4gY29tcGlsZUZpbHRlcihpbmRleCkpKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnbXVzdCBkZWNsYXJlIGEgbmFtZSBmb3IgaW5kZXgnLFxuICAgIGluZGV4ID0+IGlzTm9uRW1wdHlTdHJpbmcoaW5kZXgubmFtZSkpLFxuICBtYWtlcnVsZSgnbmFtZScsICd0aGVyZSBpcyBhIGR1cGxpY2F0ZSBuYW1lZCBpbmRleCBvbiB0aGlzIG5vZGUnLFxuICAgIGluZGV4ID0+IGlzRW1wdHkoaW5kZXgubmFtZSlcbiAgICAgICAgICAgICAgICB8fCBjb3VudEJ5KCduYW1lJykoaW5kZXgucGFyZW50KCkuaW5kZXhlcylbaW5kZXgubmFtZV0gPT09IDEpLFxuICBtYWtlcnVsZSgnaW5kZXhUeXBlJywgJ3JlZmVyZW5jZSBpbmRleCBtYXkgb25seSBleGlzdCBvbiBhIHJlY29yZCBub2RlJyxcbiAgICBpbmRleCA9PiBpc1JlY29yZChpbmRleC5wYXJlbnQoKSlcbiAgICAgICAgICAgICAgICAgIHx8IGluZGV4LmluZGV4VHlwZSAhPT0gaW5kZXhUeXBlcy5yZWZlcmVuY2UpLFxuICBtYWtlcnVsZSgnaW5kZXhUeXBlJywgYGluZGV4IHR5cGUgbXVzdCBiZSBvbmUgb2Y6ICR7am9pbignLCAnKShrZXlzKGluZGV4VHlwZXMpKX1gLFxuICAgIGluZGV4ID0+IGluY2x1ZGVzKGluZGV4LmluZGV4VHlwZSkoa2V5cyhpbmRleFR5cGVzKSkpLFxuXTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlSW5kZXggPSAoaW5kZXgsIGFsbFJlZmVyZW5jZUluZGV4ZXNPbk5vZGUpID0+IGFwcGx5UnVsZVNldChpbmRleFJ1bGVTZXQoYWxsUmVmZXJlbmNlSW5kZXhlc09uTm9kZSkpKGluZGV4KTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWxsSW5kZXhlcyA9IG5vZGUgPT4gJChub2RlLmluZGV4ZXMsIFtcbiAgbWFwKGkgPT4gdmFsaWRhdGVJbmRleChpLCBub2RlLmluZGV4ZXMpKSxcbiAgZmxhdHRlbixcbl0pO1xuIiwiaW1wb3J0IHtcbiAgZmluZCwgY29uc3RhbnQsIG1hcCwgbGFzdCxcbiAgZmlyc3QsIHNwbGl0LCBpbnRlcnNlY3Rpb24sIHRha2UsXG4gIHVuaW9uLCBpbmNsdWRlcywgZmlsdGVyLCBzb21lLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgJCwgc3dpdGNoQ2FzZSwgaXNOb3RoaW5nLCBpc1NvbWV0aGluZyxcbiAgZGVmYXVsdENhc2UsIHNwbGl0S2V5LCBpc05vbkVtcHR5U3RyaW5nLFxuICBqb2luS2V5LCBnZXRIYXNoQ29kZSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGluZGV4VHlwZXMgfSBmcm9tICcuL2luZGV4ZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0RmxhdHRlbmVkSGllcmFyY2h5ID0gKGFwcEhpZXJhcmNoeSwgdXNlQ2FjaGVkID0gdHJ1ZSkgPT4ge1xuICBpZiAoaXNTb21ldGhpbmcoYXBwSGllcmFyY2h5LmdldEZsYXR0ZW5lZEhpZXJhcmNoeSkgJiYgdXNlQ2FjaGVkKSB7IHJldHVybiBhcHBIaWVyYXJjaHkuZ2V0RmxhdHRlbmVkSGllcmFyY2h5KCk7IH1cblxuICBjb25zdCBmbGF0dGVuSGllcmFyY2h5ID0gKGN1cnJlbnROb2RlLCBmbGF0dGVuZWQpID0+IHtcbiAgICBmbGF0dGVuZWQucHVzaChjdXJyZW50Tm9kZSk7XG4gICAgaWYgKCghY3VycmVudE5vZGUuY2hpbGRyZW5cbiAgICAgICAgICAgIHx8IGN1cnJlbnROb2RlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICYmICghY3VycmVudE5vZGUuaW5kZXhlc1xuICAgICAgICAgICAgfHwgY3VycmVudE5vZGUuaW5kZXhlcy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAmJiAoIWN1cnJlbnROb2RlLmFnZ3JlZ2F0ZUdyb3Vwc1xuICAgICAgICAgICAgfHwgY3VycmVudE5vZGUuYWdncmVnYXRlR3JvdXBzLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgIHJldHVybiBmbGF0dGVuZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgdW5pb25JZkFueSA9IGwyID0+IGwxID0+IHVuaW9uKGwxKSghbDIgPyBbXSA6IGwyKTtcblxuICAgIGNvbnN0IGNoaWxkcmVuID0gJChbXSwgW1xuICAgICAgdW5pb25JZkFueShjdXJyZW50Tm9kZS5jaGlsZHJlbiksXG4gICAgICB1bmlvbklmQW55KGN1cnJlbnROb2RlLmluZGV4ZXMpLFxuICAgICAgdW5pb25JZkFueShjdXJyZW50Tm9kZS5hZ2dyZWdhdGVHcm91cHMpLFxuICAgIF0pO1xuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgZmxhdHRlbkhpZXJhcmNoeShjaGlsZCwgZmxhdHRlbmVkKTtcbiAgICB9XG4gICAgcmV0dXJuIGZsYXR0ZW5lZDtcbiAgfTtcblxuICBhcHBIaWVyYXJjaHkuZ2V0RmxhdHRlbmVkSGllcmFyY2h5ID0gKCkgPT4gZmxhdHRlbkhpZXJhcmNoeShhcHBIaWVyYXJjaHksIFtdKTtcbiAgcmV0dXJuIGFwcEhpZXJhcmNoeS5nZXRGbGF0dGVuZWRIaWVyYXJjaHkoKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRMYXN0UGFydEluS2V5ID0ga2V5ID0+IGxhc3Qoc3BsaXRLZXkoa2V5KSk7XG5cbmV4cG9ydCBjb25zdCBnZXROb2Rlc0luUGF0aCA9IGFwcEhpZXJhcmNoeSA9PiBrZXkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaWx0ZXIobiA9PiBuZXcgUmVnRXhwKGAke24ucGF0aFJlZ3goKX1gKS50ZXN0KGtleSkpLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBnZXRFeGFjdE5vZGVGb3JQYXRoID0gYXBwSGllcmFyY2h5ID0+IGtleSA9PiAkKGFwcEhpZXJhcmNoeSwgW1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGZpbmQobiA9PiBuZXcgUmVnRXhwKGAke24ucGF0aFJlZ3goKX0kYCkudGVzdChrZXkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoID0gYXBwSGllcmFyY2h5ID0+IGNvbGxlY3Rpb25LZXkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gKGlzQ29sbGVjdGlvblJlY29yZChuKVxuICAgICAgICAgICAgICAgICAgICYmIG5ldyBSZWdFeHAoYCR7bi5jb2xsZWN0aW9uUGF0aFJlZ3goKX0kYCkudGVzdChjb2xsZWN0aW9uS2V5KSkpLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBoYXNNYXRjaGluZ0FuY2VzdG9yID0gYW5jZXN0b3JQcmVkaWNhdGUgPT4gZGVjZW5kYW50Tm9kZSA9PiBzd2l0Y2hDYXNlKFxuXG4gIFtub2RlID0+IGlzTm90aGluZyhub2RlLnBhcmVudCgpKSxcbiAgICBjb25zdGFudChmYWxzZSldLFxuXG4gIFtub2RlID0+IGFuY2VzdG9yUHJlZGljYXRlKG5vZGUucGFyZW50KCkpLFxuICAgIGNvbnN0YW50KHRydWUpXSxcblxuICBbZGVmYXVsdENhc2UsXG4gICAgbm9kZSA9PiBoYXNNYXRjaGluZ0FuY2VzdG9yKGFuY2VzdG9yUHJlZGljYXRlKShub2RlLnBhcmVudCgpKV0sXG5cbikoZGVjZW5kYW50Tm9kZSk7XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlID0gKGFwcEhpZXJhcmNoeSwgbm9kZUtleSkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gbi5ub2RlS2V5KCkgPT09IG5vZGVLZXlcbiAgICAgICAgICAgICAgICAgIHx8IChpc0NvbGxlY3Rpb25SZWNvcmQobilcbiAgICAgICAgICAgICAgICAgICAgICAmJiBuLmNvbGxlY3Rpb25Ob2RlS2V5KCkgPT09IG5vZGVLZXkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0Q29sbGVjdGlvbk5vZGUgPSAoYXBwSGllcmFyY2h5LCBub2RlS2V5KSA9PiAkKGFwcEhpZXJhcmNoeSwgW1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGZpbmQobiA9PiAoaXNDb2xsZWN0aW9uUmVjb3JkKG4pXG4gICAgICAgICAgICAgICAgICAgICYmIG4uY29sbGVjdGlvbk5vZGVLZXkoKSA9PT0gbm9kZUtleSkpLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlQnlLZXlPck5vZGVLZXkgPSAoYXBwSGllcmFyY2h5LCBrZXlPck5vZGVLZXkpID0+IHtcbiAgY29uc3Qgbm9kZUJ5S2V5ID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHBIaWVyYXJjaHkpKGtleU9yTm9kZUtleSk7XG4gIHJldHVybiBpc05vdGhpbmcobm9kZUJ5S2V5KVxuICAgID8gZ2V0Tm9kZShhcHBIaWVyYXJjaHksIGtleU9yTm9kZUtleSlcbiAgICA6IG5vZGVCeUtleTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5ID0gKGFwcEhpZXJhcmNoeSwga2V5T3JOb2RlS2V5KSA9PiB7XG4gIGNvbnN0IG5vZGVCeUtleSA9IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHBIaWVyYXJjaHkpKGtleU9yTm9kZUtleSk7XG4gIHJldHVybiBpc05vdGhpbmcobm9kZUJ5S2V5KVxuICAgID8gZ2V0Q29sbGVjdGlvbk5vZGUoYXBwSGllcmFyY2h5LCBrZXlPck5vZGVLZXkpXG4gICAgOiBub2RlQnlLZXk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNOb2RlID0gKGFwcEhpZXJhcmNoeSwga2V5KSA9PiBpc1NvbWV0aGluZyhnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcEhpZXJhcmNoeSkoa2V5KSk7XG5cbmV4cG9ydCBjb25zdCBnZXRBY3R1YWxLZXlPZlBhcmVudCA9IChwYXJlbnROb2RlS2V5LCBhY3R1YWxDaGlsZEtleSkgPT4gJChhY3R1YWxDaGlsZEtleSwgW1xuICBzcGxpdEtleSxcbiAgdGFrZShzcGxpdEtleShwYXJlbnROb2RlS2V5KS5sZW5ndGgpLFxuICBrcyA9PiBqb2luS2V5KC4uLmtzKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0UGFyZW50S2V5ID0gKGtleSkgPT4ge1xuICByZXR1cm4gJChrZXksIFtcbiAgICBzcGxpdEtleSxcbiAgICB0YWtlKHNwbGl0S2V5KGtleSkubGVuZ3RoIC0gMSksXG4gICAgam9pbktleSxcbiAgXSk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNLZXlBbmNlc3Rvck9mID0gYW5jZXN0b3JLZXkgPT4gZGVjZW5kYW50Tm9kZSA9PiBoYXNNYXRjaGluZ0FuY2VzdG9yKHAgPT4gcC5ub2RlS2V5KCkgPT09IGFuY2VzdG9yS2V5KShkZWNlbmRhbnROb2RlKTtcblxuZXhwb3J0IGNvbnN0IGhhc05vTWF0Y2hpbmdBbmNlc3RvcnMgPSBwYXJlbnRQcmVkaWNhdGUgPT4gbm9kZSA9PiAhaGFzTWF0Y2hpbmdBbmNlc3RvcihwYXJlbnRQcmVkaWNhdGUpKG5vZGUpO1xuXG5leHBvcnQgY29uc3QgZmluZEZpZWxkID0gKHJlY29yZE5vZGUsIGZpZWxkTmFtZSkgPT4gZmluZChmID0+IGYubmFtZSA9PSBmaWVsZE5hbWUpKHJlY29yZE5vZGUuZmllbGRzKTtcblxuZXhwb3J0IGNvbnN0IGlzQW5jZXN0b3IgPSBkZWNlbmRhbnQgPT4gYW5jZXN0b3IgPT4gaXNLZXlBbmNlc3Rvck9mKGFuY2VzdG9yLm5vZGVLZXkoKSkoZGVjZW5kYW50KTtcblxuZXhwb3J0IGNvbnN0IGlzRGVjZW5kYW50ID0gYW5jZXN0b3IgPT4gZGVjZW5kYW50ID0+IGlzQW5jZXN0b3IoZGVjZW5kYW50KShhbmNlc3Rvcik7XG5cbmV4cG9ydCBjb25zdCBnZXRSZWNvcmROb2RlSWQgPSByZWNvcmRLZXkgPT4gJChyZWNvcmRLZXksIFtcbiAgc3BsaXRLZXksXG4gIGxhc3QsXG4gIGdldFJlY29yZE5vZGVJZEZyb21JZCxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkTm9kZUlkRnJvbUlkID0gcmVjb3JkSWQgPT4gJChyZWNvcmRJZCwgW3NwbGl0KCctJyksIGZpcnN0LCBwYXJzZUludF0pO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkTm9kZUJ5SWQgPSAoaGllcmFyY2h5LCByZWNvcmRJZCkgPT4gJChoaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gaXNSZWNvcmQobilcbiAgICAgICAgICAgICAgICAgICAgJiYgbi5ub2RlSWQgPT09IGdldFJlY29yZE5vZGVJZEZyb21JZChyZWNvcmRJZCkpLFxuXSk7XG5cbmV4cG9ydCBjb25zdCByZWNvcmROb2RlSWRJc0FsbG93ZWQgPSBpbmRleE5vZGUgPT4gbm9kZUlkID0+IGluZGV4Tm9kZS5hbGxvd2VkUmVjb3JkTm9kZUlkcy5sZW5ndGggPT09IDBcbiAgICB8fCBpbmNsdWRlcyhub2RlSWQpKGluZGV4Tm9kZS5hbGxvd2VkUmVjb3JkTm9kZUlkcyk7XG5cbmV4cG9ydCBjb25zdCByZWNvcmROb2RlSXNBbGxvd2VkID0gaW5kZXhOb2RlID0+IHJlY29yZE5vZGUgPT4gcmVjb3JkTm9kZUlkSXNBbGxvd2VkKGluZGV4Tm9kZSkocmVjb3JkTm9kZS5ub2RlSWQpO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXggPSAoYXBwSGllcmFyY2h5LCBpbmRleE5vZGUpID0+IHtcbiAgY29uc3QgcmVjb3JkTm9kZXMgPSAkKGFwcEhpZXJhcmNoeSwgW1xuICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgICBmaWx0ZXIoaXNSZWNvcmQpLFxuICBdKTtcblxuICBpZiAoaXNHbG9iYWxJbmRleChpbmRleE5vZGUpKSB7XG4gICAgcmV0dXJuICQocmVjb3JkTm9kZXMsIFtcbiAgICAgIGZpbHRlcihyZWNvcmROb2RlSXNBbGxvd2VkKGluZGV4Tm9kZSkpLFxuICAgIF0pO1xuICB9XG5cbiAgaWYgKGlzQW5jZXN0b3JJbmRleChpbmRleE5vZGUpKSB7XG4gICAgcmV0dXJuICQocmVjb3JkTm9kZXMsIFtcbiAgICAgIGZpbHRlcihpc0RlY2VuZGFudChpbmRleE5vZGUucGFyZW50KCkpKSxcbiAgICAgIGZpbHRlcihyZWNvcmROb2RlSXNBbGxvd2VkKGluZGV4Tm9kZSkpLFxuICAgIF0pO1xuICB9XG5cbiAgaWYgKGlzUmVmZXJlbmNlSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIHJldHVybiAkKHJlY29yZE5vZGVzLCBbXG4gICAgICBmaWx0ZXIobiA9PiBzb21lKGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4KGluZGV4Tm9kZSkpKG4uZmllbGRzKSksXG4gICAgXSk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlRnJvbU5vZGVLZXlIYXNoID0gaGllcmFyY2h5ID0+IGhhc2ggPT4gJChoaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gZ2V0SGFzaENvZGUobi5ub2RlS2V5KCkpID09PSBoYXNoKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgaXNSZWNvcmQgPSBub2RlID0+IGlzU29tZXRoaW5nKG5vZGUpICYmIG5vZGUudHlwZSA9PT0gJ3JlY29yZCc7XG5leHBvcnQgY29uc3QgaXNTaW5nbGVSZWNvcmQgPSBub2RlID0+IGlzUmVjb3JkKG5vZGUpICYmIG5vZGUuaXNTaW5nbGU7XG5leHBvcnQgY29uc3QgaXNDb2xsZWN0aW9uUmVjb3JkID0gbm9kZSA9PiBpc1JlY29yZChub2RlKSAmJiAhbm9kZS5pc1NpbmdsZTtcbmV4cG9ydCBjb25zdCBpc0luZGV4ID0gbm9kZSA9PiBpc1NvbWV0aGluZyhub2RlKSAmJiBub2RlLnR5cGUgPT09ICdpbmRleCc7XG5leHBvcnQgY29uc3QgaXNhZ2dyZWdhdGVHcm91cCA9IG5vZGUgPT4gaXNTb21ldGhpbmcobm9kZSkgJiYgbm9kZS50eXBlID09PSAnYWdncmVnYXRlR3JvdXAnO1xuZXhwb3J0IGNvbnN0IGlzU2hhcmRlZEluZGV4ID0gbm9kZSA9PiBpc0luZGV4KG5vZGUpICYmIGlzTm9uRW1wdHlTdHJpbmcobm9kZS5nZXRTaGFyZE5hbWUpO1xuZXhwb3J0IGNvbnN0IGlzUm9vdCA9IG5vZGUgPT4gaXNTb21ldGhpbmcobm9kZSkgJiYgbm9kZS5pc1Jvb3QoKTtcbmV4cG9ydCBjb25zdCBpc0RlY2VuZGFudE9mQVJlY29yZCA9IGhhc01hdGNoaW5nQW5jZXN0b3IoaXNSZWNvcmQpO1xuZXhwb3J0IGNvbnN0IGlzR2xvYmFsSW5kZXggPSBub2RlID0+IGlzSW5kZXgobm9kZSkgJiYgaXNSb290KG5vZGUucGFyZW50KCkpO1xuZXhwb3J0IGNvbnN0IGlzUmVmZXJlbmNlSW5kZXggPSBub2RlID0+IGlzSW5kZXgobm9kZSkgJiYgbm9kZS5pbmRleFR5cGUgPT09IGluZGV4VHlwZXMucmVmZXJlbmNlO1xuZXhwb3J0IGNvbnN0IGlzQW5jZXN0b3JJbmRleCA9IG5vZGUgPT4gaXNJbmRleChub2RlKSAmJiBub2RlLmluZGV4VHlwZSA9PT0gaW5kZXhUeXBlcy5hbmNlc3RvcjtcblxuZXhwb3J0IGNvbnN0IGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUgPSBub2RlID0+IGZpZWxkID0+IGZpZWxkLnR5cGUgPT09ICdyZWZlcmVuY2UnXG4gICAgJiYgaW50ZXJzZWN0aW9uKGZpZWxkLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzKShtYXAoaSA9PiBpLm5vZGVLZXkoKSkobm9kZS5pbmRleGVzKSlcbiAgICAgIC5sZW5ndGggPiAwO1xuXG5leHBvcnQgY29uc3QgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXggPSBpbmRleE5vZGUgPT4gZmllbGQgPT4gZmllbGQudHlwZSA9PT0gJ3JlZmVyZW5jZSdcbiAgICAmJiBpbnRlcnNlY3Rpb24oZmllbGQudHlwZU9wdGlvbnMucmV2ZXJzZUluZGV4Tm9kZUtleXMpKFtpbmRleE5vZGUubm9kZUtleSgpXSlcbiAgICAgIC5sZW5ndGggPiAwO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdldExhc3RQYXJ0SW5LZXksXG4gIGdldE5vZGVzSW5QYXRoLFxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxuICBoYXNNYXRjaGluZ0FuY2VzdG9yLFxuICBnZXROb2RlLFxuICBnZXROb2RlQnlLZXlPck5vZGVLZXksXG4gIGlzTm9kZSxcbiAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQsXG4gIGdldFBhcmVudEtleSxcbiAgaXNLZXlBbmNlc3Rvck9mLFxuICBoYXNOb01hdGNoaW5nQW5jZXN0b3JzLFxuICBmaW5kRmllbGQsXG4gIGlzQW5jZXN0b3IsXG4gIGlzRGVjZW5kYW50LFxuICBnZXRSZWNvcmROb2RlSWQsXG4gIGdldFJlY29yZE5vZGVJZEZyb21JZCxcbiAgZ2V0UmVjb3JkTm9kZUJ5SWQsXG4gIHJlY29yZE5vZGVJZElzQWxsb3dlZCxcbiAgcmVjb3JkTm9kZUlzQWxsb3dlZCxcbiAgZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgsXG4gIGdldE5vZGVGcm9tTm9kZUtleUhhc2gsXG4gIGlzUmVjb3JkLFxuICBpc0NvbGxlY3Rpb25SZWNvcmQsXG4gIGlzSW5kZXgsXG4gIGlzYWdncmVnYXRlR3JvdXAsXG4gIGlzU2hhcmRlZEluZGV4LFxuICBpc1Jvb3QsXG4gIGlzRGVjZW5kYW50T2ZBUmVjb3JkLFxuICBpc0dsb2JhbEluZGV4LFxuICBpc1JlZmVyZW5jZUluZGV4LFxuICBpc0FuY2VzdG9ySW5kZXgsXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUsXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4LFxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG59O1xuIiwiaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgY29uc3RhbnQsIGlzVW5kZWZpbmVkLCBoYXMsXG4gIG1hcFZhbHVlcywgY2xvbmVEZWVwLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgaXNOb3RFbXB0eSB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBnZXRTYWZlRmllbGRQYXJzZXIgPSAodHJ5UGFyc2UsIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucykgPT4gKGZpZWxkLCByZWNvcmQpID0+IHtcbiAgaWYgKGhhcyhmaWVsZC5uYW1lKShyZWNvcmQpKSB7XG4gICAgcmV0dXJuIGdldFNhZmVWYWx1ZVBhcnNlcih0cnlQYXJzZSwgZGVmYXVsdFZhbHVlRnVuY3Rpb25zKShyZWNvcmRbZmllbGQubmFtZV0pO1xuICB9XG4gIHJldHVybiBkZWZhdWx0VmFsdWVGdW5jdGlvbnNbZmllbGQuZ2V0VW5kZWZpbmVkVmFsdWVdKCk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U2FmZVZhbHVlUGFyc2VyID0gKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpID0+ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBwYXJzZWQgPSB0cnlQYXJzZSh2YWx1ZSk7XG4gIGlmIChwYXJzZWQuc3VjY2Vzcykge1xuICAgIHJldHVybiBwYXJzZWQudmFsdWU7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucy5kZWZhdWx0KCk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3VmFsdWUgPSAodHJ5UGFyc2UsIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucykgPT4gKGZpZWxkKSA9PiB7XG4gIGNvbnN0IGdldEluaXRpYWxWYWx1ZSA9IGlzVW5kZWZpbmVkKGZpZWxkKSB8fCBpc1VuZGVmaW5lZChmaWVsZC5nZXRJbml0aWFsVmFsdWUpXG4gICAgPyAnZGVmYXVsdCdcbiAgICA6IGZpZWxkLmdldEluaXRpYWxWYWx1ZTtcblxuICByZXR1cm4gaGFzKGdldEluaXRpYWxWYWx1ZSkoZGVmYXVsdFZhbHVlRnVuY3Rpb25zKVxuICAgID8gZGVmYXVsdFZhbHVlRnVuY3Rpb25zW2dldEluaXRpYWxWYWx1ZV0oKVxuICAgIDogZ2V0U2FmZVZhbHVlUGFyc2VyKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpKGdldEluaXRpYWxWYWx1ZSk7XG59O1xuXG5leHBvcnQgY29uc3QgdHlwZUZ1bmN0aW9ucyA9IHNwZWNpZmljRnVuY3Rpb25zID0+IG1lcmdlKHtcbiAgdmFsdWU6IGNvbnN0YW50LFxuICBudWxsOiBjb25zdGFudChudWxsKSxcbn0sIHNwZWNpZmljRnVuY3Rpb25zKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzID0gdmFsaWRhdGlvblJ1bGVzID0+IGFzeW5jIChmaWVsZCwgcmVjb3JkLCBjb250ZXh0KSA9PiB7XG4gIGNvbnN0IGZpZWxkVmFsdWUgPSByZWNvcmRbZmllbGQubmFtZV07XG4gIGNvbnN0IHZhbGlkYXRlUnVsZSA9IGFzeW5jIHIgPT4gKCFhd2FpdCByLmlzVmFsaWQoZmllbGRWYWx1ZSwgZmllbGQudHlwZU9wdGlvbnMsIGNvbnRleHQpXG4gICAgPyByLmdldE1lc3NhZ2UoZmllbGRWYWx1ZSwgZmllbGQudHlwZU9wdGlvbnMpXG4gICAgOiAnJyk7XG5cbiAgY29uc3QgZXJyb3JzID0gW107XG4gIGZvciAoY29uc3QgciBvZiB2YWxpZGF0aW9uUnVsZXMpIHtcbiAgICBjb25zdCBlcnIgPSBhd2FpdCB2YWxpZGF0ZVJ1bGUocik7XG4gICAgaWYgKGlzTm90RW1wdHkoZXJyKSkgZXJyb3JzLnB1c2goZXJyKTtcbiAgfVxuXG4gIHJldHVybiBlcnJvcnM7XG59O1xuXG5jb25zdCBnZXREZWZhdWx0T3B0aW9ucyA9IG1hcFZhbHVlcyh2ID0+IHYuZGVmYXVsdFZhbHVlKTtcblxuZXhwb3J0IGNvbnN0IG1ha2VydWxlID0gKGlzVmFsaWQsIGdldE1lc3NhZ2UpID0+ICh7IGlzVmFsaWQsIGdldE1lc3NhZ2UgfSk7XG5leHBvcnQgY29uc3QgcGFyc2VkRmFpbGVkID0gdmFsID0+ICh7IHN1Y2Nlc3M6IGZhbHNlLCB2YWx1ZTogdmFsIH0pO1xuZXhwb3J0IGNvbnN0IHBhcnNlZFN1Y2Nlc3MgPSB2YWwgPT4gKHsgc3VjY2VzczogdHJ1ZSwgdmFsdWU6IHZhbCB9KTtcbmV4cG9ydCBjb25zdCBnZXREZWZhdWx0RXhwb3J0ID0gKG5hbWUsIHRyeVBhcnNlLCBmdW5jdGlvbnMsIG9wdGlvbnMsIHZhbGlkYXRpb25SdWxlcywgc2FtcGxlVmFsdWUsIHN0cmluZ2lmeSkgPT4gKHtcbiAgZ2V0TmV3OiBnZXROZXdWYWx1ZSh0cnlQYXJzZSwgZnVuY3Rpb25zKSxcbiAgc2FmZVBhcnNlRmllbGQ6IGdldFNhZmVGaWVsZFBhcnNlcih0cnlQYXJzZSwgZnVuY3Rpb25zKSxcbiAgc2FmZVBhcnNlVmFsdWU6IGdldFNhZmVWYWx1ZVBhcnNlcih0cnlQYXJzZSwgZnVuY3Rpb25zKSxcbiAgdHJ5UGFyc2UsXG4gIG5hbWUsXG4gIGdldERlZmF1bHRPcHRpb25zOiAoKSA9PiBnZXREZWZhdWx0T3B0aW9ucyhjbG9uZURlZXAob3B0aW9ucykpLFxuICBvcHRpb25EZWZpbml0aW9uczogb3B0aW9ucyxcbiAgdmFsaWRhdGVUeXBlQ29uc3RyYWludHM6IHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzKHZhbGlkYXRpb25SdWxlcyksXG4gIHNhbXBsZVZhbHVlLFxuICBzdHJpbmdpZnk6IHZhbCA9PiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkXG4gICAgPyAnJyA6IHN0cmluZ2lmeSh2YWwpKSxcbiAgZ2V0RGVmYXVsdFZhbHVlOiBmdW5jdGlvbnMuZGVmYXVsdCxcbn0pO1xuIiwiaW1wb3J0IHtcbiAgY29uc3RhbnQsIGlzU3RyaW5nLFxuICBpc051bGwsIGluY2x1ZGVzLCBpc0Jvb2xlYW4sXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICB0eXBlRnVuY3Rpb25zLFxuICBtYWtlcnVsZSwgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9Cb29sT3JOdWxsLCB0b051bWJlck9yTnVsbCxcbiAgaXNTYWZlSW50ZWdlciwgaXNBcnJheU9mU3RyaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBzdHJpbmdGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogY29uc3RhbnQobnVsbCksXG59KTtcblxuY29uc3Qgc3RyaW5nVHJ5UGFyc2UgPSBzd2l0Y2hDYXNlKFxuICBbaXNTdHJpbmcsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNOdWxsLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2RlZmF1bHRDYXNlLCB2ID0+IHBhcnNlZFN1Y2Nlc3Modi50b1N0cmluZygpKV0sXG4pO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBtYXhMZW5ndGg6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgaXNWYWxpZDogbiA9PiBuID09PSBudWxsIHx8IGlzU2FmZUludGVnZXIobikgJiYgbiA+IDAsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ21heCBsZW5ndGggbXVzdCBiZSBudWxsIChubyBsaW1pdCkgb3IgYSBncmVhdGVyIHRoYW4gemVybyBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG4gIHZhbHVlczoge1xuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICBpc1ZhbGlkOiB2ID0+IHYgPT09IG51bGwgfHwgKGlzQXJyYXlPZlN0cmluZyh2KSAmJiB2Lmxlbmd0aCA+IDAgJiYgdi5sZW5ndGggPCAxMDAwMCksXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogXCIndmFsdWVzJyBtdXN0IGJlIG51bGwgKG5vIHZhbHVlcykgb3IgYW4gYXJyeSBvZiBhdCBsZWFzdCBvbmUgc3RyaW5nXCIsXG4gICAgcGFyc2U6IHMgPT4gcyxcbiAgfSxcbiAgYWxsb3dEZWNsYXJlZFZhbHVlc09ubHk6IHtcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIGlzVmFsaWQ6IGlzQm9vbGVhbixcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnYWxsb3dEZWNsYXJlZFZhbHVlc09ubHkgbXVzdCBiZSB0cnVlIG9yIGZhbHNlJyxcbiAgICBwYXJzZTogdG9Cb29sT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5tYXhMZW5ndGggPT09IG51bGwgfHwgdmFsLmxlbmd0aCA8PSBvcHRzLm1heExlbmd0aCxcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgZXhjZWVkcyBtYXhpbXVtIGxlbmd0aCBvZiAke29wdHMubWF4TGVuZ3RofWApLFxuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IG9wdHMuYWxsb3dEZWNsYXJlZFZhbHVlc09ubHkgPT09IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBpbmNsdWRlcyh2YWwpKG9wdHMudmFsdWVzKSxcbiAgKHZhbCkgPT4gYFwiJHt2YWx9XCIgZG9lcyBub3QgZXhpc3QgaW4gdGhlIGxpc3Qgb2YgYWxsb3dlZCB2YWx1ZXNgKSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXG4gICdzdHJpbmcnLFxuICBzdHJpbmdUcnlQYXJzZSxcbiAgc3RyaW5nRnVuY3Rpb25zLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gICdhYmNkZScsXG4gIHN0ciA9PiBzdHIsXG4pO1xuIiwiaW1wb3J0IHsgY29uc3RhbnQsIGlzQm9vbGVhbiwgaXNOdWxsIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIHR5cGVGdW5jdGlvbnMsXG4gIG1ha2VydWxlLCBwYXJzZWRGYWlsZWQsIHBhcnNlZFN1Y2Nlc3MsXG4gIGdldERlZmF1bHRFeHBvcnQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIGlzT25lT2YsIHRvQm9vbE9yTnVsbCxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgYm9vbEZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBjb25zdGFudChudWxsKSxcbn0pO1xuXG5jb25zdCBib29sVHJ5UGFyc2UgPSBzd2l0Y2hDYXNlKFxuICBbaXNCb29sZWFuLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXG4gIFtpc09uZU9mKCd0cnVlJywgJzEnLCAneWVzJywgJ29uJyksICgpID0+IHBhcnNlZFN1Y2Nlc3ModHJ1ZSldLFxuICBbaXNPbmVPZignZmFsc2UnLCAnMCcsICdubycsICdvZmYnKSwgKCkgPT4gcGFyc2VkU3VjY2VzcyhmYWxzZSldLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBhbGxvd051bGxzOiB7XG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIGlzVmFsaWQ6IGlzQm9vbGVhbixcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHRydWUgb3IgZmFsc2UnLFxuICAgIHBhcnNlOiB0b0Jvb2xPck51bGwsXG4gIH0sXG59O1xuXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IG9wdHMuYWxsb3dOdWxscyA9PT0gdHJ1ZSB8fCB2YWwgIT09IG51bGwsXG4gICAgKCkgPT4gJ2ZpZWxkIGNhbm5vdCBiZSBudWxsJyksXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxuICAnYm9vbCcsIGJvb2xUcnlQYXJzZSwgYm9vbEZ1bmN0aW9ucyxcbiAgb3B0aW9ucywgdHlwZUNvbnN0cmFpbnRzLCB0cnVlLCBKU09OLnN0cmluZ2lmeSxcbik7XG4iLCJpbXBvcnQge1xuICBjb25zdGFudCwgaXNOdW1iZXIsIGlzU3RyaW5nLCBpc051bGwsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBtYWtlcnVsZSwgdHlwZUZ1bmN0aW9ucyxcbiAgcGFyc2VkRmFpbGVkLCBwYXJzZWRTdWNjZXNzLCBnZXREZWZhdWx0RXhwb3J0LFxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLCB0b051bWJlck9yTnVsbCxcbiAgaXNTYWZlSW50ZWdlcixcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgbnVtYmVyRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XG4gIGRlZmF1bHQ6IGNvbnN0YW50KG51bGwpLFxufSk7XG5cbmNvbnN0IHBhcnNlU3RyaW5ndG9OdW1iZXJPck51bGwgPSAocykgPT4ge1xuICBjb25zdCBudW0gPSBOdW1iZXIocyk7XG4gIHJldHVybiBpc05hTihudW0pID8gcGFyc2VkRmFpbGVkKHMpIDogcGFyc2VkU3VjY2VzcyhudW0pO1xufTtcblxuY29uc3QgbnVtYmVyVHJ5UGFyc2UgPSBzd2l0Y2hDYXNlKFxuICBbaXNOdW1iZXIsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNTdHJpbmcsIHBhcnNlU3RyaW5ndG9OdW1iZXJPck51bGxdLFxuICBbaXNOdWxsLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2RlZmF1bHRDYXNlLCBwYXJzZWRGYWlsZWRdLFxuKTtcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgbWF4VmFsdWU6IHtcbiAgICBkZWZhdWx0VmFsdWU6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICAgIGlzVmFsaWQ6IGlzU2FmZUludGVnZXIsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB2YWxpZCBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG4gIG1pblZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiAwIC0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIsXG4gICAgaXNWYWxpZDogaXNTYWZlSW50ZWdlcixcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHZhbGlkIGludGVnZXInLFxuICAgIHBhcnNlOiB0b051bWJlck9yTnVsbCxcbiAgfSxcbiAgZGVjaW1hbFBsYWNlczoge1xuICAgIGRlZmF1bHRWYWx1ZTogMCxcbiAgICBpc1ZhbGlkOiBuID0+IGlzU2FmZUludGVnZXIobikgJiYgbiA+PSAwLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlcicsXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgZ2V0RGVjaW1hbFBsYWNlcyA9ICh2YWwpID0+IHtcbiAgY29uc3Qgc3BsaXREZWNpbWFsID0gdmFsLnRvU3RyaW5nKCkuc3BsaXQoJy4nKTtcbiAgaWYgKHNwbGl0RGVjaW1hbC5sZW5ndGggPT09IDEpIHJldHVybiAwO1xuICByZXR1cm4gc3BsaXREZWNpbWFsWzFdLmxlbmd0aDtcbn07XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWluVmFsdWUgPT09IG51bGwgfHwgdmFsID49IG9wdHMubWluVmFsdWUsXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlICgke3ZhbC50b1N0cmluZygpfSkgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtvcHRzLm1pblZhbHVlfWApLFxuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5tYXhWYWx1ZSA9PT0gbnVsbCB8fCB2YWwgPD0gb3B0cy5tYXhWYWx1ZSxcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgKCR7dmFsLnRvU3RyaW5nKCl9KSBtdXN0IGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke29wdHMubWluVmFsdWV9IG9wdGlvbnNgKSxcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMuZGVjaW1hbFBsYWNlcyA+PSBnZXREZWNpbWFsUGxhY2VzKHZhbCksXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlICgke3ZhbC50b1N0cmluZygpfSkgbXVzdCBoYXZlICR7b3B0cy5kZWNpbWFsUGxhY2VzfSBkZWNpbWFsIHBsYWNlcyBvciBsZXNzYCksXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxuICAnbnVtYmVyJyxcbiAgbnVtYmVyVHJ5UGFyc2UsXG4gIG51bWJlckZ1bmN0aW9ucyxcbiAgb3B0aW9ucyxcbiAgdHlwZUNvbnN0cmFpbnRzLFxuICAxLFxuICBudW0gPT4gbnVtLnRvU3RyaW5nKCksXG4pO1xuIiwiaW1wb3J0IHtcbiAgY29uc3RhbnQsIGlzRGF0ZSwgaXNTdHJpbmcsIGlzTnVsbFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgbWFrZXJ1bGUsIHR5cGVGdW5jdGlvbnMsXG4gIHBhcnNlZEZhaWxlZCwgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9EYXRlT3JOdWxsLFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBkYXRlRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XG4gIGRlZmF1bHQ6IGNvbnN0YW50KG51bGwpLFxuICBub3c6ICgpID0+IG5ldyBEYXRlKCksXG59KTtcblxuY29uc3QgaXNWYWxpZERhdGUgPSBkID0+IGQgaW5zdGFuY2VvZiBEYXRlICYmICFpc05hTihkKTtcblxuY29uc3QgcGFyc2VTdHJpbmdUb0RhdGUgPSBzID0+IHN3aXRjaENhc2UoXG4gIFtpc1ZhbGlkRGF0ZSwgcGFyc2VkU3VjY2Vzc10sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbikobmV3IERhdGUocykpO1xuXG5cbmNvbnN0IGRhdGVUcnlQYXJzZSA9IHN3aXRjaENhc2UoXG4gIFtpc0RhdGUsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNTdHJpbmcsIHBhcnNlU3RyaW5nVG9EYXRlXSxcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbik7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIG1heFZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBuZXcgRGF0ZSgzMjUwMzY4MDAwMDAwMCksXG4gICAgaXNWYWxpZDogaXNEYXRlLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgdmFsaWQgZGF0ZScsXG4gICAgcGFyc2U6IHRvRGF0ZU9yTnVsbCxcbiAgfSxcbiAgbWluVmFsdWU6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG5ldyBEYXRlKC04NTIwMzM2MDAwMDAwKSxcbiAgICBpc1ZhbGlkOiBpc0RhdGUsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB2YWxpZCBkYXRlJyxcbiAgICBwYXJzZTogdG9EYXRlT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5taW5WYWx1ZSA9PT0gbnVsbCB8fCB2YWwgPj0gb3B0cy5taW5WYWx1ZSxcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgKCR7dmFsLnRvU3RyaW5nKCl9KSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAke29wdHMubWluVmFsdWV9YCksXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCBvcHRzLm1heFZhbHVlID09PSBudWxsIHx8IHZhbCA8PSBvcHRzLm1heFZhbHVlLFxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSAoJHt2YWwudG9TdHJpbmcoKX0pIG11c3QgYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvICR7b3B0cy5taW5WYWx1ZX0gb3B0aW9uc2ApLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcbiAgJ2RhdGV0aW1lJyxcbiAgZGF0ZVRyeVBhcnNlLFxuICBkYXRlRnVuY3Rpb25zLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gIG5ldyBEYXRlKDE5ODQsIDQsIDEpLFxuICBkYXRlID0+IEpTT04uc3RyaW5naWZ5KGRhdGUpLnJlcGxhY2UobmV3IFJlZ0V4cCgnXCInLCAnZycpLCAnJyksXG4pO1xuIiwiaW1wb3J0IHsgXG4gIG1hcCwgIGNvbnN0YW50LCBpc0FycmF5IFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgdHlwZUZ1bmN0aW9ucywgbWFrZXJ1bGUsXG4gIHBhcnNlZEZhaWxlZCwgZ2V0RGVmYXVsdEV4cG9ydCwgcGFyc2VkU3VjY2Vzcyxcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9OdW1iZXJPck51bGwsXG4gICQkLCBpc1NhZmVJbnRlZ2VyLFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBhcnJheUZ1bmN0aW9ucyA9ICgpID0+IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBjb25zdGFudChbXSksXG59KTtcblxuY29uc3QgbWFwVG9QYXJzZWRBcnJhcnkgPSB0eXBlID0+ICQkKFxuICBtYXAoaSA9PiB0eXBlLnNhZmVQYXJzZVZhbHVlKGkpKSxcbiAgcGFyc2VkU3VjY2Vzcyxcbik7XG5cbmNvbnN0IGFycmF5VHJ5UGFyc2UgPSB0eXBlID0+IHN3aXRjaENhc2UoXG4gIFtpc0FycmF5LCBtYXBUb1BhcnNlZEFycmFyeSh0eXBlKV0sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbik7XG5cbmNvbnN0IHR5cGVOYW1lID0gdHlwZSA9PiBgYXJyYXk8JHt0eXBlfT5gO1xuXG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIG1heExlbmd0aDoge1xuICAgIGRlZmF1bHRWYWx1ZTogMTAwMDAsXG4gICAgaXNWYWxpZDogaXNTYWZlSW50ZWdlcixcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXInLFxuICAgIHBhcnNlOiB0b051bWJlck9yTnVsbCxcbiAgfSxcbiAgbWluTGVuZ3RoOiB7XG4gICAgZGVmYXVsdFZhbHVlOiAwLFxuICAgIGlzVmFsaWQ6IG4gPT4gaXNTYWZlSW50ZWdlcihuKSAmJiBuID49IDAsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG59O1xuXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCB2YWwubGVuZ3RoID49IG9wdHMubWluTGVuZ3RoLFxuICAgICh2YWwsIG9wdHMpID0+IGBtdXN0IGNob29zZSAke29wdHMubWluTGVuZ3RofSBvciBtb3JlIG9wdGlvbnNgKSxcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IHZhbC5sZW5ndGggPD0gb3B0cy5tYXhMZW5ndGgsXG4gICAgKHZhbCwgb3B0cykgPT4gYGNhbm5vdCBjaG9vc2UgbW9yZSB0aGFuICR7b3B0cy5tYXhMZW5ndGh9IG9wdGlvbnNgKSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IHR5cGUgPT4gZ2V0RGVmYXVsdEV4cG9ydChcbiAgdHlwZU5hbWUodHlwZS5uYW1lKSxcbiAgYXJyYXlUcnlQYXJzZSh0eXBlKSxcbiAgYXJyYXlGdW5jdGlvbnModHlwZSksXG4gIG9wdGlvbnMsXG4gIHR5cGVDb25zdHJhaW50cyxcbiAgW3R5cGUuc2FtcGxlVmFsdWVdLFxuICBKU09OLnN0cmluZ2lmeSxcbik7XG4iLCJpbXBvcnQge1xuICBpc1N0cmluZywgaXNPYmplY3RMaWtlLFxuICBpc051bGwsIGhhcywgaXNFbXB0eSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIHR5cGVGdW5jdGlvbnMsIG1ha2VydWxlLFxuICBwYXJzZWRTdWNjZXNzLCBnZXREZWZhdWx0RXhwb3J0LFxuICBwYXJzZWRGYWlsZWQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsXG4gIGlzTm9uRW1wdHlTdHJpbmcsIGlzQXJyYXlPZlN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgcmVmZXJlbmNlTm90aGluZyA9ICgpID0+ICh7IGtleTogJycgfSk7XG5cbmNvbnN0IHJlZmVyZW5jZUZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiByZWZlcmVuY2VOb3RoaW5nLFxufSk7XG5cbmNvbnN0IGhhc1N0cmluZ1ZhbHVlID0gKG9iLCBwYXRoKSA9PiBoYXMocGF0aCkob2IpXG4gICAgJiYgaXNTdHJpbmcob2JbcGF0aF0pO1xuXG5jb25zdCBpc09iamVjdFdpdGhLZXkgPSB2ID0+IGlzT2JqZWN0TGlrZSh2KVxuICAgICYmIGhhc1N0cmluZ1ZhbHVlKHYsICdrZXknKTtcblxuY29uc3QgdHJ5UGFyc2VGcm9tU3RyaW5nID0gcyA9PiB7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBhc09iaiA9IEpTT04ucGFyc2Uocyk7XG4gICAgaWYoaXNPYmplY3RXaXRoS2V5KSB7XG4gICAgICByZXR1cm4gcGFyc2VkU3VjY2Vzcyhhc09iaik7XG4gICAgfVxuICB9XG4gIGNhdGNoKF8pIHtcbiAgICAvLyBFTVBUWVxuICB9XG5cbiAgcmV0dXJuIHBhcnNlZEZhaWxlZChzKTtcbn1cblxuY29uc3QgcmVmZXJlbmNlVHJ5UGFyc2UgPSB2ID0+IHN3aXRjaENhc2UoXG4gIFtpc09iamVjdFdpdGhLZXksIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNTdHJpbmcsIHRyeVBhcnNlRnJvbVN0cmluZ10sXG4gIFtpc051bGwsICgpID0+IHBhcnNlZFN1Y2Nlc3MocmVmZXJlbmNlTm90aGluZygpKV0sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbikodik7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIGluZGV4Tm9kZUtleToge1xuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICBpc1ZhbGlkOiBpc05vbkVtcHR5U3RyaW5nLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZycsXG4gICAgcGFyc2U6IHMgPT4gcyxcbiAgfSxcbiAgZGlzcGxheVZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiAnJyxcbiAgICBpc1ZhbGlkOiBpc05vbkVtcHR5U3RyaW5nLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZycsXG4gICAgcGFyc2U6IHMgPT4gcyxcbiAgfSxcbiAgcmV2ZXJzZUluZGV4Tm9kZUtleXM6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgaXNWYWxpZDogdiA9PiBpc0FycmF5T2ZTdHJpbmcodikgJiYgdi5sZW5ndGggPiAwLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgbm9uLWVtcHR5IGFycmF5IG9mIHN0cmluZ3MnLFxuICAgIHBhcnNlOiBzID0+IHMsXG4gIH0sXG59O1xuXG5jb25zdCBpc0VtcHR5U3RyaW5nID0gcyA9PiBpc1N0cmluZyhzKSAmJiBpc0VtcHR5KHMpO1xuXG5jb25zdCBlbnN1cmVSZWZlcmVuY2VFeGlzdHMgPSBhc3luYyAodmFsLCBvcHRzLCBjb250ZXh0KSA9PiBpc0VtcHR5U3RyaW5nKHZhbC5rZXkpXG4gICAgfHwgYXdhaXQgY29udGV4dC5yZWZlcmVuY2VFeGlzdHMob3B0cywgdmFsLmtleSk7XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcbiAgbWFrZXJ1bGUoXG4gICAgZW5zdXJlUmVmZXJlbmNlRXhpc3RzLFxuICAgICh2YWwsIG9wdHMpID0+IGBcIiR7dmFsW29wdHMuZGlzcGxheVZhbHVlXX1cIiBkb2VzIG5vdCBleGlzdCBpbiBvcHRpb25zIGxpc3QgKGtleTogJHt2YWwua2V5fSlgLFxuICApLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcbiAgJ3JlZmVyZW5jZScsXG4gIHJlZmVyZW5jZVRyeVBhcnNlLFxuICByZWZlcmVuY2VGdW5jdGlvbnMsXG4gIG9wdGlvbnMsXG4gIHR5cGVDb25zdHJhaW50cyxcbiAgeyBrZXk6ICdrZXknLCB2YWx1ZTogJ3ZhbHVlJyB9LFxuICBKU09OLnN0cmluZ2lmeSxcbik7XG4iLCJpbXBvcnQge1xuICBsYXN0LCBoYXMsIGlzU3RyaW5nLCBpbnRlcnNlY3Rpb24sXG4gIGlzTnVsbCwgaXNOdW1iZXIsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICB0eXBlRnVuY3Rpb25zLCBwYXJzZWRGYWlsZWQsXG4gIHBhcnNlZFN1Y2Nlc3MsIGdldERlZmF1bHRFeHBvcnQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIG5vbmUsXG4gICQsIHNwbGl0S2V5LFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBpbGxlZ2FsQ2hhcmFjdGVycyA9ICcqP1xcXFwvOjw+fFxcMFxcYlxcZlxcdic7XG5cbmV4cG9ydCBjb25zdCBpc0xlZ2FsRmlsZW5hbWUgPSAoZmlsZVBhdGgpID0+IHtcbiAgY29uc3QgZm4gPSBmaWxlTmFtZShmaWxlUGF0aCk7XG4gIHJldHVybiBmbi5sZW5ndGggPD0gMjU1XG4gICAgJiYgaW50ZXJzZWN0aW9uKGZuLnNwbGl0KCcnKSkoaWxsZWdhbENoYXJhY3RlcnMuc3BsaXQoJycpKS5sZW5ndGggPT09IDBcbiAgICAmJiBub25lKGYgPT4gZiA9PT0gJy4uJykoc3BsaXRLZXkoZmlsZVBhdGgpKTtcbn07XG5cbmNvbnN0IGZpbGVOb3RoaW5nID0gKCkgPT4gKHsgcmVsYXRpdmVQYXRoOiAnJywgc2l6ZTogMCB9KTtcblxuY29uc3QgZmlsZUZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBmaWxlTm90aGluZyxcbn0pO1xuXG5jb25zdCBmaWxlVHJ5UGFyc2UgPSB2ID0+IHN3aXRjaENhc2UoXG4gIFtpc1ZhbGlkRmlsZSwgcGFyc2VkU3VjY2Vzc10sXG4gIFtpc051bGwsICgpID0+IHBhcnNlZFN1Y2Nlc3MoZmlsZU5vdGhpbmcoKSldLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pKHYpO1xuXG5jb25zdCBmaWxlTmFtZSA9IGZpbGVQYXRoID0+ICQoZmlsZVBhdGgsIFtcbiAgc3BsaXRLZXksXG4gIGxhc3QsXG5dKTtcblxuY29uc3QgaXNWYWxpZEZpbGUgPSBmID0+ICFpc051bGwoZilcbiAgICAmJiBoYXMoJ3JlbGF0aXZlUGF0aCcpKGYpICYmIGhhcygnc2l6ZScpKGYpXG4gICAgJiYgaXNOdW1iZXIoZi5zaXplKVxuICAgICYmIGlzU3RyaW5nKGYucmVsYXRpdmVQYXRoKVxuICAgICYmIGlzTGVnYWxGaWxlbmFtZShmLnJlbGF0aXZlUGF0aCk7XG5cbmNvbnN0IG9wdGlvbnMgPSB7fTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW107XG5cbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXG4gICdmaWxlJyxcbiAgZmlsZVRyeVBhcnNlLFxuICBmaWxlRnVuY3Rpb25zLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gIHsgcmVsYXRpdmVQYXRoOiAnc29tZV9maWxlLmpwZycsIHNpemU6IDEwMDAgfSxcbiAgSlNPTi5zdHJpbmdpZnksXG4pO1xuIiwiaW1wb3J0IHtcbiAgYXNzaWduLCBtZXJnZSwgXG59IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICBtYXAsIGlzU3RyaW5nLCBpc051bWJlcixcbiAgaXNCb29sZWFuLCBpc0RhdGUsIGtleXMsXG4gIGlzT2JqZWN0LCBpc0FycmF5LCBoYXNcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7ICQgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGFyc2VkU3VjY2VzcyB9IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHN0cmluZyBmcm9tICcuL3N0cmluZyc7XG5pbXBvcnQgYm9vbCBmcm9tICcuL2Jvb2wnO1xuaW1wb3J0IG51bWJlciBmcm9tICcuL251bWJlcic7XG5pbXBvcnQgZGF0ZXRpbWUgZnJvbSAnLi9kYXRldGltZSc7XG5pbXBvcnQgYXJyYXkgZnJvbSAnLi9hcnJheSc7XG5pbXBvcnQgcmVmZXJlbmNlIGZyb20gJy4vcmVmZXJlbmNlJztcbmltcG9ydCBmaWxlIGZyb20gJy4vZmlsZSc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuY29uc3QgYWxsVHlwZXMgPSAoKSA9PiB7XG4gIGNvbnN0IGJhc2ljVHlwZXMgPSB7XG4gICAgc3RyaW5nLCBudW1iZXIsIGRhdGV0aW1lLCBib29sLCByZWZlcmVuY2UsIGZpbGUsXG4gIH07XG5cbiAgY29uc3QgYXJyYXlzID0gJChiYXNpY1R5cGVzLCBbXG4gICAga2V5cyxcbiAgICBtYXAoKGspID0+IHtcbiAgICAgIGNvbnN0IGt2VHlwZSA9IHt9O1xuICAgICAgY29uc3QgY29uY3JldGVBcnJheSA9IGFycmF5KGJhc2ljVHlwZXNba10pO1xuICAgICAga3ZUeXBlW2NvbmNyZXRlQXJyYXkubmFtZV0gPSBjb25jcmV0ZUFycmF5O1xuICAgICAgcmV0dXJuIGt2VHlwZTtcbiAgICB9KSxcbiAgICB0eXBlcyA9PiBhc3NpZ24oe30sIC4uLnR5cGVzKSxcbiAgXSk7XG5cbiAgcmV0dXJuIG1lcmdlKHt9LCBiYXNpY1R5cGVzLCBhcnJheXMpO1xufTtcblxuXG5leHBvcnQgY29uc3QgYWxsID0gYWxsVHlwZXMoKTtcblxuZXhwb3J0IGNvbnN0IGdldFR5cGUgPSAodHlwZU5hbWUpID0+IHtcbiAgaWYgKCFoYXModHlwZU5hbWUpKGFsbCkpIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYERvIG5vdCByZWNvZ25pc2UgdHlwZSAke3R5cGVOYW1lfWApO1xuICByZXR1cm4gYWxsW3R5cGVOYW1lXTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRTYW1wbGVGaWVsZFZhbHVlID0gZmllbGQgPT4gZ2V0VHlwZShmaWVsZC50eXBlKS5zYW1wbGVWYWx1ZTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0ZpZWxkVmFsdWUgPSBmaWVsZCA9PiBnZXRUeXBlKGZpZWxkLnR5cGUpLmdldE5ldyhmaWVsZCk7XG5cbmV4cG9ydCBjb25zdCBzYWZlUGFyc2VGaWVsZCA9IChmaWVsZCwgcmVjb3JkKSA9PiBnZXRUeXBlKGZpZWxkLnR5cGUpLnNhZmVQYXJzZUZpZWxkKGZpZWxkLCByZWNvcmQpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVGaWVsZFBhcnNlID0gKGZpZWxkLCByZWNvcmQpID0+IChoYXMoZmllbGQubmFtZSkocmVjb3JkKVxuICA/IGdldFR5cGUoZmllbGQudHlwZSkudHJ5UGFyc2UocmVjb3JkW2ZpZWxkLm5hbWVdKVxuICA6IHBhcnNlZFN1Y2Nlc3ModW5kZWZpbmVkKSk7IC8vIGZpZWxkcyBtYXkgYmUgdW5kZWZpbmVkIGJ5IGRlZmF1bHRcblxuZXhwb3J0IGNvbnN0IGdldERlZmF1bHRPcHRpb25zID0gdHlwZSA9PiBnZXRUeXBlKHR5cGUpLmdldERlZmF1bHRPcHRpb25zKCk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyA9IGFzeW5jIChmaWVsZCwgcmVjb3JkLCBjb250ZXh0KSA9PiBhd2FpdCBnZXRUeXBlKGZpZWxkLnR5cGUpLnZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzKGZpZWxkLCByZWNvcmQsIGNvbnRleHQpO1xuXG5leHBvcnQgY29uc3QgZGV0ZWN0VHlwZSA9ICh2YWx1ZSkgPT4ge1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSByZXR1cm4gc3RyaW5nO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSkgcmV0dXJuIGJvb2w7XG4gIGlmIChpc051bWJlcih2YWx1ZSkpIHJldHVybiBudW1iZXI7XG4gIGlmIChpc0RhdGUodmFsdWUpKSByZXR1cm4gZGF0ZXRpbWU7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkgcmV0dXJuIGFycmF5KGRldGVjdFR5cGUodmFsdWVbMF0pKTtcbiAgaWYgKGlzT2JqZWN0KHZhbHVlKVxuICAgICAgICYmIGhhcygna2V5JykodmFsdWUpXG4gICAgICAgJiYgaGFzKCd2YWx1ZScpKHZhbHVlKSkgcmV0dXJuIHJlZmVyZW5jZTtcbiAgaWYgKGlzT2JqZWN0KHZhbHVlKVxuICAgICAgICAmJiBoYXMoJ3JlbGF0aXZlUGF0aCcpKHZhbHVlKVxuICAgICAgICAmJiBoYXMoJ3NpemUnKSh2YWx1ZSkpIHJldHVybiBmaWxlO1xuXG4gIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYGNhbm5vdCBkZXRlcm1pbmUgdHlwZTogJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSl9YCk7XG59O1xuIiwiaW1wb3J0IHsgY2xvbmUsIGZpbmQsIHNwbGl0IH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGpvaW5LZXksICQgfSBmcm9tICcuLi9jb21tb24nO1xuLy8gNSBtaW51dGVzXG5leHBvcnQgY29uc3QgdGVtcENvZGVFeHBpcnlMZW5ndGggPSA1ICogNjAgKiAxMDAwO1xuXG5leHBvcnQgY29uc3QgQVVUSF9GT0xERVIgPSAnLy5hdXRoJztcbmV4cG9ydCBjb25zdCBVU0VSU19MSVNUX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAndXNlcnMuanNvbicpO1xuZXhwb3J0IGNvbnN0IHVzZXJBdXRoRmlsZSA9IHVzZXJuYW1lID0+IGpvaW5LZXkoQVVUSF9GT0xERVIsIGBhdXRoXyR7dXNlcm5hbWV9Lmpzb25gKTtcbmV4cG9ydCBjb25zdCBVU0VSU19MT0NLX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAndXNlcnNfbG9jaycpO1xuZXhwb3J0IGNvbnN0IEFDQ0VTU19MRVZFTFNfRklMRSA9IGpvaW5LZXkoQVVUSF9GT0xERVIsICdhY2Nlc3NfbGV2ZWxzLmpzb24nKTtcbmV4cG9ydCBjb25zdCBBQ0NFU1NfTEVWRUxTX0xPQ0tfRklMRSA9IGpvaW5LZXkoQVVUSF9GT0xERVIsICdhY2Nlc3NfbGV2ZWxzX2xvY2snKTtcblxuZXhwb3J0IGNvbnN0IHBlcm1pc3Npb25UeXBlcyA9IHtcbiAgQ1JFQVRFX1JFQ09SRDogJ2NyZWF0ZSByZWNvcmQnLFxuICBVUERBVEVfUkVDT1JEOiAndXBkYXRlIHJlY29yZCcsXG4gIFJFQURfUkVDT1JEOiAncmVhZCByZWNvcmQnLFxuICBERUxFVEVfUkVDT1JEOiAnZGVsZXRlIHJlY29yZCcsXG4gIFJFQURfSU5ERVg6ICdyZWFkIGluZGV4JyxcbiAgTUFOQUdFX0lOREVYOiAnbWFuYWdlIGluZGV4JyxcbiAgTUFOQUdFX0NPTExFQ1RJT046ICdtYW5hZ2UgY29sbGVjdGlvbicsXG4gIFdSSVRFX1RFTVBMQVRFUzogJ3dyaXRlIHRlbXBsYXRlcycsXG4gIENSRUFURV9VU0VSOiAnY3JlYXRlIHVzZXInLFxuICBTRVRfUEFTU1dPUkQ6ICdzZXQgcGFzc3dvcmQnLFxuICBDUkVBVEVfVEVNUE9SQVJZX0FDQ0VTUzogJ2NyZWF0ZSB0ZW1wb3JhcnkgYWNjZXNzJyxcbiAgRU5BQkxFX0RJU0FCTEVfVVNFUjogJ2VuYWJsZSBvciBkaXNhYmxlIHVzZXInLFxuICBXUklURV9BQ0NFU1NfTEVWRUxTOiAnd3JpdGUgYWNjZXNzIGxldmVscycsXG4gIExJU1RfVVNFUlM6ICdsaXN0IHVzZXJzJyxcbiAgTElTVF9BQ0NFU1NfTEVWRUxTOiAnbGlzdCBhY2Nlc3MgbGV2ZWxzJyxcbiAgRVhFQ1VURV9BQ1RJT046ICdleGVjdXRlIGFjdGlvbicsXG4gIFNFVF9VU0VSX0FDQ0VTU19MRVZFTFM6ICdzZXQgdXNlciBhY2Nlc3MgbGV2ZWxzJyxcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRVc2VyQnlOYW1lID0gKHVzZXJzLCBuYW1lKSA9PiAkKHVzZXJzLCBbXG4gIGZpbmQodSA9PiB1Lm5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZS50b0xvd2VyQ2FzZSgpKSxcbl0pO1xuXG5leHBvcnQgY29uc3Qgc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZiA9ICh1c2VyKSA9PiB7XG4gIGNvbnN0IHN0cmlwcGVkID0gY2xvbmUodXNlcik7XG4gIGRlbGV0ZSBzdHJpcHBlZC50ZW1wQ29kZTtcbiAgcmV0dXJuIHN0cmlwcGVkO1xufTtcblxuZXhwb3J0IGNvbnN0IHBhcnNlVGVtcG9yYXJ5Q29kZSA9IGZ1bGxDb2RlID0+ICQoZnVsbENvZGUsIFtcbiAgc3BsaXQoJzonKSxcbiAgcGFydHMgPT4gKHtcbiAgICBpZDogcGFydHNbMV0sXG4gICAgY29kZTogcGFydHNbMl0sXG4gIH0pLFxuXSk7XG4iLCJpbXBvcnQgeyB2YWx1ZXMsIGluY2x1ZGVzLCBzb21lIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHBlcm1pc3Npb25UeXBlcyB9IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQge1xuICAkLCBpc05vdGhpbmcsIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXROb2RlQnlLZXlPck5vZGVLZXksIGlzTm9kZSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBpc0F1dGhvcml6ZWQgPSBhcHAgPT4gKHBlcm1pc3Npb25UeXBlLCByZXNvdXJjZUtleSkgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuaXNBdXRob3JpemVkLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHJlc291cmNlS2V5LCBwZXJtaXNzaW9uVHlwZSB9LFxuICBfaXNBdXRob3JpemVkLCBhcHAsIHBlcm1pc3Npb25UeXBlLCByZXNvdXJjZUtleSxcbik7XG5cbmV4cG9ydCBjb25zdCBfaXNBdXRob3JpemVkID0gKGFwcCwgcGVybWlzc2lvblR5cGUsIHJlc291cmNlS2V5KSA9PiB7XG4gIGlmICghYXBwLnVzZXIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCB2YWxpZFR5cGUgPSAkKHBlcm1pc3Npb25UeXBlcywgW1xuICAgIHZhbHVlcyxcbiAgICBpbmNsdWRlcyhwZXJtaXNzaW9uVHlwZSksXG4gIF0pO1xuXG4gIGlmICghdmFsaWRUeXBlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgcGVybU1hdGNoZXNSZXNvdXJjZSA9ICh1c2VycGVybSkgPT4ge1xuICAgIGNvbnN0IG5vZGVLZXkgPSBpc05vdGhpbmcocmVzb3VyY2VLZXkpXG4gICAgICA/IG51bGxcbiAgICAgIDogaXNOb2RlKGFwcC5oaWVyYXJjaHksIHJlc291cmNlS2V5KVxuICAgICAgICA/IGdldE5vZGVCeUtleU9yTm9kZUtleShcbiAgICAgICAgICBhcHAuaGllcmFyY2h5LCByZXNvdXJjZUtleSxcbiAgICAgICAgKS5ub2RlS2V5KClcbiAgICAgICAgOiByZXNvdXJjZUtleTtcblxuICAgIHJldHVybiAodXNlcnBlcm0udHlwZSA9PT0gcGVybWlzc2lvblR5cGUpXG4gICAgICAgICYmIChcbiAgICAgICAgICBpc05vdGhpbmcocmVzb3VyY2VLZXkpXG4gICAgICAgICAgICB8fCBub2RlS2V5ID09PSB1c2VycGVybS5ub2RlS2V5XG4gICAgICAgICk7XG4gIH07XG5cbiAgcmV0dXJuICQoYXBwLnVzZXIucGVybWlzc2lvbnMsIFtcbiAgICBzb21lKHBlcm1NYXRjaGVzUmVzb3VyY2UpLFxuICBdKTtcbn07XG4iLCJpbXBvcnQgeyBwZXJtaXNzaW9uVHlwZXMgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgaXNBdXRob3JpemVkIH0gZnJvbSAnLi9pc0F1dGhvcml6ZWQnO1xuXG5leHBvcnQgY29uc3QgdGVtcG9yYXJ5QWNjZXNzUGVybWlzc2lvbnMgPSAoKSA9PiAoW3sgdHlwZTogcGVybWlzc2lvblR5cGVzLlNFVF9QQVNTV09SRCB9XSk7XG5cbmNvbnN0IG5vZGVQZXJtaXNzaW9uID0gdHlwZSA9PiAoe1xuICBhZGQ6IChub2RlS2V5LCBhY2Nlc3NMZXZlbCkgPT4gYWNjZXNzTGV2ZWwucGVybWlzc2lvbnMucHVzaCh7IHR5cGUsIG5vZGVLZXkgfSksXG4gIGlzQXV0aG9yaXplZDogcmVzb3VyY2VLZXkgPT4gYXBwID0+IGlzQXV0aG9yaXplZChhcHApKHR5cGUsIHJlc291cmNlS2V5KSxcbiAgaXNOb2RlOiB0cnVlLFxuICBnZXQ6IG5vZGVLZXkgPT4gKHsgdHlwZSwgbm9kZUtleSB9KSxcbn0pO1xuXG5jb25zdCBzdGF0aWNQZXJtaXNzaW9uID0gdHlwZSA9PiAoe1xuICBhZGQ6IGFjY2Vzc0xldmVsID0+IGFjY2Vzc0xldmVsLnBlcm1pc3Npb25zLnB1c2goeyB0eXBlIH0pLFxuICBpc0F1dGhvcml6ZWQ6IGFwcCA9PiBpc0F1dGhvcml6ZWQoYXBwKSh0eXBlKSxcbiAgaXNOb2RlOiBmYWxzZSxcbiAgZ2V0OiAoKSA9PiAoeyB0eXBlIH0pLFxufSk7XG5cbmNvbnN0IGNyZWF0ZVJlY29yZCA9IG5vZGVQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfUkVDT1JEKTtcblxuY29uc3QgdXBkYXRlUmVjb3JkID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlVQREFURV9SRUNPUkQpO1xuXG5jb25zdCBkZWxldGVSZWNvcmQgPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuREVMRVRFX1JFQ09SRCk7XG5cbmNvbnN0IHJlYWRSZWNvcmQgPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuUkVBRF9SRUNPUkQpO1xuXG5jb25zdCB3cml0ZVRlbXBsYXRlcyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLldSSVRFX1RFTVBMQVRFUyk7XG5cbmNvbnN0IGNyZWF0ZVVzZXIgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfVVNFUik7XG5cbmNvbnN0IHNldFBhc3N3b3JkID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuU0VUX1BBU1NXT1JEKTtcblxuY29uc3QgcmVhZEluZGV4ID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlJFQURfSU5ERVgpO1xuXG5jb25zdCBtYW5hZ2VJbmRleCA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLk1BTkFHRV9JTkRFWCk7XG5cbmNvbnN0IG1hbmFnZUNvbGxlY3Rpb24gPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5NQU5BR0VfQ09MTEVDVElPTik7XG5cbmNvbnN0IGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkNSRUFURV9URU1QT1JBUllfQUNDRVNTKTtcblxuY29uc3QgZW5hYmxlRGlzYWJsZVVzZXIgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5FTkFCTEVfRElTQUJMRV9VU0VSKTtcblxuY29uc3Qgd3JpdGVBY2Nlc3NMZXZlbHMgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5XUklURV9BQ0NFU1NfTEVWRUxTKTtcblxuY29uc3QgbGlzdFVzZXJzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuTElTVF9VU0VSUyk7XG5cbmNvbnN0IGxpc3RBY2Nlc3NMZXZlbHMgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5MSVNUX0FDQ0VTU19MRVZFTFMpO1xuXG5jb25zdCBzZXRVc2VyQWNjZXNzTGV2ZWxzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuU0VUX1VTRVJfQUNDRVNTX0xFVkVMUyk7XG5cbmNvbnN0IGV4ZWN1dGVBY3Rpb24gPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuRVhFQ1VURV9BQ1RJT04pO1xuXG5leHBvcnQgY29uc3QgYWx3YXlzQXV0aG9yaXplZCA9ICgpID0+IHRydWU7XG5cbmV4cG9ydCBjb25zdCBwZXJtaXNzaW9uID0ge1xuICBjcmVhdGVSZWNvcmQsXG4gIHVwZGF0ZVJlY29yZCxcbiAgZGVsZXRlUmVjb3JkLFxuICByZWFkUmVjb3JkLFxuICB3cml0ZVRlbXBsYXRlcyxcbiAgY3JlYXRlVXNlcixcbiAgc2V0UGFzc3dvcmQsXG4gIHJlYWRJbmRleCxcbiAgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzLFxuICBlbmFibGVEaXNhYmxlVXNlcixcbiAgd3JpdGVBY2Nlc3NMZXZlbHMsXG4gIGxpc3RVc2VycyxcbiAgbGlzdEFjY2Vzc0xldmVscyxcbiAgbWFuYWdlSW5kZXgsXG4gIG1hbmFnZUNvbGxlY3Rpb24sXG4gIGV4ZWN1dGVBY3Rpb24sXG4gIHNldFVzZXJBY2Nlc3NMZXZlbHMsXG59O1xuIiwiaW1wb3J0IHtcbiAga2V5QnksIG1hcFZhbHVlcyxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnc2hvcnRpZCc7XG5pbXBvcnQgeyBcbiAgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoLCBpc1NpbmdsZVJlY29yZCBcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IGdldE5ld0ZpZWxkVmFsdWUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge1xuICAkLCBqb2luS2V5LCBzYWZlS2V5LCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3ID0gYXBwID0+IChjb2xsZWN0aW9uS2V5LCByZWNvcmRUeXBlTmFtZSkgPT4ge1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0UmVjb3JkTm9kZShhcHAsIGNvbGxlY3Rpb25LZXksIHJlY29yZFR5cGVOYW1lKTtcbiAgY29sbGVjdGlvbktleT1zYWZlS2V5KGNvbGxlY3Rpb25LZXkpO1xuICByZXR1cm4gYXBpV3JhcHBlclN5bmMoXG4gICAgYXBwLFxuICAgIGV2ZW50cy5yZWNvcmRBcGkuZ2V0TmV3LFxuICAgIHBlcm1pc3Npb24uY3JlYXRlUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmROb2RlLm5vZGVLZXkoKSksXG4gICAgeyBjb2xsZWN0aW9uS2V5LCByZWNvcmRUeXBlTmFtZSB9LFxuICAgIF9nZXROZXcsIHJlY29yZE5vZGUsIGNvbGxlY3Rpb25LZXksXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgX2dldE5ldyA9IChyZWNvcmROb2RlLCBjb2xsZWN0aW9uS2V5KSA9PiBjb25zdHJ1Y3RSZWNvcmQocmVjb3JkTm9kZSwgZ2V0TmV3RmllbGRWYWx1ZSwgY29sbGVjdGlvbktleSk7XG5cbmNvbnN0IGdldFJlY29yZE5vZGUgPSAoYXBwLCBjb2xsZWN0aW9uS2V5KSA9PiB7XG4gIGNvbGxlY3Rpb25LZXkgPSBzYWZlS2V5KGNvbGxlY3Rpb25LZXkpO1xuICByZXR1cm4gZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoKGFwcC5oaWVyYXJjaHkpKGNvbGxlY3Rpb25LZXkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0NoaWxkID0gYXBwID0+IChyZWNvcmRLZXksIGNvbGxlY3Rpb25OYW1lLCByZWNvcmRUeXBlTmFtZSkgPT4gXG4gIGdldE5ldyhhcHApKGpvaW5LZXkocmVjb3JkS2V5LCBjb2xsZWN0aW9uTmFtZSksIHJlY29yZFR5cGVOYW1lKTtcblxuZXhwb3J0IGNvbnN0IGNvbnN0cnVjdFJlY29yZCA9IChyZWNvcmROb2RlLCBnZXRGaWVsZFZhbHVlLCBjb2xsZWN0aW9uS2V5KSA9PiB7XG4gIGNvbnN0IHJlY29yZCA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBrZXlCeSgnbmFtZScpLFxuICAgIG1hcFZhbHVlcyhnZXRGaWVsZFZhbHVlKSxcbiAgXSk7XG5cbiAgcmVjb3JkLmlkID0gYCR7cmVjb3JkTm9kZS5ub2RlSWR9LSR7Z2VuZXJhdGUoKX1gO1xuICByZWNvcmQua2V5ID0gaXNTaW5nbGVSZWNvcmQocmVjb3JkTm9kZSlcbiAgICAgICAgICAgICAgID8gam9pbktleShjb2xsZWN0aW9uS2V5LCByZWNvcmROb2RlLm5hbWUpXG4gICAgICAgICAgICAgICA6IGpvaW5LZXkoY29sbGVjdGlvbktleSwgcmVjb3JkLmlkKTtcbiAgcmVjb3JkLmlzTmV3ID0gdHJ1ZTtcbiAgcmVjb3JkLnR5cGUgPSByZWNvcmROb2RlLm5hbWU7XG4gIHJldHVybiByZWNvcmQ7XG59O1xuIiwiaW1wb3J0IHtcbiAga2V5QnksIG1hcFZhbHVlcywgZmlsdGVyLCBcbiAgbWFwLCBpbmNsdWRlcywgbGFzdCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdldEV4YWN0Tm9kZUZvclBhdGgsIGdldE5vZGUgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgc2FmZVBhcnNlRmllbGQgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge1xuICAkLCBzcGxpdEtleSwgc2FmZUtleSwgaXNOb25FbXB0eVN0cmluZyxcbiAgYXBpV3JhcHBlciwgZXZlbnRzLCBqb2luS2V5LFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgbWFwUmVjb3JkIH0gZnJvbSAnLi4vaW5kZXhpbmcvZXZhbHVhdGUnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkRmlsZU5hbWUgPSBrZXkgPT4gam9pbktleShrZXksICdyZWNvcmQuanNvbicpO1xuXG5leHBvcnQgY29uc3QgbG9hZCA9IGFwcCA9PiBhc3luYyBrZXkgPT4ge1xuICBrZXkgPSBzYWZlS2V5KGtleSk7XG4gIHJldHVybiBhcGlXcmFwcGVyKFxuICAgIGFwcCxcbiAgICBldmVudHMucmVjb3JkQXBpLmxvYWQsXG4gICAgcGVybWlzc2lvbi5yZWFkUmVjb3JkLmlzQXV0aG9yaXplZChrZXkpLFxuICAgIHsga2V5IH0sXG4gICAgX2xvYWQsIGFwcCwga2V5LFxuICApO1xufVxuXG5leHBvcnQgY29uc3QgX2xvYWQgPSBhc3luYyAoYXBwLCBrZXksIGtleVN0YWNrID0gW10pID0+IHtcbiAga2V5ID0gc2FmZUtleShrZXkpO1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShrZXkpO1xuICBjb25zdCBzdG9yZWREYXRhID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICBnZXRSZWNvcmRGaWxlTmFtZShrZXkpLFxuICApO1xuXG4gIGNvbnN0IGxvYWRlZFJlY29yZCA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBrZXlCeSgnbmFtZScpLFxuICAgIG1hcFZhbHVlcyhmID0+IHNhZmVQYXJzZUZpZWxkKGYsIHN0b3JlZERhdGEpKSxcbiAgXSk7XG5cbiAgY29uc3QgbmV3S2V5U3RhY2sgPSBbLi4ua2V5U3RhY2ssIGtleV07XG5cbiAgY29uc3QgcmVmZXJlbmNlcyA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBmaWx0ZXIoZiA9PiBmLnR5cGUgPT09ICdyZWZlcmVuY2UnXG4gICAgICAgICAgICAgICAgICAgICYmIGlzTm9uRW1wdHlTdHJpbmcobG9hZGVkUmVjb3JkW2YubmFtZV0ua2V5KVxuICAgICAgICAgICAgICAgICAgICAmJiAhaW5jbHVkZXMobG9hZGVkUmVjb3JkW2YubmFtZV0ua2V5KShuZXdLZXlTdGFjaykpLFxuICAgIG1hcChmID0+ICh7XG4gICAgICBwcm9taXNlOiBfbG9hZChhcHAsIGxvYWRlZFJlY29yZFtmLm5hbWVdLmtleSwgbmV3S2V5U3RhY2spLFxuICAgICAgaW5kZXg6IGdldE5vZGUoYXBwLmhpZXJhcmNoeSwgZi50eXBlT3B0aW9ucy5pbmRleE5vZGVLZXkpLFxuICAgICAgZmllbGQ6IGYsXG4gICAgfSkpLFxuICBdKTtcblxuICBpZiAocmVmZXJlbmNlcy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgcmVmUmVjb3JkcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgbWFwKHAgPT4gcC5wcm9taXNlKShyZWZlcmVuY2VzKSxcbiAgICApO1xuXG4gICAgZm9yIChjb25zdCByZWYgb2YgcmVmZXJlbmNlcykge1xuICAgICAgbG9hZGVkUmVjb3JkW3JlZi5maWVsZC5uYW1lXSA9IG1hcFJlY29yZChcbiAgICAgICAgcmVmUmVjb3Jkc1tyZWZlcmVuY2VzLmluZGV4T2YocmVmKV0sXG4gICAgICAgIHJlZi5pbmRleCxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgbG9hZGVkUmVjb3JkLnRyYW5zYWN0aW9uSWQgPSBzdG9yZWREYXRhLnRyYW5zYWN0aW9uSWQ7XG4gIGxvYWRlZFJlY29yZC5pc05ldyA9IGZhbHNlO1xuICBsb2FkZWRSZWNvcmQua2V5ID0ga2V5O1xuICBsb2FkZWRSZWNvcmQuaWQgPSAkKGtleSwgW3NwbGl0S2V5LCBsYXN0XSk7XG4gIGxvYWRlZFJlY29yZC50eXBlID0gcmVjb3JkTm9kZS5uYW1lO1xuICByZXR1cm4gbG9hZGVkUmVjb3JkO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgbG9hZDtcbiIsIi8vIGFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZGV4NGVyL2pzLXByb21pc2UtcmVhZGFibGVcbi8vIHRoYW5rcyA6KVxuICBcbmV4cG9ydCBjb25zdCBwcm9taXNlUmVhZGFibGVTdHJlYW0gPSBzdHJlYW0gPT4ge1xuICAgXG4gICAgbGV0IF9lcnJvcmVkO1xuXG4gICAgY29uc3QgX2Vycm9ySGFuZGxlciA9IGVyciA9PiB7XG4gICAgICAgIF9lcnJvcmVkID0gZXJyO1xuICAgIH07XG5cbiAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBfZXJyb3JIYW5kbGVyKTtcbiAgXG4gICAgY29uc3QgcmVhZCA9IChzaXplKSA9PiB7XG4gIFxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKF9lcnJvcmVkKSB7XG4gICAgICAgICAgY29uc3QgZXJyID0gX2Vycm9yZWQ7XG4gICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICAgIH1cbiAgXG4gICAgICAgIGlmICghc3RyZWFtLnJlYWRhYmxlIHx8IHN0cmVhbS5jbG9zZWQgfHwgc3RyZWFtLmRlc3Ryb3llZCkge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IHJlYWRhYmxlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICBjb25zdCBjaHVuayA9IHN0cmVhbS5yZWFkKHNpemUpO1xuICBcbiAgICAgICAgICBpZiAoY2h1bmspIHtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVzb2x2ZShjaHVuayk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCBjbG9zZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCBlbmRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgZXJyb3JIYW5kbGVyID0gKGVycikgPT4ge1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCByZW1vdmVMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiY2xvc2VcIiwgY2xvc2VIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVuZFwiLCBlbmRIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJyZWFkYWJsZVwiLCByZWFkYWJsZUhhbmRsZXIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBzdHJlYW0ub24oXCJjbG9zZVwiLCBjbG9zZUhhbmRsZXIpO1xuICAgICAgICBzdHJlYW0ub24oXCJlbmRcIiwgZW5kSGFuZGxlcik7XG4gICAgICAgIHN0cmVhbS5vbihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gICAgICAgIHN0cmVhbS5vbihcInJlYWRhYmxlXCIsIHJlYWRhYmxlSGFuZGxlcik7XG4gIFxuICAgICAgICByZWFkYWJsZUhhbmRsZXIoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgXG4gIFxuICAgIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XG4gICAgICBpZiAoc3RyZWFtKSB7XG4gICAgICAgIGlmIChfZXJyb3JIYW5kbGVyKSB7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgX2Vycm9ySGFuZGxlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBzdHJlYW0uZGVzdHJveSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgc3RyZWFtLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIFxuICAgIHJldHVybiB7cmVhZCwgZGVzdHJveSwgc3RyZWFtfTtcbiAgfVxuICBcbiAgZXhwb3J0IGRlZmF1bHQgcHJvbWlzZVJlYWRhYmxlU3RyZWFtXG4gICIsImltcG9ydCB7IGNvbXBpbGVDb2RlIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xuaW1wb3J0IHtcbiAgZmlsdGVyLCBpbmNsdWRlcywgbWFwLCBsYXN0LFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQsIGlzR2xvYmFsSW5kZXgsXG4gIGdldFBhcmVudEtleSwgaXNTaGFyZGVkSW5kZXgsXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xuICBqb2luS2V5LCBpc05vbkVtcHR5U3RyaW5nLCBzcGxpdEtleSwgJCxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4ZWREYXRhS2V5ID0gKGluZGV4Tm9kZSwgaW5kZXhLZXksIHJlY29yZCkgPT4ge1xuICBjb25zdCBnZXRTaGFyZE5hbWUgPSAoaW5kZXhOb2RlLCByZWNvcmQpID0+IHtcbiAgICBjb25zdCBzaGFyZE5hbWVGdW5jID0gY29tcGlsZUNvZGUoaW5kZXhOb2RlLmdldFNoYXJkTmFtZSk7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBzaGFyZE5hbWVGdW5jKHsgcmVjb3JkIH0pO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgY29uc3QgZXJyb3JEZXRhaWxzID0gYHNoYXJkQ29kZTogJHtpbmRleE5vZGUuZ2V0U2hhcmROYW1lfSA6OiByZWNvcmQ6ICR7SlNPTi5zdHJpbmdpZnkocmVjb3JkKX0gOjogYFxuICAgICAgZS5tZXNzYWdlID0gXCJFcnJvciBydW5uaW5nIGluZGV4IHNoYXJkbmFtZSBmdW5jOiBcIiArIGVycm9yRGV0YWlscyArIGUubWVzc2FnZTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHNoYXJkTmFtZSA9IGlzTm9uRW1wdHlTdHJpbmcoaW5kZXhOb2RlLmdldFNoYXJkTmFtZSlcbiAgICA/IGAke2dldFNoYXJkTmFtZShpbmRleE5vZGUsIHJlY29yZCl9LmNzdmBcbiAgICA6ICdpbmRleC5jc3YnO1xuXG4gIHJldHVybiBqb2luS2V5KGluZGV4S2V5LCBzaGFyZE5hbWUpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFNoYXJkS2V5c0luUmFuZ2UgPSBhc3luYyAoYXBwLCBpbmRleEtleSwgc3RhcnRSZWNvcmQgPSBudWxsLCBlbmRSZWNvcmQgPSBudWxsKSA9PiB7XG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoaW5kZXhLZXkpO1xuXG4gIGNvbnN0IHN0YXJ0U2hhcmROYW1lID0gIXN0YXJ0UmVjb3JkXG4gICAgPyBudWxsXG4gICAgOiBzaGFyZE5hbWVGcm9tS2V5KFxuICAgICAgZ2V0SW5kZXhlZERhdGFLZXkoXG4gICAgICAgIGluZGV4Tm9kZSxcbiAgICAgICAgaW5kZXhLZXksXG4gICAgICAgIHN0YXJ0UmVjb3JkLFxuICAgICAgKSxcbiAgICApO1xuXG4gIGNvbnN0IGVuZFNoYXJkTmFtZSA9ICFlbmRSZWNvcmRcbiAgICA/IG51bGxcbiAgICA6IHNoYXJkTmFtZUZyb21LZXkoXG4gICAgICBnZXRJbmRleGVkRGF0YUtleShcbiAgICAgICAgaW5kZXhOb2RlLFxuICAgICAgICBpbmRleEtleSxcbiAgICAgICAgZW5kUmVjb3JkLFxuICAgICAgKSxcbiAgICApO1xuXG4gIHJldHVybiAkKGF3YWl0IGdldFNoYXJkTWFwKGFwcC5kYXRhc3RvcmUsIGluZGV4S2V5KSwgW1xuICAgIGZpbHRlcihrID0+IChzdGFydFJlY29yZCA9PT0gbnVsbCB8fCBrID49IHN0YXJ0U2hhcmROYW1lKVxuICAgICAgICAgICAgICAgICAgICAmJiAoZW5kUmVjb3JkID09PSBudWxsIHx8IGsgPD0gZW5kU2hhcmROYW1lKSksXG4gICAgbWFwKGsgPT4gam9pbktleShpbmRleEtleSwgYCR7a30uY3N2YCkpLFxuICBdKTtcbn07XG5cbmV4cG9ydCBjb25zdCBlbnN1cmVTaGFyZE5hbWVJc0luU2hhcmRNYXAgPSBhc3luYyAoc3RvcmUsIGluZGV4S2V5LCBpbmRleGVkRGF0YUtleSkgPT4ge1xuICBjb25zdCBtYXAgPSBhd2FpdCBnZXRTaGFyZE1hcChzdG9yZSwgaW5kZXhLZXkpO1xuICBjb25zdCBzaGFyZE5hbWUgPSBzaGFyZE5hbWVGcm9tS2V5KGluZGV4ZWREYXRhS2V5KTtcbiAgaWYgKCFpbmNsdWRlcyhzaGFyZE5hbWUpKG1hcCkpIHtcbiAgICBtYXAucHVzaChzaGFyZE5hbWUpO1xuICAgIGF3YWl0IHdyaXRlU2hhcmRNYXAoc3RvcmUsIGluZGV4S2V5LCBtYXApO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U2hhcmRNYXAgPSBhc3luYyAoZGF0YXN0b3JlLCBpbmRleEtleSkgPT4ge1xuICBjb25zdCBzaGFyZE1hcEtleSA9IGdldFNoYXJkTWFwS2V5KGluZGV4S2V5KTtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgZGF0YXN0b3JlLmxvYWRKc29uKHNoYXJkTWFwS2V5KTtcbiAgfSBjYXRjaCAoXykge1xuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKHNoYXJkTWFwS2V5LCBbXSk7XG4gICAgcmV0dXJuIFtdO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3Qgd3JpdGVTaGFyZE1hcCA9IGFzeW5jIChkYXRhc3RvcmUsIGluZGV4S2V5LCBzaGFyZE1hcCkgPT4gYXdhaXQgZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gIGdldFNoYXJkTWFwS2V5KGluZGV4S2V5KSxcbiAgc2hhcmRNYXAsXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsU2hhcmRLZXlzID0gYXN5bmMgKGFwcCwgaW5kZXhLZXkpID0+IGF3YWl0IGdldFNoYXJkS2V5c0luUmFuZ2UoYXBwLCBpbmRleEtleSk7XG5cbmV4cG9ydCBjb25zdCBnZXRTaGFyZE1hcEtleSA9IGluZGV4S2V5ID0+IGpvaW5LZXkoaW5kZXhLZXksICdzaGFyZE1hcC5qc29uJyk7XG5cbmV4cG9ydCBjb25zdCBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXkgPSBpbmRleEtleSA9PiBqb2luS2V5KGluZGV4S2V5LCAnaW5kZXguY3N2Jyk7XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleEZvbGRlcktleSA9IGluZGV4S2V5ID0+IGluZGV4S2V5O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlSW5kZXhGaWxlID0gYXN5bmMgKGRhdGFzdG9yZSwgaW5kZXhlZERhdGFLZXksIGluZGV4KSA9PiB7XG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleCkpIHtcbiAgICBjb25zdCBpbmRleEtleSA9IGdldFBhcmVudEtleShpbmRleGVkRGF0YUtleSk7XG4gICAgY29uc3Qgc2hhcmRNYXAgPSBhd2FpdCBnZXRTaGFyZE1hcChkYXRhc3RvcmUsIGluZGV4S2V5KTtcbiAgICBzaGFyZE1hcC5wdXNoKFxuICAgICAgc2hhcmROYW1lRnJvbUtleShpbmRleGVkRGF0YUtleSksXG4gICAgKTtcbiAgICBhd2FpdCB3cml0ZVNoYXJkTWFwKGRhdGFzdG9yZSwgaW5kZXhLZXksIHNoYXJkTWFwKTtcbiAgfVxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRmlsZShpbmRleGVkRGF0YUtleSwgJycpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNoYXJkTmFtZUZyb21LZXkgPSBrZXkgPT4gJChrZXksIFtcbiAgc3BsaXRLZXksXG4gIGxhc3QsXG5dKS5yZXBsYWNlKCcuY3N2JywgJycpO1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhLZXlfQmFzZWRPbkRlY2VuZGFudCA9IChkZWNlbmRhbnRLZXksIGluZGV4Tm9kZSkgPT4ge1xuICBpZiAoaXNHbG9iYWxJbmRleChpbmRleE5vZGUpKSB7IHJldHVybiBgJHtpbmRleE5vZGUubm9kZUtleSgpfWA7IH1cblxuICBjb25zdCBpbmRleGVkRGF0YVBhcmVudEtleSA9IGdldEFjdHVhbEtleU9mUGFyZW50KFxuICAgIGluZGV4Tm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksXG4gICAgZGVjZW5kYW50S2V5LFxuICApO1xuXG4gIHJldHVybiBqb2luS2V5KFxuICAgIGluZGV4ZWREYXRhUGFyZW50S2V5LFxuICAgIGluZGV4Tm9kZS5uYW1lLFxuICApO1xufTtcbiIsImltcG9ydCB7XG4gIGhhcywga2V5cywgbWFwLCBvcmRlckJ5LFxuICBmaWx0ZXIsIGNvbmNhdCwgcmV2ZXJzZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IG1hcFJlY29yZCB9IGZyb20gJy4vZXZhbHVhdGUnO1xuaW1wb3J0IHsgY29uc3RydWN0UmVjb3JkIH0gZnJvbSAnLi4vcmVjb3JkQXBpL2dldE5ldyc7XG5pbXBvcnQgeyBnZXRTYW1wbGVGaWVsZFZhbHVlLCBkZXRlY3RUeXBlLCBhbGwgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlU2NoZW1hID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlKSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGVzID0gZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgoaGllcmFyY2h5LCBpbmRleE5vZGUpO1xuICBjb25zdCBtYXBwZWRSZWNvcmRzID0gJChyZWNvcmROb2RlcywgW1xuICAgIG1hcChuID0+IG1hcFJlY29yZChjcmVhdGVTYW1wbGVSZWNvcmQobiksIGluZGV4Tm9kZSkpLFxuICBdKTtcblxuICAvLyBhbHdheXMgaGFzIHJlY29yZCBrZXkgYW5kIHNvcnQga2V5XG4gIGNvbnN0IHNjaGVtYSA9IHtcbiAgICBzb3J0S2V5OiBhbGwuc3RyaW5nLFxuICAgIGtleTogYWxsLnN0cmluZyxcbiAgfTtcblxuICBjb25zdCBmaWVsZHNIYXMgPSBoYXMoc2NoZW1hKTtcbiAgY29uc3Qgc2V0RmllbGQgPSAoZmllbGROYW1lLCB2YWx1ZSkgPT4ge1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgdGhpc1R5cGUgPSBkZXRlY3RUeXBlKHZhbHVlKTtcbiAgICBpZiAoZmllbGRzSGFzKGZpZWxkTmFtZSkpIHtcbiAgICAgIGlmIChzY2hlbWFbZmllbGROYW1lXSAhPT0gdGhpc1R5cGUpIHtcbiAgICAgICAgc2NoZW1hW2ZpZWxkTmFtZV0gPSBhbGwuc3RyaW5nO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzY2hlbWFbZmllbGROYW1lXSA9IHRoaXNUeXBlO1xuICAgIH1cbiAgfTtcblxuICBmb3IgKGNvbnN0IG1hcHBlZFJlYyBvZiBtYXBwZWRSZWNvcmRzKSB7XG4gICAgZm9yIChjb25zdCBmIGluIG1hcHBlZFJlYykge1xuICAgICAgc2V0RmllbGQoZiwgbWFwcGVkUmVjW2ZdKTtcbiAgICB9XG4gIH1cblxuICAvLyByZXR1cmluZyBhbiBhcnJheSBvZiB7bmFtZSwgdHlwZX1cbiAgcmV0dXJuICQoc2NoZW1hLCBbXG4gICAga2V5cyxcbiAgICBtYXAoayA9PiAoeyBuYW1lOiBrLCB0eXBlOiBzY2hlbWFba10ubmFtZSB9KSksXG4gICAgZmlsdGVyKHMgPT4gcy5uYW1lICE9PSAnc29ydEtleScpLFxuICAgIG9yZGVyQnkoJ25hbWUnLCBbJ2Rlc2MnXSksIC8vIHJldmVyc2UgYXBsaGFcbiAgICBjb25jYXQoW3sgbmFtZTogJ3NvcnRLZXknLCB0eXBlOiBhbGwuc3RyaW5nLm5hbWUgfV0pLCAvLyBzb3J0S2V5IG9uIGVuZFxuICAgIHJldmVyc2UsIC8vIHNvcnRLZXkgZmlyc3QsIHRoZW4gcmVzdCBhcmUgYWxwaGFiZXRpY2FsXG4gIF0pO1xufTtcblxuY29uc3QgY3JlYXRlU2FtcGxlUmVjb3JkID0gcmVjb3JkTm9kZSA9PiBjb25zdHJ1Y3RSZWNvcmQoXG4gIHJlY29yZE5vZGUsXG4gIGdldFNhbXBsZUZpZWxkVmFsdWUsXG4gIHJlY29yZE5vZGUucGFyZW50KCkubm9kZUtleSgpLFxuKTtcbiIsImV4cG9ydCBkZWZhdWx0ICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDpcbiAgICAgICAgICAgIHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6XG4gICAgICAgICAgICB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pO1xuIiwiXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxudmFyIGluaXRlZCA9IGZhbHNlO1xuZnVuY3Rpb24gaW5pdCAoKSB7XG4gIGluaXRlZCA9IHRydWU7XG4gIHZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2RlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgbG9va3VwW2ldID0gY29kZVtpXVxuICAgIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxuICB9XG5cbiAgcmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG4gIHJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICBpZiAoIWluaXRlZCkge1xuICAgIGluaXQoKTtcbiAgfVxuICB2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXG4gIGlmIChsZW4gJSA0ID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG4gIH1cblxuICAvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuICAvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG4gIC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuICAvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcbiAgLy8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuICBwbGFjZUhvbGRlcnMgPSBiNjRbbGVuIC0gMl0gPT09ICc9JyA/IDIgOiBiNjRbbGVuIC0gMV0gPT09ICc9JyA/IDEgOiAwXG5cbiAgLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG4gIGFyciA9IG5ldyBBcnIobGVuICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cbiAgLy8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuICBsID0gcGxhY2VIb2xkZXJzID4gMCA/IGxlbiAtIDQgOiBsZW5cblxuICB2YXIgTCA9IDBcblxuICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTgpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDEyKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8IHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMyldXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDE2KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxMCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgNCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDYgJiAweDNGXSArIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG4gICAgb3V0cHV0LnB1c2godHJpcGxldFRvQmFzZTY0KHRtcCkpXG4gIH1cbiAgcmV0dXJuIG91dHB1dC5qb2luKCcnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgaWYgKCFpbml0ZWQpIHtcbiAgICBpbml0KCk7XG4gIH1cbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgb3V0cHV0ID0gJydcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayh1aW50OCwgaSwgKGkgKyBtYXhDaHVua0xlbmd0aCkgPiBsZW4yID8gbGVuMiA6IChpICsgbWF4Q2h1bmtMZW5ndGgpKSlcbiAgfVxuXG4gIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcbiAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcbiAgICB0bXAgPSB1aW50OFtsZW4gLSAxXVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDJdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz09J1xuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyAodWludDhbbGVuIC0gMV0pXG4gICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMTBdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXVxuICAgIG91dHB1dCArPSAnPSdcbiAgfVxuXG4gIHBhcnRzLnB1c2gob3V0cHV0KVxuXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gcmVhZCAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cml0ZSAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5leHBvcnQgZGVmYXVsdCBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cblxuaW1wb3J0ICogYXMgYmFzZTY0IGZyb20gJy4vYmFzZTY0J1xuaW1wb3J0ICogYXMgaWVlZTc1NCBmcm9tICcuL2llZWU3NTQnXG5pbXBvcnQgaXNBcnJheSBmcm9tICcuL2lzQXJyYXknXG5cbmV4cG9ydCB2YXIgSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBEdWUgdG8gdmFyaW91cyBicm93c2VyIGJ1Z3MsIHNvbWV0aW1lcyB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uIHdpbGwgYmUgdXNlZCBldmVuXG4gKiB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHR5cGVkIGFycmF5cy5cbiAqXG4gKiBOb3RlOlxuICpcbiAqICAgLSBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsXG4gKiAgICAgU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzguXG4gKlxuICogICAtIENocm9tZSA5LTEwIGlzIG1pc3NpbmcgdGhlIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24uXG4gKlxuICogICAtIElFMTAgaGFzIGEgYnJva2VuIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhcnJheXMgb2ZcbiAqICAgICBpbmNvcnJlY3QgbGVuZ3RoIGluIHNvbWUgc2l0dWF0aW9ucy5cblxuICogV2UgZGV0ZWN0IHRoZXNlIGJ1Z2d5IGJyb3dzZXJzIGFuZCBzZXQgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYCB0byBgZmFsc2VgIHNvIHRoZXlcbiAqIGdldCB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uLCB3aGljaCBpcyBzbG93ZXIgYnV0IGJlaGF2ZXMgY29ycmVjdGx5LlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUICE9PSB1bmRlZmluZWRcbiAgPyBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVFxuICA6IHRydWVcblxuLypcbiAqIEV4cG9ydCBrTWF4TGVuZ3RoIGFmdGVyIHR5cGVkIGFycmF5IHN1cHBvcnQgaXMgZGV0ZXJtaW5lZC5cbiAqL1xudmFyIF9rTWF4TGVuZ3RoID0ga01heExlbmd0aCgpXG5leHBvcnQge19rTWF4TGVuZ3RoIGFzIGtNYXhMZW5ndGh9O1xuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICByZXR1cm4gdHJ1ZTtcbiAgLy8gcm9sbHVwIGlzc3Vlc1xuICAvLyB0cnkge1xuICAvLyAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAvLyAgIGFyci5fX3Byb3RvX18gPSB7XG4gIC8vICAgICBfX3Byb3RvX186IFVpbnQ4QXJyYXkucHJvdG90eXBlLFxuICAvLyAgICAgZm9vOiBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gIC8vICAgfVxuICAvLyAgIHJldHVybiBhcnIuZm9vKCkgPT09IDQyICYmIC8vIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkXG4gIC8vICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgJiYgLy8gY2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIC8vICAgICAgIGFyci5zdWJhcnJheSgxLCAxKS5ieXRlTGVuZ3RoID09PSAwIC8vIGllMTAgaGFzIGJyb2tlbiBgc3ViYXJyYXlgXG4gIC8vIH0gY2F0Y2ggKGUpIHtcbiAgLy8gICByZXR1cm4gZmFsc2VcbiAgLy8gfVxufVxuXG5mdW5jdGlvbiBrTWF4TGVuZ3RoICgpIHtcbiAgcmV0dXJuIEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gICAgPyAweDdmZmZmZmZmXG4gICAgOiAweDNmZmZmZmZmXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAodGhhdCwgbGVuZ3RoKSB7XG4gIGlmIChrTWF4TGVuZ3RoKCkgPCBsZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCB0eXBlZCBhcnJheSBsZW5ndGgnKVxuICB9XG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoYXQgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIGlmICh0aGF0ID09PSBudWxsKSB7XG4gICAgICB0aGF0ID0gbmV3IEJ1ZmZlcihsZW5ndGgpXG4gICAgfVxuICAgIHRoYXQubGVuZ3RoID0gbGVuZ3RoXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgaGF2ZSB0aGVpclxuICogcHJvdG90eXBlIGNoYW5nZWQgdG8gYEJ1ZmZlci5wcm90b3R5cGVgLiBGdXJ0aGVybW9yZSwgYEJ1ZmZlcmAgaXMgYSBzdWJjbGFzcyBvZlxuICogYFVpbnQ4QXJyYXlgLCBzbyB0aGUgcmV0dXJuZWQgaW5zdGFuY2VzIHdpbGwgaGF2ZSBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgbWV0aG9kc1xuICogYW5kIHRoZSBgVWludDhBcnJheWAgbWV0aG9kcy4gU3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXRcbiAqIHJldHVybnMgYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogVGhlIGBVaW50OEFycmF5YCBwcm90b3R5cGUgcmVtYWlucyB1bm1vZGlmaWVkLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiYgISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIGlmICh0eXBlb2YgZW5jb2RpbmdPck9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0lmIGVuY29kaW5nIGlzIHNwZWNpZmllZCB0aGVuIHRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJ1xuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gYWxsb2NVbnNhZmUodGhpcywgYXJnKVxuICB9XG4gIHJldHVybiBmcm9tKHRoaXMsIGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxuLy8gVE9ETzogTGVnYWN5LCBub3QgbmVlZGVkIGFueW1vcmUuIFJlbW92ZSBpbiBuZXh0IG1ham9yIHZlcnNpb24uXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gZnJvbSAodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBhIG51bWJlcicpXG4gIH1cblxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnJvbVN0cmluZyh0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldClcbiAgfVxuXG4gIHJldHVybiBmcm9tT2JqZWN0KHRoYXQsIHZhbHVlKVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIEJ1ZmZlcihhcmcsIGVuY29kaW5nKSBidXQgdGhyb3dzIGEgVHlwZUVycm9yXG4gKiBpZiB2YWx1ZSBpcyBhIG51bWJlci5cbiAqIEJ1ZmZlci5mcm9tKHN0clssIGVuY29kaW5nXSlcbiAqIEJ1ZmZlci5mcm9tKGFycmF5KVxuICogQnVmZmVyLmZyb20oYnVmZmVyKVxuICogQnVmZmVyLmZyb20oYXJyYXlCdWZmZXJbLCBieXRlT2Zmc2V0WywgbGVuZ3RoXV0pXG4gKiovXG5CdWZmZXIuZnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBmcm9tKG51bGwsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbmlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICBCdWZmZXIucHJvdG90eXBlLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXkucHJvdG90eXBlXG4gIEJ1ZmZlci5fX3Byb3RvX18gPSBVaW50OEFycmF5XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wuc3BlY2llcyAmJlxuICAgICAgQnVmZmVyW1N5bWJvbC5zcGVjaWVzXSA9PT0gQnVmZmVyKSB7XG4gICAgLy8gRml4IHN1YmFycmF5KCkgaW4gRVMyMDE2LiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvOTdcbiAgICAvLyBPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLCBTeW1ib2wuc3BlY2llcywge1xuICAgIC8vICAgdmFsdWU6IG51bGwsXG4gICAgLy8gICBjb25maWd1cmFibGU6IHRydWVcbiAgICAvLyB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydFNpemUgKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9IGVsc2UgaWYgKHNpemUgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG5lZ2F0aXZlJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAodGhhdCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXR0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2MobnVsbCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlICh0aGF0LCBzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgKytpKSB7XG4gICAgICB0aGF0W2ldID0gMFxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gQnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gU2xvd0J1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICovXG5CdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHRoYXQsIHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGlmICghQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJlbmNvZGluZ1wiIG11c3QgYmUgYSB2YWxpZCBzdHJpbmcgZW5jb2RpbmcnKVxuICB9XG5cbiAgdmFyIGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuXG4gIHZhciBhY3R1YWwgPSB0aGF0LndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG5cbiAgaWYgKGFjdHVhbCAhPT0gbGVuZ3RoKSB7XG4gICAgLy8gV3JpdGluZyBhIGhleCBzdHJpbmcsIGZvciBleGFtcGxlLCB0aGF0IGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycyB3aWxsXG4gICAgLy8gY2F1c2UgZXZlcnl0aGluZyBhZnRlciB0aGUgZmlyc3QgaW52YWxpZCBjaGFyYWN0ZXIgdG8gYmUgaWdub3JlZC4gKGUuZy5cbiAgICAvLyAnYWJ4eGNkJyB3aWxsIGJlIHRyZWF0ZWQgYXMgJ2FiJylcbiAgICB0aGF0ID0gdGhhdC5zbGljZSgwLCBhY3R1YWwpXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlMaWtlICh0aGF0LCBhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyICh0aGF0LCBhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gIGFycmF5LmJ5dGVMZW5ndGggLy8gdGhpcyB0aHJvd3MgaWYgYGFycmF5YCBpcyBub3QgYSB2YWxpZCBBcnJheUJ1ZmZlclxuXG4gIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdvZmZzZXRcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgKyAobGVuZ3RoIHx8IDApKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ2xlbmd0aFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChieXRlT2Zmc2V0ID09PSB1bmRlZmluZWQgJiYgbGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5KVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldClcbiAgfSBlbHNlIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gYXJyYXlcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgdGhhdCA9IGZyb21BcnJheUxpa2UodGhhdCwgYXJyYXkpXG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAodGhhdCwgb2JqKSB7XG4gIGlmIChpbnRlcm5hbElzQnVmZmVyKG9iaikpIHtcbiAgICB2YXIgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbilcblxuICAgIGlmICh0aGF0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoYXRcbiAgICB9XG5cbiAgICBvYmouY29weSh0aGF0LCAwLCAwLCBsZW4pXG4gICAgcmV0dXJuIHRoYXRcbiAgfVxuXG4gIGlmIChvYmopIHtcbiAgICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgb2JqLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB8fCAnbGVuZ3RoJyBpbiBvYmopIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ251bWJlcicgfHwgaXNuYW4ob2JqLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCAwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqKVxuICAgIH1cblxuICAgIGlmIChvYmoudHlwZSA9PT0gJ0J1ZmZlcicgJiYgaXNBcnJheShvYmouZGF0YSkpIHtcbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iai5kYXRhKVxuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCBvciBhcnJheS1saWtlIG9iamVjdC4nKVxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwga01heExlbmd0aCgpYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IGtNYXhMZW5ndGgoKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBrTWF4TGVuZ3RoKCkudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNsb3dCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAoK2xlbmd0aCAhPSBsZW5ndGgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbiAgICBsZW5ndGggPSAwXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5hbGxvYygrbGVuZ3RoKVxufVxuQnVmZmVyLmlzQnVmZmVyID0gaXNCdWZmZXI7XG5mdW5jdGlvbiBpbnRlcm5hbElzQnVmZmVyIChiKSB7XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIWludGVybmFsSXNCdWZmZXIoYSkgfHwgIWludGVybmFsSXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgbXVzdCBiZSBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuXG4gIHZhciB4ID0gYS5sZW5ndGhcbiAgdmFyIHkgPSBiLmxlbmd0aFxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldXG4gICAgICB5ID0gYltpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnbGF0aW4xJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIWlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5hbGxvYygwKVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICBsZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYnVmID0gbGlzdFtpXVxuICAgIGlmICghaW50ZXJuYWxJc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoaW50ZXJuYWxJc0J1ZmZlcihzdHJpbmcpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5sZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQXJyYXlCdWZmZXIuaXNWaWV3ID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAoQXJyYXlCdWZmZXIuaXNWaWV3KHN0cmluZykgfHwgc3RyaW5nIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5ieXRlTGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgc3RyaW5nID0gJycgKyBzdHJpbmdcbiAgfVxuXG4gIHZhciBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gbGVuICogMlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGxlbiA+Pj4gMVxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoIC8vIGFzc3VtZSB1dGY4XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIC8vIE5vIG5lZWQgdG8gdmVyaWZ5IHRoYXQgXCJ0aGlzLmxlbmd0aCA8PSBNQVhfVUlOVDMyXCIgc2luY2UgaXQncyBhIHJlYWQtb25seVxuICAvLyBwcm9wZXJ0eSBvZiBhIHR5cGVkIGFycmF5LlxuXG4gIC8vIFRoaXMgYmVoYXZlcyBuZWl0aGVyIGxpa2UgU3RyaW5nIG5vciBVaW50OEFycmF5IGluIHRoYXQgd2Ugc2V0IHN0YXJ0L2VuZFxuICAvLyB0byB0aGVpciB1cHBlci9sb3dlciBib3VuZHMgaWYgdGhlIHZhbHVlIHBhc3NlZCBpcyBvdXQgb2YgcmFuZ2UuXG4gIC8vIHVuZGVmaW5lZCBpcyBoYW5kbGVkIHNwZWNpYWxseSBhcyBwZXIgRUNNQS0yNjIgNnRoIEVkaXRpb24sXG4gIC8vIFNlY3Rpb24gMTMuMy4zLjcgUnVudGltZSBTZW1hbnRpY3M6IEtleWVkQmluZGluZ0luaXRpYWxpemF0aW9uLlxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCB8fCBzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICAvLyBSZXR1cm4gZWFybHkgaWYgc3RhcnQgPiB0aGlzLmxlbmd0aC4gRG9uZSBoZXJlIHRvIHByZXZlbnQgcG90ZW50aWFsIHVpbnQzMlxuICAvLyBjb2VyY2lvbiBmYWlsIGJlbG93LlxuICBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbmQgPD0gMCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgLy8gRm9yY2UgY29lcnNpb24gdG8gdWludDMyLiBUaGlzIHdpbGwgYWxzbyBjb2VyY2UgZmFsc2V5L05hTiB2YWx1ZXMgdG8gMC5cbiAgZW5kID4+Pj0gMFxuICBzdGFydCA+Pj49IDBcblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gVGhlIHByb3BlcnR5IGlzIHVzZWQgYnkgYEJ1ZmZlci5pc0J1ZmZlcmAgYW5kIGBpcy1idWZmZXJgIChpbiBTYWZhcmkgNS03KSB0byBkZXRlY3Rcbi8vIEJ1ZmZlciBpbnN0YW5jZXMuXG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuZnVuY3Rpb24gc3dhcCAoYiwgbiwgbSkge1xuICB2YXIgaSA9IGJbbl1cbiAgYltuXSA9IGJbbV1cbiAgYlttXSA9IGlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMTYgPSBmdW5jdGlvbiBzd2FwMTYgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDIgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDE2LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAxKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDMyID0gZnVuY3Rpb24gc3dhcDMyICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAzMi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgMilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXA2NCA9IGZ1bmN0aW9uIHN3YXA2NCAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgOCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNjQtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gOCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDcpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDYpXG4gICAgc3dhcCh0aGlzLCBpICsgMiwgaSArIDUpXG4gICAgc3dhcCh0aGlzLCBpICsgMywgaSArIDQpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoIHwgMFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgaWYgKHRoaXMgPT09IGIpIHJldHVybiB0cnVlXG4gIHJldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLCBiKSA9PT0gMFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgdmFyIHN0ciA9ICcnXG4gIHZhciBtYXggPSBJTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgfVxuXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5kID0gdGFyZ2V0ID8gdGFyZ2V0Lmxlbmd0aCA6IDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzU3RhcnQgPSAwXG4gIH1cbiAgaWYgKHRoaXNFbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNFbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBlbmQgPiB0YXJnZXQubGVuZ3RoIHx8IHRoaXNTdGFydCA8IDAgfHwgdGhpc0VuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ291dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQgJiYgc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIHN0YXJ0ID4+Pj0gMFxuICBlbmQgPj4+PSAwXG4gIHRoaXNTdGFydCA+Pj49IDBcbiAgdGhpc0VuZCA+Pj49IDBcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0KSByZXR1cm4gMFxuXG4gIHZhciB4ID0gdGhpc0VuZCAtIHRoaXNTdGFydFxuICB2YXIgeSA9IGVuZCAtIHN0YXJ0XG4gIHZhciBsZW4gPSBNYXRoLm1pbih4LCB5KVxuXG4gIHZhciB0aGlzQ29weSA9IHRoaXMuc2xpY2UodGhpc1N0YXJ0LCB0aGlzRW5kKVxuICB2YXIgdGFyZ2V0Q29weSA9IHRhcmdldC5zbGljZShzdGFydCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAodGhpc0NvcHlbaV0gIT09IHRhcmdldENvcHlbaV0pIHtcbiAgICAgIHggPSB0aGlzQ29weVtpXVxuICAgICAgeSA9IHRhcmdldENvcHlbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG4vLyBGaW5kcyBlaXRoZXIgdGhlIGZpcnN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA+PSBgYnl0ZU9mZnNldGAsXG4vLyBPUiB0aGUgbGFzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPD0gYGJ5dGVPZmZzZXRgLlxuLy9cbi8vIEFyZ3VtZW50czpcbi8vIC0gYnVmZmVyIC0gYSBCdWZmZXIgdG8gc2VhcmNoXG4vLyAtIHZhbCAtIGEgc3RyaW5nLCBCdWZmZXIsIG9yIG51bWJlclxuLy8gLSBieXRlT2Zmc2V0IC0gYW4gaW5kZXggaW50byBgYnVmZmVyYDsgd2lsbCBiZSBjbGFtcGVkIHRvIGFuIGludDMyXG4vLyAtIGVuY29kaW5nIC0gYW4gb3B0aW9uYWwgZW5jb2RpbmcsIHJlbGV2YW50IGlzIHZhbCBpcyBhIHN0cmluZ1xuLy8gLSBkaXIgLSB0cnVlIGZvciBpbmRleE9mLCBmYWxzZSBmb3IgbGFzdEluZGV4T2ZcbmZ1bmN0aW9uIGJpZGlyZWN0aW9uYWxJbmRleE9mIChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICAvLyBFbXB0eSBidWZmZXIgbWVhbnMgbm8gbWF0Y2hcbiAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHJldHVybiAtMVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0XG4gIGlmICh0eXBlb2YgYnl0ZU9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IGJ5dGVPZmZzZXRcbiAgICBieXRlT2Zmc2V0ID0gMFxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPiAweDdmZmZmZmZmKSB7XG4gICAgYnl0ZU9mZnNldCA9IDB4N2ZmZmZmZmZcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgLTB4ODAwMDAwMDApIHtcbiAgICBieXRlT2Zmc2V0ID0gLTB4ODAwMDAwMDBcbiAgfVxuICBieXRlT2Zmc2V0ID0gK2J5dGVPZmZzZXQgIC8vIENvZXJjZSB0byBOdW1iZXIuXG4gIGlmIChpc05hTihieXRlT2Zmc2V0KSkge1xuICAgIC8vIGJ5dGVPZmZzZXQ6IGl0IGl0J3MgdW5kZWZpbmVkLCBudWxsLCBOYU4sIFwiZm9vXCIsIGV0Yywgc2VhcmNoIHdob2xlIGJ1ZmZlclxuICAgIGJ5dGVPZmZzZXQgPSBkaXIgPyAwIDogKGJ1ZmZlci5sZW5ndGggLSAxKVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXQ6IG5lZ2F0aXZlIG9mZnNldHMgc3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBidWZmZXJcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwKSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCArIGJ5dGVPZmZzZXRcbiAgaWYgKGJ5dGVPZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkge1xuICAgIGlmIChkaXIpIHJldHVybiAtMVxuICAgIGVsc2UgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggLSAxXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IDApIHtcbiAgICBpZiAoZGlyKSBieXRlT2Zmc2V0ID0gMFxuICAgIGVsc2UgcmV0dXJuIC0xXG4gIH1cblxuICAvLyBOb3JtYWxpemUgdmFsXG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIHZhbCA9IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gIH1cblxuICAvLyBGaW5hbGx5LCBzZWFyY2ggZWl0aGVyIGluZGV4T2YgKGlmIGRpciBpcyB0cnVlKSBvciBsYXN0SW5kZXhPZlxuICBpZiAoaW50ZXJuYWxJc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDB4RkYgLy8gU2VhcmNoIGZvciBhIGJ5dGUgdmFsdWUgWzAtMjU1XVxuICAgIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJlxuICAgICAgICB0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGRpcikge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCBbIHZhbCBdLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyJylcbn1cblxuZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICB2YXIgaW5kZXhTaXplID0gMVxuICB2YXIgYXJyTGVuZ3RoID0gYXJyLmxlbmd0aFxuICB2YXIgdmFsTGVuZ3RoID0gdmFsLmxlbmd0aFxuXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZW5jb2RpbmcgPT09ICd1Y3MyJyB8fCBlbmNvZGluZyA9PT0gJ3Vjcy0yJyB8fFxuICAgICAgICBlbmNvZGluZyA9PT0gJ3V0ZjE2bGUnIHx8IGVuY29kaW5nID09PSAndXRmLTE2bGUnKSB7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA8IDIgfHwgdmFsLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpbmRleFNpemUgPSAyXG4gICAgICBhcnJMZW5ndGggLz0gMlxuICAgICAgdmFsTGVuZ3RoIC89IDJcbiAgICAgIGJ5dGVPZmZzZXQgLz0gMlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGJ1ZiwgaSkge1xuICAgIGlmIChpbmRleFNpemUgPT09IDEpIHtcbiAgICAgIHJldHVybiBidWZbaV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ1Zi5yZWFkVUludDE2QkUoaSAqIGluZGV4U2l6ZSlcbiAgICB9XG4gIH1cblxuICB2YXIgaVxuICBpZiAoZGlyKSB7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPCBhcnJMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlYWQoYXJyLCBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIGZvdW5kSW5kZXggPSBpXG4gICAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbExlbmd0aCkgcmV0dXJuIGZvdW5kSW5kZXggKiBpbmRleFNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ICE9PSAtMSkgaSAtPSBpIC0gZm91bmRJbmRleFxuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGJ5dGVPZmZzZXQgKyB2YWxMZW5ndGggPiBhcnJMZW5ndGgpIGJ5dGVPZmZzZXQgPSBhcnJMZW5ndGggLSB2YWxMZW5ndGhcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGZvdW5kID0gdHJ1ZVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWxMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAocmVhZChhcnIsIGkgKyBqKSAhPT0gcmVhZCh2YWwsIGopKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuIGlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiB0aGlzLmluZGV4T2YodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykgIT09IC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIHRydWUpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZmFsc2UpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKHN0ckxlbiAlIDIgIT09IDApIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKGlzTmFOKHBhcnNlZCkpIHJldHVybiBpXG4gICAgYnVmW29mZnNldCArIGldID0gcGFyc2VkXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBsYXRpbjFXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBhc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHVjczJXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZylcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBvZmZzZXRbLCBsZW5ndGhdWywgZW5jb2RpbmddKVxuICB9IGVsc2UgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCB8IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICAvLyBsZWdhY3kgd3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpIC0gcmVtb3ZlIGluIHYwLjEzXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1ZmZlci53cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXRbLCBsZW5ndGhdKSBpcyBubyBsb25nZXIgc3VwcG9ydGVkJ1xuICAgIClcbiAgfVxuXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbGVuZ3RoID4gcmVtYWluaW5nKSBsZW5ndGggPSByZW1haW5pbmdcblxuICBpZiAoKHN0cmluZy5sZW5ndGggPiAwICYmIChsZW5ndGggPCAwIHx8IG9mZnNldCA8IDApKSB8fCBvZmZzZXQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIHdyaXRlIG91dHNpZGUgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIC8vIFdhcm5pbmc6IG1heExlbmd0aCBub3QgdGFrZW4gaW50byBhY2NvdW50IGluIGJhc2U2NFdyaXRlXG4gICAgICAgIHJldHVybiBiYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdWNzMldyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHV0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcbiAgdmFyIHJlcyA9IFtdXG5cbiAgdmFyIGkgPSBzdGFydFxuICB3aGlsZSAoaSA8IGVuZCkge1xuICAgIHZhciBmaXJzdEJ5dGUgPSBidWZbaV1cbiAgICB2YXIgY29kZVBvaW50ID0gbnVsbFxuICAgIHZhciBieXRlc1BlclNlcXVlbmNlID0gKGZpcnN0Qnl0ZSA+IDB4RUYpID8gNFxuICAgICAgOiAoZmlyc3RCeXRlID4gMHhERikgPyAzXG4gICAgICA6IChmaXJzdEJ5dGUgPiAweEJGKSA/IDJcbiAgICAgIDogMVxuXG4gICAgaWYgKGkgKyBieXRlc1BlclNlcXVlbmNlIDw9IGVuZCkge1xuICAgICAgdmFyIHNlY29uZEJ5dGUsIHRoaXJkQnl0ZSwgZm91cnRoQnl0ZSwgdGVtcENvZGVQb2ludFxuXG4gICAgICBzd2l0Y2ggKGJ5dGVzUGVyU2VxdWVuY2UpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmIChmaXJzdEJ5dGUgPCAweDgwKSB7XG4gICAgICAgICAgICBjb2RlUG9pbnQgPSBmaXJzdEJ5dGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHgxRikgPDwgMHg2IHwgKHNlY29uZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4QyB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKHRoaXJkQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0ZGICYmICh0ZW1wQ29kZVBvaW50IDwgMHhEODAwIHx8IHRlbXBDb2RlUG9pbnQgPiAweERGRkYpKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGZvdXJ0aEJ5dGUgPSBidWZbaSArIDNdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwICYmIChmb3VydGhCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweDEyIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweEMgfCAodGhpcmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKGZvdXJ0aEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweEZGRkYgJiYgdGVtcENvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGVQb2ludCA9PT0gbnVsbCkge1xuICAgICAgLy8gd2UgZGlkIG5vdCBnZW5lcmF0ZSBhIHZhbGlkIGNvZGVQb2ludCBzbyBpbnNlcnQgYVxuICAgICAgLy8gcmVwbGFjZW1lbnQgY2hhciAoVStGRkZEKSBhbmQgYWR2YW5jZSBvbmx5IDEgYnl0ZVxuICAgICAgY29kZVBvaW50ID0gMHhGRkZEXG4gICAgICBieXRlc1BlclNlcXVlbmNlID0gMVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50ID4gMHhGRkZGKSB7XG4gICAgICAvLyBlbmNvZGUgdG8gdXRmMTYgKHN1cnJvZ2F0ZSBwYWlyIGRhbmNlKVxuICAgICAgY29kZVBvaW50IC09IDB4MTAwMDBcbiAgICAgIHJlcy5wdXNoKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMClcbiAgICAgIGNvZGVQb2ludCA9IDB4REMwMCB8IGNvZGVQb2ludCAmIDB4M0ZGXG4gICAgfVxuXG4gICAgcmVzLnB1c2goY29kZVBvaW50KVxuICAgIGkgKz0gYnl0ZXNQZXJTZXF1ZW5jZVxuICB9XG5cbiAgcmV0dXJuIGRlY29kZUNvZGVQb2ludHNBcnJheShyZXMpXG59XG5cbi8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIyNzQ3MjcyLzY4MDc0MiwgdGhlIGJyb3dzZXIgd2l0aFxuLy8gdGhlIGxvd2VzdCBsaW1pdCBpcyBDaHJvbWUsIHdpdGggMHgxMDAwMCBhcmdzLlxuLy8gV2UgZ28gMSBtYWduaXR1ZGUgbGVzcywgZm9yIHNhZmV0eVxudmFyIE1BWF9BUkdVTUVOVFNfTEVOR1RIID0gMHgxMDAwXG5cbmZ1bmN0aW9uIGRlY29kZUNvZGVQb2ludHNBcnJheSAoY29kZVBvaW50cykge1xuICB2YXIgbGVuID0gY29kZVBvaW50cy5sZW5ndGhcbiAgaWYgKGxlbiA8PSBNQVhfQVJHVU1FTlRTX0xFTkdUSCkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY29kZVBvaW50cykgLy8gYXZvaWQgZXh0cmEgc2xpY2UoKVxuICB9XG5cbiAgLy8gRGVjb2RlIGluIGNodW5rcyB0byBhdm9pZCBcImNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZFwiLlxuICB2YXIgcmVzID0gJydcbiAgdmFyIGkgPSAwXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXG4gICAgICBTdHJpbmcsXG4gICAgICBjb2RlUG9pbnRzLnNsaWNlKGksIGkgKz0gTUFYX0FSR1VNRU5UU19MRU5HVEgpXG4gICAgKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0gJiAweDdGKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gbGF0aW4xU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiB1dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2kgKyAxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICB2YXIgbmV3QnVmXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIG5ld0J1ZiA9IHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZClcbiAgICBuZXdCdWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47ICsraSkge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ld0J1ZlxufVxuXG4vKlxuICogTmVlZCB0byBtYWtlIHN1cmUgdGhhdCBidWZmZXIgaXNuJ3QgdHJ5aW5nIHRvIHdyaXRlIG91dCBvZiBib3VuZHMuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT2Zmc2V0IChvZmZzZXQsIGV4dCwgbGVuZ3RoKSB7XG4gIGlmICgob2Zmc2V0ICUgMSkgIT09IDAgfHwgb2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ29mZnNldCBpcyBub3QgdWludCcpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBsZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdUcnlpbmcgdG8gYWNjZXNzIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludExFID0gZnVuY3Rpb24gcmVhZFVJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcbiAgfVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF1cbiAgdmFyIG11bCA9IDFcbiAgd2hpbGUgKGJ5dGVMZW5ndGggPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIHJlYWRVSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCA4KSB8IHRoaXNbb2Zmc2V0ICsgMV1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiByZWFkVUludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKCh0aGlzW29mZnNldF0pIHxcbiAgICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSkgK1xuICAgICAgKHRoaXNbb2Zmc2V0ICsgM10gKiAweDEwMDAwMDApXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50QkUgPSBmdW5jdGlvbiByZWFkSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGhcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1pXVxuICB3aGlsZSAoaSA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIHJlYWRJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gcmVhZEludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgMV0gfCAodGhpc1tvZmZzZXRdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgMjQpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdExFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdEJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiByZWFkRG91YmxlQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCA1MiwgOClcbn1cblxuZnVuY3Rpb24gY2hlY2tJbnQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAoIWludGVybmFsSXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZmZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHhmZiwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCAyKTsgaSA8IGo7ICsraSkge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgNCk7IGkgPCBqOyArK2kpIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gMFxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgLSAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgKyAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgOCwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICh0YXJnZXQsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXRTdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB0YXJnZXRTdGFydCA9IHRhcmdldC5sZW5ndGhcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwXG4gIGlmIChlbmQgPiAwICYmIGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDBcbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgdGhpcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAodGFyZ2V0U3RhcnQgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgaWYgKGVuZCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgKyBzdGFydFxuICB9XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG4gIHZhciBpXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yIChpID0gbGVuIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2UgaWYgKGxlbiA8IDEwMDAgfHwgIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gYXNjZW5kaW5nIGNvcHkgZnJvbSBzdGFydFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoY29kZSA8IDI1Nikge1xuICAgICAgICB2YWwgPSBjb2RlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMjU1XG4gIH1cblxuICAvLyBJbnZhbGlkIHJhbmdlcyBhcmUgbm90IHNldCB0byBhIGRlZmF1bHQsIHNvIGNhbiByYW5nZSBjaGVjayBlYXJseS5cbiAgaWYgKHN0YXJ0IDwgMCB8fCB0aGlzLmxlbmd0aCA8IHN0YXJ0IHx8IHRoaXMubGVuZ3RoIDwgZW5kKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ091dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgPj4+IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyB0aGlzLmxlbmd0aCA6IGVuZCA+Pj4gMFxuXG4gIGlmICghdmFsKSB2YWwgPSAwXG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgdGhpc1tpXSA9IHZhbFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYnl0ZXMgPSBpbnRlcm5hbElzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IHV0ZjhUb0J5dGVzKG5ldyBCdWZmZXIodmFsLCBlbmNvZGluZykudG9TdHJpbmcoKSlcbiAgICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rXFwvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyaW5ndHJpbShzdHIpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICB2YXIgY29kZVBvaW50XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICB2YXIgYnl0ZXMgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuXG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBpc25hbiAodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IHZhbCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuXG5cbi8vIHRoZSBmb2xsb3dpbmcgaXMgZnJvbSBpcy1idWZmZXIsIGFsc28gYnkgRmVyb3NzIEFib3VraGFkaWplaCBhbmQgd2l0aCBzYW1lIGxpc2VuY2Vcbi8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcbi8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcbmV4cG9ydCBmdW5jdGlvbiBpc0J1ZmZlcihvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmICghIW9iai5faXNCdWZmZXIgfHwgaXNGYXN0QnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikpXG59XG5cbmZ1bmN0aW9uIGlzRmFzdEJ1ZmZlciAob2JqKSB7XG4gIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG5cbi8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5mdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzRmFzdEJ1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtCdWZmZXJ9IGZyb20gJ2J1ZmZlcic7XG52YXIgaXNCdWZmZXJFbmNvZGluZyA9IEJ1ZmZlci5pc0VuY29kaW5nXG4gIHx8IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gICAgICAgc3dpdGNoIChlbmNvZGluZyAmJiBlbmNvZGluZy50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICBjYXNlICdoZXgnOiBjYXNlICd1dGY4JzogY2FzZSAndXRmLTgnOiBjYXNlICdhc2NpaSc6IGNhc2UgJ2JpbmFyeSc6IGNhc2UgJ2Jhc2U2NCc6IGNhc2UgJ3VjczInOiBjYXNlICd1Y3MtMic6IGNhc2UgJ3V0ZjE2bGUnOiBjYXNlICd1dGYtMTZsZSc6IGNhc2UgJ3Jhdyc6IHJldHVybiB0cnVlO1xuICAgICAgICAgZGVmYXVsdDogcmV0dXJuIGZhbHNlO1xuICAgICAgIH1cbiAgICAgfVxuXG5cbmZ1bmN0aW9uIGFzc2VydEVuY29kaW5nKGVuY29kaW5nKSB7XG4gIGlmIChlbmNvZGluZyAmJiAhaXNCdWZmZXJFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZyk7XG4gIH1cbn1cblxuLy8gU3RyaW5nRGVjb2RlciBwcm92aWRlcyBhbiBpbnRlcmZhY2UgZm9yIGVmZmljaWVudGx5IHNwbGl0dGluZyBhIHNlcmllcyBvZlxuLy8gYnVmZmVycyBpbnRvIGEgc2VyaWVzIG9mIEpTIHN0cmluZ3Mgd2l0aG91dCBicmVha2luZyBhcGFydCBtdWx0aS1ieXRlXG4vLyBjaGFyYWN0ZXJzLiBDRVNVLTggaXMgaGFuZGxlZCBhcyBwYXJ0IG9mIHRoZSBVVEYtOCBlbmNvZGluZy5cbi8vXG4vLyBAVE9ETyBIYW5kbGluZyBhbGwgZW5jb2RpbmdzIGluc2lkZSBhIHNpbmdsZSBvYmplY3QgbWFrZXMgaXQgdmVyeSBkaWZmaWN1bHRcbi8vIHRvIHJlYXNvbiBhYm91dCB0aGlzIGNvZGUsIHNvIGl0IHNob3VsZCBiZSBzcGxpdCB1cCBpbiB0aGUgZnV0dXJlLlxuLy8gQFRPRE8gVGhlcmUgc2hvdWxkIGJlIGEgdXRmOC1zdHJpY3QgZW5jb2RpbmcgdGhhdCByZWplY3RzIGludmFsaWQgVVRGLTggY29kZVxuLy8gcG9pbnRzIGFzIHVzZWQgYnkgQ0VTVS04LlxuZXhwb3J0IGZ1bmN0aW9uIFN0cmluZ0RlY29kZXIoZW5jb2RpbmcpIHtcbiAgdGhpcy5lbmNvZGluZyA9IChlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvWy1fXS8sICcnKTtcbiAgYXNzZXJ0RW5jb2RpbmcoZW5jb2RpbmcpO1xuICBzd2l0Y2ggKHRoaXMuZW5jb2RpbmcpIHtcbiAgICBjYXNlICd1dGY4JzpcbiAgICAgIC8vIENFU1UtOCByZXByZXNlbnRzIGVhY2ggb2YgU3Vycm9nYXRlIFBhaXIgYnkgMy1ieXRlc1xuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgLy8gVVRGLTE2IHJlcHJlc2VudHMgZWFjaCBvZiBTdXJyb2dhdGUgUGFpciBieSAyLWJ5dGVzXG4gICAgICB0aGlzLnN1cnJvZ2F0ZVNpemUgPSAyO1xuICAgICAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhciA9IHV0ZjE2RGV0ZWN0SW5jb21wbGV0ZUNoYXI7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgLy8gQmFzZS02NCBzdG9yZXMgMyBieXRlcyBpbiA0IGNoYXJzLCBhbmQgcGFkcyB0aGUgcmVtYWluZGVyLlxuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMztcbiAgICAgIHRoaXMuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSBiYXNlNjREZXRlY3RJbmNvbXBsZXRlQ2hhcjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aGlzLndyaXRlID0gcGFzc1Rocm91Z2hXcml0ZTtcbiAgICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEVub3VnaCBzcGFjZSB0byBzdG9yZSBhbGwgYnl0ZXMgb2YgYSBzaW5nbGUgY2hhcmFjdGVyLiBVVEYtOCBuZWVkcyA0XG4gIC8vIGJ5dGVzLCBidXQgQ0VTVS04IG1heSByZXF1aXJlIHVwIHRvIDYgKDMgYnl0ZXMgcGVyIHN1cnJvZ2F0ZSkuXG4gIHRoaXMuY2hhckJ1ZmZlciA9IG5ldyBCdWZmZXIoNik7XG4gIC8vIE51bWJlciBvZiBieXRlcyByZWNlaXZlZCBmb3IgdGhlIGN1cnJlbnQgaW5jb21wbGV0ZSBtdWx0aS1ieXRlIGNoYXJhY3Rlci5cbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSAwO1xuICAvLyBOdW1iZXIgb2YgYnl0ZXMgZXhwZWN0ZWQgZm9yIHRoZSBjdXJyZW50IGluY29tcGxldGUgbXVsdGktYnl0ZSBjaGFyYWN0ZXIuXG4gIHRoaXMuY2hhckxlbmd0aCA9IDA7XG59O1xuXG5cbi8vIHdyaXRlIGRlY29kZXMgdGhlIGdpdmVuIGJ1ZmZlciBhbmQgcmV0dXJucyBpdCBhcyBKUyBzdHJpbmcgdGhhdCBpc1xuLy8gZ3VhcmFudGVlZCB0byBub3QgY29udGFpbiBhbnkgcGFydGlhbCBtdWx0aS1ieXRlIGNoYXJhY3RlcnMuIEFueSBwYXJ0aWFsXG4vLyBjaGFyYWN0ZXIgZm91bmQgYXQgdGhlIGVuZCBvZiB0aGUgYnVmZmVyIGlzIGJ1ZmZlcmVkIHVwLCBhbmQgd2lsbCBiZVxuLy8gcmV0dXJuZWQgd2hlbiBjYWxsaW5nIHdyaXRlIGFnYWluIHdpdGggdGhlIHJlbWFpbmluZyBieXRlcy5cbi8vXG4vLyBOb3RlOiBDb252ZXJ0aW5nIGEgQnVmZmVyIGNvbnRhaW5pbmcgYW4gb3JwaGFuIHN1cnJvZ2F0ZSB0byBhIFN0cmluZ1xuLy8gY3VycmVudGx5IHdvcmtzLCBidXQgY29udmVydGluZyBhIFN0cmluZyB0byBhIEJ1ZmZlciAodmlhIGBuZXcgQnVmZmVyYCwgb3Jcbi8vIEJ1ZmZlciN3cml0ZSkgd2lsbCByZXBsYWNlIGluY29tcGxldGUgc3Vycm9nYXRlcyB3aXRoIHRoZSB1bmljb2RlXG4vLyByZXBsYWNlbWVudCBjaGFyYWN0ZXIuIFNlZSBodHRwczovL2NvZGVyZXZpZXcuY2hyb21pdW0ub3JnLzEyMTE3MzAwOS8gLlxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgdmFyIGNoYXJTdHIgPSAnJztcbiAgLy8gaWYgb3VyIGxhc3Qgd3JpdGUgZW5kZWQgd2l0aCBhbiBpbmNvbXBsZXRlIG11bHRpYnl0ZSBjaGFyYWN0ZXJcbiAgd2hpbGUgKHRoaXMuY2hhckxlbmd0aCkge1xuICAgIC8vIGRldGVybWluZSBob3cgbWFueSByZW1haW5pbmcgYnl0ZXMgdGhpcyBidWZmZXIgaGFzIHRvIG9mZmVyIGZvciB0aGlzIGNoYXJcbiAgICB2YXIgYXZhaWxhYmxlID0gKGJ1ZmZlci5sZW5ndGggPj0gdGhpcy5jaGFyTGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQpID9cbiAgICAgICAgdGhpcy5jaGFyTGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQgOlxuICAgICAgICBidWZmZXIubGVuZ3RoO1xuXG4gICAgLy8gYWRkIHRoZSBuZXcgYnl0ZXMgdG8gdGhlIGNoYXIgYnVmZmVyXG4gICAgYnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCB0aGlzLmNoYXJSZWNlaXZlZCwgMCwgYXZhaWxhYmxlKTtcbiAgICB0aGlzLmNoYXJSZWNlaXZlZCArPSBhdmFpbGFibGU7XG5cbiAgICBpZiAodGhpcy5jaGFyUmVjZWl2ZWQgPCB0aGlzLmNoYXJMZW5ndGgpIHtcbiAgICAgIC8vIHN0aWxsIG5vdCBlbm91Z2ggY2hhcnMgaW4gdGhpcyBidWZmZXI/IHdhaXQgZm9yIG1vcmUgLi4uXG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIGJ5dGVzIGJlbG9uZ2luZyB0byB0aGUgY3VycmVudCBjaGFyYWN0ZXIgZnJvbSB0aGUgYnVmZmVyXG4gICAgYnVmZmVyID0gYnVmZmVyLnNsaWNlKGF2YWlsYWJsZSwgYnVmZmVyLmxlbmd0aCk7XG5cbiAgICAvLyBnZXQgdGhlIGNoYXJhY3RlciB0aGF0IHdhcyBzcGxpdFxuICAgIGNoYXJTdHIgPSB0aGlzLmNoYXJCdWZmZXIuc2xpY2UoMCwgdGhpcy5jaGFyTGVuZ3RoKS50b1N0cmluZyh0aGlzLmVuY29kaW5nKTtcblxuICAgIC8vIENFU1UtODogbGVhZCBzdXJyb2dhdGUgKEQ4MDAtREJGRikgaXMgYWxzbyB0aGUgaW5jb21wbGV0ZSBjaGFyYWN0ZXJcbiAgICB2YXIgY2hhckNvZGUgPSBjaGFyU3RyLmNoYXJDb2RlQXQoY2hhclN0ci5sZW5ndGggLSAxKTtcbiAgICBpZiAoY2hhckNvZGUgPj0gMHhEODAwICYmIGNoYXJDb2RlIDw9IDB4REJGRikge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoICs9IHRoaXMuc3Vycm9nYXRlU2l6ZTtcbiAgICAgIGNoYXJTdHIgPSAnJztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICB0aGlzLmNoYXJSZWNlaXZlZCA9IHRoaXMuY2hhckxlbmd0aCA9IDA7XG5cbiAgICAvLyBpZiB0aGVyZSBhcmUgbm8gbW9yZSBieXRlcyBpbiB0aGlzIGJ1ZmZlciwganVzdCBlbWl0IG91ciBjaGFyXG4gICAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjaGFyU3RyO1xuICAgIH1cbiAgICBicmVhaztcbiAgfVxuXG4gIC8vIGRldGVybWluZSBhbmQgc2V0IGNoYXJMZW5ndGggLyBjaGFyUmVjZWl2ZWRcbiAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpO1xuXG4gIHZhciBlbmQgPSBidWZmZXIubGVuZ3RoO1xuICBpZiAodGhpcy5jaGFyTGVuZ3RoKSB7XG4gICAgLy8gYnVmZmVyIHRoZSBpbmNvbXBsZXRlIGNoYXJhY3RlciBieXRlcyB3ZSBnb3RcbiAgICBidWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIDAsIGJ1ZmZlci5sZW5ndGggLSB0aGlzLmNoYXJSZWNlaXZlZCwgZW5kKTtcbiAgICBlbmQgLT0gdGhpcy5jaGFyUmVjZWl2ZWQ7XG4gIH1cblxuICBjaGFyU3RyICs9IGJ1ZmZlci50b1N0cmluZyh0aGlzLmVuY29kaW5nLCAwLCBlbmQpO1xuXG4gIHZhciBlbmQgPSBjaGFyU3RyLmxlbmd0aCAtIDE7XG4gIHZhciBjaGFyQ29kZSA9IGNoYXJTdHIuY2hhckNvZGVBdChlbmQpO1xuICAvLyBDRVNVLTg6IGxlYWQgc3Vycm9nYXRlIChEODAwLURCRkYpIGlzIGFsc28gdGhlIGluY29tcGxldGUgY2hhcmFjdGVyXG4gIGlmIChjaGFyQ29kZSA+PSAweEQ4MDAgJiYgY2hhckNvZGUgPD0gMHhEQkZGKSB7XG4gICAgdmFyIHNpemUgPSB0aGlzLnN1cnJvZ2F0ZVNpemU7XG4gICAgdGhpcy5jaGFyTGVuZ3RoICs9IHNpemU7XG4gICAgdGhpcy5jaGFyUmVjZWl2ZWQgKz0gc2l6ZTtcbiAgICB0aGlzLmNoYXJCdWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIHNpemUsIDAsIHNpemUpO1xuICAgIGJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgMCwgMCwgc2l6ZSk7XG4gICAgcmV0dXJuIGNoYXJTdHIuc3Vic3RyaW5nKDAsIGVuZCk7XG4gIH1cblxuICAvLyBvciBqdXN0IGVtaXQgdGhlIGNoYXJTdHJcbiAgcmV0dXJuIGNoYXJTdHI7XG59O1xuXG4vLyBkZXRlY3RJbmNvbXBsZXRlQ2hhciBkZXRlcm1pbmVzIGlmIHRoZXJlIGlzIGFuIGluY29tcGxldGUgVVRGLTggY2hhcmFjdGVyIGF0XG4vLyB0aGUgZW5kIG9mIHRoZSBnaXZlbiBidWZmZXIuIElmIHNvLCBpdCBzZXRzIHRoaXMuY2hhckxlbmd0aCB0byB0aGUgYnl0ZVxuLy8gbGVuZ3RoIHRoYXQgY2hhcmFjdGVyLCBhbmQgc2V0cyB0aGlzLmNoYXJSZWNlaXZlZCB0byB0aGUgbnVtYmVyIG9mIGJ5dGVzXG4vLyB0aGF0IGFyZSBhdmFpbGFibGUgZm9yIHRoaXMgY2hhcmFjdGVyLlxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgLy8gZGV0ZXJtaW5lIGhvdyBtYW55IGJ5dGVzIHdlIGhhdmUgdG8gY2hlY2sgYXQgdGhlIGVuZCBvZiB0aGlzIGJ1ZmZlclxuICB2YXIgaSA9IChidWZmZXIubGVuZ3RoID49IDMpID8gMyA6IGJ1ZmZlci5sZW5ndGg7XG5cbiAgLy8gRmlndXJlIG91dCBpZiBvbmUgb2YgdGhlIGxhc3QgaSBieXRlcyBvZiBvdXIgYnVmZmVyIGFubm91bmNlcyBhblxuICAvLyBpbmNvbXBsZXRlIGNoYXIuXG4gIGZvciAoOyBpID4gMDsgaS0tKSB7XG4gICAgdmFyIGMgPSBidWZmZXJbYnVmZmVyLmxlbmd0aCAtIGldO1xuXG4gICAgLy8gU2VlIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVVRGLTgjRGVzY3JpcHRpb25cblxuICAgIC8vIDExMFhYWFhYXG4gICAgaWYgKGkgPT0gMSAmJiBjID4+IDUgPT0gMHgwNikge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gMjtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIDExMTBYWFhYXG4gICAgaWYgKGkgPD0gMiAmJiBjID4+IDQgPT0gMHgwRSkge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gMztcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIDExMTEwWFhYXG4gICAgaWYgKGkgPD0gMyAmJiBjID4+IDMgPT0gMHgxRSkge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gNDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGk7XG59O1xuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgdmFyIHJlcyA9ICcnO1xuICBpZiAoYnVmZmVyICYmIGJ1ZmZlci5sZW5ndGgpXG4gICAgcmVzID0gdGhpcy53cml0ZShidWZmZXIpO1xuXG4gIGlmICh0aGlzLmNoYXJSZWNlaXZlZCkge1xuICAgIHZhciBjciA9IHRoaXMuY2hhclJlY2VpdmVkO1xuICAgIHZhciBidWYgPSB0aGlzLmNoYXJCdWZmZXI7XG4gICAgdmFyIGVuYyA9IHRoaXMuZW5jb2Rpbmc7XG4gICAgcmVzICs9IGJ1Zi5zbGljZSgwLCBjcikudG9TdHJpbmcoZW5jKTtcbiAgfVxuXG4gIHJldHVybiByZXM7XG59O1xuXG5mdW5jdGlvbiBwYXNzVGhyb3VnaFdyaXRlKGJ1ZmZlcikge1xuICByZXR1cm4gYnVmZmVyLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcpO1xufVxuXG5mdW5jdGlvbiB1dGYxNkRldGVjdEluY29tcGxldGVDaGFyKGJ1ZmZlcikge1xuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGJ1ZmZlci5sZW5ndGggJSAyO1xuICB0aGlzLmNoYXJMZW5ndGggPSB0aGlzLmNoYXJSZWNlaXZlZCA/IDIgOiAwO1xufVxuXG5mdW5jdGlvbiBiYXNlNjREZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpIHtcbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSBidWZmZXIubGVuZ3RoICUgMztcbiAgdGhpcy5jaGFyTGVuZ3RoID0gdGhpcy5jaGFyUmVjZWl2ZWQgPyAzIDogMDtcbn1cbiIsImltcG9ydCB7Z2VuZXJhdGVTY2hlbWF9IGZyb20gXCIuL2luZGV4U2NoZW1hQ3JlYXRvclwiO1xuaW1wb3J0IHsgaGFzLCBpc1N0cmluZywgZGlmZmVyZW5jZSwgZmluZCB9IGZyb20gXCJsb2Rhc2gvZnBcIjtcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJzYWZlLWJ1ZmZlclwiO1xuaW1wb3J0IHtTdHJpbmdEZWNvZGVyfSBmcm9tIFwic3RyaW5nX2RlY29kZXJcIjtcbmltcG9ydCB7Z2V0VHlwZX0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgeyBpc1NvbWV0aGluZyB9IGZyb20gXCIuLi9jb21tb25cIjtcblxuZXhwb3J0IGNvbnN0IEJVRkZFUl9NQVhfQllURVMgPSA1MjQyODg7IC8vIDAuNU1iXG5cbmV4cG9ydCBjb25zdCBDT05USU5VRV9SRUFESU5HX1JFQ09SRFMgPSBcIkNPTlRJTlVFX1JFQURJTkdcIjtcbmV4cG9ydCBjb25zdCBSRUFEX1JFTUFJTklOR19URVhUID0gXCJSRUFEX1JFTUFJTklOR1wiO1xuZXhwb3J0IGNvbnN0IENBTkNFTF9SRUFEID0gXCJDQU5DRUxcIjtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4V3JpdGVyID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlLCByZWFkYWJsZVN0cmVhbSwgd3JpdGFibGVTdHJlYW0sIGVuZCkgPT4ge1xuICAgIGNvbnN0IHNjaGVtYSA9IGdlbmVyYXRlU2NoZW1hKGhpZXJhcmNoeSwgaW5kZXhOb2RlKTtcblxuICAgIHJldHVybiAoe1xuICAgICAgICByZWFkOiByZWFkKHJlYWRhYmxlU3RyZWFtLCBzY2hlbWEpLFxuICAgICAgICB1cGRhdGVJbmRleDogdXBkYXRlSW5kZXgocmVhZGFibGVTdHJlYW0sIHdyaXRhYmxlU3RyZWFtLCBzY2hlbWEsIGVuZClcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleFJlYWRlciA9IChoaWVyYXJjaHksIGluZGV4Tm9kZSwgcmVhZGFibGVTdHJlYW0pID0+IFxuICAgIHJlYWQoXG4gICAgICAgIHJlYWRhYmxlU3RyZWFtLCBcbiAgICAgICAgZ2VuZXJhdGVTY2hlbWEoaGllcmFyY2h5LCBpbmRleE5vZGUpXG4gICAgKTtcblxuY29uc3QgdXBkYXRlSW5kZXggPSAocmVhZGFibGVTdHJlYW0sIHdyaXRhYmxlU3RyZWFtLCBzY2hlbWEpID0+IGFzeW5jIChpdGVtc1RvV3JpdGUsIGtleXNUb1JlbW92ZSkgPT4ge1xuICAgIGNvbnN0IHdyaXRlID0gbmV3T3V0cHV0V3JpdGVyKEJVRkZFUl9NQVhfQllURVMsIHdyaXRhYmxlU3RyZWFtKTtcbiAgICBjb25zdCB3cml0dGVuSXRlbXMgPSBbXTsgXG4gICAgYXdhaXQgcmVhZChyZWFkYWJsZVN0cmVhbSwgc2NoZW1hKShcbiAgICAgICAgYXN5bmMgaW5kZXhlZEl0ZW0gPT4ge1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlZCA9IGZpbmQoaSA9PiBpbmRleGVkSXRlbS5rZXkgPT09IGkua2V5KShpdGVtc1RvV3JpdGUpO1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlZCA9IGZpbmQoayA9PiBpbmRleGVkSXRlbS5rZXkgPT09IGspKGtleXNUb1JlbW92ZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKGlzU29tZXRoaW5nKHJlbW92ZWQpKSBcbiAgICAgICAgICAgICAgICByZXR1cm4gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xuXG4gICAgICAgICAgICBpZihpc1NvbWV0aGluZyh1cGRhdGVkKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlcmlhbGl6ZWRJdGVtID0gIHNlcmlhbGl6ZUl0ZW0oc2NoZW1hLCB1cGRhdGVkKTtcbiAgICAgICAgICAgICAgICBhd2FpdCB3cml0ZShzZXJpYWxpemVkSXRlbSk7XG4gICAgICAgICAgICAgICAgd3JpdHRlbkl0ZW1zLnB1c2godXBkYXRlZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRlKFxuICAgICAgICAgICAgICAgICAgICBzZXJpYWxpemVJdGVtKHNjaGVtYSwgaW5kZXhlZEl0ZW0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gXG5cbiAgICAgICAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XG5cbiAgICAgICAgfSxcbiAgICAgICAgYXN5bmMgdGV4dCA9PiBhd2FpdCB3cml0ZSh0ZXh0KVxuICAgICk7XG5cbiAgICBpZih3cml0dGVuSXRlbXMubGVuZ3RoICE9PSBpdGVtc1RvV3JpdGUubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHRvQWRkID0gZGlmZmVyZW5jZShpdGVtc1RvV3JpdGUsIHdyaXR0ZW5JdGVtcyk7XG4gICAgICAgIGZvcihsZXQgYWRkZWQgb2YgdG9BZGQpIHtcbiAgICAgICAgICAgIGF3YWl0IHdyaXRlKFxuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZUl0ZW0oc2NoZW1hLCBhZGRlZClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYod3JpdHRlbkl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBwb3RlbnRpYWxseSBhcmUgbm8gcmVjb3Jkc1xuICAgICAgICBhd2FpdCB3cml0ZShcIlwiKTtcbiAgICB9XG5cbiAgICBhd2FpdCB3cml0ZSgpO1xuICAgIGF3YWl0IHdyaXRhYmxlU3RyZWFtLmVuZCgpO1xufTtcblxuY29uc3QgcmVhZCA9IChyZWFkYWJsZVN0cmVhbSwgc2NoZW1hKSA9PiBhc3luYyAob25HZXRJdGVtLCBvbkdldFRleHQpID0+IHtcbiAgICBjb25zdCByZWFkSW5wdXQgPSBuZXdJbnB1dFJlYWRlcihyZWFkYWJsZVN0cmVhbSk7XG4gICAgbGV0IHRleHQgPSBhd2FpdCByZWFkSW5wdXQoKTtcbiAgICBsZXQgc3RhdHVzID0gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xuICAgIHdoaWxlKHRleHQubGVuZ3RoID4gMCkge1xuXG4gICAgICAgIGlmKHN0YXR1cyA9PT0gUkVBRF9SRU1BSU5JTkdfVEVYVCkge1xuICAgICAgICAgICAgYXdhaXQgb25HZXRUZXh0KHRleHQpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZihzdGF0dXMgPT09IENBTkNFTF9SRUFEKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcm93VGV4dCA9IFwiXCI7XG4gICAgICAgIGxldCBjdXJyZW50Q2hhckluZGV4PTA7XG4gICAgICAgIGZvcihsZXQgY3VycmVudENoYXIgb2YgdGV4dCkge1xuICAgICAgICAgICAgcm93VGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcIlxcclwiKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzID0gYXdhaXQgb25HZXRJdGVtKFxuICAgICAgICAgICAgICAgICAgICBkZXNlcmlhbGl6ZVJvdyhzY2hlbWEsIHJvd1RleHQpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByb3dUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBpZihzdGF0dXMgPT09IFJFQURfUkVNQUlOSU5HX1RFWFQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudENoYXJJbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoY3VycmVudENoYXJJbmRleCA8IHRleHQubGVuZ3RoIC0xKSB7XG4gICAgICAgICAgICBhd2FpdCBvbkdldFRleHQodGV4dC5zdWJzdHJpbmcoY3VycmVudENoYXJJbmRleCArIDEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHQgPSBhd2FpdCByZWFkSW5wdXQoKTtcbiAgICB9XG5cbiAgICBhd2FpdCByZWFkYWJsZVN0cmVhbS5kZXN0cm95KCk7XG5cbn07XG5cbmNvbnN0IG5ld091dHB1dFdyaXRlciA9IChmbHVzaEJvdW5kYXJ5LCB3cml0YWJsZVN0cmVhbSkgPT4ge1xuICAgIFxuICAgIGxldCBjdXJyZW50QnVmZmVyID0gbnVsbDtcblxuICAgIHJldHVybiBhc3luYyAodGV4dCkgPT4ge1xuXG4gICAgICAgIGlmKGlzU3RyaW5nKHRleHQpICYmIGN1cnJlbnRCdWZmZXIgPT09IG51bGwpXG4gICAgICAgICAgICBjdXJyZW50QnVmZmVyID0gQnVmZmVyLmZyb20odGV4dCwgXCJ1dGY4XCIpO1xuICAgICAgICBlbHNlIGlmKGlzU3RyaW5nKHRleHQpKVxuICAgICAgICAgICAgY3VycmVudEJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoW1xuICAgICAgICAgICAgICAgIGN1cnJlbnRCdWZmZXIsXG4gICAgICAgICAgICAgICAgQnVmZmVyLmZyb20odGV4dCwgXCJ1dGY4XCIpXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgXG4gICAgICAgIGlmKGN1cnJlbnRCdWZmZXIgIT09IG51bGwgJiZcbiAgICAgICAgICAgIChjdXJyZW50QnVmZmVyLmxlbmd0aCA+IGZsdXNoQm91bmRhcnlcbiAgICAgICAgICAgICB8fCAhaXNTdHJpbmcodGV4dCkpKSB7XG5cbiAgICAgICAgICAgIGF3YWl0IHdyaXRhYmxlU3RyZWFtLndyaXRlKGN1cnJlbnRCdWZmZXIpO1xuICAgICAgICAgICAgY3VycmVudEJ1ZmZlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5jb25zdCBuZXdJbnB1dFJlYWRlciA9IChyZWFkYWJsZVN0cmVhbSkgPT4ge1xuXG4gICAgY29uc3QgZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKCd1dGY4Jyk7XG4gICAgbGV0IHJlbWFpbmluZ0J5dGVzID0gW107XG5cbiAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgIGxldCBuZXh0Qnl0ZXNCdWZmZXIgPSBhd2FpdCByZWFkYWJsZVN0cmVhbS5yZWFkKEJVRkZFUl9NQVhfQllURVMpO1xuICAgICAgICBjb25zdCByZW1haW5pbmdCdWZmZXIgPSBCdWZmZXIuZnJvbShyZW1haW5pbmdCeXRlcyk7XG5cbiAgICAgICAgaWYoIW5leHRCeXRlc0J1ZmZlcikgbmV4dEJ5dGVzQnVmZmVyID0gQnVmZmVyLmZyb20oW10pO1xuXG4gICAgICAgIGNvbnN0IG1vcmVUb1JlYWQgPSBuZXh0Qnl0ZXNCdWZmZXIubGVuZ3RoID09PSBCVUZGRVJfTUFYX0JZVEVTO1xuXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoXG4gICAgICAgICAgICBbcmVtYWluaW5nQnVmZmVyLCBuZXh0Qnl0ZXNCdWZmZXJdLFxuICAgICAgICAgICAgcmVtYWluaW5nQnVmZmVyLmxlbmd0aCArIG5leHRCeXRlc0J1ZmZlci5sZW5ndGgpO1xuXG4gICAgICAgIGNvbnN0IHRleHQgPSBkZWNvZGVyLndyaXRlKGJ1ZmZlcik7XG4gICAgICAgIHJlbWFpbmluZ0J5dGVzID0gZGVjb2Rlci5lbmQoYnVmZmVyKTtcblxuICAgICAgICBpZighbW9yZVRvUmVhZCAmJiByZW1haW5pbmdCeXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBpZiBmb3IgYW55IHJlYXNvbiwgd2UgaGF2ZSByZW1haW5pbmcgYnl0ZXMgYXQgdGhlIGVuZFxuICAgICAgICAgICAgLy8gb2YgdGhlIHN0cmVhbSwganVzdCBkaXNjYXJkIC0gZG9udCBzZWUgd2h5IHRoaXMgc2hvdWxkXG4gICAgICAgICAgICAvLyBldmVyIGhhcHBlbiwgYnV0IGlmIGl0IGRvZXMsIGl0IGNvdWxkIGNhdXNlIGEgc3RhY2sgb3ZlcmZsb3dcbiAgICAgICAgICAgIHJlbWFpbmluZ0J5dGVzID0gW107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9O1xufTtcblxuY29uc3QgZGVzZXJpYWxpemVSb3cgPSAoc2NoZW1hLCByb3dUZXh0KSA9PiB7XG4gICAgbGV0IGN1cnJlbnRQcm9wSW5kZXggPSAwO1xuICAgIGxldCBjdXJyZW50Q2hhckluZGV4ID0gMDtcbiAgICBsZXQgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XG4gICAgbGV0IGlzRXNjYXBlZCA9IGZhbHNlO1xuICAgIGNvbnN0IGl0ZW0gPSB7fTtcblxuICAgIGNvbnN0IHNldEN1cnJlbnRQcm9wID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJyZW50UHJvcCA9IHNjaGVtYVtjdXJyZW50UHJvcEluZGV4XTtcbiAgICAgICAgY29uc3QgdHlwZSA9IGdldFR5cGUoY3VycmVudFByb3AudHlwZSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY3VycmVudFZhbHVlVGV4dCA9PT0gXCJcIlxuICAgICAgICAgICAgICAgICAgICAgID8gdHlwZS5nZXREZWZhdWx0VmFsdWUoKVxuICAgICAgICAgICAgICAgICAgICAgIDogdHlwZS5zYWZlUGFyc2VWYWx1ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCk7XG4gICAgICAgIGl0ZW1bY3VycmVudFByb3AubmFtZV0gPSB2YWx1ZTtcbiAgICB9O1xuICAgIFxuICAgIHdoaWxlKGN1cnJlbnRQcm9wSW5kZXggPCBzY2hlbWEubGVuZ3RoKSB7XG5cbiAgICAgICAgaWYoY3VycmVudENoYXJJbmRleCA8IHJvd1RleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2hhciA9IHJvd1RleHRbY3VycmVudENoYXJJbmRleF07XG4gICAgICAgICAgICBpZihpc0VzY2FwZWQpIHtcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCJyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCArPSBcIlxcclwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZVRleHQgKz0gY3VycmVudENoYXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlzRXNjYXBlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCIsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0Q3VycmVudFByb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQcm9wSW5kZXgrKztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoY3VycmVudENoYXIgPT09IFwiXFxcXFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzRXNjYXBlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyZW50Q2hhckluZGV4Kys7IFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICBzZXRDdXJyZW50UHJvcCgpO1xuICAgICAgICAgICAgY3VycmVudFByb3BJbmRleCsrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZW07XG59O1xuXG5leHBvcnQgY29uc3Qgc2VyaWFsaXplSXRlbSA9IChzY2hlbWEsIGl0ZW0pICA9PiB7XG5cbiAgICBsZXQgcm93VGV4dCA9IFwiXCJcblxuICAgIGZvcihsZXQgcHJvcCBvZiBzY2hlbWEpIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IGdldFR5cGUocHJvcC50eXBlKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBoYXMocHJvcC5uYW1lKShpdGVtKVxuICAgICAgICAgICAgICAgICAgICAgID8gaXRlbVtwcm9wLm5hbWVdXG4gICAgICAgICAgICAgICAgICAgICAgOiB0eXBlLmdldERlZmF1bHRWYWx1ZSgpXG4gICAgICAgIFxuICAgICAgICBjb25zdCB2YWxTdHIgPSB0eXBlLnN0cmluZ2lmeSh2YWx1ZSk7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHZhbFN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudENoYXIgPSB2YWxTdHJbaV07XG4gICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCIsXCIgXG4gICAgICAgICAgICAgICB8fCBjdXJyZW50Q2hhciA9PT0gXCJcXHJcIiBcbiAgICAgICAgICAgICAgIHx8IGN1cnJlbnRDaGFyID09PSBcIlxcXFxcIikge1xuICAgICAgICAgICAgICAgIHJvd1RleHQgKz0gXCJcXFxcXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcIlxcclwiKSB7XG4gICAgICAgICAgICAgICAgcm93VGV4dCArPSBcInJcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcm93VGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJvd1RleHQgKz0gXCIsXCI7XG4gICAgfVxuXG4gICAgcm93VGV4dCArPSBcIlxcclwiO1xuICAgIHJldHVybiByb3dUZXh0O1xufTsiLCJpbXBvcnQgbHVuciBmcm9tICdsdW5yJztcbmltcG9ydCB7XG4gIGdldEhhc2hDb2RlLFxuICBqb2luS2V5XG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBnZXRBY3R1YWxLZXlPZlBhcmVudCxcbiAgaXNHbG9iYWxJbmRleCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7cHJvbWlzZVJlYWRhYmxlU3RyZWFtfSBmcm9tIFwiLi9wcm9taXNlUmVhZGFibGVTdHJlYW1cIjtcbmltcG9ydCB7IGNyZWF0ZUluZGV4RmlsZSB9IGZyb20gJy4vc2hhcmRpbmcnO1xuaW1wb3J0IHsgZ2VuZXJhdGVTY2hlbWEgfSBmcm9tICcuL2luZGV4U2NoZW1hQ3JlYXRvcic7XG5pbXBvcnQgeyBnZXRJbmRleFJlYWRlciwgQ09OVElOVUVfUkVBRElOR19SRUNPUkRTIH0gZnJvbSAnLi9zZXJpYWxpemVyJztcblxuZXhwb3J0IGNvbnN0IHJlYWRJbmRleCA9IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KSA9PiB7XG4gIGNvbnN0IHJlY29yZHMgPSBbXTtcbiAgY29uc3QgZG9SZWFkID0gaXRlcmF0ZUluZGV4KFxuICAgICAgICBhc3luYyBpdGVtID0+IHtcbiAgICAgIHJlY29yZHMucHVzaChpdGVtKTtcbiAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XG4gICAgfSxcbiAgICAgICAgYXN5bmMgKCkgPT4gcmVjb3Jkc1xuICApO1xuXG4gIHJldHVybiBhd2FpdCBkb1JlYWQoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2VhcmNoSW5kZXggPSBhc3luYyAoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSwgc2VhcmNoUGhyYXNlKSA9PiB7XG4gIGNvbnN0IHJlY29yZHMgPSBbXTtcbiAgY29uc3Qgc2NoZW1hID0gZ2VuZXJhdGVTY2hlbWEoaGllcmFyY2h5LCBpbmRleCk7XG4gIGNvbnN0IGRvUmVhZCA9IGl0ZXJhdGVJbmRleChcbiAgICAgICAgYXN5bmMgaXRlbSA9PiB7XG4gICAgICBjb25zdCBpZHggPSBsdW5yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yZWYoJ2tleScpO1xuICAgICAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIHNjaGVtYSkge1xuICAgICAgICAgIHRoaXMuZmllbGQoZmllbGQubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGQoaXRlbSk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNlYXJjaFJlc3VsdHMgPSBpZHguc2VhcmNoKHNlYXJjaFBocmFzZSk7XG4gICAgICBpZiAoc2VhcmNoUmVzdWx0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaXRlbS5fc2VhcmNoUmVzdWx0ID0gc2VhcmNoUmVzdWx0c1swXTtcbiAgICAgICAgcmVjb3Jkcy5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcbiAgICB9LFxuICAgICAgICBhc3luYyAoKSA9PiByZWNvcmRzXG4gICk7XG5cbiAgcmV0dXJuIGF3YWl0IGRvUmVhZChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleGVkRGF0YUtleV9mcm9tSW5kZXhLZXkgPSAoaW5kZXhLZXkpID0+IFxuICBgJHtpbmRleEtleX0ke2luZGV4S2V5LmVuZHNXaXRoKCcuY3N2JykgPyAnJyA6ICcuY3N2J31gO1xuXG5leHBvcnQgY29uc3QgdW5pcXVlSW5kZXhOYW1lID0gaW5kZXggPT4gYGlkeF8ke1xuICBnZXRIYXNoQ29kZShgJHtpbmRleC5maWx0ZXJ9JHtpbmRleC5tYXB9YClcbn0uY3N2YDtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4ZWREYXRhS2V5ID0gKGRlY2VuZGFudEtleSwgaW5kZXhOb2RlKSA9PiB7XG4gIGlmIChpc0dsb2JhbEluZGV4KGluZGV4Tm9kZSkpIHsgcmV0dXJuIGAke2luZGV4Tm9kZS5ub2RlS2V5KCl9LmNzdmA7IH1cblxuICBjb25zdCBpbmRleGVkRGF0YVBhcmVudEtleSA9IGdldEFjdHVhbEtleU9mUGFyZW50KFxuICAgIGluZGV4Tm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksXG4gICAgZGVjZW5kYW50S2V5LFxuICApO1xuXG4gIGNvbnN0IGluZGV4TmFtZSA9IGluZGV4Tm9kZS5uYW1lXG4gICAgPyBgJHtpbmRleE5vZGUubmFtZX0uY3N2YFxuICAgIDogdW5pcXVlSW5kZXhOYW1lKGluZGV4Tm9kZSk7XG5cbiAgcmV0dXJuIGpvaW5LZXkoXG4gICAgaW5kZXhlZERhdGFQYXJlbnRLZXksXG4gICAgaW5kZXhOYW1lLFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGl0ZXJhdGVJbmRleCA9IChvbkdldEl0ZW0sIGdldEZpbmFsUmVzdWx0KSA9PiBhc3luYyAoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlYWRhYmxlU3RyZWFtID0gcHJvbWlzZVJlYWRhYmxlU3RyZWFtKFxuICAgICAgICBhd2FpdCBkYXRhc3RvcmUucmVhZGFibGVGaWxlU3RyZWFtKGluZGV4ZWREYXRhS2V5KVxuICAgICk7XG5cbiAgICBjb25zdCByZWFkID0gZ2V0SW5kZXhSZWFkZXIoaGllcmFyY2h5LCBpbmRleCwgcmVhZGFibGVTdHJlYW0pO1xuICAgIGF3YWl0IHJlYWQob25HZXRJdGVtKTtcbiAgICByZXR1cm4gZ2V0RmluYWxSZXN1bHQoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGluZGV4ZWREYXRhS2V5KSkge1xuICAgICAgdGhyb3cgZTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgY3JlYXRlSW5kZXhGaWxlKFxuICAgICAgICBkYXRhc3RvcmUsXG4gICAgICAgIGluZGV4ZWREYXRhS2V5LFxuICAgICAgICBpbmRleCxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxufTtcbiIsImltcG9ydCB7IGZsYXR0ZW4sIG1lcmdlIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIHNhZmVLZXksIGFwaVdyYXBwZXIsICQsXG4gIGV2ZW50cywgaXNOb25FbXB0eVN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHJlYWRJbmRleCwgc2VhcmNoSW5kZXggfSBmcm9tICcuLi9pbmRleGluZy9yZWFkJztcbmltcG9ydCB7XG4gIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSxcbiAgZ2V0U2hhcmRLZXlzSW5SYW5nZSxcbn0gZnJvbSAnLi4vaW5kZXhpbmcvc2hhcmRpbmcnO1xuaW1wb3J0IHtcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCwgaXNJbmRleCxcbiAgaXNTaGFyZGVkSW5kZXgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBsaXN0SXRlbXMgPSBhcHAgPT4gYXN5bmMgKGluZGV4S2V5LCBvcHRpb25zKSA9PiB7XG4gIGluZGV4S2V5ID0gc2FmZUtleShpbmRleEtleSk7XG4gIHJldHVybiBhcGlXcmFwcGVyKFxuICAgIGFwcCxcbiAgICBldmVudHMuaW5kZXhBcGkubGlzdEl0ZW1zLFxuICAgIHBlcm1pc3Npb24ucmVhZEluZGV4LmlzQXV0aG9yaXplZChpbmRleEtleSksXG4gICAgeyBpbmRleEtleSwgb3B0aW9ucyB9LFxuICAgIF9saXN0SXRlbXMsIGFwcCwgaW5kZXhLZXksIG9wdGlvbnMsXG4gICk7XG59XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0geyByYW5nZVN0YXJ0UGFyYW1zOiBudWxsLCByYW5nZUVuZFBhcmFtczogbnVsbCwgc2VhcmNoUGhyYXNlOiBudWxsIH07XG5cbmNvbnN0IF9saXN0SXRlbXMgPSBhc3luYyAoYXBwLCBpbmRleEtleSwgb3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zKSA9PiB7XG4gIGNvbnN0IHsgc2VhcmNoUGhyYXNlLCByYW5nZVN0YXJ0UGFyYW1zLCByYW5nZUVuZFBhcmFtcyB9ID0gJCh7fSwgW1xuICAgIG1lcmdlKG9wdGlvbnMpLFxuICAgIG1lcmdlKGRlZmF1bHRPcHRpb25zKSxcbiAgXSk7XG5cbiAgY29uc3QgZ2V0SXRlbXMgPSBhc3luYyBrZXkgPT4gKGlzTm9uRW1wdHlTdHJpbmcoc2VhcmNoUGhyYXNlKVxuICAgID8gYXdhaXQgc2VhcmNoSW5kZXgoXG4gICAgICBhcHAuaGllcmFyY2h5LFxuICAgICAgYXBwLmRhdGFzdG9yZSxcbiAgICAgIGluZGV4Tm9kZSxcbiAgICAgIGtleSxcbiAgICAgIHNlYXJjaFBocmFzZSxcbiAgICApXG4gICAgOiBhd2FpdCByZWFkSW5kZXgoXG4gICAgICBhcHAuaGllcmFyY2h5LFxuICAgICAgYXBwLmRhdGFzdG9yZSxcbiAgICAgIGluZGV4Tm9kZSxcbiAgICAgIGtleSxcbiAgICApKTtcblxuICBpbmRleEtleSA9IHNhZmVLZXkoaW5kZXhLZXkpO1xuICBjb25zdCBpbmRleE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKGluZGV4S2V5KTtcblxuICBpZiAoIWlzSW5kZXgoaW5kZXhOb2RlKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ3N1cHBsaWVkIGtleSBpcyBub3QgYW4gaW5kZXgnKTsgfVxuXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleE5vZGUpKSB7XG4gICAgY29uc3Qgc2hhcmRLZXlzID0gYXdhaXQgZ2V0U2hhcmRLZXlzSW5SYW5nZShcbiAgICAgIGFwcCwgaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zLFxuICAgICk7XG4gICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGsgb2Ygc2hhcmRLZXlzKSB7XG4gICAgICBpdGVtcy5wdXNoKGF3YWl0IGdldEl0ZW1zKGspKTtcbiAgICB9XG4gICAgcmV0dXJuIGZsYXR0ZW4oaXRlbXMpO1xuICB9XG4gIHJldHVybiBhd2FpdCBnZXRJdGVtcyhcbiAgICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXkoaW5kZXhLZXkpLFxuICApO1xufTtcbiIsImltcG9ydCB7IG1hcCwgaXNTdHJpbmcsIGhhcywgc29tZSB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxuICBmaW5kRmllbGQsIGdldE5vZGUsIGlzR2xvYmFsSW5kZXgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBsaXN0SXRlbXMgfSBmcm9tICcuLi9pbmRleEFwaS9saXN0SXRlbXMnO1xuaW1wb3J0IHtcbiAgJCwgYXBpV3JhcHBlclN5bmMsIGV2ZW50cywgc2FmZUtleVxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0SW5kZXhLZXlfQmFzZWRPbkRlY2VuZGFudCB9IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGdldENvbnRleHQgPSBhcHAgPT4gcmVjb3JkS2V5ID0+IHtcbiAgcmVjb3JkS2V5ID0gc2FmZUtleShyZWNvcmRLZXkpO1xuICByZXR1cm4gIGFwaVdyYXBwZXJTeW5jKFxuICAgIGFwcCxcbiAgICBldmVudHMucmVjb3JkQXBpLmdldENvbnRleHQsXG4gICAgcGVybWlzc2lvbi5yZWFkUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmRLZXkpLFxuICAgIHsgcmVjb3JkS2V5IH0sXG4gICAgX2dldENvbnRleHQsIGFwcCwgcmVjb3JkS2V5LFxuICApO1xufVxuXG5leHBvcnQgY29uc3QgX2dldENvbnRleHQgPSAoYXBwLCByZWNvcmRLZXkpID0+IHtcbiAgcmVjb3JkS2V5ID0gc2FmZUtleShyZWNvcmRLZXkpO1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShyZWNvcmRLZXkpO1xuXG4gIGNvbnN0IGNhY2hlZFJlZmVyZW5jZUluZGV4ZXMgPSB7fTtcblxuICBjb25zdCBsYXp5TG9hZFJlZmVyZW5jZUluZGV4ID0gYXN5bmMgKHR5cGVPcHRpb25zKSA9PiB7XG4gICAgaWYgKCFoYXModHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5KShjYWNoZWRSZWZlcmVuY2VJbmRleGVzKSkge1xuICAgICAgY2FjaGVkUmVmZXJlbmNlSW5kZXhlc1t0eXBlT3B0aW9ucy5pbmRleE5vZGVLZXldID0ge1xuICAgICAgICB0eXBlT3B0aW9ucyxcbiAgICAgICAgZGF0YTogYXdhaXQgcmVhZFJlZmVyZW5jZUluZGV4KFxuICAgICAgICAgIGFwcCwgcmVjb3JkS2V5LCB0eXBlT3B0aW9ucyxcbiAgICAgICAgKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhY2hlZFJlZmVyZW5jZUluZGV4ZXNbdHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5XTtcbiAgfTtcblxuICBjb25zdCBnZXRUeXBlT3B0aW9ucyA9IHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSA9PiAoaXNTdHJpbmcodHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKVxuICAgID8gZmluZEZpZWxkKHJlY29yZE5vZGUsIHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSlcbiAgICAgIC50eXBlT3B0aW9uc1xuICAgIDogdHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKTtcblxuICByZXR1cm4ge1xuICAgIHJlZmVyZW5jZUV4aXN0czogYXN5bmMgKHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSwga2V5KSA9PiB7XG4gICAgICBjb25zdCB0eXBlT3B0aW9ucyA9IGdldFR5cGVPcHRpb25zKHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSk7XG4gICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGxhenlMb2FkUmVmZXJlbmNlSW5kZXgodHlwZU9wdGlvbnMpO1xuICAgICAgcmV0dXJuIHNvbWUoaSA9PiBpLmtleSA9PT0ga2V5KShkYXRhKTtcbiAgICB9LFxuICAgIHJlZmVyZW5jZU9wdGlvbnM6IGFzeW5jICh0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHR5cGVPcHRpb25zID0gZ2V0VHlwZU9wdGlvbnModHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKTtcbiAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgbGF6eUxvYWRSZWZlcmVuY2VJbmRleCh0eXBlT3B0aW9ucyk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9LFxuICAgIHJlY29yZE5vZGUsXG4gIH07XG59O1xuXG5jb25zdCByZWFkUmVmZXJlbmNlSW5kZXggPSBhc3luYyAoYXBwLCByZWNvcmRLZXksIHR5cGVPcHRpb25zKSA9PiB7XG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldE5vZGUoYXBwLmhpZXJhcmNoeSwgdHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5KTtcbiAgY29uc3QgaW5kZXhLZXkgPSBpc0dsb2JhbEluZGV4KGluZGV4Tm9kZSlcbiAgICA/IGluZGV4Tm9kZS5ub2RlS2V5KClcbiAgICA6IGdldEluZGV4S2V5X0Jhc2VkT25EZWNlbmRhbnQoXG4gICAgICByZWNvcmRLZXksIGluZGV4Tm9kZSxcbiAgICApO1xuXG4gIGNvbnN0IGl0ZW1zID0gYXdhaXQgbGlzdEl0ZW1zKGFwcCkoaW5kZXhLZXkpO1xuICByZXR1cm4gJChpdGVtcywgW1xuICAgIG1hcChpID0+ICh7XG4gICAgICBrZXk6IGkua2V5LFxuICAgICAgdmFsdWU6IGlbdHlwZU9wdGlvbnMuZGlzcGxheVZhbHVlXSxcbiAgICB9KSksXG4gIF0pO1xufTtcbiIsImltcG9ydCB7XG4gIG1hcCwgcmVkdWNlLCBmaWx0ZXIsXG4gIGlzRW1wdHksIGZsYXR0ZW4sIGVhY2gsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBjb21waWxlRXhwcmVzc2lvbiB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBnZXRFeGFjdE5vZGVGb3JQYXRoIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IHZhbGlkYXRlRmllbGRQYXJzZSwgdmFsaWRhdGVUeXBlQ29uc3RyYWludHMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyAkLCBpc05vdGhpbmcsIGlzTm9uRW1wdHlTdHJpbmcgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgX2dldENvbnRleHQgfSBmcm9tICcuL2dldENvbnRleHQnO1xuXG5jb25zdCBmaWVsZFBhcnNlRXJyb3IgPSAoZmllbGROYW1lLCB2YWx1ZSkgPT4gKHtcbiAgZmllbGRzOiBbZmllbGROYW1lXSxcbiAgbWVzc2FnZTogYENvdWxkIG5vdCBwYXJzZSBmaWVsZCAke2ZpZWxkTmFtZX06JHt2YWx1ZX1gLFxufSk7XG5cbmNvbnN0IHZhbGlkYXRlQWxsRmllbGRQYXJzZSA9IChyZWNvcmQsIHJlY29yZE5vZGUpID0+ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgbWFwKGYgPT4gKHsgbmFtZTogZi5uYW1lLCBwYXJzZVJlc3VsdDogdmFsaWRhdGVGaWVsZFBhcnNlKGYsIHJlY29yZCkgfSkpLFxuICByZWR1Y2UoKGVycm9ycywgZikgPT4ge1xuICAgIGlmIChmLnBhcnNlUmVzdWx0LnN1Y2Nlc3MpIHJldHVybiBlcnJvcnM7XG4gICAgZXJyb3JzLnB1c2goXG4gICAgICBmaWVsZFBhcnNlRXJyb3IoZi5uYW1lLCBmLnBhcnNlUmVzdWx0LnZhbHVlKSxcbiAgICApO1xuICAgIHJldHVybiBlcnJvcnM7XG4gIH0sIFtdKSxcbl0pO1xuXG5jb25zdCB2YWxpZGF0ZUFsbFR5cGVDb25zdHJhaW50cyA9IGFzeW5jIChyZWNvcmQsIHJlY29yZE5vZGUsIGNvbnRleHQpID0+IHtcbiAgY29uc3QgZXJyb3JzID0gW107XG4gIGZvciAoY29uc3QgZmllbGQgb2YgcmVjb3JkTm9kZS5maWVsZHMpIHtcbiAgICAkKGF3YWl0IHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzKGZpZWxkLCByZWNvcmQsIGNvbnRleHQpLCBbXG4gICAgICBmaWx0ZXIoaXNOb25FbXB0eVN0cmluZyksXG4gICAgICBtYXAobSA9PiAoeyBtZXNzYWdlOiBtLCBmaWVsZHM6IFtmaWVsZC5uYW1lXSB9KSksXG4gICAgICBlYWNoKGUgPT4gZXJyb3JzLnB1c2goZSkpLFxuICAgIF0pO1xuICB9XG4gIHJldHVybiBlcnJvcnM7XG59O1xuXG5jb25zdCBydW5SZWNvcmRWYWxpZGF0aW9uUnVsZXMgPSAocmVjb3JkLCByZWNvcmROb2RlKSA9PiB7XG4gIGNvbnN0IHJ1blZhbGlkYXRpb25SdWxlID0gKHJ1bGUpID0+IHtcbiAgICBjb25zdCBpc1ZhbGlkID0gY29tcGlsZUV4cHJlc3Npb24ocnVsZS5leHByZXNzaW9uV2hlblZhbGlkKTtcbiAgICBjb25zdCBleHByZXNzaW9uQ29udGV4dCA9IHsgcmVjb3JkLCBfIH07XG4gICAgcmV0dXJuIChpc1ZhbGlkKGV4cHJlc3Npb25Db250ZXh0KVxuICAgICAgPyB7IHZhbGlkOiB0cnVlIH1cbiAgICAgIDogKHtcbiAgICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgICBmaWVsZHM6IHJ1bGUuaW52YWxpZEZpZWxkcyxcbiAgICAgICAgbWVzc2FnZTogcnVsZS5tZXNzYWdlV2hlbkludmFsaWQsXG4gICAgICB9KSk7XG4gIH07XG5cbiAgcmV0dXJuICQocmVjb3JkTm9kZS52YWxpZGF0aW9uUnVsZXMsIFtcbiAgICBtYXAocnVuVmFsaWRhdGlvblJ1bGUpLFxuICAgIGZsYXR0ZW4sXG4gICAgZmlsdGVyKHIgPT4gci52YWxpZCA9PT0gZmFsc2UpLFxuICAgIG1hcChyID0+ICh7IGZpZWxkczogci5maWVsZHMsIG1lc3NhZ2U6IHIubWVzc2FnZSB9KSksXG4gIF0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlID0gYXBwID0+IGFzeW5jIChyZWNvcmQsIGNvbnRleHQpID0+IHtcbiAgY29udGV4dCA9IGlzTm90aGluZyhjb250ZXh0KVxuICAgID8gX2dldENvbnRleHQoYXBwLCByZWNvcmQua2V5KVxuICAgIDogY29udGV4dDtcblxuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShyZWNvcmQua2V5KTtcbiAgY29uc3QgZmllbGRQYXJzZUZhaWxzID0gdmFsaWRhdGVBbGxGaWVsZFBhcnNlKHJlY29yZCwgcmVjb3JkTm9kZSk7XG5cbiAgLy8gbm9uIHBhcnNpbmcgd291bGQgY2F1c2UgZnVydGhlciBpc3N1ZXMgLSBleGl0IGhlcmVcbiAgaWYgKCFpc0VtcHR5KGZpZWxkUGFyc2VGYWlscykpIHsgcmV0dXJuICh7IGlzVmFsaWQ6IGZhbHNlLCBlcnJvcnM6IGZpZWxkUGFyc2VGYWlscyB9KTsgfVxuXG4gIGNvbnN0IHJlY29yZFZhbGlkYXRpb25SdWxlRmFpbHMgPSBydW5SZWNvcmRWYWxpZGF0aW9uUnVsZXMocmVjb3JkLCByZWNvcmROb2RlKTtcbiAgY29uc3QgdHlwZUNvbnRyYWludEZhaWxzID0gYXdhaXQgdmFsaWRhdGVBbGxUeXBlQ29uc3RyYWludHMocmVjb3JkLCByZWNvcmROb2RlLCBjb250ZXh0KTtcblxuICBpZiAoaXNFbXB0eShmaWVsZFBhcnNlRmFpbHMpXG4gICAgICAgJiYgaXNFbXB0eShyZWNvcmRWYWxpZGF0aW9uUnVsZUZhaWxzKVxuICAgICAgICYmIGlzRW1wdHkodHlwZUNvbnRyYWludEZhaWxzKSkge1xuICAgIHJldHVybiAoeyBpc1ZhbGlkOiB0cnVlLCBlcnJvcnM6IFtdIH0pO1xuICB9XG5cbiAgcmV0dXJuICh7XG4gICAgaXNWYWxpZDogZmFsc2UsXG4gICAgZXJyb3JzOiBfLnVuaW9uKGZpZWxkUGFyc2VGYWlscywgdHlwZUNvbnRyYWludEZhaWxzLCByZWNvcmRWYWxpZGF0aW9uUnVsZUZhaWxzKSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgaXNDb2xsZWN0aW9uUmVjb3JkLFxuICBpc1Jvb3QsXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyAkLCBhbGxUcnVlLCBqb2luS2V5IH0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgZW5zdXJlQ29sbGVjdGlvbklzSW5pdGlhbGlzZWQgPSBhc3luYyAoZGF0YXN0b3JlLCBub2RlLCBwYXJlbnRLZXkpID0+IHtcbiAgaWYgKCFhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKHBhcmVudEtleSkpIHtcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKHBhcmVudEtleSk7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihcbiAgICAgIGpvaW5LZXkocGFyZW50S2V5LCAnYWxsaWRzJyksXG4gICAgKTtcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKFxuICAgICAgam9pbktleShcbiAgICAgICAgcGFyZW50S2V5LFxuICAgICAgICAnYWxsaWRzJyxcbiAgICAgICAgbm9kZS5ub2RlSWQudG9TdHJpbmcoKSxcbiAgICAgICksXG4gICAgKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxpc2VSb290Q29sbGVjdGlvbnMgPSBhc3luYyAoZGF0YXN0b3JlLCBoaWVyYXJjaHkpID0+IHtcbiAgY29uc3Qgcm9vdENvbGxlY3Rpb25SZWNvcmQgPSBhbGxUcnVlKFxuICAgIG4gPT4gaXNSb290KG4ucGFyZW50KCkpLFxuICAgIGlzQ29sbGVjdGlvblJlY29yZCxcbiAgKTtcblxuICBjb25zdCBmbGF0aGllcmFyY2h5ID0gZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGhpZXJhcmNoeSk7XG5cbiAgY29uc3QgY29sbGVjdGlvblJlY29yZHMgPSAkKGZsYXRoaWVyYXJjaHksIFtcbiAgICBmaWx0ZXIocm9vdENvbGxlY3Rpb25SZWNvcmQpLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IGNvbCBvZiBjb2xsZWN0aW9uUmVjb3Jkcykge1xuICAgIGF3YWl0IGVuc3VyZUNvbGxlY3Rpb25Jc0luaXRpYWxpc2VkKFxuICAgICAgZGF0YXN0b3JlLFxuICAgICAgY29sLFxuICAgICAgY29sLmNvbGxlY3Rpb25QYXRoUmVneCgpLFxuICAgICk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlQ2hpbGRDb2xsZWN0aW9ucyA9IGFzeW5jIChhcHAsIHJlY29yZEtleSkgPT4ge1xuICBjb25zdCBjaGlsZENvbGxlY3Rpb25SZWNvcmRzID0gJChyZWNvcmRLZXksIFtcbiAgICBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpLFxuICAgIG4gPT4gbi5jaGlsZHJlbixcbiAgICBmaWx0ZXIoaXNDb2xsZWN0aW9uUmVjb3JkKSxcbiAgXSk7XG5cbiAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZENvbGxlY3Rpb25SZWNvcmRzKSB7XG4gICAgYXdhaXQgZW5zdXJlQ29sbGVjdGlvbklzSW5pdGlhbGlzZWQoXG4gICAgICBhcHAuZGF0YXN0b3JlLFxuICAgICAgY2hpbGQsXG4gICAgICBqb2luS2V5KHJlY29yZEtleSwgY2hpbGQuY29sbGVjdGlvbk5hbWUpLFxuICAgICk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBqb2luLCBwdWxsLFxuICBtYXAsIGZsYXR0ZW4sIG9yZGVyQnksXG4gIGZpbHRlciwgZmluZCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIGdldFBhcmVudEtleSxcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5LCBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgsXG4gIGlzQ29sbGVjdGlvblJlY29yZCwgaXNBbmNlc3Rvcixcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IGpvaW5LZXksIHNhZmVLZXksICQgfSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBhbGxJZENoYXJzID0gJzAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXy0nO1xuXG5jb25zdCBhbGxJZHNTdHJpbmdzRm9yRmFjdG9yID0gKGNvbGxlY3Rpb25Ob2RlKSA9PiB7XG4gIGNvbnN0IGZhY3RvciA9IGNvbGxlY3Rpb25Ob2RlLmFsbGlkc1NoYXJkRmFjdG9yO1xuICBjb25zdCBjaGFyUmFuZ2VQZXJTaGFyZCA9IDY0IC8gZmFjdG9yO1xuICBjb25zdCBhbGxJZFN0cmluZ3MgPSBbXTtcbiAgbGV0IGluZGV4ID0gMDtcbiAgbGV0IGN1cnJlbnRJZHNTaGFyZCA9ICcnO1xuICB3aGlsZSAoaW5kZXggPCA2NCkge1xuICAgIGN1cnJlbnRJZHNTaGFyZCArPSBhbGxJZENoYXJzW2luZGV4XTtcbiAgICBpZiAoKGluZGV4ICsgMSkgJSBjaGFyUmFuZ2VQZXJTaGFyZCA9PT0gMCkge1xuICAgICAgYWxsSWRTdHJpbmdzLnB1c2goY3VycmVudElkc1NoYXJkKTtcbiAgICAgIGN1cnJlbnRJZHNTaGFyZCA9ICcnO1xuICAgIH1cbiAgICBpbmRleCsrO1xuICB9XG5cbiAgcmV0dXJuIGFsbElkU3RyaW5ncztcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRBbGxJZHNTaGFyZE5hbWVzID0gKGFwcEhpZXJhcmNoeSwgY29sbGVjdGlvbktleSkgPT4ge1xuICBjb25zdCBjb2xsZWN0aW9uUmVjb3JkTm9kZSA9IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHBIaWVyYXJjaHkpKGNvbGxlY3Rpb25LZXkpO1xuICByZXR1cm4gJChjb2xsZWN0aW9uUmVjb3JkTm9kZSwgW1xuICAgIGMgPT4gW2Mubm9kZUlkXSxcbiAgICBtYXAoaSA9PiBtYXAoYyA9PiBfYWxsSWRzU2hhcmRLZXkoY29sbGVjdGlvbktleSwgaSwgYykpKGFsbElkc1N0cmluZ3NGb3JGYWN0b3IoY29sbGVjdGlvblJlY29yZE5vZGUpKSksXG4gICAgZmxhdHRlbixcbiAgXSk7XG59O1xuXG5jb25zdCBfYWxsSWRzU2hhcmRLZXkgPSAoY29sbGVjdGlvbktleSwgY2hpbGRObywgc2hhcmRLZXkpID0+IGpvaW5LZXkoXG4gIGNvbGxlY3Rpb25LZXksXG4gICdhbGxpZHMnLFxuICBjaGlsZE5vLFxuICBzaGFyZEtleSxcbik7XG5cbmV4cG9ydCBjb25zdCBnZXRBbGxJZHNTaGFyZEtleSA9IChhcHBIaWVyYXJjaHksIGNvbGxlY3Rpb25LZXksIHJlY29yZElkKSA9PiB7XG4gIGNvbnN0IGluZGV4T2ZGaXJzdERhc2ggPSByZWNvcmRJZC5pbmRleE9mKCctJyk7XG5cbiAgY29uc3QgY29sbGVjdGlvbk5vZGUgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwSGllcmFyY2h5KShjb2xsZWN0aW9uS2V5KTtcblxuICBjb25zdCBpZEZpcnN0Q2hhciA9IHJlY29yZElkW2luZGV4T2ZGaXJzdERhc2ggKyAxXTtcbiAgY29uc3QgYWxsSWRzU2hhcmRJZCA9ICQoY29sbGVjdGlvbk5vZGUsIFtcbiAgICBhbGxJZHNTdHJpbmdzRm9yRmFjdG9yLFxuICAgIGZpbmQoaSA9PiBpLmluY2x1ZGVzKGlkRmlyc3RDaGFyKSksXG4gIF0pO1xuXG4gIHJldHVybiBfYWxsSWRzU2hhcmRLZXkoXG4gICAgY29sbGVjdGlvbktleSxcbiAgICByZWNvcmRJZC5zbGljZSgwLCBpbmRleE9mRmlyc3REYXNoKSxcbiAgICBhbGxJZHNTaGFyZElkLFxuICApO1xufTtcblxuY29uc3QgZ2V0T3JDcmVhdGVTaGFyZEZpbGUgPSBhc3luYyAoZGF0YXN0b3JlLCBhbGxJZHNLZXkpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgZGF0YXN0b3JlLmxvYWRGaWxlKGFsbElkc0tleSk7XG4gIH0gY2F0Y2ggKGVMb2FkKSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGaWxlKGFsbElkc0tleSwgJycpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH0gY2F0Y2ggKGVDcmVhdGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEVycm9yIGxvYWRpbmcsIHRoZW4gY3JlYXRpbmcgYWxsSWRzICR7YWxsSWRzS2V5XG4gICAgICAgIH0gOiBMT0FEIDogJHtlTG9hZC5tZXNzYWdlXG4gICAgICAgIH0gOiBDUkVBVEUgOiAke2VDcmVhdGV9YCxcbiAgICAgICk7XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCBnZXRTaGFyZEZpbGUgPSBhc3luYyAoZGF0YXN0b3JlLCBhbGxJZHNLZXkpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgZGF0YXN0b3JlLmxvYWRGaWxlKGFsbElkc0tleSk7XG4gIH0gY2F0Y2ggKGVMb2FkKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgYWRkVG9BbGxJZHMgPSAoYXBwSGllcmFyY2h5LCBkYXRhc3RvcmUpID0+IGFzeW5jIChyZWNvcmQpID0+IHtcbiAgY29uc3QgYWxsSWRzS2V5ID0gZ2V0QWxsSWRzU2hhcmRLZXkoXG4gICAgYXBwSGllcmFyY2h5LFxuICAgIGdldFBhcmVudEtleShyZWNvcmQua2V5KSxcbiAgICByZWNvcmQuaWQsXG4gICk7XG5cbiAgbGV0IGFsbElkcyA9IGF3YWl0IGdldE9yQ3JlYXRlU2hhcmRGaWxlKGRhdGFzdG9yZSwgYWxsSWRzS2V5KTtcblxuICBhbGxJZHMgKz0gYCR7YWxsSWRzLmxlbmd0aCA+IDAgPyAnLCcgOiAnJ30ke3JlY29yZC5pZH1gO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS51cGRhdGVGaWxlKGFsbElkc0tleSwgYWxsSWRzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRBbGxJZHNJdGVyYXRvciA9IGFwcCA9PiBhc3luYyAoY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSkgPT4ge1xuICBjb2xsZWN0aW9uX0tleV9vcl9Ob2RlS2V5ID0gc2FmZUtleShjb2xsZWN0aW9uX0tleV9vcl9Ob2RlS2V5KTtcbiAgY29uc3QgdGFyZ2V0Tm9kZSA9IGdldENvbGxlY3Rpb25Ob2RlQnlLZXlPck5vZGVLZXkoXG4gICAgYXBwLmhpZXJhcmNoeSxcbiAgICBjb2xsZWN0aW9uX0tleV9vcl9Ob2RlS2V5LFxuICApO1xuXG4gIGNvbnN0IGdldEFsbElkc0l0ZXJhdG9yRm9yQ29sbGVjdGlvbktleSA9IGFzeW5jIChjb2xsZWN0aW9uS2V5KSA9PiB7XG4gICAgY29uc3QgYWxsX2FsbElkc0tleXMgPSBnZXRBbGxJZHNTaGFyZE5hbWVzKGFwcC5oaWVyYXJjaHksIGNvbGxlY3Rpb25LZXkpO1xuICAgIGxldCBzaGFyZEluZGV4ID0gMDtcblxuICAgIGNvbnN0IGFsbElkc0Zyb21TaGFyZEl0ZXJhdG9yID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKHNoYXJkSW5kZXggPT09IGFsbF9hbGxJZHNLZXlzLmxlbmd0aCkgeyByZXR1cm4gKHsgZG9uZTogdHJ1ZSwgcmVzdWx0OiB7IGlkczogW10sIGNvbGxlY3Rpb25LZXkgfSB9KTsgfVxuXG4gICAgICBjb25zdCBzaGFyZEtleSA9IGFsbF9hbGxJZHNLZXlzW3NoYXJkSW5kZXhdO1xuXG4gICAgICBjb25zdCBhbGxJZHMgPSBhd2FpdCBnZXRBbGxJZHNGcm9tU2hhcmQoYXBwLmRhdGFzdG9yZSwgc2hhcmRLZXkpO1xuXG4gICAgICBzaGFyZEluZGV4Kys7XG5cbiAgICAgIHJldHVybiAoe1xuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICBpZHM6IGFsbElkcyxcbiAgICAgICAgICBjb2xsZWN0aW9uS2V5LFxuICAgICAgICB9LFxuICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gYWxsSWRzRnJvbVNoYXJkSXRlcmF0b3I7XG4gIH07XG5cbiAgY29uc3QgYW5jZXN0b3JzID0gJChnZXRGbGF0dGVuZWRIaWVyYXJjaHkoYXBwLmhpZXJhcmNoeSksIFtcbiAgICBmaWx0ZXIoaXNDb2xsZWN0aW9uUmVjb3JkKSxcbiAgICBmaWx0ZXIobiA9PiBpc0FuY2VzdG9yKHRhcmdldE5vZGUpKG4pXG4gICAgICAgICAgICAgICAgICAgIHx8IG4ubm9kZUtleSgpID09PSB0YXJnZXROb2RlLm5vZGVLZXkoKSksXG4gICAgb3JkZXJCeShbbiA9PiBuLm5vZGVLZXkoKS5sZW5ndGhdLCBbJ2FzYyddKSxcbiAgXSk7IC8vIHBhcmVudHMgZmlyc3RcblxuICBjb25zdCB0cmF2ZXJzZUZvckl0ZXJhdGVyYXRvcnMgPSBhc3luYyAocGFyZW50UmVjb3JkS2V5ID0gJycsIGN1cnJlbnROb2RlSW5kZXggPSAwKSA9PiB7XG4gICAgY29uc3QgY3VycmVudE5vZGUgPSBhbmNlc3RvcnNbY3VycmVudE5vZGVJbmRleF07XG4gICAgY29uc3QgY3VycmVudENvbGxlY3Rpb25LZXkgPSBqb2luS2V5KFxuICAgICAgcGFyZW50UmVjb3JkS2V5LFxuICAgICAgY3VycmVudE5vZGUuY29sbGVjdGlvbk5hbWUsXG4gICAgKTtcbiAgICBpZiAoY3VycmVudE5vZGUubm9kZUtleSgpID09PSB0YXJnZXROb2RlLm5vZGVLZXkoKSkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgYXdhaXQgZ2V0QWxsSWRzSXRlcmF0b3JGb3JDb2xsZWN0aW9uS2V5KFxuICAgICAgICAgIGN1cnJlbnRDb2xsZWN0aW9uS2V5LFxuICAgICAgICApXTtcbiAgICB9XG4gICAgY29uc3QgYWxsSXRlcmF0b3JzID0gW107XG4gICAgY29uc3QgY3VycmVudEl0ZXJhdG9yID0gYXdhaXQgZ2V0QWxsSWRzSXRlcmF0b3JGb3JDb2xsZWN0aW9uS2V5KFxuICAgICAgY3VycmVudENvbGxlY3Rpb25LZXksXG4gICAgKTtcblxuICAgIGxldCBpZHMgPSBhd2FpdCBjdXJyZW50SXRlcmF0b3IoKTtcbiAgICB3aGlsZSAoaWRzLmRvbmUgPT09IGZhbHNlKSB7XG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIGlkcy5yZXN1bHQuaWRzKSB7XG4gICAgICAgIGFsbEl0ZXJhdG9ycy5wdXNoKFxuICAgICAgICAgIGF3YWl0IHRyYXZlcnNlRm9ySXRlcmF0ZXJhdG9ycyhcbiAgICAgICAgICAgIGpvaW5LZXkoY3VycmVudENvbGxlY3Rpb25LZXksIGlkKSxcbiAgICAgICAgICAgIGN1cnJlbnROb2RlSW5kZXggKyAxLFxuICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlkcyA9IGF3YWl0IGN1cnJlbnRJdGVyYXRvcigpO1xuICAgIH1cblxuICAgIHJldHVybiBmbGF0dGVuKGFsbEl0ZXJhdG9ycyk7XG4gIH07XG5cbiAgY29uc3QgaXRlcmF0b3JzQXJyYXkgPSBhd2FpdCB0cmF2ZXJzZUZvckl0ZXJhdGVyYXRvcnMoKTtcbiAgbGV0IGN1cnJlbnRJdGVyYXRvckluZGV4ID0gMDtcbiAgcmV0dXJuIGFzeW5jICgpID0+IHtcbiAgICBpZiAoaXRlcmF0b3JzQXJyYXkubGVuZ3RoID09PSAwKSB7IHJldHVybiB7IGRvbmU6IHRydWUsIHJlc3VsdDogW10gfTsgfVxuICAgIGNvbnN0IGlubmVyUmVzdWx0ID0gYXdhaXQgaXRlcmF0b3JzQXJyYXlbY3VycmVudEl0ZXJhdG9ySW5kZXhdKCk7XG4gICAgaWYgKCFpbm5lclJlc3VsdC5kb25lKSB7IHJldHVybiBpbm5lclJlc3VsdDsgfVxuICAgIGlmIChjdXJyZW50SXRlcmF0b3JJbmRleCA9PSBpdGVyYXRvcnNBcnJheS5sZW5ndGggLSAxKSB7XG4gICAgICByZXR1cm4geyBkb25lOiB0cnVlLCByZXN1bHQ6IGlubmVyUmVzdWx0LnJlc3VsdCB9O1xuICAgIH1cbiAgICBjdXJyZW50SXRlcmF0b3JJbmRleCsrO1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCByZXN1bHQ6IGlubmVyUmVzdWx0LnJlc3VsdCB9O1xuICB9O1xufTtcblxuY29uc3QgZ2V0QWxsSWRzRnJvbVNoYXJkID0gYXN5bmMgKGRhdGFzdG9yZSwgc2hhcmRLZXkpID0+IHtcbiAgY29uc3QgYWxsSWRzU3RyID0gYXdhaXQgZ2V0U2hhcmRGaWxlKGRhdGFzdG9yZSwgc2hhcmRLZXkpO1xuXG4gIGNvbnN0IGFsbElkcyA9IFtdO1xuICBsZXQgY3VycmVudElkID0gJyc7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsSWRzU3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY3VycmVudENoYXIgPSBhbGxJZHNTdHIuY2hhckF0KGkpO1xuICAgIGNvbnN0IGlzTGFzdCA9IChpID09PSBhbGxJZHNTdHIubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGN1cnJlbnRDaGFyID09PSAnLCcgfHwgaXNMYXN0KSB7XG4gICAgICBpZiAoaXNMYXN0KSBjdXJyZW50SWQgKz0gY3VycmVudENoYXI7XG4gICAgICBhbGxJZHMucHVzaChjdXJyZW50SWQpO1xuICAgICAgY3VycmVudElkID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnRJZCArPSBjdXJyZW50Q2hhcjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFsbElkcztcbn07XG5cbmV4cG9ydCBjb25zdCByZW1vdmVGcm9tQWxsSWRzID0gKGFwcEhpZXJhcmNoeSwgZGF0YXN0b3JlKSA9PiBhc3luYyAocmVjb3JkKSA9PiB7XG4gIGNvbnN0IHNoYXJkS2V5ID0gZ2V0QWxsSWRzU2hhcmRLZXkoXG4gICAgYXBwSGllcmFyY2h5LFxuICAgIGdldFBhcmVudEtleShyZWNvcmQua2V5KSxcbiAgICByZWNvcmQuaWQsXG4gICk7XG4gIGNvbnN0IGFsbElkcyA9IGF3YWl0IGdldEFsbElkc0Zyb21TaGFyZChkYXRhc3RvcmUsIHNoYXJkS2V5KTtcblxuICBjb25zdCBuZXdJZHMgPSAkKGFsbElkcywgW1xuICAgIHB1bGwocmVjb3JkLmlkKSxcbiAgICBqb2luKCcsJyksXG4gIF0pO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS51cGRhdGVGaWxlKHNoYXJkS2V5LCBuZXdJZHMpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0QWxsSWRzSXRlcmF0b3I7XG4iLCJpbXBvcnQge1xuICBqb2luS2V5LCBrZXlTZXAsIGdldEhhc2hDb2RlLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0TGFzdFBhcnRJbktleSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5cbmV4cG9ydCBjb25zdCBUUkFOU0FDVElPTlNfRk9MREVSID0gYCR7a2V5U2VwfS50cmFuc2FjdGlvbnNgO1xuZXhwb3J0IGNvbnN0IExPQ0tfRklMRU5BTUUgPSAnbG9jayc7XG5leHBvcnQgY29uc3QgTE9DS19GSUxFX0tFWSA9IGpvaW5LZXkoXG4gIFRSQU5TQUNUSU9OU19GT0xERVIsIExPQ0tfRklMRU5BTUUsXG4pO1xuZXhwb3J0IGNvbnN0IGlkU2VwID0gJyQnO1xuXG5jb25zdCBpc09mVHlwZSA9IHR5cCA9PiB0cmFucyA9PiB0cmFucy50cmFuc2FjdGlvblR5cGUgPT09IHR5cDtcblxuZXhwb3J0IGNvbnN0IENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04gPSAnY3JlYXRlJztcbmV4cG9ydCBjb25zdCBVUERBVEVfUkVDT1JEX1RSQU5TQUNUSU9OID0gJ3VwZGF0ZSc7XG5leHBvcnQgY29uc3QgREVMRVRFX1JFQ09SRF9UUkFOU0FDVElPTiA9ICdkZWxldGUnO1xuZXhwb3J0IGNvbnN0IEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OID0gJ2J1aWxkJztcblxuZXhwb3J0IGNvbnN0IGlzVXBkYXRlID0gaXNPZlR5cGUoVVBEQVRFX1JFQ09SRF9UUkFOU0FDVElPTik7XG5leHBvcnQgY29uc3QgaXNEZWxldGUgPSBpc09mVHlwZShERUxFVEVfUkVDT1JEX1RSQU5TQUNUSU9OKTtcbmV4cG9ydCBjb25zdCBpc0NyZWF0ZSA9IGlzT2ZUeXBlKENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04pO1xuZXhwb3J0IGNvbnN0IGlzQnVpbGRJbmRleCA9IGlzT2ZUeXBlKEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OKTtcblxuZXhwb3J0IGNvbnN0IGtleVRvRm9sZGVyTmFtZSA9IG5vZGVLZXkgPT4gZ2V0SGFzaENvZGUobm9kZUtleSk7XG5cbmV4cG9ydCBjb25zdCBnZXRUcmFuc2FjdGlvbklkID0gKHJlY29yZElkLCB0cmFuc2FjdGlvblR5cGUsIHVuaXF1ZUlkKSA9PiBcbiAgYCR7cmVjb3JkSWR9JHtpZFNlcH0ke3RyYW5zYWN0aW9uVHlwZX0ke2lkU2VwfSR7dW5pcXVlSWR9YDtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkSW5kZXhGb2xkZXIgPSAnLkJVSUxELSc7XG5leHBvcnQgY29uc3Qgbm9kZUtleUhhc2hGcm9tQnVpbGRGb2xkZXIgPSBmb2xkZXIgPT4gZm9sZGVyLnJlcGxhY2UoYnVpbGRJbmRleEZvbGRlciwgJycpO1xuXG5leHBvcnQgY29uc3QgaXNCdWlsZEluZGV4Rm9sZGVyID0ga2V5ID0+IGdldExhc3RQYXJ0SW5LZXkoa2V5KS5zdGFydHNXaXRoKGJ1aWxkSW5kZXhGb2xkZXIpO1xuXG5leHBvcnQgY29uc3QgSW5kZXhOb2RlS2V5Rm9sZGVyID0gaW5kZXhOb2RlS2V5ID0+IGpvaW5LZXkoXG4gIFRSQU5TQUNUSU9OU19GT0xERVIsXG4gIGJ1aWxkSW5kZXhGb2xkZXIgKyBrZXlUb0ZvbGRlck5hbWUoaW5kZXhOb2RlS2V5KSxcbik7XG5cbmV4cG9ydCBjb25zdCBJbmRleE5vZGVLZXlCYXRjaEZvbGRlciA9IChpbmRleE5vZGVLZXksIGNvdW50KSA9PiBcbiAgam9pbktleShJbmRleE5vZGVLZXlGb2xkZXIoaW5kZXhOb2RlS2V5KSwgTWF0aC5mbG9vcihjb3VudCAvIEJVSUxESU5ERVhfQkFUQ0hfQ09VTlQpLnRvU3RyaW5nKCkpO1xuXG5leHBvcnQgY29uc3QgSW5kZXhTaGFyZEtleUZvbGRlciA9IChpbmRleE5vZGVLZXksIGluZGV4U2hhcmRLZXkpID0+IFxuICBqb2luS2V5KEluZGV4Tm9kZUtleUZvbGRlcihpbmRleE5vZGVLZXkpLCBpbmRleFNoYXJkS2V5KTtcblxuZXhwb3J0IGNvbnN0IEJVSUxESU5ERVhfQkFUQ0hfQ09VTlQgPSAxMDAwO1xuZXhwb3J0IGNvbnN0IHRpbWVvdXRNaWxsaXNlY29uZHMgPSAzMCAqIDEwMDA7IC8vIDMwIHNlY3NcbmV4cG9ydCBjb25zdCBtYXhMb2NrUmV0cmllcyA9IDE7XG4iLCJpbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHsgam9pbktleSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXRMYXN0UGFydEluS2V5IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7XG4gIEluZGV4Tm9kZUtleUZvbGRlciwgQlVJTERJTkRFWF9CQVRDSF9DT1VOVCxcbiAgSW5kZXhOb2RlS2V5QmF0Y2hGb2xkZXIsIFRSQU5TQUNUSU9OU19GT0xERVIsIGdldFRyYW5zYWN0aW9uSWQsIENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04sIFVQREFURV9SRUNPUkRfVFJBTlNBQ1RJT04sXG4gIERFTEVURV9SRUNPUkRfVFJBTlNBQ1RJT04sIEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OLFxufSBmcm9tICcuL3RyYW5zYWN0aW9uc0NvbW1vbic7XG5cblxuZXhwb3J0IGNvbnN0IHRyYW5zYWN0aW9uRm9yQ3JlYXRlUmVjb3JkID0gYXN5bmMgKGFwcCwgcmVjb3JkKSA9PiBhd2FpdCB0cmFuc2FjdGlvbihcbiAgYXBwLmRhdGFzdG9yZSwgQ1JFQVRFX1JFQ09SRF9UUkFOU0FDVElPTixcbiAgcmVjb3JkLmtleSwgeyByZWNvcmQgfSxcbiAgZ2V0VHJhbnNhY3Rpb25LZXlfUmVjb3Jkcyxcbik7XG5cbmV4cG9ydCBjb25zdCB0cmFuc2FjdGlvbkZvclVwZGF0ZVJlY29yZCA9IGFzeW5jIChhcHAsIG9sZFJlY29yZCwgbmV3UmVjb3JkKSA9PiBhd2FpdCB0cmFuc2FjdGlvbihcbiAgYXBwLmRhdGFzdG9yZSwgVVBEQVRFX1JFQ09SRF9UUkFOU0FDVElPTixcbiAgbmV3UmVjb3JkLmtleSwgeyBvbGRSZWNvcmQsIHJlY29yZDogbmV3UmVjb3JkIH0sXG4gIGdldFRyYW5zYWN0aW9uS2V5X1JlY29yZHMsXG4pO1xuXG5leHBvcnQgY29uc3QgdHJhbnNhY3Rpb25Gb3JEZWxldGVSZWNvcmQgPSBhc3luYyAoYXBwLCByZWNvcmQpID0+IGF3YWl0IHRyYW5zYWN0aW9uKFxuICBhcHAuZGF0YXN0b3JlLCBERUxFVEVfUkVDT1JEX1RSQU5TQUNUSU9OLFxuICByZWNvcmQua2V5LCB7IHJlY29yZCB9LFxuICBnZXRUcmFuc2FjdGlvbktleV9SZWNvcmRzLFxuKTtcblxuZXhwb3J0IGNvbnN0IHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleCA9IGFzeW5jIChhcHAsIGluZGV4Tm9kZUtleSwgcmVjb3JkS2V5LCBjb3VudCkgPT4ge1xuICBjb25zdCB0cmFuc2FjdGlvbkZvbGRlciA9IEluZGV4Tm9kZUtleUJhdGNoRm9sZGVyKGluZGV4Tm9kZUtleSwgY291bnQpO1xuICBpZiAoY291bnQgJSBCVUlMRElOREVYX0JBVENIX0NPVU5UID09PSAwKSB7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVGb2xkZXIodHJhbnNhY3Rpb25Gb2xkZXIpO1xuICB9XG5cbiAgcmV0dXJuIGF3YWl0IHRyYW5zYWN0aW9uKFxuICAgIGFwcC5kYXRhc3RvcmUsIEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OLFxuICAgIHJlY29yZEtleSwgeyByZWNvcmRLZXkgfSxcbiAgICBpZCA9PiBqb2luS2V5KHRyYW5zYWN0aW9uRm9sZGVyLCBpZCksXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlQnVpbGRJbmRleEZvbGRlciA9IGFzeW5jIChkYXRhc3RvcmUsIGluZGV4Tm9kZUtleSkgPT4gYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihcbiAgSW5kZXhOb2RlS2V5Rm9sZGVyKGluZGV4Tm9kZUtleSksXG4pO1xuXG5jb25zdCBnZXRUcmFuc2FjdGlvbktleV9SZWNvcmRzID0gaWQgPT4gam9pbktleShUUkFOU0FDVElPTlNfRk9MREVSLCBpZCk7XG5cbmNvbnN0IHRyYW5zYWN0aW9uID0gYXN5bmMgKGRhdGFzdG9yZSwgdHJhbnNhY3Rpb25UeXBlLCByZWNvcmRLZXksIGRhdGEsIGdldFRyYW5zYWN0aW9uS2V5KSA9PiB7XG4gIGNvbnN0IHJlY29yZElkID0gZ2V0TGFzdFBhcnRJbktleShyZWNvcmRLZXkpO1xuICBjb25zdCB1bmlxdWVJZCA9IGdlbmVyYXRlKCk7XG4gIGNvbnN0IGlkID0gZ2V0VHJhbnNhY3Rpb25JZChcbiAgICByZWNvcmRJZCwgdHJhbnNhY3Rpb25UeXBlLCB1bmlxdWVJZCxcbiAgKTtcblxuICBjb25zdCBrZXkgPSBnZXRUcmFuc2FjdGlvbktleShpZCk7XG5cbiAgY29uc3QgdHJhbnMgPSB7XG4gICAgdHJhbnNhY3Rpb25UeXBlLFxuICAgIHJlY29yZEtleSxcbiAgICAuLi5kYXRhLFxuICAgIGlkLFxuICB9O1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKFxuICAgIGtleSwgdHJhbnMsXG4gICk7XG5cbiAgcmV0dXJuIHRyYW5zO1xufTtcbiIsImltcG9ydCB7IGlzU2hhcmRlZEluZGV4IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IGpvaW5LZXkgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0U2hhcmRNYXBLZXksIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSwgY3JlYXRlSW5kZXhGaWxlIH0gZnJvbSAnLi9zaGFyZGluZyc7XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlSW5kZXggPSBhc3luYyAoZGF0YXN0b3JlLCBwYXJlbnRLZXksIGluZGV4KSA9PiB7XG4gIGNvbnN0IGluZGV4S2V5ID0gam9pbktleShwYXJlbnRLZXksIGluZGV4Lm5hbWUpO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoaW5kZXhLZXkpO1xuXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleCkpIHtcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRmlsZShcbiAgICAgIGdldFNoYXJkTWFwS2V5KGluZGV4S2V5KSxcbiAgICAgICdbXScsXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCBjcmVhdGVJbmRleEZpbGUoXG4gICAgICBkYXRhc3RvcmUsXG4gICAgICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXkoaW5kZXhLZXkpLFxuICAgICAgaW5kZXgsXG4gICAgKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIGNsb25lRGVlcCxcbiAgZmxhdHRlbixcbiAgbWFwLFxuICBmaWx0ZXIsXG4gIGlzRXF1YWxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGluaXRpYWxpc2VDaGlsZENvbGxlY3Rpb25zIH0gZnJvbSAnLi4vY29sbGVjdGlvbkFwaS9pbml0aWFsaXNlJztcbmltcG9ydCB7IHZhbGlkYXRlIH0gZnJvbSAnLi92YWxpZGF0ZSc7XG5pbXBvcnQgeyBfbG9hZCwgZ2V0UmVjb3JkRmlsZU5hbWUgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IHtcbiAgYXBpV3JhcHBlciwgZXZlbnRzLCAkLCBqb2luS2V5LFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LCBnZXRFeGFjdE5vZGVGb3JQYXRoLFxuICBpc1JlY29yZCwgZ2V0Tm9kZSwgaXNTaW5nbGVSZWNvcmQsXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBhZGRUb0FsbElkcyB9IGZyb20gJy4uL2luZGV4aW5nL2FsbElkcyc7XG5pbXBvcnQge1xuICB0cmFuc2FjdGlvbkZvckNyZWF0ZVJlY29yZCxcbiAgdHJhbnNhY3Rpb25Gb3JVcGRhdGVSZWNvcmQsXG59IGZyb20gJy4uL3RyYW5zYWN0aW9ucy9jcmVhdGUnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgaW5pdGlhbGlzZUluZGV4IH0gZnJvbSAnLi4vaW5kZXhpbmcvaW5pdGlhbGlzZUluZGV4JztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3Qgc2F2ZSA9IGFwcCA9PiBhc3luYyAocmVjb3JkLCBjb250ZXh0KSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5yZWNvcmRBcGkuc2F2ZSxcbiAgcmVjb3JkLmlzTmV3XG4gICAgPyBwZXJtaXNzaW9uLmNyZWF0ZVJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkLmtleSlcbiAgICA6IHBlcm1pc3Npb24udXBkYXRlUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmQua2V5KSwgeyByZWNvcmQgfSxcbiAgX3NhdmUsIGFwcCwgcmVjb3JkLCBjb250ZXh0LCBmYWxzZSxcbik7XG5cblxuZXhwb3J0IGNvbnN0IF9zYXZlID0gYXN5bmMgKGFwcCwgcmVjb3JkLCBjb250ZXh0LCBza2lwVmFsaWRhdGlvbiA9IGZhbHNlKSA9PiB7XG4gIGNvbnN0IHJlY29yZENsb25lID0gY2xvbmVEZWVwKHJlY29yZCk7XG4gIGlmICghc2tpcFZhbGlkYXRpb24pIHtcbiAgICBjb25zdCB2YWxpZGF0aW9uUmVzdWx0ID0gYXdhaXQgdmFsaWRhdGUoYXBwKShyZWNvcmRDbG9uZSwgY29udGV4dCk7XG4gICAgaWYgKCF2YWxpZGF0aW9uUmVzdWx0LmlzVmFsaWQpIHtcbiAgICAgIGF3YWl0IGFwcC5wdWJsaXNoKGV2ZW50cy5yZWNvcmRBcGkuc2F2ZS5vbkludmFsaWQsIHsgcmVjb3JkLCB2YWxpZGF0aW9uUmVzdWx0IH0pO1xuICAgICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgU2F2ZSA6IFJlY29yZCBJbnZhbGlkIDogJHtcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkodmFsaWRhdGlvblJlc3VsdC5lcnJvcnMpfWApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChyZWNvcmRDbG9uZS5pc05ldykge1xuICAgIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKHJlY29yZC5rZXkpO1xuICAgIGlmKCFyZWNvcmROb2RlKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbm9kZSBmb3IgXCIgKyByZWNvcmQua2V5KTtcblxuICAgIGlmKCFpc1NpbmdsZVJlY29yZChyZWNvcmROb2RlKSlcbiAgICAgIGF3YWl0IGFkZFRvQWxsSWRzKGFwcC5oaWVyYXJjaHksIGFwcC5kYXRhc3RvcmUpKHJlY29yZENsb25lKTtcbiAgICAgIFxuICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gYXdhaXQgdHJhbnNhY3Rpb25Gb3JDcmVhdGVSZWNvcmQoXG4gICAgICBhcHAsIHJlY29yZENsb25lLFxuICAgICk7XG4gICAgcmVjb3JkQ2xvbmUudHJhbnNhY3Rpb25JZCA9IHRyYW5zYWN0aW9uLmlkO1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlRm9sZGVyKHJlY29yZENsb25lLmtleSk7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoXG4gICAgICBqb2luS2V5KHJlY29yZENsb25lLmtleSwgJ2ZpbGVzJyksXG4gICAgKTtcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmNyZWF0ZUpzb24oXG4gICAgICBnZXRSZWNvcmRGaWxlTmFtZShyZWNvcmRDbG9uZS5rZXkpLFxuICAgICAgcmVjb3JkQ2xvbmUsXG4gICAgKTtcbiAgICBhd2FpdCBpbml0aWFsaXNlUmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMoYXBwLCByZWNvcmQpO1xuICAgIGF3YWl0IGluaXRpYWxpc2VBbmNlc3RvckluZGV4ZXMoYXBwLCByZWNvcmQpO1xuICAgIGF3YWl0IGluaXRpYWxpc2VDaGlsZENvbGxlY3Rpb25zKGFwcCwgcmVjb3JkQ2xvbmUua2V5KTtcbiAgICBhd2FpdCBhcHAucHVibGlzaChldmVudHMucmVjb3JkQXBpLnNhdmUub25SZWNvcmRDcmVhdGVkLCB7XG4gICAgICByZWNvcmQ6IHJlY29yZENsb25lLFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG9sZFJlY29yZCA9IGF3YWl0IF9sb2FkKGFwcCwgcmVjb3JkQ2xvbmUua2V5KTtcbiAgICBjb25zdCB0cmFuc2FjdGlvbiA9IGF3YWl0IHRyYW5zYWN0aW9uRm9yVXBkYXRlUmVjb3JkKFxuICAgICAgYXBwLCBvbGRSZWNvcmQsIHJlY29yZENsb25lLFxuICAgICk7XG4gICAgcmVjb3JkQ2xvbmUudHJhbnNhY3Rpb25JZCA9IHRyYW5zYWN0aW9uLmlkO1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgICAgIGdldFJlY29yZEZpbGVOYW1lKHJlY29yZENsb25lLmtleSksXG4gICAgICByZWNvcmRDbG9uZSxcbiAgICApO1xuICAgIGF3YWl0IGFwcC5wdWJsaXNoKGV2ZW50cy5yZWNvcmRBcGkuc2F2ZS5vblJlY29yZFVwZGF0ZWQsIHtcbiAgICAgIG9sZDogb2xkUmVjb3JkLFxuICAgICAgbmV3OiByZWNvcmRDbG9uZSxcbiAgICB9KTtcbiAgfVxuXG4gIGF3YWl0IGFwcC5jbGVhbnVwVHJhbnNhY3Rpb25zKCk7XG5cbiAgY29uc3QgcmV0dXJuZWRDbG9uZSA9IGNsb25lRGVlcChyZWNvcmRDbG9uZSk7XG4gIHJldHVybmVkQ2xvbmUuaXNOZXcgPSBmYWxzZTtcbiAgcmV0dXJuIHJldHVybmVkQ2xvbmU7XG59O1xuXG5jb25zdCBpbml0aWFsaXNlQW5jZXN0b3JJbmRleGVzID0gYXN5bmMgKGFwcCwgcmVjb3JkKSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKHJlY29yZC5rZXkpO1xuXG4gIGZvciAoY29uc3QgaW5kZXggb2YgcmVjb3JkTm9kZS5pbmRleGVzKSB7XG4gICAgY29uc3QgaW5kZXhLZXkgPSBqb2luS2V5KHJlY29yZC5rZXksIGluZGV4Lm5hbWUpO1xuICAgIGlmICghYXdhaXQgYXBwLmRhdGFzdG9yZS5leGlzdHMoaW5kZXhLZXkpKSB7IGF3YWl0IGluaXRpYWxpc2VJbmRleChhcHAuZGF0YXN0b3JlLCByZWNvcmQua2V5LCBpbmRleCk7IH1cbiAgfVxufTtcblxuY29uc3QgaW5pdGlhbGlzZVJldmVyc2VSZWZlcmVuY2VJbmRleGVzID0gYXN5bmMgKGFwcCwgcmVjb3JkKSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKHJlY29yZC5rZXkpO1xuXG4gIGNvbnN0IGluZGV4Tm9kZXMgPSAkKGZpZWxkc1RoYXRSZWZlcmVuY2VUaGlzUmVjb3JkKGFwcCwgcmVjb3JkTm9kZSksIFtcbiAgICBtYXAoZiA9PiAkKGYudHlwZU9wdGlvbnMucmV2ZXJzZUluZGV4Tm9kZUtleXMsIFtcbiAgICAgIG1hcChuID0+IGdldE5vZGUoXG4gICAgICAgIGFwcC5oaWVyYXJjaHksXG4gICAgICAgIG4sXG4gICAgICApKSxcbiAgICBdKSksXG4gICAgZmxhdHRlbixcbiAgXSk7XG5cbiAgZm9yIChjb25zdCBpbmRleE5vZGUgb2YgaW5kZXhOb2Rlcykge1xuICAgIGF3YWl0IGluaXRpYWxpc2VJbmRleChcbiAgICAgIGFwcC5kYXRhc3RvcmUsIHJlY29yZC5rZXksIGluZGV4Tm9kZSxcbiAgICApO1xuICB9XG59O1xuXG5jb25zdCBmaWVsZHNUaGF0UmVmZXJlbmNlVGhpc1JlY29yZCA9IChhcHAsIHJlY29yZE5vZGUpID0+ICQoYXBwLmhpZXJhcmNoeSwgW1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGZpbHRlcihpc1JlY29yZCksXG4gIG1hcChuID0+IG4uZmllbGRzKSxcbiAgZmxhdHRlbixcbiAgZmlsdGVyKGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUocmVjb3JkTm9kZSkpLFxuXSk7XG4iLCJpbXBvcnQgeyBpbmNsdWRlcyB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHtcbiAgc2FmZUtleSwgYXBpV3JhcHBlcixcbiAgZXZlbnRzLCBqb2luS2V5LFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgX2RlbGV0ZVJlY29yZCB9IGZyb20gJy4uL3JlY29yZEFwaS9kZWxldGUnO1xuaW1wb3J0IHsgZ2V0QWxsSWRzSXRlcmF0b3IsIGdldEFsbElkc1NoYXJkS2V5IH0gZnJvbSAnLi4vaW5kZXhpbmcvYWxsSWRzJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGRlbGV0ZUNvbGxlY3Rpb24gPSAoYXBwLCBkaXNhYmxlQ2xlYW51cCA9IGZhbHNlKSA9PiBhc3luYyBrZXkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuY29sbGVjdGlvbkFwaS5kZWxldGUsXG4gIHBlcm1pc3Npb24ubWFuYWdlQ29sbGVjdGlvbi5pc0F1dGhvcml6ZWQsXG4gIHsga2V5IH0sXG4gIF9kZWxldGVDb2xsZWN0aW9uLCBhcHAsIGtleSwgZGlzYWJsZUNsZWFudXAsXG4pO1xuXG5cbmV4cG9ydCBjb25zdCBfZGVsZXRlQ29sbGVjdGlvbiA9IGFzeW5jIChhcHAsIGtleSwgZGlzYWJsZUNsZWFudXApID0+IHtcbiAga2V5ID0gc2FmZUtleShrZXkpO1xuICBjb25zdCBub2RlID0gZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoKGFwcC5oaWVyYXJjaHkpKGtleSk7XG5cbiAgYXdhaXQgZGVsZXRlUmVjb3JkcyhhcHAsIGtleSk7XG4gIGF3YWl0IGRlbGV0ZUFsbElkc0ZvbGRlcnMoYXBwLCBub2RlLCBrZXkpO1xuICBhd2FpdCBkZWxldGVDb2xsZWN0aW9uRm9sZGVyKGFwcCwga2V5KTtcbiAgaWYgKCFkaXNhYmxlQ2xlYW51cCkgeyBhd2FpdCBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucygpOyB9XG59O1xuXG5jb25zdCBkZWxldGVDb2xsZWN0aW9uRm9sZGVyID0gYXN5bmMgKGFwcCwga2V5KSA9PiBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihrZXkpO1xuXG5cbmNvbnN0IGRlbGV0ZUFsbElkc0ZvbGRlcnMgPSBhc3luYyAoYXBwLCBub2RlLCBrZXkpID0+IHtcbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoXG4gICAgam9pbktleShcbiAgICAgIGtleSwgJ2FsbGlkcycsXG4gICAgICBub2RlLm5vZGVJZCxcbiAgICApLFxuICApO1xuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKFxuICAgIGpvaW5LZXkoa2V5LCAnYWxsaWRzJyksXG4gICk7XG59O1xuXG5jb25zdCBkZWxldGVSZWNvcmRzID0gYXN5bmMgKGFwcCwga2V5KSA9PiB7XG4gIGNvbnN0IGRlbGV0ZWRBbGxJZHNTaGFyZHMgPSBbXTtcbiAgY29uc3QgZGVsZXRlQWxsSWRzU2hhcmQgPSBhc3luYyAocmVjb3JkSWQpID0+IHtcbiAgICBjb25zdCBzaGFyZEtleSA9IGdldEFsbElkc1NoYXJkS2V5KFxuICAgICAgYXBwLmhpZXJhcmNoeSwga2V5LCByZWNvcmRJZCxcbiAgICApO1xuXG4gICAgaWYgKGluY2x1ZGVzKHNoYXJkS2V5KShkZWxldGVkQWxsSWRzU2hhcmRzKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRlbGV0ZWRBbGxJZHNTaGFyZHMucHVzaChzaGFyZEtleSk7XG5cbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoc2hhcmRLZXkpO1xuICB9O1xuXG4gIGNvbnN0IGl0ZXJhdGUgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvcihhcHApKGtleSk7XG5cbiAgbGV0IGlkcyA9IGF3YWl0IGl0ZXJhdGUoKTtcbiAgd2hpbGUgKCFpZHMuZG9uZSkge1xuICAgIGlmIChpZHMucmVzdWx0LmNvbGxlY3Rpb25LZXkgPT09IGtleSkge1xuICAgICAgZm9yIChjb25zdCBpZCBvZiBpZHMucmVzdWx0Lmlkcykge1xuICAgICAgICBhd2FpdCBfZGVsZXRlUmVjb3JkKFxuICAgICAgICAgIGFwcCxcbiAgICAgICAgICBqb2luS2V5KGtleSwgaWQpLFxuICAgICAgICAgIHRydWUsXG4gICAgICAgICk7XG4gICAgICAgIGF3YWl0IGRlbGV0ZUFsbElkc1NoYXJkKGlkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZHMgPSBhd2FpdCBpdGVyYXRlKCk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICB0cnlBd2FpdE9ySWdub3JlLFxuICBzYWZlS2V5XG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBpc0luZGV4LCBpc1NoYXJkZWRJbmRleCxcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7XG4gIGdldEFsbFNoYXJkS2V5cywgZ2V0U2hhcmRNYXBLZXksXG4gIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSxcbn0gZnJvbSAnLi4vaW5kZXhpbmcvc2hhcmRpbmcnO1xuXG5leHBvcnQgY29uc3QgX2RlbGV0ZUluZGV4ID0gYXN5bmMgKGFwcCwgaW5kZXhLZXksIGluY2x1ZGVGb2xkZXIpID0+IHtcbiAgaW5kZXhLZXkgPSBzYWZlS2V5KGluZGV4S2V5KTtcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShpbmRleEtleSk7XG5cbiAgaWYgKCFpc0luZGV4KGluZGV4Tm9kZSkpIHsgdGhyb3cgbmV3IEVycm9yKCdTdXBwbGllZCBrZXkgaXMgbm90IGFuIGluZGV4Jyk7IH1cblxuICBpZiAoaXNTaGFyZGVkSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIGNvbnN0IHNoYXJkS2V5cyA9IGF3YWl0IGdldEFsbFNoYXJkS2V5cyhhcHAsIGluZGV4S2V5KTtcbiAgICBmb3IgKGNvbnN0IGsgb2Ygc2hhcmRLZXlzKSB7XG4gICAgICBhd2FpdCB0cnlBd2FpdE9ySWdub3JlKFxuICAgICAgICBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoayksXG4gICAgICApO1xuICAgIH1cbiAgICB0cnlBd2FpdE9ySWdub3JlKFxuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKFxuICAgICAgICBnZXRTaGFyZE1hcEtleShpbmRleEtleSksXG4gICAgICApLFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgdHJ5QXdhaXRPcklnbm9yZShcbiAgICAgIGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShcbiAgICAgICAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5KGluZGV4S2V5KSxcbiAgICAgICksXG4gICAgKTtcbiAgfVxuXG4gIGlmIChpbmNsdWRlRm9sZGVyKSB7XG4gICAgdHJ5QXdhaXRPcklnbm9yZShcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKGluZGV4S2V5KSxcbiAgICApO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgc2FmZUtleSwgYXBpV3JhcHBlcixcbiAgZXZlbnRzLCBqb2luS2V5LFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgX2xvYWQsIGdldFJlY29yZEZpbGVOYW1lIH0gZnJvbSAnLi9sb2FkJztcbmltcG9ydCB7IF9kZWxldGVDb2xsZWN0aW9uIH0gZnJvbSAnLi4vY29sbGVjdGlvbkFwaS9kZWxldGUnO1xuaW1wb3J0IHtcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgX2RlbGV0ZUluZGV4IH0gZnJvbSAnLi4vaW5kZXhBcGkvZGVsZXRlJztcbmltcG9ydCB7IHRyYW5zYWN0aW9uRm9yRGVsZXRlUmVjb3JkIH0gZnJvbSAnLi4vdHJhbnNhY3Rpb25zL2NyZWF0ZSc7XG5pbXBvcnQgeyByZW1vdmVGcm9tQWxsSWRzIH0gZnJvbSAnLi4vaW5kZXhpbmcvYWxsSWRzJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGRlbGV0ZVJlY29yZCA9IChhcHAsIGRpc2FibGVDbGVhbnVwID0gZmFsc2UpID0+IGFzeW5jIGtleSA9PiB7XG4gIGtleSA9IHNhZmVLZXkoa2V5KTtcbiAgcmV0dXJuIGFwaVdyYXBwZXIoXG4gICAgYXBwLFxuICAgIGV2ZW50cy5yZWNvcmRBcGkuZGVsZXRlLFxuICAgIHBlcm1pc3Npb24uZGVsZXRlUmVjb3JkLmlzQXV0aG9yaXplZChrZXkpLFxuICAgIHsga2V5IH0sXG4gICAgX2RlbGV0ZVJlY29yZCwgYXBwLCBrZXksIGRpc2FibGVDbGVhbnVwLFxuICApO1xufVxuXG4vLyBjYWxsZWQgZGVsZXRlUmVjb3JkIGJlY2F1c2UgZGVsZXRlIGlzIGEga2V5d29yZFxuZXhwb3J0IGNvbnN0IF9kZWxldGVSZWNvcmQgPSBhc3luYyAoYXBwLCBrZXksIGRpc2FibGVDbGVhbnVwKSA9PiB7XG4gIGtleSA9IHNhZmVLZXkoa2V5KTtcbiAgY29uc3Qgbm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoa2V5KTtcblxuICBjb25zdCByZWNvcmQgPSBhd2FpdCBfbG9hZChhcHAsIGtleSk7XG4gIGF3YWl0IHRyYW5zYWN0aW9uRm9yRGVsZXRlUmVjb3JkKGFwcCwgcmVjb3JkKTtcblxuICBmb3IgKGNvbnN0IGNvbGxlY3Rpb25SZWNvcmQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgIGNvbnN0IGNvbGxlY3Rpb25LZXkgPSBqb2luS2V5KFxuICAgICAga2V5LCBjb2xsZWN0aW9uUmVjb3JkLmNvbGxlY3Rpb25OYW1lLFxuICAgICk7XG4gICAgYXdhaXQgX2RlbGV0ZUNvbGxlY3Rpb24oYXBwLCBjb2xsZWN0aW9uS2V5LCB0cnVlKTtcbiAgfVxuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShcbiAgICBnZXRSZWNvcmRGaWxlTmFtZShrZXkpLFxuICApO1xuXG4gIGF3YWl0IGRlbGV0ZUZpbGVzKGFwcCwga2V5KTtcblxuICBhd2FpdCByZW1vdmVGcm9tQWxsSWRzKGFwcC5oaWVyYXJjaHksIGFwcC5kYXRhc3RvcmUpKHJlY29yZCk7XG5cbiAgaWYgKCFkaXNhYmxlQ2xlYW51cCkgeyBhd2FpdCBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucygpOyB9XG5cbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoa2V5KTtcbiAgYXdhaXQgZGVsZXRlSW5kZXhlcyhhcHAsIGtleSk7XG59O1xuXG5jb25zdCBkZWxldGVJbmRleGVzID0gYXN5bmMgKGFwcCwga2V5KSA9PiB7XG4gIGNvbnN0IG5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKGtleSk7XG4gIC8qIGNvbnN0IHJldmVyc2VJbmRleEtleXMgPSAkKGFwcC5oaWVyYXJjaHksIFtcbiAgICAgICAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICAgICAgICBtYXAobiA9PiBuLmZpZWxkcyksXG4gICAgICAgIGZsYXR0ZW4sXG4gICAgICAgIGZpbHRlcihpc1NvbWV0aGluZyksXG4gICAgICAgIGZpbHRlcihmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlKG5vZGUpKSxcbiAgICAgICAgbWFwKGYgPT4gJChmLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzLCBbXG4gICAgICAgICAgICAgICAgICAgIG1hcChuID0+IGdldE5vZGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5oaWVyYXJjaHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG4pKVxuICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICksXG4gICAgICAgIGZsYXR0ZW4sXG4gICAgICAgIG1hcChuID0+IGpvaW5LZXkoa2V5LCBuLm5hbWUpKVxuICAgIF0pO1xuXG4gICAgZm9yKGxldCBpIG9mIHJldmVyc2VJbmRleEtleXMpIHtcbiAgICAgICAgYXdhaXQgX2RlbGV0ZUluZGV4KGFwcCwgaSwgdHJ1ZSk7XG4gICAgfSAqL1xuXG5cbiAgZm9yIChjb25zdCBpbmRleCBvZiBub2RlLmluZGV4ZXMpIHtcbiAgICBjb25zdCBpbmRleEtleSA9IGpvaW5LZXkoa2V5LCBpbmRleC5uYW1lKTtcbiAgICBhd2FpdCBfZGVsZXRlSW5kZXgoYXBwLCBpbmRleEtleSwgdHJ1ZSk7XG4gIH1cbn07XG5cbmNvbnN0IGRlbGV0ZUZpbGVzID0gYXN5bmMgKGFwcCwga2V5KSA9PiB7XG4gIGNvbnN0IGZpbGVzRm9sZGVyID0gam9pbktleShrZXksICdmaWxlcycpO1xuICBjb25zdCBhbGxGaWxlcyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0Rm9sZGVyQ29udGVudHMoXG4gICAgZmlsZXNGb2xkZXIsXG4gICk7XG5cbiAgZm9yIChjb25zdCBmaWxlIG9mIGFsbEZpbGVzKSB7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKGZpbGUpO1xuICB9XG5cbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoXG4gICAgam9pbktleShrZXksICdmaWxlcycpLFxuICApO1xufTtcbiIsImltcG9ydCB7XG4gIGluY2x1ZGVzLCBmaWx0ZXIsXG4gIG1hcCwgc29tZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnc2hvcnRpZCc7XG5pbXBvcnQgeyBfbG9hZCB9IGZyb20gJy4vbG9hZCc7XG5pbXBvcnQge1xuICBhcGlXcmFwcGVyLCBldmVudHMsIHNwbGl0S2V5LFxuICAkLCBqb2luS2V5LCBpc05vdGhpbmcsIHRyeUF3YWl0T3JJZ25vcmUsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXRFeGFjdE5vZGVGb3JQYXRoIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IGlzTGVnYWxGaWxlbmFtZSB9IGZyb20gJy4uL3R5cGVzL2ZpbGUnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yLCBGb3JiaWRkZW5FcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgdXBsb2FkRmlsZSA9IGFwcCA9PiBhc3luYyAocmVjb3JkS2V5LCByZWFkYWJsZVN0cmVhbSwgcmVsYXRpdmVGaWxlUGF0aCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMucmVjb3JkQXBpLnVwbG9hZEZpbGUsXG4gIHBlcm1pc3Npb24udXBkYXRlUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmRLZXkpLFxuICB7IHJlY29yZEtleSwgcmVhZGFibGVTdHJlYW0sIHJlbGF0aXZlRmlsZVBhdGggfSxcbiAgX3VwbG9hZEZpbGUsIGFwcCwgcmVjb3JkS2V5LCByZWFkYWJsZVN0cmVhbSwgcmVsYXRpdmVGaWxlUGF0aCxcbik7XG5cbmNvbnN0IF91cGxvYWRGaWxlID0gYXN5bmMgKGFwcCwgcmVjb3JkS2V5LCByZWFkYWJsZVN0cmVhbSwgcmVsYXRpdmVGaWxlUGF0aCkgPT4ge1xuICBpZiAoaXNOb3RoaW5nKHJlY29yZEtleSkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignUmVjb3JkIEtleSBub3Qgc3VwcGxpZWQnKTsgfVxuICBpZiAoaXNOb3RoaW5nKHJlbGF0aXZlRmlsZVBhdGgpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ2ZpbGUgcGF0aCBub3Qgc3VwcGxpZWQnKTsgfVxuICBpZiAoIWlzTGVnYWxGaWxlbmFtZShyZWxhdGl2ZUZpbGVQYXRoKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdJbGxlZ2FsIGZpbGVuYW1lJyk7IH1cblxuICBjb25zdCByZWNvcmQgPSBhd2FpdCBfbG9hZChhcHAsIHJlY29yZEtleSk7XG5cbiAgY29uc3QgZnVsbEZpbGVQYXRoID0gc2FmZUdldEZ1bGxGaWxlUGF0aChcbiAgICByZWNvcmRLZXksIHJlbGF0aXZlRmlsZVBhdGgsXG4gICk7XG5cbiAgY29uc3QgdGVtcEZpbGVQYXRoID0gYCR7ZnVsbEZpbGVQYXRofV8ke2dlbmVyYXRlKCl9LnRlbXBgO1xuXG4gIGNvbnN0IG91dHB1dFN0cmVhbSA9IGF3YWl0IGFwcC5kYXRhc3RvcmUud3JpdGFibGVGaWxlU3RyZWFtKFxuICAgIHRlbXBGaWxlUGF0aCxcbiAgKTtcblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUscmVqZWN0KSA9PiB7XG4gICAgcmVhZGFibGVTdHJlYW0ucGlwZShvdXRwdXRTdHJlYW0pO1xuICAgIG91dHB1dFN0cmVhbS5vbignZXJyb3InLCByZWplY3QpO1xuICAgIG91dHB1dFN0cmVhbS5vbignZmluaXNoJywgcmVzb2x2ZSk7XG4gIH0pXG4gIC50aGVuKCgpID0+IGFwcC5kYXRhc3RvcmUuZ2V0RmlsZVNpemUodGVtcEZpbGVQYXRoKSlcbiAgLnRoZW4oc2l6ZSA9PiB7XG4gICAgY29uc3QgaXNFeHBlY3RlZEZpbGVTaXplID0gY2hlY2tGaWxlU2l6ZUFnYWluc3RGaWVsZHMoXG4gICAgICBhcHAsIHJlY29yZCwgcmVsYXRpdmVGaWxlUGF0aCwgc2l6ZVxuICAgICk7ICBcbiAgICBpZiAoIWlzRXhwZWN0ZWRGaWxlU2l6ZSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBGaWVsZHMgZm9yICR7cmVsYXRpdmVGaWxlUGF0aH0gZG8gbm90IGhhdmUgZXhwZWN0ZWQgc2l6ZTogJHtqb2luKCcsJykoaW5jb3JyZWN0RmllbGRzKX1gKTsgfSAgXG5cbiAgfSlcbiAgLnRoZW4oKCkgPT4gdHJ5QXdhaXRPcklnbm9yZShhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUsIGZ1bGxGaWxlUGF0aCkpXG4gIC50aGVuKCgpID0+IGFwcC5kYXRhc3RvcmUucmVuYW1lRmlsZSh0ZW1wRmlsZVBhdGgsIGZ1bGxGaWxlUGF0aCkpO1xuXG4gIC8qXG4gIHJlYWRhYmxlU3RyZWFtLnBpcGUob3V0cHV0U3RyZWFtKTtcblxuICBhd2FpdCBuZXcgUHJvbWlzZShmdWxmaWxsID0+IG91dHB1dFN0cmVhbS5vbignZmluaXNoJywgZnVsZmlsbCkpO1xuXG4gIGNvbnN0IGlzRXhwZWN0ZWRGaWxlU2l6ZSA9IGNoZWNrRmlsZVNpemVBZ2FpbnN0RmllbGRzKFxuICAgIGFwcCxcbiAgICByZWNvcmQsIHJlbGF0aXZlRmlsZVBhdGgsXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5nZXRGaWxlU2l6ZSh0ZW1wRmlsZVBhdGgpLFxuICApO1xuXG4gIGlmICghaXNFeHBlY3RlZEZpbGVTaXplKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEZpZWxkcyBmb3IgJHtyZWxhdGl2ZUZpbGVQYXRofSBkbyBub3QgaGF2ZSBleHBlY3RlZCBzaXplYCk7XG4gIH1cblxuICBhd2FpdCB0cnlBd2FpdE9ySWdub3JlKGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZSwgZnVsbEZpbGVQYXRoKTtcblxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLnJlbmFtZUZpbGUodGVtcEZpbGVQYXRoLCBmdWxsRmlsZVBhdGgpO1xuICAqL1xufTtcblxuY29uc3QgY2hlY2tGaWxlU2l6ZUFnYWluc3RGaWVsZHMgPSAoYXBwLCByZWNvcmQsIHJlbGF0aXZlRmlsZVBhdGgsIGV4cGVjdGVkU2l6ZSkgPT4ge1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShyZWNvcmQua2V5KTtcblxuICBjb25zdCBpbmNvcnJlY3RGaWxlRmllbGRzID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICAgIGZpbHRlcihmID0+IGYudHlwZSA9PT0gJ2ZpbGUnXG4gICAgICAmJiByZWNvcmRbZi5uYW1lXS5yZWxhdGl2ZVBhdGggPT09IHJlbGF0aXZlRmlsZVBhdGhcbiAgICAgICYmIHJlY29yZFtmLm5hbWVdLnNpemUgIT09IGV4cGVjdGVkU2l6ZSksXG4gICAgbWFwKGYgPT4gZi5uYW1lKSxcbiAgXSk7XG5cbiAgY29uc3QgaW5jb3JyZWN0RmlsZUFycmF5RmllbGRzID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICAgIGZpbHRlcihhID0+IGEudHlwZSA9PT0gJ2FycmF5PGZpbGU+J1xuICAgICAgJiYgJChyZWNvcmRbYS5uYW1lXSwgW1xuICAgICAgICBzb21lKGYgPT4gcmVjb3JkW2YubmFtZV0ucmVsYXRpdmVQYXRoID09PSByZWxhdGl2ZUZpbGVQYXRoXG4gICAgICAgICAgJiYgcmVjb3JkW2YubmFtZV0uc2l6ZSAhPT0gZXhwZWN0ZWRTaXplKSxcbiAgICAgIF0pKSxcbiAgICBtYXAoZiA9PiBmLm5hbWUpLFxuICBdKTtcblxuICBjb25zdCBpbmNvcnJlY3RGaWVsZHMgPSBbXG4gICAgLi4uaW5jb3JyZWN0RmlsZUZpZWxkcyxcbiAgICAuLi5pbmNvcnJlY3RGaWxlQXJyYXlGaWVsZHMsXG4gIF07XG5cbiAgaWYgKGluY29ycmVjdEZpZWxkcy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5leHBvcnQgY29uc3Qgc2FmZUdldEZ1bGxGaWxlUGF0aCA9IChyZWNvcmRLZXksIHJlbGF0aXZlRmlsZVBhdGgpID0+IHtcbiAgY29uc3QgbmF1Z2h0eVVzZXIgPSAoKSA9PiB7IHRocm93IG5ldyBGb3JiaWRkZW5FcnJvcignbmF1Z2h0eSBuYXVnaHR5Jyk7IH07XG5cbiAgaWYgKHJlbGF0aXZlRmlsZVBhdGguc3RhcnRzV2l0aCgnLi4nKSkgbmF1Z2h0eVVzZXIoKTtcblxuICBjb25zdCBwYXRoUGFydHMgPSBzcGxpdEtleShyZWxhdGl2ZUZpbGVQYXRoKTtcblxuICBpZiAoaW5jbHVkZXMoJy4uJykocGF0aFBhcnRzKSkgbmF1Z2h0eVVzZXIoKTtcblxuICBjb25zdCByZWNvcmRLZXlQYXJ0cyA9IHNwbGl0S2V5KHJlY29yZEtleSk7XG5cbiAgY29uc3QgZnVsbFBhdGhQYXJ0cyA9IFtcbiAgICAuLi5yZWNvcmRLZXlQYXJ0cyxcbiAgICAnZmlsZXMnLFxuICAgIC4uLmZpbHRlcihwID0+IHAgIT09ICcuJykocGF0aFBhcnRzKSxcbiAgXTtcblxuICByZXR1cm4gam9pbktleShmdWxsUGF0aFBhcnRzKTtcbn07XG4iLCJpbXBvcnQgeyBhcGlXcmFwcGVyLCBldmVudHMsIGlzTm90aGluZyB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBzYWZlR2V0RnVsbEZpbGVQYXRoIH0gZnJvbSAnLi91cGxvYWRGaWxlJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgZG93bmxvYWRGaWxlID0gYXBwID0+IGFzeW5jIChyZWNvcmRLZXksIHJlbGF0aXZlUGF0aCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMucmVjb3JkQXBpLnVwbG9hZEZpbGUsXG4gIHBlcm1pc3Npb24ucmVhZFJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkS2V5KSxcbiAgeyByZWNvcmRLZXksIHJlbGF0aXZlUGF0aCB9LC8vcmVtb3ZlIGR1cGUga2V5ICdyZWNvcmRLZXknIGZyb20gb2JqZWN0XG4gIF9kb3dubG9hZEZpbGUsIGFwcCwgcmVjb3JkS2V5LCByZWxhdGl2ZVBhdGgsXG4pOyBcblxuXG5jb25zdCBfZG93bmxvYWRGaWxlID0gYXN5bmMgKGFwcCwgcmVjb3JkS2V5LCByZWxhdGl2ZVBhdGgpID0+IHtcbiAgaWYgKGlzTm90aGluZyhyZWNvcmRLZXkpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ1JlY29yZCBLZXkgbm90IHN1cHBsaWVkJyk7IH1cbiAgaWYgKGlzTm90aGluZyhyZWxhdGl2ZVBhdGgpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ2ZpbGUgcGF0aCBub3Qgc3VwcGxpZWQnKTsgfVxuXG4gIHJldHVybiBhd2FpdCBhcHAuZGF0YXN0b3JlLnJlYWRhYmxlRmlsZVN0cmVhbShcbiAgICBzYWZlR2V0RnVsbEZpbGVQYXRoKFxuICAgICAgcmVjb3JkS2V5LCByZWxhdGl2ZVBhdGgsXG4gICAgKSxcbiAgKTtcbn07XG4iLCJpbXBvcnQgeyBmaW5kLCB0YWtlLCB1bmlvbiB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZXRGbGF0dGVuZWRIaWVyYXJjaHkgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgJCwgc3BsaXRLZXksIGpvaW5LZXkgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgTm90Rm91bmRFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgY3VzdG9tSWQgPSBhcHAgPT4gKG5vZGVOYW1lLCBpZCkgPT4ge1xuICBjb25zdCBub2RlID0gJChhcHAuaGllcmFyY2h5LCBbXG4gICAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICAgIGZpbmQobiA9PiBuLm5hbWUgPT09IG5vZGVOYW1lKSxcbiAgXSk7XG5cbiAgaWYgKCFub2RlKSB0aHJvdyBuZXcgTm90Rm91bmRFcnJvcihgQ2Fubm90IGZpbmQgbm9kZSAke25vZGVOYW1lfWApO1xuXG4gIHJldHVybiBgJHtub2RlLm5vZGVJZH0tJHtpZH1gO1xufTtcblxuZXhwb3J0IGNvbnN0IHNldEN1c3RvbUlkID0gYXBwID0+IChyZWNvcmQsIGlkKSA9PiB7XG4gIHJlY29yZC5pZCA9IGN1c3RvbUlkKGFwcCkocmVjb3JkLnR5cGUsIGlkKTtcblxuICBjb25zdCBrZXlQYXJ0cyA9IHNwbGl0S2V5KHJlY29yZC5rZXkpO1xuXG4gIHJlY29yZC5rZXkgPSAkKGtleVBhcnRzLCBbXG4gICAgdGFrZShrZXlQYXJ0cy5sZW5ndGggLSAxKSxcbiAgICB1bmlvbihbcmVjb3JkLmlkXSksXG4gICAgam9pbktleSxcbiAgXSk7XG5cbiAgcmV0dXJuIHJlY29yZDtcbn07XG4iLCJpbXBvcnQgeyBnZXROZXcsIGdldE5ld0NoaWxkIH0gZnJvbSAnLi9nZXROZXcnO1xuaW1wb3J0IHsgbG9hZCB9IGZyb20gJy4vbG9hZCc7XG5pbXBvcnQgeyB2YWxpZGF0ZSB9IGZyb20gJy4vdmFsaWRhdGUnO1xuaW1wb3J0IHsgZ2V0Q29udGV4dCB9IGZyb20gJy4vZ2V0Q29udGV4dCc7XG5pbXBvcnQgeyBzYXZlIH0gZnJvbSAnLi9zYXZlJztcbmltcG9ydCB7IGRlbGV0ZVJlY29yZCB9IGZyb20gJy4vZGVsZXRlJztcbmltcG9ydCB7IHVwbG9hZEZpbGUgfSBmcm9tICcuL3VwbG9hZEZpbGUnO1xuaW1wb3J0IHsgZG93bmxvYWRGaWxlIH0gZnJvbSAnLi9kb3dubG9hZEZpbGUnO1xuaW1wb3J0IHsgY3VzdG9tSWQsIHNldEN1c3RvbUlkIH0gZnJvbSAnLi9jdXN0b21JZCc7XG5cbmNvbnN0IGFwaSA9IGFwcCA9PiAoe1xuICBnZXROZXc6IGdldE5ldyhhcHApLFxuICBnZXROZXdDaGlsZDogZ2V0TmV3Q2hpbGQoYXBwKSxcbiAgc2F2ZTogc2F2ZShhcHApLFxuICBsb2FkOiBsb2FkKGFwcCksXG4gIGRlbGV0ZTogZGVsZXRlUmVjb3JkKGFwcCwgZmFsc2UpLFxuICB2YWxpZGF0ZTogdmFsaWRhdGUoYXBwKSxcbiAgZ2V0Q29udGV4dDogZ2V0Q29udGV4dChhcHApLFxuICB1cGxvYWRGaWxlOiB1cGxvYWRGaWxlKGFwcCksXG4gIGRvd25sb2FkRmlsZTogZG93bmxvYWRGaWxlKGFwcCksXG4gIGN1c3RvbUlkOiBjdXN0b21JZChhcHApLFxuICBzZXRDdXN0b21JZDogc2V0Q3VzdG9tSWQoYXBwKSxcbn0pO1xuXG5cbmV4cG9ydCBjb25zdCBnZXRSZWNvcmRBcGkgPSBhcHAgPT4gYXBpKGFwcCk7XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJlY29yZEFwaTtcbiIsImltcG9ydCB7IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xuICBpc05vdGhpbmcsIHNhZmVLZXksIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBnZXRBbGxvd2VkUmVjb3JkVHlwZXMgPSBhcHAgPT4ga2V5ID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5jb2xsZWN0aW9uQXBpLmdldEFsbG93ZWRSZWNvcmRUeXBlcyxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyBrZXkgfSxcbiAgX2dldEFsbG93ZWRSZWNvcmRUeXBlcywgYXBwLCBrZXksXG4pO1xuXG5jb25zdCBfZ2V0QWxsb3dlZFJlY29yZFR5cGVzID0gKGFwcCwga2V5KSA9PiB7XG4gIGtleSA9IHNhZmVLZXkoa2V5KTtcbiAgY29uc3Qgbm9kZSA9IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHAuaGllcmFyY2h5KShrZXkpO1xuICByZXR1cm4gaXNOb3RoaW5nKG5vZGUpID8gW10gOiBbbm9kZS5uYW1lXTtcbn07XG4iLCJpbXBvcnQgeyBnZXRBbGxJZHNJdGVyYXRvciB9IGZyb20gJy4uL2luZGV4aW5nL2FsbElkcyc7XG5pbXBvcnQgeyBnZXRBbGxvd2VkUmVjb3JkVHlwZXMgfSBmcm9tICcuL2dldEFsbG93ZWRSZWNvcmRUeXBlcyc7XG5pbXBvcnQgeyBkZWxldGVDb2xsZWN0aW9uIH0gZnJvbSAnLi9kZWxldGUnO1xuXG5leHBvcnQgY29uc3QgZ2V0Q29sbGVjdGlvbkFwaSA9IGFwcCA9PiAoe1xuICBnZXRBbGxvd2VkUmVjb3JkVHlwZXM6IGdldEFsbG93ZWRSZWNvcmRUeXBlcyhhcHApLFxuICBnZXRBbGxJZHNJdGVyYXRvcjogZ2V0QWxsSWRzSXRlcmF0b3IoYXBwKSxcbiAgZGVsZXRlOiBkZWxldGVDb2xsZWN0aW9uKGFwcCksXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0Q29sbGVjdGlvbkFwaTtcbiIsImltcG9ydCB7XG4gIGZpbmQsIGZpbHRlciwgXG4gIGluY2x1ZGVzLCBzb21lLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2V0QWxsSWRzSXRlcmF0b3IgfSBmcm9tICcuLi9pbmRleGluZy9hbGxJZHMnO1xuaW1wb3J0IHtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LCBnZXRSZWNvcmROb2RlQnlJZCxcbiAgZ2V0Q29sbGVjdGlvbk5vZGVCeUtleU9yTm9kZUtleSwgZ2V0Tm9kZSwgaXNJbmRleCxcbiAgaXNSZWNvcmQsIGlzRGVjZW5kYW50LCBnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleCxcbiAgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xuICBqb2luS2V5LCBhcGlXcmFwcGVyLCBldmVudHMsICQsIGFsbFRydWUsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBjcmVhdGVCdWlsZEluZGV4Rm9sZGVyLFxuICB0cmFuc2FjdGlvbkZvckJ1aWxkSW5kZXgsXG59IGZyb20gJy4uL3RyYW5zYWN0aW9ucy9jcmVhdGUnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cblxuLyoqIHJlYnVpbGRzIGFuIGluZGV4XG4gKiBAcGFyYW0ge29iamVjdH0gYXBwIC0gdGhlIGFwcGxpY2F0aW9uIGNvbnRhaW5lclxuICogQHBhcmFtIHtzdHJpbmd9IGluZGV4Tm9kZUtleSAtIG5vZGUga2V5IG9mIHRoZSBpbmRleCwgd2hpY2ggdGhlIGluZGV4IGJlbG9uZ3MgdG9cbiAqL1xuZXhwb3J0IGNvbnN0IGJ1aWxkSW5kZXggPSBhcHAgPT4gYXN5bmMgaW5kZXhOb2RlS2V5ID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmluZGV4QXBpLmJ1aWxkSW5kZXgsXG4gIHBlcm1pc3Npb24ubWFuYWdlSW5kZXguaXNBdXRob3JpemVkLFxuICB7IGluZGV4Tm9kZUtleSB9LFxuICBfYnVpbGRJbmRleCwgYXBwLCBpbmRleE5vZGVLZXksXG4pO1xuXG5jb25zdCBfYnVpbGRJbmRleCA9IGFzeW5jIChhcHAsIGluZGV4Tm9kZUtleSkgPT4ge1xuICBjb25zdCBpbmRleE5vZGUgPSBnZXROb2RlKGFwcC5oaWVyYXJjaHksIGluZGV4Tm9kZUtleSk7XG5cbiAgYXdhaXQgY3JlYXRlQnVpbGRJbmRleEZvbGRlcihhcHAuZGF0YXN0b3JlLCBpbmRleE5vZGVLZXkpO1xuXG4gIGlmICghaXNJbmRleChpbmRleE5vZGUpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ0J1aWxkSW5kZXg6IG11c3Qgc3VwcGx5IGFuIGluZGV4bm9kZScpOyB9XG5cbiAgaWYgKGluZGV4Tm9kZS5pbmRleFR5cGUgPT09ICdyZWZlcmVuY2UnKSB7XG4gICAgYXdhaXQgYnVpbGRSZXZlcnNlUmVmZXJlbmNlSW5kZXgoXG4gICAgICBhcHAsIGluZGV4Tm9kZSxcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGF3YWl0IGJ1aWxkSGVpcmFyY2hhbEluZGV4KFxuICAgICAgYXBwLCBpbmRleE5vZGUsXG4gICAgKTtcbiAgfVxuXG4gIGF3YWl0IGFwcC5jbGVhbnVwVHJhbnNhY3Rpb25zKCk7XG59O1xuXG5jb25zdCBidWlsZFJldmVyc2VSZWZlcmVuY2VJbmRleCA9IGFzeW5jIChhcHAsIGluZGV4Tm9kZSkgPT4ge1xuICAvLyBJdGVyYXRlIHRocm91Z2ggYWxsIHJlZmVyZW5jSU5HIHJlY29yZHMsXG4gIC8vIGFuZCB1cGRhdGUgcmVmZXJlbmNlZCBpbmRleCBmb3IgZWFjaCByZWNvcmRcbiAgbGV0IHJlY29yZENvdW50ID0gMDtcbiAgY29uc3QgcmVmZXJlbmNpbmdOb2RlcyA9ICQoYXBwLmhpZXJhcmNoeSwgW1xuICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgICBmaWx0ZXIobiA9PiBpc1JlY29yZChuKVxuICAgICAgICAgICAgICAgICAgICAmJiBzb21lKGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4KGluZGV4Tm9kZSkpKG4uZmllbGRzKSksXG4gIF0pO1xuXG4gIGNvbnN0IGNyZWF0ZVRyYW5zYWN0aW9uc0ZvclJlZmVyZW5jaW5nTm9kZSA9IGFzeW5jIChyZWZlcmVuY2luZ05vZGUpID0+IHtcbiAgICBjb25zdCBpdGVyYXRlUmVmZXJlbmNpbmdOb2RlcyA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yKGFwcCkocmVmZXJlbmNpbmdOb2RlLmNvbGxlY3Rpb25Ob2RlS2V5KCkpO1xuXG4gICAgbGV0IHJlZmVyZW5jaW5nSWRJdGVyYXRvciA9IGF3YWl0IGl0ZXJhdGVSZWZlcmVuY2luZ05vZGVzKCk7XG4gICAgd2hpbGUgKCFyZWZlcmVuY2luZ0lkSXRlcmF0b3IuZG9uZSkge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlZmVyZW5jaW5nSWRJdGVyYXRvcjtcbiAgICAgIGZvciAoY29uc3QgaWQgb2YgcmVzdWx0Lmlkcykge1xuICAgICAgICBjb25zdCByZWNvcmRLZXkgPSBqb2luS2V5KHJlc3VsdC5jb2xsZWN0aW9uS2V5LCBpZCk7XG4gICAgICAgIGF3YWl0IHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleChhcHAsIGluZGV4Tm9kZS5ub2RlS2V5KCksIHJlY29yZEtleSwgcmVjb3JkQ291bnQpO1xuICAgICAgICByZWNvcmRDb3VudCsrO1xuICAgICAgfVxuICAgICAgcmVmZXJlbmNpbmdJZEl0ZXJhdG9yID0gYXdhaXQgaXRlcmF0ZVJlZmVyZW5jaW5nTm9kZXMoKTtcbiAgICB9XG4gIH07XG5cbiAgZm9yIChjb25zdCByZWZlcmVuY2luZ05vZGUgb2YgcmVmZXJlbmNpbmdOb2Rlcykge1xuICAgIGF3YWl0IGNyZWF0ZVRyYW5zYWN0aW9uc0ZvclJlZmVyZW5jaW5nTm9kZShyZWZlcmVuY2luZ05vZGUpO1xuICB9XG59O1xuXG5jb25zdCBnZXRBbGxvd2VkUGFyZW50Q29sbGVjdGlvbk5vZGVzID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlKSA9PiAkKGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4KGhpZXJhcmNoeSwgaW5kZXhOb2RlKSwgW1xuICBtYXAobiA9PiBuLnBhcmVudCgpKSxcbl0pO1xuXG5jb25zdCBidWlsZEhlaXJhcmNoYWxJbmRleCA9IGFzeW5jIChhcHAsIGluZGV4Tm9kZSkgPT4ge1xuICBsZXQgcmVjb3JkQ291bnQgPSAwO1xuXG4gIGNvbnN0IGNyZWF0ZVRyYW5zYWN0aW9uc0ZvcklkcyA9IGFzeW5jIChjb2xsZWN0aW9uS2V5LCBpZHMpID0+IHtcbiAgICBmb3IgKGNvbnN0IHJlY29yZElkIG9mIGlkcykge1xuICAgICAgY29uc3QgcmVjb3JkS2V5ID0gam9pbktleShjb2xsZWN0aW9uS2V5LCByZWNvcmRJZCk7XG5cbiAgICAgIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRSZWNvcmROb2RlQnlJZChcbiAgICAgICAgYXBwLmhpZXJhcmNoeSxcbiAgICAgICAgcmVjb3JkSWQsXG4gICAgICApO1xuXG4gICAgICBpZiAocmVjb3JkTm9kZUFwcGxpZXMoaW5kZXhOb2RlKShyZWNvcmROb2RlKSkge1xuICAgICAgICBhd2FpdCB0cmFuc2FjdGlvbkZvckJ1aWxkSW5kZXgoXG4gICAgICAgICAgYXBwLCBpbmRleE5vZGUubm9kZUtleSgpLFxuICAgICAgICAgIHJlY29yZEtleSwgcmVjb3JkQ291bnQsXG4gICAgICAgICk7XG4gICAgICAgIHJlY29yZENvdW50Kys7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG5cbiAgY29uc3QgY29sbGVjdGlvblJlY29yZHMgPSBnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleChhcHAuaGllcmFyY2h5LCBpbmRleE5vZGUpO1xuXG4gIGZvciAoY29uc3QgdGFyZ2V0Q29sbGVjdGlvblJlY29yZE5vZGUgb2YgY29sbGVjdGlvblJlY29yZHMpIHtcbiAgICBjb25zdCBhbGxJZHNJdGVyYXRvciA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yKGFwcCkodGFyZ2V0Q29sbGVjdGlvblJlY29yZE5vZGUuY29sbGVjdGlvbk5vZGVLZXkoKSk7XG5cbiAgICBsZXQgYWxsSWRzID0gYXdhaXQgYWxsSWRzSXRlcmF0b3IoKTtcbiAgICB3aGlsZSAoYWxsSWRzLmRvbmUgPT09IGZhbHNlKSB7XG4gICAgICBhd2FpdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JJZHMoXG4gICAgICAgIGFsbElkcy5yZXN1bHQuY29sbGVjdGlvbktleSxcbiAgICAgICAgYWxsSWRzLnJlc3VsdC5pZHMsXG4gICAgICApO1xuICAgICAgYWxsSWRzID0gYXdhaXQgYWxsSWRzSXRlcmF0b3IoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVjb3JkQ291bnQ7XG59O1xuXG5jb25zdCBjaG9vc2VDaGlsZFJlY29yZE5vZGVCeUtleSA9IChjb2xsZWN0aW9uTm9kZSwgcmVjb3JkSWQpID0+IGZpbmQoYyA9PiByZWNvcmRJZC5zdGFydHNXaXRoKGMubm9kZUlkKSkoY29sbGVjdGlvbk5vZGUuY2hpbGRyZW4pO1xuXG5jb25zdCByZWNvcmROb2RlQXBwbGllcyA9IGluZGV4Tm9kZSA9PiByZWNvcmROb2RlID0+IGluY2x1ZGVzKHJlY29yZE5vZGUubm9kZUlkKShpbmRleE5vZGUuYWxsb3dlZFJlY29yZE5vZGVJZHMpO1xuXG5jb25zdCBoYXNBcHBsaWNhYmxlRGVjZW5kYW50ID0gKGhpZXJhcmNoeSwgYW5jZXN0b3JOb2RlLCBpbmRleE5vZGUpID0+ICQoaGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmlsdGVyKFxuICAgIGFsbFRydWUoXG4gICAgICBpc1JlY29yZCxcbiAgICAgIGlzRGVjZW5kYW50KGFuY2VzdG9yTm9kZSksXG4gICAgICByZWNvcmROb2RlQXBwbGllcyhpbmRleE5vZGUpLFxuICAgICksXG4gICksXG5dKTtcblxuY29uc3QgYXBwbHlBbGxEZWNlbmRhbnRSZWNvcmRzID0gYXN5bmMgKGFwcCwgY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSxcbiAgaW5kZXhOb2RlLCBpbmRleEtleSwgY3VycmVudEluZGV4ZWREYXRhLFxuICBjdXJyZW50SW5kZXhlZERhdGFLZXksIHJlY29yZENvdW50ID0gMCkgPT4ge1xuICBjb25zdCBjb2xsZWN0aW9uTm9kZSA9IGdldENvbGxlY3Rpb25Ob2RlQnlLZXlPck5vZGVLZXkoXG4gICAgYXBwLmhpZXJhcmNoeSxcbiAgICBjb2xsZWN0aW9uX0tleV9vcl9Ob2RlS2V5LFxuICApO1xuXG4gIGNvbnN0IGFsbElkc0l0ZXJhdG9yID0gYXdhaXQgZ2V0QWxsSWRzSXRlcmF0b3IoYXBwKShjb2xsZWN0aW9uX0tleV9vcl9Ob2RlS2V5KTtcblxuXG4gIGNvbnN0IGNyZWF0ZVRyYW5zYWN0aW9uc0ZvcklkcyA9IGFzeW5jIChjb2xsZWN0aW9uS2V5LCBhbGxJZHMpID0+IHtcbiAgICBmb3IgKGNvbnN0IHJlY29yZElkIG9mIGFsbElkcykge1xuICAgICAgY29uc3QgcmVjb3JkS2V5ID0gam9pbktleShjb2xsZWN0aW9uS2V5LCByZWNvcmRJZCk7XG5cbiAgICAgIGNvbnN0IHJlY29yZE5vZGUgPSBjaG9vc2VDaGlsZFJlY29yZE5vZGVCeUtleShcbiAgICAgICAgY29sbGVjdGlvbk5vZGUsXG4gICAgICAgIHJlY29yZElkLFxuICAgICAgKTtcblxuICAgICAgaWYgKHJlY29yZE5vZGVBcHBsaWVzKGluZGV4Tm9kZSkocmVjb3JkTm9kZSkpIHtcbiAgICAgICAgYXdhaXQgdHJhbnNhY3Rpb25Gb3JCdWlsZEluZGV4KFxuICAgICAgICAgIGFwcCwgaW5kZXhOb2RlLm5vZGVLZXkoKSxcbiAgICAgICAgICByZWNvcmRLZXksIHJlY29yZENvdW50LFxuICAgICAgICApO1xuICAgICAgICByZWNvcmRDb3VudCsrO1xuICAgICAgfVxuXG4gICAgICBpZiAoaGFzQXBwbGljYWJsZURlY2VuZGFudChhcHAuaGllcmFyY2h5LCByZWNvcmROb2RlLCBpbmRleE5vZGUpKSB7XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGRDb2xsZWN0aW9uTm9kZSBvZiByZWNvcmROb2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgcmVjb3JkQ291bnQgPSBhd2FpdCBhcHBseUFsbERlY2VuZGFudFJlY29yZHMoXG4gICAgICAgICAgICBhcHAsXG4gICAgICAgICAgICBqb2luS2V5KHJlY29yZEtleSwgY2hpbGRDb2xsZWN0aW9uTm9kZS5jb2xsZWN0aW9uTmFtZSksXG4gICAgICAgICAgICBpbmRleE5vZGUsIGluZGV4S2V5LCBjdXJyZW50SW5kZXhlZERhdGEsXG4gICAgICAgICAgICBjdXJyZW50SW5kZXhlZERhdGFLZXksIHJlY29yZENvdW50LFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgbGV0IGFsbElkcyA9IGF3YWl0IGFsbElkc0l0ZXJhdG9yKCk7XG4gIHdoaWxlIChhbGxJZHMuZG9uZSA9PT0gZmFsc2UpIHtcbiAgICBhd2FpdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JJZHMoXG4gICAgICBhbGxJZHMucmVzdWx0LmNvbGxlY3Rpb25LZXksXG4gICAgICBhbGxJZHMucmVzdWx0LmlkcyxcbiAgICApO1xuICAgIGFsbElkcyA9IGF3YWl0IGFsbElkc0l0ZXJhdG9yKCk7XG4gIH1cblxuICByZXR1cm4gcmVjb3JkQ291bnQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBidWlsZEluZGV4O1xuIiwiaW1wb3J0IHsgaGFzLCBpc051bWJlciwgaXNVbmRlZmluZWQgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgY29tcGlsZUV4cHJlc3Npb24sIGNvbXBpbGVDb2RlIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xuaW1wb3J0IHtcbiAgc2FmZUtleSwgYXBpV3JhcHBlcixcbiAgZXZlbnRzLCBpc05vbkVtcHR5U3RyaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgaXRlcmF0ZUluZGV4IH0gZnJvbSAnLi4vaW5kZXhpbmcvcmVhZCc7XG5pbXBvcnQge1xuICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXksXG4gIGdldFNoYXJkS2V5c0luUmFuZ2UsXG59IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcbmltcG9ydCB7XG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsIGlzSW5kZXgsXG4gIGlzU2hhcmRlZEluZGV4LFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgQ09OVElOVUVfUkVBRElOR19SRUNPUkRTIH0gZnJvbSAnLi4vaW5kZXhpbmcvc2VyaWFsaXplcic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGFnZ3JlZ2F0ZXMgPSBhcHAgPT4gYXN5bmMgKGluZGV4S2V5LCByYW5nZVN0YXJ0UGFyYW1zID0gbnVsbCwgcmFuZ2VFbmRQYXJhbXMgPSBudWxsKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5pbmRleEFwaS5hZ2dyZWdhdGVzLFxuICBwZXJtaXNzaW9uLnJlYWRJbmRleC5pc0F1dGhvcml6ZWQoaW5kZXhLZXkpLFxuICB7IGluZGV4S2V5LCByYW5nZVN0YXJ0UGFyYW1zLCByYW5nZUVuZFBhcmFtcyB9LFxuICBfYWdncmVnYXRlcywgYXBwLCBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMsXG4pO1xuXG5jb25zdCBfYWdncmVnYXRlcyA9IGFzeW5jIChhcHAsIGluZGV4S2V5LCByYW5nZVN0YXJ0UGFyYW1zLCByYW5nZUVuZFBhcmFtcykgPT4ge1xuICBpbmRleEtleSA9IHNhZmVLZXkoaW5kZXhLZXkpO1xuICBjb25zdCBpbmRleE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKGluZGV4S2V5KTtcblxuICBpZiAoIWlzSW5kZXgoaW5kZXhOb2RlKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdzdXBwbGllZCBrZXkgaXMgbm90IGFuIGluZGV4Jyk7IH1cblxuICBpZiAoaXNTaGFyZGVkSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIGNvbnN0IHNoYXJkS2V5cyA9IGF3YWl0IGdldFNoYXJkS2V5c0luUmFuZ2UoXG4gICAgICBhcHAsIGluZGV4S2V5LCByYW5nZVN0YXJ0UGFyYW1zLCByYW5nZUVuZFBhcmFtcyxcbiAgICApO1xuICAgIGxldCBhZ2dyZWdhdGVSZXN1bHQgPSBudWxsO1xuICAgIGZvciAoY29uc3QgayBvZiBzaGFyZEtleXMpIHtcbiAgICAgIGNvbnN0IHNoYXJkUmVzdWx0ID0gYXdhaXQgZ2V0QWdncmVnYXRlcyhhcHAuaGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlLCBpbmRleE5vZGUsIGspO1xuICAgICAgaWYgKGFnZ3JlZ2F0ZVJlc3VsdCA9PT0gbnVsbCkge1xuICAgICAgICBhZ2dyZWdhdGVSZXN1bHQgPSBzaGFyZFJlc3VsdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFnZ3JlZ2F0ZVJlc3VsdCA9IG1lcmdlU2hhcmRBZ2dyZWdhdGUoXG4gICAgICAgICAgYWdncmVnYXRlUmVzdWx0LFxuICAgICAgICAgIHNoYXJkUmVzdWx0LFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYWdncmVnYXRlUmVzdWx0O1xuICB9XG4gIHJldHVybiBhd2FpdCBnZXRBZ2dyZWdhdGVzKFxuICAgIGFwcC5oaWVyYXJjaHksXG4gICAgYXBwLmRhdGFzdG9yZSxcbiAgICBpbmRleE5vZGUsXG4gICAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5KGluZGV4S2V5KSxcbiAgKTtcbn07XG5cbmNvbnN0IG1lcmdlU2hhcmRBZ2dyZWdhdGUgPSAodG90YWxzLCBzaGFyZCkgPT4ge1xuICBjb25zdCBtZXJnZUdyb3VwaW5nID0gKHRvdCwgc2hyKSA9PiB7XG4gICAgdG90LmNvdW50ICs9IHNoci5jb3VudDtcbiAgICBmb3IgKGNvbnN0IGFnZ05hbWUgaW4gdG90KSB7XG4gICAgICBpZiAoYWdnTmFtZSA9PT0gJ2NvdW50JykgY29udGludWU7XG4gICAgICBjb25zdCB0b3RhZ2cgPSB0b3RbYWdnTmFtZV07XG4gICAgICBjb25zdCBzaHJhZ2cgPSBzaHJbYWdnTmFtZV07XG4gICAgICB0b3RhZ2cuc3VtICs9IHNocmFnZy5zdW07XG4gICAgICB0b3RhZ2cubWF4ID0gdG90YWdnLm1heCA+IHNocmFnZy5tYXhcbiAgICAgICAgPyB0b3RhZ2cubWF4XG4gICAgICAgIDogc2hyYWdnLm1heDtcbiAgICAgIHRvdGFnZy5taW4gPSB0b3RhZ2cubWluIDwgc2hyYWdnLm1pblxuICAgICAgICA/IHRvdGFnZy5taW5cbiAgICAgICAgOiBzaHJhZ2cubWluO1xuICAgICAgdG90YWdnLm1lYW4gPSB0b3RhZ2cuc3VtIC8gdG90LmNvdW50O1xuICAgIH1cbiAgICByZXR1cm4gdG90O1xuICB9O1xuXG4gIGZvciAoY29uc3QgYWdnR3JvdXBEZWYgaW4gdG90YWxzKSB7XG4gICAgZm9yIChjb25zdCBncm91cGluZyBpbiBzaGFyZFthZ2dHcm91cERlZl0pIHtcbiAgICAgIGNvbnN0IGdyb3VwaW5nVG90YWwgPSB0b3RhbHNbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXTtcbiAgICAgIHRvdGFsc1thZ2dHcm91cERlZl1bZ3JvdXBpbmddID0gaXNVbmRlZmluZWQoZ3JvdXBpbmdUb3RhbClcbiAgICAgICAgPyBzaGFyZFthZ2dHcm91cERlZl1bZ3JvdXBpbmddXG4gICAgICAgIDogbWVyZ2VHcm91cGluZyhcbiAgICAgICAgICB0b3RhbHNbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXSxcbiAgICAgICAgICBzaGFyZFthZ2dHcm91cERlZl1bZ3JvdXBpbmddLFxuICAgICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0b3RhbHM7XG59O1xuXG5jb25zdCBnZXRBZ2dyZWdhdGVzID0gYXN5bmMgKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXkpID0+IHtcbiAgY29uc3QgYWdncmVnYXRlUmVzdWx0ID0ge307XG4gIGNvbnN0IGRvUmVhZCA9IGl0ZXJhdGVJbmRleChcbiAgICAgICAgYXN5bmMgaXRlbSA9PiB7XG4gICAgICBhcHBseUl0ZW1Ub0FnZ3JlZ2F0ZVJlc3VsdChcbiAgICAgICAgaW5kZXgsIGFnZ3JlZ2F0ZVJlc3VsdCwgaXRlbSxcbiAgICAgICk7XG4gICAgICByZXR1cm4gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xuICAgIH0sXG4gICAgICAgIGFzeW5jICgpID0+IGFnZ3JlZ2F0ZVJlc3VsdFxuICApO1xuXG4gIHJldHVybiBhd2FpdCBkb1JlYWQoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSk7XG59O1xuXG5cbmNvbnN0IGFwcGx5SXRlbVRvQWdncmVnYXRlUmVzdWx0ID0gKGluZGV4Tm9kZSwgcmVzdWx0LCBpdGVtKSA9PiB7XG4gIGNvbnN0IGdldEluaXRpYWxBZ2dyZWdhdGVSZXN1bHQgPSAoKSA9PiAoe1xuICAgIHN1bTogMCwgbWVhbjogbnVsbCwgbWF4OiBudWxsLCBtaW46IG51bGwsXG4gIH0pO1xuXG4gIGNvbnN0IGFwcGx5QWdncmVnYXRlUmVzdWx0ID0gKGFnZywgZXhpc3RpbmcsIGNvdW50KSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSBjb21waWxlQ29kZShhZ2cuYWdncmVnYXRlZFZhbHVlKSh7IHJlY29yZDogaXRlbSB9KTtcblxuICAgIGlmICghaXNOdW1iZXIodmFsdWUpKSByZXR1cm4gZXhpc3Rpbmc7XG5cbiAgICBleGlzdGluZy5zdW0gKz0gdmFsdWU7XG4gICAgZXhpc3RpbmcubWF4ID0gdmFsdWUgPiBleGlzdGluZy5tYXggfHwgZXhpc3RpbmcubWF4ID09PSBudWxsXG4gICAgICA/IHZhbHVlXG4gICAgICA6IGV4aXN0aW5nLm1heDtcbiAgICBleGlzdGluZy5taW4gPSB2YWx1ZSA8IGV4aXN0aW5nLm1pbiB8fCBleGlzdGluZy5taW4gPT09IG51bGxcbiAgICAgID8gdmFsdWVcbiAgICAgIDogZXhpc3RpbmcubWluO1xuICAgIGV4aXN0aW5nLm1lYW4gPSBleGlzdGluZy5zdW0gLyBjb3VudDtcbiAgICByZXR1cm4gZXhpc3Rpbmc7XG4gIH07XG5cbiAgZm9yIChjb25zdCBhZ2dHcm91cCBvZiBpbmRleE5vZGUuYWdncmVnYXRlR3JvdXBzKSB7XG4gICAgaWYgKCFoYXMoYWdnR3JvdXAubmFtZSkocmVzdWx0KSkge1xuICAgICAgcmVzdWx0W2FnZ0dyb3VwLm5hbWVdID0ge307XG4gICAgfVxuXG4gICAgY29uc3QgdGhpc0dyb3VwUmVzdWx0ID0gcmVzdWx0W2FnZ0dyb3VwLm5hbWVdO1xuXG4gICAgaWYgKGlzTm9uRW1wdHlTdHJpbmcoYWdnR3JvdXAuY29uZGl0aW9uKSkge1xuICAgICAgaWYgKCFjb21waWxlRXhwcmVzc2lvbihhZ2dHcm91cC5jb25kaXRpb24pKHsgcmVjb3JkOiBpdGVtIH0pKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBncm91cCA9IGlzTm9uRW1wdHlTdHJpbmcoYWdnR3JvdXAuZ3JvdXBCeSlcbiAgICAgID8gY29tcGlsZUNvZGUoYWdnR3JvdXAuZ3JvdXBCeSkoeyByZWNvcmQ6IGl0ZW0gfSlcbiAgICAgIDogJ2FsbCc7XG4gICAgaWYgKCFpc05vbkVtcHR5U3RyaW5nKGdyb3VwKSkge1xuICAgICAgZ3JvdXAgPSAnKG5vbmUpJztcbiAgICB9XG5cbiAgICBpZiAoIWhhcyhncm91cCkodGhpc0dyb3VwUmVzdWx0KSkge1xuICAgICAgdGhpc0dyb3VwUmVzdWx0W2dyb3VwXSA9IHsgY291bnQ6IDAgfTtcbiAgICAgIGZvciAoY29uc3QgYWdnIG9mIGFnZ0dyb3VwLmFnZ3JlZ2F0ZXMpIHtcbiAgICAgICAgdGhpc0dyb3VwUmVzdWx0W2dyb3VwXVthZ2cubmFtZV0gPSBnZXRJbml0aWFsQWdncmVnYXRlUmVzdWx0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpc0dyb3VwUmVzdWx0W2dyb3VwXS5jb3VudCsrO1xuXG4gICAgZm9yIChjb25zdCBhZ2cgb2YgYWdnR3JvdXAuYWdncmVnYXRlcykge1xuICAgICAgY29uc3QgZXhpc3RpbmdWYWx1ZXMgPSB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdW2FnZy5uYW1lXTtcbiAgICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF1bYWdnLm5hbWVdID0gYXBwbHlBZ2dyZWdhdGVSZXN1bHQoXG4gICAgICAgIGFnZywgZXhpc3RpbmdWYWx1ZXMsXG4gICAgICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF0uY291bnQsXG4gICAgICApO1xuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IGJ1aWxkSW5kZXggfSBmcm9tICcuL2J1aWxkSW5kZXgnO1xuaW1wb3J0IHsgbGlzdEl0ZW1zIH0gZnJvbSAnLi9saXN0SXRlbXMnO1xuaW1wb3J0IHsgYWdncmVnYXRlcyB9IGZyb20gJy4vYWdncmVnYXRlcyc7XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleEFwaSA9IGFwcCA9PiAoe1xuICBsaXN0SXRlbXM6IGxpc3RJdGVtcyhhcHApLFxuICBidWlsZEluZGV4OiBidWlsZEluZGV4KGFwcCksXG4gIGFnZ3JlZ2F0ZXM6IGFnZ3JlZ2F0ZXMoYXBwKSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRJbmRleEFwaTtcbiIsImltcG9ydCB7IGVhY2gsIGZpbmQgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgbWFwLCBtYXgsIGNvbnN0YW50IH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLCBqb2luS2V5LFxuICAkLCBpc05vdGhpbmcsIGlzU29tZXRoaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgaXNJbmRleCwgaXNSb290LCBpc1NpbmdsZVJlY29yZCwgaXNDb2xsZWN0aW9uUmVjb3JkLFxuICBpc1JlY29yZCwgaXNhZ2dyZWdhdGVHcm91cCxcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxufSBmcm9tICcuL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBhbGwgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZU5vZGVFcnJvcnMgPSB7XG4gIGluZGV4Q2Fubm90QmVQYXJlbnQ6ICdJbmRleCB0ZW1wbGF0ZSBjYW5ub3QgYmUgYSBwYXJlbnQnLFxuICBhbGxOb25Sb290Tm9kZXNNdXN0SGF2ZVBhcmVudDogJ09ubHkgdGhlIHJvb3Qgbm9kZSBtYXkgaGF2ZSBubyBwYXJlbnQnLFxuICBpbmRleFBhcmVudE11c3RCZVJlY29yZE9yUm9vdDogJ0FuIGluZGV4IG1heSBvbmx5IGhhdmUgYSByZWNvcmQgb3Igcm9vdCBhcyBhIHBhcmVudCcsXG4gIGFnZ3JlZ2F0ZVBhcmVudE11c3RCZUFuSW5kZXg6ICdhZ2dyZWdhdGVHcm91cCBwYXJlbnQgbXVzdCBiZSBhbiBpbmRleCcsXG59O1xuXG5jb25zdCBwYXRoUmVneE1ha2VyID0gbm9kZSA9PiAoKSA9PiBub2RlLm5vZGVLZXkoKS5yZXBsYWNlKC97aWR9L2csICdbYS16QS1aMC05Xy1dKycpO1xuXG5jb25zdCBub2RlS2V5TWFrZXIgPSBub2RlID0+ICgpID0+IHN3aXRjaENhc2UoXG5cbiAgW24gPT4gaXNSZWNvcmQobikgJiYgIWlzU2luZ2xlUmVjb3JkKG4pLFxuICAgIG4gPT4gam9pbktleShcbiAgICAgIG5vZGUucGFyZW50KCkubm9kZUtleSgpLFxuICAgICAgbm9kZS5jb2xsZWN0aW9uTmFtZSxcbiAgICAgIGAke24ubm9kZUlkfS17aWR9YCxcbiAgICApXSxcblxuICBbaXNSb290LFxuICAgIGNvbnN0YW50KCcvJyldLFxuXG4gIFtkZWZhdWx0Q2FzZSxcbiAgICBuID0+IGpvaW5LZXkobm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksIG4ubmFtZSldLFxuXG4pKG5vZGUpO1xuXG5cbmNvbnN0IHZhbGlkYXRlID0gcGFyZW50ID0+IChub2RlKSA9PiB7XG4gIGlmIChpc0luZGV4KG5vZGUpXG4gICAgICAgICYmIGlzU29tZXRoaW5nKHBhcmVudClcbiAgICAgICAgJiYgIWlzUm9vdChwYXJlbnQpXG4gICAgICAgICYmICFpc1JlY29yZChwYXJlbnQpKSB7XG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihjcmVhdGVOb2RlRXJyb3JzLmluZGV4UGFyZW50TXVzdEJlUmVjb3JkT3JSb290KTtcbiAgfVxuXG4gIGlmIChpc2FnZ3JlZ2F0ZUdyb3VwKG5vZGUpXG4gICAgICAgICYmIGlzU29tZXRoaW5nKHBhcmVudClcbiAgICAgICAgJiYgIWlzSW5kZXgocGFyZW50KSkge1xuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoY3JlYXRlTm9kZUVycm9ycy5hZ2dyZWdhdGVQYXJlbnRNdXN0QmVBbkluZGV4KTtcbiAgfVxuXG4gIGlmIChpc05vdGhpbmcocGFyZW50KSAmJiAhaXNSb290KG5vZGUpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoY3JlYXRlTm9kZUVycm9ycy5hbGxOb25Sb290Tm9kZXNNdXN0SGF2ZVBhcmVudCk7IH1cblxuICByZXR1cm4gbm9kZTtcbn07XG5cbmNvbnN0IGNvbnN0cnVjdCA9IHBhcmVudCA9PiAobm9kZSkgPT4ge1xuICBub2RlLm5vZGVLZXkgPSBub2RlS2V5TWFrZXIobm9kZSk7XG4gIG5vZGUucGF0aFJlZ3ggPSBwYXRoUmVneE1ha2VyKG5vZGUpO1xuICBub2RlLnBhcmVudCA9IGNvbnN0YW50KHBhcmVudCk7XG4gIG5vZGUuaXNSb290ID0gKCkgPT4gaXNOb3RoaW5nKHBhcmVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIG5vZGUubmFtZSA9PT0gJ3Jvb3QnXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBub2RlLnR5cGUgPT09ICdyb290JztcbiAgaWYgKGlzQ29sbGVjdGlvblJlY29yZChub2RlKSkge1xuICAgIG5vZGUuY29sbGVjdGlvbk5vZGVLZXkgPSAoKSA9PiBqb2luS2V5KFxuICAgICAgcGFyZW50Lm5vZGVLZXkoKSwgbm9kZS5jb2xsZWN0aW9uTmFtZSxcbiAgICApO1xuICAgIG5vZGUuY29sbGVjdGlvblBhdGhSZWd4ID0gKCkgPT4gam9pbktleShcbiAgICAgIHBhcmVudC5wYXRoUmVneCgpLCBub2RlLmNvbGxlY3Rpb25OYW1lLFxuICAgICk7XG4gIH1cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5jb25zdCBhZGRUb1BhcmVudCA9IChvYmopID0+IHtcbiAgY29uc3QgcGFyZW50ID0gb2JqLnBhcmVudCgpO1xuICBpZiAoaXNTb21ldGhpbmcocGFyZW50KSkge1xuICAgIGlmIChpc0luZGV4KG9iaikpXG4gICAgLy8gUTogd2h5IGFyZSBpbmRleGVzIG5vdCBjaGlsZHJlbiA/XG4gICAgLy8gQTogYmVjYXVzZSB0aGV5IGNhbm5vdCBoYXZlIGNoaWxkcmVuIG9mIHRoZWlyIG93bi5cbiAgICB7IFxuICAgICAgcGFyZW50LmluZGV4ZXMucHVzaChvYmopOyBcbiAgICB9IFxuICAgIGVsc2UgaWYgKGlzYWdncmVnYXRlR3JvdXAob2JqKSkgXG4gICAgeyBcbiAgICAgIHBhcmVudC5hZ2dyZWdhdGVHcm91cHMucHVzaChvYmopOyBcbiAgICB9IGVsc2UgeyBcbiAgICAgIHBhcmVudC5jaGlsZHJlbi5wdXNoKG9iaik7IFxuICAgIH1cblxuICAgIGlmIChpc1JlY29yZChvYmopKSB7XG4gICAgICBjb25zdCBkZWZhdWx0SW5kZXggPSBmaW5kKFxuICAgICAgICBwYXJlbnQuaW5kZXhlcyxcbiAgICAgICAgaSA9PiBpLm5hbWUgPT09IGAke3BhcmVudC5uYW1lfV9pbmRleGAsXG4gICAgICApO1xuICAgICAgaWYgKGRlZmF1bHRJbmRleCkge1xuICAgICAgICBkZWZhdWx0SW5kZXguYWxsb3dlZFJlY29yZE5vZGVJZHMucHVzaChvYmoubm9kZUlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9iajtcbn07XG5cbmV4cG9ydCBjb25zdCBjb25zdHJ1Y3ROb2RlID0gKHBhcmVudCwgb2JqKSA9PiAkKG9iaiwgW1xuICBjb25zdHJ1Y3QocGFyZW50KSxcbiAgdmFsaWRhdGUocGFyZW50KSxcbiAgYWRkVG9QYXJlbnQsXG5dKTtcblxuY29uc3QgZ2V0Tm9kZUlkID0gKHBhcmVudE5vZGUpID0+IHtcbiAgLy8gdGhpcyBjYXNlIGlzIGhhbmRsZWQgYmV0dGVyIGVsc2V3aGVyZVxuICBpZiAoIXBhcmVudE5vZGUpIHJldHVybiBudWxsO1xuICBjb25zdCBmaW5kUm9vdCA9IG4gPT4gKGlzUm9vdChuKSA/IG4gOiBmaW5kUm9vdChuLnBhcmVudCgpKSk7XG4gIGNvbnN0IHJvb3QgPSBmaW5kUm9vdChwYXJlbnROb2RlKTtcblxuICByZXR1cm4gKCQocm9vdCwgW1xuICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgICBtYXAobiA9PiBuLm5vZGVJZCksXG4gICAgbWF4XSkgKyAxKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjb25zdHJ1Y3RIaWVyYXJjaHkgPSAobm9kZSwgcGFyZW50KSA9PiB7XG4gIGNvbnN0cnVjdChwYXJlbnQpKG5vZGUpO1xuICBpZiAobm9kZS5pbmRleGVzKSB7XG4gICAgZWFjaChub2RlLmluZGV4ZXMsXG4gICAgICBjaGlsZCA9PiBjb25zdHJ1Y3RIaWVyYXJjaHkoY2hpbGQsIG5vZGUpKTtcbiAgfVxuICBpZiAobm9kZS5hZ2dyZWdhdGVHcm91cHMpIHtcbiAgICBlYWNoKG5vZGUuYWdncmVnYXRlR3JvdXBzLFxuICAgICAgY2hpbGQgPT4gY29uc3RydWN0SGllcmFyY2h5KGNoaWxkLCBub2RlKSk7XG4gIH1cbiAgaWYgKG5vZGUuY2hpbGRyZW4gJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgZWFjaChub2RlLmNoaWxkcmVuLFxuICAgICAgY2hpbGQgPT4gY29uc3RydWN0SGllcmFyY2h5KGNoaWxkLCBub2RlKSk7XG4gIH1cbiAgaWYgKG5vZGUuZmllbGRzKSB7XG4gICAgZWFjaChub2RlLmZpZWxkcyxcbiAgICAgIGYgPT4gZWFjaChmLnR5cGVPcHRpb25zLCAodmFsLCBrZXkpID0+IHtcbiAgICAgICAgY29uc3QgZGVmID0gYWxsW2YudHlwZV0ub3B0aW9uRGVmaW5pdGlvbnNba2V5XTtcbiAgICAgICAgaWYgKCFkZWYpIHtcbiAgICAgICAgICAvLyB1bmtub3duIHR5cGVPcHRpb25cbiAgICAgICAgICBkZWxldGUgZi50eXBlT3B0aW9uc1trZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGYudHlwZU9wdGlvbnNba2V5XSA9IGRlZi5wYXJzZSh2YWwpO1xuICAgICAgICB9XG4gICAgICB9KSk7XG4gIH1cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5cbmV4cG9ydCBjb25zdCBnZXROZXdSb290TGV2ZWwgPSAoKSA9PiBjb25zdHJ1Y3QoKSh7XG4gIG5hbWU6ICdyb290JyxcbiAgdHlwZTogJ3Jvb3QnLFxuICBjaGlsZHJlbjogW10sXG4gIHBhdGhNYXBzOiBbXSxcbiAgaW5kZXhlczogW10sXG4gIG5vZGVJZDogMCxcbn0pO1xuXG5jb25zdCBfZ2V0TmV3UmVjb3JkVGVtcGxhdGUgPSAocGFyZW50LCBuYW1lLCBjcmVhdGVEZWZhdWx0SW5kZXgsIGlzU2luZ2xlKSA9PiB7XG4gIGNvbnN0IG5vZGUgPSBjb25zdHJ1Y3ROb2RlKHBhcmVudCwge1xuICAgIG5hbWUsXG4gICAgdHlwZTogJ3JlY29yZCcsXG4gICAgZmllbGRzOiBbXSxcbiAgICBjaGlsZHJlbjogW10sXG4gICAgdmFsaWRhdGlvblJ1bGVzOiBbXSxcbiAgICBub2RlSWQ6IGdldE5vZGVJZChwYXJlbnQpLFxuICAgIGluZGV4ZXM6IFtdLFxuICAgIGFsbGlkc1NoYXJkRmFjdG9yOiBpc1JlY29yZChwYXJlbnQpID8gMSA6IDY0LFxuICAgIGNvbGxlY3Rpb25OYW1lOiAnJyxcbiAgICBpc1NpbmdsZSxcbiAgfSk7XG5cbiAgaWYgKGNyZWF0ZURlZmF1bHRJbmRleCkge1xuICAgIGNvbnN0IGRlZmF1bHRJbmRleCA9IGdldE5ld0luZGV4VGVtcGxhdGUocGFyZW50KTtcbiAgICBkZWZhdWx0SW5kZXgubmFtZSA9IGAke25hbWV9X2luZGV4YDtcbiAgICBkZWZhdWx0SW5kZXguYWxsb3dlZFJlY29yZE5vZGVJZHMucHVzaChub2RlLm5vZGVJZCk7XG4gIH1cblxuICByZXR1cm4gbm9kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXROZXdSZWNvcmRUZW1wbGF0ZSA9IChwYXJlbnQsIG5hbWUgPSAnJywgY3JlYXRlRGVmYXVsdEluZGV4ID0gdHJ1ZSkgPT4gX2dldE5ld1JlY29yZFRlbXBsYXRlKHBhcmVudCwgbmFtZSwgY3JlYXRlRGVmYXVsdEluZGV4LCBmYWxzZSk7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdTaW5nbGVSZWNvcmRUZW1wbGF0ZSA9IHBhcmVudCA9PiBfZ2V0TmV3UmVjb3JkVGVtcGxhdGUocGFyZW50LCAnJywgZmFsc2UsIHRydWUpO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3SW5kZXhUZW1wbGF0ZSA9IChwYXJlbnQsIHR5cGUgPSAnYW5jZXN0b3InKSA9PiBjb25zdHJ1Y3ROb2RlKHBhcmVudCwge1xuICBuYW1lOiAnJyxcbiAgdHlwZTogJ2luZGV4JyxcbiAgbWFwOiAncmV0dXJuIHsuLi5yZWNvcmR9OycsXG4gIGZpbHRlcjogJycsXG4gIGluZGV4VHlwZTogdHlwZSxcbiAgZ2V0U2hhcmROYW1lOiAnJyxcbiAgZ2V0U29ydEtleTogJ3JlY29yZC5pZCcsXG4gIGFnZ3JlZ2F0ZUdyb3VwczogW10sXG4gIGFsbG93ZWRSZWNvcmROb2RlSWRzOiBbXSxcbiAgbm9kZUlkOiBnZXROb2RlSWQocGFyZW50KSxcbn0pO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3QWdncmVnYXRlR3JvdXBUZW1wbGF0ZSA9IGluZGV4ID0+IGNvbnN0cnVjdE5vZGUoaW5kZXgsIHtcbiAgbmFtZTogJycsXG4gIHR5cGU6ICdhZ2dyZWdhdGVHcm91cCcsXG4gIGdyb3VwQnk6ICcnLFxuICBhZ2dyZWdhdGVzOiBbXSxcbiAgY29uZGl0aW9uOiAnJyxcbiAgbm9kZUlkOiBnZXROb2RlSWQoaW5kZXgpLFxufSk7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdBZ2dyZWdhdGVUZW1wbGF0ZSA9IChzZXQpID0+IHtcbiAgY29uc3QgYWdncmVnYXRlZFZhbHVlID0ge1xuICAgIG5hbWU6ICcnLFxuICAgIGFnZ3JlZ2F0ZWRWYWx1ZTogJycsXG4gIH07XG4gIHNldC5hZ2dyZWdhdGVzLnB1c2goYWdncmVnYXRlZFZhbHVlKTtcbiAgcmV0dXJuIGFnZ3JlZ2F0ZWRWYWx1ZTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZ2V0TmV3Um9vdExldmVsLFxuICBnZXROZXdSZWNvcmRUZW1wbGF0ZSxcbiAgZ2V0TmV3SW5kZXhUZW1wbGF0ZSxcbiAgY3JlYXRlTm9kZUVycm9ycyxcbiAgY29uc3RydWN0SGllcmFyY2h5LFxuICBnZXROZXdBZ2dyZWdhdGVHcm91cFRlbXBsYXRlLFxuICBnZXROZXdBZ2dyZWdhdGVUZW1wbGF0ZSxcbn07XG4iLCJpbXBvcnQge1xuICBzb21lLCBtYXAsIGZpbHRlciwga2V5cywgaW5jbHVkZXMsXG4gIGNvdW50QnksIGZsYXR0ZW4sXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBpc1NvbWV0aGluZywgJCxcbiAgaXNOb25FbXB0eVN0cmluZyxcbiAgaXNOb3RoaW5nT3JFbXB0eSxcbiAgaXNOb3RoaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgYWxsLCBnZXREZWZhdWx0T3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGFwcGx5UnVsZVNldCwgbWFrZXJ1bGUgfSBmcm9tICcuLi9jb21tb24vdmFsaWRhdGlvbkNvbW1vbic7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGZpZWxkRXJyb3JzID0ge1xuICBBZGRGaWVsZFZhbGlkYXRpb25GYWlsZWQ6ICdBZGQgZmllbGQgdmFsaWRhdGlvbjogJyxcbn07XG5cbmV4cG9ydCBjb25zdCBhbGxvd2VkVHlwZXMgPSAoKSA9PiBrZXlzKGFsbCk7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdGaWVsZCA9IHR5cGUgPT4gKHtcbiAgbmFtZTogJycsIC8vIGhvdyBmaWVsZCBpcyByZWZlcmVuY2VkIGludGVybmFsbHlcbiAgdHlwZSxcbiAgdHlwZU9wdGlvbnM6IGdldERlZmF1bHRPcHRpb25zKHR5cGUpLFxuICBsYWJlbDogJycsIC8vIGhvdyBmaWVsZCBpcyBkaXNwbGF5ZWRcbiAgZ2V0SW5pdGlhbFZhbHVlOiAnZGVmYXVsdCcsIC8vIGZ1bmN0aW9uIHRoYXQgZ2V0cyB2YWx1ZSB3aGVuIGluaXRpYWxseSBjcmVhdGVkXG4gIGdldFVuZGVmaW5lZFZhbHVlOiAnZGVmYXVsdCcsIC8vIGZ1bmN0aW9uIHRoYXQgZ2V0cyB2YWx1ZSB3aGVuIGZpZWxkIHVuZGVmaW5lZCBvbiByZWNvcmRcbn0pO1xuXG5jb25zdCBmaWVsZFJ1bGVzID0gYWxsRmllbGRzID0+IFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnZmllbGQgbmFtZSBpcyBub3Qgc2V0JyxcbiAgICBmID0+IGlzTm9uRW1wdHlTdHJpbmcoZi5uYW1lKSksXG4gIG1ha2VydWxlKCd0eXBlJywgJ2ZpZWxkIHR5cGUgaXMgbm90IHNldCcsXG4gICAgZiA9PiBpc05vbkVtcHR5U3RyaW5nKGYudHlwZSkpLFxuICBtYWtlcnVsZSgnbGFiZWwnLCAnZmllbGQgbGFiZWwgaXMgbm90IHNldCcsXG4gICAgZiA9PiBpc05vbkVtcHR5U3RyaW5nKGYubGFiZWwpKSxcbiAgbWFrZXJ1bGUoJ2dldEluaXRpYWxWYWx1ZScsICdnZXRJbml0aWFsVmFsdWUgZnVuY3Rpb24gaXMgbm90IHNldCcsXG4gICAgZiA9PiBpc05vbkVtcHR5U3RyaW5nKGYuZ2V0SW5pdGlhbFZhbHVlKSksXG4gIG1ha2VydWxlKCdnZXRVbmRlZmluZWRWYWx1ZScsICdnZXRVbmRlZmluZWRWYWx1ZSBmdW5jdGlvbiBpcyBub3Qgc2V0JyxcbiAgICBmID0+IGlzTm9uRW1wdHlTdHJpbmcoZi5nZXRVbmRlZmluZWRWYWx1ZSkpLFxuICBtYWtlcnVsZSgnbmFtZScsICdmaWVsZCBuYW1lIGlzIGR1cGxpY2F0ZWQnLFxuICAgIGYgPT4gaXNOb3RoaW5nT3JFbXB0eShmLm5hbWUpXG4gICAgICAgICAgICAgfHwgY291bnRCeSgnbmFtZScpKGFsbEZpZWxkcylbZi5uYW1lXSA9PT0gMSksXG4gIG1ha2VydWxlKCd0eXBlJywgJ3R5cGUgaXMgdW5rbm93bicsXG4gICAgZiA9PiBpc05vdGhpbmdPckVtcHR5KGYudHlwZSlcbiAgICAgICAgICAgICB8fCBzb21lKHQgPT4gZi50eXBlID09PSB0KShhbGxvd2VkVHlwZXMoKSkpLFxuXTtcblxuY29uc3QgdHlwZU9wdGlvbnNSdWxlcyA9IChmaWVsZCkgPT4ge1xuICBjb25zdCB0eXBlID0gYWxsW2ZpZWxkLnR5cGVdO1xuICBpZiAoaXNOb3RoaW5nKHR5cGUpKSByZXR1cm4gW107XG5cbiAgY29uc3QgZGVmID0gb3B0TmFtZSA9PiB0eXBlLm9wdGlvbkRlZmluaXRpb25zW29wdE5hbWVdO1xuXG4gIHJldHVybiAkKGZpZWxkLnR5cGVPcHRpb25zLCBbXG4gICAga2V5cyxcbiAgICBmaWx0ZXIobyA9PiBpc1NvbWV0aGluZyhkZWYobykpXG4gICAgICAgICAgICAgICAgICAgICYmIGlzU29tZXRoaW5nKGRlZihvKS5pc1ZhbGlkKSksXG4gICAgbWFwKG8gPT4gbWFrZXJ1bGUoXG4gICAgICBgdHlwZU9wdGlvbnMuJHtvfWAsXG4gICAgICBgJHtkZWYobykucmVxdWlyZW1lbnREZXNjcmlwdGlvbn1gLFxuICAgICAgZmllbGQgPT4gZGVmKG8pLmlzVmFsaWQoZmllbGQudHlwZU9wdGlvbnNbb10pLFxuICAgICkpLFxuICBdKTtcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUZpZWxkID0gYWxsRmllbGRzID0+IChmaWVsZCkgPT4ge1xuICBjb25zdCBldmVyeVNpbmdsZUZpZWxkID0gaW5jbHVkZXMoZmllbGQpKGFsbEZpZWxkcykgPyBhbGxGaWVsZHMgOiBbLi4uYWxsRmllbGRzLCBmaWVsZF07XG4gIHJldHVybiBhcHBseVJ1bGVTZXQoWy4uLmZpZWxkUnVsZXMoZXZlcnlTaW5nbGVGaWVsZCksIC4uLnR5cGVPcHRpb25zUnVsZXMoZmllbGQpXSkoZmllbGQpO1xufTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWxsRmllbGRzID0gcmVjb3JkTm9kZSA9PiAkKHJlY29yZE5vZGUuZmllbGRzLCBbXG4gIG1hcCh2YWxpZGF0ZUZpZWxkKHJlY29yZE5vZGUuZmllbGRzKSksXG4gIGZsYXR0ZW4sXG5dKTtcblxuZXhwb3J0IGNvbnN0IGFkZEZpZWxkID0gKHJlY29yZFRlbXBsYXRlLCBmaWVsZCkgPT4ge1xuICBpZiAoaXNOb3RoaW5nT3JFbXB0eShmaWVsZC5sYWJlbCkpIHtcbiAgICBmaWVsZC5sYWJlbCA9IGZpZWxkLm5hbWU7XG4gIH1cbiAgY29uc3QgdmFsaWRhdGlvbk1lc3NhZ2VzID0gdmFsaWRhdGVGaWVsZChbLi4ucmVjb3JkVGVtcGxhdGUuZmllbGRzLCBmaWVsZF0pKGZpZWxkKTtcbiAgaWYgKHZhbGlkYXRpb25NZXNzYWdlcy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgZXJyb3JzID0gbWFwKG0gPT4gbS5lcnJvcikodmFsaWRhdGlvbk1lc3NhZ2VzKTtcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGAke2ZpZWxkRXJyb3JzLkFkZEZpZWxkVmFsaWRhdGlvbkZhaWxlZH0gJHtlcnJvcnMuam9pbignLCAnKX1gKTtcbiAgfVxuICByZWNvcmRUZW1wbGF0ZS5maWVsZHMucHVzaChmaWVsZCk7XG59O1xuIiwiaW1wb3J0IHsgaXNOdW1iZXIsIGlzQm9vbGVhbiwgZGVmYXVsdENhc2UgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgc3dpdGNoQ2FzZSB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZSA9IChpbnZhbGlkRmllbGRzLFxuICBtZXNzYWdlV2hlbkludmFsaWQsXG4gIGV4cHJlc3Npb25XaGVuVmFsaWQpID0+ICh7XG4gIGludmFsaWRGaWVsZHMsIG1lc3NhZ2VXaGVuSW52YWxpZCwgZXhwcmVzc2lvbldoZW5WYWxpZCxcbn0pO1xuXG5jb25zdCBnZXRTdGF0aWNWYWx1ZSA9IHN3aXRjaENhc2UoXG4gIFtpc051bWJlciwgdiA9PiB2LnRvU3RyaW5nKCldLFxuICBbaXNCb29sZWFuLCB2ID0+IHYudG9TdHJpbmcoKV0sXG4gIFtkZWZhdWx0Q2FzZSwgdiA9PiBgJyR7dn0nYF0sXG4pO1xuXG5leHBvcnQgY29uc3QgY29tbW9uUmVjb3JkVmFsaWRhdGlvblJ1bGVzID0gKHtcblxuICBmaWVsZE5vdEVtcHR5OiBmaWVsZE5hbWUgPT4gZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUoXG4gICAgW2ZpZWxkTmFtZV0sXG4gICAgYCR7ZmllbGROYW1lfSBpcyBlbXB0eWAsXG4gICAgYCFfLmlzRW1wdHkocmVjb3JkWycke2ZpZWxkTmFtZX0nXSlgLFxuICApLFxuXG4gIGZpZWxkQmV0d2VlbjogKGZpZWxkTmFtZSwgbWluLCBtYXgpID0+IGdldE5ld1JlY29yZFZhbGlkYXRpb25SdWxlKFxuICAgIFtmaWVsZE5hbWVdLFxuICAgIGAke2ZpZWxkTmFtZX0gbXVzdCBiZSBiZXR3ZWVuICR7bWluLnRvU3RyaW5nKCl9IGFuZCAke21heC50b1N0cmluZygpfWAsXG4gICAgYHJlY29yZFsnJHtmaWVsZE5hbWV9J10gPj0gJHtnZXRTdGF0aWNWYWx1ZShtaW4pfSAmJiAgcmVjb3JkWycke2ZpZWxkTmFtZX0nXSA8PSAke2dldFN0YXRpY1ZhbHVlKG1heCl9IGAsXG4gICksXG5cbiAgZmllbGRHcmVhdGVyVGhhbjogKGZpZWxkTmFtZSwgbWluLCBtYXgpID0+IGdldE5ld1JlY29yZFZhbGlkYXRpb25SdWxlKFxuICAgIFtmaWVsZE5hbWVdLFxuICAgIGAke2ZpZWxkTmFtZX0gbXVzdCBiZSBncmVhdGVyIHRoYW4gJHttaW4udG9TdHJpbmcoKX0gYW5kICR7bWF4LnRvU3RyaW5nKCl9YCxcbiAgICBgcmVjb3JkWycke2ZpZWxkTmFtZX0nXSA+PSAke2dldFN0YXRpY1ZhbHVlKG1pbil9ICBgLFxuICApLFxufSk7XG5cbmV4cG9ydCBjb25zdCBhZGRSZWNvcmRWYWxpZGF0aW9uUnVsZSA9IHJlY29yZE5vZGUgPT4gcnVsZSA9PiByZWNvcmROb2RlLnZhbGlkYXRpb25SdWxlcy5wdXNoKHJ1bGUpO1xuIiwiXG5leHBvcnQgY29uc3QgY3JlYXRlVHJpZ2dlciA9ICgpID0+ICh7XG4gIGFjdGlvbk5hbWU6ICcnLFxuICBldmVudE5hbWU6ICcnLFxuICAvLyBmdW5jdGlvbiwgaGFzIGFjY2VzcyB0byBldmVudCBjb250ZXh0LFxuICAvLyByZXR1cm5zIG9iamVjdCB0aGF0IGlzIHVzZWQgYXMgcGFyYW1ldGVyIHRvIGFjdGlvblxuICAvLyBvbmx5IHVzZWQgaWYgdHJpZ2dlcmVkIGJ5IGV2ZW50XG4gIG9wdGlvbnNDcmVhdG9yOiAnJyxcbiAgLy8gYWN0aW9uIHJ1bnMgaWYgdHJ1ZSxcbiAgLy8gaGFzIGFjY2VzcyB0byBldmVudCBjb250ZXh0XG4gIGNvbmRpdGlvbjogJycsXG59KTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUFjdGlvbiA9ICgpID0+ICh7XG4gIG5hbWU6ICcnLFxuICBiZWhhdmlvdXJTb3VyY2U6ICcnLFxuICAvLyBuYW1lIG9mIGZ1bmN0aW9uIGluIGFjdGlvblNvdXJjZVxuICBiZWhhdmlvdXJOYW1lOiAnJyxcbiAgLy8gcGFyYW1ldGVyIHBhc3NlZCBpbnRvIGJlaGF2aW91ci5cbiAgLy8gYW55IG90aGVyIHBhcm1zIHBhc3NlZCBhdCBydW50aW1lIGUuZy5cbiAgLy8gYnkgdHJpZ2dlciwgb3IgbWFudWFsbHksIHdpbGwgYmUgbWVyZ2VkIGludG8gdGhpc1xuICBpbml0aWFsT3B0aW9uczoge30sXG59KTtcbiIsImltcG9ydCB7IGZsYXR0ZW4sIG1hcCwgaXNFbXB0eSB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCB7XG4gIGlzTm9uRW1wdHlTdHJpbmcsIFxuICBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24sICQsIFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSB9IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcblxuY29uc3QgYWdncmVnYXRlUnVsZXMgPSBbXG4gIG1ha2VydWxlKCduYW1lJywgJ2Nob29zZSBhIG5hbWUgZm9yIHRoZSBhZ2dyZWdhdGUnLFxuICAgIGEgPT4gaXNOb25FbXB0eVN0cmluZyhhLm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2FnZ3JlZ2F0ZWRWYWx1ZScsICdhZ2dyZWdhdGVkVmFsdWUgZG9lcyBub3QgY29tcGlsZScsXG4gICAgYSA9PiBpc0VtcHR5KGEuYWdncmVnYXRlZFZhbHVlKVxuICAgICAgICAgICAgfHwgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uKFxuICAgICAgICAgICAgICAoKSA9PiBjb21waWxlQ29kZShhLmFnZ3JlZ2F0ZWRWYWx1ZSksXG4gICAgICAgICAgICApKSxcbl07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFnZ3JlZ2F0ZSA9IGFnZ3JlZ2F0ZSA9PiBhcHBseVJ1bGVTZXQoYWdncmVnYXRlUnVsZXMpKGFnZ3JlZ2F0ZSk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFsbEFnZ3JlZ2F0ZXMgPSBhbGwgPT4gJChhbGwsIFtcbiAgbWFwKHZhbGlkYXRlQWdncmVnYXRlKSxcbiAgZmxhdHRlbixcbl0pO1xuIiwiaW1wb3J0IHtcbiAgZmlsdGVyLCB1bmlvbiwgY29uc3RhbnQsXG4gIG1hcCwgZmxhdHRlbiwgZXZlcnksIHVuaXFCeSxcbiAgc29tZSwgaW5jbHVkZXMsIGlzRW1wdHksIGhhc1xufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgY29tcGlsZUV4cHJlc3Npb24sIGNvbXBpbGVDb2RlIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xuaW1wb3J0IHtcbiAgJCwgaXNTb21ldGhpbmcsIHN3aXRjaENhc2UsXG4gIGFueVRydWUsIGlzTm9uRW1wdHlBcnJheSwgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uLFxuICBpc05vbkVtcHR5U3RyaW5nLCBkZWZhdWx0Q2FzZSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIGlzUmVjb3JkLCBpc1Jvb3QsIGlzYWdncmVnYXRlR3JvdXAsXG4gIGlzSW5kZXgsIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbn0gZnJvbSAnLi9oaWVyYXJjaHknO1xuaW1wb3J0IHsgZXZlbnRzTGlzdCB9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xuaW1wb3J0IHsgdmFsaWRhdGVBbGxGaWVsZHMgfSBmcm9tICcuL2ZpZWxkcyc7XG5pbXBvcnQge1xuICBhcHBseVJ1bGVTZXQsIG1ha2VydWxlLCBzdHJpbmdOb3RFbXB0eSxcbiAgdmFsaWRhdGlvbkVycm9yLFxufSBmcm9tICcuLi9jb21tb24vdmFsaWRhdGlvbkNvbW1vbic7XG5pbXBvcnQgeyBpbmRleFJ1bGVTZXQgfSBmcm9tICcuL2luZGV4ZXMnO1xuaW1wb3J0IHsgdmFsaWRhdGVBbGxBZ2dyZWdhdGVzIH0gZnJvbSAnLi92YWxpZGF0ZUFnZ3JlZ2F0ZSc7XG5cbmV4cG9ydCBjb25zdCBydWxlU2V0ID0gKC4uLnNldHMpID0+IGNvbnN0YW50KGZsYXR0ZW4oWy4uLnNldHNdKSk7XG5cbmNvbnN0IGNvbW1vblJ1bGVzID0gW1xuICBtYWtlcnVsZSgnbmFtZScsICdub2RlIG5hbWUgaXMgbm90IHNldCcsXG4gICAgbm9kZSA9PiBzdHJpbmdOb3RFbXB0eShub2RlLm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ3R5cGUnLCAnbm9kZSB0eXBlIG5vdCByZWNvZ25pc2VkJyxcbiAgICBhbnlUcnVlKGlzUmVjb3JkLCBpc1Jvb3QsIGlzSW5kZXgsIGlzYWdncmVnYXRlR3JvdXApKSxcbl07XG5cbmNvbnN0IHJlY29yZFJ1bGVzID0gW1xuICBtYWtlcnVsZSgnZmllbGRzJywgJ25vIGZpZWxkcyBoYXZlIGJlZW4gYWRkZWQgdG8gdGhlIHJlY29yZCcsXG4gICAgbm9kZSA9PiBpc05vbkVtcHR5QXJyYXkobm9kZS5maWVsZHMpKSxcbiAgbWFrZXJ1bGUoJ3ZhbGlkYXRpb25SdWxlcycsIFwidmFsaWRhdGlvbiBydWxlIGlzIG1pc3NpbmcgYSAnbWVzc2FnZVdoZW5WYWxpZCcgbWVtYmVyXCIsXG4gICAgbm9kZSA9PiBldmVyeShyID0+IGhhcygnbWVzc2FnZVdoZW5JbnZhbGlkJykocikpKG5vZGUudmFsaWRhdGlvblJ1bGVzKSksXG4gIG1ha2VydWxlKCd2YWxpZGF0aW9uUnVsZXMnLCBcInZhbGlkYXRpb24gcnVsZSBpcyBtaXNzaW5nIGEgJ2V4cHJlc3Npb25XaGVuVmFsaWQnIG1lbWJlclwiLFxuICAgIG5vZGUgPT4gZXZlcnkociA9PiBoYXMoJ2V4cHJlc3Npb25XaGVuVmFsaWQnKShyKSkobm9kZS52YWxpZGF0aW9uUnVsZXMpKSxcbl07XG5cblxuY29uc3QgYWdncmVnYXRlR3JvdXBSdWxlcyA9IFtcbiAgbWFrZXJ1bGUoJ2NvbmRpdGlvbicsICdjb25kaXRpb24gZG9lcyBub3QgY29tcGlsZScsXG4gICAgYSA9PiBpc0VtcHR5KGEuY29uZGl0aW9uKVxuICAgICAgICAgICAgIHx8IGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbihcbiAgICAgICAgICAgICAgICgpID0+IGNvbXBpbGVFeHByZXNzaW9uKGEuY29uZGl0aW9uKSxcbiAgICAgICAgICAgICApKSxcbl07XG5cbmNvbnN0IGdldFJ1bGVTZXQgPSBub2RlID0+IHN3aXRjaENhc2UoXG5cbiAgW2lzUmVjb3JkLCBydWxlU2V0KFxuICAgIGNvbW1vblJ1bGVzLFxuICAgIHJlY29yZFJ1bGVzLFxuICApXSxcblxuICBbaXNJbmRleCwgcnVsZVNldChcbiAgICBjb21tb25SdWxlcyxcbiAgICBpbmRleFJ1bGVTZXQsXG4gICldLFxuXG4gIFtpc2FnZ3JlZ2F0ZUdyb3VwLCBydWxlU2V0KFxuICAgIGNvbW1vblJ1bGVzLFxuICAgIGFnZ3JlZ2F0ZUdyb3VwUnVsZXMsXG4gICldLFxuXG4gIFtkZWZhdWx0Q2FzZSwgcnVsZVNldChjb21tb25SdWxlcywgW10pXSxcbikobm9kZSk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZU5vZGUgPSBub2RlID0+IGFwcGx5UnVsZVNldChnZXRSdWxlU2V0KG5vZGUpKShub2RlKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWxsID0gKGFwcEhpZXJhcmNoeSkgPT4ge1xuICBjb25zdCBmbGF0dGVuZWQgPSBnZXRGbGF0dGVuZWRIaWVyYXJjaHkoXG4gICAgYXBwSGllcmFyY2h5LFxuICApO1xuXG4gIGNvbnN0IGR1cGxpY2F0ZU5hbWVSdWxlID0gbWFrZXJ1bGUoXG4gICAgJ25hbWUnLCAnbm9kZSBuYW1lcyBtdXN0IGJlIHVuaXF1ZSB1bmRlciBzaGFyZWQgcGFyZW50JyxcbiAgICBuID0+IGZpbHRlcihmID0+IGYucGFyZW50KCkgPT09IG4ucGFyZW50KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgZi5uYW1lID09PSBuLm5hbWUpKGZsYXR0ZW5lZCkubGVuZ3RoID09PSAxLFxuICApO1xuXG4gIGNvbnN0IGR1cGxpY2F0ZU5vZGVLZXlFcnJvcnMgPSAkKGZsYXR0ZW5lZCwgW1xuICAgIG1hcChuID0+IGFwcGx5UnVsZVNldChbZHVwbGljYXRlTmFtZVJ1bGVdKShuKSksXG4gICAgZmlsdGVyKGlzU29tZXRoaW5nKSxcbiAgICBmbGF0dGVuLFxuICBdKTtcblxuICBjb25zdCBmaWVsZEVycm9ycyA9ICQoZmxhdHRlbmVkLCBbXG4gICAgZmlsdGVyKGlzUmVjb3JkKSxcbiAgICBtYXAodmFsaWRhdGVBbGxGaWVsZHMpLFxuICAgIGZsYXR0ZW4sXG4gIF0pO1xuXG4gIGNvbnN0IGFnZ3JlZ2F0ZUVycm9ycyA9ICQoZmxhdHRlbmVkLCBbXG4gICAgZmlsdGVyKGlzYWdncmVnYXRlR3JvdXApLFxuICAgIG1hcChzID0+IHZhbGlkYXRlQWxsQWdncmVnYXRlcyhcbiAgICAgIHMuYWdncmVnYXRlcyxcbiAgICApKSxcbiAgICBmbGF0dGVuLFxuICBdKTtcblxuICByZXR1cm4gJChmbGF0dGVuZWQsIFtcbiAgICBtYXAodmFsaWRhdGVOb2RlKSxcbiAgICBmbGF0dGVuLFxuICAgIHVuaW9uKGR1cGxpY2F0ZU5vZGVLZXlFcnJvcnMpLFxuICAgIHVuaW9uKGZpZWxkRXJyb3JzKSxcbiAgICB1bmlvbihhZ2dyZWdhdGVFcnJvcnMpLFxuICBdKTtcbn07XG5cbmNvbnN0IGFjdGlvblJ1bGVzID0gW1xuICBtYWtlcnVsZSgnbmFtZScsICdhY3Rpb24gbXVzdCBoYXZlIGEgbmFtZScsXG4gICAgYSA9PiBpc05vbkVtcHR5U3RyaW5nKGEubmFtZSkpLFxuICBtYWtlcnVsZSgnYmVoYXZpb3VyTmFtZScsICdtdXN0IHN1cHBseSBhIGJlaGF2aW91ciBuYW1lIHRvIHRoZSBhY3Rpb24nLFxuICAgIGEgPT4gaXNOb25FbXB0eVN0cmluZyhhLmJlaGF2aW91ck5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2JlaGF2aW91clNvdXJjZScsICdtdXN0IHN1cHBseSBhIGJlaGF2aW91ciBzb3VyY2UgZm9yIHRoZSBhY3Rpb24nLFxuICAgIGEgPT4gaXNOb25FbXB0eVN0cmluZyhhLmJlaGF2aW91clNvdXJjZSkpLFxuXTtcblxuY29uc3QgZHVwbGljYXRlQWN0aW9uUnVsZSA9IG1ha2VydWxlKCcnLCAnYWN0aW9uIG5hbWUgbXVzdCBiZSB1bmlxdWUnLCAoKSA9PiB7fSk7XG5cbmNvbnN0IHZhbGlkYXRlQWN0aW9uID0gYWN0aW9uID0+IGFwcGx5UnVsZVNldChhY3Rpb25SdWxlcykoYWN0aW9uKTtcblxuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBY3Rpb25zID0gKGFsbEFjdGlvbnMpID0+IHtcbiAgY29uc3QgZHVwbGljYXRlQWN0aW9ucyA9ICQoYWxsQWN0aW9ucywgW1xuICAgIGZpbHRlcihhID0+IGZpbHRlcihhMiA9PiBhMi5uYW1lID09PSBhLm5hbWUpKGFsbEFjdGlvbnMpLmxlbmd0aCA+IDEpLFxuICAgIG1hcChhID0+IHZhbGlkYXRpb25FcnJvcihkdXBsaWNhdGVBY3Rpb25SdWxlLCBhKSksXG4gIF0pO1xuXG4gIGNvbnN0IGVycm9ycyA9ICQoYWxsQWN0aW9ucywgW1xuICAgIG1hcCh2YWxpZGF0ZUFjdGlvbiksXG4gICAgZmxhdHRlbixcbiAgICB1bmlvbihkdXBsaWNhdGVBY3Rpb25zKSxcbiAgICB1bmlxQnkoJ25hbWUnKSxcbiAgXSk7XG5cbiAgcmV0dXJuIGVycm9ycztcbn07XG5cbmNvbnN0IHRyaWdnZXJSdWxlcyA9IGFjdGlvbnMgPT4gKFtcbiAgbWFrZXJ1bGUoJ2FjdGlvbk5hbWUnLCAnbXVzdCBzcGVjaWZ5IGFuIGFjdGlvbicsXG4gICAgdCA9PiBpc05vbkVtcHR5U3RyaW5nKHQuYWN0aW9uTmFtZSkpLFxuICBtYWtlcnVsZSgnZXZlbnROYW1lJywgJ211c3Qgc3BlY2lmeSBhbmQgZXZlbnQnLFxuICAgIHQgPT4gaXNOb25FbXB0eVN0cmluZyh0LmV2ZW50TmFtZSkpLFxuICBtYWtlcnVsZSgnYWN0aW9uTmFtZScsICdzcGVjaWZpZWQgYWN0aW9uIG5vdCBzdXBwbGllZCcsXG4gICAgdCA9PiAhdC5hY3Rpb25OYW1lXG4gICAgICAgICAgICAgfHwgc29tZShhID0+IGEubmFtZSA9PT0gdC5hY3Rpb25OYW1lKShhY3Rpb25zKSksXG4gIG1ha2VydWxlKCdldmVudE5hbWUnLCAnaW52YWxpZCBFdmVudCBOYW1lJyxcbiAgICB0ID0+ICF0LmV2ZW50TmFtZVxuICAgICAgICAgICAgIHx8IGluY2x1ZGVzKHQuZXZlbnROYW1lKShldmVudHNMaXN0KSksXG4gIG1ha2VydWxlKCdvcHRpb25zQ3JlYXRvcicsICdPcHRpb25zIENyZWF0b3IgZG9lcyBub3QgY29tcGlsZSAtIGNoZWNrIHlvdXIgZXhwcmVzc2lvbicsXG4gICAgKHQpID0+IHtcbiAgICAgIGlmICghdC5vcHRpb25zQ3JlYXRvcikgcmV0dXJuIHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICBjb21waWxlQ29kZSh0Lm9wdGlvbnNDcmVhdG9yKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGNhdGNoIChfKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIH0pLFxuICBtYWtlcnVsZSgnY29uZGl0aW9uJywgJ1RyaWdnZXIgY29uZGl0aW9uIGRvZXMgbm90IGNvbXBpbGUgLSBjaGVjayB5b3VyIGV4cHJlc3Npb24nLFxuICAgICh0KSA9PiB7XG4gICAgICBpZiAoIXQuY29uZGl0aW9uKSByZXR1cm4gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbXBpbGVFeHByZXNzaW9uKHQuY29uZGl0aW9uKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGNhdGNoIChfKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIH0pLFxuXSk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVRyaWdnZXIgPSAodHJpZ2dlciwgYWxsQWN0aW9ucykgPT4ge1xuICBjb25zdCBlcnJvcnMgPSBhcHBseVJ1bGVTZXQodHJpZ2dlclJ1bGVzKGFsbEFjdGlvbnMpKSh0cmlnZ2VyKTtcblxuICByZXR1cm4gZXJyb3JzO1xufTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVHJpZ2dlcnMgPSAodHJpZ2dlcnMsIGFsbEFjdGlvbnMpID0+ICQodHJpZ2dlcnMsIFtcbiAgbWFwKHQgPT4gdmFsaWRhdGVUcmlnZ2VyKHQsIGFsbEFjdGlvbnMpKSxcbiAgZmxhdHRlbixcbl0pO1xuIiwiaW1wb3J0IHsgYXBwRGVmaW5pdGlvbkZpbGUgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgY29uc3RydWN0SGllcmFyY2h5IH0gZnJvbSAnLi9jcmVhdGVOb2Rlcyc7XG5cbmV4cG9ydCBjb25zdCBnZXRBcHBsaWNhdGlvbkRlZmluaXRpb24gPSBkYXRhc3RvcmUgPT4gYXN5bmMgKCkgPT4ge1xuICBjb25zdCBleGlzdHMgPSBhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGFwcERlZmluaXRpb25GaWxlKTtcblxuICBpZiAoIWV4aXN0cykgdGhyb3cgbmV3IEVycm9yKCdBcHBsaWNhdGlvbiBkZWZpbml0aW9uIGRvZXMgbm90IGV4aXN0Jyk7XG5cbiAgY29uc3QgYXBwRGVmaW5pdGlvbiA9IGF3YWl0IGRhdGFzdG9yZS5sb2FkSnNvbihhcHBEZWZpbml0aW9uRmlsZSk7XG4gIGFwcERlZmluaXRpb24uaGllcmFyY2h5ID0gY29uc3RydWN0SGllcmFyY2h5KFxuICAgIGFwcERlZmluaXRpb24uaGllcmFyY2h5LFxuICApO1xuICByZXR1cm4gYXBwRGVmaW5pdGlvbjtcbn07XG4iLCJpbXBvcnQgeyBqb2luIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IGFwcERlZmluaXRpb25GaWxlIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHZhbGlkYXRlQWxsIH0gZnJvbSAnLi92YWxpZGF0ZSc7XG5pbXBvcnQgeyBhcGlXcmFwcGVyIH0gZnJvbSAnLi4vY29tbW9uL2FwaVdyYXBwZXInO1xuaW1wb3J0IHsgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uL2V2ZW50cyc7XG5cbmV4cG9ydCBjb25zdCBzYXZlQXBwbGljYXRpb25IaWVyYXJjaHkgPSBhcHAgPT4gYXN5bmMgaGllcmFyY2h5ID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLnRlbXBsYXRlQXBpLnNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSxcbiAgcGVybWlzc2lvbi53cml0ZVRlbXBsYXRlcy5pc0F1dGhvcml6ZWQsXG4gIHsgaGllcmFyY2h5IH0sXG4gIF9zYXZlQXBwbGljYXRpb25IaWVyYXJjaHksIGFwcC5kYXRhc3RvcmUsIGhpZXJhcmNoeSxcbik7XG5cblxuZXhwb3J0IGNvbnN0IF9zYXZlQXBwbGljYXRpb25IaWVyYXJjaHkgPSBhc3luYyAoZGF0YXN0b3JlLCBoaWVyYXJjaHkpID0+IHtcbiAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IGF3YWl0IHZhbGlkYXRlQWxsKGhpZXJhcmNoeSk7XG4gIGlmICh2YWxpZGF0aW9uRXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEhpZXJhcmNoeSBpcyBpbnZhbGlkOiAke2pvaW4oXG4gICAgICB2YWxpZGF0aW9uRXJyb3JzLm1hcChlID0+IGAke2UuaXRlbS5ub2RlS2V5ID8gZS5pdGVtLm5vZGVLZXkoKSA6ICcnfSA6ICR7ZS5lcnJvcn1gKSxcbiAgICAgICcsJyxcbiAgICApfWApO1xuICB9XG5cbiAgaWYgKGF3YWl0IGRhdGFzdG9yZS5leGlzdHMoYXBwRGVmaW5pdGlvbkZpbGUpKSB7XG4gICAgY29uc3QgYXBwRGVmaW5pdGlvbiA9IGF3YWl0IGRhdGFzdG9yZS5sb2FkSnNvbihhcHBEZWZpbml0aW9uRmlsZSk7XG4gICAgYXBwRGVmaW5pdGlvbi5oaWVyYXJjaHkgPSBoaWVyYXJjaHk7XG4gICAgYXdhaXQgZGF0YXN0b3JlLnVwZGF0ZUpzb24oYXBwRGVmaW5pdGlvbkZpbGUsIGFwcERlZmluaXRpb24pO1xuICB9IGVsc2Uge1xuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoJy8uY29uZmlnJyk7XG4gICAgY29uc3QgYXBwRGVmaW5pdGlvbiA9IHsgYWN0aW9uczogW10sIHRyaWdnZXJzOiBbXSwgaGllcmFyY2h5IH07XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oYXBwRGVmaW5pdGlvbkZpbGUsIGFwcERlZmluaXRpb24pO1xuICB9XG59O1xuIiwiaW1wb3J0IHsgam9pbiB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgYXBwRGVmaW5pdGlvbkZpbGUgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgdmFsaWRhdGVUcmlnZ2VycywgdmFsaWRhdGVBY3Rpb25zIH0gZnJvbSAnLi92YWxpZGF0ZSc7XG5pbXBvcnQgeyBhcGlXcmFwcGVyIH0gZnJvbSAnLi4vY29tbW9uL2FwaVdyYXBwZXInO1xuaW1wb3J0IHsgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uL2V2ZW50cyc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnMgPSBhcHAgPT4gYXN5bmMgKGFjdGlvbnMsIHRyaWdnZXJzKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy50ZW1wbGF0ZUFwaS5zYXZlQWN0aW9uc0FuZFRyaWdnZXJzLFxuICBwZXJtaXNzaW9uLndyaXRlVGVtcGxhdGVzLmlzQXV0aG9yaXplZCxcbiAgeyBhY3Rpb25zLCB0cmlnZ2VycyB9LFxuICBfc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycywgYXBwLmRhdGFzdG9yZSwgYWN0aW9ucywgdHJpZ2dlcnMsXG4pO1xuXG5leHBvcnQgY29uc3QgX3NhdmVBY3Rpb25zQW5kVHJpZ2dlcnMgPSBhc3luYyAoZGF0YXN0b3JlLCBhY3Rpb25zLCB0cmlnZ2VycykgPT4ge1xuICBpZiAoYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhhcHBEZWZpbml0aW9uRmlsZSkpIHtcbiAgICBjb25zdCBhcHBEZWZpbml0aW9uID0gYXdhaXQgZGF0YXN0b3JlLmxvYWRKc29uKGFwcERlZmluaXRpb25GaWxlKTtcbiAgICBhcHBEZWZpbml0aW9uLmFjdGlvbnMgPSBhY3Rpb25zO1xuICAgIGFwcERlZmluaXRpb24udHJpZ2dlcnMgPSB0cmlnZ2VycztcblxuICAgIGNvbnN0IGFjdGlvblZhbGlkRXJycyA9IG1hcChlID0+IGUuZXJyb3IpKHZhbGlkYXRlQWN0aW9ucyhhY3Rpb25zKSk7XG5cbiAgICBpZiAoYWN0aW9uVmFsaWRFcnJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYEFjdGlvbnMgYXJlIGludmFsaWQ6ICR7am9pbihhY3Rpb25WYWxpZEVycnMsICcsICcpfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHRyaWdnZXJWYWxpZEVycnMgPSBtYXAoZSA9PiBlLmVycm9yKSh2YWxpZGF0ZVRyaWdnZXJzKHRyaWdnZXJzLCBhY3Rpb25zKSk7XG5cbiAgICBpZiAodHJpZ2dlclZhbGlkRXJycy5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBUcmlnZ2VycyBhcmUgaW52YWxpZDogJHtqb2luKHRyaWdnZXJWYWxpZEVycnMsICcsICcpfWApO1xuICAgIH1cblxuICAgIGF3YWl0IGRhdGFzdG9yZS51cGRhdGVKc29uKGFwcERlZmluaXRpb25GaWxlLCBhcHBEZWZpbml0aW9uKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdDYW5ub3Qgc2F2ZSBhY3Rpb25zOiBBcHBsaWNhdGlvbiBkZWZpbml0aW9uIGRvZXMgbm90IGV4aXN0Jyk7XG4gIH1cbn07XG4iLCJcbmV4cG9ydCBjb25zdCBnZXRCZWhhdmlvdXJTb3VyY2VzID0gYXN5bmMgKGRhdGFzdG9yZSkgPT4ge1xuICAgIGF3YWl0IGRhdGFzdG9yZS5sb2FkRmlsZSgnLy5jb25maWcvYmVoYXZpb3VyU291cmNlcy5qcycpO1xufTtcbiIsImltcG9ydCB7XG4gIGdldE5ld1Jvb3RMZXZlbCxcbiAgZ2V0TmV3UmVjb3JkVGVtcGxhdGUsIGdldE5ld0luZGV4VGVtcGxhdGUsXG4gIGNyZWF0ZU5vZGVFcnJvcnMsIGNvbnN0cnVjdEhpZXJhcmNoeSxcbiAgZ2V0TmV3QWdncmVnYXRlR3JvdXBUZW1wbGF0ZSwgZ2V0TmV3U2luZ2xlUmVjb3JkVGVtcGxhdGUsXG4gIGdldE5ld0FnZ3JlZ2F0ZVRlbXBsYXRlLCBjb25zdHJ1Y3ROb2RlLFxufVxuICBmcm9tICcuL2NyZWF0ZU5vZGVzJztcbmltcG9ydCB7XG4gIGdldE5ld0ZpZWxkLCB2YWxpZGF0ZUZpZWxkLFxuICBhZGRGaWVsZCwgZmllbGRFcnJvcnMsXG59IGZyb20gJy4vZmllbGRzJztcbmltcG9ydCB7XG4gIGdldE5ld1JlY29yZFZhbGlkYXRpb25SdWxlLCBjb21tb25SZWNvcmRWYWxpZGF0aW9uUnVsZXMsXG4gIGFkZFJlY29yZFZhbGlkYXRpb25SdWxlLFxufSBmcm9tICcuL3JlY29yZFZhbGlkYXRpb25SdWxlcyc7XG5pbXBvcnQgeyBjcmVhdGVBY3Rpb24sIGNyZWF0ZVRyaWdnZXIgfSBmcm9tICcuL2NyZWF0ZUFjdGlvbnMnO1xuaW1wb3J0IHtcbiAgdmFsaWRhdGVUcmlnZ2VycywgdmFsaWRhdGVUcmlnZ2VyLCB2YWxpZGF0ZU5vZGUsXG4gIHZhbGlkYXRlQWN0aW9ucywgdmFsaWRhdGVBbGwsXG59IGZyb20gJy4vdmFsaWRhdGUnO1xuaW1wb3J0IHsgZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uIH0gZnJvbSAnLi9nZXRBcHBsaWNhdGlvbkRlZmluaXRpb24nO1xuaW1wb3J0IHsgc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5IH0gZnJvbSAnLi9zYXZlQXBwbGljYXRpb25IaWVyYXJjaHknO1xuaW1wb3J0IHsgc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycyB9IGZyb20gJy4vc2F2ZUFjdGlvbnNBbmRUcmlnZ2Vycyc7XG5pbXBvcnQgeyBhbGwgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBnZXRCZWhhdmlvdXJTb3VyY2VzIH0gZnJvbSBcIi4vZ2V0QmVoYXZpb3VyU291cmNlc1wiO1xuXG5jb25zdCBhcGkgPSBhcHAgPT4gKHtcblxuICBnZXRBcHBsaWNhdGlvbkRlZmluaXRpb246IGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbihhcHAuZGF0YXN0b3JlKSxcbiAgc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5OiBzYXZlQXBwbGljYXRpb25IaWVyYXJjaHkoYXBwKSxcbiAgc2F2ZUFjdGlvbnNBbmRUcmlnZ2Vyczogc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycyhhcHApLFxuICBnZXRCZWhhdmlvdXJTb3VyY2VzOiAoKSA9PiBnZXRCZWhhdmlvdXJTb3VyY2VzKGFwcC5kYXRhc3RvcmUpLFxuICBnZXROZXdSb290TGV2ZWwsXG4gIGNvbnN0cnVjdE5vZGUsXG4gIGdldE5ld0luZGV4VGVtcGxhdGUsXG4gIGdldE5ld1JlY29yZFRlbXBsYXRlLFxuICBnZXROZXdGaWVsZCxcbiAgdmFsaWRhdGVGaWVsZCxcbiAgYWRkRmllbGQsXG4gIGZpZWxkRXJyb3JzLFxuICBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZSxcbiAgY29tbW9uUmVjb3JkVmFsaWRhdGlvblJ1bGVzLFxuICBhZGRSZWNvcmRWYWxpZGF0aW9uUnVsZSxcbiAgY3JlYXRlQWN0aW9uLFxuICBjcmVhdGVUcmlnZ2VyLFxuICB2YWxpZGF0ZUFjdGlvbnMsXG4gIHZhbGlkYXRlVHJpZ2dlcixcbiAgZ2V0TmV3QWdncmVnYXRlR3JvdXBUZW1wbGF0ZSxcbiAgZ2V0TmV3QWdncmVnYXRlVGVtcGxhdGUsXG4gIGNvbnN0cnVjdEhpZXJhcmNoeSxcbiAgZ2V0TmV3U2luZ2xlUmVjb3JkVGVtcGxhdGUsXG4gIGFsbFR5cGVzOiBhbGwsXG4gIHZhbGlkYXRlTm9kZSxcbiAgdmFsaWRhdGVBbGwsXG4gIHZhbGlkYXRlVHJpZ2dlcnMsXG59KTtcblxuXG5leHBvcnQgY29uc3QgZ2V0VGVtcGxhdGVBcGkgPSBhcHAgPT4gYXBpKGFwcCk7XG5cbmV4cG9ydCBjb25zdCBlcnJvcnMgPSBjcmVhdGVOb2RlRXJyb3JzO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRUZW1wbGF0ZUFwaTtcbiIsImltcG9ydCB7IG1hcCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBVU0VSU19MSVNUX0ZJTEUsXG4gIHN0cmlwVXNlck9mU2Vuc2l0aXZlU3R1ZmYsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyAkLCBhcGlXcmFwcGVyLCBldmVudHMgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZ2V0VXNlcnMgPSBhcHAgPT4gYXN5bmMgKCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5nZXRVc2VycyxcbiAgcGVybWlzc2lvbi5saXN0VXNlcnMuaXNBdXRob3JpemVkLFxuICB7fSxcbiAgX2dldFVzZXJzLCBhcHAsXG4pO1xuXG5leHBvcnQgY29uc3QgX2dldFVzZXJzID0gYXN5bmMgYXBwID0+ICQoYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihVU0VSU19MSVNUX0ZJTEUpLCBbXG4gIG1hcChzdHJpcFVzZXJPZlNlbnNpdGl2ZVN0dWZmKSxcbl0pO1xuIiwiaW1wb3J0IHsgQUNDRVNTX0xFVkVMU19GSUxFIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7IGFwaVdyYXBwZXIsIGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBsb2FkQWNjZXNzTGV2ZWxzID0gYXBwID0+IGFzeW5jICgpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkubG9hZEFjY2Vzc0xldmVscyxcbiAgcGVybWlzc2lvbi5saXN0QWNjZXNzTGV2ZWxzLmlzQXV0aG9yaXplZCxcbiAge30sXG4gIF9sb2FkQWNjZXNzTGV2ZWxzLCBhcHAsXG4pO1xuXG5leHBvcnQgY29uc3QgX2xvYWRBY2Nlc3NMZXZlbHMgPSBhc3luYyBhcHAgPT4gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihBQ0NFU1NfTEVWRUxTX0ZJTEUpO1xuIiwiaW1wb3J0IHtcbiAgZmluZCwgZmlsdGVyLCBzb21lLFxuICBtYXAsIGZsYXR0ZW4sXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHsgX2dldFVzZXJzIH0gZnJvbSAnLi9nZXRVc2Vycyc7XG5pbXBvcnQge1xuICBnZXRVc2VyQnlOYW1lLCB1c2VyQXV0aEZpbGUsXG4gIHBhcnNlVGVtcG9yYXJ5Q29kZSxcbn0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7IF9sb2FkQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi9sb2FkQWNjZXNzTGV2ZWxzJztcbmltcG9ydCB7XG4gIGlzTm90aGluZ09yRW1wdHksICQsIGFwaVdyYXBwZXIsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGFsd2F5c0F1dGhvcml6ZWQgfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuY29uc3QgZHVtbXlIYXNoID0gJyRhcmdvbjJpJHY9MTkkbT00MDk2LHQ9MyxwPTEkVVpSbzQwOVVZQkdqSEpTM0NWNlV4dyRyVTg0cVVxUGVPUkZ6S1ltWVkwY2VCTERhUE8rSldTSDRQZk5pS1hmSUtrJztcblxuZXhwb3J0IGNvbnN0IGF1dGhlbnRpY2F0ZSA9IGFwcCA9PiBhc3luYyAodXNlcm5hbWUsIHBhc3N3b3JkKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmF1dGhlbnRpY2F0ZSxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyB1c2VybmFtZSwgcGFzc3dvcmQgfSxcbiAgX2F1dGhlbnRpY2F0ZSwgYXBwLCB1c2VybmFtZSwgcGFzc3dvcmQsXG4pO1xuXG5leHBvcnQgY29uc3QgX2F1dGhlbnRpY2F0ZSA9IGFzeW5jIChhcHAsIHVzZXJuYW1lLCBwYXNzd29yZCkgPT4ge1xuICBpZiAoaXNOb3RoaW5nT3JFbXB0eSh1c2VybmFtZSkgfHwgaXNOb3RoaW5nT3JFbXB0eShwYXNzd29yZCkpIHsgcmV0dXJuIG51bGw7IH1cblxuICBjb25zdCBhbGxVc2VycyA9IGF3YWl0IF9nZXRVc2VycyhhcHApO1xuICBsZXQgdXNlciA9IGdldFVzZXJCeU5hbWUoXG4gICAgYWxsVXNlcnMsXG4gICAgdXNlcm5hbWUsXG4gICk7XG5cbiAgY29uc3Qgbm90QVVzZXIgPSAnbm90LWEtdXNlcic7XG4gIC8vIGNvbnRpbnVlIHdpdGggbm9uLXVzZXIgLSBzbyB0aW1lIHRvIHZlcmlmeSByZW1haW5zIGNvbnNpc3RlbnRcbiAgLy8gd2l0aCB2ZXJpZmljYXRpb24gb2YgYSB2YWxpZCB1c2VyXG4gIGlmICghdXNlciB8fCAhdXNlci5lbmFibGVkKSB7IHVzZXIgPSBub3RBVXNlcjsgfVxuXG4gIGxldCB1c2VyQXV0aDtcbiAgdHJ5IHtcbiAgICB1c2VyQXV0aCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgICB1c2VyQXV0aEZpbGUodXNlcm5hbWUpLFxuICAgICk7XG4gIH0gY2F0Y2ggKF8pIHtcbiAgICB1c2VyQXV0aCA9IHsgYWNjZXNzTGV2ZWxzOiBbXSwgcGFzc3dvcmRIYXNoOiBkdW1teUhhc2ggfTtcbiAgfVxuXG4gIGNvbnN0IHBlcm1pc3Npb25zID0gYXdhaXQgYnVpbGRVc2VyUGVybWlzc2lvbnMoYXBwLCB1c2VyLmFjY2Vzc0xldmVscyk7XG5cbiAgY29uc3QgdmVyaWZpZWQgPSBhd2FpdCBhcHAuY3J5cHRvLnZlcmlmeShcbiAgICB1c2VyQXV0aC5wYXNzd29yZEhhc2gsXG4gICAgcGFzc3dvcmQsXG4gICk7XG5cbiAgaWYgKHVzZXIgPT09IG5vdEFVc2VyKSB7IHJldHVybiBudWxsOyB9XG5cbiAgcmV0dXJuIHZlcmlmaWVkXG4gICAgPyB7XG4gICAgICAuLi51c2VyLCBwZXJtaXNzaW9ucywgdGVtcDogZmFsc2UsIGlzVXNlcjogdHJ1ZSxcbiAgICB9XG4gICAgOiBudWxsO1xufTtcblxuZXhwb3J0IGNvbnN0IGF1dGhlbnRpY2F0ZVRlbXBvcmFyeUFjY2VzcyA9IGFwcCA9PiBhc3luYyAodGVtcEFjY2Vzc0NvZGUpID0+IHtcbiAgaWYgKGlzTm90aGluZ09yRW1wdHkodGVtcEFjY2Vzc0NvZGUpKSB7IHJldHVybiBudWxsOyB9XG5cbiAgY29uc3QgdGVtcCA9IHBhcnNlVGVtcG9yYXJ5Q29kZSh0ZW1wQWNjZXNzQ29kZSk7XG4gIGxldCB1c2VyID0gJChhd2FpdCBfZ2V0VXNlcnMoYXBwKSwgW1xuICAgIGZpbmQodSA9PiB1LnRlbXBvcmFyeUFjY2Vzc0lkID09PSB0ZW1wLmlkKSxcbiAgXSk7XG5cbiAgY29uc3Qgbm90QVVzZXIgPSAnbm90LWEtdXNlcic7XG4gIGlmICghdXNlciB8fCAhdXNlci5lbmFibGVkKSB7IHVzZXIgPSBub3RBVXNlcjsgfVxuXG4gIGxldCB1c2VyQXV0aDtcbiAgdHJ5IHtcbiAgICB1c2VyQXV0aCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgICB1c2VyQXV0aEZpbGUodXNlci5uYW1lKSxcbiAgICApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdXNlckF1dGggPSB7XG4gICAgICB0ZW1wb3JhcnlBY2Nlc3NIYXNoOiBkdW1teUhhc2gsXG4gICAgICB0ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaDogKGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKSArIDEwMDAwKSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKHVzZXJBdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoIDwgYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpKSB7IHVzZXIgPSBub3RBVXNlcjsgfVxuXG4gIGNvbnN0IHRlbXBDb2RlID0gIXRlbXAuY29kZSA/IGdlbmVyYXRlKCkgOiB0ZW1wLmNvZGU7XG4gIGNvbnN0IHZlcmlmaWVkID0gYXdhaXQgYXBwLmNyeXB0by52ZXJpZnkoXG4gICAgdXNlckF1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaCxcbiAgICB0ZW1wQ29kZSxcbiAgKTtcblxuICBpZiAodXNlciA9PT0gbm90QVVzZXIpIHsgcmV0dXJuIG51bGw7IH1cblxuICByZXR1cm4gdmVyaWZpZWRcbiAgICA/IHtcbiAgICAgIC4uLnVzZXIsXG4gICAgICBwZXJtaXNzaW9uczogW10sXG4gICAgICB0ZW1wOiB0cnVlLFxuICAgICAgaXNVc2VyOiB0cnVlLFxuICAgIH1cbiAgICA6IG51bGw7XG59O1xuXG5leHBvcnQgY29uc3QgYnVpbGRVc2VyUGVybWlzc2lvbnMgPSBhc3luYyAoYXBwLCB1c2VyQWNjZXNzTGV2ZWxzKSA9PiB7XG4gIGNvbnN0IGFsbEFjY2Vzc0xldmVscyA9IGF3YWl0IF9sb2FkQWNjZXNzTGV2ZWxzKGFwcCk7XG5cbiAgcmV0dXJuICQoYWxsQWNjZXNzTGV2ZWxzLmxldmVscywgW1xuICAgIGZpbHRlcihsID0+IHNvbWUodWEgPT4gbC5uYW1lID09PSB1YSkodXNlckFjY2Vzc0xldmVscykpLFxuICAgIG1hcChsID0+IGwucGVybWlzc2lvbnMpLFxuICAgIGZsYXR0ZW4sXG4gIF0pO1xufTtcbiIsImltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnc2hvcnRpZCc7XG5pbXBvcnQge1xuICB0ZW1wQ29kZUV4cGlyeUxlbmd0aCwgVVNFUlNfTE9DS19GSUxFLFxuICBVU0VSU19MSVNUX0ZJTEUsIHVzZXJBdXRoRmlsZSxcbiAgZ2V0VXNlckJ5TmFtZSxcbn0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7XG4gIGdldExvY2ssIGlzTm9sb2NrLFxuICByZWxlYXNlTG9jayxcbn0gZnJvbSAnLi4vY29tbW9uL2xvY2snO1xuaW1wb3J0IHsgYXBpV3JhcHBlciwgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGFsd2F5c0F1dGhvcml6ZWQgfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyA9IGFwcCA9PiBhc3luYyB1c2VyTmFtZSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmNyZWF0ZVRlbXBvcmFyeUFjY2VzcyxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyB1c2VyTmFtZSB9LFxuICBfY3JlYXRlVGVtcG9yYXJ5QWNjZXNzLCBhcHAsIHVzZXJOYW1lLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MgPSBhc3luYyAoYXBwLCB1c2VyTmFtZSkgPT4ge1xuICBjb25zdCB0ZW1wQ29kZSA9IGF3YWl0IGdldFRlbXBvcmFyeUNvZGUoYXBwKTtcblxuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhcbiAgICBhcHAsIFVTRVJTX0xPQ0tfRklMRSwgMTAwMCwgMixcbiAgKTtcblxuICBpZiAoaXNOb2xvY2sobG9jaykpIHsgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gY3JlYXRlIHRlbXBvcmFyeSBhY2Nlc3MsIGNvdWxkIG5vdCBnZXQgbG9jayAtIHRyeSBhZ2FpbicpOyB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB1c2VycyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oVVNFUlNfTElTVF9GSUxFKTtcblxuICAgIGNvbnN0IHVzZXIgPSBnZXRVc2VyQnlOYW1lKHVzZXJzLCB1c2VyTmFtZSk7XG4gICAgdXNlci50ZW1wb3JhcnlBY2Nlc3NJZCA9IHRlbXBDb2RlLnRlbXBvcmFyeUFjY2Vzc0lkO1xuXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFxuICAgICAgVVNFUlNfTElTVF9GSUxFLFxuICAgICAgdXNlcnMsXG4gICAgKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xuICB9XG5cbiAgY29uc3QgdXNlckF1dGggPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgIHVzZXJBdXRoRmlsZSh1c2VyTmFtZSksXG4gICk7XG4gIHVzZXJBdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2ggPSB0ZW1wQ29kZS50ZW1wb3JhcnlBY2Nlc3NIYXNoO1xuXG4gIHVzZXJBdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID0gdGVtcENvZGUudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2g7XG5cbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFxuICAgIHVzZXJBdXRoRmlsZSh1c2VyTmFtZSksXG4gICAgdXNlckF1dGgsXG4gICk7XG5cbiAgcmV0dXJuIHRlbXBDb2RlLnRlbXBDb2RlO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFRlbXBvcmFyeUNvZGUgPSBhc3luYyAoYXBwKSA9PiB7XG4gIGNvbnN0IHRlbXBDb2RlID0gZ2VuZXJhdGUoKVxuICAgICAgICArIGdlbmVyYXRlKClcbiAgICAgICAgKyBnZW5lcmF0ZSgpXG4gICAgICAgICsgZ2VuZXJhdGUoKTtcblxuICBjb25zdCB0ZW1wSWQgPSBnZW5lcmF0ZSgpO1xuXG4gIHJldHVybiB7XG4gICAgdGVtcG9yYXJ5QWNjZXNzSGFzaDogYXdhaXQgYXBwLmNyeXB0by5oYXNoKFxuICAgICAgdGVtcENvZGUsXG4gICAgKSxcbiAgICB0ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaDpcbiAgICAgICAgICAgIChhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCkpICsgdGVtcENvZGVFeHBpcnlMZW5ndGgsXG4gICAgdGVtcENvZGU6IGB0bXA6JHt0ZW1wSWR9OiR7dGVtcENvZGV9YCxcbiAgICB0ZW1wb3JhcnlBY2Nlc3NJZDogdGVtcElkLFxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGxvb2tzTGlrZVRlbXBvcmFyeUNvZGUgPSBjb2RlID0+IGNvZGUuc3RhcnRzV2l0aCgndG1wOicpO1xuIiwiaW1wb3J0IHtcbiAgbWFwLCB1bmlxV2l0aCxcbiAgZmxhdHRlbiwgZmlsdGVyLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSB9IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcbmltcG9ydCB7XG4gICQsIGluc2Vuc2l0aXZlRXF1YWxzLCBhcGlXcmFwcGVyLCBldmVudHMsXG4gIGlzTm9uRW1wdHlTdHJpbmcsIGFsbCxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGFsd2F5c0F1dGhvcml6ZWQgfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuY29uc3QgdXNlclJ1bGVzID0gYWxsVXNlcnMgPT4gW1xuICBtYWtlcnVsZSgnbmFtZScsICd1c2VybmFtZSBtdXN0IGJlIHNldCcsXG4gICAgdSA9PiBpc05vbkVtcHR5U3RyaW5nKHUubmFtZSkpLFxuICBtYWtlcnVsZSgnYWNjZXNzTGV2ZWxzJywgJ3VzZXIgbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBhY2Nlc3MgbGV2ZWwnLFxuICAgIHUgPT4gdS5hY2Nlc3NMZXZlbHMubGVuZ3RoID4gMCksXG4gIG1ha2VydWxlKCduYW1lJywgJ3VzZXJuYW1lIG11c3QgYmUgdW5pcXVlJyxcbiAgICB1ID0+IGZpbHRlcih1MiA9PiBpbnNlbnNpdGl2ZUVxdWFscyh1Mi5uYW1lLCB1Lm5hbWUpKShhbGxVc2VycykubGVuZ3RoID09PSAxKSxcbiAgbWFrZXJ1bGUoJ2FjY2Vzc0xldmVscycsICdhY2Nlc3MgbGV2ZWxzIG11c3Qgb25seSBjb250YWluIHN0aW5ncycsXG4gICAgdSA9PiBhbGwoaXNOb25FbXB0eVN0cmluZykodS5hY2Nlc3NMZXZlbHMpKSxcbl07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVVzZXIgPSAoKSA9PiAoYWxsdXNlcnMsIHVzZXIpID0+IGFwcGx5UnVsZVNldCh1c2VyUnVsZXMoYWxsdXNlcnMpKSh1c2VyKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVXNlcnMgPSBhcHAgPT4gYWxsVXNlcnMgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS52YWxpZGF0ZVVzZXJzLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IGFsbFVzZXJzIH0sXG4gIF92YWxpZGF0ZVVzZXJzLCBhcHAsIGFsbFVzZXJzLFxuKTtcblxuZXhwb3J0IGNvbnN0IF92YWxpZGF0ZVVzZXJzID0gKGFwcCwgYWxsVXNlcnMpID0+ICQoYWxsVXNlcnMsIFtcbiAgbWFwKGwgPT4gdmFsaWRhdGVVc2VyKGFwcCkoYWxsVXNlcnMsIGwpKSxcbiAgZmxhdHRlbixcbiAgdW5pcVdpdGgoKHgsIHkpID0+IHguZmllbGQgPT09IHkuZmllbGRcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHguaXRlbSA9PT0geS5pdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB4LmVycm9yID09PSB5LmVycm9yKSxcbl0pO1xuIiwiaW1wb3J0IHsgYXBpV3JhcHBlclN5bmMsIGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdVc2VyID0gYXBwID0+ICgpID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmdldE5ld1VzZXIsXG4gIHBlcm1pc3Npb24uY3JlYXRlVXNlci5pc0F1dGhvcml6ZWQsXG4gIHt9LFxuICBfZ2V0TmV3VXNlciwgYXBwLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9nZXROZXdVc2VyID0gKCkgPT4gKHtcbiAgbmFtZTogJycsXG4gIGFjY2Vzc0xldmVsczogW10sXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHRlbXBvcmFyeUFjY2Vzc0lkOiAnJyxcbn0pO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3VXNlckF1dGggPSBhcHAgPT4gKCkgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuZ2V0TmV3VXNlckF1dGgsXG4gIHBlcm1pc3Npb24uY3JlYXRlVXNlci5pc0F1dGhvcml6ZWQsXG4gIHt9LFxuICBfZ2V0TmV3VXNlckF1dGgsIGFwcCxcbik7XG5cbmV4cG9ydCBjb25zdCBfZ2V0TmV3VXNlckF1dGggPSAoKSA9PiAoe1xuICBwYXNzd29yZEhhc2g6ICcnLFxuICB0ZW1wb3JhcnlBY2Nlc3NIYXNoOiAnJyxcbiAgdGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2g6IDAsXG59KTtcbiIsImltcG9ydCB7IGZpbmQgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgdXNlckF1dGhGaWxlLCBwYXJzZVRlbXBvcmFyeUNvZGUgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHtcbiAgaXNTb21ldGhpbmcsICQsIGFwaVdyYXBwZXIsIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBfZ2V0VXNlcnMgfSBmcm9tICcuL2dldFVzZXJzJztcbmltcG9ydCB7IGFsd2F5c0F1dGhvcml6ZWQgfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGlzVmFsaWRQYXNzd29yZCA9IGFwcCA9PiBwYXNzd29yZCA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5pc1ZhbGlkUGFzc3dvcmQsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgcGFzc3dvcmQgfSxcbiAgX2lzVmFsaWRQYXNzd29yZCwgYXBwLCBwYXNzd29yZCxcbik7XG5cbmV4cG9ydCBjb25zdCBfaXNWYWxpZFBhc3N3b3JkID0gKGFwcCwgcGFzc3dvcmQpID0+IHNjb3JlUGFzc3dvcmQocGFzc3dvcmQpLnNjb3JlID4gMzA7XG5cbmV4cG9ydCBjb25zdCBjaGFuZ2VNeVBhc3N3b3JkID0gYXBwID0+IGFzeW5jIChjdXJyZW50UHcsIG5ld3Bhc3N3b3JkKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmNoYW5nZU15UGFzc3dvcmQsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgY3VycmVudFB3LCBuZXdwYXNzd29yZCB9LFxuICBfY2hhbmdlTXlQYXNzd29yZCwgYXBwLCBjdXJyZW50UHcsIG5ld3Bhc3N3b3JkLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9jaGFuZ2VNeVBhc3N3b3JkID0gYXN5bmMgKGFwcCwgY3VycmVudFB3LCBuZXdwYXNzd29yZCkgPT4ge1xuICBjb25zdCBleGlzdGluZ0F1dGggPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgIHVzZXJBdXRoRmlsZShhcHAudXNlci5uYW1lKSxcbiAgKTtcblxuICBpZiAoaXNTb21ldGhpbmcoZXhpc3RpbmdBdXRoLnBhc3N3b3JkSGFzaCkpIHtcbiAgICBjb25zdCB2ZXJpZmllZCA9IGF3YWl0IGFwcC5jcnlwdG8udmVyaWZ5KFxuICAgICAgZXhpc3RpbmdBdXRoLnBhc3N3b3JkSGFzaCxcbiAgICAgIGN1cnJlbnRQdyxcbiAgICApO1xuXG4gICAgaWYgKHZlcmlmaWVkKSB7XG4gICAgICBhd2FpdCBhd2FpdCBkb1NldChcbiAgICAgICAgYXBwLCBleGlzdGluZ0F1dGgsXG4gICAgICAgIGFwcC51c2VyLm5hbWUsIG5ld3Bhc3N3b3JkLFxuICAgICAgKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmV4cG9ydCBjb25zdCBzZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlID0gYXBwID0+IGFzeW5jICh0ZW1wQ29kZSwgbmV3cGFzc3dvcmQpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZSxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyB0ZW1wQ29kZSwgbmV3cGFzc3dvcmQgfSxcbiAgX3NldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUsIGFwcCwgdGVtcENvZGUsIG5ld3Bhc3N3b3JkLFxuKTtcblxuXG5leHBvcnQgY29uc3QgX3NldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUgPSBhc3luYyAoYXBwLCB0ZW1wQ29kZSwgbmV3cGFzc3dvcmQpID0+IHtcbiAgY29uc3QgY3VycmVudFRpbWUgPSBhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCk7XG5cbiAgY29uc3QgdGVtcCA9IHBhcnNlVGVtcG9yYXJ5Q29kZSh0ZW1wQ29kZSk7XG5cbiAgY29uc3QgdXNlciA9ICQoYXdhaXQgX2dldFVzZXJzKGFwcCksIFtcbiAgICBmaW5kKHUgPT4gdS50ZW1wb3JhcnlBY2Nlc3NJZCA9PT0gdGVtcC5pZCksXG4gIF0pO1xuXG4gIGlmICghdXNlcikgeyByZXR1cm4gZmFsc2U7IH1cblxuICBjb25zdCBleGlzdGluZ0F1dGggPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgIHVzZXJBdXRoRmlsZSh1c2VyLm5hbWUpLFxuICApO1xuXG4gIGlmIChpc1NvbWV0aGluZyhleGlzdGluZ0F1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaClcbiAgICAgICAmJiBleGlzdGluZ0F1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPiBjdXJyZW50VGltZSkge1xuICAgIGNvbnN0IHZlcmlmaWVkID0gYXdhaXQgYXBwLmNyeXB0by52ZXJpZnkoXG4gICAgICBleGlzdGluZ0F1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaCxcbiAgICAgIHRlbXAuY29kZSxcbiAgICApO1xuXG4gICAgaWYgKHZlcmlmaWVkKSB7XG4gICAgICBhd2FpdCBkb1NldChcbiAgICAgICAgYXBwLCBleGlzdGluZ0F1dGgsXG4gICAgICAgIHVzZXIubmFtZSwgbmV3cGFzc3dvcmQsXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgZG9TZXQgPSBhc3luYyAoYXBwLCBhdXRoLCB1c2VybmFtZSwgbmV3cGFzc3dvcmQpID0+IHtcbiAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoID0gJyc7XG4gIGF1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPSAwO1xuICBhdXRoLnBhc3N3b3JkSGFzaCA9IGF3YWl0IGFwcC5jcnlwdG8uaGFzaChcbiAgICBuZXdwYXNzd29yZCxcbiAgKTtcbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFxuICAgIHVzZXJBdXRoRmlsZSh1c2VybmFtZSksXG4gICAgYXV0aCxcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzY29yZVBhc3N3b3JkID0gYXBwID0+IHBhc3N3b3JkID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLnNjb3JlUGFzc3dvcmQsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgcGFzc3dvcmQgfSxcbiAgX3Njb3JlUGFzc3dvcmQsIHBhc3N3b3JkLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9zY29yZVBhc3N3b3JkID0gKHBhc3N3b3JkKSA9PiB7XG4gIC8vIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTQ4MTcyL3Bhc3N3b3JkLXN0cmVuZ3RoLW1ldGVyXG4gIC8vIHRoYW5rIHlvdSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3VzZXJzLzQ2NjE3L3RtLWx2XG5cbiAgbGV0IHNjb3JlID0gMDtcbiAgaWYgKCFwYXNzd29yZCkgeyByZXR1cm4gc2NvcmU7IH1cblxuICAvLyBhd2FyZCBldmVyeSB1bmlxdWUgbGV0dGVyIHVudGlsIDUgcmVwZXRpdGlvbnNcbiAgY29uc3QgbGV0dGVycyA9IG5ldyBPYmplY3QoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXNzd29yZC5sZW5ndGg7IGkrKykge1xuICAgIGxldHRlcnNbcGFzc3dvcmRbaV1dID0gKGxldHRlcnNbcGFzc3dvcmRbaV1dIHx8IDApICsgMTtcbiAgICBzY29yZSArPSA1LjAgLyBsZXR0ZXJzW3Bhc3N3b3JkW2ldXTtcbiAgfVxuXG4gIC8vIGJvbnVzIHBvaW50cyBmb3IgbWl4aW5nIGl0IHVwXG4gIGNvbnN0IHZhcmlhdGlvbnMgPSB7XG4gICAgZGlnaXRzOiAvXFxkLy50ZXN0KHBhc3N3b3JkKSxcbiAgICBsb3dlcjogL1thLXpdLy50ZXN0KHBhc3N3b3JkKSxcbiAgICB1cHBlcjogL1tBLVpdLy50ZXN0KHBhc3N3b3JkKSxcbiAgICBub25Xb3JkczogL1xcVy8udGVzdChwYXNzd29yZCksXG4gIH07XG5cbiAgbGV0IHZhcmlhdGlvbkNvdW50ID0gMDtcbiAgZm9yIChjb25zdCBjaGVjayBpbiB2YXJpYXRpb25zKSB7XG4gICAgdmFyaWF0aW9uQ291bnQgKz0gKHZhcmlhdGlvbnNbY2hlY2tdID09IHRydWUpID8gMSA6IDA7XG4gIH1cbiAgc2NvcmUgKz0gKHZhcmlhdGlvbkNvdW50IC0gMSkgKiAxMDtcblxuICBjb25zdCBzdHJlbmd0aFRleHQgPSBzY29yZSA+IDgwXG4gICAgPyAnc3Ryb25nJ1xuICAgIDogc2NvcmUgPiA2MFxuICAgICAgPyAnZ29vZCdcbiAgICAgIDogc2NvcmUgPj0gMzBcbiAgICAgICAgPyAnd2VhaydcbiAgICAgICAgOiAndmVyeSB3ZWFrJztcblxuICByZXR1cm4ge1xuICAgIHNjb3JlOiBwYXJzZUludChzY29yZSksXG4gICAgc3RyZW5ndGhUZXh0LFxuICB9O1xufTtcbiIsImltcG9ydCB7IGpvaW4sIHNvbWUgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgdmFsaWRhdGVVc2VyIH0gZnJvbSAnLi92YWxpZGF0ZVVzZXInO1xuaW1wb3J0IHsgZ2V0TmV3VXNlckF1dGggfSBmcm9tICcuL2dldE5ld1VzZXInO1xuaW1wb3J0IHtcbiAgZ2V0TG9jaywgaXNOb2xvY2ssIHJlbGVhc2VMb2NrLCBhcGlXcmFwcGVyLCBldmVudHMsXG4gIGluc2Vuc2l0aXZlRXF1YWxzLCBpc05vbkVtcHR5U3RyaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgVVNFUlNfTE9DS19GSUxFLCBzdHJpcFVzZXJPZlNlbnNpdGl2ZVN0dWZmLFxuICBVU0VSU19MSVNUX0ZJTEUsIHVzZXJBdXRoRmlsZSxcbn0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7IGdldFRlbXBvcmFyeUNvZGUgfSBmcm9tICcuL2NyZWF0ZVRlbXBvcmFyeUFjY2Vzcyc7XG5pbXBvcnQgeyBpc1ZhbGlkUGFzc3dvcmQgfSBmcm9tICcuL3NldFBhc3N3b3JkJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlVXNlciA9IGFwcCA9PiBhc3luYyAodXNlciwgcGFzc3dvcmQgPSBudWxsKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmNyZWF0ZVVzZXIsXG4gIHBlcm1pc3Npb24uY3JlYXRlVXNlci5pc0F1dGhvcml6ZWQsXG4gIHsgdXNlciwgcGFzc3dvcmQgfSxcbiAgX2NyZWF0ZVVzZXIsIGFwcCwgdXNlciwgcGFzc3dvcmQsXG4pO1xuXG5leHBvcnQgY29uc3QgX2NyZWF0ZVVzZXIgPSBhc3luYyAoYXBwLCB1c2VyLCBwYXNzd29yZCA9IG51bGwpID0+IHtcbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldExvY2soXG4gICAgYXBwLCBVU0VSU19MT0NLX0ZJTEUsIDEwMDAsIDIsXG4gICk7XG5cbiAgaWYgKGlzTm9sb2NrKGxvY2spKSB7IHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGNyZWF0ZSB1c2VyLCBjb3VsZCBub3QgZ2V0IGxvY2sgLSB0cnkgYWdhaW4nKTsgfVxuXG4gIGNvbnN0IHVzZXJzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihVU0VSU19MSVNUX0ZJTEUpO1xuXG4gIGNvbnN0IHVzZXJFcnJvcnMgPSB2YWxpZGF0ZVVzZXIoYXBwKShbLi4udXNlcnMsIHVzZXJdLCB1c2VyKTtcbiAgaWYgKHVzZXJFcnJvcnMubGVuZ3RoID4gMCkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBVc2VyIGlzIGludmFsaWQuICR7am9pbignOyAnKSh1c2VyRXJyb3JzKX1gKTsgfVxuXG4gIGNvbnN0IHsgYXV0aCwgdGVtcENvZGUsIHRlbXBvcmFyeUFjY2Vzc0lkIH0gPSBhd2FpdCBnZXRBY2Nlc3MoXG4gICAgYXBwLCBwYXNzd29yZCxcbiAgKTtcbiAgdXNlci50ZW1wQ29kZSA9IHRlbXBDb2RlO1xuICB1c2VyLnRlbXBvcmFyeUFjY2Vzc0lkID0gdGVtcG9yYXJ5QWNjZXNzSWQ7XG5cbiAgaWYgKHNvbWUodSA9PiBpbnNlbnNpdGl2ZUVxdWFscyh1Lm5hbWUsIHVzZXIubmFtZSkpKHVzZXJzKSkgeyBcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdVc2VyIGFscmVhZHkgZXhpc3RzJyk7IFxuICB9XG5cbiAgdXNlcnMucHVzaChcbiAgICBzdHJpcFVzZXJPZlNlbnNpdGl2ZVN0dWZmKHVzZXIpLFxuICApO1xuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgICBVU0VSU19MSVNUX0ZJTEUsXG4gICAgdXNlcnMsXG4gICk7XG5cbiAgdHJ5IHtcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmNyZWF0ZUpzb24oXG4gICAgICB1c2VyQXV0aEZpbGUodXNlci5uYW1lKSxcbiAgICAgIGF1dGgsXG4gICAgKTtcbiAgfSBjYXRjaCAoXykge1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgICAgIHVzZXJBdXRoRmlsZSh1c2VyLm5hbWUpLFxuICAgICAgYXV0aCxcbiAgICApO1xuICB9XG5cbiAgYXdhaXQgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcblxuICByZXR1cm4gdXNlcjtcbn07XG5cbmNvbnN0IGdldEFjY2VzcyA9IGFzeW5jIChhcHAsIHBhc3N3b3JkKSA9PiB7XG4gIGNvbnN0IGF1dGggPSBnZXROZXdVc2VyQXV0aChhcHApKCk7XG5cbiAgaWYgKGlzTm9uRW1wdHlTdHJpbmcocGFzc3dvcmQpKSB7XG4gICAgaWYgKGlzVmFsaWRQYXNzd29yZChwYXNzd29yZCkpIHtcbiAgICAgIGF1dGgucGFzc3dvcmRIYXNoID0gYXdhaXQgYXBwLmNyeXB0by5oYXNoKHBhc3N3b3JkKTtcbiAgICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaCA9ICcnO1xuICAgICAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NJZCA9ICcnO1xuICAgICAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA9IDA7XG4gICAgICByZXR1cm4geyBhdXRoIH07XG4gICAgfVxuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ1Bhc3N3b3JkIGRvZXMgbm90IG1lZXQgcmVxdWlyZW1lbnRzJyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgdGVtcEFjY2VzcyA9IGF3YWl0IGdldFRlbXBvcmFyeUNvZGUoYXBwKTtcbiAgICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2ggPSB0ZW1wQWNjZXNzLnRlbXBvcmFyeUFjY2Vzc0hhc2g7XG4gICAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA9IHRlbXBBY2Nlc3MudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2g7XG4gICAgYXV0aC5wYXNzd29yZEhhc2ggPSAnJztcbiAgICByZXR1cm4gKHtcbiAgICAgIGF1dGgsXG4gICAgICB0ZW1wQ29kZTogdGVtcEFjY2Vzcy50ZW1wQ29kZSxcbiAgICAgIHRlbXBvcmFyeUFjY2Vzc0lkOiB0ZW1wQWNjZXNzLnRlbXBvcmFyeUFjY2Vzc0lkLFxuICAgIH0pO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgZ2V0TG9jayxcbiAgaXNOb2xvY2ssIHJlbGVhc2VMb2NrLFxufSBmcm9tICcuLi9jb21tb24vbG9jayc7XG5pbXBvcnQgeyBVU0VSU19MT0NLX0ZJTEUsIFVTRVJTX0xJU1RfRklMRSwgZ2V0VXNlckJ5TmFtZSB9IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyBhcGlXcmFwcGVyLCBldmVudHMgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgTm90Rm91bmRFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgZW5hYmxlVXNlciA9IGFwcCA9PiBhc3luYyB1c2VybmFtZSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmVuYWJsZVVzZXIsXG4gIHBlcm1pc3Npb24uZW5hYmxlRGlzYWJsZVVzZXIuaXNBdXRob3JpemVkLFxuICB7IHVzZXJuYW1lIH0sXG4gIF9lbmFibGVVc2VyLCBhcHAsIHVzZXJuYW1lLFxuKTtcblxuZXhwb3J0IGNvbnN0IGRpc2FibGVVc2VyID0gYXBwID0+IGFzeW5jIHVzZXJuYW1lID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuZGlzYWJsZVVzZXIsXG4gIHBlcm1pc3Npb24uZW5hYmxlRGlzYWJsZVVzZXIuaXNBdXRob3JpemVkLFxuICB7IHVzZXJuYW1lIH0sXG4gIF9kaXNhYmxlVXNlciwgYXBwLCB1c2VybmFtZSxcbik7XG5cbmV4cG9ydCBjb25zdCBfZW5hYmxlVXNlciA9IGFzeW5jIChhcHAsIHVzZXJuYW1lKSA9PiBhd2FpdCB0b2dnbGVVc2VyKGFwcCwgdXNlcm5hbWUsIHRydWUpO1xuXG5leHBvcnQgY29uc3QgX2Rpc2FibGVVc2VyID0gYXN5bmMgKGFwcCwgdXNlcm5hbWUpID0+IGF3YWl0IHRvZ2dsZVVzZXIoYXBwLCB1c2VybmFtZSwgZmFsc2UpO1xuXG5jb25zdCB0b2dnbGVVc2VyID0gYXN5bmMgKGFwcCwgdXNlcm5hbWUsIGVuYWJsZWQpID0+IHtcbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldExvY2soYXBwLCBVU0VSU19MT0NLX0ZJTEUsIDEwMDAsIDEsIDApO1xuXG4gIGNvbnN0IGFjdGlvbk5hbWUgPSBlbmFibGVkID8gJ2VuYWJsZScgOiAnZGlzYWJsZSc7XG5cbiAgaWYgKGlzTm9sb2NrKGxvY2spKSB7IHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90ICR7YWN0aW9uTmFtZX0gdXNlciAtIGNhbm5vdCBnZXQgbG9ja2ApOyB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB1c2VycyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oVVNFUlNfTElTVF9GSUxFKTtcbiAgICBjb25zdCB1c2VyID0gZ2V0VXNlckJ5TmFtZSh1c2VycywgdXNlcm5hbWUpO1xuICAgIGlmICghdXNlcikgeyB0aHJvdyBuZXcgTm90Rm91bmRFcnJvcihgQ291bGQgbm90IGZpbmQgdXNlciB0byAke2FjdGlvbk5hbWV9YCk7IH1cblxuICAgIGlmICh1c2VyLmVuYWJsZWQgPT09ICFlbmFibGVkKSB7XG4gICAgICB1c2VyLmVuYWJsZWQgPSBlbmFibGVkO1xuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFVTRVJTX0xJU1RfRklMRSwgdXNlcnMpO1xuICAgIH1cbiAgfSBmaW5hbGx5IHtcbiAgICByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xuICB9XG59O1xuIiwiZXhwb3J0IGNvbnN0IGdldE5ld0FjY2Vzc0xldmVsID0gKCkgPT4gKCkgPT4gKHtcbiAgbmFtZTogJycsXG4gIHBlcm1pc3Npb25zOiBbXSxcbiAgZGVmYXVsdDpmYWxzZVxufSk7XG4iLCJpbXBvcnQge1xuICB2YWx1ZXMsIGluY2x1ZGVzLCBtYXAsIGNvbmNhdCwgaXNFbXB0eSwgdW5pcVdpdGgsIHNvbWUsXG4gIGZsYXR0ZW4sIGZpbHRlcixcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGFwcGx5UnVsZVNldCwgbWFrZXJ1bGUgfSBmcm9tICcuLi9jb21tb24vdmFsaWRhdGlvbkNvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uVHlwZXMgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHtcbiAgJCwgaXNTb21ldGhpbmcsIGluc2Vuc2l0aXZlRXF1YWxzLFxuICBpc05vbkVtcHR5U3RyaW5nLCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0Tm9kZSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmNvbnN0IGlzQWxsb3dlZFR5cGUgPSB0ID0+ICQocGVybWlzc2lvblR5cGVzLCBbXG4gIHZhbHVlcyxcbiAgaW5jbHVkZXModCksXG5dKTtcblxuY29uc3QgaXNSZWNvcmRPckluZGV4VHlwZSA9IHQgPT4gc29tZShwID0+IHAgPT09IHQpKFtcbiAgcGVybWlzc2lvblR5cGVzLkNSRUFURV9SRUNPUkQsXG4gIHBlcm1pc3Npb25UeXBlcy5VUERBVEVfUkVDT1JELFxuICBwZXJtaXNzaW9uVHlwZXMuREVMRVRFX1JFQ09SRCxcbiAgcGVybWlzc2lvblR5cGVzLlJFQURfUkVDT1JELFxuICBwZXJtaXNzaW9uVHlwZXMuUkVBRF9JTkRFWCxcbiAgcGVybWlzc2lvblR5cGVzLkVYRUNVVEVfQUNUSU9OLFxuXSk7XG5cblxuY29uc3QgcGVybWlzc2lvblJ1bGVzID0gYXBwID0+IChbXG4gIG1ha2VydWxlKCd0eXBlJywgJ3R5cGUgbXVzdCBiZSBvbmUgb2YgYWxsb3dlZCB0eXBlcycsXG4gICAgcCA9PiBpc0FsbG93ZWRUeXBlKHAudHlwZSkpLFxuICBtYWtlcnVsZSgnbm9kZUtleScsICdyZWNvcmQgYW5kIGluZGV4IHBlcm1pc3Npb25zIG11c3QgaW5jbHVkZSBhIHZhbGlkIG5vZGVLZXknLFxuICAgIHAgPT4gKCFpc1JlY29yZE9ySW5kZXhUeXBlKHAudHlwZSkpXG4gICAgICAgICAgICAgfHwgaXNTb21ldGhpbmcoZ2V0Tm9kZShhcHAuaGllcmFyY2h5LCBwLm5vZGVLZXkpKSksXG5dKTtcblxuY29uc3QgYXBwbHlQZXJtaXNzaW9uUnVsZXMgPSBhcHAgPT4gYXBwbHlSdWxlU2V0KHBlcm1pc3Npb25SdWxlcyhhcHApKTtcblxuY29uc3QgYWNjZXNzTGV2ZWxSdWxlcyA9IGFsbExldmVscyA9PiAoW1xuICBtYWtlcnVsZSgnbmFtZScsICduYW1lIG11c3QgYmUgc2V0JyxcbiAgICBsID0+IGlzTm9uRW1wdHlTdHJpbmcobC5uYW1lKSksXG4gIG1ha2VydWxlKCduYW1lJywgJ2FjY2VzcyBsZXZlbCBuYW1lcyBtdXN0IGJlIHVuaXF1ZScsXG4gICAgbCA9PiBpc0VtcHR5KGwubmFtZSlcbiAgICAgICAgICAgICB8fCBmaWx0ZXIoYSA9PiBpbnNlbnNpdGl2ZUVxdWFscyhsLm5hbWUsIGEubmFtZSkpKGFsbExldmVscykubGVuZ3RoID09PSAxKSxcbl0pO1xuXG5jb25zdCBhcHBseUxldmVsUnVsZXMgPSBhbGxMZXZlbHMgPT4gYXBwbHlSdWxlU2V0KGFjY2Vzc0xldmVsUnVsZXMoYWxsTGV2ZWxzKSk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFjY2Vzc0xldmVsID0gYXBwID0+IChhbGxMZXZlbHMsIGxldmVsKSA9PiB7XG4gIGNvbnN0IGVycnMgPSAkKGxldmVsLnBlcm1pc3Npb25zLCBbXG4gICAgbWFwKGFwcGx5UGVybWlzc2lvblJ1bGVzKGFwcCkpLFxuICAgIGZsYXR0ZW4sXG4gICAgY29uY2F0KFxuICAgICAgYXBwbHlMZXZlbFJ1bGVzKGFsbExldmVscykobGV2ZWwpLFxuICAgICksXG4gIF0pO1xuXG4gIHJldHVybiBlcnJzO1xufTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWNjZXNzTGV2ZWxzID0gYXBwID0+IGFsbExldmVscyA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS52YWxpZGF0ZUFjY2Vzc0xldmVscyxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyBhbGxMZXZlbHMgfSxcbiAgX3ZhbGlkYXRlQWNjZXNzTGV2ZWxzLCBhcHAsIGFsbExldmVscyxcbik7XG5cbmV4cG9ydCBjb25zdCBfdmFsaWRhdGVBY2Nlc3NMZXZlbHMgPSAoYXBwLCBhbGxMZXZlbHMpID0+ICQoYWxsTGV2ZWxzLCBbXG4gIG1hcChsID0+IHZhbGlkYXRlQWNjZXNzTGV2ZWwoYXBwKShhbGxMZXZlbHMsIGwpKSxcbiAgZmxhdHRlbixcbiAgdW5pcVdpdGgoKHgsIHkpID0+IHguZmllbGQgPT09IHkuZmllbGRcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHguaXRlbSA9PT0geS5pdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB4LmVycm9yID09PSB5LmVycm9yKSxcbl0pO1xuIiwiaW1wb3J0IHsgam9pbiwgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIGdldExvY2ssIHJlbGVhc2VMb2NrLCAkLFxuICBpc05vbG9jaywgYXBpV3JhcHBlciwgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgQUNDRVNTX0xFVkVMU19MT0NLX0ZJTEUsXG4gIEFDQ0VTU19MRVZFTFNfRklMRSxcbn0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7IHZhbGlkYXRlQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi92YWxpZGF0ZUFjY2Vzc0xldmVscyc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBzYXZlQWNjZXNzTGV2ZWxzID0gYXBwID0+IGFzeW5jIGFjY2Vzc0xldmVscyA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLnNhdmVBY2Nlc3NMZXZlbHMsXG4gIHBlcm1pc3Npb24ud3JpdGVBY2Nlc3NMZXZlbHMuaXNBdXRob3JpemVkLFxuICB7IGFjY2Vzc0xldmVscyB9LFxuICBfc2F2ZUFjY2Vzc0xldmVscywgYXBwLCBhY2Nlc3NMZXZlbHMsXG4pO1xuXG5leHBvcnQgY29uc3QgX3NhdmVBY2Nlc3NMZXZlbHMgPSBhc3luYyAoYXBwLCBhY2Nlc3NMZXZlbHMpID0+IHtcbiAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRlQWNjZXNzTGV2ZWxzKGFwcCkoYWNjZXNzTGV2ZWxzLmxldmVscyk7XG4gIGlmICh2YWxpZGF0aW9uRXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBlcnJzID0gJCh2YWxpZGF0aW9uRXJyb3JzLCBbXG4gICAgICBtYXAoZSA9PiBlLmVycm9yKSxcbiAgICAgIGpvaW4oJywgJyksXG4gICAgXSk7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEFjY2VzcyBMZXZlbHMgSW52YWxpZDogJHtlcnJzfWAsXG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRMb2NrKFxuICAgIGFwcCwgQUNDRVNTX0xFVkVMU19MT0NLX0ZJTEUsIDIwMDAsIDIsXG4gICk7XG5cbiAgaWYgKGlzTm9sb2NrKGxvY2spKSB7IHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGdldCBsb2NrIHRvIHNhdmUgYWNjZXNzIGxldmVscycpOyB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBleGlzdGluZyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oQUNDRVNTX0xFVkVMU19GSUxFKTtcbiAgICBpZiAoZXhpc3RpbmcudmVyc2lvbiAhPT0gYWNjZXNzTGV2ZWxzLnZlcnNpb24pIHsgdGhyb3cgbmV3IEVycm9yKCdBY2Nlc3MgbGV2ZWxzIGhhdmUgYWxyZWFkeSBiZWVuIHVwZGF0ZWQsIHNpbmNlIHlvdSBsb2FkZWQnKTsgfVxuXG4gICAgYWNjZXNzTGV2ZWxzLnZlcnNpb24rKztcblxuICAgIGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihBQ0NFU1NfTEVWRUxTX0ZJTEUsIGFjY2Vzc0xldmVscyk7XG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIGZpbHRlciwgdmFsdWVzLCBlYWNoLCBrZXlzLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuaW1wb3J0IHtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBpc0luZGV4LCBpc1JlY29yZCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7ICQgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMgPSAoYXBwKSA9PiB7XG4gIGNvbnN0IGFsbE5vZGVzID0gZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGFwcC5oaWVyYXJjaHkpO1xuICBjb25zdCBhY2Nlc3NMZXZlbCA9IHsgcGVybWlzc2lvbnM6IFtdIH07XG5cbiAgY29uc3QgcmVjb3JkTm9kZXMgPSAkKGFsbE5vZGVzLCBbXG4gICAgZmlsdGVyKGlzUmVjb3JkKSxcbiAgXSk7XG5cbiAgZm9yIChjb25zdCBuIG9mIHJlY29yZE5vZGVzKSB7XG4gICAgcGVybWlzc2lvbi5jcmVhdGVSZWNvcmQuYWRkKG4ubm9kZUtleSgpLCBhY2Nlc3NMZXZlbCk7XG4gICAgcGVybWlzc2lvbi51cGRhdGVSZWNvcmQuYWRkKG4ubm9kZUtleSgpLCBhY2Nlc3NMZXZlbCk7XG4gICAgcGVybWlzc2lvbi5kZWxldGVSZWNvcmQuYWRkKG4ubm9kZUtleSgpLCBhY2Nlc3NMZXZlbCk7XG4gICAgcGVybWlzc2lvbi5yZWFkUmVjb3JkLmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xuICB9XG5cbiAgY29uc3QgaW5kZXhOb2RlcyA9ICQoYWxsTm9kZXMsIFtcbiAgICBmaWx0ZXIoaXNJbmRleCksXG4gIF0pO1xuXG4gIGZvciAoY29uc3QgbiBvZiBpbmRleE5vZGVzKSB7XG4gICAgcGVybWlzc2lvbi5yZWFkSW5kZXguYWRkKG4ubm9kZUtleSgpLCBhY2Nlc3NMZXZlbCk7XG4gIH1cblxuICBmb3IgKGNvbnN0IGEgb2Yga2V5cyhhcHAuYWN0aW9ucykpIHtcbiAgICBwZXJtaXNzaW9uLmV4ZWN1dGVBY3Rpb24uYWRkKGEsIGFjY2Vzc0xldmVsKTtcbiAgfVxuXG4gICQocGVybWlzc2lvbiwgW1xuICAgIHZhbHVlcyxcbiAgICBmaWx0ZXIocCA9PiAhcC5pc05vZGUpLFxuICAgIGVhY2gocCA9PiBwLmFkZChhY2Nlc3NMZXZlbCkpLFxuICBdKTtcblxuICByZXR1cm4gYWNjZXNzTGV2ZWwucGVybWlzc2lvbnM7XG59O1xuIiwiaW1wb3J0IHsgZGlmZmVyZW5jZSwgbWFwLCBqb2luIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIGdldExvY2ssIGlzTm9sb2NrLCByZWxlYXNlTG9jaywgJCxcbiAgYXBpV3JhcHBlciwgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgVVNFUlNfTE9DS19GSUxFLCBBQ0NFU1NfTEVWRUxTX0ZJTEUsXG4gIGdldFVzZXJCeU5hbWUsIFVTRVJTX0xJU1RfRklMRSxcbn0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IHNldFVzZXJBY2Nlc3NMZXZlbHMgPSBhcHAgPT4gYXN5bmMgKHVzZXJOYW1lLCBhY2Nlc3NMZXZlbHMpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuc2V0VXNlckFjY2Vzc0xldmVscyxcbiAgcGVybWlzc2lvbi5zZXRVc2VyQWNjZXNzTGV2ZWxzLmlzQXV0aG9yaXplZCxcbiAgeyB1c2VyTmFtZSwgYWNjZXNzTGV2ZWxzIH0sXG4gIF9zZXRVc2VyQWNjZXNzTGV2ZWxzLCBhcHAsIHVzZXJOYW1lLCBhY2Nlc3NMZXZlbHMsXG4pO1xuXG5leHBvcnQgY29uc3QgX3NldFVzZXJBY2Nlc3NMZXZlbHMgPSBhc3luYyAoYXBwLCB1c2VybmFtZSwgYWNjZXNzTGV2ZWxzKSA9PiB7XG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRMb2NrKGFwcCwgVVNFUlNfTE9DS19GSUxFLCAxMDAwLCAxLCAwKTtcblxuICBjb25zdCBhY3R1YWxBY2Nlc3NMZXZlbHMgPSAkKFxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oQUNDRVNTX0xFVkVMU19GSUxFKSxcbiAgICBbXG4gICAgICBsID0+IGwubGV2ZWxzLFxuICAgICAgbWFwKGwgPT4gbC5uYW1lKSxcbiAgICBdLFxuICApO1xuXG4gIGNvbnN0IG1pc3NpbmcgPSBkaWZmZXJlbmNlKGFjY2Vzc0xldmVscykoYWN0dWFsQWNjZXNzTGV2ZWxzKTtcbiAgaWYgKG1pc3NpbmcubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBhY2Nlc3MgbGV2ZWxzIHN1cHBsaWVkOiAke2pvaW4oJywgJywgbWlzc2luZyl9YCk7XG4gIH1cblxuICBpZiAoaXNOb2xvY2sobG9jaykpIHsgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBzZXQgdXNlciBhY2Nlc3MgbGV2ZWxzIGNhbm5vdCBnZXQgbG9jaycpOyB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB1c2VycyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oVVNFUlNfTElTVF9GSUxFKTtcbiAgICBjb25zdCB1c2VyID0gZ2V0VXNlckJ5TmFtZSh1c2VycywgdXNlcm5hbWUpO1xuICAgIGlmICghdXNlcikgeyB0aHJvdyBuZXcgTm90Rm91bmRFcnJvcihgQ291bGQgbm90IGZpbmQgdXNlciB3aXRoICR7dXNlcm5hbWV9YCk7IH1cblxuICAgIHVzZXIuYWNjZXNzTGV2ZWxzID0gYWNjZXNzTGV2ZWxzO1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihVU0VSU19MSVNUX0ZJTEUsIHVzZXJzKTtcbiAgfSBmaW5hbGx5IHtcbiAgICByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgYXV0aGVudGljYXRlLFxuICBhdXRoZW50aWNhdGVUZW1wb3JhcnlBY2Nlc3MsXG59IGZyb20gJy4vYXV0aGVudGljYXRlJztcbmltcG9ydCB7IGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyB9IGZyb20gJy4vY3JlYXRlVGVtcG9yYXJ5QWNjZXNzJztcbmltcG9ydCB7IGNyZWF0ZVVzZXIgfSBmcm9tICcuL2NyZWF0ZVVzZXInO1xuaW1wb3J0IHsgZW5hYmxlVXNlciwgZGlzYWJsZVVzZXIgfSBmcm9tICcuL2VuYWJsZVVzZXInO1xuaW1wb3J0IHsgbG9hZEFjY2Vzc0xldmVscyB9IGZyb20gJy4vbG9hZEFjY2Vzc0xldmVscyc7XG5pbXBvcnQgeyBnZXROZXdBY2Nlc3NMZXZlbCB9IGZyb20gJy4vZ2V0TmV3QWNjZXNzTGV2ZWwnO1xuaW1wb3J0IHsgZ2V0TmV3VXNlciwgZ2V0TmV3VXNlckF1dGggfSBmcm9tICcuL2dldE5ld1VzZXInO1xuaW1wb3J0IHsgZ2V0VXNlcnMgfSBmcm9tICcuL2dldFVzZXJzJztcbmltcG9ydCB7IGlzQXV0aG9yaXplZCB9IGZyb20gJy4vaXNBdXRob3JpemVkJztcbmltcG9ydCB7IHNhdmVBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL3NhdmVBY2Nlc3NMZXZlbHMnO1xuaW1wb3J0IHtcbiAgY2hhbmdlTXlQYXNzd29yZCxcbiAgc2NvcmVQYXNzd29yZCwgc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZSxcbiAgaXNWYWxpZFBhc3N3b3JkLFxufSBmcm9tICcuL3NldFBhc3N3b3JkJztcbmltcG9ydCB7IHZhbGlkYXRlVXNlciB9IGZyb20gJy4vdmFsaWRhdGVVc2VyJztcbmltcG9ydCB7IHZhbGlkYXRlQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi92YWxpZGF0ZUFjY2Vzc0xldmVscyc7XG5pbXBvcnQgeyBnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucyB9IGZyb20gJy4vZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgc2V0VXNlckFjY2Vzc0xldmVscyB9IGZyb20gJy4vc2V0VXNlckFjY2Vzc0xldmVscyc7XG5cbmV4cG9ydCBjb25zdCBnZXRBdXRoQXBpID0gYXBwID0+ICh7XG4gIGF1dGhlbnRpY2F0ZTogYXV0aGVudGljYXRlKGFwcCksXG4gIGF1dGhlbnRpY2F0ZVRlbXBvcmFyeUFjY2VzczogYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzKGFwcCksXG4gIGNyZWF0ZVRlbXBvcmFyeUFjY2VzczogY3JlYXRlVGVtcG9yYXJ5QWNjZXNzKGFwcCksXG4gIGNyZWF0ZVVzZXI6IGNyZWF0ZVVzZXIoYXBwKSxcbiAgbG9hZEFjY2Vzc0xldmVsczogbG9hZEFjY2Vzc0xldmVscyhhcHApLFxuICBlbmFibGVVc2VyOiBlbmFibGVVc2VyKGFwcCksXG4gIGRpc2FibGVVc2VyOiBkaXNhYmxlVXNlcihhcHApLFxuICBnZXROZXdBY2Nlc3NMZXZlbDogZ2V0TmV3QWNjZXNzTGV2ZWwoYXBwKSxcbiAgZ2V0TmV3VXNlcjogZ2V0TmV3VXNlcihhcHApLFxuICBnZXROZXdVc2VyQXV0aDogZ2V0TmV3VXNlckF1dGgoYXBwKSxcbiAgZ2V0VXNlcnM6IGdldFVzZXJzKGFwcCksXG4gIHNhdmVBY2Nlc3NMZXZlbHM6IHNhdmVBY2Nlc3NMZXZlbHMoYXBwKSxcbiAgaXNBdXRob3JpemVkOiBpc0F1dGhvcml6ZWQoYXBwKSxcbiAgY2hhbmdlTXlQYXNzd29yZDogY2hhbmdlTXlQYXNzd29yZChhcHApLFxuICBzZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlOiBzZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlKGFwcCksXG4gIHNjb3JlUGFzc3dvcmQsXG4gIGlzVmFsaWRQYXNzd29yZDogaXNWYWxpZFBhc3N3b3JkKGFwcCksXG4gIHZhbGlkYXRlVXNlcjogdmFsaWRhdGVVc2VyKGFwcCksXG4gIHZhbGlkYXRlQWNjZXNzTGV2ZWxzOiB2YWxpZGF0ZUFjY2Vzc0xldmVscyhhcHApLFxuICBnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9uczogKCkgPT4gZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMoYXBwKSxcbiAgc2V0VXNlckFjY2Vzc0xldmVsczogc2V0VXNlckFjY2Vzc0xldmVscyhhcHApLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGdldEF1dGhBcGk7XG4iLCJpbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBhcGlXcmFwcGVyU3luYyB9IGZyb20gJy4uL2NvbW1vbi9hcGlXcmFwcGVyJztcbmltcG9ydCB7IGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xuXG5leHBvcnQgY29uc3QgZXhlY3V0ZUFjdGlvbiA9IGFwcCA9PiAoYWN0aW9uTmFtZSwgb3B0aW9ucykgPT4ge1xuICBhcGlXcmFwcGVyU3luYyhcbiAgICBhcHAsXG4gICAgZXZlbnRzLmFjdGlvbnNBcGkuZXhlY3V0ZSxcbiAgICBwZXJtaXNzaW9uLmV4ZWN1dGVBY3Rpb24uaXNBdXRob3JpemVkKGFjdGlvbk5hbWUpLFxuICAgIHsgYWN0aW9uTmFtZSwgb3B0aW9ucyB9LFxuICAgIGFwcC5hY3Rpb25zW2FjdGlvbk5hbWVdLCBvcHRpb25zLFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IF9leGVjdXRlQWN0aW9uID0gKGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbiwgb3B0aW9ucykgPT4gYmVoYXZpb3VyU291cmNlc1thY3Rpb24uYmVoYXZpb3VyU291cmNlXVthY3Rpb24uYmVoYXZpb3VyTmFtZV0ob3B0aW9ucyk7XG4iLCJpbXBvcnQgeyBleGVjdXRlQWN0aW9uIH0gZnJvbSAnLi9leGVjdXRlJztcblxuZXhwb3J0IGNvbnN0IGdldEFjdGlvbnNBcGkgPSBhcHAgPT4gKHtcbiAgZXhlY3V0ZTogZXhlY3V0ZUFjdGlvbihhcHApLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGdldEFjdGlvbnNBcGk7XG4iLCJpbXBvcnQgeyBoYXMgfSBmcm9tICdsb2Rhc2gvZnAnO1xuXG5jb25zdCBwdWJsaXNoID0gaGFuZGxlcnMgPT4gYXN5bmMgKGV2ZW50TmFtZSwgY29udGV4dCA9IHt9KSA9PiB7XG4gIGlmICghaGFzKGV2ZW50TmFtZSkoaGFuZGxlcnMpKSByZXR1cm47XG5cbiAgZm9yIChjb25zdCBoYW5kbGVyIG9mIGhhbmRsZXJzW2V2ZW50TmFtZV0pIHtcbiAgICBhd2FpdCBoYW5kbGVyKGV2ZW50TmFtZSwgY29udGV4dCk7XG4gIH1cbn07XG5cbmNvbnN0IHN1YnNjcmliZSA9IGhhbmRsZXJzID0+IChldmVudE5hbWUsIGhhbmRsZXIpID0+IHtcbiAgaWYgKCFoYXMoZXZlbnROYW1lKShoYW5kbGVycykpIHtcbiAgICBoYW5kbGVyc1tldmVudE5hbWVdID0gW107XG4gIH1cbiAgaGFuZGxlcnNbZXZlbnROYW1lXS5wdXNoKGhhbmRsZXIpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUV2ZW50QWdncmVnYXRvciA9ICgpID0+IHtcbiAgY29uc3QgaGFuZGxlcnMgPSB7fTtcbiAgY29uc3QgZXZlbnRBZ2dyZWdhdG9yID0gKHtcbiAgICBwdWJsaXNoOiBwdWJsaXNoKGhhbmRsZXJzKSxcbiAgICBzdWJzY3JpYmU6IHN1YnNjcmliZShoYW5kbGVycyksXG4gIH0pO1xuICByZXR1cm4gZXZlbnRBZ2dyZWdhdG9yO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRXZlbnRBZ2dyZWdhdG9yO1xuIiwiaW1wb3J0IHsgcmV0cnkgfSBmcm9tICcuLi9jb21tb24vaW5kZXgnO1xuaW1wb3J0IHsgTm90Rm91bmRFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5jb25zdCBjcmVhdGVKc29uID0gb3JpZ2luYWxDcmVhdGVGaWxlID0+IGFzeW5jIChrZXksIG9iaiwgcmV0cmllcyA9IDUsIGRlbGF5ID0gNTAwKSA9PiBhd2FpdCByZXRyeShvcmlnaW5hbENyZWF0ZUZpbGUsIHJldHJpZXMsIGRlbGF5LCBrZXksIEpTT04uc3RyaW5naWZ5KG9iaikpO1xuXG5jb25zdCBjcmVhdGVOZXdGaWxlID0gb3JpZ2luYWxDcmVhdGVGaWxlID0+IGFzeW5jIChwYXRoLCBjb250ZW50LCByZXRyaWVzID0gNSwgZGVsYXkgPSA1MDApID0+IGF3YWl0IHJldHJ5KG9yaWdpbmFsQ3JlYXRlRmlsZSwgcmV0cmllcywgZGVsYXksIHBhdGgsIGNvbnRlbnQpO1xuXG5jb25zdCBsb2FkSnNvbiA9IGRhdGFzdG9yZSA9PiBhc3luYyAoa2V5LCByZXRyaWVzID0gNSwgZGVsYXkgPSA1MDApID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgcmV0cnkoSlNPTi5wYXJzZSwgcmV0cmllcywgZGVsYXksIGF3YWl0IGRhdGFzdG9yZS5sb2FkRmlsZShrZXkpKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoZXJyLm1lc3NhZ2UpO1xuICB9XG59XG5cbmNvbnN0IHVwZGF0ZUpzb24gPSBkYXRhc3RvcmUgPT4gYXN5bmMgKGtleSwgb2JqLCByZXRyaWVzID0gNSwgZGVsYXkgPSA1MDApID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgcmV0cnkoZGF0YXN0b3JlLnVwZGF0ZUZpbGUsIHJldHJpZXMsIGRlbGF5LCBrZXksIEpTT04uc3RyaW5naWZ5KG9iaikpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICB0aHJvdyBuZXcgTm90Rm91bmRFcnJvcihlcnIubWVzc2FnZSk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHNldHVwRGF0YXN0b3JlID0gKGRhdGFzdG9yZSkgPT4ge1xuICBjb25zdCBvcmlnaW5hbENyZWF0ZUZpbGUgPSBkYXRhc3RvcmUuY3JlYXRlRmlsZTtcbiAgZGF0YXN0b3JlLmxvYWRKc29uID0gbG9hZEpzb24oZGF0YXN0b3JlKTtcbiAgZGF0YXN0b3JlLmNyZWF0ZUpzb24gPSBjcmVhdGVKc29uKG9yaWdpbmFsQ3JlYXRlRmlsZSk7XG4gIGRhdGFzdG9yZS51cGRhdGVKc29uID0gdXBkYXRlSnNvbihkYXRhc3RvcmUpO1xuICBkYXRhc3RvcmUuY3JlYXRlRmlsZSA9IGNyZWF0ZU5ld0ZpbGUob3JpZ2luYWxDcmVhdGVGaWxlKTtcbiAgaWYgKGRhdGFzdG9yZS5jcmVhdGVFbXB0eURiKSB7IGRlbGV0ZSBkYXRhc3RvcmUuY3JlYXRlRW1wdHlEYjsgfVxuICByZXR1cm4gZGF0YXN0b3JlO1xufTtcblxuZXhwb3J0IHsgY3JlYXRlRXZlbnRBZ2dyZWdhdG9yIH0gZnJvbSAnLi9ldmVudEFnZ3JlZ2F0b3InO1xuXG5leHBvcnQgZGVmYXVsdCBzZXR1cERhdGFzdG9yZTtcbiIsImltcG9ydCB7IFxuICBjb21waWxlRXhwcmVzc2lvbiBhcyBjRXhwLCBcbiAgY29tcGlsZUNvZGUgYXMgY0NvZGUgXG59IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcblxuZXhwb3J0IGNvbnN0IGNvbXBpbGVDb2RlID0gY29kZSA9PiB7XG4gIGxldCBmdW5jOyAgXG4gICAgXG4gIHRyeSB7XG4gICAgZnVuYyA9IGNDb2RlKGNvZGUpO1xuICB9IGNhdGNoKGUpIHtcbiAgICBlLm1lc3NhZ2UgPSBgRXJyb3IgY29tcGlsaW5nIGNvZGUgOiAke2NvZGV9IDogJHtlLm1lc3NhZ2V9YDtcbiAgICB0aHJvdyBlO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmM7XG59XG5cbmV4cG9ydCBjb25zdCBjb21waWxlRXhwcmVzc2lvbiA9IGNvZGUgPT4ge1xuICBsZXQgZnVuYzsgIFxuICAgICAgXG4gIHRyeSB7XG4gICAgZnVuYyA9IGNFeHAoY29kZSk7XG4gIH0gY2F0Y2goZSkge1xuICAgIGUubWVzc2FnZSA9IGBFcnJvciBjb21waWxpbmcgZXhwcmVzc2lvbiA6ICR7Y29kZX0gOiAke2UubWVzc2FnZX1gO1xuICAgIHRocm93IGU7XG4gIH1cbiAgXG4gIHJldHVybiBmdW5jO1xufVxuIiwiaW1wb3J0IHtcbiAgaXNGdW5jdGlvbiwgZmlsdGVyLCBtYXAsXG4gIHVuaXFCeSwga2V5cywgZGlmZmVyZW5jZSxcbiAgam9pbiwgcmVkdWNlLCBmaW5kLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgY29tcGlsZUV4cHJlc3Npb24sIGNvbXBpbGVDb2RlIH0gZnJvbSAnLi4vY29tbW9uL2NvbXBpbGVDb2RlJztcbmltcG9ydCB7ICQgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgX2V4ZWN1dGVBY3Rpb24gfSBmcm9tICcuL2V4ZWN1dGUnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yLCBOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlQWN0aW9ucyA9IChzdWJzY3JpYmUsIGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMsIHRyaWdnZXJzLCBhcGlzKSA9PiB7XG4gIHZhbGlkYXRlU291cmNlcyhiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zKTtcbiAgc3Vic2NyaWJlVHJpZ2dlcnMoc3Vic2NyaWJlLCBiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zLCB0cmlnZ2VycywgYXBpcyk7XG4gIHJldHVybiBjcmVhdGVBY3Rpb25zQ29sbGVjdGlvbihiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zKTtcbn07XG5cbmNvbnN0IGNyZWF0ZUFjdGlvbnNDb2xsZWN0aW9uID0gKGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMpID0+ICQoYWN0aW9ucywgW1xuICByZWR1Y2UoKGFsbCwgYSkgPT4ge1xuICAgIGFsbFthLm5hbWVdID0gb3B0cyA9PiBfZXhlY3V0ZUFjdGlvbihiZWhhdmlvdXJTb3VyY2VzLCBhLCBvcHRzKTtcbiAgICByZXR1cm4gYWxsO1xuICB9LCB7fSksXG5dKTtcblxuY29uc3Qgc3Vic2NyaWJlVHJpZ2dlcnMgPSAoc3Vic2NyaWJlLCBiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zLCB0cmlnZ2VycywgYXBpcykgPT4ge1xuICBjb25zdCBjcmVhdGVPcHRpb25zID0gKG9wdGlvbnNDcmVhdG9yLCBldmVudENvbnRleHQpID0+IHtcbiAgICBpZiAoIW9wdGlvbnNDcmVhdG9yKSByZXR1cm4ge307XG4gICAgY29uc3QgY3JlYXRlID0gY29tcGlsZUNvZGUob3B0aW9uc0NyZWF0b3IpO1xuICAgIHJldHVybiBjcmVhdGUoeyBjb250ZXh0OiBldmVudENvbnRleHQsIGFwaXMgfSk7XG4gIH07XG5cbiAgY29uc3Qgc2hvdWxkUnVuVHJpZ2dlciA9ICh0cmlnZ2VyLCBldmVudENvbnRleHQpID0+IHtcbiAgICBpZiAoIXRyaWdnZXIuY29uZGl0aW9uKSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCBzaG91bGRSdW4gPSBjb21waWxlRXhwcmVzc2lvbih0cmlnZ2VyLmNvbmRpdGlvbik7XG4gICAgcmV0dXJuIHNob3VsZFJ1bih7IGNvbnRleHQ6IGV2ZW50Q29udGV4dCB9KTtcbiAgfTtcblxuICBmb3IgKGxldCB0cmlnIG9mIHRyaWdnZXJzKSB7XG4gICAgc3Vic2NyaWJlKHRyaWcuZXZlbnROYW1lLCBhc3luYyAoZXYsIGN0eCkgPT4ge1xuICAgICAgaWYgKHNob3VsZFJ1blRyaWdnZXIodHJpZywgY3R4KSkge1xuICAgICAgICBhd2FpdCBfZXhlY3V0ZUFjdGlvbihcbiAgICAgICAgICBiZWhhdmlvdXJTb3VyY2VzLFxuICAgICAgICAgIGZpbmQoYSA9PiBhLm5hbWUgPT09IHRyaWcuYWN0aW9uTmFtZSkoYWN0aW9ucyksXG4gICAgICAgICAgY3JlYXRlT3B0aW9ucyh0cmlnLm9wdGlvbnNDcmVhdG9yLCBjdHgpLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59O1xuXG5jb25zdCB2YWxpZGF0ZVNvdXJjZXMgPSAoYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucykgPT4ge1xuICBjb25zdCBkZWNsYXJlZFNvdXJjZXMgPSAkKGFjdGlvbnMsIFtcbiAgICB1bmlxQnkoYSA9PiBhLmJlaGF2aW91clNvdXJjZSksXG4gICAgbWFwKGEgPT4gYS5iZWhhdmlvdXJTb3VyY2UpLFxuICBdKTtcblxuICBjb25zdCBzdXBwbGllZFNvdXJjZXMgPSBrZXlzKGJlaGF2aW91clNvdXJjZXMpO1xuXG4gIGNvbnN0IG1pc3NpbmdTb3VyY2VzID0gZGlmZmVyZW5jZShcbiAgICBkZWNsYXJlZFNvdXJjZXMsIHN1cHBsaWVkU291cmNlcyxcbiAgKTtcblxuICBpZiAobWlzc2luZ1NvdXJjZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYERlY2xhcmVkIGJlaGF2aW91ciBzb3VyY2VzIGFyZSBub3Qgc3VwcGxpZWQ6ICR7am9pbignLCAnLCBtaXNzaW5nU291cmNlcyl9YCk7XG4gIH1cblxuICBjb25zdCBtaXNzaW5nQmVoYXZpb3VycyA9ICQoYWN0aW9ucywgW1xuICAgIGZpbHRlcihhID0+ICFpc0Z1bmN0aW9uKGJlaGF2aW91clNvdXJjZXNbYS5iZWhhdmlvdXJTb3VyY2VdW2EuYmVoYXZpb3VyTmFtZV0pKSxcbiAgICBtYXAoYSA9PiBgQWN0aW9uOiAke2EubmFtZX0gOiAke2EuYmVoYXZpb3VyU291cmNlfS4ke2EuYmVoYXZpb3VyTmFtZX1gKSxcbiAgXSk7XG5cbiAgaWYgKG1pc3NpbmdCZWhhdmlvdXJzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgTm90Rm91bmRFcnJvcihgTWlzc2luZyBiZWhhdmlvdXJzOiBjb3VsZCBub3QgZmluZCBiZWhhdmlvdXIgZnVuY3Rpb25zOiAke2pvaW4oJywgJywgbWlzc2luZ0JlaGF2aW91cnMpfWApO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgbWFwLCBmaWx0ZXIsIGdyb3VwQnksIHNwbGl0LFxuICBzb21lLCBmaW5kLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgTE9DS19GSUxFTkFNRSwgVFJBTlNBQ1RJT05TX0ZPTERFUiwgaWRTZXAsIGlzVXBkYXRlLFxuICBub2RlS2V5SGFzaEZyb21CdWlsZEZvbGRlciwgaXNCdWlsZEluZGV4Rm9sZGVyLCBnZXRUcmFuc2FjdGlvbklkLFxuICBpc0RlbGV0ZSwgaXNDcmVhdGUsXG59IGZyb20gJy4vdHJhbnNhY3Rpb25zQ29tbW9uJztcbmltcG9ydCB7XG4gIGpvaW5LZXksICQsIG5vbmUsIGlzU29tZXRoaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0TGFzdFBhcnRJbktleSwgZ2V0Tm9kZUZyb21Ob2RlS2V5SGFzaCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBfbG9hZCB9IGZyb20gJy4uL3JlY29yZEFwaS9sb2FkJztcblxuZXhwb3J0IGNvbnN0IHJldHJpZXZlID0gYXN5bmMgKGFwcCkgPT4ge1xuICBjb25zdCB0cmFuc2FjdGlvbkZpbGVzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5nZXRGb2xkZXJDb250ZW50cyhcbiAgICBUUkFOU0FDVElPTlNfRk9MREVSLFxuICApO1xuXG4gIGxldCB0cmFuc2FjdGlvbnMgPSBbXTtcblxuICBpZiAoc29tZShpc0J1aWxkSW5kZXhGb2xkZXIpKHRyYW5zYWN0aW9uRmlsZXMpKSB7XG4gICAgY29uc3QgYnVpbGRJbmRleEZvbGRlciA9IGZpbmQoaXNCdWlsZEluZGV4Rm9sZGVyKSh0cmFuc2FjdGlvbkZpbGVzKTtcblxuICAgIHRyYW5zYWN0aW9ucyA9IGF3YWl0IHJldHJpZXZlQnVpbGRJbmRleFRyYW5zYWN0aW9ucyhcbiAgICAgIGFwcCxcbiAgICAgIGpvaW5LZXkoVFJBTlNBQ1RJT05TX0ZPTERFUiwgYnVpbGRJbmRleEZvbGRlciksXG4gICAgKTtcbiAgfVxuXG4gIGlmICh0cmFuc2FjdGlvbnMubGVuZ3RoID4gMCkgcmV0dXJuIHRyYW5zYWN0aW9ucztcblxuICByZXR1cm4gYXdhaXQgcmV0cmlldmVTdGFuZGFyZFRyYW5zYWN0aW9ucyhcbiAgICBhcHAsIHRyYW5zYWN0aW9uRmlsZXMsXG4gICk7XG59O1xuXG5jb25zdCByZXRyaWV2ZUJ1aWxkSW5kZXhUcmFuc2FjdGlvbnMgPSBhc3luYyAoYXBwLCBidWlsZEluZGV4Rm9sZGVyKSA9PiB7XG4gIGNvbnN0IGNoaWxkRm9sZGVycyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0Rm9sZGVyQ29udGVudHMoYnVpbGRJbmRleEZvbGRlcik7XG4gIGlmIChjaGlsZEZvbGRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gY2xlYW51cFxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKGJ1aWxkSW5kZXhGb2xkZXIpO1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IGdldFRyYW5zYWN0aW9uRmlsZXMgPSBhc3luYyAoY2hpbGRGb2xkZXJJbmRleCA9IDApID0+IHtcbiAgICBpZiAoY2hpbGRGb2xkZXJJbmRleCA+PSBjaGlsZEZvbGRlcnMubGVuZ3RoKSByZXR1cm4gW107XG5cbiAgICBjb25zdCBjaGlsZEZvbGRlcktleSA9IGpvaW5LZXkoYnVpbGRJbmRleEZvbGRlciwgY2hpbGRGb2xkZXJzW2NoaWxkRm9sZGVySW5kZXhdKTtcbiAgICBjb25zdCBmaWxlcyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0Rm9sZGVyQ29udGVudHMoXG4gICAgICBjaGlsZEZvbGRlcktleSxcbiAgICApO1xuXG4gICAgaWYgKGZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoY2hpbGRGb2xkZXJLZXkpO1xuICAgICAgcmV0dXJuIGF3YWl0IGdldFRyYW5zYWN0aW9uRmlsZXMoY2hpbGRGb2xkZXJJbmRleCArIDEpO1xuICAgIH1cblxuICAgIHJldHVybiB7IGNoaWxkRm9sZGVyS2V5LCBmaWxlcyB9O1xuICB9O1xuXG4gIGNvbnN0IHRyYW5zYWN0aW9uRmlsZXMgPSBhd2FpdCBnZXRUcmFuc2FjdGlvbkZpbGVzKCk7XG5cbiAgaWYgKHRyYW5zYWN0aW9uRmlsZXMuZmlsZXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgdHJhbnNhY3Rpb25zID0gJCh0cmFuc2FjdGlvbkZpbGVzLmZpbGVzLCBbXG4gICAgbWFwKHBhcnNlVHJhbnNhY3Rpb25JZCksXG4gIF0pO1xuXG4gIGZvciAoY29uc3QgdCBvZiB0cmFuc2FjdGlvbnMpIHtcbiAgICBjb25zdCB0cmFuc2FjdGlvbkNvbnRlbnQgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgICAgam9pbktleShcbiAgICAgICAgdHJhbnNhY3Rpb25GaWxlcy5jaGlsZEZvbGRlcktleSxcbiAgICAgICAgdC5mdWxsSWQsXG4gICAgICApLFxuICAgICk7XG4gICAgdC5yZWNvcmQgPSBhd2FpdCBfbG9hZChhcHAsIHRyYW5zYWN0aW9uQ29udGVudC5yZWNvcmRLZXkpO1xuICB9XG5cbiAgdHJhbnNhY3Rpb25zLmluZGV4Tm9kZSA9ICQoYnVpbGRJbmRleEZvbGRlciwgW1xuICAgIGdldExhc3RQYXJ0SW5LZXksXG4gICAgbm9kZUtleUhhc2hGcm9tQnVpbGRGb2xkZXIsXG4gICAgZ2V0Tm9kZUZyb21Ob2RlS2V5SGFzaChhcHAuaGllcmFyY2h5KSxcbiAgXSk7XG5cbiAgdHJhbnNhY3Rpb25zLmZvbGRlcktleSA9IHRyYW5zYWN0aW9uRmlsZXMuY2hpbGRGb2xkZXJLZXk7XG5cbiAgcmV0dXJuIHRyYW5zYWN0aW9ucztcbn07XG5cbmNvbnN0IHJldHJpZXZlU3RhbmRhcmRUcmFuc2FjdGlvbnMgPSBhc3luYyAoYXBwLCB0cmFuc2FjdGlvbkZpbGVzKSA9PiB7XG4gIGNvbnN0IHRyYW5zYWN0aW9uSWRzID0gJCh0cmFuc2FjdGlvbkZpbGVzLCBbXG4gICAgZmlsdGVyKGYgPT4gZiAhPT0gTE9DS19GSUxFTkFNRVxuICAgICAgICAgICAgICAgICAgICAmJiAhaXNCdWlsZEluZGV4Rm9sZGVyKGYpKSxcbiAgICBtYXAocGFyc2VUcmFuc2FjdGlvbklkKSxcbiAgXSk7XG5cbiAgY29uc3QgdHJhbnNhY3Rpb25JZHNCeVJlY29yZCA9ICQodHJhbnNhY3Rpb25JZHMsIFtcbiAgICBncm91cEJ5KCdyZWNvcmRJZCcpLFxuICBdKTtcblxuICBjb25zdCBkZWR1cGVkVHJhbnNhY3Rpb25zID0gW107XG5cbiAgY29uc3QgdmVyaWZ5ID0gYXN5bmMgKHQpID0+IHtcbiAgICBpZiAodC52ZXJpZmllZCA9PT0gdHJ1ZSkgcmV0dXJuIHQ7XG5cbiAgICBjb25zdCBpZCA9IGdldFRyYW5zYWN0aW9uSWQoXG4gICAgICB0LnJlY29yZElkLFxuICAgICAgdC50cmFuc2FjdGlvblR5cGUsXG4gICAgICB0LnVuaXF1ZUlkLFxuICAgICk7XG5cbiAgICBjb25zdCB0cmFuc2FjdGlvbiA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgICBqb2luS2V5KFRSQU5TQUNUSU9OU19GT0xERVIsIGlkKSxcbiAgICApO1xuXG4gICAgaWYgKGlzRGVsZXRlKHQpKSB7XG4gICAgICB0LnJlY29yZCA9IHRyYW5zYWN0aW9uLnJlY29yZDtcbiAgICAgIHQudmVyaWZpZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHQ7XG4gICAgfVxuXG4gICAgY29uc3QgcmVjID0gYXdhaXQgX2xvYWQoXG4gICAgICBhcHAsXG4gICAgICB0cmFuc2FjdGlvbi5yZWNvcmRLZXksXG4gICAgKTtcbiAgICBpZiAocmVjLnRyYW5zYWN0aW9uSWQgPT09IGlkKSB7XG4gICAgICB0LnJlY29yZCA9IHJlYztcbiAgICAgIGlmICh0cmFuc2FjdGlvbi5vbGRSZWNvcmQpIHsgdC5vbGRSZWNvcmQgPSB0cmFuc2FjdGlvbi5vbGRSZWNvcmQ7IH1cbiAgICAgIHQudmVyaWZpZWQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0LnZlcmlmaWVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHQ7XG4gIH07XG5cbiAgY29uc3QgcGlja09uZSA9IGFzeW5jICh0cmFucywgZm9yVHlwZSkgPT4ge1xuICAgIGNvbnN0IHRyYW5zRm9yVHlwZSA9IGZpbHRlcihmb3JUeXBlKSh0cmFucyk7XG4gICAgaWYgKHRyYW5zRm9yVHlwZS5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNvbnN0IHQgPSBhd2FpdCB2ZXJpZnkodHJhbnNGb3JUeXBlWzBdKTtcbiAgICAgIHJldHVybiAodC52ZXJpZmllZCA9PT0gdHJ1ZSA/IHQgOiBudWxsKTtcbiAgICB9XG4gICAgZm9yIChsZXQgdCBvZiB0cmFuc0ZvclR5cGUpIHtcbiAgICAgIHQgPSBhd2FpdCB2ZXJpZnkodCk7XG4gICAgICBpZiAodC52ZXJpZmllZCA9PT0gdHJ1ZSkgeyByZXR1cm4gdDsgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIGZvciAoY29uc3QgcmVjb3JkSWQgaW4gdHJhbnNhY3Rpb25JZHNCeVJlY29yZCkge1xuICAgIGNvbnN0IHRyYW5zSWRzRm9yUmVjb3JkID0gdHJhbnNhY3Rpb25JZHNCeVJlY29yZFtyZWNvcmRJZF07XG4gICAgaWYgKHRyYW5zSWRzRm9yUmVjb3JkLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY29uc3QgdCA9IGF3YWl0IHZlcmlmeSh0cmFuc0lkc0ZvclJlY29yZFswXSk7XG4gICAgICBpZiAodC52ZXJpZmllZCkgeyBkZWR1cGVkVHJhbnNhY3Rpb25zLnB1c2godCk7IH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoc29tZShpc0RlbGV0ZSkodHJhbnNJZHNGb3JSZWNvcmQpKSB7XG4gICAgICBjb25zdCB0ID0gYXdhaXQgdmVyaWZ5KGZpbmQoaXNEZWxldGUpKHRyYW5zSWRzRm9yUmVjb3JkKSk7XG4gICAgICBpZiAodC52ZXJpZmllZCkgeyBkZWR1cGVkVHJhbnNhY3Rpb25zLnB1c2godCk7IH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoc29tZShpc1VwZGF0ZSkodHJhbnNJZHNGb3JSZWNvcmQpKSB7XG4gICAgICBjb25zdCB1cGQgPSBhd2FpdCBwaWNrT25lKHRyYW5zSWRzRm9yUmVjb3JkLCBpc1VwZGF0ZSk7XG4gICAgICBpZiAoaXNTb21ldGhpbmcodXBkKSAmJiB1cGQudmVyaWZpZWQpIHsgZGVkdXBlZFRyYW5zYWN0aW9ucy5wdXNoKHVwZCk7IH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoc29tZShpc0NyZWF0ZSkodHJhbnNJZHNGb3JSZWNvcmQpKSB7XG4gICAgICBjb25zdCBjcmUgPSBhd2FpdCBwaWNrT25lKHRyYW5zSWRzRm9yUmVjb3JkLCBpc0NyZWF0ZSk7XG4gICAgICBpZiAoaXNTb21ldGhpbmcoY3JlKSkgeyBkZWR1cGVkVHJhbnNhY3Rpb25zLnB1c2goY3JlKTsgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZHVwbGljYXRlcyA9ICQodHJhbnNhY3Rpb25JZHMsIFtcbiAgICBmaWx0ZXIodCA9PiBub25lKGRkdCA9PiBkZHQudW5pcXVlSWQgPT09IHQudW5pcXVlSWQpKGRlZHVwZWRUcmFuc2FjdGlvbnMpKSxcbiAgXSk7XG5cblxuICBjb25zdCBkZWxldGVQcm9taXNlcyA9IG1hcCh0ID0+IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShcbiAgICBqb2luS2V5KFxuICAgICAgVFJBTlNBQ1RJT05TX0ZPTERFUixcbiAgICAgIGdldFRyYW5zYWN0aW9uSWQoXG4gICAgICAgIHQucmVjb3JkSWQsXG4gICAgICAgIHQudHJhbnNhY3Rpb25UeXBlLFxuICAgICAgICB0LnVuaXF1ZUlkLFxuICAgICAgKSxcbiAgICApLFxuICApKShkdXBsaWNhdGVzKTtcblxuICBhd2FpdCBQcm9taXNlLmFsbChkZWxldGVQcm9taXNlcyk7XG5cbiAgcmV0dXJuIGRlZHVwZWRUcmFuc2FjdGlvbnM7XG59O1xuXG5jb25zdCBwYXJzZVRyYW5zYWN0aW9uSWQgPSAoaWQpID0+IHtcbiAgY29uc3Qgc3BsaXRJZCA9IHNwbGl0KGlkU2VwKShpZCk7XG4gIHJldHVybiAoe1xuICAgIHJlY29yZElkOiBzcGxpdElkWzBdLFxuICAgIHRyYW5zYWN0aW9uVHlwZTogc3BsaXRJZFsxXSxcbiAgICB1bmlxdWVJZDogc3BsaXRJZFsyXSxcbiAgICBmdWxsSWQ6IGlkLFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBvcmRlckJ5IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7XG4gIHJlZHVjZSwgZmluZCwgaW5jbHVkZXMsIGZsYXR0ZW4sIHVuaW9uLFxuICBmaWx0ZXIsIGVhY2gsIG1hcCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIGpvaW5LZXksIHNwbGl0S2V5LCBpc05vbkVtcHR5U3RyaW5nLFxuICBpc05vdGhpbmcsICQsIGlzU29tZXRoaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LCBnZXROb2RlLCBnZXRSZWNvcmROb2RlSWQsXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsIHJlY29yZE5vZGVJZElzQWxsb3dlZCxcbiAgaXNSZWNvcmQsIGlzR2xvYmFsSW5kZXgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBpbmRleFR5cGVzIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaW5kZXhlcyc7XG5cbmV4cG9ydCBjb25zdCBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcyA9IChhcHBIaWVyYXJjaHksIHJlY29yZCkgPT4ge1xuICBjb25zdCBrZXkgPSByZWNvcmQua2V5O1xuICBjb25zdCBrZXlQYXJ0cyA9IHNwbGl0S2V5KGtleSk7XG4gIGNvbnN0IG5vZGVJZCA9IGdldFJlY29yZE5vZGVJZChrZXkpO1xuXG4gIGNvbnN0IGZsYXRIaWVyYXJjaHkgPSBvcmRlckJ5KGdldEZsYXR0ZW5lZEhpZXJhcmNoeShhcHBIaWVyYXJjaHkpLFxuICAgIFtub2RlID0+IG5vZGUucGF0aFJlZ3goKS5sZW5ndGhdLFxuICAgIFsnZGVzYyddKTtcblxuICBjb25zdCBtYWtlaW5kZXhOb2RlQW5kS2V5X0ZvckFuY2VzdG9ySW5kZXggPSAoaW5kZXhOb2RlLCBpbmRleEtleSkgPT4gbWFrZUluZGV4Tm9kZUFuZEtleShpbmRleE5vZGUsIGpvaW5LZXkoaW5kZXhLZXksIGluZGV4Tm9kZS5uYW1lKSk7XG5cbiAgY29uc3QgdHJhdmVyc2VBbmNlc3RvckluZGV4ZXNJblBhdGggPSAoKSA9PiByZWR1Y2UoKGFjYywgcGFydCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRJbmRleEtleSA9IGpvaW5LZXkoYWNjLmxhc3RJbmRleEtleSwgcGFydCk7XG4gICAgYWNjLmxhc3RJbmRleEtleSA9IGN1cnJlbnRJbmRleEtleTtcbiAgICBjb25zdCB0ZXN0UGF0aFJlZ3ggPSBwID0+IG5ldyBSZWdFeHAoYCR7cC5wYXRoUmVneCgpfSRgKS50ZXN0KGN1cnJlbnRJbmRleEtleSk7XG4gICAgY29uc3Qgbm9kZU1hdGNoID0gZmluZCh0ZXN0UGF0aFJlZ3gpKGZsYXRIaWVyYXJjaHkpO1xuXG4gICAgaWYgKGlzTm90aGluZyhub2RlTWF0Y2gpKSB7IHJldHVybiBhY2M7IH1cblxuICAgIGlmICghaXNSZWNvcmQobm9kZU1hdGNoKVxuICAgICAgICAgICAgICAgIHx8IG5vZGVNYXRjaC5pbmRleGVzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gYWNjOyB9XG5cbiAgICBjb25zdCBpbmRleGVzID0gJChub2RlTWF0Y2guaW5kZXhlcywgW1xuICAgICAgZmlsdGVyKGkgPT4gaS5pbmRleFR5cGUgPT09IGluZGV4VHlwZXMuYW5jZXN0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIChpLmFsbG93ZWRSZWNvcmROb2RlSWRzLmxlbmd0aCA9PT0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGluY2x1ZGVzKG5vZGVJZCkoaS5hbGxvd2VkUmVjb3JkTm9kZUlkcykpKSxcbiAgICBdKTtcblxuICAgIGVhY2godiA9PiBhY2Mubm9kZXNBbmRLZXlzLnB1c2goXG4gICAgICBtYWtlaW5kZXhOb2RlQW5kS2V5X0ZvckFuY2VzdG9ySW5kZXgodiwgY3VycmVudEluZGV4S2V5KSxcbiAgICApKShpbmRleGVzKTtcblxuICAgIHJldHVybiBhY2M7XG4gIH0sIHsgbGFzdEluZGV4S2V5OiAnJywgbm9kZXNBbmRLZXlzOiBbXSB9KShrZXlQYXJ0cykubm9kZXNBbmRLZXlzO1xuXG4gIGNvbnN0IHJvb3RJbmRleGVzID0gJChmbGF0SGllcmFyY2h5LCBbXG4gICAgZmlsdGVyKG4gPT4gaXNHbG9iYWxJbmRleChuKSAmJiByZWNvcmROb2RlSWRJc0FsbG93ZWQobikobm9kZUlkKSksXG4gICAgbWFwKGkgPT4gbWFrZUluZGV4Tm9kZUFuZEtleShpLCBpLm5vZGVLZXkoKSkpLFxuICBdKTtcblxuICByZXR1cm4gdW5pb24odHJhdmVyc2VBbmNlc3RvckluZGV4ZXNJblBhdGgoKSkocm9vdEluZGV4ZXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFJlbGV2YW50UmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMgPSAoYXBwSGllcmFyY2h5LCByZWNvcmQpID0+ICQocmVjb3JkLmtleSwgW1xuICBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcEhpZXJhcmNoeSksXG4gIG4gPT4gbi5maWVsZHMsXG4gIGZpbHRlcihmID0+IGYudHlwZSA9PT0gJ3JlZmVyZW5jZSdcbiAgICAgICAgICAgICAgICAgICAgJiYgaXNTb21ldGhpbmcocmVjb3JkW2YubmFtZV0pXG4gICAgICAgICAgICAgICAgICAgICYmIGlzTm9uRW1wdHlTdHJpbmcocmVjb3JkW2YubmFtZV0ua2V5KSksXG4gIG1hcChmID0+ICQoZi50eXBlT3B0aW9ucy5yZXZlcnNlSW5kZXhOb2RlS2V5cywgW1xuICAgIG1hcChuID0+ICh7XG4gICAgICByZWNvcmROb2RlOiBnZXROb2RlKGFwcEhpZXJhcmNoeSwgbiksXG4gICAgICBmaWVsZDogZixcbiAgICB9KSksXG4gIF0pKSxcbiAgZmxhdHRlbixcbiAgbWFwKG4gPT4gbWFrZUluZGV4Tm9kZUFuZEtleShcbiAgICBuLnJlY29yZE5vZGUsXG4gICAgam9pbktleShyZWNvcmRbbi5maWVsZC5uYW1lXS5rZXksIG4ucmVjb3JkTm9kZS5uYW1lKSxcbiAgKSksXG5dKTtcblxuY29uc3QgbWFrZUluZGV4Tm9kZUFuZEtleSA9IChpbmRleE5vZGUsIGluZGV4S2V5KSA9PiAoeyBpbmRleE5vZGUsIGluZGV4S2V5IH0pO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcztcbiIsIiAgLy8gYWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXg0ZXIvanMtcHJvbWlzZS13cml0YWJsZVxuICAvLyBUaGFuayB5b3UgOikgXG4gIGV4cG9ydCBjb25zdCBwcm9taXNlV3JpdGVhYmxlU3RyZWFtID0gc3RyZWFtID0+IHtcbiAgXG4gICAgbGV0IF9lcnJvcmVkO1xuICBcbiAgICBjb25zdCBfZXJyb3JIYW5kbGVyID0gZXJyID0+IHtcbiAgICAgICAgX2Vycm9yZWQgPSBlcnI7XG4gICAgfTtcblxuICAgIHN0cmVhbS5vbihcImVycm9yXCIsIF9lcnJvckhhbmRsZXIpOyAgICBcbiAgXG4gICAgY29uc3Qgd3JpdGUgPSBjaHVuayA9PiB7ICBcbiAgICAgIGxldCByZWplY3RlZCA9IGZhbHNlO1xuICBcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGlmIChfZXJyb3JlZCkge1xuICAgICAgICAgIGNvbnN0IGVyciA9IF9lcnJvcmVkO1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgaWYgKCFzdHJlYW0ud3JpdGFibGUgfHwgc3RyZWFtLmNsb3NlZCB8fCBzdHJlYW0uZGVzdHJveWVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJ3cml0ZSBhZnRlciBlbmRcIikpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCB3cml0ZUVycm9ySGFuZGxlciA9IGVyciA9PiB7XG4gICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmVqZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBzdHJlYW0ub25jZShcImVycm9yXCIsIHdyaXRlRXJyb3JIYW5kbGVyKTtcbiAgXG4gICAgICAgIGNvbnN0IGNhbldyaXRlID0gc3RyZWFtLndyaXRlKGNodW5rKTtcbiAgXG4gICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIHdyaXRlRXJyb3JIYW5kbGVyKTtcbiAgXG4gICAgICAgIGlmIChjYW5Xcml0ZSkge1xuICAgICAgICAgIGlmICghcmVqZWN0ZWQpIHtcbiAgICAgICAgICAgIHJlc29sdmUoY2h1bmsubGVuZ3RoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgZXJyb3JIYW5kbGVyID0gZXJyID0+IHtcbiAgICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIGNvbnN0IGRyYWluSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVzb2x2ZShjaHVuay5sZW5ndGgpO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgY29uc3QgY2xvc2VIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICByZXNvbHZlKGNodW5rLmxlbmd0aCk7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICBjb25zdCBmaW5pc2hIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICByZXNvbHZlKGNodW5rLmxlbmd0aCk7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICBjb25zdCByZW1vdmVMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJjbG9zZVwiLCBjbG9zZUhhbmRsZXIpO1xuICAgICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZHJhaW5cIiwgZHJhaW5IYW5kbGVyKTtcbiAgICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gICAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJmaW5pc2hcIiwgZmluaXNoSGFuZGxlcik7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICBzdHJlYW0ub24oXCJjbG9zZVwiLCBjbG9zZUhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5vbihcImRyYWluXCIsIGRyYWluSGFuZGxlcik7XG4gICAgICAgICAgc3RyZWFtLm9uKFwiZXJyb3JcIiwgZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ub24oXCJmaW5pc2hcIiwgZmluaXNoSGFuZGxlcik7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICBcbiAgICBjb25zdCBlbmQgPSAoKSA9PiB7XG4gIFxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKF9lcnJvcmVkKSB7XG4gICAgICAgICAgY29uc3QgZXJyID0gX2Vycm9yZWQ7XG4gICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBpZiAoIXN0cmVhbS53cml0YWJsZSB8fCBzdHJlYW0uY2xvc2VkIHx8IHN0cmVhbS5kZXN0cm95ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCBmaW5pc2hIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgZXJyb3JIYW5kbGVyID0gKGVycikgPT4ge1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCByZW1vdmVMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJmaW5pc2hcIiwgZmluaXNoSGFuZGxlcik7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIHN0cmVhbS5vbihcImZpbmlzaFwiLCBmaW5pc2hIYW5kbGVyKTtcbiAgICAgICAgc3RyZWFtLm9uKFwiZXJyb3JcIiwgZXJyb3JIYW5kbGVyKTtcbiAgXG4gICAgICAgIHN0cmVhbS5lbmQoKTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHt3cml0ZSwgZW5kfTtcbiAgfVxuICBcbiAgZXhwb3J0IGRlZmF1bHQgcHJvbWlzZVdyaXRlYWJsZVN0cmVhbVxuICAiLCJpbXBvcnQgeyBlbnN1cmVTaGFyZE5hbWVJc0luU2hhcmRNYXAgfSBmcm9tICcuL3NoYXJkaW5nJztcbmltcG9ydCB7IGdldEluZGV4V3JpdGVyIH0gZnJvbSAnLi9zZXJpYWxpemVyJztcbmltcG9ydCB7IGlzU2hhcmRlZEluZGV4IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7cHJvbWlzZVdyaXRlYWJsZVN0cmVhbX0gZnJvbSBcIi4vcHJvbWlzZVdyaXRhYmxlU3RyZWFtXCI7XG5pbXBvcnQge3Byb21pc2VSZWFkYWJsZVN0cmVhbX0gZnJvbSBcIi4vcHJvbWlzZVJlYWRhYmxlU3RyZWFtXCI7XG5cbmV4cG9ydCBjb25zdCBhcHBseVRvU2hhcmQgPSBhc3luYyAoaGllcmFyY2h5LCBzdG9yZSwgaW5kZXhLZXksXG4gIGluZGV4Tm9kZSwgaW5kZXhTaGFyZEtleSwgcmVjb3Jkc1RvV3JpdGUsIGtleXNUb1JlbW92ZSkgPT4ge1xuICBjb25zdCBjcmVhdGVJZk5vdEV4aXN0cyA9IHJlY29yZHNUb1dyaXRlLmxlbmd0aCA+IDA7XG4gIGNvbnN0IHdyaXRlciA9IGF3YWl0IGdldFdyaXRlcihoaWVyYXJjaHksIHN0b3JlLCBpbmRleEtleSwgaW5kZXhTaGFyZEtleSwgaW5kZXhOb2RlLCBjcmVhdGVJZk5vdEV4aXN0cyk7XG4gIGlmICh3cml0ZXIgPT09IFNIQVJEX0RFTEVURUQpIHJldHVybjtcblxuICBhd2FpdCB3cml0ZXIudXBkYXRlSW5kZXgocmVjb3Jkc1RvV3JpdGUsIGtleXNUb1JlbW92ZSk7XG4gIGF3YWl0IHN3YXBUZW1wRmlsZUluKHN0b3JlLCBpbmRleFNoYXJkS2V5KTtcbn07XG5cbmNvbnN0IFNIQVJEX0RFTEVURUQgPSAnU0hBUkRfREVMRVRFRCc7XG5jb25zdCBnZXRXcml0ZXIgPSBhc3luYyAoaGllcmFyY2h5LCBzdG9yZSwgaW5kZXhLZXksIGluZGV4ZWREYXRhS2V5LCBpbmRleE5vZGUsIGNyZWF0ZUlmTm90RXhpc3RzKSA9PiB7XG4gIGxldCByZWFkYWJsZVN0cmVhbSA9IG51bGw7XG5cbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICBhd2FpdCBlbnN1cmVTaGFyZE5hbWVJc0luU2hhcmRNYXAoc3RvcmUsIGluZGV4S2V5LCBpbmRleGVkRGF0YUtleSk7XG4gICAgaWYoIWF3YWl0IHN0b3JlLmV4aXN0cyhpbmRleGVkRGF0YUtleSkpIHtcbiAgICAgIGF3YWl0IHN0b3JlLmNyZWF0ZUZpbGUoaW5kZXhlZERhdGFLZXksIFwiXCIpO1xuICAgIH1cbiAgfVxuXG4gIHRyeSB7XG5cbiAgICByZWFkYWJsZVN0cmVhbSA9IHByb21pc2VSZWFkYWJsZVN0cmVhbShcbiAgICAgICAgYXdhaXQgc3RvcmUucmVhZGFibGVGaWxlU3RyZWFtKGluZGV4ZWREYXRhS2V5KVxuICAgICk7XG5cbiAgfSBjYXRjaCAoZSkge1xuXG4gICAgaWYgKGF3YWl0IHN0b3JlLmV4aXN0cyhpbmRleGVkRGF0YUtleSkpIHtcbiAgICAgIHRocm93IGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjcmVhdGVJZk5vdEV4aXN0cykgeyBcbiAgICAgICAgYXdhaXQgc3RvcmUuY3JlYXRlRmlsZShpbmRleGVkRGF0YUtleSwgJycpOyBcbiAgICAgIH0gZWxzZSB7IFxuICAgICAgICByZXR1cm4gU0hBUkRfREVMRVRFRDsgXG4gICAgICB9XG5cbiAgICAgIHJlYWRhYmxlU3RyZWFtID0gcHJvbWlzZVJlYWRhYmxlU3RyZWFtKFxuICAgICAgICAgIGF3YWl0IHN0b3JlLnJlYWRhYmxlRmlsZVN0cmVhbShpbmRleGVkRGF0YUtleSlcbiAgICAgICk7XG5cbiAgICB9XG4gIH1cblxuICBjb25zdCB3cml0YWJsZVN0cmVhbSA9IHByb21pc2VXcml0ZWFibGVTdHJlYW0oXG4gICAgICBhd2FpdCBzdG9yZS53cml0YWJsZUZpbGVTdHJlYW0oaW5kZXhlZERhdGFLZXkgKyBcIi50ZW1wXCIpXG4gICk7XG5cbiAgcmV0dXJuIGdldEluZGV4V3JpdGVyKFxuICAgIGhpZXJhcmNoeSwgaW5kZXhOb2RlLFxuICAgICAgICByZWFkYWJsZVN0cmVhbSwgd3JpdGFibGVTdHJlYW1cbiAgKTtcbn07XG5cbmNvbnN0IHN3YXBUZW1wRmlsZUluID0gYXN5bmMgKHN0b3JlLCBpbmRleGVkRGF0YUtleSwgaXNSZXRyeSA9IGZhbHNlKSA9PiB7XG4gIGNvbnN0IHRlbXBGaWxlID0gYCR7aW5kZXhlZERhdGFLZXl9LnRlbXBgO1xuICB0cnkge1xuICAgIGF3YWl0IHN0b3JlLmRlbGV0ZUZpbGUoaW5kZXhlZERhdGFLZXkpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gaWdub3JlIGZhaWx1cmUsIGluY2FzZSBpdCBoYXMgbm90IGJlZW4gY3JlYXRlZCB5ZXRcbiAgfVxuICB0cnkge1xuICAgIGF3YWl0IHN0b3JlLnJlbmFtZUZpbGUodGVtcEZpbGUsIGluZGV4ZWREYXRhS2V5KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIHJldHJ5aW5nIGluIGNhc2UgZGVsZXRlIGZhaWx1cmUgd2FzIGZvciBzb21lIG90aGVyIHJlYXNvblxuICAgIGlmICghaXNSZXRyeSkge1xuICAgICAgYXdhaXQgc3dhcFRlbXBGaWxlSW4oc3RvcmUsIGluZGV4ZWREYXRhS2V5LCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIHN3YXAgaW4gaW5kZXggZmlsZWQ6IFwiICsgZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBmaWx0ZXIsIG1hcCwgaXNVbmRlZmluZWQsIGluY2x1ZGVzLFxuICBmbGF0dGVuLCBpbnRlcnNlY3Rpb25CeSxcbiAgaXNFcXVhbCwgcHVsbCwga2V5cyxcbiAgZGlmZmVyZW5jZUJ5LCBkaWZmZXJlbmNlLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgdW5pb24gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgZ2V0UmVsZXZhbnRBbmNlc3RvckluZGV4ZXMsXG4gIGdldFJlbGV2YW50UmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMsXG59IGZyb20gJy4uL2luZGV4aW5nL3JlbGV2YW50JztcbmltcG9ydCB7IGV2YWx1YXRlIH0gZnJvbSAnLi4vaW5kZXhpbmcvZXZhbHVhdGUnO1xuaW1wb3J0IHtcbiAgJCwgaXNTb21ldGhpbmcsXG4gIGlzTm9uRW1wdHlBcnJheSwgam9pbktleSxcbiAgaXNOb25FbXB0eVN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldEluZGV4ZWREYXRhS2V5IH0gZnJvbSAnLi4vaW5kZXhpbmcvc2hhcmRpbmcnO1xuaW1wb3J0IHtcbiAgaXNVcGRhdGUsIGlzQ3JlYXRlLFxuICBpc0RlbGV0ZSwgaXNCdWlsZEluZGV4LFxufSBmcm9tICcuL3RyYW5zYWN0aW9uc0NvbW1vbic7XG5pbXBvcnQgeyBhcHBseVRvU2hhcmQgfSBmcm9tICcuLi9pbmRleGluZy9hcHBseSc7XG5pbXBvcnQge1xuICBnZXRBY3R1YWxLZXlPZlBhcmVudCxcbiAgaXNHbG9iYWxJbmRleCwgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXgsIGlzUmVmZXJlbmNlSW5kZXgsXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5cbmV4cG9ydCBjb25zdCBleGVjdXRlVHJhbnNhY3Rpb25zID0gYXBwID0+IGFzeW5jICh0cmFuc2FjdGlvbnMpID0+IHtcbiAgY29uc3QgcmVjb3Jkc0J5U2hhcmQgPSBtYXBwZWRSZWNvcmRzQnlJbmRleFNoYXJkKGFwcC5oaWVyYXJjaHksIHRyYW5zYWN0aW9ucyk7XG5cbiAgZm9yIChjb25zdCBzaGFyZCBvZiBrZXlzKHJlY29yZHNCeVNoYXJkKSkge1xuICAgIGF3YWl0IGFwcGx5VG9TaGFyZChcbiAgICAgIGFwcC5oaWVyYXJjaHksIGFwcC5kYXRhc3RvcmUsXG4gICAgICByZWNvcmRzQnlTaGFyZFtzaGFyZF0uaW5kZXhLZXksXG4gICAgICByZWNvcmRzQnlTaGFyZFtzaGFyZF0uaW5kZXhOb2RlLFxuICAgICAgc2hhcmQsXG4gICAgICByZWNvcmRzQnlTaGFyZFtzaGFyZF0ud3JpdGVzLFxuICAgICAgcmVjb3Jkc0J5U2hhcmRbc2hhcmRdLnJlbW92ZXMsXG4gICAgKTtcbiAgfVxufTtcblxuY29uc3QgbWFwcGVkUmVjb3Jkc0J5SW5kZXhTaGFyZCA9IChoaWVyYXJjaHksIHRyYW5zYWN0aW9ucykgPT4ge1xuICBjb25zdCB1cGRhdGVzID0gZ2V0VXBkYXRlVHJhbnNhY3Rpb25zQnlTaGFyZChcbiAgICBoaWVyYXJjaHksIHRyYW5zYWN0aW9ucyxcbiAgKTtcblxuICBjb25zdCBjcmVhdGVkID0gZ2V0Q3JlYXRlVHJhbnNhY3Rpb25zQnlTaGFyZChcbiAgICBoaWVyYXJjaHksIHRyYW5zYWN0aW9ucyxcbiAgKTtcbiAgY29uc3QgZGVsZXRlcyA9IGdldERlbGV0ZVRyYW5zYWN0aW9uc0J5U2hhcmQoXG4gICAgaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMsXG4gICk7XG5cbiAgY29uc3QgaW5kZXhCdWlsZCA9IGdldEJ1aWxkSW5kZXhUcmFuc2FjdGlvbnNCeVNoYXJkKFxuICAgIGhpZXJhcmNoeSxcbiAgICB0cmFuc2FjdGlvbnMsXG4gICk7XG5cbiAgY29uc3QgdG9SZW1vdmUgPSBbXG4gICAgLi4uZGVsZXRlcyxcbiAgICAuLi51cGRhdGVzLnRvUmVtb3ZlLFxuICBdO1xuXG4gIGNvbnN0IHRvV3JpdGUgPSBbXG4gICAgLi4uY3JlYXRlZCxcbiAgICAuLi51cGRhdGVzLnRvV3JpdGUsXG4gICAgLi4uaW5kZXhCdWlsZCxcbiAgXTtcblxuICBjb25zdCB0cmFuc0J5U2hhcmQgPSB7fTtcblxuICBjb25zdCBpbml0aWFsaXNlU2hhcmQgPSAodCkgPT4ge1xuICAgIGlmIChpc1VuZGVmaW5lZCh0cmFuc0J5U2hhcmRbdC5pbmRleFNoYXJkS2V5XSkpIHtcbiAgICAgIHRyYW5zQnlTaGFyZFt0LmluZGV4U2hhcmRLZXldID0ge1xuICAgICAgICB3cml0ZXM6IFtdLFxuICAgICAgICByZW1vdmVzOiBbXSxcbiAgICAgICAgaW5kZXhLZXk6IHQuaW5kZXhLZXksXG4gICAgICAgIGluZGV4Tm9kZUtleTogdC5pbmRleE5vZGVLZXksXG4gICAgICAgIGluZGV4Tm9kZTogdC5pbmRleE5vZGUsXG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuICBmb3IgKGNvbnN0IHRyYW5zIG9mIHRvV3JpdGUpIHtcbiAgICBpbml0aWFsaXNlU2hhcmQodHJhbnMpO1xuICAgIHRyYW5zQnlTaGFyZFt0cmFucy5pbmRleFNoYXJkS2V5XS53cml0ZXMucHVzaChcbiAgICAgIHRyYW5zLm1hcHBlZFJlY29yZC5yZXN1bHQsXG4gICAgKTtcbiAgfVxuXG4gIGZvciAoY29uc3QgdHJhbnMgb2YgdG9SZW1vdmUpIHtcbiAgICBpbml0aWFsaXNlU2hhcmQodHJhbnMpO1xuICAgIHRyYW5zQnlTaGFyZFt0cmFucy5pbmRleFNoYXJkS2V5XS5yZW1vdmVzLnB1c2goXG4gICAgICB0cmFucy5tYXBwZWRSZWNvcmQucmVzdWx0LmtleSxcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIHRyYW5zQnlTaGFyZDtcbn07XG5cbmNvbnN0IGdldFVwZGF0ZVRyYW5zYWN0aW9uc0J5U2hhcmQgPSAoaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMpID0+IHtcbiAgY29uc3QgdXBkYXRlVHJhbnNhY3Rpb25zID0gJCh0cmFuc2FjdGlvbnMsIFtmaWx0ZXIoaXNVcGRhdGUpXSk7XG5cbiAgY29uc3QgZXZhbHVhdGVJbmRleCA9IChyZWNvcmQsIGluZGV4Tm9kZUFuZFBhdGgpID0+IHtcbiAgICBjb25zdCBtYXBwZWRSZWNvcmQgPSBldmFsdWF0ZShyZWNvcmQpKGluZGV4Tm9kZUFuZFBhdGguaW5kZXhOb2RlKTtcbiAgICByZXR1cm4gKHtcbiAgICAgIG1hcHBlZFJlY29yZCxcbiAgICAgIGluZGV4Tm9kZTogaW5kZXhOb2RlQW5kUGF0aC5pbmRleE5vZGUsXG4gICAgICBpbmRleEtleTogaW5kZXhOb2RlQW5kUGF0aC5pbmRleEtleSxcbiAgICAgIGluZGV4U2hhcmRLZXk6IGdldEluZGV4ZWREYXRhS2V5KFxuICAgICAgICBpbmRleE5vZGVBbmRQYXRoLmluZGV4Tm9kZSxcbiAgICAgICAgaW5kZXhOb2RlQW5kUGF0aC5pbmRleEtleSxcbiAgICAgICAgbWFwcGVkUmVjb3JkLnJlc3VsdCxcbiAgICAgICksXG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkgPSBpbmRleEZpbHRlciA9PiAodCwgaW5kZXhlcykgPT4gJChpbmRleGVzLCBbXG4gICAgbWFwKG4gPT4gKHtcbiAgICAgIG9sZDogZXZhbHVhdGVJbmRleCh0Lm9sZFJlY29yZCwgbiksXG4gICAgICBuZXc6IGV2YWx1YXRlSW5kZXgodC5yZWNvcmQsIG4pLFxuICAgIH0pKSxcbiAgICBmaWx0ZXIoaW5kZXhGaWx0ZXIpLFxuICBdKTtcblxuICBjb25zdCB0b1JlbW92ZUZpbHRlciA9IChuLCBpc1VucmVmZXJlbmNlZCkgPT4gbi5vbGQubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gdHJ1ZVxuICAgICAgICAmJiAobi5uZXcubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gZmFsc2VcbiAgICAgICAgICAgIHx8IGlzVW5yZWZlcmVuY2VkKTtcblxuICBjb25zdCB0b0FkZEZpbHRlciA9IChuLCBpc05ld2x5UmVmZXJlbmNlZCkgPT4gKG4ub2xkLm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IGZhbHNlXG4gICAgICAgIHx8IGlzTmV3bHlSZWZlcmVuY2VkKVxuICAgICAgICAmJiBuLm5ldy5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSB0cnVlO1xuXG4gIGNvbnN0IHRvVXBkYXRlRmlsdGVyID0gbiA9PiBuLm5ldy5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSB0cnVlXG4gICAgICAgICYmIG4ub2xkLm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IHRydWVcbiAgICAgICAgJiYgIWlzRXF1YWwobi5vbGQubWFwcGVkUmVjb3JkLnJlc3VsdCxcbiAgICAgICAgICBuLm5ldy5tYXBwZWRSZWNvcmQucmVzdWx0KTtcblxuICBjb25zdCB0b1JlbW92ZSA9IFtdO1xuICBjb25zdCB0b1dyaXRlID0gW107XG5cbiAgZm9yIChjb25zdCB0IG9mIHVwZGF0ZVRyYW5zYWN0aW9ucykge1xuICAgIGNvbnN0IGFuY2VzdG9ySWR4cyA9IGdldFJlbGV2YW50QW5jZXN0b3JJbmRleGVzKFxuICAgICAgaGllcmFyY2h5LCB0LnJlY29yZCxcbiAgICApO1xuXG4gICAgY29uc3QgcmVmZXJlbmNlQ2hhbmdlcyA9IGRpZmZSZXZlcnNlUmVmRm9yVXBkYXRlKFxuICAgICAgaGllcmFyY2h5LCB0Lm9sZFJlY29yZCwgdC5yZWNvcmQsXG4gICAgKTtcblxuICAgIC8vIG9sZCByZWNvcmRzIHRvIHJlbW92ZSAoZmlsdGVyZWQgb3V0KVxuICAgIGNvbnN0IGZpbHRlcmVkT3V0X3RvUmVtb3ZlID0gdW5pb24oXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b1JlbW92ZUZpbHRlcikodCwgYW5jZXN0b3JJZHhzKSxcbiAgICAgIC8vIHN0aWxsIHJlZmVyZW5jZWQgLSBjaGVjayBmaWx0ZXJcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvUmVtb3ZlRmlsdGVyKSh0LCByZWZlcmVuY2VDaGFuZ2VzLm5vdENoYW5nZWQpLFxuICAgICAgLy8gdW4gcmVmZXJlbmNlZCAtIHJlbW92ZSBpZiBpbiB0aGVyZSBhbHJlYWR5XG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseShuID0+IHRvUmVtb3ZlRmlsdGVyKG4sIHRydWUpKSh0LCByZWZlcmVuY2VDaGFuZ2VzLnVuUmVmZXJlbmNlZCksXG4gICAgKTtcblxuICAgIC8vIG5ldyByZWNvcmRzIHRvIGFkZCAoZmlsdGVyZWQgaW4pXG4gICAgY29uc3QgZmlsdGVyZWRJbl90b0FkZCA9IHVuaW9uKFxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodG9BZGRGaWx0ZXIpKHQsIGFuY2VzdG9ySWR4cyksXG4gICAgICAvLyBuZXdseSByZWZlcmVuY2VkIC0gY2hlY2sgZmlsdGVyXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseShuID0+IHRvQWRkRmlsdGVyKG4sIHRydWUpKSh0LCByZWZlcmVuY2VDaGFuZ2VzLm5ld2x5UmVmZXJlbmNlZCksXG4gICAgICAvLyByZWZlcmVuY2UgdW5jaGFuZ2VkIC0gcmVydW4gZmlsdGVyIGluIGNhc2Ugc29tZXRoaW5nIGVsc2UgY2hhbmdlZFxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodG9BZGRGaWx0ZXIpKHQsIHJlZmVyZW5jZUNoYW5nZXMubm90Q2hhbmdlZCksXG4gICAgKTtcblxuICAgIGNvbnN0IGNoYW5nZWQgPSB1bmlvbihcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvVXBkYXRlRmlsdGVyKSh0LCBhbmNlc3RvcklkeHMpLFxuICAgICAgLy8gc3RpbGwgcmVmZXJlbmNlZCAtIHJlY2hlY2sgZmlsdGVyXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b1VwZGF0ZUZpbHRlcikodCwgcmVmZXJlbmNlQ2hhbmdlcy5ub3RDaGFuZ2VkKSxcbiAgICApO1xuXG4gICAgY29uc3Qgc2hhcmRLZXlDaGFuZ2VkID0gJChjaGFuZ2VkLCBbXG4gICAgICBmaWx0ZXIoYyA9PiBjLm9sZC5pbmRleFNoYXJkS2V5ICE9PSBjLm5ldy5pbmRleFNoYXJkS2V5KSxcbiAgICBdKTtcblxuICAgIGNvbnN0IGNoYW5nZWRJblNhbWVTaGFyZCA9ICQoc2hhcmRLZXlDaGFuZ2VkLCBbXG4gICAgICBkaWZmZXJlbmNlKGNoYW5nZWQpLFxuICAgIF0pO1xuXG4gICAgZm9yIChjb25zdCByZXMgb2Ygc2hhcmRLZXlDaGFuZ2VkKSB7XG4gICAgICBwdWxsKHJlcykoY2hhbmdlZCk7XG4gICAgICBmaWx0ZXJlZE91dF90b1JlbW92ZS5wdXNoKHJlcyk7XG4gICAgICBmaWx0ZXJlZEluX3RvQWRkLnB1c2gocmVzKTtcbiAgICB9XG5cbiAgICB0b1JlbW92ZS5wdXNoKFxuICAgICAgJChmaWx0ZXJlZE91dF90b1JlbW92ZSwgW1xuICAgICAgICBtYXAoaSA9PiBpLm9sZCksXG4gICAgICBdKSxcbiAgICApO1xuXG4gICAgdG9Xcml0ZS5wdXNoKFxuICAgICAgJChmaWx0ZXJlZEluX3RvQWRkLCBbXG4gICAgICAgIG1hcChpID0+IGkubmV3KSxcbiAgICAgIF0pLFxuICAgICk7XG5cbiAgICB0b1dyaXRlLnB1c2goXG4gICAgICAkKGNoYW5nZWRJblNhbWVTaGFyZCwgW1xuICAgICAgICBtYXAoaSA9PiBpLm5ldyksXG4gICAgICBdKSxcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuICh7XG4gICAgdG9SZW1vdmU6IGZsYXR0ZW4odG9SZW1vdmUpLFxuICAgIHRvV3JpdGU6IGZsYXR0ZW4odG9Xcml0ZSksXG4gIH0pO1xufTtcblxuY29uc3QgZ2V0QnVpbGRJbmRleFRyYW5zYWN0aW9uc0J5U2hhcmQgPSAoaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMpID0+IHtcbiAgY29uc3QgYnVpbGRUcmFuc2FjdGlvbnMgPSAkKHRyYW5zYWN0aW9ucywgW2ZpbHRlcihpc0J1aWxkSW5kZXgpXSk7XG4gIGlmICghaXNOb25FbXB0eUFycmF5KGJ1aWxkVHJhbnNhY3Rpb25zKSkgcmV0dXJuIFtdO1xuICBjb25zdCBpbmRleE5vZGUgPSB0cmFuc2FjdGlvbnMuaW5kZXhOb2RlO1xuXG4gIGNvbnN0IGdldEluZGV4S2V5cyA9ICh0KSA9PiB7XG4gICAgaWYgKGlzR2xvYmFsSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgICAgcmV0dXJuIFtpbmRleE5vZGUubm9kZUtleSgpXTtcbiAgICB9XG5cbiAgICBpZiAoaXNSZWZlcmVuY2VJbmRleChpbmRleE5vZGUpKSB7XG4gICAgICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChoaWVyYXJjaHkpKHQucmVjb3JkLmtleSk7XG4gICAgICBjb25zdCByZWZGaWVsZHMgPSAkKHJlY29yZE5vZGUuZmllbGRzLCBbXG4gICAgICAgIGZpbHRlcihmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleChpbmRleE5vZGUpKSxcbiAgICAgIF0pO1xuICAgICAgY29uc3QgaW5kZXhLZXlzID0gW107XG4gICAgICBmb3IgKGNvbnN0IHJlZkZpZWxkIG9mIHJlZkZpZWxkcykge1xuICAgICAgICBjb25zdCByZWZWYWx1ZSA9IHQucmVjb3JkW3JlZkZpZWxkLm5hbWVdO1xuICAgICAgICBpZiAoaXNTb21ldGhpbmcocmVmVmFsdWUpXG4gICAgICAgICAgICAgICAgICAgJiYgaXNOb25FbXB0eVN0cmluZyhyZWZWYWx1ZS5rZXkpKSB7XG4gICAgICAgICAgY29uc3QgaW5kZXhLZXkgPSBqb2luS2V5KFxuICAgICAgICAgICAgcmVmVmFsdWUua2V5LFxuICAgICAgICAgICAgaW5kZXhOb2RlLm5hbWUsXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmICghaW5jbHVkZXMoaW5kZXhLZXkpKGluZGV4S2V5cykpIHsgaW5kZXhLZXlzLnB1c2goaW5kZXhLZXkpOyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpbmRleEtleXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtqb2luS2V5KFxuICAgICAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQoXG4gICAgICAgIGluZGV4Tm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksXG4gICAgICAgIHQucmVjb3JkLmtleSxcbiAgICAgICksXG4gICAgICBpbmRleE5vZGUubmFtZSxcbiAgICApXTtcbiAgfTtcblxuICByZXR1cm4gJChidWlsZFRyYW5zYWN0aW9ucywgW1xuICAgIG1hcCgodCkgPT4ge1xuICAgICAgY29uc3QgbWFwcGVkUmVjb3JkID0gZXZhbHVhdGUodC5yZWNvcmQpKGluZGV4Tm9kZSk7XG4gICAgICBpZiAoIW1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIpIHJldHVybiBudWxsO1xuICAgICAgY29uc3QgaW5kZXhLZXlzID0gZ2V0SW5kZXhLZXlzKHQpO1xuICAgICAgcmV0dXJuICQoaW5kZXhLZXlzLCBbXG4gICAgICAgIG1hcChpbmRleEtleSA9PiAoe1xuICAgICAgICAgIG1hcHBlZFJlY29yZCxcbiAgICAgICAgICBpbmRleE5vZGUsXG4gICAgICAgICAgaW5kZXhLZXksXG4gICAgICAgICAgaW5kZXhTaGFyZEtleTogZ2V0SW5kZXhlZERhdGFLZXkoXG4gICAgICAgICAgICBpbmRleE5vZGUsXG4gICAgICAgICAgICBpbmRleEtleSxcbiAgICAgICAgICAgIG1hcHBlZFJlY29yZC5yZXN1bHQsXG4gICAgICAgICAgKSxcbiAgICAgICAgfSkpLFxuICAgICAgXSk7XG4gICAgfSksXG4gICAgZmxhdHRlbixcbiAgICBmaWx0ZXIoaXNTb21ldGhpbmcpLFxuICBdKTtcbn07XG5cbmNvbnN0IGdldF9DcmVhdGVfRGVsZXRlX1RyYW5zYWN0aW9uc0J5U2hhcmQgPSBwcmVkID0+IChoaWVyYXJjaHksIHRyYW5zYWN0aW9ucykgPT4ge1xuICBjb25zdCBjcmVhdGVUcmFuc2FjdGlvbnMgPSAkKHRyYW5zYWN0aW9ucywgW2ZpbHRlcihwcmVkKV0pO1xuXG4gIGNvbnN0IGdldEluZGV4Tm9kZXNUb0FwcGx5ID0gKHQsIGluZGV4ZXMpID0+ICQoaW5kZXhlcywgW1xuICAgIG1hcCgobikgPT4ge1xuICAgICAgY29uc3QgbWFwcGVkUmVjb3JkID0gZXZhbHVhdGUodC5yZWNvcmQpKG4uaW5kZXhOb2RlKTtcbiAgICAgIHJldHVybiAoe1xuICAgICAgICBtYXBwZWRSZWNvcmQsXG4gICAgICAgIGluZGV4Tm9kZTogbi5pbmRleE5vZGUsXG4gICAgICAgIGluZGV4S2V5OiBuLmluZGV4S2V5LFxuICAgICAgICBpbmRleFNoYXJkS2V5OiBnZXRJbmRleGVkRGF0YUtleShcbiAgICAgICAgICBuLmluZGV4Tm9kZSxcbiAgICAgICAgICBuLmluZGV4S2V5LFxuICAgICAgICAgIG1hcHBlZFJlY29yZC5yZXN1bHQsXG4gICAgICAgICksXG4gICAgICB9KTtcbiAgICB9KSxcbiAgICBmaWx0ZXIobiA9PiBuLm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIpLFxuICBdKTtcblxuICBjb25zdCBhbGxUb0FwcGx5ID0gW107XG5cbiAgZm9yIChjb25zdCB0IG9mIGNyZWF0ZVRyYW5zYWN0aW9ucykge1xuICAgIGNvbnN0IGFuY2VzdG9ySWR4cyA9IGdldFJlbGV2YW50QW5jZXN0b3JJbmRleGVzKGhpZXJhcmNoeSwgdC5yZWNvcmQpO1xuICAgIGNvbnN0IHJldmVyc2VSZWYgPSBnZXRSZWxldmFudFJldmVyc2VSZWZlcmVuY2VJbmRleGVzKGhpZXJhcmNoeSwgdC5yZWNvcmQpO1xuXG4gICAgYWxsVG9BcHBseS5wdXNoKFxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodCwgYW5jZXN0b3JJZHhzKSxcbiAgICApO1xuICAgIGFsbFRvQXBwbHkucHVzaChcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHQsIHJldmVyc2VSZWYpLFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gZmxhdHRlbihhbGxUb0FwcGx5KTtcbn07XG5cbmNvbnN0IGdldERlbGV0ZVRyYW5zYWN0aW9uc0J5U2hhcmQgPSBnZXRfQ3JlYXRlX0RlbGV0ZV9UcmFuc2FjdGlvbnNCeVNoYXJkKGlzRGVsZXRlKTtcblxuY29uc3QgZ2V0Q3JlYXRlVHJhbnNhY3Rpb25zQnlTaGFyZCA9IGdldF9DcmVhdGVfRGVsZXRlX1RyYW5zYWN0aW9uc0J5U2hhcmQoaXNDcmVhdGUpO1xuXG5jb25zdCBkaWZmUmV2ZXJzZVJlZkZvclVwZGF0ZSA9IChhcHBIaWVyYXJjaHksIG9sZFJlY29yZCwgbmV3UmVjb3JkKSA9PiB7XG4gIGNvbnN0IG9sZEluZGV4ZXMgPSBnZXRSZWxldmFudFJldmVyc2VSZWZlcmVuY2VJbmRleGVzKFxuICAgIGFwcEhpZXJhcmNoeSwgb2xkUmVjb3JkLFxuICApO1xuICBjb25zdCBuZXdJbmRleGVzID0gZ2V0UmVsZXZhbnRSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyhcbiAgICBhcHBIaWVyYXJjaHksIG5ld1JlY29yZCxcbiAgKTtcblxuICBjb25zdCB1blJlZmVyZW5jZWQgPSBkaWZmZXJlbmNlQnkoXG4gICAgaSA9PiBpLmluZGV4S2V5LFxuICAgIG9sZEluZGV4ZXMsIG5ld0luZGV4ZXMsXG4gICk7XG5cbiAgY29uc3QgbmV3bHlSZWZlcmVuY2VkID0gZGlmZmVyZW5jZUJ5KFxuICAgIGkgPT4gaS5pbmRleEtleSxcbiAgICBuZXdJbmRleGVzLCBvbGRJbmRleGVzLFxuICApO1xuXG4gIGNvbnN0IG5vdENoYW5nZWQgPSBpbnRlcnNlY3Rpb25CeShcbiAgICBpID0+IGkuaW5kZXhLZXksXG4gICAgbmV3SW5kZXhlcywgb2xkSW5kZXhlcyxcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIHVuUmVmZXJlbmNlZCxcbiAgICBuZXdseVJlZmVyZW5jZWQsXG4gICAgbm90Q2hhbmdlZCxcbiAgfTtcbn07XG4iLCJpbXBvcnQgeyBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgcmV0cmlldmUgfSBmcm9tICcuL3JldHJpZXZlJztcbmltcG9ydCB7IGV4ZWN1dGVUcmFuc2FjdGlvbnMgfSBmcm9tICcuL2V4ZWN1dGUnO1xuaW1wb3J0IHtcbiAgJCwgam9pbktleSwgZ2V0TG9jaywgaXNOb2xvY2ssIHJlbGVhc2VMb2NrLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgTE9DS19GSUxFX0tFWSwgVFJBTlNBQ1RJT05TX0ZPTERFUixcbiAgdGltZW91dE1pbGxpc2Vjb25kcywgZ2V0VHJhbnNhY3Rpb25JZCxcbiAgbWF4TG9ja1JldHJpZXMsXG59IGZyb20gJy4vdHJhbnNhY3Rpb25zQ29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGNsZWFudXAgPSBhc3luYyAoYXBwKSA9PiB7XG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRUcmFuc2FjdGlvbkxvY2soYXBwKTtcbiAgaWYgKGlzTm9sb2NrKGxvY2spKSByZXR1cm47XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB0cmFuc2FjdGlvbnMgPSBhd2FpdCByZXRyaWV2ZShhcHApO1xuICAgIGlmICh0cmFuc2FjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgZXhlY3V0ZVRyYW5zYWN0aW9ucyhhcHApKHRyYW5zYWN0aW9ucyk7XG5cbiAgICAgIGNvbnN0IGZvbGRlciA9IHRyYW5zYWN0aW9ucy5mb2xkZXJLZXlcbiAgICAgICAgPyB0cmFuc2FjdGlvbnMuZm9sZGVyS2V5XG4gICAgICAgIDogVFJBTlNBQ1RJT05TX0ZPTERFUjtcblxuICAgICAgY29uc3QgZGVsZXRlRmlsZXMgPSAkKHRyYW5zYWN0aW9ucywgW1xuICAgICAgICBtYXAodCA9PiBqb2luS2V5KFxuICAgICAgICAgIGZvbGRlcixcbiAgICAgICAgICBnZXRUcmFuc2FjdGlvbklkKFxuICAgICAgICAgICAgdC5yZWNvcmRJZCwgdC50cmFuc2FjdGlvblR5cGUsXG4gICAgICAgICAgICB0LnVuaXF1ZUlkLFxuICAgICAgICAgICksXG4gICAgICAgICkpLFxuICAgICAgICBtYXAoYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKSxcbiAgICAgIF0pO1xuXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChkZWxldGVGaWxlcyk7XG4gICAgfVxuICB9IGZpbmFsbHkge1xuICAgIGF3YWl0IHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XG4gIH1cbn07XG5cbmNvbnN0IGdldFRyYW5zYWN0aW9uTG9jayA9IGFzeW5jIGFwcCA9PiBhd2FpdCBnZXRMb2NrKFxuICBhcHAsIExPQ0tfRklMRV9LRVksXG4gIHRpbWVvdXRNaWxsaXNlY29uZHMsIG1heExvY2tSZXRyaWVzLFxuKTtcbiIsImltcG9ydCB7IGZpbHRlciB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBjb25maWdGb2xkZXIsIGFwcERlZmluaXRpb25GaWxlLCAkIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IFRSQU5TQUNUSU9OU19GT0xERVIgfSBmcm9tICcuLi90cmFuc2FjdGlvbnMvdHJhbnNhY3Rpb25zQ29tbW9uJztcbmltcG9ydCB7IEFVVEhfRk9MREVSLCBVU0VSU19MSVNUX0ZJTEUsIEFDQ0VTU19MRVZFTFNfRklMRSB9IGZyb20gJy4uL2F1dGhBcGkvYXV0aENvbW1vbic7XG5pbXBvcnQgeyBpbml0aWFsaXNlUm9vdENvbGxlY3Rpb25zIH0gZnJvbSAnLi4vY29sbGVjdGlvbkFwaS9pbml0aWFsaXNlJztcbmltcG9ydCB7IGluaXRpYWxpc2VJbmRleCB9IGZyb20gJy4uL2luZGV4aW5nL2luaXRpYWxpc2VJbmRleCc7XG5pbXBvcnQgeyBnZXRGbGF0dGVuZWRIaWVyYXJjaHksIGlzR2xvYmFsSW5kZXgsIGlzU2luZ2xlUmVjb3JkIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IF9nZXROZXcgfSBmcm9tIFwiLi4vcmVjb3JkQXBpL2dldE5ld1wiO1xuaW1wb3J0IHsgX3NhdmUgfSBmcm9tIFwiLi4vcmVjb3JkQXBpL3NhdmVcIjtcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxpc2VEYXRhID0gYXN5bmMgKGRhdGFzdG9yZSwgYXBwbGljYXRpb25EZWZpbml0aW9uLCBhY2Nlc3NMZXZlbHMpID0+IHtcbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihjb25maWdGb2xkZXIpO1xuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlSnNvbihhcHBEZWZpbml0aW9uRmlsZSwgYXBwbGljYXRpb25EZWZpbml0aW9uKTtcblxuICBhd2FpdCBpbml0aWFsaXNlUm9vdENvbGxlY3Rpb25zKGRhdGFzdG9yZSwgYXBwbGljYXRpb25EZWZpbml0aW9uLmhpZXJhcmNoeSk7XG4gIGF3YWl0IGluaXRpYWxpc2VSb290SW5kZXhlcyhkYXRhc3RvcmUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbi5oaWVyYXJjaHkpO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoVFJBTlNBQ1RJT05TX0ZPTERFUik7XG5cbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihBVVRIX0ZPTERFUik7XG5cbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oVVNFUlNfTElTVF9GSUxFLCBbXSk7XG5cbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oXG4gICAgQUNDRVNTX0xFVkVMU19GSUxFLCBcbiAgICBhY2Nlc3NMZXZlbHMgPyBhY2Nlc3NMZXZlbHMgOiB7IHZlcnNpb246IDAsIGxldmVsczogW10gfSk7XG5cbiAgYXdhaXQgaW5pdGlhbGlzZVJvb3RTaW5nbGVSZWNvcmRzKGRhdGFzdG9yZSwgYXBwbGljYXRpb25EZWZpbml0aW9uLmhpZXJhcmNoeSk7XG59O1xuXG5jb25zdCBpbml0aWFsaXNlUm9vdEluZGV4ZXMgPSBhc3luYyAoZGF0YXN0b3JlLCBoaWVyYXJjaHkpID0+IHtcbiAgY29uc3QgZmxhdGhpZXJhcmNoeSA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShoaWVyYXJjaHkpO1xuICBjb25zdCBnbG9iYWxJbmRleGVzID0gJChmbGF0aGllcmFyY2h5LCBbXG4gICAgZmlsdGVyKGlzR2xvYmFsSW5kZXgpLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IGluZGV4IG9mIGdsb2JhbEluZGV4ZXMpIHtcbiAgICBpZiAoIWF3YWl0IGRhdGFzdG9yZS5leGlzdHMoaW5kZXgubm9kZUtleSgpKSkgeyBhd2FpdCBpbml0aWFsaXNlSW5kZXgoZGF0YXN0b3JlLCAnJywgaW5kZXgpOyB9XG4gIH1cbn07XG5cbmNvbnN0IGluaXRpYWxpc2VSb290U2luZ2xlUmVjb3JkcyA9IGFzeW5jIChkYXRhc3RvcmUsIGhpZXJhcmNoeSkgPT4ge1xuICBjb25zdCBhcHAgPSB7IFxuICAgIHB1Ymxpc2g6KCk9Pnt9LFxuICAgIGNsZWFudXBUcmFuc2FjdGlvbnM6ICgpID0+IHt9LFxuICAgIGRhdGFzdG9yZSwgaGllcmFyY2h5IFxuICB9O1xuXG4gIGNvbnN0IGZsYXRoaWVyYXJjaHkgPSBnZXRGbGF0dGVuZWRIaWVyYXJjaHkoaGllcmFyY2h5KTtcbiAgY29uc3Qgc2luZ2xlUmVjb3JkcyA9ICQoZmxhdGhpZXJhcmNoeSwgW1xuICAgIGZpbHRlcihpc1NpbmdsZVJlY29yZCksXG4gIF0pO1xuXG4gIGZvciAobGV0IHJlY29yZCBvZiBzaW5nbGVSZWNvcmRzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gX2dldE5ldyhyZWNvcmQsIFwiXCIpO1xuICAgIGF3YWl0IF9zYXZlKGFwcCxyZXN1bHQpO1xuICB9XG59O1xuIiwiaW1wb3J0IHsgaXNOb3RoaW5nIH0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdldERhdGFiYXNlTWFuYWdlciA9IGRhdGFiYXNlTWFuYWdlciA9PiAoe1xuICBjcmVhdGVFbXB0eU1hc3RlckRiOiBjcmVhdGVFbXB0eU1hc3RlckRiKGRhdGFiYXNlTWFuYWdlciksXG4gIGNyZWF0ZUVtcHR5SW5zdGFuY2VEYjogY3JlYXRlRW1wdHlJbnN0YW5jZURiKGRhdGFiYXNlTWFuYWdlciksXG4gIGdldEluc3RhbmNlRGJSb290Q29uZmlnOiBkYXRhYmFzZU1hbmFnZXIuZ2V0SW5zdGFuY2VEYlJvb3RDb25maWcsXG4gIG1hc3RlckRhdGFzdG9yZUNvbmZpZzogZ2V0TWFzdGVyRGF0YXN0b3JlQ29uZmlnKGRhdGFiYXNlTWFuYWdlciksXG4gIGdldEluc3RhbmNlRGF0YXN0b3JlQ29uZmlnOiBnZXRJbnN0YW5jZURhdGFzdG9yZUNvbmZpZyhkYXRhYmFzZU1hbmFnZXIpLFxufSk7XG5cbmNvbnN0IGdldE1hc3RlckRhdGFzdG9yZUNvbmZpZyA9IGRhdGFiYXNlTWFuYWdlciA9PiBkYXRhYmFzZU1hbmFnZXIuZ2V0RGF0YXN0b3JlQ29uZmlnKCdtYXN0ZXInKTtcblxuY29uc3QgZ2V0SW5zdGFuY2VEYXRhc3RvcmVDb25maWcgPSBkYXRhYmFzZU1hbmFnZXIgPT4gKGFwcGxpY2F0aW9uSWQsIGluc3RhbmNlSWQpID0+IGRhdGFiYXNlTWFuYWdlci5nZXREYXRhc3RvcmVDb25maWcoXG4gIGFwcGxpY2F0aW9uSWQsIGluc3RhbmNlSWQsXG4pO1xuXG5jb25zdCBjcmVhdGVFbXB0eU1hc3RlckRiID0gZGF0YWJhc2VNYW5hZ2VyID0+IGFzeW5jICgpID0+IGF3YWl0IGRhdGFiYXNlTWFuYWdlci5jcmVhdGVFbXB0eURiKCdtYXN0ZXInKTtcblxuY29uc3QgY3JlYXRlRW1wdHlJbnN0YW5jZURiID0gZGF0YWJhc2VNYW5hZ2VyID0+IGFzeW5jIChhcHBsaWNhdGlvbklkLCBpbnN0YW5jZUlkKSA9PiB7XG4gIGlmIChpc05vdGhpbmcoYXBwbGljYXRpb25JZCkpIHsgdGhyb3cgbmV3IEVycm9yKCdDcmVhdGVEYjogYXBwbGljYXRpb24gaWQgbm90IHN1cHBsaWVkJyk7IH1cbiAgaWYgKGlzTm90aGluZyhpbnN0YW5jZUlkKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0ZURiOiBpbnN0YW5jZSBpZCBub3Qgc3VwcGxpZWQnKTsgfVxuXG4gIHJldHVybiBhd2FpdCBkYXRhYmFzZU1hbmFnZXIuY3JlYXRlRW1wdHlEYihcbiAgICBhcHBsaWNhdGlvbklkLFxuICAgIGluc3RhbmNlSWQsXG4gICk7XG59O1xuIiwiaW1wb3J0IGdldFJlY29yZEFwaSBmcm9tIFwiLi9yZWNvcmRBcGlcIjtcbmltcG9ydCBnZXRDb2xsZWN0aW9uQXBpIGZyb20gXCIuL2NvbGxlY3Rpb25BcGlcIjtcbmltcG9ydCBnZXRJbmRleEFwaSBmcm9tIFwiLi9pbmRleEFwaVwiO1xuaW1wb3J0IGdldFRlbXBsYXRlQXBpIGZyb20gXCIuL3RlbXBsYXRlQXBpXCI7XG5pbXBvcnQgZ2V0QXV0aEFwaSBmcm9tIFwiLi9hdXRoQXBpXCI7XG5pbXBvcnQgZ2V0QWN0aW9uc0FwaSBmcm9tIFwiLi9hY3Rpb25zQXBpXCI7XG5pbXBvcnQge3NldHVwRGF0YXN0b3JlLCBjcmVhdGVFdmVudEFnZ3JlZ2F0b3J9IGZyb20gXCIuL2FwcEluaXRpYWxpc2VcIjtcbmltcG9ydCB7aW5pdGlhbGlzZUFjdGlvbnN9IGZyb20gXCIuL2FjdGlvbnNBcGkvaW5pdGlhbGlzZVwiXG5pbXBvcnQge2lzU29tZXRoaW5nfSBmcm9tIFwiLi9jb21tb25cIjtcbmltcG9ydCB7Y2xlYW51cH0gZnJvbSBcIi4vdHJhbnNhY3Rpb25zL2NsZWFudXBcIjtcbmltcG9ydCB7Z2VuZXJhdGVGdWxsUGVybWlzc2lvbnN9IGZyb20gXCIuL2F1dGhBcGkvZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnNcIjtcbmltcG9ydCB7Z2V0QXBwbGljYXRpb25EZWZpbml0aW9ufSBmcm9tIFwiLi90ZW1wbGF0ZUFwaS9nZXRBcHBsaWNhdGlvbkRlZmluaXRpb25cIjtcbmltcG9ydCBjb21tb24gZnJvbSBcIi4vY29tbW9uXCI7XG5pbXBvcnQge2dldEJlaGF2aW91clNvdXJjZXN9IGZyb20gXCIuL3RlbXBsYXRlQXBpL2dldEJlaGF2aW91clNvdXJjZXNcIjtcbmltcG9ydCBoaWVyYXJjaHkgZnJvbSBcIi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5XCI7XG5cbmV4cG9ydCBjb25zdCBnZXRBcHBBcGlzID0gYXN5bmMgKHN0b3JlLCBiZWhhdmlvdXJTb3VyY2VzID0gbnVsbCwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFudXBUcmFuc2FjdGlvbnMgPSBudWxsLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXBvY2hUaW1lID0gbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3J5cHRvID0gbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwRGVmaW5pdGlvbiA9IG51bGwpID0+IHtcblxuICAgIHN0b3JlID0gc2V0dXBEYXRhc3RvcmUoc3RvcmUpO1xuXG4gICAgaWYoIWFwcERlZmluaXRpb24pXG4gICAgICAgIGFwcERlZmluaXRpb24gPSBhd2FpdCBnZXRBcHBsaWNhdGlvbkRlZmluaXRpb24oc3RvcmUpKCk7XG5cbiAgICBpZighYmVoYXZpb3VyU291cmNlcylcbiAgICAgICAgYmVoYXZpb3VyU291cmNlcyA9IGF3YWl0IGdldEJlaGF2aW91clNvdXJjZXMoc3RvcmUpO1xuXG4gICAgY29uc3QgZXZlbnRBZ2dyZWdhdG9yID0gY3JlYXRlRXZlbnRBZ2dyZWdhdG9yKCk7XG5cbiAgICBjb25zdCBhcHAgPSB7XG4gICAgICAgIGRhdGFzdG9yZTpzdG9yZSxcbiAgICAgICAgY3J5cHRvLFxuICAgICAgICBwdWJsaXNoOmV2ZW50QWdncmVnYXRvci5wdWJsaXNoLFxuICAgICAgICBoaWVyYXJjaHk6YXBwRGVmaW5pdGlvbi5oaWVyYXJjaHksXG4gICAgICAgIGFjdGlvbnM6YXBwRGVmaW5pdGlvbi5hY3Rpb25zXG4gICAgfTtcblxuICAgIGNvbnN0IHRlbXBsYXRlQXBpID0gZ2V0VGVtcGxhdGVBcGkoYXBwKTsgICAgXG5cbiAgICBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucyA9IGlzU29tZXRoaW5nKGNsZWFudXBUcmFuc2FjdGlvbnMpIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBjbGVhbnVwVHJhbnNhY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGFzeW5jICgpID0+IGF3YWl0IGNsZWFudXAoYXBwKTtcblxuICAgIGFwcC5nZXRFcG9jaFRpbWUgPSBpc1NvbWV0aGluZyhnZXRFcG9jaFRpbWUpXG4gICAgICAgICAgICAgICAgICAgICAgID8gZ2V0RXBvY2hUaW1lXG4gICAgICAgICAgICAgICAgICAgICAgIDogYXN5bmMgKCkgPT4gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblxuICAgIGNvbnN0IHJlY29yZEFwaSA9IGdldFJlY29yZEFwaShhcHApO1xuICAgIGNvbnN0IGNvbGxlY3Rpb25BcGkgPSBnZXRDb2xsZWN0aW9uQXBpKGFwcCk7XG4gICAgY29uc3QgaW5kZXhBcGkgPSBnZXRJbmRleEFwaShhcHApO1xuICAgIGNvbnN0IGF1dGhBcGkgPSBnZXRBdXRoQXBpKGFwcCk7XG4gICAgY29uc3QgYWN0aW9uc0FwaSA9IGdldEFjdGlvbnNBcGkoYXBwKTtcblxuICAgIGNvbnN0IGF1dGhlbnRpY2F0ZUFzID0gYXN5bmMgKHVzZXJuYW1lLCBwYXNzd29yZCkgPT4ge1xuICAgICAgICBhcHAudXNlciA9IGF3YWl0IGF1dGhBcGkuYXV0aGVudGljYXRlKHVzZXJuYW1lLCBwYXNzd29yZCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHdpdGhGdWxsQWNjZXNzID0gKCkgPT4gXG4gICAgICAgIHVzZXJXaXRoRnVsbEFjY2VzcyhhcHApOyAgICBcblxuICAgIGNvbnN0IGFzVXNlciA9ICh1c2VyKSA9PiB7XG4gICAgICAgIGFwcC51c2VyID0gdXNlclxuICAgIH07ICAgIFxuXG4gICAgbGV0IGFwaXMgPSB7XG4gICAgICAgIHJlY29yZEFwaSwgXG4gICAgICAgIHRlbXBsYXRlQXBpLFxuICAgICAgICBjb2xsZWN0aW9uQXBpLFxuICAgICAgICBpbmRleEFwaSxcbiAgICAgICAgYXV0aEFwaSxcbiAgICAgICAgYWN0aW9uc0FwaSxcbiAgICAgICAgc3Vic2NyaWJlOiBldmVudEFnZ3JlZ2F0b3Iuc3Vic2NyaWJlLFxuICAgICAgICBhdXRoZW50aWNhdGVBcyxcbiAgICAgICAgd2l0aEZ1bGxBY2Nlc3MsXG4gICAgICAgIGFzVXNlclxuICAgIH07XG5cbiAgICBhcGlzLmFjdGlvbnMgPSBpbml0aWFsaXNlQWN0aW9ucyhcbiAgICAgICAgZXZlbnRBZ2dyZWdhdG9yLnN1YnNjcmliZSxcbiAgICAgICAgYmVoYXZpb3VyU291cmNlcyxcbiAgICAgICAgYXBwRGVmaW5pdGlvbi5hY3Rpb25zLFxuICAgICAgICBhcHBEZWZpbml0aW9uLnRyaWdnZXJzLFxuICAgICAgICBhcGlzKTtcblxuXG4gICAgcmV0dXJuIGFwaXM7XG59O1xuXG5leHBvcnQgY29uc3QgdXNlcldpdGhGdWxsQWNjZXNzID0gKGFwcCkgPT4ge1xuICAgIGFwcC51c2VyID0ge1xuICAgICAgICBuYW1lOiBcImFwcFwiLFxuICAgICAgICBwZXJtaXNzaW9ucyA6IGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zKGFwcCksXG4gICAgICAgIGlzVXNlcjpmYWxzZSxcbiAgICAgICAgdGVtcDpmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gYXBwLnVzZXI7XG59O1xuXG5leHBvcnQge2V2ZW50cywgZXZlbnRzTGlzdH0gZnJvbSBcIi4vY29tbW9uL2V2ZW50c1wiO1xuZXhwb3J0IHtnZXRUZW1wbGF0ZUFwaX0gZnJvbSBcIi4vdGVtcGxhdGVBcGlcIjtcbmV4cG9ydCB7Z2V0UmVjb3JkQXBpfSBmcm9tIFwiLi9yZWNvcmRBcGlcIjtcbmV4cG9ydCB7Z2V0Q29sbGVjdGlvbkFwaX0gZnJvbSBcIi4vY29sbGVjdGlvbkFwaVwiO1xuZXhwb3J0IHtnZXRBdXRoQXBpfSBmcm9tIFwiLi9hdXRoQXBpXCI7XG5leHBvcnQge2dldEluZGV4QXBpfSBmcm9tIFwiLi9pbmRleEFwaVwiO1xuZXhwb3J0IHtzZXR1cERhdGFzdG9yZX0gZnJvbSBcIi4vYXBwSW5pdGlhbGlzZVwiO1xuZXhwb3J0IHtnZXRBY3Rpb25zQXBpfSBmcm9tIFwiLi9hY3Rpb25zQXBpXCI7XG5leHBvcnQge2luaXRpYWxpc2VEYXRhfSBmcm9tIFwiLi9hcHBJbml0aWFsaXNlL2luaXRpYWxpc2VEYXRhXCI7XG5leHBvcnQge2dldERhdGFiYXNlTWFuYWdlcn0gZnJvbSBcIi4vYXBwSW5pdGlhbGlzZS9kYXRhYmFzZU1hbmFnZXJcIjtcbmV4cG9ydCB7aGllcmFyY2h5fTtcbmV4cG9ydCB7Y29tbW9ufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0QXBwQXBpczsiXSwibmFtZXMiOlsidW5pb24iLCJyZWR1Y2UiLCJnZW5lcmF0ZSIsImlzVW5kZWZpbmVkIiwiY2xvbmVEZWVwIiwic3BsaXQiLCJmbG93IiwidHJpbSIsInJlcGxhY2UiLCJpc0FycmF5Iiwiam9pbiIsImRyb3BSaWdodCIsInRha2VSaWdodCIsImhlYWQiLCJpc051bGwiLCJpc05hTiIsImlzRW1wdHkiLCJjb25zdGFudCIsInNvbWUiLCJpc1N0cmluZyIsInRhaWwiLCJpbmNsdWRlcyIsInN0YXJ0c1dpdGgiLCJmaW5kSW5kZXgiLCJpc0ludGVnZXIiLCJpc0RhdGUiLCJ0b051bWJlciIsIm1hcCIsImZpbHRlciIsImNvbXBpbGVFeHByZXNzaW9uIiwiY29tcGlsZUNvZGUiLCJrZXlzIiwiaXNGdW5jdGlvbiIsImNvdW50QnkiLCJsYXN0IiwiZmluZCIsInRha2UiLCJmaXJzdCIsImludGVyc2VjdGlvbiIsImhhcyIsIm1lcmdlIiwibWFwVmFsdWVzIiwibWFrZXJ1bGUiLCJpc0Jvb2xlYW4iLCJvcHRpb25zIiwidHlwZUNvbnN0cmFpbnRzIiwiaXNOdW1iZXIiLCJpc09iamVjdExpa2UiLCJhc3NpZ24iLCJhbGwiLCJnZXREZWZhdWx0T3B0aW9ucyIsInZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzIiwiaXNPYmplY3QiLCJjbG9uZSIsInZhbHVlcyIsImtleUJ5Iiwib3JkZXJCeSIsImNvbmNhdCIsInJldmVyc2UiLCJnbG9iYWwiLCJiYXNlNjQuZnJvbUJ5dGVBcnJheSIsImllZWU3NTQucmVhZCIsImllZWU3NTQud3JpdGUiLCJiYXNlNjQudG9CeXRlQXJyYXkiLCJyZWFkIiwiZGlmZmVyZW5jZSIsIkJ1ZmZlciIsInJlYWRJbmRleCIsImZsYXR0ZW4iLCJlYWNoIiwiXyIsInB1bGwiLCJkZWxldGVSZWNvcmQiLCJ2YWxpZGF0ZSIsIm1heCIsImRlZmF1bHRDYXNlIiwiZXZlcnkiLCJ1bmlxQnkiLCJhcGkiLCJjcmVhdGVUZW1wb3JhcnlBY2Nlc3MiLCJjcmVhdGVVc2VyIiwidW5pcVdpdGgiLCJzZXRVc2VyQWNjZXNzTGV2ZWxzIiwiZXhlY3V0ZUFjdGlvbiIsImNDb2RlIiwiY0V4cCIsImdyb3VwQnkiLCJpc0VxdWFsIiwiZGlmZmVyZW5jZUJ5IiwiaW50ZXJzZWN0aW9uQnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztFQUVBLE1BQU0sVUFBVSxHQUFHLEtBQUssSUFBSUEsUUFBSyxDQUFDLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDOztFQUUvRSxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7RUFFcEMsTUFBTSxPQUFPLEdB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R0FBRyxHQUFHLENBQUMsR0FBRyxFQUFDOztFQUV4RTtFQUNBLEVBQUUsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksRUFBQzs7RUFFM0M7RUFDQSxFQUFFLENBQUMsR0FBRyxZQUFZLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBRzs7RUFFdEMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFDOztFQUVYLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7RUFDNUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUM7RUFDdEssSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUFFLElBQUksS0FBSTtFQUNqQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFJO0VBQ2hDLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUk7RUFDekIsR0FBRzs7RUFFSCxFQUFFLElBQUksWUFBWSxLQUFLLENBQUMsRUFBRTtFQUMxQixJQUFJLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxH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QUcsQ0FBQyxFQUFDO0VBQ2xFLEVBQUUsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFDO0VBQ2pDLEVBQUUsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUM7RUFDdkIsRUFBRSxJQUFJLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBQzs7RUFFN0QsRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUM7O0VBRXpCLEVBQUUsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLFFBQVEsRUFBRTtFQUMxQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUM7RUFDNUIsSUFBSSxDQUFDLEdBQUcsS0FBSTtFQUNaLEdBQUcsTUFBTTtFQUNULElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFDO0VBQzlDLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7RUFDM0MsTUFBTSxDQUFDLEdBQUU7RUFDVCxNQUFNLENBQUMsSUFBSSxFQUFDO0VBQ1osS0FBSztFQUNMLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsRUFBRTtFQUN4QixNQUFNLEtBQUssSUFBSSxFQUFFLEdBQUcsRUFBQztFQUNyQixLQUFLLE1BQU07RUFDWCxNQUFNLEtBQUssSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBQztFQUMxQyxLQUFLO0VBQ0wsSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO0VBQ3hCLE1BQU0sQ0FBQyxHQUFFO0VBQ1QsTUFBTSxDQUFDLElBQUksRUFBQztFQUNaLEtBQUs7O0VBRUwsSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLElBQUksSUFBSSxFQUFFO0VBQzNCLE1BQU0sQ0FBQyxHQUFHLEVBQUM7RUFDWCxNQUFNLENBQUMsR0FBRyxLQUFJO0VBQ2QsS0FBSyxNQUFNLElBQUksQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLEVBQUU7RUFDL0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUM7RUFDN0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQUs7RUFDbkIsS0FBSyxNQUFNO0VBQ1gsTUFBTSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUM7RUFDNUQsTUFBTSxDQUFDLEdBQUcsRUFBQztFQUNYLEtBQUs7RUFDTCxHQUFHOztFQUVILEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsRUFBRSxFQUFFOztFQUVsRixFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksRUFBQztFQUNyQixFQUFFLElBQUksSUFBSSxLQUFJO0VBQ2QsRUFBRSxPQUFPLElBQUksR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxJQUFJLElBQUksQ0FBQyxFQUFFLEVBQUU7O0VBRWpGLEVBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUc7RUFDbkMsQ0FBQzs7RUNwRkQsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7QUFFM0IsZ0JBQWUsS0FBSyxDQUFDLE9BQU8sSUFBSSxVQUFVLEdBQUcsRUFBRTtFQUMvQyxFQUFFLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQztFQUNoRCxDQUFDLENBQUM7O0VDU0ssSUFBSSxpQkFBaUIsR0FBRyxHQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTBCakMsTUFBTSxDQUFDLG1CQUFtQixHQUFHQyxRQUFNLENBQUMsbUJBQW1CLEtBQUssU0FBUztNQUNqRUEsUUFBTSxDQUFDLG1CQUFtQjtNQUMxQixLQUFJOztFQXdCUixTQUFTLFVBQVUsSUFBSTtJQUNyQixPQUFPLE1BQU0sQ0FBQyxtQkFBbUI7UUFDN0IsVUFBVTtRQUNWLFVBQVU7R0FDZjs7RUFFRCxTQUFTLFlBQVksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0lBQ25DLElBQUksVUFBVSxFQUFFLEdBQUcsTUFBTSxFQUFFO01BQ3pCLE1BQU0sSUFBSSxVQUFVLENBQUMsNEJBQTRCLENBQUM7S0FDbkQ7SUFDRCxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRTs7TUFFOUIsSUFBSSxHQUFHLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBQztNQUM3QixJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxVQUFTO0tBQ2xDLE1BQU07O01BRUwsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO1FBQ2pCLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUM7T0FDMUI7TUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU07S0FDckI7O0lBRUQsT0FBTyxJQUFJO0dBQ1o7Ozs7Ozs7Ozs7OztBQVlELEVBQU8sU0FBUyxNQUFNLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sRUFBRTtJQUNyRCxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixJQUFJLEVBQUUsSUFBSSxZQUFZLE1BQU0sQ0FBQyxFQUFFO01BQzVELE9BQU8sSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sQ0FBQztLQUNqRDs7O0lBR0QsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7TUFDM0IsSUFBSSxPQUFPLGdCQUFnQixLQUFLLFFBQVEsRUFBRTtRQUN4QyxNQUFNLElBQUksS0FBSztVQUNiLG1FQUFtRTtTQUNwRTtPQUNGO01BQ0QsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQztLQUM5QjtJQUNELE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDO0dBQ2pEOztFQUVELE1BQU0sQ0FBQyxRQUFRLEdBQUcsS0FBSTs7O0VBR3RCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsVUFBVSxHQUFHLEVBQUU7SUFDL0IsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsVUFBUztJQUNoQyxPQUFPLEdBQUc7SUFDWDs7RUFFRCxTQUFTLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sRUFBRTtJQUNwRCxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtNQUM3QixNQUFNLElBQUksU0FBUyxDQUFDLHVDQUF1QyxDQUFDO0tBQzdEOztJQUVELElBQUksT0FBTyxXQUFXLEtBQUssV0FBVyxJQUFJLEtBQUssWUFBWSxXQUFXLEVBQUU7TUFDdEUsT0FBTyxlQUFlLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLENBQUM7S0FDOUQ7O0lBRUQsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7TUFDN0IsT0FBTyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQztLQUNqRDs7SUFFRCxPQUFPLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO0dBQy9COzs7Ozs7Ozs7O0VBVUQsTUFBTSxDQUFDLElBQUksR0FBRyxVQUFVLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUU7SUFDdkQsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLENBQUM7SUFDbkQ7O0VBRUQsSUFBSSxNQUFNLENBQUMsbUJBQW1CLEVBQUU7SUFDOUIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDLFVBQVM7SUFDakQsTUFBTSxDQUFDLFNBQVMsR0FBRyxXQUFVO0dBUzlCOztFQUVELFNBQVMsVUFBVSxFQUFFLElBQUksRUFBRTtJQUN6QixJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtNQUM1QixNQUFNLElBQUksU0FBUyxDQUFDLGtDQUFrQyxDQUFDO0tBQ3hELE1BQU0sSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO01BQ25CLE1BQU0sSUFBSSxVQUFVLENBQUMsc0NBQXNDLENBQUM7S0FDN0Q7R0FDRjs7RUFFRCxTQUFTLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7SUFDMUMsVUFBVSxDQUFDLElBQUksRUFBQztJQUNoQixJQUFJLElBQUksSUFBSSxDQUFDLEVBQUU7TUFDYixPQUFPLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO0tBQ2hDO0lBQ0QsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFOzs7O01BSXRCLE9BQU8sT0FBTyxRQUFRLEtBQUssUUFBUTtVQUMvQixZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDO1VBQzdDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztLQUN4QztJQUNELE9BQU8sWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7R0FDaEM7Ozs7OztFQU1ELE1BQU0sQ0FBQyxLQUFLLEdBQUcsVUFBVSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtJQUM3QyxPQUFPLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUM7SUFDekM7O0VBRUQsU0FBUyxXQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtJQUNoQyxVQUFVLENBQUMsSUFBSSxFQUFDO0lBQ2hCLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUM7SUFDM0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRTtNQUMvQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQzdCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDO09BQ1o7S0FDRjtJQUNELE9BQU8sSUFBSTtHQUNaOzs7OztFQUtELE1BQU0sQ0FBQyxXQUFXLEdBQUcsVUFBVSxJQUFJLEVBQUU7SUFDbkMsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztJQUMvQjs7OztFQUlELE1BQU0sQ0FBQyxlQUFlLEdBQUcsVUFBVSxJQUFJLEVBQUU7SUFDdkMsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztJQUMvQjs7RUFFRCxTQUFTLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUMzQyxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsSUFBSSxRQUFRLEtBQUssRUFBRSxFQUFFO01BQ25ELFFBQVEsR0FBRyxPQUFNO0tBQ2xCOztJQUVELElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO01BQ2hDLE1BQU0sSUFBSSxTQUFTLENBQUMsNENBQTRDLENBQUM7S0FDbEU7O0lBRUQsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsR0FBRyxFQUFDO0lBQzdDLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQzs7SUFFakMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFDOztJQUV6QyxJQUFJLE1BQU0sS0FBSyxNQUFNLEVBQUU7Ozs7TUFJckIsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBQztLQUM3Qjs7SUFFRCxPQUFPLElBQUk7R0FDWjs7RUFFRCxTQUFTLGFBQWEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFO0lBQ25DLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUM7SUFDN0QsSUFBSSxHQUFHLFlBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFDO0lBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUNsQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUc7S0FDekI7SUFDRCxPQUFPLElBQUk7R0FDWjs7RUFFRCxTQUFTLGVBQWUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7SUFDekQsS0FBSyxDQUFDLFdBQVU7O0lBRWhCLElBQUksVUFBVSxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsVUFBVSxHQUFHLFVBQVUsRUFBRTtNQUNuRCxNQUFNLElBQUksVUFBVSxDQUFDLDZCQUE2QixDQUFDO0tBQ3BEOztJQUVELElBQUksS0FBSyxDQUFDLFVBQVUsR0FBRyxVQUFVLElBQUksTUFBTSxJQUFJLENBQUMsQ0FBQyxFQUFFO01BQ2pELE1BQU0sSUFBSSxVQUFVLENBQUMsNkJBQTZCLENBQUM7S0FDcEQ7O0lBRUQsSUFBSSxVQUFVLEtBQUssU0FBUyxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7TUFDcEQsS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLEtBQUssRUFBQztLQUM5QixNQUFNLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtNQUMvQixLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBQztLQUMxQyxNQUFNO01BQ0wsS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFDO0tBQ2xEOztJQUVELElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFOztNQUU5QixJQUFJLEdBQUcsTUFBSztNQUNaLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFVBQVM7S0FDbEMsTUFBTTs7TUFFTCxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUM7S0FDbEM7SUFDRCxPQUFPLElBQUk7R0FDWjs7RUFFRCxTQUFTLFVBQVUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO0lBQzlCLElBQUksZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEVBQUU7TUFDekIsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFDO01BQ2pDLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQzs7TUFFOUIsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUNyQixPQUFPLElBQUk7T0FDWjs7TUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQztNQUN6QixPQUFPLElBQUk7S0FDWjs7SUFFRCxJQUFJLEdBQUcsRUFBRTtNQUNQLElBQUksQ0FBQyxPQUFPLFdBQVcsS0FBSyxXQUFXO1VBQ25DLEdBQUcsQ0FBQyxNQUFNLFlBQVksV0FBVyxLQUFLLFFBQVEsSUFBSSxHQUFHLEVBQUU7UUFDekQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxNQUFNLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7VUFDdkQsT0FBTyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUM3QjtRQUNELE9BQU8sYUFBYSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUM7T0FDaEM7O01BRUQsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzlDLE9BQU8sYUFBYSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDO09BQ3JDO0tBQ0Y7O0lBRUQsTUFBTSxJQUFJLFNBQVMsQ0FBQyxvRkFBb0YsQ0FBQztHQUMxRzs7RUFFRCxTQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUU7OztJQUd4QixJQUFJLE1BQU0sSUFBSSxVQUFVLEVBQUUsRUFBRTtNQUMxQixNQUFNLElBQUksVUFBVSxDQUFDLGlEQUFpRDsyQkFDakQsVUFBVSxHQUFHLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUM7S0FDeEU7SUFDRCxPQUFPLE1BQU0sR0FBRyxDQUFDO0dBQ2xCO0VBUUQsTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7RUFDM0IsU0FBUyxnQkFBZ0IsRUFBRSxDQUFDLEVBQUU7SUFDNUIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDO0dBQ3BDOztFQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUN2QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBRTtNQUNoRCxNQUFNLElBQUksU0FBUyxDQUFDLDJCQUEyQixDQUFDO0tBQ2pEOztJQUVELElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUM7O0lBRXJCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFNO0lBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFNOztJQUVoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtNQUNsRCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDakIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUM7UUFDUixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQztRQUNSLEtBQUs7T0FDTjtLQUNGOztJQUVELElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwQixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDO0lBQ25CLE9BQU8sQ0FBQztJQUNUOztFQUVELE1BQU0sQ0FBQyxVQUFVLEdBQUcsU0FBUyxVQUFVLEVBQUUsUUFBUSxFQUFFO0lBQ2pELFFBQVEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsRUFBRTtNQUNwQyxLQUFLLEtBQUssQ0FBQztNQUNYLEtBQUssTUFBTSxDQUFDO01BQ1osS0FBSyxPQUFPLENBQUM7TUFDYixLQUFLLE9BQU8sQ0FBQztNQUNiLEtBQUssUUFBUSxDQUFDO01BQ2QsS0FBSyxRQUFRLENBQUM7TUFDZCxLQUFLLFFBQVEsQ0FBQztNQUNkLEtBQUssTUFBTSxDQUFDO01BQ1osS0FBSyxPQUFPLENBQUM7TUFDYixLQUFLLFNBQVMsQ0FBQztNQUNmLEtBQUssVUFBVTtRQUNiLE9BQU8sSUFBSTtNQUNiO1FBQ0UsT0FBTyxLQUFLO0tBQ2Y7SUFDRjs7RUFFRCxNQUFNLENBQUMsTUFBTSxHQUFHLFNBQVMsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7SUFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUNsQixNQUFNLElBQUksU0FBUyxDQUFDLDZDQUE2QyxDQUFDO0tBQ25FOztJQUVELElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFDckIsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUN2Qjs7SUFFRCxJQUFJLEVBQUM7SUFDTCxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7TUFDeEIsTUFBTSxHQUFHLEVBQUM7TUFDVixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDaEMsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNO09BQ3pCO0tBQ0Y7O0lBRUQsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUM7SUFDdkMsSUFBSSxHQUFHLEdBQUcsRUFBQztJQUNYLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtNQUNoQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFDO01BQ2pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUMxQixNQUFNLElBQUksU0FBUyxDQUFDLDZDQUE2QyxDQUFDO09BQ25FO01BQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFDO01BQ3JCLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTTtLQUNsQjtJQUNELE9BQU8sTUFBTTtJQUNkOztFQUVELFNBQVMsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7SUFDckMsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRTtNQUM1QixPQUFPLE1BQU0sQ0FBQyxNQUFNO0tBQ3JCO0lBQ0QsSUFBSSxPQUFPLFdBQVcsS0FBSyxXQUFXLElBQUksT0FBTyxXQUFXLENBQUMsTUFBTSxLQUFLLFVBQVU7U0FDN0UsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLFlBQVksV0FBVyxDQUFDLEVBQUU7TUFDakUsT0FBTyxNQUFNLENBQUMsVUFBVTtLQUN6QjtJQUNELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO01BQzlCLE1BQU0sR0FBRyxFQUFFLEdBQUcsT0FBTTtLQUNyQjs7SUFFRCxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsT0FBTTtJQUN2QixJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUUsT0FBTyxDQUFDOzs7SUFHdkIsSUFBSSxXQUFXLEdBQUcsTUFBSztJQUN2QixTQUFTO01BQ1AsUUFBUSxRQUFRO1FBQ2QsS0FBSyxPQUFPLENBQUM7UUFDYixLQUFLLFFBQVEsQ0FBQztRQUNkLEtBQUssUUFBUTtVQUNYLE9BQU8sR0FBRztRQUNaLEtBQUssTUFBTSxDQUFDO1FBQ1osS0FBSyxPQUFPLENBQUM7UUFDYixLQUFLLFNBQVM7VUFDWixPQUFPLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNO1FBQ25DLEtBQUssTUFBTSxDQUFDO1FBQ1osS0FBSyxPQUFPLENBQUM7UUFDYixLQUFLLFNBQVMsQ0FBQztRQUNmLEtBQUssVUFBVTtVQUNiLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDaEIsS0FBSyxLQUFLO1VBQ1IsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNsQixLQUFLLFFBQVE7VUFDWCxPQUFPLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNO1FBQ3JDO1VBQ0UsSUFBSSxXQUFXLEVBQUUsT0FBTyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTTtVQUNsRCxRQUFRLEdBQUcsQ0FBQyxFQUFFLEdBQUcsUUFBUSxFQUFFLFdBQVcsR0FBRTtVQUN4QyxXQUFXLEdBQUcsS0FBSTtPQUNyQjtLQUNGO0dBQ0Y7RUFDRCxNQUFNLENBQUMsVUFBVSxHQUFHLFdBQVU7O0VBRTlCLFNBQVMsWUFBWSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFO0lBQzNDLElBQUksV0FBVyxHQUFHLE1BQUs7Ozs7Ozs7OztJQVN2QixJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtNQUNwQyxLQUFLLEdBQUcsRUFBQztLQUNWOzs7SUFHRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFO01BQ3ZCLE9BQU8sRUFBRTtLQUNWOztJQUVELElBQUksR0FBRyxLQUFLLFNBQVMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtNQUMxQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU07S0FDbEI7O0lBRUQsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO01BQ1osT0FBTyxFQUFFO0tBQ1Y7OztJQUdELEdBQUcsTUFBTSxFQUFDO0lBQ1YsS0FBSyxNQUFNLEVBQUM7O0lBRVosSUFBSSxHQUFHLElBQUksS0FBSyxFQUFFO01BQ2hCLE9BQU8sRUFBRTtLQUNWOztJQUVELElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxHQUFHLE9BQU07O0lBRWhDLE9BQU8sSUFBSSxFQUFFO01BQ1gsUUFBUSxRQUFRO1FBQ2QsS0FBSyxLQUFLO1VBQ1IsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUM7O1FBRW5DLEtBQUssTUFBTSxDQUFDO1FBQ1osS0FBSyxPQUFPO1VBQ1YsT0FBTyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUM7O1FBRXBDLEtBQUssT0FBTztVQUNWLE9BQU8sVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDOztRQUVyQyxLQUFLLFFBQVEsQ0FBQztRQUNkLEtBQUssUUFBUTtVQUNYLE9BQU8sV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDOztRQUV0QyxLQUFLLFFBQVE7VUFDWCxPQUFPLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQzs7UUFFdEMsS0FBSyxNQUFNLENBQUM7UUFDWixLQUFLLE9BQU8sQ0FBQztRQUNiLEtBQUssU0FBUyxDQUFDO1FBQ2YsS0FBSyxVQUFVO1VBQ2IsT0FBTyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUM7O1FBRXZDO1VBQ0UsSUFBSSxXQUFXLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxvQkFBb0IsR0FBRyxRQUFRLENBQUM7VUFDckUsUUFBUSxHQUFHLENBQUMsUUFBUSxHQUFHLEVBQUUsRUFBRSxXQUFXLEdBQUU7VUFDeEMsV0FBVyxHQUFHLEtBQUk7T0FDckI7S0FDRjtHQUNGOzs7O0VBSUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsS0FBSTs7RUFFakMsU0FBUyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQztJQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDO0lBQ1gsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUM7R0FDVDs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLE1BQU0sSUFBSTtJQUMzQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTTtJQUNyQixJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQ2pCLE1BQU0sSUFBSSxVQUFVLENBQUMsMkNBQTJDLENBQUM7S0FDbEU7SUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDL0IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBQztLQUNyQjtJQUNELE9BQU8sSUFBSTtJQUNaOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsTUFBTSxJQUFJO0lBQzNDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFNO0lBQ3JCLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDakIsTUFBTSxJQUFJLFVBQVUsQ0FBQywyQ0FBMkMsQ0FBQztLQUNsRTtJQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUMvQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDO01BQ3BCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDO0tBQ3pCO0lBQ0QsT0FBTyxJQUFJO0lBQ1o7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxNQUFNLElBQUk7SUFDM0MsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU07SUFDckIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtNQUNqQixNQUFNLElBQUksVUFBVSxDQUFDLDJDQUEyQyxDQUFDO0tBQ2xFO0lBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO01BQy9CLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUM7TUFDcEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUM7TUFDeEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUM7TUFDeEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUM7S0FDekI7SUFDRCxPQUFPLElBQUk7SUFDWjs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxTQUFTLFFBQVEsSUFBSTtJQUMvQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUM7SUFDNUIsSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRTtJQUMzQixJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE9BQU8sU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDO0lBQzdELE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDO0lBQzNDOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsTUFBTSxFQUFFLENBQUMsRUFBRTtJQUM1QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQywyQkFBMkIsQ0FBQztJQUMxRSxJQUFJLElBQUksS0FBSyxDQUFDLEVBQUUsT0FBTyxJQUFJO0lBQzNCLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNyQzs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxTQUFTLE9BQU8sSUFBSTtJQUM3QyxJQUFJLEdBQUcsR0FBRyxHQUFFO0lBQ1osSUFBSSxHQUFHLEdBQUcsa0JBQWlCO0lBQzNCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7TUFDbkIsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQztNQUMzRCxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLEdBQUcsSUFBSSxRQUFPO0tBQ3RDO0lBQ0QsT0FBTyxVQUFVLEdBQUcsR0FBRyxHQUFHLEdBQUc7SUFDOUI7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRTtJQUNuRixJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEVBQUU7TUFDN0IsTUFBTSxJQUFJLFNBQVMsQ0FBQywyQkFBMkIsQ0FBQztLQUNqRDs7SUFFRCxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7TUFDdkIsS0FBSyxHQUFHLEVBQUM7S0FDVjtJQUNELElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtNQUNyQixHQUFHLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsRUFBQztLQUNqQztJQUNELElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtNQUMzQixTQUFTLEdBQUcsRUFBQztLQUNkO0lBQ0QsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFO01BQ3pCLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTTtLQUN0Qjs7SUFFRCxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksU0FBUyxHQUFHLENBQUMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtNQUM5RSxNQUFNLElBQUksVUFBVSxDQUFDLG9CQUFvQixDQUFDO0tBQzNDOztJQUVELElBQUksU0FBUyxJQUFJLE9BQU8sSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFO01BQ3hDLE9BQU8sQ0FBQztLQUNUO0lBQ0QsSUFBSSxTQUFTLElBQUksT0FBTyxFQUFFO01BQ3hCLE9BQU8sQ0FBQyxDQUFDO0tBQ1Y7SUFDRCxJQUFJLEtBQUssSUFBSSxHQUFHLEVBQUU7TUFDaEIsT0FBTyxDQUFDO0tBQ1Q7O0lBRUQsS0FBSyxNQUFNLEVBQUM7SUFDWixHQUFHLE1BQU0sRUFBQztJQUNWLFNBQVMsTUFBTSxFQUFDO0lBQ2hCLE9BQU8sTUFBTSxFQUFDOztJQUVkLElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRSxPQUFPLENBQUM7O0lBRTdCLElBQUksQ0FBQyxHQUFHLE9BQU8sR0FBRyxVQUFTO0lBQzNCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxNQUFLO0lBQ25CLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQzs7SUFFeEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFDO0lBQzdDLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQzs7SUFFekMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtNQUM1QixJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDakMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEVBQUM7UUFDZixDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBQztRQUNqQixLQUFLO09BQ047S0FDRjs7SUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUNuQixPQUFPLENBQUM7SUFDVDs7Ozs7Ozs7Ozs7RUFXRCxTQUFTLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7O0lBRXJFLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7OztJQUdsQyxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtNQUNsQyxRQUFRLEdBQUcsV0FBVTtNQUNyQixVQUFVLEdBQUcsRUFBQztLQUNmLE1BQU0sSUFBSSxVQUFVLEdBQUcsVUFBVSxFQUFFO01BQ2xDLFVBQVUsR0FBRyxXQUFVO0tBQ3hCLE1BQU0sSUFBSSxVQUFVLEdBQUcsQ0FBQyxVQUFVLEVBQUU7TUFDbkMsVUFBVSxHQUFHLENBQUMsV0FBVTtLQUN6QjtJQUNELFVBQVUsR0FBRyxDQUFDLFdBQVU7SUFDeEIsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUU7O01BRXJCLFVBQVUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFDO0tBQzNDOzs7SUFHRCxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUUsVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsV0FBVTtJQUMzRCxJQUFJLFVBQVUsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO01BQy9CLElBQUksR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1dBQ2IsVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsRUFBQztLQUNwQyxNQUFNLElBQUksVUFBVSxHQUFHLENBQUMsRUFBRTtNQUN6QixJQUFJLEdBQUcsRUFBRSxVQUFVLEdBQUcsRUFBQztXQUNsQixPQUFPLENBQUMsQ0FBQztLQUNmOzs7SUFHRCxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtNQUMzQixHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFDO0tBQ2pDOzs7SUFHRCxJQUFJLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxFQUFFOztNQUV6QixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ3BCLE9BQU8sQ0FBQyxDQUFDO09BQ1Y7TUFDRCxPQUFPLFlBQVksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDO0tBQzVELE1BQU0sSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7TUFDbEMsR0FBRyxHQUFHLEdBQUcsR0FBRyxLQUFJO01BQ2hCLElBQUksTUFBTSxDQUFDLG1CQUFtQjtVQUMxQixPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxLQUFLLFVBQVUsRUFBRTtRQUN0RCxJQUFJLEdBQUcsRUFBRTtVQUNQLE9BQU8sVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDO1NBQ2xFLE1BQU07VUFDTCxPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFVBQVUsQ0FBQztTQUN0RTtPQUNGO01BQ0QsT0FBTyxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxHQUFHLENBQUM7S0FDaEU7O0lBRUQsTUFBTSxJQUFJLFNBQVMsQ0FBQyxzQ0FBc0MsQ0FBQztHQUM1RDs7RUFFRCxTQUFTLFlBQVksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQzFELElBQUksU0FBUyxHQUFHLEVBQUM7SUFDakIsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLE9BQU07SUFDMUIsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLE9BQU07O0lBRTFCLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtNQUMxQixRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsR0FBRTtNQUN6QyxJQUFJLFFBQVEsS0FBSyxNQUFNLElBQUksUUFBUSxLQUFLLE9BQU87VUFDM0MsUUFBUSxLQUFLLFNBQVMsSUFBSSxRQUFRLEtBQUssVUFBVSxFQUFFO1FBQ3JELElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7VUFDcEMsT0FBTyxDQUFDLENBQUM7U0FDVjtRQUNELFNBQVMsR0FBRyxFQUFDO1FBQ2IsU0FBUyxJQUFJLEVBQUM7UUFDZCxTQUFTLElBQUksRUFBQztRQUNkLFVBQVUsSUFBSSxFQUFDO09BQ2hCO0tBQ0Y7O0lBRUQsU0FBUyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTtNQUNyQixJQUFJLFNBQVMsS0FBSyxDQUFDLEVBQUU7UUFDbkIsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO09BQ2QsTUFBTTtRQUNMLE9BQU8sR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO09BQ3ZDO0tBQ0Y7O0lBRUQsSUFBSSxFQUFDO0lBQ0wsSUFBSSxHQUFHLEVBQUU7TUFDUCxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUM7TUFDbkIsS0FBSyxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdkMsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLEVBQUU7VUFDdEUsSUFBSSxVQUFVLEtBQUssQ0FBQyxDQUFDLEVBQUUsVUFBVSxHQUFHLEVBQUM7VUFDckMsSUFBSSxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsS0FBSyxTQUFTLEVBQUUsT0FBTyxVQUFVLEdBQUcsU0FBUztTQUNwRSxNQUFNO1VBQ0wsSUFBSSxVQUFVLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxXQUFVO1VBQzFDLFVBQVUsR0FBRyxDQUFDLEVBQUM7U0FDaEI7T0FDRjtLQUNGLE1BQU07TUFDTCxJQUFJLFVBQVUsR0FBRyxTQUFTLEdBQUcsU0FBUyxFQUFFLFVBQVUsR0FBRyxTQUFTLEdBQUcsVUFBUztNQUMxRSxLQUFLLENBQUMsR0FBRyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNoQyxJQUFJLEtBQUssR0FBRyxLQUFJO1FBQ2hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7VUFDbEMsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFO1lBQ3JDLEtBQUssR0FBRyxNQUFLO1lBQ2IsS0FBSztXQUNOO1NBQ0Y7UUFDRCxJQUFJLEtBQUssRUFBRSxPQUFPLENBQUM7T0FDcEI7S0FDRjs7SUFFRCxPQUFPLENBQUMsQ0FBQztHQUNWOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFNBQVMsUUFBUSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFO0lBQ3hFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0RDs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxTQUFTLE9BQU8sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRTtJQUN0RSxPQUFPLG9CQUFvQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUM7SUFDbkU7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxXQUFXLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUU7SUFDOUUsT0FBTyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDO0lBQ3BFOztFQUVELFNBQVMsUUFBUSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtJQUM5QyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUM7SUFDNUIsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxPQUFNO0lBQ25DLElBQUksQ0FBQyxNQUFNLEVBQUU7TUFDWCxNQUFNLEdBQUcsVUFBUztLQUNuQixNQUFNO01BQ0wsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUM7TUFDdkIsSUFBSSxNQUFNLEdBQUcsU0FBUyxFQUFFO1FBQ3RCLE1BQU0sR0FBRyxVQUFTO09BQ25CO0tBQ0Y7OztJQUdELElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFNO0lBQzFCLElBQUksTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQzs7SUFFL0QsSUFBSSxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsRUFBRTtNQUN2QixNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUM7S0FDcEI7SUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO01BQy9CLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFDO01BQ2xELElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sQ0FBQztNQUMzQixHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU07S0FDekI7SUFDRCxPQUFPLENBQUM7R0FDVDs7RUFFRCxTQUFTLFNBQVMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7SUFDL0MsT0FBTyxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO0dBQ2pGOztFQUVELFNBQVMsVUFBVSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtJQUNoRCxPQUFPLFVBQVUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7R0FDN0Q7O0VBRUQsU0FBUyxXQUFXLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO0lBQ2pELE9BQU8sVUFBVSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQztHQUMvQzs7RUFFRCxTQUFTLFdBQVcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7SUFDakQsT0FBTyxVQUFVLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO0dBQzlEOztFQUVELFNBQVMsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtJQUMvQyxPQUFPLFVBQVUsQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7R0FDcEY7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFOztJQUV6RSxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7TUFDeEIsUUFBUSxHQUFHLE9BQU07TUFDakIsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFNO01BQ3BCLE1BQU0sR0FBRyxFQUFDOztLQUVYLE1BQU0sSUFBSSxNQUFNLEtBQUssU0FBUyxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtNQUM3RCxRQUFRLEdBQUcsT0FBTTtNQUNqQixNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU07TUFDcEIsTUFBTSxHQUFHLEVBQUM7O0tBRVgsTUFBTSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtNQUMzQixNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUM7TUFDbkIsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDcEIsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO1FBQ25CLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRSxRQUFRLEdBQUcsT0FBTTtPQUM5QyxNQUFNO1FBQ0wsUUFBUSxHQUFHLE9BQU07UUFDakIsTUFBTSxHQUFHLFVBQVM7T0FDbkI7O0tBRUYsTUFBTTtNQUNMLE1BQU0sSUFBSSxLQUFLO1FBQ2IseUVBQXlFO09BQzFFO0tBQ0Y7O0lBRUQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFNO0lBQ3BDLElBQUksTUFBTSxLQUFLLFNBQVMsSUFBSSxNQUFNLEdBQUcsU0FBUyxFQUFFLE1BQU0sR0FBRyxVQUFTOztJQUVsRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssTUFBTSxHQUFHLENBQUMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7TUFDN0UsTUFBTSxJQUFJLFVBQVUsQ0FBQyx3Q0FBd0MsQ0FBQztLQUMvRDs7SUFFRCxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsR0FBRyxPQUFNOztJQUVoQyxJQUFJLFdBQVcsR0FBRyxNQUFLO0lBQ3ZCLFNBQVM7TUFDUCxRQUFRLFFBQVE7UUFDZCxLQUFLLEtBQUs7VUFDUixPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7O1FBRS9DLEtBQUssTUFBTSxDQUFDO1FBQ1osS0FBSyxPQUFPO1VBQ1YsT0FBTyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDOztRQUVoRCxLQUFLLE9BQU87VUFDVixPQUFPLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7O1FBRWpELEtBQUssUUFBUSxDQUFDO1FBQ2QsS0FBSyxRQUFRO1VBQ1gsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDOztRQUVsRCxLQUFLLFFBQVE7O1VBRVgsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDOztRQUVsRCxLQUFLLE1BQU0sQ0FBQztRQUNaLEtBQUssT0FBTyxDQUFDO1FBQ2IsS0FBSyxTQUFTLENBQUM7UUFDZixLQUFLLFVBQVU7VUFDYixPQUFPLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7O1FBRWhEO1VBQ0UsSUFBSSxXQUFXLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxvQkFBb0IsR0FBRyxRQUFRLENBQUM7VUFDckUsUUFBUSxHQUFHLENBQUMsRUFBRSxHQUFHLFFBQVEsRUFBRSxXQUFXLEdBQUU7VUFDeEMsV0FBVyxHQUFHLEtBQUk7T0FDckI7S0FDRjtJQUNGOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsTUFBTSxJQUFJO0lBQzNDLE9BQU87TUFDTCxJQUFJLEVBQUUsUUFBUTtNQUNkLElBQUksRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQ3ZEO0lBQ0Y7O0VBRUQsU0FBUyxXQUFXLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFDckMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxHQUFHLENBQUMsTUFBTSxFQUFFO01BQ3JDLE9BQU9DLGFBQW9CLENBQUMsR0FBRyxDQUFDO0tBQ2pDLE1BQU07TUFDTCxPQUFPQSxhQUFvQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ25EO0dBQ0Y7O0VBRUQsU0FBUyxTQUFTLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFDbkMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUM7SUFDL0IsSUFBSSxHQUFHLEdBQUcsR0FBRTs7SUFFWixJQUFJLENBQUMsR0FBRyxNQUFLO0lBQ2IsT0FBTyxDQUFDLEdBQUcsR0FBRyxFQUFFO01BQ2QsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBQztNQUN0QixJQUFJLFNBQVMsR0FBRyxLQUFJO01BQ3BCLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUM7VUFDekMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUM7VUFDdEIsQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUM7VUFDdEIsRUFBQzs7TUFFTCxJQUFJLENBQUMsR0FBRyxnQkFBZ0IsSUFBSSxHQUFHLEVBQUU7UUFDL0IsSUFBSSxVQUFVLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxjQUFhOztRQUVwRCxRQUFRLGdCQUFnQjtVQUN0QixLQUFLLENBQUM7WUFDSixJQUFJLFNBQVMsR0FBRyxJQUFJLEVBQUU7Y0FDcEIsU0FBUyxHQUFHLFVBQVM7YUFDdEI7WUFDRCxLQUFLO1VBQ1AsS0FBSyxDQUFDO1lBQ0osVUFBVSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDO1lBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxNQUFNLElBQUksRUFBRTtjQUNoQyxhQUFhLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxLQUFLLEdBQUcsSUFBSSxVQUFVLEdBQUcsSUFBSSxFQUFDO2NBQy9ELElBQUksYUFBYSxHQUFHLElBQUksRUFBRTtnQkFDeEIsU0FBUyxHQUFHLGNBQWE7ZUFDMUI7YUFDRjtZQUNELEtBQUs7VUFDUCxLQUFLLENBQUM7WUFDSixVQUFVLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUM7WUFDdkIsU0FBUyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDO1lBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLE1BQU0sSUFBSSxFQUFFO2NBQy9ELGFBQWEsR0FBRyxDQUFDLFNBQVMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksS0FBSyxHQUFHLElBQUksU0FBUyxHQUFHLElBQUksRUFBQztjQUMxRixJQUFJLGFBQWEsR0FBRyxLQUFLLEtBQUssYUFBYSxHQUFHLE1BQU0sSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLEVBQUU7Z0JBQy9FLFNBQVMsR0FBRyxjQUFhO2VBQzFCO2FBQ0Y7WUFDRCxLQUFLO1VBQ1AsS0FBSyxDQUFDO1lBQ0osVUFBVSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDO1lBQ3ZCLFNBQVMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQztZQUN0QixVQUFVLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUM7WUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxNQUFNLElBQUksRUFBRTtjQUMvRixhQUFhLEdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxLQUFLLElBQUksR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksS0FBSyxHQUFHLElBQUksVUFBVSxHQUFHLElBQUksRUFBQztjQUN4SCxJQUFJLGFBQWEsR0FBRyxNQUFNLElBQUksYUFBYSxHQUFHLFFBQVEsRUFBRTtnQkFDdEQsU0FBUyxHQUFHLGNBQWE7ZUFDMUI7YUFDRjtTQUNKO09BQ0Y7O01BRUQsSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFOzs7UUFHdEIsU0FBUyxHQUFHLE9BQU07UUFDbEIsZ0JBQWdCLEdBQUcsRUFBQztPQUNyQixNQUFNLElBQUksU0FBUyxHQUFHLE1BQU0sRUFBRTs7UUFFN0IsU0FBUyxJQUFJLFFBQU87UUFDcEIsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssRUFBRSxHQUFHLEtBQUssR0FBRyxNQUFNLEVBQUM7UUFDM0MsU0FBUyxHQUFHLE1BQU0sR0FBRyxTQUFTLEdBQUcsTUFBSztPQUN2Qzs7TUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQztNQUNuQixDQUFDLElBQUksaUJBQWdCO0tBQ3RCOztJQUVELE9BQU8scUJBQXFCLENBQUMsR0FBRyxDQUFDO0dBQ2xDOzs7OztFQUtELElBQUksb0JBQW9CLEdBQUcsT0FBTTs7RUFFakMsU0FBUyxxQkFBcUIsRUFBRSxVQUFVLEVBQUU7SUFDMUMsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLE9BQU07SUFDM0IsSUFBSSxHQUFHLElBQUksb0JBQW9CLEVBQUU7TUFDL0IsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDO0tBQ3JEOzs7SUFHRCxJQUFJLEdBQUcsR0FBRyxHQUFFO0lBQ1osSUFBSSxDQUFDLEdBQUcsRUFBQztJQUNULE9BQU8sQ0FBQyxHQUFHLEdBQUcsRUFBRTtNQUNkLEdBQUcsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUs7UUFDOUIsTUFBTTtRQUNOLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxvQkFBb0IsQ0FBQztRQUMvQztLQUNGO0lBQ0QsT0FBTyxHQUFHO0dBQ1g7O0VBRUQsU0FBUyxVQUFVLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFDcEMsSUFBSSxHQUFHLEdBQUcsR0FBRTtJQUNaLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFDOztJQUUvQixLQUFLLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFO01BQ2hDLEdBQUcsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUM7S0FDMUM7SUFDRCxPQUFPLEdBQUc7R0FDWDs7RUFFRCxTQUFTLFdBQVcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTtJQUNyQyxJQUFJLEdBQUcsR0FBRyxHQUFFO0lBQ1osR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUM7O0lBRS9CLEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUU7TUFDaEMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDO0tBQ25DO0lBQ0QsT0FBTyxHQUFHO0dBQ1g7O0VBRUQsU0FBUyxRQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFDbEMsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU07O0lBRXBCLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsRUFBQztJQUNsQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsSUFBRzs7SUFFM0MsSUFBSSxHQUFHLEdBQUcsR0FBRTtJQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUU7TUFDaEMsR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUM7S0FDckI7SUFDRCxPQUFPLEdBQUc7R0FDWDs7RUFFRCxTQUFTLFlBQVksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUM7SUFDakMsSUFBSSxHQUFHLEdBQUcsR0FBRTtJQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDeEMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFDO0tBQzFEO0lBQ0QsT0FBTyxHQUFHO0dBQ1g7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTtJQUNuRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTTtJQUNyQixLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQUs7SUFDZixHQUFHLEdBQUcsR0FBRyxLQUFLLFNBQVMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUc7O0lBRXJDLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtNQUNiLEtBQUssSUFBSSxJQUFHO01BQ1osSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxFQUFDO0tBQ3pCLE1BQU0sSUFBSSxLQUFLLEdBQUcsR0FBRyxFQUFFO01BQ3RCLEtBQUssR0FBRyxJQUFHO0tBQ1o7O0lBRUQsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFO01BQ1gsR0FBRyxJQUFJLElBQUc7TUFDVixJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEVBQUM7S0FDckIsTUFBTSxJQUFJLEdBQUcsR0FBRyxHQUFHLEVBQUU7TUFDcEIsR0FBRyxHQUFHLElBQUc7S0FDVjs7SUFFRCxJQUFJLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBRyxHQUFHLE1BQUs7O0lBRTVCLElBQUksT0FBTTtJQUNWLElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO01BQzlCLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUM7TUFDbEMsTUFBTSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsVUFBUztLQUNwQyxNQUFNO01BQ0wsSUFBSSxRQUFRLEdBQUcsR0FBRyxHQUFHLE1BQUs7TUFDMUIsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUM7TUFDeEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUNqQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUM7T0FDNUI7S0FDRjs7SUFFRCxPQUFPLE1BQU07SUFDZDs7Ozs7RUFLRCxTQUFTLFdBQVcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRTtJQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLElBQUksVUFBVSxDQUFDLG9CQUFvQixDQUFDO0lBQ2hGLElBQUksTUFBTSxHQUFHLEdBQUcsR0FBRyxNQUFNLEVBQUUsTUFBTSxJQUFJLFVBQVUsQ0FBQyx1Q0FBdUMsQ0FBQztHQUN6Rjs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxTQUFTLFVBQVUsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRTtJQUMvRSxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUM7SUFDbkIsVUFBVSxHQUFHLFVBQVUsR0FBRyxFQUFDO0lBQzNCLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQzs7SUFFM0QsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBQztJQUN0QixJQUFJLEdBQUcsR0FBRyxFQUFDO0lBQ1gsSUFBSSxDQUFDLEdBQUcsRUFBQztJQUNULE9BQU8sRUFBRSxDQUFDLEdBQUcsVUFBVSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRTtNQUN6QyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFHO0tBQzlCOztJQUVELE9BQU8sR0FBRztJQUNYOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFNBQVMsVUFBVSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFO0lBQy9FLE1BQU0sR0FBRyxNQUFNLEdBQUcsRUFBQztJQUNuQixVQUFVLEdBQUcsVUFBVSxHQUFHLEVBQUM7SUFDM0IsSUFBSSxDQUFDLFFBQVEsRUFBRTtNQUNiLFdBQVcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7S0FDN0M7O0lBRUQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLFVBQVUsRUFBQztJQUNyQyxJQUFJLEdBQUcsR0FBRyxFQUFDO0lBQ1gsT0FBTyxVQUFVLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRTtNQUN2QyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLFVBQVUsQ0FBQyxHQUFHLElBQUc7S0FDekM7O0lBRUQsT0FBTyxHQUFHO0lBQ1g7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUNqRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDbEQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3BCOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsWUFBWSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7SUFDdkUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0lBQ2xELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlDOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsWUFBWSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7SUFDdkUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0lBQ2xELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQzlDOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsWUFBWSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7SUFDdkUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDOztJQUVsRCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ25DOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsWUFBWSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7SUFDdkUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDOztJQUVsRCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFNBQVM7T0FDN0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUU7T0FDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNwQjs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLFNBQVMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRTtJQUM3RSxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUM7SUFDbkIsVUFBVSxHQUFHLFVBQVUsR0FBRyxFQUFDO0lBQzNCLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQzs7SUFFM0QsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBQztJQUN0QixJQUFJLEdBQUcsR0FBRyxFQUFDO0lBQ1gsSUFBSSxDQUFDLEdBQUcsRUFBQztJQUNULE9BQU8sRUFBRSxDQUFDLEdBQUcsVUFBVSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRTtNQUN6QyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFHO0tBQzlCO0lBQ0QsR0FBRyxJQUFJLEtBQUk7O0lBRVgsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFDOztJQUVsRCxPQUFPLEdBQUc7SUFDWDs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLFNBQVMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRTtJQUM3RSxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUM7SUFDbkIsVUFBVSxHQUFHLFVBQVUsR0FBRyxFQUFDO0lBQzNCLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQzs7SUFFM0QsSUFBSSxDQUFDLEdBQUcsV0FBVTtJQUNsQixJQUFJLEdBQUcsR0FBRyxFQUFDO0lBQ1gsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBQztJQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLEtB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QUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDckI7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxXQUFXLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUNyRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDbEQsT0FBT0MsSUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDL0M7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxXQUFXLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUNyRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDbEQsT0FBT0EsSUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDaEQ7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDbEQsT0FBT0EsSUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDL0M7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDbEQsT0FBT0EsSUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLEVB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
