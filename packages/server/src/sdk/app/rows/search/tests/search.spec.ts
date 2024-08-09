import { Datasource, FieldType, Row, Table } from "@budibase/types"

import TestConfiguration from "../../../../../tests/utilities/TestConfiguration"
import { search } from "../../../../../sdk/app/rows/search"
import { generator } from "@budibase/backend-core/tests"
import {
  withEnv as withCoreEnv,
  setEnv as setCoreEnv,
} from "@budibase/backend-core"
import {
  DatabaseName,
  getDatasource,
} from "../../../../../integrations/tests/utils"
import { tableForDatasource } from "../../../../../tests/utilities/structures"

// These test cases are only for things that cannot be tested through the API
// (e.g. limiting searches to returning specific fields). If it's possible to
// test through the API, it should be done there instead.
describe.each([
  ["lucene", undefined],
  ["sqs", undefined],
  [DatabaseName.POSTGRES, getDatasource(DatabaseName.POSTGRES)],
  [DatabaseName.MYSQL, getDatasource(DatabaseName.MYSQL)],
  [DatabaseName.SQL_SERVER, getDatasource(DatabaseName.SQL_SERVER)],
  [DatabaseName.MARIADB, getDatasource(DatabaseName.MARIADB)],
])("search sdk (%s)", (name, dsProvider) => {
  const isSqs = name === "sqs"
  const isLucene = name === "lucene"
  const isInternal = isLucene || isSqs
  const config = new TestConfiguration()

  let envCleanup: (() => void) | undefined
  let datasource: Datasource | undefined
  let table: Table
  let rows: Row[]

  beforeAll(async () => {
    await withCoreEnv({ SQS_SEARCH_ENABLE: isSqs ? "true" : "false" }, () =>
      config.init()
    )

    if (isSqs) {
      envCleanup = setCoreEnv({
        SQS_SEARCH_ENABLE: "true",
        SQS_SEARCH_ENABLE_TENANTS: [config.getTenantId()],
      })
    }

    if (dsProvider) {
      datasource = await config.createDatasource({
        datasource: await dsProvider,
      })
    }

    table = await config.api.table.save(
      tableForDatasource(datasource, {
        primary: ["id"],
        schema: {
          id: {
            name: "id",
            type: FieldType.NUMBER,
            autocolumn: true,
          },
          name: {
            name: "name",
            type: FieldType.STRING,
          },
          surname: {
            name: "surname",
            type: FieldType.STRING,
          },
          age: {
            name: "age",
            type: FieldType.NUMBER,
          },
          address: {
            name: "address",
            type: FieldType.STRING,
          },
        },
      })
    )

    rows = []
    for (let i = 0; i < 10; i++) {
      rows.push(
        await config.api.row.save(table._id!, {
          name: generator.first(),
          surname: generator.last(),
          age: generator.age(),
          address: generator.address(),
        })
      )
    }
  })

  afterAll(async () => {
    config.end()
    if (envCleanup) {
      envCleanup()
    }
  })

  it("querying by fields will always return data attribute columns", async () => {
    await config.doInContext(config.appId, async () => {
      const { rows } = await search({
        tableId: table._id!,
        query: {},
        fields: ["name", "age"],
      })

      expect(rows).toHaveLength(10)
      for (const row of rows) {
        const keys = Object.keys(row)
        expect(keys).toContain("name")
        expect(keys).toContain("age")
        expect(keys).not.toContain("surname")
        expect(keys).not.toContain("address")
      }
    })
  })

  !isInternal &&
    it("will decode _id in oneOf query", async () => {
      await config.doInContext(config.appId, async () => {
        const result = await search({
          tableId: table._id!,
          query: {
            oneOf: {
              _id: ["%5B1%5D", "%5B4%5D", "%5B8%5D"],
            },
          },
        })

        expect(result.rows).toHaveLength(3)
        expect(result.rows.map(row => row.id)).toEqual(
          expect.arrayContaining([1, 4, 8])
        )
      })
    })
})
