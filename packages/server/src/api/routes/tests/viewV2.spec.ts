import * as setup from "./utilities"
import {
  CreateViewRequest,
  FieldType,
  SortOrder,
  SortType,
  Table,
  ViewV2,
} from "@budibase/types"
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

  const viewFilters: Omit<CreateViewRequest, "name" | "tableId"> = {
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
      view = await config.api.viewV2.create(config.table?._id, {
        query: { allOr: false, notEqual: { field: "value" } },
      })
    })

    it("can fetch the expected view", async () => {
      const res = await config.api.viewV2.get(view.id)
      expect(res.status).toBe(200)

      expect(res.body).toEqual({
        data: {
          ...view,
          _id: view._id,
          _rev: expect.any(String),
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
      const newView: CreateViewRequest = {
        name: generator.name(),
        tableId: config.table!._id!,
      }
      const res = await config.api.viewV2.create(config.table?._id, newView)

      expect(res).toEqual({
        ...newView,
        id: expect.any(String),
        version: 2,
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it("can persist views with queries", async () => {
      const newView: CreateViewRequest = {
        name: generator.name(),
        tableId: config.table!._id!,
        ...viewFilters,
      }
      const res = await config.api.viewV2.create(config.table!._id!, newView)

      expect(res).toEqual({
        ...newView,
        ...viewFilters,
        id: expect.any(String),
        version: 2,
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
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
      await config.api.viewV2.get(view.id, { expectStatus: 200 })

      await config.api.viewV2.delete(config.table?._id!, view.id)

      await config.api.viewV2.get(view.id, { expectStatus: 404 })
    })
  })
})
