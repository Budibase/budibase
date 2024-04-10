import { tableForDatasource } from "../../../tests/utilities/structures"
import { DatabaseName, getDatasource } from "../../../integrations/tests/utils"

import * as setup from "./utilities"
import { Datasource, FieldType, SearchFilters, Table } from "@budibase/types"

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

  beforeEach(async () => {
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

  describe("strings", () => {
    const rows = [{ name: "foo" }, { name: "bar" }]

    interface StringSearchTest {
      query: SearchFilters
      expected: (typeof rows)[number][]
    }

    const stringSearchTests: StringSearchTest[] = [
      { query: {}, expected: rows },
      { query: { string: { name: "foo" } }, expected: [rows[0]] },
      { query: { fuzzy: { name: "oo" } }, expected: [rows[0]] },
      { query: { equal: { name: "foo" } }, expected: [rows[0]] },
      { query: { notEqual: { name: "foo" } }, expected: [rows[1]] },
      { query: { oneOf: { name: ["foo"] } }, expected: [rows[0]] },
      // { query: { contains: { name: "f" } }, expected: [0] },
      // { query: { notContains: { name: ["f"] } }, expected: [1] },
      // { query: { containsAny: { name: ["f"] } }, expected: [0] },
    ]

    it.each(stringSearchTests)(
      `should be able to run query: $query`,
      async ({ query, expected }) => {
        await Promise.all(rows.map(r => config.api.row.save(table._id!, r)))
        const { rows: foundRows } = await config.api.row.search(table._id!, {
          tableId: table._id!,
          query,
        })
        expect(foundRows).toEqual(
          expect.arrayContaining(expected.map(r => expect.objectContaining(r)))
        )
      }
    )
  })
})
