const { 
  createApplication,
  createTable,
  supertest,
  defaultHeaders,
} = require("./couchTestUtils");

describe("/rows", () => {
  let request
  let server
  let instanceId
  let table
  let row
  let app

  beforeAll(async () => {
    ({ request, server } = await supertest())

  });

  afterAll(() => {
    server.close()
  })

  beforeEach(async () => {
    app = await createApplication(request)
    instanceId = app.instances[0]._id
    table = await createTable(request, instanceId)
    row = {
      name: "Test Contact",
      description: "original description",
      status: "new",
      tableId: table._id
    }
  })

  const createRow = async r => 
    await request
      .post(`/api/${r ? r.tableId : row.tableId}/rows`)
      .send(r || row)
      .set(defaultHeaders(instanceId))
      .expect('Content-Type', /json/)
      .expect(200)

  const loadRow = async id => 
    await request
      .get(`/api/${table._id}/rows/${id}`)
      .set(defaultHeaders(instanceId))
      .expect('Content-Type', /json/)
      .expect(200)


  describe("save, load, update, delete", () => {


    it("returns a success message when the row is created", async () => {
      const res = await createRow()
      expect(res.res.statusMessage).toEqual(`${table.name} created successfully`)           
      expect(res.body.name).toEqual("Test Contact")
      expect(res.body._rev).toBeDefined()
    })

    it("updates a row successfully", async () => {
      const rec = await createRow()
      const existing = rec.body

      const res = await request
        .post(`/api/${table._id}/rows`)
        .send({
          _id: existing._id,
          _rev: existing._rev,
          tableId: table._id,
          name: "Updated Name",
        })
        .set(defaultHeaders(instanceId))
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.res.statusMessage).toEqual(`${table.name} updated successfully.`)
      expect(res.body.name).toEqual("Updated Name")
    })

    it("should load a row", async () => {
      const rec = await createRow()
      const existing = rec.body

      const res = await request
        .get(`/api/${table._id}/rows/${existing._id}`)
        .set(defaultHeaders(instanceId))
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
      await createRow()
      await createRow(newRow)

      const res = await request
        .get(`/api/${table._id}/rows`)
        .set(defaultHeaders(instanceId))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.length).toBe(2)
      expect(res.body.find(r => r.name === newRow.name)).toBeDefined()
      expect(res.body.find(r => r.name === row.name)).toBeDefined()
    })

    it("lists rows when queried by their ID", async () => {
      const newRow = {
        tableId: table._id,
        name: "Second Contact",
        status: "new"
      }
      const row = await createRow()
      const secondRow = await createRow(newRow)

      const rowIds = [row.body._id, secondRow.body._id]

      const res = await request
        .post(`/api/rows/search`)
        .set(defaultHeaders(instanceId))
        .send({
          keys: rowIds
        })
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.length).toBe(2)
      expect(res.body.map(response => response._id)).toEqual(expect.arrayContaining(rowIds))
    })

    it("load should return 404 when row does not exist", async () => {
      await createRow()
      await request
        .get(`/api/${table._id}/rows/not-a-valid-id`)
        .set(defaultHeaders(instanceId))
        .expect('Content-Type', /json/)
        .expect(404)
    })

    it("row values are coerced", async () => {
      const str = {type:"string", constraints: { type: "string", presence: false }}
      const attachment = {type:"attachment", constraints: { type: "array", presence: false }}
      const bool = {type:"boolean", constraints: { type: "boolean", presence: false }}
      const number = {type:"number", constraints: { type: "number", presence: false }}
      const datetime = {type:"datetime", constraints: { type: "string", presence: false, datetime: {earliest:"", latest: ""}  }}

      table = await createTable(request, instanceId, {
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

      const id = (await createRow(row)).body._id

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
      const rec = await createRow()
      const existing = rec.body

      const res = await request
        .patch(`/api/${table._id}/rows/${existing._id}`)
        .send({
          _id: existing._id,
          _rev: existing._rev,
          tableId: table._id,
          name: "Updated Name",
        })
        .set(defaultHeaders(instanceId))
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.res.statusMessage).toEqual(`${table.name} updated successfully.`)
      expect(res.body.name).toEqual("Updated Name")
      expect(res.body.description).toEqual(existing.description)

      const savedRow = await loadRow(res.body._id)

      expect(savedRow.body.description).toEqual(existing.description)
      expect(savedRow.body.name).toEqual("Updated Name")
        
    })
  })

  describe("validate", () => {
    it("should return no errors on valid row", async () => {
      const result = await request
        .post(`/api/${table._id}/rows/validate`)
        .send({ name: "ivan" })
        .set(defaultHeaders(instanceId))
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(result.body.valid).toBe(true)
      expect(Object.keys(result.body.errors)).toEqual([])
    })

    it("should errors on invalid row", async () => {
      const result = await request
        .post(`/api/${table._id}/rows/validate`)
        .send({ name: 1 })
        .set(defaultHeaders(instanceId))
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(result.body.valid).toBe(false)
      expect(Object.keys(result.body.errors)).toEqual(["name"])

    })
  })
})