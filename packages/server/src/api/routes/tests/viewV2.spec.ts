import * as setup from "./utilities"
import {
  CreateViewRequest,
  FieldType,
  SortOrder,
  SortType,
  Table,
  ViewV2,
} from "@budibase/types"
import { generator } from "@budibase/backend-core/tests"

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
      Currency: {
        type: FieldType.STRING,
        name: "Currency",
        constraints: {},
      },
      ItemId: {
        type: FieldType.STRING,
        name: "ItemId",
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
    columns: {
      name: {
        visible: true,
      },
    },
  }

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
    await config.createTable(priceTable())
  })

  describe("create", () => {
    it("persist the view when the view is successfully created", async () => {
      const newView: CreateViewRequest = {
        name: generator.name(),
        tableId: config.table!._id!,
      }
      const res = await config.api.viewV2.create(newView)

      expect(res).toEqual({
        ...newView,
        id: expect.stringMatching(new RegExp(`${config.table?._id!}_`)),
        version: 2,
      })
    })

    it("can persist views with queries", async () => {
      const newView: CreateViewRequest = {
        name: generator.name(),
        tableId: config.table!._id!,
        ...viewFilters,
      }
      const res = await config.api.viewV2.create(newView)

      expect(res).toEqual({
        ...newView,
        ...viewFilters,
        id: expect.any(String),
        version: 2,
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
      const tableId = config.table!._id!
      const getPersistedView = async () =>
        (await config.api.table.get(tableId)).views![view.name]

      expect(await getPersistedView()).toBeDefined()

      await config.api.viewV2.delete(view.id)

      expect(await getPersistedView()).toBeUndefined()
    })
  })

  describe("getSchema", () => {
    beforeAll(async () => {
      await config.createTable(priceTable())
    })

    it("returns table schema if no columns are defined", async () => {
      const view = await config.api.viewV2.create()
      const result = await config.api.viewV2.getSchema(view.id)
      expect(result).toEqual({
        schema: {
          Price: {
            type: "number",
            name: "Price",
            constraints: {},
          },
          Currency: {
            type: "string",
            name: "Currency",
            constraints: {},
          },
          ItemId: {
            type: "string",
            name: "ItemId",
            constraints: {
              type: "string",
            },
          },
        },
      })
    })

    it("respects view column definition if exists", async () => {
      const view = await config.api.viewV2.create({
        columns: ["Price", "ItemId"],
      })
      const result = await config.api.viewV2.getSchema(view.id)
      expect(result).toEqual({
        schema: {
          Price: {
            type: "number",
            name: "Price",
            constraints: {},
          },
          ItemId: {
            type: "string",
            name: "ItemId",
            constraints: {
              type: "string",
            },
          },
        },
      })
    })

    it("respects view column definition if exists", async () => {
      const view = await config.api.viewV2.create({
        columns: ["Price", "innexistingColumn"],
      })
      const result = await config.api.viewV2.getSchema(view.id)
      expect(result).toEqual({
        schema: {
          Price: {
            type: "number",
            name: "Price",
            constraints: {},
          },
        },
      })
    })
  })
})
