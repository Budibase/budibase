const setup = require("./utilities")
import environment from "../../environment"
import openai from "openai"

jest.mock(
  "openai",
  jest.fn(() => ({
    Configuration: jest.fn(),
    OpenAIApi: jest.fn(() => ({
      createChatCompletion: jest.fn(() => ({
        data: {
          choices: [
            {
              message: {
                content: "This is a test",
              },
            },
          ],
        },
      })),
    })),
  }))
)

const mockedOpenAIApi = openai.OpenAIApi as jest.MockedClass<
  typeof openai.OpenAIApi
>

const OPENAI_PROMPT = "What is the meaning of life?"

describe("test the openai action", () => {
  let config = setup.getConfig()

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(() => {
    environment.OPENAI_API_KEY = "abc123"
  })

  afterAll(setup.afterAll)

  it("should present the correct error message when the OPENAI_API_KEY variable isn't set", async () => {
    delete environment.OPENAI_API_KEY

    let res = await setup.runStep("OPENAI", {
      prompt: OPENAI_PROMPT,
    })
    expect(res.response).toEqual(
      "OpenAI API Key not configured - please add the OPENAI_API_KEY environment variable."
    )
    expect(res.success).toBeFalsy()
  })

  it("should be able to receive a response from ChatGPT given a prompt", async () => {
    const res = await setup.runStep("OPENAI", {
      prompt: OPENAI_PROMPT,
    })
    expect(res.response).toEqual("This is a test")
    expect(res.success).toBeTruthy()
  })

  it("should present the correct error message when a prompt is not provided", async () => {
    const res = await setup.runStep("OPENAI", {
      prompt: null,
    })
    expect(res.response).toEqual(
      "Budibase OpenAI Automation Failed: No prompt supplied"
    )
    expect(res.success).toBeFalsy()
  })

  it("should present the correct error message when an error is thrown from the createChatCompletion call", async () => {
    mockedOpenAIApi.mockImplementation(
      () =>
        ({
          createChatCompletion: jest.fn(() => {
            throw new Error(
              "An error occurred while calling createChatCompletion"
            )
          }),
        } as any)
    )

    const res = await setup.runStep("OPENAI", {
      prompt: OPENAI_PROMPT,
    })

    expect(res.response).toEqual(
      "Error: An error occurred while calling createChatCompletion"
    )
    expect(res.success).toBeFalsy()
  })
})
