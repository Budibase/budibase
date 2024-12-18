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
import Firebase from "./Firebase.svelte"
import Redis from "./Redis.svelte"
import Snowflake from "./Snowflake.svelte"
import Custom from "./Custom.svelte"
import { integrations } from "@/stores/builder"
import { get } from "svelte/store"

const ICONS = {
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
  FIRESTORE: Firebase,
  REDIS: Redis,
  SNOWFLAKE: Snowflake,
  CUSTOM: Custom,
}

export default ICONS

export function getIcon(integrationType, schema) {
  const integrationList = get(integrations)
  if (!integrationList) {
    return
  }
  if (integrationList[integrationType]?.iconUrl) {
    return { url: integrationList[integrationType].iconUrl }
  } else if (schema?.custom || !ICONS[integrationType]) {
    return { icon: ICONS.CUSTOM }
  } else {
    return { icon: ICONS[integrationType] }
  }
}
