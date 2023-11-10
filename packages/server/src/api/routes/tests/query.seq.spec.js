const tk = require( "timekeeper")
tk.freeze(Date.now())

// Mock out postgres for this
jest.mock("pg")
jest.mock("node-fetch")

// Mock isProdAppID to we can later mock the implementation and pretend we are
// using prod app IDs
jest.mock("@budibase/backend-core", () => {
  const core = jest.requireActual("@budibase/backend-core")
  return {
    ...core,
    db: {
      ...core.db,
      isProdAppID: jest.fn(),
    }
  }
})
const setup = require("./utilities")
const { checkBuilderEndpoint } = require("./utilities/TestFunctions")
const { checkCacheForDynamicVariable } = require("../../../threads/utils")
const { basicQuery, basicDatasource } = setup.structures
const { events, db: dbCore } = require("@budibase/backend-core")

describe("/queries", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let datasource, query

  afterAll(setup.afterAll)

  const setupTest = async()=>{

    await config.init()
    datasource = await config.createDatasource()
    query = await config.createQuery()
  }

  beforeAll(async () => {
    await setupTest()
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

  const createQuery = async (query) => {
    return request
      .post(`/api/queries`)
      .send(query)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }

  describe("create", () => {
    it("should create a new query", async () => {
      const { _id } = await config.createDatasource()
      const query = basicQuery(_id)
      jest.clearAllMocks()
      const res = await createQuery(query)

      expect(res.res.statusMessage).toEqual(
        `Query ${query.name} saved successfully.`
      )
      expect(res.body).toEqual({
        _rev: res.body._rev,
        _id: res.body._id,
        ...query,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      expect(events.query.created).toBeCalledTimes(1)
      expect(events.query.updated).not.toBeCalled()
    })
  })

  describe("update", () => {
    it("should update query", async () => {
      const { _id } = await config.createDatasource()
      const query = basicQuery(_id)
      const res = await createQuery(query)
      jest.clearAllMocks()
      query._id = res.body._id
      query._rev = res.body._rev
      await createQuery(query)

      expect(res.res.statusMessage).toEqual(
        `Query ${query.name} saved successfully.`
      )
      expect(res.body).toEqual({
        _rev: res.body._rev,
        _id: res.body._id,
        ...query,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      expect(events.query.created).not.toBeCalled()
      expect(events.query.updated).toBeCalledTimes(1)
    })
  })

  describe("fetch", () => {
    beforeEach(async() => {
      await setupTest()
    })

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
          createdAt: new Date().toISOString(),
          ...basicQuery(datasource._id),
          updatedAt: new Date().toISOString(),
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
      dbCore.isProdAppID.mockClear()
      dbCore.isProdAppID.mockImplementation(() => true)

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
      expect(dbCore.isProdAppID).toHaveBeenCalledTimes(1)
      dbCore.isProdAppID.mockImplementation(() => false)
    })
  })

  describe("destroy", () => {
    beforeEach(async() => {
      await setupTest()
    })

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
      expect(events.query.deleted).toBeCalledTimes(1)
      expect(events.query.deleted).toBeCalledWith(datasource, query)
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
      const query = {
        datasourceId: datasource._id,
        parameters: {},
        fields: {},
        queryVerb: "read",
        name: datasource.name,
      }
      const res = await request
        .post(`/api/queries/preview`)
        .send(query)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      // these responses come from the mock
      expect(res.body.schemaFields).toEqual({
        "a": "string",
        "b": "number",
      })
      expect(res.body.rows.length).toEqual(1)
      expect(events.query.previewed).toBeCalledTimes(1)
      delete datasource.config
      expect(events.query.previewed).toBeCalledWith(datasource, query)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/queries/preview`,
      })
    })
  })

  describe("execute", () => {
    beforeEach(async() => {
      await setupTest()
    })

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
      let error
      try {
        await createInvalidIntegration()
      } catch (err) {
        error = err
      }
      expect(error).toBeDefined()
      expect(error.message).toBe("No datasource implementation found.")
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
      expect(res.body.schemaFields).toEqual({
        "opts": "json",
        "url": "string",
        "value": "string",
      })
      expect(res.body.rows[0].url).toEqual("http://www.google.com?test=1")
    })

    it("should work with dynamic variables", async () => {
      const { datasource } = await config.dynamicVariableDatasource()
      const res = await preview(datasource, {
        path: "www.google.com",
        queryString: "test={{ variable3 }}",
      })
      expect(res.body.schemaFields).toEqual({
        "opts": "json",
        "url": "string",
        "value": "string"
      })
      expect(res.body.rows[0].url).toContain("doctype%20html")
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
      expect(res.body.schemaFields).toEqual({
        "fails": "number",
        "opts": "json",
        "url": "string"
      })
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

  describe("Current User Request Mapping", () => {
    
    async function previewGet(datasource, fields, params) {
      return config.previewQuery(request, config, datasource, fields, params)
    }

    async function previewPost(datasource, fields, params) {
      return config.previewQuery(request, config, datasource, fields, params, "create")
    }

    it("should parse global and query level header mappings", async () => {
      const userDetails = config.getUserDetails()

      const datasource = await config.restDatasource({
        defaultHeaders: {
          "test": "headerVal",
          "emailHdr": "{{[user].[email]}}"
        }
      })
      const res = await previewGet(datasource, {
        path: "www.google.com",
        queryString: "email={{[user].[email]}}",
        headers: {
          queryHdr : "{{[user].[firstName]}}",
          secondHdr : "1234"
        }
      })

      const parsedRequest = JSON.parse(res.body.extra.raw)
      expect(parsedRequest.opts.headers).toEqual({
        "test": "headerVal",
        "emailHdr": userDetails.email,
        "queryHdr": userDetails.firstName,
        "secondHdr" : "1234"
      })
      expect(res.body.rows[0].url).toEqual("http://www.google.com?email=" + userDetails.email.replace("@", "%40"))
    })

    it("should bind the current user to query parameters", async () => {
      const userDetails = config.getUserDetails()
  
      const datasource = await config.restDatasource()
  
      const res = await previewGet(datasource, {
        path: "www.google.com",
        queryString: "test={{myEmail}}&testName={{myName}}&testParam={{testParam}}",
      }, {
        "myEmail" : "{{[user].[email]}}",
        "myName" : "{{[user].[firstName]}}",
        "testParam" : "1234"
      })
  
      expect(res.body.rows[0].url).toEqual("http://www.google.com?test=" + userDetails.email.replace("@", "%40") +
        "&testName=" + userDetails.firstName + "&testParam=1234")
    })

    it("should bind the current user the request body - plain text", async () => {
      const userDetails = config.getUserDetails()
      const datasource = await config.restDatasource()
  
      const res = await previewPost(datasource, {
        path: "www.google.com",
        queryString: "testParam={{testParam}}",
        requestBody: "This is plain text and this is my email: {{[user].[email]}}. This is a test param: {{testParam}}",
        bodyType: "text"
      }, {
        "testParam" : "1234"
      })

      const parsedRequest = JSON.parse(res.body.extra.raw)
      expect(parsedRequest.opts.body).toEqual(`This is plain text and this is my email: ${userDetails.email}. This is a test param: 1234`)
      expect(res.body.rows[0].url).toEqual("http://www.google.com?testParam=1234")
    })

    it("should bind the current user the request body - json", async () => {
      const userDetails = config.getUserDetails()
      const datasource = await config.restDatasource()
  
      const res = await previewPost(datasource, {
        path: "www.google.com",
        queryString: "testParam={{testParam}}",
        requestBody: "{\"email\":\"{{[user].[email]}}\",\"queryCode\":{{testParam}},\"userRef\":\"{{userRef}}\"}",
        bodyType: "json"
      }, {
        "testParam" : "1234",
        "userRef" : "{{[user].[firstName]}}"
      })

      const parsedRequest = JSON.parse(res.body.extra.raw)
      const test = `{"email":"${userDetails.email}","queryCode":1234,"userRef":"${userDetails.firstName}"}`
      expect(parsedRequest.opts.body).toEqual(test)
      expect(res.body.rows[0].url).toEqual("http://www.google.com?testParam=1234")
    })
   
    it("should bind the current user the request body - xml", async () => {
      const userDetails = config.getUserDetails()
      const datasource = await config.restDatasource()
  
      const res = await previewPost(datasource, {
        path: "www.google.com",
        queryString: "testParam={{testParam}}",
        requestBody: "<note> <email>{{[user].[email]}}</email> <code>{{testParam}}</code> " + 
          "<ref>{{userId}}</ref> <somestring>testing</somestring> </note>",
        bodyType: "xml"
      }, {
        "testParam" : "1234",
        "userId" : "{{[user].[firstName]}}"
      })

      const parsedRequest = JSON.parse(res.body.extra.raw)
      const test = `<note> <email>${userDetails.email}</email> <code>1234</code> <ref>${userDetails.firstName}</ref> <somestring>testing</somestring> </note>`
        
      expect(parsedRequest.opts.body).toEqual(test)
      expect(res.body.rows[0].url).toEqual("http://www.google.com?testParam=1234")
    })

    it("should bind the current user the request body - form-data", async () => {
      const userDetails = config.getUserDetails()
      const datasource = await config.restDatasource()
  
      const res = await previewPost(datasource, {
        path: "www.google.com",
        queryString: "testParam={{testParam}}",
        requestBody: "{\"email\":\"{{[user].[email]}}\",\"queryCode\":{{testParam}},\"userRef\":\"{{userRef}}\"}",
        bodyType: "form"
      }, {
        "testParam" : "1234",
        "userRef" : "{{[user].[firstName]}}"
      })

      const parsedRequest = JSON.parse(res.body.extra.raw)

      const emailData = parsedRequest.opts.body._streams[1]
      expect(emailData).toEqual(userDetails.email)

      const queryCodeData = parsedRequest.opts.body._streams[4]
      expect(queryCodeData).toEqual("1234")

      const userRef = parsedRequest.opts.body._streams[7]
      expect(userRef).toEqual(userDetails.firstName)

      expect(res.body.rows[0].url).toEqual("http://www.google.com?testParam=1234")
    })

    it("should bind the current user the request body - encoded", async () => {
      const userDetails = config.getUserDetails()
      const datasource = await config.restDatasource()
  
      const res = await previewPost(datasource, {
        path: "www.google.com",
        queryString: "testParam={{testParam}}",
        requestBody: "{\"email\":\"{{[user].[email]}}\",\"queryCode\":{{testParam}},\"userRef\":\"{{userRef}}\"}",
        bodyType: "encoded"
      }, {
        "testParam" : "1234",
        "userRef" : "{{[user].[firstName]}}"
      })
      const parsedRequest = JSON.parse(res.body.extra.raw)
      
      expect(parsedRequest.opts.body.email).toEqual(userDetails.email)
      expect(parsedRequest.opts.body.queryCode).toEqual("1234")
      expect(parsedRequest.opts.body.userRef).toEqual(userDetails.firstName)
    })

  });
})
