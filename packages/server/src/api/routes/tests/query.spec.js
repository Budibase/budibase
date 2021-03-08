const { checkBuilderEndpoint } = require("./utilities/TestFunctions")
const { basicQuery } = require("./utilities/structures")
const setup = require("./utilities")


describe("/queries", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let datasource

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
    datasource = await config.createDatasource()
  })

  describe("create", () => {
    it("should create a new query", async () => {
      const { _id } = await config.createDatasource()
      const query = basicQuery(_id)
      const res = await request
        .post(`/api/queries`)
        .send(query)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.res.statusMessage).toEqual(
        `Query ${query.name} saved successfully.`
      )
      expect(res.body).toEqual({
        _rev: res.body._rev,
        _id: res.body._id,
        ...query,
      })
    })
  })

  describe("fetch", () => {
    it("returns all the queries from the server", async () => {
      const query = await config.createQuery()
      const res = await request
        .get(`/api/queries`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      const queries = res.body
      expect(queries).toEqual([
        {
          _rev: query._rev,
          _id: query._id,
          ...basicQuery(datasource._id),
          readable: true,
        },
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
    it("should find a query in builder", async () => {
      const query = await config.createQuery()
      const res = await request
        .get(`/api/queries/${query._id}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body._id).toEqual(query._id)
    })

    it("should find a query in cloud", async () => {
      await setup.switchToCloudForFunction(async () => {
        const query = await config.createQuery()
        const res = await request
          .get(`/api/queries/${query._id}`)
          .set(await config.roleHeaders())
          .expect("Content-Type", /json/)
          .expect(200)
        expect(res.body.fields).toBeUndefined()
        expect(res.body.parameters).toBeUndefined()
        expect(res.body.schema).toBeUndefined()
      })
    })
  })

  describe("destroy", () => {
    it("deletes a query and returns a success message", async () => {
      const query = await config.createQuery()

      await request
        .delete(`/api/queries/${query._id}/${query._rev}`)
        .set(config.defaultHeaders())
        .expect(200)

      const res = await request
        .get(`/api/queries`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
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

  describe("preview", () => {
    // TODO: need to mock out an integration with a test one and try this
  })

  describe("execute", () => {
    // TODO: need to mock out an integration with a test one and try this
  })
})
