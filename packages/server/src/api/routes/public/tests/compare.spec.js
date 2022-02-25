const jestOpenAPI = require("jest-openapi").default
const generateSchema = require("../../../../../specs/generate")
const setup = require("../../tests/utilities")
const { checkSlashesInUrl } = require("../../../../utilities")

const yamlPath = generateSchema()
jestOpenAPI(yamlPath)

let request = setup.getRequest()
let config = setup.getConfig()
let apiKey, table

beforeAll(async () => {
  await config.init()
  table = await config.updateTable()
  apiKey = await config.generateApiKey()
})

afterAll(setup.afterAll)

async function makeRequest(method, endpoint, body, appId = config.getAppId()) {
  const extraHeaders = {
    "x-budibase-api-key": apiKey,
  }
  if (appId) {
    extraHeaders["x-budibase-app-id"] = appId
  }
  const req = request
    [method](checkSlashesInUrl(`/api/public/v1/${endpoint}`))
    .set(config.defaultHeaders(extraHeaders))
  if (body) {
    req.send(body)
  }
  const res = await req.expect("Content-Type", /json/).expect(200)
  expect(res.body).toBeDefined()
  return res
}

describe("check the applications endpoints", () => {
  it("should allow retrieving applications through search", async () => {
    const res = await makeRequest("post", "/applications/search")
    expect(res).toSatisfyApiSpec()
  })

  it("should allow creating an application", async () => {
    const res = await makeRequest("post", "/applications", {
      name: "new App"
    }, null)
    expect(res).toSatisfyApiSpec()
  })

  it("should allow updating an application", async () => {
    const app = config.getApp()
    const appId = config.getAppId()
    const res = await makeRequest("put", `/applications/${appId}`, {
      ...app,
      name: "updated app name",
    }, appId)
    expect(res).toSatisfyApiSpec()
  })

  it("should allow retrieving an application", async () => {
    const res = await makeRequest("get", `/applications/${config.getAppId()}`)
    expect(res).toSatisfyApiSpec()
  })

  it("should allow deleting an application", async () => {
    const res = await makeRequest("delete", `/applications/${config.getAppId()}`)
    expect(res).toSatisfyApiSpec()
  })
})

describe("check the tables endpoints", () => {
  it("should allow retrieving tables through search", async () => {
    const res = await makeRequest("post", "/tables/search")
    expect(res).toSatisfyApiSpec()
  })

  it("should allow creating a table", async () => {

  })

  it("should allow updating a table", async () => {

  })

  it("should allow retrieving a table", async () => {

  })

  it("should allow deleting a table", async () => {

  })
})

describe("check the rows endpoints", () => {
  it("should allow retrieving rows through search", async () => {
    const res = await makeRequest("post", `/tables/${table._id}/rows/search`, {
      query: {
      },
    })
    expect(res).toSatisfyApiSpec()
  })

  it("should allow creating a row", async () => {

  })

  it("should allow updating a row", async () => {

  })

  it("should allow retrieving a row", async () => {

  })

  it("should allow deleting a row", async () => {

  })
})

describe("check the users endpoints", () => {
  it("should allow retrieving users through search", async () => {
    const res = await makeRequest("post", "/users/search")
    expect(res).toSatisfyApiSpec()
  })

  it("should allow creating a user", async () => {

  })

  it("should allow updating a user", async () => {

  })

  it("should allow retrieving a user", async () => {

  })

  it("should allow deleting a user", async () => {

  })
})

describe("check the queries endpoints", () => {
  it("should allow retrieving queries through search", async () => {
    const res = await makeRequest("post", "/queries/search")
    expect(res).toSatisfyApiSpec()
  })

  it("should allow executing a query", async () => {

  })
})

