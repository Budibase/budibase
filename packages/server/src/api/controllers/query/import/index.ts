import { cache, context, events, HTTPError } from "@budibase/backend-core"
import { Datasource, Query } from "@budibase/types"
import { generateQueryID } from "../../../../db/utils"
import { queryValidation } from "../validation"
import { ImportInfo, ImportSource } from "./sources/base"
import { Curl } from "./sources/curl"
import { OpenAPI2 } from "./sources/openapi2"
import { OpenAPI3 } from "./sources/openapi3"
import sdk from "../../../../sdk"
import * as crypto from "crypto"
import fetch from "node-fetch"

interface ImportResult {
  errorQueries: Query[]
  queries: Query[]
}

type ImporterInput = { data: string } | { url: string }

const SOURCE_FACTORIES: Record<string, () => ImportSource> = {
  "openapi2.0": () => new OpenAPI2(),
  "openapi3.0": () => new OpenAPI3(),
  curl: () => new Curl(),
}

const assignStaticVariableDefaults = (
  target: Record<string, string>,
  tokens: string[],
  defaults: Record<string, string>
) => {
  let changed = false
  for (const token of tokens) {
    if (target[token] == null) {
      target[token] = defaults[token] ?? ""
      changed = true
    }
  }
  return changed
}

const assignDatasourceHeaderDefaults = (
  target: Record<string, any>,
  headerNames: string[]
) => {
  for (const headerName of headerNames) {
    if (!headerName) {
      continue
    }
    const normalized = headerName.toLowerCase()
    const existingKey = Object.keys(target).find(
      key => key?.toLowerCase() === normalized
    )
    if (existingKey) {
      continue
    }
    target[headerName] = target[headerName] ?? ""
  }
}

const stringToHashKey = (input: string) =>
  crypto.createHash("sha512").update(JSON.stringify(input)).digest("hex")

const buildCacheKey = (input: ImporterInput) =>
  `openapiSpecs:${stringToHashKey(JSON.stringify("data" in input ? input.data : input.url))}`

async function fetchFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new HTTPError(
        `Failed to fetch import data (status ${response.status})`,
        response.status
      )
    }
    return await response.text()
  } catch (error: any) {
    if (error instanceof HTTPError) {
      throw error
    }
    const message = error?.message || "Unknown error"
    throw new HTTPError(`Failed to fetch import data - ${message}`, 502)
  }
}

export async function getImportInfo(
  input: { data: string } | { url: string }
): Promise<ImportInfo> {
  const importer = await createImporter(input as any)
  const info = importer.getInfo()
  return info
}

async function urlToSpecs(url: string): Promise<string> {
  const cacheKey = `${buildCacheKey({ url })}:urlSpecs`
  const cachedValue = await cache.get(cacheKey)
  if (cachedValue) {
    if (typeof cachedValue === "string") {
      return cachedValue
    }
    return JSON.stringify(cachedValue)
  }
  const result = await fetchFromUrl(url)
  await cache.store(cacheKey, result, cache.TTL.ONE_DAY * 7)
  return result
}

export async function createImporter(
  input: { data?: string } | { url?: string }
): Promise<RestImporter> {
  let data: string | undefined
  if ("url" in input && input.url) {
    data = await urlToSpecs(input.url)
  } else if ("data" in input) {
    data = input.data
  }

  data = data?.trim()
  if (!data) {
    throw new HTTPError("Import data or url is required", 400)
  }

  const importerTypeCacheKey = `${buildCacheKey({ data })}:type`
  const cachedType = await cache.get(importerTypeCacheKey)

  const result = await RestImporter.init(data, cachedType)
  if (!cachedType) {
    await cache.store(
      importerTypeCacheKey,
      result.getSource().getImportSource(),
      cache.TTL.ONE_DAY * 200
    )
  }

  return result
}

export class RestImporter {
  private source!: ImportSource

  private constructor() {}

