import { Table } from "../../../../../packages/server/src/api/controllers/public/mapping/types"
import { generateTable } from "../../../config/public-api/fixtures/tables"
import TestConfiguration from "../../../config/public-api/TestConfiguration"
import PublicAPIClient from "../../../config/public-api/TestConfiguration/PublicAPIClient"

describe("Public API - /tables endpoints", () => {
  let api = new PublicAPIClient()
  const config = new TestConfiguration<Table>(api)

  beforeAll(async () => {
    await config.beforeAll()
    const [_, app] = await config.applications.seed()
    config.tables.appId = app._id
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("POST - Create a table", async () => {
    const [response, table] = await config.tables.create(generateTable())
    config.context = table
    expect(response).toHaveStatusCode(200)
  })

  it("POST - Search tables", async () => {
    const [response, table] = await config.tables.search({
      name: config.context.name,
    })
    expect(response).toHaveStatusCode(200)
  })

  it("GET - Retrieve a table", async () => {
    const [response, table] = await config.tables.read(config.context._id)
    expect(response).toHaveStatusCode(200)
  })

  it("PUT - update a table", async () => {
    config.context.name = "updatedName"
    const [response, table] = await config.tables.update(
      config.context._id,
      config.context
    )
    expect(response).toHaveStatusCode(200)
  })
})
