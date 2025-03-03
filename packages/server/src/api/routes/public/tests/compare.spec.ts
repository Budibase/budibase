import jestOpenAPI from "jest-openapi"
import { run as generateSchema } from "../../../../../specs/generate"
import * as setup from "../../tests/utilities"
import { generateMakeRequest } from "./utils"
import { Table, App, Row } from "@budibase/types"
import nock from "nock"
import environment from "../../../../environment"

const yamlPath = generateSchema()
jestOpenAPI(yamlPath!)

describe("compare", () => {
  let config = setup.getConfig()
  let apiKey: string, table: Table, app: App, makeRequest: any

  beforeAll(async () => {
    app = await config.init()
    table = await config.upsertTable()
    apiKey = await config.generateApiKey()
    makeRequest = generateMakeRequest(apiKey)
  })

  afterAll(setup.afterAll)

  beforeEach(() => {
    nock.cleanAll()
  })

  describe("check the applications endpoints", () => {
    it("should allow retrieving applications through search", async () => {
      const res = await makeRequest("post", "/applications/search")
      expect(res).toSatisfyApiSpec()
    })

    it("should allow creating an application", async () => {
      const res = await makeRequest(
        "post",
        "/applications",
        {
          name: "new App",
        },
        null
      )
      expect(res).toSatisfyApiSpec()
    })

    it("should allow updating an application", async () => {
      const app = config.getApp()
      const appId = config.getAppId()
      const res = await makeRequest(
        "put",
        `/applications/${appId}`,
        {
          ...app,
          name: "updated app name",
        },
        appId
      )
      expect(res).toSatisfyApiSpec()
    })

    it("should allow retrieving an application", async () => {
      const res = await makeRequest("get", `/applications/${config.getAppId()}`)
      expect(res).toSatisfyApiSpec()
    })

    it("should allow deleting an application", async () => {
      nock(environment.WORKER_URL!)
        .delete(`/api/global/roles/${config.getProdAppId()}`)
        .reply(200, {})

      const res = await makeRequest(
        "delete",
        `/applications/${config.getAppId()}`
      )
      expect(res).toSatisfyApiSpec()
    })
  })

  describe("check the tables endpoints", () => {
    it("should allow retrieving tables through search", async () => {
      await config.createApp("new app 1")
      table = await config.upsertTable()
      const res = await makeRequest("post", "/tables/search")
      expect(res).toSatisfyApiSpec()
    })

    it("should allow creating a table", async () => {
      const res = await makeRequest("post", "/tables", {
        name: "table name",
        primaryDisplay: "column1",
        schema: {
          column1: {
            type: "string",
            constraints: {},
          },
        },
      })
      expect(res).toSatisfyApiSpec()
    })

    it("should allow updating a table", async () => {
      const updated = { ...table, _rev: undefined, name: "new name" }
      const res = await makeRequest("put", `/tables/${table._id}`, updated)
      expect(res).toSatisfyApiSpec()
    })

    it("should allow retrieving a table", async () => {
      const res = await makeRequest("get", `/tables/${table._id}`)
      expect(res).toSatisfyApiSpec()
    })

    it("should allow deleting a table", async () => {
      const res = await makeRequest("delete", `/tables/${table._id}`)
      expect(res).toSatisfyApiSpec()
    })
  })

  describe("check the rows endpoints", () => {
    let row: Row
    it("should allow retrieving rows through search", async () => {
      table = await config.upsertTable()
      const res = await makeRequest(
        "post",
        `/tables/${table._id}/rows/search`,
        {
          query: {},
        }
      )
      expect(res).toSatisfyApiSpec()
    })

    it("should allow creating a row", async () => {
      const res = await makeRequest("post", `/tables/${table._id}/rows`, {
        name: "test row",
      })
      expect(res).toSatisfyApiSpec()
      row = res.body.data
    })

    it("should allow updating a row", async () => {
      const res = await makeRequest(
        "put",
        `/tables/${table._id}/rows/${row._id}`,
        {
          name: "test row updated",
        }
      )
      expect(res).toSatisfyApiSpec()
    })

    it("should allow retrieving a row", async () => {
      const res = await makeRequest(
        "get",
        `/tables/${table._id}/rows/${row._id}`
      )
      expect(res).toSatisfyApiSpec()
    })

    it("should allow deleting a row", async () => {
      const res = await makeRequest(
        "delete",
        `/tables/${table._id}/rows/${row._id}`
      )
      expect(res).toSatisfyApiSpec()
    })
  })

  describe("check the queries endpoints", () => {
    it("should allow retrieving queries through search", async () => {
      const res = await makeRequest("post", "/queries/search")
      expect(res).toSatisfyApiSpec()
    })
  })
})
