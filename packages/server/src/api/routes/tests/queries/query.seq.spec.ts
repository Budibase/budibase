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

  it("should apply authorization to endpoint", async () => {
    await checkBuilderEndpoint({
      config,
      method: "GET",
      url: `/api/datasources`,
    })
  })

  describe("destroy", () => {
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
    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/queries/preview`,
      })
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
