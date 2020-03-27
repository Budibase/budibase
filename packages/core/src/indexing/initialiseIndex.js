import { isShardedIndex } from "../templateApi/hierarchy"
import { joinKey } from "../common"
import {
  getShardMapKey,
  getUnshardedIndexDataKey,
  createIndexFile,
} from "./sharding"

export const initialiseIndex = async (datastore, dir, index) => {
  const indexDir = joinKey(dir, index.name)

  let newDir = false
  if (!(await datastore.exists(indexDir))) {
    await datastore.createFolder(indexDir)
    newDir = true
  }

  if (isShardedIndex(index)) {
    const shardFile = getShardMapKey(indexDir)
    if (newDir || !(await datastore.exists(shardFile)))
      await datastore.createFile(shardFile, "[]")
  } else {
    const indexFile = getUnshardedIndexDataKey(indexDir)
    if (newDir || !(await datastore.exists(indexFile)))
      await createIndexFile(datastore, indexFile, index)
  }
}
