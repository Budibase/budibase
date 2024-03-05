import {
  Datasource,
  DatasourcePlusQueryResponse,
  Operation,
  QueryJson,
  Row,
  SearchFilters,
} from "@budibase/types"
import { getSQLClient } from "../../../sdk/app/rows/utils"
import { cloneDeep } from "lodash"
import sdk from "../../../sdk"
import { makeExternalQuery } from "../../../integrations/base/query"
import { SqlClient } from "../../../integrations/utils"

class CharSequence {
  static alphabet = "abcdefghijklmnopqrstuvwxyz"
  counters: number[]

  constructor() {
    this.counters = [0]
  }

  getCharacter(): string {
    const char = this.counters.map(i => CharSequence.alphabet[i]).join("")
    for (let i = this.counters.length - 1; i >= 0; i--) {
      if (this.counters[i] < CharSequence.alphabet.length - 1) {
        this.counters[i]++
        return char
      }
      this.counters[i] = 0
    }
    this.counters.unshift(0)
    return char
  }
}

export default class AliasTables {
  aliases: Record<string, string>
  tableAliases: Record<string, string>
  tableNames: string[]
  charSeq: CharSequence

  constructor(tableNames: string[]) {
    this.tableNames = tableNames
    this.aliases = {}
    this.tableAliases = {}
    this.charSeq = new CharSequence()
  }

  isAliasingEnabled(json: QueryJson, datasource: Datasource) {
    const fieldLength = json.resource?.fields?.length
    if (!fieldLength || fieldLength <= 0) {
      return false
    }
    const writeOperations = [
      Operation.CREATE,
      Operation.UPDATE,
      Operation.DELETE,
    ]
    try {
      const sqlClient = getSQLClient(datasource)
      const isWrite = writeOperations.includes(json.endpoint.operation)
      if (
        isWrite &&
        (sqlClient === SqlClient.MY_SQL || sqlClient === SqlClient.MS_SQL)
      ) {
        return false
      }
    } catch (err) {
      // if we can't get an SQL client, we can't alias
      return false
    }
    return true
  }

  getAlias(tableName: string) {
    if (this.aliases[tableName]) {
      return this.aliases[tableName]
    }
    const char = this.charSeq.getCharacter()
    this.aliases[tableName] = char
    this.tableAliases[char] = tableName
    return char
  }

  aliasField(field: string) {
    const tableNames = this.tableNames
    if (field.includes(".")) {
      const [tableName, column] = field.split(".")
      const foundTableName = tableNames.find(name => {
        const idx = tableName.indexOf(name)
        if (idx === -1 || idx > 1) {
          return
        }
        // this might look a bit mad, but the idea is if the field is wrapped, say in "", `` or []
        // then the idx of the table name will be 1, and we should allow for it ending in a closing
        // character - otherwise it should be the full length if the index is zero
        const allowedCharacterDiff = idx * 2
        return Math.abs(tableName.length - name.length) <= allowedCharacterDiff
      })
      if (foundTableName) {
        const aliasedTableName = tableName.replace(
          foundTableName,
          this.getAlias(foundTableName)
        )
        field = `${aliasedTableName}.${column}`
      }
    }
    return field
  }

  reverse<T extends Row | Row[]>(rows: T): T {
    const process = (row: Row) => {
      const final: Row = {}
      for (let [key, value] of Object.entries(row)) {
        if (!key.includes(".")) {
          final[key] = value
        } else {
          const [alias, column] = key.split(".")
          const tableName = this.tableAliases[alias] || alias
          final[`${tableName}.${column}`] = value
        }
      }
      return final
    }
    if (Array.isArray(rows)) {
      return rows.map(row => process(row)) as T
    } else {
      return process(rows) as T
    }
  }

  aliasMap(tableNames: (string | undefined)[]) {
    const map: Record<string, string> = {}
    for (let tableName of tableNames) {
      if (tableName) {
        map[tableName] = this.getAlias(tableName)
      }
    }
    return map
  }

  async queryWithAliasing(json: QueryJson): DatasourcePlusQueryResponse {
    const datasourceId = json.endpoint.datasourceId
    const datasource = await sdk.datasources.get(datasourceId)

    const aliasingEnabled = this.isAliasingEnabled(json, datasource)
    if (aliasingEnabled) {
      json = cloneDeep(json)
      // run through the query json to update anywhere a table may be used
      if (json.resource?.fields) {
        json.resource.fields = json.resource.fields.map(field =>
          this.aliasField(field)
        )
      }
      if (json.filters) {
        for (let [filterKey, filter] of Object.entries(json.filters)) {
          if (typeof filter !== "object") {
            continue
          }
          const aliasedFilters: typeof filter = {}
          for (let key of Object.keys(filter)) {
            aliasedFilters[this.aliasField(key)] = filter[key]
          }
          json.filters[filterKey as keyof SearchFilters] = aliasedFilters
        }
      }
      if (json.meta?.table) {
        this.getAlias(json.meta.table.name)
      }
      if (json.meta?.tables) {
        Object.keys(json.meta.tables).forEach(tableName =>
          this.getAlias(tableName)
        )
      }
      if (json.relationships) {
        json.relationships = json.relationships.map(relationship => ({
          ...relationship,
          aliases: this.aliasMap([
            relationship.through,
            relationship.tableName,
            json.endpoint.entityId,
          ]),
        }))
      }
      // invert and return
      const invertedTableAliases: Record<string, string> = {}
      for (let [key, value] of Object.entries(this.tableAliases)) {
        invertedTableAliases[value] = key
      }
      json.tableAliases = invertedTableAliases
    }
    const response = await makeExternalQuery(datasource, json)
    if (Array.isArray(response) && aliasingEnabled) {
      return this.reverse(response)
    } else {
      return response
    }
  }
}
