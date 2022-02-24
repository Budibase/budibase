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

async function makeRequest(method, endpoint, body, appId) {
  const extraHeaders = {
    "x-budibase-api-key": apiKey,
    "x-budibase-app-id": appId ? appId : config.getAppId(),
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
})

describe("check the tables endpoints", () => {
  it("should allow retrieving applications through search", async () => {
    const res = await makeRequest("post", "/tables/search")
    expect(res).toSatisfyApiSpec()
  })
})

describe("check the rows endpoints", () => {
  it("should allow retrieving applications through search", async () => {
    const res = await makeRequest("post", `/tables/${table._id}/rows/search`, {
      query: {
      },
    })
    expect(res).toSatisfyApiSpec()
  })
})

describe("check the users endpoints", () => {
  it("should allow retrieving applications through search", async () => {
    const res = await makeRequest("post", "/users/search")
    expect(res).toSatisfyApiSpec()
  })
})

describe("check the queries endpoints", () => {
  it("should allow retrieving applications through search", async () => {
    const res = await makeRequest("post", "/queries/search")
    expect(res).toSatisfyApiSpec()
  })
})

