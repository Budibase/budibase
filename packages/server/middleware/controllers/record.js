const couchdb = require("../../db")
const { cloneDeep, mapValues, keyBy, filter, includes } = require("lodash/fp")
const {
  validateRecord,
} = require("../../../common/src/records/validateRecord.mjs")
const { events } = require("../../../common/src/common/events.mjs")
const { $, isNonEmptyString } = require("../../../common/src/common")
import { safeParseField } from "../../../common/src/schema/types"

async function save(ctx) {
  const db = couchdb.use(ctx.databaseId)
  const record = cloneDeep(ctx.body)

  if (!ctx.schema.findModel(record._modelId)) {
    ctx.status = 400
    ctx.message = `do not recognise modelId : ${record._modelId}`
    return
  }

  const validationResult = await validateRecord(ctx.schema, record)
  if (!validationResult.isValid) {
    await app.publish(events.recordApi.save.onInvalid, {
      record,
      validationResult,
    })
    ctx.status = 400
    ctx.message = "record failed validation rules"
    ctx.body = validationResult
  }

  if (!record._rev) {
    await db.insert(record)
    await app.publish(events.recordApi.save.onRecordCreated, {
      record: record,
    })
  } else {
    const oldRecord = await _findRecord(db, ctx.schema, record._id)
    await db.insert(record)
    await app.publish(events.recordApi.save.onRecordUpdated, {
      old: oldRecord,
      new: record,
    })
  }

  const savedHead = await db.head(record._id)
  record._rev = savedHead._rev
  return record
}

async function fetch(ctx) {
  const db = couchdb.db.use(ctx.params.databaseId)

  ctx.body = await db.view("database", "all_somemodel", { 
    include_docs: true,
    key: ["app"] 
  })
}

async function find(ctx) {
  const db = couchdb.db.use(ctx.params.databaseId)
  const { body, status } = await _findRecord(db, ctx.schema, ctx.params.id)
  ctx.status = status
  ctx.body = body
}

async function _findRecord(db, schema, id) {
  let storedData
  try {
    storedData = await db.get(id)
  } catch (err) {
    return err
  }

  const model = schema.findModel(storedData._modelId)

  const loadedRecord = $(model.fields, [
    keyBy("name"),
    mapValues(f => safeParseField(f, storedData)),
  ])

  const links = $(model.fields, [
    filter(
      f => f.type === "reference" && isNonEmptyString(loadedRecord[f.name].key)
    ),
    map(f => ({
      promise: _findRecord(db, schema, loadedRecord[f.name]._id),
      index: getNode(app.hierarchy, f.typeOptions.indexNodeKey),
      field: f,
    })),
  ])

  if (links.length > 0) {
    const refRecords = await Promise.all(map(p => p.promise)(links))

    for (const ref of links) {
      loadedRecord[ref.field.name] = mapRecord(
        refRecords[links.indexOf(ref)],
        ref.index
      )
    }
  }

  loadedRecord._rev = storedData._rev
  loadedRecord._id = storedData._id
  loadedRecord._modelId = storedData._modelId
  return loadedRecord
}

async function destroy(ctx) {
  const databaseId = ctx.params.databaseId;
  const database = couchdb.db.use(databaseId)
  ctx.body = await database.destroy(ctx.params.recordId);
}

module.exports = {dave, fetch, destroy, find};