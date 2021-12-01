import CouchDB from "../../../../db"
import { queryValidation } from "../validation"
import { generateQueryID } from "../../../../db/utils"
import { Query, ImportInfo, ImportSource } from "./sources/base"
import { OpenAPI2 } from "./sources/openapi2"
import { OpenAPI3 } from "./sources/openapi3"
import { Curl } from "./sources/curl"

interface ImportResult {
  errorQueries: Query[]
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
      if (await source.isSupported(this.data)){
        this.source = source
        break
      }
    }
  }

  getInfo = async (): Promise<ImportInfo> => {
    return this.source.getInfo()
  }

  importQueries = async (
    appId: string,
    datasourceId: string,
  ): Promise<ImportResult> => {
  
    // constuct the queries
    let queries = await this.source.getQueries(datasourceId)
  
    // validate queries
    const errorQueries = []
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
    const db = new CouchDB(appId)
    for (const query of queries) {
      try {
        await db.put(query)
      } catch (error) {
        errorQueries.push(query)
      }
    }
  
    return {
      errorQueries,
    }
  }

}


