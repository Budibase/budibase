let setup = require("./utilities")
let { basicDatasource } = setup.structures
let { checkBuilderEndpoint } = require("./utilities/TestFunctions")

describe("/datasources", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let datasource

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
    datasource = await config.createDatasource()
  })

  describe("create", () => {
    it("should create a new datasource", async () => {
      const res = await request
        .post(`/api/datasources`)
        .send(basicDatasource())
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.res.statusMessage).toEqual("Datasource saved successfully.")
      expect(res.body.name).toEqual("Test")
    })
  })

  describe("fetch", () => {
    it("returns all the datasources from the server", async () => {
      const res = await request
        .get(`/api/datasources`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

      const datasources = res.body
      expect(datasources).toEqual([
        {
          "_id": datasources[0]._id,
          "_rev": datasources[0]._rev,
          ...basicDatasource()
        }
      ])
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/datasources`,
      })
    })
  })

  describe("find", () => {
    it("should be able to find a datasource", async () => {
      const res = await request
        .get(`/api/datasources/${datasource._id}`)
        .set(config.defaultHeaders())
        .expect(200)
      expect(res.body._rev).toBeDefined()
      expect(res.body._id).toEqual(datasource._id)
    })
  })

  describe("destroy", () => {
    it("deletes queries for the datasource after deletion and returns a success message", async () => {
      await config.createQuery()

      await request
        .delete(`/api/datasources/${datasource._id}/${datasource._rev}`)
        .set(config.defaultHeaders())
        .expect(200)

      const res = await request
        .get(`/api/datasources`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body).toEqual([])
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "DELETE",
        url: `/api/datasources/${datasource._id}/${datasource._rev}`,
      })
    })

  })
})
