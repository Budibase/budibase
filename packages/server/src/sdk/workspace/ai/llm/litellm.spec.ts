import { constants, withEnv } from "@budibase/backend-core"
import { withEnv as serverWithEnv } from "../../../../environment"
import { quotas, licensing } from "@budibase/pro"
import {
  AIConfigType,
  BUDIBASE_AI_PROVIDER_ID,
  CustomAIProviderConfig,
} from "@budibase/types"
import { createLiteLLMOpenAI } from "./litellm"
import { getKeySettings } from "../configs/litellm"
import { mockChatGPTResponse } from "../../../../tests/utilities/mocks/ai/openai"
import nock from "nock"

jest.mock("../configs/litellm", () => ({
  getKeySettings: jest.fn(),
}))

jest.mock("@budibase/pro", () => {
  const actual = jest.requireActual("@budibase/pro")
  return {
    ...actual,
    quotas: {
      ...actual.quotas,
      incrementBudibaseAICredits: jest.fn(),
    },
    licensing: {
      ...actual.licensing,
      keys: {
        ...actual.licensing.keys,
        getLicenseKey: jest.fn(),
      },
    },
  }
})

describe("createLiteLLMOpenAI", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    nock.cleanAll()
  })

  it("syncs quota usage after BBAI responses in self host", async () => {
    const setBudibaseAICreditsMock =
      quotas.setBudibaseAICredits as jest.MockedFunction<
        typeof quotas.setBudibaseAICredits
      >
    const getLicenseKeyMock = licensing.keys
      .getLicenseKey as jest.MockedFunction<typeof licensing.keys.getLicenseKey>
    const getKeySettingsMock = getKeySettings as jest.MockedFunction<
      typeof getKeySettings
    >

    getLicenseKeyMock.mockResolvedValue("license-key")
    getKeySettingsMock.mockResolvedValue({
      keyId: "key-id",
      secretKey: "secret-key",
    })

    mockChatGPTResponse("hello", {
      baseUrl: "http://litellm.local",
    })

    nock("https://budibase.app")
      .get("/api/ai/quotas")
      .matchHeader(constants.Header.LICENSE_KEY, "license-key")
      .reply(
        200,
        { monthlyCredits: 10 },
        { "content-type": "application/json" }
      )

    const aiConfig: CustomAIProviderConfig = {
      _id: "config-1",
      name: "BBAI",
      provider: BUDIBASE_AI_PROVIDER_ID,
      model: "gpt-5-mini",
      configType: AIConfigType.COMPLETIONS,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      liteLLMModelId: "litellm-model-id",
      credentialsFields: {},
    }

    await serverWithEnv(
      {
        LITELLM_URL: "http://litellm.local",
      },
      async () => {
        await withEnv(
          {
            SELF_HOSTED: true,
            PLATFORM_URL: "http://localhost:10000",
          },
          async () => {
            const llm = await createLiteLLMOpenAI(aiConfig)
            await llm.chat.doGenerate({
              prompt: [
                {
                  role: "user",
                  content: [{ type: "text", text: "hello" }],
                },
              ],
            })
          }
        )
      }
    )

    expect(setBudibaseAICreditsMock).toHaveBeenCalledTimes(1)
    expect(setBudibaseAICreditsMock).toHaveBeenCalledWith(5)
  })
})
