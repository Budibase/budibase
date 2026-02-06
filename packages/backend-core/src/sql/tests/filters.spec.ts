import Sql from "../sql"
import {
  EnrichedQueryJson,
  FieldConstraints,
  FieldSchema,
  FieldType,
  Operation,
  SearchFilters,
  SqlClient,
  SqlQuery,
  StringFieldSubType,
  Table,
  TableSchema,
  TableSourceType,
  RelationshipType,
} from "@budibase/types"

const baseConstraints: FieldConstraints = { presence: false }

const idField: FieldSchema = {
  name: "id",
  type: FieldType.NUMBER,
  autocolumn: true,
  externalType: "integer",
  constraints: baseConstraints,
}

function buildTable(schema: TableSchema): Table {
  return {
    _id: "tbl",
    type: "table",
    name: "tbl",
    sourceType: TableSourceType.EXTERNAL,
    sourceId: "ds",
    schema: {
      id: idField,
      ...schema,
    },
    primary: ["id"],
  }
}

function buildQuery(table: Table, filters: SearchFilters): EnrichedQueryJson {
  return {
    operation: Operation.READ,
    table,
    tables: { [table.name]: table },
    filters,
    paginate: { limit: 25, page: 1 },
    relationships: [],
    resource: { fields: [] },
    extra: { idFilter: {} },
  }
}

function buildWriteQuery(
  table: Table,
  filters: SearchFilters,
  operation: Operation.UPDATE | Operation.DELETE
): EnrichedQueryJson {
  return {
    operation,
    table,
    tables: { [table.name]: table },
    filters,
    relationships: [
      {
        tableName: "relTable",
        column: "rel",
        from: "rel",
        to: "id",
      },
    ],
    resource: { fields: [] },
    body: operation === Operation.UPDATE ? { name: "new" } : undefined,
  }
}

