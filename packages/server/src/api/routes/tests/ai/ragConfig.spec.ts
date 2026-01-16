import { AIConfigType } from "@budibase/types"
import nock from "nock"
import environment from "../../../../environment"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

describe("RAG configs", () => {
  const config = new TestConfiguration()

  afterAll(() => {
    config.end()
  })

  const ragRequest = {
    name: "Default RAG",
    embeddingModel: "",
    vectorDb: "",
    ragMinDistance: 0.7,
    ragTopK: 4,
  }

  const createRagDependencies = async () => {
    const embeddingValidationScope = nock("https://example.com")
      .post("/v1/embeddings")
      .reply(200, { data: [] })

    const liteLLMScope = nock(environment.LITELLM_URL)
      .post("/key/generate")
      .reply(200, { token_id: "embed-key-1", key: "embed-secret-1" })
      .post("/model/new")
      .reply(200, { model_id: "embed-model-1" })
      .post("/key/update")
      .reply(200, { status: "success" })

    const embeddings = await config.api.ai.createConfig({
      name: "Embeddings",
      provider: "openai",
      baseUrl: "https://example.com",
      model: "text-embedding-3-small",
      apiKey: "test",
      liteLLMModelId: "test",
      isDefault: false,
      configType: AIConfigType.EMBEDDINGS,
    })
    const vectorDb = await config.api.vectorDb.create({
      name: "Vector DB",
      provider: "pgvector",
      host: "127.0.0.1",
      port: 5432,
      database: "rag",
      user: "user",
      password: "pass",
    })
    expect(liteLLMScope.isDone()).toBe(true)
    expect(embeddingValidationScope.isDone()).toBe(true)
    return { embeddings, vectorDb }
  }

  beforeEach(async () => {
    await config.newTenant()
    nock.cleanAll()
  })

  it("should create and fetch rag configs", async () => {
    const { embeddings, vectorDb } = await createRagDependencies()
    await config.api.ragConfig.create({
      ...ragRequest,
      embeddingModel: embeddings._id!,
      vectorDb: vectorDb._id!,
    })

    const configs = await config.api.ragConfig.fetch()
    expect(configs.length).toBe(1)
    expect(configs[0].name).toBe(ragRequest.name)
  })

  it("should update rag configs", async () => {
    const { embeddings, vectorDb } = await createRagDependencies()
    const created = await config.api.ragConfig.create({
      ...ragRequest,
      embeddingModel: embeddings._id!,
      vectorDb: vectorDb._id!,
    })

    const updated = await config.api.ragConfig.update({
      ...created,
      name: "Updated RAG",
    })

    expect(updated.name).toBe("Updated RAG")
  })

  it("should delete rag configs", async () => {
    const { embeddings, vectorDb } = await createRagDependencies()
    const created = await config.api.ragConfig.create({
      ...ragRequest,
      embeddingModel: embeddings._id!,
      vectorDb: vectorDb._id!,
    })

    const { deleted } = await config.api.ragConfig.remove(created._id!)
    expect(deleted).toBe(true)

    const configs = await config.api.ragConfig.fetch()
    expect(configs.length).toBe(0)
  })
})