  static init = async (data: string, type?: string) => {
    const importer = new RestImporter()
    if (type) {
      const factory = SOURCE_FACTORIES[type]
      if (!factory) {
        throw new HTTPError("Unsupported import type", 400)
      }

      const source = factory()
      await source.load(data)
      importer.source = source
      return importer
    } else {
      for (let source of [new OpenAPI3(), new OpenAPI2(), new Curl()]) {
        if (await source.tryLoad(data)) {
          importer.source = source
          break
        }
      }
    }
    if (!importer.source) {
      throw new HTTPError("Unsupported import data", 400)
    }
    return importer
  }

  getSource = () => this.source

  getInfo = () => this.source.getInfo()

  importQueries = async (
    datasourceId: string,
    selectedEndpointId?: string
  ): Promise<ImportResult> => {
    const filterIds = selectedEndpointId
      ? new Set<string>([selectedEndpointId])
      : undefined
    const staticVariables =
      await this.getDatasourceStaticVariables(datasourceId)
    // construct the queries
    let queries = this.source.getQueries(datasourceId, {
      filterIds,
      staticVariables,
    })

    if (filterIds && queries.length === 0) {
      throw new Error("Selected endpoint could not be imported")
    }

    // validate queries
    const errorQueries: Query[] = []
    const schema = queryValidation()
    queries = queries
      .filter(query => {
        const validation = schema.validate(query)
        if (validation.error) {
          errorQueries.push(query)
          return false
        }
        return true
      })
      .map(query => {
        query._id = generateQueryID(query.datasourceId)
        return query
      })

    // persist queries
    const db = context.getWorkspaceDB()
    const response = await db.bulkDocs(queries)

    // create index to seperate queries and errors
    const queryIndex = queries.reduce(
      (acc, query) => {
        if (query._id) {
          acc[query._id] = query
        }
        return acc
      },
      {} as { [key: string]: Query }
    )

    // check for failed writes
    response.forEach((query: any) => {
      if (!query.ok) {
        errorQueries.push(queryIndex[query.id])
        delete queryIndex[query.id]
      }
    })

    const successQueries = Object.values(queryIndex)

    // events
    const count = successQueries.length
    const importSource = this.source.getImportSource()
    const datasource = await sdk.datasources.get(datasourceId)
    await events.query.imported(datasource, importSource, count)
    for (let query of successQueries) {
      await events.query.created(datasource, query)
    }

    return {
      errorQueries,
      queries: successQueries,
    }
  }

  prepareDatasourceConfig = (datasource: Datasource | undefined) => {
    if (!datasource) {
      return
    }
    const config = datasource.config || (datasource.config = {})
    const defaults = this.getStaticServerVariables()
    const tokens = Object.keys(defaults || {}).filter(Boolean)
    if (tokens.length) {
      config.staticVariables = config.staticVariables || {}
      assignStaticVariableDefaults(config.staticVariables, tokens, defaults)
      const templateStaticVariables = new Set(
        config.templateStaticVariables || []
      )
      tokens.forEach(token => templateStaticVariables.add(token))
      config.templateStaticVariables = Array.from(templateStaticVariables)
    }

    const securityHeaders = this.source.getSecurityHeaders()
    if (securityHeaders.length) {
      if (
        !config.defaultHeaders ||
        typeof config.defaultHeaders !== "object" ||
        Array.isArray(config.defaultHeaders)
      ) {
        config.defaultHeaders = {}
      }
      assignDatasourceHeaderDefaults(
        config.defaultHeaders as Record<string, any>,
        securityHeaders
      )
    }
  }

  getStaticServerVariables = (): Record<string, string> => {
    const source: any = this.source
    if (source && typeof source.getServerVariableBindings === "function") {
      return source.getServerVariableBindings()
    }
    return {}
  }

  private async getDatasourceStaticVariables(
    datasourceId: string
  ): Promise<Record<string, string>> {
    if (!datasourceId) {
      return {}
    }

    let datasource
    try {
      datasource = await sdk.datasources.get(datasourceId)
    } catch (_err) {
      return {}
    }
    const staticVariables = datasource?.config?.staticVariables
    if (!staticVariables || typeof staticVariables !== "object") {
      return {}
    }
    return { ...staticVariables }
  }
}
