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
const firebase = require("./firebase")
const redis = require("./redis")
const snowflake = require("./snowflake")
const { SourceName } = require("@budibase/types")
const environment = require("../environment")

const DEFINITIONS = {
  [SourceName.POSTGRES]: postgres.schema,
  [SourceName.DYNAMODB]: dynamodb.schema,
  [SourceName.MONGODB]: mongodb.schema,
  [SourceName.ELASTICSEARCH]: elasticsearch.schema,
  [SourceName.COUCHDB]: couchdb.schema,
  [SourceName.SQL_SERVER]: sqlServer.schema,
  [SourceName.S3]: s3.schema,
  [SourceName.AIRTABLE]: airtable.schema,
  [SourceName.MYSQL]: mysql.schema,
  [SourceName.ARANGODB]: arangodb.schema,
  [SourceName.REST]: rest.schema,
  [SourceName.FIRESTORE]: firebase.schema,
  [SourceName.REDIS]: redis.schema,
  [SourceName.SNOWFLAKE]: snowflake.schema,
}

const INTEGRATIONS = {
  [SourceName.POSTGRES]: postgres.integration,
  [SourceName.DYNAMODB]: dynamodb.integration,
  [SourceName.MONGODB]: mongodb.integration,
  [SourceName.ELASTICSEARCH]: elasticsearch.integration,
  [SourceName.COUCHDB]: couchdb.integration,
  [SourceName.SQL_SERVER]: sqlServer.integration,
  [SourceName.S3]: s3.integration,
  [SourceName.AIRTABLE]: airtable.integration,
  [SourceName.MYSQL]: mysql.integration,
  [SourceName.ARANGODB]: arangodb.integration,
  [SourceName.REST]: rest.integration,
  [SourceName.FIRESTORE]: firebase.integration,
  [SourceName.GOOGLE_SHEETS]: googlesheets.integration,
  [SourceName.REDIS]: redis.integration,
  [SourceName.FIREBASE]: firebase.integration,
  [SourceName.SNOWFLAKE]: snowflake.integration,
}

// optionally add oracle integration if the oracle binary can be installed
if (process.arch && !process.arch.startsWith("arm")) {
  const oracle = require("./oracle")
  DEFINITIONS[SourceName.ORACLE] = oracle.schema
  INTEGRATIONS[SourceName.ORACLE] = oracle.integration
}

if (environment.SELF_HOSTED) {
  DEFINITIONS[SourceName.GOOGLE_SHEETS] = googlesheets.schema
}

module.exports = {
  definitions: DEFINITIONS,
  integrations: INTEGRATIONS,
}
