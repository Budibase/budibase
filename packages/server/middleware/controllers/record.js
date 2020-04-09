const couchdb = require("../../db")
const { cloneDeep, mapValues, keyBy } = require("lodash/fp")
const {
  validateRecord,
} = require("../../../common/src/records/validateRecord.mjs")
const { events } = require("../../../common/src/common/events.mjs")
const { $ } = require("../../../common/src/common")
import { safeParseField } from "../../../common/src/schema/types"
import {
  allModelsViewName,
  allModelsDesignDocName,
} from "./couchdbNamingConventions"

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
    await ctx.publish(events.recordApi.save.onInvalid, {
      record,
      validationResult,
    })
    ctx.status = 400
    ctx.message = "record failed validation rules"
    ctx.body = validationResult
  }

  if (!record._rev) {
    await db.insert(record)
    await ctx.publish(events.recordApi.save.onRecordCreated, {
      record: record,
    })
  } else {
    const oldRecord = await _findRecord(db, ctx.schema, record._id)
    await db.insert(record)
    await ctx.publish(events.recordApi.save.onRecordUpdated, {
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
  const model = ctx.schema.findModel(ctx.modelName)
  ctx.body = db.viewAsStream(
    allModelsDesignDocName(model.id),
    allModelsViewName(model.id),
    {
      include_docs: true,
    }
  )
}

async function find(ctx) {
  const db = couchdb.db.use(ctx.params.databaseId)
  const { body, status } = await _findRecord(
    db,
    ctx.schema,
    ctx.params.recordId
  )
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

module.exports = { save, fetch, destroy, find }
