import SqlTable from "../sqlTable"
import {
  FieldType,
  Operation,
  SqlClient,
  TableSourceType,
} from "@budibase/types"
import type { EnrichedQueryJson, SqlQuery, Table } from "@budibase/types"

const buildTable = ({
  name,
  column,
}: {
  name: string
  column: string
}): Table => ({
  _id: "tbl",
  type: "table",
  name,
  sourceId: "datasource",
  sourceType: TableSourceType.EXTERNAL,
  schema: {
    [column]: {
      name: column,
      type: FieldType.STRING,
    },
  },
})

const buildRenameQuery = ({
  tableName,
  oldColumn,
  updatedColumn,
  schema,
}: {
  tableName: string
  oldColumn: string
  updatedColumn: string
  schema?: string
}): EnrichedQueryJson => {
  const oldTable = buildTable({ name: tableName, column: oldColumn })
  const table = buildTable({ name: tableName, column: updatedColumn })

  return {
    operation: Operation.UPDATE_TABLE,
    table,
    tables: { [tableName]: table },
    schema,
    meta: {
      oldTable,
      renamed: {
        old: oldColumn,
        updated: updatedColumn,
      },
    },
  }
}

describe("SQL table identifier escaping", () => {
  it("escapes MySQL rename identifiers", () => {
    const query = buildRenameQuery({
      schema: "schema`; DROP TABLE audit; --",
      tableName: "table`; DROP TABLE users; --",
      oldColumn: "old`; SELECT SLEEP(10); --",
      updatedColumn: "new`name",
    })

    const result = new SqlTable(SqlClient.MY_SQL)._tableQuery(query) as SqlQuery

    expect(result).toEqual({
      sql: "alter table `schema``; DROP TABLE audit; --`.`table``; DROP TABLE users; --` rename column `old``; SELECT SLEEP(10); --` to `new``name`;",
      bindings: [],
    })
  })

  it("escapes SQL Server rename identifiers and string literals", () => {
    const query = buildRenameQuery({
      schema: "schema漢]",
      tableName: "table字'",
      oldColumn: "old名]'; DROP TABLE users; --",
      updatedColumn: "new列'name",
    })

    const result = new SqlTable(SqlClient.MS_SQL)._tableQuery(query)
    const queries = result as SqlQuery[]
    const renameQuery = queries.find(query =>
      query.sql.startsWith("exec sp_rename")
    )

    expect(renameQuery).toEqual({
      sql: "exec sp_rename N'[schema漢]]].[table字''].[old名]]''; DROP TABLE users; --]', N'new列''name', N'COLUMN'",
      bindings: [],
    })
  })
})

describe("Postgres JSON columns", () => {
  const oldTable: Table = {
    ...buildTable({ name: "documents", column: "title" }),
    primary: ["id"],
  }
  const table: Table = {
    ...oldTable,
    schema: {
      ...oldTable.schema,
      metadata: { name: "metadata", type: FieldType.JSON },
    },
  }

  it.each([
    [
      Operation.CREATE_TABLE,
      'create table "documents" ("id" serial primary key, "title" text, "metadata" json)',
    ],
    [
      Operation.UPDATE_TABLE,
      'alter table "documents" add column "metadata" json',
    ],
  ])("generates JSON DDL for %s", (operation, sql) => {
    expect(
      new SqlTable(SqlClient.POSTGRES)._tableQuery({
        operation,
        table,
        tables: { documents: table },
        meta: { oldTable },
      })
    ).toEqual([{ sql, bindings: [] }])
  })

  it.each([SqlClient.MY_SQL, SqlClient.MS_SQL, SqlClient.ORACLE])(
    "does not enable JSON creation for %s",
    client => {
      expect(() =>
        new SqlTable(client)._tableQuery({
          operation: Operation.CREATE_TABLE,
          table,
          tables: { documents: table },
        })
      ).toThrow("json is not a valid SQL type")
    }
  )
})
