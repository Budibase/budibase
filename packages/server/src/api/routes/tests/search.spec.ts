import { tableForDatasource } from "../../../tests/utilities/structures"
import { DatabaseName, getDatasource } from "../../../integrations/tests/utils"

import * as setup from "./utilities"
import { Datasource, FieldType, Table } from "@budibase/types"

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

  it("should return rows", async () => {
    const rows = await Promise.all([
      config.api.row.save(table._id!, { name: "foo" }),
      config.api.row.save(table._id!, { name: "bar" }),
    ])

    const result = await config.api.row.search(table._id!, {
      tableId: table._id!,
      query: {},
    })

    expect(result.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: rows[0]._id }),
        expect.objectContaining({ _id: rows[1]._id }),
      ])
    )
  })
})
