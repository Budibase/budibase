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
      const table = await config.api.table.save({
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

      expect(table.name).toEqual("Test Table")

      expect(mock.cell("A1")).toEqual("name")
      expect(mock.cell("B1")).toEqual("description")
      expect(mock.cell("A2")).toEqual(null)
      expect(mock.cell("B2")).toEqual(null)
    })

    it("can handle multiple tables", async () => {
      const table1 = await config.api.table.save({
        name: "Test Table 1",
        type: "table",
        sourceId: datasource._id!,
        sourceType: TableSourceType.EXTERNAL,
        schema: {
          one: {
            name: "one",
            type: FieldType.STRING,
            constraints: {
              type: "string",
            },
          },
        },
      })

      const table2 = await config.api.table.save({
        name: "Test Table 2",
        type: "table",
        sourceId: datasource._id!,
        sourceType: TableSourceType.EXTERNAL,
        schema: {
          two: {
            name: "two",
            type: FieldType.STRING,
            constraints: {
              type: "string",
            },
          },
        },
      })

      expect(table1.name).toEqual("Test Table 1")
      expect(table2.name).toEqual("Test Table 2")

      expect(mock.cell("Test Table 1!A1")).toEqual("one")
      expect(mock.cell("Test Table 1!A2")).toEqual(null)
      expect(mock.cell("Test Table 2!A1")).toEqual("two")
      expect(mock.cell("Test Table 2!A2")).toEqual(null)
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

    it("should be able to add a new row", async () => {
      const row = await config.api.row.save(table._id!, {
        name: "Test Contact",
        description: "original description",
      })

      expect(row.name).toEqual("Test Contact")
      expect(row.description).toEqual("original description")

      expect(mock.cell("A2")).toEqual("Test Contact")
      expect(mock.cell("B2")).toEqual("original description")

      const row2 = await config.api.row.save(table._id!, {
        name: "Test Contact 2",
        description: "original description 2",
      })

      expect(row2.name).toEqual("Test Contact 2")
      expect(row2.description).toEqual("original description 2")

      // Notable that adding a new row adds it at the top, not the bottom.  Not
      // entirely sure if this is the intended behaviour or an incorrect
      // implementation of the GoogleSheetsMock.
      expect(mock.cell("A2")).toEqual("Test Contact 2")
      expect(mock.cell("B2")).toEqual("original description 2")

      expect(mock.cell("A3")).toEqual("Test Contact")
      expect(mock.cell("B3")).toEqual("original description")
    })

    it("should be able to add multiple rows", async () => {
      await config.api.row.bulkImport(table._id!, {
        rows: [
          {
            name: "Test Contact 1",
            description: "original description 1",
          },
          {
            name: "Test Contact 2",
            description: "original description 2",
          },
        ],
      })

      expect(mock.cell("A2")).toEqual("Test Contact 1")
      expect(mock.cell("B2")).toEqual("original description 1")
      expect(mock.cell("A3")).toEqual("Test Contact 2")
      expect(mock.cell("B3")).toEqual("original description 2")
    })

    it("should be able to update a row", async () => {
      const row = await config.api.row.save(table._id!, {
        name: "Test Contact",
        description: "original description",
      })

      expect(mock.cell("A2")).toEqual("Test Contact")
      expect(mock.cell("B2")).toEqual("original description")

      await config.api.row.save(table._id!, {
        ...row,
        name: "Test Contact Updated",
        description: "original description updated",
      })

      expect(mock.cell("A2")).toEqual("Test Contact Updated")
      expect(mock.cell("B2")).toEqual("original description updated")
    })
  })
})
