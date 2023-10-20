import {
  DatasourceFieldType,
  Integration,
  Operation,
  ExternalTable,
  TableSchema,
  QueryJson,
  QueryType,
  SqlQuery,
  DatasourcePlus,
  DatasourceFeature,
  ConnectionInfo,
  SourceName,
} from "@budibase/types"
import {
  getSqlQuery,
  buildExternalTableId,
  convertSqlType,
  finaliseExternalTables,
  SqlClient,
} from "./utils"
import Sql from "./base/sql"
import { MSSQLTablesResponse, MSSQLColumn } from "./base/types"
import { getReadableErrorMessage } from "./base/errorMapping"
import sqlServer from "mssql"
const DEFAULT_SCHEMA = "dbo"

import { ConfidentialClientApplication } from "@azure/msal-node"

import { utils } from "@budibase/shared-core"

enum MSSQLConfigAuthType {
  AZURE_ACTIVE_DIRECTORY = "Azure Active Directory",
  NTLM = "NTLM",
}

interface BasicMSSQLConfig {
  user: string
  password: string
  server: string
  port: number | string
  database: string
  schema: string
  encrypt?: boolean
  authType?: MSSQLConfigAuthType
}

interface AzureADMSSQLConfig extends BasicMSSQLConfig {
  authType: MSSQLConfigAuthType.AZURE_ACTIVE_DIRECTORY
  adConfig: {
    clientId: string
    clientSecret: string
    tenantId: string
  }
}

interface NTLMMSSQLConfig extends BasicMSSQLConfig {
  authType: MSSQLConfigAuthType.NTLM
  ntlmConfig: {
    domain?: string
    trustServerCertificate?: boolean
  }
}

type MSSQLConfig =
  | (BasicMSSQLConfig & { authType?: undefined })
  | AzureADMSSQLConfig
  | NTLMMSSQLConfig

const SCHEMA: Integration = {
  docs: "https://github.com/tediousjs/node-mssql",
  plus: true,
  description:
    "Microsoft SQL Server is a relational database management system developed by Microsoft. ",
  friendlyName: "MS SQL Server",
  type: "Relational",
  features: {
    [DatasourceFeature.CONNECTION_CHECKING]: true,
    [DatasourceFeature.FETCH_TABLE_NAMES]: true,
    [DatasourceFeature.EXPORT_SCHEMA]: true,
  },
  datasource: {
    user: {
      type: DatasourceFieldType.STRING,
      required: true,
      default: "localhost",
    },
    password: {
      type: DatasourceFieldType.PASSWORD,
      required: true,
    },
    server: {
      type: DatasourceFieldType.STRING,
      default: "localhost",
    },
    port: {
      type: DatasourceFieldType.NUMBER,
      required: false,
      default: 1433,
    },
    database: {
      type: DatasourceFieldType.STRING,
      default: "root",
    },
    schema: {
      type: DatasourceFieldType.STRING,
      default: DEFAULT_SCHEMA,
    },
    encrypt: {
      type: DatasourceFieldType.BOOLEAN,
      default: true,
    },
    authType: {
      type: DatasourceFieldType.SELECT,
      display: "Advanced auth",
      config: {
        options: [
          MSSQLConfigAuthType.AZURE_ACTIVE_DIRECTORY,
          MSSQLConfigAuthType.NTLM,
        ],
      },
    },
    adConfig: {
      type: DatasourceFieldType.FIELD_GROUP,
      default: true,
      display: "Configure Active Directory",
      hidden: `'{{authType}}' !== '${MSSQLConfigAuthType.AZURE_ACTIVE_DIRECTORY}'`,
      config: {
        openByDefault: true,
        nestedFields: true,
      },
      fields: {
        clientId: {
          type: DatasourceFieldType.STRING,
          required: true,
          display: "Client ID",
        },
        clientSecret: {
          type: DatasourceFieldType.PASSWORD,
          required: true,
          display: "Client secret",
        },
        tenantId: {
          type: DatasourceFieldType.STRING,
          required: true,
          display: "Tenant ID",
        },
      },
    },
    ntlmConfig: {
      type: DatasourceFieldType.FIELD_GROUP,
      default: true,
      display: "Configure NTLM",
      hidden: `'{{authType}}' !== '${MSSQLConfigAuthType.NTLM}'`,
      config: {
        openByDefault: true,
        nestedFields: true,
      },
      fields: {
        domain: {
          type: DatasourceFieldType.STRING,
          required: false,
          display: "Domain",
        },
        trustServerCertificate: {
          type: DatasourceFieldType.BOOLEAN,
          required: false,
          display: "Trust server certificate",
        },
      },
    },
  },
  query: {
    create: {
      type: QueryType.SQL,
    },
    read: {
      type: QueryType.SQL,
    },
    update: {
      type: QueryType.SQL,
    },
    delete: {
      type: QueryType.SQL,
    },
  },
}

