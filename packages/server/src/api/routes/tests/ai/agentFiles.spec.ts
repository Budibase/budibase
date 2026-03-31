import nock from "nock"
import { features } from "@budibase/backend-core"
import { utils } from "@budibase/backend-core/tests"
import { FeatureFlag, KnowledgeBaseFileStatus } from "@budibase/types"
import environment, { setEnv } from "../../../../environment"
import { getQueue } from "../../../../sdk/workspace/ai/rag/queue"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

describe("agent files", () => {
  const config = new TestConfiguration()
  let cleanup: ReturnType<typeof setEnv> | undefined

  const withRagEnabled = async <T>(f: () => Promise<T>) => {
    return await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.AI_RAG]: true },
      f
    )
  }

  beforeAll(() => {
    cleanup = setEnv({ GEMINI_API_KEY: "test-gemini-key" })
  })

  afterAll(() => {
    config.end()
    cleanup?.()
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

  const mockAutoKnowledgeBaseCreate = () => {
    mockLiteLLMProviders()
    mockLiteLLMModelCostMap()

    return nock(environment.LITELLM_URL)
      .post("/team/new")
      .reply(200, { team_id: "team-2" })
      .post("/key/generate")
      .reply(200, { token_id: "embed-key-2", key: "embed-secret-2" })
      .post("/v1/vector_stores")
      .reply(200, { id: "vector-store-1" })
      .post("/key/update")
      .reply(200, { status: "success" })
  }

  const mockGeminiIngest = (fileId: string) =>
    nock(environment.LITELLM_URL)
      .post("/v1/rag/ingest")
      .reply(200, { file_id: fileId })

  const mockGeminiFileDelete = (vectorStoreId: string, fileId: string) =>
    nock(environment.LITELLM_URL)
      .delete(
        `/v1/vector_stores/${encodeURIComponent(vectorStoreId)}/files/${encodeURIComponent(fileId)}`
      )
      .reply(200, { deleted: true })

  it("uploads and lists files attached to an agent", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.agent.create({
        name: "Support Agent",
        aiconfig: "default",
      })

      const autoKbScope = mockAutoKnowledgeBaseCreate()
      const ingestScope = mockGeminiIngest("gemini-file-1")

      const upload = await config.api.agent.uploadFile(created._id!, {
        file: fileBuffer,
        name: "notes.txt",
      })
      expect(upload.file.status).toBe(KnowledgeBaseFileStatus.PROCESSING)

      await utils.queue.processMessages(getQueue().getBullQueue())
      expect(ingestScope.isDone()).toBe(true)
      expect(autoKbScope.isDone()).toBe(true)

      const { files } = await config.api.agent.fetchFiles(created._id!)
      expect(files).toHaveLength(1)
      expect(files[0].status).toBe(KnowledgeBaseFileStatus.READY)
      expect(files[0].filename).toBe("notes.txt")

      const refreshed = await config.api.agent.fetch()
      const saved = refreshed.agents.find(agent => agent._id === created._id)
      expect(saved?.knowledgeBases?.length).toBe(1)
    })
  })

  it("deletes an uploaded agent file", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.agent.create({
        name: "Support Agent",
        aiconfig: "default",
      })

      mockAutoKnowledgeBaseCreate()
      const ingestScope = mockGeminiIngest("gemini-file-2")
      const deleteScope = mockGeminiFileDelete(
        "vector-store-1",
        "gemini-file-2"
      )

      const upload = await config.api.agent.uploadFile(created._id!, {
        file: fileBuffer,
        name: "docs.txt",
      })

      await utils.queue.processMessages(getQueue().getBullQueue())
      expect(ingestScope.isDone()).toBe(true)

      const response = await config.api.agent.removeFile(
        created._id!,
        upload.file._id!
      )
      expect(response.deleted).toBe(true)
      expect(deleteScope.isDone()).toBe(true)

      const { files } = await config.api.agent.fetchFiles(created._id!)
      expect(files).toHaveLength(0)
    })
  })
})
