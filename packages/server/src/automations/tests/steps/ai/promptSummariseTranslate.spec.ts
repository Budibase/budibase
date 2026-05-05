import { run as promptLLM } from "../../../steps/ai/promptLLM"
import { run as summarise } from "../../../steps/ai/summarise"
import { run as translate } from "../../../steps/ai/translate"
import { promptWithDefaultLLM } from "../../../steps/ai/llm"

jest.mock("../../../steps/ai/llm", () => ({
  promptWithDefaultLLM: jest.fn(),
}))

const mockPromptWithDefaultLLM = promptWithDefaultLLM as jest.Mock

describe("AI prompt, summarise and translate steps", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("promptLLM", () => {
    it("requires a prompt", async () => {
      const result = await promptLLM({
        inputs: {
          prompt: null as unknown as string,
        },
      })

      expect(result).toEqual({
        success: false,
        response: "No prompt supplied",
      })
      expect(mockPromptWithDefaultLLM).not.toHaveBeenCalled()
    })

    it("returns the LLM response", async () => {
      mockPromptWithDefaultLLM.mockResolvedValue("LLM response")

      const result = await promptLLM({
        inputs: {
          prompt: "Say hello",
        },
      })

      expect(result).toEqual({
        success: true,
        response: "LLM response",
      })
    })

    it("reports LLM errors", async () => {
      mockPromptWithDefaultLLM.mockRejectedValue(new Error("LLM failed"))

      const result = await promptLLM({
        inputs: {
          prompt: "Say hello",
        },
      })

      expect(result).toEqual({
        success: false,
        response: "Error: LLM failed",
      })
    })
  })

  describe("summarise", () => {
    it("requires text", async () => {
      const result = await summarise({
        inputs: {
          text: null as unknown as string,
        },
      })

      expect(result).toEqual({
        success: false,
        response: "No text supplied",
      })
      expect(mockPromptWithDefaultLLM).not.toHaveBeenCalled()
    })

    it("returns the LLM response", async () => {
      mockPromptWithDefaultLLM.mockResolvedValue("Summary")

      const result = await summarise({
        inputs: {
          text: "Long text",
        },
      })

      expect(result).toEqual({
        success: true,
        response: "Summary",
      })
    })

    it("reports LLM errors", async () => {
      mockPromptWithDefaultLLM.mockRejectedValue(new Error("LLM failed"))

      const result = await summarise({
        inputs: {
          text: "Long text",
        },
      })

      expect(result).toEqual({
        success: false,
        response: "Error: LLM failed",
      })
    })
  })

  describe("translate", () => {
    it("requires text and language", async () => {
      const result = await translate({
        inputs: {
          text: "Hello",
          language: null as unknown as string,
        },
      })

      expect(result).toEqual({
        success: false,
        response: "No text or language supplied",
      })
      expect(mockPromptWithDefaultLLM).not.toHaveBeenCalled()
    })

    it("returns the LLM response", async () => {
      mockPromptWithDefaultLLM.mockResolvedValue("Bonjour")

      const result = await translate({
        inputs: {
          text: "Hello",
          language: "French",
        },
      })

      expect(result).toEqual({
        success: true,
        response: "Bonjour",
      })
    })

    it("reports LLM errors", async () => {
      mockPromptWithDefaultLLM.mockRejectedValue(new Error("LLM failed"))

      const result = await translate({
        inputs: {
          text: "Hello",
          language: "French",
        },
      })

      expect(result).toEqual({
        success: false,
        response: "Error: LLM failed",
      })
    })
  })
})
