import { structures } from "@budibase/backend-core/tests"
import tk from "timekeeper"
import { AppMigration, updateAppMigrationMetadata } from "../.."
import * as setup from "../../../api/routes/tests/utilities"
import sdk from "../../../sdk"
import { processMigrations } from "../../migrationsProcessor"
import migration from "../20250618162639_workspace_apps"

const MIGRATIONS: AppMigration[] = [
  {
    id: "20250618162639_workspace_apps",
    func: migration,
    disabled: false,
  },
]

const config = setup.getConfig()

describe.each([
  ["dev", () => config.getDevWorkspaceId()],
  ["prod", () => config.getProdWorkspaceId()],
])("Workspace apps (%s)", (_, getAppId) => {
  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    tk.reset()
    for (const appId of [
      config.getDevWorkspaceId(),
      config.getProdWorkspaceId(),
    ]) {
      await config.doInContext(appId, async () => {
        await updateAppMigrationMetadata({
          appId,
          version: "",
        })

        // remove workspace apps to simulate it comes from an older installation
        const workspaceApps = await sdk.workspaceApps.fetch()
        for (const workspace of workspaceApps) {
          await sdk.workspaceApps.remove(workspace._id!, workspace._rev!)
        }
        expect(await sdk.workspaceApps.fetch()).toBeEmpty()
      })
    }

    tk.freeze(structures.generator.date())
  })

  it("migration will never create multiple workspace apps", async () => {
    await config.doInContext(getAppId(), () =>
      processMigrations(config.getDevWorkspaceId(), MIGRATIONS)
    )

    const devWorkspaceApps = await config.doInContext(
      config.getDevWorkspaceId(),
      sdk.workspaceApps.fetch
    )
    const prodWorkspaceApps = await config.doInContext(
      config.getProdWorkspaceId(),
      sdk.workspaceApps.fetch
    )

    expect(devWorkspaceApps).toHaveLength(1)
    expect(prodWorkspaceApps).toHaveLength(1)

    expect(devWorkspaceApps).toEqual(prodWorkspaceApps)
    // Ensure this was created during the migration
    expect(devWorkspaceApps[0].createdAt).toEqual(new Date().toISOString())
  })
})
