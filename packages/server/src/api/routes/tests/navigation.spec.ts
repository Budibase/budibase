import { structures } from "@budibase/backend-core/tests"
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

    it("should update both workspace app and default app navigation for default workspaceApps", async () => {
      await config.api.navigation.update(workspaceApp._id, {
        navigation: sampleNavigation,
      })

      const appMetadata = await config.api.application.get(config.getAppId())
      expect(appMetadata.navigation).toEqual(sampleNavigation)
    })

    it("should return 400 for invalid workspace app id", async () => {
      await config.api.navigation.update(
        "invalid_id",
        { navigation: sampleNavigation },
        { status: 400 }
      )
    })

    it("should not update app navigation app navigation when updating not default workspaces", async () => {
      const { workspaceApp: otherWorkspaceApp } =
        await config.api.workspaceApp.create({
          ...structures.workspaceApps.createRequest(),
        })
      expect(otherWorkspaceApp.isDefault).toBe(false)

      await config.api.navigation.update(otherWorkspaceApp._id, {
        navigation: sampleNavigation,
      })

      const updatedWorkspaceApp = await config.api.workspaceApp.find(
        otherWorkspaceApp._id
      )
      expect(updatedWorkspaceApp.navigation).toEqual(sampleNavigation)

      const appMetadata = await config.api.application.get(config.getAppId())
      expect(appMetadata.navigation).not.toEqual(sampleNavigation)
    })

    it("should handle empty navigation links", async () => {
      const emptyNavigation: AppNavigation = { navigation: "Left", links: [] }

      await config.api.navigation.update(workspaceApp._id, {
        navigation: emptyNavigation,
      })

      const updatedApp = await config.api.workspaceApp.find(workspaceApp._id)
      expect(updatedApp).toBeDefined()
      expect(updatedApp!.navigation).toEqual(emptyNavigation)

      const appMetadata = await config.api.application.get(config.getAppId())
      expect(appMetadata.navigation).toEqual(emptyNavigation)
    })
  })
})
