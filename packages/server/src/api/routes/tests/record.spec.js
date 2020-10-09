const { 
  createApplication,
  createClientDatabase,
  createInstance, 
  createTable,
  supertest,
  defaultHeaders,
} = require("./couchTestUtils");

describe("/records", () => {
  let request
  let server
  let instance
  let table
  let record
  let app

  beforeAll(async () => {
    ({ request, server } = await supertest())
    await createClientDatabase(request)
    app = await createApplication(request)
  });

  afterAll(async () => {
    server.close();
  })

  beforeEach(async () => {
    instance = await createInstance(request, app._id)
    table = await createTable(request, app._id, instance._id)
    record = {
      name: "Test Contact",
      description: "original description",
      status: "new",
      tableId: table._id
    }
  })

  const createRecord = async r => 
    await request
      .post(`/api/${r ? r.tableId : record.tableId}/records`)
      .send(r || record)
      .set(defaultHeaders(app._id, instance._id))
      .expect('Content-Type', /json/)
      .expect(200)

  const loadRecord = async id => 
    await request
      .get(`/api/${table._id}/records/${id}`)
      .set(defaultHeaders(app._id, instance._id))
      .expect('Content-Type', /json/)
      .expect(200)


  describe("save, load, update, delete", () => {


    it("returns a success message when the record is created", async () => {
      const res = await createRecord()
      expect(res.res.statusMessage).toEqual(`${table.name} created successfully`)           
      expect(res.body.name).toEqual("Test Contact")
      expect(res.body._rev).toBeDefined()
    })

    it("updates a record successfully", async () => {
      const rec = await createRecord()
      const existing = rec.body

      const res = await request
        .post(`/api/${table._id}/records`)
        .send({
          _id: existing._id,
          _rev: existing._rev,
          tableId: table._id,
          name: "Updated Name",
        })
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.res.statusMessage).toEqual(`${table.name} updated successfully.`)
      expect(res.body.name).toEqual("Updated Name")
    })

    it("should load a record", async () => {
      const rec = await createRecord()
      const existing = rec.body

      const res = await request
        .get(`/api/${table._id}/records/${existing._id}`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body).toEqual({
        ...record,
        _id: existing._id,
        _rev: existing._rev,
        type: "record",
      })
    })

    it("should list all records for given tableId", async () => {
      const newRecord = {
        tableId: table._id,
        name: "Second Contact",
        status: "new"
      }
      await createRecord()
      await createRecord(newRecord)

      const res = await request
        .get(`/api/${table._id}/records`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.length).toBe(2)
      expect(res.body.find(r => r.name === newRecord.name)).toBeDefined()
      expect(res.body.find(r => r.name === record.name)).toBeDefined()
    })

    it("lists records when queried by their ID", async () => {
      const newRecord = {
        tableId: table._id,
        name: "Second Contact",
        status: "new"
      }
      const record = await createRecord()
      const secondRecord = await createRecord(newRecord)

      const recordIds = [record.body._id, secondRecord.body._id]

      const res = await request
        .post(`/api/records/search`)
        .set(defaultHeaders(app._id, instance._id))
        .send({
          keys: recordIds
        })
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.length).toBe(2)
      expect(res.body.map(response => response._id)).toEqual(expect.arrayContaining(recordIds))
    })

    it("load should return 404 when record does not exist", async () => {
      await createRecord()
      await request
        .get(`/api/${table._id}/records/not-a-valid-id`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(404)
    })

    it("record values are coerced", async () => {
      const str = {type:"string", constraints: { type: "string", presence: false }}
      const attachment = {type:"attachment", constraints: { type: "array", presence: false }}
      const bool = {type:"boolean", constraints: { type: "boolean", presence: false }}
      const number = {type:"number", constraints: { type: "number", presence: false }}
      const datetime = {type:"datetime", constraints: { type: "string", presence: false, datetime: {earliest:"", latest: ""}  }}

      table = await createTable(request, app._id, instance._id, {
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

      record = {
        name: "Test Record",
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

      const id = (await createRecord(record)).body._id

      const saved = (await loadRecord(id)).body

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
      expect(saved.datetimeString).toBe(new Date(record.datetimeString).toISOString())
      expect(saved.datetimeDate).toBe(record.datetimeDate.toISOString())
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
      const rec = await createRecord()
      const existing = rec.body

      const res = await request
        .patch(`/api/${table._id}/records/${existing._id}`)
        .send({
          _id: existing._id,
          _rev: existing._rev,
          tableId: table._id,
          name: "Updated Name",
        })
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.res.statusMessage).toEqual(`${table.name} updated successfully.`)
      expect(res.body.name).toEqual("Updated Name")
      expect(res.body.description).toEqual(existing.description)

      const savedRecord = await loadRecord(res.body._id)

      expect(savedRecord.body.description).toEqual(existing.description)
      expect(savedRecord.body.name).toEqual("Updated Name")
        
    })
  })

  describe("validate", () => {
    it("should return no errors on valid record", async () => {
      const result = await request
        .post(`/api/${table._id}/records/validate`)
        .send({ name: "ivan" })
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(result.body.valid).toBe(true)
      expect(Object.keys(result.body.errors)).toEqual([])
    })

    it("should errors on invalid record", async () => {
      const result = await request
        .post(`/api/${table._id}/records/validate`)
        .send({ name: 1 })
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(result.body.valid).toBe(false)
      expect(Object.keys(result.body.errors)).toEqual(["name"])

    })
  })
})