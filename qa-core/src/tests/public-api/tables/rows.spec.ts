import { Row } from "@budibase/server/api/controllers/public/mapping/types"
import { generateRow } from "../../../config/public-api/fixtures/tables"
import TestConfiguration from "../../../config/public-api/TestConfiguration"
import PublicAPIClient from "../../../config/public-api/TestConfiguration/PublicAPIClient"
import AccountsAPIClient from "../../../config/public-api/TestConfiguration/accountsAPIClient"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"

describe("Public API - /rows endpoints", () => {
  const api = new PublicAPIClient()
  const accountsAPI = new AccountsAPIClient()
  const internalAPI = new InternalAPIClient()
  const config = new TestConfiguration<Row>(api, accountsAPI, internalAPI)

  beforeAll(async () => {
    await config.setupAccountAndTenant()
    await config.setApiKey()

    const [aResp, app] = await config.applications.seed()

    config.tables.api.appId = app._id
    config.rows.api.appId = app._id

    const [tResp, table] = await config.tables.seed()
    config.rows.tableId = table._id

    const [rResp, row] = await config.rows.seed(table._id)
    config.context = row
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("POST - Create a row", async () => {
    const [response, row] = await config.rows.create(generateRow())
    expect(response).toHaveStatusCode(200)
    expect(row._id).toBeDefined()
  })

  it("POST - Search rows", async () => {
    const [response, rows] = await config.rows.search({
      query: {
        string: {
          testColumn: config.context.testColumn as string,
        },
      },
    })
    expect(response).toHaveStatusCode(200)
    expect(rows.length).toEqual(1)
    expect(rows[0]._id).toEqual(config.context._id)
    expect(rows[0].tableId).toEqual(config.context.tableId)
    expect(rows[0].testColumn).toEqual(config.context.testColumn)
  })

  it("GET - Retrieve a row", async () => {
    const [response, row] = await config.rows.read(config.context._id)
    expect(response).toHaveStatusCode(200)
    expect(row._id).toEqual(config.context._id)
    expect(row.tableId).toEqual(config.context.tableId)
  })

  it("PUT - update a row", async () => {
    config.context.testColumn = "UpdatedName"
    const [response, row] = await config.rows.update(
      config.context._id,
      config.context
    )
    expect(response).toHaveStatusCode(200)
    expect(row.testColumn).toEqual(config.context.testColumn)
  })
})
