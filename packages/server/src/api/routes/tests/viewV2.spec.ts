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

  describe("update", () => {
    let view: ViewV2

    beforeEach(async () => {
      await config.createTable(priceTable())
      view = await config.api.viewV2.create({ name: "View A" })
    })

    it("can update an existing view data", async () => {
      const tableId = config.table!._id!
      await config.api.viewV2.update({
        ...view,
        query: { equal: { newField: "thatValue" } },
      })

      expect(await config.api.table.get(tableId)).toEqual({
        ...config.table,
        views: {
          [view.name]: {
            ...view,
            query: { equal: { newField: "thatValue" } },
            schema: expect.anything(),
          },
        },
        _rev: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it("can update an existing view name", async () => {
      const tableId = config.table!._id!
      await config.api.viewV2.update({ ...view, name: "View B" })

      expect(await config.api.table.get(tableId)).toEqual(
        expect.objectContaining({
          views: {
            "View B": { ...view, name: "View B", schema: expect.anything() },
          },
        })
      )
    })

    it("cannot update an unexisting views nor edit ids", async () => {
      const tableId = config.table!._id!
      await config.api.viewV2.update(
        { ...view, id: generator.guid() },
        { expectStatus: 404 }
      )

      expect(await config.api.table.get(tableId)).toEqual(
        expect.objectContaining({
          views: {
            [view.name]: {
              ...view,
              schema: expect.anything(),
            },
          },
        })
      )
    })

    it("cannot update views with the wrong tableId", async () => {
      const tableId = config.table!._id!
      await config.api.viewV2.update(
        {
          ...view,
          tableId: generator.guid(),
          query: { equal: { newField: "thatValue" } },
        },
        { expectStatus: 404 }
      )

      expect(await config.api.table.get(tableId)).toEqual(
        expect.objectContaining({
          views: {
            [view.name]: {
              ...view,
              schema: expect.anything(),
            },
          },
        })
      )
    })

    it("cannot update views v1", async () => {
      const viewV1 = await config.createView()
      await config.api.viewV2.update(
        {
          ...viewV1,
        },
        {
          expectStatus: 400,
          handleResponse: r => {
            expect(r.body).toEqual({
              message: "Only views V2 can be updated",
              status: 400,
            })
          },
        }
      )
    })

    it("cannot update the a view with unmatching ids between url and body", async () => {
      const anotherView = await config.api.viewV2.create()
      const result = await config
        .request!.put(`/api/v2/views/${anotherView.id}`)
        .send(view)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(400)

      expect(result.body).toEqual({
        message: "View id does not match between the body and the uri path",
        status: 400,
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
})