class SqlServerIntegration extends Sql implements DatasourcePlus {
  private readonly config: MSSQLConfig
  private index: number = 0
  private client?: sqlServer.ConnectionPool
  public tables: Record<string, ExternalTable> = {}
  public schemaErrors: Record<string, string> = {}

  MASTER_TABLES = [
    "spt_fallback_db",
    "spt_fallback_dev",
    "spt_fallback_usg",
    "spt_monitor",
    "MSreplication_options",
  ]
  TABLES_SQL =
    "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'"

  constructor(config: MSSQLConfig) {
    super(SqlClient.MS_SQL)
    this.config = config
  }

  async testConnection() {
    const response: ConnectionInfo = {
      connected: false,
    }
    try {
      await this.connect()
      response.connected = true
    } catch (e: any) {
      response.error = e.message
    }
    return response
  }

  getBindingIdentifier(): string {
    return `@p${this.index++}`
  }

  getStringConcat(parts: string[]): string {
    return `concat(${parts.join(", ")})`
  }

  async connect() {
    try {
      // if encrypt is undefined, then default is to encrypt
      const encrypt = this.config.encrypt === undefined || this.config.encrypt
      const clientCfg: sqlServer.config = {
        user: this.config.user,
        password: this.config.password,
        server: this.config.server,
        database: this.config.database,
        port: +this.config.port,
        options: {
          encrypt,
          enableArithAbort: true,
        },
      }
      if (encrypt) {
        clientCfg.options!.trustServerCertificate = true
      }

      switch (this.config.authType) {
        case MSSQLConfigAuthType.AZURE_ACTIVE_DIRECTORY:
          const { clientId, tenantId, clientSecret } =
            this.config.adConfig || {}
          const clientApp = new ConfidentialClientApplication({
            auth: {
              clientId,
              authority: `https://login.microsoftonline.com/${tenantId}`,
              clientSecret,
            },
          })

          const response = await clientApp.acquireTokenByClientCredential({
            scopes: ["https://database.windows.net/.default"],
          })

          clientCfg.authentication = {
            type: "azure-active-directory-access-token",
            options: {
              token: response!.accessToken,
            },
          }
          break
        case MSSQLConfigAuthType.NTLM:
          const { domain, trustServerCertificate } =
            this.config.ntlmConfig || {}
          clientCfg.authentication = {
            type: "ntlm",
            options: {
              domain,
            },
          }
          clientCfg.options ??= {}
          clientCfg.options.trustServerCertificate = !!trustServerCertificate
          break
        case null:
        case undefined:
          break
        default:
          utils.unreachable(this.config)
      }

      const pool = new sqlServer.ConnectionPool(clientCfg)

      this.client = await pool.connect()
    } catch (err: any) {
      if (err?.originalError?.errors?.length) {
        const messages = []
        if (err.message) {
          messages.push(err.message)
        }
        messages.push(...err.originalError.errors.map((e: any) => e.message))
        throw new Error(messages.join("\n"))
      }

      throw err
    }
  }

