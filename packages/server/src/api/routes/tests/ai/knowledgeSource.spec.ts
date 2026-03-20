import { features } from "@budibase/backend-core"
import {
  FeatureFlag,
  KnowledgeSourceProvider,
  KnowledgeSourceSyncStatus,
} from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

describe("knowledge source configs", () => {
  const config = new TestConfiguration()

  afterAll(() => {
    config.end()
  })

  const withRagEnabled = async <T>(f: () => Promise<T>) => {
    return await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.AI_RAG]: true },
      f
    )
  }

  const withRagDisabled = async <T>(f: () => Promise<T>) => {
    return await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.AI_RAG]: false },
      f
    )
  }

  beforeEach(async () => {
    await config.newTenant()
  })

  it("creates, updates, fetches and deletes knowledge sources", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.knowledgeSource.create({
        knowledgeBaseId: "knowledgebase_test",
        name: "Uploaded files",
        provider: KnowledgeSourceProvider.UPLOAD_FILES,
        sync: {
          enabled: true,
          intervalHours: 24,
          lastStatus: KnowledgeSourceSyncStatus.IDLE,
        },
      })

      expect(created._id).toBeDefined()
      expect(created.provider).toBe(KnowledgeSourceProvider.UPLOAD_FILES)

      const updated = await config.api.knowledgeSource.update({
        ...created,
        name: "Updated source",
      })
      expect(updated.name).toBe("Updated source")

      const allSources = await config.api.knowledgeSource.fetch()
      expect(allSources).toHaveLength(1)

      const scopedSources = await config.api.knowledgeSource.fetch(
        "knowledgebase_test"
      )
      expect(scopedSources).toHaveLength(1)
      expect(scopedSources[0]._id).toBe(created._id)

      const { deleted } = await config.api.knowledgeSource.remove(created._id!)
      expect(deleted).toBe(true)

      const afterDelete = await config.api.knowledgeSource.fetch()
      expect(afterDelete).toHaveLength(0)
    })
  })

  it("returns 403 when RAG is disabled", async () => {
    await withRagDisabled(async () => {
      await config.api.knowledgeSource.fetch(undefined, { status: 403 })
      await config.api.knowledgeSource.create(
        {
          knowledgeBaseId: "knowledgebase_test",
          name: "Uploaded files",
          provider: KnowledgeSourceProvider.UPLOAD_FILES,
        },
        { status: 403 }
      )
      await config.api.knowledgeSource.update(
        {
          _id: "knowledgesource_test",
          _rev: "1-test",
          knowledgeBaseId: "knowledgebase_test",
          name: "Updated source",
          provider: KnowledgeSourceProvider.UPLOAD_FILES,
        },
        { status: 403 }
      )
      await config.api.knowledgeSource.remove("knowledgesource_test", {
        status: 403,
      })
    })
  })
})
