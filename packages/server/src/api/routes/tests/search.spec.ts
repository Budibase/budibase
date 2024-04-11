import { tableForDatasource } from "../../../tests/utilities/structures"
import { DatabaseName, getDatasource } from "../../../integrations/tests/utils"

import * as setup from "./utilities"
import {
  Datasource,
  EmptyFilterOption,
  FieldType,
  RowSearchParams,
  Table,
} from "@budibase/types"

function leftContainsRight<
  A extends Record<string, any>,
  B extends Record<string, any>
>(left: A, right: B) {
  return Object.entries(right).every(([k, v]) => left[k] === v)
}

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

  async function testSearch<RowType extends Record<string, any>>(
    test: SearchTest<RowType>,
    table: Table
  ) {
    const expected = test.expectToFind
    delete test.expectToFind
    const { rows: foundRows } = await config.api.row.search(table._id!, {
      ...test,
      tableId: table._id!,
    })
    if (!expected) {
      return
    }
    expect(foundRows).toHaveLength(expected.length)
    expect(foundRows).toEqual(
      expect.arrayContaining(
        expected.map(expectedRow =>
          expect.objectContaining(
            foundRows.find(foundRow => leftContainsRight(foundRow, expectedRow))
          )
        )
      )
    )
  }

  function searchTests<T extends Record<string, any>>(
    name: string,
    opts: {
      table: (ds?: Datasource) => Promise<Table>
      rows: T[]
      tests: SearchTest<T>[]
    }
  ) {
    let table: Table

    for (const test of opts.tests) {
      test.toString = () => {
        const queryStr = JSON.stringify({
          query: test.query,
          limit: test.limit,
          sort: test.sort,
          sortOrder: test.sortOrder,
        })
        const expectStr = JSON.stringify(test.expectToFind)
        return `should run: ${queryStr} and find ${expectStr}`
      }
    }

    // eslint-disable-next-line jest/valid-title
    describe(name, () => {
      beforeAll(async () => {
        table = await opts.table(datasource)
      })

      beforeAll(async () => {
        await Promise.all(
          opts.rows.map(r => config.api.row.save(table._id!, r))
        )
      })

      it.each(opts.tests)(`%s`, test => testSearch(test, table))
    })
  }

  interface SearchTest<RowType extends Record<string, any>>
    extends Omit<RowSearchParams, "tableId"> {
    expectToFind?: RowType[]
  }

  searchTests("strings", {
    table: async ds => {
      return await config.api.table.save(
        tableForDatasource(ds, {
          schema: {
            name: {
              name: "name",
              type: FieldType.STRING,
            },
          },
        })
      )
    },
    rows: [{ name: "foo" }, { name: "bar" }],
    tests: [
      // These test cases are generic and don't really need to be repeated for
      // all data types, so we just do them here.

      // @ts-expect-error - intentionally not passing a query to make sure the
      // API can handle it.
      { expectToFind: [{ name: "foo" }, { name: "bar" }] },
      { query: {}, expectToFind: [{ name: "foo" }, { name: "bar" }] },
      {
        query: { onEmptyFilter: EmptyFilterOption.RETURN_ALL },
        expectToFind: [{ name: "foo" }, { name: "bar" }],
      },
      {
        query: { onEmptyFilter: EmptyFilterOption.RETURN_NONE },
        expectToFind: [],
      },
      // The rest of these tests are specific to strings.
      { query: { string: { name: "foo" } }, expectToFind: [{ name: "foo" }] },
      { query: { string: { name: "none" } }, expectToFind: [] },
      { query: { fuzzy: { name: "oo" } }, expectToFind: [{ name: "foo" }] },
      { query: { equal: { name: "foo" } }, expectToFind: [{ name: "foo" }] },
      { query: { notEqual: { name: "foo" } }, expectToFind: [{ name: "bar" }] },
      { query: { oneOf: { name: ["foo"] } }, expectToFind: [{ name: "foo" }] },
    ],
  })

  searchTests("numbers", {
    table: async ds => {
      return await config.api.table.save(
        tableForDatasource(ds, {
          schema: {
            age: {
              name: "age",
              type: FieldType.NUMBER,
            },
          },
        })
      )
    },
    rows: [{ age: 1 }, { age: 10 }],
    tests: [
      { query: { equal: { age: 1 } }, expectToFind: [{ age: 1 }] },
      { query: { equal: { age: 2 } }, expectToFind: [] },
      { query: { notEqual: { age: 1 } }, expectToFind: [{ age: 10 }] },
      { query: { oneOf: { age: [1] } }, expectToFind: [{ age: 1 }] },
      {
        query: { range: { age: { low: 1, high: 5 } } },
        expectToFind: [{ age: 1 }],
      },
      {
        query: { range: { age: { low: 0, high: 1 } } },
        expectToFind: [{ age: 1 }],
      },
      { query: { range: { age: { low: 3, high: 4 } } }, expectToFind: [] },
      {
        query: { range: { age: { low: 0, high: 11 } } },
        expectToFind: [{ age: 1 }, { age: 10 }],
      },
    ],
  })

  searchTests("dates", {
    table: async ds => {
      return await config.api.table.save(
        tableForDatasource(ds, {
          schema: {
            dob: {
              name: "dob",
              type: FieldType.DATETIME,
            },
          },
        })
      )
    },
    rows: [
      { dob: new Date("2020-01-01").toISOString() },
      { dob: new Date("2020-01-10").toISOString() },
    ],
    tests: [
      {
        query: { equal: { dob: new Date("2020-01-01").toISOString() } },
        expectToFind: [{ dob: new Date("2020-01-01").toISOString() }],
      },
      {
        query: { equal: { dob: new Date("2020-01-02").toISOString() } },
        expectToFind: [],
      },
      {
        query: { notEqual: { dob: new Date("2020-01-01").toISOString() } },
        expectToFind: [{ dob: new Date("2020-01-10").toISOString() }],
      },
      {
        query: { oneOf: { dob: [new Date("2020-01-01").toISOString()] } },
        expectToFind: [{ dob: new Date("2020-01-01").toISOString() }],
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
        expectToFind: [{ dob: new Date("2020-01-01").toISOString() }],
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
        expectToFind: [
          { dob: new Date("2020-01-01").toISOString() },
          { dob: new Date("2020-01-10").toISOString() },
        ],
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
        expectToFind: [{ dob: new Date("2020-01-10").toISOString() }],
      },
    ],
  })
})
