import { generator } from "@budibase/backend-core/tests"
import { Header } from "@budibase/shared-core"
import {
  AnyDocument,
  Automation,
  Datasource,
  FieldType,
  Query,
  RelationshipType,
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

  beforeAll(async () => {
    await config.init()
  })

  afterAll(config.end)

  beforeEach(() => {
    tk.reset()
  })

  describe("resource usage analysis", () => {
    let table: Table

    beforeAll(async () => {
      table = await config.api.table.save(basicTable())
    })

    it("should detect datasource usage via query screens", async () => {
      const datasource = await config.createDatasource()
      const query = await config.api.query.save(basicQuery(datasource._id))
      const { workspaceApp } = await config.api.workspaceApp.create({
        name: "Datasource usage app",
        url: "/datasource-usage-app",
      })
      const screen = await config.api.screen.save({
        ...createQueryScreen(datasource._id, query),
        workspaceAppId: workspaceApp._id,
      })

      const result = await config.api.resource.getResourceDependencies()

      expect(result.body.dependencies[workspaceApp._id!]).toEqual([
        {
          id: screen._id,
          name: screen.name,
          type: ResourceType.SCREEN,
        },
        {
          id: datasource._id,
          name: datasource.name,
          type: ResourceType.DATASOURCE,
        },
        {
          id: query._id,
          name: query.name,
          type: ResourceType.QUERY,
        },
      ])
    })

    it("should check screens for datasource usage", async () => {
      const screenData = basicScreen()
      screenData.props._children?.push({
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
      const screen = await config.api.screen.save(screenData)

      const result = await config.api.resource.getResourceDependencies()

      expect(result.body.dependencies[screen.workspaceAppId!]).toEqual([
        {
          id: screen._id,
          name: screen.name,
          type: ResourceType.SCREEN,
        },
        {
          id: table._id,
          name: table.name,
          type: ResourceType.TABLE,
        },
      ])
    })

    it("should check automations for datasource usage", async () => {
      // Create an automation using the builder
      const { automation } = await createAutomationBuilder(config)
        .onRowSaved({ tableId: table._id! })
        .save()

      const result = await config.api.resource.getResourceDependencies()

      expect(result.body.dependencies[automation._id!]).toEqual([
        {
          id: table._id,
          name: table.name,
          type: ResourceType.TABLE,
        },
        {
          id: automation._id,
          name: automation.name,
          type: ResourceType.AUTOMATION,
        },
      ])
    })

    it("should include row actions and their automations when referenced by an automation", async () => {
      const rowAction = await config.api.rowAction.save(table._id!, {
        name: "Row action usage",
      })

      const result = await config.api.resource.getResourceDependencies()

      expect(result.body.dependencies[rowAction.automationId]).toEqual([
        {
          id: table._id,
          name: table.name,
          type: ResourceType.TABLE,
        },
        {
          id: rowAction.automationId,
          name: "Row action usage",
          type: ResourceType.AUTOMATION,
        },
        {
          id: generateRowActionsID(table._id!),
          name: rowAction.name,
          type: ResourceType.ROW_ACTION,
        },
      ])

      expect(
        result.body.dependencies[generateRowActionsID(table._id!)]
      ).toEqual([
        {
          id: rowAction.automationId,
          name: rowAction.name,
          type: ResourceType.AUTOMATION,
        },
      ])
    })

    it("should detect datasource when for rest queries", async () => {
      const datasource = await config.createDatasource()
      const query = await config.api.query.save(basicQuery(datasource._id))

      const result = await config.api.resource.getResourceDependencies()

      expect(result.body.dependencies[query._id!]).toEqual([
        {
          id: datasource._id,
          name: datasource.name,
          type: ResourceType.DATASOURCE,
        },
        {
          id: query._id,
          name: query.name,
          type: ResourceType.QUERY,
        },
      ])
    })
  })

  describe("duplication", () => {
    beforeAll(async () => {
      await config.createWorkspace()
    })

    async function createInternalTable(data: Partial<Table> = {}) {
      const table = await config.api.table.save(basicTable(undefined, data))
      return table
    }

    async function createApp(...screens: Screen[]) {
      const uuid = generator.guid()
      const { workspaceApp: createdApp } = await config.api.workspaceApp.create(
        {
          name: uuid,
          url: `/uuid`,
        }
      )
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
        id: createdApp._id!,
        app: createdApp,
        screens: createdScreens,
      }
    }

    function createScreenWithDataprovider(tableId: string) {
      const screen = basicScreen()
      screen.props._children?.push({
        _id: "child-props",
        _instanceName: "child",
        _styles: {},
        _component: "@budibase/standard-components/dataprovider",
        datasource: {
          tableId,
          type: "table",
        },
      })
      return screen
    }

    function createScreenWithRowActionUsage(rowAction: RowActionResponse) {
      const screen = basicScreen()
      screen.props._children?.push({
        _id: "row-action-button",
        _instanceName: 'Row action button"',
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
              resourceId: rowAction.tableId,
              rowId: "{{ [row-action-source].[_id] }}",
            },
          },
        ],
      })
      return screen
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

    const collectResourceIds = async (id: string): Promise<string[]> => {
      const usage = await config.api.resource.getResourceDependencies()
      return [id, ...usage.body.dependencies[id].map(r => r.id)]
    }

    const validateWorkspace = async (
      workspaceId: string,
      expected: {
        apps?: WorkspaceApp[]
        screens?: Screen[]
        tables?: Table[]
        datasource?: Datasource[]
        queries?: Query[]
        automations?: Automation[]
        rowActions?: { tableId: string; actions: RowActionResponse[] }[]
      }
    ) => {
      const sortById = (a: AnyDocument, b: AnyDocument) =>
        a._id!.localeCompare(b._id!)

      await config.withHeaders({ [Header.APP_ID]: workspaceId }, async () => {
        const { workspaceApps: resultingWorkspaceApps } =
          await config.api.workspaceApp.fetch()

        expect(resultingWorkspaceApps.sort(sortById)).toEqual(
          resultingWorkspaceApps.sort((a, b) => a._id!.localeCompare(b._id!))
        )

        const screens = await config.api.screen.list()
        const normaliseScreen = (screen: Screen) => ({
          _id: screen._id,
          name: screen.name,
          workspaceAppId: screen.workspaceAppId,
        })
        expect(screens.sort(sortById).map(normaliseScreen)).toEqual(
          (expected.screens || [])
            .sort((a, b) => a._id!.localeCompare(b._id!))
            .map(normaliseScreen)
        )

        const tables = await config.api.table.fetch()
        const actualTableIds = tables.map(table => table._id!).sort()
        const expectedTableIds = [
          "ta_users",
          ...(expected.tables || []).map(table => table._id!),
        ].sort()
        expect(actualTableIds).toEqual(expectedTableIds)

        const datasources = await config.api.datasource.fetch()
        const actualDatasourceIds = datasources
          .map(datasource => datasource._id!)
          .sort()
        const expectedDatasourceIds = [
          "bb_internal",
          ...(expected.datasource || []).map(ds => ds._id!),
        ].sort()
        expect(actualDatasourceIds).toEqual(expectedDatasourceIds)

        const queries = await config.api.query.fetch()
        expect(queries.map(query => query._id!).sort()).toEqual(
          (expected.queries || []).map(q => q._id!).sort()
        )

        const { automations } = await config.api.automation.fetch()
        expect(automations.map(automation => automation._id!).sort()).toEqual(
          (expected.automations || []).map(a => a._id!).sort()
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

    it("copies basic apps with its screens", async () => {
      const basicApp = await createApp(basicScreen())
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      const resourcesToCopy = await collectResourceIds(basicApp.id)
      expect(resourcesToCopy).toEqual([
        basicApp.id,
        ...basicApp.screens.map(s => s._id!),
      ])

      await duplicateResources(resourcesToCopy, newWorkspace.appId)
      await validateWorkspace(newWorkspace.appId, {
        apps: [basicApp.app],
        screens: basicApp.screens,
      })
    })

    it("copies apps with tables into the destination workspace", async () => {
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      const table = await createInternalTable()

      const appWithTableUsages = await createApp(
        createScreenWithDataprovider(table._id!)
      )

      const resourcesToCopy = await collectResourceIds(appWithTableUsages.id)
      expect(resourcesToCopy).toEqual([
        appWithTableUsages.id,
        ...appWithTableUsages.screens.map(s => s._id!),
        table._id!,
      ])

      await duplicateResources(resourcesToCopy, newWorkspace.appId)
      await validateWorkspace(newWorkspace.appId, {
        apps: [appWithTableUsages.app],
        screens: appWithTableUsages.screens,
        tables: [table],
      })
    })

    it("does not duplicate shared dependencies when copying multiple apps", async () => {
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      const table = await createInternalTable()
      const app1 = await createApp(createScreenWithDataprovider(table._id!))

      const app2 = await createApp(createScreenWithDataprovider(table._id!))

      const firstResources = await collectResourceIds(app1.id)
      expect(firstResources).toEqual([
        app1.id,
        ...app1.screens.map(s => s._id!),
        table._id!,
      ])
      await duplicateResources(firstResources, newWorkspace.appId)

      await validateWorkspace(newWorkspace.appId, {
        apps: [app1.app],
        screens: app1.screens,
        tables: [table],
      })

      const secondResources = await collectResourceIds(app2.id)
      expect(secondResources).toEqual([
        app2.id,
        ...app2.screens.map(s => s._id!),
        table._id!,
      ])

      await duplicateResources(secondResources, newWorkspace.appId)

      await validateWorkspace(newWorkspace.appId, {
        apps: [app1.app, app2.app],
        screens: [...app1.screens, ...app2.screens],
        tables: [table],
      })
    })

    it("duplicates apps that reference the same dependency multiple times", async () => {
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      const table1 = await createInternalTable()
      const table2 = await createInternalTable()

      const app = await createApp(
        createScreenWithDataprovider(table1._id!),
        createScreenWithDataprovider(table2._id!),
        createScreenWithDataprovider(table1._id!)
      )

      const resourcesToCopy = await collectResourceIds(app.id)
      await duplicateResources(resourcesToCopy, newWorkspace.appId)
      await validateWorkspace(newWorkspace.appId, {
        apps: [app.app],
        screens: app.screens,
        tables: [table1, table2],
      })
    })

    it("duplicates tables with link relationships", async () => {
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      const linkedTable = await createInternalTable({ name: "Linked table" })
      const mainTableConfig = basicTable(undefined, {
        name: "Linking table",
      })
      mainTableConfig.schema.linkedRecord = {
        type: FieldType.LINK,
        name: "linkedRecord",
        fieldName: "linkedRecord",
        tableId: linkedTable._id!,
        relationshipType: RelationshipType.MANY_TO_ONE,
      }
      const mainTable = await config.api.table.save(mainTableConfig)

      const app = await createApp(createScreenWithDataprovider(mainTable._id!))

      const resourcesToCopy = await collectResourceIds(app.id)
      expect(resourcesToCopy).toEqual([
        app.id,
        ...app.screens.map(s => s._id),
        mainTable._id,
        linkedTable._id,
      ])

      await duplicateResources(resourcesToCopy, newWorkspace.appId)
      await validateWorkspace(newWorkspace.appId, {
        apps: [app.app],
        screens: app.screens,
        tables: [mainTable, linkedTable],
      })
    })

    it("duplicates row action dependencies and associated automations", async () => {
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      const table = await config.api.table.save(
        basicTable(undefined, { name: "Row action table" })
      )
      const rowAction = await config.api.rowAction.save(table._id!, {
        name: "Row action button",
      })
      const rowActionDocId = generateRowActionsID(table._id!)
      const rowActionAutomation = await config.api.automation.get(
        rowAction.automationId
      )

      const rowActionList = await config.api.rowAction.find(table._id!)
      const rowActionsForTable = Object.values(rowActionList.actions)

      const app = await createApp(createScreenWithRowActionUsage(rowAction))

      const resourcesToCopy = await collectResourceIds(app.id)
      expect(resourcesToCopy).toEqual([
        app.id,
        ...app.screens.map(s => s._id!),
        table._id!,
        rowActionDocId,
        rowActionAutomation._id!,
      ])

      await duplicateResources(resourcesToCopy, newWorkspace.appId)
      await validateWorkspace(newWorkspace.appId, {
        apps: [app.app],
        screens: app.screens,
        tables: [table],
        automations: [rowActionAutomation],
        rowActions: [
          {
            tableId: table._id!,
            actions: rowActionsForTable,
          },
        ],
      })
    })

    it("duplicates datasource and queries when duplicating apps with usages of it", async () => {
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      const datasourceWithDependency = await config.createDatasource()
      const queryForDatasource = await config.api.query.save(
        basicQuery(datasourceWithDependency._id!)
      )

      const screenWithDatasourceDependency = createQueryScreen(
        datasourceWithDependency._id!,
        queryForDatasource
      )
      const app = await createApp(screenWithDatasourceDependency)

      const resourcesToCopy = await collectResourceIds(app.id)
      expect(resourcesToCopy).toEqual([
        app.id,
        ...app.screens.map(s => s._id),
        datasourceWithDependency._id,
        queryForDatasource._id,
      ])

      await duplicateResources(resourcesToCopy, newWorkspace.appId)

      await validateWorkspace(newWorkspace.appId, {
        apps: [app.app],
        screens: app.screens,
        datasource: [datasourceWithDependency],
        queries: [queryForDatasource],
      })
    })

    it("duplicates individual tables", async () => {
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      const internalTables = [
        await createInternalTable({ name: "Internal table 1" }),
        await createInternalTable({ name: "Internal table 2" }),
        await createInternalTable({ name: "Internal table 3" }),
      ]
      const tableToCopy = [internalTables[0], internalTables[2]]

      await duplicateResources(
        tableToCopy.map(t => t._id!),
        newWorkspace.appId
      )
      await validateWorkspace(newWorkspace.appId, {
        tables: tableToCopy,
      })
    })

    it("throws when destination workspace does not exist", async () => {
      const basicApp = await createApp()

      const response = await duplicateResources(
        [basicApp.id],
        "app_unexisting",
        { status: 400 }
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

    it("throws when copying the same resources twice", async () => {
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      const basicApp = await createApp(basicScreen())

      const resourcesToCopy = await collectResourceIds(basicApp.id)
      await duplicateResources(resourcesToCopy, newWorkspace.appId)

      const error = await duplicateResources(
        resourcesToCopy,
        newWorkspace.appId,
        { status: 400 }
      )
      expect(error.body).toMatchObject({
        message: "No resources to copy",
        status: 400,
      })
    })
  })
})
