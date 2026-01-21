import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import nock from "nock"
import { configs, setEnv } from "@budibase/backend-core"
import {
  ConfigType,
  CustomAIProviderConfig,
  PASSWORD_REPLACEMENT,
  WebSearchProvider,
  AIConfigType,
  CreateAIConfigRequest,
} from "@budibase/types"
import { context } from "@budibase/backend-core"
import environment from "../../../../environment"

type SetupFn = (
  config: TestConfiguration
) => Promise<() => Promise<void> | void>

function budibaseAI(): SetupFn {
  return async (config: TestConfiguration) => {
    await config.doInTenant(async () => {
      await configs.save({
        type: ConfigType.AI,
        config: {
          budibaseAI: {
            provider: "BudibaseAI",
            name: "Budibase AI",
            active: true,
            isDefault: true,
          },
        },
      })
    })

    return setEnv({ OPENAI_API_KEY: "test-key", SELF_HOSTED: false })
  }
}

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

describe("BudibaseAI", () => {
  const config = new TestConfiguration()
  let cleanup: () => void | Promise<void>
  beforeAll(async () => {
    await config.init()
    cleanup = await budibaseAI()(config)
  })

  afterAll(async () => {
    if ("then" in cleanup) {
      await cleanup()
    } else {
      cleanup()
    }
    config.end()
  })

  describe("custom provider configs", () => {
    const defaultRequest: CreateAIConfigRequest = {
      name: "Support Chat",
      provider: "OpenAI",
      model: "gpt-4o-mini",
      credentialsFields: {
        api_key: "sk-test-key",
        api_base: "https://api.openai.com",
      },
      liteLLMModelId: "",
      configType: AIConfigType.COMPLETIONS,
    }

    beforeEach(async () => {
      await config.newTenant()
      nock.cleanAll()

      mockLiteLLMProviders()
    })

    it("creates a custom config and sanitizes the API key", async () => {
      const liteLLMScope = nock(environment.LITELLM_URL)
        .post("/key/generate")
        .reply(200, { token_id: "key-1", key: "secret-1" })
        .post("/health/test_connection")
        .reply(200, { status: "success" })
        .post("/model/new")
        .reply(200, { model_id: "model-1" })
        .post("/key/update", body => {
          expect(body).toMatchObject({
            models: ["model-1"],
          })
          return true
        })
        .reply(200, { status: "success" })

      const created = await config.api.ai.createConfig({ ...defaultRequest })
      expect(created._id).toBeDefined()
      expect(created.liteLLMModelId).toBe("model-1")
      expect(created.credentialsFields.api_key).toBe(
        defaultRequest.credentialsFields?.api_key
      )
      expect(liteLLMScope.isDone()).toBe(true)

      const configsResponse = await config.api.ai.fetchConfigs()
      expect(configsResponse).toHaveLength(1)
      expect(configsResponse[0]._id).toBe(created._id)
      expect(configsResponse[0].credentialsFields.api_key).toBe(
        defaultRequest.credentialsFields?.api_key
      )
    })

    it("updates a custom config while preserving the stored API key", async () => {
      const creationScope = nock(environment.LITELLM_URL)
        .post("/key/generate")
        .reply(200, { token_id: "key-2", key: "secret-2" })
        .post("/health/test_connection")
        .reply(200, { status: "success" })
        .post("/model/new")
        .reply(200, { model_id: "model-2" })
        .post("/key/update")
        .reply(200, { status: "success" })

      const created = await config.api.ai.createConfig({ ...defaultRequest })
      expect(creationScope.isDone()).toBe(true)

      const updateScope = nock(environment.LITELLM_URL)
        .post("/health/test_connection")
        .reply(200, { status: "success" })
        .patch(`/model/${created.liteLLMModelId}/update`)
        .reply(200, { status: "success" })
        .post("/key/update")
        .reply(200, { status: "success" })

      const updated = await config.api.ai.updateConfig({
        ...created,
        name: "Updated Chat",
        model: "gpt-4o",
        credentialsFields: {
          ...created.credentialsFields,
          api_key: PASSWORD_REPLACEMENT,
        },
      })

      expect(updateScope.isDone()).toBe(true)
      expect(updated.name).toBe("Updated Chat")
      expect(updated.credentialsFields.api_key).toBe(
        defaultRequest.credentialsFields?.api_key
      )

      const storedConfig = await config.doInContext(
        config.getDevWorkspaceId(),
        async () => {
          return await context
            .getWorkspaceDB()
            .get<CustomAIProviderConfig>(created._id!)
        }
      )
      expect(storedConfig.credentialsFields.api_key).toBe(
        defaultRequest.credentialsFields?.api_key
      )

      const configsResponse = await config.api.ai.fetchConfigs()
      expect(configsResponse).toHaveLength(1)
      expect(configsResponse[0].name).toBe("Updated Chat")
      expect(configsResponse[0].credentialsFields.api_key).toBe(
        defaultRequest.credentialsFields?.api_key
      )
    })

    it("updates web search config without calling LiteLLM", async () => {
      const creationScope = nock(environment.LITELLM_URL)
        .post("/key/generate")
        .reply(200, { token_id: "key-ws-update", key: "secret-ws-update" })
        .post("/health/test_connection")
        .reply(200, { status: "success" })
        .post("/model/new")
        .reply(200, { model_id: "model-ws-update" })
        .post("/key/update")
        .reply(200, { status: "success" })

      const created = await config.api.ai.createConfig({
        ...defaultRequest,
        name: "WebSearch Update Config",
        webSearchConfig: {
          provider: WebSearchProvider.EXA,
          apiKey: "old-ws-key",
        },
      })
      expect(creationScope.isDone()).toBe(true)

      nock.cleanAll()
      nock(environment.LITELLM_URL).post(/.*/).reply(500)
      nock(environment.LITELLM_URL).patch(/.*/).reply(500)

      const newWebSearchApiKey = "new-ws-key"
      const updated = await config.api.ai.updateConfig({
        ...created,
        credentialsFields: {
          ...created.credentialsFields,
          api_key: PASSWORD_REPLACEMENT,
        },
        webSearchConfig: {
          provider: WebSearchProvider.EXA,
          apiKey: newWebSearchApiKey,
        },
      })

      expect(updated.webSearchConfig?.apiKey).toBe(PASSWORD_REPLACEMENT)

      const storedConfig = await config.doInContext(
        config.getDevWorkspaceId(),
        async () => {
          return await context
            .getWorkspaceDB()
            .tryGet<CustomAIProviderConfig>(created._id!)
        }
      )
      expect(storedConfig?.webSearchConfig?.apiKey).toBe(newWebSearchApiKey)
    })

    it("deletes a custom config and syncs LiteLLM models", async () => {
      const creationScope = nock(environment.LITELLM_URL)
        .post("/key/generate")
        .reply(200, { token_id: "key-3", key: "secret-3" })
        .post("/health/test_connection")
        .reply(200, { status: "success" })
        .post("/model/new")
        .reply(200, { model_id: "model-3" })
        .post("/key/update")
        .reply(200, { status: "success" })

      const created = await config.api.ai.createConfig({ ...defaultRequest })
      expect(creationScope.isDone()).toBe(true)

      const deleteScope = nock(environment.LITELLM_URL)
        .post("/key/update", body => {
          expect(body).toMatchObject({
            models: [],
          })
          return true
        })
        .reply(200, { status: "success" })

      const { deleted } = await config.api.ai.deleteConfig(created._id!)
      expect(deleted).toBe(true)
      expect(deleteScope.isDone()).toBe(true)

      const configsResponse = await config.api.ai.fetchConfigs()
      expect(configsResponse).toHaveLength(0)
    })

    it("validates configuration", async () => {
      const failingScope = nock(environment.LITELLM_URL)
        .post("/key/generate")
        .reply(200, { token_id: "key-4", key: "secret-4" })
        .post("/health/test_connection")
        .reply(200, {
          status: "error",
          result: {
            error: "Connection refused\nTraceback...",
          },
        })

      const errorResponse: any = await config.api.ai.createConfig(
        {
          ...defaultRequest,
          name: "Broken Config",
        },
        {
          status: 400,
        }
      )

      expect(failingScope.isDone()).toBe(true)
      expect(errorResponse.message).toContain("Error validating configuration")

      const configsResponse = await config.api.ai.fetchConfigs()
      expect(configsResponse).toHaveLength(0)
    })

    it("sanitizes web search config API key", async () => {
      const liteLLMScope = nock(environment.LITELLM_URL)
        .post("/key/generate")
        .reply(200, { token_id: "key-web", key: "secret-web" })
        .post("/health/test_connection")
        .reply(200, { status: "success" })
        .post("/model/new")
        .reply(200, { model_id: "model-web" })
        .post("/key/update")
        .reply(200, { status: "success" })

      const webSearchApiKey = "exa-secret-key-12345"
      const created = await config.api.ai.createConfig({
        ...defaultRequest,
        name: "WebSearch Config",
        webSearchConfig: {
          provider: WebSearchProvider.EXA,
          apiKey: webSearchApiKey,
        },
      })

      expect(liteLLMScope.isDone()).toBe(true)
      expect(created._id).toBeDefined()
      expect(created.webSearchConfig).toBeDefined()
      expect(created.webSearchConfig?.provider).toBe(WebSearchProvider.EXA)
      expect(created.webSearchConfig?.apiKey).toBe(PASSWORD_REPLACEMENT)

      const configsResponse = await config.api.ai.fetchConfigs()
      expect(configsResponse).toHaveLength(1)
      expect(configsResponse[0].webSearchConfig?.apiKey).toBe(
        PASSWORD_REPLACEMENT
      )

      const storedConfig = await config.doInContext(
        config.getDevWorkspaceId(),
        async () => {
          return await context
            .getWorkspaceDB()
            .tryGet<CustomAIProviderConfig>(created._id!)
        }
      )
      expect(storedConfig?.webSearchConfig?.apiKey).toBe(webSearchApiKey)
    })
  })

  describe("embedding provider configs", () => {
    const defaultEmbeddingRequest = {
      name: "Embeddings Config",
      provider: "OpenAI",
      model: "text-embedding-3-large",
      credentialsFields: {
        api_key: "sk-test-key",
        api_base: "https://api.openai.com",
      },
      liteLLMModelId: "",
      configType: AIConfigType.EMBEDDINGS,
    }

    beforeEach(async () => {
      await config.newTenant()
      nock.cleanAll()

      mockLiteLLMProviders()
    })

    it("creates an embedding config", async () => {
      const embeddingValidationScope = nock(environment.LITELLM_URL)
        .post("/v1/embeddings")
        .reply(200, { data: [] })

      const creationScope = nock(environment.LITELLM_URL)
        .post("/key/generate")
        .reply(200, { token_id: "embed-key-1", key: "embed-secret-1" })
        .post("/model/new")
        .reply(200, { model_id: "embed-validation-1" })
        .post("/model/delete")
        .reply(200, { status: "success" })
        .post("/model/new")
        .reply(200, { model_id: "embed-model-1" })
        .post("/key/update")
        .reply(200, { status: "success" })

      const created = await config.api.ai.createConfig({
        ...defaultEmbeddingRequest,
      })
      expect(created._id).toBeDefined()
      expect(created.liteLLMModelId).toBe("embed-model-1")
      expect(created.credentialsFields.api_key).toBe(
        defaultEmbeddingRequest.credentialsFields.api_key
      )
      expect(creationScope.isDone()).toBe(true)
      expect(embeddingValidationScope.isDone()).toBe(true)

      const configs = await config.api.ai.fetchConfigs()
      expect(
        configs.filter(c => c.configType === AIConfigType.EMBEDDINGS)
      ).toHaveLength(1)
    })

    it("updates an embedding config", async () => {
      const creationValidationScope = nock(environment.LITELLM_URL)
        .post("/v1/embeddings")
        .reply(200, { data: [] })

      const creationScope = nock(environment.LITELLM_URL)
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

      const created = await config.api.ai.createConfig({
        ...defaultEmbeddingRequest,
        name: "Semantic Search",
      })
      expect(creationScope.isDone()).toBe(true)
      expect(creationValidationScope.isDone()).toBe(true)

      const updateValidationScope = nock(environment.LITELLM_URL)
        .post("/v1/embeddings")
        .reply(200, { data: [] })

      const updateScope = nock(environment.LITELLM_URL)
        .post("/model/new")
        .reply(200, { model_id: "embed-validation-3" })
        .post("/model/delete")
        .reply(200, { status: "success" })
        .patch(`/model/${created.liteLLMModelId}/update`)
        .reply(200, { status: "success" })
        .post("/key/update")
        .reply(200, { status: "success" })

      const updated = await config.api.ai.updateConfig({
        ...created,
        name: "Updated Embeddings",
        model: "text-embedding-3-small",
      })
      expect(updateScope.isDone()).toBe(true)
      expect(updateValidationScope.isDone()).toBe(true)
      expect(updated.name).toBe("Updated Embeddings")
    })

    it("deletes an embedding config and syncs LiteLLM models", async () => {
      const creationValidationScope = nock(environment.LITELLM_URL)
        .post("/v1/embeddings")
        .reply(200, { data: [] })

      const creationScope = nock(environment.LITELLM_URL)
        .post("/key/generate")
        .reply(200, { token_id: "embed-key-3", key: "embed-secret-3" })
        .post("/model/new")
        .reply(200, { model_id: "embed-validation-4" })
        .post("/model/delete")
        .reply(200, { status: "success" })
        .post("/model/new")
        .reply(200, { model_id: "embed-model-3" })
        .post("/key/update")
        .reply(200, { status: "success" })

      const created = await config.api.ai.createConfig({
        ...defaultEmbeddingRequest,
      })
      expect(creationScope.isDone()).toBe(true)
      expect(creationValidationScope.isDone()).toBe(true)

      const deleteScope = nock(environment.LITELLM_URL)
        .post("/key/update", body => {
          expect(body).toMatchObject({ models: [] })
          return true
        })
        .reply(200, { status: "success" })

      const { deleted } = await config.api.ai.deleteConfig(created._id!)
      expect(deleted).toBe(true)
      expect(deleteScope.isDone()).toBe(true)

      const configsResponse = await config.api.ai.fetchConfigs()
      expect(
        configsResponse.filter(c => c.configType === AIConfigType.EMBEDDINGS)
      ).toHaveLength(0)
    })
  })
})
