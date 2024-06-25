import { checkBuilderEndpoint } from "./utilities/TestFunctions"
import { structures } from "./utilities"
import { events } from "@budibase/backend-core"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { Screen } from "@budibase/types"

const { basicScreen } = structures

describe("/screens", () => {
  const config = new TestConfiguration()

  let screen: Screen

  beforeAll(async () => {
    await config.init()
    screen = await config.createScreen()
  })

  afterAll(() => {
    config.end()
  })

  describe("fetch", () => {
    it("should be able to create a layout", async () => {
      const res = await config
        .request!.get(`/api/screens`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.length).toEqual(1)
      expect(res.body.some(s => s._id === screen._id)).toEqual(true)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/screens`,
      })
    })
  })

  describe("save", () => {
    const saveScreen = async screen => {
      const res = await config
        .request!.post(`/api/screens`)
        .send(screen)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      return res
    }

    it("should be able to create a screen", async () => {
      jest.clearAllMocks()

      const screen = basicScreen()
      const res = await saveScreen(screen)

      expect(res.body._rev).toBeDefined()
      expect(res.body.name).toEqual(screen.name)
      expect(events.screen.created).toHaveBeenCalledTimes(1)
    })

    it("should be able to update a screen", async () => {
      const screen = basicScreen()
      let res = await saveScreen(screen)
      screen._id = res.body._id
      screen._rev = res.body._rev
      screen.name = "edit"
      jest.clearAllMocks()

      res = await saveScreen(screen)

      expect(res.body._rev).toBeDefined()
      expect(res.body.name).toEqual(screen.name)
      expect(events.screen.created).not.toHaveBeenCalled()
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/screens`,
      })
    })
  })

  describe("destroy", () => {
    it("should be able to delete the screen", async () => {
      const res = await config
        .request!.delete(`/api/screens/${screen._id}/${screen._rev}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.message).toBeDefined()
      expect(events.screen.deleted).toHaveBeenCalledTimes(1)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "DELETE",
        url: `/api/screens/${screen._id}/${screen._rev}`,
      })
    })
  })
})
