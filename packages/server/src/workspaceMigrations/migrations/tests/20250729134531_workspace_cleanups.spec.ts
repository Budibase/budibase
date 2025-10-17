import { db } from "@budibase/backend-core"
import { structures } from "@budibase/backend-core/tests"
import { WorkspaceApp } from "@budibase/types"
import tk from "timekeeper"
import { WorkspaceMigration, updateWorkspaceMigrationMetadata } from "../.."
import * as setup from "../../../api/routes/tests/utilities"
import sdk from "../../../sdk"
import { basicScreen } from "../../../tests/utilities/structures"
import { processMigrations } from "../../migrationsProcessor"
import migration from "../20250729134531_workspace_cleanups"

const MIGRATIONS: WorkspaceMigration[] = [
  {
    id: "20250729134531_workspace_cleanups",
    func: jest.fn().mockImplementation(migration),
    disabled: false,
  },
]

const config = setup.getConfig()

async function createWorkspaceApp(isDefault = false) {
  const workspaceApp = await sdk.workspaceApps.create(
    structures.workspaceApps.workspaceApp({ isDefault })
  )

  return workspaceApp
}

describe.each([
  ["dev", () => config.getDevWorkspaceId()],
  ["prod", () => config.getProdWorkspaceId()],
])("Workspace cleanups migration (%s)", (_, getWorkspaceId) => {
  let defaultWorkspaceApp: WorkspaceApp

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await config.newTenant()
    for (const workspaceId of [
      config.getDevWorkspaceId(),
      config.getProdWorkspaceId(),
    ]) {
      await config.doInContext(workspaceId, async () => {
        await updateWorkspaceMigrationMetadata({
          workspaceId,
          version: "",
        })
      })

      const workspaceApps = await config.doInContext(
        getWorkspaceId(),
        sdk.workspaceApps.fetch
      )
      expect(workspaceApps).toHaveLength(1)
      defaultWorkspaceApp = workspaceApps[0]
    }

    tk.freeze(structures.generator.date())
    jest.clearAllMocks()
  })

  afterEach(() => {
    expect(MIGRATIONS[0].func).toHaveBeenCalledTimes(2)
  })

  it("does nothing when only one default workspace app exists", async () => {
    await config.doInContext(getWorkspaceId(), () =>
      processMigrations(config.getDevWorkspaceId(), MIGRATIONS)
    )

    const workspaceApps = await config.doInContext(
      getWorkspaceId(),
      sdk.workspaceApps.fetch
    )
    expect(workspaceApps).toHaveLength(1)
    expect(workspaceApps[0].isDefault).toBe(true)
  })

  it("does nothing when multiple non-default workspace apps exist", async () => {
    await config.doInContext(getWorkspaceId(), async () => {
      await createWorkspaceApp(false)
      await createWorkspaceApp(false)
    })

    await config.doInContext(getWorkspaceId(), () =>
      processMigrations(config.getDevWorkspaceId(), MIGRATIONS)
    )

    const workspaceApps = await config.doInContext(
      getWorkspaceId(),
      sdk.workspaceApps.fetch
    )
    expect(workspaceApps).toHaveLength(3)
  })

  it("removes duplicate default workspace apps and keeps only one", async () => {
    await config.doInContext(getWorkspaceId(), async () => {
      await createWorkspaceApp(true)
      await createWorkspaceApp(true)
      await createWorkspaceApp(true)
    })

    await config.doInContext(getWorkspaceId(), () =>
      processMigrations(config.getDevWorkspaceId(), MIGRATIONS)
    )

    const workspaceApps = await config.doInContext(
      getWorkspaceId(),
      sdk.workspaceApps.fetch
    )

    expect(workspaceApps).toHaveLength(1)
    expect(workspaceApps[0].isDefault).toBe(true)
  })

  it("updates screens to reference the kept workspace app when removing duplicates", async () => {
    let keptWorkspaceAppId: string = undefined!

    await config.doInContext(getWorkspaceId(), async () => {
      const workspaceApp1 = await createWorkspaceApp(true)
      const workspaceApp2 = await createWorkspaceApp(true)

      tk.travel(Date.now() + 1000)

      await sdk.workspaceApps.update(workspaceApp1)

      const toDelete1 = defaultWorkspaceApp._id!
      const toDelete2 = workspaceApp2._id!
      keptWorkspaceAppId = workspaceApp1._id!

      // Create screens that reference both workspace apps
      await sdk.screens.create({
        ...basicScreen(),
        workspaceAppId: toDelete1,
      })
      await sdk.screens.create({
        ...basicScreen(),
        workspaceAppId: toDelete2,
      })
      await sdk.screens.create({
        ...basicScreen(),
        workspaceAppId: toDelete1,
      })
    })

    await config.doInContext(getWorkspaceId(), () =>
      processMigrations(config.getDevWorkspaceId(), MIGRATIONS)
    )

    const workspaceApps = await config.doInContext(
      getWorkspaceId(),
      sdk.workspaceApps.fetch
    )
    const screens = await config.doInContext(
      getWorkspaceId(),
      sdk.screens.fetch
    )

    expect(workspaceApps).toHaveLength(1)
    expect(workspaceApps[0]._id).toBe(keptWorkspaceAppId)

    // All screens should now reference the kept workspace app
    const screensWithWorkspaceAppId = screens.filter(s => s.workspaceAppId)
    expect(screensWithWorkspaceAppId).toHaveLength(3)
    screensWithWorkspaceAppId.forEach(screen => {
      expect(screen.workspaceAppId).toBe(keptWorkspaceAppId)
    })
  })

  it("handles mixed default and non-default workspace apps correctly", async () => {
    await config.doInContext(getWorkspaceId(), async () => {
      await createWorkspaceApp(true)
      await createWorkspaceApp(true)
      await createWorkspaceApp(false)
    })

    await config.doInContext(getWorkspaceId(), () =>
      processMigrations(config.getDevWorkspaceId(), MIGRATIONS)
    )

    const workspaceApps = await config.doInContext(
      getWorkspaceId(),
      sdk.workspaceApps.fetch
    )

    expect(workspaceApps).toHaveLength(2)

    const defaultApps = workspaceApps.filter(app => app.isDefault)
    const nonDefaultApps = workspaceApps.filter(app => !app.isDefault)

    expect(defaultApps).toHaveLength(1)
    expect(nonDefaultApps).toHaveLength(1)
  })

  it("handles different workspace apps between dev and prod", async () => {
    const prodAppId = db.getProdWorkspaceID(getWorkspaceId())
    const devId = db.getDevWorkspaceID(getWorkspaceId())
    await config.doInContext(prodAppId, async () => {
      await createWorkspaceApp(true)
    })

    await config.doInContext(devId, async () => {
      await createWorkspaceApp(true)
    })

    expect(
      await config.doInContext(prodAppId, async () =>
        (await sdk.workspaceApps.fetch()).map(a => a._id)
      )
    ).not.toEqual(
      await config.doInContext(devId, async () =>
        (await sdk.workspaceApps.fetch()).map(a => a._id)
      )
    )

    await config.doInContext(getWorkspaceId(), () =>
      processMigrations(config.getDevWorkspaceId(), MIGRATIONS)
    )

    const workspaceApps = await config.doInContext(
      getWorkspaceId(),
      sdk.workspaceApps.fetch
    )

    expect(workspaceApps).toHaveLength(1)
  })
})
