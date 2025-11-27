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
})
