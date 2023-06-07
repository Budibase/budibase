import TestConfiguration from "../../config/TestConfiguration"
import { generator } from "../../../shared"
import * as fixtures from "../../fixtures"

describe("Internal API - Table Operations", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  async function createAppFromTemplate() {
    return config.api.apps.create({
      name: generator.word(),
      url: `/${generator.word()}`,
      useTemplate: "true",
      templateName: "Near Miss Register",
      templateKey: "app/near-miss-register",
      templateFile: undefined,
    })
  }

  it("Create and delete table, columns and rows", async () => {
    // create the app
    await config.createApp(fixtures.apps.appFromTemplate())

    // Get current tables: expect 2 in this template
    await config.api.tables.getAll(2)

    // Add new table
    const [createdTableResponse, createdTableData] =
      await config.api.tables.save(fixtures.tables.generateTable())

    //Table was added
    await config.api.tables.getAll(3)

    //Get information about the table
    await config.api.tables.getTableById(createdTableData._id!)

    //Add Column to table
    const newColumn =
      fixtures.tables.generateNewColumnForTable(createdTableData)
    const [addColumnResponse, addColumnData] = await config.api.tables.save(
      newColumn,
      true
    )

    //Add Row to table
    const newRow = fixtures.rows.generateNewRowForTable(addColumnData._id!)
    await config.api.rows.add(addColumnData._id!, newRow)

    //Get Row from table
    const [getRowResponse, getRowData] = await config.api.rows.getAll(
      addColumnData._id!
    )

    //Delete Row from table
    const rowToDelete = {
      rows: [getRowData[0]],
    }
    const [deleteRowResponse, deleteRowData] = await config.api.rows.delete(
      addColumnData._id!,
      rowToDelete
    )
    expect(deleteRowData[0]._id).toEqual(getRowData[0]._id)

    //Delete the table
    const [deleteTableResponse, deleteTable] = await config.api.tables.delete(
      addColumnData._id!,
      addColumnData._rev!
    )

    //Table was deleted
    await config.api.tables.getAll(2)
  })

  it("Search and pagination", async () => {
    // create the app
    await config.createApp(fixtures.apps.appFromTemplate())

    // Get current tables: expect 2 in this template
    await config.api.tables.getAll(2)

    // Add new table
    const [createdTableResponse, createdTableData] =
      await config.api.tables.save(fixtures.tables.generateTable())

    //Table was added
    await config.api.tables.getAll(3)

    //Get information about the table
    await config.api.tables.getTableById(createdTableData._id!)

    //Add Column to table
    const newColumn =
      fixtures.tables.generateNewColumnForTable(createdTableData)
    const [addColumnResponse, addColumnData] = await config.api.tables.save(
      newColumn,
      true
    )

    //Add Row to table
    let newRow = fixtures.rows.generateNewRowForTable(addColumnData._id!)
    await config.api.rows.add(addColumnData._id!, newRow)

    //Search single row
    await config.api.rows.searchNoPagination(
      createdTableData._id!,
      fixtures.rows.searchBody(createdTableData.primaryDisplay!)
    )

    //Add 10 more rows
    for (let i = 0; i < 10; i++) {
      let newRow = fixtures.rows.generateNewRowForTable(addColumnData._id!)
      await config.api.rows.add(addColumnData._id!, newRow)
    }

    //Search rows with pagination
    const [allRowsResponse, allRowsJson] =
      await config.api.rows.searchWithPagination(
        createdTableData._id!,
        fixtures.rows.searchBody(createdTableData.primaryDisplay!)
      )

    //Delete Rows from table
    const rowToDelete = {
      rows: [allRowsJson],
    }
    const [deleteRowResponse, deleteRowData] = await config.api.rows.delete(
      createdTableData._id!,
      rowToDelete
    )

    //Search single row
    await config.api.rows.searchWithPagination(
      createdTableData._id!,
      fixtures.rows.searchBody(createdTableData.primaryDisplay!)
    )
  })
})
