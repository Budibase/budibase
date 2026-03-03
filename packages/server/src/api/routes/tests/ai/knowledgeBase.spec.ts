import { features } from "@budibase/backend-core"
import { FeatureFlag, VectorDbProvider } from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

describe("knowledge base configs", () => {
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

  beforeEach(async () => {
    await config.newTenant()
  })

  const buildDependencies = async () => {
    const embeddingModelId = "aiconfig_embedding_test"

    const vectorDb = await config.api.vectorDb.create({
      name: "Primary Vector DB",
      provider: VectorDbProvider.PGVECTOR,
      host: "localhost",
      port: 5432,
      database: "budibase",
      user: "bb_user",
      password: "secret",
    })

    return { embeddingModelId, vectorDb }
  }

  it("creates and lists knowledge bases", async () => {
    await withRagEnabled(async () => {
      const { embeddingModelId, vectorDb } = await buildDependencies()

      const created = await config.api.knowledgeBase.create({
        name: "Support Docs",
        embeddingModel: embeddingModelId,
        vectorDb: vectorDb._id!,
      })

      expect(created._id).toBeDefined()
      expect(created.name).toBe("Support Docs")

      const knowledgeBases = await config.api.knowledgeBase.fetch()
      expect(knowledgeBases).toHaveLength(1)
      expect(knowledgeBases[0].embeddingModel).toBe(embeddingModelId)
      expect(knowledgeBases[0].vectorDb).toBe(vectorDb._id)
    })
  })

  it("updates and deletes knowledge bases", async () => {
    await withRagEnabled(async () => {
      const { embeddingModelId, vectorDb } = await buildDependencies()

      const created = await config.api.knowledgeBase.create({
        name: "Support Docs",
        embeddingModel: embeddingModelId,
        vectorDb: vectorDb._id!,
      })

      const updated = await config.api.knowledgeBase.update({
        ...created,
        name: "Updated Knowledge Base",
      })
      expect(updated.name).toBe("Updated Knowledge Base")

      const { deleted } = await config.api.knowledgeBase.remove(created._id!)
      expect(deleted).toBe(true)

      const knowledgeBases = await config.api.knowledgeBase.fetch()
      expect(knowledgeBases).toHaveLength(0)
    })
  })

  it("rejects missing fields", async () => {
    await withRagEnabled(async () => {
      await config.api.knowledgeBase.create(
        {
          name: "Incomplete",
          embeddingModel: "",
          vectorDb: "",
        },
        { status: 400 }
      )
    })
  })
})
