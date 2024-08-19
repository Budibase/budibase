import { Datasource, Query } from "@budibase/types"
import * as setup from "./utilities"
import { DatabaseName } from "../../integrations/tests/utils"
import { Knex } from "knex"

describe.each([
  DatabaseName.POSTGRES,
  DatabaseName.MYSQL,
  DatabaseName.SQL_SERVER,
  DatabaseName.MARIADB,
  DatabaseName.ORACLE,
])("execute query action (%s)", name => {
  let tableName: string
  let client: Knex
  let datasource: Datasource
  let query: Query
  const config = setup.getConfig()

  beforeAll(async () => {
    await config.init()

    const testSetup = await setup.setupTestDatasource(config, name)
    datasource = testSetup.datasource
    client = testSetup.client
  })

  beforeEach(async () => {
    tableName = await setup.createTestTable(client, {
      a: { type: "string" },
      b: { type: "number" },
    })
    await setup.insertTestData(client, tableName, [{ a: "string", b: 1 }])
    query = await setup.saveTestQuery(config, client, tableName, datasource)
  })

  afterEach(async () => {
    await client.schema.dropTable(tableName)
  })

  afterAll(setup.afterAll)

  it("should be able to execute a query", async () => {
    let res = await setup.runStep(setup.actions.EXECUTE_QUERY.stepId, {
      query: { queryId: query._id },
    })
    expect(res.response).toEqual([{ a: "string", b: 1 }])
    expect(res.success).toEqual(true)
  })

  it("should handle a null query value", async () => {
    let res = await setup.runStep(setup.actions.EXECUTE_QUERY.stepId, {
      query: null,
    })
    expect(res.response.message).toEqual("Invalid inputs")
    expect(res.success).toEqual(false)
  })

  it("should handle an error executing a query", async () => {
    let res = await setup.runStep(setup.actions.EXECUTE_QUERY.stepId, {
      query: { queryId: "wrong_id" },
    })
    expect(res.response).toBeDefined()
    expect(res.success).toEqual(false)
  })
})
