import OpenAIClient from "openai"
import { OpenAI } from "../models/openai"

let createMessageMock = jest.fn()

jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: { create: createMessageMock },
    },
  }))
})

describe("OpenAI", () => {
  const apiKey = "test-api-key"
  const model = "gpt-4o-mini"

  let openai: OpenAI

  beforeEach(() => {
    openai = new OpenAI({ model, apiKey, measureUsage: true })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("constructor", () => {
    it("should initialize with model and openai client", () => {
      expect(openai).toBeDefined()
      expect(openai.model).toBe(model)
      expect(OpenAIClient).toHaveBeenCalledWith({ apiKey })
    })
  })

  describe("chatCompletion", () => {
    it("should return prompt completion response when API call is successful", async () => {
      const prompt = "Tell me a joke"
      const response = {
        choices: [{ message: { content: "Here is a joke." } }],
      }

      createMessageMock.mockResolvedValueOnce(response)

      const result = await openai.prompt(prompt)

      expect(createMessageMock).toHaveBeenCalledWith({
        model: model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      })
      expect(result).toEqual({ message: "Here is a joke.", tokensUsed: 0 })
    })

    it("Should re-throw the error if the completion throws", async () => {
      const prompt = "Tell me a joke"
      createMessageMock.mockRejectedValueOnce({})
      await expect(openai.chatCompletion(prompt)).rejects.toThrow()
    })
  })

  describe("Token usage", () => {
    it("Should calculate the number of tokens correctly based on the OpenAI API usage", async () => {
      const prompt = "Tell me a joke"
      const response = {
        choices: [{ message: { content: "Here is a joke." } }],
        usage: {
          prompt_tokens: 100,
          completion_tokens: 100,
        },
      }

      createMessageMock.mockResolvedValueOnce(response)

      const result = await openai.prompt(prompt)
      expect(result).toEqual({ message: "Here is a joke.", tokensUsed: 400 })
    })
  })
})
