import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import nock from "nock"
import { db, docIds, encryption } from "@budibase/backend-core"
import {
  CustomAIProviderConfig,
  BUDIBASE_AI_PROVIDER_ID,
  PASSWORD_REPLACEMENT,
  WebSearchProvider,
  AIConfigType,
  CreateAIConfigRequest,
  LiteLLMKeyConfig,
} from "@budibase/types"
import { context } from "@budibase/backend-core"
import environment from "../../../../environment"
import { licensing } from "@budibase/pro"

jest.mock("@budibase/pro", () => {
  const actual = jest.requireActual("@budibase/pro")
  return {
    ...actual,
    licensing: {
      ...actual.licensing,
      keys: {
        ...actual.licensing.keys,
        getLicenseKey: jest.fn(),
      },
    },
  }
})

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

const mockLiteLLMTeam = () =>
  nock(environment.LITELLM_URL)
    .persist()
    .post("/team/new")
    .reply(200, { team_id: "tenant-team-default" })

const passwordMatch = (plain: string, encoded: string) => {
  if (!encoded.startsWith("bbai_enc::")) {
    throw new Error("Encoded password not properly configured.")
  }

  const matches = encryption.compare(
    plain,
    encoded.substring("bbai_enc::".length)
  )
  return matches
}

describe("BudibaseAI", () => {
  const config = new TestConfiguration()
  beforeAll(async () => {
    await config.init()
  })

  afterAll(async () => {
    config.end()
  })

  async function getPersistedConfigAI(id: string | undefined) {
    const result = await db.doWithDB(config.getDevWorkspaceId(), db =>
      db.tryGet<CustomAIProviderConfig>(id)
    )
    if (!result) {
      throw new Error(`Config ${id} not found`)
    }
    return result
  }

  describe("custom provider configs", () => {
    const defaultRequest: CreateAIConfigRequest = {
      name: "Support Chat",
      provider: "OpenAI",
      model: "gpt-4o-mini",
      credentialsFields: {
        api_key: "sk-test-key",
        api_base: "https://api.openai.com",
      },
      configType: AIConfigType.COMPLETIONS,
    }

    beforeEach(async () => {
      await config.newTenant()
      nock.cleanAll()

      mockLiteLLMProviders()
      mockLiteLLMTeam()
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
      expect(created.credentialsFields.api_key).toBe(PASSWORD_REPLACEMENT)
      expect(liteLLMScope.isDone()).toBe(true)

      const configsResponse = await config.api.ai.fetchConfigs()
      expect(configsResponse).toHaveLength(1)
      expect(configsResponse[0]._id).toBe(created._id)
      expect(configsResponse[0].credentialsFields.api_key).toBe(
        PASSWORD_REPLACEMENT
      )

      const persistedConfig = await getPersistedConfigAI(created._id)
      expect(
        passwordMatch(
          defaultRequest.credentialsFields!.api_key,
          persistedConfig.credentialsFields!.api_key
        )
      ).toBeTrue()
    })

    it("sanitizes Budibase AI license key in API responses", async () => {
      const getLicenseKeyMock = licensing.keys
        .getLicenseKey as jest.MockedFunction<
        typeof licensing.keys.getLicenseKey
      >
      getLicenseKeyMock.mockResolvedValue("license-key-1")

      const liteLLMScope = nock(environment.LITELLM_URL)
        .post("/key/generate")
        .reply(200, { token_id: "key-bb-1", key: "secret-bb-1" })
        .post("/health/test_connection")
        .reply(200, { status: "success" })
        .post("/model/new")
        .reply(200, { model_id: "model-bb-1" })
        .post("/key/update")
        .reply(200, { status: "success" })

      const created = await config.api.ai.createConfig({
        name: "Budibase AI Config",
        provider: BUDIBASE_AI_PROVIDER_ID,
        model: "gpt-4o-mini",
        credentialsFields: {},
        configType: AIConfigType.COMPLETIONS,
      })

      expect(liteLLMScope.isDone()).toBe(true)
      expect(created.credentialsFields.api_key).toBe(PASSWORD_REPLACEMENT)
      const persistedConfig = await getPersistedConfigAI(created._id)
      expect(
        passwordMatch(
          "license-key-1",
          persistedConfig.credentialsFields.api_key
        )
      ).toBeTrue()

      const configsResponse = await config.api.ai.fetchConfigs()
      expect(configsResponse).toHaveLength(1)
      expect(configsResponse[0].credentialsFields.api_key).toBe(
        PASSWORD_REPLACEMENT
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
      expect(updated.credentialsFields.api_key).toBe(PASSWORD_REPLACEMENT)

      expect(
        passwordMatch(
          defaultRequest.credentialsFields!.api_key,
          (await getPersistedConfigAI(updated._id)).credentialsFields.api_key
        )
      ).toBeTrue()

      const storedConfig = await config.doInContext(
        config.getDevWorkspaceId(),
        async () => {
          return await context
            .getWorkspaceDB()
            .get<CustomAIProviderConfig>(created._id!)
        }
      )
      expect(
        passwordMatch(
          defaultRequest.credentialsFields!.api_key,
          storedConfig.credentialsFields.api_key
        )
      ).toBeTrue()

      const configsResponse = await config.api.ai.fetchConfigs()
      expect(configsResponse).toHaveLength(1)
      expect(configsResponse[0].name).toBe("Updated Chat")
      expect(configsResponse[0].credentialsFields.api_key).toBe(
        PASSWORD_REPLACEMENT
      )

      expect(
        passwordMatch(
          defaultRequest.credentialsFields!.api_key,
          (await getPersistedConfigAI(configsResponse[0]._id)).credentialsFields
            .api_key
        )
      ).toBeTrue()
    })

    it("preserves existing isDefault when omitted in update payload", async () => {
      const creationScope = nock(environment.LITELLM_URL)
        .post("/key/generate")
        .reply(200, { token_id: "key-default", key: "secret-default" })
        .post("/health/test_connection")
        .reply(200, { status: "success" })
        .post("/model/new")
        .reply(200, { model_id: "model-default" })
        .post("/key/update")
        .reply(200, { status: "success" })

      const created = await config.api.ai.createConfig({
        ...defaultRequest,
        isDefault: true,
      })
      expect(creationScope.isDone()).toBe(true)

      const { isDefault: _isDefault, ...updateWithoutIsDefault } = created
      const updated = await config.api.ai.updateConfig({
        ...updateWithoutIsDefault,
        name: "Updated Without Default Field",
      })

      expect(updated.isDefault).toBe(true)

      const persisted = await getPersistedConfigAI(updated._id)
      expect(persisted.isDefault).toBe(true)
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
      expect(
        passwordMatch(newWebSearchApiKey, storedConfig!.webSearchConfig!.apiKey)
      ).toBeTrue()
    })

    it("does not persist update changes when LiteLLM validation fails", async () => {
      const creationScope = nock(environment.LITELLM_URL)
        .post("/key/generate")
        .reply(200, { token_id: "key-validation-fail", key: "secret-vf" })
        .post("/health/test_connection")
        .reply(200, { status: "success" })
        .post("/model/new")
        .reply(200, { model_id: "model-validation-fail" })
        .post("/key/update")
        .reply(200, { status: "success" })

      const created = await config.api.ai.createConfig({
        ...defaultRequest,
        name: "Initial Config",
      })
      expect(creationScope.isDone()).toBe(true)

      const persistedBefore = await getPersistedConfigAI(created._id)

      const validationFailureScope = nock(environment.LITELLM_URL)
        .post("/health/test_connection")
        .reply(200, {
          status: "error",
          result: { error: "invalid credentials" },
        })

      const errorResponse: any = await config.api.ai.updateConfig(
        {
          ...created,
          name: "Updated Config",
          model: "gpt-4.1",
          credentialsFields: {
            ...created.credentialsFields,
            api_key: PASSWORD_REPLACEMENT,
          },
        },
        {
          status: 400,
        }
      )

      expect(validationFailureScope.isDone()).toBe(true)
      expect(errorResponse.message).toBe(
        "Error validating configuration: invalid credentials"
      )

      const persistedAfter = await getPersistedConfigAI(created._id)
      expect(persistedAfter._rev).toBe(persistedBefore._rev)
      expect(persistedAfter.name).toBe("Initial Config")
      expect(persistedAfter.model).toBe(defaultRequest.model)
    })

    it("rolls back update when LiteLLM model update fails", async () => {
      const creationScope = nock(environment.LITELLM_URL)
        .post("/key/generate")
        .reply(200, { token_id: "key-update-fail", key: "secret-uf" })
        .post("/health/test_connection")
        .reply(200, { status: "success" })
        .post("/model/new")
        .reply(200, { model_id: "model-update-fail" })
        .post("/key/update")
        .reply(200, { status: "success" })

      const created = await config.api.ai.createConfig({
        ...defaultRequest,
        name: "Initial Config",
      })
      expect(creationScope.isDone()).toBe(true)

      const persistedBefore = await getPersistedConfigAI(created._id)

      const updateFailureScope = nock(environment.LITELLM_URL)
        .post("/health/test_connection")
        .reply(200, { status: "success" })
        .patch(`/model/${created.liteLLMModelId}/update`)
        .reply(200, {
          status: "error",
          result: { error: "litellm unavailable" },
        })

      const errorResponse: any = await config.api.ai.updateConfig(
        {
          ...created,
          name: "Updated Config",
          model: "gpt-4.1",
          credentialsFields: {
            ...created.credentialsFields,
            api_key: PASSWORD_REPLACEMENT,
          },
        },
        {
          status: 400,
        }
      )

      expect(updateFailureScope.isDone()).toBe(true)
      expect(errorResponse.message).toBe(
        "Error updating configuration: litellm unavailable"
      )

      const persistedAfter = await getPersistedConfigAI(created._id)
      expect(persistedAfter.name).toBe(persistedBefore.name)
      expect(persistedAfter.model).toBe(persistedBefore.model)
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

    it("validates wrong configuration", async () => {
      const failingScope = nock(environment.LITELLM_URL)
        .post("/health/test_connection")
        .reply(200, {
          status: "error",
          result: {
            error:
              'OpenrouterException - {"error":{"message":"qwen/qwen3-3 is not a valid model ID","code":400},"user_id":"org_37yduZHaFSi1UlK66P4A04N0jd2"}',
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
      expect(errorResponse.message).toEqual(
        'Error validating configuration: OpenrouterException - {"error":{"message":"qwen/qwen3-3 is not a valid model ID","code":400},"user_id":"org_37yduZHaFSi1UlK66P4A04N0jd2"}'
      )

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
      expect(
        passwordMatch(webSearchApiKey, storedConfig!.webSearchConfig!.apiKey)
      ).toBeTrue()
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
      mockLiteLLMTeam()
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
      expect(created.credentialsFields.api_key).toBe(PASSWORD_REPLACEMENT)
      expect(
        passwordMatch(
          defaultEmbeddingRequest.credentialsFields.api_key,
          (await getPersistedConfigAI(created._id)).credentialsFields.api_key
        )
      ).toBeTrue()

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

  describe("workspace-specific LiteLLM key", () => {
    const defaultRequest: CreateAIConfigRequest = {
      name: "Test Config",
      provider: "OpenAI",
      model: "gpt-4o-mini",
      credentialsFields: {
        api_key: "sk-test-key",
        api_base: "https://api.openai.com",
      },
      configType: AIConfigType.COMPLETIONS,
    }

    beforeEach(async () => {
      await config.newTenant()
      nock.cleanAll()
      mockLiteLLMProviders()
      mockLiteLLMTeam()
    })

    async function getLiteLLMKeyDoc(): Promise<LiteLLMKeyConfig | undefined> {
      return await config.doInContext(config.getDevWorkspaceId(), async () => {
        const keyDocId = docIds.getLiteLLMKeyID()
        return await context.getWorkspaceDB().tryGet<LiteLLMKeyConfig>(keyDocId)
      })
    }

    it("creates a LiteLLM key document in the workspace DB", async () => {
      nock(environment.LITELLM_URL)
        .post("/key/generate")
        .reply(200, { token_id: "workspace-key-1", key: "workspace-secret-1" })
        .post("/health/test_connection")
        .reply(200, { status: "success" })
        .post("/model/new")
        .reply(200, { model_id: "model-1" })
        .post("/key/update")
        .reply(200, { status: "success" })

      await config.api.ai.createConfig({ ...defaultRequest })

      const keyDoc = await getLiteLLMKeyDoc()
      expect(keyDoc).toBeDefined()
      expect(keyDoc?.keyId).toBe("workspace-key-1")
      expect(keyDoc?.secretKey).toBe("workspace-secret-1")
    })

    it("reuses the same key when creating multiple configs", async () => {
      const keyGenerateScope = nock(environment.LITELLM_URL)
        .post("/key/generate")
        .once()
        .reply(200, { token_id: "reused-key", key: "reused-secret" })

      nock(environment.LITELLM_URL)
        .post("/health/test_connection")
        .twice()
        .reply(200, { status: "success" })
        .post("/model/new")
        .twice()
        .reply(200, { model_id: "model-reuse" })
        .post("/key/update")
        .twice()
        .reply(200, { status: "success" })

      await config.api.ai.createConfig({ ...defaultRequest, name: "Config 1" })
      await config.api.ai.createConfig({ ...defaultRequest, name: "Config 2" })

      expect(keyGenerateScope.isDone()).toBe(true)

      const keyDoc = await getLiteLLMKeyDoc()
      expect(keyDoc?.keyId).toBe("reused-key")
    })

    it("uses the prod workspace ID as the key alias", async () => {
      const expectedAlias = config.getProdWorkspaceId()

      const keyGenerateScope = nock(environment.LITELLM_URL)
        .post("/key/generate", body => {
          expect(body.key_alias).toBe(expectedAlias)
          return true
        })
        .reply(200, { token_id: "alias-key", key: "alias-secret" })

      nock(environment.LITELLM_URL)
        .post("/health/test_connection")
        .reply(200, { status: "success" })
        .post("/model/new")
        .reply(200, { model_id: "model-alias" })
        .post("/key/update")
        .reply(200, { status: "success" })

      await config.api.ai.createConfig({ ...defaultRequest })

      expect(keyGenerateScope.isDone()).toBe(true)
    })

    it("creates a team per tenant and assigns keys to it", async () => {
      nock.cleanAll()
      mockLiteLLMProviders()
      const expectedTeamAlias = `budibase-tenant-${config.getTenantId()}`
      const expectedKeyAlias = config.getProdWorkspaceId()

      const teamScope = nock(environment.LITELLM_URL)
        .post("/team/new", body => {
          expect(body.team_alias).toBe(expectedTeamAlias)
          return true
        })
        .reply(200, { team_id: "tenant-team-1" })

      const keyScope = nock(environment.LITELLM_URL)
        .post("/key/generate", body => {
          expect(body.key_alias).toBe(expectedKeyAlias)
          expect(body.team_id).toBe("tenant-team-1")
          return true
        })
        .reply(200, { token_id: "team-key-1", key: "team-secret-1" })

      nock(environment.LITELLM_URL)
        .post("/health/test_connection")
        .reply(200, { status: "success" })
        .post("/model/new")
        .reply(200, { model_id: "model-team-1" })
        .post("/key/update")
        .reply(200, { status: "success" })

      await config.api.ai.createConfig({ ...defaultRequest })

      expect(teamScope.isDone()).toBe(true)
      expect(keyScope.isDone()).toBe(true)

      const keyDoc = await getLiteLLMKeyDoc()
      expect(keyDoc?.teamId).toBe("tenant-team-1")
    })

    it("backfills team on existing keys without rotating the key", async () => {
      nock.cleanAll()
      mockLiteLLMProviders()

      const existingKeyId = "legacy-key-id"
      const existingSecret = "legacy-secret-key"
      const expectedTeamAlias = `budibase-tenant-${config.getTenantId()}`

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const keyDocId = docIds.getLiteLLMKeyID()
        await context.getWorkspaceDB().put<LiteLLMKeyConfig>({
          _id: keyDocId,
          keyId: existingKeyId,
          secretKey: existingSecret,
          teamId: undefined as any, // Force missing values
        })
      })

      const teamScope = nock(environment.LITELLM_URL)
        .post("/team/new", body => {
          expect(body.team_alias).toBe(expectedTeamAlias)
          return true
        })
        .reply(200, { team_id: "tenant-team-backfill" })

      const assignTeamScope = nock(environment.LITELLM_URL)
        .post("/key/update", body => {
          expect(body.key).toBe(existingKeyId)
          expect(body.team_id).toBe("tenant-team-backfill")
          expect(body.models).toBeUndefined()
          return true
        })
        .reply(200, { status: "success" })

      nock(environment.LITELLM_URL)
        .post("/health/test_connection")
        .reply(200, { status: "success" })
        .post("/model/new")
        .reply(200, { model_id: "model-backfill-1" })

      const syncModelsScope = nock(environment.LITELLM_URL)
        .post("/key/update", body => {
          expect(body.key).toBe(existingKeyId)
          expect(body.models).toContain("model-backfill-1")
          return true
        })
        .reply(200, { status: "success" })

      await config.api.ai.createConfig({ ...defaultRequest })

      expect(teamScope.isDone()).toBe(true)
      expect(assignTeamScope.isDone()).toBe(true)
      expect(syncModelsScope.isDone()).toBe(true)

      const keyDoc = await getLiteLLMKeyDoc()
      expect(keyDoc?.keyId).toBe(existingKeyId)
      expect(keyDoc?.secretKey).toBe(existingSecret)
      expect(keyDoc?.teamId).toBe("tenant-team-backfill")
    })

    it("syncs the key with model IDs from the workspace", async () => {
      nock(environment.LITELLM_URL)
        .post("/key/generate")
        .reply(200, { token_id: "sync-key", key: "sync-secret" })
        .post("/health/test_connection")
        .reply(200, { status: "success" })
        .post("/model/new")
        .reply(200, { model_id: "sync-model-1" })

      const keyUpdateScope = nock(environment.LITELLM_URL)
        .post("/key/update", body => {
          expect(body.key).toBe("sync-key")
          expect(body.models).toContain("sync-model-1")
          return true
        })
        .reply(200, { status: "success" })

      await config.api.ai.createConfig({ ...defaultRequest })

      expect(keyUpdateScope.isDone()).toBe(true)
    })
  })
})
