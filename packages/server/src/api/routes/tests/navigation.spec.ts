import * as setup from "./utilities"
import { basicScreen } from "../../../tests/utilities/structures"
import { MAX_NAV_DEPTH } from "@budibase/shared-core"
import {
  AppNavigation,
  AppNavigationLink,
  WithRequired,
  WorkspaceApp,
} from "@budibase/types"

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

  describe("nesting depth", () => {
    const nest = (depth: number): AppNavigation => {
      let link: AppNavigationLink = {
        text: `L${depth}`,
        url: `/l${depth}`,
        type: "link",
      }
      for (let level = depth - 1; level >= 1; level--) {
        link = {
          text: `L${level}`,
          url: "",
          type: "sublinks",
          subLinks: [link],
        }
      }
      return { navigation: "Top", links: [link] }
    }

    it("accepts a tree at the maximum depth", async () => {
      await config.api.navigation.update(workspaceApp._id, {
        navigation: nest(MAX_NAV_DEPTH),
      })

      const updated = await config.api.workspaceApp.find(workspaceApp._id)
      expect(updated!.navigation).toEqual(nest(MAX_NAV_DEPTH))
    })

    it("rejects a tree deeper than the maximum", async () => {
      await config.api.navigation.update(
        workspaceApp._id,
        { navigation: nest(MAX_NAV_DEPTH + 1) },
        { status: 400 }
      )
    })

    // The workspace app route is a second write path for navigation; it must be
    // guarded too, otherwise over-deep trees get stored and silently dropped by
    // the renderer.
    it("rejects a too deep tree via the workspace app route as well", async () => {
      const app = (await config.api.workspaceApp.find(workspaceApp._id))!
      await config.api.workspaceApp.update(
        {
          _id: app._id!,
          _rev: app._rev!,
          name: app.name,
          url: app.url,
          navigation: nest(MAX_NAV_DEPTH + 1),
        },
        { status: 400 }
      )
    })
  })

  describe("screen deletion nav pruning", () => {
    it("removes links at every depth and keeps groups whose header URL matches", async () => {
      const screen = await config.api.screen.save({
        ...basicScreen("/reports"),
        workspaceAppId: workspaceApp._id,
      })

      const navigation: AppNavigation = {
        navigation: "Top",
        links: [
          { url: "/home", text: "Home", type: "link" },
          {
            // Group header links to the deleted screen: it must lose only its
            // URL, never its children.
            url: "/reports",
            text: "Reports",
            type: "sublinks",
            subLinks: [
              { url: "/reports", text: "Overview", type: "link" },
              { url: "/other", text: "Other", type: "link" },
              {
                url: "",
                text: "Archive",
                type: "sublinks",
                subLinks: [
                  // Depth 2 link to the deleted screen must be pruned too
                  { url: "/reports", text: "Deep", type: "link" },
                ],
              },
            ],
          },
        ],
      }
      await config.api.navigation.update(workspaceApp._id, { navigation })

      await config.api.screen.destroy(screen._id!, screen._rev!)

      const updatedApp = await config.api.workspaceApp.find(workspaceApp._id)
      expect(updatedApp!.navigation.links).toEqual([
        { url: "/home", text: "Home", type: "link" },
        {
          url: "",
          text: "Reports",
          type: "sublinks",
          subLinks: [
            { url: "/other", text: "Other", type: "link" },
            { url: "", text: "Archive", type: "sublinks", subLinks: [] },
          ],
        },
      ])
    })
  })
})
