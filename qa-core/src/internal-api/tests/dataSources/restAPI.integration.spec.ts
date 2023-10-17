import TestConfiguration from "../../config/TestConfiguration"
import * as fixtures from "../../fixtures"
import { Query } from "@budibase/types"

describe("Internal API - Data Sources: REST API", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Create an app with a data source - REST API", async () => {
    // Create app
    await config.createApp()

    // Get all integrations
    await config.api.integrations.getAll()

    // Add data source
    const [dataSourceResponse, dataSourceJson] =
      await config.api.datasources.add(fixtures.datasources.restAPI())

    // Update data source
    const newDataSourceInfo = {
      ...dataSourceJson.datasource,
      name: "RestAPI - Updated",
    }
    const [updatedDataSourceResponse, updatedDataSourceJson] =
      await config.api.datasources.update(newDataSourceInfo)

    // Query data source
    const [queryResponse, queryJson] = await config.api.queries.preview(
      fixtures.queries.restAPI(updatedDataSourceJson.datasource._id!)
    )

    expect(queryJson.rows.length).toEqual(1)
    expect(queryJson.schemaFields).toEqual(
      fixtures.queries.expectedSchemaFields.restAPI
    )

    // Save query
    const datasourcetoSave: Query = {
      ...fixtures.queries.postgres(updatedDataSourceJson.datasource._id!),
      parameters: [],
    }

    const [saveQueryResponse, saveQueryJson] = await config.api.queries.save(
      datasourcetoSave
    )
    // Get Query
    const [getQueryResponse, getQueryJson] = await config.api.queries.getQuery(
      saveQueryJson._id!
    )

    // Get Query permissions
    const [getQueryPermissionsResponse, getQueryPermissionsJson] =
      await config.api.permissions.getAll(saveQueryJson._id!)

    // Delete data source
    const deleteResponse = await config.api.datasources.delete(
      updatedDataSourceJson.datasource._id!,
      updatedDataSourceJson.datasource._rev!
    )
  })
})
