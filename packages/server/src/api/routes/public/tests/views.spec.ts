import * as setup from "../../tests/utilities"
import { basicTable } from "../../../../tests/utilities/structures"
import { BasicOperator, Table, UILogicalOperator } from "@budibase/types"
import { PublicAPIRequest } from "./Request"
import { generator } from "@budibase/backend-core/tests"

describe("check public API security", () => {
  const config = setup.getConfig()
  let request: PublicAPIRequest, table: Table

  beforeAll(async () => {
    await config.init()
    request = await PublicAPIRequest.init(config, await config.globalUser())
    table = (await request.tables.create(basicTable())).data
  })

  function baseView() {
    return {
      name: generator.word(),
      tableId: table._id!,
      query: {},
      schema: {
        name: {
          readonly: true,
          visible: true,
        },
      },
    }
  }

  it("should be able to create a view", async () => {
    await request.views.create(baseView(), { status: 201 })
  })

  it("should be able to update a view", async () => {
    const view = await request.views.create(baseView(), { status: 201 })
    const response = await request.views.update(view.data.id, {
      ...view.data,
      name: "new name",
    })
  })

  it("should be able to search views", async () => {
    const viewName = "view to search for"
    const view = await request.views.create(
      {
        ...baseView(),
        name: viewName,
      },
      { status: 201 }
    )
    const results = await request.views.search(viewName, {
      status: 200,
    })
    expect(results.data.length).toEqual(1)
    expect(results.data[0].id).toEqual(view.data.id)
  })

  it("should be able to delete a view", async () => {
    const view = await request.views.create(baseView(), { status: 201 })
    const result = await request.views.destroy(view.data.id, { status: 204 })
    expect(result).toBeDefined()
  })

  it("should be able to search rows through a view", async () => {
    const row1 = await request.rows.create(
      table._id!,
      { name: "hello world" },
      { status: 200 }
    )
    await request.rows.create(table._id!, { name: "foo bar" }, { status: 200 })
    const response = await request.views.create(
      {
        ...baseView(),
        query: {
          logicalOperator: UILogicalOperator.ANY,
          groups: [
            {
              filters: [
                {
                  operator: BasicOperator.STRING,
                  field: "name",
                  value: "hello",
                },
              ],
            },
          ],
        },
      },
      { status: 201 }
    )
    const results = await request.rows.viewSearch(response.data.id, {})
    expect(results.data.length).toEqual(1)
  })
})
