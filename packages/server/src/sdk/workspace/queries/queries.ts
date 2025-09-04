import { getEnvironmentVariables } from "../../utils"
import { processStringSync } from "@budibase/string-templates"
import { context } from "@budibase/backend-core"
import { getQueryParams, isProdAppID } from "../../../db/utils"
import { BaseQueryVerbs } from "../../../constants"
import { Query, QuerySchema } from "@budibase/types"

function updateSchema(query: Query): Query {
  if (!query.schema) {
    return query
  }
  const schema: Record<string, QuerySchema> = {}
  for (let key of Object.keys(query.schema)) {
    if (typeof query.schema[key] === "string") {
      schema[key] = { type: query.schema[key] as string, name: key }
    } else {
      schema[key] = query.schema[key] as QuerySchema
    }
  }
  query.schema = schema
  return query
}

function updateSchemas(queries: Query[]): Query[] {
  return queries.map(query => updateSchema(query))
}

// simple function to append "readable" to all read queries
function enrichQueries(input: any) {
  const wasArray = Array.isArray(input)
  const queries = wasArray ? input : [input]
  for (let query of queries) {
    if (query.queryVerb === BaseQueryVerbs.READ) {
      query.readable = true
    }
  }
  return wasArray ? queries : queries[0]
}

export async function find(queryId: string) {
  const db = context.getAppDB()
  const appId = context.getAppId()
  const query = enrichQueries(await db.get(queryId))
  // remove properties that could be dangerous in real app
  if (isProdAppID(appId)) {
    delete query.fields
    delete query.parameters
  }
  return updateSchema(query)
}

export async function fetch(opts: { enrich: boolean } = { enrich: true }) {
  const db = context.getAppDB()

  const body = await db.allDocs(
    getQueryParams(null, {
      include_docs: true,
    })
  )

  let queries = body.rows.map((row: any) => row.doc)
  if (opts.enrich) {
    queries = await enrichQueries(queries)
  }
  return updateSchemas(queries)
}

export async function enrichArrayContext(
  fields: any[],
  inputs = {}
): Promise<any[]> {
  const map: Record<string, any> = {}
  for (let index in fields) {
    map[index] = fields[index]
  }
  const output = await enrichContext(map, inputs)
  const outputArray: any[] = []
  for (let [key, value] of Object.entries(output)) {
    outputArray[parseInt(key)] = value
  }
  return outputArray
}

export async function enrichContext(
  fields: Record<string, any>,
  inputs = {}
): Promise<Record<string, any>> {
  const enrichedQuery: Record<string, any> = {}
  if (!fields || !inputs) {
    return enrichedQuery
  }
  if (Array.isArray(fields)) {
    return enrichArrayContext(fields, inputs)
  }
  const env = await getEnvironmentVariables()
  const parameters = { ...inputs, env }
  // enrich the fields with dynamic parameters
  for (let key of Object.keys(fields)) {
    if (fields[key] == null) {
      continue
    }
    if (typeof fields[key] === "object") {
      // enrich nested fields object
      enrichedQuery[key] = await enrichContext(fields[key], parameters)
    } else if (typeof fields[key] === "string") {
      // enrich string value as normal
      enrichedQuery[key] = processStringSync(fields[key], parameters, {
        noEscaping: true,
        noHelpers: true,
        escapeNewlines: true,
      })
    } else {
      enrichedQuery[key] = fields[key]
    }
  }
  if (
    enrichedQuery.json ||
    enrichedQuery.customData ||
    enrichedQuery.requestBody
  ) {
    try {
      enrichedQuery.json = JSON.parse(
        enrichedQuery.json ||
          enrichedQuery.customData ||
          enrichedQuery.requestBody
      )
    } catch (err) {
      // no json found, ignore
    }
    delete enrichedQuery.customData
  }
  return enrichedQuery
}
