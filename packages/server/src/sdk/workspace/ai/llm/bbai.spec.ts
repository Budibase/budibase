import { withEnv } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import { mockChatGPTResponse } from "../../../../tests/utilities/mocks/ai/openai"
import { createBBAIClient } from "./bbai"

jest.mock("@budibase/pro", () => {
  const actual = jest.requireActual("@budibase/pro")
  return {
    ...actual,
    quotas: {
      ...actual.quotas,
      incrementBudibaseAICredits: jest.fn(),
    },
  }
})

describe("createBBAIClient", () => {
  const incrementCreditsMock =
    quotas.incrementBudibaseAICredits as jest.MockedFunction<
      typeof quotas.incrementBudibaseAICredits
    >

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("rejects unsupported models", async () => {
    await expect(createBBAIClient("unsupported-model")).rejects.toMatchObject({
      status: 400,
    })
  })

  it("requires an OpenAI API key for OpenAI models", async () => {
    await withEnv({ BBAI_OPENAI_API_KEY: "" }, async () => {
      await expect(
        createBBAIClient("budibase/gpt-5-mini")
      ).rejects.toMatchObject({
        status: 500,
        message: "OPENAI API key not configured",
      })
    })
  })

  it("requires MISTRAL_BASE_URL for Mistral models", async () => {
    await withEnv(
      {
        BBAI_MISTRAL_API_KEY: "mistral-key",
        MISTRAL_BASE_URL: "",
      },
      async () => {
        await expect(
          createBBAIClient("budibase/mistral-small-latest")
        ).rejects.toMatchObject({
          status: 500,
          message: "MISTRAL_BASE_URL not configured",
        })
      }
    )
  })

  it("increments credits for generate calls", async () => {
    mockChatGPTResponse("hello world")

    await withEnv({ BBAI_OPENAI_API_KEY: "openai-key" }, async () => {
      const { chat } = await createBBAIClient("budibase/gpt-5-mini")
      await chat.doGenerate({
        prompt: [
          {
            role: "user",
            content: [{ type: "text", text: "hello" }],
          },
        ],
      })
    })

    expect(incrementCreditsMock).toHaveBeenCalledTimes(1)
    expect(incrementCreditsMock).toHaveBeenCalledWith(7)
  })
})
