const CouchDB = require("../../db")
const {
  generateDatasourceID,
  getDatasourceParams,
  getQueryParams,
  DocumentTypes,
  BudibaseInternalDB,
  getTableParams,
} = require("../../db/utils")
const { integrations } = require("../../integrations")
const { makeExternalQuery } = require("./row/utils")

exports.fetch = async function (ctx) {
  const database = new CouchDB(ctx.appId)

  // Get internal tables
  const db = new CouchDB(ctx.appId)
  const internalTables = await db.allDocs(
    getTableParams(null, {
      include_docs: true,
    })
  )
  const internal = internalTables.rows.map(row => row.doc)

  const bbInternalDb = {
    ...BudibaseInternalDB,
    entities: internal,
  }

  // Get external datasources
  const datasources = (
    await database.allDocs(
      getDatasourceParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc)

  ctx.body = [bbInternalDb, ...datasources]
}

exports.buildSchemaFromDb = async function (ctx) {
  const db = new CouchDB(ctx.appId)
  const datasourceId = ctx.params.datasourceId
  const datasource = await db.get(datasourceId)

  const Connector = integrations[datasource.source]

  // Connect to the DB and build the schema
  const connector = new Connector(datasource.config)
  await connector.buildSchema(datasource._id, datasource.entities)
  datasource.entities = connector.tables

  const response = await db.post(datasource)
  datasource._rev = response.rev

  ctx.body = datasource
}

exports.save = async function (ctx) {
  const db = new CouchDB(ctx.appId)
  const plus = ctx.request.body.plus

  const datasource = {
    _id: generateDatasourceID({ plus }),
    type: plus ? DocumentTypes.DATASOURCE_PLUS : DocumentTypes.DATASOURCE,
    ...ctx.request.body,
  }

  const response = await db.post(datasource)
  datasource._rev = response.rev

  // Drain connection pools when configuration is changed
  if (datasource.source) {
    const source = integrations[datasource.source]
    if (source && source.pool) {
      await source.pool.end()
    }
  }

  ctx.status = 200
  ctx.message = "Datasource saved successfully."
  ctx.body = datasource
}

exports.destroy = async function (ctx) {
  const db = new CouchDB(ctx.appId)

  // Delete all queries for the datasource
  const rows = await db.allDocs(getQueryParams(ctx.params.datasourceId, null))
  await db.bulkDocs(rows.rows.map(row => ({ ...row.doc, _deleted: true })))

  // delete the datasource
  await db.remove(ctx.params.datasourceId, ctx.params.revId)

  ctx.message = `Datasource deleted.`
  ctx.status = 200
}

exports.find = async function (ctx) {
  const database = new CouchDB(ctx.appId)
  ctx.body = await database.get(ctx.params.datasourceId)
}

// dynamic query functionality
exports.query = async function (ctx) {
  const queryJson = ctx.request.body
  try {
    ctx.body = await makeExternalQuery(ctx.appId, queryJson)
  } catch (err) {
    ctx.throw(400, err)
  }
}
