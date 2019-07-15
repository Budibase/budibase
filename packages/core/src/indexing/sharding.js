import { compileCode } from '@nx-js/compiler-util';
import {
  filter, includes, map, last,
} from 'lodash/fp';
import {
  getActualKeyOfParent, isGlobalIndex,
  getParentKey, isShardedIndex,
  getExactNodeForPath,
} from '../templateApi/hierarchy';
import {
  joinKey, isNonEmptyString, splitKey, $,
} from '../common';

export const getIndexedDataKey = (indexNode, indexKey, record) => {
  const getShardName = (indexNode, record) => {
    const shardNameFunc = compileCode(indexNode.getShardName);
    try {
      return shardNameFunc({ record });
    } catch(e) {
      const errorDetails = `shardCode: ${indexNode.getShardName} :: record: ${JSON.stringify(record)} :: `
      e.message = "Error running index shardname func: " + errorDetails + e.message;
      throw e;
    }
  };

  const shardName = isNonEmptyString(indexNode.getShardName)
    ? `${getShardName(indexNode, record)}.csv`
    : 'index.csv';

  return joinKey(indexKey, shardName);
};

export const getShardKeysInRange = async (app, indexKey, startRecord = null, endRecord = null) => {
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

export const ensureShardNameIsInShardMap = async (store, indexKey, indexedDataKey) => {
  const map = await getShardMap(store, indexKey);
  const shardName = shardNameFromKey(indexedDataKey);
  if (!includes(shardName)(map)) {
    map.push(shardName);
    await writeShardMap(store, indexKey, map);
  }
};

export const getShardMap = async (datastore, indexKey) => {
  const shardMapKey = getShardMapKey(indexKey);
  try {
    return await datastore.loadJson(shardMapKey);
  } catch (_) {
    await datastore.createJson(shardMapKey, []);
    return [];
  }
};

export const writeShardMap = async (datastore, indexKey, shardMap) => await datastore.updateJson(
  getShardMapKey(indexKey),
  shardMap,
);

export const getAllShardKeys = async (app, indexKey) => await getShardKeysInRange(app, indexKey);

export const getShardMapKey = indexKey => joinKey(indexKey, 'shardMap.json');

export const getUnshardedIndexDataKey = indexKey => joinKey(indexKey, 'index.csv');

export const getIndexFolderKey = indexKey => indexKey;

export const createIndexFile = async (datastore, indexedDataKey, index) => {
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

export const shardNameFromKey = key => $(key, [
  splitKey,
  last,
]).replace('.csv', '');

export const getIndexKey_BasedOnDecendant = (decendantKey, indexNode) => {
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
