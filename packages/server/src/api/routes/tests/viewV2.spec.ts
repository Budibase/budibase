import * as setup from "./utilities"
import { FieldType, SortOrder, SortType, Table, ViewV2 } from "@budibase/types"
import { generator, structures } from "@budibase/backend-core/tests"

function priceTable(): Table {
  return {
    name: "table",
    type: "table",
    schema: {
      Price: {
        type: FieldType.NUMBER,
        name: "Price",
        constraints: {},
      },
      Category: {
        type: FieldType.STRING,
        name: "Category",
        constraints: {
          type: "string",
        },
      },
    },
  }
}

describe("/v2/views", () => {
  const config = setup.getConfig()

  const viewFilters: Omit<ViewV2, "name" | "tableId"> = {
    query: { allOr: false, equal: { field: "value" } },
    sort: {
      field: "fieldToSort",
      order: SortOrder.DESCENDING,
      type: SortType.STRING,
    },
    columns: ["name"],
  }

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
    await config.createTable(priceTable())
  })

  describe("getView", () => {
    let view: ViewV2
    beforeAll(async () => {
      view = await config.api.viewV2.create({
        query: { allOr: false, notEqual: { field: "value" } },
      })
    })

    it("can fetch the expected view", async () => {
      const res = await config.api.viewV2.get(view._id!)
      expect(res.status).toBe(200)

      expect(res.body).toEqual({
        data: {
          ...view,
          _id: view._id,
          _rev: view._rev,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      })
    })

    it("will return 404 if the unnexisting id is provided", async () => {
      await config.api.viewV2.get(structures.generator.guid(), {
        expectStatus: 404,
      })
    })
  })

  describe("create", () => {
    it("persist the view when the view is successfully created", async () => {
      const newView: ViewV2 = {
        name: generator.name(),
        tableId: config.table!._id!,
      }
      const res = await config.api.viewV2.create(newView)

      expect(res).toEqual({
        ...newView,
        _id: expect.any(String),
        _rev: expect.any(String),
      })
    })

    it("can persist views with queries", async () => {
      const newView: ViewV2 = {
        name: generator.name(),
        tableId: config.table!._id!,
        ...viewFilters,
      }
      const res = await config.api.viewV2.create(newView)

      expect(res).toEqual({
        ...newView,
        ...viewFilters,
        _id: expect.any(String),
        _rev: expect.any(String),
      })
    })
  })

  describe("delete", () => {
    let view: ViewV2

    beforeAll(async () => {
      await config.createTable(priceTable())
      view = await config.api.viewV2.create()
    })

    it("can delete an existing view", async () => {
      await config.api.viewV2.get(view._id!, { expectStatus: 200 })

      await config.api.viewV2.delete(view._id!)

      await config.api.viewV2.get(view._id!, { expectStatus: 404 })
    })
  })
})
