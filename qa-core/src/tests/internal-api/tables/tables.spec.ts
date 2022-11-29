import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import generator from "../../../config/generator"
import {
  generateTable,
  generateNewColumnForTable,
} from "../../../config/internal-api/fixtures/table"
import { generateNewRowForTable } from "../../../config/internal-api/fixtures/rows"

describe("Internal API - Application creation, update, publish and delete", () => {
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

    //Table was added
    await config.tables.getAll(3)

    //Get information about the table
    await config.tables.getTableById(<string>createdTableData._id)

    //Add Column to table
    const newColumn = generateNewColumnForTable(createdTableData)
    const [addColumnResponse, addColumnData] = await config.tables.save(
      newColumn,
      true
    )

    //Add Row to table
    const newRow = generateNewRowForTable(<string>addColumnData._id)
    await config.rows.add(<string>addColumnData._id, newRow)

    //Get Row from table
    const [getRowResponse, getRowData] = await config.rows.getAll(
      <string>addColumnData._id
    )

    //Delete Row from table
    const rowToDelete = {
      rows: [getRowData[0]],
    }
    const [deleteRowResponse, deleteRowData] = await config.rows.delete(
      <string>addColumnData._id,
      rowToDelete
    )
    expect(deleteRowData[0]._id).toEqual(getRowData[0]._id)

    //Delete the table
    const [deleteTableResponse, deleteTable] = await config.tables.delete(
      <string>addColumnData._id,
      <string>addColumnData._rev
    )

    //Table was deleted
    await config.tables.getAll(2)
  })
})
