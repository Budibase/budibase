import { events } from "@budibase/backend-core"
import * as setup from "./utilities"
import {
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  QuotaUsageType,
  SaveTableRequest,
  StaticQuotaName,
  Table,
  TableSourceType,
  View,
  ViewCalculation,
} from "@budibase/types"
import { quotas } from "@budibase/pro"

const priceTable: SaveTableRequest = {
  name: "table",
  type: "table",
  sourceId: INTERNAL_TABLE_SOURCE_ID,
  sourceType: TableSourceType.INTERNAL,
  schema: {
    Price: {
      name: "Price",
      type: FieldType.NUMBER,
    },
    Category: {
      name: "Category",
      type: FieldType.STRING,
      constraints: {
        type: "string",
      },
    },
  },
}

describe("/views", () => {
  let config = setup.getConfig()
  let table: Table

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    table = await config.api.table.save(priceTable)
  })

  const saveView = async (view?: Partial<View>) => {
    const viewToSave: View = {
      name: "TestView",
      field: "Price",
      calculation: ViewCalculation.STATISTICS,
      tableId: table._id!,
      filters: [],
      schema: {},
      ...view,
    }
    return config.api.legacyView.save(viewToSave)
  }

  const getRowUsage = async () => {
    const { total } = await config.doInContext(undefined, () =>
      quotas.getCurrentUsageValues(QuotaUsageType.STATIC, StaticQuotaName.ROWS)
    )
    return total
  }

  const assertRowUsage = async (expected: number) => {
    const usage = await getRowUsage()
    expect(usage).toBe(expected)
  }

  describe("create", () => {
    it("creates a view with a calculation", async () => {
      jest.clearAllMocks()

      const view = await saveView({ calculation: ViewCalculation.COUNT })

      expect(view.tableId).toBe(table._id)
    })

    it("creates a view with a filter", async () => {
      jest.clearAllMocks()

      const view = await saveView({
        calculation: undefined,
        filters: [
          {
            value: "1",
            condition: "EQUALS",
            key: "price",
          },
        ],
      })

      expect(view.tableId).toBe(table._id)
    })

    it("updates the table row with the new view metadata", async () => {
      await saveView()
      const updatedTable = await config.api.table.get(table._id!)
      expect(updatedTable.views).toEqual(
        expect.objectContaining({
          TestView: expect.objectContaining({
            field: "Price",
            calculation: "stats",
            tableId: table._id,
            filters: [],
            schema: {
              sum: {
                type: "number",
              },
              min: {
                type: "number",
              },
              max: {
                type: "number",
              },
              count: {
                type: "number",
              },
              sumsqr: {
                type: "number",
              },
              avg: {
                type: "number",
              },
              field: {
                type: "string",
              },
            },
          }),
        })
      )
    })
  })

  describe("update", () => {
    it("updates a view with no calculation or filter changed", async () => {
      await saveView()
      jest.clearAllMocks()

      await saveView()

      expect(events.view.created).not.toHaveBeenCalled()
    })

    it("updates a view calculation", async () => {
      await saveView({ calculation: ViewCalculation.SUM })
      jest.clearAllMocks()

      await saveView({ calculation: ViewCalculation.COUNT })

      expect(events.view.created).not.toHaveBeenCalled()
    })

    it("deletes a view calculation", async () => {
      await saveView({ calculation: ViewCalculation.SUM })
      jest.clearAllMocks()

      await saveView({ calculation: undefined })

      expect(events.view.created).not.toHaveBeenCalled()
    })

    it("updates a view filter", async () => {
      await saveView({
        filters: [
          {
            value: "1",
            condition: "EQUALS",
            key: "price",
          },
        ],
      })
      jest.clearAllMocks()

      await saveView({
        filters: [
          {
            value: "2",
            condition: "EQUALS",
            key: "price",
          },
        ],
      })

      expect(events.view.created).not.toHaveBeenCalled()
    })

    it("deletes a view filter", async () => {
      await saveView({
        filters: [
          {
            value: "1",
            condition: "EQUALS",
            key: "price",
          },
        ],
      })
      jest.clearAllMocks()

      await saveView({ filters: [] })

      expect(events.view.created).not.toHaveBeenCalled()
    })
  })

  describe("fetch", () => {
    beforeEach(async () => {
      table = await config.api.table.save(priceTable)
    })

    it("returns only custom views", async () => {
      await saveView({
        name: "TestView",
        field: "Price",
        calculation: ViewCalculation.STATISTICS,
        tableId: table._id,
      })
      const views = await config.api.legacyView.fetch()
      expect(views.length).toBe(1)
      expect(views.find(({ name }) => name === "TestView")).toBeDefined()
    })

    it("should be able to fetch tables contents via 'view'", async () => {
      const row = await config.api.row.save(table._id!, {})
      const rowUsage = await getRowUsage()

      const rows = await config.api.legacyView.get(table._id!)
      expect(rows.length).toEqual(1)
      expect(rows[0]._id).toEqual(row._id)
      await assertRowUsage(rowUsage)
    })

    it("should throw an error if view doesn't exist", async () => {
      const rowUsage = await getRowUsage()

      await config.api.legacyView.get("derp", undefined, { status: 404 })

      await assertRowUsage(rowUsage)
    })

    it("should be able to run on a view", async () => {
      const view = await config.api.legacyView.save({
        tableId: table._id!,
        name: "ViewTest",
        filters: [],
        schema: {},
      })
      const row = await config.api.row.save(table._id!, {})
      const rowUsage = await getRowUsage()

      const rows = await config.api.legacyView.get(view.name!)
      expect(rows.length).toEqual(1)
      expect(rows[0]._id).toEqual(row._id)

      await assertRowUsage(rowUsage)
    })
  })

  describe("query", () => {
    it("returns data for the created view", async () => {
      await saveView({
        name: "TestView",
        field: "Price",
        calculation: ViewCalculation.STATISTICS,
        tableId: table._id!,
      })
      await config.api.row.save(table._id!, {
        Price: 1000,
      })
      await config.api.row.save(table._id!, {
        Price: 2000,
      })
      await config.api.row.save(table._id!, {
        Price: 4000,
      })
      const rows = await config.api.legacyView.get("TestView", {
        calculation: ViewCalculation.STATISTICS,
      })
      expect(rows.length).toBe(1)
      expect(rows[0]).toEqual({
        avg: 2333.3333333333335,
        count: 3,
        group: null,
        max: 4000,
        min: 1000,
        sum: 7000,
        sumsqr: 21000000,
      })
    })

    it("returns data for the created view using a group by", async () => {
      await saveView({
        calculation: ViewCalculation.STATISTICS,
        name: "TestView",
        field: "Price",
        groupBy: "Category",
        tableId: table._id,
      })
      await config.api.row.save(table._id!, {
        Price: 1000,
        Category: "One",
      })
      await config.api.row.save(table._id!, {
        Price: 2000,
        Category: "One",
      })
      await config.api.row.save(table._id!, {
        Price: 4000,
        Category: "Two",
      })
      const rows = await config.api.legacyView.get("TestView", {
        calculation: ViewCalculation.STATISTICS,
        group: "Category",
      })
      expect(rows.length).toBe(2)
      expect(rows[0]).toEqual({
        avg: 1500,
        count: 2,
        group: "One",
        max: 2000,
        min: 1000,
        sum: 3000,
        sumsqr: 5000000,
      })
    })
  })

  describe("destroy", () => {
    it("should be able to delete a view", async () => {
      const table = await config.api.table.save(priceTable)
      const view = await saveView({ tableId: table._id })
      const deletedView = await config.api.legacyView.destroy(view.name!)
      expect(deletedView.map).toBeDefined()
      expect(deletedView.meta?.tableId).toEqual(table._id)
      expect(events.view.deleted).toHaveBeenCalledTimes(1)
    })
  })

  describe("exportView", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    const setupExport = async () => {
      const table = await config.api.table.save({
        name: "test-table",
        type: "table",
        sourceId: INTERNAL_TABLE_SOURCE_ID,
        sourceType: TableSourceType.INTERNAL,
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
      await config.api.row.save(table._id!, {
        name: "test-name",
        description: "ùúûü",
      })
      return table
    }

    const assertJsonExport = (res: string) => {
      const rows = JSON.parse(res)
      expect(rows.length).toBe(1)
      expect(rows[0].name).toBe("test-name")
      expect(rows[0].description).toBe("ùúûü")
    }

    const assertCSVExport = (res: string) => {
      expect(res).toBe(`"name","description"\n"test-name","ùúûü"`)
    }

    it("should be able to export a table as JSON", async () => {
      const table = await setupExport()

      const res = await config.api.legacyView.export(table._id!, "json")

      assertJsonExport(res)
      expect(events.table.exported).toHaveBeenCalledTimes(1)
      expect(events.table.exported).toHaveBeenCalledWith(
        expect.objectContaining(table),
        "json"
      )
    })

    it("should be able to export a table as CSV", async () => {
      const table = await setupExport()

      const res = await config.api.legacyView.export(table._id!, "csv")

      assertCSVExport(res)
      expect(events.table.exported).toHaveBeenCalledTimes(1)
      expect(events.table.exported).toHaveBeenCalledWith(
        expect.objectContaining(table),
        "csv"
      )
    })

    it("should be able to export a view as JSON", async () => {
      let table = await setupExport()
      const view = await config.api.legacyView.save({
        name: "test-view",
        tableId: table._id!,
        filters: [],
        schema: {},
      })
      table = await config.api.table.get(table._id!)

      let res = await config.api.legacyView.export(view.name!, "json")

      assertJsonExport(res)
      expect(events.view.exported).toHaveBeenCalledTimes(1)
      expect(events.view.exported).toHaveBeenCalledWith(table, "json")
    })

    it("should be able to export a view as CSV", async () => {
      let table = await setupExport()
      const view = await config.api.legacyView.save({
        name: "test-view",
        tableId: table._id!,
        filters: [],
        schema: {},
      })
      table = await config.api.table.get(table._id!)

      let res = await config.api.legacyView.export(view.name!, "csv")

      assertCSVExport(res)
      expect(events.view.exported).toHaveBeenCalledTimes(1)
      expect(events.view.exported).toHaveBeenCalledWith(table, "csv")
    })
  })
})
