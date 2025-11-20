import { db, events, objectStore } from "@budibase/backend-core"
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
import fs from "fs"
import os from "os"
import path from "path"
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
import { ObjectStoreBuckets } from "../../../constants"

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

      expect(result.body.resources[workspaceApp._id!]).toEqual({
        dependencies: [
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
        ],
      })
    })

    it("should check screens for datasource usage", async () => {
      const table = await config.api.table.save(basicTable())
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

      expect(result.body.resources[screen.workspaceAppId!]).toEqual({
        dependencies: [
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
        ],
      })
    })

    it("should check automations for datasource usage", async () => {
      const table = await config.api.table.save(basicTable())
      // Create an automation using the builder
      const { automation } = await createAutomationBuilder(config)
        .onRowSaved({ tableId: table._id! })
        .save()

      const result = await config.api.resource.getResourceDependencies()

      expect(result.body.resources[automation._id!]).toEqual({
        dependencies: [
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
        ],
      })
    })

    it("should include row actions and their automations when referenced by an automation", async () => {
      const table = await config.api.table.save(basicTable())
      const rowAction = await config.api.rowAction.save(table._id!, {
        name: "Row action usage",
      })

      const result = await config.api.resource.getResourceDependencies()

      expect(result.body.resources[rowAction.automationId]).toEqual({
        dependencies: [
          {
            id: table._id,
            name: table.name,
            type: ResourceType.TABLE,
          },
          {
            id: generateRowActionsID(table._id!),
            name: rowAction.name,
            type: ResourceType.ROW_ACTION,
          },
          {
            id: rowAction.automationId,
            name: "Row action usage",
            type: ResourceType.AUTOMATION,
          },
        ],
      })

      expect(result.body.resources[generateRowActionsID(table._id!)]).toEqual({
        dependencies: [
          {
            id: rowAction.automationId,
            name: rowAction.name,
            type: ResourceType.AUTOMATION,
          },
        ],
      })
    })

    it("should not detect datasource when for internal tables", async () => {
      const table = await config.api.table.save(basicTable())

      const result = await config.api.resource.getResourceDependencies()

      expect(result.body.resources[table._id!]).toEqual({
        dependencies: [
          {
            id: table._id,
            name: table.name,
            type: ResourceType.TABLE,
          },
        ],
      })
    })

    it("should include row actions and their automations when checking a table", async () => {
      const table = await config.api.table.save(basicTable())
      const anotherTable = await config.api.table.save(basicTable())
      const rowAction = await config.api.rowAction.save(table._id!, {
        name: "Table row action",
      })
      const rowAction2 = await config.api.rowAction.save(table._id!, {
        name: "Table row action 2",
      })
      const _anotherRowAction = await config.api.rowAction.save(
        anotherTable._id!,
        {
          name: "Table row action 3",
        }
      )

      const result = await config.api.resource.getResourceDependencies()
      const tableDependencies =
        result.body.resources[table._id!].dependencies ?? []

      expect(tableDependencies).toEqual([
        {
          id: table._id,
          name: table.name,
          type: ResourceType.TABLE,
        },
        {
          id: generateRowActionsID(table._id!),
          name: rowAction.name,
          type: ResourceType.ROW_ACTION,
        },
        {
          id: rowAction.automationId,
          name: rowAction.name,
          type: ResourceType.AUTOMATION,
        },
        {
          id: rowAction2.automationId,
          name: rowAction2.name,
          type: ResourceType.AUTOMATION,
        },
      ])
    })

    it("should detect datasource when for rest queries", async () => {
      const datasource = await config.createDatasource()
      const query = await config.api.query.save(basicQuery(datasource._id))

      const result = await config.api.resource.getResourceDependencies()

      expect(result.body.resources[query._id!]).toEqual({
        dependencies: [
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
        ],
      })
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
      tk.freeze(new Date())
      return await config.api.resource.duplicateResourceToWorkspace(
        {
          resources,
          toWorkspace,
        },
        expectations ?? { status: 204 }
      )
    }

    const collectDependantResourceIds = async (
      id: string
    ): Promise<string[]> => {
      const usage = await config.api.resource.getResourceDependencies()
      return [id, ...usage.body.resources[id].dependencies.map(r => r.id)]
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
      const copiedMetadata = (doc: AnyDocument) => ({
        fromWorkspace: config.getDevWorkspaceId(),
        ...doc,
        _rev: expect.stringMatching(/^1-\w+/),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      await config.withHeaders({ [Header.APP_ID]: workspaceId }, async () => {
        const { workspaceApps: resultingWorkspaceApps } =
          await config.api.workspaceApp.fetch()

        expect(resultingWorkspaceApps.sort(sortById)).toEqual(
          resultingWorkspaceApps.sort((a, b) => a._id!.localeCompare(b._id!))
        )

        const screens = await config.api.screen.list()
        expect(screens.sort(sortById).map(copiedMetadata)).toEqual(
          (expected.screens || [])
            .sort(sortById)
            .map(s => copiedMetadata({ ...s, pluginAdded: undefined }))
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
        expect(queries.sort()).toEqual(
          (expected.queries || []).map(copiedMetadata).sort()
        )

        const { automations } = await config.api.automation.fetch()
        expect(automations.sort(sortById)).toEqual(
          (expected.automations || [])
            // Automation sdk trims fields such as fromWorkspace
            .map(a => copiedMetadata({ ...a, fromWorkspace: undefined }))
            .sort(sortById)
        )

        const workspaceDb = db.getDB(db.getDevWorkspaceID(workspaceId), {
          skip_setup: true,
        })
        expect(
          await workspaceDb.getMultiple(automations.map(a => a._id!))
        ).toEqual(
          automations.map(a =>
            expect.objectContaining({
              _id: a._id,
              fromWorkspace: config.getDevWorkspaceId(),
            })
          )
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

    it("emits duplication events with the expected payload", async () => {
      const destinationName = `Destination ${generator.natural()}`
      const newWorkspace = await config.api.workspace.create({
        name: destinationName,
      })

      const table = await createInternalTable({ name: "Duplicated table" })
      const app = await createApp(createScreenWithDataprovider(table._id!))

      const resourcesToCopy = await collectDependantResourceIds(app.id)

      const duplicatedToWorkspaceSpy = jest.spyOn(
        events.resource,
        "duplicatedToWorkspace"
      )
      await duplicateResources(resourcesToCopy, newWorkspace.appId)

      const sourceWorkspace = config.getDevWorkspace()

      expect(duplicatedToWorkspaceSpy).toHaveBeenCalledTimes(
        resourcesToCopy.length
      )
      expect(duplicatedToWorkspaceSpy?.mock.calls).toEqual([
        [
          {
            fromWorkspace: sourceWorkspace.name,
            toWorkspace: newWorkspace.name,
            resource: {
              id: app.id,
              name: app.app.name,
              type: "App",
            },
          },
        ],
        [
          {
            fromWorkspace: sourceWorkspace.name,
            toWorkspace: newWorkspace.name,
            resource: {
              id: app.screens[0]._id,
              name: app.screens[0].name,
              type: "Screen",
            },
          },
        ],
        [
          {
            fromWorkspace: sourceWorkspace.name,
            toWorkspace: newWorkspace.name,
            resource: {
              id: table._id,
              name: table.name,
              type: "Table",
            },
          },
        ],
      ])
    })

    it("copies basic apps with its screens", async () => {
      const basicApp = await createApp(basicScreen())
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      const resourcesToCopy = await collectDependantResourceIds(basicApp.id)
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

      const resourcesToCopy = await collectDependantResourceIds(
        appWithTableUsages.id
      )
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

      const firstResources = await collectDependantResourceIds(app1.id)
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

      const secondResources = await collectDependantResourceIds(app2.id)
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

      const resourcesToCopy = await collectDependantResourceIds(app.id)
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

      const resourcesToCopy = await collectDependantResourceIds(app.id)
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

      const resourcesToCopy = await collectDependantResourceIds(app.id)
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
        automations: [
          { ...rowActionAutomation, appId: newWorkspace.appId, disabled: true },
        ],
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

      const resourcesToCopy = await collectDependantResourceIds(app.id)
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

    it("duplicates basic table rows into the destination workspace", async () => {
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      const table = await createInternalTable({ name: "Rows source" })
      const createdRow = await config.api.row.save(table._id!, {
        tableId: table._id!,
        name: "Budget holder",
        description: "Original row",
      })

      await duplicateResources([table._id!], newWorkspace.appId)

      await config.withHeaders(
        { [Header.APP_ID]: newWorkspace.appId },
        async () => {
          const rows = await config.api.row.fetch(table._id!)
          expect(rows).toEqual([
            expect.objectContaining({
              _id: createdRow._id,
              name: createdRow.name,
              description: createdRow.description,
            }),
          ])
        }
      )
    })

    it("allows disabling row copy when duplicating tables", async () => {
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      const table = await createInternalTable({ name: "No row copy source" })
      await config.api.row.save(table._id!, {
        tableId: table._id!,
        name: "Budget holder",
      })

      tk.freeze(new Date())
      await config.api.resource.duplicateResourceToWorkspace(
        {
          resources: [table._id!],
          toWorkspace: newWorkspace.appId,
          copyRows: false,
        },
        { status: 204 }
      )

      await config.withHeaders(
        { [Header.APP_ID]: newWorkspace.appId },
        async () => {
          const rows = await config.api.row.fetch(table._id!)
          expect(rows).toEqual([])
        }
      )
    })

    it("copies table rows on subsequent duplications when destination tables are empty", async () => {
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      const table = await createInternalTable({ name: "Rows retry" })
      const createdRow = await config.api.row.save(table._id!, {
        tableId: table._id!,
        name: "Budget holder",
      })

      await config.api.resource.duplicateResourceToWorkspace(
        {
          resources: [table._id!],
          toWorkspace: newWorkspace.appId,
          copyRows: false,
        },
        { status: 204 }
      )

      await config.withHeaders(
        { [Header.APP_ID]: newWorkspace.appId },
        async () => {
          const rows = await config.api.row.fetch(table._id!)
          expect(rows).toEqual([])
        }
      )

      await config.api.resource.duplicateResourceToWorkspace(
        {
          resources: [table._id!],
          toWorkspace: newWorkspace.appId,
          copyRows: true,
        },
        { status: 204 }
      )

      await config.withHeaders(
        { [Header.APP_ID]: newWorkspace.appId },
        async () => {
          const rows = await config.api.row.fetch(table._id!)
          expect(rows).toEqual([
            expect.objectContaining({
              _id: createdRow._id,
              name: createdRow.name,
            }),
          ])
        }
      )
    })

    it("copies attachment files when duplicating tables with attachments", async () => {
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      const table = await createInternalTable({
        name: "Attachments table",
        schema: {
          attachment: {
            type: FieldType.ATTACHMENT_SINGLE,
            name: "attachment",
          },
          gallery: {
            type: FieldType.ATTACHMENTS,
            name: "gallery",
          },
        },
      })

      const sourceProdId = db.getProdWorkspaceID(config.getDevWorkspaceId())
      const fileName = `attachment-${generator.guid()}.txt`
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "bb-attachments-"))
      const tmpFile = path.join(tmpDir, fileName)
      fs.writeFileSync(tmpFile, "budibase attachment")

      const attachmentKey = `${sourceProdId}/attachments/${fileName}`
      await objectStore.upload({
        bucket: ObjectStoreBuckets.APPS,
        filename: attachmentKey,
        path: tmpFile,
        type: "text/plain",
      })

      const attachmentSize = fs.statSync(tmpFile).size

      const attachment = {
        key: attachmentKey,
        name: fileName,
        url: "",
        size: attachmentSize,
        extension: "txt",
      }

      await config.api.row.save(table._id!, {
        tableId: table._id!,
        attachment,
        gallery: [{ ...attachment }],
      })

      await duplicateResources([table._id!], newWorkspace.appId)

      const destinationProdId = db.getProdWorkspaceID(newWorkspace.appId)

      await config.withHeaders(
        { [Header.APP_ID]: newWorkspace.appId },
        async () => {
          const rows = await config.api.row.fetch(table._id!)
          expect(rows).toEqual([
            expect.objectContaining({
              attachment: expect.objectContaining({
                key: `${destinationProdId}/attachments/${fileName}`,
                url: expect.stringContaining(destinationProdId),
                size: attachmentSize,
                extension: "txt",
                name: fileName,
              }),
              gallery: [
                expect.objectContaining({
                  key: `${destinationProdId}/attachments/${fileName}`,
                  url: expect.stringContaining(destinationProdId),
                  size: attachmentSize,
                  extension: "txt",
                  name: fileName,
                }),
              ],
            }),
          ])
        }
      )

      expect(
        await objectStore.objectExists(ObjectStoreBuckets.APPS, attachmentKey)
      ).toBe(true)
      expect(
        await objectStore.objectExists(
          ObjectStoreBuckets.APPS,
          `${destinationProdId}/attachments/${fileName}`
        )
      ).toBe(true)
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

    it("disables duplicated automations in the destination workspace", async () => {
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      const { automation } = await createAutomationBuilder(config)
        .onCron({ cron: "* * * * *" })
        .save({ disabled: false })

      expect(automation.disabled).toBe(false)

      const resourcesToCopy = await collectDependantResourceIds(automation._id!)
      await duplicateResources(resourcesToCopy, newWorkspace.appId)

      await validateWorkspace(newWorkspace.appId, {
        automations: [
          { ...automation, disabled: true, appId: newWorkspace.appId },
        ],
      })
    })

    it("disables duplicated apps in the destination workspace", async () => {
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      const { app, screens } = await createApp(basicScreen())
      const { isDefault, ...appToUpdate } = app
      expect(
        (
          await config.api.workspaceApp.update({
            ...appToUpdate,
            disabled: false,
          })
        ).workspaceApp.disabled
      ).toEqual(false)

      const resourcesToCopy = await collectDependantResourceIds(app._id)

      await duplicateResources(resourcesToCopy, newWorkspace.appId)

      await validateWorkspace(newWorkspace.appId, {
        apps: [{ ...app, disabled: true }],
        screens,
      })
    })

    it("does not throw when copying the same resources twice", async () => {
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      const basicApp = await createApp(basicScreen())

      const resourcesToCopy = await collectDependantResourceIds(basicApp.id)
      await duplicateResources(resourcesToCopy, newWorkspace.appId)

      await duplicateResources(resourcesToCopy, newWorkspace.appId, {
        status: 204,
      })
    })

    it("does not modify the docs on the source workspace", async () => {
      const basicApp = await createApp(basicScreen())
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      const resourcesToCopy = await collectDependantResourceIds(basicApp.id)
      expect(resourcesToCopy).toEqual([
        basicApp.id,
        ...basicApp.screens.map(s => s._id!),
      ])

      const workspaceDb = db.getDB(config.getDevWorkspaceId())
      const prevDocs = await workspaceDb.allDocs({
        include_docs: true,
      })

      await duplicateResources(resourcesToCopy, newWorkspace.appId)

      const latestDocs = await workspaceDb.allDocs({
        include_docs: true,
      })
      expect(latestDocs).toEqual(prevDocs)
    })
  })
})
