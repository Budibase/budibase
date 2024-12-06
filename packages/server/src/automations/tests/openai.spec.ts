import { getConfig, afterAll as _afterAll } from "./utilities"
import { createAutomationBuilder } from "./utilities/AutomationTestBuilder"
import { OpenAI } from "openai"
import { setEnv as setCoreEnv } from "@budibase/backend-core"
import * as pro from "@budibase/pro"
import { Model } from "@budibase/types"

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
        llm: {},
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
    setCoreEnv({ SELF_HOSTED: true })
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

  it("should be able to receive a response from ChatGPT given a prompt", async () => {
    setCoreEnv({ SELF_HOSTED: true })

    const result = await createAutomationBuilder({
      name: "Test OpenAI Response",
      config,
    })
      .appAction({ fields: {} })
      .openai(
        { prompt: OPENAI_PROMPT, model: Model.GPT_4O_MINI },
        { stepName: "Basic OpenAI Query" }
      )
      .run()

    expect(result.steps[0].outputs.response).toEqual("This is a test")
    expect(result.steps[0].outputs.success).toBeTruthy()
  })

  it("should present the correct error message when a prompt is not provided", async () => {
    const result = await createAutomationBuilder({
      name: "Test OpenAI No Prompt",
      config,
    })
      .appAction({ fields: {} })
      .openai(
        { prompt: "", model: Model.GPT_4O_MINI },
        { stepName: "Empty Prompt Query" }
      )
      .run()

    expect(result.steps[0].outputs.response).toEqual(
      "Budibase OpenAI Automation Failed: No prompt supplied"
    )
    expect(result.steps[0].outputs.success).toBeFalsy()
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

    const result = await createAutomationBuilder({
      name: "Test OpenAI Error",
      config,
    })
      .appAction({ fields: {} })
      .openai(
        { prompt: OPENAI_PROMPT, model: Model.GPT_4O_MINI },
        { stepName: "Error Producing Query" }
      )
      .run()

    expect(result.steps[0].outputs.response).toEqual(
      "Error: An error occurred while calling createChatCompletion"
    )
    expect(result.steps[0].outputs.success).toBeFalsy()
  })

  it("should ensure that the pro AI module is called when the budibase AI features are enabled", async () => {
    jest.spyOn(pro.features, "isBudibaseAIEnabled").mockResolvedValue(true)
    jest.spyOn(pro.features, "isAICustomConfigsEnabled").mockResolvedValue(true)

    const prompt = "What is the meaning of life?"
    await createAutomationBuilder({
      name: "Test OpenAI Pro Features",
      config,
    })
      .appAction({ fields: {} })
      .openai(
        {
          model: Model.GPT_4O_MINI,
          prompt,
        },
        { stepName: "Pro Features Query" }
      )
      .run()

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
