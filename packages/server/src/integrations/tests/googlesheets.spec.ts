import { setEnv as setCoreEnv } from "@budibase/backend-core"
import nock from "nock"

import TestConfiguration from "../../tests/utilities/TestConfiguration"
import {
  Datasource,
  FieldType,
  Row,
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

  describe("read", () => {
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
    })

    it("can read table details", async () => {
      const response = await config.api.table.get(table._id!)
      expect(response.name).toEqual("Test Table")
      expect(response.schema).toEqual({
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
      })
    })

    it("can read table rows", async () => {
      const rows = await config.api.row.fetch(table._id!)
      expect(rows.length).toEqual(2)
      expect(rows[0].name).toEqual("Test Contact 1")
      expect(rows[0].description).toEqual("original description 1")
      expect(rows[0]._id).toEqual("%5B2%5D")
      expect(rows[1].name).toEqual("Test Contact 2")
      expect(rows[1].description).toEqual("original description 2")
      expect(rows[1]._id).toEqual("%5B3%5D")
    })

    it("can get a specific row", async () => {
      const row1 = await config.api.row.get(table._id!, "2")
      expect(row1.name).toEqual("Test Contact 1")
      expect(row1.description).toEqual("original description 1")

      const row2 = await config.api.row.get(table._id!, "3")
      expect(row2.name).toEqual("Test Contact 2")
      expect(row2.description).toEqual("original description 2")
    })

    it("can paginate correctly", async () => {
      await config.api.row.bulkImport(table._id!, {
        rows: Array.from({ length: 248 }, (_, i) => ({
          name: `${i}`,
          description: "",
        })),
      })

      let resp = await config.api.row.search(table._id!, {
        tableId: table._id!,
        query: {},
        paginate: true,
        limit: 10,
      })
      let rows = resp.rows

      while (resp.hasNextPage) {
        resp = await config.api.row.search(table._id!, {
          tableId: table._id!,
          query: {},
          paginate: true,
          limit: 10,
          bookmark: resp.bookmark,
        })
        rows = rows.concat(resp.rows)
        if (rows.length > 250) {
          throw new Error("Too many rows returned")
        }
      }

      expect(rows.length).toEqual(250)
      expect(rows.map(row => row.name)).toEqual(
        expect.arrayContaining(Array.from({ length: 248 }, (_, i) => `${i}`))
      )
    })

    it("can export rows", async () => {
      const resp = await config.api.row.exportRows(table._id!, {})
      const parsed = JSON.parse(resp)
      expect(parsed.length).toEqual(2)
      expect(parsed[0]).toMatchObject({
        name: "Test Contact 1",
        description: "original description 1",
      })
      expect(parsed[1]).toMatchObject({
        name: "Test Contact 2",
        description: "original description 2",
      })
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

    it("should be able to rename a column", async () => {
      const row = await config.api.row.save(table._id!, {
        name: "Test Contact",
        description: "original description",
      })

      const { name, ...otherColumns } = table.schema
      const renamedTable = await config.api.table.save({
        ...table,
        schema: {
          ...otherColumns,
          renamed: {
            ...table.schema.name,
          },
        },
        _rename: {
          old: "name",
          updated: "renamed",
        },
      })

      expect(renamedTable.schema.name).not.toBeDefined()
      expect(renamedTable.schema.renamed).toBeDefined()

      expect(mock.cell("A1")).toEqual("renamed")
      expect(mock.cell("B1")).toEqual("description")
      expect(mock.cell("A2")).toEqual("Test Contact")
      expect(mock.cell("B2")).toEqual("original description")
      expect(mock.cell("A3")).toEqual(null)
      expect(mock.cell("B3")).toEqual(null)

      const renamedRow = await config.api.row.get(table._id!, row._id!)
      expect(renamedRow.renamed).toEqual("Test Contact")
      expect(renamedRow.description).toEqual("original description")
      expect(renamedRow.name).not.toBeDefined()
    })

    // TODO: this gets the error "Sheet is not large enough to fit 27 columns. Resize the sheet first."
    it.skip("should be able to add a new column", async () => {
      const updatedTable = await config.api.table.save({
        ...table,
        schema: {
          ...table.schema,
          newColumn: {
            name: "newColumn",
            type: FieldType.STRING,
          },
        },
      })

      expect(updatedTable.schema.newColumn).toBeDefined()

      expect(mock.cell("A1")).toEqual("name")
      expect(mock.cell("B1")).toEqual("description")
      expect(mock.cell("C1")).toEqual("newColumn")
    })

    it("should be able to delete a column", async () => {
      const row = await config.api.row.save(table._id!, {
        name: "Test Contact",
        description: "original description",
      })

      const updatedTable = await config.api.table.save({
        ...table,
        schema: {
          name: {
            name: "name",
            type: FieldType.STRING,
          },
        },
      })

      expect(updatedTable.schema.name).toBeDefined()
      expect(updatedTable.schema.description).not.toBeDefined()

      // TODO: we don't delete data in deleted columns yet, should we?
      // expect(mock.cell("A1")).toEqual("name")
      // expect(mock.cell("B1")).toEqual(null)

      const updatedRow = await config.api.row.get(table._id!, row._id!)
      expect(updatedRow.name).toEqual("Test Contact")
      expect(updatedRow.description).not.toBeDefined()
    })
  })

  describe("delete", () => {
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
    })

    it("can delete a table", async () => {
      expect(mock.sheet(table.name)).toBeDefined()
      await config.api.table.destroy(table._id!, table._rev!)
      expect(mock.sheet(table.name)).toBeUndefined()
    })

    it("can delete a row", async () => {
      const rows = await config.api.row.fetch(table._id!)
      expect(rows.length).toEqual(2)

      // Because row IDs in Google Sheets are sequential and determined by the
      // actual row in the sheet, deleting a row will shift the row IDs down by
      // one. This is why we reverse the rows before deleting them.
      for (const row of rows.reverse()) {
        await config.api.row.delete(table._id!, { _id: row._id! })
      }

      expect(mock.cell("A1")).toEqual("name")
      expect(mock.cell("B1")).toEqual("description")
      expect(mock.cell("A2")).toEqual(null)
      expect(mock.cell("B2")).toEqual(null)
      expect(mock.cell("A3")).toEqual(null)
      expect(mock.cell("B3")).toEqual(null)

      const emptyRows = await config.api.row.fetch(table._id!)
      expect(emptyRows.length).toEqual(0)
    })
  })

  describe("fetch schema", () => {
    it("should fail to import a completely blank sheet", async () => {
      mock.createSheet({ title: "Sheet1" })
      await config.api.datasource.fetchSchema(
        {
          datasourceId: datasource._id!,
          tablesFilter: ["Sheet1"],
        },
        {
          status: 200,
          body: {
            errors: {
              Sheet1:
                'Failed to find a header row in sheet "Sheet1", is the first row blank?',
            },
          },
        }
      )
    })

    it("should fail to import multiple sheets with blank headers", async () => {
      mock.createSheet({ title: "Sheet1" })
      mock.createSheet({ title: "Sheet2" })

      await config.api.datasource.fetchSchema(
        {
          datasourceId: datasource!._id!,
          tablesFilter: ["Sheet1", "Sheet2"],
        },
        {
          status: 200,
          body: {
            errors: {
              Sheet1:
                'Failed to find a header row in sheet "Sheet1", is the first row blank?',
              Sheet2:
                'Failed to find a header row in sheet "Sheet2", is the first row blank?',
            },
          },
        }
      )
    })

    it("should only fail the sheet with missing headers", async () => {
      mock.createSheet({ title: "Sheet1" })
      mock.createSheet({ title: "Sheet2" })
      mock.createSheet({ title: "Sheet3" })

      mock.set("Sheet1!A1", "name")
      mock.set("Sheet1!B1", "dob")
      mock.set("Sheet2!A1", "name")
      mock.set("Sheet2!B1", "dob")

      await config.api.datasource.fetchSchema(
        {
          datasourceId: datasource!._id!,
          tablesFilter: ["Sheet1", "Sheet2", "Sheet3"],
        },
        {
          status: 200,
          body: {
            errors: {
              Sheet3:
                'Failed to find a header row in sheet "Sheet3", is the first row blank?',
            },
          },
        }
      )
    })

    it("should only succeed if sheet with missing headers is not being imported", async () => {
      mock.createSheet({ title: "Sheet1" })
      mock.createSheet({ title: "Sheet2" })
      mock.createSheet({ title: "Sheet3" })

      mock.set("Sheet1!A1", "name")
      mock.set("Sheet1!B1", "dob")
      mock.set("Sheet2!A1", "name")
      mock.set("Sheet2!B1", "dob")

      await config.api.datasource.fetchSchema(
        {
          datasourceId: datasource!._id!,
          tablesFilter: ["Sheet1", "Sheet2"],
        },
        {
          status: 200,
          body: { errors: {} },
        }
      )
    })
  })

  describe("search", () => {
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
            constraints: {
              type: "string",
            },
          },
        },
      })

      await config.api.row.bulkImport(table._id!, {
        rows: [
          {
            name: "Foo",
          },
          {
            name: "Bar",
          },
          {
            name: "Baz",
          },
        ],
      })
    })

    it("should be able to find rows with equals filter", async () => {
      const response = await config.api.row.search(table._id!, {
        tableId: table._id!,
        query: {
          equal: {
            name: "Foo",
          },
        },
      })

      expect(response.rows).toHaveLength(1)
      expect(response.rows[0].name).toEqual("Foo")
    })

    it("should be able to find rows with not equals filter", async () => {
      const response = await config.api.row.search(table._id!, {
        tableId: table._id!,
        query: {
          notEqual: {
            name: "Foo",
          },
        },
      })

      expect(response.rows).toHaveLength(2)
      expect(response.rows[0].name).toEqual("Bar")
      expect(response.rows[1].name).toEqual("Baz")
    })

    it("should be able to find rows with empty filter", async () => {
      const response = await config.api.row.search(table._id!, {
        tableId: table._id!,
        query: {
          empty: {
            name: null,
          },
        },
      })

      expect(response.rows).toHaveLength(0)
    })

    it("should be able to find rows with not empty filter", async () => {
      const response = await config.api.row.search(table._id!, {
        tableId: table._id!,
        query: {
          notEmpty: {
            name: null,
          },
        },
      })

      expect(response.rows).toHaveLength(3)
    })

    it("should be able to find rows with one of filter", async () => {
      const response = await config.api.row.search(table._id!, {
        tableId: table._id!,
        query: {
          oneOf: {
            name: ["Foo", "Bar"],
          },
        },
      })

      expect(response.rows).toHaveLength(2)
      expect(response.rows[0].name).toEqual("Foo")
      expect(response.rows[1].name).toEqual("Bar")
    })

    it("should be able to find rows with fuzzy filter", async () => {
      const response = await config.api.row.search(table._id!, {
        tableId: table._id!,
        query: {
          fuzzy: {
            name: "oo",
          },
        },
      })

      expect(response.rows).toHaveLength(1)
      expect(response.rows[0].name).toEqual("Foo")
    })

    it("should be able to find rows with range filter", async () => {
      const response = await config.api.row.search(table._id!, {
        tableId: table._id!,
        query: {
          range: {
            name: {
              low: "A",
              high: "C",
            },
          },
        },
      })

      expect(response.rows).toHaveLength(2)
      expect(response.rows[0].name).toEqual("Bar")
      expect(response.rows[1].name).toEqual("Baz")
    })

    it("should paginate correctly", async () => {
      await config.api.row.bulkImport(table._id!, {
        rows: Array.from({ length: 50 }, () => ({
          name: `Unique value!`,
        })),
      })
      await config.api.row.bulkImport(table._id!, {
        rows: Array.from({ length: 50 }, () => ({
          name: `Non-unique value!`,
        })),
      })

      let response = await config.api.row.search(table._id!, {
        tableId: table._id!,
        query: { equal: { name: "Unique value!" } },
        paginate: true,
        limit: 10,
      })
      let rows: Row[] = response.rows

      while (response.hasNextPage) {
        response = await config.api.row.search(table._id!, {
          tableId: table._id!,
          query: { equal: { name: "Unique value!" } },
          paginate: true,
          limit: 10,
          bookmark: response.bookmark,
        })

        expect(response.rows.length).toBeLessThanOrEqual(10)
        rows = rows.concat(response.rows)
      }

      // Make sure we only get rows matching the query.
      expect(rows.length).toEqual(50)
      expect(rows.map(row => row.name)).toEqual(
        expect.arrayContaining(
          Array.from({ length: 50 }, () => "Unique value!")
        )
      )

      // Make sure all of the rows have a unique ID.
      const ids = Object.keys(
        rows.reduce((acc, row) => {
          acc[row._id!] = true
          return acc
        }, {})
      )
      expect(ids.length).toEqual(50)
    })
  })
})
