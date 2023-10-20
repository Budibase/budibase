const setup = require("./utilities")
const { events } = require("@budibase/backend-core")

function priceTable() {
  return {
    name: "table",
    type: "table",
    key: "name",
    schema: {
      Price: {
        type: "number",
        constraints: {},
      },
      Category: {
        type: "string",
        constraints: {
          type: "string",
        },
      },
    },
  }
}

describe("/views", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let table

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })
  
  beforeEach(async() => {
    table = await config.createTable(priceTable())
  })

  const saveView = async (view) => {
    const viewToSave = {
      name: "TestView",
      field: "Price",
      calculation: "stats",
      tableId: table._id,
      ...view
    }
    return request
      .post(`/api/views`)
      .send(viewToSave)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }

  describe("create", () => {

    it("returns a success message when the view is successfully created", async () => {
      const res = await saveView()
      expect(res.body.tableId).toBe(table._id)
      expect(events.view.created).toBeCalledTimes(1)
    })

    it("creates a view with a calculation", async () => {
      jest.clearAllMocks()

      const res = await saveView({ calculation: "count" })

      expect(res.body.tableId).toBe(table._id)
      expect(events.view.created).toBeCalledTimes(1)
      expect(events.view.updated).not.toBeCalled()
      expect(events.view.calculationCreated).toBeCalledTimes(1)
      expect(events.view.calculationUpdated).not.toBeCalled()
      expect(events.view.calculationDeleted).not.toBeCalled()
      expect(events.view.filterCreated).not.toBeCalled()
      expect(events.view.filterUpdated).not.toBeCalled()
      expect(events.view.filterDeleted).not.toBeCalled()
    })

    it("creates a view with a filter", async () => {
      jest.clearAllMocks()

      const res = await saveView({
        calculation: null,
        filters: [{
          value: "1",
          condition: "EQUALS",
          key: "price"
        }],
      })

      expect(res.body.tableId).toBe(table._id)
      expect(events.view.created).toBeCalledTimes(1)
      expect(events.view.updated).not.toBeCalled()
      expect(events.view.calculationCreated).not.toBeCalled()
      expect(events.view.calculationUpdated).not.toBeCalled()
      expect(events.view.calculationDeleted).not.toBeCalled()
      expect(events.view.filterCreated).toBeCalledTimes(1)
      expect(events.view.filterUpdated).not.toBeCalled()
      expect(events.view.filterDeleted).not.toBeCalled()
    })

    it("updates the table row with the new view metadata", async () => {
      const res = await request
        .post(`/api/views`)
        .send({
          name: "TestView",
          field: "Price",
          calculation: "stats",
          tableId: table._id,
        })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.tableId).toBe(table._id)

      const updatedTable = await config.getTable(table._id)
      const expectedObj = expect.objectContaining({
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
      expect(updatedTable.views).toEqual(expectedObj)
    })
  })

  describe("update", () => {
    it("updates a view with no calculation or filter changed", async () => {
      await saveView()
      jest.clearAllMocks()

      await saveView()

      expect(events.view.created).not.toBeCalled()
      expect(events.view.updated).toBeCalledTimes(1)
      expect(events.view.calculationCreated).not.toBeCalled()
      expect(events.view.calculationUpdated).not.toBeCalled()
      expect(events.view.calculationDeleted).not.toBeCalled()
      expect(events.view.filterCreated).not.toBeCalled()
      expect(events.view.filterUpdated).not.toBeCalled()
      expect(events.view.filterDeleted).not.toBeCalled()
    })

    it("updates a view calculation", async () => {
      await saveView({ calculation: "sum" })
      jest.clearAllMocks()

      await saveView({ calculation: "count" })

      expect(events.view.created).not.toBeCalled()
      expect(events.view.updated).toBeCalledTimes(1)
      expect(events.view.calculationCreated).not.toBeCalled()
      expect(events.view.calculationUpdated).toBeCalledTimes(1)
      expect(events.view.calculationDeleted).not.toBeCalled()
      expect(events.view.filterCreated).not.toBeCalled()
      expect(events.view.filterUpdated).not.toBeCalled()
      expect(events.view.filterDeleted).not.toBeCalled()
    })

    it("deletes a view calculation", async () => {
      await saveView({ calculation: "sum" })
      jest.clearAllMocks()

      await saveView({ calculation: null })

      expect(events.view.created).not.toBeCalled()
      expect(events.view.updated).toBeCalledTimes(1)
      expect(events.view.calculationCreated).not.toBeCalled()
      expect(events.view.calculationUpdated).not.toBeCalled()
      expect(events.view.calculationDeleted).toBeCalledTimes(1)
      expect(events.view.filterCreated).not.toBeCalled()
      expect(events.view.filterUpdated).not.toBeCalled()
      expect(events.view.filterDeleted).not.toBeCalled()
    })

    it("updates a view filter", async () => {
      await saveView({ filters: [{
        value: "1",
        condition: "EQUALS",
        key: "price"
      }] })
      jest.clearAllMocks()

      await saveView({ filters: [{
        value: "2",
        condition: "EQUALS",
        key: "price"
      }] })

      expect(events.view.created).not.toBeCalled()
      expect(events.view.updated).toBeCalledTimes(1)
      expect(events.view.calculationCreated).not.toBeCalled()
      expect(events.view.calculationUpdated).not.toBeCalled()
      expect(events.view.calculationDeleted).not.toBeCalled()
      expect(events.view.filterCreated).not.toBeCalled()
      expect(events.view.filterUpdated).toBeCalledTimes(1)
      expect(events.view.filterDeleted).not.toBeCalled()
    })

    it("deletes a view filter", async () => {
      await saveView({ filters: [{
        value: "1",
        condition: "EQUALS",
        key: "price"
      }] })
      jest.clearAllMocks()

      await saveView({ filters: [] })

      expect(events.view.created).not.toBeCalled()
      expect(events.view.updated).toBeCalledTimes(1)
      expect(events.view.calculationCreated).not.toBeCalled()
      expect(events.view.calculationUpdated).not.toBeCalled()
      expect(events.view.calculationDeleted).not.toBeCalled()
      expect(events.view.filterCreated).not.toBeCalled()
      expect(events.view.filterUpdated).not.toBeCalled()
      expect(events.view.filterDeleted).toBeCalledTimes(1)
    })
  })

  describe("fetch", () => {
    beforeEach(async () => {
      table = await config.createTable(priceTable())
    })

    it("returns only custom views", async () => {
      await config.createLegacyView({
        name: "TestView",
        field: "Price",
        calculation: "stats",
        tableId: table._id,
      })
      const res = await request
        .get(`/api/views`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.length).toBe(1)
      expect(res.body.find(({ name }) => name === "TestView")).toBeDefined()
    })
  })

  describe("query", () => {
    it("returns data for the created view", async () => {
      await config.createLegacyView({
        name: "TestView",
        field: "Price",
        calculation: "stats",
        tableId: table._id,
      })
      await config.createRow({
        tableId: table._id,
        Price: 1000,
      })
      await config.createRow({
        tableId: table._id,
        Price: 2000,
      })
      await config.createRow({
        tableId: table._id,
        Price: 4000,
      })
      const res = await request
        .get(`/api/views/TestView?calculation=stats`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.length).toBe(1)
      expect(res.body).toMatchSnapshot()
    })

    it("returns data for the created view using a group by", async () => {
      await config.createLegacyView({
        calculation: "stats",
        name: "TestView",
        field: "Price",
        groupBy: "Category",
        tableId: table._id,
      })
      await config.createRow({
        tableId: table._id,
        Price: 1000,
        Category: "One",
      })
      await config.createRow({
        tableId: table._id,
        Price: 2000,
        Category: "One",
      })
      await config.createRow({
        tableId: table._id,
        Price: 4000,
        Category: "Two",
      })
      const res = await request
        .get(`/api/views/TestView?calculation=stats&group=Category`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.length).toBe(2)
      expect(res.body).toMatchSnapshot()
    })
  })

  describe("destroy", () => {
    it("should be able to delete a view", async () => {
      const table = await config.createTable(priceTable())
      const view = await config.createLegacyView()
      const res = await request
        .delete(`/api/views/${view.name}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.map).toBeDefined()
      expect(res.body.meta.tableId).toEqual(table._id)
      expect(events.view.deleted).toBeCalledTimes(1)
    })
  })

  describe("exportView", () => {

    beforeEach(() => {
      jest.clearAllMocks()
    })

    const setupExport = async () => {
      const table = await config.createTable()
      await config.createRow({ name: "test-name", description: "ùúûü" })
      return table
    }

    const exportView = async (viewName, format) => {
      return request
        .get(`/api/views/export?view=${viewName}&format=${format}`)
        .set(config.defaultHeaders())
        .expect(200)
    }

    const assertJsonExport = (res) => {
      const rows = JSON.parse(res.text)
      expect(rows.length).toBe(1)
      expect(rows[0].name).toBe("test-name")
      expect(rows[0].description).toBe("ùúûü")
    }

    const assertCSVExport = (res) => {
      expect(res.text).toBe(`"name","description"\n"test-name","ùúûü"`)
    }

    it("should be able to export a table as JSON", async () => {
      const table = await setupExport()

      const res = await exportView(table._id, "json")

      assertJsonExport(res)
      expect(events.table.exported).toBeCalledTimes(1)
      expect(events.table.exported).toBeCalledWith(table, "json")
    })

    it("should be able to export a table as CSV", async () => {
      const table = await setupExport()

      const res = await exportView(table._id, "csv")

      assertCSVExport(res)
      expect(events.table.exported).toBeCalledTimes(1)
      expect(events.table.exported).toBeCalledWith(table, "csv")
    })

    it("should be able to export a view as JSON", async () => {
      let table = await setupExport()
      const view = await config.createLegacyView()
      table = await config.getTable(table._id)

      let res = await exportView(view.name, "json")

      assertJsonExport(res)
      expect(events.view.exported).toBeCalledTimes(1)
      expect(events.view.exported).toBeCalledWith(table, "json")
    })

    it("should be able to export a view as CSV", async () => {
      let table = await setupExport()
      const view = await config.createLegacyView()
      table = await config.getTable(table._id)

      let res = await exportView(view.name, "csv")

      assertCSVExport(res)
      expect(events.view.exported).toBeCalledTimes(1)
      expect(events.view.exported).toBeCalledWith(table, "csv")
    })
  })
})
