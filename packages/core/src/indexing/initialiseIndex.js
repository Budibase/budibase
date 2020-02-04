import { isShardedIndex } from "../templateApi/hierarchy"
import { joinKey } from "../common"
import {
  getShardMapKey,
  getUnshardedIndexDataKey,
  createIndexFile,
} from "./sharding"

export const initialiseIndex = async (datastore, dir, index) => {
  const indexDir = joinKey(dir, index.name)

  await datastore.createFolder(indexDir)

  if (isShardedIndex(index)) {
    await datastore.createFile(getShardMapKey(indexDir), "[]")
  } else {
    await createIndexFile(datastore, getUnshardedIndexDataKey(indexDir), index)
  }
}
