import { context, features } from "@budibase/backend-core"
import { Header } from "@budibase/shared-core"
import { FeatureFlag } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import {
  basicDatasource,
  basicQuery,
  basicTable,
  createQueryScreen,
  createViewScreen,
} from "../../../tests/utilities/structures"

describe("Project package ownership", () => {
  const config = new TestConfiguration()

  beforeEach(async () => config.newTenant())
  afterAll(() => config.end())

  const createProjectAppWithUnassignedQueryDatasource = async () => {
    const { project } = await config.api.project.create({ name: "Support" })
    const datasource = await config.api.datasource.create(
      basicDatasource().datasource
    )
    const query = await config.api.query.save(basicQuery(datasource._id!))
    const { workspaceApp } = await config.api.workspaceApp.create({
      name: "Support app",
      url: "/support",
    })
    await config.api.screen.save({
      ...createQueryScreen(datasource._id!, query),
      workspaceAppId: workspaceApp._id,
    })
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      await context.getWorkspaceDB().put({
        ...workspaceApp,
        projectIds: [project._id],
      })
    })

    return project
  }

  const createProjectAppWithUnassignedRowActionTable = async () => {
    const { project } = await config.api.project.create({ name: "Support" })
    const table = await config.api.table.save(basicTable())
    await config.api.rowAction.save(table._id!, { name: "Approve" })
    const view = await config.api.viewV2.create({
      tableId: table._id!,
      name: "Open tickets",
    })
    const { workspaceApp } = await config.api.workspaceApp.create({
      name: "Support app",
      url: "/support",
    })
    await config.api.screen.save({
      ...createViewScreen(view),
      workspaceAppId: workspaceApp._id,
    })
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      await context.getWorkspaceDB().put({
        ...workspaceApp,
        projectIds: [project._id],
      })
    })

    return project
  }

  it("imports the app with its query and unassigned datasource into another workspace", async () => {
    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.PROJECTS]: true },
      async () => {
        const project = await createProjectAppWithUnassignedQueryDatasource()

        const archive = await config.api.project.export(project._id)
        const destination = await config.api.workspace.create({
          name: "Imported workspace",
        })
        await config.withHeaders(
          { [Header.WORKSPACE_ID]: destination.appId },
          async () => {
            const imported = await config.api.project.import(archive)
            const datasource = await config.api.datasource.get(
              imported.resources.datasource![0]
            )
            const query = await config.api.query.get(
              imported.resources.query![0]
            )

            expect(imported.resources.workspace_app).toHaveLength(1)
            expect(imported.resources.query).toHaveLength(1)
            expect(imported.resources.datasource).toHaveLength(1)
            expect(datasource.projectIds).toEqual([imported.project._id])
            expect(query.datasourceId).toBe(datasource._id)
            expect(imported.unsupportedContent).toEqual([])
          }
        )
      }
    )
  })

  it("imports the app with its unassigned row action table and automation into another workspace", async () => {
    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.PROJECTS]: true },
      async () => {
        const project = await createProjectAppWithUnassignedRowActionTable()

        const archive = await config.api.project.export(project._id)
        const destination = await config.api.workspace.create({
          name: "Imported workspace",
        })
        await config.withHeaders(
          { [Header.WORKSPACE_ID]: destination.appId },
          async () => {
            const imported = await config.api.project.import(archive)
            const table = await config.api.table.get(
              imported.resources.table![0]
            )
            const automation = await config.api.automation.get(
              imported.resources.automation![0]
            )

            expect(imported.resources.workspace_app).toHaveLength(1)
            expect(imported.resources.row_action).toHaveLength(1)
            expect(imported.resources.table).toHaveLength(1)
            expect(imported.resources.automation).toHaveLength(1)
            expect(table.projectIds).toEqual([imported.project._id])
            expect(automation.projectIds).toEqual([imported.project._id])
            expect(imported.unsupportedContent).toEqual([])
          }
        )
      }
    )
  })
})
