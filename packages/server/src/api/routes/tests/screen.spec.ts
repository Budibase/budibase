import { checkBuilderEndpoint } from "./utilities/TestFunctions"
import * as setup from "./utilities"
import { events } from "@budibase/backend-core"
import { Screen } from "@budibase/types"

const { basicScreen } = setup.structures

describe("/screens", () => {
  let config = setup.getConfig()
  let screen: Screen

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
    screen = await config.createScreen()
  })

  describe("fetch", () => {
    it("should be able to create a layout", async () => {
      const screens = await config.api.screen.list({ status: 200 })
      expect(screens.length).toEqual(1)
      expect(screens.some(s => s._id === screen._id)).toEqual(true)
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
    const saveScreen = async (screen: Screen) => {
      return await config.api.screen.save(screen, { status: 200 })
    }

    it("should be able to create a screen", async () => {
      jest.clearAllMocks()

      const screen = basicScreen()
      const responseScreen = await saveScreen(screen)

      expect(responseScreen._rev).toBeDefined()
      expect(responseScreen.name).toEqual(screen.name)
      expect(events.screen.created).toHaveBeenCalledTimes(1)
    })

    it("should be able to update a screen", async () => {
      const screen = basicScreen()
      let responseScreen = await saveScreen(screen)
      screen._id = responseScreen._id
      screen._rev = responseScreen._rev
      screen.name = "edit"
      jest.clearAllMocks()

      responseScreen = await saveScreen(screen)

      expect(responseScreen._rev).toBeDefined()
      expect(responseScreen.name).toEqual(screen.name)
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
      const response = await config.api.screen.destroy(
        screen._id!,
        screen._rev!,
        { status: 200 }
      )
      expect(response.message).toBeDefined()
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
