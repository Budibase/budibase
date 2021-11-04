import {
  Integration,
  DatasourceFieldTypes,
  QueryTypes,
  QueryJson,
  SqlQuery,
} from "../definitions/datasource"
import { Table } from "../definitions/common"
import { getSqlQuery } from "./utils"
import { DatasourcePlus } from "./base/datasourcePlus"

module OracleModule {
  // TODO: oracle js lib
  // const connection = require("oracle") 
  const Sql = require("./base/sql")
  const { FieldTypes } = require("../constants")
  const {
    buildExternalTableId,
    convertType,
    finaliseExternalTables,
  } = require("./utils")

  interface OracleConfig {
    // TODO: Connection config 
  }

  const SCHEMA: Integration = {
    docs: "https://docs",
    // plus: true,
    friendlyName: "Oracle",
    description: "description",
    datasource: {
      // TODO: datasource config
    },
    query: {
      // TODO: query config
    },
  }

  const TYPE_MAP = {
    // TODO: type map
  }

  async function internalQuery(client: any, query: SqlQuery) {
   // TODO: Use oracle lib to run query
   const rows = []

   return rows
  }

  class OracleIntegration extends Sql implements DatasourcePlus {
    private readonly config: OracleConfig
    private readonly client: any
    public tables: Record<string, Table> = {}
    public schemaErrors: Record<string, string> = {}

    constructor(config: OracleConfig) {
      super("oracle")
      this.config = config    
      //todo init client
    }

    /**
     * Fetches the tables from the postgres table and assigns them to the datasource.
     * @param {*} datasourceId - datasourceId to fetch
     * @param entities - the tables that are to be built
     */
    async buildSchema(datasourceId: string, entities: Record<string, Table>) {
      // get the tables
      const tables: { [key: string]: Table } = {}

      // get the base table data
      // {
      //   _id: buildExternalTableId(datasourceId, tableName),
      //   primary: tableKeys[tableName] || [],
      //   name: tableName,
      //   schema: {},
      // }

      // get the schema 
      // {
      //   autocolumn: isAuto,
      //   name: columnName,
      //   type,
      // }

      const final = finaliseExternalTables(tables, entities)
      this.tables = final.tables
      this.schemaErrors = final.errors
    }

    // async create(query: SqlQuery | string) {
    //   const response = await internalQuery(this.client, getSqlQuery(query))
    //   return response.rows.length ? response.rows : [{ created: true }]
    // }

    // async read(query: SqlQuery | string) {
    //   const response = await internalQuery(this.client, getSqlQuery(query))
    //   return response.rows
    // }

    // async update(query: SqlQuery | string) {
    //   const response = await internalQuery(this.client, getSqlQuery(query))
    //   return response.rows.length ? response.rows : [{ updated: true }]
    // }

    // async delete(query: SqlQuery | string) {
    //   const response = await internalQuery(this.client, getSqlQuery(query))
    //   return response.rows.length ? response.rows : [{ deleted: true }]
    // }

    async query(json: QueryJson) {
      const operation = this._operation(json).toLowerCase()
      const input = this._query(json)
      const response = await internalQuery(this.client, input)
      return response.rows.length ? response.rows : [{ [operation]: true }]
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: OracleIntegration,
  }
}
