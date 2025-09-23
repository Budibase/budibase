import { structures } from "@budibase/backend-core/tests"
import { type Workspace } from "@budibase/types"
import nock from "nock"
import * as setup from "./utilities"
import sdk from "../../../sdk"
import { context } from "@budibase/backend-core"

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

  const getAppScrens = async (appId: string) => {
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
            name: "screen.name",
          })
        }
      )

      const originalScreens = await getAppScrens(originalApp._id)
      const { workspaceApp: duplicatedApp } = await api.workspaceApp.duplicate(
        originalApp._id
      )

      // check basics

      const dupeScreens = await getAppScrens(duplicatedApp._id)
      expect(duplicatedApp).toBeDefined()
      expect(duplicatedApp.name).not.toBe(originalApp.name)
      expect(duplicatedApp.navigation.title).toBe(originalApp.navigation.title)
      expect(dupeScreens.length).toBe(originalScreens.length)

      // ensure original isnt messed with
      const originalScreensAfterDupe = await getAppScrens(originalApp._id)
      expect(originalScreens.length).toBe(originalScreensAfterDupe.length)
    })
  })
})
