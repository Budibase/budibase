import { configs, db } from "@budibase/backend-core"
import { AIConfig, ConfigType } from "@budibase/types"
import { updateWorkspaceMigrationMetadata } from "../.."
import * as setup from "../../../api/routes/tests/utilities"
import migration from "../20260301144039_remove_unused_ai_configs"

const SOURCE_MIGRATION_ID = "20260227144312_unify_ai_configs"
const config = setup.getConfig()

describe("20260301144039_remove_unused_ai_configs", () => {
  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

  async function getWorkspaceIds() {
    return await config.doInTenant(() => db.getAllWorkspaces({ idsOnly: true }))
  }

  async function setLegacyAIConfig() {
    const legacyConfig: AIConfig = {
      type: ConfigType.AI,
      config: {
        openai: {
          provider: "OpenAI",
          name: "OpenAI",
          active: true,
          isDefault: true,
        },
      },
    }
    await config.doInTenant(async () => {
      await configs.save(legacyConfig)
    })
  }

  it("removes legacy AI config when all workspaces are at or after source migration", async () => {
    await setLegacyAIConfig()
    const workspaceIds = await getWorkspaceIds()

    await config.doInTenant(async () => {
      for (const workspaceId of workspaceIds) {
        await updateWorkspaceMigrationMetadata({
          workspaceId,
          version: SOURCE_MIGRATION_ID,
        })
      }
    })

    await config.doInContext(config.getDevWorkspaceId(), migration)

    const legacy = await config.doInTenant(() => configs.getAIConfig())
    expect(legacy).toBeUndefined()
  })

  it("does not remove legacy AI config when any workspace is behind source migration", async () => {
    await setLegacyAIConfig()
    const [firstWorkspaceId, ...rest] = await getWorkspaceIds()

    await config.doInTenant(async () => {
      await updateWorkspaceMigrationMetadata({
        workspaceId: firstWorkspaceId,
        version: "",
      })
      for (const workspaceId of rest) {
        await updateWorkspaceMigrationMetadata({
          workspaceId,
          version: SOURCE_MIGRATION_ID,
        })
      }
    })

    await config.doInContext(config.getDevWorkspaceId(), migration)

    const legacy = await config.doInTenant(() => configs.getAIConfig())
    expect(legacy).toBeDefined()
    expect(legacy?.type).toBe(ConfigType.AI)
  })
})
