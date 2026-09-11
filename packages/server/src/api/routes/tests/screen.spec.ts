import { events, roles, tenancy } from "@budibase/backend-core"
import { structures } from "@budibase/backend-core/tests"
import {
  BuiltinPermissionID,
  Plugin,
  PluginSource,
  PluginType,
  Role,
  Screen,
  SourceType,
  UsageInScreensResponse,
} from "@budibase/types"
import sdk from "../../../sdk"
import { basicDatasourcePlus } from "../../../tests/utilities/structures"
import * as setup from "./utilities"
import { checkBuilderEndpoint } from "./utilities/TestFunctions"

const {
  basicScreen,
  createTableScreen,
  createViewScreen,
  createQueryScreen,
  basicTable,
  viewV2,
  basicQuery,
} = setup.structures

describe("/screens", () => {
  let screen: Screen
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await config.newTenant()
    screen = await config.createScreen()
  })

  function popRandomScreen(screens: Screen[]) {
    const index = Math.floor(Math.random() * screens.length)
    return screens.splice(index, 1)[0]
  }

  describe("fetch", () => {
    it("should be able to create a screen", async () => {
      const screens = await config.api.screen.list()
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

  describe("permissions", () => {
    let screen1: Screen, screen2: Screen
    let role1: Role, role2: Role, multiRole: Role

    beforeEach(async () => {
      role1 = await config.api.roles.save({
        name: "role1",
        inherits: roles.BUILTIN_ROLE_IDS.BASIC,
        permissionId: BuiltinPermissionID.WRITE,
      })
      role2 = await config.api.roles.save({
        name: "role2",
        inherits: roles.BUILTIN_ROLE_IDS.BASIC,
        permissionId: BuiltinPermissionID.WRITE,
      })
      multiRole = await config.api.roles.save({
        name: "multiRole",
        inherits: [role1._id!, role2._id!],
        permissionId: BuiltinPermissionID.WRITE,
      })
      screen1 = await config.api.screen.save({
        ...basicScreen(),
        routing: {
          roleId: role1._id!,
          route: "/foo",
          homeScreen: false,
        },
      })
      screen2 = await config.api.screen.save({
        ...basicScreen(),
        routing: {
          roleId: role2._id!,
          route: "/bar",
          homeScreen: false,
        },
      })
      // get into prod app
      await config.publish()
    })

    async function checkScreens(roleId: string, screenIds: string[]) {
      await config.loginAsRole(roleId, async () => {
        const res = await config.withProdApp(() =>
          config.api.workspace.getDefinition(config.getProdWorkspaceId())
        )
        const screens = res.screens

        expect(screens.length).toEqual(screenIds.length)
        expect(screens.map(s => s._id).sort()).toEqual(screenIds.sort())
      })
    }

    it("should be able to fetch basic and screen1 with role1", async () => {
      await checkScreens(role1._id!, [screen._id!, screen1._id!])
    })

    it("should be able to fetch basic and screen2 with role2", async () => {
      await checkScreens(role2._id!, [screen._id!, screen2._id!])
    })

    it("should be able to fetch basic, screen1 and screen2 with multi-inheritance role", async () => {
      await checkScreens(multiRole._id!, [
        screen._id!,
        screen1._id!,
        screen2._id!,
      ])
    })

    it("should be able to fetch basic and screen 1 with role1 in role header", async () => {
      await config.withHeaders(
        {
          "x-budibase-role": role1._id!,
        },
        async () => {
          const res = await config.api.workspace.getDefinition(
            config.getDevWorkspaceId()
          )
          const screens = res.screens

          const screenIds = [screen._id!, screen1._id!]
          expect(screens.length).toEqual(screenIds.length)
          expect(screens.map(s => s._id).sort()).toEqual(screenIds.sort())
        }
      )
    })
  })

  describe("save", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should be able to create a screen", async () => {
      const screen = basicScreen()
      const responseScreen = await config.api.screen.save(screen)

      expect(responseScreen._rev).toBeDefined()
      expect(responseScreen.name).toEqual(screen.name)
      expect(events.screen.created).toHaveBeenCalledTimes(1)
    })

    it("should be able to update a screen", async () => {
      const screen = basicScreen()
      let responseScreen = await config.api.screen.save(screen)
      screen._id = responseScreen._id
      screen._rev = responseScreen._rev
      screen.name = "edit"
      jest.clearAllMocks()

      responseScreen = await config.api.screen.save(screen)

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
    beforeEach(async () => {
      await config.newTenant()
    })

    it("should be able to delete the screen", async () => {
      const [{ _id: workspaceAppId }] = (await config.api.workspaceApp.fetch())
        .workspaceApps

      const screen = await config.api.screen.save({
        ...basicScreen(),
        workspaceAppId,
      })

      const response = await config.api.screen.destroy(
        screen._id!,
        screen._rev!
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

    it("should allow deleting screens across all apps", async () => {
      const { workspaceApp: workspaceApp1 } =
        await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest()
        )
      const { workspaceApp: workspaceApp2 } =
        await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest()
        )
      const app1Screens = await Promise.all(
        Array.from({ length: 3 }).map(() =>
          config.api.screen.save({
            ...basicScreen(),
            workspaceAppId: workspaceApp1._id,
          })
        )
      )
      // Other screens
      await Promise.all(
        Array.from({ length: 2 }).map(() =>
          config.api.screen.save({
            ...basicScreen(),
            workspaceAppId: workspaceApp2._id,
          })
        )
      )

      let screenToDelete = popRandomScreen(app1Screens)
      await config.api.screen.destroy(screenToDelete._id!, screenToDelete._rev!)
      screenToDelete = popRandomScreen(app1Screens)
      await config.api.screen.destroy(screenToDelete._id!, screenToDelete._rev!)
      screenToDelete = popRandomScreen(app1Screens)
      await config.api.screen.destroy(screenToDelete._id!, screenToDelete._rev!)
      expect(await config.api.screen.list()).toHaveLength(2)
    })
  })

  describe("usage", () => {
    beforeEach(async () => {
      await config.api.screen.save(basicScreen())
    })

    function confirmScreen(usage: UsageInScreensResponse, screen: Screen) {
      expect(usage.screens.length).toEqual(1)
      expect(usage.screens[0].url).toEqual(screen.routing.route)
      expect(usage.screens[0]._id).toEqual(screen._id!)
    }

    it("should find table usage", async () => {
      const table = await config.api.table.save(basicTable())
      const screen = await config.api.screen.save(
        createTableScreen("BudibaseDB", table)
      )
      const usage = await config.api.screen.usage(table._id!)
      expect(usage.sourceType).toEqual(SourceType.TABLE)
      confirmScreen(usage, screen)
    })

    it("should find view usage", async () => {
      const table = await config.api.table.save(basicTable())
      const view = await config.api.viewV2.create(
        viewV2.createRequest(table._id!),
        { status: 201 }
      )
      const screen = await config.api.screen.save(createViewScreen(view))
      const usage = await config.api.screen.usage(view.id)
      expect(usage.sourceType).toEqual(SourceType.VIEW)
      confirmScreen(usage, screen)
    })

    it("should find datasource/query usage", async () => {
      const datasource = await config.api.datasource.create(
        basicDatasourcePlus().datasource
      )
      const query = await config.api.query.save(basicQuery(datasource._id!))
      const screen = await config.api.screen.save(
        createQueryScreen(datasource._id!, query)
      )
      const dsUsage = await config.api.screen.usage(datasource._id!)
      expect(dsUsage.sourceType).toEqual(SourceType.DATASOURCE)
      confirmScreen(dsUsage, screen)
      const queryUsage = await config.api.screen.usage(query._id!)
      expect(queryUsage.sourceType).toEqual(SourceType.QUERY)
      confirmScreen(queryUsage, screen)
    })

    it("should find query usage in on load actions", async () => {
      const datasource = await config.api.datasource.create(
        basicDatasourcePlus().datasource
      )
      const query = await config.api.query.save(basicQuery(datasource._id!))
      const screen = await config.api.screen.save({
        ...basicScreen("/on-load-query"),
        onLoad: [
          {
            "##eventHandlerType": "Execute Query",
            id: "execute-query-on-load",
            parameters: {
              key: "queryId",
              type: "query",
              value: query._id!,
              persist: null,
            },
          },
        ],
      })

      const usage = await config.api.screen.usage(query._id!)
      expect(usage.sourceType).toEqual(SourceType.QUERY)
      confirmScreen(usage, screen)
    })
  })

  describe("used plugins management", () => {
    const pluginDoc: Plugin = {
      _id: "plg_custom-component",
      name: "custom-component",
      version: "1.0.0",
      description: "",
      source: PluginSource.FILE,
      package: {},
      hash: "123",
      schema: {
        type: PluginType.COMPONENT,
        metadata: {
          svelteMajor: 5,
        },
      },
    }

    const createPluginScreen = (route = "/plugin-screen") => {
      const screen = basicScreen(route)
      screen.props._children = [
        {
          _id: "comp-1",
          _component: "plugin/custom-component",
          _instanceName: "CustomComponent",
          _styles: { normal: {}, custom: {}, selected: {} },
          _children: [],
        },
      ]
      return screen
    }

    beforeEach(async () => {
      await config.doInTenant(async () => {
        const globalDB = tenancy.getGlobalDB()
        try {
          await globalDB.put(pluginDoc)
        } catch (e) {
          // Ignore if exists
        }
      })
    })

    it("should add used plugin when screen contains a plugin component", async () => {
      await config.api.screen.save(createPluginScreen("/plugin-screen"))

      await config.doInContext(config.devWorkspaceId!, async () => {
        const app = await sdk.workspaces.metadata.get()
        expect(app.usedPlugins?.length).toEqual(1)
        expect(app.usedPlugins?.[0].name).toEqual("custom-component")
      })
    })

    it("should prune unused plugin when plugin component is removed from screen", async () => {
      const screen = await config.api.screen.save(
        createPluginScreen("/plugin-screen")
      )

      await config.doInContext(config.devWorkspaceId!, async () => {
        const app = await sdk.workspaces.metadata.get()
        expect(app.usedPlugins?.length).toEqual(1)
      })

      screen.props._children = []
      await config.api.screen.save(screen)

      await config.doInContext(config.devWorkspaceId!, async () => {
        const app = await sdk.workspaces.metadata.get()
        expect(app.usedPlugins?.length).toEqual(0)
      })
    })

    it("should prune unused plugin when screen containing it is deleted", async () => {
      const screen = await config.api.screen.save(
        createPluginScreen("/plugin-screen")
      )

      await config.doInContext(config.devWorkspaceId!, async () => {
        const app = await sdk.workspaces.metadata.get()
        expect(app.usedPlugins?.length).toEqual(1)
      })

      await config.api.screen.destroy(screen._id!, screen._rev!)

      await config.doInContext(config.devWorkspaceId!, async () => {
        const app = await sdk.workspaces.metadata.get()
        expect(app.usedPlugins?.length).toEqual(0)
      })
    })

    it("should retain plugin if at least one screen is still using it", async () => {
      const screen1 = await config.api.screen.save(
        createPluginScreen("/plugin-screen-1")
      )
      const screen2 = await config.api.screen.save(
        basicScreen("/plugin-screen-2")
      )

      await config.doInContext(config.devWorkspaceId!, async () => {
        const app = await sdk.workspaces.metadata.get()
        expect(app.usedPlugins?.length).toEqual(1)
      })

      await config.api.screen.destroy(screen2._id!, screen2._rev!)

      await config.doInContext(config.devWorkspaceId!, async () => {
        const app = await sdk.workspaces.metadata.get()
        expect(app.usedPlugins?.length).toEqual(1)
      })

      await config.api.screen.destroy(screen1._id!, screen1._rev!)

      await config.doInContext(config.devWorkspaceId!, async () => {
        const app = await sdk.workspaces.metadata.get()
        expect(app.usedPlugins?.length).toEqual(0)
      })
    })

    it("should filter out deleted plugins in enrichUsedPluginSvelteMajors", async () => {
      await config.doInTenant(async () => {
        const enriched = await sdk.plugins.enrichUsedPluginSvelteMajors([
          pluginDoc,
          {
            _id: "plg_nonexistent",
            name: "nonexistent",
            version: "1.0.0",
            description: "",
            source: PluginSource.FILE,
            package: {},
            hash: "456",
            schema: {
              type: PluginType.COMPONENT,
            },
          },
        ])

        expect(enriched.length).toEqual(1)
        expect(enriched[0]._id).toEqual("plg_custom-component")
      })
    })
  })
})
