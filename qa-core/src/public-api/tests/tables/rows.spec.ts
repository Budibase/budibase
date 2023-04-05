import { TestConfiguration } from "../../config"
import * as fixtures from "../../fixtures"
import { Row } from "../../../types"

describe("Public API - /rows endpoints", () => {
  const config = new TestConfiguration<Row>()

  beforeAll(async () => {
    await config.beforeAll()
    await config.createApp()

    const [tResp, table] = await config.api.tables.seed()
    config.state.tableId = table._id

    const [rResp, row] = await config.api.rows.seed(table._id)
    config.context = row
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("POST - Create a row", async () => {
    const [response, row] = await config.api.rows.create(
      fixtures.rows.generateRow()
    )
    expect(response).toHaveStatusCode(200)
    expect(row._id).toBeDefined()
  })

  it("POST - Search rows", async () => {
    const [response, rows] = await config.api.rows.search({
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
    const [response, row] = await config.api.rows.read(config.context._id)
    expect(response).toHaveStatusCode(200)
    expect(row._id).toEqual(config.context._id)
    expect(row.tableId).toEqual(config.context.tableId)
  })

  it("PUT - update a row", async () => {
    config.context.testColumn = "UpdatedName"
    const [response, row] = await config.api.rows.update(
      config.context._id,
      config.context
    )
    expect(response).toHaveStatusCode(200)
    expect(row.testColumn).toEqual(config.context.testColumn)
  })
})
