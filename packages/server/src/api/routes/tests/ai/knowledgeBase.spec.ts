import { context, docIds, features } from "@budibase/backend-core"
import {
  AIConfigType,
  FeatureFlag,
  KnowledgeBaseFileStatus,
  VectorDbProvider,
} from "@budibase/types"
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

  const buildDependencies = async () => {
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

  describe("create", () => {
    it("creates a knowledge base", async () => {
      await withRagEnabled(async () => {
        const { embeddingModelId, vectorDb } = await buildDependencies()

        const created = await config.api.knowledgeBase.create({
          name: "Support Docs",
          embeddingModel: embeddingModelId,
          vectorDb: vectorDb._id!,
        })

        expect(created._id).toBeDefined()
        expect(created.name).toBe("Support Docs")
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

    it("rejects unknown vector db", async () => {
      await withRagEnabled(async () => {
        const { embeddingModelId } = await buildDependencies()
        await config.api.knowledgeBase.create(
          {
            name: "Invalid Vector DB",
            embeddingModel: embeddingModelId,
            vectorDb: "vectordb_missing",
          },
          { status: 404 }
        )
      })
    })

    it("rejects unknown embedding model", async () => {
      await withRagEnabled(async () => {
        const { vectorDb } = await buildDependencies()
        await config.api.knowledgeBase.create(
          {
            name: "Invalid Embedding",
            embeddingModel: "aiconfig_missing",
            vectorDb: vectorDb._id!,
          },
          { status: 404 }
        )
      })
    })

    it("rejects non-embedding model configs", async () => {
      await withRagEnabled(async () => {
        const completionsModelId = docIds.generateAIConfigID("completions_test")
        await config.doInContext(config.getDevWorkspaceId(), async () => {
          const db = context.getWorkspaceDB()
          await db.put({
            _id: completionsModelId,
            name: "Completions",
            provider: "OpenAI",
            credentialsFields: {},
            model: "gpt-4o-mini",
            liteLLMModelId: "completions-model",
            configType: AIConfigType.COMPLETIONS,
          })
        })

        const vectorDb = await config.api.vectorDb.create({
          name: "Primary Vector DB",
          provider: VectorDbProvider.PGVECTOR,
          host: "localhost",
          port: 5432,
          database: "budibase",
          user: "bb_user",
          password: "secret",
        })

        await config.api.knowledgeBase.create(
          {
            name: "Invalid Embedding Type",
            embeddingModel: completionsModelId,
            vectorDb: vectorDb._id!,
          },
          { status: 400 }
        )
      })
    })

    it("rejects non-vector db configs", async () => {
      await withRagEnabled(async () => {
        const { embeddingModelId } = await buildDependencies()
        const completionsModelId = docIds.generateAIConfigID(
          "vectordb_type_mismatch"
        )
        await config.doInContext(config.getDevWorkspaceId(), async () => {
          const db = context.getWorkspaceDB()
          await db.put({
            _id: completionsModelId,
            name: "Completions",
            provider: "OpenAI",
            credentialsFields: {},
            model: "gpt-4o-mini",
            liteLLMModelId: "completions-model",
            configType: AIConfigType.COMPLETIONS,
          })
        })

        await config.api.knowledgeBase.create(
          {
            name: "Invalid Vector DB Type",
            embeddingModel: embeddingModelId,
            vectorDb: completionsModelId,
          },
          { status: 400 }
        )
      })
    })

    it("rejects duplicate knowledge base names", async () => {
      await withRagEnabled(async () => {
        const { embeddingModelId, vectorDb } = await buildDependencies()

        await config.api.knowledgeBase.create({
          name: "Support Docs",
          embeddingModel: embeddingModelId,
          vectorDb: vectorDb._id!,
        })

        await config.api.knowledgeBase.create(
          {
            name: " support docs ",
            embeddingModel: embeddingModelId,
            vectorDb: vectorDb._id!,
          },
          { status: 400 }
        )
      })
    })
  })

  describe("fetch", () => {
    it("lists knowledge bases", async () => {
      await withRagEnabled(async () => {
        const { embeddingModelId, vectorDb } = await buildDependencies()
        await config.api.knowledgeBase.create({
          name: "Support Docs",
          embeddingModel: embeddingModelId,
          vectorDb: vectorDb._id!,
        })

        const knowledgeBases = await config.api.knowledgeBase.fetch()
        expect(knowledgeBases).toHaveLength(1)
        expect(knowledgeBases[0].embeddingModel).toBe(embeddingModelId)
        expect(knowledgeBases[0].vectorDb).toBe(vectorDb._id)
      })
    })
  })

  describe("update", () => {
    it("updates knowledge bases", async () => {
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
      })
    })

    it("rejects duplicate names when updating", async () => {
      await withRagEnabled(async () => {
        const { embeddingModelId, vectorDb } = await buildDependencies()
        await config.api.knowledgeBase.create({
          name: "Support Docs",
          embeddingModel: embeddingModelId,
          vectorDb: vectorDb._id!,
        })
        const created = await config.api.knowledgeBase.create({
          name: "HR Policies",
          embeddingModel: embeddingModelId,
          vectorDb: vectorDb._id!,
        })

        await config.api.knowledgeBase.update(
          {
            ...created,
            name: " support docs ",
          },
          { status: 400 }
        )
      })
    })

    it("rejects changing embedding model or vector db", async () => {
      await withRagEnabled(async () => {
        const { embeddingModelId, vectorDb } = await buildDependencies()
        const created = await config.api.knowledgeBase.create({
          name: "Support Docs",
          embeddingModel: embeddingModelId,
          vectorDb: vectorDb._id!,
        })

        const otherVectorDb = await config.api.vectorDb.create({
          name: "Secondary Vector DB",
          provider: VectorDbProvider.PGVECTOR,
          host: "localhost",
          port: 5432,
          database: "budibase",
          user: "bb_user",
          password: "secret",
        })

        await config.doInContext(config.getDevWorkspaceId(), async () => {
          const db = context.getWorkspaceDB()
          await db.put({
            _id: docIds.generateKnowledgeBaseFileID(created._id!),
            knowledgeBaseId: created._id!,
            filename: "support.txt",
            mimetype: "text/plain",
            size: 128,
            objectStoreKey: "test/object-key",
            ragSourceId: docIds.generateKnowledgeBaseFileID(created._id!),
            status: KnowledgeBaseFileStatus.READY,
            chunkCount: 1,
            uploadedBy: "user_123",
          })
        })

        await config.api.knowledgeBase.update(
          {
            ...created,
            vectorDb: otherVectorDb._id!,
          },
          { status: 400 }
        )
      })
    })

    it("allows changing embedding model or vector db before files are added", async () => {
      await withRagEnabled(async () => {
        const { embeddingModelId, vectorDb } = await buildDependencies()
        const created = await config.api.knowledgeBase.create({
          name: "Support Docs",
          embeddingModel: embeddingModelId,
          vectorDb: vectorDb._id!,
        })

        const otherVectorDb = await config.api.vectorDb.create({
          name: "Secondary Vector DB",
          provider: VectorDbProvider.PGVECTOR,
          host: "localhost",
          port: 5432,
          database: "budibase",
          user: "bb_user",
          password: "secret",
        })

        const updated = await config.api.knowledgeBase.update({
          ...created,
          vectorDb: otherVectorDb._id!,
        })

        expect(updated.vectorDb).toBe(otherVectorDb._id)
      })
    })
  })

  describe("delete", () => {
    it("deletes knowledge bases", async () => {
      await withRagEnabled(async () => {
        const { embeddingModelId, vectorDb } = await buildDependencies()
        const created = await config.api.knowledgeBase.create({
          name: "Support Docs",
          embeddingModel: embeddingModelId,
          vectorDb: vectorDb._id!,
        })

        const { deleted } = await config.api.knowledgeBase.remove(created._id!)
        expect(deleted).toBe(true)

        const knowledgeBases = await config.api.knowledgeBase.fetch()
        expect(knowledgeBases).toHaveLength(0)
      })
    })
  })

  it("returns 403 when RAG is disabled", async () => {
    await withRagDisabled(async () => {
      await config.api.knowledgeBase.fetch({ status: 403 })
      await config.api.knowledgeBase.create(
        {
          name: "Support Docs",
          embeddingModel: "aiconfig_test",
          vectorDb: "vectordb_test",
        },
        { status: 403 }
      )
      await config.api.knowledgeBase.update(
        {
          _id: "kb_test",
          _rev: "1-test",
          name: "Support Docs",
          embeddingModel: "aiconfig_test",
          vectorDb: "vectordb_test",
        },
        { status: 403 }
      )
      await config.api.knowledgeBase.remove("kb_test", { status: 403 })
    })
  })
})
