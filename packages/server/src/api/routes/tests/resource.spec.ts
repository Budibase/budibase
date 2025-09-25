import { generator } from "@budibase/backend-core/tests"
import { Header } from "@budibase/shared-core"
import { ResourceType, Screen, Table, WorkspaceApp } from "@budibase/types"
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
    let basicApp: { info: WorkspaceApp; screens: Screen[] }
    let internalTables: Table[] = []

    beforeAll(async () => {
      await config.createWorkspace()
      internalTables.push(
        await config.api.table.save(
          basicTable(undefined, { name: "Internal table 1" })
        )
      )
      internalTables.push(
        await config.api.table.save(
          basicTable(undefined, { name: "Internal table 2" })
        )
      )
      internalTables.push(
        await config.api.table.save(
          basicTable(undefined, { name: "Internal table 3" })
        )
      )

      const datasource1 = await config.createDatasource()
      await config.api.query.save(basicQuery(datasource1._id))
      await config.api.query.save(basicQuery(datasource1._id))

      const datasource2 = await config.createDatasource()
      await config.api.query.save(basicQuery(datasource2._id))

      basicApp = {
        info: (
          await config.api.workspaceApp.create({
            name: "My first app",
            url: "/my-first-app",
          })
        ).workspaceApp,
        screens: [],
      }

      {
        const screen = basicScreen()
        screen.workspaceAppId = basicApp.info._id!
        basicApp.screens.push(await config.api.screen.save(screen))
      }
    })

    it("copies the resource and dependencies into the destination workspace for basic apps", async () => {
      const newWorkspace = await config.api.workspace.create({
        name: `Destination ${generator.natural()}`,
      })

      tk.freeze(new Date())
      const response = await config.api.resource.duplicateResourceToWorkspace({
        resourceId: basicApp.info._id!,
        toWorkspace: newWorkspace.appId,
      })

      expect(response.body).toEqual({
        resources: {
          workspace_app: [basicApp.info._id],
        },
      })

      await config.withHeaders(
        { [Header.APP_ID]: newWorkspace.appId },
        async () => {
          const { workspaceApps: resultingWorkspaceApps } =
            await config.api.workspaceApp.fetch()
          expect(resultingWorkspaceApps).toEqual([
            expect.objectContaining({
              ...basicApp.info,
              _rev: expect.stringMatching(/^1-\w+/),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }),
          ])

          const screens = await config.api.screen.list()
          expect(screens).toEqual(
            basicApp.screens.map(s => ({
              ...s,
              pluginAdded: undefined,
              _rev: expect.stringMatching(/^1-\w+/),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }))
          )
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
          resourceId: basicApp.info._id!,
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
