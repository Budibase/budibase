import { setEnv as setCoreEnv } from "@budibase/backend-core"
import nock from "nock"

import TestConfiguration from "../../tests/utilities/TestConfiguration"
import {
  Datasource,
  FieldType,
  SourceName,
  Table,
  TableSourceType,
} from "@budibase/types"
import { GoogleSheetsMock } from "./utils/googlesheets"

describe("Google Sheets Integration", () => {
  const config = new TestConfiguration()

  let cleanupEnv: () => void
  let datasource: Datasource
  let mock: GoogleSheetsMock

  beforeAll(async () => {
    cleanupEnv = setCoreEnv({
      GOOGLE_CLIENT_ID: "test",
      GOOGLE_CLIENT_SECRET: "test",
    })

    await config.init()

    datasource = await config.api.datasource.create({
      name: "Test Datasource",
      type: "datasource",
      source: SourceName.GOOGLE_SHEETS,
      config: {
        spreadsheetId: "randomId",
        auth: {
          appId: "appId",
          accessToken: "accessToken",
          refreshToken: "refreshToken",
        },
      },
    })
  })

  afterAll(async () => {
    cleanupEnv()
    config.end()
  })

  beforeEach(async () => {
    nock.cleanAll()
    mock = GoogleSheetsMock.forDatasource(datasource)
  })

  describe("create", () => {
    it("creates a new table", async () => {
      await config.api.table.save({
        name: "Test Table",
        type: "table",
        sourceId: datasource._id!,
        sourceType: TableSourceType.EXTERNAL,
        schema: {
          name: {
            name: "name",
            type: FieldType.STRING,
            constraints: {
              type: "string",
            },
          },
          description: {
            name: "description",
            type: FieldType.STRING,
            constraints: {
              type: "string",
            },
          },
        },
      })

      expect(mock.cell("A1")).toEqual("name")
      expect(mock.cell("B1")).toEqual("description")
      expect(mock.cell("A2")).toEqual(null)
      expect(mock.cell("B2")).toEqual(null)
    })
  })

  describe("update", () => {
    let table: Table
    beforeEach(async () => {
      table = await config.api.table.save({
        name: "Test Table",
        type: "table",
        sourceId: datasource._id!,
        sourceType: TableSourceType.EXTERNAL,
        schema: {
          name: {
            name: "name",
            type: FieldType.STRING,
          },
          description: {
            name: "description",
            type: FieldType.STRING,
          },
        },
      })
    })

    it.only("should be able to add a new row", async () => {
      await config.api.row.save(table._id!, {
        name: "Test Contact",
        description: "original description",
      })
    })
  })
})
