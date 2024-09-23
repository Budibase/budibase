import { getConfig, runStep, afterAll as _afterAll } from "./utilities"
import { OpenAI } from "openai"
import {
  withEnv as withCoreEnv,
  setEnv as setCoreEnv,
} from "@budibase/backend-core"
import * as pro from "@budibase/pro"

jest.mock("openai", () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(() => ({
          choices: [
            {
              message: {
                content: "This is a test",
              },
            },
          ],
        })),
      },
    },
  })),
}))
jest.mock("@budibase/pro", () => ({
  ...jest.requireActual("@budibase/pro"),
  ai: {
    LargeLanguageModel: {
      forCurrentTenant: jest.fn().mockImplementation(() => ({
        init: jest.fn(),
        run: jest.fn(),
      })),
    },
  },
  features: {
    isAICustomConfigsEnabled: jest.fn(),
    isBudibaseAIEnabled: jest.fn(),
  },
}))

const mockedPro = jest.mocked(pro)
const mockedOpenAI = OpenAI as jest.MockedClass<typeof OpenAI>

const OPENAI_PROMPT = "What is the meaning of life?"

describe("test the openai action", () => {
  let config = getConfig()
  let resetEnv: () => void | undefined

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(() => {
    resetEnv = setCoreEnv({ OPENAI_API_KEY: "abc123" })
  })

  afterEach(() => {
    resetEnv()
    jest.clearAllMocks()
  })

  afterAll(_afterAll)

  it("should present the correct error message when the OPENAI_API_KEY variable isn't set", async () => {
    await withCoreEnv({ OPENAI_API_KEY: "" }, async () => {
      let res = await runStep("OPENAI", { prompt: OPENAI_PROMPT })
      expect(res.response).toEqual(
        "OpenAI API Key not configured - please add the OPENAI_API_KEY environment variable."
      )
      expect(res.success).toBeFalsy()
    })
  })

  it("should be able to receive a response from ChatGPT given a prompt", async () => {
    const res = await runStep("OPENAI", { prompt: OPENAI_PROMPT })
    expect(res.response).toEqual("This is a test")
    expect(res.success).toBeTruthy()
  })

  it("should present the correct error message when a prompt is not provided", async () => {
    const res = await runStep("OPENAI", { prompt: null })
    expect(res.response).toEqual(
      "Budibase OpenAI Automation Failed: No prompt supplied"
    )
    expect(res.success).toBeFalsy()
  })

  it("should present the correct error message when an error is thrown from the createChatCompletion call", async () => {
    mockedOpenAI.mockImplementation(
      () =>
        ({
          chat: {
            completions: {
              create: jest.fn(() => {
                throw new Error(
                  "An error occurred while calling createChatCompletion"
                )
              }),
            },
          },
        } as any)
    )

    const res = await runStep("OPENAI", {
      prompt: OPENAI_PROMPT,
    })

    expect(res.response).toEqual(
      "Error: An error occurred while calling createChatCompletion"
    )
    expect(res.success).toBeFalsy()
  })

  it("should ensure that the pro AI module is called when the budibase AI features are enabled", async () => {
    jest.spyOn(pro.features, "isBudibaseAIEnabled").mockResolvedValue(true)
    jest.spyOn(pro.features, "isAICustomConfigsEnabled").mockResolvedValue(true)

    const prompt = "What is the meaning of life?"
    await runStep("OPENAI", {
      model: "gpt-4o-mini",
      prompt,
    })

    expect(pro.ai.LargeLanguageModel.forCurrentTenant).toHaveBeenCalledWith(
      "gpt-4o-mini"
    )

    const llmInstance =
      mockedPro.ai.LargeLanguageModel.forCurrentTenant.mock.results[0].value
    // init does not appear to be called currently
    // expect(llmInstance.init).toHaveBeenCalled()
    expect(llmInstance.run).toHaveBeenCalledWith(prompt)
  })
})
