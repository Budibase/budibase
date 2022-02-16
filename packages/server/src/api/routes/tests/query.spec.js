// Mock out postgres for this
jest.mock("pg")
jest.mock("node-fetch")

// Mock isProdAppID to we can later mock the implementation and pretend we are
// using prod app IDs
const authDb = require("@budibase/backend-core/db")
const { isProdAppID } = authDb
const mockIsProdAppID = jest.fn(isProdAppID)
authDb.isProdAppID = mockIsProdAppID

const setup = require("./utilities")
const { checkBuilderEndpoint } = require("./utilities/TestFunctions")
const { checkCacheForDynamicVariable } = require("../../../threads/utils")
const { basicQuery, basicDatasource } = setup.structures

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
      datasource: {
        ...basicDatasource().datasource,
        source: "INVALID_INTEGRATION",
      },
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
      await setup.switchToSelfHosted(async () => {
        const query = await config.createQuery()
        const res = await request
          .get(`/api/queries/${query._id}`)
          .set(await config.defaultHeaders())
          .expect(200)
          .expect("Content-Type", /json/)
        expect(res.body.fields).toBeDefined()
        expect(res.body.parameters).toBeDefined()
        expect(res.body.schema).toBeDefined()
      })
    })

    it("should remove sensitive info for prod apps", async () => {
      // Mock isProdAppID to pretend we are using a prod app
      mockIsProdAppID.mockClear()
      mockIsProdAppID.mockImplementation(() => true)

      const query = await config.createQuery()
      const res = await request
        .get(`/api/queries/${query._id}`)
        .set(await config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body._id).toEqual(query._id)
      expect(res.body.fields).toBeUndefined()
      expect(res.body.parameters).toBeUndefined()
      expect(res.body.schema).toBeDefined()

      // Reset isProdAppID mock
      expect(mockIsProdAppID).toHaveBeenCalledTimes(1)
      mockIsProdAppID.mockImplementation(isProdAppID)
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
          name: datasource.name,
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
      const { query, datasource } = await createInvalidIntegration()
      await request
        .post(`/api/queries/${query._id}`)
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

  describe("variables", () => {
    async function preview(datasource, fields) {
      return config.previewQuery(request, config, datasource, fields)
    }

    it("should work with static variables", async () => {
      const datasource = await config.restDatasource({
        staticVariables: {
          variable: "google",
          variable2: "1",
        },
      })
      const res = await preview(datasource, {
        path: "www.{{ variable }}.com",
        queryString: "test={{ variable2 }}",
      })
      // these responses come from the mock
      expect(res.body.schemaFields).toEqual(["url", "opts", "value"])
      expect(res.body.rows[0].url).toEqual("http://www.google.com?test=1")
    })

    it("should work with dynamic variables", async () => {
      const { datasource } = await config.dynamicVariableDatasource()
      const res = await preview(datasource, {
        path: "www.google.com",
        queryString: "test={{ variable3 }}",
      })
      expect(res.body.schemaFields).toEqual(["url", "opts", "value"])
      expect(res.body.rows[0].url).toContain("doctype html")
    })

    it("check that it automatically retries on fail with cached dynamics", async () => {
      const { datasource, query: base } =
        await config.dynamicVariableDatasource()
      // preview once to cache
      await preview(datasource, {
        path: "www.google.com",
        queryString: "test={{ variable3 }}",
      })
      // check its in cache
      const contents = await checkCacheForDynamicVariable(base._id, "variable3")
      expect(contents.rows.length).toEqual(1)
      const res = await preview(datasource, {
        path: "www.failonce.com",
        queryString: "test={{ variable3 }}",
      })
      expect(res.body.schemaFields).toEqual(["fails", "url", "opts"])
      expect(res.body.rows[0].fails).toEqual(1)
    })

    it("deletes variables when linked query is deleted", async () => {
      const { datasource, query: base } =
        await config.dynamicVariableDatasource()
      // preview once to cache
      await preview(datasource, {
        path: "www.google.com",
        queryString: "test={{ variable3 }}",
      })
      // check its in cache
      let contents = await checkCacheForDynamicVariable(base._id, "variable3")
      expect(contents.rows.length).toEqual(1)

      // delete the query
      await request
        .delete(`/api/queries/${base._id}/${base._rev}`)
        .set(config.defaultHeaders())
        .expect(200)

      // check variables no longer in cache
      contents = await checkCacheForDynamicVariable(base._id, "variable3")
      expect(contents).toBe(null)
    })
  })
})
