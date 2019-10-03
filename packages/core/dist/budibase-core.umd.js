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
    record.key = joinKey(collectionKey, record.id);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVkaWJhc2UtY29yZS51bWQuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21tb24vZXZlbnRzLmpzIiwiLi4vc3JjL2NvbW1vbi9lcnJvcnMuanMiLCIuLi9zcmMvY29tbW9uL2FwaVdyYXBwZXIuanMiLCIuLi9zcmMvY29tbW9uL2xvY2suanMiLCIuLi9zcmMvY29tbW9uL2luZGV4LmpzIiwiLi4vc3JjL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uLmpzIiwiLi4vc3JjL2luZGV4aW5nL2V2YWx1YXRlLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2luZGV4ZXMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvaGllcmFyY2h5LmpzIiwiLi4vc3JjL3R5cGVzL3R5cGVIZWxwZXJzLmpzIiwiLi4vc3JjL3R5cGVzL3N0cmluZy5qcyIsIi4uL3NyYy90eXBlcy9ib29sLmpzIiwiLi4vc3JjL3R5cGVzL251bWJlci5qcyIsIi4uL3NyYy90eXBlcy9kYXRldGltZS5qcyIsIi4uL3NyYy90eXBlcy9hcnJheS5qcyIsIi4uL3NyYy90eXBlcy9yZWZlcmVuY2UuanMiLCIuLi9zcmMvdHlwZXMvZmlsZS5qcyIsIi4uL3NyYy90eXBlcy9pbmRleC5qcyIsIi4uL3NyYy9hdXRoQXBpL2F1dGhDb21tb24uanMiLCIuLi9zcmMvYXV0aEFwaS9pc0F1dGhvcml6ZWQuanMiLCIuLi9zcmMvYXV0aEFwaS9wZXJtaXNzaW9ucy5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZ2V0TmV3LmpzIiwiLi4vc3JjL3JlY29yZEFwaS9sb2FkLmpzIiwiLi4vc3JjL2luZGV4aW5nL3Byb21pc2VSZWFkYWJsZVN0cmVhbS5qcyIsIi4uL3NyYy9pbmRleGluZy9zaGFyZGluZy5qcyIsIi4uL3NyYy9pbmRleGluZy9pbmRleFNjaGVtYUNyZWF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvcm9sbHVwLXBsdWdpbi1ub2RlLWdsb2JhbHMvc3JjL2dsb2JhbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9idWZmZXItZXM2L2Jhc2U2NC5qcyIsIi4uL25vZGVfbW9kdWxlcy9idWZmZXItZXM2L2llZWU3NTQuanMiLCIuLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVzNi9pc0FycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2J1ZmZlci1lczYvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvcm9sbHVwLXBsdWdpbi1ub2RlLWJ1aWx0aW5zL3NyYy9lczYvc3RyaW5nLWRlY29kZXIuanMiLCIuLi9zcmMvaW5kZXhpbmcvc2VyaWFsaXplci5qcyIsIi4uL3NyYy9pbmRleGluZy9yZWFkLmpzIiwiLi4vc3JjL2luZGV4QXBpL2xpc3RJdGVtcy5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZ2V0Q29udGV4dC5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvdmFsaWRhdGUuanMiLCIuLi9zcmMvY29sbGVjdGlvbkFwaS9pbml0aWFsaXNlLmpzIiwiLi4vc3JjL2luZGV4aW5nL2FsbElkcy5qcyIsIi4uL3NyYy90cmFuc2FjdGlvbnMvdHJhbnNhY3Rpb25zQ29tbW9uLmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9jcmVhdGUuanMiLCIuLi9zcmMvaW5kZXhpbmcvaW5pdGlhbGlzZUluZGV4LmpzIiwiLi4vc3JjL3JlY29yZEFwaS9zYXZlLmpzIiwiLi4vc3JjL2NvbGxlY3Rpb25BcGkvZGVsZXRlLmpzIiwiLi4vc3JjL2luZGV4QXBpL2RlbGV0ZS5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZGVsZXRlLmpzIiwiLi4vc3JjL3JlY29yZEFwaS91cGxvYWRGaWxlLmpzIiwiLi4vc3JjL3JlY29yZEFwaS9kb3dubG9hZEZpbGUuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2N1c3RvbUlkLmpzIiwiLi4vc3JjL3JlY29yZEFwaS9pbmRleC5qcyIsIi4uL3NyYy9jb2xsZWN0aW9uQXBpL2dldEFsbG93ZWRSZWNvcmRUeXBlcy5qcyIsIi4uL3NyYy9jb2xsZWN0aW9uQXBpL2luZGV4LmpzIiwiLi4vc3JjL2luZGV4QXBpL2J1aWxkSW5kZXguanMiLCIuLi9zcmMvaW5kZXhBcGkvYWdncmVnYXRlcy5qcyIsIi4uL3NyYy9pbmRleEFwaS9pbmRleC5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9jcmVhdGVOb2Rlcy5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9maWVsZHMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvcmVjb3JkVmFsaWRhdGlvblJ1bGVzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2NyZWF0ZUFjdGlvbnMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvdmFsaWRhdGVBZ2dyZWdhdGUuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvdmFsaWRhdGUuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL3NhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeS5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9zYXZlQWN0aW9uc0FuZFRyaWdnZXJzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2dldEJlaGF2aW91clNvdXJjZXMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvaW5kZXguanMiLCIuLi9zcmMvYXV0aEFwaS9nZXRVc2Vycy5qcyIsIi4uL3NyYy9hdXRoQXBpL2xvYWRBY2Nlc3NMZXZlbHMuanMiLCIuLi9zcmMvYXV0aEFwaS9hdXRoZW50aWNhdGUuanMiLCIuLi9zcmMvYXV0aEFwaS9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MuanMiLCIuLi9zcmMvYXV0aEFwaS92YWxpZGF0ZVVzZXIuanMiLCIuLi9zcmMvYXV0aEFwaS9nZXROZXdVc2VyLmpzIiwiLi4vc3JjL2F1dGhBcGkvc2V0UGFzc3dvcmQuanMiLCIuLi9zcmMvYXV0aEFwaS9jcmVhdGVVc2VyLmpzIiwiLi4vc3JjL2F1dGhBcGkvZW5hYmxlVXNlci5qcyIsIi4uL3NyYy9hdXRoQXBpL2dldE5ld0FjY2Vzc0xldmVsLmpzIiwiLi4vc3JjL2F1dGhBcGkvdmFsaWRhdGVBY2Nlc3NMZXZlbHMuanMiLCIuLi9zcmMvYXV0aEFwaS9zYXZlQWNjZXNzTGV2ZWxzLmpzIiwiLi4vc3JjL2F1dGhBcGkvZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMuanMiLCIuLi9zcmMvYXV0aEFwaS9zZXRVc2VyQWNjZXNzTGV2ZWxzLmpzIiwiLi4vc3JjL2F1dGhBcGkvaW5kZXguanMiLCIuLi9zcmMvYWN0aW9uc0FwaS9leGVjdXRlLmpzIiwiLi4vc3JjL2FjdGlvbnNBcGkvaW5kZXguanMiLCIuLi9zcmMvYXBwSW5pdGlhbGlzZS9ldmVudEFnZ3JlZ2F0b3IuanMiLCIuLi9zcmMvYXBwSW5pdGlhbGlzZS9pbmRleC5qcyIsIi4uL3NyYy9jb21tb24vY29tcGlsZUNvZGUuanMiLCIuLi9zcmMvYWN0aW9uc0FwaS9pbml0aWFsaXNlLmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9yZXRyaWV2ZS5qcyIsIi4uL3NyYy9pbmRleGluZy9yZWxldmFudC5qcyIsIi4uL3NyYy9pbmRleGluZy9wcm9taXNlV3JpdGFibGVTdHJlYW0uanMiLCIuLi9zcmMvaW5kZXhpbmcvYXBwbHkuanMiLCIuLi9zcmMvdHJhbnNhY3Rpb25zL2V4ZWN1dGUuanMiLCIuLi9zcmMvdHJhbnNhY3Rpb25zL2NsZWFudXAuanMiLCIuLi9zcmMvYXBwSW5pdGlhbGlzZS9pbml0aWFsaXNlRGF0YS5qcyIsIi4uL3NyYy9hcHBJbml0aWFsaXNlL2RhdGFiYXNlTWFuYWdlci5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1bmlvbiwgcmVkdWNlIH0gZnJvbSAnbG9kYXNoL2ZwJztcblxuY29uc3QgY29tbW9uUGx1cyA9IGV4dHJhID0+IHVuaW9uKFsnb25CZWdpbicsICdvbkNvbXBsZXRlJywgJ29uRXJyb3InXSkoZXh0cmEpO1xuXG5jb25zdCBjb21tb24gPSAoKSA9PiBjb21tb25QbHVzKFtdKTtcblxuY29uc3QgX2V2ZW50cyA9IHtcbiAgcmVjb3JkQXBpOiB7XG4gICAgc2F2ZTogY29tbW9uUGx1cyhbXG4gICAgICAnb25JbnZhbGlkJyxcbiAgICAgICdvblJlY29yZFVwZGF0ZWQnLFxuICAgICAgJ29uUmVjb3JkQ3JlYXRlZCddKSxcbiAgICBkZWxldGU6IGNvbW1vbigpLFxuICAgIGdldENvbnRleHQ6IGNvbW1vbigpLFxuICAgIGdldE5ldzogY29tbW9uKCksXG4gICAgbG9hZDogY29tbW9uKCksXG4gICAgdmFsaWRhdGU6IGNvbW1vbigpLFxuICAgIHVwbG9hZEZpbGU6IGNvbW1vbigpLFxuICAgIGRvd25sb2FkRmlsZTogY29tbW9uKCksXG4gIH0sXG4gIGluZGV4QXBpOiB7XG4gICAgYnVpbGRJbmRleDogY29tbW9uKCksXG4gICAgbGlzdEl0ZW1zOiBjb21tb24oKSxcbiAgICBkZWxldGU6IGNvbW1vbigpLFxuICAgIGFnZ3JlZ2F0ZXM6IGNvbW1vbigpLFxuICB9LFxuICBjb2xsZWN0aW9uQXBpOiB7XG4gICAgZ2V0QWxsb3dlZFJlY29yZFR5cGVzOiBjb21tb24oKSxcbiAgICBpbml0aWFsaXNlOiBjb21tb24oKSxcbiAgICBkZWxldGU6IGNvbW1vbigpLFxuICB9LFxuICBhdXRoQXBpOiB7XG4gICAgYXV0aGVudGljYXRlOiBjb21tb24oKSxcbiAgICBhdXRoZW50aWNhdGVUZW1wb3JhcnlBY2Nlc3M6IGNvbW1vbigpLFxuICAgIGNyZWF0ZVRlbXBvcmFyeUFjY2VzczogY29tbW9uKCksXG4gICAgY3JlYXRlVXNlcjogY29tbW9uKCksXG4gICAgZW5hYmxlVXNlcjogY29tbW9uKCksXG4gICAgZGlzYWJsZVVzZXI6IGNvbW1vbigpLFxuICAgIGxvYWRBY2Nlc3NMZXZlbHM6IGNvbW1vbigpLFxuICAgIGdldE5ld0FjY2Vzc0xldmVsOiBjb21tb24oKSxcbiAgICBnZXROZXdVc2VyOiBjb21tb24oKSxcbiAgICBnZXROZXdVc2VyQXV0aDogY29tbW9uKCksXG4gICAgZ2V0VXNlcnM6IGNvbW1vbigpLFxuICAgIHNhdmVBY2Nlc3NMZXZlbHM6IGNvbW1vbigpLFxuICAgIGlzQXV0aG9yaXplZDogY29tbW9uKCksXG4gICAgY2hhbmdlTXlQYXNzd29yZDogY29tbW9uKCksXG4gICAgc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZTogY29tbW9uKCksXG4gICAgc2NvcmVQYXNzd29yZDogY29tbW9uKCksXG4gICAgaXNWYWxpZFBhc3N3b3JkOiBjb21tb24oKSxcbiAgICB2YWxpZGF0ZVVzZXI6IGNvbW1vbigpLFxuICAgIHZhbGlkYXRlQWNjZXNzTGV2ZWxzOiBjb21tb24oKSxcbiAgICBzZXRVc2VyQWNjZXNzTGV2ZWxzOiBjb21tb24oKSxcbiAgfSxcbiAgdGVtcGxhdGVBcGk6IHtcbiAgICBzYXZlQXBwbGljYXRpb25IaWVyYXJjaHk6IGNvbW1vbigpLFxuICAgIHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnM6IGNvbW1vbigpLFxuICB9LFxuICBhY3Rpb25zQXBpOiB7XG4gICAgZXhlY3V0ZTogY29tbW9uKCksXG4gIH0sXG59O1xuXG5jb25zdCBfZXZlbnRzTGlzdCA9IFtdO1xuXG5jb25zdCBtYWtlRXZlbnQgPSAoYXJlYSwgbWV0aG9kLCBuYW1lKSA9PiBgJHthcmVhfToke21ldGhvZH06JHtuYW1lfWA7XG5cbmZvciAoY29uc3QgYXJlYUtleSBpbiBfZXZlbnRzKSB7XG4gIGZvciAoY29uc3QgbWV0aG9kS2V5IGluIF9ldmVudHNbYXJlYUtleV0pIHtcbiAgICBfZXZlbnRzW2FyZWFLZXldW21ldGhvZEtleV0gPSByZWR1Y2UoKG9iaiwgcykgPT4ge1xuICAgICAgb2JqW3NdID0gbWFrZUV2ZW50KGFyZWFLZXksIG1ldGhvZEtleSwgcyk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0sXG4gICAge30pKF9ldmVudHNbYXJlYUtleV1bbWV0aG9kS2V5XSk7XG4gIH1cbn1cblxuXG5mb3IgKGNvbnN0IGFyZWFLZXkgaW4gX2V2ZW50cykge1xuICBmb3IgKGNvbnN0IG1ldGhvZEtleSBpbiBfZXZlbnRzW2FyZWFLZXldKSB7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIF9ldmVudHNbYXJlYUtleV1bbWV0aG9kS2V5XSkge1xuICAgICAgX2V2ZW50c0xpc3QucHVzaChcbiAgICAgICAgX2V2ZW50c1thcmVhS2V5XVttZXRob2RLZXldW25hbWVdLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuXG5leHBvcnQgY29uc3QgZXZlbnRzID0gX2V2ZW50cztcblxuZXhwb3J0IGNvbnN0IGV2ZW50c0xpc3QgPSBfZXZlbnRzTGlzdDtcblxuZXhwb3J0IGRlZmF1bHQgeyBldmVudHM6IF9ldmVudHMsIGV2ZW50c0xpc3Q6IF9ldmVudHNMaXN0IH07XG4iLCJleHBvcnQgY2xhc3MgQmFkUmVxdWVzdEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDA7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5hdXRob3Jpc2VkRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDQwMTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGb3JiaWRkZW5FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmh0dHBTdGF0dXNDb2RlID0gNDAzO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5vdEZvdW5kRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDQwNDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb25mbGljdEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDk7XG4gICAgfVxufSIsImltcG9ydCB7IGNsb25lRGVlcCwgaXNVbmRlZmluZWQgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcbmltcG9ydCB7IFVuYXV0aG9yaXNlZEVycm9yIH0gZnJvbSAnLi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgYXBpV3JhcHBlciA9IGFzeW5jIChhcHAsIGV2ZW50TmFtZXNwYWNlLCBpc0F1dGhvcml6ZWQsIGV2ZW50Q29udGV4dCwgZnVuYywgLi4ucGFyYW1zKSA9PiB7XG4gIHB1c2hDYWxsU3RhY2soYXBwLCBldmVudE5hbWVzcGFjZSk7XG5cbiAgaWYgKCFpc0F1dGhvcml6ZWQoYXBwKSkge1xuICAgIGhhbmRsZU5vdEF1dGhvcml6ZWQoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzdGFydERhdGUgPSBEYXRlLm5vdygpO1xuICBjb25zdCBlbGFwc2VkID0gKCkgPT4gKERhdGUubm93KCkgLSBzdGFydERhdGUpO1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgYXBwLnB1Ymxpc2goXG4gICAgICBldmVudE5hbWVzcGFjZS5vbkJlZ2luLFxuICAgICAgZXZlbnRDb250ZXh0LFxuICAgICk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBmdW5jKC4uLnBhcmFtcyk7XG5cbiAgICBhd2FpdCBwdWJsaXNoQ29tcGxldGUoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgYXdhaXQgcHVibGlzaEVycm9yKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgYXBpV3JhcHBlclN5bmMgPSAoYXBwLCBldmVudE5hbWVzcGFjZSwgaXNBdXRob3JpemVkLCBldmVudENvbnRleHQsIGZ1bmMsIC4uLnBhcmFtcykgPT4ge1xuICBwdXNoQ2FsbFN0YWNrKGFwcCwgZXZlbnROYW1lc3BhY2UpO1xuXG4gIGlmICghaXNBdXRob3JpemVkKGFwcCkpIHtcbiAgICBoYW5kbGVOb3RBdXRob3JpemVkKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgc3RhcnREYXRlID0gRGF0ZS5ub3coKTtcbiAgY29uc3QgZWxhcHNlZCA9ICgpID0+IChEYXRlLm5vdygpIC0gc3RhcnREYXRlKTtcblxuICB0cnkge1xuICAgIGFwcC5wdWJsaXNoKFxuICAgICAgZXZlbnROYW1lc3BhY2Uub25CZWdpbixcbiAgICAgIGV2ZW50Q29udGV4dCxcbiAgICApO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gZnVuYyguLi5wYXJhbXMpO1xuXG4gICAgcHVibGlzaENvbXBsZXRlKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHB1Ymxpc2hFcnJvcihhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIGVycm9yKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxuY29uc3QgaGFuZGxlTm90QXV0aG9yaXplZCA9IChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UpID0+IHtcbiAgY29uc3QgZXJyID0gbmV3IFVuYXV0aG9yaXNlZEVycm9yKGBVbmF1dGhvcml6ZWQ6ICR7ZXZlbnROYW1lc3BhY2V9YCk7XG4gIHB1Ymxpc2hFcnJvcihhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsICgpID0+IDAsIGVycik7XG4gIHRocm93IGVycjtcbn07XG5cbmNvbnN0IHB1c2hDYWxsU3RhY2sgPSAoYXBwLCBldmVudE5hbWVzcGFjZSwgc2VlZENhbGxJZCkgPT4ge1xuICBjb25zdCBjYWxsSWQgPSBnZW5lcmF0ZSgpO1xuXG4gIGNvbnN0IGNyZWF0ZUNhbGxTdGFjayA9ICgpID0+ICh7XG4gICAgc2VlZENhbGxJZDogIWlzVW5kZWZpbmVkKHNlZWRDYWxsSWQpXG4gICAgICA/IHNlZWRDYWxsSWRcbiAgICAgIDogY2FsbElkLFxuICAgIHRocmVhZENhbGxJZDogY2FsbElkLFxuICAgIHN0YWNrOiBbXSxcbiAgfSk7XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGFwcC5jYWxscykpIHtcbiAgICBhcHAuY2FsbHMgPSBjcmVhdGVDYWxsU3RhY2soKTtcbiAgfVxuXG4gIGFwcC5jYWxscy5zdGFjay5wdXNoKHtcbiAgICBuYW1lc3BhY2U6IGV2ZW50TmFtZXNwYWNlLFxuICAgIGNhbGxJZCxcbiAgfSk7XG59O1xuXG5jb25zdCBwb3BDYWxsU3RhY2sgPSAoYXBwKSA9PiB7XG4gIGFwcC5jYWxscy5zdGFjay5wb3AoKTtcbiAgaWYgKGFwcC5jYWxscy5zdGFjay5sZW5ndGggPT09IDApIHtcbiAgICBkZWxldGUgYXBwLmNhbGxzO1xuICB9XG59O1xuXG5jb25zdCBwdWJsaXNoRXJyb3IgPSBhc3luYyAoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCBlcnIpID0+IHtcbiAgY29uc3QgY3R4ID0gY2xvbmVEZWVwKGV2ZW50Q29udGV4dCk7XG4gIGN0eC5lcnJvciA9IGVycjtcbiAgY3R4LmVsYXBzZWQgPSBlbGFwc2VkKCk7XG4gIGF3YWl0IGFwcC5wdWJsaXNoKFxuICAgIGV2ZW50TmFtZXNwYWNlLm9uRXJyb3IsXG4gICAgY3R4LFxuICApO1xuICBwb3BDYWxsU3RhY2soYXBwKTtcbn07XG5cbmNvbnN0IHB1Ymxpc2hDb21wbGV0ZSA9IGFzeW5jIChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIHJlc3VsdCkgPT4ge1xuICBjb25zdCBlbmRjb250ZXh0ID0gY2xvbmVEZWVwKGV2ZW50Q29udGV4dCk7XG4gIGVuZGNvbnRleHQucmVzdWx0ID0gcmVzdWx0O1xuICBlbmRjb250ZXh0LmVsYXBzZWQgPSBlbGFwc2VkKCk7XG4gIGF3YWl0IGFwcC5wdWJsaXNoKFxuICAgIGV2ZW50TmFtZXNwYWNlLm9uQ29tcGxldGUsXG4gICAgZW5kY29udGV4dCxcbiAgKTtcbiAgcG9wQ2FsbFN0YWNrKGFwcCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhcGlXcmFwcGVyO1xuIiwiaW1wb3J0IHsgc3BsaXQgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgJCB9IGZyb20gJy4vaW5kZXgnO1xuXG5jb25zdCBsb2NrT3ZlcmxhcE1pbGxpc2Vjb25kcyA9IDEwO1xuXG5leHBvcnQgY29uc3QgZ2V0TG9jayA9IGFzeW5jIChhcHAsIGxvY2tGaWxlLCB0aW1lb3V0TWlsbGlzZWNvbmRzLCBtYXhMb2NrUmV0cmllcywgcmV0cnlDb3VudCA9IDApID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB0aW1lb3V0ID0gKGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKSlcbiAgICAgICAgICAgICsgdGltZW91dE1pbGxpc2Vjb25kcztcblxuICAgIGNvbnN0IGxvY2sgPSB7XG4gICAgICB0aW1lb3V0LFxuICAgICAga2V5OiBsb2NrRmlsZSxcbiAgICAgIHRvdGFsVGltZW91dDogdGltZW91dE1pbGxpc2Vjb25kcyxcbiAgICB9O1xuXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVGaWxlKFxuICAgICAgbG9ja0ZpbGUsXG4gICAgICBnZXRMb2NrRmlsZUNvbnRlbnQoXG4gICAgICAgIGxvY2sudG90YWxUaW1lb3V0LFxuICAgICAgICBsb2NrLnRpbWVvdXQsXG4gICAgICApLFxuICAgICk7XG5cbiAgICByZXR1cm4gbG9jaztcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChyZXRyeUNvdW50ID09IG1heExvY2tSZXRyaWVzKSB7IHJldHVybiBOT19MT0NLOyB9XG5cbiAgICBjb25zdCBsb2NrID0gcGFyc2VMb2NrRmlsZUNvbnRlbnQoXG4gICAgICBsb2NrRmlsZSxcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEZpbGUobG9ja0ZpbGUpLFxuICAgICk7XG5cbiAgICBjb25zdCBjdXJyZW50RXBvY2hUaW1lID0gYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpO1xuXG4gICAgaWYgKGN1cnJlbnRFcG9jaFRpbWUgPCBsb2NrLnRpbWVvdXQpIHtcbiAgICAgIHJldHVybiBOT19MT0NLO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUobG9ja0ZpbGUpO1xuICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgIC8vZW1wdHlcbiAgICB9XG5cbiAgICBhd2FpdCBzbGVlcEZvclJldHJ5KCk7XG5cbiAgICByZXR1cm4gYXdhaXQgZ2V0TG9jayhcbiAgICAgIGFwcCwgbG9ja0ZpbGUsIHRpbWVvdXRNaWxsaXNlY29uZHMsXG4gICAgICBtYXhMb2NrUmV0cmllcywgcmV0cnlDb3VudCArIDEsXG4gICAgKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGdldExvY2tGaWxlQ29udGVudCA9ICh0b3RhbFRpbWVvdXQsIGVwb2NoVGltZSkgPT4gYCR7dG90YWxUaW1lb3V0fToke2Vwb2NoVGltZS50b1N0cmluZygpfWA7XG5cbmNvbnN0IHBhcnNlTG9ja0ZpbGVDb250ZW50ID0gKGtleSwgY29udGVudCkgPT4gJChjb250ZW50LCBbXG4gIHNwbGl0KCc6JyksXG4gIHBhcnRzID0+ICh7XG4gICAgdG90YWxUaW1lb3V0OiBuZXcgTnVtYmVyKHBhcnRzWzBdKSxcbiAgICB0aW1lb3V0OiBuZXcgTnVtYmVyKHBhcnRzWzFdKSxcbiAgICBrZXksXG4gIH0pLFxuXSk7XG5cbmV4cG9ydCBjb25zdCByZWxlYXNlTG9jayA9IGFzeW5jIChhcHAsIGxvY2spID0+IHtcbiAgY29uc3QgY3VycmVudEVwb2NoVGltZSA9IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKTtcbiAgLy8gb25seSByZWxlYXNlIGlmIG5vdCB0aW1lZG91dFxuICBpZiAoY3VycmVudEVwb2NoVGltZSA8IChsb2NrLnRpbWVvdXQgLSBsb2NrT3ZlcmxhcE1pbGxpc2Vjb25kcykpIHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKGxvY2sua2V5KTtcbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICAvL2VtcHR5XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZXh0ZW5kTG9jayA9IGFzeW5jIChhcHAsIGxvY2spID0+IHtcbiAgY29uc3QgY3VycmVudEVwb2NoVGltZSA9IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKTtcbiAgLy8gb25seSByZWxlYXNlIGlmIG5vdCB0aW1lZG91dFxuICBpZiAoY3VycmVudEVwb2NoVGltZSA8IChsb2NrLnRpbWVvdXQgLSBsb2NrT3ZlcmxhcE1pbGxpc2Vjb25kcykpIHtcbiAgICB0cnkge1xuICAgICAgbG9jay50aW1lb3V0ID0gY3VycmVudEVwb2NoVGltZSArIGxvY2sudGltZW91dE1pbGxpc2Vjb25kcztcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlRmlsZShcbiAgICAgICAgbG9jay5rZXksXG4gICAgICAgIGdldExvY2tGaWxlQ29udGVudChsb2NrLnRvdGFsVGltZW91dCwgbG9jay50aW1lb3V0KSxcbiAgICAgICk7XG4gICAgICByZXR1cm4gbG9jaztcbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICAvL2VtcHR5XG4gICAgfVxuICB9XG4gIHJldHVybiBOT19MT0NLO1xufTtcblxuZXhwb3J0IGNvbnN0IE5PX0xPQ0sgPSAnbm8gbG9jayc7XG5leHBvcnQgY29uc3QgaXNOb2xvY2sgPSBpZCA9PiBpZCA9PT0gTk9fTE9DSztcblxuY29uc3Qgc2xlZXBGb3JSZXRyeSA9ICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBsb2NrT3ZlcmxhcE1pbGxpc2Vjb25kcykpO1xuIiwiaW1wb3J0IHtcbiAgXG4gIGhlYWQsIFxuICB0YWlsLCBmaW5kSW5kZXgsIHN0YXJ0c1dpdGgsIFxuICBkcm9wUmlnaHQsIGZsb3csIHRha2VSaWdodCwgdHJpbSxcbiAgcmVwbGFjZVxuICBcbn0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IFxuICBzb21lLCByZWR1Y2UsIGlzRW1wdHksIGlzQXJyYXksIGpvaW4sXG4gIGlzU3RyaW5nLCBpc0ludGVnZXIsIGlzRGF0ZSwgdG9OdW1iZXIsXG4gIGlzVW5kZWZpbmVkLCBpc05hTiwgaXNOdWxsLCBjb25zdGFudCxcbiAgc3BsaXQsIGluY2x1ZGVzXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBldmVudHMsIGV2ZW50c0xpc3QgfSBmcm9tICcuL2V2ZW50cyc7XG5pbXBvcnQgeyBhcGlXcmFwcGVyIH0gZnJvbSAnLi9hcGlXcmFwcGVyJztcbmltcG9ydCB7XG4gIGdldExvY2ssIE5PX0xPQ0ssXG4gIGlzTm9sb2NrXG59IGZyb20gJy4vbG9jayc7XG5cbi8vIHRoaXMgaXMgdGhlIGNvbWJpbmF0b3IgZnVuY3Rpb25cbmV4cG9ydCBjb25zdCAkJCA9ICguLi5mdW5jcykgPT4gYXJnID0+IGZsb3coZnVuY3MpKGFyZyk7XG5cbi8vIHRoaXMgaXMgdGhlIHBpcGUgZnVuY3Rpb25cbmV4cG9ydCBjb25zdCAkID0gKGFyZywgZnVuY3MpID0+ICQkKC4uLmZ1bmNzKShhcmcpO1xuXG5leHBvcnQgY29uc3Qga2V5U2VwID0gJy8nO1xuY29uc3QgdHJpbUtleVNlcCA9IHN0ciA9PiB0cmltKHN0ciwga2V5U2VwKTtcbmNvbnN0IHNwbGl0QnlLZXlTZXAgPSBzdHIgPT4gc3BsaXQoa2V5U2VwKShzdHIpO1xuZXhwb3J0IGNvbnN0IHNhZmVLZXkgPSBrZXkgPT4gcmVwbGFjZShgJHtrZXlTZXB9JHt0cmltS2V5U2VwKGtleSl9YCwgYCR7a2V5U2VwfSR7a2V5U2VwfWAsIGtleVNlcCk7XG5leHBvcnQgY29uc3Qgam9pbktleSA9ICguLi5zdHJzKSA9PiB7XG4gIGNvbnN0IHBhcmFtc09yQXJyYXkgPSBzdHJzLmxlbmd0aCA9PT0gMSAmIGlzQXJyYXkoc3Ryc1swXSlcbiAgICA/IHN0cnNbMF0gOiBzdHJzO1xuICByZXR1cm4gc2FmZUtleShqb2luKGtleVNlcCkocGFyYW1zT3JBcnJheSkpO1xufTtcbmV4cG9ydCBjb25zdCBzcGxpdEtleSA9ICQkKHRyaW1LZXlTZXAsIHNwbGl0QnlLZXlTZXApO1xuZXhwb3J0IGNvbnN0IGdldERpckZvbUtleSA9ICQkKHNwbGl0S2V5LCBkcm9wUmlnaHQsIHAgPT4gam9pbktleSguLi5wKSk7XG5leHBvcnQgY29uc3QgZ2V0RmlsZUZyb21LZXkgPSAkJChzcGxpdEtleSwgdGFrZVJpZ2h0LCBoZWFkKTtcblxuZXhwb3J0IGNvbnN0IGNvbmZpZ0ZvbGRlciA9IGAke2tleVNlcH0uY29uZmlnYDtcbmV4cG9ydCBjb25zdCBmaWVsZERlZmluaXRpb25zID0gam9pbktleShjb25maWdGb2xkZXIsICdmaWVsZHMuanNvbicpO1xuZXhwb3J0IGNvbnN0IHRlbXBsYXRlRGVmaW5pdGlvbnMgPSBqb2luS2V5KGNvbmZpZ0ZvbGRlciwgJ3RlbXBsYXRlcy5qc29uJyk7XG5leHBvcnQgY29uc3QgYXBwRGVmaW5pdGlvbkZpbGUgPSBqb2luS2V5KGNvbmZpZ0ZvbGRlciwgJ2FwcERlZmluaXRpb24uanNvbicpO1xuZXhwb3J0IGNvbnN0IGRpckluZGV4ID0gZm9sZGVyUGF0aCA9PiBqb2luS2V5KGNvbmZpZ0ZvbGRlciwgJ2RpcicsIC4uLnNwbGl0S2V5KGZvbGRlclBhdGgpLCAnZGlyLmlkeCcpO1xuZXhwb3J0IGNvbnN0IGdldEluZGV4S2V5RnJvbUZpbGVLZXkgPSAkJChnZXREaXJGb21LZXksIGRpckluZGV4KTtcblxuZXhwb3J0IGNvbnN0IGlmRXhpc3RzID0gKHZhbCwgZXhpc3RzLCBub3RFeGlzdHMpID0+IChpc1VuZGVmaW5lZCh2YWwpXG4gID8gaXNVbmRlZmluZWQobm90RXhpc3RzKSA/ICgoKSA9PiB7IH0pKCkgOiBub3RFeGlzdHMoKVxuICA6IGV4aXN0cygpKTtcblxuZXhwb3J0IGNvbnN0IGdldE9yRGVmYXVsdCA9ICh2YWwsIGRlZmF1bHRWYWwpID0+IGlmRXhpc3RzKHZhbCwgKCkgPT4gdmFsLCAoKSA9PiBkZWZhdWx0VmFsKTtcblxuZXhwb3J0IGNvbnN0IG5vdCA9IGZ1bmMgPT4gdmFsID0+ICFmdW5jKHZhbCk7XG5leHBvcnQgY29uc3QgaXNEZWZpbmVkID0gbm90KGlzVW5kZWZpbmVkKTtcbmV4cG9ydCBjb25zdCBpc05vbk51bGwgPSBub3QoaXNOdWxsKTtcbmV4cG9ydCBjb25zdCBpc05vdE5hTiA9IG5vdChpc05hTik7XG5cbmV4cG9ydCBjb25zdCBhbGxUcnVlID0gKC4uLmZ1bmNBcmdzKSA9PiB2YWwgPT4gcmVkdWNlKFxuICAocmVzdWx0LCBjb25kaXRpb25GdW5jKSA9PiAoaXNOdWxsKHJlc3VsdCkgfHwgcmVzdWx0ID09IHRydWUpICYmIGNvbmRpdGlvbkZ1bmModmFsKSxcbiAgbnVsbCkoZnVuY0FyZ3MpO1xuXG5leHBvcnQgY29uc3QgYW55VHJ1ZSA9ICguLi5mdW5jQXJncykgPT4gdmFsID0+IHJlZHVjZShcbiAgKHJlc3VsdCwgY29uZGl0aW9uRnVuYykgPT4gcmVzdWx0ID09IHRydWUgfHwgY29uZGl0aW9uRnVuYyh2YWwpLFxuICBudWxsKShmdW5jQXJncyk7XG5cbmV4cG9ydCBjb25zdCBpbnNlbnNpdGl2ZUVxdWFscyA9IChzdHIxLCBzdHIyKSA9PiBzdHIxLnRyaW0oKS50b0xvd2VyQ2FzZSgpID09PSBzdHIyLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuXG5leHBvcnQgY29uc3QgaXNTb21ldGhpbmcgPSBhbGxUcnVlKGlzRGVmaW5lZCwgaXNOb25OdWxsLCBpc05vdE5hTik7XG5leHBvcnQgY29uc3QgaXNOb3RoaW5nID0gbm90KGlzU29tZXRoaW5nKTtcbmV4cG9ydCBjb25zdCBpc05vdGhpbmdPckVtcHR5ID0gdiA9PiBpc05vdGhpbmcodikgfHwgaXNFbXB0eSh2KTtcbmV4cG9ydCBjb25zdCBzb21ldGhpbmdPckdldERlZmF1bHQgPSBnZXREZWZhdWx0RnVuYyA9PiB2YWwgPT4gKGlzU29tZXRoaW5nKHZhbCkgPyB2YWwgOiBnZXREZWZhdWx0RnVuYygpKTtcbmV4cG9ydCBjb25zdCBzb21ldGhpbmdPckRlZmF1bHQgPSAodmFsLCBkZWZhdWx0VmFsKSA9PiBzb21ldGhpbmdPckdldERlZmF1bHQoY29uc3RhbnQoZGVmYXVsdFZhbCkpKHZhbCk7XG5cbmV4cG9ydCBjb25zdCBtYXBJZlNvbWV0aGluZ09yRGVmYXVsdCA9IChtYXBGdW5jLCBkZWZhdWx0VmFsKSA9PiB2YWwgPT4gKGlzU29tZXRoaW5nKHZhbCkgPyBtYXBGdW5jKHZhbCkgOiBkZWZhdWx0VmFsKTtcblxuZXhwb3J0IGNvbnN0IG1hcElmU29tZXRoaW5nT3JCbGFuayA9IG1hcEZ1bmMgPT4gbWFwSWZTb21ldGhpbmdPckRlZmF1bHQobWFwRnVuYywgJycpO1xuXG5leHBvcnQgY29uc3Qgbm9uZSA9IHByZWRpY2F0ZSA9PiBjb2xsZWN0aW9uID0+ICFzb21lKHByZWRpY2F0ZSkoY29sbGVjdGlvbik7XG5cbmV4cG9ydCBjb25zdCBhbGwgPSBwcmVkaWNhdGUgPT4gY29sbGVjdGlvbiA9PiBub25lKHYgPT4gIXByZWRpY2F0ZSh2KSkoY29sbGVjdGlvbik7XG5cbmV4cG9ydCBjb25zdCBpc05vdEVtcHR5ID0gb2IgPT4gIWlzRW1wdHkob2IpO1xuZXhwb3J0IGNvbnN0IGlzQXN5bmMgPSBmbiA9PiBmbi5jb25zdHJ1Y3Rvci5uYW1lID09PSAnQXN5bmNGdW5jdGlvbic7XG5leHBvcnQgY29uc3QgaXNOb25FbXB0eUFycmF5ID0gYWxsVHJ1ZShpc0FycmF5LCBpc05vdEVtcHR5KTtcbmV4cG9ydCBjb25zdCBpc05vbkVtcHR5U3RyaW5nID0gYWxsVHJ1ZShpc1N0cmluZywgaXNOb3RFbXB0eSk7XG5leHBvcnQgY29uc3QgdHJ5T3IgPSBmYWlsRnVuYyA9PiAoZnVuYywgLi4uYXJncykgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBmdW5jLmFwcGx5KG51bGwsIC4uLmFyZ3MpO1xuICB9IGNhdGNoIChfKSB7XG4gICAgcmV0dXJuIGZhaWxGdW5jKCk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCB0cnlBd2FpdE9yID0gZmFpbEZ1bmMgPT4gYXN5bmMgKGZ1bmMsIC4uLmFyZ3MpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgZnVuYy5hcHBseShudWxsLCAuLi5hcmdzKTtcbiAgfSBjYXRjaCAoXykge1xuICAgIHJldHVybiBhd2FpdCBmYWlsRnVuYygpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZGVmaW5lRXJyb3IgPSAoZnVuYywgZXJyb3JQcmVmaXgpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnVuYygpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBlcnIubWVzc2FnZSA9IGAke2Vycm9yUHJlZml4fSA6ICR7ZXJyLm1lc3NhZ2V9YDtcbiAgICB0aHJvdyBlcnI7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCB0cnlPcklnbm9yZSA9IHRyeU9yKCgpID0+IHsgfSk7XG5leHBvcnQgY29uc3QgdHJ5QXdhaXRPcklnbm9yZSA9IHRyeUF3YWl0T3IoYXN5bmMgKCkgPT4geyB9KTtcbmV4cG9ydCBjb25zdCBjYXVzZXNFeGNlcHRpb24gPSAoZnVuYykgPT4ge1xuICB0cnkge1xuICAgIGZ1bmMoKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbiA9IGZ1bmMgPT4gIWNhdXNlc0V4Y2VwdGlvbihmdW5jKTtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZUVycm9yV2l0aCA9IHJldHVyblZhbEluRXJyb3IgPT4gdHJ5T3IoY29uc3RhbnQocmV0dXJuVmFsSW5FcnJvcikpO1xuXG5leHBvcnQgY29uc3QgaGFuZGxlRXJyb3JXaXRoVW5kZWZpbmVkID0gaGFuZGxlRXJyb3JXaXRoKHVuZGVmaW5lZCk7XG5cbmV4cG9ydCBjb25zdCBzd2l0Y2hDYXNlID0gKC4uLmNhc2VzKSA9PiAodmFsdWUpID0+IHtcbiAgY29uc3QgbmV4dENhc2UgPSAoKSA9PiBoZWFkKGNhc2VzKVswXSh2YWx1ZSk7XG4gIGNvbnN0IG5leHRSZXN1bHQgPSAoKSA9PiBoZWFkKGNhc2VzKVsxXSh2YWx1ZSk7XG5cbiAgaWYgKGlzRW1wdHkoY2FzZXMpKSByZXR1cm47IC8vIHVuZGVmaW5lZFxuICBpZiAobmV4dENhc2UoKSA9PT0gdHJ1ZSkgcmV0dXJuIG5leHRSZXN1bHQoKTtcbiAgcmV0dXJuIHN3aXRjaENhc2UoLi4udGFpbChjYXNlcykpKHZhbHVlKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1ZhbHVlID0gdmFsMSA9PiB2YWwyID0+ICh2YWwxID09PSB2YWwyKTtcbmV4cG9ydCBjb25zdCBpc09uZU9mID0gKC4uLnZhbHMpID0+IHZhbCA9PiBpbmNsdWRlcyh2YWwpKHZhbHMpO1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRDYXNlID0gY29uc3RhbnQodHJ1ZSk7XG5leHBvcnQgY29uc3QgbWVtYmVyTWF0Y2hlcyA9IChtZW1iZXIsIG1hdGNoKSA9PiBvYmogPT4gbWF0Y2gob2JqW21lbWJlcl0pO1xuXG5cbmV4cG9ydCBjb25zdCBTdGFydHNXaXRoID0gc2VhcmNoRm9yID0+IHNlYXJjaEluID0+IHN0YXJ0c1dpdGgoc2VhcmNoSW4sIHNlYXJjaEZvcik7XG5cbmV4cG9ydCBjb25zdCBjb250YWlucyA9IHZhbCA9PiBhcnJheSA9PiAoZmluZEluZGV4KGFycmF5LCB2ID0+IHYgPT09IHZhbCkgPiAtMSk7XG5cbmV4cG9ydCBjb25zdCBnZXRIYXNoQ29kZSA9IChzKSA9PiB7XG4gIGxldCBoYXNoID0gMDsgbGV0IGk7IGxldCBjaGFyOyBsZXRcbiAgICBsO1xuICBpZiAocy5sZW5ndGggPT0gMCkgcmV0dXJuIGhhc2g7XG4gIGZvciAoaSA9IDAsIGwgPSBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNoYXIgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2hhcjtcbiAgICBoYXNoIHw9IDA7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICB9XG5cbiAgLy8gY29udmVydGluZyB0byBzdHJpbmcsIGJ1dCBkb250IHdhbnQgYSBcIi1cIiBwcmVmaXhlZFxuICBpZiAoaGFzaCA8IDApIHsgcmV0dXJuIGBuJHsoaGFzaCAqIC0xKS50b1N0cmluZygpfWA7IH1cbiAgcmV0dXJuIGhhc2gudG9TdHJpbmcoKTtcbn07XG5cbi8vIHRoYW5rcyB0byBodHRwczovL2Jsb2cuZ3Jvc3NtYW4uaW8vaG93LXRvLXdyaXRlLWFzeW5jLWF3YWl0LXdpdGhvdXQtdHJ5LWNhdGNoLWJsb2Nrcy1pbi1qYXZhc2NyaXB0L1xuZXhwb3J0IGNvbnN0IGF3RXggPSBhc3luYyAocHJvbWlzZSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHByb21pc2U7XG4gICAgcmV0dXJuIFt1bmRlZmluZWQsIHJlc3VsdF07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIFtlcnJvciwgdW5kZWZpbmVkXTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGlzU2FmZUludGVnZXIgPSBuID0+IGlzSW50ZWdlcihuKVxuICAgICYmIG4gPD0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgICAmJiBuID49IDAgLSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcblxuZXhwb3J0IGNvbnN0IHRvRGF0ZU9yTnVsbCA9IHMgPT4gKGlzTnVsbChzKSA/IG51bGxcbiAgOiBpc0RhdGUocykgPyBzIDogbmV3IERhdGUocykpO1xuZXhwb3J0IGNvbnN0IHRvQm9vbE9yTnVsbCA9IHMgPT4gKGlzTnVsbChzKSA/IG51bGxcbiAgOiBzID09PSAndHJ1ZScgfHwgcyA9PT0gdHJ1ZSk7XG5leHBvcnQgY29uc3QgdG9OdW1iZXJPck51bGwgPSBzID0+IChpc051bGwocykgPyBudWxsXG4gIDogdG9OdW1iZXIocykpO1xuXG5leHBvcnQgY29uc3QgaXNBcnJheU9mU3RyaW5nID0gb3B0cyA9PiBpc0FycmF5KG9wdHMpICYmIGFsbChpc1N0cmluZykob3B0cyk7XG5cbmV4cG9ydCBjb25zdCBwYXVzZSA9IGFzeW5jIGR1cmF0aW9uID0+IG5ldyBQcm9taXNlKHJlcyA9PiBzZXRUaW1lb3V0KHJlcywgZHVyYXRpb24pKTtcblxuZXhwb3J0IGNvbnN0IHJldHJ5ID0gYXN5bmMgKGZuLCByZXRyaWVzLCBkZWxheSwgLi4uYXJncykgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCBmbiguLi5hcmdzKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKHJldHJpZXMgPiAxKSB7XG4gICAgICByZXR1cm4gYXdhaXQgcGF1c2UoZGVsYXkpLnRoZW4oYXN5bmMgKCkgPT4gYXdhaXQgcmV0cnkoZm4sIChyZXRyaWVzIC0gMSksIGRlbGF5LCAuLi5hcmdzKSk7XG4gICAgfVxuICAgIHRocm93IGVycjtcbiAgfVxufTtcblxuZXhwb3J0IHsgZXZlbnRzIH0gZnJvbSAnLi9ldmVudHMnO1xuZXhwb3J0IHsgYXBpV3JhcHBlciwgYXBpV3JhcHBlclN5bmMgfSBmcm9tICcuL2FwaVdyYXBwZXInO1xuZXhwb3J0IHtcbiAgZ2V0TG9jaywgTk9fTE9DSywgcmVsZWFzZUxvY2ssXG4gIGV4dGVuZExvY2ssIGlzTm9sb2NrLFxufSBmcm9tICcuL2xvY2snO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGlmRXhpc3RzLFxuICBnZXRPckRlZmF1bHQsXG4gIGlzRGVmaW5lZCxcbiAgaXNOb25OdWxsLFxuICBpc05vdE5hTixcbiAgYWxsVHJ1ZSxcbiAgaXNTb21ldGhpbmcsXG4gIG1hcElmU29tZXRoaW5nT3JEZWZhdWx0LFxuICBtYXBJZlNvbWV0aGluZ09yQmxhbmssXG4gIGNvbmZpZ0ZvbGRlcixcbiAgZmllbGREZWZpbml0aW9ucyxcbiAgaXNOb3RoaW5nLFxuICBub3QsXG4gIHN3aXRjaENhc2UsXG4gIGRlZmF1bHRDYXNlLFxuICBTdGFydHNXaXRoLFxuICBjb250YWlucyxcbiAgdGVtcGxhdGVEZWZpbml0aW9ucyxcbiAgaGFuZGxlRXJyb3JXaXRoLFxuICBoYW5kbGVFcnJvcldpdGhVbmRlZmluZWQsXG4gIHRyeU9yLFxuICB0cnlPcklnbm9yZSxcbiAgdHJ5QXdhaXRPcixcbiAgdHJ5QXdhaXRPcklnbm9yZSxcbiAgZGlySW5kZXgsXG4gIGtleVNlcCxcbiAgJCxcbiAgJCQsXG4gIGdldERpckZvbUtleSxcbiAgZ2V0RmlsZUZyb21LZXksXG4gIHNwbGl0S2V5LFxuICBzb21ldGhpbmdPckRlZmF1bHQsXG4gIGdldEluZGV4S2V5RnJvbUZpbGVLZXksXG4gIGpvaW5LZXksXG4gIHNvbWV0aGluZ09yR2V0RGVmYXVsdCxcbiAgYXBwRGVmaW5pdGlvbkZpbGUsXG4gIGlzVmFsdWUsXG4gIGFsbCxcbiAgaXNPbmVPZixcbiAgbWVtYmVyTWF0Y2hlcyxcbiAgZGVmaW5lRXJyb3IsXG4gIGFueVRydWUsXG4gIGlzTm9uRW1wdHlBcnJheSxcbiAgY2F1c2VzRXhjZXB0aW9uLFxuICBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24sXG4gIG5vbmUsXG4gIGdldEhhc2hDb2RlLFxuICBhd0V4LFxuICBhcGlXcmFwcGVyLFxuICBldmVudHMsXG4gIGV2ZW50c0xpc3QsXG4gIGlzTm90aGluZ09yRW1wdHksXG4gIGlzU2FmZUludGVnZXIsXG4gIHRvTnVtYmVyLFxuICB0b0RhdGU6IHRvRGF0ZU9yTnVsbCxcbiAgdG9Cb29sOiB0b0Jvb2xPck51bGwsXG4gIGlzQXJyYXlPZlN0cmluZyxcbiAgZ2V0TG9jayxcbiAgTk9fTE9DSyxcbiAgaXNOb2xvY2ssXG4gIGluc2Vuc2l0aXZlRXF1YWxzLFxuICBwYXVzZSxcbiAgcmV0cnksXG59O1xuIiwiaW1wb3J0IHsgZmlsdGVyLCBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgJCwgaXNTb21ldGhpbmcgfSBmcm9tICcuL2luZGV4JztcblxuZXhwb3J0IGNvbnN0IHN0cmluZ05vdEVtcHR5ID0gcyA9PiBpc1NvbWV0aGluZyhzKSAmJiBzLnRyaW0oKS5sZW5ndGggPiAwO1xuXG5leHBvcnQgY29uc3QgbWFrZXJ1bGUgPSAoZmllbGQsIGVycm9yLCBpc1ZhbGlkKSA9PiAoeyBmaWVsZCwgZXJyb3IsIGlzVmFsaWQgfSk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0aW9uRXJyb3IgPSAocnVsZSwgaXRlbSkgPT4gKHsgLi4ucnVsZSwgaXRlbSB9KTtcblxuZXhwb3J0IGNvbnN0IGFwcGx5UnVsZVNldCA9IHJ1bGVTZXQgPT4gaXRlbVRvVmFsaWRhdGUgPT4gJChydWxlU2V0LCBbXG4gIG1hcChhcHBseVJ1bGUoaXRlbVRvVmFsaWRhdGUpKSxcbiAgZmlsdGVyKGlzU29tZXRoaW5nKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgYXBwbHlSdWxlID0gaXRlbVRvdmFsaWRhdGUgPT4gcnVsZSA9PiAocnVsZS5pc1ZhbGlkKGl0ZW1Ub3ZhbGlkYXRlKVxuICA/IG51bGxcbiAgOiB2YWxpZGF0aW9uRXJyb3IocnVsZSwgaXRlbVRvdmFsaWRhdGUpKTtcbiIsImltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCB7XG4gIGlzVW5kZWZpbmVkLCBrZXlzLCBcbiAgY2xvbmVEZWVwLCBpc0Z1bmN0aW9uLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZGVmaW5lRXJyb3IgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZmlsdGVyRXZhbCA9ICdGSUxURVJfRVZBTFVBVEUnO1xuZXhwb3J0IGNvbnN0IGZpbHRlckNvbXBpbGUgPSAnRklMVEVSX0NPTVBJTEUnO1xuZXhwb3J0IGNvbnN0IG1hcEV2YWwgPSAnTUFQX0VWQUxVQVRFJztcbmV4cG9ydCBjb25zdCBtYXBDb21waWxlID0gJ01BUF9DT01QSUxFJztcbmV4cG9ydCBjb25zdCByZW1vdmVVbmRlY2xhcmVkRmllbGRzID0gJ1JFTU9WRV9VTkRFQ0xBUkVEX0ZJRUxEUyc7XG5leHBvcnQgY29uc3QgYWRkVW5NYXBwZWRGaWVsZHMgPSAnQUREX1VOTUFQUEVEX0ZJRUxEUyc7XG5leHBvcnQgY29uc3QgYWRkVGhlS2V5ID0gJ0FERF9LRVknO1xuXG5cbmNvbnN0IGdldEV2YWx1YXRlUmVzdWx0ID0gKCkgPT4gKHtcbiAgaXNFcnJvcjogZmFsc2UsXG4gIHBhc3NlZEZpbHRlcjogdHJ1ZSxcbiAgcmVzdWx0OiBudWxsLFxufSk7XG5cbmV4cG9ydCBjb25zdCBjb21waWxlRmlsdGVyID0gaW5kZXggPT4gY29tcGlsZUV4cHJlc3Npb24oaW5kZXguZmlsdGVyKTtcblxuZXhwb3J0IGNvbnN0IGNvbXBpbGVNYXAgPSBpbmRleCA9PiBjb21waWxlQ29kZShpbmRleC5tYXApO1xuXG5leHBvcnQgY29uc3QgcGFzc2VzRmlsdGVyID0gKHJlY29yZCwgaW5kZXgpID0+IHtcbiAgY29uc3QgY29udGV4dCA9IHsgcmVjb3JkIH07XG4gIGlmICghaW5kZXguZmlsdGVyKSByZXR1cm4gdHJ1ZTtcblxuICBjb25zdCBjb21waWxlZEZpbHRlciA9IGRlZmluZUVycm9yKFxuICAgICgpID0+IGNvbXBpbGVGaWx0ZXIoaW5kZXgpLFxuICAgIGZpbHRlckNvbXBpbGUsXG4gICk7XG5cbiAgcmV0dXJuIGRlZmluZUVycm9yKFxuICAgICgpID0+IGNvbXBpbGVkRmlsdGVyKGNvbnRleHQpLFxuICAgIGZpbHRlckV2YWwsXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgbWFwUmVjb3JkID0gKHJlY29yZCwgaW5kZXgpID0+IHtcbiAgY29uc3QgcmVjb3JkQ2xvbmUgPSBjbG9uZURlZXAocmVjb3JkKTtcbiAgY29uc3QgY29udGV4dCA9IHsgcmVjb3JkOiByZWNvcmRDbG9uZSB9O1xuXG4gIGNvbnN0IG1hcCA9IGluZGV4Lm1hcCA/IGluZGV4Lm1hcCA6ICdyZXR1cm4gey4uLnJlY29yZH07JztcblxuICBjb25zdCBjb21waWxlZE1hcCA9IGRlZmluZUVycm9yKFxuICAgICgpID0+IGNvbXBpbGVDb2RlKG1hcCksXG4gICAgbWFwQ29tcGlsZSxcbiAgKTtcblxuICBjb25zdCBtYXBwZWQgPSBkZWZpbmVFcnJvcihcbiAgICAoKSA9PiBjb21waWxlZE1hcChjb250ZXh0KSxcbiAgICBtYXBFdmFsLFxuICApO1xuXG4gIGNvbnN0IG1hcHBlZEtleXMgPSBrZXlzKG1hcHBlZCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWFwcGVkS2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGtleSA9IG1hcHBlZEtleXNbaV07XG4gICAgbWFwcGVkW2tleV0gPSBpc1VuZGVmaW5lZChtYXBwZWRba2V5XSkgPyBudWxsIDogbWFwcGVkW2tleV07XG4gICAgaWYgKGlzRnVuY3Rpb24obWFwcGVkW2tleV0pKSB7XG4gICAgICBkZWxldGUgbWFwcGVkW2tleV07XG4gICAgfVxuICB9XG5cbiAgbWFwcGVkLmtleSA9IHJlY29yZC5rZXk7XG4gIG1hcHBlZC5zb3J0S2V5ID0gaW5kZXguZ2V0U29ydEtleVxuICAgID8gY29tcGlsZUNvZGUoaW5kZXguZ2V0U29ydEtleSkoY29udGV4dClcbiAgICA6IHJlY29yZC5pZDtcblxuICByZXR1cm4gbWFwcGVkO1xufTtcblxuZXhwb3J0IGNvbnN0IGV2YWx1YXRlID0gcmVjb3JkID0+IChpbmRleCkgPT4ge1xuICBjb25zdCByZXN1bHQgPSBnZXRFdmFsdWF0ZVJlc3VsdCgpO1xuXG4gIHRyeSB7XG4gICAgcmVzdWx0LnBhc3NlZEZpbHRlciA9IHBhc3Nlc0ZpbHRlcihyZWNvcmQsIGluZGV4KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmVzdWx0LmlzRXJyb3IgPSB0cnVlO1xuICAgIHJlc3VsdC5wYXNzZWRGaWx0ZXIgPSBmYWxzZTtcbiAgICByZXN1bHQucmVzdWx0ID0gZXJyLm1lc3NhZ2U7XG4gIH1cblxuICBpZiAoIXJlc3VsdC5wYXNzZWRGaWx0ZXIpIHJldHVybiByZXN1bHQ7XG5cbiAgdHJ5IHtcbiAgICByZXN1bHQucmVzdWx0ID0gbWFwUmVjb3JkKHJlY29yZCwgaW5kZXgpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXN1bHQuaXNFcnJvciA9IHRydWU7XG4gICAgcmVzdWx0LnJlc3VsdCA9IGVyci5tZXNzYWdlO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGV2YWx1YXRlO1xuIiwiaW1wb3J0IHtcbiAgbWFwLCBpc0VtcHR5LCBjb3VudEJ5LCBcbiAgZmxhdHRlbiwgaW5jbHVkZXMsIGpvaW4sIGtleXNcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7ICB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHsgY29tcGlsZUZpbHRlciwgY29tcGlsZU1hcCB9IGZyb20gJy4uL2luZGV4aW5nL2V2YWx1YXRlJztcbmltcG9ydCB7IGlzTm9uRW1wdHlTdHJpbmcsIGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbiwgJCB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBpc1JlY29yZCB9IGZyb20gJy4vaGllcmFyY2h5JztcblxuZXhwb3J0IGNvbnN0IGluZGV4VHlwZXMgPSB7IHJlZmVyZW5jZTogJ3JlZmVyZW5jZScsIGFuY2VzdG9yOiAnYW5jZXN0b3InIH07XG5cbmV4cG9ydCBjb25zdCBpbmRleFJ1bGVTZXQgPSBbXG4gIG1ha2VydWxlKCdtYXAnLCAnaW5kZXggaGFzIG5vIG1hcCBmdW5jdGlvbicsXG4gICAgaW5kZXggPT4gaXNOb25FbXB0eVN0cmluZyhpbmRleC5tYXApKSxcbiAgbWFrZXJ1bGUoJ21hcCcsIFwiaW5kZXgncyBtYXAgZnVuY3Rpb24gZG9lcyBub3QgY29tcGlsZVwiLFxuICAgIGluZGV4ID0+ICFpc05vbkVtcHR5U3RyaW5nKGluZGV4Lm1hcClcbiAgICAgICAgICAgICAgICB8fCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24oKCkgPT4gY29tcGlsZU1hcChpbmRleCkpKSxcbiAgbWFrZXJ1bGUoJ2ZpbHRlcicsIFwiaW5kZXgncyBmaWx0ZXIgZnVuY3Rpb24gZG9lcyBub3QgY29tcGlsZVwiLFxuICAgIGluZGV4ID0+ICFpc05vbkVtcHR5U3RyaW5nKGluZGV4LmZpbHRlcilcbiAgICAgICAgICAgICAgICB8fCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24oKCkgPT4gY29tcGlsZUZpbHRlcihpbmRleCkpKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnbXVzdCBkZWNsYXJlIGEgbmFtZSBmb3IgaW5kZXgnLFxuICAgIGluZGV4ID0+IGlzTm9uRW1wdHlTdHJpbmcoaW5kZXgubmFtZSkpLFxuICBtYWtlcnVsZSgnbmFtZScsICd0aGVyZSBpcyBhIGR1cGxpY2F0ZSBuYW1lZCBpbmRleCBvbiB0aGlzIG5vZGUnLFxuICAgIGluZGV4ID0+IGlzRW1wdHkoaW5kZXgubmFtZSlcbiAgICAgICAgICAgICAgICB8fCBjb3VudEJ5KCduYW1lJykoaW5kZXgucGFyZW50KCkuaW5kZXhlcylbaW5kZXgubmFtZV0gPT09IDEpLFxuICBtYWtlcnVsZSgnaW5kZXhUeXBlJywgJ3JlZmVyZW5jZSBpbmRleCBtYXkgb25seSBleGlzdCBvbiBhIHJlY29yZCBub2RlJyxcbiAgICBpbmRleCA9PiBpc1JlY29yZChpbmRleC5wYXJlbnQoKSlcbiAgICAgICAgICAgICAgICAgIHx8IGluZGV4LmluZGV4VHlwZSAhPT0gaW5kZXhUeXBlcy5yZWZlcmVuY2UpLFxuICBtYWtlcnVsZSgnaW5kZXhUeXBlJywgYGluZGV4IHR5cGUgbXVzdCBiZSBvbmUgb2Y6ICR7am9pbignLCAnKShrZXlzKGluZGV4VHlwZXMpKX1gLFxuICAgIGluZGV4ID0+IGluY2x1ZGVzKGluZGV4LmluZGV4VHlwZSkoa2V5cyhpbmRleFR5cGVzKSkpLFxuXTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlSW5kZXggPSAoaW5kZXgsIGFsbFJlZmVyZW5jZUluZGV4ZXNPbk5vZGUpID0+IGFwcGx5UnVsZVNldChpbmRleFJ1bGVTZXQoYWxsUmVmZXJlbmNlSW5kZXhlc09uTm9kZSkpKGluZGV4KTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWxsSW5kZXhlcyA9IG5vZGUgPT4gJChub2RlLmluZGV4ZXMsIFtcbiAgbWFwKGkgPT4gdmFsaWRhdGVJbmRleChpLCBub2RlLmluZGV4ZXMpKSxcbiAgZmxhdHRlbixcbl0pO1xuIiwiaW1wb3J0IHtcbiAgZmluZCwgY29uc3RhbnQsIG1hcCwgbGFzdCxcbiAgZmlyc3QsIHNwbGl0LCBpbnRlcnNlY3Rpb24sIHRha2UsXG4gIHVuaW9uLCBpbmNsdWRlcywgZmlsdGVyLCBzb21lLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgJCwgc3dpdGNoQ2FzZSwgaXNOb3RoaW5nLCBpc1NvbWV0aGluZyxcbiAgZGVmYXVsdENhc2UsIHNwbGl0S2V5LCBpc05vbkVtcHR5U3RyaW5nLFxuICBqb2luS2V5LCBnZXRIYXNoQ29kZSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGluZGV4VHlwZXMgfSBmcm9tICcuL2luZGV4ZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0RmxhdHRlbmVkSGllcmFyY2h5ID0gKGFwcEhpZXJhcmNoeSwgdXNlQ2FjaGVkID0gdHJ1ZSkgPT4ge1xuICBpZiAoaXNTb21ldGhpbmcoYXBwSGllcmFyY2h5LmdldEZsYXR0ZW5lZEhpZXJhcmNoeSkgJiYgdXNlQ2FjaGVkKSB7IHJldHVybiBhcHBIaWVyYXJjaHkuZ2V0RmxhdHRlbmVkSGllcmFyY2h5KCk7IH1cblxuICBjb25zdCBmbGF0dGVuSGllcmFyY2h5ID0gKGN1cnJlbnROb2RlLCBmbGF0dGVuZWQpID0+IHtcbiAgICBmbGF0dGVuZWQucHVzaChjdXJyZW50Tm9kZSk7XG4gICAgaWYgKCghY3VycmVudE5vZGUuY2hpbGRyZW5cbiAgICAgICAgICAgIHx8IGN1cnJlbnROb2RlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICYmICghY3VycmVudE5vZGUuaW5kZXhlc1xuICAgICAgICAgICAgfHwgY3VycmVudE5vZGUuaW5kZXhlcy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAmJiAoIWN1cnJlbnROb2RlLmFnZ3JlZ2F0ZUdyb3Vwc1xuICAgICAgICAgICAgfHwgY3VycmVudE5vZGUuYWdncmVnYXRlR3JvdXBzLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgIHJldHVybiBmbGF0dGVuZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgdW5pb25JZkFueSA9IGwyID0+IGwxID0+IHVuaW9uKGwxKSghbDIgPyBbXSA6IGwyKTtcblxuICAgIGNvbnN0IGNoaWxkcmVuID0gJChbXSwgW1xuICAgICAgdW5pb25JZkFueShjdXJyZW50Tm9kZS5jaGlsZHJlbiksXG4gICAgICB1bmlvbklmQW55KGN1cnJlbnROb2RlLmluZGV4ZXMpLFxuICAgICAgdW5pb25JZkFueShjdXJyZW50Tm9kZS5hZ2dyZWdhdGVHcm91cHMpLFxuICAgIF0pO1xuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgZmxhdHRlbkhpZXJhcmNoeShjaGlsZCwgZmxhdHRlbmVkKTtcbiAgICB9XG4gICAgcmV0dXJuIGZsYXR0ZW5lZDtcbiAgfTtcblxuICBhcHBIaWVyYXJjaHkuZ2V0RmxhdHRlbmVkSGllcmFyY2h5ID0gKCkgPT4gZmxhdHRlbkhpZXJhcmNoeShhcHBIaWVyYXJjaHksIFtdKTtcbiAgcmV0dXJuIGFwcEhpZXJhcmNoeS5nZXRGbGF0dGVuZWRIaWVyYXJjaHkoKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRMYXN0UGFydEluS2V5ID0ga2V5ID0+IGxhc3Qoc3BsaXRLZXkoa2V5KSk7XG5cbmV4cG9ydCBjb25zdCBnZXROb2Rlc0luUGF0aCA9IGFwcEhpZXJhcmNoeSA9PiBrZXkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaWx0ZXIobiA9PiBuZXcgUmVnRXhwKGAke24ucGF0aFJlZ3goKX1gKS50ZXN0KGtleSkpLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBnZXRFeGFjdE5vZGVGb3JQYXRoID0gYXBwSGllcmFyY2h5ID0+IGtleSA9PiAkKGFwcEhpZXJhcmNoeSwgW1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGZpbmQobiA9PiBuZXcgUmVnRXhwKGAke24ucGF0aFJlZ3goKX0kYCkudGVzdChrZXkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoID0gYXBwSGllcmFyY2h5ID0+IGNvbGxlY3Rpb25LZXkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gKGlzQ29sbGVjdGlvblJlY29yZChuKVxuICAgICAgICAgICAgICAgICAgICYmIG5ldyBSZWdFeHAoYCR7bi5jb2xsZWN0aW9uUGF0aFJlZ3goKX0kYCkudGVzdChjb2xsZWN0aW9uS2V5KSkpLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBoYXNNYXRjaGluZ0FuY2VzdG9yID0gYW5jZXN0b3JQcmVkaWNhdGUgPT4gZGVjZW5kYW50Tm9kZSA9PiBzd2l0Y2hDYXNlKFxuXG4gIFtub2RlID0+IGlzTm90aGluZyhub2RlLnBhcmVudCgpKSxcbiAgICBjb25zdGFudChmYWxzZSldLFxuXG4gIFtub2RlID0+IGFuY2VzdG9yUHJlZGljYXRlKG5vZGUucGFyZW50KCkpLFxuICAgIGNvbnN0YW50KHRydWUpXSxcblxuICBbZGVmYXVsdENhc2UsXG4gICAgbm9kZSA9PiBoYXNNYXRjaGluZ0FuY2VzdG9yKGFuY2VzdG9yUHJlZGljYXRlKShub2RlLnBhcmVudCgpKV0sXG5cbikoZGVjZW5kYW50Tm9kZSk7XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlID0gKGFwcEhpZXJhcmNoeSwgbm9kZUtleSkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gbi5ub2RlS2V5KCkgPT09IG5vZGVLZXlcbiAgICAgICAgICAgICAgICAgIHx8IChpc0NvbGxlY3Rpb25SZWNvcmQobilcbiAgICAgICAgICAgICAgICAgICAgICAmJiBuLmNvbGxlY3Rpb25Ob2RlS2V5KCkgPT09IG5vZGVLZXkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0Q29sbGVjdGlvbk5vZGUgPSAoYXBwSGllcmFyY2h5LCBub2RlS2V5KSA9PiAkKGFwcEhpZXJhcmNoeSwgW1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGZpbmQobiA9PiAoaXNDb2xsZWN0aW9uUmVjb3JkKG4pXG4gICAgICAgICAgICAgICAgICAgICYmIG4uY29sbGVjdGlvbk5vZGVLZXkoKSA9PT0gbm9kZUtleSkpLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlQnlLZXlPck5vZGVLZXkgPSAoYXBwSGllcmFyY2h5LCBrZXlPck5vZGVLZXkpID0+IHtcbiAgY29uc3Qgbm9kZUJ5S2V5ID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHBIaWVyYXJjaHkpKGtleU9yTm9kZUtleSk7XG4gIHJldHVybiBpc05vdGhpbmcobm9kZUJ5S2V5KVxuICAgID8gZ2V0Tm9kZShhcHBIaWVyYXJjaHksIGtleU9yTm9kZUtleSlcbiAgICA6IG5vZGVCeUtleTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5ID0gKGFwcEhpZXJhcmNoeSwga2V5T3JOb2RlS2V5KSA9PiB7XG4gIGNvbnN0IG5vZGVCeUtleSA9IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHBIaWVyYXJjaHkpKGtleU9yTm9kZUtleSk7XG4gIHJldHVybiBpc05vdGhpbmcobm9kZUJ5S2V5KVxuICAgID8gZ2V0Q29sbGVjdGlvbk5vZGUoYXBwSGllcmFyY2h5LCBrZXlPck5vZGVLZXkpXG4gICAgOiBub2RlQnlLZXk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNOb2RlID0gKGFwcEhpZXJhcmNoeSwga2V5KSA9PiBpc1NvbWV0aGluZyhnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcEhpZXJhcmNoeSkoa2V5KSk7XG5cbmV4cG9ydCBjb25zdCBnZXRBY3R1YWxLZXlPZlBhcmVudCA9IChwYXJlbnROb2RlS2V5LCBhY3R1YWxDaGlsZEtleSkgPT4gJChhY3R1YWxDaGlsZEtleSwgW1xuICBzcGxpdEtleSxcbiAgdGFrZShzcGxpdEtleShwYXJlbnROb2RlS2V5KS5sZW5ndGgpLFxuICBrcyA9PiBqb2luS2V5KC4uLmtzKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0UGFyZW50S2V5ID0gKGtleSkgPT4ge1xuICByZXR1cm4gJChrZXksIFtcbiAgICBzcGxpdEtleSxcbiAgICB0YWtlKHNwbGl0S2V5KGtleSkubGVuZ3RoIC0gMSksXG4gICAgam9pbktleSxcbiAgXSk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNLZXlBbmNlc3Rvck9mID0gYW5jZXN0b3JLZXkgPT4gZGVjZW5kYW50Tm9kZSA9PiBoYXNNYXRjaGluZ0FuY2VzdG9yKHAgPT4gcC5ub2RlS2V5KCkgPT09IGFuY2VzdG9yS2V5KShkZWNlbmRhbnROb2RlKTtcblxuZXhwb3J0IGNvbnN0IGhhc05vTWF0Y2hpbmdBbmNlc3RvcnMgPSBwYXJlbnRQcmVkaWNhdGUgPT4gbm9kZSA9PiAhaGFzTWF0Y2hpbmdBbmNlc3RvcihwYXJlbnRQcmVkaWNhdGUpKG5vZGUpO1xuXG5leHBvcnQgY29uc3QgZmluZEZpZWxkID0gKHJlY29yZE5vZGUsIGZpZWxkTmFtZSkgPT4gZmluZChmID0+IGYubmFtZSA9PSBmaWVsZE5hbWUpKHJlY29yZE5vZGUuZmllbGRzKTtcblxuZXhwb3J0IGNvbnN0IGlzQW5jZXN0b3IgPSBkZWNlbmRhbnQgPT4gYW5jZXN0b3IgPT4gaXNLZXlBbmNlc3Rvck9mKGFuY2VzdG9yLm5vZGVLZXkoKSkoZGVjZW5kYW50KTtcblxuZXhwb3J0IGNvbnN0IGlzRGVjZW5kYW50ID0gYW5jZXN0b3IgPT4gZGVjZW5kYW50ID0+IGlzQW5jZXN0b3IoZGVjZW5kYW50KShhbmNlc3Rvcik7XG5cbmV4cG9ydCBjb25zdCBnZXRSZWNvcmROb2RlSWQgPSByZWNvcmRLZXkgPT4gJChyZWNvcmRLZXksIFtcbiAgc3BsaXRLZXksXG4gIGxhc3QsXG4gIGdldFJlY29yZE5vZGVJZEZyb21JZCxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkTm9kZUlkRnJvbUlkID0gcmVjb3JkSWQgPT4gJChyZWNvcmRJZCwgW3NwbGl0KCctJyksIGZpcnN0LCBwYXJzZUludF0pO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkTm9kZUJ5SWQgPSAoaGllcmFyY2h5LCByZWNvcmRJZCkgPT4gJChoaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gaXNSZWNvcmQobilcbiAgICAgICAgICAgICAgICAgICAgJiYgbi5ub2RlSWQgPT09IGdldFJlY29yZE5vZGVJZEZyb21JZChyZWNvcmRJZCkpLFxuXSk7XG5cbmV4cG9ydCBjb25zdCByZWNvcmROb2RlSWRJc0FsbG93ZWQgPSBpbmRleE5vZGUgPT4gbm9kZUlkID0+IGluZGV4Tm9kZS5hbGxvd2VkUmVjb3JkTm9kZUlkcy5sZW5ndGggPT09IDBcbiAgICB8fCBpbmNsdWRlcyhub2RlSWQpKGluZGV4Tm9kZS5hbGxvd2VkUmVjb3JkTm9kZUlkcyk7XG5cbmV4cG9ydCBjb25zdCByZWNvcmROb2RlSXNBbGxvd2VkID0gaW5kZXhOb2RlID0+IHJlY29yZE5vZGUgPT4gcmVjb3JkTm9kZUlkSXNBbGxvd2VkKGluZGV4Tm9kZSkocmVjb3JkTm9kZS5ub2RlSWQpO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXggPSAoYXBwSGllcmFyY2h5LCBpbmRleE5vZGUpID0+IHtcbiAgY29uc3QgcmVjb3JkTm9kZXMgPSAkKGFwcEhpZXJhcmNoeSwgW1xuICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgICBmaWx0ZXIoaXNSZWNvcmQpLFxuICBdKTtcblxuICBpZiAoaXNHbG9iYWxJbmRleChpbmRleE5vZGUpKSB7XG4gICAgcmV0dXJuICQocmVjb3JkTm9kZXMsIFtcbiAgICAgIGZpbHRlcihyZWNvcmROb2RlSXNBbGxvd2VkKGluZGV4Tm9kZSkpLFxuICAgIF0pO1xuICB9XG5cbiAgaWYgKGlzQW5jZXN0b3JJbmRleChpbmRleE5vZGUpKSB7XG4gICAgcmV0dXJuICQocmVjb3JkTm9kZXMsIFtcbiAgICAgIGZpbHRlcihpc0RlY2VuZGFudChpbmRleE5vZGUucGFyZW50KCkpKSxcbiAgICAgIGZpbHRlcihyZWNvcmROb2RlSXNBbGxvd2VkKGluZGV4Tm9kZSkpLFxuICAgIF0pO1xuICB9XG5cbiAgaWYgKGlzUmVmZXJlbmNlSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIHJldHVybiAkKHJlY29yZE5vZGVzLCBbXG4gICAgICBmaWx0ZXIobiA9PiBzb21lKGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4KGluZGV4Tm9kZSkpKG4uZmllbGRzKSksXG4gICAgXSk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlRnJvbU5vZGVLZXlIYXNoID0gaGllcmFyY2h5ID0+IGhhc2ggPT4gJChoaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gZ2V0SGFzaENvZGUobi5ub2RlS2V5KCkpID09PSBoYXNoKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgaXNSZWNvcmQgPSBub2RlID0+IGlzU29tZXRoaW5nKG5vZGUpICYmIG5vZGUudHlwZSA9PT0gJ3JlY29yZCc7XG5leHBvcnQgY29uc3QgaXNTaW5nbGVSZWNvcmQgPSBub2RlID0+IGlzUmVjb3JkKG5vZGUpICYmIG5vZGUuaXNTaW5nbGU7XG5leHBvcnQgY29uc3QgaXNDb2xsZWN0aW9uUmVjb3JkID0gbm9kZSA9PiBpc1JlY29yZChub2RlKSAmJiAhbm9kZS5pc1NpbmdsZTtcbmV4cG9ydCBjb25zdCBpc0luZGV4ID0gbm9kZSA9PiBpc1NvbWV0aGluZyhub2RlKSAmJiBub2RlLnR5cGUgPT09ICdpbmRleCc7XG5leHBvcnQgY29uc3QgaXNhZ2dyZWdhdGVHcm91cCA9IG5vZGUgPT4gaXNTb21ldGhpbmcobm9kZSkgJiYgbm9kZS50eXBlID09PSAnYWdncmVnYXRlR3JvdXAnO1xuZXhwb3J0IGNvbnN0IGlzU2hhcmRlZEluZGV4ID0gbm9kZSA9PiBpc0luZGV4KG5vZGUpICYmIGlzTm9uRW1wdHlTdHJpbmcobm9kZS5nZXRTaGFyZE5hbWUpO1xuZXhwb3J0IGNvbnN0IGlzUm9vdCA9IG5vZGUgPT4gaXNTb21ldGhpbmcobm9kZSkgJiYgbm9kZS5pc1Jvb3QoKTtcbmV4cG9ydCBjb25zdCBpc0RlY2VuZGFudE9mQVJlY29yZCA9IGhhc01hdGNoaW5nQW5jZXN0b3IoaXNSZWNvcmQpO1xuZXhwb3J0IGNvbnN0IGlzR2xvYmFsSW5kZXggPSBub2RlID0+IGlzSW5kZXgobm9kZSkgJiYgaXNSb290KG5vZGUucGFyZW50KCkpO1xuZXhwb3J0IGNvbnN0IGlzUmVmZXJlbmNlSW5kZXggPSBub2RlID0+IGlzSW5kZXgobm9kZSkgJiYgbm9kZS5pbmRleFR5cGUgPT09IGluZGV4VHlwZXMucmVmZXJlbmNlO1xuZXhwb3J0IGNvbnN0IGlzQW5jZXN0b3JJbmRleCA9IG5vZGUgPT4gaXNJbmRleChub2RlKSAmJiBub2RlLmluZGV4VHlwZSA9PT0gaW5kZXhUeXBlcy5hbmNlc3RvcjtcblxuZXhwb3J0IGNvbnN0IGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUgPSBub2RlID0+IGZpZWxkID0+IGZpZWxkLnR5cGUgPT09ICdyZWZlcmVuY2UnXG4gICAgJiYgaW50ZXJzZWN0aW9uKGZpZWxkLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzKShtYXAoaSA9PiBpLm5vZGVLZXkoKSkobm9kZS5pbmRleGVzKSlcbiAgICAgIC5sZW5ndGggPiAwO1xuXG5leHBvcnQgY29uc3QgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXggPSBpbmRleE5vZGUgPT4gZmllbGQgPT4gZmllbGQudHlwZSA9PT0gJ3JlZmVyZW5jZSdcbiAgICAmJiBpbnRlcnNlY3Rpb24oZmllbGQudHlwZU9wdGlvbnMucmV2ZXJzZUluZGV4Tm9kZUtleXMpKFtpbmRleE5vZGUubm9kZUtleSgpXSlcbiAgICAgIC5sZW5ndGggPiAwO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdldExhc3RQYXJ0SW5LZXksXG4gIGdldE5vZGVzSW5QYXRoLFxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxuICBoYXNNYXRjaGluZ0FuY2VzdG9yLFxuICBnZXROb2RlLFxuICBnZXROb2RlQnlLZXlPck5vZGVLZXksXG4gIGlzTm9kZSxcbiAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQsXG4gIGdldFBhcmVudEtleSxcbiAgaXNLZXlBbmNlc3Rvck9mLFxuICBoYXNOb01hdGNoaW5nQW5jZXN0b3JzLFxuICBmaW5kRmllbGQsXG4gIGlzQW5jZXN0b3IsXG4gIGlzRGVjZW5kYW50LFxuICBnZXRSZWNvcmROb2RlSWQsXG4gIGdldFJlY29yZE5vZGVJZEZyb21JZCxcbiAgZ2V0UmVjb3JkTm9kZUJ5SWQsXG4gIHJlY29yZE5vZGVJZElzQWxsb3dlZCxcbiAgcmVjb3JkTm9kZUlzQWxsb3dlZCxcbiAgZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgsXG4gIGdldE5vZGVGcm9tTm9kZUtleUhhc2gsXG4gIGlzUmVjb3JkLFxuICBpc0NvbGxlY3Rpb25SZWNvcmQsXG4gIGlzSW5kZXgsXG4gIGlzYWdncmVnYXRlR3JvdXAsXG4gIGlzU2hhcmRlZEluZGV4LFxuICBpc1Jvb3QsXG4gIGlzRGVjZW5kYW50T2ZBUmVjb3JkLFxuICBpc0dsb2JhbEluZGV4LFxuICBpc1JlZmVyZW5jZUluZGV4LFxuICBpc0FuY2VzdG9ySW5kZXgsXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUsXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4LFxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG59O1xuIiwiaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgY29uc3RhbnQsIGlzVW5kZWZpbmVkLCBoYXMsXG4gIG1hcFZhbHVlcywgY2xvbmVEZWVwLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgaXNOb3RFbXB0eSB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBnZXRTYWZlRmllbGRQYXJzZXIgPSAodHJ5UGFyc2UsIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucykgPT4gKGZpZWxkLCByZWNvcmQpID0+IHtcbiAgaWYgKGhhcyhmaWVsZC5uYW1lKShyZWNvcmQpKSB7XG4gICAgcmV0dXJuIGdldFNhZmVWYWx1ZVBhcnNlcih0cnlQYXJzZSwgZGVmYXVsdFZhbHVlRnVuY3Rpb25zKShyZWNvcmRbZmllbGQubmFtZV0pO1xuICB9XG4gIHJldHVybiBkZWZhdWx0VmFsdWVGdW5jdGlvbnNbZmllbGQuZ2V0VW5kZWZpbmVkVmFsdWVdKCk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U2FmZVZhbHVlUGFyc2VyID0gKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpID0+ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBwYXJzZWQgPSB0cnlQYXJzZSh2YWx1ZSk7XG4gIGlmIChwYXJzZWQuc3VjY2Vzcykge1xuICAgIHJldHVybiBwYXJzZWQudmFsdWU7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucy5kZWZhdWx0KCk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3VmFsdWUgPSAodHJ5UGFyc2UsIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucykgPT4gKGZpZWxkKSA9PiB7XG4gIGNvbnN0IGdldEluaXRpYWxWYWx1ZSA9IGlzVW5kZWZpbmVkKGZpZWxkKSB8fCBpc1VuZGVmaW5lZChmaWVsZC5nZXRJbml0aWFsVmFsdWUpXG4gICAgPyAnZGVmYXVsdCdcbiAgICA6IGZpZWxkLmdldEluaXRpYWxWYWx1ZTtcblxuICByZXR1cm4gaGFzKGdldEluaXRpYWxWYWx1ZSkoZGVmYXVsdFZhbHVlRnVuY3Rpb25zKVxuICAgID8gZGVmYXVsdFZhbHVlRnVuY3Rpb25zW2dldEluaXRpYWxWYWx1ZV0oKVxuICAgIDogZ2V0U2FmZVZhbHVlUGFyc2VyKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpKGdldEluaXRpYWxWYWx1ZSk7XG59O1xuXG5leHBvcnQgY29uc3QgdHlwZUZ1bmN0aW9ucyA9IHNwZWNpZmljRnVuY3Rpb25zID0+IG1lcmdlKHtcbiAgdmFsdWU6IGNvbnN0YW50LFxuICBudWxsOiBjb25zdGFudChudWxsKSxcbn0sIHNwZWNpZmljRnVuY3Rpb25zKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzID0gdmFsaWRhdGlvblJ1bGVzID0+IGFzeW5jIChmaWVsZCwgcmVjb3JkLCBjb250ZXh0KSA9PiB7XG4gIGNvbnN0IGZpZWxkVmFsdWUgPSByZWNvcmRbZmllbGQubmFtZV07XG4gIGNvbnN0IHZhbGlkYXRlUnVsZSA9IGFzeW5jIHIgPT4gKCFhd2FpdCByLmlzVmFsaWQoZmllbGRWYWx1ZSwgZmllbGQudHlwZU9wdGlvbnMsIGNvbnRleHQpXG4gICAgPyByLmdldE1lc3NhZ2UoZmllbGRWYWx1ZSwgZmllbGQudHlwZU9wdGlvbnMpXG4gICAgOiAnJyk7XG5cbiAgY29uc3QgZXJyb3JzID0gW107XG4gIGZvciAoY29uc3QgciBvZiB2YWxpZGF0aW9uUnVsZXMpIHtcbiAgICBjb25zdCBlcnIgPSBhd2FpdCB2YWxpZGF0ZVJ1bGUocik7XG4gICAgaWYgKGlzTm90RW1wdHkoZXJyKSkgZXJyb3JzLnB1c2goZXJyKTtcbiAgfVxuXG4gIHJldHVybiBlcnJvcnM7XG59O1xuXG5jb25zdCBnZXREZWZhdWx0T3B0aW9ucyA9IG1hcFZhbHVlcyh2ID0+IHYuZGVmYXVsdFZhbHVlKTtcblxuZXhwb3J0IGNvbnN0IG1ha2VydWxlID0gKGlzVmFsaWQsIGdldE1lc3NhZ2UpID0+ICh7IGlzVmFsaWQsIGdldE1lc3NhZ2UgfSk7XG5leHBvcnQgY29uc3QgcGFyc2VkRmFpbGVkID0gdmFsID0+ICh7IHN1Y2Nlc3M6IGZhbHNlLCB2YWx1ZTogdmFsIH0pO1xuZXhwb3J0IGNvbnN0IHBhcnNlZFN1Y2Nlc3MgPSB2YWwgPT4gKHsgc3VjY2VzczogdHJ1ZSwgdmFsdWU6IHZhbCB9KTtcbmV4cG9ydCBjb25zdCBnZXREZWZhdWx0RXhwb3J0ID0gKG5hbWUsIHRyeVBhcnNlLCBmdW5jdGlvbnMsIG9wdGlvbnMsIHZhbGlkYXRpb25SdWxlcywgc2FtcGxlVmFsdWUsIHN0cmluZ2lmeSkgPT4gKHtcbiAgZ2V0TmV3OiBnZXROZXdWYWx1ZSh0cnlQYXJzZSwgZnVuY3Rpb25zKSxcbiAgc2FmZVBhcnNlRmllbGQ6IGdldFNhZmVGaWVsZFBhcnNlcih0cnlQYXJzZSwgZnVuY3Rpb25zKSxcbiAgc2FmZVBhcnNlVmFsdWU6IGdldFNhZmVWYWx1ZVBhcnNlcih0cnlQYXJzZSwgZnVuY3Rpb25zKSxcbiAgdHJ5UGFyc2UsXG4gIG5hbWUsXG4gIGdldERlZmF1bHRPcHRpb25zOiAoKSA9PiBnZXREZWZhdWx0T3B0aW9ucyhjbG9uZURlZXAob3B0aW9ucykpLFxuICBvcHRpb25EZWZpbml0aW9uczogb3B0aW9ucyxcbiAgdmFsaWRhdGVUeXBlQ29uc3RyYWludHM6IHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzKHZhbGlkYXRpb25SdWxlcyksXG4gIHNhbXBsZVZhbHVlLFxuICBzdHJpbmdpZnk6IHZhbCA9PiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkXG4gICAgPyAnJyA6IHN0cmluZ2lmeSh2YWwpKSxcbiAgZ2V0RGVmYXVsdFZhbHVlOiBmdW5jdGlvbnMuZGVmYXVsdCxcbn0pO1xuIiwiaW1wb3J0IHtcbiAgY29uc3RhbnQsIGlzU3RyaW5nLFxuICBpc051bGwsIGluY2x1ZGVzLCBpc0Jvb2xlYW4sXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICB0eXBlRnVuY3Rpb25zLFxuICBtYWtlcnVsZSwgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9Cb29sT3JOdWxsLCB0b051bWJlck9yTnVsbCxcbiAgaXNTYWZlSW50ZWdlciwgaXNBcnJheU9mU3RyaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBzdHJpbmdGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogY29uc3RhbnQobnVsbCksXG59KTtcblxuY29uc3Qgc3RyaW5nVHJ5UGFyc2UgPSBzd2l0Y2hDYXNlKFxuICBbaXNTdHJpbmcsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNOdWxsLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2RlZmF1bHRDYXNlLCB2ID0+IHBhcnNlZFN1Y2Nlc3Modi50b1N0cmluZygpKV0sXG4pO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBtYXhMZW5ndGg6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgaXNWYWxpZDogbiA9PiBuID09PSBudWxsIHx8IGlzU2FmZUludGVnZXIobikgJiYgbiA+IDAsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ21heCBsZW5ndGggbXVzdCBiZSBudWxsIChubyBsaW1pdCkgb3IgYSBncmVhdGVyIHRoYW4gemVybyBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG4gIHZhbHVlczoge1xuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICBpc1ZhbGlkOiB2ID0+IHYgPT09IG51bGwgfHwgKGlzQXJyYXlPZlN0cmluZyh2KSAmJiB2Lmxlbmd0aCA+IDAgJiYgdi5sZW5ndGggPCAxMDAwMCksXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogXCIndmFsdWVzJyBtdXN0IGJlIG51bGwgKG5vIHZhbHVlcykgb3IgYW4gYXJyeSBvZiBhdCBsZWFzdCBvbmUgc3RyaW5nXCIsXG4gICAgcGFyc2U6IHMgPT4gcyxcbiAgfSxcbiAgYWxsb3dEZWNsYXJlZFZhbHVlc09ubHk6IHtcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIGlzVmFsaWQ6IGlzQm9vbGVhbixcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnYWxsb3dEZWNsYXJlZFZhbHVlc09ubHkgbXVzdCBiZSB0cnVlIG9yIGZhbHNlJyxcbiAgICBwYXJzZTogdG9Cb29sT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5tYXhMZW5ndGggPT09IG51bGwgfHwgdmFsLmxlbmd0aCA8PSBvcHRzLm1heExlbmd0aCxcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgZXhjZWVkcyBtYXhpbXVtIGxlbmd0aCBvZiAke29wdHMubWF4TGVuZ3RofWApLFxuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IG9wdHMuYWxsb3dEZWNsYXJlZFZhbHVlc09ubHkgPT09IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBpbmNsdWRlcyh2YWwpKG9wdHMudmFsdWVzKSxcbiAgKHZhbCkgPT4gYFwiJHt2YWx9XCIgZG9lcyBub3QgZXhpc3QgaW4gdGhlIGxpc3Qgb2YgYWxsb3dlZCB2YWx1ZXNgKSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXG4gICdzdHJpbmcnLFxuICBzdHJpbmdUcnlQYXJzZSxcbiAgc3RyaW5nRnVuY3Rpb25zLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gICdhYmNkZScsXG4gIHN0ciA9PiBzdHIsXG4pO1xuIiwiaW1wb3J0IHsgY29uc3RhbnQsIGlzQm9vbGVhbiwgaXNOdWxsIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIHR5cGVGdW5jdGlvbnMsXG4gIG1ha2VydWxlLCBwYXJzZWRGYWlsZWQsIHBhcnNlZFN1Y2Nlc3MsXG4gIGdldERlZmF1bHRFeHBvcnQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIGlzT25lT2YsIHRvQm9vbE9yTnVsbCxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgYm9vbEZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBjb25zdGFudChudWxsKSxcbn0pO1xuXG5jb25zdCBib29sVHJ5UGFyc2UgPSBzd2l0Y2hDYXNlKFxuICBbaXNCb29sZWFuLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXG4gIFtpc09uZU9mKCd0cnVlJywgJzEnLCAneWVzJywgJ29uJyksICgpID0+IHBhcnNlZFN1Y2Nlc3ModHJ1ZSldLFxuICBbaXNPbmVPZignZmFsc2UnLCAnMCcsICdubycsICdvZmYnKSwgKCkgPT4gcGFyc2VkU3VjY2VzcyhmYWxzZSldLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBhbGxvd051bGxzOiB7XG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIGlzVmFsaWQ6IGlzQm9vbGVhbixcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHRydWUgb3IgZmFsc2UnLFxuICAgIHBhcnNlOiB0b0Jvb2xPck51bGwsXG4gIH0sXG59O1xuXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IG9wdHMuYWxsb3dOdWxscyA9PT0gdHJ1ZSB8fCB2YWwgIT09IG51bGwsXG4gICAgKCkgPT4gJ2ZpZWxkIGNhbm5vdCBiZSBudWxsJyksXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxuICAnYm9vbCcsIGJvb2xUcnlQYXJzZSwgYm9vbEZ1bmN0aW9ucyxcbiAgb3B0aW9ucywgdHlwZUNvbnN0cmFpbnRzLCB0cnVlLCBKU09OLnN0cmluZ2lmeSxcbik7XG4iLCJpbXBvcnQge1xuICBjb25zdGFudCwgaXNOdW1iZXIsIGlzU3RyaW5nLCBpc051bGwsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBtYWtlcnVsZSwgdHlwZUZ1bmN0aW9ucyxcbiAgcGFyc2VkRmFpbGVkLCBwYXJzZWRTdWNjZXNzLCBnZXREZWZhdWx0RXhwb3J0LFxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLCB0b051bWJlck9yTnVsbCxcbiAgaXNTYWZlSW50ZWdlcixcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgbnVtYmVyRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XG4gIGRlZmF1bHQ6IGNvbnN0YW50KG51bGwpLFxufSk7XG5cbmNvbnN0IHBhcnNlU3RyaW5ndG9OdW1iZXJPck51bGwgPSAocykgPT4ge1xuICBjb25zdCBudW0gPSBOdW1iZXIocyk7XG4gIHJldHVybiBpc05hTihudW0pID8gcGFyc2VkRmFpbGVkKHMpIDogcGFyc2VkU3VjY2VzcyhudW0pO1xufTtcblxuY29uc3QgbnVtYmVyVHJ5UGFyc2UgPSBzd2l0Y2hDYXNlKFxuICBbaXNOdW1iZXIsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNTdHJpbmcsIHBhcnNlU3RyaW5ndG9OdW1iZXJPck51bGxdLFxuICBbaXNOdWxsLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2RlZmF1bHRDYXNlLCBwYXJzZWRGYWlsZWRdLFxuKTtcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgbWF4VmFsdWU6IHtcbiAgICBkZWZhdWx0VmFsdWU6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICAgIGlzVmFsaWQ6IGlzU2FmZUludGVnZXIsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB2YWxpZCBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG4gIG1pblZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiAwIC0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIsXG4gICAgaXNWYWxpZDogaXNTYWZlSW50ZWdlcixcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHZhbGlkIGludGVnZXInLFxuICAgIHBhcnNlOiB0b051bWJlck9yTnVsbCxcbiAgfSxcbiAgZGVjaW1hbFBsYWNlczoge1xuICAgIGRlZmF1bHRWYWx1ZTogMCxcbiAgICBpc1ZhbGlkOiBuID0+IGlzU2FmZUludGVnZXIobikgJiYgbiA+PSAwLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlcicsXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgZ2V0RGVjaW1hbFBsYWNlcyA9ICh2YWwpID0+IHtcbiAgY29uc3Qgc3BsaXREZWNpbWFsID0gdmFsLnRvU3RyaW5nKCkuc3BsaXQoJy4nKTtcbiAgaWYgKHNwbGl0RGVjaW1hbC5sZW5ndGggPT09IDEpIHJldHVybiAwO1xuICByZXR1cm4gc3BsaXREZWNpbWFsWzFdLmxlbmd0aDtcbn07XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWluVmFsdWUgPT09IG51bGwgfHwgdmFsID49IG9wdHMubWluVmFsdWUsXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlICgke3ZhbC50b1N0cmluZygpfSkgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtvcHRzLm1pblZhbHVlfWApLFxuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5tYXhWYWx1ZSA9PT0gbnVsbCB8fCB2YWwgPD0gb3B0cy5tYXhWYWx1ZSxcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgKCR7dmFsLnRvU3RyaW5nKCl9KSBtdXN0IGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke29wdHMubWluVmFsdWV9IG9wdGlvbnNgKSxcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMuZGVjaW1hbFBsYWNlcyA+PSBnZXREZWNpbWFsUGxhY2VzKHZhbCksXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlICgke3ZhbC50b1N0cmluZygpfSkgbXVzdCBoYXZlICR7b3B0cy5kZWNpbWFsUGxhY2VzfSBkZWNpbWFsIHBsYWNlcyBvciBsZXNzYCksXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxuICAnbnVtYmVyJyxcbiAgbnVtYmVyVHJ5UGFyc2UsXG4gIG51bWJlckZ1bmN0aW9ucyxcbiAgb3B0aW9ucyxcbiAgdHlwZUNvbnN0cmFpbnRzLFxuICAxLFxuICBudW0gPT4gbnVtLnRvU3RyaW5nKCksXG4pO1xuIiwiaW1wb3J0IHtcbiAgY29uc3RhbnQsIGlzRGF0ZSwgaXNTdHJpbmcsIGlzTnVsbFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgbWFrZXJ1bGUsIHR5cGVGdW5jdGlvbnMsXG4gIHBhcnNlZEZhaWxlZCwgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9EYXRlT3JOdWxsLFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBkYXRlRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XG4gIGRlZmF1bHQ6IGNvbnN0YW50KG51bGwpLFxuICBub3c6ICgpID0+IG5ldyBEYXRlKCksXG59KTtcblxuY29uc3QgaXNWYWxpZERhdGUgPSBkID0+IGQgaW5zdGFuY2VvZiBEYXRlICYmICFpc05hTihkKTtcblxuY29uc3QgcGFyc2VTdHJpbmdUb0RhdGUgPSBzID0+IHN3aXRjaENhc2UoXG4gIFtpc1ZhbGlkRGF0ZSwgcGFyc2VkU3VjY2Vzc10sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbikobmV3IERhdGUocykpO1xuXG5cbmNvbnN0IGRhdGVUcnlQYXJzZSA9IHN3aXRjaENhc2UoXG4gIFtpc0RhdGUsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNTdHJpbmcsIHBhcnNlU3RyaW5nVG9EYXRlXSxcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbik7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIG1heFZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBuZXcgRGF0ZSgzMjUwMzY4MDAwMDAwMCksXG4gICAgaXNWYWxpZDogaXNEYXRlLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgdmFsaWQgZGF0ZScsXG4gICAgcGFyc2U6IHRvRGF0ZU9yTnVsbCxcbiAgfSxcbiAgbWluVmFsdWU6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG5ldyBEYXRlKC04NTIwMzM2MDAwMDAwKSxcbiAgICBpc1ZhbGlkOiBpc0RhdGUsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB2YWxpZCBkYXRlJyxcbiAgICBwYXJzZTogdG9EYXRlT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5taW5WYWx1ZSA9PT0gbnVsbCB8fCB2YWwgPj0gb3B0cy5taW5WYWx1ZSxcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgKCR7dmFsLnRvU3RyaW5nKCl9KSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAke29wdHMubWluVmFsdWV9YCksXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCBvcHRzLm1heFZhbHVlID09PSBudWxsIHx8IHZhbCA8PSBvcHRzLm1heFZhbHVlLFxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSAoJHt2YWwudG9TdHJpbmcoKX0pIG11c3QgYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvICR7b3B0cy5taW5WYWx1ZX0gb3B0aW9uc2ApLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcbiAgJ2RhdGV0aW1lJyxcbiAgZGF0ZVRyeVBhcnNlLFxuICBkYXRlRnVuY3Rpb25zLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gIG5ldyBEYXRlKDE5ODQsIDQsIDEpLFxuICBkYXRlID0+IEpTT04uc3RyaW5naWZ5KGRhdGUpLnJlcGxhY2UobmV3IFJlZ0V4cCgnXCInLCAnZycpLCAnJyksXG4pO1xuIiwiaW1wb3J0IHsgXG4gIG1hcCwgIGNvbnN0YW50LCBpc0FycmF5IFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgdHlwZUZ1bmN0aW9ucywgbWFrZXJ1bGUsXG4gIHBhcnNlZEZhaWxlZCwgZ2V0RGVmYXVsdEV4cG9ydCwgcGFyc2VkU3VjY2Vzcyxcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9OdW1iZXJPck51bGwsXG4gICQkLCBpc1NhZmVJbnRlZ2VyLFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBhcnJheUZ1bmN0aW9ucyA9ICgpID0+IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBjb25zdGFudChbXSksXG59KTtcblxuY29uc3QgbWFwVG9QYXJzZWRBcnJhcnkgPSB0eXBlID0+ICQkKFxuICBtYXAoaSA9PiB0eXBlLnNhZmVQYXJzZVZhbHVlKGkpKSxcbiAgcGFyc2VkU3VjY2Vzcyxcbik7XG5cbmNvbnN0IGFycmF5VHJ5UGFyc2UgPSB0eXBlID0+IHN3aXRjaENhc2UoXG4gIFtpc0FycmF5LCBtYXBUb1BhcnNlZEFycmFyeSh0eXBlKV0sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbik7XG5cbmNvbnN0IHR5cGVOYW1lID0gdHlwZSA9PiBgYXJyYXk8JHt0eXBlfT5gO1xuXG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIG1heExlbmd0aDoge1xuICAgIGRlZmF1bHRWYWx1ZTogMTAwMDAsXG4gICAgaXNWYWxpZDogaXNTYWZlSW50ZWdlcixcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXInLFxuICAgIHBhcnNlOiB0b051bWJlck9yTnVsbCxcbiAgfSxcbiAgbWluTGVuZ3RoOiB7XG4gICAgZGVmYXVsdFZhbHVlOiAwLFxuICAgIGlzVmFsaWQ6IG4gPT4gaXNTYWZlSW50ZWdlcihuKSAmJiBuID49IDAsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG59O1xuXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCB2YWwubGVuZ3RoID49IG9wdHMubWluTGVuZ3RoLFxuICAgICh2YWwsIG9wdHMpID0+IGBtdXN0IGNob29zZSAke29wdHMubWluTGVuZ3RofSBvciBtb3JlIG9wdGlvbnNgKSxcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IHZhbC5sZW5ndGggPD0gb3B0cy5tYXhMZW5ndGgsXG4gICAgKHZhbCwgb3B0cykgPT4gYGNhbm5vdCBjaG9vc2UgbW9yZSB0aGFuICR7b3B0cy5tYXhMZW5ndGh9IG9wdGlvbnNgKSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IHR5cGUgPT4gZ2V0RGVmYXVsdEV4cG9ydChcbiAgdHlwZU5hbWUodHlwZS5uYW1lKSxcbiAgYXJyYXlUcnlQYXJzZSh0eXBlKSxcbiAgYXJyYXlGdW5jdGlvbnModHlwZSksXG4gIG9wdGlvbnMsXG4gIHR5cGVDb25zdHJhaW50cyxcbiAgW3R5cGUuc2FtcGxlVmFsdWVdLFxuICBKU09OLnN0cmluZ2lmeSxcbik7XG4iLCJpbXBvcnQge1xuICBpc1N0cmluZywgaXNPYmplY3RMaWtlLFxuICBpc051bGwsIGhhcywgaXNFbXB0eSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIHR5cGVGdW5jdGlvbnMsIG1ha2VydWxlLFxuICBwYXJzZWRTdWNjZXNzLCBnZXREZWZhdWx0RXhwb3J0LFxuICBwYXJzZWRGYWlsZWQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsXG4gIGlzTm9uRW1wdHlTdHJpbmcsIGlzQXJyYXlPZlN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgcmVmZXJlbmNlTm90aGluZyA9ICgpID0+ICh7IGtleTogJycgfSk7XG5cbmNvbnN0IHJlZmVyZW5jZUZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiByZWZlcmVuY2VOb3RoaW5nLFxufSk7XG5cbmNvbnN0IGhhc1N0cmluZ1ZhbHVlID0gKG9iLCBwYXRoKSA9PiBoYXMocGF0aCkob2IpXG4gICAgJiYgaXNTdHJpbmcob2JbcGF0aF0pO1xuXG5jb25zdCBpc09iamVjdFdpdGhLZXkgPSB2ID0+IGlzT2JqZWN0TGlrZSh2KVxuICAgICYmIGhhc1N0cmluZ1ZhbHVlKHYsICdrZXknKTtcblxuY29uc3QgdHJ5UGFyc2VGcm9tU3RyaW5nID0gcyA9PiB7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBhc09iaiA9IEpTT04ucGFyc2Uocyk7XG4gICAgaWYoaXNPYmplY3RXaXRoS2V5KSB7XG4gICAgICByZXR1cm4gcGFyc2VkU3VjY2Vzcyhhc09iaik7XG4gICAgfVxuICB9XG4gIGNhdGNoKF8pIHtcbiAgICAvLyBFTVBUWVxuICB9XG5cbiAgcmV0dXJuIHBhcnNlZEZhaWxlZChzKTtcbn1cblxuY29uc3QgcmVmZXJlbmNlVHJ5UGFyc2UgPSB2ID0+IHN3aXRjaENhc2UoXG4gIFtpc09iamVjdFdpdGhLZXksIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNTdHJpbmcsIHRyeVBhcnNlRnJvbVN0cmluZ10sXG4gIFtpc051bGwsICgpID0+IHBhcnNlZFN1Y2Nlc3MocmVmZXJlbmNlTm90aGluZygpKV0sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbikodik7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIGluZGV4Tm9kZUtleToge1xuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICBpc1ZhbGlkOiBpc05vbkVtcHR5U3RyaW5nLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZycsXG4gICAgcGFyc2U6IHMgPT4gcyxcbiAgfSxcbiAgZGlzcGxheVZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiAnJyxcbiAgICBpc1ZhbGlkOiBpc05vbkVtcHR5U3RyaW5nLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZycsXG4gICAgcGFyc2U6IHMgPT4gcyxcbiAgfSxcbiAgcmV2ZXJzZUluZGV4Tm9kZUtleXM6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgaXNWYWxpZDogdiA9PiBpc0FycmF5T2ZTdHJpbmcodikgJiYgdi5sZW5ndGggPiAwLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgbm9uLWVtcHR5IGFycmF5IG9mIHN0cmluZ3MnLFxuICAgIHBhcnNlOiBzID0+IHMsXG4gIH0sXG59O1xuXG5jb25zdCBpc0VtcHR5U3RyaW5nID0gcyA9PiBpc1N0cmluZyhzKSAmJiBpc0VtcHR5KHMpO1xuXG5jb25zdCBlbnN1cmVSZWZlcmVuY2VFeGlzdHMgPSBhc3luYyAodmFsLCBvcHRzLCBjb250ZXh0KSA9PiBpc0VtcHR5U3RyaW5nKHZhbC5rZXkpXG4gICAgfHwgYXdhaXQgY29udGV4dC5yZWZlcmVuY2VFeGlzdHMob3B0cywgdmFsLmtleSk7XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcbiAgbWFrZXJ1bGUoXG4gICAgZW5zdXJlUmVmZXJlbmNlRXhpc3RzLFxuICAgICh2YWwsIG9wdHMpID0+IGBcIiR7dmFsW29wdHMuZGlzcGxheVZhbHVlXX1cIiBkb2VzIG5vdCBleGlzdCBpbiBvcHRpb25zIGxpc3QgKGtleTogJHt2YWwua2V5fSlgLFxuICApLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcbiAgJ3JlZmVyZW5jZScsXG4gIHJlZmVyZW5jZVRyeVBhcnNlLFxuICByZWZlcmVuY2VGdW5jdGlvbnMsXG4gIG9wdGlvbnMsXG4gIHR5cGVDb25zdHJhaW50cyxcbiAgeyBrZXk6ICdrZXknLCB2YWx1ZTogJ3ZhbHVlJyB9LFxuICBKU09OLnN0cmluZ2lmeSxcbik7XG4iLCJpbXBvcnQge1xuICBsYXN0LCBoYXMsIGlzU3RyaW5nLCBpbnRlcnNlY3Rpb24sXG4gIGlzTnVsbCwgaXNOdW1iZXIsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICB0eXBlRnVuY3Rpb25zLCBwYXJzZWRGYWlsZWQsXG4gIHBhcnNlZFN1Y2Nlc3MsIGdldERlZmF1bHRFeHBvcnQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIG5vbmUsXG4gICQsIHNwbGl0S2V5LFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBpbGxlZ2FsQ2hhcmFjdGVycyA9ICcqP1xcXFwvOjw+fFxcMFxcYlxcZlxcdic7XG5cbmV4cG9ydCBjb25zdCBpc0xlZ2FsRmlsZW5hbWUgPSAoZmlsZVBhdGgpID0+IHtcbiAgY29uc3QgZm4gPSBmaWxlTmFtZShmaWxlUGF0aCk7XG4gIHJldHVybiBmbi5sZW5ndGggPD0gMjU1XG4gICAgJiYgaW50ZXJzZWN0aW9uKGZuLnNwbGl0KCcnKSkoaWxsZWdhbENoYXJhY3RlcnMuc3BsaXQoJycpKS5sZW5ndGggPT09IDBcbiAgICAmJiBub25lKGYgPT4gZiA9PT0gJy4uJykoc3BsaXRLZXkoZmlsZVBhdGgpKTtcbn07XG5cbmNvbnN0IGZpbGVOb3RoaW5nID0gKCkgPT4gKHsgcmVsYXRpdmVQYXRoOiAnJywgc2l6ZTogMCB9KTtcblxuY29uc3QgZmlsZUZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBmaWxlTm90aGluZyxcbn0pO1xuXG5jb25zdCBmaWxlVHJ5UGFyc2UgPSB2ID0+IHN3aXRjaENhc2UoXG4gIFtpc1ZhbGlkRmlsZSwgcGFyc2VkU3VjY2Vzc10sXG4gIFtpc051bGwsICgpID0+IHBhcnNlZFN1Y2Nlc3MoZmlsZU5vdGhpbmcoKSldLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pKHYpO1xuXG5jb25zdCBmaWxlTmFtZSA9IGZpbGVQYXRoID0+ICQoZmlsZVBhdGgsIFtcbiAgc3BsaXRLZXksXG4gIGxhc3QsXG5dKTtcblxuY29uc3QgaXNWYWxpZEZpbGUgPSBmID0+ICFpc051bGwoZilcbiAgICAmJiBoYXMoJ3JlbGF0aXZlUGF0aCcpKGYpICYmIGhhcygnc2l6ZScpKGYpXG4gICAgJiYgaXNOdW1iZXIoZi5zaXplKVxuICAgICYmIGlzU3RyaW5nKGYucmVsYXRpdmVQYXRoKVxuICAgICYmIGlzTGVnYWxGaWxlbmFtZShmLnJlbGF0aXZlUGF0aCk7XG5cbmNvbnN0IG9wdGlvbnMgPSB7fTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW107XG5cbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXG4gICdmaWxlJyxcbiAgZmlsZVRyeVBhcnNlLFxuICBmaWxlRnVuY3Rpb25zLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gIHsgcmVsYXRpdmVQYXRoOiAnc29tZV9maWxlLmpwZycsIHNpemU6IDEwMDAgfSxcbiAgSlNPTi5zdHJpbmdpZnksXG4pO1xuIiwiaW1wb3J0IHtcbiAgYXNzaWduLCBtZXJnZSwgXG59IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICBtYXAsIGlzU3RyaW5nLCBpc051bWJlcixcbiAgaXNCb29sZWFuLCBpc0RhdGUsIGtleXMsXG4gIGlzT2JqZWN0LCBpc0FycmF5LCBoYXNcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7ICQgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGFyc2VkU3VjY2VzcyB9IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHN0cmluZyBmcm9tICcuL3N0cmluZyc7XG5pbXBvcnQgYm9vbCBmcm9tICcuL2Jvb2wnO1xuaW1wb3J0IG51bWJlciBmcm9tICcuL251bWJlcic7XG5pbXBvcnQgZGF0ZXRpbWUgZnJvbSAnLi9kYXRldGltZSc7XG5pbXBvcnQgYXJyYXkgZnJvbSAnLi9hcnJheSc7XG5pbXBvcnQgcmVmZXJlbmNlIGZyb20gJy4vcmVmZXJlbmNlJztcbmltcG9ydCBmaWxlIGZyb20gJy4vZmlsZSc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuY29uc3QgYWxsVHlwZXMgPSAoKSA9PiB7XG4gIGNvbnN0IGJhc2ljVHlwZXMgPSB7XG4gICAgc3RyaW5nLCBudW1iZXIsIGRhdGV0aW1lLCBib29sLCByZWZlcmVuY2UsIGZpbGUsXG4gIH07XG5cbiAgY29uc3QgYXJyYXlzID0gJChiYXNpY1R5cGVzLCBbXG4gICAga2V5cyxcbiAgICBtYXAoKGspID0+IHtcbiAgICAgIGNvbnN0IGt2VHlwZSA9IHt9O1xuICAgICAgY29uc3QgY29uY3JldGVBcnJheSA9IGFycmF5KGJhc2ljVHlwZXNba10pO1xuICAgICAga3ZUeXBlW2NvbmNyZXRlQXJyYXkubmFtZV0gPSBjb25jcmV0ZUFycmF5O1xuICAgICAgcmV0dXJuIGt2VHlwZTtcbiAgICB9KSxcbiAgICB0eXBlcyA9PiBhc3NpZ24oe30sIC4uLnR5cGVzKSxcbiAgXSk7XG5cbiAgcmV0dXJuIG1lcmdlKHt9LCBiYXNpY1R5cGVzLCBhcnJheXMpO1xufTtcblxuXG5leHBvcnQgY29uc3QgYWxsID0gYWxsVHlwZXMoKTtcblxuZXhwb3J0IGNvbnN0IGdldFR5cGUgPSAodHlwZU5hbWUpID0+IHtcbiAgaWYgKCFoYXModHlwZU5hbWUpKGFsbCkpIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYERvIG5vdCByZWNvZ25pc2UgdHlwZSAke3R5cGVOYW1lfWApO1xuICByZXR1cm4gYWxsW3R5cGVOYW1lXTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRTYW1wbGVGaWVsZFZhbHVlID0gZmllbGQgPT4gZ2V0VHlwZShmaWVsZC50eXBlKS5zYW1wbGVWYWx1ZTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0ZpZWxkVmFsdWUgPSBmaWVsZCA9PiBnZXRUeXBlKGZpZWxkLnR5cGUpLmdldE5ldyhmaWVsZCk7XG5cbmV4cG9ydCBjb25zdCBzYWZlUGFyc2VGaWVsZCA9IChmaWVsZCwgcmVjb3JkKSA9PiBnZXRUeXBlKGZpZWxkLnR5cGUpLnNhZmVQYXJzZUZpZWxkKGZpZWxkLCByZWNvcmQpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVGaWVsZFBhcnNlID0gKGZpZWxkLCByZWNvcmQpID0+IChoYXMoZmllbGQubmFtZSkocmVjb3JkKVxuICA/IGdldFR5cGUoZmllbGQudHlwZSkudHJ5UGFyc2UocmVjb3JkW2ZpZWxkLm5hbWVdKVxuICA6IHBhcnNlZFN1Y2Nlc3ModW5kZWZpbmVkKSk7IC8vIGZpZWxkcyBtYXkgYmUgdW5kZWZpbmVkIGJ5IGRlZmF1bHRcblxuZXhwb3J0IGNvbnN0IGdldERlZmF1bHRPcHRpb25zID0gdHlwZSA9PiBnZXRUeXBlKHR5cGUpLmdldERlZmF1bHRPcHRpb25zKCk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyA9IGFzeW5jIChmaWVsZCwgcmVjb3JkLCBjb250ZXh0KSA9PiBhd2FpdCBnZXRUeXBlKGZpZWxkLnR5cGUpLnZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzKGZpZWxkLCByZWNvcmQsIGNvbnRleHQpO1xuXG5leHBvcnQgY29uc3QgZGV0ZWN0VHlwZSA9ICh2YWx1ZSkgPT4ge1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSByZXR1cm4gc3RyaW5nO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSkgcmV0dXJuIGJvb2w7XG4gIGlmIChpc051bWJlcih2YWx1ZSkpIHJldHVybiBudW1iZXI7XG4gIGlmIChpc0RhdGUodmFsdWUpKSByZXR1cm4gZGF0ZXRpbWU7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkgcmV0dXJuIGFycmF5KGRldGVjdFR5cGUodmFsdWVbMF0pKTtcbiAgaWYgKGlzT2JqZWN0KHZhbHVlKVxuICAgICAgICYmIGhhcygna2V5JykodmFsdWUpXG4gICAgICAgJiYgaGFzKCd2YWx1ZScpKHZhbHVlKSkgcmV0dXJuIHJlZmVyZW5jZTtcbiAgaWYgKGlzT2JqZWN0KHZhbHVlKVxuICAgICAgICAmJiBoYXMoJ3JlbGF0aXZlUGF0aCcpKHZhbHVlKVxuICAgICAgICAmJiBoYXMoJ3NpemUnKSh2YWx1ZSkpIHJldHVybiBmaWxlO1xuXG4gIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYGNhbm5vdCBkZXRlcm1pbmUgdHlwZTogJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSl9YCk7XG59O1xuIiwiaW1wb3J0IHsgY2xvbmUsIGZpbmQsIHNwbGl0IH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGpvaW5LZXksICQgfSBmcm9tICcuLi9jb21tb24nO1xuLy8gNSBtaW51dGVzXG5leHBvcnQgY29uc3QgdGVtcENvZGVFeHBpcnlMZW5ndGggPSA1ICogNjAgKiAxMDAwO1xuXG5leHBvcnQgY29uc3QgQVVUSF9GT0xERVIgPSAnLy5hdXRoJztcbmV4cG9ydCBjb25zdCBVU0VSU19MSVNUX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAndXNlcnMuanNvbicpO1xuZXhwb3J0IGNvbnN0IHVzZXJBdXRoRmlsZSA9IHVzZXJuYW1lID0+IGpvaW5LZXkoQVVUSF9GT0xERVIsIGBhdXRoXyR7dXNlcm5hbWV9Lmpzb25gKTtcbmV4cG9ydCBjb25zdCBVU0VSU19MT0NLX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAndXNlcnNfbG9jaycpO1xuZXhwb3J0IGNvbnN0IEFDQ0VTU19MRVZFTFNfRklMRSA9IGpvaW5LZXkoQVVUSF9GT0xERVIsICdhY2Nlc3NfbGV2ZWxzLmpzb24nKTtcbmV4cG9ydCBjb25zdCBBQ0NFU1NfTEVWRUxTX0xPQ0tfRklMRSA9IGpvaW5LZXkoQVVUSF9GT0xERVIsICdhY2Nlc3NfbGV2ZWxzX2xvY2snKTtcblxuZXhwb3J0IGNvbnN0IHBlcm1pc3Npb25UeXBlcyA9IHtcbiAgQ1JFQVRFX1JFQ09SRDogJ2NyZWF0ZSByZWNvcmQnLFxuICBVUERBVEVfUkVDT1JEOiAndXBkYXRlIHJlY29yZCcsXG4gIFJFQURfUkVDT1JEOiAncmVhZCByZWNvcmQnLFxuICBERUxFVEVfUkVDT1JEOiAnZGVsZXRlIHJlY29yZCcsXG4gIFJFQURfSU5ERVg6ICdyZWFkIGluZGV4JyxcbiAgTUFOQUdFX0lOREVYOiAnbWFuYWdlIGluZGV4JyxcbiAgTUFOQUdFX0NPTExFQ1RJT046ICdtYW5hZ2UgY29sbGVjdGlvbicsXG4gIFdSSVRFX1RFTVBMQVRFUzogJ3dyaXRlIHRlbXBsYXRlcycsXG4gIENSRUFURV9VU0VSOiAnY3JlYXRlIHVzZXInLFxuICBTRVRfUEFTU1dPUkQ6ICdzZXQgcGFzc3dvcmQnLFxuICBDUkVBVEVfVEVNUE9SQVJZX0FDQ0VTUzogJ2NyZWF0ZSB0ZW1wb3JhcnkgYWNjZXNzJyxcbiAgRU5BQkxFX0RJU0FCTEVfVVNFUjogJ2VuYWJsZSBvciBkaXNhYmxlIHVzZXInLFxuICBXUklURV9BQ0NFU1NfTEVWRUxTOiAnd3JpdGUgYWNjZXNzIGxldmVscycsXG4gIExJU1RfVVNFUlM6ICdsaXN0IHVzZXJzJyxcbiAgTElTVF9BQ0NFU1NfTEVWRUxTOiAnbGlzdCBhY2Nlc3MgbGV2ZWxzJyxcbiAgRVhFQ1VURV9BQ1RJT046ICdleGVjdXRlIGFjdGlvbicsXG4gIFNFVF9VU0VSX0FDQ0VTU19MRVZFTFM6ICdzZXQgdXNlciBhY2Nlc3MgbGV2ZWxzJyxcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRVc2VyQnlOYW1lID0gKHVzZXJzLCBuYW1lKSA9PiAkKHVzZXJzLCBbXG4gIGZpbmQodSA9PiB1Lm5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZS50b0xvd2VyQ2FzZSgpKSxcbl0pO1xuXG5leHBvcnQgY29uc3Qgc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZiA9ICh1c2VyKSA9PiB7XG4gIGNvbnN0IHN0cmlwcGVkID0gY2xvbmUodXNlcik7XG4gIGRlbGV0ZSBzdHJpcHBlZC50ZW1wQ29kZTtcbiAgcmV0dXJuIHN0cmlwcGVkO1xufTtcblxuZXhwb3J0IGNvbnN0IHBhcnNlVGVtcG9yYXJ5Q29kZSA9IGZ1bGxDb2RlID0+ICQoZnVsbENvZGUsIFtcbiAgc3BsaXQoJzonKSxcbiAgcGFydHMgPT4gKHtcbiAgICBpZDogcGFydHNbMV0sXG4gICAgY29kZTogcGFydHNbMl0sXG4gIH0pLFxuXSk7XG4iLCJpbXBvcnQgeyB2YWx1ZXMsIGluY2x1ZGVzLCBzb21lIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHBlcm1pc3Npb25UeXBlcyB9IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQge1xuICAkLCBpc05vdGhpbmcsIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXROb2RlQnlLZXlPck5vZGVLZXksIGlzTm9kZSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBpc0F1dGhvcml6ZWQgPSBhcHAgPT4gKHBlcm1pc3Npb25UeXBlLCByZXNvdXJjZUtleSkgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuaXNBdXRob3JpemVkLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHJlc291cmNlS2V5LCBwZXJtaXNzaW9uVHlwZSB9LFxuICBfaXNBdXRob3JpemVkLCBhcHAsIHBlcm1pc3Npb25UeXBlLCByZXNvdXJjZUtleSxcbik7XG5cbmV4cG9ydCBjb25zdCBfaXNBdXRob3JpemVkID0gKGFwcCwgcGVybWlzc2lvblR5cGUsIHJlc291cmNlS2V5KSA9PiB7XG4gIGlmICghYXBwLnVzZXIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCB2YWxpZFR5cGUgPSAkKHBlcm1pc3Npb25UeXBlcywgW1xuICAgIHZhbHVlcyxcbiAgICBpbmNsdWRlcyhwZXJtaXNzaW9uVHlwZSksXG4gIF0pO1xuXG4gIGlmICghdmFsaWRUeXBlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgcGVybU1hdGNoZXNSZXNvdXJjZSA9ICh1c2VycGVybSkgPT4ge1xuICAgIGNvbnN0IG5vZGVLZXkgPSBpc05vdGhpbmcocmVzb3VyY2VLZXkpXG4gICAgICA/IG51bGxcbiAgICAgIDogaXNOb2RlKGFwcC5oaWVyYXJjaHksIHJlc291cmNlS2V5KVxuICAgICAgICA/IGdldE5vZGVCeUtleU9yTm9kZUtleShcbiAgICAgICAgICBhcHAuaGllcmFyY2h5LCByZXNvdXJjZUtleSxcbiAgICAgICAgKS5ub2RlS2V5KClcbiAgICAgICAgOiByZXNvdXJjZUtleTtcblxuICAgIHJldHVybiAodXNlcnBlcm0udHlwZSA9PT0gcGVybWlzc2lvblR5cGUpXG4gICAgICAgICYmIChcbiAgICAgICAgICBpc05vdGhpbmcocmVzb3VyY2VLZXkpXG4gICAgICAgICAgICB8fCBub2RlS2V5ID09PSB1c2VycGVybS5ub2RlS2V5XG4gICAgICAgICk7XG4gIH07XG5cbiAgcmV0dXJuICQoYXBwLnVzZXIucGVybWlzc2lvbnMsIFtcbiAgICBzb21lKHBlcm1NYXRjaGVzUmVzb3VyY2UpLFxuICBdKTtcbn07XG4iLCJpbXBvcnQgeyBwZXJtaXNzaW9uVHlwZXMgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgaXNBdXRob3JpemVkIH0gZnJvbSAnLi9pc0F1dGhvcml6ZWQnO1xuXG5leHBvcnQgY29uc3QgdGVtcG9yYXJ5QWNjZXNzUGVybWlzc2lvbnMgPSAoKSA9PiAoW3sgdHlwZTogcGVybWlzc2lvblR5cGVzLlNFVF9QQVNTV09SRCB9XSk7XG5cbmNvbnN0IG5vZGVQZXJtaXNzaW9uID0gdHlwZSA9PiAoe1xuICBhZGQ6IChub2RlS2V5LCBhY2Nlc3NMZXZlbCkgPT4gYWNjZXNzTGV2ZWwucGVybWlzc2lvbnMucHVzaCh7IHR5cGUsIG5vZGVLZXkgfSksXG4gIGlzQXV0aG9yaXplZDogcmVzb3VyY2VLZXkgPT4gYXBwID0+IGlzQXV0aG9yaXplZChhcHApKHR5cGUsIHJlc291cmNlS2V5KSxcbiAgaXNOb2RlOiB0cnVlLFxuICBnZXQ6IG5vZGVLZXkgPT4gKHsgdHlwZSwgbm9kZUtleSB9KSxcbn0pO1xuXG5jb25zdCBzdGF0aWNQZXJtaXNzaW9uID0gdHlwZSA9PiAoe1xuICBhZGQ6IGFjY2Vzc0xldmVsID0+IGFjY2Vzc0xldmVsLnBlcm1pc3Npb25zLnB1c2goeyB0eXBlIH0pLFxuICBpc0F1dGhvcml6ZWQ6IGFwcCA9PiBpc0F1dGhvcml6ZWQoYXBwKSh0eXBlKSxcbiAgaXNOb2RlOiBmYWxzZSxcbiAgZ2V0OiAoKSA9PiAoeyB0eXBlIH0pLFxufSk7XG5cbmNvbnN0IGNyZWF0ZVJlY29yZCA9IG5vZGVQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfUkVDT1JEKTtcblxuY29uc3QgdXBkYXRlUmVjb3JkID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlVQREFURV9SRUNPUkQpO1xuXG5jb25zdCBkZWxldGVSZWNvcmQgPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuREVMRVRFX1JFQ09SRCk7XG5cbmNvbnN0IHJlYWRSZWNvcmQgPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuUkVBRF9SRUNPUkQpO1xuXG5jb25zdCB3cml0ZVRlbXBsYXRlcyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLldSSVRFX1RFTVBMQVRFUyk7XG5cbmNvbnN0IGNyZWF0ZVVzZXIgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfVVNFUik7XG5cbmNvbnN0IHNldFBhc3N3b3JkID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuU0VUX1BBU1NXT1JEKTtcblxuY29uc3QgcmVhZEluZGV4ID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlJFQURfSU5ERVgpO1xuXG5jb25zdCBtYW5hZ2VJbmRleCA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLk1BTkFHRV9JTkRFWCk7XG5cbmNvbnN0IG1hbmFnZUNvbGxlY3Rpb24gPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5NQU5BR0VfQ09MTEVDVElPTik7XG5cbmNvbnN0IGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkNSRUFURV9URU1QT1JBUllfQUNDRVNTKTtcblxuY29uc3QgZW5hYmxlRGlzYWJsZVVzZXIgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5FTkFCTEVfRElTQUJMRV9VU0VSKTtcblxuY29uc3Qgd3JpdGVBY2Nlc3NMZXZlbHMgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5XUklURV9BQ0NFU1NfTEVWRUxTKTtcblxuY29uc3QgbGlzdFVzZXJzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuTElTVF9VU0VSUyk7XG5cbmNvbnN0IGxpc3RBY2Nlc3NMZXZlbHMgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5MSVNUX0FDQ0VTU19MRVZFTFMpO1xuXG5jb25zdCBzZXRVc2VyQWNjZXNzTGV2ZWxzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuU0VUX1VTRVJfQUNDRVNTX0xFVkVMUyk7XG5cbmNvbnN0IGV4ZWN1dGVBY3Rpb24gPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuRVhFQ1VURV9BQ1RJT04pO1xuXG5leHBvcnQgY29uc3QgYWx3YXlzQXV0aG9yaXplZCA9ICgpID0+IHRydWU7XG5cbmV4cG9ydCBjb25zdCBwZXJtaXNzaW9uID0ge1xuICBjcmVhdGVSZWNvcmQsXG4gIHVwZGF0ZVJlY29yZCxcbiAgZGVsZXRlUmVjb3JkLFxuICByZWFkUmVjb3JkLFxuICB3cml0ZVRlbXBsYXRlcyxcbiAgY3JlYXRlVXNlcixcbiAgc2V0UGFzc3dvcmQsXG4gIHJlYWRJbmRleCxcbiAgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzLFxuICBlbmFibGVEaXNhYmxlVXNlcixcbiAgd3JpdGVBY2Nlc3NMZXZlbHMsXG4gIGxpc3RVc2VycyxcbiAgbGlzdEFjY2Vzc0xldmVscyxcbiAgbWFuYWdlSW5kZXgsXG4gIG1hbmFnZUNvbGxlY3Rpb24sXG4gIGV4ZWN1dGVBY3Rpb24sXG4gIHNldFVzZXJBY2Nlc3NMZXZlbHMsXG59O1xuIiwiaW1wb3J0IHtcbiAga2V5QnksIG1hcFZhbHVlcyxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnc2hvcnRpZCc7XG5pbXBvcnQgeyBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgZ2V0TmV3RmllbGRWYWx1ZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7XG4gICQsIGpvaW5LZXksIHNhZmVLZXksIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBnZXROZXcgPSBhcHAgPT4gKGNvbGxlY3Rpb25LZXksIHJlY29yZFR5cGVOYW1lKSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRSZWNvcmROb2RlKGFwcCwgY29sbGVjdGlvbktleSwgcmVjb3JkVHlwZU5hbWUpO1xuICBjb2xsZWN0aW9uS2V5PXNhZmVLZXkoY29sbGVjdGlvbktleSk7XG4gIHJldHVybiBhcGlXcmFwcGVyU3luYyhcbiAgICBhcHAsXG4gICAgZXZlbnRzLnJlY29yZEFwaS5nZXROZXcsXG4gICAgcGVybWlzc2lvbi5jcmVhdGVSZWNvcmQuaXNBdXRob3JpemVkKHJlY29yZE5vZGUubm9kZUtleSgpKSxcbiAgICB7IGNvbGxlY3Rpb25LZXksIHJlY29yZFR5cGVOYW1lIH0sXG4gICAgX2dldE5ldywgcmVjb3JkTm9kZSwgY29sbGVjdGlvbktleSxcbiAgKTtcbn07XG5cbmNvbnN0IF9nZXROZXcgPSAocmVjb3JkTm9kZSwgY29sbGVjdGlvbktleSkgPT4gY29uc3RydWN0UmVjb3JkKHJlY29yZE5vZGUsIGdldE5ld0ZpZWxkVmFsdWUsIGNvbGxlY3Rpb25LZXkpO1xuXG5jb25zdCBnZXRSZWNvcmROb2RlID0gKGFwcCwgY29sbGVjdGlvbktleSkgPT4ge1xuICBjb2xsZWN0aW9uS2V5ID0gc2FmZUtleShjb2xsZWN0aW9uS2V5KTtcbiAgcmV0dXJuIGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHAuaGllcmFyY2h5KShjb2xsZWN0aW9uS2V5KTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXROZXdDaGlsZCA9IGFwcCA9PiAocmVjb3JkS2V5LCBjb2xsZWN0aW9uTmFtZSwgcmVjb3JkVHlwZU5hbWUpID0+IFxuICBnZXROZXcoYXBwKShqb2luS2V5KHJlY29yZEtleSwgY29sbGVjdGlvbk5hbWUpLCByZWNvcmRUeXBlTmFtZSk7XG5cbmV4cG9ydCBjb25zdCBjb25zdHJ1Y3RSZWNvcmQgPSAocmVjb3JkTm9kZSwgZ2V0RmllbGRWYWx1ZSwgY29sbGVjdGlvbktleSkgPT4ge1xuICBjb25zdCByZWNvcmQgPSAkKHJlY29yZE5vZGUuZmllbGRzLCBbXG4gICAga2V5QnkoJ25hbWUnKSxcbiAgICBtYXBWYWx1ZXMoZ2V0RmllbGRWYWx1ZSksXG4gIF0pO1xuXG4gIHJlY29yZC5pZCA9IGAke3JlY29yZE5vZGUubm9kZUlkfS0ke2dlbmVyYXRlKCl9YDtcbiAgcmVjb3JkLmtleSA9IGpvaW5LZXkoY29sbGVjdGlvbktleSwgcmVjb3JkLmlkKTtcbiAgcmVjb3JkLmlzTmV3ID0gdHJ1ZTtcbiAgcmVjb3JkLnR5cGUgPSByZWNvcmROb2RlLm5hbWU7XG4gIHJldHVybiByZWNvcmQ7XG59O1xuIiwiaW1wb3J0IHtcbiAga2V5QnksIG1hcFZhbHVlcywgZmlsdGVyLCBcbiAgbWFwLCBpbmNsdWRlcywgbGFzdCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdldEV4YWN0Tm9kZUZvclBhdGgsIGdldE5vZGUgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgc2FmZVBhcnNlRmllbGQgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge1xuICAkLCBzcGxpdEtleSwgc2FmZUtleSwgaXNOb25FbXB0eVN0cmluZyxcbiAgYXBpV3JhcHBlciwgZXZlbnRzLCBqb2luS2V5LFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgbWFwUmVjb3JkIH0gZnJvbSAnLi4vaW5kZXhpbmcvZXZhbHVhdGUnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkRmlsZU5hbWUgPSBrZXkgPT4gam9pbktleShrZXksICdyZWNvcmQuanNvbicpO1xuXG5leHBvcnQgY29uc3QgbG9hZCA9IGFwcCA9PiBhc3luYyBrZXkgPT4ge1xuICBrZXkgPSBzYWZlS2V5KGtleSk7XG4gIHJldHVybiBhcGlXcmFwcGVyKFxuICAgIGFwcCxcbiAgICBldmVudHMucmVjb3JkQXBpLmxvYWQsXG4gICAgcGVybWlzc2lvbi5yZWFkUmVjb3JkLmlzQXV0aG9yaXplZChrZXkpLFxuICAgIHsga2V5IH0sXG4gICAgX2xvYWQsIGFwcCwga2V5LFxuICApO1xufVxuXG5leHBvcnQgY29uc3QgX2xvYWQgPSBhc3luYyAoYXBwLCBrZXksIGtleVN0YWNrID0gW10pID0+IHtcbiAga2V5ID0gc2FmZUtleShrZXkpO1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShrZXkpO1xuICBjb25zdCBzdG9yZWREYXRhID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICBnZXRSZWNvcmRGaWxlTmFtZShrZXkpLFxuICApO1xuXG4gIGNvbnN0IGxvYWRlZFJlY29yZCA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBrZXlCeSgnbmFtZScpLFxuICAgIG1hcFZhbHVlcyhmID0+IHNhZmVQYXJzZUZpZWxkKGYsIHN0b3JlZERhdGEpKSxcbiAgXSk7XG5cbiAgY29uc3QgbmV3S2V5U3RhY2sgPSBbLi4ua2V5U3RhY2ssIGtleV07XG5cbiAgY29uc3QgcmVmZXJlbmNlcyA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBmaWx0ZXIoZiA9PiBmLnR5cGUgPT09ICdyZWZlcmVuY2UnXG4gICAgICAgICAgICAgICAgICAgICYmIGlzTm9uRW1wdHlTdHJpbmcobG9hZGVkUmVjb3JkW2YubmFtZV0ua2V5KVxuICAgICAgICAgICAgICAgICAgICAmJiAhaW5jbHVkZXMobG9hZGVkUmVjb3JkW2YubmFtZV0ua2V5KShuZXdLZXlTdGFjaykpLFxuICAgIG1hcChmID0+ICh7XG4gICAgICBwcm9taXNlOiBfbG9hZChhcHAsIGxvYWRlZFJlY29yZFtmLm5hbWVdLmtleSwgbmV3S2V5U3RhY2spLFxuICAgICAgaW5kZXg6IGdldE5vZGUoYXBwLmhpZXJhcmNoeSwgZi50eXBlT3B0aW9ucy5pbmRleE5vZGVLZXkpLFxuICAgICAgZmllbGQ6IGYsXG4gICAgfSkpLFxuICBdKTtcblxuICBpZiAocmVmZXJlbmNlcy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgcmVmUmVjb3JkcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgbWFwKHAgPT4gcC5wcm9taXNlKShyZWZlcmVuY2VzKSxcbiAgICApO1xuXG4gICAgZm9yIChjb25zdCByZWYgb2YgcmVmZXJlbmNlcykge1xuICAgICAgbG9hZGVkUmVjb3JkW3JlZi5maWVsZC5uYW1lXSA9IG1hcFJlY29yZChcbiAgICAgICAgcmVmUmVjb3Jkc1tyZWZlcmVuY2VzLmluZGV4T2YocmVmKV0sXG4gICAgICAgIHJlZi5pbmRleCxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgbG9hZGVkUmVjb3JkLnRyYW5zYWN0aW9uSWQgPSBzdG9yZWREYXRhLnRyYW5zYWN0aW9uSWQ7XG4gIGxvYWRlZFJlY29yZC5pc05ldyA9IGZhbHNlO1xuICBsb2FkZWRSZWNvcmQua2V5ID0ga2V5O1xuICBsb2FkZWRSZWNvcmQuaWQgPSAkKGtleSwgW3NwbGl0S2V5LCBsYXN0XSk7XG4gIGxvYWRlZFJlY29yZC50eXBlID0gcmVjb3JkTm9kZS5uYW1lO1xuICByZXR1cm4gbG9hZGVkUmVjb3JkO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgbG9hZDtcbiIsIi8vIGFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZGV4NGVyL2pzLXByb21pc2UtcmVhZGFibGVcbi8vIHRoYW5rcyA6KVxuICBcbmV4cG9ydCBjb25zdCBwcm9taXNlUmVhZGFibGVTdHJlYW0gPSBzdHJlYW0gPT4ge1xuICAgXG4gICAgbGV0IF9lcnJvcmVkO1xuXG4gICAgY29uc3QgX2Vycm9ySGFuZGxlciA9IGVyciA9PiB7XG4gICAgICAgIF9lcnJvcmVkID0gZXJyO1xuICAgIH07XG5cbiAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBfZXJyb3JIYW5kbGVyKTtcbiAgXG4gICAgY29uc3QgcmVhZCA9IChzaXplKSA9PiB7XG4gIFxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKF9lcnJvcmVkKSB7XG4gICAgICAgICAgY29uc3QgZXJyID0gX2Vycm9yZWQ7XG4gICAgICAgICAgX2Vycm9yZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICAgIH1cbiAgXG4gICAgICAgIGlmICghc3RyZWFtLnJlYWRhYmxlIHx8IHN0cmVhbS5jbG9zZWQgfHwgc3RyZWFtLmRlc3Ryb3llZCkge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IHJlYWRhYmxlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICBjb25zdCBjaHVuayA9IHN0cmVhbS5yZWFkKHNpemUpO1xuICBcbiAgICAgICAgICBpZiAoY2h1bmspIHtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVzb2x2ZShjaHVuayk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCBjbG9zZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCBlbmRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgZXJyb3JIYW5kbGVyID0gKGVycikgPT4ge1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCByZW1vdmVMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiY2xvc2VcIiwgY2xvc2VIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVuZFwiLCBlbmRIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJyZWFkYWJsZVwiLCByZWFkYWJsZUhhbmRsZXIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBzdHJlYW0ub24oXCJjbG9zZVwiLCBjbG9zZUhhbmRsZXIpO1xuICAgICAgICBzdHJlYW0ub24oXCJlbmRcIiwgZW5kSGFuZGxlcik7XG4gICAgICAgIHN0cmVhbS5vbihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gICAgICAgIHN0cmVhbS5vbihcInJlYWRhYmxlXCIsIHJlYWRhYmxlSGFuZGxlcik7XG4gIFxuICAgICAgICByZWFkYWJsZUhhbmRsZXIoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgXG4gIFxuICAgIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XG4gICAgICBpZiAoc3RyZWFtKSB7XG4gICAgICAgIGlmIChfZXJyb3JIYW5kbGVyKSB7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgX2Vycm9ySGFuZGxlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBzdHJlYW0uZGVzdHJveSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgc3RyZWFtLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIFxuICAgIHJldHVybiB7cmVhZCwgZGVzdHJveSwgc3RyZWFtfTtcbiAgfVxuICBcbiAgZXhwb3J0IGRlZmF1bHQgcHJvbWlzZVJlYWRhYmxlU3RyZWFtXG4gICIsImltcG9ydCB7IGNvbXBpbGVDb2RlIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xuaW1wb3J0IHtcbiAgZmlsdGVyLCBpbmNsdWRlcywgbWFwLCBsYXN0LFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQsIGlzR2xvYmFsSW5kZXgsXG4gIGdldFBhcmVudEtleSwgaXNTaGFyZGVkSW5kZXgsXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xuICBqb2luS2V5LCBpc05vbkVtcHR5U3RyaW5nLCBzcGxpdEtleSwgJCxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4ZWREYXRhS2V5ID0gKGluZGV4Tm9kZSwgaW5kZXhLZXksIHJlY29yZCkgPT4ge1xuICBjb25zdCBnZXRTaGFyZE5hbWUgPSAoaW5kZXhOb2RlLCByZWNvcmQpID0+IHtcbiAgICBjb25zdCBzaGFyZE5hbWVGdW5jID0gY29tcGlsZUNvZGUoaW5kZXhOb2RlLmdldFNoYXJkTmFtZSk7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBzaGFyZE5hbWVGdW5jKHsgcmVjb3JkIH0pO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgY29uc3QgZXJyb3JEZXRhaWxzID0gYHNoYXJkQ29kZTogJHtpbmRleE5vZGUuZ2V0U2hhcmROYW1lfSA6OiByZWNvcmQ6ICR7SlNPTi5zdHJpbmdpZnkocmVjb3JkKX0gOjogYFxuICAgICAgZS5tZXNzYWdlID0gXCJFcnJvciBydW5uaW5nIGluZGV4IHNoYXJkbmFtZSBmdW5jOiBcIiArIGVycm9yRGV0YWlscyArIGUubWVzc2FnZTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHNoYXJkTmFtZSA9IGlzTm9uRW1wdHlTdHJpbmcoaW5kZXhOb2RlLmdldFNoYXJkTmFtZSlcbiAgICA/IGAke2dldFNoYXJkTmFtZShpbmRleE5vZGUsIHJlY29yZCl9LmNzdmBcbiAgICA6ICdpbmRleC5jc3YnO1xuXG4gIHJldHVybiBqb2luS2V5KGluZGV4S2V5LCBzaGFyZE5hbWUpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFNoYXJkS2V5c0luUmFuZ2UgPSBhc3luYyAoYXBwLCBpbmRleEtleSwgc3RhcnRSZWNvcmQgPSBudWxsLCBlbmRSZWNvcmQgPSBudWxsKSA9PiB7XG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoaW5kZXhLZXkpO1xuXG4gIGNvbnN0IHN0YXJ0U2hhcmROYW1lID0gIXN0YXJ0UmVjb3JkXG4gICAgPyBudWxsXG4gICAgOiBzaGFyZE5hbWVGcm9tS2V5KFxuICAgICAgZ2V0SW5kZXhlZERhdGFLZXkoXG4gICAgICAgIGluZGV4Tm9kZSxcbiAgICAgICAgaW5kZXhLZXksXG4gICAgICAgIHN0YXJ0UmVjb3JkLFxuICAgICAgKSxcbiAgICApO1xuXG4gIGNvbnN0IGVuZFNoYXJkTmFtZSA9ICFlbmRSZWNvcmRcbiAgICA/IG51bGxcbiAgICA6IHNoYXJkTmFtZUZyb21LZXkoXG4gICAgICBnZXRJbmRleGVkRGF0YUtleShcbiAgICAgICAgaW5kZXhOb2RlLFxuICAgICAgICBpbmRleEtleSxcbiAgICAgICAgZW5kUmVjb3JkLFxuICAgICAgKSxcbiAgICApO1xuXG4gIHJldHVybiAkKGF3YWl0IGdldFNoYXJkTWFwKGFwcC5kYXRhc3RvcmUsIGluZGV4S2V5KSwgW1xuICAgIGZpbHRlcihrID0+IChzdGFydFJlY29yZCA9PT0gbnVsbCB8fCBrID49IHN0YXJ0U2hhcmROYW1lKVxuICAgICAgICAgICAgICAgICAgICAmJiAoZW5kUmVjb3JkID09PSBudWxsIHx8IGsgPD0gZW5kU2hhcmROYW1lKSksXG4gICAgbWFwKGsgPT4gam9pbktleShpbmRleEtleSwgYCR7a30uY3N2YCkpLFxuICBdKTtcbn07XG5cbmV4cG9ydCBjb25zdCBlbnN1cmVTaGFyZE5hbWVJc0luU2hhcmRNYXAgPSBhc3luYyAoc3RvcmUsIGluZGV4S2V5LCBpbmRleGVkRGF0YUtleSkgPT4ge1xuICBjb25zdCBtYXAgPSBhd2FpdCBnZXRTaGFyZE1hcChzdG9yZSwgaW5kZXhLZXkpO1xuICBjb25zdCBzaGFyZE5hbWUgPSBzaGFyZE5hbWVGcm9tS2V5KGluZGV4ZWREYXRhS2V5KTtcbiAgaWYgKCFpbmNsdWRlcyhzaGFyZE5hbWUpKG1hcCkpIHtcbiAgICBtYXAucHVzaChzaGFyZE5hbWUpO1xuICAgIGF3YWl0IHdyaXRlU2hhcmRNYXAoc3RvcmUsIGluZGV4S2V5LCBtYXApO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U2hhcmRNYXAgPSBhc3luYyAoZGF0YXN0b3JlLCBpbmRleEtleSkgPT4ge1xuICBjb25zdCBzaGFyZE1hcEtleSA9IGdldFNoYXJkTWFwS2V5KGluZGV4S2V5KTtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgZGF0YXN0b3JlLmxvYWRKc29uKHNoYXJkTWFwS2V5KTtcbiAgfSBjYXRjaCAoXykge1xuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKHNoYXJkTWFwS2V5LCBbXSk7XG4gICAgcmV0dXJuIFtdO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3Qgd3JpdGVTaGFyZE1hcCA9IGFzeW5jIChkYXRhc3RvcmUsIGluZGV4S2V5LCBzaGFyZE1hcCkgPT4gYXdhaXQgZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gIGdldFNoYXJkTWFwS2V5KGluZGV4S2V5KSxcbiAgc2hhcmRNYXAsXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsU2hhcmRLZXlzID0gYXN5bmMgKGFwcCwgaW5kZXhLZXkpID0+IGF3YWl0IGdldFNoYXJkS2V5c0luUmFuZ2UoYXBwLCBpbmRleEtleSk7XG5cbmV4cG9ydCBjb25zdCBnZXRTaGFyZE1hcEtleSA9IGluZGV4S2V5ID0+IGpvaW5LZXkoaW5kZXhLZXksICdzaGFyZE1hcC5qc29uJyk7XG5cbmV4cG9ydCBjb25zdCBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXkgPSBpbmRleEtleSA9PiBqb2luS2V5KGluZGV4S2V5LCAnaW5kZXguY3N2Jyk7XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleEZvbGRlcktleSA9IGluZGV4S2V5ID0+IGluZGV4S2V5O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlSW5kZXhGaWxlID0gYXN5bmMgKGRhdGFzdG9yZSwgaW5kZXhlZERhdGFLZXksIGluZGV4KSA9PiB7XG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleCkpIHtcbiAgICBjb25zdCBpbmRleEtleSA9IGdldFBhcmVudEtleShpbmRleGVkRGF0YUtleSk7XG4gICAgY29uc3Qgc2hhcmRNYXAgPSBhd2FpdCBnZXRTaGFyZE1hcChkYXRhc3RvcmUsIGluZGV4S2V5KTtcbiAgICBzaGFyZE1hcC5wdXNoKFxuICAgICAgc2hhcmROYW1lRnJvbUtleShpbmRleGVkRGF0YUtleSksXG4gICAgKTtcbiAgICBhd2FpdCB3cml0ZVNoYXJkTWFwKGRhdGFzdG9yZSwgaW5kZXhLZXksIHNoYXJkTWFwKTtcbiAgfVxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRmlsZShpbmRleGVkRGF0YUtleSwgJycpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNoYXJkTmFtZUZyb21LZXkgPSBrZXkgPT4gJChrZXksIFtcbiAgc3BsaXRLZXksXG4gIGxhc3QsXG5dKS5yZXBsYWNlKCcuY3N2JywgJycpO1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhLZXlfQmFzZWRPbkRlY2VuZGFudCA9IChkZWNlbmRhbnRLZXksIGluZGV4Tm9kZSkgPT4ge1xuICBpZiAoaXNHbG9iYWxJbmRleChpbmRleE5vZGUpKSB7IHJldHVybiBgJHtpbmRleE5vZGUubm9kZUtleSgpfWA7IH1cblxuICBjb25zdCBpbmRleGVkRGF0YVBhcmVudEtleSA9IGdldEFjdHVhbEtleU9mUGFyZW50KFxuICAgIGluZGV4Tm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksXG4gICAgZGVjZW5kYW50S2V5LFxuICApO1xuXG4gIHJldHVybiBqb2luS2V5KFxuICAgIGluZGV4ZWREYXRhUGFyZW50S2V5LFxuICAgIGluZGV4Tm9kZS5uYW1lLFxuICApO1xufTtcbiIsImltcG9ydCB7XG4gIGhhcywga2V5cywgbWFwLCBvcmRlckJ5LFxuICBmaWx0ZXIsIGNvbmNhdCwgcmV2ZXJzZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IG1hcFJlY29yZCB9IGZyb20gJy4vZXZhbHVhdGUnO1xuaW1wb3J0IHsgY29uc3RydWN0UmVjb3JkIH0gZnJvbSAnLi4vcmVjb3JkQXBpL2dldE5ldyc7XG5pbXBvcnQgeyBnZXRTYW1wbGVGaWVsZFZhbHVlLCBkZXRlY3RUeXBlLCBhbGwgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlU2NoZW1hID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlKSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGVzID0gZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgoaGllcmFyY2h5LCBpbmRleE5vZGUpO1xuICBjb25zdCBtYXBwZWRSZWNvcmRzID0gJChyZWNvcmROb2RlcywgW1xuICAgIG1hcChuID0+IG1hcFJlY29yZChjcmVhdGVTYW1wbGVSZWNvcmQobiksIGluZGV4Tm9kZSkpLFxuICBdKTtcblxuICAvLyBhbHdheXMgaGFzIHJlY29yZCBrZXkgYW5kIHNvcnQga2V5XG4gIGNvbnN0IHNjaGVtYSA9IHtcbiAgICBzb3J0S2V5OiBhbGwuc3RyaW5nLFxuICAgIGtleTogYWxsLnN0cmluZyxcbiAgfTtcblxuICBjb25zdCBmaWVsZHNIYXMgPSBoYXMoc2NoZW1hKTtcbiAgY29uc3Qgc2V0RmllbGQgPSAoZmllbGROYW1lLCB2YWx1ZSkgPT4ge1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgdGhpc1R5cGUgPSBkZXRlY3RUeXBlKHZhbHVlKTtcbiAgICBpZiAoZmllbGRzSGFzKGZpZWxkTmFtZSkpIHtcbiAgICAgIGlmIChzY2hlbWFbZmllbGROYW1lXSAhPT0gdGhpc1R5cGUpIHtcbiAgICAgICAgc2NoZW1hW2ZpZWxkTmFtZV0gPSBhbGwuc3RyaW5nO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzY2hlbWFbZmllbGROYW1lXSA9IHRoaXNUeXBlO1xuICAgIH1cbiAgfTtcblxuICBmb3IgKGNvbnN0IG1hcHBlZFJlYyBvZiBtYXBwZWRSZWNvcmRzKSB7XG4gICAgZm9yIChjb25zdCBmIGluIG1hcHBlZFJlYykge1xuICAgICAgc2V0RmllbGQoZiwgbWFwcGVkUmVjW2ZdKTtcbiAgICB9XG4gIH1cblxuICAvLyByZXR1cmluZyBhbiBhcnJheSBvZiB7bmFtZSwgdHlwZX1cbiAgcmV0dXJuICQoc2NoZW1hLCBbXG4gICAga2V5cyxcbiAgICBtYXAoayA9PiAoeyBuYW1lOiBrLCB0eXBlOiBzY2hlbWFba10ubmFtZSB9KSksXG4gICAgZmlsdGVyKHMgPT4gcy5uYW1lICE9PSAnc29ydEtleScpLFxuICAgIG9yZGVyQnkoJ25hbWUnLCBbJ2Rlc2MnXSksIC8vIHJldmVyc2UgYXBsaGFcbiAgICBjb25jYXQoW3sgbmFtZTogJ3NvcnRLZXknLCB0eXBlOiBhbGwuc3RyaW5nLm5hbWUgfV0pLCAvLyBzb3J0S2V5IG9uIGVuZFxuICAgIHJldmVyc2UsIC8vIHNvcnRLZXkgZmlyc3QsIHRoZW4gcmVzdCBhcmUgYWxwaGFiZXRpY2FsXG4gIF0pO1xufTtcblxuY29uc3QgY3JlYXRlU2FtcGxlUmVjb3JkID0gcmVjb3JkTm9kZSA9PiBjb25zdHJ1Y3RSZWNvcmQoXG4gIHJlY29yZE5vZGUsXG4gIGdldFNhbXBsZUZpZWxkVmFsdWUsXG4gIHJlY29yZE5vZGUucGFyZW50KCkubm9kZUtleSgpLFxuKTtcbiIsImV4cG9ydCBkZWZhdWx0ICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDpcbiAgICAgICAgICAgIHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6XG4gICAgICAgICAgICB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pO1xuIiwiXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxudmFyIGluaXRlZCA9IGZhbHNlO1xuZnVuY3Rpb24gaW5pdCAoKSB7XG4gIGluaXRlZCA9IHRydWU7XG4gIHZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2RlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgbG9va3VwW2ldID0gY29kZVtpXVxuICAgIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxuICB9XG5cbiAgcmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG4gIHJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICBpZiAoIWluaXRlZCkge1xuICAgIGluaXQoKTtcbiAgfVxuICB2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXG4gIGlmIChsZW4gJSA0ID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG4gIH1cblxuICAvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuICAvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG4gIC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuICAvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcbiAgLy8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuICBwbGFjZUhvbGRlcnMgPSBiNjRbbGVuIC0gMl0gPT09ICc9JyA/IDIgOiBiNjRbbGVuIC0gMV0gPT09ICc9JyA/IDEgOiAwXG5cbiAgLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG4gIGFyciA9IG5ldyBBcnIobGVuICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cbiAgLy8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuICBsID0gcGxhY2VIb2xkZXJzID4gMCA/IGxlbiAtIDQgOiBsZW5cblxuICB2YXIgTCA9IDBcblxuICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTgpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDEyKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8IHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMyldXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDE2KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxMCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgNCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDYgJiAweDNGXSArIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG4gICAgb3V0cHV0LnB1c2godHJpcGxldFRvQmFzZTY0KHRtcCkpXG4gIH1cbiAgcmV0dXJuIG91dHB1dC5qb2luKCcnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgaWYgKCFpbml0ZWQpIHtcbiAgICBpbml0KCk7XG4gIH1cbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgb3V0cHV0ID0gJydcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayh1aW50OCwgaSwgKGkgKyBtYXhDaHVua0xlbmd0aCkgPiBsZW4yID8gbGVuMiA6IChpICsgbWF4Q2h1bmtMZW5ndGgpKSlcbiAgfVxuXG4gIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcbiAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcbiAgICB0bXAgPSB1aW50OFtsZW4gLSAxXVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDJdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz09J1xuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyAodWludDhbbGVuIC0gMV0pXG4gICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMTBdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXVxuICAgIG91dHB1dCArPSAnPSdcbiAgfVxuXG4gIHBhcnRzLnB1c2gob3V0cHV0KVxuXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gcmVhZCAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cml0ZSAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5leHBvcnQgZGVmYXVsdCBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cblxuaW1wb3J0ICogYXMgYmFzZTY0IGZyb20gJy4vYmFzZTY0J1xuaW1wb3J0ICogYXMgaWVlZTc1NCBmcm9tICcuL2llZWU3NTQnXG5pbXBvcnQgaXNBcnJheSBmcm9tICcuL2lzQXJyYXknXG5cbmV4cG9ydCB2YXIgSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBEdWUgdG8gdmFyaW91cyBicm93c2VyIGJ1Z3MsIHNvbWV0aW1lcyB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uIHdpbGwgYmUgdXNlZCBldmVuXG4gKiB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHR5cGVkIGFycmF5cy5cbiAqXG4gKiBOb3RlOlxuICpcbiAqICAgLSBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsXG4gKiAgICAgU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzguXG4gKlxuICogICAtIENocm9tZSA5LTEwIGlzIG1pc3NpbmcgdGhlIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24uXG4gKlxuICogICAtIElFMTAgaGFzIGEgYnJva2VuIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhcnJheXMgb2ZcbiAqICAgICBpbmNvcnJlY3QgbGVuZ3RoIGluIHNvbWUgc2l0dWF0aW9ucy5cblxuICogV2UgZGV0ZWN0IHRoZXNlIGJ1Z2d5IGJyb3dzZXJzIGFuZCBzZXQgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYCB0byBgZmFsc2VgIHNvIHRoZXlcbiAqIGdldCB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uLCB3aGljaCBpcyBzbG93ZXIgYnV0IGJlaGF2ZXMgY29ycmVjdGx5LlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUICE9PSB1bmRlZmluZWRcbiAgPyBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVFxuICA6IHRydWVcblxuLypcbiAqIEV4cG9ydCBrTWF4TGVuZ3RoIGFmdGVyIHR5cGVkIGFycmF5IHN1cHBvcnQgaXMgZGV0ZXJtaW5lZC5cbiAqL1xudmFyIF9rTWF4TGVuZ3RoID0ga01heExlbmd0aCgpXG5leHBvcnQge19rTWF4TGVuZ3RoIGFzIGtNYXhMZW5ndGh9O1xuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICByZXR1cm4gdHJ1ZTtcbiAgLy8gcm9sbHVwIGlzc3Vlc1xuICAvLyB0cnkge1xuICAvLyAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAvLyAgIGFyci5fX3Byb3RvX18gPSB7XG4gIC8vICAgICBfX3Byb3RvX186IFVpbnQ4QXJyYXkucHJvdG90eXBlLFxuICAvLyAgICAgZm9vOiBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gIC8vICAgfVxuICAvLyAgIHJldHVybiBhcnIuZm9vKCkgPT09IDQyICYmIC8vIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkXG4gIC8vICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgJiYgLy8gY2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIC8vICAgICAgIGFyci5zdWJhcnJheSgxLCAxKS5ieXRlTGVuZ3RoID09PSAwIC8vIGllMTAgaGFzIGJyb2tlbiBgc3ViYXJyYXlgXG4gIC8vIH0gY2F0Y2ggKGUpIHtcbiAgLy8gICByZXR1cm4gZmFsc2VcbiAgLy8gfVxufVxuXG5mdW5jdGlvbiBrTWF4TGVuZ3RoICgpIHtcbiAgcmV0dXJuIEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gICAgPyAweDdmZmZmZmZmXG4gICAgOiAweDNmZmZmZmZmXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAodGhhdCwgbGVuZ3RoKSB7XG4gIGlmIChrTWF4TGVuZ3RoKCkgPCBsZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCB0eXBlZCBhcnJheSBsZW5ndGgnKVxuICB9XG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoYXQgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIGlmICh0aGF0ID09PSBudWxsKSB7XG4gICAgICB0aGF0ID0gbmV3IEJ1ZmZlcihsZW5ndGgpXG4gICAgfVxuICAgIHRoYXQubGVuZ3RoID0gbGVuZ3RoXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgaGF2ZSB0aGVpclxuICogcHJvdG90eXBlIGNoYW5nZWQgdG8gYEJ1ZmZlci5wcm90b3R5cGVgLiBGdXJ0aGVybW9yZSwgYEJ1ZmZlcmAgaXMgYSBzdWJjbGFzcyBvZlxuICogYFVpbnQ4QXJyYXlgLCBzbyB0aGUgcmV0dXJuZWQgaW5zdGFuY2VzIHdpbGwgaGF2ZSBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgbWV0aG9kc1xuICogYW5kIHRoZSBgVWludDhBcnJheWAgbWV0aG9kcy4gU3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXRcbiAqIHJldHVybnMgYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogVGhlIGBVaW50OEFycmF5YCBwcm90b3R5cGUgcmVtYWlucyB1bm1vZGlmaWVkLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiYgISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIGlmICh0eXBlb2YgZW5jb2RpbmdPck9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0lmIGVuY29kaW5nIGlzIHNwZWNpZmllZCB0aGVuIHRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJ1xuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gYWxsb2NVbnNhZmUodGhpcywgYXJnKVxuICB9XG4gIHJldHVybiBmcm9tKHRoaXMsIGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxuLy8gVE9ETzogTGVnYWN5LCBub3QgbmVlZGVkIGFueW1vcmUuIFJlbW92ZSBpbiBuZXh0IG1ham9yIHZlcnNpb24uXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gZnJvbSAodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBhIG51bWJlcicpXG4gIH1cblxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnJvbVN0cmluZyh0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldClcbiAgfVxuXG4gIHJldHVybiBmcm9tT2JqZWN0KHRoYXQsIHZhbHVlKVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIEJ1ZmZlcihhcmcsIGVuY29kaW5nKSBidXQgdGhyb3dzIGEgVHlwZUVycm9yXG4gKiBpZiB2YWx1ZSBpcyBhIG51bWJlci5cbiAqIEJ1ZmZlci5mcm9tKHN0clssIGVuY29kaW5nXSlcbiAqIEJ1ZmZlci5mcm9tKGFycmF5KVxuICogQnVmZmVyLmZyb20oYnVmZmVyKVxuICogQnVmZmVyLmZyb20oYXJyYXlCdWZmZXJbLCBieXRlT2Zmc2V0WywgbGVuZ3RoXV0pXG4gKiovXG5CdWZmZXIuZnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBmcm9tKG51bGwsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbmlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICBCdWZmZXIucHJvdG90eXBlLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXkucHJvdG90eXBlXG4gIEJ1ZmZlci5fX3Byb3RvX18gPSBVaW50OEFycmF5XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wuc3BlY2llcyAmJlxuICAgICAgQnVmZmVyW1N5bWJvbC5zcGVjaWVzXSA9PT0gQnVmZmVyKSB7XG4gICAgLy8gRml4IHN1YmFycmF5KCkgaW4gRVMyMDE2LiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvOTdcbiAgICAvLyBPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLCBTeW1ib2wuc3BlY2llcywge1xuICAgIC8vICAgdmFsdWU6IG51bGwsXG4gICAgLy8gICBjb25maWd1cmFibGU6IHRydWVcbiAgICAvLyB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydFNpemUgKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9IGVsc2UgaWYgKHNpemUgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG5lZ2F0aXZlJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAodGhhdCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXR0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2MobnVsbCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlICh0aGF0LCBzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgKytpKSB7XG4gICAgICB0aGF0W2ldID0gMFxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gQnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gU2xvd0J1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICovXG5CdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHRoYXQsIHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGlmICghQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJlbmNvZGluZ1wiIG11c3QgYmUgYSB2YWxpZCBzdHJpbmcgZW5jb2RpbmcnKVxuICB9XG5cbiAgdmFyIGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuXG4gIHZhciBhY3R1YWwgPSB0aGF0LndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG5cbiAgaWYgKGFjdHVhbCAhPT0gbGVuZ3RoKSB7XG4gICAgLy8gV3JpdGluZyBhIGhleCBzdHJpbmcsIGZvciBleGFtcGxlLCB0aGF0IGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycyB3aWxsXG4gICAgLy8gY2F1c2UgZXZlcnl0aGluZyBhZnRlciB0aGUgZmlyc3QgaW52YWxpZCBjaGFyYWN0ZXIgdG8gYmUgaWdub3JlZC4gKGUuZy5cbiAgICAvLyAnYWJ4eGNkJyB3aWxsIGJlIHRyZWF0ZWQgYXMgJ2FiJylcbiAgICB0aGF0ID0gdGhhdC5zbGljZSgwLCBhY3R1YWwpXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlMaWtlICh0aGF0LCBhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyICh0aGF0LCBhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gIGFycmF5LmJ5dGVMZW5ndGggLy8gdGhpcyB0aHJvd3MgaWYgYGFycmF5YCBpcyBub3QgYSB2YWxpZCBBcnJheUJ1ZmZlclxuXG4gIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdvZmZzZXRcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgKyAobGVuZ3RoIHx8IDApKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ2xlbmd0aFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChieXRlT2Zmc2V0ID09PSB1bmRlZmluZWQgJiYgbGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5KVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldClcbiAgfSBlbHNlIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gYXJyYXlcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgdGhhdCA9IGZyb21BcnJheUxpa2UodGhhdCwgYXJyYXkpXG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAodGhhdCwgb2JqKSB7XG4gIGlmIChpbnRlcm5hbElzQnVmZmVyKG9iaikpIHtcbiAgICB2YXIgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbilcblxuICAgIGlmICh0aGF0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoYXRcbiAgICB9XG5cbiAgICBvYmouY29weSh0aGF0LCAwLCAwLCBsZW4pXG4gICAgcmV0dXJuIHRoYXRcbiAgfVxuXG4gIGlmIChvYmopIHtcbiAgICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgb2JqLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB8fCAnbGVuZ3RoJyBpbiBvYmopIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ251bWJlcicgfHwgaXNuYW4ob2JqLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCAwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqKVxuICAgIH1cblxuICAgIGlmIChvYmoudHlwZSA9PT0gJ0J1ZmZlcicgJiYgaXNBcnJheShvYmouZGF0YSkpIHtcbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iai5kYXRhKVxuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCBvciBhcnJheS1saWtlIG9iamVjdC4nKVxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwga01heExlbmd0aCgpYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IGtNYXhMZW5ndGgoKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBrTWF4TGVuZ3RoKCkudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNsb3dCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAoK2xlbmd0aCAhPSBsZW5ndGgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbiAgICBsZW5ndGggPSAwXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5hbGxvYygrbGVuZ3RoKVxufVxuQnVmZmVyLmlzQnVmZmVyID0gaXNCdWZmZXI7XG5mdW5jdGlvbiBpbnRlcm5hbElzQnVmZmVyIChiKSB7XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIWludGVybmFsSXNCdWZmZXIoYSkgfHwgIWludGVybmFsSXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgbXVzdCBiZSBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuXG4gIHZhciB4ID0gYS5sZW5ndGhcbiAgdmFyIHkgPSBiLmxlbmd0aFxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldXG4gICAgICB5ID0gYltpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnbGF0aW4xJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIWlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5hbGxvYygwKVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICBsZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYnVmID0gbGlzdFtpXVxuICAgIGlmICghaW50ZXJuYWxJc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoaW50ZXJuYWxJc0J1ZmZlcihzdHJpbmcpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5sZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQXJyYXlCdWZmZXIuaXNWaWV3ID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAoQXJyYXlCdWZmZXIuaXNWaWV3KHN0cmluZykgfHwgc3RyaW5nIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5ieXRlTGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgc3RyaW5nID0gJycgKyBzdHJpbmdcbiAgfVxuXG4gIHZhciBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gbGVuICogMlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGxlbiA+Pj4gMVxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoIC8vIGFzc3VtZSB1dGY4XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIC8vIE5vIG5lZWQgdG8gdmVyaWZ5IHRoYXQgXCJ0aGlzLmxlbmd0aCA8PSBNQVhfVUlOVDMyXCIgc2luY2UgaXQncyBhIHJlYWQtb25seVxuICAvLyBwcm9wZXJ0eSBvZiBhIHR5cGVkIGFycmF5LlxuXG4gIC8vIFRoaXMgYmVoYXZlcyBuZWl0aGVyIGxpa2UgU3RyaW5nIG5vciBVaW50OEFycmF5IGluIHRoYXQgd2Ugc2V0IHN0YXJ0L2VuZFxuICAvLyB0byB0aGVpciB1cHBlci9sb3dlciBib3VuZHMgaWYgdGhlIHZhbHVlIHBhc3NlZCBpcyBvdXQgb2YgcmFuZ2UuXG4gIC8vIHVuZGVmaW5lZCBpcyBoYW5kbGVkIHNwZWNpYWxseSBhcyBwZXIgRUNNQS0yNjIgNnRoIEVkaXRpb24sXG4gIC8vIFNlY3Rpb24gMTMuMy4zLjcgUnVudGltZSBTZW1hbnRpY3M6IEtleWVkQmluZGluZ0luaXRpYWxpemF0aW9uLlxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCB8fCBzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICAvLyBSZXR1cm4gZWFybHkgaWYgc3RhcnQgPiB0aGlzLmxlbmd0aC4gRG9uZSBoZXJlIHRvIHByZXZlbnQgcG90ZW50aWFsIHVpbnQzMlxuICAvLyBjb2VyY2lvbiBmYWlsIGJlbG93LlxuICBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbmQgPD0gMCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgLy8gRm9yY2UgY29lcnNpb24gdG8gdWludDMyLiBUaGlzIHdpbGwgYWxzbyBjb2VyY2UgZmFsc2V5L05hTiB2YWx1ZXMgdG8gMC5cbiAgZW5kID4+Pj0gMFxuICBzdGFydCA+Pj49IDBcblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gVGhlIHByb3BlcnR5IGlzIHVzZWQgYnkgYEJ1ZmZlci5pc0J1ZmZlcmAgYW5kIGBpcy1idWZmZXJgIChpbiBTYWZhcmkgNS03KSB0byBkZXRlY3Rcbi8vIEJ1ZmZlciBpbnN0YW5jZXMuXG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuZnVuY3Rpb24gc3dhcCAoYiwgbiwgbSkge1xuICB2YXIgaSA9IGJbbl1cbiAgYltuXSA9IGJbbV1cbiAgYlttXSA9IGlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMTYgPSBmdW5jdGlvbiBzd2FwMTYgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDIgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDE2LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAxKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDMyID0gZnVuY3Rpb24gc3dhcDMyICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAzMi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgMilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXA2NCA9IGZ1bmN0aW9uIHN3YXA2NCAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgOCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNjQtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gOCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDcpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDYpXG4gICAgc3dhcCh0aGlzLCBpICsgMiwgaSArIDUpXG4gICAgc3dhcCh0aGlzLCBpICsgMywgaSArIDQpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoIHwgMFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgaWYgKHRoaXMgPT09IGIpIHJldHVybiB0cnVlXG4gIHJldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLCBiKSA9PT0gMFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgdmFyIHN0ciA9ICcnXG4gIHZhciBtYXggPSBJTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgfVxuXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5kID0gdGFyZ2V0ID8gdGFyZ2V0Lmxlbmd0aCA6IDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzU3RhcnQgPSAwXG4gIH1cbiAgaWYgKHRoaXNFbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNFbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBlbmQgPiB0YXJnZXQubGVuZ3RoIHx8IHRoaXNTdGFydCA8IDAgfHwgdGhpc0VuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ291dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQgJiYgc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIHN0YXJ0ID4+Pj0gMFxuICBlbmQgPj4+PSAwXG4gIHRoaXNTdGFydCA+Pj49IDBcbiAgdGhpc0VuZCA+Pj49IDBcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0KSByZXR1cm4gMFxuXG4gIHZhciB4ID0gdGhpc0VuZCAtIHRoaXNTdGFydFxuICB2YXIgeSA9IGVuZCAtIHN0YXJ0XG4gIHZhciBsZW4gPSBNYXRoLm1pbih4LCB5KVxuXG4gIHZhciB0aGlzQ29weSA9IHRoaXMuc2xpY2UodGhpc1N0YXJ0LCB0aGlzRW5kKVxuICB2YXIgdGFyZ2V0Q29weSA9IHRhcmdldC5zbGljZShzdGFydCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAodGhpc0NvcHlbaV0gIT09IHRhcmdldENvcHlbaV0pIHtcbiAgICAgIHggPSB0aGlzQ29weVtpXVxuICAgICAgeSA9IHRhcmdldENvcHlbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG4vLyBGaW5kcyBlaXRoZXIgdGhlIGZpcnN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA+PSBgYnl0ZU9mZnNldGAsXG4vLyBPUiB0aGUgbGFzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPD0gYGJ5dGVPZmZzZXRgLlxuLy9cbi8vIEFyZ3VtZW50czpcbi8vIC0gYnVmZmVyIC0gYSBCdWZmZXIgdG8gc2VhcmNoXG4vLyAtIHZhbCAtIGEgc3RyaW5nLCBCdWZmZXIsIG9yIG51bWJlclxuLy8gLSBieXRlT2Zmc2V0IC0gYW4gaW5kZXggaW50byBgYnVmZmVyYDsgd2lsbCBiZSBjbGFtcGVkIHRvIGFuIGludDMyXG4vLyAtIGVuY29kaW5nIC0gYW4gb3B0aW9uYWwgZW5jb2RpbmcsIHJlbGV2YW50IGlzIHZhbCBpcyBhIHN0cmluZ1xuLy8gLSBkaXIgLSB0cnVlIGZvciBpbmRleE9mLCBmYWxzZSBmb3IgbGFzdEluZGV4T2ZcbmZ1bmN0aW9uIGJpZGlyZWN0aW9uYWxJbmRleE9mIChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICAvLyBFbXB0eSBidWZmZXIgbWVhbnMgbm8gbWF0Y2hcbiAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHJldHVybiAtMVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0XG4gIGlmICh0eXBlb2YgYnl0ZU9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IGJ5dGVPZmZzZXRcbiAgICBieXRlT2Zmc2V0ID0gMFxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPiAweDdmZmZmZmZmKSB7XG4gICAgYnl0ZU9mZnNldCA9IDB4N2ZmZmZmZmZcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgLTB4ODAwMDAwMDApIHtcbiAgICBieXRlT2Zmc2V0ID0gLTB4ODAwMDAwMDBcbiAgfVxuICBieXRlT2Zmc2V0ID0gK2J5dGVPZmZzZXQgIC8vIENvZXJjZSB0byBOdW1iZXIuXG4gIGlmIChpc05hTihieXRlT2Zmc2V0KSkge1xuICAgIC8vIGJ5dGVPZmZzZXQ6IGl0IGl0J3MgdW5kZWZpbmVkLCBudWxsLCBOYU4sIFwiZm9vXCIsIGV0Yywgc2VhcmNoIHdob2xlIGJ1ZmZlclxuICAgIGJ5dGVPZmZzZXQgPSBkaXIgPyAwIDogKGJ1ZmZlci5sZW5ndGggLSAxKVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXQ6IG5lZ2F0aXZlIG9mZnNldHMgc3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBidWZmZXJcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwKSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCArIGJ5dGVPZmZzZXRcbiAgaWYgKGJ5dGVPZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkge1xuICAgIGlmIChkaXIpIHJldHVybiAtMVxuICAgIGVsc2UgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggLSAxXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IDApIHtcbiAgICBpZiAoZGlyKSBieXRlT2Zmc2V0ID0gMFxuICAgIGVsc2UgcmV0dXJuIC0xXG4gIH1cblxuICAvLyBOb3JtYWxpemUgdmFsXG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIHZhbCA9IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gIH1cblxuICAvLyBGaW5hbGx5LCBzZWFyY2ggZWl0aGVyIGluZGV4T2YgKGlmIGRpciBpcyB0cnVlKSBvciBsYXN0SW5kZXhPZlxuICBpZiAoaW50ZXJuYWxJc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDB4RkYgLy8gU2VhcmNoIGZvciBhIGJ5dGUgdmFsdWUgWzAtMjU1XVxuICAgIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJlxuICAgICAgICB0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGRpcikge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCBbIHZhbCBdLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyJylcbn1cblxuZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICB2YXIgaW5kZXhTaXplID0gMVxuICB2YXIgYXJyTGVuZ3RoID0gYXJyLmxlbmd0aFxuICB2YXIgdmFsTGVuZ3RoID0gdmFsLmxlbmd0aFxuXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZW5jb2RpbmcgPT09ICd1Y3MyJyB8fCBlbmNvZGluZyA9PT0gJ3Vjcy0yJyB8fFxuICAgICAgICBlbmNvZGluZyA9PT0gJ3V0ZjE2bGUnIHx8IGVuY29kaW5nID09PSAndXRmLTE2bGUnKSB7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA8IDIgfHwgdmFsLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpbmRleFNpemUgPSAyXG4gICAgICBhcnJMZW5ndGggLz0gMlxuICAgICAgdmFsTGVuZ3RoIC89IDJcbiAgICAgIGJ5dGVPZmZzZXQgLz0gMlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGJ1ZiwgaSkge1xuICAgIGlmIChpbmRleFNpemUgPT09IDEpIHtcbiAgICAgIHJldHVybiBidWZbaV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ1Zi5yZWFkVUludDE2QkUoaSAqIGluZGV4U2l6ZSlcbiAgICB9XG4gIH1cblxuICB2YXIgaVxuICBpZiAoZGlyKSB7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPCBhcnJMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlYWQoYXJyLCBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIGZvdW5kSW5kZXggPSBpXG4gICAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbExlbmd0aCkgcmV0dXJuIGZvdW5kSW5kZXggKiBpbmRleFNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ICE9PSAtMSkgaSAtPSBpIC0gZm91bmRJbmRleFxuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGJ5dGVPZmZzZXQgKyB2YWxMZW5ndGggPiBhcnJMZW5ndGgpIGJ5dGVPZmZzZXQgPSBhcnJMZW5ndGggLSB2YWxMZW5ndGhcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGZvdW5kID0gdHJ1ZVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWxMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAocmVhZChhcnIsIGkgKyBqKSAhPT0gcmVhZCh2YWwsIGopKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuIGlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiB0aGlzLmluZGV4T2YodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykgIT09IC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIHRydWUpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZmFsc2UpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKHN0ckxlbiAlIDIgIT09IDApIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKGlzTmFOKHBhcnNlZCkpIHJldHVybiBpXG4gICAgYnVmW29mZnNldCArIGldID0gcGFyc2VkXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBsYXRpbjFXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBhc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHVjczJXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZylcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBvZmZzZXRbLCBsZW5ndGhdWywgZW5jb2RpbmddKVxuICB9IGVsc2UgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCB8IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICAvLyBsZWdhY3kgd3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpIC0gcmVtb3ZlIGluIHYwLjEzXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1ZmZlci53cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXRbLCBsZW5ndGhdKSBpcyBubyBsb25nZXIgc3VwcG9ydGVkJ1xuICAgIClcbiAgfVxuXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbGVuZ3RoID4gcmVtYWluaW5nKSBsZW5ndGggPSByZW1haW5pbmdcblxuICBpZiAoKHN0cmluZy5sZW5ndGggPiAwICYmIChsZW5ndGggPCAwIHx8IG9mZnNldCA8IDApKSB8fCBvZmZzZXQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIHdyaXRlIG91dHNpZGUgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIC8vIFdhcm5pbmc6IG1heExlbmd0aCBub3QgdGFrZW4gaW50byBhY2NvdW50IGluIGJhc2U2NFdyaXRlXG4gICAgICAgIHJldHVybiBiYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdWNzMldyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHV0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcbiAgdmFyIHJlcyA9IFtdXG5cbiAgdmFyIGkgPSBzdGFydFxuICB3aGlsZSAoaSA8IGVuZCkge1xuICAgIHZhciBmaXJzdEJ5dGUgPSBidWZbaV1cbiAgICB2YXIgY29kZVBvaW50ID0gbnVsbFxuICAgIHZhciBieXRlc1BlclNlcXVlbmNlID0gKGZpcnN0Qnl0ZSA+IDB4RUYpID8gNFxuICAgICAgOiAoZmlyc3RCeXRlID4gMHhERikgPyAzXG4gICAgICA6IChmaXJzdEJ5dGUgPiAweEJGKSA/IDJcbiAgICAgIDogMVxuXG4gICAgaWYgKGkgKyBieXRlc1BlclNlcXVlbmNlIDw9IGVuZCkge1xuICAgICAgdmFyIHNlY29uZEJ5dGUsIHRoaXJkQnl0ZSwgZm91cnRoQnl0ZSwgdGVtcENvZGVQb2ludFxuXG4gICAgICBzd2l0Y2ggKGJ5dGVzUGVyU2VxdWVuY2UpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmIChmaXJzdEJ5dGUgPCAweDgwKSB7XG4gICAgICAgICAgICBjb2RlUG9pbnQgPSBmaXJzdEJ5dGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHgxRikgPDwgMHg2IHwgKHNlY29uZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4QyB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKHRoaXJkQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0ZGICYmICh0ZW1wQ29kZVBvaW50IDwgMHhEODAwIHx8IHRlbXBDb2RlUG9pbnQgPiAweERGRkYpKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGZvdXJ0aEJ5dGUgPSBidWZbaSArIDNdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwICYmIChmb3VydGhCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweDEyIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweEMgfCAodGhpcmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKGZvdXJ0aEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweEZGRkYgJiYgdGVtcENvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGVQb2ludCA9PT0gbnVsbCkge1xuICAgICAgLy8gd2UgZGlkIG5vdCBnZW5lcmF0ZSBhIHZhbGlkIGNvZGVQb2ludCBzbyBpbnNlcnQgYVxuICAgICAgLy8gcmVwbGFjZW1lbnQgY2hhciAoVStGRkZEKSBhbmQgYWR2YW5jZSBvbmx5IDEgYnl0ZVxuICAgICAgY29kZVBvaW50ID0gMHhGRkZEXG4gICAgICBieXRlc1BlclNlcXVlbmNlID0gMVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50ID4gMHhGRkZGKSB7XG4gICAgICAvLyBlbmNvZGUgdG8gdXRmMTYgKHN1cnJvZ2F0ZSBwYWlyIGRhbmNlKVxuICAgICAgY29kZVBvaW50IC09IDB4MTAwMDBcbiAgICAgIHJlcy5wdXNoKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMClcbiAgICAgIGNvZGVQb2ludCA9IDB4REMwMCB8IGNvZGVQb2ludCAmIDB4M0ZGXG4gICAgfVxuXG4gICAgcmVzLnB1c2goY29kZVBvaW50KVxuICAgIGkgKz0gYnl0ZXNQZXJTZXF1ZW5jZVxuICB9XG5cbiAgcmV0dXJuIGRlY29kZUNvZGVQb2ludHNBcnJheShyZXMpXG59XG5cbi8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIyNzQ3MjcyLzY4MDc0MiwgdGhlIGJyb3dzZXIgd2l0aFxuLy8gdGhlIGxvd2VzdCBsaW1pdCBpcyBDaHJvbWUsIHdpdGggMHgxMDAwMCBhcmdzLlxuLy8gV2UgZ28gMSBtYWduaXR1ZGUgbGVzcywgZm9yIHNhZmV0eVxudmFyIE1BWF9BUkdVTUVOVFNfTEVOR1RIID0gMHgxMDAwXG5cbmZ1bmN0aW9uIGRlY29kZUNvZGVQb2ludHNBcnJheSAoY29kZVBvaW50cykge1xuICB2YXIgbGVuID0gY29kZVBvaW50cy5sZW5ndGhcbiAgaWYgKGxlbiA8PSBNQVhfQVJHVU1FTlRTX0xFTkdUSCkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY29kZVBvaW50cykgLy8gYXZvaWQgZXh0cmEgc2xpY2UoKVxuICB9XG5cbiAgLy8gRGVjb2RlIGluIGNodW5rcyB0byBhdm9pZCBcImNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZFwiLlxuICB2YXIgcmVzID0gJydcbiAgdmFyIGkgPSAwXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXG4gICAgICBTdHJpbmcsXG4gICAgICBjb2RlUG9pbnRzLnNsaWNlKGksIGkgKz0gTUFYX0FSR1VNRU5UU19MRU5HVEgpXG4gICAgKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0gJiAweDdGKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gbGF0aW4xU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiB1dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2kgKyAxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICB2YXIgbmV3QnVmXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIG5ld0J1ZiA9IHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZClcbiAgICBuZXdCdWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47ICsraSkge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ld0J1ZlxufVxuXG4vKlxuICogTmVlZCB0byBtYWtlIHN1cmUgdGhhdCBidWZmZXIgaXNuJ3QgdHJ5aW5nIHRvIHdyaXRlIG91dCBvZiBib3VuZHMuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT2Zmc2V0IChvZmZzZXQsIGV4dCwgbGVuZ3RoKSB7XG4gIGlmICgob2Zmc2V0ICUgMSkgIT09IDAgfHwgb2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ29mZnNldCBpcyBub3QgdWludCcpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBsZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdUcnlpbmcgdG8gYWNjZXNzIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludExFID0gZnVuY3Rpb24gcmVhZFVJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcbiAgfVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF1cbiAgdmFyIG11bCA9IDFcbiAgd2hpbGUgKGJ5dGVMZW5ndGggPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIHJlYWRVSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCA4KSB8IHRoaXNbb2Zmc2V0ICsgMV1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiByZWFkVUludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKCh0aGlzW29mZnNldF0pIHxcbiAgICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSkgK1xuICAgICAgKHRoaXNbb2Zmc2V0ICsgM10gKiAweDEwMDAwMDApXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50QkUgPSBmdW5jdGlvbiByZWFkSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGhcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1pXVxuICB3aGlsZSAoaSA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIHJlYWRJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gcmVhZEludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgMV0gfCAodGhpc1tvZmZzZXRdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgMjQpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdExFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdEJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiByZWFkRG91YmxlQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCA1MiwgOClcbn1cblxuZnVuY3Rpb24gY2hlY2tJbnQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAoIWludGVybmFsSXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZmZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHhmZiwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCAyKTsgaSA8IGo7ICsraSkge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgNCk7IGkgPCBqOyArK2kpIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gMFxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgLSAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgKyAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgOCwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICh0YXJnZXQsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXRTdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB0YXJnZXRTdGFydCA9IHRhcmdldC5sZW5ndGhcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwXG4gIGlmIChlbmQgPiAwICYmIGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDBcbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgdGhpcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAodGFyZ2V0U3RhcnQgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgaWYgKGVuZCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgKyBzdGFydFxuICB9XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG4gIHZhciBpXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yIChpID0gbGVuIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2UgaWYgKGxlbiA8IDEwMDAgfHwgIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gYXNjZW5kaW5nIGNvcHkgZnJvbSBzdGFydFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoY29kZSA8IDI1Nikge1xuICAgICAgICB2YWwgPSBjb2RlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMjU1XG4gIH1cblxuICAvLyBJbnZhbGlkIHJhbmdlcyBhcmUgbm90IHNldCB0byBhIGRlZmF1bHQsIHNvIGNhbiByYW5nZSBjaGVjayBlYXJseS5cbiAgaWYgKHN0YXJ0IDwgMCB8fCB0aGlzLmxlbmd0aCA8IHN0YXJ0IHx8IHRoaXMubGVuZ3RoIDwgZW5kKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ091dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgPj4+IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyB0aGlzLmxlbmd0aCA6IGVuZCA+Pj4gMFxuXG4gIGlmICghdmFsKSB2YWwgPSAwXG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgdGhpc1tpXSA9IHZhbFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYnl0ZXMgPSBpbnRlcm5hbElzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IHV0ZjhUb0J5dGVzKG5ldyBCdWZmZXIodmFsLCBlbmNvZGluZykudG9TdHJpbmcoKSlcbiAgICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rXFwvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyaW5ndHJpbShzdHIpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICB2YXIgY29kZVBvaW50XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICB2YXIgYnl0ZXMgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuXG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBpc25hbiAodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IHZhbCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuXG5cbi8vIHRoZSBmb2xsb3dpbmcgaXMgZnJvbSBpcy1idWZmZXIsIGFsc28gYnkgRmVyb3NzIEFib3VraGFkaWplaCBhbmQgd2l0aCBzYW1lIGxpc2VuY2Vcbi8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcbi8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcbmV4cG9ydCBmdW5jdGlvbiBpc0J1ZmZlcihvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmICghIW9iai5faXNCdWZmZXIgfHwgaXNGYXN0QnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikpXG59XG5cbmZ1bmN0aW9uIGlzRmFzdEJ1ZmZlciAob2JqKSB7XG4gIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG5cbi8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5mdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzRmFzdEJ1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtCdWZmZXJ9IGZyb20gJ2J1ZmZlcic7XG52YXIgaXNCdWZmZXJFbmNvZGluZyA9IEJ1ZmZlci5pc0VuY29kaW5nXG4gIHx8IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gICAgICAgc3dpdGNoIChlbmNvZGluZyAmJiBlbmNvZGluZy50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICBjYXNlICdoZXgnOiBjYXNlICd1dGY4JzogY2FzZSAndXRmLTgnOiBjYXNlICdhc2NpaSc6IGNhc2UgJ2JpbmFyeSc6IGNhc2UgJ2Jhc2U2NCc6IGNhc2UgJ3VjczInOiBjYXNlICd1Y3MtMic6IGNhc2UgJ3V0ZjE2bGUnOiBjYXNlICd1dGYtMTZsZSc6IGNhc2UgJ3Jhdyc6IHJldHVybiB0cnVlO1xuICAgICAgICAgZGVmYXVsdDogcmV0dXJuIGZhbHNlO1xuICAgICAgIH1cbiAgICAgfVxuXG5cbmZ1bmN0aW9uIGFzc2VydEVuY29kaW5nKGVuY29kaW5nKSB7XG4gIGlmIChlbmNvZGluZyAmJiAhaXNCdWZmZXJFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZyk7XG4gIH1cbn1cblxuLy8gU3RyaW5nRGVjb2RlciBwcm92aWRlcyBhbiBpbnRlcmZhY2UgZm9yIGVmZmljaWVudGx5IHNwbGl0dGluZyBhIHNlcmllcyBvZlxuLy8gYnVmZmVycyBpbnRvIGEgc2VyaWVzIG9mIEpTIHN0cmluZ3Mgd2l0aG91dCBicmVha2luZyBhcGFydCBtdWx0aS1ieXRlXG4vLyBjaGFyYWN0ZXJzLiBDRVNVLTggaXMgaGFuZGxlZCBhcyBwYXJ0IG9mIHRoZSBVVEYtOCBlbmNvZGluZy5cbi8vXG4vLyBAVE9ETyBIYW5kbGluZyBhbGwgZW5jb2RpbmdzIGluc2lkZSBhIHNpbmdsZSBvYmplY3QgbWFrZXMgaXQgdmVyeSBkaWZmaWN1bHRcbi8vIHRvIHJlYXNvbiBhYm91dCB0aGlzIGNvZGUsIHNvIGl0IHNob3VsZCBiZSBzcGxpdCB1cCBpbiB0aGUgZnV0dXJlLlxuLy8gQFRPRE8gVGhlcmUgc2hvdWxkIGJlIGEgdXRmOC1zdHJpY3QgZW5jb2RpbmcgdGhhdCByZWplY3RzIGludmFsaWQgVVRGLTggY29kZVxuLy8gcG9pbnRzIGFzIHVzZWQgYnkgQ0VTVS04LlxuZXhwb3J0IGZ1bmN0aW9uIFN0cmluZ0RlY29kZXIoZW5jb2RpbmcpIHtcbiAgdGhpcy5lbmNvZGluZyA9IChlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvWy1fXS8sICcnKTtcbiAgYXNzZXJ0RW5jb2RpbmcoZW5jb2RpbmcpO1xuICBzd2l0Y2ggKHRoaXMuZW5jb2RpbmcpIHtcbiAgICBjYXNlICd1dGY4JzpcbiAgICAgIC8vIENFU1UtOCByZXByZXNlbnRzIGVhY2ggb2YgU3Vycm9nYXRlIFBhaXIgYnkgMy1ieXRlc1xuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgLy8gVVRGLTE2IHJlcHJlc2VudHMgZWFjaCBvZiBTdXJyb2dhdGUgUGFpciBieSAyLWJ5dGVzXG4gICAgICB0aGlzLnN1cnJvZ2F0ZVNpemUgPSAyO1xuICAgICAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhciA9IHV0ZjE2RGV0ZWN0SW5jb21wbGV0ZUNoYXI7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgLy8gQmFzZS02NCBzdG9yZXMgMyBieXRlcyBpbiA0IGNoYXJzLCBhbmQgcGFkcyB0aGUgcmVtYWluZGVyLlxuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMztcbiAgICAgIHRoaXMuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSBiYXNlNjREZXRlY3RJbmNvbXBsZXRlQ2hhcjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aGlzLndyaXRlID0gcGFzc1Rocm91Z2hXcml0ZTtcbiAgICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEVub3VnaCBzcGFjZSB0byBzdG9yZSBhbGwgYnl0ZXMgb2YgYSBzaW5nbGUgY2hhcmFjdGVyLiBVVEYtOCBuZWVkcyA0XG4gIC8vIGJ5dGVzLCBidXQgQ0VTVS04IG1heSByZXF1aXJlIHVwIHRvIDYgKDMgYnl0ZXMgcGVyIHN1cnJvZ2F0ZSkuXG4gIHRoaXMuY2hhckJ1ZmZlciA9IG5ldyBCdWZmZXIoNik7XG4gIC8vIE51bWJlciBvZiBieXRlcyByZWNlaXZlZCBmb3IgdGhlIGN1cnJlbnQgaW5jb21wbGV0ZSBtdWx0aS1ieXRlIGNoYXJhY3Rlci5cbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSAwO1xuICAvLyBOdW1iZXIgb2YgYnl0ZXMgZXhwZWN0ZWQgZm9yIHRoZSBjdXJyZW50IGluY29tcGxldGUgbXVsdGktYnl0ZSBjaGFyYWN0ZXIuXG4gIHRoaXMuY2hhckxlbmd0aCA9IDA7XG59O1xuXG5cbi8vIHdyaXRlIGRlY29kZXMgdGhlIGdpdmVuIGJ1ZmZlciBhbmQgcmV0dXJucyBpdCBhcyBKUyBzdHJpbmcgdGhhdCBpc1xuLy8gZ3VhcmFudGVlZCB0byBub3QgY29udGFpbiBhbnkgcGFydGlhbCBtdWx0aS1ieXRlIGNoYXJhY3RlcnMuIEFueSBwYXJ0aWFsXG4vLyBjaGFyYWN0ZXIgZm91bmQgYXQgdGhlIGVuZCBvZiB0aGUgYnVmZmVyIGlzIGJ1ZmZlcmVkIHVwLCBhbmQgd2lsbCBiZVxuLy8gcmV0dXJuZWQgd2hlbiBjYWxsaW5nIHdyaXRlIGFnYWluIHdpdGggdGhlIHJlbWFpbmluZyBieXRlcy5cbi8vXG4vLyBOb3RlOiBDb252ZXJ0aW5nIGEgQnVmZmVyIGNvbnRhaW5pbmcgYW4gb3JwaGFuIHN1cnJvZ2F0ZSB0byBhIFN0cmluZ1xuLy8gY3VycmVudGx5IHdvcmtzLCBidXQgY29udmVydGluZyBhIFN0cmluZyB0byBhIEJ1ZmZlciAodmlhIGBuZXcgQnVmZmVyYCwgb3Jcbi8vIEJ1ZmZlciN3cml0ZSkgd2lsbCByZXBsYWNlIGluY29tcGxldGUgc3Vycm9nYXRlcyB3aXRoIHRoZSB1bmljb2RlXG4vLyByZXBsYWNlbWVudCBjaGFyYWN0ZXIuIFNlZSBodHRwczovL2NvZGVyZXZpZXcuY2hyb21pdW0ub3JnLzEyMTE3MzAwOS8gLlxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgdmFyIGNoYXJTdHIgPSAnJztcbiAgLy8gaWYgb3VyIGxhc3Qgd3JpdGUgZW5kZWQgd2l0aCBhbiBpbmNvbXBsZXRlIG11bHRpYnl0ZSBjaGFyYWN0ZXJcbiAgd2hpbGUgKHRoaXMuY2hhckxlbmd0aCkge1xuICAgIC8vIGRldGVybWluZSBob3cgbWFueSByZW1haW5pbmcgYnl0ZXMgdGhpcyBidWZmZXIgaGFzIHRvIG9mZmVyIGZvciB0aGlzIGNoYXJcbiAgICB2YXIgYXZhaWxhYmxlID0gKGJ1ZmZlci5sZW5ndGggPj0gdGhpcy5jaGFyTGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQpID9cbiAgICAgICAgdGhpcy5jaGFyTGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQgOlxuICAgICAgICBidWZmZXIubGVuZ3RoO1xuXG4gICAgLy8gYWRkIHRoZSBuZXcgYnl0ZXMgdG8gdGhlIGNoYXIgYnVmZmVyXG4gICAgYnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCB0aGlzLmNoYXJSZWNlaXZlZCwgMCwgYXZhaWxhYmxlKTtcbiAgICB0aGlzLmNoYXJSZWNlaXZlZCArPSBhdmFpbGFibGU7XG5cbiAgICBpZiAodGhpcy5jaGFyUmVjZWl2ZWQgPCB0aGlzLmNoYXJMZW5ndGgpIHtcbiAgICAgIC8vIHN0aWxsIG5vdCBlbm91Z2ggY2hhcnMgaW4gdGhpcyBidWZmZXI/IHdhaXQgZm9yIG1vcmUgLi4uXG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIGJ5dGVzIGJlbG9uZ2luZyB0byB0aGUgY3VycmVudCBjaGFyYWN0ZXIgZnJvbSB0aGUgYnVmZmVyXG4gICAgYnVmZmVyID0gYnVmZmVyLnNsaWNlKGF2YWlsYWJsZSwgYnVmZmVyLmxlbmd0aCk7XG5cbiAgICAvLyBnZXQgdGhlIGNoYXJhY3RlciB0aGF0IHdhcyBzcGxpdFxuICAgIGNoYXJTdHIgPSB0aGlzLmNoYXJCdWZmZXIuc2xpY2UoMCwgdGhpcy5jaGFyTGVuZ3RoKS50b1N0cmluZyh0aGlzLmVuY29kaW5nKTtcblxuICAgIC8vIENFU1UtODogbGVhZCBzdXJyb2dhdGUgKEQ4MDAtREJGRikgaXMgYWxzbyB0aGUgaW5jb21wbGV0ZSBjaGFyYWN0ZXJcbiAgICB2YXIgY2hhckNvZGUgPSBjaGFyU3RyLmNoYXJDb2RlQXQoY2hhclN0ci5sZW5ndGggLSAxKTtcbiAgICBpZiAoY2hhckNvZGUgPj0gMHhEODAwICYmIGNoYXJDb2RlIDw9IDB4REJGRikge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoICs9IHRoaXMuc3Vycm9nYXRlU2l6ZTtcbiAgICAgIGNoYXJTdHIgPSAnJztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICB0aGlzLmNoYXJSZWNlaXZlZCA9IHRoaXMuY2hhckxlbmd0aCA9IDA7XG5cbiAgICAvLyBpZiB0aGVyZSBhcmUgbm8gbW9yZSBieXRlcyBpbiB0aGlzIGJ1ZmZlciwganVzdCBlbWl0IG91ciBjaGFyXG4gICAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjaGFyU3RyO1xuICAgIH1cbiAgICBicmVhaztcbiAgfVxuXG4gIC8vIGRldGVybWluZSBhbmQgc2V0IGNoYXJMZW5ndGggLyBjaGFyUmVjZWl2ZWRcbiAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpO1xuXG4gIHZhciBlbmQgPSBidWZmZXIubGVuZ3RoO1xuICBpZiAodGhpcy5jaGFyTGVuZ3RoKSB7XG4gICAgLy8gYnVmZmVyIHRoZSBpbmNvbXBsZXRlIGNoYXJhY3RlciBieXRlcyB3ZSBnb3RcbiAgICBidWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIDAsIGJ1ZmZlci5sZW5ndGggLSB0aGlzLmNoYXJSZWNlaXZlZCwgZW5kKTtcbiAgICBlbmQgLT0gdGhpcy5jaGFyUmVjZWl2ZWQ7XG4gIH1cblxuICBjaGFyU3RyICs9IGJ1ZmZlci50b1N0cmluZyh0aGlzLmVuY29kaW5nLCAwLCBlbmQpO1xuXG4gIHZhciBlbmQgPSBjaGFyU3RyLmxlbmd0aCAtIDE7XG4gIHZhciBjaGFyQ29kZSA9IGNoYXJTdHIuY2hhckNvZGVBdChlbmQpO1xuICAvLyBDRVNVLTg6IGxlYWQgc3Vycm9nYXRlIChEODAwLURCRkYpIGlzIGFsc28gdGhlIGluY29tcGxldGUgY2hhcmFjdGVyXG4gIGlmIChjaGFyQ29kZSA+PSAweEQ4MDAgJiYgY2hhckNvZGUgPD0gMHhEQkZGKSB7XG4gICAgdmFyIHNpemUgPSB0aGlzLnN1cnJvZ2F0ZVNpemU7XG4gICAgdGhpcy5jaGFyTGVuZ3RoICs9IHNpemU7XG4gICAgdGhpcy5jaGFyUmVjZWl2ZWQgKz0gc2l6ZTtcbiAgICB0aGlzLmNoYXJCdWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIHNpemUsIDAsIHNpemUpO1xuICAgIGJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgMCwgMCwgc2l6ZSk7XG4gICAgcmV0dXJuIGNoYXJTdHIuc3Vic3RyaW5nKDAsIGVuZCk7XG4gIH1cblxuICAvLyBvciBqdXN0IGVtaXQgdGhlIGNoYXJTdHJcbiAgcmV0dXJuIGNoYXJTdHI7XG59O1xuXG4vLyBkZXRlY3RJbmNvbXBsZXRlQ2hhciBkZXRlcm1pbmVzIGlmIHRoZXJlIGlzIGFuIGluY29tcGxldGUgVVRGLTggY2hhcmFjdGVyIGF0XG4vLyB0aGUgZW5kIG9mIHRoZSBnaXZlbiBidWZmZXIuIElmIHNvLCBpdCBzZXRzIHRoaXMuY2hhckxlbmd0aCB0byB0aGUgYnl0ZVxuLy8gbGVuZ3RoIHRoYXQgY2hhcmFjdGVyLCBhbmQgc2V0cyB0aGlzLmNoYXJSZWNlaXZlZCB0byB0aGUgbnVtYmVyIG9mIGJ5dGVzXG4vLyB0aGF0IGFyZSBhdmFpbGFibGUgZm9yIHRoaXMgY2hhcmFjdGVyLlxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgLy8gZGV0ZXJtaW5lIGhvdyBtYW55IGJ5dGVzIHdlIGhhdmUgdG8gY2hlY2sgYXQgdGhlIGVuZCBvZiB0aGlzIGJ1ZmZlclxuICB2YXIgaSA9IChidWZmZXIubGVuZ3RoID49IDMpID8gMyA6IGJ1ZmZlci5sZW5ndGg7XG5cbiAgLy8gRmlndXJlIG91dCBpZiBvbmUgb2YgdGhlIGxhc3QgaSBieXRlcyBvZiBvdXIgYnVmZmVyIGFubm91bmNlcyBhblxuICAvLyBpbmNvbXBsZXRlIGNoYXIuXG4gIGZvciAoOyBpID4gMDsgaS0tKSB7XG4gICAgdmFyIGMgPSBidWZmZXJbYnVmZmVyLmxlbmd0aCAtIGldO1xuXG4gICAgLy8gU2VlIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVVRGLTgjRGVzY3JpcHRpb25cblxuICAgIC8vIDExMFhYWFhYXG4gICAgaWYgKGkgPT0gMSAmJiBjID4+IDUgPT0gMHgwNikge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gMjtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIDExMTBYWFhYXG4gICAgaWYgKGkgPD0gMiAmJiBjID4+IDQgPT0gMHgwRSkge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gMztcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIDExMTEwWFhYXG4gICAgaWYgKGkgPD0gMyAmJiBjID4+IDMgPT0gMHgxRSkge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gNDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGk7XG59O1xuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgdmFyIHJlcyA9ICcnO1xuICBpZiAoYnVmZmVyICYmIGJ1ZmZlci5sZW5ndGgpXG4gICAgcmVzID0gdGhpcy53cml0ZShidWZmZXIpO1xuXG4gIGlmICh0aGlzLmNoYXJSZWNlaXZlZCkge1xuICAgIHZhciBjciA9IHRoaXMuY2hhclJlY2VpdmVkO1xuICAgIHZhciBidWYgPSB0aGlzLmNoYXJCdWZmZXI7XG4gICAgdmFyIGVuYyA9IHRoaXMuZW5jb2Rpbmc7XG4gICAgcmVzICs9IGJ1Zi5zbGljZSgwLCBjcikudG9TdHJpbmcoZW5jKTtcbiAgfVxuXG4gIHJldHVybiByZXM7XG59O1xuXG5mdW5jdGlvbiBwYXNzVGhyb3VnaFdyaXRlKGJ1ZmZlcikge1xuICByZXR1cm4gYnVmZmVyLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcpO1xufVxuXG5mdW5jdGlvbiB1dGYxNkRldGVjdEluY29tcGxldGVDaGFyKGJ1ZmZlcikge1xuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGJ1ZmZlci5sZW5ndGggJSAyO1xuICB0aGlzLmNoYXJMZW5ndGggPSB0aGlzLmNoYXJSZWNlaXZlZCA/IDIgOiAwO1xufVxuXG5mdW5jdGlvbiBiYXNlNjREZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpIHtcbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSBidWZmZXIubGVuZ3RoICUgMztcbiAgdGhpcy5jaGFyTGVuZ3RoID0gdGhpcy5jaGFyUmVjZWl2ZWQgPyAzIDogMDtcbn1cbiIsImltcG9ydCB7Z2VuZXJhdGVTY2hlbWF9IGZyb20gXCIuL2luZGV4U2NoZW1hQ3JlYXRvclwiO1xuaW1wb3J0IHsgaGFzLCBpc1N0cmluZywgZGlmZmVyZW5jZSwgZmluZCB9IGZyb20gXCJsb2Rhc2gvZnBcIjtcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJzYWZlLWJ1ZmZlclwiO1xuaW1wb3J0IHtTdHJpbmdEZWNvZGVyfSBmcm9tIFwic3RyaW5nX2RlY29kZXJcIjtcbmltcG9ydCB7Z2V0VHlwZX0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgeyBpc1NvbWV0aGluZyB9IGZyb20gXCIuLi9jb21tb25cIjtcblxuZXhwb3J0IGNvbnN0IEJVRkZFUl9NQVhfQllURVMgPSA1MjQyODg7IC8vIDAuNU1iXG5cbmV4cG9ydCBjb25zdCBDT05USU5VRV9SRUFESU5HX1JFQ09SRFMgPSBcIkNPTlRJTlVFX1JFQURJTkdcIjtcbmV4cG9ydCBjb25zdCBSRUFEX1JFTUFJTklOR19URVhUID0gXCJSRUFEX1JFTUFJTklOR1wiO1xuZXhwb3J0IGNvbnN0IENBTkNFTF9SRUFEID0gXCJDQU5DRUxcIjtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4V3JpdGVyID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlLCByZWFkYWJsZVN0cmVhbSwgd3JpdGFibGVTdHJlYW0sIGVuZCkgPT4ge1xuICAgIGNvbnN0IHNjaGVtYSA9IGdlbmVyYXRlU2NoZW1hKGhpZXJhcmNoeSwgaW5kZXhOb2RlKTtcblxuICAgIHJldHVybiAoe1xuICAgICAgICByZWFkOiByZWFkKHJlYWRhYmxlU3RyZWFtLCBzY2hlbWEpLFxuICAgICAgICB1cGRhdGVJbmRleDogdXBkYXRlSW5kZXgocmVhZGFibGVTdHJlYW0sIHdyaXRhYmxlU3RyZWFtLCBzY2hlbWEsIGVuZClcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleFJlYWRlciA9IChoaWVyYXJjaHksIGluZGV4Tm9kZSwgcmVhZGFibGVTdHJlYW0pID0+IFxuICAgIHJlYWQoXG4gICAgICAgIHJlYWRhYmxlU3RyZWFtLCBcbiAgICAgICAgZ2VuZXJhdGVTY2hlbWEoaGllcmFyY2h5LCBpbmRleE5vZGUpXG4gICAgKTtcblxuY29uc3QgdXBkYXRlSW5kZXggPSAocmVhZGFibGVTdHJlYW0sIHdyaXRhYmxlU3RyZWFtLCBzY2hlbWEpID0+IGFzeW5jIChpdGVtc1RvV3JpdGUsIGtleXNUb1JlbW92ZSkgPT4ge1xuICAgIGNvbnN0IHdyaXRlID0gbmV3T3V0cHV0V3JpdGVyKEJVRkZFUl9NQVhfQllURVMsIHdyaXRhYmxlU3RyZWFtKTtcbiAgICBjb25zdCB3cml0dGVuSXRlbXMgPSBbXTsgXG4gICAgYXdhaXQgcmVhZChyZWFkYWJsZVN0cmVhbSwgc2NoZW1hKShcbiAgICAgICAgYXN5bmMgaW5kZXhlZEl0ZW0gPT4ge1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlZCA9IGZpbmQoaSA9PiBpbmRleGVkSXRlbS5rZXkgPT09IGkua2V5KShpdGVtc1RvV3JpdGUpO1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlZCA9IGZpbmQoayA9PiBpbmRleGVkSXRlbS5rZXkgPT09IGspKGtleXNUb1JlbW92ZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKGlzU29tZXRoaW5nKHJlbW92ZWQpKSBcbiAgICAgICAgICAgICAgICByZXR1cm4gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xuXG4gICAgICAgICAgICBpZihpc1NvbWV0aGluZyh1cGRhdGVkKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlcmlhbGl6ZWRJdGVtID0gIHNlcmlhbGl6ZUl0ZW0oc2NoZW1hLCB1cGRhdGVkKTtcbiAgICAgICAgICAgICAgICBhd2FpdCB3cml0ZShzZXJpYWxpemVkSXRlbSk7XG4gICAgICAgICAgICAgICAgd3JpdHRlbkl0ZW1zLnB1c2godXBkYXRlZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRlKFxuICAgICAgICAgICAgICAgICAgICBzZXJpYWxpemVJdGVtKHNjaGVtYSwgaW5kZXhlZEl0ZW0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gXG5cbiAgICAgICAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XG5cbiAgICAgICAgfSxcbiAgICAgICAgYXN5bmMgdGV4dCA9PiBhd2FpdCB3cml0ZSh0ZXh0KVxuICAgICk7XG5cbiAgICBpZih3cml0dGVuSXRlbXMubGVuZ3RoICE9PSBpdGVtc1RvV3JpdGUubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHRvQWRkID0gZGlmZmVyZW5jZShpdGVtc1RvV3JpdGUsIHdyaXR0ZW5JdGVtcyk7XG4gICAgICAgIGZvcihsZXQgYWRkZWQgb2YgdG9BZGQpIHtcbiAgICAgICAgICAgIGF3YWl0IHdyaXRlKFxuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZUl0ZW0oc2NoZW1hLCBhZGRlZClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYod3JpdHRlbkl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBwb3RlbnRpYWxseSBhcmUgbm8gcmVjb3Jkc1xuICAgICAgICBhd2FpdCB3cml0ZShcIlwiKTtcbiAgICB9XG5cbiAgICBhd2FpdCB3cml0ZSgpO1xuICAgIGF3YWl0IHdyaXRhYmxlU3RyZWFtLmVuZCgpO1xufTtcblxuY29uc3QgcmVhZCA9IChyZWFkYWJsZVN0cmVhbSwgc2NoZW1hKSA9PiBhc3luYyAob25HZXRJdGVtLCBvbkdldFRleHQpID0+IHtcbiAgICBjb25zdCByZWFkSW5wdXQgPSBuZXdJbnB1dFJlYWRlcihyZWFkYWJsZVN0cmVhbSk7XG4gICAgbGV0IHRleHQgPSBhd2FpdCByZWFkSW5wdXQoKTtcbiAgICBsZXQgc3RhdHVzID0gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xuICAgIHdoaWxlKHRleHQubGVuZ3RoID4gMCkge1xuXG4gICAgICAgIGlmKHN0YXR1cyA9PT0gUkVBRF9SRU1BSU5JTkdfVEVYVCkge1xuICAgICAgICAgICAgYXdhaXQgb25HZXRUZXh0KHRleHQpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZihzdGF0dXMgPT09IENBTkNFTF9SRUFEKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcm93VGV4dCA9IFwiXCI7XG4gICAgICAgIGxldCBjdXJyZW50Q2hhckluZGV4PTA7XG4gICAgICAgIGZvcihsZXQgY3VycmVudENoYXIgb2YgdGV4dCkge1xuICAgICAgICAgICAgcm93VGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcIlxcclwiKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzID0gYXdhaXQgb25HZXRJdGVtKFxuICAgICAgICAgICAgICAgICAgICBkZXNlcmlhbGl6ZVJvdyhzY2hlbWEsIHJvd1RleHQpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByb3dUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBpZihzdGF0dXMgPT09IFJFQURfUkVNQUlOSU5HX1RFWFQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudENoYXJJbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoY3VycmVudENoYXJJbmRleCA8IHRleHQubGVuZ3RoIC0xKSB7XG4gICAgICAgICAgICBhd2FpdCBvbkdldFRleHQodGV4dC5zdWJzdHJpbmcoY3VycmVudENoYXJJbmRleCArIDEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHQgPSBhd2FpdCByZWFkSW5wdXQoKTtcbiAgICB9XG5cbiAgICBhd2FpdCByZWFkYWJsZVN0cmVhbS5kZXN0cm95KCk7XG5cbn07XG5cbmNvbnN0IG5ld091dHB1dFdyaXRlciA9IChmbHVzaEJvdW5kYXJ5LCB3cml0YWJsZVN0cmVhbSkgPT4ge1xuICAgIFxuICAgIGxldCBjdXJyZW50QnVmZmVyID0gbnVsbDtcblxuICAgIHJldHVybiBhc3luYyAodGV4dCkgPT4ge1xuXG4gICAgICAgIGlmKGlzU3RyaW5nKHRleHQpICYmIGN1cnJlbnRCdWZmZXIgPT09IG51bGwpXG4gICAgICAgICAgICBjdXJyZW50QnVmZmVyID0gQnVmZmVyLmZyb20odGV4dCwgXCJ1dGY4XCIpO1xuICAgICAgICBlbHNlIGlmKGlzU3RyaW5nKHRleHQpKVxuICAgICAgICAgICAgY3VycmVudEJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoW1xuICAgICAgICAgICAgICAgIGN1cnJlbnRCdWZmZXIsXG4gICAgICAgICAgICAgICAgQnVmZmVyLmZyb20odGV4dCwgXCJ1dGY4XCIpXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgXG4gICAgICAgIGlmKGN1cnJlbnRCdWZmZXIgIT09IG51bGwgJiZcbiAgICAgICAgICAgIChjdXJyZW50QnVmZmVyLmxlbmd0aCA+IGZsdXNoQm91bmRhcnlcbiAgICAgICAgICAgICB8fCAhaXNTdHJpbmcodGV4dCkpKSB7XG5cbiAgICAgICAgICAgIGF3YWl0IHdyaXRhYmxlU3RyZWFtLndyaXRlKGN1cnJlbnRCdWZmZXIpO1xuICAgICAgICAgICAgY3VycmVudEJ1ZmZlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5jb25zdCBuZXdJbnB1dFJlYWRlciA9IChyZWFkYWJsZVN0cmVhbSkgPT4ge1xuXG4gICAgY29uc3QgZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKCd1dGY4Jyk7XG4gICAgbGV0IHJlbWFpbmluZ0J5dGVzID0gW107XG5cbiAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgIGxldCBuZXh0Qnl0ZXNCdWZmZXIgPSBhd2FpdCByZWFkYWJsZVN0cmVhbS5yZWFkKEJVRkZFUl9NQVhfQllURVMpO1xuICAgICAgICBjb25zdCByZW1haW5pbmdCdWZmZXIgPSBCdWZmZXIuZnJvbShyZW1haW5pbmdCeXRlcyk7XG5cbiAgICAgICAgaWYoIW5leHRCeXRlc0J1ZmZlcikgbmV4dEJ5dGVzQnVmZmVyID0gQnVmZmVyLmZyb20oW10pO1xuXG4gICAgICAgIGNvbnN0IG1vcmVUb1JlYWQgPSBuZXh0Qnl0ZXNCdWZmZXIubGVuZ3RoID09PSBCVUZGRVJfTUFYX0JZVEVTO1xuXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoXG4gICAgICAgICAgICBbcmVtYWluaW5nQnVmZmVyLCBuZXh0Qnl0ZXNCdWZmZXJdLFxuICAgICAgICAgICAgcmVtYWluaW5nQnVmZmVyLmxlbmd0aCArIG5leHRCeXRlc0J1ZmZlci5sZW5ndGgpO1xuXG4gICAgICAgIGNvbnN0IHRleHQgPSBkZWNvZGVyLndyaXRlKGJ1ZmZlcik7XG4gICAgICAgIHJlbWFpbmluZ0J5dGVzID0gZGVjb2Rlci5lbmQoYnVmZmVyKTtcblxuICAgICAgICBpZighbW9yZVRvUmVhZCAmJiByZW1haW5pbmdCeXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBpZiBmb3IgYW55IHJlYXNvbiwgd2UgaGF2ZSByZW1haW5pbmcgYnl0ZXMgYXQgdGhlIGVuZFxuICAgICAgICAgICAgLy8gb2YgdGhlIHN0cmVhbSwganVzdCBkaXNjYXJkIC0gZG9udCBzZWUgd2h5IHRoaXMgc2hvdWxkXG4gICAgICAgICAgICAvLyBldmVyIGhhcHBlbiwgYnV0IGlmIGl0IGRvZXMsIGl0IGNvdWxkIGNhdXNlIGEgc3RhY2sgb3ZlcmZsb3dcbiAgICAgICAgICAgIHJlbWFpbmluZ0J5dGVzID0gW107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9O1xufTtcblxuY29uc3QgZGVzZXJpYWxpemVSb3cgPSAoc2NoZW1hLCByb3dUZXh0KSA9PiB7XG4gICAgbGV0IGN1cnJlbnRQcm9wSW5kZXggPSAwO1xuICAgIGxldCBjdXJyZW50Q2hhckluZGV4ID0gMDtcbiAgICBsZXQgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XG4gICAgbGV0IGlzRXNjYXBlZCA9IGZhbHNlO1xuICAgIGNvbnN0IGl0ZW0gPSB7fTtcblxuICAgIGNvbnN0IHNldEN1cnJlbnRQcm9wID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJyZW50UHJvcCA9IHNjaGVtYVtjdXJyZW50UHJvcEluZGV4XTtcbiAgICAgICAgY29uc3QgdHlwZSA9IGdldFR5cGUoY3VycmVudFByb3AudHlwZSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY3VycmVudFZhbHVlVGV4dCA9PT0gXCJcIlxuICAgICAgICAgICAgICAgICAgICAgID8gdHlwZS5nZXREZWZhdWx0VmFsdWUoKVxuICAgICAgICAgICAgICAgICAgICAgIDogdHlwZS5zYWZlUGFyc2VWYWx1ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCk7XG4gICAgICAgIGl0ZW1bY3VycmVudFByb3AubmFtZV0gPSB2YWx1ZTtcbiAgICB9O1xuICAgIFxuICAgIHdoaWxlKGN1cnJlbnRQcm9wSW5kZXggPCBzY2hlbWEubGVuZ3RoKSB7XG5cbiAgICAgICAgaWYoY3VycmVudENoYXJJbmRleCA8IHJvd1RleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2hhciA9IHJvd1RleHRbY3VycmVudENoYXJJbmRleF07XG4gICAgICAgICAgICBpZihpc0VzY2FwZWQpIHtcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCJyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCArPSBcIlxcclwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZVRleHQgKz0gY3VycmVudENoYXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlzRXNjYXBlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCIsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0Q3VycmVudFByb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQcm9wSW5kZXgrKztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoY3VycmVudENoYXIgPT09IFwiXFxcXFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzRXNjYXBlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyZW50Q2hhckluZGV4Kys7IFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICBzZXRDdXJyZW50UHJvcCgpO1xuICAgICAgICAgICAgY3VycmVudFByb3BJbmRleCsrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZW07XG59O1xuXG5leHBvcnQgY29uc3Qgc2VyaWFsaXplSXRlbSA9IChzY2hlbWEsIGl0ZW0pICA9PiB7XG5cbiAgICBsZXQgcm93VGV4dCA9IFwiXCJcblxuICAgIGZvcihsZXQgcHJvcCBvZiBzY2hlbWEpIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IGdldFR5cGUocHJvcC50eXBlKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBoYXMocHJvcC5uYW1lKShpdGVtKVxuICAgICAgICAgICAgICAgICAgICAgID8gaXRlbVtwcm9wLm5hbWVdXG4gICAgICAgICAgICAgICAgICAgICAgOiB0eXBlLmdldERlZmF1bHRWYWx1ZSgpXG4gICAgICAgIFxuICAgICAgICBjb25zdCB2YWxTdHIgPSB0eXBlLnN0cmluZ2lmeSh2YWx1ZSk7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHZhbFN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudENoYXIgPSB2YWxTdHJbaV07XG4gICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCIsXCIgXG4gICAgICAgICAgICAgICB8fCBjdXJyZW50Q2hhciA9PT0gXCJcXHJcIiBcbiAgICAgICAgICAgICAgIHx8IGN1cnJlbnRDaGFyID09PSBcIlxcXFxcIikge1xuICAgICAgICAgICAgICAgIHJvd1RleHQgKz0gXCJcXFxcXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcIlxcclwiKSB7XG4gICAgICAgICAgICAgICAgcm93VGV4dCArPSBcInJcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcm93VGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJvd1RleHQgKz0gXCIsXCI7XG4gICAgfVxuXG4gICAgcm93VGV4dCArPSBcIlxcclwiO1xuICAgIHJldHVybiByb3dUZXh0O1xufTsiLCJpbXBvcnQgbHVuciBmcm9tICdsdW5yJztcbmltcG9ydCB7XG4gIGdldEhhc2hDb2RlLFxuICBqb2luS2V5XG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBnZXRBY3R1YWxLZXlPZlBhcmVudCxcbiAgaXNHbG9iYWxJbmRleCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7cHJvbWlzZVJlYWRhYmxlU3RyZWFtfSBmcm9tIFwiLi9wcm9taXNlUmVhZGFibGVTdHJlYW1cIjtcbmltcG9ydCB7IGNyZWF0ZUluZGV4RmlsZSB9IGZyb20gJy4vc2hhcmRpbmcnO1xuaW1wb3J0IHsgZ2VuZXJhdGVTY2hlbWEgfSBmcm9tICcuL2luZGV4U2NoZW1hQ3JlYXRvcic7XG5pbXBvcnQgeyBnZXRJbmRleFJlYWRlciwgQ09OVElOVUVfUkVBRElOR19SRUNPUkRTIH0gZnJvbSAnLi9zZXJpYWxpemVyJztcblxuZXhwb3J0IGNvbnN0IHJlYWRJbmRleCA9IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KSA9PiB7XG4gIGNvbnN0IHJlY29yZHMgPSBbXTtcbiAgY29uc3QgZG9SZWFkID0gaXRlcmF0ZUluZGV4KFxuICAgICAgICBhc3luYyBpdGVtID0+IHtcbiAgICAgIHJlY29yZHMucHVzaChpdGVtKTtcbiAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XG4gICAgfSxcbiAgICAgICAgYXN5bmMgKCkgPT4gcmVjb3Jkc1xuICApO1xuXG4gIHJldHVybiBhd2FpdCBkb1JlYWQoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2VhcmNoSW5kZXggPSBhc3luYyAoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSwgc2VhcmNoUGhyYXNlKSA9PiB7XG4gIGNvbnN0IHJlY29yZHMgPSBbXTtcbiAgY29uc3Qgc2NoZW1hID0gZ2VuZXJhdGVTY2hlbWEoaGllcmFyY2h5LCBpbmRleCk7XG4gIGNvbnN0IGRvUmVhZCA9IGl0ZXJhdGVJbmRleChcbiAgICAgICAgYXN5bmMgaXRlbSA9PiB7XG4gICAgICBjb25zdCBpZHggPSBsdW5yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yZWYoJ2tleScpO1xuICAgICAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIHNjaGVtYSkge1xuICAgICAgICAgIHRoaXMuZmllbGQoZmllbGQubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGQoaXRlbSk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNlYXJjaFJlc3VsdHMgPSBpZHguc2VhcmNoKHNlYXJjaFBocmFzZSk7XG4gICAgICBpZiAoc2VhcmNoUmVzdWx0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaXRlbS5fc2VhcmNoUmVzdWx0ID0gc2VhcmNoUmVzdWx0c1swXTtcbiAgICAgICAgcmVjb3Jkcy5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcbiAgICB9LFxuICAgICAgICBhc3luYyAoKSA9PiByZWNvcmRzXG4gICk7XG5cbiAgcmV0dXJuIGF3YWl0IGRvUmVhZChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleGVkRGF0YUtleV9mcm9tSW5kZXhLZXkgPSAoaW5kZXhLZXkpID0+IFxuICBgJHtpbmRleEtleX0ke2luZGV4S2V5LmVuZHNXaXRoKCcuY3N2JykgPyAnJyA6ICcuY3N2J31gO1xuXG5leHBvcnQgY29uc3QgdW5pcXVlSW5kZXhOYW1lID0gaW5kZXggPT4gYGlkeF8ke1xuICBnZXRIYXNoQ29kZShgJHtpbmRleC5maWx0ZXJ9JHtpbmRleC5tYXB9YClcbn0uY3N2YDtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4ZWREYXRhS2V5ID0gKGRlY2VuZGFudEtleSwgaW5kZXhOb2RlKSA9PiB7XG4gIGlmIChpc0dsb2JhbEluZGV4KGluZGV4Tm9kZSkpIHsgcmV0dXJuIGAke2luZGV4Tm9kZS5ub2RlS2V5KCl9LmNzdmA7IH1cblxuICBjb25zdCBpbmRleGVkRGF0YVBhcmVudEtleSA9IGdldEFjdHVhbEtleU9mUGFyZW50KFxuICAgIGluZGV4Tm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksXG4gICAgZGVjZW5kYW50S2V5LFxuICApO1xuXG4gIGNvbnN0IGluZGV4TmFtZSA9IGluZGV4Tm9kZS5uYW1lXG4gICAgPyBgJHtpbmRleE5vZGUubmFtZX0uY3N2YFxuICAgIDogdW5pcXVlSW5kZXhOYW1lKGluZGV4Tm9kZSk7XG5cbiAgcmV0dXJuIGpvaW5LZXkoXG4gICAgaW5kZXhlZERhdGFQYXJlbnRLZXksXG4gICAgaW5kZXhOYW1lLFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGl0ZXJhdGVJbmRleCA9IChvbkdldEl0ZW0sIGdldEZpbmFsUmVzdWx0KSA9PiBhc3luYyAoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlYWRhYmxlU3RyZWFtID0gcHJvbWlzZVJlYWRhYmxlU3RyZWFtKFxuICAgICAgICBhd2FpdCBkYXRhc3RvcmUucmVhZGFibGVGaWxlU3RyZWFtKGluZGV4ZWREYXRhS2V5KVxuICAgICk7XG5cbiAgICBjb25zdCByZWFkID0gZ2V0SW5kZXhSZWFkZXIoaGllcmFyY2h5LCBpbmRleCwgcmVhZGFibGVTdHJlYW0pO1xuICAgIGF3YWl0IHJlYWQob25HZXRJdGVtKTtcbiAgICByZXR1cm4gZ2V0RmluYWxSZXN1bHQoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGluZGV4ZWREYXRhS2V5KSkge1xuICAgICAgdGhyb3cgZTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgY3JlYXRlSW5kZXhGaWxlKFxuICAgICAgICBkYXRhc3RvcmUsXG4gICAgICAgIGluZGV4ZWREYXRhS2V5LFxuICAgICAgICBpbmRleCxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxufTtcbiIsImltcG9ydCB7IGZsYXR0ZW4sIG1lcmdlIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIHNhZmVLZXksIGFwaVdyYXBwZXIsICQsXG4gIGV2ZW50cywgaXNOb25FbXB0eVN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHJlYWRJbmRleCwgc2VhcmNoSW5kZXggfSBmcm9tICcuLi9pbmRleGluZy9yZWFkJztcbmltcG9ydCB7XG4gIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSxcbiAgZ2V0U2hhcmRLZXlzSW5SYW5nZSxcbn0gZnJvbSAnLi4vaW5kZXhpbmcvc2hhcmRpbmcnO1xuaW1wb3J0IHtcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aCwgaXNJbmRleCxcbiAgaXNTaGFyZGVkSW5kZXgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBsaXN0SXRlbXMgPSBhcHAgPT4gYXN5bmMgKGluZGV4S2V5LCBvcHRpb25zKSA9PiB7XG4gIGluZGV4S2V5ID0gc2FmZUtleShpbmRleEtleSk7XG4gIHJldHVybiBhcGlXcmFwcGVyKFxuICAgIGFwcCxcbiAgICBldmVudHMuaW5kZXhBcGkubGlzdEl0ZW1zLFxuICAgIHBlcm1pc3Npb24ucmVhZEluZGV4LmlzQXV0aG9yaXplZChpbmRleEtleSksXG4gICAgeyBpbmRleEtleSwgb3B0aW9ucyB9LFxuICAgIF9saXN0SXRlbXMsIGFwcCwgaW5kZXhLZXksIG9wdGlvbnMsXG4gICk7XG59XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0geyByYW5nZVN0YXJ0UGFyYW1zOiBudWxsLCByYW5nZUVuZFBhcmFtczogbnVsbCwgc2VhcmNoUGhyYXNlOiBudWxsIH07XG5cbmNvbnN0IF9saXN0SXRlbXMgPSBhc3luYyAoYXBwLCBpbmRleEtleSwgb3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zKSA9PiB7XG4gIGNvbnN0IHsgc2VhcmNoUGhyYXNlLCByYW5nZVN0YXJ0UGFyYW1zLCByYW5nZUVuZFBhcmFtcyB9ID0gJCh7fSwgW1xuICAgIG1lcmdlKG9wdGlvbnMpLFxuICAgIG1lcmdlKGRlZmF1bHRPcHRpb25zKSxcbiAgXSk7XG5cbiAgY29uc3QgZ2V0SXRlbXMgPSBhc3luYyBrZXkgPT4gKGlzTm9uRW1wdHlTdHJpbmcoc2VhcmNoUGhyYXNlKVxuICAgID8gYXdhaXQgc2VhcmNoSW5kZXgoXG4gICAgICBhcHAuaGllcmFyY2h5LFxuICAgICAgYXBwLmRhdGFzdG9yZSxcbiAgICAgIGluZGV4Tm9kZSxcbiAgICAgIGtleSxcbiAgICAgIHNlYXJjaFBocmFzZSxcbiAgICApXG4gICAgOiBhd2FpdCByZWFkSW5kZXgoXG4gICAgICBhcHAuaGllcmFyY2h5LFxuICAgICAgYXBwLmRhdGFzdG9yZSxcbiAgICAgIGluZGV4Tm9kZSxcbiAgICAgIGtleSxcbiAgICApKTtcblxuICBpbmRleEtleSA9IHNhZmVLZXkoaW5kZXhLZXkpO1xuICBjb25zdCBpbmRleE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKGluZGV4S2V5KTtcblxuICBpZiAoIWlzSW5kZXgoaW5kZXhOb2RlKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ3N1cHBsaWVkIGtleSBpcyBub3QgYW4gaW5kZXgnKTsgfVxuXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleE5vZGUpKSB7XG4gICAgY29uc3Qgc2hhcmRLZXlzID0gYXdhaXQgZ2V0U2hhcmRLZXlzSW5SYW5nZShcbiAgICAgIGFwcCwgaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zLFxuICAgICk7XG4gICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGsgb2Ygc2hhcmRLZXlzKSB7XG4gICAgICBpdGVtcy5wdXNoKGF3YWl0IGdldEl0ZW1zKGspKTtcbiAgICB9XG4gICAgcmV0dXJuIGZsYXR0ZW4oaXRlbXMpO1xuICB9XG4gIHJldHVybiBhd2FpdCBnZXRJdGVtcyhcbiAgICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXkoaW5kZXhLZXkpLFxuICApO1xufTtcbiIsImltcG9ydCB7IG1hcCwgaXNTdHJpbmcsIGhhcywgc29tZSB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxuICBmaW5kRmllbGQsIGdldE5vZGUsIGlzR2xvYmFsSW5kZXgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBsaXN0SXRlbXMgfSBmcm9tICcuLi9pbmRleEFwaS9saXN0SXRlbXMnO1xuaW1wb3J0IHtcbiAgJCwgYXBpV3JhcHBlclN5bmMsIGV2ZW50cywgc2FmZUtleVxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0SW5kZXhLZXlfQmFzZWRPbkRlY2VuZGFudCB9IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGdldENvbnRleHQgPSBhcHAgPT4gcmVjb3JkS2V5ID0+IHtcbiAgcmVjb3JkS2V5ID0gc2FmZUtleShyZWNvcmRLZXkpO1xuICByZXR1cm4gIGFwaVdyYXBwZXJTeW5jKFxuICAgIGFwcCxcbiAgICBldmVudHMucmVjb3JkQXBpLmdldENvbnRleHQsXG4gICAgcGVybWlzc2lvbi5yZWFkUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmRLZXkpLFxuICAgIHsgcmVjb3JkS2V5IH0sXG4gICAgX2dldENvbnRleHQsIGFwcCwgcmVjb3JkS2V5LFxuICApO1xufVxuXG5leHBvcnQgY29uc3QgX2dldENvbnRleHQgPSAoYXBwLCByZWNvcmRLZXkpID0+IHtcbiAgcmVjb3JkS2V5ID0gc2FmZUtleShyZWNvcmRLZXkpO1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShyZWNvcmRLZXkpO1xuXG4gIGNvbnN0IGNhY2hlZFJlZmVyZW5jZUluZGV4ZXMgPSB7fTtcblxuICBjb25zdCBsYXp5TG9hZFJlZmVyZW5jZUluZGV4ID0gYXN5bmMgKHR5cGVPcHRpb25zKSA9PiB7XG4gICAgaWYgKCFoYXModHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5KShjYWNoZWRSZWZlcmVuY2VJbmRleGVzKSkge1xuICAgICAgY2FjaGVkUmVmZXJlbmNlSW5kZXhlc1t0eXBlT3B0aW9ucy5pbmRleE5vZGVLZXldID0ge1xuICAgICAgICB0eXBlT3B0aW9ucyxcbiAgICAgICAgZGF0YTogYXdhaXQgcmVhZFJlZmVyZW5jZUluZGV4KFxuICAgICAgICAgIGFwcCwgcmVjb3JkS2V5LCB0eXBlT3B0aW9ucyxcbiAgICAgICAgKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhY2hlZFJlZmVyZW5jZUluZGV4ZXNbdHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5XTtcbiAgfTtcblxuICBjb25zdCBnZXRUeXBlT3B0aW9ucyA9IHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSA9PiAoaXNTdHJpbmcodHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKVxuICAgID8gZmluZEZpZWxkKHJlY29yZE5vZGUsIHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSlcbiAgICAgIC50eXBlT3B0aW9uc1xuICAgIDogdHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKTtcblxuICByZXR1cm4ge1xuICAgIHJlZmVyZW5jZUV4aXN0czogYXN5bmMgKHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSwga2V5KSA9PiB7XG4gICAgICBjb25zdCB0eXBlT3B0aW9ucyA9IGdldFR5cGVPcHRpb25zKHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSk7XG4gICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGxhenlMb2FkUmVmZXJlbmNlSW5kZXgodHlwZU9wdGlvbnMpO1xuICAgICAgcmV0dXJuIHNvbWUoaSA9PiBpLmtleSA9PT0ga2V5KShkYXRhKTtcbiAgICB9LFxuICAgIHJlZmVyZW5jZU9wdGlvbnM6IGFzeW5jICh0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHR5cGVPcHRpb25zID0gZ2V0VHlwZU9wdGlvbnModHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKTtcbiAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgbGF6eUxvYWRSZWZlcmVuY2VJbmRleCh0eXBlT3B0aW9ucyk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9LFxuICAgIHJlY29yZE5vZGUsXG4gIH07XG59O1xuXG5jb25zdCByZWFkUmVmZXJlbmNlSW5kZXggPSBhc3luYyAoYXBwLCByZWNvcmRLZXksIHR5cGVPcHRpb25zKSA9PiB7XG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldE5vZGUoYXBwLmhpZXJhcmNoeSwgdHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5KTtcbiAgY29uc3QgaW5kZXhLZXkgPSBpc0dsb2JhbEluZGV4KGluZGV4Tm9kZSlcbiAgICA/IGluZGV4Tm9kZS5ub2RlS2V5KClcbiAgICA6IGdldEluZGV4S2V5X0Jhc2VkT25EZWNlbmRhbnQoXG4gICAgICByZWNvcmRLZXksIGluZGV4Tm9kZSxcbiAgICApO1xuXG4gIGNvbnN0IGl0ZW1zID0gYXdhaXQgbGlzdEl0ZW1zKGFwcCkoaW5kZXhLZXkpO1xuICByZXR1cm4gJChpdGVtcywgW1xuICAgIG1hcChpID0+ICh7XG4gICAgICBrZXk6IGkua2V5LFxuICAgICAgdmFsdWU6IGlbdHlwZU9wdGlvbnMuZGlzcGxheVZhbHVlXSxcbiAgICB9KSksXG4gIF0pO1xufTtcbiIsImltcG9ydCB7XG4gIG1hcCwgcmVkdWNlLCBmaWx0ZXIsXG4gIGlzRW1wdHksIGZsYXR0ZW4sIGVhY2gsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBjb21waWxlRXhwcmVzc2lvbiB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBnZXRFeGFjdE5vZGVGb3JQYXRoIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IHZhbGlkYXRlRmllbGRQYXJzZSwgdmFsaWRhdGVUeXBlQ29uc3RyYWludHMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyAkLCBpc05vdGhpbmcsIGlzTm9uRW1wdHlTdHJpbmcgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgX2dldENvbnRleHQgfSBmcm9tICcuL2dldENvbnRleHQnO1xuXG5jb25zdCBmaWVsZFBhcnNlRXJyb3IgPSAoZmllbGROYW1lLCB2YWx1ZSkgPT4gKHtcbiAgZmllbGRzOiBbZmllbGROYW1lXSxcbiAgbWVzc2FnZTogYENvdWxkIG5vdCBwYXJzZSBmaWVsZCAke2ZpZWxkTmFtZX06JHt2YWx1ZX1gLFxufSk7XG5cbmNvbnN0IHZhbGlkYXRlQWxsRmllbGRQYXJzZSA9IChyZWNvcmQsIHJlY29yZE5vZGUpID0+ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgbWFwKGYgPT4gKHsgbmFtZTogZi5uYW1lLCBwYXJzZVJlc3VsdDogdmFsaWRhdGVGaWVsZFBhcnNlKGYsIHJlY29yZCkgfSkpLFxuICByZWR1Y2UoKGVycm9ycywgZikgPT4ge1xuICAgIGlmIChmLnBhcnNlUmVzdWx0LnN1Y2Nlc3MpIHJldHVybiBlcnJvcnM7XG4gICAgZXJyb3JzLnB1c2goXG4gICAgICBmaWVsZFBhcnNlRXJyb3IoZi5uYW1lLCBmLnBhcnNlUmVzdWx0LnZhbHVlKSxcbiAgICApO1xuICAgIHJldHVybiBlcnJvcnM7XG4gIH0sIFtdKSxcbl0pO1xuXG5jb25zdCB2YWxpZGF0ZUFsbFR5cGVDb25zdHJhaW50cyA9IGFzeW5jIChyZWNvcmQsIHJlY29yZE5vZGUsIGNvbnRleHQpID0+IHtcbiAgY29uc3QgZXJyb3JzID0gW107XG4gIGZvciAoY29uc3QgZmllbGQgb2YgcmVjb3JkTm9kZS5maWVsZHMpIHtcbiAgICAkKGF3YWl0IHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzKGZpZWxkLCByZWNvcmQsIGNvbnRleHQpLCBbXG4gICAgICBmaWx0ZXIoaXNOb25FbXB0eVN0cmluZyksXG4gICAgICBtYXAobSA9PiAoeyBtZXNzYWdlOiBtLCBmaWVsZHM6IFtmaWVsZC5uYW1lXSB9KSksXG4gICAgICBlYWNoKGUgPT4gZXJyb3JzLnB1c2goZSkpLFxuICAgIF0pO1xuICB9XG4gIHJldHVybiBlcnJvcnM7XG59O1xuXG5jb25zdCBydW5SZWNvcmRWYWxpZGF0aW9uUnVsZXMgPSAocmVjb3JkLCByZWNvcmROb2RlKSA9PiB7XG4gIGNvbnN0IHJ1blZhbGlkYXRpb25SdWxlID0gKHJ1bGUpID0+IHtcbiAgICBjb25zdCBpc1ZhbGlkID0gY29tcGlsZUV4cHJlc3Npb24ocnVsZS5leHByZXNzaW9uV2hlblZhbGlkKTtcbiAgICBjb25zdCBleHByZXNzaW9uQ29udGV4dCA9IHsgcmVjb3JkLCBfIH07XG4gICAgcmV0dXJuIChpc1ZhbGlkKGV4cHJlc3Npb25Db250ZXh0KVxuICAgICAgPyB7IHZhbGlkOiB0cnVlIH1cbiAgICAgIDogKHtcbiAgICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgICBmaWVsZHM6IHJ1bGUuaW52YWxpZEZpZWxkcyxcbiAgICAgICAgbWVzc2FnZTogcnVsZS5tZXNzYWdlV2hlbkludmFsaWQsXG4gICAgICB9KSk7XG4gIH07XG5cbiAgcmV0dXJuICQocmVjb3JkTm9kZS52YWxpZGF0aW9uUnVsZXMsIFtcbiAgICBtYXAocnVuVmFsaWRhdGlvblJ1bGUpLFxuICAgIGZsYXR0ZW4sXG4gICAgZmlsdGVyKHIgPT4gci52YWxpZCA9PT0gZmFsc2UpLFxuICAgIG1hcChyID0+ICh7IGZpZWxkczogci5maWVsZHMsIG1lc3NhZ2U6IHIubWVzc2FnZSB9KSksXG4gIF0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlID0gYXBwID0+IGFzeW5jIChyZWNvcmQsIGNvbnRleHQpID0+IHtcbiAgY29udGV4dCA9IGlzTm90aGluZyhjb250ZXh0KVxuICAgID8gX2dldENvbnRleHQoYXBwLCByZWNvcmQua2V5KVxuICAgIDogY29udGV4dDtcblxuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShyZWNvcmQua2V5KTtcbiAgY29uc3QgZmllbGRQYXJzZUZhaWxzID0gdmFsaWRhdGVBbGxGaWVsZFBhcnNlKHJlY29yZCwgcmVjb3JkTm9kZSk7XG5cbiAgLy8gbm9uIHBhcnNpbmcgd291bGQgY2F1c2UgZnVydGhlciBpc3N1ZXMgLSBleGl0IGhlcmVcbiAgaWYgKCFpc0VtcHR5KGZpZWxkUGFyc2VGYWlscykpIHsgcmV0dXJuICh7IGlzVmFsaWQ6IGZhbHNlLCBlcnJvcnM6IGZpZWxkUGFyc2VGYWlscyB9KTsgfVxuXG4gIGNvbnN0IHJlY29yZFZhbGlkYXRpb25SdWxlRmFpbHMgPSBydW5SZWNvcmRWYWxpZGF0aW9uUnVsZXMocmVjb3JkLCByZWNvcmROb2RlKTtcbiAgY29uc3QgdHlwZUNvbnRyYWludEZhaWxzID0gYXdhaXQgdmFsaWRhdGVBbGxUeXBlQ29uc3RyYWludHMocmVjb3JkLCByZWNvcmROb2RlLCBjb250ZXh0KTtcblxuICBpZiAoaXNFbXB0eShmaWVsZFBhcnNlRmFpbHMpXG4gICAgICAgJiYgaXNFbXB0eShyZWNvcmRWYWxpZGF0aW9uUnVsZUZhaWxzKVxuICAgICAgICYmIGlzRW1wdHkodHlwZUNvbnRyYWludEZhaWxzKSkge1xuICAgIHJldHVybiAoeyBpc1ZhbGlkOiB0cnVlLCBlcnJvcnM6IFtdIH0pO1xuICB9XG5cbiAgcmV0dXJuICh7XG4gICAgaXNWYWxpZDogZmFsc2UsXG4gICAgZXJyb3JzOiBfLnVuaW9uKGZpZWxkUGFyc2VGYWlscywgdHlwZUNvbnRyYWludEZhaWxzLCByZWNvcmRWYWxpZGF0aW9uUnVsZUZhaWxzKSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgaXNDb2xsZWN0aW9uUmVjb3JkLFxuICBpc1Jvb3QsXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyAkLCBhbGxUcnVlLCBqb2luS2V5IH0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgZW5zdXJlQ29sbGVjdGlvbklzSW5pdGlhbGlzZWQgPSBhc3luYyAoZGF0YXN0b3JlLCBub2RlLCBwYXJlbnRLZXkpID0+IHtcbiAgaWYgKCFhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKHBhcmVudEtleSkpIHtcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKHBhcmVudEtleSk7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihcbiAgICAgIGpvaW5LZXkocGFyZW50S2V5LCAnYWxsaWRzJyksXG4gICAgKTtcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKFxuICAgICAgam9pbktleShcbiAgICAgICAgcGFyZW50S2V5LFxuICAgICAgICAnYWxsaWRzJyxcbiAgICAgICAgbm9kZS5ub2RlSWQudG9TdHJpbmcoKSxcbiAgICAgICksXG4gICAgKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxpc2VSb290Q29sbGVjdGlvbnMgPSBhc3luYyAoZGF0YXN0b3JlLCBoaWVyYXJjaHkpID0+IHtcbiAgY29uc3Qgcm9vdENvbGxlY3Rpb25SZWNvcmQgPSBhbGxUcnVlKFxuICAgIG4gPT4gaXNSb290KG4ucGFyZW50KCkpLFxuICAgIGlzQ29sbGVjdGlvblJlY29yZCxcbiAgKTtcblxuICBjb25zdCBmbGF0aGllcmFyY2h5ID0gZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGhpZXJhcmNoeSk7XG5cbiAgY29uc3QgY29sbGVjdGlvblJlY29yZHMgPSAkKGZsYXRoaWVyYXJjaHksIFtcbiAgICBmaWx0ZXIocm9vdENvbGxlY3Rpb25SZWNvcmQpLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IGNvbCBvZiBjb2xsZWN0aW9uUmVjb3Jkcykge1xuICAgIGF3YWl0IGVuc3VyZUNvbGxlY3Rpb25Jc0luaXRpYWxpc2VkKFxuICAgICAgZGF0YXN0b3JlLFxuICAgICAgY29sLFxuICAgICAgY29sLmNvbGxlY3Rpb25QYXRoUmVneCgpLFxuICAgICk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlQ2hpbGRDb2xsZWN0aW9ucyA9IGFzeW5jIChhcHAsIHJlY29yZEtleSkgPT4ge1xuICBjb25zdCBjaGlsZENvbGxlY3Rpb25SZWNvcmRzID0gJChyZWNvcmRLZXksIFtcbiAgICBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpLFxuICAgIG4gPT4gbi5jaGlsZHJlbixcbiAgICBmaWx0ZXIoaXNDb2xsZWN0aW9uUmVjb3JkKSxcbiAgXSk7XG5cbiAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZENvbGxlY3Rpb25SZWNvcmRzKSB7XG4gICAgYXdhaXQgZW5zdXJlQ29sbGVjdGlvbklzSW5pdGlhbGlzZWQoXG4gICAgICBhcHAuZGF0YXN0b3JlLFxuICAgICAgY2hpbGQsXG4gICAgICBqb2luS2V5KHJlY29yZEtleSwgY2hpbGQuY29sbGVjdGlvbk5hbWUpLFxuICAgICk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBqb2luLCBwdWxsLFxuICBtYXAsIGZsYXR0ZW4sIG9yZGVyQnksXG4gIGZpbHRlciwgZmluZCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIGdldFBhcmVudEtleSxcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5LCBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgsXG4gIGlzQ29sbGVjdGlvblJlY29yZCwgaXNBbmNlc3Rvcixcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IGpvaW5LZXksIHNhZmVLZXksICQgfSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBhbGxJZENoYXJzID0gJzAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXy0nO1xuXG5jb25zdCBhbGxJZHNTdHJpbmdzRm9yRmFjdG9yID0gKGNvbGxlY3Rpb25Ob2RlKSA9PiB7XG4gIGNvbnN0IGZhY3RvciA9IGNvbGxlY3Rpb25Ob2RlLmFsbGlkc1NoYXJkRmFjdG9yO1xuICBjb25zdCBjaGFyUmFuZ2VQZXJTaGFyZCA9IDY0IC8gZmFjdG9yO1xuICBjb25zdCBhbGxJZFN0cmluZ3MgPSBbXTtcbiAgbGV0IGluZGV4ID0gMDtcbiAgbGV0IGN1cnJlbnRJZHNTaGFyZCA9ICcnO1xuICB3aGlsZSAoaW5kZXggPCA2NCkge1xuICAgIGN1cnJlbnRJZHNTaGFyZCArPSBhbGxJZENoYXJzW2luZGV4XTtcbiAgICBpZiAoKGluZGV4ICsgMSkgJSBjaGFyUmFuZ2VQZXJTaGFyZCA9PT0gMCkge1xuICAgICAgYWxsSWRTdHJpbmdzLnB1c2goY3VycmVudElkc1NoYXJkKTtcbiAgICAgIGN1cnJlbnRJZHNTaGFyZCA9ICcnO1xuICAgIH1cbiAgICBpbmRleCsrO1xuICB9XG5cbiAgcmV0dXJuIGFsbElkU3RyaW5ncztcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRBbGxJZHNTaGFyZE5hbWVzID0gKGFwcEhpZXJhcmNoeSwgY29sbGVjdGlvbktleSkgPT4ge1xuICBjb25zdCBjb2xsZWN0aW9uUmVjb3JkTm9kZSA9IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHBIaWVyYXJjaHkpKGNvbGxlY3Rpb25LZXkpO1xuICByZXR1cm4gJChjb2xsZWN0aW9uUmVjb3JkTm9kZSwgW1xuICAgIGMgPT4gW2Mubm9kZUlkXSxcbiAgICBtYXAoaSA9PiBtYXAoYyA9PiBfYWxsSWRzU2hhcmRLZXkoY29sbGVjdGlvbktleSwgaSwgYykpKGFsbElkc1N0cmluZ3NGb3JGYWN0b3IoY29sbGVjdGlvblJlY29yZE5vZGUpKSksXG4gICAgZmxhdHRlbixcbiAgXSk7XG59O1xuXG5jb25zdCBfYWxsSWRzU2hhcmRLZXkgPSAoY29sbGVjdGlvbktleSwgY2hpbGRObywgc2hhcmRLZXkpID0+IGpvaW5LZXkoXG4gIGNvbGxlY3Rpb25LZXksXG4gICdhbGxpZHMnLFxuICBjaGlsZE5vLFxuICBzaGFyZEtleSxcbik7XG5cbmV4cG9ydCBjb25zdCBnZXRBbGxJZHNTaGFyZEtleSA9IChhcHBIaWVyYXJjaHksIGNvbGxlY3Rpb25LZXksIHJlY29yZElkKSA9PiB7XG4gIGNvbnN0IGluZGV4T2ZGaXJzdERhc2ggPSByZWNvcmRJZC5pbmRleE9mKCctJyk7XG5cbiAgY29uc3QgY29sbGVjdGlvbk5vZGUgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwSGllcmFyY2h5KShjb2xsZWN0aW9uS2V5KTtcblxuICBjb25zdCBpZEZpcnN0Q2hhciA9IHJlY29yZElkW2luZGV4T2ZGaXJzdERhc2ggKyAxXTtcbiAgY29uc3QgYWxsSWRzU2hhcmRJZCA9ICQoY29sbGVjdGlvbk5vZGUsIFtcbiAgICBhbGxJZHNTdHJpbmdzRm9yRmFjdG9yLFxuICAgIGZpbmQoaSA9PiBpLmluY2x1ZGVzKGlkRmlyc3RDaGFyKSksXG4gIF0pO1xuXG4gIHJldHVybiBfYWxsSWRzU2hhcmRLZXkoXG4gICAgY29sbGVjdGlvbktleSxcbiAgICByZWNvcmRJZC5zbGljZSgwLCBpbmRleE9mRmlyc3REYXNoKSxcbiAgICBhbGxJZHNTaGFyZElkLFxuICApO1xufTtcblxuY29uc3QgZ2V0T3JDcmVhdGVTaGFyZEZpbGUgPSBhc3luYyAoZGF0YXN0b3JlLCBhbGxJZHNLZXkpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgZGF0YXN0b3JlLmxvYWRGaWxlKGFsbElkc0tleSk7XG4gIH0gY2F0Y2ggKGVMb2FkKSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGaWxlKGFsbElkc0tleSwgJycpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH0gY2F0Y2ggKGVDcmVhdGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEVycm9yIGxvYWRpbmcsIHRoZW4gY3JlYXRpbmcgYWxsSWRzICR7YWxsSWRzS2V5XG4gICAgICAgIH0gOiBMT0FEIDogJHtlTG9hZC5tZXNzYWdlXG4gICAgICAgIH0gOiBDUkVBVEUgOiAke2VDcmVhdGV9YCxcbiAgICAgICk7XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCBnZXRTaGFyZEZpbGUgPSBhc3luYyAoZGF0YXN0b3JlLCBhbGxJZHNLZXkpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgZGF0YXN0b3JlLmxvYWRGaWxlKGFsbElkc0tleSk7XG4gIH0gY2F0Y2ggKGVMb2FkKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgYWRkVG9BbGxJZHMgPSAoYXBwSGllcmFyY2h5LCBkYXRhc3RvcmUpID0+IGFzeW5jIChyZWNvcmQpID0+IHtcbiAgY29uc3QgYWxsSWRzS2V5ID0gZ2V0QWxsSWRzU2hhcmRLZXkoXG4gICAgYXBwSGllcmFyY2h5LFxuICAgIGdldFBhcmVudEtleShyZWNvcmQua2V5KSxcbiAgICByZWNvcmQuaWQsXG4gICk7XG5cbiAgbGV0IGFsbElkcyA9IGF3YWl0IGdldE9yQ3JlYXRlU2hhcmRGaWxlKGRhdGFzdG9yZSwgYWxsSWRzS2V5KTtcblxuICBhbGxJZHMgKz0gYCR7YWxsSWRzLmxlbmd0aCA+IDAgPyAnLCcgOiAnJ30ke3JlY29yZC5pZH1gO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS51cGRhdGVGaWxlKGFsbElkc0tleSwgYWxsSWRzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRBbGxJZHNJdGVyYXRvciA9IGFwcCA9PiBhc3luYyAoY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSkgPT4ge1xuICBjb2xsZWN0aW9uX0tleV9vcl9Ob2RlS2V5ID0gc2FmZUtleShjb2xsZWN0aW9uX0tleV9vcl9Ob2RlS2V5KTtcbiAgY29uc3QgdGFyZ2V0Tm9kZSA9IGdldENvbGxlY3Rpb25Ob2RlQnlLZXlPck5vZGVLZXkoXG4gICAgYXBwLmhpZXJhcmNoeSxcbiAgICBjb2xsZWN0aW9uX0tleV9vcl9Ob2RlS2V5LFxuICApO1xuXG4gIGNvbnN0IGdldEFsbElkc0l0ZXJhdG9yRm9yQ29sbGVjdGlvbktleSA9IGFzeW5jIChjb2xsZWN0aW9uS2V5KSA9PiB7XG4gICAgY29uc3QgYWxsX2FsbElkc0tleXMgPSBnZXRBbGxJZHNTaGFyZE5hbWVzKGFwcC5oaWVyYXJjaHksIGNvbGxlY3Rpb25LZXkpO1xuICAgIGxldCBzaGFyZEluZGV4ID0gMDtcblxuICAgIGNvbnN0IGFsbElkc0Zyb21TaGFyZEl0ZXJhdG9yID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKHNoYXJkSW5kZXggPT09IGFsbF9hbGxJZHNLZXlzLmxlbmd0aCkgeyByZXR1cm4gKHsgZG9uZTogdHJ1ZSwgcmVzdWx0OiB7IGlkczogW10sIGNvbGxlY3Rpb25LZXkgfSB9KTsgfVxuXG4gICAgICBjb25zdCBzaGFyZEtleSA9IGFsbF9hbGxJZHNLZXlzW3NoYXJkSW5kZXhdO1xuXG4gICAgICBjb25zdCBhbGxJZHMgPSBhd2FpdCBnZXRBbGxJZHNGcm9tU2hhcmQoYXBwLmRhdGFzdG9yZSwgc2hhcmRLZXkpO1xuXG4gICAgICBzaGFyZEluZGV4Kys7XG5cbiAgICAgIHJldHVybiAoe1xuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICBpZHM6IGFsbElkcyxcbiAgICAgICAgICBjb2xsZWN0aW9uS2V5LFxuICAgICAgICB9LFxuICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gYWxsSWRzRnJvbVNoYXJkSXRlcmF0b3I7XG4gIH07XG5cbiAgY29uc3QgYW5jZXN0b3JzID0gJChnZXRGbGF0dGVuZWRIaWVyYXJjaHkoYXBwLmhpZXJhcmNoeSksIFtcbiAgICBmaWx0ZXIoaXNDb2xsZWN0aW9uUmVjb3JkKSxcbiAgICBmaWx0ZXIobiA9PiBpc0FuY2VzdG9yKHRhcmdldE5vZGUpKG4pXG4gICAgICAgICAgICAgICAgICAgIHx8IG4ubm9kZUtleSgpID09PSB0YXJnZXROb2RlLm5vZGVLZXkoKSksXG4gICAgb3JkZXJCeShbbiA9PiBuLm5vZGVLZXkoKS5sZW5ndGhdLCBbJ2FzYyddKSxcbiAgXSk7IC8vIHBhcmVudHMgZmlyc3RcblxuICBjb25zdCB0cmF2ZXJzZUZvckl0ZXJhdGVyYXRvcnMgPSBhc3luYyAocGFyZW50UmVjb3JkS2V5ID0gJycsIGN1cnJlbnROb2RlSW5kZXggPSAwKSA9PiB7XG4gICAgY29uc3QgY3VycmVudE5vZGUgPSBhbmNlc3RvcnNbY3VycmVudE5vZGVJbmRleF07XG4gICAgY29uc3QgY3VycmVudENvbGxlY3Rpb25LZXkgPSBqb2luS2V5KFxuICAgICAgcGFyZW50UmVjb3JkS2V5LFxuICAgICAgY3VycmVudE5vZGUuY29sbGVjdGlvbk5hbWUsXG4gICAgKTtcbiAgICBpZiAoY3VycmVudE5vZGUubm9kZUtleSgpID09PSB0YXJnZXROb2RlLm5vZGVLZXkoKSkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgYXdhaXQgZ2V0QWxsSWRzSXRlcmF0b3JGb3JDb2xsZWN0aW9uS2V5KFxuICAgICAgICAgIGN1cnJlbnRDb2xsZWN0aW9uS2V5LFxuICAgICAgICApXTtcbiAgICB9XG4gICAgY29uc3QgYWxsSXRlcmF0b3JzID0gW107XG4gICAgY29uc3QgY3VycmVudEl0ZXJhdG9yID0gYXdhaXQgZ2V0QWxsSWRzSXRlcmF0b3JGb3JDb2xsZWN0aW9uS2V5KFxuICAgICAgY3VycmVudENvbGxlY3Rpb25LZXksXG4gICAgKTtcblxuICAgIGxldCBpZHMgPSBhd2FpdCBjdXJyZW50SXRlcmF0b3IoKTtcbiAgICB3aGlsZSAoaWRzLmRvbmUgPT09IGZhbHNlKSB7XG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIGlkcy5yZXN1bHQuaWRzKSB7XG4gICAgICAgIGFsbEl0ZXJhdG9ycy5wdXNoKFxuICAgICAgICAgIGF3YWl0IHRyYXZlcnNlRm9ySXRlcmF0ZXJhdG9ycyhcbiAgICAgICAgICAgIGpvaW5LZXkoY3VycmVudENvbGxlY3Rpb25LZXksIGlkKSxcbiAgICAgICAgICAgIGN1cnJlbnROb2RlSW5kZXggKyAxLFxuICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlkcyA9IGF3YWl0IGN1cnJlbnRJdGVyYXRvcigpO1xuICAgIH1cblxuICAgIHJldHVybiBmbGF0dGVuKGFsbEl0ZXJhdG9ycyk7XG4gIH07XG5cbiAgY29uc3QgaXRlcmF0b3JzQXJyYXkgPSBhd2FpdCB0cmF2ZXJzZUZvckl0ZXJhdGVyYXRvcnMoKTtcbiAgbGV0IGN1cnJlbnRJdGVyYXRvckluZGV4ID0gMDtcbiAgcmV0dXJuIGFzeW5jICgpID0+IHtcbiAgICBpZiAoaXRlcmF0b3JzQXJyYXkubGVuZ3RoID09PSAwKSB7IHJldHVybiB7IGRvbmU6IHRydWUsIHJlc3VsdDogW10gfTsgfVxuICAgIGNvbnN0IGlubmVyUmVzdWx0ID0gYXdhaXQgaXRlcmF0b3JzQXJyYXlbY3VycmVudEl0ZXJhdG9ySW5kZXhdKCk7XG4gICAgaWYgKCFpbm5lclJlc3VsdC5kb25lKSB7IHJldHVybiBpbm5lclJlc3VsdDsgfVxuICAgIGlmIChjdXJyZW50SXRlcmF0b3JJbmRleCA9PSBpdGVyYXRvcnNBcnJheS5sZW5ndGggLSAxKSB7XG4gICAgICByZXR1cm4geyBkb25lOiB0cnVlLCByZXN1bHQ6IGlubmVyUmVzdWx0LnJlc3VsdCB9O1xuICAgIH1cbiAgICBjdXJyZW50SXRlcmF0b3JJbmRleCsrO1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCByZXN1bHQ6IGlubmVyUmVzdWx0LnJlc3VsdCB9O1xuICB9O1xufTtcblxuY29uc3QgZ2V0QWxsSWRzRnJvbVNoYXJkID0gYXN5bmMgKGRhdGFzdG9yZSwgc2hhcmRLZXkpID0+IHtcbiAgY29uc3QgYWxsSWRzU3RyID0gYXdhaXQgZ2V0U2hhcmRGaWxlKGRhdGFzdG9yZSwgc2hhcmRLZXkpO1xuXG4gIGNvbnN0IGFsbElkcyA9IFtdO1xuICBsZXQgY3VycmVudElkID0gJyc7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsSWRzU3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY3VycmVudENoYXIgPSBhbGxJZHNTdHIuY2hhckF0KGkpO1xuICAgIGNvbnN0IGlzTGFzdCA9IChpID09PSBhbGxJZHNTdHIubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGN1cnJlbnRDaGFyID09PSAnLCcgfHwgaXNMYXN0KSB7XG4gICAgICBpZiAoaXNMYXN0KSBjdXJyZW50SWQgKz0gY3VycmVudENoYXI7XG4gICAgICBhbGxJZHMucHVzaChjdXJyZW50SWQpO1xuICAgICAgY3VycmVudElkID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnRJZCArPSBjdXJyZW50Q2hhcjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFsbElkcztcbn07XG5cbmV4cG9ydCBjb25zdCByZW1vdmVGcm9tQWxsSWRzID0gKGFwcEhpZXJhcmNoeSwgZGF0YXN0b3JlKSA9PiBhc3luYyAocmVjb3JkKSA9PiB7XG4gIGNvbnN0IHNoYXJkS2V5ID0gZ2V0QWxsSWRzU2hhcmRLZXkoXG4gICAgYXBwSGllcmFyY2h5LFxuICAgIGdldFBhcmVudEtleShyZWNvcmQua2V5KSxcbiAgICByZWNvcmQuaWQsXG4gICk7XG4gIGNvbnN0IGFsbElkcyA9IGF3YWl0IGdldEFsbElkc0Zyb21TaGFyZChkYXRhc3RvcmUsIHNoYXJkS2V5KTtcblxuICBjb25zdCBuZXdJZHMgPSAkKGFsbElkcywgW1xuICAgIHB1bGwocmVjb3JkLmlkKSxcbiAgICBqb2luKCcsJyksXG4gIF0pO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS51cGRhdGVGaWxlKHNoYXJkS2V5LCBuZXdJZHMpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0QWxsSWRzSXRlcmF0b3I7XG4iLCJpbXBvcnQge1xuICBqb2luS2V5LCBrZXlTZXAsIGdldEhhc2hDb2RlLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0TGFzdFBhcnRJbktleSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5cbmV4cG9ydCBjb25zdCBUUkFOU0FDVElPTlNfRk9MREVSID0gYCR7a2V5U2VwfS50cmFuc2FjdGlvbnNgO1xuZXhwb3J0IGNvbnN0IExPQ0tfRklMRU5BTUUgPSAnbG9jayc7XG5leHBvcnQgY29uc3QgTE9DS19GSUxFX0tFWSA9IGpvaW5LZXkoXG4gIFRSQU5TQUNUSU9OU19GT0xERVIsIExPQ0tfRklMRU5BTUUsXG4pO1xuZXhwb3J0IGNvbnN0IGlkU2VwID0gJyQnO1xuXG5jb25zdCBpc09mVHlwZSA9IHR5cCA9PiB0cmFucyA9PiB0cmFucy50cmFuc2FjdGlvblR5cGUgPT09IHR5cDtcblxuZXhwb3J0IGNvbnN0IENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04gPSAnY3JlYXRlJztcbmV4cG9ydCBjb25zdCBVUERBVEVfUkVDT1JEX1RSQU5TQUNUSU9OID0gJ3VwZGF0ZSc7XG5leHBvcnQgY29uc3QgREVMRVRFX1JFQ09SRF9UUkFOU0FDVElPTiA9ICdkZWxldGUnO1xuZXhwb3J0IGNvbnN0IEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OID0gJ2J1aWxkJztcblxuZXhwb3J0IGNvbnN0IGlzVXBkYXRlID0gaXNPZlR5cGUoVVBEQVRFX1JFQ09SRF9UUkFOU0FDVElPTik7XG5leHBvcnQgY29uc3QgaXNEZWxldGUgPSBpc09mVHlwZShERUxFVEVfUkVDT1JEX1RSQU5TQUNUSU9OKTtcbmV4cG9ydCBjb25zdCBpc0NyZWF0ZSA9IGlzT2ZUeXBlKENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04pO1xuZXhwb3J0IGNvbnN0IGlzQnVpbGRJbmRleCA9IGlzT2ZUeXBlKEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OKTtcblxuZXhwb3J0IGNvbnN0IGtleVRvRm9sZGVyTmFtZSA9IG5vZGVLZXkgPT4gZ2V0SGFzaENvZGUobm9kZUtleSk7XG5cbmV4cG9ydCBjb25zdCBnZXRUcmFuc2FjdGlvbklkID0gKHJlY29yZElkLCB0cmFuc2FjdGlvblR5cGUsIHVuaXF1ZUlkKSA9PiBcbiAgYCR7cmVjb3JkSWR9JHtpZFNlcH0ke3RyYW5zYWN0aW9uVHlwZX0ke2lkU2VwfSR7dW5pcXVlSWR9YDtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkSW5kZXhGb2xkZXIgPSAnLkJVSUxELSc7XG5leHBvcnQgY29uc3Qgbm9kZUtleUhhc2hGcm9tQnVpbGRGb2xkZXIgPSBmb2xkZXIgPT4gZm9sZGVyLnJlcGxhY2UoYnVpbGRJbmRleEZvbGRlciwgJycpO1xuXG5leHBvcnQgY29uc3QgaXNCdWlsZEluZGV4Rm9sZGVyID0ga2V5ID0+IGdldExhc3RQYXJ0SW5LZXkoa2V5KS5zdGFydHNXaXRoKGJ1aWxkSW5kZXhGb2xkZXIpO1xuXG5leHBvcnQgY29uc3QgSW5kZXhOb2RlS2V5Rm9sZGVyID0gaW5kZXhOb2RlS2V5ID0+IGpvaW5LZXkoXG4gIFRSQU5TQUNUSU9OU19GT0xERVIsXG4gIGJ1aWxkSW5kZXhGb2xkZXIgKyBrZXlUb0ZvbGRlck5hbWUoaW5kZXhOb2RlS2V5KSxcbik7XG5cbmV4cG9ydCBjb25zdCBJbmRleE5vZGVLZXlCYXRjaEZvbGRlciA9IChpbmRleE5vZGVLZXksIGNvdW50KSA9PiBcbiAgam9pbktleShJbmRleE5vZGVLZXlGb2xkZXIoaW5kZXhOb2RlS2V5KSwgTWF0aC5mbG9vcihjb3VudCAvIEJVSUxESU5ERVhfQkFUQ0hfQ09VTlQpLnRvU3RyaW5nKCkpO1xuXG5leHBvcnQgY29uc3QgSW5kZXhTaGFyZEtleUZvbGRlciA9IChpbmRleE5vZGVLZXksIGluZGV4U2hhcmRLZXkpID0+IFxuICBqb2luS2V5KEluZGV4Tm9kZUtleUZvbGRlcihpbmRleE5vZGVLZXkpLCBpbmRleFNoYXJkS2V5KTtcblxuZXhwb3J0IGNvbnN0IEJVSUxESU5ERVhfQkFUQ0hfQ09VTlQgPSAxMDAwO1xuZXhwb3J0IGNvbnN0IHRpbWVvdXRNaWxsaXNlY29uZHMgPSAzMCAqIDEwMDA7IC8vIDMwIHNlY3NcbmV4cG9ydCBjb25zdCBtYXhMb2NrUmV0cmllcyA9IDE7XG4iLCJpbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHsgam9pbktleSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXRMYXN0UGFydEluS2V5IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7XG4gIEluZGV4Tm9kZUtleUZvbGRlciwgQlVJTERJTkRFWF9CQVRDSF9DT1VOVCxcbiAgSW5kZXhOb2RlS2V5QmF0Y2hGb2xkZXIsIFRSQU5TQUNUSU9OU19GT0xERVIsIGdldFRyYW5zYWN0aW9uSWQsIENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04sIFVQREFURV9SRUNPUkRfVFJBTlNBQ1RJT04sXG4gIERFTEVURV9SRUNPUkRfVFJBTlNBQ1RJT04sIEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OLFxufSBmcm9tICcuL3RyYW5zYWN0aW9uc0NvbW1vbic7XG5cblxuZXhwb3J0IGNvbnN0IHRyYW5zYWN0aW9uRm9yQ3JlYXRlUmVjb3JkID0gYXN5bmMgKGFwcCwgcmVjb3JkKSA9PiBhd2FpdCB0cmFuc2FjdGlvbihcbiAgYXBwLmRhdGFzdG9yZSwgQ1JFQVRFX1JFQ09SRF9UUkFOU0FDVElPTixcbiAgcmVjb3JkLmtleSwgeyByZWNvcmQgfSxcbiAgZ2V0VHJhbnNhY3Rpb25LZXlfUmVjb3Jkcyxcbik7XG5cbmV4cG9ydCBjb25zdCB0cmFuc2FjdGlvbkZvclVwZGF0ZVJlY29yZCA9IGFzeW5jIChhcHAsIG9sZFJlY29yZCwgbmV3UmVjb3JkKSA9PiBhd2FpdCB0cmFuc2FjdGlvbihcbiAgYXBwLmRhdGFzdG9yZSwgVVBEQVRFX1JFQ09SRF9UUkFOU0FDVElPTixcbiAgbmV3UmVjb3JkLmtleSwgeyBvbGRSZWNvcmQsIHJlY29yZDogbmV3UmVjb3JkIH0sXG4gIGdldFRyYW5zYWN0aW9uS2V5X1JlY29yZHMsXG4pO1xuXG5leHBvcnQgY29uc3QgdHJhbnNhY3Rpb25Gb3JEZWxldGVSZWNvcmQgPSBhc3luYyAoYXBwLCByZWNvcmQpID0+IGF3YWl0IHRyYW5zYWN0aW9uKFxuICBhcHAuZGF0YXN0b3JlLCBERUxFVEVfUkVDT1JEX1RSQU5TQUNUSU9OLFxuICByZWNvcmQua2V5LCB7IHJlY29yZCB9LFxuICBnZXRUcmFuc2FjdGlvbktleV9SZWNvcmRzLFxuKTtcblxuZXhwb3J0IGNvbnN0IHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleCA9IGFzeW5jIChhcHAsIGluZGV4Tm9kZUtleSwgcmVjb3JkS2V5LCBjb3VudCkgPT4ge1xuICBjb25zdCB0cmFuc2FjdGlvbkZvbGRlciA9IEluZGV4Tm9kZUtleUJhdGNoRm9sZGVyKGluZGV4Tm9kZUtleSwgY291bnQpO1xuICBpZiAoY291bnQgJSBCVUlMRElOREVYX0JBVENIX0NPVU5UID09PSAwKSB7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVGb2xkZXIodHJhbnNhY3Rpb25Gb2xkZXIpO1xuICB9XG5cbiAgcmV0dXJuIGF3YWl0IHRyYW5zYWN0aW9uKFxuICAgIGFwcC5kYXRhc3RvcmUsIEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OLFxuICAgIHJlY29yZEtleSwgeyByZWNvcmRLZXkgfSxcbiAgICBpZCA9PiBqb2luS2V5KHRyYW5zYWN0aW9uRm9sZGVyLCBpZCksXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlQnVpbGRJbmRleEZvbGRlciA9IGFzeW5jIChkYXRhc3RvcmUsIGluZGV4Tm9kZUtleSkgPT4gYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihcbiAgSW5kZXhOb2RlS2V5Rm9sZGVyKGluZGV4Tm9kZUtleSksXG4pO1xuXG5jb25zdCBnZXRUcmFuc2FjdGlvbktleV9SZWNvcmRzID0gaWQgPT4gam9pbktleShUUkFOU0FDVElPTlNfRk9MREVSLCBpZCk7XG5cbmNvbnN0IHRyYW5zYWN0aW9uID0gYXN5bmMgKGRhdGFzdG9yZSwgdHJhbnNhY3Rpb25UeXBlLCByZWNvcmRLZXksIGRhdGEsIGdldFRyYW5zYWN0aW9uS2V5KSA9PiB7XG4gIGNvbnN0IHJlY29yZElkID0gZ2V0TGFzdFBhcnRJbktleShyZWNvcmRLZXkpO1xuICBjb25zdCB1bmlxdWVJZCA9IGdlbmVyYXRlKCk7XG4gIGNvbnN0IGlkID0gZ2V0VHJhbnNhY3Rpb25JZChcbiAgICByZWNvcmRJZCwgdHJhbnNhY3Rpb25UeXBlLCB1bmlxdWVJZCxcbiAgKTtcblxuICBjb25zdCBrZXkgPSBnZXRUcmFuc2FjdGlvbktleShpZCk7XG5cbiAgY29uc3QgdHJhbnMgPSB7XG4gICAgdHJhbnNhY3Rpb25UeXBlLFxuICAgIHJlY29yZEtleSxcbiAgICAuLi5kYXRhLFxuICAgIGlkLFxuICB9O1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKFxuICAgIGtleSwgdHJhbnMsXG4gICk7XG5cbiAgcmV0dXJuIHRyYW5zO1xufTtcbiIsImltcG9ydCB7IGlzU2hhcmRlZEluZGV4IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IGpvaW5LZXkgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0U2hhcmRNYXBLZXksIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSwgY3JlYXRlSW5kZXhGaWxlIH0gZnJvbSAnLi9zaGFyZGluZyc7XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlSW5kZXggPSBhc3luYyAoZGF0YXN0b3JlLCBwYXJlbnRLZXksIGluZGV4KSA9PiB7XG4gIGNvbnN0IGluZGV4S2V5ID0gam9pbktleShwYXJlbnRLZXksIGluZGV4Lm5hbWUpO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoaW5kZXhLZXkpO1xuXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleCkpIHtcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRmlsZShcbiAgICAgIGdldFNoYXJkTWFwS2V5KGluZGV4S2V5KSxcbiAgICAgICdbXScsXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCBjcmVhdGVJbmRleEZpbGUoXG4gICAgICBkYXRhc3RvcmUsXG4gICAgICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXkoaW5kZXhLZXkpLFxuICAgICAgaW5kZXgsXG4gICAgKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIGNsb25lRGVlcCxcbiAgZmxhdHRlbixcbiAgbWFwLFxuICBmaWx0ZXIsXG4gIGlzRXF1YWxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGluaXRpYWxpc2VDaGlsZENvbGxlY3Rpb25zIH0gZnJvbSAnLi4vY29sbGVjdGlvbkFwaS9pbml0aWFsaXNlJztcbmltcG9ydCB7IHZhbGlkYXRlIH0gZnJvbSAnLi92YWxpZGF0ZSc7XG5pbXBvcnQgeyBfbG9hZCwgZ2V0UmVjb3JkRmlsZU5hbWUgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IHtcbiAgYXBpV3JhcHBlciwgZXZlbnRzLCAkLCBqb2luS2V5LFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxuICBpc1JlY29yZCxcbiAgZ2V0Tm9kZSxcbiAgZ2V0TGFzdFBhcnRJbktleSxcbiAgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvTm9kZSxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IG1hcFJlY29yZCB9IGZyb20gJy4uL2luZGV4aW5nL2V2YWx1YXRlJztcbmltcG9ydCB7IGxpc3RJdGVtcyB9IGZyb20gJy4uL2luZGV4QXBpL2xpc3RJdGVtcyc7XG5pbXBvcnQgeyBhZGRUb0FsbElkcyB9IGZyb20gJy4uL2luZGV4aW5nL2FsbElkcyc7XG5pbXBvcnQge1xuICB0cmFuc2FjdGlvbkZvckNyZWF0ZVJlY29yZCxcbiAgdHJhbnNhY3Rpb25Gb3JVcGRhdGVSZWNvcmQsXG59IGZyb20gJy4uL3RyYW5zYWN0aW9ucy9jcmVhdGUnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgaW5pdGlhbGlzZUluZGV4IH0gZnJvbSAnLi4vaW5kZXhpbmcvaW5pdGlhbGlzZUluZGV4JztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3Qgc2F2ZSA9IGFwcCA9PiBhc3luYyAocmVjb3JkLCBjb250ZXh0KSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5yZWNvcmRBcGkuc2F2ZSxcbiAgcmVjb3JkLmlzTmV3XG4gICAgPyBwZXJtaXNzaW9uLmNyZWF0ZVJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkLmtleSlcbiAgICA6IHBlcm1pc3Npb24udXBkYXRlUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmQua2V5KSwgeyByZWNvcmQgfSxcbiAgX3NhdmUsIGFwcCwgcmVjb3JkLCBjb250ZXh0LCBmYWxzZSxcbik7XG5cblxuZXhwb3J0IGNvbnN0IF9zYXZlID0gYXN5bmMgKGFwcCwgcmVjb3JkLCBjb250ZXh0LCBza2lwVmFsaWRhdGlvbiA9IGZhbHNlKSA9PiB7XG4gIGNvbnN0IHJlY29yZENsb25lID0gY2xvbmVEZWVwKHJlY29yZCk7XG4gIGlmICghc2tpcFZhbGlkYXRpb24pIHtcbiAgICBjb25zdCB2YWxpZGF0aW9uUmVzdWx0ID0gYXdhaXQgdmFsaWRhdGUoYXBwKShyZWNvcmRDbG9uZSwgY29udGV4dCk7XG4gICAgaWYgKCF2YWxpZGF0aW9uUmVzdWx0LmlzVmFsaWQpIHtcbiAgICAgIGF3YWl0IGFwcC5wdWJsaXNoKGV2ZW50cy5yZWNvcmRBcGkuc2F2ZS5vbkludmFsaWQsIHsgcmVjb3JkLCB2YWxpZGF0aW9uUmVzdWx0IH0pO1xuICAgICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgU2F2ZSA6IFJlY29yZCBJbnZhbGlkIDogJHtcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkodmFsaWRhdGlvblJlc3VsdC5lcnJvcnMpfWApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChyZWNvcmRDbG9uZS5pc05ldykge1xuICAgIGF3YWl0IGFkZFRvQWxsSWRzKGFwcC5oaWVyYXJjaHksIGFwcC5kYXRhc3RvcmUpKHJlY29yZENsb25lKTtcbiAgICBjb25zdCB0cmFuc2FjdGlvbiA9IGF3YWl0IHRyYW5zYWN0aW9uRm9yQ3JlYXRlUmVjb3JkKFxuICAgICAgYXBwLCByZWNvcmRDbG9uZSxcbiAgICApO1xuICAgIHJlY29yZENsb25lLnRyYW5zYWN0aW9uSWQgPSB0cmFuc2FjdGlvbi5pZDtcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihyZWNvcmRDbG9uZS5rZXkpO1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlRm9sZGVyKFxuICAgICAgam9pbktleShyZWNvcmRDbG9uZS5rZXksICdmaWxlcycpLFxuICAgICk7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVKc29uKFxuICAgICAgZ2V0UmVjb3JkRmlsZU5hbWUocmVjb3JkQ2xvbmUua2V5KSxcbiAgICAgIHJlY29yZENsb25lLFxuICAgICk7XG4gICAgYXdhaXQgaW5pdGlhbGlzZVJldmVyc2VSZWZlcmVuY2VJbmRleGVzKGFwcCwgcmVjb3JkKTtcbiAgICBhd2FpdCBpbml0aWFsaXNlQW5jZXN0b3JJbmRleGVzKGFwcCwgcmVjb3JkKTtcbiAgICBhd2FpdCBpbml0aWFsaXNlQ2hpbGRDb2xsZWN0aW9ucyhhcHAsIHJlY29yZENsb25lLmtleSk7XG4gICAgYXdhaXQgYXBwLnB1Ymxpc2goZXZlbnRzLnJlY29yZEFwaS5zYXZlLm9uUmVjb3JkQ3JlYXRlZCwge1xuICAgICAgcmVjb3JkOiByZWNvcmRDbG9uZSxcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBvbGRSZWNvcmQgPSBhd2FpdCBfbG9hZChhcHAsIHJlY29yZENsb25lLmtleSk7XG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSBhd2FpdCB0cmFuc2FjdGlvbkZvclVwZGF0ZVJlY29yZChcbiAgICAgIGFwcCwgb2xkUmVjb3JkLCByZWNvcmRDbG9uZSxcbiAgICApO1xuICAgIHJlY29yZENsb25lLnRyYW5zYWN0aW9uSWQgPSB0cmFuc2FjdGlvbi5pZDtcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgICBnZXRSZWNvcmRGaWxlTmFtZShyZWNvcmRDbG9uZS5rZXkpLFxuICAgICAgcmVjb3JkQ2xvbmUsXG4gICAgKTtcbiAgICBhd2FpdCBhcHAucHVibGlzaChldmVudHMucmVjb3JkQXBpLnNhdmUub25SZWNvcmRVcGRhdGVkLCB7XG4gICAgICBvbGQ6IG9sZFJlY29yZCxcbiAgICAgIG5ldzogcmVjb3JkQ2xvbmUsXG4gICAgfSk7XG4gIH1cblxuICBhd2FpdCBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucygpO1xuXG4gIGNvbnN0IHJldHVybmVkQ2xvbmUgPSBjbG9uZURlZXAocmVjb3JkQ2xvbmUpO1xuICByZXR1cm5lZENsb25lLmlzTmV3ID0gZmFsc2U7XG4gIHJldHVybiByZXR1cm5lZENsb25lO1xufTtcblxuY29uc3QgaW5pdGlhbGlzZUFuY2VzdG9ySW5kZXhlcyA9IGFzeW5jIChhcHAsIHJlY29yZCkgPT4ge1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShyZWNvcmQua2V5KTtcblxuICBmb3IgKGNvbnN0IGluZGV4IG9mIHJlY29yZE5vZGUuaW5kZXhlcykge1xuICAgIGNvbnN0IGluZGV4S2V5ID0gam9pbktleShyZWNvcmQua2V5LCBpbmRleC5uYW1lKTtcbiAgICBpZiAoIWF3YWl0IGFwcC5kYXRhc3RvcmUuZXhpc3RzKGluZGV4S2V5KSkgeyBhd2FpdCBpbml0aWFsaXNlSW5kZXgoYXBwLmRhdGFzdG9yZSwgcmVjb3JkLmtleSwgaW5kZXgpOyB9XG4gIH1cbn07XG5cbmNvbnN0IGluaXRpYWxpc2VSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyA9IGFzeW5jIChhcHAsIHJlY29yZCkgPT4ge1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShyZWNvcmQua2V5KTtcblxuICBjb25zdCBpbmRleE5vZGVzID0gJChmaWVsZHNUaGF0UmVmZXJlbmNlVGhpc1JlY29yZChhcHAsIHJlY29yZE5vZGUpLCBbXG4gICAgbWFwKGYgPT4gJChmLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzLCBbXG4gICAgICBtYXAobiA9PiBnZXROb2RlKFxuICAgICAgICBhcHAuaGllcmFyY2h5LFxuICAgICAgICBuLFxuICAgICAgKSksXG4gICAgXSkpLFxuICAgIGZsYXR0ZW4sXG4gIF0pO1xuXG4gIGZvciAoY29uc3QgaW5kZXhOb2RlIG9mIGluZGV4Tm9kZXMpIHtcbiAgICBhd2FpdCBpbml0aWFsaXNlSW5kZXgoXG4gICAgICBhcHAuZGF0YXN0b3JlLCByZWNvcmQua2V5LCBpbmRleE5vZGUsXG4gICAgKTtcbiAgfVxufTtcblxuY29uc3QgZmllbGRzVGhhdFJlZmVyZW5jZVRoaXNSZWNvcmQgPSAoYXBwLCByZWNvcmROb2RlKSA9PiAkKGFwcC5oaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaWx0ZXIoaXNSZWNvcmQpLFxuICBtYXAobiA9PiBuLmZpZWxkcyksXG4gIGZsYXR0ZW4sXG4gIGZpbHRlcihmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlKHJlY29yZE5vZGUpKSxcbl0pO1xuIiwiaW1wb3J0IHsgaW5jbHVkZXMgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7XG4gIHNhZmVLZXksIGFwaVdyYXBwZXIsXG4gIGV2ZW50cywgam9pbktleSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IF9kZWxldGVSZWNvcmQgfSBmcm9tICcuLi9yZWNvcmRBcGkvZGVsZXRlJztcbmltcG9ydCB7IGdldEFsbElkc0l0ZXJhdG9yLCBnZXRBbGxJZHNTaGFyZEtleSB9IGZyb20gJy4uL2luZGV4aW5nL2FsbElkcyc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBkZWxldGVDb2xsZWN0aW9uID0gKGFwcCwgZGlzYWJsZUNsZWFudXAgPSBmYWxzZSkgPT4gYXN5bmMga2V5ID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmNvbGxlY3Rpb25BcGkuZGVsZXRlLFxuICBwZXJtaXNzaW9uLm1hbmFnZUNvbGxlY3Rpb24uaXNBdXRob3JpemVkLFxuICB7IGtleSB9LFxuICBfZGVsZXRlQ29sbGVjdGlvbiwgYXBwLCBrZXksIGRpc2FibGVDbGVhbnVwLFxuKTtcblxuXG5leHBvcnQgY29uc3QgX2RlbGV0ZUNvbGxlY3Rpb24gPSBhc3luYyAoYXBwLCBrZXksIGRpc2FibGVDbGVhbnVwKSA9PiB7XG4gIGtleSA9IHNhZmVLZXkoa2V5KTtcbiAgY29uc3Qgbm9kZSA9IGdldE5vZGVGb3JDb2xsZWN0aW9uUGF0aChhcHAuaGllcmFyY2h5KShrZXkpO1xuXG4gIGF3YWl0IGRlbGV0ZVJlY29yZHMoYXBwLCBrZXkpO1xuICBhd2FpdCBkZWxldGVBbGxJZHNGb2xkZXJzKGFwcCwgbm9kZSwga2V5KTtcbiAgYXdhaXQgZGVsZXRlQ29sbGVjdGlvbkZvbGRlcihhcHAsIGtleSk7XG4gIGlmICghZGlzYWJsZUNsZWFudXApIHsgYXdhaXQgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMoKTsgfVxufTtcblxuY29uc3QgZGVsZXRlQ29sbGVjdGlvbkZvbGRlciA9IGFzeW5jIChhcHAsIGtleSkgPT4gYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoa2V5KTtcblxuXG5jb25zdCBkZWxldGVBbGxJZHNGb2xkZXJzID0gYXN5bmMgKGFwcCwgbm9kZSwga2V5KSA9PiB7XG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKFxuICAgIGpvaW5LZXkoXG4gICAgICBrZXksICdhbGxpZHMnLFxuICAgICAgbm9kZS5ub2RlSWQsXG4gICAgKSxcbiAgKTtcblxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihcbiAgICBqb2luS2V5KGtleSwgJ2FsbGlkcycpLFxuICApO1xufTtcblxuY29uc3QgZGVsZXRlUmVjb3JkcyA9IGFzeW5jIChhcHAsIGtleSkgPT4ge1xuICBjb25zdCBkZWxldGVkQWxsSWRzU2hhcmRzID0gW107XG4gIGNvbnN0IGRlbGV0ZUFsbElkc1NoYXJkID0gYXN5bmMgKHJlY29yZElkKSA9PiB7XG4gICAgY29uc3Qgc2hhcmRLZXkgPSBnZXRBbGxJZHNTaGFyZEtleShcbiAgICAgIGFwcC5oaWVyYXJjaHksIGtleSwgcmVjb3JkSWQsXG4gICAgKTtcblxuICAgIGlmIChpbmNsdWRlcyhzaGFyZEtleSkoZGVsZXRlZEFsbElkc1NoYXJkcykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkZWxldGVkQWxsSWRzU2hhcmRzLnB1c2goc2hhcmRLZXkpO1xuXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKHNoYXJkS2V5KTtcbiAgfTtcblxuICBjb25zdCBpdGVyYXRlID0gYXdhaXQgZ2V0QWxsSWRzSXRlcmF0b3IoYXBwKShrZXkpO1xuXG4gIGxldCBpZHMgPSBhd2FpdCBpdGVyYXRlKCk7XG4gIHdoaWxlICghaWRzLmRvbmUpIHtcbiAgICBpZiAoaWRzLnJlc3VsdC5jb2xsZWN0aW9uS2V5ID09PSBrZXkpIHtcbiAgICAgIGZvciAoY29uc3QgaWQgb2YgaWRzLnJlc3VsdC5pZHMpIHtcbiAgICAgICAgYXdhaXQgX2RlbGV0ZVJlY29yZChcbiAgICAgICAgICBhcHAsXG4gICAgICAgICAgam9pbktleShrZXksIGlkKSxcbiAgICAgICAgICB0cnVlLFxuICAgICAgICApO1xuICAgICAgICBhd2FpdCBkZWxldGVBbGxJZHNTaGFyZChpZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWRzID0gYXdhaXQgaXRlcmF0ZSgpO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgdHJ5QXdhaXRPcklnbm9yZSxcbiAgc2FmZUtleVxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgaXNJbmRleCwgaXNTaGFyZGVkSW5kZXgsXG4gIGdldEV4YWN0Tm9kZUZvclBhdGgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xuICBnZXRBbGxTaGFyZEtleXMsIGdldFNoYXJkTWFwS2V5LFxuICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXksXG59IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcblxuZXhwb3J0IGNvbnN0IF9kZWxldGVJbmRleCA9IGFzeW5jIChhcHAsIGluZGV4S2V5LCBpbmNsdWRlRm9sZGVyKSA9PiB7XG4gIGluZGV4S2V5ID0gc2FmZUtleShpbmRleEtleSk7XG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkoaW5kZXhLZXkpO1xuXG4gIGlmICghaXNJbmRleChpbmRleE5vZGUpKSB7IHRocm93IG5ldyBFcnJvcignU3VwcGxpZWQga2V5IGlzIG5vdCBhbiBpbmRleCcpOyB9XG5cbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICBjb25zdCBzaGFyZEtleXMgPSBhd2FpdCBnZXRBbGxTaGFyZEtleXMoYXBwLCBpbmRleEtleSk7XG4gICAgZm9yIChjb25zdCBrIG9mIHNoYXJkS2V5cykge1xuICAgICAgYXdhaXQgdHJ5QXdhaXRPcklnbm9yZShcbiAgICAgICAgYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKGspLFxuICAgICAgKTtcbiAgICB9XG4gICAgdHJ5QXdhaXRPcklnbm9yZShcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShcbiAgICAgICAgZ2V0U2hhcmRNYXBLZXkoaW5kZXhLZXkpLFxuICAgICAgKSxcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGF3YWl0IHRyeUF3YWl0T3JJZ25vcmUoXG4gICAgICBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoXG4gICAgICAgIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleShpbmRleEtleSksXG4gICAgICApLFxuICAgICk7XG4gIH1cblxuICBpZiAoaW5jbHVkZUZvbGRlcikge1xuICAgIHRyeUF3YWl0T3JJZ25vcmUoXG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihpbmRleEtleSksXG4gICAgKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIHNhZmVLZXksIGFwaVdyYXBwZXIsXG4gIGV2ZW50cywgam9pbktleSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IF9sb2FkLCBnZXRSZWNvcmRGaWxlTmFtZSB9IGZyb20gJy4vbG9hZCc7XG5pbXBvcnQgeyBfZGVsZXRlQ29sbGVjdGlvbiB9IGZyb20gJy4uL2NvbGxlY3Rpb25BcGkvZGVsZXRlJztcbmltcG9ydCB7XG4gIGdldEV4YWN0Tm9kZUZvclBhdGhcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IF9kZWxldGVJbmRleCB9IGZyb20gJy4uL2luZGV4QXBpL2RlbGV0ZSc7XG5pbXBvcnQgeyB0cmFuc2FjdGlvbkZvckRlbGV0ZVJlY29yZCB9IGZyb20gJy4uL3RyYW5zYWN0aW9ucy9jcmVhdGUnO1xuaW1wb3J0IHsgcmVtb3ZlRnJvbUFsbElkcyB9IGZyb20gJy4uL2luZGV4aW5nL2FsbElkcyc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBkZWxldGVSZWNvcmQgPSAoYXBwLCBkaXNhYmxlQ2xlYW51cCA9IGZhbHNlKSA9PiBhc3luYyBrZXkgPT4ge1xuICBrZXkgPSBzYWZlS2V5KGtleSk7XG4gIHJldHVybiBhcGlXcmFwcGVyKFxuICAgIGFwcCxcbiAgICBldmVudHMucmVjb3JkQXBpLmRlbGV0ZSxcbiAgICBwZXJtaXNzaW9uLmRlbGV0ZVJlY29yZC5pc0F1dGhvcml6ZWQoa2V5KSxcbiAgICB7IGtleSB9LFxuICAgIF9kZWxldGVSZWNvcmQsIGFwcCwga2V5LCBkaXNhYmxlQ2xlYW51cCxcbiAgKTtcbn1cblxuLy8gY2FsbGVkIGRlbGV0ZVJlY29yZCBiZWNhdXNlIGRlbGV0ZSBpcyBhIGtleXdvcmRcbmV4cG9ydCBjb25zdCBfZGVsZXRlUmVjb3JkID0gYXN5bmMgKGFwcCwga2V5LCBkaXNhYmxlQ2xlYW51cCkgPT4ge1xuICBrZXkgPSBzYWZlS2V5KGtleSk7XG4gIGNvbnN0IG5vZGUgPSBnZXRFeGFjdE5vZGVGb3JQYXRoKGFwcC5oaWVyYXJjaHkpKGtleSk7XG5cbiAgY29uc3QgcmVjb3JkID0gYXdhaXQgX2xvYWQoYXBwLCBrZXkpO1xuICBhd2FpdCB0cmFuc2FjdGlvbkZvckRlbGV0ZVJlY29yZChhcHAsIHJlY29yZCk7XG5cbiAgZm9yIChjb25zdCBjb2xsZWN0aW9uUmVjb3JkIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICBjb25zdCBjb2xsZWN0aW9uS2V5ID0gam9pbktleShcbiAgICAgIGtleSwgY29sbGVjdGlvblJlY29yZC5jb2xsZWN0aW9uTmFtZSxcbiAgICApO1xuICAgIGF3YWl0IF9kZWxldGVDb2xsZWN0aW9uKGFwcCwgY29sbGVjdGlvbktleSwgdHJ1ZSk7XG4gIH1cblxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoXG4gICAgZ2V0UmVjb3JkRmlsZU5hbWUoa2V5KSxcbiAgKTtcblxuICBhd2FpdCBkZWxldGVGaWxlcyhhcHAsIGtleSk7XG5cbiAgYXdhaXQgcmVtb3ZlRnJvbUFsbElkcyhhcHAuaGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlKShyZWNvcmQpO1xuXG4gIGlmICghZGlzYWJsZUNsZWFudXApIHsgYXdhaXQgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMoKTsgfVxuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKGtleSk7XG4gIGF3YWl0IGRlbGV0ZUluZGV4ZXMoYXBwLCBrZXkpO1xufTtcblxuY29uc3QgZGVsZXRlSW5kZXhlcyA9IGFzeW5jIChhcHAsIGtleSkgPT4ge1xuICBjb25zdCBub2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShrZXkpO1xuICAvKiBjb25zdCByZXZlcnNlSW5kZXhLZXlzID0gJChhcHAuaGllcmFyY2h5LCBbXG4gICAgICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgICAgICAgbWFwKG4gPT4gbi5maWVsZHMpLFxuICAgICAgICBmbGF0dGVuLFxuICAgICAgICBmaWx0ZXIoaXNTb21ldGhpbmcpLFxuICAgICAgICBmaWx0ZXIoZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvTm9kZShub2RlKSksXG4gICAgICAgIG1hcChmID0+ICQoZi50eXBlT3B0aW9ucy5yZXZlcnNlSW5kZXhOb2RlS2V5cywgW1xuICAgICAgICAgICAgICAgICAgICBtYXAobiA9PiBnZXROb2RlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAuaGllcmFyY2h5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuKSlcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICApLFxuICAgICAgICBmbGF0dGVuLFxuICAgICAgICBtYXAobiA9PiBqb2luS2V5KGtleSwgbi5uYW1lKSlcbiAgICBdKTtcblxuICAgIGZvcihsZXQgaSBvZiByZXZlcnNlSW5kZXhLZXlzKSB7XG4gICAgICAgIGF3YWl0IF9kZWxldGVJbmRleChhcHAsIGksIHRydWUpO1xuICAgIH0gKi9cblxuXG4gIGZvciAoY29uc3QgaW5kZXggb2Ygbm9kZS5pbmRleGVzKSB7XG4gICAgY29uc3QgaW5kZXhLZXkgPSBqb2luS2V5KGtleSwgaW5kZXgubmFtZSk7XG4gICAgYXdhaXQgX2RlbGV0ZUluZGV4KGFwcCwgaW5kZXhLZXksIHRydWUpO1xuICB9XG59O1xuXG5jb25zdCBkZWxldGVGaWxlcyA9IGFzeW5jIChhcHAsIGtleSkgPT4ge1xuICBjb25zdCBmaWxlc0ZvbGRlciA9IGpvaW5LZXkoa2V5LCAnZmlsZXMnKTtcbiAgY29uc3QgYWxsRmlsZXMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZvbGRlckNvbnRlbnRzKFxuICAgIGZpbGVzRm9sZGVyLFxuICApO1xuXG4gIGZvciAoY29uc3QgZmlsZSBvZiBhbGxGaWxlcykge1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShmaWxlKTtcbiAgfVxuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKFxuICAgIGpvaW5LZXkoa2V5LCAnZmlsZXMnKSxcbiAgKTtcbn07XG4iLCJpbXBvcnQge1xuICBpbmNsdWRlcywgZmlsdGVyLFxuICBtYXAsIHNvbWUsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHsgX2xvYWQgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IHtcbiAgYXBpV3JhcHBlciwgZXZlbnRzLCBzcGxpdEtleSxcbiAgJCwgam9pbktleSwgaXNOb3RoaW5nLCB0cnlBd2FpdE9ySWdub3JlLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0RXhhY3ROb2RlRm9yUGF0aCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBpc0xlZ2FsRmlsZW5hbWUgfSBmcm9tICcuLi90eXBlcy9maWxlJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciwgRm9yYmlkZGVuRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IHVwbG9hZEZpbGUgPSBhcHAgPT4gYXN5bmMgKHJlY29yZEtleSwgcmVhZGFibGVTdHJlYW0sIHJlbGF0aXZlRmlsZVBhdGgpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLnJlY29yZEFwaS51cGxvYWRGaWxlLFxuICBwZXJtaXNzaW9uLnVwZGF0ZVJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkS2V5KSxcbiAgeyByZWNvcmRLZXksIHJlYWRhYmxlU3RyZWFtLCByZWxhdGl2ZUZpbGVQYXRoIH0sXG4gIF91cGxvYWRGaWxlLCBhcHAsIHJlY29yZEtleSwgcmVhZGFibGVTdHJlYW0sIHJlbGF0aXZlRmlsZVBhdGgsXG4pO1xuXG5jb25zdCBfdXBsb2FkRmlsZSA9IGFzeW5jIChhcHAsIHJlY29yZEtleSwgcmVhZGFibGVTdHJlYW0sIHJlbGF0aXZlRmlsZVBhdGgpID0+IHtcbiAgaWYgKGlzTm90aGluZyhyZWNvcmRLZXkpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ1JlY29yZCBLZXkgbm90IHN1cHBsaWVkJyk7IH1cbiAgaWYgKGlzTm90aGluZyhyZWxhdGl2ZUZpbGVQYXRoKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdmaWxlIHBhdGggbm90IHN1cHBsaWVkJyk7IH1cbiAgaWYgKCFpc0xlZ2FsRmlsZW5hbWUocmVsYXRpdmVGaWxlUGF0aCkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignSWxsZWdhbCBmaWxlbmFtZScpOyB9XG5cbiAgY29uc3QgcmVjb3JkID0gYXdhaXQgX2xvYWQoYXBwLCByZWNvcmRLZXkpO1xuXG4gIGNvbnN0IGZ1bGxGaWxlUGF0aCA9IHNhZmVHZXRGdWxsRmlsZVBhdGgoXG4gICAgcmVjb3JkS2V5LCByZWxhdGl2ZUZpbGVQYXRoLFxuICApO1xuXG4gIGNvbnN0IHRlbXBGaWxlUGF0aCA9IGAke2Z1bGxGaWxlUGF0aH1fJHtnZW5lcmF0ZSgpfS50ZW1wYDtcblxuICBjb25zdCBvdXRwdXRTdHJlYW0gPSBhd2FpdCBhcHAuZGF0YXN0b3JlLndyaXRhYmxlRmlsZVN0cmVhbShcbiAgICB0ZW1wRmlsZVBhdGgsXG4gICk7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCkgPT4ge1xuICAgIHJlYWRhYmxlU3RyZWFtLnBpcGUob3V0cHV0U3RyZWFtKTtcbiAgICBvdXRwdXRTdHJlYW0ub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICBvdXRwdXRTdHJlYW0ub24oJ2ZpbmlzaCcsIHJlc29sdmUpO1xuICB9KVxuICAudGhlbigoKSA9PiBhcHAuZGF0YXN0b3JlLmdldEZpbGVTaXplKHRlbXBGaWxlUGF0aCkpXG4gIC50aGVuKHNpemUgPT4ge1xuICAgIGNvbnN0IGlzRXhwZWN0ZWRGaWxlU2l6ZSA9IGNoZWNrRmlsZVNpemVBZ2FpbnN0RmllbGRzKFxuICAgICAgYXBwLCByZWNvcmQsIHJlbGF0aXZlRmlsZVBhdGgsIHNpemVcbiAgICApOyAgXG4gICAgaWYgKCFpc0V4cGVjdGVkRmlsZVNpemUpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgRmllbGRzIGZvciAke3JlbGF0aXZlRmlsZVBhdGh9IGRvIG5vdCBoYXZlIGV4cGVjdGVkIHNpemU6ICR7am9pbignLCcpKGluY29ycmVjdEZpZWxkcyl9YCk7IH0gIFxuXG4gIH0pXG4gIC50aGVuKCgpID0+IHRyeUF3YWl0T3JJZ25vcmUoYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlLCBmdWxsRmlsZVBhdGgpKVxuICAudGhlbigoKSA9PiBhcHAuZGF0YXN0b3JlLnJlbmFtZUZpbGUodGVtcEZpbGVQYXRoLCBmdWxsRmlsZVBhdGgpKTtcblxuICAvKlxuICByZWFkYWJsZVN0cmVhbS5waXBlKG91dHB1dFN0cmVhbSk7XG5cbiAgYXdhaXQgbmV3IFByb21pc2UoZnVsZmlsbCA9PiBvdXRwdXRTdHJlYW0ub24oJ2ZpbmlzaCcsIGZ1bGZpbGwpKTtcblxuICBjb25zdCBpc0V4cGVjdGVkRmlsZVNpemUgPSBjaGVja0ZpbGVTaXplQWdhaW5zdEZpZWxkcyhcbiAgICBhcHAsXG4gICAgcmVjb3JkLCByZWxhdGl2ZUZpbGVQYXRoLFxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0RmlsZVNpemUodGVtcEZpbGVQYXRoKSxcbiAgKTtcblxuICBpZiAoIWlzRXhwZWN0ZWRGaWxlU2l6ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBGaWVsZHMgZm9yICR7cmVsYXRpdmVGaWxlUGF0aH0gZG8gbm90IGhhdmUgZXhwZWN0ZWQgc2l6ZWApO1xuICB9XG5cbiAgYXdhaXQgdHJ5QXdhaXRPcklnbm9yZShhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUsIGZ1bGxGaWxlUGF0aCk7XG5cbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS5yZW5hbWVGaWxlKHRlbXBGaWxlUGF0aCwgZnVsbEZpbGVQYXRoKTtcbiAgKi9cbn07XG5cbmNvbnN0IGNoZWNrRmlsZVNpemVBZ2FpbnN0RmllbGRzID0gKGFwcCwgcmVjb3JkLCByZWxhdGl2ZUZpbGVQYXRoLCBleHBlY3RlZFNpemUpID0+IHtcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoYXBwLmhpZXJhcmNoeSkocmVjb3JkLmtleSk7XG5cbiAgY29uc3QgaW5jb3JyZWN0RmlsZUZpZWxkcyA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBmaWx0ZXIoZiA9PiBmLnR5cGUgPT09ICdmaWxlJ1xuICAgICAgJiYgcmVjb3JkW2YubmFtZV0ucmVsYXRpdmVQYXRoID09PSByZWxhdGl2ZUZpbGVQYXRoXG4gICAgICAmJiByZWNvcmRbZi5uYW1lXS5zaXplICE9PSBleHBlY3RlZFNpemUpLFxuICAgIG1hcChmID0+IGYubmFtZSksXG4gIF0pO1xuXG4gIGNvbnN0IGluY29ycmVjdEZpbGVBcnJheUZpZWxkcyA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBmaWx0ZXIoYSA9PiBhLnR5cGUgPT09ICdhcnJheTxmaWxlPidcbiAgICAgICYmICQocmVjb3JkW2EubmFtZV0sIFtcbiAgICAgICAgc29tZShmID0+IHJlY29yZFtmLm5hbWVdLnJlbGF0aXZlUGF0aCA9PT0gcmVsYXRpdmVGaWxlUGF0aFxuICAgICAgICAgICYmIHJlY29yZFtmLm5hbWVdLnNpemUgIT09IGV4cGVjdGVkU2l6ZSksXG4gICAgICBdKSksXG4gICAgbWFwKGYgPT4gZi5uYW1lKSxcbiAgXSk7XG5cbiAgY29uc3QgaW5jb3JyZWN0RmllbGRzID0gW1xuICAgIC4uLmluY29ycmVjdEZpbGVGaWVsZHMsXG4gICAgLi4uaW5jb3JyZWN0RmlsZUFycmF5RmllbGRzLFxuICBdO1xuXG4gIGlmIChpbmNvcnJlY3RGaWVsZHMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuZXhwb3J0IGNvbnN0IHNhZmVHZXRGdWxsRmlsZVBhdGggPSAocmVjb3JkS2V5LCByZWxhdGl2ZUZpbGVQYXRoKSA9PiB7XG4gIGNvbnN0IG5hdWdodHlVc2VyID0gKCkgPT4geyB0aHJvdyBuZXcgRm9yYmlkZGVuRXJyb3IoJ25hdWdodHkgbmF1Z2h0eScpOyB9O1xuXG4gIGlmIChyZWxhdGl2ZUZpbGVQYXRoLnN0YXJ0c1dpdGgoJy4uJykpIG5hdWdodHlVc2VyKCk7XG5cbiAgY29uc3QgcGF0aFBhcnRzID0gc3BsaXRLZXkocmVsYXRpdmVGaWxlUGF0aCk7XG5cbiAgaWYgKGluY2x1ZGVzKCcuLicpKHBhdGhQYXJ0cykpIG5hdWdodHlVc2VyKCk7XG5cbiAgY29uc3QgcmVjb3JkS2V5UGFydHMgPSBzcGxpdEtleShyZWNvcmRLZXkpO1xuXG4gIGNvbnN0IGZ1bGxQYXRoUGFydHMgPSBbXG4gICAgLi4ucmVjb3JkS2V5UGFydHMsXG4gICAgJ2ZpbGVzJyxcbiAgICAuLi5maWx0ZXIocCA9PiBwICE9PSAnLicpKHBhdGhQYXJ0cyksXG4gIF07XG5cbiAgcmV0dXJuIGpvaW5LZXkoZnVsbFBhdGhQYXJ0cyk7XG59O1xuIiwiaW1wb3J0IHsgYXBpV3JhcHBlciwgZXZlbnRzLCBpc05vdGhpbmcgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgc2FmZUdldEZ1bGxGaWxlUGF0aCB9IGZyb20gJy4vdXBsb2FkRmlsZSc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGRvd25sb2FkRmlsZSA9IGFwcCA9PiBhc3luYyAocmVjb3JkS2V5LCByZWxhdGl2ZVBhdGgpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLnJlY29yZEFwaS51cGxvYWRGaWxlLFxuICBwZXJtaXNzaW9uLnJlYWRSZWNvcmQuaXNBdXRob3JpemVkKHJlY29yZEtleSksXG4gIHsgcmVjb3JkS2V5LCByZWxhdGl2ZVBhdGggfSwvL3JlbW92ZSBkdXBlIGtleSAncmVjb3JkS2V5JyBmcm9tIG9iamVjdFxuICBfZG93bmxvYWRGaWxlLCBhcHAsIHJlY29yZEtleSwgcmVsYXRpdmVQYXRoLFxuKTsgXG5cblxuY29uc3QgX2Rvd25sb2FkRmlsZSA9IGFzeW5jIChhcHAsIHJlY29yZEtleSwgcmVsYXRpdmVQYXRoKSA9PiB7XG4gIGlmIChpc05vdGhpbmcocmVjb3JkS2V5KSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdSZWNvcmQgS2V5IG5vdCBzdXBwbGllZCcpOyB9XG4gIGlmIChpc05vdGhpbmcocmVsYXRpdmVQYXRoKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdmaWxlIHBhdGggbm90IHN1cHBsaWVkJyk7IH1cblxuICByZXR1cm4gYXdhaXQgYXBwLmRhdGFzdG9yZS5yZWFkYWJsZUZpbGVTdHJlYW0oXG4gICAgc2FmZUdldEZ1bGxGaWxlUGF0aChcbiAgICAgIHJlY29yZEtleSwgcmVsYXRpdmVQYXRoLFxuICAgICksXG4gICk7XG59O1xuIiwiaW1wb3J0IHsgZmluZCwgdGFrZSwgdW5pb24gfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2V0RmxhdHRlbmVkSGllcmFyY2h5IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7ICQsIHNwbGl0S2V5LCBqb2luS2V5IH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGN1c3RvbUlkID0gYXBwID0+IChub2RlTmFtZSwgaWQpID0+IHtcbiAgY29uc3Qgbm9kZSA9ICQoYXBwLmhpZXJhcmNoeSwgW1xuICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgICBmaW5kKG4gPT4gbi5uYW1lID09PSBub2RlTmFtZSksXG4gIF0pO1xuXG4gIGlmICghbm9kZSkgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoYENhbm5vdCBmaW5kIG5vZGUgJHtub2RlTmFtZX1gKTtcblxuICByZXR1cm4gYCR7bm9kZS5ub2RlSWR9LSR7aWR9YDtcbn07XG5cbmV4cG9ydCBjb25zdCBzZXRDdXN0b21JZCA9IGFwcCA9PiAocmVjb3JkLCBpZCkgPT4ge1xuICByZWNvcmQuaWQgPSBjdXN0b21JZChhcHApKHJlY29yZC50eXBlLCBpZCk7XG5cbiAgY29uc3Qga2V5UGFydHMgPSBzcGxpdEtleShyZWNvcmQua2V5KTtcblxuICByZWNvcmQua2V5ID0gJChrZXlQYXJ0cywgW1xuICAgIHRha2Uoa2V5UGFydHMubGVuZ3RoIC0gMSksXG4gICAgdW5pb24oW3JlY29yZC5pZF0pLFxuICAgIGpvaW5LZXksXG4gIF0pO1xuXG4gIHJldHVybiByZWNvcmQ7XG59O1xuIiwiaW1wb3J0IHsgZ2V0TmV3LCBnZXROZXdDaGlsZCB9IGZyb20gJy4vZ2V0TmV3JztcbmltcG9ydCB7IGxvYWQgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IHsgdmFsaWRhdGUgfSBmcm9tICcuL3ZhbGlkYXRlJztcbmltcG9ydCB7IGdldENvbnRleHQgfSBmcm9tICcuL2dldENvbnRleHQnO1xuaW1wb3J0IHsgc2F2ZSB9IGZyb20gJy4vc2F2ZSc7XG5pbXBvcnQgeyBkZWxldGVSZWNvcmQgfSBmcm9tICcuL2RlbGV0ZSc7XG5pbXBvcnQgeyB1cGxvYWRGaWxlIH0gZnJvbSAnLi91cGxvYWRGaWxlJztcbmltcG9ydCB7IGRvd25sb2FkRmlsZSB9IGZyb20gJy4vZG93bmxvYWRGaWxlJztcbmltcG9ydCB7IGN1c3RvbUlkLCBzZXRDdXN0b21JZCB9IGZyb20gJy4vY3VzdG9tSWQnO1xuXG5jb25zdCBhcGkgPSBhcHAgPT4gKHtcbiAgZ2V0TmV3OiBnZXROZXcoYXBwKSxcbiAgZ2V0TmV3Q2hpbGQ6IGdldE5ld0NoaWxkKGFwcCksXG4gIHNhdmU6IHNhdmUoYXBwKSxcbiAgbG9hZDogbG9hZChhcHApLFxuICBkZWxldGU6IGRlbGV0ZVJlY29yZChhcHAsIGZhbHNlKSxcbiAgdmFsaWRhdGU6IHZhbGlkYXRlKGFwcCksXG4gIGdldENvbnRleHQ6IGdldENvbnRleHQoYXBwKSxcbiAgdXBsb2FkRmlsZTogdXBsb2FkRmlsZShhcHApLFxuICBkb3dubG9hZEZpbGU6IGRvd25sb2FkRmlsZShhcHApLFxuICBjdXN0b21JZDogY3VzdG9tSWQoYXBwKSxcbiAgc2V0Q3VzdG9tSWQ6IHNldEN1c3RvbUlkKGFwcCksXG59KTtcblxuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkQXBpID0gYXBwID0+IGFwaShhcHApO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRSZWNvcmRBcGk7XG4iLCJpbXBvcnQgeyBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHtcbiAgaXNOb3RoaW5nLCBzYWZlS2V5LCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsb3dlZFJlY29yZFR5cGVzID0gYXBwID0+IGtleSA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuY29sbGVjdGlvbkFwaS5nZXRBbGxvd2VkUmVjb3JkVHlwZXMsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsga2V5IH0sXG4gIF9nZXRBbGxvd2VkUmVjb3JkVHlwZXMsIGFwcCwga2V5LFxuKTtcblxuY29uc3QgX2dldEFsbG93ZWRSZWNvcmRUeXBlcyA9IChhcHAsIGtleSkgPT4ge1xuICBrZXkgPSBzYWZlS2V5KGtleSk7XG4gIGNvbnN0IG5vZGUgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwLmhpZXJhcmNoeSkoa2V5KTtcbiAgcmV0dXJuIGlzTm90aGluZyhub2RlKSA/IFtdIDogW25vZGUubmFtZV07XG59O1xuIiwiaW1wb3J0IHsgZ2V0QWxsSWRzSXRlcmF0b3IgfSBmcm9tICcuLi9pbmRleGluZy9hbGxJZHMnO1xuaW1wb3J0IHsgZ2V0QWxsb3dlZFJlY29yZFR5cGVzIH0gZnJvbSAnLi9nZXRBbGxvd2VkUmVjb3JkVHlwZXMnO1xuaW1wb3J0IHsgZGVsZXRlQ29sbGVjdGlvbiB9IGZyb20gJy4vZGVsZXRlJztcblxuZXhwb3J0IGNvbnN0IGdldENvbGxlY3Rpb25BcGkgPSBhcHAgPT4gKHtcbiAgZ2V0QWxsb3dlZFJlY29yZFR5cGVzOiBnZXRBbGxvd2VkUmVjb3JkVHlwZXMoYXBwKSxcbiAgZ2V0QWxsSWRzSXRlcmF0b3I6IGdldEFsbElkc0l0ZXJhdG9yKGFwcCksXG4gIGRlbGV0ZTogZGVsZXRlQ29sbGVjdGlvbihhcHApLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGdldENvbGxlY3Rpb25BcGk7XG4iLCJpbXBvcnQge1xuICBmaW5kLCBmaWx0ZXIsIFxuICBpbmNsdWRlcywgc29tZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdldEFsbElkc0l0ZXJhdG9yIH0gZnJvbSAnLi4vaW5kZXhpbmcvYWxsSWRzJztcbmltcG9ydCB7XG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSwgZ2V0UmVjb3JkTm9kZUJ5SWQsXG4gIGdldENvbGxlY3Rpb25Ob2RlQnlLZXlPck5vZGVLZXksIGdldE5vZGUsIGlzSW5kZXgsXG4gIGlzUmVjb3JkLCBpc0RlY2VuZGFudCwgZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgsXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4LFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHtcbiAgam9pbktleSwgYXBpV3JhcHBlciwgZXZlbnRzLCAkLCBhbGxUcnVlLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgY3JlYXRlQnVpbGRJbmRleEZvbGRlcixcbiAgdHJhbnNhY3Rpb25Gb3JCdWlsZEluZGV4LFxufSBmcm9tICcuLi90cmFuc2FjdGlvbnMvY3JlYXRlJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5cbi8qKiByZWJ1aWxkcyBhbiBpbmRleFxuICogQHBhcmFtIHtvYmplY3R9IGFwcCAtIHRoZSBhcHBsaWNhdGlvbiBjb250YWluZXJcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbmRleE5vZGVLZXkgLSBub2RlIGtleSBvZiB0aGUgaW5kZXgsIHdoaWNoIHRoZSBpbmRleCBiZWxvbmdzIHRvXG4gKi9cbmV4cG9ydCBjb25zdCBidWlsZEluZGV4ID0gYXBwID0+IGFzeW5jIGluZGV4Tm9kZUtleSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5pbmRleEFwaS5idWlsZEluZGV4LFxuICBwZXJtaXNzaW9uLm1hbmFnZUluZGV4LmlzQXV0aG9yaXplZCxcbiAgeyBpbmRleE5vZGVLZXkgfSxcbiAgX2J1aWxkSW5kZXgsIGFwcCwgaW5kZXhOb2RlS2V5LFxuKTtcblxuY29uc3QgX2J1aWxkSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleE5vZGVLZXkpID0+IHtcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0Tm9kZShhcHAuaGllcmFyY2h5LCBpbmRleE5vZGVLZXkpO1xuXG4gIGF3YWl0IGNyZWF0ZUJ1aWxkSW5kZXhGb2xkZXIoYXBwLmRhdGFzdG9yZSwgaW5kZXhOb2RlS2V5KTtcblxuICBpZiAoIWlzSW5kZXgoaW5kZXhOb2RlKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdCdWlsZEluZGV4OiBtdXN0IHN1cHBseSBhbiBpbmRleG5vZGUnKTsgfVxuXG4gIGlmIChpbmRleE5vZGUuaW5kZXhUeXBlID09PSAncmVmZXJlbmNlJykge1xuICAgIGF3YWl0IGJ1aWxkUmV2ZXJzZVJlZmVyZW5jZUluZGV4KFxuICAgICAgYXBwLCBpbmRleE5vZGUsXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCBidWlsZEhlaXJhcmNoYWxJbmRleChcbiAgICAgIGFwcCwgaW5kZXhOb2RlLFxuICAgICk7XG4gIH1cblxuICBhd2FpdCBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucygpO1xufTtcblxuY29uc3QgYnVpbGRSZXZlcnNlUmVmZXJlbmNlSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleE5vZGUpID0+IHtcbiAgLy8gSXRlcmF0ZSB0aHJvdWdoIGFsbCByZWZlcmVuY0lORyByZWNvcmRzLFxuICAvLyBhbmQgdXBkYXRlIHJlZmVyZW5jZWQgaW5kZXggZm9yIGVhY2ggcmVjb3JkXG4gIGxldCByZWNvcmRDb3VudCA9IDA7XG4gIGNvbnN0IHJlZmVyZW5jaW5nTm9kZXMgPSAkKGFwcC5oaWVyYXJjaHksIFtcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gICAgZmlsdGVyKG4gPT4gaXNSZWNvcmQobilcbiAgICAgICAgICAgICAgICAgICAgJiYgc29tZShmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleChpbmRleE5vZGUpKShuLmZpZWxkcykpLFxuICBdKTtcblxuICBjb25zdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JSZWZlcmVuY2luZ05vZGUgPSBhc3luYyAocmVmZXJlbmNpbmdOb2RlKSA9PiB7XG4gICAgY29uc3QgaXRlcmF0ZVJlZmVyZW5jaW5nTm9kZXMgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvcihhcHApKHJlZmVyZW5jaW5nTm9kZS5jb2xsZWN0aW9uTm9kZUtleSgpKTtcblxuICAgIGxldCByZWZlcmVuY2luZ0lkSXRlcmF0b3IgPSBhd2FpdCBpdGVyYXRlUmVmZXJlbmNpbmdOb2RlcygpO1xuICAgIHdoaWxlICghcmVmZXJlbmNpbmdJZEl0ZXJhdG9yLmRvbmUpIHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZWZlcmVuY2luZ0lkSXRlcmF0b3I7XG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIHJlc3VsdC5pZHMpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkS2V5ID0gam9pbktleShyZXN1bHQuY29sbGVjdGlvbktleSwgaWQpO1xuICAgICAgICBhd2FpdCB0cmFuc2FjdGlvbkZvckJ1aWxkSW5kZXgoYXBwLCBpbmRleE5vZGUubm9kZUtleSgpLCByZWNvcmRLZXksIHJlY29yZENvdW50KTtcbiAgICAgICAgcmVjb3JkQ291bnQrKztcbiAgICAgIH1cbiAgICAgIHJlZmVyZW5jaW5nSWRJdGVyYXRvciA9IGF3YWl0IGl0ZXJhdGVSZWZlcmVuY2luZ05vZGVzKCk7XG4gICAgfVxuICB9O1xuXG4gIGZvciAoY29uc3QgcmVmZXJlbmNpbmdOb2RlIG9mIHJlZmVyZW5jaW5nTm9kZXMpIHtcbiAgICBhd2FpdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JSZWZlcmVuY2luZ05vZGUocmVmZXJlbmNpbmdOb2RlKTtcbiAgfVxufTtcblxuY29uc3QgZ2V0QWxsb3dlZFBhcmVudENvbGxlY3Rpb25Ob2RlcyA9IChoaWVyYXJjaHksIGluZGV4Tm9kZSkgPT4gJChnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleChoaWVyYXJjaHksIGluZGV4Tm9kZSksIFtcbiAgbWFwKG4gPT4gbi5wYXJlbnQoKSksXG5dKTtcblxuY29uc3QgYnVpbGRIZWlyYXJjaGFsSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleE5vZGUpID0+IHtcbiAgbGV0IHJlY29yZENvdW50ID0gMDtcblxuICBjb25zdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JJZHMgPSBhc3luYyAoY29sbGVjdGlvbktleSwgaWRzKSA9PiB7XG4gICAgZm9yIChjb25zdCByZWNvcmRJZCBvZiBpZHMpIHtcbiAgICAgIGNvbnN0IHJlY29yZEtleSA9IGpvaW5LZXkoY29sbGVjdGlvbktleSwgcmVjb3JkSWQpO1xuXG4gICAgICBjb25zdCByZWNvcmROb2RlID0gZ2V0UmVjb3JkTm9kZUJ5SWQoXG4gICAgICAgIGFwcC5oaWVyYXJjaHksXG4gICAgICAgIHJlY29yZElkLFxuICAgICAgKTtcblxuICAgICAgaWYgKHJlY29yZE5vZGVBcHBsaWVzKGluZGV4Tm9kZSkocmVjb3JkTm9kZSkpIHtcbiAgICAgICAgYXdhaXQgdHJhbnNhY3Rpb25Gb3JCdWlsZEluZGV4KFxuICAgICAgICAgIGFwcCwgaW5kZXhOb2RlLm5vZGVLZXkoKSxcbiAgICAgICAgICByZWNvcmRLZXksIHJlY29yZENvdW50LFxuICAgICAgICApO1xuICAgICAgICByZWNvcmRDb3VudCsrO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuXG4gIGNvbnN0IGNvbGxlY3Rpb25SZWNvcmRzID0gZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgoYXBwLmhpZXJhcmNoeSwgaW5kZXhOb2RlKTtcblxuICBmb3IgKGNvbnN0IHRhcmdldENvbGxlY3Rpb25SZWNvcmROb2RlIG9mIGNvbGxlY3Rpb25SZWNvcmRzKSB7XG4gICAgY29uc3QgYWxsSWRzSXRlcmF0b3IgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvcihhcHApKHRhcmdldENvbGxlY3Rpb25SZWNvcmROb2RlLmNvbGxlY3Rpb25Ob2RlS2V5KCkpO1xuXG4gICAgbGV0IGFsbElkcyA9IGF3YWl0IGFsbElkc0l0ZXJhdG9yKCk7XG4gICAgd2hpbGUgKGFsbElkcy5kb25lID09PSBmYWxzZSkge1xuICAgICAgYXdhaXQgY3JlYXRlVHJhbnNhY3Rpb25zRm9ySWRzKFxuICAgICAgICBhbGxJZHMucmVzdWx0LmNvbGxlY3Rpb25LZXksXG4gICAgICAgIGFsbElkcy5yZXN1bHQuaWRzLFxuICAgICAgKTtcbiAgICAgIGFsbElkcyA9IGF3YWl0IGFsbElkc0l0ZXJhdG9yKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlY29yZENvdW50O1xufTtcblxuY29uc3QgY2hvb3NlQ2hpbGRSZWNvcmROb2RlQnlLZXkgPSAoY29sbGVjdGlvbk5vZGUsIHJlY29yZElkKSA9PiBmaW5kKGMgPT4gcmVjb3JkSWQuc3RhcnRzV2l0aChjLm5vZGVJZCkpKGNvbGxlY3Rpb25Ob2RlLmNoaWxkcmVuKTtcblxuY29uc3QgcmVjb3JkTm9kZUFwcGxpZXMgPSBpbmRleE5vZGUgPT4gcmVjb3JkTm9kZSA9PiBpbmNsdWRlcyhyZWNvcmROb2RlLm5vZGVJZCkoaW5kZXhOb2RlLmFsbG93ZWRSZWNvcmROb2RlSWRzKTtcblxuY29uc3QgaGFzQXBwbGljYWJsZURlY2VuZGFudCA9IChoaWVyYXJjaHksIGFuY2VzdG9yTm9kZSwgaW5kZXhOb2RlKSA9PiAkKGhpZXJhcmNoeSwgW1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGZpbHRlcihcbiAgICBhbGxUcnVlKFxuICAgICAgaXNSZWNvcmQsXG4gICAgICBpc0RlY2VuZGFudChhbmNlc3Rvck5vZGUpLFxuICAgICAgcmVjb3JkTm9kZUFwcGxpZXMoaW5kZXhOb2RlKSxcbiAgICApLFxuICApLFxuXSk7XG5cbmNvbnN0IGFwcGx5QWxsRGVjZW5kYW50UmVjb3JkcyA9IGFzeW5jIChhcHAsIGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXksXG4gIGluZGV4Tm9kZSwgaW5kZXhLZXksIGN1cnJlbnRJbmRleGVkRGF0YSxcbiAgY3VycmVudEluZGV4ZWREYXRhS2V5LCByZWNvcmRDb3VudCA9IDApID0+IHtcbiAgY29uc3QgY29sbGVjdGlvbk5vZGUgPSBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5KFxuICAgIGFwcC5oaWVyYXJjaHksXG4gICAgY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSxcbiAgKTtcblxuICBjb25zdCBhbGxJZHNJdGVyYXRvciA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yKGFwcCkoY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSk7XG5cblxuICBjb25zdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JJZHMgPSBhc3luYyAoY29sbGVjdGlvbktleSwgYWxsSWRzKSA9PiB7XG4gICAgZm9yIChjb25zdCByZWNvcmRJZCBvZiBhbGxJZHMpIHtcbiAgICAgIGNvbnN0IHJlY29yZEtleSA9IGpvaW5LZXkoY29sbGVjdGlvbktleSwgcmVjb3JkSWQpO1xuXG4gICAgICBjb25zdCByZWNvcmROb2RlID0gY2hvb3NlQ2hpbGRSZWNvcmROb2RlQnlLZXkoXG4gICAgICAgIGNvbGxlY3Rpb25Ob2RlLFxuICAgICAgICByZWNvcmRJZCxcbiAgICAgICk7XG5cbiAgICAgIGlmIChyZWNvcmROb2RlQXBwbGllcyhpbmRleE5vZGUpKHJlY29yZE5vZGUpKSB7XG4gICAgICAgIGF3YWl0IHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleChcbiAgICAgICAgICBhcHAsIGluZGV4Tm9kZS5ub2RlS2V5KCksXG4gICAgICAgICAgcmVjb3JkS2V5LCByZWNvcmRDb3VudCxcbiAgICAgICAgKTtcbiAgICAgICAgcmVjb3JkQ291bnQrKztcbiAgICAgIH1cblxuICAgICAgaWYgKGhhc0FwcGxpY2FibGVEZWNlbmRhbnQoYXBwLmhpZXJhcmNoeSwgcmVjb3JkTm9kZSwgaW5kZXhOb2RlKSkge1xuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkQ29sbGVjdGlvbk5vZGUgb2YgcmVjb3JkTm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgIHJlY29yZENvdW50ID0gYXdhaXQgYXBwbHlBbGxEZWNlbmRhbnRSZWNvcmRzKFxuICAgICAgICAgICAgYXBwLFxuICAgICAgICAgICAgam9pbktleShyZWNvcmRLZXksIGNoaWxkQ29sbGVjdGlvbk5vZGUuY29sbGVjdGlvbk5hbWUpLFxuICAgICAgICAgICAgaW5kZXhOb2RlLCBpbmRleEtleSwgY3VycmVudEluZGV4ZWREYXRhLFxuICAgICAgICAgICAgY3VycmVudEluZGV4ZWREYXRhS2V5LCByZWNvcmRDb3VudCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGxldCBhbGxJZHMgPSBhd2FpdCBhbGxJZHNJdGVyYXRvcigpO1xuICB3aGlsZSAoYWxsSWRzLmRvbmUgPT09IGZhbHNlKSB7XG4gICAgYXdhaXQgY3JlYXRlVHJhbnNhY3Rpb25zRm9ySWRzKFxuICAgICAgYWxsSWRzLnJlc3VsdC5jb2xsZWN0aW9uS2V5LFxuICAgICAgYWxsSWRzLnJlc3VsdC5pZHMsXG4gICAgKTtcbiAgICBhbGxJZHMgPSBhd2FpdCBhbGxJZHNJdGVyYXRvcigpO1xuICB9XG5cbiAgcmV0dXJuIHJlY29yZENvdW50O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYnVpbGRJbmRleDtcbiIsImltcG9ydCB7IGhhcywgaXNOdW1iZXIsIGlzVW5kZWZpbmVkIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCB7XG4gIHNhZmVLZXksIGFwaVdyYXBwZXIsXG4gIGV2ZW50cywgaXNOb25FbXB0eVN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGl0ZXJhdGVJbmRleCB9IGZyb20gJy4uL2luZGV4aW5nL3JlYWQnO1xuaW1wb3J0IHtcbiAgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5LFxuICBnZXRTaGFyZEtleXNJblJhbmdlLFxufSBmcm9tICcuLi9pbmRleGluZy9zaGFyZGluZyc7XG5pbXBvcnQge1xuICBnZXRFeGFjdE5vZGVGb3JQYXRoLCBpc0luZGV4LFxuICBpc1NoYXJkZWRJbmRleCxcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUyB9IGZyb20gJy4uL2luZGV4aW5nL3NlcmlhbGl6ZXInO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBhZ2dyZWdhdGVzID0gYXBwID0+IGFzeW5jIChpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcyA9IG51bGwsIHJhbmdlRW5kUGFyYW1zID0gbnVsbCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuaW5kZXhBcGkuYWdncmVnYXRlcyxcbiAgcGVybWlzc2lvbi5yZWFkSW5kZXguaXNBdXRob3JpemVkKGluZGV4S2V5KSxcbiAgeyBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMgfSxcbiAgX2FnZ3JlZ2F0ZXMsIGFwcCwgaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zLFxuKTtcblxuY29uc3QgX2FnZ3JlZ2F0ZXMgPSBhc3luYyAoYXBwLCBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMpID0+IHtcbiAgaW5kZXhLZXkgPSBzYWZlS2V5KGluZGV4S2V5KTtcbiAgY29uc3QgaW5kZXhOb2RlID0gZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHAuaGllcmFyY2h5KShpbmRleEtleSk7XG5cbiAgaWYgKCFpc0luZGV4KGluZGV4Tm9kZSkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignc3VwcGxpZWQga2V5IGlzIG5vdCBhbiBpbmRleCcpOyB9XG5cbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICBjb25zdCBzaGFyZEtleXMgPSBhd2FpdCBnZXRTaGFyZEtleXNJblJhbmdlKFxuICAgICAgYXBwLCBpbmRleEtleSwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMsXG4gICAgKTtcbiAgICBsZXQgYWdncmVnYXRlUmVzdWx0ID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IGsgb2Ygc2hhcmRLZXlzKSB7XG4gICAgICBjb25zdCBzaGFyZFJlc3VsdCA9IGF3YWl0IGdldEFnZ3JlZ2F0ZXMoYXBwLmhpZXJhcmNoeSwgYXBwLmRhdGFzdG9yZSwgaW5kZXhOb2RlLCBrKTtcbiAgICAgIGlmIChhZ2dyZWdhdGVSZXN1bHQgPT09IG51bGwpIHtcbiAgICAgICAgYWdncmVnYXRlUmVzdWx0ID0gc2hhcmRSZXN1bHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZ2dyZWdhdGVSZXN1bHQgPSBtZXJnZVNoYXJkQWdncmVnYXRlKFxuICAgICAgICAgIGFnZ3JlZ2F0ZVJlc3VsdCxcbiAgICAgICAgICBzaGFyZFJlc3VsdCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFnZ3JlZ2F0ZVJlc3VsdDtcbiAgfVxuICByZXR1cm4gYXdhaXQgZ2V0QWdncmVnYXRlcyhcbiAgICBhcHAuaGllcmFyY2h5LFxuICAgIGFwcC5kYXRhc3RvcmUsXG4gICAgaW5kZXhOb2RlLFxuICAgIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleShpbmRleEtleSksXG4gICk7XG59O1xuXG5jb25zdCBtZXJnZVNoYXJkQWdncmVnYXRlID0gKHRvdGFscywgc2hhcmQpID0+IHtcbiAgY29uc3QgbWVyZ2VHcm91cGluZyA9ICh0b3QsIHNocikgPT4ge1xuICAgIHRvdC5jb3VudCArPSBzaHIuY291bnQ7XG4gICAgZm9yIChjb25zdCBhZ2dOYW1lIGluIHRvdCkge1xuICAgICAgaWYgKGFnZ05hbWUgPT09ICdjb3VudCcpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgdG90YWdnID0gdG90W2FnZ05hbWVdO1xuICAgICAgY29uc3Qgc2hyYWdnID0gc2hyW2FnZ05hbWVdO1xuICAgICAgdG90YWdnLnN1bSArPSBzaHJhZ2cuc3VtO1xuICAgICAgdG90YWdnLm1heCA9IHRvdGFnZy5tYXggPiBzaHJhZ2cubWF4XG4gICAgICAgID8gdG90YWdnLm1heFxuICAgICAgICA6IHNocmFnZy5tYXg7XG4gICAgICB0b3RhZ2cubWluID0gdG90YWdnLm1pbiA8IHNocmFnZy5taW5cbiAgICAgICAgPyB0b3RhZ2cubWluXG4gICAgICAgIDogc2hyYWdnLm1pbjtcbiAgICAgIHRvdGFnZy5tZWFuID0gdG90YWdnLnN1bSAvIHRvdC5jb3VudDtcbiAgICB9XG4gICAgcmV0dXJuIHRvdDtcbiAgfTtcblxuICBmb3IgKGNvbnN0IGFnZ0dyb3VwRGVmIGluIHRvdGFscykge1xuICAgIGZvciAoY29uc3QgZ3JvdXBpbmcgaW4gc2hhcmRbYWdnR3JvdXBEZWZdKSB7XG4gICAgICBjb25zdCBncm91cGluZ1RvdGFsID0gdG90YWxzW2FnZ0dyb3VwRGVmXVtncm91cGluZ107XG4gICAgICB0b3RhbHNbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXSA9IGlzVW5kZWZpbmVkKGdyb3VwaW5nVG90YWwpXG4gICAgICAgID8gc2hhcmRbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXVxuICAgICAgICA6IG1lcmdlR3JvdXBpbmcoXG4gICAgICAgICAgdG90YWxzW2FnZ0dyb3VwRGVmXVtncm91cGluZ10sXG4gICAgICAgICAgc2hhcmRbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXSxcbiAgICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdG90YWxzO1xufTtcblxuY29uc3QgZ2V0QWdncmVnYXRlcyA9IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KSA9PiB7XG4gIGNvbnN0IGFnZ3JlZ2F0ZVJlc3VsdCA9IHt9O1xuICBjb25zdCBkb1JlYWQgPSBpdGVyYXRlSW5kZXgoXG4gICAgICAgIGFzeW5jIGl0ZW0gPT4ge1xuICAgICAgYXBwbHlJdGVtVG9BZ2dyZWdhdGVSZXN1bHQoXG4gICAgICAgIGluZGV4LCBhZ2dyZWdhdGVSZXN1bHQsIGl0ZW0sXG4gICAgICApO1xuICAgICAgcmV0dXJuIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcbiAgICB9LFxuICAgICAgICBhc3luYyAoKSA9PiBhZ2dyZWdhdGVSZXN1bHRcbiAgKTtcblxuICByZXR1cm4gYXdhaXQgZG9SZWFkKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXkpO1xufTtcblxuXG5jb25zdCBhcHBseUl0ZW1Ub0FnZ3JlZ2F0ZVJlc3VsdCA9IChpbmRleE5vZGUsIHJlc3VsdCwgaXRlbSkgPT4ge1xuICBjb25zdCBnZXRJbml0aWFsQWdncmVnYXRlUmVzdWx0ID0gKCkgPT4gKHtcbiAgICBzdW06IDAsIG1lYW46IG51bGwsIG1heDogbnVsbCwgbWluOiBudWxsLFxuICB9KTtcblxuICBjb25zdCBhcHBseUFnZ3JlZ2F0ZVJlc3VsdCA9IChhZ2csIGV4aXN0aW5nLCBjb3VudCkgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gY29tcGlsZUNvZGUoYWdnLmFnZ3JlZ2F0ZWRWYWx1ZSkoeyByZWNvcmQ6IGl0ZW0gfSk7XG5cbiAgICBpZiAoIWlzTnVtYmVyKHZhbHVlKSkgcmV0dXJuIGV4aXN0aW5nO1xuXG4gICAgZXhpc3Rpbmcuc3VtICs9IHZhbHVlO1xuICAgIGV4aXN0aW5nLm1heCA9IHZhbHVlID4gZXhpc3RpbmcubWF4IHx8IGV4aXN0aW5nLm1heCA9PT0gbnVsbFxuICAgICAgPyB2YWx1ZVxuICAgICAgOiBleGlzdGluZy5tYXg7XG4gICAgZXhpc3RpbmcubWluID0gdmFsdWUgPCBleGlzdGluZy5taW4gfHwgZXhpc3RpbmcubWluID09PSBudWxsXG4gICAgICA/IHZhbHVlXG4gICAgICA6IGV4aXN0aW5nLm1pbjtcbiAgICBleGlzdGluZy5tZWFuID0gZXhpc3Rpbmcuc3VtIC8gY291bnQ7XG4gICAgcmV0dXJuIGV4aXN0aW5nO1xuICB9O1xuXG4gIGZvciAoY29uc3QgYWdnR3JvdXAgb2YgaW5kZXhOb2RlLmFnZ3JlZ2F0ZUdyb3Vwcykge1xuICAgIGlmICghaGFzKGFnZ0dyb3VwLm5hbWUpKHJlc3VsdCkpIHtcbiAgICAgIHJlc3VsdFthZ2dHcm91cC5uYW1lXSA9IHt9O1xuICAgIH1cblxuICAgIGNvbnN0IHRoaXNHcm91cFJlc3VsdCA9IHJlc3VsdFthZ2dHcm91cC5uYW1lXTtcblxuICAgIGlmIChpc05vbkVtcHR5U3RyaW5nKGFnZ0dyb3VwLmNvbmRpdGlvbikpIHtcbiAgICAgIGlmICghY29tcGlsZUV4cHJlc3Npb24oYWdnR3JvdXAuY29uZGl0aW9uKSh7IHJlY29yZDogaXRlbSB9KSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgZ3JvdXAgPSBpc05vbkVtcHR5U3RyaW5nKGFnZ0dyb3VwLmdyb3VwQnkpXG4gICAgICA/IGNvbXBpbGVDb2RlKGFnZ0dyb3VwLmdyb3VwQnkpKHsgcmVjb3JkOiBpdGVtIH0pXG4gICAgICA6ICdhbGwnO1xuICAgIGlmICghaXNOb25FbXB0eVN0cmluZyhncm91cCkpIHtcbiAgICAgIGdyb3VwID0gJyhub25lKSc7XG4gICAgfVxuXG4gICAgaWYgKCFoYXMoZ3JvdXApKHRoaXNHcm91cFJlc3VsdCkpIHtcbiAgICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF0gPSB7IGNvdW50OiAwIH07XG4gICAgICBmb3IgKGNvbnN0IGFnZyBvZiBhZ2dHcm91cC5hZ2dyZWdhdGVzKSB7XG4gICAgICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF1bYWdnLm5hbWVdID0gZ2V0SW5pdGlhbEFnZ3JlZ2F0ZVJlc3VsdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF0uY291bnQrKztcblxuICAgIGZvciAoY29uc3QgYWdnIG9mIGFnZ0dyb3VwLmFnZ3JlZ2F0ZXMpIHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nVmFsdWVzID0gdGhpc0dyb3VwUmVzdWx0W2dyb3VwXVthZ2cubmFtZV07XG4gICAgICB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdW2FnZy5uYW1lXSA9IGFwcGx5QWdncmVnYXRlUmVzdWx0KFxuICAgICAgICBhZ2csIGV4aXN0aW5nVmFsdWVzLFxuICAgICAgICB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdLmNvdW50LFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBidWlsZEluZGV4IH0gZnJvbSAnLi9idWlsZEluZGV4JztcbmltcG9ydCB7IGxpc3RJdGVtcyB9IGZyb20gJy4vbGlzdEl0ZW1zJztcbmltcG9ydCB7IGFnZ3JlZ2F0ZXMgfSBmcm9tICcuL2FnZ3JlZ2F0ZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhBcGkgPSBhcHAgPT4gKHtcbiAgbGlzdEl0ZW1zOiBsaXN0SXRlbXMoYXBwKSxcbiAgYnVpbGRJbmRleDogYnVpbGRJbmRleChhcHApLFxuICBhZ2dyZWdhdGVzOiBhZ2dyZWdhdGVzKGFwcCksXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0SW5kZXhBcGk7XG4iLCJpbXBvcnQgeyBlYWNoLCBmaW5kIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IG1hcCwgbWF4LCBjb25zdGFudCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgam9pbktleSxcbiAgJCwgaXNOb3RoaW5nLCBpc1NvbWV0aGluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIGlzSW5kZXgsIGlzUm9vdCwgaXNTaW5nbGVSZWNvcmQsIGlzQ29sbGVjdGlvblJlY29yZCxcbiAgaXNSZWNvcmQsIGlzYWdncmVnYXRlR3JvdXAsXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbn0gZnJvbSAnLi9oaWVyYXJjaHknO1xuaW1wb3J0IHsgYWxsIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVOb2RlRXJyb3JzID0ge1xuICBpbmRleENhbm5vdEJlUGFyZW50OiAnSW5kZXggdGVtcGxhdGUgY2Fubm90IGJlIGEgcGFyZW50JyxcbiAgYWxsTm9uUm9vdE5vZGVzTXVzdEhhdmVQYXJlbnQ6ICdPbmx5IHRoZSByb290IG5vZGUgbWF5IGhhdmUgbm8gcGFyZW50JyxcbiAgaW5kZXhQYXJlbnRNdXN0QmVSZWNvcmRPclJvb3Q6ICdBbiBpbmRleCBtYXkgb25seSBoYXZlIGEgcmVjb3JkIG9yIHJvb3QgYXMgYSBwYXJlbnQnLFxuICBhZ2dyZWdhdGVQYXJlbnRNdXN0QmVBbkluZGV4OiAnYWdncmVnYXRlR3JvdXAgcGFyZW50IG11c3QgYmUgYW4gaW5kZXgnLFxufTtcblxuY29uc3QgcGF0aFJlZ3hNYWtlciA9IG5vZGUgPT4gKCkgPT4gbm9kZS5ub2RlS2V5KCkucmVwbGFjZSgve2lkfS9nLCAnW2EtekEtWjAtOV8tXSsnKTtcblxuY29uc3Qgbm9kZUtleU1ha2VyID0gbm9kZSA9PiAoKSA9PiBzd2l0Y2hDYXNlKFxuXG4gIFtuID0+IGlzUmVjb3JkKG4pICYmICFpc1NpbmdsZVJlY29yZChuKSxcbiAgICBuID0+IGpvaW5LZXkoXG4gICAgICBub2RlLnBhcmVudCgpLm5vZGVLZXkoKSxcbiAgICAgIG5vZGUuY29sbGVjdGlvbk5hbWUsXG4gICAgICBgJHtuLm5vZGVJZH0te2lkfWAsXG4gICAgKV0sXG5cbiAgW2lzUm9vdCxcbiAgICBjb25zdGFudCgnLycpXSxcblxuICBbZGVmYXVsdENhc2UsXG4gICAgbiA9PiBqb2luS2V5KG5vZGUucGFyZW50KCkubm9kZUtleSgpLCBuLm5hbWUpXSxcblxuKShub2RlKTtcblxuXG5jb25zdCB2YWxpZGF0ZSA9IHBhcmVudCA9PiAobm9kZSkgPT4ge1xuICBpZiAoaXNJbmRleChub2RlKVxuICAgICAgICAmJiBpc1NvbWV0aGluZyhwYXJlbnQpXG4gICAgICAgICYmICFpc1Jvb3QocGFyZW50KVxuICAgICAgICAmJiAhaXNSZWNvcmQocGFyZW50KSkge1xuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoY3JlYXRlTm9kZUVycm9ycy5pbmRleFBhcmVudE11c3RCZVJlY29yZE9yUm9vdCk7XG4gIH1cblxuICBpZiAoaXNhZ2dyZWdhdGVHcm91cChub2RlKVxuICAgICAgICAmJiBpc1NvbWV0aGluZyhwYXJlbnQpXG4gICAgICAgICYmICFpc0luZGV4KHBhcmVudCkpIHtcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGNyZWF0ZU5vZGVFcnJvcnMuYWdncmVnYXRlUGFyZW50TXVzdEJlQW5JbmRleCk7XG4gIH1cblxuICBpZiAoaXNOb3RoaW5nKHBhcmVudCkgJiYgIWlzUm9vdChub2RlKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGNyZWF0ZU5vZGVFcnJvcnMuYWxsTm9uUm9vdE5vZGVzTXVzdEhhdmVQYXJlbnQpOyB9XG5cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5jb25zdCBjb25zdHJ1Y3QgPSBwYXJlbnQgPT4gKG5vZGUpID0+IHtcbiAgbm9kZS5ub2RlS2V5ID0gbm9kZUtleU1ha2VyKG5vZGUpO1xuICBub2RlLnBhdGhSZWd4ID0gcGF0aFJlZ3hNYWtlcihub2RlKTtcbiAgbm9kZS5wYXJlbnQgPSBjb25zdGFudChwYXJlbnQpO1xuICBub2RlLmlzUm9vdCA9ICgpID0+IGlzTm90aGluZyhwYXJlbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBub2RlLm5hbWUgPT09ICdyb290J1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgbm9kZS50eXBlID09PSAncm9vdCc7XG4gIGlmIChpc0NvbGxlY3Rpb25SZWNvcmQobm9kZSkpIHtcbiAgICBub2RlLmNvbGxlY3Rpb25Ob2RlS2V5ID0gKCkgPT4gam9pbktleShcbiAgICAgIHBhcmVudC5ub2RlS2V5KCksIG5vZGUuY29sbGVjdGlvbk5hbWUsXG4gICAgKTtcbiAgICBub2RlLmNvbGxlY3Rpb25QYXRoUmVneCA9ICgpID0+IGpvaW5LZXkoXG4gICAgICBwYXJlbnQucGF0aFJlZ3goKSwgbm9kZS5jb2xsZWN0aW9uTmFtZSxcbiAgICApO1xuICB9XG4gIHJldHVybiBub2RlO1xufTtcblxuY29uc3QgYWRkVG9QYXJlbnQgPSAob2JqKSA9PiB7XG4gIGNvbnN0IHBhcmVudCA9IG9iai5wYXJlbnQoKTtcbiAgaWYgKGlzU29tZXRoaW5nKHBhcmVudCkpIHtcbiAgICBpZiAoaXNJbmRleChvYmopKVxuICAgIC8vIFE6IHdoeSBhcmUgaW5kZXhlcyBub3QgY2hpbGRyZW4gP1xuICAgIC8vIEE6IGJlY2F1c2UgdGhleSBjYW5ub3QgaGF2ZSBjaGlsZHJlbiBvZiB0aGVpciBvd24uXG4gICAgeyBwYXJlbnQuaW5kZXhlcy5wdXNoKG9iaik7IH0gZWxzZSBpZiAoaXNhZ2dyZWdhdGVHcm91cChvYmopKSB7IHBhcmVudC5hZ2dyZWdhdGVHcm91cHMucHVzaChvYmopOyB9IGVsc2UgeyBwYXJlbnQuY2hpbGRyZW4ucHVzaChvYmopOyB9XG5cbiAgICBpZiAoaXNSZWNvcmQob2JqKSkge1xuICAgICAgY29uc3QgZGVmYXVsdEluZGV4ID0gZmluZChcbiAgICAgICAgcGFyZW50LmluZGV4ZXMsXG4gICAgICAgIGkgPT4gaS5uYW1lID09PSBgJHtwYXJlbnQubmFtZX1faW5kZXhgLFxuICAgICAgKTtcbiAgICAgIGlmIChkZWZhdWx0SW5kZXgpIHtcbiAgICAgICAgZGVmYXVsdEluZGV4LmFsbG93ZWRSZWNvcmROb2RlSWRzLnB1c2gob2JqLm5vZGVJZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmo7XG59O1xuXG5leHBvcnQgY29uc3QgY29uc3RydWN0Tm9kZSA9IChwYXJlbnQsIG9iaikgPT4gJChvYmosIFtcbiAgY29uc3RydWN0KHBhcmVudCksXG4gIHZhbGlkYXRlKHBhcmVudCksXG4gIGFkZFRvUGFyZW50LFxuXSk7XG5cbmNvbnN0IGdldE5vZGVJZCA9IChwYXJlbnROb2RlKSA9PiB7XG4gIC8vIHRoaXMgY2FzZSBpcyBoYW5kbGVkIGJldHRlciBlbHNld2hlcmVcbiAgaWYgKCFwYXJlbnROb2RlKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZmluZFJvb3QgPSBuID0+IChpc1Jvb3QobikgPyBuIDogZmluZFJvb3Qobi5wYXJlbnQoKSkpO1xuICBjb25zdCByb290ID0gZmluZFJvb3QocGFyZW50Tm9kZSk7XG5cbiAgcmV0dXJuICgkKHJvb3QsIFtcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gICAgbWFwKG4gPT4gbi5ub2RlSWQpLFxuICAgIG1heF0pICsgMSk7XG59O1xuXG5leHBvcnQgY29uc3QgY29uc3RydWN0SGllcmFyY2h5ID0gKG5vZGUsIHBhcmVudCkgPT4ge1xuICBjb25zdHJ1Y3QocGFyZW50KShub2RlKTtcbiAgaWYgKG5vZGUuaW5kZXhlcykge1xuICAgIGVhY2gobm9kZS5pbmRleGVzLFxuICAgICAgY2hpbGQgPT4gY29uc3RydWN0SGllcmFyY2h5KGNoaWxkLCBub2RlKSk7XG4gIH1cbiAgaWYgKG5vZGUuYWdncmVnYXRlR3JvdXBzKSB7XG4gICAgZWFjaChub2RlLmFnZ3JlZ2F0ZUdyb3VwcyxcbiAgICAgIGNoaWxkID0+IGNvbnN0cnVjdEhpZXJhcmNoeShjaGlsZCwgbm9kZSkpO1xuICB9XG4gIGlmIChub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgIGVhY2gobm9kZS5jaGlsZHJlbixcbiAgICAgIGNoaWxkID0+IGNvbnN0cnVjdEhpZXJhcmNoeShjaGlsZCwgbm9kZSkpO1xuICB9XG4gIGlmIChub2RlLmZpZWxkcykge1xuICAgIGVhY2gobm9kZS5maWVsZHMsXG4gICAgICBmID0+IGVhY2goZi50eXBlT3B0aW9ucywgKHZhbCwga2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IGRlZiA9IGFsbFtmLnR5cGVdLm9wdGlvbkRlZmluaXRpb25zW2tleV07XG4gICAgICAgIGlmICghZGVmKSB7XG4gICAgICAgICAgLy8gdW5rbm93biB0eXBlT3B0aW9uXG4gICAgICAgICAgZGVsZXRlIGYudHlwZU9wdGlvbnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmLnR5cGVPcHRpb25zW2tleV0gPSBkZWYucGFyc2UodmFsKTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICB9XG4gIHJldHVybiBub2RlO1xufTtcblxuXG5leHBvcnQgY29uc3QgZ2V0TmV3Um9vdExldmVsID0gKCkgPT4gY29uc3RydWN0KCkoe1xuICBuYW1lOiAncm9vdCcsXG4gIHR5cGU6ICdyb290JyxcbiAgY2hpbGRyZW46IFtdLFxuICBwYXRoTWFwczogW10sXG4gIGluZGV4ZXM6IFtdLFxuICBub2RlSWQ6IDAsXG59KTtcblxuY29uc3QgX2dldE5ld1JlY29yZFRlbXBsYXRlID0gKHBhcmVudCwgbmFtZSwgY3JlYXRlRGVmYXVsdEluZGV4LCBpc1NpbmdsZSkgPT4ge1xuICBjb25zdCBub2RlID0gY29uc3RydWN0Tm9kZShwYXJlbnQsIHtcbiAgICBuYW1lLFxuICAgIHR5cGU6ICdyZWNvcmQnLFxuICAgIGZpZWxkczogW10sXG4gICAgY2hpbGRyZW46IFtdLFxuICAgIHZhbGlkYXRpb25SdWxlczogW10sXG4gICAgbm9kZUlkOiBnZXROb2RlSWQocGFyZW50KSxcbiAgICBpbmRleGVzOiBbXSxcbiAgICBhbGxpZHNTaGFyZEZhY3RvcjogaXNSZWNvcmQocGFyZW50KSA/IDEgOiA2NCxcbiAgICBjb2xsZWN0aW9uTmFtZTogJycsXG4gICAgaXNTaW5nbGUsXG4gIH0pO1xuXG4gIGlmIChjcmVhdGVEZWZhdWx0SW5kZXgpIHtcbiAgICBjb25zdCBkZWZhdWx0SW5kZXggPSBnZXROZXdJbmRleFRlbXBsYXRlKHBhcmVudCk7XG4gICAgZGVmYXVsdEluZGV4Lm5hbWUgPSBgJHtuYW1lfV9pbmRleGA7XG4gICAgZGVmYXVsdEluZGV4LmFsbG93ZWRSZWNvcmROb2RlSWRzLnB1c2gobm9kZS5ub2RlSWQpO1xuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3UmVjb3JkVGVtcGxhdGUgPSAocGFyZW50LCBuYW1lID0gJycsIGNyZWF0ZURlZmF1bHRJbmRleCA9IHRydWUpID0+IF9nZXROZXdSZWNvcmRUZW1wbGF0ZShwYXJlbnQsIG5hbWUsIGNyZWF0ZURlZmF1bHRJbmRleCwgZmFsc2UpO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3U2luZ2xlUmVjb3JkVGVtcGxhdGUgPSBwYXJlbnQgPT4gX2dldE5ld1JlY29yZFRlbXBsYXRlKHBhcmVudCwgJycsIGZhbHNlLCB0cnVlKTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0luZGV4VGVtcGxhdGUgPSAocGFyZW50LCB0eXBlID0gJ2FuY2VzdG9yJykgPT4gY29uc3RydWN0Tm9kZShwYXJlbnQsIHtcbiAgbmFtZTogJycsXG4gIHR5cGU6ICdpbmRleCcsXG4gIG1hcDogJ3JldHVybiB7Li4ucmVjb3JkfTsnLFxuICBmaWx0ZXI6ICcnLFxuICBpbmRleFR5cGU6IHR5cGUsXG4gIGdldFNoYXJkTmFtZTogJycsXG4gIGdldFNvcnRLZXk6ICdyZWNvcmQuaWQnLFxuICBhZ2dyZWdhdGVHcm91cHM6IFtdLFxuICBhbGxvd2VkUmVjb3JkTm9kZUlkczogW10sXG4gIG5vZGVJZDogZ2V0Tm9kZUlkKHBhcmVudCksXG59KTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0FnZ3JlZ2F0ZUdyb3VwVGVtcGxhdGUgPSBpbmRleCA9PiBjb25zdHJ1Y3ROb2RlKGluZGV4LCB7XG4gIG5hbWU6ICcnLFxuICB0eXBlOiAnYWdncmVnYXRlR3JvdXAnLFxuICBncm91cEJ5OiAnJyxcbiAgYWdncmVnYXRlczogW10sXG4gIGNvbmRpdGlvbjogJycsXG4gIG5vZGVJZDogZ2V0Tm9kZUlkKGluZGV4KSxcbn0pO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3QWdncmVnYXRlVGVtcGxhdGUgPSAoc2V0KSA9PiB7XG4gIGNvbnN0IGFnZ3JlZ2F0ZWRWYWx1ZSA9IHtcbiAgICBuYW1lOiAnJyxcbiAgICBhZ2dyZWdhdGVkVmFsdWU6ICcnLFxuICB9O1xuICBzZXQuYWdncmVnYXRlcy5wdXNoKGFnZ3JlZ2F0ZWRWYWx1ZSk7XG4gIHJldHVybiBhZ2dyZWdhdGVkVmFsdWU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdldE5ld1Jvb3RMZXZlbCxcbiAgZ2V0TmV3UmVjb3JkVGVtcGxhdGUsXG4gIGdldE5ld0luZGV4VGVtcGxhdGUsXG4gIGNyZWF0ZU5vZGVFcnJvcnMsXG4gIGNvbnN0cnVjdEhpZXJhcmNoeSxcbiAgZ2V0TmV3QWdncmVnYXRlR3JvdXBUZW1wbGF0ZSxcbiAgZ2V0TmV3QWdncmVnYXRlVGVtcGxhdGUsXG59O1xuIiwiaW1wb3J0IHtcbiAgc29tZSwgbWFwLCBmaWx0ZXIsIGtleXMsIGluY2x1ZGVzLFxuICBjb3VudEJ5LCBmbGF0dGVuLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgaXNTb21ldGhpbmcsICQsXG4gIGlzTm9uRW1wdHlTdHJpbmcsXG4gIGlzTm90aGluZ09yRW1wdHksXG4gIGlzTm90aGluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGFsbCwgZ2V0RGVmYXVsdE9wdGlvbnMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBmaWVsZEVycm9ycyA9IHtcbiAgQWRkRmllbGRWYWxpZGF0aW9uRmFpbGVkOiAnQWRkIGZpZWxkIHZhbGlkYXRpb246ICcsXG59O1xuXG5leHBvcnQgY29uc3QgYWxsb3dlZFR5cGVzID0gKCkgPT4ga2V5cyhhbGwpO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3RmllbGQgPSB0eXBlID0+ICh7XG4gIG5hbWU6ICcnLCAvLyBob3cgZmllbGQgaXMgcmVmZXJlbmNlZCBpbnRlcm5hbGx5XG4gIHR5cGUsXG4gIHR5cGVPcHRpb25zOiBnZXREZWZhdWx0T3B0aW9ucyh0eXBlKSxcbiAgbGFiZWw6ICcnLCAvLyBob3cgZmllbGQgaXMgZGlzcGxheWVkXG4gIGdldEluaXRpYWxWYWx1ZTogJ2RlZmF1bHQnLCAvLyBmdW5jdGlvbiB0aGF0IGdldHMgdmFsdWUgd2hlbiBpbml0aWFsbHkgY3JlYXRlZFxuICBnZXRVbmRlZmluZWRWYWx1ZTogJ2RlZmF1bHQnLCAvLyBmdW5jdGlvbiB0aGF0IGdldHMgdmFsdWUgd2hlbiBmaWVsZCB1bmRlZmluZWQgb24gcmVjb3JkXG59KTtcblxuY29uc3QgZmllbGRSdWxlcyA9IGFsbEZpZWxkcyA9PiBbXG4gIG1ha2VydWxlKCduYW1lJywgJ2ZpZWxkIG5hbWUgaXMgbm90IHNldCcsXG4gICAgZiA9PiBpc05vbkVtcHR5U3RyaW5nKGYubmFtZSkpLFxuICBtYWtlcnVsZSgndHlwZScsICdmaWVsZCB0eXBlIGlzIG5vdCBzZXQnLFxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLnR5cGUpKSxcbiAgbWFrZXJ1bGUoJ2xhYmVsJywgJ2ZpZWxkIGxhYmVsIGlzIG5vdCBzZXQnLFxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLmxhYmVsKSksXG4gIG1ha2VydWxlKCdnZXRJbml0aWFsVmFsdWUnLCAnZ2V0SW5pdGlhbFZhbHVlIGZ1bmN0aW9uIGlzIG5vdCBzZXQnLFxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLmdldEluaXRpYWxWYWx1ZSkpLFxuICBtYWtlcnVsZSgnZ2V0VW5kZWZpbmVkVmFsdWUnLCAnZ2V0VW5kZWZpbmVkVmFsdWUgZnVuY3Rpb24gaXMgbm90IHNldCcsXG4gICAgZiA9PiBpc05vbkVtcHR5U3RyaW5nKGYuZ2V0VW5kZWZpbmVkVmFsdWUpKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnZmllbGQgbmFtZSBpcyBkdXBsaWNhdGVkJyxcbiAgICBmID0+IGlzTm90aGluZ09yRW1wdHkoZi5uYW1lKVxuICAgICAgICAgICAgIHx8IGNvdW50QnkoJ25hbWUnKShhbGxGaWVsZHMpW2YubmFtZV0gPT09IDEpLFxuICBtYWtlcnVsZSgndHlwZScsICd0eXBlIGlzIHVua25vd24nLFxuICAgIGYgPT4gaXNOb3RoaW5nT3JFbXB0eShmLnR5cGUpXG4gICAgICAgICAgICAgfHwgc29tZSh0ID0+IGYudHlwZSA9PT0gdCkoYWxsb3dlZFR5cGVzKCkpKSxcbl07XG5cbmNvbnN0IHR5cGVPcHRpb25zUnVsZXMgPSAoZmllbGQpID0+IHtcbiAgY29uc3QgdHlwZSA9IGFsbFtmaWVsZC50eXBlXTtcbiAgaWYgKGlzTm90aGluZyh0eXBlKSkgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IGRlZiA9IG9wdE5hbWUgPT4gdHlwZS5vcHRpb25EZWZpbml0aW9uc1tvcHROYW1lXTtcblxuICByZXR1cm4gJChmaWVsZC50eXBlT3B0aW9ucywgW1xuICAgIGtleXMsXG4gICAgZmlsdGVyKG8gPT4gaXNTb21ldGhpbmcoZGVmKG8pKVxuICAgICAgICAgICAgICAgICAgICAmJiBpc1NvbWV0aGluZyhkZWYobykuaXNWYWxpZCkpLFxuICAgIG1hcChvID0+IG1ha2VydWxlKFxuICAgICAgYHR5cGVPcHRpb25zLiR7b31gLFxuICAgICAgYCR7ZGVmKG8pLnJlcXVpcmVtZW50RGVzY3JpcHRpb259YCxcbiAgICAgIGZpZWxkID0+IGRlZihvKS5pc1ZhbGlkKGZpZWxkLnR5cGVPcHRpb25zW29dKSxcbiAgICApKSxcbiAgXSk7XG59O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVGaWVsZCA9IGFsbEZpZWxkcyA9PiAoZmllbGQpID0+IHtcbiAgY29uc3QgZXZlcnlTaW5nbGVGaWVsZCA9IGluY2x1ZGVzKGZpZWxkKShhbGxGaWVsZHMpID8gYWxsRmllbGRzIDogWy4uLmFsbEZpZWxkcywgZmllbGRdO1xuICByZXR1cm4gYXBwbHlSdWxlU2V0KFsuLi5maWVsZFJ1bGVzKGV2ZXJ5U2luZ2xlRmllbGQpLCAuLi50eXBlT3B0aW9uc1J1bGVzKGZpZWxkKV0pKGZpZWxkKTtcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFsbEZpZWxkcyA9IHJlY29yZE5vZGUgPT4gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICBtYXAodmFsaWRhdGVGaWVsZChyZWNvcmROb2RlLmZpZWxkcykpLFxuICBmbGF0dGVuLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBhZGRGaWVsZCA9IChyZWNvcmRUZW1wbGF0ZSwgZmllbGQpID0+IHtcbiAgaWYgKGlzTm90aGluZ09yRW1wdHkoZmllbGQubGFiZWwpKSB7XG4gICAgZmllbGQubGFiZWwgPSBmaWVsZC5uYW1lO1xuICB9XG4gIGNvbnN0IHZhbGlkYXRpb25NZXNzYWdlcyA9IHZhbGlkYXRlRmllbGQoWy4uLnJlY29yZFRlbXBsYXRlLmZpZWxkcywgZmllbGRdKShmaWVsZCk7XG4gIGlmICh2YWxpZGF0aW9uTWVzc2FnZXMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGVycm9ycyA9IG1hcChtID0+IG0uZXJyb3IpKHZhbGlkYXRpb25NZXNzYWdlcyk7XG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgJHtmaWVsZEVycm9ycy5BZGRGaWVsZFZhbGlkYXRpb25GYWlsZWR9ICR7ZXJyb3JzLmpvaW4oJywgJyl9YCk7XG4gIH1cbiAgcmVjb3JkVGVtcGxhdGUuZmllbGRzLnB1c2goZmllbGQpO1xufTtcbiIsImltcG9ydCB7IGlzTnVtYmVyLCBpc0Jvb2xlYW4sIGRlZmF1bHRDYXNlIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHN3aXRjaENhc2UgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUgPSAoaW52YWxpZEZpZWxkcyxcbiAgbWVzc2FnZVdoZW5JbnZhbGlkLFxuICBleHByZXNzaW9uV2hlblZhbGlkKSA9PiAoe1xuICBpbnZhbGlkRmllbGRzLCBtZXNzYWdlV2hlbkludmFsaWQsIGV4cHJlc3Npb25XaGVuVmFsaWQsXG59KTtcblxuY29uc3QgZ2V0U3RhdGljVmFsdWUgPSBzd2l0Y2hDYXNlKFxuICBbaXNOdW1iZXIsIHYgPT4gdi50b1N0cmluZygpXSxcbiAgW2lzQm9vbGVhbiwgdiA9PiB2LnRvU3RyaW5nKCldLFxuICBbZGVmYXVsdENhc2UsIHYgPT4gYCcke3Z9J2BdLFxuKTtcblxuZXhwb3J0IGNvbnN0IGNvbW1vblJlY29yZFZhbGlkYXRpb25SdWxlcyA9ICh7XG5cbiAgZmllbGROb3RFbXB0eTogZmllbGROYW1lID0+IGdldE5ld1JlY29yZFZhbGlkYXRpb25SdWxlKFxuICAgIFtmaWVsZE5hbWVdLFxuICAgIGAke2ZpZWxkTmFtZX0gaXMgZW1wdHlgLFxuICAgIGAhXy5pc0VtcHR5KHJlY29yZFsnJHtmaWVsZE5hbWV9J10pYCxcbiAgKSxcblxuICBmaWVsZEJldHdlZW46IChmaWVsZE5hbWUsIG1pbiwgbWF4KSA9PiBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZShcbiAgICBbZmllbGROYW1lXSxcbiAgICBgJHtmaWVsZE5hbWV9IG11c3QgYmUgYmV0d2VlbiAke21pbi50b1N0cmluZygpfSBhbmQgJHttYXgudG9TdHJpbmcoKX1gLFxuICAgIGByZWNvcmRbJyR7ZmllbGROYW1lfSddID49ICR7Z2V0U3RhdGljVmFsdWUobWluKX0gJiYgIHJlY29yZFsnJHtmaWVsZE5hbWV9J10gPD0gJHtnZXRTdGF0aWNWYWx1ZShtYXgpfSBgLFxuICApLFxuXG4gIGZpZWxkR3JlYXRlclRoYW46IChmaWVsZE5hbWUsIG1pbiwgbWF4KSA9PiBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZShcbiAgICBbZmllbGROYW1lXSxcbiAgICBgJHtmaWVsZE5hbWV9IG11c3QgYmUgZ3JlYXRlciB0aGFuICR7bWluLnRvU3RyaW5nKCl9IGFuZCAke21heC50b1N0cmluZygpfWAsXG4gICAgYHJlY29yZFsnJHtmaWVsZE5hbWV9J10gPj0gJHtnZXRTdGF0aWNWYWx1ZShtaW4pfSAgYCxcbiAgKSxcbn0pO1xuXG5leHBvcnQgY29uc3QgYWRkUmVjb3JkVmFsaWRhdGlvblJ1bGUgPSByZWNvcmROb2RlID0+IHJ1bGUgPT4gcmVjb3JkTm9kZS52YWxpZGF0aW9uUnVsZXMucHVzaChydWxlKTtcbiIsIlxuZXhwb3J0IGNvbnN0IGNyZWF0ZVRyaWdnZXIgPSAoKSA9PiAoe1xuICBhY3Rpb25OYW1lOiAnJyxcbiAgZXZlbnROYW1lOiAnJyxcbiAgLy8gZnVuY3Rpb24sIGhhcyBhY2Nlc3MgdG8gZXZlbnQgY29udGV4dCxcbiAgLy8gcmV0dXJucyBvYmplY3QgdGhhdCBpcyB1c2VkIGFzIHBhcmFtZXRlciB0byBhY3Rpb25cbiAgLy8gb25seSB1c2VkIGlmIHRyaWdnZXJlZCBieSBldmVudFxuICBvcHRpb25zQ3JlYXRvcjogJycsXG4gIC8vIGFjdGlvbiBydW5zIGlmIHRydWUsXG4gIC8vIGhhcyBhY2Nlc3MgdG8gZXZlbnQgY29udGV4dFxuICBjb25kaXRpb246ICcnLFxufSk7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVBY3Rpb24gPSAoKSA9PiAoe1xuICBuYW1lOiAnJyxcbiAgYmVoYXZpb3VyU291cmNlOiAnJyxcbiAgLy8gbmFtZSBvZiBmdW5jdGlvbiBpbiBhY3Rpb25Tb3VyY2VcbiAgYmVoYXZpb3VyTmFtZTogJycsXG4gIC8vIHBhcmFtZXRlciBwYXNzZWQgaW50byBiZWhhdmlvdXIuXG4gIC8vIGFueSBvdGhlciBwYXJtcyBwYXNzZWQgYXQgcnVudGltZSBlLmcuXG4gIC8vIGJ5IHRyaWdnZXIsIG9yIG1hbnVhbGx5LCB3aWxsIGJlIG1lcmdlZCBpbnRvIHRoaXNcbiAgaW5pdGlhbE9wdGlvbnM6IHt9LFxufSk7XG4iLCJpbXBvcnQgeyBmbGF0dGVuLCBtYXAsIGlzRW1wdHkgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgY29tcGlsZUNvZGUgfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XG5pbXBvcnQge1xuICBpc05vbkVtcHR5U3RyaW5nLCBcbiAgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uLCAkLCBcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGFwcGx5UnVsZVNldCwgbWFrZXJ1bGUgfSBmcm9tICcuLi9jb21tb24vdmFsaWRhdGlvbkNvbW1vbic7XG5cbmNvbnN0IGFnZ3JlZ2F0ZVJ1bGVzID0gW1xuICBtYWtlcnVsZSgnbmFtZScsICdjaG9vc2UgYSBuYW1lIGZvciB0aGUgYWdncmVnYXRlJyxcbiAgICBhID0+IGlzTm9uRW1wdHlTdHJpbmcoYS5uYW1lKSksXG4gIG1ha2VydWxlKCdhZ2dyZWdhdGVkVmFsdWUnLCAnYWdncmVnYXRlZFZhbHVlIGRvZXMgbm90IGNvbXBpbGUnLFxuICAgIGEgPT4gaXNFbXB0eShhLmFnZ3JlZ2F0ZWRWYWx1ZSlcbiAgICAgICAgICAgIHx8IGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbihcbiAgICAgICAgICAgICAgKCkgPT4gY29tcGlsZUNvZGUoYS5hZ2dyZWdhdGVkVmFsdWUpLFxuICAgICAgICAgICAgKSksXG5dO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBZ2dyZWdhdGUgPSBhZ2dyZWdhdGUgPT4gYXBwbHlSdWxlU2V0KGFnZ3JlZ2F0ZVJ1bGVzKShhZ2dyZWdhdGUpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBbGxBZ2dyZWdhdGVzID0gYWxsID0+ICQoYWxsLCBbXG4gIG1hcCh2YWxpZGF0ZUFnZ3JlZ2F0ZSksXG4gIGZsYXR0ZW4sXG5dKTtcbiIsImltcG9ydCB7XG4gIGZpbHRlciwgdW5pb24sIGNvbnN0YW50LFxuICBtYXAsIGZsYXR0ZW4sIGV2ZXJ5LCB1bmlxQnksXG4gIHNvbWUsIGluY2x1ZGVzLCBpc0VtcHR5LCBoYXNcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCB7XG4gICQsIGlzU29tZXRoaW5nLCBzd2l0Y2hDYXNlLFxuICBhbnlUcnVlLCBpc05vbkVtcHR5QXJyYXksIGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbixcbiAgaXNOb25FbXB0eVN0cmluZywgZGVmYXVsdENhc2UsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBpc1JlY29yZCwgaXNSb290LCBpc2FnZ3JlZ2F0ZUdyb3VwLFxuICBpc0luZGV4LCBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG59IGZyb20gJy4vaGllcmFyY2h5JztcbmltcG9ydCB7IGV2ZW50c0xpc3QgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcbmltcG9ydCB7IHZhbGlkYXRlQWxsRmllbGRzIH0gZnJvbSAnLi9maWVsZHMnO1xuaW1wb3J0IHtcbiAgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSwgc3RyaW5nTm90RW1wdHksXG4gIHZhbGlkYXRpb25FcnJvcixcbn0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHsgaW5kZXhSdWxlU2V0IH0gZnJvbSAnLi9pbmRleGVzJztcbmltcG9ydCB7IHZhbGlkYXRlQWxsQWdncmVnYXRlcyB9IGZyb20gJy4vdmFsaWRhdGVBZ2dyZWdhdGUnO1xuXG5leHBvcnQgY29uc3QgcnVsZVNldCA9ICguLi5zZXRzKSA9PiBjb25zdGFudChmbGF0dGVuKFsuLi5zZXRzXSkpO1xuXG5jb25zdCBjb21tb25SdWxlcyA9IFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnbm9kZSBuYW1lIGlzIG5vdCBzZXQnLFxuICAgIG5vZGUgPT4gc3RyaW5nTm90RW1wdHkobm9kZS5uYW1lKSksXG4gIG1ha2VydWxlKCd0eXBlJywgJ25vZGUgdHlwZSBub3QgcmVjb2duaXNlZCcsXG4gICAgYW55VHJ1ZShpc1JlY29yZCwgaXNSb290LCBpc0luZGV4LCBpc2FnZ3JlZ2F0ZUdyb3VwKSksXG5dO1xuXG5jb25zdCByZWNvcmRSdWxlcyA9IFtcbiAgbWFrZXJ1bGUoJ2ZpZWxkcycsICdubyBmaWVsZHMgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSByZWNvcmQnLFxuICAgIG5vZGUgPT4gaXNOb25FbXB0eUFycmF5KG5vZGUuZmllbGRzKSksXG4gIG1ha2VydWxlKCd2YWxpZGF0aW9uUnVsZXMnLCBcInZhbGlkYXRpb24gcnVsZSBpcyBtaXNzaW5nIGEgJ21lc3NhZ2VXaGVuVmFsaWQnIG1lbWJlclwiLFxuICAgIG5vZGUgPT4gZXZlcnkociA9PiBoYXMoJ21lc3NhZ2VXaGVuSW52YWxpZCcpKHIpKShub2RlLnZhbGlkYXRpb25SdWxlcykpLFxuICBtYWtlcnVsZSgndmFsaWRhdGlvblJ1bGVzJywgXCJ2YWxpZGF0aW9uIHJ1bGUgaXMgbWlzc2luZyBhICdleHByZXNzaW9uV2hlblZhbGlkJyBtZW1iZXJcIixcbiAgICBub2RlID0+IGV2ZXJ5KHIgPT4gaGFzKCdleHByZXNzaW9uV2hlblZhbGlkJykocikpKG5vZGUudmFsaWRhdGlvblJ1bGVzKSksXG5dO1xuXG5cbmNvbnN0IGFnZ3JlZ2F0ZUdyb3VwUnVsZXMgPSBbXG4gIG1ha2VydWxlKCdjb25kaXRpb24nLCAnY29uZGl0aW9uIGRvZXMgbm90IGNvbXBpbGUnLFxuICAgIGEgPT4gaXNFbXB0eShhLmNvbmRpdGlvbilcbiAgICAgICAgICAgICB8fCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24oXG4gICAgICAgICAgICAgICAoKSA9PiBjb21waWxlRXhwcmVzc2lvbihhLmNvbmRpdGlvbiksXG4gICAgICAgICAgICAgKSksXG5dO1xuXG5jb25zdCBnZXRSdWxlU2V0ID0gbm9kZSA9PiBzd2l0Y2hDYXNlKFxuXG4gIFtpc1JlY29yZCwgcnVsZVNldChcbiAgICBjb21tb25SdWxlcyxcbiAgICByZWNvcmRSdWxlcyxcbiAgKV0sXG5cbiAgW2lzSW5kZXgsIHJ1bGVTZXQoXG4gICAgY29tbW9uUnVsZXMsXG4gICAgaW5kZXhSdWxlU2V0LFxuICApXSxcblxuICBbaXNhZ2dyZWdhdGVHcm91cCwgcnVsZVNldChcbiAgICBjb21tb25SdWxlcyxcbiAgICBhZ2dyZWdhdGVHcm91cFJ1bGVzLFxuICApXSxcblxuICBbZGVmYXVsdENhc2UsIHJ1bGVTZXQoY29tbW9uUnVsZXMsIFtdKV0sXG4pKG5vZGUpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVOb2RlID0gbm9kZSA9PiBhcHBseVJ1bGVTZXQoZ2V0UnVsZVNldChub2RlKSkobm9kZSk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFsbCA9IChhcHBIaWVyYXJjaHkpID0+IHtcbiAgY29uc3QgZmxhdHRlbmVkID0gZ2V0RmxhdHRlbmVkSGllcmFyY2h5KFxuICAgIGFwcEhpZXJhcmNoeSxcbiAgKTtcblxuICBjb25zdCBkdXBsaWNhdGVOYW1lUnVsZSA9IG1ha2VydWxlKFxuICAgICduYW1lJywgJ25vZGUgbmFtZXMgbXVzdCBiZSB1bmlxdWUgdW5kZXIgc2hhcmVkIHBhcmVudCcsXG4gICAgbiA9PiBmaWx0ZXIoZiA9PiBmLnBhcmVudCgpID09PSBuLnBhcmVudCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICYmIGYubmFtZSA9PT0gbi5uYW1lKShmbGF0dGVuZWQpLmxlbmd0aCA9PT0gMSxcbiAgKTtcblxuICBjb25zdCBkdXBsaWNhdGVOb2RlS2V5RXJyb3JzID0gJChmbGF0dGVuZWQsIFtcbiAgICBtYXAobiA9PiBhcHBseVJ1bGVTZXQoW2R1cGxpY2F0ZU5hbWVSdWxlXSkobikpLFxuICAgIGZpbHRlcihpc1NvbWV0aGluZyksXG4gICAgZmxhdHRlbixcbiAgXSk7XG5cbiAgY29uc3QgZmllbGRFcnJvcnMgPSAkKGZsYXR0ZW5lZCwgW1xuICAgIGZpbHRlcihpc1JlY29yZCksXG4gICAgbWFwKHZhbGlkYXRlQWxsRmllbGRzKSxcbiAgICBmbGF0dGVuLFxuICBdKTtcblxuICBjb25zdCBhZ2dyZWdhdGVFcnJvcnMgPSAkKGZsYXR0ZW5lZCwgW1xuICAgIGZpbHRlcihpc2FnZ3JlZ2F0ZUdyb3VwKSxcbiAgICBtYXAocyA9PiB2YWxpZGF0ZUFsbEFnZ3JlZ2F0ZXMoXG4gICAgICBzLmFnZ3JlZ2F0ZXMsXG4gICAgKSksXG4gICAgZmxhdHRlbixcbiAgXSk7XG5cbiAgcmV0dXJuICQoZmxhdHRlbmVkLCBbXG4gICAgbWFwKHZhbGlkYXRlTm9kZSksXG4gICAgZmxhdHRlbixcbiAgICB1bmlvbihkdXBsaWNhdGVOb2RlS2V5RXJyb3JzKSxcbiAgICB1bmlvbihmaWVsZEVycm9ycyksXG4gICAgdW5pb24oYWdncmVnYXRlRXJyb3JzKSxcbiAgXSk7XG59O1xuXG5jb25zdCBhY3Rpb25SdWxlcyA9IFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnYWN0aW9uIG11c3QgaGF2ZSBhIG5hbWUnLFxuICAgIGEgPT4gaXNOb25FbXB0eVN0cmluZyhhLm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2JlaGF2aW91ck5hbWUnLCAnbXVzdCBzdXBwbHkgYSBiZWhhdmlvdXIgbmFtZSB0byB0aGUgYWN0aW9uJyxcbiAgICBhID0+IGlzTm9uRW1wdHlTdHJpbmcoYS5iZWhhdmlvdXJOYW1lKSksXG4gIG1ha2VydWxlKCdiZWhhdmlvdXJTb3VyY2UnLCAnbXVzdCBzdXBwbHkgYSBiZWhhdmlvdXIgc291cmNlIGZvciB0aGUgYWN0aW9uJyxcbiAgICBhID0+IGlzTm9uRW1wdHlTdHJpbmcoYS5iZWhhdmlvdXJTb3VyY2UpKSxcbl07XG5cbmNvbnN0IGR1cGxpY2F0ZUFjdGlvblJ1bGUgPSBtYWtlcnVsZSgnJywgJ2FjdGlvbiBuYW1lIG11c3QgYmUgdW5pcXVlJywgKCkgPT4ge30pO1xuXG5jb25zdCB2YWxpZGF0ZUFjdGlvbiA9IGFjdGlvbiA9PiBhcHBseVJ1bGVTZXQoYWN0aW9uUnVsZXMpKGFjdGlvbik7XG5cblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWN0aW9ucyA9IChhbGxBY3Rpb25zKSA9PiB7XG4gIGNvbnN0IGR1cGxpY2F0ZUFjdGlvbnMgPSAkKGFsbEFjdGlvbnMsIFtcbiAgICBmaWx0ZXIoYSA9PiBmaWx0ZXIoYTIgPT4gYTIubmFtZSA9PT0gYS5uYW1lKShhbGxBY3Rpb25zKS5sZW5ndGggPiAxKSxcbiAgICBtYXAoYSA9PiB2YWxpZGF0aW9uRXJyb3IoZHVwbGljYXRlQWN0aW9uUnVsZSwgYSkpLFxuICBdKTtcblxuICBjb25zdCBlcnJvcnMgPSAkKGFsbEFjdGlvbnMsIFtcbiAgICBtYXAodmFsaWRhdGVBY3Rpb24pLFxuICAgIGZsYXR0ZW4sXG4gICAgdW5pb24oZHVwbGljYXRlQWN0aW9ucyksXG4gICAgdW5pcUJ5KCduYW1lJyksXG4gIF0pO1xuXG4gIHJldHVybiBlcnJvcnM7XG59O1xuXG5jb25zdCB0cmlnZ2VyUnVsZXMgPSBhY3Rpb25zID0+IChbXG4gIG1ha2VydWxlKCdhY3Rpb25OYW1lJywgJ211c3Qgc3BlY2lmeSBhbiBhY3Rpb24nLFxuICAgIHQgPT4gaXNOb25FbXB0eVN0cmluZyh0LmFjdGlvbk5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2V2ZW50TmFtZScsICdtdXN0IHNwZWNpZnkgYW5kIGV2ZW50JyxcbiAgICB0ID0+IGlzTm9uRW1wdHlTdHJpbmcodC5ldmVudE5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2FjdGlvbk5hbWUnLCAnc3BlY2lmaWVkIGFjdGlvbiBub3Qgc3VwcGxpZWQnLFxuICAgIHQgPT4gIXQuYWN0aW9uTmFtZVxuICAgICAgICAgICAgIHx8IHNvbWUoYSA9PiBhLm5hbWUgPT09IHQuYWN0aW9uTmFtZSkoYWN0aW9ucykpLFxuICBtYWtlcnVsZSgnZXZlbnROYW1lJywgJ2ludmFsaWQgRXZlbnQgTmFtZScsXG4gICAgdCA9PiAhdC5ldmVudE5hbWVcbiAgICAgICAgICAgICB8fCBpbmNsdWRlcyh0LmV2ZW50TmFtZSkoZXZlbnRzTGlzdCkpLFxuICBtYWtlcnVsZSgnb3B0aW9uc0NyZWF0b3InLCAnT3B0aW9ucyBDcmVhdG9yIGRvZXMgbm90IGNvbXBpbGUgLSBjaGVjayB5b3VyIGV4cHJlc3Npb24nLFxuICAgICh0KSA9PiB7XG4gICAgICBpZiAoIXQub3B0aW9uc0NyZWF0b3IpIHJldHVybiB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29tcGlsZUNvZGUodC5vcHRpb25zQ3JlYXRvcik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoXykgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9KSxcbiAgbWFrZXJ1bGUoJ2NvbmRpdGlvbicsICdUcmlnZ2VyIGNvbmRpdGlvbiBkb2VzIG5vdCBjb21waWxlIC0gY2hlY2sgeW91ciBleHByZXNzaW9uJyxcbiAgICAodCkgPT4ge1xuICAgICAgaWYgKCF0LmNvbmRpdGlvbikgcmV0dXJuIHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICBjb21waWxlRXhwcmVzc2lvbih0LmNvbmRpdGlvbik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoXykgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9KSxcbl0pO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVUcmlnZ2VyID0gKHRyaWdnZXIsIGFsbEFjdGlvbnMpID0+IHtcbiAgY29uc3QgZXJyb3JzID0gYXBwbHlSdWxlU2V0KHRyaWdnZXJSdWxlcyhhbGxBY3Rpb25zKSkodHJpZ2dlcik7XG5cbiAgcmV0dXJuIGVycm9ycztcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVRyaWdnZXJzID0gKHRyaWdnZXJzLCBhbGxBY3Rpb25zKSA9PiAkKHRyaWdnZXJzLCBbXG4gIG1hcCh0ID0+IHZhbGlkYXRlVHJpZ2dlcih0LCBhbGxBY3Rpb25zKSksXG4gIGZsYXR0ZW4sXG5dKTtcbiIsImltcG9ydCB7IGFwcERlZmluaXRpb25GaWxlIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGNvbnN0cnVjdEhpZXJhcmNoeSB9IGZyb20gJy4vY3JlYXRlTm9kZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uID0gZGF0YXN0b3JlID0+IGFzeW5jICgpID0+IHtcbiAgY29uc3QgZXhpc3RzID0gYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhhcHBEZWZpbml0aW9uRmlsZSk7XG5cbiAgaWYgKCFleGlzdHMpIHRocm93IG5ldyBFcnJvcignQXBwbGljYXRpb24gZGVmaW5pdGlvbiBkb2VzIG5vdCBleGlzdCcpO1xuXG4gIGNvbnN0IGFwcERlZmluaXRpb24gPSBhd2FpdCBkYXRhc3RvcmUubG9hZEpzb24oYXBwRGVmaW5pdGlvbkZpbGUpO1xuICBhcHBEZWZpbml0aW9uLmhpZXJhcmNoeSA9IGNvbnN0cnVjdEhpZXJhcmNoeShcbiAgICBhcHBEZWZpbml0aW9uLmhpZXJhcmNoeSxcbiAgKTtcbiAgcmV0dXJuIGFwcERlZmluaXRpb247XG59O1xuIiwiaW1wb3J0IHsgam9pbiB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBhcHBEZWZpbml0aW9uRmlsZSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyB2YWxpZGF0ZUFsbCB9IGZyb20gJy4vdmFsaWRhdGUnO1xuaW1wb3J0IHsgYXBpV3JhcHBlciB9IGZyb20gJy4uL2NvbW1vbi9hcGlXcmFwcGVyJztcbmltcG9ydCB7IGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xuXG5leHBvcnQgY29uc3Qgc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5ID0gYXBwID0+IGFzeW5jIGhpZXJhcmNoeSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy50ZW1wbGF0ZUFwaS5zYXZlQXBwbGljYXRpb25IaWVyYXJjaHksXG4gIHBlcm1pc3Npb24ud3JpdGVUZW1wbGF0ZXMuaXNBdXRob3JpemVkLFxuICB7IGhpZXJhcmNoeSB9LFxuICBfc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlLCBoaWVyYXJjaHksXG4pO1xuXG5cbmV4cG9ydCBjb25zdCBfc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5ID0gYXN5bmMgKGRhdGFzdG9yZSwgaGllcmFyY2h5KSA9PiB7XG4gIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSBhd2FpdCB2YWxpZGF0ZUFsbChoaWVyYXJjaHkpO1xuICBpZiAodmFsaWRhdGlvbkVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBIaWVyYXJjaHkgaXMgaW52YWxpZDogJHtqb2luKFxuICAgICAgdmFsaWRhdGlvbkVycm9ycy5tYXAoZSA9PiBgJHtlLml0ZW0ubm9kZUtleSA/IGUuaXRlbS5ub2RlS2V5KCkgOiAnJ30gOiAke2UuZXJyb3J9YCksXG4gICAgICAnLCcsXG4gICAgKX1gKTtcbiAgfVxuXG4gIGlmIChhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGFwcERlZmluaXRpb25GaWxlKSkge1xuICAgIGNvbnN0IGFwcERlZmluaXRpb24gPSBhd2FpdCBkYXRhc3RvcmUubG9hZEpzb24oYXBwRGVmaW5pdGlvbkZpbGUpO1xuICAgIGFwcERlZmluaXRpb24uaGllcmFyY2h5ID0gaGllcmFyY2h5O1xuICAgIGF3YWl0IGRhdGFzdG9yZS51cGRhdGVKc29uKGFwcERlZmluaXRpb25GaWxlLCBhcHBEZWZpbml0aW9uKTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKCcvLmNvbmZpZycpO1xuICAgIGNvbnN0IGFwcERlZmluaXRpb24gPSB7IGFjdGlvbnM6IFtdLCB0cmlnZ2VyczogW10sIGhpZXJhcmNoeSB9O1xuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKGFwcERlZmluaXRpb25GaWxlLCBhcHBEZWZpbml0aW9uKTtcbiAgfVxufTtcbiIsImltcG9ydCB7IGpvaW4gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGFwcERlZmluaXRpb25GaWxlIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHZhbGlkYXRlVHJpZ2dlcnMsIHZhbGlkYXRlQWN0aW9ucyB9IGZyb20gJy4vdmFsaWRhdGUnO1xuaW1wb3J0IHsgYXBpV3JhcHBlciB9IGZyb20gJy4uL2NvbW1vbi9hcGlXcmFwcGVyJztcbmltcG9ydCB7IGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBzYXZlQWN0aW9uc0FuZFRyaWdnZXJzID0gYXBwID0+IGFzeW5jIChhY3Rpb25zLCB0cmlnZ2VycykgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMudGVtcGxhdGVBcGkuc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycyxcbiAgcGVybWlzc2lvbi53cml0ZVRlbXBsYXRlcy5pc0F1dGhvcml6ZWQsXG4gIHsgYWN0aW9ucywgdHJpZ2dlcnMgfSxcbiAgX3NhdmVBY3Rpb25zQW5kVHJpZ2dlcnMsIGFwcC5kYXRhc3RvcmUsIGFjdGlvbnMsIHRyaWdnZXJzLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9zYXZlQWN0aW9uc0FuZFRyaWdnZXJzID0gYXN5bmMgKGRhdGFzdG9yZSwgYWN0aW9ucywgdHJpZ2dlcnMpID0+IHtcbiAgaWYgKGF3YWl0IGRhdGFzdG9yZS5leGlzdHMoYXBwRGVmaW5pdGlvbkZpbGUpKSB7XG4gICAgY29uc3QgYXBwRGVmaW5pdGlvbiA9IGF3YWl0IGRhdGFzdG9yZS5sb2FkSnNvbihhcHBEZWZpbml0aW9uRmlsZSk7XG4gICAgYXBwRGVmaW5pdGlvbi5hY3Rpb25zID0gYWN0aW9ucztcbiAgICBhcHBEZWZpbml0aW9uLnRyaWdnZXJzID0gdHJpZ2dlcnM7XG5cbiAgICBjb25zdCBhY3Rpb25WYWxpZEVycnMgPSBtYXAoZSA9PiBlLmVycm9yKSh2YWxpZGF0ZUFjdGlvbnMoYWN0aW9ucykpO1xuXG4gICAgaWYgKGFjdGlvblZhbGlkRXJycy5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBBY3Rpb25zIGFyZSBpbnZhbGlkOiAke2pvaW4oYWN0aW9uVmFsaWRFcnJzLCAnLCAnKX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCB0cmlnZ2VyVmFsaWRFcnJzID0gbWFwKGUgPT4gZS5lcnJvcikodmFsaWRhdGVUcmlnZ2Vycyh0cmlnZ2VycywgYWN0aW9ucykpO1xuXG4gICAgaWYgKHRyaWdnZXJWYWxpZEVycnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgVHJpZ2dlcnMgYXJlIGludmFsaWQ6ICR7am9pbih0cmlnZ2VyVmFsaWRFcnJzLCAnLCAnKX1gKTtcbiAgICB9XG5cbiAgICBhd2FpdCBkYXRhc3RvcmUudXBkYXRlSnNvbihhcHBEZWZpbml0aW9uRmlsZSwgYXBwRGVmaW5pdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignQ2Fubm90IHNhdmUgYWN0aW9uczogQXBwbGljYXRpb24gZGVmaW5pdGlvbiBkb2VzIG5vdCBleGlzdCcpO1xuICB9XG59O1xuIiwiXG5leHBvcnQgY29uc3QgZ2V0QmVoYXZpb3VyU291cmNlcyA9IGFzeW5jIChkYXRhc3RvcmUpID0+IHtcbiAgICBhd2FpdCBkYXRhc3RvcmUubG9hZEZpbGUoJy8uY29uZmlnL2JlaGF2aW91clNvdXJjZXMuanMnKTtcbn07XG4iLCJpbXBvcnQge1xuICBnZXROZXdSb290TGV2ZWwsXG4gIGdldE5ld1JlY29yZFRlbXBsYXRlLCBnZXROZXdJbmRleFRlbXBsYXRlLFxuICBjcmVhdGVOb2RlRXJyb3JzLCBjb25zdHJ1Y3RIaWVyYXJjaHksXG4gIGdldE5ld0FnZ3JlZ2F0ZUdyb3VwVGVtcGxhdGUsIGdldE5ld1NpbmdsZVJlY29yZFRlbXBsYXRlLFxuICBnZXROZXdBZ2dyZWdhdGVUZW1wbGF0ZSwgY29uc3RydWN0Tm9kZSxcbn1cbiAgZnJvbSAnLi9jcmVhdGVOb2Rlcyc7XG5pbXBvcnQge1xuICBnZXROZXdGaWVsZCwgdmFsaWRhdGVGaWVsZCxcbiAgYWRkRmllbGQsIGZpZWxkRXJyb3JzLFxufSBmcm9tICcuL2ZpZWxkcyc7XG5pbXBvcnQge1xuICBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZSwgY29tbW9uUmVjb3JkVmFsaWRhdGlvblJ1bGVzLFxuICBhZGRSZWNvcmRWYWxpZGF0aW9uUnVsZSxcbn0gZnJvbSAnLi9yZWNvcmRWYWxpZGF0aW9uUnVsZXMnO1xuaW1wb3J0IHsgY3JlYXRlQWN0aW9uLCBjcmVhdGVUcmlnZ2VyIH0gZnJvbSAnLi9jcmVhdGVBY3Rpb25zJztcbmltcG9ydCB7XG4gIHZhbGlkYXRlVHJpZ2dlcnMsIHZhbGlkYXRlVHJpZ2dlciwgdmFsaWRhdGVOb2RlLFxuICB2YWxpZGF0ZUFjdGlvbnMsIHZhbGlkYXRlQWxsLFxufSBmcm9tICcuL3ZhbGlkYXRlJztcbmltcG9ydCB7IGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbiB9IGZyb20gJy4vZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uJztcbmltcG9ydCB7IHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSB9IGZyb20gJy4vc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5JztcbmltcG9ydCB7IHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnMgfSBmcm9tICcuL3NhdmVBY3Rpb25zQW5kVHJpZ2dlcnMnO1xuaW1wb3J0IHsgYWxsIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZ2V0QmVoYXZpb3VyU291cmNlcyB9IGZyb20gXCIuL2dldEJlaGF2aW91clNvdXJjZXNcIjtcblxuY29uc3QgYXBpID0gYXBwID0+ICh7XG5cbiAgZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uOiBnZXRBcHBsaWNhdGlvbkRlZmluaXRpb24oYXBwLmRhdGFzdG9yZSksXG4gIHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeTogc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5KGFwcCksXG4gIHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnM6IHNhdmVBY3Rpb25zQW5kVHJpZ2dlcnMoYXBwKSxcbiAgZ2V0QmVoYXZpb3VyU291cmNlczogKCkgPT4gZ2V0QmVoYXZpb3VyU291cmNlcyhhcHAuZGF0YXN0b3JlKSxcbiAgZ2V0TmV3Um9vdExldmVsLFxuICBjb25zdHJ1Y3ROb2RlLFxuICBnZXROZXdJbmRleFRlbXBsYXRlLFxuICBnZXROZXdSZWNvcmRUZW1wbGF0ZSxcbiAgZ2V0TmV3RmllbGQsXG4gIHZhbGlkYXRlRmllbGQsXG4gIGFkZEZpZWxkLFxuICBmaWVsZEVycm9ycyxcbiAgZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUsXG4gIGNvbW1vblJlY29yZFZhbGlkYXRpb25SdWxlcyxcbiAgYWRkUmVjb3JkVmFsaWRhdGlvblJ1bGUsXG4gIGNyZWF0ZUFjdGlvbixcbiAgY3JlYXRlVHJpZ2dlcixcbiAgdmFsaWRhdGVBY3Rpb25zLFxuICB2YWxpZGF0ZVRyaWdnZXIsXG4gIGdldE5ld0FnZ3JlZ2F0ZUdyb3VwVGVtcGxhdGUsXG4gIGdldE5ld0FnZ3JlZ2F0ZVRlbXBsYXRlLFxuICBjb25zdHJ1Y3RIaWVyYXJjaHksXG4gIGdldE5ld1NpbmdsZVJlY29yZFRlbXBsYXRlLFxuICBhbGxUeXBlczogYWxsLFxuICB2YWxpZGF0ZU5vZGUsXG4gIHZhbGlkYXRlQWxsLFxuICB2YWxpZGF0ZVRyaWdnZXJzLFxufSk7XG5cblxuZXhwb3J0IGNvbnN0IGdldFRlbXBsYXRlQXBpID0gYXBwID0+IGFwaShhcHApO1xuXG5leHBvcnQgY29uc3QgZXJyb3JzID0gY3JlYXRlTm9kZUVycm9ycztcblxuZXhwb3J0IGRlZmF1bHQgZ2V0VGVtcGxhdGVBcGk7XG4iLCJpbXBvcnQgeyBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgVVNFUlNfTElTVF9GSUxFLFxuICBzdHJpcFVzZXJPZlNlbnNpdGl2ZVN0dWZmLFxufSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgJCwgYXBpV3JhcHBlciwgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGdldFVzZXJzID0gYXBwID0+IGFzeW5jICgpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuZ2V0VXNlcnMsXG4gIHBlcm1pc3Npb24ubGlzdFVzZXJzLmlzQXV0aG9yaXplZCxcbiAge30sXG4gIF9nZXRVc2VycywgYXBwLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9nZXRVc2VycyA9IGFzeW5jIGFwcCA9PiAkKGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oVVNFUlNfTElTVF9GSUxFKSwgW1xuICBtYXAoc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZiksXG5dKTtcbiIsImltcG9ydCB7IEFDQ0VTU19MRVZFTFNfRklMRSB9IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyBhcGlXcmFwcGVyLCBldmVudHMgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgbG9hZEFjY2Vzc0xldmVscyA9IGFwcCA9PiBhc3luYyAoKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmxvYWRBY2Nlc3NMZXZlbHMsXG4gIHBlcm1pc3Npb24ubGlzdEFjY2Vzc0xldmVscy5pc0F1dGhvcml6ZWQsXG4gIHt9LFxuICBfbG9hZEFjY2Vzc0xldmVscywgYXBwLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9sb2FkQWNjZXNzTGV2ZWxzID0gYXN5bmMgYXBwID0+IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oQUNDRVNTX0xFVkVMU19GSUxFKTtcbiIsImltcG9ydCB7XG4gIGZpbmQsIGZpbHRlciwgc29tZSxcbiAgbWFwLCBmbGF0dGVuLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcbmltcG9ydCB7IF9nZXRVc2VycyB9IGZyb20gJy4vZ2V0VXNlcnMnO1xuaW1wb3J0IHtcbiAgZ2V0VXNlckJ5TmFtZSwgdXNlckF1dGhGaWxlLFxuICBwYXJzZVRlbXBvcmFyeUNvZGUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyBfbG9hZEFjY2Vzc0xldmVscyB9IGZyb20gJy4vbG9hZEFjY2Vzc0xldmVscyc7XG5pbXBvcnQge1xuICBpc05vdGhpbmdPckVtcHR5LCAkLCBhcGlXcmFwcGVyLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmNvbnN0IGR1bW15SGFzaCA9ICckYXJnb24yaSR2PTE5JG09NDA5Nix0PTMscD0xJFVaUm80MDlVWUJHakhKUzNDVjZVeHckclU4NHFVcVBlT1JGektZbVlZMGNlQkxEYVBPK0pXU0g0UGZOaUtYZklLayc7XG5cbmV4cG9ydCBjb25zdCBhdXRoZW50aWNhdGUgPSBhcHAgPT4gYXN5bmMgKHVzZXJuYW1lLCBwYXNzd29yZCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5hdXRoZW50aWNhdGUsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0sXG4gIF9hdXRoZW50aWNhdGUsIGFwcCwgdXNlcm5hbWUsIHBhc3N3b3JkLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9hdXRoZW50aWNhdGUgPSBhc3luYyAoYXBwLCB1c2VybmFtZSwgcGFzc3dvcmQpID0+IHtcbiAgaWYgKGlzTm90aGluZ09yRW1wdHkodXNlcm5hbWUpIHx8IGlzTm90aGluZ09yRW1wdHkocGFzc3dvcmQpKSB7IHJldHVybiBudWxsOyB9XG5cbiAgY29uc3QgYWxsVXNlcnMgPSBhd2FpdCBfZ2V0VXNlcnMoYXBwKTtcbiAgbGV0IHVzZXIgPSBnZXRVc2VyQnlOYW1lKFxuICAgIGFsbFVzZXJzLFxuICAgIHVzZXJuYW1lLFxuICApO1xuXG4gIGNvbnN0IG5vdEFVc2VyID0gJ25vdC1hLXVzZXInO1xuICAvLyBjb250aW51ZSB3aXRoIG5vbi11c2VyIC0gc28gdGltZSB0byB2ZXJpZnkgcmVtYWlucyBjb25zaXN0ZW50XG4gIC8vIHdpdGggdmVyaWZpY2F0aW9uIG9mIGEgdmFsaWQgdXNlclxuICBpZiAoIXVzZXIgfHwgIXVzZXIuZW5hYmxlZCkgeyB1c2VyID0gbm90QVVzZXI7IH1cblxuICBsZXQgdXNlckF1dGg7XG4gIHRyeSB7XG4gICAgdXNlckF1dGggPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgICAgdXNlckF1dGhGaWxlKHVzZXJuYW1lKSxcbiAgICApO1xuICB9IGNhdGNoIChfKSB7XG4gICAgdXNlckF1dGggPSB7IGFjY2Vzc0xldmVsczogW10sIHBhc3N3b3JkSGFzaDogZHVtbXlIYXNoIH07XG4gIH1cblxuICBjb25zdCBwZXJtaXNzaW9ucyA9IGF3YWl0IGJ1aWxkVXNlclBlcm1pc3Npb25zKGFwcCwgdXNlci5hY2Nlc3NMZXZlbHMpO1xuXG4gIGNvbnN0IHZlcmlmaWVkID0gYXdhaXQgYXBwLmNyeXB0by52ZXJpZnkoXG4gICAgdXNlckF1dGgucGFzc3dvcmRIYXNoLFxuICAgIHBhc3N3b3JkLFxuICApO1xuXG4gIGlmICh1c2VyID09PSBub3RBVXNlcikgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHJldHVybiB2ZXJpZmllZFxuICAgID8ge1xuICAgICAgLi4udXNlciwgcGVybWlzc2lvbnMsIHRlbXA6IGZhbHNlLCBpc1VzZXI6IHRydWUsXG4gICAgfVxuICAgIDogbnVsbDtcbn07XG5cbmV4cG9ydCBjb25zdCBhdXRoZW50aWNhdGVUZW1wb3JhcnlBY2Nlc3MgPSBhcHAgPT4gYXN5bmMgKHRlbXBBY2Nlc3NDb2RlKSA9PiB7XG4gIGlmIChpc05vdGhpbmdPckVtcHR5KHRlbXBBY2Nlc3NDb2RlKSkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIGNvbnN0IHRlbXAgPSBwYXJzZVRlbXBvcmFyeUNvZGUodGVtcEFjY2Vzc0NvZGUpO1xuICBsZXQgdXNlciA9ICQoYXdhaXQgX2dldFVzZXJzKGFwcCksIFtcbiAgICBmaW5kKHUgPT4gdS50ZW1wb3JhcnlBY2Nlc3NJZCA9PT0gdGVtcC5pZCksXG4gIF0pO1xuXG4gIGNvbnN0IG5vdEFVc2VyID0gJ25vdC1hLXVzZXInO1xuICBpZiAoIXVzZXIgfHwgIXVzZXIuZW5hYmxlZCkgeyB1c2VyID0gbm90QVVzZXI7IH1cblxuICBsZXQgdXNlckF1dGg7XG4gIHRyeSB7XG4gICAgdXNlckF1dGggPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgICAgdXNlckF1dGhGaWxlKHVzZXIubmFtZSksXG4gICAgKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHVzZXJBdXRoID0ge1xuICAgICAgdGVtcG9yYXJ5QWNjZXNzSGFzaDogZHVtbXlIYXNoLFxuICAgICAgdGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2g6IChhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCkgKyAxMDAwMCksXG4gICAgfTtcbiAgfVxuXG4gIGlmICh1c2VyQXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA8IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKSkgeyB1c2VyID0gbm90QVVzZXI7IH1cblxuICBjb25zdCB0ZW1wQ29kZSA9ICF0ZW1wLmNvZGUgPyBnZW5lcmF0ZSgpIDogdGVtcC5jb2RlO1xuICBjb25zdCB2ZXJpZmllZCA9IGF3YWl0IGFwcC5jcnlwdG8udmVyaWZ5KFxuICAgIHVzZXJBdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2gsXG4gICAgdGVtcENvZGUsXG4gICk7XG5cbiAgaWYgKHVzZXIgPT09IG5vdEFVc2VyKSB7IHJldHVybiBudWxsOyB9XG5cbiAgcmV0dXJuIHZlcmlmaWVkXG4gICAgPyB7XG4gICAgICAuLi51c2VyLFxuICAgICAgcGVybWlzc2lvbnM6IFtdLFxuICAgICAgdGVtcDogdHJ1ZSxcbiAgICAgIGlzVXNlcjogdHJ1ZSxcbiAgICB9XG4gICAgOiBudWxsO1xufTtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkVXNlclBlcm1pc3Npb25zID0gYXN5bmMgKGFwcCwgdXNlckFjY2Vzc0xldmVscykgPT4ge1xuICBjb25zdCBhbGxBY2Nlc3NMZXZlbHMgPSBhd2FpdCBfbG9hZEFjY2Vzc0xldmVscyhhcHApO1xuXG4gIHJldHVybiAkKGFsbEFjY2Vzc0xldmVscy5sZXZlbHMsIFtcbiAgICBmaWx0ZXIobCA9PiBzb21lKHVhID0+IGwubmFtZSA9PT0gdWEpKHVzZXJBY2Nlc3NMZXZlbHMpKSxcbiAgICBtYXAobCA9PiBsLnBlcm1pc3Npb25zKSxcbiAgICBmbGF0dGVuLFxuICBdKTtcbn07XG4iLCJpbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHtcbiAgdGVtcENvZGVFeHBpcnlMZW5ndGgsIFVTRVJTX0xPQ0tfRklMRSxcbiAgVVNFUlNfTElTVF9GSUxFLCB1c2VyQXV0aEZpbGUsXG4gIGdldFVzZXJCeU5hbWUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQge1xuICBnZXRMb2NrLCBpc05vbG9jayxcbiAgcmVsZWFzZUxvY2ssXG59IGZyb20gJy4uL2NvbW1vbi9sb2NrJztcbmltcG9ydCB7IGFwaVdyYXBwZXIsIGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVUZW1wb3JhcnlBY2Nlc3MgPSBhcHAgPT4gYXN5bmMgdXNlck5hbWUgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5jcmVhdGVUZW1wb3JhcnlBY2Nlc3MsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgdXNlck5hbWUgfSxcbiAgX2NyZWF0ZVRlbXBvcmFyeUFjY2VzcywgYXBwLCB1c2VyTmFtZSxcbik7XG5cbmV4cG9ydCBjb25zdCBfY3JlYXRlVGVtcG9yYXJ5QWNjZXNzID0gYXN5bmMgKGFwcCwgdXNlck5hbWUpID0+IHtcbiAgY29uc3QgdGVtcENvZGUgPSBhd2FpdCBnZXRUZW1wb3JhcnlDb2RlKGFwcCk7XG5cbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldExvY2soXG4gICAgYXBwLCBVU0VSU19MT0NLX0ZJTEUsIDEwMDAsIDIsXG4gICk7XG5cbiAgaWYgKGlzTm9sb2NrKGxvY2spKSB7IHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGNyZWF0ZSB0ZW1wb3JhcnkgYWNjZXNzLCBjb3VsZCBub3QgZ2V0IGxvY2sgLSB0cnkgYWdhaW4nKTsgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSk7XG5cbiAgICBjb25zdCB1c2VyID0gZ2V0VXNlckJ5TmFtZSh1c2VycywgdXNlck5hbWUpO1xuICAgIHVzZXIudGVtcG9yYXJ5QWNjZXNzSWQgPSB0ZW1wQ29kZS50ZW1wb3JhcnlBY2Nlc3NJZDtcblxuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgICAgIFVTRVJTX0xJU1RfRklMRSxcbiAgICAgIHVzZXJzLFxuICAgICk7XG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcbiAgfVxuXG4gIGNvbnN0IHVzZXJBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICB1c2VyQXV0aEZpbGUodXNlck5hbWUpLFxuICApO1xuICB1c2VyQXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoID0gdGVtcENvZGUudGVtcG9yYXJ5QWNjZXNzSGFzaDtcblxuICB1c2VyQXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA9IHRlbXBDb2RlLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoO1xuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgICB1c2VyQXV0aEZpbGUodXNlck5hbWUpLFxuICAgIHVzZXJBdXRoLFxuICApO1xuXG4gIHJldHVybiB0ZW1wQ29kZS50ZW1wQ29kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRUZW1wb3JhcnlDb2RlID0gYXN5bmMgKGFwcCkgPT4ge1xuICBjb25zdCB0ZW1wQ29kZSA9IGdlbmVyYXRlKClcbiAgICAgICAgKyBnZW5lcmF0ZSgpXG4gICAgICAgICsgZ2VuZXJhdGUoKVxuICAgICAgICArIGdlbmVyYXRlKCk7XG5cbiAgY29uc3QgdGVtcElkID0gZ2VuZXJhdGUoKTtcblxuICByZXR1cm4ge1xuICAgIHRlbXBvcmFyeUFjY2Vzc0hhc2g6IGF3YWl0IGFwcC5jcnlwdG8uaGFzaChcbiAgICAgIHRlbXBDb2RlLFxuICAgICksXG4gICAgdGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2g6XG4gICAgICAgICAgICAoYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpKSArIHRlbXBDb2RlRXhwaXJ5TGVuZ3RoLFxuICAgIHRlbXBDb2RlOiBgdG1wOiR7dGVtcElkfToke3RlbXBDb2RlfWAsXG4gICAgdGVtcG9yYXJ5QWNjZXNzSWQ6IHRlbXBJZCxcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBsb29rc0xpa2VUZW1wb3JhcnlDb2RlID0gY29kZSA9PiBjb2RlLnN0YXJ0c1dpdGgoJ3RtcDonKTtcbiIsImltcG9ydCB7XG4gIG1hcCwgdW5pcVdpdGgsXG4gIGZsYXR0ZW4sIGZpbHRlcixcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGFwcGx5UnVsZVNldCwgbWFrZXJ1bGUgfSBmcm9tICcuLi9jb21tb24vdmFsaWRhdGlvbkNvbW1vbic7XG5pbXBvcnQge1xuICAkLCBpbnNlbnNpdGl2ZUVxdWFscywgYXBpV3JhcHBlciwgZXZlbnRzLFxuICBpc05vbkVtcHR5U3RyaW5nLCBhbGwsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmNvbnN0IHVzZXJSdWxlcyA9IGFsbFVzZXJzID0+IFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAndXNlcm5hbWUgbXVzdCBiZSBzZXQnLFxuICAgIHUgPT4gaXNOb25FbXB0eVN0cmluZyh1Lm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ2FjY2Vzc0xldmVscycsICd1c2VyIG11c3QgaGF2ZSBhdCBsZWFzdCBvbmUgYWNjZXNzIGxldmVsJyxcbiAgICB1ID0+IHUuYWNjZXNzTGV2ZWxzLmxlbmd0aCA+IDApLFxuICBtYWtlcnVsZSgnbmFtZScsICd1c2VybmFtZSBtdXN0IGJlIHVuaXF1ZScsXG4gICAgdSA9PiBmaWx0ZXIodTIgPT4gaW5zZW5zaXRpdmVFcXVhbHModTIubmFtZSwgdS5uYW1lKSkoYWxsVXNlcnMpLmxlbmd0aCA9PT0gMSksXG4gIG1ha2VydWxlKCdhY2Nlc3NMZXZlbHMnLCAnYWNjZXNzIGxldmVscyBtdXN0IG9ubHkgY29udGFpbiBzdGluZ3MnLFxuICAgIHUgPT4gYWxsKGlzTm9uRW1wdHlTdHJpbmcpKHUuYWNjZXNzTGV2ZWxzKSksXG5dO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVVc2VyID0gKCkgPT4gKGFsbHVzZXJzLCB1c2VyKSA9PiBhcHBseVJ1bGVTZXQodXNlclJ1bGVzKGFsbHVzZXJzKSkodXNlcik7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVVzZXJzID0gYXBwID0+IGFsbFVzZXJzID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkudmFsaWRhdGVVc2VycyxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyBhbGxVc2VycyB9LFxuICBfdmFsaWRhdGVVc2VycywgYXBwLCBhbGxVc2Vycyxcbik7XG5cbmV4cG9ydCBjb25zdCBfdmFsaWRhdGVVc2VycyA9IChhcHAsIGFsbFVzZXJzKSA9PiAkKGFsbFVzZXJzLCBbXG4gIG1hcChsID0+IHZhbGlkYXRlVXNlcihhcHApKGFsbFVzZXJzLCBsKSksXG4gIGZsYXR0ZW4sXG4gIHVuaXFXaXRoKCh4LCB5KSA9PiB4LmZpZWxkID09PSB5LmZpZWxkXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB4Lml0ZW0gPT09IHkuaXRlbVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgeC5lcnJvciA9PT0geS5lcnJvciksXG5dKTtcbiIsImltcG9ydCB7IGFwaVdyYXBwZXJTeW5jLCBldmVudHMgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3VXNlciA9IGFwcCA9PiAoKSA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5nZXROZXdVc2VyLFxuICBwZXJtaXNzaW9uLmNyZWF0ZVVzZXIuaXNBdXRob3JpemVkLFxuICB7fSxcbiAgX2dldE5ld1VzZXIsIGFwcCxcbik7XG5cbmV4cG9ydCBjb25zdCBfZ2V0TmV3VXNlciA9ICgpID0+ICh7XG4gIG5hbWU6ICcnLFxuICBhY2Nlc3NMZXZlbHM6IFtdLFxuICBlbmFibGVkOiB0cnVlLFxuICB0ZW1wb3JhcnlBY2Nlc3NJZDogJycsXG59KTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld1VzZXJBdXRoID0gYXBwID0+ICgpID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmdldE5ld1VzZXJBdXRoLFxuICBwZXJtaXNzaW9uLmNyZWF0ZVVzZXIuaXNBdXRob3JpemVkLFxuICB7fSxcbiAgX2dldE5ld1VzZXJBdXRoLCBhcHAsXG4pO1xuXG5leHBvcnQgY29uc3QgX2dldE5ld1VzZXJBdXRoID0gKCkgPT4gKHtcbiAgcGFzc3dvcmRIYXNoOiAnJyxcbiAgdGVtcG9yYXJ5QWNjZXNzSGFzaDogJycsXG4gIHRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoOiAwLFxufSk7XG4iLCJpbXBvcnQgeyBmaW5kIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHVzZXJBdXRoRmlsZSwgcGFyc2VUZW1wb3JhcnlDb2RlIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7XG4gIGlzU29tZXRoaW5nLCAkLCBhcGlXcmFwcGVyLCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgX2dldFVzZXJzIH0gZnJvbSAnLi9nZXRVc2Vycyc7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBpc1ZhbGlkUGFzc3dvcmQgPSBhcHAgPT4gcGFzc3dvcmQgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuaXNWYWxpZFBhc3N3b3JkLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHBhc3N3b3JkIH0sXG4gIF9pc1ZhbGlkUGFzc3dvcmQsIGFwcCwgcGFzc3dvcmQsXG4pO1xuXG5leHBvcnQgY29uc3QgX2lzVmFsaWRQYXNzd29yZCA9IChhcHAsIHBhc3N3b3JkKSA9PiBzY29yZVBhc3N3b3JkKHBhc3N3b3JkKS5zY29yZSA+IDMwO1xuXG5leHBvcnQgY29uc3QgY2hhbmdlTXlQYXNzd29yZCA9IGFwcCA9PiBhc3luYyAoY3VycmVudFB3LCBuZXdwYXNzd29yZCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5jaGFuZ2VNeVBhc3N3b3JkLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IGN1cnJlbnRQdywgbmV3cGFzc3dvcmQgfSxcbiAgX2NoYW5nZU15UGFzc3dvcmQsIGFwcCwgY3VycmVudFB3LCBuZXdwYXNzd29yZCxcbik7XG5cbmV4cG9ydCBjb25zdCBfY2hhbmdlTXlQYXNzd29yZCA9IGFzeW5jIChhcHAsIGN1cnJlbnRQdywgbmV3cGFzc3dvcmQpID0+IHtcbiAgY29uc3QgZXhpc3RpbmdBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICB1c2VyQXV0aEZpbGUoYXBwLnVzZXIubmFtZSksXG4gICk7XG5cbiAgaWYgKGlzU29tZXRoaW5nKGV4aXN0aW5nQXV0aC5wYXNzd29yZEhhc2gpKSB7XG4gICAgY29uc3QgdmVyaWZpZWQgPSBhd2FpdCBhcHAuY3J5cHRvLnZlcmlmeShcbiAgICAgIGV4aXN0aW5nQXV0aC5wYXNzd29yZEhhc2gsXG4gICAgICBjdXJyZW50UHcsXG4gICAgKTtcblxuICAgIGlmICh2ZXJpZmllZCkge1xuICAgICAgYXdhaXQgYXdhaXQgZG9TZXQoXG4gICAgICAgIGFwcCwgZXhpc3RpbmdBdXRoLFxuICAgICAgICBhcHAudXNlci5uYW1lLCBuZXdwYXNzd29yZCxcbiAgICAgICk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3Qgc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZSA9IGFwcCA9PiBhc3luYyAodGVtcENvZGUsIG5ld3Bhc3N3b3JkKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLnNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgdGVtcENvZGUsIG5ld3Bhc3N3b3JkIH0sXG4gIF9zZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlLCBhcHAsIHRlbXBDb2RlLCBuZXdwYXNzd29yZCxcbik7XG5cblxuZXhwb3J0IGNvbnN0IF9zZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlID0gYXN5bmMgKGFwcCwgdGVtcENvZGUsIG5ld3Bhc3N3b3JkKSA9PiB7XG4gIGNvbnN0IGN1cnJlbnRUaW1lID0gYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpO1xuXG4gIGNvbnN0IHRlbXAgPSBwYXJzZVRlbXBvcmFyeUNvZGUodGVtcENvZGUpO1xuXG4gIGNvbnN0IHVzZXIgPSAkKGF3YWl0IF9nZXRVc2VycyhhcHApLCBbXG4gICAgZmluZCh1ID0+IHUudGVtcG9yYXJ5QWNjZXNzSWQgPT09IHRlbXAuaWQpLFxuICBdKTtcblxuICBpZiAoIXVzZXIpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgY29uc3QgZXhpc3RpbmdBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICB1c2VyQXV0aEZpbGUodXNlci5uYW1lKSxcbiAgKTtcblxuICBpZiAoaXNTb21ldGhpbmcoZXhpc3RpbmdBdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2gpXG4gICAgICAgJiYgZXhpc3RpbmdBdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID4gY3VycmVudFRpbWUpIHtcbiAgICBjb25zdCB2ZXJpZmllZCA9IGF3YWl0IGFwcC5jcnlwdG8udmVyaWZ5KFxuICAgICAgZXhpc3RpbmdBdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2gsXG4gICAgICB0ZW1wLmNvZGUsXG4gICAgKTtcblxuICAgIGlmICh2ZXJpZmllZCkge1xuICAgICAgYXdhaXQgZG9TZXQoXG4gICAgICAgIGFwcCwgZXhpc3RpbmdBdXRoLFxuICAgICAgICB1c2VyLm5hbWUsIG5ld3Bhc3N3b3JkLFxuICAgICAgKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IGRvU2V0ID0gYXN5bmMgKGFwcCwgYXV0aCwgdXNlcm5hbWUsIG5ld3Bhc3N3b3JkKSA9PiB7XG4gIGF1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaCA9ICcnO1xuICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID0gMDtcbiAgYXV0aC5wYXNzd29yZEhhc2ggPSBhd2FpdCBhcHAuY3J5cHRvLmhhc2goXG4gICAgbmV3cGFzc3dvcmQsXG4gICk7XG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgICB1c2VyQXV0aEZpbGUodXNlcm5hbWUpLFxuICAgIGF1dGgsXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2NvcmVQYXNzd29yZCA9IGFwcCA9PiBwYXNzd29yZCA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5zY29yZVBhc3N3b3JkLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHBhc3N3b3JkIH0sXG4gIF9zY29yZVBhc3N3b3JkLCBwYXNzd29yZCxcbik7XG5cbmV4cG9ydCBjb25zdCBfc2NvcmVQYXNzd29yZCA9IChwYXNzd29yZCkgPT4ge1xuICAvLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzk0ODE3Mi9wYXNzd29yZC1zdHJlbmd0aC1tZXRlclxuICAvLyB0aGFuayB5b3UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS91c2Vycy80NjYxNy90bS1sdlxuXG4gIGxldCBzY29yZSA9IDA7XG4gIGlmICghcGFzc3dvcmQpIHsgcmV0dXJuIHNjb3JlOyB9XG5cbiAgLy8gYXdhcmQgZXZlcnkgdW5pcXVlIGxldHRlciB1bnRpbCA1IHJlcGV0aXRpb25zXG4gIGNvbnN0IGxldHRlcnMgPSBuZXcgT2JqZWN0KCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGFzc3dvcmQubGVuZ3RoOyBpKyspIHtcbiAgICBsZXR0ZXJzW3Bhc3N3b3JkW2ldXSA9IChsZXR0ZXJzW3Bhc3N3b3JkW2ldXSB8fCAwKSArIDE7XG4gICAgc2NvcmUgKz0gNS4wIC8gbGV0dGVyc1twYXNzd29yZFtpXV07XG4gIH1cblxuICAvLyBib251cyBwb2ludHMgZm9yIG1peGluZyBpdCB1cFxuICBjb25zdCB2YXJpYXRpb25zID0ge1xuICAgIGRpZ2l0czogL1xcZC8udGVzdChwYXNzd29yZCksXG4gICAgbG93ZXI6IC9bYS16XS8udGVzdChwYXNzd29yZCksXG4gICAgdXBwZXI6IC9bQS1aXS8udGVzdChwYXNzd29yZCksXG4gICAgbm9uV29yZHM6IC9cXFcvLnRlc3QocGFzc3dvcmQpLFxuICB9O1xuXG4gIGxldCB2YXJpYXRpb25Db3VudCA9IDA7XG4gIGZvciAoY29uc3QgY2hlY2sgaW4gdmFyaWF0aW9ucykge1xuICAgIHZhcmlhdGlvbkNvdW50ICs9ICh2YXJpYXRpb25zW2NoZWNrXSA9PSB0cnVlKSA/IDEgOiAwO1xuICB9XG4gIHNjb3JlICs9ICh2YXJpYXRpb25Db3VudCAtIDEpICogMTA7XG5cbiAgY29uc3Qgc3RyZW5ndGhUZXh0ID0gc2NvcmUgPiA4MFxuICAgID8gJ3N0cm9uZydcbiAgICA6IHNjb3JlID4gNjBcbiAgICAgID8gJ2dvb2QnXG4gICAgICA6IHNjb3JlID49IDMwXG4gICAgICAgID8gJ3dlYWsnXG4gICAgICAgIDogJ3Zlcnkgd2Vhayc7XG5cbiAgcmV0dXJuIHtcbiAgICBzY29yZTogcGFyc2VJbnQoc2NvcmUpLFxuICAgIHN0cmVuZ3RoVGV4dCxcbiAgfTtcbn07XG4iLCJpbXBvcnQgeyBqb2luLCBzb21lIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHZhbGlkYXRlVXNlciB9IGZyb20gJy4vdmFsaWRhdGVVc2VyJztcbmltcG9ydCB7IGdldE5ld1VzZXJBdXRoIH0gZnJvbSAnLi9nZXROZXdVc2VyJztcbmltcG9ydCB7XG4gIGdldExvY2ssIGlzTm9sb2NrLCByZWxlYXNlTG9jaywgYXBpV3JhcHBlciwgZXZlbnRzLFxuICBpbnNlbnNpdGl2ZUVxdWFscywgaXNOb25FbXB0eVN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIFVTRVJTX0xPQ0tfRklMRSwgc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZixcbiAgVVNFUlNfTElTVF9GSUxFLCB1c2VyQXV0aEZpbGUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyBnZXRUZW1wb3JhcnlDb2RlIH0gZnJvbSAnLi9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MnO1xuaW1wb3J0IHsgaXNWYWxpZFBhc3N3b3JkIH0gZnJvbSAnLi9zZXRQYXNzd29yZCc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVVzZXIgPSBhcHAgPT4gYXN5bmMgKHVzZXIsIHBhc3N3b3JkID0gbnVsbCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5jcmVhdGVVc2VyLFxuICBwZXJtaXNzaW9uLmNyZWF0ZVVzZXIuaXNBdXRob3JpemVkLFxuICB7IHVzZXIsIHBhc3N3b3JkIH0sXG4gIF9jcmVhdGVVc2VyLCBhcHAsIHVzZXIsIHBhc3N3b3JkLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9jcmVhdGVVc2VyID0gYXN5bmMgKGFwcCwgdXNlciwgcGFzc3dvcmQgPSBudWxsKSA9PiB7XG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRMb2NrKFxuICAgIGFwcCwgVVNFUlNfTE9DS19GSUxFLCAxMDAwLCAyLFxuICApO1xuXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBjcmVhdGUgdXNlciwgY291bGQgbm90IGdldCBsb2NrIC0gdHJ5IGFnYWluJyk7IH1cblxuICBjb25zdCB1c2VycyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oVVNFUlNfTElTVF9GSUxFKTtcblxuICBjb25zdCB1c2VyRXJyb3JzID0gdmFsaWRhdGVVc2VyKGFwcCkoWy4uLnVzZXJzLCB1c2VyXSwgdXNlcik7XG4gIGlmICh1c2VyRXJyb3JzLmxlbmd0aCA+IDApIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgVXNlciBpcyBpbnZhbGlkLiAke2pvaW4oJzsgJykodXNlckVycm9ycyl9YCk7IH1cblxuICBjb25zdCB7IGF1dGgsIHRlbXBDb2RlLCB0ZW1wb3JhcnlBY2Nlc3NJZCB9ID0gYXdhaXQgZ2V0QWNjZXNzKFxuICAgIGFwcCwgcGFzc3dvcmQsXG4gICk7XG4gIHVzZXIudGVtcENvZGUgPSB0ZW1wQ29kZTtcbiAgdXNlci50ZW1wb3JhcnlBY2Nlc3NJZCA9IHRlbXBvcmFyeUFjY2Vzc0lkO1xuXG4gIGlmIChzb21lKHUgPT4gaW5zZW5zaXRpdmVFcXVhbHModS5uYW1lLCB1c2VyLm5hbWUpKSh1c2VycykpIHsgXG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignVXNlciBhbHJlYWR5IGV4aXN0cycpOyBcbiAgfVxuXG4gIHVzZXJzLnB1c2goXG4gICAgc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZih1c2VyKSxcbiAgKTtcblxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgVVNFUlNfTElTVF9GSUxFLFxuICAgIHVzZXJzLFxuICApO1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVKc29uKFxuICAgICAgdXNlckF1dGhGaWxlKHVzZXIubmFtZSksXG4gICAgICBhdXRoLFxuICAgICk7XG4gIH0gY2F0Y2ggKF8pIHtcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgICB1c2VyQXV0aEZpbGUodXNlci5uYW1lKSxcbiAgICAgIGF1dGgsXG4gICAgKTtcbiAgfVxuXG4gIGF3YWl0IHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XG5cbiAgcmV0dXJuIHVzZXI7XG59O1xuXG5jb25zdCBnZXRBY2Nlc3MgPSBhc3luYyAoYXBwLCBwYXNzd29yZCkgPT4ge1xuICBjb25zdCBhdXRoID0gZ2V0TmV3VXNlckF1dGgoYXBwKSgpO1xuXG4gIGlmIChpc05vbkVtcHR5U3RyaW5nKHBhc3N3b3JkKSkge1xuICAgIGlmIChpc1ZhbGlkUGFzc3dvcmQocGFzc3dvcmQpKSB7XG4gICAgICBhdXRoLnBhc3N3b3JkSGFzaCA9IGF3YWl0IGFwcC5jcnlwdG8uaGFzaChwYXNzd29yZCk7XG4gICAgICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2ggPSAnJztcbiAgICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzSWQgPSAnJztcbiAgICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPSAwO1xuICAgICAgcmV0dXJuIHsgYXV0aCB9O1xuICAgIH1cbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdQYXNzd29yZCBkb2VzIG5vdCBtZWV0IHJlcXVpcmVtZW50cycpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHRlbXBBY2Nlc3MgPSBhd2FpdCBnZXRUZW1wb3JhcnlDb2RlKGFwcCk7XG4gICAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoID0gdGVtcEFjY2Vzcy50ZW1wb3JhcnlBY2Nlc3NIYXNoO1xuICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPSB0ZW1wQWNjZXNzLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoO1xuICAgIGF1dGgucGFzc3dvcmRIYXNoID0gJyc7XG4gICAgcmV0dXJuICh7XG4gICAgICBhdXRoLFxuICAgICAgdGVtcENvZGU6IHRlbXBBY2Nlc3MudGVtcENvZGUsXG4gICAgICB0ZW1wb3JhcnlBY2Nlc3NJZDogdGVtcEFjY2Vzcy50ZW1wb3JhcnlBY2Nlc3NJZCxcbiAgICB9KTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIGdldExvY2ssXG4gIGlzTm9sb2NrLCByZWxlYXNlTG9jayxcbn0gZnJvbSAnLi4vY29tbW9uL2xvY2snO1xuaW1wb3J0IHsgVVNFUlNfTE9DS19GSUxFLCBVU0VSU19MSVNUX0ZJTEUsIGdldFVzZXJCeU5hbWUgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgYXBpV3JhcHBlciwgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGVuYWJsZVVzZXIgPSBhcHAgPT4gYXN5bmMgdXNlcm5hbWUgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5lbmFibGVVc2VyLFxuICBwZXJtaXNzaW9uLmVuYWJsZURpc2FibGVVc2VyLmlzQXV0aG9yaXplZCxcbiAgeyB1c2VybmFtZSB9LFxuICBfZW5hYmxlVXNlciwgYXBwLCB1c2VybmFtZSxcbik7XG5cbmV4cG9ydCBjb25zdCBkaXNhYmxlVXNlciA9IGFwcCA9PiBhc3luYyB1c2VybmFtZSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmRpc2FibGVVc2VyLFxuICBwZXJtaXNzaW9uLmVuYWJsZURpc2FibGVVc2VyLmlzQXV0aG9yaXplZCxcbiAgeyB1c2VybmFtZSB9LFxuICBfZGlzYWJsZVVzZXIsIGFwcCwgdXNlcm5hbWUsXG4pO1xuXG5leHBvcnQgY29uc3QgX2VuYWJsZVVzZXIgPSBhc3luYyAoYXBwLCB1c2VybmFtZSkgPT4gYXdhaXQgdG9nZ2xlVXNlcihhcHAsIHVzZXJuYW1lLCB0cnVlKTtcblxuZXhwb3J0IGNvbnN0IF9kaXNhYmxlVXNlciA9IGFzeW5jIChhcHAsIHVzZXJuYW1lKSA9PiBhd2FpdCB0b2dnbGVVc2VyKGFwcCwgdXNlcm5hbWUsIGZhbHNlKTtcblxuY29uc3QgdG9nZ2xlVXNlciA9IGFzeW5jIChhcHAsIHVzZXJuYW1lLCBlbmFibGVkKSA9PiB7XG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRMb2NrKGFwcCwgVVNFUlNfTE9DS19GSUxFLCAxMDAwLCAxLCAwKTtcblxuICBjb25zdCBhY3Rpb25OYW1lID0gZW5hYmxlZCA/ICdlbmFibGUnIDogJ2Rpc2FibGUnO1xuXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCAke2FjdGlvbk5hbWV9IHVzZXIgLSBjYW5ub3QgZ2V0IGxvY2tgKTsgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSk7XG4gICAgY29uc3QgdXNlciA9IGdldFVzZXJCeU5hbWUodXNlcnMsIHVzZXJuYW1lKTtcbiAgICBpZiAoIXVzZXIpIHsgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoYENvdWxkIG5vdCBmaW5kIHVzZXIgdG8gJHthY3Rpb25OYW1lfWApOyB9XG5cbiAgICBpZiAodXNlci5lbmFibGVkID09PSAhZW5hYmxlZCkge1xuICAgICAgdXNlci5lbmFibGVkID0gZW5hYmxlZDtcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihVU0VSU19MSVNUX0ZJTEUsIHVzZXJzKTtcbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcbiAgfVxufTtcbiIsImV4cG9ydCBjb25zdCBnZXROZXdBY2Nlc3NMZXZlbCA9ICgpID0+ICgpID0+ICh7XG4gIG5hbWU6ICcnLFxuICBwZXJtaXNzaW9uczogW10sXG4gIGRlZmF1bHQ6ZmFsc2Vcbn0pO1xuIiwiaW1wb3J0IHtcbiAgdmFsdWVzLCBpbmNsdWRlcywgbWFwLCBjb25jYXQsIGlzRW1wdHksIHVuaXFXaXRoLCBzb21lLFxuICBmbGF0dGVuLCBmaWx0ZXIsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvblR5cGVzIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7XG4gICQsIGlzU29tZXRoaW5nLCBpbnNlbnNpdGl2ZUVxdWFscyxcbiAgaXNOb25FbXB0eVN0cmluZywgYXBpV3JhcHBlclN5bmMsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldE5vZGUgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5jb25zdCBpc0FsbG93ZWRUeXBlID0gdCA9PiAkKHBlcm1pc3Npb25UeXBlcywgW1xuICB2YWx1ZXMsXG4gIGluY2x1ZGVzKHQpLFxuXSk7XG5cbmNvbnN0IGlzUmVjb3JkT3JJbmRleFR5cGUgPSB0ID0+IHNvbWUocCA9PiBwID09PSB0KShbXG4gIHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfUkVDT1JELFxuICBwZXJtaXNzaW9uVHlwZXMuVVBEQVRFX1JFQ09SRCxcbiAgcGVybWlzc2lvblR5cGVzLkRFTEVURV9SRUNPUkQsXG4gIHBlcm1pc3Npb25UeXBlcy5SRUFEX1JFQ09SRCxcbiAgcGVybWlzc2lvblR5cGVzLlJFQURfSU5ERVgsXG4gIHBlcm1pc3Npb25UeXBlcy5FWEVDVVRFX0FDVElPTixcbl0pO1xuXG5cbmNvbnN0IHBlcm1pc3Npb25SdWxlcyA9IGFwcCA9PiAoW1xuICBtYWtlcnVsZSgndHlwZScsICd0eXBlIG11c3QgYmUgb25lIG9mIGFsbG93ZWQgdHlwZXMnLFxuICAgIHAgPT4gaXNBbGxvd2VkVHlwZShwLnR5cGUpKSxcbiAgbWFrZXJ1bGUoJ25vZGVLZXknLCAncmVjb3JkIGFuZCBpbmRleCBwZXJtaXNzaW9ucyBtdXN0IGluY2x1ZGUgYSB2YWxpZCBub2RlS2V5JyxcbiAgICBwID0+ICghaXNSZWNvcmRPckluZGV4VHlwZShwLnR5cGUpKVxuICAgICAgICAgICAgIHx8IGlzU29tZXRoaW5nKGdldE5vZGUoYXBwLmhpZXJhcmNoeSwgcC5ub2RlS2V5KSkpLFxuXSk7XG5cbmNvbnN0IGFwcGx5UGVybWlzc2lvblJ1bGVzID0gYXBwID0+IGFwcGx5UnVsZVNldChwZXJtaXNzaW9uUnVsZXMoYXBwKSk7XG5cbmNvbnN0IGFjY2Vzc0xldmVsUnVsZXMgPSBhbGxMZXZlbHMgPT4gKFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnbmFtZSBtdXN0IGJlIHNldCcsXG4gICAgbCA9PiBpc05vbkVtcHR5U3RyaW5nKGwubmFtZSkpLFxuICBtYWtlcnVsZSgnbmFtZScsICdhY2Nlc3MgbGV2ZWwgbmFtZXMgbXVzdCBiZSB1bmlxdWUnLFxuICAgIGwgPT4gaXNFbXB0eShsLm5hbWUpXG4gICAgICAgICAgICAgfHwgZmlsdGVyKGEgPT4gaW5zZW5zaXRpdmVFcXVhbHMobC5uYW1lLCBhLm5hbWUpKShhbGxMZXZlbHMpLmxlbmd0aCA9PT0gMSksXG5dKTtcblxuY29uc3QgYXBwbHlMZXZlbFJ1bGVzID0gYWxsTGV2ZWxzID0+IGFwcGx5UnVsZVNldChhY2Nlc3NMZXZlbFJ1bGVzKGFsbExldmVscykpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBY2Nlc3NMZXZlbCA9IGFwcCA9PiAoYWxsTGV2ZWxzLCBsZXZlbCkgPT4ge1xuICBjb25zdCBlcnJzID0gJChsZXZlbC5wZXJtaXNzaW9ucywgW1xuICAgIG1hcChhcHBseVBlcm1pc3Npb25SdWxlcyhhcHApKSxcbiAgICBmbGF0dGVuLFxuICAgIGNvbmNhdChcbiAgICAgIGFwcGx5TGV2ZWxSdWxlcyhhbGxMZXZlbHMpKGxldmVsKSxcbiAgICApLFxuICBdKTtcblxuICByZXR1cm4gZXJycztcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFjY2Vzc0xldmVscyA9IGFwcCA9PiBhbGxMZXZlbHMgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkudmFsaWRhdGVBY2Nlc3NMZXZlbHMsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgYWxsTGV2ZWxzIH0sXG4gIF92YWxpZGF0ZUFjY2Vzc0xldmVscywgYXBwLCBhbGxMZXZlbHMsXG4pO1xuXG5leHBvcnQgY29uc3QgX3ZhbGlkYXRlQWNjZXNzTGV2ZWxzID0gKGFwcCwgYWxsTGV2ZWxzKSA9PiAkKGFsbExldmVscywgW1xuICBtYXAobCA9PiB2YWxpZGF0ZUFjY2Vzc0xldmVsKGFwcCkoYWxsTGV2ZWxzLCBsKSksXG4gIGZsYXR0ZW4sXG4gIHVuaXFXaXRoKCh4LCB5KSA9PiB4LmZpZWxkID09PSB5LmZpZWxkXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB4Lml0ZW0gPT09IHkuaXRlbVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgeC5lcnJvciA9PT0geS5lcnJvciksXG5dKTtcbiIsImltcG9ydCB7IGpvaW4sIG1hcCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRMb2NrLCByZWxlYXNlTG9jaywgJCxcbiAgaXNOb2xvY2ssIGFwaVdyYXBwZXIsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIEFDQ0VTU19MRVZFTFNfTE9DS19GSUxFLFxuICBBQ0NFU1NfTEVWRUxTX0ZJTEUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyB2YWxpZGF0ZUFjY2Vzc0xldmVscyB9IGZyb20gJy4vdmFsaWRhdGVBY2Nlc3NMZXZlbHMnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3Qgc2F2ZUFjY2Vzc0xldmVscyA9IGFwcCA9PiBhc3luYyBhY2Nlc3NMZXZlbHMgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5zYXZlQWNjZXNzTGV2ZWxzLFxuICBwZXJtaXNzaW9uLndyaXRlQWNjZXNzTGV2ZWxzLmlzQXV0aG9yaXplZCxcbiAgeyBhY2Nlc3NMZXZlbHMgfSxcbiAgX3NhdmVBY2Nlc3NMZXZlbHMsIGFwcCwgYWNjZXNzTGV2ZWxzLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9zYXZlQWNjZXNzTGV2ZWxzID0gYXN5bmMgKGFwcCwgYWNjZXNzTGV2ZWxzKSA9PiB7XG4gIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0ZUFjY2Vzc0xldmVscyhhcHApKGFjY2Vzc0xldmVscy5sZXZlbHMpO1xuICBpZiAodmFsaWRhdGlvbkVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgZXJycyA9ICQodmFsaWRhdGlvbkVycm9ycywgW1xuICAgICAgbWFwKGUgPT4gZS5lcnJvciksXG4gICAgICBqb2luKCcsICcpLFxuICAgIF0pO1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBBY2Nlc3MgTGV2ZWxzIEludmFsaWQ6ICR7ZXJyc31gLFxuICAgICk7XG4gIH1cblxuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhcbiAgICBhcHAsIEFDQ0VTU19MRVZFTFNfTE9DS19GSUxFLCAyMDAwLCAyLFxuICApO1xuXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBnZXQgbG9jayB0byBzYXZlIGFjY2VzcyBsZXZlbHMnKTsgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKEFDQ0VTU19MRVZFTFNfRklMRSk7XG4gICAgaWYgKGV4aXN0aW5nLnZlcnNpb24gIT09IGFjY2Vzc0xldmVscy52ZXJzaW9uKSB7IHRocm93IG5ldyBFcnJvcignQWNjZXNzIGxldmVscyBoYXZlIGFscmVhZHkgYmVlbiB1cGRhdGVkLCBzaW5jZSB5b3UgbG9hZGVkJyk7IH1cblxuICAgIGFjY2Vzc0xldmVscy52ZXJzaW9uKys7XG5cbiAgICBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oQUNDRVNTX0xFVkVMU19GSUxFLCBhY2Nlc3NMZXZlbHMpO1xuICB9IGZpbmFsbHkge1xuICAgIGF3YWl0IHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBmaWx0ZXIsIHZhbHVlcywgZWFjaCwga2V5cyxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcbmltcG9ydCB7XG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgaXNJbmRleCwgaXNSZWNvcmQsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zID0gKGFwcCkgPT4ge1xuICBjb25zdCBhbGxOb2RlcyA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShhcHAuaGllcmFyY2h5KTtcbiAgY29uc3QgYWNjZXNzTGV2ZWwgPSB7IHBlcm1pc3Npb25zOiBbXSB9O1xuXG4gIGNvbnN0IHJlY29yZE5vZGVzID0gJChhbGxOb2RlcywgW1xuICAgIGZpbHRlcihpc1JlY29yZCksXG4gIF0pO1xuXG4gIGZvciAoY29uc3QgbiBvZiByZWNvcmROb2Rlcykge1xuICAgIHBlcm1pc3Npb24uY3JlYXRlUmVjb3JkLmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xuICAgIHBlcm1pc3Npb24udXBkYXRlUmVjb3JkLmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xuICAgIHBlcm1pc3Npb24uZGVsZXRlUmVjb3JkLmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xuICAgIHBlcm1pc3Npb24ucmVhZFJlY29yZC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcbiAgfVxuXG4gIGNvbnN0IGluZGV4Tm9kZXMgPSAkKGFsbE5vZGVzLCBbXG4gICAgZmlsdGVyKGlzSW5kZXgpLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IG4gb2YgaW5kZXhOb2Rlcykge1xuICAgIHBlcm1pc3Npb24ucmVhZEluZGV4LmFkZChuLm5vZGVLZXkoKSwgYWNjZXNzTGV2ZWwpO1xuICB9XG5cbiAgZm9yIChjb25zdCBhIG9mIGtleXMoYXBwLmFjdGlvbnMpKSB7XG4gICAgcGVybWlzc2lvbi5leGVjdXRlQWN0aW9uLmFkZChhLCBhY2Nlc3NMZXZlbCk7XG4gIH1cblxuICAkKHBlcm1pc3Npb24sIFtcbiAgICB2YWx1ZXMsXG4gICAgZmlsdGVyKHAgPT4gIXAuaXNOb2RlKSxcbiAgICBlYWNoKHAgPT4gcC5hZGQoYWNjZXNzTGV2ZWwpKSxcbiAgXSk7XG5cbiAgcmV0dXJuIGFjY2Vzc0xldmVsLnBlcm1pc3Npb25zO1xufTtcbiIsImltcG9ydCB7IGRpZmZlcmVuY2UsIG1hcCwgam9pbiB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRMb2NrLCBpc05vbG9jaywgcmVsZWFzZUxvY2ssICQsXG4gIGFwaVdyYXBwZXIsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIFVTRVJTX0xPQ0tfRklMRSwgQUNDRVNTX0xFVkVMU19GSUxFLFxuICBnZXRVc2VyQnlOYW1lLCBVU0VSU19MSVNUX0ZJTEUsXG59IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBzZXRVc2VyQWNjZXNzTGV2ZWxzID0gYXBwID0+IGFzeW5jICh1c2VyTmFtZSwgYWNjZXNzTGV2ZWxzKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLnNldFVzZXJBY2Nlc3NMZXZlbHMsXG4gIHBlcm1pc3Npb24uc2V0VXNlckFjY2Vzc0xldmVscy5pc0F1dGhvcml6ZWQsXG4gIHsgdXNlck5hbWUsIGFjY2Vzc0xldmVscyB9LFxuICBfc2V0VXNlckFjY2Vzc0xldmVscywgYXBwLCB1c2VyTmFtZSwgYWNjZXNzTGV2ZWxzLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9zZXRVc2VyQWNjZXNzTGV2ZWxzID0gYXN5bmMgKGFwcCwgdXNlcm5hbWUsIGFjY2Vzc0xldmVscykgPT4ge1xuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhhcHAsIFVTRVJTX0xPQ0tfRklMRSwgMTAwMCwgMSwgMCk7XG5cbiAgY29uc3QgYWN0dWFsQWNjZXNzTGV2ZWxzID0gJChcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKEFDQ0VTU19MRVZFTFNfRklMRSksXG4gICAgW1xuICAgICAgbCA9PiBsLmxldmVscyxcbiAgICAgIG1hcChsID0+IGwubmFtZSksXG4gICAgXSxcbiAgKTtcblxuICBjb25zdCBtaXNzaW5nID0gZGlmZmVyZW5jZShhY2Nlc3NMZXZlbHMpKGFjdHVhbEFjY2Vzc0xldmVscyk7XG4gIGlmIChtaXNzaW5nLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgYWNjZXNzIGxldmVscyBzdXBwbGllZDogJHtqb2luKCcsICcsIG1pc3NpbmcpfWApO1xuICB9XG5cbiAgaWYgKGlzTm9sb2NrKGxvY2spKSB7IHRocm93IG5ldyBFcnJvcignQ291bGQgc2V0IHVzZXIgYWNjZXNzIGxldmVscyBjYW5ub3QgZ2V0IGxvY2snKTsgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSk7XG4gICAgY29uc3QgdXNlciA9IGdldFVzZXJCeU5hbWUodXNlcnMsIHVzZXJuYW1lKTtcbiAgICBpZiAoIXVzZXIpIHsgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoYENvdWxkIG5vdCBmaW5kIHVzZXIgd2l0aCAke3VzZXJuYW1lfWApOyB9XG5cbiAgICB1c2VyLmFjY2Vzc0xldmVscyA9IGFjY2Vzc0xldmVscztcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oVVNFUlNfTElTVF9GSUxFLCB1c2Vycyk7XG4gIH0gZmluYWxseSB7XG4gICAgcmVsZWFzZUxvY2soYXBwLCBsb2NrKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIGF1dGhlbnRpY2F0ZSxcbiAgYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzLFxufSBmcm9tICcuL2F1dGhlbnRpY2F0ZSc7XG5pbXBvcnQgeyBjcmVhdGVUZW1wb3JhcnlBY2Nlc3MgfSBmcm9tICcuL2NyZWF0ZVRlbXBvcmFyeUFjY2Vzcyc7XG5pbXBvcnQgeyBjcmVhdGVVc2VyIH0gZnJvbSAnLi9jcmVhdGVVc2VyJztcbmltcG9ydCB7IGVuYWJsZVVzZXIsIGRpc2FibGVVc2VyIH0gZnJvbSAnLi9lbmFibGVVc2VyJztcbmltcG9ydCB7IGxvYWRBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL2xvYWRBY2Nlc3NMZXZlbHMnO1xuaW1wb3J0IHsgZ2V0TmV3QWNjZXNzTGV2ZWwgfSBmcm9tICcuL2dldE5ld0FjY2Vzc0xldmVsJztcbmltcG9ydCB7IGdldE5ld1VzZXIsIGdldE5ld1VzZXJBdXRoIH0gZnJvbSAnLi9nZXROZXdVc2VyJztcbmltcG9ydCB7IGdldFVzZXJzIH0gZnJvbSAnLi9nZXRVc2Vycyc7XG5pbXBvcnQgeyBpc0F1dGhvcml6ZWQgfSBmcm9tICcuL2lzQXV0aG9yaXplZCc7XG5pbXBvcnQgeyBzYXZlQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi9zYXZlQWNjZXNzTGV2ZWxzJztcbmltcG9ydCB7XG4gIGNoYW5nZU15UGFzc3dvcmQsXG4gIHNjb3JlUGFzc3dvcmQsIHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUsXG4gIGlzVmFsaWRQYXNzd29yZCxcbn0gZnJvbSAnLi9zZXRQYXNzd29yZCc7XG5pbXBvcnQgeyB2YWxpZGF0ZVVzZXIgfSBmcm9tICcuL3ZhbGlkYXRlVXNlcic7XG5pbXBvcnQgeyB2YWxpZGF0ZUFjY2Vzc0xldmVscyB9IGZyb20gJy4vdmFsaWRhdGVBY2Nlc3NMZXZlbHMnO1xuaW1wb3J0IHsgZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMgfSBmcm9tICcuL2dlbmVyYXRlRnVsbFBlcm1pc3Npb25zJztcbmltcG9ydCB7IHNldFVzZXJBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL3NldFVzZXJBY2Nlc3NMZXZlbHMnO1xuXG5leHBvcnQgY29uc3QgZ2V0QXV0aEFwaSA9IGFwcCA9PiAoe1xuICBhdXRoZW50aWNhdGU6IGF1dGhlbnRpY2F0ZShhcHApLFxuICBhdXRoZW50aWNhdGVUZW1wb3JhcnlBY2Nlc3M6IGF1dGhlbnRpY2F0ZVRlbXBvcmFyeUFjY2VzcyhhcHApLFxuICBjcmVhdGVUZW1wb3JhcnlBY2Nlc3M6IGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyhhcHApLFxuICBjcmVhdGVVc2VyOiBjcmVhdGVVc2VyKGFwcCksXG4gIGxvYWRBY2Nlc3NMZXZlbHM6IGxvYWRBY2Nlc3NMZXZlbHMoYXBwKSxcbiAgZW5hYmxlVXNlcjogZW5hYmxlVXNlcihhcHApLFxuICBkaXNhYmxlVXNlcjogZGlzYWJsZVVzZXIoYXBwKSxcbiAgZ2V0TmV3QWNjZXNzTGV2ZWw6IGdldE5ld0FjY2Vzc0xldmVsKGFwcCksXG4gIGdldE5ld1VzZXI6IGdldE5ld1VzZXIoYXBwKSxcbiAgZ2V0TmV3VXNlckF1dGg6IGdldE5ld1VzZXJBdXRoKGFwcCksXG4gIGdldFVzZXJzOiBnZXRVc2VycyhhcHApLFxuICBzYXZlQWNjZXNzTGV2ZWxzOiBzYXZlQWNjZXNzTGV2ZWxzKGFwcCksXG4gIGlzQXV0aG9yaXplZDogaXNBdXRob3JpemVkKGFwcCksXG4gIGNoYW5nZU15UGFzc3dvcmQ6IGNoYW5nZU15UGFzc3dvcmQoYXBwKSxcbiAgc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZTogc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZShhcHApLFxuICBzY29yZVBhc3N3b3JkLFxuICBpc1ZhbGlkUGFzc3dvcmQ6IGlzVmFsaWRQYXNzd29yZChhcHApLFxuICB2YWxpZGF0ZVVzZXI6IHZhbGlkYXRlVXNlcihhcHApLFxuICB2YWxpZGF0ZUFjY2Vzc0xldmVsczogdmFsaWRhdGVBY2Nlc3NMZXZlbHMoYXBwKSxcbiAgZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnM6ICgpID0+IGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zKGFwcCksXG4gIHNldFVzZXJBY2Nlc3NMZXZlbHM6IHNldFVzZXJBY2Nlc3NMZXZlbHMoYXBwKSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRBdXRoQXBpO1xuIiwiaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgYXBpV3JhcHBlclN5bmMgfSBmcm9tICcuLi9jb21tb24vYXBpV3JhcHBlcic7XG5pbXBvcnQgeyBldmVudHMgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcblxuZXhwb3J0IGNvbnN0IGV4ZWN1dGVBY3Rpb24gPSBhcHAgPT4gKGFjdGlvbk5hbWUsIG9wdGlvbnMpID0+IHtcbiAgYXBpV3JhcHBlclN5bmMoXG4gICAgYXBwLFxuICAgIGV2ZW50cy5hY3Rpb25zQXBpLmV4ZWN1dGUsXG4gICAgcGVybWlzc2lvbi5leGVjdXRlQWN0aW9uLmlzQXV0aG9yaXplZChhY3Rpb25OYW1lKSxcbiAgICB7IGFjdGlvbk5hbWUsIG9wdGlvbnMgfSxcbiAgICBhcHAuYWN0aW9uc1thY3Rpb25OYW1lXSwgb3B0aW9ucyxcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBfZXhlY3V0ZUFjdGlvbiA9IChiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb24sIG9wdGlvbnMpID0+IGJlaGF2aW91clNvdXJjZXNbYWN0aW9uLmJlaGF2aW91clNvdXJjZV1bYWN0aW9uLmJlaGF2aW91ck5hbWVdKG9wdGlvbnMpO1xuIiwiaW1wb3J0IHsgZXhlY3V0ZUFjdGlvbiB9IGZyb20gJy4vZXhlY3V0ZSc7XG5cbmV4cG9ydCBjb25zdCBnZXRBY3Rpb25zQXBpID0gYXBwID0+ICh7XG4gIGV4ZWN1dGU6IGV4ZWN1dGVBY3Rpb24oYXBwKSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRBY3Rpb25zQXBpO1xuIiwiaW1wb3J0IHsgaGFzIH0gZnJvbSAnbG9kYXNoL2ZwJztcblxuY29uc3QgcHVibGlzaCA9IGhhbmRsZXJzID0+IGFzeW5jIChldmVudE5hbWUsIGNvbnRleHQgPSB7fSkgPT4ge1xuICBpZiAoIWhhcyhldmVudE5hbWUpKGhhbmRsZXJzKSkgcmV0dXJuO1xuXG4gIGZvciAoY29uc3QgaGFuZGxlciBvZiBoYW5kbGVyc1tldmVudE5hbWVdKSB7XG4gICAgYXdhaXQgaGFuZGxlcihldmVudE5hbWUsIGNvbnRleHQpO1xuICB9XG59O1xuXG5jb25zdCBzdWJzY3JpYmUgPSBoYW5kbGVycyA9PiAoZXZlbnROYW1lLCBoYW5kbGVyKSA9PiB7XG4gIGlmICghaGFzKGV2ZW50TmFtZSkoaGFuZGxlcnMpKSB7XG4gICAgaGFuZGxlcnNbZXZlbnROYW1lXSA9IFtdO1xuICB9XG4gIGhhbmRsZXJzW2V2ZW50TmFtZV0ucHVzaChoYW5kbGVyKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVFdmVudEFnZ3JlZ2F0b3IgPSAoKSA9PiB7XG4gIGNvbnN0IGhhbmRsZXJzID0ge307XG4gIGNvbnN0IGV2ZW50QWdncmVnYXRvciA9ICh7XG4gICAgcHVibGlzaDogcHVibGlzaChoYW5kbGVycyksXG4gICAgc3Vic2NyaWJlOiBzdWJzY3JpYmUoaGFuZGxlcnMpLFxuICB9KTtcbiAgcmV0dXJuIGV2ZW50QWdncmVnYXRvcjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUV2ZW50QWdncmVnYXRvcjtcbiIsImltcG9ydCB7IHJldHJ5IH0gZnJvbSAnLi4vY29tbW9uL2luZGV4JztcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuY29uc3QgY3JlYXRlSnNvbiA9IG9yaWdpbmFsQ3JlYXRlRmlsZSA9PiBhc3luYyAoa2V5LCBvYmosIHJldHJpZXMgPSA1LCBkZWxheSA9IDUwMCkgPT4gYXdhaXQgcmV0cnkob3JpZ2luYWxDcmVhdGVGaWxlLCByZXRyaWVzLCBkZWxheSwga2V5LCBKU09OLnN0cmluZ2lmeShvYmopKTtcblxuY29uc3QgY3JlYXRlTmV3RmlsZSA9IG9yaWdpbmFsQ3JlYXRlRmlsZSA9PiBhc3luYyAocGF0aCwgY29udGVudCwgcmV0cmllcyA9IDUsIGRlbGF5ID0gNTAwKSA9PiBhd2FpdCByZXRyeShvcmlnaW5hbENyZWF0ZUZpbGUsIHJldHJpZXMsIGRlbGF5LCBwYXRoLCBjb250ZW50KTtcblxuY29uc3QgbG9hZEpzb24gPSBkYXRhc3RvcmUgPT4gYXN5bmMgKGtleSwgcmV0cmllcyA9IDUsIGRlbGF5ID0gNTAwKSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IHJldHJ5KEpTT04ucGFyc2UsIHJldHJpZXMsIGRlbGF5LCBhd2FpdCBkYXRhc3RvcmUubG9hZEZpbGUoa2V5KSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGVyci5tZXNzYWdlKTtcbiAgfVxufVxuXG5jb25zdCB1cGRhdGVKc29uID0gZGF0YXN0b3JlID0+IGFzeW5jIChrZXksIG9iaiwgcmV0cmllcyA9IDUsIGRlbGF5ID0gNTAwKSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IHJldHJ5KGRhdGFzdG9yZS51cGRhdGVGaWxlLCByZXRyaWVzLCBkZWxheSwga2V5LCBKU09OLnN0cmluZ2lmeShvYmopKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoZXJyLm1lc3NhZ2UpO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBzZXR1cERhdGFzdG9yZSA9IChkYXRhc3RvcmUpID0+IHtcbiAgY29uc3Qgb3JpZ2luYWxDcmVhdGVGaWxlID0gZGF0YXN0b3JlLmNyZWF0ZUZpbGU7XG4gIGRhdGFzdG9yZS5sb2FkSnNvbiA9IGxvYWRKc29uKGRhdGFzdG9yZSk7XG4gIGRhdGFzdG9yZS5jcmVhdGVKc29uID0gY3JlYXRlSnNvbihvcmlnaW5hbENyZWF0ZUZpbGUpO1xuICBkYXRhc3RvcmUudXBkYXRlSnNvbiA9IHVwZGF0ZUpzb24oZGF0YXN0b3JlKTtcbiAgZGF0YXN0b3JlLmNyZWF0ZUZpbGUgPSBjcmVhdGVOZXdGaWxlKG9yaWdpbmFsQ3JlYXRlRmlsZSk7XG4gIGlmIChkYXRhc3RvcmUuY3JlYXRlRW1wdHlEYikgeyBkZWxldGUgZGF0YXN0b3JlLmNyZWF0ZUVtcHR5RGI7IH1cbiAgcmV0dXJuIGRhdGFzdG9yZTtcbn07XG5cbmV4cG9ydCB7IGNyZWF0ZUV2ZW50QWdncmVnYXRvciB9IGZyb20gJy4vZXZlbnRBZ2dyZWdhdG9yJztcblxuZXhwb3J0IGRlZmF1bHQgc2V0dXBEYXRhc3RvcmU7XG4iLCJpbXBvcnQgeyBcbiAgY29tcGlsZUV4cHJlc3Npb24gYXMgY0V4cCwgXG4gIGNvbXBpbGVDb2RlIGFzIGNDb2RlIFxufSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XG5cbmV4cG9ydCBjb25zdCBjb21waWxlQ29kZSA9IGNvZGUgPT4ge1xuICBsZXQgZnVuYzsgIFxuICAgIFxuICB0cnkge1xuICAgIGZ1bmMgPSBjQ29kZShjb2RlKTtcbiAgfSBjYXRjaChlKSB7XG4gICAgZS5tZXNzYWdlID0gYEVycm9yIGNvbXBpbGluZyBjb2RlIDogJHtjb2RlfSA6ICR7ZS5tZXNzYWdlfWA7XG4gICAgdGhyb3cgZTtcbiAgfVxuXG4gIHJldHVybiBmdW5jO1xufVxuXG5leHBvcnQgY29uc3QgY29tcGlsZUV4cHJlc3Npb24gPSBjb2RlID0+IHtcbiAgbGV0IGZ1bmM7ICBcbiAgICAgIFxuICB0cnkge1xuICAgIGZ1bmMgPSBjRXhwKGNvZGUpO1xuICB9IGNhdGNoKGUpIHtcbiAgICBlLm1lc3NhZ2UgPSBgRXJyb3IgY29tcGlsaW5nIGV4cHJlc3Npb24gOiAke2NvZGV9IDogJHtlLm1lc3NhZ2V9YDtcbiAgICB0aHJvdyBlO1xuICB9XG4gIFxuICByZXR1cm4gZnVuYztcbn1cbiIsImltcG9ydCB7XG4gIGlzRnVuY3Rpb24sIGZpbHRlciwgbWFwLFxuICB1bmlxQnksIGtleXMsIGRpZmZlcmVuY2UsXG4gIGpvaW4sIHJlZHVjZSwgZmluZCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb21waWxlQ29kZSB9IGZyb20gJy4uL2NvbW1vbi9jb21waWxlQ29kZSc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IF9leGVjdXRlQWN0aW9uIH0gZnJvbSAnLi9leGVjdXRlJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciwgTm90Rm91bmRFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgaW5pdGlhbGlzZUFjdGlvbnMgPSAoc3Vic2NyaWJlLCBiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zLCB0cmlnZ2VycywgYXBpcykgPT4ge1xuICB2YWxpZGF0ZVNvdXJjZXMoYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucyk7XG4gIHN1YnNjcmliZVRyaWdnZXJzKHN1YnNjcmliZSwgYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucywgdHJpZ2dlcnMsIGFwaXMpO1xuICByZXR1cm4gY3JlYXRlQWN0aW9uc0NvbGxlY3Rpb24oYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucyk7XG59O1xuXG5jb25zdCBjcmVhdGVBY3Rpb25zQ29sbGVjdGlvbiA9IChiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zKSA9PiAkKGFjdGlvbnMsIFtcbiAgcmVkdWNlKChhbGwsIGEpID0+IHtcbiAgICBhbGxbYS5uYW1lXSA9IG9wdHMgPT4gX2V4ZWN1dGVBY3Rpb24oYmVoYXZpb3VyU291cmNlcywgYSwgb3B0cyk7XG4gICAgcmV0dXJuIGFsbDtcbiAgfSwge30pLFxuXSk7XG5cbmNvbnN0IHN1YnNjcmliZVRyaWdnZXJzID0gKHN1YnNjcmliZSwgYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucywgdHJpZ2dlcnMsIGFwaXMpID0+IHtcbiAgY29uc3QgY3JlYXRlT3B0aW9ucyA9IChvcHRpb25zQ3JlYXRvciwgZXZlbnRDb250ZXh0KSA9PiB7XG4gICAgaWYgKCFvcHRpb25zQ3JlYXRvcikgcmV0dXJuIHt9O1xuICAgIGNvbnN0IGNyZWF0ZSA9IGNvbXBpbGVDb2RlKG9wdGlvbnNDcmVhdG9yKTtcbiAgICByZXR1cm4gY3JlYXRlKHsgY29udGV4dDogZXZlbnRDb250ZXh0LCBhcGlzIH0pO1xuICB9O1xuXG4gIGNvbnN0IHNob3VsZFJ1blRyaWdnZXIgPSAodHJpZ2dlciwgZXZlbnRDb250ZXh0KSA9PiB7XG4gICAgaWYgKCF0cmlnZ2VyLmNvbmRpdGlvbikgcmV0dXJuIHRydWU7XG4gICAgY29uc3Qgc2hvdWxkUnVuID0gY29tcGlsZUV4cHJlc3Npb24odHJpZ2dlci5jb25kaXRpb24pO1xuICAgIHJldHVybiBzaG91bGRSdW4oeyBjb250ZXh0OiBldmVudENvbnRleHQgfSk7XG4gIH07XG5cbiAgZm9yIChsZXQgdHJpZyBvZiB0cmlnZ2Vycykge1xuICAgIHN1YnNjcmliZSh0cmlnLmV2ZW50TmFtZSwgYXN5bmMgKGV2LCBjdHgpID0+IHtcbiAgICAgIGlmIChzaG91bGRSdW5UcmlnZ2VyKHRyaWcsIGN0eCkpIHtcbiAgICAgICAgYXdhaXQgX2V4ZWN1dGVBY3Rpb24oXG4gICAgICAgICAgYmVoYXZpb3VyU291cmNlcyxcbiAgICAgICAgICBmaW5kKGEgPT4gYS5uYW1lID09PSB0cmlnLmFjdGlvbk5hbWUpKGFjdGlvbnMpLFxuICAgICAgICAgIGNyZWF0ZU9wdGlvbnModHJpZy5vcHRpb25zQ3JlYXRvciwgY3R4KSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufTtcblxuY29uc3QgdmFsaWRhdGVTb3VyY2VzID0gKGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMpID0+IHtcbiAgY29uc3QgZGVjbGFyZWRTb3VyY2VzID0gJChhY3Rpb25zLCBbXG4gICAgdW5pcUJ5KGEgPT4gYS5iZWhhdmlvdXJTb3VyY2UpLFxuICAgIG1hcChhID0+IGEuYmVoYXZpb3VyU291cmNlKSxcbiAgXSk7XG5cbiAgY29uc3Qgc3VwcGxpZWRTb3VyY2VzID0ga2V5cyhiZWhhdmlvdXJTb3VyY2VzKTtcblxuICBjb25zdCBtaXNzaW5nU291cmNlcyA9IGRpZmZlcmVuY2UoXG4gICAgZGVjbGFyZWRTb3VyY2VzLCBzdXBwbGllZFNvdXJjZXMsXG4gICk7XG5cbiAgaWYgKG1pc3NpbmdTb3VyY2VzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGBEZWNsYXJlZCBiZWhhdmlvdXIgc291cmNlcyBhcmUgbm90IHN1cHBsaWVkOiAke2pvaW4oJywgJywgbWlzc2luZ1NvdXJjZXMpfWApO1xuICB9XG5cbiAgY29uc3QgbWlzc2luZ0JlaGF2aW91cnMgPSAkKGFjdGlvbnMsIFtcbiAgICBmaWx0ZXIoYSA9PiAhaXNGdW5jdGlvbihiZWhhdmlvdXJTb3VyY2VzW2EuYmVoYXZpb3VyU291cmNlXVthLmJlaGF2aW91ck5hbWVdKSksXG4gICAgbWFwKGEgPT4gYEFjdGlvbjogJHthLm5hbWV9IDogJHthLmJlaGF2aW91clNvdXJjZX0uJHthLmJlaGF2aW91ck5hbWV9YCksXG4gIF0pO1xuXG4gIGlmIChtaXNzaW5nQmVoYXZpb3Vycy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoYE1pc3NpbmcgYmVoYXZpb3VyczogY291bGQgbm90IGZpbmQgYmVoYXZpb3VyIGZ1bmN0aW9uczogJHtqb2luKCcsICcsIG1pc3NpbmdCZWhhdmlvdXJzKX1gKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIG1hcCwgZmlsdGVyLCBncm91cEJ5LCBzcGxpdCxcbiAgc29tZSwgZmluZCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIExPQ0tfRklMRU5BTUUsIFRSQU5TQUNUSU9OU19GT0xERVIsIGlkU2VwLCBpc1VwZGF0ZSxcbiAgbm9kZUtleUhhc2hGcm9tQnVpbGRGb2xkZXIsIGlzQnVpbGRJbmRleEZvbGRlciwgZ2V0VHJhbnNhY3Rpb25JZCxcbiAgaXNEZWxldGUsIGlzQ3JlYXRlLFxufSBmcm9tICcuL3RyYW5zYWN0aW9uc0NvbW1vbic7XG5pbXBvcnQge1xuICBqb2luS2V5LCAkLCBub25lLCBpc1NvbWV0aGluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldExhc3RQYXJ0SW5LZXksIGdldE5vZGVGcm9tTm9kZUtleUhhc2ggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgX2xvYWQgfSBmcm9tICcuLi9yZWNvcmRBcGkvbG9hZCc7XG5cbmV4cG9ydCBjb25zdCByZXRyaWV2ZSA9IGFzeW5jIChhcHApID0+IHtcbiAgY29uc3QgdHJhbnNhY3Rpb25GaWxlcyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0Rm9sZGVyQ29udGVudHMoXG4gICAgVFJBTlNBQ1RJT05TX0ZPTERFUixcbiAgKTtcblxuICBsZXQgdHJhbnNhY3Rpb25zID0gW107XG5cbiAgaWYgKHNvbWUoaXNCdWlsZEluZGV4Rm9sZGVyKSh0cmFuc2FjdGlvbkZpbGVzKSkge1xuICAgIGNvbnN0IGJ1aWxkSW5kZXhGb2xkZXIgPSBmaW5kKGlzQnVpbGRJbmRleEZvbGRlcikodHJhbnNhY3Rpb25GaWxlcyk7XG5cbiAgICB0cmFuc2FjdGlvbnMgPSBhd2FpdCByZXRyaWV2ZUJ1aWxkSW5kZXhUcmFuc2FjdGlvbnMoXG4gICAgICBhcHAsXG4gICAgICBqb2luS2V5KFRSQU5TQUNUSU9OU19GT0xERVIsIGJ1aWxkSW5kZXhGb2xkZXIpLFxuICAgICk7XG4gIH1cblxuICBpZiAodHJhbnNhY3Rpb25zLmxlbmd0aCA+IDApIHJldHVybiB0cmFuc2FjdGlvbnM7XG5cbiAgcmV0dXJuIGF3YWl0IHJldHJpZXZlU3RhbmRhcmRUcmFuc2FjdGlvbnMoXG4gICAgYXBwLCB0cmFuc2FjdGlvbkZpbGVzLFxuICApO1xufTtcblxuY29uc3QgcmV0cmlldmVCdWlsZEluZGV4VHJhbnNhY3Rpb25zID0gYXN5bmMgKGFwcCwgYnVpbGRJbmRleEZvbGRlcikgPT4ge1xuICBjb25zdCBjaGlsZEZvbGRlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZvbGRlckNvbnRlbnRzKGJ1aWxkSW5kZXhGb2xkZXIpO1xuICBpZiAoY2hpbGRGb2xkZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgIC8vIGNsZWFudXBcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihidWlsZEluZGV4Rm9sZGVyKTtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCBnZXRUcmFuc2FjdGlvbkZpbGVzID0gYXN5bmMgKGNoaWxkRm9sZGVySW5kZXggPSAwKSA9PiB7XG4gICAgaWYgKGNoaWxkRm9sZGVySW5kZXggPj0gY2hpbGRGb2xkZXJzLmxlbmd0aCkgcmV0dXJuIFtdO1xuXG4gICAgY29uc3QgY2hpbGRGb2xkZXJLZXkgPSBqb2luS2V5KGJ1aWxkSW5kZXhGb2xkZXIsIGNoaWxkRm9sZGVyc1tjaGlsZEZvbGRlckluZGV4XSk7XG4gICAgY29uc3QgZmlsZXMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZvbGRlckNvbnRlbnRzKFxuICAgICAgY2hpbGRGb2xkZXJLZXksXG4gICAgKTtcblxuICAgIGlmIChmaWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKGNoaWxkRm9sZGVyS2V5KTtcbiAgICAgIHJldHVybiBhd2FpdCBnZXRUcmFuc2FjdGlvbkZpbGVzKGNoaWxkRm9sZGVySW5kZXggKyAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBjaGlsZEZvbGRlcktleSwgZmlsZXMgfTtcbiAgfTtcblxuICBjb25zdCB0cmFuc2FjdGlvbkZpbGVzID0gYXdhaXQgZ2V0VHJhbnNhY3Rpb25GaWxlcygpO1xuXG4gIGlmICh0cmFuc2FjdGlvbkZpbGVzLmZpbGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IHRyYW5zYWN0aW9ucyA9ICQodHJhbnNhY3Rpb25GaWxlcy5maWxlcywgW1xuICAgIG1hcChwYXJzZVRyYW5zYWN0aW9uSWQpLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IHQgb2YgdHJhbnNhY3Rpb25zKSB7XG4gICAgY29uc3QgdHJhbnNhY3Rpb25Db250ZW50ID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICAgIGpvaW5LZXkoXG4gICAgICAgIHRyYW5zYWN0aW9uRmlsZXMuY2hpbGRGb2xkZXJLZXksXG4gICAgICAgIHQuZnVsbElkLFxuICAgICAgKSxcbiAgICApO1xuICAgIHQucmVjb3JkID0gYXdhaXQgX2xvYWQoYXBwLCB0cmFuc2FjdGlvbkNvbnRlbnQucmVjb3JkS2V5KTtcbiAgfVxuXG4gIHRyYW5zYWN0aW9ucy5pbmRleE5vZGUgPSAkKGJ1aWxkSW5kZXhGb2xkZXIsIFtcbiAgICBnZXRMYXN0UGFydEluS2V5LFxuICAgIG5vZGVLZXlIYXNoRnJvbUJ1aWxkRm9sZGVyLFxuICAgIGdldE5vZGVGcm9tTm9kZUtleUhhc2goYXBwLmhpZXJhcmNoeSksXG4gIF0pO1xuXG4gIHRyYW5zYWN0aW9ucy5mb2xkZXJLZXkgPSB0cmFuc2FjdGlvbkZpbGVzLmNoaWxkRm9sZGVyS2V5O1xuXG4gIHJldHVybiB0cmFuc2FjdGlvbnM7XG59O1xuXG5jb25zdCByZXRyaWV2ZVN0YW5kYXJkVHJhbnNhY3Rpb25zID0gYXN5bmMgKGFwcCwgdHJhbnNhY3Rpb25GaWxlcykgPT4ge1xuICBjb25zdCB0cmFuc2FjdGlvbklkcyA9ICQodHJhbnNhY3Rpb25GaWxlcywgW1xuICAgIGZpbHRlcihmID0+IGYgIT09IExPQ0tfRklMRU5BTUVcbiAgICAgICAgICAgICAgICAgICAgJiYgIWlzQnVpbGRJbmRleEZvbGRlcihmKSksXG4gICAgbWFwKHBhcnNlVHJhbnNhY3Rpb25JZCksXG4gIF0pO1xuXG4gIGNvbnN0IHRyYW5zYWN0aW9uSWRzQnlSZWNvcmQgPSAkKHRyYW5zYWN0aW9uSWRzLCBbXG4gICAgZ3JvdXBCeSgncmVjb3JkSWQnKSxcbiAgXSk7XG5cbiAgY29uc3QgZGVkdXBlZFRyYW5zYWN0aW9ucyA9IFtdO1xuXG4gIGNvbnN0IHZlcmlmeSA9IGFzeW5jICh0KSA9PiB7XG4gICAgaWYgKHQudmVyaWZpZWQgPT09IHRydWUpIHJldHVybiB0O1xuXG4gICAgY29uc3QgaWQgPSBnZXRUcmFuc2FjdGlvbklkKFxuICAgICAgdC5yZWNvcmRJZCxcbiAgICAgIHQudHJhbnNhY3Rpb25UeXBlLFxuICAgICAgdC51bmlxdWVJZCxcbiAgICApO1xuXG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFxuICAgICAgam9pbktleShUUkFOU0FDVElPTlNfRk9MREVSLCBpZCksXG4gICAgKTtcblxuICAgIGlmIChpc0RlbGV0ZSh0KSkge1xuICAgICAgdC5yZWNvcmQgPSB0cmFuc2FjdGlvbi5yZWNvcmQ7XG4gICAgICB0LnZlcmlmaWVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0O1xuICAgIH1cblxuICAgIGNvbnN0IHJlYyA9IGF3YWl0IF9sb2FkKFxuICAgICAgYXBwLFxuICAgICAgdHJhbnNhY3Rpb24ucmVjb3JkS2V5LFxuICAgICk7XG4gICAgaWYgKHJlYy50cmFuc2FjdGlvbklkID09PSBpZCkge1xuICAgICAgdC5yZWNvcmQgPSByZWM7XG4gICAgICBpZiAodHJhbnNhY3Rpb24ub2xkUmVjb3JkKSB7IHQub2xkUmVjb3JkID0gdHJhbnNhY3Rpb24ub2xkUmVjb3JkOyB9XG4gICAgICB0LnZlcmlmaWVkID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdC52ZXJpZmllZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0O1xuICB9O1xuXG4gIGNvbnN0IHBpY2tPbmUgPSBhc3luYyAodHJhbnMsIGZvclR5cGUpID0+IHtcbiAgICBjb25zdCB0cmFuc0ZvclR5cGUgPSBmaWx0ZXIoZm9yVHlwZSkodHJhbnMpO1xuICAgIGlmICh0cmFuc0ZvclR5cGUubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCB0ID0gYXdhaXQgdmVyaWZ5KHRyYW5zRm9yVHlwZVswXSk7XG4gICAgICByZXR1cm4gKHQudmVyaWZpZWQgPT09IHRydWUgPyB0IDogbnVsbCk7XG4gICAgfVxuICAgIGZvciAobGV0IHQgb2YgdHJhbnNGb3JUeXBlKSB7XG4gICAgICB0ID0gYXdhaXQgdmVyaWZ5KHQpO1xuICAgICAgaWYgKHQudmVyaWZpZWQgPT09IHRydWUpIHsgcmV0dXJuIHQ7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICBmb3IgKGNvbnN0IHJlY29yZElkIGluIHRyYW5zYWN0aW9uSWRzQnlSZWNvcmQpIHtcbiAgICBjb25zdCB0cmFuc0lkc0ZvclJlY29yZCA9IHRyYW5zYWN0aW9uSWRzQnlSZWNvcmRbcmVjb3JkSWRdO1xuICAgIGlmICh0cmFuc0lkc0ZvclJlY29yZC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNvbnN0IHQgPSBhd2FpdCB2ZXJpZnkodHJhbnNJZHNGb3JSZWNvcmRbMF0pO1xuICAgICAgaWYgKHQudmVyaWZpZWQpIHsgZGVkdXBlZFRyYW5zYWN0aW9ucy5wdXNoKHQpOyB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHNvbWUoaXNEZWxldGUpKHRyYW5zSWRzRm9yUmVjb3JkKSkge1xuICAgICAgY29uc3QgdCA9IGF3YWl0IHZlcmlmeShmaW5kKGlzRGVsZXRlKSh0cmFuc0lkc0ZvclJlY29yZCkpO1xuICAgICAgaWYgKHQudmVyaWZpZWQpIHsgZGVkdXBlZFRyYW5zYWN0aW9ucy5wdXNoKHQpOyB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHNvbWUoaXNVcGRhdGUpKHRyYW5zSWRzRm9yUmVjb3JkKSkge1xuICAgICAgY29uc3QgdXBkID0gYXdhaXQgcGlja09uZSh0cmFuc0lkc0ZvclJlY29yZCwgaXNVcGRhdGUpO1xuICAgICAgaWYgKGlzU29tZXRoaW5nKHVwZCkgJiYgdXBkLnZlcmlmaWVkKSB7IGRlZHVwZWRUcmFuc2FjdGlvbnMucHVzaCh1cGQpOyB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHNvbWUoaXNDcmVhdGUpKHRyYW5zSWRzRm9yUmVjb3JkKSkge1xuICAgICAgY29uc3QgY3JlID0gYXdhaXQgcGlja09uZSh0cmFuc0lkc0ZvclJlY29yZCwgaXNDcmVhdGUpO1xuICAgICAgaWYgKGlzU29tZXRoaW5nKGNyZSkpIHsgZGVkdXBlZFRyYW5zYWN0aW9ucy5wdXNoKGNyZSk7IH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGR1cGxpY2F0ZXMgPSAkKHRyYW5zYWN0aW9uSWRzLCBbXG4gICAgZmlsdGVyKHQgPT4gbm9uZShkZHQgPT4gZGR0LnVuaXF1ZUlkID09PSB0LnVuaXF1ZUlkKShkZWR1cGVkVHJhbnNhY3Rpb25zKSksXG4gIF0pO1xuXG5cbiAgY29uc3QgZGVsZXRlUHJvbWlzZXMgPSBtYXAodCA9PiBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUoXG4gICAgam9pbktleShcbiAgICAgIFRSQU5TQUNUSU9OU19GT0xERVIsXG4gICAgICBnZXRUcmFuc2FjdGlvbklkKFxuICAgICAgICB0LnJlY29yZElkLFxuICAgICAgICB0LnRyYW5zYWN0aW9uVHlwZSxcbiAgICAgICAgdC51bmlxdWVJZCxcbiAgICAgICksXG4gICAgKSxcbiAgKSkoZHVwbGljYXRlcyk7XG5cbiAgYXdhaXQgUHJvbWlzZS5hbGwoZGVsZXRlUHJvbWlzZXMpO1xuXG4gIHJldHVybiBkZWR1cGVkVHJhbnNhY3Rpb25zO1xufTtcblxuY29uc3QgcGFyc2VUcmFuc2FjdGlvbklkID0gKGlkKSA9PiB7XG4gIGNvbnN0IHNwbGl0SWQgPSBzcGxpdChpZFNlcCkoaWQpO1xuICByZXR1cm4gKHtcbiAgICByZWNvcmRJZDogc3BsaXRJZFswXSxcbiAgICB0cmFuc2FjdGlvblR5cGU6IHNwbGl0SWRbMV0sXG4gICAgdW5pcXVlSWQ6IHNwbGl0SWRbMl0sXG4gICAgZnVsbElkOiBpZCxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgb3JkZXJCeSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICByZWR1Y2UsIGZpbmQsIGluY2x1ZGVzLCBmbGF0dGVuLCB1bmlvbixcbiAgZmlsdGVyLCBlYWNoLCBtYXAsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBqb2luS2V5LCBzcGxpdEtleSwgaXNOb25FbXB0eVN0cmluZyxcbiAgaXNOb3RoaW5nLCAkLCBpc1NvbWV0aGluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSwgZ2V0Tm9kZSwgZ2V0UmVjb3JkTm9kZUlkLFxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLCByZWNvcmROb2RlSWRJc0FsbG93ZWQsXG4gIGlzUmVjb3JkLCBpc0dsb2JhbEluZGV4LFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgaW5kZXhUeXBlcyB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2luZGV4ZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVsZXZhbnRBbmNlc3RvckluZGV4ZXMgPSAoYXBwSGllcmFyY2h5LCByZWNvcmQpID0+IHtcbiAgY29uc3Qga2V5ID0gcmVjb3JkLmtleTtcbiAgY29uc3Qga2V5UGFydHMgPSBzcGxpdEtleShrZXkpO1xuICBjb25zdCBub2RlSWQgPSBnZXRSZWNvcmROb2RlSWQoa2V5KTtcblxuICBjb25zdCBmbGF0SGllcmFyY2h5ID0gb3JkZXJCeShnZXRGbGF0dGVuZWRIaWVyYXJjaHkoYXBwSGllcmFyY2h5KSxcbiAgICBbbm9kZSA9PiBub2RlLnBhdGhSZWd4KCkubGVuZ3RoXSxcbiAgICBbJ2Rlc2MnXSk7XG5cbiAgY29uc3QgbWFrZWluZGV4Tm9kZUFuZEtleV9Gb3JBbmNlc3RvckluZGV4ID0gKGluZGV4Tm9kZSwgaW5kZXhLZXkpID0+IG1ha2VJbmRleE5vZGVBbmRLZXkoaW5kZXhOb2RlLCBqb2luS2V5KGluZGV4S2V5LCBpbmRleE5vZGUubmFtZSkpO1xuXG4gIGNvbnN0IHRyYXZlcnNlQW5jZXN0b3JJbmRleGVzSW5QYXRoID0gKCkgPT4gcmVkdWNlKChhY2MsIHBhcnQpID0+IHtcbiAgICBjb25zdCBjdXJyZW50SW5kZXhLZXkgPSBqb2luS2V5KGFjYy5sYXN0SW5kZXhLZXksIHBhcnQpO1xuICAgIGFjYy5sYXN0SW5kZXhLZXkgPSBjdXJyZW50SW5kZXhLZXk7XG4gICAgY29uc3QgdGVzdFBhdGhSZWd4ID0gcCA9PiBuZXcgUmVnRXhwKGAke3AucGF0aFJlZ3goKX0kYCkudGVzdChjdXJyZW50SW5kZXhLZXkpO1xuICAgIGNvbnN0IG5vZGVNYXRjaCA9IGZpbmQodGVzdFBhdGhSZWd4KShmbGF0SGllcmFyY2h5KTtcblxuICAgIGlmIChpc05vdGhpbmcobm9kZU1hdGNoKSkgeyByZXR1cm4gYWNjOyB9XG5cbiAgICBpZiAoIWlzUmVjb3JkKG5vZGVNYXRjaClcbiAgICAgICAgICAgICAgICB8fCBub2RlTWF0Y2guaW5kZXhlcy5sZW5ndGggPT09IDApIHsgcmV0dXJuIGFjYzsgfVxuXG4gICAgY29uc3QgaW5kZXhlcyA9ICQobm9kZU1hdGNoLmluZGV4ZXMsIFtcbiAgICAgIGZpbHRlcihpID0+IGkuaW5kZXhUeXBlID09PSBpbmRleFR5cGVzLmFuY2VzdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAoaS5hbGxvd2VkUmVjb3JkTm9kZUlkcy5sZW5ndGggPT09IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICB8fCBpbmNsdWRlcyhub2RlSWQpKGkuYWxsb3dlZFJlY29yZE5vZGVJZHMpKSksXG4gICAgXSk7XG5cbiAgICBlYWNoKHYgPT4gYWNjLm5vZGVzQW5kS2V5cy5wdXNoKFxuICAgICAgbWFrZWluZGV4Tm9kZUFuZEtleV9Gb3JBbmNlc3RvckluZGV4KHYsIGN1cnJlbnRJbmRleEtleSksXG4gICAgKSkoaW5kZXhlcyk7XG5cbiAgICByZXR1cm4gYWNjO1xuICB9LCB7IGxhc3RJbmRleEtleTogJycsIG5vZGVzQW5kS2V5czogW10gfSkoa2V5UGFydHMpLm5vZGVzQW5kS2V5cztcblxuICBjb25zdCByb290SW5kZXhlcyA9ICQoZmxhdEhpZXJhcmNoeSwgW1xuICAgIGZpbHRlcihuID0+IGlzR2xvYmFsSW5kZXgobikgJiYgcmVjb3JkTm9kZUlkSXNBbGxvd2VkKG4pKG5vZGVJZCkpLFxuICAgIG1hcChpID0+IG1ha2VJbmRleE5vZGVBbmRLZXkoaSwgaS5ub2RlS2V5KCkpKSxcbiAgXSk7XG5cbiAgcmV0dXJuIHVuaW9uKHRyYXZlcnNlQW5jZXN0b3JJbmRleGVzSW5QYXRoKCkpKHJvb3RJbmRleGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRSZWxldmFudFJldmVyc2VSZWZlcmVuY2VJbmRleGVzID0gKGFwcEhpZXJhcmNoeSwgcmVjb3JkKSA9PiAkKHJlY29yZC5rZXksIFtcbiAgZ2V0RXhhY3ROb2RlRm9yUGF0aChhcHBIaWVyYXJjaHkpLFxuICBuID0+IG4uZmllbGRzLFxuICBmaWx0ZXIoZiA9PiBmLnR5cGUgPT09ICdyZWZlcmVuY2UnXG4gICAgICAgICAgICAgICAgICAgICYmIGlzU29tZXRoaW5nKHJlY29yZFtmLm5hbWVdKVxuICAgICAgICAgICAgICAgICAgICAmJiBpc05vbkVtcHR5U3RyaW5nKHJlY29yZFtmLm5hbWVdLmtleSkpLFxuICBtYXAoZiA9PiAkKGYudHlwZU9wdGlvbnMucmV2ZXJzZUluZGV4Tm9kZUtleXMsIFtcbiAgICBtYXAobiA9PiAoe1xuICAgICAgcmVjb3JkTm9kZTogZ2V0Tm9kZShhcHBIaWVyYXJjaHksIG4pLFxuICAgICAgZmllbGQ6IGYsXG4gICAgfSkpLFxuICBdKSksXG4gIGZsYXR0ZW4sXG4gIG1hcChuID0+IG1ha2VJbmRleE5vZGVBbmRLZXkoXG4gICAgbi5yZWNvcmROb2RlLFxuICAgIGpvaW5LZXkocmVjb3JkW24uZmllbGQubmFtZV0ua2V5LCBuLnJlY29yZE5vZGUubmFtZSksXG4gICkpLFxuXSk7XG5cbmNvbnN0IG1ha2VJbmRleE5vZGVBbmRLZXkgPSAoaW5kZXhOb2RlLCBpbmRleEtleSkgPT4gKHsgaW5kZXhOb2RlLCBpbmRleEtleSB9KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmVsZXZhbnRBbmNlc3RvckluZGV4ZXM7XG4iLCIgIC8vIGFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZGV4NGVyL2pzLXByb21pc2Utd3JpdGFibGVcbiAgLy8gVGhhbmsgeW91IDopIFxuICBleHBvcnQgY29uc3QgcHJvbWlzZVdyaXRlYWJsZVN0cmVhbSA9IHN0cmVhbSA9PiB7XG4gIFxuICAgIGxldCBfZXJyb3JlZDtcbiAgXG4gICAgY29uc3QgX2Vycm9ySGFuZGxlciA9IGVyciA9PiB7XG4gICAgICAgIF9lcnJvcmVkID0gZXJyO1xuICAgIH07XG5cbiAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBfZXJyb3JIYW5kbGVyKTsgICAgXG4gIFxuICAgIGNvbnN0IHdyaXRlID0gY2h1bmsgPT4geyAgXG4gICAgICBsZXQgcmVqZWN0ZWQgPSBmYWxzZTtcbiAgXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoX2Vycm9yZWQpIHtcbiAgICAgICAgICBjb25zdCBlcnIgPSBfZXJyb3JlZDtcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGlmICghc3RyZWFtLndyaXRhYmxlIHx8IHN0cmVhbS5jbG9zZWQgfHwgc3RyZWFtLmRlc3Ryb3llZCkge1xuICAgICAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKFwid3JpdGUgYWZ0ZXIgZW5kXCIpKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3Qgd3JpdGVFcnJvckhhbmRsZXIgPSBlcnIgPT4ge1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJlamVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgc3RyZWFtLm9uY2UoXCJlcnJvclwiLCB3cml0ZUVycm9ySGFuZGxlcik7XG4gIFxuICAgICAgICBjb25zdCBjYW5Xcml0ZSA9IHN0cmVhbS53cml0ZShjaHVuayk7XG4gIFxuICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCB3cml0ZUVycm9ySGFuZGxlcik7XG4gIFxuICAgICAgICBpZiAoY2FuV3JpdGUpIHtcbiAgICAgICAgICBpZiAoIXJlamVjdGVkKSB7XG4gICAgICAgICAgICByZXNvbHZlKGNodW5rLmxlbmd0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IGVyciA9PiB7XG4gICAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICBjb25zdCBkcmFpbkhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHJlc29sdmUoY2h1bmsubGVuZ3RoKTtcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIGNvbnN0IGNsb3NlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVzb2x2ZShjaHVuay5sZW5ndGgpO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgY29uc3QgZmluaXNoSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVzb2x2ZShjaHVuay5sZW5ndGgpO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgY29uc3QgcmVtb3ZlTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiY2xvc2VcIiwgY2xvc2VIYW5kbGVyKTtcbiAgICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImRyYWluXCIsIGRyYWluSGFuZGxlcik7XG4gICAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xuICAgICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZmluaXNoXCIsIGZpbmlzaEhhbmRsZXIpO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgc3RyZWFtLm9uKFwiY2xvc2VcIiwgY2xvc2VIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ub24oXCJkcmFpblwiLCBkcmFpbkhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5vbihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gICAgICAgICAgc3RyZWFtLm9uKFwiZmluaXNoXCIsIGZpbmlzaEhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgXG4gICAgY29uc3QgZW5kID0gKCkgPT4ge1xuICBcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGlmIChfZXJyb3JlZCkge1xuICAgICAgICAgIGNvbnN0IGVyciA9IF9lcnJvcmVkO1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgaWYgKCFzdHJlYW0ud3JpdGFibGUgfHwgc3RyZWFtLmNsb3NlZCB8fCBzdHJlYW0uZGVzdHJveWVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgZmluaXNoSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IChlcnIpID0+IHtcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgcmVtb3ZlTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZmluaXNoXCIsIGZpbmlzaEhhbmRsZXIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBzdHJlYW0ub24oXCJmaW5pc2hcIiwgZmluaXNoSGFuZGxlcik7XG4gICAgICAgIHN0cmVhbS5vbihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gIFxuICAgICAgICBzdHJlYW0uZW5kKCk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiB7d3JpdGUsIGVuZH07XG4gIH1cbiAgXG4gIGV4cG9ydCBkZWZhdWx0IHByb21pc2VXcml0ZWFibGVTdHJlYW1cbiAgIiwiaW1wb3J0IHsgZW5zdXJlU2hhcmROYW1lSXNJblNoYXJkTWFwIH0gZnJvbSAnLi9zaGFyZGluZyc7XG5pbXBvcnQgeyBnZXRJbmRleFdyaXRlciB9IGZyb20gJy4vc2VyaWFsaXplcic7XG5pbXBvcnQgeyBpc1NoYXJkZWRJbmRleCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge3Byb21pc2VXcml0ZWFibGVTdHJlYW19IGZyb20gXCIuL3Byb21pc2VXcml0YWJsZVN0cmVhbVwiO1xuaW1wb3J0IHtwcm9taXNlUmVhZGFibGVTdHJlYW19IGZyb20gXCIuL3Byb21pc2VSZWFkYWJsZVN0cmVhbVwiO1xuXG5leHBvcnQgY29uc3QgYXBwbHlUb1NoYXJkID0gYXN5bmMgKGhpZXJhcmNoeSwgc3RvcmUsIGluZGV4S2V5LFxuICBpbmRleE5vZGUsIGluZGV4U2hhcmRLZXksIHJlY29yZHNUb1dyaXRlLCBrZXlzVG9SZW1vdmUpID0+IHtcbiAgY29uc3QgY3JlYXRlSWZOb3RFeGlzdHMgPSByZWNvcmRzVG9Xcml0ZS5sZW5ndGggPiAwO1xuICBjb25zdCB3cml0ZXIgPSBhd2FpdCBnZXRXcml0ZXIoaGllcmFyY2h5LCBzdG9yZSwgaW5kZXhLZXksIGluZGV4U2hhcmRLZXksIGluZGV4Tm9kZSwgY3JlYXRlSWZOb3RFeGlzdHMpO1xuICBpZiAod3JpdGVyID09PSBTSEFSRF9ERUxFVEVEKSByZXR1cm47XG5cbiAgYXdhaXQgd3JpdGVyLnVwZGF0ZUluZGV4KHJlY29yZHNUb1dyaXRlLCBrZXlzVG9SZW1vdmUpO1xuICBhd2FpdCBzd2FwVGVtcEZpbGVJbihzdG9yZSwgaW5kZXhTaGFyZEtleSk7XG59O1xuXG5jb25zdCBTSEFSRF9ERUxFVEVEID0gJ1NIQVJEX0RFTEVURUQnO1xuY29uc3QgZ2V0V3JpdGVyID0gYXN5bmMgKGhpZXJhcmNoeSwgc3RvcmUsIGluZGV4S2V5LCBpbmRleGVkRGF0YUtleSwgaW5kZXhOb2RlLCBjcmVhdGVJZk5vdEV4aXN0cykgPT4ge1xuICBsZXQgcmVhZGFibGVTdHJlYW0gPSBudWxsO1xuXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleE5vZGUpKSB7XG4gICAgYXdhaXQgZW5zdXJlU2hhcmROYW1lSXNJblNoYXJkTWFwKHN0b3JlLCBpbmRleEtleSwgaW5kZXhlZERhdGFLZXkpO1xuICAgIGlmKCFhd2FpdCBzdG9yZS5leGlzdHMoaW5kZXhlZERhdGFLZXkpKSB7XG4gICAgICBhd2FpdCBzdG9yZS5jcmVhdGVGaWxlKGluZGV4ZWREYXRhS2V5LCBcIlwiKTtcbiAgICB9XG4gIH1cblxuICB0cnkge1xuXG4gICAgcmVhZGFibGVTdHJlYW0gPSBwcm9taXNlUmVhZGFibGVTdHJlYW0oXG4gICAgICAgIGF3YWl0IHN0b3JlLnJlYWRhYmxlRmlsZVN0cmVhbShpbmRleGVkRGF0YUtleSlcbiAgICApO1xuXG4gIH0gY2F0Y2ggKGUpIHtcblxuICAgIGlmIChhd2FpdCBzdG9yZS5leGlzdHMoaW5kZXhlZERhdGFLZXkpKSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY3JlYXRlSWZOb3RFeGlzdHMpIHsgXG4gICAgICAgIGF3YWl0IHN0b3JlLmNyZWF0ZUZpbGUoaW5kZXhlZERhdGFLZXksICcnKTsgXG4gICAgICB9IGVsc2UgeyBcbiAgICAgICAgcmV0dXJuIFNIQVJEX0RFTEVURUQ7IFxuICAgICAgfVxuXG4gICAgICByZWFkYWJsZVN0cmVhbSA9IHByb21pc2VSZWFkYWJsZVN0cmVhbShcbiAgICAgICAgICBhd2FpdCBzdG9yZS5yZWFkYWJsZUZpbGVTdHJlYW0oaW5kZXhlZERhdGFLZXkpXG4gICAgICApO1xuXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgd3JpdGFibGVTdHJlYW0gPSBwcm9taXNlV3JpdGVhYmxlU3RyZWFtKFxuICAgICAgYXdhaXQgc3RvcmUud3JpdGFibGVGaWxlU3RyZWFtKGluZGV4ZWREYXRhS2V5ICsgXCIudGVtcFwiKVxuICApO1xuXG4gIHJldHVybiBnZXRJbmRleFdyaXRlcihcbiAgICBoaWVyYXJjaHksIGluZGV4Tm9kZSxcbiAgICAgICAgcmVhZGFibGVTdHJlYW0sIHdyaXRhYmxlU3RyZWFtXG4gICk7XG59O1xuXG5jb25zdCBzd2FwVGVtcEZpbGVJbiA9IGFzeW5jIChzdG9yZSwgaW5kZXhlZERhdGFLZXksIGlzUmV0cnkgPSBmYWxzZSkgPT4ge1xuICBjb25zdCB0ZW1wRmlsZSA9IGAke2luZGV4ZWREYXRhS2V5fS50ZW1wYDtcbiAgdHJ5IHtcbiAgICBhd2FpdCBzdG9yZS5kZWxldGVGaWxlKGluZGV4ZWREYXRhS2V5KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIGlnbm9yZSBmYWlsdXJlLCBpbmNhc2UgaXQgaGFzIG5vdCBiZWVuIGNyZWF0ZWQgeWV0XG4gIH1cbiAgdHJ5IHtcbiAgICBhd2FpdCBzdG9yZS5yZW5hbWVGaWxlKHRlbXBGaWxlLCBpbmRleGVkRGF0YUtleSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyByZXRyeWluZyBpbiBjYXNlIGRlbGV0ZSBmYWlsdXJlIHdhcyBmb3Igc29tZSBvdGhlciByZWFzb25cbiAgICBpZiAoIWlzUmV0cnkpIHtcbiAgICAgIGF3YWl0IHN3YXBUZW1wRmlsZUluKHN0b3JlLCBpbmRleGVkRGF0YUtleSwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBzd2FwIGluIGluZGV4IGZpbGVkOiBcIiArIGUubWVzc2FnZSk7XG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgZmlsdGVyLCBtYXAsIGlzVW5kZWZpbmVkLCBpbmNsdWRlcyxcbiAgZmxhdHRlbiwgaW50ZXJzZWN0aW9uQnksXG4gIGlzRXF1YWwsIHB1bGwsIGtleXMsXG4gIGRpZmZlcmVuY2VCeSwgZGlmZmVyZW5jZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHVuaW9uIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7XG4gIGdldFJlbGV2YW50QW5jZXN0b3JJbmRleGVzLFxuICBnZXRSZWxldmFudFJldmVyc2VSZWZlcmVuY2VJbmRleGVzLFxufSBmcm9tICcuLi9pbmRleGluZy9yZWxldmFudCc7XG5pbXBvcnQgeyBldmFsdWF0ZSB9IGZyb20gJy4uL2luZGV4aW5nL2V2YWx1YXRlJztcbmltcG9ydCB7XG4gICQsIGlzU29tZXRoaW5nLFxuICBpc05vbkVtcHR5QXJyYXksIGpvaW5LZXksXG4gIGlzTm9uRW1wdHlTdHJpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXRJbmRleGVkRGF0YUtleSB9IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcbmltcG9ydCB7XG4gIGlzVXBkYXRlLCBpc0NyZWF0ZSxcbiAgaXNEZWxldGUsIGlzQnVpbGRJbmRleCxcbn0gZnJvbSAnLi90cmFuc2FjdGlvbnNDb21tb24nO1xuaW1wb3J0IHsgYXBwbHlUb1NoYXJkIH0gZnJvbSAnLi4vaW5kZXhpbmcvYXBwbHknO1xuaW1wb3J0IHtcbiAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQsXG4gIGlzR2xvYmFsSW5kZXgsIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4LCBpc1JlZmVyZW5jZUluZGV4LFxuICBnZXRFeGFjdE5vZGVGb3JQYXRoLFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuXG5leHBvcnQgY29uc3QgZXhlY3V0ZVRyYW5zYWN0aW9ucyA9IGFwcCA9PiBhc3luYyAodHJhbnNhY3Rpb25zKSA9PiB7XG4gIGNvbnN0IHJlY29yZHNCeVNoYXJkID0gbWFwcGVkUmVjb3Jkc0J5SW5kZXhTaGFyZChhcHAuaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMpO1xuXG4gIGZvciAoY29uc3Qgc2hhcmQgb2Yga2V5cyhyZWNvcmRzQnlTaGFyZCkpIHtcbiAgICBhd2FpdCBhcHBseVRvU2hhcmQoXG4gICAgICBhcHAuaGllcmFyY2h5LCBhcHAuZGF0YXN0b3JlLFxuICAgICAgcmVjb3Jkc0J5U2hhcmRbc2hhcmRdLmluZGV4S2V5LFxuICAgICAgcmVjb3Jkc0J5U2hhcmRbc2hhcmRdLmluZGV4Tm9kZSxcbiAgICAgIHNoYXJkLFxuICAgICAgcmVjb3Jkc0J5U2hhcmRbc2hhcmRdLndyaXRlcyxcbiAgICAgIHJlY29yZHNCeVNoYXJkW3NoYXJkXS5yZW1vdmVzLFxuICAgICk7XG4gIH1cbn07XG5cbmNvbnN0IG1hcHBlZFJlY29yZHNCeUluZGV4U2hhcmQgPSAoaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMpID0+IHtcbiAgY29uc3QgdXBkYXRlcyA9IGdldFVwZGF0ZVRyYW5zYWN0aW9uc0J5U2hhcmQoXG4gICAgaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMsXG4gICk7XG5cbiAgY29uc3QgY3JlYXRlZCA9IGdldENyZWF0ZVRyYW5zYWN0aW9uc0J5U2hhcmQoXG4gICAgaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMsXG4gICk7XG4gIGNvbnN0IGRlbGV0ZXMgPSBnZXREZWxldGVUcmFuc2FjdGlvbnNCeVNoYXJkKFxuICAgIGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zLFxuICApO1xuXG4gIGNvbnN0IGluZGV4QnVpbGQgPSBnZXRCdWlsZEluZGV4VHJhbnNhY3Rpb25zQnlTaGFyZChcbiAgICBoaWVyYXJjaHksXG4gICAgdHJhbnNhY3Rpb25zLFxuICApO1xuXG4gIGNvbnN0IHRvUmVtb3ZlID0gW1xuICAgIC4uLmRlbGV0ZXMsXG4gICAgLi4udXBkYXRlcy50b1JlbW92ZSxcbiAgXTtcblxuICBjb25zdCB0b1dyaXRlID0gW1xuICAgIC4uLmNyZWF0ZWQsXG4gICAgLi4udXBkYXRlcy50b1dyaXRlLFxuICAgIC4uLmluZGV4QnVpbGQsXG4gIF07XG5cbiAgY29uc3QgdHJhbnNCeVNoYXJkID0ge307XG5cbiAgY29uc3QgaW5pdGlhbGlzZVNoYXJkID0gKHQpID0+IHtcbiAgICBpZiAoaXNVbmRlZmluZWQodHJhbnNCeVNoYXJkW3QuaW5kZXhTaGFyZEtleV0pKSB7XG4gICAgICB0cmFuc0J5U2hhcmRbdC5pbmRleFNoYXJkS2V5XSA9IHtcbiAgICAgICAgd3JpdGVzOiBbXSxcbiAgICAgICAgcmVtb3ZlczogW10sXG4gICAgICAgIGluZGV4S2V5OiB0LmluZGV4S2V5LFxuICAgICAgICBpbmRleE5vZGVLZXk6IHQuaW5kZXhOb2RlS2V5LFxuICAgICAgICBpbmRleE5vZGU6IHQuaW5kZXhOb2RlLFxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cbiAgZm9yIChjb25zdCB0cmFucyBvZiB0b1dyaXRlKSB7XG4gICAgaW5pdGlhbGlzZVNoYXJkKHRyYW5zKTtcbiAgICB0cmFuc0J5U2hhcmRbdHJhbnMuaW5kZXhTaGFyZEtleV0ud3JpdGVzLnB1c2goXG4gICAgICB0cmFucy5tYXBwZWRSZWNvcmQucmVzdWx0LFxuICAgICk7XG4gIH1cblxuICBmb3IgKGNvbnN0IHRyYW5zIG9mIHRvUmVtb3ZlKSB7XG4gICAgaW5pdGlhbGlzZVNoYXJkKHRyYW5zKTtcbiAgICB0cmFuc0J5U2hhcmRbdHJhbnMuaW5kZXhTaGFyZEtleV0ucmVtb3Zlcy5wdXNoKFxuICAgICAgdHJhbnMubWFwcGVkUmVjb3JkLnJlc3VsdC5rZXksXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiB0cmFuc0J5U2hhcmQ7XG59O1xuXG5jb25zdCBnZXRVcGRhdGVUcmFuc2FjdGlvbnNCeVNoYXJkID0gKGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKSA9PiB7XG4gIGNvbnN0IHVwZGF0ZVRyYW5zYWN0aW9ucyA9ICQodHJhbnNhY3Rpb25zLCBbZmlsdGVyKGlzVXBkYXRlKV0pO1xuXG4gIGNvbnN0IGV2YWx1YXRlSW5kZXggPSAocmVjb3JkLCBpbmRleE5vZGVBbmRQYXRoKSA9PiB7XG4gICAgY29uc3QgbWFwcGVkUmVjb3JkID0gZXZhbHVhdGUocmVjb3JkKShpbmRleE5vZGVBbmRQYXRoLmluZGV4Tm9kZSk7XG4gICAgcmV0dXJuICh7XG4gICAgICBtYXBwZWRSZWNvcmQsXG4gICAgICBpbmRleE5vZGU6IGluZGV4Tm9kZUFuZFBhdGguaW5kZXhOb2RlLFxuICAgICAgaW5kZXhLZXk6IGluZGV4Tm9kZUFuZFBhdGguaW5kZXhLZXksXG4gICAgICBpbmRleFNoYXJkS2V5OiBnZXRJbmRleGVkRGF0YUtleShcbiAgICAgICAgaW5kZXhOb2RlQW5kUGF0aC5pbmRleE5vZGUsXG4gICAgICAgIGluZGV4Tm9kZUFuZFBhdGguaW5kZXhLZXksXG4gICAgICAgIG1hcHBlZFJlY29yZC5yZXN1bHQsXG4gICAgICApLFxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGdldEluZGV4Tm9kZXNUb0FwcGx5ID0gaW5kZXhGaWx0ZXIgPT4gKHQsIGluZGV4ZXMpID0+ICQoaW5kZXhlcywgW1xuICAgIG1hcChuID0+ICh7XG4gICAgICBvbGQ6IGV2YWx1YXRlSW5kZXgodC5vbGRSZWNvcmQsIG4pLFxuICAgICAgbmV3OiBldmFsdWF0ZUluZGV4KHQucmVjb3JkLCBuKSxcbiAgICB9KSksXG4gICAgZmlsdGVyKGluZGV4RmlsdGVyKSxcbiAgXSk7XG5cbiAgY29uc3QgdG9SZW1vdmVGaWx0ZXIgPSAobiwgaXNVbnJlZmVyZW5jZWQpID0+IG4ub2xkLm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IHRydWVcbiAgICAgICAgJiYgKG4ubmV3Lm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IGZhbHNlXG4gICAgICAgICAgICB8fCBpc1VucmVmZXJlbmNlZCk7XG5cbiAgY29uc3QgdG9BZGRGaWx0ZXIgPSAobiwgaXNOZXdseVJlZmVyZW5jZWQpID0+IChuLm9sZC5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSBmYWxzZVxuICAgICAgICB8fCBpc05ld2x5UmVmZXJlbmNlZClcbiAgICAgICAgJiYgbi5uZXcubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gdHJ1ZTtcblxuICBjb25zdCB0b1VwZGF0ZUZpbHRlciA9IG4gPT4gbi5uZXcubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gdHJ1ZVxuICAgICAgICAmJiBuLm9sZC5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSB0cnVlXG4gICAgICAgICYmICFpc0VxdWFsKG4ub2xkLm1hcHBlZFJlY29yZC5yZXN1bHQsXG4gICAgICAgICAgbi5uZXcubWFwcGVkUmVjb3JkLnJlc3VsdCk7XG5cbiAgY29uc3QgdG9SZW1vdmUgPSBbXTtcbiAgY29uc3QgdG9Xcml0ZSA9IFtdO1xuXG4gIGZvciAoY29uc3QgdCBvZiB1cGRhdGVUcmFuc2FjdGlvbnMpIHtcbiAgICBjb25zdCBhbmNlc3RvcklkeHMgPSBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcyhcbiAgICAgIGhpZXJhcmNoeSwgdC5yZWNvcmQsXG4gICAgKTtcblxuICAgIGNvbnN0IHJlZmVyZW5jZUNoYW5nZXMgPSBkaWZmUmV2ZXJzZVJlZkZvclVwZGF0ZShcbiAgICAgIGhpZXJhcmNoeSwgdC5vbGRSZWNvcmQsIHQucmVjb3JkLFxuICAgICk7XG5cbiAgICAvLyBvbGQgcmVjb3JkcyB0byByZW1vdmUgKGZpbHRlcmVkIG91dClcbiAgICBjb25zdCBmaWx0ZXJlZE91dF90b1JlbW92ZSA9IHVuaW9uKFxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodG9SZW1vdmVGaWx0ZXIpKHQsIGFuY2VzdG9ySWR4cyksXG4gICAgICAvLyBzdGlsbCByZWZlcmVuY2VkIC0gY2hlY2sgZmlsdGVyXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b1JlbW92ZUZpbHRlcikodCwgcmVmZXJlbmNlQ2hhbmdlcy5ub3RDaGFuZ2VkKSxcbiAgICAgIC8vIHVuIHJlZmVyZW5jZWQgLSByZW1vdmUgaWYgaW4gdGhlcmUgYWxyZWFkeVxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkobiA9PiB0b1JlbW92ZUZpbHRlcihuLCB0cnVlKSkodCwgcmVmZXJlbmNlQ2hhbmdlcy51blJlZmVyZW5jZWQpLFxuICAgICk7XG5cbiAgICAvLyBuZXcgcmVjb3JkcyB0byBhZGQgKGZpbHRlcmVkIGluKVxuICAgIGNvbnN0IGZpbHRlcmVkSW5fdG9BZGQgPSB1bmlvbihcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvQWRkRmlsdGVyKSh0LCBhbmNlc3RvcklkeHMpLFxuICAgICAgLy8gbmV3bHkgcmVmZXJlbmNlZCAtIGNoZWNrIGZpbHRlclxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkobiA9PiB0b0FkZEZpbHRlcihuLCB0cnVlKSkodCwgcmVmZXJlbmNlQ2hhbmdlcy5uZXdseVJlZmVyZW5jZWQpLFxuICAgICAgLy8gcmVmZXJlbmNlIHVuY2hhbmdlZCAtIHJlcnVuIGZpbHRlciBpbiBjYXNlIHNvbWV0aGluZyBlbHNlIGNoYW5nZWRcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvQWRkRmlsdGVyKSh0LCByZWZlcmVuY2VDaGFuZ2VzLm5vdENoYW5nZWQpLFxuICAgICk7XG5cbiAgICBjb25zdCBjaGFuZ2VkID0gdW5pb24oXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b1VwZGF0ZUZpbHRlcikodCwgYW5jZXN0b3JJZHhzKSxcbiAgICAgIC8vIHN0aWxsIHJlZmVyZW5jZWQgLSByZWNoZWNrIGZpbHRlclxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodG9VcGRhdGVGaWx0ZXIpKHQsIHJlZmVyZW5jZUNoYW5nZXMubm90Q2hhbmdlZCksXG4gICAgKTtcblxuICAgIGNvbnN0IHNoYXJkS2V5Q2hhbmdlZCA9ICQoY2hhbmdlZCwgW1xuICAgICAgZmlsdGVyKGMgPT4gYy5vbGQuaW5kZXhTaGFyZEtleSAhPT0gYy5uZXcuaW5kZXhTaGFyZEtleSksXG4gICAgXSk7XG5cbiAgICBjb25zdCBjaGFuZ2VkSW5TYW1lU2hhcmQgPSAkKHNoYXJkS2V5Q2hhbmdlZCwgW1xuICAgICAgZGlmZmVyZW5jZShjaGFuZ2VkKSxcbiAgICBdKTtcblxuICAgIGZvciAoY29uc3QgcmVzIG9mIHNoYXJkS2V5Q2hhbmdlZCkge1xuICAgICAgcHVsbChyZXMpKGNoYW5nZWQpO1xuICAgICAgZmlsdGVyZWRPdXRfdG9SZW1vdmUucHVzaChyZXMpO1xuICAgICAgZmlsdGVyZWRJbl90b0FkZC5wdXNoKHJlcyk7XG4gICAgfVxuXG4gICAgdG9SZW1vdmUucHVzaChcbiAgICAgICQoZmlsdGVyZWRPdXRfdG9SZW1vdmUsIFtcbiAgICAgICAgbWFwKGkgPT4gaS5vbGQpLFxuICAgICAgXSksXG4gICAgKTtcblxuICAgIHRvV3JpdGUucHVzaChcbiAgICAgICQoZmlsdGVyZWRJbl90b0FkZCwgW1xuICAgICAgICBtYXAoaSA9PiBpLm5ldyksXG4gICAgICBdKSxcbiAgICApO1xuXG4gICAgdG9Xcml0ZS5wdXNoKFxuICAgICAgJChjaGFuZ2VkSW5TYW1lU2hhcmQsIFtcbiAgICAgICAgbWFwKGkgPT4gaS5uZXcpLFxuICAgICAgXSksXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiAoe1xuICAgIHRvUmVtb3ZlOiBmbGF0dGVuKHRvUmVtb3ZlKSxcbiAgICB0b1dyaXRlOiBmbGF0dGVuKHRvV3JpdGUpLFxuICB9KTtcbn07XG5cbmNvbnN0IGdldEJ1aWxkSW5kZXhUcmFuc2FjdGlvbnNCeVNoYXJkID0gKGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKSA9PiB7XG4gIGNvbnN0IGJ1aWxkVHJhbnNhY3Rpb25zID0gJCh0cmFuc2FjdGlvbnMsIFtmaWx0ZXIoaXNCdWlsZEluZGV4KV0pO1xuICBpZiAoIWlzTm9uRW1wdHlBcnJheShidWlsZFRyYW5zYWN0aW9ucykpIHJldHVybiBbXTtcbiAgY29uc3QgaW5kZXhOb2RlID0gdHJhbnNhY3Rpb25zLmluZGV4Tm9kZTtcblxuICBjb25zdCBnZXRJbmRleEtleXMgPSAodCkgPT4ge1xuICAgIGlmIChpc0dsb2JhbEluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICAgIHJldHVybiBbaW5kZXhOb2RlLm5vZGVLZXkoKV07XG4gICAgfVxuXG4gICAgaWYgKGlzUmVmZXJlbmNlSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgICAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvclBhdGgoaGllcmFyY2h5KSh0LnJlY29yZC5rZXkpO1xuICAgICAgY29uc3QgcmVmRmllbGRzID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICAgICAgICBmaWx0ZXIoZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXgoaW5kZXhOb2RlKSksXG4gICAgICBdKTtcbiAgICAgIGNvbnN0IGluZGV4S2V5cyA9IFtdO1xuICAgICAgZm9yIChjb25zdCByZWZGaWVsZCBvZiByZWZGaWVsZHMpIHtcbiAgICAgICAgY29uc3QgcmVmVmFsdWUgPSB0LnJlY29yZFtyZWZGaWVsZC5uYW1lXTtcbiAgICAgICAgaWYgKGlzU29tZXRoaW5nKHJlZlZhbHVlKVxuICAgICAgICAgICAgICAgICAgICYmIGlzTm9uRW1wdHlTdHJpbmcocmVmVmFsdWUua2V5KSkge1xuICAgICAgICAgIGNvbnN0IGluZGV4S2V5ID0gam9pbktleShcbiAgICAgICAgICAgIHJlZlZhbHVlLmtleSxcbiAgICAgICAgICAgIGluZGV4Tm9kZS5uYW1lLFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAoIWluY2x1ZGVzKGluZGV4S2V5KShpbmRleEtleXMpKSB7IGluZGV4S2V5cy5wdXNoKGluZGV4S2V5KTsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaW5kZXhLZXlzO1xuICAgIH1cblxuICAgIHJldHVybiBbam9pbktleShcbiAgICAgIGdldEFjdHVhbEtleU9mUGFyZW50KFxuICAgICAgICBpbmRleE5vZGUucGFyZW50KCkubm9kZUtleSgpLFxuICAgICAgICB0LnJlY29yZC5rZXksXG4gICAgICApLFxuICAgICAgaW5kZXhOb2RlLm5hbWUsXG4gICAgKV07XG4gIH07XG5cbiAgcmV0dXJuICQoYnVpbGRUcmFuc2FjdGlvbnMsIFtcbiAgICBtYXAoKHQpID0+IHtcbiAgICAgIGNvbnN0IG1hcHBlZFJlY29yZCA9IGV2YWx1YXRlKHQucmVjb3JkKShpbmRleE5vZGUpO1xuICAgICAgaWYgKCFtYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyKSByZXR1cm4gbnVsbDtcbiAgICAgIGNvbnN0IGluZGV4S2V5cyA9IGdldEluZGV4S2V5cyh0KTtcbiAgICAgIHJldHVybiAkKGluZGV4S2V5cywgW1xuICAgICAgICBtYXAoaW5kZXhLZXkgPT4gKHtcbiAgICAgICAgICBtYXBwZWRSZWNvcmQsXG4gICAgICAgICAgaW5kZXhOb2RlLFxuICAgICAgICAgIGluZGV4S2V5LFxuICAgICAgICAgIGluZGV4U2hhcmRLZXk6IGdldEluZGV4ZWREYXRhS2V5KFxuICAgICAgICAgICAgaW5kZXhOb2RlLFxuICAgICAgICAgICAgaW5kZXhLZXksXG4gICAgICAgICAgICBtYXBwZWRSZWNvcmQucmVzdWx0LFxuICAgICAgICAgICksXG4gICAgICAgIH0pKSxcbiAgICAgIF0pO1xuICAgIH0pLFxuICAgIGZsYXR0ZW4sXG4gICAgZmlsdGVyKGlzU29tZXRoaW5nKSxcbiAgXSk7XG59O1xuXG5jb25zdCBnZXRfQ3JlYXRlX0RlbGV0ZV9UcmFuc2FjdGlvbnNCeVNoYXJkID0gcHJlZCA9PiAoaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMpID0+IHtcbiAgY29uc3QgY3JlYXRlVHJhbnNhY3Rpb25zID0gJCh0cmFuc2FjdGlvbnMsIFtmaWx0ZXIocHJlZCldKTtcblxuICBjb25zdCBnZXRJbmRleE5vZGVzVG9BcHBseSA9ICh0LCBpbmRleGVzKSA9PiAkKGluZGV4ZXMsIFtcbiAgICBtYXAoKG4pID0+IHtcbiAgICAgIGNvbnN0IG1hcHBlZFJlY29yZCA9IGV2YWx1YXRlKHQucmVjb3JkKShuLmluZGV4Tm9kZSk7XG4gICAgICByZXR1cm4gKHtcbiAgICAgICAgbWFwcGVkUmVjb3JkLFxuICAgICAgICBpbmRleE5vZGU6IG4uaW5kZXhOb2RlLFxuICAgICAgICBpbmRleEtleTogbi5pbmRleEtleSxcbiAgICAgICAgaW5kZXhTaGFyZEtleTogZ2V0SW5kZXhlZERhdGFLZXkoXG4gICAgICAgICAgbi5pbmRleE5vZGUsXG4gICAgICAgICAgbi5pbmRleEtleSxcbiAgICAgICAgICBtYXBwZWRSZWNvcmQucmVzdWx0LFxuICAgICAgICApLFxuICAgICAgfSk7XG4gICAgfSksXG4gICAgZmlsdGVyKG4gPT4gbi5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyKSxcbiAgXSk7XG5cbiAgY29uc3QgYWxsVG9BcHBseSA9IFtdO1xuXG4gIGZvciAoY29uc3QgdCBvZiBjcmVhdGVUcmFuc2FjdGlvbnMpIHtcbiAgICBjb25zdCBhbmNlc3RvcklkeHMgPSBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcyhoaWVyYXJjaHksIHQucmVjb3JkKTtcbiAgICBjb25zdCByZXZlcnNlUmVmID0gZ2V0UmVsZXZhbnRSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyhoaWVyYXJjaHksIHQucmVjb3JkKTtcblxuICAgIGFsbFRvQXBwbHkucHVzaChcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHQsIGFuY2VzdG9ySWR4cyksXG4gICAgKTtcbiAgICBhbGxUb0FwcGx5LnB1c2goXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0LCByZXZlcnNlUmVmKSxcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIGZsYXR0ZW4oYWxsVG9BcHBseSk7XG59O1xuXG5jb25zdCBnZXREZWxldGVUcmFuc2FjdGlvbnNCeVNoYXJkID0gZ2V0X0NyZWF0ZV9EZWxldGVfVHJhbnNhY3Rpb25zQnlTaGFyZChpc0RlbGV0ZSk7XG5cbmNvbnN0IGdldENyZWF0ZVRyYW5zYWN0aW9uc0J5U2hhcmQgPSBnZXRfQ3JlYXRlX0RlbGV0ZV9UcmFuc2FjdGlvbnNCeVNoYXJkKGlzQ3JlYXRlKTtcblxuY29uc3QgZGlmZlJldmVyc2VSZWZGb3JVcGRhdGUgPSAoYXBwSGllcmFyY2h5LCBvbGRSZWNvcmQsIG5ld1JlY29yZCkgPT4ge1xuICBjb25zdCBvbGRJbmRleGVzID0gZ2V0UmVsZXZhbnRSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyhcbiAgICBhcHBIaWVyYXJjaHksIG9sZFJlY29yZCxcbiAgKTtcbiAgY29uc3QgbmV3SW5kZXhlcyA9IGdldFJlbGV2YW50UmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMoXG4gICAgYXBwSGllcmFyY2h5LCBuZXdSZWNvcmQsXG4gICk7XG5cbiAgY29uc3QgdW5SZWZlcmVuY2VkID0gZGlmZmVyZW5jZUJ5KFxuICAgIGkgPT4gaS5pbmRleEtleSxcbiAgICBvbGRJbmRleGVzLCBuZXdJbmRleGVzLFxuICApO1xuXG4gIGNvbnN0IG5ld2x5UmVmZXJlbmNlZCA9IGRpZmZlcmVuY2VCeShcbiAgICBpID0+IGkuaW5kZXhLZXksXG4gICAgbmV3SW5kZXhlcywgb2xkSW5kZXhlcyxcbiAgKTtcblxuICBjb25zdCBub3RDaGFuZ2VkID0gaW50ZXJzZWN0aW9uQnkoXG4gICAgaSA9PiBpLmluZGV4S2V5LFxuICAgIG5ld0luZGV4ZXMsIG9sZEluZGV4ZXMsXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICB1blJlZmVyZW5jZWQsXG4gICAgbmV3bHlSZWZlcmVuY2VkLFxuICAgIG5vdENoYW5nZWQsXG4gIH07XG59O1xuIiwiaW1wb3J0IHsgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHJldHJpZXZlIH0gZnJvbSAnLi9yZXRyaWV2ZSc7XG5pbXBvcnQgeyBleGVjdXRlVHJhbnNhY3Rpb25zIH0gZnJvbSAnLi9leGVjdXRlJztcbmltcG9ydCB7XG4gICQsIGpvaW5LZXksIGdldExvY2ssIGlzTm9sb2NrLCByZWxlYXNlTG9jayxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIExPQ0tfRklMRV9LRVksIFRSQU5TQUNUSU9OU19GT0xERVIsXG4gIHRpbWVvdXRNaWxsaXNlY29uZHMsIGdldFRyYW5zYWN0aW9uSWQsXG4gIG1heExvY2tSZXRyaWVzLFxufSBmcm9tICcuL3RyYW5zYWN0aW9uc0NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBjbGVhbnVwID0gYXN5bmMgKGFwcCkgPT4ge1xuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0VHJhbnNhY3Rpb25Mb2NrKGFwcCk7XG4gIGlmIChpc05vbG9jayhsb2NrKSkgcmV0dXJuO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgdHJhbnNhY3Rpb25zID0gYXdhaXQgcmV0cmlldmUoYXBwKTtcbiAgICBpZiAodHJhbnNhY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IGV4ZWN1dGVUcmFuc2FjdGlvbnMoYXBwKSh0cmFuc2FjdGlvbnMpO1xuXG4gICAgICBjb25zdCBmb2xkZXIgPSB0cmFuc2FjdGlvbnMuZm9sZGVyS2V5XG4gICAgICAgID8gdHJhbnNhY3Rpb25zLmZvbGRlcktleVxuICAgICAgICA6IFRSQU5TQUNUSU9OU19GT0xERVI7XG5cbiAgICAgIGNvbnN0IGRlbGV0ZUZpbGVzID0gJCh0cmFuc2FjdGlvbnMsIFtcbiAgICAgICAgbWFwKHQgPT4gam9pbktleShcbiAgICAgICAgICBmb2xkZXIsXG4gICAgICAgICAgZ2V0VHJhbnNhY3Rpb25JZChcbiAgICAgICAgICAgIHQucmVjb3JkSWQsIHQudHJhbnNhY3Rpb25UeXBlLFxuICAgICAgICAgICAgdC51bmlxdWVJZCxcbiAgICAgICAgICApLFxuICAgICAgICApKSxcbiAgICAgICAgbWFwKGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZSksXG4gICAgICBdKTtcblxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoZGVsZXRlRmlsZXMpO1xuICAgIH1cbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xuICB9XG59O1xuXG5jb25zdCBnZXRUcmFuc2FjdGlvbkxvY2sgPSBhc3luYyBhcHAgPT4gYXdhaXQgZ2V0TG9jayhcbiAgYXBwLCBMT0NLX0ZJTEVfS0VZLFxuICB0aW1lb3V0TWlsbGlzZWNvbmRzLCBtYXhMb2NrUmV0cmllcyxcbik7XG4iLCJpbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgY29uZmlnRm9sZGVyLCBhcHBEZWZpbml0aW9uRmlsZSwgJCB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBUUkFOU0FDVElPTlNfRk9MREVSIH0gZnJvbSAnLi4vdHJhbnNhY3Rpb25zL3RyYW5zYWN0aW9uc0NvbW1vbic7XG5pbXBvcnQgeyBBVVRIX0ZPTERFUiwgVVNFUlNfTElTVF9GSUxFLCBBQ0NFU1NfTEVWRUxTX0ZJTEUgfSBmcm9tICcuLi9hdXRoQXBpL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgaW5pdGlhbGlzZVJvb3RDb2xsZWN0aW9ucyB9IGZyb20gJy4uL2NvbGxlY3Rpb25BcGkvaW5pdGlhbGlzZSc7XG5pbXBvcnQgeyBpbml0aWFsaXNlSW5kZXggfSBmcm9tICcuLi9pbmRleGluZy9pbml0aWFsaXNlSW5kZXgnO1xuaW1wb3J0IHsgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LCBpc0dsb2JhbEluZGV4LCBpc1NpbmdsZVJlY29yZCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBfc2F2ZSB9IGZyb20gJy4uL3JlY29yZEFwaS9zYXZlJztcbmltcG9ydCB7IGdldE5ldyB9IGZyb20gJy4uL3JlY29yZEFwaS9nZXROZXcnO1xuXG5leHBvcnQgY29uc3QgaW5pdGlhbGlzZURhdGEgPSBhc3luYyAoZGF0YXN0b3JlLCBhcHBsaWNhdGlvbkRlZmluaXRpb24sIGFjY2Vzc0xldmVscykgPT4ge1xuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKGNvbmZpZ0ZvbGRlcik7XG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKGFwcERlZmluaXRpb25GaWxlLCBhcHBsaWNhdGlvbkRlZmluaXRpb24pO1xuXG4gIGF3YWl0IGluaXRpYWxpc2VSb290Q29sbGVjdGlvbnMoZGF0YXN0b3JlLCBhcHBsaWNhdGlvbkRlZmluaXRpb24uaGllcmFyY2h5KTtcbiAgYXdhaXQgaW5pdGlhbGlzZVJvb3RJbmRleGVzKGRhdGFzdG9yZSwgYXBwbGljYXRpb25EZWZpbml0aW9uLmhpZXJhcmNoeSk7XG5cbiAgYXdhaXQgaW5pdGlhbGlzZVJvb3RTaW5nbGVSZWNvcmRzKGRhdGFzdG9yZSwgYXBwbGljYXRpb25EZWZpbml0aW9uLmhpZXJhcmNoeSk7XG5cbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihUUkFOU0FDVElPTlNfRk9MREVSKTtcblxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKEFVVEhfRk9MREVSKTtcblxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlSnNvbihVU0VSU19MSVNUX0ZJTEUsIFtdKTtcblxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlSnNvbihcbiAgICBBQ0NFU1NfTEVWRUxTX0ZJTEUsIFxuICAgIGFjY2Vzc0xldmVscyA/IGFjY2Vzc0xldmVscyA6IHsgdmVyc2lvbjogMCwgbGV2ZWxzOiBbXSB9KTtcbn07XG5cbmNvbnN0IGluaXRpYWxpc2VSb290SW5kZXhlcyA9IGFzeW5jIChkYXRhc3RvcmUsIGhpZXJhcmNoeSkgPT4ge1xuICBjb25zdCBmbGF0aGllcmFyY2h5ID0gZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGhpZXJhcmNoeSk7XG4gIGNvbnN0IGdsb2JhbEluZGV4ZXMgPSAkKGZsYXRoaWVyYXJjaHksIFtcbiAgICBmaWx0ZXIoaXNHbG9iYWxJbmRleCksXG4gIF0pO1xuXG4gIGZvciAoY29uc3QgaW5kZXggb2YgZ2xvYmFsSW5kZXhlcykge1xuICAgIGlmICghYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhpbmRleC5ub2RlS2V5KCkpKSB7IGF3YWl0IGluaXRpYWxpc2VJbmRleChkYXRhc3RvcmUsICcnLCBpbmRleCk7IH1cbiAgfVxufTtcblxuY29uc3QgaW5pdGlhbGlzZVJvb3RTaW5nbGVSZWNvcmRzID0gYXN5bmMgKGRhdGFzdG9yZSwgaGllcmFjaHkpID0+IHtcbiAgY29uc3QgZmxhdGhpZXJhcmNoeSA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShoaWVyYWNoeSk7XG4gIGNvbnN0IHNpbmdsZVJlY29yZHMgPSAkKGZsYXRoaWVyYXJjaHksIFtcbiAgICBmaWx0ZXIoaXNTaW5nbGVSZWNvcmQpLFxuICBdKTtcblxuICAvKiBmb3IgKGxldCByZWNvcmQgb2Ygc2luZ2xlUmVjb3Jkcykge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBnZXROZXcoeyBkYXRhc3RvcmU6IGRhdGFzdG9yZSwgaGllcmFyY2h5OiBhcHBEZWZpbml0aW9uLmhpZXJhcmNoeSB9KVxuICAgICAgICAgICAgKHJlY29yZC5ub2RlS2V5KCksXG4gICAgICAgICAgICAgICAgcmVjb3JkLm5hbWVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgX3NhdmUoeyBkYXRhc3RvcmU6IGRhdGFzdG9yZSwgaGllcmFyY2h5OiBhcHBEZWZpbml0aW9uLmhpZXJhcmNoeSB9LFxuICAgICAgICAgICAgcmVzdWx0XG4gICAgICAgICk7XG4gICAgfSAqL1xufTtcbiIsImltcG9ydCB7IGlzTm90aGluZyB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBnZXREYXRhYmFzZU1hbmFnZXIgPSBkYXRhYmFzZU1hbmFnZXIgPT4gKHtcbiAgY3JlYXRlRW1wdHlNYXN0ZXJEYjogY3JlYXRlRW1wdHlNYXN0ZXJEYihkYXRhYmFzZU1hbmFnZXIpLFxuICBjcmVhdGVFbXB0eUluc3RhbmNlRGI6IGNyZWF0ZUVtcHR5SW5zdGFuY2VEYihkYXRhYmFzZU1hbmFnZXIpLFxuICBnZXRJbnN0YW5jZURiUm9vdENvbmZpZzogZGF0YWJhc2VNYW5hZ2VyLmdldEluc3RhbmNlRGJSb290Q29uZmlnLFxuICBtYXN0ZXJEYXRhc3RvcmVDb25maWc6IGdldE1hc3RlckRhdGFzdG9yZUNvbmZpZyhkYXRhYmFzZU1hbmFnZXIpLFxuICBnZXRJbnN0YW5jZURhdGFzdG9yZUNvbmZpZzogZ2V0SW5zdGFuY2VEYXRhc3RvcmVDb25maWcoZGF0YWJhc2VNYW5hZ2VyKSxcbn0pO1xuXG5jb25zdCBnZXRNYXN0ZXJEYXRhc3RvcmVDb25maWcgPSBkYXRhYmFzZU1hbmFnZXIgPT4gZGF0YWJhc2VNYW5hZ2VyLmdldERhdGFzdG9yZUNvbmZpZygnbWFzdGVyJyk7XG5cbmNvbnN0IGdldEluc3RhbmNlRGF0YXN0b3JlQ29uZmlnID0gZGF0YWJhc2VNYW5hZ2VyID0+IChhcHBsaWNhdGlvbklkLCBpbnN0YW5jZUlkKSA9PiBkYXRhYmFzZU1hbmFnZXIuZ2V0RGF0YXN0b3JlQ29uZmlnKFxuICBhcHBsaWNhdGlvbklkLCBpbnN0YW5jZUlkLFxuKTtcblxuY29uc3QgY3JlYXRlRW1wdHlNYXN0ZXJEYiA9IGRhdGFiYXNlTWFuYWdlciA9PiBhc3luYyAoKSA9PiBhd2FpdCBkYXRhYmFzZU1hbmFnZXIuY3JlYXRlRW1wdHlEYignbWFzdGVyJyk7XG5cbmNvbnN0IGNyZWF0ZUVtcHR5SW5zdGFuY2VEYiA9IGRhdGFiYXNlTWFuYWdlciA9PiBhc3luYyAoYXBwbGljYXRpb25JZCwgaW5zdGFuY2VJZCkgPT4ge1xuICBpZiAoaXNOb3RoaW5nKGFwcGxpY2F0aW9uSWQpKSB7IHRocm93IG5ldyBFcnJvcignQ3JlYXRlRGI6IGFwcGxpY2F0aW9uIGlkIG5vdCBzdXBwbGllZCcpOyB9XG4gIGlmIChpc05vdGhpbmcoaW5zdGFuY2VJZCkpIHsgdGhyb3cgbmV3IEVycm9yKCdDcmVhdGVEYjogaW5zdGFuY2UgaWQgbm90IHN1cHBsaWVkJyk7IH1cblxuICByZXR1cm4gYXdhaXQgZGF0YWJhc2VNYW5hZ2VyLmNyZWF0ZUVtcHR5RGIoXG4gICAgYXBwbGljYXRpb25JZCxcbiAgICBpbnN0YW5jZUlkLFxuICApO1xufTtcbiIsImltcG9ydCBnZXRSZWNvcmRBcGkgZnJvbSBcIi4vcmVjb3JkQXBpXCI7XG5pbXBvcnQgZ2V0Q29sbGVjdGlvbkFwaSBmcm9tIFwiLi9jb2xsZWN0aW9uQXBpXCI7XG5pbXBvcnQgZ2V0SW5kZXhBcGkgZnJvbSBcIi4vaW5kZXhBcGlcIjtcbmltcG9ydCBnZXRUZW1wbGF0ZUFwaSBmcm9tIFwiLi90ZW1wbGF0ZUFwaVwiO1xuaW1wb3J0IGdldEF1dGhBcGkgZnJvbSBcIi4vYXV0aEFwaVwiO1xuaW1wb3J0IGdldEFjdGlvbnNBcGkgZnJvbSBcIi4vYWN0aW9uc0FwaVwiO1xuaW1wb3J0IHtzZXR1cERhdGFzdG9yZSwgY3JlYXRlRXZlbnRBZ2dyZWdhdG9yfSBmcm9tIFwiLi9hcHBJbml0aWFsaXNlXCI7XG5pbXBvcnQge2luaXRpYWxpc2VBY3Rpb25zfSBmcm9tIFwiLi9hY3Rpb25zQXBpL2luaXRpYWxpc2VcIlxuaW1wb3J0IHtpc1NvbWV0aGluZ30gZnJvbSBcIi4vY29tbW9uXCI7XG5pbXBvcnQge2NsZWFudXB9IGZyb20gXCIuL3RyYW5zYWN0aW9ucy9jbGVhbnVwXCI7XG5pbXBvcnQge2dlbmVyYXRlRnVsbFBlcm1pc3Npb25zfSBmcm9tIFwiLi9hdXRoQXBpL2dlbmVyYXRlRnVsbFBlcm1pc3Npb25zXCI7XG5pbXBvcnQge2dldEFwcGxpY2F0aW9uRGVmaW5pdGlvbn0gZnJvbSBcIi4vdGVtcGxhdGVBcGkvZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uXCI7XG5pbXBvcnQgY29tbW9uIGZyb20gXCIuL2NvbW1vblwiO1xuaW1wb3J0IHtnZXRCZWhhdmlvdXJTb3VyY2VzfSBmcm9tIFwiLi90ZW1wbGF0ZUFwaS9nZXRCZWhhdmlvdXJTb3VyY2VzXCI7XG5pbXBvcnQgaGllcmFyY2h5IGZyb20gXCIuL3RlbXBsYXRlQXBpL2hpZXJhcmNoeVwiO1xuXG5leHBvcnQgY29uc3QgZ2V0QXBwQXBpcyA9IGFzeW5jIChzdG9yZSwgYmVoYXZpb3VyU291cmNlcyA9IG51bGwsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhbnVwVHJhbnNhY3Rpb25zID0gbnVsbCwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEVwb2NoVGltZSA9IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyeXB0byA9IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcERlZmluaXRpb24gPSBudWxsKSA9PiB7XG5cbiAgICBzdG9yZSA9IHNldHVwRGF0YXN0b3JlKHN0b3JlKTtcblxuICAgIGlmKCFhcHBEZWZpbml0aW9uKVxuICAgICAgICBhcHBEZWZpbml0aW9uID0gYXdhaXQgZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uKHN0b3JlKSgpO1xuXG4gICAgaWYoIWJlaGF2aW91clNvdXJjZXMpXG4gICAgICAgIGJlaGF2aW91clNvdXJjZXMgPSBhd2FpdCBnZXRCZWhhdmlvdXJTb3VyY2VzKHN0b3JlKTtcblxuICAgIGNvbnN0IGV2ZW50QWdncmVnYXRvciA9IGNyZWF0ZUV2ZW50QWdncmVnYXRvcigpO1xuXG4gICAgY29uc3QgYXBwID0ge1xuICAgICAgICBkYXRhc3RvcmU6c3RvcmUsXG4gICAgICAgIGNyeXB0byxcbiAgICAgICAgcHVibGlzaDpldmVudEFnZ3JlZ2F0b3IucHVibGlzaCxcbiAgICAgICAgaGllcmFyY2h5OmFwcERlZmluaXRpb24uaGllcmFyY2h5LFxuICAgICAgICBhY3Rpb25zOmFwcERlZmluaXRpb24uYWN0aW9uc1xuICAgIH07XG5cbiAgICBjb25zdCB0ZW1wbGF0ZUFwaSA9IGdldFRlbXBsYXRlQXBpKGFwcCk7ICAgIFxuXG4gICAgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMgPSBpc1NvbWV0aGluZyhjbGVhbnVwVHJhbnNhY3Rpb25zKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gY2xlYW51cFRyYW5zYWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBhc3luYyAoKSA9PiBhd2FpdCBjbGVhbnVwKGFwcCk7XG5cbiAgICBhcHAuZ2V0RXBvY2hUaW1lID0gaXNTb21ldGhpbmcoZ2V0RXBvY2hUaW1lKVxuICAgICAgICAgICAgICAgICAgICAgICA/IGdldEVwb2NoVGltZVxuICAgICAgICAgICAgICAgICAgICAgICA6IGFzeW5jICgpID0+IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG5cbiAgICBjb25zdCByZWNvcmRBcGkgPSBnZXRSZWNvcmRBcGkoYXBwKTtcbiAgICBjb25zdCBjb2xsZWN0aW9uQXBpID0gZ2V0Q29sbGVjdGlvbkFwaShhcHApO1xuICAgIGNvbnN0IGluZGV4QXBpID0gZ2V0SW5kZXhBcGkoYXBwKTtcbiAgICBjb25zdCBhdXRoQXBpID0gZ2V0QXV0aEFwaShhcHApO1xuICAgIGNvbnN0IGFjdGlvbnNBcGkgPSBnZXRBY3Rpb25zQXBpKGFwcCk7XG5cbiAgICBjb25zdCBhdXRoZW50aWNhdGVBcyA9IGFzeW5jICh1c2VybmFtZSwgcGFzc3dvcmQpID0+IHtcbiAgICAgICAgYXBwLnVzZXIgPSBhd2FpdCBhdXRoQXBpLmF1dGhlbnRpY2F0ZSh1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgIH07XG5cbiAgICBjb25zdCB3aXRoRnVsbEFjY2VzcyA9ICgpID0+IHtcbiAgICAgICAgYXBwLnVzZXIgPSB7XG4gICAgICAgICAgICBuYW1lOiBcImFwcFwiLFxuICAgICAgICAgICAgcGVybWlzc2lvbnMgOiBnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucyhhcHApLFxuICAgICAgICAgICAgaXNVc2VyOmZhbHNlLFxuICAgICAgICAgICAgdGVtcDpmYWxzZVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGFzVXNlciA9ICh1c2VyKSA9PiB7XG4gICAgICAgIGFwcC51c2VyID0gdXNlclxuICAgIH07XG5cbiAgICBcblxuICAgIGxldCBhcGlzID0ge1xuICAgICAgICByZWNvcmRBcGksIFxuICAgICAgICB0ZW1wbGF0ZUFwaSxcbiAgICAgICAgY29sbGVjdGlvbkFwaSxcbiAgICAgICAgaW5kZXhBcGksXG4gICAgICAgIGF1dGhBcGksXG4gICAgICAgIGFjdGlvbnNBcGksXG4gICAgICAgIHN1YnNjcmliZTogZXZlbnRBZ2dyZWdhdG9yLnN1YnNjcmliZSxcbiAgICAgICAgYXV0aGVudGljYXRlQXMsXG4gICAgICAgIHdpdGhGdWxsQWNjZXNzLFxuICAgICAgICBhc1VzZXJcbiAgICB9O1xuXG4gICAgYXBpcy5hY3Rpb25zID0gaW5pdGlhbGlzZUFjdGlvbnMoXG4gICAgICAgIGV2ZW50QWdncmVnYXRvci5zdWJzY3JpYmUsXG4gICAgICAgIGJlaGF2aW91clNvdXJjZXMsXG4gICAgICAgIGFwcERlZmluaXRpb24uYWN0aW9ucyxcbiAgICAgICAgYXBwRGVmaW5pdGlvbi50cmlnZ2VycyxcbiAgICAgICAgYXBpcyk7XG5cblxuICAgIHJldHVybiBhcGlzO1xufTtcblxuZXhwb3J0IHtldmVudHMsIGV2ZW50c0xpc3R9IGZyb20gXCIuL2NvbW1vbi9ldmVudHNcIjtcbmV4cG9ydCB7Z2V0VGVtcGxhdGVBcGl9IGZyb20gXCIuL3RlbXBsYXRlQXBpXCI7XG5leHBvcnQge2dldFJlY29yZEFwaX0gZnJvbSBcIi4vcmVjb3JkQXBpXCI7XG5leHBvcnQge2dldENvbGxlY3Rpb25BcGl9IGZyb20gXCIuL2NvbGxlY3Rpb25BcGlcIjtcbmV4cG9ydCB7Z2V0QXV0aEFwaX0gZnJvbSBcIi4vYXV0aEFwaVwiO1xuZXhwb3J0IHtnZXRJbmRleEFwaX0gZnJvbSBcIi4vaW5kZXhBcGlcIjtcbmV4cG9ydCB7c2V0dXBEYXRhc3RvcmV9IGZyb20gXCIuL2FwcEluaXRpYWxpc2VcIjtcbmV4cG9ydCB7Z2V0QWN0aW9uc0FwaX0gZnJvbSBcIi4vYWN0aW9uc0FwaVwiO1xuZXhwb3J0IHtpbml0aWFsaXNlRGF0YX0gZnJvbSBcIi4vYXBwSW5pdGlhbGlzZS9pbml0aWFsaXNlRGF0YVwiO1xuZXhwb3J0IHtnZXREYXRhYmFzZU1hbmFnZXJ9IGZyb20gXCIuL2FwcEluaXRpYWxpc2UvZGF0YWJhc2VNYW5hZ2VyXCI7XG5leHBvcnQge2hpZXJhcmNoeX07XG5leHBvcnQge2NvbW1vbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldEFwcEFwaXM7Il0sIm5hbWVzIjpbInVuaW9uIiwicmVkdWNlIiwiZ2VuZXJhdGUiLCJpc1VuZGVmaW5lZCIsImNsb25lRGVlcCIsInNwbGl0IiwiZmxvdyIsInRyaW0iLCJyZXBsYWNlIiwiaXNBcnJheSIsImpvaW4iLCJkcm9wUmlnaHQiLCJ0YWtlUmlnaHQiLCJoZWFkIiwiaXNOdWxsIiwiaXNOYU4iLCJpc0VtcHR5IiwiY29uc3RhbnQiLCJzb21lIiwiaXNTdHJpbmciLCJ0YWlsIiwiaW5jbHVkZXMiLCJzdGFydHNXaXRoIiwiZmluZEluZGV4IiwiaXNJbnRlZ2VyIiwiaXNEYXRlIiwidG9OdW1iZXIiLCJtYXAiLCJmaWx0ZXIiLCJjb21waWxlRXhwcmVzc2lvbiIsImNvbXBpbGVDb2RlIiwia2V5cyIsImlzRnVuY3Rpb24iLCJjb3VudEJ5IiwibGFzdCIsImZpbmQiLCJ0YWtlIiwiZmlyc3QiLCJpbnRlcnNlY3Rpb24iLCJoYXMiLCJtZXJnZSIsIm1hcFZhbHVlcyIsIm1ha2VydWxlIiwiaXNCb29sZWFuIiwib3B0aW9ucyIsInR5cGVDb25zdHJhaW50cyIsImlzTnVtYmVyIiwiaXNPYmplY3RMaWtlIiwiYXNzaWduIiwiYWxsIiwiZ2V0RGVmYXVsdE9wdGlvbnMiLCJ2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyIsImlzT2JqZWN0IiwiY2xvbmUiLCJ2YWx1ZXMiLCJrZXlCeSIsIm9yZGVyQnkiLCJjb25jYXQiLCJyZXZlcnNlIiwiZ2xvYmFsIiwiYmFzZTY0LmZyb21CeXRlQXJyYXkiLCJpZWVlNzU0LnJlYWQiLCJpZWVlNzU0LndyaXRlIiwiYmFzZTY0LnRvQnl0ZUFycmF5IiwicmVhZCIsImRpZmZlcmVuY2UiLCJCdWZmZXIiLCJyZWFkSW5kZXgiLCJmbGF0dGVuIiwiZWFjaCIsIl8iLCJwdWxsIiwiZGVsZXRlUmVjb3JkIiwidmFsaWRhdGUiLCJtYXgiLCJkZWZhdWx0Q2FzZSIsImV2ZXJ5IiwidW5pcUJ5IiwiYXBpIiwiY3JlYXRlVGVtcG9yYXJ5QWNjZXNzIiwiY3JlYXRlVXNlciIsInVuaXFXaXRoIiwic2V0VXNlckFjY2Vzc0xldmVscyIsImV4ZWN1dGVBY3Rpb24iLCJjQ29kZSIsImNFeHAiLCJncm91cEJ5IiwiaXNFcXVhbCIsImRpZmZlcmVuY2VCeSIsImludGVyc2VjdGlvbkJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7RUFFQSxNQUFNLFVBQVUsR0FBRyxLQUFLLElBQUlBLFFBQUssQ0FBQyxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7RUFFL0UsTUFBTSxNQUFNLEdBQUcsTUFBTSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7O0VBRXBDLE1BQU0sT0FBTyxHQUFHO0VBQ2hCLEVBQUUsU0FBUyxFQUFFO0VBQ2IsSUFBSSxJQUFJLEVBQUUsVUFBVSxDQUFDO0VBQ3JCLE1BQU0sV0FBVztFQUNqQixNQUFNLGlCQUFpQjtFQUN2QixNQUFNLGlCQUFpQixDQUFDLENBQUM7RUFDekIsSUFBSSxNQUFNLEVBQUUsTUFBTSxFQUFFO0VBQ3BCLElBQUksVUFBVSxFQUFFLE1BQU0sRUFBRTtFQUN4QixJQUFJLE1BQU0sRUFBRSxNQUFNLEVBQUU7RUFDcEIsSUFBSSxJQUFJLEVBQUUsTUFBTSxFQUFFO0VBQ2xCLElBQUksUUFB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QUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUM7RUFDdEssSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUFFLElBQUksS0FBSTtFQUNqQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFJO0VBQ2hDLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUk7RUFDekIsR0FBRzs7RUFFSCxFQUFFLElBQUksWUFBWSxLQUFLLENBQUMsRUFBRTtFQUMxQixJQUFJLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQztFQUN2RixJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxLQUFJO0VBQ3pCLEdBQUcsTUFBTSxJQUFJLFlBQVksS0FBSyxDQUFDLEVBQUU7RUFDakMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FB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S0FBSyxLQUFLLFFBQVEsRUFBRTtFQUMxQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUM7RUFDNUIsSUFBSSxDQUFDLEdBQUcsS0FBSTtFQUNaLEdBQUcsTUFBTTtFQUNULElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFDO0VBQzlDLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7RUFDM0MsTUFBTSxDQUFDLEdBQUU7RUFDVCxNQUFNLENBQUMsSUFBSSxFQUFDO0VBQ1osS0FBSztFQUNMLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsRUFBRTtFQUN4QixNQUFNLEtBQUssSUFBSSxFQUFFLEdBQUcsRUFBQztFQUNyQixLQUFLLE1BQU07RUFDWCxNQUFNLEtBQUssSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBQztFQUMxQyxLQUFLO0VBQ0wsSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO0VBQ3hCLE1BQU0sQ0FBQyxHQUFFO0VBQ1QsTUFBTSxDQUFDLElBQUksRUFBQztFQUNaLEtBQUs7O0VBRUwsSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLElBQUksSUFBSSxFQUFFO0VBQzNCLE1BQU0sQ0FBQyxHQUFHLEVBQUM7RUFDWCxNQUFNLENBQUMsR0FBRyxLQUFJO0VBQ2QsS0FBSyxNQUFNLElBQUksQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLEVBQUU7RUFDL0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUM7RUFDN0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQUs7RUFDbkIsS0FBSyxNQUFNO0VBQ1gsTUFBTSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUM7RUFDNUQsTUFBTSxDQUFDLEdBQUcsRUFBQztFQUNYLEtBQUs7RUFDTCxHQUFHOztFQUVILEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsRUFBRSxFQUFFOztFQUVsRixFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksRUFBQztFQUNyQixFQUFFLElBQUksSUFBSSxLQUFJO0VBQ2QsRUFBRSxPQUFPLElBQUksR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxJQUFJLElBQUksQ0FBQyxFQUFFLEVBQUU7O0VBRWpGLEVBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUc7RUFDbkMsQ0FBQzs7RUNwRkQsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7QUFFM0IsZ0JBQWUsS0FBSyxDQUFDLE9BQU8sSUFBSSxVQUFVLEdBQUcsRUFBRTtFQUMvQyxFQUFFLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQztFQUNoRCxDQUFDLENBQUM7O0VDU0ssSUFBSSxpQkFBaUIsR0FBRyxHQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTBCakMsTUFBTSxDQUFDLG1CQUFtQixHQUFHQyxRQUFNLENBQUMsbUJBQW1CLEtBQUssU0FBUztNQUNqRUEsUUFBTSxDQUFDLG1CQUFtQjtNQUMxQixLQUFJOztFQXdCUixTQUFTLFVBQVUsSUFBSTtJQUNyQixPQUFPLE1BQU0sQ0FBQyxtQkFBbUI7UUFDN0IsVUFBVTtRQUNWLFVBQVU7R0FDZjs7RUFFRCxTQUFTLFlBQVksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0lBQ25DLElBQUksVUFBVSxFQUFFLEdBQUcsTUFBTSxFQUFFO01BQ3pCLE1BQU0sSUFBSSxVQUFVLENBQUMsNEJBQTRCLENBQUM7S0FDbkQ7SUFDRCxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRTs7TUFFOUIsSUFBSSxHQUFHLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBQztNQUM3QixJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxVQUFTO0tBQ2xDLE1BQU07O01BRUwsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO1FBQ2pCLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUM7T0FDMUI7TUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU07S0FDckI7O0lBRUQsT0FBTyxJQUFJO0dBQ1o7Ozs7Ozs7Ozs7OztBQVlELEVBQU8sU0FBUyxNQUFNLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sRUFBRTtJQUNyRCxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixJQUFJLEVBQUUsSUFBSSxZQUFZLE1BQU0sQ0FBQyxFQUFFO01BQzVELE9BQU8sSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sQ0FBQztLQUNqRDs7O0lBR0QsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7TUFDM0IsSUFBSSxPQUFPLGdCQUFnQixLQUFLLFFBQVEsRUFBRTtRQUN4QyxNQUFNLElBQUksS0FBSztVQUNiLG1FQUFtRTtTQUNwRTtPQUNGO01BQ0QsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQztLQUM5QjtJQUNELE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDO0dBQ2pEOztFQUVELE1BQU0sQ0FBQyxRQUFRLEdBQUcsS0FBSTs7O0VBR3RCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsVUFBVSxHQUFHLEVBQUU7SUFDL0IsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsVUFBUztJQUNoQyxPQUFPLEdBQUc7SUFDWDs7RUFFRCxTQUFTLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sRUFBRTtJQUNwRCxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtNQUM3QixNQUFNLElBQUksU0FBUyxDQUFDLHVDQUF1QyxDQUFDO0tBQzdEOztJQUVELElBQUksT0FBTyxXQUFXLEtBQUssV0FBVyxJQUFJLEtBQUssWUFBWSxXQUFXLEVBQUU7TUFDdEUsT0FBTyxlQUFlLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLENBQUM7S0FDOUQ7O0lBRUQsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7TUFDN0IsT0FBTyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQztLQUNqRDs7SUFFRCxPQUFPLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO0dBQy9COzs7Ozs7Ozs7O0VBVUQsTUFBTSxDQUFDLElBQUksR0FBRyxVQUFVLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUU7SUFDdkQsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLENBQUM7SUFDbkQ7O0VBRUQsSUFBSSxNQUFNLENBQUMsbUJBQW1CLEVBQUU7SUFDOUIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDLFVBQVM7SUFDakQsTUFBTSxDQUFDLFNBQVMsR0FBRyxXQUFVO0dBUzlCOztFQUVELFNBQVMsVUFBVSxFQUFFLElBQUksRUFBRTtJQUN6QixJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtNQUM1QixNQUFNLElBQUksU0FBUyxDQUFDLGtDQUFrQyxDQUFDO0tBQ3hELE1BQU0sSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO01BQ25CLE1BQU0sSUFBSSxVQUFVLENBQUMsc0NBQXNDLENBQUM7S0FDN0Q7R0FDRjs7RUFFRCxTQUFTLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7SUFDMUMsVUFBVSxDQUFDLElBQUksRUFBQztJQUNoQixJQUFJLElBQUksSUFBSSxDQUFDLEVBQUU7TUFDYixPQUFPLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO0tBQ2hDO0lBQ0QsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFOzs7O01BSXRCLE9BQU8sT0FBTyxRQUFRLEtBQUssUUFBUTtVQUMvQixZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDO1VBQzdDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztLQUN4QztJQUNELE9BQU8sWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7R0FDaEM7Ozs7OztFQU1ELE1BQU0sQ0FBQyxLQUFLLEdBQUcsVUFBVSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtJQUM3QyxPQUFPLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUM7SUFDekM7O0VBRUQsU0FBUyxXQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtJQUNoQyxVQUFVLENBQUMsSUFBSSxFQUFDO0lBQ2hCLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUM7SUFDM0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRTtNQUMvQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQzdCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDO09BQ1o7S0FDRjtJQUNELE9BQU8sSUFBSTtHQUNaOzs7OztFQUtELE1BQU0sQ0FBQyxXQUFXLEdBQUcsVUFBVSxJQUFJLEVBQUU7SUFDbkMsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztJQUMvQjs7OztFQUlELE1BQU0sQ0FBQyxlQUFlLEdBQUcsVUFBVSxJQUFJLEVBQUU7SUFDdkMsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztJQUMvQjs7RUFFRCxTQUFTLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUMzQyxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsSUFBSSxRQUFRLEtBQUssRUFBRSxFQUFFO01BQ25ELFFBQVEsR0FBRyxPQUFNO0tBQ2xCOztJQUVELElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO01BQ2hDLE1BQU0sSUFBSSxTQUFTLENBQUMsNENBQTRDLENBQUM7S0FDbEU7O0lBRUQsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsR0FBRyxFQUFDO0lBQzdDLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQzs7SUFFakMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFDOztJQUV6QyxJQUFJLE1BQU0sS0FBSyxNQUFNLEVBQUU7Ozs7TUFJckIsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBQztLQUM3Qjs7SUFFRCxPQUFPLElBQUk7R0FDWjs7RUFFRCxTQUFTLGFBQWEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFO0lBQ25DLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUM7SUFDN0QsSUFBSSxHQUFHLFlBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFDO0lBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUNsQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUc7S0FDekI7SUFDRCxPQUFPLElBQUk7R0FDWjs7RUFFRCxTQUFTLGVBQWUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7SUFDekQsS0FBSyxDQUFDLFdBQVU7O0lBRWhCLElBQUksVUFBVSxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsVUFBVSxHQUFHLFVBQVUsRUFBRTtNQUNuRCxNQUFNLElBQUksVUFBVSxDQUFDLDZCQUE2QixDQUFDO0tBQ3BEOztJQUVELElBQUksS0FBSyxDQUFDLFVBQVUsR0FBRyxVQUFVLElBQUksTUFBTSxJQUFJLENBQUMsQ0FBQyxFQUFFO01BQ2pELE1BQU0sSUFBSSxVQUFVLENBQUMsNkJBQTZCLENBQUM7S0FDcEQ7O0lBRUQsSUFBSSxVQUFVLEtBQUssU0FBUyxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7TUFDcEQsS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLEtBQUssRUFBQztLQUM5QixNQUFNLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtNQUMvQixLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBQztLQUMxQyxNQUFNO01BQ0wsS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFDO0tBQ2xEOztJQUVELElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFOztNQUU5QixJQUFJLEdBQUcsTUFBSztNQUNaLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFVBQVM7S0FDbEMsTUFBTTs7TUFFTCxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUM7S0FDbEM7SUFDRCxPQUFPLElBQUk7R0FDWjs7RUFFRCxTQUFTLFVBQVUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO0lBQzlCLElBQUksZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEVBQUU7TUFDekIsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFDO01BQ2pDLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQzs7TUFFOUIsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUNyQixPQUFPLElBQUk7T0FDWjs7TUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQztNQUN6QixPQUFPLElBQUk7S0FDWjs7SUFFRCxJQUFJLEdBQUcsRUFBRTtNQUNQLElBQUksQ0FBQyxPQUFPLFdBQVcsS0FBSyxXQUFXO1VBQ25DLEdBQUcsQ0FBQyxNQUFNLFlBQVksV0FBVyxLQUFLLFFBQVEsSUFBSSxHQUFHLEVBQUU7UUFDekQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxNQUFNLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7VUFDdkQsT0FBTyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUM3QjtRQUNELE9BQU8sYUFBYSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUM7T0FDaEM7O01BRUQsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzlDLE9BQU8sYUFBYSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDO09BQ3JDO0tBQ0Y7O0lBRUQsTUFBTSxJQUFJLFNBQVMsQ0FBQyxvRkFBb0YsQ0FBQztHQUMxRzs7RUFFRCxTQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUU7OztJQUd4QixJQUFJLE1BQU0sSUFBSSxVQUFVLEVBQUUsRUFBRTtNQUMxQixNQUFNLElBQUksVUFBVSxDQUFDLGlEQUFpRDsyQkFDakQsVUFBVSxHQUFHLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUM7S0FDeEU7SUFDRCxPQUFPLE1BQU0sR0FBRyxDQUFDO0dBQ2xCO0VBUUQsTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7RUFDM0IsU0FBUyxnQkFBZ0IsRUFBRSxDQUFDLEVBQUU7SUFDNUIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDO0dBQ3BDOztFQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUN2QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBRTtNQUNoRCxNQUFNLElBQUksU0FBUyxDQUFDLDJCQUEyQixDQUFDO0tBQ2pEOztJQUVELElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUM7O0lBRXJCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFNO0lBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFNOztJQUVoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtNQUNsRCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDakIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUM7UUFDUixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQztRQUNSLEtBQUs7T0FDTjtLQUNGOztJQUVELElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwQixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDO0lBQ25CLE9BQU8sQ0FBQztJQUNUOztFQUVELE1BQU0sQ0FBQyxVQUFVLEdBQUcsU0FBUyxVQUFVLEVBQUUsUUFBUSxFQUFFO0lBQ2pELFFBQVEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsRUFBRTtNQUNwQyxLQUFLLEtBQUssQ0FBQztNQUNYLEtBQUssTUFBTSxDQUFDO01BQ1osS0FBSyxPQUFPLENBQUM7TUFDYixLQUFLLE9BQU8sQ0FBQztNQUNiLEtBQUssUUFBUSxDQUFDO01BQ2QsS0FBSyxRQUFRLENBQUM7TUFDZCxLQUFLLFFBQVEsQ0FBQztNQUNkLEtBQUssTUFBTSxDQUFDO01BQ1osS0FBSyxPQUFPLENBQUM7TUFDYixLQUFLLFNBQVMsQ0FBQztNQUNmLEtBQUssVUFBVTtRQUNiLE9BQU8sSUFBSTtNQUNiO1FBQ0UsT0FBTyxLQUFLO0tBQ2Y7SUFDRjs7RUFFRCxNQUFNLENBQUMsTUFBTSxHQUFHLFNBQVMsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7SUFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUNsQixNQUFNLElBQUksU0FBUyxDQUFDLDZDQUE2QyxDQUFDO0tBQ25FOztJQUVELElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFDckIsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUN2Qjs7SUFFRCxJQUFJLEVBQUM7SUFDTCxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7TUFDeEIsTUFBTSxHQUFHLEVBQUM7TUFDVixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDaEMsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNO09BQ3pCO0tBQ0Y7O0lBRUQsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUM7SUFDdkMsSUFBSSxHQUFHLEdBQUcsRUFBQztJQUNYLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtNQUNoQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFDO01BQ2pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUMxQixNQUFNLElBQUksU0FBUyxDQUFDLDZDQUE2QyxDQUFDO09BQ25FO01BQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFDO01BQ3JCLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTTtLQUNsQjtJQUNELE9BQU8sTUFBTTtJQUNkOztFQUVELFNBQVMsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7SUFDckMsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRTtNQUM1QixPQUFPLE1BQU0sQ0FBQyxNQUFNO0tBQ3JCO0lBQ0QsSUFBSSxPQUFPLFdBQVcsS0FBSyxXQUFXLElBQUksT0FBTyxXQUFXLENBQUMsTUFBTSxLQUFLLFVBQVU7U0FDN0UsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLFlBQVksV0FBVyxDQUFDLEVBQUU7TUFDakUsT0FBTyxNQUFNLENBQUMsVUFBVTtLQUN6QjtJQUNELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO01BQzlCLE1BQU0sR0FBRyxFQUFFLEdBQUcsT0FBTTtLQUNyQjs7SUFFRCxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsT0FBTTtJQUN2QixJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUUsT0FBTyxDQUFDOzs7SUFHdkIsSUFBSSxXQUFXLEdBQUcsTUFBSztJQUN2QixTQUFTO01BQ1AsUUFBUSxRQUFRO1FBQ2QsS0FBSyxPQUFPLENBQUM7UUFDYixLQUFLLFFBQVEsQ0FBQztRQUNkLEtBQUssUUFBUTtVQUNYLE9BQU8sR0FBRztRQUNaLEtBQUssTUFBTSxDQUFDO1FBQ1osS0FBSyxPQUFPLENBQUM7UUFDYixLQUFLLFNBQVM7VUFDWixPQUFPLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNO1FBQ25DLEtBQUssTUFBTSxDQUFDO1FBQ1osS0FBSyxPQUFPLENBQUM7UUFDYixLQUFLLFNBQVMsQ0FBQztRQUNmLEtBQUssVUFBVTtVQUNiLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDaEIsS0FBSyxLQUFLO1VBQ1IsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNsQixLQUFLLFFBQVE7VUFDWCxPQUFPLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNO1FBQ3JDO1VBQ0UsSUFBSSxXQUFXLEVBQUUsT0FBTyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTTtVQUNsRCxRQUFRLEdBQUcsQ0FBQyxFQUFFLEdBQUcsUUFBUSxFQUFFLFdBQVcsR0FBRTtVQUN4QyxXQUFXLEdBQUcsS0FBSTtPQUNyQjtLQUNGO0dBQ0Y7RUFDRCxNQUFNLENBQUMsVUFBVSxHQUFHLFdBQVU7O0VBRTlCLFNBQVMsWUFBWSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFO0lBQzNDLElBQUksV0FBVyxHQUFHLE1BQUs7Ozs7Ozs7OztJQVN2QixJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtNQUNwQyxLQUFLLEdBQUcsRUFBQztLQUNWOzs7SUFHRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFO01BQ3ZCLE9BQU8sRUFBRTtLQUNWOztJQUVELElBQUksR0FBRyxLQUFLLFNBQVMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtNQUMxQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU07S0FDbEI7O0lBRUQsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO01BQ1osT0FBTyxFQUFFO0tBQ1Y7OztJQUdELEdBQUcsTUFBTSxFQUFDO0lBQ1YsS0FBSyxNQUFNLEVBQUM7O0lBRVosSUFBSSxHQUFHLElBQUksS0FBSyxFQUFFO01BQ2hCLE9BQU8sRUFBRTtLQUNWOztJQUVELElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxHQUFHLE9BQU07O0lBRWhDLE9BQU8sSUFBSSxFQUFFO01BQ1gsUUFBUSxRQUFRO1FBQ2QsS0FBSyxLQUFLO1VBQ1IsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUM7O1FBRW5DLEtBQUssTUFBTSxDQUFDO1FBQ1osS0FBSyxPQUFPO1VBQ1YsT0FBTyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUM7O1FBRXBDLEtBQUssT0FBTztVQUNWLE9BQU8sVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDOztRQUVyQyxLQUFLLFFBQVEsQ0FBQztRQUNkLEtBQUssUUFBUTtVQUNYLE9BQU8sV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDOztRQUV0QyxLQUFLLFFBQVE7VUFDWCxPQUFPLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQzs7UUFFdEMsS0FBSyxNQUFNLENBQUM7UUFDWixLQUFLLE9BQU8sQ0FBQztRQUNiLEtBQUssU0FBUyxDQUFDO1FBQ2YsS0FBSyxVQUFVO1VBQ2IsT0FBTyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUM7O1FBRXZDO1VBQ0UsSUFBSSxXQUFXLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxvQkFBb0IsR0FBRyxRQUFRLENBQUM7VUFDckUsUUFBUSxHQUFHLENBQUMsUUFBUSxHQUFHLEVBQUUsRUFBRSxXQUFXLEdBQUU7VUFDeEMsV0FBVyxHQUFHLEtBQUk7T0FDckI7S0FDRjtHQUNGOzs7O0VBSUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsS0FBSTs7RUFFakMsU0FBUyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQztJQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDO0lBQ1gsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUM7R0FDVDs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLE1BQU0sSUFBSTtJQUMzQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTTtJQUNyQixJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQ2pCLE1BQU0sSUFBSSxVQUFVLENBQUMsMkNBQTJDLENBQUM7S0FDbEU7SUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDL0IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBQztLQUNyQjtJQUNELE9BQU8sSUFBSTtJQUNaOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsTUFBTSxJQUFJO0lBQzNDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFNO0lBQ3JCLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDakIsTUFBTSxJQUFJLFVBQVUsQ0FBQywyQ0FBMkMsQ0FBQztLQUNsRTtJQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUMvQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDO01BQ3BCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDO0tBQ3pCO0lBQ0QsT0FBTyxJQUFJO0lBQ1o7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxNQUFNLElBQUk7SUFDM0MsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU07SUFDckIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtNQUNqQixNQUFNLElBQUksVUFBVSxDQUFDLDJDQUEyQyxDQUFDO0tBQ2xFO0lBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO01BQy9CLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUM7TUFDcEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUM7TUFDeEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUM7TUFDeEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUM7S0FDekI7SUFDRCxPQUFPLElBQUk7SUFDWjs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxTQUFTLFFBQVEsSUFBSTtJQUMvQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUM7SUFDNUIsSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRTtJQUMzQixJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE9BQU8sU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDO0lBQzdELE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDO0lBQzNDOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsTUFBTSxFQUFFLENBQUMsRUFBRTtJQUM1QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQywyQkFBMkIsQ0FBQztJQUMxRSxJQUFJLElBQUksS0FBSyxDQUFDLEVBQUUsT0FBTyxJQUFJO0lBQzNCLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNyQzs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxTQUFTLE9BQU8sSUFBSTtJQUM3QyxJQUFJLEdBQUcsR0FBRyxHQUFFO0lBQ1osSUFBSSxHQUFHLEdBQUcsa0JBQWlCO0lBQzNCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7TUFDbkIsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQztNQUMzRCxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLEdBQUcsSUFBSSxRQUFPO0tBQ3RDO0lBQ0QsT0FBTyxVQUFVLEdBQUcsR0FBRyxHQUFHLEdBQUc7SUFDOUI7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRTtJQUNuRixJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEVBQUU7TUFDN0IsTUFBTSxJQUFJLFNBQVMsQ0FBQywyQkFBMkIsQ0FBQztLQUNqRDs7SUFFRCxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7TUFDdkIsS0FBSyxHQUFHLEVBQUM7S0FDVjtJQUNELElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtNQUNyQixHQUFHLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsRUFBQztLQUNqQztJQUNELElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtNQUMzQixTQUFTLEdBQUcsRUFBQztLQUNkO0lBQ0QsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFO01BQ3pCLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTTtLQUN0Qjs7SUFFRCxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksU0FBUyxHQUFHLENBQUMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtNQUM5RSxNQUFNLElBQUksVUFBVSxDQUFDLG9CQUFvQixDQUFDO0tBQzNDOztJQUVELElBQUksU0FBUyxJQUFJLE9BQU8sSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFO01BQ3hDLE9BQU8sQ0FBQztLQUNUO0lBQ0QsSUFBSSxTQUFTLElBQUksT0FBTyxFQUFFO01BQ3hCLE9BQU8sQ0FBQyxDQUFDO0tBQ1Y7SUFDRCxJQUFJLEtBQUssSUFBSSxHQUFHLEVBQUU7TUFDaEIsT0FBTyxDQUFDO0tBQ1Q7O0lBRUQsS0FBSyxNQUFNLEVBQUM7SUFDWixHQUFHLE1BQU0sRUFBQztJQUNWLFNBQVMsTUFBTSxFQUFDO0lBQ2hCLE9BQU8sTUFBTSxFQUFDOztJQUVkLElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRSxPQUFPLENBQUM7O0lBRTdCLElBQUksQ0FBQyxHQUFHLE9BQU8sR0FBRyxVQUFTO0lBQzNCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxNQUFLO0lBQ25CLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQzs7SUFFeEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFDO0lBQzdDLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQzs7SUFFekMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtNQUM1QixJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDakMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEVBQUM7UUFDZixDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBQztRQUNqQixLQUFLO09BQ047S0FDRjs7SUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUNuQixPQUFPLENBQUM7SUFDVDs7Ozs7Ozs7Ozs7RUFXRCxTQUFTLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7O0lBRXJFLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7OztJQUdsQyxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtNQUNsQyxRQUFRLEdBQUcsV0FBVTtNQUNyQixVQUFVLEdBQUcsRUFBQztLQUNmLE1BQU0sSUFBSSxVQUFVLEdBQUcsVUFBVSxFQUFFO01BQ2xDLFVBQVUsR0FBRyxXQUFVO0tBQ3hCLE1BQU0sSUFBSSxVQUFVLEdBQUcsQ0FBQyxVQUFVLEVBQUU7TUFDbkMsVUFBVSxHQUFHLENBQUMsV0FBVTtLQUN6QjtJQUNELFVBQVUsR0FBRyxDQUFDLFdBQVU7SUFDeEIsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUU7O01BRXJCLFVBQVUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFDO0tBQzNDOzs7SUFHRCxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUUsVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsV0FBVTtJQUMzRCxJQUFJLFVBQVUsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO01BQy9CLElBQUksR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1dBQ2IsVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsRUFBQztLQUNwQyxNQUFNLElBQUksVUFBVSxHQUFHLENBQUMsRUFBRTtNQUN6QixJQUFJLEdBQUcsRUFBRSxVQUFVLEdBQUcsRUFBQztXQUNsQixPQUFPLENBQUMsQ0FBQztLQUNmOzs7SUFHRCxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtNQUMzQixHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFDO0tBQ2pDOzs7SUFHRCxJQUFJLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxFQUFFOztNQUV6QixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ3BCLE9BQU8sQ0FBQyxDQUFDO09BQ1Y7TUFDRCxPQUFPLFlBQVksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDO0tBQzVELE1BQU0sSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7TUFDbEMsR0FBRyxHQUFHLEdBQUcsR0FBRyxLQUFJO01BQ2hCLElBQUksTUFBTSxDQUFDLG1CQUFtQjtVQUMxQixPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxLQUFLLFVBQVUsRUFBRTtRQUN0RCxJQUFJLEdBQUcsRUFBRTtVQUNQLE9BQU8sVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDO1NBQ2xFLE1BQU07VUFDTCxPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFVBQVUsQ0FBQztTQUN0RTtPQUNGO01BQ0QsT0FBTyxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxHQUFHLENBQUM7S0FDaEU7O0lBRUQsTUFBTSxJQUFJLFNBQVMsQ0FBQyxzQ0FBc0MsQ0FBQztHQUM1RDs7RUFFRCxTQUFTLFlBQVksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQzFELElBQUksU0FBUyxHQUFHLEVBQUM7SUFDakIsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLE9BQU07SUFDMUIsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLE9BQU07O0lBRTFCLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtNQUMxQixRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsR0FBRTtNQUN6QyxJQUFJLFFBQVEsS0FBSyxNQUFNLElBQUksUUFBUSxLQUFLLE9BQU87VUFDM0MsUUFBUSxLQUFLLFNBQVMsSUFBSSxRQUFRLEtBQUssVUFBVSxFQUFFO1FBQ3JELElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7VUFDcEMsT0FBTyxDQUFDLENBQUM7U0FDVjtRQUNELFNBQVMsR0FBRyxFQUFDO1FBQ2IsU0FBUyxJQUFJLEVBQUM7UUFDZCxTQUFTLElBQUksRUFBQztRQUNkLFVBQVUsSUFBSSxFQUFDO09BQ2hCO0tBQ0Y7O0lBRUQsU0FBUyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTtNQUNyQixJQUFJLFNBQVMsS0FBSyxDQUFDLEVBQUU7UUFDbkIsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO09BQ2QsTUFBTTtRQUNMLE9BQU8sR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO09BQ3ZDO0tBQ0Y7O0lBRUQsSUFBSSxFQUFDO0lBQ0wsSUFBSSxHQUFHLEVBQUU7TUFDUCxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUM7TUFDbkIsS0FBSyxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdkMsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLEVBQUU7VUFDdEUsSUFBSSxVQUFVLEtBQUssQ0FBQyxDQUFDLEVBQUUsVUFBVSxHQUFHLEVBQUM7VUFDckMsSUFBSSxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsS0FBSyxTQUFTLEVBQUUsT0FBTyxVQUFVLEdBQUcsU0FBUztTQUNwRSxNQUFNO1VBQ0wsSUFBSSxVQUFVLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxXQUFVO1VBQzFDLFVBQVUsR0FBRyxDQUFDLEVBQUM7U0FDaEI7T0FDRjtLQUNGLE1BQU07TUFDTCxJQUFJLFVBQVUsR0FBRyxTQUFTLEdBQUcsU0FBUyxFQUFFLFVBQVUsR0FBRyxTQUFTLEdBQUcsVUFBUztNQUMxRSxLQUFLLENBQUMsR0FBRyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNoQyxJQUFJLEtBQUssR0FBRyxLQUFJO1FBQ2hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7VUFDbEMsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFO1lBQ3JDLEtBQUssR0FBRyxNQUFLO1lBQ2IsS0FBSztXQUNOO1NBQ0Y7UUFDRCxJQUFJLEtBQUssRUFBRSxPQUFPLENBQUM7T0FDcEI7S0FDRjs7SUFFRCxPQUFPLENBQUMsQ0FBQztHQUNWOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFNBQVMsUUFBUSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFO0lBQ3hFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0RDs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxTQUFTLE9BQU8sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRTtJQUN0RSxPQUFPLG9CQUFvQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUM7SUFDbkU7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxXQUFXLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUU7SUFDOUUsT0FBTyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDO0lBQ3BFOztFQUVELFNBQVMsUUFBUSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtJQUM5QyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUM7SUFDNUIsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxPQUFNO0lBQ25DLElBQUksQ0FBQyxNQUFNLEVBQUU7TUFDWCxNQUFNLEdBQUcsVUFBUztLQUNuQixNQUFNO01BQ0wsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUM7TUFDdkIsSUFBSSxNQUFNLEdBQUcsU0FBUyxFQUFFO1FBQ3RCLE1BQU0sR0FBRyxVQUFTO09BQ25CO0tBQ0Y7OztJQUdELElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFNO0lBQzFCLElBQUksTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQzs7SUFFL0QsSUFBSSxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsRUFBRTtNQUN2QixNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUM7S0FDcEI7SUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO01BQy9CLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFDO01BQ2xELElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sQ0FBQztNQUMzQixHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU07S0FDekI7SUFDRCxPQUFPLENBQUM7R0FDVDs7RUFFRCxTQUFTLFNBQVMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7SUFDL0MsT0FBTyxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO0dBQ2pGOztFQUVELFNBQVMsVUFBVSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtJQUNoRCxPQUFPLFVBQVUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7R0FDN0Q7O0VBRUQsU0FBUyxXQUFXLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO0lBQ2pELE9BQU8sVUFBVSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQztHQUMvQzs7RUFFRCxTQUFTLFdBQVcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7SUFDakQsT0FBTyxVQUFVLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO0dBQzlEOztFQUVELFNBQVMsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtJQUMvQyxPQUFPLFVBQVUsQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7R0FDcEY7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFOztJQUV6RSxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7TUFDeEIsUUFBUSxHQUFHLE9BQU07TUFDakIsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFNO01BQ3BCLE1BQU0sR0FBRyxFQUFDOztLQUVYLE1BQU0sSUFBSSxNQUFNLEtBQUssU0FBUyxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtNQUM3RCxRQUFRLEdBQUcsT0FBTTtNQUNqQixNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU07TUFDcEIsTUFBTSxHQUFHLEVBQUM7O0tBRVgsTUFBTSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtNQUMzQixNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUM7TUFDbkIsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDcEIsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO1FBQ25CLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRSxRQUFRLEdBQUcsT0FBTTtPQUM5QyxNQUFNO1FBQ0wsUUFBUSxHQUFHLE9BQU07UUFDakIsTUFBTSxHQUFHLFVBQVM7T0FDbkI7O0tBRUYsTUFBTTtNQUNMLE1BQU0sSUFBSSxLQUFLO1FBQ2IseUVBQXlFO09BQzFFO0tBQ0Y7O0lBRUQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFNO0lBQ3BDLElBQUksTUFBTSxLQUFLLFNBQVMsSUFBSSxNQUFNLEdBQUcsU0FBUyxFQUFFLE1BQU0sR0FBRyxVQUFTOztJQUVsRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssTUFBTSxHQUFHLENBQUMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7TUFDN0UsTUFBTSxJQUFJLFVBQVUsQ0FBQyx3Q0FBd0MsQ0FBQztLQUMvRDs7SUFFRCxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsR0FBRyxPQUFNOztJQUVoQyxJQUFJLFdBQVcsR0FBRyxNQUFLO0lBQ3ZCLFNBQVM7TUFDUCxRQUFRLFFBQVE7UUFDZCxLQUFLLEtBQUs7VUFDUixPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7O1FBRS9DLEtBQUssTUFBTSxDQUFDO1FBQ1osS0FBSyxPQUFPO1VBQ1YsT0FBTyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDOztRQUVoRCxLQUFLLE9BQU87VUFDVixPQUFPLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7O1FBRWpELEtBQUssUUFBUSxDQUFDO1FBQ2QsS0FBSyxRQUFRO1VBQ1gsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDOztRQUVsRCxLQUFLLFFBQVE7O1VBRVgsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDOztRQUVsRCxLQUFLLE1BQU0sQ0FBQztRQUNaLEtBQUssT0FBTyxDQUFDO1FBQ2IsS0FBSyxTQUFTLENBQUM7UUFDZixLQUFLLFVBQVU7VUFDYixPQUFPLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7O1FBRWhEO1VBQ0UsSUFBSSxXQUFXLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxvQkFBb0IsR0FBRyxRQUFRLENBQUM7VUFDckUsUUFBUSxHQUFHLENBQUMsRUFBRSxHQUFHLFFBQVEsRUFBRSxXQUFXLEdBQUU7VUFDeEMsV0FBVyxHQUFHLEtBQUk7T0FDckI7S0FDRjtJQUNGOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsTUFBTSxJQUFJO0lBQzNDLE9BQU87TUFDTCxJQUFJLEVBQUUsUUFBUTtNQUNkLElBQUksRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQ3ZEO0lBQ0Y7O0VBRUQsU0FBUyxXQUFXLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFDckMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxHQUFHLENBQUMsTUFBTSxFQUFFO01BQ3JDLE9BQU9DLGFBQW9CLENBQUMsR0FBRyxDQUFDO0tBQ2pDLE1BQU07TUFDTCxPQUFPQSxhQUFvQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ25EO0dBQ0Y7O0VBRUQsU0FBUyxTQUFTLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFDbkMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUM7SUFDL0IsSUFBSSxHQUFHLEdBQUcsR0FBRTs7SUFFWixJQUFJLENBQUMsR0FBRyxNQUFLO0lBQ2IsT0FBTyxDQUFDLEdBQUcsR0FBRyxFQUFFO01BQ2QsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBQztNQUN0QixJQUFJLFNBQVMsR0FBRyxLQUFJO01BQ3BCLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUM7VUFDekMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUM7VUFDdEIsQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUM7VUFDdEIsRUFBQzs7TUFFTCxJQUFJLENBQUMsR0FBRyxnQkFBZ0IsSUFBSSxHQUFHLEVBQUU7UUFDL0IsSUFBSSxVQUFVLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxjQUFhOztRQUVwRCxRQUFRLGdCQUFnQjtVQUN0QixLQUFLLENBQUM7WUFDSixJQUFJLFNBQVMsR0FBRyxJQUFJLEVBQUU7Y0FDcEIsU0FBUyxHQUFHLFVBQVM7YUFDdEI7WUFDRCxLQUFLO1VBQ1AsS0FBSyxDQUFDO1lBQ0osVUFBVSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDO1lBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxNQUFNLElBQUksRUFBRTtjQUNoQyxhQUFhLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxLQUFLLEdBQUcsSUFBSSxVQUFVLEdBQUcsSUFBSSxFQUFDO2NBQy9ELElBQUksYUFBYSxHQUFHLElBQUksRUFBRTtnQkFDeEIsU0FBUyxHQUFHLGNBQWE7ZUFDMUI7YUFDRjtZQUNELEtBQUs7VUFDUCxLQUFLLENBQUM7WUFDSixVQUFVLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUM7WUFDdkIsU0FBUyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDO1lBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLE1BQU0sSUFBSSxFQUFFO2NBQy9ELGFBQWEsR0FBRyxDQUFDLFNBQVMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksS0FBSyxHQUFHLElBQUksU0FBUyxHQUFHLElBQUksRUFBQztjQUMxRixJQUFJLGFBQWEsR0FBRyxLQUFLLEtBQUssYUFBYSxHQUFHLE1BQU0sSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLEVBQUU7Z0JBQy9FLFNBQVMsR0FBRyxjQUFhO2VBQzFCO2FBQ0Y7WUFDRCxLQUFLO1VBQ1AsS0FBSyxDQUFDO1lBQ0osVUFBVSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDO1lBQ3ZCLFNBQVMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQztZQUN0QixVQUFVLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUM7WUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxNQUFNLElBQUksRUFBRTtjQUMvRixhQUFhLEdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxLQUFLLElBQUksR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksS0FBSyxHQUFHLElBQUksVUFBVSxHQUFHLElBQUksRUFBQztjQUN4SCxJQUFJLGFBQWEsR0FBRyxNQUFNLElBQUksYUFBYSxHQUFHLFFBQVEsRUFBRTtnQkFDdEQsU0FBUyxHQUFHLGNBQWE7ZUFDMUI7YUFDRjtTQUNKO09BQ0Y7O01BRUQsSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFOzs7UUFHdEIsU0FBUyxHQUFHLE9BQU07UUFDbEIsZ0JBQWdCLEdBQUcsRUFBQztPQUNyQixNQUFNLElBQUksU0FBUyxHQUFHLE1BQU0sRUFBRTs7UUFFN0IsU0FBUyxJQUFJLFFBQU87UUFDcEIsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssRUFBRSxHQUFHLEtBQUssR0FBRyxNQUFNLEVBQUM7UUFDM0MsU0FBUyxHQUFHLE1BQU0sR0FBRyxTQUFTLEdBQUcsTUFBSztPQUN2Qzs7TUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQztNQUNuQixDQUFDLElBQUksaUJBQWdCO0tBQ3RCOztJQUVELE9BQU8scUJBQXFCLENBQUMsR0FBRyxDQUFDO0dBQ2xDOzs7OztFQUtELElBQUksb0JBQW9CLEdBQUcsT0FBTTs7RUFFakMsU0FBUyxxQkFBcUIsRUFBRSxVQUFVLEVBQUU7SUFDMUMsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLE9BQU07SUFDM0IsSUFBSSxHQUFHLElBQUksb0JBQW9CLEVBQUU7TUFDL0IsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDO0tBQ3JEOzs7SUFHRCxJQUFJLEdBQUcsR0FBRyxHQUFFO0lBQ1osSUFBSSxDQUFDLEdBQUcsRUFBQztJQUNULE9BQU8sQ0FBQyxHQUFHLEdBQUcsRUFBRTtNQUNkLEdBQUcsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUs7UUFDOUIsTUFBTTtRQUNOLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxvQkFBb0IsQ0FBQztRQUMvQztLQUNGO0lBQ0QsT0FBTyxHQUFHO0dBQ1g7O0VBRUQsU0FBUyxVQUFVLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFDcEMsSUFBSSxHQUFHLEdBQUcsR0FBRTtJQUNaLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFDOztJQUUvQixLQUFLLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFO01BQ2hDLEdBQUcsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUM7S0FDMUM7SUFDRCxPQUFPLEdBQUc7R0FDWDs7RUFFRCxTQUFTLFdBQVcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTtJQUNyQyxJQUFJLEdBQUcsR0FBRyxHQUFFO0lBQ1osR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUM7O0lBRS9CLEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUU7TUFDaEMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDO0tBQ25DO0lBQ0QsT0FBTyxHQUFHO0dBQ1g7O0VBRUQsU0FBUyxRQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFDbEMsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU07O0lBRXBCLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsRUFBQztJQUNsQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsSUFBRzs7SUFFM0MsSUFBSSxHQUFHLEdBQUcsR0FBRTtJQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUU7TUFDaEMsR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUM7S0FDckI7SUFDRCxPQUFPLEdBQUc7R0FDWDs7RUFFRCxTQUFTLFlBQVksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUM7SUFDakMsSUFBSSxHQUFHLEdBQUcsR0FBRTtJQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDeEMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFDO0tBQzFEO0lBQ0QsT0FBTyxHQUFHO0dBQ1g7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTtJQUNuRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTTtJQUNyQixLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQUs7SUFDZixHQUFHLEdBQUcsR0FBRyxLQUFLLFNBQVMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUc7O0lBRXJDLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtNQUNiLEtBQUssSUFBSSxJQUFHO01BQ1osSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxFQUFDO0tBQ3pCLE1BQU0sSUFBSSxLQUFLLEdBQUcsR0FBRyxFQUFFO01BQ3RCLEtBQUssR0FBRyxJQUFHO0tBQ1o7O0lBRUQsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFO01BQ1gsR0FBRyxJQUFJLElBQUc7TUFDVixJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEVBQUM7S0FDckIsTUFBTSxJQUFJLEdBQUcsR0FBRyxHQUFHLEVBQUU7TUFDcEIsR0FBRyxHQUFHLElBQUc7S0FDVjs7SUFFRCxJQUFJLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBRyxHQUFHLE1BQUs7O0lBRTVCLElBQUksT0FBTTtJQUNWLElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO01BQzlCLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUM7TUFDbEMsTUFBTSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsVUFBUztLQUNwQyxNQUFNO01BQ0wsSUFBSSxRQUFRLEdBQUcsR0FBRyxHQUFHLE1BQUs7TUFDMUIsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUM7TUFDeEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUNqQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUM7T0FDNUI7S0FDRjs7SUFFRCxPQUFPLE1BQU07SUFDZDs7Ozs7RUFLRCxTQUFTLFdBQVcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRTtJQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLElBQUksVUFBVSxDQUFDLG9CQUFvQixDQUFDO0lBQ2hGLElBQUksTUFBTSxHQUFHLEdBQUcsR0FBRyxNQUFNLEVBQUUsTUFBTSxJQUFJLFVBQVUsQ0FBQyx1Q0FBdUMsQ0FBQztHQUN6Rjs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxTQUFTLFVBQVUsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRTtJQUMvRSxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUM7SUFDbkIsVUFBVSxHQUFHLFVBQVUsR0FBRyxFQUFDO0lBQzNCLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQzs7SUFFM0QsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBQztJQUN0QixJQUFJLEdBQUcsR0FBRyxFQUFDO0lBQ1gsSUFBSSxDQUFDLEdBQUcsRUFBQztJQUNULE9BQU8sRUFBRSxDQUFDLEdBQUcsVUFBVSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRTtNQUN6QyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFHO0tBQzlCOztJQUVELE9BQU8sR0FBRztJQUNYOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFNBQVMsVUFBVSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFO0lBQy9FLE1BQU0sR0FBRyxNQUFNLEdBQUcsRUFBQztJQUNuQixVQUFVLEdBQUcsVUFBVSxHQUFHLEVBQUM7SUFDM0IsSUFBSSxDQUFDLFFBQVEsRUFBRTtNQUNiLFdBQVcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7S0FDN0M7O0lBRUQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLFVBQVUsRUFBQztJQUNyQyxJQUFJLEdBQUcsR0FBRyxFQUFDO0lBQ1gsT0FBTyxVQUFVLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRTtNQUN2QyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLFVBQVUsQ0FBQyxHQUFHLElBQUc7S0FDekM7O0lBRUQsT0FBTyxHQUFHO0lBQ1g7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUNqRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDbEQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3BCOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsWUFBWSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7SUFDdkUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0lBQ2xELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlDOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsWUFBWSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7SUFDdkUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0lBQ2xELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQzlDOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsWUFBWSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7SUFDdkUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDOztJQUVsRCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ25DOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsWUFBWSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7SUFDdkUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDOztJQUVsRCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFNBQVM7T0FDN0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUU7T0FDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNwQjs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLFNBQVMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRTtJQUM3RSxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUM7SUFDbkIsVUFBVSxHQUFHLFVBQVUsR0FBRyxFQUFDO0lBQzNCLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQzs7SUFFM0QsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBQztJQUN0QixJQUFJLEdBQUcsR0FBRyxFQUFDO0lBQ1gsSUFBSSxDQUFDLEdBQUcsRUFBQztJQUNULE9BQU8sRUFBRSxDQUFDLEdBQUcsVUFBVSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRTtNQUN6QyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFHO0tBQzlCO0lBQ0QsR0FBRyxJQUFJLEtBQUk7O0lBRVgsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFDOztJQUVsRCxPQUFPLEdBQUc7SUFDWDs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLFNBQVMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRTtJQUM3RSxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUM7SUFDbkIsVUFBVSxHQUFHLFVBQVUsR0FBRyxFQUFDO0lBQzNCLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQzs7SUFFM0QsSUFBSSxDQUFDLEdBQUcsV0FBVTtJQUNsQixJQUFJLEdBQUcsR0FBRyxFQUFDO0lBQ1gsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBQztJQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxFQUFFO01BQzlCLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBRztLQUNoQztJQUNELEdBQUcsSUFBSSxLQUFJOztJQUVYLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsRUFBQzs7SUFFbEQsT0FBTyxHQUFHO0lBQ1g7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsU0FBUyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUMvRCxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDbEQsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRCxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEM7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxXQUFXLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUNyRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDbEQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDO0lBQ2hELE9BQU8sQ0FBQyxHQUFHLEdBQUcsTUFBTSxJQUFJLEdBQUcsR0FBRyxVQUFVLEdBQUcsR0FBRztJQUMvQzs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxTQUFTLFdBQVcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0lBQ3JFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztJQUNsRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUM7SUFDaEQsT0FBTyxDQUFDLEdBQUcsR0FBRyxNQUFNLElBQUksR0FBRyxHQUFHLFVBQVUsR0FBRyxHQUFHO0lBQy9DOztFQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFNBQVMsV0FBVyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7SUFDckUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDOztJQUVsRCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztPQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMzQjs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxTQUFTLFdBQVcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0lBQ3JFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQzs7SUFFbEQsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO09BQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO09BQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDckI7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxXQUFXLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUNyRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDbEQsT0FBT0MsSUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDL0M7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxXQUFXLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUNyRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDbEQsT0FBT0EsSUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDaEQ7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDbEQsT0FBT0EsSUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDL0M7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDbEQsT0FBT0EsSUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDaEQ7O0VBRUQsU0FBUyxRQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUU7SUFDcEQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsNkNBQTZDLENBQUM7SUFDOUYsSUFBSSxLQUFLLEdBQUcsR0FBRyxJQUFJLEtBQUssR0FBRyxHQUFHLEVBQUUsTUFBTSxJQUFJLFVBQVUsQ0FBQyxtQ0FBbUMsQ0FBQztJQUN6RixJQUFJLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLElBQUksVUFBVSxD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
