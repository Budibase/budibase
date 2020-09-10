const { 
  createApplication,
  createClientDatabase,
  createInstance, 
  createModel,
  supertest,
  defaultHeaders,
} = require("./couchTestUtils");

describe("/records", () => {
  let request
  let server
  let instance
  let model
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
    model = await createModel(request, app._id, instance._id)
    record = {
      name: "Test Contact",
      description: "original description",
      status: "new",
      modelId: model._id
    }
  })

  const createRecord = async r => 
    await request
      .post(`/api/${model._id}/records`)
      .send(r || record)
      .set(defaultHeaders(app._id, instance._id))
      .expect('Content-Type', /json/)
      .expect(200)

  const loadRecord = async id => 
    await request
      .get(`/api/${model._id}/records/${id}`)
      .set(defaultHeaders(app._id, instance._id))
      .expect('Content-Type', /json/)
      .expect(200)


  describe("save, load, update, delete", () => {


    it("returns a success message when the record is created", async () => {
      const res = await createRecord()
      expect(res.res.statusMessage).toEqual(`${model.name} created successfully`)           
      expect(res.body.name).toEqual("Test Contact")
      expect(res.body._rev).toBeDefined()
    })

    it("updates a record successfully", async () => {
      const rec = await createRecord()
      const existing = rec.body

      const res = await request
        .post(`/api/${model._id}/records`)
        .send({
          _id: existing._id,
          _rev: existing._rev,
          modelId: model._id,
          name: "Updated Name",
        })
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.res.statusMessage).toEqual(`${model.name} updated successfully.`)
      expect(res.body.name).toEqual("Updated Name")
    })

    it("should load a record", async () => {
      const rec = await createRecord()
      const existing = rec.body

      const res = await request
        .get(`/api/${model._id}/records/${existing._id}`)
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

    it("should list all records for given modelId", async () => {
      const newRecord = {
        modelId: model._id,
        name: "Second Contact",
        status: "new"
      }
      await createRecord()
      await createRecord(newRecord)

      const res = await request
        .get(`/api/${model._id}/records`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.length).toBe(2)
      expect(res.body.find(r => r.name === newRecord.name)).toBeDefined()
      expect(res.body.find(r => r.name === record.name)).toBeDefined()
    })

    it("lists records when queried by their ID", async () => {
      const newRecord = {
        modelId: model._id,
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
        .get(`/api/${model._id}/records/not-a-valid-id`)
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(404)
    })
  })

  describe("patch", () => {
    it("should update only the fields that are supplied", async () => {
      const rec = await createRecord()
      const existing = rec.body

      const res = await request
        .patch(`/api/${model._id}/records/${rec._id}`)
        .send({
          _id: existing._id,
          _rev: existing._rev,
          modelId: model._id,
          name: "Updated Name",
        })
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.res.statusMessage).toEqual(`${model.name} updated successfully.`)
      expect(res.body.name).toEqual("Updated Name")
      expect(res.body.description).toEqual(rec.description)

      const savedRecord = await loadRecord(res.body._id)

      expect(savedRecord.body.description).toEqual(rec.description)
      expect(savedRecord.body.name).toEqual("Updated Name")
        
    })
  })

  describe("validate", () => {
    it("should return no errors on valid record", async () => {
      const result = await request
        .post(`/api/${model._id}/records/validate`)
        .send({ name: "ivan" })
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(result.body.valid).toBe(true)
      expect(Object.keys(result.body.errors)).toEqual([])
    })

    it("should errors on invalid record", async () => {
      const result = await request
        .post(`/api/${model._id}/records/validate`)
        .send({ name: 1 })
        .set(defaultHeaders(app._id, instance._id))
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(result.body.valid).toBe(false)
      expect(Object.keys(result.body.errors)).toEqual(["name"])

    })
  })
})