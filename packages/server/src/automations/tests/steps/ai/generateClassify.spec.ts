import { ContentType } from "@budibase/types"
import { promptWithDefaultLLM } from "../../../steps/ai/llm"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { createAutomationBuilder } from "../../utilities/AutomationTestBuilder"

jest.mock("../../../steps/ai/llm", () => ({
  promptWithDefaultLLM: jest.fn(),
}))

const mockPromptWithDefaultLLM = promptWithDefaultLLM as jest.Mock

describe("AI generate and classify steps", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
    await config.api.automation.deleteAll()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    config.end()
  })

  describe("generate", () => {
    it("requires content type and instructions", async () => {
      const result = await createAutomationBuilder(config)
        .onAppAction()
        .generateText({
          contentType: "",
          instructions: "",
        })
        .test({ fields: {} })

      expect(result.steps[0].outputs).toEqual({
        success: false,
        response:
          "Generate Text AI Step Failed: Content Type and Instructions are required.",
      })
      expect(mockPromptWithDefaultLLM).not.toHaveBeenCalled()
    })

    it.each(Object.values(ContentType))(
      "generates content for %s",
      async contentType => {
        mockPromptWithDefaultLLM.mockResolvedValue(" Generated content ")

        const result = await createAutomationBuilder(config)
          .onAppAction()
          .generateText({
            contentType,
            instructions: "Write something useful",
          })
          .test({ fields: {} })

        expect(result.steps[0].outputs).toEqual({
          success: true,
          response: "Generated content",
        })
        expect(mockPromptWithDefaultLLM).toHaveBeenCalledTimes(1)
      }
    )

    it("reports empty LLM responses", async () => {
      mockPromptWithDefaultLLM.mockResolvedValue("   ")

      const result = await createAutomationBuilder(config)
        .onAppAction()
        .generateText({
          contentType: ContentType.OTHER,
          instructions: "Write something useful",
        })
        .test({ fields: {} })

      expect(result.steps[0].outputs).toEqual({
        success: false,
        response:
          "Generate Text AI Step Failed: AI did not return any content.",
      })
    })

    it("reports LLM errors", async () => {
      mockPromptWithDefaultLLM.mockRejectedValue(new Error("AI unavailable"))

      const result = await createAutomationBuilder(config)
        .onAppAction()
        .generateText({
          contentType: ContentType.OTHER,
          instructions: "Write something useful",
        })
        .test({ fields: {} })

      expect(result.steps[0].outputs).toEqual({
        success: false,
        response: "Error: AI unavailable",
      })
    })
  })

  describe("classify", () => {
    it("requires text input and categories", async () => {
      const result = await createAutomationBuilder(config)
        .onAppAction()
        .classify({
          inputType: "text",
          textInput: "",
          categoryItems: [],
        })
        .test({ fields: {} })

      expect(result.steps[0].outputs).toEqual({
        success: false,
        response:
          "Classify Text AI Step Failed: Text Input and Categories (non-empty) are required.",
      })
      expect(mockPromptWithDefaultLLM).not.toHaveBeenCalled()
    })

    it("returns the matched category", async () => {
      mockPromptWithDefaultLLM.mockResolvedValue(" Support ")

      const result = await createAutomationBuilder(config)
        .onAppAction()
        .classify({
          inputType: "text",
          textInput: "I need help",
          categoryItems: [{ category: "Sales" }, { category: "Support" }],
        })
        .test({ fields: {} })

      expect(result.steps[0].outputs).toEqual({
        success: true,
        category: "Support",
        response: "Support",
      })
    })

    it("reports categories outside the provided list", async () => {
      mockPromptWithDefaultLLM.mockResolvedValue("Billing")

      const result = await createAutomationBuilder(config)
        .onAppAction()
        .classify({
          inputType: "text",
          textInput: "I need help",
          categoryItems: [{ category: "Sales" }, { category: "Support" }],
        })
        .test({ fields: {} })

      expect(result.steps[0].outputs.success).toEqual(false)
      expect(result.steps[0].outputs.response).toContain(
        "AI returned category 'Billing'"
      )
      expect(result.steps[0].outputs.response).toContain("[Sales, Support]")
    })

    it("reports empty LLM responses", async () => {
      mockPromptWithDefaultLLM.mockResolvedValue("")

      const result = await createAutomationBuilder(config)
        .onAppAction()
        .classify({
          inputType: "text",
          textInput: "I need help",
          categoryItems: [{ category: "Sales" }],
        })
        .test({ fields: {} })

      expect(result.steps[0].outputs).toEqual({
        success: false,
        response: "Classify Text AI Step Failed: AI did not return a category.",
      })
    })

    it("reports LLM errors", async () => {
      mockPromptWithDefaultLLM.mockRejectedValue(new Error("AI unavailable"))

      const result = await createAutomationBuilder(config)
        .onAppAction()
        .classify({
          inputType: "text",
          textInput: "I need help",
          categoryItems: [{ category: "Sales" }],
        })
        .test({ fields: {} })

      expect(result.steps[0].outputs).toEqual({
        success: false,
        response: "Error: AI unavailable",
      })
    })
  })
})
