import { structures } from "@budibase/backend-core/tests"
import { AppFontFamily, Theme, type Workspace } from "@budibase/types"
import nock from "nock"
import * as setup from "./utilities"
import sdk from "../../../sdk"
import { context, events } from "@budibase/backend-core"

describe("/workspaceApp", () => {
  const testConfig = setup.getConfig()

  const { api } = testConfig
  let workspace: Workspace

  afterAll(() => {
    setup.afterAll()
  })

  beforeAll(async () => {
    await testConfig.init()
  })

  async function createNewWorkspace() {
    workspace = await testConfig.newTenant()
    await testConfig.publish()

    return workspace
  }

  beforeEach(async () => {
    workspace = await createNewWorkspace()
    jest.clearAllMocks()
    nock.cleanAll()
  })

  const getAppScreens = async (appId: string) => {
    const screens = await context.doInWorkspaceContext(
      testConfig.getDevWorkspaceId(),
      async () => {
        const screens = await sdk.screens.fetch()
        const appScreens = screens.filter(s => s.workspaceAppId === appId)
        return appScreens
      }
    )

    return screens
  }

  describe("/duplicate", () => {
    it("should duplicate the app", async () => {
      // there was a bug where the first app could have its screens copied
      // ensuring theres more than two apps in the workspace was part of fixing this bug
      // even though no direct assertions are being made against data created for this app.
      const { workspaceApp: firstApp } = await api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "First App",
          url: "/first",
        })
      )

      await context.doInWorkspaceContext(
        testConfig.getDevWorkspaceId(),
        async () => {
          await sdk.screens.create({
            layoutId: "screen.layoutId",
            showNavigation: true,
            width: "100",
            routing: { route: "first", roleId: "assistant_to_the_manager" },
            workspaceAppId: firstApp._id,
            props: {
              _instanceName: "Æthelstan",
              _styles: {},
              _component: "mc_guffin_9001",
            },
            name: "screen in first app",
          })
        }
      )

      const { workspaceApp: originalApp } = await api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "App to dupe",
          url: "/dupe",
        })
      )

      await context.doInWorkspaceContext(
        testConfig.getDevWorkspaceId(),
        async () => {
          await sdk.screens.create({
            layoutId: "screen.layoutId",
            showNavigation: true,
            width: "100",
            routing: { route: "66", roleId: "assistant_to_the_manager" },
            workspaceAppId: originalApp._id,
            props: {
              _instanceName: "Æthelstan",
              _styles: {},
              _component: "mc_guffin_9001",
            },
            name: "screen in second app",
          })
        }
      )

      const originalScreens = await getAppScreens(originalApp._id)
      const { workspaceApp: duplicatedApp } = await api.workspaceApp.duplicate(
        originalApp._id
      )

      // check basics
      const dupeScreens = await getAppScreens(duplicatedApp._id)
      expect(duplicatedApp).toBeDefined()
      expect(duplicatedApp.name).not.toBe(originalApp.name)
      expect(duplicatedApp.navigation.title).toBe(originalApp.navigation.title)
      expect(dupeScreens.length).toBe(originalScreens.length)

      const [screen] = dupeScreens
      expect(screen.routing.route).toBe("66")

      // ensure original isnt messed with
      const originalScreensAfterDupe = await getAppScreens(originalApp._id)
      expect(JSON.stringify(originalScreens)).toBe(
        JSON.stringify(originalScreensAfterDupe)
      )
    })

    it("copies explicit app theme settings", async () => {
      const { workspaceApp } = await api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Theme App",
          url: "/theme",
        })
      )
      const { workspaceApp: themedApp } = await api.workspaceApp.update({
        _id: workspaceApp._id,
        _rev: workspaceApp._rev,
        name: workspaceApp.name,
        url: workspaceApp.url,
        navigation: workspaceApp.navigation,
        disabled: workspaceApp.disabled,
        theme: Theme.NORD,
        customTheme: {
          fontFamily: AppFontFamily.SOURCE_SANS,
        },
      })

      const { workspaceApp: duplicatedApp } = await api.workspaceApp.duplicate(
        themedApp._id
      )

      expect(duplicatedApp.theme).toBe(Theme.NORD)
      expect(duplicatedApp.customTheme?.fontFamily).toBe(
        AppFontFamily.SOURCE_SANS
      )
    })
  })

  describe("/create", () => {
    it("rejects duplicate app names ignoring case and whitespace", async () => {
      await api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Customer Portal",
          url: "/customer-portal",
        })
      )

      await api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "  CUSTOMER PORTAL  ",
          url: "/customer-portal-2",
        }),
        {
          status: 400,
          body: {
            message: "App with name '  CUSTOMER PORTAL  ' is already taken.",
          },
        }
      )
    })

    it("emits workspace_app:created event", async () => {
      await api.workspaceApp.create(
        structures.workspaceApps.createRequest({ name: "My App", url: "/my" })
      )

      expect(events.workspace.appCreated).toHaveBeenCalledTimes(1)
    })

    it("creates apps with Inter font by default", async () => {
      const { workspaceApp } = await api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Theme App",
          url: "/theme",
        })
      )

      expect(workspaceApp.theme).toBeUndefined()
      expect(workspaceApp.customTheme?.fontFamily).toBe(AppFontFamily.INTER)
    })
  })

  describe("/update", () => {
    it("emits workspace_app:updated event", async () => {
      const { workspaceApp } = await api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "App to update",
          url: "/to-update",
        })
      )

      await api.workspaceApp.update({
        _id: workspaceApp._id,
        _rev: workspaceApp._rev,
        name: "App updated",
        url: workspaceApp.url,
        navigation: workspaceApp.navigation,
        disabled: workspaceApp.disabled,
      })

      expect(events.workspace.appUpdated).toHaveBeenCalledTimes(1)
    })

    it("updates theme settings", async () => {
      const { workspaceApp } = await api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "App to update",
          url: "/to-update",
        })
      )

      const { workspaceApp: updated } = await api.workspaceApp.update({
        _id: workspaceApp._id,
        _rev: workspaceApp._rev,
        name: workspaceApp.name,
        url: workspaceApp.url,
        navigation: workspaceApp.navigation,
        disabled: workspaceApp.disabled,
        theme: Theme.MIDNIGHT,
        customTheme: {
          fontFamily: AppFontFamily.SOURCE_SANS,
        },
      })

      expect(updated.theme).toBe(Theme.MIDNIGHT)
      expect(updated.customTheme?.fontFamily).toBe(AppFontFamily.SOURCE_SANS)
    })

    it("preserves theme settings when they are omitted", async () => {
      const { workspaceApp } = await api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "App to update",
          url: "/to-update",
        })
      )

      const { workspaceApp: themedApp } = await api.workspaceApp.update({
        _id: workspaceApp._id,
        _rev: workspaceApp._rev,
        name: workspaceApp.name,
        url: workspaceApp.url,
        navigation: workspaceApp.navigation,
        disabled: workspaceApp.disabled,
        theme: Theme.MIDNIGHT,
        customTheme: {
          fontFamily: AppFontFamily.SOURCE_SANS,
        },
      })

      const { workspaceApp: updated } = await api.workspaceApp.update({
        _id: themedApp._id,
        _rev: themedApp._rev,
        name: "Updated theme app",
        url: themedApp.url,
        navigation: themedApp.navigation,
        disabled: themedApp.disabled,
      })

      expect(updated.theme).toBe(Theme.MIDNIGHT)
      expect(updated.customTheme?.fontFamily).toBe(AppFontFamily.SOURCE_SANS)
    })

    it("rejects invalid theme settings", async () => {
      const { workspaceApp } = await api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "App to update",
          url: "/to-update",
        })
      )

      await api.workspaceApp.update(
        {
          _id: workspaceApp._id,
          _rev: workspaceApp._rev,
          name: workspaceApp.name,
          url: workspaceApp.url,
          navigation: workspaceApp.navigation,
          disabled: workspaceApp.disabled,
          theme: "unknown" as Theme,
        },
        { status: 400 }
      )
    })

    it("rejects invalid font settings", async () => {
      const { workspaceApp } = await api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "App to update",
          url: "/to-update",
        })
      )

      await api.workspaceApp.update(
        {
          _id: workspaceApp._id,
          _rev: workspaceApp._rev,
          name: workspaceApp.name,
          url: workspaceApp.url,
          navigation: workspaceApp.navigation,
          disabled: workspaceApp.disabled,
          customTheme: {
            fontFamily: "unknown" as AppFontFamily,
          },
        },
        { status: 400 }
      )
    })
  })
})
