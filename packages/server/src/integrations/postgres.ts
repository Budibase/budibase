import {
  Integration,
  DatasourceFieldType,
  QueryType,
  SqlQuery,
  Table,
  DatasourcePlus,
  DatasourceFeature,
  ConnectionInfo,
  SourceName,
  Schema,
  TableSourceType,
  DatasourcePlusQueryResponse,
  SqlClient,
  EnrichedQueryJson,
  SqlQueryBinding,
  DatasourceRelationshipConfig,
  DatasourceRelationshipType,
} from "@budibase/types"
import {
  getSqlQuery,
  buildExternalTableId,
  generateColumnDefinition,
  finaliseExternalTables,
  checkExternalTables,
  HOST_ADDRESS,
} from "./utils"
import { PostgresColumn } from "./base/types"
import { escapeDangerousCharacters } from "../utilities"
import { v4 as uuidv4 } from "uuid"

import { Client, ClientConfig, types } from "pg"
import { getReadableErrorMessage } from "./base/errorMapping"
import { sql } from "@budibase/backend-core"

// Return "date" and "timestamp" types as plain strings.
// This lets us reference the original stored timezone.
// types is undefined when running in a test env for some reason.
if (types) {
  types.setTypeParser(1114, (val: unknown) => val) // timestamp
  types.setTypeParser(1082, (val: unknown) => val) // date
  types.setTypeParser(1184, (val: unknown) => val) // timestampz
}

const JSON_REGEX = /'{\s*.*?\s*}'::json/gs
const Sql = sql.Sql

interface PostgresConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
  schema: string
  ssl?: boolean
  ca?: string
  clientKey?: string
  clientCert?: string
  rejectUnauthorized?: boolean
}

