import AnthropicClient from "@anthropic-ai/sdk"
import { Anthropic } from "../models/anthropic"

let createMessageMock = jest.fn()

jest.mock("@anthropic-ai/sdk", () => {
  return jest.fn().mockImplementation(() => ({
    messages: { create: createMessageMock },
  }))
})

describe("Anthropic", () => {
  const apiKey = "test-api-key"
  const model = "claude-3-5-sonnet-20240620"

  let anthropic: Anthropic

  beforeEach(() => {
    anthropic = new Anthropic({ model, apiKey })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("constructor", () => {
    it("should initialize with model and anthropic client", () => {
      expect(anthropic).toBeDefined()
      expect(anthropic.model).toBe(model)
      expect(AnthropicClient).toHaveBeenCalledWith({ apiKey })
    })
  })

  describe("chatCompletion", () => {
    it("should return prompt completion response when API call is successful", async () => {
      const prompt = "Tell me a joke"
      const response = { content: [{ text: "Here is a joke." }] }

      createMessageMock.mockResolvedValueOnce(response)

      const result = await anthropic.prompt(prompt)

      expect(createMessageMock).toHaveBeenCalledWith({
        model: model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      })
      expect(result).toEqual({ message: "Here is a joke." })
    })

    it("Should re-throw the error if the completion throws", async () => {
      const prompt = "Tell me a joke"
      createMessageMock.mockRejectedValueOnce({})
      await expect(anthropic.chatCompletion(prompt)).rejects.toThrow()
    })
  })
})
