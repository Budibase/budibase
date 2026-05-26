import { context } from "@budibase/backend-core"
import { processStringSync } from "@budibase/string-templates"
import { Query, QuerySchema } from "@budibase/types"
import { BaseQueryVerbs } from "../../../constants"
import { getQueryParams, isProdWorkspaceID } from "../../../db/utils"
import { getEnvironmentVariables } from "../../utils"

export interface EnrichContextOpts {
  escapeNewlines?: boolean
}

const DEFAULT_ENRICH_CONTEXT_OPTS: Required<EnrichContextOpts> = {
  escapeNewlines: true,
}

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

// Fields whose substituted string content is later JSON.parsed. When we
// interpolate user-controlled parameters into these, raw substitution lets a
// crafted value (e.g. containing `","key":{"$exists":true}`) break out of its
// JSON string context and inject sibling keys/operators into the parsed object.
// We JSON-escape string values before substitution so they stay inside the
// surrounding quotes of the template.
const JSON_BODY_FIELDS = new Set(["json", "customData", "requestBody"])

function jsonEscapeForContext(value: any, seen = new WeakSet()): any {
  if (typeof value === "string") {
    // JSON.stringify produces a quoted, escaped form. Strip the surrounding
    // quotes so the result drops in between the template's own `"..."`.
    const encoded = JSON.stringify(value)
    return encoded.slice(1, encoded.length - 1)
  }
  if (value && typeof value === "object") {
    if (seen.has(value)) {
      return value
    }
    seen.add(value)
    if (Array.isArray(value)) {
      return value.map(v => jsonEscapeForContext(v, seen))
    }
    const out: Record<string, any> = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = jsonEscapeForContext(v, seen)
    }
    return out
  }
  return value
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
  let jsonSafeParameters: Record<string, any> | undefined
  const getJsonSafeParameters = () => {
    if (!jsonSafeParameters) {
      jsonSafeParameters = jsonEscapeForContext(parameters)
    }
    return jsonSafeParameters
  }
  // enrich the fields with dynamic parameters
  for (let key of Object.keys(fields)) {
    if (fields[key] == null) {
      continue
    }
    if (typeof fields[key] === "object") {
      // enrich nested fields object
      enrichedQuery[key] = await enrichContext(fields[key], parameters, options)
    } else if (typeof fields[key] === "string") {
      // string-form JSON bodies are JSON.parsed below; substitute through a
      // parameter view where every string is JSON-escaped, so a crafted value
      // cannot escape its quoted context and lift sibling keys/operators into
      // the parsed object.
      const context = JSON_BODY_FIELDS.has(key)
        ? getJsonSafeParameters()
        : parameters
      enrichedQuery[key] = processStringSync(fields[key], context, {
        noEscaping: true,
        noHelpers: true,
        escapeNewlines: options.escapeNewlines,
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
