import {
  AgentFileStatus,
  AIConfigType,
  VectorDbProvider,
} from "@budibase/types"
import nock from "nock"
import environment from "../../../../environment"
import * as ragSdk from "../../../../sdk/workspace/ai/rag/files"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

jest.mock("../../../../sdk/workspace/ai/rag/files", () => {
  return {
    ingestAgentFile: jest.fn(),
    deleteAgentFileChunks: jest.fn(),
  }
})

describe("agent files", () => {
  const config = new TestConfiguration()
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

  afterAll(() => {
    config.end()
  })

  const fileBuffer = Buffer.from("Hello from Budibase")

  const createAgentWithRag = async () => {
    mockLiteLLMProviders()
    const embeddingValidationScope = nock(environment.LITELLM_URL)
      .post("/v1/embeddings")
      .reply(200, { data: [] })

    const liteLLMScope = nock(environment.LITELLM_URL)
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
      liteLLMModelId: "test",
      configType: AIConfigType.EMBEDDINGS,
    })
    const vectorDb = await config.api.vectorDb.create({
      name: "Agent Vector DB",
      provider: VectorDbProvider.PGVECTOR,
      host: "localhost",
      port: 5432,
      database: "budibase",
      user: "bb_user",
      password: "secret",
    })
    expect(liteLLMScope.isDone()).toBe(true)
    expect(embeddingValidationScope.isDone()).toBe(true)

    const agent = await config.api.agent.create({
      name: "Support Agent",
      aiconfig: "default",
      description: "Support",
      promptInstructions: "Be helpful",
      embeddingModel: embeddings._id!,
      vectorDb: vectorDb._id!,
      ragMinDistance: 0.6,
      ragTopK: 3,
    })
    return { agent, vectorDb }
  }

  beforeEach(async () => {
    await config.newTenant()
    jest.restoreAllMocks()
    nock.cleanAll()
  })

  it("uploads and lists agent files", async () => {
    const ingestSpy = ragSdk.ingestAgentFile as jest.MockedFunction<
      typeof ragSdk.ingestAgentFile
    >
    ingestSpy.mockResolvedValue({ inserted: 1, total: 2 })

    const { agent } = await createAgentWithRag()

    const upload = await config.api.agentFiles.upload(agent._id!, {
      file: fileBuffer,
      name: "notes.txt",
    })

    expect(upload.file.status).toBe(AgentFileStatus.READY)
    expect(upload.file.chunkCount).toBe(2)
    expect(upload.file.filename).toBe("notes.txt")
    expect(ingestSpy).toHaveBeenCalled()

    const { files } = await config.api.agentFiles.fetch(agent._id!)
    expect(files).toHaveLength(1)
    expect(files[0]._id).toBe(upload.file._id)
  })

  it("deletes agent files (but not the embeddings)", async () => {
    const ingestSpy = ragSdk.ingestAgentFile as jest.MockedFunction<
      typeof ragSdk.ingestAgentFile
    >
    ingestSpy.mockResolvedValue({ inserted: 1, total: 1 })

    const { agent } = await createAgentWithRag()

    const upload = await config.api.agentFiles.upload(agent._id!, {
      file: fileBuffer,
      name: "docs.txt",
    })
    await config.publish()

    const response = await config.api.agentFiles.remove(
      agent._id!,
      upload.file._id!
    )
    expect(response.deleted).toBe(true)

    const { files } = await config.api.agentFiles.fetch(agent._id!)
    expect(files).toHaveLength(0)

    const deleteAgentFileChunksSpy =
      ragSdk.deleteAgentFileChunks as jest.MockedFunction<
        typeof ragSdk.deleteAgentFileChunks
      >
    expect(deleteAgentFileChunksSpy).not.toHaveBeenCalled()
  })

  it("hard deletes agent files that were never in prod", async () => {
    const ingestSpy = ragSdk.ingestAgentFile as jest.MockedFunction<
      typeof ragSdk.ingestAgentFile
    >
    ingestSpy.mockResolvedValue({ inserted: 1, total: 1 })

    const { agent } = await createAgentWithRag()

    const upload = await config.api.agentFiles.upload(agent._id!, {
      file: fileBuffer,
      name: "docs.txt",
    })

    const response = await config.api.agentFiles.remove(
      agent._id!,
      upload.file._id!
    )
    expect(response.deleted).toBe(true)

    const { files } = await config.api.agentFiles.fetch(agent._id!)
    expect(files).toHaveLength(0)

    const deleteAgentFileChunksSpy =
      ragSdk.deleteAgentFileChunks as jest.MockedFunction<
        typeof ragSdk.deleteAgentFileChunks
      >
    expect(deleteAgentFileChunksSpy).toHaveBeenCalledTimes(1)
    expect(deleteAgentFileChunksSpy).toHaveBeenCalledWith(
      expect.objectContaining({ _id: agent._id }),
      [upload.file._id]
    )
  })
})
