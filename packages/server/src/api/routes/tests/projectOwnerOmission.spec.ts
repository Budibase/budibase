import { context, features } from "@budibase/backend-core"
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

  it("imports an app after its query datasource was excluded from assignment", async () => {
    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.PROJECTS]: true },
      async () => {
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

        const archive = await config.api.project.export(project._id)
        const imported = await config.api.project.import(archive)

        expect(imported.resources.workspace_app).toHaveLength(1)
        expect(imported.resources.query).toBeUndefined()
        expect(imported.resources.datasource).toBeUndefined()
      }
    )
  })

  it("imports an app after its row action table was excluded from assignment", async () => {
    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.PROJECTS]: true },
      async () => {
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

        const archive = await config.api.project.export(project._id)
        const imported = await config.api.project.import(archive)

        expect(imported.resources.workspace_app).toHaveLength(1)
        expect(imported.resources.row_action).toBeUndefined()
        expect(imported.resources.table).toBeUndefined()
        expect(imported.resources.automation).toBeUndefined()
      }
    )
  })
})
