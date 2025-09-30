import { generator } from "@budibase/backend-core/tests"
import { Header } from "@budibase/shared-core"
import {
  AnyDocument,
  Automation,
  Datasource,
  InsertWorkspaceAppRequest,
  Query,
  ResourceType,
  RowActionResponse,
  Screen,
  Table,
  WorkspaceApp,
} from "@budibase/types"
import _ from "lodash"
import tk from "timekeeper"
import { createAutomationBuilder } from "../../../automations/tests/utilities/AutomationTestBuilder"
import { generateRowActionsID } from "../../../db/utils"
import {
  basicQuery,
  basicScreen,
  basicTable,
  createQueryScreen,
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
    it("should detect datasource usage via query screens", async () => {
      const datasource = await config.createDatasource()
      const query = await config.api.query.save(basicQuery(datasource._id))
      const screen = createQueryScreen(datasource._id, query)
      const { workspaceApp } = await config.api.workspaceApp.create({
        name: "Datasource usage app",
        url: "/datasource-usage-app",
      })
      screen.workspaceAppId = workspaceApp._id

      await config.api.screen.save(screen)

      const result = await config.api.resource.searchForUsage({
        workspaceAppIds: [workspaceApp._id!],
      })

      expect(result.body.resources).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: datasource._id,
            name: datasource.name,
            type: ResourceType.DATASOURCE,
          }),
        ])
      )
    })

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

    it("should include row actions and their automations when referenced by an automation", async () => {
      const rowAction = await config.api.rowAction.save(table._id!, {
        name: "Row action usage",
      })

      const result = await config.api.resource.searchForUsage({
        automationIds: [rowAction.automationId],
      })

      expect(result.body.resources).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: generateRowActionsID(table._id!),
            name: rowAction.name,
            type: ResourceType.ROW_ACTION,
          }),
          expect.objectContaining({
            id: rowAction.automationId,
            name: rowAction.name,
            type: ResourceType.AUTOMATION,
          }),
        ])
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

  describe("duplication", () => {
    interface WorkspaceAppInfo {
      app: WorkspaceApp
      screens: Screen[]
    }

    let basicApp: WorkspaceAppInfo
    let appWithTableUsages: WorkspaceAppInfo
    let appWithTableUsagesCopy: WorkspaceAppInfo
    let appSharingTableDependency: WorkspaceAppInfo
    let appWithRepeatedDependencyUsage: WorkspaceAppInfo
    let appWithDatasourceDependency: WorkspaceAppInfo
    let appWithRowActionDependency: WorkspaceAppInfo
    let datasourceWithDependency: Datasource
    let queryForDatasource: Query
    let internalTables: Table[] = []
    let tableWithRowAction: Table
    let rowActionAutomation: Automation
    let rowActionDocId: string
    let rowActionExpectations: RowActionResponse[] = []

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

      datasourceWithDependency = await config.createDatasource()
      queryForDatasource = await config.api.query.save(
        basicQuery(datasourceWithDependency._id!)
      )

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
      appWithTableUsagesCopy = await createApp(
        {
          name: "App with tables copy",
          url: "/app-with-tables-copy",
        },
        [screenWithDataProvider]
      )

      const secondScreenWithDataProvider = basicScreen()
      secondScreenWithDataProvider.props._children?.push({
        _id: "child-props",
        _instanceName: "child",
        _styles: {},
        _component: "@budibase/standard-components/dataprovider",
        datasource: {
          tableId: internalTables[0]._id,
          type: "table",
        },
      })

      appSharingTableDependency = await createApp(
        {
          name: "App sharing table",
          url: "/app-sharing-table",
        },
        [secondScreenWithDataProvider]
      )

      const screenWithDatasourceDependency = createQueryScreen(
        datasourceWithDependency._id!,
        queryForDatasource
      )
      appWithDatasourceDependency = await createApp(
        {
          name: "App with datasource",
          url: "/app-with-datasource",
        },
        [screenWithDatasourceDependency]
      )

      const screenWithRepeatedDependency = basicScreen()
      screenWithRepeatedDependency.props._children?.push(
        {
          _id: "child-props-one",
          _instanceName: "child",
          _styles: {},
          _component: "@budibase/standard-components/dataprovider",
          datasource: {
            tableId: internalTables[1]._id,
            type: "table",
          },
        },
        {
          _id: "child-props-two",
          _instanceName: "child",
          _styles: {},
          _component: "@budibase/standard-components/dataprovider",
          datasource: {
            tableId: internalTables[1]._id,
            type: "table",
          },
        }
      )

      const secondScreenWithRepeatedDependency = basicScreen()
      secondScreenWithRepeatedDependency.props._children?.push({
        _id: "child-props-three",
        _instanceName: "child",
        _styles: {},
        _component: "@budibase/standard-components/dataprovider",
        datasource: {
          tableId: internalTables[1]._id,
          type: "table",
        },
      })

      appWithRepeatedDependencyUsage = await createApp(
        {
          name: "App with repeated dependency",
          url: "/app-repeated-dependency",
        },
        [screenWithRepeatedDependency, secondScreenWithRepeatedDependency]
      )

      tableWithRowAction = await config.api.table.save(
        basicTable(undefined, { name: "Row action table" })
      )

      const rowAction = await config.api.rowAction.save(
        tableWithRowAction._id!,
        {
          name: "Row action button",
        }
      )
      rowActionDocId = generateRowActionsID(tableWithRowAction._id!)
      rowActionAutomation = await config.api.automation.get(
        rowAction.automationId
      )
      const rowActionList = await config.api.rowAction.find(
        tableWithRowAction._id!
      )
      rowActionExpectations = Object.values(rowActionList.actions)

      const screenWithRowAction = basicScreen()
      screenWithRowAction.props._children?.push({
        _id: "row-action-button",
        _instanceName: "Row Action Button",
        _component: "@budibase/standard-components/button",
        _styles: {
          normal: {},
          hover: {},
          active: {},
          selected: {},
        },
        text: rowAction.name,
        type: "primary",
        quiet: true,
        onClick: [
          {
            id: "row-action-handler",
            "##eventHandlerType": "Row Action",
            parameters: {
              rowActionId: rowAction.id,
              resourceId: tableWithRowAction._id!,
              rowId: "{{ [row-action-source].[_id] }}",
            },
          },
        ],
      })

      appWithRowActionDependency = await createApp(
        {
          name: "App with row action",
          url: "/app-row-action",
        },
        [screenWithRowAction]
      )
    })

    describe("duplicateResourceToWorkspace", () => {
      async function validateWorkspace(
        appId: string,
        expectedApp: WorkspaceApp,
        expected: {
          screens?: Screen[]
          tables?: Table[]
          datasource?: Datasource[]
          queries?: Query[]
          automations?: Automation[]
          rowActions?: { tableId: string; actions: RowActionResponse[] }[]
        }
      ) {
        const sortById = (a: AnyDocument, b: AnyDocument) =>
          a._id!.localeCompare(b._id!)

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
          expect(screens.sort(sortById)).toEqual(
            (expected.screens || []).sort(sortById).map(s => ({
              ...s,
              pluginAdded: undefined,
              _rev: expect.stringMatching(/^1-\w+/),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }))
          )

          const tables = await config.api.table.fetch()
          expect(tables.sort(sortById)).toEqual(
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
            ].sort(sortById)
          )

          const datasources = await config.api.datasource.fetch()
          expect(datasources).toEqual([
            expect.objectContaining({ _id: "bb_internal" }),
            ...(expected.datasource || []).map(d => ({
              ...d,
              _rev: expect.stringMatching(/^1-\w+/),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })),
          ])

          const queries = await config.api.query.fetch()
          expect(queries).toEqual(
            (expected.queries || []).map(q => ({
              ...q,
              _rev: expect.stringMatching(/^1-\w+/),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }))
          )

          const { automations } = await config.api.automation.fetch()
          expect(automations).toEqual(
            (expected.automations || []).map(a => ({
              ...a,
              _rev: expect.stringMatching(/^1-\w+/),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }))
          )

          for (const rowActionExpectation of expected.rowActions || []) {
            const rowActionsResponse = await config.api.rowAction.find(
              rowActionExpectation.tableId
            )
            const actual = Object.values(rowActionsResponse.actions).sort(
              (a, b) => a.id.localeCompare(b.id)
            )
            const expectedRowActions = [...rowActionExpectation.actions].sort(
              (a, b) => a.id.localeCompare(b.id)
            )
            expect(actual).toEqual(expectedRowActions)
          }
        })
      }

      it("copies the resource and dependencies into the destination workspace for basic apps", async () => {
        const newWorkspace = await config.api.workspace.create({
          name: `Destination ${generator.natural()}`,
        })

        tk.freeze(new Date())
        const response = await config.api.resource.duplicateResourceToWorkspace(
          {
            resourceId: basicApp.app._id!,
            toWorkspace: newWorkspace.appId,
          }
        )

        expect(response.body).toEqual({
          resources: {
            workspace_app: [basicApp.app._id],
          },
        })

        await validateWorkspace(newWorkspace.appId, basicApp.app, {
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
        const response = await config.api.resource.duplicateResourceToWorkspace(
          {
            resourceId: appWithTableUsages.app._id!,
            toWorkspace: newWorkspace.appId,
          }
        )

        expect(response.body).toEqual({
          resources: {
            workspace_app: [appWithTableUsages.app._id],

            table: [internalTables[0]._id],
          },
        })

        await validateWorkspace(newWorkspace.appId, appWithTableUsages.app, {
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

      it("does not duplicate shared dependencies when copying multiple apps", async () => {
        const newWorkspace = await config.api.workspace.create({
          name: `Destination ${generator.natural()}`,
        })

        tk.freeze(new Date())
        const firstDuplication =
          await config.api.resource.duplicateResourceToWorkspace({
            resourceId: appWithTableUsages.app._id!,
            toWorkspace: newWorkspace.appId,
          })

        expect(firstDuplication.body).toEqual({
          resources: {
            workspace_app: [appWithTableUsages.app._id],
            table: [internalTables[0]._id],
          },
        })

        await validateWorkspace(newWorkspace.appId, appWithTableUsages.app, {
          screens: appWithTableUsages.screens.map(s => ({
            ...s,
            pluginAdded: undefined,
            _rev: expect.stringMatching(/^1-\w+/),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })),
          tables: [internalTables[0]],
        })

        const secondDuplication =
          await config.api.resource.duplicateResourceToWorkspace({
            resourceId: appSharingTableDependency.app._id!,
            toWorkspace: newWorkspace.appId,
          })

        expect(secondDuplication.body).toEqual({
          resources: {
            workspace_app: [appSharingTableDependency.app._id],
            table: [internalTables[0]._id],
          },
        })

        await validateWorkspace(
          newWorkspace.appId,
          appSharingTableDependency.app,
          {
            screens: [
              ...appWithTableUsages.screens,
              ...appSharingTableDependency.screens,
            ].map(s => ({
              ...s,
              pluginAdded: undefined,
              _rev: expect.stringMatching(/^1-\w+/),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })),
            tables: [internalTables[0]],
          }
        )
      })

      it("duplicates apps that reference the same dependency multiple times", async () => {
        const newWorkspace = await config.api.workspace.create({
          name: `Destination ${generator.natural()}`,
        })

        tk.freeze(new Date())
        const duplication =
          await config.api.resource.duplicateResourceToWorkspace({
            resourceId: appWithRepeatedDependencyUsage.app._id!,
            toWorkspace: newWorkspace.appId,
          })

        expect(duplication.body).toEqual({
          resources: {
            workspace_app: [appWithRepeatedDependencyUsage.app._id],
            table: [internalTables[1]._id],
          },
        })

        await validateWorkspace(
          newWorkspace.appId,
          appWithRepeatedDependencyUsage.app,
          {
            screens: appWithRepeatedDependencyUsage.screens.map(s => ({
              ...s,
              pluginAdded: undefined,
              _rev: expect.stringMatching(/^1-\w+/),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })),
            tables: [internalTables[1]],
          }
        )
      })

      it("duplicates row action dependencies and associated automations", async () => {
        const newWorkspace = await config.api.workspace.create({
          name: `Destination ${generator.natural()}`,
        })

        tk.freeze(new Date())
        const duplication =
          await config.api.resource.duplicateResourceToWorkspace({
            resourceId: appWithRowActionDependency.app._id!,
            toWorkspace: newWorkspace.appId,
          })

        expect(duplication.body).toEqual({
          resources: {
            workspace_app: [appWithRowActionDependency.app._id],
            table: [tableWithRowAction._id!],
            row_action: [rowActionDocId],
            automation: [rowActionAutomation._id!],
          },
        })

        await validateWorkspace(
          newWorkspace.appId,
          appWithRowActionDependency.app,
          {
            screens: appWithRowActionDependency.screens.map(s => ({
              ...s,
              pluginAdded: undefined,
              _rev: expect.stringMatching(/^1-\w+/),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })),
            tables: [tableWithRowAction],
            automations: [rowActionAutomation],
            rowActions: [
              {
                tableId: tableWithRowAction._id!,
                actions: rowActionExpectations,
              },
            ],
          }
        )
      })

      it("copies datasource dependencies referenced by the app", async () => {
        const newWorkspace = await config.api.workspace.create({
          name: `Destination ${generator.natural()}`,
        })

        tk.freeze(new Date())
        const duplication =
          await config.api.resource.duplicateResourceToWorkspace({
            resourceId: appWithDatasourceDependency.app._id!,
            toWorkspace: newWorkspace.appId,
          })

        expect(duplication.body).toEqual({
          resources: {
            workspace_app: [appWithDatasourceDependency.app._id],
            datasource: [datasourceWithDependency._id],
          },
        })

        await validateWorkspace(
          newWorkspace.appId,
          appWithDatasourceDependency.app,
          {
            screens: appWithDatasourceDependency.screens.map(s => ({
              ...s,
              pluginAdded: undefined,
              _rev: expect.stringMatching(/^1-\w+/),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })),
            datasource: [datasourceWithDependency],
          }
        )
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

    describe("previewDuplicateResourceToWorkspace", () => {
      it("previews resources that would be duplicated and existing ones", async () => {
        const newWorkspace = await config.api.workspace.create({
          name: `Destination ${generator.natural()}`,
        })

        const previewBefore =
          await config.api.resource.previewDuplicateResourceToWorkspace({
            resourceId: appWithTableUsages.app._id!,
            toWorkspace: newWorkspace.appId,
          })

        expect(previewBefore.body).toEqual({
          toCopy: {
            table: [
              {
                id: internalTables[0]._id,
                name: internalTables[0].name,
                type: "table",
              },
            ],
          },
          existing: {},
        })

        await config.api.resource.duplicateResourceToWorkspace({
          resourceId: appWithTableUsages.app._id!,
          toWorkspace: newWorkspace.appId,
        })

        const previewAfter =
          await config.api.resource.previewDuplicateResourceToWorkspace({
            resourceId: appWithTableUsagesCopy.app._id!,
            toWorkspace: newWorkspace.appId,
          })

        expect(previewAfter.body).toEqual({
          toCopy: {},
          existing: {
            table: [
              {
                id: internalTables[0]._id,
                name: internalTables[0].name,
                type: "table",
              },
            ],
          },
        })
      })

      it("previews datasource dependencies that would be duplicated", async () => {
        const newWorkspace = await config.api.workspace.create({
          name: `Destination ${generator.natural()}`,
        })

        const preview =
          await config.api.resource.previewDuplicateResourceToWorkspace({
            resourceId: appWithDatasourceDependency.app._id!,
            toWorkspace: newWorkspace.appId,
          })

        expect(preview.body).toEqual({
          toCopy: {
            datasource: [
              {
                id: datasourceWithDependency._id,
                name: datasourceWithDependency.name,
                type: ResourceType.DATASOURCE,
              },
            ],
          },
          existing: {},
        })
      })
    })
  })
})
