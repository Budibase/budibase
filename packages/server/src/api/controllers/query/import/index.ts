import { generateQueryID } from "../../../../db/utils"
import { queryValidation } from "../validation"
import { ImportInfo, ImportSource } from "./sources/base"
import { Curl } from "./sources/curl"
import { OpenAPI2 } from "./sources/openapi2"
import { OpenAPI3 } from "./sources/openapi3"
// @ts-ignore
import { context, events } from "@budibase/backend-core"
import { Datasource, Query } from "@budibase/types"

interface ImportResult {
  errorQueries: Query[]
  queries: Query[]
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

export class RestImporter {
  data: string
  sources: ImportSource[]
  source!: ImportSource

  constructor(data: string) {
    this.data = data
    this.sources = [new OpenAPI2(), new OpenAPI3(), new Curl()]
  }

  init = async () => {
    for (let source of this.sources) {
      if (await source.isSupported(this.data)) {
        this.source = source
        break
      }
    }
  }

  getInfo = async (): Promise<ImportInfo> => {
    return this.source.getInfo()
  }

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
    let queries = await this.source.getQueries(datasourceId, {
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
    const datasource: Datasource = await db.get(datasourceId)
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
    const db = context.getWorkspaceDB()
    let datasource: Datasource | undefined
    try {
      datasource = await db.get<Datasource>(datasourceId)
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
