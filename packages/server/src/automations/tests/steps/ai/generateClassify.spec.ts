import { ContentType } from "@budibase/types"
import { run as classify } from "../../../steps/ai/classify"
import { run as generate } from "../../../steps/ai/generate"
import { promptWithDefaultLLM } from "../../../steps/ai/llm"

jest.mock("../../../steps/ai/llm", () => ({
  promptWithDefaultLLM: jest.fn(),
}))

const mockPromptWithDefaultLLM = promptWithDefaultLLM as jest.Mock

describe("AI generate and classify steps", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("generate", () => {
    it("requires content type and instructions", async () => {
      const result = await generate({
        inputs: {
          contentType: "",
          instructions: "",
        },
      })

      expect(result).toEqual({
        success: false,
        response:
          "Generate Text AI Step Failed: Content Type and Instructions are required.",
      })
      expect(mockPromptWithDefaultLLM).not.toHaveBeenCalled()
    })

    it.each([
      ContentType.EMAIL,
      ContentType.DOCUMENT,
      ContentType.BLOG_POST,
      ContentType.CHAT_MESSAGE,
      ContentType.LETTER,
      ContentType.PROPOSAL,
      ContentType.OTHER,
    ])("generates content for %s", async contentType => {
      mockPromptWithDefaultLLM.mockResolvedValue(" Generated content ")

      const result = await generate({
        inputs: {
          contentType,
          instructions: "Write something useful",
        },
      })

      expect(result).toEqual({
        success: true,
        response: "Generated content",
      })
      expect(mockPromptWithDefaultLLM).toHaveBeenCalledTimes(1)
    })

    it("reports empty LLM responses", async () => {
      mockPromptWithDefaultLLM.mockResolvedValue("   ")

      const result = await generate({
        inputs: {
          contentType: ContentType.OTHER,
          instructions: "Write something useful",
        },
      })

      expect(result).toEqual({
        success: false,
        response:
          "Generate Text AI Step Failed: AI did not return any content.",
      })
    })

    it("reports LLM errors", async () => {
      mockPromptWithDefaultLLM.mockRejectedValue(new Error("AI unavailable"))

      const result = await generate({
        inputs: {
          contentType: ContentType.OTHER,
          instructions: "Write something useful",
        },
      })

      expect(result).toEqual({
        success: false,
        response: "Error: AI unavailable",
      })
    })
  })

  describe("classify", () => {
    it("requires text input and categories", async () => {
      const result = await classify({
        inputs: {
          inputType: "text",
          textInput: "",
          categoryItems: [],
        },
      })

      expect(result).toEqual({
        success: false,
        response:
          "Classify Text AI Step Failed: Text Input and Categories (non-empty) are required.",
      })
      expect(mockPromptWithDefaultLLM).not.toHaveBeenCalled()
    })

    it("returns the matched category", async () => {
      mockPromptWithDefaultLLM.mockResolvedValue(" Support ")

      const result = await classify({
        inputs: {
          inputType: "text",
          textInput: "I need help",
          categoryItems: [{ category: "Sales" }, { category: "Support" }],
        },
      })

      expect(result).toEqual({
        success: true,
        category: "Support",
        response: "Support",
      })
    })

    it("reports categories outside the provided list", async () => {
      mockPromptWithDefaultLLM.mockResolvedValue("Billing")

      const result = await classify({
        inputs: {
          inputType: "text",
          textInput: "I need help",
          categoryItems: [{ category: "Sales" }, { category: "Support" }],
        },
      })

      expect(result.success).toEqual(false)
      expect(result.response).toContain("AI returned category 'Billing'")
      expect(result.response).toContain("[Sales, Support]")
    })

    it("reports empty LLM responses", async () => {
      mockPromptWithDefaultLLM.mockResolvedValue("")

      const result = await classify({
        inputs: {
          inputType: "text",
          textInput: "I need help",
          categoryItems: [{ category: "Sales" }],
        },
      })

      expect(result).toEqual({
        success: false,
        response: "Classify Text AI Step Failed: AI did not return a category.",
      })
    })

    it("reports LLM errors", async () => {
      mockPromptWithDefaultLLM.mockRejectedValue(new Error("AI unavailable"))

      const result = await classify({
        inputs: {
          inputType: "text",
          textInput: "I need help",
          categoryItems: [{ category: "Sales" }],
        },
      })

      expect(result).toEqual({
        success: false,
        response: "Error: AI unavailable",
      })
    })
  })
})
