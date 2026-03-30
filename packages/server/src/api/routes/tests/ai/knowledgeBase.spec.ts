import { features } from "@budibase/backend-core"
import { FeatureFlag, KnowledgeBaseType } from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { syncKeyVectorStores } from "../../../../sdk/workspace/ai/configs/litellm"

jest.mock("../../../../sdk/workspace/ai/knowledgeBase/geminiFileStore", () => {
  const actual = jest.requireActual(
    "../../../../sdk/workspace/ai/knowledgeBase/geminiFileStore"
  )
  return {
    ...actual,
    createGeminiFileStore: jest.fn().mockResolvedValue("gemini_store_test"),
  }
})

jest.mock("../../../../sdk/workspace/ai/configs/litellm", () => {
  const actual = jest.requireActual(
    "../../../../sdk/workspace/ai/configs/litellm"
  )
  return {
    ...actual,
    syncKeyVectorStores: jest.fn().mockResolvedValue(undefined),
  }
})

describe("knowledge base configs", () => {
  const config = new TestConfiguration()
  const mockSyncKeyVectorStores = syncKeyVectorStores as jest.MockedFunction<
    typeof syncKeyVectorStores
  >

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
    jest.clearAllMocks()
    mockSyncKeyVectorStores.mockResolvedValue(undefined)
    await config.newTenant()
  })

  describe("create", () => {
    it("creates a Gemini knowledge base", async () => {
      await withRagEnabled(async () => {
        const created = await config.api.knowledgeBase.create({
          name: "Support Docs",
          type: KnowledgeBaseType.GEMINI,
        })

        expect(created._id).toBeDefined()
        expect(created.name).toBe("Support Docs")
        expect(created.type).toBe(KnowledgeBaseType.GEMINI)
        expect(created.config.googleFileStoreId).toBeTruthy()
        expect(mockSyncKeyVectorStores).toHaveBeenCalledTimes(1)
      })
    })

    it("rejects missing fields", async () => {
      await withRagEnabled(async () => {
        await config.api.knowledgeBase.create(
          {
            name: "",
            type: KnowledgeBaseType.GEMINI,
          },
          { status: 400 }
        )
      })
    })

    it("rejects invalid knowledge base type", async () => {
      await withRagEnabled(async () => {
        await config.api.knowledgeBase.create(
          {
            name: "Invalid type",
            type: "local" as KnowledgeBaseType,
          },
          { status: 400 }
        )
      })
    })

    it("rejects config payload for Gemini knowledge bases", async () => {
      await withRagEnabled(async () => {
        await config.api.knowledgeBase.create(
          {
            name: "Support Docs",
            type: KnowledgeBaseType.GEMINI,
            config: {
              googleFileStoreId: "should-not-be-accepted",
            },
          } as any,
          { status: 400 }
        )
      })
    })

    it("rejects duplicate knowledge base names", async () => {
      await withRagEnabled(async () => {
        await config.api.knowledgeBase.create({
          name: "Support Docs",
          type: KnowledgeBaseType.GEMINI,
        })

        await config.api.knowledgeBase.create(
          {
            name: " support docs ",
            type: KnowledgeBaseType.GEMINI,
          },
          { status: 400 }
        )
      })
    })
  })

  describe("fetch", () => {
    it("lists knowledge bases", async () => {
      await withRagEnabled(async () => {
        await config.api.knowledgeBase.create({
          name: "Support Docs",
          type: KnowledgeBaseType.GEMINI,
        })

        const knowledgeBases = await config.api.knowledgeBase.fetch()
        expect(knowledgeBases).toHaveLength(1)
        expect(knowledgeBases[0].name).toBe("Support Docs")
        expect(knowledgeBases[0].type).toBe(KnowledgeBaseType.GEMINI)
        expect(knowledgeBases[0].config.googleFileStoreId).toBeTruthy()
      })
    })
  })

  describe("update", () => {
    it("updates knowledge bases", async () => {
      await withRagEnabled(async () => {
        const created = await config.api.knowledgeBase.create({
          name: "Support Docs",
          type: KnowledgeBaseType.GEMINI,
        })
        mockSyncKeyVectorStores.mockClear()

        const updated = await config.api.knowledgeBase.update({
          ...created,
          name: "Updated Knowledge Base",
          type: KnowledgeBaseType.GEMINI,
        })

        expect(updated.name).toBe("Updated Knowledge Base")
        expect(updated.type).toBe(KnowledgeBaseType.GEMINI)
        expect(updated.config.googleFileStoreId).toBe(
          created.config.googleFileStoreId
        )
        expect(mockSyncKeyVectorStores).not.toHaveBeenCalled()
      })
    })

    it("rejects duplicate names when updating", async () => {
      await withRagEnabled(async () => {
        await config.api.knowledgeBase.create({
          name: "Support Docs",
          type: KnowledgeBaseType.GEMINI,
        })
        const created = await config.api.knowledgeBase.create({
          name: "HR Policies",
          type: KnowledgeBaseType.GEMINI,
        })

        await config.api.knowledgeBase.update(
          {
            ...created,
            type: KnowledgeBaseType.GEMINI,
            name: " support docs ",
          },
          { status: 400 }
        )
      })
    })

    it("rejects invalid type on update", async () => {
      await withRagEnabled(async () => {
        const created = await config.api.knowledgeBase.create({
          name: "Support Docs",
          type: KnowledgeBaseType.GEMINI,
        })

        await config.api.knowledgeBase.update(
          {
            ...created,
            type: "local" as KnowledgeBaseType,
          },
          { status: 400 }
        )
      })
    })

    it("preserves existing Gemini file store id on update", async () => {
      await withRagEnabled(async () => {
        const created = await config.api.knowledgeBase.create({
          name: "Support Docs",
          type: KnowledgeBaseType.GEMINI,
        })

        const updated = await config.api.knowledgeBase.update({
          ...created,
          name: "Support Docs v2",
          type: KnowledgeBaseType.GEMINI,
          config: {
            googleFileStoreId: "tampered-file-store",
          },
        } as any)

        expect(updated.config.googleFileStoreId).toBe(
          created.config.googleFileStoreId
        )
      })
    })
  })

  describe("delete", () => {
    it("deletes knowledge bases", async () => {
      await withRagEnabled(async () => {
        const created = await config.api.knowledgeBase.create({
          name: "Support Docs",
          type: KnowledgeBaseType.GEMINI,
        })
        mockSyncKeyVectorStores.mockClear()

        const { deleted } = await config.api.knowledgeBase.remove(created._id!)
        expect(deleted).toBe(true)
        expect(mockSyncKeyVectorStores).toHaveBeenCalledTimes(1)

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
          type: KnowledgeBaseType.GEMINI,
        },
        { status: 403 }
      )
      await config.api.knowledgeBase.update(
        {
          _id: "kb_test",
          _rev: "1-test",
          name: "Support Docs",
          type: KnowledgeBaseType.GEMINI,
        },
        { status: 403 }
      )
      await config.api.knowledgeBase.remove("kb_test", { status: 403 })
    })
  })
})
