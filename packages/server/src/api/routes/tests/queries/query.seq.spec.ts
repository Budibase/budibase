import tk from "timekeeper"

const pg = require("pg")

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
    },
  }
})
import * as setup from "../utilities"
import { checkBuilderEndpoint } from "../utilities/TestFunctions"
import { checkCacheForDynamicVariable } from "../../../../threads/utils"

const { basicQuery, basicDatasource } = setup.structures
import { events, db as dbCore } from "@budibase/backend-core"
import {
  Datasource,
  Query,
  SourceName,
  QueryPreview,
  QueryParameter,
} from "@budibase/types"

tk.freeze(Date.now())

const mockIsProdAppID = dbCore.isProdAppID as jest.MockedFunction<
  typeof dbCore.isProdAppID
>

describe("/queries", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let datasource: Datasource & Required<Pick<Datasource, "_id">>, query: Query

  afterAll(setup.afterAll)

  const setupTest = async () => {
    await config.init()
    datasource = await config.createDatasource()
    query = await config.createQuery()
  }

  beforeAll(async () => {
    await setupTest()
  })

  const createQuery = async (query: Query) => {
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

      expect((res as any).res.statusMessage).toEqual(
        `Query ${query.name} saved successfully.`
      )
      expect(res.body).toEqual({
        _rev: res.body._rev,
        _id: res.body._id,
        ...query,
        nullDefaultSupport: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      expect(events.query.created).toHaveBeenCalledTimes(1)
      expect(events.query.updated).not.toHaveBeenCalled()
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

      expect((res as any).res.statusMessage).toEqual(
        `Query ${query.name} saved successfully.`
      )
      expect(res.body).toEqual({
        _rev: res.body._rev,
        _id: res.body._id,
        ...query,
        nullDefaultSupport: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      expect(events.query.created).not.toHaveBeenCalled()
      expect(events.query.updated).toHaveBeenCalledTimes(1)
    })
  })

  describe("fetch", () => {
    beforeEach(async () => {
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
          nullDefaultSupport: true,
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
      await config.withEnv({ SELF_HOSTED: "true" }, async () => {
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
      expect(dbCore.isProdAppID).toHaveBeenCalledTimes(1)
      mockIsProdAppID.mockImplementation(() => false)
    })
  })

  describe("destroy", () => {
    beforeEach(async () => {
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
      expect(events.query.deleted).toHaveBeenCalledTimes(1)
      expect(events.query.deleted).toHaveBeenCalledWith(datasource, query)
    })

    it("should apply authorization to endpoint", async () => {
      const query = await config.createQuery()
      await checkBuilderEndpoint({
        config,
        method: "DELETE",
        url: `/api/queries/${query._id}/${query._rev}`,
      })
    })
  })

  describe("preview", () => {
    it("should be able to preview the query", async () => {
      const queryPreview: QueryPreview = {
        datasourceId: datasource._id,
        queryVerb: "read",
        fields: {},
        parameters: [],
        transformer: "return data",
        name: datasource.name!,
        schema: {},
        readable: true,
      }
      const responseBody = await config.api.query.previewQuery(queryPreview)
      // these responses come from the mock
      expect(responseBody.schema).toEqual({
        a: { type: "string", name: "a" },
        b: { type: "number", name: "b" },
      })
      expect(responseBody.rows.length).toEqual(1)
      expect(events.query.previewed).toHaveBeenCalledTimes(1)
      delete datasource.config
      expect(events.query.previewed).toHaveBeenCalledWith(datasource, {
        ...queryPreview,
        nullDefaultSupport: true,
      })
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/queries/preview`,
      })
    })

    it("should not error when trying to generate a nested schema for an empty array", async () => {
      const queryPreview: QueryPreview = {
        datasourceId: datasource._id,
        parameters: [],
        fields: {},
        queryVerb: "read",
        name: datasource.name!,
        transformer: "return data",
        schema: {},
        readable: true,
      }
      const rows = [
        {
          contacts: [],
        },
      ]
      pg.queryMock.mockImplementation(() => ({
        rows,
      }))

      const responseBody = await config.api.query.previewQuery(queryPreview)
      expect(responseBody).toEqual({
        nestedSchemaFields: {},
        rows,
        schema: {
          contacts: { type: "array", name: "contacts" },
        },
      })
      expect(responseBody.rows.length).toEqual(1)
      delete datasource.config
    })

    it("should generate a nested schema based on all the nested items", async () => {
      const queryPreview: QueryPreview = {
        datasourceId: datasource._id,
        parameters: [],
        fields: {},
        queryVerb: "read",
        name: datasource.name!,
        transformer: "return data",
        schema: {},
        readable: true,
      }
      const rows = [
        {
          contacts: [
            {
              address: "123 Lane",
            },
            {
              address: "456 Drive",
            },
            {
              postcode: "BT1 12N",
              lat: 54.59,
              long: -5.92,
            },
            {
              city: "Belfast",
            },
            {
              address: "789 Avenue",
              phoneNumber: "0800-999-5555",
            },
            {
              name: "Name",
              isActive: false,
            },
          ],
        },
      ]

      pg.queryMock.mockImplementation(() => ({
        rows,
      }))

      const responseBody = await config.api.query.previewQuery(queryPreview)
      expect(responseBody).toEqual({
        nestedSchemaFields: {
          contacts: {
            address: {
              type: "string",
              name: "address",
            },
            postcode: {
              type: "string",
              name: "postcode",
            },
            lat: {
              type: "number",
              name: "lat",
            },
            long: {
              type: "number",
              name: "long",
            },
            city: {
              type: "string",
              name: "city",
            },
            phoneNumber: {
              type: "string",
              name: "phoneNumber",
            },
            name: {
              type: "string",
              name: "name",
            },
            isActive: {
              type: "boolean",
              name: "isActive",
            },
          },
        },
        rows,
        schema: {
          contacts: { type: "json", name: "contacts", subtype: "array" },
        },
      })
      expect(responseBody.rows.length).toEqual(1)
      delete datasource.config
    })
  })

  describe("execute", () => {
    beforeEach(async () => {
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
      const datasource: Datasource = {
        ...basicDatasource().datasource,
        source: "INVALID_INTEGRATION" as SourceName,
      }
      await config.api.datasource.create(datasource, {
        status: 500,
        body: {
          message: "No datasource implementation found.",
        },
      })
    })

    it("shouldn't allow handlebars to be passed as parameters", async () => {
      const res = await request
        .post(`/api/queries/${query._id}`)
        .send({
          parameters: {
            a: "{{ 'test' }}",
          },
        })
        .set(config.defaultHeaders())
        .expect(400)
      expect(res.body.message).toEqual(
        "Parameter 'a' input contains a handlebars binding - this is not allowed."
      )
    })
  })

  describe("variables", () => {
    async function preview(datasource: Datasource, fields: any) {
      const queryPreview: QueryPreview = {
        datasourceId: datasource._id!,
        parameters: [],
        fields,
        queryVerb: "read",
        name: datasource.name!,
        transformer: "return data",
        schema: {},
        readable: true,
      }
      return await config.api.query.previewQuery(queryPreview)
    }

    it("should work with static variables", async () => {
      const datasource = await config.restDatasource({
        staticVariables: {
          variable: "google",
          variable2: "1",
        },
      })
      const responseBody = await preview(datasource, {
        path: "www.{{ variable }}.com",
        queryString: "test={{ variable2 }}",
      })
      // these responses come from the mock
      expect(responseBody.schema).toEqual({
        opts: { type: "json", name: "opts" },
        url: { type: "string", name: "url" },
        value: { type: "string", name: "value" },
      })
      expect(responseBody.rows[0].url).toEqual("http://www.google.com?test=1")
    })

    it("should work with dynamic variables", async () => {
      const { datasource } = await config.dynamicVariableDatasource()
      const responseBody = await preview(datasource, {
        path: "www.google.com",
        queryString: "test={{ variable3 }}",
      })
      expect(responseBody.schema).toEqual({
        opts: { type: "json", name: "opts" },
        url: { type: "string", name: "url" },
        value: { type: "string", name: "value" },
      })
      expect(responseBody.rows[0].url).toContain("doctype%20html")
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
      const contents = await checkCacheForDynamicVariable(
        base._id!,
        "variable3"
      )
      expect(contents.rows.length).toEqual(1)
      const responseBody = await preview(datasource, {
        path: "www.failonce.com",
        queryString: "test={{ variable3 }}",
      })
      expect(responseBody.schema).toEqual({
        fails: { type: "number", name: "fails" },
        opts: { type: "json", name: "opts" },
        url: { type: "string", name: "url" },
      })
      expect(responseBody.rows[0].fails).toEqual(1)
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
      let contents = await checkCacheForDynamicVariable(base._id!, "variable3")
      expect(contents.rows.length).toEqual(1)

      // delete the query
      await request
        .delete(`/api/queries/${base._id}/${base._rev}`)
        .set(config.defaultHeaders())
        .expect(200)

      // check variables no longer in cache
      contents = await checkCacheForDynamicVariable(base._id!, "variable3")
      expect(contents).toBe(null)
    })
  })

  describe("Current User Request Mapping", () => {
    async function previewGet(
      datasource: Datasource,
      fields: any,
      params: QueryParameter[]
    ) {
      const queryPreview: QueryPreview = {
        datasourceId: datasource._id!,
        parameters: params,
        fields,
        queryVerb: "read",
        name: datasource.name!,
        transformer: "return data",
        schema: {},
        readable: true,
      }
      return await config.api.query.previewQuery(queryPreview)
    }

    async function previewPost(
      datasource: Datasource,
      fields: any,
      params: QueryParameter[]
    ) {
      const queryPreview: QueryPreview = {
        datasourceId: datasource._id!,
        parameters: params,
        fields,
        queryVerb: "create",
        name: datasource.name!,
        transformer: null,
        schema: {},
        readable: false,
      }
      return await config.api.query.previewQuery(queryPreview)
    }

    it("should parse global and query level header mappings", async () => {
      const userDetails = config.getUserDetails()

      const datasource = await config.restDatasource({
        defaultHeaders: {
          test: "headerVal",
          emailHdr: "{{[user].[email]}}",
        },
      })
      const responseBody = await previewGet(
        datasource,
        {
          path: "www.google.com",
          queryString: "email={{[user].[email]}}",
          headers: {
            queryHdr: "{{[user].[firstName]}}",
            secondHdr: "1234",
          },
        },
        []
      )

      const parsedRequest = JSON.parse(responseBody.extra.raw)
      expect(parsedRequest.opts.headers).toEqual({
        test: "headerVal",
        emailHdr: userDetails.email,
        queryHdr: userDetails.firstName,
        secondHdr: "1234",
      })
      expect(responseBody.rows[0].url).toEqual(
        "http://www.google.com?email=" + userDetails.email.replace("@", "%40")
      )
    })

    it("should bind the current user to query parameters", async () => {
      const userDetails = config.getUserDetails()

      const datasource = await config.restDatasource()

      const responseBody = await previewGet(
        datasource,
        {
          path: "www.google.com",
          queryString:
            "test={{myEmail}}&testName={{myName}}&testParam={{testParam}}",
        },
        [
          { name: "myEmail", default: "{{[user].[email]}}" },
          { name: "myName", default: "{{[user].[firstName]}}" },
          { name: "testParam", default: "1234" },
        ]
      )

      expect(responseBody.rows[0].url).toEqual(
        "http://www.google.com?test=" +
          userDetails.email.replace("@", "%40") +
          "&testName=" +
          userDetails.firstName +
          "&testParam=1234"
      )
    })

    it("should bind the current user the request body - plain text", async () => {
      const userDetails = config.getUserDetails()
      const datasource = await config.restDatasource()

      const responseBody = await previewPost(
        datasource,
        {
          path: "www.google.com",
          queryString: "testParam={{testParam}}",
          requestBody:
            "This is plain text and this is my email: {{[user].[email]}}. This is a test param: {{testParam}}",
          bodyType: "text",
        },
        [{ name: "testParam", default: "1234" }]
      )

      const parsedRequest = JSON.parse(responseBody.extra.raw)
      expect(parsedRequest.opts.body).toEqual(
        `This is plain text and this is my email: ${userDetails.email}. This is a test param: 1234`
      )
      expect(responseBody.rows[0].url).toEqual(
        "http://www.google.com?testParam=1234"
      )
    })

    it("should bind the current user the request body - json", async () => {
      const userDetails = config.getUserDetails()
      const datasource = await config.restDatasource()

      const responseBody = await previewPost(
        datasource,
        {
          path: "www.google.com",
          queryString: "testParam={{testParam}}",
          requestBody:
            '{"email":"{{[user].[email]}}","queryCode":{{testParam}},"userRef":"{{userRef}}"}',
          bodyType: "json",
        },
        [
          { name: "testParam", default: "1234" },
          { name: "userRef", default: "{{[user].[firstName]}}" },
        ]
      )

      const parsedRequest = JSON.parse(responseBody.extra.raw)
      const test = `{"email":"${userDetails.email}","queryCode":1234,"userRef":"${userDetails.firstName}"}`
      expect(parsedRequest.opts.body).toEqual(test)
      expect(responseBody.rows[0].url).toEqual(
        "http://www.google.com?testParam=1234"
      )
    })

    it("should bind the current user the request body - xml", async () => {
      const userDetails = config.getUserDetails()
      const datasource = await config.restDatasource()

      const responseBody = await previewPost(
        datasource,
        {
          path: "www.google.com",
          queryString: "testParam={{testParam}}",
          requestBody:
            "<note> <email>{{[user].[email]}}</email> <code>{{testParam}}</code> " +
            "<ref>{{userId}}</ref> <somestring>testing</somestring> </note>",
          bodyType: "xml",
        },
        [
          { name: "testParam", default: "1234" },
          { name: "userId", default: "{{[user].[firstName]}}" },
        ]
      )

      const parsedRequest = JSON.parse(responseBody.extra.raw)
      const test = `<note> <email>${userDetails.email}</email> <code>1234</code> <ref>${userDetails.firstName}</ref> <somestring>testing</somestring> </note>`

      expect(parsedRequest.opts.body).toEqual(test)
      expect(responseBody.rows[0].url).toEqual(
        "http://www.google.com?testParam=1234"
      )
    })

    it("should bind the current user the request body - form-data", async () => {
      const userDetails = config.getUserDetails()
      const datasource = await config.restDatasource()

      const responseBody = await previewPost(
        datasource,
        {
          path: "www.google.com",
          queryString: "testParam={{testParam}}",
          requestBody:
            '{"email":"{{[user].[email]}}","queryCode":{{testParam}},"userRef":"{{userRef}}"}',
          bodyType: "form",
        },
        [
          { name: "testParam", default: "1234" },
          { name: "userRef", default: "{{[user].[firstName]}}" },
        ]
      )

      const parsedRequest = JSON.parse(responseBody.extra.raw)

      const emailData = parsedRequest.opts.body._streams[1]
      expect(emailData).toEqual(userDetails.email)

      const queryCodeData = parsedRequest.opts.body._streams[4]
      expect(queryCodeData).toEqual("1234")

      const userRef = parsedRequest.opts.body._streams[7]
      expect(userRef).toEqual(userDetails.firstName)

      expect(responseBody.rows[0].url).toEqual(
        "http://www.google.com?testParam=1234"
      )
    })

    it("should bind the current user the request body - encoded", async () => {
      const userDetails = config.getUserDetails()
      const datasource = await config.restDatasource()

      const responseBody = await previewPost(
        datasource,
        {
          path: "www.google.com",
          queryString: "testParam={{testParam}}",
          requestBody:
            '{"email":"{{[user].[email]}}","queryCode":{{testParam}},"userRef":"{{userRef}}"}',
          bodyType: "encoded",
        },
        [
          { name: "testParam", default: "1234" },
          { name: "userRef", default: "{{[user].[firstName]}}" },
        ]
      )
      const parsedRequest = JSON.parse(responseBody.extra.raw)

      expect(parsedRequest.opts.body.email).toEqual(userDetails.email)
      expect(parsedRequest.opts.body.queryCode).toEqual("1234")
      expect(parsedRequest.opts.body.userRef).toEqual(userDetails.firstName)
    })
  })
})
