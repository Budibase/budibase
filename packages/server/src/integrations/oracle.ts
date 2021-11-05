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
import oracledb, { Result } from "oracledb"
import { Connection } from "oracledb"
import Sql from "./base/sql"
import { FieldTypes } from "../constants"
import {
  buildExternalTableId,
  convertType,
  finaliseExternalTables
} from "./utils"

module OracleModule {

  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

  interface OracleConfig {
    host: string
    port: number
    database: string
    user: string
    password: string
    // ssl?: boolean
    // ca?: string
    // rejectUnauthorized?: boolean
  }

  const SCHEMA: Integration = {
    docs: "https://docs",
    // plus: true,
    friendlyName: "Oracle",
    description: "description",
    datasource: {
      host: {
        type: DatasourceFieldTypes.STRING,
        default: "localhost",
        required: true,
      },
      port: {
        type: DatasourceFieldTypes.NUMBER,
        required: true,
        default: 1521,
      },
      database: {
        type: DatasourceFieldTypes.STRING,
        required: true,
      },
      user: {
        type: DatasourceFieldTypes.STRING,
        required: true,
      },
      password: {
        type: DatasourceFieldTypes.PASSWORD,
        required: true,
      },
      // ssl: {
      //   type: DatasourceFieldTypes.BOOLEAN,
      //   default: false,
      //   required: false,
      // },
      // rejectUnauthorized: {
      //   type: DatasourceFieldTypes.BOOLEAN,
      //   default: false,
      //   required: false,
      // },
      // ca: {
      //   type: DatasourceFieldTypes.LONGFORM,
      //   default: false,
      //   required: false,
      // },
    },
    query: {
      create: {
        type: QueryTypes.SQL,
      },
      read: {
        type: QueryTypes.SQL,
      },
      update: {
        type: QueryTypes.SQL,
      },
      delete: {
        type: QueryTypes.SQL,
      },
    },
  }

  const TYPE_MAP = {
    // TODO: type map
  }

  const internalQuery = async (connection: Connection, query: SqlQuery): Promise<Result<any> | null>=> { 
   try {
     const result: Result<any> = await connection.execute(
       `SELECT manager_id, department_id, department_name
        FROM departments
        WHERE manager_id = :id`,
       [103],  // bind value for :id
     );
     return result
   } catch (err) {
     console.error(err);
     return null
   } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
   }
  }

  class OracleIntegration extends Sql implements DatasourcePlus {
    private readonly config: OracleConfig
    private readonly client: any
    public tables: Record<string, Table> = {}
    public schemaErrors: Record<string, string> = {}

    constructor(config: OracleConfig) {
      super("oracle")
      this.config = config
    }

    getConnection = async (): Promise<Connection> => {
      //connectString : "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))(CONNECT_DATA =(SID= ORCL)))"
      const connectString = `${this.config.host}:${this.config.port || 1521}/${this.config.database}`
      const config = {
        user: this.config.user,
        password: this.config.user,
        connectString
      }
      return oracledb.getConnection(config);
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
      const connection = await this.getConnection()
      const result = await internalQuery(connection, input)
      if (result && result.rows && result.rows.length) {
        return result.rows
      } else {
        return [{ [operation]: true }]
      }
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: OracleIntegration,
  }
}
