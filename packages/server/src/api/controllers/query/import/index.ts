import { generateQueryID } from "../../../../db/utils"
import { queryValidation } from "../validation"
import { ImportInfo, ImportSource } from "./sources/base"
import { Curl } from "./sources/curl"
import { OpenAPI2 } from "./sources/openapi2"
import { OpenAPI3 } from "./sources/openapi3"
import nodeFetch from "node-fetch"
// @ts-ignore
import { context, events } from "@budibase/backend-core"
import { Datasource, Query } from "@budibase/types"

interface ImportResult {
  errorQueries: Query[]
  queries: Query[]
}

export class RestImporter {
  data: string
  sources: ImportSource[]
  source!: ImportSource
  private input: string

  constructor(data: string) {
    this.data = data
    this.input = data
    this.sources = [new OpenAPI2(), new OpenAPI3(), new Curl()]
  }

  private async ensureDataLoaded() {
    if (!this.data) {
      throw new Error("No data provided for REST import")
    }

    const trimmed = this.data.trim()
    if (/^https?:\/\//i.test(trimmed)) {
      const response = await nodeFetch(trimmed)
      if (!response.ok) {
        throw new Error(
          `Failed to download specification from ${trimmed} (status ${response.status})`
        )
      }
      this.data = await response.text()
    }
  }

  init = async () => {
    await this.ensureDataLoaded()
    for (let source of this.sources) {
      if (await source.isSupported(this.data)) {
        this.source = source
        break
      }
    }

    if (!this.source) {
      const message = /^https?:\/\//i.test(this.input.trim())
        ? "Unsupported or unreadable specification at provided URL"
        : "Unsupported REST import format"
      throw new Error(message)
    }
  }

  getInfo = async (): Promise<ImportInfo> => {
    if (!this.source) {
      throw new Error("REST importer is not initialised")
    }
    return this.source.getInfo()
  }

  importQueries = async (datasourceId: string): Promise<ImportResult> => {
    if (!this.source) {
      throw new Error("REST importer is not initialised")
    }
    // construct the queries
    let queries = await this.source.getQueries(datasourceId)

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
}
