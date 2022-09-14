import { Row } from "../../../../../packages/server/src/api/controllers/public/mapping/types"
import { generateRow } from "../../../config/public-api/fixtures/tables"
import TestConfiguration from "../../../config/public-api/TestConfiguration"
import PublicAPIClient from "../../../config/public-api/TestConfiguration/PublicAPIClient"

describe("Public API - /rows endpoints", () => {
  let api = new PublicAPIClient()

  const config = new TestConfiguration<Row>(api)

  beforeAll(async () => {
    await config.beforeAll()
    const [appResp, app] = await config.applications.seed()

    config.tables.appId = app._id
    const [tableResp, table] = await config.tables.seed()

    config.rows.appId = app._id
    config.rows.tableId = table._id
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("POST - Create a row", async () => {
    const [response, row] = await config.rows.create(generateRow())
    config.context = row
    expect(response).toHaveStatusCode(200)
  })

  it("POST - Search rows", async () => {
    const [response, row] = await config.rows.search({
      name: config.context.name as string,
    })
    expect(response).toHaveStatusCode(200)
  })

  it("GET - Retrieve a row", async () => {
    const [response, row] = await config.rows.read(config.context._id)
    expect(response).toHaveStatusCode(200)
  })

  it("PUT - update a row", async () => {
    config.context.name = "UpdatedName"
    const [response, row] = await config.rows.update(
      config.context._id,
      config.context
    )
    expect(response).toHaveStatusCode(200)
  })
})
