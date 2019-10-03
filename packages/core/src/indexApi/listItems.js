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
  getExactNodeForPath, isIndex,
  isShardedIndex,
} from '../templateApi/hierarchy';
import { permission } from '../authApi/permissions';

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

  const getItems = async key => (isNonEmptyString(searchPhrase)
    ? await searchIndex(
      app.hierarchy,
      app.datastore,
      indexNode,
      key,
      searchPhrase,
    )
    : await readIndex(
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
