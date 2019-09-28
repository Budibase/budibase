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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVkaWJhc2UtY29yZS51bWQuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21tb24vZXZlbnRzLmpzIiwiLi4vc3JjL2NvbW1vbi9lcnJvcnMuanMiLCIuLi9zcmMvY29tbW9uL2FwaVdyYXBwZXIuanMiLCIuLi9zcmMvY29tbW9uL2xvY2suanMiLCIuLi9zcmMvY29tbW9uL2luZGV4LmpzIiwiLi4vc3JjL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uLmpzIiwiLi4vc3JjL2luZGV4aW5nL2V2YWx1YXRlLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2luZGV4ZXMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvaGllcmFyY2h5LmpzIiwiLi4vc3JjL3R5cGVzL3R5cGVIZWxwZXJzLmpzIiwiLi4vc3JjL3R5cGVzL3N0cmluZy5qcyIsIi4uL3NyYy90eXBlcy9ib29sLmpzIiwiLi4vc3JjL3R5cGVzL251bWJlci5qcyIsIi4uL3NyYy90eXBlcy9kYXRldGltZS5qcyIsIi4uL3NyYy90eXBlcy9hcnJheS5qcyIsIi4uL3NyYy90eXBlcy9yZWZlcmVuY2UuanMiLCIuLi9zcmMvdHlwZXMvZmlsZS5qcyIsIi4uL3NyYy90eXBlcy9pbmRleC5qcyIsIi4uL3NyYy9hdXRoQXBpL2F1dGhDb21tb24uanMiLCIuLi9zcmMvYXV0aEFwaS9pc0F1dGhvcml6ZWQuanMiLCIuLi9zcmMvYXV0aEFwaS9wZXJtaXNzaW9ucy5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZ2V0TmV3LmpzIiwiLi4vc3JjL3JlY29yZEFwaS9sb2FkLmpzIiwiLi4vc3JjL2luZGV4aW5nL3Byb21pc2VSZWFkYWJsZVN0cmVhbS5qcyIsIi4uL3NyYy9pbmRleGluZy9zaGFyZGluZy5qcyIsIi4uL3NyYy9pbmRleGluZy9pbmRleFNjaGVtYUNyZWF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvcm9sbHVwLXBsdWdpbi1ub2RlLWdsb2JhbHMvc3JjL2dsb2JhbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9idWZmZXItZXM2L2Jhc2U2NC5qcyIsIi4uL25vZGVfbW9kdWxlcy9idWZmZXItZXM2L2llZWU3NTQuanMiLCIuLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVzNi9pc0FycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2J1ZmZlci1lczYvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvcm9sbHVwLXBsdWdpbi1ub2RlLWJ1aWx0aW5zL3NyYy9lczYvc3RyaW5nLWRlY29kZXIuanMiLCIuLi9zcmMvaW5kZXhpbmcvc2VyaWFsaXplci5qcyIsIi4uL3NyYy9pbmRleGluZy9yZWFkLmpzIiwiLi4vc3JjL2luZGV4QXBpL2xpc3RJdGVtcy5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZ2V0Q29udGV4dC5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvdmFsaWRhdGUuanMiLCIuLi9zcmMvY29sbGVjdGlvbkFwaS9pbml0aWFsaXNlLmpzIiwiLi4vc3JjL2luZGV4aW5nL2FsbElkcy5qcyIsIi4uL3NyYy90cmFuc2FjdGlvbnMvdHJhbnNhY3Rpb25zQ29tbW9uLmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9jcmVhdGUuanMiLCIuLi9zcmMvaW5kZXhpbmcvaW5pdGlhbGlzZUluZGV4LmpzIiwiLi4vc3JjL3JlY29yZEFwaS9zYXZlLmpzIiwiLi4vc3JjL2NvbGxlY3Rpb25BcGkvZGVsZXRlLmpzIiwiLi4vc3JjL2luZGV4QXBpL2RlbGV0ZS5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZGVsZXRlLmpzIiwiLi4vc3JjL3JlY29yZEFwaS91cGxvYWRGaWxlLmpzIiwiLi4vc3JjL3JlY29yZEFwaS9kb3dubG9hZEZpbGUuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2N1c3RvbUlkLmpzIiwiLi4vc3JjL3JlY29yZEFwaS9pbmRleC5qcyIsIi4uL3NyYy9jb2xsZWN0aW9uQXBpL2dldEFsbG93ZWRSZWNvcmRUeXBlcy5qcyIsIi4uL3NyYy9jb2xsZWN0aW9uQXBpL2luZGV4LmpzIiwiLi4vc3JjL2luZGV4QXBpL2J1aWxkSW5kZXguanMiLCIuLi9zcmMvaW5kZXhBcGkvYWdncmVnYXRlcy5qcyIsIi4uL3NyYy9pbmRleEFwaS9pbmRleC5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9jcmVhdGVOb2Rlcy5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9maWVsZHMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvcmVjb3JkVmFsaWRhdGlvblJ1bGVzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2NyZWF0ZUFjdGlvbnMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvdmFsaWRhdGVBZ2dyZWdhdGUuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvdmFsaWRhdGUuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL3NhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeS5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9zYXZlQWN0aW9uc0FuZFRyaWdnZXJzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2dldEJlaGF2aW91clNvdXJjZXMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvaW5kZXguanMiLCIuLi9zcmMvYXV0aEFwaS9nZXRVc2Vycy5qcyIsIi4uL3NyYy9hdXRoQXBpL2xvYWRBY2Nlc3NMZXZlbHMuanMiLCIuLi9zcmMvYXV0aEFwaS9hdXRoZW50aWNhdGUuanMiLCIuLi9zcmMvYXV0aEFwaS9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MuanMiLCIuLi9zcmMvYXV0aEFwaS92YWxpZGF0ZVVzZXIuanMiLCIuLi9zcmMvYXV0aEFwaS9nZXROZXdVc2VyLmpzIiwiLi4vc3JjL2F1dGhBcGkvc2V0UGFzc3dvcmQuanMiLCIuLi9zcmMvYXV0aEFwaS9jcmVhdGVVc2VyLmpzIiwiLi4vc3JjL2F1dGhBcGkvZW5hYmxlVXNlci5qcyIsIi4uL3NyYy9hdXRoQXBpL2dldE5ld0FjY2Vzc0xldmVsLmpzIiwiLi4vc3JjL2F1dGhBcGkvdmFsaWRhdGVBY2Nlc3NMZXZlbHMuanMiLCIuLi9zcmMvYXV0aEFwaS9zYXZlQWNjZXNzTGV2ZWxzLmpzIiwiLi4vc3JjL2F1dGhBcGkvZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMuanMiLCIuLi9zcmMvYXV0aEFwaS9zZXRVc2VyQWNjZXNzTGV2ZWxzLmpzIiwiLi4vc3JjL2F1dGhBcGkvaW5kZXguanMiLCIuLi9zcmMvYWN0aW9uc0FwaS9leGVjdXRlLmpzIiwiLi4vc3JjL2FjdGlvbnNBcGkvaW5kZXguanMiLCIuLi9zcmMvYXBwSW5pdGlhbGlzZS9ldmVudEFnZ3JlZ2F0b3IuanMiLCIuLi9zcmMvYXBwSW5pdGlhbGlzZS9pbmRleC5qcyIsIi4uL3NyYy9jb21tb24vY29tcGlsZUNvZGUuanMiLCIuLi9zcmMvYWN0aW9uc0FwaS9pbml0aWFsaXNlLmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9yZXRyaWV2ZS5qcyIsIi4uL3NyYy9pbmRleGluZy9yZWxldmFudC5qcyIsIi4uL3NyYy9pbmRleGluZy9wcm9taXNlV3JpdGFibGVTdHJlYW0uanMiLCIuLi9zcmMvaW5kZXhpbmcvYXBwbHkuanMiLCIuLi9zcmMvdHJhbnNhY3Rpb25zL2V4ZWN1dGUuanMiLCIuLi9zcmMvdHJhbnNhY3Rpb25zL2NsZWFudXAuanMiLCIuLi9zcmMvYXBwSW5pdGlhbGlzZS9pbml0aWFsaXNlRGF0YS5qcyIsIi4uL3NyYy9hcHBJbml0aWFsaXNlL2RhdGFiYXNlTWFuYWdlci5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1bmlvbiwgcmVkdWNlIH0gZnJvbSAnbG9kYXNoL2ZwJztcblxuY29uc3QgY29tbW9uUGx1cyA9IGV4dHJhID0+IHVuaW9uKFsnb25CZWdpbicsICdvbkNvbXBsZXRlJywgJ29uRXJyb3InXSkoZXh0cmEpO1xuXG5jb25zdCBjb21tb24gPSAoKSA9PiBjb21tb25QbHVzKFtdKTtcblxuY29uc3QgX2V2ZW50cyA9IHtcbiAgcmVjb3JkQXBpOiB7XG4gICAgc2F2ZTogY29tbW9uUGx1cyhbXG4gICAgICAnb25JbnZhbGlkJyxcbiAgICAgICdvblJlY29yZFVwZGF0ZWQnLFxuICAgICAgJ29uUmVjb3JkQ3JlYXRlZCddKSxcbiAgICBkZWxldGU6IGNvbW1vbigpLFxuICAgIGdldENvbnRleHQ6IGNvbW1vbigpLFxuICAgIGdldE5ldzogY29tbW9uKCksXG4gICAgbG9hZDogY29tbW9uKCksXG4gICAgdmFsaWRhdGU6IGNvbW1vbigpLFxuICAgIHVwbG9hZEZpbGU6IGNvbW1vbigpLFxuICAgIGRvd25sb2FkRmlsZTogY29tbW9uKCksXG4gIH0sXG4gIGluZGV4QXBpOiB7XG4gICAgYnVpbGRJbmRleDogY29tbW9uKCksXG4gICAgbGlzdEl0ZW1zOiBjb21tb24oKSxcbiAgICBkZWxldGU6IGNvbW1vbigpLFxuICAgIGFnZ3JlZ2F0ZXM6IGNvbW1vbigpLFxuICB9LFxuICBjb2xsZWN0aW9uQXBpOiB7XG4gICAgZ2V0QWxsb3dlZFJlY29yZFR5cGVzOiBjb21tb24oKSxcbiAgICBpbml0aWFsaXNlOiBjb21tb24oKSxcbiAgICBkZWxldGU6IGNvbW1vbigpLFxuICB9LFxuICBhdXRoQXBpOiB7XG4gICAgYXV0aGVudGljYXRlOiBjb21tb24oKSxcbiAgICBhdXRoZW50aWNhdGVUZW1wb3JhcnlBY2Nlc3M6IGNvbW1vbigpLFxuICAgIGNyZWF0ZVRlbXBvcmFyeUFjY2VzczogY29tbW9uKCksXG4gICAgY3JlYXRlVXNlcjogY29tbW9uKCksXG4gICAgZW5hYmxlVXNlcjogY29tbW9uKCksXG4gICAgZGlzYWJsZVVzZXI6IGNvbW1vbigpLFxuICAgIGxvYWRBY2Nlc3NMZXZlbHM6IGNvbW1vbigpLFxuICAgIGdldE5ld0FjY2Vzc0xldmVsOiBjb21tb24oKSxcbiAgICBnZXROZXdVc2VyOiBjb21tb24oKSxcbiAgICBnZXROZXdVc2VyQXV0aDogY29tbW9uKCksXG4gICAgZ2V0VXNlcnM6IGNvbW1vbigpLFxuICAgIHNhdmVBY2Nlc3NMZXZlbHM6IGNvbW1vbigpLFxuICAgIGlzQXV0aG9yaXplZDogY29tbW9uKCksXG4gICAgY2hhbmdlTXlQYXNzd29yZDogY29tbW9uKCksXG4gICAgc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZTogY29tbW9uKCksXG4gICAgc2NvcmVQYXNzd29yZDogY29tbW9uKCksXG4gICAgaXNWYWxpZFBhc3N3b3JkOiBjb21tb24oKSxcbiAgICB2YWxpZGF0ZVVzZXI6IGNvbW1vbigpLFxuICAgIHZhbGlkYXRlQWNjZXNzTGV2ZWxzOiBjb21tb24oKSxcbiAgICBzZXRVc2VyQWNjZXNzTGV2ZWxzOiBjb21tb24oKSxcbiAgfSxcbiAgdGVtcGxhdGVBcGk6IHtcbiAgICBzYXZlQXBwbGljYXRpb25IaWVyYXJjaHk6IGNvbW1vbigpLFxuICAgIHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnM6IGNvbW1vbigpLFxuICB9LFxuICBhY3Rpb25zQXBpOiB7XG4gICAgZXhlY3V0ZTogY29tbW9uKCksXG4gIH0sXG59O1xuXG5jb25zdCBfZXZlbnRzTGlzdCA9IFtdO1xuXG5jb25zdCBtYWtlRXZlbnQgPSAoYXJlYSwgbWV0aG9kLCBuYW1lKSA9PiBgJHthcmVhfToke21ldGhvZH06JHtuYW1lfWA7XG5cbmZvciAoY29uc3QgYXJlYUtleSBpbiBfZXZlbnRzKSB7XG4gIGZvciAoY29uc3QgbWV0aG9kS2V5IGluIF9ldmVudHNbYXJlYUtleV0pIHtcbiAgICBfZXZlbnRzW2FyZWFLZXldW21ldGhvZEtleV0gPSByZWR1Y2UoKG9iaiwgcykgPT4ge1xuICAgICAgb2JqW3NdID0gbWFrZUV2ZW50KGFyZWFLZXksIG1ldGhvZEtleSwgcyk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0sXG4gICAge30pKF9ldmVudHNbYXJlYUtleV1bbWV0aG9kS2V5XSk7XG4gIH1cbn1cblxuXG5mb3IgKGNvbnN0IGFyZWFLZXkgaW4gX2V2ZW50cykge1xuICBmb3IgKGNvbnN0IG1ldGhvZEtleSBpbiBfZXZlbnRzW2FyZWFLZXldKSB7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIF9ldmVudHNbYXJlYUtleV1bbWV0aG9kS2V5XSkge1xuICAgICAgX2V2ZW50c0xpc3QucHVzaChcbiAgICAgICAgX2V2ZW50c1thcmVhS2V5XVttZXRob2RLZXldW25hbWVdLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuXG5leHBvcnQgY29uc3QgZXZlbnRzID0gX2V2ZW50cztcblxuZXhwb3J0IGNvbnN0IGV2ZW50c0xpc3QgPSBfZXZlbnRzTGlzdDtcblxuZXhwb3J0IGRlZmF1bHQgeyBldmVudHM6IF9ldmVudHMsIGV2ZW50c0xpc3Q6IF9ldmVudHNMaXN0IH07XG4iLCJleHBvcnQgY2xhc3MgQmFkUmVxdWVzdEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDA7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5hdXRob3Jpc2VkRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDQwMTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGb3JiaWRkZW5FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmh0dHBTdGF0dXNDb2RlID0gNDAzO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5vdEZvdW5kRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDQwNDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb25mbGljdEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDk7XG4gICAgfVxufSIsImltcG9ydCB7IGNsb25lRGVlcCwgaXNVbmRlZmluZWQgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcbmltcG9ydCB7IFVuYXV0aG9yaXNlZEVycm9yIH0gZnJvbSAnLi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgYXBpV3JhcHBlciA9IGFzeW5jIChhcHAsIGV2ZW50TmFtZXNwYWNlLCBpc0F1dGhvcml6ZWQsIGV2ZW50Q29udGV4dCwgZnVuYywgLi4ucGFyYW1zKSA9PiB7XG4gIHB1c2hDYWxsU3RhY2soYXBwLCBldmVudE5hbWVzcGFjZSk7XG5cbiAgaWYgKCFpc0F1dGhvcml6ZWQoYXBwKSkge1xuICAgIGhhbmRsZU5vdEF1dGhvcml6ZWQoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzdGFydERhdGUgPSBEYXRlLm5vdygpO1xuICBjb25zdCBlbGFwc2VkID0gKCkgPT4gKERhdGUubm93KCkgLSBzdGFydERhdGUpO1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgYXBwLnB1Ymxpc2goXG4gICAgICBldmVudE5hbWVzcGFjZS5vbkJlZ2luLFxuICAgICAgZXZlbnRDb250ZXh0LFxuICAgICk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBmdW5jKC4uLnBhcmFtcyk7XG5cbiAgICBhd2FpdCBwdWJsaXNoQ29tcGxldGUoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgYXdhaXQgcHVibGlzaEVycm9yKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgYXBpV3JhcHBlclN5bmMgPSAoYXBwLCBldmVudE5hbWVzcGFjZSwgaXNBdXRob3JpemVkLCBldmVudENvbnRleHQsIGZ1bmMsIC4uLnBhcmFtcykgPT4ge1xuICBwdXNoQ2FsbFN0YWNrKGFwcCwgZXZlbnROYW1lc3BhY2UpO1xuXG4gIGlmICghaXNBdXRob3JpemVkKGFwcCkpIHtcbiAgICBoYW5kbGVOb3RBdXRob3JpemVkKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgc3RhcnREYXRlID0gRGF0ZS5ub3coKTtcbiAgY29uc3QgZWxhcHNlZCA9ICgpID0+IChEYXRlLm5vdygpIC0gc3RhcnREYXRlKTtcblxuICB0cnkge1xuICAgIGFwcC5wdWJsaXNoKFxuICAgICAgZXZlbnROYW1lc3BhY2Uub25CZWdpbixcbiAgICAgIGV2ZW50Q29udGV4dCxcbiAgICApO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gZnVuYyguLi5wYXJhbXMpO1xuXG4gICAgcHVibGlzaENvbXBsZXRlKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHB1Ymxpc2hFcnJvcihhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIGVycm9yKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxuY29uc3QgaGFuZGxlTm90QXV0aG9yaXplZCA9IChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UpID0+IHtcbiAgY29uc3QgZXJyID0gbmV3IFVuYXV0aG9yaXNlZEVycm9yKGBVbmF1dGhvcml6ZWQ6ICR7ZXZlbnROYW1lc3BhY2V9YCk7XG4gIHB1Ymxpc2hFcnJvcihhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsICgpID0+IDAsIGVycik7XG4gIHRocm93IGVycjtcbn07XG5cbmNvbnN0IHB1c2hDYWxsU3RhY2sgPSAoYXBwLCBldmVudE5hbWVzcGFjZSwgc2VlZENhbGxJZCkgPT4ge1xuICBjb25zdCBjYWxsSWQgPSBnZW5lcmF0ZSgpO1xuXG4gIGNvbnN0IGNyZWF0ZUNhbGxTdGFjayA9ICgpID0+ICh7XG4gICAgc2VlZENhbGxJZDogIWlzVW5kZWZpbmVkKHNlZWRDYWxsSWQpXG4gICAgICA/IHNlZWRDYWxsSWRcbiAgICAgIDogY2FsbElkLFxuICAgIHRocmVhZENhbGxJZDogY2FsbElkLFxuICAgIHN0YWNrOiBbXSxcbiAgfSk7XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGFwcC5jYWxscykpIHtcbiAgICBhcHAuY2FsbHMgPSBjcmVhdGVDYWxsU3RhY2soKTtcbiAgfVxuXG4gIGFwcC5jYWxscy5zdGFjay5wdXNoKHtcbiAgICBuYW1lc3BhY2U6IGV2ZW50TmFtZXNwYWNlLFxuICAgIGNhbGxJZCxcbiAgfSk7XG59O1xuXG5jb25zdCBwb3BDYWxsU3RhY2sgPSAoYXBwKSA9PiB7XG4gIGFwcC5jYWxscy5zdGFjay5wb3AoKTtcbiAgaWYgKGFwcC5jYWxscy5zdGFjay5sZW5ndGggPT09IDApIHtcbiAgICBkZWxldGUgYXBwLmNhbGxzO1xuICB9XG59O1xuXG5jb25zdCBwdWJsaXNoRXJyb3IgPSBhc3luYyAoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCBlcnIpID0+IHtcbiAgY29uc3QgY3R4ID0gY2xvbmVEZWVwKGV2ZW50Q29udGV4dCk7XG4gIGN0eC5lcnJvciA9IGVycjtcbiAgY3R4LmVsYXBzZWQgPSBlbGFwc2VkKCk7XG4gIGF3YWl0IGFwcC5wdWJsaXNoKFxuICAgIGV2ZW50TmFtZXNwYWNlLm9uRXJyb3IsXG4gICAgY3R4LFxuICApO1xuICBwb3BDYWxsU3RhY2soYXBwKTtcbn07XG5cbmNvbnN0IHB1Ymxpc2hDb21wbGV0ZSA9IGFzeW5jIChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIHJlc3VsdCkgPT4ge1xuICBjb25zdCBlbmRjb250ZXh0ID0gY2xvbmVEZWVwKGV2ZW50Q29udGV4dCk7XG4gIGVuZGNvbnRleHQucmVzdWx0ID0gcmVzdWx0O1xuICBlbmRjb250ZXh0LmVsYXBzZWQgPSBlbGFwc2VkKCk7XG4gIGF3YWl0IGFwcC5wdWJsaXNoKFxuICAgIGV2ZW50TmFtZXNwYWNlLm9uQ29tcGxldGUsXG4gICAgZW5kY29udGV4dCxcbiAgKTtcbiAgcG9wQ2FsbFN0YWNrKGFwcCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhcGlXcmFwcGVyO1xuIiwiaW1wb3J0IHsgc3BsaXQgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgJCB9IGZyb20gJy4vaW5kZXgnO1xuXG5jb25zdCBsb2NrT3ZlcmxhcE1pbGxpc2Vjb25kcyA9IDEwO1xuXG5leHBvcnQgY29uc3QgZ2V0TG9jayA9IGFzeW5jIChhcHAsIGxvY2tGaWxlLCB0aW1lb3V0TWlsbGlzZWNvbmRzLCBtYXhMb2NrUmV0cmllcywgcmV0cnlDb3VudCA9IDApID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB0aW1lb3V0ID0gKGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKSlcbiAgICAgICAgICAgICsgdGltZW91dE1pbGxpc2Vjb25kcztcblxuICAgIGNvbnN0IGxvY2sgPSB7XG4gICAgICB0aW1lb3V0LFxuICAgICAga2V5OiBsb2NrRmlsZSxcbiAgICAgIHRvdGFsVGltZW91dDogdGltZW91dE1pbGxpc2Vjb25kcyxcbiAgICB9O1xuXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVGaWxlKFxuICAgICAgbG9ja0ZpbGUsXG4gICAgICBnZXRMb2NrRmlsZUNvbnRlbnQoXG4gICAgICAgIGxvY2sudG90YWxUaW1lb3V0LFxuICAgICAgICBsb2NrLnRpbWVvdXQsXG4gICAgICApLFxuICAgICk7XG5cbiAgICByZXR1cm4gbG9jaztcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChyZXRyeUNvdW50ID09IG1heExvY2tSZXRyaWVzKSB7IHJldHVybiBOT19MT0NLOyB9XG5cbiAgICBjb25zdCBsb2NrID0gcGFyc2VMb2NrRmlsZUNvbnRlbnQoXG4gICAgICBsb2NrRmlsZSxcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEZpbGUobG9ja0ZpbGUpLFxuICAgICk7XG5cbiAgICBjb25zdCBjdXJyZW50RXBvY2hUaW1lID0gYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpO1xuXG4gICAgaWYgKGN1cnJlbnRFcG9jaFRpbWUgPCBsb2NrLnRpbWVvdXQpIHtcbiAgICAgIHJldHVybiBOT19MT0NLO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUobG9ja0ZpbGUpO1xuICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgIC8vZW1wdHlcbiAgICB9XG5cbiAgICBhd2FpdCBzbGVlcEZvclJldHJ5KCk7XG5cbiAgICByZXR1cm4gYXdhaXQgZ2V0TG9jayhcbiAgICAgIGFwcCwgbG9ja0ZpbGUsIHRpbWVvdXRNaWxsaXNlY29uZHMsXG4gICAgICBtYXhMb2NrUmV0cmllcywgcmV0cnlDb3VudCArIDEsXG4gICAgKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGdldExvY2tGaWxlQ29udGVudCA9ICh0b3RhbFRpbWVvdXQsIGVwb2NoVGltZSkgPT4gYCR7dG90YWxUaW1lb3V0fToke2Vwb2NoVGltZS50b1N0cmluZygpfWA7XG5cbmNvbnN0IHBhcnNlTG9ja0ZpbGVDb250ZW50ID0gKGtleSwgY29udGVudCkgPT4gJChjb250ZW50LCBbXG4gIHNwbGl0KCc6JyksXG4gIHBhcnRzID0+ICh7XG4gICAgdG90YWxUaW1lb3V0OiBuZXcgTnVtYmVyKHBhcnRzWzBdKSxcbiAgICB0aW1lb3V0OiBuZXcgTnVtYmVyKHBhcnRzWzFdKSxcbiAgICBrZXksXG4gIH0pLFxuXSk7XG5cbmV4cG9ydCBjb25zdCByZWxlYXNlTG9jayA9IGFzeW5jIChhcHAsIGxvY2spID0+IHtcbiAgY29uc3QgY3VycmVudEVwb2NoVGltZSA9IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKTtcbiAgLy8gb25seSByZWxlYXNlIGlmIG5vdCB0aW1lZG91dFxuICBpZiAoY3VycmVudEVwb2NoVGltZSA8IChsb2NrLnRpbWVvdXQgLSBsb2NrT3ZlcmxhcE1pbGxpc2Vjb25kcykpIHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKGxvY2sua2V5KTtcbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICAvL2VtcHR5XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZXh0ZW5kTG9jayA9IGFzeW5jIChhcHAsIGxvY2spID0+IHtcbiAgY29uc3QgY3VycmVudEVwb2NoVGltZSA9IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKTtcbiAgLy8gb25seSByZWxlYXNlIGlmIG5vdCB0aW1lZG91dFxuICBpZiAoY3VycmVudEVwb2NoVGltZSA8IChsb2NrLnRpbWVvdXQgLSBsb2NrT3ZlcmxhcE1pbGxpc2Vjb25kcykpIHtcbiAgICB0cnkge1xuICAgICAgbG9jay50aW1lb3V0ID0gY3VycmVudEVwb2NoVGltZSArIGxvY2sudGltZW91dE1pbGxpc2Vjb25kcztcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlRmlsZShcbiAgICAgICAgbG9jay5rZXksXG4gICAgICAgIGdldExvY2tGaWxlQ29udGVudChsb2NrLnRvdGFsVGltZW91dCwgbG9jay50aW1lb3V0KSxcbiAgICAgICk7XG4gICAgICByZXR1cm4gbG9jaztcbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICAvL2VtcHR5XG4gICAgfVxuICB9XG4gIHJldHVybiBOT19MT0NLO1xufTtcblxuZXhwb3J0IGNvbnN0IE5PX0xPQ0sgPSAnbm8gbG9jayc7XG5leHBvcnQgY29uc3QgaXNOb2xvY2sgPSBpZCA9PiBpZCA9PT0gTk9fTE9DSztcblxuY29uc3Qgc2xlZXBGb3JSZXRyeSA9ICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBsb2NrT3ZlcmxhcE1pbGxpc2Vjb25kcykpO1xuIiwiaW1wb3J0IHtcbiAgXG4gIGhlYWQsIFxuICB0YWlsLCBmaW5kSW5kZXgsIHN0YXJ0c1dpdGgsIFxuICBkcm9wUmlnaHQsIGZsb3csIHRha2VSaWdodCwgdHJpbSxcbiAgcmVwbGFjZVxuICBcbn0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IFxuICBzb21lLCByZWR1Y2UsIGlzRW1wdHksIGlzQXJyYXksIGpvaW4sXG4gIGlzU3RyaW5nLCBpc0ludGVnZXIsIGlzRGF0ZSwgdG9OdW1iZXIsXG4gIGlzVW5kZWZpbmVkLCBpc05hTiwgaXNOdWxsLCBjb25zdGFudCxcbiAgc3BsaXQsIGluY2x1ZGVzXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBldmVudHMsIGV2ZW50c0xpc3QgfSBmcm9tICcuL2V2ZW50cyc7XG5pbXBvcnQgeyBhcGlXcmFwcGVyIH0gZnJvbSAnLi9hcGlXcmFwcGVyJztcbmltcG9ydCB7XG4gIGdldExvY2ssIE5PX0xPQ0ssXG4gIGlzTm9sb2NrXG59IGZyb20gJy4vbG9jayc7XG5cbi8vIHRoaXMgaXMgdGhlIGNvbWJpbmF0b3IgZnVuY3Rpb25cbmV4cG9ydCBjb25zdCAkJCA9ICguLi5mdW5jcykgPT4gYXJnID0+IGZsb3coZnVuY3MpKGFyZyk7XG5cbi8vIHRoaXMgaXMgdGhlIHBpcGUgZnVuY3Rpb25cbmV4cG9ydCBjb25zdCAkID0gKGFyZywgZnVuY3MpID0+ICQkKC4uLmZ1bmNzKShhcmcpO1xuXG5leHBvcnQgY29uc3Qga2V5U2VwID0gJy8nO1xuY29uc3QgdHJpbUtleVNlcCA9IHN0ciA9PiB0cmltKHN0ciwga2V5U2VwKTtcbmNvbnN0IHNwbGl0QnlLZXlTZXAgPSBzdHIgPT4gc3BsaXQoa2V5U2VwKShzdHIpO1xuZXhwb3J0IGNvbnN0IHNhZmVLZXkgPSBrZXkgPT4gcmVwbGFjZShgJHtrZXlTZXB9JHt0cmltS2V5U2VwKGtleSl9YCwgYCR7a2V5U2VwfSR7a2V5U2VwfWAsIGtleVNlcCk7XG5leHBvcnQgY29uc3Qgam9pbktleSA9ICguLi5zdHJzKSA9PiB7XG4gIGNvbnN0IHBhcmFtc09yQXJyYXkgPSBzdHJzLmxlbmd0aCA9PT0gMSAmIGlzQXJyYXkoc3Ryc1swXSlcbiAgICA/IHN0cnNbMF0gOiBzdHJzO1xuICByZXR1cm4gc2FmZUtleShqb2luKGtleVNlcCkocGFyYW1zT3JBcnJheSkpO1xufTtcbmV4cG9ydCBjb25zdCBzcGxpdEtleSA9ICQkKHRyaW1LZXlTZXAsIHNwbGl0QnlLZXlTZXApO1xuZXhwb3J0IGNvbnN0IGdldERpckZvbUtleSA9ICQkKHNwbGl0S2V5LCBkcm9wUmlnaHQsIHAgPT4gam9pbktleSguLi5wKSk7XG5leHBvcnQgY29uc3QgZ2V0RmlsZUZyb21LZXkgPSAkJChzcGxpdEtleSwgdGFrZVJpZ2h0LCBoZWFkKTtcblxuZXhwb3J0IGNvbnN0IGNvbmZpZ0ZvbGRlciA9IGAke2tleVNlcH0uY29uZmlnYDtcbmV4cG9ydCBjb25zdCBmaWVsZERlZmluaXRpb25zID0gam9pbktleShjb25maWdGb2xkZXIsICdmaWVsZHMuanNvbicpO1xuZXhwb3J0IGNvbnN0IHRlbXBsYXRlRGVmaW5pdGlvbnMgPSBqb2luS2V5KGNvbmZpZ0ZvbGRlciwgJ3RlbXBsYXRlcy5qc29uJyk7XG5leHBvcnQgY29uc3QgYXBwRGVmaW5pdGlvbkZpbGUgPSBqb2luS2V5KGNvbmZpZ0ZvbGRlciwgJ2FwcERlZmluaXRpb24uanNvbicpO1xuZXhwb3J0IGNvbnN0IGRpckluZGV4ID0gZm9sZGVyUGF0aCA9PiBqb2luS2V5KGNvbmZpZ0ZvbGRlciwgJ2RpcicsIC4uLnNwbGl0S2V5KGZvbGRlclBhdGgpLCAnZGlyLmlkeCcpO1xuZXhwb3J0IGNvbnN0IGdldEluZGV4S2V5RnJvbUZpbGVLZXkgPSAkJChnZXREaXJGb21LZXksIGRpckluZGV4KTtcblxuZXhwb3J0IGNvbnN0IGlmRXhpc3RzID0gKHZhbCwgZXhpc3RzLCBub3RFeGlzdHMpID0+IChpc1VuZGVmaW5lZCh2YWwpXG4gID8gaXNVbmRlZmluZWQobm90RXhpc3RzKSA/ICgoKSA9PiB7IH0pKCkgOiBub3RFeGlzdHMoKVxuICA6IGV4aXN0cygpKTtcblxuZXhwb3J0IGNvbnN0IGdldE9yRGVmYXVsdCA9ICh2YWwsIGRlZmF1bHRWYWwpID0+IGlmRXhpc3RzKHZhbCwgKCkgPT4gdmFsLCAoKSA9PiBkZWZhdWx0VmFsKTtcblxuZXhwb3J0IGNvbnN0IG5vdCA9IGZ1bmMgPT4gdmFsID0+ICFmdW5jKHZhbCk7XG5leHBvcnQgY29uc3QgaXNEZWZpbmVkID0gbm90KGlzVW5kZWZpbmVkKTtcbmV4cG9ydCBjb25zdCBpc05vbk51bGwgPSBub3QoaXNOdWxsKTtcbmV4cG9ydCBjb25zdCBpc05vdE5hTiA9IG5vdChpc05hTik7XG5cbmV4cG9ydCBjb25zdCBhbGxUcnVlID0gKC4uLmZ1bmNBcmdzKSA9PiB2YWwgPT4gcmVkdWNlKFxuICAocmVzdWx0LCBjb25kaXRpb25GdW5jKSA9PiAoaXNOdWxsKHJlc3VsdCkgfHwgcmVzdWx0ID09IHRydWUpICYmIGNvbmRpdGlvbkZ1bmModmFsKSxcbiAgbnVsbCkoZnVuY0FyZ3MpO1xuXG5leHBvcnQgY29uc3QgYW55VHJ1ZSA9ICguLi5mdW5jQXJncykgPT4gdmFsID0+IHJlZHVjZShcbiAgKHJlc3VsdCwgY29uZGl0aW9uRnVuYykgPT4gcmVzdWx0ID09IHRydWUgfHwgY29uZGl0aW9uRnVuYyh2YWwpLFxuICBudWxsKShmdW5jQXJncyk7XG5cbmV4cG9ydCBjb25zdCBpbnNlbnNpdGl2ZUVxdWFscyA9IChzdHIxLCBzdHIyKSA9PiBzdHIxLnRyaW0oKS50b0xvd2VyQ2FzZSgpID09PSBzdHIyLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuXG5leHBvcnQgY29uc3QgaXNTb21ldGhpbmcgPSBhbGxUcnVlKGlzRGVmaW5lZCwgaXNOb25OdWxsLCBpc05vdE5hTik7XG5leHBvcnQgY29uc3QgaXNOb3RoaW5nID0gbm90KGlzU29tZXRoaW5nKTtcbmV4cG9ydCBjb25zdCBpc05vdGhpbmdPckVtcHR5ID0gdiA9PiBpc05vdGhpbmcodikgfHwgaXNFbXB0eSh2KTtcbmV4cG9ydCBjb25zdCBzb21ldGhpbmdPckdldERlZmF1bHQgPSBnZXREZWZhdWx0RnVuYyA9PiB2YWwgPT4gKGlzU29tZXRoaW5nKHZhbCkgPyB2YWwgOiBnZXREZWZhdWx0RnVuYygpKTtcbmV4cG9ydCBjb25zdCBzb21ldGhpbmdPckRlZmF1bHQgPSAodmFsLCBkZWZhdWx0VmFsKSA9PiBzb21ldGhpbmdPckdldERlZmF1bHQoY29uc3RhbnQoZGVmYXVsdFZhbCkpKHZhbCk7XG5cbmV4cG9ydCBjb25zdCBtYXBJZlNvbWV0aGluZ09yRGVmYXVsdCA9IChtYXBGdW5jLCBkZWZhdWx0VmFsKSA9PiB2YWwgPT4gKGlzU29tZXRoaW5nKHZhbCkgPyBtYXBGdW5jKHZhbCkgOiBkZWZhdWx0VmFsKTtcblxuZXhwb3J0IGNvbnN0IG1hcElmU29tZXRoaW5nT3JCbGFuayA9IG1hcEZ1bmMgPT4gbWFwSWZTb21ldGhpbmdPckRlZmF1bHQobWFwRnVuYywgJycpO1xuXG5leHBvcnQgY29uc3Qgbm9uZSA9IHByZWRpY2F0ZSA9PiBjb2xsZWN0aW9uID0+ICFzb21lKHByZWRpY2F0ZSkoY29sbGVjdGlvbik7XG5cbmV4cG9ydCBjb25zdCBhbGwgPSBwcmVkaWNhdGUgPT4gY29sbGVjdGlvbiA9PiBub25lKHYgPT4gIXByZWRpY2F0ZSh2KSkoY29sbGVjdGlvbik7XG5cbmV4cG9ydCBjb25zdCBpc05vdEVtcHR5ID0gb2IgPT4gIWlzRW1wdHkob2IpO1xuZXhwb3J0IGNvbnN0IGlzQXN5bmMgPSBmbiA9PiBmbi5jb25zdHJ1Y3Rvci5uYW1lID09PSAnQXN5bmNGdW5jdGlvbic7XG5leHBvcnQgY29uc3QgaXNOb25FbXB0eUFycmF5ID0gYWxsVHJ1ZShpc0FycmF5LCBpc05vdEVtcHR5KTtcbmV4cG9ydCBjb25zdCBpc05vbkVtcHR5U3RyaW5nID0gYWxsVHJ1ZShpc1N0cmluZywgaXNOb3RFbXB0eSk7XG5leHBvcnQgY29uc3QgdHJ5T3IgPSBmYWlsRnVuYyA9PiAoZnVuYywgLi4uYXJncykgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBmdW5jLmFwcGx5KG51bGwsIC4uLmFyZ3MpO1xuICB9IGNhdGNoIChfKSB7XG4gICAgcmV0dXJuIGZhaWxGdW5jKCk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCB0cnlBd2FpdE9yID0gZmFpbEZ1bmMgPT4gYXN5bmMgKGZ1bmMsIC4uLmFyZ3MpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgZnVuYy5hcHBseShudWxsLCAuLi5hcmdzKTtcbiAgfSBjYXRjaCAoXykge1xuICAgIHJldHVybiBhd2FpdCBmYWlsRnVuYygpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZGVmaW5lRXJyb3IgPSAoZnVuYywgZXJyb3JQcmVmaXgpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnVuYygpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBlcnIubWVzc2FnZSA9IGAke2Vycm9yUHJlZml4fSA6ICR7ZXJyLm1lc3NhZ2V9YDtcbiAgICB0aHJvdyBlcnI7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCB0cnlPcklnbm9yZSA9IHRyeU9yKCgpID0+IHsgfSk7XG5leHBvcnQgY29uc3QgdHJ5QXdhaXRPcklnbm9yZSA9IHRyeUF3YWl0T3IoYXN5bmMgKCkgPT4geyB9KTtcbmV4cG9ydCBjb25zdCBjYXVzZXNFeGNlcHRpb24gPSAoZnVuYykgPT4ge1xuICB0cnkge1xuICAgIGZ1bmMoKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbiA9IGZ1bmMgPT4gIWNhdXNlc0V4Y2VwdGlvbihmdW5jKTtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZUVycm9yV2l0aCA9IHJldHVyblZhbEluRXJyb3IgPT4gdHJ5T3IoY29uc3RhbnQocmV0dXJuVmFsSW5FcnJvcikpO1xuXG5leHBvcnQgY29uc3QgaGFuZGxlRXJyb3JXaXRoVW5kZWZpbmVkID0gaGFuZGxlRXJyb3JXaXRoKHVuZGVmaW5lZCk7XG5cbmV4cG9ydCBjb25zdCBzd2l0Y2hDYXNlID0gKC4uLmNhc2VzKSA9PiAodmFsdWUpID0+IHtcbiAgY29uc3QgbmV4dENhc2UgPSAoKSA9PiBoZWFkKGNhc2VzKVswXSh2YWx1ZSk7XG4gIGNvbnN0IG5leHRSZXN1bHQgPSAoKSA9PiBoZWFkKGNhc2VzKVsxXSh2YWx1ZSk7XG5cbiAgaWYgKGlzRW1wdHkoY2FzZXMpKSByZXR1cm47IC8vIHVuZGVmaW5lZFxuICBpZiAobmV4dENhc2UoKSA9PT0gdHJ1ZSkgcmV0dXJuIG5leHRSZXN1bHQoKTtcbiAgcmV0dXJuIHN3aXRjaENhc2UoLi4udGFpbChjYXNlcykpKHZhbHVlKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1ZhbHVlID0gdmFsMSA9PiB2YWwyID0+ICh2YWwxID09PSB2YWwyKTtcbmV4cG9ydCBjb25zdCBpc09uZU9mID0gKC4uLnZhbHMpID0+IHZhbCA9PiBpbmNsdWRlcyh2YWwpKHZhbHMpO1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRDYXNlID0gY29uc3RhbnQodHJ1ZSk7XG5leHBvcnQgY29uc3QgbWVtYmVyTWF0Y2hlcyA9IChtZW1iZXIsIG1hdGNoKSA9PiBvYmogPT4gbWF0Y2gob2JqW21lbWJlcl0pO1xuXG5cbmV4cG9ydCBjb25zdCBTdGFydHNXaXRoID0gc2VhcmNoRm9yID0+IHNlYXJjaEluID0+IHN0YXJ0c1dpdGgoc2VhcmNoSW4sIHNlYXJjaEZvcik7XG5cbmV4cG9ydCBjb25zdCBjb250YWlucyA9IHZhbCA9PiBhcnJheSA9PiAoZmluZEluZGV4KGFycmF5LCB2ID0+IHYgPT09IHZhbCkgPiAtMSk7XG5cbmV4cG9ydCBjb25zdCBnZXRIYXNoQ29kZSA9IChzKSA9PiB7XG4gIGxldCBoYXNoID0gMDsgbGV0IGk7IGxldCBjaGFyOyBsZXRcbiAgICBsO1xuICBpZiAocy5sZW5ndGggPT0gMCkgcmV0dXJuIGhhc2g7XG4gIGZvciAoaSA9IDAsIGwgPSBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNoYXIgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2hhcjtcbiAgICBoYXNoIHw9IDA7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICB9XG5cbiAgLy8gY29udmVydGluZyB0byBzdHJpbmcsIGJ1dCBkb250IHdhbnQgYSBcIi1cIiBwcmVmaXhlZFxuICBpZiAoaGFzaCA8IDApIHsgcmV0dXJuIGBuJHsoaGFzaCAqIC0xKS50b1N0cmluZygpfWA7IH1cbiAgcmV0dXJuIGhhc2gudG9TdHJpbmcoKTtcbn07XG5cbi8vIHRoYW5rcyB0byBodHRwczovL2Jsb2cuZ3Jvc3NtYW4uaW8vaG93LXRvLXdyaXRlLWFzeW5jLWF3YWl0LXdpdGhvdXQtdHJ5LWNhdGNoLWJsb2Nrcy1pbi1qYXZhc2NyaXB0L1xuZXhwb3J0IGNvbnN0IGF3RXggPSBhc3luYyAocHJvbWlzZSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHByb21pc2U7XG4gICAgcmV0dXJuIFt1bmRlZmluZWQsIHJlc3VsdF07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIFtlcnJvciwgdW5kZWZpbmVkXTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGlzU2FmZUludGVnZXIgPSBuID0+IGlzSW50ZWdlcihuKVxuICAgICYmIG4gPD0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgICAmJiBuID49IDAgLSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcblxuZXhwb3J0IGNvbnN0IHRvRGF0ZU9yTnVsbCA9IHMgPT4gKGlzTnVsbChzKSA/IG51bGxcbiAgOiBpc0RhdGUocykgPyBzIDogbmV3IERhdGUocykpO1xuZXhwb3J0IGNvbnN0IHRvQm9vbE9yTnVsbCA9IHMgPT4gKGlzTnVsbChzKSA/IG51bGxcbiAgOiBzID09PSAndHJ1ZScgfHwgcyA9PT0gdHJ1ZSk7XG5leHBvcnQgY29uc3QgdG9OdW1iZXJPck51bGwgPSBzID0+IChpc051bGwocykgPyBudWxsXG4gIDogdG9OdW1iZXIocykpO1xuXG5leHBvcnQgY29uc3QgaXNBcnJheU9mU3RyaW5nID0gb3B0cyA9PiBpc0FycmF5KG9wdHMpICYmIGFsbChpc1N0cmluZykob3B0cyk7XG5cbmV4cG9ydCBjb25zdCBwYXVzZSA9IGFzeW5jIGR1cmF0aW9uID0+IG5ldyBQcm9taXNlKHJlcyA9PiBzZXRUaW1lb3V0KHJlcywgZHVyYXRpb24pKTtcblxuZXhwb3J0IGNvbnN0IHJldHJ5ID0gYXN5bmMgKGZuLCByZXRyaWVzLCBkZWxheSwgLi4uYXJncykgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCBmbiguLi5hcmdzKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKHJldHJpZXMgPiAxKSB7XG4gICAgICByZXR1cm4gYXdhaXQgcGF1c2UoZGVsYXkpLnRoZW4oYXN5bmMgKCkgPT4gYXdhaXQgcmV0cnkoZm4sIChyZXRyaWVzIC0gMSksIGRlbGF5LCAuLi5hcmdzKSk7XG4gICAgfVxuICAgIHRocm93IGVycjtcbiAgfVxufTtcblxuZXhwb3J0IHsgZXZlbnRzIH0gZnJvbSAnLi9ldmVudHMnO1xuZXhwb3J0IHsgYXBpV3JhcHBlciwgYXBpV3JhcHBlclN5bmMgfSBmcm9tICcuL2FwaVdyYXBwZXInO1xuZXhwb3J0IHtcbiAgZ2V0TG9jaywgTk9fTE9DSywgcmVsZWFzZUxvY2ssXG4gIGV4dGVuZExvY2ssIGlzTm9sb2NrLFxufSBmcm9tICcuL2xvY2snO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGlmRXhpc3RzLFxuICBnZXRPckRlZmF1bHQsXG4gIGlzRGVmaW5lZCxcbiAgaXNOb25OdWxsLFxuICBpc05vdE5hTixcbiAgYWxsVHJ1ZSxcbiAgaXNTb21ldGhpbmcsXG4gIG1hcElmU29tZXRoaW5nT3JEZWZhdWx0LFxuICBtYXBJZlNvbWV0aGluZ09yQmxhbmssXG4gIGNvbmZpZ0ZvbGRlcixcbiAgZmllbGREZWZpbml0aW9ucyxcbiAgaXNOb3RoaW5nLFxuICBub3QsXG4gIHN3aXRjaENhc2UsXG4gIGRlZmF1bHRDYXNlLFxuICBTdGFydHNXaXRoLFxuICBjb250YWlucyxcbiAgdGVtcGxhdGVEZWZpbml0aW9ucyxcbiAgaGFuZGxlRXJyb3JXaXRoLFxuICBoYW5kbGVFcnJvcldpdGhVbmRlZmluZWQsXG4gIHRyeU9yLFxuICB0cnlPcklnbm9yZSxcbiAgdHJ5QXdhaXRPcixcbiAgdHJ5QXdhaXRPcklnbm9yZSxcbiAgZGlySW5kZXgsXG4gIGtleVNlcCxcbiAgJCxcbiAgJCQsXG4gIGdldERpckZvbUtleSxcbiAgZ2V0RmlsZUZyb21LZXksXG4gIHNwbGl0S2V5LFxuICBzb21ldGhpbmdPckRlZmF1bHQsXG4gIGdldEluZGV4S2V5RnJvbUZpbGVLZXksXG4gIGpvaW5LZXksXG4gIHNvbWV0aGluZ09yR2V0RGVmYXVsdCxcbiAgYXBwRGVmaW5pdGlvbkZpbGUsXG4gIGlzVmFsdWUsXG4gIGFsbCxcbiAgaXNPbmVPZixcbiAgbWVtYmVyTWF0Y2hlcyxcbiAgZGVmaW5lRXJyb3IsXG4gIGFueVRydWUsXG4gIGlzTm9uRW1wdHlBcnJheSxcbiAgY2F1c2VzRXhjZXB0aW9uLFxuICBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24sXG4gIG5vbmUsXG4gIGdldEhhc2hDb2RlLFxuICBhd0V4LFxuICBhcGlXcmFwcGVyLFxuICBldmVudHMsXG4gIGV2ZW50c0xpc3QsXG4gIGlzTm90aGluZ09yRW1wdHksXG4gIGlzU2FmZUludGVnZXIsXG4gIHRvTnVtYmVyLFxuICB0b0RhdGU6IHRvRGF0ZU9yTnVsbCxcbiAgdG9Cb29sOiB0b0Jvb2xPck51bGwsXG4gIGlzQXJyYXlPZlN0cmluZyxcbiAgZ2V0TG9jayxcbiAgTk9fTE9DSyxcbiAgaXNOb2xvY2ssXG4gIGluc2Vuc2l0aXZlRXF1YWxzLFxuICBwYXVzZSxcbiAgcmV0cnksXG59O1xuIiwiaW1wb3J0IHsgZmlsdGVyLCBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgJCwgaXNTb21ldGhpbmcgfSBmcm9tICcuL2luZGV4JztcblxuZXhwb3J0IGNvbnN0IHN0cmluZ05vdEVtcHR5ID0gcyA9PiBpc1NvbWV0aGluZyhzKSAmJiBzLnRyaW0oKS5sZW5ndGggPiAwO1xuXG5leHBvcnQgY29uc3QgbWFrZXJ1bGUgPSAoZmllbGQsIGVycm9yLCBpc1ZhbGlkKSA9PiAoeyBmaWVsZCwgZXJyb3IsIGlzVmFsaWQgfSk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0aW9uRXJyb3IgPSAocnVsZSwgaXRlbSkgPT4gKHsgLi4ucnVsZSwgaXRlbSB9KTtcblxuZXhwb3J0IGNvbnN0IGFwcGx5UnVsZVNldCA9IHJ1bGVTZXQgPT4gaXRlbVRvVmFsaWRhdGUgPT4gJChydWxlU2V0LCBbXG4gIG1hcChhcHBseVJ1bGUoaXRlbVRvVmFsaWRhdGUpKSxcbiAgZmlsdGVyKGlzU29tZXRoaW5nKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgYXBwbHlSdWxlID0gaXRlbVRvdmFsaWRhdGUgPT4gcnVsZSA9PiAocnVsZS5pc1ZhbGlkKGl0ZW1Ub3ZhbGlkYXRlKVxuICA/IG51bGxcbiAgOiB2YWxpZGF0aW9uRXJyb3IocnVsZSwgaXRlbVRvdmFsaWRhdGUpKTtcbiIsImltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCB7XG4gIGlzVW5kZWZpbmVkLCBrZXlzLCBcbiAgY2xvbmVEZWVwLCBpc0Z1bmN0aW9uLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZGVmaW5lRXJyb3IgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZmlsdGVyRXZhbCA9ICdGSUxURVJfRVZBTFVBVEUnO1xuZXhwb3J0IGNvbnN0IGZpbHRlckNvbXBpbGUgPSAnRklMVEVSX0NPTVBJTEUnO1xuZXhwb3J0IGNvbnN0IG1hcEV2YWwgPSAnTUFQX0VWQUxVQVRFJztcbmV4cG9ydCBjb25zdCBtYXBDb21waWxlID0gJ01BUF9DT01QSUxFJztcbmV4cG9ydCBjb25zdCByZW1vdmVVbmRlY2xhcmVkRmllbGRzID0gJ1JFTU9WRV9VTkRFQ0xBUkVEX0ZJRUxEUyc7XG5leHBvcnQgY29uc3QgYWRkVW5NYXBwZWRGaWVsZHMgPSAnQUREX1VOTUFQUEVEX0ZJRUxEUyc7XG5leHBvcnQgY29uc3QgYWRkVGhlS2V5ID0gJ0FERF9LRVknO1xuXG5cbmNvbnN0IGdldEV2YWx1YXRlUmVzdWx0ID0gKCkgPT4gKHtcbiAgaXNFcnJvcjogZmFsc2UsXG4gIHBhc3NlZEZpbHRlcjogdHJ1ZSxcbiAgcmVzdWx0OiBudWxsLFxufSk7XG5cbmV4cG9ydCBjb25zdCBjb21waWxlRmlsdGVyID0gaW5kZXggPT4gY29tcGlsZUV4cHJlc3Npb24oaW5kZXguZmlsdGVyKTtcblxuZXhwb3J0IGNvbnN0IGNvbXBpbGVNYXAgPSBpbmRleCA9PiBjb21waWxlQ29kZShpbmRleC5tYXApO1xuXG5leHBvcnQgY29uc3QgcGFzc2VzRmlsdGVyID0gKHJlY29yZCwgaW5kZXgpID0+IHtcbiAgY29uc3QgY29udGV4dCA9IHsgcmVjb3JkIH07XG4gIGlmICghaW5kZXguZmlsdGVyKSByZXR1cm4gdHJ1ZTtcblxuICBjb25zdCBjb21waWxlZEZpbHRlciA9IGRlZmluZUVycm9yKFxuICAgICgpID0+IGNvbXBpbGVGaWx0ZXIoaW5kZXgpLFxuICAgIGZpbHRlckNvbXBpbGUsXG4gICk7XG5cbiAgcmV0dXJuIGRlZmluZUVycm9yKFxuICAgICgpID0+IGNvbXBpbGVkRmlsdGVyKGNvbnRleHQpLFxuICAgIGZpbHRlckV2YWwsXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgbWFwUmVjb3JkID0gKHJlY29yZCwgaW5kZXgpID0+IHtcbiAgY29uc3QgcmVjb3JkQ2xvbmUgPSBjbG9uZURlZXAocmVjb3JkKTtcbiAgY29uc3QgY29udGV4dCA9IHsgcmVjb3JkOiByZWNvcmRDbG9uZSB9O1xuXG4gIGNvbnN0IG1hcCA9IGluZGV4Lm1hcCA/IGluZGV4Lm1hcCA6ICdyZXR1cm4gey4uLnJlY29yZH07JztcblxuICBjb25zdCBjb21waWxlZE1hcCA9IGRlZmluZUVycm9yKFxuICAgICgpID0+IGNvbXBpbGVDb2RlKG1hcCksXG4gICAgbWFwQ29tcGlsZSxcbiAgKTtcblxuICBjb25zdCBtYXBwZWQgPSBkZWZpbmVFcnJvcihcbiAgICAoKSA9PiBjb21waWxlZE1hcChjb250ZXh0KSxcbiAgICBtYXBFdmFsLFxuICApO1xuXG4gIGNvbnN0IG1hcHBlZEtleXMgPSBrZXlzKG1hcHBlZCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWFwcGVkS2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGtleSA9IG1hcHBlZEtleXNbaV07XG4gICAgbWFwcGVkW2tleV0gPSBpc1VuZGVmaW5lZChtYXBwZWRba2V5XSkgPyBudWxsIDogbWFwcGVkW2tleV07XG4gICAgaWYgKGlzRnVuY3Rpb24obWFwcGVkW2tleV0pKSB7XG4gICAgICBkZWxldGUgbWFwcGVkW2tleV07XG4gICAgfVxuICB9XG5cbiAgbWFwcGVkLmtleSA9IHJlY29yZC5rZXk7XG4gIG1hcHBlZC5zb3J0S2V5ID0gaW5kZXguZ2V0U29ydEtleVxuICAgID8gY29tcGlsZUNvZGUoaW5kZXguZ2V0U29ydEtleSkoY29udGV4dClcbiAgICA6IHJlY29yZC5pZDtcblxuICByZXR1cm4gbWFwcGVkO1xufTtcblxuZXhwb3J0IGNvbnN0IGV2YWx1YXRlID0gcmVjb3JkID0+IChpbmRleCkgPT4ge1xuICBjb25zdCByZXN1bHQgPSBnZXRFdmFsdWF0ZVJlc3VsdCgpO1xuXG4gIHRyeSB7XG4gICAgcmVzdWx0LnBhc3NlZEZpbHRlciA9IHBhc3Nlc0ZpbHRlcihyZWNvcmQsIGluZGV4KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmVzdWx0LmlzRXJyb3IgPSB0cnVlO1xuICAgIHJlc3VsdC5wYXNzZWRGaWx0ZXIgPSBmYWxzZTtcbiAgICByZXN1bHQucmVzdWx0ID0gZXJyLm1lc3NhZ2U7XG4gIH1cblxuICBpZiAoIXJlc3VsdC5wYXNzZWRGaWx0ZXIpIHJldHVybiByZXN1bHQ7XG5cbiAgdHJ5IHtcbiAgICByZXN1bHQucmVzdWx0ID0gbWFwUmVjb3JkKHJlY29yZCwgaW5kZXgpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXN1bHQuaXNFcnJvciA9IHRydWU7XG4gICAgcmVzdWx0LnJlc3VsdCA9IGVyci5tZXNzYWdlO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGV2YWx1YXRlO1xuIiwiaW1wb3J0IHtcbiAgbWFwLCBpc0VtcHR5LCBjb3VudEJ5LCBcbiAgZmxhdHRlbiwgaW5jbHVkZXMsIGpvaW4sIGtleXNcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7ICB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHsgY29tcGlsZUZpbHRlciwgY29tcGlsZU1hcCB9IGZyb20gJy4uL2luZGV4aW5nL2V2YWx1YXRlJztcbmltcG9ydCB7IGlzTm9uRW1wdHlTdHJpbmcsIGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbiwgJCB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBpc1JlY29yZCB9IGZyb20gJy4vaGllcmFyY2h5JztcblxuZXhwb3J0IGNvbnN0IGluZGV4VHlwZXMgPSB7IHJlZmVyZW5jZTogJ3JlZmVyZW5jZScsIGFuY2VzdG9yOiAnYW5jZXN0b3InIH07XG5cbmV4cG9ydCBjb25zdCBpbmRleFJ1bGVTZXQgPSBbXG4gIG1ha2VydWxlKCdtYXAnLCAnaW5kZXggaGFzIG5vIG1hcCBmdW5jdGlvbicsXG4gICAgaW5kZXggPT4gaXNOb25FbXB0eVN0cmluZyhpbmRleC5tYXApKSxcbiAgbWFrZXJ1bGUoJ21hcCcsIFwiaW5kZXgncyBtYXAgZnVuY3Rpb24gZG9lcyBub3QgY29tcGlsZVwiLFxuICAgIGluZGV4ID0+ICFpc05vbkVtcHR5U3RyaW5nKGluZGV4Lm1hcClcbiAgICAgICAgICAgICAgICB8fCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24oKCkgPT4gY29tcGlsZU1hcChpbmRleCkpKSxcbiAgbWFrZXJ1bGUoJ2ZpbHRlcicsIFwiaW5kZXgncyBmaWx0ZXIgZnVuY3Rpb24gZG9lcyBub3QgY29tcGlsZVwiLFxuICAgIGluZGV4ID0+ICFpc05vbkVtcHR5U3RyaW5nKGluZGV4LmZpbHRlcilcbiAgICAgICAgICAgICAgICB8fCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24oKCkgPT4gY29tcGlsZUZpbHRlcihpbmRleCkpKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnbXVzdCBkZWNsYXJlIGEgbmFtZSBmb3IgaW5kZXgnLFxuICAgIGluZGV4ID0+IGlzTm9uRW1wdHlTdHJpbmcoaW5kZXgubmFtZSkpLFxuICBtYWtlcnVsZSgnbmFtZScsICd0aGVyZSBpcyBhIGR1cGxpY2F0ZSBuYW1lZCBpbmRleCBvbiB0aGlzIG5vZGUnLFxuICAgIGluZGV4ID0+IGlzRW1wdHkoaW5kZXgubmFtZSlcbiAgICAgICAgICAgICAgICB8fCBjb3VudEJ5KCduYW1lJykoaW5kZXgucGFyZW50KCkuaW5kZXhlcylbaW5kZXgubmFtZV0gPT09IDEpLFxuICBtYWtlcnVsZSgnaW5kZXhUeXBlJywgJ3JlZmVyZW5jZSBpbmRleCBtYXkgb25seSBleGlzdCBvbiBhIHJlY29yZCBub2RlJyxcbiAgICBpbmRleCA9PiBpc1JlY29yZChpbmRleC5wYXJlbnQoKSlcbiAgICAgICAgICAgICAgICAgIHx8IGluZGV4LmluZGV4VHlwZSAhPT0gaW5kZXhUeXBlcy5yZWZlcmVuY2UpLFxuICBtYWtlcnVsZSgnaW5kZXhUeXBlJywgYGluZGV4IHR5cGUgbXVzdCBiZSBvbmUgb2Y6ICR7am9pbignLCAnKShrZXlzKGluZGV4VHlwZXMpKX1gLFxuICAgIGluZGV4ID0+IGluY2x1ZGVzKGluZGV4LmluZGV4VHlwZSkoa2V5cyhpbmRleFR5cGVzKSkpLFxuXTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlSW5kZXggPSAoaW5kZXgsIGFsbFJlZmVyZW5jZUluZGV4ZXNPbk5vZGUpID0+IGFwcGx5UnVsZVNldChpbmRleFJ1bGVTZXQoYWxsUmVmZXJlbmNlSW5kZXhlc09uTm9kZSkpKGluZGV4KTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWxsSW5kZXhlcyA9IG5vZGUgPT4gJChub2RlLmluZGV4ZXMsIFtcbiAgbWFwKGkgPT4gdmFsaWRhdGVJbmRleChpLCBub2RlLmluZGV4ZXMpKSxcbiAgZmxhdHRlbixcbl0pO1xuIiwiaW1wb3J0IHtcbiAgZmluZCwgY29uc3RhbnQsIG1hcCwgbGFzdCxcbiAgZmlyc3QsIHNwbGl0LCBpbnRlcnNlY3Rpb24sIHRha2UsXG4gIHVuaW9uLCBpbmNsdWRlcywgZmlsdGVyLCBzb21lLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgJCwgc3dpdGNoQ2FzZSwgaXNOb3RoaW5nLCBpc1NvbWV0aGluZyxcbiAgZGVmYXVsdENhc2UsIHNwbGl0S2V5LCBpc05vbkVtcHR5U3RyaW5nLFxuICBqb2luS2V5LCBnZXRIYXNoQ29kZSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGluZGV4VHlwZXMgfSBmcm9tICcuL2luZGV4ZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0RmxhdHRlbmVkSGllcmFyY2h5ID0gKGFwcEhpZXJhcmNoeSwgdXNlQ2FjaGVkID0gdHJ1ZSkgPT4ge1xuICBpZiAoaXNTb21ldGhpbmcoYXBwSGllcmFyY2h5LmdldEZsYXR0ZW5lZEhpZXJhcmNoeSkgJiYgdXNlQ2FjaGVkKSB7IHJldHVybiBhcHBIaWVyYXJjaHkuZ2V0RmxhdHRlbmVkSGllcmFyY2h5KCk7IH1cblxuICBjb25zdCBmbGF0dGVuSGllcmFyY2h5ID0gKGN1cnJlbnROb2RlLCBmbGF0dGVuZWQpID0+IHtcbiAgICBmbGF0dGVuZWQucHVzaChjdXJyZW50Tm9kZSk7XG4gICAgaWYgKCghY3VycmVudE5vZGUuY2hpbGRyZW5cbiAgICAgICAgICAgIHx8IGN1cnJlbnROb2RlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICYmICghY3VycmVudE5vZGUuaW5kZXhlc1xuICAgICAgICAgICAgfHwgY3VycmVudE5vZGUuaW5kZXhlcy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAmJiAoIWN1cnJlbnROb2RlLmFnZ3JlZ2F0ZUdyb3Vwc1xuICAgICAgICAgICAgfHwgY3VycmVudE5vZGUuYWdncmVnYXRlR3JvdXBzLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgIHJldHVybiBmbGF0dGVuZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgdW5pb25JZkFueSA9IGwyID0+IGwxID0+IHVuaW9uKGwxKSghbDIgPyBbXSA6IGwyKTtcblxuICAgIGNvbnN0IGNoaWxkcmVuID0gJChbXSwgW1xuICAgICAgdW5pb25JZkFueShjdXJyZW50Tm9kZS5jaGlsZHJlbiksXG4gICAgICB1bmlvbklmQW55KGN1cnJlbnROb2RlLmluZGV4ZXMpLFxuICAgICAgdW5pb25JZkFueShjdXJyZW50Tm9kZS5hZ2dyZWdhdGVHcm91cHMpLFxuICAgIF0pO1xuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgZmxhdHRlbkhpZXJhcmNoeShjaGlsZCwgZmxhdHRlbmVkKTtcbiAgICB9XG4gICAgcmV0dXJuIGZsYXR0ZW5lZDtcbiAgfTtcblxuICBhcHBIaWVyYXJjaHkuZ2V0RmxhdHRlbmVkSGllcmFyY2h5ID0gKCkgPT4gZmxhdHRlbkhpZXJhcmNoeShhcHBIaWVyYXJjaHksIFtdKTtcbiAgcmV0dXJuIGFwcEhpZXJhcmNoeS5nZXRGbGF0dGVuZWRIaWVyYXJjaHkoKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRMYXN0UGFydEluS2V5ID0ga2V5ID0+IGxhc3Qoc3BsaXRLZXkoa2V5KSk7XG5cbmV4cG9ydCBjb25zdCBnZXROb2Rlc0luUGF0aCA9IGFwcEhpZXJhcmNoeSA9PiBrZXkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaWx0ZXIobiA9PiBuZXcgUmVnRXhwKGAke24ucGF0aFJlZ3goKX1gKS50ZXN0KGtleSkpLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBnZXRFeGFjdE5vZGVGb3JQYXRoID0gYXBwSGllcmFyY2h5ID0+IGtleSA9PiAkKGFwcEhpZXJhcmNoeSwgW1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGZpbmQobiA9PiBuZXcgUmVnRXhwKGAke24ucGF0aFJlZ3goKX0kYCkudGVzdChrZXkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoID0gYXBwSGllcmFyY2h5ID0+IGNvbGxlY3Rpb25LZXkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gKGlzQ29sbGVjdGlvblJlY29yZChuKVxuICAgICAgICAgICAgICAgICAgICYmIG5ldyBSZWdFeHAoYCR7bi5jb2xsZWN0aW9uUGF0aFJlZ3goKX0kYCkudGVzdChjb2xsZWN0aW9uS2V5KSkpLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBoYXNNYXRjaGluZ0FuY2VzdG9yID0gYW5jZXN0b3JQcmVkaWNhdGUgPT4gZGVjZW5kYW50Tm9kZSA9PiBzd2l0Y2hDYXNlKFxuXG4gIFtub2RlID0+IGlzTm90aGluZyhub2RlLnBhcmVudCgpKSxcbiAgICBjb25zdGFudChmYWxzZSldLFxuXG4gIFtub2RlID0+IGFuY2VzdG9yUHJlZGljYXRlKG5vZGUucGFyZW50KCkpLFxuICAgIGNvbnN0YW50KHRydWUpXSxcblxuICBbZGVmYXVsdENhc2UsXG4gICAgbm9kZSA9PiBoYXNNYXRjaGluZ0FuY2VzdG9yKGFuY2VzdG9yUHJlZGljYXRlKShub2RlLnBhcmVudCgpKV0sXG5cbikoZGVjZW5kYW50Tm9kZSk7XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlID0gKGFwcEhpZXJhcmNoeSwgbm9kZUtleSkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gbi5ub2RlS2V5KCkgPT09IG5vZGVLZXlcbiAgICAgICAgICAgICAgICAgIHx8IChpc0NvbGxlY3Rpb25SZWNvcmQobilcbiAgICAgICAgICAgICAgICAgICAgICAmJiBuLmNvbGxlY3Rpb25Ob2RlS2V5KCkgPT09IG5vZGVLZXkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0Q29sbGVjdGlvbk5vZGUgPSAoYXBwSGllcmFyY2h5LCBub2RlS2V5KSA9PiAkKGFwcEhpZXJhcmNoeSwgW1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGZpbmQobiA9PiAoaXNDb2xsZWN0aW9uUmVjb3JkKG4pXG4gICAgICAgICAgICAgICAgICAgICYmIG4uY29sbGVjdGlvbk5vZGVLZXkoKSA9PT0gbm9kZUtleSkpLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlQnlLZXlPck5vZGVLZXkgPSAoYXBwSGllcmFyY2h5LCBrZXlPck5vZGVLZXkpID0+IHtcbiAgY29uc3Qgbm9kZUJ5S2V5ID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHBIaWVyYXJjaHkpKGtleU9yTm9kZUtleSk7XG4gIHJldHVybiBpc05vdGhpbmcobm9kZUJ5S2V5KVxuICAgID8gZ2V0Tm9kZShhcHBIaWVyYXJjaHksIGtleU9yTm9kZUtleSlcbiAgICA6IG5vZGVCeUtleTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5ID0gKGFwcEhpZXJhcmNoeSwga2V5T3JOb2RlS2V5KSA9PiB7XG4gIGNvbnN0IG5vZGVCeUtleSA9IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHBIaWVyYXJjaHkpKGtleU9yTm9kZUtleSk7XG4gIHJldHVybiBpc05vdGhpbmcobm9kZUJ5S2V5KVxuICAgID8gZ2V0Q29sbGVjdGlvbk5vZGUoYXBwSGllcmFyY2h5LCBrZXlPck5vZGVLZXkpXG4gICAgOiBub2RlQnlLZXk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNOb2RlID0gKGFwcEhpZXJhcmNoeSwga2V5KSA9PiBpc1NvbWV0aGluZyhnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcEhpZXJhcmNoeSkoa2V5KSk7XG5cbmV4cG9ydCBjb25zdCBnZXRBY3R1YWxLZXlPZlBhcmVudCA9IChwYXJlbnROb2RlS2V5LCBhY3R1YWxDaGlsZEtleSkgPT4gJChhY3R1YWxDaGlsZEtleSwgW1xuICBzcGxpdEtleSxcbiAgdGFrZShzcGxpdEtleShwYXJlbnROb2RlS2V5KS5sZW5ndGgpLFxuICBrcyA9PiBqb2luS2V5KC4uLmtzKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0UGFyZW50S2V5ID0gKGtleSkgPT4ge1xuICByZXR1cm4gJChrZXksIFtcbiAgICBzcGxpdEtleSxcbiAgICB0YWtlKHNwbGl0S2V5KGtleSkubGVuZ3RoIC0gMSksXG4gICAgam9pbktleSxcbiAgXSk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNLZXlBbmNlc3Rvck9mID0gYW5jZXN0b3JLZXkgPT4gZGVjZW5kYW50Tm9kZSA9PiBoYXNNYXRjaGluZ0FuY2VzdG9yKHAgPT4gcC5ub2RlS2V5KCkgPT09IGFuY2VzdG9yS2V5KShkZWNlbmRhbnROb2RlKTtcblxuZXhwb3J0IGNvbnN0IGhhc05vTWF0Y2hpbmdBbmNlc3RvcnMgPSBwYXJlbnRQcmVkaWNhdGUgPT4gbm9kZSA9PiAhaGFzTWF0Y2hpbmdBbmNlc3RvcihwYXJlbnRQcmVkaWNhdGUpKG5vZGUpO1xuXG5leHBvcnQgY29uc3QgZmluZEZpZWxkID0gKHJlY29yZE5vZGUsIGZpZWxkTmFtZSkgPT4gZmluZChmID0+IGYubmFtZSA9PSBmaWVsZE5hbWUpKHJlY29yZE5vZGUuZmllbGRzKTtcblxuZXhwb3J0IGNvbnN0IGlzQW5jZXN0b3IgPSBkZWNlbmRhbnQgPT4gYW5jZXN0b3IgPT4gaXNLZXlBbmNlc3Rvck9mKGFuY2VzdG9yLm5vZGVLZXkoKSkoZGVjZW5kYW50KTtcblxuZXhwb3J0IGNvbnN0IGlzRGVjZW5kYW50ID0gYW5jZXN0b3IgPT4gZGVjZW5kYW50ID0+IGlzQW5jZXN0b3IoZGVjZW5kYW50KShhbmNlc3Rvcik7XG5cbmV4cG9ydCBjb25zdCBnZXRSZWNvcmROb2RlSWQgPSByZWNvcmRLZXkgPT4gJChyZWNvcmRLZXksIFtcbiAgc3BsaXRLZXksXG4gIGxhc3QsXG4gIGdldFJlY29yZE5vZGVJZEZyb21JZCxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkTm9kZUlkRnJvbUlkID0gcmVjb3JkSWQgPT4gJChyZWNvcmRJZCwgW3NwbGl0KCctJyksIGZpcnN0LCBwYXJzZUludF0pO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkTm9kZUJ5SWQgPSAoaGllcmFyY2h5LCByZWNvcmRJZCkgPT4gJChoaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gaXNSZWNvcmQobilcbiAgICAgICAgICAgICAgICAgICAgJiYgbi5ub2RlSWQgPT09IGdldFJlY29yZE5vZGVJZEZyb21JZChyZWNvcmRJZCkpLFxuXSk7XG5cbmV4cG9ydCBjb25zdCByZWNvcmROb2RlSWRJc0FsbG93ZWQgPSBpbmRleE5vZGUgPT4gbm9kZUlkID0+IGluZGV4Tm9kZS5hbGxvd2VkUmVjb3JkTm9kZUlkcy5sZW5ndGggPT09IDBcbiAgICB8fCBpbmNsdWRlcyhub2RlSWQpKGluZGV4Tm9kZS5hbGxvd2VkUmVjb3JkTm9kZUlkcyk7XG5cbmV4cG9ydCBjb25zdCByZWNvcmROb2RlSXNBbGxvd2VkID0gaW5kZXhOb2RlID0+IHJlY29yZE5vZGUgPT4gcmVjb3JkTm9kZUlkSXNBbGxvd2VkKGluZGV4Tm9kZSkocmVjb3JkTm9kZS5ub2RlSWQpO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXggPSAoYXBwSGllcmFyY2h5LCBpbmRleE5vZGUpID0+IHtcbiAgY29uc3QgcmVjb3JkTm9kZXMgPSAkKGFwcEhpZXJhcmNoeSwgW1xuICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgICBmaWx0ZXIoaXNSZWNvcmQpLFxuICBdKTtcblxuICBpZiAoaXNHbG9iYWxJbmRleChpbmRleE5vZGUpKSB7XG4gICAgcmV0dXJuICQocmVjb3JkTm9kZXMsIFtcbiAgICAgIGZpbHRlcihyZWNvcmROb2RlSXNBbGxvd2VkKGluZGV4Tm9kZSkpLFxuICAgIF0pO1xuICB9XG5cbiAgaWYgKGlzQW5jZXN0b3JJbmRleChpbmRleE5vZGUpKSB7XG4gICAgcmV0dXJuICQocmVjb3JkTm9kZXMsIFtcbiAgICAgIGZpbHRlcihpc0RlY2VuZGFudChpbmRleE5vZGUucGFyZW50KCkpKSxcbiAgICAgIGZpbHRlcihyZWNvcmROb2RlSXNBbGxvd2VkKGluZGV4Tm9kZSkpLFxuICAgIF0pO1xuICB9XG5cbiAgaWYgKGlzUmVmZXJlbmNlSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIHJldHVybiAkKHJlY29yZE5vZGVzLCBbXG4gICAgICBmaWx0ZXIobiA9PiBzb21lKGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4KGluZGV4Tm9kZSkpKG4uZmllbGRzKSksXG4gICAgXSk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlRnJvbU5vZGVLZXlIYXNoID0gaGllcmFyY2h5ID0+IGhhc2ggPT4gJChoaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gZ2V0SGFzaENvZGUobi5ub2RlS2V5KCkpID09PSBoYXNoKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgaXNSZWNvcmQgPSBub2RlID0+IGlzU29tZXRoaW5nKG5vZGUpICYmIG5vZGUudHlwZSA9PT0gJ3JlY29yZCc7XG5leHBvcnQgY29uc3QgaXNTaW5nbGVSZWNvcmQgPSBub2RlID0+IGlzUmVjb3JkKG5vZGUpICYmIG5vZGUuaXNTaW5nbGU7XG5leHBvcnQgY29uc3QgaXNDb2xsZWN0aW9uUmVjb3JkID0gbm9kZSA9PiBpc1JlY29yZChub2RlKSAmJiAhbm9kZS5pc1NpbmdsZTtcbmV4cG9ydCBjb25zdCBpc0luZGV4ID0gbm9kZSA9PiBpc1NvbWV0aGluZyhub2RlKSAmJiBub2RlLnR5cGUgPT09ICdpbmRleCc7XG5leHBvcnQgY29uc3QgaXNhZ2dyZWdhdGVHcm91cCA9IG5vZGUgPT4gaXNTb21ldGhpbmcobm9kZSkgJiYgbm9kZS50eXBlID09PSAnYWdncmVnYXRlR3JvdXAnO1xuZXhwb3J0IGNvbnN0IGlzU2hhcmRlZEluZGV4ID0gbm9kZSA9PiBpc0luZGV4KG5vZGUpICYmIGlzTm9uRW1wdHlTdHJpbmcobm9kZS5nZXRTaGFyZE5hbWUpO1xuZXhwb3J0IGNvbnN0IGlzUm9vdCA9IG5vZGUgPT4gaXNTb21ldGhpbmcobm9kZSkgJiYgbm9kZS5pc1Jvb3QoKTtcbmV4cG9ydCBjb25zdCBpc0RlY2VuZGFudE9mQVJlY29yZCA9IGhhc01hdGNoaW5nQW5jZXN0b3IoaXNSZWNvcmQpO1xuZXhwb3J0IGNvbnN0IGlzR2xvYmFsSW5kZXggPSBub2RlID0+IGlzSW5kZXgobm9kZSkgJiYgaXNSb290KG5vZGUucGFyZW50KCkpO1xuZXhwb3J0IGNvbnN0IGlzUmVmZXJlbmNlSW5kZXggPSBub2RlID0+IGlzSW5kZXgobm9kZSkgJiYgbm9kZS5pbmRleFR5cGUgPT09IGluZGV4VHlwZXMucmVmZXJlbmNlO1xuZXhwb3J0IGNvbnN0IGlzQW5jZXN0b3JJbmRleCA9IG5vZGUgPT4gaXNJbmRleChub2RlKSAmJiBub2RlLmluZGV4VHlwZSA9PT0gaW5kZXhUeXBlcy5hbmNlc3RvcjtcblxuZXhwb3J0IGNvbnN0IGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUgPSBub2RlID0+IGZpZWxkID0+IGZpZWxkLnR5cGUgPT09ICdyZWZlcmVuY2UnXG4gICAgJiYgaW50ZXJzZWN0aW9uKGZpZWxkLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzKShtYXAoaSA9PiBpLm5vZGVLZXkoKSkobm9kZS5pbmRleGVzKSlcbiAgICAgIC5sZW5ndGggPiAwO1xuXG5leHBvcnQgY29uc3QgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXggPSBpbmRleE5vZGUgPT4gZmllbGQgPT4gZmllbGQudHlwZSA9PT0gJ3JlZmVyZW5jZSdcbiAgICAmJiBpbnRlcnNlY3Rpb24oZmllbGQudHlwZU9wdGlvbnMucmV2ZXJzZUluZGV4Tm9kZUtleXMpKFtpbmRleE5vZGUubm9kZUtleSgpXSlcbiAgICAgIC5sZW5ndGggPiAwO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdldExhc3RQYXJ0SW5LZXksXG4gIGdldE5vZGVzSW5QYXRoLFxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxuICBoYXNNYXRjaGluZ0FuY2VzdG9yLFxuICBnZXROb2RlLFxuICBnZXROb2RlQnlLZXlPck5vZGVLZXksXG4gIGlzTm9kZSxcbiAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQsXG4gIGdldFBhcmVudEtleSxcbiAgaXNLZXlBbmNlc3Rvck9mLFxuICBoYXNOb01hdGNoaW5nQW5jZXN0b3JzLFxuICBmaW5kRmllbGQsXG4gIGlzQW5jZXN0b3IsXG4gIGlzRGVjZW5kYW50LFxuICBnZXRSZWNvcmROb2RlSWQsXG4gIGdldFJlY29yZE5vZGVJZEZyb21JZCxcbiAgZ2V0UmVjb3JkTm9kZUJ5SWQsXG4gIHJlY29yZE5vZGVJZElzQWxsb3dlZCxcbiAgcmVjb3JkTm9kZUlzQWxsb3dlZCxcbiAgZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgsXG4gIGdldE5vZGVGcm9tTm9kZUtleUhhc2gsXG4gIGlzUmVjb3JkLFxuICBpc0NvbGxlY3Rpb25SZWNvcmQsXG4gIGlzSW5kZXgsXG4gIGlzYWdncmVnYXRlR3JvdXAsXG4gIGlzU2hhcmRlZEluZGV4LFxuICBpc1Jvb3QsXG4gIGlzRGVjZW5kYW50T2ZBUmVjb3JkLFxuICBpc0dsb2JhbEluZGV4LFxuICBpc1JlZmVyZW5jZUluZGV4LFxuICBpc0FuY2VzdG9ySW5kZXgsXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUsXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4LFxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG59O1xuIiwiaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgY29uc3RhbnQsIGlzVW5kZWZpbmVkLCBoYXMsXG4gIG1hcFZhbHVlcywgY2xvbmVEZWVwLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgaXNOb3RFbXB0eSB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBnZXRTYWZlRmllbGRQYXJzZXIgPSAodHJ5UGFyc2UsIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucykgPT4gKGZpZWxkLCByZWNvcmQpID0+IHtcbiAgaWYgKGhhcyhmaWVsZC5uYW1lKShyZWNvcmQpKSB7XG4gICAgcmV0dXJuIGdldFNhZmVWYWx1ZVBhcnNlcih0cnlQYXJzZSwgZGVmYXVsdFZhbHVlRnVuY3Rpb25zKShyZWNvcmRbZmllbGQubmFtZV0pO1xuICB9XG4gIHJldHVybiBkZWZhdWx0VmFsdWVGdW5jdGlvbnNbZmllbGQuZ2V0VW5kZWZpbmVkVmFsdWVdKCk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U2FmZVZhbHVlUGFyc2VyID0gKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpID0+ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBwYXJzZWQgPSB0cnlQYXJzZSh2YWx1ZSk7XG4gIGlmIChwYXJzZWQuc3VjY2Vzcykge1xuICAgIHJldHVybiBwYXJzZWQudmFsdWU7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucy5kZWZhdWx0KCk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3VmFsdWUgPSAodHJ5UGFyc2UsIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucykgPT4gKGZpZWxkKSA9PiB7XG4gIGNvbnN0IGdldEluaXRpYWxWYWx1ZSA9IGlzVW5kZWZpbmVkKGZpZWxkKSB8fCBpc1VuZGVmaW5lZChmaWVsZC5nZXRJbml0aWFsVmFsdWUpXG4gICAgPyAnZGVmYXVsdCdcbiAgICA6IGZpZWxkLmdldEluaXRpYWxWYWx1ZTtcblxuICByZXR1cm4gaGFzKGdldEluaXRpYWxWYWx1ZSkoZGVmYXVsdFZhbHVlRnVuY3Rpb25zKVxuICAgID8gZGVmYXVsdFZhbHVlRnVuY3Rpb25zW2dldEluaXRpYWxWYWx1ZV0oKVxuICAgIDogZ2V0U2FmZVZhbHVlUGFyc2VyKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpKGdldEluaXRpYWxWYWx1ZSk7XG59O1xuXG5leHBvcnQgY29uc3QgdHlwZUZ1bmN0aW9ucyA9IHNwZWNpZmljRnVuY3Rpb25zID0+IG1lcmdlKHtcbiAgdmFsdWU6IGNvbnN0YW50LFxuICBudWxsOiBjb25zdGFudChudWxsKSxcbn0sIHNwZWNpZmljRnVuY3Rpb25zKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzID0gdmFsaWRhdGlvblJ1bGVzID0+IGFzeW5jIChmaWVsZCwgcmVjb3JkLCBjb250ZXh0KSA9PiB7XG4gIGNvbnN0IGZpZWxkVmFsdWUgPSByZWNvcmRbZmllbGQubmFtZV07XG4gIGNvbnN0IHZhbGlkYXRlUnVsZSA9IGFzeW5jIHIgPT4gKCFhd2FpdCByLmlzVmFsaWQoZmllbGRWYWx1ZSwgZmllbGQudHlwZU9wdGlvbnMsIGNvbnRleHQpXG4gICAgPyByLmdldE1lc3NhZ2UoZmllbGRWYWx1ZSwgZmllbGQudHlwZU9wdGlvbnMpXG4gICAgOiAnJyk7XG5cbiAgY29uc3QgZXJyb3JzID0gW107XG4gIGZvciAoY29uc3QgciBvZiB2YWxpZGF0aW9uUnVsZXMpIHtcbiAgICBjb25zdCBlcnIgPSBhd2FpdCB2YWxpZGF0ZVJ1bGUocik7XG4gICAgaWYgKGlzTm90RW1wdHkoZXJyKSkgZXJyb3JzLnB1c2goZXJyKTtcbiAgfVxuXG4gIHJldHVybiBlcnJvcnM7XG59O1xuXG5jb25zdCBnZXREZWZhdWx0T3B0aW9ucyA9IG1hcFZhbHVlcyh2ID0+IHYuZGVmYXVsdFZhbHVlKTtcblxuZXhwb3J0IGNvbnN0IG1ha2VydWxlID0gKGlzVmFsaWQsIGdldE1lc3NhZ2UpID0+ICh7IGlzVmFsaWQsIGdldE1lc3NhZ2UgfSk7XG5leHBvcnQgY29uc3QgcGFyc2VkRmFpbGVkID0gdmFsID0+ICh7IHN1Y2Nlc3M6IGZhbHNlLCB2YWx1ZTogdmFsIH0pO1xuZXhwb3J0IGNvbnN0IHBhcnNlZFN1Y2Nlc3MgPSB2YWwgPT4gKHsgc3VjY2VzczogdHJ1ZSwgdmFsdWU6IHZhbCB9KTtcbmV4cG9ydCBjb25zdCBnZXREZWZhdWx0RXhwb3J0ID0gKG5hbWUsIHRyeVBhcnNlLCBmdW5jdGlvbnMsIG9wdGlvbnMsIHZhbGlkYXRpb25SdWxlcywgc2FtcGxlVmFsdWUsIHN0cmluZ2lmeSkgPT4gKHtcbiAgZ2V0TmV3OiBnZXROZXdWYWx1ZSh0cnlQYXJzZSwgZnVuY3Rpb25zKSxcbiAgc2FmZVBhcnNlRmllbGQ6IGdldFNhZmVGaWVsZFBhcnNlcih0cnlQYXJzZSwgZnVuY3Rpb25zKSxcbiAgc2FmZVBhcnNlVmFsdWU6IGdldFNhZmVWYWx1ZVBhcnNlcih0cnlQYXJzZSwgZnVuY3Rpb25zKSxcbiAgdHJ5UGFyc2UsXG4gIG5hbWUsXG4gIGdldERlZmF1bHRPcHRpb25zOiAoKSA9PiBnZXREZWZhdWx0T3B0aW9ucyhjbG9uZURlZXAob3B0aW9ucykpLFxuICBvcHRpb25EZWZpbml0aW9uczogb3B0aW9ucyxcbiAgdmFsaWRhdGVUeXBlQ29uc3RyYWludHM6IHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzKHZhbGlkYXRpb25SdWxlcyksXG4gIHNhbXBsZVZhbHVlLFxuICBzdHJpbmdpZnk6IHZhbCA9PiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkXG4gICAgPyAnJyA6IHN0cmluZ2lmeSh2YWwpKSxcbiAgZ2V0RGVmYXVsdFZhbHVlOiBmdW5jdGlvbnMuZGVmYXVsdCxcbn0pO1xuIiwiaW1wb3J0IHtcbiAgY29uc3RhbnQsIGlzU3RyaW5nLFxuICBpc051bGwsIGluY2x1ZGVzLCBpc0Jvb2xlYW4sXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICB0eXBlRnVuY3Rpb25zLFxuICBtYWtlcnVsZSwgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9Cb29sT3JOdWxsLCB0b051bWJlck9yTnVsbCxcbiAgaXNTYWZlSW50ZWdlciwgaXNBcnJheU9mU3RyaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBzdHJpbmdGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogY29uc3RhbnQobnVsbCksXG59KTtcblxuY29uc3Qgc3RyaW5nVHJ5UGFyc2UgPSBzd2l0Y2hDYXNlKFxuICBbaXNTdHJpbmcsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNOdWxsLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2RlZmF1bHRDYXNlLCB2ID0+IHBhcnNlZFN1Y2Nlc3Modi50b1N0cmluZygpKV0sXG4pO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBtYXhMZW5ndGg6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgaXNWYWxpZDogbiA9PiBuID09PSBudWxsIHx8IGlzU2FmZUludGVnZXIobikgJiYgbiA+IDAsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ21heCBsZW5ndGggbXVzdCBiZSBudWxsIChubyBsaW1pdCkgb3IgYSBncmVhdGVyIHRoYW4gemVybyBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG4gIHZhbHVlczoge1xuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICBpc1ZhbGlkOiB2ID0+IHYgPT09IG51bGwgfHwgKGlzQXJyYXlPZlN0cmluZyh2KSAmJiB2Lmxlbmd0aCA+IDAgJiYgdi5sZW5ndGggPCAxMDAwMCksXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogXCIndmFsdWVzJyBtdXN0IGJlIG51bGwgKG5vIHZhbHVlcykgb3IgYW4gYXJyeSBvZiBhdCBsZWFzdCBvbmUgc3RyaW5nXCIsXG4gICAgcGFyc2U6IHMgPT4gcyxcbiAgfSxcbiAgYWxsb3dEZWNsYXJlZFZhbHVlc09ubHk6IHtcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIGlzVmFsaWQ6IGlzQm9vbGVhbixcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnYWxsb3dEZWNsYXJlZFZhbHVlc09ubHkgbXVzdCBiZSB0cnVlIG9yIGZhbHNlJyxcbiAgICBwYXJzZTogdG9Cb29sT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5tYXhMZW5ndGggPT09IG51bGwgfHwgdmFsLmxlbmd0aCA8PSBvcHRzLm1heExlbmd0aCxcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgZXhjZWVkcyBtYXhpbXVtIGxlbmd0aCBvZiAke29wdHMubWF4TGVuZ3RofWApLFxuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IG9wdHMuYWxsb3dEZWNsYXJlZFZhbHVlc09ubHkgPT09IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBpbmNsdWRlcyh2YWwpKG9wdHMudmFsdWVzKSxcbiAgKHZhbCkgPT4gYFwiJHt2YWx9XCIgZG9lcyBub3QgZXhpc3QgaW4gdGhlIGxpc3Qgb2YgYWxsb3dlZCB2YWx1ZXNgKSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXG4gICdzdHJpbmcnLFxuICBzdHJpbmdUcnlQYXJzZSxcbiAgc3RyaW5nRnVuY3Rpb25zLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gICdhYmNkZScsXG4gIHN0ciA9PiBzdHIsXG4pO1xuIiwiaW1wb3J0IHsgY29uc3RhbnQsIGlzQm9vbGVhbiwgaXNOdWxsIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIHR5cGVGdW5jdGlvbnMsXG4gIG1ha2VydWxlLCBwYXJzZWRGYWlsZWQsIHBhcnNlZFN1Y2Nlc3MsXG4gIGdldERlZmF1bHRFeHBvcnQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIGlzT25lT2YsIHRvQm9vbE9yTnVsbCxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgYm9vbEZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBjb25zdGFudChudWxsKSxcbn0pO1xuXG5jb25zdCBib29sVHJ5UGFyc2UgPSBzd2l0Y2hDYXNlKFxuICBbaXNCb29sZWFuLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXG4gIFtpc09uZU9mKCd0cnVlJywgJzEnLCAneWVzJywgJ29uJyksICgpID0+IHBhcnNlZFN1Y2Nlc3ModHJ1ZSldLFxuICBbaXNPbmVPZignZmFsc2UnLCAnMCcsICdubycsICdvZmYnKSwgKCkgPT4gcGFyc2VkU3VjY2VzcyhmYWxzZSldLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBhbGxvd051bGxzOiB7XG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIGlzVmFsaWQ6IGlzQm9vbGVhbixcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHRydWUgb3IgZmFsc2UnLFxuICAgIHBhcnNlOiB0b0Jvb2xPck51bGwsXG4gIH0sXG59O1xuXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IG9wdHMuYWxsb3dOdWxscyA9PT0gdHJ1ZSB8fCB2YWwgIT09IG51bGwsXG4gICAgKCkgPT4gJ2ZpZWxkIGNhbm5vdCBiZSBudWxsJyksXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxuICAnYm9vbCcsIGJvb2xUcnlQYXJzZSwgYm9vbEZ1bmN0aW9ucyxcbiAgb3B0aW9ucywgdHlwZUNvbnN0cmFpbnRzLCB0cnVlLCBKU09OLnN0cmluZ2lmeSxcbik7XG4iLCJpbXBvcnQge1xuICBjb25zdGFudCwgaXNOdW1iZXIsIGlzU3RyaW5nLCBpc051bGwsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBtYWtlcnVsZSwgdHlwZUZ1bmN0aW9ucyxcbiAgcGFyc2VkRmFpbGVkLCBwYXJzZWRTdWNjZXNzLCBnZXREZWZhdWx0RXhwb3J0LFxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLCB0b051bWJlck9yTnVsbCxcbiAgaXNTYWZlSW50ZWdlcixcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgbnVtYmVyRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XG4gIGRlZmF1bHQ6IGNvbnN0YW50KG51bGwpLFxufSk7XG5cbmNvbnN0IHBhcnNlU3RyaW5ndG9OdW1iZXJPck51bGwgPSAocykgPT4ge1xuICBjb25zdCBudW0gPSBOdW1iZXIocyk7XG4gIHJldHVybiBpc05hTihudW0pID8gcGFyc2VkRmFpbGVkKHMpIDogcGFyc2VkU3VjY2VzcyhudW0pO1xufTtcblxuY29uc3QgbnVtYmVyVHJ5UGFyc2UgPSBzd2l0Y2hDYXNlKFxuICBbaXNOdW1iZXIsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNTdHJpbmcsIHBhcnNlU3RyaW5ndG9OdW1iZXJPck51bGxdLFxuICBbaXNOdWxsLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2RlZmF1bHRDYXNlLCBwYXJzZWRGYWlsZWRdLFxuKTtcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgbWF4VmFsdWU6IHtcbiAgICBkZWZhdWx0VmFsdWU6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICAgIGlzVmFsaWQ6IGlzU2FmZUludGVnZXIsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB2YWxpZCBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG4gIG1pblZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiAwIC0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIsXG4gICAgaXNWYWxpZDogaXNTYWZlSW50ZWdlcixcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHZhbGlkIGludGVnZXInLFxuICAgIHBhcnNlOiB0b051bWJlck9yTnVsbCxcbiAgfSxcbiAgZGVjaW1hbFBsYWNlczoge1xuICAgIGRlZmF1bHRWYWx1ZTogMCxcbiAgICBpc1ZhbGlkOiBuID0+IGlzU2FmZUludGVnZXIobikgJiYgbiA+PSAwLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlcicsXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgZ2V0RGVjaW1hbFBsYWNlcyA9ICh2YWwpID0+IHtcbiAgY29uc3Qgc3BsaXREZWNpbWFsID0gdmFsLnRvU3RyaW5nKCkuc3BsaXQoJy4nKTtcbiAgaWYgKHNwbGl0RGVjaW1hbC5sZW5ndGggPT09IDEpIHJldHVybiAwO1xuICByZXR1cm4gc3BsaXREZWNpbWFsWzFdLmxlbmd0aDtcbn07XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWluVmFsdWUgPT09IG51bGwgfHwgdmFsID49IG9wdHMubWluVmFsdWUsXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlICgke3ZhbC50b1N0cmluZygpfSkgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtvcHRzLm1pblZhbHVlfWApLFxuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5tYXhWYWx1ZSA9PT0gbnVsbCB8fCB2YWwgPD0gb3B0cy5tYXhWYWx1ZSxcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgKCR7dmFsLnRvU3RyaW5nKCl9KSBtdXN0IGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke29wdHMubWluVmFsdWV9IG9wdGlvbnNgKSxcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMuZGVjaW1hbFBsYWNlcyA+PSBnZXREZWNpbWFsUGxhY2VzKHZhbCksXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlICgke3ZhbC50b1N0cmluZygpfSkgbXVzdCBoYXZlICR7b3B0cy5kZWNpbWFsUGxhY2VzfSBkZWNpbWFsIHBsYWNlcyBvciBsZXNzYCksXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxuICAnbnVtYmVyJyxcbiAgbnVtYmVyVHJ5UGFyc2UsXG4gIG51bWJlckZ1bmN0aW9ucyxcbiAgb3B0aW9ucyxcbiAgdHlwZUNvbnN0cmFpbnRzLFxuICAxLFxuICBudW0gPT4gbnVtLnRvU3RyaW5nKCksXG4pO1xuIiwiaW1wb3J0IHtcbiAgY29uc3RhbnQsIGlzRGF0ZSwgaXNTdHJpbmcsIGlzTnVsbFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgbWFrZXJ1bGUsIHR5cGVGdW5jdGlvbnMsXG4gIHBhcnNlZEZhaWxlZCwgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9EYXRlT3JOdWxsLFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBkYXRlRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XG4gIGRlZmF1bHQ6IGNvbnN0YW50KG51bGwpLFxuICBub3c6ICgpID0+IG5ldyBEYXRlKCksXG59KTtcblxuY29uc3QgaXNWYWxpZERhdGUgPSBkID0+IGQgaW5zdGFuY2VvZiBEYXRlICYmICFpc05hTihkKTtcblxuY29uc3QgcGFyc2VTdHJpbmdUb0RhdGUgPSBzID0+IHN3aXRjaENhc2UoXG4gIFtpc1ZhbGlkRGF0ZSwgcGFyc2VkU3VjY2Vzc10sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbikobmV3IERhdGUocykpO1xuXG5cbmNvbnN0IGRhdGVUcnlQYXJzZSA9IHN3aXRjaENhc2UoXG4gIFtpc0RhdGUsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNTdHJpbmcsIHBhcnNlU3RyaW5nVG9EYXRlXSxcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbik7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIG1heFZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBuZXcgRGF0ZSgzMjUwMzY4MDAwMDAwMCksXG4gICAgaXNWYWxpZDogaXNEYXRlLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgdmFsaWQgZGF0ZScsXG4gICAgcGFyc2U6IHRvRGF0ZU9yTnVsbCxcbiAgfSxcbiAgbWluVmFsdWU6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG5ldyBEYXRlKC04NTIwMzM2MDAwMDAwKSxcbiAgICBpc1ZhbGlkOiBpc0RhdGUsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB2YWxpZCBkYXRlJyxcbiAgICBwYXJzZTogdG9EYXRlT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5taW5WYWx1ZSA9PT0gbnVsbCB8fCB2YWwgPj0gb3B0cy5taW5WYWx1ZSxcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgKCR7dmFsLnRvU3RyaW5nKCl9KSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAke29wdHMubWluVmFsdWV9YCksXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCBvcHRzLm1heFZhbHVlID09PSBudWxsIHx8IHZhbCA8PSBvcHRzLm1heFZhbHVlLFxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSAoJHt2YWwudG9TdHJpbmcoKX0pIG11c3QgYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvICR7b3B0cy5taW5WYWx1ZX0gb3B0aW9uc2ApLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcbiAgJ2RhdGV0aW1lJyxcbiAgZGF0ZVRyeVBhcnNlLFxuICBkYXRlRnVuY3Rpb25zLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gIG5ldyBEYXRlKDE5ODQsIDQsIDEpLFxuICBkYXRlID0+IEpTT04uc3RyaW5naWZ5KGRhdGUpLnJlcGxhY2UobmV3IFJlZ0V4cCgnXCInLCAnZycpLCAnJyksXG4pO1xuIiwiaW1wb3J0IHsgXG4gIG1hcCwgIGNvbnN0YW50LCBpc0FycmF5IFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgdHlwZUZ1bmN0aW9ucywgbWFrZXJ1bGUsXG4gIHBhcnNlZEZhaWxlZCwgZ2V0RGVmYXVsdEV4cG9ydCwgcGFyc2VkU3VjY2Vzcyxcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9OdW1iZXJPck51bGwsXG4gICQkLCBpc1NhZmVJbnRlZ2VyLFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBhcnJheUZ1bmN0aW9ucyA9ICgpID0+IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBjb25zdGFudChbXSksXG59KTtcblxuY29uc3QgbWFwVG9QYXJzZWRBcnJhcnkgPSB0eXBlID0+ICQkKFxuICBtYXAoaSA9PiB0eXBlLnNhZmVQYXJzZVZhbHVlKGkpKSxcbiAgcGFyc2VkU3VjY2Vzcyxcbik7XG5cbmNvbnN0IGFycmF5VHJ5UGFyc2UgPSB0eXBlID0+IHN3aXRjaENhc2UoXG4gIFtpc0FycmF5LCBtYXBUb1BhcnNlZEFycmFyeSh0eXBlKV0sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbik7XG5cbmNvbnN0IHR5cGVOYW1lID0gdHlwZSA9PiBgYXJyYXk8JHt0eXBlfT5gO1xuXG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIG1heExlbmd0aDoge1xuICAgIGRlZmF1bHRWYWx1ZTogMTAwMDAsXG4gICAgaXNWYWxpZDogaXNTYWZlSW50ZWdlcixcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXInLFxuICAgIHBhcnNlOiB0b051bWJlck9yTnVsbCxcbiAgfSxcbiAgbWluTGVuZ3RoOiB7XG4gICAgZGVmYXVsdFZhbHVlOiAwLFxuICAgIGlzVmFsaWQ6IG4gPT4gaXNTYWZlSW50ZWdlcihuKSAmJiBuID49IDAsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG59O1xuXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCB2YWwubGVuZ3RoID49IG9wdHMubWluTGVuZ3RoLFxuICAgICh2YWwsIG9wdHMpID0+IGBtdXN0IGNob29zZSAke29wdHMubWluTGVuZ3RofSBvciBtb3JlIG9wdGlvbnNgKSxcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IHZhbC5sZW5ndGggPD0gb3B0cy5tYXhMZW5ndGgsXG4gICAgKHZhbCwgb3B0cykgPT4gYGNhbm5vdCBjaG9vc2UgbW9yZSB0aGFuICR7b3B0cy5tYXhMZW5ndGh9IG9wdGlvbnNgKSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IHR5cGUgPT4gZ2V0RGVmYXVsdEV4cG9ydChcbiAgdHlwZU5hbWUodHlwZS5uYW1lKSxcbiAgYXJyYXlUcnlQYXJzZSh0eXBlKSxcbiAgYXJyYXlGdW5jdGlvbnModHlwZSksXG4gIG9wdGlvbnMsXG4gIHR5cGVDb25zdHJhaW50cyxcbiAgW3R5cGUuc2FtcGxlVmFsdWVdLFxuICBKU09OLnN0cmluZ2lmeSxcbik7XG4iLCJpbXBvcnQge1xuICBpc1N0cmluZywgaXNPYmplY3RMaWtlLFxuICBpc051bGwsIGhhcywgaXNFbXB0eSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIHR5cGVGdW5jdGlvbnMsIG1ha2VydWxlLFxuICBwYXJzZWRTdWNjZXNzLCBnZXREZWZhdWx0RXhwb3J0LFxuICBwYXJzZWRGYWlsZWQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsXG4gIGlzTm9uRW1wdHlTdHJpbmcsIGlzQXJyYXlPZlN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgcmVmZXJlbmNlTm90aGluZyA9ICgpID0+ICh7IGtleTogJycgfSk7XG5cbmNvbnN0IHJlZmVyZW5jZUZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiByZWZlcmVuY2VOb3RoaW5nLFxufSk7XG5cbmNvbnN0IGhhc1N0cmluZ1ZhbHVlID0gKG9iLCBwYXRoKSA9PiBoYXMocGF0aCkob2IpXG4gICAgJiYgaXNTdHJpbmcob2JbcGF0aF0pO1xuXG5jb25zdCBpc09iamVjdFdpdGhLZXkgPSB2ID0+IGlzT2JqZWN0TGlrZSh2KVxuICAgICYmIGhhc1N0cmluZ1ZhbHVlKHYsICdrZXknKTtcblxuY29uc3QgdHJ5UGFyc2VGcm9tU3RyaW5nID0gcyA9PiB7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBhc09iaiA9IEpTT04ucGFyc2Uocyk7XG4gICAgaWYoaXNPYmplY3RXaXRoS2V5KSB7XG4gICAgICByZXR1cm4gcGFyc2VkU3VjY2Vzcyhhc09iaik7XG4gICAgfVxuICB9XG4gIGNhdGNoKF8pIHtcbiAgICAvLyBFTVBUWVxuICB9XG5cbiAgcmV0dXJuIHBhcnNlZEZhaWxlZChzKTtcbn1cblxuY29uc3QgcmVmZXJlbmNlVHJ5UGFyc2UgPSB2ID0+IHN3aXRjaENhc2UoXG4gIFtpc09iamVjdFdpdGhLZXksIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNTdHJpbmcsIHRyeVBhcnNlRnJvbVN0cmluZ10sXG4gIFtpc051bGwsICgpID0+IHBhcnNlZFN1Y2Nlc3MocmVmZXJlbmNlTm90aGluZygpKV0sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbikodik7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIGluZGV4Tm9kZUtleToge1xuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICBpc1ZhbGlkOiBpc05vbkVtcHR5U3RyaW5nLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZycsXG4gICAgcGFyc2U6IHMgPT4gcyxcbiAgfSxcbiAgZGlzcGxheVZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiAnJyxcbiAgICBpc1ZhbGlkOiBpc05vbkVtcHR5U3RyaW5nLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZycsXG4gICAgcGFyc2U6IHMgPT4gcyxcbiAgfSxcbiAgcmV2ZXJzZUluZGV4Tm9kZUtleXM6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgaXNWYWxpZDogdiA9PiBpc0FycmF5T2ZTdHJpbmcodikgJiYgdi5sZW5ndGggPiAwLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgbm9uLWVtcHR5IGFycmF5IG9mIHN0cmluZ3MnLFxuICAgIHBhcnNlOiBzID0+IHMsXG4gIH0sXG59O1xuXG5jb25zdCBpc0VtcHR5U3RyaW5nID0gcyA9PiBpc1N0cmluZyhzKSAmJiBpc0VtcHR5KHMpO1xuXG5jb25zdCBlbnN1cmVSZWZlcmVuY2VFeGlzdHMgPSBhc3luYyAodmFsLCBvcHRzLCBjb250ZXh0KSA9PiBpc0VtcHR5U3RyaW5nKHZhbC5rZXkpXG4gICAgfHwgYXdhaXQgY29udGV4dC5yZWZlcmVuY2VFeGlzdHMob3B0cywgdmFsLmtleSk7XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcbiAgbWFrZXJ1bGUoXG4gICAgZW5zdXJlUmVmZXJlbmNlRXhpc3RzLFxuICAgICh2YWwsIG9wdHMpID0+IGBcIiR7dmFsW29wdHMuZGlzcGxheVZhbHVlXX1cIiBkb2VzIG5vdCBleGlzdCBpbiBvcHRpb25zIGxpc3QgKGtleTogJHt2YWwua2V5fSlgLFxuICApLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcbiAgJ3JlZmVyZW5jZScsXG4gIHJlZmVyZW5jZVRyeVBhcnNlLFxuICByZWZlcmVuY2VGdW5jdGlvbnMsXG4gIG9wdGlvbnMsXG4gIHR5cGVDb25zdHJhaW50cyxcbiAgeyBrZXk6ICdrZXknLCB2YWx1ZTogJ3ZhbHVlJyB9LFxuICBKU09OLnN0cmluZ2lmeSxcbik7XG4iLCJpbXBvcnQge1xuICBsYXN0LCBoYXMsIGlzU3RyaW5nLCBpbnRlcnNlY3Rpb24sXG4gIGlzTnVsbCwgaXNOdW1iZXIsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICB0eXBlRnVuY3Rpb25zLCBwYXJzZWRGYWlsZWQsXG4gIHBhcnNlZFN1Y2Nlc3MsIGdldERlZmF1bHRFeHBvcnQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIG5vbmUsXG4gICQsIHNwbGl0S2V5LFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBpbGxlZ2FsQ2hhcmFjdGVycyA9ICcqP1xcXFwvOjw+fFxcMFxcYlxcZlxcdic7XG5cbmV4cG9ydCBjb25zdCBpc0xlZ2FsRmlsZW5hbWUgPSAoZmlsZVBhdGgpID0+IHtcbiAgY29uc3QgZm4gPSBmaWxlTmFtZShmaWxlUGF0aCk7XG4gIHJldHVybiBmbi5sZW5ndGggPD0gMjU1XG4gICAgJiYgaW50ZXJzZWN0aW9uKGZuLnNwbGl0KCcnKSkoaWxsZWdhbENoYXJhY3RlcnMuc3BsaXQoJycpKS5sZW5ndGggPT09IDBcbiAgICAmJiBub25lKGYgPT4gZiA9PT0gJy4uJykoc3BsaXRLZXkoZmlsZVBhdGgpKTtcbn07XG5cbmNvbnN0IGZpbGVOb3RoaW5nID0gKCkgPT4gKHsgcmVsYXRpdmVQYXRoOiAnJywgc2l6ZTogMCB9KTtcblxuY29uc3QgZmlsZUZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBmaWxlTm90aGluZyxcbn0pO1xuXG5jb25zdCBmaWxlVHJ5UGFyc2UgPSB2ID0+IHN3aXRjaENhc2UoXG4gIFtpc1ZhbGlkRmlsZSwgcGFyc2VkU3VjY2Vzc10sXG4gIFtpc051bGwsICgpID0+IHBhcnNlZFN1Y2Nlc3MoZmlsZU5vdGhpbmcoKSldLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pKHYpO1xuXG5jb25zdCBmaWxlTmFtZSA9IGZpbGVQYXRoID0+ICQoZmlsZVBhdGgsIFtcbiAgc3BsaXRLZXksXG4gIGxhc3QsXG5dKTtcblxuY29uc3QgaXNWYWxpZEZpbGUgPSBmID0+ICFpc051bGwoZilcbiAgICAmJiBoYXMoJ3JlbGF0aXZlUGF0aCcpKGYpICYmIGhhcygnc2l6ZScpKGYpXG4gICAgJiYgaXNOdW1iZXIoZi5zaXplKVxuICAgICYmIGlzU3RyaW5nKGYucmVsYXRpdmVQYXRoKVxuICAgICYmIGlzTGVnYWxGaWxlbmFtZShmLnJlbGF0aXZlUGF0aCk7XG5cbmNvbnN0IG9wdGlvbnMgPSB7fTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW107XG5cbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXG4gICdmaWxlJyxcbiAgZmlsZVRyeVBhcnNlLFxuICBmaWxlRnVuY3Rpb25zLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gIHsgcmVsYXRpdmVQYXRoOiAnc29tZV9maWxlLmpwZycsIHNpemU6IDEwMDAgfSxcbiAgSlNPTi5zdHJpbmdpZnksXG4pO1xuIiwiaW1wb3J0IHtcbiAgYXNzaWduLCBtZXJnZSwgXG59IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICBtYXAsIGlzU3RyaW5nLCBpc051bWJlcixcbiAgaXNCb29sZWFuLCBpc0RhdGUsIGtleXMsXG4gIGlzT2JqZWN0LCBpc0FycmF5LCBoYXNcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7ICQgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGFyc2VkU3VjY2VzcyB9IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHN0cmluZyBmcm9tICcuL3N0cmluZyc7XG5pbXBvcnQgYm9vbCBmcm9tICcuL2Jvb2wnO1xuaW1wb3J0IG51bWJlciBmcm9tICcuL251bWJlcic7XG5pbXBvcnQgZGF0ZXRpbWUgZnJvbSAnLi9kYXRldGltZSc7XG5pbXBvcnQgYXJyYXkgZnJvbSAnLi9hcnJheSc7XG5pbXBvcnQgcmVmZXJlbmNlIGZyb20gJy4vcmVmZXJlbmNlJztcbmltcG9ydCBmaWxlIGZyb20gJy4vZmlsZSc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuY29uc3QgYWxsVHlwZXMgPSAoKSA9PiB7XG4gIGNvbnN0IGJhc2ljVHlwZXMgPSB7XG4gICAgc3RyaW5nLCBudW1iZXIsIGRhdGV0aW1lLCBib29sLCByZWZlcmVuY2UsIGZpbGUsXG4gIH07XG5cbiAgY29uc3QgYXJyYXlzID0gJChiYXNpY1R5cGVzLCBbXG4gICAga2V5cyxcbiAgICBtYXAoKGspID0+IHtcbiAgICAgIGNvbnN0IGt2VHlwZSA9IHt9O1xuICAgICAgY29uc3QgY29uY3JldGVBcnJheSA9IGFycmF5KGJhc2ljVHlwZXNba10pO1xuICAgICAga3ZUeXBlW2NvbmNyZXRlQXJyYXkubmFtZV0gPSBjb25jcmV0ZUFycmF5O1xuICAgICAgcmV0dXJuIGt2VHlwZTtcbiAgICB9KSxcbiAgICB0eXBlcyA9PiBhc3NpZ24oe30sIC4uLnR5cGVzKSxcbiAgXSk7XG5cbiAgcmV0dXJuIG1lcmdlKHt9LCBiYXNpY1R5cGVzLCBhcnJheXMpO1xufTtcblxuXG5leHBvcnQgY29uc3QgYWxsID0gYWxsVHlwZXMoKTtcblxuZXhwb3J0IGNvbnN0IGdldFR5cGUgPSAodHlwZU5hbWUpID0+IHtcbiAgaWYgKCFoYXModHlwZU5hbWUpKGFsbCkpIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYERvIG5vdCByZWNvZ25pc2UgdHlwZSAke3R5cGVOYW1lfWApO1xuICByZXR1cm4gYWxsW3R5cGVOYW1lXTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRTYW1wbGVGaWVsZFZhbHVlID0gZmllbGQgPT4gZ2V0VHlwZShmaWVsZC50eXBlKS5zYW1wbGVWYWx1ZTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0ZpZWxkVmFsdWUgPSBmaWVsZCA9PiBnZXRUeXBlKGZpZWxkLnR5cGUpLmdldE5ldyhmaWVsZCk7XG5cbmV4cG9ydCBjb25zdCBzYWZlUGFyc2VGaWVsZCA9IChmaWVsZCwgcmVjb3JkKSA9PiBnZXRUeXBlKGZpZWxkLnR5cGUpLnNhZmVQYXJzZUZpZWxkKGZpZWxkLCByZWNvcmQpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVGaWVsZFBhcnNlID0gKGZpZWxkLCByZWNvcmQpID0+IChoYXMoZmllbGQubmFtZSkocmVjb3JkKVxuICA/IGdldFR5cGUoZmllbGQudHlwZSkudHJ5UGFyc2UocmVjb3JkW2ZpZWxkLm5hbWVdKVxuICA6IHBhcnNlZFN1Y2Nlc3ModW5kZWZpbmVkKSk7IC8vIGZpZWxkcyBtYXkgYmUgdW5kZWZpbmVkIGJ5IGRlZmF1bHRcblxuZXhwb3J0IGNvbnN0IGdldERlZmF1bHRPcHRpb25zID0gdHlwZSA9PiBnZXRUeXBlKHR5cGUpLmdldERlZmF1bHRPcHRpb25zKCk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyA9IGFzeW5jIChmaWVsZCwgcmVjb3JkLCBjb250ZXh0KSA9PiBhd2FpdCBnZXRUeXBlKGZpZWxkLnR5cGUpLnZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzKGZpZWxkLCByZWNvcmQsIGNvbnRleHQpO1xuXG5leHBvcnQgY29uc3QgZGV0ZWN0VHlwZSA9ICh2YWx1ZSkgPT4ge1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSByZXR1cm4gc3RyaW5nO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSkgcmV0dXJuIGJvb2w7XG4gIGlmIChpc051bWJlcih2YWx1ZSkpIHJldHVybiBudW1iZXI7XG4gIGlmIChpc0RhdGUodmFsdWUpKSByZXR1cm4gZGF0ZXRpbWU7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkgcmV0dXJuIGFycmF5KGRldGVjdFR5cGUodmFsdWVbMF0pKTtcbiAgaWYgKGlzT2JqZWN0KHZhbHVlKVxuICAgICAgICYmIGhhcygna2V5JykodmFsdWUpXG4gICAgICAgJiYgaGFzKCd2YWx1ZScpKHZhbHVlKSkgcmV0dXJuIHJlZmVyZW5jZTtcbiAgaWYgKGlzT2JqZWN0KHZhbHVlKVxuICAgICAgICAmJiBoYXMoJ3JlbGF0aXZlUGF0aCcpKHZhbHVlKVxuICAgICAgICAmJiBoYXMoJ3NpemUnKSh2YWx1ZSkpIHJldHVybiBmaWxlO1xuXG4gIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYGNhbm5vdCBkZXRlcm1pbmUgdHlwZTogJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSl9YCk7XG59O1xuIiwiaW1wb3J0IHsgY2xvbmUsIGZpbmQsIHNwbGl0IH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGpvaW5LZXksICQgfSBmcm9tICcuLi9jb21tb24nO1xuLy8gNSBtaW51dGVzXG5leHBvcnQgY29uc3QgdGVtcENvZGVFeHBpcnlMZW5ndGggPSA1ICogNjAgKiAxMDAwO1xuXG5leHBvcnQgY29uc3QgQVVUSF9GT0xERVIgPSAnLy5hdXRoJztcbmV4cG9ydCBjb25zdCBVU0VSU19MSVNUX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAndXNlcnMuanNvbicpO1xuZXhwb3J0IGNvbnN0IHVzZXJBdXRoRmlsZSA9IHVzZXJuYW1lID0+IGpvaW5LZXkoQVVUSF9GT0xERVIsIGBhdXRoXyR7dXNlcm5hbWV9Lmpzb25gKTtcbmV4cG9ydCBjb25zdCBVU0VSU19MT0NLX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAndXNlcnNfbG9jaycpO1xuZXhwb3J0IGNvbnN0IEFDQ0VTU19MRVZFTFNfRklMRSA9IGpvaW5LZXkoQVVUSF9GT0xERVIsICdhY2Nlc3NfbGV2ZWxzLmpzb24nKTtcbmV4cG9ydCBjb25zdCBBQ0NFU1NfTEVWRUxTX0xPQ0tfRklMRSA9IGpvaW5LZXkoQVVUSF9GT0xERVIsICdhY2Nlc3NfbGV2ZWxzX2xvY2snKTtcblxuZXhwb3J0IGNvbnN0IHBlcm1pc3Npb25UeXBlcyA9IHtcbiAgQ1JFQVRFX1JFQ09SRDogJ2NyZWF0ZSByZWNvcmQnLFxuICBVUERBVEVfUkVDT1JEOiAndXBkYXRlIHJlY29yZCcsXG4gIFJFQURfUkVDT1JEOiAncmVhZCByZWNvcmQnLFxuICBERUxFVEVfUkVDT1JEOiAnZGVsZXRlIHJlY29yZCcsXG4gIFJFQURfSU5ERVg6ICdyZWFkIGluZGV4JyxcbiAgTUFOQUdFX0lOREVYOiAnbWFuYWdlIGluZGV4JyxcbiAgTUFOQUdFX0NPTExFQ1RJT046ICdtYW5hZ2UgY29sbGVjdGlvbicsXG4gIFdSSVRFX1RFTVBMQVRFUzogJ3dyaXRlIHRlbXBsYXRlcycsXG4gIENSRUFURV9VU0VSOiAnY3JlYXRlIHVzZXInLFxuICBTRVRfUEFTU1dPUkQ6ICdzZXQgcGFzc3dvcmQnLFxuICBDUkVBVEVfVEVNUE9SQVJZX0FDQ0VTUzogJ2NyZWF0ZSB0ZW1wb3JhcnkgYWNjZXNzJyxcbiAgRU5BQkxFX0RJU0FCTEVfVVNFUjogJ2VuYWJsZSBvciBkaXNhYmxlIHVzZXInLFxuICBXUklURV9BQ0NFU1NfTEVWRUxTOiAnd3JpdGUgYWNjZXNzIGxldmVscycsXG4gIExJU1RfVVNFUlM6ICdsaXN0IHVzZXJzJyxcbiAgTElTVF9BQ0NFU1NfTEVWRUxTOiAnbGlzdCBhY2Nlc3MgbGV2ZWxzJyxcbiAgRVhFQ1VURV9BQ1RJT046ICdleGVjdXRlIGFjdGlvbicsXG4gIFNFVF9VU0VSX0FDQ0VTU19MRVZFTFM6ICdzZXQgdXNlciBhY2Nlc3MgbGV2ZWxzJyxcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRVc2VyQnlOYW1lID0gKHVzZXJzLCBuYW1lKSA9PiAkKHVzZXJzLCBbXG4gIGZpbmQodSA9PiB1Lm5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZS50b0xvd2VyQ2FzZSgpKSxcbl0pO1xuXG5leHBvcnQgY29uc3Qgc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZiA9ICh1c2VyKSA9PiB7XG4gIGNvbnN0IHN0cmlwcGVkID0gY2xvbmUodXNlcik7XG4gIGRlbGV0ZSBzdHJpcHBlZC50ZW1wQ29kZTtcbiAgcmV0dXJuIHN0cmlwcGVkO1xufTtcblxuZXhwb3J0IGNvbnN0IHBhcnNlVGVtcG9yYXJ5Q29kZSA9IGZ1bGxDb2RlID0+ICQoZnVsbENvZGUsIFtcbiAgc3BsaXQoJzonKSxcbiAgcGFydHMgPT4gKHtcbiAgICBpZDogcGFydHNbMV0sXG4gICAgY29kZTogcGFydHNbMl0sXG4gIH0pLFxuXSk7XG4iLCJpbXBvcnQgeyB2YWx1ZXMsIGluY2x1ZGVzLCBzb21lIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHBlcm1pc3Npb25UeXBlcyB9IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQge1xuICAkLCBpc05vdGhpbmcsIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXROb2RlQnlLZXlPck5vZGVLZXksIGlzTm9kZSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBpc0F1dGhvcml6ZWQgPSBhcHAgPT4gKHBlcm1pc3Npb25UeXBlLCByZXNvdXJjZUtleSkgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuaXNBdXRob3JpemVkLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHJlc291cmNlS2V5LCBwZXJtaXNzaW9uVHlwZSB9LFxuICBfaXNBdXRob3JpemVkLCBhcHAsIHBlcm1pc3Npb25UeXBlLCByZXNvdXJjZUtleSxcbik7XG5cbmV4cG9ydCBjb25zdCBfaXNBdXRob3JpemVkID0gKGFwcCwgcGVybWlzc2lvblR5cGUsIHJlc291cmNlS2V5KSA9PiB7XG4gIGlmICghYXBwLnVzZXIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCB2YWxpZFR5cGUgPSAkKHBlcm1pc3Npb25UeXBlcywgW1xuICAgIHZhbHVlcyxcbiAgICBpbmNsdWRlcyhwZXJtaXNzaW9uVHlwZSksXG4gIF0pO1xuXG4gIGlmICghdmFsaWRUeXBlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgcGVybU1hdGNoZXNSZXNvdXJjZSA9ICh1c2VycGVybSkgPT4ge1xuICAgIGNvbnN0IG5vZGVLZXkgPSBpc05vdGhpbmcocmVzb3VyY2VLZXkpXG4gICAgICA/IG51bGxcbiAgICAgIDogaXNOb2RlKGFwcC5oaWVyYXJjaHksIHJlc291cmNlS2V5KVxuICAgICAgICA/IGdldE5vZGVCeUtleU9yTm9kZUtleShcbiAgICAgICAgICBhcHAuaGllcmFyY2h5LCByZXNvdXJjZUtleSxcbiAgICAgICAgKS5ub2RlS2V5KClcbiAgICAgICAgOiByZXNvdXJjZUtleTtcblxuICAgIHJldHVybiAodXNlcnBlcm0udHlwZSA9PT0gcGVybWlzc2lvblR5cGUpXG4gICAgICAgICYmIChcbiAgICAgICAgICBpc05vdGhpbmcocmVzb3VyY2VLZXkpXG4gICAgICAgICAgICB8fCBub2RlS2V5ID09PSB1c2VycGVybS5ub2RlS2V5XG4gICAgICAgICk7XG4gIH07XG5cbiAgcmV0dXJuICQoYXBwLnVzZXIucGVybWlzc2lvbnMsIFtcbiAgICBzb21lKHBlcm1NYXRjaGVzUmVzb3VyY2UpLFxuICBdKTtcbn07XG4iLCJpbXBvcnQgeyBwZXJtaXNzaW9uVHlwZXMgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgaXNBdXRob3JpemVkIH0gZnJvbSAnLi9pc0F1dGhvcml6ZWQnO1xuXG5leHBvcnQgY29uc3QgdGVtcG9yYXJ5QWNjZXNzUGVybWlzc2lvbnMgPSAoKSA9PiAoW3sgdHlwZTogcGVybWlzc2lvblR5cGVzLlNFVF9QQVNTV09SRCB9XSk7XG5cbmNvbnN0IG5vZGVQZXJtaXNzaW9uID0gdHlwZSA9PiAoe1xuICBhZGQ6IChub2RlS2V5LCBhY2Nlc3NMZXZlbCkgPT4gYWNjZXNzTGV2ZWwucGVybWlzc2lvbnMucHVzaCh7IHR5cGUsIG5vZGVLZXkgfSksXG4gIGlzQXV0aG9yaXplZDogcmVzb3VyY2VLZXkgPT4gYXBwID0+IGlzQXV0aG9yaXplZChhcHApKHR5cGUsIHJlc291cmNlS2V5KSxcbiAgaXNOb2RlOiB0cnVlLFxuICBnZXQ6IG5vZGVLZXkgPT4gKHsgdHlwZSwgbm9kZUtleSB9KSxcbn0pO1xuXG5jb25zdCBzdGF0aWNQZXJtaXNzaW9uID0gdHlwZSA9PiAoe1xuICBhZGQ6IGFjY2Vzc0xldmVsID0+IGFjY2Vzc0xldmVsLnBlcm1pc3Npb25zLnB1c2goeyB0eXBlIH0pLFxuICBpc0F1dGhvcml6ZWQ6IGFwcCA9PiBpc0F1dGhvcml6ZWQoYXBwKSh0eXBlKSxcbiAgaXNOb2RlOiBmYWxzZSxcbiAgZ2V0OiAoKSA9PiAoeyB0eXBlIH0pLFxufSk7XG5cbmNvbnN0IGNyZWF0ZVJlY29yZCA9IG5vZGVQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfUkVDT1JEKTtcblxuY29uc3QgdXBkYXRlUmVjb3JkID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlVQREFURV9SRUNPUkQpO1xuXG5jb25zdCBkZWxldGVSZWNvcmQgPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuREVMRVRFX1JFQ09SRCk7XG5cbmNvbnN0IHJlYWRSZWNvcmQgPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuUkVBRF9SRUNPUkQpO1xuXG5jb25zdCB3cml0ZVRlbXBsYXRlcyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLldSSVRFX1RFTVBMQVRFUyk7XG5cbmNvbnN0IGNyZWF0ZVVzZXIgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfVVNFUik7XG5cbmNvbnN0IHNldFBhc3N3b3JkID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuU0VUX1BBU1NXT1JEKTtcblxuY29uc3QgcmVhZEluZGV4ID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlJFQURfSU5ERVgpO1xuXG5jb25zdCBtYW5hZ2VJbmRleCA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLk1BTkFHRV9JTkRFWCk7XG5cbmNvbnN0IG1hbmFnZUNvbGxlY3Rpb24gPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5NQU5BR0VfQ09MTEVDVElPTik7XG5cbmNvbnN0IGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkNSRUFURV9URU1QT1JBUllfQUNDRVNTKTtcblxuY29uc3QgZW5hYmxlRGlzYWJsZVVzZXIgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5FTkFCTEVfRElTQUJMRV9VU0VSKTtcblxuY29uc3Qgd3JpdGVBY2Nlc3NMZXZlbHMgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5XUklURV9BQ0NFU1NfTEVWRUxTKTtcblxuY29uc3QgbGlzdFVzZXJzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuTElTVF9VU0VSUyk7XG5cbmNvbnN0IGxpc3RBY2Nlc3NMZXZlbHMgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5MSVNUX0FDQ0VTU19MRVZFTFMpO1xuXG5jb25zdCBzZXRVc2VyQWNjZXNzTGV2ZWxzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuU0VUX1VTRVJfQUNDRVNTX0xFVkVMUyk7XG5cbmNvbnN0IGV4ZWN1dGVBY3Rpb24gPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuRVhFQ1VURV9BQ1RJT04pO1xuXG5leHBvcnQgY29uc3QgYWx3YXlzQXV0aG9yaXplZCA9ICgpID0+IHRydWU7XG5cbmV4cG9ydCBjb25zdCBwZXJtaXNzaW9uID0ge1xuICBjcmVhdGVSZWNvcmQsXG4gIHVwZGF0ZVJlY29yZCxcbiAgZGVsZXRlUmVjb3JkLFxuICByZWFkUmVjb3JkLFxuICB3cml0ZVRlbXBsYXRlcyxcbiAgY3JlYXRlVXNlcixcbiAgc2V0UGFzc3dvcmQsXG4gIHJlYWRJbmRleCxcbiAgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzLFxuICBlbmFibGVEaXNhYmxlVXNlcixcbiAgd3JpdGVBY2Nlc3NMZXZlbHMsXG4gIGxpc3RVc2VycyxcbiAgbGlzdEFjY2Vzc0xldmVscyxcbiAgbWFuYWdlSW5kZXgsXG4gIG1hbmFnZUNvbGxlY3Rpb24sXG4gIGV4ZWN1dGVBY3Rpb24sXG4gIHNldFVzZXJBY2Nlc3NMZXZlbHMsXG59O1xuIiwiaW1wb3J0IHtcbiAga2V5QnksIG1hcFZhbHVlcyxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnc2hvcnRpZCc7XG5pbXBvcnQgeyBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgZ2V0TmV3RmllbGRWYWx1ZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7XG4gICQsIGpvaW5LZXksIHNhZmVLZXksIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBnZXROZXcgPSBhcHAgPT4gKGNvbGxlY3Rpb25LZXksIHJlY29yZFR5cGVOYW1lKSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRSZWNvcmROb2RlKGFwcCwgY29sbGVjdGlvbktleSwgcmVjb3JkVHlwZU5hbWUpO1xuICByZXR1cm4gYXBpV3JhcHBlclN5bmMoXG4gICAgYXBwLFxuICAgIGV2ZW50cy5yZWNvcmRBcGkuZ2V0TmV3LFxuICAgIHBlcm1pc3Npb24uY3JlYXRlUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmROb2RlLm5vZGVLZXkoKSksXG4gICAgeyBjb2xsZWN0aW9uS2V5LCByZWNvcmRUeXBlTmFtZSB9LFxuICAgIF9nZXROZXcsIHJlY29yZE5vZGUsIGNvbGxlY3Rpb25LZXksXG4gICk7XG59O1xuXG5jb25zdCBfZ2V0TmV3ID0gKHJlY29yZE5vZGUsIGNvbGxlY3Rpb25LZXkpID0+IGNvbnN0cnVjdFJlY29yZChyZWNvcmROb2RlLCBnZXROZXdGaWVsZFZhbHVlLCBjb2xsZWN0aW9uS2V5KTtcblxuY29uc3QgZ2V0UmVjb3JkTm9kZSA9IChhcHAsIGNvbGxlY3Rpb25LZXkpID0+IHtcbiAgY29sbGVjdGlvbktleSA9IHNhZmVLZXkoY29sbGVjdGlvbktleSk7XG4gIHJldHVybiBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwLmhpZXJhcmNoeSkoY29sbGVjdGlvbktleSk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3Q2hpbGQgPSBhcHAgPT4gKHJlY29yZEtleSwgY29sbGVjdGlvbk5hbWUsIHJlY29yZFR5cGVOYW1lKSA9PiBcbiAgZ2V0TmV3KGFwcCkoam9pbktleShyZWNvcmRLZXksIGNvbGxlY3Rpb25OYW1lKSwgcmVjb3JkVHlwZU5hbWUpO1xuXG5leHBvcnQgY29uc3QgY29uc3RydWN0UmVjb3JkID0gKHJlY29yZE5vZGUsIGdldEZpZWxkVmFsdWUsIGNvbGxlY3Rpb25LZXkpID0+IHtcbiAgY29uc3QgcmVjb3JkID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICAgIGtleUJ5KCduYW1lJyksXG4gICAgbWFwVmFsdWVzKGdldEZpZWxkVmFsdWUpLFxuICBdKTtcblxuICByZWNvcmQuaWQgPSBgJHtyZWNvcmROb2RlLm5vZGVJZH0tJHtnZW5lcmF0ZSgpfWA7XG4gIHJlY29yZC5rZXkgPSBqb2luS2V5KGNvbGxlY3Rpb25LZXksIHJlY29yZC5pZCk7XG4gIHJlY29yZC5pc05ldyA9IHRydWU7XG4gIHJlY29yZC50eXBlID0gcmVjb3JkTm9kZS5uYW1lO1xuICByZXR1cm4gcmVjb3JkO1xufTtcbiIsImltcG9ydCB7XG4gIGtleUJ5LCBtYXBWYWx1ZXMsIGZpbHRlciwgXG4gIG1hcCwgaW5jbHVkZXMsIGxhc3QsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZXRFeGFjdE5vZGVGb3JQYXRoLCBnZXROb2RlIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IHNhZmVQYXJzZUZpZWxkIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtcbiAgJCwgc3BsaXRLZXksIHNhZmVLZXksIGlzTm9uRW1wdHlTdHJpbmcsXG4gIGFwaVdyYXBwZXIsIGV2ZW50cywgam9pbktleSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IG1hcFJlY29yZCB9IGZyb20gJy4uL2luZGV4aW5nL2V2YWx1YXRlJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGdldFJlY29yZEZpbGVOYW1lID0ga2V5ID0+IGpvaW5LZXkoa2V5LCAncmVjb3JkLmpzb24nKTtcblxuZXhwb3J0IGNvbnN0IGxvYWQgPSBhcHAgPT4gYXN5bmMga2V5ID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLnJlY29yZEFwaS5sb2FkLFxuICBwZXJtaXNzaW9uLnJlYWRSZWNvcmQuaXNBdXRob3JpemVkKGtleSksXG4gIHsga2V5IH0sXG4gIF9sb2FkLCBhcHAsIGtleSxcbik7XG5cbmV4cG9ydCBjb25zdCBfbG9hZCA9IGFzeW5jIChhcHAsIGtleSwga2V5U3RhY2sgPSBbXSkgPT4ge1xuICBrZXkgPSBzYWZlS2V5KGtleSk7XG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKGtleSk7XG4gIGNvbnN0IHN0b3JlZERhdGEgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgIGdldFJlY29yZEZpbGVOYW1lKGtleSksXG4gICk7XG5cbiAgY29uc3QgbG9hZGVkUmVjb3JkID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICAgIGtleUJ5KCduYW1lJyksXG4gICAgbWFwVmFsdWVzKGYgPT4gc2FmZVBhcnNlRmllbGQoZiwgc3RvcmVkRGF0YSkpLFxuICBdKTtcblxuICBjb25zdCBuZXdLZXlTdGFjayA9IFsuLi5rZXlTdGFjaywga2V5XTtcblxuICBjb25zdCByZWZlcmVuY2VzID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICAgIGZpbHRlcihmID0+IGYudHlwZSA9PT0gJ3JlZmVyZW5jZSdcbiAgICAgICAgICAgICAgICAgICAgJiYgaXNOb25FbXB0eVN0cmluZyhsb2FkZWRSZWNvcmRbZi5uYW1lXS5rZXkpXG4gICAgICAgICAgICAgICAgICAgICYmICFpbmNsdWRlcyhsb2FkZWRSZWNvcmRbZi5uYW1lXS5rZXkpKG5ld0tleVN0YWNrKSksXG4gICAgbWFwKGYgPT4gKHtcbiAgICAgIHByb21pc2U6IF9sb2FkKGFwcCwgbG9hZGVkUmVjb3JkW2YubmFtZV0ua2V5LCBuZXdLZXlTdGFjayksXG4gICAgICBpbmRleDogZ2V0Tm9kZShhcHAuaGllcmFyY2h5LCBmLnR5cGVPcHRpb25zLmluZGV4Tm9kZUtleSksXG4gICAgICBmaWVsZDogZixcbiAgICB9KSksXG4gIF0pO1xuXG4gIGlmIChyZWZlcmVuY2VzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCByZWZSZWNvcmRzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICBtYXAocCA9PiBwLnByb21pc2UpKHJlZmVyZW5jZXMpLFxuICAgICk7XG5cbiAgICBmb3IgKGNvbnN0IHJlZiBvZiByZWZlcmVuY2VzKSB7XG4gICAgICBsb2FkZWRSZWNvcmRbcmVmLmZpZWxkLm5hbWVdID0gbWFwUmVjb3JkKFxuICAgICAgICByZWZSZWNvcmRzW3JlZmVyZW5jZXMuaW5kZXhPZihyZWYpXSxcbiAgICAgICAgcmVmLmluZGV4LFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBsb2FkZWRSZWNvcmQudHJhbnNhY3Rpb25JZCA9IHN0b3JlZERhdGEudHJhbnNhY3Rpb25JZDtcbiAgbG9hZGVkUmVjb3JkLmlzTmV3ID0gZmFsc2U7XG4gIGxvYWRlZFJlY29yZC5rZXkgPSBrZXk7XG4gIGxvYWRlZFJlY29yZC5pZCA9ICQoa2V5LCBbc3BsaXRLZXksIGxhc3RdKTtcbiAgbG9hZGVkUmVjb3JkLnR5cGUgPSByZWNvcmROb2RlLm5hbWU7XG4gIHJldHVybiBsb2FkZWRSZWNvcmQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBsb2FkO1xuIiwiLy8gYWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXg0ZXIvanMtcHJvbWlzZS1yZWFkYWJsZVxuLy8gdGhhbmtzIDopXG4gIFxuZXhwb3J0IGNvbnN0IHByb21pc2VSZWFkYWJsZVN0cmVhbSA9IHN0cmVhbSA9PiB7XG4gICBcbiAgICBsZXQgX2Vycm9yZWQ7XG5cbiAgICBjb25zdCBfZXJyb3JIYW5kbGVyID0gZXJyID0+IHtcbiAgICAgICAgX2Vycm9yZWQgPSBlcnI7XG4gICAgfTtcblxuICAgIHN0cmVhbS5vbihcImVycm9yXCIsIF9lcnJvckhhbmRsZXIpO1xuICBcbiAgICBjb25zdCByZWFkID0gKHNpemUpID0+IHtcbiAgXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoX2Vycm9yZWQpIHtcbiAgICAgICAgICBjb25zdCBlcnIgPSBfZXJyb3JlZDtcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgfVxuICBcbiAgICAgICAgaWYgKCFzdHJlYW0ucmVhZGFibGUgfHwgc3RyZWFtLmNsb3NlZCB8fCBzdHJlYW0uZGVzdHJveWVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgcmVhZGFibGVIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNodW5rID0gc3RyZWFtLnJlYWQoc2l6ZSk7XG4gIFxuICAgICAgICAgIGlmIChjaHVuaykge1xuICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICByZXNvbHZlKGNodW5rKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IGNsb3NlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IGVuZEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCBlcnJvckhhbmRsZXIgPSAoZXJyKSA9PiB7XG4gICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IHJlbW92ZUxpc3RlbmVycyA9ICgpID0+IHtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJjbG9zZVwiLCBjbG9zZUhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZW5kXCIsIGVuZEhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcInJlYWRhYmxlXCIsIHJlYWRhYmxlSGFuZGxlcik7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIHN0cmVhbS5vbihcImNsb3NlXCIsIGNsb3NlSGFuZGxlcik7XG4gICAgICAgIHN0cmVhbS5vbihcImVuZFwiLCBlbmRIYW5kbGVyKTtcbiAgICAgICAgc3RyZWFtLm9uKFwiZXJyb3JcIiwgZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgc3RyZWFtLm9uKFwicmVhZGFibGVcIiwgcmVhZGFibGVIYW5kbGVyKTtcbiAgXG4gICAgICAgIHJlYWRhYmxlSGFuZGxlcigpO1xuICAgICAgfSk7XG4gICAgfVxuICBcbiAgXG4gICAgY29uc3QgZGVzdHJveSA9ICgpID0+IHtcbiAgICAgIGlmIChzdHJlYW0pIHtcbiAgICAgICAgaWYgKF9lcnJvckhhbmRsZXIpIHtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBfZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHN0cmVhbS5kZXN0cm95ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBzdHJlYW0uZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgXG4gICAgcmV0dXJuIHtyZWFkLCBkZXN0cm95LCBzdHJlYW19O1xuICB9XG4gIFxuICBleHBvcnQgZGVmYXVsdCBwcm9taXNlUmVhZGFibGVTdHJlYW1cbiAgIiwiaW1wb3J0IHsgY29tcGlsZUNvZGUgfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XG5pbXBvcnQge1xuICBmaWx0ZXIsIGluY2x1ZGVzLCBtYXAsIGxhc3QsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRBY3R1YWxLZXlPZlBhcmVudCwgaXNHbG9iYWxJbmRleCxcbiAgZ2V0UGFyZW50S2V5LCBpc1NoYXJkZWRJbmRleCxcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7XG4gIGpvaW5LZXksIGlzTm9uRW1wdHlTdHJpbmcsIHNwbGl0S2V5LCAkLFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhlZERhdGFLZXkgPSAoaW5kZXhOb2RlLCBpbmRleEtleSwgcmVjb3JkKSA9PiB7XG4gIGNvbnN0IGdldFNoYXJkTmFtZSA9IChpbmRleE5vZGUsIHJlY29yZCkgPT4ge1xuICAgIGNvbnN0IHNoYXJkTmFtZUZ1bmMgPSBjb21waWxlQ29kZShpbmRleE5vZGUuZ2V0U2hhcmROYW1lKTtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHNoYXJkTmFtZUZ1bmMoeyByZWNvcmQgfSk7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zdCBlcnJvckRldGFpbHMgPSBgc2hhcmRDb2RlOiAke2luZGV4Tm9kZS5nZXRTaGFyZE5hbWV9IDo6IHJlY29yZDogJHtKU09OLnN0cmluZ2lmeShyZWNvcmQpfSA6OiBgXG4gICAgICBlLm1lc3NhZ2UgPSBcIkVycm9yIHJ1bm5pbmcgaW5kZXggc2hhcmRuYW1lIGZ1bmM6IFwiICsgZXJyb3JEZXRhaWxzICsgZS5tZXNzYWdlO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgc2hhcmROYW1lID0gaXNOb25FbXB0eVN0cmluZyhpbmRleE5vZGUuZ2V0U2hhcmROYW1lKVxuICAgID8gYCR7Z2V0U2hhcmROYW1lKGluZGV4Tm9kZSwgcmVjb3JkKX0uY3N2YFxuICAgIDogJ2luZGV4LmNzdic7XG5cbiAgcmV0dXJuIGpvaW5LZXkoaW5kZXhLZXksIHNoYXJkTmFtZSk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U2hhcmRLZXlzSW5SYW5nZSA9IGFzeW5jIChhcHAsIGluZGV4S2V5LCBzdGFydFJlY29yZCA9IG51bGwsIGVuZFJlY29yZCA9IG51bGwpID0+IHtcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShpbmRleEtleSk7XG5cbiAgY29uc3Qgc3RhcnRTaGFyZE5hbWUgPSAhc3RhcnRSZWNvcmRcbiAgICA/IG51bGxcbiAgICA6IHNoYXJkTmFtZUZyb21LZXkoXG4gICAgICBnZXRJbmRleGVkRGF0YUtleShcbiAgICAgICAgaW5kZXhOb2RlLFxuICAgICAgICBpbmRleEtleSxcbiAgICAgICAgc3RhcnRSZWNvcmQsXG4gICAgICApLFxuICAgICk7XG5cbiAgY29uc3QgZW5kU2hhcmROYW1lID0gIWVuZFJlY29yZFxuICAgID8gbnVsbFxuICAgIDogc2hhcmROYW1lRnJvbUtleShcbiAgICAgIGdldEluZGV4ZWREYXRhS2V5KFxuICAgICAgICBpbmRleE5vZGUsXG4gICAgICAgIGluZGV4S2V5LFxuICAgICAgICBlbmRSZWNvcmQsXG4gICAgICApLFxuICAgICk7XG5cbiAgcmV0dXJuICQoYXdhaXQgZ2V0U2hhcmRNYXAoYXBwLmRhdGFzdG9yZSwgaW5kZXhLZXkpLCBbXG4gICAgZmlsdGVyKGsgPT4gKHN0YXJ0UmVjb3JkID09PSBudWxsIHx8IGsgPj0gc3RhcnRTaGFyZE5hbWUpXG4gICAgICAgICAgICAgICAgICAgICYmIChlbmRSZWNvcmQgPT09IG51bGwgfHwgayA8PSBlbmRTaGFyZE5hbWUpKSxcbiAgICBtYXAoayA9PiBqb2luS2V5KGluZGV4S2V5LCBgJHtrfS5jc3ZgKSksXG4gIF0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGVuc3VyZVNoYXJkTmFtZUlzSW5TaGFyZE1hcCA9IGFzeW5jIChzdG9yZSwgaW5kZXhLZXksIGluZGV4ZWREYXRhS2V5KSA9PiB7XG4gIGNvbnN0IG1hcCA9IGF3YWl0IGdldFNoYXJkTWFwKHN0b3JlLCBpbmRleEtleSk7XG4gIGNvbnN0IHNoYXJkTmFtZSA9IHNoYXJkTmFtZUZyb21LZXkoaW5kZXhlZERhdGFLZXkpO1xuICBpZiAoIWluY2x1ZGVzKHNoYXJkTmFtZSkobWFwKSkge1xuICAgIG1hcC5wdXNoKHNoYXJkTmFtZSk7XG4gICAgYXdhaXQgd3JpdGVTaGFyZE1hcChzdG9yZSwgaW5kZXhLZXksIG1hcCk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBnZXRTaGFyZE1hcCA9IGFzeW5jIChkYXRhc3RvcmUsIGluZGV4S2V5KSA9PiB7XG4gIGNvbnN0IHNoYXJkTWFwS2V5ID0gZ2V0U2hhcmRNYXBLZXkoaW5kZXhLZXkpO1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCBkYXRhc3RvcmUubG9hZEpzb24oc2hhcmRNYXBLZXkpO1xuICB9IGNhdGNoIChfKSB7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oc2hhcmRNYXBLZXksIFtdKTtcbiAgICByZXR1cm4gW107XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCB3cml0ZVNoYXJkTWFwID0gYXN5bmMgKGRhdGFzdG9yZSwgaW5kZXhLZXksIHNoYXJkTWFwKSA9PiBhd2FpdCBkYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgZ2V0U2hhcmRNYXBLZXkoaW5kZXhLZXkpLFxuICBzaGFyZE1hcCxcbik7XG5cbmV4cG9ydCBjb25zdCBnZXRBbGxTaGFyZEtleXMgPSBhc3luYyAoYXBwLCBpbmRleEtleSkgPT4gYXdhaXQgZ2V0U2hhcmRLZXlzSW5SYW5nZShhcHAsIGluZGV4S2V5KTtcblxuZXhwb3J0IGNvbnN0IGdldFNoYXJkTWFwS2V5ID0gaW5kZXhLZXkgPT4gam9pbktleShpbmRleEtleSwgJ3NoYXJkTWFwLmpzb24nKTtcblxuZXhwb3J0IGNvbnN0IGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSA9IGluZGV4S2V5ID0+IGpvaW5LZXkoaW5kZXhLZXksICdpbmRleC5jc3YnKTtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4Rm9sZGVyS2V5ID0gaW5kZXhLZXkgPT4gaW5kZXhLZXk7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVJbmRleEZpbGUgPSBhc3luYyAoZGF0YXN0b3JlLCBpbmRleGVkRGF0YUtleSwgaW5kZXgpID0+IHtcbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4KSkge1xuICAgIGNvbnN0IGluZGV4S2V5ID0gZ2V0UGFyZW50S2V5KGluZGV4ZWREYXRhS2V5KTtcbiAgICBjb25zdCBzaGFyZE1hcCA9IGF3YWl0IGdldFNoYXJkTWFwKGRhdGFzdG9yZSwgaW5kZXhLZXkpO1xuICAgIHNoYXJkTWFwLnB1c2goXG4gICAgICBzaGFyZE5hbWVGcm9tS2V5KGluZGV4ZWREYXRhS2V5KSxcbiAgICApO1xuICAgIGF3YWl0IHdyaXRlU2hhcmRNYXAoZGF0YXN0b3JlLCBpbmRleEtleSwgc2hhcmRNYXApO1xuICB9XG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGaWxlKGluZGV4ZWREYXRhS2V5LCAnJyk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2hhcmROYW1lRnJvbUtleSA9IGtleSA9PiAkKGtleSwgW1xuICBzcGxpdEtleSxcbiAgbGFzdCxcbl0pLnJlcGxhY2UoJy5jc3YnLCAnJyk7XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleEtleV9CYXNlZE9uRGVjZW5kYW50ID0gKGRlY2VuZGFudEtleSwgaW5kZXhOb2RlKSA9PiB7XG4gIGlmIChpc0dsb2JhbEluZGV4KGluZGV4Tm9kZSkpIHsgcmV0dXJuIGAke2luZGV4Tm9kZS5ub2RlS2V5KCl9YDsgfVxuXG4gIGNvbnN0IGluZGV4ZWREYXRhUGFyZW50S2V5ID0gZ2V0QWN0dWFsS2V5T2ZQYXJlbnQoXG4gICAgaW5kZXhOb2RlLnBhcmVudCgpLm5vZGVLZXkoKSxcbiAgICBkZWNlbmRhbnRLZXksXG4gICk7XG5cbiAgcmV0dXJuIGpvaW5LZXkoXG4gICAgaW5kZXhlZERhdGFQYXJlbnRLZXksXG4gICAgaW5kZXhOb2RlLm5hbWUsXG4gICk7XG59O1xuIiwiaW1wb3J0IHtcbiAgaGFzLCBrZXlzLCBtYXAsIG9yZGVyQnksXG4gIGZpbHRlciwgY29uY2F0LCByZXZlcnNlLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgbWFwUmVjb3JkIH0gZnJvbSAnLi9ldmFsdWF0ZSc7XG5pbXBvcnQgeyBjb25zdHJ1Y3RSZWNvcmQgfSBmcm9tICcuLi9yZWNvcmRBcGkvZ2V0TmV3JztcbmltcG9ydCB7IGdldFNhbXBsZUZpZWxkVmFsdWUsIGRldGVjdFR5cGUsIGFsbCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7ICQgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZ2VuZXJhdGVTY2hlbWEgPSAoaGllcmFyY2h5LCBpbmRleE5vZGUpID0+IHtcbiAgY29uc3QgcmVjb3JkTm9kZXMgPSBnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleChoaWVyYXJjaHksIGluZGV4Tm9kZSk7XG4gIGNvbnN0IG1hcHBlZFJlY29yZHMgPSAkKHJlY29yZE5vZGVzLCBbXG4gICAgbWFwKG4gPT4gbWFwUmVjb3JkKGNyZWF0ZVNhbXBsZVJlY29yZChuKSwgaW5kZXhOb2RlKSksXG4gIF0pO1xuXG4gIC8vIGFsd2F5cyBoYXMgcmVjb3JkIGtleSBhbmQgc29ydCBrZXlcbiAgY29uc3Qgc2NoZW1hID0ge1xuICAgIHNvcnRLZXk6IGFsbC5zdHJpbmcsXG4gICAga2V5OiBhbGwuc3RyaW5nLFxuICB9O1xuXG4gIGNvbnN0IGZpZWxkc0hhcyA9IGhhcyhzY2hlbWEpO1xuICBjb25zdCBzZXRGaWVsZCA9IChmaWVsZE5hbWUsIHZhbHVlKSA9PiB7XG4gICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCB0aGlzVHlwZSA9IGRldGVjdFR5cGUodmFsdWUpO1xuICAgIGlmIChmaWVsZHNIYXMoZmllbGROYW1lKSkge1xuICAgICAgaWYgKHNjaGVtYVtmaWVsZE5hbWVdICE9PSB0aGlzVHlwZSkge1xuICAgICAgICBzY2hlbWFbZmllbGROYW1lXSA9IGFsbC5zdHJpbmc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjaGVtYVtmaWVsZE5hbWVdID0gdGhpc1R5cGU7XG4gICAgfVxuICB9O1xuXG4gIGZvciAoY29uc3QgbWFwcGVkUmVjIG9mIG1hcHBlZFJlY29yZHMpIHtcbiAgICBmb3IgKGNvbnN0IGYgaW4gbWFwcGVkUmVjKSB7XG4gICAgICBzZXRGaWVsZChmLCBtYXBwZWRSZWNbZl0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIHJldHVyaW5nIGFuIGFycmF5IG9mIHtuYW1lLCB0eXBlfVxuICByZXR1cm4gJChzY2hlbWEsIFtcbiAgICBrZXlzLFxuICAgIG1hcChrID0+ICh7IG5hbWU6IGssIHR5cGU6IHNjaGVtYVtrXS5uYW1lIH0pKSxcbiAgICBmaWx0ZXIocyA9PiBzLm5hbWUgIT09ICdzb3J0S2V5JyksXG4gICAgb3JkZXJCeSgnbmFtZScsIFsnZGVzYyddKSwgLy8gcmV2ZXJzZSBhcGxoYVxuICAgIGNvbmNhdChbeyBuYW1lOiAnc29ydEtleScsIHR5cGU6IGFsbC5zdHJpbmcubmFtZSB9XSksIC8vIHNvcnRLZXkgb24gZW5kXG4gICAgcmV2ZXJzZSwgLy8gc29ydEtleSBmaXJzdCwgdGhlbiByZXN0IGFyZSBhbHBoYWJldGljYWxcbiAgXSk7XG59O1xuXG5jb25zdCBjcmVhdGVTYW1wbGVSZWNvcmQgPSByZWNvcmROb2RlID0+IGNvbnN0cnVjdFJlY29yZChcbiAgcmVjb3JkTm9kZSxcbiAgZ2V0U2FtcGxlRmllbGRWYWx1ZSxcbiAgcmVjb3JkTm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksXG4pO1xuIiwiZXhwb3J0IGRlZmF1bHQgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOlxuICAgICAgICAgICAgdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDpcbiAgICAgICAgICAgIHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSk7XG4iLCJcbnZhciBsb29rdXAgPSBbXVxudmFyIHJldkxvb2t1cCA9IFtdXG52YXIgQXJyID0gdHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnID8gVWludDhBcnJheSA6IEFycmF5XG52YXIgaW5pdGVkID0gZmFsc2U7XG5mdW5jdGlvbiBpbml0ICgpIHtcbiAgaW5pdGVkID0gdHJ1ZTtcbiAgdmFyIGNvZGUgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLydcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBsb29rdXBbaV0gPSBjb2RlW2ldXG4gICAgcmV2TG9va3VwW2NvZGUuY2hhckNvZGVBdChpKV0gPSBpXG4gIH1cblxuICByZXZMb29rdXBbJy0nLmNoYXJDb2RlQXQoMCldID0gNjJcbiAgcmV2TG9va3VwWydfJy5jaGFyQ29kZUF0KDApXSA9IDYzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0J5dGVBcnJheSAoYjY0KSB7XG4gIGlmICghaW5pdGVkKSB7XG4gICAgaW5pdCgpO1xuICB9XG4gIHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cbiAgaWYgKGxlbiAlIDQgPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0JylcbiAgfVxuXG4gIC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG4gIC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcbiAgLy8gcmVwcmVzZW50IG9uZSBieXRlXG4gIC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuICAvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG4gIHBsYWNlSG9sZGVycyA9IGI2NFtsZW4gLSAyXSA9PT0gJz0nID8gMiA6IGI2NFtsZW4gLSAxXSA9PT0gJz0nID8gMSA6IDBcblxuICAvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcbiAgYXJyID0gbmV3IEFycihsZW4gKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuICAvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG4gIGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gbGVuIC0gNCA6IGxlblxuXG4gIHZhciBMID0gMFxuXG4gIGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxOCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgMTIpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildIDw8IDYpIHwgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAzKV1cbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gMTYpICYgMHhGRlxuICAgIGFycltMKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAyKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA+PiA0KVxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDEwKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCA0KSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA+PiAyKVxuICAgIGFycltMKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcbiAgcmV0dXJuIGxvb2t1cFtudW0gPj4gMTggJiAweDNGXSArIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArIGxvb2t1cFtudW0gPj4gNiAmIDB4M0ZdICsgbG9va3VwW251bSAmIDB4M0ZdXG59XG5cbmZ1bmN0aW9uIGVuY29kZUNodW5rICh1aW50OCwgc3RhcnQsIGVuZCkge1xuICB2YXIgdG1wXG4gIHZhciBvdXRwdXQgPSBbXVxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkgKz0gMykge1xuICAgIHRtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcbiAgICBvdXRwdXQucHVzaCh0cmlwbGV0VG9CYXNlNjQodG1wKSlcbiAgfVxuICByZXR1cm4gb3V0cHV0LmpvaW4oJycpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tQnl0ZUFycmF5ICh1aW50OCkge1xuICBpZiAoIWluaXRlZCkge1xuICAgIGluaXQoKTtcbiAgfVxuICB2YXIgdG1wXG4gIHZhciBsZW4gPSB1aW50OC5sZW5ndGhcbiAgdmFyIGV4dHJhQnl0ZXMgPSBsZW4gJSAzIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG4gIHZhciBvdXRwdXQgPSAnJ1xuICB2YXIgcGFydHMgPSBbXVxuICB2YXIgbWF4Q2h1bmtMZW5ndGggPSAxNjM4MyAvLyBtdXN0IGJlIG11bHRpcGxlIG9mIDNcblxuICAvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4yID0gbGVuIC0gZXh0cmFCeXRlczsgaSA8IGxlbjI7IGkgKz0gbWF4Q2h1bmtMZW5ndGgpIHtcbiAgICBwYXJ0cy5wdXNoKGVuY29kZUNodW5rKHVpbnQ4LCBpLCAoaSArIG1heENodW5rTGVuZ3RoKSA+IGxlbjIgPyBsZW4yIDogKGkgKyBtYXhDaHVua0xlbmd0aCkpKVxuICB9XG5cbiAgLy8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuICBpZiAoZXh0cmFCeXRlcyA9PT0gMSkge1xuICAgIHRtcCA9IHVpbnQ4W2xlbiAtIDFdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMl1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgNCkgJiAweDNGXVxuICAgIG91dHB1dCArPSAnPT0nXG4gIH0gZWxzZSBpZiAoZXh0cmFCeXRlcyA9PT0gMikge1xuICAgIHRtcCA9ICh1aW50OFtsZW4gLSAyXSA8PCA4KSArICh1aW50OFtsZW4gLSAxXSlcbiAgICBvdXRwdXQgKz0gbG9va3VwW3RtcCA+PiAxMF1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPj4gNCkgJiAweDNGXVxuICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA8PCAyKSAmIDB4M0ZdXG4gICAgb3V0cHV0ICs9ICc9J1xuICB9XG5cbiAgcGFydHMucHVzaChvdXRwdXQpXG5cbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiByZWFkIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdyaXRlIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbmV4cG9ydCBkZWZhdWx0IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKGFycikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChhcnIpID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cblxuXG5pbXBvcnQgKiBhcyBiYXNlNjQgZnJvbSAnLi9iYXNlNjQnXG5pbXBvcnQgKiBhcyBpZWVlNzU0IGZyb20gJy4vaWVlZTc1NCdcbmltcG9ydCBpc0FycmF5IGZyb20gJy4vaXNBcnJheSdcblxuZXhwb3J0IHZhciBJTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKG1vc3QgY29tcGF0aWJsZSwgZXZlbiBJRTYpXG4gKlxuICogQnJvd3NlcnMgdGhhdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLCBDaHJvbWUgNyssIFNhZmFyaSA1LjErLFxuICogT3BlcmEgMTEuNissIGlPUyA0LjIrLlxuICpcbiAqIER1ZSB0byB2YXJpb3VzIGJyb3dzZXIgYnVncywgc29tZXRpbWVzIHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24gd2lsbCBiZSB1c2VkIGV2ZW5cbiAqIHdoZW4gdGhlIGJyb3dzZXIgc3VwcG9ydHMgdHlwZWQgYXJyYXlzLlxuICpcbiAqIE5vdGU6XG4gKlxuICogICAtIEZpcmVmb3ggNC0yOSBsYWNrcyBzdXBwb3J0IGZvciBhZGRpbmcgbmV3IHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcyxcbiAqICAgICBTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOC5cbiAqXG4gKiAgIC0gQ2hyb21lIDktMTAgaXMgbWlzc2luZyB0aGUgYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbi5cbiAqXG4gKiAgIC0gSUUxMCBoYXMgYSBicm9rZW4gYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFycmF5cyBvZlxuICogICAgIGluY29ycmVjdCBsZW5ndGggaW4gc29tZSBzaXR1YXRpb25zLlxuXG4gKiBXZSBkZXRlY3QgdGhlc2UgYnVnZ3kgYnJvd3NlcnMgYW5kIHNldCBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgIHRvIGBmYWxzZWAgc28gdGhleVxuICogZ2V0IHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24sIHdoaWNoIGlzIHNsb3dlciBidXQgYmVoYXZlcyBjb3JyZWN0bHkuXG4gKi9cbkJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUID0gZ2xvYmFsLlRZUEVEX0FSUkFZX1NVUFBPUlQgIT09IHVuZGVmaW5lZFxuICA/IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gIDogdHJ1ZVxuXG4vKlxuICogRXhwb3J0IGtNYXhMZW5ndGggYWZ0ZXIgdHlwZWQgYXJyYXkgc3VwcG9ydCBpcyBkZXRlcm1pbmVkLlxuICovXG52YXIgX2tNYXhMZW5ndGggPSBrTWF4TGVuZ3RoKClcbmV4cG9ydCB7X2tNYXhMZW5ndGggYXMga01heExlbmd0aH07XG5mdW5jdGlvbiB0eXBlZEFycmF5U3VwcG9ydCAoKSB7XG4gIHJldHVybiB0cnVlO1xuICAvLyByb2xsdXAgaXNzdWVzXG4gIC8vIHRyeSB7XG4gIC8vICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KDEpXG4gIC8vICAgYXJyLl9fcHJvdG9fXyA9IHtcbiAgLy8gICAgIF9fcHJvdG9fXzogVWludDhBcnJheS5wcm90b3R5cGUsXG4gIC8vICAgICBmb286IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH1cbiAgLy8gICB9XG4gIC8vICAgcmV0dXJuIGFyci5mb28oKSA9PT0gNDIgJiYgLy8gdHlwZWQgYXJyYXkgaW5zdGFuY2VzIGNhbiBiZSBhdWdtZW50ZWRcbiAgLy8gICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAmJiAvLyBjaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgLy8gICAgICAgYXJyLnN1YmFycmF5KDEsIDEpLmJ5dGVMZW5ndGggPT09IDAgLy8gaWUxMCBoYXMgYnJva2VuIGBzdWJhcnJheWBcbiAgLy8gfSBjYXRjaCAoZSkge1xuICAvLyAgIHJldHVybiBmYWxzZVxuICAvLyB9XG59XG5cbmZ1bmN0aW9uIGtNYXhMZW5ndGggKCkge1xuICByZXR1cm4gQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgICA/IDB4N2ZmZmZmZmZcbiAgICA6IDB4M2ZmZmZmZmZcbn1cblxuZnVuY3Rpb24gY3JlYXRlQnVmZmVyICh0aGF0LCBsZW5ndGgpIHtcbiAgaWYgKGtNYXhMZW5ndGgoKSA8IGxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHR5cGVkIGFycmF5IGxlbmd0aCcpXG4gIH1cbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgdGhhdCA9IG5ldyBVaW50OEFycmF5KGxlbmd0aClcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgaWYgKHRoYXQgPT09IG51bGwpIHtcbiAgICAgIHRoYXQgPSBuZXcgQnVmZmVyKGxlbmd0aClcbiAgICB9XG4gICAgdGhhdC5sZW5ndGggPSBsZW5ndGhcbiAgfVxuXG4gIHJldHVybiB0aGF0XG59XG5cbi8qKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBoYXZlIHRoZWlyXG4gKiBwcm90b3R5cGUgY2hhbmdlZCB0byBgQnVmZmVyLnByb3RvdHlwZWAuIEZ1cnRoZXJtb3JlLCBgQnVmZmVyYCBpcyBhIHN1YmNsYXNzIG9mXG4gKiBgVWludDhBcnJheWAsIHNvIHRoZSByZXR1cm5lZCBpbnN0YW5jZXMgd2lsbCBoYXZlIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBtZXRob2RzXG4gKiBhbmQgdGhlIGBVaW50OEFycmF5YCBtZXRob2RzLiBTcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdFxuICogcmV0dXJucyBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBUaGUgYFVpbnQ4QXJyYXlgIHByb3RvdHlwZSByZW1haW5zIHVubW9kaWZpZWQuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1ZmZlciAoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiAhKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICAvLyBDb21tb24gY2FzZS5cbiAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZ09yT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnSWYgZW5jb2RpbmcgaXMgc3BlY2lmaWVkIHRoZW4gdGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBhbGxvY1Vuc2FmZSh0aGlzLCBhcmcpXG4gIH1cbiAgcmV0dXJuIGZyb20odGhpcywgYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTIgLy8gbm90IHVzZWQgYnkgdGhpcyBpbXBsZW1lbnRhdGlvblxuXG4vLyBUT0RPOiBMZWdhY3ksIG5vdCBuZWVkZWQgYW55bW9yZS4gUmVtb3ZlIGluIG5leHQgbWFqb3IgdmVyc2lvbi5cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiBmcm9tICh0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIGEgbnVtYmVyJylcbiAgfVxuXG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0KVxuICB9XG5cbiAgcmV0dXJuIGZyb21PYmplY3QodGhhdCwgdmFsdWUpXG59XG5cbi8qKlxuICogRnVuY3Rpb25hbGx5IGVxdWl2YWxlbnQgdG8gQnVmZmVyKGFyZywgZW5jb2RpbmcpIGJ1dCB0aHJvd3MgYSBUeXBlRXJyb3JcbiAqIGlmIHZhbHVlIGlzIGEgbnVtYmVyLlxuICogQnVmZmVyLmZyb20oc3RyWywgZW5jb2RpbmddKVxuICogQnVmZmVyLmZyb20oYXJyYXkpXG4gKiBCdWZmZXIuZnJvbShidWZmZXIpXG4gKiBCdWZmZXIuZnJvbShhcnJheUJ1ZmZlclssIGJ5dGVPZmZzZXRbLCBsZW5ndGhdXSlcbiAqKi9cbkJ1ZmZlci5mcm9tID0gZnVuY3Rpb24gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGZyb20obnVsbCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gIEJ1ZmZlci5wcm90b3R5cGUuX19wcm90b19fID0gVWludDhBcnJheS5wcm90b3R5cGVcbiAgQnVmZmVyLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXlcbiAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC5zcGVjaWVzICYmXG4gICAgICBCdWZmZXJbU3ltYm9sLnNwZWNpZXNdID09PSBCdWZmZXIpIHtcbiAgICAvLyBGaXggc3ViYXJyYXkoKSBpbiBFUzIwMTYuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvcHVsbC85N1xuICAgIC8vIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIsIFN5bWJvbC5zcGVjaWVzLCB7XG4gICAgLy8gICB2YWx1ZTogbnVsbCxcbiAgICAvLyAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIC8vIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gYXNzZXJ0U2l6ZSAoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBiZSBhIG51bWJlcicpXG4gIH0gZWxzZSBpZiAoc2l6ZSA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgbmVnYXRpdmUnKVxuICB9XG59XG5cbmZ1bmN0aW9uIGFsbG9jICh0aGF0LCBzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIGlmIChzaXplIDw9IDApIHtcbiAgICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpXG4gIH1cbiAgaWYgKGZpbGwgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIE9ubHkgcGF5IGF0dGVudGlvbiB0byBlbmNvZGluZyBpZiBpdCdzIGEgc3RyaW5nLiBUaGlzXG4gICAgLy8gcHJldmVudHMgYWNjaWRlbnRhbGx5IHNlbmRpbmcgaW4gYSBudW1iZXIgdGhhdCB3b3VsZFxuICAgIC8vIGJlIGludGVycHJldHRlZCBhcyBhIHN0YXJ0IG9mZnNldC5cbiAgICByZXR1cm4gdHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJ1xuICAgICAgPyBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSkuZmlsbChmaWxsLCBlbmNvZGluZylcbiAgICAgIDogY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpLmZpbGwoZmlsbClcbiAgfVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBmaWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogYWxsb2Moc2l6ZVssIGZpbGxbLCBlbmNvZGluZ11dKVxuICoqL1xuQnVmZmVyLmFsbG9jID0gZnVuY3Rpb24gKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIHJldHVybiBhbGxvYyhudWxsLCBzaXplLCBmaWxsLCBlbmNvZGluZylcbn1cblxuZnVuY3Rpb24gYWxsb2NVbnNhZmUgKHRoYXQsIHNpemUpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUgPCAwID8gMCA6IGNoZWNrZWQoc2l6ZSkgfCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyArK2kpIHtcbiAgICAgIHRoYXRbaV0gPSAwXG4gICAgfVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbi8qKlxuICogRXF1aXZhbGVudCB0byBCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqICovXG5CdWZmZXIuYWxsb2NVbnNhZmUgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUobnVsbCwgc2l6ZSlcbn1cbi8qKlxuICogRXF1aXZhbGVudCB0byBTbG93QnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZVNsb3cgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUobnVsbCwgc2l6ZSlcbn1cblxuZnVuY3Rpb24gZnJvbVN0cmluZyAodGhhdCwgc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJyB8fCBlbmNvZGluZyA9PT0gJycpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICB9XG5cbiAgaWYgKCFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImVuY29kaW5nXCIgbXVzdCBiZSBhIHZhbGlkIHN0cmluZyBlbmNvZGluZycpXG4gIH1cblxuICB2YXIgbGVuZ3RoID0gYnl0ZUxlbmd0aChzdHJpbmcsIGVuY29kaW5nKSB8IDBcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBsZW5ndGgpXG5cbiAgdmFyIGFjdHVhbCA9IHRoYXQud3JpdGUoc3RyaW5nLCBlbmNvZGluZylcblxuICBpZiAoYWN0dWFsICE9PSBsZW5ndGgpIHtcbiAgICAvLyBXcml0aW5nIGEgaGV4IHN0cmluZywgZm9yIGV4YW1wbGUsIHRoYXQgY29udGFpbnMgaW52YWxpZCBjaGFyYWN0ZXJzIHdpbGxcbiAgICAvLyBjYXVzZSBldmVyeXRoaW5nIGFmdGVyIHRoZSBmaXJzdCBpbnZhbGlkIGNoYXJhY3RlciB0byBiZSBpZ25vcmVkLiAoZS5nLlxuICAgIC8vICdhYnh4Y2QnIHdpbGwgYmUgdHJlYXRlZCBhcyAnYWInKVxuICAgIHRoYXQgPSB0aGF0LnNsaWNlKDAsIGFjdHVhbClcbiAgfVxuXG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUxpa2UgKHRoYXQsIGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGggPCAwID8gMCA6IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICB0aGF0W2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlCdWZmZXIgKHRoYXQsIGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgYXJyYXkuYnl0ZUxlbmd0aCAvLyB0aGlzIHRocm93cyBpZiBgYXJyYXlgIGlzIG5vdCBhIHZhbGlkIEFycmF5QnVmZmVyXG5cbiAgaWYgKGJ5dGVPZmZzZXQgPCAwIHx8IGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0KSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ29mZnNldFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCArIChsZW5ndGggfHwgMCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXFwnbGVuZ3RoXFwnIGlzIG91dCBvZiBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGJ5dGVPZmZzZXQgPT09IHVuZGVmaW5lZCAmJiBsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXkpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0KVxuICB9IGVsc2Uge1xuICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoYXQgPSBhcnJheVxuICAgIHRoYXQuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gYW4gb2JqZWN0IGluc3RhbmNlIG9mIHRoZSBCdWZmZXIgY2xhc3NcbiAgICB0aGF0ID0gZnJvbUFycmF5TGlrZSh0aGF0LCBhcnJheSlcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tT2JqZWN0ICh0aGF0LCBvYmopIHtcbiAgaWYgKGludGVybmFsSXNCdWZmZXIob2JqKSkge1xuICAgIHZhciBsZW4gPSBjaGVja2VkKG9iai5sZW5ndGgpIHwgMFxuICAgIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuKVxuXG4gICAgaWYgKHRoYXQubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhhdFxuICAgIH1cblxuICAgIG9iai5jb3B5KHRoYXQsIDAsIDAsIGxlbilcbiAgICByZXR1cm4gdGhhdFxuICB9XG5cbiAgaWYgKG9iaikge1xuICAgIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICBvYmouYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHx8ICdsZW5ndGgnIGluIG9iaikge1xuICAgICAgaWYgKHR5cGVvZiBvYmoubGVuZ3RoICE9PSAnbnVtYmVyJyB8fCBpc25hbihvYmoubGVuZ3RoKSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIDApXG4gICAgICB9XG4gICAgICByZXR1cm4gZnJvbUFycmF5TGlrZSh0aGF0LCBvYmopXG4gICAgfVxuXG4gICAgaWYgKG9iai50eXBlID09PSAnQnVmZmVyJyAmJiBpc0FycmF5KG9iai5kYXRhKSkge1xuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqLmRhdGEpXG4gICAgfVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksIG9yIGFycmF5LWxpa2Ugb2JqZWN0LicpXG59XG5cbmZ1bmN0aW9uIGNoZWNrZWQgKGxlbmd0aCkge1xuICAvLyBOb3RlOiBjYW5ub3QgdXNlIGBsZW5ndGggPCBrTWF4TGVuZ3RoKClgIGhlcmUgYmVjYXVzZSB0aGF0IGZhaWxzIHdoZW5cbiAgLy8gbGVuZ3RoIGlzIE5hTiAod2hpY2ggaXMgb3RoZXJ3aXNlIGNvZXJjZWQgdG8gemVyby4pXG4gIGlmIChsZW5ndGggPj0ga01heExlbmd0aCgpKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gYWxsb2NhdGUgQnVmZmVyIGxhcmdlciB0aGFuIG1heGltdW0gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ3NpemU6IDB4JyArIGtNYXhMZW5ndGgoKS50b1N0cmluZygxNikgKyAnIGJ5dGVzJylcbiAgfVxuICByZXR1cm4gbGVuZ3RoIHwgMFxufVxuXG5leHBvcnQgZnVuY3Rpb24gU2xvd0J1ZmZlciAobGVuZ3RoKSB7XG4gIGlmICgrbGVuZ3RoICE9IGxlbmd0aCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuICAgIGxlbmd0aCA9IDBcbiAgfVxuICByZXR1cm4gQnVmZmVyLmFsbG9jKCtsZW5ndGgpXG59XG5CdWZmZXIuaXNCdWZmZXIgPSBpc0J1ZmZlcjtcbmZ1bmN0aW9uIGludGVybmFsSXNCdWZmZXIgKGIpIHtcbiAgcmV0dXJuICEhKGIgIT0gbnVsbCAmJiBiLl9pc0J1ZmZlcilcbn1cblxuQnVmZmVyLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlIChhLCBiKSB7XG4gIGlmICghaW50ZXJuYWxJc0J1ZmZlcihhKSB8fCAhaW50ZXJuYWxJc0J1ZmZlcihiKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyBtdXN0IGJlIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGEgPT09IGIpIHJldHVybiAwXG5cbiAgdmFyIHggPSBhLmxlbmd0aFxuICB2YXIgeSA9IGIubGVuZ3RoXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV1cbiAgICAgIHkgPSBiW2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiBpc0VuY29kaW5nIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdsYXRpbjEnOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdCAobGlzdCwgbGVuZ3RoKSB7XG4gIGlmICghaXNBcnJheShsaXN0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gIH1cblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gQnVmZmVyLmFsbG9jKDApXG4gIH1cblxuICB2YXIgaVxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBsZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWZmZXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUobGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgIHZhciBidWYgPSBsaXN0W2ldXG4gICAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKGJ1ZikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gICAgfVxuICAgIGJ1Zi5jb3B5KGJ1ZmZlciwgcG9zKVxuICAgIHBvcyArPSBidWYubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZmZlclxufVxuXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmIChpbnRlcm5hbElzQnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBBcnJheUJ1ZmZlci5pc1ZpZXcgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIChBcnJheUJ1ZmZlci5pc1ZpZXcoc3RyaW5nKSB8fCBzdHJpbmcgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikpIHtcbiAgICByZXR1cm4gc3RyaW5nLmJ5dGVMZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICBzdHJpbmcgPSAnJyArIHN0cmluZ1xuICB9XG5cbiAgdmFyIGxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKGxlbiA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBVc2UgYSBmb3IgbG9vcCB0byBhdm9pZCByZWN1cnNpb25cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGVuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiBsZW4gKiAyXG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gbGVuID4+PiAxXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGggLy8gYXNzdW1lIHV0ZjhcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuXG5mdW5jdGlvbiBzbG93VG9TdHJpbmcgKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG5cbiAgLy8gTm8gbmVlZCB0byB2ZXJpZnkgdGhhdCBcInRoaXMubGVuZ3RoIDw9IE1BWF9VSU5UMzJcIiBzaW5jZSBpdCdzIGEgcmVhZC1vbmx5XG4gIC8vIHByb3BlcnR5IG9mIGEgdHlwZWQgYXJyYXkuXG5cbiAgLy8gVGhpcyBiZWhhdmVzIG5laXRoZXIgbGlrZSBTdHJpbmcgbm9yIFVpbnQ4QXJyYXkgaW4gdGhhdCB3ZSBzZXQgc3RhcnQvZW5kXG4gIC8vIHRvIHRoZWlyIHVwcGVyL2xvd2VyIGJvdW5kcyBpZiB0aGUgdmFsdWUgcGFzc2VkIGlzIG91dCBvZiByYW5nZS5cbiAgLy8gdW5kZWZpbmVkIGlzIGhhbmRsZWQgc3BlY2lhbGx5IGFzIHBlciBFQ01BLTI2MiA2dGggRWRpdGlvbixcbiAgLy8gU2VjdGlvbiAxMy4zLjMuNyBSdW50aW1lIFNlbWFudGljczogS2V5ZWRCaW5kaW5nSW5pdGlhbGl6YXRpb24uXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkIHx8IHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIC8vIFJldHVybiBlYXJseSBpZiBzdGFydCA+IHRoaXMubGVuZ3RoLiBEb25lIGhlcmUgdG8gcHJldmVudCBwb3RlbnRpYWwgdWludDMyXG4gIC8vIGNvZXJjaW9uIGZhaWwgYmVsb3cuXG4gIGlmIChzdGFydCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVuZCA8PSAwKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICAvLyBGb3JjZSBjb2Vyc2lvbiB0byB1aW50MzIuIFRoaXMgd2lsbCBhbHNvIGNvZXJjZSBmYWxzZXkvTmFOIHZhbHVlcyB0byAwLlxuICBlbmQgPj4+PSAwXG4gIHN0YXJ0ID4+Pj0gMFxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdXRmMTZsZVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9IChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vLyBUaGUgcHJvcGVydHkgaXMgdXNlZCBieSBgQnVmZmVyLmlzQnVmZmVyYCBhbmQgYGlzLWJ1ZmZlcmAgKGluIFNhZmFyaSA1LTcpIHRvIGRldGVjdFxuLy8gQnVmZmVyIGluc3RhbmNlcy5cbkJ1ZmZlci5wcm90b3R5cGUuX2lzQnVmZmVyID0gdHJ1ZVxuXG5mdW5jdGlvbiBzd2FwIChiLCBuLCBtKSB7XG4gIHZhciBpID0gYltuXVxuICBiW25dID0gYlttXVxuICBiW21dID0gaVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAxNiA9IGZ1bmN0aW9uIHN3YXAxNiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgMiAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMTYtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDEpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMzIgPSBmdW5jdGlvbiBzd2FwMzIgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDQgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDMyLWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAzKVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyAyKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDY0ID0gZnVuY3Rpb24gc3dhcDY0ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA4ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA2NC1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA4KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgNylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgNilcbiAgICBzd2FwKHRoaXMsIGkgKyAyLCBpICsgNSlcbiAgICBzd2FwKHRoaXMsIGkgKyAzLCBpICsgNClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGggfCAwXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAnJ1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCAwLCBsZW5ndGgpXG4gIHJldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAoYikge1xuICBpZiAoIWludGVybmFsSXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIHRydWVcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpID09PSAwXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QgKCkge1xuICB2YXIgc3RyID0gJydcbiAgdmFyIG1heCA9IElOU1BFQ1RfTUFYX0JZVEVTXG4gIGlmICh0aGlzLmxlbmd0aCA+IDApIHtcbiAgICBzdHIgPSB0aGlzLnRvU3RyaW5nKCdoZXgnLCAwLCBtYXgpLm1hdGNoKC8uezJ9L2cpLmpvaW4oJyAnKVxuICAgIGlmICh0aGlzLmxlbmd0aCA+IG1heCkgc3RyICs9ICcgLi4uICdcbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIHN0ciArICc+J1xufVxuXG5CdWZmZXIucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlICh0YXJnZXQsIHN0YXJ0LCBlbmQsIHRoaXNTdGFydCwgdGhpc0VuZCkge1xuICBpZiAoIWludGVybmFsSXNCdWZmZXIodGFyZ2V0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICB9XG5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSB0YXJnZXQgPyB0YXJnZXQubGVuZ3RoIDogMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNTdGFydCA9IDBcbiAgfVxuICBpZiAodGhpc0VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc0VuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IGVuZCA+IHRhcmdldC5sZW5ndGggfHwgdGhpc1N0YXJ0IDwgMCB8fCB0aGlzRW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCAmJiBzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCkge1xuICAgIHJldHVybiAtMVxuICB9XG4gIGlmIChzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgc3RhcnQgPj4+PSAwXG4gIGVuZCA+Pj49IDBcbiAgdGhpc1N0YXJ0ID4+Pj0gMFxuICB0aGlzRW5kID4+Pj0gMFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQpIHJldHVybiAwXG5cbiAgdmFyIHggPSB0aGlzRW5kIC0gdGhpc1N0YXJ0XG4gIHZhciB5ID0gZW5kIC0gc3RhcnRcbiAgdmFyIGxlbiA9IE1hdGgubWluKHgsIHkpXG5cbiAgdmFyIHRoaXNDb3B5ID0gdGhpcy5zbGljZSh0aGlzU3RhcnQsIHRoaXNFbmQpXG4gIHZhciB0YXJnZXRDb3B5ID0gdGFyZ2V0LnNsaWNlKHN0YXJ0LCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIGlmICh0aGlzQ29weVtpXSAhPT0gdGFyZ2V0Q29weVtpXSkge1xuICAgICAgeCA9IHRoaXNDb3B5W2ldXG4gICAgICB5ID0gdGFyZ2V0Q29weVtpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbi8vIEZpbmRzIGVpdGhlciB0aGUgZmlyc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0ID49IGBieXRlT2Zmc2V0YCxcbi8vIE9SIHRoZSBsYXN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA8PSBgYnl0ZU9mZnNldGAuXG4vL1xuLy8gQXJndW1lbnRzOlxuLy8gLSBidWZmZXIgLSBhIEJ1ZmZlciB0byBzZWFyY2hcbi8vIC0gdmFsIC0gYSBzdHJpbmcsIEJ1ZmZlciwgb3IgbnVtYmVyXG4vLyAtIGJ5dGVPZmZzZXQgLSBhbiBpbmRleCBpbnRvIGBidWZmZXJgOyB3aWxsIGJlIGNsYW1wZWQgdG8gYW4gaW50MzJcbi8vIC0gZW5jb2RpbmcgLSBhbiBvcHRpb25hbCBlbmNvZGluZywgcmVsZXZhbnQgaXMgdmFsIGlzIGEgc3RyaW5nXG4vLyAtIGRpciAtIHRydWUgZm9yIGluZGV4T2YsIGZhbHNlIGZvciBsYXN0SW5kZXhPZlxuZnVuY3Rpb24gYmlkaXJlY3Rpb25hbEluZGV4T2YgKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIC8vIEVtcHR5IGJ1ZmZlciBtZWFucyBubyBtYXRjaFxuICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXRcbiAgaWYgKHR5cGVvZiBieXRlT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gYnl0ZU9mZnNldFxuICAgIGJ5dGVPZmZzZXQgPSAwXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIHtcbiAgICBieXRlT2Zmc2V0ID0gMHg3ZmZmZmZmZlxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkge1xuICAgIGJ5dGVPZmZzZXQgPSAtMHg4MDAwMDAwMFxuICB9XG4gIGJ5dGVPZmZzZXQgPSArYnl0ZU9mZnNldCAgLy8gQ29lcmNlIHRvIE51bWJlci5cbiAgaWYgKGlzTmFOKGJ5dGVPZmZzZXQpKSB7XG4gICAgLy8gYnl0ZU9mZnNldDogaXQgaXQncyB1bmRlZmluZWQsIG51bGwsIE5hTiwgXCJmb29cIiwgZXRjLCBzZWFyY2ggd2hvbGUgYnVmZmVyXG4gICAgYnl0ZU9mZnNldCA9IGRpciA/IDAgOiAoYnVmZmVyLmxlbmd0aCAtIDEpXG4gIH1cblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldDogbmVnYXRpdmUgb2Zmc2V0cyBzdGFydCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICBpZiAoYnl0ZU9mZnNldCA8IDApIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoICsgYnl0ZU9mZnNldFxuICBpZiAoYnl0ZU9mZnNldCA+PSBidWZmZXIubGVuZ3RoKSB7XG4gICAgaWYgKGRpcikgcmV0dXJuIC0xXG4gICAgZWxzZSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCAtIDFcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgMCkge1xuICAgIGlmIChkaXIpIGJ5dGVPZmZzZXQgPSAwXG4gICAgZWxzZSByZXR1cm4gLTFcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB2YWxcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsID0gQnVmZmVyLmZyb20odmFsLCBlbmNvZGluZylcbiAgfVxuXG4gIC8vIEZpbmFsbHksIHNlYXJjaCBlaXRoZXIgaW5kZXhPZiAoaWYgZGlyIGlzIHRydWUpIG9yIGxhc3RJbmRleE9mXG4gIGlmIChpbnRlcm5hbElzQnVmZmVyKHZhbCkpIHtcbiAgICAvLyBTcGVjaWFsIGNhc2U6IGxvb2tpbmcgZm9yIGVtcHR5IHN0cmluZy9idWZmZXIgYWx3YXlzIGZhaWxzXG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMHhGRiAvLyBTZWFyY2ggZm9yIGEgYnl0ZSB2YWx1ZSBbMC0yNTVdXG4gICAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmXG4gICAgICAgIHR5cGVvZiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAoZGlyKSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIFsgdmFsIF0sIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCd2YWwgbXVzdCBiZSBzdHJpbmcsIG51bWJlciBvciBCdWZmZXInKVxufVxuXG5mdW5jdGlvbiBhcnJheUluZGV4T2YgKGFyciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIHZhciBpbmRleFNpemUgPSAxXG4gIHZhciBhcnJMZW5ndGggPSBhcnIubGVuZ3RoXG4gIHZhciB2YWxMZW5ndGggPSB2YWwubGVuZ3RoXG5cbiAgaWYgKGVuY29kaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgIGlmIChlbmNvZGluZyA9PT0gJ3VjczInIHx8IGVuY29kaW5nID09PSAndWNzLTInIHx8XG4gICAgICAgIGVuY29kaW5nID09PSAndXRmMTZsZScgfHwgZW5jb2RpbmcgPT09ICd1dGYtMTZsZScpIHtcbiAgICAgIGlmIChhcnIubGVuZ3RoIDwgMiB8fCB2YWwubGVuZ3RoIDwgMikge1xuICAgICAgICByZXR1cm4gLTFcbiAgICAgIH1cbiAgICAgIGluZGV4U2l6ZSA9IDJcbiAgICAgIGFyckxlbmd0aCAvPSAyXG4gICAgICB2YWxMZW5ndGggLz0gMlxuICAgICAgYnl0ZU9mZnNldCAvPSAyXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZCAoYnVmLCBpKSB7XG4gICAgaWYgKGluZGV4U2l6ZSA9PT0gMSkge1xuICAgICAgcmV0dXJuIGJ1ZltpXVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYnVmLnJlYWRVSW50MTZCRShpICogaW5kZXhTaXplKVxuICAgIH1cbiAgfVxuXG4gIHZhciBpXG4gIGlmIChkaXIpIHtcbiAgICB2YXIgZm91bmRJbmRleCA9IC0xXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA8IGFyckxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocmVhZChhcnIsIGkpID09PSByZWFkKHZhbCwgZm91bmRJbmRleCA9PT0gLTEgPyAwIDogaSAtIGZvdW5kSW5kZXgpKSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ID09PSAtMSkgZm91bmRJbmRleCA9IGlcbiAgICAgICAgaWYgKGkgLSBmb3VuZEluZGV4ICsgMSA9PT0gdmFsTGVuZ3RoKSByZXR1cm4gZm91bmRJbmRleCAqIGluZGV4U2l6ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggIT09IC0xKSBpIC09IGkgLSBmb3VuZEluZGV4XG4gICAgICAgIGZvdW5kSW5kZXggPSAtMVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYnl0ZU9mZnNldCArIHZhbExlbmd0aCA+IGFyckxlbmd0aCkgYnl0ZU9mZnNldCA9IGFyckxlbmd0aCAtIHZhbExlbmd0aFxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YXIgZm91bmQgPSB0cnVlXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZhbExlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmIChyZWFkKGFyciwgaSArIGopICE9PSByZWFkKHZhbCwgaikpIHtcbiAgICAgICAgICBmb3VuZCA9IGZhbHNlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZvdW5kKSByZXR1cm4gaVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXMgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIHRoaXMuaW5kZXhPZih2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSAhPT0gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gaW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgdHJ1ZSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uIGxhc3RJbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBmYWxzZSlcbn1cblxuZnVuY3Rpb24gaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAoc3RyTGVuICUgMiAhPT0gMCkgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHBhcnNlZCA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBpZiAoaXNOYU4ocGFyc2VkKSkgcmV0dXJuIGlcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGxhdGluMVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGFzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gdWNzMldyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIHdyaXRlIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nKVxuICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIG9mZnNldFssIGxlbmd0aF1bLCBlbmNvZGluZ10pXG4gIH0gZWxzZSBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgICBpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgbGVuZ3RoID0gbGVuZ3RoIHwgMFxuICAgICAgaWYgKGVuY29kaW5nID09PSB1bmRlZmluZWQpIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIC8vIGxlZ2FjeSB3cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aCkgLSByZW1vdmUgaW4gdjAuMTNcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnQnVmZmVyLndyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldFssIGxlbmd0aF0pIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQnXG4gICAgKVxuICB9XG5cbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCB8fCBsZW5ndGggPiByZW1haW5pbmcpIGxlbmd0aCA9IHJlbWFpbmluZ1xuXG4gIGlmICgoc3RyaW5nLmxlbmd0aCA+IDAgJiYgKGxlbmd0aCA8IDAgfHwgb2Zmc2V0IDwgMCkpIHx8IG9mZnNldCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gd3JpdGUgb3V0c2lkZSBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGF0aW4xV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgLy8gV2FybmluZzogbWF4TGVuZ3RoIG5vdCB0YWtlbiBpbnRvIGFjY291bnQgaW4gYmFzZTY0V3JpdGVcbiAgICAgICAgcmV0dXJuIGJhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1Y3MyV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG5mdW5jdGlvbiBiYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuICB2YXIgcmVzID0gW11cblxuICB2YXIgaSA9IHN0YXJ0XG4gIHdoaWxlIChpIDwgZW5kKSB7XG4gICAgdmFyIGZpcnN0Qnl0ZSA9IGJ1ZltpXVxuICAgIHZhciBjb2RlUG9pbnQgPSBudWxsXG4gICAgdmFyIGJ5dGVzUGVyU2VxdWVuY2UgPSAoZmlyc3RCeXRlID4gMHhFRikgPyA0XG4gICAgICA6IChmaXJzdEJ5dGUgPiAweERGKSA/IDNcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4QkYpID8gMlxuICAgICAgOiAxXG5cbiAgICBpZiAoaSArIGJ5dGVzUGVyU2VxdWVuY2UgPD0gZW5kKSB7XG4gICAgICB2YXIgc2Vjb25kQnl0ZSwgdGhpcmRCeXRlLCBmb3VydGhCeXRlLCB0ZW1wQ29kZVBvaW50XG5cbiAgICAgIHN3aXRjaCAoYnl0ZXNQZXJTZXF1ZW5jZSkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgaWYgKGZpcnN0Qnl0ZSA8IDB4ODApIHtcbiAgICAgICAgICAgIGNvZGVQb2ludCA9IGZpcnN0Qnl0ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweDFGKSA8PCAweDYgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0YpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHhDIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAodGhpcmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3RkYgJiYgKHRlbXBDb2RlUG9pbnQgPCAweEQ4MDAgfHwgdGVtcENvZGVQb2ludCA+IDB4REZGRikpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgZm91cnRoQnl0ZSA9IGJ1ZltpICsgM11cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKGZvdXJ0aEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4MTIgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4QyB8ICh0aGlyZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAoZm91cnRoQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4RkZGRiAmJiB0ZW1wQ29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29kZVBvaW50ID09PSBudWxsKSB7XG4gICAgICAvLyB3ZSBkaWQgbm90IGdlbmVyYXRlIGEgdmFsaWQgY29kZVBvaW50IHNvIGluc2VydCBhXG4gICAgICAvLyByZXBsYWNlbWVudCBjaGFyIChVK0ZGRkQpIGFuZCBhZHZhbmNlIG9ubHkgMSBieXRlXG4gICAgICBjb2RlUG9pbnQgPSAweEZGRkRcbiAgICAgIGJ5dGVzUGVyU2VxdWVuY2UgPSAxXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPiAweEZGRkYpIHtcbiAgICAgIC8vIGVuY29kZSB0byB1dGYxNiAoc3Vycm9nYXRlIHBhaXIgZGFuY2UpXG4gICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMFxuICAgICAgcmVzLnB1c2goY29kZVBvaW50ID4+PiAxMCAmIDB4M0ZGIHwgMHhEODAwKVxuICAgICAgY29kZVBvaW50ID0gMHhEQzAwIHwgY29kZVBvaW50ICYgMHgzRkZcbiAgICB9XG5cbiAgICByZXMucHVzaChjb2RlUG9pbnQpXG4gICAgaSArPSBieXRlc1BlclNlcXVlbmNlXG4gIH1cblxuICByZXR1cm4gZGVjb2RlQ29kZVBvaW50c0FycmF5KHJlcylcbn1cblxuLy8gQmFzZWQgb24gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjI3NDcyNzIvNjgwNzQyLCB0aGUgYnJvd3NlciB3aXRoXG4vLyB0aGUgbG93ZXN0IGxpbWl0IGlzIENocm9tZSwgd2l0aCAweDEwMDAwIGFyZ3MuXG4vLyBXZSBnbyAxIG1hZ25pdHVkZSBsZXNzLCBmb3Igc2FmZXR5XG52YXIgTUFYX0FSR1VNRU5UU19MRU5HVEggPSAweDEwMDBcblxuZnVuY3Rpb24gZGVjb2RlQ29kZVBvaW50c0FycmF5IChjb2RlUG9pbnRzKSB7XG4gIHZhciBsZW4gPSBjb2RlUG9pbnRzLmxlbmd0aFxuICBpZiAobGVuIDw9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjb2RlUG9pbnRzKSAvLyBhdm9pZCBleHRyYSBzbGljZSgpXG4gIH1cblxuICAvLyBEZWNvZGUgaW4gY2h1bmtzIHRvIGF2b2lkIFwiY2FsbCBzdGFjayBzaXplIGV4Y2VlZGVkXCIuXG4gIHZhciByZXMgPSAnJ1xuICB2YXIgaSA9IDBcbiAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcbiAgICAgIFN0cmluZyxcbiAgICAgIGNvZGVQb2ludHMuc2xpY2UoaSwgaSArPSBNQVhfQVJHVU1FTlRTX0xFTkdUSClcbiAgICApXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSAmIDB4N0YpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBsYXRpbjFTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBoZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSArIDFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIHNsaWNlIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IH5+c3RhcnRcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB+fmVuZFxuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCArPSBsZW5cbiAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgfSBlbHNlIGlmIChzdGFydCA+IGxlbikge1xuICAgIHN0YXJ0ID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5cbiAgICBpZiAoZW5kIDwgMCkgZW5kID0gMFxuICB9IGVsc2UgaWYgKGVuZCA+IGxlbikge1xuICAgIGVuZCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIHZhciBuZXdCdWZcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgbmV3QnVmID0gdGhpcy5zdWJhcnJheShzdGFydCwgZW5kKVxuICAgIG5ld0J1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgKytpKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50TEUgPSBmdW5jdGlvbiByZWFkVUludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50QkUgPSBmdW5jdGlvbiByZWFkVUludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuICB9XG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXVxuICB2YXIgbXVsID0gMVxuICB3aGlsZSAoYnl0ZUxlbmd0aCA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gcmVhZFVJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiByZWFkVUludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDgpIHwgdGhpc1tvZmZzZXQgKyAxXVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAoKHRoaXNbb2Zmc2V0XSkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpKSArXG4gICAgICAodGhpc1tvZmZzZXQgKyAzXSAqIDB4MTAwMDAwMClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiByZWFkVUludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSAqIDB4MTAwMDAwMCkgK1xuICAgICgodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICB0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRMRSA9IGZ1bmN0aW9uIHJlYWRJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRCRSA9IGZ1bmN0aW9uIHJlYWRJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aFxuICB2YXIgbXVsID0gMVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWldXG4gIHdoaWxlIChpID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0taV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gcmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgaWYgKCEodGhpc1tvZmZzZXRdICYgMHg4MCkpIHJldHVybiAodGhpc1tvZmZzZXRdKVxuICByZXR1cm4gKCgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiByZWFkSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAxXSB8ICh0aGlzW29mZnNldF0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gcmVhZEludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDNdIDw8IDI0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gcmVhZEludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCAyNCkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gcmVhZEZsb2F0TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gcmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiByZWFkRG91YmxlTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghaW50ZXJuYWxJc0J1ZmZlcihidWYpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImJ1ZmZlclwiIGFyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXIgaW5zdGFuY2UnKVxuICBpZiAodmFsdWUgPiBtYXggfHwgdmFsdWUgPCBtaW4pIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgaXMgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlVUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlVUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVVSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweGZmLCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUpXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbmZ1bmN0aW9uIG9iamVjdFdyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbikge1xuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDIpOyBpIDwgajsgKytpKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbmZ1bmN0aW9uIG9iamVjdFdyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbikge1xuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCA0KTsgaSA8IGo7ICsraSkge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSA+Pj4gKGxpdHRsZUVuZGlhbiA/IGkgOiAzIC0gaSkgKiA4KSAmIDB4ZmZcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSAwXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSAtIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSArIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4N2YsIC0weDgwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUpXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5mdW5jdGlvbiBjaGVja0lFRUU3NTQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuZnVuY3Rpb24gd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA0LCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiB3cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA4LCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkgKHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldFN0YXJ0ID49IHRhcmdldC5sZW5ndGgpIHRhcmdldFN0YXJ0ID0gdGFyZ2V0Lmxlbmd0aFxuICBpZiAoIXRhcmdldFN0YXJ0KSB0YXJnZXRTdGFydCA9IDBcbiAgaWYgKGVuZCA+IDAgJiYgZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMFxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCB0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGlmICh0YXJnZXRTdGFydCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIH1cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBpZiAoZW5kIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgPCBlbmQgLSBzdGFydCkge1xuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCArIHN0YXJ0XG4gIH1cblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcbiAgdmFyIGlcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0ICYmIHN0YXJ0IDwgdGFyZ2V0U3RhcnQgJiYgdGFyZ2V0U3RhcnQgPCBlbmQpIHtcbiAgICAvLyBkZXNjZW5kaW5nIGNvcHkgZnJvbSBlbmRcbiAgICBmb3IgKGkgPSBsZW4gLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSBpZiAobGVuIDwgMTAwMCB8fCAhQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBhc2NlbmRpbmcgY29weSBmcm9tIHN0YXJ0XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBVaW50OEFycmF5LnByb3RvdHlwZS5zZXQuY2FsbChcbiAgICAgIHRhcmdldCxcbiAgICAgIHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSxcbiAgICAgIHRhcmdldFN0YXJ0XG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIGxlblxufVxuXG4vLyBVc2FnZTpcbi8vICAgIGJ1ZmZlci5maWxsKG51bWJlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoYnVmZmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChzdHJpbmdbLCBvZmZzZXRbLCBlbmRdXVssIGVuY29kaW5nXSlcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uIGZpbGwgKHZhbCwgc3RhcnQsIGVuZCwgZW5jb2RpbmcpIHtcbiAgLy8gSGFuZGxlIHN0cmluZyBjYXNlczpcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHR5cGVvZiBzdGFydCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gc3RhcnRcbiAgICAgIHN0YXJ0ID0gMFxuICAgICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBlbmQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IGVuZFxuICAgICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgICB9XG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZhciBjb2RlID0gdmFsLmNoYXJDb2RlQXQoMClcbiAgICAgIGlmIChjb2RlIDwgMjU2KSB7XG4gICAgICAgIHZhbCA9IGNvZGVcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGVuY29kaW5nICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZW5jb2RpbmcgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnICYmICFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAyNTVcbiAgfVxuXG4gIC8vIEludmFsaWQgcmFuZ2VzIGFyZSBub3Qgc2V0IHRvIGEgZGVmYXVsdCwgc28gY2FuIHJhbmdlIGNoZWNrIGVhcmx5LlxuICBpZiAoc3RhcnQgPCAwIHx8IHRoaXMubGVuZ3RoIDwgc3RhcnQgfHwgdGhpcy5sZW5ndGggPCBlbmQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignT3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgc3RhcnQgPSBzdGFydCA+Pj4gMFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IHRoaXMubGVuZ3RoIDogZW5kID4+PiAwXG5cbiAgaWYgKCF2YWwpIHZhbCA9IDBcblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgICB0aGlzW2ldID0gdmFsXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBieXRlcyA9IGludGVybmFsSXNCdWZmZXIodmFsKVxuICAgICAgPyB2YWxcbiAgICAgIDogdXRmOFRvQnl0ZXMobmV3IEJ1ZmZlcih2YWwsIGVuY29kaW5nKS50b1N0cmluZygpKVxuICAgIHZhciBsZW4gPSBieXRlcy5sZW5ndGhcbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5kIC0gc3RhcnQ7ICsraSkge1xuICAgICAgdGhpc1tpICsgc3RhcnRdID0gYnl0ZXNbaSAlIGxlbl1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbnZhciBJTlZBTElEX0JBU0U2NF9SRSA9IC9bXitcXC8wLTlBLVphLXotX10vZ1xuXG5mdW5jdGlvbiBiYXNlNjRjbGVhbiAoc3RyKSB7XG4gIC8vIE5vZGUgc3RyaXBzIG91dCBpbnZhbGlkIGNoYXJhY3RlcnMgbGlrZSBcXG4gYW5kIFxcdCBmcm9tIHRoZSBzdHJpbmcsIGJhc2U2NC1qcyBkb2VzIG5vdFxuICBzdHIgPSBzdHJpbmd0cmltKHN0cikucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgY29udmVydHMgc3RyaW5ncyB3aXRoIGxlbmd0aCA8IDIgdG8gJydcbiAgaWYgKHN0ci5sZW5ndGggPCAyKSByZXR1cm4gJydcbiAgLy8gTm9kZSBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgYmFzZTY0IHN0cmluZ3MgKG1pc3NpbmcgdHJhaWxpbmcgPT09KSwgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHdoaWxlIChzdHIubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgIHN0ciA9IHN0ciArICc9J1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyaW5nLCB1bml0cykge1xuICB1bml0cyA9IHVuaXRzIHx8IEluZmluaXR5XG4gIHZhciBjb2RlUG9pbnRcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgdmFyIGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIHZhciBieXRlcyA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvZGVQb2ludCA9IHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cbiAgICAvLyBpcyBzdXJyb2dhdGUgY29tcG9uZW50XG4gICAgaWYgKGNvZGVQb2ludCA+IDB4RDdGRiAmJiBjb2RlUG9pbnQgPCAweEUwMDApIHtcbiAgICAgIC8vIGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoIWxlYWRTdXJyb2dhdGUpIHtcbiAgICAgICAgLy8gbm8gbGVhZCB5ZXRcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+IDB4REJGRikge1xuICAgICAgICAgIC8vIHVuZXhwZWN0ZWQgdHJhaWxcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKGkgKyAxID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAvLyB1bnBhaXJlZCBsZWFkXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkIGxlYWRcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIDIgbGVhZHMgaW4gYSByb3dcbiAgICAgIGlmIChjb2RlUG9pbnQgPCAweERDMDApIHtcbiAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gdmFsaWQgc3Vycm9nYXRlIHBhaXJcbiAgICAgIGNvZGVQb2ludCA9IChsZWFkU3Vycm9nYXRlIC0gMHhEODAwIDw8IDEwIHwgY29kZVBvaW50IC0gMHhEQzAwKSArIDB4MTAwMDBcbiAgICB9IGVsc2UgaWYgKGxlYWRTdXJyb2dhdGUpIHtcbiAgICAgIC8vIHZhbGlkIGJtcCBjaGFyLCBidXQgbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgIH1cblxuICAgIGxlYWRTdXJyb2dhdGUgPSBudWxsXG5cbiAgICAvLyBlbmNvZGUgdXRmOFxuICAgIGlmIChjb2RlUG9pbnQgPCAweDgwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDEpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goY29kZVBvaW50KVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHg4MDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiB8IDB4QzAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDMpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgfCAweEUwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSA0KSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHgxMiB8IDB4RjAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIsIHVuaXRzKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KGJhc2U2NGNsZWFuKHN0cikpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKSBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGlzbmFuICh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gdmFsIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2VsZi1jb21wYXJlXG59XG5cblxuLy8gdGhlIGZvbGxvd2luZyBpcyBmcm9tIGlzLWJ1ZmZlciwgYWxzbyBieSBGZXJvc3MgQWJvdWtoYWRpamVoIGFuZCB3aXRoIHNhbWUgbGlzZW5jZVxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxuZXhwb3J0IGZ1bmN0aW9uIGlzQnVmZmVyKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgKCEhb2JqLl9pc0J1ZmZlciB8fCBpc0Zhc3RCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSlcbn1cblxuZnVuY3Rpb24gaXNGYXN0QnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNGYXN0QnVmZmVyKG9iai5zbGljZSgwLCAwKSlcbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge0J1ZmZlcn0gZnJvbSAnYnVmZmVyJztcbnZhciBpc0J1ZmZlckVuY29kaW5nID0gQnVmZmVyLmlzRW5jb2RpbmdcbiAgfHwgZnVuY3Rpb24oZW5jb2RpbmcpIHtcbiAgICAgICBzd2l0Y2ggKGVuY29kaW5nICYmIGVuY29kaW5nLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgIGNhc2UgJ2hleCc6IGNhc2UgJ3V0ZjgnOiBjYXNlICd1dGYtOCc6IGNhc2UgJ2FzY2lpJzogY2FzZSAnYmluYXJ5JzogY2FzZSAnYmFzZTY0JzogY2FzZSAndWNzMic6IGNhc2UgJ3Vjcy0yJzogY2FzZSAndXRmMTZsZSc6IGNhc2UgJ3V0Zi0xNmxlJzogY2FzZSAncmF3JzogcmV0dXJuIHRydWU7XG4gICAgICAgICBkZWZhdWx0OiByZXR1cm4gZmFsc2U7XG4gICAgICAgfVxuICAgICB9XG5cblxuZnVuY3Rpb24gYXNzZXJ0RW5jb2RpbmcoZW5jb2RpbmcpIHtcbiAgaWYgKGVuY29kaW5nICYmICFpc0J1ZmZlckVuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKTtcbiAgfVxufVxuXG4vLyBTdHJpbmdEZWNvZGVyIHByb3ZpZGVzIGFuIGludGVyZmFjZSBmb3IgZWZmaWNpZW50bHkgc3BsaXR0aW5nIGEgc2VyaWVzIG9mXG4vLyBidWZmZXJzIGludG8gYSBzZXJpZXMgb2YgSlMgc3RyaW5ncyB3aXRob3V0IGJyZWFraW5nIGFwYXJ0IG11bHRpLWJ5dGVcbi8vIGNoYXJhY3RlcnMuIENFU1UtOCBpcyBoYW5kbGVkIGFzIHBhcnQgb2YgdGhlIFVURi04IGVuY29kaW5nLlxuLy9cbi8vIEBUT0RPIEhhbmRsaW5nIGFsbCBlbmNvZGluZ3MgaW5zaWRlIGEgc2luZ2xlIG9iamVjdCBtYWtlcyBpdCB2ZXJ5IGRpZmZpY3VsdFxuLy8gdG8gcmVhc29uIGFib3V0IHRoaXMgY29kZSwgc28gaXQgc2hvdWxkIGJlIHNwbGl0IHVwIGluIHRoZSBmdXR1cmUuXG4vLyBAVE9ETyBUaGVyZSBzaG91bGQgYmUgYSB1dGY4LXN0cmljdCBlbmNvZGluZyB0aGF0IHJlamVjdHMgaW52YWxpZCBVVEYtOCBjb2RlXG4vLyBwb2ludHMgYXMgdXNlZCBieSBDRVNVLTguXG5leHBvcnQgZnVuY3Rpb24gU3RyaW5nRGVjb2RlcihlbmNvZGluZykge1xuICB0aGlzLmVuY29kaW5nID0gKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bLV9dLywgJycpO1xuICBhc3NlcnRFbmNvZGluZyhlbmNvZGluZyk7XG4gIHN3aXRjaCAodGhpcy5lbmNvZGluZykge1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgLy8gQ0VTVS04IHJlcHJlc2VudHMgZWFjaCBvZiBTdXJyb2dhdGUgUGFpciBieSAzLWJ5dGVzXG4gICAgICB0aGlzLnN1cnJvZ2F0ZVNpemUgPSAzO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICAvLyBVVEYtMTYgcmVwcmVzZW50cyBlYWNoIG9mIFN1cnJvZ2F0ZSBQYWlyIGJ5IDItYnl0ZXNcbiAgICAgIHRoaXMuc3Vycm9nYXRlU2l6ZSA9IDI7XG4gICAgICB0aGlzLmRldGVjdEluY29tcGxldGVDaGFyID0gdXRmMTZEZXRlY3RJbmNvbXBsZXRlQ2hhcjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAvLyBCYXNlLTY0IHN0b3JlcyAzIGJ5dGVzIGluIDQgY2hhcnMsIGFuZCBwYWRzIHRoZSByZW1haW5kZXIuXG4gICAgICB0aGlzLnN1cnJvZ2F0ZVNpemUgPSAzO1xuICAgICAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhciA9IGJhc2U2NERldGVjdEluY29tcGxldGVDaGFyO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRoaXMud3JpdGUgPSBwYXNzVGhyb3VnaFdyaXRlO1xuICAgICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRW5vdWdoIHNwYWNlIHRvIHN0b3JlIGFsbCBieXRlcyBvZiBhIHNpbmdsZSBjaGFyYWN0ZXIuIFVURi04IG5lZWRzIDRcbiAgLy8gYnl0ZXMsIGJ1dCBDRVNVLTggbWF5IHJlcXVpcmUgdXAgdG8gNiAoMyBieXRlcyBwZXIgc3Vycm9nYXRlKS5cbiAgdGhpcy5jaGFyQnVmZmVyID0gbmV3IEJ1ZmZlcig2KTtcbiAgLy8gTnVtYmVyIG9mIGJ5dGVzIHJlY2VpdmVkIGZvciB0aGUgY3VycmVudCBpbmNvbXBsZXRlIG11bHRpLWJ5dGUgY2hhcmFjdGVyLlxuICB0aGlzLmNoYXJSZWNlaXZlZCA9IDA7XG4gIC8vIE51bWJlciBvZiBieXRlcyBleHBlY3RlZCBmb3IgdGhlIGN1cnJlbnQgaW5jb21wbGV0ZSBtdWx0aS1ieXRlIGNoYXJhY3Rlci5cbiAgdGhpcy5jaGFyTGVuZ3RoID0gMDtcbn07XG5cblxuLy8gd3JpdGUgZGVjb2RlcyB0aGUgZ2l2ZW4gYnVmZmVyIGFuZCByZXR1cm5zIGl0IGFzIEpTIHN0cmluZyB0aGF0IGlzXG4vLyBndWFyYW50ZWVkIHRvIG5vdCBjb250YWluIGFueSBwYXJ0aWFsIG11bHRpLWJ5dGUgY2hhcmFjdGVycy4gQW55IHBhcnRpYWxcbi8vIGNoYXJhY3RlciBmb3VuZCBhdCB0aGUgZW5kIG9mIHRoZSBidWZmZXIgaXMgYnVmZmVyZWQgdXAsIGFuZCB3aWxsIGJlXG4vLyByZXR1cm5lZCB3aGVuIGNhbGxpbmcgd3JpdGUgYWdhaW4gd2l0aCB0aGUgcmVtYWluaW5nIGJ5dGVzLlxuLy9cbi8vIE5vdGU6IENvbnZlcnRpbmcgYSBCdWZmZXIgY29udGFpbmluZyBhbiBvcnBoYW4gc3Vycm9nYXRlIHRvIGEgU3RyaW5nXG4vLyBjdXJyZW50bHkgd29ya3MsIGJ1dCBjb252ZXJ0aW5nIGEgU3RyaW5nIHRvIGEgQnVmZmVyICh2aWEgYG5ldyBCdWZmZXJgLCBvclxuLy8gQnVmZmVyI3dyaXRlKSB3aWxsIHJlcGxhY2UgaW5jb21wbGV0ZSBzdXJyb2dhdGVzIHdpdGggdGhlIHVuaWNvZGVcbi8vIHJlcGxhY2VtZW50IGNoYXJhY3Rlci4gU2VlIGh0dHBzOi8vY29kZXJldmlldy5jaHJvbWl1bS5vcmcvMTIxMTczMDA5LyAuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICB2YXIgY2hhclN0ciA9ICcnO1xuICAvLyBpZiBvdXIgbGFzdCB3cml0ZSBlbmRlZCB3aXRoIGFuIGluY29tcGxldGUgbXVsdGlieXRlIGNoYXJhY3RlclxuICB3aGlsZSAodGhpcy5jaGFyTGVuZ3RoKSB7XG4gICAgLy8gZGV0ZXJtaW5lIGhvdyBtYW55IHJlbWFpbmluZyBieXRlcyB0aGlzIGJ1ZmZlciBoYXMgdG8gb2ZmZXIgZm9yIHRoaXMgY2hhclxuICAgIHZhciBhdmFpbGFibGUgPSAoYnVmZmVyLmxlbmd0aCA+PSB0aGlzLmNoYXJMZW5ndGggLSB0aGlzLmNoYXJSZWNlaXZlZCkgP1xuICAgICAgICB0aGlzLmNoYXJMZW5ndGggLSB0aGlzLmNoYXJSZWNlaXZlZCA6XG4gICAgICAgIGJ1ZmZlci5sZW5ndGg7XG5cbiAgICAvLyBhZGQgdGhlIG5ldyBieXRlcyB0byB0aGUgY2hhciBidWZmZXJcbiAgICBidWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIHRoaXMuY2hhclJlY2VpdmVkLCAwLCBhdmFpbGFibGUpO1xuICAgIHRoaXMuY2hhclJlY2VpdmVkICs9IGF2YWlsYWJsZTtcblxuICAgIGlmICh0aGlzLmNoYXJSZWNlaXZlZCA8IHRoaXMuY2hhckxlbmd0aCkge1xuICAgICAgLy8gc3RpbGwgbm90IGVub3VnaCBjaGFycyBpbiB0aGlzIGJ1ZmZlcj8gd2FpdCBmb3IgbW9yZSAuLi5cbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgYnl0ZXMgYmVsb25naW5nIHRvIHRoZSBjdXJyZW50IGNoYXJhY3RlciBmcm9tIHRoZSBidWZmZXJcbiAgICBidWZmZXIgPSBidWZmZXIuc2xpY2UoYXZhaWxhYmxlLCBidWZmZXIubGVuZ3RoKTtcblxuICAgIC8vIGdldCB0aGUgY2hhcmFjdGVyIHRoYXQgd2FzIHNwbGl0XG4gICAgY2hhclN0ciA9IHRoaXMuY2hhckJ1ZmZlci5zbGljZSgwLCB0aGlzLmNoYXJMZW5ndGgpLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcpO1xuXG4gICAgLy8gQ0VTVS04OiBsZWFkIHN1cnJvZ2F0ZSAoRDgwMC1EQkZGKSBpcyBhbHNvIHRoZSBpbmNvbXBsZXRlIGNoYXJhY3RlclxuICAgIHZhciBjaGFyQ29kZSA9IGNoYXJTdHIuY2hhckNvZGVBdChjaGFyU3RyLmxlbmd0aCAtIDEpO1xuICAgIGlmIChjaGFyQ29kZSA+PSAweEQ4MDAgJiYgY2hhckNvZGUgPD0gMHhEQkZGKSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggKz0gdGhpcy5zdXJyb2dhdGVTaXplO1xuICAgICAgY2hhclN0ciA9ICcnO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHRoaXMuY2hhclJlY2VpdmVkID0gdGhpcy5jaGFyTGVuZ3RoID0gMDtcblxuICAgIC8vIGlmIHRoZXJlIGFyZSBubyBtb3JlIGJ5dGVzIGluIHRoaXMgYnVmZmVyLCBqdXN0IGVtaXQgb3VyIGNoYXJcbiAgICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGNoYXJTdHI7XG4gICAgfVxuICAgIGJyZWFrO1xuICB9XG5cbiAgLy8gZGV0ZXJtaW5lIGFuZCBzZXQgY2hhckxlbmd0aCAvIGNoYXJSZWNlaXZlZFxuICB0aGlzLmRldGVjdEluY29tcGxldGVDaGFyKGJ1ZmZlcik7XG5cbiAgdmFyIGVuZCA9IGJ1ZmZlci5sZW5ndGg7XG4gIGlmICh0aGlzLmNoYXJMZW5ndGgpIHtcbiAgICAvLyBidWZmZXIgdGhlIGluY29tcGxldGUgY2hhcmFjdGVyIGJ5dGVzIHdlIGdvdFxuICAgIGJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgMCwgYnVmZmVyLmxlbmd0aCAtIHRoaXMuY2hhclJlY2VpdmVkLCBlbmQpO1xuICAgIGVuZCAtPSB0aGlzLmNoYXJSZWNlaXZlZDtcbiAgfVxuXG4gIGNoYXJTdHIgKz0gYnVmZmVyLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcsIDAsIGVuZCk7XG5cbiAgdmFyIGVuZCA9IGNoYXJTdHIubGVuZ3RoIC0gMTtcbiAgdmFyIGNoYXJDb2RlID0gY2hhclN0ci5jaGFyQ29kZUF0KGVuZCk7XG4gIC8vIENFU1UtODogbGVhZCBzdXJyb2dhdGUgKEQ4MDAtREJGRikgaXMgYWxzbyB0aGUgaW5jb21wbGV0ZSBjaGFyYWN0ZXJcbiAgaWYgKGNoYXJDb2RlID49IDB4RDgwMCAmJiBjaGFyQ29kZSA8PSAweERCRkYpIHtcbiAgICB2YXIgc2l6ZSA9IHRoaXMuc3Vycm9nYXRlU2l6ZTtcbiAgICB0aGlzLmNoYXJMZW5ndGggKz0gc2l6ZTtcbiAgICB0aGlzLmNoYXJSZWNlaXZlZCArPSBzaXplO1xuICAgIHRoaXMuY2hhckJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgc2l6ZSwgMCwgc2l6ZSk7XG4gICAgYnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCAwLCAwLCBzaXplKTtcbiAgICByZXR1cm4gY2hhclN0ci5zdWJzdHJpbmcoMCwgZW5kKTtcbiAgfVxuXG4gIC8vIG9yIGp1c3QgZW1pdCB0aGUgY2hhclN0clxuICByZXR1cm4gY2hhclN0cjtcbn07XG5cbi8vIGRldGVjdEluY29tcGxldGVDaGFyIGRldGVybWluZXMgaWYgdGhlcmUgaXMgYW4gaW5jb21wbGV0ZSBVVEYtOCBjaGFyYWN0ZXIgYXRcbi8vIHRoZSBlbmQgb2YgdGhlIGdpdmVuIGJ1ZmZlci4gSWYgc28sIGl0IHNldHMgdGhpcy5jaGFyTGVuZ3RoIHRvIHRoZSBieXRlXG4vLyBsZW5ndGggdGhhdCBjaGFyYWN0ZXIsIGFuZCBzZXRzIHRoaXMuY2hhclJlY2VpdmVkIHRvIHRoZSBudW1iZXIgb2YgYnl0ZXNcbi8vIHRoYXQgYXJlIGF2YWlsYWJsZSBmb3IgdGhpcyBjaGFyYWN0ZXIuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5kZXRlY3RJbmNvbXBsZXRlQ2hhciA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICAvLyBkZXRlcm1pbmUgaG93IG1hbnkgYnl0ZXMgd2UgaGF2ZSB0byBjaGVjayBhdCB0aGUgZW5kIG9mIHRoaXMgYnVmZmVyXG4gIHZhciBpID0gKGJ1ZmZlci5sZW5ndGggPj0gMykgPyAzIDogYnVmZmVyLmxlbmd0aDtcblxuICAvLyBGaWd1cmUgb3V0IGlmIG9uZSBvZiB0aGUgbGFzdCBpIGJ5dGVzIG9mIG91ciBidWZmZXIgYW5ub3VuY2VzIGFuXG4gIC8vIGluY29tcGxldGUgY2hhci5cbiAgZm9yICg7IGkgPiAwOyBpLS0pIHtcbiAgICB2YXIgYyA9IGJ1ZmZlcltidWZmZXIubGVuZ3RoIC0gaV07XG5cbiAgICAvLyBTZWUgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9VVEYtOCNEZXNjcmlwdGlvblxuXG4gICAgLy8gMTEwWFhYWFhcbiAgICBpZiAoaSA9PSAxICYmIGMgPj4gNSA9PSAweDA2KSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggPSAyO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gMTExMFhYWFhcbiAgICBpZiAoaSA8PSAyICYmIGMgPj4gNCA9PSAweDBFKSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggPSAzO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gMTExMTBYWFhcbiAgICBpZiAoaSA8PSAzICYmIGMgPj4gMyA9PSAweDFFKSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggPSA0O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHRoaXMuY2hhclJlY2VpdmVkID0gaTtcbn07XG5cblN0cmluZ0RlY29kZXIucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICB2YXIgcmVzID0gJyc7XG4gIGlmIChidWZmZXIgJiYgYnVmZmVyLmxlbmd0aClcbiAgICByZXMgPSB0aGlzLndyaXRlKGJ1ZmZlcik7XG5cbiAgaWYgKHRoaXMuY2hhclJlY2VpdmVkKSB7XG4gICAgdmFyIGNyID0gdGhpcy5jaGFyUmVjZWl2ZWQ7XG4gICAgdmFyIGJ1ZiA9IHRoaXMuY2hhckJ1ZmZlcjtcbiAgICB2YXIgZW5jID0gdGhpcy5lbmNvZGluZztcbiAgICByZXMgKz0gYnVmLnNsaWNlKDAsIGNyKS50b1N0cmluZyhlbmMpO1xuICB9XG5cbiAgcmV0dXJuIHJlcztcbn07XG5cbmZ1bmN0aW9uIHBhc3NUaHJvdWdoV3JpdGUoYnVmZmVyKSB7XG4gIHJldHVybiBidWZmZXIudG9TdHJpbmcodGhpcy5lbmNvZGluZyk7XG59XG5cbmZ1bmN0aW9uIHV0ZjE2RGV0ZWN0SW5jb21wbGV0ZUNoYXIoYnVmZmVyKSB7XG4gIHRoaXMuY2hhclJlY2VpdmVkID0gYnVmZmVyLmxlbmd0aCAlIDI7XG4gIHRoaXMuY2hhckxlbmd0aCA9IHRoaXMuY2hhclJlY2VpdmVkID8gMiA6IDA7XG59XG5cbmZ1bmN0aW9uIGJhc2U2NERldGVjdEluY29tcGxldGVDaGFyKGJ1ZmZlcikge1xuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGJ1ZmZlci5sZW5ndGggJSAzO1xuICB0aGlzLmNoYXJMZW5ndGggPSB0aGlzLmNoYXJSZWNlaXZlZCA/IDMgOiAwO1xufVxuIiwiaW1wb3J0IHtnZW5lcmF0ZVNjaGVtYX0gZnJvbSBcIi4vaW5kZXhTY2hlbWFDcmVhdG9yXCI7XG5pbXBvcnQgeyBoYXMsIGlzU3RyaW5nLCBkaWZmZXJlbmNlLCBmaW5kIH0gZnJvbSBcImxvZGFzaC9mcFwiO1xuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcInNhZmUtYnVmZmVyXCI7XG5pbXBvcnQge1N0cmluZ0RlY29kZXJ9IGZyb20gXCJzdHJpbmdfZGVjb2RlclwiO1xuaW1wb3J0IHtnZXRUeXBlfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IGlzU29tZXRoaW5nIH0gZnJvbSBcIi4uL2NvbW1vblwiO1xuXG5leHBvcnQgY29uc3QgQlVGRkVSX01BWF9CWVRFUyA9IDUyNDI4ODsgLy8gMC41TWJcblxuZXhwb3J0IGNvbnN0IENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUyA9IFwiQ09OVElOVUVfUkVBRElOR1wiO1xuZXhwb3J0IGNvbnN0IFJFQURfUkVNQUlOSU5HX1RFWFQgPSBcIlJFQURfUkVNQUlOSU5HXCI7XG5leHBvcnQgY29uc3QgQ0FOQ0VMX1JFQUQgPSBcIkNBTkNFTFwiO1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhXcml0ZXIgPSAoaGllcmFyY2h5LCBpbmRleE5vZGUsIHJlYWRhYmxlU3RyZWFtLCB3cml0YWJsZVN0cmVhbSwgZW5kKSA9PiB7XG4gICAgY29uc3Qgc2NoZW1hID0gZ2VuZXJhdGVTY2hlbWEoaGllcmFyY2h5LCBpbmRleE5vZGUpO1xuXG4gICAgcmV0dXJuICh7XG4gICAgICAgIHJlYWQ6IHJlYWQocmVhZGFibGVTdHJlYW0sIHNjaGVtYSksXG4gICAgICAgIHVwZGF0ZUluZGV4OiB1cGRhdGVJbmRleChyZWFkYWJsZVN0cmVhbSwgd3JpdGFibGVTdHJlYW0sIHNjaGVtYSwgZW5kKVxuICAgIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4UmVhZGVyID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlLCByZWFkYWJsZVN0cmVhbSkgPT4gXG4gICAgcmVhZChcbiAgICAgICAgcmVhZGFibGVTdHJlYW0sIFxuICAgICAgICBnZW5lcmF0ZVNjaGVtYShoaWVyYXJjaHksIGluZGV4Tm9kZSlcbiAgICApO1xuXG5jb25zdCB1cGRhdGVJbmRleCA9IChyZWFkYWJsZVN0cmVhbSwgd3JpdGFibGVTdHJlYW0sIHNjaGVtYSkgPT4gYXN5bmMgKGl0ZW1zVG9Xcml0ZSwga2V5c1RvUmVtb3ZlKSA9PiB7XG4gICAgY29uc3Qgd3JpdGUgPSBuZXdPdXRwdXRXcml0ZXIoQlVGRkVSX01BWF9CWVRFUywgd3JpdGFibGVTdHJlYW0pO1xuICAgIGNvbnN0IHdyaXR0ZW5JdGVtcyA9IFtdOyBcbiAgICBhd2FpdCByZWFkKHJlYWRhYmxlU3RyZWFtLCBzY2hlbWEpKFxuICAgICAgICBhc3luYyBpbmRleGVkSXRlbSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGVkID0gZmluZChpID0+IGluZGV4ZWRJdGVtLmtleSA9PT0gaS5rZXkpKGl0ZW1zVG9Xcml0ZSk7XG4gICAgICAgICAgICBjb25zdCByZW1vdmVkID0gZmluZChrID0+IGluZGV4ZWRJdGVtLmtleSA9PT0gaykoa2V5c1RvUmVtb3ZlKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoaXNTb21ldGhpbmcocmVtb3ZlZCkpIFxuICAgICAgICAgICAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XG5cbiAgICAgICAgICAgIGlmKGlzU29tZXRoaW5nKHVwZGF0ZWQpKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VyaWFsaXplZEl0ZW0gPSAgc2VyaWFsaXplSXRlbShzY2hlbWEsIHVwZGF0ZWQpO1xuICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRlKHNlcmlhbGl6ZWRJdGVtKTtcbiAgICAgICAgICAgICAgICB3cml0dGVuSXRlbXMucHVzaCh1cGRhdGVkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgd3JpdGUoXG4gICAgICAgICAgICAgICAgICAgIHNlcmlhbGl6ZUl0ZW0oc2NoZW1hLCBpbmRleGVkSXRlbSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBcblxuICAgICAgICAgICAgcmV0dXJuIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcblxuICAgICAgICB9LFxuICAgICAgICBhc3luYyB0ZXh0ID0+IGF3YWl0IHdyaXRlKHRleHQpXG4gICAgKTtcblxuICAgIGlmKHdyaXR0ZW5JdGVtcy5sZW5ndGggIT09IGl0ZW1zVG9Xcml0ZS5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgdG9BZGQgPSBkaWZmZXJlbmNlKGl0ZW1zVG9Xcml0ZSwgd3JpdHRlbkl0ZW1zKTtcbiAgICAgICAgZm9yKGxldCBhZGRlZCBvZiB0b0FkZCkge1xuICAgICAgICAgICAgYXdhaXQgd3JpdGUoXG4gICAgICAgICAgICAgICAgc2VyaWFsaXplSXRlbShzY2hlbWEsIGFkZGVkKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZih3cml0dGVuSXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIHBvdGVudGlhbGx5IGFyZSBubyByZWNvcmRzXG4gICAgICAgIGF3YWl0IHdyaXRlKFwiXCIpO1xuICAgIH1cblxuICAgIGF3YWl0IHdyaXRlKCk7XG4gICAgYXdhaXQgd3JpdGFibGVTdHJlYW0uZW5kKCk7XG59O1xuXG5jb25zdCByZWFkID0gKHJlYWRhYmxlU3RyZWFtLCBzY2hlbWEpID0+IGFzeW5jIChvbkdldEl0ZW0sIG9uR2V0VGV4dCkgPT4ge1xuICAgIGNvbnN0IHJlYWRJbnB1dCA9IG5ld0lucHV0UmVhZGVyKHJlYWRhYmxlU3RyZWFtKTtcbiAgICBsZXQgdGV4dCA9IGF3YWl0IHJlYWRJbnB1dCgpO1xuICAgIGxldCBzdGF0dXMgPSBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XG4gICAgd2hpbGUodGV4dC5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgaWYoc3RhdHVzID09PSBSRUFEX1JFTUFJTklOR19URVhUKSB7XG4gICAgICAgICAgICBhd2FpdCBvbkdldFRleHQodGV4dCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHN0YXR1cyA9PT0gQ0FOQ0VMX1JFQUQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByb3dUZXh0ID0gXCJcIjtcbiAgICAgICAgbGV0IGN1cnJlbnRDaGFySW5kZXg9MDtcbiAgICAgICAgZm9yKGxldCBjdXJyZW50Q2hhciBvZiB0ZXh0KSB7XG4gICAgICAgICAgICByb3dUZXh0ICs9IGN1cnJlbnRDaGFyO1xuICAgICAgICAgICAgaWYoY3VycmVudENoYXIgPT09IFwiXFxyXCIpIHtcbiAgICAgICAgICAgICAgICBzdGF0dXMgPSBhd2FpdCBvbkdldEl0ZW0oXG4gICAgICAgICAgICAgICAgICAgIGRlc2VyaWFsaXplUm93KHNjaGVtYSwgcm93VGV4dClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJvd1RleHQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGlmKHN0YXR1cyA9PT0gUkVBRF9SRU1BSU5JTkdfVEVYVCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyZW50Q2hhckluZGV4Kys7XG4gICAgICAgIH1cblxuICAgICAgICBpZihjdXJyZW50Q2hhckluZGV4IDwgdGV4dC5sZW5ndGggLTEpIHtcbiAgICAgICAgICAgIGF3YWl0IG9uR2V0VGV4dCh0ZXh0LnN1YnN0cmluZyhjdXJyZW50Q2hhckluZGV4ICsgMSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGV4dCA9IGF3YWl0IHJlYWRJbnB1dCgpO1xuICAgIH1cblxuICAgIGF3YWl0IHJlYWRhYmxlU3RyZWFtLmRlc3Ryb3koKTtcblxufTtcblxuY29uc3QgbmV3T3V0cHV0V3JpdGVyID0gKGZsdXNoQm91bmRhcnksIHdyaXRhYmxlU3RyZWFtKSA9PiB7XG4gICAgXG4gICAgbGV0IGN1cnJlbnRCdWZmZXIgPSBudWxsO1xuXG4gICAgcmV0dXJuIGFzeW5jICh0ZXh0KSA9PiB7XG5cbiAgICAgICAgaWYoaXNTdHJpbmcodGV4dCkgJiYgY3VycmVudEJ1ZmZlciA9PT0gbnVsbClcbiAgICAgICAgICAgIGN1cnJlbnRCdWZmZXIgPSBCdWZmZXIuZnJvbSh0ZXh0LCBcInV0ZjhcIik7XG4gICAgICAgIGVsc2UgaWYoaXNTdHJpbmcodGV4dCkpXG4gICAgICAgICAgICBjdXJyZW50QnVmZmVyID0gQnVmZmVyLmNvbmNhdChbXG4gICAgICAgICAgICAgICAgY3VycmVudEJ1ZmZlcixcbiAgICAgICAgICAgICAgICBCdWZmZXIuZnJvbSh0ZXh0LCBcInV0ZjhcIilcbiAgICAgICAgICAgIF0pO1xuICAgICAgICBcbiAgICAgICAgaWYoY3VycmVudEJ1ZmZlciAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgKGN1cnJlbnRCdWZmZXIubGVuZ3RoID4gZmx1c2hCb3VuZGFyeVxuICAgICAgICAgICAgIHx8ICFpc1N0cmluZyh0ZXh0KSkpIHtcblxuICAgICAgICAgICAgYXdhaXQgd3JpdGFibGVTdHJlYW0ud3JpdGUoY3VycmVudEJ1ZmZlcik7XG4gICAgICAgICAgICBjdXJyZW50QnVmZmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmNvbnN0IG5ld0lucHV0UmVhZGVyID0gKHJlYWRhYmxlU3RyZWFtKSA9PiB7XG5cbiAgICBjb25zdCBkZWNvZGVyID0gbmV3IFN0cmluZ0RlY29kZXIoJ3V0ZjgnKTtcbiAgICBsZXQgcmVtYWluaW5nQnl0ZXMgPSBbXTtcblxuICAgIHJldHVybiBhc3luYyAoKSA9PiB7XG5cbiAgICAgICAgbGV0IG5leHRCeXRlc0J1ZmZlciA9IGF3YWl0IHJlYWRhYmxlU3RyZWFtLnJlYWQoQlVGRkVSX01BWF9CWVRFUyk7XG4gICAgICAgIGNvbnN0IHJlbWFpbmluZ0J1ZmZlciA9IEJ1ZmZlci5mcm9tKHJlbWFpbmluZ0J5dGVzKTtcblxuICAgICAgICBpZighbmV4dEJ5dGVzQnVmZmVyKSBuZXh0Qnl0ZXNCdWZmZXIgPSBCdWZmZXIuZnJvbShbXSk7XG5cbiAgICAgICAgY29uc3QgbW9yZVRvUmVhZCA9IG5leHRCeXRlc0J1ZmZlci5sZW5ndGggPT09IEJVRkZFUl9NQVhfQllURVM7XG5cbiAgICAgICAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmNvbmNhdChcbiAgICAgICAgICAgIFtyZW1haW5pbmdCdWZmZXIsIG5leHRCeXRlc0J1ZmZlcl0sXG4gICAgICAgICAgICByZW1haW5pbmdCdWZmZXIubGVuZ3RoICsgbmV4dEJ5dGVzQnVmZmVyLmxlbmd0aCk7XG5cbiAgICAgICAgY29uc3QgdGV4dCA9IGRlY29kZXIud3JpdGUoYnVmZmVyKTtcbiAgICAgICAgcmVtYWluaW5nQnl0ZXMgPSBkZWNvZGVyLmVuZChidWZmZXIpO1xuXG4gICAgICAgIGlmKCFtb3JlVG9SZWFkICYmIHJlbWFpbmluZ0J5dGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIGlmIGZvciBhbnkgcmVhc29uLCB3ZSBoYXZlIHJlbWFpbmluZyBieXRlcyBhdCB0aGUgZW5kXG4gICAgICAgICAgICAvLyBvZiB0aGUgc3RyZWFtLCBqdXN0IGRpc2NhcmQgLSBkb250IHNlZSB3aHkgdGhpcyBzaG91bGRcbiAgICAgICAgICAgIC8vIGV2ZXIgaGFwcGVuLCBidXQgaWYgaXQgZG9lcywgaXQgY291bGQgY2F1c2UgYSBzdGFjayBvdmVyZmxvd1xuICAgICAgICAgICAgcmVtYWluaW5nQnl0ZXMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH07XG59O1xuXG5jb25zdCBkZXNlcmlhbGl6ZVJvdyA9IChzY2hlbWEsIHJvd1RleHQpID0+IHtcbiAgICBsZXQgY3VycmVudFByb3BJbmRleCA9IDA7XG4gICAgbGV0IGN1cnJlbnRDaGFySW5kZXggPSAwO1xuICAgIGxldCBjdXJyZW50VmFsdWVUZXh0ID0gXCJcIjtcbiAgICBsZXQgaXNFc2NhcGVkID0gZmFsc2U7XG4gICAgY29uc3QgaXRlbSA9IHt9O1xuXG4gICAgY29uc3Qgc2V0Q3VycmVudFByb3AgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRQcm9wID0gc2NoZW1hW2N1cnJlbnRQcm9wSW5kZXhdO1xuICAgICAgICBjb25zdCB0eXBlID0gZ2V0VHlwZShjdXJyZW50UHJvcC50eXBlKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjdXJyZW50VmFsdWVUZXh0ID09PSBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgPyB0eXBlLmdldERlZmF1bHRWYWx1ZSgpXG4gICAgICAgICAgICAgICAgICAgICAgOiB0eXBlLnNhZmVQYXJzZVZhbHVlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWVUZXh0KTtcbiAgICAgICAgaXRlbVtjdXJyZW50UHJvcC5uYW1lXSA9IHZhbHVlO1xuICAgIH07XG4gICAgXG4gICAgd2hpbGUoY3VycmVudFByb3BJbmRleCA8IHNjaGVtYS5sZW5ndGgpIHtcblxuICAgICAgICBpZihjdXJyZW50Q2hhckluZGV4IDwgcm93VGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDaGFyID0gcm93VGV4dFtjdXJyZW50Q2hhckluZGV4XTtcbiAgICAgICAgICAgIGlmKGlzRXNjYXBlZCkge1xuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcInJcIikge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWVUZXh0ICs9IFwiXFxyXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaXNFc2NhcGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcIixcIikge1xuICAgICAgICAgICAgICAgICAgICBzZXRDdXJyZW50UHJvcCgpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWVUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFByb3BJbmRleCsrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihjdXJyZW50Q2hhciA9PT0gXCJcXFxcXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNFc2NhcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWVUZXh0ICs9IGN1cnJlbnRDaGFyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1cnJlbnRDaGFySW5kZXgrKzsgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdXJyZW50VmFsdWVUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgIHNldEN1cnJlbnRQcm9wKCk7XG4gICAgICAgICAgICBjdXJyZW50UHJvcEluZGV4Kys7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaXRlbTtcbn07XG5cbmV4cG9ydCBjb25zdCBzZXJpYWxpemVJdGVtID0gKHNjaGVtYSwgaXRlbSkgID0+IHtcblxuICAgIGxldCByb3dUZXh0ID0gXCJcIlxuXG4gICAgZm9yKGxldCBwcm9wIG9mIHNjaGVtYSkge1xuICAgICAgICBjb25zdCB0eXBlID0gZ2V0VHlwZShwcm9wLnR5cGUpO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGhhcyhwcm9wLm5hbWUpKGl0ZW0pXG4gICAgICAgICAgICAgICAgICAgICAgPyBpdGVtW3Byb3AubmFtZV1cbiAgICAgICAgICAgICAgICAgICAgICA6IHR5cGUuZ2V0RGVmYXVsdFZhbHVlKClcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHZhbFN0ciA9IHR5cGUuc3RyaW5naWZ5KHZhbHVlKTtcblxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdmFsU3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2hhciA9IHZhbFN0cltpXTtcbiAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcIixcIiBcbiAgICAgICAgICAgICAgIHx8IGN1cnJlbnRDaGFyID09PSBcIlxcclwiIFxuICAgICAgICAgICAgICAgfHwgY3VycmVudENoYXIgPT09IFwiXFxcXFwiKSB7XG4gICAgICAgICAgICAgICAgcm93VGV4dCArPSBcIlxcXFxcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoY3VycmVudENoYXIgPT09IFwiXFxyXCIpIHtcbiAgICAgICAgICAgICAgICByb3dUZXh0ICs9IFwiclwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByb3dUZXh0ICs9IGN1cnJlbnRDaGFyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcm93VGV4dCArPSBcIixcIjtcbiAgICB9XG5cbiAgICByb3dUZXh0ICs9IFwiXFxyXCI7XG4gICAgcmV0dXJuIHJvd1RleHQ7XG59OyIsImltcG9ydCBsdW5yIGZyb20gJ2x1bnInO1xuaW1wb3J0IHtcbiAgZ2V0SGFzaENvZGUsXG4gIGpvaW5LZXlcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIGdldEFjdHVhbEtleU9mUGFyZW50LFxuICBpc0dsb2JhbEluZGV4LFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHtwcm9taXNlUmVhZGFibGVTdHJlYW19IGZyb20gXCIuL3Byb21pc2VSZWFkYWJsZVN0cmVhbVwiO1xuaW1wb3J0IHsgY3JlYXRlSW5kZXhGaWxlIH0gZnJvbSAnLi9zaGFyZGluZyc7XG5pbXBvcnQgeyBnZW5lcmF0ZVNjaGVtYSB9IGZyb20gJy4vaW5kZXhTY2hlbWFDcmVhdG9yJztcbmltcG9ydCB7IGdldEluZGV4UmVhZGVyLCBDT05USU5VRV9SRUFESU5HX1JFQ09SRFMgfSBmcm9tICcuL3NlcmlhbGl6ZXInO1xuXG5leHBvcnQgY29uc3QgcmVhZEluZGV4ID0gYXN5bmMgKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXkpID0+IHtcbiAgY29uc3QgcmVjb3JkcyA9IFtdO1xuICBjb25zdCBkb1JlYWQgPSBpdGVyYXRlSW5kZXgoXG4gICAgICAgIGFzeW5jIGl0ZW0gPT4ge1xuICAgICAgcmVjb3Jkcy5wdXNoKGl0ZW0pO1xuICAgICAgcmV0dXJuIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcbiAgICB9LFxuICAgICAgICBhc3luYyAoKSA9PiByZWNvcmRzXG4gICk7XG5cbiAgcmV0dXJuIGF3YWl0IGRvUmVhZChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KTtcbn07XG5cbmV4cG9ydCBjb25zdCBzZWFyY2hJbmRleCA9IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5LCBzZWFyY2hQaHJhc2UpID0+IHtcbiAgY29uc3QgcmVjb3JkcyA9IFtdO1xuICBjb25zdCBzY2hlbWEgPSBnZW5lcmF0ZVNjaGVtYShoaWVyYXJjaHksIGluZGV4KTtcbiAgY29uc3QgZG9SZWFkID0gaXRlcmF0ZUluZGV4KFxuICAgICAgICBhc3luYyBpdGVtID0+IHtcbiAgICAgIGNvbnN0IGlkeCA9IGx1bnIoZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnJlZigna2V5Jyk7XG4gICAgICAgIGZvciAoY29uc3QgZmllbGQgb2Ygc2NoZW1hKSB7XG4gICAgICAgICAgdGhpcy5maWVsZChmaWVsZC5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkZChpdGVtKTtcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc2VhcmNoUmVzdWx0cyA9IGlkeC5zZWFyY2goc2VhcmNoUGhyYXNlKTtcbiAgICAgIGlmIChzZWFyY2hSZXN1bHRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpdGVtLl9zZWFyY2hSZXN1bHQgPSBzZWFyY2hSZXN1bHRzWzBdO1xuICAgICAgICByZWNvcmRzLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xuICAgIH0sXG4gICAgICAgIGFzeW5jICgpID0+IHJlY29yZHNcbiAgKTtcblxuICByZXR1cm4gYXdhaXQgZG9SZWFkKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4ZWREYXRhS2V5X2Zyb21JbmRleEtleSA9IChpbmRleEtleSkgPT4gXG4gIGAke2luZGV4S2V5fSR7aW5kZXhLZXkuZW5kc1dpdGgoJy5jc3YnKSA/ICcnIDogJy5jc3YnfWA7XG5cbmV4cG9ydCBjb25zdCB1bmlxdWVJbmRleE5hbWUgPSBpbmRleCA9PiBgaWR4XyR7XG4gIGdldEhhc2hDb2RlKGAke2luZGV4LmZpbHRlcn0ke2luZGV4Lm1hcH1gKVxufS5jc3ZgO1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhlZERhdGFLZXkgPSAoZGVjZW5kYW50S2V5LCBpbmRleE5vZGUpID0+IHtcbiAgaWYgKGlzR2xvYmFsSW5kZXgoaW5kZXhOb2RlKSkgeyByZXR1cm4gYCR7aW5kZXhOb2RlLm5vZGVLZXkoKX0uY3N2YDsgfVxuXG4gIGNvbnN0IGluZGV4ZWREYXRhUGFyZW50S2V5ID0gZ2V0QWN0dWFsS2V5T2ZQYXJlbnQoXG4gICAgaW5kZXhOb2RlLnBhcmVudCgpLm5vZGVLZXkoKSxcbiAgICBkZWNlbmRhbnRLZXksXG4gICk7XG5cbiAgY29uc3QgaW5kZXhOYW1lID0gaW5kZXhOb2RlLm5hbWVcbiAgICA/IGAke2luZGV4Tm9kZS5uYW1lfS5jc3ZgXG4gICAgOiB1bmlxdWVJbmRleE5hbWUoaW5kZXhOb2RlKTtcblxuICByZXR1cm4gam9pbktleShcbiAgICBpbmRleGVkRGF0YVBhcmVudEtleSxcbiAgICBpbmRleE5hbWUsXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgaXRlcmF0ZUluZGV4ID0gKG9uR2V0SXRlbSwgZ2V0RmluYWxSZXN1bHQpID0+IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVhZGFibGVTdHJlYW0gPSBwcm9taXNlUmVhZGFibGVTdHJlYW0oXG4gICAgICAgIGF3YWl0IGRhdGFzdG9yZS5yZWFkYWJsZUZpbGVTdHJlYW0oaW5kZXhlZERhdGFLZXkpXG4gICAgKTtcblxuICAgIGNvbnN0IHJlYWQgPSBnZXRJbmRleFJlYWRlcihoaWVyYXJjaHksIGluZGV4LCByZWFkYWJsZVN0cmVhbSk7XG4gICAgYXdhaXQgcmVhZChvbkdldEl0ZW0pO1xuICAgIHJldHVybiBnZXRGaW5hbFJlc3VsdCgpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGF3YWl0IGRhdGFzdG9yZS5leGlzdHMoaW5kZXhlZERhdGFLZXkpKSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCBjcmVhdGVJbmRleEZpbGUoXG4gICAgICAgIGRhdGFzdG9yZSxcbiAgICAgICAgaW5kZXhlZERhdGFLZXksXG4gICAgICAgIGluZGV4LFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG59O1xuIiwiaW1wb3J0IHsgZmxhdHRlbiwgbWVyZ2UgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgc2FmZUtleSwgYXBpV3JhcHBlciwgJCxcbiAgZXZlbnRzLCBpc05vbkVtcHR5U3RyaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcmVhZEluZGV4LCBzZWFyY2hJbmRleCB9IGZyb20gJy4uL2luZGV4aW5nL3JlYWQnO1xuaW1wb3J0IHtcbiAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5LFxuICBnZXRTaGFyZEtleXNJblJhbmdlLFxufSBmcm9tICcuLi9pbmRleGluZy9zaGFyZGluZyc7XG5pbXBvcnQge1xuICBnZXRFeGFjdE5vZGVGb3JQYXRoLCBpc0luZGV4LFxuICBpc1NoYXJkZWRJbmRleCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGxpc3RJdGVtcyA9IGFwcCA9PiBhc3luYyAoaW5kZXhLZXksIG9wdGlvbnMpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmluZGV4QXBpLmxpc3RJdGVtcyxcbiAgcGVybWlzc2lvbi5yZWFkSW5kZXguaXNBdXRob3JpemVkKGluZGV4S2V5KSxcbiAgeyBpbmRleEtleSwgb3B0aW9ucyB9LFxuICBfbGlzdEl0ZW1zLCBhcHAsIGluZGV4S2V5LCBvcHRpb25zLFxuKTtcblxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7IHJhbmdlU3RhcnRQYXJhbXM6IG51bGwsIHJhbmdlRW5kUGFyYW1zOiBudWxsLCBzZWFyY2hQaHJhc2U6IG51bGwgfTtcblxuY29uc3QgX2xpc3RJdGVtcyA9IGFzeW5jIChhcHAsIGluZGV4S2V5LCBvcHRpb25zID0gZGVmYXVsdE9wdGlvbnMpID0+IHtcbiAgY29uc3QgeyBzZWFyY2hQaHJhc2UsIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zIH0gPSAkKHt9LCBbXG4gICAgbWVyZ2Uob3B0aW9ucyksXG4gICAgbWVyZ2UoZGVmYXVsdE9wdGlvbnMpLFxuICBdKTtcblxuICBjb25zdCBnZXRJdGVtcyA9IGFzeW5jIGtleSA9PiAoaXNOb25FbXB0eVN0cmluZyhzZWFyY2hQaHJhc2UpXG4gICAgPyBhd2FpdCBzZWFyY2hJbmRleChcbiAgICAgIGFwcC5oaWVyYXJjaHksXG4gICAgICBhcHAuZGF0YXN0b3JlLFxuICAgICAgaW5kZXhOb2RlLFxuICAgICAga2V5LFxuICAgICAgc2VhcmNoUGhyYXNlLFxuICAgIClcbiAgICA6IGF3YWl0IHJlYWRJbmRleChcbiAgICAgIGFwcC5oaWVyYXJjaHksXG4gICAgICBhcHAuZGF0YXN0b3JlLFxuICAgICAgaW5kZXhOb2RlLFxuICAgICAga2V5LFxuICAgICkpO1xuXG4gIGluZGV4S2V5ID0gc2FmZUtleShpbmRleEtleSk7XG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoaW5kZXhLZXkpO1xuXG4gIGlmICghaXNJbmRleChpbmRleE5vZGUpKSB7IHRocm93IG5ldyBFcnJvcignc3VwcGxpZWQga2V5IGlzIG5vdCBhbiBpbmRleCcpOyB9XG5cbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICBjb25zdCBzaGFyZEtleXMgPSBhd2FpdCBnZXRTaGFyZEtleXNJblJhbmdlKFxuICAgICAgYXBwLCBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMsXG4gICAgKTtcbiAgICBjb25zdCBpdGVtcyA9IFtdO1xuICAgIGZvciAoY29uc3QgayBvZiBzaGFyZEtleXMpIHtcbiAgICAgIGl0ZW1zLnB1c2goYXdhaXQgZ2V0SXRlbXMoaykpO1xuICAgIH1cbiAgICByZXR1cm4gZmxhdHRlbihpdGVtcyk7XG4gIH1cbiAgcmV0dXJuIGF3YWl0IGdldEl0ZW1zKFxuICAgIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleShpbmRleEtleSksXG4gICk7XG59O1xuIiwiaW1wb3J0IHsgbWFwLCBpc1N0cmluZywgaGFzLCBzb21lIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXG4gIGZpbmRGaWVsZCwgZ2V0Tm9kZSwgaXNHbG9iYWxJbmRleCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IGxpc3RJdGVtcyB9IGZyb20gJy4uL2luZGV4QXBpL2xpc3RJdGVtcyc7XG5pbXBvcnQge1xuICAkLCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0SW5kZXhLZXlfQmFzZWRPbkRlY2VuZGFudCB9IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGdldENvbnRleHQgPSBhcHAgPT4gcmVjb3JkS2V5ID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5yZWNvcmRBcGkuZ2V0Q29udGV4dCxcbiAgcGVybWlzc2lvbi5yZWFkUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmRLZXkpLFxuICB7IHJlY29yZEtleSB9LFxuICBfZ2V0Q29udGV4dCwgYXBwLCByZWNvcmRLZXksXG4pO1xuXG5leHBvcnQgY29uc3QgX2dldENvbnRleHQgPSAoYXBwLCByZWNvcmRLZXkpID0+IHtcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkocmVjb3JkS2V5KTtcblxuICBjb25zdCBjYWNoZWRSZWZlcmVuY2VJbmRleGVzID0ge307XG5cbiAgY29uc3QgbGF6eUxvYWRSZWZlcmVuY2VJbmRleCA9IGFzeW5jICh0eXBlT3B0aW9ucykgPT4ge1xuICAgIGlmICghaGFzKHR5cGVPcHRpb25zLmluZGV4Tm9kZUtleSkoY2FjaGVkUmVmZXJlbmNlSW5kZXhlcykpIHtcbiAgICAgIGNhY2hlZFJlZmVyZW5jZUluZGV4ZXNbdHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5XSA9IHtcbiAgICAgICAgdHlwZU9wdGlvbnMsXG4gICAgICAgIGRhdGE6IGF3YWl0IHJlYWRSZWZlcmVuY2VJbmRleChcbiAgICAgICAgICBhcHAsIHJlY29yZEtleSwgdHlwZU9wdGlvbnMsXG4gICAgICAgICksXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBjYWNoZWRSZWZlcmVuY2VJbmRleGVzW3R5cGVPcHRpb25zLmluZGV4Tm9kZUtleV07XG4gIH07XG5cbiAgY29uc3QgZ2V0VHlwZU9wdGlvbnMgPSB0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUgPT4gKGlzU3RyaW5nKHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSlcbiAgICA/IGZpbmRGaWVsZChyZWNvcmROb2RlLCB0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUpXG4gICAgICAudHlwZU9wdGlvbnNcbiAgICA6IHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSk7XG5cbiAgcmV0dXJuIHtcbiAgICByZWZlcmVuY2VFeGlzdHM6IGFzeW5jICh0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUsIGtleSkgPT4ge1xuICAgICAgY29uc3QgdHlwZU9wdGlvbnMgPSBnZXRUeXBlT3B0aW9ucyh0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUpO1xuICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBsYXp5TG9hZFJlZmVyZW5jZUluZGV4KHR5cGVPcHRpb25zKTtcbiAgICAgIHJldHVybiBzb21lKGkgPT4gaS5rZXkgPT09IGtleSkoZGF0YSk7XG4gICAgfSxcbiAgICByZWZlcmVuY2VPcHRpb25zOiBhc3luYyAodHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKSA9PiB7XG4gICAgICBjb25zdCB0eXBlT3B0aW9ucyA9IGdldFR5cGVPcHRpb25zKHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSk7XG4gICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGxhenlMb2FkUmVmZXJlbmNlSW5kZXgodHlwZU9wdGlvbnMpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSxcbiAgICByZWNvcmROb2RlLFxuICB9O1xufTtcblxuY29uc3QgcmVhZFJlZmVyZW5jZUluZGV4ID0gYXN5bmMgKGFwcCwgcmVjb3JkS2V5LCB0eXBlT3B0aW9ucykgPT4ge1xuICBjb25zdCBpbmRleE5vZGUgPSBnZXROb2RlKGFwcC5oaWVyYXJjaHksIHR5cGVPcHRpb25zLmluZGV4Tm9kZUtleSk7XG4gIGNvbnN0IGluZGV4S2V5ID0gaXNHbG9iYWxJbmRleChpbmRleE5vZGUpXG4gICAgPyBpbmRleE5vZGUubm9kZUtleSgpXG4gICAgOiBnZXRJbmRleEtleV9CYXNlZE9uRGVjZW5kYW50KFxuICAgICAgcmVjb3JkS2V5LCBpbmRleE5vZGUsXG4gICAgKTtcblxuICBjb25zdCBpdGVtcyA9IGF3YWl0IGxpc3RJdGVtcyhhcHApKGluZGV4S2V5KTtcbiAgcmV0dXJuICQoaXRlbXMsIFtcbiAgICBtYXAoaSA9PiAoe1xuICAgICAga2V5OiBpLmtleSxcbiAgICAgIHZhbHVlOiBpW3R5cGVPcHRpb25zLmRpc3BsYXlWYWx1ZV0sXG4gICAgfSkpLFxuICBdKTtcbn07XG4iLCJpbXBvcnQge1xuICBtYXAsIHJlZHVjZSwgZmlsdGVyLFxuICBpc0VtcHR5LCBmbGF0dGVuLCBlYWNoLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgY29tcGlsZUV4cHJlc3Npb24gfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgZ2V0RXhhY3ROb2RlRm9yUGF0aCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyB2YWxpZGF0ZUZpZWxkUGFyc2UsIHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgJCwgaXNOb3RoaW5nLCBpc05vbkVtcHR5U3RyaW5nIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IF9nZXRDb250ZXh0IH0gZnJvbSAnLi9nZXRDb250ZXh0JztcblxuY29uc3QgZmllbGRQYXJzZUVycm9yID0gKGZpZWxkTmFtZSwgdmFsdWUpID0+ICh7XG4gIGZpZWxkczogW2ZpZWxkTmFtZV0sXG4gIG1lc3NhZ2U6IGBDb3VsZCBub3QgcGFyc2UgZmllbGQgJHtmaWVsZE5hbWV9OiR7dmFsdWV9YCxcbn0pO1xuXG5jb25zdCB2YWxpZGF0ZUFsbEZpZWxkUGFyc2UgPSAocmVjb3JkLCByZWNvcmROb2RlKSA9PiAkKHJlY29yZE5vZGUuZmllbGRzLCBbXG4gIG1hcChmID0+ICh7IG5hbWU6IGYubmFtZSwgcGFyc2VSZXN1bHQ6IHZhbGlkYXRlRmllbGRQYXJzZShmLCByZWNvcmQpIH0pKSxcbiAgcmVkdWNlKChlcnJvcnMsIGYpID0+IHtcbiAgICBpZiAoZi5wYXJzZVJlc3VsdC5zdWNjZXNzKSByZXR1cm4gZXJyb3JzO1xuICAgIGVycm9ycy5wdXNoKFxuICAgICAgZmllbGRQYXJzZUVycm9yKGYubmFtZSwgZi5wYXJzZVJlc3VsdC52YWx1ZSksXG4gICAgKTtcbiAgICByZXR1cm4gZXJyb3JzO1xuICB9LCBbXSksXG5dKTtcblxuY29uc3QgdmFsaWRhdGVBbGxUeXBlQ29uc3RyYWludHMgPSBhc3luYyAocmVjb3JkLCByZWNvcmROb2RlLCBjb250ZXh0KSA9PiB7XG4gIGNvbnN0IGVycm9ycyA9IFtdO1xuICBmb3IgKGNvbnN0IGZpZWxkIG9mIHJlY29yZE5vZGUuZmllbGRzKSB7XG4gICAgJChhd2FpdCB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyhmaWVsZCwgcmVjb3JkLCBjb250ZXh0KSwgW1xuICAgICAgZmlsdGVyKGlzTm9uRW1wdHlTdHJpbmcpLFxuICAgICAgbWFwKG0gPT4gKHsgbWVzc2FnZTogbSwgZmllbGRzOiBbZmllbGQubmFtZV0gfSkpLFxuICAgICAgZWFjaChlID0+IGVycm9ycy5wdXNoKGUpKSxcbiAgICBdKTtcbiAgfVxuICByZXR1cm4gZXJyb3JzO1xufTtcblxuY29uc3QgcnVuUmVjb3JkVmFsaWRhdGlvblJ1bGVzID0gKHJlY29yZCwgcmVjb3JkTm9kZSkgPT4ge1xuICBjb25zdCBydW5WYWxpZGF0aW9uUnVsZSA9IChydWxlKSA9PiB7XG4gICAgY29uc3QgaXNWYWxpZCA9IGNvbXBpbGVFeHByZXNzaW9uKHJ1bGUuZXhwcmVzc2lvbldoZW5WYWxpZCk7XG4gICAgY29uc3QgZXhwcmVzc2lvbkNvbnRleHQgPSB7IHJlY29yZCwgXyB9O1xuICAgIHJldHVybiAoaXNWYWxpZChleHByZXNzaW9uQ29udGV4dClcbiAgICAgID8geyB2YWxpZDogdHJ1ZSB9XG4gICAgICA6ICh7XG4gICAgICAgIHZhbGlkOiBmYWxzZSxcbiAgICAgICAgZmllbGRzOiBydWxlLmludmFsaWRGaWVsZHMsXG4gICAgICAgIG1lc3NhZ2U6IHJ1bGUubWVzc2FnZVdoZW5JbnZhbGlkLFxuICAgICAgfSkpO1xuICB9O1xuXG4gIHJldHVybiAkKHJlY29yZE5vZGUudmFsaWRhdGlvblJ1bGVzLCBbXG4gICAgbWFwKHJ1blZhbGlkYXRpb25SdWxlKSxcbiAgICBmbGF0dGVuLFxuICAgIGZpbHRlcihyID0+IHIudmFsaWQgPT09IGZhbHNlKSxcbiAgICBtYXAociA9PiAoeyBmaWVsZHM6IHIuZmllbGRzLCBtZXNzYWdlOiByLm1lc3NhZ2UgfSkpLFxuICBdKTtcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZSA9IGFwcCA9PiBhc3luYyAocmVjb3JkLCBjb250ZXh0KSA9PiB7XG4gIGNvbnRleHQgPSBpc05vdGhpbmcoY29udGV4dClcbiAgICA/IF9nZXRDb250ZXh0KGFwcCwgcmVjb3JkLmtleSlcbiAgICA6IGNvbnRleHQ7XG5cbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkocmVjb3JkLmtleSk7XG4gIGNvbnN0IGZpZWxkUGFyc2VGYWlscyA9IHZhbGlkYXRlQWxsRmllbGRQYXJzZShyZWNvcmQsIHJlY29yZE5vZGUpO1xuXG4gIC8vIG5vbiBwYXJzaW5nIHdvdWxkIGNhdXNlIGZ1cnRoZXIgaXNzdWVzIC0gZXhpdCBoZXJlXG4gIGlmICghaXNFbXB0eShmaWVsZFBhcnNlRmFpbHMpKSB7IHJldHVybiAoeyBpc1ZhbGlkOiBmYWxzZSwgZXJyb3JzOiBmaWVsZFBhcnNlRmFpbHMgfSk7IH1cblxuICBjb25zdCByZWNvcmRWYWxpZGF0aW9uUnVsZUZhaWxzID0gcnVuUmVjb3JkVmFsaWRhdGlvblJ1bGVzKHJlY29yZCwgcmVjb3JkTm9kZSk7XG4gIGNvbnN0IHR5cGVDb250cmFpbnRGYWlscyA9IGF3YWl0IHZhbGlkYXRlQWxsVHlwZUNvbnN0cmFpbnRzKHJlY29yZCwgcmVjb3JkTm9kZSwgY29udGV4dCk7XG5cbiAgaWYgKGlzRW1wdHkoZmllbGRQYXJzZUZhaWxzKVxuICAgICAgICYmIGlzRW1wdHkocmVjb3JkVmFsaWRhdGlvblJ1bGVGYWlscylcbiAgICAgICAmJiBpc0VtcHR5KHR5cGVDb250cmFpbnRGYWlscykpIHtcbiAgICByZXR1cm4gKHsgaXNWYWxpZDogdHJ1ZSwgZXJyb3JzOiBbXSB9KTtcbiAgfVxuXG4gIHJldHVybiAoe1xuICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgIGVycm9yczogXy51bmlvbihmaWVsZFBhcnNlRmFpbHMsIHR5cGVDb250cmFpbnRGYWlscywgcmVjb3JkVmFsaWRhdGlvblJ1bGVGYWlscyksXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IGZpbHRlciB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGlzQ29sbGVjdGlvblJlY29yZCxcbiAgaXNSb290LFxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgJCwgYWxsVHJ1ZSwgam9pbktleSB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmNvbnN0IGVuc3VyZUNvbGxlY3Rpb25Jc0luaXRpYWxpc2VkID0gYXN5bmMgKGRhdGFzdG9yZSwgbm9kZSwgcGFyZW50S2V5KSA9PiB7XG4gIGlmICghYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhwYXJlbnRLZXkpKSB7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihwYXJlbnRLZXkpO1xuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoXG4gICAgICBqb2luS2V5KHBhcmVudEtleSwgJ2FsbGlkcycpLFxuICAgICk7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihcbiAgICAgIGpvaW5LZXkoXG4gICAgICAgIHBhcmVudEtleSxcbiAgICAgICAgJ2FsbGlkcycsXG4gICAgICAgIG5vZGUubm9kZUlkLnRvU3RyaW5nKCksXG4gICAgICApLFxuICAgICk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlUm9vdENvbGxlY3Rpb25zID0gYXN5bmMgKGRhdGFzdG9yZSwgaGllcmFyY2h5KSA9PiB7XG4gIGNvbnN0IHJvb3RDb2xsZWN0aW9uUmVjb3JkID0gYWxsVHJ1ZShcbiAgICBuID0+IGlzUm9vdChuLnBhcmVudCgpKSxcbiAgICBpc0NvbGxlY3Rpb25SZWNvcmQsXG4gICk7XG5cbiAgY29uc3QgZmxhdGhpZXJhcmNoeSA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShoaWVyYXJjaHkpO1xuXG4gIGNvbnN0IGNvbGxlY3Rpb25SZWNvcmRzID0gJChmbGF0aGllcmFyY2h5LCBbXG4gICAgZmlsdGVyKHJvb3RDb2xsZWN0aW9uUmVjb3JkKSxcbiAgXSk7XG5cbiAgZm9yIChjb25zdCBjb2wgb2YgY29sbGVjdGlvblJlY29yZHMpIHtcbiAgICBhd2FpdCBlbnN1cmVDb2xsZWN0aW9uSXNJbml0aWFsaXNlZChcbiAgICAgIGRhdGFzdG9yZSxcbiAgICAgIGNvbCxcbiAgICAgIGNvbC5jb2xsZWN0aW9uUGF0aFJlZ3goKSxcbiAgICApO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgaW5pdGlhbGlzZUNoaWxkQ29sbGVjdGlvbnMgPSBhc3luYyAoYXBwLCByZWNvcmRLZXkpID0+IHtcbiAgY29uc3QgY2hpbGRDb2xsZWN0aW9uUmVjb3JkcyA9ICQocmVjb3JkS2V5LCBbXG4gICAgZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KSxcbiAgICBuID0+IG4uY2hpbGRyZW4sXG4gICAgZmlsdGVyKGlzQ29sbGVjdGlvblJlY29yZCksXG4gIF0pO1xuXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRDb2xsZWN0aW9uUmVjb3Jkcykge1xuICAgIGF3YWl0IGVuc3VyZUNvbGxlY3Rpb25Jc0luaXRpYWxpc2VkKFxuICAgICAgYXBwLmRhdGFzdG9yZSxcbiAgICAgIGNoaWxkLFxuICAgICAgam9pbktleShyZWNvcmRLZXksIGNoaWxkLmNvbGxlY3Rpb25OYW1lKSxcbiAgICApO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgam9pbiwgcHVsbCxcbiAgbWFwLCBmbGF0dGVuLCBvcmRlckJ5LFxuICBmaWx0ZXIsIGZpbmQsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRQYXJlbnRLZXksXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZ2V0Q29sbGVjdGlvbk5vZGVCeUtleU9yTm9kZUtleSwgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoLFxuICBpc0NvbGxlY3Rpb25SZWNvcmQsIGlzQW5jZXN0b3IsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBqb2luS2V5LCBzYWZlS2V5LCAkIH0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgYWxsSWRDaGFycyA9ICcwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWl8tJztcblxuY29uc3QgYWxsSWRzU3RyaW5nc0ZvckZhY3RvciA9IChjb2xsZWN0aW9uTm9kZSkgPT4ge1xuICBjb25zdCBmYWN0b3IgPSBjb2xsZWN0aW9uTm9kZS5hbGxpZHNTaGFyZEZhY3RvcjtcbiAgY29uc3QgY2hhclJhbmdlUGVyU2hhcmQgPSA2NCAvIGZhY3RvcjtcbiAgY29uc3QgYWxsSWRTdHJpbmdzID0gW107XG4gIGxldCBpbmRleCA9IDA7XG4gIGxldCBjdXJyZW50SWRzU2hhcmQgPSAnJztcbiAgd2hpbGUgKGluZGV4IDwgNjQpIHtcbiAgICBjdXJyZW50SWRzU2hhcmQgKz0gYWxsSWRDaGFyc1tpbmRleF07XG4gICAgaWYgKChpbmRleCArIDEpICUgY2hhclJhbmdlUGVyU2hhcmQgPT09IDApIHtcbiAgICAgIGFsbElkU3RyaW5ncy5wdXNoKGN1cnJlbnRJZHNTaGFyZCk7XG4gICAgICBjdXJyZW50SWRzU2hhcmQgPSAnJztcbiAgICB9XG4gICAgaW5kZXgrKztcbiAgfVxuXG4gIHJldHVybiBhbGxJZFN0cmluZ3M7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsSWRzU2hhcmROYW1lcyA9IChhcHBIaWVyYXJjaHksIGNvbGxlY3Rpb25LZXkpID0+IHtcbiAgY29uc3QgY29sbGVjdGlvblJlY29yZE5vZGUgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwSGllcmFyY2h5KShjb2xsZWN0aW9uS2V5KTtcbiAgcmV0dXJuICQoY29sbGVjdGlvblJlY29yZE5vZGUsIFtcbiAgICBjID0+IFtjLm5vZGVJZF0sXG4gICAgbWFwKGkgPT4gbWFwKGMgPT4gX2FsbElkc1NoYXJkS2V5KGNvbGxlY3Rpb25LZXksIGksIGMpKShhbGxJZHNTdHJpbmdzRm9yRmFjdG9yKGNvbGxlY3Rpb25SZWNvcmROb2RlKSkpLFxuICAgIGZsYXR0ZW4sXG4gIF0pO1xufTtcblxuY29uc3QgX2FsbElkc1NoYXJkS2V5ID0gKGNvbGxlY3Rpb25LZXksIGNoaWxkTm8sIHNoYXJkS2V5KSA9PiBqb2luS2V5KFxuICBjb2xsZWN0aW9uS2V5LFxuICAnYWxsaWRzJyxcbiAgY2hpbGRObyxcbiAgc2hhcmRLZXksXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsSWRzU2hhcmRLZXkgPSAoYXBwSGllcmFyY2h5LCBjb2xsZWN0aW9uS2V5LCByZWNvcmRJZCkgPT4ge1xuICBjb25zdCBpbmRleE9mRmlyc3REYXNoID0gcmVjb3JkSWQuaW5kZXhPZignLScpO1xuXG4gIGNvbnN0IGNvbGxlY3Rpb25Ob2RlID0gZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoKGFwcEhpZXJhcmNoeSkoY29sbGVjdGlvbktleSk7XG5cbiAgY29uc3QgaWRGaXJzdENoYXIgPSByZWNvcmRJZFtpbmRleE9mRmlyc3REYXNoICsgMV07XG4gIGNvbnN0IGFsbElkc1NoYXJkSWQgPSAkKGNvbGxlY3Rpb25Ob2RlLCBbXG4gICAgYWxsSWRzU3RyaW5nc0ZvckZhY3RvcixcbiAgICBmaW5kKGkgPT4gaS5pbmNsdWRlcyhpZEZpcnN0Q2hhcikpLFxuICBdKTtcblxuICByZXR1cm4gX2FsbElkc1NoYXJkS2V5KFxuICAgIGNvbGxlY3Rpb25LZXksXG4gICAgcmVjb3JkSWQuc2xpY2UoMCwgaW5kZXhPZkZpcnN0RGFzaCksXG4gICAgYWxsSWRzU2hhcmRJZCxcbiAgKTtcbn07XG5cbmNvbnN0IGdldE9yQ3JlYXRlU2hhcmRGaWxlID0gYXN5bmMgKGRhdGFzdG9yZSwgYWxsSWRzS2V5KSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGRhdGFzdG9yZS5sb2FkRmlsZShhbGxJZHNLZXkpO1xuICB9IGNhdGNoIChlTG9hZCkge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRmlsZShhbGxJZHNLZXksICcnKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9IGNhdGNoIChlQ3JlYXRlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBFcnJvciBsb2FkaW5nLCB0aGVuIGNyZWF0aW5nIGFsbElkcyAke2FsbElkc0tleVxuICAgICAgICB9IDogTE9BRCA6ICR7ZUxvYWQubWVzc2FnZVxuICAgICAgICB9IDogQ1JFQVRFIDogJHtlQ3JlYXRlfWAsXG4gICAgICApO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3QgZ2V0U2hhcmRGaWxlID0gYXN5bmMgKGRhdGFzdG9yZSwgYWxsSWRzS2V5KSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGRhdGFzdG9yZS5sb2FkRmlsZShhbGxJZHNLZXkpO1xuICB9IGNhdGNoIChlTG9hZCkge1xuICAgIHJldHVybiAnJztcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGFkZFRvQWxsSWRzID0gKGFwcEhpZXJhcmNoeSwgZGF0YXN0b3JlKSA9PiBhc3luYyAocmVjb3JkKSA9PiB7XG4gIGNvbnN0IGFsbElkc0tleSA9IGdldEFsbElkc1NoYXJkS2V5KFxuICAgIGFwcEhpZXJhcmNoeSxcbiAgICBnZXRQYXJlbnRLZXkocmVjb3JkLmtleSksXG4gICAgcmVjb3JkLmlkLFxuICApO1xuXG4gIGxldCBhbGxJZHMgPSBhd2FpdCBnZXRPckNyZWF0ZVNoYXJkRmlsZShkYXRhc3RvcmUsIGFsbElkc0tleSk7XG5cbiAgYWxsSWRzICs9IGAke2FsbElkcy5sZW5ndGggPiAwID8gJywnIDogJyd9JHtyZWNvcmQuaWR9YDtcblxuICBhd2FpdCBkYXRhc3RvcmUudXBkYXRlRmlsZShhbGxJZHNLZXksIGFsbElkcyk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsSWRzSXRlcmF0b3IgPSBhcHAgPT4gYXN5bmMgKGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXkpID0+IHtcbiAgY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSA9IHNhZmVLZXkoY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSk7XG4gIGNvbnN0IHRhcmdldE5vZGUgPSBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5KFxuICAgIGFwcC5oaWVyYXJjaHksXG4gICAgY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSxcbiAgKTtcblxuICBjb25zdCBnZXRBbGxJZHNJdGVyYXRvckZvckNvbGxlY3Rpb25LZXkgPSBhc3luYyAoY29sbGVjdGlvbktleSkgPT4ge1xuICAgIGNvbnN0IGFsbF9hbGxJZHNLZXlzID0gZ2V0QWxsSWRzU2hhcmROYW1lcyhhcHAuaGllcmFyY2h5LCBjb2xsZWN0aW9uS2V5KTtcbiAgICBsZXQgc2hhcmRJbmRleCA9IDA7XG5cbiAgICBjb25zdCBhbGxJZHNGcm9tU2hhcmRJdGVyYXRvciA9IGFzeW5jICgpID0+IHtcbiAgICAgIGlmIChzaGFyZEluZGV4ID09PSBhbGxfYWxsSWRzS2V5cy5sZW5ndGgpIHsgcmV0dXJuICh7IGRvbmU6IHRydWUsIHJlc3VsdDogeyBpZHM6IFtdLCBjb2xsZWN0aW9uS2V5IH0gfSk7IH1cblxuICAgICAgY29uc3Qgc2hhcmRLZXkgPSBhbGxfYWxsSWRzS2V5c1tzaGFyZEluZGV4XTtcblxuICAgICAgY29uc3QgYWxsSWRzID0gYXdhaXQgZ2V0QWxsSWRzRnJvbVNoYXJkKGFwcC5kYXRhc3RvcmUsIHNoYXJkS2V5KTtcblxuICAgICAgc2hhcmRJbmRleCsrO1xuXG4gICAgICByZXR1cm4gKHtcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgaWRzOiBhbGxJZHMsXG4gICAgICAgICAgY29sbGVjdGlvbktleSxcbiAgICAgICAgfSxcbiAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGFsbElkc0Zyb21TaGFyZEl0ZXJhdG9yO1xuICB9O1xuXG4gIGNvbnN0IGFuY2VzdG9ycyA9ICQoZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGFwcC5oaWVyYXJjaHkpLCBbXG4gICAgZmlsdGVyKGlzQ29sbGVjdGlvblJlY29yZCksXG4gICAgZmlsdGVyKG4gPT4gaXNBbmNlc3Rvcih0YXJnZXROb2RlKShuKVxuICAgICAgICAgICAgICAgICAgICB8fCBuLm5vZGVLZXkoKSA9PT0gdGFyZ2V0Tm9kZS5ub2RlS2V5KCkpLFxuICAgIG9yZGVyQnkoW24gPT4gbi5ub2RlS2V5KCkubGVuZ3RoXSwgWydhc2MnXSksXG4gIF0pOyAvLyBwYXJlbnRzIGZpcnN0XG5cbiAgY29uc3QgdHJhdmVyc2VGb3JJdGVyYXRlcmF0b3JzID0gYXN5bmMgKHBhcmVudFJlY29yZEtleSA9ICcnLCBjdXJyZW50Tm9kZUluZGV4ID0gMCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gYW5jZXN0b3JzW2N1cnJlbnROb2RlSW5kZXhdO1xuICAgIGNvbnN0IGN1cnJlbnRDb2xsZWN0aW9uS2V5ID0gam9pbktleShcbiAgICAgIHBhcmVudFJlY29yZEtleSxcbiAgICAgIGN1cnJlbnROb2RlLmNvbGxlY3Rpb25OYW1lLFxuICAgICk7XG4gICAgaWYgKGN1cnJlbnROb2RlLm5vZGVLZXkoKSA9PT0gdGFyZ2V0Tm9kZS5ub2RlS2V5KCkpIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yRm9yQ29sbGVjdGlvbktleShcbiAgICAgICAgICBjdXJyZW50Q29sbGVjdGlvbktleSxcbiAgICAgICAgKV07XG4gICAgfVxuICAgIGNvbnN0IGFsbEl0ZXJhdG9ycyA9IFtdO1xuICAgIGNvbnN0IGN1cnJlbnRJdGVyYXRvciA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yRm9yQ29sbGVjdGlvbktleShcbiAgICAgIGN1cnJlbnRDb2xsZWN0aW9uS2V5LFxuICAgICk7XG5cbiAgICBsZXQgaWRzID0gYXdhaXQgY3VycmVudEl0ZXJhdG9yKCk7XG4gICAgd2hpbGUgKGlkcy5kb25lID09PSBmYWxzZSkge1xuICAgICAgZm9yIChjb25zdCBpZCBvZiBpZHMucmVzdWx0Lmlkcykge1xuICAgICAgICBhbGxJdGVyYXRvcnMucHVzaChcbiAgICAgICAgICBhd2FpdCB0cmF2ZXJzZUZvckl0ZXJhdGVyYXRvcnMoXG4gICAgICAgICAgICBqb2luS2V5KGN1cnJlbnRDb2xsZWN0aW9uS2V5LCBpZCksXG4gICAgICAgICAgICBjdXJyZW50Tm9kZUluZGV4ICsgMSxcbiAgICAgICAgICApLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZHMgPSBhd2FpdCBjdXJyZW50SXRlcmF0b3IoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmxhdHRlbihhbGxJdGVyYXRvcnMpO1xuICB9O1xuXG4gIGNvbnN0IGl0ZXJhdG9yc0FycmF5ID0gYXdhaXQgdHJhdmVyc2VGb3JJdGVyYXRlcmF0b3JzKCk7XG4gIGxldCBjdXJyZW50SXRlcmF0b3JJbmRleCA9IDA7XG4gIHJldHVybiBhc3luYyAoKSA9PiB7XG4gICAgaWYgKGl0ZXJhdG9yc0FycmF5Lmxlbmd0aCA9PT0gMCkgeyByZXR1cm4geyBkb25lOiB0cnVlLCByZXN1bHQ6IFtdIH07IH1cbiAgICBjb25zdCBpbm5lclJlc3VsdCA9IGF3YWl0IGl0ZXJhdG9yc0FycmF5W2N1cnJlbnRJdGVyYXRvckluZGV4XSgpO1xuICAgIGlmICghaW5uZXJSZXN1bHQuZG9uZSkgeyByZXR1cm4gaW5uZXJSZXN1bHQ7IH1cbiAgICBpZiAoY3VycmVudEl0ZXJhdG9ySW5kZXggPT0gaXRlcmF0b3JzQXJyYXkubGVuZ3RoIC0gMSkge1xuICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgcmVzdWx0OiBpbm5lclJlc3VsdC5yZXN1bHQgfTtcbiAgICB9XG4gICAgY3VycmVudEl0ZXJhdG9ySW5kZXgrKztcbiAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgcmVzdWx0OiBpbm5lclJlc3VsdC5yZXN1bHQgfTtcbiAgfTtcbn07XG5cbmNvbnN0IGdldEFsbElkc0Zyb21TaGFyZCA9IGFzeW5jIChkYXRhc3RvcmUsIHNoYXJkS2V5KSA9PiB7XG4gIGNvbnN0IGFsbElkc1N0ciA9IGF3YWl0IGdldFNoYXJkRmlsZShkYXRhc3RvcmUsIHNoYXJkS2V5KTtcblxuICBjb25zdCBhbGxJZHMgPSBbXTtcbiAgbGV0IGN1cnJlbnRJZCA9ICcnO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbElkc1N0ci5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGN1cnJlbnRDaGFyID0gYWxsSWRzU3RyLmNoYXJBdChpKTtcbiAgICBjb25zdCBpc0xhc3QgPSAoaSA9PT0gYWxsSWRzU3RyLmxlbmd0aCAtIDEpO1xuICAgIGlmIChjdXJyZW50Q2hhciA9PT0gJywnIHx8IGlzTGFzdCkge1xuICAgICAgaWYgKGlzTGFzdCkgY3VycmVudElkICs9IGN1cnJlbnRDaGFyO1xuICAgICAgYWxsSWRzLnB1c2goY3VycmVudElkKTtcbiAgICAgIGN1cnJlbnRJZCA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50SWQgKz0gY3VycmVudENoYXI7XG4gICAgfVxuICB9XG4gIHJldHVybiBhbGxJZHM7XG59O1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlRnJvbUFsbElkcyA9IChhcHBIaWVyYXJjaHksIGRhdGFzdG9yZSkgPT4gYXN5bmMgKHJlY29yZCkgPT4ge1xuICBjb25zdCBzaGFyZEtleSA9IGdldEFsbElkc1NoYXJkS2V5KFxuICAgIGFwcEhpZXJhcmNoeSxcbiAgICBnZXRQYXJlbnRLZXkocmVjb3JkLmtleSksXG4gICAgcmVjb3JkLmlkLFxuICApO1xuICBjb25zdCBhbGxJZHMgPSBhd2FpdCBnZXRBbGxJZHNGcm9tU2hhcmQoZGF0YXN0b3JlLCBzaGFyZEtleSk7XG5cbiAgY29uc3QgbmV3SWRzID0gJChhbGxJZHMsIFtcbiAgICBwdWxsKHJlY29yZC5pZCksXG4gICAgam9pbignLCcpLFxuICBdKTtcblxuICBhd2FpdCBkYXRhc3RvcmUudXBkYXRlRmlsZShzaGFyZEtleSwgbmV3SWRzKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldEFsbElkc0l0ZXJhdG9yO1xuIiwiaW1wb3J0IHtcbiAgam9pbktleSwga2V5U2VwLCBnZXRIYXNoQ29kZSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldExhc3RQYXJ0SW5LZXkgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuXG5leHBvcnQgY29uc3QgVFJBTlNBQ1RJT05TX0ZPTERFUiA9IGAke2tleVNlcH0udHJhbnNhY3Rpb25zYDtcbmV4cG9ydCBjb25zdCBMT0NLX0ZJTEVOQU1FID0gJ2xvY2snO1xuZXhwb3J0IGNvbnN0IExPQ0tfRklMRV9LRVkgPSBqb2luS2V5KFxuICBUUkFOU0FDVElPTlNfRk9MREVSLCBMT0NLX0ZJTEVOQU1FLFxuKTtcbmV4cG9ydCBjb25zdCBpZFNlcCA9ICckJztcblxuY29uc3QgaXNPZlR5cGUgPSB0eXAgPT4gdHJhbnMgPT4gdHJhbnMudHJhbnNhY3Rpb25UeXBlID09PSB0eXA7XG5cbmV4cG9ydCBjb25zdCBDUkVBVEVfUkVDT1JEX1RSQU5TQUNUSU9OID0gJ2NyZWF0ZSc7XG5leHBvcnQgY29uc3QgVVBEQVRFX1JFQ09SRF9UUkFOU0FDVElPTiA9ICd1cGRhdGUnO1xuZXhwb3J0IGNvbnN0IERFTEVURV9SRUNPUkRfVFJBTlNBQ1RJT04gPSAnZGVsZXRlJztcbmV4cG9ydCBjb25zdCBCVUlMRF9JTkRFWF9UUkFOU0FDVElPTiA9ICdidWlsZCc7XG5cbmV4cG9ydCBjb25zdCBpc1VwZGF0ZSA9IGlzT2ZUeXBlKFVQREFURV9SRUNPUkRfVFJBTlNBQ1RJT04pO1xuZXhwb3J0IGNvbnN0IGlzRGVsZXRlID0gaXNPZlR5cGUoREVMRVRFX1JFQ09SRF9UUkFOU0FDVElPTik7XG5leHBvcnQgY29uc3QgaXNDcmVhdGUgPSBpc09mVHlwZShDUkVBVEVfUkVDT1JEX1RSQU5TQUNUSU9OKTtcbmV4cG9ydCBjb25zdCBpc0J1aWxkSW5kZXggPSBpc09mVHlwZShCVUlMRF9JTkRFWF9UUkFOU0FDVElPTik7XG5cbmV4cG9ydCBjb25zdCBrZXlUb0ZvbGRlck5hbWUgPSBub2RlS2V5ID0+IGdldEhhc2hDb2RlKG5vZGVLZXkpO1xuXG5leHBvcnQgY29uc3QgZ2V0VHJhbnNhY3Rpb25JZCA9IChyZWNvcmRJZCwgdHJhbnNhY3Rpb25UeXBlLCB1bmlxdWVJZCkgPT4gXG4gIGAke3JlY29yZElkfSR7aWRTZXB9JHt0cmFuc2FjdGlvblR5cGV9JHtpZFNlcH0ke3VuaXF1ZUlkfWA7XG5cbmV4cG9ydCBjb25zdCBidWlsZEluZGV4Rm9sZGVyID0gJy5CVUlMRC0nO1xuZXhwb3J0IGNvbnN0IG5vZGVLZXlIYXNoRnJvbUJ1aWxkRm9sZGVyID0gZm9sZGVyID0+IGZvbGRlci5yZXBsYWNlKGJ1aWxkSW5kZXhGb2xkZXIsICcnKTtcblxuZXhwb3J0IGNvbnN0IGlzQnVpbGRJbmRleEZvbGRlciA9IGtleSA9PiBnZXRMYXN0UGFydEluS2V5KGtleSkuc3RhcnRzV2l0aChidWlsZEluZGV4Rm9sZGVyKTtcblxuZXhwb3J0IGNvbnN0IEluZGV4Tm9kZUtleUZvbGRlciA9IGluZGV4Tm9kZUtleSA9PiBqb2luS2V5KFxuICBUUkFOU0FDVElPTlNfRk9MREVSLFxuICBidWlsZEluZGV4Rm9sZGVyICsga2V5VG9Gb2xkZXJOYW1lKGluZGV4Tm9kZUtleSksXG4pO1xuXG5leHBvcnQgY29uc3QgSW5kZXhOb2RlS2V5QmF0Y2hGb2xkZXIgPSAoaW5kZXhOb2RlS2V5LCBjb3VudCkgPT4gXG4gIGpvaW5LZXkoSW5kZXhOb2RlS2V5Rm9sZGVyKGluZGV4Tm9kZUtleSksIE1hdGguZmxvb3IoY291bnQgLyBCVUlMRElOREVYX0JBVENIX0NPVU5UKS50b1N0cmluZygpKTtcblxuZXhwb3J0IGNvbnN0IEluZGV4U2hhcmRLZXlGb2xkZXIgPSAoaW5kZXhOb2RlS2V5LCBpbmRleFNoYXJkS2V5KSA9PiBcbiAgam9pbktleShJbmRleE5vZGVLZXlGb2xkZXIoaW5kZXhOb2RlS2V5KSwgaW5kZXhTaGFyZEtleSk7XG5cbmV4cG9ydCBjb25zdCBCVUlMRElOREVYX0JBVENIX0NPVU5UID0gMTAwMDtcbmV4cG9ydCBjb25zdCB0aW1lb3V0TWlsbGlzZWNvbmRzID0gMzAgKiAxMDAwOyAvLyAzMCBzZWNzXG5leHBvcnQgY29uc3QgbWF4TG9ja1JldHJpZXMgPSAxO1xuIiwiaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcbmltcG9ydCB7IGpvaW5LZXkgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0TGFzdFBhcnRJbktleSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xuICBJbmRleE5vZGVLZXlGb2xkZXIsIEJVSUxESU5ERVhfQkFUQ0hfQ09VTlQsXG4gIEluZGV4Tm9kZUtleUJhdGNoRm9sZGVyLCBUUkFOU0FDVElPTlNfRk9MREVSLCBnZXRUcmFuc2FjdGlvbklkLCBDUkVBVEVfUkVDT1JEX1RSQU5TQUNUSU9OLCBVUERBVEVfUkVDT1JEX1RSQU5TQUNUSU9OLFxuICBERUxFVEVfUkVDT1JEX1RSQU5TQUNUSU9OLCBCVUlMRF9JTkRFWF9UUkFOU0FDVElPTixcbn0gZnJvbSAnLi90cmFuc2FjdGlvbnNDb21tb24nO1xuXG5cbmV4cG9ydCBjb25zdCB0cmFuc2FjdGlvbkZvckNyZWF0ZVJlY29yZCA9IGFzeW5jIChhcHAsIHJlY29yZCkgPT4gYXdhaXQgdHJhbnNhY3Rpb24oXG4gIGFwcC5kYXRhc3RvcmUsIENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04sXG4gIHJlY29yZC5rZXksIHsgcmVjb3JkIH0sXG4gIGdldFRyYW5zYWN0aW9uS2V5X1JlY29yZHMsXG4pO1xuXG5leHBvcnQgY29uc3QgdHJhbnNhY3Rpb25Gb3JVcGRhdGVSZWNvcmQgPSBhc3luYyAoYXBwLCBvbGRSZWNvcmQsIG5ld1JlY29yZCkgPT4gYXdhaXQgdHJhbnNhY3Rpb24oXG4gIGFwcC5kYXRhc3RvcmUsIFVQREFURV9SRUNPUkRfVFJBTlNBQ1RJT04sXG4gIG5ld1JlY29yZC5rZXksIHsgb2xkUmVjb3JkLCByZWNvcmQ6IG5ld1JlY29yZCB9LFxuICBnZXRUcmFuc2FjdGlvbktleV9SZWNvcmRzLFxuKTtcblxuZXhwb3J0IGNvbnN0IHRyYW5zYWN0aW9uRm9yRGVsZXRlUmVjb3JkID0gYXN5bmMgKGFwcCwgcmVjb3JkKSA9PiBhd2FpdCB0cmFuc2FjdGlvbihcbiAgYXBwLmRhdGFzdG9yZSwgREVMRVRFX1JFQ09SRF9UUkFOU0FDVElPTixcbiAgcmVjb3JkLmtleSwgeyByZWNvcmQgfSxcbiAgZ2V0VHJhbnNhY3Rpb25LZXlfUmVjb3Jkcyxcbik7XG5cbmV4cG9ydCBjb25zdCB0cmFuc2FjdGlvbkZvckJ1aWxkSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleE5vZGVLZXksIHJlY29yZEtleSwgY291bnQpID0+IHtcbiAgY29uc3QgdHJhbnNhY3Rpb25Gb2xkZXIgPSBJbmRleE5vZGVLZXlCYXRjaEZvbGRlcihpbmRleE5vZGVLZXksIGNvdW50KTtcbiAgaWYgKGNvdW50ICUgQlVJTERJTkRFWF9CQVRDSF9DT1VOVCA9PT0gMCkge1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlRm9sZGVyKHRyYW5zYWN0aW9uRm9sZGVyKTtcbiAgfVxuXG4gIHJldHVybiBhd2FpdCB0cmFuc2FjdGlvbihcbiAgICBhcHAuZGF0YXN0b3JlLCBCVUlMRF9JTkRFWF9UUkFOU0FDVElPTixcbiAgICByZWNvcmRLZXksIHsgcmVjb3JkS2V5IH0sXG4gICAgaWQgPT4gam9pbktleSh0cmFuc2FjdGlvbkZvbGRlciwgaWQpLFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUJ1aWxkSW5kZXhGb2xkZXIgPSBhc3luYyAoZGF0YXN0b3JlLCBpbmRleE5vZGVLZXkpID0+IGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoXG4gIEluZGV4Tm9kZUtleUZvbGRlcihpbmRleE5vZGVLZXkpLFxuKTtcblxuY29uc3QgZ2V0VHJhbnNhY3Rpb25LZXlfUmVjb3JkcyA9IGlkID0+IGpvaW5LZXkoVFJBTlNBQ1RJT05TX0ZPTERFUiwgaWQpO1xuXG5jb25zdCB0cmFuc2FjdGlvbiA9IGFzeW5jIChkYXRhc3RvcmUsIHRyYW5zYWN0aW9uVHlwZSwgcmVjb3JkS2V5LCBkYXRhLCBnZXRUcmFuc2FjdGlvbktleSkgPT4ge1xuICBjb25zdCByZWNvcmRJZCA9IGdldExhc3RQYXJ0SW5LZXkocmVjb3JkS2V5KTtcbiAgY29uc3QgdW5pcXVlSWQgPSBnZW5lcmF0ZSgpO1xuICBjb25zdCBpZCA9IGdldFRyYW5zYWN0aW9uSWQoXG4gICAgcmVjb3JkSWQsIHRyYW5zYWN0aW9uVHlwZSwgdW5pcXVlSWQsXG4gICk7XG5cbiAgY29uc3Qga2V5ID0gZ2V0VHJhbnNhY3Rpb25LZXkoaWQpO1xuXG4gIGNvbnN0IHRyYW5zID0ge1xuICAgIHRyYW5zYWN0aW9uVHlwZSxcbiAgICByZWNvcmRLZXksXG4gICAgLi4uZGF0YSxcbiAgICBpZCxcbiAgfTtcblxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlSnNvbihcbiAgICBrZXksIHRyYW5zLFxuICApO1xuXG4gIHJldHVybiB0cmFucztcbn07XG4iLCJpbXBvcnQgeyBpc1NoYXJkZWRJbmRleCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBqb2luS2V5IH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldFNoYXJkTWFwS2V5LCBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXksIGNyZWF0ZUluZGV4RmlsZSB9IGZyb20gJy4vc2hhcmRpbmcnO1xuXG5leHBvcnQgY29uc3QgaW5pdGlhbGlzZUluZGV4ID0gYXN5bmMgKGRhdGFzdG9yZSwgcGFyZW50S2V5LCBpbmRleCkgPT4ge1xuICBjb25zdCBpbmRleEtleSA9IGpvaW5LZXkocGFyZW50S2V5LCBpbmRleC5uYW1lKTtcblxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKGluZGV4S2V5KTtcblxuICBpZiAoaXNTaGFyZGVkSW5kZXgoaW5kZXgpKSB7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZpbGUoXG4gICAgICBnZXRTaGFyZE1hcEtleShpbmRleEtleSksXG4gICAgICAnW10nLFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgY3JlYXRlSW5kZXhGaWxlKFxuICAgICAgZGF0YXN0b3JlLFxuICAgICAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5KGluZGV4S2V5KSxcbiAgICAgIGluZGV4LFxuICAgICk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBjbG9uZURlZXAsXG4gIGZsYXR0ZW4sXG4gIG1hcCxcbiAgZmlsdGVyLFxuICBpc0VxdWFsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBpbml0aWFsaXNlQ2hpbGRDb2xsZWN0aW9ucyB9IGZyb20gJy4uL2NvbGxlY3Rpb25BcGkvaW5pdGlhbGlzZSc7XG5pbXBvcnQgeyB2YWxpZGF0ZSB9IGZyb20gJy4vdmFsaWRhdGUnO1xuaW1wb3J0IHsgX2xvYWQsIGdldFJlY29yZEZpbGVOYW1lIH0gZnJvbSAnLi9sb2FkJztcbmltcG9ydCB7XG4gIGFwaVdyYXBwZXIsIGV2ZW50cywgJCwgam9pbktleSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcbiAgaXNSZWNvcmQsXG4gIGdldE5vZGUsXG4gIGdldExhc3RQYXJ0SW5LZXksXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBtYXBSZWNvcmQgfSBmcm9tICcuLi9pbmRleGluZy9ldmFsdWF0ZSc7XG5pbXBvcnQgeyBsaXN0SXRlbXMgfSBmcm9tICcuLi9pbmRleEFwaS9saXN0SXRlbXMnO1xuaW1wb3J0IHsgYWRkVG9BbGxJZHMgfSBmcm9tICcuLi9pbmRleGluZy9hbGxJZHMnO1xuaW1wb3J0IHtcbiAgdHJhbnNhY3Rpb25Gb3JDcmVhdGVSZWNvcmQsXG4gIHRyYW5zYWN0aW9uRm9yVXBkYXRlUmVjb3JkLFxufSBmcm9tICcuLi90cmFuc2FjdGlvbnMvY3JlYXRlJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IGluaXRpYWxpc2VJbmRleCB9IGZyb20gJy4uL2luZGV4aW5nL2luaXRpYWxpc2VJbmRleCc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IHNhdmUgPSBhcHAgPT4gYXN5bmMgKHJlY29yZCwgY29udGV4dCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMucmVjb3JkQXBpLnNhdmUsXG4gIHJlY29yZC5pc05ld1xuICAgID8gcGVybWlzc2lvbi5jcmVhdGVSZWNvcmQuaXNBdXRob3JpemVkKHJlY29yZC5rZXkpXG4gICAgOiBwZXJtaXNzaW9uLnVwZGF0ZVJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkLmtleSksIHsgcmVjb3JkIH0sXG4gIF9zYXZlLCBhcHAsIHJlY29yZCwgY29udGV4dCwgZmFsc2UsXG4pO1xuXG5cbmV4cG9ydCBjb25zdCBfc2F2ZSA9IGFzeW5jIChhcHAsIHJlY29yZCwgY29udGV4dCwgc2tpcFZhbGlkYXRpb24gPSBmYWxzZSkgPT4ge1xuICBjb25zdCByZWNvcmRDbG9uZSA9IGNsb25lRGVlcChyZWNvcmQpO1xuICBpZiAoIXNraXBWYWxpZGF0aW9uKSB7XG4gICAgY29uc3QgdmFsaWRhdGlvblJlc3VsdCA9IGF3YWl0IHZhbGlkYXRlKGFwcCkocmVjb3JkQ2xvbmUsIGNvbnRleHQpO1xuICAgIGlmICghdmFsaWRhdGlvblJlc3VsdC5pc1ZhbGlkKSB7XG4gICAgICBhd2FpdCBhcHAucHVibGlzaChldmVudHMucmVjb3JkQXBpLnNhdmUub25JbnZhbGlkLCB7IHJlY29yZCwgdmFsaWRhdGlvblJlc3VsdCB9KTtcbiAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYFNhdmUgOiBSZWNvcmQgSW52YWxpZCA6ICR7XG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHZhbGlkYXRpb25SZXN1bHQuZXJyb3JzKX1gKTtcbiAgICB9XG4gIH1cblxuICBpZiAocmVjb3JkQ2xvbmUuaXNOZXcpIHtcbiAgICBhd2FpdCBhZGRUb0FsbElkcyhhcHAuaGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlKShyZWNvcmRDbG9uZSk7XG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSBhd2FpdCB0cmFuc2FjdGlvbkZvckNyZWF0ZVJlY29yZChcbiAgICAgIGFwcCwgcmVjb3JkQ2xvbmUsXG4gICAgKTtcbiAgICByZWNvcmRDbG9uZS50cmFuc2FjdGlvbklkID0gdHJhbnNhY3Rpb24uaWQ7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVGb2xkZXIocmVjb3JkQ2xvbmUua2V5KTtcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihcbiAgICAgIGpvaW5LZXkocmVjb3JkQ2xvbmUua2V5LCAnZmlsZXMnKSxcbiAgICApO1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlSnNvbihcbiAgICAgIGdldFJlY29yZEZpbGVOYW1lKHJlY29yZENsb25lLmtleSksXG4gICAgICByZWNvcmRDbG9uZSxcbiAgICApO1xuICAgIGF3YWl0IGluaXRpYWxpc2VSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyhhcHAsIHJlY29yZCk7XG4gICAgYXdhaXQgaW5pdGlhbGlzZUFuY2VzdG9ySW5kZXhlcyhhcHAsIHJlY29yZCk7XG4gICAgYXdhaXQgaW5pdGlhbGlzZUNoaWxkQ29sbGVjdGlvbnMoYXBwLCByZWNvcmRDbG9uZS5rZXkpO1xuICAgIGF3YWl0IGFwcC5wdWJsaXNoKGV2ZW50cy5yZWNvcmRBcGkuc2F2ZS5vblJlY29yZENyZWF0ZWQsIHtcbiAgICAgIHJlY29yZDogcmVjb3JkQ2xvbmUsXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgb2xkUmVjb3JkID0gYXdhaXQgX2xvYWQoYXBwLCByZWNvcmRDbG9uZS5rZXkpO1xuICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gYXdhaXQgdHJhbnNhY3Rpb25Gb3JVcGRhdGVSZWNvcmQoXG4gICAgICBhcHAsIG9sZFJlY29yZCwgcmVjb3JkQ2xvbmUsXG4gICAgKTtcbiAgICByZWNvcmRDbG9uZS50cmFuc2FjdGlvbklkID0gdHJhbnNhY3Rpb24uaWQ7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFxuICAgICAgZ2V0UmVjb3JkRmlsZU5hbWUocmVjb3JkQ2xvbmUua2V5KSxcbiAgICAgIHJlY29yZENsb25lLFxuICAgICk7XG4gICAgYXdhaXQgYXBwLnB1Ymxpc2goZXZlbnRzLnJlY29yZEFwaS5zYXZlLm9uUmVjb3JkVXBkYXRlZCwge1xuICAgICAgb2xkOiBvbGRSZWNvcmQsXG4gICAgICBuZXc6IHJlY29yZENsb25lLFxuICAgIH0pO1xuICB9XG5cbiAgYXdhaXQgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMoKTtcblxuICBjb25zdCByZXR1cm5lZENsb25lID0gY2xvbmVEZWVwKHJlY29yZENsb25lKTtcbiAgcmV0dXJuZWRDbG9uZS5pc05ldyA9IGZhbHNlO1xuICByZXR1cm4gcmV0dXJuZWRDbG9uZTtcbn07XG5cbmNvbnN0IGluaXRpYWxpc2VBbmNlc3RvckluZGV4ZXMgPSBhc3luYyAoYXBwLCByZWNvcmQpID0+IHtcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkocmVjb3JkLmtleSk7XG5cbiAgZm9yIChjb25zdCBpbmRleCBvZiByZWNvcmROb2RlLmluZGV4ZXMpIHtcbiAgICBjb25zdCBpbmRleEtleSA9IGpvaW5LZXkocmVjb3JkLmtleSwgaW5kZXgubmFtZSk7XG4gICAgaWYgKCFhd2FpdCBhcHAuZGF0YXN0b3JlLmV4aXN0cyhpbmRleEtleSkpIHsgYXdhaXQgaW5pdGlhbGlzZUluZGV4KGFwcC5kYXRhc3RvcmUsIHJlY29yZC5rZXksIGluZGV4KTsgfVxuICB9XG59O1xuXG5jb25zdCBpbml0aWFsaXNlUmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMgPSBhc3luYyAoYXBwLCByZWNvcmQpID0+IHtcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkocmVjb3JkLmtleSk7XG5cbiAgY29uc3QgaW5kZXhOb2RlcyA9ICQoZmllbGRzVGhhdFJlZmVyZW5jZVRoaXNSZWNvcmQoYXBwLCByZWNvcmROb2RlKSwgW1xuICAgIG1hcChmID0+ICQoZi50eXBlT3B0aW9ucy5yZXZlcnNlSW5kZXhOb2RlS2V5cywgW1xuICAgICAgbWFwKG4gPT4gZ2V0Tm9kZShcbiAgICAgICAgYXBwLmhpZXJhcmNoeSxcbiAgICAgICAgbixcbiAgICAgICkpLFxuICAgIF0pKSxcbiAgICBmbGF0dGVuLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IGluZGV4Tm9kZSBvZiBpbmRleE5vZGVzKSB7XG4gICAgYXdhaXQgaW5pdGlhbGlzZUluZGV4KFxuICAgICAgYXBwLmRhdGFzdG9yZSwgcmVjb3JkLmtleSwgaW5kZXhOb2RlLFxuICAgICk7XG4gIH1cbn07XG5cbmNvbnN0IGZpZWxkc1RoYXRSZWZlcmVuY2VUaGlzUmVjb3JkID0gKGFwcCwgcmVjb3JkTm9kZSkgPT4gJChhcHAuaGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmlsdGVyKGlzUmVjb3JkKSxcbiAgbWFwKG4gPT4gbi5maWVsZHMpLFxuICBmbGF0dGVuLFxuICBmaWx0ZXIoZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvTm9kZShyZWNvcmROb2RlKSksXG5dKTtcbiIsImltcG9ydCB7IGluY2x1ZGVzIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xuICBzYWZlS2V5LCBhcGlXcmFwcGVyLFxuICBldmVudHMsIGpvaW5LZXksXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBfZGVsZXRlUmVjb3JkIH0gZnJvbSAnLi4vcmVjb3JkQXBpL2RlbGV0ZSc7XG5pbXBvcnQgeyBnZXRBbGxJZHNJdGVyYXRvciwgZ2V0QWxsSWRzU2hhcmRLZXkgfSBmcm9tICcuLi9pbmRleGluZy9hbGxJZHMnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZGVsZXRlQ29sbGVjdGlvbiA9IChhcHAsIGRpc2FibGVDbGVhbnVwID0gZmFsc2UpID0+IGFzeW5jIGtleSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5jb2xsZWN0aW9uQXBpLmRlbGV0ZSxcbiAgcGVybWlzc2lvbi5tYW5hZ2VDb2xsZWN0aW9uLmlzQXV0aG9yaXplZCxcbiAgeyBrZXkgfSxcbiAgX2RlbGV0ZUNvbGxlY3Rpb24sIGFwcCwga2V5LCBkaXNhYmxlQ2xlYW51cCxcbik7XG5cblxuZXhwb3J0IGNvbnN0IF9kZWxldGVDb2xsZWN0aW9uID0gYXN5bmMgKGFwcCwga2V5LCBkaXNhYmxlQ2xlYW51cCkgPT4ge1xuICBrZXkgPSBzYWZlS2V5KGtleSk7XG4gIGNvbnN0IG5vZGUgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwLmhpZXJhcmNoeSkoa2V5KTtcblxuICBhd2FpdCBkZWxldGVSZWNvcmRzKGFwcCwga2V5KTtcbiAgYXdhaXQgZGVsZXRlQWxsSWRzRm9sZGVycyhhcHAsIG5vZGUsIGtleSk7XG4gIGF3YWl0IGRlbGV0ZUNvbGxlY3Rpb25Gb2xkZXIoYXBwLCBrZXkpO1xuICBpZiAoIWRpc2FibGVDbGVhbnVwKSB7IGF3YWl0IGFwcC5jbGVhbnVwVHJhbnNhY3Rpb25zKCk7IH1cbn07XG5cbmNvbnN0IGRlbGV0ZUNvbGxlY3Rpb25Gb2xkZXIgPSBhc3luYyAoYXBwLCBrZXkpID0+IGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKGtleSk7XG5cblxuY29uc3QgZGVsZXRlQWxsSWRzRm9sZGVycyA9IGFzeW5jIChhcHAsIG5vZGUsIGtleSkgPT4ge1xuICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihcbiAgICBqb2luS2V5KFxuICAgICAga2V5LCAnYWxsaWRzJyxcbiAgICAgIG5vZGUubm9kZUlkLFxuICAgICksXG4gICk7XG5cbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoXG4gICAgam9pbktleShrZXksICdhbGxpZHMnKSxcbiAgKTtcbn07XG5cbmNvbnN0IGRlbGV0ZVJlY29yZHMgPSBhc3luYyAoYXBwLCBrZXkpID0+IHtcbiAgY29uc3QgZGVsZXRlZEFsbElkc1NoYXJkcyA9IFtdO1xuICBjb25zdCBkZWxldGVBbGxJZHNTaGFyZCA9IGFzeW5jIChyZWNvcmRJZCkgPT4ge1xuICAgIGNvbnN0IHNoYXJkS2V5ID0gZ2V0QWxsSWRzU2hhcmRLZXkoXG4gICAgICBhcHAuaGllcmFyY2h5LCBrZXksIHJlY29yZElkLFxuICAgICk7XG5cbiAgICBpZiAoaW5jbHVkZXMoc2hhcmRLZXkpKGRlbGV0ZWRBbGxJZHNTaGFyZHMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZGVsZXRlZEFsbElkc1NoYXJkcy5wdXNoKHNoYXJkS2V5KTtcblxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShzaGFyZEtleSk7XG4gIH07XG5cbiAgY29uc3QgaXRlcmF0ZSA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yKGFwcCkoa2V5KTtcblxuICBsZXQgaWRzID0gYXdhaXQgaXRlcmF0ZSgpO1xuICB3aGlsZSAoIWlkcy5kb25lKSB7XG4gICAgaWYgKGlkcy5yZXN1bHQuY29sbGVjdGlvbktleSA9PT0ga2V5KSB7XG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIGlkcy5yZXN1bHQuaWRzKSB7XG4gICAgICAgIGF3YWl0IF9kZWxldGVSZWNvcmQoXG4gICAgICAgICAgYXBwLFxuICAgICAgICAgIGpvaW5LZXkoa2V5LCBpZCksXG4gICAgICAgICAgdHJ1ZSxcbiAgICAgICAgKTtcbiAgICAgICAgYXdhaXQgZGVsZXRlQWxsSWRzU2hhcmQoaWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlkcyA9IGF3YWl0IGl0ZXJhdGUoKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIHRyeUF3YWl0T3JJZ25vcmUsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBpc0luZGV4LCBpc1NoYXJkZWRJbmRleCxcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7XG4gIGdldEFsbFNoYXJkS2V5cywgZ2V0U2hhcmRNYXBLZXksXG4gIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSxcbn0gZnJvbSAnLi4vaW5kZXhpbmcvc2hhcmRpbmcnO1xuXG5leHBvcnQgY29uc3QgX2RlbGV0ZUluZGV4ID0gYXN5bmMgKGFwcCwgaW5kZXhLZXksIGluY2x1ZGVGb2xkZXIpID0+IHtcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShpbmRleEtleSk7XG5cbiAgaWYgKCFpc0luZGV4KGluZGV4Tm9kZSkpIHsgdGhyb3cgbmV3IEVycm9yKCdTdXBwbGllZCBrZXkgaXMgbm90IGFuIGluZGV4Jyk7IH1cblxuICBpZiAoaXNTaGFyZGVkSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIGNvbnN0IHNoYXJkS2V5cyA9IGF3YWl0IGdldEFsbFNoYXJkS2V5cyhhcHAsIGluZGV4S2V5KTtcbiAgICBmb3IgKGNvbnN0IGsgb2Ygc2hhcmRLZXlzKSB7XG4gICAgICBhd2FpdCB0cnlBd2FpdE9ySWdub3JlKFxuICAgICAgICBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoayksXG4gICAgICApO1xuICAgIH1cbiAgICB0cnlBd2FpdE9ySWdub3JlKFxuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKFxuICAgICAgICBnZXRTaGFyZE1hcEtleShpbmRleEtleSksXG4gICAgICApLFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgdHJ5QXdhaXRPcklnbm9yZShcbiAgICAgIGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShcbiAgICAgICAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5KGluZGV4S2V5KSxcbiAgICAgICksXG4gICAgKTtcbiAgfVxuXG4gIGlmIChpbmNsdWRlRm9sZGVyKSB7XG4gICAgdHJ5QXdhaXRPcklnbm9yZShcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKGluZGV4S2V5KSxcbiAgICApO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgc2FmZUtleSwgYXBpV3JhcHBlcixcbiAgZXZlbnRzLCBqb2luS2V5LFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgX2xvYWQsIGdldFJlY29yZEZpbGVOYW1lIH0gZnJvbSAnLi9sb2FkJztcbmltcG9ydCB7IF9kZWxldGVDb2xsZWN0aW9uIH0gZnJvbSAnLi4vY29sbGVjdGlvbkFwaS9kZWxldGUnO1xuaW1wb3J0IHtcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCxcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LCBnZXROb2RlLFxuICBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlLFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgX2RlbGV0ZUluZGV4IH0gZnJvbSAnLi4vaW5kZXhBcGkvZGVsZXRlJztcbmltcG9ydCB7IHRyYW5zYWN0aW9uRm9yRGVsZXRlUmVjb3JkIH0gZnJvbSAnLi4vdHJhbnNhY3Rpb25zL2NyZWF0ZSc7XG5pbXBvcnQgeyByZW1vdmVGcm9tQWxsSWRzIH0gZnJvbSAnLi4vaW5kZXhpbmcvYWxsSWRzJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGRlbGV0ZVJlY29yZCA9IChhcHAsIGRpc2FibGVDbGVhbnVwID0gZmFsc2UpID0+IGFzeW5jIGtleSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5yZWNvcmRBcGkuZGVsZXRlLFxuICBwZXJtaXNzaW9uLmRlbGV0ZVJlY29yZC5pc0F1dGhvcml6ZWQoa2V5KSxcbiAgeyBrZXkgfSxcbiAgX2RlbGV0ZVJlY29yZCwgYXBwLCBrZXksIGRpc2FibGVDbGVhbnVwLFxuKTtcblxuLy8gY2FsbGVkIGRlbGV0ZVJlY29yZCBiZWNhdXNlIGRlbGV0ZSBpcyBhIGtleXdvcmRcbmV4cG9ydCBjb25zdCBfZGVsZXRlUmVjb3JkID0gYXN5bmMgKGFwcCwga2V5LCBkaXNhYmxlQ2xlYW51cCkgPT4ge1xuICBrZXkgPSBzYWZlS2V5KGtleSk7XG4gIGNvbnN0IG5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKGtleSk7XG5cbiAgY29uc3QgcmVjb3JkID0gYXdhaXQgX2xvYWQoYXBwLCBrZXkpO1xuICBhd2FpdCB0cmFuc2FjdGlvbkZvckRlbGV0ZVJlY29yZChhcHAsIHJlY29yZCk7XG5cbiAgZm9yIChjb25zdCBjb2xsZWN0aW9uUmVjb3JkIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICBjb25zdCBjb2xsZWN0aW9uS2V5ID0gam9pbktleShcbiAgICAgIGtleSwgY29sbGVjdGlvblJlY29yZC5jb2xsZWN0aW9uTmFtZSxcbiAgICApO1xuICAgIGF3YWl0IF9kZWxldGVDb2xsZWN0aW9uKGFwcCwgY29sbGVjdGlvbktleSwgdHJ1ZSk7XG4gIH1cblxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoXG4gICAgZ2V0UmVjb3JkRmlsZU5hbWUoa2V5KSxcbiAgKTtcblxuICBhd2FpdCBkZWxldGVGaWxlcyhhcHAsIGtleSk7XG5cbiAgYXdhaXQgcmVtb3ZlRnJvbUFsbElkcyhhcHAuaGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlKShyZWNvcmQpO1xuXG4gIGlmICghZGlzYWJsZUNsZWFudXApIHsgYXdhaXQgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMoKTsgfVxuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKGtleSk7XG4gIGF3YWl0IGRlbGV0ZUluZGV4ZXMoYXBwLCBrZXkpO1xufTtcblxuY29uc3QgZGVsZXRlSW5kZXhlcyA9IGFzeW5jIChhcHAsIGtleSkgPT4ge1xuICBjb25zdCBub2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShrZXkpO1xuICAvKiBjb25zdCByZXZlcnNlSW5kZXhLZXlzID0gJChhcHAuaGllcmFyY2h5LCBbXG4gICAgICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgICAgICAgbWFwKG4gPT4gbi5maWVsZHMpLFxuICAgICAgICBmbGF0dGVuLFxuICAgICAgICBmaWx0ZXIoaXNTb21ldGhpbmcpLFxuICAgICAgICBmaWx0ZXIoZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvTm9kZShub2RlKSksXG4gICAgICAgIG1hcChmID0+ICQoZi50eXBlT3B0aW9ucy5yZXZlcnNlSW5kZXhOb2RlS2V5cywgW1xuICAgICAgICAgICAgICAgICAgICBtYXAobiA9PiBnZXROb2RlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAuaGllcmFyY2h5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuKSlcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICApLFxuICAgICAgICBmbGF0dGVuLFxuICAgICAgICBtYXAobiA9PiBqb2luS2V5KGtleSwgbi5uYW1lKSlcbiAgICBdKTtcblxuICAgIGZvcihsZXQgaSBvZiByZXZlcnNlSW5kZXhLZXlzKSB7XG4gICAgICAgIGF3YWl0IF9kZWxldGVJbmRleChhcHAsIGksIHRydWUpO1xuICAgIH0gKi9cblxuXG4gIGZvciAoY29uc3QgaW5kZXggb2Ygbm9kZS5pbmRleGVzKSB7XG4gICAgY29uc3QgaW5kZXhLZXkgPSBqb2luS2V5KGtleSwgaW5kZXgubmFtZSk7XG4gICAgYXdhaXQgX2RlbGV0ZUluZGV4KGFwcCwgaW5kZXhLZXksIHRydWUpO1xuICB9XG59O1xuXG5jb25zdCBkZWxldGVGaWxlcyA9IGFzeW5jIChhcHAsIGtleSkgPT4ge1xuICBjb25zdCBmaWxlc0ZvbGRlciA9IGpvaW5LZXkoa2V5LCAnZmlsZXMnKTtcbiAgY29uc3QgYWxsRmlsZXMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZvbGRlckNvbnRlbnRzKFxuICAgIGZpbGVzRm9sZGVyLFxuICApO1xuXG4gIGZvciAoY29uc3QgZmlsZSBvZiBhbGxGaWxlcykge1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShmaWxlKTtcbiAgfVxuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKFxuICAgIGpvaW5LZXkoa2V5LCAnZmlsZXMnKSxcbiAgKTtcbn07XG4iLCJpbXBvcnQge1xuICBpbmNsdWRlcywgZmlsdGVyLFxuICBtYXAsIHNvbWUsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHsgX2xvYWQgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IHtcbiAgYXBpV3JhcHBlciwgZXZlbnRzLCBzcGxpdEtleSxcbiAgJCwgam9pbktleSwgaXNOb3RoaW5nLCB0cnlBd2FpdE9ySWdub3JlLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0RXhhY3ROb2RlRm9yUGF0aCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBpc0xlZ2FsRmlsZW5hbWUgfSBmcm9tICcuLi90eXBlcy9maWxlJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciwgRm9yYmlkZGVuRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IHVwbG9hZEZpbGUgPSBhcHAgPT4gYXN5bmMgKHJlY29yZEtleSwgcmVhZGFibGVTdHJlYW0sIHJlbGF0aXZlRmlsZVBhdGgpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLnJlY29yZEFwaS51cGxvYWRGaWxlLFxuICBwZXJtaXNzaW9uLnVwZGF0ZVJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkS2V5KSxcbiAgeyByZWNvcmRLZXksIHJlYWRhYmxlU3RyZWFtLCByZWxhdGl2ZUZpbGVQYXRoIH0sXG4gIF91cGxvYWRGaWxlLCBhcHAsIHJlY29yZEtleSwgcmVhZGFibGVTdHJlYW0sIHJlbGF0aXZlRmlsZVBhdGgsXG4pO1xuXG5jb25zdCBfdXBsb2FkRmlsZSA9IGFzeW5jIChhcHAsIHJlY29yZEtleSwgcmVhZGFibGVTdHJlYW0sIHJlbGF0aXZlRmlsZVBhdGgpID0+IHtcbiAgaWYgKGlzTm90aGluZyhyZWNvcmRLZXkpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ1JlY29yZCBLZXkgbm90IHN1cHBsaWVkJyk7IH1cbiAgaWYgKGlzTm90aGluZyhyZWxhdGl2ZUZpbGVQYXRoKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdmaWxlIHBhdGggbm90IHN1cHBsaWVkJyk7IH1cbiAgaWYgKCFpc0xlZ2FsRmlsZW5hbWUocmVsYXRpdmVGaWxlUGF0aCkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignSWxsZWdhbCBmaWxlbmFtZScpOyB9XG5cbiAgY29uc3QgcmVjb3JkID0gYXdhaXQgX2xvYWQoYXBwLCByZWNvcmRLZXkpO1xuXG4gIGNvbnN0IGZ1bGxGaWxlUGF0aCA9IHNhZmVHZXRGdWxsRmlsZVBhdGgoXG4gICAgcmVjb3JkS2V5LCByZWxhdGl2ZUZpbGVQYXRoLFxuICApO1xuXG4gIGNvbnN0IHRlbXBGaWxlUGF0aCA9IGAke2Z1bGxGaWxlUGF0aH1fJHtnZW5lcmF0ZSgpfS50ZW1wYDtcblxuICBjb25zdCBvdXRwdXRTdHJlYW0gPSBhd2FpdCBhcHAuZGF0YXN0b3JlLndyaXRhYmxlRmlsZVN0cmVhbShcbiAgICB0ZW1wRmlsZVBhdGgsXG4gICk7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCkgPT4ge1xuICAgIHJlYWRhYmxlU3RyZWFtLnBpcGUob3V0cHV0U3RyZWFtKTtcbiAgICBvdXRwdXRTdHJlYW0ub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICBvdXRwdXRTdHJlYW0ub24oJ2ZpbmlzaCcsIHJlc29sdmUpO1xuICB9KVxuICAudGhlbigoKSA9PiBhcHAuZGF0YXN0b3JlLmdldEZpbGVTaXplKHRlbXBGaWxlUGF0aCkpXG4gIC50aGVuKHNpemUgPT4ge1xuICAgIGNvbnN0IGlzRXhwZWN0ZWRGaWxlU2l6ZSA9IGNoZWNrRmlsZVNpemVBZ2FpbnN0RmllbGRzKFxuICAgICAgYXBwLCByZWNvcmQsIHJlbGF0aXZlRmlsZVBhdGgsIHNpemVcbiAgICApOyAgXG4gICAgaWYgKCFpc0V4cGVjdGVkRmlsZVNpemUpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgRmllbGRzIGZvciAke3JlbGF0aXZlRmlsZVBhdGh9IGRvIG5vdCBoYXZlIGV4cGVjdGVkIHNpemU6ICR7am9pbignLCcpKGluY29ycmVjdEZpZWxkcyl9YCk7IH0gIFxuXG4gIH0pXG4gIC50aGVuKCgpID0+IHRyeUF3YWl0T3JJZ25vcmUoYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlLCBmdWxsRmlsZVBhdGgpKVxuICAudGhlbigoKSA9PiBhcHAuZGF0YXN0b3JlLnJlbmFtZUZpbGUodGVtcEZpbGVQYXRoLCBmdWxsRmlsZVBhdGgpKTtcblxuICAvKlxuICByZWFkYWJsZVN0cmVhbS5waXBlKG91dHB1dFN0cmVhbSk7XG5cbiAgYXdhaXQgbmV3IFByb21pc2UoZnVsZmlsbCA9PiBvdXRwdXRTdHJlYW0ub24oJ2ZpbmlzaCcsIGZ1bGZpbGwpKTtcblxuICBjb25zdCBpc0V4cGVjdGVkRmlsZVNpemUgPSBjaGVja0ZpbGVTaXplQWdhaW5zdEZpZWxkcyhcbiAgICBhcHAsXG4gICAgcmVjb3JkLCByZWxhdGl2ZUZpbGVQYXRoLFxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0RmlsZVNpemUodGVtcEZpbGVQYXRoKSxcbiAgKTtcblxuICBpZiAoIWlzRXhwZWN0ZWRGaWxlU2l6ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBGaWVsZHMgZm9yICR7cmVsYXRpdmVGaWxlUGF0aH0gZG8gbm90IGhhdmUgZXhwZWN0ZWQgc2l6ZWApO1xuICB9XG5cbiAgYXdhaXQgdHJ5QXdhaXRPcklnbm9yZShhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUsIGZ1bGxGaWxlUGF0aCk7XG5cbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS5yZW5hbWVGaWxlKHRlbXBGaWxlUGF0aCwgZnVsbEZpbGVQYXRoKTtcbiAgKi9cbn07XG5cbmNvbnN0IGNoZWNrRmlsZVNpemVBZ2FpbnN0RmllbGRzID0gKGFwcCwgcmVjb3JkLCByZWxhdGl2ZUZpbGVQYXRoLCBleHBlY3RlZFNpemUpID0+IHtcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkocmVjb3JkLmtleSk7XG5cbiAgY29uc3QgaW5jb3JyZWN0RmlsZUZpZWxkcyA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBmaWx0ZXIoZiA9PiBmLnR5cGUgPT09ICdmaWxlJ1xuICAgICAgJiYgcmVjb3JkW2YubmFtZV0ucmVsYXRpdmVQYXRoID09PSByZWxhdGl2ZUZpbGVQYXRoXG4gICAgICAmJiByZWNvcmRbZi5uYW1lXS5zaXplICE9PSBleHBlY3RlZFNpemUpLFxuICAgIG1hcChmID0+IGYubmFtZSksXG4gIF0pO1xuXG4gIGNvbnN0IGluY29ycmVjdEZpbGVBcnJheUZpZWxkcyA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBmaWx0ZXIoYSA9PiBhLnR5cGUgPT09ICdhcnJheTxmaWxlPidcbiAgICAgICYmICQocmVjb3JkW2EubmFtZV0sIFtcbiAgICAgICAgc29tZShmID0+IHJlY29yZFtmLm5hbWVdLnJlbGF0aXZlUGF0aCA9PT0gcmVsYXRpdmVGaWxlUGF0aFxuICAgICAgICAgICYmIHJlY29yZFtmLm5hbWVdLnNpemUgIT09IGV4cGVjdGVkU2l6ZSksXG4gICAgICBdKSksXG4gICAgbWFwKGYgPT4gZi5uYW1lKSxcbiAgXSk7XG5cbiAgY29uc3QgaW5jb3JyZWN0RmllbGRzID0gW1xuICAgIC4uLmluY29ycmVjdEZpbGVGaWVsZHMsXG4gICAgLi4uaW5jb3JyZWN0RmlsZUFycmF5RmllbGRzLFxuICBdO1xuXG4gIGlmIChpbmNvcnJlY3RGaWVsZHMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuZXhwb3J0IGNvbnN0IHNhZmVHZXRGdWxsRmlsZVBhdGggPSAocmVjb3JkS2V5LCByZWxhdGl2ZUZpbGVQYXRoKSA9PiB7XG4gIGNvbnN0IG5hdWdodHlVc2VyID0gKCkgPT4geyB0aHJvdyBuZXcgRm9yYmlkZGVuRXJyb3IoJ25hdWdodHkgbmF1Z2h0eScpOyB9O1xuXG4gIGlmIChyZWxhdGl2ZUZpbGVQYXRoLnN0YXJ0c1dpdGgoJy4uJykpIG5hdWdodHlVc2VyKCk7XG5cbiAgY29uc3QgcGF0aFBhcnRzID0gc3BsaXRLZXkocmVsYXRpdmVGaWxlUGF0aCk7XG5cbiAgaWYgKGluY2x1ZGVzKCcuLicpKHBhdGhQYXJ0cykpIG5hdWdodHlVc2VyKCk7XG5cbiAgY29uc3QgcmVjb3JkS2V5UGFydHMgPSBzcGxpdEtleShyZWNvcmRLZXkpO1xuXG4gIGNvbnN0IGZ1bGxQYXRoUGFydHMgPSBbXG4gICAgLi4ucmVjb3JkS2V5UGFydHMsXG4gICAgJ2ZpbGVzJyxcbiAgICAuLi5maWx0ZXIocCA9PiBwICE9PSAnLicpKHBhdGhQYXJ0cyksXG4gIF07XG5cbiAgcmV0dXJuIGpvaW5LZXkoZnVsbFBhdGhQYXJ0cyk7XG59O1xuIiwiaW1wb3J0IHsgYXBpV3JhcHBlciwgZXZlbnRzLCBpc05vdGhpbmcgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgc2FmZUdldEZ1bGxGaWxlUGF0aCB9IGZyb20gJy4vdXBsb2FkRmlsZSc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGRvd25sb2FkRmlsZSA9IGFwcCA9PiBhc3luYyAocmVjb3JkS2V5LCByZWxhdGl2ZVBhdGgpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLnJlY29yZEFwaS51cGxvYWRGaWxlLFxuICBwZXJtaXNzaW9uLnJlYWRSZWNvcmQuaXNBdXRob3JpemVkKHJlY29yZEtleSksXG4gIHsgcmVjb3JkS2V5LCByZWxhdGl2ZVBhdGggfSwvL3JlbW92ZSBkdXBlIGtleSAncmVjb3JkS2V5JyBmcm9tIG9iamVjdFxuICBfZG93bmxvYWRGaWxlLCBhcHAsIHJlY29yZEtleSwgcmVsYXRpdmVQYXRoLFxuKTsgXG5cblxuY29uc3QgX2Rvd25sb2FkRmlsZSA9IGFzeW5jIChhcHAsIHJlY29yZEtleSwgcmVsYXRpdmVQYXRoKSA9PiB7XG4gIGlmIChpc05vdGhpbmcocmVjb3JkS2V5KSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdSZWNvcmQgS2V5IG5vdCBzdXBwbGllZCcpOyB9XG4gIGlmIChpc05vdGhpbmcocmVsYXRpdmVQYXRoKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdmaWxlIHBhdGggbm90IHN1cHBsaWVkJyk7IH1cblxuICByZXR1cm4gYXdhaXQgYXBwLmRhdGFzdG9yZS5yZWFkYWJsZUZpbGVTdHJlYW0oXG4gICAgc2FmZUdldEZ1bGxGaWxlUGF0aChcbiAgICAgIHJlY29yZEtleSwgcmVsYXRpdmVQYXRoLFxuICAgICksXG4gICk7XG59O1xuIiwiaW1wb3J0IHsgZmluZCwgdGFrZSwgdW5pb24gfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2V0RmxhdHRlbmVkSGllcmFyY2h5IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7ICQsIHNwbGl0S2V5LCBqb2luS2V5IH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGN1c3RvbUlkID0gYXBwID0+IChub2RlTmFtZSwgaWQpID0+IHtcbiAgY29uc3Qgbm9kZSA9ICQoYXBwLmhpZXJhcmNoeSwgW1xuICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgICBmaW5kKG4gPT4gbi5uYW1lID09PSBub2RlTmFtZSksXG4gIF0pO1xuXG4gIGlmICghbm9kZSkgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoYENhbm5vdCBmaW5kIG5vZGUgJHtub2RlTmFtZX1gKTtcblxuICByZXR1cm4gYCR7bm9kZS5ub2RlSWR9LSR7aWR9YDtcbn07XG5cbmV4cG9ydCBjb25zdCBzZXRDdXN0b21JZCA9IGFwcCA9PiAocmVjb3JkLCBpZCkgPT4ge1xuICByZWNvcmQuaWQgPSBjdXN0b21JZChhcHApKHJlY29yZC50eXBlLCBpZCk7XG5cbiAgY29uc3Qga2V5UGFydHMgPSBzcGxpdEtleShyZWNvcmQua2V5KTtcblxuICByZWNvcmQua2V5ID0gJChrZXlQYXJ0cywgW1xuICAgIHRha2Uoa2V5UGFydHMubGVuZ3RoIC0gMSksXG4gICAgdW5pb24oW3JlY29yZC5pZF0pLFxuICAgIGpvaW5LZXksXG4gIF0pO1xuXG4gIHJldHVybiByZWNvcmQ7XG59O1xuIiwiaW1wb3J0IHsgZ2V0TmV3LCBnZXROZXdDaGlsZCB9IGZyb20gJy4vZ2V0TmV3JztcbmltcG9ydCB7IGxvYWQgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IHsgdmFsaWRhdGUgfSBmcm9tICcuL3ZhbGlkYXRlJztcbmltcG9ydCB7IGdldENvbnRleHQgfSBmcm9tICcuL2dldENvbnRleHQnO1xuaW1wb3J0IHsgc2F2ZSB9IGZyb20gJy4vc2F2ZSc7XG5pbXBvcnQgeyBkZWxldGVSZWNvcmQgfSBmcm9tICcuL2RlbGV0ZSc7XG5pbXBvcnQgeyB1cGxvYWRGaWxlIH0gZnJvbSAnLi91cGxvYWRGaWxlJztcbmltcG9ydCB7IGRvd25sb2FkRmlsZSB9IGZyb20gJy4vZG93bmxvYWRGaWxlJztcbmltcG9ydCB7IGN1c3RvbUlkLCBzZXRDdXN0b21JZCB9IGZyb20gJy4vY3VzdG9tSWQnO1xuXG5jb25zdCBhcGkgPSBhcHAgPT4gKHtcbiAgZ2V0TmV3OiBnZXROZXcoYXBwKSxcbiAgZ2V0TmV3Q2hpbGQ6IGdldE5ld0NoaWxkKGFwcCksXG4gIHNhdmU6IHNhdmUoYXBwKSxcbiAgbG9hZDogbG9hZChhcHApLFxuICBkZWxldGU6IGRlbGV0ZVJlY29yZChhcHAsIGZhbHNlKSxcbiAgdmFsaWRhdGU6IHZhbGlkYXRlKGFwcCksXG4gIGdldENvbnRleHQ6IGdldENvbnRleHQoYXBwKSxcbiAgdXBsb2FkRmlsZTogdXBsb2FkRmlsZShhcHApLFxuICBkb3dubG9hZEZpbGU6IGRvd25sb2FkRmlsZShhcHApLFxuICBjdXN0b21JZDogY3VzdG9tSWQoYXBwKSxcbiAgc2V0Q3VzdG9tSWQ6IHNldEN1c3RvbUlkKGFwcCksXG59KTtcblxuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkQXBpID0gYXBwID0+IGFwaShhcHApO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRSZWNvcmRBcGk7XG4iLCJpbXBvcnQgeyBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHtcbiAgaXNOb3RoaW5nLCBzYWZlS2V5LCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsb3dlZFJlY29yZFR5cGVzID0gYXBwID0+IGtleSA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuY29sbGVjdGlvbkFwaS5nZXRBbGxvd2VkUmVjb3JkVHlwZXMsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsga2V5IH0sXG4gIF9nZXRBbGxvd2VkUmVjb3JkVHlwZXMsIGFwcCwga2V5LFxuKTtcblxuY29uc3QgX2dldEFsbG93ZWRSZWNvcmRUeXBlcyA9IChhcHAsIGtleSkgPT4ge1xuICBrZXkgPSBzYWZlS2V5KGtleSk7XG4gIGNvbnN0IG5vZGUgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwLmhpZXJhcmNoeSkoa2V5KTtcbiAgcmV0dXJuIGlzTm90aGluZyhub2RlKSA/IFtdIDogW25vZGUubmFtZV07XG59O1xuIiwiaW1wb3J0IHsgZ2V0QWxsSWRzSXRlcmF0b3IgfSBmcm9tICcuLi9pbmRleGluZy9hbGxJZHMnO1xuaW1wb3J0IHsgZ2V0QWxsb3dlZFJlY29yZFR5cGVzIH0gZnJvbSAnLi9nZXRBbGxvd2VkUmVjb3JkVHlwZXMnO1xuaW1wb3J0IHsgZGVsZXRlQ29sbGVjdGlvbiB9IGZyb20gJy4vZGVsZXRlJztcblxuZXhwb3J0IGNvbnN0IGdldENvbGxlY3Rpb25BcGkgPSBhcHAgPT4gKHtcbiAgZ2V0QWxsb3dlZFJlY29yZFR5cGVzOiBnZXRBbGxvd2VkUmVjb3JkVHlwZXMoYXBwKSxcbiAgZ2V0QWxsSWRzSXRlcmF0b3I6IGdldEFsbElkc0l0ZXJhdG9yKGFwcCksXG4gIGRlbGV0ZTogZGVsZXRlQ29sbGVjdGlvbihhcHApLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGdldENvbGxlY3Rpb25BcGk7XG4iLCJpbXBvcnQge1xuICBmaW5kLCBmaWx0ZXIsIFxuICBpbmNsdWRlcywgc29tZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdldEFsbElkc0l0ZXJhdG9yIH0gZnJvbSAnLi4vaW5kZXhpbmcvYWxsSWRzJztcbmltcG9ydCB7XG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSwgZ2V0UmVjb3JkTm9kZUJ5SWQsXG4gIGdldENvbGxlY3Rpb25Ob2RlQnlLZXlPck5vZGVLZXksIGdldE5vZGUsIGlzSW5kZXgsXG4gIGlzUmVjb3JkLCBpc0RlY2VuZGFudCwgZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgsXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4LFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHtcbiAgam9pbktleSwgYXBpV3JhcHBlciwgZXZlbnRzLCAkLCBhbGxUcnVlLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgY3JlYXRlQnVpbGRJbmRleEZvbGRlcixcbiAgdHJhbnNhY3Rpb25Gb3JCdWlsZEluZGV4LFxufSBmcm9tICcuLi90cmFuc2FjdGlvbnMvY3JlYXRlJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5cbi8qKiByZWJ1aWxkcyBhbiBpbmRleFxuICogQHBhcmFtIHtvYmplY3R9IGFwcCAtIHRoZSBhcHBsaWNhdGlvbiBjb250YWluZXJcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbmRleE5vZGVLZXkgLSBub2RlIGtleSBvZiB0aGUgaW5kZXgsIHdoaWNoIHRoZSBpbmRleCBiZWxvbmdzIHRvXG4gKi9cbmV4cG9ydCBjb25zdCBidWlsZEluZGV4ID0gYXBwID0+IGFzeW5jIGluZGV4Tm9kZUtleSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5pbmRleEFwaS5idWlsZEluZGV4LFxuICBwZXJtaXNzaW9uLm1hbmFnZUluZGV4LmlzQXV0aG9yaXplZCxcbiAgeyBpbmRleE5vZGVLZXkgfSxcbiAgX2J1aWxkSW5kZXgsIGFwcCwgaW5kZXhOb2RlS2V5LFxuKTtcblxuY29uc3QgX2J1aWxkSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleE5vZGVLZXkpID0+IHtcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0Tm9kZShhcHAuaGllcmFyY2h5LCBpbmRleE5vZGVLZXkpO1xuXG4gIGF3YWl0IGNyZWF0ZUJ1aWxkSW5kZXhGb2xkZXIoYXBwLmRhdGFzdG9yZSwgaW5kZXhOb2RlS2V5KTtcblxuICBpZiAoIWlzSW5kZXgoaW5kZXhOb2RlKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdCdWlsZEluZGV4OiBtdXN0IHN1cHBseSBhbiBpbmRleG5vZGUnKTsgfVxuXG4gIGlmIChpbmRleE5vZGUuaW5kZXhUeXBlID09PSAncmVmZXJlbmNlJykge1xuICAgIGF3YWl0IGJ1aWxkUmV2ZXJzZVJlZmVyZW5jZUluZGV4KFxuICAgICAgYXBwLCBpbmRleE5vZGUsXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCBidWlsZEhlaXJhcmNoYWxJbmRleChcbiAgICAgIGFwcCwgaW5kZXhOb2RlLFxuICAgICk7XG4gIH1cblxuICBhd2FpdCBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucygpO1xufTtcblxuY29uc3QgYnVpbGRSZXZlcnNlUmVmZXJlbmNlSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleE5vZGUpID0+IHtcbiAgLy8gSXRlcmF0ZSB0aHJvdWdoIGFsbCByZWZlcmVuY0lORyByZWNvcmRzLFxuICAvLyBhbmQgdXBkYXRlIHJlZmVyZW5jZWQgaW5kZXggZm9yIGVhY2ggcmVjb3JkXG4gIGxldCByZWNvcmRDb3VudCA9IDA7XG4gIGNvbnN0IHJlZmVyZW5jaW5nTm9kZXMgPSAkKGFwcC5oaWVyYXJjaHksIFtcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gICAgZmlsdGVyKG4gPT4gaXNSZWNvcmQobilcbiAgICAgICAgICAgICAgICAgICAgJiYgc29tZShmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleChpbmRleE5vZGUpKShuLmZpZWxkcykpLFxuICBdKTtcblxuICBjb25zdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JSZWZlcmVuY2luZ05vZGUgPSBhc3luYyAocmVmZXJlbmNpbmdOb2RlKSA9PiB7XG4gICAgY29uc3QgaXRlcmF0ZVJlZmVyZW5jaW5nTm9kZXMgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvcihhcHApKHJlZmVyZW5jaW5nTm9kZS5jb2xsZWN0aW9uTm9kZUtleSgpKTtcblxuICAgIGxldCByZWZlcmVuY2luZ0lkSXRlcmF0b3IgPSBhd2FpdCBpdGVyYXRlUmVmZXJlbmNpbmdOb2RlcygpO1xuICAgIHdoaWxlICghcmVmZXJlbmNpbmdJZEl0ZXJhdG9yLmRvbmUpIHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZWZlcmVuY2luZ0lkSXRlcmF0b3I7XG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIHJlc3VsdC5pZHMpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkS2V5ID0gam9pbktleShyZXN1bHQuY29sbGVjdGlvbktleSwgaWQpO1xuICAgICAgICBhd2FpdCB0cmFuc2FjdGlvbkZvckJ1aWxkSW5kZXgoYXBwLCBpbmRleE5vZGUubm9kZUtleSgpLCByZWNvcmRLZXksIHJlY29yZENvdW50KTtcbiAgICAgICAgcmVjb3JkQ291bnQrKztcbiAgICAgIH1cbiAgICAgIHJlZmVyZW5jaW5nSWRJdGVyYXRvciA9IGF3YWl0IGl0ZXJhdGVSZWZlcmVuY2luZ05vZGVzKCk7XG4gICAgfVxuICB9O1xuXG4gIGZvciAoY29uc3QgcmVmZXJlbmNpbmdOb2RlIG9mIHJlZmVyZW5jaW5nTm9kZXMpIHtcbiAgICBhd2FpdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JSZWZlcmVuY2luZ05vZGUocmVmZXJlbmNpbmdOb2RlKTtcbiAgfVxufTtcblxuY29uc3QgZ2V0QWxsb3dlZFBhcmVudENvbGxlY3Rpb25Ob2RlcyA9IChoaWVyYXJjaHksIGluZGV4Tm9kZSkgPT4gJChnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleChoaWVyYXJjaHksIGluZGV4Tm9kZSksIFtcbiAgbWFwKG4gPT4gbi5wYXJlbnQoKSksXG5dKTtcblxuY29uc3QgYnVpbGRIZWlyYXJjaGFsSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleE5vZGUpID0+IHtcbiAgbGV0IHJlY29yZENvdW50ID0gMDtcblxuICBjb25zdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JJZHMgPSBhc3luYyAoY29sbGVjdGlvbktleSwgaWRzKSA9PiB7XG4gICAgZm9yIChjb25zdCByZWNvcmRJZCBvZiBpZHMpIHtcbiAgICAgIGNvbnN0IHJlY29yZEtleSA9IGpvaW5LZXkoY29sbGVjdGlvbktleSwgcmVjb3JkSWQpO1xuXG4gICAgICBjb25zdCByZWNvcmROb2RlID0gZ2V0UmVjb3JkTm9kZUJ5SWQoXG4gICAgICAgIGFwcC5oaWVyYXJjaHksXG4gICAgICAgIHJlY29yZElkLFxuICAgICAgKTtcblxuICAgICAgaWYgKHJlY29yZE5vZGVBcHBsaWVzKGluZGV4Tm9kZSkocmVjb3JkTm9kZSkpIHtcbiAgICAgICAgYXdhaXQgdHJhbnNhY3Rpb25Gb3JCdWlsZEluZGV4KFxuICAgICAgICAgIGFwcCwgaW5kZXhOb2RlLm5vZGVLZXkoKSxcbiAgICAgICAgICByZWNvcmRLZXksIHJlY29yZENvdW50LFxuICAgICAgICApO1xuICAgICAgICByZWNvcmRDb3VudCsrO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuXG4gIGNvbnN0IGNvbGxlY3Rpb25SZWNvcmRzID0gZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgoYXBwLmhpZXJhcmNoeSwgaW5kZXhOb2RlKTtcblxuICBmb3IgKGNvbnN0IHRhcmdldENvbGxlY3Rpb25SZWNvcmROb2RlIG9mIGNvbGxlY3Rpb25SZWNvcmRzKSB7XG4gICAgY29uc3QgYWxsSWRzSXRlcmF0b3IgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvcihhcHApKHRhcmdldENvbGxlY3Rpb25SZWNvcmROb2RlLmNvbGxlY3Rpb25Ob2RlS2V5KCkpO1xuXG4gICAgbGV0IGFsbElkcyA9IGF3YWl0IGFsbElkc0l0ZXJhdG9yKCk7XG4gICAgd2hpbGUgKGFsbElkcy5kb25lID09PSBmYWxzZSkge1xuICAgICAgYXdhaXQgY3JlYXRlVHJhbnNhY3Rpb25zRm9ySWRzKFxuICAgICAgICBhbGxJZHMucmVzdWx0LmNvbGxlY3Rpb25LZXksXG4gICAgICAgIGFsbElkcy5yZXN1bHQuaWRzLFxuICAgICAgKTtcbiAgICAgIGFsbElkcyA9IGF3YWl0IGFsbElkc0l0ZXJhdG9yKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlY29yZENvdW50O1xufTtcblxuY29uc3QgY2hvb3NlQ2hpbGRSZWNvcmROb2RlQnlLZXkgPSAoY29sbGVjdGlvbk5vZGUsIHJlY29yZElkKSA9PiBmaW5kKGMgPT4gcmVjb3JkSWQuc3RhcnRzV2l0aChjLm5vZGVJZCkpKGNvbGxlY3Rpb25Ob2RlLmNoaWxkcmVuKTtcblxuY29uc3QgcmVjb3JkTm9kZUFwcGxpZXMgPSBpbmRleE5vZGUgPT4gcmVjb3JkTm9kZSA9PiBpbmNsdWRlcyhyZWNvcmROb2RlLm5vZGVJZCkoaW5kZXhOb2RlLmFsbG93ZWRSZWNvcmROb2RlSWRzKTtcblxuY29uc3QgaGFzQXBwbGljYWJsZURlY2VuZGFudCA9IChoaWVyYXJjaHksIGFuY2VzdG9yTm9kZSwgaW5kZXhOb2RlKSA9PiAkKGhpZXJhcmNoeSwgW1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGZpbHRlcihcbiAgICBhbGxUcnVlKFxuICAgICAgaXNSZWNvcmQsXG4gICAgICBpc0RlY2VuZGFudChhbmNlc3Rvck5vZGUpLFxuICAgICAgcmVjb3JkTm9kZUFwcGxpZXMoaW5kZXhOb2RlKSxcbiAgICApLFxuICApLFxuXSk7XG5cbmNvbnN0IGFwcGx5QWxsRGVjZW5kYW50UmVjb3JkcyA9IGFzeW5jIChhcHAsIGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXksXG4gIGluZGV4Tm9kZSwgaW5kZXhLZXksIGN1cnJlbnRJbmRleGVkRGF0YSxcbiAgY3VycmVudEluZGV4ZWREYXRhS2V5LCByZWNvcmRDb3VudCA9IDApID0+IHtcbiAgY29uc3QgY29sbGVjdGlvbk5vZGUgPSBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5KFxuICAgIGFwcC5oaWVyYXJjaHksXG4gICAgY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSxcbiAgKTtcblxuICBjb25zdCBhbGxJZHNJdGVyYXRvciA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yKGFwcCkoY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSk7XG5cblxuICBjb25zdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JJZHMgPSBhc3luYyAoY29sbGVjdGlvbktleSwgYWxsSWRzKSA9PiB7XG4gICAgZm9yIChjb25zdCByZWNvcmRJZCBvZiBhbGxJZHMpIHtcbiAgICAgIGNvbnN0IHJlY29yZEtleSA9IGpvaW5LZXkoY29sbGVjdGlvbktleSwgcmVjb3JkSWQpO1xuXG4gICAgICBjb25zdCByZWNvcmROb2RlID0gY2hvb3NlQ2hpbGRSZWNvcmROb2RlQnlLZXkoXG4gICAgICAgIGNvbGxlY3Rpb25Ob2RlLFxuICAgICAgICByZWNvcmRJZCxcbiAgICAgICk7XG5cbiAgICAgIGlmIChyZWNvcmROb2RlQXBwbGllcyhpbmRleE5vZGUpKHJlY29yZE5vZGUpKSB7XG4gICAgICAgIGF3YWl0IHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleChcbiAgICAgICAgICBhcHAsIGluZGV4Tm9kZS5ub2RlS2V5KCksXG4gICAgICAgICAgcmVjb3JkS2V5LCByZWNvcmRDb3VudCxcbiAgICAgICAgKTtcbiAgICAgICAgcmVjb3JkQ291bnQrKztcbiAgICAgIH1cblxuICAgICAgaWYgKGhhc0FwcGxpY2FibGVEZWNlbmRhbnQoYXBwLmhpZXJhcmNoeSwgcmVjb3JkTm9kZSwgaW5kZXhOb2RlKSkge1xuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkQ29sbGVjdGlvbk5vZGUgb2YgcmVjb3JkTm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgIHJlY29yZENvdW50ID0gYXdhaXQgYXBwbHlBbGxEZWNlbmRhbnRSZWNvcmRzKFxuICAgICAgICAgICAgYXBwLFxuICAgICAgICAgICAgam9pbktleShyZWNvcmRLZXksIGNoaWxkQ29sbGVjdGlvbk5vZGUuY29sbGVjdGlvbk5hbWUpLFxuICAgICAgICAgICAgaW5kZXhOb2RlLCBpbmRleEtleSwgY3VycmVudEluZGV4ZWREYXRhLFxuICAgICAgICAgICAgY3VycmVudEluZGV4ZWREYXRhS2V5LCByZWNvcmRDb3VudCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGxldCBhbGxJZHMgPSBhd2FpdCBhbGxJZHNJdGVyYXRvcigpO1xuICB3aGlsZSAoYWxsSWRzLmRvbmUgPT09IGZhbHNlKSB7XG4gICAgYXdhaXQgY3JlYXRlVHJhbnNhY3Rpb25zRm9ySWRzKFxuICAgICAgYWxsSWRzLnJlc3VsdC5jb2xsZWN0aW9uS2V5LFxuICAgICAgYWxsSWRzLnJlc3VsdC5pZHMsXG4gICAgKTtcbiAgICBhbGxJZHMgPSBhd2FpdCBhbGxJZHNJdGVyYXRvcigpO1xuICB9XG5cbiAgcmV0dXJuIHJlY29yZENvdW50O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYnVpbGRJbmRleDtcbiIsImltcG9ydCB7IGhhcywgaXNOdW1iZXIsIGlzVW5kZWZpbmVkIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCB7XG4gIHNhZmVLZXksIGFwaVdyYXBwZXIsXG4gIGV2ZW50cywgaXNOb25FbXB0eVN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGl0ZXJhdGVJbmRleCB9IGZyb20gJy4uL2luZGV4aW5nL3JlYWQnO1xuaW1wb3J0IHtcbiAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5LFxuICBnZXRTaGFyZEtleXNJblJhbmdlLFxufSBmcm9tICcuLi9pbmRleGluZy9zaGFyZGluZyc7XG5pbXBvcnQge1xuICBnZXRFeGFjdE5vZGVGb3JQYXRoLCBpc0luZGV4LFxuICBpc1NoYXJkZWRJbmRleCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUyB9IGZyb20gJy4uL2luZGV4aW5nL3NlcmlhbGl6ZXInO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBhZ2dyZWdhdGVzID0gYXBwID0+IGFzeW5jIChpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcyA9IG51bGwsIHJhbmdlRW5kUGFyYW1zID0gbnVsbCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuaW5kZXhBcGkuYWdncmVnYXRlcyxcbiAgcGVybWlzc2lvbi5yZWFkSW5kZXguaXNBdXRob3JpemVkKGluZGV4S2V5KSxcbiAgeyBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMgfSxcbiAgX2FnZ3JlZ2F0ZXMsIGFwcCwgaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zLFxuKTtcblxuY29uc3QgX2FnZ3JlZ2F0ZXMgPSBhc3luYyAoYXBwLCBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMpID0+IHtcbiAgaW5kZXhLZXkgPSBzYWZlS2V5KGluZGV4S2V5KTtcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShpbmRleEtleSk7XG5cbiAgaWYgKCFpc0luZGV4KGluZGV4Tm9kZSkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignc3VwcGxpZWQga2V5IGlzIG5vdCBhbiBpbmRleCcpOyB9XG5cbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICBjb25zdCBzaGFyZEtleXMgPSBhd2FpdCBnZXRTaGFyZEtleXNJblJhbmdlKFxuICAgICAgYXBwLCBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMsXG4gICAgKTtcbiAgICBsZXQgYWdncmVnYXRlUmVzdWx0ID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IGsgb2Ygc2hhcmRLZXlzKSB7XG4gICAgICBjb25zdCBzaGFyZFJlc3VsdCA9IGF3YWl0IGdldEFnZ3JlZ2F0ZXMoYXBwLmhpZXJhcmNoeSwgYXBwLmRhdGFzdG9yZSwgaW5kZXhOb2RlLCBrKTtcbiAgICAgIGlmIChhZ2dyZWdhdGVSZXN1bHQgPT09IG51bGwpIHtcbiAgICAgICAgYWdncmVnYXRlUmVzdWx0ID0gc2hhcmRSZXN1bHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZ2dyZWdhdGVSZXN1bHQgPSBtZXJnZVNoYXJkQWdncmVnYXRlKFxuICAgICAgICAgIGFnZ3JlZ2F0ZVJlc3VsdCxcbiAgICAgICAgICBzaGFyZFJlc3VsdCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFnZ3JlZ2F0ZVJlc3VsdDtcbiAgfVxuICByZXR1cm4gYXdhaXQgZ2V0QWdncmVnYXRlcyhcbiAgICBhcHAuaGllcmFyY2h5LFxuICAgIGFwcC5kYXRhc3RvcmUsXG4gICAgaW5kZXhOb2RlLFxuICAgIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleShpbmRleEtleSksXG4gICk7XG59O1xuXG5jb25zdCBtZXJnZVNoYXJkQWdncmVnYXRlID0gKHRvdGFscywgc2hhcmQpID0+IHtcbiAgY29uc3QgbWVyZ2VHcm91cGluZyA9ICh0b3QsIHNocikgPT4ge1xuICAgIHRvdC5jb3VudCArPSBzaHIuY291bnQ7XG4gICAgZm9yIChjb25zdCBhZ2dOYW1lIGluIHRvdCkge1xuICAgICAgaWYgKGFnZ05hbWUgPT09ICdjb3VudCcpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgdG90YWdnID0gdG90W2FnZ05hbWVdO1xuICAgICAgY29uc3Qgc2hyYWdnID0gc2hyW2FnZ05hbWVdO1xuICAgICAgdG90YWdnLnN1bSArPSBzaHJhZ2cuc3VtO1xuICAgICAgdG90YWdnLm1heCA9IHRvdGFnZy5tYXggPiBzaHJhZ2cubWF4XG4gICAgICAgID8gdG90YWdnLm1heFxuICAgICAgICA6IHNocmFnZy5tYXg7XG4gICAgICB0b3RhZ2cubWluID0gdG90YWdnLm1pbiA8IHNocmFnZy5taW5cbiAgICAgICAgPyB0b3RhZ2cubWluXG4gICAgICAgIDogc2hyYWdnLm1pbjtcbiAgICAgIHRvdGFnZy5tZWFuID0gdG90YWdnLnN1bSAvIHRvdC5jb3VudDtcbiAgICB9XG4gICAgcmV0dXJuIHRvdDtcbiAgfTtcblxuICBmb3IgKGNvbnN0IGFnZ0dyb3VwRGVmIGluIHRvdGFscykge1xuICAgIGZvciAoY29uc3QgZ3JvdXBpbmcgaW4gc2hhcmRbYWdnR3JvdXBEZWZdKSB7XG4gICAgICBjb25zdCBncm91cGluZ1RvdGFsID0gdG90YWxzW2FnZ0dyb3VwRGVmXVtncm91cGluZ107XG4gICAgICB0b3RhbHNbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXSA9IGlzVW5kZWZpbmVkKGdyb3VwaW5nVG90YWwpXG4gICAgICAgID8gc2hhcmRbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXVxuICAgICAgICA6IG1lcmdlR3JvdXBpbmcoXG4gICAgICAgICAgdG90YWxzW2FnZ0dyb3VwRGVmXVtncm91cGluZ10sXG4gICAgICAgICAgc2hhcmRbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXSxcbiAgICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdG90YWxzO1xufTtcblxuY29uc3QgZ2V0QWdncmVnYXRlcyA9IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KSA9PiB7XG4gIGNvbnN0IGFnZ3JlZ2F0ZVJlc3VsdCA9IHt9O1xuICBjb25zdCBkb1JlYWQgPSBpdGVyYXRlSW5kZXgoXG4gICAgICAgIGFzeW5jIGl0ZW0gPT4ge1xuICAgICAgYXBwbHlJdGVtVG9BZ2dyZWdhdGVSZXN1bHQoXG4gICAgICAgIGluZGV4LCBhZ2dyZWdhdGVSZXN1bHQsIGl0ZW0sXG4gICAgICApO1xuICAgICAgcmV0dXJuIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcbiAgICB9LFxuICAgICAgICBhc3luYyAoKSA9PiBhZ2dyZWdhdGVSZXN1bHRcbiAgKTtcblxuICByZXR1cm4gYXdhaXQgZG9SZWFkKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXkpO1xufTtcblxuXG5jb25zdCBhcHBseUl0ZW1Ub0FnZ3JlZ2F0ZVJlc3VsdCA9IChpbmRleE5vZGUsIHJlc3VsdCwgaXRlbSkgPT4ge1xuICBjb25zdCBnZXRJbml0aWFsQWdncmVnYXRlUmVzdWx0ID0gKCkgPT4gKHtcbiAgICBzdW06IDAsIG1lYW46IG51bGwsIG1heDogbnVsbCwgbWluOiBudWxsLFxuICB9KTtcblxuICBjb25zdCBhcHBseUFnZ3JlZ2F0ZVJlc3VsdCA9IChhZ2csIGV4aXN0aW5nLCBjb3VudCkgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gY29tcGlsZUNvZGUoYWdnLmFnZ3JlZ2F0ZWRWYWx1ZSkoeyByZWNvcmQ6IGl0ZW0gfSk7XG5cbiAgICBpZiAoIWlzTnVtYmVyKHZhbHVlKSkgcmV0dXJuIGV4aXN0aW5nO1xuXG4gICAgZXhpc3Rpbmcuc3VtICs9IHZhbHVlO1xuICAgIGV4aXN0aW5nLm1heCA9IHZhbHVlID4gZXhpc3RpbmcubWF4IHx8IGV4aXN0aW5nLm1heCA9PT0gbnVsbFxuICAgICAgPyB2YWx1ZVxuICAgICAgOiBleGlzdGluZy5tYXg7XG4gICAgZXhpc3RpbmcubWluID0gdmFsdWUgPCBleGlzdGluZy5taW4gfHwgZXhpc3RpbmcubWluID09PSBudWxsXG4gICAgICA/IHZhbHVlXG4gICAgICA6IGV4aXN0aW5nLm1pbjtcbiAgICBleGlzdGluZy5tZWFuID0gZXhpc3Rpbmcuc3VtIC8gY291bnQ7XG4gICAgcmV0dXJuIGV4aXN0aW5nO1xuICB9O1xuXG4gIGZvciAoY29uc3QgYWdnR3JvdXAgb2YgaW5kZXhOb2RlLmFnZ3JlZ2F0ZUdyb3Vwcykge1xuICAgIGlmICghaGFzKGFnZ0dyb3VwLm5hbWUpKHJlc3VsdCkpIHtcbiAgICAgIHJlc3VsdFthZ2dHcm91cC5uYW1lXSA9IHt9O1xuICAgIH1cblxuICAgIGNvbnN0IHRoaXNHcm91cFJlc3VsdCA9IHJlc3VsdFthZ2dHcm91cC5uYW1lXTtcblxuICAgIGlmIChpc05vbkVtcHR5U3RyaW5nKGFnZ0dyb3VwLmNvbmRpdGlvbikpIHtcbiAgICAgIGlmICghY29tcGlsZUV4cHJlc3Npb24oYWdnR3JvdXAuY29uZGl0aW9uKSh7IHJlY29yZDogaXRlbSB9KSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgZ3JvdXAgPSBpc05vbkVtcHR5U3RyaW5nKGFnZ0dyb3VwLmdyb3VwQnkpXG4gICAgICA/IGNvbXBpbGVDb2RlKGFnZ0dyb3VwLmdyb3VwQnkpKHsgcmVjb3JkOiBpdGVtIH0pXG4gICAgICA6ICdhbGwnO1xuICAgIGlmICghaXNOb25FbXB0eVN0cmluZyhncm91cCkpIHtcbiAgICAgIGdyb3VwID0gJyhub25lKSc7XG4gICAgfVxuXG4gICAgaWYgKCFoYXMoZ3JvdXApKHRoaXNHcm91cFJlc3VsdCkpIHtcbiAgICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF0gPSB7IGNvdW50OiAwIH07XG4gICAgICBmb3IgKGNvbnN0IGFnZyBvZiBhZ2dHcm91cC5hZ2dyZWdhdGVzKSB7XG4gICAgICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF1bYWdnLm5hbWVdID0gZ2V0SW5pdGlhbEFnZ3JlZ2F0ZVJlc3VsdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF0uY291bnQrKztcblxuICAgIGZvciAoY29uc3QgYWdnIG9mIGFnZ0dyb3VwLmFnZ3JlZ2F0ZXMpIHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nVmFsdWVzID0gdGhpc0dyb3VwUmVzdWx0W2dyb3VwXVthZ2cubmFtZV07XG4gICAgICB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdW2FnZy5uYW1lXSA9IGFwcGx5QWdncmVnYXRlUmVzdWx0KFxuICAgICAgICBhZ2csIGV4aXN0aW5nVmFsdWVzLFxuICAgICAgICB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdLmNvdW50LFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBidWlsZEluZGV4IH0gZnJvbSAnLi9idWlsZEluZGV4JztcbmltcG9ydCB7IGxpc3RJdGVtcyB9IGZyb20gJy4vbGlzdEl0ZW1zJztcbmltcG9ydCB7IGFnZ3JlZ2F0ZXMgfSBmcm9tICcuL2FnZ3JlZ2F0ZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhBcGkgPSBhcHAgPT4gKHtcbiAgbGlzdEl0ZW1zOiBsaXN0SXRlbXMoYXBwKSxcbiAgYnVpbGRJbmRleDogYnVpbGRJbmRleChhcHApLFxuICBhZ2dyZWdhdGVzOiBhZ2dyZWdhdGVzKGFwcCksXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0SW5kZXhBcGk7XG4iLCJpbXBvcnQgeyBlYWNoLCBmaW5kIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IG1hcCwgbWF4LCBjb25zdGFudCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgam9pbktleSxcbiAgJCwgaXNOb3RoaW5nLCBpc1NvbWV0aGluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIGlzSW5kZXgsIGlzUm9vdCwgaXNTaW5nbGVSZWNvcmQsIGlzQ29sbGVjdGlvblJlY29yZCxcbiAgaXNSZWNvcmQsIGlzYWdncmVnYXRlR3JvdXAsXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbn0gZnJvbSAnLi9oaWVyYXJjaHknO1xuaW1wb3J0IHsgYWxsIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVOb2RlRXJyb3JzID0ge1xuICBpbmRleENhbm5vdEJlUGFyZW50OiAnSW5kZXggdGVtcGxhdGUgY2Fubm90IGJlIGEgcGFyZW50JyxcbiAgYWxsTm9uUm9vdE5vZGVzTXVzdEhhdmVQYXJlbnQ6ICdPbmx5IHRoZSByb290IG5vZGUgbWF5IGhhdmUgbm8gcGFyZW50JyxcbiAgaW5kZXhQYXJlbnRNdXN0QmVSZWNvcmRPclJvb3Q6ICdBbiBpbmRleCBtYXkgb25seSBoYXZlIGEgcmVjb3JkIG9yIHJvb3QgYXMgYSBwYXJlbnQnLFxuICBhZ2dyZWdhdGVQYXJlbnRNdXN0QmVBbkluZGV4OiAnYWdncmVnYXRlR3JvdXAgcGFyZW50IG11c3QgYmUgYW4gaW5kZXgnLFxufTtcblxuY29uc3QgcGF0aFJlZ3hNYWtlciA9IG5vZGUgPT4gKCkgPT4gbm9kZS5ub2RlS2V5KCkucmVwbGFjZSgve2lkfS9nLCAnW2EtekEtWjAtOV8tXSsnKTtcblxuY29uc3Qgbm9kZUtleU1ha2VyID0gbm9kZSA9PiAoKSA9PiBzd2l0Y2hDYXNlKFxuXG4gIFtuID0+IGlzUmVjb3JkKG4pICYmICFpc1NpbmdsZVJlY29yZChuKSxcbiAgICBuID0+IGpvaW5LZXkoXG4gICAgICBub2RlLnBhcmVudCgpLm5vZGVLZXkoKSxcbiAgICAgIG5vZGUuY29sbGVjdGlvbk5hbWUsXG4gICAgICBgJHtuLm5vZGVJZH0te2lkfWAsXG4gICAgKV0sXG5cbiAgW2lzUm9vdCxcbiAgICBjb25zdGFudCgnLycpXSxcblxuICBbZGVmYXVsdENhc2UsXG4gICAgbiA9PiBqb2luS2V5KG5vZGUucGFyZW50KCkubm9kZUtleSgpLCBuLm5hbWUpXSxcblxuKShub2RlKTtcblxuXG5jb25zdCB2YWxpZGF0ZSA9IHBhcmVudCA9PiAobm9kZSkgPT4ge1xuICBpZiAoaXNJbmRleChub2RlKVxuICAgICAgICAmJiBpc1NvbWV0aGluZyhwYXJlbnQpXG4gICAgICAgICYmICFpc1Jvb3QocGFyZW50KVxuICAgICAgICAmJiAhaXNSZWNvcmQocGFyZW50KSkge1xuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoY3JlYXRlTm9kZUVycm9ycy5pbmRleFBhcmVudE11c3RCZVJlY29yZE9yUm9vdCk7XG4gIH1cblxuICBpZiAoaXNhZ2dyZWdhdGVHcm91cChub2RlKVxuICAgICAgICAmJiBpc1NvbWV0aGluZyhwYXJlbnQpXG4gICAgICAgICYmICFpc0luZGV4KHBhcmVudCkpIHtcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGNyZWF0ZU5vZGVFcnJvcnMuYWdncmVnYXRlUGFyZW50TXVzdEJlQW5JbmRleCk7XG4gIH1cblxuICBpZiAoaXNOb3RoaW5nKHBhcmVudCkgJiYgIWlzUm9vdChub2RlKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGNyZWF0ZU5vZGVFcnJvcnMuYWxsTm9uUm9vdE5vZGVzTXVzdEhhdmVQYXJlbnQpOyB9XG5cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5jb25zdCBjb25zdHJ1Y3QgPSBwYXJlbnQgPT4gKG5vZGUpID0+IHtcbiAgbm9kZS5ub2RlS2V5ID0gbm9kZUtleU1ha2VyKG5vZGUpO1xuICBub2RlLnBhdGhSZWd4ID0gcGF0aFJlZ3hNYWtlcihub2RlKTtcbiAgbm9kZS5wYXJlbnQgPSBjb25zdGFudChwYXJlbnQpO1xuICBub2RlLmlzUm9vdCA9ICgpID0+IGlzTm90aGluZyhwYXJlbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBub2RlLm5hbWUgPT09ICdyb290J1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgbm9kZS50eXBlID09PSAncm9vdCc7XG4gIGlmIChpc0NvbGxlY3Rpb25SZWNvcmQobm9kZSkpIHtcbiAgICBub2RlLmNvbGxlY3Rpb25Ob2RlS2V5ID0gKCkgPT4gam9pbktleShcbiAgICAgIHBhcmVudC5ub2RlS2V5KCksIG5vZGUuY29sbGVjdGlvbk5hbWUsXG4gICAgKTtcbiAgICBub2RlLmNvbGxlY3Rpb25QYXRoUmVneCA9ICgpID0+IGpvaW5LZXkoXG4gICAgICBwYXJlbnQucGF0aFJlZ3goKSwgbm9kZS5jb2xsZWN0aW9uTmFtZSxcbiAgICApO1xuICB9XG4gIHJldHVybiBub2RlO1xufTtcblxuY29uc3QgYWRkVG9QYXJlbnQgPSAob2JqKSA9PiB7XG4gIGNvbnN0IHBhcmVudCA9IG9iai5wYXJlbnQoKTtcbiAgaWYgKGlzU29tZXRoaW5nKHBhcmVudCkpIHtcbiAgICBpZiAoaXNJbmRleChvYmopKVxuICAgIC8vIFE6IHdoeSBhcmUgaW5kZXhlcyBub3QgY2hpbGRyZW4gP1xuICAgIC8vIEE6IGJlY2F1c2UgdGhleSBjYW5ub3QgaGF2ZSBjaGlsZHJlbiBvZiB0aGVpciBvd24uXG4gICAgeyBwYXJlbnQuaW5kZXhlcy5wdXNoKG9iaik7IH0gZWxzZSBpZiAoaXNhZ2dyZWdhdGVHcm91cChvYmopKSB7IHBhcmVudC5hZ2dyZWdhdGVHcm91cHMucHVzaChvYmopOyB9IGVsc2UgeyBwYXJlbnQuY2hpbGRyZW4ucHVzaChvYmopOyB9XG5cbiAgICBpZiAoaXNSZWNvcmQob2JqKSkge1xuICAgICAgY29uc3QgZGVmYXVsdEluZGV4ID0gZmluZChcbiAgICAgICAgcGFyZW50LmluZGV4ZXMsXG4gICAgICAgIGkgPT4gaS5uYW1lID09PSBgJHtwYXJlbnQubmFtZX1faW5kZXhgLFxuICAgICAgKTtcbiAgICAgIGlmIChkZWZhdWx0SW5kZXgpIHtcbiAgICAgICAgZGVmYXVsdEluZGV4LmFsbG93ZWRSZWNvcmROb2RlSWRzLnB1c2gob2JqLm5vZGVJZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmo7XG59O1xuXG5leHBvcnQgY29uc3QgY29uc3RydWN0Tm9kZSA9IChwYXJlbnQsIG9iaikgPT4gJChvYmosIFtcbiAgY29uc3RydWN0KHBhcmVudCksXG4gIHZhbGlkYXRlKHBhcmVudCksXG4gIGFkZFRvUGFyZW50LFxuXSk7XG5cbmNvbnN0IGdldE5vZGVJZCA9IChwYXJlbnROb2RlKSA9PiB7XG4gIC8vIHRoaXMgY2FzZSBpcyBoYW5kbGVkIGJldHRlciBlbHNld2hlcmVcbiAgaWYgKCFwYXJlbnROb2RlKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZmluZFJvb3QgPSBuID0+IChpc1Jvb3QobikgPyBuIDogZmluZFJvb3Qobi5wYXJlbnQoKSkpO1xuICBjb25zdCByb290ID0gZmluZFJvb3QocGFyZW50Tm9kZSk7XG5cbiAgcmV0dXJuICgkKHJvb3QsIFtcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gICAgbWFwKG4gPT4gbi5ub2RlSWQpLFxuICAgIG1heF0pICsgMSk7XG59O1xuXG5leHBvcnQgY29uc3QgY29uc3RydWN0SGllcmFyY2h5ID0gKG5vZGUsIHBhcmVudCkgPT4ge1xuICBjb25zdHJ1Y3QocGFyZW50KShub2RlKTtcbiAgaWYgKG5vZGUuaW5kZXhlcykge1xuICAgIGVhY2gobm9kZS5pbmRleGVzLFxuICAgICAgY2hpbGQgPT4gY29uc3RydWN0SGllcmFyY2h5KGNoaWxkLCBub2RlKSk7XG4gIH1cbiAgaWYgKG5vZGUuYWdncmVnYXRlR3JvdXBzKSB7XG4gICAgZWFjaChub2RlLmFnZ3JlZ2F0ZUdyb3VwcyxcbiAgICAgIGNoaWxkID0+IGNvbnN0cnVjdEhpZXJhcmNoeShjaGlsZCwgbm9kZSkpO1xuICB9XG4gIGlmIChub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgIGVhY2gobm9kZS5jaGlsZHJlbixcbiAgICAgIGNoaWxkID0+IGNvbnN0cnVjdEhpZXJhcmNoeShjaGlsZCwgbm9kZSkpO1xuICB9XG4gIGlmIChub2RlLmZpZWxkcykge1xuICAgIGVhY2gobm9kZS5maWVsZHMsXG4gICAgICBmID0+IGVhY2goZi50eXBlT3B0aW9ucywgKHZhbCwga2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IGRlZiA9IGFsbFtmLnR5cGVdLm9wdGlvbkRlZmluaXRpb25zW2tleV07XG4gICAgICAgIGlmICghZGVmKSB7XG4gICAgICAgICAgLy8gdW5rbm93biB0eXBlT3B0aW9uXG4gICAgICAgICAgZGVsZXRlIGYudHlwZU9wdGlvbnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmLnR5cGVPcHRpb25zW2tleV0gPSBkZWYucGFyc2UodmFsKTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICB9XG4gIHJldHVybiBub2RlO1xufTtcblxuXG5leHBvcnQgY29uc3QgZ2V0TmV3Um9vdExldmVsID0gKCkgPT4gY29uc3RydWN0KCkoe1xuICBuYW1lOiAncm9vdCcsXG4gIHR5cGU6ICdyb290JyxcbiAgY2hpbGRyZW46IFtdLFxuICBwYXRoTWFwczogW10sXG4gIGluZGV4ZXM6IFtdLFxuICBub2RlSWQ6IDAsXG59KTtcblxuY29uc3QgX2dldE5ld1JlY29yZFRlbXBsYXRlID0gKHBhcmVudCwgbmFtZSwgY3JlYXRlRGVmYXVsdEluZGV4LCBpc1NpbmdsZSkgPT4ge1xuICBjb25zdCBub2RlID0gY29uc3RydWN0Tm9kZShwYXJlbnQsIHtcbiAgICBuYW1lLFxuICAgIHR5cGU6ICdyZWNvcmQnLFxuICAgIGZpZWxkczogW10sXG4gICAgY2hpbGRyZW46IFtdLFxuICAgIHZhbGlkYXRpb25SdWxlczogW10sXG4gICAgbm9kZUlkOiBnZXROb2RlSWQocGFyZW50KSxcbiAgICBpbmRleGVzOiBbXSxcbiAgICBhbGxpZHNTaGFyZEZhY3RvcjogaXNSZWNvcmQocGFyZW50KSA/IDEgOiA2NCxcbiAgICBjb2xsZWN0aW9uTmFtZTogJycsXG4gICAgaXNTaW5nbGUsXG4gIH0pO1xuXG4gIGlmIChjcmVhdGVEZWZhdWx0SW5kZXgpIHtcbiAgICBjb25zdCBkZWZhdWx0SW5kZXggPSBnZXROZXdJbmRleFRlbXBsYXRlKHBhcmVudCk7XG4gICAgZGVmYXVsdEluZGV4Lm5hbWUgPSBgJHtuYW1lfV9pbmRleGA7XG4gICAgZGVmYXVsdEluZGV4LmFsbG93ZWRSZWNvcmROb2RlSWRzLnB1c2gobm9kZS5ub2RlSWQpO1xuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3UmVjb3JkVGVtcGxhdGUgPSAocGFyZW50LCBuYW1lID0gJycsIGNyZWF0ZURlZmF1bHRJbmRleCA9IHRydWUpID0+IF9nZXROZXdSZWNvcmRUZW1wbGF0ZShwYXJlbnQsIG5hbWUsIGNyZWF0ZURlZmF1bHRJbmRleCwgZmFsc2UpO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3U2luZ2xlUmVjb3JkVGVtcGxhdGUgPSBwYXJlbnQgPT4gX2dldE5ld1JlY29yZFRlbXBsYXRlKHBhcmVudCwgJycsIGZhbHNlLCB0cnVlKTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0luZGV4VGVtcGxhdGUgPSAocGFyZW50LCB0eXBlID0gJ2FuY2VzdG9yJykgPT4gY29uc3RydWN0Tm9kZShwYXJlbnQsIHtcbiAgbmFtZTogJycsXG4gIHR5cGU6ICdpbmRleCcsXG4gIG1hcDogJ3JldHVybiB7Li4ucmVjb3JkfTsnLFxuICBmaWx0ZXI6ICcnLFxuICBpbmRleFR5cGU6IHR5cGUsXG4gIGdldFNoYXJkTmFtZTogJycsXG4gIGdldFNvcnRLZXk6ICdyZWNvcmQuaWQnLFxuICBhZ2dyZWdhdGVHcm91cHM6IFtdLFxuICBhbGxvd2VkUmVjb3JkTm9kZUlkczogW10sXG4gIG5vZGVJZDogZ2V0Tm9kZUlkKHBhcmVudCksXG59KTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0FnZ3JlZ2F0ZUdyb3VwVGVtcGxhdGUgPSBpbmRleCA9PiBjb25zdHJ1Y3ROb2RlKGluZGV4LCB7XG4gIG5hbWU6ICcnLFxuICB0eXBlOiAnYWdncmVnYXRlR3JvdXAnLFxuICBncm91cEJ5OiAnJyxcbiAgYWdncmVnYXRlczogW10sXG4gIGNvbmRpdGlvbjogJycsXG4gIG5vZGVJZDogZ2V0Tm9kZUlkKGluZGV4KSxcbn0pO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3QWdncmVnYXRlVGVtcGxhdGUgPSAoc2V0KSA9PiB7XG4gIGNvbnN0IGFnZ3JlZ2F0ZWRWYWx1ZSA9IHtcbiAgICBuYW1lOiAnJyxcbiAgICBhZ2dyZWdhdGVkVmFsdWU6ICcnLFxuICB9O1xuICBzZXQuYWdncmVnYXRlcy5wdXNoKGFnZ3JlZ2F0ZWRWYWx1ZSk7XG4gIHJldHVybiBhZ2dyZWdhdGVkVmFsdWU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdldE5ld1Jvb3RMZXZlbCxcbiAgZ2V0TmV3UmVjb3JkVGVtcGxhdGUsXG4gIGdldE5ld0luZGV4VGVtcGxhdGUsXG4gIGNyZWF0ZU5vZGVFcnJvcnMsXG4gIGNvbnN0cnVjdEhpZXJhcmNoeSxcbiAgZ2V0TmV3QWdncmVnYXRlR3JvdXBUZW1wbGF0ZSxcbiAgZ2V0TmV3QWdncmVnYXRlVGVtcGxhdGUsXG59O1xuIiwiaW1wb3J0IHtcbiAgc29tZSwgbWFwLCBmaWx0ZXIsIGtleXMsIGluY2x1ZGVzLFxuICBjb3VudEJ5LCBmbGF0dGVuLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgaXNTb21ldGhpbmcsICQsXG4gIGlzTm9uRW1wdHlTdHJpbmcsXG4gIGlzTm90aGluZ09yRW1wdHksXG4gIGlzTm90aGluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGFsbCwgZ2V0RGVmYXVsdE9wdGlvbnMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBmaWVsZEVycm9ycyA9IHtcbiAgQWRkRmllbGRWYWxpZGF0aW9uRmFpbGVkOiAnQWRkIGZpZWxkIHZhbGlkYXRpb246ICcsXG59O1xuXG5leHBvcnQgY29uc3QgYWxsb3dlZFR5cGVzID0gKCkgPT4ga2V5cyhhbGwpO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3RmllbGQgPSB0eXBlID0+ICh7XG4gIG5hbWU6ICcnLCAvLyBob3cgZmllbGQgaXMgcmVmZXJlbmNlZCBpbnRlcm5hbGx5XG4gIHR5cGUsXG4gIHR5cGVPcHRpb25zOiBnZXREZWZhdWx0T3B0aW9ucyh0eXBlKSxcbiAgbGFiZWw6ICcnLCAvLyBob3cgZmllbGQgaXMgZGlzcGxheWVkXG4gIGdldEluaXRpYWxWYWx1ZTogJ2RlZmF1bHQnLCAvLyBmdW5jdGlvbiB0aGF0IGdldHMgdmFsdWUgd2hlbiBpbml0aWFsbHkgY3JlYXRlZFxuICBnZXRVbmRlZmluZWRWYWx1ZTogJ2RlZmF1bHQnLCAvLyBmdW5jdGlvbiB0aGF0IGdldHMgdmFsdWUgd2hlbiBmaWVsZCB1bmRlZmluZWQgb24gcmVjb3JkXG59KTtcblxuY29uc3QgZmllbGRSdWxlcyA9IGFsbEZpZWxkcyA9PiBbXG4gIG1ha2VydWxlKCduYW1lJywgJ2ZpZWxkIG5hbWUgaXMgbm90IHNldCcsXG4gICAgZiA9PiBpc05vbkVtcHR5U3RyaW5nKGYubmFtZSkpLFxuICBtYWtlcnVsZSgndHlwZScsICdmaWVsZCB0eXBlIGlzIG5vdCBzZXQnLFxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLnR5cGUpKSxcbiAgbWFrZXJ1bGUoJ2xhYmVsJywgJ2ZpZWxkIGxhYmVsIGlzIG5vdCBzZXQnLFxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLmxhYmVsKSksXG4gIG1ha2VydWxlKCdnZXRJbml0aWFsVmFsdWUnLCAnZ2V0SW5pdGlhbFZhbHVlIGZ1bmN0aW9uIGlzIG5vdCBzZXQnLFxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLmdldEluaXRpYWxWYWx1ZSkpLFxuICBtYWtlcnVsZSgnZ2V0VW5kZWZpbmVkVmFsdWUnLCAnZ2V0VW5kZWZpbmVkVmFsdWUgZnVuY3Rpb24gaXMgbm90IHNldCcsXG4gICAgZiA9PiBpc05vbkVtcHR5U3RyaW5nKGYuZ2V0VW5kZWZpbmVkVmFsdWUpKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnZmllbGQgbmFtZSBpcyBkdXBsaWNhdGVkJyxcbiAgICBmID0+IGlzTm90aGluZ09yRW1wdHkoZi5uYW1lKVxuICAgICAgICAgICAgIHx8IGNvdW50QnkoJ25hbWUnKShhbGxGaWVsZHMpW2YubmFtZV0gPT09IDEpLFxuICBtYWtlcnVsZSgndHlwZScsICd0eXBlIGlzIHVua25vd24nLFxuICAgIGYgPT4gaXNOb3RoaW5nT3JFbXB0eShmLnR5cGUpXG4gICAgICAgICAgICAgfHwgc29tZSh0ID0+IGYudHlwZSA9PT0gdCkoYWxsb3dlZFR5cGVzKCkpKSxcbl07XG5cbmNvbnN0IHR5cGVPcHRpb25zUnVsZXMgPSAoZmllbGQpID0+IHtcbiAgY29uc3QgdHlwZSA9IGFsbFtmaWVsZC50eXBlXTtcbiAgaWYgKGlzTm90aGluZyh0eXBlKSkgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IGRlZiA9IG9wdE5hbWUgPT4gdHlwZS5vcHRpb25EZWZpbml0aW9uc1tvcHROYW1lXTtcblxuICByZXR1cm4gJChmaWVsZC50eXBlT3B0aW9ucywgW1xuICAgIGtleXMsXG4gICAgZmlsdGVyKG8gPT4gaXNTb21ldGhpbmcoZGVmKG8pKVxuICAgICAgICAgICAgICAgICAgICAmJiBpc1NvbWV0aGluZyhkZWYobykuaXNWYWxpZCkpLFxuICAgIG1hcChvID0+IG1ha2VydWxlKFxuICAgICAgYHR5cGVPcHRpb25zLiR7b31gLFxuICAgICAgYCR7ZGVmKG8pLnJlcXVpcmVtZW50RGVzY3JpcHRpb259YCxcbiAgICAgIGZpZWxkID0+IGRlZihvKS5pc1ZhbGlkKGZpZWxkLnR5cGVPcHRpb25zW29dKSxcbiAgICApKSxcbiAgXSk7XG59O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVGaWVsZCA9IGFsbEZpZWxkcyA9PiAoZmllbGQpID0+IHtcbiAgY29uc3QgZXZlcnlTaW5nbGVGaWVsZCA9IGluY2x1ZGVzKGZpZWxkKShhbGxGaWVsZHMpID8gYWxsRmllbGRzIDogWy4uLmFsbEZpZWxkcywgZmllbGRdO1xuICByZXR1cm4gYXBwbHlSdWxlU2V0KFsuLi5maWVsZFJ1bGVzKGV2ZXJ5U2luZ2xlRmllbGQpLCAuLi50eXBlT3B0aW9uc1J1bGVzKGZpZWxkKV0pKGZpZWxkKTtcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFsbEZpZWxkcyA9IHJlY29yZE5vZGUgPT4gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICBtYXAodmFsaWRhdGVGaWVsZChyZWNvcmROb2RlLmZpZWxkcykpLFxuICBmbGF0dGVuLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBhZGRGaWVsZCA9IChyZWNvcmRUZW1wbGF0ZSwgZmllbGQpID0+IHtcbiAgaWYgKGlzTm90aGluZ09yRW1wdHkoZmllbGQubGFiZWwpKSB7XG4gICAgZmllbGQubGFiZWwgPSBmaWVsZC5uYW1lO1xuICB9XG4gIGNvbnN0IHZhbGlkYXRpb25NZXNzYWdlcyA9IHZhbGlkYXRlRmllbGQoWy4uLnJlY29yZFRlbXBsYXRlLmZpZWxkcywgZmllbGRdKShmaWVsZCk7XG4gIGlmICh2YWxpZGF0aW9uTWVzc2FnZXMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGVycm9ycyA9IG1hcChtID0+IG0uZXJyb3IpKHZhbGlkYXRpb25NZXNzYWdlcyk7XG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgJHtmaWVsZEVycm9ycy5BZGRGaWVsZFZhbGlkYXRpb25GYWlsZWR9ICR7ZXJyb3JzLmpvaW4oJywgJyl9YCk7XG4gIH1cbiAgcmVjb3JkVGVtcGxhdGUuZmllbGRzLnB1c2goZmllbGQpO1xufTtcbiIsImltcG9ydCB7IGlzTnVtYmVyLCBpc0Jvb2xlYW4sIGRlZmF1bHRDYXNlIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHN3aXRjaENhc2UgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUgPSAoaW52YWxpZEZpZWxkcyxcbiAgbWVzc2FnZVdoZW5JbnZhbGlkLFxuICBleHByZXNzaW9uV2hlblZhbGlkKSA9PiAoe1xuICBpbnZhbGlkRmllbGRzLCBtZXNzYWdlV2hlbkludmFsaWQsIGV4cHJlc3Npb25XaGVuVmFsaWQsXG59KTtcblxuY29uc3QgZ2V0U3RhdGljVmFsdWUgPSBzd2l0Y2hDYXNlKFxuICBbaXNOdW1iZXIsIHYgPT4gdi50b1N0cmluZygpXSxcbiAgW2lzQm9vbGVhbiwgdiA9PiB2LnRvU3RyaW5nKCldLFxuICBbZGVmYXVsdENhc2UsIHYgPT4gYCcke3Z9J2BdLFxuKTtcblxuZXhwb3J0IGNvbnN0IGNvbW1vblJlY29yZFZhbGlkYXRpb25SdWxlcyA9ICh7XG5cbiAgZmllbGROb3RFbXB0eTogZmllbGROYW1lID0+IGdldE5ld1JlY29yZFZhbGlkYXRpb25SdWxlKFxuICAgIFtmaWVsZE5hbWVdLFxuICAgIGAke2ZpZWxkTmFtZX0gaXMgZW1wdHlgLFxuICAgIGAhXy5pc0VtcHR5KHJlY29yZFsnJHtmaWVsZE5hbWV9J10pYCxcbiAgKSxcblxuICBmaWVsZEJldHdlZW46IChmaWVsZE5hbWUsIG1pbiwgbWF4KSA9PiBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZShcbiAgICBbZmllbGROYW1lXSxcbiAgICBgJHtmaWVsZE5hbWV9IG11c3QgYmUgYmV0d2VlbiAke21pbi50b1N0cmluZygpfSBhbmQgJHttYXgudG9TdHJpbmcoKX1gLFxuICAgIGByZWNvcmRbJyR7ZmllbGROYW1lfSddID49ICR7Z2V0U3RhdGljVmFsdWUobWluKX0gJiYgIHJlY29yZFsnJHtmaWVsZE5hbWV9J10gPD0gJHtnZXRTdGF0aWNWYWx1ZShtYXgpfSBgLFxuICApLFxuXG4gIGZpZWxkR3JlYXRlclRoYW46IChmaWVsZE5hbWUsIG1pbiwgbWF4KSA9PiBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZShcbiAgICBbZmllbGROYW1lXSxcbiAgICBgJHtmaWVsZE5hbWV9IG11c3QgYmUgZ3JlYXRlciB0aGFuICR7bWluLnRvU3RyaW5nKCl9IGFuZCAke21heC50b1N0cmluZygpfWAsXG4gICAgYHJlY29yZFsnJHtmaWVsZE5hbWV9J10gPj0gJHtnZXRTdGF0aWNWYWx1ZShtaW4pfSAgYCxcbiAgKSxcbn0pO1xuXG5leHBvcnQgY29uc3QgYWRkUmVjb3JkVmFsaWRhdGlvblJ1bGUgPSByZWNvcmROb2RlID0+IHJ1bGUgPT4gcmVjb3JkTm9kZS52YWxpZGF0aW9uUnVsZXMucHVzaChydWxlKTtcbiIsIlxuZXhwb3J0IGNvbnN0IGNyZWF0ZVRyaWdnZXIgPSAoKSA9PiAoe1xuICBhY3Rpb25OYW1lOiAnJyxcbiAgZXZlbnROYW1lOiAnJyxcbiAgLy8gZnVuY3Rpb24sIGhhcyBhY2Nlc3MgdG8gZXZlbnQgY29udGV4dCxcbiAgLy8gcmV0dXJucyBvYmplY3QgdGhhdCBpcyB1c2VkIGFzIHBhcmFtZXRlciB0byBhY3Rpb25cbiAgLy8gb25seSB1c2VkIGlmIHRyaWdnZXJlZCBieSBldmVudFxuICBvcHRpb25zQ3JlYXRvcjogJycsXG4gIC8vIGFjdGlvbiBydW5zIGlmIHRydWUsXG4gIC8vIGhhcyBhY2Nlc3MgdG8gZXZlbnQgY29udGV4dFxuICBjb25kaXRpb246ICcnLFxufSk7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVBY3Rpb24gPSAoKSA9PiAoe1xuICBuYW1lOiAnJyxcbiAgYmVoYXZpb3VyU291cmNlOiAnJyxcbiAgLy8gbmFtZSBvZiBmdW5jdGlvbiBpbiBhY3Rpb25Tb3VyY2VcbiAgYmVoYXZpb3VyTmFtZTogJycsXG4gIC8vIHBhcmFtZXRlciBwYXNzZWQgaW50byBiZWhhdmlvdXIuXG4gIC8vIGFueSBvdGhlciBwYXJtcyBwYXNzZWQgYXQgcnVudGltZSBlLmcuXG4gIC8vIGJ5IHRyaWdnZXIsIG9yIG1hbnVhbGx5LCB3aWxsIGJlIG1lcmdlZCBpbnRvIHRoaXNcbiAgaW5pdGlhbE9wdGlvbnM6IHt9LFxufSk7XG4iLCJpbXBvcnQgeyBmbGF0dGVuLCBtYXAsIGlzRW1wdHkgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgY29tcGlsZUNvZGUgfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XG5pbXBvcnQge1xuICBpc05vbkVtcHR5U3RyaW5nLCBcbiAgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uLCAkLCBcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGFwcGx5UnVsZVNldCwgbWFrZXJ1bGUgfSBmcm9tICcuLi9jb21tb24vdmFsaWRhdGlvbkNvbW1vbic7XG5cbmNvbnN0IGFnZ3JlZ2F0ZVJ1bGVzID0gW1xuICBtYWtlcnVsZSgnbmFtZScsICdjaG9vc2UgYSBuYW1lIGZvciB0aGUgYWdncmVnYXRlJyxcbiAgICBhID0+IGlzTm9uRW1wdHlTdHJpbmcoYS5uYW1lKSksXG4gIG1ha2VydWxlKCdhZ2dyZWdhdGVkVmFsdWUnLCAnYWdncmVnYXRlZFZhbHVlIGRvZXMgbm90IGNvbXBpbGUnLFxuICAgIGEgPT4gaXNFbXB0eShhLmFnZ3JlZ2F0ZWRWYWx1ZSlcbiAgICAgICAgICAgIHx8IGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbihcbiAgICAgICAgICAgICAgKCkgPT4gY29tcGlsZUNvZGUoYS5hZ2dyZWdhdGVkVmFsdWUpLFxuICAgICAgICAgICAgKSksXG5dO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBZ2dyZWdhdGUgPSBhZ2dyZWdhdGUgPT4gYXBwbHlSdWxlU2V0KGFnZ3JlZ2F0ZVJ1bGVzKShhZ2dyZWdhdGUpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBbGxBZ2dyZWdhdGVzID0gYWxsID0+ICQoYWxsLCBbXG4gIG1hcCh2YWxpZGF0ZUFnZ3JlZ2F0ZSksXG4gIGZsYXR0ZW4sXG5dKTtcbiIsImltcG9ydCB7XG4gIGZpbHRlciwgdW5pb24sIGNvbnN0YW50LFxuICBtYXAsIGZsYXR0ZW4sIGV2ZXJ5LCB1bmlxQnksXG4gIHNvbWUsIGluY2x1ZGVzLCBpc0VtcHR5LCBoYXNcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCB7XG4gICQsIGlzU29tZXRoaW5nLCBzd2l0Y2hDYXNlLFxuICBhbnlUcnVlLCBpc05vbkVtcHR5QXJyYXksIGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbixcbiAgaXNOb25FbXB0eVN0cmluZywgZGVmYXVsdENhc2UsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBpc1JlY29yZCwgaXNSb290LCBpc2FnZ3JlZ2F0ZUdyb3VwLFxuICBpc0luZGV4LCBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG59IGZyb20gJy4vaGllcmFyY2h5JztcbmltcG9ydCB7IGV2ZW50c0xpc3QgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcbmltcG9ydCB7IHZhbGlkYXRlQWxsRmllbGRzIH0gZnJvbSAnLi9maWVsZHMnO1xuaW1wb3J0IHtcbiAgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSwgc3RyaW5nTm90RW1wdHksXG4gIHZhbGlkYXRpb25FcnJvcixcbn0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHsgaW5kZXhSdWxlU2V0IH0gZnJvbSAnLi9pbmRleGVzJztcbmltcG9ydCB7IHZhbGlkYXRlQWxsQWdncmVnYXRlcyB9IGZyb20gJy4vdmFsaWRhdGVBZ2dyZWdhdGUnO1xuXG5leHBvcnQgY29uc3QgcnVsZVNldCA9ICguLi5zZXRzKSA9PiBjb25zdGFudChmbGF0dGVuKFsuLi5zZXRzXSkpO1xuXG5jb25zdCBjb21tb25SdWxlcyA9IFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnbm9kZSBuYW1lIGlzIG5vdCBzZXQnLFxuICAgIG5vZGUgPT4gc3RyaW5nTm90RW1wdHkobm9kZS5uYW1lKSksXG4gIG1ha2VydWxlKCd0eXBlJywgJ25vZGUgdHlwZSBub3QgcmVjb2duaXNlZCcsXG4gICAgYW55VHJ1ZShpc1JlY29yZCwgaXNSb290LCBpc0luZGV4LCBpc2FnZ3JlZ2F0ZUdyb3VwKSksXG5dO1xuXG5jb25zdCByZWNvcmRSdWxlcyA9IFtcbiAgbWFrZXJ1bGUoJ2ZpZWxkcycsICdubyBmaWVsZHMgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSByZWNvcmQnLFxuICAgIG5vZGUgPT4gaXNOb25FbXB0eUFycmF5KG5vZGUuZmllbGRzKSksXG4gIG1ha2VydWxlKCd2YWxpZGF0aW9uUnVsZXMnLCBcInZhbGlkYXRpb24gcnVsZSBpcyBtaXNzaW5nIGEgJ21lc3NhZ2VXaGVuVmFsaWQnIG1lbWJlclwiLFxuICAgIG5vZGUgPT4gZXZlcnkociA9PiBoYXMoJ21lc3NhZ2VXaGVuSW52YWxpZCcpKHIpKShub2RlLnZhbGlkYXRpb25SdWxlcykpLFxuICBtYWtlcnVsZSgndmFsaWRhdGlvblJ1bGVzJywgXCJ2YWxpZGF0aW9uIHJ1bGUgaXMgbWlzc2luZyBhICdleHByZXNzaW9uV2hlblZhbGlkJyBtZW1iZXJcIixcbiAgICBub2RlID0+IGV2ZXJ5KHIgPT4gaGFzKCdleHByZXNzaW9uV2hlblZhbGlkJykocikpKG5vZGUudmFsaWRhdGlvblJ1bGVzKSksXG5dO1xuXG5cbmNvbnN0IGFnZ3JlZ2F0ZUdyb3VwUnVsZXMgPSBbXG4gIG1ha2VydWxlKCdjb25kaXRpb24nLCAnY29uZGl0aW9uIGRvZXMgbm90IGNvbXBpbGUnLFxuICAgIGEgPT4gaXNFbXB0eShhLmNvbmRpdGlvbilcbiAgICAgICAgICAgICB8fCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24oXG4gICAgICAgICAgICAgICAoKSA9PiBjb21waWxlRXhwcmVzc2lvbihhLmNvbmRpdGlvbiksXG4gICAgICAgICAgICAgKSksXG5dO1xuXG5jb25zdCBnZXRSdWxlU2V0ID0gbm9kZSA9PiBzd2l0Y2hDYXNlKFxuXG4gIFtpc1JlY29yZCwgcnVsZVNldChcbiAgICBjb21tb25SdWxlcyxcbiAgICByZWNvcmRSdWxlcyxcbiAgKV0sXG5cbiAgW2lzSW5kZXgsIHJ1bGVTZXQoXG4gICAgY29tbW9uUnVsZXMsXG4gICAgaW5kZXhSdWxlU2V0LFxuICApXSxcblxuICBbaXNhZ2dyZWdhdGVHcm91cCwgcnVsZVNldChcbiAgICBjb21tb25SdWxlcyxcbiAgICBhZ2dyZWdhdGVHcm91cFJ1bGVzLFxuICApXSxcblxuICBbZGVmYXVsdENhc2UsIHJ1bGVTZXQoY29tbW9uUnVsZXMsIFtdKV0sXG4pKG5vZGUpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVOb2RlID0gbm9kZSA9PiBhcHBseVJ1bGVTZXQoZ2V0UnVsZVNldChub2RlKSkobm9kZSk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFsbCA9IChhcHBIaWVyYXJjaHkpID0+IHtcbiAgY29uc3QgZmxhdHRlbmVkID0gZ2V0RmxhdHRlbmVkSGllcmFyY2h5KFxuICAgIGFwcEhpZXJhcmNoeSxcbiAgKTtcblxuICBjb25zdCBkdXBsaWNhdGVOYW1lUnVsZSA9IG1ha2VydWxlKFxuICAgICduYW1lJywgJ25vZGUgbmFtZXMgbXVzdCBiZSB1bmlxdWUgdW5kZXIgc2hhcmVkIHBhcmVudCcsXG4gICAgbiA9PiBmaWx0ZXIoZiA9PiBmLnBhcmVudCgpID09PSBuLnBhcmVudCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICYmIGYubmFtZSA9PT0gbi5uYW1lKShmbGF0dGVuZWQpLmxlbmd0aCA9PT0gMSxcbiAgKTtcblxuICBjb25zdCBkdXBsaWNhdGVOb2RlS2V5RXJyb3JzID0gJChmbGF0dGVuZWQsIFtcbiAgICBtYXAobiA9PiBhcHBseVJ1bGVTZXQoW2R1cGxpY2F0ZU5hbWVSdWxlXSkobikpLFxuICAgIGZpbHRlcihpc1NvbWV0aGluZyksXG4gICAgZmxhdHRlbixcbiAgXSk7XG5cbiAgY29uc3QgZmllbGRFcnJvcnMgPSAkKGZsYXR0ZW5lZCwgW1xuICAgIGZpbHRlcihpc1JlY29yZCksXG4gICAgbWFwKHZhbGlkYXRlQWxsRmllbGRzKSxcbiAgICBmbGF0dGVuLFxuICBdKTtcblxuICBjb25zdCBhZ2dyZWdhdGVFcnJvcnMgPSAkKGZsYXR0ZW5lZCwgW1xuICAgIGZpbHRlcihpc2FnZ3JlZ2F0ZUdyb3VwKSxcbiAgICBtYXAocyA9PiB2YWxpZGF0ZUFsbEFnZ3JlZ2F0ZXMoXG4gICAgICBzLmFnZ3JlZ2F0ZXMsXG4gICAgKSksXG4gICAgZmxhdHRlbixcbiAgXSk7XG5cbiAgcmV0dXJuICQoZmxhdHRlbmVkLCBbXG4gICAgbWFwKHZhbGlkYXRlTm9kZSksXG4gICAgZmxhdHRlbixcbiAgICB1bmlvbihkdXBsaWNhdGVOb2RlS2V5RXJyb3JzKSxcbiAgICB1bmlvbihmaWVsZEVycm9ycyksXG4gICAgdW5pb24oYWdncmVnYXRlRXJyb3JzKSxcbiAgXSk7XG59O1xuXG5jb25zdCBhY3Rpb25SdWxlcyA9IFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnYWN0aW9uIG11c3QgaGF2ZSBhIG5hbWUnLFxuICAgIGEgPT4gaXNOb25FbXB0eVN0cmluZyhhLm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2JlaGF2aW91ck5hbWUnLCAnbXVzdCBzdXBwbHkgYSBiZWhhdmlvdXIgbmFtZSB0byB0aGUgYWN0aW9uJyxcbiAgICBhID0+IGlzTm9uRW1wdHlTdHJpbmcoYS5iZWhhdmlvdXJOYW1lKSksXG4gIG1ha2VydWxlKCdiZWhhdmlvdXJTb3VyY2UnLCAnbXVzdCBzdXBwbHkgYSBiZWhhdmlvdXIgc291cmNlIGZvciB0aGUgYWN0aW9uJyxcbiAgICBhID0+IGlzTm9uRW1wdHlTdHJpbmcoYS5iZWhhdmlvdXJTb3VyY2UpKSxcbl07XG5cbmNvbnN0IGR1cGxpY2F0ZUFjdGlvblJ1bGUgPSBtYWtlcnVsZSgnJywgJ2FjdGlvbiBuYW1lIG11c3QgYmUgdW5pcXVlJywgKCkgPT4ge30pO1xuXG5jb25zdCB2YWxpZGF0ZUFjdGlvbiA9IGFjdGlvbiA9PiBhcHBseVJ1bGVTZXQoYWN0aW9uUnVsZXMpKGFjdGlvbik7XG5cblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWN0aW9ucyA9IChhbGxBY3Rpb25zKSA9PiB7XG4gIGNvbnN0IGR1cGxpY2F0ZUFjdGlvbnMgPSAkKGFsbEFjdGlvbnMsIFtcbiAgICBmaWx0ZXIoYSA9PiBmaWx0ZXIoYTIgPT4gYTIubmFtZSA9PT0gYS5uYW1lKShhbGxBY3Rpb25zKS5sZW5ndGggPiAxKSxcbiAgICBtYXAoYSA9PiB2YWxpZGF0aW9uRXJyb3IoZHVwbGljYXRlQWN0aW9uUnVsZSwgYSkpLFxuICBdKTtcblxuICBjb25zdCBlcnJvcnMgPSAkKGFsbEFjdGlvbnMsIFtcbiAgICBtYXAodmFsaWRhdGVBY3Rpb24pLFxuICAgIGZsYXR0ZW4sXG4gICAgdW5pb24oZHVwbGljYXRlQWN0aW9ucyksXG4gICAgdW5pcUJ5KCduYW1lJyksXG4gIF0pO1xuXG4gIHJldHVybiBlcnJvcnM7XG59O1xuXG5jb25zdCB0cmlnZ2VyUnVsZXMgPSBhY3Rpb25zID0+IChbXG4gIG1ha2VydWxlKCdhY3Rpb25OYW1lJywgJ211c3Qgc3BlY2lmeSBhbiBhY3Rpb24nLFxuICAgIHQgPT4gaXNOb25FbXB0eVN0cmluZyh0LmFjdGlvbk5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2V2ZW50TmFtZScsICdtdXN0IHNwZWNpZnkgYW5kIGV2ZW50JyxcbiAgICB0ID0+IGlzTm9uRW1wdHlTdHJpbmcodC5ldmVudE5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2FjdGlvbk5hbWUnLCAnc3BlY2lmaWVkIGFjdGlvbiBub3Qgc3VwcGxpZWQnLFxuICAgIHQgPT4gIXQuYWN0aW9uTmFtZVxuICAgICAgICAgICAgIHx8IHNvbWUoYSA9PiBhLm5hbWUgPT09IHQuYWN0aW9uTmFtZSkoYWN0aW9ucykpLFxuICBtYWtlcnVsZSgnZXZlbnROYW1lJywgJ2ludmFsaWQgRXZlbnQgTmFtZScsXG4gICAgdCA9PiAhdC5ldmVudE5hbWVcbiAgICAgICAgICAgICB8fCBpbmNsdWRlcyh0LmV2ZW50TmFtZSkoZXZlbnRzTGlzdCkpLFxuICBtYWtlcnVsZSgnb3B0aW9uc0NyZWF0b3InLCAnT3B0aW9ucyBDcmVhdG9yIGRvZXMgbm90IGNvbXBpbGUgLSBjaGVjayB5b3VyIGV4cHJlc3Npb24nLFxuICAgICh0KSA9PiB7XG4gICAgICBpZiAoIXQub3B0aW9uc0NyZWF0b3IpIHJldHVybiB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29tcGlsZUNvZGUodC5vcHRpb25zQ3JlYXRvcik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoXykgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9KSxcbiAgbWFrZXJ1bGUoJ2NvbmRpdGlvbicsICdUcmlnZ2VyIGNvbmRpdGlvbiBkb2VzIG5vdCBjb21waWxlIC0gY2hlY2sgeW91ciBleHByZXNzaW9uJyxcbiAgICAodCkgPT4ge1xuICAgICAgaWYgKCF0LmNvbmRpdGlvbikgcmV0dXJuIHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICBjb21waWxlRXhwcmVzc2lvbih0LmNvbmRpdGlvbik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoXykgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9KSxcbl0pO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVUcmlnZ2VyID0gKHRyaWdnZXIsIGFsbEFjdGlvbnMpID0+IHtcbiAgY29uc3QgZXJyb3JzID0gYXBwbHlSdWxlU2V0KHRyaWdnZXJSdWxlcyhhbGxBY3Rpb25zKSkodHJpZ2dlcik7XG5cbiAgcmV0dXJuIGVycm9ycztcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVRyaWdnZXJzID0gKHRyaWdnZXJzLCBhbGxBY3Rpb25zKSA9PiAkKHRyaWdnZXJzLCBbXG4gIG1hcCh0ID0+IHZhbGlkYXRlVHJpZ2dlcih0LCBhbGxBY3Rpb25zKSksXG4gIGZsYXR0ZW4sXG5dKTtcbiIsImltcG9ydCB7IGFwcERlZmluaXRpb25GaWxlIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGNvbnN0cnVjdEhpZXJhcmNoeSB9IGZyb20gJy4vY3JlYXRlTm9kZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uID0gZGF0YXN0b3JlID0+IGFzeW5jICgpID0+IHtcbiAgY29uc3QgZXhpc3RzID0gYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhhcHBEZWZpbml0aW9uRmlsZSk7XG5cbiAgaWYgKCFleGlzdHMpIHRocm93IG5ldyBFcnJvcignQXBwbGljYXRpb24gZGVmaW5pdGlvbiBkb2VzIG5vdCBleGlzdCcpO1xuXG4gIGNvbnN0IGFwcERlZmluaXRpb24gPSBhd2FpdCBkYXRhc3RvcmUubG9hZEpzb24oYXBwRGVmaW5pdGlvbkZpbGUpO1xuICBhcHBEZWZpbml0aW9uLmhpZXJhcmNoeSA9IGNvbnN0cnVjdEhpZXJhcmNoeShcbiAgICBhcHBEZWZpbml0aW9uLmhpZXJhcmNoeSxcbiAgKTtcbiAgcmV0dXJuIGFwcERlZmluaXRpb247XG59O1xuIiwiaW1wb3J0IHsgam9pbiB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBhcHBEZWZpbml0aW9uRmlsZSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyB2YWxpZGF0ZUFsbCB9IGZyb20gJy4vdmFsaWRhdGUnO1xuaW1wb3J0IHsgYXBpV3JhcHBlciB9IGZyb20gJy4uL2NvbW1vbi9hcGlXcmFwcGVyJztcbmltcG9ydCB7IGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xuXG5leHBvcnQgY29uc3Qgc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5ID0gYXBwID0+IGFzeW5jIGhpZXJhcmNoeSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy50ZW1wbGF0ZUFwaS5zYXZlQXBwbGljYXRpb25IaWVyYXJjaHksXG4gIHBlcm1pc3Npb24ud3JpdGVUZW1wbGF0ZXMuaXNBdXRob3JpemVkLFxuICB7IGhpZXJhcmNoeSB9LFxuICBfc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlLCBoaWVyYXJjaHksXG4pO1xuXG5cbmV4cG9ydCBjb25zdCBfc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5ID0gYXN5bmMgKGRhdGFzdG9yZSwgaGllcmFyY2h5KSA9PiB7XG4gIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSBhd2FpdCB2YWxpZGF0ZUFsbChoaWVyYXJjaHkpO1xuICBpZiAodmFsaWRhdGlvbkVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBIaWVyYXJjaHkgaXMgaW52YWxpZDogJHtqb2luKFxuICAgICAgdmFsaWRhdGlvbkVycm9ycy5tYXAoZSA9PiBgJHtlLml0ZW0ubm9kZUtleSA/IGUuaXRlbS5ub2RlS2V5KCkgOiAnJ30gOiAke2UuZXJyb3J9YCksXG4gICAgICAnLCcsXG4gICAgKX1gKTtcbiAgfVxuXG4gIGlmIChhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGFwcERlZmluaXRpb25GaWxlKSkge1xuICAgIGNvbnN0IGFwcERlZmluaXRpb24gPSBhd2FpdCBkYXRhc3RvcmUubG9hZEpzb24oYXBwRGVmaW5pdGlvbkZpbGUpO1xuICAgIGFwcERlZmluaXRpb24uaGllcmFyY2h5ID0gaGllcmFyY2h5O1xuICAgIGF3YWl0IGRhdGFzdG9yZS51cGRhdGVKc29uKGFwcERlZmluaXRpb25GaWxlLCBhcHBEZWZpbml0aW9uKTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKCcvLmNvbmZpZycpO1xuICAgIGNvbnN0IGFwcERlZmluaXRpb24gPSB7IGFjdGlvbnM6IFtdLCB0cmlnZ2VyczogW10sIGhpZXJhcmNoeSB9O1xuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKGFwcERlZmluaXRpb25GaWxlLCBhcHBEZWZpbml0aW9uKTtcbiAgfVxufTtcbiIsImltcG9ydCB7IGpvaW4gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGFwcERlZmluaXRpb25GaWxlIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHZhbGlkYXRlVHJpZ2dlcnMsIHZhbGlkYXRlQWN0aW9ucyB9IGZyb20gJy4vdmFsaWRhdGUnO1xuaW1wb3J0IHsgYXBpV3JhcHBlciB9IGZyb20gJy4uL2NvbW1vbi9hcGlXcmFwcGVyJztcbmltcG9ydCB7IGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBzYXZlQWN0aW9uc0FuZFRyaWdnZXJzID0gYXBwID0+IGFzeW5jIChhY3Rpb25zLCB0cmlnZ2VycykgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMudGVtcGxhdGVBcGkuc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycyxcbiAgcGVybWlzc2lvbi53cml0ZVRlbXBsYXRlcy5pc0F1dGhvcml6ZWQsXG4gIHsgYWN0aW9ucywgdHJpZ2dlcnMgfSxcbiAgX3NhdmVBY3Rpb25zQW5kVHJpZ2dlcnMsIGFwcC5kYXRhc3RvcmUsIGFjdGlvbnMsIHRyaWdnZXJzLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9zYXZlQWN0aW9uc0FuZFRyaWdnZXJzID0gYXN5bmMgKGRhdGFzdG9yZSwgYWN0aW9ucywgdHJpZ2dlcnMpID0+IHtcbiAgaWYgKGF3YWl0IGRhdGFzdG9yZS5leGlzdHMoYXBwRGVmaW5pdGlvbkZpbGUpKSB7XG4gICAgY29uc3QgYXBwRGVmaW5pdGlvbiA9IGF3YWl0IGRhdGFzdG9yZS5sb2FkSnNvbihhcHBEZWZpbml0aW9uRmlsZSk7XG4gICAgYXBwRGVmaW5pdGlvbi5hY3Rpb25zID0gYWN0aW9ucztcbiAgICBhcHBEZWZpbml0aW9uLnRyaWdnZXJzID0gdHJpZ2dlcnM7XG5cbiAgICBjb25zdCBhY3Rpb25WYWxpZEVycnMgPSBtYXAoZSA9PiBlLmVycm9yKSh2YWxpZGF0ZUFjdGlvbnMoYWN0aW9ucykpO1xuXG4gICAgaWYgKGFjdGlvblZhbGlkRXJycy5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBBY3Rpb25zIGFyZSBpbnZhbGlkOiAke2pvaW4oYWN0aW9uVmFsaWRFcnJzLCAnLCAnKX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCB0cmlnZ2VyVmFsaWRFcnJzID0gbWFwKGUgPT4gZS5lcnJvcikodmFsaWRhdGVUcmlnZ2Vycyh0cmlnZ2VycywgYWN0aW9ucykpO1xuXG4gICAgaWYgKHRyaWdnZXJWYWxpZEVycnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgVHJpZ2dlcnMgYXJlIGludmFsaWQ6ICR7am9pbih0cmlnZ2VyVmFsaWRFcnJzLCAnLCAnKX1gKTtcbiAgICB9XG5cbiAgICBhd2FpdCBkYXRhc3RvcmUudXBkYXRlSnNvbihhcHBEZWZpbml0aW9uRmlsZSwgYXBwRGVmaW5pdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignQ2Fubm90IHNhdmUgYWN0aW9uczogQXBwbGljYXRpb24gZGVmaW5pdGlvbiBkb2VzIG5vdCBleGlzdCcpO1xuICB9XG59O1xuIiwiXG5leHBvcnQgY29uc3QgZ2V0QmVoYXZpb3VyU291cmNlcyA9IGFzeW5jIChkYXRhc3RvcmUpID0+IHtcbiAgICBhd2FpdCBkYXRhc3RvcmUubG9hZEZpbGUoJy8uY29uZmlnL2JlaGF2aW91clNvdXJjZXMuanMnKTtcbn07XG4iLCJpbXBvcnQge1xuICBnZXROZXdSb290TGV2ZWwsXG4gIGdldE5ld1JlY29yZFRlbXBsYXRlLCBnZXROZXdJbmRleFRlbXBsYXRlLFxuICBjcmVhdGVOb2RlRXJyb3JzLCBjb25zdHJ1Y3RIaWVyYXJjaHksXG4gIGdldE5ld0FnZ3JlZ2F0ZUdyb3VwVGVtcGxhdGUsIGdldE5ld1NpbmdsZVJlY29yZFRlbXBsYXRlLFxuICBnZXROZXdBZ2dyZWdhdGVUZW1wbGF0ZSwgY29uc3RydWN0Tm9kZSxcbn1cbiAgZnJvbSAnLi9jcmVhdGVOb2Rlcyc7XG5pbXBvcnQge1xuICBnZXROZXdGaWVsZCwgdmFsaWRhdGVGaWVsZCxcbiAgYWRkRmllbGQsIGZpZWxkRXJyb3JzLFxufSBmcm9tICcuL2ZpZWxkcyc7XG5pbXBvcnQge1xuICBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZSwgY29tbW9uUmVjb3JkVmFsaWRhdGlvblJ1bGVzLFxuICBhZGRSZWNvcmRWYWxpZGF0aW9uUnVsZSxcbn0gZnJvbSAnLi9yZWNvcmRWYWxpZGF0aW9uUnVsZXMnO1xuaW1wb3J0IHsgY3JlYXRlQWN0aW9uLCBjcmVhdGVUcmlnZ2VyIH0gZnJvbSAnLi9jcmVhdGVBY3Rpb25zJztcbmltcG9ydCB7XG4gIHZhbGlkYXRlVHJpZ2dlcnMsIHZhbGlkYXRlVHJpZ2dlciwgdmFsaWRhdGVOb2RlLFxuICB2YWxpZGF0ZUFjdGlvbnMsIHZhbGlkYXRlQWxsLFxufSBmcm9tICcuL3ZhbGlkYXRlJztcbmltcG9ydCB7IGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbiB9IGZyb20gJy4vZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uJztcbmltcG9ydCB7IHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSB9IGZyb20gJy4vc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5JztcbmltcG9ydCB7IHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnMgfSBmcm9tICcuL3NhdmVBY3Rpb25zQW5kVHJpZ2dlcnMnO1xuaW1wb3J0IHsgYWxsIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZ2V0QmVoYXZpb3VyU291cmNlcyB9IGZyb20gXCIuL2dldEJlaGF2aW91clNvdXJjZXNcIjtcblxuY29uc3QgYXBpID0gYXBwID0+ICh7XG5cbiAgZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uOiBnZXRBcHBsaWNhdGlvbkRlZmluaXRpb24oYXBwLmRhdGFzdG9yZSksXG4gIHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeTogc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5KGFwcCksXG4gIHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnM6IHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnMoYXBwKSxcbiAgZ2V0QmVoYXZpb3VyU291cmNlczogKCkgPT4gZ2V0QmVoYXZpb3VyU291cmNlcyhhcHAuZGF0YXN0b3JlKSxcbiAgZ2V0TmV3Um9vdExldmVsLFxuICBjb25zdHJ1Y3ROb2RlLFxuICBnZXROZXdJbmRleFRlbXBsYXRlLFxuICBnZXROZXdSZWNvcmRUZW1wbGF0ZSxcbiAgZ2V0TmV3RmllbGQsXG4gIHZhbGlkYXRlRmllbGQsXG4gIGFkZEZpZWxkLFxuICBmaWVsZEVycm9ycyxcbiAgZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUsXG4gIGNvbW1vblJlY29yZFZhbGlkYXRpb25SdWxlcyxcbiAgYWRkUmVjb3JkVmFsaWRhdGlvblJ1bGUsXG4gIGNyZWF0ZUFjdGlvbixcbiAgY3JlYXRlVHJpZ2dlcixcbiAgdmFsaWRhdGVBY3Rpb25zLFxuICB2YWxpZGF0ZVRyaWdnZXIsXG4gIGdldE5ld0FnZ3JlZ2F0ZUdyb3VwVGVtcGxhdGUsXG4gIGdldE5ld0FnZ3JlZ2F0ZVRlbXBsYXRlLFxuICBjb25zdHJ1Y3RIaWVyYXJjaHksXG4gIGdldE5ld1NpbmdsZVJlY29yZFRlbXBsYXRlLFxuICBhbGxUeXBlczogYWxsLFxuICB2YWxpZGF0ZU5vZGUsXG4gIHZhbGlkYXRlQWxsLFxuICB2YWxpZGF0ZVRyaWdnZXJzLFxufSk7XG5cblxuZXhwb3J0IGNvbnN0IGdldFRlbXBsYXRlQXBpID0gYXBwID0+IGFwaShhcHApO1xuXG5leHBvcnQgY29uc3QgZXJyb3JzID0gY3JlYXRlTm9kZUVycm9ycztcblxuZXhwb3J0IGRlZmF1bHQgZ2V0VGVtcGxhdGVBcGk7XG4iLCJpbXBvcnQgeyBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgVVNFUlNfTElTVF9GSUxFLFxuICBzdHJpcFVzZXJPZlNlbnNpdGl2ZVN0dWZmLFxufSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgJCwgYXBpV3JhcHBlciwgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGdldFVzZXJzID0gYXBwID0+IGFzeW5jICgpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuZ2V0VXNlcnMsXG4gIHBlcm1pc3Npb24ubGlzdFVzZXJzLmlzQXV0aG9yaXplZCxcbiAge30sXG4gIF9nZXRVc2VycywgYXBwLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9nZXRVc2VycyA9IGFzeW5jIGFwcCA9PiAkKGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oVVNFUlNfTElTVF9GSUxFKSwgW1xuICBtYXAoc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZiksXG5dKTtcbiIsImltcG9ydCB7IEFDQ0VTU19MRVZFTFNfRklMRSB9IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyBhcGlXcmFwcGVyLCBldmVudHMgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgbG9hZEFjY2Vzc0xldmVscyA9IGFwcCA9PiBhc3luYyAoKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmxvYWRBY2Nlc3NMZXZlbHMsXG4gIHBlcm1pc3Npb24ubGlzdEFjY2Vzc0xldmVscy5pc0F1dGhvcml6ZWQsXG4gIHt9LFxuICBfbG9hZEFjY2Vzc0xldmVscywgYXBwLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9sb2FkQWNjZXNzTGV2ZWxzID0gYXN5bmMgYXBwID0+IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oQUNDRVNTX0xFVkVMU19GSUxFKTtcbiIsImltcG9ydCB7XG4gIGZpbmQsIGZpbHRlciwgc29tZSxcbiAgbWFwLCBmbGF0dGVuLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcbmltcG9ydCB7IF9nZXRVc2VycyB9IGZyb20gJy4vZ2V0VXNlcnMnO1xuaW1wb3J0IHtcbiAgZ2V0VXNlckJ5TmFtZSwgdXNlckF1dGhGaWxlLFxuICBwYXJzZVRlbXBvcmFyeUNvZGUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyBfbG9hZEFjY2Vzc0xldmVscyB9IGZyb20gJy4vbG9hZEFjY2Vzc0xldmVscyc7XG5pbXBvcnQge1xuICBpc05vdGhpbmdPckVtcHR5LCAkLCBhcGlXcmFwcGVyLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmNvbnN0IGR1bW15SGFzaCA9ICckYXJnb24yaSR2PTE5JG09NDA5Nix0PTMscD0xJFVaUm80MDlVWUJHakhKUzNDVjZVeHckclU4NHFVcVBlT1JGektZbVlZMGNlQkxEYVBPK0pXU0g0UGZOaUtYZklLayc7XG5cbmV4cG9ydCBjb25zdCBhdXRoZW50aWNhdGUgPSBhcHAgPT4gYXN5bmMgKHVzZXJuYW1lLCBwYXNzd29yZCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5hdXRoZW50aWNhdGUsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0sXG4gIF9hdXRoZW50aWNhdGUsIGFwcCwgdXNlcm5hbWUsIHBhc3N3b3JkLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9hdXRoZW50aWNhdGUgPSBhc3luYyAoYXBwLCB1c2VybmFtZSwgcGFzc3dvcmQpID0+IHtcbiAgaWYgKGlzTm90aGluZ09yRW1wdHkodXNlcm5hbWUpIHx8IGlzTm90aGluZ09yRW1wdHkocGFzc3dvcmQpKSB7IHJldHVybiBudWxsOyB9XG5cbiAgY29uc3QgYWxsVXNlcnMgPSBhd2FpdCBfZ2V0VXNlcnMoYXBwKTtcbiAgbGV0IHVzZXIgPSBnZXRVc2VyQnlOYW1lKFxuICAgIGFsbFVzZXJzLFxuICAgIHVzZXJuYW1lLFxuICApO1xuXG4gIGNvbnN0IG5vdEFVc2VyID0gJ25vdC1hLXVzZXInO1xuICAvLyBjb250aW51ZSB3aXRoIG5vbi11c2VyIC0gc28gdGltZSB0byB2ZXJpZnkgcmVtYWlucyBjb25zaXN0ZW50XG4gIC8vIHdpdGggdmVyaWZpY2F0aW9uIG9mIGEgdmFsaWQgdXNlclxuICBpZiAoIXVzZXIgfHwgIXVzZXIuZW5hYmxlZCkgeyB1c2VyID0gbm90QVVzZXI7IH1cblxuICBsZXQgdXNlckF1dGg7XG4gIHRyeSB7XG4gICAgdXNlckF1dGggPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgICAgdXNlckF1dGhGaWxlKHVzZXJuYW1lKSxcbiAgICApO1xuICB9IGNhdGNoIChfKSB7XG4gICAgdXNlckF1dGggPSB7IGFjY2Vzc0xldmVsczogW10sIHBhc3N3b3JkSGFzaDogZHVtbXlIYXNoIH07XG4gIH1cblxuICBjb25zdCBwZXJtaXNzaW9ucyA9IGF3YWl0IGJ1aWxkVXNlclBlcm1pc3Npb25zKGFwcCwgdXNlci5hY2Nlc3NMZXZlbHMpO1xuXG4gIGNvbnN0IHZlcmlmaWVkID0gYXdhaXQgYXBwLmNyeXB0by52ZXJpZnkoXG4gICAgdXNlckF1dGgucGFzc3dvcmRIYXNoLFxuICAgIHBhc3N3b3JkLFxuICApO1xuXG4gIGlmICh1c2VyID09PSBub3RBVXNlcikgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHJldHVybiB2ZXJpZmllZFxuICAgID8ge1xuICAgICAgLi4udXNlciwgcGVybWlzc2lvbnMsIHRlbXA6IGZhbHNlLCBpc1VzZXI6IHRydWUsXG4gICAgfVxuICAgIDogbnVsbDtcbn07XG5cbmV4cG9ydCBjb25zdCBhdXRoZW50aWNhdGVUZW1wb3JhcnlBY2Nlc3MgPSBhcHAgPT4gYXN5bmMgKHRlbXBBY2Nlc3NDb2RlKSA9PiB7XG4gIGlmIChpc05vdGhpbmdPckVtcHR5KHRlbXBBY2Nlc3NDb2RlKSkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIGNvbnN0IHRlbXAgPSBwYXJzZVRlbXBvcmFyeUNvZGUodGVtcEFjY2Vzc0NvZGUpO1xuICBsZXQgdXNlciA9ICQoYXdhaXQgX2dldFVzZXJzKGFwcCksIFtcbiAgICBmaW5kKHUgPT4gdS50ZW1wb3JhcnlBY2Nlc3NJZCA9PT0gdGVtcC5pZCksXG4gIF0pO1xuXG4gIGNvbnN0IG5vdEFVc2VyID0gJ25vdC1hLXVzZXInO1xuICBpZiAoIXVzZXIgfHwgIXVzZXIuZW5hYmxlZCkgeyB1c2VyID0gbm90QVVzZXI7IH1cblxuICBsZXQgdXNlckF1dGg7XG4gIHRyeSB7XG4gICAgdXNlckF1dGggPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgICAgdXNlckF1dGhGaWxlKHVzZXIubmFtZSksXG4gICAgKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHVzZXJBdXRoID0ge1xuICAgICAgdGVtcG9yYXJ5QWNjZXNzSGFzaDogZHVtbXlIYXNoLFxuICAgICAgdGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2g6IChhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCkgKyAxMDAwMCksXG4gICAgfTtcbiAgfVxuXG4gIGlmICh1c2VyQXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA8IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKSkgeyB1c2VyID0gbm90QVVzZXI7IH1cblxuICBjb25zdCB0ZW1wQ29kZSA9ICF0ZW1wLmNvZGUgPyBnZW5lcmF0ZSgpIDogdGVtcC5jb2RlO1xuICBjb25zdCB2ZXJpZmllZCA9IGF3YWl0IGFwcC5jcnlwdG8udmVyaWZ5KFxuICAgIHVzZXJBdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2gsXG4gICAgdGVtcENvZGUsXG4gICk7XG5cbiAgaWYgKHVzZXIgPT09IG5vdEFVc2VyKSB7IHJldHVybiBudWxsOyB9XG5cbiAgcmV0dXJuIHZlcmlmaWVkXG4gICAgPyB7XG4gICAgICAuLi51c2VyLFxuICAgICAgcGVybWlzc2lvbnM6IFtdLFxuICAgICAgdGVtcDogdHJ1ZSxcbiAgICAgIGlzVXNlcjogdHJ1ZSxcbiAgICB9XG4gICAgOiBudWxsO1xufTtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkVXNlclBlcm1pc3Npb25zID0gYXN5bmMgKGFwcCwgdXNlckFjY2Vzc0xldmVscykgPT4ge1xuICBjb25zdCBhbGxBY2Nlc3NMZXZlbHMgPSBhd2FpdCBfbG9hZEFjY2Vzc0xldmVscyhhcHApO1xuXG4gIHJldHVybiAkKGFsbEFjY2Vzc0xldmVscy5sZXZlbHMsIFtcbiAgICBmaWx0ZXIobCA9PiBzb21lKHVhID0+IGwubmFtZSA9PT0gdWEpKHVzZXJBY2Nlc3NMZXZlbHMpKSxcbiAgICBtYXAobCA9PiBsLnBlcm1pc3Npb25zKSxcbiAgICBmbGF0dGVuLFxuICBdKTtcbn07XG4iLCJpbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHtcbiAgdGVtcENvZGVFeHBpcnlMZW5ndGgsIFVTRVJTX0xPQ0tfRklMRSxcbiAgVVNFUlNfTElTVF9GSUxFLCB1c2VyQXV0aEZpbGUsXG4gIGdldFVzZXJCeU5hbWUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQge1xuICBnZXRMb2NrLCBpc05vbG9jayxcbiAgcmVsZWFzZUxvY2ssXG59IGZyb20gJy4uL2NvbW1vbi9sb2NrJztcbmltcG9ydCB7IGFwaVdyYXBwZXIsIGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVUZW1wb3JhcnlBY2Nlc3MgPSBhcHAgPT4gYXN5bmMgdXNlck5hbWUgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5jcmVhdGVUZW1wb3JhcnlBY2Nlc3MsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgdXNlck5hbWUgfSxcbiAgX2NyZWF0ZVRlbXBvcmFyeUFjY2VzcywgYXBwLCB1c2VyTmFtZSxcbik7XG5cbmV4cG9ydCBjb25zdCBfY3JlYXRlVGVtcG9yYXJ5QWNjZXNzID0gYXN5bmMgKGFwcCwgdXNlck5hbWUpID0+IHtcbiAgY29uc3QgdGVtcENvZGUgPSBhd2FpdCBnZXRUZW1wb3JhcnlDb2RlKGFwcCk7XG5cbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldExvY2soXG4gICAgYXBwLCBVU0VSU19MT0NLX0ZJTEUsIDEwMDAsIDIsXG4gICk7XG5cbiAgaWYgKGlzTm9sb2NrKGxvY2spKSB7IHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGNyZWF0ZSB0ZW1wb3JhcnkgYWNjZXNzLCBjb3VsZCBub3QgZ2V0IGxvY2sgLSB0cnkgYWdhaW4nKTsgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSk7XG5cbiAgICBjb25zdCB1c2VyID0gZ2V0VXNlckJ5TmFtZSh1c2VycywgdXNlck5hbWUpO1xuICAgIHVzZXIudGVtcG9yYXJ5QWNjZXNzSWQgPSB0ZW1wQ29kZS50ZW1wb3JhcnlBY2Nlc3NJZDtcblxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgICAgIFVTRVJTX0xJU1RfRklMRSxcbiAgICAgIHVzZXJzLFxuICAgICk7XG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcbiAgfVxuXG4gIGNvbnN0IHVzZXJBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICB1c2VyQXV0aEZpbGUodXNlck5hbWUpLFxuICApO1xuICB1c2VyQXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoID0gdGVtcENvZGUudGVtcG9yYXJ5QWNjZXNzSGFzaDtcblxuICB1c2VyQXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA9IHRlbXBDb2RlLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoO1xuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgICB1c2VyQXV0aEZpbGUodXNlck5hbWUpLFxuICAgIHVzZXJBdXRoLFxuICApO1xuXG4gIHJldHVybiB0ZW1wQ29kZS50ZW1wQ29kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRUZW1wb3JhcnlDb2RlID0gYXN5bmMgKGFwcCkgPT4ge1xuICBjb25zdCB0ZW1wQ29kZSA9IGdlbmVyYXRlKClcbiAgICAgICAgKyBnZW5lcmF0ZSgpXG4gICAgICAgICsgZ2VuZXJhdGUoKVxuICAgICAgICArIGdlbmVyYXRlKCk7XG5cbiAgY29uc3QgdGVtcElkID0gZ2VuZXJhdGUoKTtcblxuICByZXR1cm4ge1xuICAgIHRlbXBvcmFyeUFjY2Vzc0hhc2g6IGF3YWl0IGFwcC5jcnlwdG8uaGFzaChcbiAgICAgIHRlbXBDb2RlLFxuICAgICksXG4gICAgdGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2g6XG4gICAgICAgICAgICAoYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpKSArIHRlbXBDb2RlRXhwaXJ5TGVuZ3RoLFxuICAgIHRlbXBDb2RlOiBgdG1wOiR7dGVtcElkfToke3RlbXBDb2RlfWAsXG4gICAgdGVtcG9yYXJ5QWNjZXNzSWQ6IHRlbXBJZCxcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBsb29rc0xpa2VUZW1wb3JhcnlDb2RlID0gY29kZSA9PiBjb2RlLnN0YXJ0c1dpdGgoJ3RtcDonKTtcbiIsImltcG9ydCB7XG4gIG1hcCwgdW5pcVdpdGgsXG4gIGZsYXR0ZW4sIGZpbHRlcixcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGFwcGx5UnVsZVNldCwgbWFrZXJ1bGUgfSBmcm9tICcuLi9jb21tb24vdmFsaWRhdGlvbkNvbW1vbic7XG5pbXBvcnQge1xuICAkLCBpbnNlbnNpdGl2ZUVxdWFscywgYXBpV3JhcHBlciwgZXZlbnRzLFxuICBpc05vbkVtcHR5U3RyaW5nLCBhbGwsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmNvbnN0IHVzZXJSdWxlcyA9IGFsbFVzZXJzID0+IFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAndXNlcm5hbWUgbXVzdCBiZSBzZXQnLFxuICAgIHUgPT4gaXNOb25FbXB0eVN0cmluZyh1Lm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2FjY2Vzc0xldmVscycsICd1c2VyIG11c3QgaGF2ZSBhdCBsZWFzdCBvbmUgYWNjZXNzIGxldmVsJyxcbiAgICB1ID0+IHUuYWNjZXNzTGV2ZWxzLmxlbmd0aCA+IDApLFxuICBtYWtlcnVsZSgnbmFtZScsICd1c2VybmFtZSBtdXN0IGJlIHVuaXF1ZScsXG4gICAgdSA9PiBmaWx0ZXIodTIgPT4gaW5zZW5zaXRpdmVFcXVhbHModTIubmFtZSwgdS5uYW1lKSkoYWxsVXNlcnMpLmxlbmd0aCA9PT0gMSksXG4gIG1ha2VydWxlKCdhY2Nlc3NMZXZlbHMnLCAnYWNjZXNzIGxldmVscyBtdXN0IG9ubHkgY29udGFpbiBzdGluZ3MnLFxuICAgIHUgPT4gYWxsKGlzTm9uRW1wdHlTdHJpbmcpKHUuYWNjZXNzTGV2ZWxzKSksXG5dO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVVc2VyID0gKCkgPT4gKGFsbHVzZXJzLCB1c2VyKSA9PiBhcHBseVJ1bGVTZXQodXNlclJ1bGVzKGFsbHVzZXJzKSkodXNlcik7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVVzZXJzID0gYXBwID0+IGFsbFVzZXJzID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkudmFsaWRhdGVVc2VycyxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyBhbGxVc2VycyB9LFxuICBfdmFsaWRhdGVVc2VycywgYXBwLCBhbGxVc2Vycyxcbik7XG5cbmV4cG9ydCBjb25zdCBfdmFsaWRhdGVVc2VycyA9IChhcHAsIGFsbFVzZXJzKSA9PiAkKGFsbFVzZXJzLCBbXG4gIG1hcChsID0+IHZhbGlkYXRlVXNlcihhcHApKGFsbFVzZXJzLCBsKSksXG4gIGZsYXR0ZW4sXG4gIHVuaXFXaXRoKCh4LCB5KSA9PiB4LmZpZWxkID09PSB5LmZpZWxkXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB4Lml0ZW0gPT09IHkuaXRlbVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgeC5lcnJvciA9PT0geS5lcnJvciksXG5dKTtcbiIsImltcG9ydCB7IGFwaVdyYXBwZXJTeW5jLCBldmVudHMgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3VXNlciA9IGFwcCA9PiAoKSA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5nZXROZXdVc2VyLFxuICBwZXJtaXNzaW9uLmNyZWF0ZVVzZXIuaXNBdXRob3JpemVkLFxuICB7fSxcbiAgX2dldE5ld1VzZXIsIGFwcCxcbik7XG5cbmV4cG9ydCBjb25zdCBfZ2V0TmV3VXNlciA9ICgpID0+ICh7XG4gIG5hbWU6ICcnLFxuICBhY2Nlc3NMZXZlbHM6IFtdLFxuICBlbmFibGVkOiB0cnVlLFxuICB0ZW1wb3JhcnlBY2Nlc3NJZDogJycsXG59KTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld1VzZXJBdXRoID0gYXBwID0+ICgpID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmdldE5ld1VzZXJBdXRoLFxuICBwZXJtaXNzaW9uLmNyZWF0ZVVzZXIuaXNBdXRob3JpemVkLFxuICB7fSxcbiAgX2dldE5ld1VzZXJBdXRoLCBhcHAsXG4pO1xuXG5leHBvcnQgY29uc3QgX2dldE5ld1VzZXJBdXRoID0gKCkgPT4gKHtcbiAgcGFzc3dvcmRIYXNoOiAnJyxcbiAgdGVtcG9yYXJ5QWNjZXNzSGFzaDogJycsXG4gIHRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoOiAwLFxufSk7XG4iLCJpbXBvcnQgeyBmaW5kIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHVzZXJBdXRoRmlsZSwgcGFyc2VUZW1wb3JhcnlDb2RlIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7XG4gIGlzU29tZXRoaW5nLCAkLCBhcGlXcmFwcGVyLCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgX2dldFVzZXJzIH0gZnJvbSAnLi9nZXRVc2Vycyc7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBpc1ZhbGlkUGFzc3dvcmQgPSBhcHAgPT4gcGFzc3dvcmQgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuaXNWYWxpZFBhc3N3b3JkLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHBhc3N3b3JkIH0sXG4gIF9pc1ZhbGlkUGFzc3dvcmQsIGFwcCwgcGFzc3dvcmQsXG4pO1xuXG5leHBvcnQgY29uc3QgX2lzVmFsaWRQYXNzd29yZCA9IChhcHAsIHBhc3N3b3JkKSA9PiBzY29yZVBhc3N3b3JkKHBhc3N3b3JkKS5zY29yZSA+IDMwO1xuXG5leHBvcnQgY29uc3QgY2hhbmdlTXlQYXNzd29yZCA9IGFwcCA9PiBhc3luYyAoY3VycmVudFB3LCBuZXdwYXNzd29yZCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5jaGFuZ2VNeVBhc3N3b3JkLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IGN1cnJlbnRQdywgbmV3cGFzc3dvcmQgfSxcbiAgX2NoYW5nZU15UGFzc3dvcmQsIGFwcCwgY3VycmVudFB3LCBuZXdwYXNzd29yZCxcbik7XG5cbmV4cG9ydCBjb25zdCBfY2hhbmdlTXlQYXNzd29yZCA9IGFzeW5jIChhcHAsIGN1cnJlbnRQdywgbmV3cGFzc3dvcmQpID0+IHtcbiAgY29uc3QgZXhpc3RpbmdBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICB1c2VyQXV0aEZpbGUoYXBwLnVzZXIubmFtZSksXG4gICk7XG5cbiAgaWYgKGlzU29tZXRoaW5nKGV4aXN0aW5nQXV0aC5wYXNzd29yZEhhc2gpKSB7XG4gICAgY29uc3QgdmVyaWZpZWQgPSBhd2FpdCBhcHAuY3J5cHRvLnZlcmlmeShcbiAgICAgIGV4aXN0aW5nQXV0aC5wYXNzd29yZEhhc2gsXG4gICAgICBjdXJyZW50UHcsXG4gICAgKTtcblxuICAgIGlmICh2ZXJpZmllZCkge1xuICAgICAgYXdhaXQgYXdhaXQgZG9TZXQoXG4gICAgICAgIGFwcCwgZXhpc3RpbmdBdXRoLFxuICAgICAgICBhcHAudXNlci5uYW1lLCBuZXdwYXNzd29yZCxcbiAgICAgICk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3Qgc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZSA9IGFwcCA9PiBhc3luYyAodGVtcENvZGUsIG5ld3Bhc3N3b3JkKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLnNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgdGVtcENvZGUsIG5ld3Bhc3N3b3JkIH0sXG4gIF9zZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlLCBhcHAsIHRlbXBDb2RlLCBuZXdwYXNzd29yZCxcbik7XG5cblxuZXhwb3J0IGNvbnN0IF9zZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlID0gYXN5bmMgKGFwcCwgdGVtcENvZGUsIG5ld3Bhc3N3b3JkKSA9PiB7XG4gIGNvbnN0IGN1cnJlbnRUaW1lID0gYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpO1xuXG4gIGNvbnN0IHRlbXAgPSBwYXJzZVRlbXBvcmFyeUNvZGUodGVtcENvZGUpO1xuXG4gIGNvbnN0IHVzZXIgPSAkKGF3YWl0IF9nZXRVc2VycyhhcHApLCBbXG4gICAgZmluZCh1ID0+IHUudGVtcG9yYXJ5QWNjZXNzSWQgPT09IHRlbXAuaWQpLFxuICBdKTtcblxuICBpZiAoIXVzZXIpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgY29uc3QgZXhpc3RpbmdBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICB1c2VyQXV0aEZpbGUodXNlci5uYW1lKSxcbiAgKTtcblxuICBpZiAoaXNTb21ldGhpbmcoZXhpc3RpbmdBdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2gpXG4gICAgICAgJiYgZXhpc3RpbmdBdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID4gY3VycmVudFRpbWUpIHtcbiAgICBjb25zdCB2ZXJpZmllZCA9IGF3YWl0IGFwcC5jcnlwdG8udmVyaWZ5KFxuICAgICAgZXhpc3RpbmdBdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2gsXG4gICAgICB0ZW1wLmNvZGUsXG4gICAgKTtcblxuICAgIGlmICh2ZXJpZmllZCkge1xuICAgICAgYXdhaXQgZG9TZXQoXG4gICAgICAgIGFwcCwgZXhpc3RpbmdBdXRoLFxuICAgICAgICB1c2VyLm5hbWUsIG5ld3Bhc3N3b3JkLFxuICAgICAgKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IGRvU2V0ID0gYXN5bmMgKGFwcCwgYXV0aCwgdXNlcm5hbWUsIG5ld3Bhc3N3b3JkKSA9PiB7XG4gIGF1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaCA9ICcnO1xuICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID0gMDtcbiAgYXV0aC5wYXNzd29yZEhhc2ggPSBhd2FpdCBhcHAuY3J5cHRvLmhhc2goXG4gICAgbmV3cGFzc3dvcmQsXG4gICk7XG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgICB1c2VyQXV0aEZpbGUodXNlcm5hbWUpLFxuICAgIGF1dGgsXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2NvcmVQYXNzd29yZCA9IGFwcCA9PiBwYXNzd29yZCA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5zY29yZVBhc3N3b3JkLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHBhc3N3b3JkIH0sXG4gIF9zY29yZVBhc3N3b3JkLCBwYXNzd29yZCxcbik7XG5cbmV4cG9ydCBjb25zdCBfc2NvcmVQYXNzd29yZCA9IChwYXNzd29yZCkgPT4ge1xuICAvLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzk0ODE3Mi9wYXNzd29yZC1zdHJlbmd0aC1tZXRlclxuICAvLyB0aGFuayB5b3UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS91c2Vycy80NjYxNy90bS1sdlxuXG4gIGxldCBzY29yZSA9IDA7XG4gIGlmICghcGFzc3dvcmQpIHsgcmV0dXJuIHNjb3JlOyB9XG5cbiAgLy8gYXdhcmQgZXZlcnkgdW5pcXVlIGxldHRlciB1bnRpbCA1IHJlcGV0aXRpb25zXG4gIGNvbnN0IGxldHRlcnMgPSBuZXcgT2JqZWN0KCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGFzc3dvcmQubGVuZ3RoOyBpKyspIHtcbiAgICBsZXR0ZXJzW3Bhc3N3b3JkW2ldXSA9IChsZXR0ZXJzW3Bhc3N3b3JkW2ldXSB8fCAwKSArIDE7XG4gICAgc2NvcmUgKz0gNS4wIC8gbGV0dGVyc1twYXNzd29yZFtpXV07XG4gIH1cblxuICAvLyBib251cyBwb2ludHMgZm9yIG1peGluZyBpdCB1cFxuICBjb25zdCB2YXJpYXRpb25zID0ge1xuICAgIGRpZ2l0czogL1xcZC8udGVzdChwYXNzd29yZCksXG4gICAgbG93ZXI6IC9bYS16XS8udGVzdChwYXNzd29yZCksXG4gICAgdXBwZXI6IC9bQS1aXS8udGVzdChwYXNzd29yZCksXG4gICAgbm9uV29yZHM6IC9cXFcvLnRlc3QocGFzc3dvcmQpLFxuICB9O1xuXG4gIGxldCB2YXJpYXRpb25Db3VudCA9IDA7XG4gIGZvciAoY29uc3QgY2hlY2sgaW4gdmFyaWF0aW9ucykge1xuICAgIHZhcmlhdGlvbkNvdW50ICs9ICh2YXJpYXRpb25zW2NoZWNrXSA9PSB0cnVlKSA/IDEgOiAwO1xuICB9XG4gIHNjb3JlICs9ICh2YXJpYXRpb25Db3VudCAtIDEpICogMTA7XG5cbiAgY29uc3Qgc3RyZW5ndGhUZXh0ID0gc2NvcmUgPiA4MFxuICAgID8gJ3N0cm9uZydcbiAgICA6IHNjb3JlID4gNjBcbiAgICAgID8gJ2dvb2QnXG4gICAgICA6IHNjb3JlID49IDMwXG4gICAgICAgID8gJ3dlYWsnXG4gICAgICAgIDogJ3Zlcnkgd2Vhayc7XG5cbiAgcmV0dXJuIHtcbiAgICBzY29yZTogcGFyc2VJbnQoc2NvcmUpLFxuICAgIHN0cmVuZ3RoVGV4dCxcbiAgfTtcbn07XG4iLCJpbXBvcnQgeyBqb2luLCBzb21lIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHZhbGlkYXRlVXNlciB9IGZyb20gJy4vdmFsaWRhdGVVc2VyJztcbmltcG9ydCB7IGdldE5ld1VzZXJBdXRoIH0gZnJvbSAnLi9nZXROZXdVc2VyJztcbmltcG9ydCB7XG4gIGdldExvY2ssIGlzTm9sb2NrLCByZWxlYXNlTG9jaywgYXBpV3JhcHBlciwgZXZlbnRzLFxuICBpbnNlbnNpdGl2ZUVxdWFscywgaXNOb25FbXB0eVN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIFVTRVJTX0xPQ0tfRklMRSwgc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZixcbiAgVVNFUlNfTElTVF9GSUxFLCB1c2VyQXV0aEZpbGUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyBnZXRUZW1wb3JhcnlDb2RlIH0gZnJvbSAnLi9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MnO1xuaW1wb3J0IHsgaXNWYWxpZFBhc3N3b3JkIH0gZnJvbSAnLi9zZXRQYXNzd29yZCc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVVzZXIgPSBhcHAgPT4gYXN5bmMgKHVzZXIsIHBhc3N3b3JkID0gbnVsbCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5jcmVhdGVVc2VyLFxuICBwZXJtaXNzaW9uLmNyZWF0ZVVzZXIuaXNBdXRob3JpemVkLFxuICB7IHVzZXIsIHBhc3N3b3JkIH0sXG4gIF9jcmVhdGVVc2VyLCBhcHAsIHVzZXIsIHBhc3N3b3JkLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9jcmVhdGVVc2VyID0gYXN5bmMgKGFwcCwgdXNlciwgcGFzc3dvcmQgPSBudWxsKSA9PiB7XG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRMb2NrKFxuICAgIGFwcCwgVVNFUlNfTE9DS19GSUxFLCAxMDAwLCAyLFxuICApO1xuXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBjcmVhdGUgdXNlciwgY291bGQgbm90IGdldCBsb2NrIC0gdHJ5IGFnYWluJyk7IH1cblxuICBjb25zdCB1c2VycyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oVVNFUlNfTElTVF9GSUxFKTtcblxuICBjb25zdCB1c2VyRXJyb3JzID0gdmFsaWRhdGVVc2VyKGFwcCkoWy4uLnVzZXJzLCB1c2VyXSwgdXNlcik7XG4gIGlmICh1c2VyRXJyb3JzLmxlbmd0aCA+IDApIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgVXNlciBpcyBpbnZhbGlkLiAke2pvaW4oJzsgJykodXNlckVycm9ycyl9YCk7IH1cblxuICBjb25zdCB7IGF1dGgsIHRlbXBDb2RlLCB0ZW1wb3JhcnlBY2Nlc3NJZCB9ID0gYXdhaXQgZ2V0QWNjZXNzKFxuICAgIGFwcCwgcGFzc3dvcmQsXG4gICk7XG4gIHVzZXIudGVtcENvZGUgPSB0ZW1wQ29kZTtcbiAgdXNlci50ZW1wb3JhcnlBY2Nlc3NJZCA9IHRlbXBvcmFyeUFjY2Vzc0lkO1xuXG4gIGlmIChzb21lKHUgPT4gaW5zZW5zaXRpdmVFcXVhbHModS5uYW1lLCB1c2VyLm5hbWUpKSh1c2VycykpIHsgXG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignVXNlciBhbHJlYWR5IGV4aXN0cycpOyBcbiAgfVxuXG4gIHVzZXJzLnB1c2goXG4gICAgc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZih1c2VyKSxcbiAgKTtcblxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgVVNFUlNfTElTVF9GSUxFLFxuICAgIHVzZXJzLFxuICApO1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVKc29uKFxuICAgICAgdXNlckF1dGhGaWxlKHVzZXIubmFtZSksXG4gICAgICBhdXRoLFxuICAgICk7XG4gIH0gY2F0Y2ggKF8pIHtcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgICB1c2VyQXV0aEZpbGUodXNlci5uYW1lKSxcbiAgICAgIGF1dGgsXG4gICAgKTtcbiAgfVxuXG4gIGF3YWl0IHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XG5cbiAgcmV0dXJuIHVzZXI7XG59O1xuXG5jb25zdCBnZXRBY2Nlc3MgPSBhc3luYyAoYXBwLCBwYXNzd29yZCkgPT4ge1xuICBjb25zdCBhdXRoID0gZ2V0TmV3VXNlckF1dGgoYXBwKSgpO1xuXG4gIGlmIChpc05vbkVtcHR5U3RyaW5nKHBhc3N3b3JkKSkge1xuICAgIGlmIChpc1ZhbGlkUGFzc3dvcmQocGFzc3dvcmQpKSB7XG4gICAgICBhdXRoLnBhc3N3b3JkSGFzaCA9IGF3YWl0IGFwcC5jcnlwdG8uaGFzaChwYXNzd29yZCk7XG4gICAgICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2ggPSAnJztcbiAgICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzSWQgPSAnJztcbiAgICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPSAwO1xuICAgICAgcmV0dXJuIHsgYXV0aCB9O1xuICAgIH1cbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdQYXNzd29yZCBkb2VzIG5vdCBtZWV0IHJlcXVpcmVtZW50cycpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHRlbXBBY2Nlc3MgPSBhd2FpdCBnZXRUZW1wb3JhcnlDb2RlKGFwcCk7XG4gICAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoID0gdGVtcEFjY2Vzcy50ZW1wb3JhcnlBY2Nlc3NIYXNoO1xuICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPSB0ZW1wQWNjZXNzLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoO1xuICAgIGF1dGgucGFzc3dvcmRIYXNoID0gJyc7XG4gICAgcmV0dXJuICh7XG4gICAgICBhdXRoLFxuICAgICAgdGVtcENvZGU6IHRlbXBBY2Nlc3MudGVtcENvZGUsXG4gICAgICB0ZW1wb3JhcnlBY2Nlc3NJZDogdGVtcEFjY2Vzcy50ZW1wb3JhcnlBY2Nlc3NJZCxcbiAgICB9KTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIGdldExvY2ssXG4gIGlzTm9sb2NrLCByZWxlYXNlTG9jayxcbn0gZnJvbSAnLi4vY29tbW9uL2xvY2snO1xuaW1wb3J0IHsgVVNFUlNfTE9DS19GSUxFLCBVU0VSU19MSVNUX0ZJTEUsIGdldFVzZXJCeU5hbWUgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgYXBpV3JhcHBlciwgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGVuYWJsZVVzZXIgPSBhcHAgPT4gYXN5bmMgdXNlcm5hbWUgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5lbmFibGVVc2VyLFxuICBwZXJtaXNzaW9uLmVuYWJsZURpc2FibGVVc2VyLmlzQXV0aG9yaXplZCxcbiAgeyB1c2VybmFtZSB9LFxuICBfZW5hYmxlVXNlciwgYXBwLCB1c2VybmFtZSxcbik7XG5cbmV4cG9ydCBjb25zdCBkaXNhYmxlVXNlciA9IGFwcCA9PiBhc3luYyB1c2VybmFtZSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmRpc2FibGVVc2VyLFxuICBwZXJtaXNzaW9uLmVuYWJsZURpc2FibGVVc2VyLmlzQXV0aG9yaXplZCxcbiAgeyB1c2VybmFtZSB9LFxuICBfZGlzYWJsZVVzZXIsIGFwcCwgdXNlcm5hbWUsXG4pO1xuXG5leHBvcnQgY29uc3QgX2VuYWJsZVVzZXIgPSBhc3luYyAoYXBwLCB1c2VybmFtZSkgPT4gYXdhaXQgdG9nZ2xlVXNlcihhcHAsIHVzZXJuYW1lLCB0cnVlKTtcblxuZXhwb3J0IGNvbnN0IF9kaXNhYmxlVXNlciA9IGFzeW5jIChhcHAsIHVzZXJuYW1lKSA9PiBhd2FpdCB0b2dnbGVVc2VyKGFwcCwgdXNlcm5hbWUsIGZhbHNlKTtcblxuY29uc3QgdG9nZ2xlVXNlciA9IGFzeW5jIChhcHAsIHVzZXJuYW1lLCBlbmFibGVkKSA9PiB7XG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRMb2NrKGFwcCwgVVNFUlNfTE9DS19GSUxFLCAxMDAwLCAxLCAwKTtcblxuICBjb25zdCBhY3Rpb25OYW1lID0gZW5hYmxlZCA/ICdlbmFibGUnIDogJ2Rpc2FibGUnO1xuXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCAke2FjdGlvbk5hbWV9IHVzZXIgLSBjYW5ub3QgZ2V0IGxvY2tgKTsgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSk7XG4gICAgY29uc3QgdXNlciA9IGdldFVzZXJCeU5hbWUodXNlcnMsIHVzZXJuYW1lKTtcbiAgICBpZiAoIXVzZXIpIHsgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoYENvdWxkIG5vdCBmaW5kIHVzZXIgdG8gJHthY3Rpb25OYW1lfWApOyB9XG5cbiAgICBpZiAodXNlci5lbmFibGVkID09PSAhZW5hYmxlZCkge1xuICAgICAgdXNlci5lbmFibGVkID0gZW5hYmxlZDtcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihVU0VSU19MSVNUX0ZJTEUsIHVzZXJzKTtcbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcbiAgfVxufTtcbiIsImV4cG9ydCBjb25zdCBnZXROZXdBY2Nlc3NMZXZlbCA9ICgpID0+ICgpID0+ICh7XG4gIG5hbWU6ICcnLFxuICBwZXJtaXNzaW9uczogW10sXG4gIGRlZmF1bHQ6ZmFsc2Vcbn0pO1xuIiwiaW1wb3J0IHtcbiAgdmFsdWVzLCBpbmNsdWRlcywgbWFwLCBjb25jYXQsIGlzRW1wdHksIHVuaXFXaXRoLCBzb21lLFxuICBmbGF0dGVuLCBmaWx0ZXIsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvblR5cGVzIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7XG4gICQsIGlzU29tZXRoaW5nLCBpbnNlbnNpdGl2ZUVxdWFscyxcbiAgaXNOb25FbXB0eVN0cmluZywgYXBpV3JhcHBlclN5bmMsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldE5vZGUgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5jb25zdCBpc0FsbG93ZWRUeXBlID0gdCA9PiAkKHBlcm1pc3Npb25UeXBlcywgW1xuICB2YWx1ZXMsXG4gIGluY2x1ZGVzKHQpLFxuXSk7XG5cbmNvbnN0IGlzUmVjb3JkT3JJbmRleFR5cGUgPSB0ID0+IHNvbWUocCA9PiBwID09PSB0KShbXG4gIHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfUkVDT1JELFxuICBwZXJtaXNzaW9uVHlwZXMuVVBEQVRFX1JFQ09SRCxcbiAgcGVybWlzc2lvblR5cGVzLkRFTEVURV9SRUNPUkQsXG4gIHBlcm1pc3Npb25UeXBlcy5SRUFEX1JFQ09SRCxcbiAgcGVybWlzc2lvblR5cGVzLlJFQURfSU5ERVgsXG4gIHBlcm1pc3Npb25UeXBlcy5FWEVDVVRFX0FDVElPTixcbl0pO1xuXG5cbmNvbnN0IHBlcm1pc3Npb25SdWxlcyA9IGFwcCA9PiAoW1xuICBtYWtlcnVsZSgndHlwZScsICd0eXBlIG11c3QgYmUgb25lIG9mIGFsbG93ZWQgdHlwZXMnLFxuICAgIHAgPT4gaXNBbGxvd2VkVHlwZShwLnR5cGUpKSxcbiAgbWFrZXJ1bGUoJ25vZGVLZXknLCAncmVjb3JkIGFuZCBpbmRleCBwZXJtaXNzaW9ucyBtdXN0IGluY2x1ZGUgYSB2YWxpZCBub2RlS2V5JyxcbiAgICBwID0+ICghaXNSZWNvcmRPckluZGV4VHlwZShwLnR5cGUpKVxuICAgICAgICAgICAgIHx8IGlzU29tZXRoaW5nKGdldE5vZGUoYXBwLmhpZXJhcmNoeSwgcC5ub2RlS2V5KSkpLFxuXSk7XG5cbmNvbnN0IGFwcGx5UGVybWlzc2lvblJ1bGVzID0gYXBwID0+IGFwcGx5UnVsZVNldChwZXJtaXNzaW9uUnVsZXMoYXBwKSk7XG5cbmNvbnN0IGFjY2Vzc0xldmVsUnVsZXMgPSBhbGxMZXZlbHMgPT4gKFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnbmFtZSBtdXN0IGJlIHNldCcsXG4gICAgbCA9PiBpc05vbkVtcHR5U3RyaW5nKGwubmFtZSkpLFxuICBtYWtlcnVsZSgnbmFtZScsICdhY2Nlc3MgbGV2ZWwgbmFtZXMgbXVzdCBiZSB1bmlxdWUnLFxuICAgIGwgPT4gaXNFbXB0eShsLm5hbWUpXG4gICAgICAgICAgICAgfHwgZmlsdGVyKGEgPT4gaW5zZW5zaXRpdmVFcXVhbHMobC5uYW1lLCBhLm5hbWUpKShhbGxMZXZlbHMpLmxlbmd0aCA9PT0gMSksXG5dKTtcblxuY29uc3QgYXBwbHlMZXZlbFJ1bGVzID0gYWxsTGV2ZWxzID0+IGFwcGx5UnVsZVNldChhY2Nlc3NMZXZlbFJ1bGVzKGFsbExldmVscykpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBY2Nlc3NMZXZlbCA9IGFwcCA9PiAoYWxsTGV2ZWxzLCBsZXZlbCkgPT4ge1xuICBjb25zdCBlcnJzID0gJChsZXZlbC5wZXJtaXNzaW9ucywgW1xuICAgIG1hcChhcHBseVBlcm1pc3Npb25SdWxlcyhhcHApKSxcbiAgICBmbGF0dGVuLFxuICAgIGNvbmNhdChcbiAgICAgIGFwcGx5TGV2ZWxSdWxlcyhhbGxMZXZlbHMpKGxldmVsKSxcbiAgICApLFxuICBdKTtcblxuICByZXR1cm4gZXJycztcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFjY2Vzc0xldmVscyA9IGFwcCA9PiBhbGxMZXZlbHMgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkudmFsaWRhdGVBY2Nlc3NMZXZlbHMsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgYWxsTGV2ZWxzIH0sXG4gIF92YWxpZGF0ZUFjY2Vzc0xldmVscywgYXBwLCBhbGxMZXZlbHMsXG4pO1xuXG5leHBvcnQgY29uc3QgX3ZhbGlkYXRlQWNjZXNzTGV2ZWxzID0gKGFwcCwgYWxsTGV2ZWxzKSA9PiAkKGFsbExldmVscywgW1xuICBtYXAobCA9PiB2YWxpZGF0ZUFjY2Vzc0xldmVsKGFwcCkoYWxsTGV2ZWxzLCBsKSksXG4gIGZsYXR0ZW4sXG4gIHVuaXFXaXRoKCh4LCB5KSA9PiB4LmZpZWxkID09PSB5LmZpZWxkXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB4Lml0ZW0gPT09IHkuaXRlbVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgeC5lcnJvciA9PT0geS5lcnJvciksXG5dKTtcbiIsImltcG9ydCB7IGpvaW4sIG1hcCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRMb2NrLCByZWxlYXNlTG9jaywgJCxcbiAgaXNOb2xvY2ssIGFwaVdyYXBwZXIsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIEFDQ0VTU19MRVZFTFNfTE9DS19GSUxFLFxuICBBQ0NFU1NfTEVWRUxTX0ZJTEUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyB2YWxpZGF0ZUFjY2Vzc0xldmVscyB9IGZyb20gJy4vdmFsaWRhdGVBY2Nlc3NMZXZlbHMnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3Qgc2F2ZUFjY2Vzc0xldmVscyA9IGFwcCA9PiBhc3luYyBhY2Nlc3NMZXZlbHMgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5zYXZlQWNjZXNzTGV2ZWxzLFxuICBwZXJtaXNzaW9uLndyaXRlQWNjZXNzTGV2ZWxzLmlzQXV0aG9yaXplZCxcbiAgeyBhY2Nlc3NMZXZlbHMgfSxcbiAgX3NhdmVBY2Nlc3NMZXZlbHMsIGFwcCwgYWNjZXNzTGV2ZWxzLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9zYXZlQWNjZXNzTGV2ZWxzID0gYXN5bmMgKGFwcCwgYWNjZXNzTGV2ZWxzKSA9PiB7XG4gIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0ZUFjY2Vzc0xldmVscyhhcHApKGFjY2Vzc0xldmVscy5sZXZlbHMpO1xuICBpZiAodmFsaWRhdGlvbkVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgZXJycyA9ICQodmFsaWRhdGlvbkVycm9ycywgW1xuICAgICAgbWFwKGUgPT4gZS5lcnJvciksXG4gICAgICBqb2luKCcsICcpLFxuICAgIF0pO1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBBY2Nlc3MgTGV2ZWxzIEludmFsaWQ6ICR7ZXJyc31gLFxuICAgICk7XG4gIH1cblxuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhcbiAgICBhcHAsIEFDQ0VTU19MRVZFTFNfTE9DS19GSUxFLCAyMDAwLCAyLFxuICApO1xuXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBnZXQgbG9jayB0byBzYXZlIGFjY2VzcyBsZXZlbHMnKTsgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKEFDQ0VTU19MRVZFTFNfRklMRSk7XG4gICAgaWYgKGV4aXN0aW5nLnZlcnNpb24gIT09IGFjY2Vzc0xldmVscy52ZXJzaW9uKSB7IHRocm93IG5ldyBFcnJvcignQWNjZXNzIGxldmVscyBoYXZlIGFscmVhZHkgYmVlbiB1cGRhdGVkLCBzaW5jZSB5b3UgbG9hZGVkJyk7IH1cblxuICAgIGFjY2Vzc0xldmVscy52ZXJzaW9uKys7XG5cbiAgICBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oQUNDRVNTX0xFVkVMU19GSUxFLCBhY2Nlc3NMZXZlbHMpO1xuICB9IGZpbmFsbHkge1xuICAgIGF3YWl0IHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBmaWx0ZXIsIHZhbHVlcywgZWFjaCwga2V5cyxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcbmltcG9ydCB7XG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgaXNJbmRleCwgaXNSZWNvcmQsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zID0gKGFwcCkgPT4ge1xuICBjb25zdCBhbGxOb2RlcyA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShhcHAuaGllcmFyY2h5KTtcbiAgY29uc3QgYWNjZXNzTGV2ZWwgPSB7IHBlcm1pc3Npb25zOiBbXSB9O1xuXG4gIGNvbnN0IHJlY29yZE5vZGVzID0gJChhbGxOb2RlcywgW1xuICAgIGZpbHRlcihpc1JlY29yZCksXG4gIF0pO1xuXG4gIGZvciAoY29uc3QgbiBvZiByZWNvcmROb2Rlcykge1xuICAgIHBlcm1pc3Npb24uY3JlYXRlUmVjb3JkLmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xuICAgIHBlcm1pc3Npb24udXBkYXRlUmVjb3JkLmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xuICAgIHBlcm1pc3Npb24uZGVsZXRlUmVjb3JkLmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xuICAgIHBlcm1pc3Npb24ucmVhZFJlY29yZC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcbiAgfVxuXG4gIGNvbnN0IGluZGV4Tm9kZXMgPSAkKGFsbE5vZGVzLCBbXG4gICAgZmlsdGVyKGlzSW5kZXgpLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IG4gb2YgaW5kZXhOb2Rlcykge1xuICAgIHBlcm1pc3Npb24ucmVhZEluZGV4LmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xuICB9XG5cbiAgZm9yIChjb25zdCBhIG9mIGtleXMoYXBwLmFjdGlvbnMpKSB7XG4gICAgcGVybWlzc2lvbi5leGVjdXRlQWN0aW9uLmFkZChhLCBhY2Nlc3NMZXZlbCk7XG4gIH1cblxuICAkKHBlcm1pc3Npb24sIFtcbiAgICB2YWx1ZXMsXG4gICAgZmlsdGVyKHAgPT4gIXAuaXNOb2RlKSxcbiAgICBlYWNoKHAgPT4gcC5hZGQoYWNjZXNzTGV2ZWwpKSxcbiAgXSk7XG5cbiAgcmV0dXJuIGFjY2Vzc0xldmVsLnBlcm1pc3Npb25zO1xufTtcbiIsImltcG9ydCB7IGRpZmZlcmVuY2UsIG1hcCwgam9pbiB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRMb2NrLCBpc05vbG9jaywgcmVsZWFzZUxvY2ssICQsXG4gIGFwaVdyYXBwZXIsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIFVTRVJTX0xPQ0tfRklMRSwgQUNDRVNTX0xFVkVMU19GSUxFLFxuICBnZXRVc2VyQnlOYW1lLCBVU0VSU19MSVNUX0ZJTEUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBzZXRVc2VyQWNjZXNzTGV2ZWxzID0gYXBwID0+IGFzeW5jICh1c2VyTmFtZSwgYWNjZXNzTGV2ZWxzKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLnNldFVzZXJBY2Nlc3NMZXZlbHMsXG4gIHBlcm1pc3Npb24uc2V0VXNlckFjY2Vzc0xldmVscy5pc0F1dGhvcml6ZWQsXG4gIHsgdXNlck5hbWUsIGFjY2Vzc0xldmVscyB9LFxuICBfc2V0VXNlckFjY2Vzc0xldmVscywgYXBwLCB1c2VyTmFtZSwgYWNjZXNzTGV2ZWxzLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9zZXRVc2VyQWNjZXNzTGV2ZWxzID0gYXN5bmMgKGFwcCwgdXNlcm5hbWUsIGFjY2Vzc0xldmVscykgPT4ge1xuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhhcHAsIFVTRVJTX0xPQ0tfRklMRSwgMTAwMCwgMSwgMCk7XG5cbiAgY29uc3QgYWN0dWFsQWNjZXNzTGV2ZWxzID0gJChcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKEFDQ0VTU19MRVZFTFNfRklMRSksXG4gICAgW1xuICAgICAgbCA9PiBsLmxldmVscyxcbiAgICAgIG1hcChsID0+IGwubmFtZSksXG4gICAgXSxcbiAgKTtcblxuICBjb25zdCBtaXNzaW5nID0gZGlmZmVyZW5jZShhY2Nlc3NMZXZlbHMpKGFjdHVhbEFjY2Vzc0xldmVscyk7XG4gIGlmIChtaXNzaW5nLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgYWNjZXNzIGxldmVscyBzdXBwbGllZDogJHtqb2luKCcsICcsIG1pc3NpbmcpfWApO1xuICB9XG5cbiAgaWYgKGlzTm9sb2NrKGxvY2spKSB7IHRocm93IG5ldyBFcnJvcignQ291bGQgc2V0IHVzZXIgYWNjZXNzIGxldmVscyBjYW5ub3QgZ2V0IGxvY2snKTsgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSk7XG4gICAgY29uc3QgdXNlciA9IGdldFVzZXJCeU5hbWUodXNlcnMsIHVzZXJuYW1lKTtcbiAgICBpZiAoIXVzZXIpIHsgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoYENvdWxkIG5vdCBmaW5kIHVzZXIgd2l0aCAke3VzZXJuYW1lfWApOyB9XG5cbiAgICB1c2VyLmFjY2Vzc0xldmVscyA9IGFjY2Vzc0xldmVscztcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oVVNFUlNfTElTVF9GSUxFLCB1c2Vycyk7XG4gIH0gZmluYWxseSB7XG4gICAgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIGF1dGhlbnRpY2F0ZSxcbiAgYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzLFxufSBmcm9tICcuL2F1dGhlbnRpY2F0ZSc7XG5pbXBvcnQgeyBjcmVhdGVUZW1wb3JhcnlBY2Nlc3MgfSBmcm9tICcuL2NyZWF0ZVRlbXBvcmFyeUFjY2Vzcyc7XG5pbXBvcnQgeyBjcmVhdGVVc2VyIH0gZnJvbSAnLi9jcmVhdGVVc2VyJztcbmltcG9ydCB7IGVuYWJsZVVzZXIsIGRpc2FibGVVc2VyIH0gZnJvbSAnLi9lbmFibGVVc2VyJztcbmltcG9ydCB7IGxvYWRBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL2xvYWRBY2Nlc3NMZXZlbHMnO1xuaW1wb3J0IHsgZ2V0TmV3QWNjZXNzTGV2ZWwgfSBmcm9tICcuL2dldE5ld0FjY2Vzc0xldmVsJztcbmltcG9ydCB7IGdldE5ld1VzZXIsIGdldE5ld1VzZXJBdXRoIH0gZnJvbSAnLi9nZXROZXdVc2VyJztcbmltcG9ydCB7IGdldFVzZXJzIH0gZnJvbSAnLi9nZXRVc2Vycyc7XG5pbXBvcnQgeyBpc0F1dGhvcml6ZWQgfSBmcm9tICcuL2lzQXV0aG9yaXplZCc7XG5pbXBvcnQgeyBzYXZlQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi9zYXZlQWNjZXNzTGV2ZWxzJztcbmltcG9ydCB7XG4gIGNoYW5nZU15UGFzc3dvcmQsXG4gIHNjb3JlUGFzc3dvcmQsIHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUsXG4gIGlzVmFsaWRQYXNzd29yZCxcbn0gZnJvbSAnLi9zZXRQYXNzd29yZCc7XG5pbXBvcnQgeyB2YWxpZGF0ZVVzZXIgfSBmcm9tICcuL3ZhbGlkYXRlVXNlcic7XG5pbXBvcnQgeyB2YWxpZGF0ZUFjY2Vzc0xldmVscyB9IGZyb20gJy4vdmFsaWRhdGVBY2Nlc3NMZXZlbHMnO1xuaW1wb3J0IHsgZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMgfSBmcm9tICcuL2dlbmVyYXRlRnVsbFBlcm1pc3Npb25zJztcbmltcG9ydCB7IHNldFVzZXJBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL3NldFVzZXJBY2Nlc3NMZXZlbHMnO1xuXG5leHBvcnQgY29uc3QgZ2V0QXV0aEFwaSA9IGFwcCA9PiAoe1xuICBhdXRoZW50aWNhdGU6IGF1dGhlbnRpY2F0ZShhcHApLFxuICBhdXRoZW50aWNhdGVUZW1wb3JhcnlBY2Nlc3M6IGF1dGhlbnRpY2F0ZVRlbXBvcmFyeUFjY2VzcyhhcHApLFxuICBjcmVhdGVUZW1wb3JhcnlBY2Nlc3M6IGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyhhcHApLFxuICBjcmVhdGVVc2VyOiBjcmVhdGVVc2VyKGFwcCksXG4gIGxvYWRBY2Nlc3NMZXZlbHM6IGxvYWRBY2Nlc3NMZXZlbHMoYXBwKSxcbiAgZW5hYmxlVXNlcjogZW5hYmxlVXNlcihhcHApLFxuICBkaXNhYmxlVXNlcjogZGlzYWJsZVVzZXIoYXBwKSxcbiAgZ2V0TmV3QWNjZXNzTGV2ZWw6IGdldE5ld0FjY2Vzc0xldmVsKGFwcCksXG4gIGdldE5ld1VzZXI6IGdldE5ld1VzZXIoYXBwKSxcbiAgZ2V0TmV3VXNlckF1dGg6IGdldE5ld1VzZXJBdXRoKGFwcCksXG4gIGdldFVzZXJzOiBnZXRVc2VycyhhcHApLFxuICBzYXZlQWNjZXNzTGV2ZWxzOiBzYXZlQWNjZXNzTGV2ZWxzKGFwcCksXG4gIGlzQXV0aG9yaXplZDogaXNBdXRob3JpemVkKGFwcCksXG4gIGNoYW5nZU15UGFzc3dvcmQ6IGNoYW5nZU15UGFzc3dvcmQoYXBwKSxcbiAgc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZTogc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZShhcHApLFxuICBzY29yZVBhc3N3b3JkLFxuICBpc1ZhbGlkUGFzc3dvcmQ6IGlzVmFsaWRQYXNzd29yZChhcHApLFxuICB2YWxpZGF0ZVVzZXI6IHZhbGlkYXRlVXNlcihhcHApLFxuICB2YWxpZGF0ZUFjY2Vzc0xldmVsczogdmFsaWRhdGVBY2Nlc3NMZXZlbHMoYXBwKSxcbiAgZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnM6ICgpID0+IGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zKGFwcCksXG4gIHNldFVzZXJBY2Nlc3NMZXZlbHM6IHNldFVzZXJBY2Nlc3NMZXZlbHMoYXBwKSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRBdXRoQXBpO1xuIiwiaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgYXBpV3JhcHBlclN5bmMgfSBmcm9tICcuLi9jb21tb24vYXBpV3JhcHBlcic7XG5pbXBvcnQgeyBldmVudHMgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcblxuZXhwb3J0IGNvbnN0IGV4ZWN1dGVBY3Rpb24gPSBhcHAgPT4gKGFjdGlvbk5hbWUsIG9wdGlvbnMpID0+IHtcbiAgYXBpV3JhcHBlclN5bmMoXG4gICAgYXBwLFxuICAgIGV2ZW50cy5hY3Rpb25zQXBpLmV4ZWN1dGUsXG4gICAgcGVybWlzc2lvbi5leGVjdXRlQWN0aW9uLmlzQXV0aG9yaXplZChhY3Rpb25OYW1lKSxcbiAgICB7IGFjdGlvbk5hbWUsIG9wdGlvbnMgfSxcbiAgICBhcHAuYWN0aW9uc1thY3Rpb25OYW1lXSwgb3B0aW9ucyxcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBfZXhlY3V0ZUFjdGlvbiA9IChiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb24sIG9wdGlvbnMpID0+IGJlaGF2aW91clNvdXJjZXNbYWN0aW9uLmJlaGF2aW91clNvdXJjZV1bYWN0aW9uLmJlaGF2aW91ck5hbWVdKG9wdGlvbnMpO1xuIiwiaW1wb3J0IHsgZXhlY3V0ZUFjdGlvbiB9IGZyb20gJy4vZXhlY3V0ZSc7XG5cbmV4cG9ydCBjb25zdCBnZXRBY3Rpb25zQXBpID0gYXBwID0+ICh7XG4gIGV4ZWN1dGU6IGV4ZWN1dGVBY3Rpb24oYXBwKSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRBY3Rpb25zQXBpO1xuIiwiaW1wb3J0IHsgaGFzIH0gZnJvbSAnbG9kYXNoL2ZwJztcblxuY29uc3QgcHVibGlzaCA9IGhhbmRsZXJzID0+IGFzeW5jIChldmVudE5hbWUsIGNvbnRleHQgPSB7fSkgPT4ge1xuICBpZiAoIWhhcyhldmVudE5hbWUpKGhhbmRsZXJzKSkgcmV0dXJuO1xuXG4gIGZvciAoY29uc3QgaGFuZGxlciBvZiBoYW5kbGVyc1tldmVudE5hbWVdKSB7XG4gICAgYXdhaXQgaGFuZGxlcihldmVudE5hbWUsIGNvbnRleHQpO1xuICB9XG59O1xuXG5jb25zdCBzdWJzY3JpYmUgPSBoYW5kbGVycyA9PiAoZXZlbnROYW1lLCBoYW5kbGVyKSA9PiB7XG4gIGlmICghaGFzKGV2ZW50TmFtZSkoaGFuZGxlcnMpKSB7XG4gICAgaGFuZGxlcnNbZXZlbnROYW1lXSA9IFtdO1xuICB9XG4gIGhhbmRsZXJzW2V2ZW50TmFtZV0ucHVzaChoYW5kbGVyKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVFdmVudEFnZ3JlZ2F0b3IgPSAoKSA9PiB7XG4gIGNvbnN0IGhhbmRsZXJzID0ge307XG4gIGNvbnN0IGV2ZW50QWdncmVnYXRvciA9ICh7XG4gICAgcHVibGlzaDogcHVibGlzaChoYW5kbGVycyksXG4gICAgc3Vic2NyaWJlOiBzdWJzY3JpYmUoaGFuZGxlcnMpLFxuICB9KTtcbiAgcmV0dXJuIGV2ZW50QWdncmVnYXRvcjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUV2ZW50QWdncmVnYXRvcjtcbiIsImltcG9ydCB7IHJldHJ5IH0gZnJvbSAnLi4vY29tbW9uL2luZGV4JztcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuY29uc3QgY3JlYXRlSnNvbiA9IG9yaWdpbmFsQ3JlYXRlRmlsZSA9PiBhc3luYyAoa2V5LCBvYmosIHJldHJpZXMgPSA1LCBkZWxheSA9IDUwMCkgPT4gYXdhaXQgcmV0cnkob3JpZ2luYWxDcmVhdGVGaWxlLCByZXRyaWVzLCBkZWxheSwga2V5LCBKU09OLnN0cmluZ2lmeShvYmopKTtcblxuY29uc3QgY3JlYXRlTmV3RmlsZSA9IG9yaWdpbmFsQ3JlYXRlRmlsZSA9PiBhc3luYyAocGF0aCwgY29udGVudCwgcmV0cmllcyA9IDUsIGRlbGF5ID0gNTAwKSA9PiBhd2FpdCByZXRyeShvcmlnaW5hbENyZWF0ZUZpbGUsIHJldHJpZXMsIGRlbGF5LCBwYXRoLCBjb250ZW50KTtcblxuY29uc3QgbG9hZEpzb24gPSBkYXRhc3RvcmUgPT4gYXN5bmMgKGtleSwgcmV0cmllcyA9IDUsIGRlbGF5ID0gNTAwKSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IHJldHJ5KEpTT04ucGFyc2UsIHJldHJpZXMsIGRlbGF5LCBhd2FpdCBkYXRhc3RvcmUubG9hZEZpbGUoa2V5KSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGVyci5tZXNzYWdlKTtcbiAgfVxufVxuXG5jb25zdCB1cGRhdGVKc29uID0gZGF0YXN0b3JlID0+IGFzeW5jIChrZXksIG9iaiwgcmV0cmllcyA9IDUsIGRlbGF5ID0gNTAwKSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IHJldHJ5KGRhdGFzdG9yZS51cGRhdGVGaWxlLCByZXRyaWVzLCBkZWxheSwga2V5LCBKU09OLnN0cmluZ2lmeShvYmopKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoZXJyLm1lc3NhZ2UpO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBzZXR1cERhdGFzdG9yZSA9IChkYXRhc3RvcmUpID0+IHtcbiAgY29uc3Qgb3JpZ2luYWxDcmVhdGVGaWxlID0gZGF0YXN0b3JlLmNyZWF0ZUZpbGU7XG4gIGRhdGFzdG9yZS5sb2FkSnNvbiA9IGxvYWRKc29uKGRhdGFzdG9yZSk7XG4gIGRhdGFzdG9yZS5jcmVhdGVKc29uID0gY3JlYXRlSnNvbihvcmlnaW5hbENyZWF0ZUZpbGUpO1xuICBkYXRhc3RvcmUudXBkYXRlSnNvbiA9IHVwZGF0ZUpzb24oZGF0YXN0b3JlKTtcbiAgZGF0YXN0b3JlLmNyZWF0ZUZpbGUgPSBjcmVhdGVOZXdGaWxlKG9yaWdpbmFsQ3JlYXRlRmlsZSk7XG4gIGlmIChkYXRhc3RvcmUuY3JlYXRlRW1wdHlEYikgeyBkZWxldGUgZGF0YXN0b3JlLmNyZWF0ZUVtcHR5RGI7IH1cbiAgcmV0dXJuIGRhdGFzdG9yZTtcbn07XG5cbmV4cG9ydCB7IGNyZWF0ZUV2ZW50QWdncmVnYXRvciB9IGZyb20gJy4vZXZlbnRBZ2dyZWdhdG9yJztcblxuZXhwb3J0IGRlZmF1bHQgc2V0dXBEYXRhc3RvcmU7XG4iLCJpbXBvcnQgeyBcbiAgY29tcGlsZUV4cHJlc3Npb24gYXMgY0V4cCwgXG4gIGNvbXBpbGVDb2RlIGFzIGNDb2RlIFxufSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XG5cbmV4cG9ydCBjb25zdCBjb21waWxlQ29kZSA9IGNvZGUgPT4ge1xuICBsZXQgZnVuYzsgIFxuICAgIFxuICB0cnkge1xuICAgIGZ1bmMgPSBjQ29kZShjb2RlKTtcbiAgfSBjYXRjaChlKSB7XG4gICAgZS5tZXNzYWdlID0gYEVycm9yIGNvbXBpbGluZyBjb2RlIDogJHtjb2RlfSA6ICR7ZS5tZXNzYWdlfWA7XG4gICAgdGhyb3cgZTtcbiAgfVxuXG4gIHJldHVybiBmdW5jO1xufVxuXG5leHBvcnQgY29uc3QgY29tcGlsZUV4cHJlc3Npb24gPSBjb2RlID0+IHtcbiAgbGV0IGZ1bmM7ICBcbiAgICAgIFxuICB0cnkge1xuICAgIGZ1bmMgPSBjRXhwKGNvZGUpO1xuICB9IGNhdGNoKGUpIHtcbiAgICBlLm1lc3NhZ2UgPSBgRXJyb3IgY29tcGlsaW5nIGV4cHJlc3Npb24gOiAke2NvZGV9IDogJHtlLm1lc3NhZ2V9YDtcbiAgICB0aHJvdyBlO1xuICB9XG4gIFxuICByZXR1cm4gZnVuYztcbn1cbiIsImltcG9ydCB7XG4gIGlzRnVuY3Rpb24sIGZpbHRlciwgbWFwLFxuICB1bmlxQnksIGtleXMsIGRpZmZlcmVuY2UsXG4gIGpvaW4sIHJlZHVjZSwgZmluZCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb21waWxlQ29kZSB9IGZyb20gJy4uL2NvbW1vbi9jb21waWxlQ29kZSc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IF9leGVjdXRlQWN0aW9uIH0gZnJvbSAnLi9leGVjdXRlJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciwgTm90Rm91bmRFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgaW5pdGlhbGlzZUFjdGlvbnMgPSAoc3Vic2NyaWJlLCBiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zLCB0cmlnZ2VycywgYXBpcykgPT4ge1xuICB2YWxpZGF0ZVNvdXJjZXMoYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucyk7XG4gIHN1YnNjcmliZVRyaWdnZXJzKHN1YnNjcmliZSwgYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucywgdHJpZ2dlcnMsIGFwaXMpO1xuICByZXR1cm4gY3JlYXRlQWN0aW9uc0NvbGxlY3Rpb24oYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucyk7XG59O1xuXG5jb25zdCBjcmVhdGVBY3Rpb25zQ29sbGVjdGlvbiA9IChiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zKSA9PiAkKGFjdGlvbnMsIFtcbiAgcmVkdWNlKChhbGwsIGEpID0+IHtcbiAgICBhbGxbYS5uYW1lXSA9IG9wdHMgPT4gX2V4ZWN1dGVBY3Rpb24oYmVoYXZpb3VyU291cmNlcywgYSwgb3B0cyk7XG4gICAgcmV0dXJuIGFsbDtcbiAgfSwge30pLFxuXSk7XG5cbmNvbnN0IHN1YnNjcmliZVRyaWdnZXJzID0gKHN1YnNjcmliZSwgYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucywgdHJpZ2dlcnMsIGFwaXMpID0+IHtcbiAgY29uc3QgY3JlYXRlT3B0aW9ucyA9IChvcHRpb25zQ3JlYXRvciwgZXZlbnRDb250ZXh0KSA9PiB7XG4gICAgaWYgKCFvcHRpb25zQ3JlYXRvcikgcmV0dXJuIHt9O1xuICAgIGNvbnN0IGNyZWF0ZSA9IGNvbXBpbGVDb2RlKG9wdGlvbnNDcmVhdG9yKTtcbiAgICByZXR1cm4gY3JlYXRlKHsgY29udGV4dDogZXZlbnRDb250ZXh0LCBhcGlzIH0pO1xuICB9O1xuXG4gIGNvbnN0IHNob3VsZFJ1blRyaWdnZXIgPSAodHJpZ2dlciwgZXZlbnRDb250ZXh0KSA9PiB7XG4gICAgaWYgKCF0cmlnZ2VyLmNvbmRpdGlvbikgcmV0dXJuIHRydWU7XG4gICAgY29uc3Qgc2hvdWxkUnVuID0gY29tcGlsZUV4cHJlc3Npb24odHJpZ2dlci5jb25kaXRpb24pO1xuICAgIHJldHVybiBzaG91bGRSdW4oeyBjb250ZXh0OiBldmVudENvbnRleHQgfSk7XG4gIH07XG5cbiAgZm9yIChsZXQgdHJpZyBvZiB0cmlnZ2Vycykge1xuICAgIHN1YnNjcmliZSh0cmlnLmV2ZW50TmFtZSwgYXN5bmMgKGV2LCBjdHgpID0+IHtcbiAgICAgIGlmIChzaG91bGRSdW5UcmlnZ2VyKHRyaWcsIGN0eCkpIHtcbiAgICAgICAgYXdhaXQgX2V4ZWN1dGVBY3Rpb24oXG4gICAgICAgICAgYmVoYXZpb3VyU291cmNlcyxcbiAgICAgICAgICBmaW5kKGEgPT4gYS5uYW1lID09PSB0cmlnLmFjdGlvbk5hbWUpKGFjdGlvbnMpLFxuICAgICAgICAgIGNyZWF0ZU9wdGlvbnModHJpZy5vcHRpb25zQ3JlYXRvciwgY3R4KSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufTtcblxuY29uc3QgdmFsaWRhdGVTb3VyY2VzID0gKGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMpID0+IHtcbiAgY29uc3QgZGVjbGFyZWRTb3VyY2VzID0gJChhY3Rpb25zLCBbXG4gICAgdW5pcUJ5KGEgPT4gYS5iZWhhdmlvdXJTb3VyY2UpLFxuICAgIG1hcChhID0+IGEuYmVoYXZpb3VyU291cmNlKSxcbiAgXSk7XG5cbiAgY29uc3Qgc3VwcGxpZWRTb3VyY2VzID0ga2V5cyhiZWhhdmlvdXJTb3VyY2VzKTtcblxuICBjb25zdCBtaXNzaW5nU291cmNlcyA9IGRpZmZlcmVuY2UoXG4gICAgZGVjbGFyZWRTb3VyY2VzLCBzdXBwbGllZFNvdXJjZXMsXG4gICk7XG5cbiAgaWYgKG1pc3NpbmdTb3VyY2VzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBEZWNsYXJlZCBiZWhhdmlvdXIgc291cmNlcyBhcmUgbm90IHN1cHBsaWVkOiAke2pvaW4oJywgJywgbWlzc2luZ1NvdXJjZXMpfWApO1xuICB9XG5cbiAgY29uc3QgbWlzc2luZ0JlaGF2aW91cnMgPSAkKGFjdGlvbnMsIFtcbiAgICBmaWx0ZXIoYSA9PiAhaXNGdW5jdGlvbihiZWhhdmlvdXJTb3VyY2VzW2EuYmVoYXZpb3VyU291cmNlXVthLmJlaGF2aW91ck5hbWVdKSksXG4gICAgbWFwKGEgPT4gYEFjdGlvbjogJHthLm5hbWV9IDogJHthLmJlaGF2aW91clNvdXJjZX0uJHthLmJlaGF2aW91ck5hbWV9YCksXG4gIF0pO1xuXG4gIGlmIChtaXNzaW5nQmVoYXZpb3Vycy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoYE1pc3NpbmcgYmVoYXZpb3VyczogY291bGQgbm90IGZpbmQgYmVoYXZpb3VyIGZ1bmN0aW9uczogJHtqb2luKCcsICcsIG1pc3NpbmdCZWhhdmlvdXJzKX1gKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIG1hcCwgZmlsdGVyLCBncm91cEJ5LCBzcGxpdCxcbiAgc29tZSwgZmluZCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIExPQ0tfRklMRU5BTUUsIFRSQU5TQUNUSU9OU19GT0xERVIsIGlkU2VwLCBpc1VwZGF0ZSxcbiAgbm9kZUtleUhhc2hGcm9tQnVpbGRGb2xkZXIsIGlzQnVpbGRJbmRleEZvbGRlciwgZ2V0VHJhbnNhY3Rpb25JZCxcbiAgaXNEZWxldGUsIGlzQ3JlYXRlLFxufSBmcm9tICcuL3RyYW5zYWN0aW9uc0NvbW1vbic7XG5pbXBvcnQge1xuICBqb2luS2V5LCAkLCBub25lLCBpc1NvbWV0aGluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldExhc3RQYXJ0SW5LZXksIGdldE5vZGVGcm9tTm9kZUtleUhhc2ggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgX2xvYWQgfSBmcm9tICcuLi9yZWNvcmRBcGkvbG9hZCc7XG5cbmV4cG9ydCBjb25zdCByZXRyaWV2ZSA9IGFzeW5jIChhcHApID0+IHtcbiAgY29uc3QgdHJhbnNhY3Rpb25GaWxlcyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0Rm9sZGVyQ29udGVudHMoXG4gICAgVFJBTlNBQ1RJT05TX0ZPTERFUixcbiAgKTtcblxuICBsZXQgdHJhbnNhY3Rpb25zID0gW107XG5cbiAgaWYgKHNvbWUoaXNCdWlsZEluZGV4Rm9sZGVyKSh0cmFuc2FjdGlvbkZpbGVzKSkge1xuICAgIGNvbnN0IGJ1aWxkSW5kZXhGb2xkZXIgPSBmaW5kKGlzQnVpbGRJbmRleEZvbGRlcikodHJhbnNhY3Rpb25GaWxlcyk7XG5cbiAgICB0cmFuc2FjdGlvbnMgPSBhd2FpdCByZXRyaWV2ZUJ1aWxkSW5kZXhUcmFuc2FjdGlvbnMoXG4gICAgICBhcHAsXG4gICAgICBqb2luS2V5KFRSQU5TQUNUSU9OU19GT0xERVIsIGJ1aWxkSW5kZXhGb2xkZXIpLFxuICAgICk7XG4gIH1cblxuICBpZiAodHJhbnNhY3Rpb25zLmxlbmd0aCA+IDApIHJldHVybiB0cmFuc2FjdGlvbnM7XG5cbiAgcmV0dXJuIGF3YWl0IHJldHJpZXZlU3RhbmRhcmRUcmFuc2FjdGlvbnMoXG4gICAgYXBwLCB0cmFuc2FjdGlvbkZpbGVzLFxuICApO1xufTtcblxuY29uc3QgcmV0cmlldmVCdWlsZEluZGV4VHJhbnNhY3Rpb25zID0gYXN5bmMgKGFwcCwgYnVpbGRJbmRleEZvbGRlcikgPT4ge1xuICBjb25zdCBjaGlsZEZvbGRlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZvbGRlckNvbnRlbnRzKGJ1aWxkSW5kZXhGb2xkZXIpO1xuICBpZiAoY2hpbGRGb2xkZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgIC8vIGNsZWFudXBcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihidWlsZEluZGV4Rm9sZGVyKTtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCBnZXRUcmFuc2FjdGlvbkZpbGVzID0gYXN5bmMgKGNoaWxkRm9sZGVySW5kZXggPSAwKSA9PiB7XG4gICAgaWYgKGNoaWxkRm9sZGVySW5kZXggPj0gY2hpbGRGb2xkZXJzLmxlbmd0aCkgcmV0dXJuIFtdO1xuXG4gICAgY29uc3QgY2hpbGRGb2xkZXJLZXkgPSBqb2luS2V5KGJ1aWxkSW5kZXhGb2xkZXIsIGNoaWxkRm9sZGVyc1tjaGlsZEZvbGRlckluZGV4XSk7XG4gICAgY29uc3QgZmlsZXMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZvbGRlckNvbnRlbnRzKFxuICAgICAgY2hpbGRGb2xkZXJLZXksXG4gICAgKTtcblxuICAgIGlmIChmaWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKGNoaWxkRm9sZGVyS2V5KTtcbiAgICAgIHJldHVybiBhd2FpdCBnZXRUcmFuc2FjdGlvbkZpbGVzKGNoaWxkRm9sZGVySW5kZXggKyAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBjaGlsZEZvbGRlcktleSwgZmlsZXMgfTtcbiAgfTtcblxuICBjb25zdCB0cmFuc2FjdGlvbkZpbGVzID0gYXdhaXQgZ2V0VHJhbnNhY3Rpb25GaWxlcygpO1xuXG4gIGlmICh0cmFuc2FjdGlvbkZpbGVzLmZpbGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IHRyYW5zYWN0aW9ucyA9ICQodHJhbnNhY3Rpb25GaWxlcy5maWxlcywgW1xuICAgIG1hcChwYXJzZVRyYW5zYWN0aW9uSWQpLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IHQgb2YgdHJhbnNhY3Rpb25zKSB7XG4gICAgY29uc3QgdHJhbnNhY3Rpb25Db250ZW50ID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICAgIGpvaW5LZXkoXG4gICAgICAgIHRyYW5zYWN0aW9uRmlsZXMuY2hpbGRGb2xkZXJLZXksXG4gICAgICAgIHQuZnVsbElkLFxuICAgICAgKSxcbiAgICApO1xuICAgIHQucmVjb3JkID0gYXdhaXQgX2xvYWQoYXBwLCB0cmFuc2FjdGlvbkNvbnRlbnQucmVjb3JkS2V5KTtcbiAgfVxuXG4gIHRyYW5zYWN0aW9ucy5pbmRleE5vZGUgPSAkKGJ1aWxkSW5kZXhGb2xkZXIsIFtcbiAgICBnZXRMYXN0UGFydEluS2V5LFxuICAgIG5vZGVLZXlIYXNoRnJvbUJ1aWxkRm9sZGVyLFxuICAgIGdldE5vZGVGcm9tTm9kZUtleUhhc2goYXBwLmhpZXJhcmNoeSksXG4gIF0pO1xuXG4gIHRyYW5zYWN0aW9ucy5mb2xkZXJLZXkgPSB0cmFuc2FjdGlvbkZpbGVzLmNoaWxkRm9sZGVyS2V5O1xuXG4gIHJldHVybiB0cmFuc2FjdGlvbnM7XG59O1xuXG5jb25zdCByZXRyaWV2ZVN0YW5kYXJkVHJhbnNhY3Rpb25zID0gYXN5bmMgKGFwcCwgdHJhbnNhY3Rpb25GaWxlcykgPT4ge1xuICBjb25zdCB0cmFuc2FjdGlvbklkcyA9ICQodHJhbnNhY3Rpb25GaWxlcywgW1xuICAgIGZpbHRlcihmID0+IGYgIT09IExPQ0tfRklMRU5BTUVcbiAgICAgICAgICAgICAgICAgICAgJiYgIWlzQnVpbGRJbmRleEZvbGRlcihmKSksXG4gICAgbWFwKHBhcnNlVHJhbnNhY3Rpb25JZCksXG4gIF0pO1xuXG4gIGNvbnN0IHRyYW5zYWN0aW9uSWRzQnlSZWNvcmQgPSAkKHRyYW5zYWN0aW9uSWRzLCBbXG4gICAgZ3JvdXBCeSgncmVjb3JkSWQnKSxcbiAgXSk7XG5cbiAgY29uc3QgZGVkdXBlZFRyYW5zYWN0aW9ucyA9IFtdO1xuXG4gIGNvbnN0IHZlcmlmeSA9IGFzeW5jICh0KSA9PiB7XG4gICAgaWYgKHQudmVyaWZpZWQgPT09IHRydWUpIHJldHVybiB0O1xuXG4gICAgY29uc3QgaWQgPSBnZXRUcmFuc2FjdGlvbklkKFxuICAgICAgdC5yZWNvcmRJZCxcbiAgICAgIHQudHJhbnNhY3Rpb25UeXBlLFxuICAgICAgdC51bmlxdWVJZCxcbiAgICApO1xuXG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgICAgam9pbktleShUUkFOU0FDVElPTlNfRk9MREVSLCBpZCksXG4gICAgKTtcblxuICAgIGlmIChpc0RlbGV0ZSh0KSkge1xuICAgICAgdC5yZWNvcmQgPSB0cmFuc2FjdGlvbi5yZWNvcmQ7XG4gICAgICB0LnZlcmlmaWVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0O1xuICAgIH1cblxuICAgIGNvbnN0IHJlYyA9IGF3YWl0IF9sb2FkKFxuICAgICAgYXBwLFxuICAgICAgdHJhbnNhY3Rpb24ucmVjb3JkS2V5LFxuICAgICk7XG4gICAgaWYgKHJlYy50cmFuc2FjdGlvbklkID09PSBpZCkge1xuICAgICAgdC5yZWNvcmQgPSByZWM7XG4gICAgICBpZiAodHJhbnNhY3Rpb24ub2xkUmVjb3JkKSB7IHQub2xkUmVjb3JkID0gdHJhbnNhY3Rpb24ub2xkUmVjb3JkOyB9XG4gICAgICB0LnZlcmlmaWVkID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdC52ZXJpZmllZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0O1xuICB9O1xuXG4gIGNvbnN0IHBpY2tPbmUgPSBhc3luYyAodHJhbnMsIGZvclR5cGUpID0+IHtcbiAgICBjb25zdCB0cmFuc0ZvclR5cGUgPSBmaWx0ZXIoZm9yVHlwZSkodHJhbnMpO1xuICAgIGlmICh0cmFuc0ZvclR5cGUubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCB0ID0gYXdhaXQgdmVyaWZ5KHRyYW5zRm9yVHlwZVswXSk7XG4gICAgICByZXR1cm4gKHQudmVyaWZpZWQgPT09IHRydWUgPyB0IDogbnVsbCk7XG4gICAgfVxuICAgIGZvciAobGV0IHQgb2YgdHJhbnNGb3JUeXBlKSB7XG4gICAgICB0ID0gYXdhaXQgdmVyaWZ5KHQpO1xuICAgICAgaWYgKHQudmVyaWZpZWQgPT09IHRydWUpIHsgcmV0dXJuIHQ7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICBmb3IgKGNvbnN0IHJlY29yZElkIGluIHRyYW5zYWN0aW9uSWRzQnlSZWNvcmQpIHtcbiAgICBjb25zdCB0cmFuc0lkc0ZvclJlY29yZCA9IHRyYW5zYWN0aW9uSWRzQnlSZWNvcmRbcmVjb3JkSWRdO1xuICAgIGlmICh0cmFuc0lkc0ZvclJlY29yZC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNvbnN0IHQgPSBhd2FpdCB2ZXJpZnkodHJhbnNJZHNGb3JSZWNvcmRbMF0pO1xuICAgICAgaWYgKHQudmVyaWZpZWQpIHsgZGVkdXBlZFRyYW5zYWN0aW9ucy5wdXNoKHQpOyB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHNvbWUoaXNEZWxldGUpKHRyYW5zSWRzRm9yUmVjb3JkKSkge1xuICAgICAgY29uc3QgdCA9IGF3YWl0IHZlcmlmeShmaW5kKGlzRGVsZXRlKSh0cmFuc0lkc0ZvclJlY29yZCkpO1xuICAgICAgaWYgKHQudmVyaWZpZWQpIHsgZGVkdXBlZFRyYW5zYWN0aW9ucy5wdXNoKHQpOyB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHNvbWUoaXNVcGRhdGUpKHRyYW5zSWRzRm9yUmVjb3JkKSkge1xuICAgICAgY29uc3QgdXBkID0gYXdhaXQgcGlja09uZSh0cmFuc0lkc0ZvclJlY29yZCwgaXNVcGRhdGUpO1xuICAgICAgaWYgKGlzU29tZXRoaW5nKHVwZCkgJiYgdXBkLnZlcmlmaWVkKSB7IGRlZHVwZWRUcmFuc2FjdGlvbnMucHVzaCh1cGQpOyB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHNvbWUoaXNDcmVhdGUpKHRyYW5zSWRzRm9yUmVjb3JkKSkge1xuICAgICAgY29uc3QgY3JlID0gYXdhaXQgcGlja09uZSh0cmFuc0lkc0ZvclJlY29yZCwgaXNDcmVhdGUpO1xuICAgICAgaWYgKGlzU29tZXRoaW5nKGNyZSkpIHsgZGVkdXBlZFRyYW5zYWN0aW9ucy5wdXNoKGNyZSk7IH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGR1cGxpY2F0ZXMgPSAkKHRyYW5zYWN0aW9uSWRzLCBbXG4gICAgZmlsdGVyKHQgPT4gbm9uZShkZHQgPT4gZGR0LnVuaXF1ZUlkID09PSB0LnVuaXF1ZUlkKShkZWR1cGVkVHJhbnNhY3Rpb25zKSksXG4gIF0pO1xuXG5cbiAgY29uc3QgZGVsZXRlUHJvbWlzZXMgPSBtYXAodCA9PiBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoXG4gICAgam9pbktleShcbiAgICAgIFRSQU5TQUNUSU9OU19GT0xERVIsXG4gICAgICBnZXRUcmFuc2FjdGlvbklkKFxuICAgICAgICB0LnJlY29yZElkLFxuICAgICAgICB0LnRyYW5zYWN0aW9uVHlwZSxcbiAgICAgICAgdC51bmlxdWVJZCxcbiAgICAgICksXG4gICAgKSxcbiAgKSkoZHVwbGljYXRlcyk7XG5cbiAgYXdhaXQgUHJvbWlzZS5hbGwoZGVsZXRlUHJvbWlzZXMpO1xuXG4gIHJldHVybiBkZWR1cGVkVHJhbnNhY3Rpb25zO1xufTtcblxuY29uc3QgcGFyc2VUcmFuc2FjdGlvbklkID0gKGlkKSA9PiB7XG4gIGNvbnN0IHNwbGl0SWQgPSBzcGxpdChpZFNlcCkoaWQpO1xuICByZXR1cm4gKHtcbiAgICByZWNvcmRJZDogc3BsaXRJZFswXSxcbiAgICB0cmFuc2FjdGlvblR5cGU6IHNwbGl0SWRbMV0sXG4gICAgdW5pcXVlSWQ6IHNwbGl0SWRbMl0sXG4gICAgZnVsbElkOiBpZCxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgb3JkZXJCeSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICByZWR1Y2UsIGZpbmQsIGluY2x1ZGVzLCBmbGF0dGVuLCB1bmlvbixcbiAgZmlsdGVyLCBlYWNoLCBtYXAsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBqb2luS2V5LCBzcGxpdEtleSwgaXNOb25FbXB0eVN0cmluZyxcbiAgaXNOb3RoaW5nLCAkLCBpc1NvbWV0aGluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSwgZ2V0Tm9kZSwgZ2V0UmVjb3JkTm9kZUlkLFxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLCByZWNvcmROb2RlSWRJc0FsbG93ZWQsXG4gIGlzUmVjb3JkLCBpc0dsb2JhbEluZGV4LFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgaW5kZXhUeXBlcyB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2luZGV4ZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVsZXZhbnRBbmNlc3RvckluZGV4ZXMgPSAoYXBwSGllcmFyY2h5LCByZWNvcmQpID0+IHtcbiAgY29uc3Qga2V5ID0gcmVjb3JkLmtleTtcbiAgY29uc3Qga2V5UGFydHMgPSBzcGxpdEtleShrZXkpO1xuICBjb25zdCBub2RlSWQgPSBnZXRSZWNvcmROb2RlSWQoa2V5KTtcblxuICBjb25zdCBmbGF0SGllcmFyY2h5ID0gb3JkZXJCeShnZXRGbGF0dGVuZWRIaWVyYXJjaHkoYXBwSGllcmFyY2h5KSxcbiAgICBbbm9kZSA9PiBub2RlLnBhdGhSZWd4KCkubGVuZ3RoXSxcbiAgICBbJ2Rlc2MnXSk7XG5cbiAgY29uc3QgbWFrZWluZGV4Tm9kZUFuZEtleV9Gb3JBbmNlc3RvckluZGV4ID0gKGluZGV4Tm9kZSwgaW5kZXhLZXkpID0+IG1ha2VJbmRleE5vZGVBbmRLZXkoaW5kZXhOb2RlLCBqb2luS2V5KGluZGV4S2V5LCBpbmRleE5vZGUubmFtZSkpO1xuXG4gIGNvbnN0IHRyYXZlcnNlQW5jZXN0b3JJbmRleGVzSW5QYXRoID0gKCkgPT4gcmVkdWNlKChhY2MsIHBhcnQpID0+IHtcbiAgICBjb25zdCBjdXJyZW50SW5kZXhLZXkgPSBqb2luS2V5KGFjYy5sYXN0SW5kZXhLZXksIHBhcnQpO1xuICAgIGFjYy5sYXN0SW5kZXhLZXkgPSBjdXJyZW50SW5kZXhLZXk7XG4gICAgY29uc3QgdGVzdFBhdGhSZWd4ID0gcCA9PiBuZXcgUmVnRXhwKGAke3AucGF0aFJlZ3goKX0kYCkudGVzdChjdXJyZW50SW5kZXhLZXkpO1xuICAgIGNvbnN0IG5vZGVNYXRjaCA9IGZpbmQodGVzdFBhdGhSZWd4KShmbGF0SGllcmFyY2h5KTtcblxuICAgIGlmIChpc05vdGhpbmcobm9kZU1hdGNoKSkgeyByZXR1cm4gYWNjOyB9XG5cbiAgICBpZiAoIWlzUmVjb3JkKG5vZGVNYXRjaClcbiAgICAgICAgICAgICAgICB8fCBub2RlTWF0Y2guaW5kZXhlcy5sZW5ndGggPT09IDApIHsgcmV0dXJuIGFjYzsgfVxuXG4gICAgY29uc3QgaW5kZXhlcyA9ICQobm9kZU1hdGNoLmluZGV4ZXMsIFtcbiAgICAgIGZpbHRlcihpID0+IGkuaW5kZXhUeXBlID09PSBpbmRleFR5cGVzLmFuY2VzdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAoaS5hbGxvd2VkUmVjb3JkTm9kZUlkcy5sZW5ndGggPT09IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICB8fCBpbmNsdWRlcyhub2RlSWQpKGkuYWxsb3dlZFJlY29yZE5vZGVJZHMpKSksXG4gICAgXSk7XG5cbiAgICBlYWNoKHYgPT4gYWNjLm5vZGVzQW5kS2V5cy5wdXNoKFxuICAgICAgbWFrZWluZGV4Tm9kZUFuZEtleV9Gb3JBbmNlc3RvckluZGV4KHYsIGN1cnJlbnRJbmRleEtleSksXG4gICAgKSkoaW5kZXhlcyk7XG5cbiAgICByZXR1cm4gYWNjO1xuICB9LCB7IGxhc3RJbmRleEtleTogJycsIG5vZGVzQW5kS2V5czogW10gfSkoa2V5UGFydHMpLm5vZGVzQW5kS2V5cztcblxuICBjb25zdCByb290SW5kZXhlcyA9ICQoZmxhdEhpZXJhcmNoeSwgW1xuICAgIGZpbHRlcihuID0+IGlzR2xvYmFsSW5kZXgobikgJiYgcmVjb3JkTm9kZUlkSXNBbGxvd2VkKG4pKG5vZGVJZCkpLFxuICAgIG1hcChpID0+IG1ha2VJbmRleE5vZGVBbmRLZXkoaSwgaS5ub2RlS2V5KCkpKSxcbiAgXSk7XG5cbiAgcmV0dXJuIHVuaW9uKHRyYXZlcnNlQW5jZXN0b3JJbmRleGVzSW5QYXRoKCkpKHJvb3RJbmRleGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRSZWxldmFudFJldmVyc2VSZWZlcmVuY2VJbmRleGVzID0gKGFwcEhpZXJhcmNoeSwgcmVjb3JkKSA9PiAkKHJlY29yZC5rZXksIFtcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHBIaWVyYXJjaHkpLFxuICBuID0+IG4uZmllbGRzLFxuICBmaWx0ZXIoZiA9PiBmLnR5cGUgPT09ICdyZWZlcmVuY2UnXG4gICAgICAgICAgICAgICAgICAgICYmIGlzU29tZXRoaW5nKHJlY29yZFtmLm5hbWVdKVxuICAgICAgICAgICAgICAgICAgICAmJiBpc05vbkVtcHR5U3RyaW5nKHJlY29yZFtmLm5hbWVdLmtleSkpLFxuICBtYXAoZiA9PiAkKGYudHlwZU9wdGlvbnMucmV2ZXJzZUluZGV4Tm9kZUtleXMsIFtcbiAgICBtYXAobiA9PiAoe1xuICAgICAgcmVjb3JkTm9kZTogZ2V0Tm9kZShhcHBIaWVyYXJjaHksIG4pLFxuICAgICAgZmllbGQ6IGYsXG4gICAgfSkpLFxuICBdKSksXG4gIGZsYXR0ZW4sXG4gIG1hcChuID0+IG1ha2VJbmRleE5vZGVBbmRLZXkoXG4gICAgbi5yZWNvcmROb2RlLFxuICAgIGpvaW5LZXkocmVjb3JkW24uZmllbGQubmFtZV0ua2V5LCBuLnJlY29yZE5vZGUubmFtZSksXG4gICkpLFxuXSk7XG5cbmNvbnN0IG1ha2VJbmRleE5vZGVBbmRLZXkgPSAoaW5kZXhOb2RlLCBpbmRleEtleSkgPT4gKHsgaW5kZXhOb2RlLCBpbmRleEtleSB9KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmVsZXZhbnRBbmNlc3RvckluZGV4ZXM7XG4iLCIgIC8vIGFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZGV4NGVyL2pzLXByb21pc2Utd3JpdGFibGVcbiAgLy8gVGhhbmsgeW91IDopIFxuICBleHBvcnQgY29uc3QgcHJvbWlzZVdyaXRlYWJsZVN0cmVhbSA9IHN0cmVhbSA9PiB7XG4gIFxuICAgIGxldCBfZXJyb3JlZDtcbiAgXG4gICAgY29uc3QgX2Vycm9ySGFuZGxlciA9IGVyciA9PiB7XG4gICAgICAgIF9lcnJvcmVkID0gZXJyO1xuICAgIH07XG5cbiAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBfZXJyb3JIYW5kbGVyKTsgICAgXG4gIFxuICAgIGNvbnN0IHdyaXRlID0gY2h1bmsgPT4geyAgXG4gICAgICBsZXQgcmVqZWN0ZWQgPSBmYWxzZTtcbiAgXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoX2Vycm9yZWQpIHtcbiAgICAgICAgICBjb25zdCBlcnIgPSBfZXJyb3JlZDtcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGlmICghc3RyZWFtLndyaXRhYmxlIHx8IHN0cmVhbS5jbG9zZWQgfHwgc3RyZWFtLmRlc3Ryb3llZCkge1xuICAgICAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKFwid3JpdGUgYWZ0ZXIgZW5kXCIpKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3Qgd3JpdGVFcnJvckhhbmRsZXIgPSBlcnIgPT4ge1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJlamVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgc3RyZWFtLm9uY2UoXCJlcnJvclwiLCB3cml0ZUVycm9ySGFuZGxlcik7XG4gIFxuICAgICAgICBjb25zdCBjYW5Xcml0ZSA9IHN0cmVhbS53cml0ZShjaHVuayk7XG4gIFxuICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCB3cml0ZUVycm9ySGFuZGxlcik7XG4gIFxuICAgICAgICBpZiAoY2FuV3JpdGUpIHtcbiAgICAgICAgICBpZiAoIXJlamVjdGVkKSB7XG4gICAgICAgICAgICByZXNvbHZlKGNodW5rLmxlbmd0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IGVyciA9PiB7XG4gICAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICBjb25zdCBkcmFpbkhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHJlc29sdmUoY2h1bmsubGVuZ3RoKTtcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIGNvbnN0IGNsb3NlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVzb2x2ZShjaHVuay5sZW5ndGgpO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgY29uc3QgZmluaXNoSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVzb2x2ZShjaHVuay5sZW5ndGgpO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgY29uc3QgcmVtb3ZlTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiY2xvc2VcIiwgY2xvc2VIYW5kbGVyKTtcbiAgICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImRyYWluXCIsIGRyYWluSGFuZGxlcik7XG4gICAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xuICAgICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZmluaXNoXCIsIGZpbmlzaEhhbmRsZXIpO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgc3RyZWFtLm9uKFwiY2xvc2VcIiwgY2xvc2VIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ub24oXCJkcmFpblwiLCBkcmFpbkhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5vbihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gICAgICAgICAgc3RyZWFtLm9uKFwiZmluaXNoXCIsIGZpbmlzaEhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgXG4gICAgY29uc3QgZW5kID0gKCkgPT4ge1xuICBcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGlmIChfZXJyb3JlZCkge1xuICAgICAgICAgIGNvbnN0IGVyciA9IF9lcnJvcmVkO1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgaWYgKCFzdHJlYW0ud3JpdGFibGUgfHwgc3RyZWFtLmNsb3NlZCB8fCBzdHJlYW0uZGVzdHJveWVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgZmluaXNoSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IChlcnIpID0+IHtcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgcmVtb3ZlTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZmluaXNoXCIsIGZpbmlzaEhhbmRsZXIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBzdHJlYW0ub24oXCJmaW5pc2hcIiwgZmluaXNoSGFuZGxlcik7XG4gICAgICAgIHN0cmVhbS5vbihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gIFxuICAgICAgICBzdHJlYW0uZW5kKCk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiB7d3JpdGUsIGVuZH07XG4gIH1cbiAgXG4gIGV4cG9ydCBkZWZhdWx0IHByb21pc2VXcml0ZWFibGVTdHJlYW1cbiAgIiwiaW1wb3J0IHsgZW5zdXJlU2hhcmROYW1lSXNJblNoYXJkTWFwIH0gZnJvbSAnLi9zaGFyZGluZyc7XG5pbXBvcnQgeyBnZXRJbmRleFdyaXRlciB9IGZyb20gJy4vc2VyaWFsaXplcic7XG5pbXBvcnQgeyBpc1NoYXJkZWRJbmRleCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge3Byb21pc2VXcml0ZWFibGVTdHJlYW19IGZyb20gXCIuL3Byb21pc2VXcml0YWJsZVN0cmVhbVwiO1xuaW1wb3J0IHtwcm9taXNlUmVhZGFibGVTdHJlYW19IGZyb20gXCIuL3Byb21pc2VSZWFkYWJsZVN0cmVhbVwiO1xuXG5leHBvcnQgY29uc3QgYXBwbHlUb1NoYXJkID0gYXN5bmMgKGhpZXJhcmNoeSwgc3RvcmUsIGluZGV4S2V5LFxuICBpbmRleE5vZGUsIGluZGV4U2hhcmRLZXksIHJlY29yZHNUb1dyaXRlLCBrZXlzVG9SZW1vdmUpID0+IHtcbiAgY29uc3QgY3JlYXRlSWZOb3RFeGlzdHMgPSByZWNvcmRzVG9Xcml0ZS5sZW5ndGggPiAwO1xuICBjb25zdCB3cml0ZXIgPSBhd2FpdCBnZXRXcml0ZXIoaGllcmFyY2h5LCBzdG9yZSwgaW5kZXhLZXksIGluZGV4U2hhcmRLZXksIGluZGV4Tm9kZSwgY3JlYXRlSWZOb3RFeGlzdHMpO1xuICBpZiAod3JpdGVyID09PSBTSEFSRF9ERUxFVEVEKSByZXR1cm47XG5cbiAgYXdhaXQgd3JpdGVyLnVwZGF0ZUluZGV4KHJlY29yZHNUb1dyaXRlLCBrZXlzVG9SZW1vdmUpO1xuICBhd2FpdCBzd2FwVGVtcEZpbGVJbihzdG9yZSwgaW5kZXhTaGFyZEtleSk7XG59O1xuXG5jb25zdCBTSEFSRF9ERUxFVEVEID0gJ1NIQVJEX0RFTEVURUQnO1xuY29uc3QgZ2V0V3JpdGVyID0gYXN5bmMgKGhpZXJhcmNoeSwgc3RvcmUsIGluZGV4S2V5LCBpbmRleGVkRGF0YUtleSwgaW5kZXhOb2RlLCBjcmVhdGVJZk5vdEV4aXN0cykgPT4ge1xuICBsZXQgcmVhZGFibGVTdHJlYW0gPSBudWxsO1xuXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleE5vZGUpKSB7XG4gICAgYXdhaXQgZW5zdXJlU2hhcmROYW1lSXNJblNoYXJkTWFwKHN0b3JlLCBpbmRleEtleSwgaW5kZXhlZERhdGFLZXkpO1xuICAgIGlmKCFhd2FpdCBzdG9yZS5leGlzdHMoaW5kZXhlZERhdGFLZXkpKSB7XG4gICAgICBhd2FpdCBzdG9yZS5jcmVhdGVGaWxlKGluZGV4ZWREYXRhS2V5LCBcIlwiKTtcbiAgICB9XG4gIH1cblxuICB0cnkge1xuXG4gICAgcmVhZGFibGVTdHJlYW0gPSBwcm9taXNlUmVhZGFibGVTdHJlYW0oXG4gICAgICAgIGF3YWl0IHN0b3JlLnJlYWRhYmxlRmlsZVN0cmVhbShpbmRleGVkRGF0YUtleSlcbiAgICApO1xuXG4gIH0gY2F0Y2ggKGUpIHtcblxuICAgIGlmIChhd2FpdCBzdG9yZS5leGlzdHMoaW5kZXhlZERhdGFLZXkpKSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY3JlYXRlSWZOb3RFeGlzdHMpIHsgXG4gICAgICAgIGF3YWl0IHN0b3JlLmNyZWF0ZUZpbGUoaW5kZXhlZERhdGFLZXksICcnKTsgXG4gICAgICB9IGVsc2UgeyBcbiAgICAgICAgcmV0dXJuIFNIQVJEX0RFTEVURUQ7IFxuICAgICAgfVxuXG4gICAgICByZWFkYWJsZVN0cmVhbSA9IHByb21pc2VSZWFkYWJsZVN0cmVhbShcbiAgICAgICAgICBhd2FpdCBzdG9yZS5yZWFkYWJsZUZpbGVTdHJlYW0oaW5kZXhlZERhdGFLZXkpXG4gICAgICApO1xuXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgd3JpdGFibGVTdHJlYW0gPSBwcm9taXNlV3JpdGVhYmxlU3RyZWFtKFxuICAgICAgYXdhaXQgc3RvcmUud3JpdGFibGVGaWxlU3RyZWFtKGluZGV4ZWREYXRhS2V5ICsgXCIudGVtcFwiKVxuICApO1xuXG4gIHJldHVybiBnZXRJbmRleFdyaXRlcihcbiAgICBoaWVyYXJjaHksIGluZGV4Tm9kZSxcbiAgICAgICAgcmVhZGFibGVTdHJlYW0sIHdyaXRhYmxlU3RyZWFtXG4gICk7XG59O1xuXG5jb25zdCBzd2FwVGVtcEZpbGVJbiA9IGFzeW5jIChzdG9yZSwgaW5kZXhlZERhdGFLZXksIGlzUmV0cnkgPSBmYWxzZSkgPT4ge1xuICBjb25zdCB0ZW1wRmlsZSA9IGAke2luZGV4ZWREYXRhS2V5fS50ZW1wYDtcbiAgdHJ5IHtcbiAgICBhd2FpdCBzdG9yZS5kZWxldGVGaWxlKGluZGV4ZWREYXRhS2V5KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIGlnbm9yZSBmYWlsdXJlLCBpbmNhc2UgaXQgaGFzIG5vdCBiZWVuIGNyZWF0ZWQgeWV0XG4gIH1cbiAgdHJ5IHtcbiAgICBhd2FpdCBzdG9yZS5yZW5hbWVGaWxlKHRlbXBGaWxlLCBpbmRleGVkRGF0YUtleSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyByZXRyeWluZyBpbiBjYXNlIGRlbGV0ZSBmYWlsdXJlIHdhcyBmb3Igc29tZSBvdGhlciByZWFzb25cbiAgICBpZiAoIWlzUmV0cnkpIHtcbiAgICAgIGF3YWl0IHN3YXBUZW1wRmlsZUluKHN0b3JlLCBpbmRleGVkRGF0YUtleSwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBzd2FwIGluIGluZGV4IGZpbGVkOiBcIiArIGUubWVzc2FnZSk7XG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgZmlsdGVyLCBtYXAsIGlzVW5kZWZpbmVkLCBpbmNsdWRlcyxcbiAgZmxhdHRlbiwgaW50ZXJzZWN0aW9uQnksXG4gIGlzRXF1YWwsIHB1bGwsIGtleXMsXG4gIGRpZmZlcmVuY2VCeSwgZGlmZmVyZW5jZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHVuaW9uIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7XG4gIGdldFJlbGV2YW50QW5jZXN0b3JJbmRleGVzLFxuICBnZXRSZWxldmFudFJldmVyc2VSZWZlcmVuY2VJbmRleGVzLFxufSBmcm9tICcuLi9pbmRleGluZy9yZWxldmFudCc7XG5pbXBvcnQgeyBldmFsdWF0ZSB9IGZyb20gJy4uL2luZGV4aW5nL2V2YWx1YXRlJztcbmltcG9ydCB7XG4gICQsIGlzU29tZXRoaW5nLFxuICBpc05vbkVtcHR5QXJyYXksIGpvaW5LZXksXG4gIGlzTm9uRW1wdHlTdHJpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXRJbmRleGVkRGF0YUtleSB9IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcbmltcG9ydCB7XG4gIGlzVXBkYXRlLCBpc0NyZWF0ZSxcbiAgaXNEZWxldGUsIGlzQnVpbGRJbmRleCxcbn0gZnJvbSAnLi90cmFuc2FjdGlvbnNDb21tb24nO1xuaW1wb3J0IHsgYXBwbHlUb1NoYXJkIH0gZnJvbSAnLi4vaW5kZXhpbmcvYXBwbHknO1xuaW1wb3J0IHtcbiAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQsXG4gIGlzR2xvYmFsSW5kZXgsIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4LCBpc1JlZmVyZW5jZUluZGV4LFxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuXG5leHBvcnQgY29uc3QgZXhlY3V0ZVRyYW5zYWN0aW9ucyA9IGFwcCA9PiBhc3luYyAodHJhbnNhY3Rpb25zKSA9PiB7XG4gIGNvbnN0IHJlY29yZHNCeVNoYXJkID0gbWFwcGVkUmVjb3Jkc0J5SW5kZXhTaGFyZChhcHAuaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMpO1xuXG4gIGZvciAoY29uc3Qgc2hhcmQgb2Yga2V5cyhyZWNvcmRzQnlTaGFyZCkpIHtcbiAgICBhd2FpdCBhcHBseVRvU2hhcmQoXG4gICAgICBhcHAuaGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlLFxuICAgICAgcmVjb3Jkc0J5U2hhcmRbc2hhcmRdLmluZGV4S2V5LFxuICAgICAgcmVjb3Jkc0J5U2hhcmRbc2hhcmRdLmluZGV4Tm9kZSxcbiAgICAgIHNoYXJkLFxuICAgICAgcmVjb3Jkc0J5U2hhcmRbc2hhcmRdLndyaXRlcyxcbiAgICAgIHJlY29yZHNCeVNoYXJkW3NoYXJkXS5yZW1vdmVzLFxuICAgICk7XG4gIH1cbn07XG5cbmNvbnN0IG1hcHBlZFJlY29yZHNCeUluZGV4U2hhcmQgPSAoaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMpID0+IHtcbiAgY29uc3QgdXBkYXRlcyA9IGdldFVwZGF0ZVRyYW5zYWN0aW9uc0J5U2hhcmQoXG4gICAgaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMsXG4gICk7XG5cbiAgY29uc3QgY3JlYXRlZCA9IGdldENyZWF0ZVRyYW5zYWN0aW9uc0J5U2hhcmQoXG4gICAgaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMsXG4gICk7XG4gIGNvbnN0IGRlbGV0ZXMgPSBnZXREZWxldGVUcmFuc2FjdGlvbnNCeVNoYXJkKFxuICAgIGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zLFxuICApO1xuXG4gIGNvbnN0IGluZGV4QnVpbGQgPSBnZXRCdWlsZEluZGV4VHJhbnNhY3Rpb25zQnlTaGFyZChcbiAgICBoaWVyYXJjaHksXG4gICAgdHJhbnNhY3Rpb25zLFxuICApO1xuXG4gIGNvbnN0IHRvUmVtb3ZlID0gW1xuICAgIC4uLmRlbGV0ZXMsXG4gICAgLi4udXBkYXRlcy50b1JlbW92ZSxcbiAgXTtcblxuICBjb25zdCB0b1dyaXRlID0gW1xuICAgIC4uLmNyZWF0ZWQsXG4gICAgLi4udXBkYXRlcy50b1dyaXRlLFxuICAgIC4uLmluZGV4QnVpbGQsXG4gIF07XG5cbiAgY29uc3QgdHJhbnNCeVNoYXJkID0ge307XG5cbiAgY29uc3QgaW5pdGlhbGlzZVNoYXJkID0gKHQpID0+IHtcbiAgICBpZiAoaXNVbmRlZmluZWQodHJhbnNCeVNoYXJkW3QuaW5kZXhTaGFyZEtleV0pKSB7XG4gICAgICB0cmFuc0J5U2hhcmRbdC5pbmRleFNoYXJkS2V5XSA9IHtcbiAgICAgICAgd3JpdGVzOiBbXSxcbiAgICAgICAgcmVtb3ZlczogW10sXG4gICAgICAgIGluZGV4S2V5OiB0LmluZGV4S2V5LFxuICAgICAgICBpbmRleE5vZGVLZXk6IHQuaW5kZXhOb2RlS2V5LFxuICAgICAgICBpbmRleE5vZGU6IHQuaW5kZXhOb2RlLFxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cbiAgZm9yIChjb25zdCB0cmFucyBvZiB0b1dyaXRlKSB7XG4gICAgaW5pdGlhbGlzZVNoYXJkKHRyYW5zKTtcbiAgICB0cmFuc0J5U2hhcmRbdHJhbnMuaW5kZXhTaGFyZEtleV0ud3JpdGVzLnB1c2goXG4gICAgICB0cmFucy5tYXBwZWRSZWNvcmQucmVzdWx0LFxuICAgICk7XG4gIH1cblxuICBmb3IgKGNvbnN0IHRyYW5zIG9mIHRvUmVtb3ZlKSB7XG4gICAgaW5pdGlhbGlzZVNoYXJkKHRyYW5zKTtcbiAgICB0cmFuc0J5U2hhcmRbdHJhbnMuaW5kZXhTaGFyZEtleV0ucmVtb3Zlcy5wdXNoKFxuICAgICAgdHJhbnMubWFwcGVkUmVjb3JkLnJlc3VsdC5rZXksXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiB0cmFuc0J5U2hhcmQ7XG59O1xuXG5jb25zdCBnZXRVcGRhdGVUcmFuc2FjdGlvbnNCeVNoYXJkID0gKGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKSA9PiB7XG4gIGNvbnN0IHVwZGF0ZVRyYW5zYWN0aW9ucyA9ICQodHJhbnNhY3Rpb25zLCBbZmlsdGVyKGlzVXBkYXRlKV0pO1xuXG4gIGNvbnN0IGV2YWx1YXRlSW5kZXggPSAocmVjb3JkLCBpbmRleE5vZGVBbmRQYXRoKSA9PiB7XG4gICAgY29uc3QgbWFwcGVkUmVjb3JkID0gZXZhbHVhdGUocmVjb3JkKShpbmRleE5vZGVBbmRQYXRoLmluZGV4Tm9kZSk7XG4gICAgcmV0dXJuICh7XG4gICAgICBtYXBwZWRSZWNvcmQsXG4gICAgICBpbmRleE5vZGU6IGluZGV4Tm9kZUFuZFBhdGguaW5kZXhOb2RlLFxuICAgICAgaW5kZXhLZXk6IGluZGV4Tm9kZUFuZFBhdGguaW5kZXhLZXksXG4gICAgICBpbmRleFNoYXJkS2V5OiBnZXRJbmRleGVkRGF0YUtleShcbiAgICAgICAgaW5kZXhOb2RlQW5kUGF0aC5pbmRleE5vZGUsXG4gICAgICAgIGluZGV4Tm9kZUFuZFBhdGguaW5kZXhLZXksXG4gICAgICAgIG1hcHBlZFJlY29yZC5yZXN1bHQsXG4gICAgICApLFxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGdldEluZGV4Tm9kZXNUb0FwcGx5ID0gaW5kZXhGaWx0ZXIgPT4gKHQsIGluZGV4ZXMpID0+ICQoaW5kZXhlcywgW1xuICAgIG1hcChuID0+ICh7XG4gICAgICBvbGQ6IGV2YWx1YXRlSW5kZXgodC5vbGRSZWNvcmQsIG4pLFxuICAgICAgbmV3OiBldmFsdWF0ZUluZGV4KHQucmVjb3JkLCBuKSxcbiAgICB9KSksXG4gICAgZmlsdGVyKGluZGV4RmlsdGVyKSxcbiAgXSk7XG5cbiAgY29uc3QgdG9SZW1vdmVGaWx0ZXIgPSAobiwgaXNVbnJlZmVyZW5jZWQpID0+IG4ub2xkLm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IHRydWVcbiAgICAgICAgJiYgKG4ubmV3Lm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IGZhbHNlXG4gICAgICAgICAgICB8fCBpc1VucmVmZXJlbmNlZCk7XG5cbiAgY29uc3QgdG9BZGRGaWx0ZXIgPSAobiwgaXNOZXdseVJlZmVyZW5jZWQpID0+IChuLm9sZC5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSBmYWxzZVxuICAgICAgICB8fCBpc05ld2x5UmVmZXJlbmNlZClcbiAgICAgICAgJiYgbi5uZXcubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gdHJ1ZTtcblxuICBjb25zdCB0b1VwZGF0ZUZpbHRlciA9IG4gPT4gbi5uZXcubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gdHJ1ZVxuICAgICAgICAmJiBuLm9sZC5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSB0cnVlXG4gICAgICAgICYmICFpc0VxdWFsKG4ub2xkLm1hcHBlZFJlY29yZC5yZXN1bHQsXG4gICAgICAgICAgbi5uZXcubWFwcGVkUmVjb3JkLnJlc3VsdCk7XG5cbiAgY29uc3QgdG9SZW1vdmUgPSBbXTtcbiAgY29uc3QgdG9Xcml0ZSA9IFtdO1xuXG4gIGZvciAoY29uc3QgdCBvZiB1cGRhdGVUcmFuc2FjdGlvbnMpIHtcbiAgICBjb25zdCBhbmNlc3RvcklkeHMgPSBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcyhcbiAgICAgIGhpZXJhcmNoeSwgdC5yZWNvcmQsXG4gICAgKTtcblxuICAgIGNvbnN0IHJlZmVyZW5jZUNoYW5nZXMgPSBkaWZmUmV2ZXJzZVJlZkZvclVwZGF0ZShcbiAgICAgIGhpZXJhcmNoeSwgdC5vbGRSZWNvcmQsIHQucmVjb3JkLFxuICAgICk7XG5cbiAgICAvLyBvbGQgcmVjb3JkcyB0byByZW1vdmUgKGZpbHRlcmVkIG91dClcbiAgICBjb25zdCBmaWx0ZXJlZE91dF90b1JlbW92ZSA9IHVuaW9uKFxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodG9SZW1vdmVGaWx0ZXIpKHQsIGFuY2VzdG9ySWR4cyksXG4gICAgICAvLyBzdGlsbCByZWZlcmVuY2VkIC0gY2hlY2sgZmlsdGVyXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b1JlbW92ZUZpbHRlcikodCwgcmVmZXJlbmNlQ2hhbmdlcy5ub3RDaGFuZ2VkKSxcbiAgICAgIC8vIHVuIHJlZmVyZW5jZWQgLSByZW1vdmUgaWYgaW4gdGhlcmUgYWxyZWFkeVxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkobiA9PiB0b1JlbW92ZUZpbHRlcihuLCB0cnVlKSkodCwgcmVmZXJlbmNlQ2hhbmdlcy51blJlZmVyZW5jZWQpLFxuICAgICk7XG5cbiAgICAvLyBuZXcgcmVjb3JkcyB0byBhZGQgKGZpbHRlcmVkIGluKVxuICAgIGNvbnN0IGZpbHRlcmVkSW5fdG9BZGQgPSB1bmlvbihcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvQWRkRmlsdGVyKSh0LCBhbmNlc3RvcklkeHMpLFxuICAgICAgLy8gbmV3bHkgcmVmZXJlbmNlZCAtIGNoZWNrIGZpbHRlclxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkobiA9PiB0b0FkZEZpbHRlcihuLCB0cnVlKSkodCwgcmVmZXJlbmNlQ2hhbmdlcy5uZXdseVJlZmVyZW5jZWQpLFxuICAgICAgLy8gcmVmZXJlbmNlIHVuY2hhbmdlZCAtIHJlcnVuIGZpbHRlciBpbiBjYXNlIHNvbWV0aGluZyBlbHNlIGNoYW5nZWRcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvQWRkRmlsdGVyKSh0LCByZWZlcmVuY2VDaGFuZ2VzLm5vdENoYW5nZWQpLFxuICAgICk7XG5cbiAgICBjb25zdCBjaGFuZ2VkID0gdW5pb24oXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b1VwZGF0ZUZpbHRlcikodCwgYW5jZXN0b3JJZHhzKSxcbiAgICAgIC8vIHN0aWxsIHJlZmVyZW5jZWQgLSByZWNoZWNrIGZpbHRlclxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodG9VcGRhdGVGaWx0ZXIpKHQsIHJlZmVyZW5jZUNoYW5nZXMubm90Q2hhbmdlZCksXG4gICAgKTtcblxuICAgIGNvbnN0IHNoYXJkS2V5Q2hhbmdlZCA9ICQoY2hhbmdlZCwgW1xuICAgICAgZmlsdGVyKGMgPT4gYy5vbGQuaW5kZXhTaGFyZEtleSAhPT0gYy5uZXcuaW5kZXhTaGFyZEtleSksXG4gICAgXSk7XG5cbiAgICBjb25zdCBjaGFuZ2VkSW5TYW1lU2hhcmQgPSAkKHNoYXJkS2V5Q2hhbmdlZCwgW1xuICAgICAgZGlmZmVyZW5jZShjaGFuZ2VkKSxcbiAgICBdKTtcblxuICAgIGZvciAoY29uc3QgcmVzIG9mIHNoYXJkS2V5Q2hhbmdlZCkge1xuICAgICAgcHVsbChyZXMpKGNoYW5nZWQpO1xuICAgICAgZmlsdGVyZWRPdXRfdG9SZW1vdmUucHVzaChyZXMpO1xuICAgICAgZmlsdGVyZWRJbl90b0FkZC5wdXNoKHJlcyk7XG4gICAgfVxuXG4gICAgdG9SZW1vdmUucHVzaChcbiAgICAgICQoZmlsdGVyZWRPdXRfdG9SZW1vdmUsIFtcbiAgICAgICAgbWFwKGkgPT4gaS5vbGQpLFxuICAgICAgXSksXG4gICAgKTtcblxuICAgIHRvV3JpdGUucHVzaChcbiAgICAgICQoZmlsdGVyZWRJbl90b0FkZCwgW1xuICAgICAgICBtYXAoaSA9PiBpLm5ldyksXG4gICAgICBdKSxcbiAgICApO1xuXG4gICAgdG9Xcml0ZS5wdXNoKFxuICAgICAgJChjaGFuZ2VkSW5TYW1lU2hhcmQsIFtcbiAgICAgICAgbWFwKGkgPT4gaS5uZXcpLFxuICAgICAgXSksXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiAoe1xuICAgIHRvUmVtb3ZlOiBmbGF0dGVuKHRvUmVtb3ZlKSxcbiAgICB0b1dyaXRlOiBmbGF0dGVuKHRvV3JpdGUpLFxuICB9KTtcbn07XG5cbmNvbnN0IGdldEJ1aWxkSW5kZXhUcmFuc2FjdGlvbnNCeVNoYXJkID0gKGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKSA9PiB7XG4gIGNvbnN0IGJ1aWxkVHJhbnNhY3Rpb25zID0gJCh0cmFuc2FjdGlvbnMsIFtmaWx0ZXIoaXNCdWlsZEluZGV4KV0pO1xuICBpZiAoIWlzTm9uRW1wdHlBcnJheShidWlsZFRyYW5zYWN0aW9ucykpIHJldHVybiBbXTtcbiAgY29uc3QgaW5kZXhOb2RlID0gdHJhbnNhY3Rpb25zLmluZGV4Tm9kZTtcblxuICBjb25zdCBnZXRJbmRleEtleXMgPSAodCkgPT4ge1xuICAgIGlmIChpc0dsb2JhbEluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICAgIHJldHVybiBbaW5kZXhOb2RlLm5vZGVLZXkoKV07XG4gICAgfVxuXG4gICAgaWYgKGlzUmVmZXJlbmNlSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgICAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoaGllcmFyY2h5KSh0LnJlY29yZC5rZXkpO1xuICAgICAgY29uc3QgcmVmRmllbGRzID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICAgICAgICBmaWx0ZXIoZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXgoaW5kZXhOb2RlKSksXG4gICAgICBdKTtcbiAgICAgIGNvbnN0IGluZGV4S2V5cyA9IFtdO1xuICAgICAgZm9yIChjb25zdCByZWZGaWVsZCBvZiByZWZGaWVsZHMpIHtcbiAgICAgICAgY29uc3QgcmVmVmFsdWUgPSB0LnJlY29yZFtyZWZGaWVsZC5uYW1lXTtcbiAgICAgICAgaWYgKGlzU29tZXRoaW5nKHJlZlZhbHVlKVxuICAgICAgICAgICAgICAgICAgICYmIGlzTm9uRW1wdHlTdHJpbmcocmVmVmFsdWUua2V5KSkge1xuICAgICAgICAgIGNvbnN0IGluZGV4S2V5ID0gam9pbktleShcbiAgICAgICAgICAgIHJlZlZhbHVlLmtleSxcbiAgICAgICAgICAgIGluZGV4Tm9kZS5uYW1lLFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAoIWluY2x1ZGVzKGluZGV4S2V5KShpbmRleEtleXMpKSB7IGluZGV4S2V5cy5wdXNoKGluZGV4S2V5KTsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaW5kZXhLZXlzO1xuICAgIH1cblxuICAgIHJldHVybiBbam9pbktleShcbiAgICAgIGdldEFjdHVhbEtleU9mUGFyZW50KFxuICAgICAgICBpbmRleE5vZGUucGFyZW50KCkubm9kZUtleSgpLFxuICAgICAgICB0LnJlY29yZC5rZXksXG4gICAgICApLFxuICAgICAgaW5kZXhOb2RlLm5hbWUsXG4gICAgKV07XG4gIH07XG5cbiAgcmV0dXJuICQoYnVpbGRUcmFuc2FjdGlvbnMsIFtcbiAgICBtYXAoKHQpID0+IHtcbiAgICAgIGNvbnN0IG1hcHBlZFJlY29yZCA9IGV2YWx1YXRlKHQucmVjb3JkKShpbmRleE5vZGUpO1xuICAgICAgaWYgKCFtYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyKSByZXR1cm4gbnVsbDtcbiAgICAgIGNvbnN0IGluZGV4S2V5cyA9IGdldEluZGV4S2V5cyh0KTtcbiAgICAgIHJldHVybiAkKGluZGV4S2V5cywgW1xuICAgICAgICBtYXAoaW5kZXhLZXkgPT4gKHtcbiAgICAgICAgICBtYXBwZWRSZWNvcmQsXG4gICAgICAgICAgaW5kZXhOb2RlLFxuICAgICAgICAgIGluZGV4S2V5LFxuICAgICAgICAgIGluZGV4U2hhcmRLZXk6IGdldEluZGV4ZWREYXRhS2V5KFxuICAgICAgICAgICAgaW5kZXhOb2RlLFxuICAgICAgICAgICAgaW5kZXhLZXksXG4gICAgICAgICAgICBtYXBwZWRSZWNvcmQucmVzdWx0LFxuICAgICAgICAgICksXG4gICAgICAgIH0pKSxcbiAgICAgIF0pO1xuICAgIH0pLFxuICAgIGZsYXR0ZW4sXG4gICAgZmlsdGVyKGlzU29tZXRoaW5nKSxcbiAgXSk7XG59O1xuXG5jb25zdCBnZXRfQ3JlYXRlX0RlbGV0ZV9UcmFuc2FjdGlvbnNCeVNoYXJkID0gcHJlZCA9PiAoaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMpID0+IHtcbiAgY29uc3QgY3JlYXRlVHJhbnNhY3Rpb25zID0gJCh0cmFuc2FjdGlvbnMsIFtmaWx0ZXIocHJlZCldKTtcblxuICBjb25zdCBnZXRJbmRleE5vZGVzVG9BcHBseSA9ICh0LCBpbmRleGVzKSA9PiAkKGluZGV4ZXMsIFtcbiAgICBtYXAoKG4pID0+IHtcbiAgICAgIGNvbnN0IG1hcHBlZFJlY29yZCA9IGV2YWx1YXRlKHQucmVjb3JkKShuLmluZGV4Tm9kZSk7XG4gICAgICByZXR1cm4gKHtcbiAgICAgICAgbWFwcGVkUmVjb3JkLFxuICAgICAgICBpbmRleE5vZGU6IG4uaW5kZXhOb2RlLFxuICAgICAgICBpbmRleEtleTogbi5pbmRleEtleSxcbiAgICAgICAgaW5kZXhTaGFyZEtleTogZ2V0SW5kZXhlZERhdGFLZXkoXG4gICAgICAgICAgbi5pbmRleE5vZGUsXG4gICAgICAgICAgbi5pbmRleEtleSxcbiAgICAgICAgICBtYXBwZWRSZWNvcmQucmVzdWx0LFxuICAgICAgICApLFxuICAgICAgfSk7XG4gICAgfSksXG4gICAgZmlsdGVyKG4gPT4gbi5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyKSxcbiAgXSk7XG5cbiAgY29uc3QgYWxsVG9BcHBseSA9IFtdO1xuXG4gIGZvciAoY29uc3QgdCBvZiBjcmVhdGVUcmFuc2FjdGlvbnMpIHtcbiAgICBjb25zdCBhbmNlc3RvcklkeHMgPSBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcyhoaWVyYXJjaHksIHQucmVjb3JkKTtcbiAgICBjb25zdCByZXZlcnNlUmVmID0gZ2V0UmVsZXZhbnRSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyhoaWVyYXJjaHksIHQucmVjb3JkKTtcblxuICAgIGFsbFRvQXBwbHkucHVzaChcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHQsIGFuY2VzdG9ySWR4cyksXG4gICAgKTtcbiAgICBhbGxUb0FwcGx5LnB1c2goXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0LCByZXZlcnNlUmVmKSxcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIGZsYXR0ZW4oYWxsVG9BcHBseSk7XG59O1xuXG5jb25zdCBnZXREZWxldGVUcmFuc2FjdGlvbnNCeVNoYXJkID0gZ2V0X0NyZWF0ZV9EZWxldGVfVHJhbnNhY3Rpb25zQnlTaGFyZChpc0RlbGV0ZSk7XG5cbmNvbnN0IGdldENyZWF0ZVRyYW5zYWN0aW9uc0J5U2hhcmQgPSBnZXRfQ3JlYXRlX0RlbGV0ZV9UcmFuc2FjdGlvbnNCeVNoYXJkKGlzQ3JlYXRlKTtcblxuY29uc3QgZGlmZlJldmVyc2VSZWZGb3JVcGRhdGUgPSAoYXBwSGllcmFyY2h5LCBvbGRSZWNvcmQsIG5ld1JlY29yZCkgPT4ge1xuICBjb25zdCBvbGRJbmRleGVzID0gZ2V0UmVsZXZhbnRSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyhcbiAgICBhcHBIaWVyYXJjaHksIG9sZFJlY29yZCxcbiAgKTtcbiAgY29uc3QgbmV3SW5kZXhlcyA9IGdldFJlbGV2YW50UmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMoXG4gICAgYXBwSGllcmFyY2h5LCBuZXdSZWNvcmQsXG4gICk7XG5cbiAgY29uc3QgdW5SZWZlcmVuY2VkID0gZGlmZmVyZW5jZUJ5KFxuICAgIGkgPT4gaS5pbmRleEtleSxcbiAgICBvbGRJbmRleGVzLCBuZXdJbmRleGVzLFxuICApO1xuXG4gIGNvbnN0IG5ld2x5UmVmZXJlbmNlZCA9IGRpZmZlcmVuY2VCeShcbiAgICBpID0+IGkuaW5kZXhLZXksXG4gICAgbmV3SW5kZXhlcywgb2xkSW5kZXhlcyxcbiAgKTtcblxuICBjb25zdCBub3RDaGFuZ2VkID0gaW50ZXJzZWN0aW9uQnkoXG4gICAgaSA9PiBpLmluZGV4S2V5LFxuICAgIG5ld0luZGV4ZXMsIG9sZEluZGV4ZXMsXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICB1blJlZmVyZW5jZWQsXG4gICAgbmV3bHlSZWZlcmVuY2VkLFxuICAgIG5vdENoYW5nZWQsXG4gIH07XG59O1xuIiwiaW1wb3J0IHsgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHJldHJpZXZlIH0gZnJvbSAnLi9yZXRyaWV2ZSc7XG5pbXBvcnQgeyBleGVjdXRlVHJhbnNhY3Rpb25zIH0gZnJvbSAnLi9leGVjdXRlJztcbmltcG9ydCB7XG4gICQsIGpvaW5LZXksIGdldExvY2ssIGlzTm9sb2NrLCByZWxlYXNlTG9jayxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIExPQ0tfRklMRV9LRVksIFRSQU5TQUNUSU9OU19GT0xERVIsXG4gIHRpbWVvdXRNaWxsaXNlY29uZHMsIGdldFRyYW5zYWN0aW9uSWQsXG4gIG1heExvY2tSZXRyaWVzLFxufSBmcm9tICcuL3RyYW5zYWN0aW9uc0NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBjbGVhbnVwID0gYXN5bmMgKGFwcCkgPT4ge1xuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0VHJhbnNhY3Rpb25Mb2NrKGFwcCk7XG4gIGlmIChpc05vbG9jayhsb2NrKSkgcmV0dXJuO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgdHJhbnNhY3Rpb25zID0gYXdhaXQgcmV0cmlldmUoYXBwKTtcbiAgICBpZiAodHJhbnNhY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IGV4ZWN1dGVUcmFuc2FjdGlvbnMoYXBwKSh0cmFuc2FjdGlvbnMpO1xuXG4gICAgICBjb25zdCBmb2xkZXIgPSB0cmFuc2FjdGlvbnMuZm9sZGVyS2V5XG4gICAgICAgID8gdHJhbnNhY3Rpb25zLmZvbGRlcktleVxuICAgICAgICA6IFRSQU5TQUNUSU9OU19GT0xERVI7XG5cbiAgICAgIGNvbnN0IGRlbGV0ZUZpbGVzID0gJCh0cmFuc2FjdGlvbnMsIFtcbiAgICAgICAgbWFwKHQgPT4gam9pbktleShcbiAgICAgICAgICBmb2xkZXIsXG4gICAgICAgICAgZ2V0VHJhbnNhY3Rpb25JZChcbiAgICAgICAgICAgIHQucmVjb3JkSWQsIHQudHJhbnNhY3Rpb25UeXBlLFxuICAgICAgICAgICAgdC51bmlxdWVJZCxcbiAgICAgICAgICApLFxuICAgICAgICApKSxcbiAgICAgICAgbWFwKGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZSksXG4gICAgICBdKTtcblxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoZGVsZXRlRmlsZXMpO1xuICAgIH1cbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xuICB9XG59O1xuXG5jb25zdCBnZXRUcmFuc2FjdGlvbkxvY2sgPSBhc3luYyBhcHAgPT4gYXdhaXQgZ2V0TG9jayhcbiAgYXBwLCBMT0NLX0ZJTEVfS0VZLFxuICB0aW1lb3V0TWlsbGlzZWNvbmRzLCBtYXhMb2NrUmV0cmllcyxcbik7XG4iLCJpbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgY29uZmlnRm9sZGVyLCBhcHBEZWZpbml0aW9uRmlsZSwgJCB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBUUkFOU0FDVElPTlNfRk9MREVSIH0gZnJvbSAnLi4vdHJhbnNhY3Rpb25zL3RyYW5zYWN0aW9uc0NvbW1vbic7XG5pbXBvcnQgeyBBVVRIX0ZPTERFUiwgVVNFUlNfTElTVF9GSUxFLCBBQ0NFU1NfTEVWRUxTX0ZJTEUgfSBmcm9tICcuLi9hdXRoQXBpL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgaW5pdGlhbGlzZVJvb3RDb2xsZWN0aW9ucyB9IGZyb20gJy4uL2NvbGxlY3Rpb25BcGkvaW5pdGlhbGlzZSc7XG5pbXBvcnQgeyBpbml0aWFsaXNlSW5kZXggfSBmcm9tICcuLi9pbmRleGluZy9pbml0aWFsaXNlSW5kZXgnO1xuaW1wb3J0IHsgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LCBpc0dsb2JhbEluZGV4LCBpc1NpbmdsZVJlY29yZCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBfc2F2ZSB9IGZyb20gJy4uL3JlY29yZEFwaS9zYXZlJztcbmltcG9ydCB7IGdldE5ldyB9IGZyb20gJy4uL3JlY29yZEFwaS9nZXROZXcnO1xuXG5leHBvcnQgY29uc3QgaW5pdGlhbGlzZURhdGEgPSBhc3luYyAoZGF0YXN0b3JlLCBhcHBsaWNhdGlvbkRlZmluaXRpb24sIGFjY2Vzc0xldmVscykgPT4ge1xuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKGNvbmZpZ0ZvbGRlcik7XG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKGFwcERlZmluaXRpb25GaWxlLCBhcHBsaWNhdGlvbkRlZmluaXRpb24pO1xuXG4gIGF3YWl0IGluaXRpYWxpc2VSb290Q29sbGVjdGlvbnMoZGF0YXN0b3JlLCBhcHBsaWNhdGlvbkRlZmluaXRpb24uaGllcmFyY2h5KTtcbiAgYXdhaXQgaW5pdGlhbGlzZVJvb3RJbmRleGVzKGRhdGFzdG9yZSwgYXBwbGljYXRpb25EZWZpbml0aW9uLmhpZXJhcmNoeSk7XG5cbiAgYXdhaXQgaW5pdGlhbGlzZVJvb3RTaW5nbGVSZWNvcmRzKGRhdGFzdG9yZSwgYXBwbGljYXRpb25EZWZpbml0aW9uLmhpZXJhcmNoeSk7XG5cbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihUUkFOU0FDVElPTlNfRk9MREVSKTtcblxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKEFVVEhfRk9MREVSKTtcblxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlSnNvbihVU0VSU19MSVNUX0ZJTEUsIFtdKTtcblxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlSnNvbihcbiAgICBBQ0NFU1NfTEVWRUxTX0ZJTEUsIFxuICAgIGFjY2Vzc0xldmVscyA/IGFjY2Vzc0xldmVscyA6IHsgdmVyc2lvbjogMCwgbGV2ZWxzOiBbXSB9KTtcbn07XG5cbmNvbnN0IGluaXRpYWxpc2VSb290SW5kZXhlcyA9IGFzeW5jIChkYXRhc3RvcmUsIGhpZXJhcmNoeSkgPT4ge1xuICBjb25zdCBmbGF0aGllcmFyY2h5ID0gZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGhpZXJhcmNoeSk7XG4gIGNvbnN0IGdsb2JhbEluZGV4ZXMgPSAkKGZsYXRoaWVyYXJjaHksIFtcbiAgICBmaWx0ZXIoaXNHbG9iYWxJbmRleCksXG4gIF0pO1xuXG4gIGZvciAoY29uc3QgaW5kZXggb2YgZ2xvYmFsSW5kZXhlcykge1xuICAgIGlmICghYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhpbmRleC5ub2RlS2V5KCkpKSB7IGF3YWl0IGluaXRpYWxpc2VJbmRleChkYXRhc3RvcmUsICcnLCBpbmRleCk7IH1cbiAgfVxufTtcblxuY29uc3QgaW5pdGlhbGlzZVJvb3RTaW5nbGVSZWNvcmRzID0gYXN5bmMgKGRhdGFzdG9yZSwgaGllcmFjaHkpID0+IHtcbiAgY29uc3QgZmxhdGhpZXJhcmNoeSA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShoaWVyYWNoeSk7XG4gIGNvbnN0IHNpbmdsZVJlY29yZHMgPSAkKGZsYXRoaWVyYXJjaHksIFtcbiAgICBmaWx0ZXIoaXNTaW5nbGVSZWNvcmQpLFxuICBdKTtcblxuICAvKiBmb3IgKGxldCByZWNvcmQgb2Ygc2luZ2xlUmVjb3Jkcykge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBnZXROZXcoeyBkYXRhc3RvcmU6IGRhdGFzdG9yZSwgaGllcmFyY2h5OiBhcHBEZWZpbml0aW9uLmhpZXJhcmNoeSB9KVxuICAgICAgICAgICAgKHJlY29yZC5ub2RlS2V5KCksXG4gICAgICAgICAgICAgICAgcmVjb3JkLm5hbWVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgX3NhdmUoeyBkYXRhc3RvcmU6IGRhdGFzdG9yZSwgaGllcmFyY2h5OiBhcHBEZWZpbml0aW9uLmhpZXJhcmNoeSB9LFxuICAgICAgICAgICAgcmVzdWx0XG4gICAgICAgICk7XG4gICAgfSAqL1xufTtcbiIsImltcG9ydCB7IGlzTm90aGluZyB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBnZXREYXRhYmFzZU1hbmFnZXIgPSBkYXRhYmFzZU1hbmFnZXIgPT4gKHtcbiAgY3JlYXRlRW1wdHlNYXN0ZXJEYjogY3JlYXRlRW1wdHlNYXN0ZXJEYihkYXRhYmFzZU1hbmFnZXIpLFxuICBjcmVhdGVFbXB0eUluc3RhbmNlRGI6IGNyZWF0ZUVtcHR5SW5zdGFuY2VEYihkYXRhYmFzZU1hbmFnZXIpLFxuICBnZXRJbnN0YW5jZURiUm9vdENvbmZpZzogZGF0YWJhc2VNYW5hZ2VyLmdldEluc3RhbmNlRGJSb290Q29uZmlnLFxuICBtYXN0ZXJEYXRhc3RvcmVDb25maWc6IGdldE1hc3RlckRhdGFzdG9yZUNvbmZpZyhkYXRhYmFzZU1hbmFnZXIpLFxuICBnZXRJbnN0YW5jZURhdGFzdG9yZUNvbmZpZzogZ2V0SW5zdGFuY2VEYXRhc3RvcmVDb25maWcoZGF0YWJhc2VNYW5hZ2VyKSxcbn0pO1xuXG5jb25zdCBnZXRNYXN0ZXJEYXRhc3RvcmVDb25maWcgPSBkYXRhYmFzZU1hbmFnZXIgPT4gZGF0YWJhc2VNYW5hZ2VyLmdldERhdGFzdG9yZUNvbmZpZygnbWFzdGVyJyk7XG5cbmNvbnN0IGdldEluc3RhbmNlRGF0YXN0b3JlQ29uZmlnID0gZGF0YWJhc2VNYW5hZ2VyID0+IChhcHBsaWNhdGlvbklkLCBpbnN0YW5jZUlkKSA9PiBkYXRhYmFzZU1hbmFnZXIuZ2V0RGF0YXN0b3JlQ29uZmlnKFxuICBhcHBsaWNhdGlvbklkLCBpbnN0YW5jZUlkLFxuKTtcblxuY29uc3QgY3JlYXRlRW1wdHlNYXN0ZXJEYiA9IGRhdGFiYXNlTWFuYWdlciA9PiBhc3luYyAoKSA9PiBhd2FpdCBkYXRhYmFzZU1hbmFnZXIuY3JlYXRlRW1wdHlEYignbWFzdGVyJyk7XG5cbmNvbnN0IGNyZWF0ZUVtcHR5SW5zdGFuY2VEYiA9IGRhdGFiYXNlTWFuYWdlciA9PiBhc3luYyAoYXBwbGljYXRpb25JZCwgaW5zdGFuY2VJZCkgPT4ge1xuICBpZiAoaXNOb3RoaW5nKGFwcGxpY2F0aW9uSWQpKSB7IHRocm93IG5ldyBFcnJvcignQ3JlYXRlRGI6IGFwcGxpY2F0aW9uIGlkIG5vdCBzdXBwbGllZCcpOyB9XG4gIGlmIChpc05vdGhpbmcoaW5zdGFuY2VJZCkpIHsgdGhyb3cgbmV3IEVycm9yKCdDcmVhdGVEYjogaW5zdGFuY2UgaWQgbm90IHN1cHBsaWVkJyk7IH1cblxuICByZXR1cm4gYXdhaXQgZGF0YWJhc2VNYW5hZ2VyLmNyZWF0ZUVtcHR5RGIoXG4gICAgYXBwbGljYXRpb25JZCxcbiAgICBpbnN0YW5jZUlkLFxuICApO1xufTtcbiIsImltcG9ydCBnZXRSZWNvcmRBcGkgZnJvbSBcIi4vcmVjb3JkQXBpXCI7XG5pbXBvcnQgZ2V0Q29sbGVjdGlvbkFwaSBmcm9tIFwiLi9jb2xsZWN0aW9uQXBpXCI7XG5pbXBvcnQgZ2V0SW5kZXhBcGkgZnJvbSBcIi4vaW5kZXhBcGlcIjtcbmltcG9ydCBnZXRUZW1wbGF0ZUFwaSBmcm9tIFwiLi90ZW1wbGF0ZUFwaVwiO1xuaW1wb3J0IGdldEF1dGhBcGkgZnJvbSBcIi4vYXV0aEFwaVwiO1xuaW1wb3J0IGdldEFjdGlvbnNBcGkgZnJvbSBcIi4vYWN0aW9uc0FwaVwiO1xuaW1wb3J0IHtzZXR1cERhdGFzdG9yZSwgY3JlYXRlRXZlbnRBZ2dyZWdhdG9yfSBmcm9tIFwiLi9hcHBJbml0aWFsaXNlXCI7XG5pbXBvcnQge2luaXRpYWxpc2VBY3Rpb25zfSBmcm9tIFwiLi9hY3Rpb25zQXBpL2luaXRpYWxpc2VcIlxuaW1wb3J0IHtpc1NvbWV0aGluZ30gZnJvbSBcIi4vY29tbW9uXCI7XG5pbXBvcnQge2NsZWFudXB9IGZyb20gXCIuL3RyYW5zYWN0aW9ucy9jbGVhbnVwXCI7XG5pbXBvcnQge2dlbmVyYXRlRnVsbFBlcm1pc3Npb25zfSBmcm9tIFwiLi9hdXRoQXBpL2dlbmVyYXRlRnVsbFBlcm1pc3Npb25zXCI7XG5pbXBvcnQge2dldEFwcGxpY2F0aW9uRGVmaW5pdGlvbn0gZnJvbSBcIi4vdGVtcGxhdGVBcGkvZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uXCI7XG5pbXBvcnQgY29tbW9uIGZyb20gXCIuL2NvbW1vblwiO1xuaW1wb3J0IHtnZXRCZWhhdmlvdXJTb3VyY2VzfSBmcm9tIFwiLi90ZW1wbGF0ZUFwaS9nZXRCZWhhdmlvdXJTb3VyY2VzXCI7XG5pbXBvcnQgaGllcmFyY2h5IGZyb20gXCIuL3RlbXBsYXRlQXBpL2hpZXJhcmNoeVwiO1xuXG5leHBvcnQgY29uc3QgZ2V0QXBwQXBpcyA9IGFzeW5jIChzdG9yZSwgYmVoYXZpb3VyU291cmNlcyA9IG51bGwsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhbnVwVHJhbnNhY3Rpb25zID0gbnVsbCwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEVwb2NoVGltZSA9IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyeXB0byA9IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcERlZmluaXRpb24gPSBudWxsKSA9PiB7XG5cbiAgICBzdG9yZSA9IHNldHVwRGF0YXN0b3JlKHN0b3JlKTtcblxuICAgIGlmKCFhcHBEZWZpbml0aW9uKVxuICAgICAgICBhcHBEZWZpbml0aW9uID0gYXdhaXQgZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uKHN0b3JlKSgpO1xuXG4gICAgaWYoIWJlaGF2aW91clNvdXJjZXMpXG4gICAgICAgIGJlaGF2aW91clNvdXJjZXMgPSBhd2FpdCBnZXRCZWhhdmlvdXJTb3VyY2VzKHN0b3JlKTtcblxuICAgIGNvbnN0IGV2ZW50QWdncmVnYXRvciA9IGNyZWF0ZUV2ZW50QWdncmVnYXRvcigpO1xuXG4gICAgY29uc3QgYXBwID0ge1xuICAgICAgICBkYXRhc3RvcmU6c3RvcmUsXG4gICAgICAgIGNyeXB0byxcbiAgICAgICAgcHVibGlzaDpldmVudEFnZ3JlZ2F0b3IucHVibGlzaCxcbiAgICAgICAgaGllcmFyY2h5OmFwcERlZmluaXRpb24uaGllcmFyY2h5LFxuICAgICAgICBhY3Rpb25zOmFwcERlZmluaXRpb24uYWN0aW9uc1xuICAgIH07XG5cbiAgICBjb25zdCB0ZW1wbGF0ZUFwaSA9IGdldFRlbXBsYXRlQXBpKGFwcCk7ICAgIFxuXG4gICAgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMgPSBpc1NvbWV0aGluZyhjbGVhbnVwVHJhbnNhY3Rpb25zKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gY2xlYW51cFRyYW5zYWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBhc3luYyAoKSA9PiBhd2FpdCBjbGVhbnVwKGFwcCk7XG5cbiAgICBhcHAuZ2V0RXBvY2hUaW1lID0gaXNTb21ldGhpbmcoZ2V0RXBvY2hUaW1lKVxuICAgICAgICAgICAgICAgICAgICAgICA/IGdldEVwb2NoVGltZVxuICAgICAgICAgICAgICAgICAgICAgICA6IGFzeW5jICgpID0+IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG5cbiAgICBjb25zdCByZWNvcmRBcGkgPSBnZXRSZWNvcmRBcGkoYXBwKTtcbiAgICBjb25zdCBjb2xsZWN0aW9uQXBpID0gZ2V0Q29sbGVjdGlvbkFwaShhcHApO1xuICAgIGNvbnN0IGluZGV4QXBpID0gZ2V0SW5kZXhBcGkoYXBwKTtcbiAgICBjb25zdCBhdXRoQXBpID0gZ2V0QXV0aEFwaShhcHApO1xuICAgIGNvbnN0IGFjdGlvbnNBcGkgPSBnZXRBY3Rpb25zQXBpKGFwcCk7XG5cbiAgICBjb25zdCBhdXRoZW50aWNhdGVBcyA9IGFzeW5jICh1c2VybmFtZSwgcGFzc3dvcmQpID0+IHtcbiAgICAgICAgYXBwLnVzZXIgPSBhd2FpdCBhdXRoQXBpLmF1dGhlbnRpY2F0ZSh1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgIH07XG5cbiAgICBjb25zdCB3aXRoRnVsbEFjY2VzcyA9ICgpID0+IHtcbiAgICAgICAgYXBwLnVzZXIgPSB7XG4gICAgICAgICAgICBuYW1lOiBcImFwcFwiLFxuICAgICAgICAgICAgcGVybWlzc2lvbnMgOiBnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucyhhcHApLFxuICAgICAgICAgICAgaXNVc2VyOmZhbHNlLFxuICAgICAgICAgICAgdGVtcDpmYWxzZVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGFzVXNlciA9ICh1c2VyKSA9PiB7XG4gICAgICAgIGFwcC51c2VyID0gdXNlclxuICAgIH07XG5cbiAgICBcblxuICAgIGxldCBhcGlzID0ge1xuICAgICAgICByZWNvcmRBcGksIFxuICAgICAgICB0ZW1wbGF0ZUFwaSxcbiAgICAgICAgY29sbGVjdGlvbkFwaSxcbiAgICAgICAgaW5kZXhBcGksXG4gICAgICAgIGF1dGhBcGksXG4gICAgICAgIGFjdGlvbnNBcGksXG4gICAgICAgIHN1YnNjcmliZTogZXZlbnRBZ2dyZWdhdG9yLnN1YnNjcmliZSxcbiAgICAgICAgYXV0aGVudGljYXRlQXMsXG4gICAgICAgIHdpdGhGdWxsQWNjZXNzLFxuICAgICAgICBhc1VzZXJcbiAgICB9O1xuXG4gICAgYXBpcy5hY3Rpb25zID0gaW5pdGlhbGlzZUFjdGlvbnMoXG4gICAgICAgIGV2ZW50QWdncmVnYXRvci5zdWJzY3JpYmUsXG4gICAgICAgIGJlaGF2aW91clNvdXJjZXMsXG4gICAgICAgIGFwcERlZmluaXRpb24uYWN0aW9ucyxcbiAgICAgICAgYXBwRGVmaW5pdGlvbi50cmlnZ2VycyxcbiAgICAgICAgYXBpcyk7XG5cblxuICAgIHJldHVybiBhcGlzO1xufTtcblxuZXhwb3J0IHtldmVudHMsIGV2ZW50c0xpc3R9IGZyb20gXCIuL2NvbW1vbi9ldmVudHNcIjtcbmV4cG9ydCB7Z2V0VGVtcGxhdGVBcGl9IGZyb20gXCIuL3RlbXBsYXRlQXBpXCI7XG5leHBvcnQge2dldFJlY29yZEFwaX0gZnJvbSBcIi4vcmVjb3JkQXBpXCI7XG5leHBvcnQge2dldENvbGxlY3Rpb25BcGl9IGZyb20gXCIuL2NvbGxlY3Rpb25BcGlcIjtcbmV4cG9ydCB7Z2V0QXV0aEFwaX0gZnJvbSBcIi4vYXV0aEFwaVwiO1xuZXhwb3J0IHtnZXRJbmRleEFwaX0gZnJvbSBcIi4vaW5kZXhBcGlcIjtcbmV4cG9ydCB7c2V0dXBEYXRhc3RvcmV9IGZyb20gXCIuL2FwcEluaXRpYWxpc2VcIjtcbmV4cG9ydCB7Z2V0QWN0aW9uc0FwaX0gZnJvbSBcIi4vYWN0aW9uc0FwaVwiO1xuZXhwb3J0IHtpbml0aWFsaXNlRGF0YX0gZnJvbSBcIi4vYXBwSW5pdGlhbGlzZS9pbml0aWFsaXNlRGF0YVwiO1xuZXhwb3J0IHtnZXREYXRhYmFzZU1hbmFnZXJ9IGZyb20gXCIuL2FwcEluaXRpYWxpc2UvZGF0YWJhc2VNYW5hZ2VyXCI7XG5leHBvcnQge2hpZXJhcmNoeX07XG5leHBvcnQge2NvbW1vbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldEFwcEFwaXM7Il0sIm5hbWVzIjpbInVuaW9uIiwicmVkdWNlIiwiZ2VuZXJhdGUiLCJpc1VuZGVmaW5lZCIsImNsb25lRGVlcCIsInNwbGl0IiwiZmxvdyIsInRyaW0iLCJyZXBsYWNlIiwiaXNBcnJheSIsImpvaW4iLCJkcm9wUmlnaHQiLCJ0YWtlUmlnaHQiLCJoZWFkIiwiaXNOdWxsIiwiaXNOYU4iLCJpc0VtcHR5IiwiY29uc3RhbnQiLCJzb21lIiwiaXNTdHJpbmciLCJ0YWlsIiwiaW5jbHVkZXMiLCJzdGFydHNXaXRoIiwiZmluZEluZGV4IiwiaXNJbnRlZ2VyIiwiaXNEYXRlIiwidG9OdW1iZXIiLCJtYXAiLCJmaWx0ZXIiLCJjb21waWxlRXhwcmVzc2lvbiIsImNvbXBpbGVDb2RlIiwia2V5cyIsImlzRnVuY3Rpb24iLCJjb3VudEJ5IiwibGFzdCIsImZpbmQiLCJ0YWtlIiwiZmlyc3QiLCJpbnRlcnNlY3Rpb24iLCJoYXMiLCJtZXJnZSIsIm1hcFZhbHVlcyIsIm1ha2VydWxlIiwiaXNCb29sZWFuIiwib3B0aW9ucyIsInR5cGVDb25zdHJhaW50cyIsImlzTnVtYmVyIiwiaXNPYmplY3RMaWtlIiwiYXNzaWduIiwiYWxsIiwiZ2V0RGVmYXVsdE9wdGlvbnMiLCJ2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyIsImlzT2JqZWN0IiwiY2xvbmUiLCJ2YWx1ZXMiLCJrZXlCeSIsIm9yZGVyQnkiLCJjb25jYXQiLCJyZXZlcnNlIiwiZ2xvYmFsIiwiYmFzZTY0LmZyb21CeXRlQXJyYXkiLCJpZWVlNzU0LnJlYWQiLCJpZWVlNzU0LndyaXRlIiwiYmFzZTY0LnRvQnl0ZUFycmF5IiwicmVhZCIsImRpZmZlcmVuY2UiLCJCdWZmZXIiLCJyZWFkSW5kZXgiLCJmbGF0dGVuIiwiZWFjaCIsIl8iLCJwdWxsIiwiZGVsZXRlUmVjb3JkIiwidmFsaWRhdGUiLCJtYXgiLCJkZWZhdWx0Q2FzZSIsImV2ZXJ5IiwidW5pcUJ5IiwiYXBpIiwiY3JlYXRlVGVtcG9yYXJ5QWNjZXNzIiwiY3JlYXRlVXNlciIsInVuaXFXaXRoIiwic2V0VXNlckFjY2Vzc0xldmVscyIsImV4ZWN1dGVBY3Rpb24iLCJjQ29kZSIsImNFeHAiLCJncm91cEJ5IiwiaXNFcXVhbCIsImRpZmZlcmVuY2VCeSIsImludGVyc2VjdGlvbkJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7RUFFQSxNQUFNLFVBQVUsR0FBRyxLQUFLLElBQUlBLFFBQUssQ0FBQyxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7RUFFL0UsTUFBTSxNQUFNLEdBQUcsTUFBTSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7O0VBRXBDLE1BQU0sT0FBTyxHQUFHO0VBQ2hCLEVBQUUsU0FBUyxFQUFFO0VBQ2IsSUFBSSxJQUFJLEVBQUUsVUFBVSxDQUFDO0VBQ3JCLE1BQU0sV0FBVztFQUNqQixNQUFNLGlCQUFpQjtFQUN2QixNQUFNLGlCQUFpQixDQUFDLENBQUM7RUFDekIsSUFBSSxNQUFNLEVBQUUsTUFBTSxFQUFFO0VBQ3BCLElBQUksVUFBVSxFQUFFLE1BQU0sRUFBRTtFQUN4QixJQUFJLE1BQU0sRUFBRSxNQUFNLEVBQUU7RUFDcEIsSUFBSSxJQUFJLEVBQUUsTUFBTSxFQUFFO0VBQ2xCLElBQUksUUFBUSxFQUFFLE1BQU0sRUFBRTtFQUN0QixJQUFJLFVBQVUsRUFBRSxNQUFNLEVBQUU7RUFDeEIsSUFBSSxZQUFZLEVBQUUsTUFBTSxFQUFFO0VBQzFCLEdBQUc7RUFDSCxFQUFFLFFBQVEsRUFBRTtFQUNaLElBQUksVUFBVSxFQUFFLE1BQU0sRUFBRTtFQUN4QixJQUFJLFNBQVMsRUFBRSxNQUFNLEVBQUU7RUFDdkIsSUFBSSxNQUFNLEVBQUUsTUFBTSxFQUFFO0VBQ3BCLElBQUksVUFBVSxFQUFFLE1BQU0sRUFBRTtFQUN4QixHQUFHO0VBQ0gsRUFBRSxhQUFhLEVBQUU7RUFDakIsSUFBSSxxQkFBcUIs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Z0QsQ0FBQztFQUNyRSxHQUFHOztFQUVIO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFLFlBQVksR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUM7O0VBRXhFO0VBQ0EsRUFBRSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxFQUFDOztFQUUzQztFQUNBLEVBQUUsQ0FBQyxHQUFHLFlBQVksR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFHOztFQUV0QyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUM7O0VBRVgsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtFQUM1QyxJQUFJLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQztFQUN0SyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEVBQUUsSUFBSSxLQUFJO0VBQ2pDLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUks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QixDQUFDOztFQzVHTSxTQUFTLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0VBQzFELEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBQztFQUNWLEVBQUUsSUFBSSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBQztFQUNsQyxFQUFFLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFDO0VBQzVCLEVBQUUsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUM7RUFDdkIsRUFBRSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUM7RUFDaEIsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFDO0VBQ2pDLEVBQUUsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUM7RUFDdkIsRUFBRSxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBQzs7RUFFNUIsRUFBRSxDQUFDLElBQUksRUFBQzs7RUFFUixFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUM7RUFDL0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUM7RUFDaEIsRUFBRSxLQUFLLElBQUksS0FBSTtFQUNmLEVBQUUsT0FBTyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLEVBQUU7O0VBRTVFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBQztFQUMvQixFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBQztFQUNoQixFQUFFLEtBQUssSUFBSSxLQUFJO0VBQ2YsRUFBRSxPQUFPLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUUsRUFBRTs7RUFFNUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7RUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBSztFQUNqQixHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO0VBQ3pCLElBQUksT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxRQUFRLENBQUM7RUFDOUMsR0FBRyxNQUFNO0VBQ1QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBQztFQUM3QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBSztFQUNqQixHQUFHO0VBQ0gsRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztFQUNqRCxDQUFDOztBQUVELEVBQU8sU0FBUyxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7RUFDbEUsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBQztFQUNiLEVBQUUsSUFBSSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBQztFQUNsQyxFQUFFLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFDO0VBQzVCLEVBQUUsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUM7RUFDdkIsRUFBRSxJQUFJLEVBQUUsSUFBSSxJQUFJLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUM7RUFDbEUsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUM7RUFDakMsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBQztFQUN2QixFQUFFLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFDOztFQUU3RCxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBQzs7RUFFekIsRUFBRSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssUUFBUSxFQUFFO0VBQzFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBQztFQUM1QixJQUFJLENBQUMsR0FBRyxLQUFJO0VBQ1osR0FBRyxNQUFNO0VBQ1QsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUM7RUFDOUMsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtFQUMzQyxNQUFNLENBQUMsR0FBRTtFQUNULE1BQU0sQ0FBQyxJQUFJLEVBQUM7RUFDWixLQUFLO0VBQ0wsSUFBSSxJQUFJLENBQUMsR0FBRyxL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LElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDbEQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUM7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDbEQsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDOUM7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7O0lBRWxELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDbkM7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7O0lBRWxELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsU0FBUztPQUM3QixDQUFDLElBQUks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QUVsRCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7T0FDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNyQjs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxTQUFTLFdBQVcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0lBQ3JFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztJQUNsRCxPQUFPQyxJQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvQzs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxTQUFTLFdBQVcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0lBQ3JFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztJQUNsRCxPQUFPQSxJQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNoRDs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxTQUFTLFlBQVksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0lBQ3ZFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztJQUNsRCxPQUFPQSxJQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvQzs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVks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R0FBRyxTQUFTLGFBQWEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUNoRixLQUFLLEdBQUcsQ0FBQyxNQUFLO0lBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0lBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO0lBQzFELElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO01BQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxFQUFDO01BQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBQztLQUNqQyxNQUFNO01BQ0wsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO0tBQzdDO0lBQ0QsT0FBTyxNQUFNLEdBQUcsQ0FBQztJQUNsQjs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxTQUFTLGFBQWEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUNoRixLQUFLLEdBQUcsQ0FBQyxNQUFLO0lBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0lBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO0lBQzFELElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO01BQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFDO01BQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksRUFBQztLQUNsQyxNQUFNO01BQ0wsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDO0tB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
