import { features } from "@budibase/backend-core"
import {
  FeatureFlag,
  PASSWORD_REPLACEMENT,
  AIConfigType,
  VectorDbProvider,
} from "@budibase/types"
import { context, docIds } from "@budibase/backend-core"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

jest.mock("../../../../sdk/workspace/ai/vectorDb/pgVectorDb", () => {
  const actual = jest.requireActual(
    "../../../../sdk/workspace/ai/vectorDb/pgVectorDb"
  )
  return {
    ...actual,
    validatePgVectorDbConfig: jest.fn().mockResolvedValue(undefined),
  }
})

describe("vector db configs", () => {
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

  const vectorDbRequest = {
    name: "Primary Vector DB",
    provider: VectorDbProvider.PGVECTOR,
    host: "localhost",
    port: 5432,
    database: "budibase",
    user: "bb_user",
    password: "secret",
  }

  beforeEach(async () => {
    await config.newTenant()
  })

  it("creates and lists vector db configs", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.vectorDb.create(vectorDbRequest)
      expect(created._id).toBeDefined()
      expect(created.password).toBe(PASSWORD_REPLACEMENT)

      const configs = await config.api.vectorDb.fetch()
      expect(configs).toHaveLength(1)
      expect(configs[0].name).toBe(vectorDbRequest.name)
      expect(configs[0].password).toBe(PASSWORD_REPLACEMENT)
    })
  })

  it("updates and deletes vector db configs", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.vectorDb.create(vectorDbRequest)

      const updated = await config.api.vectorDb.update({
        ...created,
        name: "Updated Vector DB",
        password: PASSWORD_REPLACEMENT,
      })
      expect(updated.name).toBe("Updated Vector DB")
      expect(updated.password).toBe(PASSWORD_REPLACEMENT)

      const { deleted } = await config.api.vectorDb.remove(created._id!)
      expect(deleted).toBe(true)

      const configs = await config.api.vectorDb.fetch()
      expect(configs).toHaveLength(0)
    })
  })

  it("rejects deleting a vector db used by a knowledge base", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.vectorDb.create(vectorDbRequest)
      const embeddingModelId = docIds.generateAIConfigID("embedding_test")

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const db = context.getWorkspaceDB()
        await db.put({
          _id: embeddingModelId,
          name: "Embeddings",
          provider: "OpenAI",
          credentialsFields: {},
          model: "text-embedding-3-small",
          liteLLMModelId: "embedding-model",
          configType: AIConfigType.EMBEDDINGS,
        })
      })

      await config.api.knowledgeBase.create({
        name: "Support Docs",
        embeddingModel: embeddingModelId,
        vectorDb: created._id!,
      })

      await config.api.vectorDb.remove(created._id!, { status: 400 })

      const configs = await config.api.vectorDb.fetch()
      expect(configs).toHaveLength(1)
    })
  })

  it("rejects unsupported providers", async () => {
    await withRagEnabled(async () => {
      await config.api.vectorDb.create(
        {
          ...vectorDbRequest,
          provider: "pinecone" as VectorDbProvider,
        },
        { status: 400 }
      )
    })
  })

  it("returns 403 when RAG is disabled", async () => {
    await withRagDisabled(async () => {
      await config.api.vectorDb.fetch({ status: 403 })
      await config.api.vectorDb.create(vectorDbRequest, { status: 403 })
      await config.api.vectorDb.update(
        {
          _id: "vectordb_test",
          _rev: "1-test",
          ...vectorDbRequest,
        },
        { status: 403 }
      )
      await config.api.vectorDb.remove("vectordb_test", { status: 403 })
    })
  })
})
