import * as setup from "./utilities"
import { AppNavigation, WithRequired, WorkspaceApp } from "@budibase/types"

describe("/navigation", () => {
  let config = setup.getConfig()
  let workspaceApp: WithRequired<WorkspaceApp, "_id">

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await config.newTenant()
    const { workspaceApps } = await config.api.workspaceApp.fetch()
    workspaceApp = workspaceApps[0]
  })

  afterAll(setup.afterAll)

  const sampleNavigation: AppNavigation = {
    navigation: "Top",
    links: [
      {
        url: "/home",
        text: "Home",
        type: "link",
      },
      {
        url: "/about",
        text: "About",
        type: "link",
      },
    ],
  }

  describe("PUT /api/navigation/:workspaceAppId", () => {
    it("should update navigation for workspace app", async () => {
      await config.api.navigation.update(workspaceApp._id, {
        navigation: sampleNavigation,
      })

      const updatedApp = await config.api.workspaceApp.find(workspaceApp._id)
      expect(updatedApp).toBeDefined()
      expect(updatedApp!.navigation).toEqual(sampleNavigation)
    })

    it("should return 400 for invalid workspace app id", async () => {
      await config.api.navigation.update(
        "invalid_id",
        { navigation: sampleNavigation },
        { status: 400 }
      )
    })

    it("should handle empty navigation links", async () => {
      const emptyNavigation: AppNavigation = { navigation: "Left", links: [] }

      await config.api.navigation.update(workspaceApp._id, {
        navigation: emptyNavigation,
      })

      const updatedApp = await config.api.workspaceApp.find(workspaceApp._id)
      expect(updatedApp).toBeDefined()
      expect(updatedApp!.navigation).toEqual(emptyNavigation)
    })
  })
})