describe("SQL filter parameterization", () => {
  it("parameterizes Postgres JSON contains filters", () => {
    const table = buildTable({
      payload: {
        name: "payload",
        type: FieldType.JSON,
        externalType: "jsonb",
        constraints: baseConstraints,
      },
    })
    const malicious = "value' OR '1'='1"
    const query = buildQuery(table, {
      contains: { payload: [malicious] },
    })

    const result = new Sql(SqlClient.POSTGRES)._query(query) as SqlQuery

    expect(result.sql).toContain("::jsonb @> $1::jsonb")
    expect(result.sql).not.toContain(malicious)
    expect(result.bindings).toEqual(
      expect.arrayContaining([`["${malicious}"]`])
    )
  })

  it("parameterizes Postgres JSON containsAny filters", () => {
    const table = buildTable({
      payload: {
        name: "payload",
        type: FieldType.JSON,
        externalType: "jsonb",
        constraints: baseConstraints,
      },
    })
    const malicious = "test' || 'hack"
    const query = buildQuery(table, {
      containsAny: { payload: [malicious] },
    })

    const result = new Sql(SqlClient.POSTGRES)._query(query) as SqlQuery

    expect(result.sql).toContain("::jsonb ?| $1::text[]")
    expect(result.sql).not.toContain(malicious)
    expect(result.bindings?.[0]).toContain("test")
  })

  it("parameterizes Postgres enum string filters", () => {
    const table = buildTable({
      kind: {
        name: "kind",
        type: FieldType.OPTIONS,
        externalType: "USER-DEFINED",
        constraints: { ...baseConstraints, inclusion: ["one"] },
      },
    })
    const malicious = "aa' OR 'bb"
    const query = buildQuery(table, {
      string: { kind: malicious },
    })

    const result = new Sql(SqlClient.POSTGRES)._query(query) as SqlQuery

    expect(result.sql).toContain("::text ilike $1")
    expect(result.bindings).toEqual(expect.arrayContaining([`${malicious}%`]))
  })

  it("parameterizes Postgres array contains filters", () => {
    const table = buildTable({
      tags: {
        name: "tags",
        type: FieldType.STRING,
        subtype: StringFieldSubType.ARRAY,
        externalType: "ARRAY",
        constraints: baseConstraints,
      },
    })
    const malicious = '"alpha"'
    const query = buildQuery(table, {
      contains: { tags: [malicious] },
    })

    const result = new Sql(SqlClient.POSTGRES)._query(query) as SqlQuery

    expect(result.sql).toContain("@> $1::text[]")
    expect(result.sql).not.toContain(malicious)
    expect(result.bindings?.[0]).toContain("alpha")
  })

  it("parameterizes Postgres array containsAny filters", () => {
    const table = buildTable({
      tags: {
        name: "tags",
        type: FieldType.STRING,
        subtype: StringFieldSubType.ARRAY,
        externalType: "ARRAY",
        constraints: baseConstraints,
      },
    })
    const malicious = '"beta"'
    const query = buildQuery(table, {
      containsAny: { tags: [malicious] },
    })

    const result = new Sql(SqlClient.POSTGRES)._query(query) as SqlQuery

    expect(result.sql).toContain("&& $1::text[]")
    expect(result.sql).not.toContain(malicious)
    expect(result.bindings?.[0]).toContain("beta")
  })

  it("uses SQLite LIKE without LOWER for umlaut starts-with filters", () => {
    const table = buildTable({
      item: {
        name: "item",
        type: FieldType.STRING,
        externalType: "text",
        constraints: baseConstraints,
      },
    })
    const query = buildQuery(table, {
      string: { item: "Ü" },
    })
    query.meta = { sqliteUseLikeWithoutLower: true }

    const result = new Sql(SqlClient.SQL_LITE)._query(query) as SqlQuery

    expect(result.sql).toContain("LIKE")
    expect(result.sql).not.toContain("LOWER")
    expect(result.bindings).toEqual(expect.arrayContaining(["Ü%"]))
  })

  it("parameterizes MySQL JSON contains filters", () => {
    const table = buildTable({
      payload: {
        name: "payload",
        type: FieldType.JSON,
        externalType: "json",
        constraints: baseConstraints,
      },
    })
    const malicious = "note' }; DROP"
    const query = buildQuery(table, {
      contains: { payload: [malicious] },
    })

    const result = new Sql(SqlClient.MY_SQL)._query(query) as SqlQuery

    expect(result.sql).toContain("JSON_CONTAINS")
    expect(result.sql).not.toContain(malicious)
    expect(result.bindings).toEqual(
      expect.arrayContaining([`["${malicious}"]`])
    )
  })

  it("applies link empty filters for update queries", () => {
    const table = buildTable({
      name: {
        name: "name",
        type: FieldType.STRING,
        externalType: "text",
        constraints: baseConstraints,
      },
      rel: {
        name: "rel",
        type: FieldType.LINK,
        constraints: baseConstraints,
        fieldName: "rel",
        tableId: "relTableId",
        relationshipType: RelationshipType.MANY_TO_ONE,
      },
    })

    const query = buildWriteQuery(
      table,
      { empty: { rel: null } },
      Operation.UPDATE
    )
    const result = new Sql(SqlClient.POSTGRES)._query(query) as SqlQuery

    expect(result.sql.toLowerCase()).toEqual(
      'update "tbl" set "name" = $1 where not exists (select 1 from "reltable" as "reltable" where "reltable"."id" = "tbl"."rel") returning *'
    )
  })

  it("applies link notEmpty filters for delete queries", () => {
    const table = buildTable({
      name: {
        name: "name",
        type: FieldType.STRING,
        externalType: "text",
        constraints: baseConstraints,
      },
      rel: {
        name: "rel",
        type: FieldType.LINK,
        constraints: baseConstraints,
        fieldName: "rel",
        tableId: "relTableId",
        relationshipType: RelationshipType.MANY_TO_ONE,
      },
    })

    const query = buildWriteQuery(
      table,
      { notEmpty: { rel: null } },
      Operation.DELETE
    )
    const result = new Sql(SqlClient.POSTGRES)._query(query) as SqlQuery

    expect(result.sql.toLowerCase()).toEqual(
      'delete from "tbl" where exists (select 1 from "reltable" as "reltable" where "reltable"."id" = "tbl"."rel") returning *'
    )
  })
})
