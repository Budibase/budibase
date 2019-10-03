import {
  tryAwaitOrIgnore,
  safeKey
} from '../common';
import {
  isIndex, isShardedIndex,
  getExactNodeForPath,
} from '../templateApi/hierarchy';
import {
  getAllShardKeys, getShardMapKey,
  getUnshardedIndexDataKey,
} from '../indexing/sharding';

export const _deleteIndex = async (app, indexKey, includeFolder) => {
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
