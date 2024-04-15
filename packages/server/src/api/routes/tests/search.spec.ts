import { tableForDatasource } from "../../../tests/utilities/structures"
import { DatabaseName, getDatasource } from "../../../integrations/tests/utils"

import * as setup from "./utilities"
import {
  Datasource,
  EmptyFilterOption,
  FieldType,
  RowSearchParams,
  SearchFilters,
  SortOrder,
  SortType,
  Table,
  TableSchema,
} from "@budibase/types"
import _ from "lodash"

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
  let table: Table

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

  async function createTable(schema: TableSchema) {
    table = await config.api.table.save(
      tableForDatasource(datasource, { schema })
    )
  }

  async function createRows(rows: Record<string, any>[]) {
    await Promise.all(rows.map(r => config.api.row.save(table._id!, r)))
  }

  class SearchAssertion {
    constructor(private readonly query: RowSearchParams) {}

    // Asserts that the query returns rows matching exactly the set of rows
    // passed in. The order of the rows matters. Rows returned in an order
    // different to the one passed in will cause the assertion to fail.  Extra
    // rows returned by the query will also cause the assertion to fail.
    async toMatchExactly(expectedRows: any[]) {
      const { rows: foundRows } = await config.api.row.search(table._id!, {
        ...this.query,
        tableId: table._id!,
      })

      // eslint-disable-next-line jest/no-standalone-expect
      expect(foundRows).toHaveLength(expectedRows.length)
      // eslint-disable-next-line jest/no-standalone-expect
      expect(foundRows).toEqual(
        expectedRows.map((expectedRow: any) =>
          expect.objectContaining(
            foundRows.find(foundRow => _.isMatch(foundRow, expectedRow))
          )
        )
      )
    }

    // Asserts that the query returns rows matching exactly the set of rows
    // passed in. The order of the rows is not important, but extra rows will
    // cause the assertion to fail.
    async toContainExactly(expectedRows: any[]) {
      const { rows: foundRows } = await config.api.row.search(table._id!, {
        ...this.query,
        tableId: table._id!,
      })

      // eslint-disable-next-line jest/no-standalone-expect
      expect(foundRows).toHaveLength(expectedRows.length)
      // eslint-disable-next-line jest/no-standalone-expect
      expect(foundRows).toEqual(
        expect.arrayContaining(
          expectedRows.map((expectedRow: any) =>
            expect.objectContaining(
              foundRows.find(foundRow => _.isMatch(foundRow, expectedRow))
            )
          )
        )
      )
    }

    // Asserts that the query returns rows matching the set of rows passed in.
    // The order of the rows is not important. Extra rows will not cause the
    // assertion to fail.
    async toContain(expectedRows: any[]) {
      const { rows: foundRows } = await config.api.row.search(table._id!, {
        ...this.query,
        tableId: table._id!,
      })

      // eslint-disable-next-line jest/no-standalone-expect
      expect(foundRows).toEqual(
        expect.arrayContaining(
          expectedRows.map((expectedRow: any) =>
            expect.objectContaining(
              foundRows.find(foundRow => _.isMatch(foundRow, expectedRow))
            )
          )
        )
      )
    }

    async toFindNothing() {
      await this.toContainExactly([])
    }

    async toHaveLength(length: number) {
      const { rows: foundRows } = await config.api.row.search(table._id!, {
        ...this.query,
        tableId: table._id!,
      })

      // eslint-disable-next-line jest/no-standalone-expect
      expect(foundRows).toHaveLength(length)
    }
  }

  function expectSearch(query: Omit<RowSearchParams, "tableId">) {
    return new SearchAssertion({ ...query, tableId: table._id! })
  }

  function expectQuery(query: SearchFilters) {
    return expectSearch({ query })
  }

  describe("strings", () => {
    beforeAll(async () => {
      await createTable({
        name: { name: "name", type: FieldType.STRING },
      })
      await createRows([{ name: "foo" }, { name: "bar" }])
    })

    describe("misc", () => {
      it("should return all if no query is passed", () =>
        expectSearch({} as RowSearchParams).toContainExactly([
          { name: "foo" },
          { name: "bar" },
        ]))

      it("should return all if empty query is passed", () =>
        expectQuery({}).toContainExactly([{ name: "foo" }, { name: "bar" }]))

      it("should return all if onEmptyFilter is RETURN_ALL", () =>
        expectQuery({
          onEmptyFilter: EmptyFilterOption.RETURN_ALL,
        }).toContainExactly([{ name: "foo" }, { name: "bar" }]))

      it("should return nothing if onEmptyFilter is RETURN_NONE", () =>
        expectQuery({
          onEmptyFilter: EmptyFilterOption.RETURN_NONE,
        }).toFindNothing())

      it("should respect limit", () =>
        expectSearch({ limit: 1, paginate: true, query: {} }).toHaveLength(1))
    })

    describe("equal", () => {
      it("successfully finds a row", () =>
        expectQuery({ equal: { name: "foo" } }).toContainExactly([
          { name: "foo" },
        ]))

      it("fails to find nonexistent row", () =>
        expectQuery({ equal: { name: "none" } }).toFindNothing())
    })

    describe("notEqual", () => {
      it("successfully finds a row", () =>
        expectQuery({ notEqual: { name: "foo" } }).toContainExactly([
          { name: "bar" },
        ]))

      it("fails to find nonexistent row", () =>
        expectQuery({ notEqual: { name: "bar" } }).toContainExactly([
          { name: "foo" },
        ]))
    })

    describe("oneOf", () => {
      it("successfully finds a row", () =>
        expectQuery({ oneOf: { name: ["foo"] } }).toContainExactly([
          { name: "foo" },
        ]))

      it("fails to find nonexistent row", () =>
        expectQuery({ oneOf: { name: ["none"] } }).toFindNothing())
    })

    describe("fuzzy", () => {
      it("successfully finds a row", () =>
        expectQuery({ fuzzy: { name: "oo" } }).toContainExactly([
          { name: "foo" },
        ]))

      it("fails to find nonexistent row", () =>
        expectQuery({ fuzzy: { name: "none" } }).toFindNothing())
    })

    describe("sort", () => {
      it("sorts ascending", () =>
        expectSearch({
          query: {},
          sort: "name",
          sortOrder: SortOrder.ASCENDING,
        }).toMatchExactly([{ name: "bar" }, { name: "foo" }]))

      it("sorts descending", () =>
        expectSearch({
          query: {},
          sort: "name",
          sortOrder: SortOrder.DESCENDING,
        }).toMatchExactly([{ name: "foo" }, { name: "bar" }]))

      describe("sortType STRING", () => {
        it("sorts ascending", () =>
          expectSearch({
            query: {},
            sort: "name",
            sortType: SortType.STRING,
            sortOrder: SortOrder.ASCENDING,
          }).toMatchExactly([{ name: "bar" }, { name: "foo" }]))

        it("sorts descending", () =>
          expectSearch({
            query: {},
            sort: "name",
            sortType: SortType.STRING,
            sortOrder: SortOrder.DESCENDING,
          }).toMatchExactly([{ name: "foo" }, { name: "bar" }]))
      })
    })
  })

  describe("numbers", () => {
    beforeAll(async () => {
      await createTable({
        age: { name: "age", type: FieldType.NUMBER },
      })
      await createRows([{ age: 1 }, { age: 10 }])
    })

    describe("equal", () => {
      it("successfully finds a row", () =>
        expectQuery({ equal: { age: 1 } }).toContainExactly([{ age: 1 }]))

      it("fails to find nonexistent row", () =>
        expectQuery({ equal: { age: 2 } }).toFindNothing())
    })

    describe("notEqual", () => {
      it("successfully finds a row", () =>
        expectQuery({ notEqual: { age: 1 } }).toContainExactly([{ age: 10 }]))

      it("fails to find nonexistent row", () =>
        expectQuery({ notEqual: { age: 10 } }).toContainExactly([{ age: 1 }]))
    })

    describe("oneOf", () => {
      it("successfully finds a row", () =>
        expectQuery({ oneOf: { age: [1] } }).toContainExactly([{ age: 1 }]))

      it("fails to find nonexistent row", () =>
        expectQuery({ oneOf: { age: [2] } }).toFindNothing())
    })

    describe("range", () => {
      it("successfully finds a row", () =>
        expectQuery({
          range: { age: { low: 1, high: 5 } },
        }).toContainExactly([{ age: 1 }]))

      it("successfully finds multiple rows", () =>
        expectQuery({
          range: { age: { low: 1, high: 10 } },
        }).toContainExactly([{ age: 1 }, { age: 10 }]))

      it("successfully finds a row with a high bound", () =>
        expectQuery({
          range: { age: { low: 5, high: 10 } },
        }).toContainExactly([{ age: 10 }]))
    })

    describe("sort", () => {
      it("sorts ascending", () =>
        expectSearch({
          query: {},
          sort: "age",
          sortOrder: SortOrder.ASCENDING,
        }).toMatchExactly([{ age: 1 }, { age: 10 }]))

      it("sorts descending", () =>
        expectSearch({
          query: {},
          sort: "age",
          sortOrder: SortOrder.DESCENDING,
        }).toMatchExactly([{ age: 10 }, { age: 1 }]))
    })

    describe("sortType NUMBER", () => {
      it("sorts ascending", () =>
        expectSearch({
          query: {},
          sort: "age",
          sortType: SortType.NUMBER,
          sortOrder: SortOrder.ASCENDING,
        }).toMatchExactly([{ age: 1 }, { age: 10 }]))

      it("sorts descending", () =>
        expectSearch({
          query: {},
          sort: "age",
          sortType: SortType.NUMBER,
          sortOrder: SortOrder.DESCENDING,
        }).toMatchExactly([{ age: 10 }, { age: 1 }]))
    })
  })

  describe("dates", () => {
    const JAN_1ST = "2020-01-01T00:00:00.000Z"
    const JAN_2ND = "2020-01-02T00:00:00.000Z"
    const JAN_5TH = "2020-01-05T00:00:00.000Z"
    const JAN_10TH = "2020-01-10T00:00:00.000Z"

    beforeAll(async () => {
      await createTable({
        dob: { name: "dob", type: FieldType.DATETIME },
      })

      await createRows([{ dob: JAN_1ST }, { dob: JAN_10TH }])
    })

    describe("equal", () => {
      it("successfully finds a row", () =>
        expectQuery({ equal: { dob: JAN_1ST } }).toContainExactly([
          { dob: JAN_1ST },
        ]))

      it("fails to find nonexistent row", () =>
        expectQuery({ equal: { dob: JAN_2ND } }).toFindNothing())
    })

    describe("notEqual", () => {
      it("successfully finds a row", () =>
        expectQuery({ notEqual: { dob: JAN_1ST } }).toContainExactly([
          { dob: JAN_10TH },
        ]))

      it("fails to find nonexistent row", () =>
        expectQuery({ notEqual: { dob: JAN_10TH } }).toContainExactly([
          { dob: JAN_1ST },
        ]))
    })

    describe("oneOf", () => {
      it("successfully finds a row", () =>
        expectQuery({ oneOf: { dob: [JAN_1ST] } }).toContainExactly([
          { dob: JAN_1ST },
        ]))

      it("fails to find nonexistent row", () =>
        expectQuery({ oneOf: { dob: [JAN_2ND] } }).toFindNothing())
    })

    describe("range", () => {
      it("successfully finds a row", () =>
        expectQuery({
          range: { dob: { low: JAN_1ST, high: JAN_5TH } },
        }).toContainExactly([{ dob: JAN_1ST }]))

      it("successfully finds multiple rows", () =>
        expectQuery({
          range: { dob: { low: JAN_1ST, high: JAN_10TH } },
        }).toContainExactly([{ dob: JAN_1ST }, { dob: JAN_10TH }]))

      it("successfully finds a row with a high bound", () =>
        expectQuery({
          range: { dob: { low: JAN_5TH, high: JAN_10TH } },
        }).toContainExactly([{ dob: JAN_10TH }]))
    })

    describe("sort", () => {
      it("sorts ascending", () =>
        expectSearch({
          query: {},
          sort: "dob",
          sortOrder: SortOrder.ASCENDING,
        }).toMatchExactly([{ dob: JAN_1ST }, { dob: JAN_10TH }]))

      it("sorts descending", () =>
        expectSearch({
          query: {},
          sort: "dob",
          sortOrder: SortOrder.DESCENDING,
        }).toMatchExactly([{ dob: JAN_10TH }, { dob: JAN_1ST }]))

      describe("sortType STRING", () => {
        it("sorts ascending", () =>
          expectSearch({
            query: {},
            sort: "dob",
            sortType: SortType.STRING,
            sortOrder: SortOrder.ASCENDING,
          }).toMatchExactly([{ dob: JAN_1ST }, { dob: JAN_10TH }]))

        it("sorts descending", () =>
          expectSearch({
            query: {},
            sort: "dob",
            sortType: SortType.STRING,
            sortOrder: SortOrder.DESCENDING,
          }).toMatchExactly([{ dob: JAN_10TH }, { dob: JAN_1ST }]))
      })
    })
  })
})
