const postgres = require("./postgres")
const dynamodb = require("./dynamodb")
const mongodb = require("./mongodb")
// const redis = require("./redis")
// const couchdb = require("./couchdb")
// const elasticsearch = require("./elasticsearch")
// const s3 = require("./s3")

const DEFINITIONS = {
  POSTGRES: postgres.schema,
  DYNAMODB: dynamodb.schema,
  MONGODB: mongodb.schema,
}

const INTEGRATIONS = {
  POSTGRES: postgres.integration,
  DYNAMODB: dynamodb.integration,
  MONGODB: mongodb.integration,
}

module.exports = {
  definitions: DEFINITIONS,
  integrations: INTEGRATIONS,
}
