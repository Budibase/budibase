const CouchDB = require("../../db")
const {
  generateDatasourceID,
  getDatasourceParams,
  getQueryParams,
  DocumentTypes,
  BudibaseInternalDB,
  getTableParams,
} = require("../../db/utils")
const { BuildSchemaErrors, InvalidColumns } = require("../../constants")
const { integrations } = require("../../integrations")
const { getDatasourceAndQuery } = require("./row/utils")

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
  const datasource = await db.get(ctx.params.datasourceId)

  const { tables, error } = await buildSchemaHelper(datasource)
  datasource.entities = tables

  const dbResp = await db.put(datasource)
  datasource._rev = dbResp.rev

  const response = { datasource }
  if (error) {
    response.error = error
  }
  ctx.body = response
}

exports.update = async function (ctx) {
  const db = new CouchDB(ctx.appId)
  const datasourceId = ctx.params.datasourceId
  let datasource = await db.get(datasourceId)
  datasource = { ...datasource, ...ctx.request.body }

  const response = await db.put(datasource)
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
  ctx.body = { datasource }
}

exports.save = async function (ctx) {
  const db = new CouchDB(ctx.appId)
  const plus = ctx.request.body.datasource.plus
  const fetchSchema = ctx.request.body.fetchSchema

  const datasource = {
    _id: generateDatasourceID({ plus }),
    type: plus ? DocumentTypes.DATASOURCE_PLUS : DocumentTypes.DATASOURCE,
    ...ctx.request.body.datasource,
  }

  let schemaError = null
  if (fetchSchema) {
    const { tables, error } = await buildSchemaHelper(datasource)
    schemaError = error
    datasource.entities = tables
  }

  const dbResp = await db.put(datasource)
  datasource._rev = dbResp.rev

  // Drain connection pools when configuration is changed
  if (datasource.source) {
    const source = integrations[datasource.source]
    if (source && source.pool) {
      await source.pool.end()
    }
  }

  const response = { datasource }
  if (schemaError) {
    response.error = schemaError
  }
  ctx.body = response
}

exports.destroy = async function (ctx) {
  const db = new CouchDB(ctx.appId)

  // Delete all queries for the datasource
  const queries = await db.allDocs(
    getQueryParams(ctx.params.datasourceId, null)
  )
  await db.bulkDocs(
    queries.rows.map(row => ({
      _id: row.id,
      _rev: row.value.rev,
      _deleted: true,
    }))
  )

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
    ctx.body = await getDatasourceAndQuery(ctx.appId, queryJson)
  } catch (err) {
    ctx.throw(400, err)
  }
}

function getErrorTables(errors, errorType) {
  return Object.entries(errors)
    .filter(entry => entry[1] === errorType)
    .map(([name]) => name)
}

function updateError(error, newError, tables) {
  if (!error) {
    error = ""
  }
  if (error.length > 0) {
    error += "\n"
  }
  error += `${newError} ${tables.join(", ")}`
  return error
}

const buildSchemaHelper = async datasource => {
  const Connector = integrations[datasource.source]

  // Connect to the DB and build the schema
  const connector = new Connector(datasource.config)
  await connector.buildSchema(datasource._id, datasource.entities)
  datasource.entities = connector.tables

  // make sure they all have a display name selected
  for (let entity of Object.values(datasource.entities)) {
    if (entity.primaryDisplay) {
      continue
    }
    const notAutoColumn = Object.values(entity.schema).find(
      schema => !schema.autocolumn
    )
    if (notAutoColumn) {
      entity.primaryDisplay = notAutoColumn.name
    }
  }

  const errors = connector.schemaErrors
  let error = null
  if (errors && Object.keys(errors).length > 0) {
    const noKey = getErrorTables(errors, BuildSchemaErrors.NO_KEY)
    const invalidCol = getErrorTables(errors, BuildSchemaErrors.INVALID_COLUMN)
    if (noKey.length) {
      error = updateError(
        error,
        "No primary key constraint found for the following:",
        noKey
      )
    }
    if (invalidCol.length) {
      const invalidCols = Object.values(InvalidColumns).join(", ")
      error = updateError(
        error,
        `Cannot use columns ${invalidCols} found in following:`,
        invalidCol
      )
    }
  }
  return { tables: connector.tables, error }
}
