import { promptWithDefaultLLM } from "../../../steps/ai/llm"
import { Model } from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { createAutomationBuilder } from "../../utilities/AutomationTestBuilder"

jest.mock("../../../steps/ai/llm", () => ({
  promptWithDefaultLLM: jest.fn(),
}))

const mockPromptWithDefaultLLM = promptWithDefaultLLM as jest.Mock

describe("AI prompt, summarise and translate steps", () => {
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

  describe("promptLLM", () => {
    it("requires a prompt", async () => {
      const result = await createAutomationBuilder(config)
        .onAppAction()
        .promptLLM({
          prompt: null as unknown as string,
          model: Model.GPT_4O_MINI,
        })
        .test({ fields: {} })

      expect(result.steps[0].outputs).toEqual({
        success: false,
        response: "No prompt supplied",
      })
      expect(mockPromptWithDefaultLLM).not.toHaveBeenCalled()
    })

    it("returns the LLM response", async () => {
      mockPromptWithDefaultLLM.mockResolvedValue("LLM response")

      const result = await createAutomationBuilder(config)
        .onAppAction()
        .promptLLM({
          prompt: "Say hello",
          model: Model.GPT_4O_MINI,
        })
        .test({ fields: {} })

      expect(result.steps[0].outputs).toEqual({
        success: true,
        response: "LLM response",
      })
    })

    it("reports LLM errors", async () => {
      mockPromptWithDefaultLLM.mockRejectedValue(new Error("LLM failed"))

      const result = await createAutomationBuilder(config)
        .onAppAction()
        .promptLLM({
          prompt: "Say hello",
          model: Model.GPT_4O_MINI,
        })
        .test({ fields: {} })

      expect(result.steps[0].outputs).toEqual({
        success: false,
        response: "Error: LLM failed",
      })
    })
  })

  describe("summarise", () => {
    it("requires text", async () => {
      const result = await createAutomationBuilder(config)
        .onAppAction()
        .summarise({
          text: null as unknown as string,
        })
        .test({ fields: {} })

      expect(result.steps[0].outputs).toEqual({
        success: false,
        response: "No text supplied",
      })
      expect(mockPromptWithDefaultLLM).not.toHaveBeenCalled()
    })

    it("returns the LLM response", async () => {
      mockPromptWithDefaultLLM.mockResolvedValue("Summary")

      const result = await createAutomationBuilder(config)
        .onAppAction()
        .summarise({
          text: "Long text",
        })
        .test({ fields: {} })

      expect(result.steps[0].outputs).toEqual({
        success: true,
        response: "Summary",
      })
    })

    it("reports LLM errors", async () => {
      mockPromptWithDefaultLLM.mockRejectedValue(new Error("LLM failed"))

      const result = await createAutomationBuilder(config)
        .onAppAction()
        .summarise({
          text: "Long text",
        })
        .test({ fields: {} })

      expect(result.steps[0].outputs).toEqual({
        success: false,
        response: "Error: LLM failed",
      })
    })
  })

  describe("translate", () => {
    it("requires text and language", async () => {
      const result = await createAutomationBuilder(config)
        .onAppAction()
        .translate({
          text: "Hello",
          language: null as unknown as string,
        })
        .test({ fields: {} })

      expect(result.steps[0].outputs).toEqual({
        success: false,
        response: "No text or language supplied",
      })
      expect(mockPromptWithDefaultLLM).not.toHaveBeenCalled()
    })

    it("returns the LLM response", async () => {
      mockPromptWithDefaultLLM.mockResolvedValue("Bonjour")

      const result = await createAutomationBuilder(config)
        .onAppAction()
        .translate({
          text: "Hello",
          language: "French",
        })
        .test({ fields: {} })

      expect(result.steps[0].outputs).toEqual({
        success: true,
        response: "Bonjour",
      })
    })

    it("reports LLM errors", async () => {
      mockPromptWithDefaultLLM.mockRejectedValue(new Error("LLM failed"))

      const result = await createAutomationBuilder(config)
        .onAppAction()
        .translate({
          text: "Hello",
          language: "French",
        })
        .test({ fields: {} })

      expect(result.steps[0].outputs).toEqual({
        success: false,
        response: "Error: LLM failed",
      })
    })
  })
})
