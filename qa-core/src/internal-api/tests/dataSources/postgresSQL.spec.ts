import TestConfiguration from "../../config/TestConfiguration"
import * as fixtures from "../../fixtures"

describe("Internal API - Data Sources: PostgresSQL", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Create an app with a data source - PostgresSQL", async () => {
    // Create app
    const app = await config.api.apps.create({
      ...fixtures.apps.generateApp(),
      useTemplate: "false",
    })

    // Add data source
    const [dataSourceResponse, dataSourceJson] =
      await config.api.datasources.add(fixtures.datasources.postgresSQL())
    const newDataSourceInfo = {
      ...dataSourceJson.datasource,
      name: "PostgresSQL2",
    }
    const [updatedDataSourceResponse, updatedDataSourceJson] =
      await config.api.datasources.update(newDataSourceInfo)

    const dataSourceQuery = {
      datasourceId: updatedDataSourceJson.datasource._id,
      fields: {
        sql: "SELECT * FROM categories;",
      },
      name: "Query 1",
      parameters: {},
      queryVerb: "read",
      schema: {},
      transformer: "return data",
    }
    // Query data source

    const [queryResponse, queryJson] =
      await config.api.datasources.previewQuery(dataSourceQuery)

    // Save query
    const [saveQueryResponse, saveQueryJson] =
      await config.api.datasources.saveQuery(dataSourceQuery)
    // Get Query
    const [getQueryResponse, getQueryJson] =
      await config.api.datasources.getQuery(<string>saveQueryJson._id)
    // Delete data source
    const deleteResponse = await config.api.datasources.delete(
      <string>updatedDataSourceJson.datasource._id,
      <string>updatedDataSourceJson.datasource._rev
    )
  })
})
