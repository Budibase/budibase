import {
  QueryJson,
  SearchFilters,
  Table,
  Row,
  DatasourcePlusQueryResponse,
} from "@budibase/types"
import { getDatasourceAndQuery } from "../../../sdk/app/rows/utils"
import { cloneDeep } from "lodash"

export default class AliasTables {
  character: string
  aliases: Record<string, string>
  tableAliases: Record<string, string>
  tableNames: string[]

  constructor(tableNames: string[]) {
    this.tableNames = tableNames
    this.character = "a"
    this.aliases = {}
    this.tableAliases = {}
  }

  getAlias(tableName: string) {
    if (this.aliases[tableName]) {
      return this.aliases[tableName]
    }
    const char = this.character
    this.aliases[tableName] = char
    this.tableAliases[char] = tableName
    this.character =
      char.substring(0, char.length - 1) +
      String.fromCharCode(char.charCodeAt(char.length - 1) + 1)
    // reached end of characters, extend number of characters used
    if (this.character.charAt(this.character.length - 1) === "z") {
      this.character = new Array(this.character.length + 1).fill("a").join("")
    }
    return char
  }

  aliasField(field: string) {
    const tableNames = this.tableNames
    if (field.includes(".")) {
      const [tableName, column] = field.split(".")
      if (tableNames.includes(tableName)) {
        return `${this.getAlias(tableName)}.${column}`
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
    json = cloneDeep(json)
    const aliasTable = (table: Table) => ({
      ...table,
      name: this.getAlias(table.name),
    })
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
    if (json.meta?.table) {
      json.meta.table = aliasTable(json.meta.table)
    }
    if (json.meta?.tables) {
      const aliasedTables: Record<string, Table> = {}
      for (let [tableName, table] of Object.entries(json.meta.tables)) {
        aliasedTables[this.getAlias(tableName)] = aliasTable(table)
      }
      json.meta.tables = aliasedTables
    }
    // invert and return
    const invertedTableAliases: Record<string, string> = {}
    for (let [key, value] of Object.entries(this.tableAliases)) {
      invertedTableAliases[value] = key
    }
    json.tableAliases = invertedTableAliases
    const response = await getDatasourceAndQuery(json)
    if (Array.isArray(response)) {
      return this.reverse(response)
    } else {
      return response
    }
  }
}
