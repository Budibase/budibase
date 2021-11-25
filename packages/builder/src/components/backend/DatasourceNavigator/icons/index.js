import Postgres from "./Postgres.svelte"
import DynamoDB from "./DynamoDB.svelte"
import Elasticsearch from "./Elasticsearch.svelte"
import MongoDB from "./MongoDB.svelte"
import CouchDB from "./CouchDB.svelte"
import S3 from "./S3.svelte"
import Airtable from "./Airtable.svelte"
import SqlServer from "./SQLServer.svelte"
import MySQL from "./MySQL.svelte"
import ArangoDB from "./ArangoDB.svelte"
import Rest from "./Rest.svelte"
import Budibase from "./Budibase.svelte"
import Oracle from "./Oracle.svelte"
import GoogleSheets from "./GoogleSheets.svelte"

export default {
  BUDIBASE: Budibase,
  POSTGRES: Postgres,
  DYNAMODB: DynamoDB,
  MONGODB: MongoDB,
  ELASTICSEARCH: Elasticsearch,
  COUCHDB: CouchDB,
  SQL_SERVER: SqlServer,
  S3: S3,
  AIRTABLE: Airtable,
  MYSQL: MySQL,
  ARANGODB: ArangoDB,
  REST: Rest,
  ORACLE: Oracle,
  GOOGLE_SHEETS: GoogleSheets,
}
