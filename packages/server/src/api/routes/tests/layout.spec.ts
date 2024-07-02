import { checkBuilderEndpoint } from "./utilities/TestFunctions"
import { structures } from "./utilities"
import { events } from "@budibase/backend-core"
import TestConfiguration from "../../../../src/tests/utilities/TestConfiguration"
import { SaveLayoutResponse } from "@budibase/types"

const { basicLayout } = structures

describe("/layouts", () => {
  const config = new TestConfiguration()
  let layout: SaveLayoutResponse

  beforeAll(async () => {
    await config.init()
    layout = await config.createLayout()
    jest.clearAllMocks()
  })

  afterAll(() => {
    config.end()
  })

  describe("save", () => {
    it("should be able to create a layout", async () => {
      const res = await config
        .request!.post(`/api/layouts`)
        .send(basicLayout())
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body._rev).toBeDefined()
      expect(events.layout.created).toHaveBeenCalledTimes(1)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/layouts`,
      })
    })
  })

  describe("destroy", () => {
    it("should be able to delete the layout", async () => {
      const res = await config
        .request!.delete(`/api/layouts/${layout._id}/${layout._rev}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.message).toBeDefined()
      expect(events.layout.deleted).toHaveBeenCalledTimes(1)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "DELETE",
        url: `/api/layouts/${layout._id}/${layout._rev}`,
      })
    })
  })
})
