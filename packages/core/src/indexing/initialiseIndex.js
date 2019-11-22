import { isShardedIndex } from '../templateApi/hierarchy';
import { joinKey } from '../common';
import { getShardMapKey, getUnshardedIndexDataKey, createIndexFile } from './sharding';

export const initialiseIndex = async (datastore, dir, index) => {
  const indexKey = joinKey(dir, index.name);

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
