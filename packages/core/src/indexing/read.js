import lunr from "lunr"
import { promiseReadableStream } from "./promiseReadableStream"
import { createIndexFile } from "./sharding"
import { generateSchema } from "./indexSchemaCreator"
import { getIndexReader, CONTINUE_READING_RECORDS } from "./serializer"
import {
  getAllowedRecordNodesForIndex,
  getRecordNodeId,
} from "../templateApi/hierarchy"
import { $ } from "../common"
import { filter, includes, find } from "lodash/fp"

export const readIndex = async (
  hierarchy,
  datastore,
  index,
  indexedDataKey
) => {
  const records = []
  const getType = typeLoader(index, hierarchy)
  const doRead = iterateIndex(
    async item => {
      item.type = getType(item.key)
      records.push(item)
      return CONTINUE_READING_RECORDS
    },
    async () => records
  )

  return await doRead(hierarchy, datastore, index, indexedDataKey)
}

export const searchIndex = async (
  hierarchy,
  datastore,
  index,
  indexedDataKey,
  searchPhrase
) => {
  const records = []
  const schema = generateSchema(hierarchy, index)
  const getType = typeLoader(index, hierarchy)
  const doRead = iterateIndex(
    async item => {
      item.type = getType(item.key)
      const idx = lunr(function() {
        this.ref("key")
        for (const field of schema) {
          this.field(field.name)
        }
        this.add(item)
      })
      const searchResults = idx.search(searchPhrase)
      if (searchResults.length === 1) {
        item._searchResult = searchResults[0]
        records.push(item)
      }
      return CONTINUE_READING_RECORDS
    },
    async () => records
  )

  return await doRead(hierarchy, datastore, index, indexedDataKey)
}

export const iterateIndex = (onGetItem, getFinalResult) => async (
  hierarchy,
  datastore,
  index,
  indexedDataKey
) => {
  try {
    const readableStream = promiseReadableStream(
      await datastore.readableFileStream(indexedDataKey)
    )

    const read = getIndexReader(hierarchy, index, readableStream)
    await read(onGetItem)
    return getFinalResult()
  } catch (e) {
    if (await datastore.exists(indexedDataKey)) {
      throw e
    } else {
      await createIndexFile(datastore, indexedDataKey, index)
    }
    return []
  }
}

const typeLoader = (index, hierarchy) => {
  const allowedNodes = getAllowedRecordNodesForIndex(hierarchy, index)
  return key => find(n => getRecordNodeId(key) === n.nodeId)(allowedNodes).name
}
