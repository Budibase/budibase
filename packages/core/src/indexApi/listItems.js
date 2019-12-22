import { flatten, merge } from 'lodash/fp';
import {
  safeKey, apiWrapper, $,
  events, isNonEmptyString,
} from '../common';
import { readIndex, searchIndex } from '../indexing/read';
import {
  getUnshardedIndexDataKey,
  getShardKeysInRange,
} from '../indexing/sharding';
import {
  getExactNodeForKey, isIndex,
  isShardedIndex,
} from '../templateApi/hierarchy';
import { permission } from '../authApi/permissions';
import { getIndexDir } from "./getIndexDir";

export const listItems = app => async (indexKey, options) => {
  indexKey = safeKey(indexKey);
  return apiWrapper(
    app,
    events.indexApi.listItems,
    permission.readIndex.isAuthorized(indexKey),
    { indexKey, options },
    _listItems, app, indexKey, options,
  );
}

const defaultOptions = { rangeStartParams: null, rangeEndParams: null, searchPhrase: null };

const _listItems = async (app, indexKey, options = defaultOptions) => {
  const { searchPhrase, rangeStartParams, rangeEndParams } = $({}, [
    merge(options),
    merge(defaultOptions),
  ]);

  const getItems = async indexedDataKey => (isNonEmptyString(searchPhrase)
    ? await searchIndex(
      app.hierarchy,
      app.datastore,
      indexNode,
      indexedDataKey,
      searchPhrase,
    )
    : await readIndex(
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
    return flatten(items);
  }
  return await getItems(
    getUnshardedIndexDataKey(indexDir),
  );
};
