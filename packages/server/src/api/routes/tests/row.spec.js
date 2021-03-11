const { outputProcessing } = require("../../../utilities/rowProcessor")
const setup = require("./utilities")
const { basicRow } = setup.structures

describe("/rows", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let table
  let row

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
    table = await config.createTable()
    row = basicRow(table._id)
  })

  const loadRow = async (id, status = 200) =>
    await request
      .get(`/api/${table._id}/rows/${id}`)
      .set(config.defaultHeaders())
      .expect('Content-Type', /json/)
      .expect(status)


  describe("save, load, update", () => {
    it("returns a success message when the row is created", async () => {
      const res = await request
        .post(`/api/${row.tableId}/rows`)
        .send(row)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.res.statusMessage).toEqual(`${table.name} saved successfully`)
      expect(res.body.name).toEqual("Test Contact")
      expect(res.body._rev).toBeDefined()
    })

    it("updates a row successfully", async () => {
      const existing = await config.createRow()

      const res = await request
        .post(`/api/${table._id}/rows`)
        .send({
          _id: existing._id,
          _rev: existing._rev,
          tableId: table._id,
          name: "Updated Name",
        })
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.res.statusMessage).toEqual(`${table.name} updated successfully.`)
      expect(res.body.name).toEqual("Updated Name")
    })

    it("should load a row", async () => {
      const existing = await config.createRow()

      const res = await request
        .get(`/api/${table._id}/rows/${existing._id}`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body).toEqual({
        ...row,
        _id: existing._id,
        _rev: existing._rev,
        type: "row",
      })
    })

    it("should list all rows for given tableId", async () => {
      const newRow = {
        tableId: table._id,
        name: "Second Contact",
        status: "new"
      }
      await config.createRow()
      await config.createRow(newRow)

      const res = await request
        .get(`/api/${table._id}/rows`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.length).toBe(2)
      expect(res.body.find(r => r.name === newRow.name)).toBeDefined()
      expect(res.body.find(r => r.name === row.name)).toBeDefined()
    })

    it("load should return 404 when row does not exist", async () => {
      await config.createRow()
      await request
        .get(`/api/${table._id}/rows/not-a-valid-id`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(404)
    })

    it("row values are coerced", async () => {
      const str = {type:"string", constraints: { type: "string", presence: false }}
      const attachment = {type:"attachment", constraints: { type: "array", presence: false }}
      const bool = {type:"boolean", constraints: { type: "boolean", presence: false }}
      const number = {type:"number", constraints: { type: "number", presence: false }}
      const datetime = {type:"datetime", constraints: { type: "string", presence: false, datetime: {earliest:"", latest: ""}  }}

      table = await config.createTable({
        name: "TestTable2",
        type: "table",
        key: "name",
        schema: {
          name: str,
          stringUndefined: str,
          stringNull: str,
          stringString: str,
          numberEmptyString: number,
          numberNull: number,
          numberUndefined: number,
          numberString: number,
          datetimeEmptyString: datetime,
          datetimeNull: datetime,
          datetimeUndefined: datetime,
          datetimeString: datetime,
          datetimeDate: datetime,
          boolNull: bool,
          boolEmpty: bool,
          boolUndefined: bool,
          boolString: bool,
          boolBool: bool,
          attachmentNull : attachment,
          attachmentUndefined : attachment,
          attachmentEmpty : attachment,
        },
      })

      row = {
        name: "Test Row",
        stringUndefined: undefined,
        stringNull: null,
        stringString: "i am a string",
        numberEmptyString: "",
        numberNull: null,
        numberUndefined: undefined,
        numberString: "123",
        numberNumber: 123,
        datetimeEmptyString: "",
        datetimeNull: null,
        datetimeUndefined: undefined,
        datetimeString: "1984-04-20T00:00:00.000Z",
        datetimeDate: new Date("1984-04-20"),
        boolNull: null,
        boolEmpty: "",
        boolUndefined: undefined,
        boolString: "true",
        boolBool: true,
        tableId: table._id,
        attachmentNull : null,
        attachmentUndefined : undefined,
        attachmentEmpty : "",
      }

      const id = (await config.createRow(row))._id

      const saved = (await loadRow(id)).body

      expect(saved.stringUndefined).toBe(undefined)
      expect(saved.stringNull).toBe("")
      expect(saved.stringString).toBe("i am a string")
      expect(saved.numberEmptyString).toBe(null)
      expect(saved.numberNull).toBe(null)
      expect(saved.numberUndefined).toBe(undefined)
      expect(saved.numberString).toBe(123)
      expect(saved.numberNumber).toBe(123)
      expect(saved.datetimeEmptyString).toBe(null)
      expect(saved.datetimeNull).toBe(null)
      expect(saved.datetimeUndefined).toBe(undefined)
      expect(saved.datetimeString).toBe(new Date(row.datetimeString).toISOString())
      expect(saved.datetimeDate).toBe(row.datetimeDate.toISOString())
      expect(saved.boolNull).toBe(null)
      expect(saved.boolEmpty).toBe(null)
      expect(saved.boolUndefined).toBe(undefined)
      expect(saved.boolString).toBe(true)
      expect(saved.boolBool).toBe(true)
      expect(saved.attachmentNull).toEqual([])
      expect(saved.attachmentUndefined).toBe(undefined)
      expect(saved.attachmentEmpty).toEqual([])
    })
  })

  describe("patch", () => {
    it("should update only the fields that are supplied", async () => {
      const existing = await config.createRow()

      const res = await request
        .patch(`/api/${table._id}/rows/${existing._id}`)
        .send({
          _id: existing._id,
          _rev: existing._rev,
          tableId: table._id,
          name: "Updated Name",
        })
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.res.statusMessage).toEqual(`${table.name} updated successfully.`)
      expect(res.body.name).toEqual("Updated Name")
      expect(res.body.description).toEqual(existing.description)

      const savedRow = await loadRow(res.body._id)

      expect(savedRow.body.description).toEqual(existing.description)
      expect(savedRow.body.name).toEqual("Updated Name")
    })

    it("should throw an error when given improper types", async () => {
      const existing = await config.createRow()
      await request
        .patch(`/api/${table._id}/rows/${existing._id}`)
        .send({
          _id: existing._id,
          _rev: existing._rev,
          tableId: table._id,
          name: 1,
        })
        .set(config.defaultHeaders())
        .expect(400)
    })
  })

  describe("destroy", () => {
    it("should be able to delete a row", async () => {
      const createdRow = await config.createRow(row)
      const res = await request
        .delete(`/api/${table._id}/rows/${createdRow._id}/${createdRow._rev}`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.body.ok).toEqual(true)
    })

    it("shouldn't allow deleting a row in a table which is different to the one the row was created on", async () => {
      const createdRow = await config.createRow(row)
      await request
        .delete(`/api/wrong_table/rows/${createdRow._id}/${createdRow._rev}`)
        .set(config.defaultHeaders())
        .expect(400)
    })
  })

  describe("validate", () => {
    it("should return no errors on valid row", async () => {
      const res = await request
        .post(`/api/${table._id}/rows/validate`)
        .send({ name: "ivan" })
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.body.valid).toBe(true)
      expect(Object.keys(res.body.errors)).toEqual([])
    })

    it("should errors on invalid row", async () => {
      const res = await request
        .post(`/api/${table._id}/rows/validate`)
        .send({ name: 1 })
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.body.valid).toBe(false)
      expect(Object.keys(res.body.errors)).toEqual(["name"])

    })
  })

  describe("bulkDelete", () => {
    it("should be able to delete a bulk set of rows", async () => {
      const row1 = await config.createRow()
      const row2 = await config.createRow()
      const res = await request
        .post(`/api/${table._id}/rows`)
        .send({
          type: "delete",
          rows: [
            row1,
            row2,
          ]
        })
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.body.length).toEqual(2)
      await loadRow(row1._id, 404)
    })
  })

  describe("search", () => {
    it("should run a search on the table", async () => {
      const row = await config.createRow()
      // add another row that shouldn't be found
      await config.createRow({
        ...basicRow(),
        name: "Other Contact",
      })
      const res = await request
        .post(`/api/${table._id}/rows/search`)
        .send({
          query: {
            name: "Test",
          },
          pagination: { pageSize: 25, page: 0 }
        })
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.body.length).toEqual(1)
      expect(res.body[0]._id).toEqual(row._id)
    })
  })

  describe("fetchView", () => {
    it("should be able to fetch tables contents via 'view'", async () => {
      const row = await config.createRow()
      const res = await request
        .get(`/api/views/all_${table._id}`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.body.length).toEqual(1)
      expect(res.body[0]._id).toEqual(row._id)
    })

    it("should throw an error if view doesn't exist", async () => {
      await request
        .get(`/api/views/derp`)
        .set(config.defaultHeaders())
        .expect(400)
    })

    it("should be able to run on a view", async () => {
      const view = await config.createView()
      const row = await config.createRow()
      const res = await request
        .get(`/api/views/${view._id}`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.body.length).toEqual(1)
      expect(res.body[0]._id).toEqual(row._id)
    })
  })

  describe("user testing", () => {

  })

  describe("fetchEnrichedRows", () => {
    it("should allow enriching some linked rows", async () => {
      const table = await config.createLinkedTable()
      const firstRow = await config.createRow({
        name: "Test Contact",
        description: "original description",
        tableId: table._id
      })
      const secondRow = await config.createRow({
        name: "Test 2",
        description: "og desc",
        link: [{_id: firstRow._id}],
        tableId: table._id,
      })

      // test basic enrichment
      const resBasic = await request
        .get(`/api/${table._id}/rows/${secondRow._id}`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      expect(resBasic.body.link[0]._id).toBe(firstRow._id)
      expect(resBasic.body.link[0].primaryDisplay).toBe("Test Contact")

      // test full enrichment
      const resEnriched = await request
        .get(`/api/${table._id}/${secondRow._id}/enrich`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      expect(resEnriched.body.link.length).toBe(1)
      expect(resEnriched.body.link[0]._id).toBe(firstRow._id)
      expect(resEnriched.body.link[0].name).toBe("Test Contact")
      expect(resEnriched.body.link[0].description).toBe("original description")
    })
  })

  describe("attachments", () => {
    it("should allow enriching attachment rows", async () => {
      const table = await config.createAttachmentTable()
      const row = await config.createRow({
        name: "test",
        description: "test",
        attachment: [{
          url: "/test/thing",
        }],
        tableId: table._id,
      })
      // the environment needs configured for this
      await setup.switchToCloudForFunction(async () => {
        const enriched = await outputProcessing(config.getAppId(), table, [row])
        expect(enriched[0].attachment[0].url).toBe(`/app-assets/assets/${config.getAppId()}/test/thing`)
      })
    })
  })
})