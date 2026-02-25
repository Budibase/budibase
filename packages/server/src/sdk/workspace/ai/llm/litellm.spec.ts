import { constants, withEnv } from "@budibase/backend-core"
import { generator } from "@budibase/backend-core/tests"
import { licensing, quotas } from "@budibase/pro"
import {
  AIConfigType,
  BUDIBASE_AI_PROVIDER_ID,
  CustomAIProviderConfig,
} from "@budibase/types"
import nock from "nock"
import { withEnv as serverWithEnv } from "../../../../environment"
import { mockChatGPTResponse } from "../../../../tests/utilities/mocks/ai/openai"
import { getKeySettings } from "../configs/litellm"
import { createLiteLLMOpenAI } from "./litellm"

jest.mock("../configs/litellm", () => ({
  getKeySettings: jest.fn(),
}))

jest.mock("@budibase/pro", () => {
  const actual = jest.requireActual("@budibase/pro")
  return {
    ...actual,
    quotas: {
      ...actual.quotas,
      setBudibaseAICredits: jest.fn(),
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
      teamId: "team-id",
    })

    mockChatGPTResponse("hello", {
      baseUrl: "http://litellm.local",
    })

    const monthlyCredits = generator.integer()
    const quotaNock = nock("https://budibase.app")
      .get("/api/ai/quotas")
      .matchHeader(constants.Header.LICENSE_KEY, "license-key")
      .reply(200, { monthlyCredits }, { "content-type": "application/json" })

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
        LITELLM_URL: "http://litellm.local/v1",
      },
      async () => {
        await withEnv(
          {
            SELF_HOSTED: true,
            BUDICLOUD_URL: "https://budibase.app",
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

    // Await to allow the background setBudibaseAICredits to execute
    await new Promise(r => setTimeout(r, 500))

    expect(quotaNock.isDone()).toBe(true)
    expect(setBudibaseAICreditsMock).toHaveBeenCalledTimes(1)
    expect(setBudibaseAICreditsMock).toHaveBeenCalledWith(monthlyCredits)
  })
})
