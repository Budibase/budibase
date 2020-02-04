import { tryAwaitOrIgnore, safeKey } from "../common"
import {
  isIndex,
  isShardedIndex,
  getExactNodeForKey,
} from "../templateApi/hierarchy"
import {
  getAllShardKeys,
  getShardMapKey,
  getUnshardedIndexDataKey,
} from "../indexing/sharding"
import { getIndexDir } from "./getIndexDir"

export const _deleteIndex = async (app, indexKey, includeFolder) => {
  indexKey = safeKey(indexKey)
  const indexNode = getExactNodeForKey(app.hierarchy)(indexKey)
  const indexDir = getIndexDir(app.hierarchy, indexKey)

  if (!isIndex(indexNode)) {
    throw new Error("Supplied key is not an index")
  }

  if (isShardedIndex(indexNode)) {
    const shardKeys = await getAllShardKeys(app, indexNode, indexDir)
    for (const k of shardKeys) {
      await tryAwaitOrIgnore(app.datastore.deleteFile(k))
    }
    tryAwaitOrIgnore(await app.datastore.deleteFile(getShardMapKey(indexDir)))
  } else {
    await tryAwaitOrIgnore(
      app.datastore.deleteFile(getUnshardedIndexDataKey(indexDir))
    )
  }

  if (includeFolder) {
    tryAwaitOrIgnore(await app.datastore.deleteFolder(indexDir))
  }
}
