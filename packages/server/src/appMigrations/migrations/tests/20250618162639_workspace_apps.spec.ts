import tk from "timekeeper"
import * as setup from "../../../api/routes/tests/utilities"
import { processMigrations } from "../../migrationsProcessor"
import migration from "../20250618162639_workspace_apps"
import { AppMigration, updateAppMigrationMetadata } from "../.."
import sdk from "../../../sdk"
import { structures } from "@budibase/backend-core/tests"

const MIGRATIONS: AppMigration[] = [
  {
    id: "20250618162639_workspace_apps",
    func: migration,
    disabled: false,
  },
]

const config = setup.getConfig()

describe.each([
  ["dev", () => config.getAppId()],
  ["prod", () => config.getProdAppId()],
])("Workspace apps (%s)", (_, getAppId) => {
  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    tk.reset()
    for (const appId of [config.getAppId(), config.getProdAppId()]) {
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
      processMigrations(config.getAppId(), MIGRATIONS)
    )

    const devWorkspaceApps = await config.doInContext(
      config.getAppId(),
      sdk.workspaceApps.fetch
    )
    const prodWorkspaceApps = await config.doInContext(
      config.getProdAppId(),
      sdk.workspaceApps.fetch
    )

    expect(devWorkspaceApps).toHaveLength(1)
    expect(prodWorkspaceApps).toHaveLength(1)

    expect(devWorkspaceApps).toEqual(prodWorkspaceApps)
    // Ensure this was created during the migration
    expect(devWorkspaceApps[0].createdAt).toEqual(new Date().toISOString())
  })
})
