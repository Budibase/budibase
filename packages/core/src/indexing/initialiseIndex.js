import { isShardedIndex } from '../templateApi/hierarchy';
import { joinKey } from '../common';
import { getShardMapKey, getUnshardedIndexDataKey, createIndexFile } from './sharding';

export const initialiseIndex = async (datastore, parentKey, index) => {
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
