import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import { db } from "@budibase/backend-core"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import generateApp from "../../../config/internal-api/fixtures/applications"
import generator from "../../../config/generator"
import generateScreen from "../../../config/internal-api/fixtures/screens"
import {
  generateTable,
  generateNewColumnForTable,
} from "../../../config/internal-api/fixtures/table"
import { generateNewRowForTable } from "../../../config/internal-api/fixtures/rows"

describe("Internal API - /applications endpoints", () => {
  const api = new InternalAPIClient()
  const config = new TestConfiguration<Application>(api)

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  async function createAppFromTemplate() {
    return config.applications.create({
      name: generator.word(),
      url: `/${generator.word()}`,
      useTemplate: "true",
      templateName: "Near Miss Register",
      templateKey: "app/near-miss-register",
      templateFile: undefined,
    })
  }

  it("GET - fetch applications", async () => {
    await config.applications.create({
      ...generateApp(),
      useTemplate: false,
    })
    const [response, apps] = await config.applications.fetch()
    expect(response).toHaveStatusCode(200)
    expect(apps.length).toBeGreaterThanOrEqual(1)
  })

  it("POST - Create an application", async () => {
    config.applications.create(generateApp())
  })

  it("POST - Publish application", async () => {
    // create app
    const app = await config.applications.create(generateApp())

    // publish app
    config.applications.api.appId = app.appId
    const [publishResponse, publish] = await config.applications.publish()
    expect(publishResponse).toHaveStatusCode(200)
    expect(publish).toEqual({
      _id: expect.any(String),
      appUrl: app.url,
      status: "SUCCESS",
    })
  })

  it("Publish app flow", async () => {
    // create the app
    const appName = generator.word()
    const app = await createAppFromTemplate()
    config.applications.api.appId = app.appId

    // check preview renders
    const [previewResponse, previewRenders] =
      await config.applications.canRender()
    expect(previewResponse).toHaveStatusCode(200)
    expect(previewRenders).toBe(true)

    // publish app
    await config.applications.publish()

    // check published app renders
    config.applications.api.appId = db.getProdAppID(app.appId)
    const [publishedAppResponse, publishedAppRenders] =
      await config.applications.canRender()
    expect(publishedAppRenders).toBe(true)

    // unpublish app
    await config.applications.unpublish(<string>app.appId)
  })

  it("POST - Sync application before deployment", async () => {
    const app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId

    const [syncResponse, sync] = await config.applications.sync(
      <string>app.appId
    )
    expect(syncResponse).toHaveStatusCode(200)
    expect(sync).toEqual({
      message: "App sync not required, app not deployed.",
    })
  })

  it("POST - Sync application after deployment", async () => {
    const app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId

    // publish app
    await config.applications.publish()

    const [syncResponse, sync] = await config.applications.sync(
      <string>app.appId
    )
    expect(syncResponse).toHaveStatusCode(200)
    expect(sync).toEqual({
      message: "App sync completed successfully.",
    })
  })

  it("PUT - Update an application", async () => {
    const app = await config.applications.create(generateApp())

    config.applications.api.appId = app.appId

    const [updateResponse, updatedApp] = await config.applications.update(
      <string>app.appId,
      {
        name: generator.word(),
      }
    )
    expect(updateResponse).toHaveStatusCode(200)
    expect(updatedApp.name).not.toEqual(app.name)
  })

  it("POST - Revert Changes without changes", async () => {
    const app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId

    const [revertResponse, revert] = await config.applications.revert(
      <string>app.appId
    )
    expect(revertResponse).toHaveStatusCode(400)
    expect(revert).toEqual({
      message: "App has not yet been deployed",
      status: 400,
    })
  })

  it("POST - Revert Changes", async () => {
    const app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId

    // publish app
    const [publishResponse, publish] = await config.applications.publish()
    expect(publishResponse).toHaveStatusCode(200)
    expect(publish.status).toEqual("SUCCESS")

    // Change/add component to the app
    const [screenResponse, screen] = await config.applications.addScreentoApp(
      generateScreen("BASIC")
    )
    expect(screenResponse).toHaveStatusCode(200)
    expect(screen._id).toBeDefined()

    // // Revert the app to published state
    const [revertResponse, revert] = await config.applications.revert(
      <string>app.appId
    )
    expect(revertResponse).toHaveStatusCode(200)
    expect(revert).toEqual({
      message: "Reverted changes successfully.",
    })

    // Check screen is removed
    const [routesResponse, routes] = await config.applications.getRoutes()
    expect(routesResponse).toHaveStatusCode(200)
    expect(routes.routes["/test"]).toBeUndefined()
  })

  it("DELETE - Delete an application", async () => {
    const app = await config.applications.create(generateApp())

    const [deleteResponse] = await config.applications.delete(<string>app.appId)
    expect(deleteResponse).toHaveStatusCode(200)
  })

  it("Operations on Tables", async () => {
    // create the app
    const appName = generator.word()
    const app = await createAppFromTemplate()
    config.applications.api.appId = app.appId

    // Get current tables: expect 2 in this template
    await config.tables.getAll(2)

    // Add new table
    const [createdTableResponse, createdTableData] = await config.tables.save(
      generateTable()
    )
    expect(createdTableResponse).toHaveStatusCode(200)
    expect(createdTableData._id).toBeDefined()
    expect(createdTableData._rev).toBeDefined()

    //Table was added
    await config.tables.getAll(3)

    //Get information about the table
    const [tableInfoResponse, tableInfo] = await config.tables.getTableById(
      <string>createdTableData._id
    )
    expect(tableInfoResponse).toHaveStatusCode(200)
    expect(tableInfo._id).toEqual(createdTableData._id)

    //Add Column to table
    const newColumn = generateNewColumnForTable(createdTableData)
    const [addColumnResponse, addColumnData] = await config.tables.save(
      newColumn
    )
    expect(addColumnResponse).toHaveStatusCode(200)
    expect(addColumnData._id).toEqual(createdTableData._id)
    expect(addColumnData.schema.TestColumn).toBeDefined()

    //Add Row to table
    const newRow = generateNewRowForTable(<string>addColumnData._id)
    const [addRowResponse, addRowData] = await config.rows.add(
      <string>addColumnData._id,
      newRow
    )
    console.log(addRowData)
    expect(addRowResponse).toHaveStatusCode(200)
    expect(addRowData._id).toBeDefined()
    expect(addRowData._rev).toBeDefined()
    expect(addRowData.tableId).toEqual(addColumnData._id)

    //Get Row from table
    const [getRowResponse, getRowData] = await config.rows.getAll(
      <string>addColumnData._id
    )
    expect(getRowResponse).toHaveStatusCode(200)
    expect(getRowData.length).toEqual(1)

    //Delete Row from table
    const rowToDelete = {
      rows: [getRowData[0]],
    }
    const [deleteRowResponse, deleteRowData] = await config.rows.delete(
      <string>addColumnData._id,
      rowToDelete
    )
    expect(deleteRowResponse).toHaveStatusCode(200)
    expect(deleteRowData[0]._id).toEqual(getRowData[0]._id)

    //Delete the table
    const [deleteTableResponse, deleteTable] = await config.tables.delete(
      <string>addColumnData._id,
      <string>addColumnData._rev
    )
    expect(deleteTableResponse).toHaveStatusCode(200)
    expect(deleteTable.message).toEqual(
      `Table ${createdTableData._id} deleted.`
    )

    //Table was deleted
    await config.tables.getAll(2)
  })
})
