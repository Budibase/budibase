// mock out postgres for this
jest.mock("pg")

const { checkBuilderEndpoint } = require("./utilities/TestFunctions")
const { basicQuery, basicDatasource } = require("./utilities/structures")
const setup = require("./utilities")

describe("/queries", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let datasource, query

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
    datasource = await config.createDatasource()
    query = await config.createQuery()
  })

  async function createInvalidIntegration() {
    const datasource = await config.createDatasource({
      ...basicDatasource(),
      source: "INVALID_INTEGRATION",
    })
    const query = await config.createQuery()
    return { datasource, query }
  }

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
        url: `/api/queries/${config._id}/${config._rev}`,
      })
    })
  })

  describe("preview", () => {
    it("should be able to preview the query", async () => {
      const res = await request
        .post(`/api/queries/preview`)
        .send({
          datasourceId: datasource._id,
          parameters: {},
          fields: {},
          queryVerb: "read",
        })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      // these responses come from the mock
      expect(res.body.schemaFields).toEqual(["a", "b"])
      expect(res.body.rows.length).toEqual(1)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/queries/preview`,
      })
    })

    it("should fail with invalid integration type", async () => {
      const { datasource } = await createInvalidIntegration()
      await request
        .post(`/api/queries/preview`)
        .send({
          datasourceId: datasource._id,
          parameters: {},
          fields: {},
          queryVerb: "read",
        })
        .set(config.defaultHeaders())
        .expect(400)
    })
  })

  describe("execute", () => {
    it("should be able to execute the query", async () => {
      const res = await request
        .post(`/api/queries/${query._id}`)
        .send({
          parameters: {},
        })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.length).toEqual(1)
    })

    it("should fail with invalid integration type", async () => {
      const { query } = await createInvalidIntegration()
      await request
        .post(`/api/queries/${query._id}`)
        .send({
          parameters: {},
        })
        .set(config.defaultHeaders())
        .expect(400)
    })
  })
})