  async internalQuery(
    query: SqlQuery,
    operation: string | undefined = undefined
  ) {
    const client = this.client!
    const request = client.request()
    this.index = 0
    try {
      if (Array.isArray(query.bindings)) {
        let count = 0
        for (let binding of query.bindings) {
          request.input(`p${count++}`, binding)
        }
      }
      // this is a hack to get the inserted ID back,
      //  no way to do this with Knex nicely
      const sql =
        operation === Operation.CREATE
          ? `${query.sql}; SELECT SCOPE_IDENTITY() AS id;`
          : query.sql
      return await request.query(sql)
    } catch (err: any) {
      let readableMessage = getReadableErrorMessage(
        SourceName.SQL_SERVER,
        err.number
      )
      if (readableMessage) {
        throw new Error(readableMessage)
      } else {
        throw new Error(err.message as string)
      }
    }
  }

  getDefinitionSQL(tableName: string, schemaName: string) {
    return `select *
            from INFORMATION_SCHEMA.COLUMNS
            where TABLE_NAME='${tableName}' AND TABLE_SCHEMA='${schemaName}'`
  }

  getConstraintsSQL(tableName: string) {
    return `SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS TC 
            INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KU
              ON TC.CONSTRAINT_TYPE = 'PRIMARY KEY' 
              AND TC.CONSTRAINT_NAME = KU.CONSTRAINT_NAME 
              AND KU.table_name='${tableName}'
            ORDER BY 
              KU.TABLE_NAME,
              KU.ORDINAL_POSITION;`
  }

  getAutoColumnsSQL(tableName: string) {
    return `SELECT 
            COLUMNPROPERTY(OBJECT_ID(TABLE_SCHEMA+'.'+TABLE_NAME),COLUMN_NAME,'IsComputed') 
              AS IS_COMPUTED,
            COLUMNPROPERTY(object_id(TABLE_SCHEMA+'.'+TABLE_NAME), COLUMN_NAME, 'IsIdentity')
              AS IS_IDENTITY,
            *
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME='${tableName}'`
  }

  async runSQL(sql: string) {
    return (await this.internalQuery(getSqlQuery(sql))).recordset
  }

  /**
   * Fetches the tables from the sql server database and assigns them to the datasource.
   * @param {*} datasourceId - datasourceId to fetch
   * @param entities - the tables that are to be built
   */
  async buildSchema(
    datasourceId: string,
    entities: Record<string, ExternalTable>
  ) {
    await this.connect()
    let tableInfo: MSSQLTablesResponse[] = await this.runSQL(this.TABLES_SQL)
    if (tableInfo == null || !Array.isArray(tableInfo)) {
      throw "Unable to get list of tables in database"
    }

    const schemaName = this.config.schema || DEFAULT_SCHEMA
    const tableNames = tableInfo
      .filter((record: any) => record.TABLE_SCHEMA === schemaName)
      .map((record: any) => record.TABLE_NAME)
      .filter((name: string) => this.MASTER_TABLES.indexOf(name) === -1)

    const tables: Record<string, ExternalTable> = {}
    for (let tableName of tableNames) {
      // get the column definition (type)
      const definition = await this.runSQL(
        this.getDefinitionSQL(tableName, schemaName)
      )
      // find primary key constraints
      const constraints = await this.runSQL(this.getConstraintsSQL(tableName))
      // find the computed and identity columns (auto columns)
      const columns: MSSQLColumn[] = await this.runSQL(
        this.getAutoColumnsSQL(tableName)
      )
      const primaryKeys = constraints
        .filter(
          (constraint: any) => constraint.CONSTRAINT_TYPE === "PRIMARY KEY"
        )
        .map((constraint: any) => constraint.COLUMN_NAME)
      const autoColumns = columns
        .filter(col => col.IS_COMPUTED || col.IS_IDENTITY)
        .map(col => col.COLUMN_NAME)
      const requiredColumns = columns
        .filter(col => col.IS_NULLABLE === "NO")
        .map(col => col.COLUMN_NAME)

      let schema: TableSchema = {}
      for (let def of definition) {
        const name = def.COLUMN_NAME
        if (typeof name !== "string") {
          continue
        }
        const hasDefault = def.COLUMN_DEFAULT
        const isAuto = !!autoColumns.find(col => col === name)
        const required = !!requiredColumns.find(col => col === name)
        schema[name] = {
          autocolumn: isAuto,
          name: name,
          constraints: {
            presence: required && !isAuto && !hasDefault,
          },
          ...convertSqlType(def.DATA_TYPE),
          externalType: def.DATA_TYPE,
        }
      }
      tables[tableName] = {
        _id: buildExternalTableId(datasourceId, tableName),
        sourceId: datasourceId,
        primary: primaryKeys,
        name: tableName,
        schema,
      }
    }
    const final = finaliseExternalTables(tables, entities)
    this.tables = final.tables
    this.schemaErrors = final.errors
  }

