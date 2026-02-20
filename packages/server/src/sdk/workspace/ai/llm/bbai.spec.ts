import { quotas } from "@budibase/pro"
import {
  mockChatGPTResponse,
  mockChatGPTStreamResponse,
} from "../../../../tests/utilities/mocks/ai/openai"
import { resetHttpMocking } from "../../../../tests/jestEnv"
import { withEnv } from "../../../../environment"
import { createBBAIClient } from "./bbai"

jest.mock("@budibase/types", () => {
  const actual = jest.requireActual("@budibase/types")
  return {
    ...actual,
    BUDIBASE_AI_MODEL_MAP: {
      ...actual.BUDIBASE_AI_MODEL_MAP,
      "budibase/gpt-5-mini": {
        provider: "openai",
        model: "gpt-5-mini",
      },
    },
  }
})

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
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  beforeEach(async () => {
    await resetHttpMocking()
  })

  it("rejects unsupported models", async () => {
    await expect(createBBAIClient("unsupported-model")).rejects.toMatchObject({
      status: 400,
    })
  })

  it("increments credits for generate calls", async () => {
    mockChatGPTResponse("hello world")

    await withEnv(
      {
        BBAI_LITELLM_KEY: "sk-test-key",
      },
      async () => {
        const { chat } = await createBBAIClient("budibase/v1")
        await chat.doGenerate({
          prompt: [
            {
              role: "user",
              content: [{ type: "text", text: "hello" }],
            },
          ],
        })
      }
    )

    expect(incrementCreditsMock).toHaveBeenCalledTimes(1)
    expect(incrementCreditsMock).toHaveBeenCalledWith(7)
  })

  it("increments credits for stream calls", async () => {
    mockChatGPTStreamResponse("Hello user. How are you today?")

    await withEnv(
      {
        BBAI_LITELLM_KEY: "sk-test-key",
      },
      async () => {
        const { chat } = await createBBAIClient("budibase/v1")
        const result = await chat.doStream({
          prompt: [
            {
              role: "user",
              content: [{ type: "text", text: "hi bbai!" }],
            },
          ],
        })

        const reader = result.stream.getReader()

        for (
          let next = await reader.read();
          !next.done;
          next = await reader.read()
        ) {
          // Read all stream
        }
        reader.releaseLock()
      }
    )

    expect(incrementCreditsMock).toHaveBeenCalledTimes(1)
    expect(incrementCreditsMock).toHaveBeenCalledWith(20)
  })

  it("increments credits for OpenAI models", async () => {
    mockChatGPTResponse("hello world")

    await withEnv(
      {
        BBAI_LITELLM_KEY: "sk-test-key",
      },
      async () => {
        const { chat } = await createBBAIClient("budibase/gpt-5-mini")
        await chat.doGenerate({
          prompt: [
            {
              role: "user",
              content: [{ type: "text", text: "hello" }],
            },
          ],
        })
      }
    )

    expect(incrementCreditsMock).toHaveBeenCalledTimes(1)
    expect(incrementCreditsMock).toHaveBeenCalledWith(7)
  })
})
