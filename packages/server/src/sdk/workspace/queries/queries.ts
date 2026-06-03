import { context } from "@budibase/backend-core"
import {
  processJsonStringSync,
  processStringSync,
} from "@budibase/string-templates"
import type { JSONValue, Query, QuerySchema } from "@budibase/types"
import { BaseQueryVerbs } from "../../../constants"
import { getQueryParams, isProdWorkspaceID } from "../../../db/utils"
import { getEnvironmentVariables } from "../../utils"

export interface EnrichContextOpts {
  escapeNewlines?: boolean
}

const DEFAULT_ENRICH_CONTEXT_OPTS: Required<EnrichContextOpts> = {
  escapeNewlines: true,
}

const JSON_TEMPLATE_FIELDS = new Set(["json", "customData", "requestBody"])

const processTemplateString = (
  value: string,
  parameters: object,
  options: Required<EnrichContextOpts>
) => {
  return processStringSync(value, parameters, {
    noEscaping: true,
    noHelpers: true,
    escapeNewlines: options.escapeNewlines,
  })
}

const enrichJsonTemplate = (
  template: string,
  parameters: object,
  options: Required<EnrichContextOpts>
) =>
  processJsonStringSync(template, parameters, {
    noEscaping: true,
    noHelpers: true,
    escapeNewlines: options.escapeNewlines,
  }) as JSONValue | string

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
  const db = context.getWorkspaceDB()
  const workspaceId = context.getWorkspaceId()
  const query = enrichQueries(await db.get(queryId))
  // remove properties that could be dangerous in real app
  if (isProdWorkspaceID(workspaceId)) {
    delete query.fields
    delete query.parameters
  }
  return updateSchema(query)
}

export async function fetch(opts: { enrich: boolean } = { enrich: true }) {
  const db = context.getWorkspaceDB()

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
  inputs = {},
  opts: EnrichContextOpts = {}
): Promise<any[]> {
  const map: Record<string, any> = {}
  for (let index in fields) {
    map[index] = fields[index]
  }
  const output = await enrichContext(map, inputs, opts)
  const outputArray: any[] = []
  for (let [key, value] of Object.entries(output)) {
    outputArray[parseInt(key)] = value
  }
  return outputArray
}

export async function enrichContext(
  fields: Record<string, any>,
  inputs = {},
  opts: EnrichContextOpts = {}
): Promise<Record<string, any>> {
  const options: Required<EnrichContextOpts> = {
    ...DEFAULT_ENRICH_CONTEXT_OPTS,
    ...opts,
  }
  const enrichedQuery: Record<string, any> = {}
  if (!fields || !inputs) {
    return enrichedQuery
  }
  if (Array.isArray(fields)) {
    return enrichArrayContext(fields, inputs, options)
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
      enrichedQuery[key] = await enrichContext(fields[key], parameters, options)
    } else if (typeof fields[key] === "string") {
      enrichedQuery[key] = JSON_TEMPLATE_FIELDS.has(key)
        ? enrichJsonTemplate(fields[key], parameters, options)
        : processTemplateString(fields[key], parameters, options)
    } else {
      enrichedQuery[key] = fields[key]
    }
  }
  const jsonField = ["json", "customData", "requestBody"].find(key =>
    Object.prototype.hasOwnProperty.call(enrichedQuery, key)
  )
  if (jsonField) {
    try {
      const json = enrichedQuery[jsonField]
      enrichedQuery.json = typeof json === "string" ? JSON.parse(json) : json
    } catch (err) {
      // no json found, ignore
    }
    delete enrichedQuery.customData
  }
  return enrichedQuery
}
