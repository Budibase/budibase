/**
 * Integration tests for SeaTable – runs against a real SeaTable instance.
 *
 * These tests are skipped unless the following environment variables are set:
 *   SEATABLE_SERVER_URL  – e.g. https://seatable-demo.de
 *   SEATABLE_API_TOKEN   – a base-level API token
 *
 * The target base must contain a table called "Table1" with at least
 * a "Name" column of type text.
 *
 * Run with:
 *   SEATABLE_SERVER_URL=https://seatable-demo.de SEATABLE_API_TOKEN=<token> \
 *     yarn jest src/integrations/tests/seatable.integration
 */

import { default as SeaTableModule } from "../seatable"

const SERVER_URL = process.env.SEATABLE_SERVER_URL
const API_TOKEN = process.env.SEATABLE_API_TOKEN
const TABLE_NAME = "Table1"

const runIntegration = SERVER_URL && API_TOKEN

const describeIf = runIntegration ? describe : describe.skip

describeIf("SeaTable Integration (live)", () => {
  let integration: any

  beforeAll(() => {
    integration = new SeaTableModule.integration({
      serverUrl: SERVER_URL!,
      apiToken: API_TOKEN!,
    })
  })

  it("connects successfully", async () => {
    const result = await integration.testConnection()
    expect(result.connected).toBe(true)
  })

  it("performs full CRUD lifecycle", async () => {
    // Create
    const created = await integration.create({
      table: TABLE_NAME,
      json: { Name: "Budibase Integration Test" },
    })
    expect(created).toBeDefined()

    // The create method returns first_row (with column keys) or full response.
    // first_row always contains _id.
    const rowId = created._id
    expect(rowId).toBeDefined()
    expect(typeof rowId).toBe("string")

    // Read – verify the row exists
    const rows = await integration.read({
      table: TABLE_NAME,
      numRecords: 100,
    })
    expect(Array.isArray(rows)).toBe(true)
    expect(rows.some((r: any) => r._id === rowId)).toBe(true)

    // Update
    const updateResult = await integration.update({
      table: TABLE_NAME,
      id: rowId,
      json: { Name: "Budibase Updated Test" },
    })
    expect(updateResult).toBeDefined()

    // Delete
    const deleteResult = await integration.delete({
      table: TABLE_NAME,
      id: rowId,
    })
    expect(deleteResult).toBeDefined()

    // Verify deletion
    const rowsAfterDelete = await integration.read({
      table: TABLE_NAME,
      numRecords: 100,
    })
    expect(rowsAfterDelete.some((r: any) => r._id === rowId)).toBe(false)
  }, 30_000)

  it("reads rows from a table", async () => {
    const rows = await integration.read({
      table: TABLE_NAME,
      numRecords: 10,
    })
    expect(Array.isArray(rows)).toBe(true)
  })

  it("returns connected false for invalid token", async () => {
    const badIntegration = new SeaTableModule.integration({
      serverUrl: SERVER_URL!,
      apiToken: "invalid-token-that-does-not-exist",
    })
    const result = await badIntegration.testConnection()
    expect(result.connected).toBe(false)
  })
})