const SCHEMA: Integration = {
  docs: "https://node-postgres.com",
  plus: true,
  friendlyName: "PostgreSQL",
  type: "Relational",
  description:
    "PostgreSQL, also known as Postgres, is a free and open-source relational database management system emphasizing extensibility and SQL compliance.",
  features: {
    [DatasourceFeature.CONNECTION_CHECKING]: true,
    [DatasourceFeature.FETCH_TABLE_NAMES]: true,
  },
  relationships: true,
  datasource: {
    host: {
      type: DatasourceFieldType.STRING,
      default: HOST_ADDRESS,
      required: true,
    },
    port: {
      type: DatasourceFieldType.NUMBER,
      required: true,
      default: 5432,
    },
    database: {
      type: DatasourceFieldType.STRING,
      default: "postgres",
      required: true,
    },
    user: {
      type: DatasourceFieldType.STRING,
      default: "root",
      required: true,
    },
    password: {
      type: DatasourceFieldType.PASSWORD,
      default: "root",
      required: true,
    },
    schema: {
      type: DatasourceFieldType.STRING,
      default: "public",
      required: true,
    },
    ssl: {
      type: DatasourceFieldType.BOOLEAN,
      default: false,
      required: false,
    },
    rejectUnauthorized: {
      type: DatasourceFieldType.BOOLEAN,
      default: false,
      required: false,
    },
    ca: {
      display: "Server CA",
      type: DatasourceFieldType.LONGFORM,
      default: false,
      required: false,
    },
    clientKey: {
      display: "Client key",
      type: DatasourceFieldType.LONGFORM,
      default: false,
      required: false,
    },
    clientCert: {
      display: "Client cert",
      type: DatasourceFieldType.LONGFORM,
      default: false,
      required: false,
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

function processBindings(bindings: SqlQueryBinding): SqlQueryBinding {
  return bindings.map(binding => {
    if (binding instanceof Date) {
      return binding.toISOString()
    }
    return binding
  })
}

class PostgresIntegration extends Sql implements DatasourcePlus {
  private readonly client: Client
  private readonly config: PostgresConfig
  private index = 1
  private open: boolean

  PRIMARY_KEYS_SQL = () => `
  SELECT pg_namespace.nspname table_schema
     , pg_class.relname table_name
     , pg_attribute.attname primary_key
  FROM pg_class
  JOIN pg_index ON pg_class.oid = pg_index.indrelid AND pg_index.indisprimary
  JOIN pg_attribute ON pg_attribute.attrelid = pg_class.oid AND pg_attribute.attnum = ANY(pg_index.indkey)
  JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
  WHERE pg_namespace.nspname = ANY(current_schemas(false))
  AND pg_table_is_visible(pg_class.oid)
  AND pg_class.relkind = 'r';
  `

  ENUM_VALUES = () => `
  SELECT t.typname,  
      e.enumlabel
  FROM pg_type t 
  JOIN pg_enum e on t.oid = e.enumtypid  
  JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace;
  `

  VIEWS_SQL = () => `
  SELECT DISTINCT pg_class.relname as view_name,
         pg_namespace.nspname as table_schema,
         pg_get_viewdef(pg_class.oid) as definition
  FROM pg_class
  JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
  WHERE pg_namespace.nspname = ANY(current_schemas(false))
    AND pg_table_is_visible(pg_class.oid)
    AND pg_class.relkind = 'v';
  `

  RELATIONSHIPS_SQL = () => `
  SELECT
    tc.table_schema,
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
  FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
  WHERE
    tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = ANY(current_schemas(false));
  `

  // SQL to identify junction tables for many-to-many relationships.
  // A junction table must have exactly 2 foreign keys that reference exactly 2 different tables,
  // and contain no additional non-nullable columns (ensuring it's purely a junction table).
  //
  // table_fks - Count FKs, distinct tables, and collect FK columns with ARRAY_AGG
  // valid_junction_tables - Filter for valid junction tables using ANY() operator
  // Main SELECT - Direct joins for final FK details
  JUNCTION_TABLES_SQL = () => `
  WITH table_fks AS (
    SELECT
      tc.table_name,
      COUNT(*) as fk_count,
      COUNT(DISTINCT ccu.table_name) as distinct_referenced_tables,
      ARRAY_AGG(kcu.column_name ORDER BY kcu.column_name) as fk_columns
    FROM
      information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
    WHERE
      tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = ANY(current_schemas(false))
    GROUP BY tc.table_name
  ),
  valid_junction_tables AS (
    SELECT table_name
    FROM table_fks
    WHERE fk_count = 2 AND distinct_referenced_tables = 2
      AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns c
        WHERE c.table_name = table_fks.table_name
          AND c.table_schema = ANY(current_schemas(false))
          AND NOT (c.column_name = ANY(table_fks.fk_columns))
          AND c.is_nullable = 'NO'
          AND c.column_default IS NULL
      )
  )
  SELECT
    jt.table_name as junction_table,
    ccu.table_name as referenced_table,
    kcu.column_name as fk_column,
    ccu.column_name as referenced_column
  FROM valid_junction_tables jt
  JOIN information_schema.table_constraints AS tc
    ON tc.table_name = jt.table_name
    AND tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = ANY(current_schemas(false))
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
  ORDER BY jt.table_name, ccu.table_name;
  `

  COLUMNS_SQL = () => `
  SELECT columns.*
  FROM information_schema.columns columns
  JOIN pg_class pg_class ON pg_class.relname = columns.table_name
  JOIN pg_namespace name_space ON name_space.oid = pg_class.relnamespace
  WHERE columns.table_schema = ANY(current_schemas(false))
    AND columns.table_schema = name_space.nspname
    AND pg_table_is_visible(pg_class.oid)
    AND pg_class.relkind = 'r';
  `

  constructor(config: PostgresConfig) {
    super(SqlClient.POSTGRES)
    this.config = config

    let newConfig: ClientConfig = {
      ...this.config,
      ssl: this.config.ssl
        ? {
            rejectUnauthorized: this.config.rejectUnauthorized,
            ca: this.config.ca,
            key: this.config.clientKey,
            cert: this.config.clientCert,
          }
        : undefined,
    }
    this.client = new Client(newConfig)
    this.open = false
  }

  async testConnection() {
    const response: ConnectionInfo = {
      connected: false,
    }

    try {
      await this.openConnection()
      response.connected = true
    } catch (e: any) {
      if (typeof e.message === "string" && e.message !== "") {
        response.error = e.message as string
      } else if (typeof e.code === "string" && e.code !== "") {
        response.error = e.code
      } else {
        response.error = "Unknown error"
      }
    } finally {
      await this.closeConnection()
    }
    return response
  }

  getBindingIdentifier(): string {
    return `$${this.index++}`
  }

  getStringConcat(parts: string[]): string {
    return parts.join(" || ")
  }

  async openConnection() {
    if (this.open) {
      return
    }
    try {
      await this.client.connect()
    } catch (error) {
      if ((error as Error).message.includes("already been connected")) {
        // Already connected, continue
      } else {
        throw error
      }
    }
    if (!this.config.schema) {
      this.config.schema = "public"
    }
    const search_path = this.config.schema
      .split(",")
      .map(item => `"${item.trim()}"`)
    await this.client.query(`SET search_path TO ${search_path.join(",")};`)
    await this.client.query(`SET TIME ZONE 'UTC';`)
    this.open = true
  }

  closeConnection() {
    const pg = this
    return new Promise<void>((resolve, reject) => {
      this.client.end((err: any) => {
        pg.open = false
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  async internalQuery(query: SqlQuery, close = true) {
    if (!this.open) {
      await this.openConnection()
    }
    const client = this.client
    this.index = 1
    // need to handle a specific issue with json data types in postgres,
    // new lines inside the JSON data will break it
    if (query && query.sql) {
      const matches = query.sql.match(JSON_REGEX)
      if (matches && matches.length > 0) {
        for (let match of matches) {
          const escaped = escapeDangerousCharacters(match)
          query.sql = query.sql.replace(match, escaped)
        }
      }
    }
    try {
      const bindings = processBindings(query.bindings || [])
      this.log(query.sql, bindings)
      return await client.query(query.sql, bindings)
    } catch (err: any) {
      await this.closeConnection()
      let readableMessage = getReadableErrorMessage(
        SourceName.POSTGRES,
        err.code
      )
      if (readableMessage) {
        throw new Error(readableMessage)
      } else {
        throw new Error(err.message as string)
      }
    } finally {
      if (close) {
        await this.closeConnection()
      }
    }
  }

  /**
   * Fetches the tables from the postgres table and assigns them to the datasource.
   * @param datasourceId - datasourceId to fetch
   * @param entities - the tables that are to be built
   */
  async buildSchema(
    datasourceId: string,
    entities: Record<string, Table>
  ): Promise<Schema> {
    let tableKeys: { [key: string]: string[] } = {}
    await this.openConnection()
    try {
      const primaryKeysResponse = await this.client.query(
        this.PRIMARY_KEYS_SQL()
      )
      for (let table of primaryKeysResponse.rows) {
        const tableName = table.table_name
        if (!tableKeys[tableName]) {
          tableKeys[tableName] = []
        }
        const key = table.column_name || table.primary_key
        // only add the unique keys
        if (key && tableKeys[tableName].indexOf(key) === -1) {
          tableKeys[tableName].push(key)
        }
      }
    } catch (err) {
      tableKeys = {}
    }

    try {
      const columnsResponse: { rows: PostgresColumn[] } =
        await this.client.query(this.COLUMNS_SQL())

      const tables: { [key: string]: Table } = {}

      // Fetch enum values
      const enumsResponse = await this.client.query(this.ENUM_VALUES())
      // output array, allows for more than 1 single-select to be used at a time
      const enumValues = enumsResponse.rows?.reduce((acc, row) => {
        return {
          ...acc,
          [row.typname]: [...(acc[row.typname] || []), row.enumlabel],
        }
      }, {})

      for (let column of columnsResponse.rows) {
        const tableName: string = column.table_name
        const columnName: string = column.column_name

        // table key doesn't exist yet
        if (!tables[tableName] || !tables[tableName].schema) {
          tables[tableName] = {
            type: "table",
            _id: buildExternalTableId(datasourceId, tableName),
            primary: tableKeys[tableName] || [],
            name: tableName,
            schema: {},
            sourceId: datasourceId,
            sourceType: TableSourceType.EXTERNAL,
          }
        }

        const identity = !!(
          column.identity_generation ||
          column.identity_start ||
          column.identity_increment
        )
        const hasDefault = column.column_default != null
        const hasNextVal =
          typeof column.column_default === "string" &&
          column.column_default.startsWith("nextval")
        const isGenerated =
          column.is_generated && column.is_generated !== "NEVER"
        const isAuto: boolean = hasNextVal || identity || isGenerated
        const required = column.is_nullable === "NO"
        tables[tableName].schema[columnName] = generateColumnDefinition({
          autocolumn: isAuto,
          name: columnName,
          presence: required && !hasDefault && !isGenerated,
          externalType: column.data_type,
          options: enumValues?.[column.udt_name],
          userDefinedType: column.udt_name,
        })
      }

      const finalizedTables = finaliseExternalTables(tables, entities)
      const errors = checkExternalTables(finalizedTables)
      return { tables: finalizedTables, errors }
    } catch (err) {
      // @ts-ignore
      throw new Error(err)
    } finally {
      await this.closeConnection()
    }
  }

  async getTableNames() {
    try {
      await this.openConnection()
      const columnsResponse: { rows: PostgresColumn[] } =
        await this.client.query(this.COLUMNS_SQL())
      const names = columnsResponse.rows.map(row => row.table_name)
      return [...new Set(names)]
    } finally {
      await this.closeConnection()
    }
  }

  async getViewNames() {
    try {
      await this.openConnection()
      const viewsResponse = await this.client.query(this.VIEWS_SQL())

      const views: string[] = viewsResponse.rows.map(row => row.view_name)

      return views
    } finally {
      await this.closeConnection()
    }
  }

  async getRelationships(
    tableNames?: string[]
  ): Promise<DatasourceRelationshipConfig[]> {
    try {
      await this.openConnection()

      // Get many-to-one relationships
      const relationshipsResponse = await this.client.query(
        this.RELATIONSHIPS_SQL()
      )

      // Get junction table information
      const junctionResponse = await this.client.query(
        this.JUNCTION_TABLES_SQL()
      )

      // Get list of junction table names
      const junctionTableNames = [
        ...new Set(junctionResponse.rows.map(row => row.junction_table)),
      ]

      // Create many-to-one relationship configs
      const manyToOneRelationships: DatasourceRelationshipConfig[] =
        relationshipsResponse.rows
          .filter(row => row.table_name !== row.foreign_table_name) // Exclude self-referencing relationships
          .filter(row => !junctionTableNames.includes(row.table_name)) // Exclude relationships from junction tables
          .filter(
            row =>
              !tableNames ||
              (tableNames.includes(row.table_name) &&
                tableNames.includes(row.foreign_table_name))
          ) // Filter for imported tables if tableNames is provided
          .map(row => ({
            _id: uuidv4(), // Generate a unique ID for the relationship
            label: `${row.table_name}.${row.column_name} → ${row.foreign_table_name}.${row.foreign_column_name}`,
            sourceTable: row.table_name,
            sourceColumn: row.column_name,
            targetTable: row.foreign_table_name,
            targetColumn: row.foreign_column_name,
            relationshipType: DatasourceRelationshipType.MANY_TO_ONE,
          }))

      // Create many-to-many relationship configs from junction tables
      const manyToManyRelationships: DatasourceRelationshipConfig[] = []
      const junctionGroups: { [key: string]: any[] } = {}

      // Group junction FKs by junction table
      junctionResponse.rows.forEach(row => {
        if (!junctionGroups[row.junction_table]) {
          junctionGroups[row.junction_table] = []
        }
        junctionGroups[row.junction_table].push(row)
      })

      // Create many-to-many relationships for each junction table
      Object.entries(junctionGroups).forEach(([junctionTable, fks]) => {
        if (fks.length === 2) {
          const [fk1, fk2] = fks
          // Sort the FKs by referenced table name to ensure consistent ordering
          const sortedFks = [fk1, fk2].sort((a, b) =>
            a.referenced_table.localeCompare(b.referenced_table)
          )
          const [firstFk, secondFk] = sortedFks

          // Only create if both referenced tables are in the imported tables (if tableNames provided)
          if (
            !tableNames ||
            (tableNames.includes(firstFk.referenced_table) &&
              tableNames.includes(secondFk.referenced_table))
          ) {
            manyToManyRelationships.push({
              _id: uuidv4(),
              label: `${firstFk.referenced_table} ↔ ${secondFk.referenced_table} (via ${junctionTable})`,
              sourceTable: secondFk.referenced_table, // Swap: second table becomes source
              sourceColumn: secondFk.fk_column, // FK column in junction table pointing to second table
              targetTable: firstFk.referenced_table, // Swap: first table becomes target
              targetColumn: firstFk.fk_column, // FK column in junction table pointing to first table
              relationshipType: DatasourceRelationshipType.MANY_TO_MANY,
              junctionTable: junctionTable,
            })
          }
        }
      })

      // Combine and sort all relationships
      const allRelationships = [
        ...manyToOneRelationships,
        ...manyToManyRelationships,
      ]
      const sortedRelationships = allRelationships.sort((a, b) => {
        // Sort by source table first, then by relationship type, then by source column
        if (a.sourceTable !== b.sourceTable) {
          return a.sourceTable.localeCompare(b.sourceTable)
        }
        if (a.relationshipType !== b.relationshipType) {
          return a.relationshipType.localeCompare(b.relationshipType)
        }
        return a.sourceColumn.localeCompare(b.sourceColumn)
      })

      return sortedRelationships
    } finally {
      await this.closeConnection()
    }
  }

  async create(query: SqlQuery | string) {
    const response = await this.internalQuery(getSqlQuery(query))
    return response.rows.length ? response.rows : [{ created: true }]
  }

  async read(query: SqlQuery | string) {
    const response = await this.internalQuery(getSqlQuery(query))
    return response.rows
  }

  async update(query: SqlQuery | string) {
    const response = await this.internalQuery(getSqlQuery(query))
    return response.rows.length ? response.rows : [{ updated: true }]
  }

  async delete(query: SqlQuery | string) {
    const response = await this.internalQuery(getSqlQuery(query))
    return response.rows.length ? response.rows : [{ deleted: true }]
  }

  async query(json: EnrichedQueryJson): Promise<DatasourcePlusQueryResponse> {
    const operation = this._operation(json).toLowerCase()
    const input = this._query(json) as SqlQuery
    if (Array.isArray(input)) {
      const responses = []
      for (let query of input) {
        responses.push(await this.internalQuery(query, false))
      }
      await this.closeConnection()
      return responses
    } else {
      const response = await this.internalQuery(input)
      return response.rows.length ? response.rows : [{ [operation]: true }]
    }
  }
}

export default {
  schema: SCHEMA,
  integration: PostgresIntegration,
}
