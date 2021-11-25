const postgres = require("./postgres")
const dynamodb = require("./dynamodb")
const mongodb = require("./mongodb")
const elasticsearch = require("./elasticsearch")
const couchdb = require("./couchdb")
const sqlServer = require("./microsoftSqlServer")
const s3 = require("./s3")
const airtable = require("./airtable")
const mysql = require("./mysql")
const arangodb = require("./arangodb")
const rest = require("./rest")
const googlesheets = require("./googlesheets")
const { SourceNames } = require("../definitions/datasource")

const DEFINITIONS = {
  [SourceNames.POSTGRES]: postgres.schema,
  [SourceNames.DYNAMODB]: dynamodb.schema,
  [SourceNames.MONGODB]: mongodb.schema,
  [SourceNames.ELASTICSEARCH]: elasticsearch.schema,
  [SourceNames.COUCHDB]: couchdb.schema,
  [SourceNames.SQL_SERVER]: sqlServer.schema,
  [SourceNames.S3]: s3.schema,
  [SourceNames.AIRTABLE]: airtable.schema,
  [SourceNames.MYSQL]: mysql.schema,
  [SourceNames.ARANGODB]: arangodb.schema,
  [SourceNames.REST]: rest.schema,
  [SourceNames.GOOGLE_SHEETS]: googlesheets.schema,
}

const INTEGRATIONS = {
  [SourceNames.POSTGRES]: postgres.integration,
  [SourceNames.DYNAMODB]: dynamodb.integration,
  [SourceNames.MONGODB]: mongodb.integration,
  [SourceNames.ELASTICSEARCH]: elasticsearch.integration,
  [SourceNames.COUCHDB]: couchdb.integration,
  [SourceNames.SQL_SERVER]: sqlServer.integration,
  [SourceNames.S3]: s3.integration,
  [SourceNames.AIRTABLE]: airtable.integration,
  [SourceNames.MYSQL]: mysql.integration,
  [SourceNames.ARANGODB]: arangodb.integration,
  [SourceNames.REST]: rest.integration,
  [SourceNames.GOOGLE_SHEETS]: googlesheets.integration,
}

// optionally add oracle integration if the oracle binary can be installed
if (!(process.arch === "arm64" && process.platform === "darwin")) {
  const oracle = require("./oracle")
  DEFINITIONS[SourceNames.ORACLE] = oracle.schema
  INTEGRATIONS[SourceNames.ORACLE] = oracle.integration
}

module.exports = {
  definitions: DEFINITIONS,
  integrations: INTEGRATIONS,
}