  async queryTableNames() {
    let tableInfo: MSSQLTablesResponse[] = await this.runSQL(this.TABLES_SQL)
    const schema = this.config.schema || DEFAULT_SCHEMA
    return tableInfo
      .filter((record: any) => record.TABLE_SCHEMA === schema)
      .map((record: any) => record.TABLE_NAME)
      .filter((name: string) => this.MASTER_TABLES.indexOf(name) === -1)
  }

  async getTableNames() {
    await this.connect()
    return this.queryTableNames()
  }

  async read(query: SqlQuery | string) {
    await this.connect()
    const response = await this.internalQuery(getSqlQuery(query))
    return response.recordset
  }

  async create(query: SqlQuery | string) {
    await this.connect()
    const response = await this.internalQuery(getSqlQuery(query))
    return response.recordset || [{ created: true }]
  }

  async update(query: SqlQuery | string) {
    await this.connect()
    const response = await this.internalQuery(getSqlQuery(query))
    return response.recordset || [{ updated: true }]
  }

  async delete(query: SqlQuery | string) {
    await this.connect()
    const response = await this.internalQuery(getSqlQuery(query))
    return response.recordset || [{ deleted: true }]
  }

  async query(json: QueryJson) {
    const schema = this.config.schema
    await this.connect()
    if (schema && schema !== DEFAULT_SCHEMA && json?.endpoint) {
      json.endpoint.schema = schema
    }
    const operation = this._operation(json)
    const queryFn = (query: any, op: string) => this.internalQuery(query, op)
    const processFn = (result: any) =>
      result.recordset ? result.recordset : [{ [operation]: true }]
    return this.queryWithReturning(json, queryFn, processFn)
  }

  async getExternalSchema() {
    // Query to retrieve table schema
    const query = `
  SELECT
    t.name AS TableName,
    c.name AS ColumnName,
    ty.name AS DataType,
    c.max_length AS MaxLength,
    c.is_nullable AS IsNullable,
    c.is_identity AS IsIdentity
  FROM
    sys.tables t
    INNER JOIN sys.columns c ON t.object_id = c.object_id
    INNER JOIN sys.types ty ON c.system_type_id = ty.system_type_id
  WHERE
    t.is_ms_shipped = 0
  ORDER BY
    t.name, c.column_id
`

    await this.connect()

    const result = await this.internalQuery({
      sql: query,
    })

    const scriptParts = []
    const tables: any = {}
    for (const row of result.recordset) {
      const {
        TableName,
        ColumnName,
        DataType,
        MaxLength,
        IsNullable,
        IsIdentity,
      } = row

      if (!tables[TableName]) {
        tables[TableName] = {
          columns: [],
        }
      }

      const columnDefinition = `${ColumnName} ${DataType}${
        MaxLength ? `(${MaxLength})` : ""
      }${IsNullable ? " NULL" : " NOT NULL"}`

      tables[TableName].columns.push(columnDefinition)

      if (IsIdentity) {
        tables[TableName].identityColumn = ColumnName
      }
    }

    // Generate SQL statements for table creation
    for (const tableName in tables) {
      const { columns, identityColumn } = tables[tableName]

      let createTableStatement = `CREATE TABLE [${tableName}] (\n`
      createTableStatement += columns.join(",\n")

      if (identityColumn) {
        createTableStatement += `,\n CONSTRAINT [PK_${tableName}] PRIMARY KEY (${identityColumn})`
      }

      createTableStatement += "\n);"

      scriptParts.push(createTableStatement)
    }

    const schema = scriptParts.join("\n")
    return schema
  }
}

export default {
  schema: SCHEMA,
  integration: SqlServerIntegration,
}
