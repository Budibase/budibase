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

      const result = await config.api.resource.searchForUsage()

      expect(result.body.resources[workspaceApp._id!]).toEqual(
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

      const result = await config.api.resource.searchForUsage()

      expect(result.body.resources[screen.workspaceAppId!]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: table._id,
            name: table.name,
            type: ResourceType.TABLE,
          }),
        ])
      )
    })

    it("should check automations for datasource usage", async () => {
      // Create an automation using the builder
      const { automation } = await createAutomationBuilder(config)
        .onRowSaved({ tableId: table._id! })
        .save()

      const result = await config.api.resource.searchForUsage()

      expect(result.body.resources[automation._id!]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: table._id,
            name: table.name,
            type: ResourceType.TABLE,
          }),
        ])
      )
    })

    it("should include row actions and their automations when referenced by an automation", async () => {
      const rowAction = await config.api.rowAction.save(table._id!, {
        name: "Row action usage",
      })

      const result = await config.api.resource.searchForUsage()

      expect(result.body.resources[rowAction.automationId]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: generateRowActionsID(table._id!),
            name: rowAction.name,
            type: ResourceType.ROW_ACTION,
          }),
        ])
      )

      expect(result.body.resources[generateRowActionsID(table._id!)]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: rowAction.automationId,
            name: rowAction.name,
            type: ResourceType.AUTOMATION,
          }),
        ])
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

    const uniqueIds = (ids: string[]) => Array.from(new Set(ids))

    const sanitizeResourceIds = (ids: string[]) =>
      uniqueIds(ids.filter((id): id is string => !!id && id !== "bb_internal"))

    async function collectResourceIds(id: string): Promise<string[]> {
      const usage = await config.api.resource.searchForUsage()
      const dependants = new Set([id])

      function checkDependants(id: string) {
        if (!usage.body.resources[id]) {
          return
        }

        for (const resource of usage.body.resources[id]) {
          if (dependants.has(resource.id)) {
            continue
          }
          dependants.add(resource.id)
          checkDependants(resource.id)
        }
      }

      checkDependants(id)

      return dependants.values().toArray()
    }

    const expectIdsToMatch = (actual: string[], expected: string[]) => {
      expect(actual.sort()).toEqual(expected.sort())
    }

    const previewResources = async (
      resources: string[],
      toWorkspace: string
    ) => {
      return await config.api.resource.previewDuplicateResourceToWorkspace({
        resources,
        toWorkspace,
      })
    }

    const duplicateResources = async (
      resources: string[],
      toWorkspace: string,
      expectations?: Parameters<
        typeof config.api.resource.duplicateResourceToWorkspace
      >[1]
    ) => {
      return await config.api.resource.duplicateResourceToWorkspace(
        {
          resources,
          toWorkspace,
        },
        expectations ?? { status: 204 }
      )
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

        const resourcesToCopy = await collectResourceIds(
          appWithTableUsages.app._id!
        )

        const preview = await previewResources(
          resourcesToCopy,
          newWorkspace.appId
        )
        expect(preview.body.existing).toEqual([])
        expectIdsToMatch(preview.body.toCopy, resourcesToCopy)

        tk.freeze(new Date())
        await duplicateResources(preview.body.toCopy, newWorkspace.appId)

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

        const firstResources = await collectResourceIds(
          appWithTableUsages.app._id!
        )
        const firstPreview = await previewResources(
          firstResources,
          newWorkspace.appId
        )
        expect(firstPreview.body.existing).toEqual([])

        tk.freeze(new Date())
        await duplicateResources(
          sanitizeResourceIds(firstPreview.body.toCopy),
          newWorkspace.appId
        )

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

        const secondResources = await collectResourceIds(
          appSharingTableDependency.app._id!
        )
        const secondPreview = await previewResources(
          secondResources,
          newWorkspace.appId
        )
        expect(secondPreview.body.existing).toEqual(
          expect.arrayContaining([internalTables[0]._id!])
        )

        await duplicateResources(
          sanitizeResourceIds(secondPreview.body.toCopy),
          newWorkspace.appId
        )

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

        const resourcesToCopy = await collectResourceIds(
          appWithRepeatedDependencyUsage.app._id!
        )
        const preview = await previewResources(
          resourcesToCopy,
          newWorkspace.appId
        )

        expect(preview.body.existing).toEqual([])
        expect(
          preview.body.toCopy.filter(id => id === internalTables[1]._id!)
        ).toHaveLength(1)

        tk.freeze(new Date())
        await duplicateResources(
          sanitizeResourceIds(preview.body.toCopy),
          newWorkspace.appId
        )

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

        const resourcesToCopy = await collectResourceIds(
          appWithRowActionDependency.app._id!
        )
        const preview = await previewResources(
          resourcesToCopy,
          newWorkspace.appId
        )

        expect(preview.body.toCopy).toEqual(
          expect.arrayContaining([rowActionDocId, rowActionAutomation._id!])
        )

        tk.freeze(new Date())
        await duplicateResources(
          sanitizeResourceIds(preview.body.toCopy),
          newWorkspace.appId
        )

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

      it("duplicates datasource dependencies when duplicating apps", async () => {
        const newWorkspace = await config.api.workspace.create({
          name: `Destination ${generator.natural()}`,
        })

        const resourcesToCopy = await collectResourceIds(
          appWithDatasourceDependency.app._id!
        )
        const preview = await previewResources(
          resourcesToCopy,
          newWorkspace.appId
        )

        expect(preview.body.toCopy).toEqual(
          expect.arrayContaining([datasourceWithDependency._id!])
        )

        tk.freeze(new Date())
        await duplicateResources(
          sanitizeResourceIds(preview.body.toCopy),
          newWorkspace.appId
        )

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

      it("duplicates individual tables", async () => {
        const newWorkspace = await config.api.workspace.create({
          name: `Destination ${generator.natural()}`,
        })

        const tableToCopy = internalTables[2]

        const preview = await previewResources(
          [tableToCopy._id!],
          newWorkspace.appId
        )

        expect(preview.body.existing).toEqual([])
        expect(preview.body.toCopy).toEqual([tableToCopy._id!])

        tk.freeze(new Date())
        await duplicateResources(
          sanitizeResourceIds(preview.body.toCopy),
          newWorkspace.appId
        )

        await config.withHeaders(
          { [Header.APP_ID]: newWorkspace.appId },
          async () => {
            const tables = await config.api.table.fetch()
            expect(tables).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ _id: tableToCopy._id! }),
              ])
            )
          }
        )
      })

      it("throws when destination workspace already exists", async () => {
        const response = await duplicateResources(
          [basicApp.app._id!],
          "app_unexisting",
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

      it("cannot duplicate the same resources twice on the same workspace", async () => {
        const newWorkspace = await config.api.workspace.create({
          name: `Destination ${generator.natural()}`,
        })

        const resourcesToCopy = await collectResourceIds(basicApp.app._id!)
        const preview = await previewResources(
          resourcesToCopy,
          newWorkspace.appId
        )

        tk.freeze(new Date())
        await duplicateResources(
          sanitizeResourceIds(preview.body.toCopy),
          newWorkspace.appId
        )

        const error = await duplicateResources(
          sanitizeResourceIds(preview.body.toCopy),
          newWorkspace.appId,
          { status: 400 }
        )
        expect(error.body).toMatchObject({
          message: "No resources to copy",
          status: 400,
        })
      })
    })

    describe("previewDuplicateResourceToWorkspace", () => {
      it("previews resources that would be duplicated and existing ones", async () => {
        const newWorkspace = await config.api.workspace.create({
          name: `Destination ${generator.natural()}`,
        })

        const initialResources = await collectResourceIds(
          appWithTableUsages.app._id!
        )
        const previewBefore = await previewResources(
          initialResources,
          newWorkspace.appId
        )

        expect(previewBefore.body.existing).toEqual([])
        expectIdsToMatch(previewBefore.body.toCopy, initialResources)

        await duplicateResources(
          sanitizeResourceIds(previewBefore.body.toCopy),
          newWorkspace.appId
        )

        const copyResources = await collectResourceIds(
          appWithTableUsagesCopy.app._id!
        )
        const previewAfter = await previewResources(
          copyResources,
          newWorkspace.appId
        )

        expect(previewAfter.body.existing).toEqual(
          expect.arrayContaining([internalTables[0]._id!])
        )
        expect(previewAfter.body.toCopy).not.toContain(internalTables[0]._id)
      })

      it("previews datasource dependencies that would be duplicated", async () => {
        const newWorkspace = await config.api.workspace.create({
          name: `Destination ${generator.natural()}`,
        })

        const resources = await collectResourceIds(
          appWithDatasourceDependency.app._id!
        )
        const preview = await previewResources(resources, newWorkspace.appId)

        expect(preview.body.toCopy).toEqual(
          expect.arrayContaining([datasourceWithDependency._id!])
        )
        expect(preview.body.existing).toEqual([])
      })
    })
  })
})
