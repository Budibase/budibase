const { checkBuilderEndpoint } = require("./utilities/TestFunctions")
const setup = require("./utilities")
const { basicTable } = setup.structures
const { events, context } = require("@budibase/backend-core")

describe("/tables", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let appId

  afterAll(setup.afterAll)

  beforeEach(async () => {
    const app = await config.init()
    appId = app.appId
  })

  describe("create", () => {

    beforeEach(() => {
      jest.clearAllMocks()
    })

    const createTable = (table) => {
      if (!table) {
        table = basicTable()
      }
      return request
        .post(`/api/tables`)
        .send(table)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

    }

    it("returns a success message when the table is successfully created", async () => {
      const res = await createTable()

      expect(res.res.statusMessage).toEqual("Table TestTable saved successfully.")
      expect(res.body.name).toEqual("TestTable")
      expect(events.table.created).toBeCalledTimes(1)
      expect(events.table.created).toBeCalledWith(res.body)
    })

    it("creates a table via data import", async () => {
      const table = basicTable()
      table.rows = [{ name: 'test-name', description: 'test-desc' }]

      const res = await createTable(table)

      expect(events.table.created).toBeCalledTimes(1)
      expect(events.table.created).toBeCalledWith(res.body)
      expect(events.table.imported).toBeCalledTimes(1)
      expect(events.table.imported).toBeCalledWith(res.body)
      expect(events.rows.imported).toBeCalledTimes(1)
      expect(events.rows.imported).toBeCalledWith(res.body, 1)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/tables`,
        body: basicTable()
      })
    })
  })

  describe("update", () => {
    it("updates a table", async () => {
      const testTable = await config.createTable()

      const res = await request
        .post(`/api/tables`)
        .send(testTable)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

      expect(events.table.updated).toBeCalledTimes(1)
      expect(events.table.updated).toBeCalledWith(res.body)
    })

    it("updates all the row fields for a table when a schema key is renamed", async () => {
      const testTable = await config.createTable()
      await config.createView({
        name: "TestView",
        field: "Price",
        calculation: "stats",
        tableId: testTable._id,
      })

      const testRow = await request
        .post(`/api/${testTable._id}/rows`)
        .send({
          name: "test"
        })
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

      const updatedTable = await request
        .post(`/api/tables`)
        .send({
          _id: testTable._id,
          _rev: testTable._rev,
          name: "TestTable",
          key: "name",
          _rename: {
            old: "name",
            updated: "updatedName"
          },
          schema: {
            updatedName: { type: "string" }
          }
        })
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      expect(updatedTable.res.statusMessage).toEqual("Table TestTable saved successfully.")
      expect(updatedTable.body.name).toEqual("TestTable")

      const res = await request
        .get(`/api/${testTable._id}/rows/${testRow.body._id}`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.updatedName).toEqual("test")
      expect(res.body.name).toBeUndefined()
    })

    describe("user table", () => {
      it("should add roleId and email field when adjusting user table schema", async () => {
        const res = await request
          .post(`/api/tables`)
          .send({
            ...basicTable(),
            _id: "ta_users",
          })
          .set(config.defaultHeaders())
          .expect('Content-Type', /json/)
          .expect(200)
        expect(res.body.schema.email).toBeDefined()
        expect(res.body.schema.roleId).toBeDefined()
      })
    })
  })

  describe("import", () => {
    it("imports rows successfully", async () => {
      const table = await config.createTable()
      const importRequest = {
        schema: table.schema,
        rows: [{ name: 'test-name', description: 'test-desc' }]
      }

      jest.clearAllMocks()

      await request
        .post(`/api/tables/${table._id}/import`)
        .send(importRequest)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

      expect(events.table.created).not.toHaveBeenCalled()
      expect(events.rows.imported).toBeCalledTimes(1)
      expect(events.rows.imported).toBeCalledWith(table, 1)
    })
  })

  describe("fetch", () => {
    let testTable

    beforeEach(async () => {
      testTable = await config.createTable(testTable)
    })

    afterEach(() => {
      delete testTable._rev
    })

    it("returns all the tables for that instance in the response body", async () => {
      const res = await request
        .get(`/api/tables`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      const fetchedTable = res.body[0]
      expect(fetchedTable.name).toEqual(testTable.name)
      expect(fetchedTable.type).toEqual("internal")
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/tables`,
      })
    })
  })

  describe("indexing", () => {
    it("should be able to create a table with indexes", async () => {
      await context.doInAppContext(appId, async () => {
        const db = context.getAppDB()
        const indexCount = (await db.getIndexes()).total_rows
        const table = basicTable()
        table.indexes = ["name"]
        const res = await request
          .post(`/api/tables`)
          .send(table)
          .set(config.defaultHeaders())
          .expect('Content-Type', /json/)
          .expect(200)
        expect(res.body._id).toBeDefined()
        expect(res.body._rev).toBeDefined()
        expect((await db.getIndexes()).total_rows).toEqual(indexCount + 1)
        // update index to see what happens
        table.indexes = ["name", "description"]
        await request
          .post(`/api/tables`)
          .send({
            ...table,
            _id: res.body._id,
            _rev: res.body._rev,
          })
          .set(config.defaultHeaders())
          .expect('Content-Type', /json/)
          .expect(200)
        // shouldn't have created a new index
        expect((await db.getIndexes()).total_rows).toEqual(indexCount + 1)
      })
    })
  })

  describe("destroy", () => {
    let testTable

    beforeEach(async () => {
      testTable = await config.createTable(testTable)
    })

    afterEach(() => {
      delete testTable._rev
    })

    it("returns a success response when a table is deleted.", async () => {
      const res = await request
        .delete(`/api/tables/${testTable._id}/${testTable._rev}`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.body.message).toEqual(`Table ${testTable._id} deleted.`)
      expect(events.table.deleted).toBeCalledTimes(1)
      expect(events.table.deleted).toBeCalledWith({ ...testTable, tableId: testTable._id })
    })

    it("deletes linked references to the table after deletion", async () => {
      const linkedTable = await config.createTable({
        name: "LinkedTable",
        type: "table",
        key: "name",
        schema: {
          name: {
            type: "string",
            constraints: {
              type: "string",
            },
          },
          TestTable: {
            type: "link",
            fieldName: "TestTable",
            tableId: testTable._id,
            constraints: {
              type: "array"
            }
          }
        },
      })

      const res = await request
        .delete(`/api/tables/${testTable._id}/${testTable._rev}`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.body.message).toEqual(`Table ${testTable._id} deleted.`)
      const dependentTable = await config.getTable(linkedTable._id)
      expect(dependentTable.schema.TestTable).not.toBeDefined()
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "DELETE",
        url: `/api/tables/${testTable._id}/${testTable._rev}`,
      })
    })
  })
})
