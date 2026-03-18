import nock from "nock"
import { features } from "@budibase/backend-core"
import { utils } from "@budibase/backend-core/tests"
import {
  AIConfigType,
  FeatureFlag,
  KnowledgeBaseFileStatus,
  VectorDbProvider,
} from "@budibase/types"
import environment from "../../../../environment"
import * as ragSdk from "../../../../sdk/workspace/ai/rag"
import { getQueue } from "../../../../sdk/workspace/ai/rag/queue"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

jest.mock("../../../../sdk/workspace/ai/rag/files", () => {
  return {
    ingestKnowledgeBaseFile: jest.fn(),
    deleteKnowledgeBaseFileChunks: jest.fn(),
  }
})

jest.mock("../../../../sdk/workspace/ai/vectorDb/pgVectorDb", () => {
  const actual = jest.requireActual(
    "../../../../sdk/workspace/ai/vectorDb/pgVectorDb"
  )
  return {
    ...actual,
    validatePgVectorDbConfig: jest.fn().mockResolvedValue(undefined),
  }
})

describe("knowledge base files", () => {
  const config = new TestConfiguration()

  const withRagEnabled = async <T>(f: () => Promise<T>) => {
    return await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.AI_RAG]: true },
      f
    )
  }

  afterAll(() => {
    config.end()
  })

  beforeEach(async () => {
    await config.newTenant()
    jest.restoreAllMocks()
    nock.cleanAll()
  })

  const fileBuffer = Buffer.from("Hello from Budibase")

  const mockLiteLLMProviders = () =>
    nock(environment.LITELLM_URL)
      .persist()
      .get("/public/providers/fields")
      .reply(200, [
        {
          provider: "OpenAI",
          provider_display_name: "OpenAI",
          litellm_provider: "openai",
          credential_fields: [
            { key: "api_key", label: "API Key", field_type: "password" },
            { key: "api_base", label: "Base URL", field_type: "text" },
          ],
        },
      ])

  const mockLiteLLMModelCostMap = () =>
    nock(environment.LITELLM_URL)
      .persist()
      .get("/public/litellm_model_cost_map")
      .reply(200, {
        "text-embedding-3-small": {
          litellm_provider: "openai",
          mode: "embedding",
        },
      })

  const createKnowledgeBase = async () => {
    mockLiteLLMProviders()
    mockLiteLLMModelCostMap()
    const embeddingValidationScope = nock(environment.LITELLM_URL)
      .post("/v1/embeddings")
      .reply(200, { data: [] })

    const liteLLMScope = nock(environment.LITELLM_URL)
      .post("/team/new")
      .reply(200, { team_id: "team-2" })
      .post("/key/generate")
      .reply(200, { token_id: "embed-key-2", key: "embed-secret-2" })
      .post("/model/new")
      .reply(200, { model_id: "embed-validation-2" })
      .post("/model/delete")
      .reply(200, { status: "success" })
      .post("/model/new")
      .reply(200, { model_id: "embed-model-2" })
      .post("/key/update")
      .reply(200, { status: "success" })

    const embeddings = await config.api.ai.createConfig({
      name: "Embeddings",
      provider: "OpenAI",
      model: "text-embedding-3-small",
      credentialsFields: {
        api_key: "test",
        api_base: "https://example.com",
      },
      configType: AIConfigType.EMBEDDINGS,
    })
    const vectorDb = await config.api.vectorDb.create({
      name: "Knowledge Base Vector DB",
      provider: VectorDbProvider.PGVECTOR,
      host: "localhost",
      port: 5432,
      database: "budibase",
      user: "bb_user",
      password: "secret",
    })

    expect(liteLLMScope.isDone()).toBe(true)
    expect(embeddingValidationScope.isDone()).toBe(true)

    return await config.api.knowledgeBase.create({
      name: "Support KB",
      embeddingModel: embeddings._id!,
      vectorDb: vectorDb._id!,
    })
  }

  it("uploads and lists knowledge base files", async () => {
    await withRagEnabled(async () => {
      const ingestSpy = ragSdk.ingestKnowledgeBaseFile as jest.MockedFunction<
        typeof ragSdk.ingestKnowledgeBaseFile
      >
      ingestSpy.mockResolvedValue({ inserted: 1, total: 2 })

      const knowledgeBase = await createKnowledgeBase()

      const upload = await config.api.knowledgeBaseFiles.upload(
        knowledgeBase._id!,
        {
          file: fileBuffer,
          name: "notes.txt",
        }
      )

      expect(upload.file.status).toBe(KnowledgeBaseFileStatus.PROCESSING)
      expect(upload.file.filename).toBe("notes.txt")

      await utils.queue.processMessages(getQueue().getBullQueue())

      expect(ingestSpy).toHaveBeenCalled()
      const { files } = await config.api.knowledgeBaseFiles.fetch(
        knowledgeBase._id!
      )
      expect(files).toHaveLength(1)
      expect(files[0].status).toBe(KnowledgeBaseFileStatus.READY)
      expect(files[0].chunkCount).toBe(2)
    })
  })

  it("deletes knowledge base files", async () => {
    await withRagEnabled(async () => {
      const ingestSpy = ragSdk.ingestKnowledgeBaseFile as jest.MockedFunction<
        typeof ragSdk.ingestKnowledgeBaseFile
      >
      ingestSpy.mockResolvedValue({ inserted: 1, total: 1 })

      const knowledgeBase = await createKnowledgeBase()
      const upload = await config.api.knowledgeBaseFiles.upload(
        knowledgeBase._id!,
        {
          file: fileBuffer,
          name: "docs.txt",
        }
      )

      await utils.queue.processMessages(getQueue().getBullQueue())

      const response = await config.api.knowledgeBaseFiles.remove(
        knowledgeBase._id!,
        upload.file._id!
      )
      expect(response.deleted).toBe(true)

      const { files } = await config.api.knowledgeBaseFiles.fetch(
        knowledgeBase._id!
      )
      expect(files).toHaveLength(0)
    })
  })
})
