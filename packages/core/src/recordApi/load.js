import { keyBy, mapValues, filter, map, includes, last } from "lodash/fp"
import { getNode, getExactNodeForKey } from "../templateApi/hierarchy"
import { safeParseField } from "../types"
import {
  $,
  splitKey,
  safeKey,
  isNonEmptyString,
  apiWrapper,
  events,
  joinKey,
} from "../common"
import { mapRecord } from "../indexing/evaluate"
import { permission } from "../authApi/permissions"

export const _loadFromInfo = () => {};
 
export const getRecordFileName = key => joinKey(key, "record.json")

export const load = app => async key => {
  key = safeKey(key)
  return apiWrapper(
    app,
    events.recordApi.load,
    permission.readRecord.isAuthorized(key),
    { key },
    _load,
    app,
    key
  )
}

export const _load = async (app, key, keyStack = []) => {
  const recordNode = getExactNodeForKey(app.hierarchy)(key)
  const storedData = await app.datastore.loadJson(key)

  const loadedRecord = $(recordNode.fields, [
    keyBy("name"),
    mapValues(f => safeParseField(f, storedData)),
  ])

  const newKeyStack = [...keyStack, key]

  const references = $(recordNode.fields, [
    filter(
      f =>
        f.type === "reference" &&
        isNonEmptyString(loadedRecord[f.name].key) &&
        !includes(loadedRecord[f.name].key)(newKeyStack)
    ),
    map(f => ({
      promise: _load(app, loadedRecord[f.name].key, newKeyStack),
      index: getNode(app.hierarchy, f.typeOptions.indexNodeKey),
      field: f,
    })),
  ])

  if (references.length > 0) {
    const refRecords = await Promise.all(map(p => p.promise)(references))

    for (const ref of references) {
      loadedRecord[ref.field.name] = mapRecord(
        refRecords[references.indexOf(ref)],
        ref.index
      )
    }
  }

  loadedRecord._rev = storedData._rev
  loadedRecord._id = storedData._id
  loadedRecord.key = key
  loadedRecord.id = $(key, [splitKey, last])
  loadedRecord.type = recordNode.name
  return loadedRecord
}

export default load
