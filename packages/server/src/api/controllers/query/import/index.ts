import { queryValidation } from "../validation"
import { generateQueryID } from "../../../../db/utils"
import { ImportInfo, ImportSource } from "./sources/base"
import { OpenAPI2 } from "./sources/openapi2"
import { OpenAPI3 } from "./sources/openapi3"
import { Query } from "./../../../../definitions/common"
import { Curl } from "./sources/curl"
// @ts-ignore
import { getAppDB } from "@budibase/backend-core/context"
interface ImportResult {
  errorQueries: Query[]
  queries: Query[]
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

  importQueries = async (datasourceId: string): Promise<ImportResult> => {
    // constuct the queries
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
    const db = getAppDB()
    const response = await db.bulkDocs(queries)

    // create index to seperate queries and errors
    const queryIndex = queries.reduce((acc, query) => {
      if (query._id) {
        acc[query._id] = query
      }
      return acc
    }, {} as { [key: string]: Query })

    // check for failed writes
    response.forEach((query: any) => {
      if (!query.ok) {
        errorQueries.push(queryIndex[query.id])
        delete queryIndex[query.id]
      }
    })

    return {
      errorQueries,
      queries: Object.values(queryIndex),
    }
  }
}
