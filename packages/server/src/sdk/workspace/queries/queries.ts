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
  enrichContextSync(
    processJsonStringSync(template, parameters, {
      noEscaping: true,
      noHelpers: true,
      escapeNewlines: options.escapeNewlines,
    }) as JSONValue | string,
    parameters,
    options
  ) as JSONValue | string

const enrichContextSync = (
  fields: any,
  parameters: object,
  options: Required<EnrichContextOpts>
): any => {
  if (!fields || typeof fields !== "object") {
    return fields
  }
  if (Array.isArray(fields)) {
    return fields.map(field => enrichContextSync(field, parameters, options))
  }

  const enrichedQuery: Record<string, any> = {}
  for (const key of Object.keys(fields)) {
    if (fields[key] == null) {
      continue
    }
    const enrichedKey = processTemplateString(key, parameters, options)
    if (typeof fields[key] === "object") {
      enrichedQuery[enrichedKey] = enrichContextSync(
        fields[key],
        parameters,
        options
      )
    } else if (typeof fields[key] === "string") {
      enrichedQuery[enrichedKey] = processTemplateString(
        fields[key],
        parameters,
        options
      )
    } else {
      enrichedQuery[enrichedKey] = fields[key]
    }
  }
  return enrichedQuery
}

const enrichContextObject = async (
  fields: Record<string, any>,
  parameters: object,
  options: Required<EnrichContextOpts>
) => {
  if (Array.isArray(fields)) {
    return fields.map(field => enrichContextSync(field, parameters, options))
  }

  const enrichedQuery: Record<string, any> = {}
  for (const key of Object.keys(fields)) {
    if (fields[key] == null) {
      continue
    }
    const enrichedKey = processTemplateString(key, parameters, options)
    if (typeof fields[key] === "object") {
      enrichedQuery[enrichedKey] = await enrichContextObject(
        fields[key],
        parameters,
        options
      )
    } else if (typeof fields[key] === "string") {
      enrichedQuery[enrichedKey] = JSON_TEMPLATE_FIELDS.has(enrichedKey)
        ? enrichJsonTemplate(fields[key], parameters, options)
        : processTemplateString(fields[key], parameters, options)
    } else {
      enrichedQuery[enrichedKey] = fields[key]
    }
  }
  return enrichedQuery
}

const isBlankJsonField = (value: any) =>
  typeof value === "string" && value.trim() === ""

const parseJsonField = (value: any) =>
  typeof value === "string" ? JSON.parse(value) : value

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
  if (!fields || !inputs) {
    return {}
  }
  if (Array.isArray(fields)) {
    return enrichArrayContext(fields, inputs, options)
  }
  const env = await getEnvironmentVariables()
  const parameters = { ...inputs, env }
  const enrichedQuery = await enrichContextObject(fields, parameters, options)
  for (const key of ["json", "customData", "requestBody"]) {
    if (
      !Object.hasOwn(enrichedQuery, key) ||
      isBlankJsonField(enrichedQuery[key])
    ) {
      continue
    }
    try {
      enrichedQuery.json = parseJsonField(enrichedQuery[key])
      delete enrichedQuery.customData
      break
    } catch (err) {
      // no json found, ignore
    }
  }
  return enrichedQuery
}
