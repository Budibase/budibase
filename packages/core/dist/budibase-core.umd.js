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

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVkaWJhc2UtY29yZS51bWQuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21tb24vZXZlbnRzLmpzIiwiLi4vc3JjL2NvbW1vbi9lcnJvcnMuanMiLCIuLi9zcmMvY29tbW9uL2FwaVdyYXBwZXIuanMiLCIuLi9zcmMvY29tbW9uL2xvY2suanMiLCIuLi9zcmMvY29tbW9uL2luZGV4LmpzIiwiLi4vc3JjL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uLmpzIiwiLi4vc3JjL2luZGV4aW5nL2V2YWx1YXRlLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2luZGV4ZXMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvaGllcmFyY2h5LmpzIiwiLi4vc3JjL3R5cGVzL3R5cGVIZWxwZXJzLmpzIiwiLi4vc3JjL3R5cGVzL3N0cmluZy5qcyIsIi4uL3NyYy90eXBlcy9ib29sLmpzIiwiLi4vc3JjL3R5cGVzL251bWJlci5qcyIsIi4uL3NyYy90eXBlcy9kYXRldGltZS5qcyIsIi4uL3NyYy90eXBlcy9hcnJheS5qcyIsIi4uL3NyYy90eXBlcy9yZWZlcmVuY2UuanMiLCIuLi9zcmMvdHlwZXMvZmlsZS5qcyIsIi4uL3NyYy90eXBlcy9pbmRleC5qcyIsIi4uL3NyYy9hdXRoQXBpL2F1dGhDb21tb24uanMiLCIuLi9zcmMvYXV0aEFwaS9pc0F1dGhvcml6ZWQuanMiLCIuLi9zcmMvYXV0aEFwaS9wZXJtaXNzaW9ucy5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvZ2V0TmV3LmpzIiwiLi4vc3JjL2luZGV4aW5nL2FsbElkcy5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvcmVjb3JkSW5mby5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvbG9hZC5qcyIsIi4uL3NyYy9pbmRleGluZy9wcm9taXNlUmVhZGFibGVTdHJlYW0uanMiLCIuLi9zcmMvaW5kZXhpbmcvc2hhcmRpbmcuanMiLCIuLi9zcmMvaW5kZXhpbmcvaW5kZXhTY2hlbWFDcmVhdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JvbGx1cC1wbHVnaW4tbm9kZS1nbG9iYWxzL3NyYy9nbG9iYWwuanMiLCIuLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVzNi9iYXNlNjQuanMiLCIuLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVzNi9pZWVlNzU0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2J1ZmZlci1lczYvaXNBcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9idWZmZXItZXM2L2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JvbGx1cC1wbHVnaW4tbm9kZS1idWlsdGlucy9zcmMvZXM2L3N0cmluZy1kZWNvZGVyLmpzIiwiLi4vc3JjL2luZGV4aW5nL3NlcmlhbGl6ZXIuanMiLCIuLi9zcmMvaW5kZXhpbmcvcmVhZC5qcyIsIi4uL3NyYy9pbmRleEFwaS9nZXRJbmRleERpci5qcyIsIi4uL3NyYy9pbmRleEFwaS9saXN0SXRlbXMuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2dldENvbnRleHQuanMiLCIuLi9zcmMvcmVjb3JkQXBpL3ZhbGlkYXRlLmpzIiwiLi4vc3JjL2NvbGxlY3Rpb25BcGkvaW5pdGlhbGlzZS5qcyIsIi4uL3NyYy90cmFuc2FjdGlvbnMvdHJhbnNhY3Rpb25zQ29tbW9uLmpzIiwiLi4vc3JjL3RyYW5zYWN0aW9ucy9jcmVhdGUuanMiLCIuLi9zcmMvaW5kZXhpbmcvaW5pdGlhbGlzZUluZGV4LmpzIiwiLi4vc3JjL3JlY29yZEFwaS9zYXZlLmpzIiwiLi4vc3JjL2NvbGxlY3Rpb25BcGkvZGVsZXRlLmpzIiwiLi4vc3JjL3JlY29yZEFwaS9kZWxldGUuanMiLCIuLi9zcmMvcmVjb3JkQXBpL3VwbG9hZEZpbGUuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2Rvd25sb2FkRmlsZS5qcyIsIi4uL3NyYy9yZWNvcmRBcGkvY3VzdG9tSWQuanMiLCIuLi9zcmMvcmVjb3JkQXBpL2luZGV4LmpzIiwiLi4vc3JjL2NvbGxlY3Rpb25BcGkvZ2V0QWxsb3dlZFJlY29yZFR5cGVzLmpzIiwiLi4vc3JjL2NvbGxlY3Rpb25BcGkvaW5kZXguanMiLCIuLi9zcmMvaW5kZXhBcGkvYnVpbGRJbmRleC5qcyIsIi4uL3NyYy9pbmRleEFwaS9hZ2dyZWdhdGVzLmpzIiwiLi4vc3JjL2luZGV4QXBpL2luZGV4LmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2NyZWF0ZU5vZGVzLmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL2ZpZWxkcy5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9yZWNvcmRWYWxpZGF0aW9uUnVsZXMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvY3JlYXRlQWN0aW9ucy5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS92YWxpZGF0ZUFnZ3JlZ2F0ZS5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS92YWxpZGF0ZS5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9nZXRBcHBsaWNhdGlvbkRlZmluaXRpb24uanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5LmpzIiwiLi4vc3JjL3RlbXBsYXRlQXBpL3NhdmVBY3Rpb25zQW5kVHJpZ2dlcnMuanMiLCIuLi9zcmMvdGVtcGxhdGVBcGkvZ2V0QmVoYXZpb3VyU291cmNlcy5qcyIsIi4uL3NyYy90ZW1wbGF0ZUFwaS9pbmRleC5qcyIsIi4uL3NyYy9hdXRoQXBpL2dldFVzZXJzLmpzIiwiLi4vc3JjL2F1dGhBcGkvbG9hZEFjY2Vzc0xldmVscy5qcyIsIi4uL3NyYy9hdXRoQXBpL2F1dGhlbnRpY2F0ZS5qcyIsIi4uL3NyYy9hdXRoQXBpL2NyZWF0ZVRlbXBvcmFyeUFjY2Vzcy5qcyIsIi4uL3NyYy9hdXRoQXBpL3ZhbGlkYXRlVXNlci5qcyIsIi4uL3NyYy9hdXRoQXBpL2dldE5ld1VzZXIuanMiLCIuLi9zcmMvYXV0aEFwaS9zZXRQYXNzd29yZC5qcyIsIi4uL3NyYy9hdXRoQXBpL2NyZWF0ZVVzZXIuanMiLCIuLi9zcmMvYXV0aEFwaS9lbmFibGVVc2VyLmpzIiwiLi4vc3JjL2F1dGhBcGkvZ2V0TmV3QWNjZXNzTGV2ZWwuanMiLCIuLi9zcmMvYXV0aEFwaS92YWxpZGF0ZUFjY2Vzc0xldmVscy5qcyIsIi4uL3NyYy9hdXRoQXBpL3NhdmVBY2Nlc3NMZXZlbHMuanMiLCIuLi9zcmMvYXV0aEFwaS9nZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucy5qcyIsIi4uL3NyYy9hdXRoQXBpL3NldFVzZXJBY2Nlc3NMZXZlbHMuanMiLCIuLi9zcmMvYXV0aEFwaS9pbmRleC5qcyIsIi4uL3NyYy9hY3Rpb25zQXBpL2V4ZWN1dGUuanMiLCIuLi9zcmMvYWN0aW9uc0FwaS9pbmRleC5qcyIsIi4uL3NyYy9hcHBJbml0aWFsaXNlL2V2ZW50QWdncmVnYXRvci5qcyIsIi4uL3NyYy9hcHBJbml0aWFsaXNlL2luZGV4LmpzIiwiLi4vc3JjL2NvbW1vbi9jb21waWxlQ29kZS5qcyIsIi4uL3NyYy9hY3Rpb25zQXBpL2luaXRpYWxpc2UuanMiLCIuLi9zcmMvdHJhbnNhY3Rpb25zL3JldHJpZXZlLmpzIiwiLi4vc3JjL2luZGV4aW5nL3JlbGV2YW50LmpzIiwiLi4vc3JjL2luZGV4aW5nL3Byb21pc2VXcml0YWJsZVN0cmVhbS5qcyIsIi4uL3NyYy9pbmRleGluZy9hcHBseS5qcyIsIi4uL3NyYy90cmFuc2FjdGlvbnMvZXhlY3V0ZS5qcyIsIi4uL3NyYy90cmFuc2FjdGlvbnMvY2xlYW51cC5qcyIsIi4uL3NyYy9hcHBJbml0aWFsaXNlL2luaXRpYWxpc2VEYXRhLmpzIiwiLi4vc3JjL2FwcEluaXRpYWxpc2UvZGF0YWJhc2VNYW5hZ2VyLmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVuaW9uLCByZWR1Y2UgfSBmcm9tICdsb2Rhc2gvZnAnO1xuXG5jb25zdCBjb21tb25QbHVzID0gZXh0cmEgPT4gdW5pb24oWydvbkJlZ2luJywgJ29uQ29tcGxldGUnLCAnb25FcnJvciddKShleHRyYSk7XG5cbmNvbnN0IGNvbW1vbiA9ICgpID0+IGNvbW1vblBsdXMoW10pO1xuXG5jb25zdCBfZXZlbnRzID0ge1xuICByZWNvcmRBcGk6IHtcbiAgICBzYXZlOiBjb21tb25QbHVzKFtcbiAgICAgICdvbkludmFsaWQnLFxuICAgICAgJ29uUmVjb3JkVXBkYXRlZCcsXG4gICAgICAnb25SZWNvcmRDcmVhdGVkJ10pLFxuICAgIGRlbGV0ZTogY29tbW9uKCksXG4gICAgZ2V0Q29udGV4dDogY29tbW9uKCksXG4gICAgZ2V0TmV3OiBjb21tb24oKSxcbiAgICBsb2FkOiBjb21tb24oKSxcbiAgICB2YWxpZGF0ZTogY29tbW9uKCksXG4gICAgdXBsb2FkRmlsZTogY29tbW9uKCksXG4gICAgZG93bmxvYWRGaWxlOiBjb21tb24oKSxcbiAgfSxcbiAgaW5kZXhBcGk6IHtcbiAgICBidWlsZEluZGV4OiBjb21tb24oKSxcbiAgICBsaXN0SXRlbXM6IGNvbW1vbigpLFxuICAgIGRlbGV0ZTogY29tbW9uKCksXG4gICAgYWdncmVnYXRlczogY29tbW9uKCksXG4gIH0sXG4gIGNvbGxlY3Rpb25BcGk6IHtcbiAgICBnZXRBbGxvd2VkUmVjb3JkVHlwZXM6IGNvbW1vbigpLFxuICAgIGluaXRpYWxpc2U6IGNvbW1vbigpLFxuICAgIGRlbGV0ZTogY29tbW9uKCksXG4gIH0sXG4gIGF1dGhBcGk6IHtcbiAgICBhdXRoZW50aWNhdGU6IGNvbW1vbigpLFxuICAgIGF1dGhlbnRpY2F0ZVRlbXBvcmFyeUFjY2VzczogY29tbW9uKCksXG4gICAgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzOiBjb21tb24oKSxcbiAgICBjcmVhdGVVc2VyOiBjb21tb24oKSxcbiAgICBlbmFibGVVc2VyOiBjb21tb24oKSxcbiAgICBkaXNhYmxlVXNlcjogY29tbW9uKCksXG4gICAgbG9hZEFjY2Vzc0xldmVsczogY29tbW9uKCksXG4gICAgZ2V0TmV3QWNjZXNzTGV2ZWw6IGNvbW1vbigpLFxuICAgIGdldE5ld1VzZXI6IGNvbW1vbigpLFxuICAgIGdldE5ld1VzZXJBdXRoOiBjb21tb24oKSxcbiAgICBnZXRVc2VyczogY29tbW9uKCksXG4gICAgc2F2ZUFjY2Vzc0xldmVsczogY29tbW9uKCksXG4gICAgaXNBdXRob3JpemVkOiBjb21tb24oKSxcbiAgICBjaGFuZ2VNeVBhc3N3b3JkOiBjb21tb24oKSxcbiAgICBzZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlOiBjb21tb24oKSxcbiAgICBzY29yZVBhc3N3b3JkOiBjb21tb24oKSxcbiAgICBpc1ZhbGlkUGFzc3dvcmQ6IGNvbW1vbigpLFxuICAgIHZhbGlkYXRlVXNlcjogY29tbW9uKCksXG4gICAgdmFsaWRhdGVBY2Nlc3NMZXZlbHM6IGNvbW1vbigpLFxuICAgIHNldFVzZXJBY2Nlc3NMZXZlbHM6IGNvbW1vbigpLFxuICB9LFxuICB0ZW1wbGF0ZUFwaToge1xuICAgIHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeTogY29tbW9uKCksXG4gICAgc2F2ZUFjdGlvbnNBbmRUcmlnZ2VyczogY29tbW9uKCksXG4gIH0sXG4gIGFjdGlvbnNBcGk6IHtcbiAgICBleGVjdXRlOiBjb21tb24oKSxcbiAgfSxcbn07XG5cbmNvbnN0IF9ldmVudHNMaXN0ID0gW107XG5cbmNvbnN0IG1ha2VFdmVudCA9IChhcmVhLCBtZXRob2QsIG5hbWUpID0+IGAke2FyZWF9OiR7bWV0aG9kfToke25hbWV9YDtcblxuZm9yIChjb25zdCBhcmVhS2V5IGluIF9ldmVudHMpIHtcbiAgZm9yIChjb25zdCBtZXRob2RLZXkgaW4gX2V2ZW50c1thcmVhS2V5XSkge1xuICAgIF9ldmVudHNbYXJlYUtleV1bbWV0aG9kS2V5XSA9IHJlZHVjZSgob2JqLCBzKSA9PiB7XG4gICAgICBvYmpbc10gPSBtYWtlRXZlbnQoYXJlYUtleSwgbWV0aG9kS2V5LCBzKTtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSxcbiAgICB7fSkoX2V2ZW50c1thcmVhS2V5XVttZXRob2RLZXldKTtcbiAgfVxufVxuXG5cbmZvciAoY29uc3QgYXJlYUtleSBpbiBfZXZlbnRzKSB7XG4gIGZvciAoY29uc3QgbWV0aG9kS2V5IGluIF9ldmVudHNbYXJlYUtleV0pIHtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gX2V2ZW50c1thcmVhS2V5XVttZXRob2RLZXldKSB7XG4gICAgICBfZXZlbnRzTGlzdC5wdXNoKFxuICAgICAgICBfZXZlbnRzW2FyZWFLZXldW21ldGhvZEtleV1bbmFtZV0sXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG5cbmV4cG9ydCBjb25zdCBldmVudHMgPSBfZXZlbnRzO1xuXG5leHBvcnQgY29uc3QgZXZlbnRzTGlzdCA9IF9ldmVudHNMaXN0O1xuXG5leHBvcnQgZGVmYXVsdCB7IGV2ZW50czogX2V2ZW50cywgZXZlbnRzTGlzdDogX2V2ZW50c0xpc3QgfTtcbiIsImV4cG9ydCBjbGFzcyBCYWRSZXF1ZXN0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDQwMDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBVbmF1dGhvcmlzZWRFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmh0dHBTdGF0dXNDb2RlID0gNDAxO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEZvcmJpZGRlbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c0NvZGUgPSA0MDM7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTm90Rm91bmRFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmh0dHBTdGF0dXNDb2RlID0gNDA0O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbmZsaWN0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDQwOTtcbiAgICB9XG59IiwiaW1wb3J0IHsgY2xvbmVEZWVwLCBpc1VuZGVmaW5lZCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHsgVW5hdXRob3Jpc2VkRXJyb3IgfSBmcm9tICcuL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBhcGlXcmFwcGVyID0gYXN5bmMgKGFwcCwgZXZlbnROYW1lc3BhY2UsIGlzQXV0aG9yaXplZCwgZXZlbnRDb250ZXh0LCBmdW5jLCAuLi5wYXJhbXMpID0+IHtcbiAgcHVzaENhbGxTdGFjayhhcHAsIGV2ZW50TmFtZXNwYWNlKTtcblxuICBpZiAoIWlzQXV0aG9yaXplZChhcHApKSB7XG4gICAgaGFuZGxlTm90QXV0aG9yaXplZChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHN0YXJ0RGF0ZSA9IERhdGUubm93KCk7XG4gIGNvbnN0IGVsYXBzZWQgPSAoKSA9PiAoRGF0ZS5ub3coKSAtIHN0YXJ0RGF0ZSk7XG5cbiAgdHJ5IHtcbiAgICBhd2FpdCBhcHAucHVibGlzaChcbiAgICAgIGV2ZW50TmFtZXNwYWNlLm9uQmVnaW4sXG4gICAgICBldmVudENvbnRleHQsXG4gICAgKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGZ1bmMoLi4ucGFyYW1zKTtcblxuICAgIGF3YWl0IHB1Ymxpc2hDb21wbGV0ZShhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBhd2FpdCBwdWJsaXNoRXJyb3IoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCBlcnJvcik7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBhcGlXcmFwcGVyU3luYyA9IChhcHAsIGV2ZW50TmFtZXNwYWNlLCBpc0F1dGhvcml6ZWQsIGV2ZW50Q29udGV4dCwgZnVuYywgLi4ucGFyYW1zKSA9PiB7XG4gIHB1c2hDYWxsU3RhY2soYXBwLCBldmVudE5hbWVzcGFjZSk7XG5cbiAgaWYgKCFpc0F1dGhvcml6ZWQoYXBwKSkge1xuICAgIGhhbmRsZU5vdEF1dGhvcml6ZWQoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzdGFydERhdGUgPSBEYXRlLm5vdygpO1xuICBjb25zdCBlbGFwc2VkID0gKCkgPT4gKERhdGUubm93KCkgLSBzdGFydERhdGUpO1xuXG4gIHRyeSB7XG4gICAgYXBwLnB1Ymxpc2goXG4gICAgICBldmVudE5hbWVzcGFjZS5vbkJlZ2luLFxuICAgICAgZXZlbnRDb250ZXh0LFxuICAgICk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBmdW5jKC4uLnBhcmFtcyk7XG5cbiAgICBwdWJsaXNoQ29tcGxldGUoYXBwLCBldmVudENvbnRleHQsIGV2ZW50TmFtZXNwYWNlLCBlbGFwc2VkLCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcHVibGlzaEVycm9yKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5jb25zdCBoYW5kbGVOb3RBdXRob3JpemVkID0gKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSkgPT4ge1xuICBjb25zdCBlcnIgPSBuZXcgVW5hdXRob3Jpc2VkRXJyb3IoYFVuYXV0aG9yaXplZDogJHtldmVudE5hbWVzcGFjZX1gKTtcbiAgcHVibGlzaEVycm9yKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgKCkgPT4gMCwgZXJyKTtcbiAgdGhyb3cgZXJyO1xufTtcblxuY29uc3QgcHVzaENhbGxTdGFjayA9IChhcHAsIGV2ZW50TmFtZXNwYWNlLCBzZWVkQ2FsbElkKSA9PiB7XG4gIGNvbnN0IGNhbGxJZCA9IGdlbmVyYXRlKCk7XG5cbiAgY29uc3QgY3JlYXRlQ2FsbFN0YWNrID0gKCkgPT4gKHtcbiAgICBzZWVkQ2FsbElkOiAhaXNVbmRlZmluZWQoc2VlZENhbGxJZClcbiAgICAgID8gc2VlZENhbGxJZFxuICAgICAgOiBjYWxsSWQsXG4gICAgdGhyZWFkQ2FsbElkOiBjYWxsSWQsXG4gICAgc3RhY2s6IFtdLFxuICB9KTtcblxuICBpZiAoaXNVbmRlZmluZWQoYXBwLmNhbGxzKSkge1xuICAgIGFwcC5jYWxscyA9IGNyZWF0ZUNhbGxTdGFjaygpO1xuICB9XG5cbiAgYXBwLmNhbGxzLnN0YWNrLnB1c2goe1xuICAgIG5hbWVzcGFjZTogZXZlbnROYW1lc3BhY2UsXG4gICAgY2FsbElkLFxuICB9KTtcbn07XG5cbmNvbnN0IHBvcENhbGxTdGFjayA9IChhcHApID0+IHtcbiAgYXBwLmNhbGxzLnN0YWNrLnBvcCgpO1xuICBpZiAoYXBwLmNhbGxzLnN0YWNrLmxlbmd0aCA9PT0gMCkge1xuICAgIGRlbGV0ZSBhcHAuY2FsbHM7XG4gIH1cbn07XG5cbmNvbnN0IHB1Ymxpc2hFcnJvciA9IGFzeW5jIChhcHAsIGV2ZW50Q29udGV4dCwgZXZlbnROYW1lc3BhY2UsIGVsYXBzZWQsIGVycikgPT4ge1xuICBjb25zdCBjdHggPSBjbG9uZURlZXAoZXZlbnRDb250ZXh0KTtcbiAgY3R4LmVycm9yID0gZXJyO1xuICBjdHguZWxhcHNlZCA9IGVsYXBzZWQoKTtcbiAgYXdhaXQgYXBwLnB1Ymxpc2goXG4gICAgZXZlbnROYW1lc3BhY2Uub25FcnJvcixcbiAgICBjdHgsXG4gICk7XG4gIHBvcENhbGxTdGFjayhhcHApO1xufTtcblxuY29uc3QgcHVibGlzaENvbXBsZXRlID0gYXN5bmMgKGFwcCwgZXZlbnRDb250ZXh0LCBldmVudE5hbWVzcGFjZSwgZWxhcHNlZCwgcmVzdWx0KSA9PiB7XG4gIGNvbnN0IGVuZGNvbnRleHQgPSBjbG9uZURlZXAoZXZlbnRDb250ZXh0KTtcbiAgZW5kY29udGV4dC5yZXN1bHQgPSByZXN1bHQ7XG4gIGVuZGNvbnRleHQuZWxhcHNlZCA9IGVsYXBzZWQoKTtcbiAgYXdhaXQgYXBwLnB1Ymxpc2goXG4gICAgZXZlbnROYW1lc3BhY2Uub25Db21wbGV0ZSxcbiAgICBlbmRjb250ZXh0LFxuICApO1xuICBwb3BDYWxsU3RhY2soYXBwKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFwaVdyYXBwZXI7XG4iLCJpbXBvcnQgeyBzcGxpdCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnLi9pbmRleCc7XG5cbmNvbnN0IGxvY2tPdmVybGFwTWlsbGlzZWNvbmRzID0gMTA7XG5cbmV4cG9ydCBjb25zdCBnZXRMb2NrID0gYXN5bmMgKGFwcCwgbG9ja0ZpbGUsIHRpbWVvdXRNaWxsaXNlY29uZHMsIG1heExvY2tSZXRyaWVzLCByZXRyeUNvdW50ID0gMCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHRpbWVvdXQgPSAoYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpKVxuICAgICAgICAgICAgKyB0aW1lb3V0TWlsbGlzZWNvbmRzO1xuXG4gICAgY29uc3QgbG9jayA9IHtcbiAgICAgIHRpbWVvdXQsXG4gICAgICBrZXk6IGxvY2tGaWxlLFxuICAgICAgdG90YWxUaW1lb3V0OiB0aW1lb3V0TWlsbGlzZWNvbmRzLFxuICAgIH07XG5cbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmNyZWF0ZUZpbGUoXG4gICAgICBsb2NrRmlsZSxcbiAgICAgIGdldExvY2tGaWxlQ29udGVudChcbiAgICAgICAgbG9jay50b3RhbFRpbWVvdXQsXG4gICAgICAgIGxvY2sudGltZW91dCxcbiAgICAgICksXG4gICAgKTtcblxuICAgIHJldHVybiBsb2NrO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKHJldHJ5Q291bnQgPT0gbWF4TG9ja1JldHJpZXMpIHsgcmV0dXJuIE5PX0xPQ0s7IH1cblxuICAgIGNvbnN0IGxvY2sgPSBwYXJzZUxvY2tGaWxlQ29udGVudChcbiAgICAgIGxvY2tGaWxlLFxuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkRmlsZShsb2NrRmlsZSksXG4gICAgKTtcblxuICAgIGNvbnN0IGN1cnJlbnRFcG9jaFRpbWUgPSBhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCk7XG5cbiAgICBpZiAoY3VycmVudEVwb2NoVGltZSA8IGxvY2sudGltZW91dCkge1xuICAgICAgcmV0dXJuIE5PX0xPQ0s7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZShsb2NrRmlsZSk7XG4gICAgfSBjYXRjaCAoXykge1xuICAgICAgLy9lbXB0eVxuICAgIH1cblxuICAgIGF3YWl0IHNsZWVwRm9yUmV0cnkoKTtcblxuICAgIHJldHVybiBhd2FpdCBnZXRMb2NrKFxuICAgICAgYXBwLCBsb2NrRmlsZSwgdGltZW91dE1pbGxpc2Vjb25kcyxcbiAgICAgIG1heExvY2tSZXRyaWVzLCByZXRyeUNvdW50ICsgMSxcbiAgICApO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TG9ja0ZpbGVDb250ZW50ID0gKHRvdGFsVGltZW91dCwgZXBvY2hUaW1lKSA9PiBgJHt0b3RhbFRpbWVvdXR9OiR7ZXBvY2hUaW1lLnRvU3RyaW5nKCl9YDtcblxuY29uc3QgcGFyc2VMb2NrRmlsZUNvbnRlbnQgPSAoa2V5LCBjb250ZW50KSA9PiAkKGNvbnRlbnQsIFtcbiAgc3BsaXQoJzonKSxcbiAgcGFydHMgPT4gKHtcbiAgICB0b3RhbFRpbWVvdXQ6IG5ldyBOdW1iZXIocGFydHNbMF0pLFxuICAgIHRpbWVvdXQ6IG5ldyBOdW1iZXIocGFydHNbMV0pLFxuICAgIGtleSxcbiAgfSksXG5dKTtcblxuZXhwb3J0IGNvbnN0IHJlbGVhc2VMb2NrID0gYXN5bmMgKGFwcCwgbG9jaykgPT4ge1xuICBjb25zdCBjdXJyZW50RXBvY2hUaW1lID0gYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpO1xuICAvLyBvbmx5IHJlbGVhc2UgaWYgbm90IHRpbWVkb3V0XG4gIGlmIChjdXJyZW50RXBvY2hUaW1lIDwgKGxvY2sudGltZW91dCAtIGxvY2tPdmVybGFwTWlsbGlzZWNvbmRzKSkge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZpbGUobG9jay5rZXkpO1xuICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgIC8vZW1wdHlcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBleHRlbmRMb2NrID0gYXN5bmMgKGFwcCwgbG9jaykgPT4ge1xuICBjb25zdCBjdXJyZW50RXBvY2hUaW1lID0gYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpO1xuICAvLyBvbmx5IHJlbGVhc2UgaWYgbm90IHRpbWVkb3V0XG4gIGlmIChjdXJyZW50RXBvY2hUaW1lIDwgKGxvY2sudGltZW91dCAtIGxvY2tPdmVybGFwTWlsbGlzZWNvbmRzKSkge1xuICAgIHRyeSB7XG4gICAgICBsb2NrLnRpbWVvdXQgPSBjdXJyZW50RXBvY2hUaW1lICsgbG9jay50aW1lb3V0TWlsbGlzZWNvbmRzO1xuICAgICAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVGaWxlKFxuICAgICAgICBsb2NrLmtleSxcbiAgICAgICAgZ2V0TG9ja0ZpbGVDb250ZW50KGxvY2sudG90YWxUaW1lb3V0LCBsb2NrLnRpbWVvdXQpLFxuICAgICAgKTtcbiAgICAgIHJldHVybiBsb2NrO1xuICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgIC8vZW1wdHlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIE5PX0xPQ0s7XG59O1xuXG5leHBvcnQgY29uc3QgTk9fTE9DSyA9ICdubyBsb2NrJztcbmV4cG9ydCBjb25zdCBpc05vbG9jayA9IGlkID0+IGlkID09PSBOT19MT0NLO1xuXG5jb25zdCBzbGVlcEZvclJldHJ5ID0gKCkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGxvY2tPdmVybGFwTWlsbGlzZWNvbmRzKSk7XG4iLCJpbXBvcnQge1xuICBcbiAgaGVhZCwgXG4gIHRhaWwsIGZpbmRJbmRleCwgc3RhcnRzV2l0aCwgXG4gIGRyb3BSaWdodCwgZmxvdywgdGFrZVJpZ2h0LCB0cmltLFxuICByZXBsYWNlXG59IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBcbiAgc29tZSwgcmVkdWNlLCBpc0VtcHR5LCBpc0FycmF5LCBqb2luLFxuICBpc1N0cmluZywgaXNJbnRlZ2VyLCBpc0RhdGUsIHRvTnVtYmVyLFxuICBpc1VuZGVmaW5lZCwgaXNOYU4sIGlzTnVsbCwgY29uc3RhbnQsXG4gIHNwbGl0LCBpbmNsdWRlcywgZmlsdGVyXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBldmVudHMsIGV2ZW50c0xpc3QgfSBmcm9tICcuL2V2ZW50cyc7XG5pbXBvcnQgeyBhcGlXcmFwcGVyIH0gZnJvbSAnLi9hcGlXcmFwcGVyJztcbmltcG9ydCB7XG4gIGdldExvY2ssIE5PX0xPQ0ssXG4gIGlzTm9sb2NrXG59IGZyb20gJy4vbG9jayc7XG5cbi8vIHRoaXMgaXMgdGhlIGNvbWJpbmF0b3IgZnVuY3Rpb25cbmV4cG9ydCBjb25zdCAkJCA9ICguLi5mdW5jcykgPT4gYXJnID0+IGZsb3coZnVuY3MpKGFyZyk7XG5cbi8vIHRoaXMgaXMgdGhlIHBpcGUgZnVuY3Rpb25cbmV4cG9ydCBjb25zdCAkID0gKGFyZywgZnVuY3MpID0+ICQkKC4uLmZ1bmNzKShhcmcpO1xuXG5leHBvcnQgY29uc3Qga2V5U2VwID0gJy8nO1xuY29uc3QgdHJpbUtleVNlcCA9IHN0ciA9PiB0cmltKHN0ciwga2V5U2VwKTtcbmNvbnN0IHNwbGl0QnlLZXlTZXAgPSBzdHIgPT4gc3BsaXQoa2V5U2VwKShzdHIpO1xuZXhwb3J0IGNvbnN0IHNhZmVLZXkgPSBrZXkgPT4gcmVwbGFjZShgJHtrZXlTZXB9JHt0cmltS2V5U2VwKGtleSl9YCwgYCR7a2V5U2VwfSR7a2V5U2VwfWAsIGtleVNlcCk7XG5leHBvcnQgY29uc3Qgam9pbktleSA9ICguLi5zdHJzKSA9PiB7XG4gIGNvbnN0IHBhcmFtc09yQXJyYXkgPSBzdHJzLmxlbmd0aCA9PT0gMSAmIGlzQXJyYXkoc3Ryc1swXSlcbiAgICA/IHN0cnNbMF0gOiBzdHJzO1xuICByZXR1cm4gJChwYXJhbXNPckFycmF5LCBbXG4gICAgZmlsdGVyKHMgPT4gIWlzVW5kZWZpbmVkKHMpIFxuICAgICAgICAgICAgICAgICYmICFpc051bGwocykgXG4gICAgICAgICAgICAgICAgJiYgcy50b1N0cmluZygpLmxlbmd0aCA+IDApLFxuICAgIGpvaW4oa2V5U2VwKSxcbiAgICBzYWZlS2V5XG4gIF0pO1xufTtcbmV4cG9ydCBjb25zdCBzcGxpdEtleSA9ICQkKHRyaW1LZXlTZXAsIHNwbGl0QnlLZXlTZXApO1xuZXhwb3J0IGNvbnN0IGdldERpckZvbUtleSA9ICQkKHNwbGl0S2V5LCBkcm9wUmlnaHQsIHAgPT4gam9pbktleSguLi5wKSk7XG5leHBvcnQgY29uc3QgZ2V0RmlsZUZyb21LZXkgPSAkJChzcGxpdEtleSwgdGFrZVJpZ2h0LCBoZWFkKTtcblxuZXhwb3J0IGNvbnN0IGNvbmZpZ0ZvbGRlciA9IGAke2tleVNlcH0uY29uZmlnYDtcbmV4cG9ydCBjb25zdCBmaWVsZERlZmluaXRpb25zID0gam9pbktleShjb25maWdGb2xkZXIsICdmaWVsZHMuanNvbicpO1xuZXhwb3J0IGNvbnN0IHRlbXBsYXRlRGVmaW5pdGlvbnMgPSBqb2luS2V5KGNvbmZpZ0ZvbGRlciwgJ3RlbXBsYXRlcy5qc29uJyk7XG5leHBvcnQgY29uc3QgYXBwRGVmaW5pdGlvbkZpbGUgPSBqb2luS2V5KGNvbmZpZ0ZvbGRlciwgJ2FwcERlZmluaXRpb24uanNvbicpO1xuZXhwb3J0IGNvbnN0IGRpckluZGV4ID0gZm9sZGVyUGF0aCA9PiBqb2luS2V5KGNvbmZpZ0ZvbGRlciwgJ2RpcicsIC4uLnNwbGl0S2V5KGZvbGRlclBhdGgpLCAnZGlyLmlkeCcpO1xuZXhwb3J0IGNvbnN0IGdldEluZGV4S2V5RnJvbUZpbGVLZXkgPSAkJChnZXREaXJGb21LZXksIGRpckluZGV4KTtcblxuZXhwb3J0IGNvbnN0IGlmRXhpc3RzID0gKHZhbCwgZXhpc3RzLCBub3RFeGlzdHMpID0+IChpc1VuZGVmaW5lZCh2YWwpXG4gID8gaXNVbmRlZmluZWQobm90RXhpc3RzKSA/ICgoKSA9PiB7IH0pKCkgOiBub3RFeGlzdHMoKVxuICA6IGV4aXN0cygpKTtcblxuZXhwb3J0IGNvbnN0IGdldE9yRGVmYXVsdCA9ICh2YWwsIGRlZmF1bHRWYWwpID0+IGlmRXhpc3RzKHZhbCwgKCkgPT4gdmFsLCAoKSA9PiBkZWZhdWx0VmFsKTtcblxuZXhwb3J0IGNvbnN0IG5vdCA9IGZ1bmMgPT4gdmFsID0+ICFmdW5jKHZhbCk7XG5leHBvcnQgY29uc3QgaXNEZWZpbmVkID0gbm90KGlzVW5kZWZpbmVkKTtcbmV4cG9ydCBjb25zdCBpc05vbk51bGwgPSBub3QoaXNOdWxsKTtcbmV4cG9ydCBjb25zdCBpc05vdE5hTiA9IG5vdChpc05hTik7XG5cbmV4cG9ydCBjb25zdCBhbGxUcnVlID0gKC4uLmZ1bmNBcmdzKSA9PiB2YWwgPT4gcmVkdWNlKFxuICAocmVzdWx0LCBjb25kaXRpb25GdW5jKSA9PiAoaXNOdWxsKHJlc3VsdCkgfHwgcmVzdWx0ID09IHRydWUpICYmIGNvbmRpdGlvbkZ1bmModmFsKSxcbiAgbnVsbCkoZnVuY0FyZ3MpO1xuXG5leHBvcnQgY29uc3QgYW55VHJ1ZSA9ICguLi5mdW5jQXJncykgPT4gdmFsID0+IHJlZHVjZShcbiAgKHJlc3VsdCwgY29uZGl0aW9uRnVuYykgPT4gcmVzdWx0ID09IHRydWUgfHwgY29uZGl0aW9uRnVuYyh2YWwpLFxuICBudWxsKShmdW5jQXJncyk7XG5cbmV4cG9ydCBjb25zdCBpbnNlbnNpdGl2ZUVxdWFscyA9IChzdHIxLCBzdHIyKSA9PiBzdHIxLnRyaW0oKS50b0xvd2VyQ2FzZSgpID09PSBzdHIyLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuXG5leHBvcnQgY29uc3QgaXNTb21ldGhpbmcgPSBhbGxUcnVlKGlzRGVmaW5lZCwgaXNOb25OdWxsLCBpc05vdE5hTik7XG5leHBvcnQgY29uc3QgaXNOb3RoaW5nID0gbm90KGlzU29tZXRoaW5nKTtcbmV4cG9ydCBjb25zdCBpc05vdGhpbmdPckVtcHR5ID0gdiA9PiBpc05vdGhpbmcodikgfHwgaXNFbXB0eSh2KTtcbmV4cG9ydCBjb25zdCBzb21ldGhpbmdPckdldERlZmF1bHQgPSBnZXREZWZhdWx0RnVuYyA9PiB2YWwgPT4gKGlzU29tZXRoaW5nKHZhbCkgPyB2YWwgOiBnZXREZWZhdWx0RnVuYygpKTtcbmV4cG9ydCBjb25zdCBzb21ldGhpbmdPckRlZmF1bHQgPSAodmFsLCBkZWZhdWx0VmFsKSA9PiBzb21ldGhpbmdPckdldERlZmF1bHQoY29uc3RhbnQoZGVmYXVsdFZhbCkpKHZhbCk7XG5cbmV4cG9ydCBjb25zdCBtYXBJZlNvbWV0aGluZ09yRGVmYXVsdCA9IChtYXBGdW5jLCBkZWZhdWx0VmFsKSA9PiB2YWwgPT4gKGlzU29tZXRoaW5nKHZhbCkgPyBtYXBGdW5jKHZhbCkgOiBkZWZhdWx0VmFsKTtcblxuZXhwb3J0IGNvbnN0IG1hcElmU29tZXRoaW5nT3JCbGFuayA9IG1hcEZ1bmMgPT4gbWFwSWZTb21ldGhpbmdPckRlZmF1bHQobWFwRnVuYywgJycpO1xuXG5leHBvcnQgY29uc3Qgbm9uZSA9IHByZWRpY2F0ZSA9PiBjb2xsZWN0aW9uID0+ICFzb21lKHByZWRpY2F0ZSkoY29sbGVjdGlvbik7XG5cbmV4cG9ydCBjb25zdCBhbGwgPSBwcmVkaWNhdGUgPT4gY29sbGVjdGlvbiA9PiBub25lKHYgPT4gIXByZWRpY2F0ZSh2KSkoY29sbGVjdGlvbik7XG5cbmV4cG9ydCBjb25zdCBpc05vdEVtcHR5ID0gb2IgPT4gIWlzRW1wdHkob2IpO1xuZXhwb3J0IGNvbnN0IGlzQXN5bmMgPSBmbiA9PiBmbi5jb25zdHJ1Y3Rvci5uYW1lID09PSAnQXN5bmNGdW5jdGlvbic7XG5leHBvcnQgY29uc3QgaXNOb25FbXB0eUFycmF5ID0gYWxsVHJ1ZShpc0FycmF5LCBpc05vdEVtcHR5KTtcbmV4cG9ydCBjb25zdCBpc05vbkVtcHR5U3RyaW5nID0gYWxsVHJ1ZShpc1N0cmluZywgaXNOb3RFbXB0eSk7XG5leHBvcnQgY29uc3QgdHJ5T3IgPSBmYWlsRnVuYyA9PiAoZnVuYywgLi4uYXJncykgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBmdW5jLmFwcGx5KG51bGwsIC4uLmFyZ3MpO1xuICB9IGNhdGNoIChfKSB7XG4gICAgcmV0dXJuIGZhaWxGdW5jKCk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCB0cnlBd2FpdE9yID0gZmFpbEZ1bmMgPT4gYXN5bmMgKGZ1bmMsIC4uLmFyZ3MpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgZnVuYy5hcHBseShudWxsLCAuLi5hcmdzKTtcbiAgfSBjYXRjaCAoXykge1xuICAgIHJldHVybiBhd2FpdCBmYWlsRnVuYygpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZGVmaW5lRXJyb3IgPSAoZnVuYywgZXJyb3JQcmVmaXgpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnVuYygpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBlcnIubWVzc2FnZSA9IGAke2Vycm9yUHJlZml4fSA6ICR7ZXJyLm1lc3NhZ2V9YDtcbiAgICB0aHJvdyBlcnI7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCB0cnlPcklnbm9yZSA9IHRyeU9yKCgpID0+IHsgfSk7XG5leHBvcnQgY29uc3QgdHJ5QXdhaXRPcklnbm9yZSA9IHRyeUF3YWl0T3IoYXN5bmMgKCkgPT4geyB9KTtcbmV4cG9ydCBjb25zdCBjYXVzZXNFeGNlcHRpb24gPSAoZnVuYykgPT4ge1xuICB0cnkge1xuICAgIGZ1bmMoKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbiA9IGZ1bmMgPT4gIWNhdXNlc0V4Y2VwdGlvbihmdW5jKTtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZUVycm9yV2l0aCA9IHJldHVyblZhbEluRXJyb3IgPT4gdHJ5T3IoY29uc3RhbnQocmV0dXJuVmFsSW5FcnJvcikpO1xuXG5leHBvcnQgY29uc3QgaGFuZGxlRXJyb3JXaXRoVW5kZWZpbmVkID0gaGFuZGxlRXJyb3JXaXRoKHVuZGVmaW5lZCk7XG5cbmV4cG9ydCBjb25zdCBzd2l0Y2hDYXNlID0gKC4uLmNhc2VzKSA9PiAodmFsdWUpID0+IHtcbiAgY29uc3QgbmV4dENhc2UgPSAoKSA9PiBoZWFkKGNhc2VzKVswXSh2YWx1ZSk7XG4gIGNvbnN0IG5leHRSZXN1bHQgPSAoKSA9PiBoZWFkKGNhc2VzKVsxXSh2YWx1ZSk7XG5cbiAgaWYgKGlzRW1wdHkoY2FzZXMpKSByZXR1cm47IC8vIHVuZGVmaW5lZFxuICBpZiAobmV4dENhc2UoKSA9PT0gdHJ1ZSkgcmV0dXJuIG5leHRSZXN1bHQoKTtcbiAgcmV0dXJuIHN3aXRjaENhc2UoLi4udGFpbChjYXNlcykpKHZhbHVlKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1ZhbHVlID0gdmFsMSA9PiB2YWwyID0+ICh2YWwxID09PSB2YWwyKTtcbmV4cG9ydCBjb25zdCBpc09uZU9mID0gKC4uLnZhbHMpID0+IHZhbCA9PiBpbmNsdWRlcyh2YWwpKHZhbHMpO1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRDYXNlID0gY29uc3RhbnQodHJ1ZSk7XG5leHBvcnQgY29uc3QgbWVtYmVyTWF0Y2hlcyA9IChtZW1iZXIsIG1hdGNoKSA9PiBvYmogPT4gbWF0Y2gob2JqW21lbWJlcl0pO1xuXG5cbmV4cG9ydCBjb25zdCBTdGFydHNXaXRoID0gc2VhcmNoRm9yID0+IHNlYXJjaEluID0+IHN0YXJ0c1dpdGgoc2VhcmNoSW4sIHNlYXJjaEZvcik7XG5cbmV4cG9ydCBjb25zdCBjb250YWlucyA9IHZhbCA9PiBhcnJheSA9PiAoZmluZEluZGV4KGFycmF5LCB2ID0+IHYgPT09IHZhbCkgPiAtMSk7XG5cbmV4cG9ydCBjb25zdCBnZXRIYXNoQ29kZSA9IChzKSA9PiB7XG4gIGxldCBoYXNoID0gMDsgbGV0IGk7IGxldCBjaGFyOyBsZXRcbiAgICBsO1xuICBpZiAocy5sZW5ndGggPT0gMCkgcmV0dXJuIGhhc2g7XG4gIGZvciAoaSA9IDAsIGwgPSBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNoYXIgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2hhcjtcbiAgICBoYXNoIHw9IDA7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICB9XG5cbiAgLy8gY29udmVydGluZyB0byBzdHJpbmcsIGJ1dCBkb250IHdhbnQgYSBcIi1cIiBwcmVmaXhlZFxuICBpZiAoaGFzaCA8IDApIHsgcmV0dXJuIGBuJHsoaGFzaCAqIC0xKS50b1N0cmluZygpfWA7IH1cbiAgcmV0dXJuIGhhc2gudG9TdHJpbmcoKTtcbn07XG5cbi8vIHRoYW5rcyB0byBodHRwczovL2Jsb2cuZ3Jvc3NtYW4uaW8vaG93LXRvLXdyaXRlLWFzeW5jLWF3YWl0LXdpdGhvdXQtdHJ5LWNhdGNoLWJsb2Nrcy1pbi1qYXZhc2NyaXB0L1xuZXhwb3J0IGNvbnN0IGF3RXggPSBhc3luYyAocHJvbWlzZSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHByb21pc2U7XG4gICAgcmV0dXJuIFt1bmRlZmluZWQsIHJlc3VsdF07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIFtlcnJvciwgdW5kZWZpbmVkXTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGlzU2FmZUludGVnZXIgPSBuID0+IGlzSW50ZWdlcihuKVxuICAgICYmIG4gPD0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgICAmJiBuID49IDAgLSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcblxuZXhwb3J0IGNvbnN0IHRvRGF0ZU9yTnVsbCA9IHMgPT4gKGlzTnVsbChzKSA/IG51bGxcbiAgOiBpc0RhdGUocykgPyBzIDogbmV3IERhdGUocykpO1xuZXhwb3J0IGNvbnN0IHRvQm9vbE9yTnVsbCA9IHMgPT4gKGlzTnVsbChzKSA/IG51bGxcbiAgOiBzID09PSAndHJ1ZScgfHwgcyA9PT0gdHJ1ZSk7XG5leHBvcnQgY29uc3QgdG9OdW1iZXJPck51bGwgPSBzID0+IChpc051bGwocykgPyBudWxsXG4gIDogdG9OdW1iZXIocykpO1xuXG5leHBvcnQgY29uc3QgaXNBcnJheU9mU3RyaW5nID0gb3B0cyA9PiBpc0FycmF5KG9wdHMpICYmIGFsbChpc1N0cmluZykob3B0cyk7XG5cbmV4cG9ydCBjb25zdCBwdXNoQWxsID0gKHRhcmdldCwgaXRlbXMpID0+IHtcbiAgZm9yKGxldCBpIG9mIGl0ZW1zKSB0YXJnZXQucHVzaChpKTtcbn1cblxuZXhwb3J0IGNvbnN0IHBhdXNlID0gYXN5bmMgZHVyYXRpb24gPT4gbmV3IFByb21pc2UocmVzID0+IHNldFRpbWVvdXQocmVzLCBkdXJhdGlvbikpO1xuXG5leHBvcnQgY29uc3QgcmV0cnkgPSBhc3luYyAoZm4sIHJldHJpZXMsIGRlbGF5LCAuLi5hcmdzKSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGZuKC4uLmFyZ3MpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAocmV0cmllcyA+IDEpIHtcbiAgICAgIHJldHVybiBhd2FpdCBwYXVzZShkZWxheSkudGhlbihhc3luYyAoKSA9PiBhd2FpdCByZXRyeShmbiwgKHJldHJpZXMgLSAxKSwgZGVsYXksIC4uLmFyZ3MpKTtcbiAgICB9XG4gICAgdGhyb3cgZXJyO1xuICB9XG59O1xuXG5leHBvcnQgeyBldmVudHMgfSBmcm9tICcuL2V2ZW50cyc7XG5leHBvcnQgeyBhcGlXcmFwcGVyLCBhcGlXcmFwcGVyU3luYyB9IGZyb20gJy4vYXBpV3JhcHBlcic7XG5leHBvcnQge1xuICBnZXRMb2NrLCBOT19MT0NLLCByZWxlYXNlTG9jayxcbiAgZXh0ZW5kTG9jaywgaXNOb2xvY2ssXG59IGZyb20gJy4vbG9jayc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaWZFeGlzdHMsXG4gIGdldE9yRGVmYXVsdCxcbiAgaXNEZWZpbmVkLFxuICBpc05vbk51bGwsXG4gIGlzTm90TmFOLFxuICBhbGxUcnVlLFxuICBpc1NvbWV0aGluZyxcbiAgbWFwSWZTb21ldGhpbmdPckRlZmF1bHQsXG4gIG1hcElmU29tZXRoaW5nT3JCbGFuayxcbiAgY29uZmlnRm9sZGVyLFxuICBmaWVsZERlZmluaXRpb25zLFxuICBpc05vdGhpbmcsXG4gIG5vdCxcbiAgc3dpdGNoQ2FzZSxcbiAgZGVmYXVsdENhc2UsXG4gIFN0YXJ0c1dpdGgsXG4gIGNvbnRhaW5zLFxuICB0ZW1wbGF0ZURlZmluaXRpb25zLFxuICBoYW5kbGVFcnJvcldpdGgsXG4gIGhhbmRsZUVycm9yV2l0aFVuZGVmaW5lZCxcbiAgdHJ5T3IsXG4gIHRyeU9ySWdub3JlLFxuICB0cnlBd2FpdE9yLFxuICB0cnlBd2FpdE9ySWdub3JlLFxuICBkaXJJbmRleCxcbiAga2V5U2VwLFxuICAkLFxuICAkJCxcbiAgZ2V0RGlyRm9tS2V5LFxuICBnZXRGaWxlRnJvbUtleSxcbiAgc3BsaXRLZXksXG4gIHNvbWV0aGluZ09yRGVmYXVsdCxcbiAgZ2V0SW5kZXhLZXlGcm9tRmlsZUtleSxcbiAgam9pbktleSxcbiAgc29tZXRoaW5nT3JHZXREZWZhdWx0LFxuICBhcHBEZWZpbml0aW9uRmlsZSxcbiAgaXNWYWx1ZSxcbiAgYWxsLFxuICBpc09uZU9mLFxuICBtZW1iZXJNYXRjaGVzLFxuICBkZWZpbmVFcnJvcixcbiAgYW55VHJ1ZSxcbiAgaXNOb25FbXB0eUFycmF5LFxuICBjYXVzZXNFeGNlcHRpb24sXG4gIGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbixcbiAgbm9uZSxcbiAgZ2V0SGFzaENvZGUsXG4gIGF3RXgsXG4gIGFwaVdyYXBwZXIsXG4gIGV2ZW50cyxcbiAgZXZlbnRzTGlzdCxcbiAgaXNOb3RoaW5nT3JFbXB0eSxcbiAgaXNTYWZlSW50ZWdlcixcbiAgdG9OdW1iZXIsXG4gIHRvRGF0ZTogdG9EYXRlT3JOdWxsLFxuICB0b0Jvb2w6IHRvQm9vbE9yTnVsbCxcbiAgaXNBcnJheU9mU3RyaW5nLFxuICBnZXRMb2NrLFxuICBOT19MT0NLLFxuICBpc05vbG9jayxcbiAgaW5zZW5zaXRpdmVFcXVhbHMsXG4gIHBhdXNlLFxuICByZXRyeSxcbiAgcHVzaEFsbFxufTtcbiIsImltcG9ydCB7IGZpbHRlciwgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7ICQsIGlzU29tZXRoaW5nIH0gZnJvbSAnLi9pbmRleCc7XG5cbmV4cG9ydCBjb25zdCBzdHJpbmdOb3RFbXB0eSA9IHMgPT4gaXNTb21ldGhpbmcocykgJiYgcy50cmltKCkubGVuZ3RoID4gMDtcblxuZXhwb3J0IGNvbnN0IG1ha2VydWxlID0gKGZpZWxkLCBlcnJvciwgaXNWYWxpZCkgPT4gKHsgZmllbGQsIGVycm9yLCBpc1ZhbGlkIH0pO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGlvbkVycm9yID0gKHJ1bGUsIGl0ZW0pID0+ICh7IC4uLnJ1bGUsIGl0ZW0gfSk7XG5cbmV4cG9ydCBjb25zdCBhcHBseVJ1bGVTZXQgPSBydWxlU2V0ID0+IGl0ZW1Ub1ZhbGlkYXRlID0+ICQocnVsZVNldCwgW1xuICBtYXAoYXBwbHlSdWxlKGl0ZW1Ub1ZhbGlkYXRlKSksXG4gIGZpbHRlcihpc1NvbWV0aGluZyksXG5dKTtcblxuZXhwb3J0IGNvbnN0IGFwcGx5UnVsZSA9IGl0ZW1Ub3ZhbGlkYXRlID0+IHJ1bGUgPT4gKHJ1bGUuaXNWYWxpZChpdGVtVG92YWxpZGF0ZSlcbiAgPyBudWxsXG4gIDogdmFsaWRhdGlvbkVycm9yKHJ1bGUsIGl0ZW1Ub3ZhbGlkYXRlKSk7XG4iLCJpbXBvcnQgeyBjb21waWxlRXhwcmVzc2lvbiwgY29tcGlsZUNvZGUgfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XG5pbXBvcnQge1xuICBpc1VuZGVmaW5lZCwga2V5cywgXG4gIGNsb25lRGVlcCwgaXNGdW5jdGlvbixcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGRlZmluZUVycm9yIH0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGZpbHRlckV2YWwgPSAnRklMVEVSX0VWQUxVQVRFJztcbmV4cG9ydCBjb25zdCBmaWx0ZXJDb21waWxlID0gJ0ZJTFRFUl9DT01QSUxFJztcbmV4cG9ydCBjb25zdCBtYXBFdmFsID0gJ01BUF9FVkFMVUFURSc7XG5leHBvcnQgY29uc3QgbWFwQ29tcGlsZSA9ICdNQVBfQ09NUElMRSc7XG5leHBvcnQgY29uc3QgcmVtb3ZlVW5kZWNsYXJlZEZpZWxkcyA9ICdSRU1PVkVfVU5ERUNMQVJFRF9GSUVMRFMnO1xuZXhwb3J0IGNvbnN0IGFkZFVuTWFwcGVkRmllbGRzID0gJ0FERF9VTk1BUFBFRF9GSUVMRFMnO1xuZXhwb3J0IGNvbnN0IGFkZFRoZUtleSA9ICdBRERfS0VZJztcblxuXG5jb25zdCBnZXRFdmFsdWF0ZVJlc3VsdCA9ICgpID0+ICh7XG4gIGlzRXJyb3I6IGZhbHNlLFxuICBwYXNzZWRGaWx0ZXI6IHRydWUsXG4gIHJlc3VsdDogbnVsbCxcbn0pO1xuXG5leHBvcnQgY29uc3QgY29tcGlsZUZpbHRlciA9IGluZGV4ID0+IGNvbXBpbGVFeHByZXNzaW9uKGluZGV4LmZpbHRlcik7XG5cbmV4cG9ydCBjb25zdCBjb21waWxlTWFwID0gaW5kZXggPT4gY29tcGlsZUNvZGUoaW5kZXgubWFwKTtcblxuZXhwb3J0IGNvbnN0IHBhc3Nlc0ZpbHRlciA9IChyZWNvcmQsIGluZGV4KSA9PiB7XG4gIGNvbnN0IGNvbnRleHQgPSB7IHJlY29yZCB9O1xuICBpZiAoIWluZGV4LmZpbHRlcikgcmV0dXJuIHRydWU7XG5cbiAgY29uc3QgY29tcGlsZWRGaWx0ZXIgPSBkZWZpbmVFcnJvcihcbiAgICAoKSA9PiBjb21waWxlRmlsdGVyKGluZGV4KSxcbiAgICBmaWx0ZXJDb21waWxlLFxuICApO1xuXG4gIHJldHVybiBkZWZpbmVFcnJvcihcbiAgICAoKSA9PiBjb21waWxlZEZpbHRlcihjb250ZXh0KSxcbiAgICBmaWx0ZXJFdmFsLFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IG1hcFJlY29yZCA9IChyZWNvcmQsIGluZGV4KSA9PiB7XG4gIGNvbnN0IHJlY29yZENsb25lID0gY2xvbmVEZWVwKHJlY29yZCk7XG4gIGNvbnN0IGNvbnRleHQgPSB7IHJlY29yZDogcmVjb3JkQ2xvbmUgfTtcblxuICBjb25zdCBtYXAgPSBpbmRleC5tYXAgPyBpbmRleC5tYXAgOiAncmV0dXJuIHsuLi5yZWNvcmR9Oyc7XG5cbiAgY29uc3QgY29tcGlsZWRNYXAgPSBkZWZpbmVFcnJvcihcbiAgICAoKSA9PiBjb21waWxlQ29kZShtYXApLFxuICAgIG1hcENvbXBpbGUsXG4gICk7XG5cbiAgY29uc3QgbWFwcGVkID0gZGVmaW5lRXJyb3IoXG4gICAgKCkgPT4gY29tcGlsZWRNYXAoY29udGV4dCksXG4gICAgbWFwRXZhbCxcbiAgKTtcblxuICBjb25zdCBtYXBwZWRLZXlzID0ga2V5cyhtYXBwZWQpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hcHBlZEtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBrZXkgPSBtYXBwZWRLZXlzW2ldO1xuICAgIG1hcHBlZFtrZXldID0gaXNVbmRlZmluZWQobWFwcGVkW2tleV0pID8gbnVsbCA6IG1hcHBlZFtrZXldO1xuICAgIGlmIChpc0Z1bmN0aW9uKG1hcHBlZFtrZXldKSkge1xuICAgICAgZGVsZXRlIG1hcHBlZFtrZXldO1xuICAgIH1cbiAgfVxuXG4gIG1hcHBlZC5rZXkgPSByZWNvcmQua2V5O1xuICBtYXBwZWQuc29ydEtleSA9IGluZGV4LmdldFNvcnRLZXlcbiAgICA/IGNvbXBpbGVDb2RlKGluZGV4LmdldFNvcnRLZXkpKGNvbnRleHQpXG4gICAgOiByZWNvcmQuaWQ7XG5cbiAgcmV0dXJuIG1hcHBlZDtcbn07XG5cbmV4cG9ydCBjb25zdCBldmFsdWF0ZSA9IHJlY29yZCA9PiAoaW5kZXgpID0+IHtcbiAgY29uc3QgcmVzdWx0ID0gZ2V0RXZhbHVhdGVSZXN1bHQoKTtcblxuICB0cnkge1xuICAgIHJlc3VsdC5wYXNzZWRGaWx0ZXIgPSBwYXNzZXNGaWx0ZXIocmVjb3JkLCBpbmRleCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJlc3VsdC5pc0Vycm9yID0gdHJ1ZTtcbiAgICByZXN1bHQucGFzc2VkRmlsdGVyID0gZmFsc2U7XG4gICAgcmVzdWx0LnJlc3VsdCA9IGVyci5tZXNzYWdlO1xuICB9XG5cbiAgaWYgKCFyZXN1bHQucGFzc2VkRmlsdGVyKSByZXR1cm4gcmVzdWx0O1xuXG4gIHRyeSB7XG4gICAgcmVzdWx0LnJlc3VsdCA9IG1hcFJlY29yZChyZWNvcmQsIGluZGV4KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmVzdWx0LmlzRXJyb3IgPSB0cnVlO1xuICAgIHJlc3VsdC5yZXN1bHQgPSBlcnIubWVzc2FnZTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBldmFsdWF0ZTtcbiIsImltcG9ydCB7XG4gIG1hcCwgaXNFbXB0eSwgY291bnRCeSwgXG4gIGZsYXR0ZW4sIGluY2x1ZGVzLCBqb2luLCBrZXlzXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyAgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSB9IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcbmltcG9ydCB7IGNvbXBpbGVGaWx0ZXIsIGNvbXBpbGVNYXAgfSBmcm9tICcuLi9pbmRleGluZy9ldmFsdWF0ZSc7XG5pbXBvcnQgeyBpc05vbkVtcHR5U3RyaW5nLCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24sICQgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgaXNSZWNvcmQgfSBmcm9tICcuL2hpZXJhcmNoeSc7XG5cbmV4cG9ydCBjb25zdCBpbmRleFR5cGVzID0geyByZWZlcmVuY2U6ICdyZWZlcmVuY2UnLCBhbmNlc3RvcjogJ2FuY2VzdG9yJyB9O1xuXG5leHBvcnQgY29uc3QgaW5kZXhSdWxlU2V0ID0gW1xuICBtYWtlcnVsZSgnbWFwJywgJ2luZGV4IGhhcyBubyBtYXAgZnVuY3Rpb24nLFxuICAgIGluZGV4ID0+IGlzTm9uRW1wdHlTdHJpbmcoaW5kZXgubWFwKSksXG4gIG1ha2VydWxlKCdtYXAnLCBcImluZGV4J3MgbWFwIGZ1bmN0aW9uIGRvZXMgbm90IGNvbXBpbGVcIixcbiAgICBpbmRleCA9PiAhaXNOb25FbXB0eVN0cmluZyhpbmRleC5tYXApXG4gICAgICAgICAgICAgICAgfHwgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uKCgpID0+IGNvbXBpbGVNYXAoaW5kZXgpKSksXG4gIG1ha2VydWxlKCdmaWx0ZXInLCBcImluZGV4J3MgZmlsdGVyIGZ1bmN0aW9uIGRvZXMgbm90IGNvbXBpbGVcIixcbiAgICBpbmRleCA9PiAhaXNOb25FbXB0eVN0cmluZyhpbmRleC5maWx0ZXIpXG4gICAgICAgICAgICAgICAgfHwgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uKCgpID0+IGNvbXBpbGVGaWx0ZXIoaW5kZXgpKSksXG4gIG1ha2VydWxlKCduYW1lJywgJ211c3QgZGVjbGFyZSBhIG5hbWUgZm9yIGluZGV4JyxcbiAgICBpbmRleCA9PiBpc05vbkVtcHR5U3RyaW5nKGluZGV4Lm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAndGhlcmUgaXMgYSBkdXBsaWNhdGUgbmFtZWQgaW5kZXggb24gdGhpcyBub2RlJyxcbiAgICBpbmRleCA9PiBpc0VtcHR5KGluZGV4Lm5hbWUpXG4gICAgICAgICAgICAgICAgfHwgY291bnRCeSgnbmFtZScpKGluZGV4LnBhcmVudCgpLmluZGV4ZXMpW2luZGV4Lm5hbWVdID09PSAxKSxcbiAgbWFrZXJ1bGUoJ2luZGV4VHlwZScsICdyZWZlcmVuY2UgaW5kZXggbWF5IG9ubHkgZXhpc3Qgb24gYSByZWNvcmQgbm9kZScsXG4gICAgaW5kZXggPT4gaXNSZWNvcmQoaW5kZXgucGFyZW50KCkpXG4gICAgICAgICAgICAgICAgICB8fCBpbmRleC5pbmRleFR5cGUgIT09IGluZGV4VHlwZXMucmVmZXJlbmNlKSxcbiAgbWFrZXJ1bGUoJ2luZGV4VHlwZScsIGBpbmRleCB0eXBlIG11c3QgYmUgb25lIG9mOiAke2pvaW4oJywgJykoa2V5cyhpbmRleFR5cGVzKSl9YCxcbiAgICBpbmRleCA9PiBpbmNsdWRlcyhpbmRleC5pbmRleFR5cGUpKGtleXMoaW5kZXhUeXBlcykpKSxcbl07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUluZGV4ID0gKGluZGV4LCBhbGxSZWZlcmVuY2VJbmRleGVzT25Ob2RlKSA9PiBhcHBseVJ1bGVTZXQoaW5kZXhSdWxlU2V0KGFsbFJlZmVyZW5jZUluZGV4ZXNPbk5vZGUpKShpbmRleCk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFsbEluZGV4ZXMgPSBub2RlID0+ICQobm9kZS5pbmRleGVzLCBbXG4gIG1hcChpID0+IHZhbGlkYXRlSW5kZXgoaSwgbm9kZS5pbmRleGVzKSksXG4gIGZsYXR0ZW4sXG5dKTtcbiIsImltcG9ydCB7XG4gIGZpbmQsIGNvbnN0YW50LCBtYXAsIGxhc3QsXG4gIGZpcnN0LCBzcGxpdCwgaW50ZXJzZWN0aW9uLCB0YWtlLFxuICB1bmlvbiwgaW5jbHVkZXMsIGZpbHRlciwgc29tZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gICQsIHN3aXRjaENhc2UsIGlzTm90aGluZywgaXNTb21ldGhpbmcsXG4gIGRlZmF1bHRDYXNlLCBzcGxpdEtleSwgaXNOb25FbXB0eVN0cmluZyxcbiAgam9pbktleSwgZ2V0SGFzaENvZGUsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBpbmRleFR5cGVzIH0gZnJvbSAnLi9pbmRleGVzJztcblxuZXhwb3J0IGNvbnN0IGdldEZsYXR0ZW5lZEhpZXJhcmNoeSA9IChhcHBIaWVyYXJjaHksIHVzZUNhY2hlZCA9IHRydWUpID0+IHtcbiAgaWYgKGlzU29tZXRoaW5nKGFwcEhpZXJhcmNoeS5nZXRGbGF0dGVuZWRIaWVyYXJjaHkpICYmIHVzZUNhY2hlZCkgeyByZXR1cm4gYXBwSGllcmFyY2h5LmdldEZsYXR0ZW5lZEhpZXJhcmNoeSgpOyB9XG5cbiAgY29uc3QgZmxhdHRlbkhpZXJhcmNoeSA9IChjdXJyZW50Tm9kZSwgZmxhdHRlbmVkKSA9PiB7XG4gICAgZmxhdHRlbmVkLnB1c2goY3VycmVudE5vZGUpO1xuICAgIGlmICgoIWN1cnJlbnROb2RlLmNoaWxkcmVuXG4gICAgICAgICAgICB8fCBjdXJyZW50Tm9kZS5jaGlsZHJlbi5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAmJiAoIWN1cnJlbnROb2RlLmluZGV4ZXNcbiAgICAgICAgICAgIHx8IGN1cnJlbnROb2RlLmluZGV4ZXMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgJiYgKCFjdXJyZW50Tm9kZS5hZ2dyZWdhdGVHcm91cHNcbiAgICAgICAgICAgIHx8IGN1cnJlbnROb2RlLmFnZ3JlZ2F0ZUdyb3Vwcy5sZW5ndGggPT09IDApKSB7XG4gICAgICByZXR1cm4gZmxhdHRlbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IHVuaW9uSWZBbnkgPSBsMiA9PiBsMSA9PiB1bmlvbihsMSkoIWwyID8gW10gOiBsMik7XG5cbiAgICBjb25zdCBjaGlsZHJlbiA9ICQoW10sIFtcbiAgICAgIHVuaW9uSWZBbnkoY3VycmVudE5vZGUuY2hpbGRyZW4pLFxuICAgICAgdW5pb25JZkFueShjdXJyZW50Tm9kZS5pbmRleGVzKSxcbiAgICAgIHVuaW9uSWZBbnkoY3VycmVudE5vZGUuYWdncmVnYXRlR3JvdXBzKSxcbiAgICBdKTtcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGZsYXR0ZW5IaWVyYXJjaHkoY2hpbGQsIGZsYXR0ZW5lZCk7XG4gICAgfVxuICAgIHJldHVybiBmbGF0dGVuZWQ7XG4gIH07XG5cbiAgYXBwSGllcmFyY2h5LmdldEZsYXR0ZW5lZEhpZXJhcmNoeSA9ICgpID0+IGZsYXR0ZW5IaWVyYXJjaHkoYXBwSGllcmFyY2h5LCBbXSk7XG4gIHJldHVybiBhcHBIaWVyYXJjaHkuZ2V0RmxhdHRlbmVkSGllcmFyY2h5KCk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TGFzdFBhcnRJbktleSA9IGtleSA9PiBsYXN0KHNwbGl0S2V5KGtleSkpO1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZXNJblBhdGggPSBhcHBIaWVyYXJjaHkgPT4ga2V5ID0+ICQoYXBwSGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmlsdGVyKG4gPT4gbmV3IFJlZ0V4cChgJHtuLnBhdGhSZWd4KCl9YCkudGVzdChrZXkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0RXhhY3ROb2RlRm9yS2V5ID0gYXBwSGllcmFyY2h5ID0+IGtleSA9PiAkKGFwcEhpZXJhcmNoeSwgW1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGZpbmQobiA9PiBuZXcgUmVnRXhwKGAke24ucGF0aFJlZ3goKX0kYCkudGVzdChrZXkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoID0gYXBwSGllcmFyY2h5ID0+IGNvbGxlY3Rpb25LZXkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gKGlzQ29sbGVjdGlvblJlY29yZChuKVxuICAgICAgICAgICAgICAgICAgICYmIG5ldyBSZWdFeHAoYCR7bi5jb2xsZWN0aW9uUGF0aFJlZ3goKX0kYCkudGVzdChjb2xsZWN0aW9uS2V5KSkpLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBoYXNNYXRjaGluZ0FuY2VzdG9yID0gYW5jZXN0b3JQcmVkaWNhdGUgPT4gZGVjZW5kYW50Tm9kZSA9PiBzd2l0Y2hDYXNlKFxuXG4gIFtub2RlID0+IGlzTm90aGluZyhub2RlLnBhcmVudCgpKSxcbiAgICBjb25zdGFudChmYWxzZSldLFxuXG4gIFtub2RlID0+IGFuY2VzdG9yUHJlZGljYXRlKG5vZGUucGFyZW50KCkpLFxuICAgIGNvbnN0YW50KHRydWUpXSxcblxuICBbZGVmYXVsdENhc2UsXG4gICAgbm9kZSA9PiBoYXNNYXRjaGluZ0FuY2VzdG9yKGFuY2VzdG9yUHJlZGljYXRlKShub2RlLnBhcmVudCgpKV0sXG5cbikoZGVjZW5kYW50Tm9kZSk7XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlID0gKGFwcEhpZXJhcmNoeSwgbm9kZUtleSkgPT4gJChhcHBIaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaW5kKG4gPT4gbi5ub2RlS2V5KCkgPT09IG5vZGVLZXlcbiAgICAgICAgICAgICAgICAgIHx8IChpc0NvbGxlY3Rpb25SZWNvcmQobilcbiAgICAgICAgICAgICAgICAgICAgICAmJiBuLmNvbGxlY3Rpb25Ob2RlS2V5KCkgPT09IG5vZGVLZXkpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2V0Q29sbGVjdGlvbk5vZGUgPSAoYXBwSGllcmFyY2h5LCBub2RlS2V5KSA9PiAkKGFwcEhpZXJhcmNoeSwgW1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGZpbmQobiA9PiAoaXNDb2xsZWN0aW9uUmVjb3JkKG4pXG4gICAgICAgICAgICAgICAgICAgICYmIG4uY29sbGVjdGlvbk5vZGVLZXkoKSA9PT0gbm9kZUtleSkpLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlQnlLZXlPck5vZGVLZXkgPSAoYXBwSGllcmFyY2h5LCBrZXlPck5vZGVLZXkpID0+IHtcbiAgY29uc3Qgbm9kZUJ5S2V5ID0gZ2V0RXhhY3ROb2RlRm9yS2V5KGFwcEhpZXJhcmNoeSkoa2V5T3JOb2RlS2V5KTtcbiAgcmV0dXJuIGlzTm90aGluZyhub2RlQnlLZXkpXG4gICAgPyBnZXROb2RlKGFwcEhpZXJhcmNoeSwga2V5T3JOb2RlS2V5KVxuICAgIDogbm9kZUJ5S2V5O1xufTtcblxuZXhwb3J0IGNvbnN0IGdldENvbGxlY3Rpb25Ob2RlQnlLZXlPck5vZGVLZXkgPSAoYXBwSGllcmFyY2h5LCBrZXlPck5vZGVLZXkpID0+IHtcbiAgY29uc3Qgbm9kZUJ5S2V5ID0gZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoKGFwcEhpZXJhcmNoeSkoa2V5T3JOb2RlS2V5KTtcbiAgcmV0dXJuIGlzTm90aGluZyhub2RlQnlLZXkpXG4gICAgPyBnZXRDb2xsZWN0aW9uTm9kZShhcHBIaWVyYXJjaHksIGtleU9yTm9kZUtleSlcbiAgICA6IG5vZGVCeUtleTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc05vZGUgPSAoYXBwSGllcmFyY2h5LCBrZXkpID0+IGlzU29tZXRoaW5nKGdldEV4YWN0Tm9kZUZvcktleShhcHBIaWVyYXJjaHkpKGtleSkpO1xuXG5leHBvcnQgY29uc3QgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQgPSAocGFyZW50Tm9kZUtleSwgYWN0dWFsQ2hpbGRLZXkpID0+IFxuICAkKGFjdHVhbENoaWxkS2V5LCBbXG4gICAgc3BsaXRLZXksXG4gICAgdGFrZShzcGxpdEtleShwYXJlbnROb2RlS2V5KS5sZW5ndGgpLFxuICAgIGtzID0+IGpvaW5LZXkoLi4ua3MpLFxuICBdKTtcblxuZXhwb3J0IGNvbnN0IGdldFBhcmVudEtleSA9IChrZXkpID0+IHtcbiAgcmV0dXJuICQoa2V5LCBbXG4gICAgc3BsaXRLZXksXG4gICAgdGFrZShzcGxpdEtleShrZXkpLmxlbmd0aCAtIDEpLFxuICAgIGpvaW5LZXksXG4gIF0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzS2V5QW5jZXN0b3JPZiA9IGFuY2VzdG9yS2V5ID0+IGRlY2VuZGFudE5vZGUgPT4gaGFzTWF0Y2hpbmdBbmNlc3RvcihwID0+IHAubm9kZUtleSgpID09PSBhbmNlc3RvcktleSkoZGVjZW5kYW50Tm9kZSk7XG5cbmV4cG9ydCBjb25zdCBoYXNOb01hdGNoaW5nQW5jZXN0b3JzID0gcGFyZW50UHJlZGljYXRlID0+IG5vZGUgPT4gIWhhc01hdGNoaW5nQW5jZXN0b3IocGFyZW50UHJlZGljYXRlKShub2RlKTtcblxuZXhwb3J0IGNvbnN0IGZpbmRGaWVsZCA9IChyZWNvcmROb2RlLCBmaWVsZE5hbWUpID0+IGZpbmQoZiA9PiBmLm5hbWUgPT0gZmllbGROYW1lKShyZWNvcmROb2RlLmZpZWxkcyk7XG5cbmV4cG9ydCBjb25zdCBpc0FuY2VzdG9yID0gZGVjZW5kYW50ID0+IGFuY2VzdG9yID0+IGlzS2V5QW5jZXN0b3JPZihhbmNlc3Rvci5ub2RlS2V5KCkpKGRlY2VuZGFudCk7XG5cbmV4cG9ydCBjb25zdCBpc0RlY2VuZGFudCA9IGFuY2VzdG9yID0+IGRlY2VuZGFudCA9PiBpc0FuY2VzdG9yKGRlY2VuZGFudCkoYW5jZXN0b3IpO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkTm9kZUlkID0gcmVjb3JkS2V5ID0+ICQocmVjb3JkS2V5LCBbXG4gIHNwbGl0S2V5LFxuICBsYXN0LFxuICBnZXRSZWNvcmROb2RlSWRGcm9tSWQsXG5dKTtcblxuZXhwb3J0IGNvbnN0IGdldFJlY29yZE5vZGVJZEZyb21JZCA9IHJlY29yZElkID0+ICQocmVjb3JkSWQsIFtzcGxpdCgnLScpLCBmaXJzdCwgcGFyc2VJbnRdKTtcblxuZXhwb3J0IGNvbnN0IGdldFJlY29yZE5vZGVCeUlkID0gKGhpZXJhcmNoeSwgcmVjb3JkSWQpID0+ICQoaGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmluZChuID0+IGlzUmVjb3JkKG4pXG4gICAgICAgICAgICAgICAgICAgICYmIG4ubm9kZUlkID09PSBnZXRSZWNvcmROb2RlSWRGcm9tSWQocmVjb3JkSWQpKSxcbl0pO1xuXG5leHBvcnQgY29uc3QgcmVjb3JkTm9kZUlkSXNBbGxvd2VkID0gaW5kZXhOb2RlID0+IG5vZGVJZCA9PiBpbmRleE5vZGUuYWxsb3dlZFJlY29yZE5vZGVJZHMubGVuZ3RoID09PSAwXG4gICAgfHwgaW5jbHVkZXMobm9kZUlkKShpbmRleE5vZGUuYWxsb3dlZFJlY29yZE5vZGVJZHMpO1xuXG5leHBvcnQgY29uc3QgcmVjb3JkTm9kZUlzQWxsb3dlZCA9IGluZGV4Tm9kZSA9PiByZWNvcmROb2RlID0+IHJlY29yZE5vZGVJZElzQWxsb3dlZChpbmRleE5vZGUpKHJlY29yZE5vZGUubm9kZUlkKTtcblxuZXhwb3J0IGNvbnN0IGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4ID0gKGFwcEhpZXJhcmNoeSwgaW5kZXhOb2RlKSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGVzID0gJChhcHBIaWVyYXJjaHksIFtcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gICAgZmlsdGVyKGlzUmVjb3JkKSxcbiAgXSk7XG5cbiAgaWYgKGlzR2xvYmFsSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIHJldHVybiAkKHJlY29yZE5vZGVzLCBbXG4gICAgICBmaWx0ZXIocmVjb3JkTm9kZUlzQWxsb3dlZChpbmRleE5vZGUpKSxcbiAgICBdKTtcbiAgfVxuXG4gIGlmIChpc0FuY2VzdG9ySW5kZXgoaW5kZXhOb2RlKSkge1xuICAgIHJldHVybiAkKHJlY29yZE5vZGVzLCBbXG4gICAgICBmaWx0ZXIoaXNEZWNlbmRhbnQoaW5kZXhOb2RlLnBhcmVudCgpKSksXG4gICAgICBmaWx0ZXIocmVjb3JkTm9kZUlzQWxsb3dlZChpbmRleE5vZGUpKSxcbiAgICBdKTtcbiAgfVxuXG4gIGlmIChpc1JlZmVyZW5jZUluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICByZXR1cm4gJChyZWNvcmROb2RlcywgW1xuICAgICAgZmlsdGVyKG4gPT4gc29tZShmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleChpbmRleE5vZGUpKShuLmZpZWxkcykpLFxuICAgIF0pO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZUZyb21Ob2RlS2V5SGFzaCA9IGhpZXJhcmNoeSA9PiBoYXNoID0+ICQoaGllcmFyY2h5LCBbXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgZmluZChuID0+IGdldEhhc2hDb2RlKG4ubm9kZUtleSgpKSA9PT0gaGFzaCksXG5dKTtcblxuZXhwb3J0IGNvbnN0IGlzUmVjb3JkID0gbm9kZSA9PiBpc1NvbWV0aGluZyhub2RlKSAmJiBub2RlLnR5cGUgPT09ICdyZWNvcmQnO1xuZXhwb3J0IGNvbnN0IGlzU2luZ2xlUmVjb3JkID0gbm9kZSA9PiBpc1JlY29yZChub2RlKSAmJiBub2RlLmlzU2luZ2xlO1xuZXhwb3J0IGNvbnN0IGlzQ29sbGVjdGlvblJlY29yZCA9IG5vZGUgPT4gaXNSZWNvcmQobm9kZSkgJiYgIW5vZGUuaXNTaW5nbGU7XG5leHBvcnQgY29uc3QgaXNJbmRleCA9IG5vZGUgPT4gaXNTb21ldGhpbmcobm9kZSkgJiYgbm9kZS50eXBlID09PSAnaW5kZXgnO1xuZXhwb3J0IGNvbnN0IGlzYWdncmVnYXRlR3JvdXAgPSBub2RlID0+IGlzU29tZXRoaW5nKG5vZGUpICYmIG5vZGUudHlwZSA9PT0gJ2FnZ3JlZ2F0ZUdyb3VwJztcbmV4cG9ydCBjb25zdCBpc1NoYXJkZWRJbmRleCA9IG5vZGUgPT4gaXNJbmRleChub2RlKSAmJiBpc05vbkVtcHR5U3RyaW5nKG5vZGUuZ2V0U2hhcmROYW1lKTtcbmV4cG9ydCBjb25zdCBpc1Jvb3QgPSBub2RlID0+IGlzU29tZXRoaW5nKG5vZGUpICYmIG5vZGUuaXNSb290KCk7XG5leHBvcnQgY29uc3QgaXNEZWNlbmRhbnRPZkFSZWNvcmQgPSBoYXNNYXRjaGluZ0FuY2VzdG9yKGlzUmVjb3JkKTtcbmV4cG9ydCBjb25zdCBpc0dsb2JhbEluZGV4ID0gbm9kZSA9PiBpc0luZGV4KG5vZGUpICYmIGlzUm9vdChub2RlLnBhcmVudCgpKTtcbmV4cG9ydCBjb25zdCBpc1JlZmVyZW5jZUluZGV4ID0gbm9kZSA9PiBpc0luZGV4KG5vZGUpICYmIG5vZGUuaW5kZXhUeXBlID09PSBpbmRleFR5cGVzLnJlZmVyZW5jZTtcbmV4cG9ydCBjb25zdCBpc0FuY2VzdG9ySW5kZXggPSBub2RlID0+IGlzSW5kZXgobm9kZSkgJiYgbm9kZS5pbmRleFR5cGUgPT09IGluZGV4VHlwZXMuYW5jZXN0b3I7XG5cbmV4cG9ydCBjb25zdCBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9Ob2RlID0gbm9kZSA9PiBmaWVsZCA9PiBmaWVsZC50eXBlID09PSAncmVmZXJlbmNlJ1xuICAgICYmIGludGVyc2VjdGlvbihmaWVsZC50eXBlT3B0aW9ucy5yZXZlcnNlSW5kZXhOb2RlS2V5cykobWFwKGkgPT4gaS5ub2RlS2V5KCkpKG5vZGUuaW5kZXhlcykpXG4gICAgICAubGVuZ3RoID4gMDtcblxuZXhwb3J0IGNvbnN0IGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4ID0gaW5kZXhOb2RlID0+IGZpZWxkID0+IGZpZWxkLnR5cGUgPT09ICdyZWZlcmVuY2UnXG4gICAgJiYgaW50ZXJzZWN0aW9uKGZpZWxkLnR5cGVPcHRpb25zLnJldmVyc2VJbmRleE5vZGVLZXlzKShbaW5kZXhOb2RlLm5vZGVLZXkoKV0pXG4gICAgICAubGVuZ3RoID4gMDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXRMYXN0UGFydEluS2V5LFxuICBnZXROb2Rlc0luUGF0aCxcbiAgZ2V0RXhhY3ROb2RlRm9yS2V5LFxuICBoYXNNYXRjaGluZ0FuY2VzdG9yLFxuICBnZXROb2RlLFxuICBnZXROb2RlQnlLZXlPck5vZGVLZXksXG4gIGlzTm9kZSxcbiAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQsXG4gIGdldFBhcmVudEtleSxcbiAgaXNLZXlBbmNlc3Rvck9mLFxuICBoYXNOb01hdGNoaW5nQW5jZXN0b3JzLFxuICBmaW5kRmllbGQsXG4gIGlzQW5jZXN0b3IsXG4gIGlzRGVjZW5kYW50LFxuICBnZXRSZWNvcmROb2RlSWQsXG4gIGdldFJlY29yZE5vZGVJZEZyb21JZCxcbiAgZ2V0UmVjb3JkTm9kZUJ5SWQsXG4gIHJlY29yZE5vZGVJZElzQWxsb3dlZCxcbiAgcmVjb3JkTm9kZUlzQWxsb3dlZCxcbiAgZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgsXG4gIGdldE5vZGVGcm9tTm9kZUtleUhhc2gsXG4gIGlzUmVjb3JkLFxuICBpc0NvbGxlY3Rpb25SZWNvcmQsXG4gIGlzSW5kZXgsXG4gIGlzYWdncmVnYXRlR3JvdXAsXG4gIGlzU2hhcmRlZEluZGV4LFxuICBpc1Jvb3QsXG4gIGlzRGVjZW5kYW50T2ZBUmVjb3JkLFxuICBpc0dsb2JhbEluZGV4LFxuICBpc1JlZmVyZW5jZUluZGV4LFxuICBpc0FuY2VzdG9ySW5kZXgsXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUsXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb0luZGV4LFxuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG59O1xuIiwiaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgY29uc3RhbnQsIGlzVW5kZWZpbmVkLCBoYXMsXG4gIG1hcFZhbHVlcywgY2xvbmVEZWVwLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgaXNOb3RFbXB0eSB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBnZXRTYWZlRmllbGRQYXJzZXIgPSAodHJ5UGFyc2UsIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucykgPT4gKGZpZWxkLCByZWNvcmQpID0+IHtcbiAgaWYgKGhhcyhmaWVsZC5uYW1lKShyZWNvcmQpKSB7XG4gICAgcmV0dXJuIGdldFNhZmVWYWx1ZVBhcnNlcih0cnlQYXJzZSwgZGVmYXVsdFZhbHVlRnVuY3Rpb25zKShyZWNvcmRbZmllbGQubmFtZV0pO1xuICB9XG4gIHJldHVybiBkZWZhdWx0VmFsdWVGdW5jdGlvbnNbZmllbGQuZ2V0VW5kZWZpbmVkVmFsdWVdKCk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U2FmZVZhbHVlUGFyc2VyID0gKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpID0+ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBwYXJzZWQgPSB0cnlQYXJzZSh2YWx1ZSk7XG4gIGlmIChwYXJzZWQuc3VjY2Vzcykge1xuICAgIHJldHVybiBwYXJzZWQudmFsdWU7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucy5kZWZhdWx0KCk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3VmFsdWUgPSAodHJ5UGFyc2UsIGRlZmF1bHRWYWx1ZUZ1bmN0aW9ucykgPT4gKGZpZWxkKSA9PiB7XG4gIGNvbnN0IGdldEluaXRpYWxWYWx1ZSA9IGlzVW5kZWZpbmVkKGZpZWxkKSB8fCBpc1VuZGVmaW5lZChmaWVsZC5nZXRJbml0aWFsVmFsdWUpXG4gICAgPyAnZGVmYXVsdCdcbiAgICA6IGZpZWxkLmdldEluaXRpYWxWYWx1ZTtcblxuICByZXR1cm4gaGFzKGdldEluaXRpYWxWYWx1ZSkoZGVmYXVsdFZhbHVlRnVuY3Rpb25zKVxuICAgID8gZGVmYXVsdFZhbHVlRnVuY3Rpb25zW2dldEluaXRpYWxWYWx1ZV0oKVxuICAgIDogZ2V0U2FmZVZhbHVlUGFyc2VyKHRyeVBhcnNlLCBkZWZhdWx0VmFsdWVGdW5jdGlvbnMpKGdldEluaXRpYWxWYWx1ZSk7XG59O1xuXG5leHBvcnQgY29uc3QgdHlwZUZ1bmN0aW9ucyA9IHNwZWNpZmljRnVuY3Rpb25zID0+IG1lcmdlKHtcbiAgdmFsdWU6IGNvbnN0YW50LFxuICBudWxsOiBjb25zdGFudChudWxsKSxcbn0sIHNwZWNpZmljRnVuY3Rpb25zKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzID0gdmFsaWRhdGlvblJ1bGVzID0+IGFzeW5jIChmaWVsZCwgcmVjb3JkLCBjb250ZXh0KSA9PiB7XG4gIGNvbnN0IGZpZWxkVmFsdWUgPSByZWNvcmRbZmllbGQubmFtZV07XG4gIGNvbnN0IHZhbGlkYXRlUnVsZSA9IGFzeW5jIHIgPT4gKCFhd2FpdCByLmlzVmFsaWQoZmllbGRWYWx1ZSwgZmllbGQudHlwZU9wdGlvbnMsIGNvbnRleHQpXG4gICAgPyByLmdldE1lc3NhZ2UoZmllbGRWYWx1ZSwgZmllbGQudHlwZU9wdGlvbnMpXG4gICAgOiAnJyk7XG5cbiAgY29uc3QgZXJyb3JzID0gW107XG4gIGZvciAoY29uc3QgciBvZiB2YWxpZGF0aW9uUnVsZXMpIHtcbiAgICBjb25zdCBlcnIgPSBhd2FpdCB2YWxpZGF0ZVJ1bGUocik7XG4gICAgaWYgKGlzTm90RW1wdHkoZXJyKSkgZXJyb3JzLnB1c2goZXJyKTtcbiAgfVxuXG4gIHJldHVybiBlcnJvcnM7XG59O1xuXG5jb25zdCBnZXREZWZhdWx0T3B0aW9ucyA9IG1hcFZhbHVlcyh2ID0+IHYuZGVmYXVsdFZhbHVlKTtcblxuZXhwb3J0IGNvbnN0IG1ha2VydWxlID0gKGlzVmFsaWQsIGdldE1lc3NhZ2UpID0+ICh7IGlzVmFsaWQsIGdldE1lc3NhZ2UgfSk7XG5leHBvcnQgY29uc3QgcGFyc2VkRmFpbGVkID0gdmFsID0+ICh7IHN1Y2Nlc3M6IGZhbHNlLCB2YWx1ZTogdmFsIH0pO1xuZXhwb3J0IGNvbnN0IHBhcnNlZFN1Y2Nlc3MgPSB2YWwgPT4gKHsgc3VjY2VzczogdHJ1ZSwgdmFsdWU6IHZhbCB9KTtcbmV4cG9ydCBjb25zdCBnZXREZWZhdWx0RXhwb3J0ID0gKG5hbWUsIHRyeVBhcnNlLCBmdW5jdGlvbnMsIG9wdGlvbnMsIHZhbGlkYXRpb25SdWxlcywgc2FtcGxlVmFsdWUsIHN0cmluZ2lmeSkgPT4gKHtcbiAgZ2V0TmV3OiBnZXROZXdWYWx1ZSh0cnlQYXJzZSwgZnVuY3Rpb25zKSxcbiAgc2FmZVBhcnNlRmllbGQ6IGdldFNhZmVGaWVsZFBhcnNlcih0cnlQYXJzZSwgZnVuY3Rpb25zKSxcbiAgc2FmZVBhcnNlVmFsdWU6IGdldFNhZmVWYWx1ZVBhcnNlcih0cnlQYXJzZSwgZnVuY3Rpb25zKSxcbiAgdHJ5UGFyc2UsXG4gIG5hbWUsXG4gIGdldERlZmF1bHRPcHRpb25zOiAoKSA9PiBnZXREZWZhdWx0T3B0aW9ucyhjbG9uZURlZXAob3B0aW9ucykpLFxuICBvcHRpb25EZWZpbml0aW9uczogb3B0aW9ucyxcbiAgdmFsaWRhdGVUeXBlQ29uc3RyYWludHM6IHZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzKHZhbGlkYXRpb25SdWxlcyksXG4gIHNhbXBsZVZhbHVlLFxuICBzdHJpbmdpZnk6IHZhbCA9PiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkXG4gICAgPyAnJyA6IHN0cmluZ2lmeSh2YWwpKSxcbiAgZ2V0RGVmYXVsdFZhbHVlOiBmdW5jdGlvbnMuZGVmYXVsdCxcbn0pO1xuIiwiaW1wb3J0IHtcbiAgY29uc3RhbnQsIGlzU3RyaW5nLFxuICBpc051bGwsIGluY2x1ZGVzLCBpc0Jvb2xlYW4sXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICB0eXBlRnVuY3Rpb25zLFxuICBtYWtlcnVsZSwgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9Cb29sT3JOdWxsLCB0b051bWJlck9yTnVsbCxcbiAgaXNTYWZlSW50ZWdlciwgaXNBcnJheU9mU3RyaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBzdHJpbmdGdW5jdGlvbnMgPSB0eXBlRnVuY3Rpb25zKHtcbiAgZGVmYXVsdDogY29uc3RhbnQobnVsbCksXG59KTtcblxuY29uc3Qgc3RyaW5nVHJ5UGFyc2UgPSBzd2l0Y2hDYXNlKFxuICBbaXNTdHJpbmcsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNOdWxsLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2RlZmF1bHRDYXNlLCB2ID0+IHBhcnNlZFN1Y2Nlc3Modi50b1N0cmluZygpKV0sXG4pO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBtYXhMZW5ndGg6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgaXNWYWxpZDogbiA9PiBuID09PSBudWxsIHx8IGlzU2FmZUludGVnZXIobikgJiYgbiA+IDAsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ21heCBsZW5ndGggbXVzdCBiZSBudWxsIChubyBsaW1pdCkgb3IgYSBncmVhdGVyIHRoYW4gemVybyBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG4gIHZhbHVlczoge1xuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICBpc1ZhbGlkOiB2ID0+IHYgPT09IG51bGwgfHwgKGlzQXJyYXlPZlN0cmluZyh2KSAmJiB2Lmxlbmd0aCA+IDAgJiYgdi5sZW5ndGggPCAxMDAwMCksXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogXCIndmFsdWVzJyBtdXN0IGJlIG51bGwgKG5vIHZhbHVlcykgb3IgYW4gYXJyeSBvZiBhdCBsZWFzdCBvbmUgc3RyaW5nXCIsXG4gICAgcGFyc2U6IHMgPT4gcyxcbiAgfSxcbiAgYWxsb3dEZWNsYXJlZFZhbHVlc09ubHk6IHtcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIGlzVmFsaWQ6IGlzQm9vbGVhbixcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnYWxsb3dEZWNsYXJlZFZhbHVlc09ubHkgbXVzdCBiZSB0cnVlIG9yIGZhbHNlJyxcbiAgICBwYXJzZTogdG9Cb29sT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5tYXhMZW5ndGggPT09IG51bGwgfHwgdmFsLmxlbmd0aCA8PSBvcHRzLm1heExlbmd0aCxcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgZXhjZWVkcyBtYXhpbXVtIGxlbmd0aCBvZiAke29wdHMubWF4TGVuZ3RofWApLFxuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IG9wdHMuYWxsb3dEZWNsYXJlZFZhbHVlc09ubHkgPT09IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBpbmNsdWRlcyh2YWwpKG9wdHMudmFsdWVzKSxcbiAgKHZhbCkgPT4gYFwiJHt2YWx9XCIgZG9lcyBub3QgZXhpc3QgaW4gdGhlIGxpc3Qgb2YgYWxsb3dlZCB2YWx1ZXNgKSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXG4gICdzdHJpbmcnLFxuICBzdHJpbmdUcnlQYXJzZSxcbiAgc3RyaW5nRnVuY3Rpb25zLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gICdhYmNkZScsXG4gIHN0ciA9PiBzdHIsXG4pO1xuIiwiaW1wb3J0IHsgY29uc3RhbnQsIGlzQm9vbGVhbiwgaXNOdWxsIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIHR5cGVGdW5jdGlvbnMsXG4gIG1ha2VydWxlLCBwYXJzZWRGYWlsZWQsIHBhcnNlZFN1Y2Nlc3MsXG4gIGdldERlZmF1bHRFeHBvcnQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIGlzT25lT2YsIHRvQm9vbE9yTnVsbCxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgYm9vbEZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBjb25zdGFudChudWxsKSxcbn0pO1xuXG5jb25zdCBib29sVHJ5UGFyc2UgPSBzd2l0Y2hDYXNlKFxuICBbaXNCb29sZWFuLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXG4gIFtpc09uZU9mKCd0cnVlJywgJzEnLCAneWVzJywgJ29uJyksICgpID0+IHBhcnNlZFN1Y2Nlc3ModHJ1ZSldLFxuICBbaXNPbmVPZignZmFsc2UnLCAnMCcsICdubycsICdvZmYnKSwgKCkgPT4gcGFyc2VkU3VjY2VzcyhmYWxzZSldLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBhbGxvd051bGxzOiB7XG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIGlzVmFsaWQ6IGlzQm9vbGVhbixcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHRydWUgb3IgZmFsc2UnLFxuICAgIHBhcnNlOiB0b0Jvb2xPck51bGwsXG4gIH0sXG59O1xuXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IG9wdHMuYWxsb3dOdWxscyA9PT0gdHJ1ZSB8fCB2YWwgIT09IG51bGwsXG4gICAgKCkgPT4gJ2ZpZWxkIGNhbm5vdCBiZSBudWxsJyksXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxuICAnYm9vbCcsIGJvb2xUcnlQYXJzZSwgYm9vbEZ1bmN0aW9ucyxcbiAgb3B0aW9ucywgdHlwZUNvbnN0cmFpbnRzLCB0cnVlLCBKU09OLnN0cmluZ2lmeSxcbik7XG4iLCJpbXBvcnQge1xuICBjb25zdGFudCwgaXNOdW1iZXIsIGlzU3RyaW5nLCBpc051bGwsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBtYWtlcnVsZSwgdHlwZUZ1bmN0aW9ucyxcbiAgcGFyc2VkRmFpbGVkLCBwYXJzZWRTdWNjZXNzLCBnZXREZWZhdWx0RXhwb3J0LFxufSBmcm9tICcuL3R5cGVIZWxwZXJzJztcbmltcG9ydCB7XG4gIHN3aXRjaENhc2UsIGRlZmF1bHRDYXNlLCB0b051bWJlck9yTnVsbCxcbiAgaXNTYWZlSW50ZWdlcixcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgbnVtYmVyRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XG4gIGRlZmF1bHQ6IGNvbnN0YW50KG51bGwpLFxufSk7XG5cbmNvbnN0IHBhcnNlU3RyaW5ndG9OdW1iZXJPck51bGwgPSAocykgPT4ge1xuICBjb25zdCBudW0gPSBOdW1iZXIocyk7XG4gIHJldHVybiBpc05hTihudW0pID8gcGFyc2VkRmFpbGVkKHMpIDogcGFyc2VkU3VjY2VzcyhudW0pO1xufTtcblxuY29uc3QgbnVtYmVyVHJ5UGFyc2UgPSBzd2l0Y2hDYXNlKFxuICBbaXNOdW1iZXIsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNTdHJpbmcsIHBhcnNlU3RyaW5ndG9OdW1iZXJPck51bGxdLFxuICBbaXNOdWxsLCBwYXJzZWRTdWNjZXNzXSxcbiAgW2RlZmF1bHRDYXNlLCBwYXJzZWRGYWlsZWRdLFxuKTtcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgbWF4VmFsdWU6IHtcbiAgICBkZWZhdWx0VmFsdWU6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICAgIGlzVmFsaWQ6IGlzU2FmZUludGVnZXIsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB2YWxpZCBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG4gIG1pblZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiAwIC0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIsXG4gICAgaXNWYWxpZDogaXNTYWZlSW50ZWdlcixcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHZhbGlkIGludGVnZXInLFxuICAgIHBhcnNlOiB0b051bWJlck9yTnVsbCxcbiAgfSxcbiAgZGVjaW1hbFBsYWNlczoge1xuICAgIGRlZmF1bHRWYWx1ZTogMCxcbiAgICBpc1ZhbGlkOiBuID0+IGlzU2FmZUludGVnZXIobikgJiYgbiA+PSAwLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlcicsXG4gICAgcGFyc2U6IHRvTnVtYmVyT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgZ2V0RGVjaW1hbFBsYWNlcyA9ICh2YWwpID0+IHtcbiAgY29uc3Qgc3BsaXREZWNpbWFsID0gdmFsLnRvU3RyaW5nKCkuc3BsaXQoJy4nKTtcbiAgaWYgKHNwbGl0RGVjaW1hbC5sZW5ndGggPT09IDEpIHJldHVybiAwO1xuICByZXR1cm4gc3BsaXREZWNpbWFsWzFdLmxlbmd0aDtcbn07XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMubWluVmFsdWUgPT09IG51bGwgfHwgdmFsID49IG9wdHMubWluVmFsdWUsXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlICgke3ZhbC50b1N0cmluZygpfSkgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtvcHRzLm1pblZhbHVlfWApLFxuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5tYXhWYWx1ZSA9PT0gbnVsbCB8fCB2YWwgPD0gb3B0cy5tYXhWYWx1ZSxcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgKCR7dmFsLnRvU3RyaW5nKCl9KSBtdXN0IGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke29wdHMubWluVmFsdWV9IG9wdGlvbnNgKSxcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IG9wdHMuZGVjaW1hbFBsYWNlcyA+PSBnZXREZWNpbWFsUGxhY2VzKHZhbCksXG4gICAgKHZhbCwgb3B0cykgPT4gYHZhbHVlICgke3ZhbC50b1N0cmluZygpfSkgbXVzdCBoYXZlICR7b3B0cy5kZWNpbWFsUGxhY2VzfSBkZWNpbWFsIHBsYWNlcyBvciBsZXNzYCksXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBnZXREZWZhdWx0RXhwb3J0KFxuICAnbnVtYmVyJyxcbiAgbnVtYmVyVHJ5UGFyc2UsXG4gIG51bWJlckZ1bmN0aW9ucyxcbiAgb3B0aW9ucyxcbiAgdHlwZUNvbnN0cmFpbnRzLFxuICAxLFxuICBudW0gPT4gbnVtLnRvU3RyaW5nKCksXG4pO1xuIiwiaW1wb3J0IHtcbiAgY29uc3RhbnQsIGlzRGF0ZSwgaXNTdHJpbmcsIGlzTnVsbFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgbWFrZXJ1bGUsIHR5cGVGdW5jdGlvbnMsXG4gIHBhcnNlZEZhaWxlZCwgcGFyc2VkU3VjY2VzcywgZ2V0RGVmYXVsdEV4cG9ydCxcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9EYXRlT3JOdWxsLFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBkYXRlRnVuY3Rpb25zID0gdHlwZUZ1bmN0aW9ucyh7XG4gIGRlZmF1bHQ6IGNvbnN0YW50KG51bGwpLFxuICBub3c6ICgpID0+IG5ldyBEYXRlKCksXG59KTtcblxuY29uc3QgaXNWYWxpZERhdGUgPSBkID0+IGQgaW5zdGFuY2VvZiBEYXRlICYmICFpc05hTihkKTtcblxuY29uc3QgcGFyc2VTdHJpbmdUb0RhdGUgPSBzID0+IHN3aXRjaENhc2UoXG4gIFtpc1ZhbGlkRGF0ZSwgcGFyc2VkU3VjY2Vzc10sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbikobmV3IERhdGUocykpO1xuXG5cbmNvbnN0IGRhdGVUcnlQYXJzZSA9IHN3aXRjaENhc2UoXG4gIFtpc0RhdGUsIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNTdHJpbmcsIHBhcnNlU3RyaW5nVG9EYXRlXSxcbiAgW2lzTnVsbCwgcGFyc2VkU3VjY2Vzc10sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbik7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIG1heFZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiBuZXcgRGF0ZSgzMjUwMzY4MDAwMDAwMCksXG4gICAgaXNWYWxpZDogaXNEYXRlLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgdmFsaWQgZGF0ZScsXG4gICAgcGFyc2U6IHRvRGF0ZU9yTnVsbCxcbiAgfSxcbiAgbWluVmFsdWU6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG5ldyBEYXRlKC04NTIwMzM2MDAwMDAwKSxcbiAgICBpc1ZhbGlkOiBpc0RhdGUsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSB2YWxpZCBkYXRlJyxcbiAgICBwYXJzZTogdG9EYXRlT3JOdWxsLFxuICB9LFxufTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW1xuICBtYWtlcnVsZShhc3luYyAodmFsLCBvcHRzKSA9PiB2YWwgPT09IG51bGwgfHwgb3B0cy5taW5WYWx1ZSA9PT0gbnVsbCB8fCB2YWwgPj0gb3B0cy5taW5WYWx1ZSxcbiAgICAodmFsLCBvcHRzKSA9PiBgdmFsdWUgKCR7dmFsLnRvU3RyaW5nKCl9KSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAke29wdHMubWluVmFsdWV9YCksXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCBvcHRzLm1heFZhbHVlID09PSBudWxsIHx8IHZhbCA8PSBvcHRzLm1heFZhbHVlLFxuICAgICh2YWwsIG9wdHMpID0+IGB2YWx1ZSAoJHt2YWwudG9TdHJpbmcoKX0pIG11c3QgYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvICR7b3B0cy5taW5WYWx1ZX0gb3B0aW9uc2ApLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcbiAgJ2RhdGV0aW1lJyxcbiAgZGF0ZVRyeVBhcnNlLFxuICBkYXRlRnVuY3Rpb25zLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gIG5ldyBEYXRlKDE5ODQsIDQsIDEpLFxuICBkYXRlID0+IEpTT04uc3RyaW5naWZ5KGRhdGUpLnJlcGxhY2UobmV3IFJlZ0V4cCgnXCInLCAnZycpLCAnJyksXG4pO1xuIiwiaW1wb3J0IHsgXG4gIG1hcCwgIGNvbnN0YW50LCBpc0FycmF5IFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgdHlwZUZ1bmN0aW9ucywgbWFrZXJ1bGUsXG4gIHBhcnNlZEZhaWxlZCwgZ2V0RGVmYXVsdEV4cG9ydCwgcGFyc2VkU3VjY2Vzcyxcbn0gZnJvbSAnLi90eXBlSGVscGVycyc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgdG9OdW1iZXJPck51bGwsXG4gICQkLCBpc1NhZmVJbnRlZ2VyLFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBhcnJheUZ1bmN0aW9ucyA9ICgpID0+IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBjb25zdGFudChbXSksXG59KTtcblxuY29uc3QgbWFwVG9QYXJzZWRBcnJhcnkgPSB0eXBlID0+ICQkKFxuICBtYXAoaSA9PiB0eXBlLnNhZmVQYXJzZVZhbHVlKGkpKSxcbiAgcGFyc2VkU3VjY2Vzcyxcbik7XG5cbmNvbnN0IGFycmF5VHJ5UGFyc2UgPSB0eXBlID0+IHN3aXRjaENhc2UoXG4gIFtpc0FycmF5LCBtYXBUb1BhcnNlZEFycmFyeSh0eXBlKV0sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbik7XG5cbmNvbnN0IHR5cGVOYW1lID0gdHlwZSA9PiBgYXJyYXk8JHt0eXBlfT5gO1xuXG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIG1heExlbmd0aDoge1xuICAgIGRlZmF1bHRWYWx1ZTogMTAwMDAsXG4gICAgaXNWYWxpZDogaXNTYWZlSW50ZWdlcixcbiAgICByZXF1aXJlbWVudERlc2NyaXB0aW9uOiAnbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXInLFxuICAgIHBhcnNlOiB0b051bWJlck9yTnVsbCxcbiAgfSxcbiAgbWluTGVuZ3RoOiB7XG4gICAgZGVmYXVsdFZhbHVlOiAwLFxuICAgIGlzVmFsaWQ6IG4gPT4gaXNTYWZlSW50ZWdlcihuKSAmJiBuID49IDAsXG4gICAgcmVxdWlyZW1lbnREZXNjcmlwdGlvbjogJ211c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyJyxcbiAgICBwYXJzZTogdG9OdW1iZXJPck51bGwsXG4gIH0sXG59O1xuXG5jb25zdCB0eXBlQ29uc3RyYWludHMgPSBbXG4gIG1ha2VydWxlKGFzeW5jICh2YWwsIG9wdHMpID0+IHZhbCA9PT0gbnVsbCB8fCB2YWwubGVuZ3RoID49IG9wdHMubWluTGVuZ3RoLFxuICAgICh2YWwsIG9wdHMpID0+IGBtdXN0IGNob29zZSAke29wdHMubWluTGVuZ3RofSBvciBtb3JlIG9wdGlvbnNgKSxcbiAgbWFrZXJ1bGUoYXN5bmMgKHZhbCwgb3B0cykgPT4gdmFsID09PSBudWxsIHx8IHZhbC5sZW5ndGggPD0gb3B0cy5tYXhMZW5ndGgsXG4gICAgKHZhbCwgb3B0cykgPT4gYGNhbm5vdCBjaG9vc2UgbW9yZSB0aGFuICR7b3B0cy5tYXhMZW5ndGh9IG9wdGlvbnNgKSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IHR5cGUgPT4gZ2V0RGVmYXVsdEV4cG9ydChcbiAgdHlwZU5hbWUodHlwZS5uYW1lKSxcbiAgYXJyYXlUcnlQYXJzZSh0eXBlKSxcbiAgYXJyYXlGdW5jdGlvbnModHlwZSksXG4gIG9wdGlvbnMsXG4gIHR5cGVDb25zdHJhaW50cyxcbiAgW3R5cGUuc2FtcGxlVmFsdWVdLFxuICBKU09OLnN0cmluZ2lmeSxcbik7XG4iLCJpbXBvcnQge1xuICBpc1N0cmluZywgaXNPYmplY3RMaWtlLFxuICBpc051bGwsIGhhcywgaXNFbXB0eSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIHR5cGVGdW5jdGlvbnMsIG1ha2VydWxlLFxuICBwYXJzZWRTdWNjZXNzLCBnZXREZWZhdWx0RXhwb3J0LFxuICBwYXJzZWRGYWlsZWQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsXG4gIGlzTm9uRW1wdHlTdHJpbmcsIGlzQXJyYXlPZlN0cmluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuY29uc3QgcmVmZXJlbmNlTm90aGluZyA9ICgpID0+ICh7IGtleTogJycgfSk7XG5cbmNvbnN0IHJlZmVyZW5jZUZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiByZWZlcmVuY2VOb3RoaW5nLFxufSk7XG5cbmNvbnN0IGhhc1N0cmluZ1ZhbHVlID0gKG9iLCBwYXRoKSA9PiBoYXMocGF0aCkob2IpXG4gICAgJiYgaXNTdHJpbmcob2JbcGF0aF0pO1xuXG5jb25zdCBpc09iamVjdFdpdGhLZXkgPSB2ID0+IGlzT2JqZWN0TGlrZSh2KVxuICAgICYmIGhhc1N0cmluZ1ZhbHVlKHYsICdrZXknKTtcblxuY29uc3QgdHJ5UGFyc2VGcm9tU3RyaW5nID0gcyA9PiB7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBhc09iaiA9IEpTT04ucGFyc2Uocyk7XG4gICAgaWYoaXNPYmplY3RXaXRoS2V5KSB7XG4gICAgICByZXR1cm4gcGFyc2VkU3VjY2Vzcyhhc09iaik7XG4gICAgfVxuICB9XG4gIGNhdGNoKF8pIHtcbiAgICAvLyBFTVBUWVxuICB9XG5cbiAgcmV0dXJuIHBhcnNlZEZhaWxlZChzKTtcbn1cblxuY29uc3QgcmVmZXJlbmNlVHJ5UGFyc2UgPSB2ID0+IHN3aXRjaENhc2UoXG4gIFtpc09iamVjdFdpdGhLZXksIHBhcnNlZFN1Y2Nlc3NdLFxuICBbaXNTdHJpbmcsIHRyeVBhcnNlRnJvbVN0cmluZ10sXG4gIFtpc051bGwsICgpID0+IHBhcnNlZFN1Y2Nlc3MocmVmZXJlbmNlTm90aGluZygpKV0sXG4gIFtkZWZhdWx0Q2FzZSwgcGFyc2VkRmFpbGVkXSxcbikodik7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIGluZGV4Tm9kZUtleToge1xuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICBpc1ZhbGlkOiBpc05vbkVtcHR5U3RyaW5nLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZycsXG4gICAgcGFyc2U6IHMgPT4gcyxcbiAgfSxcbiAgZGlzcGxheVZhbHVlOiB7XG4gICAgZGVmYXVsdFZhbHVlOiAnJyxcbiAgICBpc1ZhbGlkOiBpc05vbkVtcHR5U3RyaW5nLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZycsXG4gICAgcGFyc2U6IHMgPT4gcyxcbiAgfSxcbiAgcmV2ZXJzZUluZGV4Tm9kZUtleXM6IHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgaXNWYWxpZDogdiA9PiBpc0FycmF5T2ZTdHJpbmcodikgJiYgdi5sZW5ndGggPiAwLFxuICAgIHJlcXVpcmVtZW50RGVzY3JpcHRpb246ICdtdXN0IGJlIGEgbm9uLWVtcHR5IGFycmF5IG9mIHN0cmluZ3MnLFxuICAgIHBhcnNlOiBzID0+IHMsXG4gIH0sXG59O1xuXG5jb25zdCBpc0VtcHR5U3RyaW5nID0gcyA9PiBpc1N0cmluZyhzKSAmJiBpc0VtcHR5KHMpO1xuXG5jb25zdCBlbnN1cmVSZWZlcmVuY2VFeGlzdHMgPSBhc3luYyAodmFsLCBvcHRzLCBjb250ZXh0KSA9PiBpc0VtcHR5U3RyaW5nKHZhbC5rZXkpXG4gICAgfHwgYXdhaXQgY29udGV4dC5yZWZlcmVuY2VFeGlzdHMob3B0cywgdmFsLmtleSk7XG5cbmNvbnN0IHR5cGVDb25zdHJhaW50cyA9IFtcbiAgbWFrZXJ1bGUoXG4gICAgZW5zdXJlUmVmZXJlbmNlRXhpc3RzLFxuICAgICh2YWwsIG9wdHMpID0+IGBcIiR7dmFsW29wdHMuZGlzcGxheVZhbHVlXX1cIiBkb2VzIG5vdCBleGlzdCBpbiBvcHRpb25zIGxpc3QgKGtleTogJHt2YWwua2V5fSlgLFxuICApLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdEV4cG9ydChcbiAgJ3JlZmVyZW5jZScsXG4gIHJlZmVyZW5jZVRyeVBhcnNlLFxuICByZWZlcmVuY2VGdW5jdGlvbnMsXG4gIG9wdGlvbnMsXG4gIHR5cGVDb25zdHJhaW50cyxcbiAgeyBrZXk6ICdrZXknLCB2YWx1ZTogJ3ZhbHVlJyB9LFxuICBKU09OLnN0cmluZ2lmeSxcbik7XG4iLCJpbXBvcnQge1xuICBsYXN0LCBoYXMsIGlzU3RyaW5nLCBpbnRlcnNlY3Rpb24sXG4gIGlzTnVsbCwgaXNOdW1iZXIsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICB0eXBlRnVuY3Rpb25zLCBwYXJzZWRGYWlsZWQsXG4gIHBhcnNlZFN1Y2Nlc3MsIGdldERlZmF1bHRFeHBvcnQsXG59IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHtcbiAgc3dpdGNoQ2FzZSwgZGVmYXVsdENhc2UsIG5vbmUsXG4gICQsIHNwbGl0S2V5LFxufSBmcm9tICcuLi9jb21tb24nO1xuXG5jb25zdCBpbGxlZ2FsQ2hhcmFjdGVycyA9ICcqP1xcXFwvOjw+fFxcMFxcYlxcZlxcdic7XG5cbmV4cG9ydCBjb25zdCBpc0xlZ2FsRmlsZW5hbWUgPSAoZmlsZVBhdGgpID0+IHtcbiAgY29uc3QgZm4gPSBmaWxlTmFtZShmaWxlUGF0aCk7XG4gIHJldHVybiBmbi5sZW5ndGggPD0gMjU1XG4gICAgJiYgaW50ZXJzZWN0aW9uKGZuLnNwbGl0KCcnKSkoaWxsZWdhbENoYXJhY3RlcnMuc3BsaXQoJycpKS5sZW5ndGggPT09IDBcbiAgICAmJiBub25lKGYgPT4gZiA9PT0gJy4uJykoc3BsaXRLZXkoZmlsZVBhdGgpKTtcbn07XG5cbmNvbnN0IGZpbGVOb3RoaW5nID0gKCkgPT4gKHsgcmVsYXRpdmVQYXRoOiAnJywgc2l6ZTogMCB9KTtcblxuY29uc3QgZmlsZUZ1bmN0aW9ucyA9IHR5cGVGdW5jdGlvbnMoe1xuICBkZWZhdWx0OiBmaWxlTm90aGluZyxcbn0pO1xuXG5jb25zdCBmaWxlVHJ5UGFyc2UgPSB2ID0+IHN3aXRjaENhc2UoXG4gIFtpc1ZhbGlkRmlsZSwgcGFyc2VkU3VjY2Vzc10sXG4gIFtpc051bGwsICgpID0+IHBhcnNlZFN1Y2Nlc3MoZmlsZU5vdGhpbmcoKSldLFxuICBbZGVmYXVsdENhc2UsIHBhcnNlZEZhaWxlZF0sXG4pKHYpO1xuXG5jb25zdCBmaWxlTmFtZSA9IGZpbGVQYXRoID0+ICQoZmlsZVBhdGgsIFtcbiAgc3BsaXRLZXksXG4gIGxhc3QsXG5dKTtcblxuY29uc3QgaXNWYWxpZEZpbGUgPSBmID0+ICFpc051bGwoZilcbiAgICAmJiBoYXMoJ3JlbGF0aXZlUGF0aCcpKGYpICYmIGhhcygnc2l6ZScpKGYpXG4gICAgJiYgaXNOdW1iZXIoZi5zaXplKVxuICAgICYmIGlzU3RyaW5nKGYucmVsYXRpdmVQYXRoKVxuICAgICYmIGlzTGVnYWxGaWxlbmFtZShmLnJlbGF0aXZlUGF0aCk7XG5cbmNvbnN0IG9wdGlvbnMgPSB7fTtcblxuY29uc3QgdHlwZUNvbnN0cmFpbnRzID0gW107XG5cbmV4cG9ydCBkZWZhdWx0IGdldERlZmF1bHRFeHBvcnQoXG4gICdmaWxlJyxcbiAgZmlsZVRyeVBhcnNlLFxuICBmaWxlRnVuY3Rpb25zLFxuICBvcHRpb25zLFxuICB0eXBlQ29uc3RyYWludHMsXG4gIHsgcmVsYXRpdmVQYXRoOiAnc29tZV9maWxlLmpwZycsIHNpemU6IDEwMDAgfSxcbiAgSlNPTi5zdHJpbmdpZnksXG4pO1xuIiwiaW1wb3J0IHtcbiAgYXNzaWduLCBtZXJnZSwgXG59IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICBtYXAsIGlzU3RyaW5nLCBpc051bWJlcixcbiAgaXNCb29sZWFuLCBpc0RhdGUsIGtleXMsXG4gIGlzT2JqZWN0LCBpc0FycmF5LCBoYXNcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7ICQgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGFyc2VkU3VjY2VzcyB9IGZyb20gJy4vdHlwZUhlbHBlcnMnO1xuaW1wb3J0IHN0cmluZyBmcm9tICcuL3N0cmluZyc7XG5pbXBvcnQgYm9vbCBmcm9tICcuL2Jvb2wnO1xuaW1wb3J0IG51bWJlciBmcm9tICcuL251bWJlcic7XG5pbXBvcnQgZGF0ZXRpbWUgZnJvbSAnLi9kYXRldGltZSc7XG5pbXBvcnQgYXJyYXkgZnJvbSAnLi9hcnJheSc7XG5pbXBvcnQgcmVmZXJlbmNlIGZyb20gJy4vcmVmZXJlbmNlJztcbmltcG9ydCBmaWxlIGZyb20gJy4vZmlsZSc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuY29uc3QgYWxsVHlwZXMgPSAoKSA9PiB7XG4gIGNvbnN0IGJhc2ljVHlwZXMgPSB7XG4gICAgc3RyaW5nLCBudW1iZXIsIGRhdGV0aW1lLCBib29sLCByZWZlcmVuY2UsIGZpbGUsXG4gIH07XG5cbiAgY29uc3QgYXJyYXlzID0gJChiYXNpY1R5cGVzLCBbXG4gICAga2V5cyxcbiAgICBtYXAoKGspID0+IHtcbiAgICAgIGNvbnN0IGt2VHlwZSA9IHt9O1xuICAgICAgY29uc3QgY29uY3JldGVBcnJheSA9IGFycmF5KGJhc2ljVHlwZXNba10pO1xuICAgICAga3ZUeXBlW2NvbmNyZXRlQXJyYXkubmFtZV0gPSBjb25jcmV0ZUFycmF5O1xuICAgICAgcmV0dXJuIGt2VHlwZTtcbiAgICB9KSxcbiAgICB0eXBlcyA9PiBhc3NpZ24oe30sIC4uLnR5cGVzKSxcbiAgXSk7XG5cbiAgcmV0dXJuIG1lcmdlKHt9LCBiYXNpY1R5cGVzLCBhcnJheXMpO1xufTtcblxuXG5leHBvcnQgY29uc3QgYWxsID0gYWxsVHlwZXMoKTtcblxuZXhwb3J0IGNvbnN0IGdldFR5cGUgPSAodHlwZU5hbWUpID0+IHtcbiAgaWYgKCFoYXModHlwZU5hbWUpKGFsbCkpIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYERvIG5vdCByZWNvZ25pc2UgdHlwZSAke3R5cGVOYW1lfWApO1xuICByZXR1cm4gYWxsW3R5cGVOYW1lXTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRTYW1wbGVGaWVsZFZhbHVlID0gZmllbGQgPT4gZ2V0VHlwZShmaWVsZC50eXBlKS5zYW1wbGVWYWx1ZTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0ZpZWxkVmFsdWUgPSBmaWVsZCA9PiBnZXRUeXBlKGZpZWxkLnR5cGUpLmdldE5ldyhmaWVsZCk7XG5cbmV4cG9ydCBjb25zdCBzYWZlUGFyc2VGaWVsZCA9IChmaWVsZCwgcmVjb3JkKSA9PiBnZXRUeXBlKGZpZWxkLnR5cGUpLnNhZmVQYXJzZUZpZWxkKGZpZWxkLCByZWNvcmQpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVGaWVsZFBhcnNlID0gKGZpZWxkLCByZWNvcmQpID0+IChoYXMoZmllbGQubmFtZSkocmVjb3JkKVxuICA/IGdldFR5cGUoZmllbGQudHlwZSkudHJ5UGFyc2UocmVjb3JkW2ZpZWxkLm5hbWVdKVxuICA6IHBhcnNlZFN1Y2Nlc3ModW5kZWZpbmVkKSk7IC8vIGZpZWxkcyBtYXkgYmUgdW5kZWZpbmVkIGJ5IGRlZmF1bHRcblxuZXhwb3J0IGNvbnN0IGdldERlZmF1bHRPcHRpb25zID0gdHlwZSA9PiBnZXRUeXBlKHR5cGUpLmdldERlZmF1bHRPcHRpb25zKCk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyA9IGFzeW5jIChmaWVsZCwgcmVjb3JkLCBjb250ZXh0KSA9PiBhd2FpdCBnZXRUeXBlKGZpZWxkLnR5cGUpLnZhbGlkYXRlVHlwZUNvbnN0cmFpbnRzKGZpZWxkLCByZWNvcmQsIGNvbnRleHQpO1xuXG5leHBvcnQgY29uc3QgZGV0ZWN0VHlwZSA9ICh2YWx1ZSkgPT4ge1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSByZXR1cm4gc3RyaW5nO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSkgcmV0dXJuIGJvb2w7XG4gIGlmIChpc051bWJlcih2YWx1ZSkpIHJldHVybiBudW1iZXI7XG4gIGlmIChpc0RhdGUodmFsdWUpKSByZXR1cm4gZGF0ZXRpbWU7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkgcmV0dXJuIGFycmF5KGRldGVjdFR5cGUodmFsdWVbMF0pKTtcbiAgaWYgKGlzT2JqZWN0KHZhbHVlKVxuICAgICAgICYmIGhhcygna2V5JykodmFsdWUpXG4gICAgICAgJiYgaGFzKCd2YWx1ZScpKHZhbHVlKSkgcmV0dXJuIHJlZmVyZW5jZTtcbiAgaWYgKGlzT2JqZWN0KHZhbHVlKVxuICAgICAgICAmJiBoYXMoJ3JlbGF0aXZlUGF0aCcpKHZhbHVlKVxuICAgICAgICAmJiBoYXMoJ3NpemUnKSh2YWx1ZSkpIHJldHVybiBmaWxlO1xuXG4gIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYGNhbm5vdCBkZXRlcm1pbmUgdHlwZTogJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSl9YCk7XG59O1xuIiwiaW1wb3J0IHsgY2xvbmUsIGZpbmQsIHNwbGl0IH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGpvaW5LZXksICQgfSBmcm9tICcuLi9jb21tb24nO1xuLy8gNSBtaW51dGVzXG5leHBvcnQgY29uc3QgdGVtcENvZGVFeHBpcnlMZW5ndGggPSA1ICogNjAgKiAxMDAwO1xuXG5leHBvcnQgY29uc3QgQVVUSF9GT0xERVIgPSAnLy5hdXRoJztcbmV4cG9ydCBjb25zdCBVU0VSU19MSVNUX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAndXNlcnMuanNvbicpO1xuZXhwb3J0IGNvbnN0IHVzZXJBdXRoRmlsZSA9IHVzZXJuYW1lID0+IGpvaW5LZXkoQVVUSF9GT0xERVIsIGBhdXRoXyR7dXNlcm5hbWV9Lmpzb25gKTtcbmV4cG9ydCBjb25zdCBVU0VSU19MT0NLX0ZJTEUgPSBqb2luS2V5KEFVVEhfRk9MREVSLCAndXNlcnNfbG9jaycpO1xuZXhwb3J0IGNvbnN0IEFDQ0VTU19MRVZFTFNfRklMRSA9IGpvaW5LZXkoQVVUSF9GT0xERVIsICdhY2Nlc3NfbGV2ZWxzLmpzb24nKTtcbmV4cG9ydCBjb25zdCBBQ0NFU1NfTEVWRUxTX0xPQ0tfRklMRSA9IGpvaW5LZXkoQVVUSF9GT0xERVIsICdhY2Nlc3NfbGV2ZWxzX2xvY2snKTtcblxuZXhwb3J0IGNvbnN0IHBlcm1pc3Npb25UeXBlcyA9IHtcbiAgQ1JFQVRFX1JFQ09SRDogJ2NyZWF0ZSByZWNvcmQnLFxuICBVUERBVEVfUkVDT1JEOiAndXBkYXRlIHJlY29yZCcsXG4gIFJFQURfUkVDT1JEOiAncmVhZCByZWNvcmQnLFxuICBERUxFVEVfUkVDT1JEOiAnZGVsZXRlIHJlY29yZCcsXG4gIFJFQURfSU5ERVg6ICdyZWFkIGluZGV4JyxcbiAgTUFOQUdFX0lOREVYOiAnbWFuYWdlIGluZGV4JyxcbiAgTUFOQUdFX0NPTExFQ1RJT046ICdtYW5hZ2UgY29sbGVjdGlvbicsXG4gIFdSSVRFX1RFTVBMQVRFUzogJ3dyaXRlIHRlbXBsYXRlcycsXG4gIENSRUFURV9VU0VSOiAnY3JlYXRlIHVzZXInLFxuICBTRVRfUEFTU1dPUkQ6ICdzZXQgcGFzc3dvcmQnLFxuICBDUkVBVEVfVEVNUE9SQVJZX0FDQ0VTUzogJ2NyZWF0ZSB0ZW1wb3JhcnkgYWNjZXNzJyxcbiAgRU5BQkxFX0RJU0FCTEVfVVNFUjogJ2VuYWJsZSBvciBkaXNhYmxlIHVzZXInLFxuICBXUklURV9BQ0NFU1NfTEVWRUxTOiAnd3JpdGUgYWNjZXNzIGxldmVscycsXG4gIExJU1RfVVNFUlM6ICdsaXN0IHVzZXJzJyxcbiAgTElTVF9BQ0NFU1NfTEVWRUxTOiAnbGlzdCBhY2Nlc3MgbGV2ZWxzJyxcbiAgRVhFQ1VURV9BQ1RJT046ICdleGVjdXRlIGFjdGlvbicsXG4gIFNFVF9VU0VSX0FDQ0VTU19MRVZFTFM6ICdzZXQgdXNlciBhY2Nlc3MgbGV2ZWxzJyxcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRVc2VyQnlOYW1lID0gKHVzZXJzLCBuYW1lKSA9PiAkKHVzZXJzLCBbXG4gIGZpbmQodSA9PiB1Lm5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZS50b0xvd2VyQ2FzZSgpKSxcbl0pO1xuXG5leHBvcnQgY29uc3Qgc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZiA9ICh1c2VyKSA9PiB7XG4gIGNvbnN0IHN0cmlwcGVkID0gY2xvbmUodXNlcik7XG4gIGRlbGV0ZSBzdHJpcHBlZC50ZW1wQ29kZTtcbiAgcmV0dXJuIHN0cmlwcGVkO1xufTtcblxuZXhwb3J0IGNvbnN0IHBhcnNlVGVtcG9yYXJ5Q29kZSA9IGZ1bGxDb2RlID0+ICQoZnVsbENvZGUsIFtcbiAgc3BsaXQoJzonKSxcbiAgcGFydHMgPT4gKHtcbiAgICBpZDogcGFydHNbMV0sXG4gICAgY29kZTogcGFydHNbMl0sXG4gIH0pLFxuXSk7XG4iLCJpbXBvcnQgeyB2YWx1ZXMsIGluY2x1ZGVzLCBzb21lIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHBlcm1pc3Npb25UeXBlcyB9IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQge1xuICAkLCBpc05vdGhpbmcsIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXROb2RlQnlLZXlPck5vZGVLZXksIGlzTm9kZSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBhbHdheXNBdXRob3JpemVkIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBpc0F1dGhvcml6ZWQgPSBhcHAgPT4gKHBlcm1pc3Npb25UeXBlLCByZXNvdXJjZUtleSkgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuaXNBdXRob3JpemVkLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHJlc291cmNlS2V5LCBwZXJtaXNzaW9uVHlwZSB9LFxuICBfaXNBdXRob3JpemVkLCBhcHAsIHBlcm1pc3Npb25UeXBlLCByZXNvdXJjZUtleSxcbik7XG5cbmV4cG9ydCBjb25zdCBfaXNBdXRob3JpemVkID0gKGFwcCwgcGVybWlzc2lvblR5cGUsIHJlc291cmNlS2V5KSA9PiB7XG4gIGlmICghYXBwLnVzZXIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCB2YWxpZFR5cGUgPSAkKHBlcm1pc3Npb25UeXBlcywgW1xuICAgIHZhbHVlcyxcbiAgICBpbmNsdWRlcyhwZXJtaXNzaW9uVHlwZSksXG4gIF0pO1xuXG4gIGlmICghdmFsaWRUeXBlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgcGVybU1hdGNoZXNSZXNvdXJjZSA9ICh1c2VycGVybSkgPT4ge1xuICAgIGNvbnN0IG5vZGVLZXkgPSBpc05vdGhpbmcocmVzb3VyY2VLZXkpXG4gICAgICA/IG51bGxcbiAgICAgIDogaXNOb2RlKGFwcC5oaWVyYXJjaHksIHJlc291cmNlS2V5KVxuICAgICAgICA/IGdldE5vZGVCeUtleU9yTm9kZUtleShcbiAgICAgICAgICBhcHAuaGllcmFyY2h5LCByZXNvdXJjZUtleSxcbiAgICAgICAgKS5ub2RlS2V5KClcbiAgICAgICAgOiByZXNvdXJjZUtleTtcblxuICAgIHJldHVybiAodXNlcnBlcm0udHlwZSA9PT0gcGVybWlzc2lvblR5cGUpXG4gICAgICAgICYmIChcbiAgICAgICAgICBpc05vdGhpbmcocmVzb3VyY2VLZXkpXG4gICAgICAgICAgICB8fCBub2RlS2V5ID09PSB1c2VycGVybS5ub2RlS2V5XG4gICAgICAgICk7XG4gIH07XG5cbiAgcmV0dXJuICQoYXBwLnVzZXIucGVybWlzc2lvbnMsIFtcbiAgICBzb21lKHBlcm1NYXRjaGVzUmVzb3VyY2UpLFxuICBdKTtcbn07XG4iLCJpbXBvcnQgeyBwZXJtaXNzaW9uVHlwZXMgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgaXNBdXRob3JpemVkIH0gZnJvbSAnLi9pc0F1dGhvcml6ZWQnO1xuXG5leHBvcnQgY29uc3QgdGVtcG9yYXJ5QWNjZXNzUGVybWlzc2lvbnMgPSAoKSA9PiAoW3sgdHlwZTogcGVybWlzc2lvblR5cGVzLlNFVF9QQVNTV09SRCB9XSk7XG5cbmNvbnN0IG5vZGVQZXJtaXNzaW9uID0gdHlwZSA9PiAoe1xuICBhZGQ6IChub2RlS2V5LCBhY2Nlc3NMZXZlbCkgPT4gYWNjZXNzTGV2ZWwucGVybWlzc2lvbnMucHVzaCh7IHR5cGUsIG5vZGVLZXkgfSksXG4gIGlzQXV0aG9yaXplZDogcmVzb3VyY2VLZXkgPT4gYXBwID0+IGlzQXV0aG9yaXplZChhcHApKHR5cGUsIHJlc291cmNlS2V5KSxcbiAgaXNOb2RlOiB0cnVlLFxuICBnZXQ6IG5vZGVLZXkgPT4gKHsgdHlwZSwgbm9kZUtleSB9KSxcbn0pO1xuXG5jb25zdCBzdGF0aWNQZXJtaXNzaW9uID0gdHlwZSA9PiAoe1xuICBhZGQ6IGFjY2Vzc0xldmVsID0+IGFjY2Vzc0xldmVsLnBlcm1pc3Npb25zLnB1c2goeyB0eXBlIH0pLFxuICBpc0F1dGhvcml6ZWQ6IGFwcCA9PiBpc0F1dGhvcml6ZWQoYXBwKSh0eXBlKSxcbiAgaXNOb2RlOiBmYWxzZSxcbiAgZ2V0OiAoKSA9PiAoeyB0eXBlIH0pLFxufSk7XG5cbmNvbnN0IGNyZWF0ZVJlY29yZCA9IG5vZGVQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfUkVDT1JEKTtcblxuY29uc3QgdXBkYXRlUmVjb3JkID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlVQREFURV9SRUNPUkQpO1xuXG5jb25zdCBkZWxldGVSZWNvcmQgPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuREVMRVRFX1JFQ09SRCk7XG5cbmNvbnN0IHJlYWRSZWNvcmQgPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuUkVBRF9SRUNPUkQpO1xuXG5jb25zdCB3cml0ZVRlbXBsYXRlcyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLldSSVRFX1RFTVBMQVRFUyk7XG5cbmNvbnN0IGNyZWF0ZVVzZXIgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5DUkVBVEVfVVNFUik7XG5cbmNvbnN0IHNldFBhc3N3b3JkID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuU0VUX1BBU1NXT1JEKTtcblxuY29uc3QgcmVhZEluZGV4ID0gbm9kZVBlcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLlJFQURfSU5ERVgpO1xuXG5jb25zdCBtYW5hZ2VJbmRleCA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLk1BTkFHRV9JTkRFWCk7XG5cbmNvbnN0IG1hbmFnZUNvbGxlY3Rpb24gPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5NQU5BR0VfQ09MTEVDVElPTik7XG5cbmNvbnN0IGNyZWF0ZVRlbXBvcmFyeUFjY2VzcyA9IHN0YXRpY1Blcm1pc3Npb24ocGVybWlzc2lvblR5cGVzLkNSRUFURV9URU1QT1JBUllfQUNDRVNTKTtcblxuY29uc3QgZW5hYmxlRGlzYWJsZVVzZXIgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5FTkFCTEVfRElTQUJMRV9VU0VSKTtcblxuY29uc3Qgd3JpdGVBY2Nlc3NMZXZlbHMgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5XUklURV9BQ0NFU1NfTEVWRUxTKTtcblxuY29uc3QgbGlzdFVzZXJzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuTElTVF9VU0VSUyk7XG5cbmNvbnN0IGxpc3RBY2Nlc3NMZXZlbHMgPSBzdGF0aWNQZXJtaXNzaW9uKHBlcm1pc3Npb25UeXBlcy5MSVNUX0FDQ0VTU19MRVZFTFMpO1xuXG5jb25zdCBzZXRVc2VyQWNjZXNzTGV2ZWxzID0gc3RhdGljUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuU0VUX1VTRVJfQUNDRVNTX0xFVkVMUyk7XG5cbmNvbnN0IGV4ZWN1dGVBY3Rpb24gPSBub2RlUGVybWlzc2lvbihwZXJtaXNzaW9uVHlwZXMuRVhFQ1VURV9BQ1RJT04pO1xuXG5leHBvcnQgY29uc3QgYWx3YXlzQXV0aG9yaXplZCA9ICgpID0+IHRydWU7XG5cbmV4cG9ydCBjb25zdCBwZXJtaXNzaW9uID0ge1xuICBjcmVhdGVSZWNvcmQsXG4gIHVwZGF0ZVJlY29yZCxcbiAgZGVsZXRlUmVjb3JkLFxuICByZWFkUmVjb3JkLFxuICB3cml0ZVRlbXBsYXRlcyxcbiAgY3JlYXRlVXNlcixcbiAgc2V0UGFzc3dvcmQsXG4gIHJlYWRJbmRleCxcbiAgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzLFxuICBlbmFibGVEaXNhYmxlVXNlcixcbiAgd3JpdGVBY2Nlc3NMZXZlbHMsXG4gIGxpc3RVc2VycyxcbiAgbGlzdEFjY2Vzc0xldmVscyxcbiAgbWFuYWdlSW5kZXgsXG4gIG1hbmFnZUNvbGxlY3Rpb24sXG4gIGV4ZWN1dGVBY3Rpb24sXG4gIHNldFVzZXJBY2Nlc3NMZXZlbHMsXG59O1xuIiwiaW1wb3J0IHtcbiAga2V5QnksIG1hcFZhbHVlcyxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnc2hvcnRpZCc7XG5pbXBvcnQgeyBcbiAgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoLCBpc1NpbmdsZVJlY29yZCBcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IGdldE5ld0ZpZWxkVmFsdWUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge1xuICAkLCBqb2luS2V5LCBzYWZlS2V5LCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZ2V0TmV3ID0gYXBwID0+IChjb2xsZWN0aW9uS2V5LCByZWNvcmRUeXBlTmFtZSkgPT4ge1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0UmVjb3JkTm9kZShhcHAsIGNvbGxlY3Rpb25LZXksIHJlY29yZFR5cGVOYW1lKTtcbiAgY29sbGVjdGlvbktleT1zYWZlS2V5KGNvbGxlY3Rpb25LZXkpO1xuICByZXR1cm4gYXBpV3JhcHBlclN5bmMoXG4gICAgYXBwLFxuICAgIGV2ZW50cy5yZWNvcmRBcGkuZ2V0TmV3LFxuICAgIHBlcm1pc3Npb24uY3JlYXRlUmVjb3JkLmlzQXV0aG9yaXplZChyZWNvcmROb2RlLm5vZGVLZXkoKSksXG4gICAgeyBjb2xsZWN0aW9uS2V5LCByZWNvcmRUeXBlTmFtZSB9LFxuICAgIF9nZXROZXcsIHJlY29yZE5vZGUsIGNvbGxlY3Rpb25LZXksXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgX2dldE5ldyA9IChyZWNvcmROb2RlLCBjb2xsZWN0aW9uS2V5KSA9PiBjb25zdHJ1Y3RSZWNvcmQocmVjb3JkTm9kZSwgZ2V0TmV3RmllbGRWYWx1ZSwgY29sbGVjdGlvbktleSk7XG5cbmNvbnN0IGdldFJlY29yZE5vZGUgPSAoYXBwLCBjb2xsZWN0aW9uS2V5KSA9PiB7XG4gIGNvbGxlY3Rpb25LZXkgPSBzYWZlS2V5KGNvbGxlY3Rpb25LZXkpO1xuICByZXR1cm4gZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoKGFwcC5oaWVyYXJjaHkpKGNvbGxlY3Rpb25LZXkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0NoaWxkID0gYXBwID0+IChyZWNvcmRLZXksIGNvbGxlY3Rpb25OYW1lLCByZWNvcmRUeXBlTmFtZSkgPT4gXG4gIGdldE5ldyhhcHApKGpvaW5LZXkocmVjb3JkS2V5LCBjb2xsZWN0aW9uTmFtZSksIHJlY29yZFR5cGVOYW1lKTtcblxuZXhwb3J0IGNvbnN0IGNvbnN0cnVjdFJlY29yZCA9IChyZWNvcmROb2RlLCBnZXRGaWVsZFZhbHVlLCBjb2xsZWN0aW9uS2V5KSA9PiB7XG4gIGNvbnN0IHJlY29yZCA9ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgICBrZXlCeSgnbmFtZScpLFxuICAgIG1hcFZhbHVlcyhnZXRGaWVsZFZhbHVlKSxcbiAgXSk7XG5cbiAgcmVjb3JkLmlkID0gYCR7cmVjb3JkTm9kZS5ub2RlSWR9LSR7Z2VuZXJhdGUoKX1gO1xuICByZWNvcmQua2V5ID0gaXNTaW5nbGVSZWNvcmQocmVjb3JkTm9kZSlcbiAgICAgICAgICAgICAgID8gam9pbktleShjb2xsZWN0aW9uS2V5LCByZWNvcmROb2RlLm5hbWUpXG4gICAgICAgICAgICAgICA6IGpvaW5LZXkoY29sbGVjdGlvbktleSwgcmVjb3JkLmlkKTtcbiAgcmVjb3JkLmlzTmV3ID0gdHJ1ZTtcbiAgcmVjb3JkLnR5cGUgPSByZWNvcmROb2RlLm5hbWU7XG4gIHJldHVybiByZWNvcmQ7XG59O1xuIiwiaW1wb3J0IHtcbiAgZmxhdHRlbiwgb3JkZXJCeSxcbiAgZmlsdGVyLCBpc1VuZGVmaW5lZFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IGhpZXJhcmNoeSwge1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGdldENvbGxlY3Rpb25Ob2RlQnlLZXlPck5vZGVLZXksXG4gIGlzQ29sbGVjdGlvblJlY29yZCwgaXNBbmNlc3Rvcixcbn0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IGpvaW5LZXksIHNhZmVLZXksICQgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0Q29sbGVjdGlvbkRpciB9IGZyb20gXCIuLi9yZWNvcmRBcGkvcmVjb3JkSW5mb1wiO1xuXG5leHBvcnQgY29uc3QgUkVDT1JEU19QRVJfRk9MREVSID0gMTAwMDtcbmV4cG9ydCBjb25zdCBhbGxJZENoYXJzID0gJzAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXy0nO1xuXG4vLyB0aGlzIHNob3VsZCBuZXZlciBiZSBjaGFuZ2VkIC0gZXZlciBcbi8vIC0gZXhpc3RpbmcgZGF0YWJhc2VzIGRlcGVuZCBvbiB0aGUgb3JkZXIgb2YgY2hhcnMgdGhpcyBzdHJpbmdcblxuLyoqXG4gKiBmb2xkZXJTdHJ1Y3R1cmVBcnJheSBzaG91bGQgcmV0dXJuIGFuIGFycmF5IGxpa2VcbiAqIC0gWzFdID0gYWxsIHJlY29yZHMgZml0IGludG8gb25lIGZvbGRlclxuICogLSBbMl0gPSBhbGwgcmVjb3JkcyBmaXRlIGludG8gMiBmb2xkZXJzXG4gKiAtIFs2NCwgM10gPSBhbGwgcmVjb3JkcyBmaXQgaW50byA2NCAqIDMgZm9sZGVyc1xuICogLSBbNjQsIDY0LCAxMF0gPSBhbGwgcmVjb3JkcyBmaXQgaW50byA2NCAqIDY0ICogMTAgZm9sZGVyXG4gKiAodGhlcmUgYXJlIDY0IHBvc3NpYmxlIGNoYXJzIGluIGFsbElzQ2hhcnMpIFxuKi9cbmV4cG9ydCBjb25zdCBmb2xkZXJTdHJ1Y3R1cmVBcnJheSA9IChyZWNvcmROb2RlKSA9PiB7XG5cbiAgY29uc3QgdG90YWxGb2xkZXJzID0gTWF0aC5jZWlsKHJlY29yZE5vZGUuZXN0aW1hdGVkUmVjb3JkQ291bnQgLyAxMDAwKTtcbiAgY29uc3QgZm9sZGVyQXJyYXkgPSBbXTtcbiAgbGV0IGxldmVsQ291bnQgPSAxO1xuICB3aGlsZSg2NCoqbGV2ZWxDb3VudCA8IHRvdGFsRm9sZGVycykge1xuICAgIGxldmVsQ291bnQgKz0gMTtcbiAgICBmb2xkZXJBcnJheS5wdXNoKDY0KTtcbiAgfVxuXG4gIGNvbnN0IHBhcmVudEZhY3RvciA9ICg2NCoqZm9sZGVyQXJyYXkubGVuZ3RoKTtcbiAgaWYocGFyZW50RmFjdG9yIDwgdG90YWxGb2xkZXJzKSB7XG4gICAgZm9sZGVyQXJyYXkucHVzaChcbiAgICAgIE1hdGguY2VpbCh0b3RhbEZvbGRlcnMgLyBwYXJlbnRGYWN0b3IpXG4gICAgKTtcbiAgfSAgXG5cbiAgcmV0dXJuIGZvbGRlckFycmF5O1xuXG4gIC8qXG4gIGNvbnN0IG1heFJlY29yZHMgPSBjdXJyZW50Rm9sZGVyUG9zaXRpb24gPT09IDAgXG4gICAgICAgICAgICAgICAgICAgICA/IFJFQ09SRFNfUEVSX0ZPTERFUlxuICAgICAgICAgICAgICAgICAgICAgOiBjdXJyZW50Rm9sZGVyUG9zaXRpb24gKiA2NCAqIFJFQ09SRFNfUEVSX0ZPTERFUjtcblxuICBpZihtYXhSZWNvcmRzIDwgcmVjb3JkTm9kZS5lc3RpbWF0ZWRSZWNvcmRDb3VudCkge1xuICAgIHJldHVybiBmb2xkZXJTdHJ1Y3R1cmVBcnJheShcbiAgICAgICAgICAgIHJlY29yZE5vZGUsXG4gICAgICAgICAgICBbLi4uY3VycmVudEFycmF5LCA2NF0sIFxuICAgICAgICAgICAgY3VycmVudEZvbGRlclBvc2l0aW9uICsgMSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgY2hpbGRGb2xkZXJDb3VudCA9IE1hdGguY2VpbChyZWNvcmROb2RlLmVzdGltYXRlZFJlY29yZENvdW50IC8gbWF4UmVjb3JkcyApO1xuICAgIHJldHVybiBbLi4uY3VycmVudEFycmF5LCBjaGlsZEZvbGRlckNvdW50XVxuICB9Ki9cbn1cblxuXG5leHBvcnQgY29uc3QgZ2V0QWxsSWRzSXRlcmF0b3IgPSBhcHAgPT4gYXN5bmMgKGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXkpID0+IHtcbiAgY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSA9IHNhZmVLZXkoY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSk7XG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRDb2xsZWN0aW9uTm9kZUJ5S2V5T3JOb2RlS2V5KFxuICAgIGFwcC5oaWVyYXJjaHksXG4gICAgY29sbGVjdGlvbl9LZXlfb3JfTm9kZUtleSxcbiAgKTtcblxuICBjb25zdCBnZXRBbGxJZHNJdGVyYXRvckZvckNvbGxlY3Rpb25LZXkgPSBhc3luYyAocmVjb3JkTm9kZSwgY29sbGVjdGlvbktleSkgPT4ge1xuICAgIFxuICAgIGNvbnN0IGZvbGRlclN0cnVjdHVyZSA9IGZvbGRlclN0cnVjdHVyZUFycmF5KHJlY29yZE5vZGUpXG5cbiAgICBsZXQgY3VycmVudEZvbGRlckNvbnRlbnRzID0gW107XG4gICAgbGV0IGN1cnJlbnRQb3NpdGlvbiA9IFtdO1xuXG4gICAgY29uc3QgY29sbGVjdGlvbkRpciA9IGdldENvbGxlY3Rpb25EaXIoYXBwLmhpZXJhcmNoeSwgY29sbGVjdGlvbktleSk7XG4gICAgY29uc3QgYmFzZVBhdGggPSBqb2luS2V5KFxuICAgICAgY29sbGVjdGlvbkRpciwgcmVjb3JkTm9kZS5ub2RlSWQudG9TdHJpbmcoKSk7XG4gIFxuXG4gICAgXG4gICAgLy8gXCJmb2xkZXJTdHJ1Y3R1cmVcIiBkZXRlcm1pbmVzIHRoZSB0b3AsIHNoYXJkaW5nIGZvbGRlcnNcbiAgICAvLyB3ZSBuZWVkIHRvIGFkZCBvbmUsIGZvciB0aGUgY29sbGVjdGlvbiByb290IGZvbGRlciwgd2hpY2hcbiAgICAvLyBhbHdheXMgIGV4aXN0cyBcbiAgICBjb25zdCBsZXZlbHMgPSBmb2xkZXJTdHJ1Y3R1cmUubGVuZ3RoICsgMTtcbiAgICBjb25zdCB0b3BMZXZlbCA9IGxldmVscyAtMTtcblxuICAgXG4gICAgLyogcG9wdWxhdGUgaW5pdGlhbCBkaXJlY3Rvcnkgc3RydWN0dXJlIGluIGZvcm06XG4gICAgW1xuICAgICAge3BhdGg6IFwiL2FcIiwgY29udGVudHM6IFtcImJcIiwgXCJjXCIsIFwiZFwiXX0sIFxuICAgICAge3BhdGg6IFwiL2EvYlwiLCBjb250ZW50czogW1wiZVwiLFwiZlwiLFwiZ1wiXX0sXG4gICAgICB7cGF0aDogXCIvYS9iL2VcIiwgY29udGVudHM6IFtcIjEtYWJjZFwiLFwiMi1jZGVmXCIsXCIzLWVmZ2hcIl19LCBcbiAgICBdXG4gICAgLy8gc3RvcmVzIGNvbnRlbnRzIG9uIGVhY2ggcGFyZW50IGxldmVsXG4gICAgLy8gdG9wIGxldmVsIGhhcyBJRCBmb2xkZXJzIFxuICAgICovXG4gICAgY29uc3QgZmlyc3RGb2xkZXIgPSBhc3luYyAoKSA9PiB7XG5cbiAgICAgIGxldCBmb2xkZXJMZXZlbCA9IDA7XG5cbiAgICAgIGNvbnN0IGxhc3RQYXRoSGFzQ29udGVudCA9ICgpID0+IFxuICAgICAgICBmb2xkZXJMZXZlbCA9PT0gMCBcbiAgICAgICAgfHwgY3VycmVudEZvbGRlckNvbnRlbnRzW2ZvbGRlckxldmVsIC0gMV0uY29udGVudHMubGVuZ3RoID4gMDtcblxuXG4gICAgICB3aGlsZSAoZm9sZGVyTGV2ZWwgPD0gdG9wTGV2ZWwgJiYgbGFzdFBhdGhIYXNDb250ZW50KCkpIHtcblxuICAgICAgICBsZXQgdGhpc1BhdGggPSBiYXNlUGF0aDtcbiAgICAgICAgZm9yKGxldCBsZXYgPSAwOyBsZXYgPCBjdXJyZW50UG9zaXRpb24ubGVuZ3RoOyBsZXYrKykge1xuICAgICAgICAgIHRoaXNQYXRoID0gam9pbktleShcbiAgICAgICAgICAgIHRoaXNQYXRoLCBjdXJyZW50Rm9sZGVyQ29udGVudHNbbGV2XS5jb250ZW50c1swXSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb250ZW50c1RoaXNMZXZlbCA9IFxuICAgICAgICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0Rm9sZGVyQ29udGVudHModGhpc1BhdGgpO1xuICAgICAgICBjdXJyZW50Rm9sZGVyQ29udGVudHMucHVzaCh7XG4gICAgICAgICAgICBjb250ZW50czpjb250ZW50c1RoaXNMZXZlbCwgXG4gICAgICAgICAgICBwYXRoOiB0aGlzUGF0aFxuICAgICAgICB9KTsgICBcblxuICAgICAgICAvLyBzaG91bGQgc3RhcnQgYXMgc29tZXRoaW5nIGxpa2UgWzAsMF1cbiAgICAgICAgaWYoZm9sZGVyTGV2ZWwgPCB0b3BMZXZlbClcbiAgICAgICAgICBjdXJyZW50UG9zaXRpb24ucHVzaCgwKTsgXG5cbiAgICAgICAgZm9sZGVyTGV2ZWwrPTE7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoY3VycmVudFBvc2l0aW9uLmxlbmd0aCA9PT0gbGV2ZWxzIC0gMSk7XG4gICAgfSAgXG5cbiAgICBjb25zdCBpc09uTGFzdEZvbGRlciA9IGxldmVsID0+IHtcbiAgICAgIFxuICAgICAgY29uc3QgcmVzdWx0ID0gIGN1cnJlbnRQb3NpdGlvbltsZXZlbF0gPT09IGN1cnJlbnRGb2xkZXJDb250ZW50c1tsZXZlbF0uY29udGVudHMubGVuZ3RoIC0gMTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IGdldE5leHRGb2xkZXIgPSBhc3luYyAobGV2PXVuZGVmaW5lZCkgPT4ge1xuICAgICAgbGV2ID0gaXNVbmRlZmluZWQobGV2KSA/IHRvcExldmVsIDogbGV2O1xuICAgICAgY29uc3QgcGFyZW50TGV2ID0gbGV2IC0gMTtcblxuICAgICAgaWYocGFyZW50TGV2IDwgMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgXG4gICAgICBpZihpc09uTGFzdEZvbGRlcihwYXJlbnRMZXYpKSB7IFxuICAgICAgICByZXR1cm4gYXdhaXQgZ2V0TmV4dEZvbGRlcihwYXJlbnRMZXYpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdQb3NpdGlvbiA9IGN1cnJlbnRQb3NpdGlvbltwYXJlbnRMZXZdICsgMTtcbiAgICAgIGN1cnJlbnRQb3NpdGlvbltwYXJlbnRMZXZdID0gbmV3UG9zaXRpb247XG4gICAgICBcbiAgICAgIGNvbnN0IG5leHRGb2xkZXIgPSBqb2luS2V5KFxuICAgICAgICBjdXJyZW50Rm9sZGVyQ29udGVudHNbcGFyZW50TGV2XS5wYXRoLFxuICAgICAgICBjdXJyZW50Rm9sZGVyQ29udGVudHNbcGFyZW50TGV2XS5jb250ZW50c1tuZXdQb3NpdGlvbl0pO1xuICAgICAgY3VycmVudEZvbGRlckNvbnRlbnRzW2xldl0uY29udGVudHMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZvbGRlckNvbnRlbnRzKFxuICAgICAgICBuZXh0Rm9sZGVyXG4gICAgICApO1xuICAgICAgY3VycmVudEZvbGRlckNvbnRlbnRzW2xldl0ucGF0aCA9IG5leHRGb2xkZXI7XG5cbiAgICAgIGlmKGxldiAhPT0gdG9wTGV2ZWwpIHtcbiAgICAgIFxuICAgICAgICAvLyB3ZSBqdXN0IGFkdmFuY2VkIGEgcGFyZW50IGZvbGRlciwgc28gbm93IG5lZWQgdG9cbiAgICAgICAgLy8gZG8gdGhlIHNhbWUgdG8gdGhlIG5leHQgbGV2ZWxzXG4gICAgICAgIGxldCBsb29wTGV2ZWwgPSBsZXYgKyAxO1xuICAgICAgICB3aGlsZShsb29wTGV2ZWwgPD0gdG9wTGV2ZWwpIHtcbiAgICAgICAgICBjb25zdCBsb29wUGFyZW50TGV2ZWwgPSBsb29wTGV2ZWwtMTtcbiAgICAgICAgICBcbiAgICAgICAgICBjdXJyZW50UG9zaXRpb25bbG9vcFBhcmVudExldmVsXSA9IDA7XG4gICAgICAgICAgY29uc3QgbmV4dExvb3BGb2xkZXIgPSBqb2luS2V5KFxuICAgICAgICAgICAgY3VycmVudEZvbGRlckNvbnRlbnRzW2xvb3BQYXJlbnRMZXZlbF0ucGF0aCxcbiAgICAgICAgICAgIGN1cnJlbnRGb2xkZXJDb250ZW50c1tsb29wUGFyZW50TGV2ZWxdLmNvbnRlbnRzWzBdKTtcbiAgICAgICAgICBjdXJyZW50Rm9sZGVyQ29udGVudHNbbG9vcExldmVsXS5jb250ZW50cyA9IGF3YWl0IGFwcC5kYXRhc3RvcmUuZ2V0Rm9sZGVyQ29udGVudHMoXG4gICAgICAgICAgICBuZXh0TG9vcEZvbGRlclxuICAgICAgICAgICk7XG4gICAgICAgICAgY3VycmVudEZvbGRlckNvbnRlbnRzW2xvb3BMZXZlbF0ucGF0aCA9IG5leHRMb29wRm9sZGVyO1xuICAgICAgICAgIGxvb3BMZXZlbCs9MTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyB0cnVlID09aGFzIG1vcmUgaWRzLi4uIChqdXN0IGxvYWRlZCBtb3JlKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG5cbiAgICBjb25zdCBpZHNDdXJyZW50Rm9sZGVyID0gKCkgPT4gXG4gICAgICBjdXJyZW50Rm9sZGVyQ29udGVudHNbY3VycmVudEZvbGRlckNvbnRlbnRzLmxlbmd0aCAtIDFdLmNvbnRlbnRzO1xuXG4gICAgY29uc3QgZmluaW5zaGVkUmVzdWx0ID0gKHsgZG9uZTogdHJ1ZSwgcmVzdWx0OiB7IGlkczogW10sIGNvbGxlY3Rpb25LZXkgfSB9KTtcblxuICAgIGxldCBoYXNTdGFydGVkID0gZmFsc2U7XG4gICAgbGV0IGhhc01vcmUgPSB0cnVlO1xuICAgIGNvbnN0IGdldElkc0Zyb21DdXJyZW50Zm9sZGVyID0gYXN5bmMgKCkgPT4ge1xuXG4gICAgICBpZighaGFzTW9yZSkge1xuICAgICAgICByZXR1cm4gZmluaW5zaGVkUmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBpZighaGFzU3RhcnRlZCkge1xuICAgICAgICBoYXNNb3JlID0gYXdhaXQgZmlyc3RGb2xkZXIoKTtcbiAgICAgICAgaGFzU3RhcnRlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiAoe1xuICAgICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgICAgaWRzOiBpZHNDdXJyZW50Rm9sZGVyKCksXG4gICAgICAgICAgICBjb2xsZWN0aW9uS2V5XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkb25lOiBmYWxzZVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBoYXNNb3JlID0gYXdhaXQgZ2V0TmV4dEZvbGRlcigpO1xuICAgICAgXG4gICAgICByZXR1cm4gKHtcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgaWRzOiBoYXNNb3JlID8gaWRzQ3VycmVudEZvbGRlcigpIDogW10sXG4gICAgICAgICAgY29sbGVjdGlvbktleVxuICAgICAgICB9LFxuICAgICAgICBkb25lOiAhaGFzTW9yZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldElkc0Zyb21DdXJyZW50Zm9sZGVyO1xuICAgIFxuICB9O1xuXG4gIGNvbnN0IGFuY2VzdG9ycyA9ICQoZ2V0RmxhdHRlbmVkSGllcmFyY2h5KGFwcC5oaWVyYXJjaHkpLCBbXG4gICAgZmlsdGVyKGlzQ29sbGVjdGlvblJlY29yZCksXG4gICAgZmlsdGVyKG4gPT4gaXNBbmNlc3RvcihyZWNvcmROb2RlKShuKVxuICAgICAgICAgICAgICAgICAgICB8fCBuLm5vZGVLZXkoKSA9PT0gcmVjb3JkTm9kZS5ub2RlS2V5KCkpLFxuICAgIG9yZGVyQnkoW24gPT4gbi5ub2RlS2V5KCkubGVuZ3RoXSwgWydhc2MnXSksXG4gIF0pOyAvLyBwYXJlbnRzIGZpcnN0XG5cbiAgY29uc3QgdHJhdmVyc2VGb3JJdGVyYXRlcmF0b3JzID0gYXN5bmMgKHBhcmVudFJlY29yZEtleSA9ICcnLCBjdXJyZW50Tm9kZUluZGV4ID0gMCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gYW5jZXN0b3JzW2N1cnJlbnROb2RlSW5kZXhdO1xuICAgIGNvbnN0IGN1cnJlbnRDb2xsZWN0aW9uS2V5ID0gam9pbktleShcbiAgICAgIHBhcmVudFJlY29yZEtleSxcbiAgICAgIGN1cnJlbnROb2RlLmNvbGxlY3Rpb25OYW1lLFxuICAgICk7XG4gICAgaWYgKGN1cnJlbnROb2RlLm5vZGVLZXkoKSA9PT0gcmVjb3JkTm9kZS5ub2RlS2V5KCkpIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yRm9yQ29sbGVjdGlvbktleShcbiAgICAgICAgICBjdXJyZW50Tm9kZSxcbiAgICAgICAgICBjdXJyZW50Q29sbGVjdGlvbktleSxcbiAgICAgICAgKV07XG4gICAgfVxuICAgIGNvbnN0IGFsbEl0ZXJhdG9ycyA9IFtdO1xuICAgIGNvbnN0IGN1cnJlbnRJdGVyYXRvciA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yRm9yQ29sbGVjdGlvbktleShcbiAgICAgIGN1cnJlbnROb2RlLFxuICAgICAgY3VycmVudENvbGxlY3Rpb25LZXksXG4gICAgKTtcblxuICAgIGxldCBpZHMgPSBhd2FpdCBjdXJyZW50SXRlcmF0b3IoKTtcbiAgICB3aGlsZSAoaWRzLmRvbmUgPT09IGZhbHNlKSB7XG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIGlkcy5yZXN1bHQuaWRzKSB7XG4gICAgICAgIGFsbEl0ZXJhdG9ycy5wdXNoKFxuICAgICAgICAgIGF3YWl0IHRyYXZlcnNlRm9ySXRlcmF0ZXJhdG9ycyhcbiAgICAgICAgICAgIGpvaW5LZXkoY3VycmVudENvbGxlY3Rpb25LZXksIGlkKSxcbiAgICAgICAgICAgIGN1cnJlbnROb2RlSW5kZXggKyAxLFxuICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlkcyA9IGF3YWl0IGN1cnJlbnRJdGVyYXRvcigpO1xuICAgIH1cblxuICAgIHJldHVybiBmbGF0dGVuKGFsbEl0ZXJhdG9ycyk7XG4gIH07XG5cbiAgY29uc3QgaXRlcmF0b3JzQXJyYXkgPSBhd2FpdCB0cmF2ZXJzZUZvckl0ZXJhdGVyYXRvcnMoKTtcbiAgbGV0IGN1cnJlbnRJdGVyYXRvckluZGV4ID0gMDtcbiAgcmV0dXJuIGFzeW5jICgpID0+IHtcbiAgICBpZiAoaXRlcmF0b3JzQXJyYXkubGVuZ3RoID09PSAwKSB7IHJldHVybiB7IGRvbmU6IHRydWUsIHJlc3VsdDogW10gfTsgfVxuICAgIGNvbnN0IGlubmVyUmVzdWx0ID0gYXdhaXQgaXRlcmF0b3JzQXJyYXlbY3VycmVudEl0ZXJhdG9ySW5kZXhdKCk7XG4gICAgaWYgKCFpbm5lclJlc3VsdC5kb25lKSB7IHJldHVybiBpbm5lclJlc3VsdDsgfVxuICAgIGlmIChjdXJyZW50SXRlcmF0b3JJbmRleCA9PSBpdGVyYXRvcnNBcnJheS5sZW5ndGggLSAxKSB7XG4gICAgICByZXR1cm4geyBkb25lOiB0cnVlLCByZXN1bHQ6IGlubmVyUmVzdWx0LnJlc3VsdCB9O1xuICAgIH1cbiAgICBjdXJyZW50SXRlcmF0b3JJbmRleCsrO1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCByZXN1bHQ6IGlubmVyUmVzdWx0LnJlc3VsdCB9O1xuICB9O1xufTtcblxuXG5leHBvcnQgZGVmYXVsdCBnZXRBbGxJZHNJdGVyYXRvcjtcbiIsImltcG9ydCB7IFxuICBnZXRFeGFjdE5vZGVGb3JLZXksIGdldEFjdHVhbEtleU9mUGFyZW50LCBcbiAgaXNSb290LCBpc1NpbmdsZVJlY29yZCwgZ2V0Tm9kZUZvckNvbGxlY3Rpb25QYXRoXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xucmVkdWNlLCBmaW5kLCBmaWx0ZXIsIHRha2Vcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4kLCBnZXRGaWxlRnJvbUtleSwgam9pbktleSwgc2FmZUtleSwga2V5U2VwXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBcbiAgICBmb2xkZXJTdHJ1Y3R1cmVBcnJheSwgYWxsSWRDaGFycyBcbn0gZnJvbSBcIi4uL2luZGV4aW5nL2FsbElkc1wiO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkSW5mbyA9IChoaWVyYXJjaHksIGtleSkgPT4ge1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yS2V5KGhpZXJhcmNoeSkoa2V5KTtcbiAgY29uc3QgcGF0aEluZm8gPSBnZXRSZWNvcmREaXJlY3RvcnkocmVjb3JkTm9kZSwga2V5KTtcbiAgY29uc3QgZGlyID0gam9pbktleShwYXRoSW5mby5iYXNlLCAuLi5wYXRoSW5mby5zdWJkaXJzKTtcblxuICByZXR1cm4ge1xuICAgIHJlY29yZEpzb246IHJlY29yZEpzb24oZGlyKSxcbiAgICBmaWxlczogZmlsZXMoZGlyKSxcbiAgICBjaGlsZDoobmFtZSkgPT4gam9pbktleShkaXIsIG5hbWUpLFxuICAgIGtleTogc2FmZUtleShrZXkpLFxuICAgIHJlY29yZE5vZGUsIHBhdGhJbmZvLCBkaXJcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IGdldENvbGxlY3Rpb25EaXIgPSAoaGllcmFyY2h5LCBjb2xsZWN0aW9uS2V5KSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoaGllcmFyY2h5KShjb2xsZWN0aW9uS2V5KTtcbiAgY29uc3QgZHVtbXlSZWNvcmRLZXkgPSBqb2luS2V5KGNvbGxlY3Rpb25LZXksIFwiMS1hYmNkXCIpO1xuICBjb25zdCBwYXRoSW5mbyA9IGdldFJlY29yZERpcmVjdG9yeShyZWNvcmROb2RlLCBkdW1teVJlY29yZEtleSk7XG4gIHJldHVybiBwYXRoSW5mby5iYXNlO1xufVxuXG5jb25zdCByZWNvcmRKc29uID0gKGRpcikgPT4gXG4gIGpvaW5LZXkoZGlyLCBcInJlY29yZC5qc29uXCIpXG5cbmNvbnN0IGZpbGVzID0gKGRpcikgPT4gXG4gIGpvaW5LZXkoZGlyLCBcImZpbGVzXCIpXG5cbmNvbnN0IGdldFJlY29yZERpcmVjdG9yeSA9IChyZWNvcmROb2RlLCBrZXkpID0+IHtcbiAgY29uc3QgaWQgPSBnZXRGaWxlRnJvbUtleShrZXkpO1xuICBcbiAgY29uc3QgdHJhdmVyc2VQYXJlbnRLZXlzID0gKG4sIHBhcmVudHM9W10pID0+IHtcbiAgICBpZihpc1Jvb3QobikpIHJldHVybiBwYXJlbnRzO1xuICAgIGNvbnN0IGsgPSBnZXRBY3R1YWxLZXlPZlBhcmVudChuLm5vZGVLZXkoKSwga2V5KTtcbiAgICBjb25zdCB0aGlzTm9kZURpciA9IHtcbiAgICAgIG5vZGU6bixcbiAgICAgIHJlbGF0aXZlRGlyOiBqb2luS2V5KFxuICAgICAgICByZWNvcmRSZWxhdGl2ZURpcmVjdG9yeShuLCBnZXRGaWxlRnJvbUtleShrKSkpXG4gICAgfTtcbiAgICByZXR1cm4gdHJhdmVyc2VQYXJlbnRLZXlzKFxuICAgICAgbi5wYXJlbnQoKSwgXG4gICAgICBbdGhpc05vZGVEaXIsIC4uLnBhcmVudHNdKTtcbiAgfVxuXG4gIGNvbnN0IHBhcmVudERpcnMgPSAkKHJlY29yZE5vZGUucGFyZW50KCksIFtcbiAgICB0cmF2ZXJzZVBhcmVudEtleXMsXG4gICAgcmVkdWNlKChrZXksIGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBqb2luS2V5KGtleSwgaXRlbS5ub2RlLmNvbGxlY3Rpb25OYW1lLCBpdGVtLnJlbGF0aXZlRGlyKVxuICAgIH0sIGtleVNlcClcbiAgXSk7XG5cbiAgY29uc3Qgc3ViZGlycyA9IGlzU2luZ2xlUmVjb3JkKHJlY29yZE5vZGUpXG4gICAgICAgICAgICAgICAgICA/IFtdXG4gICAgICAgICAgICAgICAgICA6IHJlY29yZFJlbGF0aXZlRGlyZWN0b3J5KHJlY29yZE5vZGUsIGlkKTtcbiAgY29uc3QgYmFzZSA9IGlzU2luZ2xlUmVjb3JkKHJlY29yZE5vZGUpXG4gICAgICAgICAgICAgICA/IGpvaW5LZXkocGFyZW50RGlycywgcmVjb3JkTm9kZS5uYW1lKVxuICAgICAgICAgICAgICAgOiBqb2luS2V5KHBhcmVudERpcnMsIHJlY29yZE5vZGUuY29sbGVjdGlvbk5hbWUpO1xuXG4gIHJldHVybiAoe1xuICAgIHN1YmRpcnMsIGJhc2VcbiAgfSk7XG59XG5cbmNvbnN0IHJlY29yZFJlbGF0aXZlRGlyZWN0b3J5ID0gKHJlY29yZE5vZGUsIGlkKSA9PiB7XG4gIGNvbnN0IGZvbGRlclN0cnVjdHVyZSA9IGZvbGRlclN0cnVjdHVyZUFycmF5KHJlY29yZE5vZGUpO1xuICBjb25zdCBzdHJpcHBlZElkID0gaWQuc3Vic3RyaW5nKHJlY29yZE5vZGUubm9kZUlkLnRvU3RyaW5nKCkubGVuZ3RoICsgMSk7XG4gIGNvbnN0IHN1YmZvbGRlcnMgPSAkKGZvbGRlclN0cnVjdHVyZSwgW1xuICAgIHJlZHVjZSgocmVzdWx0LCBjdXJyZW50Q291bnQpID0+IHtcbiAgICAgIHJlc3VsdC5mb2xkZXJzLnB1c2goXG4gICAgICAgICAgZm9sZGVyRm9yQ2hhcihzdHJpcHBlZElkW3Jlc3VsdC5sZXZlbF0sIGN1cnJlbnRDb3VudClcbiAgICAgICk7XG4gICAgICByZXR1cm4ge2xldmVsOnJlc3VsdC5sZXZlbCsxLCBmb2xkZXJzOnJlc3VsdC5mb2xkZXJzfTtcbiAgICB9LCB7bGV2ZWw6MCwgZm9sZGVyczpbXX0pLFxuICAgIGYgPT4gZi5mb2xkZXJzLFxuICAgIGZpbHRlcihmID0+ICEhZilcbiAgXSk7XG5cbiAgcmV0dXJuIFtyZWNvcmROb2RlLm5vZGVJZC50b1N0cmluZygpLCAuLi5zdWJmb2xkZXJzLCBpZF1cbn1cblxuY29uc3QgZm9sZGVyRm9yQ2hhciA9IChjaGFyLCBmb2xkZXJDb3VudCkgPT4gXG4gIGZvbGRlckNvdW50ID09PSAxID8gXCJcIlxuICA6ICQoZm9sZGVyQ291bnQsIFtcbiAgICAgIGlkRm9sZGVyc0ZvckZvbGRlckNvdW50LFxuICAgICAgZmluZChmID0+IGYuaW5jbHVkZXMoY2hhcikpXG4gICAgXSk7XG5cbmNvbnN0IGlkRm9sZGVyc0ZvckZvbGRlckNvdW50ID0gKGZvbGRlckNvdW50KSA9PiB7XG4gIGNvbnN0IGNoYXJSYW5nZVBlclNoYXJkID0gNjQgLyBmb2xkZXJDb3VudDtcbiAgY29uc3QgaWRGb2xkZXJzID0gW107XG4gIGxldCBpbmRleCA9IDA7XG4gIGxldCBjdXJyZW50SWRzU2hhcmQgPSAnJztcbiAgd2hpbGUgKGluZGV4IDwgNjQpIHtcbiAgICBjdXJyZW50SWRzU2hhcmQgKz0gYWxsSWRDaGFyc1tpbmRleF07XG4gICAgaWYgKChpbmRleCArIDEpICUgY2hhclJhbmdlUGVyU2hhcmQgPT09IDApIHtcbiAgICAgIGlkRm9sZGVycy5wdXNoKGN1cnJlbnRJZHNTaGFyZCk7XG4gICAgICBjdXJyZW50SWRzU2hhcmQgPSAnJztcbiAgICB9XG4gICAgaW5kZXgrKztcbiAgfVxuICAgIFxuICAgIHJldHVybiBpZEZvbGRlcnM7XG59O1xuXG4iLCJpbXBvcnQge1xuICBrZXlCeSwgbWFwVmFsdWVzLCBmaWx0ZXIsIFxuICBtYXAsIGluY2x1ZGVzLCBsYXN0LFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2V0RXhhY3ROb2RlRm9yS2V5LCBnZXROb2RlIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IHNhZmVQYXJzZUZpZWxkIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtcbiAgJCwgc3BsaXRLZXksIHNhZmVLZXksIGlzTm9uRW1wdHlTdHJpbmcsXG4gIGFwaVdyYXBwZXIsIGV2ZW50cywgam9pbktleSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IG1hcFJlY29yZCB9IGZyb20gJy4uL2luZGV4aW5nL2V2YWx1YXRlJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IGdldFJlY29yZEluZm8gfSBmcm9tIFwiLi9yZWNvcmRJbmZvXCI7XG5cbmV4cG9ydCBjb25zdCBnZXRSZWNvcmRGaWxlTmFtZSA9IGtleSA9PiBqb2luS2V5KGtleSwgJ3JlY29yZC5qc29uJyk7XG5cbmV4cG9ydCBjb25zdCBsb2FkID0gYXBwID0+IGFzeW5jIGtleSA9PiB7XG4gIGtleSA9IHNhZmVLZXkoa2V5KTtcbiAgcmV0dXJuIGFwaVdyYXBwZXIoXG4gICAgYXBwLFxuICAgIGV2ZW50cy5yZWNvcmRBcGkubG9hZCxcbiAgICBwZXJtaXNzaW9uLnJlYWRSZWNvcmQuaXNBdXRob3JpemVkKGtleSksXG4gICAgeyBrZXkgfSxcbiAgICBfbG9hZCwgYXBwLCBrZXksXG4gICk7XG59XG5cbmV4cG9ydCBjb25zdCBfbG9hZEZyb21JbmZvID0gYXN5bmMgKGFwcCwgcmVjb3JkSW5mbywga2V5U3RhY2sgPSBbXSkgPT4ge1xuICBjb25zdCBrZXkgPSByZWNvcmRJbmZvLmtleTtcbiAgY29uc3Qge3JlY29yZE5vZGUsIHJlY29yZEpzb259ID0gcmVjb3JkSW5mbztcbiAgY29uc3Qgc3RvcmVkRGF0YSA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24ocmVjb3JkSnNvbik7XG5cbiAgY29uc3QgbG9hZGVkUmVjb3JkID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICAgIGtleUJ5KCduYW1lJyksXG4gICAgbWFwVmFsdWVzKGYgPT4gc2FmZVBhcnNlRmllbGQoZiwgc3RvcmVkRGF0YSkpLFxuICBdKTtcblxuICBjb25zdCBuZXdLZXlTdGFjayA9IFsuLi5rZXlTdGFjaywga2V5XTtcblxuICBjb25zdCByZWZlcmVuY2VzID0gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICAgIGZpbHRlcihmID0+IGYudHlwZSA9PT0gJ3JlZmVyZW5jZSdcbiAgICAgICAgICAgICAgICAgICAgJiYgaXNOb25FbXB0eVN0cmluZyhsb2FkZWRSZWNvcmRbZi5uYW1lXS5rZXkpXG4gICAgICAgICAgICAgICAgICAgICYmICFpbmNsdWRlcyhsb2FkZWRSZWNvcmRbZi5uYW1lXS5rZXkpKG5ld0tleVN0YWNrKSksXG4gICAgbWFwKGYgPT4gKHtcbiAgICAgIHByb21pc2U6IF9sb2FkKGFwcCwgbG9hZGVkUmVjb3JkW2YubmFtZV0ua2V5LCBuZXdLZXlTdGFjayksXG4gICAgICBpbmRleDogZ2V0Tm9kZShhcHAuaGllcmFyY2h5LCBmLnR5cGVPcHRpb25zLmluZGV4Tm9kZUtleSksXG4gICAgICBmaWVsZDogZixcbiAgICB9KSksXG4gIF0pO1xuXG4gIGlmIChyZWZlcmVuY2VzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCByZWZSZWNvcmRzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICBtYXAocCA9PiBwLnByb21pc2UpKHJlZmVyZW5jZXMpLFxuICAgICk7XG5cbiAgICBmb3IgKGNvbnN0IHJlZiBvZiByZWZlcmVuY2VzKSB7XG4gICAgICBsb2FkZWRSZWNvcmRbcmVmLmZpZWxkLm5hbWVdID0gbWFwUmVjb3JkKFxuICAgICAgICByZWZSZWNvcmRzW3JlZmVyZW5jZXMuaW5kZXhPZihyZWYpXSxcbiAgICAgICAgcmVmLmluZGV4LFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBsb2FkZWRSZWNvcmQudHJhbnNhY3Rpb25JZCA9IHN0b3JlZERhdGEudHJhbnNhY3Rpb25JZDtcbiAgbG9hZGVkUmVjb3JkLmlzTmV3ID0gZmFsc2U7XG4gIGxvYWRlZFJlY29yZC5rZXkgPSBrZXk7XG4gIGxvYWRlZFJlY29yZC5pZCA9ICQoa2V5LCBbc3BsaXRLZXksIGxhc3RdKTtcbiAgbG9hZGVkUmVjb3JkLnR5cGUgPSByZWNvcmROb2RlLm5hbWU7XG4gIHJldHVybiBsb2FkZWRSZWNvcmQ7XG59O1xuXG5leHBvcnQgY29uc3QgX2xvYWQgPSBhc3luYyAoYXBwLCBrZXksIGtleVN0YWNrID0gW10pID0+IFxuICBfbG9hZEZyb21JbmZvKFxuICAgIGFwcCxcbiAgICBnZXRSZWNvcmRJbmZvKGFwcC5oaWVyYXJjaHksIGtleSksXG4gICAga2V5U3RhY2spO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGxvYWQ7XG4iLCIvLyBhZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2RleDRlci9qcy1wcm9taXNlLXJlYWRhYmxlXG4vLyB0aGFua3MgOilcbiAgXG5leHBvcnQgY29uc3QgcHJvbWlzZVJlYWRhYmxlU3RyZWFtID0gc3RyZWFtID0+IHtcbiAgIFxuICAgIGxldCBfZXJyb3JlZDtcblxuICAgIGNvbnN0IF9lcnJvckhhbmRsZXIgPSBlcnIgPT4ge1xuICAgICAgICBfZXJyb3JlZCA9IGVycjtcbiAgICB9O1xuXG4gICAgc3RyZWFtLm9uKFwiZXJyb3JcIiwgX2Vycm9ySGFuZGxlcik7XG4gIFxuICAgIGNvbnN0IHJlYWQgPSAoc2l6ZSkgPT4ge1xuICBcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGlmIChfZXJyb3JlZCkge1xuICAgICAgICAgIGNvbnN0IGVyciA9IF9lcnJvcmVkO1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgICB9XG4gIFxuICAgICAgICBpZiAoIXN0cmVhbS5yZWFkYWJsZSB8fCBzdHJlYW0uY2xvc2VkIHx8IHN0cmVhbS5kZXN0cm95ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBjb25zdCByZWFkYWJsZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY2h1bmsgPSBzdHJlYW0ucmVhZChzaXplKTtcbiAgXG4gICAgICAgICAgaWYgKGNodW5rKSB7XG4gICAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHJlc29sdmUoY2h1bmspO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgY2xvc2VIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgZW5kSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IChlcnIpID0+IHtcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgcmVtb3ZlTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImNsb3NlXCIsIGNsb3NlSGFuZGxlcik7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlbmRcIiwgZW5kSGFuZGxlcik7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwicmVhZGFibGVcIiwgcmVhZGFibGVIYW5kbGVyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgc3RyZWFtLm9uKFwiY2xvc2VcIiwgY2xvc2VIYW5kbGVyKTtcbiAgICAgICAgc3RyZWFtLm9uKFwiZW5kXCIsIGVuZEhhbmRsZXIpO1xuICAgICAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xuICAgICAgICBzdHJlYW0ub24oXCJyZWFkYWJsZVwiLCByZWFkYWJsZUhhbmRsZXIpO1xuICBcbiAgICAgICAgcmVhZGFibGVIYW5kbGVyKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIFxuICBcbiAgICBjb25zdCBkZXN0cm95ID0gKCkgPT4ge1xuICAgICAgaWYgKHN0cmVhbSkge1xuICAgICAgICBpZiAoX2Vycm9ySGFuZGxlcikge1xuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIF9lcnJvckhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygc3RyZWFtLmRlc3Ryb3kgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHN0cmVhbS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICBcbiAgICByZXR1cm4ge3JlYWQsIGRlc3Ryb3ksIHN0cmVhbX07XG4gIH1cbiAgXG4gIGV4cG9ydCBkZWZhdWx0IHByb21pc2VSZWFkYWJsZVN0cmVhbVxuICAiLCJpbXBvcnQgeyBjb21waWxlQ29kZSB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCB7XG4gIGZpbHRlciwgaW5jbHVkZXMsIG1hcCwgbGFzdCxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIGdldEFjdHVhbEtleU9mUGFyZW50LCBpc0dsb2JhbEluZGV4LFxuICBnZXRQYXJlbnRLZXksIGlzU2hhcmRlZEluZGV4LFxuICBnZXRFeGFjdE5vZGVGb3JLZXksXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xuICBqb2luS2V5LCBpc05vbkVtcHR5U3RyaW5nLCBzcGxpdEtleSwgJCxcbn0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4ZWREYXRhS2V5ID0gKGluZGV4Tm9kZSwgaW5kZXhEaXIsIHJlY29yZCkgPT4ge1xuICBcbiAgY29uc3QgZ2V0U2hhcmROYW1lID0gKGluZGV4Tm9kZSwgcmVjb3JkKSA9PiB7XG4gICAgY29uc3Qgc2hhcmROYW1lRnVuYyA9IGNvbXBpbGVDb2RlKGluZGV4Tm9kZS5nZXRTaGFyZE5hbWUpO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gc2hhcmROYW1lRnVuYyh7IHJlY29yZCB9KTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGNvbnN0IGVycm9yRGV0YWlscyA9IGBzaGFyZENvZGU6ICR7aW5kZXhOb2RlLmdldFNoYXJkTmFtZX0gOjogcmVjb3JkOiAke0pTT04uc3RyaW5naWZ5KHJlY29yZCl9IDo6IGBcbiAgICAgIGUubWVzc2FnZSA9IFwiRXJyb3IgcnVubmluZyBpbmRleCBzaGFyZG5hbWUgZnVuYzogXCIgKyBlcnJvckRldGFpbHMgKyBlLm1lc3NhZ2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBzaGFyZE5hbWUgPSBpc05vbkVtcHR5U3RyaW5nKGluZGV4Tm9kZS5nZXRTaGFyZE5hbWUpXG4gICAgPyBgJHtnZXRTaGFyZE5hbWUoaW5kZXhOb2RlLCByZWNvcmQpfS5jc3ZgXG4gICAgOiAnaW5kZXguY3N2JztcblxuICByZXR1cm4gam9pbktleShpbmRleERpciwgc2hhcmROYW1lKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRTaGFyZEtleXNJblJhbmdlID0gYXN5bmMgKGFwcCwgaW5kZXhOb2RlLCBpbmRleERpciwgc3RhcnRSZWNvcmQgPSBudWxsLCBlbmRSZWNvcmQgPSBudWxsKSA9PiB7XG4gIGNvbnN0IHN0YXJ0U2hhcmROYW1lID0gIXN0YXJ0UmVjb3JkXG4gICAgPyBudWxsXG4gICAgOiBzaGFyZE5hbWVGcm9tS2V5KFxuICAgICAgZ2V0SW5kZXhlZERhdGFLZXkoXG4gICAgICAgIGluZGV4Tm9kZSxcbiAgICAgICAgaW5kZXhEaXIsXG4gICAgICAgIHN0YXJ0UmVjb3JkLFxuICAgICAgKSxcbiAgICApO1xuXG4gIGNvbnN0IGVuZFNoYXJkTmFtZSA9ICFlbmRSZWNvcmRcbiAgICA/IG51bGxcbiAgICA6IHNoYXJkTmFtZUZyb21LZXkoXG4gICAgICBnZXRJbmRleGVkRGF0YUtleShcbiAgICAgICAgaW5kZXhOb2RlLFxuICAgICAgICBpbmRleERpcixcbiAgICAgICAgZW5kUmVjb3JkLFxuICAgICAgKSxcbiAgICApO1xuXG4gIHJldHVybiAkKGF3YWl0IGdldFNoYXJkTWFwKGFwcC5kYXRhc3RvcmUsIGluZGV4RGlyKSwgW1xuICAgIGZpbHRlcihrID0+IChzdGFydFJlY29yZCA9PT0gbnVsbCB8fCBrID49IHN0YXJ0U2hhcmROYW1lKVxuICAgICAgICAgICAgICAgICAgICAmJiAoZW5kUmVjb3JkID09PSBudWxsIHx8IGsgPD0gZW5kU2hhcmROYW1lKSksXG4gICAgbWFwKGsgPT4gam9pbktleShpbmRleERpciwgYCR7a30uY3N2YCkpLFxuICBdKTtcbn07XG5cbmV4cG9ydCBjb25zdCBlbnN1cmVTaGFyZE5hbWVJc0luU2hhcmRNYXAgPSBhc3luYyAoc3RvcmUsIGluZGV4RGlyLCBpbmRleGVkRGF0YUtleSkgPT4ge1xuICBjb25zdCBtYXAgPSBhd2FpdCBnZXRTaGFyZE1hcChzdG9yZSwgaW5kZXhEaXIpO1xuICBjb25zdCBzaGFyZE5hbWUgPSBzaGFyZE5hbWVGcm9tS2V5KGluZGV4ZWREYXRhS2V5KTtcbiAgaWYgKCFpbmNsdWRlcyhzaGFyZE5hbWUpKG1hcCkpIHtcbiAgICBtYXAucHVzaChzaGFyZE5hbWUpO1xuICAgIGF3YWl0IHdyaXRlU2hhcmRNYXAoc3RvcmUsIGluZGV4RGlyLCBtYXApO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U2hhcmRNYXAgPSBhc3luYyAoZGF0YXN0b3JlLCBpbmRleERpcikgPT4ge1xuICBjb25zdCBzaGFyZE1hcEtleSA9IGdldFNoYXJkTWFwS2V5KGluZGV4RGlyKTtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgZGF0YXN0b3JlLmxvYWRKc29uKHNoYXJkTWFwS2V5KTtcbiAgfSBjYXRjaCAoXykge1xuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKHNoYXJkTWFwS2V5LCBbXSk7XG4gICAgcmV0dXJuIFtdO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3Qgd3JpdGVTaGFyZE1hcCA9IGFzeW5jIChkYXRhc3RvcmUsIGluZGV4RGlyLCBzaGFyZE1hcCkgPT4gYXdhaXQgZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gIGdldFNoYXJkTWFwS2V5KGluZGV4RGlyKSxcbiAgc2hhcmRNYXAsXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsU2hhcmRLZXlzID0gYXN5bmMgKGFwcCwgaW5kZXhOb2RlLCBpbmRleERpcikgPT5cbiAgYXdhaXQgZ2V0U2hhcmRLZXlzSW5SYW5nZShhcHAsIGluZGV4Tm9kZSwgaW5kZXhEaXIpO1xuXG5leHBvcnQgY29uc3QgZ2V0U2hhcmRNYXBLZXkgPSBpbmRleERpciA9PiBqb2luS2V5KGluZGV4RGlyLCAnc2hhcmRNYXAuanNvbicpO1xuXG5leHBvcnQgY29uc3QgZ2V0VW5zaGFyZGVkSW5kZXhEYXRhS2V5ID0gaW5kZXhEaXIgPT4gam9pbktleShpbmRleERpciwgJ2luZGV4LmNzdicpO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlSW5kZXhGaWxlID0gYXN5bmMgKGRhdGFzdG9yZSwgaW5kZXhlZERhdGFLZXksIGluZGV4KSA9PiB7XG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleCkpIHtcbiAgICBjb25zdCBpbmRleERpciA9IGdldFBhcmVudEtleShpbmRleGVkRGF0YUtleSk7XG4gICAgY29uc3Qgc2hhcmRNYXAgPSBhd2FpdCBnZXRTaGFyZE1hcChkYXRhc3RvcmUsIGluZGV4RGlyKTtcbiAgICBzaGFyZE1hcC5wdXNoKFxuICAgICAgc2hhcmROYW1lRnJvbUtleShpbmRleGVkRGF0YUtleSksXG4gICAgKTtcbiAgICBhd2FpdCB3cml0ZVNoYXJkTWFwKGRhdGFzdG9yZSwgaW5kZXhEaXIsIHNoYXJkTWFwKTtcbiAgfVxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRmlsZShpbmRleGVkRGF0YUtleSwgJycpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNoYXJkTmFtZUZyb21LZXkgPSBrZXkgPT4gJChrZXksIFtcbiAgc3BsaXRLZXksXG4gIGxhc3QsXG5dKS5yZXBsYWNlKCcuY3N2JywgJycpO1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhLZXlfQmFzZWRPbkRlY2VuZGFudCA9IChkZWNlbmRhbnRLZXksIGluZGV4Tm9kZSkgPT4ge1xuICBpZiAoaXNHbG9iYWxJbmRleChpbmRleE5vZGUpKSB7IHJldHVybiBgJHtpbmRleE5vZGUubm9kZUtleSgpfWA7IH1cblxuICBjb25zdCBpbmRleGVkRGF0YVBhcmVudEtleSA9IGdldEFjdHVhbEtleU9mUGFyZW50KFxuICAgIGluZGV4Tm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksXG4gICAgZGVjZW5kYW50S2V5LFxuICApO1xuXG4gIHJldHVybiBqb2luS2V5KFxuICAgIGluZGV4ZWREYXRhUGFyZW50S2V5LFxuICAgIGluZGV4Tm9kZS5uYW1lLFxuICApO1xufTtcbiIsImltcG9ydCB7XG4gIGhhcywga2V5cywgbWFwLCBvcmRlckJ5LFxuICBmaWx0ZXIsIGNvbmNhdCwgcmV2ZXJzZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IG1hcFJlY29yZCB9IGZyb20gJy4vZXZhbHVhdGUnO1xuaW1wb3J0IHsgY29uc3RydWN0UmVjb3JkIH0gZnJvbSAnLi4vcmVjb3JkQXBpL2dldE5ldyc7XG5pbXBvcnQgeyBnZXRTYW1wbGVGaWVsZFZhbHVlLCBkZXRlY3RUeXBlLCBhbGwgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlU2NoZW1hID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlKSA9PiB7XG4gIGNvbnN0IHJlY29yZE5vZGVzID0gZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgoaGllcmFyY2h5LCBpbmRleE5vZGUpO1xuICBjb25zdCBtYXBwZWRSZWNvcmRzID0gJChyZWNvcmROb2RlcywgW1xuICAgIG1hcChuID0+IG1hcFJlY29yZChjcmVhdGVTYW1wbGVSZWNvcmQobiksIGluZGV4Tm9kZSkpLFxuICBdKTtcblxuICAvLyBhbHdheXMgaGFzIHJlY29yZCBrZXkgYW5kIHNvcnQga2V5XG4gIGNvbnN0IHNjaGVtYSA9IHtcbiAgICBzb3J0S2V5OiBhbGwuc3RyaW5nLFxuICAgIGtleTogYWxsLnN0cmluZyxcbiAgfTtcblxuICBjb25zdCBmaWVsZHNIYXMgPSBoYXMoc2NoZW1hKTtcbiAgY29uc3Qgc2V0RmllbGQgPSAoZmllbGROYW1lLCB2YWx1ZSkgPT4ge1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgdGhpc1R5cGUgPSBkZXRlY3RUeXBlKHZhbHVlKTtcbiAgICBpZiAoZmllbGRzSGFzKGZpZWxkTmFtZSkpIHtcbiAgICAgIGlmIChzY2hlbWFbZmllbGROYW1lXSAhPT0gdGhpc1R5cGUpIHtcbiAgICAgICAgc2NoZW1hW2ZpZWxkTmFtZV0gPSBhbGwuc3RyaW5nO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzY2hlbWFbZmllbGROYW1lXSA9IHRoaXNUeXBlO1xuICAgIH1cbiAgfTtcblxuICBmb3IgKGNvbnN0IG1hcHBlZFJlYyBvZiBtYXBwZWRSZWNvcmRzKSB7XG4gICAgZm9yIChjb25zdCBmIGluIG1hcHBlZFJlYykge1xuICAgICAgc2V0RmllbGQoZiwgbWFwcGVkUmVjW2ZdKTtcbiAgICB9XG4gIH1cblxuICAvLyByZXR1cmluZyBhbiBhcnJheSBvZiB7bmFtZSwgdHlwZX1cbiAgcmV0dXJuICQoc2NoZW1hLCBbXG4gICAga2V5cyxcbiAgICBtYXAoayA9PiAoeyBuYW1lOiBrLCB0eXBlOiBzY2hlbWFba10ubmFtZSB9KSksXG4gICAgZmlsdGVyKHMgPT4gcy5uYW1lICE9PSAnc29ydEtleScpLFxuICAgIG9yZGVyQnkoJ25hbWUnLCBbJ2Rlc2MnXSksIC8vIHJldmVyc2UgYXBsaGFcbiAgICBjb25jYXQoW3sgbmFtZTogJ3NvcnRLZXknLCB0eXBlOiBhbGwuc3RyaW5nLm5hbWUgfV0pLCAvLyBzb3J0S2V5IG9uIGVuZFxuICAgIHJldmVyc2UsIC8vIHNvcnRLZXkgZmlyc3QsIHRoZW4gcmVzdCBhcmUgYWxwaGFiZXRpY2FsXG4gIF0pO1xufTtcblxuY29uc3QgY3JlYXRlU2FtcGxlUmVjb3JkID0gcmVjb3JkTm9kZSA9PiBjb25zdHJ1Y3RSZWNvcmQoXG4gIHJlY29yZE5vZGUsXG4gIGdldFNhbXBsZUZpZWxkVmFsdWUsXG4gIHJlY29yZE5vZGUucGFyZW50KCkubm9kZUtleSgpLFxuKTtcbiIsImV4cG9ydCBkZWZhdWx0ICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDpcbiAgICAgICAgICAgIHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6XG4gICAgICAgICAgICB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pO1xuIiwiXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxudmFyIGluaXRlZCA9IGZhbHNlO1xuZnVuY3Rpb24gaW5pdCAoKSB7XG4gIGluaXRlZCA9IHRydWU7XG4gIHZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2RlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgbG9va3VwW2ldID0gY29kZVtpXVxuICAgIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxuICB9XG5cbiAgcmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG4gIHJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICBpZiAoIWluaXRlZCkge1xuICAgIGluaXQoKTtcbiAgfVxuICB2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXG4gIGlmIChsZW4gJSA0ID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG4gIH1cblxuICAvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuICAvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG4gIC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuICAvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcbiAgLy8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuICBwbGFjZUhvbGRlcnMgPSBiNjRbbGVuIC0gMl0gPT09ICc9JyA/IDIgOiBiNjRbbGVuIC0gMV0gPT09ICc9JyA/IDEgOiAwXG5cbiAgLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG4gIGFyciA9IG5ldyBBcnIobGVuICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cbiAgLy8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuICBsID0gcGxhY2VIb2xkZXJzID4gMCA/IGxlbiAtIDQgOiBsZW5cblxuICB2YXIgTCA9IDBcblxuICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTgpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDEyKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8IHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMyldXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDE2KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxMCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgNCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDYgJiAweDNGXSArIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG4gICAgb3V0cHV0LnB1c2godHJpcGxldFRvQmFzZTY0KHRtcCkpXG4gIH1cbiAgcmV0dXJuIG91dHB1dC5qb2luKCcnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgaWYgKCFpbml0ZWQpIHtcbiAgICBpbml0KCk7XG4gIH1cbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgb3V0cHV0ID0gJydcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayh1aW50OCwgaSwgKGkgKyBtYXhDaHVua0xlbmd0aCkgPiBsZW4yID8gbGVuMiA6IChpICsgbWF4Q2h1bmtMZW5ndGgpKSlcbiAgfVxuXG4gIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcbiAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcbiAgICB0bXAgPSB1aW50OFtsZW4gLSAxXVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDJdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz09J1xuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyAodWludDhbbGVuIC0gMV0pXG4gICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMTBdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXVxuICAgIG91dHB1dCArPSAnPSdcbiAgfVxuXG4gIHBhcnRzLnB1c2gob3V0cHV0KVxuXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gcmVhZCAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cml0ZSAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5leHBvcnQgZGVmYXVsdCBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cblxuaW1wb3J0ICogYXMgYmFzZTY0IGZyb20gJy4vYmFzZTY0J1xuaW1wb3J0ICogYXMgaWVlZTc1NCBmcm9tICcuL2llZWU3NTQnXG5pbXBvcnQgaXNBcnJheSBmcm9tICcuL2lzQXJyYXknXG5cbmV4cG9ydCB2YXIgSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBEdWUgdG8gdmFyaW91cyBicm93c2VyIGJ1Z3MsIHNvbWV0aW1lcyB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uIHdpbGwgYmUgdXNlZCBldmVuXG4gKiB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHR5cGVkIGFycmF5cy5cbiAqXG4gKiBOb3RlOlxuICpcbiAqICAgLSBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsXG4gKiAgICAgU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzguXG4gKlxuICogICAtIENocm9tZSA5LTEwIGlzIG1pc3NpbmcgdGhlIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24uXG4gKlxuICogICAtIElFMTAgaGFzIGEgYnJva2VuIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhcnJheXMgb2ZcbiAqICAgICBpbmNvcnJlY3QgbGVuZ3RoIGluIHNvbWUgc2l0dWF0aW9ucy5cblxuICogV2UgZGV0ZWN0IHRoZXNlIGJ1Z2d5IGJyb3dzZXJzIGFuZCBzZXQgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYCB0byBgZmFsc2VgIHNvIHRoZXlcbiAqIGdldCB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uLCB3aGljaCBpcyBzbG93ZXIgYnV0IGJlaGF2ZXMgY29ycmVjdGx5LlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUICE9PSB1bmRlZmluZWRcbiAgPyBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVFxuICA6IHRydWVcblxuLypcbiAqIEV4cG9ydCBrTWF4TGVuZ3RoIGFmdGVyIHR5cGVkIGFycmF5IHN1cHBvcnQgaXMgZGV0ZXJtaW5lZC5cbiAqL1xudmFyIF9rTWF4TGVuZ3RoID0ga01heExlbmd0aCgpXG5leHBvcnQge19rTWF4TGVuZ3RoIGFzIGtNYXhMZW5ndGh9O1xuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICByZXR1cm4gdHJ1ZTtcbiAgLy8gcm9sbHVwIGlzc3Vlc1xuICAvLyB0cnkge1xuICAvLyAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAvLyAgIGFyci5fX3Byb3RvX18gPSB7XG4gIC8vICAgICBfX3Byb3RvX186IFVpbnQ4QXJyYXkucHJvdG90eXBlLFxuICAvLyAgICAgZm9vOiBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gIC8vICAgfVxuICAvLyAgIHJldHVybiBhcnIuZm9vKCkgPT09IDQyICYmIC8vIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkXG4gIC8vICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgJiYgLy8gY2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIC8vICAgICAgIGFyci5zdWJhcnJheSgxLCAxKS5ieXRlTGVuZ3RoID09PSAwIC8vIGllMTAgaGFzIGJyb2tlbiBgc3ViYXJyYXlgXG4gIC8vIH0gY2F0Y2ggKGUpIHtcbiAgLy8gICByZXR1cm4gZmFsc2VcbiAgLy8gfVxufVxuXG5mdW5jdGlvbiBrTWF4TGVuZ3RoICgpIHtcbiAgcmV0dXJuIEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gICAgPyAweDdmZmZmZmZmXG4gICAgOiAweDNmZmZmZmZmXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAodGhhdCwgbGVuZ3RoKSB7XG4gIGlmIChrTWF4TGVuZ3RoKCkgPCBsZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCB0eXBlZCBhcnJheSBsZW5ndGgnKVxuICB9XG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoYXQgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIGlmICh0aGF0ID09PSBudWxsKSB7XG4gICAgICB0aGF0ID0gbmV3IEJ1ZmZlcihsZW5ndGgpXG4gICAgfVxuICAgIHRoYXQubGVuZ3RoID0gbGVuZ3RoXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgaGF2ZSB0aGVpclxuICogcHJvdG90eXBlIGNoYW5nZWQgdG8gYEJ1ZmZlci5wcm90b3R5cGVgLiBGdXJ0aGVybW9yZSwgYEJ1ZmZlcmAgaXMgYSBzdWJjbGFzcyBvZlxuICogYFVpbnQ4QXJyYXlgLCBzbyB0aGUgcmV0dXJuZWQgaW5zdGFuY2VzIHdpbGwgaGF2ZSBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgbWV0aG9kc1xuICogYW5kIHRoZSBgVWludDhBcnJheWAgbWV0aG9kcy4gU3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXRcbiAqIHJldHVybnMgYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogVGhlIGBVaW50OEFycmF5YCBwcm90b3R5cGUgcmVtYWlucyB1bm1vZGlmaWVkLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiYgISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIGlmICh0eXBlb2YgZW5jb2RpbmdPck9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0lmIGVuY29kaW5nIGlzIHNwZWNpZmllZCB0aGVuIHRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJ1xuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gYWxsb2NVbnNhZmUodGhpcywgYXJnKVxuICB9XG4gIHJldHVybiBmcm9tKHRoaXMsIGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxuLy8gVE9ETzogTGVnYWN5LCBub3QgbmVlZGVkIGFueW1vcmUuIFJlbW92ZSBpbiBuZXh0IG1ham9yIHZlcnNpb24uXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gZnJvbSAodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBhIG51bWJlcicpXG4gIH1cblxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnJvbVN0cmluZyh0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldClcbiAgfVxuXG4gIHJldHVybiBmcm9tT2JqZWN0KHRoYXQsIHZhbHVlKVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIEJ1ZmZlcihhcmcsIGVuY29kaW5nKSBidXQgdGhyb3dzIGEgVHlwZUVycm9yXG4gKiBpZiB2YWx1ZSBpcyBhIG51bWJlci5cbiAqIEJ1ZmZlci5mcm9tKHN0clssIGVuY29kaW5nXSlcbiAqIEJ1ZmZlci5mcm9tKGFycmF5KVxuICogQnVmZmVyLmZyb20oYnVmZmVyKVxuICogQnVmZmVyLmZyb20oYXJyYXlCdWZmZXJbLCBieXRlT2Zmc2V0WywgbGVuZ3RoXV0pXG4gKiovXG5CdWZmZXIuZnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBmcm9tKG51bGwsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbmlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICBCdWZmZXIucHJvdG90eXBlLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXkucHJvdG90eXBlXG4gIEJ1ZmZlci5fX3Byb3RvX18gPSBVaW50OEFycmF5XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wuc3BlY2llcyAmJlxuICAgICAgQnVmZmVyW1N5bWJvbC5zcGVjaWVzXSA9PT0gQnVmZmVyKSB7XG4gICAgLy8gRml4IHN1YmFycmF5KCkgaW4gRVMyMDE2LiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvOTdcbiAgICAvLyBPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLCBTeW1ib2wuc3BlY2llcywge1xuICAgIC8vICAgdmFsdWU6IG51bGwsXG4gICAgLy8gICBjb25maWd1cmFibGU6IHRydWVcbiAgICAvLyB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydFNpemUgKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9IGVsc2UgaWYgKHNpemUgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG5lZ2F0aXZlJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAodGhhdCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXR0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2MobnVsbCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlICh0aGF0LCBzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgKytpKSB7XG4gICAgICB0aGF0W2ldID0gMFxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gQnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gU2xvd0J1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICovXG5CdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHRoYXQsIHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGlmICghQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJlbmNvZGluZ1wiIG11c3QgYmUgYSB2YWxpZCBzdHJpbmcgZW5jb2RpbmcnKVxuICB9XG5cbiAgdmFyIGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuXG4gIHZhciBhY3R1YWwgPSB0aGF0LndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG5cbiAgaWYgKGFjdHVhbCAhPT0gbGVuZ3RoKSB7XG4gICAgLy8gV3JpdGluZyBhIGhleCBzdHJpbmcsIGZvciBleGFtcGxlLCB0aGF0IGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycyB3aWxsXG4gICAgLy8gY2F1c2UgZXZlcnl0aGluZyBhZnRlciB0aGUgZmlyc3QgaW52YWxpZCBjaGFyYWN0ZXIgdG8gYmUgaWdub3JlZC4gKGUuZy5cbiAgICAvLyAnYWJ4eGNkJyB3aWxsIGJlIHRyZWF0ZWQgYXMgJ2FiJylcbiAgICB0aGF0ID0gdGhhdC5zbGljZSgwLCBhY3R1YWwpXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlMaWtlICh0aGF0LCBhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyICh0aGF0LCBhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gIGFycmF5LmJ5dGVMZW5ndGggLy8gdGhpcyB0aHJvd3MgaWYgYGFycmF5YCBpcyBub3QgYSB2YWxpZCBBcnJheUJ1ZmZlclxuXG4gIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdvZmZzZXRcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgKyAobGVuZ3RoIHx8IDApKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ2xlbmd0aFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChieXRlT2Zmc2V0ID09PSB1bmRlZmluZWQgJiYgbGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5KVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldClcbiAgfSBlbHNlIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gYXJyYXlcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgdGhhdCA9IGZyb21BcnJheUxpa2UodGhhdCwgYXJyYXkpXG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAodGhhdCwgb2JqKSB7XG4gIGlmIChpbnRlcm5hbElzQnVmZmVyKG9iaikpIHtcbiAgICB2YXIgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbilcblxuICAgIGlmICh0aGF0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoYXRcbiAgICB9XG5cbiAgICBvYmouY29weSh0aGF0LCAwLCAwLCBsZW4pXG4gICAgcmV0dXJuIHRoYXRcbiAgfVxuXG4gIGlmIChvYmopIHtcbiAgICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgb2JqLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB8fCAnbGVuZ3RoJyBpbiBvYmopIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ251bWJlcicgfHwgaXNuYW4ob2JqLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCAwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqKVxuICAgIH1cblxuICAgIGlmIChvYmoudHlwZSA9PT0gJ0J1ZmZlcicgJiYgaXNBcnJheShvYmouZGF0YSkpIHtcbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iai5kYXRhKVxuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCBvciBhcnJheS1saWtlIG9iamVjdC4nKVxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwga01heExlbmd0aCgpYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IGtNYXhMZW5ndGgoKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBrTWF4TGVuZ3RoKCkudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNsb3dCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAoK2xlbmd0aCAhPSBsZW5ndGgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbiAgICBsZW5ndGggPSAwXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5hbGxvYygrbGVuZ3RoKVxufVxuQnVmZmVyLmlzQnVmZmVyID0gaXNCdWZmZXI7XG5mdW5jdGlvbiBpbnRlcm5hbElzQnVmZmVyIChiKSB7XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIWludGVybmFsSXNCdWZmZXIoYSkgfHwgIWludGVybmFsSXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgbXVzdCBiZSBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuXG4gIHZhciB4ID0gYS5sZW5ndGhcbiAgdmFyIHkgPSBiLmxlbmd0aFxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldXG4gICAgICB5ID0gYltpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnbGF0aW4xJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIWlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5hbGxvYygwKVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICBsZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYnVmID0gbGlzdFtpXVxuICAgIGlmICghaW50ZXJuYWxJc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoaW50ZXJuYWxJc0J1ZmZlcihzdHJpbmcpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5sZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQXJyYXlCdWZmZXIuaXNWaWV3ID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAoQXJyYXlCdWZmZXIuaXNWaWV3KHN0cmluZykgfHwgc3RyaW5nIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5ieXRlTGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgc3RyaW5nID0gJycgKyBzdHJpbmdcbiAgfVxuXG4gIHZhciBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gbGVuICogMlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGxlbiA+Pj4gMVxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoIC8vIGFzc3VtZSB1dGY4XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIC8vIE5vIG5lZWQgdG8gdmVyaWZ5IHRoYXQgXCJ0aGlzLmxlbmd0aCA8PSBNQVhfVUlOVDMyXCIgc2luY2UgaXQncyBhIHJlYWQtb25seVxuICAvLyBwcm9wZXJ0eSBvZiBhIHR5cGVkIGFycmF5LlxuXG4gIC8vIFRoaXMgYmVoYXZlcyBuZWl0aGVyIGxpa2UgU3RyaW5nIG5vciBVaW50OEFycmF5IGluIHRoYXQgd2Ugc2V0IHN0YXJ0L2VuZFxuICAvLyB0byB0aGVpciB1cHBlci9sb3dlciBib3VuZHMgaWYgdGhlIHZhbHVlIHBhc3NlZCBpcyBvdXQgb2YgcmFuZ2UuXG4gIC8vIHVuZGVmaW5lZCBpcyBoYW5kbGVkIHNwZWNpYWxseSBhcyBwZXIgRUNNQS0yNjIgNnRoIEVkaXRpb24sXG4gIC8vIFNlY3Rpb24gMTMuMy4zLjcgUnVudGltZSBTZW1hbnRpY3M6IEtleWVkQmluZGluZ0luaXRpYWxpemF0aW9uLlxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCB8fCBzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICAvLyBSZXR1cm4gZWFybHkgaWYgc3RhcnQgPiB0aGlzLmxlbmd0aC4gRG9uZSBoZXJlIHRvIHByZXZlbnQgcG90ZW50aWFsIHVpbnQzMlxuICAvLyBjb2VyY2lvbiBmYWlsIGJlbG93LlxuICBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbmQgPD0gMCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgLy8gRm9yY2UgY29lcnNpb24gdG8gdWludDMyLiBUaGlzIHdpbGwgYWxzbyBjb2VyY2UgZmFsc2V5L05hTiB2YWx1ZXMgdG8gMC5cbiAgZW5kID4+Pj0gMFxuICBzdGFydCA+Pj49IDBcblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gVGhlIHByb3BlcnR5IGlzIHVzZWQgYnkgYEJ1ZmZlci5pc0J1ZmZlcmAgYW5kIGBpcy1idWZmZXJgIChpbiBTYWZhcmkgNS03KSB0byBkZXRlY3Rcbi8vIEJ1ZmZlciBpbnN0YW5jZXMuXG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuZnVuY3Rpb24gc3dhcCAoYiwgbiwgbSkge1xuICB2YXIgaSA9IGJbbl1cbiAgYltuXSA9IGJbbV1cbiAgYlttXSA9IGlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMTYgPSBmdW5jdGlvbiBzd2FwMTYgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDIgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDE2LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAxKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDMyID0gZnVuY3Rpb24gc3dhcDMyICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAzMi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgMilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXA2NCA9IGZ1bmN0aW9uIHN3YXA2NCAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgOCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNjQtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gOCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDcpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDYpXG4gICAgc3dhcCh0aGlzLCBpICsgMiwgaSArIDUpXG4gICAgc3dhcCh0aGlzLCBpICsgMywgaSArIDQpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoIHwgMFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgaWYgKHRoaXMgPT09IGIpIHJldHVybiB0cnVlXG4gIHJldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLCBiKSA9PT0gMFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgdmFyIHN0ciA9ICcnXG4gIHZhciBtYXggPSBJTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKCFpbnRlcm5hbElzQnVmZmVyKHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgfVxuXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5kID0gdGFyZ2V0ID8gdGFyZ2V0Lmxlbmd0aCA6IDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzU3RhcnQgPSAwXG4gIH1cbiAgaWYgKHRoaXNFbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNFbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBlbmQgPiB0YXJnZXQubGVuZ3RoIHx8IHRoaXNTdGFydCA8IDAgfHwgdGhpc0VuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ291dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQgJiYgc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIHN0YXJ0ID4+Pj0gMFxuICBlbmQgPj4+PSAwXG4gIHRoaXNTdGFydCA+Pj49IDBcbiAgdGhpc0VuZCA+Pj49IDBcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0KSByZXR1cm4gMFxuXG4gIHZhciB4ID0gdGhpc0VuZCAtIHRoaXNTdGFydFxuICB2YXIgeSA9IGVuZCAtIHN0YXJ0XG4gIHZhciBsZW4gPSBNYXRoLm1pbih4LCB5KVxuXG4gIHZhciB0aGlzQ29weSA9IHRoaXMuc2xpY2UodGhpc1N0YXJ0LCB0aGlzRW5kKVxuICB2YXIgdGFyZ2V0Q29weSA9IHRhcmdldC5zbGljZShzdGFydCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAodGhpc0NvcHlbaV0gIT09IHRhcmdldENvcHlbaV0pIHtcbiAgICAgIHggPSB0aGlzQ29weVtpXVxuICAgICAgeSA9IHRhcmdldENvcHlbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG4vLyBGaW5kcyBlaXRoZXIgdGhlIGZpcnN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA+PSBgYnl0ZU9mZnNldGAsXG4vLyBPUiB0aGUgbGFzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPD0gYGJ5dGVPZmZzZXRgLlxuLy9cbi8vIEFyZ3VtZW50czpcbi8vIC0gYnVmZmVyIC0gYSBCdWZmZXIgdG8gc2VhcmNoXG4vLyAtIHZhbCAtIGEgc3RyaW5nLCBCdWZmZXIsIG9yIG51bWJlclxuLy8gLSBieXRlT2Zmc2V0IC0gYW4gaW5kZXggaW50byBgYnVmZmVyYDsgd2lsbCBiZSBjbGFtcGVkIHRvIGFuIGludDMyXG4vLyAtIGVuY29kaW5nIC0gYW4gb3B0aW9uYWwgZW5jb2RpbmcsIHJlbGV2YW50IGlzIHZhbCBpcyBhIHN0cmluZ1xuLy8gLSBkaXIgLSB0cnVlIGZvciBpbmRleE9mLCBmYWxzZSBmb3IgbGFzdEluZGV4T2ZcbmZ1bmN0aW9uIGJpZGlyZWN0aW9uYWxJbmRleE9mIChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICAvLyBFbXB0eSBidWZmZXIgbWVhbnMgbm8gbWF0Y2hcbiAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHJldHVybiAtMVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0XG4gIGlmICh0eXBlb2YgYnl0ZU9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IGJ5dGVPZmZzZXRcbiAgICBieXRlT2Zmc2V0ID0gMFxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPiAweDdmZmZmZmZmKSB7XG4gICAgYnl0ZU9mZnNldCA9IDB4N2ZmZmZmZmZcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgLTB4ODAwMDAwMDApIHtcbiAgICBieXRlT2Zmc2V0ID0gLTB4ODAwMDAwMDBcbiAgfVxuICBieXRlT2Zmc2V0ID0gK2J5dGVPZmZzZXQgIC8vIENvZXJjZSB0byBOdW1iZXIuXG4gIGlmIChpc05hTihieXRlT2Zmc2V0KSkge1xuICAgIC8vIGJ5dGVPZmZzZXQ6IGl0IGl0J3MgdW5kZWZpbmVkLCBudWxsLCBOYU4sIFwiZm9vXCIsIGV0Yywgc2VhcmNoIHdob2xlIGJ1ZmZlclxuICAgIGJ5dGVPZmZzZXQgPSBkaXIgPyAwIDogKGJ1ZmZlci5sZW5ndGggLSAxKVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXQ6IG5lZ2F0aXZlIG9mZnNldHMgc3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBidWZmZXJcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwKSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCArIGJ5dGVPZmZzZXRcbiAgaWYgKGJ5dGVPZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkge1xuICAgIGlmIChkaXIpIHJldHVybiAtMVxuICAgIGVsc2UgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggLSAxXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IDApIHtcbiAgICBpZiAoZGlyKSBieXRlT2Zmc2V0ID0gMFxuICAgIGVsc2UgcmV0dXJuIC0xXG4gIH1cblxuICAvLyBOb3JtYWxpemUgdmFsXG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIHZhbCA9IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gIH1cblxuICAvLyBGaW5hbGx5LCBzZWFyY2ggZWl0aGVyIGluZGV4T2YgKGlmIGRpciBpcyB0cnVlKSBvciBsYXN0SW5kZXhPZlxuICBpZiAoaW50ZXJuYWxJc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDB4RkYgLy8gU2VhcmNoIGZvciBhIGJ5dGUgdmFsdWUgWzAtMjU1XVxuICAgIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJlxuICAgICAgICB0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGRpcikge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCBbIHZhbCBdLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyJylcbn1cblxuZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICB2YXIgaW5kZXhTaXplID0gMVxuICB2YXIgYXJyTGVuZ3RoID0gYXJyLmxlbmd0aFxuICB2YXIgdmFsTGVuZ3RoID0gdmFsLmxlbmd0aFxuXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZW5jb2RpbmcgPT09ICd1Y3MyJyB8fCBlbmNvZGluZyA9PT0gJ3Vjcy0yJyB8fFxuICAgICAgICBlbmNvZGluZyA9PT0gJ3V0ZjE2bGUnIHx8IGVuY29kaW5nID09PSAndXRmLTE2bGUnKSB7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA8IDIgfHwgdmFsLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpbmRleFNpemUgPSAyXG4gICAgICBhcnJMZW5ndGggLz0gMlxuICAgICAgdmFsTGVuZ3RoIC89IDJcbiAgICAgIGJ5dGVPZmZzZXQgLz0gMlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGJ1ZiwgaSkge1xuICAgIGlmIChpbmRleFNpemUgPT09IDEpIHtcbiAgICAgIHJldHVybiBidWZbaV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ1Zi5yZWFkVUludDE2QkUoaSAqIGluZGV4U2l6ZSlcbiAgICB9XG4gIH1cblxuICB2YXIgaVxuICBpZiAoZGlyKSB7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPCBhcnJMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlYWQoYXJyLCBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIGZvdW5kSW5kZXggPSBpXG4gICAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbExlbmd0aCkgcmV0dXJuIGZvdW5kSW5kZXggKiBpbmRleFNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ICE9PSAtMSkgaSAtPSBpIC0gZm91bmRJbmRleFxuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGJ5dGVPZmZzZXQgKyB2YWxMZW5ndGggPiBhcnJMZW5ndGgpIGJ5dGVPZmZzZXQgPSBhcnJMZW5ndGggLSB2YWxMZW5ndGhcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGZvdW5kID0gdHJ1ZVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWxMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAocmVhZChhcnIsIGkgKyBqKSAhPT0gcmVhZCh2YWwsIGopKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuIGlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiB0aGlzLmluZGV4T2YodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykgIT09IC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIHRydWUpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZmFsc2UpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKHN0ckxlbiAlIDIgIT09IDApIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKGlzTmFOKHBhcnNlZCkpIHJldHVybiBpXG4gICAgYnVmW29mZnNldCArIGldID0gcGFyc2VkXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBsYXRpbjFXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBhc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHVjczJXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZylcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBvZmZzZXRbLCBsZW5ndGhdWywgZW5jb2RpbmddKVxuICB9IGVsc2UgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCB8IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICAvLyBsZWdhY3kgd3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpIC0gcmVtb3ZlIGluIHYwLjEzXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1ZmZlci53cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXRbLCBsZW5ndGhdKSBpcyBubyBsb25nZXIgc3VwcG9ydGVkJ1xuICAgIClcbiAgfVxuXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbGVuZ3RoID4gcmVtYWluaW5nKSBsZW5ndGggPSByZW1haW5pbmdcblxuICBpZiAoKHN0cmluZy5sZW5ndGggPiAwICYmIChsZW5ndGggPCAwIHx8IG9mZnNldCA8IDApKSB8fCBvZmZzZXQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIHdyaXRlIG91dHNpZGUgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIC8vIFdhcm5pbmc6IG1heExlbmd0aCBub3QgdGFrZW4gaW50byBhY2NvdW50IGluIGJhc2U2NFdyaXRlXG4gICAgICAgIHJldHVybiBiYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdWNzMldyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHV0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcbiAgdmFyIHJlcyA9IFtdXG5cbiAgdmFyIGkgPSBzdGFydFxuICB3aGlsZSAoaSA8IGVuZCkge1xuICAgIHZhciBmaXJzdEJ5dGUgPSBidWZbaV1cbiAgICB2YXIgY29kZVBvaW50ID0gbnVsbFxuICAgIHZhciBieXRlc1BlclNlcXVlbmNlID0gKGZpcnN0Qnl0ZSA+IDB4RUYpID8gNFxuICAgICAgOiAoZmlyc3RCeXRlID4gMHhERikgPyAzXG4gICAgICA6IChmaXJzdEJ5dGUgPiAweEJGKSA/IDJcbiAgICAgIDogMVxuXG4gICAgaWYgKGkgKyBieXRlc1BlclNlcXVlbmNlIDw9IGVuZCkge1xuICAgICAgdmFyIHNlY29uZEJ5dGUsIHRoaXJkQnl0ZSwgZm91cnRoQnl0ZSwgdGVtcENvZGVQb2ludFxuXG4gICAgICBzd2l0Y2ggKGJ5dGVzUGVyU2VxdWVuY2UpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmIChmaXJzdEJ5dGUgPCAweDgwKSB7XG4gICAgICAgICAgICBjb2RlUG9pbnQgPSBmaXJzdEJ5dGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHgxRikgPDwgMHg2IHwgKHNlY29uZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4QyB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKHRoaXJkQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0ZGICYmICh0ZW1wQ29kZVBvaW50IDwgMHhEODAwIHx8IHRlbXBDb2RlUG9pbnQgPiAweERGRkYpKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGZvdXJ0aEJ5dGUgPSBidWZbaSArIDNdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwICYmIChmb3VydGhCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweDEyIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweEMgfCAodGhpcmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKGZvdXJ0aEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweEZGRkYgJiYgdGVtcENvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGVQb2ludCA9PT0gbnVsbCkge1xuICAgICAgLy8gd2UgZGlkIG5vdCBnZW5lcmF0ZSBhIHZhbGlkIGNvZGVQb2ludCBzbyBpbnNlcnQgYVxuICAgICAgLy8gcmVwbGFjZW1lbnQgY2hhciAoVStGRkZEKSBhbmQgYWR2YW5jZSBvbmx5IDEgYnl0ZVxuICAgICAgY29kZVBvaW50ID0gMHhGRkZEXG4gICAgICBieXRlc1BlclNlcXVlbmNlID0gMVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50ID4gMHhGRkZGKSB7XG4gICAgICAvLyBlbmNvZGUgdG8gdXRmMTYgKHN1cnJvZ2F0ZSBwYWlyIGRhbmNlKVxuICAgICAgY29kZVBvaW50IC09IDB4MTAwMDBcbiAgICAgIHJlcy5wdXNoKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMClcbiAgICAgIGNvZGVQb2ludCA9IDB4REMwMCB8IGNvZGVQb2ludCAmIDB4M0ZGXG4gICAgfVxuXG4gICAgcmVzLnB1c2goY29kZVBvaW50KVxuICAgIGkgKz0gYnl0ZXNQZXJTZXF1ZW5jZVxuICB9XG5cbiAgcmV0dXJuIGRlY29kZUNvZGVQb2ludHNBcnJheShyZXMpXG59XG5cbi8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIyNzQ3MjcyLzY4MDc0MiwgdGhlIGJyb3dzZXIgd2l0aFxuLy8gdGhlIGxvd2VzdCBsaW1pdCBpcyBDaHJvbWUsIHdpdGggMHgxMDAwMCBhcmdzLlxuLy8gV2UgZ28gMSBtYWduaXR1ZGUgbGVzcywgZm9yIHNhZmV0eVxudmFyIE1BWF9BUkdVTUVOVFNfTEVOR1RIID0gMHgxMDAwXG5cbmZ1bmN0aW9uIGRlY29kZUNvZGVQb2ludHNBcnJheSAoY29kZVBvaW50cykge1xuICB2YXIgbGVuID0gY29kZVBvaW50cy5sZW5ndGhcbiAgaWYgKGxlbiA8PSBNQVhfQVJHVU1FTlRTX0xFTkdUSCkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY29kZVBvaW50cykgLy8gYXZvaWQgZXh0cmEgc2xpY2UoKVxuICB9XG5cbiAgLy8gRGVjb2RlIGluIGNodW5rcyB0byBhdm9pZCBcImNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZFwiLlxuICB2YXIgcmVzID0gJydcbiAgdmFyIGkgPSAwXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXG4gICAgICBTdHJpbmcsXG4gICAgICBjb2RlUG9pbnRzLnNsaWNlKGksIGkgKz0gTUFYX0FSR1VNRU5UU19MRU5HVEgpXG4gICAgKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0gJiAweDdGKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gbGF0aW4xU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiB1dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2kgKyAxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICB2YXIgbmV3QnVmXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIG5ld0J1ZiA9IHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZClcbiAgICBuZXdCdWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47ICsraSkge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ld0J1ZlxufVxuXG4vKlxuICogTmVlZCB0byBtYWtlIHN1cmUgdGhhdCBidWZmZXIgaXNuJ3QgdHJ5aW5nIHRvIHdyaXRlIG91dCBvZiBib3VuZHMuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT2Zmc2V0IChvZmZzZXQsIGV4dCwgbGVuZ3RoKSB7XG4gIGlmICgob2Zmc2V0ICUgMSkgIT09IDAgfHwgb2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ29mZnNldCBpcyBub3QgdWludCcpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBsZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdUcnlpbmcgdG8gYWNjZXNzIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludExFID0gZnVuY3Rpb24gcmVhZFVJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcbiAgfVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF1cbiAgdmFyIG11bCA9IDFcbiAgd2hpbGUgKGJ5dGVMZW5ndGggPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIHJlYWRVSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCA4KSB8IHRoaXNbb2Zmc2V0ICsgMV1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiByZWFkVUludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKCh0aGlzW29mZnNldF0pIHxcbiAgICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSkgK1xuICAgICAgKHRoaXNbb2Zmc2V0ICsgM10gKiAweDEwMDAwMDApXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50QkUgPSBmdW5jdGlvbiByZWFkSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGhcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1pXVxuICB3aGlsZSAoaSA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIHJlYWRJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gcmVhZEludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgMV0gfCAodGhpc1tvZmZzZXRdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgMjQpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdExFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdEJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiByZWFkRG91YmxlQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCA1MiwgOClcbn1cblxuZnVuY3Rpb24gY2hlY2tJbnQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAoIWludGVybmFsSXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZmZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHhmZiwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCAyKTsgaSA8IGo7ICsraSkge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgNCk7IGkgPCBqOyArK2kpIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gMFxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgLSAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgKyAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgOCwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICh0YXJnZXQsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXRTdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB0YXJnZXRTdGFydCA9IHRhcmdldC5sZW5ndGhcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwXG4gIGlmIChlbmQgPiAwICYmIGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDBcbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgdGhpcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAodGFyZ2V0U3RhcnQgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgaWYgKGVuZCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgKyBzdGFydFxuICB9XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG4gIHZhciBpXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yIChpID0gbGVuIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2UgaWYgKGxlbiA8IDEwMDAgfHwgIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gYXNjZW5kaW5nIGNvcHkgZnJvbSBzdGFydFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoY29kZSA8IDI1Nikge1xuICAgICAgICB2YWwgPSBjb2RlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMjU1XG4gIH1cblxuICAvLyBJbnZhbGlkIHJhbmdlcyBhcmUgbm90IHNldCB0byBhIGRlZmF1bHQsIHNvIGNhbiByYW5nZSBjaGVjayBlYXJseS5cbiAgaWYgKHN0YXJ0IDwgMCB8fCB0aGlzLmxlbmd0aCA8IHN0YXJ0IHx8IHRoaXMubGVuZ3RoIDwgZW5kKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ091dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgPj4+IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyB0aGlzLmxlbmd0aCA6IGVuZCA+Pj4gMFxuXG4gIGlmICghdmFsKSB2YWwgPSAwXG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgdGhpc1tpXSA9IHZhbFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYnl0ZXMgPSBpbnRlcm5hbElzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IHV0ZjhUb0J5dGVzKG5ldyBCdWZmZXIodmFsLCBlbmNvZGluZykudG9TdHJpbmcoKSlcbiAgICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rXFwvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyaW5ndHJpbShzdHIpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICB2YXIgY29kZVBvaW50XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICB2YXIgYnl0ZXMgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuXG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBpc25hbiAodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IHZhbCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuXG5cbi8vIHRoZSBmb2xsb3dpbmcgaXMgZnJvbSBpcy1idWZmZXIsIGFsc28gYnkgRmVyb3NzIEFib3VraGFkaWplaCBhbmQgd2l0aCBzYW1lIGxpc2VuY2Vcbi8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcbi8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcbmV4cG9ydCBmdW5jdGlvbiBpc0J1ZmZlcihvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmICghIW9iai5faXNCdWZmZXIgfHwgaXNGYXN0QnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikpXG59XG5cbmZ1bmN0aW9uIGlzRmFzdEJ1ZmZlciAob2JqKSB7XG4gIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG5cbi8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5mdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzRmFzdEJ1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtCdWZmZXJ9IGZyb20gJ2J1ZmZlcic7XG52YXIgaXNCdWZmZXJFbmNvZGluZyA9IEJ1ZmZlci5pc0VuY29kaW5nXG4gIHx8IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gICAgICAgc3dpdGNoIChlbmNvZGluZyAmJiBlbmNvZGluZy50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICBjYXNlICdoZXgnOiBjYXNlICd1dGY4JzogY2FzZSAndXRmLTgnOiBjYXNlICdhc2NpaSc6IGNhc2UgJ2JpbmFyeSc6IGNhc2UgJ2Jhc2U2NCc6IGNhc2UgJ3VjczInOiBjYXNlICd1Y3MtMic6IGNhc2UgJ3V0ZjE2bGUnOiBjYXNlICd1dGYtMTZsZSc6IGNhc2UgJ3Jhdyc6IHJldHVybiB0cnVlO1xuICAgICAgICAgZGVmYXVsdDogcmV0dXJuIGZhbHNlO1xuICAgICAgIH1cbiAgICAgfVxuXG5cbmZ1bmN0aW9uIGFzc2VydEVuY29kaW5nKGVuY29kaW5nKSB7XG4gIGlmIChlbmNvZGluZyAmJiAhaXNCdWZmZXJFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZyk7XG4gIH1cbn1cblxuLy8gU3RyaW5nRGVjb2RlciBwcm92aWRlcyBhbiBpbnRlcmZhY2UgZm9yIGVmZmljaWVudGx5IHNwbGl0dGluZyBhIHNlcmllcyBvZlxuLy8gYnVmZmVycyBpbnRvIGEgc2VyaWVzIG9mIEpTIHN0cmluZ3Mgd2l0aG91dCBicmVha2luZyBhcGFydCBtdWx0aS1ieXRlXG4vLyBjaGFyYWN0ZXJzLiBDRVNVLTggaXMgaGFuZGxlZCBhcyBwYXJ0IG9mIHRoZSBVVEYtOCBlbmNvZGluZy5cbi8vXG4vLyBAVE9ETyBIYW5kbGluZyBhbGwgZW5jb2RpbmdzIGluc2lkZSBhIHNpbmdsZSBvYmplY3QgbWFrZXMgaXQgdmVyeSBkaWZmaWN1bHRcbi8vIHRvIHJlYXNvbiBhYm91dCB0aGlzIGNvZGUsIHNvIGl0IHNob3VsZCBiZSBzcGxpdCB1cCBpbiB0aGUgZnV0dXJlLlxuLy8gQFRPRE8gVGhlcmUgc2hvdWxkIGJlIGEgdXRmOC1zdHJpY3QgZW5jb2RpbmcgdGhhdCByZWplY3RzIGludmFsaWQgVVRGLTggY29kZVxuLy8gcG9pbnRzIGFzIHVzZWQgYnkgQ0VTVS04LlxuZXhwb3J0IGZ1bmN0aW9uIFN0cmluZ0RlY29kZXIoZW5jb2RpbmcpIHtcbiAgdGhpcy5lbmNvZGluZyA9IChlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvWy1fXS8sICcnKTtcbiAgYXNzZXJ0RW5jb2RpbmcoZW5jb2RpbmcpO1xuICBzd2l0Y2ggKHRoaXMuZW5jb2RpbmcpIHtcbiAgICBjYXNlICd1dGY4JzpcbiAgICAgIC8vIENFU1UtOCByZXByZXNlbnRzIGVhY2ggb2YgU3Vycm9nYXRlIFBhaXIgYnkgMy1ieXRlc1xuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgLy8gVVRGLTE2IHJlcHJlc2VudHMgZWFjaCBvZiBTdXJyb2dhdGUgUGFpciBieSAyLWJ5dGVzXG4gICAgICB0aGlzLnN1cnJvZ2F0ZVNpemUgPSAyO1xuICAgICAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhciA9IHV0ZjE2RGV0ZWN0SW5jb21wbGV0ZUNoYXI7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgLy8gQmFzZS02NCBzdG9yZXMgMyBieXRlcyBpbiA0IGNoYXJzLCBhbmQgcGFkcyB0aGUgcmVtYWluZGVyLlxuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMztcbiAgICAgIHRoaXMuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSBiYXNlNjREZXRlY3RJbmNvbXBsZXRlQ2hhcjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aGlzLndyaXRlID0gcGFzc1Rocm91Z2hXcml0ZTtcbiAgICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEVub3VnaCBzcGFjZSB0byBzdG9yZSBhbGwgYnl0ZXMgb2YgYSBzaW5nbGUgY2hhcmFjdGVyLiBVVEYtOCBuZWVkcyA0XG4gIC8vIGJ5dGVzLCBidXQgQ0VTVS04IG1heSByZXF1aXJlIHVwIHRvIDYgKDMgYnl0ZXMgcGVyIHN1cnJvZ2F0ZSkuXG4gIHRoaXMuY2hhckJ1ZmZlciA9IG5ldyBCdWZmZXIoNik7XG4gIC8vIE51bWJlciBvZiBieXRlcyByZWNlaXZlZCBmb3IgdGhlIGN1cnJlbnQgaW5jb21wbGV0ZSBtdWx0aS1ieXRlIGNoYXJhY3Rlci5cbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSAwO1xuICAvLyBOdW1iZXIgb2YgYnl0ZXMgZXhwZWN0ZWQgZm9yIHRoZSBjdXJyZW50IGluY29tcGxldGUgbXVsdGktYnl0ZSBjaGFyYWN0ZXIuXG4gIHRoaXMuY2hhckxlbmd0aCA9IDA7XG59O1xuXG5cbi8vIHdyaXRlIGRlY29kZXMgdGhlIGdpdmVuIGJ1ZmZlciBhbmQgcmV0dXJucyBpdCBhcyBKUyBzdHJpbmcgdGhhdCBpc1xuLy8gZ3VhcmFudGVlZCB0byBub3QgY29udGFpbiBhbnkgcGFydGlhbCBtdWx0aS1ieXRlIGNoYXJhY3RlcnMuIEFueSBwYXJ0aWFsXG4vLyBjaGFyYWN0ZXIgZm91bmQgYXQgdGhlIGVuZCBvZiB0aGUgYnVmZmVyIGlzIGJ1ZmZlcmVkIHVwLCBhbmQgd2lsbCBiZVxuLy8gcmV0dXJuZWQgd2hlbiBjYWxsaW5nIHdyaXRlIGFnYWluIHdpdGggdGhlIHJlbWFpbmluZyBieXRlcy5cbi8vXG4vLyBOb3RlOiBDb252ZXJ0aW5nIGEgQnVmZmVyIGNvbnRhaW5pbmcgYW4gb3JwaGFuIHN1cnJvZ2F0ZSB0byBhIFN0cmluZ1xuLy8gY3VycmVudGx5IHdvcmtzLCBidXQgY29udmVydGluZyBhIFN0cmluZyB0byBhIEJ1ZmZlciAodmlhIGBuZXcgQnVmZmVyYCwgb3Jcbi8vIEJ1ZmZlciN3cml0ZSkgd2lsbCByZXBsYWNlIGluY29tcGxldGUgc3Vycm9nYXRlcyB3aXRoIHRoZSB1bmljb2RlXG4vLyByZXBsYWNlbWVudCBjaGFyYWN0ZXIuIFNlZSBodHRwczovL2NvZGVyZXZpZXcuY2hyb21pdW0ub3JnLzEyMTE3MzAwOS8gLlxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgdmFyIGNoYXJTdHIgPSAnJztcbiAgLy8gaWYgb3VyIGxhc3Qgd3JpdGUgZW5kZWQgd2l0aCBhbiBpbmNvbXBsZXRlIG11bHRpYnl0ZSBjaGFyYWN0ZXJcbiAgd2hpbGUgKHRoaXMuY2hhckxlbmd0aCkge1xuICAgIC8vIGRldGVybWluZSBob3cgbWFueSByZW1haW5pbmcgYnl0ZXMgdGhpcyBidWZmZXIgaGFzIHRvIG9mZmVyIGZvciB0aGlzIGNoYXJcbiAgICB2YXIgYXZhaWxhYmxlID0gKGJ1ZmZlci5sZW5ndGggPj0gdGhpcy5jaGFyTGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQpID9cbiAgICAgICAgdGhpcy5jaGFyTGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQgOlxuICAgICAgICBidWZmZXIubGVuZ3RoO1xuXG4gICAgLy8gYWRkIHRoZSBuZXcgYnl0ZXMgdG8gdGhlIGNoYXIgYnVmZmVyXG4gICAgYnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCB0aGlzLmNoYXJSZWNlaXZlZCwgMCwgYXZhaWxhYmxlKTtcbiAgICB0aGlzLmNoYXJSZWNlaXZlZCArPSBhdmFpbGFibGU7XG5cbiAgICBpZiAodGhpcy5jaGFyUmVjZWl2ZWQgPCB0aGlzLmNoYXJMZW5ndGgpIHtcbiAgICAgIC8vIHN0aWxsIG5vdCBlbm91Z2ggY2hhcnMgaW4gdGhpcyBidWZmZXI/IHdhaXQgZm9yIG1vcmUgLi4uXG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIGJ5dGVzIGJlbG9uZ2luZyB0byB0aGUgY3VycmVudCBjaGFyYWN0ZXIgZnJvbSB0aGUgYnVmZmVyXG4gICAgYnVmZmVyID0gYnVmZmVyLnNsaWNlKGF2YWlsYWJsZSwgYnVmZmVyLmxlbmd0aCk7XG5cbiAgICAvLyBnZXQgdGhlIGNoYXJhY3RlciB0aGF0IHdhcyBzcGxpdFxuICAgIGNoYXJTdHIgPSB0aGlzLmNoYXJCdWZmZXIuc2xpY2UoMCwgdGhpcy5jaGFyTGVuZ3RoKS50b1N0cmluZyh0aGlzLmVuY29kaW5nKTtcblxuICAgIC8vIENFU1UtODogbGVhZCBzdXJyb2dhdGUgKEQ4MDAtREJGRikgaXMgYWxzbyB0aGUgaW5jb21wbGV0ZSBjaGFyYWN0ZXJcbiAgICB2YXIgY2hhckNvZGUgPSBjaGFyU3RyLmNoYXJDb2RlQXQoY2hhclN0ci5sZW5ndGggLSAxKTtcbiAgICBpZiAoY2hhckNvZGUgPj0gMHhEODAwICYmIGNoYXJDb2RlIDw9IDB4REJGRikge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoICs9IHRoaXMuc3Vycm9nYXRlU2l6ZTtcbiAgICAgIGNoYXJTdHIgPSAnJztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICB0aGlzLmNoYXJSZWNlaXZlZCA9IHRoaXMuY2hhckxlbmd0aCA9IDA7XG5cbiAgICAvLyBpZiB0aGVyZSBhcmUgbm8gbW9yZSBieXRlcyBpbiB0aGlzIGJ1ZmZlciwganVzdCBlbWl0IG91ciBjaGFyXG4gICAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjaGFyU3RyO1xuICAgIH1cbiAgICBicmVhaztcbiAgfVxuXG4gIC8vIGRldGVybWluZSBhbmQgc2V0IGNoYXJMZW5ndGggLyBjaGFyUmVjZWl2ZWRcbiAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpO1xuXG4gIHZhciBlbmQgPSBidWZmZXIubGVuZ3RoO1xuICBpZiAodGhpcy5jaGFyTGVuZ3RoKSB7XG4gICAgLy8gYnVmZmVyIHRoZSBpbmNvbXBsZXRlIGNoYXJhY3RlciBieXRlcyB3ZSBnb3RcbiAgICBidWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIDAsIGJ1ZmZlci5sZW5ndGggLSB0aGlzLmNoYXJSZWNlaXZlZCwgZW5kKTtcbiAgICBlbmQgLT0gdGhpcy5jaGFyUmVjZWl2ZWQ7XG4gIH1cblxuICBjaGFyU3RyICs9IGJ1ZmZlci50b1N0cmluZyh0aGlzLmVuY29kaW5nLCAwLCBlbmQpO1xuXG4gIHZhciBlbmQgPSBjaGFyU3RyLmxlbmd0aCAtIDE7XG4gIHZhciBjaGFyQ29kZSA9IGNoYXJTdHIuY2hhckNvZGVBdChlbmQpO1xuICAvLyBDRVNVLTg6IGxlYWQgc3Vycm9nYXRlIChEODAwLURCRkYpIGlzIGFsc28gdGhlIGluY29tcGxldGUgY2hhcmFjdGVyXG4gIGlmIChjaGFyQ29kZSA+PSAweEQ4MDAgJiYgY2hhckNvZGUgPD0gMHhEQkZGKSB7XG4gICAgdmFyIHNpemUgPSB0aGlzLnN1cnJvZ2F0ZVNpemU7XG4gICAgdGhpcy5jaGFyTGVuZ3RoICs9IHNpemU7XG4gICAgdGhpcy5jaGFyUmVjZWl2ZWQgKz0gc2l6ZTtcbiAgICB0aGlzLmNoYXJCdWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIHNpemUsIDAsIHNpemUpO1xuICAgIGJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgMCwgMCwgc2l6ZSk7XG4gICAgcmV0dXJuIGNoYXJTdHIuc3Vic3RyaW5nKDAsIGVuZCk7XG4gIH1cblxuICAvLyBvciBqdXN0IGVtaXQgdGhlIGNoYXJTdHJcbiAgcmV0dXJuIGNoYXJTdHI7XG59O1xuXG4vLyBkZXRlY3RJbmNvbXBsZXRlQ2hhciBkZXRlcm1pbmVzIGlmIHRoZXJlIGlzIGFuIGluY29tcGxldGUgVVRGLTggY2hhcmFjdGVyIGF0XG4vLyB0aGUgZW5kIG9mIHRoZSBnaXZlbiBidWZmZXIuIElmIHNvLCBpdCBzZXRzIHRoaXMuY2hhckxlbmd0aCB0byB0aGUgYnl0ZVxuLy8gbGVuZ3RoIHRoYXQgY2hhcmFjdGVyLCBhbmQgc2V0cyB0aGlzLmNoYXJSZWNlaXZlZCB0byB0aGUgbnVtYmVyIG9mIGJ5dGVzXG4vLyB0aGF0IGFyZSBhdmFpbGFibGUgZm9yIHRoaXMgY2hhcmFjdGVyLlxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgLy8gZGV0ZXJtaW5lIGhvdyBtYW55IGJ5dGVzIHdlIGhhdmUgdG8gY2hlY2sgYXQgdGhlIGVuZCBvZiB0aGlzIGJ1ZmZlclxuICB2YXIgaSA9IChidWZmZXIubGVuZ3RoID49IDMpID8gMyA6IGJ1ZmZlci5sZW5ndGg7XG5cbiAgLy8gRmlndXJlIG91dCBpZiBvbmUgb2YgdGhlIGxhc3QgaSBieXRlcyBvZiBvdXIgYnVmZmVyIGFubm91bmNlcyBhblxuICAvLyBpbmNvbXBsZXRlIGNoYXIuXG4gIGZvciAoOyBpID4gMDsgaS0tKSB7XG4gICAgdmFyIGMgPSBidWZmZXJbYnVmZmVyLmxlbmd0aCAtIGldO1xuXG4gICAgLy8gU2VlIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVVRGLTgjRGVzY3JpcHRpb25cblxuICAgIC8vIDExMFhYWFhYXG4gICAgaWYgKGkgPT0gMSAmJiBjID4+IDUgPT0gMHgwNikge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gMjtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIDExMTBYWFhYXG4gICAgaWYgKGkgPD0gMiAmJiBjID4+IDQgPT0gMHgwRSkge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gMztcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIDExMTEwWFhYXG4gICAgaWYgKGkgPD0gMyAmJiBjID4+IDMgPT0gMHgxRSkge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gNDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGk7XG59O1xuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgdmFyIHJlcyA9ICcnO1xuICBpZiAoYnVmZmVyICYmIGJ1ZmZlci5sZW5ndGgpXG4gICAgcmVzID0gdGhpcy53cml0ZShidWZmZXIpO1xuXG4gIGlmICh0aGlzLmNoYXJSZWNlaXZlZCkge1xuICAgIHZhciBjciA9IHRoaXMuY2hhclJlY2VpdmVkO1xuICAgIHZhciBidWYgPSB0aGlzLmNoYXJCdWZmZXI7XG4gICAgdmFyIGVuYyA9IHRoaXMuZW5jb2Rpbmc7XG4gICAgcmVzICs9IGJ1Zi5zbGljZSgwLCBjcikudG9TdHJpbmcoZW5jKTtcbiAgfVxuXG4gIHJldHVybiByZXM7XG59O1xuXG5mdW5jdGlvbiBwYXNzVGhyb3VnaFdyaXRlKGJ1ZmZlcikge1xuICByZXR1cm4gYnVmZmVyLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcpO1xufVxuXG5mdW5jdGlvbiB1dGYxNkRldGVjdEluY29tcGxldGVDaGFyKGJ1ZmZlcikge1xuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGJ1ZmZlci5sZW5ndGggJSAyO1xuICB0aGlzLmNoYXJMZW5ndGggPSB0aGlzLmNoYXJSZWNlaXZlZCA/IDIgOiAwO1xufVxuXG5mdW5jdGlvbiBiYXNlNjREZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpIHtcbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSBidWZmZXIubGVuZ3RoICUgMztcbiAgdGhpcy5jaGFyTGVuZ3RoID0gdGhpcy5jaGFyUmVjZWl2ZWQgPyAzIDogMDtcbn1cbiIsImltcG9ydCB7Z2VuZXJhdGVTY2hlbWF9IGZyb20gXCIuL2luZGV4U2NoZW1hQ3JlYXRvclwiO1xuaW1wb3J0IHsgaGFzLCBpc1N0cmluZywgZGlmZmVyZW5jZSwgZmluZCB9IGZyb20gXCJsb2Rhc2gvZnBcIjtcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJzYWZlLWJ1ZmZlclwiO1xuaW1wb3J0IHtTdHJpbmdEZWNvZGVyfSBmcm9tIFwic3RyaW5nX2RlY29kZXJcIjtcbmltcG9ydCB7Z2V0VHlwZX0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgeyBpc1NvbWV0aGluZyB9IGZyb20gXCIuLi9jb21tb25cIjtcblxuZXhwb3J0IGNvbnN0IEJVRkZFUl9NQVhfQllURVMgPSA1MjQyODg7IC8vIDAuNU1iXG5cbmV4cG9ydCBjb25zdCBDT05USU5VRV9SRUFESU5HX1JFQ09SRFMgPSBcIkNPTlRJTlVFX1JFQURJTkdcIjtcbmV4cG9ydCBjb25zdCBSRUFEX1JFTUFJTklOR19URVhUID0gXCJSRUFEX1JFTUFJTklOR1wiO1xuZXhwb3J0IGNvbnN0IENBTkNFTF9SRUFEID0gXCJDQU5DRUxcIjtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4V3JpdGVyID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlLCByZWFkYWJsZVN0cmVhbSwgd3JpdGFibGVTdHJlYW0sIGVuZCkgPT4ge1xuICAgIGNvbnN0IHNjaGVtYSA9IGdlbmVyYXRlU2NoZW1hKGhpZXJhcmNoeSwgaW5kZXhOb2RlKTtcblxuICAgIHJldHVybiAoe1xuICAgICAgICByZWFkOiByZWFkKHJlYWRhYmxlU3RyZWFtLCBzY2hlbWEpLFxuICAgICAgICB1cGRhdGVJbmRleDogdXBkYXRlSW5kZXgocmVhZGFibGVTdHJlYW0sIHdyaXRhYmxlU3RyZWFtLCBzY2hlbWEsIGVuZClcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRJbmRleFJlYWRlciA9IChoaWVyYXJjaHksIGluZGV4Tm9kZSwgcmVhZGFibGVTdHJlYW0pID0+IFxuICAgIHJlYWQoXG4gICAgICAgIHJlYWRhYmxlU3RyZWFtLCBcbiAgICAgICAgZ2VuZXJhdGVTY2hlbWEoaGllcmFyY2h5LCBpbmRleE5vZGUpXG4gICAgKTtcblxuY29uc3QgdXBkYXRlSW5kZXggPSAocmVhZGFibGVTdHJlYW0sIHdyaXRhYmxlU3RyZWFtLCBzY2hlbWEpID0+IGFzeW5jIChpdGVtc1RvV3JpdGUsIGtleXNUb1JlbW92ZSkgPT4ge1xuICAgIGNvbnN0IHdyaXRlID0gbmV3T3V0cHV0V3JpdGVyKEJVRkZFUl9NQVhfQllURVMsIHdyaXRhYmxlU3RyZWFtKTtcbiAgICBjb25zdCB3cml0dGVuSXRlbXMgPSBbXTsgXG4gICAgYXdhaXQgcmVhZChyZWFkYWJsZVN0cmVhbSwgc2NoZW1hKShcbiAgICAgICAgYXN5bmMgaW5kZXhlZEl0ZW0gPT4ge1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlZCA9IGZpbmQoaSA9PiBpbmRleGVkSXRlbS5rZXkgPT09IGkua2V5KShpdGVtc1RvV3JpdGUpO1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlZCA9IGZpbmQoayA9PiBpbmRleGVkSXRlbS5rZXkgPT09IGspKGtleXNUb1JlbW92ZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKGlzU29tZXRoaW5nKHJlbW92ZWQpKSBcbiAgICAgICAgICAgICAgICByZXR1cm4gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xuXG4gICAgICAgICAgICBpZihpc1NvbWV0aGluZyh1cGRhdGVkKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlcmlhbGl6ZWRJdGVtID0gIHNlcmlhbGl6ZUl0ZW0oc2NoZW1hLCB1cGRhdGVkKTtcbiAgICAgICAgICAgICAgICBhd2FpdCB3cml0ZShzZXJpYWxpemVkSXRlbSk7XG4gICAgICAgICAgICAgICAgd3JpdHRlbkl0ZW1zLnB1c2godXBkYXRlZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRlKFxuICAgICAgICAgICAgICAgICAgICBzZXJpYWxpemVJdGVtKHNjaGVtYSwgaW5kZXhlZEl0ZW0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gXG5cbiAgICAgICAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XG5cbiAgICAgICAgfSxcbiAgICAgICAgYXN5bmMgdGV4dCA9PiBhd2FpdCB3cml0ZSh0ZXh0KVxuICAgICk7XG5cbiAgICBpZih3cml0dGVuSXRlbXMubGVuZ3RoICE9PSBpdGVtc1RvV3JpdGUubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHRvQWRkID0gZGlmZmVyZW5jZShpdGVtc1RvV3JpdGUsIHdyaXR0ZW5JdGVtcyk7XG4gICAgICAgIGZvcihsZXQgYWRkZWQgb2YgdG9BZGQpIHtcbiAgICAgICAgICAgIGF3YWl0IHdyaXRlKFxuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZUl0ZW0oc2NoZW1hLCBhZGRlZClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYod3JpdHRlbkl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBwb3RlbnRpYWxseSBhcmUgbm8gcmVjb3Jkc1xuICAgICAgICBhd2FpdCB3cml0ZShcIlwiKTtcbiAgICB9XG5cbiAgICBhd2FpdCB3cml0ZSgpO1xuICAgIGF3YWl0IHdyaXRhYmxlU3RyZWFtLmVuZCgpO1xufTtcblxuY29uc3QgcmVhZCA9IChyZWFkYWJsZVN0cmVhbSwgc2NoZW1hKSA9PiBhc3luYyAob25HZXRJdGVtLCBvbkdldFRleHQpID0+IHtcbiAgICBjb25zdCByZWFkSW5wdXQgPSBuZXdJbnB1dFJlYWRlcihyZWFkYWJsZVN0cmVhbSk7XG4gICAgbGV0IHRleHQgPSBhd2FpdCByZWFkSW5wdXQoKTtcbiAgICBsZXQgc3RhdHVzID0gQ09OVElOVUVfUkVBRElOR19SRUNPUkRTO1xuICAgIHdoaWxlKHRleHQubGVuZ3RoID4gMCkge1xuXG4gICAgICAgIGlmKHN0YXR1cyA9PT0gUkVBRF9SRU1BSU5JTkdfVEVYVCkge1xuICAgICAgICAgICAgYXdhaXQgb25HZXRUZXh0KHRleHQpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZihzdGF0dXMgPT09IENBTkNFTF9SRUFEKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcm93VGV4dCA9IFwiXCI7XG4gICAgICAgIGxldCBjdXJyZW50Q2hhckluZGV4PTA7XG4gICAgICAgIGZvcihsZXQgY3VycmVudENoYXIgb2YgdGV4dCkge1xuICAgICAgICAgICAgcm93VGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcIlxcclwiKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzID0gYXdhaXQgb25HZXRJdGVtKFxuICAgICAgICAgICAgICAgICAgICBkZXNlcmlhbGl6ZVJvdyhzY2hlbWEsIHJvd1RleHQpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByb3dUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBpZihzdGF0dXMgPT09IFJFQURfUkVNQUlOSU5HX1RFWFQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudENoYXJJbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoY3VycmVudENoYXJJbmRleCA8IHRleHQubGVuZ3RoIC0xKSB7XG4gICAgICAgICAgICBhd2FpdCBvbkdldFRleHQodGV4dC5zdWJzdHJpbmcoY3VycmVudENoYXJJbmRleCArIDEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHQgPSBhd2FpdCByZWFkSW5wdXQoKTtcbiAgICB9XG5cbiAgICBhd2FpdCByZWFkYWJsZVN0cmVhbS5kZXN0cm95KCk7XG5cbn07XG5cbmNvbnN0IG5ld091dHB1dFdyaXRlciA9IChmbHVzaEJvdW5kYXJ5LCB3cml0YWJsZVN0cmVhbSkgPT4ge1xuICAgIFxuICAgIGxldCBjdXJyZW50QnVmZmVyID0gbnVsbDtcblxuICAgIHJldHVybiBhc3luYyAodGV4dCkgPT4ge1xuXG4gICAgICAgIGlmKGlzU3RyaW5nKHRleHQpICYmIGN1cnJlbnRCdWZmZXIgPT09IG51bGwpXG4gICAgICAgICAgICBjdXJyZW50QnVmZmVyID0gQnVmZmVyLmZyb20odGV4dCwgXCJ1dGY4XCIpO1xuICAgICAgICBlbHNlIGlmKGlzU3RyaW5nKHRleHQpKVxuICAgICAgICAgICAgY3VycmVudEJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoW1xuICAgICAgICAgICAgICAgIGN1cnJlbnRCdWZmZXIsXG4gICAgICAgICAgICAgICAgQnVmZmVyLmZyb20odGV4dCwgXCJ1dGY4XCIpXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgXG4gICAgICAgIGlmKGN1cnJlbnRCdWZmZXIgIT09IG51bGwgJiZcbiAgICAgICAgICAgIChjdXJyZW50QnVmZmVyLmxlbmd0aCA+IGZsdXNoQm91bmRhcnlcbiAgICAgICAgICAgICB8fCAhaXNTdHJpbmcodGV4dCkpKSB7XG5cbiAgICAgICAgICAgIGF3YWl0IHdyaXRhYmxlU3RyZWFtLndyaXRlKGN1cnJlbnRCdWZmZXIpO1xuICAgICAgICAgICAgY3VycmVudEJ1ZmZlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5jb25zdCBuZXdJbnB1dFJlYWRlciA9IChyZWFkYWJsZVN0cmVhbSkgPT4ge1xuXG4gICAgY29uc3QgZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKCd1dGY4Jyk7XG4gICAgbGV0IHJlbWFpbmluZ0J5dGVzID0gW107XG5cbiAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgIGxldCBuZXh0Qnl0ZXNCdWZmZXIgPSBhd2FpdCByZWFkYWJsZVN0cmVhbS5yZWFkKEJVRkZFUl9NQVhfQllURVMpO1xuICAgICAgICBjb25zdCByZW1haW5pbmdCdWZmZXIgPSBCdWZmZXIuZnJvbShyZW1haW5pbmdCeXRlcyk7XG5cbiAgICAgICAgaWYoIW5leHRCeXRlc0J1ZmZlcikgbmV4dEJ5dGVzQnVmZmVyID0gQnVmZmVyLmZyb20oW10pO1xuXG4gICAgICAgIGNvbnN0IG1vcmVUb1JlYWQgPSBuZXh0Qnl0ZXNCdWZmZXIubGVuZ3RoID09PSBCVUZGRVJfTUFYX0JZVEVTO1xuXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoXG4gICAgICAgICAgICBbcmVtYWluaW5nQnVmZmVyLCBuZXh0Qnl0ZXNCdWZmZXJdLFxuICAgICAgICAgICAgcmVtYWluaW5nQnVmZmVyLmxlbmd0aCArIG5leHRCeXRlc0J1ZmZlci5sZW5ndGgpO1xuXG4gICAgICAgIGNvbnN0IHRleHQgPSBkZWNvZGVyLndyaXRlKGJ1ZmZlcik7XG4gICAgICAgIHJlbWFpbmluZ0J5dGVzID0gZGVjb2Rlci5lbmQoYnVmZmVyKTtcblxuICAgICAgICBpZighbW9yZVRvUmVhZCAmJiByZW1haW5pbmdCeXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBpZiBmb3IgYW55IHJlYXNvbiwgd2UgaGF2ZSByZW1haW5pbmcgYnl0ZXMgYXQgdGhlIGVuZFxuICAgICAgICAgICAgLy8gb2YgdGhlIHN0cmVhbSwganVzdCBkaXNjYXJkIC0gZG9udCBzZWUgd2h5IHRoaXMgc2hvdWxkXG4gICAgICAgICAgICAvLyBldmVyIGhhcHBlbiwgYnV0IGlmIGl0IGRvZXMsIGl0IGNvdWxkIGNhdXNlIGEgc3RhY2sgb3ZlcmZsb3dcbiAgICAgICAgICAgIHJlbWFpbmluZ0J5dGVzID0gW107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9O1xufTtcblxuY29uc3QgZGVzZXJpYWxpemVSb3cgPSAoc2NoZW1hLCByb3dUZXh0KSA9PiB7XG4gICAgbGV0IGN1cnJlbnRQcm9wSW5kZXggPSAwO1xuICAgIGxldCBjdXJyZW50Q2hhckluZGV4ID0gMDtcbiAgICBsZXQgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XG4gICAgbGV0IGlzRXNjYXBlZCA9IGZhbHNlO1xuICAgIGNvbnN0IGl0ZW0gPSB7fTtcblxuICAgIGNvbnN0IHNldEN1cnJlbnRQcm9wID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJyZW50UHJvcCA9IHNjaGVtYVtjdXJyZW50UHJvcEluZGV4XTtcbiAgICAgICAgY29uc3QgdHlwZSA9IGdldFR5cGUoY3VycmVudFByb3AudHlwZSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY3VycmVudFZhbHVlVGV4dCA9PT0gXCJcIlxuICAgICAgICAgICAgICAgICAgICAgID8gdHlwZS5nZXREZWZhdWx0VmFsdWUoKVxuICAgICAgICAgICAgICAgICAgICAgIDogdHlwZS5zYWZlUGFyc2VWYWx1ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCk7XG4gICAgICAgIGl0ZW1bY3VycmVudFByb3AubmFtZV0gPSB2YWx1ZTtcbiAgICB9O1xuICAgIFxuICAgIHdoaWxlKGN1cnJlbnRQcm9wSW5kZXggPCBzY2hlbWEubGVuZ3RoKSB7XG5cbiAgICAgICAgaWYoY3VycmVudENoYXJJbmRleCA8IHJvd1RleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2hhciA9IHJvd1RleHRbY3VycmVudENoYXJJbmRleF07XG4gICAgICAgICAgICBpZihpc0VzY2FwZWQpIHtcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCJyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCArPSBcIlxcclwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZVRleHQgKz0gY3VycmVudENoYXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlzRXNjYXBlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCIsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0Q3VycmVudFByb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQcm9wSW5kZXgrKztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoY3VycmVudENoYXIgPT09IFwiXFxcXFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzRXNjYXBlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyZW50Q2hhckluZGV4Kys7IFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VycmVudFZhbHVlVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICBzZXRDdXJyZW50UHJvcCgpO1xuICAgICAgICAgICAgY3VycmVudFByb3BJbmRleCsrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZW07XG59O1xuXG5leHBvcnQgY29uc3Qgc2VyaWFsaXplSXRlbSA9IChzY2hlbWEsIGl0ZW0pICA9PiB7XG5cbiAgICBsZXQgcm93VGV4dCA9IFwiXCJcblxuICAgIGZvcihsZXQgcHJvcCBvZiBzY2hlbWEpIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IGdldFR5cGUocHJvcC50eXBlKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBoYXMocHJvcC5uYW1lKShpdGVtKVxuICAgICAgICAgICAgICAgICAgICAgID8gaXRlbVtwcm9wLm5hbWVdXG4gICAgICAgICAgICAgICAgICAgICAgOiB0eXBlLmdldERlZmF1bHRWYWx1ZSgpXG4gICAgICAgIFxuICAgICAgICBjb25zdCB2YWxTdHIgPSB0eXBlLnN0cmluZ2lmeSh2YWx1ZSk7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHZhbFN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudENoYXIgPSB2YWxTdHJbaV07XG4gICAgICAgICAgICBpZihjdXJyZW50Q2hhciA9PT0gXCIsXCIgXG4gICAgICAgICAgICAgICB8fCBjdXJyZW50Q2hhciA9PT0gXCJcXHJcIiBcbiAgICAgICAgICAgICAgIHx8IGN1cnJlbnRDaGFyID09PSBcIlxcXFxcIikge1xuICAgICAgICAgICAgICAgIHJvd1RleHQgKz0gXCJcXFxcXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGN1cnJlbnRDaGFyID09PSBcIlxcclwiKSB7XG4gICAgICAgICAgICAgICAgcm93VGV4dCArPSBcInJcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcm93VGV4dCArPSBjdXJyZW50Q2hhcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJvd1RleHQgKz0gXCIsXCI7XG4gICAgfVxuXG4gICAgcm93VGV4dCArPSBcIlxcclwiO1xuICAgIHJldHVybiByb3dUZXh0O1xufTsiLCJpbXBvcnQgbHVuciBmcm9tICdsdW5yJztcbmltcG9ydCB7cHJvbWlzZVJlYWRhYmxlU3RyZWFtfSBmcm9tIFwiLi9wcm9taXNlUmVhZGFibGVTdHJlYW1cIjtcbmltcG9ydCB7IGNyZWF0ZUluZGV4RmlsZSB9IGZyb20gJy4vc2hhcmRpbmcnO1xuaW1wb3J0IHsgZ2VuZXJhdGVTY2hlbWEgfSBmcm9tICcuL2luZGV4U2NoZW1hQ3JlYXRvcic7XG5pbXBvcnQgeyBnZXRJbmRleFJlYWRlciwgQ09OVElOVUVfUkVBRElOR19SRUNPUkRTIH0gZnJvbSAnLi9zZXJpYWxpemVyJztcblxuZXhwb3J0IGNvbnN0IHJlYWRJbmRleCA9IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KSA9PiB7XG4gIGNvbnN0IHJlY29yZHMgPSBbXTtcbiAgY29uc3QgZG9SZWFkID0gaXRlcmF0ZUluZGV4KFxuICAgICAgICBhc3luYyBpdGVtID0+IHtcbiAgICAgIHJlY29yZHMucHVzaChpdGVtKTtcbiAgICAgIHJldHVybiBDT05USU5VRV9SRUFESU5HX1JFQ09SRFM7XG4gICAgfSxcbiAgICAgICAgYXN5bmMgKCkgPT4gcmVjb3Jkc1xuICApO1xuXG4gIHJldHVybiBhd2FpdCBkb1JlYWQoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2VhcmNoSW5kZXggPSBhc3luYyAoaGllcmFyY2h5LCBkYXRhc3RvcmUsIGluZGV4LCBpbmRleGVkRGF0YUtleSwgc2VhcmNoUGhyYXNlKSA9PiB7XG4gIGNvbnN0IHJlY29yZHMgPSBbXTtcbiAgY29uc3Qgc2NoZW1hID0gZ2VuZXJhdGVTY2hlbWEoaGllcmFyY2h5LCBpbmRleCk7XG4gIGNvbnN0IGRvUmVhZCA9IGl0ZXJhdGVJbmRleChcbiAgICAgICAgYXN5bmMgaXRlbSA9PiB7XG4gICAgICBjb25zdCBpZHggPSBsdW5yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yZWYoJ2tleScpO1xuICAgICAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIHNjaGVtYSkge1xuICAgICAgICAgIHRoaXMuZmllbGQoZmllbGQubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGQoaXRlbSk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNlYXJjaFJlc3VsdHMgPSBpZHguc2VhcmNoKHNlYXJjaFBocmFzZSk7XG4gICAgICBpZiAoc2VhcmNoUmVzdWx0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaXRlbS5fc2VhcmNoUmVzdWx0ID0gc2VhcmNoUmVzdWx0c1swXTtcbiAgICAgICAgcmVjb3Jkcy5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcbiAgICB9LFxuICAgICAgICBhc3luYyAoKSA9PiByZWNvcmRzXG4gICk7XG5cbiAgcmV0dXJuIGF3YWl0IGRvUmVhZChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KTtcbn07XG5cbmV4cG9ydCBjb25zdCBpdGVyYXRlSW5kZXggPSAob25HZXRJdGVtLCBnZXRGaW5hbFJlc3VsdCkgPT4gYXN5bmMgKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXkpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCByZWFkYWJsZVN0cmVhbSA9IHByb21pc2VSZWFkYWJsZVN0cmVhbShcbiAgICAgICAgYXdhaXQgZGF0YXN0b3JlLnJlYWRhYmxlRmlsZVN0cmVhbShpbmRleGVkRGF0YUtleSlcbiAgICApO1xuXG4gICAgY29uc3QgcmVhZCA9IGdldEluZGV4UmVhZGVyKGhpZXJhcmNoeSwgaW5kZXgsIHJlYWRhYmxlU3RyZWFtKTtcbiAgICBhd2FpdCByZWFkKG9uR2V0SXRlbSk7XG4gICAgcmV0dXJuIGdldEZpbmFsUmVzdWx0KCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhpbmRleGVkRGF0YUtleSkpIHtcbiAgICAgIHRocm93IGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IGNyZWF0ZUluZGV4RmlsZShcbiAgICAgICAgZGF0YXN0b3JlLFxuICAgICAgICBpbmRleGVkRGF0YUtleSxcbiAgICAgICAgaW5kZXgsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBnZXRSZWNvcmRJbmZvIH0gZnJvbSBcIi4uL3JlY29yZEFwaS9yZWNvcmRJbmZvXCI7XG5pbXBvcnQgeyBcbiAgICBnZXRQYXJlbnRLZXksIGdldExhc3RQYXJ0SW5LZXlcbn0gZnJvbSBcIi4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeVwiO1xuaW1wb3J0IHsga2V5U2VwIH0gZnJvbSBcIi4uL2NvbW1vblwiO1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhEaXIgPSAoaGllcmFyY2h5LCBpbmRleEtleSkgPT4ge1xuXG4gICAgY29uc3QgcGFyZW50S2V5ID0gZ2V0UGFyZW50S2V5KGluZGV4S2V5KTtcblxuICAgIGlmKHBhcmVudEtleSA9PT0gXCJcIikgcmV0dXJuIGluZGV4S2V5O1xuICAgIGlmKHBhcmVudEtleSA9PT0ga2V5U2VwKSByZXR1cm4gaW5kZXhLZXk7XG5cbiAgICBjb25zdCByZWNvcmRJbmZvID0gZ2V0UmVjb3JkSW5mbyhcbiAgICAgICAgaGllcmFyY2h5LCBcbiAgICAgICAgcGFyZW50S2V5KTtcbiAgICAgICAgXG4gICAgcmV0dXJuIHJlY29yZEluZm8uY2hpbGQoXG4gICAgICAgIGdldExhc3RQYXJ0SW5LZXkoaW5kZXhLZXkpKTtcbn0iLCJpbXBvcnQgeyBmbGF0dGVuLCBtZXJnZSB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBzYWZlS2V5LCBhcGlXcmFwcGVyLCAkLFxuICBldmVudHMsIGlzTm9uRW1wdHlTdHJpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyByZWFkSW5kZXgsIHNlYXJjaEluZGV4IH0gZnJvbSAnLi4vaW5kZXhpbmcvcmVhZCc7XG5pbXBvcnQge1xuICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXksXG4gIGdldFNoYXJkS2V5c0luUmFuZ2UsXG59IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcbmltcG9ydCB7XG4gIGdldEV4YWN0Tm9kZUZvcktleSwgaXNJbmRleCxcbiAgaXNTaGFyZGVkSW5kZXgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBnZXRJbmRleERpciB9IGZyb20gXCIuL2dldEluZGV4RGlyXCI7XG5cbmV4cG9ydCBjb25zdCBsaXN0SXRlbXMgPSBhcHAgPT4gYXN5bmMgKGluZGV4S2V5LCBvcHRpb25zKSA9PiB7XG4gIGluZGV4S2V5ID0gc2FmZUtleShpbmRleEtleSk7XG4gIHJldHVybiBhcGlXcmFwcGVyKFxuICAgIGFwcCxcbiAgICBldmVudHMuaW5kZXhBcGkubGlzdEl0ZW1zLFxuICAgIHBlcm1pc3Npb24ucmVhZEluZGV4LmlzQXV0aG9yaXplZChpbmRleEtleSksXG4gICAgeyBpbmRleEtleSwgb3B0aW9ucyB9LFxuICAgIF9saXN0SXRlbXMsIGFwcCwgaW5kZXhLZXksIG9wdGlvbnMsXG4gICk7XG59XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0geyByYW5nZVN0YXJ0UGFyYW1zOiBudWxsLCByYW5nZUVuZFBhcmFtczogbnVsbCwgc2VhcmNoUGhyYXNlOiBudWxsIH07XG5cbmNvbnN0IF9saXN0SXRlbXMgPSBhc3luYyAoYXBwLCBpbmRleEtleSwgb3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zKSA9PiB7XG4gIGNvbnN0IHsgc2VhcmNoUGhyYXNlLCByYW5nZVN0YXJ0UGFyYW1zLCByYW5nZUVuZFBhcmFtcyB9ID0gJCh7fSwgW1xuICAgIG1lcmdlKG9wdGlvbnMpLFxuICAgIG1lcmdlKGRlZmF1bHRPcHRpb25zKSxcbiAgXSk7XG5cbiAgY29uc3QgZ2V0SXRlbXMgPSBhc3luYyBpbmRleGVkRGF0YUtleSA9PiAoaXNOb25FbXB0eVN0cmluZyhzZWFyY2hQaHJhc2UpXG4gICAgPyBhd2FpdCBzZWFyY2hJbmRleChcbiAgICAgIGFwcC5oaWVyYXJjaHksXG4gICAgICBhcHAuZGF0YXN0b3JlLFxuICAgICAgaW5kZXhOb2RlLFxuICAgICAgaW5kZXhlZERhdGFLZXksXG4gICAgICBzZWFyY2hQaHJhc2UsXG4gICAgKVxuICAgIDogYXdhaXQgcmVhZEluZGV4KFxuICAgICAgYXBwLmhpZXJhcmNoeSxcbiAgICAgIGFwcC5kYXRhc3RvcmUsXG4gICAgICBpbmRleE5vZGUsXG4gICAgICBpbmRleGVkRGF0YUtleSxcbiAgICApKTtcblxuICBpbmRleEtleSA9IHNhZmVLZXkoaW5kZXhLZXkpO1xuICBjb25zdCBpbmRleE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JLZXkoYXBwLmhpZXJhcmNoeSkoaW5kZXhLZXkpO1xuICBjb25zdCBpbmRleERpciA9IGdldEluZGV4RGlyKGFwcC5oaWVyYXJjaHksIGluZGV4S2V5KTtcblxuICBpZiAoIWlzSW5kZXgoaW5kZXhOb2RlKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ3N1cHBsaWVkIGtleSBpcyBub3QgYW4gaW5kZXgnKTsgfVxuXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleE5vZGUpKSB7XG4gICAgY29uc3Qgc2hhcmRLZXlzID0gYXdhaXQgZ2V0U2hhcmRLZXlzSW5SYW5nZShcbiAgICAgIGFwcCwgaW5kZXhOb2RlLCBpbmRleERpciwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMsXG4gICAgKTtcbiAgICBjb25zdCBpdGVtcyA9IFtdO1xuICAgIGZvciAoY29uc3QgayBvZiBzaGFyZEtleXMpIHtcbiAgICAgIGl0ZW1zLnB1c2goYXdhaXQgZ2V0SXRlbXMoaykpO1xuICAgIH1cbiAgICByZXR1cm4gZmxhdHRlbihpdGVtcyk7XG4gIH1cbiAgcmV0dXJuIGF3YWl0IGdldEl0ZW1zKFxuICAgIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleShpbmRleERpciksXG4gICk7XG59O1xuIiwiaW1wb3J0IHsgbWFwLCBpc1N0cmluZywgaGFzLCBzb21lIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIGdldEV4YWN0Tm9kZUZvcktleSxcbiAgZmluZEZpZWxkLCBnZXROb2RlLCBpc0dsb2JhbEluZGV4LFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgbGlzdEl0ZW1zIH0gZnJvbSAnLi4vaW5kZXhBcGkvbGlzdEl0ZW1zJztcbmltcG9ydCB7XG4gICQsIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsIHNhZmVLZXlcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldEluZGV4S2V5X0Jhc2VkT25EZWNlbmRhbnQgfSBmcm9tICcuLi9pbmRleGluZy9zaGFyZGluZyc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBnZXRDb250ZXh0ID0gYXBwID0+IHJlY29yZEtleSA9PiB7XG4gIHJlY29yZEtleSA9IHNhZmVLZXkocmVjb3JkS2V5KTtcbiAgcmV0dXJuICBhcGlXcmFwcGVyU3luYyhcbiAgICBhcHAsXG4gICAgZXZlbnRzLnJlY29yZEFwaS5nZXRDb250ZXh0LFxuICAgIHBlcm1pc3Npb24ucmVhZFJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkS2V5KSxcbiAgICB7IHJlY29yZEtleSB9LFxuICAgIF9nZXRDb250ZXh0LCBhcHAsIHJlY29yZEtleSxcbiAgKTtcbn1cblxuZXhwb3J0IGNvbnN0IF9nZXRDb250ZXh0ID0gKGFwcCwgcmVjb3JkS2V5KSA9PiB7XG4gIHJlY29yZEtleSA9IHNhZmVLZXkocmVjb3JkS2V5KTtcbiAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvcktleShhcHAuaGllcmFyY2h5KShyZWNvcmRLZXkpO1xuXG4gIGNvbnN0IGNhY2hlZFJlZmVyZW5jZUluZGV4ZXMgPSB7fTtcblxuICBjb25zdCBsYXp5TG9hZFJlZmVyZW5jZUluZGV4ID0gYXN5bmMgKHR5cGVPcHRpb25zKSA9PiB7XG4gICAgaWYgKCFoYXModHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5KShjYWNoZWRSZWZlcmVuY2VJbmRleGVzKSkge1xuICAgICAgY2FjaGVkUmVmZXJlbmNlSW5kZXhlc1t0eXBlT3B0aW9ucy5pbmRleE5vZGVLZXldID0ge1xuICAgICAgICB0eXBlT3B0aW9ucyxcbiAgICAgICAgZGF0YTogYXdhaXQgcmVhZFJlZmVyZW5jZUluZGV4KFxuICAgICAgICAgIGFwcCwgcmVjb3JkS2V5LCB0eXBlT3B0aW9ucyxcbiAgICAgICAgKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhY2hlZFJlZmVyZW5jZUluZGV4ZXNbdHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5XTtcbiAgfTtcblxuICBjb25zdCBnZXRUeXBlT3B0aW9ucyA9IHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSA9PiAoaXNTdHJpbmcodHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKVxuICAgID8gZmluZEZpZWxkKHJlY29yZE5vZGUsIHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSlcbiAgICAgIC50eXBlT3B0aW9uc1xuICAgIDogdHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKTtcblxuICByZXR1cm4ge1xuICAgIHJlZmVyZW5jZUV4aXN0czogYXN5bmMgKHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSwga2V5KSA9PiB7XG4gICAgICBjb25zdCB0eXBlT3B0aW9ucyA9IGdldFR5cGVPcHRpb25zKHR5cGVPcHRpb25zX29yX2ZpZWxkTmFtZSk7XG4gICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGxhenlMb2FkUmVmZXJlbmNlSW5kZXgodHlwZU9wdGlvbnMpO1xuICAgICAgcmV0dXJuIHNvbWUoaSA9PiBpLmtleSA9PT0ga2V5KShkYXRhKTtcbiAgICB9LFxuICAgIHJlZmVyZW5jZU9wdGlvbnM6IGFzeW5jICh0eXBlT3B0aW9uc19vcl9maWVsZE5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHR5cGVPcHRpb25zID0gZ2V0VHlwZU9wdGlvbnModHlwZU9wdGlvbnNfb3JfZmllbGROYW1lKTtcbiAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgbGF6eUxvYWRSZWZlcmVuY2VJbmRleCh0eXBlT3B0aW9ucyk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9LFxuICAgIHJlY29yZE5vZGUsXG4gIH07XG59O1xuXG5jb25zdCByZWFkUmVmZXJlbmNlSW5kZXggPSBhc3luYyAoYXBwLCByZWNvcmRLZXksIHR5cGVPcHRpb25zKSA9PiB7XG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldE5vZGUoYXBwLmhpZXJhcmNoeSwgdHlwZU9wdGlvbnMuaW5kZXhOb2RlS2V5KTtcbiAgY29uc3QgaW5kZXhLZXkgPSBpc0dsb2JhbEluZGV4KGluZGV4Tm9kZSlcbiAgICA/IGluZGV4Tm9kZS5ub2RlS2V5KClcbiAgICA6IGdldEluZGV4S2V5X0Jhc2VkT25EZWNlbmRhbnQoXG4gICAgICByZWNvcmRLZXksIGluZGV4Tm9kZSxcbiAgICApO1xuXG4gIGNvbnN0IGl0ZW1zID0gYXdhaXQgbGlzdEl0ZW1zKGFwcCkoaW5kZXhLZXkpO1xuICByZXR1cm4gJChpdGVtcywgW1xuICAgIG1hcChpID0+ICh7XG4gICAgICBrZXk6IGkua2V5LFxuICAgICAgdmFsdWU6IGlbdHlwZU9wdGlvbnMuZGlzcGxheVZhbHVlXSxcbiAgICB9KSksXG4gIF0pO1xufTtcbiIsImltcG9ydCB7XG4gIG1hcCwgcmVkdWNlLCBmaWx0ZXIsXG4gIGlzRW1wdHksIGZsYXR0ZW4sIGVhY2gsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBjb21waWxlRXhwcmVzc2lvbiB9IGZyb20gJ0BueC1qcy9jb21waWxlci11dGlsJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBnZXRFeGFjdE5vZGVGb3JLZXkgfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgdmFsaWRhdGVGaWVsZFBhcnNlLCB2YWxpZGF0ZVR5cGVDb25zdHJhaW50cyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7ICQsIGlzTm90aGluZywgaXNOb25FbXB0eVN0cmluZyB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBfZ2V0Q29udGV4dCB9IGZyb20gJy4vZ2V0Q29udGV4dCc7XG5cbmNvbnN0IGZpZWxkUGFyc2VFcnJvciA9IChmaWVsZE5hbWUsIHZhbHVlKSA9PiAoe1xuICBmaWVsZHM6IFtmaWVsZE5hbWVdLFxuICBtZXNzYWdlOiBgQ291bGQgbm90IHBhcnNlIGZpZWxkICR7ZmllbGROYW1lfToke3ZhbHVlfWAsXG59KTtcblxuY29uc3QgdmFsaWRhdGVBbGxGaWVsZFBhcnNlID0gKHJlY29yZCwgcmVjb3JkTm9kZSkgPT4gJChyZWNvcmROb2RlLmZpZWxkcywgW1xuICBtYXAoZiA9PiAoeyBuYW1lOiBmLm5hbWUsIHBhcnNlUmVzdWx0OiB2YWxpZGF0ZUZpZWxkUGFyc2UoZiwgcmVjb3JkKSB9KSksXG4gIHJlZHVjZSgoZXJyb3JzLCBmKSA9PiB7XG4gICAgaWYgKGYucGFyc2VSZXN1bHQuc3VjY2VzcykgcmV0dXJuIGVycm9ycztcbiAgICBlcnJvcnMucHVzaChcbiAgICAgIGZpZWxkUGFyc2VFcnJvcihmLm5hbWUsIGYucGFyc2VSZXN1bHQudmFsdWUpLFxuICAgICk7XG4gICAgcmV0dXJuIGVycm9ycztcbiAgfSwgW10pLFxuXSk7XG5cbmNvbnN0IHZhbGlkYXRlQWxsVHlwZUNvbnN0cmFpbnRzID0gYXN5bmMgKHJlY29yZCwgcmVjb3JkTm9kZSwgY29udGV4dCkgPT4ge1xuICBjb25zdCBlcnJvcnMgPSBbXTtcbiAgZm9yIChjb25zdCBmaWVsZCBvZiByZWNvcmROb2RlLmZpZWxkcykge1xuICAgICQoYXdhaXQgdmFsaWRhdGVUeXBlQ29uc3RyYWludHMoZmllbGQsIHJlY29yZCwgY29udGV4dCksIFtcbiAgICAgIGZpbHRlcihpc05vbkVtcHR5U3RyaW5nKSxcbiAgICAgIG1hcChtID0+ICh7IG1lc3NhZ2U6IG0sIGZpZWxkczogW2ZpZWxkLm5hbWVdIH0pKSxcbiAgICAgIGVhY2goZSA9PiBlcnJvcnMucHVzaChlKSksXG4gICAgXSk7XG4gIH1cbiAgcmV0dXJuIGVycm9ycztcbn07XG5cbmNvbnN0IHJ1blJlY29yZFZhbGlkYXRpb25SdWxlcyA9IChyZWNvcmQsIHJlY29yZE5vZGUpID0+IHtcbiAgY29uc3QgcnVuVmFsaWRhdGlvblJ1bGUgPSAocnVsZSkgPT4ge1xuICAgIGNvbnN0IGlzVmFsaWQgPSBjb21waWxlRXhwcmVzc2lvbihydWxlLmV4cHJlc3Npb25XaGVuVmFsaWQpO1xuICAgIGNvbnN0IGV4cHJlc3Npb25Db250ZXh0ID0geyByZWNvcmQsIF8gfTtcbiAgICByZXR1cm4gKGlzVmFsaWQoZXhwcmVzc2lvbkNvbnRleHQpXG4gICAgICA/IHsgdmFsaWQ6IHRydWUgfVxuICAgICAgOiAoe1xuICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgIGZpZWxkczogcnVsZS5pbnZhbGlkRmllbGRzLFxuICAgICAgICBtZXNzYWdlOiBydWxlLm1lc3NhZ2VXaGVuSW52YWxpZCxcbiAgICAgIH0pKTtcbiAgfTtcblxuICByZXR1cm4gJChyZWNvcmROb2RlLnZhbGlkYXRpb25SdWxlcywgW1xuICAgIG1hcChydW5WYWxpZGF0aW9uUnVsZSksXG4gICAgZmxhdHRlbixcbiAgICBmaWx0ZXIociA9PiByLnZhbGlkID09PSBmYWxzZSksXG4gICAgbWFwKHIgPT4gKHsgZmllbGRzOiByLmZpZWxkcywgbWVzc2FnZTogci5tZXNzYWdlIH0pKSxcbiAgXSk7XG59O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGUgPSBhcHAgPT4gYXN5bmMgKHJlY29yZCwgY29udGV4dCkgPT4ge1xuICBjb250ZXh0ID0gaXNOb3RoaW5nKGNvbnRleHQpXG4gICAgPyBfZ2V0Q29udGV4dChhcHAsIHJlY29yZC5rZXkpXG4gICAgOiBjb250ZXh0O1xuXG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRFeGFjdE5vZGVGb3JLZXkoYXBwLmhpZXJhcmNoeSkocmVjb3JkLmtleSk7XG4gIGNvbnN0IGZpZWxkUGFyc2VGYWlscyA9IHZhbGlkYXRlQWxsRmllbGRQYXJzZShyZWNvcmQsIHJlY29yZE5vZGUpO1xuXG4gIC8vIG5vbiBwYXJzaW5nIHdvdWxkIGNhdXNlIGZ1cnRoZXIgaXNzdWVzIC0gZXhpdCBoZXJlXG4gIGlmICghaXNFbXB0eShmaWVsZFBhcnNlRmFpbHMpKSB7IHJldHVybiAoeyBpc1ZhbGlkOiBmYWxzZSwgZXJyb3JzOiBmaWVsZFBhcnNlRmFpbHMgfSk7IH1cblxuICBjb25zdCByZWNvcmRWYWxpZGF0aW9uUnVsZUZhaWxzID0gcnVuUmVjb3JkVmFsaWRhdGlvblJ1bGVzKHJlY29yZCwgcmVjb3JkTm9kZSk7XG4gIGNvbnN0IHR5cGVDb250cmFpbnRGYWlscyA9IGF3YWl0IHZhbGlkYXRlQWxsVHlwZUNvbnN0cmFpbnRzKHJlY29yZCwgcmVjb3JkTm9kZSwgY29udGV4dCk7XG5cbiAgaWYgKGlzRW1wdHkoZmllbGRQYXJzZUZhaWxzKVxuICAgICAgICYmIGlzRW1wdHkocmVjb3JkVmFsaWRhdGlvblJ1bGVGYWlscylcbiAgICAgICAmJiBpc0VtcHR5KHR5cGVDb250cmFpbnRGYWlscykpIHtcbiAgICByZXR1cm4gKHsgaXNWYWxpZDogdHJ1ZSwgZXJyb3JzOiBbXSB9KTtcbiAgfVxuXG4gIHJldHVybiAoe1xuICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgIGVycm9yczogXy51bmlvbihmaWVsZFBhcnNlRmFpbHMsIHR5cGVDb250cmFpbnRGYWlscywgcmVjb3JkVmFsaWRhdGlvblJ1bGVGYWlscyksXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IGZpbHRlciB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGlzQ29sbGVjdGlvblJlY29yZCxcbiAgaXNSb290LFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgJCwgYWxsVHJ1ZSwgam9pbktleSB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmNvbnN0IGVuc3VyZUNvbGxlY3Rpb25Jc0luaXRpYWxpc2VkID0gYXN5bmMgKGRhdGFzdG9yZSwgbm9kZSwgZGlyKSA9PiB7XG4gIGlmICghYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhkaXIpKSB7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihkaXIpO1xuICAgIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoam9pbktleShkaXIsIG5vZGUubm9kZUlkKSk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlUm9vdENvbGxlY3Rpb25zID0gYXN5bmMgKGRhdGFzdG9yZSwgaGllcmFyY2h5KSA9PiB7XG4gIGNvbnN0IHJvb3RDb2xsZWN0aW9uUmVjb3JkID0gYWxsVHJ1ZShcbiAgICBuID0+IGlzUm9vdChuLnBhcmVudCgpKSxcbiAgICBpc0NvbGxlY3Rpb25SZWNvcmQsXG4gICk7XG5cbiAgY29uc3QgZmxhdGhpZXJhcmNoeSA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShoaWVyYXJjaHkpO1xuXG4gIGNvbnN0IGNvbGxlY3Rpb25SZWNvcmRzID0gJChmbGF0aGllcmFyY2h5LCBbXG4gICAgZmlsdGVyKHJvb3RDb2xsZWN0aW9uUmVjb3JkKSxcbiAgXSk7XG5cbiAgZm9yIChjb25zdCBjb2wgb2YgY29sbGVjdGlvblJlY29yZHMpIHtcbiAgICBhd2FpdCBlbnN1cmVDb2xsZWN0aW9uSXNJbml0aWFsaXNlZChcbiAgICAgIGRhdGFzdG9yZSxcbiAgICAgIGNvbCxcbiAgICAgIGNvbC5jb2xsZWN0aW9uUGF0aFJlZ3goKVxuICAgICk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlQ2hpbGRDb2xsZWN0aW9ucyA9IGFzeW5jIChhcHAsIHJlY29yZEluZm8pID0+IHtcbiAgY29uc3QgY2hpbGRDb2xsZWN0aW9uUmVjb3JkcyA9ICQocmVjb3JkSW5mby5yZWNvcmROb2RlLCBbXG4gICAgbiA9PiBuLmNoaWxkcmVuLFxuICAgIGZpbHRlcihpc0NvbGxlY3Rpb25SZWNvcmQpLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkQ29sbGVjdGlvblJlY29yZHMpIHtcbiAgICBhd2FpdCBlbnN1cmVDb2xsZWN0aW9uSXNJbml0aWFsaXNlZChcbiAgICAgIGFwcC5kYXRhc3RvcmUsXG4gICAgICBjaGlsZCxcbiAgICAgIHJlY29yZEluZm8uY2hpbGQoY2hpbGQuY29sbGVjdGlvbk5hbWUpLFxuICAgICk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBqb2luS2V5LCBrZXlTZXAsIGdldEhhc2hDb2RlLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0TGFzdFBhcnRJbktleSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5cbmV4cG9ydCBjb25zdCBUUkFOU0FDVElPTlNfRk9MREVSID0gYCR7a2V5U2VwfS50cmFuc2FjdGlvbnNgO1xuZXhwb3J0IGNvbnN0IExPQ0tfRklMRU5BTUUgPSAnbG9jayc7XG5leHBvcnQgY29uc3QgTE9DS19GSUxFX0tFWSA9IGpvaW5LZXkoXG4gIFRSQU5TQUNUSU9OU19GT0xERVIsIExPQ0tfRklMRU5BTUUsXG4pO1xuZXhwb3J0IGNvbnN0IGlkU2VwID0gJyQnO1xuXG5jb25zdCBpc09mVHlwZSA9IHR5cCA9PiB0cmFucyA9PiB0cmFucy50cmFuc2FjdGlvblR5cGUgPT09IHR5cDtcblxuZXhwb3J0IGNvbnN0IENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04gPSAnY3JlYXRlJztcbmV4cG9ydCBjb25zdCBVUERBVEVfUkVDT1JEX1RSQU5TQUNUSU9OID0gJ3VwZGF0ZSc7XG5leHBvcnQgY29uc3QgREVMRVRFX1JFQ09SRF9UUkFOU0FDVElPTiA9ICdkZWxldGUnO1xuZXhwb3J0IGNvbnN0IEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OID0gJ2J1aWxkJztcblxuZXhwb3J0IGNvbnN0IGlzVXBkYXRlID0gaXNPZlR5cGUoVVBEQVRFX1JFQ09SRF9UUkFOU0FDVElPTik7XG5leHBvcnQgY29uc3QgaXNEZWxldGUgPSBpc09mVHlwZShERUxFVEVfUkVDT1JEX1RSQU5TQUNUSU9OKTtcbmV4cG9ydCBjb25zdCBpc0NyZWF0ZSA9IGlzT2ZUeXBlKENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04pO1xuZXhwb3J0IGNvbnN0IGlzQnVpbGRJbmRleCA9IGlzT2ZUeXBlKEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OKTtcblxuZXhwb3J0IGNvbnN0IGtleVRvRm9sZGVyTmFtZSA9IG5vZGVLZXkgPT4gZ2V0SGFzaENvZGUobm9kZUtleSk7XG5cbmV4cG9ydCBjb25zdCBnZXRUcmFuc2FjdGlvbklkID0gKHJlY29yZElkLCB0cmFuc2FjdGlvblR5cGUsIHVuaXF1ZUlkKSA9PiBcbiAgYCR7cmVjb3JkSWR9JHtpZFNlcH0ke3RyYW5zYWN0aW9uVHlwZX0ke2lkU2VwfSR7dW5pcXVlSWR9YDtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkSW5kZXhGb2xkZXIgPSAnLkJVSUxELSc7XG5leHBvcnQgY29uc3Qgbm9kZUtleUhhc2hGcm9tQnVpbGRGb2xkZXIgPSBmb2xkZXIgPT4gZm9sZGVyLnJlcGxhY2UoYnVpbGRJbmRleEZvbGRlciwgJycpO1xuXG5leHBvcnQgY29uc3QgaXNCdWlsZEluZGV4Rm9sZGVyID0ga2V5ID0+IGdldExhc3RQYXJ0SW5LZXkoa2V5KS5zdGFydHNXaXRoKGJ1aWxkSW5kZXhGb2xkZXIpO1xuXG5leHBvcnQgY29uc3QgSW5kZXhOb2RlS2V5Rm9sZGVyID0gaW5kZXhOb2RlS2V5ID0+IGpvaW5LZXkoXG4gIFRSQU5TQUNUSU9OU19GT0xERVIsXG4gIGJ1aWxkSW5kZXhGb2xkZXIgKyBrZXlUb0ZvbGRlck5hbWUoaW5kZXhOb2RlS2V5KSxcbik7XG5cbmV4cG9ydCBjb25zdCBJbmRleE5vZGVLZXlCYXRjaEZvbGRlciA9IChpbmRleE5vZGVLZXksIGNvdW50KSA9PiBcbiAgam9pbktleShJbmRleE5vZGVLZXlGb2xkZXIoaW5kZXhOb2RlS2V5KSwgTWF0aC5mbG9vcihjb3VudCAvIEJVSUxESU5ERVhfQkFUQ0hfQ09VTlQpLnRvU3RyaW5nKCkpO1xuXG5leHBvcnQgY29uc3QgSW5kZXhTaGFyZEtleUZvbGRlciA9IChpbmRleE5vZGVLZXksIGluZGV4U2hhcmRLZXkpID0+IFxuICBqb2luS2V5KEluZGV4Tm9kZUtleUZvbGRlcihpbmRleE5vZGVLZXkpLCBpbmRleFNoYXJkS2V5KTtcblxuZXhwb3J0IGNvbnN0IEJVSUxESU5ERVhfQkFUQ0hfQ09VTlQgPSAxMDAwO1xuZXhwb3J0IGNvbnN0IHRpbWVvdXRNaWxsaXNlY29uZHMgPSAzMCAqIDEwMDA7IC8vIDMwIHNlY3NcbmV4cG9ydCBjb25zdCBtYXhMb2NrUmV0cmllcyA9IDE7XG4iLCJpbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJ3Nob3J0aWQnO1xuaW1wb3J0IHsgam9pbktleSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXRMYXN0UGFydEluS2V5IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7XG4gIEluZGV4Tm9kZUtleUZvbGRlciwgQlVJTERJTkRFWF9CQVRDSF9DT1VOVCxcbiAgSW5kZXhOb2RlS2V5QmF0Y2hGb2xkZXIsIFRSQU5TQUNUSU9OU19GT0xERVIsIGdldFRyYW5zYWN0aW9uSWQsIENSRUFURV9SRUNPUkRfVFJBTlNBQ1RJT04sIFVQREFURV9SRUNPUkRfVFJBTlNBQ1RJT04sXG4gIERFTEVURV9SRUNPUkRfVFJBTlNBQ1RJT04sIEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OLFxufSBmcm9tICcuL3RyYW5zYWN0aW9uc0NvbW1vbic7XG5cblxuZXhwb3J0IGNvbnN0IHRyYW5zYWN0aW9uRm9yQ3JlYXRlUmVjb3JkID0gYXN5bmMgKGFwcCwgcmVjb3JkKSA9PiBhd2FpdCB0cmFuc2FjdGlvbihcbiAgYXBwLmRhdGFzdG9yZSwgQ1JFQVRFX1JFQ09SRF9UUkFOU0FDVElPTixcbiAgcmVjb3JkLmtleSwgeyByZWNvcmQgfSxcbiAgZ2V0VHJhbnNhY3Rpb25LZXlfUmVjb3Jkcyxcbik7XG5cbmV4cG9ydCBjb25zdCB0cmFuc2FjdGlvbkZvclVwZGF0ZVJlY29yZCA9IGFzeW5jIChhcHAsIG9sZFJlY29yZCwgbmV3UmVjb3JkKSA9PiBhd2FpdCB0cmFuc2FjdGlvbihcbiAgYXBwLmRhdGFzdG9yZSwgVVBEQVRFX1JFQ09SRF9UUkFOU0FDVElPTixcbiAgbmV3UmVjb3JkLmtleSwgeyBvbGRSZWNvcmQsIHJlY29yZDogbmV3UmVjb3JkIH0sXG4gIGdldFRyYW5zYWN0aW9uS2V5X1JlY29yZHMsXG4pO1xuXG5leHBvcnQgY29uc3QgdHJhbnNhY3Rpb25Gb3JEZWxldGVSZWNvcmQgPSBhc3luYyAoYXBwLCByZWNvcmQpID0+IGF3YWl0IHRyYW5zYWN0aW9uKFxuICBhcHAuZGF0YXN0b3JlLCBERUxFVEVfUkVDT1JEX1RSQU5TQUNUSU9OLFxuICByZWNvcmQua2V5LCB7IHJlY29yZCB9LFxuICBnZXRUcmFuc2FjdGlvbktleV9SZWNvcmRzLFxuKTtcblxuZXhwb3J0IGNvbnN0IHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleCA9IGFzeW5jIChhcHAsIGluZGV4Tm9kZUtleSwgcmVjb3JkS2V5LCBjb3VudCkgPT4ge1xuICBjb25zdCB0cmFuc2FjdGlvbkZvbGRlciA9IEluZGV4Tm9kZUtleUJhdGNoRm9sZGVyKGluZGV4Tm9kZUtleSwgY291bnQpO1xuICBpZiAoY291bnQgJSBCVUlMRElOREVYX0JBVENIX0NPVU5UID09PSAwKSB7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVGb2xkZXIodHJhbnNhY3Rpb25Gb2xkZXIpO1xuICB9XG5cbiAgcmV0dXJuIGF3YWl0IHRyYW5zYWN0aW9uKFxuICAgIGFwcC5kYXRhc3RvcmUsIEJVSUxEX0lOREVYX1RSQU5TQUNUSU9OLFxuICAgIHJlY29yZEtleSwgeyByZWNvcmRLZXkgfSxcbiAgICBpZCA9PiBqb2luS2V5KHRyYW5zYWN0aW9uRm9sZGVyLCBpZCksXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlQnVpbGRJbmRleEZvbGRlciA9IGFzeW5jIChkYXRhc3RvcmUsIGluZGV4Tm9kZUtleSkgPT4gYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihcbiAgSW5kZXhOb2RlS2V5Rm9sZGVyKGluZGV4Tm9kZUtleSksXG4pO1xuXG5jb25zdCBnZXRUcmFuc2FjdGlvbktleV9SZWNvcmRzID0gaWQgPT4gam9pbktleShUUkFOU0FDVElPTlNfRk9MREVSLCBpZCk7XG5cbmNvbnN0IHRyYW5zYWN0aW9uID0gYXN5bmMgKGRhdGFzdG9yZSwgdHJhbnNhY3Rpb25UeXBlLCByZWNvcmRLZXksIGRhdGEsIGdldFRyYW5zYWN0aW9uS2V5KSA9PiB7XG4gIGNvbnN0IHJlY29yZElkID0gZ2V0TGFzdFBhcnRJbktleShyZWNvcmRLZXkpO1xuICBjb25zdCB1bmlxdWVJZCA9IGdlbmVyYXRlKCk7XG4gIGNvbnN0IGlkID0gZ2V0VHJhbnNhY3Rpb25JZChcbiAgICByZWNvcmRJZCwgdHJhbnNhY3Rpb25UeXBlLCB1bmlxdWVJZCxcbiAgKTtcblxuICBjb25zdCBrZXkgPSBnZXRUcmFuc2FjdGlvbktleShpZCk7XG5cbiAgY29uc3QgdHJhbnMgPSB7XG4gICAgdHJhbnNhY3Rpb25UeXBlLFxuICAgIHJlY29yZEtleSxcbiAgICAuLi5kYXRhLFxuICAgIGlkLFxuICB9O1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKFxuICAgIGtleSwgdHJhbnMsXG4gICk7XG5cbiAgcmV0dXJuIHRyYW5zO1xufTtcbiIsImltcG9ydCB7IGlzU2hhcmRlZEluZGV4IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IGpvaW5LZXkgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0U2hhcmRNYXBLZXksIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleSwgY3JlYXRlSW5kZXhGaWxlIH0gZnJvbSAnLi9zaGFyZGluZyc7XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlSW5kZXggPSBhc3luYyAoZGF0YXN0b3JlLCBkaXIsIGluZGV4KSA9PiB7XG4gIGNvbnN0IGluZGV4RGlyID0gam9pbktleShkaXIsIGluZGV4Lm5hbWUpO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoaW5kZXhEaXIpO1xuXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleCkpIHtcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRmlsZShcbiAgICAgIGdldFNoYXJkTWFwS2V5KGluZGV4RGlyKSxcbiAgICAgICdbXScsXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCBjcmVhdGVJbmRleEZpbGUoXG4gICAgICBkYXRhc3RvcmUsXG4gICAgICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXkoaW5kZXhEaXIpLFxuICAgICAgaW5kZXgsXG4gICAgKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIGNsb25lRGVlcCwgdGFrZSwgdGFrZVJpZ2h0LFxuICBmbGF0dGVuLCBtYXAsIGZpbHRlclxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgaW5pdGlhbGlzZUNoaWxkQ29sbGVjdGlvbnMgfSBmcm9tICcuLi9jb2xsZWN0aW9uQXBpL2luaXRpYWxpc2UnO1xuaW1wb3J0IHsgdmFsaWRhdGUgfSBmcm9tICcuL3ZhbGlkYXRlJztcbmltcG9ydCB7IF9sb2FkRnJvbUluZm8gfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IHtcbiAgYXBpV3JhcHBlciwgZXZlbnRzLCAkLCBqb2luS2V5LFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LCBpc1JlY29yZCwgZ2V0Tm9kZSwgXG4gIGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xuICB0cmFuc2FjdGlvbkZvckNyZWF0ZVJlY29yZCxcbiAgdHJhbnNhY3Rpb25Gb3JVcGRhdGVSZWNvcmQsXG59IGZyb20gJy4uL3RyYW5zYWN0aW9ucy9jcmVhdGUnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgaW5pdGlhbGlzZUluZGV4IH0gZnJvbSAnLi4vaW5kZXhpbmcvaW5pdGlhbGlzZUluZGV4JztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuaW1wb3J0IHsgZ2V0UmVjb3JkSW5mbyB9IGZyb20gXCIuL3JlY29yZEluZm9cIjtcblxuZXhwb3J0IGNvbnN0IHNhdmUgPSBhcHAgPT4gYXN5bmMgKHJlY29yZCwgY29udGV4dCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMucmVjb3JkQXBpLnNhdmUsXG4gIHJlY29yZC5pc05ld1xuICAgID8gcGVybWlzc2lvbi5jcmVhdGVSZWNvcmQuaXNBdXRob3JpemVkKHJlY29yZC5rZXkpXG4gICAgOiBwZXJtaXNzaW9uLnVwZGF0ZVJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkLmtleSksIHsgcmVjb3JkIH0sXG4gIF9zYXZlLCBhcHAsIHJlY29yZCwgY29udGV4dCwgZmFsc2UsXG4pO1xuXG5cbmV4cG9ydCBjb25zdCBfc2F2ZSA9IGFzeW5jIChhcHAsIHJlY29yZCwgY29udGV4dCwgc2tpcFZhbGlkYXRpb24gPSBmYWxzZSkgPT4ge1xuICBjb25zdCByZWNvcmRDbG9uZSA9IGNsb25lRGVlcChyZWNvcmQpO1xuICBpZiAoIXNraXBWYWxpZGF0aW9uKSB7XG4gICAgY29uc3QgdmFsaWRhdGlvblJlc3VsdCA9IGF3YWl0IHZhbGlkYXRlKGFwcCkocmVjb3JkQ2xvbmUsIGNvbnRleHQpO1xuICAgIGlmICghdmFsaWRhdGlvblJlc3VsdC5pc1ZhbGlkKSB7XG4gICAgICBhd2FpdCBhcHAucHVibGlzaChldmVudHMucmVjb3JkQXBpLnNhdmUub25JbnZhbGlkLCB7IHJlY29yZCwgdmFsaWRhdGlvblJlc3VsdCB9KTtcbiAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYFNhdmUgOiBSZWNvcmQgSW52YWxpZCA6ICR7XG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHZhbGlkYXRpb25SZXN1bHQuZXJyb3JzKX1gKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCByZWNvcmRJbmZvID0gZ2V0UmVjb3JkSW5mbyhhcHAuaGllcmFyY2h5LCByZWNvcmQua2V5KTtcbiAgY29uc3Qge1xuICAgIHJlY29yZE5vZGUsIHBhdGhJbmZvLFxuICAgIHJlY29yZEpzb24sIGZpbGVzLFxuICB9ID0gcmVjb3JkSW5mbztcblxuICBpZiAocmVjb3JkQ2xvbmUuaXNOZXcpIHtcbiAgICBcbiAgICBpZighcmVjb3JkTm9kZSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG5vZGUgZm9yIFwiICsgcmVjb3JkLmtleSk7XG5cbiAgICBjb25zdCB0cmFuc2FjdGlvbiA9IGF3YWl0IHRyYW5zYWN0aW9uRm9yQ3JlYXRlUmVjb3JkKFxuICAgICAgYXBwLCByZWNvcmRDbG9uZSxcbiAgICApO1xuICAgIHJlY29yZENsb25lLnRyYW5zYWN0aW9uSWQgPSB0cmFuc2FjdGlvbi5pZDtcbiAgICBhd2FpdCBjcmVhdGVSZWNvcmRGb2xkZXJQYXRoKGFwcC5kYXRhc3RvcmUsIHBhdGhJbmZvKTtcbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihmaWxlcyk7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5jcmVhdGVKc29uKHJlY29yZEpzb24sIHJlY29yZENsb25lKTtcbiAgICBhd2FpdCBpbml0aWFsaXNlUmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMoYXBwLCByZWNvcmRJbmZvKTtcbiAgICBhd2FpdCBpbml0aWFsaXNlQW5jZXN0b3JJbmRleGVzKGFwcCwgcmVjb3JkSW5mbyk7XG4gICAgYXdhaXQgaW5pdGlhbGlzZUNoaWxkQ29sbGVjdGlvbnMoYXBwLCByZWNvcmRJbmZvKTtcbiAgICBhd2FpdCBhcHAucHVibGlzaChldmVudHMucmVjb3JkQXBpLnNhdmUub25SZWNvcmRDcmVhdGVkLCB7XG4gICAgICByZWNvcmQ6IHJlY29yZENsb25lLFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG9sZFJlY29yZCA9IGF3YWl0IF9sb2FkRnJvbUluZm8oYXBwLCByZWNvcmRJbmZvKTtcbiAgICBjb25zdCB0cmFuc2FjdGlvbiA9IGF3YWl0IHRyYW5zYWN0aW9uRm9yVXBkYXRlUmVjb3JkKFxuICAgICAgYXBwLCBvbGRSZWNvcmQsIHJlY29yZENsb25lLFxuICAgICk7XG4gICAgcmVjb3JkQ2xvbmUudHJhbnNhY3Rpb25JZCA9IHRyYW5zYWN0aW9uLmlkO1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUudXBkYXRlSnNvbihcbiAgICAgIHJlY29yZEpzb24sXG4gICAgICByZWNvcmRDbG9uZSxcbiAgICApO1xuICAgIGF3YWl0IGFwcC5wdWJsaXNoKGV2ZW50cy5yZWNvcmRBcGkuc2F2ZS5vblJlY29yZFVwZGF0ZWQsIHtcbiAgICAgIG9sZDogb2xkUmVjb3JkLFxuICAgICAgbmV3OiByZWNvcmRDbG9uZSxcbiAgICB9KTtcbiAgfVxuXG4gIGF3YWl0IGFwcC5jbGVhbnVwVHJhbnNhY3Rpb25zKCk7XG5cbiAgY29uc3QgcmV0dXJuZWRDbG9uZSA9IGNsb25lRGVlcChyZWNvcmRDbG9uZSk7XG4gIHJldHVybmVkQ2xvbmUuaXNOZXcgPSBmYWxzZTtcbiAgcmV0dXJuIHJldHVybmVkQ2xvbmU7XG59O1xuXG5jb25zdCBpbml0aWFsaXNlQW5jZXN0b3JJbmRleGVzID0gYXN5bmMgKGFwcCwgcmVjb3JkSW5mbykgPT4ge1xuICBmb3IgKGNvbnN0IGluZGV4IG9mIHJlY29yZEluZm8ucmVjb3JkTm9kZS5pbmRleGVzKSB7XG4gICAgY29uc3QgaW5kZXhLZXkgPSByZWNvcmRJbmZvLmNoaWxkKGluZGV4Lm5hbWUpO1xuICAgIGlmICghYXdhaXQgYXBwLmRhdGFzdG9yZS5leGlzdHMoaW5kZXhLZXkpKSB7IFxuICAgICAgYXdhaXQgaW5pdGlhbGlzZUluZGV4KGFwcC5kYXRhc3RvcmUsIHJlY29yZEluZm8uZGlyLCBpbmRleCk7IFxuICAgIH1cbiAgfVxufTtcblxuY29uc3QgaW5pdGlhbGlzZVJldmVyc2VSZWZlcmVuY2VJbmRleGVzID0gYXN5bmMgKGFwcCwgcmVjb3JkSW5mbykgPT4ge1xuXG4gIGNvbnN0IGluZGV4Tm9kZXMgPSAkKGZpZWxkc1RoYXRSZWZlcmVuY2VUaGlzUmVjb3JkKGFwcCwgcmVjb3JkSW5mby5yZWNvcmROb2RlKSwgW1xuICAgIG1hcChmID0+ICQoZi50eXBlT3B0aW9ucy5yZXZlcnNlSW5kZXhOb2RlS2V5cywgW1xuICAgICAgbWFwKG4gPT4gZ2V0Tm9kZShcbiAgICAgICAgYXBwLmhpZXJhcmNoeSxcbiAgICAgICAgbixcbiAgICAgICkpLFxuICAgIF0pKSxcbiAgICBmbGF0dGVuLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IGluZGV4Tm9kZSBvZiBpbmRleE5vZGVzKSB7XG4gICAgYXdhaXQgaW5pdGlhbGlzZUluZGV4KFxuICAgICAgYXBwLmRhdGFzdG9yZSwgcmVjb3JkSW5mby5kaXIsIGluZGV4Tm9kZSxcbiAgICApO1xuICB9XG59O1xuXG5jb25zdCBmaWVsZHNUaGF0UmVmZXJlbmNlVGhpc1JlY29yZCA9IChhcHAsIHJlY29yZE5vZGUpID0+ICQoYXBwLmhpZXJhcmNoeSwgW1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGZpbHRlcihpc1JlY29yZCksXG4gIG1hcChuID0+IG4uZmllbGRzKSxcbiAgZmxhdHRlbixcbiAgZmlsdGVyKGZpZWxkUmV2ZXJzZXNSZWZlcmVuY2VUb05vZGUocmVjb3JkTm9kZSkpLFxuXSk7XG5cbmNvbnN0IGNyZWF0ZVJlY29yZEZvbGRlclBhdGggPSBhc3luYyAoZGF0YXN0b3JlLCBwYXRoSW5mbykgPT4ge1xuICBcbiAgY29uc3QgcmVjdXJzaXZlQ3JlYXRlRm9sZGVyID0gYXN5bmMgKHN1YmRpcnMsIGRpcnNUaGF0TmVlZENyZWF0ZWQ9dW5kZWZpbmVkKSA9PiB7XG5cbiAgICAvLyBpdGVyYXRlIGJhY2t3YXJkcyB0aHJvdWdoIGRpcmVjdG9yeSBoaWVyYWNoeVxuICAgIC8vIHVudGlsIHdlIGdldCB0byBhIGZvbGRlciB0aGF0IGV4aXN0cywgdGhlbiBjcmVhdGUgdGhlIHJlc3RcbiAgICAvLyBlLmcgXG4gICAgLy8gLSBzb21lL2ZvbGRlci9oZXJlXG4gICAgLy8gLSBzb21lL2ZvbGRlclxuICAgIC8vIC0gc29tZVxuICAgIGNvbnN0IHRoaXNGb2xkZXIgPSBqb2luS2V5KHBhdGhJbmZvLmJhc2UsIC4uLnN1YmRpcnMpO1xuXG4gICAgaWYoYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyh0aGlzRm9sZGVyKSkge1xuXG4gICAgICBsZXQgY3JlYXRpb25Gb2xkZXIgPSB0aGlzRm9sZGVyO1xuICAgICAgZm9yKGxldCBuZXh0RGlyIG9mIChkaXJzVGhhdE5lZWRDcmVhdGVkIHx8IFtdKSApIHtcbiAgICAgICAgY3JlYXRpb25Gb2xkZXIgPSBqb2luS2V5KGNyZWF0aW9uRm9sZGVyLCBuZXh0RGlyKTtcbiAgICAgICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihjcmVhdGlvbkZvbGRlcik7XG4gICAgICB9XG5cbiAgICB9IGVsc2UgaWYoIWRpcnNUaGF0TmVlZENyZWF0ZWQgfHwgZGlyc1RoYXROZWVkQ3JlYXRlZC5sZW5ndGggPiAwKSB7XG5cbiAgICAgIGRpcnNUaGF0TmVlZENyZWF0ZWQgPSAhZGlyc1RoYXROZWVkQ3JlYXRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICA/IFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDpkaXJzVGhhdE5lZWRDcmVhdGVkO1xuICAgICAgXG4gICAgICBhd2FpdCByZWN1cnNpdmVDcmVhdGVGb2xkZXIoXG4gICAgICAgIHRha2Uoc3ViZGlycy5sZW5ndGggLSAxKShzdWJkaXJzKSxcbiAgICAgICAgWy4uLnRha2VSaWdodCgxKShzdWJkaXJzKSwgLi4uZGlyc1RoYXROZWVkQ3JlYXRlZF1cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgYXdhaXQgcmVjdXJzaXZlQ3JlYXRlRm9sZGVyKHBhdGhJbmZvLnN1YmRpcnMpO1xuXG4gIHJldHVybiBqb2luS2V5KHBhdGhJbmZvLmJhc2UsIC4uLnBhdGhJbmZvLnN1YmRpcnMpO1xuXG59IiwiaW1wb3J0IHtcbiAgc2FmZUtleSwgYXBpV3JhcHBlcixcbiAgZXZlbnRzLCBqb2luS2V5LFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgX2RlbGV0ZVJlY29yZCB9IGZyb20gJy4uL3JlY29yZEFwaS9kZWxldGUnO1xuaW1wb3J0IHsgZ2V0QWxsSWRzSXRlcmF0b3IgfSBmcm9tICcuLi9pbmRleGluZy9hbGxJZHMnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgZ2V0Q29sbGVjdGlvbkRpciB9IGZyb20gXCIuLi9yZWNvcmRBcGkvcmVjb3JkSW5mb1wiO1xuXG5leHBvcnQgY29uc3QgZGVsZXRlQ29sbGVjdGlvbiA9IChhcHAsIGRpc2FibGVDbGVhbnVwID0gZmFsc2UpID0+IGFzeW5jIGtleSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5jb2xsZWN0aW9uQXBpLmRlbGV0ZSxcbiAgcGVybWlzc2lvbi5tYW5hZ2VDb2xsZWN0aW9uLmlzQXV0aG9yaXplZCxcbiAgeyBrZXkgfSxcbiAgX2RlbGV0ZUNvbGxlY3Rpb24sIGFwcCwga2V5LCBkaXNhYmxlQ2xlYW51cCxcbik7XG5cbi8qXG4gIGNvbnN0IHJlY29yZE5vZGUgPSBnZXRDb2xsZWN0aW9uTm9kZShhcHAuaGllcmFyY2h5LCBrZXkpO1xuXG4qL1xuXG5leHBvcnQgY29uc3QgX2RlbGV0ZUNvbGxlY3Rpb24gPSBhc3luYyAoYXBwLCBrZXksIGRpc2FibGVDbGVhbnVwKSA9PiB7XG4gIGtleSA9IHNhZmVLZXkoa2V5KTtcbiAgY29uc3QgY29sbGVjdGlvbkRpciA9IGdldENvbGxlY3Rpb25EaXIoYXBwLmhpZXJhcmNoeSwga2V5KTtcbiAgYXdhaXQgZGVsZXRlUmVjb3JkcyhhcHAsIGtleSk7XG4gIGF3YWl0IGRlbGV0ZUNvbGxlY3Rpb25Gb2xkZXIoYXBwLCBjb2xsZWN0aW9uRGlyKTtcbiAgaWYgKCFkaXNhYmxlQ2xlYW51cCkgeyBhd2FpdCBhcHAuY2xlYW51cFRyYW5zYWN0aW9ucygpOyB9XG59O1xuXG5jb25zdCBkZWxldGVDb2xsZWN0aW9uRm9sZGVyID0gYXN5bmMgKGFwcCwgZGlyKSA9PiBcbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoZGlyKTtcblxuY29uc3QgZGVsZXRlUmVjb3JkcyA9IGFzeW5jIChhcHAsIGtleSkgPT4ge1xuICBcbiAgY29uc3QgaXRlcmF0ZSA9IGF3YWl0IGdldEFsbElkc0l0ZXJhdG9yKGFwcCkoa2V5KTtcblxuICBsZXQgaWRzID0gYXdhaXQgaXRlcmF0ZSgpO1xuICB3aGlsZSAoIWlkcy5kb25lKSB7XG4gICAgaWYgKGlkcy5yZXN1bHQuY29sbGVjdGlvbktleSA9PT0ga2V5KSB7XG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIGlkcy5yZXN1bHQuaWRzKSB7XG4gICAgICAgIGF3YWl0IF9kZWxldGVSZWNvcmQoXG4gICAgICAgICAgYXBwLFxuICAgICAgICAgIGpvaW5LZXkoa2V5LCBpZCksXG4gICAgICAgICAgdHJ1ZSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZHMgPSBhd2FpdCBpdGVyYXRlKCk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBzYWZlS2V5LCBhcGlXcmFwcGVyLFxuICBldmVudHMsIGpvaW5LZXksXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBfbG9hZCB9IGZyb20gJy4vbG9hZCc7XG5pbXBvcnQgeyBfZGVsZXRlQ29sbGVjdGlvbiB9IGZyb20gJy4uL2NvbGxlY3Rpb25BcGkvZGVsZXRlJztcbmltcG9ydCB7XG4gIGdldEV4YWN0Tm9kZUZvcktleVxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgdHJhbnNhY3Rpb25Gb3JEZWxldGVSZWNvcmQgfSBmcm9tICcuLi90cmFuc2FjdGlvbnMvY3JlYXRlJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IGdldFJlY29yZEluZm8gfSBmcm9tICcuL3JlY29yZEluZm8nO1xuXG5leHBvcnQgY29uc3QgZGVsZXRlUmVjb3JkID0gKGFwcCwgZGlzYWJsZUNsZWFudXAgPSBmYWxzZSkgPT4gYXN5bmMga2V5ID0+IHtcbiAga2V5ID0gc2FmZUtleShrZXkpO1xuICByZXR1cm4gYXBpV3JhcHBlcihcbiAgICBhcHAsXG4gICAgZXZlbnRzLnJlY29yZEFwaS5kZWxldGUsXG4gICAgcGVybWlzc2lvbi5kZWxldGVSZWNvcmQuaXNBdXRob3JpemVkKGtleSksXG4gICAgeyBrZXkgfSxcbiAgICBfZGVsZXRlUmVjb3JkLCBhcHAsIGtleSwgZGlzYWJsZUNsZWFudXAsXG4gICk7XG59XG5cbi8vIGNhbGxlZCBkZWxldGVSZWNvcmQgYmVjYXVzZSBkZWxldGUgaXMgYSBrZXl3b3JkXG5leHBvcnQgY29uc3QgX2RlbGV0ZVJlY29yZCA9IGFzeW5jIChhcHAsIGtleSwgZGlzYWJsZUNsZWFudXApID0+IHtcbiAgY29uc3QgcmVjb3JkSW5mbyA9IGdldFJlY29yZEluZm8oYXBwLmhpZXJhcmNoeSwga2V5KTtcbiAga2V5ID0gcmVjb3JkSW5mby5rZXk7XG4gIGNvbnN0IG5vZGUgPSBnZXRFeGFjdE5vZGVGb3JLZXkoYXBwLmhpZXJhcmNoeSkoa2V5KTtcblxuICBjb25zdCByZWNvcmQgPSBhd2FpdCBfbG9hZChhcHAsIGtleSk7XG4gIGF3YWl0IHRyYW5zYWN0aW9uRm9yRGVsZXRlUmVjb3JkKGFwcCwgcmVjb3JkKTtcblxuICBmb3IgKGNvbnN0IGNvbGxlY3Rpb25SZWNvcmQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgIGNvbnN0IGNvbGxlY3Rpb25LZXkgPSBqb2luS2V5KFxuICAgICAga2V5LCBjb2xsZWN0aW9uUmVjb3JkLmNvbGxlY3Rpb25OYW1lLFxuICAgICk7XG4gICAgYXdhaXQgX2RlbGV0ZUNvbGxlY3Rpb24oYXBwLCBjb2xsZWN0aW9uS2V5LCB0cnVlKTtcbiAgfVxuXG4gIGF3YWl0IGFwcC5kYXRhc3RvcmUuZGVsZXRlRm9sZGVyKHJlY29yZEluZm8uZGlyKTtcblxuICBpZiAoIWRpc2FibGVDbGVhbnVwKSB7IGF3YWl0IGFwcC5jbGVhbnVwVHJhbnNhY3Rpb25zKCk7IH1cbn07XG5cbiIsImltcG9ydCB7XG4gIGluY2x1ZGVzLCBmaWx0ZXIsXG4gIG1hcCwgc29tZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnc2hvcnRpZCc7XG5pbXBvcnQgeyBfbG9hZEZyb21JbmZvIH0gZnJvbSAnLi9sb2FkJztcbmltcG9ydCB7XG4gIGFwaVdyYXBwZXIsIGV2ZW50cywgc3BsaXRLZXksXG4gICQsIGpvaW5LZXksIGlzTm90aGluZywgdHJ5QXdhaXRPcklnbm9yZSxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGdldEV4YWN0Tm9kZUZvcktleSB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBpc0xlZ2FsRmlsZW5hbWUgfSBmcm9tICcuLi90eXBlcy9maWxlJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciwgRm9yYmlkZGVuRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcbmltcG9ydCB7IGdldFJlY29yZEluZm8gfSBmcm9tIFwiLi9yZWNvcmRJbmZvXCI7XG5cbmV4cG9ydCBjb25zdCB1cGxvYWRGaWxlID0gYXBwID0+IGFzeW5jIChyZWNvcmRLZXksIHJlYWRhYmxlU3RyZWFtLCByZWxhdGl2ZUZpbGVQYXRoKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5yZWNvcmRBcGkudXBsb2FkRmlsZSxcbiAgcGVybWlzc2lvbi51cGRhdGVSZWNvcmQuaXNBdXRob3JpemVkKHJlY29yZEtleSksXG4gIHsgcmVjb3JkS2V5LCByZWFkYWJsZVN0cmVhbSwgcmVsYXRpdmVGaWxlUGF0aCB9LFxuICBfdXBsb2FkRmlsZSwgYXBwLCByZWNvcmRLZXksIHJlYWRhYmxlU3RyZWFtLCByZWxhdGl2ZUZpbGVQYXRoLFxuKTtcblxuY29uc3QgX3VwbG9hZEZpbGUgPSBhc3luYyAoYXBwLCByZWNvcmRLZXksIHJlYWRhYmxlU3RyZWFtLCByZWxhdGl2ZUZpbGVQYXRoKSA9PiB7XG4gIGlmIChpc05vdGhpbmcocmVjb3JkS2V5KSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKCdSZWNvcmQgS2V5IG5vdCBzdXBwbGllZCcpOyB9XG4gIGlmIChpc05vdGhpbmcocmVsYXRpdmVGaWxlUGF0aCkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignZmlsZSBwYXRoIG5vdCBzdXBwbGllZCcpOyB9XG4gIGlmICghaXNMZWdhbEZpbGVuYW1lKHJlbGF0aXZlRmlsZVBhdGgpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ0lsbGVnYWwgZmlsZW5hbWUnKTsgfVxuXG4gIGNvbnN0IHJlY29yZEluZm8gPSBnZXRSZWNvcmRJbmZvKGFwcC5oaWVyYXJjaHksIHJlY29yZEtleSk7XG4gIGNvbnN0IHJlY29yZCA9IGF3YWl0IF9sb2FkRnJvbUluZm8oYXBwLCByZWNvcmRJbmZvKTtcblxuICBjb25zdCBmdWxsRmlsZVBhdGggPSBzYWZlR2V0RnVsbEZpbGVQYXRoKFxuICAgIHJlY29yZEluZm8uZGlyLCByZWxhdGl2ZUZpbGVQYXRoLFxuICApO1xuXG4gIGNvbnN0IHRlbXBGaWxlUGF0aCA9IGAke2Z1bGxGaWxlUGF0aH1fJHtnZW5lcmF0ZSgpfS50ZW1wYDtcblxuICBjb25zdCBvdXRwdXRTdHJlYW0gPSBhd2FpdCBhcHAuZGF0YXN0b3JlLndyaXRhYmxlRmlsZVN0cmVhbShcbiAgICB0ZW1wRmlsZVBhdGgsXG4gICk7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCkgPT4ge1xuICAgIHJlYWRhYmxlU3RyZWFtLnBpcGUob3V0cHV0U3RyZWFtKTtcbiAgICBvdXRwdXRTdHJlYW0ub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICBvdXRwdXRTdHJlYW0ub24oJ2ZpbmlzaCcsIHJlc29sdmUpO1xuICB9KVxuICAudGhlbigoKSA9PiBhcHAuZGF0YXN0b3JlLmdldEZpbGVTaXplKHRlbXBGaWxlUGF0aCkpXG4gIC50aGVuKHNpemUgPT4ge1xuICAgIGNvbnN0IGlzRXhwZWN0ZWRGaWxlU2l6ZSA9IGNoZWNrRmlsZVNpemVBZ2FpbnN0RmllbGRzKFxuICAgICAgYXBwLCByZWNvcmQsIHJlbGF0aXZlRmlsZVBhdGgsIHNpemVcbiAgICApOyAgXG4gICAgaWYgKCFpc0V4cGVjdGVkRmlsZVNpemUpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgRmllbGRzIGZvciAke3JlbGF0aXZlRmlsZVBhdGh9IGRvIG5vdCBoYXZlIGV4cGVjdGVkIHNpemU6ICR7am9pbignLCcpKGluY29ycmVjdEZpZWxkcyl9YCk7IH0gIFxuXG4gIH0pXG4gIC50aGVuKCgpID0+IHRyeUF3YWl0T3JJZ25vcmUoYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlLCBmdWxsRmlsZVBhdGgpKVxuICAudGhlbigoKSA9PiBhcHAuZGF0YXN0b3JlLnJlbmFtZUZpbGUodGVtcEZpbGVQYXRoLCBmdWxsRmlsZVBhdGgpKTtcblxufTtcblxuY29uc3QgY2hlY2tGaWxlU2l6ZUFnYWluc3RGaWVsZHMgPSAoYXBwLCByZWNvcmQsIHJlbGF0aXZlRmlsZVBhdGgsIGV4cGVjdGVkU2l6ZSkgPT4ge1xuICBjb25zdCByZWNvcmROb2RlID0gZ2V0RXhhY3ROb2RlRm9yS2V5KGFwcC5oaWVyYXJjaHkpKHJlY29yZC5rZXkpO1xuXG4gIGNvbnN0IGluY29ycmVjdEZpbGVGaWVsZHMgPSAkKHJlY29yZE5vZGUuZmllbGRzLCBbXG4gICAgZmlsdGVyKGYgPT4gZi50eXBlID09PSAnZmlsZSdcbiAgICAgICYmIHJlY29yZFtmLm5hbWVdLnJlbGF0aXZlUGF0aCA9PT0gcmVsYXRpdmVGaWxlUGF0aFxuICAgICAgJiYgcmVjb3JkW2YubmFtZV0uc2l6ZSAhPT0gZXhwZWN0ZWRTaXplKSxcbiAgICBtYXAoZiA9PiBmLm5hbWUpLFxuICBdKTtcblxuICBjb25zdCBpbmNvcnJlY3RGaWxlQXJyYXlGaWVsZHMgPSAkKHJlY29yZE5vZGUuZmllbGRzLCBbXG4gICAgZmlsdGVyKGEgPT4gYS50eXBlID09PSAnYXJyYXk8ZmlsZT4nXG4gICAgICAmJiAkKHJlY29yZFthLm5hbWVdLCBbXG4gICAgICAgIHNvbWUoZiA9PiByZWNvcmRbZi5uYW1lXS5yZWxhdGl2ZVBhdGggPT09IHJlbGF0aXZlRmlsZVBhdGhcbiAgICAgICAgICAmJiByZWNvcmRbZi5uYW1lXS5zaXplICE9PSBleHBlY3RlZFNpemUpLFxuICAgICAgXSkpLFxuICAgIG1hcChmID0+IGYubmFtZSksXG4gIF0pO1xuXG4gIGNvbnN0IGluY29ycmVjdEZpZWxkcyA9IFtcbiAgICAuLi5pbmNvcnJlY3RGaWxlRmllbGRzLFxuICAgIC4uLmluY29ycmVjdEZpbGVBcnJheUZpZWxkcyxcbiAgXTtcblxuICBpZiAoaW5jb3JyZWN0RmllbGRzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmV4cG9ydCBjb25zdCBzYWZlR2V0RnVsbEZpbGVQYXRoID0gKHJlY29yZERpciwgcmVsYXRpdmVGaWxlUGF0aCkgPT4ge1xuICBjb25zdCBuYXVnaHR5VXNlciA9ICgpID0+IHsgdGhyb3cgbmV3IEZvcmJpZGRlbkVycm9yKCduYXVnaHR5IG5hdWdodHknKTsgfTtcblxuICBpZiAocmVsYXRpdmVGaWxlUGF0aC5zdGFydHNXaXRoKCcuLicpKSBuYXVnaHR5VXNlcigpO1xuXG4gIGNvbnN0IHBhdGhQYXJ0cyA9IHNwbGl0S2V5KHJlbGF0aXZlRmlsZVBhdGgpO1xuXG4gIGlmIChpbmNsdWRlcygnLi4nKShwYXRoUGFydHMpKSBuYXVnaHR5VXNlcigpO1xuXG4gIGNvbnN0IHJlY29yZEtleVBhcnRzID0gc3BsaXRLZXkocmVjb3JkRGlyKTtcblxuICBjb25zdCBmdWxsUGF0aFBhcnRzID0gW1xuICAgIC4uLnJlY29yZEtleVBhcnRzLFxuICAgICdmaWxlcycsXG4gICAgLi4uZmlsdGVyKHAgPT4gcCAhPT0gJy4nKShwYXRoUGFydHMpLFxuICBdO1xuXG4gIHJldHVybiBqb2luS2V5KGZ1bGxQYXRoUGFydHMpO1xufTtcbiIsImltcG9ydCB7IGFwaVdyYXBwZXIsIGV2ZW50cywgaXNOb3RoaW5nIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IHNhZmVHZXRGdWxsRmlsZVBhdGggfSBmcm9tICcuL3VwbG9hZEZpbGUnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5pbXBvcnQgeyBnZXRSZWNvcmRJbmZvIH0gZnJvbSBcIi4vcmVjb3JkSW5mb1wiO1xuXG5leHBvcnQgY29uc3QgZG93bmxvYWRGaWxlID0gYXBwID0+IGFzeW5jIChyZWNvcmRLZXksIHJlbGF0aXZlUGF0aCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMucmVjb3JkQXBpLnVwbG9hZEZpbGUsXG4gIHBlcm1pc3Npb24ucmVhZFJlY29yZC5pc0F1dGhvcml6ZWQocmVjb3JkS2V5KSxcbiAgeyByZWNvcmRLZXksIHJlbGF0aXZlUGF0aCB9LC8vcmVtb3ZlIGR1cGUga2V5ICdyZWNvcmRLZXknIGZyb20gb2JqZWN0XG4gIF9kb3dubG9hZEZpbGUsIGFwcCwgcmVjb3JkS2V5LCByZWxhdGl2ZVBhdGgsXG4pOyBcblxuXG5jb25zdCBfZG93bmxvYWRGaWxlID0gYXN5bmMgKGFwcCwgcmVjb3JkS2V5LCByZWxhdGl2ZVBhdGgpID0+IHtcbiAgaWYgKGlzTm90aGluZyhyZWNvcmRLZXkpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ1JlY29yZCBLZXkgbm90IHN1cHBsaWVkJyk7IH1cbiAgaWYgKGlzTm90aGluZyhyZWxhdGl2ZVBhdGgpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ2ZpbGUgcGF0aCBub3Qgc3VwcGxpZWQnKTsgfVxuXG4gIGNvbnN0IHtkaXJ9ID0gZ2V0UmVjb3JkSW5mbyhhcHAuaGllcmFyY2h5LCByZWNvcmRLZXkpO1xuICByZXR1cm4gYXdhaXQgYXBwLmRhdGFzdG9yZS5yZWFkYWJsZUZpbGVTdHJlYW0oXG4gICAgc2FmZUdldEZ1bGxGaWxlUGF0aChcbiAgICAgIGRpciwgcmVsYXRpdmVQYXRoLFxuICAgICksXG4gICk7XG59O1xuIiwiaW1wb3J0IHsgZmluZCwgdGFrZSwgdW5pb24gfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgZ2V0RmxhdHRlbmVkSGllcmFyY2h5IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7ICQsIHNwbGl0S2V5LCBqb2luS2V5IH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGN1c3RvbUlkID0gYXBwID0+IChub2RlTmFtZSwgaWQpID0+IHtcbiAgY29uc3Qgbm9kZSA9ICQoYXBwLmhpZXJhcmNoeSwgW1xuICAgIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbiAgICBmaW5kKG4gPT4gbi5uYW1lID09PSBub2RlTmFtZSksXG4gIF0pO1xuXG4gIGlmICghbm9kZSkgdGhyb3cgbmV3IE5vdEZvdW5kRXJyb3IoYENhbm5vdCBmaW5kIG5vZGUgJHtub2RlTmFtZX1gKTtcblxuICByZXR1cm4gYCR7bm9kZS5ub2RlSWR9LSR7aWR9YDtcbn07XG5cbmV4cG9ydCBjb25zdCBzZXRDdXN0b21JZCA9IGFwcCA9PiAocmVjb3JkLCBpZCkgPT4ge1xuICByZWNvcmQuaWQgPSBjdXN0b21JZChhcHApKHJlY29yZC50eXBlLCBpZCk7XG5cbiAgY29uc3Qga2V5UGFydHMgPSBzcGxpdEtleShyZWNvcmQua2V5KTtcblxuICByZWNvcmQua2V5ID0gJChrZXlQYXJ0cywgW1xuICAgIHRha2Uoa2V5UGFydHMubGVuZ3RoIC0gMSksXG4gICAgdW5pb24oW3JlY29yZC5pZF0pLFxuICAgIGpvaW5LZXksXG4gIF0pO1xuXG4gIHJldHVybiByZWNvcmQ7XG59O1xuIiwiaW1wb3J0IHsgZ2V0TmV3LCBnZXROZXdDaGlsZCB9IGZyb20gJy4vZ2V0TmV3JztcbmltcG9ydCB7IGxvYWQgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IHsgdmFsaWRhdGUgfSBmcm9tICcuL3ZhbGlkYXRlJztcbmltcG9ydCB7IGdldENvbnRleHQgfSBmcm9tICcuL2dldENvbnRleHQnO1xuaW1wb3J0IHsgc2F2ZSB9IGZyb20gJy4vc2F2ZSc7XG5pbXBvcnQgeyBkZWxldGVSZWNvcmQgfSBmcm9tICcuL2RlbGV0ZSc7XG5pbXBvcnQgeyB1cGxvYWRGaWxlIH0gZnJvbSAnLi91cGxvYWRGaWxlJztcbmltcG9ydCB7IGRvd25sb2FkRmlsZSB9IGZyb20gJy4vZG93bmxvYWRGaWxlJztcbmltcG9ydCB7IGN1c3RvbUlkLCBzZXRDdXN0b21JZCB9IGZyb20gJy4vY3VzdG9tSWQnO1xuXG5jb25zdCBhcGkgPSBhcHAgPT4gKHtcbiAgZ2V0TmV3OiBnZXROZXcoYXBwKSxcbiAgZ2V0TmV3Q2hpbGQ6IGdldE5ld0NoaWxkKGFwcCksXG4gIHNhdmU6IHNhdmUoYXBwKSxcbiAgbG9hZDogbG9hZChhcHApLFxuICBkZWxldGU6IGRlbGV0ZVJlY29yZChhcHAsIGZhbHNlKSxcbiAgdmFsaWRhdGU6IHZhbGlkYXRlKGFwcCksXG4gIGdldENvbnRleHQ6IGdldENvbnRleHQoYXBwKSxcbiAgdXBsb2FkRmlsZTogdXBsb2FkRmlsZShhcHApLFxuICBkb3dubG9hZEZpbGU6IGRvd25sb2FkRmlsZShhcHApLFxuICBjdXN0b21JZDogY3VzdG9tSWQoYXBwKSxcbiAgc2V0Q3VzdG9tSWQ6IHNldEN1c3RvbUlkKGFwcCksXG59KTtcblxuXG5leHBvcnQgY29uc3QgZ2V0UmVjb3JkQXBpID0gYXBwID0+IGFwaShhcHApO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRSZWNvcmRBcGk7XG4iLCJpbXBvcnQgeyBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGggfSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHtcbiAgaXNOb3RoaW5nLCBzYWZlS2V5LCBhcGlXcmFwcGVyU3luYywgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsb3dlZFJlY29yZFR5cGVzID0gYXBwID0+IGtleSA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuY29sbGVjdGlvbkFwaS5nZXRBbGxvd2VkUmVjb3JkVHlwZXMsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsga2V5IH0sXG4gIF9nZXRBbGxvd2VkUmVjb3JkVHlwZXMsIGFwcCwga2V5LFxuKTtcblxuY29uc3QgX2dldEFsbG93ZWRSZWNvcmRUeXBlcyA9IChhcHAsIGtleSkgPT4ge1xuICBrZXkgPSBzYWZlS2V5KGtleSk7XG4gIGNvbnN0IG5vZGUgPSBnZXROb2RlRm9yQ29sbGVjdGlvblBhdGgoYXBwLmhpZXJhcmNoeSkoa2V5KTtcbiAgcmV0dXJuIGlzTm90aGluZyhub2RlKSA/IFtdIDogW25vZGUubmFtZV07XG59O1xuIiwiaW1wb3J0IHsgZ2V0QWxsSWRzSXRlcmF0b3IgfSBmcm9tICcuLi9pbmRleGluZy9hbGxJZHMnO1xuaW1wb3J0IHsgZ2V0QWxsb3dlZFJlY29yZFR5cGVzIH0gZnJvbSAnLi9nZXRBbGxvd2VkUmVjb3JkVHlwZXMnO1xuaW1wb3J0IHsgZGVsZXRlQ29sbGVjdGlvbiB9IGZyb20gJy4vZGVsZXRlJztcblxuZXhwb3J0IGNvbnN0IGdldENvbGxlY3Rpb25BcGkgPSBhcHAgPT4gKHtcbiAgZ2V0QWxsb3dlZFJlY29yZFR5cGVzOiBnZXRBbGxvd2VkUmVjb3JkVHlwZXMoYXBwKSxcbiAgZ2V0QWxsSWRzSXRlcmF0b3I6IGdldEFsbElkc0l0ZXJhdG9yKGFwcCksXG4gIGRlbGV0ZTogZGVsZXRlQ29sbGVjdGlvbihhcHApLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGdldENvbGxlY3Rpb25BcGk7XG4iLCJpbXBvcnQge1xuICBmaWx0ZXIsIFxuICBpbmNsdWRlcywgc29tZSxcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdldEFsbElkc0l0ZXJhdG9yIH0gZnJvbSAnLi4vaW5kZXhpbmcvYWxsSWRzJztcbmltcG9ydCB7XG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSwgZ2V0UmVjb3JkTm9kZUJ5SWQsXG4gIGdldE5vZGUsIGlzSW5kZXgsXG4gIGlzUmVjb3JkLCBnZXRBbGxvd2VkUmVjb3JkTm9kZXNGb3JJbmRleCxcbiAgZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQge1xuICBqb2luS2V5LCBhcGlXcmFwcGVyLCBldmVudHMsICRcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIGNyZWF0ZUJ1aWxkSW5kZXhGb2xkZXIsXG4gIHRyYW5zYWN0aW9uRm9yQnVpbGRJbmRleCxcbn0gZnJvbSAnLi4vdHJhbnNhY3Rpb25zL2NyZWF0ZSc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi4vYXV0aEFwaS9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuXG4vKiogcmVidWlsZHMgYW4gaW5kZXhcbiAqIEBwYXJhbSB7b2JqZWN0fSBhcHAgLSB0aGUgYXBwbGljYXRpb24gY29udGFpbmVyXG4gKiBAcGFyYW0ge3N0cmluZ30gaW5kZXhOb2RlS2V5IC0gbm9kZSBrZXkgb2YgdGhlIGluZGV4LCB3aGljaCB0aGUgaW5kZXggYmVsb25ncyB0b1xuICovXG5leHBvcnQgY29uc3QgYnVpbGRJbmRleCA9IGFwcCA9PiBhc3luYyBpbmRleE5vZGVLZXkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuaW5kZXhBcGkuYnVpbGRJbmRleCxcbiAgcGVybWlzc2lvbi5tYW5hZ2VJbmRleC5pc0F1dGhvcml6ZWQsXG4gIHsgaW5kZXhOb2RlS2V5IH0sXG4gIF9idWlsZEluZGV4LCBhcHAsIGluZGV4Tm9kZUtleSxcbik7XG5cbmNvbnN0IF9idWlsZEluZGV4ID0gYXN5bmMgKGFwcCwgaW5kZXhOb2RlS2V5KSA9PiB7XG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldE5vZGUoYXBwLmhpZXJhcmNoeSwgaW5kZXhOb2RlS2V5KTtcblxuICBhd2FpdCBjcmVhdGVCdWlsZEluZGV4Rm9sZGVyKGFwcC5kYXRhc3RvcmUsIGluZGV4Tm9kZUtleSk7XG5cbiAgaWYgKCFpc0luZGV4KGluZGV4Tm9kZSkpIHsgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignQnVpbGRJbmRleDogbXVzdCBzdXBwbHkgYW4gaW5kZXhub2RlJyk7IH1cblxuICBpZiAoaW5kZXhOb2RlLmluZGV4VHlwZSA9PT0gJ3JlZmVyZW5jZScpIHtcbiAgICBhd2FpdCBidWlsZFJldmVyc2VSZWZlcmVuY2VJbmRleChcbiAgICAgIGFwcCwgaW5kZXhOb2RlLFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgYnVpbGRIZWlyYXJjaGFsSW5kZXgoXG4gICAgICBhcHAsIGluZGV4Tm9kZSxcbiAgICApO1xuICB9XG5cbiAgYXdhaXQgYXBwLmNsZWFudXBUcmFuc2FjdGlvbnMoKTtcbn07XG5cbmNvbnN0IGJ1aWxkUmV2ZXJzZVJlZmVyZW5jZUluZGV4ID0gYXN5bmMgKGFwcCwgaW5kZXhOb2RlKSA9PiB7XG4gIC8vIEl0ZXJhdGUgdGhyb3VnaCBhbGwgcmVmZXJlbmNJTkcgcmVjb3JkcyxcbiAgLy8gYW5kIHVwZGF0ZSByZWZlcmVuY2VkIGluZGV4IGZvciBlYWNoIHJlY29yZFxuICBsZXQgcmVjb3JkQ291bnQgPSAwO1xuICBjb25zdCByZWZlcmVuY2luZ05vZGVzID0gJChhcHAuaGllcmFyY2h5LCBbXG4gICAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICAgIGZpbHRlcihuID0+IGlzUmVjb3JkKG4pXG4gICAgICAgICAgICAgICAgICAgICYmIHNvbWUoZmllbGRSZXZlcnNlc1JlZmVyZW5jZVRvSW5kZXgoaW5kZXhOb2RlKSkobi5maWVsZHMpKSxcbiAgXSk7XG5cbiAgY29uc3QgY3JlYXRlVHJhbnNhY3Rpb25zRm9yUmVmZXJlbmNpbmdOb2RlID0gYXN5bmMgKHJlZmVyZW5jaW5nTm9kZSkgPT4ge1xuICAgIGNvbnN0IGl0ZXJhdGVSZWZlcmVuY2luZ05vZGVzID0gYXdhaXQgZ2V0QWxsSWRzSXRlcmF0b3IoYXBwKShyZWZlcmVuY2luZ05vZGUuY29sbGVjdGlvbk5vZGVLZXkoKSk7XG5cbiAgICBsZXQgcmVmZXJlbmNpbmdJZEl0ZXJhdG9yID0gYXdhaXQgaXRlcmF0ZVJlZmVyZW5jaW5nTm9kZXMoKTtcbiAgICB3aGlsZSAoIXJlZmVyZW5jaW5nSWRJdGVyYXRvci5kb25lKSB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVmZXJlbmNpbmdJZEl0ZXJhdG9yO1xuICAgICAgZm9yIChjb25zdCBpZCBvZiByZXN1bHQuaWRzKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZEtleSA9IGpvaW5LZXkocmVzdWx0LmNvbGxlY3Rpb25LZXksIGlkKTtcbiAgICAgICAgYXdhaXQgdHJhbnNhY3Rpb25Gb3JCdWlsZEluZGV4KGFwcCwgaW5kZXhOb2RlLm5vZGVLZXkoKSwgcmVjb3JkS2V5LCByZWNvcmRDb3VudCk7XG4gICAgICAgIHJlY29yZENvdW50Kys7XG4gICAgICB9XG4gICAgICByZWZlcmVuY2luZ0lkSXRlcmF0b3IgPSBhd2FpdCBpdGVyYXRlUmVmZXJlbmNpbmdOb2RlcygpO1xuICAgIH1cbiAgfTtcblxuICBmb3IgKGNvbnN0IHJlZmVyZW5jaW5nTm9kZSBvZiByZWZlcmVuY2luZ05vZGVzKSB7XG4gICAgYXdhaXQgY3JlYXRlVHJhbnNhY3Rpb25zRm9yUmVmZXJlbmNpbmdOb2RlKHJlZmVyZW5jaW5nTm9kZSk7XG4gIH1cbn07XG5cbi8qXG5jb25zdCBnZXRBbGxvd2VkUGFyZW50Q29sbGVjdGlvbk5vZGVzID0gKGhpZXJhcmNoeSwgaW5kZXhOb2RlKSA9PiAkKGdldEFsbG93ZWRSZWNvcmROb2Rlc0ZvckluZGV4KGhpZXJhcmNoeSwgaW5kZXhOb2RlKSwgW1xuICBtYXAobiA9PiBuLnBhcmVudCgpKSxcbl0pO1xuKi9cblxuY29uc3QgYnVpbGRIZWlyYXJjaGFsSW5kZXggPSBhc3luYyAoYXBwLCBpbmRleE5vZGUpID0+IHtcbiAgbGV0IHJlY29yZENvdW50ID0gMDtcblxuICBjb25zdCBjcmVhdGVUcmFuc2FjdGlvbnNGb3JJZHMgPSBhc3luYyAoY29sbGVjdGlvbktleSwgaWRzKSA9PiB7XG4gICAgZm9yIChjb25zdCByZWNvcmRJZCBvZiBpZHMpIHtcbiAgICAgIGNvbnN0IHJlY29yZEtleSA9IGpvaW5LZXkoY29sbGVjdGlvbktleSwgcmVjb3JkSWQpO1xuXG4gICAgICBjb25zdCByZWNvcmROb2RlID0gZ2V0UmVjb3JkTm9kZUJ5SWQoXG4gICAgICAgIGFwcC5oaWVyYXJjaHksXG4gICAgICAgIHJlY29yZElkLFxuICAgICAgKTtcblxuICAgICAgaWYgKHJlY29yZE5vZGVBcHBsaWVzKGluZGV4Tm9kZSkocmVjb3JkTm9kZSkpIHtcbiAgICAgICAgYXdhaXQgdHJhbnNhY3Rpb25Gb3JCdWlsZEluZGV4KFxuICAgICAgICAgIGFwcCwgaW5kZXhOb2RlLm5vZGVLZXkoKSxcbiAgICAgICAgICByZWNvcmRLZXksIHJlY29yZENvdW50LFxuICAgICAgICApO1xuICAgICAgICByZWNvcmRDb3VudCsrO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuXG4gIGNvbnN0IGNvbGxlY3Rpb25SZWNvcmRzID0gZ2V0QWxsb3dlZFJlY29yZE5vZGVzRm9ySW5kZXgoYXBwLmhpZXJhcmNoeSwgaW5kZXhOb2RlKTtcblxuICBmb3IgKGNvbnN0IHRhcmdldENvbGxlY3Rpb25SZWNvcmROb2RlIG9mIGNvbGxlY3Rpb25SZWNvcmRzKSB7XG4gICAgY29uc3QgYWxsSWRzSXRlcmF0b3IgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvcihhcHApKHRhcmdldENvbGxlY3Rpb25SZWNvcmROb2RlLmNvbGxlY3Rpb25Ob2RlS2V5KCkpO1xuXG4gICAgbGV0IGFsbElkcyA9IGF3YWl0IGFsbElkc0l0ZXJhdG9yKCk7XG4gICAgd2hpbGUgKGFsbElkcy5kb25lID09PSBmYWxzZSkge1xuICAgICAgYXdhaXQgY3JlYXRlVHJhbnNhY3Rpb25zRm9ySWRzKFxuICAgICAgICBhbGxJZHMucmVzdWx0LmNvbGxlY3Rpb25LZXksXG4gICAgICAgIGFsbElkcy5yZXN1bHQuaWRzLFxuICAgICAgKTtcbiAgICAgIGFsbElkcyA9IGF3YWl0IGFsbElkc0l0ZXJhdG9yKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlY29yZENvdW50O1xufTtcblxuLy8gY29uc3QgY2hvb3NlQ2hpbGRSZWNvcmROb2RlQnlLZXkgPSAoY29sbGVjdGlvbk5vZGUsIHJlY29yZElkKSA9PiBmaW5kKGMgPT4gcmVjb3JkSWQuc3RhcnRzV2l0aChjLm5vZGVJZCkpKGNvbGxlY3Rpb25Ob2RlLmNoaWxkcmVuKTtcblxuY29uc3QgcmVjb3JkTm9kZUFwcGxpZXMgPSBpbmRleE5vZGUgPT4gcmVjb3JkTm9kZSA9PiBpbmNsdWRlcyhyZWNvcmROb2RlLm5vZGVJZCkoaW5kZXhOb2RlLmFsbG93ZWRSZWNvcmROb2RlSWRzKTtcblxuLypcbmNvbnN0IGhhc0FwcGxpY2FibGVEZWNlbmRhbnQgPSAoaGllcmFyY2h5LCBhbmNlc3Rvck5vZGUsIGluZGV4Tm9kZSkgPT4gJChoaWVyYXJjaHksIFtcbiAgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxuICBmaWx0ZXIoXG4gICAgYWxsVHJ1ZShcbiAgICAgIGlzUmVjb3JkLFxuICAgICAgaXNEZWNlbmRhbnQoYW5jZXN0b3JOb2RlKSxcbiAgICAgIHJlY29yZE5vZGVBcHBsaWVzKGluZGV4Tm9kZSksXG4gICAgKSxcbiAgKSxcbl0pO1xuKi9cblxuIC8qXG5jb25zdCBhcHBseUFsbERlY2VuZGFudFJlY29yZHMgPSBhc3luYyAoYXBwLCBjb2xsZWN0aW9uX0tleV9vcl9Ob2RlS2V5LFxuICBpbmRleE5vZGUsIGluZGV4S2V5LCBjdXJyZW50SW5kZXhlZERhdGEsXG4gIGN1cnJlbnRJbmRleGVkRGF0YUtleSwgcmVjb3JkQ291bnQgPSAwKSA9PiB7XG4gIGNvbnN0IGNvbGxlY3Rpb25Ob2RlID0gZ2V0Q29sbGVjdGlvbk5vZGVCeUtleU9yTm9kZUtleShcbiAgICBhcHAuaGllcmFyY2h5LFxuICAgIGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXksXG4gICk7XG5cbiAgY29uc3QgYWxsSWRzSXRlcmF0b3IgPSBhd2FpdCBnZXRBbGxJZHNJdGVyYXRvcihhcHApKGNvbGxlY3Rpb25fS2V5X29yX05vZGVLZXkpO1xuXG5cbiAgY29uc3QgY3JlYXRlVHJhbnNhY3Rpb25zRm9ySWRzID0gYXN5bmMgKGNvbGxlY3Rpb25LZXksIGFsbElkcykgPT4ge1xuICAgIGZvciAoY29uc3QgcmVjb3JkSWQgb2YgYWxsSWRzKSB7XG4gICAgICBjb25zdCByZWNvcmRLZXkgPSBqb2luS2V5KGNvbGxlY3Rpb25LZXksIHJlY29yZElkKTtcblxuICAgICAgY29uc3QgcmVjb3JkTm9kZSA9IGNob29zZUNoaWxkUmVjb3JkTm9kZUJ5S2V5KFxuICAgICAgICBjb2xsZWN0aW9uTm9kZSxcbiAgICAgICAgcmVjb3JkSWQsXG4gICAgICApO1xuXG4gICAgICBpZiAocmVjb3JkTm9kZUFwcGxpZXMoaW5kZXhOb2RlKShyZWNvcmROb2RlKSkge1xuICAgICAgICBhd2FpdCB0cmFuc2FjdGlvbkZvckJ1aWxkSW5kZXgoXG4gICAgICAgICAgYXBwLCBpbmRleE5vZGUubm9kZUtleSgpLFxuICAgICAgICAgIHJlY29yZEtleSwgcmVjb3JkQ291bnQsXG4gICAgICAgICk7XG4gICAgICAgIHJlY29yZENvdW50Kys7XG4gICAgICB9XG5cbiAgICAgIGlmIChoYXNBcHBsaWNhYmxlRGVjZW5kYW50KGFwcC5oaWVyYXJjaHksIHJlY29yZE5vZGUsIGluZGV4Tm9kZSkpIHtcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZENvbGxlY3Rpb25Ob2RlIG9mIHJlY29yZE5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICByZWNvcmRDb3VudCA9IGF3YWl0IGFwcGx5QWxsRGVjZW5kYW50UmVjb3JkcyhcbiAgICAgICAgICAgIGFwcCxcbiAgICAgICAgICAgIGpvaW5LZXkocmVjb3JkS2V5LCBjaGlsZENvbGxlY3Rpb25Ob2RlLmNvbGxlY3Rpb25OYW1lKSxcbiAgICAgICAgICAgIGluZGV4Tm9kZSwgaW5kZXhLZXksIGN1cnJlbnRJbmRleGVkRGF0YSxcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleGVkRGF0YUtleSwgcmVjb3JkQ291bnQsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBsZXQgYWxsSWRzID0gYXdhaXQgYWxsSWRzSXRlcmF0b3IoKTtcbiAgd2hpbGUgKGFsbElkcy5kb25lID09PSBmYWxzZSkge1xuICAgIGF3YWl0IGNyZWF0ZVRyYW5zYWN0aW9uc0ZvcklkcyhcbiAgICAgIGFsbElkcy5yZXN1bHQuY29sbGVjdGlvbktleSxcbiAgICAgIGFsbElkcy5yZXN1bHQuaWRzLFxuICAgICk7XG4gICAgYWxsSWRzID0gYXdhaXQgYWxsSWRzSXRlcmF0b3IoKTtcbiAgfVxuXG4gIHJldHVybiByZWNvcmRDb3VudDtcbn07XG4qL1xuXG5leHBvcnQgZGVmYXVsdCBidWlsZEluZGV4O1xuIiwiaW1wb3J0IHsgaGFzLCBpc051bWJlciwgaXNVbmRlZmluZWQgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgY29tcGlsZUV4cHJlc3Npb24sIGNvbXBpbGVDb2RlIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xuaW1wb3J0IHtcbiAgc2FmZUtleSwgYXBpV3JhcHBlcixcbiAgZXZlbnRzLCBpc05vbkVtcHR5U3RyaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgaXRlcmF0ZUluZGV4IH0gZnJvbSAnLi4vaW5kZXhpbmcvcmVhZCc7XG5pbXBvcnQge1xuICBnZXRVbnNoYXJkZWRJbmRleERhdGFLZXksXG4gIGdldFNoYXJkS2V5c0luUmFuZ2UsXG59IGZyb20gJy4uL2luZGV4aW5nL3NoYXJkaW5nJztcbmltcG9ydCB7XG4gIGdldEV4YWN0Tm9kZUZvcktleSwgaXNJbmRleCxcbiAgaXNTaGFyZGVkSW5kZXgsXG59IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBDT05USU5VRV9SRUFESU5HX1JFQ09SRFMgfSBmcm9tICcuLi9pbmRleGluZy9zZXJpYWxpemVyJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuaW1wb3J0IHsgZ2V0SW5kZXhEaXIgfSBmcm9tIFwiLi9nZXRJbmRleERpclwiO1xuXG5leHBvcnQgY29uc3QgYWdncmVnYXRlcyA9IGFwcCA9PiBhc3luYyAoaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMgPSBudWxsLCByYW5nZUVuZFBhcmFtcyA9IG51bGwpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmluZGV4QXBpLmFnZ3JlZ2F0ZXMsXG4gIHBlcm1pc3Npb24ucmVhZEluZGV4LmlzQXV0aG9yaXplZChpbmRleEtleSksXG4gIHsgaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zIH0sXG4gIF9hZ2dyZWdhdGVzLCBhcHAsIGluZGV4S2V5LCByYW5nZVN0YXJ0UGFyYW1zLCByYW5nZUVuZFBhcmFtcyxcbik7XG5cbmNvbnN0IF9hZ2dyZWdhdGVzID0gYXN5bmMgKGFwcCwgaW5kZXhLZXksIHJhbmdlU3RhcnRQYXJhbXMsIHJhbmdlRW5kUGFyYW1zKSA9PiB7XG4gIGluZGV4S2V5ID0gc2FmZUtleShpbmRleEtleSk7XG4gIGNvbnN0IGluZGV4Tm9kZSA9IGdldEV4YWN0Tm9kZUZvcktleShhcHAuaGllcmFyY2h5KShpbmRleEtleSk7XG4gIGNvbnN0IGluZGV4RGlyID0gZ2V0SW5kZXhEaXIoYXBwLmhpZXJhcmNoeSwgaW5kZXhLZXkpO1xuXG4gIGlmICghaXNJbmRleChpbmRleE5vZGUpKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ3N1cHBsaWVkIGtleSBpcyBub3QgYW4gaW5kZXgnKTsgfVxuXG4gIGlmIChpc1NoYXJkZWRJbmRleChpbmRleE5vZGUpKSB7XG4gICAgY29uc3Qgc2hhcmRLZXlzID0gYXdhaXQgZ2V0U2hhcmRLZXlzSW5SYW5nZShcbiAgICAgIGFwcCwgaW5kZXhOb2RlLCBpbmRleERpciwgcmFuZ2VTdGFydFBhcmFtcywgcmFuZ2VFbmRQYXJhbXMsXG4gICAgKTtcbiAgICBsZXQgYWdncmVnYXRlUmVzdWx0ID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IGsgb2Ygc2hhcmRLZXlzKSB7XG4gICAgICBjb25zdCBzaGFyZFJlc3VsdCA9IGF3YWl0IGdldEFnZ3JlZ2F0ZXMoYXBwLmhpZXJhcmNoeSwgYXBwLmRhdGFzdG9yZSwgaW5kZXhOb2RlLCBrKTtcbiAgICAgIGlmIChhZ2dyZWdhdGVSZXN1bHQgPT09IG51bGwpIHtcbiAgICAgICAgYWdncmVnYXRlUmVzdWx0ID0gc2hhcmRSZXN1bHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZ2dyZWdhdGVSZXN1bHQgPSBtZXJnZVNoYXJkQWdncmVnYXRlKFxuICAgICAgICAgIGFnZ3JlZ2F0ZVJlc3VsdCxcbiAgICAgICAgICBzaGFyZFJlc3VsdCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFnZ3JlZ2F0ZVJlc3VsdDtcbiAgfVxuICByZXR1cm4gYXdhaXQgZ2V0QWdncmVnYXRlcyhcbiAgICBhcHAuaGllcmFyY2h5LFxuICAgIGFwcC5kYXRhc3RvcmUsXG4gICAgaW5kZXhOb2RlLFxuICAgIGdldFVuc2hhcmRlZEluZGV4RGF0YUtleShpbmRleERpciksXG4gICk7XG59O1xuXG5jb25zdCBtZXJnZVNoYXJkQWdncmVnYXRlID0gKHRvdGFscywgc2hhcmQpID0+IHtcbiAgY29uc3QgbWVyZ2VHcm91cGluZyA9ICh0b3QsIHNocikgPT4ge1xuICAgIHRvdC5jb3VudCArPSBzaHIuY291bnQ7XG4gICAgZm9yIChjb25zdCBhZ2dOYW1lIGluIHRvdCkge1xuICAgICAgaWYgKGFnZ05hbWUgPT09ICdjb3VudCcpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgdG90YWdnID0gdG90W2FnZ05hbWVdO1xuICAgICAgY29uc3Qgc2hyYWdnID0gc2hyW2FnZ05hbWVdO1xuICAgICAgdG90YWdnLnN1bSArPSBzaHJhZ2cuc3VtO1xuICAgICAgdG90YWdnLm1heCA9IHRvdGFnZy5tYXggPiBzaHJhZ2cubWF4XG4gICAgICAgID8gdG90YWdnLm1heFxuICAgICAgICA6IHNocmFnZy5tYXg7XG4gICAgICB0b3RhZ2cubWluID0gdG90YWdnLm1pbiA8IHNocmFnZy5taW5cbiAgICAgICAgPyB0b3RhZ2cubWluXG4gICAgICAgIDogc2hyYWdnLm1pbjtcbiAgICAgIHRvdGFnZy5tZWFuID0gdG90YWdnLnN1bSAvIHRvdC5jb3VudDtcbiAgICB9XG4gICAgcmV0dXJuIHRvdDtcbiAgfTtcblxuICBmb3IgKGNvbnN0IGFnZ0dyb3VwRGVmIGluIHRvdGFscykge1xuICAgIGZvciAoY29uc3QgZ3JvdXBpbmcgaW4gc2hhcmRbYWdnR3JvdXBEZWZdKSB7XG4gICAgICBjb25zdCBncm91cGluZ1RvdGFsID0gdG90YWxzW2FnZ0dyb3VwRGVmXVtncm91cGluZ107XG4gICAgICB0b3RhbHNbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXSA9IGlzVW5kZWZpbmVkKGdyb3VwaW5nVG90YWwpXG4gICAgICAgID8gc2hhcmRbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXVxuICAgICAgICA6IG1lcmdlR3JvdXBpbmcoXG4gICAgICAgICAgdG90YWxzW2FnZ0dyb3VwRGVmXVtncm91cGluZ10sXG4gICAgICAgICAgc2hhcmRbYWdnR3JvdXBEZWZdW2dyb3VwaW5nXSxcbiAgICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdG90YWxzO1xufTtcblxuY29uc3QgZ2V0QWdncmVnYXRlcyA9IGFzeW5jIChoaWVyYXJjaHksIGRhdGFzdG9yZSwgaW5kZXgsIGluZGV4ZWREYXRhS2V5KSA9PiB7XG4gIGNvbnN0IGFnZ3JlZ2F0ZVJlc3VsdCA9IHt9O1xuICBjb25zdCBkb1JlYWQgPSBpdGVyYXRlSW5kZXgoXG4gICAgICAgIGFzeW5jIGl0ZW0gPT4ge1xuICAgICAgYXBwbHlJdGVtVG9BZ2dyZWdhdGVSZXN1bHQoXG4gICAgICAgIGluZGV4LCBhZ2dyZWdhdGVSZXN1bHQsIGl0ZW0sXG4gICAgICApO1xuICAgICAgcmV0dXJuIENPTlRJTlVFX1JFQURJTkdfUkVDT1JEUztcbiAgICB9LFxuICAgICAgICBhc3luYyAoKSA9PiBhZ2dyZWdhdGVSZXN1bHRcbiAgKTtcblxuICByZXR1cm4gYXdhaXQgZG9SZWFkKGhpZXJhcmNoeSwgZGF0YXN0b3JlLCBpbmRleCwgaW5kZXhlZERhdGFLZXkpO1xufTtcblxuXG5jb25zdCBhcHBseUl0ZW1Ub0FnZ3JlZ2F0ZVJlc3VsdCA9IChpbmRleE5vZGUsIHJlc3VsdCwgaXRlbSkgPT4ge1xuICBjb25zdCBnZXRJbml0aWFsQWdncmVnYXRlUmVzdWx0ID0gKCkgPT4gKHtcbiAgICBzdW06IDAsIG1lYW46IG51bGwsIG1heDogbnVsbCwgbWluOiBudWxsLFxuICB9KTtcblxuICBjb25zdCBhcHBseUFnZ3JlZ2F0ZVJlc3VsdCA9IChhZ2csIGV4aXN0aW5nLCBjb3VudCkgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gY29tcGlsZUNvZGUoYWdnLmFnZ3JlZ2F0ZWRWYWx1ZSkoeyByZWNvcmQ6IGl0ZW0gfSk7XG5cbiAgICBpZiAoIWlzTnVtYmVyKHZhbHVlKSkgcmV0dXJuIGV4aXN0aW5nO1xuXG4gICAgZXhpc3Rpbmcuc3VtICs9IHZhbHVlO1xuICAgIGV4aXN0aW5nLm1heCA9IHZhbHVlID4gZXhpc3RpbmcubWF4IHx8IGV4aXN0aW5nLm1heCA9PT0gbnVsbFxuICAgICAgPyB2YWx1ZVxuICAgICAgOiBleGlzdGluZy5tYXg7XG4gICAgZXhpc3RpbmcubWluID0gdmFsdWUgPCBleGlzdGluZy5taW4gfHwgZXhpc3RpbmcubWluID09PSBudWxsXG4gICAgICA/IHZhbHVlXG4gICAgICA6IGV4aXN0aW5nLm1pbjtcbiAgICBleGlzdGluZy5tZWFuID0gZXhpc3Rpbmcuc3VtIC8gY291bnQ7XG4gICAgcmV0dXJuIGV4aXN0aW5nO1xuICB9O1xuXG4gIGZvciAoY29uc3QgYWdnR3JvdXAgb2YgaW5kZXhOb2RlLmFnZ3JlZ2F0ZUdyb3Vwcykge1xuICAgIGlmICghaGFzKGFnZ0dyb3VwLm5hbWUpKHJlc3VsdCkpIHtcbiAgICAgIHJlc3VsdFthZ2dHcm91cC5uYW1lXSA9IHt9O1xuICAgIH1cblxuICAgIGNvbnN0IHRoaXNHcm91cFJlc3VsdCA9IHJlc3VsdFthZ2dHcm91cC5uYW1lXTtcblxuICAgIGlmIChpc05vbkVtcHR5U3RyaW5nKGFnZ0dyb3VwLmNvbmRpdGlvbikpIHtcbiAgICAgIGlmICghY29tcGlsZUV4cHJlc3Npb24oYWdnR3JvdXAuY29uZGl0aW9uKSh7IHJlY29yZDogaXRlbSB9KSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgZ3JvdXAgPSBpc05vbkVtcHR5U3RyaW5nKGFnZ0dyb3VwLmdyb3VwQnkpXG4gICAgICA/IGNvbXBpbGVDb2RlKGFnZ0dyb3VwLmdyb3VwQnkpKHsgcmVjb3JkOiBpdGVtIH0pXG4gICAgICA6ICdhbGwnO1xuICAgIGlmICghaXNOb25FbXB0eVN0cmluZyhncm91cCkpIHtcbiAgICAgIGdyb3VwID0gJyhub25lKSc7XG4gICAgfVxuXG4gICAgaWYgKCFoYXMoZ3JvdXApKHRoaXNHcm91cFJlc3VsdCkpIHtcbiAgICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF0gPSB7IGNvdW50OiAwIH07XG4gICAgICBmb3IgKGNvbnN0IGFnZyBvZiBhZ2dHcm91cC5hZ2dyZWdhdGVzKSB7XG4gICAgICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF1bYWdnLm5hbWVdID0gZ2V0SW5pdGlhbEFnZ3JlZ2F0ZVJlc3VsdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXNHcm91cFJlc3VsdFtncm91cF0uY291bnQrKztcblxuICAgIGZvciAoY29uc3QgYWdnIG9mIGFnZ0dyb3VwLmFnZ3JlZ2F0ZXMpIHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nVmFsdWVzID0gdGhpc0dyb3VwUmVzdWx0W2dyb3VwXVthZ2cubmFtZV07XG4gICAgICB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdW2FnZy5uYW1lXSA9IGFwcGx5QWdncmVnYXRlUmVzdWx0KFxuICAgICAgICBhZ2csIGV4aXN0aW5nVmFsdWVzLFxuICAgICAgICB0aGlzR3JvdXBSZXN1bHRbZ3JvdXBdLmNvdW50LFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBidWlsZEluZGV4IH0gZnJvbSAnLi9idWlsZEluZGV4JztcbmltcG9ydCB7IGxpc3RJdGVtcyB9IGZyb20gJy4vbGlzdEl0ZW1zJztcbmltcG9ydCB7IGFnZ3JlZ2F0ZXMgfSBmcm9tICcuL2FnZ3JlZ2F0ZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0SW5kZXhBcGkgPSBhcHAgPT4gKHtcbiAgbGlzdEl0ZW1zOiBsaXN0SXRlbXMoYXBwKSxcbiAgYnVpbGRJbmRleDogYnVpbGRJbmRleChhcHApLFxuICBhZ2dyZWdhdGVzOiBhZ2dyZWdhdGVzKGFwcCksXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0SW5kZXhBcGk7XG4iLCJpbXBvcnQgeyBlYWNoLCBmaW5kIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IG1hcCwgbWF4LCBjb25zdGFudCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBzd2l0Y2hDYXNlLCBkZWZhdWx0Q2FzZSwgam9pbktleSxcbiAgJCwgaXNOb3RoaW5nLCBpc1NvbWV0aGluZyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIGlzSW5kZXgsIGlzUm9vdCwgaXNTaW5nbGVSZWNvcmQsIGlzQ29sbGVjdGlvblJlY29yZCxcbiAgaXNSZWNvcmQsIGlzYWdncmVnYXRlR3JvdXAsXG4gIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSxcbn0gZnJvbSAnLi9oaWVyYXJjaHknO1xuaW1wb3J0IHsgYWxsIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVOb2RlRXJyb3JzID0ge1xuICBpbmRleENhbm5vdEJlUGFyZW50OiAnSW5kZXggdGVtcGxhdGUgY2Fubm90IGJlIGEgcGFyZW50JyxcbiAgYWxsTm9uUm9vdE5vZGVzTXVzdEhhdmVQYXJlbnQ6ICdPbmx5IHRoZSByb290IG5vZGUgbWF5IGhhdmUgbm8gcGFyZW50JyxcbiAgaW5kZXhQYXJlbnRNdXN0QmVSZWNvcmRPclJvb3Q6ICdBbiBpbmRleCBtYXkgb25seSBoYXZlIGEgcmVjb3JkIG9yIHJvb3QgYXMgYSBwYXJlbnQnLFxuICBhZ2dyZWdhdGVQYXJlbnRNdXN0QmVBbkluZGV4OiAnYWdncmVnYXRlR3JvdXAgcGFyZW50IG11c3QgYmUgYW4gaW5kZXgnLFxufTtcblxuY29uc3QgcGF0aFJlZ3hNYWtlciA9IG5vZGUgPT4gKCkgPT4gbm9kZS5ub2RlS2V5KCkucmVwbGFjZSgve2lkfS9nLCAnW2EtekEtWjAtOV8tXSsnKTtcblxuY29uc3Qgbm9kZUtleU1ha2VyID0gbm9kZSA9PiAoKSA9PiBzd2l0Y2hDYXNlKFxuXG4gIFtuID0+IGlzUmVjb3JkKG4pICYmICFpc1NpbmdsZVJlY29yZChuKSxcbiAgICBuID0+IGpvaW5LZXkoXG4gICAgICBub2RlLnBhcmVudCgpLm5vZGVLZXkoKSxcbiAgICAgIG5vZGUuY29sbGVjdGlvbk5hbWUsXG4gICAgICBgJHtuLm5vZGVJZH0te2lkfWAsXG4gICAgKV0sXG5cbiAgW2lzUm9vdCxcbiAgICBjb25zdGFudCgnLycpXSxcblxuICBbZGVmYXVsdENhc2UsXG4gICAgbiA9PiBqb2luS2V5KG5vZGUucGFyZW50KCkubm9kZUtleSgpLCBuLm5hbWUpXSxcblxuKShub2RlKTtcblxuXG5jb25zdCB2YWxpZGF0ZSA9IHBhcmVudCA9PiAobm9kZSkgPT4ge1xuICBpZiAoaXNJbmRleChub2RlKVxuICAgICAgICAmJiBpc1NvbWV0aGluZyhwYXJlbnQpXG4gICAgICAgICYmICFpc1Jvb3QocGFyZW50KVxuICAgICAgICAmJiAhaXNSZWNvcmQocGFyZW50KSkge1xuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoY3JlYXRlTm9kZUVycm9ycy5pbmRleFBhcmVudE11c3RCZVJlY29yZE9yUm9vdCk7XG4gIH1cblxuICBpZiAoaXNhZ2dyZWdhdGVHcm91cChub2RlKVxuICAgICAgICAmJiBpc1NvbWV0aGluZyhwYXJlbnQpXG4gICAgICAgICYmICFpc0luZGV4KHBhcmVudCkpIHtcbiAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGNyZWF0ZU5vZGVFcnJvcnMuYWdncmVnYXRlUGFyZW50TXVzdEJlQW5JbmRleCk7XG4gIH1cblxuICBpZiAoaXNOb3RoaW5nKHBhcmVudCkgJiYgIWlzUm9vdChub2RlKSkgeyB0aHJvdyBuZXcgQmFkUmVxdWVzdEVycm9yKGNyZWF0ZU5vZGVFcnJvcnMuYWxsTm9uUm9vdE5vZGVzTXVzdEhhdmVQYXJlbnQpOyB9XG5cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5jb25zdCBjb25zdHJ1Y3QgPSBwYXJlbnQgPT4gKG5vZGUpID0+IHtcbiAgbm9kZS5ub2RlS2V5ID0gbm9kZUtleU1ha2VyKG5vZGUpO1xuICBub2RlLnBhdGhSZWd4ID0gcGF0aFJlZ3hNYWtlcihub2RlKTtcbiAgbm9kZS5wYXJlbnQgPSBjb25zdGFudChwYXJlbnQpO1xuICBub2RlLmlzUm9vdCA9ICgpID0+IGlzTm90aGluZyhwYXJlbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBub2RlLm5hbWUgPT09ICdyb290J1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgbm9kZS50eXBlID09PSAncm9vdCc7XG4gIGlmIChpc0NvbGxlY3Rpb25SZWNvcmQobm9kZSkpIHtcbiAgICBub2RlLmNvbGxlY3Rpb25Ob2RlS2V5ID0gKCkgPT4gam9pbktleShcbiAgICAgIHBhcmVudC5ub2RlS2V5KCksIG5vZGUuY29sbGVjdGlvbk5hbWUsXG4gICAgKTtcbiAgICBub2RlLmNvbGxlY3Rpb25QYXRoUmVneCA9ICgpID0+IGpvaW5LZXkoXG4gICAgICBwYXJlbnQucGF0aFJlZ3goKSwgbm9kZS5jb2xsZWN0aW9uTmFtZSxcbiAgICApO1xuICB9XG4gIHJldHVybiBub2RlO1xufTtcblxuY29uc3QgYWRkVG9QYXJlbnQgPSAob2JqKSA9PiB7XG4gIGNvbnN0IHBhcmVudCA9IG9iai5wYXJlbnQoKTtcbiAgaWYgKGlzU29tZXRoaW5nKHBhcmVudCkpIHtcbiAgICBpZiAoaXNJbmRleChvYmopKVxuICAgIC8vIFE6IHdoeSBhcmUgaW5kZXhlcyBub3QgY2hpbGRyZW4gP1xuICAgIC8vIEE6IGJlY2F1c2UgdGhleSBjYW5ub3QgaGF2ZSBjaGlsZHJlbiBvZiB0aGVpciBvd24uXG4gICAgeyBcbiAgICAgIHBhcmVudC5pbmRleGVzLnB1c2gob2JqKTsgXG4gICAgfSBcbiAgICBlbHNlIGlmIChpc2FnZ3JlZ2F0ZUdyb3VwKG9iaikpIFxuICAgIHsgXG4gICAgICBwYXJlbnQuYWdncmVnYXRlR3JvdXBzLnB1c2gob2JqKTsgXG4gICAgfSBlbHNlIHsgXG4gICAgICBwYXJlbnQuY2hpbGRyZW4ucHVzaChvYmopOyBcbiAgICB9XG5cbiAgICBpZiAoaXNSZWNvcmQob2JqKSkge1xuICAgICAgY29uc3QgZGVmYXVsdEluZGV4ID0gZmluZChcbiAgICAgICAgcGFyZW50LmluZGV4ZXMsXG4gICAgICAgIGkgPT4gaS5uYW1lID09PSBgJHtwYXJlbnQubmFtZX1faW5kZXhgLFxuICAgICAgKTtcbiAgICAgIGlmIChkZWZhdWx0SW5kZXgpIHtcbiAgICAgICAgZGVmYXVsdEluZGV4LmFsbG93ZWRSZWNvcmROb2RlSWRzLnB1c2gob2JqLm5vZGVJZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmo7XG59O1xuXG5leHBvcnQgY29uc3QgY29uc3RydWN0Tm9kZSA9IChwYXJlbnQsIG9iaikgPT4gJChvYmosIFtcbiAgY29uc3RydWN0KHBhcmVudCksXG4gIHZhbGlkYXRlKHBhcmVudCksXG4gIGFkZFRvUGFyZW50LFxuXSk7XG5cbmNvbnN0IGdldE5vZGVJZCA9IChwYXJlbnROb2RlKSA9PiB7XG4gIC8vIHRoaXMgY2FzZSBpcyBoYW5kbGVkIGJldHRlciBlbHNld2hlcmVcbiAgaWYgKCFwYXJlbnROb2RlKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZmluZFJvb3QgPSBuID0+IChpc1Jvb3QobikgPyBuIDogZmluZFJvb3Qobi5wYXJlbnQoKSkpO1xuICBjb25zdCByb290ID0gZmluZFJvb3QocGFyZW50Tm9kZSk7XG5cbiAgcmV0dXJuICgkKHJvb3QsIFtcbiAgICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gICAgbWFwKG4gPT4gbi5ub2RlSWQpLFxuICAgIG1heF0pICsgMSk7XG59O1xuXG5leHBvcnQgY29uc3QgY29uc3RydWN0SGllcmFyY2h5ID0gKG5vZGUsIHBhcmVudCkgPT4ge1xuICBjb25zdHJ1Y3QocGFyZW50KShub2RlKTtcbiAgaWYgKG5vZGUuaW5kZXhlcykge1xuICAgIGVhY2gobm9kZS5pbmRleGVzLFxuICAgICAgY2hpbGQgPT4gY29uc3RydWN0SGllcmFyY2h5KGNoaWxkLCBub2RlKSk7XG4gIH1cbiAgaWYgKG5vZGUuYWdncmVnYXRlR3JvdXBzKSB7XG4gICAgZWFjaChub2RlLmFnZ3JlZ2F0ZUdyb3VwcyxcbiAgICAgIGNoaWxkID0+IGNvbnN0cnVjdEhpZXJhcmNoeShjaGlsZCwgbm9kZSkpO1xuICB9XG4gIGlmIChub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgIGVhY2gobm9kZS5jaGlsZHJlbixcbiAgICAgIGNoaWxkID0+IGNvbnN0cnVjdEhpZXJhcmNoeShjaGlsZCwgbm9kZSkpO1xuICB9XG4gIGlmIChub2RlLmZpZWxkcykge1xuICAgIGVhY2gobm9kZS5maWVsZHMsXG4gICAgICBmID0+IGVhY2goZi50eXBlT3B0aW9ucywgKHZhbCwga2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IGRlZiA9IGFsbFtmLnR5cGVdLm9wdGlvbkRlZmluaXRpb25zW2tleV07XG4gICAgICAgIGlmICghZGVmKSB7XG4gICAgICAgICAgLy8gdW5rbm93biB0eXBlT3B0aW9uXG4gICAgICAgICAgZGVsZXRlIGYudHlwZU9wdGlvbnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmLnR5cGVPcHRpb25zW2tleV0gPSBkZWYucGFyc2UodmFsKTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICB9XG4gIHJldHVybiBub2RlO1xufTtcblxuXG5leHBvcnQgY29uc3QgZ2V0TmV3Um9vdExldmVsID0gKCkgPT4gY29uc3RydWN0KCkoe1xuICBuYW1lOiAncm9vdCcsXG4gIHR5cGU6ICdyb290JyxcbiAgY2hpbGRyZW46IFtdLFxuICBwYXRoTWFwczogW10sXG4gIGluZGV4ZXM6IFtdLFxuICBub2RlSWQ6IDAsXG59KTtcblxuY29uc3QgX2dldE5ld1JlY29yZFRlbXBsYXRlID0gKHBhcmVudCwgbmFtZSwgY3JlYXRlRGVmYXVsdEluZGV4LCBpc1NpbmdsZSkgPT4ge1xuICBjb25zdCBub2RlID0gY29uc3RydWN0Tm9kZShwYXJlbnQsIHtcbiAgICBuYW1lLFxuICAgIHR5cGU6ICdyZWNvcmQnLFxuICAgIGZpZWxkczogW10sXG4gICAgY2hpbGRyZW46IFtdLFxuICAgIHZhbGlkYXRpb25SdWxlczogW10sXG4gICAgbm9kZUlkOiBnZXROb2RlSWQocGFyZW50KSxcbiAgICBpbmRleGVzOiBbXSxcbiAgICBlc3RpbWF0ZWRSZWNvcmRDb3VudDogaXNSZWNvcmQocGFyZW50KSA/IDUwMCA6IDEwMDAwMDAsXG4gICAgY29sbGVjdGlvbk5hbWU6ICcnLFxuICAgIGlzU2luZ2xlLFxuICB9KTtcblxuICBpZiAoY3JlYXRlRGVmYXVsdEluZGV4KSB7XG4gICAgY29uc3QgZGVmYXVsdEluZGV4ID0gZ2V0TmV3SW5kZXhUZW1wbGF0ZShwYXJlbnQpO1xuICAgIGRlZmF1bHRJbmRleC5uYW1lID0gYCR7bmFtZX1faW5kZXhgO1xuICAgIGRlZmF1bHRJbmRleC5hbGxvd2VkUmVjb3JkTm9kZUlkcy5wdXNoKG5vZGUubm9kZUlkKTtcbiAgfVxuXG4gIHJldHVybiBub2RlO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld1JlY29yZFRlbXBsYXRlID0gKHBhcmVudCwgbmFtZSA9ICcnLCBjcmVhdGVEZWZhdWx0SW5kZXggPSB0cnVlKSA9PiBfZ2V0TmV3UmVjb3JkVGVtcGxhdGUocGFyZW50LCBuYW1lLCBjcmVhdGVEZWZhdWx0SW5kZXgsIGZhbHNlKTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld1NpbmdsZVJlY29yZFRlbXBsYXRlID0gcGFyZW50ID0+IF9nZXROZXdSZWNvcmRUZW1wbGF0ZShwYXJlbnQsICcnLCBmYWxzZSwgdHJ1ZSk7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdJbmRleFRlbXBsYXRlID0gKHBhcmVudCwgdHlwZSA9ICdhbmNlc3RvcicpID0+IGNvbnN0cnVjdE5vZGUocGFyZW50LCB7XG4gIG5hbWU6ICcnLFxuICB0eXBlOiAnaW5kZXgnLFxuICBtYXA6ICdyZXR1cm4gey4uLnJlY29yZH07JyxcbiAgZmlsdGVyOiAnJyxcbiAgaW5kZXhUeXBlOiB0eXBlLFxuICBnZXRTaGFyZE5hbWU6ICcnLFxuICBnZXRTb3J0S2V5OiAncmVjb3JkLmlkJyxcbiAgYWdncmVnYXRlR3JvdXBzOiBbXSxcbiAgYWxsb3dlZFJlY29yZE5vZGVJZHM6IFtdLFxuICBub2RlSWQ6IGdldE5vZGVJZChwYXJlbnQpLFxufSk7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdBZ2dyZWdhdGVHcm91cFRlbXBsYXRlID0gaW5kZXggPT4gY29uc3RydWN0Tm9kZShpbmRleCwge1xuICBuYW1lOiAnJyxcbiAgdHlwZTogJ2FnZ3JlZ2F0ZUdyb3VwJyxcbiAgZ3JvdXBCeTogJycsXG4gIGFnZ3JlZ2F0ZXM6IFtdLFxuICBjb25kaXRpb246ICcnLFxuICBub2RlSWQ6IGdldE5vZGVJZChpbmRleCksXG59KTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0FnZ3JlZ2F0ZVRlbXBsYXRlID0gKHNldCkgPT4ge1xuICBjb25zdCBhZ2dyZWdhdGVkVmFsdWUgPSB7XG4gICAgbmFtZTogJycsXG4gICAgYWdncmVnYXRlZFZhbHVlOiAnJyxcbiAgfTtcbiAgc2V0LmFnZ3JlZ2F0ZXMucHVzaChhZ2dyZWdhdGVkVmFsdWUpO1xuICByZXR1cm4gYWdncmVnYXRlZFZhbHVlO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXROZXdSb290TGV2ZWwsXG4gIGdldE5ld1JlY29yZFRlbXBsYXRlLFxuICBnZXROZXdJbmRleFRlbXBsYXRlLFxuICBjcmVhdGVOb2RlRXJyb3JzLFxuICBjb25zdHJ1Y3RIaWVyYXJjaHksXG4gIGdldE5ld0FnZ3JlZ2F0ZUdyb3VwVGVtcGxhdGUsXG4gIGdldE5ld0FnZ3JlZ2F0ZVRlbXBsYXRlLFxufTtcbiIsImltcG9ydCB7XG4gIHNvbWUsIG1hcCwgZmlsdGVyLCBrZXlzLCBpbmNsdWRlcyxcbiAgY291bnRCeSwgZmxhdHRlbixcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIGlzU29tZXRoaW5nLCAkLFxuICBpc05vbkVtcHR5U3RyaW5nLFxuICBpc05vdGhpbmdPckVtcHR5LFxuICBpc05vdGhpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBhbGwsIGdldERlZmF1bHRPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSB9IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3QgZmllbGRFcnJvcnMgPSB7XG4gIEFkZEZpZWxkVmFsaWRhdGlvbkZhaWxlZDogJ0FkZCBmaWVsZCB2YWxpZGF0aW9uOiAnLFxufTtcblxuZXhwb3J0IGNvbnN0IGFsbG93ZWRUeXBlcyA9ICgpID0+IGtleXMoYWxsKTtcblxuZXhwb3J0IGNvbnN0IGdldE5ld0ZpZWxkID0gdHlwZSA9PiAoe1xuICBuYW1lOiAnJywgLy8gaG93IGZpZWxkIGlzIHJlZmVyZW5jZWQgaW50ZXJuYWxseVxuICB0eXBlLFxuICB0eXBlT3B0aW9uczogZ2V0RGVmYXVsdE9wdGlvbnModHlwZSksXG4gIGxhYmVsOiAnJywgLy8gaG93IGZpZWxkIGlzIGRpc3BsYXllZFxuICBnZXRJbml0aWFsVmFsdWU6ICdkZWZhdWx0JywgLy8gZnVuY3Rpb24gdGhhdCBnZXRzIHZhbHVlIHdoZW4gaW5pdGlhbGx5IGNyZWF0ZWRcbiAgZ2V0VW5kZWZpbmVkVmFsdWU6ICdkZWZhdWx0JywgLy8gZnVuY3Rpb24gdGhhdCBnZXRzIHZhbHVlIHdoZW4gZmllbGQgdW5kZWZpbmVkIG9uIHJlY29yZFxufSk7XG5cbmNvbnN0IGZpZWxkUnVsZXMgPSBhbGxGaWVsZHMgPT4gW1xuICBtYWtlcnVsZSgnbmFtZScsICdmaWVsZCBuYW1lIGlzIG5vdCBzZXQnLFxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ3R5cGUnLCAnZmllbGQgdHlwZSBpcyBub3Qgc2V0JyxcbiAgICBmID0+IGlzTm9uRW1wdHlTdHJpbmcoZi50eXBlKSksXG4gIG1ha2VydWxlKCdsYWJlbCcsICdmaWVsZCBsYWJlbCBpcyBub3Qgc2V0JyxcbiAgICBmID0+IGlzTm9uRW1wdHlTdHJpbmcoZi5sYWJlbCkpLFxuICBtYWtlcnVsZSgnZ2V0SW5pdGlhbFZhbHVlJywgJ2dldEluaXRpYWxWYWx1ZSBmdW5jdGlvbiBpcyBub3Qgc2V0JyxcbiAgICBmID0+IGlzTm9uRW1wdHlTdHJpbmcoZi5nZXRJbml0aWFsVmFsdWUpKSxcbiAgbWFrZXJ1bGUoJ2dldFVuZGVmaW5lZFZhbHVlJywgJ2dldFVuZGVmaW5lZFZhbHVlIGZ1bmN0aW9uIGlzIG5vdCBzZXQnLFxuICAgIGYgPT4gaXNOb25FbXB0eVN0cmluZyhmLmdldFVuZGVmaW5lZFZhbHVlKSksXG4gIG1ha2VydWxlKCduYW1lJywgJ2ZpZWxkIG5hbWUgaXMgZHVwbGljYXRlZCcsXG4gICAgZiA9PiBpc05vdGhpbmdPckVtcHR5KGYubmFtZSlcbiAgICAgICAgICAgICB8fCBjb3VudEJ5KCduYW1lJykoYWxsRmllbGRzKVtmLm5hbWVdID09PSAxKSxcbiAgbWFrZXJ1bGUoJ3R5cGUnLCAndHlwZSBpcyB1bmtub3duJyxcbiAgICBmID0+IGlzTm90aGluZ09yRW1wdHkoZi50eXBlKVxuICAgICAgICAgICAgIHx8IHNvbWUodCA9PiBmLnR5cGUgPT09IHQpKGFsbG93ZWRUeXBlcygpKSksXG5dO1xuXG5jb25zdCB0eXBlT3B0aW9uc1J1bGVzID0gKGZpZWxkKSA9PiB7XG4gIGNvbnN0IHR5cGUgPSBhbGxbZmllbGQudHlwZV07XG4gIGlmIChpc05vdGhpbmcodHlwZSkpIHJldHVybiBbXTtcblxuICBjb25zdCBkZWYgPSBvcHROYW1lID0+IHR5cGUub3B0aW9uRGVmaW5pdGlvbnNbb3B0TmFtZV07XG5cbiAgcmV0dXJuICQoZmllbGQudHlwZU9wdGlvbnMsIFtcbiAgICBrZXlzLFxuICAgIGZpbHRlcihvID0+IGlzU29tZXRoaW5nKGRlZihvKSlcbiAgICAgICAgICAgICAgICAgICAgJiYgaXNTb21ldGhpbmcoZGVmKG8pLmlzVmFsaWQpKSxcbiAgICBtYXAobyA9PiBtYWtlcnVsZShcbiAgICAgIGB0eXBlT3B0aW9ucy4ke299YCxcbiAgICAgIGAke2RlZihvKS5yZXF1aXJlbWVudERlc2NyaXB0aW9ufWAsXG4gICAgICBmaWVsZCA9PiBkZWYobykuaXNWYWxpZChmaWVsZC50eXBlT3B0aW9uc1tvXSksXG4gICAgKSksXG4gIF0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlRmllbGQgPSBhbGxGaWVsZHMgPT4gKGZpZWxkKSA9PiB7XG4gIGNvbnN0IGV2ZXJ5U2luZ2xlRmllbGQgPSBpbmNsdWRlcyhmaWVsZCkoYWxsRmllbGRzKSA/IGFsbEZpZWxkcyA6IFsuLi5hbGxGaWVsZHMsIGZpZWxkXTtcbiAgcmV0dXJuIGFwcGx5UnVsZVNldChbLi4uZmllbGRSdWxlcyhldmVyeVNpbmdsZUZpZWxkKSwgLi4udHlwZU9wdGlvbnNSdWxlcyhmaWVsZCldKShmaWVsZCk7XG59O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBbGxGaWVsZHMgPSByZWNvcmROb2RlID0+ICQocmVjb3JkTm9kZS5maWVsZHMsIFtcbiAgbWFwKHZhbGlkYXRlRmllbGQocmVjb3JkTm9kZS5maWVsZHMpKSxcbiAgZmxhdHRlbixcbl0pO1xuXG5leHBvcnQgY29uc3QgYWRkRmllbGQgPSAocmVjb3JkVGVtcGxhdGUsIGZpZWxkKSA9PiB7XG4gIGlmIChpc05vdGhpbmdPckVtcHR5KGZpZWxkLmxhYmVsKSkge1xuICAgIGZpZWxkLmxhYmVsID0gZmllbGQubmFtZTtcbiAgfVxuICBjb25zdCB2YWxpZGF0aW9uTWVzc2FnZXMgPSB2YWxpZGF0ZUZpZWxkKFsuLi5yZWNvcmRUZW1wbGF0ZS5maWVsZHMsIGZpZWxkXSkoZmllbGQpO1xuICBpZiAodmFsaWRhdGlvbk1lc3NhZ2VzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBlcnJvcnMgPSBtYXAobSA9PiBtLmVycm9yKSh2YWxpZGF0aW9uTWVzc2FnZXMpO1xuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYCR7ZmllbGRFcnJvcnMuQWRkRmllbGRWYWxpZGF0aW9uRmFpbGVkfSAke2Vycm9ycy5qb2luKCcsICcpfWApO1xuICB9XG4gIHJlY29yZFRlbXBsYXRlLmZpZWxkcy5wdXNoKGZpZWxkKTtcbn07XG4iLCJpbXBvcnQgeyBpc051bWJlciwgaXNCb29sZWFuLCBkZWZhdWx0Q2FzZSB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBzd2l0Y2hDYXNlIH0gZnJvbSAnLi4vY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGdldE5ld1JlY29yZFZhbGlkYXRpb25SdWxlID0gKGludmFsaWRGaWVsZHMsXG4gIG1lc3NhZ2VXaGVuSW52YWxpZCxcbiAgZXhwcmVzc2lvbldoZW5WYWxpZCkgPT4gKHtcbiAgaW52YWxpZEZpZWxkcywgbWVzc2FnZVdoZW5JbnZhbGlkLCBleHByZXNzaW9uV2hlblZhbGlkLFxufSk7XG5cbmNvbnN0IGdldFN0YXRpY1ZhbHVlID0gc3dpdGNoQ2FzZShcbiAgW2lzTnVtYmVyLCB2ID0+IHYudG9TdHJpbmcoKV0sXG4gIFtpc0Jvb2xlYW4sIHYgPT4gdi50b1N0cmluZygpXSxcbiAgW2RlZmF1bHRDYXNlLCB2ID0+IGAnJHt2fSdgXSxcbik7XG5cbmV4cG9ydCBjb25zdCBjb21tb25SZWNvcmRWYWxpZGF0aW9uUnVsZXMgPSAoe1xuXG4gIGZpZWxkTm90RW1wdHk6IGZpZWxkTmFtZSA9PiBnZXROZXdSZWNvcmRWYWxpZGF0aW9uUnVsZShcbiAgICBbZmllbGROYW1lXSxcbiAgICBgJHtmaWVsZE5hbWV9IGlzIGVtcHR5YCxcbiAgICBgIV8uaXNFbXB0eShyZWNvcmRbJyR7ZmllbGROYW1lfSddKWAsXG4gICksXG5cbiAgZmllbGRCZXR3ZWVuOiAoZmllbGROYW1lLCBtaW4sIG1heCkgPT4gZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUoXG4gICAgW2ZpZWxkTmFtZV0sXG4gICAgYCR7ZmllbGROYW1lfSBtdXN0IGJlIGJldHdlZW4gJHttaW4udG9TdHJpbmcoKX0gYW5kICR7bWF4LnRvU3RyaW5nKCl9YCxcbiAgICBgcmVjb3JkWycke2ZpZWxkTmFtZX0nXSA+PSAke2dldFN0YXRpY1ZhbHVlKG1pbil9ICYmICByZWNvcmRbJyR7ZmllbGROYW1lfSddIDw9ICR7Z2V0U3RhdGljVmFsdWUobWF4KX0gYCxcbiAgKSxcblxuICBmaWVsZEdyZWF0ZXJUaGFuOiAoZmllbGROYW1lLCBtaW4sIG1heCkgPT4gZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUoXG4gICAgW2ZpZWxkTmFtZV0sXG4gICAgYCR7ZmllbGROYW1lfSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAke21pbi50b1N0cmluZygpfSBhbmQgJHttYXgudG9TdHJpbmcoKX1gLFxuICAgIGByZWNvcmRbJyR7ZmllbGROYW1lfSddID49ICR7Z2V0U3RhdGljVmFsdWUobWluKX0gIGAsXG4gICksXG59KTtcblxuZXhwb3J0IGNvbnN0IGFkZFJlY29yZFZhbGlkYXRpb25SdWxlID0gcmVjb3JkTm9kZSA9PiBydWxlID0+IHJlY29yZE5vZGUudmFsaWRhdGlvblJ1bGVzLnB1c2gocnVsZSk7XG4iLCJcbmV4cG9ydCBjb25zdCBjcmVhdGVUcmlnZ2VyID0gKCkgPT4gKHtcbiAgYWN0aW9uTmFtZTogJycsXG4gIGV2ZW50TmFtZTogJycsXG4gIC8vIGZ1bmN0aW9uLCBoYXMgYWNjZXNzIHRvIGV2ZW50IGNvbnRleHQsXG4gIC8vIHJldHVybnMgb2JqZWN0IHRoYXQgaXMgdXNlZCBhcyBwYXJhbWV0ZXIgdG8gYWN0aW9uXG4gIC8vIG9ubHkgdXNlZCBpZiB0cmlnZ2VyZWQgYnkgZXZlbnRcbiAgb3B0aW9uc0NyZWF0b3I6ICcnLFxuICAvLyBhY3Rpb24gcnVucyBpZiB0cnVlLFxuICAvLyBoYXMgYWNjZXNzIHRvIGV2ZW50IGNvbnRleHRcbiAgY29uZGl0aW9uOiAnJyxcbn0pO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlQWN0aW9uID0gKCkgPT4gKHtcbiAgbmFtZTogJycsXG4gIGJlaGF2aW91clNvdXJjZTogJycsXG4gIC8vIG5hbWUgb2YgZnVuY3Rpb24gaW4gYWN0aW9uU291cmNlXG4gIGJlaGF2aW91ck5hbWU6ICcnLFxuICAvLyBwYXJhbWV0ZXIgcGFzc2VkIGludG8gYmVoYXZpb3VyLlxuICAvLyBhbnkgb3RoZXIgcGFybXMgcGFzc2VkIGF0IHJ1bnRpbWUgZS5nLlxuICAvLyBieSB0cmlnZ2VyLCBvciBtYW51YWxseSwgd2lsbCBiZSBtZXJnZWQgaW50byB0aGlzXG4gIGluaXRpYWxPcHRpb25zOiB7fSxcbn0pO1xuIiwiaW1wb3J0IHsgZmxhdHRlbiwgbWFwLCBpc0VtcHR5IH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGNvbXBpbGVDb2RlIH0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xuaW1wb3J0IHtcbiAgaXNOb25FbXB0eVN0cmluZywgXG4gIGV4ZWN1dGVzV2l0aG91dEV4Y2VwdGlvbiwgJCwgXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuXG5jb25zdCBhZ2dyZWdhdGVSdWxlcyA9IFtcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnY2hvb3NlIGEgbmFtZSBmb3IgdGhlIGFnZ3JlZ2F0ZScsXG4gICAgYSA9PiBpc05vbkVtcHR5U3RyaW5nKGEubmFtZSkpLFxuICBtYWtlcnVsZSgnYWdncmVnYXRlZFZhbHVlJywgJ2FnZ3JlZ2F0ZWRWYWx1ZSBkb2VzIG5vdCBjb21waWxlJyxcbiAgICBhID0+IGlzRW1wdHkoYS5hZ2dyZWdhdGVkVmFsdWUpXG4gICAgICAgICAgICB8fCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24oXG4gICAgICAgICAgICAgICgpID0+IGNvbXBpbGVDb2RlKGEuYWdncmVnYXRlZFZhbHVlKSxcbiAgICAgICAgICAgICkpLFxuXTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWdncmVnYXRlID0gYWdncmVnYXRlID0+IGFwcGx5UnVsZVNldChhZ2dyZWdhdGVSdWxlcykoYWdncmVnYXRlKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWxsQWdncmVnYXRlcyA9IGFsbCA9PiAkKGFsbCwgW1xuICBtYXAodmFsaWRhdGVBZ2dyZWdhdGUpLFxuICBmbGF0dGVuLFxuXSk7XG4iLCJpbXBvcnQge1xuICBmaWx0ZXIsIHVuaW9uLCBjb25zdGFudCxcbiAgbWFwLCBmbGF0dGVuLCBldmVyeSwgdW5pcUJ5LFxuICBzb21lLCBpbmNsdWRlcywgaXNFbXB0eSwgaGFzXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBjb21waWxlRXhwcmVzc2lvbiwgY29tcGlsZUNvZGUgfSBmcm9tICdAbngtanMvY29tcGlsZXItdXRpbCc7XG5pbXBvcnQge1xuICAkLCBpc1NvbWV0aGluZywgc3dpdGNoQ2FzZSxcbiAgYW55VHJ1ZSwgaXNOb25FbXB0eUFycmF5LCBleGVjdXRlc1dpdGhvdXRFeGNlcHRpb24sXG4gIGlzTm9uRW1wdHlTdHJpbmcsIGRlZmF1bHRDYXNlLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtcbiAgaXNSZWNvcmQsIGlzUm9vdCwgaXNhZ2dyZWdhdGVHcm91cCxcbiAgaXNJbmRleCwgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LFxufSBmcm9tICcuL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBldmVudHNMaXN0IH0gZnJvbSAnLi4vY29tbW9uL2V2ZW50cyc7XG5pbXBvcnQgeyB2YWxpZGF0ZUFsbEZpZWxkcyB9IGZyb20gJy4vZmllbGRzJztcbmltcG9ydCB7XG4gIGFwcGx5UnVsZVNldCwgbWFrZXJ1bGUsIHN0cmluZ05vdEVtcHR5LFxuICB2YWxpZGF0aW9uRXJyb3IsXG59IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcbmltcG9ydCB7IGluZGV4UnVsZVNldCB9IGZyb20gJy4vaW5kZXhlcyc7XG5pbXBvcnQgeyB2YWxpZGF0ZUFsbEFnZ3JlZ2F0ZXMgfSBmcm9tICcuL3ZhbGlkYXRlQWdncmVnYXRlJztcblxuZXhwb3J0IGNvbnN0IHJ1bGVTZXQgPSAoLi4uc2V0cykgPT4gY29uc3RhbnQoZmxhdHRlbihbLi4uc2V0c10pKTtcblxuY29uc3QgY29tbW9uUnVsZXMgPSBbXG4gIG1ha2VydWxlKCduYW1lJywgJ25vZGUgbmFtZSBpcyBub3Qgc2V0JyxcbiAgICBub2RlID0+IHN0cmluZ05vdEVtcHR5KG5vZGUubmFtZSkpLFxuICBtYWtlcnVsZSgndHlwZScsICdub2RlIHR5cGUgbm90IHJlY29nbmlzZWQnLFxuICAgIGFueVRydWUoaXNSZWNvcmQsIGlzUm9vdCwgaXNJbmRleCwgaXNhZ2dyZWdhdGVHcm91cCkpLFxuXTtcblxuY29uc3QgcmVjb3JkUnVsZXMgPSBbXG4gIG1ha2VydWxlKCdmaWVsZHMnLCAnbm8gZmllbGRzIGhhdmUgYmVlbiBhZGRlZCB0byB0aGUgcmVjb3JkJyxcbiAgICBub2RlID0+IGlzTm9uRW1wdHlBcnJheShub2RlLmZpZWxkcykpLFxuICBtYWtlcnVsZSgndmFsaWRhdGlvblJ1bGVzJywgXCJ2YWxpZGF0aW9uIHJ1bGUgaXMgbWlzc2luZyBhICdtZXNzYWdlV2hlblZhbGlkJyBtZW1iZXJcIixcbiAgICBub2RlID0+IGV2ZXJ5KHIgPT4gaGFzKCdtZXNzYWdlV2hlbkludmFsaWQnKShyKSkobm9kZS52YWxpZGF0aW9uUnVsZXMpKSxcbiAgbWFrZXJ1bGUoJ3ZhbGlkYXRpb25SdWxlcycsIFwidmFsaWRhdGlvbiBydWxlIGlzIG1pc3NpbmcgYSAnZXhwcmVzc2lvbldoZW5WYWxpZCcgbWVtYmVyXCIsXG4gICAgbm9kZSA9PiBldmVyeShyID0+IGhhcygnZXhwcmVzc2lvbldoZW5WYWxpZCcpKHIpKShub2RlLnZhbGlkYXRpb25SdWxlcykpLFxuXTtcblxuXG5jb25zdCBhZ2dyZWdhdGVHcm91cFJ1bGVzID0gW1xuICBtYWtlcnVsZSgnY29uZGl0aW9uJywgJ2NvbmRpdGlvbiBkb2VzIG5vdCBjb21waWxlJyxcbiAgICBhID0+IGlzRW1wdHkoYS5jb25kaXRpb24pXG4gICAgICAgICAgICAgfHwgZXhlY3V0ZXNXaXRob3V0RXhjZXB0aW9uKFxuICAgICAgICAgICAgICAgKCkgPT4gY29tcGlsZUV4cHJlc3Npb24oYS5jb25kaXRpb24pLFxuICAgICAgICAgICAgICkpLFxuXTtcblxuY29uc3QgZ2V0UnVsZVNldCA9IG5vZGUgPT4gc3dpdGNoQ2FzZShcblxuICBbaXNSZWNvcmQsIHJ1bGVTZXQoXG4gICAgY29tbW9uUnVsZXMsXG4gICAgcmVjb3JkUnVsZXMsXG4gICldLFxuXG4gIFtpc0luZGV4LCBydWxlU2V0KFxuICAgIGNvbW1vblJ1bGVzLFxuICAgIGluZGV4UnVsZVNldCxcbiAgKV0sXG5cbiAgW2lzYWdncmVnYXRlR3JvdXAsIHJ1bGVTZXQoXG4gICAgY29tbW9uUnVsZXMsXG4gICAgYWdncmVnYXRlR3JvdXBSdWxlcyxcbiAgKV0sXG5cbiAgW2RlZmF1bHRDYXNlLCBydWxlU2V0KGNvbW1vblJ1bGVzLCBbXSldLFxuKShub2RlKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlTm9kZSA9IG5vZGUgPT4gYXBwbHlSdWxlU2V0KGdldFJ1bGVTZXQobm9kZSkpKG5vZGUpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBbGwgPSAoYXBwSGllcmFyY2h5KSA9PiB7XG4gIGNvbnN0IGZsYXR0ZW5lZCA9IGdldEZsYXR0ZW5lZEhpZXJhcmNoeShcbiAgICBhcHBIaWVyYXJjaHksXG4gICk7XG5cbiAgY29uc3QgZHVwbGljYXRlTmFtZVJ1bGUgPSBtYWtlcnVsZShcbiAgICAnbmFtZScsICdub2RlIG5hbWVzIG11c3QgYmUgdW5pcXVlIHVuZGVyIHNoYXJlZCBwYXJlbnQnLFxuICAgIG4gPT4gZmlsdGVyKGYgPT4gZi5wYXJlbnQoKSA9PT0gbi5wYXJlbnQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBmLm5hbWUgPT09IG4ubmFtZSkoZmxhdHRlbmVkKS5sZW5ndGggPT09IDEsXG4gICk7XG5cbiAgY29uc3QgZHVwbGljYXRlTm9kZUtleUVycm9ycyA9ICQoZmxhdHRlbmVkLCBbXG4gICAgbWFwKG4gPT4gYXBwbHlSdWxlU2V0KFtkdXBsaWNhdGVOYW1lUnVsZV0pKG4pKSxcbiAgICBmaWx0ZXIoaXNTb21ldGhpbmcpLFxuICAgIGZsYXR0ZW4sXG4gIF0pO1xuXG4gIGNvbnN0IGZpZWxkRXJyb3JzID0gJChmbGF0dGVuZWQsIFtcbiAgICBmaWx0ZXIoaXNSZWNvcmQpLFxuICAgIG1hcCh2YWxpZGF0ZUFsbEZpZWxkcyksXG4gICAgZmxhdHRlbixcbiAgXSk7XG5cbiAgY29uc3QgYWdncmVnYXRlRXJyb3JzID0gJChmbGF0dGVuZWQsIFtcbiAgICBmaWx0ZXIoaXNhZ2dyZWdhdGVHcm91cCksXG4gICAgbWFwKHMgPT4gdmFsaWRhdGVBbGxBZ2dyZWdhdGVzKFxuICAgICAgcy5hZ2dyZWdhdGVzLFxuICAgICkpLFxuICAgIGZsYXR0ZW4sXG4gIF0pO1xuXG4gIHJldHVybiAkKGZsYXR0ZW5lZCwgW1xuICAgIG1hcCh2YWxpZGF0ZU5vZGUpLFxuICAgIGZsYXR0ZW4sXG4gICAgdW5pb24oZHVwbGljYXRlTm9kZUtleUVycm9ycyksXG4gICAgdW5pb24oZmllbGRFcnJvcnMpLFxuICAgIHVuaW9uKGFnZ3JlZ2F0ZUVycm9ycyksXG4gIF0pO1xufTtcblxuY29uc3QgYWN0aW9uUnVsZXMgPSBbXG4gIG1ha2VydWxlKCduYW1lJywgJ2FjdGlvbiBtdXN0IGhhdmUgYSBuYW1lJyxcbiAgICBhID0+IGlzTm9uRW1wdHlTdHJpbmcoYS5uYW1lKSksXG4gIG1ha2VydWxlKCdiZWhhdmlvdXJOYW1lJywgJ211c3Qgc3VwcGx5IGEgYmVoYXZpb3VyIG5hbWUgdG8gdGhlIGFjdGlvbicsXG4gICAgYSA9PiBpc05vbkVtcHR5U3RyaW5nKGEuYmVoYXZpb3VyTmFtZSkpLFxuICBtYWtlcnVsZSgnYmVoYXZpb3VyU291cmNlJywgJ211c3Qgc3VwcGx5IGEgYmVoYXZpb3VyIHNvdXJjZSBmb3IgdGhlIGFjdGlvbicsXG4gICAgYSA9PiBpc05vbkVtcHR5U3RyaW5nKGEuYmVoYXZpb3VyU291cmNlKSksXG5dO1xuXG5jb25zdCBkdXBsaWNhdGVBY3Rpb25SdWxlID0gbWFrZXJ1bGUoJycsICdhY3Rpb24gbmFtZSBtdXN0IGJlIHVuaXF1ZScsICgpID0+IHt9KTtcblxuY29uc3QgdmFsaWRhdGVBY3Rpb24gPSBhY3Rpb24gPT4gYXBwbHlSdWxlU2V0KGFjdGlvblJ1bGVzKShhY3Rpb24pO1xuXG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFjdGlvbnMgPSAoYWxsQWN0aW9ucykgPT4ge1xuICBjb25zdCBkdXBsaWNhdGVBY3Rpb25zID0gJChhbGxBY3Rpb25zLCBbXG4gICAgZmlsdGVyKGEgPT4gZmlsdGVyKGEyID0+IGEyLm5hbWUgPT09IGEubmFtZSkoYWxsQWN0aW9ucykubGVuZ3RoID4gMSksXG4gICAgbWFwKGEgPT4gdmFsaWRhdGlvbkVycm9yKGR1cGxpY2F0ZUFjdGlvblJ1bGUsIGEpKSxcbiAgXSk7XG5cbiAgY29uc3QgZXJyb3JzID0gJChhbGxBY3Rpb25zLCBbXG4gICAgbWFwKHZhbGlkYXRlQWN0aW9uKSxcbiAgICBmbGF0dGVuLFxuICAgIHVuaW9uKGR1cGxpY2F0ZUFjdGlvbnMpLFxuICAgIHVuaXFCeSgnbmFtZScpLFxuICBdKTtcblxuICByZXR1cm4gZXJyb3JzO1xufTtcblxuY29uc3QgdHJpZ2dlclJ1bGVzID0gYWN0aW9ucyA9PiAoW1xuICBtYWtlcnVsZSgnYWN0aW9uTmFtZScsICdtdXN0IHNwZWNpZnkgYW4gYWN0aW9uJyxcbiAgICB0ID0+IGlzTm9uRW1wdHlTdHJpbmcodC5hY3Rpb25OYW1lKSksXG4gIG1ha2VydWxlKCdldmVudE5hbWUnLCAnbXVzdCBzcGVjaWZ5IGFuZCBldmVudCcsXG4gICAgdCA9PiBpc05vbkVtcHR5U3RyaW5nKHQuZXZlbnROYW1lKSksXG4gIG1ha2VydWxlKCdhY3Rpb25OYW1lJywgJ3NwZWNpZmllZCBhY3Rpb24gbm90IHN1cHBsaWVkJyxcbiAgICB0ID0+ICF0LmFjdGlvbk5hbWVcbiAgICAgICAgICAgICB8fCBzb21lKGEgPT4gYS5uYW1lID09PSB0LmFjdGlvbk5hbWUpKGFjdGlvbnMpKSxcbiAgbWFrZXJ1bGUoJ2V2ZW50TmFtZScsICdpbnZhbGlkIEV2ZW50IE5hbWUnLFxuICAgIHQgPT4gIXQuZXZlbnROYW1lXG4gICAgICAgICAgICAgfHwgaW5jbHVkZXModC5ldmVudE5hbWUpKGV2ZW50c0xpc3QpKSxcbiAgbWFrZXJ1bGUoJ29wdGlvbnNDcmVhdG9yJywgJ09wdGlvbnMgQ3JlYXRvciBkb2VzIG5vdCBjb21waWxlIC0gY2hlY2sgeW91ciBleHByZXNzaW9uJyxcbiAgICAodCkgPT4ge1xuICAgICAgaWYgKCF0Lm9wdGlvbnNDcmVhdG9yKSByZXR1cm4gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbXBpbGVDb2RlKHQub3B0aW9uc0NyZWF0b3IpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKF8pIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfSksXG4gIG1ha2VydWxlKCdjb25kaXRpb24nLCAnVHJpZ2dlciBjb25kaXRpb24gZG9lcyBub3QgY29tcGlsZSAtIGNoZWNrIHlvdXIgZXhwcmVzc2lvbicsXG4gICAgKHQpID0+IHtcbiAgICAgIGlmICghdC5jb25kaXRpb24pIHJldHVybiB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29tcGlsZUV4cHJlc3Npb24odC5jb25kaXRpb24pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKF8pIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfSksXG5dKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVHJpZ2dlciA9ICh0cmlnZ2VyLCBhbGxBY3Rpb25zKSA9PiB7XG4gIGNvbnN0IGVycm9ycyA9IGFwcGx5UnVsZVNldCh0cmlnZ2VyUnVsZXMoYWxsQWN0aW9ucykpKHRyaWdnZXIpO1xuXG4gIHJldHVybiBlcnJvcnM7XG59O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVUcmlnZ2VycyA9ICh0cmlnZ2VycywgYWxsQWN0aW9ucykgPT4gJCh0cmlnZ2VycywgW1xuICBtYXAodCA9PiB2YWxpZGF0ZVRyaWdnZXIodCwgYWxsQWN0aW9ucykpLFxuICBmbGF0dGVuLFxuXSk7XG4iLCJpbXBvcnQgeyBhcHBEZWZpbml0aW9uRmlsZSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBjb25zdHJ1Y3RIaWVyYXJjaHkgfSBmcm9tICcuL2NyZWF0ZU5vZGVzJztcblxuZXhwb3J0IGNvbnN0IGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbiA9IGRhdGFzdG9yZSA9PiBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGRhdGFzdG9yZS5leGlzdHMoYXBwRGVmaW5pdGlvbkZpbGUpO1xuXG4gIGlmICghZXhpc3RzKSB0aHJvdyBuZXcgRXJyb3IoJ0FwcGxpY2F0aW9uIGRlZmluaXRpb24gZG9lcyBub3QgZXhpc3QnKTtcblxuICBjb25zdCBhcHBEZWZpbml0aW9uID0gYXdhaXQgZGF0YXN0b3JlLmxvYWRKc29uKGFwcERlZmluaXRpb25GaWxlKTtcbiAgYXBwRGVmaW5pdGlvbi5oaWVyYXJjaHkgPSBjb25zdHJ1Y3RIaWVyYXJjaHkoXG4gICAgYXBwRGVmaW5pdGlvbi5oaWVyYXJjaHksXG4gICk7XG4gIHJldHVybiBhcHBEZWZpbml0aW9uO1xufTtcbiIsImltcG9ydCB7IGpvaW4gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4uL2F1dGhBcGkvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgYXBwRGVmaW5pdGlvbkZpbGUgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgdmFsaWRhdGVBbGwgfSBmcm9tICcuL3ZhbGlkYXRlJztcbmltcG9ydCB7IGFwaVdyYXBwZXIgfSBmcm9tICcuLi9jb21tb24vYXBpV3JhcHBlcic7XG5pbXBvcnQgeyBldmVudHMgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcblxuZXhwb3J0IGNvbnN0IHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSA9IGFwcCA9PiBhc3luYyBoaWVyYXJjaHkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMudGVtcGxhdGVBcGkuc2F2ZUFwcGxpY2F0aW9uSGllcmFyY2h5LFxuICBwZXJtaXNzaW9uLndyaXRlVGVtcGxhdGVzLmlzQXV0aG9yaXplZCxcbiAgeyBoaWVyYXJjaHkgfSxcbiAgX3NhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSwgYXBwLmRhdGFzdG9yZSwgaGllcmFyY2h5LFxuKTtcblxuXG5leHBvcnQgY29uc3QgX3NhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSA9IGFzeW5jIChkYXRhc3RvcmUsIGhpZXJhcmNoeSkgPT4ge1xuICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gYXdhaXQgdmFsaWRhdGVBbGwoaGllcmFyY2h5KTtcbiAgaWYgKHZhbGlkYXRpb25FcnJvcnMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSGllcmFyY2h5IGlzIGludmFsaWQ6ICR7am9pbihcbiAgICAgIHZhbGlkYXRpb25FcnJvcnMubWFwKGUgPT4gYCR7ZS5pdGVtLm5vZGVLZXkgPyBlLml0ZW0ubm9kZUtleSgpIDogJyd9IDogJHtlLmVycm9yfWApLFxuICAgICAgJywnLFxuICAgICl9YCk7XG4gIH1cblxuICBpZiAoYXdhaXQgZGF0YXN0b3JlLmV4aXN0cyhhcHBEZWZpbml0aW9uRmlsZSkpIHtcbiAgICBjb25zdCBhcHBEZWZpbml0aW9uID0gYXdhaXQgZGF0YXN0b3JlLmxvYWRKc29uKGFwcERlZmluaXRpb25GaWxlKTtcbiAgICBhcHBEZWZpbml0aW9uLmhpZXJhcmNoeSA9IGhpZXJhcmNoeTtcbiAgICBhd2FpdCBkYXRhc3RvcmUudXBkYXRlSnNvbihhcHBEZWZpbml0aW9uRmlsZSwgYXBwRGVmaW5pdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcignLy5jb25maWcnKTtcbiAgICBjb25zdCBhcHBEZWZpbml0aW9uID0geyBhY3Rpb25zOiBbXSwgdHJpZ2dlcnM6IFtdLCBoaWVyYXJjaHkgfTtcbiAgICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlSnNvbihhcHBEZWZpbml0aW9uRmlsZSwgYXBwRGVmaW5pdGlvbik7XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBqb2luIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBhcHBEZWZpbml0aW9uRmlsZSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyB2YWxpZGF0ZVRyaWdnZXJzLCB2YWxpZGF0ZUFjdGlvbnMgfSBmcm9tICcuL3ZhbGlkYXRlJztcbmltcG9ydCB7IGFwaVdyYXBwZXIgfSBmcm9tICcuLi9jb21tb24vYXBpV3JhcHBlcic7XG5pbXBvcnQgeyBldmVudHMgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IEJhZFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3Qgc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycyA9IGFwcCA9PiBhc3luYyAoYWN0aW9ucywgdHJpZ2dlcnMpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLnRlbXBsYXRlQXBpLnNhdmVBY3Rpb25zQW5kVHJpZ2dlcnMsXG4gIHBlcm1pc3Npb24ud3JpdGVUZW1wbGF0ZXMuaXNBdXRob3JpemVkLFxuICB7IGFjdGlvbnMsIHRyaWdnZXJzIH0sXG4gIF9zYXZlQWN0aW9uc0FuZFRyaWdnZXJzLCBhcHAuZGF0YXN0b3JlLCBhY3Rpb25zLCB0cmlnZ2Vycyxcbik7XG5cbmV4cG9ydCBjb25zdCBfc2F2ZUFjdGlvbnNBbmRUcmlnZ2VycyA9IGFzeW5jIChkYXRhc3RvcmUsIGFjdGlvbnMsIHRyaWdnZXJzKSA9PiB7XG4gIGlmIChhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGFwcERlZmluaXRpb25GaWxlKSkge1xuICAgIGNvbnN0IGFwcERlZmluaXRpb24gPSBhd2FpdCBkYXRhc3RvcmUubG9hZEpzb24oYXBwRGVmaW5pdGlvbkZpbGUpO1xuICAgIGFwcERlZmluaXRpb24uYWN0aW9ucyA9IGFjdGlvbnM7XG4gICAgYXBwRGVmaW5pdGlvbi50cmlnZ2VycyA9IHRyaWdnZXJzO1xuXG4gICAgY29uc3QgYWN0aW9uVmFsaWRFcnJzID0gbWFwKGUgPT4gZS5lcnJvcikodmFsaWRhdGVBY3Rpb25zKGFjdGlvbnMpKTtcblxuICAgIGlmIChhY3Rpb25WYWxpZEVycnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgQWN0aW9ucyBhcmUgaW52YWxpZDogJHtqb2luKGFjdGlvblZhbGlkRXJycywgJywgJyl9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgdHJpZ2dlclZhbGlkRXJycyA9IG1hcChlID0+IGUuZXJyb3IpKHZhbGlkYXRlVHJpZ2dlcnModHJpZ2dlcnMsIGFjdGlvbnMpKTtcblxuICAgIGlmICh0cmlnZ2VyVmFsaWRFcnJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYFRyaWdnZXJzIGFyZSBpbnZhbGlkOiAke2pvaW4odHJpZ2dlclZhbGlkRXJycywgJywgJyl9YCk7XG4gICAgfVxuXG4gICAgYXdhaXQgZGF0YXN0b3JlLnVwZGF0ZUpzb24oYXBwRGVmaW5pdGlvbkZpbGUsIGFwcERlZmluaXRpb24pO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ0Nhbm5vdCBzYXZlIGFjdGlvbnM6IEFwcGxpY2F0aW9uIGRlZmluaXRpb24gZG9lcyBub3QgZXhpc3QnKTtcbiAgfVxufTtcbiIsIlxuZXhwb3J0IGNvbnN0IGdldEJlaGF2aW91clNvdXJjZXMgPSBhc3luYyAoZGF0YXN0b3JlKSA9PiB7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmxvYWRGaWxlKCcvLmNvbmZpZy9iZWhhdmlvdXJTb3VyY2VzLmpzJyk7XG59O1xuIiwiaW1wb3J0IHtcbiAgZ2V0TmV3Um9vdExldmVsLFxuICBnZXROZXdSZWNvcmRUZW1wbGF0ZSwgZ2V0TmV3SW5kZXhUZW1wbGF0ZSxcbiAgY3JlYXRlTm9kZUVycm9ycywgY29uc3RydWN0SGllcmFyY2h5LFxuICBnZXROZXdBZ2dyZWdhdGVHcm91cFRlbXBsYXRlLCBnZXROZXdTaW5nbGVSZWNvcmRUZW1wbGF0ZSxcbiAgZ2V0TmV3QWdncmVnYXRlVGVtcGxhdGUsIGNvbnN0cnVjdE5vZGUsXG59XG4gIGZyb20gJy4vY3JlYXRlTm9kZXMnO1xuaW1wb3J0IHtcbiAgZ2V0TmV3RmllbGQsIHZhbGlkYXRlRmllbGQsXG4gIGFkZEZpZWxkLCBmaWVsZEVycm9ycyxcbn0gZnJvbSAnLi9maWVsZHMnO1xuaW1wb3J0IHtcbiAgZ2V0TmV3UmVjb3JkVmFsaWRhdGlvblJ1bGUsIGNvbW1vblJlY29yZFZhbGlkYXRpb25SdWxlcyxcbiAgYWRkUmVjb3JkVmFsaWRhdGlvblJ1bGUsXG59IGZyb20gJy4vcmVjb3JkVmFsaWRhdGlvblJ1bGVzJztcbmltcG9ydCB7IGNyZWF0ZUFjdGlvbiwgY3JlYXRlVHJpZ2dlciB9IGZyb20gJy4vY3JlYXRlQWN0aW9ucyc7XG5pbXBvcnQge1xuICB2YWxpZGF0ZVRyaWdnZXJzLCB2YWxpZGF0ZVRyaWdnZXIsIHZhbGlkYXRlTm9kZSxcbiAgdmFsaWRhdGVBY3Rpb25zLCB2YWxpZGF0ZUFsbCxcbn0gZnJvbSAnLi92YWxpZGF0ZSc7XG5pbXBvcnQgeyBnZXRBcHBsaWNhdGlvbkRlZmluaXRpb24gfSBmcm9tICcuL2dldEFwcGxpY2F0aW9uRGVmaW5pdGlvbic7XG5pbXBvcnQgeyBzYXZlQXBwbGljYXRpb25IaWVyYXJjaHkgfSBmcm9tICcuL3NhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeSc7XG5pbXBvcnQgeyBzYXZlQWN0aW9uc0FuZFRyaWdnZXJzIH0gZnJvbSAnLi9zYXZlQWN0aW9uc0FuZFRyaWdnZXJzJztcbmltcG9ydCB7IGFsbCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGdldEJlaGF2aW91clNvdXJjZXMgfSBmcm9tIFwiLi9nZXRCZWhhdmlvdXJTb3VyY2VzXCI7XG5cbmNvbnN0IGFwaSA9IGFwcCA9PiAoe1xuXG4gIGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbjogZ2V0QXBwbGljYXRpb25EZWZpbml0aW9uKGFwcC5kYXRhc3RvcmUpLFxuICBzYXZlQXBwbGljYXRpb25IaWVyYXJjaHk6IHNhdmVBcHBsaWNhdGlvbkhpZXJhcmNoeShhcHApLFxuICBzYXZlQWN0aW9uc0FuZFRyaWdnZXJzOiBzYXZlQWN0aW9uc0FuZFRyaWdnZXJzKGFwcCksXG4gIGdldEJlaGF2aW91clNvdXJjZXM6ICgpID0+IGdldEJlaGF2aW91clNvdXJjZXMoYXBwLmRhdGFzdG9yZSksXG4gIGdldE5ld1Jvb3RMZXZlbCxcbiAgY29uc3RydWN0Tm9kZSxcbiAgZ2V0TmV3SW5kZXhUZW1wbGF0ZSxcbiAgZ2V0TmV3UmVjb3JkVGVtcGxhdGUsXG4gIGdldE5ld0ZpZWxkLFxuICB2YWxpZGF0ZUZpZWxkLFxuICBhZGRGaWVsZCxcbiAgZmllbGRFcnJvcnMsXG4gIGdldE5ld1JlY29yZFZhbGlkYXRpb25SdWxlLFxuICBjb21tb25SZWNvcmRWYWxpZGF0aW9uUnVsZXMsXG4gIGFkZFJlY29yZFZhbGlkYXRpb25SdWxlLFxuICBjcmVhdGVBY3Rpb24sXG4gIGNyZWF0ZVRyaWdnZXIsXG4gIHZhbGlkYXRlQWN0aW9ucyxcbiAgdmFsaWRhdGVUcmlnZ2VyLFxuICBnZXROZXdBZ2dyZWdhdGVHcm91cFRlbXBsYXRlLFxuICBnZXROZXdBZ2dyZWdhdGVUZW1wbGF0ZSxcbiAgY29uc3RydWN0SGllcmFyY2h5LFxuICBnZXROZXdTaW5nbGVSZWNvcmRUZW1wbGF0ZSxcbiAgYWxsVHlwZXM6IGFsbCxcbiAgdmFsaWRhdGVOb2RlLFxuICB2YWxpZGF0ZUFsbCxcbiAgdmFsaWRhdGVUcmlnZ2Vycyxcbn0pO1xuXG5cbmV4cG9ydCBjb25zdCBnZXRUZW1wbGF0ZUFwaSA9IGFwcCA9PiBhcGkoYXBwKTtcblxuZXhwb3J0IGNvbnN0IGVycm9ycyA9IGNyZWF0ZU5vZGVFcnJvcnM7XG5cbmV4cG9ydCBkZWZhdWx0IGdldFRlbXBsYXRlQXBpO1xuIiwiaW1wb3J0IHsgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7XG4gIFVTRVJTX0xJU1RfRklMRSxcbiAgc3RyaXBVc2VyT2ZTZW5zaXRpdmVTdHVmZixcbn0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7ICQsIGFwaVdyYXBwZXIsIGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5cbmV4cG9ydCBjb25zdCBnZXRVc2VycyA9IGFwcCA9PiBhc3luYyAoKSA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmdldFVzZXJzLFxuICBwZXJtaXNzaW9uLmxpc3RVc2Vycy5pc0F1dGhvcml6ZWQsXG4gIHt9LFxuICBfZ2V0VXNlcnMsIGFwcCxcbik7XG5cbmV4cG9ydCBjb25zdCBfZ2V0VXNlcnMgPSBhc3luYyBhcHAgPT4gJChhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSksIFtcbiAgbWFwKHN0cmlwVXNlck9mU2Vuc2l0aXZlU3R1ZmYpLFxuXSk7XG4iLCJpbXBvcnQgeyBBQ0NFU1NfTEVWRUxTX0ZJTEUgfSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgYXBpV3JhcHBlciwgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGxvYWRBY2Nlc3NMZXZlbHMgPSBhcHAgPT4gYXN5bmMgKCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5sb2FkQWNjZXNzTGV2ZWxzLFxuICBwZXJtaXNzaW9uLmxpc3RBY2Nlc3NMZXZlbHMuaXNBdXRob3JpemVkLFxuICB7fSxcbiAgX2xvYWRBY2Nlc3NMZXZlbHMsIGFwcCxcbik7XG5cbmV4cG9ydCBjb25zdCBfbG9hZEFjY2Vzc0xldmVscyA9IGFzeW5jIGFwcCA9PiBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKEFDQ0VTU19MRVZFTFNfRklMRSk7XG4iLCJpbXBvcnQge1xuICBmaW5kLCBmaWx0ZXIsIHNvbWUsXG4gIG1hcCwgZmxhdHRlbixcbn0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnc2hvcnRpZCc7XG5pbXBvcnQgeyBfZ2V0VXNlcnMgfSBmcm9tICcuL2dldFVzZXJzJztcbmltcG9ydCB7XG4gIGdldFVzZXJCeU5hbWUsIHVzZXJBdXRoRmlsZSxcbiAgcGFyc2VUZW1wb3JhcnlDb2RlLFxufSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgX2xvYWRBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL2xvYWRBY2Nlc3NMZXZlbHMnO1xuaW1wb3J0IHtcbiAgaXNOb3RoaW5nT3JFbXB0eSwgJCwgYXBpV3JhcHBlciwgZXZlbnRzLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5jb25zdCBkdW1teUhhc2ggPSAnJGFyZ29uMmkkdj0xOSRtPTQwOTYsdD0zLHA9MSRVWlJvNDA5VVlCR2pISlMzQ1Y2VXh3JHJVODRxVXFQZU9SRnpLWW1ZWTBjZUJMRGFQTytKV1NINFBmTmlLWGZJS2snO1xuXG5leHBvcnQgY29uc3QgYXV0aGVudGljYXRlID0gYXBwID0+IGFzeW5jICh1c2VybmFtZSwgcGFzc3dvcmQpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuYXV0aGVudGljYXRlLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHVzZXJuYW1lLCBwYXNzd29yZCB9LFxuICBfYXV0aGVudGljYXRlLCBhcHAsIHVzZXJuYW1lLCBwYXNzd29yZCxcbik7XG5cbmV4cG9ydCBjb25zdCBfYXV0aGVudGljYXRlID0gYXN5bmMgKGFwcCwgdXNlcm5hbWUsIHBhc3N3b3JkKSA9PiB7XG4gIGlmIChpc05vdGhpbmdPckVtcHR5KHVzZXJuYW1lKSB8fCBpc05vdGhpbmdPckVtcHR5KHBhc3N3b3JkKSkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIGNvbnN0IGFsbFVzZXJzID0gYXdhaXQgX2dldFVzZXJzKGFwcCk7XG4gIGxldCB1c2VyID0gZ2V0VXNlckJ5TmFtZShcbiAgICBhbGxVc2VycyxcbiAgICB1c2VybmFtZSxcbiAgKTtcblxuICBjb25zdCBub3RBVXNlciA9ICdub3QtYS11c2VyJztcbiAgLy8gY29udGludWUgd2l0aCBub24tdXNlciAtIHNvIHRpbWUgdG8gdmVyaWZ5IHJlbWFpbnMgY29uc2lzdGVudFxuICAvLyB3aXRoIHZlcmlmaWNhdGlvbiBvZiBhIHZhbGlkIHVzZXJcbiAgaWYgKCF1c2VyIHx8ICF1c2VyLmVuYWJsZWQpIHsgdXNlciA9IG5vdEFVc2VyOyB9XG5cbiAgbGV0IHVzZXJBdXRoO1xuICB0cnkge1xuICAgIHVzZXJBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICAgIHVzZXJBdXRoRmlsZSh1c2VybmFtZSksXG4gICAgKTtcbiAgfSBjYXRjaCAoXykge1xuICAgIHVzZXJBdXRoID0geyBhY2Nlc3NMZXZlbHM6IFtdLCBwYXNzd29yZEhhc2g6IGR1bW15SGFzaCB9O1xuICB9XG5cbiAgY29uc3QgcGVybWlzc2lvbnMgPSBhd2FpdCBidWlsZFVzZXJQZXJtaXNzaW9ucyhhcHAsIHVzZXIuYWNjZXNzTGV2ZWxzKTtcblxuICBjb25zdCB2ZXJpZmllZCA9IGF3YWl0IGFwcC5jcnlwdG8udmVyaWZ5KFxuICAgIHVzZXJBdXRoLnBhc3N3b3JkSGFzaCxcbiAgICBwYXNzd29yZCxcbiAgKTtcblxuICBpZiAodXNlciA9PT0gbm90QVVzZXIpIHsgcmV0dXJuIG51bGw7IH1cblxuICByZXR1cm4gdmVyaWZpZWRcbiAgICA/IHtcbiAgICAgIC4uLnVzZXIsIHBlcm1pc3Npb25zLCB0ZW1wOiBmYWxzZSwgaXNVc2VyOiB0cnVlLFxuICAgIH1cbiAgICA6IG51bGw7XG59O1xuXG5leHBvcnQgY29uc3QgYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzID0gYXBwID0+IGFzeW5jICh0ZW1wQWNjZXNzQ29kZSkgPT4ge1xuICBpZiAoaXNOb3RoaW5nT3JFbXB0eSh0ZW1wQWNjZXNzQ29kZSkpIHsgcmV0dXJuIG51bGw7IH1cblxuICBjb25zdCB0ZW1wID0gcGFyc2VUZW1wb3JhcnlDb2RlKHRlbXBBY2Nlc3NDb2RlKTtcbiAgbGV0IHVzZXIgPSAkKGF3YWl0IF9nZXRVc2VycyhhcHApLCBbXG4gICAgZmluZCh1ID0+IHUudGVtcG9yYXJ5QWNjZXNzSWQgPT09IHRlbXAuaWQpLFxuICBdKTtcblxuICBjb25zdCBub3RBVXNlciA9ICdub3QtYS11c2VyJztcbiAgaWYgKCF1c2VyIHx8ICF1c2VyLmVuYWJsZWQpIHsgdXNlciA9IG5vdEFVc2VyOyB9XG5cbiAgbGV0IHVzZXJBdXRoO1xuICB0cnkge1xuICAgIHVzZXJBdXRoID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICAgIHVzZXJBdXRoRmlsZSh1c2VyLm5hbWUpLFxuICAgICk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB1c2VyQXV0aCA9IHtcbiAgICAgIHRlbXBvcmFyeUFjY2Vzc0hhc2g6IGR1bW15SGFzaCxcbiAgICAgIHRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoOiAoYXdhaXQgYXBwLmdldEVwb2NoVGltZSgpICsgMTAwMDApLFxuICAgIH07XG4gIH1cblxuICBpZiAodXNlckF1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPCBhd2FpdCBhcHAuZ2V0RXBvY2hUaW1lKCkpIHsgdXNlciA9IG5vdEFVc2VyOyB9XG5cbiAgY29uc3QgdGVtcENvZGUgPSAhdGVtcC5jb2RlID8gZ2VuZXJhdGUoKSA6IHRlbXAuY29kZTtcbiAgY29uc3QgdmVyaWZpZWQgPSBhd2FpdCBhcHAuY3J5cHRvLnZlcmlmeShcbiAgICB1c2VyQXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoLFxuICAgIHRlbXBDb2RlLFxuICApO1xuXG4gIGlmICh1c2VyID09PSBub3RBVXNlcikgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHJldHVybiB2ZXJpZmllZFxuICAgID8ge1xuICAgICAgLi4udXNlcixcbiAgICAgIHBlcm1pc3Npb25zOiBbXSxcbiAgICAgIHRlbXA6IHRydWUsXG4gICAgICBpc1VzZXI6IHRydWUsXG4gICAgfVxuICAgIDogbnVsbDtcbn07XG5cbmV4cG9ydCBjb25zdCBidWlsZFVzZXJQZXJtaXNzaW9ucyA9IGFzeW5jIChhcHAsIHVzZXJBY2Nlc3NMZXZlbHMpID0+IHtcbiAgY29uc3QgYWxsQWNjZXNzTGV2ZWxzID0gYXdhaXQgX2xvYWRBY2Nlc3NMZXZlbHMoYXBwKTtcblxuICByZXR1cm4gJChhbGxBY2Nlc3NMZXZlbHMubGV2ZWxzLCBbXG4gICAgZmlsdGVyKGwgPT4gc29tZSh1YSA9PiBsLm5hbWUgPT09IHVhKSh1c2VyQWNjZXNzTGV2ZWxzKSksXG4gICAgbWFwKGwgPT4gbC5wZXJtaXNzaW9ucyksXG4gICAgZmxhdHRlbixcbiAgXSk7XG59O1xuIiwiaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdzaG9ydGlkJztcbmltcG9ydCB7XG4gIHRlbXBDb2RlRXhwaXJ5TGVuZ3RoLCBVU0VSU19MT0NLX0ZJTEUsXG4gIFVTRVJTX0xJU1RfRklMRSwgdXNlckF1dGhGaWxlLFxuICBnZXRVc2VyQnlOYW1lLFxufSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHtcbiAgZ2V0TG9jaywgaXNOb2xvY2ssXG4gIHJlbGVhc2VMb2NrLFxufSBmcm9tICcuLi9jb21tb24vbG9jayc7XG5pbXBvcnQgeyBhcGlXcmFwcGVyLCBldmVudHMgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzID0gYXBwID0+IGFzeW5jIHVzZXJOYW1lID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuY3JlYXRlVGVtcG9yYXJ5QWNjZXNzLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHVzZXJOYW1lIH0sXG4gIF9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MsIGFwcCwgdXNlck5hbWUsXG4pO1xuXG5leHBvcnQgY29uc3QgX2NyZWF0ZVRlbXBvcmFyeUFjY2VzcyA9IGFzeW5jIChhcHAsIHVzZXJOYW1lKSA9PiB7XG4gIGNvbnN0IHRlbXBDb2RlID0gYXdhaXQgZ2V0VGVtcG9yYXJ5Q29kZShhcHApO1xuXG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZXRMb2NrKFxuICAgIGFwcCwgVVNFUlNfTE9DS19GSUxFLCAxMDAwLCAyLFxuICApO1xuXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBjcmVhdGUgdGVtcG9yYXJ5IGFjY2VzcywgY291bGQgbm90IGdldCBsb2NrIC0gdHJ5IGFnYWluJyk7IH1cblxuICB0cnkge1xuICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihVU0VSU19MSVNUX0ZJTEUpO1xuXG4gICAgY29uc3QgdXNlciA9IGdldFVzZXJCeU5hbWUodXNlcnMsIHVzZXJOYW1lKTtcbiAgICB1c2VyLnRlbXBvcmFyeUFjY2Vzc0lkID0gdGVtcENvZGUudGVtcG9yYXJ5QWNjZXNzSWQ7XG5cbiAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgICBVU0VSU19MSVNUX0ZJTEUsXG4gICAgICB1c2VycyxcbiAgICApO1xuICB9IGZpbmFsbHkge1xuICAgIGF3YWl0IHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XG4gIH1cblxuICBjb25zdCB1c2VyQXV0aCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgdXNlckF1dGhGaWxlKHVzZXJOYW1lKSxcbiAgKTtcbiAgdXNlckF1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaCA9IHRlbXBDb2RlLnRlbXBvcmFyeUFjY2Vzc0hhc2g7XG5cbiAgdXNlckF1dGgudGVtcG9yYXJ5QWNjZXNzRXhwaXJ5RXBvY2ggPSB0ZW1wQ29kZS50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaDtcblxuICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgdXNlckF1dGhGaWxlKHVzZXJOYW1lKSxcbiAgICB1c2VyQXV0aCxcbiAgKTtcblxuICByZXR1cm4gdGVtcENvZGUudGVtcENvZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VGVtcG9yYXJ5Q29kZSA9IGFzeW5jIChhcHApID0+IHtcbiAgY29uc3QgdGVtcENvZGUgPSBnZW5lcmF0ZSgpXG4gICAgICAgICsgZ2VuZXJhdGUoKVxuICAgICAgICArIGdlbmVyYXRlKClcbiAgICAgICAgKyBnZW5lcmF0ZSgpO1xuXG4gIGNvbnN0IHRlbXBJZCA9IGdlbmVyYXRlKCk7XG5cbiAgcmV0dXJuIHtcbiAgICB0ZW1wb3JhcnlBY2Nlc3NIYXNoOiBhd2FpdCBhcHAuY3J5cHRvLmhhc2goXG4gICAgICB0ZW1wQ29kZSxcbiAgICApLFxuICAgIHRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoOlxuICAgICAgICAgICAgKGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKSkgKyB0ZW1wQ29kZUV4cGlyeUxlbmd0aCxcbiAgICB0ZW1wQ29kZTogYHRtcDoke3RlbXBJZH06JHt0ZW1wQ29kZX1gLFxuICAgIHRlbXBvcmFyeUFjY2Vzc0lkOiB0ZW1wSWQsXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgbG9va3NMaWtlVGVtcG9yYXJ5Q29kZSA9IGNvZGUgPT4gY29kZS5zdGFydHNXaXRoKCd0bXA6Jyk7XG4iLCJpbXBvcnQge1xuICBtYXAsIHVuaXFXaXRoLFxuICBmbGF0dGVuLCBmaWx0ZXIsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBhcHBseVJ1bGVTZXQsIG1ha2VydWxlIH0gZnJvbSAnLi4vY29tbW9uL3ZhbGlkYXRpb25Db21tb24nO1xuaW1wb3J0IHtcbiAgJCwgaW5zZW5zaXRpdmVFcXVhbHMsIGFwaVdyYXBwZXIsIGV2ZW50cyxcbiAgaXNOb25FbXB0eVN0cmluZywgYWxsLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5jb25zdCB1c2VyUnVsZXMgPSBhbGxVc2VycyA9PiBbXG4gIG1ha2VydWxlKCduYW1lJywgJ3VzZXJuYW1lIG11c3QgYmUgc2V0JyxcbiAgICB1ID0+IGlzTm9uRW1wdHlTdHJpbmcodS5uYW1lKSksXG4gIG1ha2VydWxlKCdhY2Nlc3NMZXZlbHMnLCAndXNlciBtdXN0IGhhdmUgYXQgbGVhc3Qgb25lIGFjY2VzcyBsZXZlbCcsXG4gICAgdSA9PiB1LmFjY2Vzc0xldmVscy5sZW5ndGggPiAwKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAndXNlcm5hbWUgbXVzdCBiZSB1bmlxdWUnLFxuICAgIHUgPT4gZmlsdGVyKHUyID0+IGluc2Vuc2l0aXZlRXF1YWxzKHUyLm5hbWUsIHUubmFtZSkpKGFsbFVzZXJzKS5sZW5ndGggPT09IDEpLFxuICBtYWtlcnVsZSgnYWNjZXNzTGV2ZWxzJywgJ2FjY2VzcyBsZXZlbHMgbXVzdCBvbmx5IGNvbnRhaW4gc3RpbmdzJyxcbiAgICB1ID0+IGFsbChpc05vbkVtcHR5U3RyaW5nKSh1LmFjY2Vzc0xldmVscykpLFxuXTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVXNlciA9ICgpID0+IChhbGx1c2VycywgdXNlcikgPT4gYXBwbHlSdWxlU2V0KHVzZXJSdWxlcyhhbGx1c2VycykpKHVzZXIpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVVc2VycyA9IGFwcCA9PiBhbGxVc2VycyA9PiBhcGlXcmFwcGVyKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLnZhbGlkYXRlVXNlcnMsXG4gIGFsd2F5c0F1dGhvcml6ZWQsXG4gIHsgYWxsVXNlcnMgfSxcbiAgX3ZhbGlkYXRlVXNlcnMsIGFwcCwgYWxsVXNlcnMsXG4pO1xuXG5leHBvcnQgY29uc3QgX3ZhbGlkYXRlVXNlcnMgPSAoYXBwLCBhbGxVc2VycykgPT4gJChhbGxVc2VycywgW1xuICBtYXAobCA9PiB2YWxpZGF0ZVVzZXIoYXBwKShhbGxVc2VycywgbCkpLFxuICBmbGF0dGVuLFxuICB1bmlxV2l0aCgoeCwgeSkgPT4geC5maWVsZCA9PT0geS5maWVsZFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgeC5pdGVtID09PSB5Lml0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHguZXJyb3IgPT09IHkuZXJyb3IpLFxuXSk7XG4iLCJpbXBvcnQgeyBhcGlXcmFwcGVyU3luYywgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IGdldE5ld1VzZXIgPSBhcHAgPT4gKCkgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuZ2V0TmV3VXNlcixcbiAgcGVybWlzc2lvbi5jcmVhdGVVc2VyLmlzQXV0aG9yaXplZCxcbiAge30sXG4gIF9nZXROZXdVc2VyLCBhcHAsXG4pO1xuXG5leHBvcnQgY29uc3QgX2dldE5ld1VzZXIgPSAoKSA9PiAoe1xuICBuYW1lOiAnJyxcbiAgYWNjZXNzTGV2ZWxzOiBbXSxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgdGVtcG9yYXJ5QWNjZXNzSWQ6ICcnLFxufSk7XG5cbmV4cG9ydCBjb25zdCBnZXROZXdVc2VyQXV0aCA9IGFwcCA9PiAoKSA9PiBhcGlXcmFwcGVyU3luYyhcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5nZXROZXdVc2VyQXV0aCxcbiAgcGVybWlzc2lvbi5jcmVhdGVVc2VyLmlzQXV0aG9yaXplZCxcbiAge30sXG4gIF9nZXROZXdVc2VyQXV0aCwgYXBwLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9nZXROZXdVc2VyQXV0aCA9ICgpID0+ICh7XG4gIHBhc3N3b3JkSGFzaDogJycsXG4gIHRlbXBvcmFyeUFjY2Vzc0hhc2g6ICcnLFxuICB0ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaDogMCxcbn0pO1xuIiwiaW1wb3J0IHsgZmluZCB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyB1c2VyQXV0aEZpbGUsIHBhcnNlVGVtcG9yYXJ5Q29kZSB9IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQge1xuICBpc1NvbWV0aGluZywgJCwgYXBpV3JhcHBlciwgYXBpV3JhcHBlclN5bmMsIGV2ZW50cyxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IF9nZXRVc2VycyB9IGZyb20gJy4vZ2V0VXNlcnMnO1xuaW1wb3J0IHsgYWx3YXlzQXV0aG9yaXplZCB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuXG5leHBvcnQgY29uc3QgaXNWYWxpZFBhc3N3b3JkID0gYXBwID0+IHBhc3N3b3JkID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLmlzVmFsaWRQYXNzd29yZCxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyBwYXNzd29yZCB9LFxuICBfaXNWYWxpZFBhc3N3b3JkLCBhcHAsIHBhc3N3b3JkLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9pc1ZhbGlkUGFzc3dvcmQgPSAoYXBwLCBwYXNzd29yZCkgPT4gc2NvcmVQYXNzd29yZChwYXNzd29yZCkuc2NvcmUgPiAzMDtcblxuZXhwb3J0IGNvbnN0IGNoYW5nZU15UGFzc3dvcmQgPSBhcHAgPT4gYXN5bmMgKGN1cnJlbnRQdywgbmV3cGFzc3dvcmQpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuY2hhbmdlTXlQYXNzd29yZCxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyBjdXJyZW50UHcsIG5ld3Bhc3N3b3JkIH0sXG4gIF9jaGFuZ2VNeVBhc3N3b3JkLCBhcHAsIGN1cnJlbnRQdywgbmV3cGFzc3dvcmQsXG4pO1xuXG5leHBvcnQgY29uc3QgX2NoYW5nZU15UGFzc3dvcmQgPSBhc3luYyAoYXBwLCBjdXJyZW50UHcsIG5ld3Bhc3N3b3JkKSA9PiB7XG4gIGNvbnN0IGV4aXN0aW5nQXV0aCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgdXNlckF1dGhGaWxlKGFwcC51c2VyLm5hbWUpLFxuICApO1xuXG4gIGlmIChpc1NvbWV0aGluZyhleGlzdGluZ0F1dGgucGFzc3dvcmRIYXNoKSkge1xuICAgIGNvbnN0IHZlcmlmaWVkID0gYXdhaXQgYXBwLmNyeXB0by52ZXJpZnkoXG4gICAgICBleGlzdGluZ0F1dGgucGFzc3dvcmRIYXNoLFxuICAgICAgY3VycmVudFB3LFxuICAgICk7XG5cbiAgICBpZiAodmVyaWZpZWQpIHtcbiAgICAgIGF3YWl0IGF3YWl0IGRvU2V0KFxuICAgICAgICBhcHAsIGV4aXN0aW5nQXV0aCxcbiAgICAgICAgYXBwLnVzZXIubmFtZSwgbmV3cGFzc3dvcmQsXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuZXhwb3J0IGNvbnN0IHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUgPSBhcHAgPT4gYXN5bmMgKHRlbXBDb2RlLCBuZXdwYXNzd29yZCkgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5zZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IHRlbXBDb2RlLCBuZXdwYXNzd29yZCB9LFxuICBfc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZSwgYXBwLCB0ZW1wQ29kZSwgbmV3cGFzc3dvcmQsXG4pO1xuXG5cbmV4cG9ydCBjb25zdCBfc2V0UGFzc3dvcmRGcm9tVGVtcG9yYXJ5Q29kZSA9IGFzeW5jIChhcHAsIHRlbXBDb2RlLCBuZXdwYXNzd29yZCkgPT4ge1xuICBjb25zdCBjdXJyZW50VGltZSA9IGF3YWl0IGFwcC5nZXRFcG9jaFRpbWUoKTtcblxuICBjb25zdCB0ZW1wID0gcGFyc2VUZW1wb3JhcnlDb2RlKHRlbXBDb2RlKTtcblxuICBjb25zdCB1c2VyID0gJChhd2FpdCBfZ2V0VXNlcnMoYXBwKSwgW1xuICAgIGZpbmQodSA9PiB1LnRlbXBvcmFyeUFjY2Vzc0lkID09PSB0ZW1wLmlkKSxcbiAgXSk7XG5cbiAgaWYgKCF1c2VyKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGNvbnN0IGV4aXN0aW5nQXV0aCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgdXNlckF1dGhGaWxlKHVzZXIubmFtZSksXG4gICk7XG5cbiAgaWYgKGlzU29tZXRoaW5nKGV4aXN0aW5nQXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoKVxuICAgICAgICYmIGV4aXN0aW5nQXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA+IGN1cnJlbnRUaW1lKSB7XG4gICAgY29uc3QgdmVyaWZpZWQgPSBhd2FpdCBhcHAuY3J5cHRvLnZlcmlmeShcbiAgICAgIGV4aXN0aW5nQXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoLFxuICAgICAgdGVtcC5jb2RlLFxuICAgICk7XG5cbiAgICBpZiAodmVyaWZpZWQpIHtcbiAgICAgIGF3YWl0IGRvU2V0KFxuICAgICAgICBhcHAsIGV4aXN0aW5nQXV0aCxcbiAgICAgICAgdXNlci5uYW1lLCBuZXdwYXNzd29yZCxcbiAgICAgICk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5jb25zdCBkb1NldCA9IGFzeW5jIChhcHAsIGF1dGgsIHVzZXJuYW1lLCBuZXdwYXNzd29yZCkgPT4ge1xuICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0hhc2ggPSAnJztcbiAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaCA9IDA7XG4gIGF1dGgucGFzc3dvcmRIYXNoID0gYXdhaXQgYXBwLmNyeXB0by5oYXNoKFxuICAgIG5ld3Bhc3N3b3JkLFxuICApO1xuICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oXG4gICAgdXNlckF1dGhGaWxlKHVzZXJuYW1lKSxcbiAgICBhdXRoLFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IHNjb3JlUGFzc3dvcmQgPSBhcHAgPT4gcGFzc3dvcmQgPT4gYXBpV3JhcHBlclN5bmMoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuc2NvcmVQYXNzd29yZCxcbiAgYWx3YXlzQXV0aG9yaXplZCxcbiAgeyBwYXNzd29yZCB9LFxuICBfc2NvcmVQYXNzd29yZCwgcGFzc3dvcmQsXG4pO1xuXG5leHBvcnQgY29uc3QgX3Njb3JlUGFzc3dvcmQgPSAocGFzc3dvcmQpID0+IHtcbiAgLy8gZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85NDgxNzIvcGFzc3dvcmQtc3RyZW5ndGgtbWV0ZXJcbiAgLy8gdGhhbmsgeW91IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vdXNlcnMvNDY2MTcvdG0tbHZcblxuICBsZXQgc2NvcmUgPSAwO1xuICBpZiAoIXBhc3N3b3JkKSB7IHJldHVybiBzY29yZTsgfVxuXG4gIC8vIGF3YXJkIGV2ZXJ5IHVuaXF1ZSBsZXR0ZXIgdW50aWwgNSByZXBldGl0aW9uc1xuICBjb25zdCBsZXR0ZXJzID0gbmV3IE9iamVjdCgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhc3N3b3JkLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0dGVyc1twYXNzd29yZFtpXV0gPSAobGV0dGVyc1twYXNzd29yZFtpXV0gfHwgMCkgKyAxO1xuICAgIHNjb3JlICs9IDUuMCAvIGxldHRlcnNbcGFzc3dvcmRbaV1dO1xuICB9XG5cbiAgLy8gYm9udXMgcG9pbnRzIGZvciBtaXhpbmcgaXQgdXBcbiAgY29uc3QgdmFyaWF0aW9ucyA9IHtcbiAgICBkaWdpdHM6IC9cXGQvLnRlc3QocGFzc3dvcmQpLFxuICAgIGxvd2VyOiAvW2Etel0vLnRlc3QocGFzc3dvcmQpLFxuICAgIHVwcGVyOiAvW0EtWl0vLnRlc3QocGFzc3dvcmQpLFxuICAgIG5vbldvcmRzOiAvXFxXLy50ZXN0KHBhc3N3b3JkKSxcbiAgfTtcblxuICBsZXQgdmFyaWF0aW9uQ291bnQgPSAwO1xuICBmb3IgKGNvbnN0IGNoZWNrIGluIHZhcmlhdGlvbnMpIHtcbiAgICB2YXJpYXRpb25Db3VudCArPSAodmFyaWF0aW9uc1tjaGVja10gPT0gdHJ1ZSkgPyAxIDogMDtcbiAgfVxuICBzY29yZSArPSAodmFyaWF0aW9uQ291bnQgLSAxKSAqIDEwO1xuXG4gIGNvbnN0IHN0cmVuZ3RoVGV4dCA9IHNjb3JlID4gODBcbiAgICA/ICdzdHJvbmcnXG4gICAgOiBzY29yZSA+IDYwXG4gICAgICA/ICdnb29kJ1xuICAgICAgOiBzY29yZSA+PSAzMFxuICAgICAgICA/ICd3ZWFrJ1xuICAgICAgICA6ICd2ZXJ5IHdlYWsnO1xuXG4gIHJldHVybiB7XG4gICAgc2NvcmU6IHBhcnNlSW50KHNjb3JlKSxcbiAgICBzdHJlbmd0aFRleHQsXG4gIH07XG59O1xuIiwiaW1wb3J0IHsgam9pbiwgc29tZSB9IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyB2YWxpZGF0ZVVzZXIgfSBmcm9tICcuL3ZhbGlkYXRlVXNlcic7XG5pbXBvcnQgeyBnZXROZXdVc2VyQXV0aCB9IGZyb20gJy4vZ2V0TmV3VXNlcic7XG5pbXBvcnQge1xuICBnZXRMb2NrLCBpc05vbG9jaywgcmVsZWFzZUxvY2ssIGFwaVdyYXBwZXIsIGV2ZW50cyxcbiAgaW5zZW5zaXRpdmVFcXVhbHMsIGlzTm9uRW1wdHlTdHJpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBVU0VSU19MT0NLX0ZJTEUsIHN0cmlwVXNlck9mU2Vuc2l0aXZlU3R1ZmYsXG4gIFVTRVJTX0xJU1RfRklMRSwgdXNlckF1dGhGaWxlLFxufSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgZ2V0VGVtcG9yYXJ5Q29kZSB9IGZyb20gJy4vY3JlYXRlVGVtcG9yYXJ5QWNjZXNzJztcbmltcG9ydCB7IGlzVmFsaWRQYXNzd29yZCB9IGZyb20gJy4vc2V0UGFzc3dvcmQnO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgQmFkUmVxdWVzdEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVVc2VyID0gYXBwID0+IGFzeW5jICh1c2VyLCBwYXNzd29yZCA9IG51bGwpID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuY3JlYXRlVXNlcixcbiAgcGVybWlzc2lvbi5jcmVhdGVVc2VyLmlzQXV0aG9yaXplZCxcbiAgeyB1c2VyLCBwYXNzd29yZCB9LFxuICBfY3JlYXRlVXNlciwgYXBwLCB1c2VyLCBwYXNzd29yZCxcbik7XG5cbmV4cG9ydCBjb25zdCBfY3JlYXRlVXNlciA9IGFzeW5jIChhcHAsIHVzZXIsIHBhc3N3b3JkID0gbnVsbCkgPT4ge1xuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhcbiAgICBhcHAsIFVTRVJTX0xPQ0tfRklMRSwgMTAwMCwgMixcbiAgKTtcblxuICBpZiAoaXNOb2xvY2sobG9jaykpIHsgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gY3JlYXRlIHVzZXIsIGNvdWxkIG5vdCBnZXQgbG9jayAtIHRyeSBhZ2FpbicpOyB9XG5cbiAgY29uc3QgdXNlcnMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmxvYWRKc29uKFVTRVJTX0xJU1RfRklMRSk7XG5cbiAgY29uc3QgdXNlckVycm9ycyA9IHZhbGlkYXRlVXNlcihhcHApKFsuLi51c2VycywgdXNlcl0sIHVzZXIpO1xuICBpZiAodXNlckVycm9ycy5sZW5ndGggPiAwKSB7IHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoYFVzZXIgaXMgaW52YWxpZC4gJHtqb2luKCc7ICcpKHVzZXJFcnJvcnMpfWApOyB9XG5cbiAgY29uc3QgeyBhdXRoLCB0ZW1wQ29kZSwgdGVtcG9yYXJ5QWNjZXNzSWQgfSA9IGF3YWl0IGdldEFjY2VzcyhcbiAgICBhcHAsIHBhc3N3b3JkLFxuICApO1xuICB1c2VyLnRlbXBDb2RlID0gdGVtcENvZGU7XG4gIHVzZXIudGVtcG9yYXJ5QWNjZXNzSWQgPSB0ZW1wb3JhcnlBY2Nlc3NJZDtcblxuICBpZiAoc29tZSh1ID0+IGluc2Vuc2l0aXZlRXF1YWxzKHUubmFtZSwgdXNlci5uYW1lKSkodXNlcnMpKSB7IFxuICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0RXJyb3IoJ1VzZXIgYWxyZWFkeSBleGlzdHMnKTsgXG4gIH1cblxuICB1c2Vycy5wdXNoKFxuICAgIHN0cmlwVXNlck9mU2Vuc2l0aXZlU3R1ZmYodXNlciksXG4gICk7XG5cbiAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFxuICAgIFVTRVJTX0xJU1RfRklMRSxcbiAgICB1c2VycyxcbiAgKTtcblxuICB0cnkge1xuICAgIGF3YWl0IGFwcC5kYXRhc3RvcmUuY3JlYXRlSnNvbihcbiAgICAgIHVzZXJBdXRoRmlsZSh1c2VyLm5hbWUpLFxuICAgICAgYXV0aCxcbiAgICApO1xuICB9IGNhdGNoIChfKSB7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFxuICAgICAgdXNlckF1dGhGaWxlKHVzZXIubmFtZSksXG4gICAgICBhdXRoLFxuICAgICk7XG4gIH1cblxuICBhd2FpdCByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xuXG4gIHJldHVybiB1c2VyO1xufTtcblxuY29uc3QgZ2V0QWNjZXNzID0gYXN5bmMgKGFwcCwgcGFzc3dvcmQpID0+IHtcbiAgY29uc3QgYXV0aCA9IGdldE5ld1VzZXJBdXRoKGFwcCkoKTtcblxuICBpZiAoaXNOb25FbXB0eVN0cmluZyhwYXNzd29yZCkpIHtcbiAgICBpZiAoaXNWYWxpZFBhc3N3b3JkKHBhc3N3b3JkKSkge1xuICAgICAgYXV0aC5wYXNzd29yZEhhc2ggPSBhd2FpdCBhcHAuY3J5cHRvLmhhc2gocGFzc3dvcmQpO1xuICAgICAgYXV0aC50ZW1wb3JhcnlBY2Nlc3NIYXNoID0gJyc7XG4gICAgICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0lkID0gJyc7XG4gICAgICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID0gMDtcbiAgICAgIHJldHVybiB7IGF1dGggfTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcignUGFzc3dvcmQgZG9lcyBub3QgbWVldCByZXF1aXJlbWVudHMnKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCB0ZW1wQWNjZXNzID0gYXdhaXQgZ2V0VGVtcG9yYXJ5Q29kZShhcHApO1xuICAgIGF1dGgudGVtcG9yYXJ5QWNjZXNzSGFzaCA9IHRlbXBBY2Nlc3MudGVtcG9yYXJ5QWNjZXNzSGFzaDtcbiAgICBhdXRoLnRlbXBvcmFyeUFjY2Vzc0V4cGlyeUVwb2NoID0gdGVtcEFjY2Vzcy50ZW1wb3JhcnlBY2Nlc3NFeHBpcnlFcG9jaDtcbiAgICBhdXRoLnBhc3N3b3JkSGFzaCA9ICcnO1xuICAgIHJldHVybiAoe1xuICAgICAgYXV0aCxcbiAgICAgIHRlbXBDb2RlOiB0ZW1wQWNjZXNzLnRlbXBDb2RlLFxuICAgICAgdGVtcG9yYXJ5QWNjZXNzSWQ6IHRlbXBBY2Nlc3MudGVtcG9yYXJ5QWNjZXNzSWQsXG4gICAgfSk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBnZXRMb2NrLFxuICBpc05vbG9jaywgcmVsZWFzZUxvY2ssXG59IGZyb20gJy4uL2NvbW1vbi9sb2NrJztcbmltcG9ydCB7IFVTRVJTX0xPQ0tfRklMRSwgVVNFUlNfTElTVF9GSUxFLCBnZXRVc2VyQnlOYW1lIH0gZnJvbSAnLi9hdXRoQ29tbW9uJztcbmltcG9ydCB7IGFwaVdyYXBwZXIsIGV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmV4cG9ydCBjb25zdCBlbmFibGVVc2VyID0gYXBwID0+IGFzeW5jIHVzZXJuYW1lID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuZW5hYmxlVXNlcixcbiAgcGVybWlzc2lvbi5lbmFibGVEaXNhYmxlVXNlci5pc0F1dGhvcml6ZWQsXG4gIHsgdXNlcm5hbWUgfSxcbiAgX2VuYWJsZVVzZXIsIGFwcCwgdXNlcm5hbWUsXG4pO1xuXG5leHBvcnQgY29uc3QgZGlzYWJsZVVzZXIgPSBhcHAgPT4gYXN5bmMgdXNlcm5hbWUgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5kaXNhYmxlVXNlcixcbiAgcGVybWlzc2lvbi5lbmFibGVEaXNhYmxlVXNlci5pc0F1dGhvcml6ZWQsXG4gIHsgdXNlcm5hbWUgfSxcbiAgX2Rpc2FibGVVc2VyLCBhcHAsIHVzZXJuYW1lLFxuKTtcblxuZXhwb3J0IGNvbnN0IF9lbmFibGVVc2VyID0gYXN5bmMgKGFwcCwgdXNlcm5hbWUpID0+IGF3YWl0IHRvZ2dsZVVzZXIoYXBwLCB1c2VybmFtZSwgdHJ1ZSk7XG5cbmV4cG9ydCBjb25zdCBfZGlzYWJsZVVzZXIgPSBhc3luYyAoYXBwLCB1c2VybmFtZSkgPT4gYXdhaXQgdG9nZ2xlVXNlcihhcHAsIHVzZXJuYW1lLCBmYWxzZSk7XG5cbmNvbnN0IHRvZ2dsZVVzZXIgPSBhc3luYyAoYXBwLCB1c2VybmFtZSwgZW5hYmxlZCkgPT4ge1xuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0TG9jayhhcHAsIFVTRVJTX0xPQ0tfRklMRSwgMTAwMCwgMSwgMCk7XG5cbiAgY29uc3QgYWN0aW9uTmFtZSA9IGVuYWJsZWQgPyAnZW5hYmxlJyA6ICdkaXNhYmxlJztcblxuICBpZiAoaXNOb2xvY2sobG9jaykpIHsgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgJHthY3Rpb25OYW1lfSB1c2VyIC0gY2Fubm90IGdldCBsb2NrYCk7IH1cblxuICB0cnkge1xuICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihVU0VSU19MSVNUX0ZJTEUpO1xuICAgIGNvbnN0IHVzZXIgPSBnZXRVc2VyQnlOYW1lKHVzZXJzLCB1c2VybmFtZSk7XG4gICAgaWYgKCF1c2VyKSB7IHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGBDb3VsZCBub3QgZmluZCB1c2VyIHRvICR7YWN0aW9uTmFtZX1gKTsgfVxuXG4gICAgaWYgKHVzZXIuZW5hYmxlZCA9PT0gIWVuYWJsZWQpIHtcbiAgICAgIHVzZXIuZW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLnVwZGF0ZUpzb24oVVNFUlNfTElTVF9GSUxFLCB1c2Vycyk7XG4gICAgfVxuICB9IGZpbmFsbHkge1xuICAgIHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XG4gIH1cbn07XG4iLCJleHBvcnQgY29uc3QgZ2V0TmV3QWNjZXNzTGV2ZWwgPSAoKSA9PiAoKSA9PiAoe1xuICBuYW1lOiAnJyxcbiAgcGVybWlzc2lvbnM6IFtdLFxuICBkZWZhdWx0OmZhbHNlXG59KTtcbiIsImltcG9ydCB7XG4gIHZhbHVlcywgaW5jbHVkZXMsIG1hcCwgY29uY2F0LCBpc0VtcHR5LCB1bmlxV2l0aCwgc29tZSxcbiAgZmxhdHRlbiwgZmlsdGVyLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgYXBwbHlSdWxlU2V0LCBtYWtlcnVsZSB9IGZyb20gJy4uL2NvbW1vbi92YWxpZGF0aW9uQ29tbW9uJztcbmltcG9ydCB7IHBlcm1pc3Npb25UeXBlcyB9IGZyb20gJy4vYXV0aENvbW1vbic7XG5pbXBvcnQge1xuICAkLCBpc1NvbWV0aGluZywgaW5zZW5zaXRpdmVFcXVhbHMsXG4gIGlzTm9uRW1wdHlTdHJpbmcsIGFwaVdyYXBwZXJTeW5jLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXROb2RlIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IGFsd2F5c0F1dGhvcml6ZWQgfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuY29uc3QgaXNBbGxvd2VkVHlwZSA9IHQgPT4gJChwZXJtaXNzaW9uVHlwZXMsIFtcbiAgdmFsdWVzLFxuICBpbmNsdWRlcyh0KSxcbl0pO1xuXG5jb25zdCBpc1JlY29yZE9ySW5kZXhUeXBlID0gdCA9PiBzb21lKHAgPT4gcCA9PT0gdCkoW1xuICBwZXJtaXNzaW9uVHlwZXMuQ1JFQVRFX1JFQ09SRCxcbiAgcGVybWlzc2lvblR5cGVzLlVQREFURV9SRUNPUkQsXG4gIHBlcm1pc3Npb25UeXBlcy5ERUxFVEVfUkVDT1JELFxuICBwZXJtaXNzaW9uVHlwZXMuUkVBRF9SRUNPUkQsXG4gIHBlcm1pc3Npb25UeXBlcy5SRUFEX0lOREVYLFxuICBwZXJtaXNzaW9uVHlwZXMuRVhFQ1VURV9BQ1RJT04sXG5dKTtcblxuXG5jb25zdCBwZXJtaXNzaW9uUnVsZXMgPSBhcHAgPT4gKFtcbiAgbWFrZXJ1bGUoJ3R5cGUnLCAndHlwZSBtdXN0IGJlIG9uZSBvZiBhbGxvd2VkIHR5cGVzJyxcbiAgICBwID0+IGlzQWxsb3dlZFR5cGUocC50eXBlKSksXG4gIG1ha2VydWxlKCdub2RlS2V5JywgJ3JlY29yZCBhbmQgaW5kZXggcGVybWlzc2lvbnMgbXVzdCBpbmNsdWRlIGEgdmFsaWQgbm9kZUtleScsXG4gICAgcCA9PiAoIWlzUmVjb3JkT3JJbmRleFR5cGUocC50eXBlKSlcbiAgICAgICAgICAgICB8fCBpc1NvbWV0aGluZyhnZXROb2RlKGFwcC5oaWVyYXJjaHksIHAubm9kZUtleSkpKSxcbl0pO1xuXG5jb25zdCBhcHBseVBlcm1pc3Npb25SdWxlcyA9IGFwcCA9PiBhcHBseVJ1bGVTZXQocGVybWlzc2lvblJ1bGVzKGFwcCkpO1xuXG5jb25zdCBhY2Nlc3NMZXZlbFJ1bGVzID0gYWxsTGV2ZWxzID0+IChbXG4gIG1ha2VydWxlKCduYW1lJywgJ25hbWUgbXVzdCBiZSBzZXQnLFxuICAgIGwgPT4gaXNOb25FbXB0eVN0cmluZyhsLm5hbWUpKSxcbiAgbWFrZXJ1bGUoJ25hbWUnLCAnYWNjZXNzIGxldmVsIG5hbWVzIG11c3QgYmUgdW5pcXVlJyxcbiAgICBsID0+IGlzRW1wdHkobC5uYW1lKVxuICAgICAgICAgICAgIHx8IGZpbHRlcihhID0+IGluc2Vuc2l0aXZlRXF1YWxzKGwubmFtZSwgYS5uYW1lKSkoYWxsTGV2ZWxzKS5sZW5ndGggPT09IDEpLFxuXSk7XG5cbmNvbnN0IGFwcGx5TGV2ZWxSdWxlcyA9IGFsbExldmVscyA9PiBhcHBseVJ1bGVTZXQoYWNjZXNzTGV2ZWxSdWxlcyhhbGxMZXZlbHMpKTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQWNjZXNzTGV2ZWwgPSBhcHAgPT4gKGFsbExldmVscywgbGV2ZWwpID0+IHtcbiAgY29uc3QgZXJycyA9ICQobGV2ZWwucGVybWlzc2lvbnMsIFtcbiAgICBtYXAoYXBwbHlQZXJtaXNzaW9uUnVsZXMoYXBwKSksXG4gICAgZmxhdHRlbixcbiAgICBjb25jYXQoXG4gICAgICBhcHBseUxldmVsUnVsZXMoYWxsTGV2ZWxzKShsZXZlbCksXG4gICAgKSxcbiAgXSk7XG5cbiAgcmV0dXJuIGVycnM7XG59O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBY2Nlc3NMZXZlbHMgPSBhcHAgPT4gYWxsTGV2ZWxzID0+IGFwaVdyYXBwZXJTeW5jKFxuICBhcHAsXG4gIGV2ZW50cy5hdXRoQXBpLnZhbGlkYXRlQWNjZXNzTGV2ZWxzLFxuICBhbHdheXNBdXRob3JpemVkLFxuICB7IGFsbExldmVscyB9LFxuICBfdmFsaWRhdGVBY2Nlc3NMZXZlbHMsIGFwcCwgYWxsTGV2ZWxzLFxuKTtcblxuZXhwb3J0IGNvbnN0IF92YWxpZGF0ZUFjY2Vzc0xldmVscyA9IChhcHAsIGFsbExldmVscykgPT4gJChhbGxMZXZlbHMsIFtcbiAgbWFwKGwgPT4gdmFsaWRhdGVBY2Nlc3NMZXZlbChhcHApKGFsbExldmVscywgbCkpLFxuICBmbGF0dGVuLFxuICB1bmlxV2l0aCgoeCwgeSkgPT4geC5maWVsZCA9PT0geS5maWVsZFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgeC5pdGVtID09PSB5Lml0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHguZXJyb3IgPT09IHkuZXJyb3IpLFxuXSk7XG4iLCJpbXBvcnQgeyBqb2luLCBtYXAgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgZ2V0TG9jaywgcmVsZWFzZUxvY2ssICQsXG4gIGlzTm9sb2NrLCBhcGlXcmFwcGVyLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBBQ0NFU1NfTEVWRUxTX0xPQ0tfRklMRSxcbiAgQUNDRVNTX0xFVkVMU19GSUxFLFxufSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgdmFsaWRhdGVBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL3ZhbGlkYXRlQWNjZXNzTGV2ZWxzJztcbmltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuL3Blcm1pc3Npb25zJztcblxuZXhwb3J0IGNvbnN0IHNhdmVBY2Nlc3NMZXZlbHMgPSBhcHAgPT4gYXN5bmMgYWNjZXNzTGV2ZWxzID0+IGFwaVdyYXBwZXIoXG4gIGFwcCxcbiAgZXZlbnRzLmF1dGhBcGkuc2F2ZUFjY2Vzc0xldmVscyxcbiAgcGVybWlzc2lvbi53cml0ZUFjY2Vzc0xldmVscy5pc0F1dGhvcml6ZWQsXG4gIHsgYWNjZXNzTGV2ZWxzIH0sXG4gIF9zYXZlQWNjZXNzTGV2ZWxzLCBhcHAsIGFjY2Vzc0xldmVscyxcbik7XG5cbmV4cG9ydCBjb25zdCBfc2F2ZUFjY2Vzc0xldmVscyA9IGFzeW5jIChhcHAsIGFjY2Vzc0xldmVscykgPT4ge1xuICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGVBY2Nlc3NMZXZlbHMoYXBwKShhY2Nlc3NMZXZlbHMubGV2ZWxzKTtcbiAgaWYgKHZhbGlkYXRpb25FcnJvcnMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGVycnMgPSAkKHZhbGlkYXRpb25FcnJvcnMsIFtcbiAgICAgIG1hcChlID0+IGUuZXJyb3IpLFxuICAgICAgam9pbignLCAnKSxcbiAgICBdKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgQWNjZXNzIExldmVscyBJbnZhbGlkOiAke2VycnN9YCxcbiAgICApO1xuICB9XG5cbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldExvY2soXG4gICAgYXBwLCBBQ0NFU1NfTEVWRUxTX0xPQ0tfRklMRSwgMjAwMCwgMixcbiAgKTtcblxuICBpZiAoaXNOb2xvY2sobG9jaykpIHsgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZ2V0IGxvY2sgdG8gc2F2ZSBhY2Nlc3MgbGV2ZWxzJyk7IH1cblxuICB0cnkge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihBQ0NFU1NfTEVWRUxTX0ZJTEUpO1xuICAgIGlmIChleGlzdGluZy52ZXJzaW9uICE9PSBhY2Nlc3NMZXZlbHMudmVyc2lvbikgeyB0aHJvdyBuZXcgRXJyb3IoJ0FjY2VzcyBsZXZlbHMgaGF2ZSBhbHJlYWR5IGJlZW4gdXBkYXRlZCwgc2luY2UgeW91IGxvYWRlZCcpOyB9XG5cbiAgICBhY2Nlc3NMZXZlbHMudmVyc2lvbisrO1xuXG4gICAgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKEFDQ0VTU19MRVZFTFNfRklMRSwgYWNjZXNzTGV2ZWxzKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgZmlsdGVyLCB2YWx1ZXMsIGVhY2gsIGtleXMsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBwZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XG5pbXBvcnQge1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksXG4gIGlzSW5kZXgsIGlzUmVjb3JkLFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgJCB9IGZyb20gJy4uL2NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucyA9IChhcHApID0+IHtcbiAgY29uc3QgYWxsTm9kZXMgPSBnZXRGbGF0dGVuZWRIaWVyYXJjaHkoYXBwLmhpZXJhcmNoeSk7XG4gIGNvbnN0IGFjY2Vzc0xldmVsID0geyBwZXJtaXNzaW9uczogW10gfTtcblxuICBjb25zdCByZWNvcmROb2RlcyA9ICQoYWxsTm9kZXMsIFtcbiAgICBmaWx0ZXIoaXNSZWNvcmQpLFxuICBdKTtcblxuICBmb3IgKGNvbnN0IG4gb2YgcmVjb3JkTm9kZXMpIHtcbiAgICBwZXJtaXNzaW9uLmNyZWF0ZVJlY29yZC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcbiAgICBwZXJtaXNzaW9uLnVwZGF0ZVJlY29yZC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcbiAgICBwZXJtaXNzaW9uLmRlbGV0ZVJlY29yZC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcbiAgICBwZXJtaXNzaW9uLnJlYWRSZWNvcmQuYWRkKG4ubm9kZUtleSgpLCBhY2Nlc3NMZXZlbCk7XG4gIH1cblxuICBjb25zdCBpbmRleE5vZGVzID0gJChhbGxOb2RlcywgW1xuICAgIGZpbHRlcihpc0luZGV4KSxcbiAgXSk7XG5cbiAgZm9yIChjb25zdCBuIG9mIGluZGV4Tm9kZXMpIHtcbiAgICBwZXJtaXNzaW9uLnJlYWRJbmRleC5hZGQobi5ub2RlS2V5KCksIGFjY2Vzc0xldmVsKTtcbiAgfVxuXG4gIGZvciAoY29uc3QgYSBvZiBrZXlzKGFwcC5hY3Rpb25zKSkge1xuICAgIHBlcm1pc3Npb24uZXhlY3V0ZUFjdGlvbi5hZGQoYSwgYWNjZXNzTGV2ZWwpO1xuICB9XG5cbiAgJChwZXJtaXNzaW9uLCBbXG4gICAgdmFsdWVzLFxuICAgIGZpbHRlcihwID0+ICFwLmlzTm9kZSksXG4gICAgZWFjaChwID0+IHAuYWRkKGFjY2Vzc0xldmVsKSksXG4gIF0pO1xuXG4gIHJldHVybiBhY2Nlc3NMZXZlbC5wZXJtaXNzaW9ucztcbn07XG4iLCJpbXBvcnQgeyBkaWZmZXJlbmNlLCBtYXAsIGpvaW4gfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgZ2V0TG9jaywgaXNOb2xvY2ssIHJlbGVhc2VMb2NrLCAkLFxuICBhcGlXcmFwcGVyLCBldmVudHMsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBVU0VSU19MT0NLX0ZJTEUsIEFDQ0VTU19MRVZFTFNfRklMRSxcbiAgZ2V0VXNlckJ5TmFtZSwgVVNFUlNfTElTVF9GSUxFLFxufSBmcm9tICcuL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgcGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgTm90Rm91bmRFcnJvciB9IGZyb20gJy4uL2NvbW1vbi9lcnJvcnMnO1xuXG5leHBvcnQgY29uc3Qgc2V0VXNlckFjY2Vzc0xldmVscyA9IGFwcCA9PiBhc3luYyAodXNlck5hbWUsIGFjY2Vzc0xldmVscykgPT4gYXBpV3JhcHBlcihcbiAgYXBwLFxuICBldmVudHMuYXV0aEFwaS5zZXRVc2VyQWNjZXNzTGV2ZWxzLFxuICBwZXJtaXNzaW9uLnNldFVzZXJBY2Nlc3NMZXZlbHMuaXNBdXRob3JpemVkLFxuICB7IHVzZXJOYW1lLCBhY2Nlc3NMZXZlbHMgfSxcbiAgX3NldFVzZXJBY2Nlc3NMZXZlbHMsIGFwcCwgdXNlck5hbWUsIGFjY2Vzc0xldmVscyxcbik7XG5cbmV4cG9ydCBjb25zdCBfc2V0VXNlckFjY2Vzc0xldmVscyA9IGFzeW5jIChhcHAsIHVzZXJuYW1lLCBhY2Nlc3NMZXZlbHMpID0+IHtcbiAgY29uc3QgbG9jayA9IGF3YWl0IGdldExvY2soYXBwLCBVU0VSU19MT0NLX0ZJTEUsIDEwMDAsIDEsIDApO1xuXG4gIGNvbnN0IGFjdHVhbEFjY2Vzc0xldmVscyA9ICQoXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihBQ0NFU1NfTEVWRUxTX0ZJTEUpLFxuICAgIFtcbiAgICAgIGwgPT4gbC5sZXZlbHMsXG4gICAgICBtYXAobCA9PiBsLm5hbWUpLFxuICAgIF0sXG4gICk7XG5cbiAgY29uc3QgbWlzc2luZyA9IGRpZmZlcmVuY2UoYWNjZXNzTGV2ZWxzKShhY3R1YWxBY2Nlc3NMZXZlbHMpO1xuICBpZiAobWlzc2luZy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFjY2VzcyBsZXZlbHMgc3VwcGxpZWQ6ICR7am9pbignLCAnLCBtaXNzaW5nKX1gKTtcbiAgfVxuXG4gIGlmIChpc05vbG9jayhsb2NrKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIHNldCB1c2VyIGFjY2VzcyBsZXZlbHMgY2Fubm90IGdldCBsb2NrJyk7IH1cblxuICB0cnkge1xuICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihVU0VSU19MSVNUX0ZJTEUpO1xuICAgIGNvbnN0IHVzZXIgPSBnZXRVc2VyQnlOYW1lKHVzZXJzLCB1c2VybmFtZSk7XG4gICAgaWYgKCF1c2VyKSB7IHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGBDb3VsZCBub3QgZmluZCB1c2VyIHdpdGggJHt1c2VybmFtZX1gKTsgfVxuXG4gICAgdXNlci5hY2Nlc3NMZXZlbHMgPSBhY2Nlc3NMZXZlbHM7XG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS51cGRhdGVKc29uKFVTRVJTX0xJU1RfRklMRSwgdXNlcnMpO1xuICB9IGZpbmFsbHkge1xuICAgIHJlbGVhc2VMb2NrKGFwcCwgbG9jayk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBhdXRoZW50aWNhdGUsXG4gIGF1dGhlbnRpY2F0ZVRlbXBvcmFyeUFjY2Vzcyxcbn0gZnJvbSAnLi9hdXRoZW50aWNhdGUnO1xuaW1wb3J0IHsgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzIH0gZnJvbSAnLi9jcmVhdGVUZW1wb3JhcnlBY2Nlc3MnO1xuaW1wb3J0IHsgY3JlYXRlVXNlciB9IGZyb20gJy4vY3JlYXRlVXNlcic7XG5pbXBvcnQgeyBlbmFibGVVc2VyLCBkaXNhYmxlVXNlciB9IGZyb20gJy4vZW5hYmxlVXNlcic7XG5pbXBvcnQgeyBsb2FkQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi9sb2FkQWNjZXNzTGV2ZWxzJztcbmltcG9ydCB7IGdldE5ld0FjY2Vzc0xldmVsIH0gZnJvbSAnLi9nZXROZXdBY2Nlc3NMZXZlbCc7XG5pbXBvcnQgeyBnZXROZXdVc2VyLCBnZXROZXdVc2VyQXV0aCB9IGZyb20gJy4vZ2V0TmV3VXNlcic7XG5pbXBvcnQgeyBnZXRVc2VycyB9IGZyb20gJy4vZ2V0VXNlcnMnO1xuaW1wb3J0IHsgaXNBdXRob3JpemVkIH0gZnJvbSAnLi9pc0F1dGhvcml6ZWQnO1xuaW1wb3J0IHsgc2F2ZUFjY2Vzc0xldmVscyB9IGZyb20gJy4vc2F2ZUFjY2Vzc0xldmVscyc7XG5pbXBvcnQge1xuICBjaGFuZ2VNeVBhc3N3b3JkLFxuICBzY29yZVBhc3N3b3JkLCBzZXRQYXNzd29yZEZyb21UZW1wb3JhcnlDb2RlLFxuICBpc1ZhbGlkUGFzc3dvcmQsXG59IGZyb20gJy4vc2V0UGFzc3dvcmQnO1xuaW1wb3J0IHsgdmFsaWRhdGVVc2VyIH0gZnJvbSAnLi92YWxpZGF0ZVVzZXInO1xuaW1wb3J0IHsgdmFsaWRhdGVBY2Nlc3NMZXZlbHMgfSBmcm9tICcuL3ZhbGlkYXRlQWNjZXNzTGV2ZWxzJztcbmltcG9ydCB7IGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zIH0gZnJvbSAnLi9nZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBzZXRVc2VyQWNjZXNzTGV2ZWxzIH0gZnJvbSAnLi9zZXRVc2VyQWNjZXNzTGV2ZWxzJztcblxuZXhwb3J0IGNvbnN0IGdldEF1dGhBcGkgPSBhcHAgPT4gKHtcbiAgYXV0aGVudGljYXRlOiBhdXRoZW50aWNhdGUoYXBwKSxcbiAgYXV0aGVudGljYXRlVGVtcG9yYXJ5QWNjZXNzOiBhdXRoZW50aWNhdGVUZW1wb3JhcnlBY2Nlc3MoYXBwKSxcbiAgY3JlYXRlVGVtcG9yYXJ5QWNjZXNzOiBjcmVhdGVUZW1wb3JhcnlBY2Nlc3MoYXBwKSxcbiAgY3JlYXRlVXNlcjogY3JlYXRlVXNlcihhcHApLFxuICBsb2FkQWNjZXNzTGV2ZWxzOiBsb2FkQWNjZXNzTGV2ZWxzKGFwcCksXG4gIGVuYWJsZVVzZXI6IGVuYWJsZVVzZXIoYXBwKSxcbiAgZGlzYWJsZVVzZXI6IGRpc2FibGVVc2VyKGFwcCksXG4gIGdldE5ld0FjY2Vzc0xldmVsOiBnZXROZXdBY2Nlc3NMZXZlbChhcHApLFxuICBnZXROZXdVc2VyOiBnZXROZXdVc2VyKGFwcCksXG4gIGdldE5ld1VzZXJBdXRoOiBnZXROZXdVc2VyQXV0aChhcHApLFxuICBnZXRVc2VyczogZ2V0VXNlcnMoYXBwKSxcbiAgc2F2ZUFjY2Vzc0xldmVsczogc2F2ZUFjY2Vzc0xldmVscyhhcHApLFxuICBpc0F1dGhvcml6ZWQ6IGlzQXV0aG9yaXplZChhcHApLFxuICBjaGFuZ2VNeVBhc3N3b3JkOiBjaGFuZ2VNeVBhc3N3b3JkKGFwcCksXG4gIHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGU6IHNldFBhc3N3b3JkRnJvbVRlbXBvcmFyeUNvZGUoYXBwKSxcbiAgc2NvcmVQYXNzd29yZCxcbiAgaXNWYWxpZFBhc3N3b3JkOiBpc1ZhbGlkUGFzc3dvcmQoYXBwKSxcbiAgdmFsaWRhdGVVc2VyOiB2YWxpZGF0ZVVzZXIoYXBwKSxcbiAgdmFsaWRhdGVBY2Nlc3NMZXZlbHM6IHZhbGlkYXRlQWNjZXNzTGV2ZWxzKGFwcCksXG4gIGdlbmVyYXRlRnVsbFBlcm1pc3Npb25zOiAoKSA9PiBnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9ucyhhcHApLFxuICBzZXRVc2VyQWNjZXNzTGV2ZWxzOiBzZXRVc2VyQWNjZXNzTGV2ZWxzKGFwcCksXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0QXV0aEFwaTtcbiIsImltcG9ydCB7IHBlcm1pc3Npb24gfSBmcm9tICcuLi9hdXRoQXBpL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IGFwaVdyYXBwZXJTeW5jIH0gZnJvbSAnLi4vY29tbW9uL2FwaVdyYXBwZXInO1xuaW1wb3J0IHsgZXZlbnRzIH0gZnJvbSAnLi4vY29tbW9uL2V2ZW50cyc7XG5cbmV4cG9ydCBjb25zdCBleGVjdXRlQWN0aW9uID0gYXBwID0+IChhY3Rpb25OYW1lLCBvcHRpb25zKSA9PiB7XG4gIGFwaVdyYXBwZXJTeW5jKFxuICAgIGFwcCxcbiAgICBldmVudHMuYWN0aW9uc0FwaS5leGVjdXRlLFxuICAgIHBlcm1pc3Npb24uZXhlY3V0ZUFjdGlvbi5pc0F1dGhvcml6ZWQoYWN0aW9uTmFtZSksXG4gICAgeyBhY3Rpb25OYW1lLCBvcHRpb25zIH0sXG4gICAgYXBwLmFjdGlvbnNbYWN0aW9uTmFtZV0sIG9wdGlvbnMsXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgX2V4ZWN1dGVBY3Rpb24gPSAoYmVoYXZpb3VyU291cmNlcywgYWN0aW9uLCBvcHRpb25zKSA9PiBiZWhhdmlvdXJTb3VyY2VzW2FjdGlvbi5iZWhhdmlvdXJTb3VyY2VdW2FjdGlvbi5iZWhhdmlvdXJOYW1lXShvcHRpb25zKTtcbiIsImltcG9ydCB7IGV4ZWN1dGVBY3Rpb24gfSBmcm9tICcuL2V4ZWN1dGUnO1xuXG5leHBvcnQgY29uc3QgZ2V0QWN0aW9uc0FwaSA9IGFwcCA9PiAoe1xuICBleGVjdXRlOiBleGVjdXRlQWN0aW9uKGFwcCksXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0QWN0aW9uc0FwaTtcbiIsImltcG9ydCB7IGhhcyB9IGZyb20gJ2xvZGFzaC9mcCc7XG5cbmNvbnN0IHB1Ymxpc2ggPSBoYW5kbGVycyA9PiBhc3luYyAoZXZlbnROYW1lLCBjb250ZXh0ID0ge30pID0+IHtcbiAgaWYgKCFoYXMoZXZlbnROYW1lKShoYW5kbGVycykpIHJldHVybjtcblxuICBmb3IgKGNvbnN0IGhhbmRsZXIgb2YgaGFuZGxlcnNbZXZlbnROYW1lXSkge1xuICAgIGF3YWl0IGhhbmRsZXIoZXZlbnROYW1lLCBjb250ZXh0KTtcbiAgfVxufTtcblxuY29uc3Qgc3Vic2NyaWJlID0gaGFuZGxlcnMgPT4gKGV2ZW50TmFtZSwgaGFuZGxlcikgPT4ge1xuICBpZiAoIWhhcyhldmVudE5hbWUpKGhhbmRsZXJzKSkge1xuICAgIGhhbmRsZXJzW2V2ZW50TmFtZV0gPSBbXTtcbiAgfVxuICBoYW5kbGVyc1tldmVudE5hbWVdLnB1c2goaGFuZGxlcik7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlRXZlbnRBZ2dyZWdhdG9yID0gKCkgPT4ge1xuICBjb25zdCBoYW5kbGVycyA9IHt9O1xuICBjb25zdCBldmVudEFnZ3JlZ2F0b3IgPSAoe1xuICAgIHB1Ymxpc2g6IHB1Ymxpc2goaGFuZGxlcnMpLFxuICAgIHN1YnNjcmliZTogc3Vic2NyaWJlKGhhbmRsZXJzKSxcbiAgfSk7XG4gIHJldHVybiBldmVudEFnZ3JlZ2F0b3I7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVFdmVudEFnZ3JlZ2F0b3I7XG4iLCJpbXBvcnQgeyByZXRyeSB9IGZyb20gJy4uL2NvbW1vbi9pbmRleCc7XG5pbXBvcnQgeyBOb3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vY29tbW9uL2Vycm9ycyc7XG5cbmNvbnN0IGNyZWF0ZUpzb24gPSBvcmlnaW5hbENyZWF0ZUZpbGUgPT4gYXN5bmMgKGtleSwgb2JqLCByZXRyaWVzID0gMiwgZGVsYXkgPSAxMDApID0+IGF3YWl0IHJldHJ5KG9yaWdpbmFsQ3JlYXRlRmlsZSwgcmV0cmllcywgZGVsYXksIGtleSwgSlNPTi5zdHJpbmdpZnkob2JqKSk7XG5cbmNvbnN0IGNyZWF0ZU5ld0ZpbGUgPSBvcmlnaW5hbENyZWF0ZUZpbGUgPT4gYXN5bmMgKHBhdGgsIGNvbnRlbnQsIHJldHJpZXMgPSAyLCBkZWxheSA9IDEwMCkgPT4gYXdhaXQgcmV0cnkob3JpZ2luYWxDcmVhdGVGaWxlLCByZXRyaWVzLCBkZWxheSwgcGF0aCwgY29udGVudCk7XG5cbmNvbnN0IGxvYWRKc29uID0gZGF0YXN0b3JlID0+IGFzeW5jIChrZXksIHJldHJpZXMgPSAzLCBkZWxheSA9IDEwMCkgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCByZXRyeShKU09OLnBhcnNlLCByZXRyaWVzLCBkZWxheSwgYXdhaXQgZGF0YXN0b3JlLmxvYWRGaWxlKGtleSkpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zdCBuZXdFcnIgPSBuZXcgTm90Rm91bmRFcnJvcihlcnIubWVzc2FnZSk7XG4gICAgbmV3RXJyLnN0YWNrID0gZXJyLnN0YWNrO1xuICAgIHRocm93KG5ld0Vycik7XG4gIH1cbn1cblxuY29uc3QgdXBkYXRlSnNvbiA9IGRhdGFzdG9yZSA9PiBhc3luYyAoa2V5LCBvYmosIHJldHJpZXMgPSAzLCBkZWxheSA9IDEwMCkgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCByZXRyeShkYXRhc3RvcmUudXBkYXRlRmlsZSwgcmV0cmllcywgZGVsYXksIGtleSwgSlNPTi5zdHJpbmdpZnkob2JqKSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnN0IG5ld0VyciA9IG5ldyBOb3RGb3VuZEVycm9yKGVyci5tZXNzYWdlKTtcbiAgICBuZXdFcnIuc3RhY2sgPSBlcnIuc3RhY2s7XG4gICAgdGhyb3cobmV3RXJyKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgc2V0dXBEYXRhc3RvcmUgPSAoZGF0YXN0b3JlKSA9PiB7XG4gIGNvbnN0IG9yaWdpbmFsQ3JlYXRlRmlsZSA9IGRhdGFzdG9yZS5jcmVhdGVGaWxlO1xuICBkYXRhc3RvcmUubG9hZEpzb24gPSBsb2FkSnNvbihkYXRhc3RvcmUpO1xuICBkYXRhc3RvcmUuY3JlYXRlSnNvbiA9IGNyZWF0ZUpzb24ob3JpZ2luYWxDcmVhdGVGaWxlKTtcbiAgZGF0YXN0b3JlLnVwZGF0ZUpzb24gPSB1cGRhdGVKc29uKGRhdGFzdG9yZSk7XG4gIGRhdGFzdG9yZS5jcmVhdGVGaWxlID0gY3JlYXRlTmV3RmlsZShvcmlnaW5hbENyZWF0ZUZpbGUpO1xuICBpZiAoZGF0YXN0b3JlLmNyZWF0ZUVtcHR5RGIpIHsgZGVsZXRlIGRhdGFzdG9yZS5jcmVhdGVFbXB0eURiOyB9XG4gIHJldHVybiBkYXRhc3RvcmU7XG59O1xuXG5leHBvcnQgeyBjcmVhdGVFdmVudEFnZ3JlZ2F0b3IgfSBmcm9tICcuL2V2ZW50QWdncmVnYXRvcic7XG5cbmV4cG9ydCBkZWZhdWx0IHNldHVwRGF0YXN0b3JlO1xuIiwiaW1wb3J0IHsgXG4gIGNvbXBpbGVFeHByZXNzaW9uIGFzIGNFeHAsIFxuICBjb21waWxlQ29kZSBhcyBjQ29kZSBcbn0gZnJvbSAnQG54LWpzL2NvbXBpbGVyLXV0aWwnO1xuXG5leHBvcnQgY29uc3QgY29tcGlsZUNvZGUgPSBjb2RlID0+IHtcbiAgbGV0IGZ1bmM7ICBcbiAgICBcbiAgdHJ5IHtcbiAgICBmdW5jID0gY0NvZGUoY29kZSk7XG4gIH0gY2F0Y2goZSkge1xuICAgIGUubWVzc2FnZSA9IGBFcnJvciBjb21waWxpbmcgY29kZSA6ICR7Y29kZX0gOiAke2UubWVzc2FnZX1gO1xuICAgIHRocm93IGU7XG4gIH1cblxuICByZXR1cm4gZnVuYztcbn1cblxuZXhwb3J0IGNvbnN0IGNvbXBpbGVFeHByZXNzaW9uID0gY29kZSA9PiB7XG4gIGxldCBmdW5jOyAgXG4gICAgICBcbiAgdHJ5IHtcbiAgICBmdW5jID0gY0V4cChjb2RlKTtcbiAgfSBjYXRjaChlKSB7XG4gICAgZS5tZXNzYWdlID0gYEVycm9yIGNvbXBpbGluZyBleHByZXNzaW9uIDogJHtjb2RlfSA6ICR7ZS5tZXNzYWdlfWA7XG4gICAgdGhyb3cgZTtcbiAgfVxuICBcbiAgcmV0dXJuIGZ1bmM7XG59XG4iLCJpbXBvcnQge1xuICBpc0Z1bmN0aW9uLCBmaWx0ZXIsIG1hcCxcbiAgdW5pcUJ5LCBrZXlzLCBkaWZmZXJlbmNlLFxuICBqb2luLCByZWR1Y2UsIGZpbmQsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyBjb21waWxlRXhwcmVzc2lvbiwgY29tcGlsZUNvZGUgfSBmcm9tICcuLi9jb21tb24vY29tcGlsZUNvZGUnO1xuaW1wb3J0IHsgJCB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBfZXhlY3V0ZUFjdGlvbiB9IGZyb20gJy4vZXhlY3V0ZSc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0RXJyb3IsIE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi9jb21tb24vZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxpc2VBY3Rpb25zID0gKHN1YnNjcmliZSwgYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucywgdHJpZ2dlcnMsIGFwaXMpID0+IHtcbiAgdmFsaWRhdGVTb3VyY2VzKGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMpO1xuICBzdWJzY3JpYmVUcmlnZ2VycyhzdWJzY3JpYmUsIGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMsIHRyaWdnZXJzLCBhcGlzKTtcbiAgcmV0dXJuIGNyZWF0ZUFjdGlvbnNDb2xsZWN0aW9uKGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMpO1xufTtcblxuY29uc3QgY3JlYXRlQWN0aW9uc0NvbGxlY3Rpb24gPSAoYmVoYXZpb3VyU291cmNlcywgYWN0aW9ucykgPT4gJChhY3Rpb25zLCBbXG4gIHJlZHVjZSgoYWxsLCBhKSA9PiB7XG4gICAgYWxsW2EubmFtZV0gPSBvcHRzID0+IF9leGVjdXRlQWN0aW9uKGJlaGF2aW91clNvdXJjZXMsIGEsIG9wdHMpO1xuICAgIHJldHVybiBhbGw7XG4gIH0sIHt9KSxcbl0pO1xuXG5jb25zdCBzdWJzY3JpYmVUcmlnZ2VycyA9IChzdWJzY3JpYmUsIGJlaGF2aW91clNvdXJjZXMsIGFjdGlvbnMsIHRyaWdnZXJzLCBhcGlzKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZU9wdGlvbnMgPSAob3B0aW9uc0NyZWF0b3IsIGV2ZW50Q29udGV4dCkgPT4ge1xuICAgIGlmICghb3B0aW9uc0NyZWF0b3IpIHJldHVybiB7fTtcbiAgICBjb25zdCBjcmVhdGUgPSBjb21waWxlQ29kZShvcHRpb25zQ3JlYXRvcik7XG4gICAgcmV0dXJuIGNyZWF0ZSh7IGNvbnRleHQ6IGV2ZW50Q29udGV4dCwgYXBpcyB9KTtcbiAgfTtcblxuICBjb25zdCBzaG91bGRSdW5UcmlnZ2VyID0gKHRyaWdnZXIsIGV2ZW50Q29udGV4dCkgPT4ge1xuICAgIGlmICghdHJpZ2dlci5jb25kaXRpb24pIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHNob3VsZFJ1biA9IGNvbXBpbGVFeHByZXNzaW9uKHRyaWdnZXIuY29uZGl0aW9uKTtcbiAgICByZXR1cm4gc2hvdWxkUnVuKHsgY29udGV4dDogZXZlbnRDb250ZXh0IH0pO1xuICB9O1xuXG4gIGZvciAobGV0IHRyaWcgb2YgdHJpZ2dlcnMpIHtcbiAgICBzdWJzY3JpYmUodHJpZy5ldmVudE5hbWUsIGFzeW5jIChldiwgY3R4KSA9PiB7XG4gICAgICBpZiAoc2hvdWxkUnVuVHJpZ2dlcih0cmlnLCBjdHgpKSB7XG4gICAgICAgIGF3YWl0IF9leGVjdXRlQWN0aW9uKFxuICAgICAgICAgIGJlaGF2aW91clNvdXJjZXMsXG4gICAgICAgICAgZmluZChhID0+IGEubmFtZSA9PT0gdHJpZy5hY3Rpb25OYW1lKShhY3Rpb25zKSxcbiAgICAgICAgICBjcmVhdGVPcHRpb25zKHRyaWcub3B0aW9uc0NyZWF0b3IsIGN0eCksXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07XG5cbmNvbnN0IHZhbGlkYXRlU291cmNlcyA9IChiZWhhdmlvdXJTb3VyY2VzLCBhY3Rpb25zKSA9PiB7XG4gIGNvbnN0IGRlY2xhcmVkU291cmNlcyA9ICQoYWN0aW9ucywgW1xuICAgIHVuaXFCeShhID0+IGEuYmVoYXZpb3VyU291cmNlKSxcbiAgICBtYXAoYSA9PiBhLmJlaGF2aW91clNvdXJjZSksXG4gIF0pO1xuXG4gIGNvbnN0IHN1cHBsaWVkU291cmNlcyA9IGtleXMoYmVoYXZpb3VyU291cmNlcyk7XG5cbiAgY29uc3QgbWlzc2luZ1NvdXJjZXMgPSBkaWZmZXJlbmNlKFxuICAgIGRlY2xhcmVkU291cmNlcywgc3VwcGxpZWRTb3VyY2VzLFxuICApO1xuXG4gIGlmIChtaXNzaW5nU291cmNlcy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RFcnJvcihgRGVjbGFyZWQgYmVoYXZpb3VyIHNvdXJjZXMgYXJlIG5vdCBzdXBwbGllZDogJHtqb2luKCcsICcsIG1pc3NpbmdTb3VyY2VzKX1gKTtcbiAgfVxuXG4gIGNvbnN0IG1pc3NpbmdCZWhhdmlvdXJzID0gJChhY3Rpb25zLCBbXG4gICAgZmlsdGVyKGEgPT4gIWlzRnVuY3Rpb24oYmVoYXZpb3VyU291cmNlc1thLmJlaGF2aW91clNvdXJjZV1bYS5iZWhhdmlvdXJOYW1lXSkpLFxuICAgIG1hcChhID0+IGBBY3Rpb246ICR7YS5uYW1lfSA6ICR7YS5iZWhhdmlvdXJTb3VyY2V9LiR7YS5iZWhhdmlvdXJOYW1lfWApLFxuICBdKTtcblxuICBpZiAobWlzc2luZ0JlaGF2aW91cnMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBOb3RGb3VuZEVycm9yKGBNaXNzaW5nIGJlaGF2aW91cnM6IGNvdWxkIG5vdCBmaW5kIGJlaGF2aW91ciBmdW5jdGlvbnM6ICR7am9pbignLCAnLCBtaXNzaW5nQmVoYXZpb3Vycyl9YCk7XG4gIH1cbn07XG4iLCJpbXBvcnQge1xuICBtYXAsIGZpbHRlciwgZ3JvdXBCeSwgc3BsaXQsXG4gIHNvbWUsIGZpbmQsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQge1xuICBMT0NLX0ZJTEVOQU1FLCBUUkFOU0FDVElPTlNfRk9MREVSLCBpZFNlcCwgaXNVcGRhdGUsXG4gIG5vZGVLZXlIYXNoRnJvbUJ1aWxkRm9sZGVyLCBpc0J1aWxkSW5kZXhGb2xkZXIsIGdldFRyYW5zYWN0aW9uSWQsXG4gIGlzRGVsZXRlLCBpc0NyZWF0ZSxcbn0gZnJvbSAnLi90cmFuc2FjdGlvbnNDb21tb24nO1xuaW1wb3J0IHtcbiAgam9pbktleSwgJCwgbm9uZSwgaXNTb21ldGhpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBnZXRMYXN0UGFydEluS2V5LCBnZXROb2RlRnJvbU5vZGVLZXlIYXNoIH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7IF9sb2FkIH0gZnJvbSAnLi4vcmVjb3JkQXBpL2xvYWQnO1xuXG5leHBvcnQgY29uc3QgcmV0cmlldmUgPSBhc3luYyAoYXBwKSA9PiB7XG4gIGNvbnN0IHRyYW5zYWN0aW9uRmlsZXMgPSBhd2FpdCBhcHAuZGF0YXN0b3JlLmdldEZvbGRlckNvbnRlbnRzKFxuICAgIFRSQU5TQUNUSU9OU19GT0xERVIsXG4gICk7XG5cbiAgbGV0IHRyYW5zYWN0aW9ucyA9IFtdO1xuXG4gIGlmIChzb21lKGlzQnVpbGRJbmRleEZvbGRlcikodHJhbnNhY3Rpb25GaWxlcykpIHtcbiAgICBjb25zdCBidWlsZEluZGV4Rm9sZGVyID0gZmluZChpc0J1aWxkSW5kZXhGb2xkZXIpKHRyYW5zYWN0aW9uRmlsZXMpO1xuXG4gICAgdHJhbnNhY3Rpb25zID0gYXdhaXQgcmV0cmlldmVCdWlsZEluZGV4VHJhbnNhY3Rpb25zKFxuICAgICAgYXBwLFxuICAgICAgam9pbktleShUUkFOU0FDVElPTlNfRk9MREVSLCBidWlsZEluZGV4Rm9sZGVyKSxcbiAgICApO1xuICB9XG5cbiAgaWYgKHRyYW5zYWN0aW9ucy5sZW5ndGggPiAwKSByZXR1cm4gdHJhbnNhY3Rpb25zO1xuXG4gIHJldHVybiBhd2FpdCByZXRyaWV2ZVN0YW5kYXJkVHJhbnNhY3Rpb25zKFxuICAgIGFwcCwgdHJhbnNhY3Rpb25GaWxlcyxcbiAgKTtcbn07XG5cbmNvbnN0IHJldHJpZXZlQnVpbGRJbmRleFRyYW5zYWN0aW9ucyA9IGFzeW5jIChhcHAsIGJ1aWxkSW5kZXhGb2xkZXIpID0+IHtcbiAgY29uc3QgY2hpbGRGb2xkZXJzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5nZXRGb2xkZXJDb250ZW50cyhidWlsZEluZGV4Rm9sZGVyKTtcbiAgaWYgKGNoaWxkRm9sZGVycy5sZW5ndGggPT09IDApIHtcbiAgICAvLyBjbGVhbnVwXG4gICAgYXdhaXQgYXBwLmRhdGFzdG9yZS5kZWxldGVGb2xkZXIoYnVpbGRJbmRleEZvbGRlcik7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgZ2V0VHJhbnNhY3Rpb25GaWxlcyA9IGFzeW5jIChjaGlsZEZvbGRlckluZGV4ID0gMCkgPT4ge1xuICAgIGlmIChjaGlsZEZvbGRlckluZGV4ID49IGNoaWxkRm9sZGVycy5sZW5ndGgpIHJldHVybiBbXTtcblxuICAgIGNvbnN0IGNoaWxkRm9sZGVyS2V5ID0gam9pbktleShidWlsZEluZGV4Rm9sZGVyLCBjaGlsZEZvbGRlcnNbY2hpbGRGb2xkZXJJbmRleF0pO1xuICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5nZXRGb2xkZXJDb250ZW50cyhcbiAgICAgIGNoaWxkRm9sZGVyS2V5LFxuICAgICk7XG5cbiAgICBpZiAoZmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBhd2FpdCBhcHAuZGF0YXN0b3JlLmRlbGV0ZUZvbGRlcihjaGlsZEZvbGRlcktleSk7XG4gICAgICByZXR1cm4gYXdhaXQgZ2V0VHJhbnNhY3Rpb25GaWxlcyhjaGlsZEZvbGRlckluZGV4ICsgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgY2hpbGRGb2xkZXJLZXksIGZpbGVzIH07XG4gIH07XG5cbiAgY29uc3QgdHJhbnNhY3Rpb25GaWxlcyA9IGF3YWl0IGdldFRyYW5zYWN0aW9uRmlsZXMoKTtcblxuICBpZiAodHJhbnNhY3Rpb25GaWxlcy5maWxlcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCB0cmFuc2FjdGlvbnMgPSAkKHRyYW5zYWN0aW9uRmlsZXMuZmlsZXMsIFtcbiAgICBtYXAocGFyc2VUcmFuc2FjdGlvbklkKSxcbiAgXSk7XG5cbiAgZm9yIChjb25zdCB0IG9mIHRyYW5zYWN0aW9ucykge1xuICAgIGNvbnN0IHRyYW5zYWN0aW9uQ29udGVudCA9IGF3YWl0IGFwcC5kYXRhc3RvcmUubG9hZEpzb24oXG4gICAgICBqb2luS2V5KFxuICAgICAgICB0cmFuc2FjdGlvbkZpbGVzLmNoaWxkRm9sZGVyS2V5LFxuICAgICAgICB0LmZ1bGxJZCxcbiAgICAgICksXG4gICAgKTtcbiAgICB0LnJlY29yZCA9IGF3YWl0IF9sb2FkKGFwcCwgdHJhbnNhY3Rpb25Db250ZW50LnJlY29yZEtleSk7XG4gIH1cblxuICB0cmFuc2FjdGlvbnMuaW5kZXhOb2RlID0gJChidWlsZEluZGV4Rm9sZGVyLCBbXG4gICAgZ2V0TGFzdFBhcnRJbktleSxcbiAgICBub2RlS2V5SGFzaEZyb21CdWlsZEZvbGRlcixcbiAgICBnZXROb2RlRnJvbU5vZGVLZXlIYXNoKGFwcC5oaWVyYXJjaHkpLFxuICBdKTtcblxuICB0cmFuc2FjdGlvbnMuZm9sZGVyS2V5ID0gdHJhbnNhY3Rpb25GaWxlcy5jaGlsZEZvbGRlcktleTtcblxuICByZXR1cm4gdHJhbnNhY3Rpb25zO1xufTtcblxuY29uc3QgcmV0cmlldmVTdGFuZGFyZFRyYW5zYWN0aW9ucyA9IGFzeW5jIChhcHAsIHRyYW5zYWN0aW9uRmlsZXMpID0+IHtcbiAgY29uc3QgdHJhbnNhY3Rpb25JZHMgPSAkKHRyYW5zYWN0aW9uRmlsZXMsIFtcbiAgICBmaWx0ZXIoZiA9PiBmICE9PSBMT0NLX0ZJTEVOQU1FXG4gICAgICAgICAgICAgICAgICAgICYmICFpc0J1aWxkSW5kZXhGb2xkZXIoZikpLFxuICAgIG1hcChwYXJzZVRyYW5zYWN0aW9uSWQpLFxuICBdKTtcblxuICBjb25zdCB0cmFuc2FjdGlvbklkc0J5UmVjb3JkID0gJCh0cmFuc2FjdGlvbklkcywgW1xuICAgIGdyb3VwQnkoJ3JlY29yZElkJyksXG4gIF0pO1xuXG4gIGNvbnN0IGRlZHVwZWRUcmFuc2FjdGlvbnMgPSBbXTtcblxuICBjb25zdCB2ZXJpZnkgPSBhc3luYyAodCkgPT4ge1xuICAgIGlmICh0LnZlcmlmaWVkID09PSB0cnVlKSByZXR1cm4gdDtcblxuICAgIGNvbnN0IGlkID0gZ2V0VHJhbnNhY3Rpb25JZChcbiAgICAgIHQucmVjb3JkSWQsXG4gICAgICB0LnRyYW5zYWN0aW9uVHlwZSxcbiAgICAgIHQudW5pcXVlSWQsXG4gICAgKTtcblxuICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gYXdhaXQgYXBwLmRhdGFzdG9yZS5sb2FkSnNvbihcbiAgICAgIGpvaW5LZXkoVFJBTlNBQ1RJT05TX0ZPTERFUiwgaWQpLFxuICAgICk7XG5cbiAgICBpZiAoaXNEZWxldGUodCkpIHtcbiAgICAgIHQucmVjb3JkID0gdHJhbnNhY3Rpb24ucmVjb3JkO1xuICAgICAgdC52ZXJpZmllZCA9IHRydWU7XG4gICAgICByZXR1cm4gdDtcbiAgICB9XG5cbiAgICBjb25zdCByZWMgPSBhd2FpdCBfbG9hZChcbiAgICAgIGFwcCxcbiAgICAgIHRyYW5zYWN0aW9uLnJlY29yZEtleSxcbiAgICApO1xuICAgIGlmIChyZWMudHJhbnNhY3Rpb25JZCA9PT0gaWQpIHtcbiAgICAgIHQucmVjb3JkID0gcmVjO1xuICAgICAgaWYgKHRyYW5zYWN0aW9uLm9sZFJlY29yZCkgeyB0Lm9sZFJlY29yZCA9IHRyYW5zYWN0aW9uLm9sZFJlY29yZDsgfVxuICAgICAgdC52ZXJpZmllZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHQudmVyaWZpZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdDtcbiAgfTtcblxuICBjb25zdCBwaWNrT25lID0gYXN5bmMgKHRyYW5zLCBmb3JUeXBlKSA9PiB7XG4gICAgY29uc3QgdHJhbnNGb3JUeXBlID0gZmlsdGVyKGZvclR5cGUpKHRyYW5zKTtcbiAgICBpZiAodHJhbnNGb3JUeXBlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY29uc3QgdCA9IGF3YWl0IHZlcmlmeSh0cmFuc0ZvclR5cGVbMF0pO1xuICAgICAgcmV0dXJuICh0LnZlcmlmaWVkID09PSB0cnVlID8gdCA6IG51bGwpO1xuICAgIH1cbiAgICBmb3IgKGxldCB0IG9mIHRyYW5zRm9yVHlwZSkge1xuICAgICAgdCA9IGF3YWl0IHZlcmlmeSh0KTtcbiAgICAgIGlmICh0LnZlcmlmaWVkID09PSB0cnVlKSB7IHJldHVybiB0OyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG5cbiAgZm9yIChjb25zdCByZWNvcmRJZCBpbiB0cmFuc2FjdGlvbklkc0J5UmVjb3JkKSB7XG4gICAgY29uc3QgdHJhbnNJZHNGb3JSZWNvcmQgPSB0cmFuc2FjdGlvbklkc0J5UmVjb3JkW3JlY29yZElkXTtcbiAgICBpZiAodHJhbnNJZHNGb3JSZWNvcmQubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCB0ID0gYXdhaXQgdmVyaWZ5KHRyYW5zSWRzRm9yUmVjb3JkWzBdKTtcbiAgICAgIGlmICh0LnZlcmlmaWVkKSB7IGRlZHVwZWRUcmFuc2FjdGlvbnMucHVzaCh0KTsgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChzb21lKGlzRGVsZXRlKSh0cmFuc0lkc0ZvclJlY29yZCkpIHtcbiAgICAgIGNvbnN0IHQgPSBhd2FpdCB2ZXJpZnkoZmluZChpc0RlbGV0ZSkodHJhbnNJZHNGb3JSZWNvcmQpKTtcbiAgICAgIGlmICh0LnZlcmlmaWVkKSB7IGRlZHVwZWRUcmFuc2FjdGlvbnMucHVzaCh0KTsgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChzb21lKGlzVXBkYXRlKSh0cmFuc0lkc0ZvclJlY29yZCkpIHtcbiAgICAgIGNvbnN0IHVwZCA9IGF3YWl0IHBpY2tPbmUodHJhbnNJZHNGb3JSZWNvcmQsIGlzVXBkYXRlKTtcbiAgICAgIGlmIChpc1NvbWV0aGluZyh1cGQpICYmIHVwZC52ZXJpZmllZCkgeyBkZWR1cGVkVHJhbnNhY3Rpb25zLnB1c2godXBkKTsgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChzb21lKGlzQ3JlYXRlKSh0cmFuc0lkc0ZvclJlY29yZCkpIHtcbiAgICAgIGNvbnN0IGNyZSA9IGF3YWl0IHBpY2tPbmUodHJhbnNJZHNGb3JSZWNvcmQsIGlzQ3JlYXRlKTtcbiAgICAgIGlmIChpc1NvbWV0aGluZyhjcmUpKSB7IGRlZHVwZWRUcmFuc2FjdGlvbnMucHVzaChjcmUpOyB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBkdXBsaWNhdGVzID0gJCh0cmFuc2FjdGlvbklkcywgW1xuICAgIGZpbHRlcih0ID0+IG5vbmUoZGR0ID0+IGRkdC51bmlxdWVJZCA9PT0gdC51bmlxdWVJZCkoZGVkdXBlZFRyYW5zYWN0aW9ucykpLFxuICBdKTtcblxuXG4gIGNvbnN0IGRlbGV0ZVByb21pc2VzID0gbWFwKHQgPT4gYXBwLmRhdGFzdG9yZS5kZWxldGVGaWxlKFxuICAgIGpvaW5LZXkoXG4gICAgICBUUkFOU0FDVElPTlNfRk9MREVSLFxuICAgICAgZ2V0VHJhbnNhY3Rpb25JZChcbiAgICAgICAgdC5yZWNvcmRJZCxcbiAgICAgICAgdC50cmFuc2FjdGlvblR5cGUsXG4gICAgICAgIHQudW5pcXVlSWQsXG4gICAgICApLFxuICAgICksXG4gICkpKGR1cGxpY2F0ZXMpO1xuXG4gIGF3YWl0IFByb21pc2UuYWxsKGRlbGV0ZVByb21pc2VzKTtcblxuICByZXR1cm4gZGVkdXBlZFRyYW5zYWN0aW9ucztcbn07XG5cbmNvbnN0IHBhcnNlVHJhbnNhY3Rpb25JZCA9IChpZCkgPT4ge1xuICBjb25zdCBzcGxpdElkID0gc3BsaXQoaWRTZXApKGlkKTtcbiAgcmV0dXJuICh7XG4gICAgcmVjb3JkSWQ6IHNwbGl0SWRbMF0sXG4gICAgdHJhbnNhY3Rpb25UeXBlOiBzcGxpdElkWzFdLFxuICAgIHVuaXF1ZUlkOiBzcGxpdElkWzJdLFxuICAgIGZ1bGxJZDogaWQsXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IG9yZGVyQnkgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgcmVkdWNlLCBmaW5kLCBpbmNsdWRlcywgZmxhdHRlbiwgdW5pb24sXG4gIGZpbHRlciwgZWFjaCwgbWFwLFxufSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHtcbiAgam9pbktleSwgc3BsaXRLZXksIGlzTm9uRW1wdHlTdHJpbmcsXG4gIGlzTm90aGluZywgJCwgaXNTb21ldGhpbmcsXG59IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1xuICBnZXRGbGF0dGVuZWRIaWVyYXJjaHksIGdldE5vZGUsIGdldFJlY29yZE5vZGVJZCxcbiAgZ2V0RXhhY3ROb2RlRm9yS2V5LCByZWNvcmROb2RlSWRJc0FsbG93ZWQsXG4gIGlzUmVjb3JkLCBpc0dsb2JhbEluZGV4LFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgaW5kZXhUeXBlcyB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2luZGV4ZXMnO1xuaW1wb3J0IHsgZ2V0SW5kZXhEaXIgfSBmcm9tIFwiLi4vaW5kZXhBcGkvZ2V0SW5kZXhEaXJcIjtcbmltcG9ydCB7IGdldFJlY29yZEluZm99IGZyb20gXCIuLi9yZWNvcmRBcGkvcmVjb3JkSW5mb1wiO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVsZXZhbnRBbmNlc3RvckluZGV4ZXMgPSAoaGllcmFyY2h5LCByZWNvcmQpID0+IHtcbiAgY29uc3Qga2V5ID0gcmVjb3JkLmtleTtcbiAgY29uc3Qga2V5UGFydHMgPSBzcGxpdEtleShrZXkpO1xuICBjb25zdCBub2RlSWQgPSBnZXRSZWNvcmROb2RlSWQoa2V5KTtcblxuICBjb25zdCBmbGF0SGllcmFyY2h5ID0gb3JkZXJCeShnZXRGbGF0dGVuZWRIaWVyYXJjaHkoaGllcmFyY2h5KSxcbiAgICBbbm9kZSA9PiBub2RlLnBhdGhSZWd4KCkubGVuZ3RoXSxcbiAgICBbJ2Rlc2MnXSk7XG5cbiAgY29uc3QgbWFrZWluZGV4Tm9kZUFuZERpcl9Gb3JBbmNlc3RvckluZGV4ID0gKGluZGV4Tm9kZSwgcGFyZW50UmVjb3JkRGlyKSA9PiBtYWtlSW5kZXhOb2RlQW5kRGlyKGluZGV4Tm9kZSwgam9pbktleShwYXJlbnRSZWNvcmREaXIsIGluZGV4Tm9kZS5uYW1lKSk7XG5cbiAgY29uc3QgdHJhdmVyc2VBbmNlc3RvckluZGV4ZXNJblBhdGggPSAoKSA9PiByZWR1Y2UoKGFjYywgcGFydCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRJbmRleEtleSA9IGpvaW5LZXkoYWNjLmxhc3RJbmRleEtleSwgcGFydCk7XG4gICAgYWNjLmxhc3RJbmRleEtleSA9IGN1cnJlbnRJbmRleEtleTtcbiAgICBjb25zdCB0ZXN0UGF0aFJlZ3ggPSBwID0+IG5ldyBSZWdFeHAoYCR7cC5wYXRoUmVneCgpfSRgKS50ZXN0KGN1cnJlbnRJbmRleEtleSk7XG4gICAgY29uc3Qgbm9kZU1hdGNoID0gZmluZCh0ZXN0UGF0aFJlZ3gpKGZsYXRIaWVyYXJjaHkpO1xuXG4gICAgaWYgKGlzTm90aGluZyhub2RlTWF0Y2gpKSB7IHJldHVybiBhY2M7IH1cblxuICAgIGlmICghaXNSZWNvcmQobm9kZU1hdGNoKVxuICAgICAgICAgICAgICAgIHx8IG5vZGVNYXRjaC5pbmRleGVzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gYWNjOyB9XG5cbiAgICBjb25zdCBpbmRleGVzID0gJChub2RlTWF0Y2guaW5kZXhlcywgW1xuICAgICAgZmlsdGVyKGkgPT4gaS5pbmRleFR5cGUgPT09IGluZGV4VHlwZXMuYW5jZXN0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIChpLmFsbG93ZWRSZWNvcmROb2RlSWRzLmxlbmd0aCA9PT0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGluY2x1ZGVzKG5vZGVJZCkoaS5hbGxvd2VkUmVjb3JkTm9kZUlkcykpKSxcbiAgICBdKTtcblxuICAgIGNvbnN0IGN1cnJlbnRSZWNvcmREaXIgPSBnZXRSZWNvcmRJbmZvKGhpZXJhcmNoeSwgY3VycmVudEluZGV4S2V5KS5kaXI7XG5cbiAgICBlYWNoKHYgPT4gYWNjLm5vZGVzQW5kS2V5cy5wdXNoKFxuICAgICAgbWFrZWluZGV4Tm9kZUFuZERpcl9Gb3JBbmNlc3RvckluZGV4KHYsIGN1cnJlbnRSZWNvcmREaXIpLFxuICAgICkpKGluZGV4ZXMpO1xuXG4gICAgcmV0dXJuIGFjYztcbiAgfSwgeyBsYXN0SW5kZXhLZXk6ICcnLCBub2Rlc0FuZEtleXM6IFtdIH0pKGtleVBhcnRzKS5ub2Rlc0FuZEtleXM7XG5cbiAgY29uc3Qgcm9vdEluZGV4ZXMgPSAkKGZsYXRIaWVyYXJjaHksIFtcbiAgICBmaWx0ZXIobiA9PiBpc0dsb2JhbEluZGV4KG4pICYmIHJlY29yZE5vZGVJZElzQWxsb3dlZChuKShub2RlSWQpKSxcbiAgICBtYXAoaSA9PiBtYWtlSW5kZXhOb2RlQW5kRGlyKFxuICAgICAgICAgICAgICBpLCBcbiAgICAgICAgICAgICAgZ2V0SW5kZXhEaXIoaGllcmFyY2h5LCBpLm5vZGVLZXkoKSkpKSxcbiAgXSk7XG5cbiAgcmV0dXJuIHVuaW9uKHRyYXZlcnNlQW5jZXN0b3JJbmRleGVzSW5QYXRoKCkpKHJvb3RJbmRleGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRSZWxldmFudFJldmVyc2VSZWZlcmVuY2VJbmRleGVzID0gKGhpZXJhcmNoeSwgcmVjb3JkKSA9PiAkKHJlY29yZC5rZXksIFtcbiAgZ2V0RXhhY3ROb2RlRm9yS2V5KGhpZXJhcmNoeSksXG4gIG4gPT4gbi5maWVsZHMsXG4gIGZpbHRlcihmID0+IGYudHlwZSA9PT0gJ3JlZmVyZW5jZSdcbiAgICAgICAgICAgICAgICAgICAgJiYgaXNTb21ldGhpbmcocmVjb3JkW2YubmFtZV0pXG4gICAgICAgICAgICAgICAgICAgICYmIGlzTm9uRW1wdHlTdHJpbmcocmVjb3JkW2YubmFtZV0ua2V5KSksXG4gIG1hcChmID0+ICQoZi50eXBlT3B0aW9ucy5yZXZlcnNlSW5kZXhOb2RlS2V5cywgW1xuICAgIG1hcChuID0+ICh7XG4gICAgICByZWNvcmROb2RlOiBnZXROb2RlKGhpZXJhcmNoeSwgbiksXG4gICAgICBmaWVsZDogZixcbiAgICB9KSksXG4gIF0pKSxcbiAgZmxhdHRlbixcbiAgbWFwKG4gPT4gbWFrZUluZGV4Tm9kZUFuZERpcihcbiAgICBuLnJlY29yZE5vZGUsXG4gICAgam9pbktleShcbiAgICAgIGdldFJlY29yZEluZm8oaGllcmFyY2h5LCByZWNvcmRbbi5maWVsZC5uYW1lXS5rZXkpLmRpciwgXG4gICAgICBuLnJlY29yZE5vZGUubmFtZSksXG4gICkpLFxuXSk7XG5cbmNvbnN0IG1ha2VJbmRleE5vZGVBbmREaXIgPSAoaW5kZXhOb2RlLCBpbmRleERpcikgPT4gKHsgaW5kZXhOb2RlLCBpbmRleERpciB9KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmVsZXZhbnRBbmNlc3RvckluZGV4ZXM7XG4iLCIgIC8vIGFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZGV4NGVyL2pzLXByb21pc2Utd3JpdGFibGVcbiAgLy8gVGhhbmsgeW91IDopIFxuICBleHBvcnQgY29uc3QgcHJvbWlzZVdyaXRlYWJsZVN0cmVhbSA9IHN0cmVhbSA9PiB7XG4gIFxuICAgIGxldCBfZXJyb3JlZDtcbiAgXG4gICAgY29uc3QgX2Vycm9ySGFuZGxlciA9IGVyciA9PiB7XG4gICAgICAgIF9lcnJvcmVkID0gZXJyO1xuICAgIH07XG5cbiAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBfZXJyb3JIYW5kbGVyKTsgICAgXG4gIFxuICAgIGNvbnN0IHdyaXRlID0gY2h1bmsgPT4geyAgXG4gICAgICBsZXQgcmVqZWN0ZWQgPSBmYWxzZTtcbiAgXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoX2Vycm9yZWQpIHtcbiAgICAgICAgICBjb25zdCBlcnIgPSBfZXJyb3JlZDtcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGlmICghc3RyZWFtLndyaXRhYmxlIHx8IHN0cmVhbS5jbG9zZWQgfHwgc3RyZWFtLmRlc3Ryb3llZCkge1xuICAgICAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKFwid3JpdGUgYWZ0ZXIgZW5kXCIpKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3Qgd3JpdGVFcnJvckhhbmRsZXIgPSBlcnIgPT4ge1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJlamVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgc3RyZWFtLm9uY2UoXCJlcnJvclwiLCB3cml0ZUVycm9ySGFuZGxlcik7XG4gIFxuICAgICAgICBjb25zdCBjYW5Xcml0ZSA9IHN0cmVhbS53cml0ZShjaHVuayk7XG4gIFxuICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCB3cml0ZUVycm9ySGFuZGxlcik7XG4gIFxuICAgICAgICBpZiAoY2FuV3JpdGUpIHtcbiAgICAgICAgICBpZiAoIXJlamVjdGVkKSB7XG4gICAgICAgICAgICByZXNvbHZlKGNodW5rLmxlbmd0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IGVyciA9PiB7XG4gICAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICBjb25zdCBkcmFpbkhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHJlc29sdmUoY2h1bmsubGVuZ3RoKTtcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIGNvbnN0IGNsb3NlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVzb2x2ZShjaHVuay5sZW5ndGgpO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgY29uc3QgZmluaXNoSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVzb2x2ZShjaHVuay5sZW5ndGgpO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgY29uc3QgcmVtb3ZlTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiY2xvc2VcIiwgY2xvc2VIYW5kbGVyKTtcbiAgICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImRyYWluXCIsIGRyYWluSGFuZGxlcik7XG4gICAgICAgICAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBlcnJvckhhbmRsZXIpO1xuICAgICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZmluaXNoXCIsIGZpbmlzaEhhbmRsZXIpO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgc3RyZWFtLm9uKFwiY2xvc2VcIiwgY2xvc2VIYW5kbGVyKTtcbiAgICAgICAgICBzdHJlYW0ub24oXCJkcmFpblwiLCBkcmFpbkhhbmRsZXIpO1xuICAgICAgICAgIHN0cmVhbS5vbihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gICAgICAgICAgc3RyZWFtLm9uKFwiZmluaXNoXCIsIGZpbmlzaEhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgXG4gICAgY29uc3QgZW5kID0gKCkgPT4ge1xuICBcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGlmIChfZXJyb3JlZCkge1xuICAgICAgICAgIGNvbnN0IGVyciA9IF9lcnJvcmVkO1xuICAgICAgICAgIF9lcnJvcmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgaWYgKCFzdHJlYW0ud3JpdGFibGUgfHwgc3RyZWFtLmNsb3NlZCB8fCBzdHJlYW0uZGVzdHJveWVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgZmluaXNoSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IChlcnIpID0+IHtcbiAgICAgICAgICBfZXJyb3JlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgY29uc3QgcmVtb3ZlTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gICAgICAgICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZmluaXNoXCIsIGZpbmlzaEhhbmRsZXIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBzdHJlYW0ub24oXCJmaW5pc2hcIiwgZmluaXNoSGFuZGxlcik7XG4gICAgICAgIHN0cmVhbS5vbihcImVycm9yXCIsIGVycm9ySGFuZGxlcik7XG4gIFxuICAgICAgICBzdHJlYW0uZW5kKCk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiB7d3JpdGUsIGVuZH07XG4gIH1cbiAgXG4gIGV4cG9ydCBkZWZhdWx0IHByb21pc2VXcml0ZWFibGVTdHJlYW1cbiAgIiwiaW1wb3J0IHsgZW5zdXJlU2hhcmROYW1lSXNJblNoYXJkTWFwIH0gZnJvbSAnLi9zaGFyZGluZyc7XG5pbXBvcnQgeyBnZXRJbmRleFdyaXRlciB9IGZyb20gJy4vc2VyaWFsaXplcic7XG5pbXBvcnQgeyBpc1NoYXJkZWRJbmRleCwgZ2V0UGFyZW50S2V5IH0gZnJvbSAnLi4vdGVtcGxhdGVBcGkvaGllcmFyY2h5JztcbmltcG9ydCB7cHJvbWlzZVdyaXRlYWJsZVN0cmVhbX0gZnJvbSBcIi4vcHJvbWlzZVdyaXRhYmxlU3RyZWFtXCI7XG5pbXBvcnQge3Byb21pc2VSZWFkYWJsZVN0cmVhbX0gZnJvbSBcIi4vcHJvbWlzZVJlYWRhYmxlU3RyZWFtXCI7XG5cbmV4cG9ydCBjb25zdCBhcHBseVRvU2hhcmQgPSBhc3luYyAoaGllcmFyY2h5LCBzdG9yZSwgaW5kZXhEaXIsXG4gIGluZGV4Tm9kZSwgaW5kZXhTaGFyZEtleSwgcmVjb3Jkc1RvV3JpdGUsIGtleXNUb1JlbW92ZSkgPT4ge1xuICBjb25zdCBjcmVhdGVJZk5vdEV4aXN0cyA9IHJlY29yZHNUb1dyaXRlLmxlbmd0aCA+IDA7XG4gIGNvbnN0IHdyaXRlciA9IGF3YWl0IGdldFdyaXRlcihoaWVyYXJjaHksIHN0b3JlLCBpbmRleERpciwgaW5kZXhTaGFyZEtleSwgaW5kZXhOb2RlLCBjcmVhdGVJZk5vdEV4aXN0cyk7XG4gIGlmICh3cml0ZXIgPT09IFNIQVJEX0RFTEVURUQpIHJldHVybjtcblxuICBhd2FpdCB3cml0ZXIudXBkYXRlSW5kZXgocmVjb3Jkc1RvV3JpdGUsIGtleXNUb1JlbW92ZSk7XG4gIGF3YWl0IHN3YXBUZW1wRmlsZUluKHN0b3JlLCBpbmRleFNoYXJkS2V5KTtcbn07XG5cbmNvbnN0IFNIQVJEX0RFTEVURUQgPSAnU0hBUkRfREVMRVRFRCc7XG5jb25zdCBnZXRXcml0ZXIgPSBhc3luYyAoaGllcmFyY2h5LCBzdG9yZSwgaW5kZXhEaXIsIGluZGV4ZWREYXRhS2V5LCBpbmRleE5vZGUsIGNyZWF0ZUlmTm90RXhpc3RzKSA9PiB7XG4gIGxldCByZWFkYWJsZVN0cmVhbSA9IG51bGw7XG5cbiAgaWYgKGlzU2hhcmRlZEluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICBhd2FpdCBlbnN1cmVTaGFyZE5hbWVJc0luU2hhcmRNYXAoc3RvcmUsIGluZGV4RGlyLCBpbmRleGVkRGF0YUtleSk7XG4gICAgaWYoIWF3YWl0IHN0b3JlLmV4aXN0cyhpbmRleGVkRGF0YUtleSkpIHtcbiAgICAgIGlmIChhd2FpdCBzdG9yZS5leGlzdHMoZ2V0UGFyZW50S2V5KGluZGV4ZWREYXRhS2V5KSkpIHtcbiAgICAgICAgYXdhaXQgc3RvcmUuY3JlYXRlRmlsZShpbmRleGVkRGF0YUtleSwgXCJcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gU0hBUkRfREVMRVRFRDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0cnkge1xuXG4gICAgcmVhZGFibGVTdHJlYW0gPSBwcm9taXNlUmVhZGFibGVTdHJlYW0oXG4gICAgICAgIGF3YWl0IHN0b3JlLnJlYWRhYmxlRmlsZVN0cmVhbShpbmRleGVkRGF0YUtleSlcbiAgICApO1xuXG4gIH0gY2F0Y2ggKGUpIHtcblxuICAgIGlmIChhd2FpdCBzdG9yZS5leGlzdHMoaW5kZXhlZERhdGFLZXkpKSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY3JlYXRlSWZOb3RFeGlzdHMpIHsgXG4gICAgICAgIGlmKGF3YWl0IHN0b3JlLmV4aXN0cyhnZXRQYXJlbnRLZXkoaW5kZXhlZERhdGFLZXkpKSkge1xuICAgICAgICAgIGF3YWl0IHN0b3JlLmNyZWF0ZUZpbGUoaW5kZXhlZERhdGFLZXksICcnKTsgICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBTSEFSRF9ERUxFVEVEOyBcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHsgXG4gICAgICAgIHJldHVybiBTSEFSRF9ERUxFVEVEOyBcbiAgICAgIH1cblxuICAgICAgcmVhZGFibGVTdHJlYW0gPSBwcm9taXNlUmVhZGFibGVTdHJlYW0oXG4gICAgICAgICAgYXdhaXQgc3RvcmUucmVhZGFibGVGaWxlU3RyZWFtKGluZGV4ZWREYXRhS2V5KVxuICAgICAgKTtcblxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHdyaXRhYmxlU3RyZWFtID0gcHJvbWlzZVdyaXRlYWJsZVN0cmVhbShcbiAgICAgIGF3YWl0IHN0b3JlLndyaXRhYmxlRmlsZVN0cmVhbShpbmRleGVkRGF0YUtleSArIFwiLnRlbXBcIilcbiAgKTtcblxuICByZXR1cm4gZ2V0SW5kZXhXcml0ZXIoXG4gICAgaGllcmFyY2h5LCBpbmRleE5vZGUsXG4gICAgICAgIHJlYWRhYmxlU3RyZWFtLCB3cml0YWJsZVN0cmVhbVxuICApO1xufTtcblxuY29uc3Qgc3dhcFRlbXBGaWxlSW4gPSBhc3luYyAoc3RvcmUsIGluZGV4ZWREYXRhS2V5LCBpc1JldHJ5ID0gZmFsc2UpID0+IHtcbiAgY29uc3QgdGVtcEZpbGUgPSBgJHtpbmRleGVkRGF0YUtleX0udGVtcGA7XG4gIHRyeSB7XG4gICAgYXdhaXQgc3RvcmUuZGVsZXRlRmlsZShpbmRleGVkRGF0YUtleSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBpZ25vcmUgZmFpbHVyZSwgaW5jYXNlIGl0IGhhcyBub3QgYmVlbiBjcmVhdGVkIHlldFxuXG4gICAgLy8gaWYgcGFyZW50IGZvbGRlciBkb2VzIG5vdCBleGlzdCwgYXNzdW1lIHRoYXQgdGhpcyBpbmRleFxuICAgIC8vIHNob3VsZCBub3QgYmUgdGhlcmVcbiAgICBpZighYXdhaXQgc3RvcmUuZXhpc3RzKGdldFBhcmVudEtleShpbmRleGVkRGF0YUtleSkpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHRyeSB7XG4gICAgYXdhaXQgc3RvcmUucmVuYW1lRmlsZSh0ZW1wRmlsZSwgaW5kZXhlZERhdGFLZXkpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gcmV0cnlpbmcgaW4gY2FzZSBkZWxldGUgZmFpbHVyZSB3YXMgZm9yIHNvbWUgb3RoZXIgcmVhc29uXG4gICAgaWYgKCFpc1JldHJ5KSB7XG4gICAgICBhd2FpdCBzd2FwVGVtcEZpbGVJbihzdG9yZSwgaW5kZXhlZERhdGFLZXksIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gc3dhcCBpbiBpbmRleCBmaWxlZDogXCIgKyBlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIGZpbHRlciwgbWFwLCBpc1VuZGVmaW5lZCwgaW5jbHVkZXMsXG4gIGZsYXR0ZW4sIGludGVyc2VjdGlvbkJ5LFxuICBpc0VxdWFsLCBwdWxsLCBrZXlzLFxuICBkaWZmZXJlbmNlQnksIGRpZmZlcmVuY2UsXG59IGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgeyB1bmlvbiB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcyxcbiAgZ2V0UmVsZXZhbnRSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyxcbn0gZnJvbSAnLi4vaW5kZXhpbmcvcmVsZXZhbnQnO1xuaW1wb3J0IHsgZXZhbHVhdGUgfSBmcm9tICcuLi9pbmRleGluZy9ldmFsdWF0ZSc7XG5pbXBvcnQge1xuICAkLCBpc1NvbWV0aGluZyxcbiAgaXNOb25FbXB0eUFycmF5LCBqb2luS2V5LFxuICBpc05vbkVtcHR5U3RyaW5nLFxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgZ2V0SW5kZXhlZERhdGFLZXkgfSBmcm9tICcuLi9pbmRleGluZy9zaGFyZGluZyc7XG5pbXBvcnQge1xuICBpc1VwZGF0ZSwgaXNDcmVhdGUsXG4gIGlzRGVsZXRlLCBpc0J1aWxkSW5kZXgsXG59IGZyb20gJy4vdHJhbnNhY3Rpb25zQ29tbW9uJztcbmltcG9ydCB7IGFwcGx5VG9TaGFyZCB9IGZyb20gJy4uL2luZGV4aW5nL2FwcGx5JztcbmltcG9ydCB7XG4gIGdldEFjdHVhbEtleU9mUGFyZW50LFxuICBpc0dsb2JhbEluZGV4LCBmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleCwgaXNSZWZlcmVuY2VJbmRleCxcbiAgZ2V0RXhhY3ROb2RlRm9yS2V5LFxufSBmcm9tICcuLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHknO1xuaW1wb3J0IHsgZ2V0UmVjb3JkSW5mbyB9IGZyb20gXCIuLi9yZWNvcmRBcGkvcmVjb3JkSW5mb1wiO1xuaW1wb3J0IHsgZ2V0SW5kZXhEaXIgfSBmcm9tICcuLi9pbmRleEFwaS9nZXRJbmRleERpcic7XG5cbmV4cG9ydCBjb25zdCBleGVjdXRlVHJhbnNhY3Rpb25zID0gYXBwID0+IGFzeW5jICh0cmFuc2FjdGlvbnMpID0+IHtcbiAgY29uc3QgcmVjb3Jkc0J5U2hhcmQgPSBtYXBwZWRSZWNvcmRzQnlJbmRleFNoYXJkKGFwcC5oaWVyYXJjaHksIHRyYW5zYWN0aW9ucyk7XG5cbiAgZm9yIChjb25zdCBzaGFyZCBvZiBrZXlzKHJlY29yZHNCeVNoYXJkKSkge1xuICAgIGF3YWl0IGFwcGx5VG9TaGFyZChcbiAgICAgIGFwcC5oaWVyYXJjaHksIGFwcC5kYXRhc3RvcmUsXG4gICAgICByZWNvcmRzQnlTaGFyZFtzaGFyZF0uaW5kZXhEaXIsXG4gICAgICByZWNvcmRzQnlTaGFyZFtzaGFyZF0uaW5kZXhOb2RlLFxuICAgICAgc2hhcmQsXG4gICAgICByZWNvcmRzQnlTaGFyZFtzaGFyZF0ud3JpdGVzLFxuICAgICAgcmVjb3Jkc0J5U2hhcmRbc2hhcmRdLnJlbW92ZXMsXG4gICAgKTtcbiAgfVxufTtcblxuY29uc3QgbWFwcGVkUmVjb3Jkc0J5SW5kZXhTaGFyZCA9IChoaWVyYXJjaHksIHRyYW5zYWN0aW9ucykgPT4ge1xuICBjb25zdCB1cGRhdGVzID0gZ2V0VXBkYXRlVHJhbnNhY3Rpb25zQnlTaGFyZChcbiAgICBoaWVyYXJjaHksIHRyYW5zYWN0aW9ucyxcbiAgKTtcblxuICBjb25zdCBjcmVhdGVkID0gZ2V0Q3JlYXRlVHJhbnNhY3Rpb25zQnlTaGFyZChcbiAgICBoaWVyYXJjaHksIHRyYW5zYWN0aW9ucyxcbiAgKTtcbiAgY29uc3QgZGVsZXRlcyA9IGdldERlbGV0ZVRyYW5zYWN0aW9uc0J5U2hhcmQoXG4gICAgaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMsXG4gICk7XG5cbiAgY29uc3QgaW5kZXhCdWlsZCA9IGdldEJ1aWxkSW5kZXhUcmFuc2FjdGlvbnNCeVNoYXJkKFxuICAgIGhpZXJhcmNoeSxcbiAgICB0cmFuc2FjdGlvbnMsXG4gICk7XG5cbiAgY29uc3QgdG9SZW1vdmUgPSBbXG4gICAgLi4uZGVsZXRlcyxcbiAgICAuLi51cGRhdGVzLnRvUmVtb3ZlLFxuICBdO1xuXG4gIGNvbnN0IHRvV3JpdGUgPSBbXG4gICAgLi4uY3JlYXRlZCxcbiAgICAuLi51cGRhdGVzLnRvV3JpdGUsXG4gICAgLi4uaW5kZXhCdWlsZCxcbiAgXTtcblxuICBjb25zdCB0cmFuc0J5U2hhcmQgPSB7fTtcblxuICBjb25zdCBpbml0aWFsaXNlU2hhcmQgPSAodCkgPT4ge1xuICAgIGlmIChpc1VuZGVmaW5lZCh0cmFuc0J5U2hhcmRbdC5pbmRleFNoYXJkS2V5XSkpIHtcbiAgICAgIHRyYW5zQnlTaGFyZFt0LmluZGV4U2hhcmRLZXldID0ge1xuICAgICAgICB3cml0ZXM6IFtdLFxuICAgICAgICByZW1vdmVzOiBbXSxcbiAgICAgICAgaW5kZXhEaXI6IHQuaW5kZXhEaXIsXG4gICAgICAgIGluZGV4Tm9kZUtleTogdC5pbmRleE5vZGUubm9kZUtleSgpLFxuICAgICAgICBpbmRleE5vZGU6IHQuaW5kZXhOb2RlLFxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cbiAgZm9yIChjb25zdCB0cmFucyBvZiB0b1dyaXRlKSB7XG4gICAgaW5pdGlhbGlzZVNoYXJkKHRyYW5zKTtcbiAgICB0cmFuc0J5U2hhcmRbdHJhbnMuaW5kZXhTaGFyZEtleV0ud3JpdGVzLnB1c2goXG4gICAgICB0cmFucy5tYXBwZWRSZWNvcmQucmVzdWx0LFxuICAgICk7XG4gIH1cblxuICBmb3IgKGNvbnN0IHRyYW5zIG9mIHRvUmVtb3ZlKSB7XG4gICAgaW5pdGlhbGlzZVNoYXJkKHRyYW5zKTtcbiAgICB0cmFuc0J5U2hhcmRbdHJhbnMuaW5kZXhTaGFyZEtleV0ucmVtb3Zlcy5wdXNoKFxuICAgICAgdHJhbnMubWFwcGVkUmVjb3JkLnJlc3VsdC5rZXksXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiB0cmFuc0J5U2hhcmQ7XG59O1xuXG5jb25zdCBnZXRVcGRhdGVUcmFuc2FjdGlvbnNCeVNoYXJkID0gKGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKSA9PiB7XG4gIGNvbnN0IHVwZGF0ZVRyYW5zYWN0aW9ucyA9ICQodHJhbnNhY3Rpb25zLCBbZmlsdGVyKGlzVXBkYXRlKV0pO1xuXG4gIGNvbnN0IGV2YWx1YXRlSW5kZXggPSAocmVjb3JkLCBpbmRleE5vZGVBbmRQYXRoKSA9PiB7XG4gICAgY29uc3QgbWFwcGVkUmVjb3JkID0gZXZhbHVhdGUocmVjb3JkKShpbmRleE5vZGVBbmRQYXRoLmluZGV4Tm9kZSk7XG4gICAgcmV0dXJuICh7XG4gICAgICBtYXBwZWRSZWNvcmQsXG4gICAgICBpbmRleE5vZGU6IGluZGV4Tm9kZUFuZFBhdGguaW5kZXhOb2RlLFxuICAgICAgaW5kZXhEaXI6IGluZGV4Tm9kZUFuZFBhdGguaW5kZXhEaXIsXG4gICAgICBpbmRleFNoYXJkS2V5OiBnZXRJbmRleGVkRGF0YUtleShcbiAgICAgICAgaW5kZXhOb2RlQW5kUGF0aC5pbmRleE5vZGUsXG4gICAgICAgIGluZGV4Tm9kZUFuZFBhdGguaW5kZXhEaXIsXG4gICAgICAgIG1hcHBlZFJlY29yZC5yZXN1bHQsXG4gICAgICApLFxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGdldEluZGV4Tm9kZXNUb0FwcGx5ID0gaW5kZXhGaWx0ZXIgPT4gKHQsIGluZGV4ZXMpID0+ICQoaW5kZXhlcywgW1xuICAgIG1hcChuID0+ICh7XG4gICAgICBvbGQ6IGV2YWx1YXRlSW5kZXgodC5vbGRSZWNvcmQsIG4pLFxuICAgICAgbmV3OiBldmFsdWF0ZUluZGV4KHQucmVjb3JkLCBuKSxcbiAgICB9KSksXG4gICAgZmlsdGVyKGluZGV4RmlsdGVyKSxcbiAgXSk7XG5cbiAgY29uc3QgdG9SZW1vdmVGaWx0ZXIgPSAobiwgaXNVbnJlZmVyZW5jZWQpID0+IG4ub2xkLm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IHRydWVcbiAgICAgICAgJiYgKG4ubmV3Lm1hcHBlZFJlY29yZC5wYXNzZWRGaWx0ZXIgPT09IGZhbHNlXG4gICAgICAgICAgICB8fCBpc1VucmVmZXJlbmNlZCk7XG5cbiAgY29uc3QgdG9BZGRGaWx0ZXIgPSAobiwgaXNOZXdseVJlZmVyZW5jZWQpID0+IChuLm9sZC5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSBmYWxzZVxuICAgICAgICB8fCBpc05ld2x5UmVmZXJlbmNlZClcbiAgICAgICAgJiYgbi5uZXcubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gdHJ1ZTtcblxuICBjb25zdCB0b1VwZGF0ZUZpbHRlciA9IG4gPT4gbi5uZXcubWFwcGVkUmVjb3JkLnBhc3NlZEZpbHRlciA9PT0gdHJ1ZVxuICAgICAgICAmJiBuLm9sZC5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyID09PSB0cnVlXG4gICAgICAgICYmICFpc0VxdWFsKG4ub2xkLm1hcHBlZFJlY29yZC5yZXN1bHQsXG4gICAgICAgICAgbi5uZXcubWFwcGVkUmVjb3JkLnJlc3VsdCk7XG5cbiAgY29uc3QgdG9SZW1vdmUgPSBbXTtcbiAgY29uc3QgdG9Xcml0ZSA9IFtdO1xuXG4gIGZvciAoY29uc3QgdCBvZiB1cGRhdGVUcmFuc2FjdGlvbnMpIHtcbiAgICBjb25zdCBhbmNlc3RvcklkeHMgPSBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcyhcbiAgICAgIGhpZXJhcmNoeSwgdC5yZWNvcmQsXG4gICAgKTtcblxuICAgIGNvbnN0IHJlZmVyZW5jZUNoYW5nZXMgPSBkaWZmUmV2ZXJzZVJlZkZvclVwZGF0ZShcbiAgICAgIGhpZXJhcmNoeSwgdC5vbGRSZWNvcmQsIHQucmVjb3JkLFxuICAgICk7XG5cbiAgICAvLyBvbGQgcmVjb3JkcyB0byByZW1vdmUgKGZpbHRlcmVkIG91dClcbiAgICBjb25zdCBmaWx0ZXJlZE91dF90b1JlbW92ZSA9IHVuaW9uKFxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodG9SZW1vdmVGaWx0ZXIpKHQsIGFuY2VzdG9ySWR4cyksXG4gICAgICAvLyBzdGlsbCByZWZlcmVuY2VkIC0gY2hlY2sgZmlsdGVyXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b1JlbW92ZUZpbHRlcikodCwgcmVmZXJlbmNlQ2hhbmdlcy5ub3RDaGFuZ2VkKSxcbiAgICAgIC8vIHVuIHJlZmVyZW5jZWQgLSByZW1vdmUgaWYgaW4gdGhlcmUgYWxyZWFkeVxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkobiA9PiB0b1JlbW92ZUZpbHRlcihuLCB0cnVlKSkodCwgcmVmZXJlbmNlQ2hhbmdlcy51blJlZmVyZW5jZWQpLFxuICAgICk7XG5cbiAgICAvLyBuZXcgcmVjb3JkcyB0byBhZGQgKGZpbHRlcmVkIGluKVxuICAgIGNvbnN0IGZpbHRlcmVkSW5fdG9BZGQgPSB1bmlvbihcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvQWRkRmlsdGVyKSh0LCBhbmNlc3RvcklkeHMpLFxuICAgICAgLy8gbmV3bHkgcmVmZXJlbmNlZCAtIGNoZWNrIGZpbHRlclxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkobiA9PiB0b0FkZEZpbHRlcihuLCB0cnVlKSkodCwgcmVmZXJlbmNlQ2hhbmdlcy5uZXdseVJlZmVyZW5jZWQpLFxuICAgICAgLy8gcmVmZXJlbmNlIHVuY2hhbmdlZCAtIHJlcnVuIGZpbHRlciBpbiBjYXNlIHNvbWV0aGluZyBlbHNlIGNoYW5nZWRcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHRvQWRkRmlsdGVyKSh0LCByZWZlcmVuY2VDaGFuZ2VzLm5vdENoYW5nZWQpLFxuICAgICk7XG5cbiAgICBjb25zdCBjaGFuZ2VkID0gdW5pb24oXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0b1VwZGF0ZUZpbHRlcikodCwgYW5jZXN0b3JJZHhzKSxcbiAgICAgIC8vIHN0aWxsIHJlZmVyZW5jZWQgLSByZWNoZWNrIGZpbHRlclxuICAgICAgZ2V0SW5kZXhOb2Rlc1RvQXBwbHkodG9VcGRhdGVGaWx0ZXIpKHQsIHJlZmVyZW5jZUNoYW5nZXMubm90Q2hhbmdlZCksXG4gICAgKTtcblxuICAgIGNvbnN0IHNoYXJkS2V5Q2hhbmdlZCA9ICQoY2hhbmdlZCwgW1xuICAgICAgZmlsdGVyKGMgPT4gYy5vbGQuaW5kZXhTaGFyZEtleSAhPT0gYy5uZXcuaW5kZXhTaGFyZEtleSksXG4gICAgXSk7XG5cbiAgICBjb25zdCBjaGFuZ2VkSW5TYW1lU2hhcmQgPSAkKHNoYXJkS2V5Q2hhbmdlZCwgW1xuICAgICAgZGlmZmVyZW5jZShjaGFuZ2VkKSxcbiAgICBdKTtcblxuICAgIGZvciAoY29uc3QgcmVzIG9mIHNoYXJkS2V5Q2hhbmdlZCkge1xuICAgICAgcHVsbChyZXMpKGNoYW5nZWQpO1xuICAgICAgZmlsdGVyZWRPdXRfdG9SZW1vdmUucHVzaChyZXMpO1xuICAgICAgZmlsdGVyZWRJbl90b0FkZC5wdXNoKHJlcyk7XG4gICAgfVxuXG4gICAgdG9SZW1vdmUucHVzaChcbiAgICAgICQoZmlsdGVyZWRPdXRfdG9SZW1vdmUsIFtcbiAgICAgICAgbWFwKGkgPT4gaS5vbGQpLFxuICAgICAgXSksXG4gICAgKTtcblxuICAgIHRvV3JpdGUucHVzaChcbiAgICAgICQoZmlsdGVyZWRJbl90b0FkZCwgW1xuICAgICAgICBtYXAoaSA9PiBpLm5ldyksXG4gICAgICBdKSxcbiAgICApO1xuXG4gICAgdG9Xcml0ZS5wdXNoKFxuICAgICAgJChjaGFuZ2VkSW5TYW1lU2hhcmQsIFtcbiAgICAgICAgbWFwKGkgPT4gaS5uZXcpLFxuICAgICAgXSksXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiAoe1xuICAgIHRvUmVtb3ZlOiBmbGF0dGVuKHRvUmVtb3ZlKSxcbiAgICB0b1dyaXRlOiBmbGF0dGVuKHRvV3JpdGUpLFxuICB9KTtcbn07XG5cbmNvbnN0IGdldEJ1aWxkSW5kZXhUcmFuc2FjdGlvbnNCeVNoYXJkID0gKGhpZXJhcmNoeSwgdHJhbnNhY3Rpb25zKSA9PiB7XG4gIGNvbnN0IGJ1aWxkVHJhbnNhY3Rpb25zID0gJCh0cmFuc2FjdGlvbnMsIFtmaWx0ZXIoaXNCdWlsZEluZGV4KV0pO1xuICBpZiAoIWlzTm9uRW1wdHlBcnJheShidWlsZFRyYW5zYWN0aW9ucykpIHJldHVybiBbXTtcbiAgY29uc3QgaW5kZXhOb2RlID0gdHJhbnNhY3Rpb25zLmluZGV4Tm9kZTtcblxuICBjb25zdCBnZXRJbmRleERpcnMgPSAodCkgPT4ge1xuICAgIGlmIChpc0dsb2JhbEluZGV4KGluZGV4Tm9kZSkpIHtcbiAgICAgIHJldHVybiBbaW5kZXhOb2RlLm5vZGVLZXkoKV07XG4gICAgfVxuXG4gICAgaWYgKGlzUmVmZXJlbmNlSW5kZXgoaW5kZXhOb2RlKSkge1xuICAgICAgY29uc3QgcmVjb3JkTm9kZSA9IGdldEV4YWN0Tm9kZUZvcktleShoaWVyYXJjaHkpKHQucmVjb3JkLmtleSk7XG4gICAgICBjb25zdCByZWZGaWVsZHMgPSAkKHJlY29yZE5vZGUuZmllbGRzLCBbXG4gICAgICAgIGZpbHRlcihmaWVsZFJldmVyc2VzUmVmZXJlbmNlVG9JbmRleChpbmRleE5vZGUpKSxcbiAgICAgIF0pO1xuICAgICAgY29uc3QgaW5kZXhEaXJzID0gW107XG4gICAgICBmb3IgKGNvbnN0IHJlZkZpZWxkIG9mIHJlZkZpZWxkcykge1xuICAgICAgICBjb25zdCByZWZWYWx1ZSA9IHQucmVjb3JkW3JlZkZpZWxkLm5hbWVdO1xuICAgICAgICBpZiAoaXNTb21ldGhpbmcocmVmVmFsdWUpXG4gICAgICAgICAgICAgICAgICAgJiYgaXNOb25FbXB0eVN0cmluZyhyZWZWYWx1ZS5rZXkpKSB7XG4gICAgICAgICAgY29uc3QgaW5kZXhEaXIgPSBqb2luS2V5KFxuICAgICAgICAgICAgZ2V0UmVjb3JkSW5mbyhoaWVyYXJjaHksIHJlZlZhbHVlLmtleSkuZGlyLFxuICAgICAgICAgICAgaW5kZXhOb2RlLm5hbWUsXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmICghaW5jbHVkZXMoaW5kZXhEaXIpKGluZGV4RGlycykpIHsgaW5kZXhEaXJzLnB1c2goaW5kZXhEaXIpOyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpbmRleERpcnM7XG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXhLZXkgPSBqb2luS2V5KFxuICAgICAgZ2V0QWN0dWFsS2V5T2ZQYXJlbnQoXG4gICAgICAgIGluZGV4Tm9kZS5wYXJlbnQoKS5ub2RlS2V5KCksXG4gICAgICAgIHQucmVjb3JkLmtleSxcbiAgICAgICksXG4gICAgICBpbmRleE5vZGUubmFtZSxcbiAgICApO1xuXG4gICAgcmV0dXJuIFtnZXRJbmRleERpcihoaWVyYXJjaHksIGluZGV4S2V5KV07XG4gIH07XG5cbiAgcmV0dXJuICQoYnVpbGRUcmFuc2FjdGlvbnMsIFtcbiAgICBtYXAoKHQpID0+IHtcbiAgICAgIGNvbnN0IG1hcHBlZFJlY29yZCA9IGV2YWx1YXRlKHQucmVjb3JkKShpbmRleE5vZGUpO1xuICAgICAgaWYgKCFtYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyKSByZXR1cm4gbnVsbDtcbiAgICAgIGNvbnN0IGluZGV4RGlycyA9IGdldEluZGV4RGlycyh0KTtcbiAgICAgIHJldHVybiAkKGluZGV4RGlycywgW1xuICAgICAgICBtYXAoaW5kZXhEaXIgPT4gKHtcbiAgICAgICAgICBtYXBwZWRSZWNvcmQsXG4gICAgICAgICAgaW5kZXhOb2RlLFxuICAgICAgICAgIGluZGV4RGlyLFxuICAgICAgICAgIGluZGV4U2hhcmRLZXk6IGdldEluZGV4ZWREYXRhS2V5KFxuICAgICAgICAgICAgaW5kZXhOb2RlLFxuICAgICAgICAgICAgaW5kZXhEaXIsXG4gICAgICAgICAgICBtYXBwZWRSZWNvcmQucmVzdWx0LFxuICAgICAgICAgICksXG4gICAgICAgIH0pKSxcbiAgICAgIF0pO1xuICAgIH0pLFxuICAgIGZsYXR0ZW4sXG4gICAgZmlsdGVyKGlzU29tZXRoaW5nKSxcbiAgXSk7XG59O1xuXG5jb25zdCBnZXRfQ3JlYXRlX0RlbGV0ZV9UcmFuc2FjdGlvbnNCeVNoYXJkID0gcHJlZCA9PiAoaGllcmFyY2h5LCB0cmFuc2FjdGlvbnMpID0+IHtcbiAgY29uc3QgY3JlYXRlVHJhbnNhY3Rpb25zID0gJCh0cmFuc2FjdGlvbnMsIFtmaWx0ZXIocHJlZCldKTtcblxuICBjb25zdCBnZXRJbmRleE5vZGVzVG9BcHBseSA9ICh0LCBpbmRleGVzKSA9PiAkKGluZGV4ZXMsIFtcbiAgICBtYXAoKG4pID0+IHtcbiAgICAgIGNvbnN0IG1hcHBlZFJlY29yZCA9IGV2YWx1YXRlKHQucmVjb3JkKShuLmluZGV4Tm9kZSk7XG4gICAgICByZXR1cm4gKHtcbiAgICAgICAgbWFwcGVkUmVjb3JkLFxuICAgICAgICBpbmRleE5vZGU6IG4uaW5kZXhOb2RlLFxuICAgICAgICBpbmRleERpcjogbi5pbmRleERpcixcbiAgICAgICAgaW5kZXhTaGFyZEtleTogZ2V0SW5kZXhlZERhdGFLZXkoXG4gICAgICAgICAgbi5pbmRleE5vZGUsXG4gICAgICAgICAgbi5pbmRleERpcixcbiAgICAgICAgICBtYXBwZWRSZWNvcmQucmVzdWx0LFxuICAgICAgICApLFxuICAgICAgfSk7XG4gICAgfSksXG4gICAgZmlsdGVyKG4gPT4gbi5tYXBwZWRSZWNvcmQucGFzc2VkRmlsdGVyKSxcbiAgXSk7XG5cbiAgY29uc3QgYWxsVG9BcHBseSA9IFtdO1xuXG4gIGZvciAoY29uc3QgdCBvZiBjcmVhdGVUcmFuc2FjdGlvbnMpIHtcbiAgICBjb25zdCBhbmNlc3RvcklkeHMgPSBnZXRSZWxldmFudEFuY2VzdG9ySW5kZXhlcyhoaWVyYXJjaHksIHQucmVjb3JkKTtcbiAgICBjb25zdCByZXZlcnNlUmVmID0gZ2V0UmVsZXZhbnRSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyhoaWVyYXJjaHksIHQucmVjb3JkKTtcblxuICAgIGFsbFRvQXBwbHkucHVzaChcbiAgICAgIGdldEluZGV4Tm9kZXNUb0FwcGx5KHQsIGFuY2VzdG9ySWR4cyksXG4gICAgKTtcbiAgICBhbGxUb0FwcGx5LnB1c2goXG4gICAgICBnZXRJbmRleE5vZGVzVG9BcHBseSh0LCByZXZlcnNlUmVmKSxcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIGZsYXR0ZW4oYWxsVG9BcHBseSk7XG59O1xuXG5jb25zdCBnZXREZWxldGVUcmFuc2FjdGlvbnNCeVNoYXJkID0gZ2V0X0NyZWF0ZV9EZWxldGVfVHJhbnNhY3Rpb25zQnlTaGFyZChpc0RlbGV0ZSk7XG5cbmNvbnN0IGdldENyZWF0ZVRyYW5zYWN0aW9uc0J5U2hhcmQgPSBnZXRfQ3JlYXRlX0RlbGV0ZV9UcmFuc2FjdGlvbnNCeVNoYXJkKGlzQ3JlYXRlKTtcblxuY29uc3QgZGlmZlJldmVyc2VSZWZGb3JVcGRhdGUgPSAoYXBwSGllcmFyY2h5LCBvbGRSZWNvcmQsIG5ld1JlY29yZCkgPT4ge1xuICBjb25zdCBvbGRJbmRleGVzID0gZ2V0UmVsZXZhbnRSZXZlcnNlUmVmZXJlbmNlSW5kZXhlcyhcbiAgICBhcHBIaWVyYXJjaHksIG9sZFJlY29yZCxcbiAgKTtcbiAgY29uc3QgbmV3SW5kZXhlcyA9IGdldFJlbGV2YW50UmV2ZXJzZVJlZmVyZW5jZUluZGV4ZXMoXG4gICAgYXBwSGllcmFyY2h5LCBuZXdSZWNvcmQsXG4gICk7XG5cbiAgY29uc3QgdW5SZWZlcmVuY2VkID0gZGlmZmVyZW5jZUJ5KFxuICAgIGkgPT4gaS5pbmRleERpcixcbiAgICBvbGRJbmRleGVzLCBuZXdJbmRleGVzLFxuICApO1xuXG4gIGNvbnN0IG5ld2x5UmVmZXJlbmNlZCA9IGRpZmZlcmVuY2VCeShcbiAgICBpID0+IGkuaW5kZXhEaXIsXG4gICAgbmV3SW5kZXhlcywgb2xkSW5kZXhlcyxcbiAgKTtcblxuICBjb25zdCBub3RDaGFuZ2VkID0gaW50ZXJzZWN0aW9uQnkoXG4gICAgaSA9PiBpLmluZGV4RGlyLFxuICAgIG5ld0luZGV4ZXMsIG9sZEluZGV4ZXMsXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICB1blJlZmVyZW5jZWQsXG4gICAgbmV3bHlSZWZlcmVuY2VkLFxuICAgIG5vdENoYW5nZWQsXG4gIH07XG59O1xuIiwiaW1wb3J0IHsgbWFwIH0gZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCB7IHJldHJpZXZlIH0gZnJvbSAnLi9yZXRyaWV2ZSc7XG5pbXBvcnQgeyBleGVjdXRlVHJhbnNhY3Rpb25zIH0gZnJvbSAnLi9leGVjdXRlJztcbmltcG9ydCB7XG4gICQsIGpvaW5LZXksIGdldExvY2ssIGlzTm9sb2NrLCByZWxlYXNlTG9jayxcbn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7XG4gIExPQ0tfRklMRV9LRVksIFRSQU5TQUNUSU9OU19GT0xERVIsXG4gIHRpbWVvdXRNaWxsaXNlY29uZHMsIGdldFRyYW5zYWN0aW9uSWQsXG4gIG1heExvY2tSZXRyaWVzLFxufSBmcm9tICcuL3RyYW5zYWN0aW9uc0NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBjbGVhbnVwID0gYXN5bmMgKGFwcCkgPT4ge1xuICBjb25zdCBsb2NrID0gYXdhaXQgZ2V0VHJhbnNhY3Rpb25Mb2NrKGFwcCk7XG4gIGlmIChpc05vbG9jayhsb2NrKSkgcmV0dXJuO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgdHJhbnNhY3Rpb25zID0gYXdhaXQgcmV0cmlldmUoYXBwKTtcbiAgICBpZiAodHJhbnNhY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IGV4ZWN1dGVUcmFuc2FjdGlvbnMoYXBwKSh0cmFuc2FjdGlvbnMpO1xuXG4gICAgICBjb25zdCBmb2xkZXIgPSB0cmFuc2FjdGlvbnMuZm9sZGVyS2V5XG4gICAgICAgID8gdHJhbnNhY3Rpb25zLmZvbGRlcktleVxuICAgICAgICA6IFRSQU5TQUNUSU9OU19GT0xERVI7XG5cbiAgICAgIGNvbnN0IGRlbGV0ZUZpbGVzID0gJCh0cmFuc2FjdGlvbnMsIFtcbiAgICAgICAgbWFwKHQgPT4gam9pbktleShcbiAgICAgICAgICBmb2xkZXIsXG4gICAgICAgICAgZ2V0VHJhbnNhY3Rpb25JZChcbiAgICAgICAgICAgIHQucmVjb3JkSWQsIHQudHJhbnNhY3Rpb25UeXBlLFxuICAgICAgICAgICAgdC51bmlxdWVJZCxcbiAgICAgICAgICApLFxuICAgICAgICApKSxcbiAgICAgICAgbWFwKGFwcC5kYXRhc3RvcmUuZGVsZXRlRmlsZSksXG4gICAgICBdKTtcblxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoZGVsZXRlRmlsZXMpO1xuICAgIH1cbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCByZWxlYXNlTG9jayhhcHAsIGxvY2spO1xuICB9XG59O1xuXG5jb25zdCBnZXRUcmFuc2FjdGlvbkxvY2sgPSBhc3luYyBhcHAgPT4gYXdhaXQgZ2V0TG9jayhcbiAgYXBwLCBMT0NLX0ZJTEVfS0VZLFxuICB0aW1lb3V0TWlsbGlzZWNvbmRzLCBtYXhMb2NrUmV0cmllcyxcbik7XG4iLCJpbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHsgY29uZmlnRm9sZGVyLCBhcHBEZWZpbml0aW9uRmlsZSwgJCB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBUUkFOU0FDVElPTlNfRk9MREVSIH0gZnJvbSAnLi4vdHJhbnNhY3Rpb25zL3RyYW5zYWN0aW9uc0NvbW1vbic7XG5pbXBvcnQgeyBBVVRIX0ZPTERFUiwgVVNFUlNfTElTVF9GSUxFLCBBQ0NFU1NfTEVWRUxTX0ZJTEUgfSBmcm9tICcuLi9hdXRoQXBpL2F1dGhDb21tb24nO1xuaW1wb3J0IHsgaW5pdGlhbGlzZVJvb3RDb2xsZWN0aW9ucyB9IGZyb20gJy4uL2NvbGxlY3Rpb25BcGkvaW5pdGlhbGlzZSc7XG5pbXBvcnQgeyBpbml0aWFsaXNlSW5kZXggfSBmcm9tICcuLi9pbmRleGluZy9pbml0aWFsaXNlSW5kZXgnO1xuaW1wb3J0IHsgZ2V0RmxhdHRlbmVkSGllcmFyY2h5LCBpc0dsb2JhbEluZGV4LCBpc1NpbmdsZVJlY29yZCB9IGZyb20gJy4uL3RlbXBsYXRlQXBpL2hpZXJhcmNoeSc7XG5pbXBvcnQgeyBfZ2V0TmV3IH0gZnJvbSBcIi4uL3JlY29yZEFwaS9nZXROZXdcIjtcbmltcG9ydCB7IF9zYXZlIH0gZnJvbSBcIi4uL3JlY29yZEFwaS9zYXZlXCI7XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlRGF0YSA9IGFzeW5jIChkYXRhc3RvcmUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbiwgYWNjZXNzTGV2ZWxzKSA9PiB7XG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoY29uZmlnRm9sZGVyKTtcbiAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUpzb24oYXBwRGVmaW5pdGlvbkZpbGUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbik7XG5cbiAgYXdhaXQgaW5pdGlhbGlzZVJvb3RDb2xsZWN0aW9ucyhkYXRhc3RvcmUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbi5oaWVyYXJjaHkpO1xuICBhd2FpdCBpbml0aWFsaXNlUm9vdEluZGV4ZXMoZGF0YXN0b3JlLCBhcHBsaWNhdGlvbkRlZmluaXRpb24uaGllcmFyY2h5KTtcblxuICBhd2FpdCBkYXRhc3RvcmUuY3JlYXRlRm9sZGVyKFRSQU5TQUNUSU9OU19GT0xERVIpO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVGb2xkZXIoQVVUSF9GT0xERVIpO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKFVTRVJTX0xJU1RfRklMRSwgW10pO1xuXG4gIGF3YWl0IGRhdGFzdG9yZS5jcmVhdGVKc29uKFxuICAgIEFDQ0VTU19MRVZFTFNfRklMRSwgXG4gICAgYWNjZXNzTGV2ZWxzID8gYWNjZXNzTGV2ZWxzIDogeyB2ZXJzaW9uOiAwLCBsZXZlbHM6IFtdIH0pO1xuXG4gIGF3YWl0IGluaXRpYWxpc2VSb290U2luZ2xlUmVjb3JkcyhkYXRhc3RvcmUsIGFwcGxpY2F0aW9uRGVmaW5pdGlvbi5oaWVyYXJjaHkpO1xufTtcblxuY29uc3QgaW5pdGlhbGlzZVJvb3RJbmRleGVzID0gYXN5bmMgKGRhdGFzdG9yZSwgaGllcmFyY2h5KSA9PiB7XG4gIGNvbnN0IGZsYXRoaWVyYXJjaHkgPSBnZXRGbGF0dGVuZWRIaWVyYXJjaHkoaGllcmFyY2h5KTtcbiAgY29uc3QgZ2xvYmFsSW5kZXhlcyA9ICQoZmxhdGhpZXJhcmNoeSwgW1xuICAgIGZpbHRlcihpc0dsb2JhbEluZGV4KSxcbiAgXSk7XG5cbiAgZm9yIChjb25zdCBpbmRleCBvZiBnbG9iYWxJbmRleGVzKSB7XG4gICAgaWYgKCFhd2FpdCBkYXRhc3RvcmUuZXhpc3RzKGluZGV4Lm5vZGVLZXkoKSkpIHsgXG4gICAgICBhd2FpdCBpbml0aWFsaXNlSW5kZXgoZGF0YXN0b3JlLCAnJywgaW5kZXgpOyBcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IGluaXRpYWxpc2VSb290U2luZ2xlUmVjb3JkcyA9IGFzeW5jIChkYXRhc3RvcmUsIGhpZXJhcmNoeSkgPT4ge1xuICBjb25zdCBhcHAgPSB7IFxuICAgIHB1Ymxpc2g6KCk9Pnt9LFxuICAgIGNsZWFudXBUcmFuc2FjdGlvbnM6ICgpID0+IHt9LFxuICAgIGRhdGFzdG9yZSwgaGllcmFyY2h5IFxuICB9O1xuXG4gIGNvbnN0IGZsYXRoaWVyYXJjaHkgPSBnZXRGbGF0dGVuZWRIaWVyYXJjaHkoaGllcmFyY2h5KTtcbiAgY29uc3Qgc2luZ2xlUmVjb3JkcyA9ICQoZmxhdGhpZXJhcmNoeSwgW1xuICAgIGZpbHRlcihpc1NpbmdsZVJlY29yZCksXG4gIF0pO1xuXG4gIGZvciAobGV0IHJlY29yZCBvZiBzaW5nbGVSZWNvcmRzKSB7XG4gICAgYXdhaXQgZGF0YXN0b3JlLmNyZWF0ZUZvbGRlcihyZWNvcmQubm9kZUtleSgpKTtcbiAgICBjb25zdCByZXN1bHQgPSBfZ2V0TmV3KHJlY29yZCwgXCJcIik7XG4gICAgYXdhaXQgX3NhdmUoYXBwLHJlc3VsdCk7XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBpc05vdGhpbmcgfSBmcm9tICcuLi9jb21tb24nO1xuXG5leHBvcnQgY29uc3QgZ2V0RGF0YWJhc2VNYW5hZ2VyID0gZGF0YWJhc2VNYW5hZ2VyID0+ICh7XG4gIGNyZWF0ZUVtcHR5TWFzdGVyRGI6IGNyZWF0ZUVtcHR5TWFzdGVyRGIoZGF0YWJhc2VNYW5hZ2VyKSxcbiAgY3JlYXRlRW1wdHlJbnN0YW5jZURiOiBjcmVhdGVFbXB0eUluc3RhbmNlRGIoZGF0YWJhc2VNYW5hZ2VyKSxcbiAgZ2V0SW5zdGFuY2VEYlJvb3RDb25maWc6IGRhdGFiYXNlTWFuYWdlci5nZXRJbnN0YW5jZURiUm9vdENvbmZpZyxcbiAgbWFzdGVyRGF0YXN0b3JlQ29uZmlnOiBnZXRNYXN0ZXJEYXRhc3RvcmVDb25maWcoZGF0YWJhc2VNYW5hZ2VyKSxcbiAgZ2V0SW5zdGFuY2VEYXRhc3RvcmVDb25maWc6IGdldEluc3RhbmNlRGF0YXN0b3JlQ29uZmlnKGRhdGFiYXNlTWFuYWdlciksXG59KTtcblxuY29uc3QgZ2V0TWFzdGVyRGF0YXN0b3JlQ29uZmlnID0gZGF0YWJhc2VNYW5hZ2VyID0+IGRhdGFiYXNlTWFuYWdlci5nZXREYXRhc3RvcmVDb25maWcoJ21hc3RlcicpO1xuXG5jb25zdCBnZXRJbnN0YW5jZURhdGFzdG9yZUNvbmZpZyA9IGRhdGFiYXNlTWFuYWdlciA9PiAoYXBwbGljYXRpb25JZCwgaW5zdGFuY2VJZCkgPT4gZGF0YWJhc2VNYW5hZ2VyLmdldERhdGFzdG9yZUNvbmZpZyhcbiAgYXBwbGljYXRpb25JZCwgaW5zdGFuY2VJZCxcbik7XG5cbmNvbnN0IGNyZWF0ZUVtcHR5TWFzdGVyRGIgPSBkYXRhYmFzZU1hbmFnZXIgPT4gYXN5bmMgKCkgPT4gYXdhaXQgZGF0YWJhc2VNYW5hZ2VyLmNyZWF0ZUVtcHR5RGIoJ21hc3RlcicpO1xuXG5jb25zdCBjcmVhdGVFbXB0eUluc3RhbmNlRGIgPSBkYXRhYmFzZU1hbmFnZXIgPT4gYXN5bmMgKGFwcGxpY2F0aW9uSWQsIGluc3RhbmNlSWQpID0+IHtcbiAgaWYgKGlzTm90aGluZyhhcHBsaWNhdGlvbklkKSkgeyB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0ZURiOiBhcHBsaWNhdGlvbiBpZCBub3Qgc3VwcGxpZWQnKTsgfVxuICBpZiAoaXNOb3RoaW5nKGluc3RhbmNlSWQpKSB7IHRocm93IG5ldyBFcnJvcignQ3JlYXRlRGI6IGluc3RhbmNlIGlkIG5vdCBzdXBwbGllZCcpOyB9XG5cbiAgcmV0dXJuIGF3YWl0IGRhdGFiYXNlTWFuYWdlci5jcmVhdGVFbXB0eURiKFxuICAgIGFwcGxpY2F0aW9uSWQsXG4gICAgaW5zdGFuY2VJZCxcbiAgKTtcbn07XG4iLCJpbXBvcnQgZ2V0UmVjb3JkQXBpIGZyb20gXCIuL3JlY29yZEFwaVwiO1xuaW1wb3J0IGdldENvbGxlY3Rpb25BcGkgZnJvbSBcIi4vY29sbGVjdGlvbkFwaVwiO1xuaW1wb3J0IGdldEluZGV4QXBpIGZyb20gXCIuL2luZGV4QXBpXCI7XG5pbXBvcnQgZ2V0VGVtcGxhdGVBcGkgZnJvbSBcIi4vdGVtcGxhdGVBcGlcIjtcbmltcG9ydCBnZXRBdXRoQXBpIGZyb20gXCIuL2F1dGhBcGlcIjtcbmltcG9ydCBnZXRBY3Rpb25zQXBpIGZyb20gXCIuL2FjdGlvbnNBcGlcIjtcbmltcG9ydCB7c2V0dXBEYXRhc3RvcmUsIGNyZWF0ZUV2ZW50QWdncmVnYXRvcn0gZnJvbSBcIi4vYXBwSW5pdGlhbGlzZVwiO1xuaW1wb3J0IHtpbml0aWFsaXNlQWN0aW9uc30gZnJvbSBcIi4vYWN0aW9uc0FwaS9pbml0aWFsaXNlXCJcbmltcG9ydCB7aXNTb21ldGhpbmd9IGZyb20gXCIuL2NvbW1vblwiO1xuaW1wb3J0IHtjbGVhbnVwfSBmcm9tIFwiLi90cmFuc2FjdGlvbnMvY2xlYW51cFwiO1xuaW1wb3J0IHtnZW5lcmF0ZUZ1bGxQZXJtaXNzaW9uc30gZnJvbSBcIi4vYXV0aEFwaS9nZW5lcmF0ZUZ1bGxQZXJtaXNzaW9uc1wiO1xuaW1wb3J0IHtnZXRBcHBsaWNhdGlvbkRlZmluaXRpb259IGZyb20gXCIuL3RlbXBsYXRlQXBpL2dldEFwcGxpY2F0aW9uRGVmaW5pdGlvblwiO1xuaW1wb3J0IGNvbW1vbiBmcm9tIFwiLi9jb21tb25cIjtcbmltcG9ydCB7Z2V0QmVoYXZpb3VyU291cmNlc30gZnJvbSBcIi4vdGVtcGxhdGVBcGkvZ2V0QmVoYXZpb3VyU291cmNlc1wiO1xuaW1wb3J0IGhpZXJhcmNoeSBmcm9tIFwiLi90ZW1wbGF0ZUFwaS9oaWVyYXJjaHlcIjtcblxuZXhwb3J0IGNvbnN0IGdldEFwcEFwaXMgPSBhc3luYyAoc3RvcmUsIGJlaGF2aW91clNvdXJjZXMgPSBudWxsLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYW51cFRyYW5zYWN0aW9ucyA9IG51bGwsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFcG9jaFRpbWUgPSBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcnlwdG8gPSBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBEZWZpbml0aW9uID0gbnVsbCkgPT4ge1xuXG4gICAgc3RvcmUgPSBzZXR1cERhdGFzdG9yZShzdG9yZSk7XG5cbiAgICBpZighYXBwRGVmaW5pdGlvbilcbiAgICAgICAgYXBwRGVmaW5pdGlvbiA9IGF3YWl0IGdldEFwcGxpY2F0aW9uRGVmaW5pdGlvbihzdG9yZSkoKTtcblxuICAgIGlmKCFiZWhhdmlvdXJTb3VyY2VzKVxuICAgICAgICBiZWhhdmlvdXJTb3VyY2VzID0gYXdhaXQgZ2V0QmVoYXZpb3VyU291cmNlcyhzdG9yZSk7XG5cbiAgICBjb25zdCBldmVudEFnZ3JlZ2F0b3IgPSBjcmVhdGVFdmVudEFnZ3JlZ2F0b3IoKTtcblxuICAgIGNvbnN0IGFwcCA9IHtcbiAgICAgICAgZGF0YXN0b3JlOnN0b3JlLFxuICAgICAgICBjcnlwdG8sXG4gICAgICAgIHB1Ymxpc2g6ZXZlbnRBZ2dyZWdhdG9yLnB1Ymxpc2gsXG4gICAgICAgIGhpZXJhcmNoeTphcHBEZWZpbml0aW9uLmhpZXJhcmNoeSxcbiAgICAgICAgYWN0aW9uczphcHBEZWZpbml0aW9uLmFjdGlvbnNcbiAgICB9O1xuXG4gICAgY29uc3QgdGVtcGxhdGVBcGkgPSBnZXRUZW1wbGF0ZUFwaShhcHApOyAgICBcblxuICAgIGFwcC5jbGVhbnVwVHJhbnNhY3Rpb25zID0gaXNTb21ldGhpbmcoY2xlYW51cFRyYW5zYWN0aW9ucykgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGNsZWFudXBUcmFuc2FjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogYXN5bmMgKCkgPT4gYXdhaXQgY2xlYW51cChhcHApO1xuXG4gICAgYXBwLmdldEVwb2NoVGltZSA9IGlzU29tZXRoaW5nKGdldEVwb2NoVGltZSlcbiAgICAgICAgICAgICAgICAgICAgICAgPyBnZXRFcG9jaFRpbWVcbiAgICAgICAgICAgICAgICAgICAgICAgOiBhc3luYyAoKSA9PiAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuXG4gICAgY29uc3QgcmVjb3JkQXBpID0gZ2V0UmVjb3JkQXBpKGFwcCk7XG4gICAgY29uc3QgY29sbGVjdGlvbkFwaSA9IGdldENvbGxlY3Rpb25BcGkoYXBwKTtcbiAgICBjb25zdCBpbmRleEFwaSA9IGdldEluZGV4QXBpKGFwcCk7XG4gICAgY29uc3QgYXV0aEFwaSA9IGdldEF1dGhBcGkoYXBwKTtcbiAgICBjb25zdCBhY3Rpb25zQXBpID0gZ2V0QWN0aW9uc0FwaShhcHApO1xuXG4gICAgY29uc3QgYXV0aGVudGljYXRlQXMgPSBhc3luYyAodXNlcm5hbWUsIHBhc3N3b3JkKSA9PiB7XG4gICAgICAgIGFwcC51c2VyID0gYXdhaXQgYXV0aEFwaS5hdXRoZW50aWNhdGUodXNlcm5hbWUsIHBhc3N3b3JkKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgd2l0aEZ1bGxBY2Nlc3MgPSAoKSA9PiBcbiAgICAgICAgdXNlcldpdGhGdWxsQWNjZXNzKGFwcCk7ICAgIFxuXG4gICAgY29uc3QgYXNVc2VyID0gKHVzZXIpID0+IHtcbiAgICAgICAgYXBwLnVzZXIgPSB1c2VyXG4gICAgfTsgICAgXG5cbiAgICBsZXQgYXBpcyA9IHtcbiAgICAgICAgcmVjb3JkQXBpLCBcbiAgICAgICAgdGVtcGxhdGVBcGksXG4gICAgICAgIGNvbGxlY3Rpb25BcGksXG4gICAgICAgIGluZGV4QXBpLFxuICAgICAgICBhdXRoQXBpLFxuICAgICAgICBhY3Rpb25zQXBpLFxuICAgICAgICBzdWJzY3JpYmU6IGV2ZW50QWdncmVnYXRvci5zdWJzY3JpYmUsXG4gICAgICAgIGF1dGhlbnRpY2F0ZUFzLFxuICAgICAgICB3aXRoRnVsbEFjY2VzcyxcbiAgICAgICAgYXNVc2VyXG4gICAgfTtcblxuICAgIGFwaXMuYWN0aW9ucyA9IGluaXRpYWxpc2VBY3Rpb25zKFxuICAgICAgICBldmVudEFnZ3JlZ2F0b3Iuc3Vic2NyaWJlLFxuICAgICAgICBiZWhhdmlvdXJTb3VyY2VzLFxuICAgICAgICBhcHBEZWZpbml0aW9uLmFjdGlvbnMsXG4gICAgICAgIGFwcERlZmluaXRpb24udHJpZ2dlcnMsXG4gICAgICAgIGFwaXMpO1xuXG5cbiAgICByZXR1cm4gYXBpcztcbn07XG5cbmV4cG9ydCBjb25zdCB1c2VyV2l0aEZ1bGxBY2Nlc3MgPSAoYXBwKSA9PiB7XG4gICAgYXBwLnVzZXIgPSB7XG4gICAgICAgIG5hbWU6IFwiYXBwXCIsXG4gICAgICAgIHBlcm1pc3Npb25zIDogZ2VuZXJhdGVGdWxsUGVybWlzc2lvbnMoYXBwKSxcbiAgICAgICAgaXNVc2VyOmZhbHNlLFxuICAgICAgICB0ZW1wOmZhbHNlXG4gICAgfVxuICAgIHJldHVybiBhcHAudXNlcjtcbn07XG5cbmV4cG9ydCB7ZXZlbnRzLCBldmVudHNMaXN0fSBmcm9tIFwiLi9jb21tb24vZXZlbnRzXCI7XG5leHBvcnQge2dldFRlbXBsYXRlQXBpfSBmcm9tIFwiLi90ZW1wbGF0ZUFwaVwiO1xuZXhwb3J0IHtnZXRSZWNvcmRBcGl9IGZyb20gXCIuL3JlY29yZEFwaVwiO1xuZXhwb3J0IHtnZXRDb2xsZWN0aW9uQXBpfSBmcm9tIFwiLi9jb2xsZWN0aW9uQXBpXCI7XG5leHBvcnQge2dldEF1dGhBcGl9IGZyb20gXCIuL2F1dGhBcGlcIjtcbmV4cG9ydCB7Z2V0SW5kZXhBcGl9IGZyb20gXCIuL2luZGV4QXBpXCI7XG5leHBvcnQge3NldHVwRGF0YXN0b3JlfSBmcm9tIFwiLi9hcHBJbml0aWFsaXNlXCI7XG5leHBvcnQge2dldEFjdGlvbnNBcGl9IGZyb20gXCIuL2FjdGlvbnNBcGlcIjtcbmV4cG9ydCB7aW5pdGlhbGlzZURhdGF9IGZyb20gXCIuL2FwcEluaXRpYWxpc2UvaW5pdGlhbGlzZURhdGFcIjtcbmV4cG9ydCB7Z2V0RGF0YWJhc2VNYW5hZ2VyfSBmcm9tIFwiLi9hcHBJbml0aWFsaXNlL2RhdGFiYXNlTWFuYWdlclwiO1xuZXhwb3J0IHtoaWVyYXJjaHl9O1xuZXhwb3J0IHtjb21tb259O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRBcHBBcGlzOyJdLCJuYW1lcyI6WyJ1bmlvbiIsInJlZHVjZSIsImdlbmVyYXRlIiwiaXNVbmRlZmluZWQiLCJjbG9uZURlZXAiLCJzcGxpdCIsImZsb3ciLCJ0cmltIiwicmVwbGFjZSIsImlzQXJyYXkiLCJmaWx0ZXIiLCJpc051bGwiLCJqb2luIiwiZHJvcFJpZ2h0IiwidGFrZVJpZ2h0IiwiaGVhZCIsImlzTmFOIiwiaXNFbXB0eSIsImNvbnN0YW50Iiwic29tZSIsImlzU3RyaW5nIiwidGFpbCIsImluY2x1ZGVzIiwic3RhcnRzV2l0aCIsImZpbmRJbmRleCIsImlzSW50ZWdlciIsImlzRGF0ZSIsInRvTnVtYmVyIiwibWFwIiwiY29tcGlsZUV4cHJlc3Npb24iLCJjb21waWxlQ29kZSIsImtleXMiLCJpc0Z1bmN0aW9uIiwiY291bnRCeSIsImxhc3QiLCJmaW5kIiwidGFrZSIsImZpcnN0IiwiaW50ZXJzZWN0aW9uIiwiaGFzIiwibWVyZ2UiLCJtYXBWYWx1ZXMiLCJtYWtlcnVsZSIsImlzQm9vbGVhbiIsIm9wdGlvbnMiLCJ0eXBlQ29uc3RyYWludHMiLCJpc051bWJlciIsImlzT2JqZWN0TGlrZSIsImFzc2lnbiIsImFsbCIsImdldERlZmF1bHRPcHRpb25zIiwidmFsaWRhdGVUeXBlQ29uc3RyYWludHMiLCJpc09iamVjdCIsImNsb25lIiwidmFsdWVzIiwia2V5QnkiLCJvcmRlckJ5IiwiZmxhdHRlbiIsImNvbmNhdCIsInJldmVyc2UiLCJnbG9iYWwiLCJiYXNlNjQuZnJvbUJ5dGVBcnJheSIsImllZWU3NTQucmVhZCIsImllZWU3NTQud3JpdGUiLCJiYXNlNjQudG9CeXRlQXJyYXkiLCJyZWFkIiwiZGlmZmVyZW5jZSIsIkJ1ZmZlciIsInJlYWRJbmRleCIsImVhY2giLCJfIiwiZGVsZXRlUmVjb3JkIiwidmFsaWRhdGUiLCJtYXgiLCJkZWZhdWx0Q2FzZSIsImV2ZXJ5IiwidW5pcUJ5IiwiYXBpIiwiY3JlYXRlVGVtcG9yYXJ5QWNjZXNzIiwiY3JlYXRlVXNlciIsInVuaXFXaXRoIiwic2V0VXNlckFjY2Vzc0xldmVscyIsImV4ZWN1dGVBY3Rpb24iLCJjQ29kZSIsImNFeHAiLCJncm91cEJ5IiwiaXNFcXVhbCIsInB1bGwiLCJkaWZmZXJlbmNlQnkiLCJpbnRlcnNlY3Rpb25CeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0VBRUEsTUFBTSxVQUFVLEdBQUcsS0FBSyxJQUFJQSxRQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7O0VBRS9FLE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztFQUVwQyxNQUFNLE9BQU8sR0FBRztFQUNoQixFQUFFLFNBQVMsRUFBRTtFQUNiLElBQUksSUFBSSxFQUFFLFVBQVUsQ0FBQztFQUNyQixNQUFNLFdBQVc7RUFDakIsTUFBTSxpQkFBaUI7RUFDdkIsTUFBTSxpQkFBaUIsQ0FBQyxDQUFDO0VBQ3pCLElBQUksTUFBTSxFQUFFLE1BQU0sRUFBRTtFQUNwQixJQUFJLFVBQVUsRUFBRSxNQUFNLEVBQUU7RUFDeEIsSUFBSSxNQUFNLEVBQUUsTUFBTSxFQUFFO0VBQ3BCLElBQUksSUFBSSxFQUFFLE1BQU0sRUFBRTtFQUNsQixJQUFJLFFBQVEsRUFBRSxNQUFNLEVBQUU7RUFDdEIsSUFBSSxVQUFVLEVBQUUsTUFBTSxFQUFFO0VBQ3hCLElBQUksWUFBWSxFQUFFLE1BQU0sRUFBRTtFQUMxQixHQUFHO0VBQ0gsRUFBRSxRQUFRLEVBQUU7RUFDWixJQUFJLFVBQVUsRUFBRSxNQUFNLEVBQUU7RUFDeEIsSUFBSSxTQUFTLEVBQUUsTUFBTSxFQUFFO0VBQ3ZCLElBQUksTUFB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QUcsR0FBRyxHQUFHLENBQUMsT0FBTTs7RUFFdEIsRUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0VBQ25CLElBQUksTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQztFQUNyRSxHQUFHOztFQUVIO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFLFlBQVksR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUM7O0VBRXhFO0VBQ0EsRUFBRSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxFQUFDOztFQUUzQztFQUNBLEVBQUUsQ0FBQyxHQUFHLFlBQVksR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFHOztFQUV0QyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUM7O0VBRVgsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtFQUM1QyxJQUFJLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQztFQUN0SyxJQUFJLEdBQUcsQ0FBQyxD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RztFQUNqQixHQUFHOztFQUVILEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUM7O0VBRXBCLEVBQUUsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztFQUN2QixDQUFDOztFQzVHTSxTQUFTLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0VBQzFELEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBQztFQUNWLEVBQUUsSUFBSSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBQztFQUNsQyxFQUFFLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFDO0VBQzVCLEVBQUUsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUM7RUFDdkIsRUFBRSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUM7RUFDaEIsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFDO0VBQ2pDLEVBQUUsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUM7RUFDdkIsRUFBRSxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBQzs7RUFFNUIsRUFBRSxDQUFDLElBQUksRUFBQzs7RUFFUixFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUM7RUFDL0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUM7RUFDaEIsRUFBRSxLQUFLLElBQUksS0FBSTtFQUNmLEVBQUUsT0FBTyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLEVBQUU7O0VBRTVFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBQztFQUMvQixFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBQztFQUNoQixFQUFFLEtBQUssSUFBSSxLQUFJO0VBQ2YsRUFBRSxPQUFPLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUUsRUFBRTs7RUFFNUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7RUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBSztFQUNqQixHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO0VBQ3pCLElBQUksT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxRQUFRLENBQUM7RUFDOUMsR0FBRyxNQUFNO0VBQ1QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBQztFQUM3QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBSztFQUNqQixHQUFHO0VBQ0gsRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztFQUNqRCxDQUFDOztBQUVELEVBQU8sU0FBUyxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7RUFDbEUsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBQztFQUNiLEVBQUUsSUFBSSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBQztFQUNsQyxFQUFFLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFDO0VBQzVCLEVBQUUsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUM7RUFDdkIsRUFBRSxJQUFJLEVBQUUsSUFBSSxJQUFJLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUM7RUFDbEUsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUM7RUFDakMsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBQztFQUN2QixFQUFFLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFDOztFQUU3RCxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBQzs7RUFFekIsRUFBRSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssUUFBUSxFQUFFO0VBQzFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBQztFQUM1QixJQUFJLENBQUMsR0FBRyxLQUFJO0VBQ1osR0FBRyxNQUFNO0VBQ1QsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUM7RUFDOUMsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENB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Q0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDbEQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUM7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7SUFDbEQsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDOUM7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUM7O0lBRWxELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDbkM7O0VBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUN2RSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FB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VyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7SUFDckUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDOztJQUVsRCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7T0FDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNyQjs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxTQUFTLFdBQVcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0lBQ3JFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztJQUNsRCxPQUFPQyxJQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvQzs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxTQUFTLFdBQVcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0lBQ3JFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztJQUNsRCxPQUFPQSxJQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNoRDs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxTQUFTLFlBQVksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0lBQ3ZFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztJQUNs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QyxDQUFDO1FBQ25FLENBQUMsWUFBWSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUM7S0FDakM7R0FDRjs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxTQUFTLGFBQWEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUNoRixLQUFLLEdBQUcsQ0FBQyxNQUFLO0lBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0lBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO0lBQzFELElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO01BQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxFQUFDO01BQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBQztLQUNqQyxNQUFNO01BQ0wsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO0tBQzdDO0lBQ0QsT0FBTyxNQUFNLEdBQUcsQ0FBQztJQUNsQjs7RUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxTQUFTLGFBQWEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUNoRixLQUFLLEdBQUcsQ0FBQyxNQUFLO0lBQ2QsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFDO0lBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO0lBQzFELElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO01BQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFDO01BQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcs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
