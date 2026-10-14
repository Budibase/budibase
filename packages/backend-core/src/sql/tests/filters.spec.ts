import Sql from "../sql"
import { generateRowIdField } from "../utils"
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

  it.each(["string", "fuzzy"] as const)(
    "casts PostgreSQL UUID columns to text for %s filters",
    operator => {
      const table = buildTable({
        person_id: {
          name: "person_id",
          type: FieldType.STRING,
          externalType: "uuid",
          constraints: baseConstraints,
        },
      })
      const value = "f69d' OR '1'='1"
      const query = buildQuery(table, { [operator]: { person_id: value } })

      const result = new Sql(SqlClient.POSTGRES)._query(query) as SqlQuery

      expect(result.sql).toContain('"tbl"."person_id"::text ilike $1')
      expect(result.sql).not.toContain(value)
      expect(result.bindings?.[0]).toEqual(
        operator === "string" ? `${value}%` : `%${value}%`
      )
    }
  )

  it("keeps native UUID equality comparisons", () => {
    const table = buildTable({
      person_id: {
        name: "person_id",
        type: FieldType.STRING,
        externalType: "uuid",
        constraints: baseConstraints,
      },
    })
    const value = "f69df1ee-4c9e-561b-a24d-1af57af203bf"
    const query = buildQuery(table, { equal: { person_id: value } })

    const result = new Sql(SqlClient.POSTGRES)._query(query) as SqlQuery

    expect(result.sql).toContain('"tbl"."person_id" = $1')
    expect(result.sql).not.toContain("::text")
    expect(result.bindings?.[0]).toBe(value)
  })

  it.each([
    { operator: "string", aliased: true },
    { operator: "fuzzy", aliased: true },
    { operator: "string", aliased: false },
    { operator: "fuzzy", aliased: false },
  ])(
    "uses the related table schema for UUID $operator filters with aliases=$aliased",
    ({ operator, aliased }) => {
      const table = buildTable({
        person_id: {
          name: "person_id",
          type: FieldType.STRING,
          externalType: "text",
          constraints: baseConstraints,
        },
      })
      const relatedTable = {
        ...table,
        name: "persons",
        schema: {
          ...table.schema,
          person_id: {
            ...table.schema.person_id,
            externalType: "uuid",
          },
        },
      }
      const query = buildQuery(table, {
        [operator]: { "person.person_id": "F69D" },
      })
      query.tables.persons = relatedTable
      if (aliased) {
        query.tableAliases = { tbl: "a", persons: "b" }
      }
      query.relationships = [
        { tableName: "persons", column: "person", from: "id", to: "id" },
      ]

      const result = new Sql(SqlClient.POSTGRES)._query(query) as SqlQuery

      const tableName = aliased ? "b" : "persons"
      expect(result.sql).toContain(`"${tableName}"."person_id"::text ilike $1`)
      expect(result.bindings?.[0]).toEqual(
        operator === "string" ? "F69D%" : "%F69D%"
      )
    }
  )

  it.each(["string", "fuzzy"] as const)(
    "prioritizes aliases over table names for UUID %s filters",
    operator => {
      const table = buildTable({
        person_id: {
          name: "person_id",
          type: FieldType.STRING,
          externalType: "uuid",
          constraints: baseConstraints,
        },
      })
      const otherTable: Table = {
        ...table,
        _id: "a",
        name: "a",
        schema: {
          ...table.schema,
          person_id: {
            ...table.schema.person_id,
            externalType: "text",
          },
        },
      }
      const query = buildQuery(table, { [operator]: { person_id: "F69D" } })
      query.tables = { a: otherTable, tbl: table }
      query.tableAliases = { a: "b", tbl: "a" }

      const result = new Sql(SqlClient.POSTGRES)._query(query) as SqlQuery

      expect(result.sql).toContain('"a"."person_id"::text ilike $1')
      expect(result.bindings).toEqual([
        operator === "string" ? "F69D%" : "%F69D%",
        25,
      ])
    }
  )

  it.each([
    {
      operator: "equal",
      value: "2026-10-15T00:00:00+00:00",
      sql: '"b"."occurred" = $1',
      bindings: ["2026-10-15T00:00:00+00:00"],
    },
    {
      operator: "oneOf",
      value: ["2026-10-15T00:00:00+00:00"],
      sql: '"b"."occurred" in ($1)',
      bindings: ["2026-10-15T00:00:00+00:00"],
    },
    {
      operator: "range",
      value: { low: "2026-10-14T00:00:00+00:00" },
      sql: '"b"."occurred" >= $1',
      bindings: ["2026-10-14T00:00:00+00:00"],
    },
  ])("preserves related timestamp offsets in $operator filters", testCase => {
    const table = buildTable({})
    const relatedTable: Table = {
      ...table,
      _id: "events",
      name: "events",
      schema: {
        id: idField,
        occurred: {
          name: "occurred",
          type: FieldType.DATETIME,
          externalType: "timestamp with time zone",
          constraints: baseConstraints,
        },
      },
    }
    const query = buildQuery(table, {
      $and: {
        conditions: [
          { [testCase.operator]: { "1:event.occurred": testCase.value } },
        ],
      },
    })
    query.tables.events = relatedTable
    query.tableAliases = { tbl: "a", events: "b" }
    query.relationships = [
      { tableName: "events", column: "event", from: "id", to: "id" },
    ]

    const result = new Sql(SqlClient.POSTGRES)._query(query) as SqlQuery

    expect(result.sql).toContain(testCase.sql)
    expect(result.bindings).toEqual([...testCase.bindings, 25])
  })

  describe.each(["rel", "related", "b", "1:rel"])(
    "related date-only filters using %s",
    prefix => {
      const date = "2026-10-14T00:00:00.000Z"

      it.each([
        { operator: "equal", value: date, bindings: [date] },
        { operator: "notEqual", value: date, bindings: [date] },
        { operator: "oneOf", value: [date], bindings: [date] },
        { operator: "notOneOf", value: [date], bindings: [date] },
        {
          operator: "range",
          value: { low: date, high: date },
          bindings: [date, date],
        },
      ])("preserves existing $operator value parsing", testCase => {
        const table = {
          ...buildTable({
            birthday: {
              name: "birthday",
              type: FieldType.STRING,
              constraints: baseConstraints,
            },
          }),
          sourceType: TableSourceType.INTERNAL,
        }
        const relatedTable: Table = {
          ...table,
          _id: "related",
          name: "related",
          schema: {
            id: idField,
            birthday: {
              name: "birthday",
              type: FieldType.DATETIME,
              dateOnly: true,
              constraints: baseConstraints,
            },
          },
        }
        const query = buildQuery(table, {
          $and: {
            conditions: [
              {
                [testCase.operator]: {
                  [`${prefix}.user_birthday`]: testCase.value,
                },
              },
            ],
          },
        })
        query.tables.related = relatedTable
        query.tableAliases = { tbl: "a", related: "b" }
        query.relationships = [
          { tableName: "related", column: "rel", from: "id", to: "id" },
        ]
        query.meta = { columnPrefix: "user_" }

        const result = new Sql(SqlClient.SQL_LITE)._query(query) as SqlQuery

        expect(result.sql).toContain("`b`.`user_birthday`")
        expect(result.bindings).toEqual([...testCase.bindings, 25])
      })
    }
  )

  describe("external related row ID values", () => {
    const buildRelatedIdQuery = (filters: SearchFilters) => {
      const table = buildTable({
        person_id: {
          name: "person_id",
          type: FieldType.STRING,
          externalType: "text",
          constraints: baseConstraints,
        },
      })
      const query = buildQuery(table, filters)
      query.tables.persons = {
        ...table,
        name: "persons",
        primary: ["person_id"],
      }
      query.tableAliases = { tbl: "a", persons: "b" }
      query.relationships = [
        {
          tableName: "persons",
          column: "person",
          from: "person_id",
          to: "person_id",
        },
      ]
      return query
    }

    it.each([
      { value: "50%off", expected: "50%off" },
      { value: null, expected: null },
      { value: 0, expected: 0 },
      { value: generateRowIdField(["person-123"]), expected: "person-123" },
    ])("preserves the equality binding for $value", ({ value, expected }) => {
      const query = buildRelatedIdQuery({ equal: { "person._id": value } })

      const result = new Sql(SqlClient.POSTGRES)._query(query) as SqlQuery

      expect(result.sql).toContain('"b"."person_id" = $1')
      expect(result.bindings).toEqual([expected, 25])
    })

    it.each(["oneOf", "notOneOf"] as const)(
      "preserves mixed raw, encoded, and null values in %s filters",
      operator => {
        const query = buildRelatedIdQuery({
          [operator]: {
            "person._id": [
              "50%off",
              generateRowIdField(["person-123"]),
              null,
              0,
            ],
          },
        })

        const result = new Sql(SqlClient.POSTGRES)._query(query) as SqlQuery

        expect(result.bindings).toEqual(["50%off", "person-123", null, 0, 25])
      }
    )
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

  it("builds Postgres oneOf filters with whereIn", () => {
    const table = buildTable({
      kind: {
        name: "kind",
        type: FieldType.STRING,
        externalType: "text",
        constraints: baseConstraints,
      },
    })
    const query = buildQuery(table, {
      oneOf: { kind: ["a", "b"] },
    })

    const result = new Sql(SqlClient.POSTGRES)._query(query) as SqlQuery

    expect(result.sql.toLowerCase()).toContain('"kind" in ($1, $2)')
    expect(result.sql.toLowerCase()).not.toContain("is null")
    expect(result.bindings).toEqual(expect.arrayContaining(["a", "b"]))
  })

  it("builds Postgres notOneOf filters with whereNotIn and includes empty rows", () => {
    const table = buildTable({
      kind: {
        name: "kind",
        type: FieldType.STRING,
        externalType: "text",
        constraints: baseConstraints,
      },
    })
    const query = buildQuery(table, {
      notOneOf: { kind: ["a", "b"] },
    })

    const result = new Sql(SqlClient.POSTGRES)._query(query) as SqlQuery

    expect(result.sql.toLowerCase()).toContain('"kind" not in ($1, $2)')
    expect(result.sql.toLowerCase()).toContain('"kind" is null')
    expect(result.bindings).toEqual(expect.arrayContaining(["a", "b"]))
  })
})
