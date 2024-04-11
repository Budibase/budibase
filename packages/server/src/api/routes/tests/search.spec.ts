import { tableForDatasource } from "../../../tests/utilities/structures"
import { DatabaseName, getDatasource } from "../../../integrations/tests/utils"

import * as setup from "./utilities"
import {
  Datasource,
  EmptyFilterOption,
  FieldType,
  Row,
  SearchFilters,
  Table,
} from "@budibase/types"

jest.unmock("mssql")

describe.each([
  ["internal", undefined],
  ["internal-sqs", undefined],
  [DatabaseName.POSTGRES, getDatasource(DatabaseName.POSTGRES)],
  [DatabaseName.MYSQL, getDatasource(DatabaseName.MYSQL)],
  [DatabaseName.SQL_SERVER, getDatasource(DatabaseName.SQL_SERVER)],
  [DatabaseName.MARIADB, getDatasource(DatabaseName.MARIADB)],
])("/api/:sourceId/search (%s)", (name, dsProvider) => {
  const isSqs = name === "internal-sqs"
  const config = setup.getConfig()

  let envCleanup: (() => void) | undefined
  let table: Table
  let datasource: Datasource | undefined

  beforeAll(async () => {
    if (isSqs) {
      envCleanup = config.setEnv({ SQS_SEARCH_ENABLE: "true" })
    }
    await config.init()
    if (dsProvider) {
      datasource = await config.createDatasource({
        datasource: await dsProvider,
      })
    }
  })

  afterAll(async () => {
    setup.afterAll()
    if (envCleanup) {
      envCleanup()
    }
  })

  describe("strings", () => {
    beforeAll(async () => {
      table = await config.api.table.save(
        tableForDatasource(datasource, {
          schema: {
            name: {
              name: "name",
              type: FieldType.STRING,
            },
          },
        })
      )
    })

    const rows = [{ name: "foo" }, { name: "bar" }]
    let savedRows: Row[]

    beforeAll(async () => {
      savedRows = await Promise.all(
        rows.map(r => config.api.row.save(table._id!, r))
      )
    })

    interface StringSearchTest {
      query: SearchFilters
      expected: (typeof rows)[number][]
    }

    const stringSearchTests: StringSearchTest[] = [
      // These three test cases are generic and don't really need
      // to be repeated for all data types, so we just do them here.
      { query: {}, expected: rows },
      {
        query: { onEmptyFilter: EmptyFilterOption.RETURN_ALL },
        expected: rows,
      },
      {
        query: { onEmptyFilter: EmptyFilterOption.RETURN_NONE },
        expected: [],
      },
      // The rest of these tests are specific to strings.
      { query: { string: { name: "foo" } }, expected: [rows[0]] },
      { query: { string: { name: "none" } }, expected: [] },
      { query: { fuzzy: { name: "oo" } }, expected: [rows[0]] },
      { query: { equal: { name: "foo" } }, expected: [rows[0]] },
      { query: { notEqual: { name: "foo" } }, expected: [rows[1]] },
      { query: { oneOf: { name: ["foo"] } }, expected: [rows[0]] },
    ]

    it.each(stringSearchTests)(
      `should be able to run query: $query`,
      async ({ query, expected }) => {
        const { rows: foundRows } = await config.api.row.search(table._id!, {
          tableId: table._id!,
          query,
        })
        expect(foundRows).toHaveLength(expected.length)
        expect(foundRows).toEqual(
          expect.arrayContaining(
            expected.map(r =>
              expect.objectContaining(savedRows.find(sr => sr.name === r.name)!)
            )
          )
        )
      }
    )
  })

  describe("number", () => {
    beforeAll(async () => {
      table = await config.api.table.save(
        tableForDatasource(datasource, {
          schema: {
            age: {
              name: "age",
              type: FieldType.NUMBER,
            },
          },
        })
      )
    })

    const rows = [{ age: 1 }, { age: 10 }]
    let savedRows: Row[]

    beforeAll(async () => {
      savedRows = await Promise.all(
        rows.map(r => config.api.row.save(table._id!, r))
      )
    })

    interface NumberSearchTest {
      query: SearchFilters
      expected: (typeof rows)[number][]
    }

    const numberSearchTests: NumberSearchTest[] = [
      { query: { equal: { age: 1 } }, expected: [rows[0]] },
      { query: { equal: { age: 2 } }, expected: [] },
      { query: { notEqual: { age: 1 } }, expected: [rows[1]] },
      { query: { oneOf: { age: [1] } }, expected: [rows[0]] },
      { query: { range: { age: { low: 1, high: 5 } } }, expected: [rows[0]] },
      { query: { range: { age: { low: 0, high: 1 } } }, expected: [rows[0]] },
      { query: { range: { age: { low: 3, high: 4 } } }, expected: [] },
      { query: { range: { age: { low: 0, high: 11 } } }, expected: rows },
    ]

    it.each(numberSearchTests)(
      `should be able to run query: $query`,
      async ({ query, expected }) => {
        const { rows: foundRows } = await config.api.row.search(table._id!, {
          tableId: table._id!,
          query,
        })
        expect(foundRows).toHaveLength(expected.length)
        expect(foundRows).toEqual(
          expect.arrayContaining(
            expected.map(r =>
              expect.objectContaining(savedRows.find(sr => sr.age === r.age)!)
            )
          )
        )
      }
    )
  })

  describe("dates", () => {
    beforeEach(async () => {
      table = await config.api.table.save(
        tableForDatasource(datasource, {
          schema: {
            dob: {
              name: "dob",
              type: FieldType.DATETIME,
            },
          },
        })
      )
    })

    const rows = [
      { dob: new Date("2020-01-01").toISOString() },
      { dob: new Date("2020-01-10").toISOString() },
    ]
    let savedRows: Row[]

    beforeEach(async () => {
      savedRows = await Promise.all(
        rows.map(r => config.api.row.save(table._id!, r))
      )
    })

    interface DateSearchTest {
      query: SearchFilters
      expected: (typeof rows)[number][]
    }

    const dateSearchTests: DateSearchTest[] = [
      {
        query: { equal: { dob: new Date("2020-01-01").toISOString() } },
        expected: [rows[0]],
      },
      {
        query: { equal: { dob: new Date("2020-01-02").toISOString() } },
        expected: [],
      },
      {
        query: { notEqual: { dob: new Date("2020-01-01").toISOString() } },
        expected: [rows[1]],
      },
      {
        query: { oneOf: { dob: [new Date("2020-01-01").toISOString()] } },
        expected: [rows[0]],
      },
      {
        query: {
          range: {
            dob: {
              low: new Date("2020-01-01").toISOString(),
              high: new Date("2020-01-05").toISOString(),
            },
          },
        },
        expected: [rows[0]],
      },
      {
        query: {
          range: {
            dob: {
              low: new Date("2020-01-01").toISOString(),
              high: new Date("2020-01-10").toISOString(),
            },
          },
        },
        expected: rows,
      },
      {
        query: {
          range: {
            dob: {
              low: new Date("2020-01-05").toISOString(),
              high: new Date("2020-01-10").toISOString(),
            },
          },
        },
        expected: [rows[1]],
      },
    ]

    it.each(dateSearchTests)(
      `should be able to run query: $query`,
      async ({ query, expected }) => {
        const { rows: foundRows } = await config.api.row.search(table._id!, {
          tableId: table._id!,
          query,
        })
        expect(foundRows).toHaveLength(expected.length)
        expect(foundRows).toEqual(
          expect.arrayContaining(
            expected.map(r =>
              expect.objectContaining(savedRows.find(sr => sr.dob === r.dob)!)
            )
          )
        )
      }
    )
  })
})
