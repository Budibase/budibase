const TestConfig = require("./utilities/TestConfiguration")
const { checkBuilderEndpoint } = require("./utilities/TestFunctions")
const { basicQuery } = require("./utilities/structures")

describe("/queries", () => {
  let request
  let config

  beforeAll(async () => {
    config = new TestConfig()
    request = config.request
  })

  afterAll(() => {
    config.end()
  })

  beforeEach(async () => {
    await config.init()
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
    let datasource

    beforeEach(async () => {
      datasource = await config.createDatasource()
    })

    afterEach(() => {
      delete datasource._rev
    })

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

  describe("destroy", () => {
    let datasource

    beforeEach(async () => {
      datasource = await config.createDatasource()
    })

    afterEach(() => {
      delete datasource._rev
    })

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
})
