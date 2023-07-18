import * as setup from "./utilities"
import { FieldType, Table, ViewV2 } from "@budibase/types"
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
  const request = setup.getRequest()
  const config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
    await config.createTable(priceTable())
  })

  describe("fetch", () => {
    const views: ViewV2[] = []

    beforeAll(async () => {
      await config.createTable(priceTable())
      for (let id = 0; id < 10; id++) {
        views.push(await config.api.viewV2.create())
      }
    })

    it("returns all views", async () => {
      const res = await request
        .get(`/api/v2/views`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.views.length).toBe(10)
      expect(res.body.views).toEqual(
        expect.arrayContaining(views.map(v => expect.objectContaining(v)))
      )
    })

    it("can filter by table id", async () => {
      const newTable = await config.createTable(priceTable())
      const newViews = []
      for (let id = 0; id < 5; id++) {
        newViews.push(await config.api.viewV2.create({ tableId: newTable._id }))
      }

      const res = await request
        .get(`/api/v2/views?tableId=${newTable._id}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.views.length).toBe(5)
      expect(res.body.views).toEqual(
        expect.arrayContaining(newViews.map(v => expect.objectContaining(v)))
      )
    })

    it("can not filter by multiple table ids", async () => {
      const res = await request
        .get(
          `/api/v2/views?tableId=${structures.generator.guid()}&tableId=${structures.generator.guid()}`
        )
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(400)

      expect(res.body.message).toBe("tableId type is not valid")
    })
  })

  describe("getView", () => {
    const getView = (viewId: string) => {
      return request
        .get(`/api/v2/views/${viewId}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
    }

    let view: ViewV2
    beforeAll(async () => {
      view = await config.api.viewV2.create()
    })

    it("can fetch the expected view", async () => {
      const res = await getView(view._id!).expect(200)
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
      await getView(structures.generator.guid()).expect(404)
    })
  })

  describe("create", () => {
    it("persist the view when the view is successfully created", async () => {
      const newView: ViewV2 = {
        name: generator.name(),
        tableId: config.table!._id!,
      }
      const res = await request
        .post(`/api/v2/views`)
        .send(newView)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(201)

      expect(res.body).toEqual({
        data: {
          ...newView,
          _id: expect.any(String),
          _rev: expect.any(String),
        },
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
      await config.api.viewV2.get(view._id!).expect(200)

      await request
        .delete(`/api/v2/views/${view._id}`)
        .set(config.defaultHeaders())
        .expect(204)

      await config.api.viewV2.get(view._id!).expect(404)
    })
  })
})
