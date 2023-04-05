import { TestConfiguration } from "../../config"
import * as fixtures from "../../fixtures"
import { Table } from "../../../types"

describe("Public API - /tables endpoints", () => {
  const config = new TestConfiguration<Table>()

  beforeAll(async () => {
    await config.beforeAll()
    await config.createApp()

    const [tableResp, table] = await config.api.tables.seed()
    config.context = table
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("POST - Create a table", async () => {
    const [response, table] = await config.api.tables.create(
      fixtures.tables.generateTable()
    )
    expect(response).toHaveStatusCode(200)
    expect(table._id).toBeDefined()
  })

  it("POST - Search tables", async () => {
    const [response, tables] = await config.api.tables.search({
      name: config.context.name,
    })
    expect(response).toHaveStatusCode(200)
    expect(tables[0]).toEqual(config.context)
  })

  it("GET - Retrieve a table", async () => {
    const [response, table] = await config.api.tables.read(config.context._id)
    expect(response).toHaveStatusCode(200)
    expect(table).toEqual(config.context)
  })

  it("PUT - update a table", async () => {
    config.context.name = "updatedName"
    const [response, table] = await config.api.tables.update(
      config.context._id,
      config.context
    )
    expect(response).toHaveStatusCode(200)
    expect(table).toEqual(config.context)
  })
})
