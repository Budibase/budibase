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
    model = await createModel(request, instance._id)
    record = {
      name: "Test Contact",
      status: "new",
      modelId: model._id
    }
  })

  describe("save, load, update, delete", () => {

    const createRecord = async r => 
      await request
        .post(`/api/${instance._id}/${model._id}/records`)
        .send(r || record)
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)

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
        .post(`/api/${instance._id}/${model._id}/records`)
        .send({
          _id: existing._id,
          _rev: existing._rev,
          modelId: model._id,
          name: "Updated Name",
        })
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(res.res.statusMessage).toEqual(`${model.name} updated successfully.`)
      expect(res.body.name).toEqual("Updated Name")
    })

    it("should load a record", async () => {
      const rec = await createRecord()
      const existing = rec.body

      const res = await request
        .get(`/api/${instance._id}/${model._id}/records/${existing._id}`)
        .set(defaultHeaders)
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
        .get(`/api/${instance._id}/${model._id}/records`)
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.length).toBe(2)
      expect(res.body.find(r => r.name === newRecord.name)).toBeDefined()
      expect(res.body.find(r => r.name === record.name)).toBeDefined()
    })

    it("load should return 404 when record does not exist", async () => {
      await createRecord()
      await request
        .get(`/api/${instance._id}/${model._id}/records/not-a-valid-id`)
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(404)
    })
  })

  describe("validate", () => {
    it("should return no errors on valid record", async () => {
      const result = await request
        .post(`/api/${instance._id}/${model._id}/records/validate`)
        .send({ name: "ivan" })
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(result.body.valid).toBe(true)
      expect(Object.keys(result.body.errors)).toEqual([])
    })

    it("should errors on invalid record", async () => {
      const result = await request
        .post(`/api/${instance._id}/${model._id}/records/validate`)
        .send({ name: 1 })
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)
      
      expect(result.body.valid).toBe(false)
      expect(Object.keys(result.body.errors)).toEqual(["name"])

    })
  })
})