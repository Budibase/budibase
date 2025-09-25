import { generator } from "@budibase/backend-core/tests"
import { Header } from "@budibase/shared-core"
import {
  InsertWorkspaceAppRequest,
  ResourceType,
  Screen,
  Table,
  WorkspaceApp,
} from "@budibase/types"
import _ from "lodash"
import tk from "timekeeper"
import { createAutomationBuilder } from "../../../automations/tests/utilities/AutomationTestBuilder"
import {
  basicQuery,
  basicScreen,
  basicTable,
} from "../../../tests/utilities/structures"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

describe("/api/resources/usage", () => {
  const config = new TestConfiguration()
  let table: Table

  beforeAll(async () => {
    await config.init()
    table = await config.api.table.save(basicTable())
  })

  afterAll(config.end)

  beforeEach(() => {
    tk.reset()
  })

  describe("resource usage analysis", () => {
    it("should check screens for datasource usage", async () => {
      const screen = basicScreen()
      screen.props._children?.push({
        _id: "child-props",
        _instanceName: "child",
        _styles: {},
        _component: "@budibase/standard-components/dataprovider",
        datasource: {
          tableId: table._id,
          type: "table",
        },
      })

      // Save the screen to the database so it can be found
      await config.api.screen.save(screen)

      const result = await config.api.resource.searchForUsage({
        workspaceAppIds: [screen.workspaceAppId!],
      })

      expect(result.body.resources).toContainEqual(
        expect.objectContaining({
          id: table._id,
          name: table.name,
          type: ResourceType.TABLE,
        })
      )
    })

    it("should check automations for datasource usage", async () => {
      // Create an automation using the builder
      const { automation } = await createAutomationBuilder(config)
        .onRowSaved({ tableId: table._id! })
        .save()

      const result = await config.api.resource.searchForUsage({
        automationIds: [automation._id!],
      })

      expect(result.body.resources).toContainEqual(
        expect.objectContaining({
          id: table._id,
          name: table.name,
          type: ResourceType.TABLE,
        })
      )
    })

    it("should handle empty inputs", async () => {
      await config.api.resource.searchForUsage(
        {
          workspaceAppIds: [],
          automationIds: [],
        },
        {
          status: 400,
        }
      )
    })
  })

  describe("duplicateResourceToWorkspace", () => {
    interface WorkspaceAppInfo {
      app: WorkspaceApp
      screens: Screen[]
    }

    let basicApp: WorkspaceAppInfo
    let appWithTableUsages: WorkspaceAppInfo
    let internalTables: Table[] = []

    async function createInternalTable(data: Partial<Table> = {}) {
      const table = await config.api.table.save(basicTable(undefined, data))
      internalTables.push(await config.api.table.get(table._id!))
    }

    async function createApp(
      app: InsertWorkspaceAppRequest,
      screens: Screen[]
    ): Promise<WorkspaceAppInfo> {
      const { workspaceApp: createdApp } =
        await config.api.workspaceApp.create(app)
      const createdScreens: Screen[] = []
      for (const screen of screens) {
        screen.workspaceAppId = createdApp._id!
        createdScreens.push(
          await config.api.screen.save({
            ...screen,
            workspaceAppId: createdApp._id,
          })
        )
      }

      return {
        app: createdApp,
        screens: createdScreens,
      }
    }

    beforeAll(async () => {
      await config.createWorkspace()

      await createInternalTable({ name: "Internal table 1" })
      await createInternalTable({ name: "Internal table 2" })
      await createInternalTable({ name: "Internal table 3" })

      const datasource1 = await config.createDatasource()
      await config.api.query.save(basicQuery(datasource1._id))
      await config.api.query.save(basicQuery(datasource1._id))

      const datasource2 = await config.createDatasource()
      await config.api.query.save(basicQuery(datasource2._id))

      basicApp = await createApp(
        {
          name: "My first app",
          url: "/my-first-app",
        },
        [basicScreen()]
      )

      const screenWithDataProvider = basicScreen()
      screenWithDataProvider.props._children?.push({
        _id: "child-props",
        _instanceName: "child",
        _styles: {},
        _component: "@budibase/standard-components/dataprovider",
        datasource: {
          tableId: internalTables[0]._id,
          type: "table",
        },
      })
      appWithTableUsages = await createApp(
        {
          name: "App with tables",
          url: "/app-with-tables",
        },
        [screenWithDataProvider]
      )
    })

    async function validateApp(
      appId: string,
      expectedApp: WorkspaceApp,
      expected: { screens?: Screen[]; tables?: Table[] }
    ) {
      await config.withHeaders({ [Header.APP_ID]: appId }, async () => {
        const { workspaceApps: resultingWorkspaceApps } =
          await config.api.workspaceApp.fetch()
        expect(resultingWorkspaceApps).toContainEqual(
          expect.objectContaining({
            ...expectedApp,
            _rev: expect.stringMatching(/^1-\w+/),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        )

        const screens = await config.api.screen.list()
        expect(screens).toEqual(
          (expected.screens || []).map(s => ({
            ...s,
            pluginAdded: undefined,
            _rev: expect.stringMatching(/^1-\w+/),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }))
        )

        const tables = await config.api.table.fetch()
        expect(tables.sort((a, b) => a._id!.localeCompare(b._id!))).toEqual(
          [
            expect.objectContaining({
              _id: "ta_users",
            }),
            ...(expected.tables || []).map(t => ({
              ...t,
              _rev: expect.stringMatching(/^1-\w+/),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })),
          ].sort((a, b) => a._id!.localeCompare(b._id!))
        )
      })
    }

    it("copies the resource and dependencies into the destination workspace for basic apps", async () => {
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      tk.freeze(new Date())
      const response = await config.api.resource.duplicateResourceToWorkspace({
        resourceId: basicApp.app._id!,
        toWorkspace: newWorkspace.appId,
      })

      expect(response.body).toEqual({
        resources: {
          workspace_app: [basicApp.app._id],
        },
      })

      await validateApp(newWorkspace.appId, basicApp.app, {
        screens: basicApp.screens.map(s => ({
          ...s,
          pluginAdded: undefined,
          _rev: expect.stringMatching(/^1-\w+/),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
      })
    })

    it("copies the resource and dependencies into the destination workspace for apps with table usages", async () => {
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      tk.freeze(new Date())
      const response = await config.api.resource.duplicateResourceToWorkspace({
        resourceId: appWithTableUsages.app._id!,
        toWorkspace: newWorkspace.appId,
      })

      expect(response.body).toEqual({
        resources: {
          workspace_app: [appWithTableUsages.app._id],

          table: [internalTables[0]._id],
        },
      })

      await validateApp(newWorkspace.appId, appWithTableUsages.app, {
        screens: appWithTableUsages.screens.map(s => ({
          ...s,
          pluginAdded: undefined,
          _rev: expect.stringMatching(/^1-\w+/),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
        tables: [internalTables[0]],
      })
    })

    it("rejects non workspace app document types", async () => {
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      const response = await config.api.resource.duplicateResourceToWorkspace(
        {
          resourceId: _.sample(internalTables)?._id!,
          toWorkspace: newWorkspace.appId,
        },
        {
          status: 400,
        }
      )
      expect(response.body).toEqual({
        message: '"ta" cannot be duplicated',
        status: 400,
        stack: expect.anything(),
      })
    })

    it("throws when destination workspace already exists", async () => {
      const response = await config.api.resource.duplicateResourceToWorkspace(
        {
          resourceId: basicApp.app._id!,
          toWorkspace: "app_unexisting",
        },
        {
          status: 400,
        }
      )
      expect(response.body).toEqual({
        message: "Destination workspace does not exist",
        error: {
          code: "http",
        },
        status: 400,
        stack: expect.anything(),
      })
    })
  })
})
