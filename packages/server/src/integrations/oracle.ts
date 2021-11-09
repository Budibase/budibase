import {
  Integration,
  DatasourceFieldTypes,
  QueryTypes,
  SqlQuery,
} from "../definitions/datasource"
import { getSqlQuery } from "./utils"
import oracledb, { ExecuteOptions, Result,  Connection, ConnectionAttributes  } from "oracledb"
import Sql from "./base/sql"

module OracleModule {

  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

  interface OracleConfig {
    host: string
    port: number
    database: string
    user: string
    password: string
  }

  const SCHEMA: Integration = {
    docs: "https://github.com/oracle/node-oracledb",
    friendlyName: "Oracle",
    description: "Oracle Database is an object-relational database management system developed by Oracle Corporation",
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
      }
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
  class OracleIntegration extends Sql {

    private readonly config: OracleConfig

    constructor(config: OracleConfig) {
      super("oracle")
      this.config = config
    }

    private query = async (query: SqlQuery): Promise<Result<any>> => { 
      let connection
      try {
        connection = await this.getConnection()

        const options : ExecuteOptions = { autoCommit: true }
        const result: Result<any> = await connection.execute(query.sql, [], options)

        return result
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

    private getConnection = async (): Promise<Connection> => {
      //connectString : "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))(CONNECT_DATA =(SID= ORCL)))"
      const connectString = `${this.config.host}:${this.config.port || 1521}/${this.config.database}`
      const attributes: ConnectionAttributes = {
        user: this.config.user,
        password: this.config.user,
        connectString,
      }
      return oracledb.getConnection(attributes);
    }

    async create(query: SqlQuery | string) {
      const response = await this.query(getSqlQuery(query))
      return response.rows && response.rows.length ? response.rows : [{ created: true }]
    }

    async read(query: SqlQuery | string) {
      const response = await this.query(getSqlQuery(query))
      return response.rows
    }

    async update(query: SqlQuery | string) {
      const response = await this.query(getSqlQuery(query))
      return response.rows && response.rows.length ? response.rows : [{ updated: true }]
    }

    async delete(query: SqlQuery | string) {
      const response = await this.query(getSqlQuery(query))
      return response.rows && response.rows.length ? response.rows : [{ deleted: true }]
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: OracleIntegration,
  }
}
