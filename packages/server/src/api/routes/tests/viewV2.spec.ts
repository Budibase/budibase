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

describe("/views/v2", () => {
  const request = setup.getRequest()
  const config = setup.getConfig()
  let table: Table

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
    table = await config.createTable(priceTable())
  })

  const saveView = async (view: ViewV2) => {
    return request
      .post(`/api/views/v2`)
      .send(view)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }

  const getView = (viewId: string) => {
    return request
      .get(`/api/views/v2/${viewId}`)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
  }

  function createView(tableId: string): ViewV2 {
    return {
      name: generator.guid(),
      tableId,
    }
  }

  describe("fetch", () => {
    const views: any[] = []

    beforeAll(async () => {
      table = await config.createTable(priceTable())
      for (let id = 0; id < 10; id++) {
        const res = await saveView(createView(table._id!))
        views.push(res.body)
      }
    })

    it("returns all views", async () => {
      const res = await request
        .get(`/api/views/v2`)
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
        const res = await saveView(createView(newTable._id!))
        newViews.push(res.body)
      }
      const res = await request
        .get(`/api/views/v2?tableId=${newTable._id}`)
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
          `/api/views/v2?tableId=${structures.generator.guid()}&tableId=${structures.generator.guid()}`
        )
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(400)

      expect(res.body.message).toBe("tableId type is not valid")
    })
  })

  describe("getView", () => {
    let view: any
    beforeAll(async () => {
      view = (await saveView(createView(table._id!))).body
    })

    it("can fetch the expected view", async () => {
      const res = await getView(view._id).expect(200)
      expect(res.status).toBe(200)
      expect(res.body._id).toBeDefined()

      expect(res.body).toEqual({
        ...view,
        _id: expect.any(String),
        _rev: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it("will return 404 if the unnexisting id is provided", async () => {
      await getView(structures.generator.guid()).expect(404)
    })
  })

  describe("create", () => {
    it("persist the view when the view is successfully created", async () => {
      const view = createView(table._id!)
      const res = await saveView(view)
      expect(res.status).toBe(200)
      expect(res.body._id).toBeDefined()

      expect(res.body).toEqual({
        ...view,
        _id: expect.any(String),
        _rev: expect.any(String),
      })
    })
  })

  describe("delete", () => {
    let view: any

    beforeAll(async () => {
      table = await config.createTable(priceTable())
      view = (await saveView(createView(table._id!))).body
    })

    it("can delete an existing view", async () => {
      await getView(view._id).expect(200)

      await request
        .delete(`/api/views/v2/${view._id}`)
        .set(config.defaultHeaders())
        .expect(204)

      await getView(view._id).expect(404)
    })
  })
})
