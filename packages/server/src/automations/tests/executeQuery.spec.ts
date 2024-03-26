import { Datasource, Query, SourceName } from "@budibase/types"
import * as setup from "./utilities"
import { databaseTestProviders } from "../../integrations/tests/utils"
import knex, { Knex } from "knex"
import { generator } from "@budibase/backend-core/tests"

function getKnexClientName(source: SourceName) {
  switch (source) {
    case SourceName.MYSQL:
      return "mysql2"
    case SourceName.SQL_SERVER:
      return "mssql"
    case SourceName.POSTGRES:
      return "pg"
  }
  throw new Error(`Unsupported source: ${source}`)
}

describe.each([
  ["postgres", databaseTestProviders.postgres],
  ["mysql", databaseTestProviders.mysql],
  ["mssql", databaseTestProviders.mssql],
  ["mariadb", databaseTestProviders.mariadb],
])("execute query action (%s)", (__, dsProvider) => {
  let tableName: string
  let client: Knex
  let datasource: Datasource
  let query: Query
  let config = setup.getConfig()

  beforeAll(async () => {
    await config.init()

    const ds = await dsProvider.datasource()
    datasource = await config.api.datasource.create(ds)
    client = knex({
      client: getKnexClientName(ds.source),
      connection: ds.config,
    })
  })

  beforeEach(async () => {
    tableName = generator.guid()
    await client.schema.createTable(tableName, table => {
      table.string("a")
      table.integer("b")
    })
    await client(tableName).insert({ a: "string", b: 1 })
    query = await config.api.query.save({
      name: "test query",
      datasourceId: datasource._id!,
      parameters: [],
      fields: {
        sql: client(tableName).select("*").toSQL().toNative().sql,
      },
      transformer: "",
      schema: {},
      readable: true,
      queryVerb: "read",
    })
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
    expect(res.response).toEqual("Error: missing")
    expect(res.success).toEqual(false)
  })
})
