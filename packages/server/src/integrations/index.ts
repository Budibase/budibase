import postgres from "./postgres"
import dynamodb from "./dynamodb"
import mongodb from "./mongodb"
import elasticsearch from "./elasticsearch"
import couchdb from "./couchdb"
import sqlServer from "./microsoftSqlServer"
import s3 from "./s3"
import airtable from "./airtable"
import mysql from "./mysql"
import arangodb from "./arangodb"
import rest from "./rest"
import googlesheets from "./googlesheets"
import firebase from "./firebase"
import redis from "./redis"
import snowflake from "./snowflake"
import oracle from "./oracle"
import { SourceName, Integration, PluginType } from "@budibase/types"
import { getDatasourcePlugin } from "../utilities/fileSystem"
import env from "../environment"
import { cloneDeep } from "lodash"
import sdk from "../sdk"

const DEFINITIONS: { [key: string]: Integration } = {
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
  [SourceName.GOOGLE_SHEETS]: googlesheets.schema,
  [SourceName.REDIS]: redis.schema,
  [SourceName.SNOWFLAKE]: snowflake.schema,
}

const INTEGRATIONS: { [key: string]: any } = {
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
  [SourceName.FIRESTORE]: firebase.integration,
  [SourceName.SNOWFLAKE]: snowflake.integration,
}

// optionally add oracle integration if the oracle binary can be installed
if (
  process.arch &&
  !process.arch.startsWith("arm") &&
  oracle.integration.isInstalled()
) {
  DEFINITIONS[SourceName.ORACLE] = oracle.schema
  INTEGRATIONS[SourceName.ORACLE] = oracle.integration
}

export async function getDefinition(source: SourceName): Promise<Integration> {
  // check if its integrated, faster
  if (DEFINITIONS[source]) {
    return DEFINITIONS[source]
  }
  const allDefinitions = await getDefinitions()
  return allDefinitions[source]
}

export async function getDefinitions() {
  const pluginSchemas: { [key: string]: Integration } = {}
  if (env.SELF_HOSTED) {
    const plugins = await sdk.plugins.fetch(PluginType.DATASOURCE)
    // extract the actual schema from each custom
    for (let plugin of plugins) {
      const sourceId = plugin.name
      pluginSchemas[sourceId] = {
        ...plugin.schema["schema"],
        custom: true,
      }
      if (plugin.iconUrl) {
        pluginSchemas[sourceId].iconUrl = plugin.iconUrl
      }
    }
  }
  return {
    ...cloneDeep(DEFINITIONS),
    ...pluginSchemas,
  }
}

export async function getIntegration(integration: string) {
  if (INTEGRATIONS[integration]) {
    return INTEGRATIONS[integration]
  }
  if (env.SELF_HOSTED) {
    const plugins = await sdk.plugins.fetch(PluginType.DATASOURCE)
    for (let plugin of plugins) {
      if (plugin.name === integration) {
        // need to use commonJS require due to its dynamic runtime nature
        const retrieved: any = await getDatasourcePlugin(plugin)
        if (retrieved.integration) {
          return retrieved.integration
        } else {
          return retrieved
        }
      }
    }
  }
  throw new Error("No datasource implementation found.")
}

export default {
  getDefinitions,
  getIntegration,
}
